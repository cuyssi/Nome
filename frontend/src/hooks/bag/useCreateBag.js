import { useState } from "react";
import { useBagsStore } from "../../store/useBagsStore";

export const useCreateBag = ({ onClose }) => {
    const { addBag } = useBagsStore();
    const [customName, setCustomName] = useState("");
    const [customItems, setCustomItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    const handleAddPredefined = (bag) => {
        addBag({ id: crypto.randomUUID(), ...bag });
        onClose();
    };

    const handleAddCustomItem = () => {
        if (newItem.trim()) {
            setCustomItems([...customItems, newItem.trim()]);
            setNewItem("");
        }
    };

    const handleCreateCustomBag = () => {
        if (!customName.trim()) return;
        addBag({
            id: crypto.randomUUID(),
            name: customName.trim(),
            color: "gray-400",
            type: "personalizada",
            items: customItems,
        });
        onClose();
    };

    return {
        customName,
        setCustomName,
        customItems,
        setCustomItems,
        newItem,
        setNewItem,
        handleAddPredefined,
        handleAddCustomItem,
        handleCreateCustomBag,
    };
};
