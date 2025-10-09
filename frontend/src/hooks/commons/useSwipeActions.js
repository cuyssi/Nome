/**─────────────────────────────────────────────────────────────────────────────
 * useSwipeActions: hook para gestionar gestos táctiles y de ratón en tarjetas.
 *
 * Funcionalidad:
 *   • Detecta gestos de swipe horizontal para eliminar o editar tareas.
 *   • Detecta long press para marcar o desmarcar una tarea como completada hoy.
 *   • Limita el movimiento con zonas de desaceleración y máximo desplazamiento.
 *   • Soporta interacciones con mouse, touch y stylus (pointer events).
 *   • Controla vibración háptica al completar o eliminar/editar tareas.
 *   • Incluye prevención de clicks fantasma tras gestos de swipe.
 *   • Limpia correctamente listeners globales y timers de pulsación.
 *
 * Parámetros:
 *   - task: objeto de la tarea actual (debe incluir `id`).
 *   - onDelete: callback ejecutado al hacer swipe a la derecha (eliminar tarea).
 *   - onEdit: callback ejecutado al hacer swipe a la izquierda (editar tarea).
 *   - threshold: desplazamiento mínimo en píxeles para activar la acción (default: 160).
 *   - isSchoolBag: boolean para desactivar swipe hacia la derecha (default: false).
 *
 * Devuelve:
 *   • dragOffset: desplazamiento horizontal actual (número).
 *   • isDragging: indica si hay un gesto activo (boolean).
 *   • isRemoved: indica si la tarea ha sido eliminada por swipe (boolean).
 *   • isEdited: indica si se ha iniciado la edición por swipe (boolean).
 *   • isChecked: indica si la tarea fue marcada/desmarcada por long press.
 *   • preventClickRef: ref booleana para evitar clicks tras un swipe.
 *   • handlePointerDown / handlePointerMove / handlePointerUp: handlers para mouse/stylus.
 *   • handleTouchStart / handleTouchMove / handleTouchEnd: handlers para gestos táctiles.
 *   • handleLongPressStart / handleLongPressEnd: control del temporizador de pulsación.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { useState, useRef, useCallback, useEffect } from "react";
import { useStorageStore } from "../../store/storageStore";

export const useSwipeActions = ({ task, onDelete, onEdit, threshold = 100, isSchoolBag = false }) => {
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const dragStartX = useRef(null);
    const dragStartY = useRef(null);
    const hasMoved = useRef(false);
    const directionDetected = useRef(false);
    const preventClickRef = useRef(false);
    const pressTimer = useRef(null);
    const toggleCompletedToday = useStorageStore((state) => state.toggleCompletedToday);

    const handleStart = (x, y) => {
        dragStartX.current = x;
        dragStartY.current = y;
        hasMoved.current = false;
        directionDetected.current = false;
        setIsDragging(true);

        clearTimeout(pressTimer.current);
        pressTimer.current = setTimeout(() => {
            if (!hasMoved.current && task?.id) {
                navigator.vibrate?.(150);
                setIsChecked((prev) => !prev);
                toggleCompletedToday(task.id, new Date().toLocaleDateString("sv-SE"));
            }
        }, 550);
    };

    const handleMove = (x, y) => {
        if (dragStartX.current === null || dragStartY.current === null) return;

        const deltaX = x - dragStartX.current;
        const deltaY = y - dragStartY.current;

        if (!directionDetected.current) {
            if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;

            directionDetected.current = true;

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                hasMoved.current = true;
                clearTimeout(pressTimer.current);
                return;
            }

            hasMoved.current = true;
            clearTimeout(pressTimer.current);
        }

        let adjustedOffset = deltaX;
        const slowdownZone = 100;
        const maxOffset = 180;

        if (deltaX > slowdownZone) adjustedOffset = slowdownZone + (deltaX - slowdownZone) * 0.5;
        if (deltaX < -slowdownZone) adjustedOffset = -slowdownZone + (deltaX + slowdownZone) * 0.5;

        if (isSchoolBag && adjustedOffset > 0) adjustedOffset = 0;

        setDragOffset(Math.max(Math.min(adjustedOffset, maxOffset), -maxOffset));
    };

    const endGesture = useCallback(
        (currentOffset = dragOffset) => {
            clearTimeout(pressTimer.current);

            if (currentOffset >= threshold && !isSchoolBag && !isRemoved) {
                navigator.vibrate?.(150);
                setIsRemoved(true);
                preventClickRef.current = true;
                setTimeout(() => (preventClickRef.current = false), 300);
                setTimeout(() => onDelete?.(), 160);
            } else if (currentOffset <= -threshold && !isEdited) {
                navigator.vibrate?.(150);
                setIsEdited(true);
                preventClickRef.current = true;
                setTimeout(() => (preventClickRef.current = false), 300);
                setDragOffset(0);
                setTimeout(() => {
                    onEdit?.();
                    setIsEdited(false);
                    setDragOffset(0);
                }, 160);
            } else {
                setDragOffset(0);

                if (hasMoved.current) {
                    preventClickRef.current = true;
                    setTimeout(() => {
                        preventClickRef.current = false;
                    }, 300);
                }
            }

            dragStartX.current = null;
            dragStartY.current = null;
            setIsDragging(false);
            directionDetected.current = false;
        },
        [dragOffset, isRemoved, isEdited, onDelete, onEdit, threshold, isSchoolBag]
    );

    const handlePointerDown = (e) => handleStart(e.clientX, e.clientY);
    const handlePointerMove = (e) => handleMove(e.clientX, e.clientY);
    const handlePointerUp = () => endGesture(dragOffset);

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (e) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => endGesture(dragOffset);

    useEffect(() => {
        const handleGlobalPointerUp = () => endGesture(dragOffset);
        document.addEventListener("pointerup", handleGlobalPointerUp);
        return () => document.removeEventListener("pointerup", handleGlobalPointerUp);
    }, [dragOffset, endGesture]);

    return {
        dragOffset,
        setDragOffset,
        isDragging,
        setIsDragging,
        isRemoved,
        isEdited,
        setIsEdited,
        isChecked,
        preventClickRef,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleLongPressStart: () => {},
        handleLongPressEnd: () => clearTimeout(pressTimer.current),
    };
};
