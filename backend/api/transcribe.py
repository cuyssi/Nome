# ──────────────────────────────────────────────────────────────────────────────
# Endpoint de FastAPI para recibir audio y devolver transcripción estructurada.
# Procesa archivo vía Whisper, limpia texto, detecta fecha y ajusta formato.
# Devuelve campos clave para integrarlos fácilmente en el frontend:
# - text_raw: contenido transcrito sin modificar.
# - text: texto final, limpio y contextualizado.
# - datetime: fecha formateada en ISO si es detectada.
# Ideal para conectar flujo de voz con sistema de tareas semánticas.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

# api/transcribe.py
from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from utils.spacy_utils import nlp, infer_type
from services.vosk_engine import transcribe_audio_file
from services.date_parser import combine_date_and_time
from utils.helpers.date_helpers import is_today
import asyncio
from datetime import datetime, timedelta


router = APIRouter()


@router.post("/transcribe/")
async def transcribe_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):

    # 1️⃣ Transcribir audio
    texto_raw = await transcribe_audio_file(file)

    # 2️⃣ Procesar con spaCy para inferir tipo
    doc = nlp(texto_raw)
    tipo = infer_type(doc.text)

    # 3️⃣ Combinar fecha y hora, obtener texto limpio
    combined_dt, texto_final = combine_date_and_time(texto_raw)

    # 4️⃣ Extraer hora para frontend (opcional)
    hour_info = None
    if combined_dt:
        hour_info = combined_dt.strftime("%H:%M")

    # 5️⃣ Preparar respuesta
    response = {
        "text_raw": texto_raw,  # texto original
        "text": texto_final,  # texto limpio
        "datetime": combined_dt.isoformat() if combined_dt else None,
        "type": tipo,  # tipo inferido
        "hour": hour_info,  # hora "HH:MM"
        "isToday": is_today(combined_dt),  # si es hoy
    }
    # DEBUG
    print(f"Transcribe raw: {texto_raw}")
    print(f"Texto limpio: {texto_final}")
    print(f"Datetime: {combined_dt}")
    print(f"Hour: {hour_info}, Is today: {response['isToday']}")

    return response
