/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente HelpToggle: botón flotante para abrir el centro de ayuda.              │
 *                                                                                    │
 * Estado interno:                                                                    │
 *   - helpOpen → controla si el modal de ayuda está visible                          │
 *                                                                                    │
 * Funcionalidad:                                                                     │
 *   - Muestra un botón con ícono de interrogación                                    │
 *   - Al hacer clic, abre el componente <Help /> con tutoriales interactivos         │
 *                                                                                    │
 * Estilo:                                                                            │
 *   - Posición absoluta en esquina superior derecha                                  │
 *   - Ícono morado con sombra y transición al pasar el cursor                        │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

import { Help } from "./Help";
import { CircleQuestionMark } from "lucide-react";
import { useState } from "react";

export const HelpToggle = () => {
    const [helpOpen, setHelpOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setHelpOpen(true)}
                className="absolute top-1 right-2 z-50 text-purple-400 p-2 rounded-full shadow-md hover:bg-purple-700 transition"
                title="Centro de ayuda"
            >
                <CircleQuestionMark className="w-5.5 h-5.5" />
            </button>

            <Help isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
        </>
    );
};
