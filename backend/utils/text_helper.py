import re
from utils.preprocess import clean_text
from datetime import datetime


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
    hour_12 = hour if hour <= 12 else hour - 12
    hour_text = str(hour_12)

    if minute == 30:
        minute_text = "media"
    elif minute == 15:
        minute_text = "cuarto"
    elif minute == 0:
        minute_text = ""
    else:
        minute_text = str(minute)

    pattern_plural = rf"\ba\s+las\s+{hour_text}( y {minute_text})?( de la (mañana|tarde|noche))?[,\s]*"
    pattern_singular = rf"\ba\s+la\s+{hour_text}( y {minute_text})?( de la (mañana|tarde|noche))?[,\s]*"

    text = re.sub(pattern_plural, "", text, flags=re.IGNORECASE)
    text = re.sub(pattern_singular, "", text, flags=re.IGNORECASE)

    pattern_decimal = rf"(a\s+)?las\s+{hour}([.,]\d+)?( de la (mañana|tarde|noche))?[,\s]*"
    text = re.sub(pattern_decimal, "", text, flags=re.IGNORECASE)

    text = re.sub(r"(a\s+)?las?\s+\d+([.,]\d+)?( de la (mañana|tarde|noche))?[,\s]*", "", text, flags=re.IGNORECASE)

    return text


def remove_stray_numbers(text):
    text = re.sub(r"\b[.,]?\d{1,2}(\b|(?=\s|$))", "", text)
    return re.sub(r"(?:^|\s)(\d{1,2})(?=\s|$)", "", text)


def remove_articles_before_time_or_date(text: str) -> str:
    text = re.sub(r"\b(el|la|los|las|un|una|unos|unas)\s+(?=a\s+las\s+\d+)", "", text, flags=re.IGNORECASE)

    dias = "lunes|martes|miércoles|jueves|viernes|sábado|domingo"
    text = re.sub(r"\b(el|la|los|las|un|una|unos|unas)\s+(?=(" + dias + r"))", "", text, flags=re.IGNORECASE)

    text = re.sub(r"\b(el|la|los|las|un|una|unos|unas)\s+(?=\d{1,2}\s+de\s+\w+)", "", text, flags=re.IGNORECASE)

    return text


def capitalize_known_words(text):
    nombres = ["maría", "marta", "ana", "juan", "pedro"]
    lugares = ["avilés", "meanas", "oviedo", "gijón", "plaza", "farmacia", "biblioteca", "oficina", "casa"]
    for palabra in nombres + lugares:
        text = re.sub(rf"\b{palabra}\b", palabra.capitalize(), text, flags=re.IGNORECASE)
    return text

def clean_final_text(text: str, task_datetime: datetime) -> str:
    text = clean_text(text)
    hour = task_datetime.hour
    minute = task_datetime.minute

    # Eliminar expresiones de hora
    text = re.sub(r"\ba\s+la\s+una\s+y\s+media\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\ba\s+las?\s+\d+([:.,]\d+)?\b", "", text, flags=re.IGNORECASE)

    # Eliminar expresiones como "y media", "y cuarto", etc.
    text = re.sub(r"\by\s+(media|cuarto|veinte|diez|cinco)\b", "", text, flags=re.IGNORECASE)

    # Normalizar lugares
    lugares = ["biblioteca", "oficina", "casa", "piscina", "canchas", "playa", "tienda", "farmacia", "plaza", "avilés", "meanas"]
    text = re.sub(r"\ba\s+(la\s+)?(" + "|".join(lugares) + r")\b", r"en la \2", text, flags=re.IGNORECASE)

    # Capitalizar nombres y lugares
    text = capitalize_known_words(text)

    # Reconstrucción semántica
    final_text = text.strip()
    final_text = re.sub(r"\s{2,}", " ", final_text)
    final_text = re.sub(r"^quede\b", "Quedé", final_text, flags=re.IGNORECASE)

    # Si no empieza con "quedé" pero tiene estructura de cita, lo convertimos
    if not final_text.lower().startswith("quedé"):
        match = re.search(r"\ben\s+(la|las)\s+\w+\s+con\s+\w+", final_text, re.IGNORECASE)
        if match:
            final_text = "Quedé " + match.group()
            final_text = final_text[0].upper() + final_text[1:]

    if final_text:
        final_text = final_text[0].upper() + final_text[1:]

    return final_text
