import re
from dateparser.search import search_dates
from datetime import datetime, timedelta
from utils.helpers2.time_helpers2 import ajustar_contexto_horario, ajustar_hora_ambigua


def detect_dates(texto):
    data = search_dates(texto, settings={"RELATIVE_BASE": datetime.now()})
    if not data:
        return None, [], None

    fechas_con_hora = [dt for txt, dt in data if re.search(r"\d{1,2}[:h]\d{2}", txt)]
    dt = fechas_con_hora[-1] if fechas_con_hora else data[-1][1]

    # Ajuste de "mañana" explícito
    if "mañana" in texto and dt.date() == datetime.now().date():
        dt += timedelta(days=1)

    # ⚡️ Nueva lógica: si la hora ya pasó y es < 12h, intenta ponerla en la tarde
    now = datetime.now()
    if dt.date() == now.date() and dt < now:
        if dt.hour < 12:  
            dt = dt.replace(hour=dt.hour + 12)  # cambiar a PM
        if dt < now:  
            dt += timedelta(days=1)  # si aun así pasó, pasa a mañana

    dt, fragmento_horario = ajustar_contexto_horario(dt, texto)
    print(f"[DETECT DATES] dt: {dt}, data: {data}, fragmento: {fragmento_horario}")

    return dt, data, fragmento_horario

