/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente TaskModalManager: gestiona la visualización del modal de tareas.  │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Controla la apertura/cierre de un modal usando Modal.                   │
 *   • Si showConfirmation es true, muestra TaskSavedModal con mensaje de      │
 *     tarea guardada y ubicación dentro de la app.                             │
 *   • Si showConfirmation es false, renderiza Form_Task para crear o editar   │
 *     una tarea.                                                               │
 *   • Gestiona la limpieza de la última tarea guardada al cerrar el modal.    │
 *                                                                              │
 * Props:                                                                       │
 *   - isOpen: boolean que indica si el modal está abierto.                     │
 *   - selectedTask: objeto de la tarea seleccionada (para editar).            │
 *   - showConfirmation: boolean que controla si se muestra confirmación.      │
 *   - onEdit: función que recibe la tarea final tras crear o editar.          │
 *   - onClose: función que cierra el modal.                                    │
 *                                                                              │
 * Hooks internos:                                                              │
 *   - useStorageStore: obtiene la última tarea guardada y permite limpiarla.   │
 *   - Form_Task: formulario para creación/edición de tareas.                  │
 *   - TaskSavedModal: modal de confirmación tras guardar la tarea.             │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { useStorageStore } from "../../store/storageStore";
import { Modal } from "../commons/modals/Modal";
import { Form_Task } from "./Form_Task";
import { TaskSavedModal } from "../commons/modals/TaskSavedModal";

export const TaskModalManager = ({
    isOpen,
    selectedTask,
    showConfirmation,
    onEdit,
    onClose,
    isProcessing, // ✨ nuevo prop
}) => {
    const lastSavedTask = useStorageStore((state) => state.lastSavedTask);
    const clearLastSavedTask = useStorageStore((state) => state.clearLastSavedTask);
    const taskToShow = showConfirmation ? lastSavedTask : selectedTask;

    return (
        <>
            {showConfirmation && taskToShow ? (
                <TaskSavedModal
                    task={taskToShow}
                    onClose={() => {
                        onClose();
                        clearLastSavedTask();
                    }}
                />
            ) : isOpen ? (
                <Modal isOpen={true}>
                    {isProcessing ? (
                        <div className="flex flex-col items-center justify-center p-10">
                            <p className="text-yellow-400 animate-pulse text-lg font-semibold">
                                Procesando audio, espera por favor...
                            </p>
                        </div>
                    ) : (
                        <Form_Task task={selectedTask} onSubmit={(finalTask) => onEdit(finalTask)} onClose={onClose} />
                    )}
                </Modal>
            ) : null}
        </>
    );
};
