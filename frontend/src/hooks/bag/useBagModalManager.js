import { useState } from "react";
import { useBagsStore } from "../../store/useBagsStore";



export const useBagModalManager = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBag, setSelectedBag] = useState(null);
    const [mode, setMode] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isTomorrowOpen, setTomorrowOpen] = useState(false);
    const [isItemsOpen, setItemsOpen] = useState(false);
    const { editBag } = useBagsStore();
    const openModalWithBag = (bag, modalMode = "edit") => {
        console.log("🧨 Abriendo modal con:", bag, "modo:", modalMode);
        setSelectedBag(bag);
        setMode(modalMode);
        setIsOpen(true);
    };

const handleEdit = (updatedBag) => {
    setSelectedBag(updatedBag);         // ✅ actualiza la mochila visible
    editBag(updatedBag);                // ✅ actualiza el store
    setShowConfirmation(true);          // ✅ muestra el mensaje

    setTimeout(() => {
        setShowConfirmation(false);     // ✅ oculta el mensaje
        setIsOpen(false);               // ✅ cierra el modal
        setSelectedBag(null);           // ✅ limpia el estado
        setMode(null);                  // ✅ resetea el modo
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

        setSelectedBag(bag);

        if (bag.name === "Escolar") {
            setTomorrowOpen(true);
        } else {
            setItemsOpen(true);
        }
    };

    return {
        isOpen,
        selectedBag,
        mode,
        showConfirmation,
        isTomorrowOpen,
        isItemsOpen,
        setTomorrowOpen,
        setItemsOpen,
        openModalWithBag,
        handleEdit,
        handleClose,
        setShowConfirmation,
        openBagFromURL,
    };
};
