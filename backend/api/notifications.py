import os
import json
import time
import threading
from fastapi import APIRouter, Request, HTTPException
from pywebpush import webpush, WebPushException
from dotenv import load_dotenv
from typing import Dict, cast, Union
from datetime import datetime

load_dotenv()
router = APIRouter()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_CLAIMS = {"sub": "mailto:cuyssi@hotmail.com"}

active_timers = []  # 🧹 Lista global para guardar los timers activos
subscriptions: Dict[str, Dict] = {}
scheduled_tasks: Dict[str, list] = {}
task_lock = threading.Lock()

@router.get("/vapid-public-key")
def get_vapid_public_key():
    return VAPID_PUBLIC_KEY

def cancelar_timer_existente(task):
    for timer in active_timers:
        if timer.args and isinstance(timer.args[0], dict):
            t = timer.args[0]
            if t["title"] == task["title"] and t["time"] == task["time"] and t["deviceId"] == task["deviceId"]:
                timer.cancel()
                active_timers.remove(timer)
                print(f"🧹 Timer cancelado para tarea '{t['title']}' del dispositivo {t['deviceId']}")
                break

@router.post("/subscribe")
async def subscribe(request: Request):
    body = await request.json()
    device_id = body.get("deviceId")
    subscription = body.get("subscription")

    if not device_id or not subscription:
        raise HTTPException(status_code=400, detail="Faltan deviceId o subscription")

    subscriptions[device_id] = subscription

    # Reprogramar tareas pendientes
    if device_id in scheduled_tasks:
        now = time.time()
        for task in scheduled_tasks[device_id]:
            task_time = time.strptime(task["time"], "%Y-%m-%dT%H:%M:%S")
            timestamp = time.mktime(task_time)
            delay = timestamp - now - 15 * 60
            if delay > 0 and not task.get("rescheduled"):
                cancelar_timer_existente(task)

                def run_notification():
                    notify_device(task.copy())

                timer = threading.Timer(delay, run_notification)
                task["timer"] = timer
                timer.start()
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
        # ❗ No eliminamos las tareas programadas para conservarlas

    print(f"🗑️ Suscripción eliminada: {endpoint}")
    return {"status": "unsubscribed"}

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
        try:
            device_id = task.get("deviceId")
            subscription = subscriptions.get(device_id)

            if not subscription:
                print(f"⚠️ No hay suscripción para deviceId: {device_id}")
                return

            payload = {
                "title": "⏰ Recordatorio de tarea",
                "body": f'Tu tarea \"{task["title"]}\" es en 15 minutos',
            }

            send_push_notification(subscription, payload)

            # Eliminar tarea ejecutada con doble verificación
            if device_id in scheduled_tasks:
                scheduled_tasks[device_id] = [
                    t for t in scheduled_tasks[device_id]
                    if not (t["title"] == task["title"] and t["time"] == task["time"])
                ]
        except Exception as e:
            print("🔥 Error en notify_device:", repr(e))

def calcular_delay(task_time_str):
    task_time = datetime.strptime(task_time_str, "%Y-%m-%dT%H:%M:%S")
    now = datetime.now()
    delay = (task_time - now).total_seconds() - 15 * 60
    return max(delay, 1)

def schedule_notification(task):
    device_id = task.get("deviceId")
    if not device_id:
        return

    if device_id not in scheduled_tasks:
        scheduled_tasks[device_id] = []

    for t in scheduled_tasks[device_id]:
        if t["title"] == task["title"] and t["time"] == task["time"]:
            print("🔁 Tarea ya programada, no se duplica")
            return

    scheduled_tasks[device_id].append(task)

    delay = calcular_delay(task["time"])
    timer = threading.Timer(delay, notify_device, args=[task])
    active_timers.append(timer)
    timer.start()

@router.post("/schedule-task")
async def schedule_task(request: Request):
    task = await request.json()

    if "text" not in task or "dateTime" not in task:
        raise HTTPException(status_code=400, detail="Faltan text o dateTime")

    device_id = task.get("deviceId")
    if not device_id:
        raise HTTPException(status_code=400, detail="Falta deviceId")

    task_data = {
        "title": task["text"],
        "time": task["dateTime"],
        "deviceId": device_id
    }

    schedule_notification(task_data)
    return {"status": "scheduled"}
