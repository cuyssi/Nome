import { useState, useEffect } from "react";
import { AVAILABLE_COLORS } from "../../utils/constants";
import { useBag } from "../../hooks/bag/useBag";

export const useBagEditor = ({ bag, onUpdateBag }) => {
    const { updateBag } = useBag();
    const [name, setName] = useState("");
    const [items, setItems] = useState([]);
    const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);
    const [reminderTime, setReminderTime] = useState(
        bag?.reminderTime
            ? { hour: bag.reminderTime.split(":")[0], minute: bag.reminderTime.split(":")[1] }
            : { hour: "20", minute: "00" }
    );
    const [notifyDays, setNotifyDays] = useState(bag?.notifyDays || ["L", "M", "X", "J", "V"]);

    useEffect(() => {
        if (bag) {
            setName(bag.name || "");
            setItems(Array.isArray(bag.items) ? bag.items : []);
            setSelectedColor(bag.color || AVAILABLE_COLORS[0].value);
        }
    }, [bag]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedBag = {
            ...bag,
            name,
            items,
            color: selectedColor,
            reminderTime: `${reminderTime.hour}:${reminderTime.minute}`,
            notifyDays,
        };

        updateBag(updatedBag);

        if (onUpdateBag) onUpdateBag(updatedBag);
    };

    return {
        handleSubmit,
        name,
        setName,
        items,
        setItems,
        selectedColor,
        setSelectedColor,
        reminderTime,
        setReminderTime,
        notifyDays,
        setNotifyDays,
    };
};
