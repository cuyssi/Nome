import { InfoModal } from "./InfoModal";
import { useTutorialStore } from "../../store/useTutorialStore";
import { useState, useEffect } from "react";
import { MoveLeft, CalendarHeart, Pencil, Trash2, CheckSquare } from "lucide-react";

export const TutoDates = ({ activeTab }) => {
  const { isHidden, hideTutorial } = useTutorialStore();
  const [showModal, setShowModal] = useState(true);
  const [step, setStep] = useState(0);

  const shouldShowTutorial = !isHidden(activeTab) && showModal;

  useEffect(() => {
    const hideKey = `hideTutorial_${activeTab}`;
    const shouldShow = localStorage.getItem(hideKey) !== "true";
    setShowModal(shouldShow);
  }, [activeTab]);

  const getSteps = () => {
    switch (activeTab) {
      case "citas":
        return [
          {
            title: "Citas personales",
            content: (
              <div className="text-justify">
                Aquí se mostrarán todas tus citas que contengan expresiones como{" "}
                <span className="italic text-purple-600">“quedé”, “me veré con”, “tengo una cita con”</span>.
                <div className="italic text-gray-400 text-sm mt-4">
                  Ej. Mañana quedé con Marcos a las cinco y media de la tarde en la plaza.
                </div>
              </div>
            ),
          },
          {
            title: "Cómo gestionar tus citas",
            content: (
              <div className="text-justify">
                Desliza hacia la izquierda para <span className="text-orange-400">editar</span>, hacia la derecha para{" "}
                <span className="text-red-600">eliminar</span>. Mantén pulsado para marcar como{" "}
                <span className="text-green-400">completada</span>.
                <div className="mt-4">
                  Al editar, puedes cambiar el color, la fecha, la hora, configurar repeticiones o ajustar la notificación.
                </div>
              </div>
            ),
          },
        ];
      case "medico":
        return [
          {
            title: "Citas médicas",
            content: (
              <div className="text-justify">
                Aquí se mostrarán tus tareas que contengan la palabra{" "}
                <span className="italic text-purple-600">“médico”</span>.
                <div className="italic text-gray-400 text-sm mt-4">
                  Ej. Tengo cita con el médico el día 24 a las ocho y media de la mañana.
                </div>
              </div>
            ),
          },
        ];
      case "otros":
        return [
          {
            title: "Otros",
            content: (
              <div className="text-justify">
                Aquí se agrupan tareas que no encajan en ninguna categoría específica.
                <div className="italic text-gray-400 text-sm mt-4">Ej. Comprar bolígrafos de punta fina.</div>
              </div>
            ),
          },
        ];
      default:
        return [
          {
            title: "Información no disponible",
            content: <div className="text-justify">Esta pestaña no tiene contenido de tutorial por ahora.</div>,
          },
        ];
    }
  };

  const steps = getSteps();
  const safeStep = Math.min(step, steps.length - 1); // Evita crash si el step se sale

  const renderFooterButtons = () => (
    <div className="flex justify-between items-center mt-6">
      {safeStep > 0 ? (
        <button
          onClick={() => setStep(safeStep - 1)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mt-6"
        >
          <MoveLeft className="inline mr-1" /> Atrás
        </button>
      ) : (
        <div />
      )}

      {safeStep < steps.length - 1 ? (
        <button
          onClick={() => setStep(safeStep + 1)}
          className="px-3 py-1 bg-purple-400 text-white rounded hover:bg-purple-600"
        >
          Siguiente
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mt-6"
          >
            Terminar tutorial
          </button>
        </div>
      )}
    </div>
  );

  return shouldShowTutorial && steps[safeStep] ? (
    <InfoModal
      activeTab={activeTab}
      isOpen={shouldShowTutorial}
      onClose={() => setShowModal(false)}
      onNeverShowAgain={() => {
        hideTutorial(activeTab);
        setShowModal(false);
      }}
      backdropBlur={false}
      blockInteraction={false}
      position={{ top: "50%", left: "50%" }}
    >
      <div className="space-y-4">
        <h3 className="text-purple-600 text-xl font-bold text-center">{steps[safeStep].title}</h3>
        {steps[safeStep].content}
        {renderFooterButtons()}
      </div>
    </InfoModal>
  ) : null;
};
