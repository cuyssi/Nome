# ──────────────────────────────────────────────────────────────────────────────
# Función para comprobar si una fecha es hoy.
# - `is_today` recibe un objeto datetime y devuelve True si coincide con la fecha actual.
# Útil para marcar tareas o eventos como "hoy".
# ──────────────────────────────────────────────────────────────────────────────

from datetime import datetime, timedelta
from constants.weekday_map import WEEKDAY_MAP
import re

def is_today(dt):
    if not dt:
        return False
    result = dt.date() == datetime.now().date()

    return result


def adjust_weekday_forward(dt: datetime, text: str, now: datetime) -> datetime:
    for day_word, target_weekday in WEEKDAY_MAP.items():
        if re.search(rf"\b{day_word}\b", text, flags=re.IGNORECASE):
            days_ahead = (target_weekday - now.weekday()) % 7
            if days_ahead == 0 and dt < now:
                days_ahead = 7
            new_date = now + timedelta(days=days_ahead)
            dt = dt.replace(year=new_date.year, month=new_date.month, day=new_date.day)
            break
    return dt
