/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook useCard: gestiona la lógica de interacción y estilo de una tarjeta.     │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Maneja gestos de swipe y long press usando useSwipeActions.              │
 *   • Calcula colores dinámicos según tipo o color personalizado.              │
 *   • Devuelve estado de la tarjeta (dragOffset, isRemoving, isDragging...).   │
 *                                                                              │
 * Parámetros:                                                                  │
 *   • task: objeto de la tarea o bag asociada a la tarjeta.                    │
 *   • onDelete: callback al eliminar.                                          │
 *   • onEdit: callback al editar.                                              │
 *   • isSchoolBag: indica si es mochila "Clase" (restricciones de swipe).      │
 *                                                                              │
 * Devuelve:                                                                    │
 *   • gestureHandlers: funciones para usar en eventos touch/pointer.           │
 *   • state: estado reactivo de la tarjeta.                                    │
 *   • color: clases de Tailwind generadas dinámicamente para bg, border y text │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

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
        preventClickRef,
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
            preventClickRef,
        },
        color,
    };
};
