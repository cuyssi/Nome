/**────────────────────────────────────────────────────────────────────────────────────┐
 * Componente TomorrowSubjects: muestra las asignaturas asociadas a una mochila        │
 * para el día siguiente y permite marcarlas como completadas.                         │
 *                                                                                     │
 * Props:                                                                              │
 *   • bag: objeto de mochila que contiene los items (asignaturas) y datos.            │
 *   • isOpen: boolean que controla la visibilidad del modal.                          │
 *   • onClose: función para cerrar el modal.                                          │
 *   • onUpdateBag: función llamada al actualizar la mochila.                          │ *                                                                                     │
 *                                                                                     │
 * Autor: Ana Castro                                                                   │
 *────────────────────────────────────────────────────────────────────────────────────*/

import { Modal } from "../commons/Modal";
import { useTomorrowSubjects } from "../../hooks/bag/useTomorrowSubjects";
import { Check } from "lucide-react";
import { FULL_DAYS } from "../../utils/constants";
import { ButtonClose } from "../commons/buttons/ButtonClose";

export const TomorrowSubjects = ({ bag, isOpen, onClose, onUpdateBag }) => {
    const { subjects, isTomorrowBagComplete, toggleSubject, dayKey } = useTomorrowSubjects({
        bag,
        isOpen,
        onUpdateBag,
    });

    if (!bag) return null;

    return (
        <Modal isOpen={isOpen}>
            <div className="relative bg-black border border-purple-600 rounded-xl p-6 w-full max-w-md text-white shadow-lg">
                <h2 className="text-2xl text-center font-poppins text-purple-400 font-bold mt-10">
                    Asignaturas {FULL_DAYS[dayKey]}
                </h2>

                {isTomorrowBagComplete && (
                    <p className="flex items-center gap-2 text-green-700 justify-center mt-4 font-bold">
                        <Check className="mr-2" /> Cambios guardados con éxito
                    </p>
                )}

                {subjects.length === 0 ? (
                    <p className="font-poppins text-red-400 text-center text-sm mt-8">
                        No hay asignaturas para mañana.
                    </p>
                ) : (
                    <ul className="space-y-5 mt-10 ml-5">
                        {subjects.map((subject, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={!!bag.items?.[dayKey]?.includes(subject.name)}
                                    onChange={() => toggleSubject(subject.name)}
                                    className="accent-blue-500 w-5 h-5"
                                />
                                
                                <span
                                    className={`text-lg ${
                                        bag.items?.[dayKey]?.includes(subject.name) ? "line-through" : ""
                                    }`}
                                >
                                    {subject.name}
                                </span>
                                
                            </li>
                        ))}
                    </ul>
                )}

                <ButtonClose onClick={onClose} />
            </div>
        </Modal>
    );
};
