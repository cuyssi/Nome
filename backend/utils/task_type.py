# ──────────────────────────────────────────────────────────────────────────────
# Clasificación semántica de tareas según contenido textual.
# - useTaskType → Clase que encapsula lógica de detección por lemas.
# - getTaskType(text) → Retorna el tipo de tarea según palabras clave lematizadas.
# - nlp → Pipeline spaCy para español ('es_core_news_md').
# - Lemmatización → Permite detectar variantes verbales y nominales.
# - Tipos detectables: 'cita', 'medico', 'deberes', 'trabajo', 'examen'.
# - Si no hay coincidencia → retorna 'unknown'.
# - Aplicaciones: autocompletado de tipo, clasificación automática, filtros contextuales.
# ──────────────────────────────────────────────────────────────────────────────

import spacy

nlp = spacy.load("es_core_news_md")

class useTaskType:
    def __init__(self):
        self.cita_keywords = {"quedar", "ver", "citar", "reunir"}
        self.medico_keywords = {"médico", "doctor", "hospital", "consulta"}
        self.deberes_keywords = {"deberes", "ejercicio", "resolver", "estudiar", "tarea"}
        self.trabajo_keywords = {"trabajo", "investigar", "redactar", "informe", "exponer"}
        self.examen_keywords = {"examen", "prueba", "evaluar", "control", "test"}

    def getTaskType(self, text: str) -> str:
        doc = nlp(text)
        lemmas = {token.lemma_.lower() for token in doc}

        if self.cita_keywords & lemmas:
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
            return "unknown"
