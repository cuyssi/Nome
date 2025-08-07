# ──────────────────────────────────────────────────────────────────────────────
# Servicio que utiliza el modelo Whisper para transcribir archivos de audio.
# - Usa el modelo Whisper "tiny" para máxima velocidad con buena precisión.
# - Detecta si hay GPU disponible y usa fp16 si es posible.
# - Guarda el archivo recibido como temporal en disco.
# - Transcribe el contenido utilizando `model.transcribe`.
# - Mide el tiempo de transcripción y muestra logs útiles.
# - Devuelve el texto plano de la transcripción.
# Ideal como servicio backend para apps de voz a tarea u organización verbal.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

import time
import torch
import whisper
import tempfile
from fastapi import UploadFile

# Detecta si hay GPU disponible
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🧠 Usando dispositivo: {device}")

# Carga el modelo Whisper en el dispositivo adecuado
model = whisper.load_model("tiny", device=device)

# Determina si usar fp16 (solo si hay GPU)
use_fp16 = device == "cuda"

async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()
    print(f"📥 Archivo recibido: {file.filename}, tamaño: {len(audio_bytes)} bytes")

    # Guarda el archivo como temporal
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    # Transcribe el audio
    start = time.time()
    result = model.transcribe(temp_audio_path, fp16=use_fp16)
    duration = time.time() - start
    print(f"⏱️ Transcripción tardó: {duration:.2f} segundos")
    print(f"🔍 Resultado Whisper: {repr(result)}")

    # Devuelve el texto limpio
    text = result.get("text", "")
    if isinstance(text, list):
        text = " ".join(text)
    return text.strip()
