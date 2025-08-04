import { useState } from "react";
import { useModalStore } from "../store/modalStore";

export function useTaskEditor(reload, updateTask) {
  const [renderKey, setRenderKey] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { isOpen, selectedTask, openModalWithTask, closeModal } = useModalStore();

  const handleClose = () => {
    setRenderKey((prev) => prev + 1);
    closeModal();
  };

  const handleEdit = (updatedTask) => {
    updateTask(updatedTask);
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
