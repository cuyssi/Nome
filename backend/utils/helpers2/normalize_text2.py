from text_to_num import alpha2digit
from constants.corrections import CORRECTIONS
from utils.helpers2.time_helpers2 import corregir_menos_expresiones
import spacy
import re

nlp = spacy.load("es_core_news_md")

# 🔧 Corrección de transcripciones
def fix_transcription(text: str) -> str:
    text_lower = text.lower()
    for wrong, correct in CORRECTIONS.items():
        text_lower = re.sub(rf"\b{re.escape(wrong)}\b", correct, text_lower)
    # Normaliza "ejercicios" a "ej:"
    text_lower = re.sub(r"\bejercicios\b", "ej:", text_lower)
    return text_lower

# 🛡 Blindar deberes con marcador temporal
def es_secuencia_valida(secuencia):
    numericas = {
        "uno", "dos", "tres", "cuatro", "cinco", "seis",
        "siete", "ocho", "nueve", "diez", "once", "doce"
    }
    tokens = secuencia.lower().split()
    return any(token.isdigit() or token in numericas for token in tokens)

def extraer_deberes(texto):
    match = re.search(r"\bej:\s*((?:\w+\s+)*\w+)", texto)
    if match:
        secuencia = match.group(1)
        if es_secuencia_valida(secuencia):
            texto_sin_deberes = re.sub(r"\bej:\s*((?:\w+\s+)*\w+)", "__DEBERES__", texto)
            return texto_sin_deberes, secuencia
    return texto, None

# ⏰ Normalización de expresiones horarias
def normalize_time(text):
    text = re.sub(r'\ba la una\b', 'a la 1', text)
    text = re.sub(r'\ba las una\b', 'a las 1', text)

    # Expresiones compuestas primero
    text = re.sub(r'(\d{1,2})\s+y\s+media\b', r'\1:30', text)
    text = re.sub(r'(\d{1,2})\s+y\s+cuarto\b', r'\1:15', text)
    text = re.sub(r'\b(\d{1,2})\s+(\d{2})\b', r'\1:\2', text)

    # Expresiones como "2 y 10" → "2:10"
    text = re.sub(r'\b(\d{1,2})\s+y\s+(\d{1,2})\b', r'\1:\2', text)

    # Añadir ":00" si no hay minutos explícitos
    text = re.sub(r'\ba las (\d{1,2})(?!:\d{2})\b', r'a las \1:00', text)
    text = re.sub(r'\ba la (\d{1,2})(?!:\d{2})\b', r'a la \1:00', text)

    return text


def insertar_deberes(texto, secuencia):
    print(f"[INSERTAR] secuencia: {secuencia}")
    print(f"[INSERTAR] text antes: {texto}")
    if secuencia:
        numeros = alpha2digit(secuencia, "es")
        lista = " ".join(numeros.split())

        # 1) Normaliza cualquier variante: "_ DEBERES _", "_ _ DEBERES _ _", "__DEBERES__", "- DEBERES -", etc.
        #    Captura múltiples grupos de guiones/guiones bajos con espacios intercalados.
        texto = re.sub(r"(?:[-_]+\s*)*DEBERES(?:\s*[-_]+)*", "__DEBERES__", texto)

        # 2) Inserta la lista
        texto = texto.replace("__DEBERES__", f"ej: {lista}")

        # 3) Limpia espacios múltiples
        texto = re.sub(r"\s{2,}", " ", texto).strip()

        print(f"[INSERTAR] text despues: {texto}")
    return texto


# 🔠 Capitalización inteligente
def capitalize(text):
    doc = nlp(text)
    tokens = []
    for token in doc:
        if token.ent_type_ in ("PER", "LOC", "ORG"):
            tokens.append(token.text.capitalize())
        else:
            tokens.append(token.text)
    result = " ".join(tokens)
    return result[0].upper() + result[1:]

# 🧼 Pipeline completo
def normalize(text):
    text = fix_transcription(text)
    print(f"[NORMALIZE] fix: {text}")

    text, deberes = extraer_deberes(text)
    print(f"[NORMALIZE] deberes extraídos: {deberes}")
    print(f"[NORMALIZE] texto sin deberes: {text}")

    # 1) Pasar primero palabras a dígitos
    text = alpha2digit(text, "es")
    print(f"[NORMALIZE] 2num: {text}")

    # 2) Recién aquí convertir "9 menos 10" → "8:50"
    text = corregir_menos_expresiones(text)

    # 3) Normalizar con dos puntos
    text = normalize_time(text)
    print(f"[NORMALIZE] dos puntos: {text}")

    text = capitalize(text)
    print(f"[DETECT] texto normalizado: {text}")

    return text, deberes

