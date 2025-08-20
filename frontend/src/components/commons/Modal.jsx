/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente visual que muestra una ventana modal centrada en la pantalla.     │
 * Se activa cuando `isOpen` es verdadero y recibe contenido como children.     │
 * Usa fondo borroso para resaltar el contenido sin bloquear completamente.     │
 * Ideal para formularios u otros elementos interactivos flotantes.             │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

export const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm">
        {children}
      </div>
    </div>
  );
};



