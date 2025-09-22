/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente PointerOverlay: flecha flotante para señalar elementos o zonas.   │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Renderiza una flecha animada en coordenadas absolutas.                   │
 *   • No calcula nada: recibe posición ya resuelta por el hook.                │
 *                                                                              │
 * Props:                                                                       │
 *   - top (string | number): posición vertical (ej. "50%", 120).               │
 *   - left (string | number): posición horizontal (ej. "50%", 300).            │
 *   - transform (string): transformación opcional (ej. "rotate(180deg)").      │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/
import { ArrowBigUp } from "lucide-react";

export const PointerOverlay = ({
    top,
    left,
    transform = "translate(-50%, -100%)",
    animationClass = "animate-bounce",
}) => {
    return (
        <div
            style={{
                position: "absolute",
                top,
                left,
                transform,
                zIndex: 9999,
                pointerEvents: "none",
            }}
        >
            <div className={`text-green-500 ${animationClass}`}>
                <ArrowBigUp className="w-16 h-16" />
            </div>
        </div>
    );
};
