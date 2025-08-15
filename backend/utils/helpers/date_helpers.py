# helpers/date_helpers.py
from datetime import datetime, date, timedelta
from typing import Optional
import re

def is_today(dt: Optional[datetime]) -> bool:
    if not dt:
        return False
    result = dt.date() == datetime.now().date()
    print(f"[is_today] dt={dt} -> {result}")
    return result

def find_manual_date(text: str) -> Optional[datetime]:
    text = text.lower()
    pattern = r"(?:el\s+)?(\d{1,2})\s+de\s+" \
              r"(enero|febrero|marzo|abril|mayo|junio|julio|agosto|" \
              r"septiembre|octubre|noviembre|diciembre)"
    match = re.search(pattern, text)
    if match:
        day = int(match.group(1))
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
    from utils.helpers.date_helpers import extract_weekday
    weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    today = datetime.now()
    today_index = today.weekday()
    day_mentioned = extract_weekday(text)
    if not day_mentioned:
        return None
    day_index = weekdays.index(day_mentioned)
    delta = (day_index - today_index) % 7
    if re.search(r"(próximo|que viene|de la semana que viene)", text.lower()):
        delta += 7
    result = (today + timedelta(days=delta)).date()
    print(f"[calculate_date_by_weekday] {result}")
    return result
