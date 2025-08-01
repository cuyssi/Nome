import { useSwipeActions } from "./useSwipeActions";
import { getTaskColor } from "./useTaskColor";

export const useTaskCard = (task, onDelete, onEdit, markAsCompleted) => {
    const safeEdit = onEdit ? () => onEdit(task) : () => {};

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
    } = useSwipeActions({
        task,
        onDelete: () => onDelete(task.id),
        threshold: 160,
        onEdit: safeEdit,
        markAsCompleted,
    });

    const baseColor = task.color || getTaskColor(task.type).base;

    const color = {
        base: baseColor,
        bg: `bg-${baseColor}`,
        border: `border-${baseColor}`,
        text: `text-${baseColor}`,
    };

    return {
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
        color,
    };
};
