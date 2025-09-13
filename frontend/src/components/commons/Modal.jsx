/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente visual que muestra una ventana modal centrada en la pantalla.     │
 * Se activa cuando `isOpen` es verdadero y recibe contenido como children.     │
 * Usa fondo borroso para resaltar el contenido sin bloquear completamente.     │
 * Ideal para formularios u otros elementos interactivos flotantes.             │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

export const Modal = ({
  isOpen,
  children,
  backdropBlur = true,
  blockInteraction = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute inset-0 z-50 p-4 flex justify-center items-center
        ${backdropBlur ? "backdrop-blur-sm bg-black/30" : "bg-transparent"}
        ${blockInteraction ? "" : "pointer-events-none"}`}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
};

