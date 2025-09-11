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
                    onSubmit={(newBag) => onEdit(newBag)}
                />
            ) : mode === "edit" ? (
                <EditBag
                    bag={selected}
                    onUpdateBag={(updatedBag) => onEdit(updatedBag, { closeAfterSave: true })}
                    onClose={onClose}
                />
            ) : mode === "items" ? (
                <BagItems
                    bag={selected}
                    isOpen={true}
                    onClose={onClose}
                    onUpdateBag={(updatedBag) => onEdit(updatedBag)}
                />
            ) : mode === "school" ? (
                <TomorrowSubjects
                    bag={selected}
                    isOpen={true}
                    onClose={onClose}
                    onUpdateBag={(updatedBag) => onEdit(updatedBag, { skipConfirmation: true })}
                />
            ) : null}
        </Modal>
    );
};
