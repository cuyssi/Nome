# ──────────────────────────────────────────────────────────────────────────────
# Módulo de programación y envío de notificaciones push.
# - cancelar_timer_existente(task) → Cancela el timer activo asociado a una tarea.
# - reprogram_if_repeating(task) → Calcula la próxima fecha si la tarea es repetitiva y la reprograma.
# - notify_device(task) → Envía la notificación push al dispositivo y gestiona la reprogramación o eliminación.
# - schedule_notification(task) → Programa una tarea con su timer, y opcionalmente una notificación anticipada.
#     • Calcula el delay en segundos.
#     • Crea un threading.Timer para ejecutar notify_device.
#     • Si notifyDayBefore está activo, programa una notificación adicional el día anterior.
# ──────────────────────────────────────────────────────────────────────────────

from dateutil.parser import isoparse
from datetime import datetime, timedelta
from services.notifications.utils import calcular_delay
from services.notifications.push import send_push_notification
from services.notifications.storage import save_data
import threading
import asyncio

from api.notifications.subscriptions import (
    subscriptions,
    scheduled_tasks,
    active_timers,
    task_lock,
)


def cancelar_timer_existente(task):
    with task_lock:
        for timer in list(active_timers):
            if timer.args and isinstance(timer.args[0], dict):
                t = timer.args[0]
                if t["id"] == task.get("id") and t["deviceId"] == task.get("deviceId"):
                    timer.cancel()
                    active_timers.remove(timer)
                    print("\033[95m🛑 Cancelando timers\033[0m")
                    break


def reprogram_if_repeating(task):
    repeat = task.get("repeat") or "once"
    current_dt = isoparse(task["dateTime"])
    next_dt = None

    if task.get("type") == "bag":
        next_dt = current_dt + timedelta(days=1)

    elif repeat == "daily":
        next_dt = current_dt + timedelta(days=1)

    elif repeat == "weekdays":
        next_dt = current_dt + timedelta(days=1)
        while next_dt.weekday() > 4:
            next_dt += timedelta(days=1)

    elif repeat == "weekend":
        next_dt = current_dt + timedelta(days=1)
        while next_dt.weekday() < 4:
            next_dt += timedelta(days=1)

    elif repeat == "custom":
        custom_days = task.get("customDays", [])
        if not custom_days:
            return False
        next_dt = current_dt + timedelta(days=1)
        while next_dt.weekday() not in custom_days:
            next_dt += timedelta(days=1)

    if next_dt:
        task["dateTime"] = next_dt.isoformat()
        schedule_notification(task)
        save_data(subscriptions, scheduled_tasks)
        return True

    return False


def notify_device(task):
    try:
        with task_lock:
            device_id = task.get("deviceId")
            subscription = subscriptions.get(device_id)

            if not subscription:
                return

            tipo = task.get("type", "task")
            is_daybefore = task.get("isDayBefore", False)
            title = "Recuerda:" if tipo == "bag" else "⏱️ Recordatorio de tarea"

            if is_daybefore:
                dt_original = isoparse(task.get("originalDateTime", task["dateTime"]))
                hora_formateada = dt_original.strftime("%H:%M")
                body = f"Recuerda que mañana tienes '{task['title']}' a las {hora_formateada}"
                url = task.get("data", {}).get("url", "/dates")
            else:
                if task.get("type") == "bag":
                    body = task["title"]
                else:
                    body = f'Tu tarea "{task["title"]}" es en {task.get("notifyMinutesBefore", 15)} minutos'
                url = task.get("data", {}).get("url", "/today")

            payload = {"title": title, "body": body, "data": {"url": url}}
            send_push_notification(subscription, payload)

            task_id = task.get("id")

            if device_id in scheduled_tasks:
                scheduled_tasks[device_id] = [
                    t for t in scheduled_tasks[device_id] if t.get("id") != task_id
                ]

            if is_daybefore:
                base_id = task_id.replace("-daybefore", "")
                for t in scheduled_tasks.get(device_id, []):
                    if t.get("id") == base_id:
                        t["notifyDayBefore"] = False

            was_reprogrammed = reprogram_if_repeating(task)

            if task.get("_reprogram_later"):
                task["_reprogram_later"] = False
                print(f"[INFO] Reprogramando tarea lejana {task_id}")
                schedule_notification(task)

            save_data(subscriptions, scheduled_tasks)

            for timer in list(active_timers):
                if timer.args and isinstance(timer.args[0], dict):
                    t = timer.args[0]
                    if t.get("id") == task_id and t.get("deviceId") == device_id:
                        active_timers.remove(timer)
                        break

    except asyncio.CancelledError:
        print(f"⚠️ Notificación cancelada: {task.get('id')}")
    except Exception as e:
        print(f"❌ Error en notify_device para {task.get('id')}: {e}")


def reprogram_all_tasks():
    for device_id, tasks in scheduled_tasks.items():
        if device_id in subscriptions:
            for task in tasks:
                repeat = task.get("repeat", "once")
                task_dt = isoparse(task["dateTime"])
                if repeat != "once" and task_dt < datetime.now(task_dt.tzinfo):
                    reprogram_if_repeating(task)
                schedule_notification(task)
    print("\033[96m🔄 Reprogramadas todas las notificaciones tras suspensión\033[0m")


def schedule_notification(task):
    device_id = task.get("deviceId")
    if not device_id:
        return

    if device_id not in scheduled_tasks:
        scheduled_tasks[device_id] = []

    notify_minutes_before = task.get("notifyMinutesBefore", 15)

    for t in list(scheduled_tasks[device_id]):
        if t.get("id") == task.get("id"):
            cancelar_timer_existente(t)
            scheduled_tasks[device_id].remove(t)
            break

    scheduled_tasks[device_id].append(task)
    save_data(subscriptions, scheduled_tasks)

    delay = calcular_delay(task["dateTime"], notify_minutes_before)
    if delay is not None:
        MAX_TIMEOUT = 7 * 24 * 3600
        if delay > MAX_TIMEOUT:
            print(
                f"[INFO] Delay demasiado grande ({delay}s), se limita a {MAX_TIMEOUT}s"
            )
            delay = MAX_TIMEOUT

            task["_reprogram_later"] = True
        else:
            task["_reprogram_later"] = False

        timer = threading.Timer(delay, notify_device, args=[task])
        timer.start()
        active_timers.append(timer)
        task["timer"] = timer

    if task.get("notifyDayBefore"):
        fecha_original = isoparse(task["dateTime"])
        fecha_anticipada = (fecha_original - timedelta(days=1)).replace(
            hour=6, minute=44, second=0, microsecond=0
        )

        if fecha_anticipada < datetime.now(fecha_anticipada.tzinfo):
            fecha_anticipada = datetime.now(fecha_anticipada.tzinfo) + timedelta(
                seconds=5
            )

        task_daybefore = {
            "id": f"{task['id']}-daybefore",
            "title": task["title"],
            "dateTime": fecha_anticipada.isoformat(),
            "deviceId": task["deviceId"],
            "type": task.get("type", "task"),
            "notifyMinutesBefore": 0,
            "data": task.get("data", {}),
            "isDayBefore": True,
            "originalDateTime": task["dateTime"],
            "repeat": "once",
        }

        base_id = task["id"]
        for t in list(scheduled_tasks[device_id]):
            if t.get("id") == f"{base_id}-daybefore":
                cancelar_timer_existente(t)
                scheduled_tasks[device_id].remove(t)

        scheduled_tasks[device_id].append(task_daybefore)
        save_data(subscriptions, scheduled_tasks)

        delay_daybefore = calcular_delay(task_daybefore["dateTime"], 0)
        if delay_daybefore is not None:
            timer_daybefore = threading.Timer(
                delay_daybefore, notify_device, args=[task_daybefore]
            )
            timer_daybefore.start()
            active_timers.append(timer_daybefore)
            task_daybefore["timer"] = timer_daybefore
