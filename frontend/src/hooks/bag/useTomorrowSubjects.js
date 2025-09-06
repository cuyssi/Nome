import { useEffect, useRef } from "react";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useBagsStore } from "../../store/useBagsStore";

const getTomorrowDay = () => {
    const today = new Date();
    const todayIndex = today.getDay();
    const tomorrowIndex = (todayIndex + 1) % 7;

    const days = ["L", "M", "X", "J", "V"];
    const finalIndex = tomorrowIndex >= 1 && tomorrowIndex <= 5 ? tomorrowIndex - 1 : 0;

    return { dayKey: days[finalIndex] };
};

const getTomorrowSubjects = (subjects, dayKey) => {
    return Object.entries(subjects || {})
        .filter(([key, value]) => {
            const [subjectDay] = key.split("-");
            return subjectDay === dayKey && value.name !== "Break";
        })
        .map(([key, value]) => {
            const [, hour] = key.split("-");
            return { ...value, hour };
        });
};

export const useTomorrowSubjects = ({ bag, isOpen, onUpdateBag }) => {
    const { subjects } = useScheduleStore();
    const { dayKey } = getTomorrowDay();
    const subjectsForTomorrow = getTomorrowSubjects(subjects, dayKey);

    const { isTomorrowBagComplete, setTomorrowBagComplete } = useBagsStore();
    const prevCompleteRef = useRef(null);

    useEffect(() => {
        const packedItems = bag.items?.[dayKey] || [];
        const subjectNames = subjectsForTomorrow.map((s) => s.name);

        const isComplete = subjectNames.length > 0 && subjectNames.every((s) => packedItems.includes(s));

        if (prevCompleteRef.current !== isComplete) {
            setTomorrowBagComplete(isComplete);
            prevCompleteRef.current = isComplete;
        }
    }, [bag, subjectsForTomorrow]);

    const toggleSubject = (name) => {
        const items = bag.items || {};
        const currentDayItems = items[dayKey] || [];

        const updatedDayItems = currentDayItems.includes(name)
            ? currentDayItems.filter((i) => i !== name)
            : [...currentDayItems, name];

        const updatedItems = {
            ...items,
            [dayKey]: updatedDayItems,
        };

        const updatedBag = { ...bag, items: updatedItems };
        onUpdateBag(updatedBag);

        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    };

    useEffect(() => {
        console.log("TomorrowSubjects mounted, isOpen:", isOpen);
    }, [isOpen]);

    return {
        subjects: subjectsForTomorrow,
        isTomorrowBagComplete,
        toggleSubject,
        dayKey,
    };
};
