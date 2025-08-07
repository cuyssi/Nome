# ──────────────────────────────────────────────────────────────────────────────
# Servicio que utiliza el modelo Faster-Whisper para transcribir archivos de audio.
# - Usa el modelo "tiny" optimizado con ONNX para velocidad incluso en CPU.
# - Detecta si hay GPU disponible y ajusta el tipo de cómputo.
# - Guarda el archivo recibido como temporal en disco.
# - Transcribe el contenido utilizando `model.transcribe`.
# - Mide el tiempo de transcripción y muestra logs útiles.
# - Devuelve el texto plano de la transcripción.
# Ideal como servicio backend para apps de voz a tarea u organización verbal.
# ──────────────────────────────────────────────────────────────────────────────

import time
import tempfile
from fastapi import UploadFile
from faster_whisper import WhisperModel
import torch

# Detecta si hay GPU disponible
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🧠 Usando dispositivo: {device}")

# Define tipo de cómputo según el dispositivo
compute_type = "float16" if device == "cuda" else "int8"

# Carga el modelo Faster-Whisper
model = WhisperModel("medium", device=device, compute_type=compute_type)

async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()
    print(f"📥 Archivo recibido: {file.filename}, tamaño: {len(audio_bytes)} bytes")

    # Guarda el archivo como temporal
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    # Transcribe el audio
    start = time.time()
    segments, info = model.transcribe(temp_audio_path)
    duration = time.time() - start
    print(f"⏱️ Transcripción tardó: {duration:.2f} segundos")
    print(f"🔍 Info del audio: {info}")

    # Une los segmentos en texto plano
    text = " ".join([segment.text for segment in segments])
    return text.strip()
