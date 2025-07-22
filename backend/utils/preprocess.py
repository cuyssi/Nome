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
    text = re.sub(r"\blas(\d)", r"las \1", text)
    text = re.sub(r"\ba las(\d)", r"a las \1", text)
    text = re.sub(r"\bde las(\d)", r"de las \1", text)
    text = re.sub(r"\b(\d)\s+y\s+(media|cuarto)", r"\1 y \2", text)
    return text


def clean_text(texto: str) -> str:
    texto = texto.replace("mañaña", "mañana")

    texto = re.sub(
        r"(el día|día|dia)?\s*(catorce|trece|doce|once|diez|nueve|ocho|siete|seis|cinco|cuatro|tres|dos|una|uno)",
        lambda m: str(number_map.get(m.group(2).lower(), m.group(2))),
        texto,
        flags=re.IGNORECASE,
    )

    texto = re.sub(r"(de \w+),? a las", r"\1, a las", texto)

    texto = preformat_audio_text(texto)

    return texto.strip()
