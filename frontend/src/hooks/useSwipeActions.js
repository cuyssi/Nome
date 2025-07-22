/**──────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado que gestiona acciones táctiles por desplazamiento lateral. │
 * Detecta gestos de swipe hacia la izquierda o derecha para editar o eliminar.  │
 * Aplica zonas de confirmación y animaciones suaves según la distancia del drag │
 * Ideal para tarjetas táctiles con controles intuitivos en dispositivos móviles.│
 *                                                                               │
 * @author: Ana Castro                                                           │
 └──────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";

export const useSwipeActions = (onDelete, threshold = 100, onEdit) => {
    const [dragStartX, setDragStartX] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDeleted, setIsDeleted] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isEdited, setIsEdited] = useState(false);

    const handleTouchStart = (e) => {
        setDragStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (dragStartX === null) return;

        const currentX = e.touches[0].clientX;
        const deltaX = currentX - dragStartX;

        const slowdownZone = 100;
        const maxOffset = 180;
        let adjustedOffset = deltaX;

        if (deltaX > slowdownZone) {
            const over = deltaX - slowdownZone;
            adjustedOffset = slowdownZone + over * 0.5;
        }

        if (deltaX < -slowdownZone) {
            const under = deltaX + slowdownZone;
            adjustedOffset = -slowdownZone + under * 0.5;
        }

        setDragOffset(Math.max(Math.min(adjustedOffset, maxOffset), -maxOffset));
    };

    const handleTouchEnd = () => {
        const deleteConfirmZone = 160;

        if (dragOffset >= deleteConfirmZone && !isDeleted) {
            setIsDeleted(true);
            setIsRemoving(true);
            setTimeout(() => onDelete(), 160);
        } else if (dragOffset <= -160 && !isEdited) {
            setIsEdited(true);
            setTimeout(() => onEdit(), 160);
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
        isEdited,
    };
};
