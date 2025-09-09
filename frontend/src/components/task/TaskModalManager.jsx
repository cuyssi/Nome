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
