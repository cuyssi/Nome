import { getTaskColor } from "../utils/getTaskColor";
import { useSwipeToDelete } from "./useSwipeToDelete";

export const useTaskCard = (task, onDelete) => {
  const {
    dragOffset,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isRemoving,
  } = useSwipeToDelete(() => onDelete(task.id));

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
    color,
  };
};