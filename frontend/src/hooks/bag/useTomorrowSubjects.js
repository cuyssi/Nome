/**──────────────────────────────────────────────────────────────────────────────────────┐
 * useTomorrowSubjects: hook para gestionar las asignaturas del día siguiente.           │
 *                                                                                       │
 * Funcionalidad:                                                                        │
 *   • Calcula automáticamente el día siguiente de clase (solo días L-V).                │
 *   • Filtra las asignaturas del scheduleStore correspondientes a ese día.              │
 *   • Determina si la mochila del día siguiente está completa según las asignaturas.    │
 *   • Permite marcar/desmarcar asignaturas en la mochila.                               │
 *   • Vibra el dispositivo al marcar/desmarcar (si está disponible).                    │
 *                                                                                       │
 * Parámetros:                                                                           │
 *   - bag: mochila actual a actualizar.                                                 │
 *   - isOpen: indica si el modal de la mochila está abierto (opcional).                 │
 *   - onUpdateBag: función callback para actualizar la mochila.                         │
 *                                                                                       │
 * Devuelve:                                                                             │
 *   - subjects: array de asignaturas del día siguiente con hora incluida.               │
 *   - isTomorrowBagComplete: boolean indicando si todas las asignaturas están marcadas. │
 *   - toggleSubject(name): función para marcar/desmarcar una asignatura.                │
 *   - dayKey: clave del día siguiente (L, M, X, J, V).                                  │
 *                                                                                       │
 * Autor: Ana Castro                                                                     │
└───────────────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useRef } from "react";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useBagsStore } from "../../store/useBagsStore";

const getTomorrowDay = () => {
    const today = new Date();
    const todayIndex = today.getDay();
    const days = ["L", "M", "X", "J", "V"];

    let tomorrowDayKey;
    if (todayIndex >= 1 && todayIndex <= 4) {
        tomorrowDayKey = days[todayIndex];
    } else {
        tomorrowDayKey = "L";
    }

    return { dayKey: tomorrowDayKey };
};

const getTomorrowSubjects = (subjects, dayKey) =>
    Object.entries(subjects || {})
        .filter(([key, value]) => {
            const [subjectDay] = key.split("-");
            return subjectDay === dayKey && value.name;
        })
        .map(([key, value]) => {
            const [, hour] = key.split("-");
            return { ...value, hour };
        });

export const useTomorrowSubjects = ({ bag, isOpen, onUpdateBag }) => {
    const { subjects } = useScheduleStore();
    const { dayKey } = getTomorrowDay();
    const subjectsForTomorrow = getTomorrowSubjects(subjects, dayKey);
    const { isTomorrowBagComplete, setTomorrowBagComplete } = useBagsStore();
    const prevCompleteRef = useRef(null);

    useEffect(() => {
        if (!bag) return;

        const packedItems = bag.items?.[dayKey] || [];
        const subjectNames = subjectsForTomorrow.map((s) => s.name);
        const isComplete = subjectNames.length > 0 && subjectNames.every((s) => packedItems.includes(s));

        if (prevCompleteRef.current !== isComplete) {
            setTomorrowBagComplete(isComplete);
            prevCompleteRef.current = isComplete;
        }
    }, [bag, subjectsForTomorrow, dayKey, setTomorrowBagComplete]);

    const toggleSubject = (name) => {
        if (!bag) return;

        const items = bag.items || {};
        const currentDayItems = items[dayKey] || [];
        const updatedDayItems = currentDayItems.includes(name)
            ? currentDayItems.filter((i) => i !== name)
            : [...currentDayItems, name];

        const updatedItems = { ...items, [dayKey]: updatedDayItems };
        const updatedBag = { ...bag, items: updatedItems };
        onUpdateBag(updatedBag);

        if (navigator.vibrate) navigator.vibrate(100);
    };

    return {
        subjects: subjectsForTomorrow,
        isTomorrowBagComplete: bag ? isTomorrowBagComplete : false,
        toggleSubject,
        dayKey,
    };
};
