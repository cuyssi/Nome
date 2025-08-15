# services/date_parser.py
from datetime import datetime, date, timedelta
from typing import Optional, Tuple
from utils.helpers.clean_text_helpers import clean_text, capitalize_proper_names
from utils.helpers.hour_helpers import extract_simple_time
from utils.helpers.date_helpers import find_manual_date, detect_relative_date, extract_weekday, calculate_date_by_weekday
import re

def combine_date_and_time(text: str) -> Tuple[Optional[datetime], str]:
    """Combine date and time from text, returns (datetime, cleaned_text)"""
    
    now = datetime.now()
    base_date: date = now.date()

    # 1️⃣ Detectar fecha manual
    if manual := find_manual_date(text):
        base_date = manual.date()
    # 2️⃣ Día de la semana
    elif weekday := extract_weekday(text):
        if calculated := calculate_date_by_weekday(text):
            base_date = calculated
    # 3️⃣ Fecha relativa
    elif relative := detect_relative_date(text):
        base_date = relative

    # 4️⃣ Hora y texto limpio, usar texto original
    (hour, minute), _ = extract_simple_time(text)

    # Valores por defecto si no se detecta hora
    hour = hour if hour is not None else 9
    minute = minute if minute is not None else 0

    combined = datetime.combine(base_date, datetime.min.time()).replace(hour=hour, minute=minute)

    # 5️⃣ Ajuste si ya pasó hoy y no dice 'mañana'
    if base_date == now.date() and combined <= now and "mañana" not in text.lower():
        combined += timedelta(days=1)

    # 6️⃣ Limpiar texto final para mostrar
    _, text_cleaned = extract_simple_time(text)  # <-- usamos el texto que ya quitó la hora

    text_final = clean_text(text_cleaned)

    # Quitar expresiones horarias sobrantes que pudieron quedar
    for exp in ["de la mañana", "por la mañana", "de la tarde", "por la tarde",
                "de la noche", "por la noche", "am", "pm"]:
        text_final = re.sub(exp, "", text_final, flags=re.IGNORECASE)

    # Quitar fechas relativas ya procesadas
    text_final = re.sub(r"\b(hoy|mañana|pasado mañana)\b", "", text_final, flags=re.IGNORECASE)
    text_final = re.sub(r"\s+", " ", text_final).strip()

    # Capitalizar nombres propios y primera letra
    text_final = capitalize_proper_names(text_final)

    print(f"[combine_date_and_time] combined={combined}, text_final='{text_final}'")
    return combined, text_final
