/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente visual para mostrar una tarjeta de tarea deslizable.              │
 * Permite editar o eliminar al deslizar hacia los lados, con feedback de color.│
 * Usa un hook personalizado para controlar el gesto táctil y estado visual.    │
 * El contenido se adapta según el tipo de tarea y estilos dinámicos.           │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import Container_task from "../commons/Container_task";
import { Trash2, Pencil } from "lucide-react";
import { useTaskCard } from "../../hooks/useTaskCard";

export const Task_card = ({ task, onDelete, onEdit }) => {
    const { dragOffset, handleTouchStart, handleTouchMove, handleTouchEnd, isRemoving, color } = useTaskCard(
        task,
        onDelete,
        onEdit
    );

    return (
        <div className="relative w-full min-h-[6rem] overflow-hidden rounded-xl">
            <div
                className={`absolute inset-0 w-full z-0 flex items-center justify-between rounded-xl transition-colors duration-150 ease-in ${
                    dragOffset > 120
                        ? "bg-red-900"
                        : dragOffset > 80
                        ? "bg-red-500"
                        : dragOffset > 0
                        ? "bg-red-400"
                        : dragOffset < -120
                        ? "bg-yellow-900"
                        : dragOffset < -80
                        ? "bg-yellow-500"
                        : dragOffset < 0
                        ? "bg-yellow-200"
                        : "bg-gray-400"
                }`}
            >
                <div className="flex flex-col ml-4 justify-center items-center">
                    <Trash2 className="text-white w-8 h-8" />
                    <p className="text-white"> ¿Eliminar?</p>
                </div>
                <div className="flex flex-col mr-4 justify-center items-center">
                    <Pencil className="text-white w-8 h-8" />
                    <p className="text-white"> ¿Editar?</p>
                </div>
            </div>
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative rounded-xl z-10 ${color.bg} transition-transform duration-150 ease-out ${
                    isRemoving ? "opacity-0 scale-90 blur-sm" : ""
                }`}
                style={{ transform: `translateX(${dragOffset}px)` }}
            >
                <Container_task outerClass={`${color.bg}`} innerClass={`${color.border}`}>
                    {task.date || task.time ? (
                        <div className="flex flex-1 flex-col border border-black border-r-gray-900 rounded-l-xl h-full w-full px-3 gap-1 justify-center text-center">
                            <p className="text-gray-400 font-semibold text-3xl">{task.date}</p>
                            <p className="text-gray-400 font-bold text-xl">{task.hour}</p>
                        </div>
                    ) : null}
                    <div className="flex flex-2 text-center justify-center items-center px-2 h-full w-full text-sm text-white">
                        {["deberes", "ejercicios", "trabajo"].includes(task.type)
                            ? task.text_raw || task.text
                            : task.text}
                    </div>
                </Container_task>
            </div>
        </div>
    );
};
