import re
from utils.preprocess import clean_text
from datetime import datetime

# 🧩 Funciones auxiliares de limpieza

def remove_relative_expressions(text):
    return re.sub(r"\b(pasado\s+mañana|mañana|hoy)\b[,\s]*", "", text, flags=re.IGNORECASE)

def remove_moment_of_day(text):
    text = re.sub(r"\b(de|por|en)\s+la\s+(mañana|tarde|noche)?\b[,\s]*", "", text, flags=re.IGNORECASE)
    return re.sub(r"\b(de|por|en)\s+la\b[,\s]*", "", text, flags=re.IGNORECASE)

def remove_explicit_date(text, day, month_name):
    pattern = rf"(el\s+)?(día\s+)?{day}\s+de\s+{month_name}[,\s]*"
    return re.sub(pattern, "", text, flags=re.IGNORECASE)

def remove_weekday_phrases(text, day):
    days = "lunes|martes|miércoles|jueves|viernes|sábado|domingo"
    text = re.sub(rf"(el\s+)?({days})\s+{day}[,\s]*", "", text, flags=re.IGNORECASE)
    return re.sub(rf"\b({days})\b[,\s]*", "", text, flags=re.IGNORECASE)

def remove_hour_expressions(text, hour, minute):
    hour_text = str(hour if hour < 13 else hour - 12)

    if minute == 30:
        minute_text = "media"
    elif minute == 15:
        minute_text = "cuarto"
    elif minute == 0:
        minute_text = ""
    else:
        minute_text = str(minute)

    # "a las 4 y media"
    pattern_phrase = rf"(a\s+)?las\s+{hour_text}( y {minute_text})?( de la (mañana|tarde|noche))?[,\s]*"
    text = re.sub(pattern_phrase, "", text, flags=re.IGNORECASE)

    # "a las 16.30"
    pattern_decimal = rf"(a\s+)?las\s+{hour}(\.{minute})?( de la (mañana|tarde|noche))?[,\s]*"
    text = re.sub(pattern_decimal, "", text, flags=re.IGNORECASE)

    # "a las 4.54", "a las 3,5"
    return re.sub(r"(a\s+)?las\s+\d+([.,]\d+)?( de la (mañana|tarde|noche))?[,\s]*", "", text, flags=re.IGNORECASE)

def remove_stray_numbers(text):
    # ".54", ",5", "30" sueltos
    text = re.sub(r"\b[.,]?\d{1,2}(\b|(?=\s|$))", "", text)

    # números enteros aislados
    return re.sub(r"(?:^|\s)(\d{1,2})(?=\s|$)", "", text)


# 🧼 Función principal

def clean_final_text(text: str, task_datetime: datetime) -> str:
    text = clean_text(text)
    day = task_datetime.day
    month_name = task_datetime.strftime("%B").lower()
    hour = task_datetime.hour
    minute = task_datetime.minute

    text = remove_relative_expressions(text)
    text = remove_moment_of_day(text)
    text = remove_explicit_date(text, day, month_name)
    text = remove_weekday_phrases(text, day)
    text = remove_hour_expressions(text, hour, minute)
    text = remove_stray_numbers(text)

    final_text = text.strip().rstrip(",.")
    print("🧼 clean_final_text output:", final_text)
    return final_text
