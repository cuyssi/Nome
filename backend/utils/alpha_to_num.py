# ──────────────────────────────────────────────────────────────────────────────
# Utilidad para convertir texto a números.
# - Alpha2digit funciona bien para números en palabras, excepto cuando la palabra
#   "dos" aparece sola.
# - Por ello usamos un regex para detectar si "dos" va sola o acompañada de otros
#   números.
#   • Si va sola → aplicamos CORRECTIONS directamente.
#   • Si va acompañada → usamos alpha2digit para convertir correctamente (ej. años).
# ──────────────────────────────────────────────────────────────────────────────

from text_to_num import alpha2digit
import re

CORRECTIONS = {
    "dos": "2",
}

def alpha_to_num(text: str, lang: str = "es") -> str:
    for word, repl in CORRECTIONS.items():
        pattern = re.compile(rf'\b{word}\b(?!\s+mil)', flags=re.IGNORECASE)
        text = pattern.sub(repl, text)

    text = alpha2digit(text, lang=lang)
    return text
