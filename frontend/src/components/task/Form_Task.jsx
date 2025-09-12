import { X, Check } from "lucide-react";
import { useTaskForm } from "../../hooks/task/useTaskForm";
import { AVAILABLE_TYPES, AVAILABLE_COLORS } from "../../utils/constants";
import { Button } from "../commons/Button";
import { Timer } from "../commons/Timer";
import { useState } from "react";

export const Form_Task = ({ task, onClose, onSubmit }) => {
    const { formData, showConfirmation, handleChange, handleSubmit } = useTaskForm(task, onSubmit, onClose);
    const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);

    return (
        <form className="relative bg-white rounded-xl p-5 max-w-md w-full max-h-[70vh] flex flex-col">
            <Button type="button" onClick={onClose} className="absolute top-4 right-4 text-red-400 hover:text-red-700">
                <X className="w-8 h-8" />
            </Button>

            {showConfirmation && (
                <p className="flex text-green-600 mb-3 font-semibold">
                    <Check /> Cambios guardados{" "}
                </p>
            )}

            <h2 className="text-2xl font-extrabold text-purple-500 text-center font-poppins mt-6">Editar tarea</h2>

            <div className="overflow-y-auto flex-1 pr-1 hide-scrollbar">
                <div className="flex flex-col justify-between gap-4 h-full text-gray-600 mt-4 font-semibold">
                    <label className="text-gray-500">
                        Texto:
                        <input
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            className="border border-purple-400 rounded-lg w-full p-1 font-normal text-gray-600"
                        />
                    </label>

                    <label className="text-gray-500">
                        Fecha:
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="border w-full border-purple-400 rounded-lg p-1 font-normal text-gray-600"
                        />
                    </label>

                    <Timer
                        hour={formData.hour}
                        minute={formData.minute}
                        onChange={(field, value) => handleChange({ target: { name: field, value } })}
                    />

                    <label className="font-semibold">
                        Color
                        <div className="flex gap-1 justify-start flex-wrap mt-2">
                            {AVAILABLE_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: "color", value: color.value } })}
                                    className={`w-8 h-8 rounded-full border-2 ${
                                        formData.color === color.value ? "border-gray-900" : "border-transparent"
                                    } bg-${color.value}`}
                                />
                            ))}
                        </div>
                    </label>

                    <label>
                        Tipo:
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="border w-full border-purple-400 rounded-lg p-1 font-normal"
                        >
                            {AVAILABLE_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Repetición:
                        <select
                            name="repeat"
                            value={formData.repeat || "once"}
                            onChange={handleChange}
                            className="border w-full border-purple-400 rounded-lg p-1 font-normal"
                        >
                            <option value="once">Una sola vez</option>
                            <option value="daily">Todos los días</option>
                            <option value="weekdays">De lunes a viernes</option>
                            <option value="custom">Personalizado</option>
                        </select>
                    </label>

                    {formData.repeat === "custom" && (
                        <div className="mt-2 flex justify-between flex-wrap gap-2">
                            {["L", "M", "X", "J", "V", "S", "D"].map((day, idx) => (
                                <label key={day} className="flex gap-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="customDays"
                                        value={idx}
                                        checked={formData.customDays?.includes(idx) || false}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            let updated = formData.customDays || [];
                                            if (e.target.checked) {
                                                updated = [...updated, value];
                                            } else {
                                                updated = updated.filter((v) => v !== value);
                                            }
                                            handleChange({ target: { name: "customDays", value: updated } });
                                        }}
                                        className="accent-purple-600"
                                    />
                                    {day}
                                </label>
                            ))}
                        </div>
                    )}

                    <label>
                        Recordatorio:
                        <select
                            name="reminder"
                            value={formData.reminder || "5"}
                            onChange={handleChange}
                            className="border w-full border-purple-400 rounded-lg p-1 font-normal"
                        >
                            <option value="5">5 minutos antes</option>
                            <option value="15">15 minutos antes</option>
                            <option value="30">30 minutos antes</option>
                            <option value="60">1 hora antes</option>
                            <option value="90">1 hora y media antes</option>
                            <option value="120">2 horas antes</option>
                        </select>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="notifyDayBefore"
                            checked={formData.notifyDayBefore || false}
                            onChange={(e) =>
                                handleChange({
                                    target: {
                                        name: "notifyDayBefore",
                                        value: e.target.checked,
                                    },
                                })
                            }
                            className="accent-purple-500"
                        />
                        Avisarme también el día antes
                    </label>
                </div>
            </div>
            <Button type="button" onClick={handleSubmit} className="bg-purple-600 text-white py-2 rounded mt-4">
                Guardar cambios
            </Button>
        </form>
    );
};
