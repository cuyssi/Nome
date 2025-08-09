import time
import tempfile
import os
import subprocess
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


def convert_to_mono(input_path, output_path):
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path,
        "-ac", "1", "-ar", "16000",
        output_path
    ], check=True)


def chunk_audio(audio_path, chunk_length_sec=10):
    temp_dir = tempfile.mkdtemp()
    output_pattern = os.path.join(temp_dir, "chunk_%03d.wav")

    subprocess.run([
        "ffmpeg", "-i", audio_path,
        "-f", "segment",
        "-segment_time", str(chunk_length_sec),
        "-c", "copy",
        output_pattern
    ], check=True)

    return sorted([
        os.path.join(temp_dir, f) for f in os.listdir(temp_dir)
        if f.startswith("chunk_") and f.endswith(".wav")
    ])


def transcribe_chunk(chunk_path):
    segments, _ = model.transcribe(chunk_path)
    return " ".join([seg.text for seg in segments])


async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()
    print(f"📥 Archivo recibido: {file.filename}, tamaño: {len(audio_bytes)} bytes")

    # Guarda el archivo como temporal
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    # Convertir a mono y 16kHz
    mono_path = temp_audio_path.replace(".webm", "_mono.wav")
    convert_to_mono(temp_audio_path, mono_path)

    # Dividir en chunks con ffmpeg
    chunk_paths = chunk_audio(mono_path, chunk_length_sec=10)

    # Transcribir por chunks
    start = time.time()
    full_text = ""
    for i, chunk_path in enumerate(chunk_paths):
        print(f"🎙️ Transcribiendo chunk {i + 1}/{len(chunk_paths)}...")
        full_text += transcribe_chunk(chunk_path) + " "
    duration = time.time() - start

    print(f"⏱️ Transcripción por chunks completada en {duration:.2f} segundos")
    return full_text.strip()
