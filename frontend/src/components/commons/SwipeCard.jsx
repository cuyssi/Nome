/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente SwipeCard: tarjeta deslizable con acciones laterales.             │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Contenedor de tarjetas que permite gestos de swipe (izquierda/derecha).  │
 *   • Muestra acciones visuales al deslizar: eliminar o editar.                │
 *   • Permite click en la tarjeta si no hay swipe activo.                      │
 *                                                                              │
 * Props:                                                                       │
 *   • dragOffset: desplazamiento horizontal actual (px).                       │
 *   • isRemoving: indica si la tarjeta se está eliminando (animación).         │
 *   • color: objeto con clases de Tailwind para bg, border y texto.            │
 *   • gestureHandlers: conjunto de funciones para eventos touch/pointer.       │
 *   • onClick: función que se ejecuta al hacer clic en la tarjeta.             │
 *   • leftAction: componente visual para acción izquierda (ej. eliminar).      │
 *   • rightAction: componente visual para acción derecha (ej. editar).         │
 *   • children: contenido principal de la tarjeta.                             │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

import { Container_Card } from "./Container_Card";
import { getDragColor } from "../../utils/constants"

export const SwipeCard = ({
    dragOffset,
    isRemoving,
    color,
    gestureHandlers,
    onClick,
    leftAction,
    rightAction,
    children,    
}) => {
    return (
        <div className="relative flex-shrink-0 w-full min-h-[6rem] overflow-hidden rounded-xl">
            <div
                className={`absolute inset-0 w-full z-0 flex items-center justify-between rounded-xl transition-colors duration-150 ease-in ${getDragColor(
                    dragOffset
                )}`}
            >
                <div className="flex flex-col ml-4 justify-center items-center">{leftAction}</div>
                <div className="flex flex-col mr-4 justify-center items-center">{rightAction}</div>
            </div>

            <div
                onPointerDown={(e) => {
                    gestureHandlers.handlePointerStart(e);
                    gestureHandlers.handleLongPressStart();
                }}
                onPointerMove={gestureHandlers.handlePointerMove}
                onPointerUp={(e) => {
                    gestureHandlers.handlePointerEnd(e);
                    gestureHandlers.handleLongPressEnd();
                }}
                className={`relative rounded-xl z-10 ${
                    color.bg
                } touch-pan-y transition-transform duration-150 ease-out ${
                    isRemoving ? "opacity-0 scale-90 blur-sm" : ""
                }`}
                style={{ transform: `translateX(${dragOffset}px)` }}
                onClick={onClick}
            >
                <Container_Card outerClass={color.bg} innerClass={color.border}>
                    {children}
                </Container_Card>
            </div>
        </div>
    );
};
