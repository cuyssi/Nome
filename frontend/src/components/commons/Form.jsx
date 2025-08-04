import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { buildDateTimeFromManual } from "../../utils/dateUtils";
import { v4 as uuidv4 } from "uuid";

const tareasCrudas = ["deberes", "ejercicios", "estudiar"];
const esCruda = (tipo) => tareasCrudas.includes(tipo);

export function Form({ task, onClose, onSubmit }) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState({
        text: "",
        date: "",
        hour: "",
        color: "",
    });

    useEffect(() => {
        if (task) {
            const usarRaw = esCruda(task.type);
            setFormData({
                text: usarRaw ? task.text_raw || "" : task.text || "",
                date: task.date || "",
                hour: task.hour || "",
                color: task.color || "",
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const usarRaw = esCruda(task?.type);

    const baseData = {
        date: formData.date,
        hour: formData.hour,
        color: formData.color,
        text: formData.text,       // Siempre incluye `text`
        text_raw: formData.text,   // Siempre incluye `text_raw`
    };

    const nuevaTarea = {
        id: uuidv4(),
        type: "personal",
        completed: false,
        ...baseData,
    };

    const dateTime = buildDateTimeFromManual(baseData.date, baseData.hour);
    const finalTask = task?.id ? { ...task, ...baseData, dateTime } : { ...nuevaTarea, dateTime };

    onSubmit(finalTask);
    setShowConfirmation(true);
    setTimeout(() => onClose(), 1500);
};

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && e.target.tagName === "INPUT") {
                handleSubmit(e);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [formData]);

    return (
        <form className="relative bg-white rounded-xl p-6 w-[90%] h-[50%]">
            {showConfirmation && (
                <p className="text-green-600 text-center mb-3 font-semibold">✅ Cambios guardados con éxito</p>
            )}

            <button onClick={onClose} className="absolute top-4 right-4 text-red-900 hover:text-red-700">
                <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col gap-3 text-gray-900">
                <label>
                    Texto:
                    <input name="text" value={formData.text} onChange={handleChange} className="border w-full p-1" />
                </label>

                <label>
                    Fecha:
                    <input name="date" value={formData.date} onChange={handleChange} className="border w-full p-1" />
                </label>

                <label>
                    Hora:
                    <input name="hour" value={formData.hour} onChange={handleChange} className="border w-full p-1" />
                </label>

                <label>
                    Color:
                    <input name="color" value={formData.color} onChange={handleChange} className="border w-full p-1" />
                </label>

                <button type="button" onClick={handleSubmit} className="bg-blue-600 text-white py-1 rounded mt-4">
                    Guardar cambios
                </button>
            </div>
        </form>
    );
}
