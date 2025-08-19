import { useState, useEffect } from "react";
import { buildDateTimeFromManual } from "../utils/dateUtils";
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
              }
            : {
                  id: uuidv4(),
                  completed: false,
                  text: formData.text,
                  text_raw: formData.text,
                  date: normalizeDate(formData.date),
                  hour: fullHour,
                  color: formData.color,
                  type: formData.type,
                  dateTime,
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
