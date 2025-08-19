# notifications.py
import os
import json
import time
import threading
from fastapi import APIRouter, Request, HTTPException
from pywebpush import webpush, WebPushException
from dotenv import load_dotenv
from typing import Dict, cast

load_dotenv()
router = APIRouter()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_CLAIMS = {"sub": "mailto:cuyssi@hotmail.com"}

# Almacén temporal de suscripciones (puedes usar una base de datos real)
subscriptions = []

@router.get("/vapid-public-key")
def get_vapid_public_key():
    return VAPID_PUBLIC_KEY

@router.post("/subscribe")
async def subscribe(request: Request):
    body = await request.json()
    subscriptions.append(body)
    print(f"📬 Nueva suscripción añadida: {body.get('endpoint')}")
    return {"status": "subscribed"}

def send_push_notification(subscription, payload):
    try:
        webpush(
            subscription_info=subscription,
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=cast(Dict[str, str | int | None], VAPID_CLAIMS),
        )
        print("✅ Notificación enviada")
    except WebPushException as ex:
        print("❌ Error al enviar notificación:", repr(ex))
        if ex.response:
            print("📄 Detalles:", ex.response.text)

def notify_all(task):
    try:
        print("📦 Subscripciones activas:", len(subscriptions))
        payload = {
            "title": "⏰ Recordatorio de tarea",
            "body": f'Tu tarea "{task["title"]}" es en 15 minutos',
        }
        for sub in subscriptions:
            send_push_notification(sub, payload)
    except Exception as e:
        print("🔥 Error en notify_all:", repr(e))

def schedule_notification(task):
    """
    task = {
        "title": "Reunión con equipo",
        "time": "2025-08-19T08:00:00"  # ISO 8601
    }
    """
    try:
        task_time = time.strptime(task["time"], "%Y-%m-%dT%H:%M:%S")
        timestamp = time.mktime(task_time)
        delay = timestamp - time.time() - 15 * 60  # 15 minutos antes

        if delay > 0:
            threading.Timer(delay, lambda: notify_all(task)).start()
            print(f"⏳ Notificación programada en {int(delay)} segundos")
        else:
            print("⚠️ La hora ya pasó o está demasiado cerca")
    except Exception as e:
        print("🚨 Error al programar notificación:", repr(e))

@router.post("/unsubscribe")
async def unsubscribe(request: Request):
    body = await request.json()
    endpoint = body.get("endpoint")
    global subscriptions
    subscriptions = [sub for sub in subscriptions if sub.get("endpoint") != endpoint]

    if endpoint:
        print(f"🗑️ Suscripción eliminada: {endpoint}")
        return {"status": "unsubscribed"}
    else:
        raise HTTPException(status_code=400, detail="Endpoint no proporcionado")

@router.post("/schedule-task")
async def schedule_task(request: Request):
    task = await request.json()

    if "text" not in task or "dateTime" not in task:
        raise HTTPException(status_code=400, detail="Faltan campos obligatorios")

    task_data = {"title": task["text"], "time": task["dateTime"]}
    schedule_notification(task_data)
    return {"status": "scheduled"}
