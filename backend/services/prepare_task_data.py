# ──────────────────────────────────────────────────────────────────────────────
# Función principal para procesar texto y preparar los datos de la tarea.
# - normalize_text(text) → Normaliza y corrige expresiones temporales en el texto.
# - combine_fragments_to_datetime(text) → Detecta fragmentos de tiempo, día y repetición
#     • Devuelve un datetime base (dt) y un diccionario con los fragmentos encontrados.
# - extract_custom_days(text) → Identifica si la tarea tiene repetición personalizada
#     (ej. lunes, miércoles, viernes) y devuelve repeat_type y custom_days.
# - Limpieza de texto:
#     • clean_date_and_fragment(text, fragments) → Elimina fragmentos explícitos de fecha/hora/repetición.
#     • remove_weekday_phrases(text) → Elimina frases redundantes con días de la semana.
#     • clean_repeat_connectors(text, custom_days, repeat_type) → Corrige conectores en listas de repetición.
# - Formateo del texto:
#     • insert_patterns(text, sequence) → Inserta patrones extraídos.
#     • format_lists_with_commas(text) → Da formato con comas a las listas.
#     • capitalize_custom_words(text, custom_words) → Capitaliza palabras personalizadas.
#     • capitalize_text(text) → Capitaliza la primera letra de la frase.
# - useTaskType().getTaskType(text, repeat) → Clasifica el tipo de tarea según el texto.
# - Si no hay datetime (dt), se asigna la hora por defecto (15:30).
# - Devuelve un diccionario con:
#     • text → Texto limpio y procesado.
#     • datetime → Objeto datetime completo.
#     • hour, minutes, time → Hora extraída en distintos formatos.
#     • type → Tipo de tarea detectado (ej. cita, recordatorio, etc.).
#     • patterns → Secuencia de patrones aplicados durante la normalización.
#     • uuid → Identificador único de la tarea.
#     • customDays → Días personalizados de repetición.
#     • repeat → Tipo de repetición detectado.
# ──────────────────────────────────────────────────────────────────────────────

from utils.helpers.datetime_helpers import combine_fragments_to_datetime
from utils.task_type import useTaskType
from utils.helpers.date_helpers import extract_custom_days
from utils.print_task_result import print_task_result
from datetime import datetime
import json
import os
import uuid

from utils.normalize_text import (
    normalize_text,
    insert_patterns,
    capitalize_custom_words,
    capitalize_text,
)

from utils.helpers.clean_text_helpers import (
    clean_date_and_fragment,
    remove_weekday_phrases,
    format_lists_with_commas,
    clean_repeat_connectors,
)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CUSTOM_WORDS_PATH = os.path.join(BASE_DIR, "../services/custom_words.json")

with open(CUSTOM_WORDS_PATH, "r", encoding="utf-8") as f:
    custom_words = json.load(f)


def prepare_task_data(text):
    steps = {}

    uid = str(uuid.uuid4())[:8]
    steps["uuid"] = uid

    text_norm, sequence = normalize_text(text)
    steps["normalize_text"] = text_norm

    text_dt, dt, frag_dict = combine_fragments_to_datetime(text_norm)
    steps["combine_fragments_to_datetime"] = {"text": text_dt, "fragments": frag_dict}

    time_fragment = frag_dict["time_fragment"]
    day_fragment = frag_dict["day_fragment"]
    repeat_fragment = frag_dict["repeat_fragment"]
    task_type_override = frag_dict["task_type_override"]

    repeat_type, custom_days, repeat_frag = extract_custom_days(text_dt)
    if repeat_frag and not day_fragment:
        day_fragment = repeat_frag

    steps["extract_custom_days"] = {
        "repeat_type": repeat_type,
        "custom_days": custom_days,
    }

    safe_fragments = [time_fragment]
    if day_fragment and len(day_fragment) > 2:
        safe_fragments.append(day_fragment)

    text_clean = clean_date_and_fragment(text_dt, fragments=safe_fragments)
    steps["clean_date_and_fragment"] = text_clean

    text_clean = remove_weekday_phrases(text_clean)
    steps["remove_weekday_phrases"] = text_clean

    text_clean = clean_repeat_connectors(text_clean, custom_days, repeat_type)
    steps["clean_repeat_connectors"] = text_clean

    text_clean = insert_patterns(text_clean, sequence)
    steps["insert_patterns"] = text_clean

    text_clean = format_lists_with_commas(text_clean)
    steps["format_lists_with_commas"] = text_clean

    text_clean = capitalize_custom_words(text_clean, custom_words)
    steps["capitalize_custom_words"] = text_clean

    text_clean = capitalize_text(text_clean)
    steps["capitalize_text"] = text_clean

    task_type = useTaskType().getTaskType(text_clean, repeat=repeat_type)
    if task_type_override:
        task_type = task_type_override
    steps["task_type"] = task_type

    if dt is None:
        dt = datetime.now().replace(hour=15, minute=30, second=0, microsecond=0)
    else:
        if not time_fragment:
            dt = dt.replace(hour=15, minute=30)
    steps["final_datetime"] = dt

    hour = dt.hour
    minutes = dt.minute
    time_str = f"{hour}:{minutes:02d}"

    result = {
        "text": text_clean,
        "datetime": dt,
        "hour": hour,
        "minutes": minutes,
        "time": time_str,
        "type": task_type,
        "patterns": sequence,
        "uuid": uid,
        "customDays": custom_days,
        "repeat": repeat_type,
    }

    print_task_result(result, steps, text)

    return result
