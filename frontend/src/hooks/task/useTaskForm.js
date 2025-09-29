/**─────────────────────────────────────────────────────────────────────────────
 * useTaskForm: hook para gestionar el estado y envío del formulario de tarea.
 *
 * Funcionalidad:
 *   • Inicializa el formulario con datos de una tarea existente o valores por defecto.
 *   • Mantiene el estado de los campos del formulario (texto, fecha, hora, color, tipo, repetición, recordatorio, etc.).
 *   • Convierte fechas y horas manuales a formato ISO para `dateTime`.
 *   • Normaliza la fecha para inputs tipo date y para mostrar en la interfaz.
 *   • Proporciona funciones para actualizar campos y enviar el formulario.
 *
 * Devuelve:
 *   • formData: objeto con todos los campos del formulario.
 *   • handleChange(e): actualiza el estado cuando cambian los inputs.
 *   • buildFinalTask(originalTask): construye el objeto tarea completo listo para guardar.
 *   • handleSubmit(e): envía la tarea final a la función `onSubmit`.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { buildDateTimeFromManual } from "../../utils/dateUtils";
import { FULL_WEEKDAYS_NUM } from "../../utils/constants";

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

export function useTaskForm(task, onSubmit) {
    const [formData, setFormData] = useState({
        text: "",
        date: "",
        hour: "00",
        minute: "00",
        color: "red-400",
        type: "task",
        repeat: "once",
        customDays: [],
        reminder: "5",
        notifyDayBefore: false,
    });

    useEffect(() => {
        if (task) {
            const [h, m] = (task.hour || "00:00").split(":");
            setFormData({
                text: task.text || task.text_raw || "",
                date: parseDateForInput(task.date),
                hour: h,
                minute: m,
                color: task.color || "red-400",
                type: task.type || "task",
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

    const buildFinalTask = (originalTask = {}) => {
        const fullHour = `${formData.hour}:${formData.minute}`;
        const dateTime = buildDateTimeFromManual(formData.date, fullHour);
        const numericCustomDays = formData.customDays || [];

        let repeat;
        if (numericCustomDays.length === 0) {
            repeat = "once";
        } else if (
            FULL_WEEKDAYS_NUM.every((d) => numericCustomDays.includes(d)) &&
            numericCustomDays.length === FULL_WEEKDAYS_NUM.length
        ) {
            repeat = "weekdays";
        } else if (numericCustomDays.length === 2 && numericCustomDays.includes(5) && numericCustomDays.includes(6)) {
            repeat = "weekend";
        } else {
            repeat = "custom";
        }

        return {
            ...originalTask,
            text: formData.text,
            text_raw: formData.text,
            date: normalizeDate(formData.date),
            dateFull: formData.date,
            hour: fullHour,
            color: formData.color,
            type: formData.type,
            dateTime,
            repeat,
            customDays: repeat === "custom" ? numericCustomDays : [],
            reminder: formData.reminder,
            notifyDayBefore: formData.notifyDayBefore,
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalTask = buildFinalTask(task || {});
        onSubmit(finalTask);
    };

    return {
        formData,
        handleChange,
        buildFinalTask,
        handleSubmit,
    };
}
