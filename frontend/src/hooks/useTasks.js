/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado que gestiona el acceso y manipulación de las tareas.      │
 * Utiliza Zustand para obtener, editar y eliminar tareas con persistencia.     │
 * Filtra por tipo y permite recarga visual tras cada acción.                   │
 * Ideal para centralizar la lógica de tareas en componentes reutilizables.     │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/
import { useStorageStore } from "../store/storageStore";
import { filterTasks } from "../utils/taskFilter";
import { useState, useEffect } from "react";
import { isToday } from "../utils/dateUtils";

export const useTasks = (type, exclude = false) => {
    const { tasks: rawTasks, deleteTask, updateTask } = useStorageStore();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const filtered = type ? filterTasks(rawTasks, type, exclude) : rawTasks;
        setTasks(filtered);
    }, [rawTasks, type, exclude]);

    const reload = () => {
        const filtered = type ? filterTasks(rawTasks, type, exclude) : rawTasks;
        setTasks(filtered);
    };    

    const todayTasks = tasks.filter((task) => isToday(task.dateTime));

    return {
        tasks,
        deleteTask,
        editTask: updateTask,
        reload,
        todayTasks,
    };
};
