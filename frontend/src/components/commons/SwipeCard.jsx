/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente SwipeCard: tarjeta deslizable con acciones laterales.                   │
 *                                                                                    │
 * Props:                                                                             │
 *   - dragOffset → desplazamiento horizontal actual (px)                             │
 *   - isRemoving → si la tarjeta está siendo eliminada (aplica animación)            │
 *   - color → objeto con clases de fondo y borde (ej. { bg, border })                │
 *   - gestureHandlers → objeto con handlers para gestos táctiles y de puntero        │
 *   - onClick → función que se ejecuta al hacer clic en la tarjeta                   │
 *   - leftAction → componente visual para acción izquierda (ej. eliminar)            │
 *   - rightAction → componente visual para acción derecha (ej. editar)               │
 *   - children → contenido principal de la tarjeta                                   │
 *                                                                                    │
 * Estilo:                                                                            │
 *   - Fondo dinámico según dragOffset (getDragColor)                                 │
 *   - Animación suave al deslizar o eliminar                                         │
 *   - Acciones laterales visibles detrás del contenido                               │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

import { getDragColor } from "../../utils/constants";
import { Container_Card } from "./Container_Card";

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
        <div className="relative w-full min-h-[6rem] overflow-hidden rounded-xl">
            <div
                className={`absolute inset-0 w-full z-0 flex items-center justify-between rounded-xl transition-colors duration-150 ease-in ${getDragColor(
                    dragOffset
                )}`}
            >
                <div className="flex flex-col ml-4 justify-center items-center">{leftAction}</div>
                <div className="flex flex-col mr-4 justify-center items-center">{rightAction}</div>
            </div>

            <div
                onTouchStart={gestureHandlers.handleTouchStart}
                onTouchMove={gestureHandlers.handleTouchMove}
                onTouchEnd={gestureHandlers.handleTouchEnd}
                onPointerDown={(e) => {
                    gestureHandlers.handlePointerStart(e);
                    gestureHandlers.handleLongPressStart();
                }}
                onPointerMove={gestureHandlers.handlePointerMove}
                onPointerUp={(e) => {
                    gestureHandlers.handlePointerEnd(e);
                    gestureHandlers.handleLongPressEnd();
                }}
                className={`relative rounded-xl z-10 ${color.bg} transition-transform duration-150 ease-out ${
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
