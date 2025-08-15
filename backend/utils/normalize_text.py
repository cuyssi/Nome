# utils/helpers/text_helpers.py
import unicodedata

def normalize_text(text: str) -> str:
    """
    Convierte el texto a minúsculas y elimina acentos/tildes.
    Ej: 'Veintidós' -> 'veintidos'
    """
    text = text.lower()
    return ''.join(
        c for c in unicodedata.normalize('NFKD', text)
        if not unicodedata.combining(c)
    )
