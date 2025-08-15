import { useState } from "react";
import { useTasks } from "./useTasks";

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

        if (updatedTask.id && selectedTask?.id) {
            // ⚡ Conservar todos los campos existentes y sobrescribir con cambios
            const mergedTask = { ...selectedTask, ...updatedTask };
            const { id, ...updatedFields } = mergedTask;
            updateTask(id, updatedFields);
        } else {
            addTask(updatedTask);
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