import { useState } from "react";
import { useBagsStore } from "../../store/useBagsStore";

export const useBagModalManager = () => {
    const { editBag, deleteBag } = useBagsStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBag, setSelectedBag] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [renderKey, setRenderKey] = useState(Date.now());
    const [mode, setMode] = useState(null);

    const openModalWithBag = (bag, modalMode) => {
        setSelectedBag(bag);
        setMode(modalMode);
        setIsOpen(true);
    };

    const handleEdit = (updatedBag) => {
        editBag(updatedBag);
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
            setIsOpen(false);
            setRenderKey(Date.now());
        }, 1500);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedBag(null);
        setMode(null);
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
        mode,
    };
};
