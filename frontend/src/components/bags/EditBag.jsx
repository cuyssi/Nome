import { Plus } from "lucide-react";
import { useBagEditor } from "../../hooks/bag/useBagEditor";
import { Timer } from "../commons/formComponents/Timer";
import { DaySelector } from "../commons/formComponents/DaySelector";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonTrash } from "../commons/buttons/ButtonTrash";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { ColorPicker } from "../commons/formComponents/ColorPicker";
import { InputField } from "../commons/formComponents/InputField";

export const EditBag = ({ bag, isOpen, onClose, onUpdateBag }) => {
    const {
        handleItemChange,
        handleRemoveItem,
        handleSubmit,
        setName,
        items,
        selectedColor,
        setSelectedColor,
        reminderTime,
        setReminderTime,
        notifyDays,
        setNotifyDays,
        newItem,
        setNewItem,
        handleAddTypedItem,
    } = useBagEditor({ bag, isOpen, onClose, onUpdateBag });

    return (
        <div className="bg-white rounded-xl p-5 max-w-md w-full max-h-[75vh] flex flex-col relative">
            <ButtonClose onClick={onClose} />

            <h2
                className="text-2xl text-center text-purple-600 font-bold mt-4 mb-4"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
                Editar Mochila
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="overflow-y-auto flex-1 hide-scrollbar space-y-6 px-2">
                    <InputField
                        label="Nombre:"
                        type="text"
                        value={bag.name === "Clase" ? "Clase (* No se puede cambiar)" : bag.name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={bag.name === "Clase"}
                    />

                    <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

                    <div>
                        <label className="block font-semibold text-gray-500 mb-2">Contenido:</label>

                        <div className="grid grid-cols-[1fr_2rem] gap-1 w-full mb-4">
                            <input
                                type="text"
                                placeholder="Botella de agua"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTypedItem();
                                    }
                                }}
                                className="px-2 py-1 rounded-lg bg-gray-200 text-gray-900 border border-purple-300 focus:border-purple-500 focus:outline-none focus:ring-0 w-full"
                            />

                            <ButtonDefault
                                type="button"
                                onClick={handleAddTypedItem}
                                text={<Plus />}
                                className="flex justify-center items-center w-8 h-8 rounded-lg bg-green-400"
                            />
                        </div>

                        <ul className="text-sm text-purple-500 space-y-2">
                            {items.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center px-2 py-1 bg-gray-100 rounded border border-gray-300"
                                >
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleItemChange(index, e.target.value)}
                                        className="bg-transparent border-none w-full focus:outline-none"
                                    />
                                    <ButtonTrash type="button" onClick={() => handleRemoveItem(index)} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-semibold text-gray-500">Recordatorio:</label>
                        <Timer
                            hour={reminderTime.hour}
                            minute={reminderTime.minute}
                            onChange={(name, value) => setReminderTime({ ...reminderTime, [name]: value })}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1 text-gray-500">Días de recordatorio:</label>
                        <DaySelector selectedDays={notifyDays} setSelectedDays={setNotifyDays} />
                    </div>
                </div>

                <div className="pt-6">
                    <ButtonDefault type="submit" text="Guardar" className="w-full bg-purple-500" />
                </div>
            </form>
        </div>
    );
};
