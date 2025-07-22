/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente de footer fijo que muestra navegación inferior con iconos.        │
 * Permite cambiar entre páginas de citas, calendario, inicio y tareas.         │
 * Destaca el icono activo según la ruta actual utilizando un hook personalizado│
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { Link } from "react-router-dom";
import { Notebook, CalendarCheck, Home, Backpack } from "lucide-react";
import useActivePath from "../../hooks/useActivePath.js";

export const Footer = () => {
    const { getIconClass } = useActivePath();

    return (
        <div className="flex flex-row justify-between px-4 items-center w-full h-[8%] bg-black bottom-0 absolute z-10 ">
            <Link to="./dates">
                <Notebook className={getIconClass("/dates")} />
            </Link>
            <Link to="./schedule">
                <CalendarCheck className={getIconClass("/schedule")} />
            </Link>
            <Link to="./">
                <Home className={getIconClass("/")} />
            </Link>
            <Link to="./bags">
                <Backpack className={getIconClass("/bags")} />
            </Link>
        </div>
    );
};


