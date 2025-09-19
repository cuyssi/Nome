/**──────────────────────────────────────────────────────────────────────────────┐
 * Función para filtrar tareas por tipo:                                         │
 *   • filterByType(tasks, types):                                               │
 *       - tasks: array de tareas.                                               │
 *       - types: tipo o array de tipos a filtrar.                               │
 *       - Devuelve solo las tareas cuyo type coincide con alguno de los tipos.  │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

export const filterByType = (tasks, types) => {
    const targetTypes = Array.isArray(types) ? types : [types];
    return tasks.filter((t) => {
        const currentTypes = Array.isArray(t.type) ? t.type : [t.type];
        return currentTypes.some((type) => targetTypes.includes(type));
    });
};
