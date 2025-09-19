/**────────────────────────────────────────────────────────────────────────────────┐
 * useCard: hook para gestionar la lógica de interacción y estilo de una tarjeta   │
 * de tarea.                                                                       │
 *                                                                                 │
 * Parámetros:                                                                     │
 *   - task: objeto con la información de la tarea.                                │
 *   - onDelete: callback para eliminar la tarea.                                  │
 *   - onEdit: callback para editar la tarea.                                      │
 *   - markAsCompleted: callback para marcar/completar la tarea.                   │
 *                                                                                 │
 * Funcionalidad:                                                                  │
 *   • Gestiona los gestos de arrastre, toque y long press usando useSwipeActions. │
 *   • Devuelve estado de la tarjeta:                                              │
 *       - isChecked, isRemoving, isEdited, dragOffset                             │
 *   • Calcula los colores de la tarjeta según tipo o color personalizado.         │
 *                                                                                 │
 * Devuelve:                                                                       │
 *   - gestureHandlers: conjunto de funciones para manejar gestos y eventos.       │
 *   - state: estado reactivo de la tarjeta.                                       │
 *   - color: clases de Tailwind generadas dinámicamente para bg, border y text.   │
└─────────────────────────────────────────────────────────────────────────────────*/

import { useSwipeActions } from "./useSwipeActions";
import { getTaskColor } from "../task/useTaskColor";

export const useCard = (task, onDelete, onEdit, isSchoolBag) => {
    const handleEditTask = () => onEdit?.(task);
    const handleDeleteTask = () => {
        if (!isSchoolBag) onDelete?.(task.id);
    };

    const {
        dragOffset,
        handlePointerStart,
        handlePointerMove,
        handlePointerEnd,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleLongPressStart,
        handleLongPressEnd,
        isChecked,
        isRemoving,
        isEdited,
        isDragging,
        setIsDragging,
    } = useSwipeActions({
        task,
        onDelete: handleDeleteTask,
        onEdit: handleEditTask,
        threshold: 160,
        isSchoolBag,
    });

    const baseColor = task.color || getTaskColor(task.type).base;

    const color = {
        base: baseColor,
        bg: `bg-${baseColor}`,
        border: `border-${baseColor}`,
        text: `text-${baseColor}`,
    };

    return {
        gestureHandlers: {
            handlePointerStart,
            handlePointerMove,
            handlePointerEnd,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            handleLongPressStart,
            handleLongPressEnd,
        },
        state: {
            isChecked,
            isRemoving,
            isEdited,
            dragOffset,
            isDragging,
            setIsDragging,
        },
        color,
    };
};
