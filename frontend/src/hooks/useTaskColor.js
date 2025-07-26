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

const COLOR_POOL = ["blue-400", "purple-400", "orange-400", "pink-400", "red-400", "teal-400", "green-400"];

let colorIndex = 0;
export const getTaskColor = () => {
    const assignColor = () => {
        const color = COLOR_POOL[colorIndex];
        colorIndex = (colorIndex + 1) % COLOR_POOL.length;
        return color;
    };
    return { assignColor, COLOR_POOL };
};
