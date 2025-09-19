# ──────────────────────────────────────────────────────────────────────────────
# Cálculo del delay para programar notificaciones.
# - calcular_delay(task_time_input, notify_minutes_before) → Devuelve el delay en segundos.
#     • task_time_input puede ser datetime, timestamp o string ISO.
#     • notify_minutes_before indica cuántos minutos antes se debe notificar.
#     • Si el tiempo ya ha pasado, devuelve None.
# ──────────────────────────────────────────────────────────────────────────────

from datetime import datetime, timedelta
import math
from dateutil.parser import isoparse

def calcular_delay(task_time_input, notify_minutes_before=15):
    task_time = None
    if isinstance(task_time_input, datetime):
        task_time = task_time_input
    elif isinstance(task_time_input, (int, float)) and math.isfinite(task_time_input):
        task_time = datetime.fromtimestamp(task_time_input)
    elif isinstance(task_time_input, str):
        try:
            task_time = isoparse(task_time_input)
        except Exception:
            return None
    if not task_time:
        return None

    notify_time = task_time - timedelta(minutes=notify_minutes_before)
    now = datetime.now(task_time.tzinfo)
    delay = (notify_time - now).total_seconds()
    return delay if delay > 0 else None
