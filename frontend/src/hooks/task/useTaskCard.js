import { useSwipeActions } from "../commons/useSwipeActions";
import { getTaskColor } from "../task/useTaskColor";

export const useTaskCard = (task, onDelete, onEdit, markAsCompleted) => {
    const handleEditTask = () => onEdit?.(task);
    const handleDeleteTask = () => onDelete?.(task.id);

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
        onDelete: handleDeleteTask,
        onEdit: handleEditTask,
        threshold: 160,
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
        },
        color,
    };
};
