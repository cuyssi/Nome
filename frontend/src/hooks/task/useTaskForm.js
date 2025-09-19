/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useTaskForm: hook para gestionar el formulario de creación o edición de tareas.                 │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Mantiene el estado local del formulario (`formData`) incluyendo texto, fecha, hora, color,  │
 *     tipo de tarea, repetición, días personalizados y recordatorio.                              │
 *   • Inicializa el formulario con los valores de una tarea existente si se pasa `task`.          │
 *   • Convierte fechas ingresadas manualmente a un formato consistente (YYYY-MM-DD y HH:MM).      │
 *   • Normaliza la fecha para mostrarla en el backend como DD/MM.                                 │
 *   • Construye el `dateTime` completo usando `buildDateTimeFromManual`.                          │
 *   • Genera un nuevo ID con `uuidv4` si la tarea es nueva.                                       │
 *   • Llama a `onSubmit(finalTask)` para enviar la tarea creada o editada.                        │
 *   • Controla la confirmación visual (`showConfirmation`) y cierra el formulario tras 1.5s.      │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   - formData: estado del formulario con todos los campos de la tarea.                           │
 *   - showConfirmation: boolean para mostrar confirmación visual.                                 │
 *   - handleChange(e): función para actualizar los campos del formulario según su `name`.         │
 *   - handleSubmit(e): función para procesar y enviar la tarea al backend o store.                │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { buildDateTimeFromManual } from "../../utils/dateUtils";
import { v4 as uuidv4 } from "uuid";

function parseDateForInput(dateStr) {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (/^\d{1,2}\/\d{1,2}$/.test(dateStr)) {
        const [d, m] = dateStr.split("/").map(Number);
        const year = new Date().getFullYear();
        return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    return "";
}

function normalizeDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${Number(day)}/${Number(month)}`;
}

export function useTaskForm(task, onSubmit, onClose) {
    const [formData, setFormData] = useState({
        text: "",
        date: "",
        hour: "00",
        minute: "00",
        color: "red-400",
        type: "homework",
        repeat: "once",
        customDays: [],
        reminder: "5",
        notifyDayBefore: false,
    });

    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (task) {
            const [h, m] = (task.hour || "00:00").split(":");
            setFormData({
                text: task.text || task.text_raw || "",
                date: parseDateForInput(task.date),
                hour: h,
                minute: m,
                color: task.color || "red-400",
                type: task.type || "homework",
                repeat: task.repeat || "once",
                customDays: task.customDays || [],
                reminder: task.reminder || "5",
                notifyDayBefore: task.notifyDayBefore ?? false,
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullHour = `${formData.hour}:${formData.minute}`;
        let dateTime;

        try {
            dateTime = buildDateTimeFromManual(formData.date, fullHour);
        } catch (err) {
            console.error("Error building dateTime:", err);
            return;
        }

        const finalTask = task?.id
            ? {
                  ...task,
                  text: formData.text,
                  text_raw: formData.text,
                  date: normalizeDate(formData.date),
                  hour: fullHour,
                  color: formData.color,
                  type: formData.type,
                  dateTime,
                  repeat: formData.repeat,
                  customDays: formData.customDays,
                  reminder: formData.reminder,
                  notifyDayBefore: formData.notifyDayBefore,
              }
            : {
                  id: uuidv4(),
                  text: formData.text,
                  text_raw: formData.text,
                  date: normalizeDate(formData.date),
                  hour: fullHour,
                  color: formData.color,
                  type: formData.type,
                  dateTime,
                  repeat: formData.repeat,
                  customDays: formData.customDays,
                  reminder: formData.reminder,
                  notifyDayBefore: formData.notifyDayBefore,
              };

        onSubmit(finalTask);
        setShowConfirmation(true);
        setTimeout(() => onClose(), 1500);
    };

    return {
        formData,
        showConfirmation,
        handleChange,
        handleSubmit,
    };
}
