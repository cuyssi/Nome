import { useState } from "react";
import { useTasks } from "./useTasks";
import { formatDateForBackend } from "../../utils/formatDateForBackend"

export function useTaskEditor() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [renderKey, setRenderKey] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { updateTask, addTask, reload } = useTasks();

    const openModalWithTask = (task = null) => {
        setSelectedTask(task);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedTask(null);
    };

    const handleEdit = (updatedTask) => {
        if (!updatedTask) return;

        // Asegurarte de que dateTime esté en formato ISO si es una instancia de Date
        const formattedDateTime =
            updatedTask.dateTime instanceof Date ? formatDateForBackend(updatedTask.dateTime) : updatedTask.dateTime;

        const mergedTask = {
            ...selectedTask,
            ...updatedTask,
            dateTime: formattedDateTime ?? selectedTask.dateTime, // ✅ preserva si no se edita
        };

        const { id, ...updatedFields } = mergedTask;
        if (id) {
            updateTask(id, updatedFields);
        } else {
            addTask(updatedFields);
        }

        reload();
        setRenderKey((prev) => prev + 1);
        setShowConfirmation(true);

        setTimeout(() => {
            setShowConfirmation(false);
            closeModal();
        }, 1500);
    };

    return {
        renderKey,
        showConfirmation,
        isOpen,
        selectedTask,
        openModalWithTask,
        handleEdit,
        handleClose: closeModal,
    };
}
