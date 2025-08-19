# helpers/clean_text_helpers.py
import re
import spacy

nlp = spacy.load("es_core_news_sm")

CORRECTIONS = {
    "quebec": "quedé",
    "que de": "quedé",
    "quede": "quedé",
    "que": "quedé",
    "para la tarde": "por la tarde",
    "ve": "quedé",
    "ede": "quedé",
    "ver": "quedé"
}

def fix_transcription(text: str) -> str:
    text_lower = text.lower()
    for wrong, correct in CORRECTIONS.items():
        text_lower = re.sub(rf"\b{re.escape(wrong)}\b", correct, text_lower)
    return text_lower

def remove_relative_dates(text: str) -> str:
    """Elimina palabras tipo 'hoy', 'mañana', 'pasado mañana' tras detectar la fecha"""
    return re.sub(r"\b(hoy|mañana|pasado mañana)\b", "", text, flags=re.IGNORECASE).strip()

def clean_text(text: str) -> str:
    """Normalize text and correct common mistakes."""
    text = fix_transcription(text)
    text = remove_relative_dates(text)
    print(f"remove_ralative_dates: {text}")
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\bmanana\b", "mañana", text)
    print(f"[clean_text] {text}")
    return text

def capitalize_proper_names(text: str) -> str:
    """Capitaliza la primera letra y los nombres propios detectados por spaCy"""
    doc = nlp(text)
    tokens = []
    for token in doc:
        if token.ent_type_ in ("PER", "LOC", "ORG"):  # personas, lugares, organizaciones
            tokens.append(token.text.capitalize())
        else:
            tokens.append(token.text)
    # Primera letra del texto en mayúscula
    result = " ".join(tokens)
    return result[0].upper() + result[1:]

def remove_detected_dates(text: str) -> str:
    """
    Elimina:
      - días de la semana: lunes, martes...
      - fechas manuales tipo 'el 25 de septiembre'
    """
    # Días de la semana
    text = re.sub(r"\b(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b", "", text, flags=re.IGNORECASE)

    # Fechas manuales tipo 'el 25 de septiembre'
    text = re.sub(
        r"(?:el\s+)?\d{1,2}\s+de\s+"
        r"(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)",
        "",
        text,
        flags=re.IGNORECASE
    )

    # Quitar posibles espacios extra
    text = re.sub(r"\s+", " ", text).strip()
    return text
