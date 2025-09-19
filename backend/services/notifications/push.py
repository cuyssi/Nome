# ──────────────────────────────────────────────────────────────────────────────
# Envío de notificaciones push con Web Push Protocol.
# - send_push_notification(subscription, payload) → Envía una notificación al dispositivo suscrito.
#     • Utiliza pywebpush con claves VAPID para autenticación.
#     • Convierte el payload a JSON.
#     • Captura errores con WebPushException y muestra detalles si están disponibles.
# ──────────────────────────────────────────────────────────────────────────────

import json
from pywebpush import webpush, WebPushException
from typing import Dict, Union, cast
from services.notifications.config import VAPID_PRIVATE_KEY, VAPID_CLAIMS

def send_push_notification(subscription, payload):
    try:
        webpush(
            subscription_info=subscription,
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=cast(Dict[str, Union[str, int]], VAPID_CLAIMS),
        )
        print("Notificación enviada")

    except WebPushException as ex:
        print("Error al enviar notificación:", repr(ex))
        if ex.response:
            print("📄 Detalles:", ex.response.text)
