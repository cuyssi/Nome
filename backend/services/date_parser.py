# ──────────────────────────────────────────────────────────────────────────────
# Funciones para extraer y combinar fecha y hora desde texto de transcripción.
# - find_day_number: busca patrón “<día> <número>” y devuelve el número.
# - combine_date_and_time: detecta fecha manual, relativa o por día semanal.
#   También interpreta hora directa o por contexto (mañana, tarde, noche).
#   Si la hora ya pasó hoy, se ajusta al día siguiente.
# Ideal para transformar instrucciones como “el lunes por la tarde” en objeto útil.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

from datetime import datetime, timedelta
from utils.preprocess import clean_text
from typing import Optional
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


def is_today(dateTime):
    today = datetime.now().date()
    return dateTime.date() == today

def combine_date_and_time(text: str):
    base_date = datetime.now().date()
    now = datetime.now()

    if manual_date := find_manual_date(text):
        base_date = manual_date.date()
    elif weekday := extract_weekday(text):
        if calculated := calculate_date_by_weekday(text):
            base_date = calculated
    elif relative := detect_relative_date(text):
        base_date = relative

    time_result, texto_limpio = extract_simple_time(text)
    if time_result:
        hour, minute = time_result
    else:
        hour, minute = 0, 0

    combined = datetime.combine(base_date, datetime.min.time()).replace(hour=hour, minute=minute)

    if base_date == now.date() and combined.time() <= now.time() and "mañana" not in text.lower():
        combined += timedelta(days=1)

    return combined, texto_limpio
