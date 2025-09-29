/**──────────────────────────────────────────────────────────────────────────────┐
 * getRepeatLabel: genera un label visual para la repetición de una tarea.      │
 *                                                                              │
 * Parámetros:                                                                  │
 *   • task: objeto de tarea con propiedades:                                   │
 *       - repeat: string → tipo de repetición ("once", "daily", "weekdays",    │
 *         "custom").                                                            │
 *       - date: string → fecha en formato legible (solo para "once").          │
 *       - customDays: array de índices numéricos (0-6) para repetición custom.│
 *                                                                              
 * Comportamiento:                                                              │
 *   1. Si repeat es "once" o undefined, devuelve la fecha en gris.             │
 *   2. Si repeat es "daily", devuelve un icono circular (RefreshCw).          │
 *   3. Si repeat es "weekdays", devuelve "L-V" en azul.                        │
 *   4. Si repeat es "custom", usa task.customDays y DAYS para mostrar las      │
 *      letras correspondientes de forma ordenada y con estilo púrpura.        │
 *   5. Devuelve null si no hay repetición reconocida.                          │
 *
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { RefreshCw } from "lucide-react";
import { DAYS } from "../utils/constants";

export function getRepeatLabel(task) {
    if (!task.repeat || task.repeat === "once") {
        return <span className="text-gray-400">{task.date}</span>;
    }

    if (task.repeat === "daily") {
        return <RefreshCw className="inline w-8 h-8 text-purple-500" />;
    }

    if (task.repeat === "weekdays") {
        return <span className="text-blue-400 font-bold">L-V</span>;
    }

    if (task.repeat === "weekend") {
        return <span className="text-blue-400 font-bold">S-D</span>;
    }

    if (task.repeat === "custom" && task.customDays?.length) {
        const dayLabels = DAYS.filter((d, i) => task.customDays.includes(i)).map((d) => d.key);
        return <span className="text-purple-500 text-base text-center">{dayLabels.join(", ")}</span>;
    }

    return null;
}
