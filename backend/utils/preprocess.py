# ──────────────────────────────────────────────────────────────────────────────
# Funciones utilitarias para limpiar y preformatear texto proveniente de audio.
# - preformat_audio_text: normaliza patrones como “las9” o “1 y cuarto” → legibles.
# - clean_text: corrige errores comunes (“mañaña”), convierte números escritos
#   (como “catorce”) a dígitos usando `number_map`, y ajusta separadores clave.
# Prepara el contenido transcrito para análisis semántico, extracción de fecha
# u otras transformaciones posteriores.
# Ideal como paso previo al parser de tareas por voz.
#
# @author: Ana Castro
# ──────────────────────────────────────────────────────────────────────────────

from constants.number_map import number_map
import re


def preformat_audio_text(text: str) -> str:
    # Normalización de expresiones horarias
    text = re.sub(r"\bla\s+una\s+y\s+(media|cuarto)\b", r"las 1 y \1", text, flags=re.IGNORECASE)
    text = re.sub(r"\bla\s+una\s+menos\s+(\d{1,2})", lambda m: f"las {60 - int(m.group(1))}", text, flags=re.IGNORECASE)

    # Separación de números pegados
    text = re.sub(r"\bla(\d)", r"la \1", text)
    text = re.sub(r"\blas(\d)", r"las \1", text)
    text = re.sub(r"\ba las(\d)", r"a las \1", text)
    text = re.sub(r"\bde las(\d)", r"de las \1", text)
    text = re.sub(r"\bmenos(\d)", r"menos \1", text)

    # Ajuste de expresiones tipo "1 y media"
    text = re.sub(r"\b(\d)\s+y\s+(media|cuarto)", r"\1 y \2", text)

    return text

def clean_text(texto: str) -> str:
    # Corrección de errores comunes
    texto = texto.replace("mañaña", "mañana")
    texto = texto.replace("qeude", "quedé")
    texto = texto.replace("que de", "quedé")
    texto = texto.replace("que ve", "quedé")
    texto = texto.replace("qué ve", "quedé")

    # Conversión de números escritos
    texto = re.sub(
        r"(el día|día|dia)?\s*(catorce|trece|doce|once|diez|nueve|ocho|siete|seis|cinco|cuatro|tres|dos|una|uno)",
        lambda m: str(number_map.get(m.group(2).lower(), m.group(2))),
        texto,
        flags=re.IGNORECASE,
    )

    # Separador entre fecha y hora
    texto = re.sub(r"(de \w+),? a las", r"\1, a las", texto)

    # Aplicar normalización horaria
    texto = preformat_audio_text(texto)

    return texto.strip()

