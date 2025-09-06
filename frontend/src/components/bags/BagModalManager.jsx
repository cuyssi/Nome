import { Modal } from "../commons/Modal";
import { CreateBag } from "./CreateBag";
import { EditBag } from "./EditBag";
import { BagItems } from "./BagItems";
import { TomorrowSubjects } from "./TomorrowSubjects";

export const BagModalManager = ({ isOpen, selected, showConfirmation, onEdit, onClose, mode }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen}>
            {showConfirmation ? (
                <p className="text-green-500 text-center font-semibold animate-fadeIn">
                    ✅ Cambios guardados con éxito
                </p>
            ) : mode === "create" ? (
                <CreateBag onClose={onClose} onSubmit={(newBag) => {onEdit(newBag)}} />
            ) : mode === "edit" ? (
                <EditBag bag={selected} onUpdateBag={onEdit} onClose={onClose} />
            ) : mode === "items" ? (
                <BagItems bag={selected} onClose={onClose} onUpdateBag={onEdit} />
            ) : mode === "school" ? (
                <TomorrowSubjects bag={selected} onClose={onClose} onUpdateBag={onEdit} />
            ) : null}
        </Modal>
    );
};
