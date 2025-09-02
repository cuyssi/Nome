import { useEffect } from "react";
import { Modal } from "../commons/Modal";
import { X } from "lucide-react";

export const BagItemsModal = ({ bag, isOpen, onClose, onUpdateBag }) => {
    const allItems = Array.isArray(bag.items) ? bag.items : [];
    const packedItems = Array.isArray(bag.packed) ? bag.packed : [];

    const toggleItem = (nombre) => {
        const updatedPacked = packedItems.includes(nombre)
            ? packedItems.filter((i) => i !== nombre)
            : [...packedItems, nombre];

        const updatedBag = {
            ...bag,
            packed: updatedPacked,
        };

        onUpdateBag(updatedBag);

        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    };

    const isComplete =
        allItems.length > 0 && allItems.every((item) => packedItems.includes(item));

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen}>
            <div className="relative bg-black border border-purple-600 rounded-xl p-6 w-[90%] max-w-md text-white shadow-lg">
                <h2 className="text-2xl text-center font-bold mt-4">
                    Items de {bag.name}
                </h2>

                {isComplete && (
                    <p className="text-green-700 text-center mt-4 font-bold">
                        ¡Mochila lista! 🎒✅
                    </p>
                )}

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
                                <span
                                    className={`text-lg ${
                                        packedItems.includes(item) ? "line-through" : ""
                                    }`}
                                >
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
