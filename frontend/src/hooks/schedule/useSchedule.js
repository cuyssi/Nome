import { useState } from "react";
import { useScheduleStore } from "../../store/useScheduleStore";

const lightColors = ["yellow-400", "gray-300", "pink-400"];

export const useSchedule = () => {
    const { dias, horas, asignaturas, setAsignatura, setHora, addHora, removeHora } = useScheduleStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleEdit = ({ dia, hora, nombre, color }) => {
        setAsignatura(dia, hora, nombre, color);
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
            setIsModalOpen(false);
        }, 1000);
    };

    const getTextClass = (bgColor) => (lightColors.includes(bgColor) ? "text-black" : "text-white");

    return {
        dias,
        horas,
        asignaturas,
        isModalOpen,
        selectedSubject,
        showConfirmation,
        setIsModalOpen,
        setSelectedSubject,
        handleEdit,
        getTextClass,
        setHora,
        addHora,
        removeHora,
    };
};
