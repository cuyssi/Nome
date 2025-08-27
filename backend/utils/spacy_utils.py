import spacy
from spacy.tokens import Doc
from spacy.matcher import Matcher
from datetime import datetime
from services.date_parser2 import combine_date_and_time2

nlp = spacy.load("es_core_news_md")

Doc.set_extension("texto_limpio", default=None)
Doc.set_extension("hora", default=None)
Doc.set_extension("minuto", default=None)

@spacy.language.Language.component("custom_cleaner_component")
def custom_cleaner_component(doc):
    text, dt, hour, minutes, time = combine_date_and_time2(doc.text)
    doc._.texto_limpio = text
    doc._.hora = hour
    doc._.minuto = minutes
    return doc

nlp.add_pipe("custom_cleaner_component", first=True)

Doc.set_extension("tipo_tarea", default=None)

matcher = Matcher(nlp.vocab)

matcher.add("CITA", [[{"LEMMA": {"IN": ["quedar", "ver", "citar"]}}]])

matcher.add("MEDICO", [
    [{"LOWER": {"IN": ["medico", "doctor", "hospital", "consulta"]}}],
    [{"LOWER": "cita"}, {"LOWER": "medica"}]
])

matcher.add("DEBERES", [
    [{"LOWER": {"IN": ["deberes", "ejercicio", "estudiar", "resolver", "tarea"]}}],
    [{"LOWER": "tengo"}, {"LOWER": "que"}, {"LEMMA": {"IN": ["hacer", "estudiar"]}}]
])

matcher.add("TRABAJO", [
    [{"LEMMA": {"IN": ["trabajo", "redactar", "investigar", "exponer"]}}],
    [{"LOWER": {"IN": ["informe", "redacción", "exposición", "mapa"]}}]
])

@spacy.language.Language.component("custom_task_matcher")
def custom_task_matcher(doc):
    matches = matcher(doc)
    for match_id, start, end in matches:
        match_label = nlp.vocab.strings[match_id]
        doc._.tipo_tarea = match_label.lower()
        break
    return doc

nlp.add_pipe("custom_task_matcher", after="custom_cleaner_component")

def analyze_text(text):
    doc = nlp(text)
    print("Lemas detectados:")
    for token in doc:
        print(f"- {token.text} → {token.lemma_}")

def infer_type(text):
    doc = nlp(text)
    tipo = doc._.tipo_tarea
    if tipo:
        return tipo

    lemmas = [token.lemma_.lower() for token in doc]
    if "quedar" in lemmas and any(p in lemmas for p in ["pedro", "marta", "maría"]):
        return "cita"
    if any(p in text.lower() for p in ["quedé", "quede", "quedar", "vernos", "verme", "vernos con"]):
        if "con" in text.lower():
            return "quede"

    citas_keywords = {"quedar", "ver", "citar"}
    medico_keywords = {"medico", "cita", "hospital", "consulta"}
    deberes_keywords = {"deberes", "ejercicio", "resolver", "estudiar"}
    trabajo_keywords = {"trabajo", "investigación", "redacción", "informe"}

    if citas_keywords & set(lemmas):
        return "cita"
    elif medico_keywords & set(lemmas):
        return "medico"
    elif deberes_keywords & set(lemmas):
        return "deberes"
    elif trabajo_keywords & set(lemmas):
        return "trabajo"
    else:
        return "desconocido"
