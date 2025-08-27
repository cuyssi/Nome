from datetime import datetime, timedelta

import re


def ajustar_hora_ambigua(dt, now):
    # Solo si la hora es ambigua (menor a 12) y estamos en la tarde/noche
    if dt.hour < 12 and dt.hour + 12 > now.hour:
        dt = dt.replace(hour=dt.hour + 12)
    return dt


def corregir_menos_expresiones(texto):
    def reemplazo(match):
        hora_str = match.group(1)
        minutos = match.group(2).lower()

        # Soportar "8" o "8:00"
        if ":" in hora_str:
            hora = int(hora_str.split(":")[0])
        else:
            hora = int(hora_str)

        equivalencias = {
            "cuarto": 15,
            "media": 30,
            "diez": 10,
            "veinte": 20,
            "cinco": 5
        }

        if minutos.isdigit():
            m = int(minutos)
        else:
            m = equivalencias.get(minutos, None)

        if m is None:
            return match.group(0)

        nueva_hora = hora - 1 if hora > 0 else 23
        return f"{nueva_hora}:{60 - m:02d}"

    # Acepta "8 menos cinco" o "8:00 menos cinco"
    texto = re.sub(r"\b(\d{1,2}(?::\d{2})?)\s+menos\s+(\w+)\b", reemplazo, texto, flags=re.IGNORECASE)
    return texto


def ajustar_contexto_horario(dt, texto):
    texto = texto.lower()
    fragmento_usado = None
    hora_explicita = re.search(r'\b\d{1,2}(:\d{2})?\b', texto) is not None

    if "por la mañana" in texto or "de la mañana" in texto:
        fragmento_usado = "de la mañana"
        if not hora_explicita:
            dt = dt.replace(hour=9, minute=0, second=0, microsecond=0)

    elif "por la noche" in texto or "de la noche" in texto:
        fragmento_usado = "de la noche"
        if hora_explicita:
            if 1 <= dt.hour <= 11:
                dt = dt.replace(hour=dt.hour + 12)
        else:
            dt = dt.replace(hour=21, minute=0, second=0, microsecond=0)

    elif "por la tarde" in texto or "de la tarde" in texto:
        fragmento_usado = "de la tarde"
        if hora_explicita:
            if 1 <= dt.hour <= 11:
                dt = dt.replace(hour=dt.hour + 12)
        else:
            dt = dt.replace(hour=15, minute=0, second=0, microsecond=0)

    elif "por la madrugada" in texto or "de la madrugada" in texto:
        fragmento_usado = "de la madrugada"
        if not hora_explicita:
            dt = dt.replace(hour=3, minute=0, second=0, microsecond=0)

    return dt, fragmento_usado

