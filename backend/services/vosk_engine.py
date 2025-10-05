import os
import json
import wave
from vosk import Model, KaldiRecognizer
import io

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "vosk-model-es-0.42")
CUSTOM_WORDS_PATH = os.path.join(BASE_DIR, "custom_words.json")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")

if not os.path.exists(CUSTOM_WORDS_PATH):
    raise FileNotFoundError(f"No se encontró el archivo custom_words.json en {CUSTOM_WORDS_PATH}")

with open(CUSTOM_WORDS_PATH, "r", encoding="utf-8") as f:
    custom_words = json.load(f)

_model = None
def get_model():
    global _model
    if not _model:
        _model = Model(MODEL_PATH)
    return _model

def fix_transcription_fuzzy(text, custom_words_list):
    import difflib
    import re
    words = text.split()
    fixed_words = []
    for w in words:
        match = difflib.get_close_matches(w, custom_words_list, n=1, cutoff=0.75)
        fixed_words.append(match[0] if match else w)
    return " ".join(fixed_words)

async def transcribe_audio_file(file):
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
