# ──────────────────────────────────────────────────────────────────────────────
# Ajusta horas ambiguas y corrige expresiones temporales en texto.
# - adjust_ambiguous_hour(dt, now)-> Ajusta horas <12 si corresponde a la tarde/noche.
# - correct_minus_expressions(text)-> Convierte expresiones tipo "8 menos cinco" a "7:55".
# - adjust_time_context(dt, text)-> Ajusta la hora según contexto del texto ("mañana", "tarde", etc.)
# ──────────────────────────────────────────────────────────────────────────────

import re
from typing import Optional
from datetime import datetime, timedelta

def adjust_ambiguous_hour(dt: datetime, now: datetime, text: str, day_fragment: Optional[str] = None):

    text_lower = text.lower()
    explicit_hour = re.search(r'\b\d{1,2}(:\d{2})?\b', text) is not None
    has_morning = "de la mañana" in text_lower or "por la mañana" in text_lower
    has_tarde = "de la tarde" in text_lower or "por la tarde" in text_lower
    has_noche = "de la noche" in text_lower or "por la noche" in text_lower
    has_madrugada = "de la madrugada" in text_lower or "por la madrugada" in text_lower

    if day_fragment and not any([has_morning, has_tarde, has_noche, has_madrugada]):
        if dt.hour < 8 or dt.hour > 20:
            dt = dt.replace(hour=14, minute=30)
        return dt

    if explicit_hour and dt < now:
        if has_morning or has_madrugada:
            dt += timedelta(days=1)
        elif has_tarde or has_noche:
            if dt.hour < 12:
                dt = dt.replace(hour=dt.hour + 12)
        else:
            if dt.hour < 12:
                dt = dt.replace(hour=dt.hour + 12)

    return dt


def correct_minus_expressions(text):
    def replacement(match):
        hour_str = match.group(1)
        minutes = match.group(2).lower()
        hour = int(hour_str.split(":")[0]) if ":" in hour_str else int(hour_str)
        mapping = {"cuarto": 15, "media": 30, "diez": 10, "veinte": 20, "cinco": 5}
        m = int(minutes) if minutes.isdigit() else mapping.get(minutes, None)
        if m is None:
            return match.group(0)

        new_hour = hour - 1 if hour > 0 else 23
        result = f"{new_hour}:{60 - m:02d}"

        if "de la tarde" in text.lower() or "por la tarde" in text.lower():
            new_hour_24 = new_hour + 12 if new_hour < 12 else new_hour
            result = f"{new_hour_24}:{60 - m:02d}"

        return result

    return re.sub(r"\b(\d{1,2}(?::\d{2})?)\s+menos\s+(\w+)\b", replacement, text, flags=re.IGNORECASE)


def adjust_time_context(dt: datetime, text: str):
    text = text.lower()
    used_fragment = None
    explicit_hour = re.search(r'\b\d{1,2}(:\d{2})?\b', text) is not None

    if "por la mañana" in text:
        used_fragment = "por la mañana"
        if not explicit_hour:
            dt = dt.replace(hour=9, minute=0, second=0, microsecond=0)
    elif "de la mañana" in text:
        used_fragment = "de la mañana"
        if not explicit_hour:
            dt = dt.replace(hour=9, minute=0, second=0, microsecond=0)

    elif "por la noche" in text:
        used_fragment = "por la noche"
        if explicit_hour and 1 <= dt.hour <= 11:
            dt = dt.replace(hour=dt.hour + 12)
        elif not explicit_hour:
            dt = dt.replace(hour=21, minute=0, second=0, microsecond=0)

    elif "de la noche" in text:
        used_fragment = "de la noche"
        if explicit_hour and 1 <= dt.hour <= 11:
            dt = dt.replace(hour=dt.hour + 12)
        elif not explicit_hour:
            dt = dt.replace(hour=21, minute=0, second=0, microsecond=0)

    elif "por la tarde" in text:
        used_fragment = "por la tarde"
        if explicit_hour and 1 <= dt.hour <= 11:
            dt = dt.replace(hour=dt.hour + 12)
        elif not explicit_hour:
            dt = dt.replace(hour=15, minute=0, second=0, microsecond=0)

    elif "de la tarde" in text:
        used_fragment = "de la tarde"
        if explicit_hour and 1 <= dt.hour <= 11:
            dt = dt.replace(hour=dt.hour + 12)
        elif not explicit_hour:
            dt = dt.replace(hour=15, minute=0, second=0, microsecond=0)

    elif "por la madrugada" in text:
        used_fragment = "por la madrugada"
        if not explicit_hour:
            dt = dt.replace(hour=3, minute=0, second=0, microsecond=0)

    elif "de la madrugada" in text:
        used_fragment = "de la madrugada"
        if not explicit_hour:
            dt = dt.replace(hour=3, minute=0, second=0, microsecond=0)

    return dt, used_fragment
