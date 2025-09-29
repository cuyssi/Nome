# ──────────────────────────────────────────────────────────────────────────────
# Endpoints de notificaciones push.
# - /vapid-public-key → Devuelve la clave pública VAPID para suscripción.
# - /subscribe → Registra la suscripción push de un dispositivo, para poder enviarle
#   notificaciones.
# - /unsubscribe → Elimina la suscripción push asociada a un endpoint.
# - /schedule-task → Programa una tarea con notificación.
# - /cancel-task → Cancela una tarea programada y su notificación.
# ──────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, Request, HTTPException
from services.notifications.config import VAPID_PUBLIC_KEY
from services.notifications.storage import save_data
from api.notifications.subscriptions import subscriptions, scheduled_tasks
from services.notifications.scheduler import (
    schedule_notification,
    cancelar_timer_existente,
)

router = APIRouter()


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
    save_data(subscriptions, scheduled_tasks)
    for task in scheduled_tasks.get(device_id, []):
        if not task.get("rescheduled"):
            schedule_notification(task)
            task["rescheduled"] = True

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
    save_data(subscriptions, scheduled_tasks)

    return {"status": "unsubscribed"}


@router.post("/schedule-task")
async def schedule_task(request: Request):
    task = await request.json()
    print("📥 Task recibida:", task)

    if "text" not in task or "dateTime" not in task:
        raise HTTPException(status_code=400, detail="Faltan text o dateTime")

    if not task.get("deviceId"):
        raise HTTPException(status_code=400, detail="Falta deviceId")

    task_data = {
        "id": task.get("id"),
        "title": task["text"],
        "dateTime": task["dateTime"],
        "deviceId": task["deviceId"],
        "type": task.get("type", "task"),
        "notifyMinutesBefore": task.get("notifyMinutesBefore", 15),
        "data": task.get("data", {}),
        "notifyDayBefore": task.get("notifyDayBefore", False),
        "repeat": task.get("repeat", "once"),
        "customDays": task.get("customDays", []),
    }
    device_id = task_data["deviceId"]

    if device_id in scheduled_tasks:
        for t in list(scheduled_tasks[device_id]):
            if t.get("id") == task_data["id"] and not str(t.get("id")).endswith(
                "-daybefore"
            ):
                cancelar_timer_existente(t)
                scheduled_tasks[device_id].remove(t)
                break

    schedule_notification(task_data)

    return {"status": "scheduled"}


@router.post("/cancel-task")
async def cancel_task(request: Request):
    body = await request.json()
    task_id = body.get("id")
    device_id = body.get("deviceId")

    if not task_id or not device_id:
        raise HTTPException(status_code=400, detail="Faltan id o deviceId")
    tareas = scheduled_tasks.get(device_id, [])

    for t in list(tareas):
        if t.get("id") == task_id:
            cancelar_timer_existente(t)
            tareas.remove(t)
            break
    save_data(subscriptions, scheduled_tasks)

    return {"status": "cancelled"}
