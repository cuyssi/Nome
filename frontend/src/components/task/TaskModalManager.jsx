import { Modal } from "../commons/Modal";
import { Form_Task } from "./Form_Task";

export const TaskModalManager = ({ isOpen, selectedTask, showConfirmation, onEdit, onClose }) => {
    return (
        <Modal isOpen={isOpen}>
            {showConfirmation ? (
                <p className="text-green-500 text-center font-semibold animate-fadeIn">
                    ✅ Cambios guardados con éxito
                </p>
            ) : (
                <Form_Task task={selectedTask} onSubmit={onEdit} onClose={onClose} />
            )}
        </Modal>
    );
};
