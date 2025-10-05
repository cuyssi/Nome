# ──────────────────────────────────────────────────────────────────────────────
# Módulo de transcripción de audio con Vosk y Pydub.
#
# Funcionalidad principal:
#   • Convierte cualquier archivo de audio (WebM, MP3, WAV, etc.) a WAV mono 16kHz.
#   • Transcribe el audio usando el modelo Vosk en español.
#   • Aplica corrección difusa (fuzzy matching) con palabras personalizadas
#     para mejorar la precisión del reconocimiento.
#
# Componentes principales:
#   - MODEL_PATH → Ruta del modelo Vosk ("vosk-model-es-0.42").
#   - CUSTOM_WORDS_PATH → Archivo JSON con palabras personalizadas ("custom_words.json").
#
# Funciones:
#   • get_model():
#       - Carga el modelo Vosk en memoria (solo una vez por instancia del servidor).
#       - Devuelve la instancia global del modelo.
#
#   • fix_transcription_fuzzy(text, custom_words_list):
#       - Usa coincidencia difusa (difflib.get_close_matches)
#         para corregir palabras mal transcritas según la lista personalizada.
#       - Recorre cada palabra del texto y sustituye por su coincidencia más cercana
#         si la similitud es ≥ 0.75.
#
#   • transcribe_audio_file(file):
#       - Recibe un archivo de audio en formato cualquiera (WebM, MP3, etc.).
#       - Convierte el audio a WAV mono con una tasa de muestreo de 16 kHz usando pydub.
#       - Inicializa un reconocedor KaldiRecognizer con el modelo Vosk y las palabras personalizadas.
#       - Procesa el audio completo con rec.AcceptWaveform() para obtener la transcripción final.
#       - Aplica fix_transcription_fuzzy() para refinar los resultados.
#       - Devuelve el texto transcrito limpio y corregido.
#
# Flujo general:
#   1. Se valida la existencia del modelo Vosk y del archivo custom_words.json.
#   2. Se convierte el audio recibido a formato WAV estándar.
#   3. Se pasa al reconocedor de Vosk junto con las palabras personalizadas.
#   4. Se obtiene la transcripción final y se corrige mediante coincidencia difusa.
#
# Dependencias:
#   • vosk.Model, KaldiRecognizer  → Reconocimiento de voz offline.
#   • pydub.AudioSegment           → Conversión de audio entre formatos.
#   • difflib                      → Corrección de palabras por similitud.
#   • json, wave, io, os           → Lectura, escritura y manipulación de archivos.
#
# Retorna:
#   → Texto transcrito (string) limpio y corregido.
#
# Autor: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

import os
import json
import wave
import io
from vosk import Model, KaldiRecognizer
from pydub import AudioSegment
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "vosk-model-es-0.42")
CUSTOM_WORDS_PATH = os.path.join(BASE_DIR, "custom_words.json")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"No se encontró el modelo en {MODEL_PATH}")

if not os.path.exists(CUSTOM_WORDS_PATH):
    raise FileNotFoundError(
        f"No se encontró el archivo custom_words.json en {CUSTOM_WORDS_PATH}"
    )

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

    words = text.split()
    fixed_words = []
    for w in words:
        match = difflib.get_close_matches(w, custom_words_list, n=1, cutoff=0.75)
        fixed_words.append(match[0] if match else w)
    return " ".join(fixed_words)


async def transcribe_audio_file(file):
    t0 = time.time()

    audio_bytes = await file.read()
    t1 = time.time()

    audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format="wav")
    audio = audio.set_channels(1).set_frame_rate(16000)
    audio = audio.normalize()
    audio = audio.strip_silence(silence_len=500, silence_thresh=-40)
    t2 = time.time()

    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")
    wav_io.seek(0)
    t3 = time.time()

    with wave.open(wav_io, "rb") as wf:
        rec = KaldiRecognizer(get_model(), wf.getframerate(), json.dumps(custom_words))
        rec.SetWords(True)

        final_result = ""
        chunk_size = 4000
        while True:
            data = wf.readframes(chunk_size)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result()).get("text", "")
                final_result += result + " "

        final_result += json.loads(rec.FinalResult()).get("text", "")
    t4 = time.time()

    print("⏱️ Tiempos:")
    print("Lectura:", t1 - t0)
    print("Conversión + limpieza:", t2 - t1)
    print("Export WAV:", t3 - t2)
    print("Transcripción (chunks):", t4 - t3)

    final_text = fix_transcription_fuzzy(final_result.strip(), custom_words["words"])
    return final_text.strip()
