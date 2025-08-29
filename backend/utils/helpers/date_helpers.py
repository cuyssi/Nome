# ──────────────────────────────────────────────────────────────────────────────
# Función para comprobar si una fecha es hoy.
# - `is_today` recibe un objeto datetime y devuelve True si coincide con la fecha actual.
# Útil para marcar tareas o eventos como "hoy".
# ──────────────────────────────────────────────────────────────────────────────

from datetime import datetime

def is_today(dt):
    if not dt:
        return False
    result = dt.date() == datetime.now().date()

    return result
