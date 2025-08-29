from text_to_num import alpha2digit
from constants.corrections import CORRECTIONS
from constants.patterns import PATTERNS
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

def extract_patterns(texto):
    resultados = {}
    for nombre, regla in PATTERNS.items():
        match = re.search(regla["regex"], texto, flags=re.IGNORECASE)
        if match:
            valor = match.group(1)
            texto = re.sub(regla["regex"], regla["placeholder"], texto, flags=re.IGNORECASE)
            resultados[nombre] = valor

    print(f"[EXTRACT PATTERS] text: {texto}, result: {resultados}")
    return texto, resultados

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


def insert_patterns(texto, resultados):
    for nombre, valor in resultados.items():
        if valor:
            placeholder = PATTERNS[nombre]["placeholder"]

            # Normaliza cualquier variante de guiones/espacios
            texto = re.sub(rf"(?:[-_]+\s*)*{nombre}(?:\s*[-_]+)*", placeholder, texto, flags=re.IGNORECASE)

            # Inserta usando el formateador definido
            texto = texto.replace(placeholder, PATTERNS[nombre]["formatter"](valor))

            # Limpia espacios dobles
            texto = re.sub(r"\s{2,}", " ", texto).strip()
    print(f"[INSERT PATTERNS] text: {texto}")
    return texto

# 🔠 Capitalización inteligente
def capitalize(text):
    doc = nlp(text)
    result = ""

    for i, token in enumerate(doc):
        if token.ent_type_ in ("PER", "LOC", "ORG"):
            token_text = token.text.capitalize()
        else:
            token_text = token.text

        # Mantener espacios originales
        result += token_text + token.whitespace_

    # Primera letra del texto en mayúscula
    if result:
        result = result[0].upper() + result[1:]
    return result


# 🧼 Pipeline completo
def normalize(text):
    text = fix_transcription(text)
    print(f"[NORMALIZE] fix: {text}")

    text, deberes = extract_patterns(text)
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

