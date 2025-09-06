import { useState } from "react";
import { useTasks } from "../../hooks/task/useTasks";
import { Trash2, Pencil } from "lucide-react";

export const TaskSearch = ({ openModalWithTask }) => {
    const { tasks, deleteTask } = useTasks();
    const [query, setQuery] = useState("");

    const normalizeText = (text) =>
        text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    const filteredTasks = tasks.filter((task) => normalizeText(task.text).includes(normalizeText(query)));

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
                                <span className="text-red-400 font-semibold">[{task.date}] </span>
                                <span className="text-purple-400 font-semibold">[{task.hour}]</span>
                                <span className={task.completed ? "line-through text-green-400" : ""}>{task.text}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModalWithTask(task)}
                                    className="text-blue-400 hover:text-blue-700"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
