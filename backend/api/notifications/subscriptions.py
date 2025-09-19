# ──────────────────────────────────────────────────────────────────────────────
# Inicialización de datos y sincronización de tareas.
# - Carga las suscripciones y tareas programadas desde disco.
# - subscriptions → Diccionario con las suscripciones push por deviceId.
# - scheduled_tasks → Lista de tareas programadas por deviceId.
# - active_timers → Timers activos en memoria para notificaciones.
# - task_lock → Lock global para sincronizar acceso a tareas en hilos.
# ──────────────────────────────────────────────────────────────────────────────

import threading
from services.notifications.storage import load_data

data = load_data()
subscriptions = data.get("subscriptions", {})
scheduled_tasks = data.get("scheduled_tasks", {})
active_timers = []
task_lock = threading.Lock()
