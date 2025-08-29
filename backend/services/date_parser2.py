from utils.helpers2.normalize_text2 import normalize, insert_patterns
from utils.helpers2.datetime_helpers2 import detect_dates
from utils.helpers2.clean_text_helpers2 import limpiar_fecha_y_fragmento, formatear_listas_con_comas

def combine_date_and_time2(text):
    import uuid
    print(f"[DATEPARSER] llamada ID: {uuid.uuid4()}")

    text, secuencia = normalize(text)
    dt, data, fragmento_horario = detect_dates(text)
    text = limpiar_fecha_y_fragmento(text, data, fragmento_horario)
    text = insert_patterns(text, secuencia)
    text = formatear_listas_con_comas(text)    

    if dt is None:
        print(f"[DATEPARSER] No se detectó fecha en el texto: {text}")
        return text, None, None, None, None

    hour = dt.hour
    minutes = dt.minute
    time = f"{hour}:{minutes:02d}"
    print(f"[DATEPARSER] text: {text}, dt: {dt}, hour: {hour}, minutes: {minutes}, time: {time}")
    return text, dt, hour, minutes, time
