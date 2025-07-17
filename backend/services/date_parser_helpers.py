#  ─────────────────────────────────────────────────────────────────────────────
# │ helpers_fecha — Funciones para sacar fecha y hora desde lo que se dice      │
# │                                                                             │
# │ Este archivo detecta si se dice algo como “mañana”, “el 24 de julio” o     │
# │ “el martes” y lo transforma en una fecha. También busca expresiones de     │
# │ hora tipo “a las cinco y cuarto” o “a las 6” y las convierte en números.   │
# │ Sirve para que Nome entienda cuándo pasa algo según cómo se ha dicho.      │
# │                                                                             │
# │ @Autor: Ana Castro                                                          │
#  ─────────────────────────────────────────────────────────────────────────────


from constants.number_map import number_map
from datetime import datetime, date, timedelta
from typing import Optional
import re


def find_manual_date(texto: str) -> Optional[datetime]:
    texto = texto.lower()
    pattern = (
        r"(el\s+)?"
        r"(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)?\s*"
        r"(\d{1,2})\s+de\s+"
        r"(enero|febrero|marzo|abril|mayo|junio|julio|agosto|"
        r"septiembre|octubre|noviembre|diciembre)"
    )
    pattern_NotMonth = r"\b(el\s+)?día\s+(\d{1,2})\b"
    match = re.search(pattern, texto, flags=re.IGNORECASE)
    if match:
        dia = int(match.group(2))
        mes = {
            "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
            "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10,
            "noviembre": 11, "diciembre": 12,
        }[match.group(3)]
        return datetime.now().replace(day=dia, month=mes, hour=0, minute=0, second=0, microsecond=0)

    match_sin_mes = re.search(pattern_NotMonth, texto, flags=re.IGNORECASE)
    if match_sin_mes:
        dia = int(match_sin_mes.group(2))
        hoy = datetime.now()
        try:
            return hoy.replace(day=dia, hour=0, minute=0, second=0, microsecond=0)
        except ValueError:
            return None

    return None
    month_map = {
        "enero": 1,
        "febrero": 2,
        "marzo": 3,
        "abril": 4,
        "mayo": 5,
        "junio": 6,
        "julio": 7,
        "agosto": 8,
        "septiembre": 9,
        "octubre": 10,
        "noviembre": 11,
        "diciembre": 12,
    }
    if match:
        dia = int(match.group(2))
        mes = month_map[match.group(3)]
        return datetime.now().replace(
            day=dia, month=mes, hour=0, minute=0, second=0, microsecond=0
        )
    return None


def detect_relative_date(texto: str) -> Optional[date]:
    texto = texto.lower()
    if re.search(r"\bpasado\s+mañana\b", texto):
        return datetime.now().date() + timedelta(days=2)
    elif re.search(r"\bmañana\b", texto) and not re.search(r"\bpor\s+la\s+mañana\b", texto):
        return datetime.now().date() + timedelta(days=1)
    elif re.search(r"\bhoy\b", texto):
        return datetime.now().date()
    return None


def extract_weekday(texto: str) -> Optional[str]:
    for dia in [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
    ]:
        if re.search(rf"\b{dia}\b", texto, flags=re.IGNORECASE):
            return dia
    return None


def calculate_date_by_weekday(texto: str) -> Optional[date]:
    texto = texto.lower()
    semana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    hoy = datetime.now()
    hoy_index = hoy.weekday()

    # Detectar día mencionado
    dia_mencionado = None
    for dia in semana:
        if re.search(rf"\b{dia}\b", texto):
            dia_mencionado = dia
            break
    print(dia_mencionado)

    if not dia_mencionado:
        return None

    dia_index = semana.index(dia_mencionado)
    print(dia_index)

    es_proximo = bool(re.search(r"(proximo|que viene|de la semana que viene)", texto))

    delta = dia_index - hoy_index
    if delta < 0 or (delta == 0 and not es_proximo):
        delta += 7

    if es_proximo:
        delta += 7
    print(datetime.now(), datetime.now().weekday())
    return (hoy + timedelta(days=delta)).date()


def extract_decimal_time(texto: str):
    match = re.search(r"(?:a\s+)?las\s+(\d+)[\.:,](\d+)", texto)
    if match:
        hora = int(match.group(1))
        decimal_raw = int(match.group(2))
        if decimal_raw < 10:
            minutos = int((decimal_raw / 10) * 60)
        else:
            minutos = decimal_raw
        return hora, minutos
    return None


def extract_simple_time(texto: str):
    texto = texto.lower().strip()
    decimal_result = extract_decimal_time(texto)

    if decimal_result:
        hora, minutos = decimal_result
        momento = re.search(r"de la (mañana|tarde|noche)", texto)
        if momento and hora < 12 and momento.group(1) in ["tarde", "noche"]:
            hora += 12
        return hora, minutos

    pattern = r"(?:a\s+)?las\s+(\d+|\w+)(?:\s+y\s+(cuarto|media|\d+))?(?:\s+de\s+la\s+(mañana|tarde|noche))?"
    match = re.search(pattern, texto, flags=re.IGNORECASE)
    if not match:
        return None

    hora_str = match.group(1)
    minutos_str = match.group(2)
    momento_str = match.group(3)

    hora = number_map.get(hora_str, None)
    if hora is None:
        try:
            hora = int(hora_str)
        except ValueError:
            return None

    minutos = 0
    if minutos_str == "media":
        minutos = 30
    elif minutos_str == "cuarto":
        minutos = 15
    elif minutos_str:
        try:
            minutos = int(minutos_str)
        except ValueError:
            minutos = 0

    # Aplicar lógica según momento_str
    if momento_str in ["tarde", "noche"] and hora < 12:
        hora += 12

    # Si no se especificó, asumir tarde si parece vespertino
    if momento_str is None and hora < 8:
        hora += 12

    return hora, minutos
