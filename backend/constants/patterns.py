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
