# ──────────────────────────────────────────────────────────────────────────────
# Archivo principal de la aplicación FastAPI para procesamiento de audio y notificaciones.
# - Configura CORS según variables de entorno.
# - Incluye routers:
#     • /transcribe/ para transcripción de audio.
#     • /notifications/ para gestionar notificaciones push.
# - Gestiona el cierre limpio del servidor cancelando timers activos.
# ──────────────────────────────────────────────────────────────────────────────

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from api.transcribe import router as transcribe_router
from api.notifications import router as notifications_router, active_timers

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
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
    return {"message": "Backend funcionando 🚀"}
