# ──────────────────────────────────────────────────────────────────────────────
# Módulo de transcripción de audio a texto con Vosk y correcciones personalizadas.
# - get_model() → Carga y cachea el modelo de Vosk (solo una vez en toda la app).
# - fix_transcription_fuzzy(text, custom_words_list) → Corrige la transcripción:
#     • Aplica sustituciones exactas definidas en CORRECTIONS.
#     • Usa fuzzy matching (difflib) contra custom_words.json para mejorar precisión.
#     • Respeta palabras en EXCLUDE_FUZZY (no se alteran, ej. nombres propios).
# - transcribe_audio_file(file) → Función principal para transcribir audio:
#     • Recibe UploadFile (WAV mono 16kHz).
#     • Verifica formato del audio (16000 Hz, 1 canal).
#     • Inicializa KaldiRecognizer con modelo y diccionario de palabras.
#     • Procesa frames y obtiene texto crudo con rec.FinalResult().
#     • Aplica fix_transcription_fuzzy para limpiar y corregir el texto.
# - Restricciones del audio:
#     • Formato WAV.
#     • 1 canal (mono).
#     • Frecuencia 16kHz obligatoria.
# - Devuelve texto final corregido y listo para procesar como tarea.
# ──────────────────────────────────────────────────────────────────────────────

from vosk import Model, KaldiRecognizer
from functools import lru_cache
from constants.corrections import CORRECTIONS
import wave
import io
import json
import difflib
import re
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "vosk-model-es-0.42")
CUSTOM_WORDS_PATH = os.path.join(BASE_DIR, "custom_words.json")
EXCLUDE_FUZZY = {"psicólogo", "médico", "Ana", "Joan", "Marcos", "Paqui", "Pedro"}

with open(CUSTOM_WORDS_PATH, "r", encoding="utf-8") as f:
    custom_words = json.load(f)


@lru_cache(maxsize=1)
def get_model():
    return Model(MODEL_PATH)


def fix_transcription_fuzzy(text, custom_words_list):
    text_lower = text.lower()
    for wrong, correct in CORRECTIONS.items():
        text_lower = re.sub(rf"\b{re.escape(wrong)}\b", correct, text_lower)
    words = text_lower.split()
    fixed_words = []
    for w in words:
        if w in EXCLUDE_FUZZY:
            fixed_words.append(w)
            continue
        match = difflib.get_close_matches(w, custom_words_list, n=1, cutoff=0.75)
        fixed_words.append(match[0] if match else w)
    return " ".join(fixed_words)


async def transcribe_audio_file(file):
    """Recibe WAV mono 16kHz desde frontend y transcribe con Vosk aplicando fuzzy."""
    audio_bytes = await file.read()

    with wave.open(io.BytesIO(audio_bytes), "rb") as wf:
        if wf.getframerate() != 16000 or wf.getnchannels() != 1:
            raise ValueError("El audio debe ser WAV mono a 16kHz")

        rec = KaldiRecognizer(get_model(), wf.getframerate(), json.dumps(custom_words))
        rec.SetWords(True)

        data = wf.readframes(wf.getnframes())
        rec.AcceptWaveform(data)

        final_text = json.loads(rec.FinalResult()).get("text", "")

    final_text = fix_transcription_fuzzy(final_text, custom_words["words"])

    return final_text.strip()
