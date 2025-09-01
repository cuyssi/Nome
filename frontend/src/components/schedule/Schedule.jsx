import React from "react";
import { useSchedule } from "../../hooks/schedule/useSchedule";
import { ScheduleModalManager } from "./ScheduleModalManager";

export const Schedule = () => {
    const {
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
    } = useSchedule();

    return (
        <div className="w-full max-w-5xl mx-auto mt-4 overflow-x-auto pr-4">
            <table className="table-auto border-collapse w-full">
                <thead>
                    <tr>
                        <th className="bg-black text-red-400 font-bold p-2 text-center"></th>
                        {dias.map((dia) => (
                            <th key={dia} className="bg-black text-purple-600 font-bold p-2 text-center">
                                {dia}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {horas.map((hora) => (
                        <tr key={hora} className="border border-black">
                            <td
                                className="bg-black text-purple-400 font-bold p-2 text-center cursor-pointer"
                                onClick={() => {
                                    const nuevaHora = prompt("Editar hora:", hora);
                                    if (nuevaHora && nuevaHora !== hora) setHora(hora, nuevaHora);
                                }}
                            >
                                {hora}
                            </td>

                            {dias.map((dia) => {
                                const key = `${dia}-${hora}`;
                                const asignatura = asignaturas[key];
                                const bgColor = asignatura?.color || "gray-300";
                                const textClass = getTextClass(bgColor);

                                return (
                                    <td
                                        key={`${key}-${bgColor}`}
                                        className={`border border-black h-16 sm:h-14 text-center cursor-pointer hover:brightness-95 bg-${bgColor} ${textClass}`}
                                        onClick={() => {
                                            setSelectedSubject({
                                                dia,
                                                hora,
                                                nombre: asignatura?.nombre || "",
                                                color: asignatura?.color || "yellow-400",
                                            });
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        {asignatura?.nombre || ""}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="w-full flex justify-center">
                <div className="mt-14 flex gap-4 ml-4">
                    <button
                        onClick={() => {
                            const nuevaHora = prompt("Introduce la nueva hora (ej: 12:30)");
                            if (nuevaHora) addHora(nuevaHora);
                        }}
                        className="px-3 py-1 bg-purple-400 text-white rounded"
                    >
                        ➕ Añadir hora
                    </button>
                    <button
                        onClick={() => {
                            if (horas.length === 0) return alert("No hay horas para eliminar.");
                            const horaAEliminar = prompt(`Introduce la hora a eliminar:\n${horas.join(", ")}`);
                            if (horaAEliminar && horas.includes(horaAEliminar)) removeHora(horaAEliminar);
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
        </div>
    );
};
