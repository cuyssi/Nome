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
 *   - hideInternalFooter (bool): si oculta el footer interno con botones.      │
 *                                                                              │
 * Autor: Ana Castro                                                            │
 └─────────────────────────────────────────────────────────────────────────────*/

import { Modal } from "../commons/Modal";
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
    hideInternalFooter = false,
}) => {
    return (
        <Modal isOpen={isOpen} backdropBlur={backdropBlur} blockInteraction={blockInteraction}>
            <div
                className="absolute bg-white rounded-lg px-2 py-2 w-[90%] h-[65%] text-sm text-gray-700 font-poppins shadow-xl"
                style={{
                    top: position.top,
                    left: position.left,
                    transform: "translate(-50%, -50%)",
                }}
            >
                <ButtonClose onClick={onClose} />

                <div className="mb-10 mt-8 text-base font-poppins p-2">{children}</div>
                {!hideInternalFooter && (
                    <ButtonDefault
                        onClick={onNeverShowAgain}
                        text="No mostrar más"
                        className="bg-transparent text-red-400 fixed bottom-3 right-2"
                    />
                )}
            </div>
        </Modal>
    );
};
