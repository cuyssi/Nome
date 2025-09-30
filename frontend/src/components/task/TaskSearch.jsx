/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente TaskSearch: búsqueda de tareas.                                   │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Permite buscar tareas por texto, ignorando acentos y mayúsculas.         │
 *   • Muestra la lista filtrada de tareas con fecha, hora y texto.             │
 *                                                                              │
 * Estado interno:                                                              │
 *   - query: texto de búsqueda actual.                                         │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { useTasks } from "../../hooks/task/useTasks";
import { useStorageStore } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/dateUtils";
import { filterByQuery } from "../../utils/taskFilter";

export const TaskSearch = () => {
    const { tasks } = useTasks();
    const [query, setQuery] = useState("");
    const filteredTasks = filterByQuery(tasks, query);
    const todayYMD = toLocalYMD(new Date());

    return (
        <div className="w-full max-w-md mx-auto bg-black text-white p-4 rounded-md mt-4">
            <input
                type="text"
                placeholder="Buscar tarea..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full mb-4 p-2 rounded border border-gray-600 text-black"
            />

            {query.trim() === "" ? (
                <p className="text-gray-400">Escribe para buscar tareas...</p>
            ) : filteredTasks.length === 0 ? (
                <p className="text-gray-400">No se encontraron tareas.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {filteredTasks.map((task) => {
                        const taskYMD = task.dateTime.slice(0, 10); // extrae "2025-09-29"
                        const isCompleted = useStorageStore.getState().isTaskCompletedForDate(task.id, taskYMD);


                        return (
                            <li key={task.id} className="border-b py-1 flex text-gray-300">
                                <div className="flex items-center w-full gap-3">
                                    <div className="flex flex-col bg-gray-800 rounded w-[30%] p-1 text-center">
                                        <span className="text-red-400 font-semibold">{task.date}</span>
                                        <span className="text-purple-400 font-semibold">{task.hour}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p
                                            className={`text-start text-sm ${
                                                isCompleted ? "line-through text-white decoration-2 decoration-red-400 scale-[0.97]" : "text-white"
                                            }`}
                                        >
                                            {task.text}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
