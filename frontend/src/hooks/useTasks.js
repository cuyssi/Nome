import { useStorageStore } from "../store/storageStore";
import { filterTasksSmart } from "../utils/taskFilter";
import { useState, useEffect } from "react";
import { isToday } from "../utils/dateUtils";

export const useTasks = (type, exclude = false) => {
    const {
        tasks: rawTasks,
        deleteTask,
        updateTask,
        addTask, // ⬅️ Añadido aquí
    } = useStorageStore();

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

    return {
        tasks,
        todayTasks,
        deleteTask,
        updateTask,
        addTask,      // ⬅️ Expuesto aquí también
        reload,
    };
};
