import { useState, useEffect, useCallback, useRef } from "react";
import { useStorageStore } from "../../store/storageStore";

export const useSwipeActions = ({ onDelete, onEdit, threshold = 160, task, isSchoolBag }) => {
    const [dragStartX, setDragStartX] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const pressTimer = useRef(null);
    const hasMoved = useRef(false);
    const toggleCompletedToday = useStorageStore((state) => state.toggleCompletedToday);
    const preventClickRef = useRef(false);

    const handleStart = (clientX) => {
        setDragStartX(clientX);
        setIsDragging(true);
        hasMoved.current = false;

        clearTimeout(pressTimer.current);
        pressTimer.current = setTimeout(() => {
            if (!hasMoved.current && task?.id) {
                navigator.vibrate?.(150);
                setIsChecked((prev) => !prev);
                toggleCompletedToday(task.id, new Date().toLocaleDateString("sv-SE"));
            }
        }, 550);
    };

    const handleMove = (clientX) => {
        if (dragStartX === null) return;

        let deltaX = clientX - dragStartX;

        if (isSchoolBag && deltaX > 0) deltaX = 0;

        if (Math.abs(deltaX) > 10 && !hasMoved.current) {
            hasMoved.current = true;
            clearTimeout(pressTimer.current);
        }

        const slowdownZone = 100;
        const maxOffset = 180;
        let adjustedOffset = deltaX;
        if (deltaX > slowdownZone) adjustedOffset = slowdownZone + (deltaX - slowdownZone) * 0.5;
        if (deltaX < -slowdownZone) adjustedOffset = -slowdownZone + (deltaX + slowdownZone) * 0.5;

        setDragOffset(Math.max(Math.min(adjustedOffset, maxOffset), -maxOffset));
    };

    const endGesture = useCallback(
        (currentOffset = dragOffset) => {
            clearTimeout(pressTimer.current);

            if (currentOffset >= threshold && !isSchoolBag && !isDeleted) {
                navigator.vibrate?.(150);
                setIsDeleted(true);
                setIsRemoving(true);
                preventClickRef.current = true;
                setTimeout(() => (preventClickRef.current = false), 300);
                setTimeout(() => onDelete?.(), 160);
            } else if (currentOffset <= -threshold && !isEdited) {
                navigator.vibrate?.(150);
                setIsEdited(true);
                preventClickRef.current = true;
                setTimeout(() => (preventClickRef.current = false), 300);
                setTimeout(() => {
                    onEdit?.();
                    setIsEdited(false);
                }, 160);
            }

            setDragOffset(0);
            setDragStartX(null);
            setIsDragging(false);
        },
        [dragOffset, isDeleted, isEdited, onDelete, onEdit, threshold, isSchoolBag]
    );

    const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
    const handleTouchEnd = () => endGesture(dragOffset);
    const handlePointerStart = (e) => handleStart(e.clientX);
    const handlePointerMove = (e) => {
        setIsDragging(true);
        handleMove(e.clientX);
    };
    const handlePointerEnd = () => endGesture(dragOffset);

    useEffect(() => {
        const handlePointerUpGlobal = () => endGesture(dragOffset);
        document.addEventListener("pointerup", handlePointerUpGlobal);
        return () => {
            document.removeEventListener("pointerup", handlePointerUpGlobal);
        };
    }, [dragOffset, endGesture]);

    return {
        dragOffset,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handlePointerStart,
        handlePointerMove,
        handlePointerEnd,
        handleLongPressStart: () => {},
        handleLongPressEnd: () => clearTimeout(pressTimer.current),
        isChecked,
        isRemoving,
        isEdited,
        isDragging,
        setIsDragging,
        preventClickRef,
    };
};
