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

    # Reemplazar número escrito por número cifrado
    texto = re.sub(
        r"(el día|día|dia)?\s*(catorce|trece|doce|once|diez|nueve|ocho|siete|seis|cinco|cuatro|tres|dos|una|uno)",
        lambda m: str(number_map.get(m.group(2).lower(), m.group(2))),
        texto,
        flags=re.IGNORECASE
    )

    # Corregir comas antes de "a las"
    texto = re.sub(r"(de \w+),? a las", r"\1, a las", texto)

    # Ahora aplicar corrección de espacios
    texto = preformat_audio_text(texto)
    print("🧼 clean_text output:", texto.strip())

    return texto.strip()
