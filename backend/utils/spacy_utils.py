# ──────────────────────────────────────────────────────────────────────────────
# Componente de NLP para limpiar texto, detectar fechas y clasificar tipo de tarea.
# - clean_text_component(doc): Limpia el texto y extrae hora y minuto usando date parser.
# - task_type_matcher(doc): Clasifica el tipo de tarea según palabras clave.
# - analyze_text(text): Función de ejemplo para mostrar lemas detectados.
# - infer_task_type(text): Inferencia de tipo de tarea si no se detecta con matcher.
# ──────────────────────────────────────────────────────────────────────────────

import spacy
from spacy.tokens import Doc
from spacy.matcher import Matcher
from services.date_parser import combine_date_and_time

nlp = spacy.load("es_core_news_md")

Doc.set_extension("clean_text", default=None)
Doc.set_extension("hour", default=None)
Doc.set_extension("minute", default=None)

@spacy.language.Language.component("clean_text_component")
def clean_text_component(doc):
    text, dt, hour, minutes, time = combine_date_and_time(doc.text)
    doc._.clean_text = text
    doc._.hour = hour
    doc._.minute = minutes
    return doc

nlp.add_pipe("clean_text_component", first=True)

Doc.set_extension("task_type", default=None)

matcher = Matcher(nlp.vocab)

matcher.add("cita", [[{"LEMMA": {"IN": ["quedar", "ver", "citar"]}}]])
matcher.add("medico", [
    [{"LOWER": {"IN": ["medico", "doctor", "hospital", "consulta"]}}],
    [{"LOWER": "cita"}, {"LOWER": "medica"}]
])
matcher.add("deberes", [
    [{"LOWER": {"IN": ["deberes", "ejercicio", "estudiar", "resolver", "tarea"]}}],
    [{"LOWER": "tengo"}, {"LOWER": "que"}, {"LEMMA": {"IN": ["hacer", "estudiar"]}}]
])
matcher.add("trabajo", [
    [{"LEMMA": {"IN": ["trabajo", "redactar", "investigar", "exponer"]}}],
    [{"LOWER": {"IN": ["informe", "redacción", "exposición", "mapa"]}}]
])
matcher.add("examen", [
    [{"LOWER": {"IN": ["examen", "prueba", "evaluación", "control"]}}],
    [{"LOWER": "tengo"}, {"LOWER": "un"}, {"LOWER": {"IN": ["examen", "test"]}}]
])


@spacy.language.Language.component("task_type_matcher")
def task_type_matcher(doc):
    matches = matcher(doc)
    for match_id, start, end in matches:
        match_label = nlp.vocab.strings[match_id]
        doc._.task_type = match_label.lower()
        break
    return doc

nlp.add_pipe("task_type_matcher", after="clean_text_component")

def analyze_text(text):
    doc = nlp(text)
    for token in doc:
        print(f"- {token.text} → {token.lemma_}")

def infer_task_type(text):
    doc = nlp(text)
    task_type = doc._.task_type
    if task_type:
        return task_type

    lemmas = [token.lemma_.lower() for token in doc]

    if "quedar" in lemmas and any(p in lemmas for p in ["pedro", "marta", "maría"]):
        return "cita"
    if any(p in text.lower() for p in ["quedé", "quede", "quedar", "vernos", "verme", "vernos con", "citar", "cite", "citarnos"]):
        if "con" in text.lower():
            return "cita"

    cita_keywords = {"quedar", "ver", "citar"}
    medico_keywords = {"medico", "cita", "hospital", "consulta"}
    deberes_keywords = {"deberes", "ejercicio", "resolver", "estudiar"}
    trabajo_keywords = {"trabajo", "investigación", "redacción", "informe"}
    examen_keywords = {"examen", "prueba", "evaluación", "control"}

    if cita_keywords & set(lemmas):
        return "cita"
    elif medico_keywords & set(lemmas):
        return "medico"
    elif deberes_keywords & set(lemmas):
        return "deberes"
    elif trabajo_keywords & set(lemmas):
        return "trabajo"
    elif examen_keywords & set(lemmas):
        return "examen"
    else:
        return "unknown"
