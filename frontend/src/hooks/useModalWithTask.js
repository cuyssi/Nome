import { useState } from "react";

export const useModalWithTask = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const openModalWithTask = (task) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedTask(null);
  };

  return {
    isOpen,
    selectedTask,
    openModalWithTask,
    closeModal,
  };
};
