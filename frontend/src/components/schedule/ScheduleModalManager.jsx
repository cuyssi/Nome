import { Modal } from "../commons/Modal";
import { Form_Schedule } from "./Form_Schedule";
import { Check } from "lucide-react";

export const ScheduleModalManager = ({ isOpen, selectedSubject, showConfirmation, onEdit, onClose }) => {
    return (
        <Modal isOpen={isOpen}>
            {showConfirmation ? (
                <p className="flex text-green-500 justify-center font-semibold animate-fadeIn">
                    <Check className="mr-2" /> Cambios guardados con éxito
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
