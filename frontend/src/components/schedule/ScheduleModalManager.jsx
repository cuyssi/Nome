import { Modal } from "../commons/Modal";
import { Form_Schedule } from "./Form_Schedule";

export const ScheduleModalManager = ({ isOpen, selectedSubject, showConfirmation, onEdit, onClose }) => {
    return (
        <Modal isOpen={isOpen}>
            {showConfirmation ? (
                <p className="text-green-500 text-center font-semibold animate-fadeIn">
                    ✅ Cambios guardados con éxito
                </p>
            ) : (
                <Form_Schedule
                    subject={selectedSubject}
                    day={selectedSubject?.day}
                    hour={selectedSubject?.hour}
                    onSubmit={onEdit}
                    onClose={onClose}
                />
            )}
        </Modal>
    );
};
