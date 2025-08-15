# utils/helpers/hour_helpers.py
from datetime import datetime
from typing import Optional, Tuple
import re
from constants.number_map import number_map
import spacy

nlp = spacy.load("es_core_news_sm")  # para capitalizar nombres propios

MINUTE_KEYWORDS = {
    "y cuarto": 15,
    "y media": 30,
    "menos cuarto": -15,
    "y diez": 10,
    "y veinte": 20
}

def add_a_before_las(text: str) -> str:
    text = re.sub(r"(?<!\ba)\s+(?=las\s+\w+)", " a ", text)
    return text

def word_to_minutes(word: Optional[str]) -> int:
    if not word:
        return 0
    word = word.lower()
    if word in ["cuarto", "media"]:
        return 15 if word == "cuarto" else 30
    if word in number_map:
        return number_map[word]
    try:
        return int(word)
    except ValueError:
        return 0

def extract_hour_and_minutes(text: str) -> Tuple[Optional[int], int, str]:
    """Extrae hora y minutos tipo 'a las cuatro y cuarto' o 'a las cinco menos diez'"""
    text = re.sub(r"\s+y\s+", " y ", text.lower())
    text = add_a_before_las(text)
    hour, minute = None, 0

    pattern = (
        r"a las (\d+|" + "|".join(number_map.keys()) + r")"   # la hora
        r"(?:\s*(y|menos)\s*(\d+|cuarto|media|" + "|".join(number_map.keys()) + r"))?"  # y/menos minutos
    )
    match = re.search(pattern, text)

    if match:
        h, operator, m = match.group(1), match.group(2), match.group(3)
        hour = int(h) if h.isdigit() else number_map.get(h)

        if m:
            m_value = word_to_minutes(m)
            if operator == "y":
                minute = m_value
            elif operator == "menos":
                if hour is not None:
                    hour = (hour - 1) % 24
                minute = 60 - m_value
        text = text.replace(match.group(0), "").strip()

    print(f"[extract_hour_and_minutes] hour={hour}, minute={minute}, text='{text}'")
    return hour, minute, text


def adjust_hour_by_context(hour: Optional[int], minute: int, text: str) -> Tuple[Optional[int], int, str]:
    context_map = {
        "por la mañana": "AM",
        "de la mañana": "AM",
        "por la tarde": "PM",
        "de la tarde": "PM",
        "por la noche": "PM",
        "de la noche": "PM"
    }

    text_lower = text.lower()
    am_pm = None
    pm_context = False

    for k, v in context_map.items():
        if k in text_lower:
            am_pm = v
            if "noche" in k:
                pm_context = True
            text_lower = text_lower.replace(k, "")

    if hour is not None and am_pm:
        if am_pm == "AM":
            if hour == 12:
                if pm_context:
                    hour = 0  # medianoche
                else:
                    hour = 12  # 12 de la mañana = mediodía
        elif am_pm == "PM":
            if hour < 12:
                hour += 12

    # Ajuste implícito solo si no hay contexto y la hora ya pasó
    now = datetime.now()
    if hour is not None and not am_pm:
        combined_today = datetime.combine(now.date(), datetime.min.time()).replace(hour=hour, minute=minute)
        if combined_today <= now:
            hour += 12

    return hour, minute, text_lower.strip()


def extract_simple_time(text: str) -> Tuple[Tuple[Optional[int], int], str]:
    hour, minute, text = extract_hour_and_minutes(text)
    hour, minute, text = adjust_hour_by_context(hour, minute, text)
    text = re.sub(r"\s+", " ", text).strip()
    return (hour, minute), text
