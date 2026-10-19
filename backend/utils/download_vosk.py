import os
import zipfile
import requests

VOSK_URL = "https://alphacephei.com/vosk/models/vosk-model-es-0.42.zip"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "vosk-model-es-0.42")
MODEL_ZIP = os.path.join(BASE_DIR, "model.zip")


def ensure_vosk_model():
    if os.path.isdir(MODEL_DIR):
        print("Modelo Vosk encontrado, usando existente.")
        return

    print(f"Descargando modelo Vosk desde {VOSK_URL}...")

    try:
        with requests.get(
            VOSK_URL, stream=True, timeout=(10, 120)
        ) as response:
            response.raise_for_status()

            with open(MODEL_ZIP, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        file.write(chunk)

        print("Descarga completa, descomprimiendo...")

        with zipfile.ZipFile(MODEL_ZIP, "r") as zip_file:
            if not zip_file.testzip():
                zip_file.extractall(BASE_DIR)
            else:
                raise zipfile.BadZipFile("El archivo ZIP está dañado.")

        if not os.path.isdir(MODEL_DIR):
            raise FileNotFoundError(
                f"No se encontró el modelo extraído en {MODEL_DIR}"
            )

        print("Modelo Vosk listo para usar.")

    finally:
        if os.path.exists(MODEL_ZIP):
            os.remove(MODEL_ZIP)
