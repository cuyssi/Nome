# ──────────────────────────────────────────────────────────────────────────────
# Función para procesar texto y extraer fecha y hora.
# -Utilizamos las diferentes funciones que tenemos en los helpers para estraer fecha, hora y limpiar el texto.
# Devuelve texto limpio, datetime detectado, hora, minutos y hora en formato HH:MM.
# Cada llamada genera un UUID único para debug.
# ──────────────────────────────────────────────────────────────────────────────

from utils.normalize_text import normalize_text, insert_patterns
from utils.helpers.datetime_helpers import detect_dates_in_text
from utils.helpers.clean_text_helpers import clean_date_and_fragment, remove_weekday_phrases, format_lists_with_commas
from utils.task_type import useTaskType
from utils.helpers.time_helpers import adjust_time_context
from utils.helpers.date_helpers import extract_custom_days
from datetime import datetime
import uuid

def combine_date_and_time(text):
    uid = str(uuid.uuid4())[:8]
    print(f"[COMBINE:{uid}] original: {text}")

    text, sequence = normalize_text(text)
    print(f"[COMBINE:{uid}] normalize: {text}")

    dt, data, time_fragment, day_fragment = detect_dates_in_text(text)
    custom_days = extract_custom_days(text)
    repeat_type = "custom" if custom_days else "once"
    dt, used_fragment = adjust_time_context(dt, text)

    text = clean_date_and_fragment(text, fragments=[time_fragment, day_fragment, used_fragment])
    print(f"[COMBINE:{uid}] clean fragment: {text}")

    text = remove_weekday_phrases(text)
    text = insert_patterns(text, sequence)
    print(f"[COMBINE:{uid}] insert: {text}")
    text = format_lists_with_commas(text)
    print(f"[COMBINE:{uid}] comas: {text}")

    if dt is None:
        print(f"[COMBINE:{uid}] fallback to default time")
        dt = datetime.now().replace(hour=15, minute=30, second=0, microsecond=0)

    hour = dt.hour
    minutes = dt.minute
    time_str = f"{hour}:{minutes:02d}"
    task_type = useTaskType().getTaskType(text)
    print(f"[COMBINE:{uid}] task type: {task_type}")

    return {
        "text": text,
        "datetime": dt,
        "hour": hour,
        "minutes": minutes,
        "time": time_str,
        "type": task_type,
        "patterns": sequence,
        "uuid": uid,
        "customDays": custom_days,
        "repeat": repeat_type
    }
