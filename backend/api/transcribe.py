# ──────────────────────────────────────────────────────────────────────────────
# Endpoint para transcripción de audio y creción de tarea que se envia al frontend.
# - Recibe archivos de audio y devuelve texto transcrito limpio
# - Detecta fecha y hora mencionadas en el audio
# - Determina si la tarea corresponde a hoy
# - Inferencia del tipo de tarea mediante NLP
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from utils.spacy_utils import nlp, infer_task_type
from services.vosk_engine import transcribe_audio_file
from services.date_parser import combine_date_and_time
from utils.helpers.date_helpers import is_today

router = APIRouter()

@router.post("/transcribe/")
async def transcribe_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    text_raw = await transcribe_audio_file(file)
    doc = nlp(text_raw)
    tipo = infer_task_type(doc.text)
    text, dt, hour, minutes, time = combine_date_and_time(doc.text)

    response = {
        "text_raw": text_raw,
        "text": text,
        "datetime": dt,
        "type": tipo,
        "hour": time,
        "isToday": is_today(dt),
    }

    print(f"Transcribe raw: {text_raw}")
    print(f"Texto limpio: {text}")
    print(f"Datetime: {dt}")
    print(f"Hour: {time}, Is today: {response['isToday']}")

    return response
