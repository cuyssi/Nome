/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente visual que muestra una ventana modal centrada en la pantalla.     │
 * Se activa cuando `isOpen` es verdadero y recibe contenido como children.     │
 * Usa fondo borroso para resaltar el contenido sin bloquear completamente.     │
 * Ideal para formularios u otros elementos interactivos flotantes.             │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { useModalStore } from "../../store/modalStore";

export const Modal = ({ children }) => {
    const { isOpen } = useModalStore();

    if (!isOpen) return null;

    return (
        <div className="flex justify-center items-center absolute z-50 w-[100%] h-[100%] backdrop-blur-sm bg-white/20">
            {children}
        </div>
    );
};
