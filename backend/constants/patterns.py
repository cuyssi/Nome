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
        "formatter": lambda num: f"Pág. {alpha2digit(num.strip(), 'es')}, "
    },
    "EJ": {
        "regex": r"\bej:?\s+([a-záéíóúñ\d\s,]+)",
        "placeholder": "__EJ__",
        "formatter": lambda nums: f"Ej: {alpha2digit(nums.strip(), 'es')}"
    },
    "tema": {
        "regex": r"\btema\s+([a-záéíóúñ\d]+)",
        "placeholder": "__TEMA__",
        "formatter": lambda nums: f"Tema: {alpha2digit(nums.strip(), 'es')}"
    },
    "unidad": {
        "regex": r"\bunidad\s+([a-záéíóúñ\d]+)",
        "placeholder": "__UNIDAD__",
        "formatter": lambda nums: f"Unidad: {alpha2digit(nums.strip(), 'es')}"
    },
    "lección": {
        "regex": r"\blección\s+([a-záéíóúñ\d]+)",
        "placeholder": "__LECCIÓN__",
        "formatter": lambda nums: f"Lección: {alpha2digit(nums.strip(), 'es')}"
    },
}
