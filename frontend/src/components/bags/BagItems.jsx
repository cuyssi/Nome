/**────────────────────────────────────────────────────────────────────────────────┐
 * BagItems: modal para ver y marcar los items de una mochila.                     │
 *                                                                                 │
 * Funcionalidad:                                                                  │
 *   • Muestra todos los items de la bolsa pasada como prop `bag`.                 │
 *   • Permite marcar items como "empaquetados" usando checkboxes.                 │
 *   • Muestra un mensaje de éxito si todos los items están completos.             │
 *   • Usa el hook useItems para gestionar el estado de los items y su completado. │
 *                                                                                 │
 * Props:                                                                          │
 *   - bag: objeto mochila a mostrar.                                              │
 *   - onClose: función para cerrar el modal.                                      │
 *   - onUpdateBag: función para actualizar la bolsa al cambiar items.             │
└─────────────────────────────────────────────────────────────────────────────────*/

import { Check } from "lucide-react";
import { useItems } from "../../hooks/bag/useItems";
import { ButtonClose } from "../commons/buttons/ButtonClose";

export const BagItems = ({ bag, onClose, onUpdateBag }) => {
    const { allItems, toggleItem, isComplete, packedItems } = useItems(bag, onUpdateBag);

    return (
        <div className="relative min-w-[20rem] max-w-[32rem] w-full max-h-[70vh] bg-black border border-purple-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl text-center text-purple-400 font-bold mt-6">Contenido de {bag.name}</h2>
            <div className="h-8 flex items-center justify-center ">
                {isComplete ? (
                    <p className="flex items-center gap-2 text-green-700 font-bold">
                        ¡Mochila lista! <Check />
                    </p>
                ) : null}
            </div>

            {allItems.length === 0 ? (
                <p className="text-center text-red-400 mt-4">No hay items en esta mochila.</p>
            ) : (
                <ul className="space-y-5 mt-2 ml-5">
                    {allItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={packedItems.includes(item)}
                                onChange={() => toggleItem(item)}
                                className="accent-purple-400 w-5 h-5"
                            />
                            <span className={`text-lg ${packedItems.includes(item) ? "line-through" : ""}`}>
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <ButtonClose onClick={onClose} />
        </div>
    );
};
