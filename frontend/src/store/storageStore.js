import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toLocalYMD } from "../utils/toLocalYMD";
import { notifyBackend, cancelTaskBackend } from "../services/notifyBackend";
import { buildReminderUrl } from "../utils/buildReminderUrl";
import { formatDateForBackend } from "../utils/formatDateForBackend";

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
                    url
                );
            },

            updateTask: async (id, updatedFields) => {
                const updatedTasks = get().tasks.map((task) =>
                    task.id === id ? { ...task, ...updatedFields } : task
                );
                set({ tasks: sortTasks(updatedTasks) });

                const updatedTask = updatedTasks.find((t) => t.id === id);
                const deviceId = localStorage.getItem("deviceId");
                if (!deviceId || !updatedTask?.dateTime || !updatedTask?.text) return;

                await cancelTaskBackend(id, deviceId);

                const isoDate = formatDateForBackend(updatedTask.dateTime);
                const url = buildReminderUrl("task", updatedTask.text);

                notifyBackend(
                    updatedTask.id,
                    updatedTask.text,
                    isoDate,
                    deviceId,
                    "task",
                    Number(updatedTask.reminder) || 15,
                    url
                );
            },

            deleteTask: async (id) => {
                const tasks = get().tasks.filter((task) => task.id !== id);
                set({ tasks: sortTasks(tasks) });

                const deviceId = localStorage.getItem("deviceId");
                if (deviceId) {
                    await cancelTaskBackend(id, deviceId);
                }
            },

            clearAllTasks: () => set({ tasks: [], completedToday: [] }),

            getSortedTasks: () => sortTasks(get().tasks),

            toggleCompletedToday: (id, dateStr) => {
                if (!dateStr) {
                    console.warn("⚠️ toggleCompletedToday llamado sin fecha, usando hoy por defecto");
                    dateStr = toLocalYMD(new Date());
                }

                set((state) => {
                    const task = state.tasks.find((t) => t.id === id);
                    if (!task) return {};

                    if (!isTaskActiveOnDate(task, dateStr)) {
                        console.warn("⛔ La tarea no está activa en esta fecha:", dateStr);
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

                    console.log("✅ updated completedDates:", newCompletedDates);
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
