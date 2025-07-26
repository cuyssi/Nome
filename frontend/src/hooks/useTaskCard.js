/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado para gestionar lógica visual y gestual en tarjetas.       │
 * Integra gestos táctiles de swipe para eliminar o editar una tarea.           │
 * Calcula estilos dinámicos (color, fondo, borde, texto) según el tipo o valor │
 * Ideal para tarjetas de tareas con interacción lateral y estilo por contexto. │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useSwipeActions } from "./useSwipeActions";
import { getTaskColor } from "./useTaskColor";

export const useTaskCard = (task, onDelete, onEdit) => {
    const safeEdit = onEdit ? () => onEdit(task) : () => {};

    const { dragOffset, handleTouchStart, handleTouchMove, handleTouchEnd, isRemoving, isEdited } = useSwipeActions(
        () => onDelete(task.id),
        200,
        safeEdit
    );

    const baseColor = task.color || getTaskColor(task.type).base;

    const color = {
        base: baseColor,
        bg: `bg-${baseColor}`,
        border: `border-${baseColor}`,
        text: `text-${baseColor}`,
    };

    return {
        dragOffset,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        isRemoving,
        isEdited,
        color,
    };
};
