# ──────────────────────────────────────────────────────────────────────────────
# Utilidades para limpiar texto de referencias temporales y formatear listas.
# - `clean_date_and_fragment` elimina horas, fragmentos como "por la tarde",
#   y palabras de referencia temporal como "mañana", "hoy".
# - `format_lists_with_commas` coloca comas correctas en listas de elementos
#   o números, evitando errores como comas antes de artículos y duplicadas.
# Devuelven el texto limpio y listo para procesar fechas o transcripciones.
# ──────────────────────────────────────────────────────────────────────────────

import re

def clean_date_and_fragment(text, fragment):
    if fragment:
        fragment_base = re.escape(fragment.split()[-1])
        pattern = (
            r"\b"
            r"(mañana|pasado mañana|hoy)?\s*"
            r"(a\s+la|a\s+las)?\s*"
            r"\d{1,2}(:\d{2})?\s*"
            r"(de|por)\s+" + fragment_base + r"\b")
        text = re.sub(pattern, "", text, flags=re.IGNORECASE)

    text = re.sub(r"\b(a\s+la|a\s+las)\s+\d{1,2}(:\d{2})?\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\b\d{1,2}(:\d{2})?\b", "", text)
    text = re.sub(
        r"\b(por|de)\s+la\s+(mañana|tarde|noche|madrugada)\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\b(mañana|hoy|pasado mañana|esta noche|esta tarde|esta mañana)\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s{2,}", " ", text).strip()
    text = text[0].upper() + text[1:] if text else text

    return text


def format_lists_with_commas(text):
    text = re.sub(r'(\b(?:el|la|los|las)\b),\s+', r'\1 ', text)
    text = re.sub(r'(?<!^)(\b(?:el|la|los|las)\b)\s+(\w+)\s+(?=\b(?:el|la|los|las)\b)', r'\1 \2, ', text)
    text = re.sub(r'\b(\d+)\s+(?=\d+\s+y\b)', r'\1, ', text)
    text = re.sub(r'\b(\d+)\s+(?=\d+\b)', r'\1, ', text)
    text = re.sub(r'\by,\s*', 'y ', text)
    text = re.sub(r'\s+([.,:])', r'\1', text)
    text = re.sub(r'\s{2,}', ' ', text)

    return text.strip()
