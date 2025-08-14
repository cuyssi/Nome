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
from services.vosk_engine import transcribe_audio_file
from services.date_parser import combine_date_and_time, is_today
from utils.text_helper import clean_final_text
from utils.preprocess import clean_text
from utils.spacy_utils import nlp, infer_type
from services.date_parser_helpers import extract_simple_time


router = APIRouter()

@router.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    texto_raw = await transcribe_audio_file(file)

    # Extraer hora (hora, minuto) sin tocar endpoint
    hora_result, texto_sin_hora = extract_simple_time(texto_raw)
    hour_info = hora_result if hora_result else None

    doc = nlp(texto_raw)

    # Desempaquetar correctamente combine_date_and_time
    combined_dt, texto_limpio = combine_date_and_time(texto_raw)
    datetime_iso = combined_dt.isoformat() if combined_dt else None
    tipo = infer_type(doc.text)

    print(f"transcribe texto_raw: {texto_raw}")

    return {
        "text_raw": texto_raw,
        "text": texto_sin_hora,
        "datetime": datetime_iso,
        "type": tipo,
        "hour": hour_info,
        "isToday": is_today(combined_dt) if combined_dt else False
    }
