/**─────────────────────────────────────────────────────────────────────────────┐
 * useCalendarTasks: hook para gestionar tareas en el calendario.               │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Filtra las tareas según la fecha seleccionada y su configuración de       │
 *     repetición ("once", "daily", "weekdays", "custom").                       │
 *   • Permite consultar las tareas de cualquier fecha concreta.                 │
 *   • Gestiona el estado de la fecha seleccionada y la apertura/cierre del      │
 *     modal de tareas.                                                          │
 *   • Permite eliminar tareas, marcarlas como completadas o verificar si        │
 *     lo están en una fecha determinada.                                        │
 *                                                                              │
 * Devuelve:                                                                    │
 *   - tasksByDate(date): función para obtener tareas de una fecha concreta.    │
 *   - selectedDateTasks: lista de tareas de la fecha actualmente seleccionada. │
 *   - isModalOpen: booleano que indica si el modal de tareas está abierto.     │
 *   - setIsModalOpen: función para modificar el estado del modal.              │
 *   - handleDateClick(info): selecciona una fecha y abre el modal.             │
 *   - handleDeleteTask(id): elimina una tarea por su id.                       │
 *   - selectedDate: fecha seleccionada (string en formato YYYY-MM-DD).         │
 *   - toggleCompletedForDate: alterna el estado completado de una tarea.       │
 *   - isTaskCompletedForDate: comprueba si una tarea está completada.          │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useMemo, useState } from "react";
import { useStorageStore } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/dateUtils";

export const useCalendarTasks = () => {
    const tasks = useStorageStore((state) => state.tasks);
    const deleteTask = useStorageStore((state) => state.deleteTask);
    const toggleCompletedForDate = useStorageStore((state) => state.toggleCompletedToday);
    const isTaskCompletedForDate = useStorageStore((state) => state.isTaskCompletedForDate);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getTasksForDate = (date) => {
        const dateStr = toLocalYMD(date);
        const day = date.getDay();

        return tasks.filter((task) => {
            const taskStartDate = new Date(task.dateTime);
            const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const startDateOnly = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth(), taskStartDate.getDate());

            if (dateOnly < startDateOnly) return false;
            if (task.repeat === "once") return toLocalYMD(taskStartDate) === dateStr;
            if (task.repeat === "daily") return true;
            if (task.repeat === "weekdays") return day >= 1 && day <= 5;
            if (task.repeat === "custom") {
                const customIndex = day === 0 ? 6 : day - 1;
                return task.customDays?.includes(customIndex);
            }

            return false;
        });
    };

    const selectedDateTasks = useMemo(() => {
        return selectedDate ? getTasksForDate(new Date(selectedDate)) : [];
    }, [selectedDate, tasks]);

    const handleDateClick = (info) => {
        setSelectedDate(toLocalYMD(info.date));
        setIsModalOpen(true);
    };

    const handleDeleteTask = (id) => deleteTask(id);

    return {
        tasksByDate: getTasksForDate,
        selectedDateTasks,
        isModalOpen,
        setIsModalOpen,
        handleDateClick,
        handleDeleteTask,
        selectedDate,
        toggleCompletedForDate,
        isTaskCompletedForDate,
    };
};
