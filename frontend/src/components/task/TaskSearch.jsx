/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente TaskSearch: búsqueda y gestión rápida de tareas.                  │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Permite buscar tareas por texto, ignorando acentos y mayúsculas.         │
 *   • Muestra la lista filtrada de tareas con fecha, hora y texto.             │
 *   • Permite editar o eliminar tareas directamente desde la lista.            │
 *                                                                              │
 * Props:                                                                       │
 *   - openModalWithTask: función que abre el modal de edición de tarea.        │
 *                                                                              │
 * Estado interno:                                                              │
 *   - query: texto de búsqueda actual.                                         │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { useTasks } from "../../hooks/task/useTasks";
import { Pencil } from "lucide-react";
import { ButtonPencil } from "../commons/buttons/ButtonPencil";
import { ButtonTrash } from "../commons/buttons/ButtonTrash";
import { filterByQuery } from "../../utils/taskFilter";

export const TaskSearch = ({ openModalWithTask }) => {
    const { tasks, deleteTask } = useTasks();
    const [query, setQuery] = useState("");
    const filteredTasks = filterByQuery(tasks, query);

    return (
        <div className="w-full max-w-md mx-auto bg-black text-white p-4 rounded-md">
            <input
                type="text"
                placeholder="Buscar tarea..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full mb-4 p-2 rounded border border-gray-600 text-black"
            />

            {filteredTasks.length === 0 ? (
                <p className="text-gray-400">No se encontraron tareas.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {filteredTasks.map((task) => (
                        <li key={task.id} className="border-b py-1 flex justify-between items-center text-gray-300">
                            <div className="flex gap-1 items-center">
                                <div>
                                    <span className="text-red-400 font-semibold">[{task.date}]</span>
                                    <span className="text-purple-400 font-semibold">[{task.hour}]</span>
                                </div>
                                <span className={task.completed ? "line-through text-green-400" : undefined}>
                                    {task.text}
                                </span>
                            </div>
                            <div className="flex gap-2 ml-2">
                                <ButtonPencil onClick={() => openModalWithTask(task)} />
                                <ButtonTrash onClick={() => deleteTask(task.id)} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
