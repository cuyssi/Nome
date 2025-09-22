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

    return (
        <div className="w-full max-w-5xl mx-auto mt-4 overflow-x-auto pr-4">
            <table className="table-auto border-collapse w-full">
                <thead>
                    <tr>
                        <th className="bg-black text-red-400 font-bold p-2 text-center"></th>
                        {(days || []).map((day) => (
                            <th key={day} className="bg-black text-purple-600 font-bold p-2 text-center">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {(hours || []).map((hour) => (
                        <tr key={hour} className="border border-black">
                            <td
                                className="bg-black text-purple-400 font-bold p-2 text-center cursor-pointer"
                                onClick={() => {
                                    const newHour = prompt("Edit hour:", hour);
                                    if (newHour && newHour !== hour) updateHour(hour, newHour);
                                }}
                            >
                                {hour}
                            </td>

                            {(days || []).map((day) => {
                                const key = `${day}-${hour}`;
                                const subject = subjects[key];
                                const bgColor = subject?.color || "gray-300";
                                const textClass = getTextClass(bgColor);

                                return (
                                    <td
                                        key={key}
                                        className={`border border-black h-14 sm:h-12 text-center cursor-pointer hover:brightness-95 bg-${bgColor} ${textClass}`}
                                        onClick={() => {
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

            <div className="w-full flex justify-center">
                <div className="mt-28 flex gap-4 ml-4">
                    <button
                        onClick={() => {
                            const newHour = prompt("Add new hour (e.g., 12:30)");
                            if (newHour) addHour(newHour);
                        }}
                        className="px-3 py-1 bg-purple-400 text-white rounded"
                    >
                        ➕ Add hour
                    </button>
                    <button
                        onClick={() => {
                            if (hours.length === 0) return alert("No hours to remove.");
                            const hourToRemove = prompt(`Enter the hour to remove:\n${hours.join(", ")}`);
                            if (hourToRemove && hours.includes(hourToRemove)) removeHour(hourToRemove);
                        }}
                        className="px-3 py-1 bg-red-400 text-white rounded"
                    >
                        ➖ Remove hour
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
        </div>
    );
};
