import { X } from "lucide-react";
import { useItems } from "../../hooks/bag/useItems";
import { Modal } from "../commons/Modal"

export const BagItems = ({ bag,isOpen, onClose, onUpdateBag }) => {
    const { allItems, toggleItem, isComplete, packedItems } = useItems(bag, onUpdateBag);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="relative w-full bg-black border border-purple-600 rounded-xl p-6 max-w-md text-white shadow-lg">
                <h2 className="text-2xl text-center text-purple-400 font-bold mt-4">Items de {bag.name}</h2>

            {isComplete && <p className="text-green-700 text-center mt-4 font-bold">¡Mochila lista! 🎒✅</p>}

            {allItems.length === 0 ? (
                <p className="text-center mt-6">No hay items en esta mochila.</p>
            ) : (
                <ul className="space-y-5 mt-10 ml-5">
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

            <button onClick={onClose} className="absolute top-4 right-4 text-red-600 hover:text-red-800">
                <X className="w-8 h-8" />
            </button>
        </div>
    </Modal>
    );
};
