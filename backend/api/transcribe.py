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
from services.date_parser_helpers import extract_simple_time_string

router = APIRouter()

@router.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    texto_raw = await transcribe_audio_file(file)
    hora = extract_simple_time_string(texto_raw)
    doc = nlp(texto_raw)
    fecha = combine_date_and_time(texto_raw)
    texto_final = doc._.texto_limpio if fecha else clean_text(doc.text)
    tipo = infer_type(doc.text)

    print(f"🔍 TEXTO RAW: {repr(texto_raw)}")
    return {
        "text_raw": texto_raw,
        "text": texto_final,
        "datetime": fecha.isoformat() if fecha else None,
        "type": tipo,
        "hour": hora,
        "isToday": is_today(fecha)
    }
