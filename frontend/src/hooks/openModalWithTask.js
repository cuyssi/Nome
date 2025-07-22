/**────────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado para gestionar el flujo de edición de tareas en modales.     │
 * Centraliza la lógica visual para mostrar, confirmar y cerrar formularios.       │
 * Permite actualizar tareas desde cualquier vista usando una función externa.     │
 *                                                                                 │
 * Funciones clave:                                                                │
 * - handleEditTask: ejecuta una actualización, recarga y muestra confirmación.    │
 * - handleCloseModal: cierra el modal y fuerza render con nueva clave.            │
 *                                                                                 │
 * Estado:                                                                         │
 * - showConfirmation: muestra texto visual de éxito tras editar.                  │
 * - renderKey: fuerza re-render dinámico de la vista.                             │
 *                                                                                 │
 * Ideal para conectar `Form.jsx`, modales y vistas como `Dates` o `Task`.         │
 *                                                                                 │
 * @author: Ana Castro                                                             │
 └────────────────────────────────────────────────────────────────────────────────*/


import { useState } from "react";
import { useModalStore } from "../store/modalStore";

export const useModalFlow = (reload) => {
    const { isOpen, selectedTask, openModalWithTask, closeModal } = useModalStore();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [renderKey, setRenderKey] = useState(0);

    const handleEditTask = (updatedTask, updateFn) => {
        updateFn(updatedTask);
        if (reload) reload();
        setRenderKey((prev) => prev + 1);
        setShowConfirmation(true);

        setTimeout(() => {
            setShowConfirmation(false);
            closeModal();
        }, 1500);
    };

    const handleCloseModal = () => {
        setRenderKey((prev) => prev + 1);
        closeModal();
    };

    return {
        isOpen,
        selectedTask,
        openModalWithTask,
        handleEditTask,
        handleCloseModal,
        renderKey,
        showConfirmation,
    };
};
