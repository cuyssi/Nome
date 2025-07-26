/**─────────────────────────────────────────────────────────────────────────────┐
 * Formulario interactivo para editar o registrar tareas en modal contextual.   │
 * Adapta el campo de texto según el tipo (raw vs procesado) de la tarea.       │
 * Pre-carga los datos existentes y actualiza con el estado local controlado.   │
 * Gestiona el envío manual o automático al pulsar ENTER sobre campos input.    │
 *                                                                              │
 * - Detecta si una tarea debe editarse como cruda ("deberes", "ejercicios").   │
 * - Muestra mensaje de confirmación tras guardar cambios.                      │
 * - Ejecuta cierre automático del modal después de guardar.                    │
 * - Usa Lucide React para mostrar el botón de cierre con icono "X".            │
 * - Admite interacción rápida con teclado y mejora accesibilidad.              │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { X } from "lucide-react";

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

        const usarRaw = esCruda(task.type);
        const updatedTask = {
            ...task,
            date: formData.date,
            hour: formData.hour,
            color: formData.color,
            ...(usarRaw ? { text_raw: formData.text } : { text: formData.text, text_raw: task.text_raw }),
        };

        onSubmit(updatedTask);
        setShowConfirmation(true);
        setTimeout(() => onClose(), 1500);
    };

    // 🧠 Detectar ENTER y forzar guardado
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
