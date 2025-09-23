# ──────────────────────────────────────────────────────────────────────────────
# Normalización y extracción de patrones para texto transcrito.
# - fix_transcription(text)-> Corrige errores comunes de transcripción.
# - is_valid_sequence(seq)-> Comprueba si una secuencia contiene números o palabras numéricas.
# - extract_patterns(text)-> Extrae marcadores como páginas o ejercicios.
# - normalize_time(text)-> Convierte expresiones horarias naturales en español al formato HH:MM.
# - insert_patterns(text, results)-> Sustituye los marcadores por los valores formateados.
# - capitalize_text(text)-> Capitaliza inteligentemente los nombres propios.
# - normalize(text)-> Pipeline completo que combina todas las funciones anteriores.
# ──────────────────────────────────────────────────────────────────────────────

import re
import spacy
from text_to_num import alpha2digit
from constants.corrections import CORRECTIONS
from constants.patterns import PATTERNS
from utils.helpers.time_helpers import correct_minus_expressions
import json
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CUSTOM_WORDS_PATH = os.path.join(BASE_DIR, "../services/custom_words.json")

with open(CUSTOM_WORDS_PATH, "r", encoding="utf-8") as f:
    CUSTOM_WORDS = json.load(f)

nlp = spacy.load("es_core_news_md")

def fix_transcription(text):
    print(f"TEXTO: {text}")
    text_lower = text.lower()
    for wrong, correct in CORRECTIONS.items():
        text_lower = re.sub(rf"\b{re.escape(wrong)}\b", correct, text_lower)
    text_lower = re.sub(r"\bejercicios\b", "ej:", text_lower)

    return text_lower


def is_valid_sequence(seq):
    numeric_words = {
        "uno", "dos", "tres", "cuatro", "cinco", "seis",
        "siete", "ocho", "nueve", "diez", "once", "doce"
    }
    tokens = seq.lower().split()

    return any(token.isdigit() or token in numeric_words for token in tokens)


def extract_patterns(text):
    results = {}
    for name, rule in PATTERNS.items():
        match = re.search(rule["regex"], text, flags=re.IGNORECASE)
        if match:
            value = match.group(1)
            text = re.sub(rule["regex"], rule["placeholder"], text, flags=re.IGNORECASE)
            results[name] = value

    return text, results


def normalize_time(text):
    text = re.sub(r'\bla una (\d{1,2})\b', r'1:\1', text)
    text = re.sub(r'\bla una\b', '1:00', text)

    def y_replacer(match):
        h, m = match.groups()
        return f"{h}:{int(m):02d}"

    patterns = [
        (r'\ba la una\b', 'a la 1'),
        (r'\ba las una\b', 'a las 1'),
        (r'(\d{1,2})\s+y\s+media\b', r'\1:30'),
        (r'(\d{1,2})\s+y\s+cuarto\b', r'\1:15'),
        (r'\b(\d{1,2})\s+y\s+(\d{1,2})\b', y_replacer),
        (r'\b(\d{1,2})\s+(\d{2})\b', r'\1:\2'),
        (r'\ba las (\d{1,2})(?!:\d{2})\b', r'a las \1:00'),
        (r'\ba la (\d{1,2})(?!:\d{2})\b', r'a la \1:00'),
    ]

    for pattern, repl in patterns:
        text = re.sub(pattern, repl, text)

    return text


def insert_patterns(text, results):
    for name, value in results.items():
        if value:
            placeholder = PATTERNS[name]["placeholder"]
            text = re.sub(rf"(?:[-_]+\s*)*{name}(?:\s*[-_]+)*", placeholder, text, flags=re.IGNORECASE)
            text = text.replace(placeholder, PATTERNS[name]["formatter"](value))
            text = re.sub(r"\s{2,}", " ", text).strip()

    return text


def capitalize_custom_words(text, custom_words):
    for w in custom_words["words"]:
        pattern = re.compile(rf"\b{re.escape(w.lower())}\b", flags=re.IGNORECASE)
        text = pattern.sub(w, text)

    return text


def capitalize_text(text):
    doc = nlp(text)
    result = ""
    for token in doc:
        token_text = token.text.capitalize() if token.ent_type_ in ("PER", "LOC", "ORG") else token.text
        result += token_text + token.whitespace_

    return result[0].upper() + result[1:] if result else result


def normalize_text(text):
    text = fix_transcription(text)
    text, extracted = extract_patterns(text)
    text = alpha2digit(text, "es")
    text = correct_minus_expressions(text)
    text = normalize_time(text)
    text = capitalize_custom_words(text, CUSTOM_WORDS)
    text = capitalize_text(text)

    return text, extracted
