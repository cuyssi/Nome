import { useSwipeActions } from "./useSwipeActions";
import { getTaskColor } from "../utils/getTaskColor";

export const useTaskCard = (task, onDelete, onEdit) => {
  const safeEdit = onEdit ? () => onEdit(task) : () => {};

  const {
    dragOffset,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isRemoving,
    isEdited,
  } = useSwipeActions(() => onDelete(task.id), 200, safeEdit);

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
