# ──────────────────────────────────────────────────────────────────────────────
# Servicio de transcripción de audio usando Vosk y ffmpeg. Combierte el audio que nos
# envia el frontend en texto.
# - Carga el modelo Vosk español.
# - Convierte cualquier archivo a WAV mono 16kHz.
# - Aplica denoise rápido con ffmpeg (afftdn) para limpiar ruidos y que solo utilice la voz.
# - Procesa el audio en chunks para extraer texto con KaldiRecognizer, para que la transcrición
#   sea mas rápida y limpia.
# Devuelve la transcripción limpia como string.
# ──────────────────────────────────────────────────────────────────────────────

import os
import tempfile
import subprocess
import soundfile as sf
from pathlib import Path
from fastapi import UploadFile
from vosk import Model, KaldiRecognizer
from functools import lru_cache
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "vosk-model-es-0.42")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")

@lru_cache(maxsize=1)
def get_model():
    print("Cargando modelo Vosk...")
    return Model(MODEL_PATH)

def clean_audio(input_path: str, output_path: str) -> None:
    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-ac", "1",
        "-ar", "16000",
        "-af", "afftdn",
        output_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def convert_to_wav_mono16k(input_path: str, output_path: str):
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", input_path, "-ac", "1", "-ar", "16000", output_path],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Error al convertir a WAV: {e}")

async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()

    with tempfile.TemporaryDirectory() as tmpdir:
        temp_audio_path = os.path.join(tmpdir, "input.webm")
        wav_path = os.path.join(tmpdir, "input.wav")
        clean_path = os.path.join(tmpdir, "clean.wav")

        with open(temp_audio_path, "wb") as f:
            f.write(audio_bytes)

        convert_to_wav_mono16k(temp_audio_path, wav_path)
        clean_audio(wav_path, clean_path)

        wf, sr = sf.read(clean_path, dtype="int16")
        if sr != 16000:
            raise ValueError(f"La tasa de muestreo debe ser 16kHz, pero es {sr}")

        print("Preparando para cargar modelo Vosk...")
        rec = KaldiRecognizer(get_model(), sr)
        print("✅ Modelo Vosk listo")
        rec.SetWords(True)

        final_text = ""
        step = 4000
        for i in range(0, len(wf), step):
            chunk_bytes = wf[i:i + step].tobytes()
            if rec.AcceptWaveform(chunk_bytes):
                result = json.loads(rec.Result())
                final_text += result.get("text", "") + " "

        final_text += json.loads(rec.FinalResult()).get("text", "")
        return final_text.strip()
