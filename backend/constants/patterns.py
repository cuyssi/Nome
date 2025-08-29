# ──────────────────────────────────────────────────────────────────────────────
# Patrones para normalizar textos de tareas escolares.
# - PAG: detecta números de página y los convierte a dígitos, añadiendo coma al final.
# - EJ: detecta ejercicios y los convierte a dígitos.
# La función alpha2digit transforma números escritos en palabras a números.
# ──────────────────────────────────────────────────────────────────────────────

from text_to_num import alpha2digit

PATTERNS = {
    "PAG": {
        "regex": r"\bpág\.?\s+([a-záéíóúñ\d\s]+?)(?=\s+ej:|$)",
        "placeholder": "__PAG__",
        "formatter": lambda num: f"pág. {alpha2digit(num.strip(), 'es')}, "
    },
    "EJ": {
        "regex": r"\bej:?\s+([a-záéíóúñ\d\s,]+)",
        "placeholder": "__EJ__",
        "formatter": lambda nums: f"ej: {alpha2digit(nums.strip(), 'es')}"
    }
}
