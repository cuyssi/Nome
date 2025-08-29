# ──────────────────────────────────────────────────────────────────────────────
# Archivo principal de la aplicación FastAPI para procesamiento de audio y notificaciones.
# - Configura CORS según variables de entorno.
# - Incluye routers:
#     • /transcribe/ para transcripción de audio.
#     • /notifications/ para gestionar notificaciones push.
# - Gestiona el cierre limpio del servidor cancelando timers activos.
# ──────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.transcribe import router as transcribe_router
from api.notifications import router as notifications_router
from dotenv import load_dotenv
from api.notifications import active_timers
import os

load_dotenv()
app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup (si quieres poner algo, ej. inicializar recursos)
    yield
    # Shutdown
    for timer in active_timers:
        if timer.is_alive():
            timer.cancel()
    print("✅ Todos los timers cancelados")

allowed_origins = os.getenv("CORS_ORIGINS", "").split(",")


print("🌍 CORS_ORIGINS:", os.getenv("CORS_ORIGINS"))


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe_router)
app.include_router(notifications_router)
