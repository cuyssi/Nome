/**──────────────────────────────────────────────────────────────────────────────────────┐
 * useTomorrowSubjects: hook para gestionar las asignaturas y extras del día siguiente. │
 *                                                                                       │
 * Funcionalidad:                                                                        │
 *   • Calcula automáticamente el día siguiente de clase (solo días L-V).                │
 *   • Filtra las asignaturas del scheduleStore correspondientes a ese día.              │
 *   • Determina si la mochila del día siguiente está completa según las asignaturas y   │
 *     extras.                                                                           │
 *   • Permite marcar/desmarcar asignaturas y extras.                                    │
 *   • Resetea automáticamente los checks al cambiar de día.                             │
 *                                                                                       │
 * Parámetros:                                                                           │
 *   - bag: mochila actual a actualizar.                                                 │
 *   - onUpdateBag: función callback para actualizar la mochila.                         │
 *                                                                                       │
 * Devuelve:                                                                             │
 *   - subjects: array de asignaturas del día siguiente.                                 │
 *   - extras: array de items extra de la mochila.                                       │
 *   - isTomorrowBagComplete: boolean indicando si todas las asignaturas y extras están  │
 *     marcadas.                                                                         │
 *   - toggleSubject(name): función para marcar/desmarcar una asignatura.                │
 *   - toggleExtra(item): función para marcar/desmarcar un item extra.                   │
 *   - dayKey: clave del día siguiente (L, M, X, J, V).                                  │
 *   - checkedSubjects, checkedExtras: arrays de items marcados para renderizado.       │
 *                                                                                       │
 * Autor: Ana Castro                                                                     │
└───────────────────────────────────────────────────────────────────────────────────────*/

import { useEffect } from "react";
import { useScheduleStore } from "../../store/useScheduleStore";
import { FULL_WEEKDAYS_NUM } from "../../utils/constants";

const getTomorrowDayKey = () => {
    const today = new Date();
    const todayIndex = today.getDay();
    const days = FULL_WEEKDAYS_NUM;
    return todayIndex >= 1 && todayIndex <= 4 ? days[todayIndex] : "L";
};

const getTomorrowDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + (today.getDay() >= 5 ? 3 : 1));
    return tomorrow.toDateString();
};

const getTomorrowSubjectsArray = (subjects, dayKey) =>
    Object.entries(subjects || {})
        .filter(([key, value]) => key.split("-")[0] === dayKey && value.name)
        .map(([key, value]) => {
            const [, hour] = key.split("-");
            return { ...value, hour };
        });

export const useTomorrowSubjects = ({ bag, onUpdateBag }) => {
    const { subjects } = useScheduleStore();
    const dayKey = getTomorrowDayKey();
    const tomorrowDate = getTomorrowDateString();
    const subjectsForTomorrow = getTomorrowSubjectsArray(subjects, dayKey);
    const extras = bag.items || [];

    useEffect(() => {
        if (!bag.tomorrow || bag.tomorrow.date !== tomorrowDate) {
            onUpdateBag({
                ...bag,
                tomorrow: {
                    date: tomorrowDate,
                    subjects: [],
                    extras: [],
                },
            });
        }
    }, [bag, tomorrowDate, onUpdateBag]);

    const checkedSubjects = bag.tomorrow?.subjects || [];
    const checkedExtras = bag.tomorrow?.extras || [];

    const toggleSubject = (name) => {
        if (!bag) return;
        const current = bag.tomorrow?.subjects || [];
        const updated = current.includes(name) ? current.filter((s) => s !== name) : [...current, name];
        onUpdateBag({ ...bag, tomorrow: { ...bag.tomorrow, subjects: updated } });
        if (navigator.vibrate) navigator.vibrate(100);
    };

    const toggleExtra = (item) => {
        if (!bag) return;
        const current = bag.tomorrow?.extras || [];
        const updated = current.includes(item) ? current.filter((i) => i !== item) : [...current, item];
        onUpdateBag({ ...bag, tomorrow: { ...bag.tomorrow, extras: updated } });
        if (navigator.vibrate) navigator.vibrate(100);
    };

    const isTomorrowBagComplete =
        subjectsForTomorrow.every((s) => checkedSubjects.includes(s.name)) &&
        extras.every((e) => checkedExtras.includes(e));

    return {
        subjects: subjectsForTomorrow,
        extras,
        checkedSubjects,
        checkedExtras,
        isTomorrowBagComplete,
        toggleSubject,
        toggleExtra,
        dayKey,
    };
};
