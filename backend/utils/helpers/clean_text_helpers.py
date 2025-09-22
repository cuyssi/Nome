# ──────────────────────────────────────────────────────────────────────────────
# Utilidades para limpiar texto de referencias temporales y formatear listas.
# - clean_date_and_fragment-> elimina horas, fragmentos como "por la tarde",
#   y palabras de referencia temporal como "mañana", "hoy".
#
# - remove_weekday_phrases(text)-> elimina el nombre del día y el artículo que
#   lo precede, fragmentos como "el lunes".
#
# - format_lists_with_commas-> coloca comas correctas en listas de elementos
#   o números, evitando errores como comas antes de artículos y duplicadas.
#
# Devuelven el texto limpio y listo para procesar fechas o transcripciones.
# ──────────────────────────────────────────────────────────────────────────────

import re

def sanitize_fragment(fragment: str) -> str:
    if not fragment:
        return fragment

    frag = fragment.strip()
    if re.search(r"\b(en|con|de|a|al|del)$", frag, flags=re.IGNORECASE):
        frag = " ".join(frag.split()[:-1])

    return frag


def clean_date_and_fragment(text, fragments=None):
    print(f"[Clean date and fragmen] fragment antes: {fragments}")
    if not fragments:
        fragments = []

    elif isinstance(fragments, str):
        fragments = [fragments]

    fragments = [sanitize_fragment(f) for f in fragments if f]
    for fragment in fragments:
        fragment_esc = re.escape(fragment.strip())
        text = re.sub(
            rf'\b(?:a\s+)?(?:para\s+)?(?:el|la|los|las)?\s*{fragment_esc}\b',
            '',
            text,
            flags=re.IGNORECASE
        )

    text = re.sub(r"\b(a\s+)?(la|las)\s+\d{1,2}(:\d{2})?\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\b\d{1,2}(:\d{2})?\b", "", text)
    text = re.sub(r"\b(por|de)\s+la\s+(mañana|tarde|noche|madrugada)\b", "", text, flags=re.IGNORECASE)
    text = re.sub(
        r"\b(mañana(\s+por\s+la\s+(mañana|tarde|noche|madrugada))?|"
        r"hoy|pasado\s+mañana|esta\s+(noche|tarde|mañana))\b",
        "",
        text,
        flags=re.IGNORECASE
    )
    text = re.sub(r"\s{2,}", " ", text).strip()
    text = text[0].upper() + text[1:] if text else text
    print(f"[Clean date and fragment] text despues: {text }")
    return text


def remove_weekday_phrases(text):
    weekdays = [
        "lunes", "martes", "miércoles", "miercoles",
        "jueves", "viernes", "sábado", "sabado", "domingo"
    ]

    modifiers = [
        "el", "la", "los", "las",
        "este", "esta", "estos", "estas",
        "próximo", "proximo", "pasado"
    ]

    weekday_pattern = r"(?:{})".format("|".join(weekdays))
    modifier_pattern = r"(?:{})".format("|".join(modifiers))
    pattern = rf"\b{modifier_pattern}\s+{weekday_pattern}\b"
    cleaned = re.sub(pattern, "", text, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    return cleaned


def format_lists_with_commas(text):
    text = re.sub(r'(\b(?:el|la|los|las)\b),\s+', r'\1 ', text)
    text = re.sub(r'(?<!^)(\b(?:el|la|los|las)\b)\s+(\w+)\s+(?=\b(?:el|la|los|las)\b)', r'\1 \2, ', text)
    text = re.sub(r'\b(\d+)\s+(?=\d+\s+y\b)', r'\1, ', text)
    text = re.sub(r'\b(\d+)\s+(?=\d+\b)', r'\1, ', text)
    text = re.sub(r'\by,\s*', 'y ', text)
    text = re.sub(r'\s+([.,:])', r'\1', text)
    text = re.sub(r'\s{2,}', ' ', text)

    return text.strip()
