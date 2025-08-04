import { useState } from "react";
import { useModalStore } from "../store/modalStore";
import { useTasks } from "./useTasks";

export function useTaskEditor() {
    const [renderKey, setRenderKey] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { isOpen, selectedTask, openModalWithTask, closeModal } = useModalStore();
    const { updateTask, addTask, reload } = useTasks();

    const handleClose = () => {
        setRenderKey((prev) => prev + 1);
        closeModal();
    };

    const handleEdit = (updatedTask) => {
    if (!updatedTask) return;

    if (updatedTask.id && selectedTask?.id) {
        // Es una edición
        const { id, ...updatedFields } = updatedTask;
        updateTask(id, updatedFields);
    } else {
        // Es una tarea nueva
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
        handleClose,
    };
}
