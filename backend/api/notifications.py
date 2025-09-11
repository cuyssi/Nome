# ──────────────────────────────────────────────────────────────────────────────
# Gestión de notificaciones push para tareas programadas para que te llegue
# una nortificación programada 15 minutos antes.
# - Administra suscripciones por dispositivo (subscribe/unsubscribe)
# - Controla timers activos para evitar duplicados
# - Envía notificaciones push usando VAPID keys
# - Mantiene tareas y suscripciones en memoria
#
# Funciones principales:
#   get_vapid_public_key()         : Devuelve la clave pública VAPID para suscribirse
#   subscribe(request)             : Registra suscripción y reprograma tareas pendientes
#   unsubscribe(request)           : Elimina una suscripción existente
#   send_push_notification(sub, p) : Envía notificación push a una suscripción
#   notify_device(task)            : Notifica un dispositivo y elimina tarea ejecutada
#   calcular_delay(task_time_str)  : Calcula segundos hasta la tarea menos 15 minutos
#   schedule_notification(task)    : Programa una tarea para enviar notificación
#   schedule_task(request)         : Endpoint para crear y programar nueva tarea
#
# Integrado como router '/notifications' en FastAPI
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

import os
import json
import threading
from datetime import datetime, timezone
from fastapi import APIRouter, Request, HTTPException
from pywebpush import webpush, WebPushException
from typing import Dict, Union, cast
from dotenv import load_dotenv
from pathlib import Path
from dateutil.parser import isoparse

load_dotenv()
router = APIRouter()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_CLAIMS = {"sub": "mailto:cuyssi@hotmail.com"}

JSON_FILE = Path(__file__).parent / "subscriptions.json"
if not JSON_FILE.exists():
    with open(JSON_FILE, "w") as f:
        json.dump({"subscriptions": {}, "scheduled_tasks": {}}, f, indent=2)


def load_data():
    with open(JSON_FILE, "r") as f:
        return json.load(f)


def save_data():
    clean_scheduled_tasks = {}
    for device_id, tasks in scheduled_tasks.items():
        clean_scheduled_tasks[device_id] = []
        for t in tasks:
            t_copy = t.copy()
            t_copy.pop("timer", None)
            t_copy.pop("rescheduled", None)
            clean_scheduled_tasks[device_id].append(t_copy)
    with open(JSON_FILE, "w") as f:
        json.dump(
            {"subscriptions": subscriptions, "scheduled_tasks": clean_scheduled_tasks},
            f,
            indent=2,
        )


data = load_data()
subscriptions: Dict[str, Dict] = data.get("subscriptions", {})
scheduled_tasks: Dict[str, list] = data.get("scheduled_tasks", {})
active_timers = []
task_lock = threading.Lock()
MAX_DELAY = 60 * 60 * 24 * 30


@router.get("/vapid-public-key")
def get_vapid_public_key():
    return VAPID_PUBLIC_KEY


def cancelar_timer_existente(task):
    for timer in active_timers:
        if timer.args and isinstance(timer.args[0], dict):
            t = timer.args[0]
            if (
                t["title"] == task["title"]
                and t["time"] == task["time"]
                and t["deviceId"] == task["deviceId"]
            ):
                timer.cancel()
                active_timers.remove(timer)
                print(
                    f"🧹 Timer cancelado para tarea '{t['title']}' del dispositivo {t['deviceId']}"
                )
                break


def send_push_notification(subscription, payload):
    try:
        webpush(
            subscription_info=subscription,
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=cast(Dict[str, Union[str, int]], VAPID_CLAIMS),
        )
        print("✅ Notificación enviada")
    except WebPushException as ex:
        print("❌ Error al enviar notificación:", repr(ex))
        if ex.response:
            print("📄 Detalles:", ex.response.text)


def notify_device(task):
    with task_lock:
        device_id = task.get("deviceId")
        subscription = subscriptions.get(device_id)
        if not subscription:
            print(f"⚠️ No hay suscripción para deviceId: {device_id}")
            return

        tipo = task.get("type", "task")
        if tipo == "bag":
            body = f'¡Es hora de preparar tu mochila "{task["title"]}"!'
            title = "⏱️ Recordatorio de mochila"
        else:
            body = f'Tu tarea "{task["title"]}" es en 15 minutos'
            title = "⏱️ Recordatorio de tarea"

        payload = {
            "title": title,
            "body": body,
            "data": task.get("data", {})  # esto debería incluir el url
        }

        print("📤 Payload que se envía al navegador:", payload)  # ✅ este es el log que necesitas

        send_push_notification(subscription, payload)

        if device_id in scheduled_tasks:
            scheduled_tasks[device_id] = [
                t for t in scheduled_tasks[device_id]
                if isinstance(t, dict) and t.get("id") != task["id"]
            ]

            save_data()


def calcular_delay(task_time_str, task_type="task", notify_minutes_before=15):
    task_time = isoparse(task_time_str)
    now = datetime.now(task_time.tzinfo)
    if task_type == "bag":
        delay = (task_time - now).total_seconds()
    else:
        delay = (task_time - now).total_seconds() - notify_minutes_before * 60
    print(f"Delay calculado: {delay} segundos")
    if delay > MAX_DELAY:
        delay = MAX_DELAY
    return max(delay, 1)


def schedule_notification(task):
    device_id = task.get("deviceId")
    notify_minutes_before = task.get("notifyMinutesBefore", 15)
    delay = calcular_delay(
        task["time"], task.get("type", "task"), notify_minutes_before
    )
    print(f"schedule_notification: {task}")
    if not device_id:
        return
    if device_id not in scheduled_tasks:
        scheduled_tasks[device_id] = []

    for t in scheduled_tasks[device_id]:
        if t.get("id") == task["id"]:
            print("🔍 Revisando tarea:", t)
            print("🔁 Tarea ya existe, se cancela y se reprograma")
            cancelar_timer_existente(t)
            scheduled_tasks[device_id].remove(t)
            break

    scheduled_tasks[device_id].append(task)
    save_data()
    delay = calcular_delay(
        task["time"], task.get("type", "task"), notify_minutes_before
    )
    print(f"Timer programado con delay: {delay} segundos")
    timer = threading.Timer(delay, notify_device, args=[task])
    active_timers.append(timer)
    timer.start()


def reprogram_all_tasks():
    """Reprograma todas las tareas de dispositivos suscritos al iniciar backend"""
    for device_id, tasks in scheduled_tasks.items():
        if device_id not in subscriptions:
            continue
        for task in tasks:
            delay = calcular_delay(task["time"])
            if delay > 0:
                timer = threading.Timer(delay, notify_device, args=[task])
                timer.start()
                active_timers.append(timer)
                task["timer"] = timer
                print(
                    f"🔄 Reprogramada tarea '{task['title']}' para deviceId {device_id}"
                )


@router.post("/cancel-task")
async def cancel_task(request: Request):
    body = await request.json()
    task_id = body.get("id")
    device_id = body.get("deviceId")

    if not task_id or not device_id:
        raise HTTPException(status_code=400, detail="Faltan id o deviceId")

    tareas = scheduled_tasks.get(device_id, [])
    for t in tareas:
        if t.get("id") == task_id:
            cancelar_timer_existente(t)
            tareas.remove(t)
            print(f"🧹 Tarea cancelada: {task_id} para deviceId {device_id}")
            break

    save_data()
    return {"status": "cancelled"}


@router.post("/subscribe")
async def subscribe(request: Request):
    body = await request.json()
    device_id = body.get("deviceId")
    subscription = body.get("subscription")
    if not device_id or not subscription:
        raise HTTPException(status_code=400, detail="Faltan deviceId o subscription")
    subscriptions[device_id] = subscription
    save_data()

    if device_id in scheduled_tasks:
        for task in scheduled_tasks[device_id]:
            delay = calcular_delay(task["time"])
            if delay > 0 and not task.get("rescheduled"):
                cancelar_timer_existente(task)
                timer = threading.Timer(delay, notify_device, args=[task])
                timer.start()
                task["timer"] = timer
                task["rescheduled"] = True
                active_timers.append(timer)
                print(f"🔄 Tarea reprogramada para deviceId {device_id}")

    print(f"📬 Suscripción registrada para deviceId: {device_id}")
    return {"status": "subscribed"}


@router.post("/unsubscribe")
async def unsubscribe(request: Request):
    body = await request.json()
    endpoint = body.get("endpoint")
    if not endpoint:
        raise HTTPException(status_code=400, detail="Endpoint no proporcionado")
    to_remove = [k for k, v in subscriptions.items() if v.get("endpoint") == endpoint]
    for k in to_remove:
        del subscriptions[k]
    save_data()
    print(f"🗑️ Suscripción eliminada: {endpoint}")
    return {"status": "unsubscribed"}


@router.post("/schedule-task")
async def schedule_task(request: Request):
    task = await request.json()
    if "text" not in task or "dateTime" not in task:
        raise HTTPException(status_code=400, detail="Faltan text o dateTime")
    device_id = task.get("deviceId")
    if not device_id:
        raise HTTPException(status_code=400, detail="Falta deviceId")
    task_type = task.get("type", "task")
    task_data = {
        "id": task.get("id"),
        "title": task["text"],
        "time": task["dateTime"],
        "deviceId": device_id,
        "type": task_type,
        "notifyMinutesBefore": task.get("notifyMinutesBefore", 15),
        "data": task.get("data", {})
    }
    print("📦 Task final para programar:", task_data)
    schedule_notification(task_data)
    return {"status": "scheduled"}
