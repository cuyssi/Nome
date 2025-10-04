/**────────────────────────────────────────────────────────────────────────────────┐
 * Componente DaySelector: selector visual de días de la semana.                   │
 * Permite seleccionar uno o varios días, se utiliza en los menús de edición.      │
 * Renderiza los días como botones circulares interactivos, cambiando              │
 * estilos según estén seleccionados o no.                                         │  
 *                                                                                 │
 * Props:                                                                          │
 *   • selectedDays: array de strings con los días actualmente seleccionados.      │
 *   • setSelectedDays: función para actualizar el estado de los días              │
 *     seleccionados.                                                              │
 *                                                                                 │ *                                                                                 │
 * @author: Ana Castro                                                             │
└─────────────────────────────────────────────────────────────────────────────────*/

import { DAYS } from "../../../utils/constants";
import { ButtonDefault } from "../buttons/ButtonDefault";

export const DaySelector = ({ selectedDays, setSelectedDays, size = 8, className }) => {
    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    return (
        <div className="flex gap-2 justify-center flex-wrap mt-2">
            {DAYS.map((day) => (
                <ButtonDefault
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    text={day.label}
                    className={`w-${size} h-${size} ${className} rounded-full border-2 flex items-center justify-center 
            ${
                selectedDays.includes(day.key)
                    ? "bg-purple-400 text-white border-purple-700"
                    : "bg-gray-200 text-gray-700 border-gray-300"
            }`}
                />
            ))}
        </div>
    );
};
