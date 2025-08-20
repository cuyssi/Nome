import { useStorageStore } from "../store/storageStore";
import { filterTasksSmart } from "../utils/taskFilter";
import { useState, useEffect } from "react";
import { isToday } from "../utils/dateUtils";
import { notifyBackend } from "../services/notifyBackend";
import { formatDateForBackend } from "../utils/formatDateForBackend";

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

    const todayTasks = tasks.filter((task) => isToday(task.dateTime));

    const wrappedUpdateTask = async (id, updatedFields) => {
        baseUpdateTask(id, updatedFields);
        if (updatedFields.dateTime && updatedFields.text) {
            const isoDate = formatDateForBackend(updatedFields.dateTime);
            console.log(`Task updated: ${updatedFields.text} at ${isoDate}`);
            const deviceId = localStorage.getItem("deviceId");
            if (!deviceId) {
                console.warn("⚠️ No hay deviceId en localStorage");
                return;
            }
            await notifyBackend(updatedFields.text, isoDate, deviceId);
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
            await notifyBackend(task.text, isoDate, deviceId);
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
