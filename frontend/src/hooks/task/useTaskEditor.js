/**─────────────────────────────────────────────────────────────────────────────
 * useTaskEditor: hook para gestionar la edición y creación de tareas con modal.
 *
 * Funcionalidad:
 *   • Controla la apertura/cierre del modal de tarea.
 *   • Mantiene el estado de la tarea seleccionada y si se muestra confirmación.
 *   • Gestiona la creación o edición de tareas usando `useTasks`.
 *   • Asigna `deviceId` a las tareas automáticamente.
 *   • Permite mostrar una confirmación tras guardar una tarea.
 *
 * Devuelve:
 *   • isOpen: boolean, indica si el modal está abierto.
 *   • selectedTask: tarea actualmente seleccionada (puede ser null).
 *   • showConfirmation: boolean, indica si se debe mostrar confirmación.
 *   • openModalWithTask(task): abre el modal con la tarea dada (o vacío para nueva tarea).
 *   • handleEdit(finalTask): guarda la tarea (crea o actualiza) y muestra confirmación.
 *   • handleClose: cierra el modal y resetea estados.
 *   • showTaskConfirmation(task): muestra la confirmación para la tarea dada.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { useTasks } from "./useTasks";
import { ensureDeviceId } from "../../utils/ensureDeviceId";

export function useTaskEditor() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deviceId, setDeviceId] = useState(null);

    const { updateTask, addTask, reload } = useTasks();

    useEffect(() => {
        const id = ensureDeviceId();
        setDeviceId(id);
    }, []);

    const openModalWithTask = (task = null) => {
        setSelectedTask(task);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedTask(null);
        setShowConfirmation(false);
    };

    const handleEdit = (finalTask) => {
        console.log("Guardando tarea:", finalTask);
        if (!finalTask || !deviceId) return;

        if (selectedTask?.id) {
            updateTask(selectedTask.id, { ...finalTask, deviceId });
        } else {
            addTask({ ...finalTask, id: crypto.randomUUID(), deviceId });
        }

        reload();
        setShowConfirmation(true);
    };

    const showTaskConfirmation = (task) => {
        setSelectedTask(task);
        setShowConfirmation(true);
    };

    return {
        isOpen,
        selectedTask,
        showConfirmation,
        openModalWithTask,
        handleEdit,
        handleClose: closeModal,
        showTaskConfirmation,
    };
}
