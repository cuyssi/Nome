/**─────────────────────────────────────────────────────────────────────────────┐
 * Bag_card: tarjeta visual de una mochila.                                     │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Muestra el nombre de la bolsa.                                           │
 *   • Permite acciones de editar o eliminar (si no es la "Escolar").           │
 *   • Usa useCard para manejar gestos de arrastre y animaciones.               │
 *   • Colores y animaciones cambian según dirección y fuerza del gesto.        │
 *                                                                              │
 * Props:                                                                       │
 *   - onDelete: función llamada al eliminar la bolsa.                          │
 *   - onOpenModal: abre un modal para editar la bolsa o ver su contenido.      │
└──────────────────────────────────────────────────────────────────────────────*/

import { Trash2, Pencil } from "lucide-react";
import { useCard } from "../../hooks/commons/useCard";
import { SwipeCard } from "../commons/SwipeCard";
import { SwipeAction } from "../commons/SwipeAction";

export const Bag_card = ({ bag, onDelete, onOpenModal }) => {
    const isSchoolBag = bag.name === "Escolar";
    const {
        gestureHandlers,
        state: { dragOffset, isRemoving, isDragging },
        color,
    } = useCard(bag, onDelete, () => onOpenModal(bag, "edit"), isSchoolBag);

    return (
        <SwipeCard
            dragOffset={dragOffset}
            isRemoving={isRemoving}
            color={color}
            gestureHandlers={gestureHandlers}
            onClick={() => !isDragging && onOpenModal(bag, isSchoolBag ? "school" : "items")}
            leftAction={!isSchoolBag && <SwipeAction icon={Trash2} label="¿Eliminar?" />}
            rightAction={<SwipeAction icon={Pencil} label="¿Editar?" />}
        >
            <div className="flex flex-col justify-center items-center px-4 w-full">
                <h3 className="text-xl font-bold text-white">{bag.name}</h3>
            </div>
        </SwipeCard>
    );
};
