from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from utils.spacy_utils import nlp, infer_type
from services.vosk_engine import transcribe_audio_file
from services.date_parser2 import combine_date_and_time2
from utils.helpers2.date_helpers2 import is_today
import asyncio
from datetime import datetime, timedelta


router = APIRouter()

@router.post("/transcribe/")
async def transcribe_audio(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    print("[TRANSCRIBE] INICIO")

    # 1️⃣ Transcribir audio
    texto_raw = await transcribe_audio_file(file)

    doc = nlp(texto_raw)
    tipo = infer_type(doc.text)
    text, dt, hour, minutes, time = combine_date_and_time2(texto_raw)

    response = {
        "text_raw": texto_raw,  # texto original
        "text": text,  # texto limpio
        "datetime": dt,
        "type": tipo,  # tipo inferido
        "hour": time,  # hora "HH:MM"
        "isToday": is_today(dt),  # si es hoy
    }
    # DEBUG
    print(f"[TRANSCRIBE] text_raw: {texto_raw}")
    print(f"[TRANSCRIBE] Texto limpio: {text}")
    print(f"[TRANSCRIBE] Datetime: {dt}")
    print(f"[TRANSCRIBE] Hour: {time}, Is today: {response['isToday']}")
    print("[TRANSCRIBE] FIN")
    return response
