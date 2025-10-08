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

import { Modal } from "../commons/modals/Modal";
import { useTomorrowSubjects } from "../../hooks/bag/useTomorrowSubjects";
import { Check } from "lucide-react";
import { FULL_DAYS } from "../../utils/constants";
import { ButtonClose } from "../commons/buttons/ButtonClose";

export const TomorrowSubjects = ({ bag, isOpen, onClose, onUpdateBag }) => {
    const {
        subjects,
        extras,
        isTomorrowBagComplete,
        toggleSubject,
        dayKey,
        toggleExtra,
        checkedExtras,
        checkedSubjects,
    } = useTomorrowSubjects({
        bag,
        isOpen,
        onUpdateBag,
    });

    console.log(extras);

    if (!bag) return null;

    return (
        <Modal isOpen={isOpen}>
            <div className="relative bg-black border border-purple-400 rounded-xl p-6 w-full max-w-md text-white shadow-lg">
                <div className="h-5 flex items-center justify-center mt-8 mb-2">
                    {isTomorrowBagComplete ? (
                        <p className="flex items-center gap-1 text-green-700 font-bold">
                            <Check />
                            Mochila completa!
                        </p>
                    ) : (
                        <span className="text-transparent select-none">placeholder</span>
                    )}
                </div>
                <h2 className="text-2xl text-center font-poppins text-purple-400 font-bold">
                    Asignaturas {FULL_DAYS[dayKey]}
                </h2>

                {subjects.length === 0 ? (
                    <p className="font-poppins text-red-400 text-center text-sm mt-4">
                        No hay asignaturas para mañana.
                    </p>
                ) : (
                    <ul className="space-y-5 mt-5 ml-6">
                        {subjects.map((subject, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={checkedSubjects.includes(subject.name)}
                                    onChange={() => toggleSubject(subject.name)}
                                    className="w-5 h-5 rounded accent-purple-500"
                                />

                                <span className="text-lg">{subject.name}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {extras.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl text-purple-400 font-bold mb-3 text-center">Añade también:</h3>
                        <ul className="space-y-4 mt-2 ml-10">
                            {extras.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={checkedExtras.includes(item)}
                                        onChange={() => toggleExtra(item)}
                                        className="w-5 h-5 rounded accent-purple-400"
                                    />
                                    <span className="text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <ButtonClose onClick={onClose} />
            </div>
        </Modal>
    );
};
