import { InfoModal } from "./InfoModal";
import { useTutorialStore } from "../../store/useTutorialStore";
import { useState, useEffect } from "react";

export const TutoTasks = ({ activeTab }) => {
  const { isHidden, hideTutorial } = useTutorialStore();
  const [showModal, setShowModal] = useState(true);

  const shouldShowTutorial = !isHidden(activeTab) && showModal;

  useEffect(() => {
    const hideKey = `hideTutorial_${activeTab}`;
    const shouldShow = localStorage.getItem(hideKey) !== "true";
    setShowModal(shouldShow);
  }, [activeTab]);

  const getContent = () => {
    switch (activeTab) {
      case "deberes":
        return (
          <>
          <h3 className="text-purple-600 text-center text-2xl font-bold mb-4">Deberes</h3>
            <p>
              Aquí se mostrarán todas tus tareas que contengan la palabra{" "}
              <span className="italic">“deberes”</span>...
            </p>
            <p className="mt-2 mb-10">
              <span className="italic text-gray-400">
                Ej. Deberes de matemáticas pag.143, ej: 2, 3 y 5.
              </span>
            </p>
                        <button
                    onClick={() => setShowModal(false)}
                    className="absolute mt-4 right-4 bottom-12 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Terminar tutorial
                </button>
          </>
        );
      case "trabajo":
        return (
          <>
            <h3 className="text-purple-600 text-center text-2xl font-bold mb-4">Trabajos</h3>
            <p>Aquí se mostrarán todas tus tareas que contengan la palabra{" "}
            <span className="italic">"trabajo"</span>.</p>
            <p className="mt-4 mb-10">
              <span className="italic text-gray-400">
                Ej. Trabajo de ciencias sobre el sistema solar.
              </span>
            </p>
                        <button
                    onClick={() => setShowModal(false)}
                    className="absolute mt-4 right-4 bottom-12 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Terminar tutorial
                </button>
          </>
        );
      case "examenes":
        return (
          <>
            <h3 className="text-purple-600 text-center text-2xl font-bold mb-4">Exámenes</h3>
            <p>Aquí se agrupan tareas que contengan la palabra{" "}
            <span className="italic">"examen"</span>.</p>
            <p className="mt-4 mb-12">
              <span className="italic text-gray-400">
                Ej: Examen de historia el 24 de Octubre.
              </span>
            </p>
            <button
                    onClick={() => setShowModal(false)}
                    className="absolute mt-4 right-4 bottom-12 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Terminar tutorial
                </button>
          </>
        );
      default:
        return <>Información no disponible para esta pestaña.</>;
    }
  };

  return shouldShowTutorial ? (
    <InfoModal
      activeTab={activeTab}
      isOpen={shouldShowTutorial}
      onClose={() => setShowModal(false)}
      onNeverShowAgain={() => {
        hideTutorial(activeTab);
        setShowModal(false);
      }}
    >
      {getContent()}
    </InfoModal>
  ) : null;
};
