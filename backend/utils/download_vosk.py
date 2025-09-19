# ────────────────────────────────────────────────────────────────
# Gestiona el modelo de Vosk para transcripción
# - Comprueba si el modelo ya está descargado
# - Si no existe:
#     • Lo descarga desde la URL oficial
#     • Lo descomprime en el directorio actual
#     • Elimina el .zip
# - Deja el modelo listo para usar automáticamente
# ────────────────────────────────────────────────────────────────

import os
import zipfile
import requests

VOSK_URL = "https://alphacephei.com/vosk/models/vosk-model-es-0.42.zip"
MODEL_DIR = "vosk-model-es-0.42"
MODEL_ZIP = "model.zip"

def ensure_vosk_model():
    if not os.path.exists(MODEL_DIR):
        print(f"📥 Modelo Vosk no encontrado, descargando desde {VOSK_URL}...")
        r = requests.get(VOSK_URL, stream=True)
        with open(MODEL_ZIP, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        print("✅ Descarga completa, descomprimiendo...")
        with zipfile.ZipFile(MODEL_ZIP, "r") as zip_ref:
            zip_ref.extractall(".")
        os.remove(MODEL_ZIP)
        print("Modelo Vosk listo para usar.")
    else:
        print("Modelo Vosk encontrado, usando existente.")
