/**────────────────────────────────────────────────────────────────────────────────┐
 * Componente de formulario para editar una tarea existente.                       │
 * Carga datos iniciales desde la tarea seleccionada y permite actualizarlos.      │
 * Muestra un mensaje de confirmación al guardar y cierra el modal automáticamente.│
 * Usa un botón flotante para cerrar manualmente sin guardar.                      │
 *                                                                                 │
 * @author: Ana Castro                                                             │
 └────────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useStorageStore } from "../../store/storageStore";

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
            setFormData({
                text: task.text || "",
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
        e.preventDefault();
        const updatedTask = { ...task, ...formData };
        onSubmit(updatedTask); // ✅ ya maneja la lógica desde Dates.jsx
        setShowConfirmation(true);
        setTimeout(() => onClose(), 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="relative bg-white rounded-xl p-6 w-[90%] h-[50%]">
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

                <button type="submit" className="bg-blue-600 text-white py-1 rounded mt-4">
                    Guardar cambios
                </button>
            </div>
        </form>
    );
}
