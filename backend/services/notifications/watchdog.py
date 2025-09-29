# ──────────────────────────────────────────────────────────────────────────────
# Módulo watchdog para detección de suspensión del sistema.#
#     • Ejecuta un bucle en segundo plano con un `time.sleep(interval)`.
#     • Calcula el delta entre iteraciones para detectar si el sistema ha estado
#       suspendido más tiempo del esperado.
#     • Si delta > (interval + threshold), se interpreta como que el sistema
#       estuvo en suspensión o congelado.
#     • En ese caso, llama a reprogram_all_tasks() para reprogramar las
#       notificaciones pendientes y evitar que se pierdan.#
# ──────────────────────────────────────────────────────────────────────────────

from services.notifications.scheduler import reprogram_all_tasks
import time

def watchdog_thread(interval=10, threshold=30):
    last_check = time.time()
    while True:
        time.sleep(interval)
        now = time.time()
        delta = now - last_check
        last_check = now

        if delta > (interval + threshold):
            print(f"⚠️ Detectada suspensión del sistema (delta={delta:.1f}s)")
            reprogram_all_tasks()
