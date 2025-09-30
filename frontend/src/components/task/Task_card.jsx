/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Task_card: tarjeta visual de una tarea.                             │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Muestra información de la tarea (texto, hora, repetición).               │
 *   • Permite acciones de swipe para eliminar o editar la tarea.               │
 *   • Bloquea click accidental al usar swipe (gestos de drag).                 │
 *   • Muestra estado de completada mediante línea tachada y estilo de texto.   │
 *                                                                              │
 * Props:                                                                       │
 *   • task: objeto tarea a mostrar (id, text, date, hour, type, color, etc.). │
 *   • onDelete: función llamada al eliminar la tarea.                          │
 *   • onEdit: función llamada al editar la tarea.                               │
 *                                                                              │
 * Hooks internos:                                                              │
 *   • useCard: gestiona gestos de swipe, long press, estado de arrastre y      │
 *     colores dinámicos según tipo/color de la tarea.                          │
 *   • useStorageStore: obtiene información sobre tareas completadas y toggle.  │
 *                                                                              │
 * Componentes internos:                                                        │
 *   • SwipeCard: contenedor con animaciones y manejo de gestos.                │
 *   • SwipeAction: iconos visuales de acción (eliminar, editar).               │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Trash2, Pencil } from "lucide-react";
import { useCard } from "../../hooks/commons/useCard";
import { useStorageStore } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/dateUtils";
import { getRepeatLabel } from "../../utils/getRepeatLabel";
import { SwipeCard } from "../commons/SwipeCard";
import { SwipeAction } from "../commons/SwipeAction";

export const Task_card = ({ task, onDelete, onEdit }) => {
    const isCompleted = useStorageStore.getState().isTaskCompletedForDate(task.id, toLocalYMD(new Date()));
    const { markAsCompleted } = useStorageStore();
    const {
        gestureHandlers,
        state: { dragOffset, isRemoving, isDragging },
        color,
    } = useCard(task, onDelete, onEdit, markAsCompleted);

    return (
        <SwipeCard
            dragOffset={dragOffset}
            isRemoving={isRemoving}
            color={color}
            gestureHandlers={gestureHandlers}
            leftAction={<SwipeAction icon={Trash2} label="¿Eliminar?" />}
            rightAction={<SwipeAction icon={Pencil} label="¿Editar?" />}
            onClick={() => {}}
        >
            {(task.date || task.hour) && (
                <div className="flex flex-1 flex-col w-[30%] border border-black border-r-white rounded-l-xl gap-1 justify-center text-center break-words">
                    <p className="text-gray-400 font-semibold text-2xl flex justify-center">{getRepeatLabel(task)}</p>
                    <p className="text-gray-400 font-bold text-xl">{task.hour}</p>
                </div>
            )}
            <div
                className={`flex flex-2 pl-6 w-[70%] text-base text-white break-words transition-all duration-300 ${
                    isCompleted ? "line-through text-white decoration-2 decoration-red-400 scale-[0.97]" : "text-white"
                }`}
            >
                {task.text}
            </div>
        </SwipeCard>
    );
};
