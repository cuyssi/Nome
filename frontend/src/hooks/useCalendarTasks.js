import { useState } from "react";
import { useStorageStore } from "../store/storageStore";

export const useCalendarTasks = () => {
  const tasks = useStorageStore((state) => state.tasks);
  const deleteTask = useStorageStore((state) => state.deleteTask);

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.dateTime);
    const localDate = date.toLocaleDateString("sv-SE");
    if (!acc[localDate]) acc[localDate] = [];
    acc[localDate].push(task);
    return acc;
  }, {});

  const selectedDateTasks = selectedDate ? tasksByDate[selectedDate] || [] : [];

  const handleDateClick = (info) => {
    const localDate = info.date.toLocaleDateString("sv-SE");
    setSelectedDate(localDate);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
    if (selectedDate) {      
      const updated = (tasksByDate[selectedDate] || []).filter((t) => t.id !== id);
      tasksByDate[selectedDate] = updated;
    }
  };

  const toLocalYMD = (date) => date.toLocaleDateString("sv-SE");

  return {
    tasksByDate,
    selectedDateTasks,
    isModalOpen,
    setIsModalOpen,
    handleDateClick,
    handleDeleteTask,
    toLocalYMD,
  };
};
