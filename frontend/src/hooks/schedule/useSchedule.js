/**────────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useSchedule: hook para gestionar la agenda de materias y horarios.                                  │
 *                                                                                                     │
 * Funcionalidad:                                                                                      │
 *   • Obtiene días, horas y materias desde el store `useScheduleStore`.                               │
 *   • Permite abrir y cerrar un modal para editar materias.                                           │
 *   • Gestiona la materia seleccionada y muestra confirmación tras edición.                           │
 *   • Define clases de texto según el color de fondo de la materia (claro → texto negro, etc.).       │
 *   • Expone funciones para actualizar, añadir o eliminar horas en la agenda.                         │
 *                                                                                                     │
 * Devuelve:                                                                                           │
 *   - days: array con los días de la semana disponibles.                                              │
 *   - hours: array con los horarios configurados.                                                     │
 *   - subjects: objeto con las materias por día y hora.                                               │
 *   - isModalOpen: booleano para controlar visibilidad del modal de edición.                          │
 *   - selectedSubject: materia seleccionada actualmente para editar.                                  │
 *   - showConfirmation: booleano para mostrar mensaje de confirmación tras edición.                   │
 *   - setIsModalOpen(boolean): abre/cierra el modal.                                                  │
 *   - setSelectedSubject(subject): establece la materia seleccionada.                                 │
 *   - handleEdit({ day, hour, name, color }): actualiza la materia en el store y muestra confirmación.│
 *   - getTextClass(bgColor): devuelve la clase de texto según color de fondo.                         │
 *   - updateHour(day, hour, name, color): actualiza hora existente.                                   │
 *   - addHour(day, hour, name, color): añade nueva hora.                                              │
 *   - removeHour(day, hour): elimina una hora existente.                                              │
 *                                                                                                     │
 * Autor: Ana Castro                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────*/

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
