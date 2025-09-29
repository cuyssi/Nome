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
from dateparser.search import search_dates
from constants.constants import WEEKDAY_MAP, WEEKDAYS, WORKDAYS, WEEKEND
import re


def is_today(dt):
    if not dt:
        return False
    result = dt.date() == datetime.now().date()

    return result


def parse_day_reference(text, base):
    base = base or datetime.now()
    match_full = re.search(
        r"\b(?:para\s+)?(?:el\s+)?día\s+(\d{1,2})\s+de\s+([a-záéíóú]+)\b",
        text,
        flags=re.IGNORECASE,
    )

    if match_full:
        frag = match_full.group(0)
        result = search_dates(frag, languages=["es"], settings={"RELATIVE_BASE": base})
        if result:
            _, dt_candidate = result[0]
            if dt_candidate < base:
                dt_candidate = dt_candidate.replace(year=dt_candidate.year + 1)
            return dt_candidate, frag

    match_day_only = re.search(
        r"\b(?:para\s+)?(?:el\s+)?día\s+(\d{1,2})\b", text, flags=re.IGNORECASE
    )
    if match_day_only:
        day = int(match_day_only.group(1))
        month = base.month
        year = base.year
        if day < base.day:
            if month == 12:
                month = 1
                year += 1
            else:
                month += 1
        dt_candidate = base.replace(year=year, month=month, day=day, hour=15, minute=30)
        return dt_candidate, match_day_only.group(0)

    match_full_date = re.search(
        r"\b(?:para\s+)?(el|la)?\s*(\d{1,2})\s+de\s+([a-záéíóú]+)\b",
        text,
        flags=re.IGNORECASE,
    )
    if match_full_date:
        frag = match_full_date.group(0)
        result = search_dates(frag, languages=["es"], settings={"RELATIVE_BASE": base})
        if result:
            _, dt_candidate = result[0]
            return dt_candidate, frag

    return None, None


def detect_relative_day(text, base):
    text_lower = text.lower()

    if "pasado mañana" in text_lower:
        return base + timedelta(days=2), "pasado mañana"

    if re.search(r"\bmañana\b", text_lower) and "pasado mañana" not in text_lower:
        if not re.search(r"(de|por)\s+la\s+mañana", text_lower):
            return base + timedelta(days=1), "mañana"

    if "hoy" in text_lower:
        return base, "hoy"

    return None, None


def adjust_weekday_forward(dt, text, now):
    task_type_override = None
    day_fragment = None

    for day_word, target_weekday in WEEKDAY_MAP.items():
        match = re.search(
            rf"\b((?:el|este|esta|próximo|pasado)\s+){day_word}\b",
            text,
            flags=re.IGNORECASE,
        )
        if match:
            days_ahead = (target_weekday - now.weekday()) % 7
            if days_ahead == 0 and dt < now:
                days_ahead = 7
            new_date = now + timedelta(days=days_ahead)
            dt = dt.replace(year=new_date.year, month=new_date.month, day=new_date.day)

            day_fragment = match.group(0)
            task_type_override = "cita"
            break

    return dt, task_type_override, day_fragment


def extract_custom_days(text):
    text_lower = text.lower()

    if "todos los días" in text_lower or "cada día" in text_lower:
        return "daily", [], "todos los días"
    if "entre semana" in text_lower:
        return "weekdays", [0, 1, 2, 3, 4], "entre semana"
    if "los fines de semana" in text_lower or "el fin de semana" in text_lower:
        return "weekend", [5, 6], "los fines de semana"

    pattern = r"\b(" + "|".join(WEEKDAYS) + r")\b"
    matches = re.findall(pattern, text_lower)

    if matches:
        custom_days = sorted({WEEKDAY_MAP[day] for day in matches})
        repeat_fragment = " ".join(dict.fromkeys(matches))
        return "custom", custom_days, repeat_fragment

    return "once", [], None
