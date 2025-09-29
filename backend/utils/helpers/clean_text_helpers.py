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
# - clean_repeat_connectors-> elimina nombres de los dias de la semana cuando la
#   tarea se repite varios dias, elimina tambien los conectores que las acompañan
#   como "los", "todos", etc..
#
# Devuelven el texto limpio y listo para procesar fechas o transcripciones.
# ──────────────────────────────────────────────────────────────────────────────

from constants.constants import WEEKDAYS, MODIFIERS
import re


def clean_date_and_fragment(text, fragments=None):
    if not fragments:
        fragments = []
    elif isinstance(fragments, (str, bytes)):
        fragments = [fragments]

    fragments = [str(f).strip() for f in fragments if f]
    fragments = sorted(dict.fromkeys(fragments), key=lambda s: len(s), reverse=True)

    for frag in fragments:
        if not frag:
            continue
        text = re.sub(re.escape(frag), "", text, flags=re.IGNORECASE)

    patterns = [
        r"\ba\s+las\s+\d{1,2}(:\d{2})?\b",
        r"\ba\s+las\s+\d{1,2}(:\d{2})?\b",
        r"\b\d{1,2}:\d{2}\b",
        r"\b(de la|por la|para la)\s+(mañana|tarde|noche|madrugada)\b",
        r"\b(mañana|hoy|pasado\s+mañana|esta\s+(noche|tarde|mañana))\b",
    ]

    for pat in patterns:
        text = re.sub(pat, "", text, flags=re.IGNORECASE)

    text = re.sub(
        r"\b(?:a|de|en|por|para)\b(?=\s*[.,;:]|$)", "", text, flags=re.IGNORECASE
    )
    text = re.sub(r"\s{2,}", " ", text)
    text = text.strip(" ,.;:-")

    return text


def remove_weekday_phrases(text):
    weekday_pattern = r"(?:{})".format("|".join(WEEKDAYS))
    modifier_pattern = r"(?:{})".format("|".join(MODIFIERS))
    pattern = rf"\b{modifier_pattern}\s+{weekday_pattern}\b"
    cleaned = re.sub(pattern, "", text, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    return cleaned


def format_lists_with_commas(text):
    text = re.sub(r"(\b(?:el|la|los|las)\b),\s+", r"\1 ", text)
    text = re.sub(
        r"(?<!^)(\b(?:el|la|los|las)\b)\s+(\w+)\s+(?=\b(?:el|la|los|las)\b)",
        r"\1 \2, ",
        text,
    )
    text = re.sub(r"\b(\d+)\s+(?=\d+\s+y\b)", r"\1, ", text)
    text = re.sub(r"\b(\d+)\s+(?=\d+\b)", r"\1, ", text)
    text = re.sub(r"\by,\s*", "y ", text)
    text = re.sub(r"\s+([.,:])", r"\1", text)
    text = re.sub(r"\s{2,}", " ", text)

    return text.strip()


def clean_repeat_connectors(text, custom_days=None, repeat=None):
    if not text:
        return text
    text = text.strip()

    if repeat in ("daily", "weekend", "custom") or (
        custom_days and len(custom_days) > 0
    ):
        text = re.sub(r"\b(cada|todos|todas|y)\b", " ", text, flags=re.IGNORECASE)
        weekday_pattern = r"\b(?:{})\b".format("|".join(WEEKDAYS))
        text = re.sub(
            rf"\b(?:los|las|el)\s+{weekday_pattern}", "", text, flags=re.IGNORECASE
        )
        text = re.sub(weekday_pattern, "", text, flags=re.IGNORECASE)

    text = re.sub(
        r"\b(a|las|los)\s+(?=\d{1,2}(:\d{2})?)", "", text, flags=re.IGNORECASE
    )
    text = re.sub(r"\s{2,}", " ", text).strip()

    if text:
        text = text[0].upper() + text[1:]

    return text
