# ──────────────────────────────────────────────────────────────────────────────
# Inicialización de datos y sincronización de tareas cuando inicia el servidor.
# - Carga las suscripciones y tareas que ya había programadas.
# - subscriptions → Diccionario con las suscripciones push por deviceId.
# - scheduled_tasks → Lista de tareas programadas por deviceId.
# - active_timers → Timers activos en memoria para notificaciones.
# - task_lock → Candado (lock) que asegura que solo un hilo a la vez pueda
#   acceder o modificar scheduled_tasks y active_timers, evitando conflictos
#   entre timers y la lógica principal del servidor
# ──────────────────────────────────────────────────────────────────────────────

from services.notifications.storage import load_data
import threading

data = load_data()
subscriptions = data.get("subscriptions", {})
scheduled_tasks = data.get("scheduled_tasks", {})
active_timers = []
task_lock = threading.Lock()
