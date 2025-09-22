/**───────────────────────────────────────────────────────────────────────────────────┐
 * useFilteredDates: hook para filtrar tareas por tipo.                               │
 *                                                                                    │
 * Parámetros:                                                                        │
 *   - tasks: array de objetos de tareas.                                             │
 *                                                                                    │
 * Funcionalidad:                                                                     │
 *   • Filtra las tareas excluyendo ciertos tipos para clasificarlas como "citas".    │
 *   • Extrae las tareas específicas de tipo "medico".                                │
 *   • Extrae las tareas específicas de tipo "otros".                                 │
 *                                                                                    │
 * Devuelve:                                                                          │
 *   - citasTasks: tareas que no son ["medico","deberes","trabajo","examen","otros"]. │
 *   - medicoTasks: tareas cuyo tipo es "medico".                                     │
 *   - otrosTasks: tareas cuyo tipo es "otros".                                       │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

import { useMemo } from "react";

export const useFilteredDates = (tasks) => {
    const tiposExcluir = ["médicos", "deberes", "trabajo", "examen", "otros"];

    const citasTasks = useMemo(() => {
        return tasks.filter((t) => {
            const tipos = Array.isArray(t.type) ? t.type : [t.type];
            return !tipos.some((tipo) => tiposExcluir.includes(tipo));
        });
    }, [tasks]);

    const medicoTasks = useMemo(() => {
        return tasks.filter((t) => {
            const tipos = Array.isArray(t.type) ? t.type : [t.type];
            return tipos.includes("médicos");
        });
    }, [tasks]);

    const otrosTasks = useMemo(() => {
        return tasks.filter((t) => {
            const tipos = Array.isArray(t.type) ? t.type : [t.type];
            return tipos.includes("otros");
        });
    }, [tasks]);

    return { citasTasks, medicoTasks, otrosTasks };
};
