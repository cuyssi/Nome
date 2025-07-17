import { useState } from "react";

export const useSwipeToDelete = (onDelete, threshold = 200) => {
    const [dragStartX, setDragStartX] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleTouchStart = (e) => {
        setDragStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (dragStartX === null) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - dragStartX;

        if (deltaX > 0 && deltaX < threshold) {
            setDragOffset(deltaX);
        } else if (deltaX >= threshold + 80 && !isDeleted) {
            setIsDeleted(true);
            setIsRemoving(true);
            setTimeout(() => onDelete(), 240);
        }
    };

    const handleTouchEnd = () => {
        if (dragOffset >= threshold && !isDeleted) {
            setIsDeleted(true);
            setIsRemoving(true);
            setTimeout(() => onDelete(), 240);
        } else {
            setDragOffset(0);
        }
    };

    return {
        dragOffset,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        isRemoving,
    };
};
