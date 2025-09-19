/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente TaskModalManager: gestiona la visualización del modal de tareas.  │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Muestra un modal usando Modal.                                           │
 *   • Si showConfirmation es true, muestra un mensaje de éxito.                │
 *   • Si showConfirmation es false, renderiza Form_Task para edición/creación. │
 *                                                                              │
 * Props:                                                                       │
 *   - isOpen: boolean que controla si el modal está abierto.                   │
 *   - selectedTask: objeto con la tarea seleccionada.                          │
 *   - showConfirmation: boolean para mostrar mensaje de confirmación.          │
 *   - onEdit: función que maneja la edición o creación de la tarea.            │
 *   - onClose: función que cierra el modal.                                    │
 *                                                                              │                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/


import { Modal } from "../commons/Modal";
import { Form_Task } from "./Form_Task";
import { Check } from "lucide-react";

export const TaskModalManager = ({ isOpen, selectedTask, showConfirmation, onEdit, onClose }) => {
    return (
        <Modal isOpen={isOpen}>
            {showConfirmation ? (
                <p className="flex text-green-500 justify-center font-semibold animate-fadeIn">
                    <Check className="mr-2" /> Cambios guardados con éxito
                </p>
            ) : (
                <Form_Task task={selectedTask} onSubmit={onEdit} onClose={onClose} />
            )}
        </Modal>
    );
};
