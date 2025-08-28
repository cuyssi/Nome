from text_to_num import alpha2digit

PATTERNS = {
    "PAGINA": {
        "regex": r"\bpág\.?\s+([a-záéíóúñ\d\s]+?)(?=\s+ej:|$)",
        "placeholder": "__PAGINA__",
        "formatter": lambda num: f"pág. {alpha2digit(num.strip(), 'es')}"
    },
    "DEBERES": {
        "regex": r"\bej:?\s+([a-záéíóúñ\d\s,]+)",
        "placeholder": "__DEBERES__",
        "formatter": lambda nums: f"ej: {alpha2digit(nums.strip(), 'es')}"
    }
}
