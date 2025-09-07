import { useState, useEffect } from "react";
import { AVAILABLE_COLORS } from "../../utils/constants";

export const useBagEditor = ({ bag, onUpdateBag }) => {
    const [name, setName] = useState("");
    const [items, setItems] = useState([]);
    const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);

    useEffect(() => {
        if (bag) {
            setName(bag.name || "");
            setItems(Array.isArray(bag.items) ? bag.items : []);
            setSelectedColor(bag.color || AVAILABLE_COLORS[0].value);
        }
    }, [bag]);

    const handleItemChange = (index, value) => {
        const updated = [...items];
        updated[index] = value;
        setItems(updated);
    };

    const handleAddItem = () => setItems([...items, ""]);
    const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedBag = {
            ...bag,
            name,
            items,
            color: selectedColor,
        };
        onUpdateBag(updatedBag);
    };

    return {
        handleItemChange,
        handleAddItem,
        handleRemoveItem,
        handleSubmit,
        name,
        setName,
        items,
        setItems,
        selectedColor,
        setSelectedColor,
    };
};
