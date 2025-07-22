/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado que gestiona el acceso y manipulación de las tareas.      │
 * Obtiene tareas desde almacenamiento local, filtra por tipo y ordena.         │
 * Permite editar, eliminar y recargar visualmente tras cada acción.            │
 * Ideal para centralizar la lógica de tareas en componentes reutilizables.     │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import {
    getTranscriptionOfStorage,
    sortedTasks,
    deleteTranscriptionById,
    updateTranscriptionById,
} from "../utils/transcriptionStorage";
import { filterTasks } from "../utils/taskFilter";
import { useState, useEffect } from "react";

export const useTasks = (type, exclude = false) => {
    const [tasks, setTasks] = useState([]);

    const loadTasks = () => {
        const stored = getTranscriptionOfStorage() || [];
        const sorted = sortedTasks(stored);
        const filtered = type ? filterTasks(sorted, type, exclude) : sorted;
        setTasks(filtered);
    };

    const deleteTask = (id) => {
        deleteTranscriptionById(id);
        loadTasks(); // recarga visual
    };

    const editTask = (updatedTask) => {
        updateTranscriptionById(updatedTask.id, updatedTask); // actualiza en localStorage
        loadTasks(); // 🔁 importante para reflejar el cambio
    };

    useEffect(() => {
        loadTasks();
    }, [type, exclude]);

    return {
        tasks,
        deleteTask,
        editTask,
        reload: loadTasks,
    };
};
