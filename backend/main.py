# ────────────────────────────────────────────────────────────────
# main.py
# Punto de entrada del backend
# - Carga variables de entorno
# - Asegura que el modelo Vosk esté disponible
# - Configura el ciclo de vida de la app (lifespan):
#     • Reprograma tareas pendientes al arrancar
#     • Cancela timers al apagar
# - Habilita CORS para el frontend
# - Incluye los routers:
#     • /transcribe → transcripción de audio
#     • /notifications → notificaciones push
# - Endpoint raíz: comprueba si el backend responde
# ────────────────────────────────────────────────────────────────

import os
from utils.download_vosk import ensure_vosk_model
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from api.transcribe import router as transcribe_router
from api.notifications.router import router as notifications_router
from api.notifications.subscriptions import active_timers
from services.notifications.scheduler import schedule_notification

load_dotenv()
ensure_vosk_model()


@asynccontextmanager
async def lifespan(app: FastAPI):
    from api.notifications.subscriptions import scheduled_tasks, subscriptions

    for device_id, tasks in scheduled_tasks.items():
        if device_id in subscriptions:
            for task in tasks:
                if not task.get("rescheduled"):
                    schedule_notification(task)
                    task["rescheduled"] = True
    yield
    for timer in active_timers:
        if timer.is_alive():
            timer.cancel()


app = FastAPI(lifespan=lifespan)

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe_router)
app.include_router(notifications_router)


@app.get("/")
async def root():
    return {"message": "Backend funcionando"}
