# ──────────────────────────────────────────────────────────────────────────────
# Función para procesar texto y extraer fecha y hora.
# -Utilizamos las diferentes funciones que tenemos en los helpers para estraer fecha, hora y limpiar el texto.
# Devuelve texto limpio, datetime detectado, hora, minutos y hora en formato HH:MM.
# Cada llamada genera un UUID único para debug.
# ──────────────────────────────────────────────────────────────────────────────

from utils.normalize_text import normalize_text, insert_patterns
from utils.helpers.datetime_helpers import detect_dates_in_text
from utils.helpers.clean_text_helpers import clean_date_and_fragment, format_lists_with_commas

def combine_date_and_time(text):
    import uuid
    print(f"[DATEPARSER] Call ID: {uuid.uuid4()}")

    text, sequence = normalize_text(text)
    dt, data, time_fragment = detect_dates_in_text(text)
    text = clean_date_and_fragment(text, time_fragment)
    text = insert_patterns(text, sequence)
    text = format_lists_with_commas(text)

    if dt is None:
        print(f"[DATEPARSER] No date detected in text: {text}")
        return text, None, None, None, None
    hour = dt.hour
    minutes = dt.minute
    time_str = f"{hour}:{minutes:02d}"

    return text, dt, hour, minutes, time_str
