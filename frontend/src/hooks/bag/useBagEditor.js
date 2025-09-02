import { useState } from "react";
import { useBagsStore } from "../../store/useBagsStore";

export const useBagEditor = () => {
  const { editBag, deleteBag } = useBagsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBag, setSelectedBag] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [renderKey, setRenderKey] = useState(Date.now());

  const openModalWithBag = (bag) => {
    setSelectedBag(bag);
    setIsOpen(true);
  };

  const handleEdit = (updatedBag) => {
    editBag(updatedBag);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setIsOpen(false);
      setRenderKey(Date.now());
    }, 1000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedBag(null);
  };

  return {
    isOpen,
    selectedBag,
    openModalWithBag,
    handleEdit,
    handleClose,
    renderKey,
    showConfirmation,
    deleteBag,
  };
};
