import { useState } from "react";
import { useBag } from "../../hooks/bag/useBag";

export const useCreateBag = ({ onClose }) => {
    const { addBag } = useBag();
    const [customName, setCustomName] = useState("");
    const [customItems, setCustomItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [notifyDays, setNotifyDays] = useState(["L", "M", "X", "J", "V"]);

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

        const newBag = {
            id: crypto.randomUUID(),
            name: customName.trim(),
            color: "gray-400",
            type: "personalizada",
            items: customItems,
            reminderTime: "20:00",
            notifyDays,
            notifyDayBefore: true,
        };
        addBag(newBag);
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
        notifyDays,
        setNotifyDays,
    };
};
