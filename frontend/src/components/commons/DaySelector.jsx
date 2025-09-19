/**────────────────────────────────────────────────────────────────────────────────┐
 * Componente DaySelector: selector visual de días de la semana.                   │
 * Permite seleccionar uno o varios días, útil para recordatorios o filtros.       │
 * Renderiza los días como botones circulares interactivos, cambiando              │
 * estilos según estén seleccionados o no.                                         │  
 *                                                                                 │
 * Props:                                                                          │
 *   • selectedDays: array de strings con los días actualmente seleccionados.      │
 *   • setSelectedDays: función para actualizar el estado de los días              │
 *     seleccionados.                                                              │
 *                                                                                 │
 * Funcionalidad:                                                                  │
 *   • toggleDay: agrega o quita un día del array selectedDays.                    │
 *   • Los días se representan con su inicial ("L", "M", "X", "J", "V", "S", "D"). │
 *   • Cada botón cambia su color y borde según esté seleccionado.                 │
 *                                                                                 │
 * @author: Ana Castro                                                             │
└─────────────────────────────────────────────────────────────────────────────────*/

import { DAYS } from "../../utils/constants";
import { ButtonDefault } from "./buttons/ButtonDefault";

export const DaySelector = ({ selectedDays, setSelectedDays, size = 8 }) => {
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
                    className={`w-${size} h-${size} rounded-full border-2 flex items-center justify-center 
            ${
                selectedDays.includes(day.key)
                    ? "bg-purple-500 text-white border-purple-700"
                    : "bg-gray-200 text-gray-700 border-gray-300"
            }`}
                />
            ))}
        </div>
    );
};
