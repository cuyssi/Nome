# helpers/clean_text_helpers.py
import re
import spacy

nlp = spacy.load("es_core_news_sm")

CORRECTIONS = {
    "quebec": "quedé",
    "que de": "quedé",
    "quede": "quedé",
    "que": "quéde",
    "para la tarde": "por la tarde",
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
