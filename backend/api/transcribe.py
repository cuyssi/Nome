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

from fastapi import APIRouter, File, UploadFile
from services.whisper_engine import transcribe_audio_file
from services.date_parser import combine_date_and_time
from utils.text_helper import clean_final_text
from utils.preprocess import clean_text


router = APIRouter()


@router.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    texto_raw = await transcribe_audio_file(file)
    texto_prelimpio = clean_text(texto_raw)
    fecha = combine_date_and_time(texto_raw)
    texto_final = clean_final_text(texto_prelimpio, fecha) if fecha else texto_prelimpio
    print(f"🔍 TEXTO RAW: {repr(texto_raw)}")
    return {
        "text_raw": texto_raw,
        "text": texto_final,
        "datetime": fecha.isoformat() if fecha else None,
    }
