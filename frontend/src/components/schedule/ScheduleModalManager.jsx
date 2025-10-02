/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente ScheduleModalManager: gestor de modales para asignaturas.         │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Gestiona la apertura de un modal para crear o editar una asignatura.     │
 *   • Muestra mensaje de confirmación cuando los cambios se guardan.           │
 *   • Renderiza Form_Schedule para edición o creación de asignaturas.          │
 *                                                                              │
 * Props:                                                                       │
 *   • isOpen (boolean): indica si el modal está abierto.                       │
 *   • selectedSubject (object): asignatura actualmente seleccionada.           │
 *       - day: día de la asignatura.                                           │
 *       - hour: hora de la asignatura.                                         │
 *       - name: nombre de la asignatura.                                       │
 *       - color: color de la asignatura.                                       │
 *   • showConfirmation (boolean): controla si mostrar mensaje de éxito.        │
 *   • onEdit (function): función llamada al guardar cambios en la asignatura.  │
 *   • onClose (function): función llamada al cerrar el modal.                  │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Modal } from "../commons/modals/Modal";
import { Form_Schedule } from "./Form_Schedule";
import { Form_HourSchedule } from "./Form_HourSchedule";
import { Check } from "lucide-react";

export const ScheduleModalManager = ({
    isOpen,
    selectedSubject,
    selectedHour,
    mode = "subject",
    showConfirmation,
    onEditSubject,
    onEditHour,
    removeHour,
    onClose,
}) => {
    return (
        <Modal isOpen={isOpen}>
            {showConfirmation ? (
                <p className="flex text-green-500 justify-center font-semibold animate-fadeIn">
                    <Check className="mr-2" /> Cambios guardados con éxito
                </p>
            ) : mode === "subject" ? (
                <Form_Schedule
                    subject={selectedSubject}
                    day={selectedSubject?.day}
                    hour={selectedSubject?.hour}
                    onSubmit={onEditSubject}
                    onClose={onClose}
                />
            ) : (
                <Form_HourSchedule
                    initialHour={selectedHour}
                    onSubmit={onEditHour}
                    onClose={onClose}
                    onDelete={() => removeHour(selectedHour)}
                />
            )}
        </Modal>
    );
};
