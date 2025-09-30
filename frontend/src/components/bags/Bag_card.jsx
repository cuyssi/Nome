/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente Bag_card: tarjeta visual de una mochila.                          │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Muestra el nombre de la mochila.                                         │
 *   • Permite acciones de eliminar o editar (swipe o iconos).                  │
 *   • Bloquea la apertura del modal si la tarjeta se desliza (swipe).          │
 *                                                                              │
 * Props:                                                                       │
 *   • bag: objeto mochila con información (id, name, color, items, notifyDays).│
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

export const Bag_card = ({ bag, onDelete, onOpenModal }) => {
    const isSchoolBag = bag.name === "Clase";

    const {
        gestureHandlers,
        state: { dragOffset, isRemoving, isDragging, preventClickRef },
        color,
    } = useCard(
        bag,
        () => onDelete(bag.id),
        () => onOpenModal(bag, "edit"),
        isSchoolBag
    );

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
            <div className="flex flex-col justify-center items-center px-4 w-full">
                <h3 className="text-xl font-bold text-white">{bag.name}</h3>
            </div>
        </SwipeCard>
    );
};
