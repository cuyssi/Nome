import { useStorageStore } from "../../store/storageStore";
import { useState } from "react";
import { buildDateTimeFromManual } from "../../utils/dateUtils";

export const Manual_taskInput = () => {
    console.log("👀 Estoy dentro del Manual_taskInput");
    const { createTask } = useStorageStore();
    const [text, setText] = useState("");
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("");

    const handleSave = () => {
        console.log("🎯 handleSave ejecutado", { text, date, hour });
        const dateTime = buildDateTimeFromManual(date, hour);

        if (!dateTime) {
            console.error("❌ Fecha u hora inválida");
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            text,
            date,
            hour,
            dateTime,
            completed: false,
            type: "personal",
            color: "red-400",
        };

        console.log("🧠 Nueva tarea manual:", newTask);
        createTask(newTask);
        setText("");
        setDate("");
        setHour("");
    };

    return (
        <div className="manual-task">
            <h2 className="text-white mb-2">Crear tarea manual</h2>
            <input
                type="text"
                placeholder="Escribe tu tarea..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <input type="text" placeholder="Fecha (ej: 31/7)" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="text" placeholder="Hora (ej: 18:30)" value={hour} onChange={(e) => setHour(e.target.value)} />
            <button onClick={() => console.log("✅ CLIC!")}>Guardar</button>
        </div>
    );
};
