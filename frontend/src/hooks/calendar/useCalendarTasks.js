import { useMemo, useState } from "react";
import { useStorageStore } from "../../store/storageStore";
import { toLocalYMD } from "../../utils/toLocalYMD";

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
            const taskDate = new Date(task.dateTime);

            if (task.repeat === "once") return toLocalYMD(taskDate) === dateStr;
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
