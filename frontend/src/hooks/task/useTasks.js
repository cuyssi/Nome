import { useStorageStore } from "../../store/storageStore";
import { formatDateForBackend } from "../../utils/dateUtils";
import { notifyBackend, cancelTaskBackend } from "../../services/notifyBackend";
import { buildReminderUrl } from "../../utils/buildReminderUrl";
import { useEffect, useState } from "react";
import { toLocalYMD } from "../../utils/dateUtils";
import { isTaskActiveOnDate } from "../../store/storageStore";

export const useTasks = (type, exclude = false) => {
    const {
        tasks: rawTasks,
        addTask: storeAddTask,
        updateTask: storeUpdateTask,
        deleteTask: storeDeleteTask,        
    } = useStorageStore();
    
    const [tasks, setTasks] = useState([]);
    const todayYMD = toLocalYMD(new Date());

    useEffect(() => {
        const filtered = type ? rawTasks.filter((t) => t.type === type) : rawTasks;
        setTasks(filtered);
    }, [rawTasks, type, exclude]);

    const reload = () => {
        const filtered = type ? rawTasks.filter((t) => t.type === type) : rawTasks;
        setTasks(filtered);
    };

    const todayTasks = tasks.filter((task) => isTaskActiveOnDate(task, todayYMD));

    const addTask = (task) => {
        storeAddTask(task);
        const deviceId = localStorage.getItem("deviceId");
        if (deviceId && task.dateTime && task.text) {
            notifyBackend(
                task.id,
                task.text,
                formatDateForBackend(task.dateTime),
                deviceId,
                "task",
                Number(task.reminder) || 15,
                buildReminderUrl("task", task.text),
                task.notifyDayBefore,
                task.repeat,
                task.customDays
            );
        }
    };

    const updateTask = async (id, updatedFields) => {
        const oldTask = rawTasks.find((t) => t.id === id);
        storeUpdateTask(id, updatedFields);
        const updatedTask = { ...oldTask, ...updatedFields };
        const deviceId = localStorage.getItem("deviceId");
        if (deviceId && updatedTask.dateTime && updatedTask.text) {
            await cancelTaskBackend(id, deviceId);
            await cancelTaskBackend(`${id}-daybefore`, deviceId);
            notifyBackend(
                updatedTask.id,
                updatedTask.text,
                formatDateForBackend(updatedTask.dateTime),
                deviceId,
                "task",
                Number(updatedTask.reminder) || 15,
                buildReminderUrl("task", updatedTask.text),
                updatedTask.notifyDayBefore,
                updatedTask.repeat,
                updatedTask.customDays
            );
        }
    };

    const deleteTask = async (id) => {
        storeDeleteTask(id);
        const deviceId = localStorage.getItem("deviceId");
        if (deviceId) {
            await cancelTaskBackend(id, deviceId);
            await cancelTaskBackend(`${id}-daybefore`, deviceId);
        }
    };

    return { tasks, todayTasks, addTask, updateTask, deleteTask, reload };
};
