/**─────────────────────────────────────────────────────────────────────────────┐
 * useBagEditor: hook para editar mochilas de forma controlada.                 │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Mantiene el estado de la mochila: nombre, color, items, recordatorio     │
 *     y días de notificación.                                                  │
 *   • Actualiza la mochila en el store mediante `updateBag`.                  │
 *   • Permite ejecutar un callback `onUpdateBag` después de guardar.          │
 *                                                                              │
 * Props:                                                                       │
 *   - bag: objeto mochila a editar.                                            │
 *   - onUpdateBag: función opcional que se llama con el bag actualizado.       │
 *                                                                              │
 * Estado devuelto:                                                             │
 *   - name, setName: nombre de la mochila y setter.                            │
 *   - items, setItems: array de elementos de la mochila y setter.              │
 *   - selectedColor, setSelectedColor: color de la mochila y setter.           │
 *   - reminderTime, setReminderTime: hora del recordatorio y setter.           │
 *   - notifyDays, setNotifyDays: días de notificación y setter.                │
 *   - notifyDayBefore, setNotifyDayBefore: aviso un día antes y setter.        │
 *   - handleSubmit: envía los cambios y actualiza la mochila.                  │
 *   - handleAddItem, handleItemChange, handleRemoveItem: gestión de items.     │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { AVAILABLE_COLORS } from "../../utils/constants";
import { useBag } from "../../hooks/bag/useBag";
import { calculateReminderDateTime } from "../../utils/calculateReminder";

export const useBagEditor = ({ bag, onUpdateBag }) => {
    const { updateBag } = useBag();
    const [name, setName] = useState(bag?.name || "");
    const [items, setItems] = useState(Array.isArray(bag?.items) ? bag.items : []);
    const [selectedColor, setSelectedColor] = useState(bag?.color || AVAILABLE_COLORS[0].value);
    const [notifyDays, setNotifyDays] = useState(bag?.notifyDays || ["L", "M", "X", "J", "V"]);
    const [newItem, setNewItem] = useState("");
    const [reminderTime, setReminderTime] = useState(
        bag?.reminderTime
            ? { hour: bag.reminderTime.split(":")[0], minute: bag.reminderTime.split(":")[1] }
            : { hour: "20", minute: "00" }
    );

    useEffect(() => {
        if (!bag) return;
        setName(bag.name || "");
        setItems(Array.isArray(bag.items) ? bag.items : []);
        setSelectedColor(bag.color || AVAILABLE_COLORS[0].value);
        setReminderTime(
            bag.reminderTime
                ? { hour: bag.reminderTime.split(":")[0], minute: bag.reminderTime.split(":")[1] }
                : { hour: "20", minute: "00" }
        );
        setNotifyDays(bag.notifyDays || ["L", "M", "X", "J", "V"]);
    }, [bag]);

    const handleSubmit = (e) => {
        e?.preventDefault?.();
        const dateTime = calculateReminderDateTime({
            reminderTime: `${reminderTime.hour}:${reminderTime.minute}`,
            type: bag.type,
            notifyDays,
        }).toISOString();

        const updatedBag = {
            ...bag,
            name,
            items,
            color: selectedColor,
            reminderTime: `${reminderTime.hour}:${reminderTime.minute}`,
            notifyDays,
            dateTime,
        };

        updateBag(updatedBag);
        onUpdateBag?.(updatedBag);
    };

    const handleAddTypedItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem("");
        }
    };

    const handleItemChange = (index, value) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const handleAddItem = () => setItems([...items, ""]);
    const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

    return {
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
        handleSubmit,
        handleAddItem,
        handleItemChange,
        handleRemoveItem,
        newItem,
        setNewItem,
        handleAddTypedItem,
    };
};
