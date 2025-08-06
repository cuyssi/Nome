# ──────────────────────────────────────────────────────────────────────────────
# Servicio que utiliza el modelo Whisper para transcribir archivos de audio.
# - Carga el modelo Whisper con tamaño "medium" para equilibrio entre precisión y rendimiento.
# - Fuerza uso de CPU si no hay GPU disponible.
# - Guarda el archivo recibido como `temp_audio.mp3` en disco.
# - Transcribe el contenido utilizando `model.transcribe` con `fp16=False`.
# - Mide el tiempo de transcripción y muestra logs útiles.
# - Limpia y une el texto transcrito si se devuelve como lista.
# Devuelve el texto plano de la transcripción para usarlo en el endpoint principal.
# Ideal como servicio backend para apps de voz a tarea u organización verbal.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

import time
import torch
import whisper
from fastapi import UploadFile

# Detecta si hay GPU disponible
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🧠 Usando dispositivo: {device}")

# Carga el modelo Whisper en el dispositivo adecuado
model = whisper.load_model("medium", device=device)


async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()

    with open("temp_audio.mp3", "wb") as f:
        f.write(audio_bytes)

    print(f"📥 Archivo recibido: {file.filename}, tamaño: {len(audio_bytes)} bytes")

    start = time.time()
    result = model.transcribe("temp_audio.mp3", fp16=False)
    duration = time.time() - start
    print(f"⏱️ Transcripción tardó: {duration:.2f} segundos")
    print(f"🔍 Resultado Whisper: {repr(result)}")

    if (
        isinstance(result, dict)
        and "text" in result
        and isinstance(result["text"], (str, list))
    ):
        if isinstance(result["text"], list):
            return " ".join(result["text"]).strip()
        return result["text"].strip()

    return ""
