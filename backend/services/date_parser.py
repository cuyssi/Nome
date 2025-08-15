# services/date_parser.py
from datetime import datetime, date, timedelta
from typing import Optional, Tuple
from utils.helpers.clean_text_helpers import clean_text, capitalize_proper_names
from utils.helpers.hour_helpers import extract_simple_time
from utils.helpers.date_helpers import find_manual_date, detect_relative_date, extract_weekday, calculate_date_by_weekday
from utils.normalize_text import normalize_text
import re

def combine_date_and_time(text: str) -> Tuple[Optional[datetime], str]:
    """Combine date and time from text, returns (datetime, cleaned_text)"""

    now = datetime.now()
    base_date: date = now.date()
    text_norm = normalize_text(text)

    # 1️⃣ Detectar fecha manual
    manual_dt = find_manual_date(text)
    if manual_dt:
        base_date = manual_dt.date()

    # 2️⃣ Día de la semana
    elif weekday := extract_weekday(text_norm):
        if calculated := calculate_date_by_weekday(text):
            base_date = calculated

    # 3️⃣ Fecha relativa
    elif relative := detect_relative_date(text):
        base_date = relative

    # 4️⃣ Hora y texto limpio
    (hour, minute), text_cleaned = extract_simple_time(text_norm)

    # Valores por defecto si no se detecta hora
    hour = hour if hour is not None else 9
    minute = minute if minute is not None else 0

    combined = datetime.combine(base_date, datetime.min.time()).replace(hour=hour, minute=minute)

    # 5️⃣ Ajuste si ya pasó hoy y no dice 'mañana' ni fecha manual explícita
    if base_date == now.date() and combined <= now and "mañana" not in text.lower() and not manual_dt:
        combined += timedelta(days=1)

    # 6️⃣ Limpiar texto final
    text_final = clean_text(text_cleaned)

    # Quitar expresiones horarias sobrantes
    for exp in ["de la mañana", "por la mañana", "de la tarde", "por la tarde",
                "de la noche", "por la noche", "am", "pm"]:
        text_final = re.sub(exp, "", text_final, flags=re.IGNORECASE)

    # Quitar fechas relativas ya procesadas
    text_final = re.sub(r"\b(hoy|mañana|pasado mañana)\b", "", text_final, flags=re.IGNORECASE)
    # Quitar fechas manuales tipo 'el 28 de septiembre'
    text_final = re.sub(r"(el\s+)?\d{1,2}\s+de\s+\w+", "", text_final, flags=re.IGNORECASE)
    # Quitar días de la semana
    # Quitar días de la semana junto con un posible "el" o "el/la" delante
    text_final = re.sub(r"\b(el\s+)?(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b", "", text_final, flags=re.IGNORECASE)
    # Limpiar espacios y capitalizar
    text_final = re.sub(r"\s+", " ", text_final).strip()
    text_final = capitalize_proper_names(text_final)

    print(f"[combine_date_and_time] combined={combined}, text_final='{text_final}'")
    return combined, text_final
