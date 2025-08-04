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
      ) : selectedTask && selectedTask.id ? (
        <Form task={selectedTask} onSubmit={onEdit} onClose={onClose} />
      ) : (
        <p className="text-yellow-300 text-center">Cargando tarea seleccionada…</p>
      )}
    </Modal>
  );
};
