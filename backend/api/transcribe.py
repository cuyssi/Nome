# ──────────────────────────────────────────────────────────────────────────────
# Endpoint para transcripción de audio y creación de tarea que se envía al frontend.
# - Recibe archivos de audio y devuelve texto transcrito limpio
# - Detecta fecha y hora mencionadas en el audio
# - Determina si la tarea corresponde a hoy
# - Clasifica el tipo de tarea mediante lógica centralizada
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, File, UploadFile
from services.vosk_engine import transcribe_audio_file
from services.date_parser import combine_date_and_time
from utils.helpers.date_helpers import is_today

router = APIRouter()

@router.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    text_raw = await transcribe_audio_file(file)

    result = combine_date_and_time(text_raw)

    response = {
        "text_raw": text_raw,
        "text": result["text"],
        "datetime": result["datetime"],
        "hour": result["time"],
        "minutes": result["minutes"],
        "type": result["type"],
        "patterns": result["patterns"],
        "uuid": result["uuid"],
        "isToday": is_today(result["datetime"]),
    }

    print(f"Transcribe raw: {text_raw}")
    print(f"Texto limpio: {result['text']}")
    print(f"Datetime: {result['datetime']}")
    print(f"Hour: {result['time']}, Is today: {response['isToday']}")
    print(f"Tipo: {result['type']}, UUID: {result['uuid']}")

    return response
