import { useEffect, useRef } from "react";
import { Modal } from "../commons/Modal";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useBagsStore } from "../../store/useBagsStore";
import { X } from "lucide-react";

const diaCompleto = {
    L: "Lunes",
    M: "Martes",
    X: "Miércoles",
    J: "Jueves",
    V: "Viernes",
};

const getTomorrowDay = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    const tomorrowIndex = (dayIndex + 1) % 7;
    const diasES = ["L", "M", "X", "J", "V"];
    const finalIndex = tomorrowIndex >= 1 && tomorrowIndex <= 5 ? tomorrowIndex - 1 : 0;
    return { diaES: diasES[finalIndex] };
};

const getSubjectsForTomorrow = (asignaturas, diaES) => {
    return Object.entries(asignaturas)
        .filter(([key, value]) => {
            const [dia] = key.split("-");
            return dia === diaES && value.nombre !== "Recreo";
        })
        .map(([key, value]) => {
            const [, hora] = key.split("-");
            return { ...value, hora };
        });
};

export const TomorrowSubjects = ({ bag, isOpen, onClose, onUpdateBag }) => {
    const { asignaturas } = useScheduleStore();
    const { diaES } = getTomorrowDay();
    const subjects = getSubjectsForTomorrow(asignaturas, diaES);

    const { isTomorrowBagComplete, setTomorrowBagComplete } = useBagsStore();

    const prevCompleteRef = useRef(null);

    useEffect(() => {
        const packedItems = bag.items?.[diaES] || [];
        const subjectNames = subjects.map((s) => s.nombre);
        const isComplete = subjectNames.length > 0 && subjectNames.every((s) => packedItems.includes(s));

        if (prevCompleteRef.current !== isComplete) {
            setTomorrowBagComplete(isComplete);
            prevCompleteRef.current = isComplete;
        }
    }, [bag, subjects]);

    const toggleSubject = (nombre) => {
        const items = bag.items || {};
        const currentDayItems = items[diaES] || [];

        const updatedDayItems = currentDayItems.includes(nombre)
            ? currentDayItems.filter((i) => i !== nombre)
            : [...currentDayItems, nombre];

        const updatedItems = {
            ...items,
            [diaES]: updatedDayItems,
        };

        const updatedBag = { ...bag, items: updatedItems };
        onUpdateBag(updatedBag);

        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    };

    useEffect(() => {
        console.log("TomorrowSubjects montado, isOpen:", isOpen);
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen}>
            <div className="relative bg-black border border-purple-600 rounded-xl p-6 w-[90%] max-w-md text-white shadow-lg">
                <h2 className="text-2xl text-center font-poppins text-purple-400 font-bold mt-10">
                    Asignaturas {diaCompleto[diaES]}
                </h2>

                {isTomorrowBagComplete && (
                    <p className="text-green-400 text-center mt-4 font-bold">¡Mochila lista para mañana! 🎒✅</p>
                )}

                {subjects.length === 0 ? (
                    <p className="font-poppins text-purple-400 text-sm">No hay asignaturas programadas para mañana.</p>
                ) : (
                    <ul className="space-y-5 mt-10 ml-5">
                        {subjects.map((subject, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={bag.items?.[diaES]?.includes(subject.nombre)}
                                    onChange={() => toggleSubject(subject.nombre)}
                                    className="accent-purple-400 w-5 h-5"
                                />
                                <span
                                    className={`text-lg ${
                                        bag.items?.[diaES]?.includes(subject.nombre) ? "line-through" : ""
                                    }`}
                                >
                                    {subject.nombre}
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
