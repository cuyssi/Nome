import { Modal } from "../commons/Modal";
import { CreateBag } from "./CreateBag";
import { EditBag } from "./EditBag";
import { BagItems } from "./BagItems";
import { TomorrowSubjects } from "./TomorrowSubjects";
import { Check } from "lucide-react";

export const BagModalManager = ({ isOpen, selected, showConfirmation, onEdit, onClose, mode }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen}>
            {mode !== "school" && showConfirmation ? (
                <p className="flex text-green-500 justify-center font-semibold animate-fadeIn">
                    <Check className="mr-2" /> Cambios guardados con éxito
                </p>
            ) : mode === "create" ? (
                <CreateBag
                    onClose={onClose}
                    onSubmit={(newBag) => {
                        onEdit(newBag);
                    }}
                />
            ) : mode === "edit" ? (
                <EditBag bag={selected} onUpdateBag={onEdit} onClose={onClose} />
            ) : mode === "items" ? (
                <BagItems bag={selected} onClose={onClose} onUpdateBag={onEdit} />
            ) : mode === "school" ? (
                <TomorrowSubjects
                    bag={selected}
                    onClose={onClose}
                    onUpdateBag={(updatedBag) => {
                        onEdit(updatedBag, { skipConfirmation: true });
                    }}
                />
            ) : null}
        </Modal>
    );
};
