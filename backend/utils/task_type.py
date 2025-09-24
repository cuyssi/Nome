# ──────────────────────────────────────────────────────────────────────────────
# Clasificación de tareas basada en palabras clave y lemas usando SpaCy.
# - useTaskType: clase que contiene conjuntos de palabras clave por tipo de tarea.
#   Permite detectar el tipo de tarea ("cita", "médicos", "deberes", "trabajo", 
#   "examen", "otros") a partir de un texto y su frecuencia de repetición.
#
# - expand_keywords(keywords): expande cada palabra clave a todas sus formas y lemas
#   usando SpaCy, retornando un set de tokens en minúsculas.
#
# Devuelven el tipo de tarea más adecuado según coincidencias con palabras clave.
# ──────────────────────────────────────────────────────────────────────────────

import spacy

nlp = spacy.load("es_core_news_md")

def expand_keywords(keywords):
    expanded = set()
    for word in keywords:
        doc = nlp(word)
        for token in doc:
            expanded.add(token.text.lower())
            expanded.add(token.lemma_.lower())
    return expanded

class useTaskType:
    def __init__(self):
        self.cita_base = ["quedar", "ver", "citar", "reunir"]
        self.medico_base = ["médico", "doctor", "hospital", "consulta", "psicólogo", "psicóloga", "especialista"]
        self.deberes_base = ["deberes", "ejercicio", "resolver", "estudiar", "tarea"]
        self.trabajo_base = ["trabajo", "trabajar", "investigar", "redactar", "informe", "exponer", "hacer", "preparar"]
        self.examen_base = ["examen", "prueba", "evaluar", "control", "test"]

        self.cita_keywords = expand_keywords(self.cita_base)
        self.medico_keywords = expand_keywords(self.medico_base)
        self.deberes_keywords = expand_keywords(self.deberes_base)
        self.trabajo_keywords = expand_keywords(self.trabajo_base)
        self.examen_keywords = expand_keywords(self.examen_base)

    def getTaskType(self, text: str, repeat: str = "once") -> str:
        doc = nlp(text)
        lemmas = {token.lemma_.lower() for token in doc}
        print(f"[getTaskType] Lemas detectados: {lemmas}, repeat={repeat}")

        if repeat != "once":
            return "cita"
        elif self.cita_keywords & lemmas:
            return "cita"
        elif self.medico_keywords & lemmas:
            return "médicos"
        elif self.deberes_keywords & lemmas:
            return "deberes"
        elif self.trabajo_keywords & lemmas:
            return "trabajo"
        elif self.examen_keywords & lemmas:
            return "examen"
        else:
            return "otros"
