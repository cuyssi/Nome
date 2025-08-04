import { Modal } from "../commons/Modal";
import { Form } from "../commons/Form";

export const TaskModalManager = ({ isOpen, selectedTask, showConfirmation, onEdit, onClose }) => {
  if (!isOpen) return null;

  return (
  <Modal>
    {showConfirmation ? (
      <p className="text-green-500 text-center font-semibold animate-fadeIn">
        ✅ Cambios guardados con éxito
      </p>
    ) : (
      <Form task={selectedTask} onSubmit={onEdit} onClose={onClose} />
    )}
  </Modal>
);

};
