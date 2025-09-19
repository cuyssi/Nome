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
import wave
from fastapi import UploadFile
from vosk import Model, KaldiRecognizer
from functools import lru_cache
from constants.corrections import CORRECTIONS
import json
import re
import difflib
import noisereduce as nr
import soundfile as sf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "vosk-model-es-0.42")
CUSTOM_WORDS_PATH = os.path.join(BASE_DIR, "custom_words.json")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")

if not os.path.exists(CUSTOM_WORDS_PATH):
    raise FileNotFoundError(f"No se encontró el archivo custom_words.json en {CUSTOM_WORDS_PATH}")

with open(CUSTOM_WORDS_PATH, "r", encoding="utf-8") as f:
    custom_words = json.load(f)

@lru_cache(maxsize=1)
def get_model():
    print("Cargando modelo Vosk...")
    return Model(MODEL_PATH)


def clean_audio(input_path: str, output_path: str) -> None:
    data, rate = sf.read(input_path)
    reduced_noise = nr.reduce_noise(y=data, sr=rate)
    sf.write(output_path, reduced_noise, rate)


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


def fix_transcription_fuzzy(text, custom_words_list):
    words = text.split()
    fixed_words = []

    for w in words:
        match = difflib.get_close_matches(w, custom_words_list, n=1, cutoff=0.75)
        if match:
            fixed_words.append(match[0])
        else:
            fixed_words.append(w)

    fixed_text = " ".join(fixed_words)

    text_lower = fixed_text.lower()
    for wrong, correct in CORRECTIONS.items():
        text_lower = re.sub(rf"\b{re.escape(wrong)}\b", correct, text_lower)

    return text_lower[:1].upper() + text_lower[1:]

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

        wf = wave.open(clean_path, "rb")
        try:
            if wf.getframerate() != 16000:
                raise ValueError(f"La tasa de muestreo debe ser 16kHz, pero es {wf.getframerate()}")

            rec = KaldiRecognizer(get_model(), wf.getframerate(), json.dumps(custom_words))
            rec.SetWords(True)

            results = []

            while True:
                data = wf.readframes(8000)
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    partial = json.loads(rec.Result())
                    if partial.get("text"):
                        results.append(partial["text"])

            final = json.loads(rec.FinalResult())
            if final.get("text"):
                results.append(final["text"])

            final_text = " ".join(results)

        finally:
            wf.close()

        final_text = fix_transcription_fuzzy(final_text, custom_words["words"])
        return final_text.strip()
