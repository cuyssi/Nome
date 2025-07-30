import { useStorageStore } from "../../store/storageStore";
import { Modal } from "../commons/Modal"
import { useState } from "react";
import { useModalStore } from "../../store/modalStore"

export const Manual_taskInput = () => {
    const { createTask } = useStorageStore();
    const [text, setText] = useState("");

    const handleSave = () => {
        const newTask = {
            id: crypto.randomUUID(),
            title: text,
            dateTime: new Date().toISOString(),
            completed: false,
        };
        createTask(newTask);
        setText("");
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
            <button onClick={handleSave}>Guardar</button>
        </div>
    );
};
