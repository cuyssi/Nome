import { X } from "lucide-react";
import { useTaskForm } from "../../hooks/useTaskForm";
import { AVAILABLE_TYPES, AVAILABLE_COLORS } from "../../utils/constants";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export function Form({ task, onClose, onSubmit }) {
    const { formData, showConfirmation, handleChange, handleSubmit } = useTaskForm(task, onSubmit, onClose);

    return (
        <form className="relative bg-white rounded-xl p-6 w-[90%] h-[62%]">
            {showConfirmation && (
                <p className="text-green-600 text-center mb-3 font-semibold">✅ Changes saved successfully</p>
            )}

            <button type="button" onClick={onClose} className="absolute top-4 right-4 text-red-900 hover:text-red-700">
                <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col justify-between h-full text-gray-600 mt-6 font-semibold">
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
                    <div className="flex justify-between px-8 items-center mt-2">
                        {/* Hour */}
                        <div className="flex items-center border border-blue-400 rounded">
                            <button
                                type="button"
                                onClick={() =>
                                    handleChange({
                                        target: {
                                            name: "hour",
                                            value: String((+formData.hour + 1) % 24).padStart(2, "0"),
                                        },
                                    })
                                }
                                className="px-2 text-blue-900  bg-gray-200 hover:bg-gray-400"
                            >
                                +
                            </button>
                            <input
                                type="number"
                                name="hour"
                                value={formData.hour}
                                onChange={(e) => {
                                    let val = Math.max(0, Math.min(23, Number(e.target.value)));
                                    handleChange({ target: { name: "hour", value: String(val).padStart(2, "0") } });
                                }}
                                className="text-center w-12 border-x border-blue-400 rounded  font-normal"
                            />
                            <button
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
                            </button>
                        </div>

                        {/* Minute */}
                        <div className="flex items-center border border-blue-400 rounded">
                            <button
                                type="button"
                                onClick={() =>
                                    handleChange({
                                        target: {
                                            name: "minute",
                                            value: String((+formData.minute + 1) % 60).padStart(2, "0"),
                                        },
                                    })
                                }
                                className="px-2 text-blue-900  bg-gray-200 hover:bg-gray-400"
                            >
                                +
                            </button>
                            <input
                                type="number"
                                name="minute"
                                value={formData.minute}
                                onChange={(e) => {
                                    let val = Math.max(0, Math.min(59, Number(e.target.value)));
                                    handleChange({ target: { name: "minute", value: String(val).padStart(2, "0") } });
                                }}
                                className="text-center w-12 border-x border-blue-400 rounded font-normal"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    handleChange({
                                        target: {
                                            name: "minute",
                                            value: String((+formData.minute + 59) % 60).padStart(2, "0"),
                                        },
                                    })
                                }
                                className="px-2 text-blue-900  bg-gray-200 hover:bg-gray-400"
                            >
                                –
                            </button>
                        </div>
                    </div>
                </label>

                <label>
                    Color:
                    <select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="border w-full border-blue-400 rounded-lg p-1 font-normal"
                    >
                        {AVAILABLE_COLORS.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
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

                <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white py-2 rounded mb-4">
                    Guardar cambios
                </button>
            </div>
        </form>
    );
}
