/**─────────────────────────────────────────────────────────────────────────────┐
 * useBagModalManager: hook para gestionar modales de mochilas.                 │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Controla la apertura/cierre de modales para mochilas.                    │
 *   • Mantiene el estado de la mochila seleccionada y el modo del modal.       │
 *   • Muestra confirmaciones temporales tras editar una mochila.               │
 *   • Permite abrir un modal directamente desde el nombre de la mochila.       │
 *                                                                              │
 * Estado devuelto:                                                             │
 *   - isOpen: indica si el modal está abierto.                                 │
 *   - selectedBag: mochila actualmente seleccionada.                           │
 *   - mode: modo del modal ('edit', 'school', 'items', etc.).                  │
 *   - showConfirmation: muestra confirmación temporal al editar.               │
 *                                                                              │
 * Funciones devueltas:                                                         │
 *   - openModalWithBag(bag, modalMode): abre el modal con la mochila indicada. │
 *   - handleEdit(updatedBag): actualiza la mochila y muestra confirmación.     │
 *   - handleClose(): cierra el modal y resetea estados.                        │
 *   - openBagFromURL(bagName, bagsList): abre modal buscando mochila por nombre│
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { useBagsStore } from "../../store/useBagsStore";

export const useBagModalManager = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBag, setSelectedBag] = useState(null);
    const [mode, setMode] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { editBag } = useBagsStore();

    const openModalWithBag = (bag, modalMode = "edit") => {
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
