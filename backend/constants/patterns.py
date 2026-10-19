# ──────────────────────────────────────────────────────────────────────────────
# Patrones para normalizar textos de tareas escolares.
# - PAG: detecta números de página y los convierte a dígitos, añadiendo coma al final.
# - EJ: detecta ejercicios y los convierte a dígitos.
# La función alpha2digit transforma números escritos en palabras a números.
# ──────────────────────────────────────────────────────────────────────────────

from utils.alpha_to_num import alpha_to_num

PATTERNS = {
    "PAG": {
        "regex": r"\bpág\.?\s+([a-záéíóúñ\d\s]+?)(?=\s+ej:|$)",
        "placeholder": "__PAG__",
        "formatter": lambda num: f"Pág. {alpha_to_num(num.strip(), 'es')}, "
    },
    "EJ": {
        "regex": r"\bej:?\s+([a-záéíóúñ\d\s,]+)",
        "placeholder": "__EJ__",
        "formatter": lambda nums: f"Ej: {alpha_to_num(nums.strip(), 'es')}"
    },
    "tema": {
        "regex": r"\btema\s+([a-záéíóúñ\d]+)",
        "placeholder": "__TEMA__",
        "formatter": lambda nums: f"Tema: {alpha_to_num(nums.strip(), 'es')}"
    },
    "unidad": {
        "regex": r"\bunidad\s+([a-záéíóúñ\d]+)",
        "placeholder": "__UNIDAD__",
        "formatter": lambda nums: f"Unidad: {alpha_to_num(nums.strip(), 'es')}"
    },
    "lección": {
        "regex": r"\blección\s+([a-záéíóúñ\d]+)",
        "placeholder": "__LECCIÓN__",
        "formatter": lambda nums: f"Lección: {alpha_to_num(nums.strip(), 'es')}"
    },
}
