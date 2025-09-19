/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente ColorPicker: selector de colores circular reutilizable.                 │
 *                                                                                    │
 * Props:                                                                             │
 *   - selectedColor → color actualmente seleccionado                                 │
 *   - setSelectedColor → función para actualizar el color                            │
 *   - colors → array de colores disponibles (opcional, por defecto AVAILABLE_COLORS) │
 *   - size → tamaño de los botones en px (opcional, default 8)                       │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

import { AVAILABLE_COLORS } from "../../utils/constants";
import { ButtonDefault } from "./buttons/ButtonDefault";

export const ColorPicker = ({ selectedColor, setSelectedColor, colors = AVAILABLE_COLORS, size = 8 }) => {
    return (
        <div className="flex gap-1 flex-wrap mt-2">
            {colors.map((color) => (
                <ButtonDefault
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-${size} h-${size} rounded-full border-2 ${
                        selectedColor === color.value ? "border-gray-500 border-4" : "border-transparent"
                    } bg-${color.value}`}
                    title={color.label}
                />
            ))}
        </div>
    );
};
