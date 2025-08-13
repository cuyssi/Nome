import os
import tempfile
import subprocess
import soundfile as sf
from fastapi import UploadFile
from vosk import Model, KaldiRecognizer
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "vosk-model-es-0.42")


if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")

_model = None

def get_model():
    global _model
    if _model is None:
        print("📦 Cargando modelo Vosk...")
        _model = Model(MODEL_PATH)
    return _model


def convert_to_wav_mono16k(input_path, output_path):
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path,
        "-ac", "1", "-ar", "16000",
        output_path
    ], check=True)

async def transcribe_audio_file(file: UploadFile) -> str:
    audio_bytes = await file.read()
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_audio_path = temp_audio.name

    wav_path = temp_audio_path.replace(".webm", ".wav")
    convert_to_wav_mono16k(temp_audio_path, wav_path)

    wf, sr = sf.read(wav_path, dtype="int16")

    rec = KaldiRecognizer(get_model(), sr)

    rec.SetWords(True)

    final_text = ""
    step = 4000
    for i in range(0, len(wf), step):
        data = wf[i:i + step].tobytes()
        if rec.AcceptWaveform(data):
            result = json.loads(rec.Result())
            final_text += result.get("text", "") + " "

    final_text += json.loads(rec.FinalResult()).get("text", "")

    return final_text.strip()
