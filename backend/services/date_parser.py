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
    cleaned_text = clean_text(text)
    base_date = detect_relative_date(cleaned_text)
    manual_date = find_manual_date(cleaned_text)

    if manual_date:
        base_date = manual_date.date()

    if not manual_date:
        day_num = find_day_number(cleaned_text)
        if day_num:
            today = datetime.now()
            try:
                base_date = today.replace(day=day_num).date()
            except ValueError:
                pass

    if not base_date:
        weekday = extract_weekday(cleaned_text)
        if weekday:
            base_date = calculate_date_by_weekday(weekday)

    if not base_date:
        base_date = datetime.now().date()

    time_result = extract_simple_time(cleaned_text)
    moment_of_day = re.search(
        r"(de|por|en)\s+la\s+(mañana|tarde|noche)", cleaned_text, flags=re.IGNORECASE
    )

    if time_result:
        hour, minutes = time_result
        dt = datetime.combine(base_date, datetime.min.time()).replace(
            hour=hour,
            minute=minutes
        )
        return dt

    if moment_of_day:
        moment = moment_of_day.group(2).lower()
        if moment == "mañana":
            hour, minutes = 9, 0
        elif moment == "tarde":
            hour, minutes = 18, 0
        elif moment == "noche":
            hour, minutes = 21, 0
        else:
            hour, minutes = 0, 0
        dt = datetime.combine(base_date, datetime.min.time()).replace(
            hour=hour, minute=minutes
        )
        return dt

    return datetime.combine(base_date, datetime.min.time())
