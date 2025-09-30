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

import { Plus } from "lucide-react";
import { useCreateBag } from "../../hooks/bag/useCreateBag";
import { DaySelector } from "../commons/formComponents/DaySelector";
import { PREDEFINED_BAGS } from "../../utils/constants";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ButtonTrash } from "../commons/buttons/ButtonTrash";
import { Timer } from "../commons/formComponents/Timer";
export const CreateBag = ({ onClose, onSubmit }) => {
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
        <div className="bg-white rounded-xl p-5 max-w-md w-full max-h-[70vh] flex flex-col relative">
            <ButtonClose onClick={onClose} />

            <h2 className="text-2xl font-bold text-purple-600 mt-6 mb-4 text-center">Crear nueva mochila</h2>

            <form onSubmit={handleCreateCustomBag} className="flex flex-col flex-1 overflow-hidden">
                <div className="overflow-y-auto flex-1 hide-scrollbar space-y-6 px-2">
                    <div>
                        <h3 className="text-base text-gray-600 font-semibold">Mochilas sugeridas:</h3>
                        <div className="flex flex-col p-2 gap-2">
                            {PREDEFINED_BAGS.map((bag, i) => (
                                <ButtonDefault
                                    key={i}
                                    text={bag.name}
                                    onClick={() => handleAddPredefined(bag)}
                                    className={`bg-${bag.color} text-gray-600 px-2 py-1`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base text-gray-600 font-semibold mb-1">Personalizada:</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la mochila"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="w-full mb-2 px-2 py-1 rounded bg-gray-200 text-gray-900 text-center border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0"
                        />

                        <div className="grid grid-cols-[1fr_2rem] gap-2 w-full">
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
                                className="px-2 py-1 rounded bg-gray-200 text-gray-500 border border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-0 w-full"
                            />

                            <ButtonDefault
                                type="button"
                                onClick={handleAddCustomItem}
                                text={<Plus />}
                                className="flex justify-center items-center w-8 h-8 rounded-lg bg-green-400"
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
                    </div>

                    <Timer
                        hour={reminderTime.hour}
                        minute={reminderTime.minute}
                        onChange={(name, value) => setReminderTime({ ...reminderTime, [name]: value })}
                    />

                    <div>
                        <h4 className="text-sm font-semibold mb-2">Días de recordatorio</h4>
                        <DaySelector selectedDays={notifyDays} setSelectedDays={setNotifyDays} />
                    </div>
                </div>

                <div className="pt-6">
                    <ButtonDefault type="submit" text="Crear mochila personalizada" className="w-full bg-purple-500" />
                </div>
            </form>
        </div>
    );
};
