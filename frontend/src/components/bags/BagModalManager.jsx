import React from "react";
import { Modal } from "../commons/Modal";
import { Form_Bag } from "./Form_Bag";
import { useBagEditor } from "../../hooks/bag/useBagEditor";

export const BagModalManager = () => {
    const { isOpen, selectedBag, handleEdit, handleClose, showConfirmation } = useBagEditor();

    return (
        <Modal open={isOpen} onClose={handleClose}>
            {showConfirmation && <div className="confirmation-toast">✅ Mochila actualizada</div>}
            <h2>Editar Mochila</h2>
            {selectedBag && <Form_Bag initialData={selectedBag} onSubmit={handleEdit} onCancel={handleClose} />}
        </Modal>
    );
};
