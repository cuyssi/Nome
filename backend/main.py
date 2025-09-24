import os
import time
import threading
from utils.download_vosk import ensure_vosk_model
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from api.transcribe import router as transcribe_router
from api.notifications.router import router as notifications_router
from api.notifications.subscriptions import active_timers, scheduled_tasks, subscriptions
from services.notifications.scheduler import schedule_notification
import asyncio

load_dotenv()
ensure_vosk_model()


def reprogram_all_tasks():
    """
    Reprograma todas las notificaciones pendientes para todos los dispositivos.
    """
    for device_id, tasks in scheduled_tasks.items():
        if device_id in subscriptions:
            for task in tasks:
                schedule_notification(task)
    print("🔄 Reprogramadas todas las notificaciones tras suspensión")


def watchdog_thread(interval=10, threshold=30):
    """
    Hilo que detecta suspensión del sistema midiendo saltos de tiempo anormales.
    - interval: cada cuánto segundos revisar.
    - threshold: si el salto es mayor a este valor → asumimos suspensión.
    """
    last_check = time.time()
    while True:
        time.sleep(interval)
        now = time.time()
        delta = now - last_check
        last_check = now

        if delta > (interval + threshold):
            print(f"⚠️ Detectada suspensión del sistema (delta={delta:.1f}s)")
            reprogram_all_tasks()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        reprogram_all_tasks()
        threading.Thread(target=watchdog_thread, daemon=True).start()
        yield
    except asyncio.CancelledError:
        print("🛑 Servidor detenido por interrupción")
    finally:
        for timer in list(active_timers):
            if timer.is_alive():
                timer.cancel()
            active_timers.remove(timer)


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
