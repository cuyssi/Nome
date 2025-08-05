/**─────────────────────────────────────────────────────────────────────────────┐
 * Función utilitaria para filtrar tareas según su tipo.                        │
 * Permite incluir o excluir múltiples tipos utilizando el parámetro `exclude`. │
 * Si `types` es una cadena única, la convierte en arreglo para su comparación. │
 * Devuelve una lista con las tareas filtradas según los criterios definidos.   │
 * Ideal para separar tareas por contexto, categoría o subtipo.                 │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/


export const filterTasksSmart = (tasks, types = [], exclude = false) => {
    if (!Array.isArray(types)) types = [types];

    return tasks.filter(task => {
        const taskTypes = Array.isArray(task.type) ? task.type : [task.type];
        const hasMatch = taskTypes.some(t => types.includes(t));
        return exclude ? !hasMatch : hasMatch;
    });
};

