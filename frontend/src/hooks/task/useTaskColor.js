/**─────────────────────────────────────────────────────────────────────────────┐
 * Utilidad para asignar colores cíclicos a las tareas desde un conjunto base.  │
 * Usa un índice rotatorio para recorrer la paleta y entregar un color único.   │
 * Ideal para diferenciar visualmente elementos sin repetir tonos cercanos.     │
 * Exporta también la lista completa como referencia o para render dinámico.    │
 *                                                                              │
 * - COLOR_POOL: lista de clases de Tailwind para colores uniformes.            │
 * - assignColor(): devuelve el siguiente color disponible en orden circular.   │
 * - El índice se reinicia automáticamente al llegar al final del pool.         │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { AVAILABLE_COLORS } from "../../utils/constants";

const COLOR_POOL = AVAILABLE_COLORS.map((c) => c.value);

let colorIndex = 0;

export const getTaskColor = () => {
    const assignColor = () => {
        const color = COLOR_POOL[colorIndex];
        colorIndex = (colorIndex + 1) % COLOR_POOL.length;
        return color;
    };
    return { assignColor, COLOR_POOL };
};
