import { useState, useEffect, useCallback, useRef } from "react";
import { useStorageStore } from "../store/storageStore";

export const useSwipeActions = ({ onDelete, threshold = 160, onEdit, task }) => {
    const [dragStartX, setDragStartX] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const pressTimer = useRef(null);
    const hasMoved = useRef(false);
    const toggleCompleted = useStorageStore((state) => state.toggleCompleted);

    const handleStart = (clientX) => {
        setDragStartX(clientX);
        setIsDragging(true);
        hasMoved.current = false;

        clearTimeout(pressTimer.current);
        pressTimer.current = setTimeout(() => {
            if (!hasMoved.current) {
                setIsChecked((prev) => !prev);
                toggleCompleted(task.id);
            }
        }, 550);
    };

    const handleMove = (clientX) => {
        if (dragStartX === null) return;

        const deltaX = clientX - dragStartX;

        if (Math.abs(deltaX) > 10 && !hasMoved.current) {
            hasMoved.current = true;
            clearTimeout(pressTimer.current);
        }

        const slowdownZone = 100;
        const maxOffset = 180;
        let adjustedOffset = deltaX;

        if (deltaX > slowdownZone) {
            adjustedOffset = slowdownZone + (deltaX - slowdownZone) * 0.5;
        } else if (deltaX < -slowdownZone) {
            adjustedOffset = -slowdownZone + (deltaX + slowdownZone) * 0.5;
        }

        setDragOffset(Math.max(Math.min(adjustedOffset, maxOffset), -maxOffset));
    };

    const endGesture = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        clearTimeout(pressTimer.current);

        if (dragOffset >= 160 && !isDeleted) {
            setIsDeleted(true);
            setIsRemoving(true);
            setTimeout(() => onDelete(), 160);
        } else if (dragOffset <= -threshold && !isEdited) {
            setIsEdited(true);
            setTimeout(() => {
                onEdit();
                setIsEdited(false);
            }, 160);
        }
        setDragStartX(null);
        setDragOffset(0);
    }, [isDragging, dragOffset, threshold, isDeleted, isEdited, onDelete, onEdit]);

    const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);
    const handleTouchEnd = endGesture;

    const handlePointerStart = (e) => handleStart(e.clientX);
    const handlePointerMove = (e) => handleMove(e.clientX);
    const handlePointerEnd = endGesture;

    useEffect(() => {
        const handlePointerUpGlobal = () => endGesture();
        document.addEventListener("pointerup", handlePointerUpGlobal);
        return () => {
            document.removeEventListener("pointerup", handlePointerUpGlobal);
        };
    }, [endGesture]);

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
    };
};
