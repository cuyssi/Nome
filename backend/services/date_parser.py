# ──────────────────────────────────────────────────────────────────────────────
# Función para procesar texto y extraer fecha y hora.
# -Utilizamos las diferentes funciones que tenemos en los helpers para estraer fecha, hora y limpiar el texto.
# Devuelve texto limpio, datetime detectado, hora, minutos y hora en formato HH:MM.
# Cada llamada genera un UUID único para debug.
# ──────────────────────────────────────────────────────────────────────────────

from utils.normalize_text import normalize_text, insert_patterns
from utils.helpers.datetime_helpers import detect_dates_in_text
from utils.helpers.clean_text_helpers import clean_date_and_fragment, remove_weekday_phrases, format_lists_with_commas
import uuid

def combine_date_and_time(text):
    text, sequence = normalize_text(text)
    print(f"[COMBINE] normalize: {text}")
    dt, data, time_fragment, day_fragment = detect_dates_in_text(text)
    print(f"[COMBINE] detect dates: {text}")
    text = clean_date_and_fragment(text, fragments=[time_fragment, day_fragment])
    print(f"[COMBINE] clean fragment: {text}")
    text = remove_weekday_phrases(text)
    text = insert_patterns(text, sequence)
    print(f"[COMBINE] insert: {text}")
    text = format_lists_with_commas(text)
    print(f"[COMBINE] comas: {text}")

    if dt is None:
        print(f"[DATEPARSER] No date detected in text: {text}")
        return text, None, None, None, None
    hour = dt.hour
    minutes = dt.minute
    time_str = f"{hour}:{minutes:02d}"

    return text, dt, hour, minutes, time_str
