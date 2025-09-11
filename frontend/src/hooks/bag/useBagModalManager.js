import { useState } from "react";
import { useBagsStore } from "../../store/useBagsStore";

export const useBagModalManager = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBag, setSelectedBag] = useState(null);
    const [mode, setMode] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { editBag } = useBagsStore();

    const openModalWithBag = (bag, modalMode = "edit") => {
        console.log("🧨 Abriendo modal con:", bag, "modo:", modalMode);
        setSelectedBag(bag);
        setMode(modalMode);
        setIsOpen(true);
    };

    const handleEdit = (updatedBag) => {
        setSelectedBag(updatedBag);
        editBag(updatedBag);
        setShowConfirmation(true);

        setTimeout(() => {
            setShowConfirmation(false);
            setIsOpen(false);
            setSelectedBag(null);
            setMode(null);
        }, 1500);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedBag(null);
        setMode(null);
        setShowConfirmation(false);
    };

    const openBagFromURL = (bagName, bagsList) => {
        const normalizedName = bagName.toLowerCase();
        const bag = bagsList.find((b) => b.name.toLowerCase() === normalizedName);
        if (!bag) return;
        openModalWithBag(bag, bag.name === "Escolar" ? "school" : "items");
    };

    return {
        isOpen,
        selectedBag,
        mode,
        showConfirmation,
        setSelectedBag,
        openModalWithBag,
        handleEdit,
        handleClose,
        setShowConfirmation,
        openBagFromURL,
    };
};
