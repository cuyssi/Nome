/**─────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useTaskEditor: hook para gestionar la edición y creación de tareas mediante un modal.            │
 *                                                                                                  │
 * Funcionalidad:                                                                                   │
 *   • Mantiene el estado de apertura del modal (`isOpen`) y la tarea seleccionada (`selectedTask`).│
 *   • Permite abrir y cerrar el modal de edición/creación de tareas.                               │
 *   • Gestiona la edición de tareas existentes o la creación de nuevas tareas.                     │
 *   • Convierte la fecha de la tarea (`dateTime`) a formato ISO si es un objeto Date.              │
 *   • Llama a `updateTask` o `addTask` del hook `useTasks` según corresponda.                      │
 *   • Refresca la lista de tareas y controla la confirmación visual (`showConfirmation`).          │
 *   • `renderKey` permite forzar re-render cuando se necesita.                                     │
 *                                                                                                  │
 * Devuelve:                                                                                        │
 *   - renderKey: número que cambia con cada edición para forzar re-render.                         │
 *   - showConfirmation: boolean para mostrar confirmación visual.                                  │
 *   - isOpen: boolean que indica si el modal está abierto.                                         │
 *   - selectedTask: tarea actualmente seleccionada para editar.                                    │
 *   - openModalWithTask(task): función para abrir el modal con una tarea específica (opcional).    │
 *   - handleEdit(updatedTask): función para guardar cambios o crear nueva tarea.                   │
 *   - handleClose: función para cerrar el modal.                                                   │
 *                                                                                                  │
 * Autor: Ana Castro                                                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";
import { useTasks } from "./useTasks";
import { formatDateForBackend } from "../../utils/dateUtils";
import { ensureDeviceId } from "../../utils/ensureDeviceId";

export function useTaskEditor() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [renderKey, setRenderKey] = useState(0);
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
    };

    const handleEdit = (updatedTask) => {
        if (!updatedTask || !deviceId) return;

        const formattedDateTime =
            updatedTask.dateTime instanceof Date ? formatDateForBackend(updatedTask.dateTime) : updatedTask.dateTime;

        const mergedTask = {
            ...selectedTask,
            ...updatedTask,
            dateTime: formattedDateTime ?? selectedTask?.dateTime,
            deviceId,
            notifyDayBefore: updatedTask.notifyDayBefore ?? selectedTask?.notifyDayBefore ?? false,
        };

        const { id, ...updatedFields } = mergedTask;
        if (id) {
            updateTask(id, updatedFields);
        } else {
            addTask(updatedFields);
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
        handleClose: closeModal,
    };
}
