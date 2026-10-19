# ────────────────────────────────────────────────────────────────
# Funciones para combinar fragmentos de texto en fechas y horas
# completas
#
# - adjust_datetime(dt, now)
#     Evita horarios pasados y resuelve horas ambiguas.
#     • Si hoy ha pasado una hora anterior a las 12,
#       suma 12 horas.
#     • Si el resultado sigue en el pasado, pasa al día siguiente.
#
# - sanitize_time_fragment(fragment)
#     Elimina preposiciones finales como 'de' o 'en'.
#
# - normalize_time_fragment(fragment)
#     Normaliza expresiones de hora como 'a las 8' a '8:00'.
#
# - parse_with_dateparser(text, base)
#     Busca fechas y horas en el texto.
#     • Devuelve el datetime y el fragmento detectado.
#     • Si no encuentra nada, devuelve (None, None).
#
# - combine_fragments_to_datetime(text, base=None)
#     Extrae fechas y horas del texto y combina sus fragmentos.
#     • base: datetime opcional para cálculos relativos.
#       Por defecto, usa datetime.now().
#     • Devuelve:
#         • text: texto original.
#         • dt: datetime final, si se detecta.
#         • fragments: diccionario con:
#             • time_fragment: fragmento de hora detectado.
#             • day_fragment: día detectado, si existe.
#             • repeat_fragment: información de repetición.
#             • task_type_override: tipo de tarea según el contexto.
#
#   Flujo de combine_fragments_to_datetime:
#     1. Corrige expresiones como '8 menos cinco'.
#     2. Detecta días relativos (hoy, mañana, pasado mañana).
#     3. Si no encuentra ninguno, busca referencias explícitas.
#     4. Ajusta los días de la semana mencionados.
#     5. Extrae la hora y la combina con la fecha.
#     6. Ajusta el contexto temporal (mañana, tarde o noche).
#     7. Corrige horas ambiguas (<12).
#     8. Evita devolver fechas y horas pasadas.
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


def normalize_time_fragment(fragment):
    match = re.search(
        r"\b(?:a\s+)?las?\s+(\d{1,2})(?::(\d{1,2}))?\b",
        fragment.lower(),
    )

    if not match:
        return fragment

    hour = int(match.group(1))
    minutes = int(match.group(2) or 0)

    return f"{hour}:{minutes:02d}"


def parse_with_dateparser(text, base):
    try:
        data = (
            search_dates(
                text,
                languages=["es"],
                settings={"RELATIVE_BASE": base},
            )
            or []
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
        dt, task_type_override, frag = adjust_weekday_forward(
            dt,
            text_corrected,
            now,
        )
        if frag is not None:
            fragments["day_fragment"] = frag
        if task_type_override is not None:
            fragments["task_type_override"] = task_type_override

    time_frag = extract_time_fragment(text_corrected)

    if time_frag is not None:
        fragments["time_fragment"] = time_frag
        sanitized = sanitize_time_fragment(time_frag)
        sanitized = correct_minus_expressions(sanitized)
        sanitized = normalize_time_fragment(sanitized)

        relative_base = dt if dt is not None else now
        result = search_dates(
            sanitized,
            languages=["es"],
            settings={"RELATIVE_BASE": relative_base},
        )

        if result:
            _, time_dt = result[0]
            if dt is not None:
                dt = dt.replace(hour=time_dt.hour, minute=time_dt.minute)
            else:
                dt = time_dt

    if time_frag:
        original_match = re.search(
            r"\b(?:a\s+)?la?s?\s*\d{1,2}(?::\d{1,2})?\s+"
            r"(?:de la|por la)\s+"
            r"(mañana|tarde|noche|madrugada)\b",
            text_corrected.lower(),
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
        dt, context_frag = adjust_time_context(
            dt, text_corrected + " " + (time_frag or "")
        )
        if context_frag is not None and not fragments["time_fragment"]:
            fragments["time_fragment"] = context_frag

    if dt is not None:
        dt = adjust_ambiguous_hour(dt, now, text_corrected)

    if dt is not None:
        dt = adjust_datetime(dt, now)

    return text, dt, fragments
