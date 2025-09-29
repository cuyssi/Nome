# ────────────────────────────────────────────────────────────────
# Función para imprimir paso a paso el procesamiento de tareas
#
# - print_task_result(result, steps, text_raw)
#     • result -> Diccionario con el resultado final de la tarea, incluyendo
#       texto limpio, datetime, tipo de tarea, etc.
#     • steps -> Diccionario con los distintos pasos de procesamiento y sus valores,
#       tal como se genera en `prepare_task_data`.
#     • text_raw -> Texto original de la tarea antes de cualquier normalización.
#
# Funcionalidad:
#     • Imprime el texto original de la tarea.
#     • Imprime cada paso de procesamiento con su valor correspondiente.
#       - Los diccionarios internos se muestran con sangría y claves/valores claros.
#     • Imprime el resultado final al final de la salida.
#     • Usa colores ANSI para mejorar la legibilidad en terminal.
# ────────────────────────────────────────────────────────────────

import re

def print_task_result(result, steps, text_raw):
    CYAN = "\033[96m"
    RESET = "\033[0m"

    print(f"{CYAN}=== Task Debug ==={RESET}")
    print(f"{CYAN}Raw Text:{RESET} {text_raw}\n")

    for key, value in steps.items():
        if isinstance(value, dict):
            print(f"{CYAN}{key}:{RESET}")
            for k, v in value.items():
                print(f"  - {k}: {v}")
        else:
            print(f"{CYAN}{key}:{RESET} {value}")
        print()
    print(f"{CYAN}Final Result:{RESET} {result}")
    print(f"{CYAN}=== End Debug ==={RESET}\n")
