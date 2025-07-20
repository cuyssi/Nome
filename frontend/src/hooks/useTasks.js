import { getTranscriptionOfStorage, sortedTasks, deleteTranscriptionById } from "../utils/transcriptionStorage";
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
        loadTasks();
    };

    const editTask = (id) => {
        loadTasks();
    };

    useEffect(() => {
        loadTasks();
    }, [type, exclude]);

    return {
        tasks,
        deleteTask,
        reload: loadTasks,
        editTask,
    };
};
