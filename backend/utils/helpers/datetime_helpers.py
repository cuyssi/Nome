# ──────────────────────────────────────────────────────────────────────────────
# Detecta fechas y horas dentro de un texto.
# - Retorna la fecha/hora principal (datetime), lista de fechas detectadas, 
#   y fragmento horario si existe.
# - Si no se detecta ninguna fecha, se asigna la fecha actual a las 15:30.
# - Ajusta automáticamente "mañana" y horas que ya pasaron.
# ──────────────────────────────────────────────────────────────────────────────

import re
from dateparser.search import search_dates
from datetime import datetime, timedelta
from utils.helpers.time_helpers import adjust_time_context, adjust_ambiguous_hour

def detect_dates_in_text(text):
    data = search_dates(text, settings={"RELATIVE_BASE": datetime.now()})

    if not data:
        dt = datetime.now().replace(hour=15, minute=30, second=0, microsecond=0)
        return dt, [], None

    dates_with_hour = [dt for txt, dt in data if re.search(r"\d{1,2}[:h]\d{2}", txt)]
    dt = dates_with_hour[-1] if dates_with_hour else data[-1][1]

    if "mañana" in text and dt.date() == datetime.now().date():
        dt += timedelta(days=1)

    now = datetime.now()
    if dt.date() == now.date() and dt < now:
        if dt.hour < 12:
            dt = dt.replace(hour=dt.hour + 12)
        if dt < now:
            dt += timedelta(days=1)

    dt, time_fragment = adjust_time_context(dt, text)

    return dt, data, time_fragment
