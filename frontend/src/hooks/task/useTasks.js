import { useStorageStore } from "../../store/storageStore";
import { filterTasksSmart } from "../../utils/taskFilter";
import { useState, useEffect } from "react";
import { notifyBackend } from "../../services/notifyBackend";
import { formatDateForBackend } from "../../utils/formatDateForBackend";
import { isTaskActiveOnDate } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/toLocalYMD";
import { buildReminderUrl } from "../../utils/buildReminderUrl"

export const useTasks = (type, exclude = false) => {
    const { tasks: rawTasks, deleteTask, updateTask: baseUpdateTask, addTask: baseAddTask } = useStorageStore();

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const filtered = type ? filterTasksSmart(rawTasks, type, exclude) : rawTasks;
        setTasks(filtered);
    }, [rawTasks, type, exclude]);

    const reload = () => {
        const filtered = type ? filterTasksSmart(rawTasks, type, exclude) : rawTasks;
        setTasks(filtered);
    };

    const todayYMD = toLocalYMD(new Date());
    const todayTasks = tasks.filter((task) => isTaskActiveOnDate(task, todayYMD));

    const wrappedUpdateTask = async (id, updatedFields) => {
        baseUpdateTask(id, updatedFields);

        if (updatedFields.dateTime && updatedFields.text) {
            const isoDate = formatDateForBackend(updatedFields.dateTime);
            console.log(`Task updated: ${updatedFields.text} at ${isoDate}`);
            const url = buildReminderUrl("task", updatedFields.text);

            const deviceId = localStorage.getItem("deviceId");
            if (!deviceId) return;

            await notifyBackend(
                updatedFields.text,
                isoDate,
                deviceId,
                "task",
                Number(updatedFields.reminder) || 15,
                url
            );
        }
    };

    const wrappedAddTask = async (task) => {
        baseAddTask(task);
        if (task.dateTime && task.text) {
            const isoDate = formatDateForBackend(task.dateTime);
            const deviceId = localStorage.getItem("deviceId");
            if (!deviceId) {
                console.warn("⚠️ No hay deviceId en localStorage");
                return;
            }
            const url = buildReminderUrl("task", task.title);
            await notifyBackend(task.text, isoDate, deviceId, "taks", Number(task.reminder) || 15, url);
        }
    };

    return {
        tasks,
        todayTasks,
        deleteTask,
        updateTask: wrappedUpdateTask,
        addTask: wrappedAddTask,
        reload,
    };
};
