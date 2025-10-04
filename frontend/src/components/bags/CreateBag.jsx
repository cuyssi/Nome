/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente CreateBag: modal para crear nuevas mochilas.                      │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Mochilas sugeridas: botones predefinidos con nombre, color, items y      │
 *     días de notificación.                                                    │
 *   • Mochilas personalizadas: permite introducir nombre, agregar items        │
 *     manualmente y seleccionar días de recordatorio.                          │
 *                                                                              │
 * Props:                                                                       │
 *   • onClose: función para cerrar el modal.                                   │
 *   • onSubmit: función llamada al crear la mochila, pasando los datos de      │
 *     la mochila creada.                                                       │
 *                                                                              │
 * Hooks internos:                                                              │
 *   • useCreateBag: gestiona estado del nombre, items, días de notificación    │
 *     y acciones de creación.                                                  │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Plus, Minus } from "lucide-react";
import { useCreateBag } from "../../hooks/bag/useCreateBag";
import { DaySelector } from "../commons/formComponents/DaySelector";
import { PREDEFINED_BAGS } from "../../utils/constants";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ButtonTrash } from "../commons/buttons/ButtonTrash";
import { InputField } from "../commons/formComponents/InputField"
import { Timer } from "../commons/formComponents/Timer";
import { useState } from "react";

export const CreateBag = ({ onClose, onSubmit }) => {
    const [showSuggested, setShowSuggested] = useState(false);
    const [showCustom, setShowCustom] = useState(false);

    const {
        customName,
        setCustomName,
        customItems,
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
    } = useCreateBag({ onClose, onSubmit });

    return (
        <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] flex flex-col relative text-lg">
            <ButtonClose onClick={onClose} />

            <h2
                className="text-3xl font-bold text-purple-600 mt-10 mb-10 text-center"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
                Nueva mochila
            </h2>

            <form onSubmit={handleCreateCustomBag} className="flex flex-col flex-1 overflow-hidden">
                <div className="overflow-y-auto flex flex-col justify-center items-center hide-scrollbar">
                    <button
                        type="button"
                        onClick={() => setShowSuggested(!showSuggested)}
                        className="w-[95%] border-2 justify-center border-orange-400 p-2 rounded-xl font-semibold text-gray-500 flex gap-2 items-center"
                    >
                        Sugeridas
                        <span>{showSuggested ? <Minus /> : <Plus />}</span>
                    </button>

                    {showSuggested && (
                        <div className="mt-6 flex flex-col px-2 gap-2">
                            {PREDEFINED_BAGS.map((bag, i) => (
                                <ButtonDefault
                                    key={i}
                                    text={bag.name}
                                    onClick={() => handleAddPredefined(bag)}
                                    className={`bg-${bag.color} text-gray-600 p-2 rounded`}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowCustom(!showCustom)}
                        className="mt-6 w-[95%] justify-center border-2 border-green-400 p-2 rounded-xl font-semibold text-gray-500 mb-2 flex gap-2 items-center"
                    >
                        Personalizada
                        <span>{showCustom ? <Minus /> : <Plus />}</span>
                    </button>

                    {showCustom && (
                        <div className="p-2">
                            <div className="p-2">
                                <InputField
                                    type="text"
                                    placeholder="Nombre de la mochila"
                                    value={customName}
                                    onChange={(e) => setCustomName(e.target.value)}                                    
                                />

                                <div className="mt-2 flex gap-2 w-full">
                                    <input
                                        type="text"
                                        placeholder="Contenido ej: agua"
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddCustomItem();
                                            }
                                        }}
                                        className="px-2 py-1 rounded-lg bg-gray-100 text-gray-500 border border-purple-400 focus:border-purple-800 focus:outline-none focus:ring-0 w-full"
                                    />

                                    <ButtonDefault
                                        type="button"
                                        onClick={handleAddCustomItem}
                                        text={<Plus />}
                                        className="flex justify-center items-center w-9 h-9 rounded-lg bg-green-400"
                                    />
                                </div>
                                <ul className="text-sm text-purple-500 mb-4 w-[60%] ">
                                    {customItems.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between items-center px-2 py-1 bg-gray-100 rounded mt-2 mb-1 border border-gray-300"
                                        >
                                            <span>{item}</span>
                                            <ButtonTrash onClick={() => handleRemoveItem(i)} />
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="text-purple-600 font-semibold text-sm">Reecordatorio:</h3>
                                <Timer
                                    hour={reminderTime.hour}
                                    minute={reminderTime.minute}
                                    onChange={(name, value) => setReminderTime({ ...reminderTime, [name]: value })}
                                />

                                <DaySelector
                                    selectedDays={notifyDays}
                                    setSelectedDays={setNotifyDays}
                                    size="7"
                                    className="mt-4"
                                />

                                <ButtonDefault type="submit" text="Añadir" className="mt-8 w-full bg-purple-500" />
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
