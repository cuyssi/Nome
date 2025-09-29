/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useFilteredTasks: hook para filtrar tareas según su tipo.                                       │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Clasifica las tareas en tres grupos principales:                                            │
 *       - deberesTasks: tareas relacionadas con deberes, ejercicios o estudio.                    │
 *       - trabajoTasks: tareas de tipo trabajo.                                                   │
 *       - examenesTasks: tareas de tipo examen, prueba o evaluación.                              │
 *   • Usa useMemo para recalcular los grupos solo cuando cambian las tareas.                      │
 *   • Permite manejar listas de tareas filtradas de manera eficiente y reusable.                  │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   - deberesTasks: array de tareas de tipo deberes/ejercicios/estudiar.                          │
 *   - trabajoTasks: array de tareas de tipo trabajo.                                              │
 *   - examenesTasks: array de tareas de tipo examen/prueba/evaluación.                            │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { useMemo } from "react";

export const useFilteredTasks = (tasks) => {
    const deberesTypes = ["deberes", "ejercicios", "estudiar"];
    const trabajoTypes = ["trabajo"];
    const examenesTypes = ["examen", "prueba", "evaluación"];

    const deberesTasks = useMemo(() => {
        return tasks.filter((t) => {
            const tipos = Array.isArray(t.type) ? t.type : [t.type];
            return tipos.some((tipo) => deberesTypes.includes(tipo));
        });
    }, [tasks]);

    const trabajoTasks = useMemo(() => {
        return tasks.filter((t) => {
            const tipos = Array.isArray(t.type) ? t.type : [t.type];
            return tipos.some((tipo) => trabajoTypes.includes(tipo));
        });
    }, [tasks]);

    const examenesTasks = useMemo(() => {
        return tasks.filter((t) => {
            const tipos = Array.isArray(t.type) ? t.type : [t.type];
            return tipos.some((tipo) => examenesTypes.includes(tipo));
        });
    }, [tasks]);

    return { deberesTasks, trabajoTasks, examenesTasks };
};
