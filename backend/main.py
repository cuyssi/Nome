# ──────────────────────────────────────────────────────────────────────────────
# Configuración principal de la aplicación FastAPI para procesamiento de audio.
# - CORS habilitado para permitir peticiones desde cualquier origen (ideal para frontend local).
# - Incluye el router de transcripción (`/transcribe/`) donde se procesan los archivos.
# Este archivo actúa como punto de entrada del backend, listo para ser desplegado
# o conectado con cliente web, móvil o servicios externos.
# Perfecto para sistemas de voz a texto, asistentes de tareas o apps conversacionales.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from api.transcribe2 import router as transcribe_router
from api.notifications import router as notifications_router
from dotenv import load_dotenv
from api.notifications import active_timers
load_dotenv()
import os

app = FastAPI()

@app.on_event("shutdown")
def shutdown_event():
    print("🛑 Apagando servidor, cancelando timers...")
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
