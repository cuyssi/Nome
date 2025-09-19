# ──────────────────────────────────────────────────────────────────────────────
# Módulo de persistencia para suscripciones y tareas programadas.
# - load_data() → Carga el archivo JSON con las suscripciones y tareas.
#     • Si el archivo no existe, lo crea con estructura vacía.
# - save_data(subscriptions, scheduled_tasks) → Guarda los datos en disco.
#     • Limpia las tareas eliminando claves temporales ('timer', 'rescheduled').
#     • Escribe el JSON con indentación para facilitar lectura y debug.
# ──────────────────────────────────────────────────────────────────────────────

import json
from services.notifications.config import JSON_FILE

def load_data():
    if not JSON_FILE.exists():
        with open(JSON_FILE, "w") as f:
            json.dump({"subscriptions": {}, "scheduled_tasks": {}}, f, indent=2)
    with open(JSON_FILE, "r") as f:
        return json.load(f)


def save_data(subscriptions, scheduled_tasks):
    clean_tasks = {
        device_id: [
            {k: v for k, v in t.items() if k not in ("timer", "rescheduled")}
            for t in tasks
        ]
        for device_id, tasks in scheduled_tasks.items()
    }
    with open(JSON_FILE, "w") as f:
        json.dump({"subscriptions": subscriptions, "scheduled_tasks": clean_tasks}, f, indent=2)
