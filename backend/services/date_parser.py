# ──────────────────────────────────────────────────────────────────────────────
# Funciones para extraer y combinar fecha y hora desde texto de transcripción.
# - find_day_number: busca patrón “<día> <número>” y devuelve el número.
# - combine_date_and_time: detecta fecha manual, relativa o por día semanal.
#   También interpreta hora directa o por contexto (mañana, tarde, noche).
# Combina la fecha resultante con hora estimada para crear un `datetime` completo.
# Ideal para transformar instrucciones como “el lunes por la tarde” en objeto útil.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

from datetime import datetime
from utils.preprocess import clean_text
from services.date_parser_helpers import (
    find_manual_date,
    extract_simple_time,
    calculate_date_by_weekday,
    extract_weekday,
    detect_relative_date,
)
import re


def find_day_number(text: str) -> int | None:
    pattern = r"\b(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\s+(\d{1,2})\b"
    match = re.search(pattern, text, flags=re.IGNORECASE)
    if match:
        return int(match.group(2))
    return None


def combine_date_and_time(text: str) -> datetime:
    base_date = datetime.now().date()
    manual_date = find_manual_date(text)

    if manual_date:
        base_date = manual_date.date()
    elif weekday := extract_weekday(text):
        calculated = calculate_date_by_weekday(text)
        if calculated:
            base_date = calculated
    elif relative := detect_relative_date(text):
        base_date = relative

    time_result = extract_simple_time(text)
    moment_of_day = re.search(
        r"(de|por|en)\s+la\s+(mañana|tarde|noche)", text, flags=re.IGNORECASE
    )

    if time_result:
        hour, minutes = time_result
    elif moment_of_day:
        moment = moment_of_day.group(2).lower()
        hour, minutes = {"mañana": (9, 0), "tarde": (18, 0), "noche": (21, 0)}.get(
            moment, (0, 0)
        )
    else:
        hour, minutes = 0, 0

    return datetime.combine(base_date, datetime.min.time()).replace(
        hour=hour, minute=minutes
    )
