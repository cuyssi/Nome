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
from api.transcribe import router as transcribe_router
import os

app = FastAPI()

allowed_origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe_router)
