# ──────────────────────────────────────────────────────────────────────────────
# Análisis léxico y lematización de texto en español.
# - analyze_text(text) → Procesa el texto con spaCy y muestra cada token con su lema.
# - nlp → Pipeline de procesamiento lingüístico cargado con el modelo 'es_core_news_md'.
# - token.text → Texto original del token.
# - token.lemma_ → Forma lematizada del token (base gramatical).
# - Uso típico: Permite inspeccionar cómo spaCy interpreta y normaliza el lenguaje.
# - Aplicaciones: detección de entidades, simplificación de texto, análisis semántico.
# ──────────────────────────────────────────────────────────────────────────────

import spacy

nlp = spacy.load("es_core_news_md")

def analyze_text(text):
    doc = nlp(text)
    for token in doc:
        print(f"- {token.text} → {token.lemma_}")
