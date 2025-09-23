/**─────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useStorageStore: store de Zustand para manejar tareas y su persistencia.                         │
 *                                                                                                  │
 * Funcionalidad:                                                                                   │
 *   • tasks: array de todas las tareas.                                                            │
 *   • completedToday: lista de IDs de tareas completadas hoy.                                      │
 *                                                                                                  │
 *   • addTask(newTask)                                                                             │
 *       - Añade una nueva tarea y la ordena por fecha/hora.                                        │
 *       - Envía notificación al backend si la tarea tiene dateTime y text.                         │
 *       - Si notifyDayBefore está activo, programa también recordatorio el día anterior.            │
 *                                                                                                  │
 *   • updateTask(id, updatedFields)                                                                │
 *       - Actualiza campos de una tarea existente.                                                 │
 *       - Cancela la tarea anterior en el backend y programa la nueva.                             │
 *       - Maneja también notifyDayBefore.                                                          │
 *                                                                                                  │
 *   • deleteTask(id)                                                                               │
 *       - Elimina una tarea y cancela su recordatorio en backend si existe deviceId.               │
 *                                                                                                  │
 *   • clearAllTasks()                                                                              │
 *       - Borra todas las tareas y completadas de hoy.                                             │
 *                                                                                                  │
 *   • getSortedTasks()                                                                             │
 *       - Devuelve todas las tareas ordenadas por fecha y hora.                                    │
 *                                                                                                  │
 *   • toggleCompletedToday(id, dateStr)                                                            │
 *       - Marca o desmarca una tarea como completada para una fecha específica.                    │
 *       - Solo afecta si la tarea está activa en esa fecha.                                        │
 *                                                                                                  │
 *   • isTaskCompletedForDate(id, dateStr)                                                          │
 *       - Retorna true si la tarea ya está completada en la fecha indicada.                        │
 *                                                                                                  │
 * Autor: Ana Castro                                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toLocalYMD, formatDateForBackend } from "../utils/dateUtils";
import { notifyBackend, cancelTaskBackend } from "../services/notifyBackend";
import { buildReminderUrl } from "../utils/buildReminderUrl";

export const isTaskActiveOnDate = (task, dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const taskDate = new Date(task.dateTime);
    const taskDateStr = toLocalYMD(taskDate);

    if (task.repeat === "once") return taskDateStr === dateStr;
    if (task.repeat === "daily") return true;
    if (task.repeat === "weekdays") return day >= 1 && day <= 5;
    if (task.repeat === "custom") {
        const customIndex = day === 0 ? 6 : day - 1;
        return task.customDays?.includes(customIndex);
    }

    return false;
};

const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        return dateA - dateB;
    });
};

export const useStorageStore = create(
    persist(
        (set, get) => ({
            tasks: [],
            completedToday: [],

            addTask: (newTask) => {
                const tasks = [...get().tasks, newTask];
                set({ tasks: sortTasks(tasks) });

                const deviceId = localStorage.getItem("deviceId");
                if (!deviceId || !newTask.dateTime || !newTask.text) return;

                const isoDate = formatDateForBackend(newTask.dateTime);
                const url = buildReminderUrl("task", newTask.text);

                notifyBackend(
                    newTask.id,
                    newTask.text,
                    isoDate,        
                    deviceId,
                    "task",
                    Number(newTask.reminder) || 15,
                    url,
                    newTask.notifyDayBefore,
                    newTask.repeat,
                    newTask.customDays
                );                
            },

            updateTask: async (id, updatedFields) => {
                const updatedTasks = get().tasks.map((task) => (task.id === id ? { ...task, ...updatedFields } : task));
                set({ tasks: sortTasks(updatedTasks) });

                const updatedTask = updatedTasks.find((t) => t.id === id);
                const deviceId = localStorage.getItem("deviceId");
                if (!deviceId || !updatedTask?.dateTime || !updatedTask?.text) return;

                await cancelTaskBackend(id, deviceId);
                await cancelTaskBackend(`${id}-daybefore`, deviceId);

                const isoDate = formatDateForBackend(updatedTask.dateTime);
                const url = buildReminderUrl("task", updatedTask.text);

                notifyBackend(
                    updatedTask.id,
                    updatedTask.text,
                    isoDate,
                    deviceId,
                    "task",
                    Number(updatedTask.reminder) || 15,
                    url,
                    updatedTask.notifyDayBefore,
                    updatedTask.repeat,
                    updatedTask.customDays
                );
            },

            deleteTask: async (id) => {
                const tasks = get().tasks.filter((task) => task.id !== id);
                set({ tasks: sortTasks(tasks) });

                const deviceId = localStorage.getItem("deviceId");
                if (deviceId) {
                    await cancelTaskBackend(id, deviceId);
                    await cancelTaskBackend(`${id}-daybefore`, deviceId);
                }
            },

            clearAllTasks: () => set({ tasks: [], completedToday: [] }),

            getSortedTasks: () => sortTasks(get().tasks),

            toggleCompletedToday: (id, dateStr) => {
                if (!dateStr) {
                    dateStr = toLocalYMD(new Date());
                }

                set((state) => {
                    const task = state.tasks.find((t) => t.id === id);
                    if (!task) return {};

                    if (!isTaskActiveOnDate(task, dateStr)) {
                        return {};
                    }

                    const completedDates = task.completedDates ? [...task.completedDates] : [];
                    const alreadyCompleted = completedDates.includes(dateStr);
                    const newCompletedDates = alreadyCompleted
                        ? completedDates.filter((d) => d !== dateStr)
                        : [...completedDates, dateStr];

                    const updatedTasks = state.tasks.map((t) =>
                        t.id === id ? { ...t, completedDates: newCompletedDates } : t
                    );

                    return { tasks: updatedTasks };
                });
            },

            isTaskCompletedForDate: (id, dateStr) => {
                const task = get().tasks.find((t) => t.id === id);
                return task?.completedDates?.includes(dateStr) || false;
            },
        }),
        { name: "tasks-storage" }
    )
);
