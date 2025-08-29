import re

def limpiar_fecha_y_fragmento(texto, fecha_detectada, fragmento):
    # Elimina expresiones completas como "mañana a las 10 de la noche"
    if fragmento:
        fragmento_base = re.escape(fragmento.split()[-1])
        patron = (
            r"\b"
            r"(mañana|pasado mañana|hoy)?\s*"
            r"(a\s+la|a\s+las)?\s*"
            r"\d{1,2}(:\d{2})?\s*"
            r"(de|por)\s+"
            + fragmento_base +
            r"\b"
        )

        texto = re.sub(patron, "", texto, flags=re.IGNORECASE)

    # Elimina expresiones como "a las 5:30", "a la 1"
    texto = re.sub(r"\b(a\s+la|a\s+las)\s+\d{1,2}(:\d{2})?\b", "", texto, flags=re.IGNORECASE)

    # Elimina hora residual como "10" o "10:00"
    texto = re.sub(r"\b\d{1,2}(:\d{2})?\b", "", texto)

    # Elimina fragmentos como "por la tarde", "de la noche", etc.
    texto = re.sub(
        r"\b(por|de)\s+la\s+(mañana|tarde|noche|madrugada)\b",
        "",
        texto,
        flags=re.IGNORECASE
    )

    # Elimina expresiones temporales como "mañana", "hoy", etc.
    texto = re.sub(
        r"\b(mañana|hoy|pasado mañana|esta noche|esta tarde|esta mañana)\b",
        "",
        texto,
        flags=re.IGNORECASE
    )

    # Limpieza final
    texto = re.sub(r"\s{2,}", " ", texto).strip()
    texto = texto[0].upper() + texto[1:] if texto else texto
    return texto


def formatear_listas_con_comas(texto):
    print(f"[PONER COMAS] texto antes: {texto}")
    # Paso 1: Eliminar comas mal colocadas antes de artículos
    texto = re.sub(r'(\b(?:el|la|los|las)\b),\s+', r'\1 ', texto)

    # Paso 2: Insertar comas entre elementos repetidos con artículos definidos
    texto = re.sub(r'(?<!^)(\b(?:el|la|los|las)\b)\s+(\w+)\s+(?=\b(?:el|la|los|las)\b)', r'\1 \2, ', texto)

    # Paso 3: Insertar comas en listas numéricas tipo "2 3 5 y 6"
    texto = re.sub(r'\b(\d+)\s+(?=\d+\s+y\b)', r'\1, ', texto)  # antes de penúltimo número
    texto = re.sub(r'\b(\d+)\s+(?=\d+\b)', r'\1, ', texto)      # entre números

    # Paso 4: Eliminar coma después de "y"
    texto = re.sub(r'\by,\s*', 'y ', texto)

    # Paso 5: Limpiar espacios antes de signos de puntuación
    texto = re.sub(r'\s+([.,:])', r'\1', texto)

    # Paso 6: Eliminar espacios duplicados
    texto = re.sub(r'\s{2,}', ' ', texto)

    print(f"[PONER COMAS] text: {texto.strip()}")
    return texto.strip()
