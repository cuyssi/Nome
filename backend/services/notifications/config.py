# ──────────────────────────────────────────────────────────────────────────────
# Configuración de claves VAPID y almacenamiento.
# - Carga variables de entorno desde .env (clave pública y privada VAPID).
# - VAPID_CLAIMS → Información de contacto para el servicio de mensajería.
# - JSON_FILE → Ruta al archivo de suscripciones y tareas programadas.
# - MAX_DELAY → Tiempo máximo permitido para programar notificaciones (30 días).
# ──────────────────────────────────────────────────────────────────────────────

import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY")
VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY")
VAPID_CLAIMS = {"sub": "mailto:cuyssi@hotmail.com"}
JSON_FILE = Path(__file__).parent.parent.parent / "api" / "notifications" / "subscriptions.json"
MAX_DELAY = 60 * 60 * 24 * 30
