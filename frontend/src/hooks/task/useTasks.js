/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useTasks: hook para manejar tareas filtradas y sincronización con backend.                      │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Obtiene las tareas del store `useStorageStore` y las filtra según `type` y `exclude`.       │
 *   • Mantiene un estado local `tasks` y un método `reload()` para recargar los filtros.          │
 *   • Calcula `todayTasks` filtrando las tareas activas para la fecha actual.                     │
 *   • Envuelve `updateTask` y `addTask` del store para:                                           │
 *       - Notificar cambios al backend usando `notifyBackend`.                                    │
 *       - Construir la URL del recordatorio con `buildReminderUrl`.                               │
 *       - Formatear fechas con `formatDateForBackend`.                                            │
 *       - Usar `deviceId` almacenado en localStorage.                                             │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   - tasks: lista de tareas filtradas según el tipo y exclusiones.                               │
 *   - todayTasks: lista de tareas activas para hoy.                                               │
 *   - deleteTask(id): elimina una tarea por ID usando el store.                                   │
 *   - updateTask(id, updatedFields): actualiza tarea y notifica backend si corresponde.           │
 *   - addTask(task): agrega una nueva tarea y notifica backend si corresponde.                    │
 *   - reload(): recarga las tareas aplicando los filtros actuales.                                │
 *                                                                                                 │
 * Parámetros:                                                                                     │
 *   - type (opcional): tipo de tarea para filtrar.                                                │
 *   - exclude (opcional, boolean): si se deben excluir las tareas del tipo especificado.          │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { useStorageStore } from "../../store/storageStore";
import { useState, useEffect } from "react";
import { notifyBackend } from "../../services/notifyBackend";
import { formatDateForBackend } from "../../utils/dateUtils";
import { isTaskActiveOnDate } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/dateUtils";
import { buildReminderUrl } from "../../utils/buildReminderUrl";
import { filterByType } from "../../utils/taskFilter";

export const useTasks = (type, exclude = false) => {
    const { tasks: rawTasks, deleteTask, updateTask: baseUpdateTask, addTask: baseAddTask } = useStorageStore();
    const [tasks, setTasks] = useState([]);
    const todayYMD = toLocalYMD(new Date());
    const todayTasks = tasks.filter((task) => isTaskActiveOnDate(task, todayYMD));

    useEffect(() => {
        const filtered = type ? filterByType(rawTasks, type, exclude) : rawTasks;
        setTasks(filtered);
    }, [rawTasks, type, exclude]);

    const reload = () => {
        const filtered = type ? filterByType(rawTasks, type, exclude) : rawTasks;
        setTasks(filtered);
    };


    const wrappedUpdateTask = async (id, updatedFields) => {
        baseUpdateTask(id, updatedFields);

        if (updatedFields.dateTime && updatedFields.text) {
            const isoDate = formatDateForBackend(updatedFields.dateTime);
            console.log(`Tasks updated: ${updatedFields.text} at ${isoDate}`);
            const url = buildReminderUrl("task", updatedFields.text);

            const deviceId = localStorage.getItem("deviceId");
            if (!deviceId) return;

            await notifyBackend(
                updatedFields.id || id,
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
            try {
                const isoDate = formatDateForBackend(task.dateTime);
                const deviceId = localStorage.getItem("deviceId");
                if (!deviceId) return;

                const url = buildReminderUrl("task", task.text);
                await notifyBackend(task.id, task.text, isoDate, deviceId, "task", Number(task.reminder) || 15, url);
            } catch (err) {
                console.error(err);
            }
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
