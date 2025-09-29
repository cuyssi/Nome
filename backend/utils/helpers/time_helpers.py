# ──────────────────────────────────────────────────────────────────────────────
# Utilidades para detección y ajuste de expresiones de tiempo en texto.
# - extract_time_fragment(text) → Extrae fragmentos explícitos de hora en el texto.
#     • Reconoce formatos numéricos ("a las 5:00", "las 7"), palabras ("cinco de la tarde"),
#       y contextos horarios ("de la mañana", "por la noche").
#     • Devuelve el fragmento detectado o None si no hay coincidencias.
#
# - adjust_ambiguous_hour(dt, now, text) → Ajusta horas ambiguas sin contexto claro.
#     • Si la hora ≤ 7 y no hay "mañana/tarde/noche", se interpreta como tarde (suma +12h).
#     • Si la hora ya pasó respecto a `now`, se corrige al día siguiente o se convierte a formato 24h.
#     • Devuelve un datetime corregido.
#
# - correct_minus_expressions(text) → Corrige expresiones relativas con "menos".
#     • Ejemplos: "5 menos cuarto" → "4:45", "8 menos diez" → "7:50".
#     • Adapta al contexto de "de la tarde" para mantener coherencia en 24h.
#     • Devuelve el texto con la hora reescrita en formato HH:MM.
#
# - adjust_time_context(dt, text) → Ajusta el datetime según el contexto horario.
#     • "de la mañana" → Si no hay hora explícita, fija 09:00.
#     • "de la tarde" → Si no hay hora, fija 16:00; si hay hora <12, convierte a formato 24h.
#     • "de la noche" → Si no hay hora, fija 21:00; si hay hora <12, convierte a formato 24h.
#     • "de la madrugada" → Si no hay hora, fija 03:00.
#     • Devuelve (datetime ajustado, fragmento usado).
# ──────────────────────────────────────────────────────────────────────────────

from datetime import timedelta
import re

def extract_time_fragment(text):
    text_lower = text.lower()

    match = re.search(
        r"\b(?:a\s+)?la?s?\s*\d{1,2}(?::\d{1,2})?(?:\s*(?:de la|por la)\s+(mañana|tarde|noche|madrugada))",
        text_lower,
    )
    if match:
        return match.group(0).strip()

    match = re.search(r"\b(?:a\s+)?la?s?\s*\d{1,2}(?::\d{1,2})\b", text_lower)
    if match:
        return match.group(0).strip()

    match = re.search(
        r"\b(?:una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce)"
        r"(?:\s+y\s+(?:cuarto|media|\d{1,2}))?"
        r"(?:\s+(?:de la|por la)\s+(mañana|tarde|noche|madrugada))",
        text_lower,
    )
    if match:
        return match.group(0).strip()

    match = re.search(
        r"\b(?:de la|por la)\s+(mañana|tarde|noche|madrugada)\b", text_lower
    )
    if match:
        return match.group(0).strip()

    return None


def adjust_ambiguous_hour(dt, now, text):
    text = text.lower()
    hour_matches = re.findall(r"\b(\d{1,2})(?::(\d{2}))?\b", text)
    hour_number = int(hour_matches[-1][0]) if hour_matches else None
    minute_number = (
        int(hour_matches[-1][1]) if hour_matches and hour_matches[-1][1] else 0
    )

    has_morning = "de la mañana" in text or "por la mañana" in text
    has_tarde = "de la tarde" in text or "por la tarde" in text
    has_noche = "de la noche" in text or "por la noche" in text
    has_madrugada = "de la madrugada" in text or "por la madrugada" in text
    no_context = not any([has_morning, has_tarde, has_noche, has_madrugada])

    if hour_number is not None and no_context and hour_number <= 7:
        dt = dt.replace(hour=hour_number + 12, minute=minute_number)
        return dt

    if dt < now:
        if has_morning or has_madrugada:
            dt += timedelta(days=1)
        elif has_tarde or has_noche:
            if dt.hour < 12:
                dt = dt.replace(hour=dt.hour + 12)
        else:
            if dt.hour < 12:
                dt = dt.replace(hour=dt.hour + 12)

    return dt


def correct_minus_expressions(text):
    def replacement(match):
        hour_str = match.group(1)
        minutes = match.group(2).lower()
        hour = int(hour_str.split(":")[0]) if ":" in hour_str else int(hour_str)
        mapping = {"cuarto": 15, "media": 30, "diez": 10, "veinte": 20, "cinco": 5}
        m = int(minutes) if minutes.isdigit() else mapping.get(minutes, None)
        if m is None:
            return match.group(0)

        new_hour = hour - 1 if hour > 0 else 23
        result = f"{new_hour}:{60 - m:02d}"

        if "de la tarde" in text.lower() or "por la tarde" in text.lower():
            new_hour_24 = new_hour + 12 if new_hour < 12 else new_hour
            result = f"{new_hour_24}:{60 - m:02d}"

        return result

    return re.sub(
        r"\b(\d{1,2}(?::\d{2})?)\s+menos\s+(\w+)\b",
        replacement,
        text,
        flags=re.IGNORECASE,
    )


def adjust_time_context(dt, text):
    text = text.lower()
    used_fragment = None
    explicit_hour = re.search(r"\b\d{1,2}(:\d{2})?\b", text) is not None

    if "por la mañana" in text or "de la mañana" in text:
        used_fragment = "de la mañana"
        if not explicit_hour:
            dt = dt.replace(hour=9, minute=0)

    elif "por la tarde" in text or "de la tarde" in text:
        used_fragment = "de la tarde"
        if not explicit_hour:
            dt = dt.replace(hour=16, minute=0)
        elif dt.hour < 12:
            dt = dt.replace(hour=dt.hour + 12)

    elif "por la noche" in text or "de la noche" in text:
        used_fragment = "de la noche"
        if not explicit_hour:
            dt = dt.replace(hour=21, minute=0)
        elif dt.hour < 12:
            dt = dt.replace(hour=dt.hour + 12)

    elif "por la madrugada" in text or "de la madrugada" in text:
        used_fragment = "de la madrugada"
        if not explicit_hour:
            dt = dt.replace(hour=3, minute=0)

    return dt, used_fragment
