/**─────────────────────────────────────────────────────────────────────────────
 * useCard: hook para gestionar la interacción y estilo visual de una tarjeta.
 *
 * Funcionalidad:
 *   • Conecta la lógica de gestos (`useSwipeActions`) con el componente visual de la tarjeta.
 *   • Gestiona acciones de edición y eliminación a partir de gestos de swipe.
 *   • Controla el estado de arrastre, edición, eliminación y marcado (checked).
 *   • Asigna colores base, fondo, borde y texto según el tipo o color de la tarea.
 *   • Previene clicks accidentales tras gestos de swipe.
 *
 * Parámetros:
 *   - task: objeto de la tarea actual.
 *   - onDelete: callback ejecutado al eliminar una tarea (por swipe o acción directa).
 *   - onEdit: callback ejecutado al editar una tarea (por swipe o acción directa).
 *   - isSchoolBag: boolean que bloquea el swipe a la derecha (por defecto: false).
 *
 * Devuelve:
 *   • gestureHandlers: objeto con handlers para todos los tipos de interacción:
 *       – handlePointerStart / handlePointerMove / handlePointerEnd: gestos de mouse o stylus.
 *       – handleTouchStart / handleTouchMove / handleTouchEnd: gestos táctiles.
 *       – handleLongPressStart / handleLongPressEnd: control del long press.
 *
 *   • state: objeto con estados internos de la tarjeta:
 *       – isChecked: indica si la tarea fue marcada/desmarcada por long press.
 *       – isRemoving: indica si la tarea está siendo eliminada.
 *       – isEdited: indica si está en modo edición.
 *       – dragOffset: desplazamiento horizontal actual.
 *       – isDragging: indica si se está arrastrando.
 *       – setIsDragging: setter manual del estado de arrastre.
 *       – preventClickRef: referencia para evitar clicks tras gestos de swipe.
 *
 *   • color: objeto con clases de color derivadas del tipo o color de la tarea:
 *       – base: nombre del color base.
 *       – bg / border / text: clases tailwind generadas dinámicamente.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { useSwipeActions } from "./useSwipeActions";
import { getTaskColor } from "../task/useTaskColor";

export const useCard = (task, onDelete, onEdit, isSchoolBag) => {
    const handleEditTask = () => onEdit?.(task);
    const handleDeleteTask = () => {
        if (!isSchoolBag) onDelete?.(task.id);
    };

    const {
        dragOffset,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleLongPressStart,
        handleLongPressEnd,
        isChecked,
        isRemoved,
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
            handlePointerStart: handlePointerDown,
            handlePointerMove,
            handlePointerEnd: handlePointerUp,
            handleTouchStart,
            handleTouchMove,
            handleTouchEnd,
            handleLongPressStart,
            handleLongPressEnd,
        },
        state: {
            isChecked,
            isRemoving: isRemoved,
            isEdited,
            dragOffset,
            isDragging,
            setIsDragging, // <--- añadir aquí también
            preventClickRef,
        },
        color,
    };
};
