/**─────────────────────────────────────────────────────────────────────────────┐
 * useCreateBag: hook para crear mochilas (bags) nuevas.                        │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Permite crear mochilas personalizadas con nombre, color y elementos.     │
 *   • Permite añadir elementos de forma individual antes de crear la mochila.  │
 *   • Permite añadir mochilas predefinidas directamente.                       │
 *   • Calcula la fecha y hora de recordatorio automáticamente.                 │
 *                                                                              │
 * Estado devuelto:                                                             │
 *   - customName: nombre de la mochila personalizada.                          │
 *   - customItems: elementos añadidos a la mochila.                            │
 *   - newItem: texto del nuevo elemento a añadir.                              │
 *   - notifyDays: días en los que se desea recibir recordatorio.               │
 *                                                                              │
 * Funciones:                                                                   │
 *   - handleAddPredefined(bag): añade una mochila predefinida.                 │
 *   - handleAddCustomItem(): añade un elemento a la mochila personalizada.     │
 *   - handleCreateCustomBag(): crea la mochila personalizada y la guarda.      │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { useBag } from "../../hooks/bag/useBag";
import { calculateReminderDateTime } from "../../utils/calculateReminder";

export const useCreateBag = ({ onClose }) => {
    const { addBag } = useBag();
    const [customName, setCustomName] = useState("");
    const [customItems, setCustomItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [notifyDays, setNotifyDays] = useState(["L", "M", "X", "J", "V"]);
    const [reminderTime, setReminderTime] = useState({ hour: "20", minute: "00" });

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

    const handleRemoveItem = (index) => {
        setCustomItems((prev) => prev.filter((_, i) => i !== index));
    };

    const reminderTimeString = `${reminderTime.hour}:${reminderTime.minute}`;

    const handleCreateCustomBag = () => {
        if (!customName.trim()) return;

        const newBag = {
            id: crypto.randomUUID(),
            name: customName.trim(),
            color: "gray-400",
            type: "personalizada",
            items: customItems,
            reminderTime: reminderTimeString,
            notifyDays,
            dateTime: calculateReminderDateTime({
                reminderTime: reminderTimeString,
                type: "personalizada",
                notifyDays,
            }).toISOString(),
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
        handleRemoveItem,
        handleCreateCustomBag,
        notifyDays,
        setNotifyDays,
        reminderTime,
        setReminderTime,
    };
};
