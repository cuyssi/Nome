# ──────────────────────────────────────────────────────────────────────────────
# Archivo principal de configuración del backend (FastAPI).
#
# Funcionalidad:
#   • Carga variables de entorno desde `.env`.
#   • Verifica y descarga el modelo de Vosk necesario para transcripción.
#   • Configura FastAPI con middleware CORS.
#   • Define el ciclo de vida (lifespan) de la app:
#       - Reprograma todas las notificaciones pendientes en el arranque.
#       - Inicia un hilo watchdog para monitorizar timers activos.
#       - Cancela y limpia timers activos al cerrar el servidor.
#
# Routers registrados:
#   • /transcribe → gestión de transcripciones de audio y creación de tareas.
#   • /notifications → gestión de notificaciones push y subscripciones.
#
# Endpoints principales:
#   • GET "/" → endpoint raíz, devuelve JSON {"message": "Backend funcionando"}.
#
# Variables clave:
#   • active_timers → lista de timers activos gestionados por el módulo de notificaciones.
#   • CORS_ORIGINS → orígenes permitidos para peticiones desde frontend (desde .env o por defecto "*").
#
# @autor: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from utils.download_vosk import ensure_vosk_model
from api.transcribe import router as transcribe_router
from api.notifications.router import router as notifications_router
from api.notifications.subscriptions import active_timers
from services.notifications.scheduler import reprogram_all_tasks
from services.notifications.watchdog import watchdog_thread

import os
import threading
import asyncio

load_dotenv()
ensure_vosk_model()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        reprogram_all_tasks()
        threading.Thread(target=watchdog_thread, daemon=True).start()
        yield
    except asyncio.CancelledError:
        print("\033[95m🛑 Servidor detenido por interrupción\033[0m")
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
