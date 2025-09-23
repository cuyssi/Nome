# ────────────────────────────────────────────────────────────────
# Funciones para manejar fechas y días de la semana
# - is_today(dt)-> Devuelve True si la fecha coincide con el día actual.
# - adjust_weekday_forward(dt, text, now)-> Ajusta la fecha al siguiente día de la semana
#   mencionado en el texto, si corresponde.
# ────────────────────────────────────────────────────────────────

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

def extract_custom_days(text: str):
    """ Devuelve los índices de los días de la semana mencionados en el texto.
    Ejemplo: "todos los lunes y martes" → [0, 1] """
    from constants.weekday_map import WEEKDAY_MAP
    import re

    custom_days = []
    for dia, idx in WEEKDAY_MAP.items():
        if re.search(rf"\b{dia}\b", text, flags=re.IGNORECASE):
            custom_days.append(idx)
    return sorted(list(set(custom_days)))
