# ────────────────────────────────────────────────────────────────
# Funciones para manejar fechas y días de la semana
# - is_today(dt)-> Devuelve True si la fecha coincide con el día actual.
#
# - adjust_weekday_forward(dt, text, now)-> Ajusta la fecha al siguiente día de la semana
#   mencionado en el texto, si corresponde.
#
# - extract_custom_days-> Devuelve índices de días de la semana mencionados SOLO si hay
#   palabras de repetición claras: 'cada', 'todos', 'todas'.
# ────────────────────────────────────────────────────────────────

from datetime import datetime, timedelta
from constants.weekday_map import WEEKDAY_MAP
import re
from typing import Tuple

def is_today(dt):
    if not dt:
        return False
    result = dt.date() == datetime.now().date()

    return result


def adjust_weekday_forward(dt: datetime, text: str, now: datetime) -> Tuple[datetime, str | None]:
    task_type_override = None
    for day_word, target_weekday in WEEKDAY_MAP.items():
        if re.search(rf"\b{day_word}\b", text, flags=re.IGNORECASE):
            days_ahead = (target_weekday - now.weekday()) % 7
            if days_ahead == 0 and dt < now:
                days_ahead = 7
            new_date = now + timedelta(days=days_ahead)
            dt = dt.replace(year=new_date.year, month=new_date.month, day=new_date.day)

            if re.search(r"\b(el|este|esta)\s+" + day_word + r"\b", text, flags=re.IGNORECASE):
                task_type_override = "cita"
            break

    return dt, task_type_override


def extract_custom_days(text: str):

    from constants.weekday_map import WEEKDAY_MAP
    import re

    text = text.lower()

    if not re.search(r"\b(cada|todos|todas)\b", text):
        return []

    custom_days = []
    for dia, idx in WEEKDAY_MAP.items():
        if re.search(rf"\b{dia}\b", text):
            custom_days.append(idx)

    return sorted(list(set(custom_days)))
