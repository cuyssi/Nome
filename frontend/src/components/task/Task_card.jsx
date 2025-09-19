/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Task_card: representa visualmente una tarea dentro de la lista.   │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Muestra la información principal de la tarea:                            │
 *       - Texto de la tarea                                                    │
 *       - Fecha y hora (opcional)                                              │
 *       - Estado de completada (tachado si está completada)                    │
 *   • Soporta gestos táctiles y de puntero para:                               │
 *       - Arrastrar para marcar como completada                                │
 *       - Swipe para editar o eliminar (visualización de opciones)             │
 *   • Interacción con el hook useCard para animaciones y gestos.               │
 *   • Colores dinámicos según estado y tipo de tarea.                          │
 *                                                                              │
 * Props:                                                                       │
 *   • task (object): objeto tarea a mostrar.                                   │
 *   • onDelete (function): función para eliminar la tarea.                     │
 *   • onEdit (function): función para editar la tarea.                         │
 *                                                                              │
 * Layout y estilo:                                                             │
 *   • Contenedor principal con bordes redondeados y transición de color.       │
 *   • Indicadores visuales para eliminación/edición al deslizar.               │
 *   • Texto de tarea estilizado con tachado si está completada.                │
 *   • Usa Container_Card para el fondo y borde con gradiente decorativo.       │
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
        state: { dragOffset, isRemoving },
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
        >
            {(task.date || task.hour) && (
                <div className="flex flex-1 flex-col border border-black border-r-gray-900 rounded-l-xl h-full w-full px-3 gap-1 justify-center text-center">
                    <p className="text-gray-400 font-semibold text-3xl flex justify-center">{getRepeatLabel(task)}</p>
                    <p className="text-gray-400 font-bold text-xl">{task.hour}</p>
                </div>
            )}
            <div
                className={`flex flex-2 text-center justify-center items-center px-2 h-full w-full text-base text-white transition-all duration-300 ${
                    isCompleted ? "line-through text-white decoration-2 decoration-red-400 scale-[0.97]" : "text-white"
                }`}
            >
                {task.text}
            </div>
        </SwipeCard>
    );
};
