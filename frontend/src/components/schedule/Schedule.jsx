/**──────────────────────────────────────────────────────────────────────────────┐
 * Componente Schedule: tabla interactiva de horario de asignaturas.             │
 * Permite visualizar, añadir, eliminar y editar horas y asignaturas.            │ 
 *                                                                               │
 * Estado y hooks:                                                               │
 *   • useSchedule(): hook que gestiona días, horas, asignaturas y modales.      │
 *   • isModalOpen → controla apertura del modal.                                │
 *   • selectedSubject → asignatura actualmente seleccionada para editar.        │
 *   • showConfirmation → indica si se debe mostrar mensaje de éxito.            │
 *   • getTextClass(bgColor) → devuelve clase de texto según el color de fondo.  │
 *   • updateHour, addHour, removeHour → funciones para manipular horas.         │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

import { useRef, useState } from "react";
import { useSchedule } from "../../hooks/schedule/useSchedule";
import { ScheduleModalManager } from "./ScheduleModalManager";

export const Schedule = () => {
    const {
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
    } = useSchedule();

    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [dragDetected, setDragDetected] = useState(false);
    const onMouseUp = () => setIsDragging(false);
    const onMouseLeave = () => setIsDragging(false);

    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        setDragDetected(false);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) setDragDetected(true);
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="w-[92%] max-w-5xl border border-black hide-scrollbar">
            <div
                ref={scrollRef}
                className="overflow-x-auto overflow-y-hidden touch-pan-x hide-scrollbar"
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                <table className="table-auto border-collapse min-w-max">
                    <thead>
                        <tr>
                            <th className="bg-black font-bold text-center sticky left-0 z-50"></th>
                            {days.map((day) => (
                                <th key={day} className="bg-black text-purple-600 font-bold text-center ">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map((hour) => (
                            <tr key={hour} className="border border-none">
                                <td
                                    className="text-purple-400 font-bold text-center cursor-pointer sticky left-0 bg-black pr-2 z-10"
                                    onClick={() => {
                                        const newHour = prompt("Edit hour:", hour);
                                        if (newHour && newHour !== hour) updateHour(hour, newHour);
                                    }}
                                >
                                    {hour}
                                </td>
                                {days.map((day) => {
                                    const key = `${day}-${hour}`;
                                    const subject = subjects[key];
                                    const bgColor = subject?.color || "gray-300";
                                    const textClass = getTextClass(bgColor);

                                    return (
                                        <td
                                            key={key}
                                            className={`border min-w-14 px-1 border-gray-600 h-14 sm:h-12 text-center text-sm cursor-pointer bg-${bgColor} ${textClass}`}
                                            onClick={() => {
                                                if (dragDetected) return;
                                                setSelectedSubject({
                                                    day,
                                                    hour,
                                                    name: subject?.name || "",
                                                    color: subject?.color || "yellow-400",
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            {subject?.name || ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex w-full mt-16 justify-between">
                <button
                    onClick={() => {
                        const newHour = prompt("Add new hour (e.g., 12:30)");
                        if (newHour) addHour(newHour);
                    }}
                    className="px-3 py-1 bg-purple-400 text-white rounded"
                >
                    ➕ Añadir hora
                </button>
                <button
                    onClick={() => {
                        if (!hours.length) return alert("No hours to remove.");
                        const hourToRemove = prompt(`Enter the hour to remove:\n${hours.join(", ")}`);
                        if (hourToRemove && hours.includes(hourToRemove)) removeHour(hourToRemove);
                    }}
                    className="px-3 py-1 bg-red-400 text-white rounded"
                >
                    ➖ Eliminar hora
                </button>
            </div>

            <ScheduleModalManager
                isOpen={isModalOpen}
                selectedSubject={selectedSubject}
                showConfirmation={showConfirmation}
                onEdit={handleEdit}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
