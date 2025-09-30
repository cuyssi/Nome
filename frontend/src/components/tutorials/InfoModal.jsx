/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente InfoModal: ventana modal informativa reutilizable.                │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Muestra contenido informativo o interactivo en un modal centrado.        │
 *   • Permite cerrar el modal con un botón y opcionalmente “No mostrar más”.   │
 *   • Configurable: difuminado del fondo, bloqueo de interacción y posición.   │
 *                                                                              │
 * Props:                                                                       │
 *   - isOpen (bool): controla si el modal está visible.                        │
 *   - onClose (func): callback para cerrar el modal.                           │
 *   - onNeverShowAgain (func): callback al hacer clic en “No mostrar más”.     │
 *   - children (ReactNode): contenido dentro del modal.                        │
 *   - backdropBlur (bool): si el fondo detrás del modal debe difuminarse.      │
 *   - blockInteraction (bool): si bloquea interacción con el fondo.            │
 *   - position (object): posición del modal, { top, left }.                    │
 *   - height (string): altura del modal (ej. "65%", "400px").                  │
 *   - hideInternalFooter (bool): si oculta el footer interno con botones.      │
 *                                                                              │
 * Autor: Ana Castro                                                            │
 └─────────────────────────────────────────────────────────────────────────────*/

import { Modal } from "../commons/modals/Modal";
import { ButtonClose } from "../commons/buttons/ButtonClose";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";

export const InfoModal = ({
    isOpen,
    onClose,
    onNeverShowAgain,
    children,
    backdropBlur = true,
    blockInteraction = true,
    position = { top: "50%", left: "50%" },
    height = "auto",
    hideInternalFooter = false,
    offset = { x: 0, y: 0 },
    onDragStart,
}) => {
    return (
        <Modal isOpen={isOpen} backdropBlur={backdropBlur} blockInteraction={blockInteraction}>
            <div
                className="absolute bg-white rounded-lg px-4 py-4 w-[93%] max-w-[500px] min-w-[280px] mx-auto
             text-sm text-gray-700 font-poppins border border-gray-300 shadow-xl"
                onMouseDown={onDragStart}
                onTouchStart={onDragStart}
                style={{
                    top: position.top,
                    left: position.left,
                    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                    height,
                    maxHeight: "80vh",
                    overflow: "auto",
                    touchAction: "none",
                }}
            >
                <ButtonClose onClick={onClose} />

                <div className="mt-8 text-base font-poppins mb-10">{children}</div>

                {!hideInternalFooter && (
                    <label className="bg-transparent text-red-400 fixed bottom-4 right-4 text-base flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" onClick={onNeverShowAgain} className="accent-red-400" />
                        No mostrar más
                    </label>
                )}
            </div>
        </Modal>
    );
};
