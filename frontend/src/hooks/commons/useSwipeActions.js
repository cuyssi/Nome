/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook useSwipeActions: gestiona gestos de swipe, long press y estados.        │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Detecta swipe horizontal y long press.                                   │
 *   • Calcula desplazamiento (dragOffset) y aplica slowdown zone.              │
 *   • Dispara callbacks onDelete o onEdit según dirección y umbral (threshold).│
 *   • Controla estados internos: isDragging, isRemoved, isEdited, isChecked.   │
 *   • Previene click accidental al eliminar o editar (preventClickRef).        │
 *                                                                              │
 * Parámetros:                                                                  │
 *   • task: objeto de la tarea o bag.                                          │
 *   • onDelete: callback al deslizar hacia derecha (delete).                   │
 *   • onEdit: callback al deslizar hacia izquierda (edit).                     │
 *   • threshold: distancia mínima en px para disparar acción (default 160).    │
 *   • isSchoolBag: indica si es mochila "Clase" (restricciones de swipe).      │
 *                                                                              │
 * Devuelve:                                                                    │
 *   • dragOffset: desplazamiento horizontal actual.                            │
 *   • gestureHandlers: funciones para eventos touch/pointer.                   │
 *   • handleLongPressStart / handleLongPressEnd: manejo de long press.         │
 *   • preventClickRef: referencia para bloquear click tras swipe.              │
 *   • isDragging, isRemoving, isEdited, isChecked: estados internos.           │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect, useCallback, useRef } from "react";
import { useStorageStore } from "../../store/storageStore";

export const useSwipeActions = ({ onDelete, threshold = 160, onEdit, task, isSchoolBag }) => {
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
            if (!hasMoved.current && toggleCompletedToday && task?.id) {
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

    const handlePointerDown = (e) => {
        handleStart(e.clientX);
        if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e) => {
        setIsDragging(true);
        handleMove(e.clientX);
    };
    const handlePointerUp = (e) => {
        endGesture(dragOffset);
        if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
    };

    useEffect(() => {
        const handlePointerUpGlobal = () => endGesture(dragOffset);
        document.addEventListener("pointerup", handlePointerUpGlobal);
        return () => document.removeEventListener("pointerup", handlePointerUpGlobal);
    }, [dragOffset, endGesture]);

    return {
        dragOffset,
        handlePointerStart: handlePointerDown,
        handlePointerMove,
        handlePointerEnd: handlePointerUp,
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
