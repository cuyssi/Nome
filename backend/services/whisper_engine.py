# ──────────────────────────────────────────────────────────────────────────────
# Servicio que utiliza el modelo Whisper para transcribir archivos de audio.
# - Carga el modelo Whisper con tamaño "medium" para equilibrio entre precisión y rendimiento.
# - Guarda el archivo recibido como `temp_audio.mp3` en disco.
# - Transcribe el contenido utilizando `model.transcribe`.
# - Limpia y une el texto transcrito si se devuelve como lista.
# Devuelve el texto plano de la transcripción para usarlo en el endpoint principal.
# Ideal como servicio backend para apps de voz a tarea u organización verbal.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

import whisper
from fastapi import UploadFile

model = whisper.load_model("medium")


async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()

    with open("temp_audio.mp3", "wb") as f:
        f.write(audio_bytes)

    result = model.transcribe("temp_audio.mp3")
    print(f"🔍 resultadoWhisper: {repr(result)}")

    if (
        isinstance(result, dict)
        and "text" in result
        and isinstance(result["text"], (str, list))
    ):
        if isinstance(result["text"], list):
            return " ".join(result["text"]).strip()
        return result["text"].strip()

    return ""
