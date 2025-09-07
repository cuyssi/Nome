import { useState } from "react";
import { useScheduleStore } from "../../store/useScheduleStore";

const lightColors = ["yellow-400", "gray-300", "pink-400"];

export const useSchedule = () => {
    const { days, hours, subjects, setSubject, updateHour, addHour, removeHour } = useScheduleStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleEdit = ({ day, hour, name, color }) => {
        setSubject(day, hour, name, color);
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
            setIsModalOpen(false);
        }, 1000);
    };

    const getTextClass = (bgColor) => (lightColors.includes(bgColor) ? "text-black" : "text-white");

    return {
        days,
        hours,
        subjects,
        isModalOpen,
        selectedSubject,
        showConfirmation,
        setIsModalOpen,
        setSelectedSubject,
        handleEdit,
        getTextClass,
        updateHour,
        addHour,
        removeHour,
    };
};
