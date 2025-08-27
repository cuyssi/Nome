# helpers/date_helpers.py
from datetime import datetime, date, timedelta
from constants.number_map import number_map
from utils.normalize_text import normalize_text

from typing import Optional
import re

def is_today(dt):
    if not dt:
        return False
    result = dt.date() == datetime.now().date()
    print(f"[is_today] dt={dt} -> {result}")
    return result


def find_manual_date(text: str) -> Optional[datetime]:
    """
    Detecta fechas explícitas tipo 'el 28 de septiembre' o 'el veintiocho de septiembre'
    y devuelve un datetime con el año actual.
    """
    text = text.lower()
    text = normalize_text(text)

    # Construir patrón para dígitos o palabras de números
    day_pattern = r"\d{1,2}|" + "|".join(number_map.keys())
    pattern = rf"(?:el\s+)?({day_pattern})\s+de\s+" \
              r"(enero|febrero|marzo|abril|mayo|junio|julio|agosto|" \
              r"septiembre|octubre|noviembre|diciembre)"

    match = re.search(pattern, text)
    if match:
        day_str = match.group(1)
        # Convertir a número
        day = int(day_str) if day_str.isdigit() else number_map.get(day_str)
        if day is None:
            return None  # palabra no reconocida

        month_map = {
            "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
            "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
        }
        month = month_map[match.group(2)]
        now = datetime.now()
        result = datetime(year=now.year, month=month, day=day)
        print(f"[find_manual_date] {result}")
        return result

    return None


def detect_relative_date(text: str) -> Optional[date]:
    text = text.lower()
    today = datetime.now().date()
    if "pasado mañana" in text:
        result = today + timedelta(days=2)
    elif "mañana" in text:
        result = today + timedelta(days=1)
    elif "hoy" in text:
        result = today
    else:
        result = None
    print(f"[detect_relative_date] {result}")
    return result

def extract_weekday(text: str) -> Optional[str]:
    for day in ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]:
        if re.search(rf"\b{day}\b", text):
            print(f"[extract_weekday] {day}")
            return day
    return None

def calculate_date_by_weekday(text: str) -> Optional[date]:
    from utils.helpers.date_helpers import extract_weekday, normalize_text
    weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    today = datetime.now()
    today_index = today.weekday()  # 0=Lunes ... 6=Domingo

    text_norm = normalize_text(text)
    day_mentioned = extract_weekday(text_norm)
    if not day_mentioned:
        return None
    day_index = weekdays.index(day_mentioned)
    delta = (day_index - today_index) % 7
    if re.search(r"(próximo|que viene|de la semana que viene)", text_norm):
        delta += 7
    elif delta == 0:
        # Si dices "el sábado" y hoy es sábado, tomar el sábado siguiente
        delta = 7
    result = (today + timedelta(days=delta)).date()
    print(f"[calculate_date_by_weekday] {result}")
    return result
