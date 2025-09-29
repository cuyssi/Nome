/**─────────────────────────────────────────────────────────────────────────────
 * useStorageStore: store de Zustand para manejar tareas, completadas y persistencia.
 *
 * Funcionalidad:
 *   • tasks: array con todas las tareas.
 *   • completedToday: lista de IDs de tareas completadas en la fecha actual.
 *   • lastSavedTask: almacena la última tarea agregada o actualizada.
 *
 * Métodos principales:
 *   • addTask(newTask)
 *       - Añade nueva tarea, la ordena y la guarda como lastSavedTask.
 *       - Envía notificación al backend si la tarea tiene deviceId, dateTime y text.
 *       - Programa recordatorio del día anterior si notifyDayBefore está activo.
 *
 *   • updateTask(id, updatedFields)
 *       - Actualiza una tarea existente y la marca como lastSavedTask.
 *       - Cancela tareas anteriores en backend y programa la nueva.
 *
 *   • deleteTask(id)
 *       - Elimina tarea y cancela recordatorios en backend si existe deviceId.
 *
 *   • clearAllTasks()
 *       - Borra todas las tareas y completadas de hoy.
 *
 *   • getSortedTasks()
 *       - Devuelve todas las tareas ordenadas por fecha y hora.
 *
 *   • toggleCompletedToday(id, dateStr)
 *       - Marca o desmarca tarea como completada en una fecha específica.
 *       - Solo si la tarea está activa para esa fecha según repeat/customDays.
 *
 *   • isTaskCompletedForDate(id, dateStr)
 *       - Retorna true si la tarea ya está completada en la fecha indicada.
 *
 *   • setLastSavedTask(task) / clearLastSavedTask()
 *       - Guarda o limpia la referencia de la última tarea guardada.
 *
 * Utilidades internas:
 *   • isTaskActiveOnDate(task, dateStr): comprueba si la tarea aplica en una fecha.
 *   • sortTasks(tasks): ordena tareas por dateTime.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { create } from "zustand";
import { persist } from "zustand/middleware";

const sortTasks = (tasks) => [...tasks].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

export const useStorageStore = create(
    persist(
        (set, get) => ({
            tasks: [],
            completedToday: [],
            lastSavedTask: null,
            setLastSavedTask: (task) => set({ lastSavedTask: task }),
            clearLastSavedTask: () => set({ lastSavedTask: null }),

            addTask: (newTask) => {
                set({
                    tasks: sortTasks([...get().tasks, newTask]),
                    lastSavedTask: newTask,
                });
            },

            updateTask: (id, updatedFields) => {
                const updatedTasks = get().tasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
                const updatedTask = updatedTasks.find((t) => t.id === id);
                set({ tasks: sortTasks(updatedTasks), lastSavedTask: updatedTask });
            },

            deleteTask: (id) => {
                set({ tasks: get().tasks.filter((t) => t.id !== id) });
            },

            clearAllTasks: () => set({ tasks: [], completedToday: [] }),

            toggleCompletedToday: (id, dateStr) => {
                set((state) => {
                    const task = state.tasks.find((t) => t.id === id);
                    if (!task) return {};
                    const completedDates = task.completedDates ? [...task.completedDates] : [];
                    const newCompletedDates = completedDates.includes(dateStr)
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

export const isTaskActiveOnDate = (task, dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  const taskDateStr = new Date(task.dateTime).toISOString().slice(0,10);

  if (task.repeat === "once") return taskDateStr === dateStr;
  if (task.repeat === "daily") return true;
  if (task.repeat === "weekdays") return day >= 1 && day <= 5;
  if (task.repeat === "weekend") return day === 0 || day === 6;
  if (task.repeat === "custom") {
    const customIndex = day === 0 ? 6 : day - 1;
    return task.customDays?.includes(customIndex);
  }

  return false;
};
