/**─────────────────────────────────────────────────────────────────────────────┐
 * Store global que sincroniza tareas con `localStorage` usando Zustand.        │
 * Proporciona funciones para actualizar, eliminar y recargar tareas guardadas. │
 * Ideal para mantener consistencia entre estado en memoria y persistencia local│
 * Facilita edición desde componentes sin duplicar lógica de almacenamiento.    │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";

export const useStorageStore = create((set) => ({
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],

    addTask: (newTask) => {
        const updatedTasks = [...(JSON.parse(localStorage.getItem("tasks")) || []), newTask];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        set({ tasks: updatedTasks });
    },

    updateTask: (updatedTask) => {
        const stored = JSON.parse(localStorage.getItem("tasks")) || [];
        const updated = stored.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task));
        localStorage.setItem("tasks", JSON.stringify(updated));
        set({ tasks: updated });
    },

    deleteTask: (id) => {
        const stored = JSON.parse(localStorage.getItem("tasks")) || [];
        const updated = stored.filter((task) => task.id !== id);
        localStorage.setItem("tasks", JSON.stringify(updated));
        set({ tasks: updated });
    },

    syncFromStorage: () => {
        const stored = JSON.parse(localStorage.getItem("tasks")) || [];
        set({ tasks: stored });
    },
}));
