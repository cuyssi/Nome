# ─────────────────────────────────────────────────────────────────────────────
# │ helpers_fecha — Funciones para sacar fecha y hora desde lo que se dice      │
# │                                                                            │
# │ Detecta expresiones como “mañana”, “el 24 de julio”, “el martes” o “a las 5”│
# │ y las convierte en fechas y horas. Sirve para que Nome entienda cuándo pasa│
# │ algo según cómo se ha dicho.                                               │
# │                                                                            │
# │ @Autor: Ana Castro                                                         │
# ─────────────────────────────────────────────────────────────────────────────

from constants.number_map import number_map
from datetime import datetime, date, timedelta
from typing import Optional
import re

# ------------------------- Helpers fecha -----------------------------------

def find_manual_date(texto: str) -> Optional[datetime]:
    texto = texto.lower()
    pattern = (
        r"(el\s+)?"
        r"(?:lunes|martes|miércoles|jueves|viernes|sábado|domingo)?\s*"
        r"(\d{1,2})\s+de\s+"
        r"(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)"
    )
    match = re.search(pattern, texto)
    if match:
        dia = int(match.group(2))
        mes = {
            "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5,
            "junio": 6, "julio": 7, "agosto": 8, "septiembre": 9,
            "octubre": 10, "noviembre": 11, "diciembre": 12
        }[match.group(3)]
        return datetime.now().replace(
            day=dia, month=mes, hour=0, minute=0, second=0, microsecond=0
        )
    return None


def detect_relative_date(texto: str) -> Optional[date]:
    texto = texto.lower()
    if re.search(r"\bpasado\s+mañana\b", texto):
        return datetime.now().date() + timedelta(days=2)
    elif re.search(r"\bmañana\b", texto):
        return datetime.now().date() + timedelta(days=1)
    elif re.search(r"\bhoy\b", texto):
        return datetime.now().date()
    return None


def extract_weekday(texto: str) -> Optional[str]:
    for dia in [
        "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"
    ]:
        if re.search(rf"\b{dia}\b", texto):
            return dia
    return None


def calculate_date_by_weekday(texto: str) -> Optional[date]:
    texto = texto.lower()
    semana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    hoy = datetime.now()
    hoy_index = hoy.weekday()
    dia_mencionado = None

    for dia in semana:
        if re.search(rf"\b{dia}\b", texto):
            dia_mencionado = dia
            break

    if not dia_mencionado:
        return None

    dia_index = semana.index(dia_mencionado)
    es_proximo = bool(re.search(r"(proximo|que viene|de la semana que viene)", texto))
    delta = dia_index - hoy_index

    if delta < 0 or (delta == 0 and not es_proximo):
        delta += 7
    if es_proximo:
        delta += 7

    return (hoy + timedelta(days=delta)).date()


def extract_decimal_time(texto: str):
    match = re.search(r"(?:a\s+)?las\s+(\d+)[\.:,](\d+)", texto)
    if match:
        hora = int(match.group(1))
        decimal_raw = int(match.group(2))
        minutos = int((decimal_raw / 10) * 60) if decimal_raw < 10 else decimal_raw
        return hora, minutos
    return None

def convertir_a_minutos(valor: Optional[str]) -> int:
    if not valor:
        return 0
    valor = valor.lower()
    if valor == "cuarto":
        return 15
    if valor == "media":
        return 30
    if valor in number_map:
        return number_map[valor]
    try:
        return int(valor)
    except ValueError:
        return 0

def ajustar_hora_por_contexto(hora: int, minutos: int, texto: str,
                              momento_str: Optional[str] = None):
    ahora = datetime.now()
    if momento_str in ["tarde", "noche"] and hora < 12:
        hora += 12
    elif momento_str == "mañana" and hora == 12:
        hora = 0
    else:
        opciones = [
            ahora.replace(hour=hora, minute=minutos, second=0, microsecond=0),
            ahora.replace(hour=(hora + 12) % 24, minute=minutos, second=0, microsecond=0)
        ]
        futuras = [op if op > ahora else op + timedelta(days=1) for op in opciones]
        mejor_opcion = min(futuras, key=lambda x: x - ahora)
        hora = mejor_opcion.hour
        minutos = mejor_opcion.minute

    return hora, minutos

def extract_simple_time(texto_raw: str):
    texto = texto_raw.lower().strip()
    horas_validas = r"una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|\d{1,2}"
    minutos_validos = r"cuarto|media|\d{1,2}"

    patrones = [
        # Ej: "a la una menos cuarto de la mañana"
        rf"(?:a\s+)?(?:la|las)\s+({horas_validas})\s+menos\s+({minutos_validos})(?:\s+de\s+la\s+(mañana|tarde|noche))?",
        # Ej: "a las tres y media de la tarde"
        rf"(?:a\s+)?(?:la|las)\s+({horas_validas})(?:\s+y\s+({minutos_validos}))?(?:\s+de\s+la\s+(mañana|tarde|noche))?"
    ]

    for pattern in patrones:
        match = re.search(pattern, texto, flags=re.IGNORECASE)
        if match:
            hora_str, minutos_str, momento_str = match.groups()

            # Validar hora
            try:
                hora = number_map.get(hora_str) if hora_str in number_map else int(hora_str)
            except ValueError:
                hora = None

            if hora is None:
                continue  # saltar si no se puede interpretar la hora

            minutos = convertir_a_minutos(minutos_str) if minutos_str else 0

            if "menos" in pattern:
                hora -= 1
                minutos = 60 - minutos

            hora, minutos = ajustar_hora_por_contexto(hora, minutos, momento_str)

            # Eliminar solo la expresión horaria del texto original
            start, end = match.start(), match.end()
            texto_sin_hora = texto_raw[:start] + texto_raw[end:]
            texto_sin_hora = re.sub(r'\s{2,}', ' ', texto_sin_hora).strip()

            return (hora, minutos), texto_sin_hora

    # Intento con formato decimal: "a las 13:30"
    decimal_result = extract_decimal_time(texto)
    if decimal_result:
        hora, minutos = decimal_result
        hora, minutos = ajustar_hora_por_contexto(hora, minutos, texto)
        match_decimal = re.search(r"(?:a\s+)?las\s+\d+[\.:,]\d+", texto, re.IGNORECASE)
        if match_decimal:
            start, end = match_decimal.start(), match_decimal.end()
            texto_sin_hora = texto_raw[:start] + texto_raw[end:]
            texto_sin_hora = re.sub(r'\s{2,}', ' ', texto_sin_hora).strip()
        else:
            texto_sin_hora = texto_raw.strip()
        return (hora, minutos), texto_sin_hora

    return None, texto_raw.strip()

