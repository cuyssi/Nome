/**─────────────────────────────────────────────────────────────────────────────┐
 * Store global que sincroniza tareas con `localStorage` usando Zustand.        │
 * Proporciona funciones para añadir, actualizar y eliminar tareas guardadas.   │
 * Ideal para mantener consistencia entre estado en memoria y persistencia local│
 * Facilita edición desde componentes sin duplicar lógica de almacenamiento.    │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";
import { persist } from "zustand/middleware";

const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
        const [dayA, monthA] = a.date.split("/").map(Number);
        const [hourA, minuteA] = a.hour.split(":").map(Number);
        const [dayB, monthB] = b.date.split("/").map(Number);
        const [hourB, minuteB] = b.hour.split(":").map(Number);

        const dateA = new Date(2025, monthA - 1, dayA, hourA, minuteA);
        const dateB = new Date(2025, monthB - 1, dayB, hourB, minuteB);

        return dateA - dateB;
    });
};

export const useStorageStore = create(
    persist(
        (set, get) => ({
            tasks: [],

            addTask: (newTask) => {
                const tasks = [...get().tasks, newTask];
                set({ tasks: sortTasks(tasks) });
            },

            updateTask: (updatedTask) => {
                const tasks = get().tasks.map((task) =>
                    task.id === updatedTask.id ? { ...task, ...updatedTask } : task
                );
                set({ tasks: sortTasks(tasks) });
            },

            deleteTask: (id) => {
                const tasks = get().tasks.filter((task) => task.id !== id);
                set({ tasks: sortTasks(tasks) });
            },

            clearAllTasks: () => set({ tasks: [] }),

            getSortedTasks: () => {
                return sortTasks(get().tasks);
            },
        }),
        {
            name: "tasks-storage",
        }
    )
);
