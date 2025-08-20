import os
import json
import time
import threading
from fastapi import APIRouter, Request, HTTPException
from pywebpush import webpush, WebPushException
from dotenv import load_dotenv
from typing import Dict, cast, Union

load_dotenv()
router = APIRouter()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_CLAIMS = {"sub": "mailto:cuyssi@hotmail.com"}

subscriptions: Dict[str, Dict] = {}

@router.get("/vapid-public-key")
def get_vapid_public_key():
    return VAPID_PUBLIC_KEY

@router.post("/subscribe")
async def subscribe(request: Request):
    body = await request.json()
    device_id = body.get("deviceId")
    subscription = body.get("subscription")

    if not device_id or not subscription:
        raise HTTPException(status_code=400, detail="Faltan deviceId o subscription")

    subscriptions[device_id] = subscription
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
    try:
        device_id = task.get("deviceId")
        subscription = subscriptions.get(device_id)

        if not subscription:
            print(f"⚠️ No hay suscripción para deviceId: {device_id}")
            return

        payload = {
            "title": "⏰ Recordatorio de tarea",
            "body": f'Tu tarea "{task["title"]}" es en 15 minutos',
        }

        send_push_notification(subscription, payload)
    except Exception as e:
        print("🔥 Error en notify_device:", repr(e))

def schedule_notification(task):
    """
    task = {
        "title": "Reunión con equipo",
        "time": "2025-08-19T08:00:00",
        "deviceId": "abc-123"
    }
    """
    try:
        task_time = time.strptime(task["time"], "%Y-%m-%dT%H:%M:%S")
        timestamp = time.mktime(task_time)
        delay = timestamp - time.time() - 15 * 60

        if delay > 0:
            threading.Timer(delay, lambda: notify_device(task)).start()
            print(f"⏳ Notificación programada en {int(delay)} segundos")
        else:
            print("⚠️ La hora ya pasó o está demasiado cerca")
    except Exception as e:
        print("🚨 Error al programar notificación:", repr(e))

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
