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
model_size = "small"
print(f"📦 Cargando modelo: {model_size} con compute_type: {compute_type}")
model = WhisperModel(model_size, device=device, compute_type=compute_type)

async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()
    print(f"📥 Archivo recibido: {file.filename}, tamaño: {len(audio_bytes)} bytes")

    # Guarda el archivo como temporal
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    # Transcribe el audio y mide tiempo
    start = time.time()
    segments, info = model.transcribe(temp_audio_path)
    duration = time.time() - start

    print(f"⏱️ Transcripción completada en {duration:.2f} segundos")
    print(f"🔍 Info del audio: duración={info.duration:.2f}s, idioma={info.language}")
    print(f"📚 Rendimiento: {info.duration / duration:.2f}x real time")

    # Une los segmentos en texto plano
    text = " ".join([segment.text for segment in segments])
    return text.strip()
