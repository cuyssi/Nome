import { X } from "lucide-react";
import { useTaskForm } from "../../hooks/task/useTaskForm";
import { AVAILABLE_TYPES, AVAILABLE_COLORS } from "../../utils/constants";
import { Button } from "../commons/Button";
import { useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export const Form_Task = ({ task, onClose, onSubmit }) => {
    const { formData, showConfirmation, handleChange, handleSubmit } = useTaskForm(task, onSubmit, onClose);
    const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);
    
    return (
        <form className="relative bg-white rounded-xl p-5 max-w-md w-full max-h-[70vh] overflow-y-auto hide-scrollbar">
            {showConfirmation && <p className="text-green-600 mb-3 font-semibold">✅ Cambios guardados</p>}

            <Button type="button" onClick={onClose} className="absolute top-4 right-4 text-red-400 hover:text-red-700">
                <X className="w-8 h-8" />
            </Button>

            <div className="flex flex-col justify-between gap-4 h-full text-gray-600 mt-6 font-semibold">
                <label>
                    Texto:
                    <input
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        className="border border-blue-400 rounded-lg w-full p-1 font-normal"
                    />
                </label>

                <label>
                    Fecha:
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="border w-full border-blue-400 rounded-lg p-1 font-normal"
                    />
                </label>

                <label>
                    Hora:
                    <div className="flex justify-between px-4 items-center mt-2">
                        <div className="flex items-center border border-blue-400 rounded">
                            <Button
                                type="button"
                                onClick={() =>
                                    handleChange({
                                        target: {
                                            name: "hour",
                                            value: String((+formData.hour + 23) % 24).padStart(2, "0"),
                                        },
                                    })
                                }
                                className="px-1 text-blue-900  bg-gray-200 hover:bg-gray-400"
                            >
                                –
                            </Button>
                            <input
                                type="tel"
                                name="hour"
                                value={formData.hour}
                                onChange={(e) => {
                                    let val = Math.max(0, Math.min(23, Number(e.target.value)));
                                    handleChange({ target: { name: "hour", value: String(val).padStart(2, "0") } });
                                }}
                                className="text-center w-12 border-x border-blue-400 rounded font-normal"
                            />
                            <Button
                                type="button"
                                onClick={() =>
                                    handleChange({
                                        target: {
                                            name: "hour",
                                            value: String((+formData.hour + 1) % 24).padStart(2, "0"),
                                        },
                                    })
                                }
                                className="px-1 text-blue-900  bg-gray-200 hover:bg-gray-400"
                            >
                                +
                            </Button>
                        </div>

                        <div className="flex items-center justify-center border border-blue-400 rounded">
                            <Button
                                type="button"
                                onClick={() =>
                                    handleChange({
                                        target: {
                                            name: "minute",
                                            value: String((+formData.minute + 59) % 60).padStart(2, "0"),
                                        },
                                    })
                                }
                                className="px-1 text-blue-900  bg-gray-200 hover:bg-gray-400"
                            >
                                –
                            </Button>
                            <input
                                type="tel"
                                name="minute"
                                value={formData.minute}
                                onChange={(e) => {
                                    let val = Math.max(0, Math.min(59, Number(e.target.value)));
                                    handleChange({ target: { name: "minute", value: String(val).padStart(2) } });
                                }}
                                className="text-center w-12 border-x border-blue-400 rounded font-normal"
                            />
                            <Button
                                type="button"
                                onClick={() =>
                                    handleChange({
                                        target: {
                                            name: "minute",
                                            value: String((+formData.minute + 1) % 60).padStart(2, "0"),
                                        },
                                    })
                                }
                                className="px-1 text-blue-900  bg-gray-200 hover:bg-gray-400"
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </label>

                <label className="font-semibold">
                    Color
                    <div className="flex gap-1 justify-between flex-wrap mt-2">
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
                    <p className="text-sm text-gray-600">
                        Color seleccionado: {AVAILABLE_COLORS.find((c) => c.value === selectedColor)?.label}
                    </p>
                </label>
                <label>
                    Tipo:
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="border w-full border-blue-400 rounded-lg p-1 font-normal"
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
                        className="border w-full border-blue-400 rounded-lg p-1 font-normal"
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
                        className="border w-full border-blue-400 rounded-lg p-1 font-normal"
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
                        className="accent-purple-600"
                    />
                    Avisarme también el día antes
                </label>

                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-purple-600 text-white py-2 rounded mt-4 mb-4"
                >
                    Guardar cambios
                </Button>
            </div>
        </form>
    );
};
