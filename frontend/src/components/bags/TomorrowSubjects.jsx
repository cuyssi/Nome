import { Modal } from "../commons/Modal";
import { useTomorrowSubjects } from "../../hooks/bag/useTomorrowSubjects";
import { X } from "lucide-react";

const fullDays = {
    L: "Lunes",
    M: "Martes",
    X: "Miércoles",
    J: "Jueves",
    V: "Viernes",
};

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
                    Asignaturas {fullDays[dayKey]}
                </h2>

                {isTomorrowBagComplete && (
                    <p className="flex items-center gap-2 text-green-700 justify-center mt-4 font-bold">
                        ¡Mochila lista! <Check />
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

                <button onClick={onClose} className="absolute top-4 right-4 text-red-400 hover:text-red-700">
                    <X className="w-8 h-8" />
                </button>
            </div>
        </Modal>
    );
};
