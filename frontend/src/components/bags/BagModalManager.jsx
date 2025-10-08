/**────────────────────────────────────────────────────────────────────────────────────────────┐
 * Componente BagModalManager: gestiona y muestra los diferentes modales de mochilas.          │
 *                                                                                             │
 * Funcionalidad:                                                                              │
 *   • Renderiza un modal según el `mode` y props:                                             │
 *       – "create" → CreateBag: crear nueva mochila.                                          │
 *       – "edit" → EditBag: editar mochila existente.                                         │ 
 *       – "items" → BagItems: ver y marcar items de la mochila.                               │
 *       – "school" → TomorrowSubjects: gestionar asignaturas de la mochila de clase.           │
 *   • Muestra un mensaje de confirmación si `showConfirmation` es true y no es modo "school". │
 *                                                                                             │
 * Props:                                                                                      │ 
 *   • isOpen: boolean que controla si el modal está visible.                                  │
 *   • selected: mochila seleccionada para editar o mostrar items.                             │ 
 *   • showConfirmation: boolean para mostrar mensaje de éxito.                                │ 
 *   • onEdit: función llamada al guardar cambios.                                             │ 
 *   • onClose: función para cerrar el modal.                                                  │ 
 *   • mode: string que define qué modal mostrar ("create", "edit", "items", "school").        │  
 *                                                                                             │ 
 * Autor: Ana Castro                                                                           │         
└─────────────────────────────────────────────────────────────────────────────────────────────*/

import { Modal } from "../commons/modals/Modal";
import { CreateBag } from "./CreateBag";
import { EditBag } from "./EditBag";
import { BagItems } from "./BagItems";
import { TomorrowSubjects } from "./TomorrowSubjects";
import { Check } from "lucide-react";
import { useBagsStore } from "../../store/useBagsStore";

export const BagModalManager = ({ isOpen, selected, showConfirmation, onEdit, onClose, mode }) => {
    const bags = useBagsStore((state) => state.bags);
    const selectedBag = selected?.id ? bags.find((b) => b.id === selected.id) : null;

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen}>
            {mode !== "school" && showConfirmation ? (
                <p className="flex text-green-500 justify-center font-semibold animate-fadeIn">
                    <Check className="mr-2" /> Cambios guardados con éxito
                </p>
            ) : mode === "create" ? (
                <CreateBag onClose={onClose} onSubmit={(newBag) => onEdit(newBag)} />
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
                    bag={selectedBag || selected}
                    isOpen={true}
                    onClose={onClose}
                    onUpdateBag={(updatedBag) => onEdit(updatedBag, { skipConfirmation: true })}
                />
            ) : null}
        </Modal>
    );
};
