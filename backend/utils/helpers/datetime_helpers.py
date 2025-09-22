# ────────────────────────────────────────────────────────────────
# Detecta fechas y horas dentro de un texto
# - parse_day_reference(text, base)-> Detecta referencias tipo "día 3" o "día 3 de septiembre".
# - detect_dates_in_text(text)-> Devuelve la fecha/hora principal, lista de fechas detectadas,
#   fragmento horario y fragmento de día. Ajusta "mañana", horas ambiguas y días de la semana.
# ────────────────────────────────────────────────────────────────

import re
from dateparser.search import search_dates
from datetime import datetime, timedelta
from utils.helpers.time_helpers import adjust_time_context, adjust_ambiguous_hour
from utils.helpers.date_helpers import adjust_weekday_forward
from dateparser import parse


def parse_day_reference(text: str, base: datetime):
    base = base or datetime.now()
    match_full = re.search(
        r"\b(?:el\s+)?día\s+(\d{1,2})\s+de\s+([a-záéíóú]+)\b", text, flags=re.IGNORECASE
    )
    if match_full:
        day = int(match_full.group(1))
        month_name = match_full.group(2).lower()
        dt_candidate = parse(f"{day} {month_name} {base.year}", languages=["es"])
        if dt_candidate and dt_candidate < base:
            dt_candidate = dt_candidate.replace(year=dt_candidate.year + 1)

        return dt_candidate, match_full.group(0)

    match_day_only = re.search(
        r"\b(?:el\s+)?día\s+(\d{1,2})\b", text, flags=re.IGNORECASE
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

        dt_candidate = base.replace(
            year=year, month=month, day=day, hour=15, minute=30, second=0, microsecond=0
        )
        return dt_candidate, match_day_only.group(0)

    return None, None


def detect_dates_in_text(text: str):
    now = datetime.now()
    text_lower = text.lower()
    day_fragment = None
    data = []

    if "pasado mañana" in text_lower:
        dt = now + timedelta(days=2)
        day_fragment = "pasado mañana"
        hour_match = re.search(r"\b(\d{1,2}):(\d{2})\b", text)
        if hour_match:
            hour = int(hour_match.group(1))
            minute = int(hour_match.group(2))
            dt = dt.replace(hour=hour, minute=minute, second=0, microsecond=0)
        else:
            dt = dt.replace(hour=15, minute=30, second=0, microsecond=0)

    elif "mañana" in text_lower and "pasado mañana" not in text_lower:
        dt = now + timedelta(days=1)
        day_fragment = "mañana"
        hour_match = re.search(r"\b(\d{1,2}):(\d{2})\b", text)
        if hour_match:
            hour = int(hour_match.group(1))
            minute = int(hour_match.group(2))
            dt = dt.replace(hour=hour, minute=minute, second=0, microsecond=0)
        else:
            dt = dt.replace(hour=15, minute=30, second=0, microsecond=0)

    else:
        data = search_dates(text, languages=["es"], settings={"RELATIVE_BASE": now})
        dt_day_ref, day_fragment = parse_day_reference(text, base=now)

        if dt_day_ref:
            dt = dt_day_ref
        elif data:
            dates_with_hour = [
                (txt, dt) for txt, dt in data if re.search(r"\d{1,2}[:h]\d{2}", txt)
            ]
            txt, dt = dates_with_hour[-1] if dates_with_hour else data[-1]
            day_fragment = txt
        else:
            dt = None

    if dt is None:
        hour_match = re.search(r"\b(\d{1,2}):(\d{2})\b", text)
        if hour_match:
            hour = int(hour_match.group(1))
            minute = int(hour_match.group(2))
            dt = now.replace(hour=hour, minute=minute, second=0, microsecond=0)

            if dt < now and (
                "de la mañana" in text_lower or "por la mañana" in text_lower
            ):
                dt += timedelta(days=1)

            day_fragment = hour_match.group(0)
        else:
            dt = now.replace(hour=15, minute=30, second=0, microsecond=0)

    dt = adjust_ambiguous_hour(dt, now, text, day_fragment=day_fragment)
    dt = adjust_weekday_forward(dt, text, now)
    dt, time_fragment = adjust_time_context(dt, text)
    print(
        f"[Detect dates in text] time fragment: {time_fragment}, day fragment: {day_fragment}"
    )

    return dt, data, time_fragment, day_fragment
