/**────────────────────────────────────────────────────────────────────────────┐
 * useTomorrowSubjects: hook para gestionar los items y asignaturas de la      │
 * mochila de mañana (“tomorrow bag”).                                         │
 *                                                                             │
 * Funcionalidad:                                                              │
 *   • Calcula qué asignaturas y extras corresponden para el día siguiente.    │
 *   • Soporta mochilas de clase (por día) y mochilas normales (array items).  │
 *   • Permite marcar/desmarcar asignaturas y extras como completados.         │
 *   • Actualiza automáticamente el estado de completado de la mochila.        │
 *   • Resetea la mochila de mañana si cambia de día.                          │
 *                                                                             │
 * Props:                                                                      │
 *   • bag: objeto mochila actual con estructura { items, tomorrow, ... }.     │
 *   • onUpdateBag: función para actualizar la mochila tras cambios.           │
 *                                                                             │
 * Valores devueltos:                                                          │
 *   - subjects: array de asignaturas de mañana con { name, hour, … }.         │
 *   - extras: array de items extras de la mochila (según tipo de mochila).    │
 *   - checkedSubjects: asignaturas marcadas como completadas.                 │
 *   - checkedExtras: extras marcados como completados.                        │
 *   - isTomorrowBagComplete: boolean, true si todo está marcado.              │
 *   - toggleSubject(name): marca/desmarca una asignatura.                     │
 *   - toggleExtra(item): marca/desmarca un item extra.                        │
 *   - dayKey: string con la clave del día de mañana (“L”, “M”, …).            │
 *                                                                             │
 * Detalles internos:                                                          │
 *   • Calcula “tomorrowDate” y “dayKey” automáticamente.                      │
 *   • Usa useMemo para memoizar subjectsForTomorrow y extras según el bag.    │
 *   • Combina reset diario y actualización de completado en un único effect.  │
 *                                                                             │
 * Autor: Ana Castro                                                           │
 ─────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useMemo } from "react";
import { useScheduleStore } from "../../store/useScheduleStore";
import { DAYS_INDEX_TO_KEY } from "../../utils/constants";

const getTomorrowDayKey = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowIndex = tomorrow.getDay();
    const key = DAYS_INDEX_TO_KEY[tomorrowIndex];
    console.log("dayKey:", key);
    return key;
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
        })
        .sort((a, b) => a.hour.localeCompare(b.hour));

export const useTomorrowSubjects = ({ bag, onUpdateBag }) => {
    const { subjects } = useScheduleStore();

    const dayKey = getTomorrowDayKey();
    const tomorrowDate = getTomorrowDateString();

    const subjectsForTomorrow = useMemo(() => getTomorrowSubjectsArray(subjects, dayKey), [subjects, dayKey]);

    const extras = useMemo(() => {
        if (Array.isArray(bag.items)) return bag.items;
        if (bag.items && typeof bag.items === "object") return bag.items[dayKey] || [];
        return [];
    }, [bag.items, dayKey]);

    const checkedSubjects = bag.tomorrow?.subjects || [];
    const checkedExtras = bag.tomorrow?.extras || [];

    useEffect(() => {
        if (!bag.tomorrow || bag.tomorrow.date !== tomorrowDate) {
            console.log(bag.tomorrow.date, tomorrowDate);
            onUpdateBag({
                ...bag,
                tomorrow: { date: tomorrowDate, subjects: [], extras: [] },
                isTomorrowBagComplete: false,
            });
        }
    }, [bag, tomorrowDate, onUpdateBag]);

    useEffect(() => {
        const allSubjectsChecked = subjectsForTomorrow.every((s) => checkedSubjects.includes(s.name));
        const allExtrasChecked = extras.every((e) => checkedExtras.includes(e));
        const isComplete = allSubjectsChecked && allExtrasChecked;

        if (bag.isTomorrowBagComplete !== isComplete) {
            onUpdateBag({ ...bag, isTomorrowBagComplete: isComplete });
        }
    }, [checkedSubjects, checkedExtras, subjectsForTomorrow, extras]);

    const toggleSubject = (name) => {
        const updatedSubjects = checkedSubjects.includes(name)
            ? checkedSubjects.filter((s) => s !== name)
            : [...checkedSubjects, name];
        onUpdateBag({ ...bag, tomorrow: { ...bag.tomorrow, subjects: updatedSubjects } });
        navigator.vibrate?.(100);
    };

    const toggleExtra = (item) => {
        const updatedExtras = checkedExtras.includes(item)
            ? checkedExtras.filter((i) => i !== item)
            : [...checkedExtras, item];
        onUpdateBag({ ...bag, tomorrow: { ...bag.tomorrow, extras: updatedExtras } });
        navigator.vibrate?.(100);
    };

    console.log(subjects);

    return {
        subjects: subjectsForTomorrow,
        extras,
        checkedSubjects,
        checkedExtras,
        isTomorrowBagComplete: bag.isTomorrowBagComplete,
        toggleSubject,
        toggleExtra,
        dayKey,
    };
};
