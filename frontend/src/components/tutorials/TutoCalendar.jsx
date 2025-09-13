import { InfoModal } from "./InfoModal";
import { useState } from "react";
import { CalendarDays, Pencil, CheckSquare, Repeat, MoveLeft } from "lucide-react";

export const TutoCalendar = ({ activeTab, setShowModal, hideTutorial }) => {
  const [step, setStep] = useState(0);

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h3 className="text-purple-600 text-center text-2xl font-bold">Tu calendario</h3>
            <p className="text-justify">
              Aquí puedes ver tus tareas organizadas por día. Los puntos de color verde o rojo indican si todas las tareas están completadas.
            </p>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Consulta tus tareas</h3>
            <p className="text-justify">
              Haz clic en cualquier día para ver sus tareas. Se abrirá un panel donde puedes editarlas, marcarlas como hechas o eliminarlas.
            </p>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Crear o editar tareas</h3>
            <p className="text-justify">
              Pulsa <span className="font-bold text-purple-400">“Nueva tarea”</span> para añadir una. También puedes editar una existente con el icono <Pencil className="inline w-4 h-4 text-blue-400" />.
            </p>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Marca como completada</h3>
            <p className="text-justify">
              Marca una tarea como hecha con el icono ✓. El punto del calendario se volverá verde si todas están completadas.
            </p>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Repeticiones inteligentes</h3>
            <p className="text-justify">
              Las tareas pueden repetirse: diariamente, entre semana o en días personalizados. Nome las mostrará automáticamente según tu configuración.
            </p>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-600">
              <Repeat className="w-5 h-5 text-yellow-500" />
              <span>Ideal para rutinas y hábitos</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderFooterButtons = () => (
        <div className="flex justify-between items-center">
            {step > 0 ? (
                <button
                    onClick={() => setStep(step - 1)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    <MoveLeft className="inline" /> Atrás
                </button>
            ) : (
                <div />
            )}

            {step < 4 ? (
                <button
                    onClick={() => setStep(step + 1)}
                    className="px-3 py-1 bg-purple-400 text-white rounded hover:bg-purple-600"
                >
                    Siguiente
                </button>
            ) : (
                <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Terminar tutorial
                </button>
            )}
        </div>
    );

  return (
    <InfoModal
      activeTab={activeTab}
      isOpen={true}
      onClose={() => setShowModal(false)}
      onNeverShowAgain={() => {
        hideTutorial(activeTab);
        setShowModal(false);
      }}
      backdropBlur={false}
      blockInteraction={false}
      position={{ top: "50%", left: "50%" }}
    >
      <div className="space-y-6">
        {getStepContent()}
        {renderFooterButtons()}
      </div>
    </InfoModal>
  );
};
