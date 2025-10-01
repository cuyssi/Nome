# ────────────────────────────────────────────────────────────────
# Funciones para combinar fragmentos de texto en fechas y horas completas
#
# - adjust_datetime(dt, now)
#     Ajusta la fecha/hora para evitar horarios pasados y horas ambiguas.
#     • Si la fecha es hoy y la hora es menor a 12 y ya pasó, la ajusta sumando 12 horas.
#     • Si la fecha/hora resultante es anterior a ahora, la pasa al día siguiente.
#
# - sanitize_time_fragment(fragment)
#     Limpia un fragmento de hora eliminando preposiciones finales como 'de', 'en'.
#
# - parse_with_dateparser(text, base)
#     Usa dateparser para buscar fechas y horas en un texto.
#     • Devuelve un datetime y el fragmento de texto detectado.
#     • Retorna (None, None) si no se detecta nada.
#
# - combine_fragments_to_datetime(text, base=None)
#     Función principal para extraer fecha y hora de un texto y sus fragmentos.
#     • base: datetime opcional para cálculos relativos (por defecto datetime.now()).
#     • Devuelve:
#         • text: texto original (posiblemente corregido internamente).
#         • dt: datetime final con día y hora combinados.
#         • fragments: diccionario con fragmentos detectados:
#             • time_fragment: hora detectada en texto, si existe.
#             • day_fragment: día detectado (relativo o explícito), si existe.
#             • repeat_fragment: información de repetición, si se detecta.
#             • task_type_override: tipo de tarea detectado según contexto de fecha/día.
#
#   Flujo de combine_fragments_to_datetime:
#     1. Corrige expresiones tipo '8 menos cinco' con correct_minus_expressions.
#     2. Detecta días relativos (hoy, mañana, pasado mañana) con detect_relative_day.
#     3. Si no se detecta, busca referencias explícitas con parse_day_reference.
#     4. Ajusta días de la semana mencionados con adjust_weekday_forward.
#     5. Extrae fragmentos de hora con extract_time_fragment y los combina con la fecha.
#     6. Ajusta contexto temporal (mañana/tarde/noche) con adjust_time_context.
#     7. Corrige horas ambiguas (<12) con adjust_ambiguous_hour.
#     8. Ajusta la fecha final para evitar pasadas con adjust_datetime.
# ────────────────────────────────────────────────────────────────

from dateparser.search import search_dates
from datetime import datetime, timedelta
import re

from utils.helpers.time_helpers import (
    adjust_time_context,
    adjust_ambiguous_hour,
    extract_time_fragment,
    correct_minus_expressions,
)
from utils.helpers.date_helpers import (
    adjust_weekday_forward,
    detect_relative_day,
    parse_day_reference,
)


def adjust_datetime(dt, now):
    if dt.date() == now.date() and dt < now and dt.hour < 12:
        dt = dt.replace(hour=dt.hour + 12)
    if dt < now:
        dt = dt + timedelta(days=1)
    return dt


def sanitize_time_fragment(fragment):
    return re.sub(r"\b(de|en)\b$", "", fragment.strip()).strip()


def parse_with_dateparser(text, base):
    try:
        data = (
            search_dates(text, languages=["es"], settings={"RELATIVE_BASE": base}) or []
        )
    except Exception:
        return None, None

    if data:
        txt, parsed_dt = data[-1]
        return parsed_dt, txt
    return None, None


def combine_fragments_to_datetime(text, base=None):
    now = base if base is not None else datetime.now()
    dt = None
    fragments = {
        "time_fragment": "",
        "day_fragment": None,
        "repeat_fragment": None,
        "task_type_override": None,
    }

    text_corrected = correct_minus_expressions(text)

    dt_candidate, frag = detect_relative_day(text_corrected, now)
    if dt_candidate:
        dt = dt_candidate
        if frag is not None:
            fragments["day_fragment"] = frag

    if dt is None:
        dt_candidate, frag = parse_day_reference(text_corrected, now)
        if dt_candidate:
            dt = dt_candidate
            if frag is not None:
                fragments["day_fragment"] = frag

    if dt is not None:
        dt, task_type_override, frag = adjust_weekday_forward(dt, text_corrected, now)
        if frag is not None:
            fragments["day_fragment"] = frag
        if task_type_override is not None:
            fragments["task_type_override"] = task_type_override

    time_frag = extract_time_fragment(text_corrected)
    if time_frag is not None:
        fragments["time_fragment"] = time_frag
        sanitized = sanitize_time_fragment(time_frag)

        relative_base = dt if dt is not None else now
        result = search_dates(
            sanitized, languages=["es"], settings={"RELATIVE_BASE": relative_base}
        )
        if result:
            _, time_dt = result[0]
            if dt is not None:
                dt = dt.replace(hour=time_dt.hour, minute=time_dt.minute)
            else:
                dt = time_dt

    if time_frag:
        original_match = re.search(
            r"\b(?:a\s+)?la?s?\s*\d{1,2}(?::\d{1,2})?\s+(?:de la|por la)\s+(mañana|tarde|noche|madrugada)\b",
            text_corrected.lower()
        )
        if original_match:
            fragments["time_fragment"] = original_match.group(0).strip()

    if dt is None and time_frag:
        match = re.match(r"^(\d{1,2})(?:\s+de la tarde)$", time_frag)
        if match:
            hour = int(match.group(1))
            if hour < 12:
                hour += 12
            dt = now.replace(hour=hour, minute=0)

    if dt is not None:
        dt, context_frag = adjust_time_context(dt, text_corrected)
        if context_frag is not None and fragments["time_fragment"] is None:
            fragments["time_fragment"] = context_frag

    if dt is not None:
        dt = adjust_ambiguous_hour(dt, now, text_corrected)

    if dt is not None:
        dt = adjust_datetime(dt, now)

    return text, dt, fragments
