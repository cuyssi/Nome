# ──────────────────────────────────────────────────────────────────────────────
# Endpoint para transcripción de audio y creación de tarea enviada al frontend.
# - Recibe archivos de audio y devuelve un JSON con:
#     • text_raw → texto transcrito original
#     • text → texto limpio y normalizado
#     • datetime, hour, minutes → fecha y hora detectadas
#     • type → tipo de tarea (cita, médicos, deberes, etc.)
#     • isToday → indica si la tarea es para hoy
#     • repeat → patrón de repetición de la tarea
#     • customDays → días personalizados para repetición
#     • uuid → identificador único de la tarea
# - Detecta fecha y hora mencionadas en el audio y combina los datos
# - Clasifica la tarea según tipo y repetición
#
# @autor: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────


from fastapi import APIRouter, File, UploadFile
from services.vosk_engine import transcribe_audio_file
from services.prepare_task_data import prepare_task_data
from utils.helpers.date_helpers import is_today

router = APIRouter()

@router.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    text_raw = await transcribe_audio_file(file)

    result = prepare_task_data(text_raw)

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
        "repeat": result["repeat"],
        "customDays": result["customDays"],
    }

    return response
