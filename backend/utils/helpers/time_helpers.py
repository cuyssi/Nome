# ──────────────────────────────────────────────────────────────────────────────
# Ajusta horas ambiguas y corrige expresiones temporales en texto.
# - adjust_ambiguous_hour(dt, now)-> Ajusta horas <12 si corresponde a la tarde/noche.
# - correct_minus_expressions(text)-> Convierte expresiones tipo "8 menos cinco" a "7:55".
# - adjust_time_context(dt, text)-> Ajusta la hora según contexto del texto ("mañana", "tarde", etc.)
# ──────────────────────────────────────────────────────────────────────────────

import re
from datetime import datetime, timedelta

def adjust_ambiguous_hour(dt: datetime, now: datetime):
    if dt.date() != now.date():
        return dt

    if dt.hour < 12 and dt < now:
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
        return f"{new_hour}:{60 - m:02d}"

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
