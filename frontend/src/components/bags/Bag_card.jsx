/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Bag_card: tarjeta visual de una mochila.                          │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Muestra el nombre de la mochila.                                         │
 *   • Muestra un icono de check si la mochila está completa                    │
 *     (isTomorrowBagComplete), alineado a la derecha sin alterar el nombre.    │
 *   • Permite acciones de eliminar o editar (swipe o iconos).                  │
 *   • Bloquea la apertura del modal si la tarjeta se desliza (swipe).          │
 *                                                                              │
 * Props:                                                                       │
 *   • bag: objeto mochila con información (id, name, color, items,             │
 *     notifyDays, isTomorrowBagComplete).                                      │
 *   • onDelete: función llamada al eliminar la mochila.                        │
 *   • onOpenModal: función para abrir modal de edición o visualización.        │
 *                                                                              │
 * Hooks internos:                                                              │
 *   • useCard: gestiona gestos de swipe, long press y estado de la tarjeta.    │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Trash2, Pencil } from "lucide-react";
import { useCard } from "../../hooks/commons/useCard";
import { SwipeCard } from "../commons/SwipeCard";
import { SwipeAction } from "../commons/SwipeAction";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useBagModalManager } from "../../hooks/bag/useBagModalManager";

export const Bag_card = ({ bag, onDelete, onOpenModal }) => {
    const isSchoolBag = bag.name === "Clase";
    const isCompleted = bag.isTomorrowBagComplete;
    const modalManager = useBagModalManager();

    const {
        gestureHandlers,
        state: { dragOffset, isRemoving, isDragging, preventClickRef },
        color,
        resetSwipe,
    } = useCard(
        bag,
        () => onDelete(bag.id),
        () => onOpenModal(bag, "edit"),
        isSchoolBag
    );

    useEffect(() => {
        if (!modalManager.isOpen) {
            resetSwipe();
        }
    }, [modalManager.isOpen]);

    return (
        <SwipeCard
            dragOffset={dragOffset}
            isRemoving={isRemoving}
            color={color}
            gestureHandlers={gestureHandlers}
            onClick={() => {
                if (!isDragging && !preventClickRef.current) {
                    onOpenModal(bag, isSchoolBag ? "school" : "items");
                }
            }}
            leftAction={!isSchoolBag && <SwipeAction icon={Trash2} label="¿Eliminar?" />}
            rightAction={<SwipeAction icon={Pencil} label="¿Editar?" />}
        >
            <div className="relative w-full flex justify-center items-center">
                <p className="text-xl font-bold text-text">{bag.name} </p>
                {isCompleted && <Check className="w-10 h-10 text-green-400 absolute right-5" />}
            </div>
        </SwipeCard>
    );
};
