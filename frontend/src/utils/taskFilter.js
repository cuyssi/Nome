/**──────────────────────────────────────────────────────────────────────────────────────────────┐
 * Módulo de filtros de tareas: utilidades para clasificar, buscar y agrupar tareas.             │
 *                                                                                               │
 * Funciones:                                                                                    │
 *   - filterByType(tasks, types, exclude) → filtra tareas por tipo (o excluye si `exclude`).    │
 *   - filterByDate(tasks, date) → devuelve tareas activas en una fecha dada.                    │
 *   - splitTasksByCategory(tasks) → agrupa tareas por categoría semántica.                      │
 *   - filterByQuery(tasks, query) → busca tareas cuyo texto coincida con la consulta.           │
 *                                                                                               │
 * Detalles:                                                                                     │
 *   • Soporta tipos múltiples por tarea (`type` puede ser array o string).                      │
 *   • Reconoce repeticiones: "once", "daily", "weekdays", "custom".                             │
 *   • Agrupación semántica: deberes, trabajos, exámenes, médico, otros, citas.                  │
 *   • Normaliza texto para búsquedas insensibles a mayúsculas y acentos.                        │
 *                                                                                               │
 * Autor: Ana Castro                                                                             │
└───────────────────────────────────────────────────────────────────────────────────────────────*/

import { normalize } from "./normalize";
import { toLocalYMD } from "./dateUtils";

const normalizeTypes = (t) => (Array.isArray(t.type) ? t.type : [t.type]);

export const filterByType = (tasks, types, exclude = false) => {
    const targetTypes = Array.isArray(types) ? types : [types];
    return tasks.filter((t) => {
        const taskTypes = normalizeTypes(t);
        const hasMatch = taskTypes.some((tipo) => targetTypes.includes(tipo));
        return exclude ? !hasMatch : hasMatch;
    });
};

export const filterByDate = (tasks, date) => {
    const dateStr = toLocalYMD(date);
    const day = date.getDay();

    return tasks.filter((task) => {
        const taskDate = new Date(task.dateTime);

        if (task.repeat === "once") return toLocalYMD(taskDate) === dateStr;
        if (task.repeat === "daily") return true;
        if (task.repeat === "weekdays") return day >= 1 && day <= 5;
        if (task.repeat === "custom") {
            const customIndex = day === 0 ? 6 : day - 1;
            return task.customDays?.includes(customIndex);
        }

        return false;
    });
};

export const splitTasksByCategory = (tasks) => ({
    deberes: filterByType(tasks, ["deberes", "ejercicios", "estudiar"]),
    trabajos: filterByType(tasks, "trabajo"),
    examenes: filterByType(tasks, ["examen", "prueba", "evaluación"]),
    médicos: filterByType(tasks, "medico"),
    otros: filterByType(tasks, "otros"),
    citas: filterByType(tasks, ["medico", "deberes", "trabajo", "examen", "otros"], true),
});

export const filterByQuery = (tasks, query) => {
    const nq = normalize(query);
    return tasks.filter((task) => normalize(task.text).includes(nq));
};
