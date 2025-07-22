/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook personalizado para detectar la ruta activa en navegación.               │
 * Devuelve clases de estilo dinámicas para resaltar el ícono activo en el UI.  │
 * Ideal para barras de navegación con feedback visual según la URL actual.     │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useLocation } from "react-router-dom";

const useActivePath = () => {
    const location = useLocation();

    const getIconClass = (path) =>
        location.pathname === path ? "text-gray-500 drop-shadow-[0_1px_1px_black]" : "text-purple-400";

    return { getIconClass };
};

export default useActivePath;
