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

import threading
from dateutil.parser import isoparse
from datetime import datetime, timedelta
from services.notifications.utils import calcular_delay
from services.notifications.push import send_push_notification
from services.notifications.storage import save_data
from api.notifications.subscriptions import subscriptions, scheduled_tasks, active_timers, task_lock
import asyncio


def cancelar_timer_existente(task):
    """Cancelar cualquier timer activo asociado a una tarea concreta."""
    with task_lock:
        for timer in list(active_timers):
            if timer.args and isinstance(timer.args[0], dict):
                t = timer.args[0]
                if t["id"] == task.get("id") and t["deviceId"] == task.get("deviceId"):
                    timer.cancel()
                    active_timers.remove(timer)
                    break


def reprogram_if_repeating(task):
    """Si la tarea o mochila es repetitiva, calcula la próxima fecha y la reprograba."""
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

    elif repeat == "custom":
        custom_days = task.get("customDays", [])
        if not custom_days:
            return False
        next_dt = current_dt + timedelta(days=1)
        while next_dt.weekday() not in custom_days:
            next_dt += timedelta(days=1)

    if next_dt:
        task["dateTime"] = next_dt.isoformat()
        print(f"📆 Próxima fecha calculada para '{task.get('title') or task.get('name')}': {next_dt}")

        schedule_notification(task)
        save_data(subscriptions, scheduled_tasks)

        print(f"🔁 '{task.get('title') or task.get('name')}' reprogramada para {next_dt.strftime('%A %H:%M')}")
        return True

    return False


def notify_device(task):
    """Enviar la notificación push al dispositivo y gestionar su ciclo de vida."""
    try:
        with task_lock:
            device_id = task.get("deviceId")
            subscription = subscriptions.get(device_id)

            if not subscription:
                return

            tipo = task.get("type", "task")
            is_daybefore = task.get("isDayBefore", False)
            title = "⏱️ Recordatorio de mochila" if tipo == "bag" else "⏱️ Recordatorio de tarea"

            if is_daybefore:
                dt_original = isoparse(task.get("originalDateTime", task["dateTime"]))
                hora_formateada = dt_original.strftime("%H:%M")
                body = f"Recuerda que mañana tienes '{task['title']}' a las {hora_formateada}"
                url = "/dates"
            else:
                body = f'Tu tarea "{task["title"]}" es en {task.get("notifyMinutesBefore", 15)} minutos'
                url = "/today"

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


def schedule_notification(task):
    """Programar una tarea con su timer y opcionalmente con notificación de día antes."""
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
            fecha_anticipada = datetime.now(fecha_anticipada.tzinfo) + timedelta(seconds=5)

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

        base_id = task['id']
        for t in list(scheduled_tasks[device_id]):
            if t.get("id") == f"{base_id}-daybefore":
                cancelar_timer_existente(t)
                scheduled_tasks[device_id].remove(t)

        scheduled_tasks[device_id].append(task_daybefore)
        save_data(subscriptions, scheduled_tasks)

        delay_daybefore = calcular_delay(task_daybefore["dateTime"], 0)
        if delay_daybefore is not None:
            timer_daybefore = threading.Timer(delay_daybefore, notify_device, args=[task_daybefore])
            timer_daybefore.start()
            active_timers.append(timer_daybefore)
            task_daybefore["timer"] = timer_daybefore
