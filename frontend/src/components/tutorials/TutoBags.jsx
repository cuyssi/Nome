import { InfoModal } from "../tutorials/InfoModal";
import { useTutoBags } from "../../hooks/bag/useTutoBags";
import { useState } from "react";
import { Backpack, Plus, Pencil, Trash2, CheckSquare, MoveLeft } from "lucide-react";

export const TutoBags = () => {
  const { shouldShowTutorial, setShowModal, hideTutorial } = useTutoBags();
  const [step, setStep] = useState(0);

  const getModalPosition = () => {
    switch (step) {
      case 0: return { top: "50%", left: "50%" };
      case 1: return { top: "60%", left: "50%" };
      case 2: return { top: "56%", left: "50%" };
      case 3: return { top: "56%", left: "50%" };
      case 4: return { top: "57%", left: "50%" };
      case 5: return { top: "56%", left: "50%" };
      default: return { top: "50%", left: "50%" };
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h3 className="text-purple-600 text-xl text-center font-bold">Mochilas</h3>
            <p>
            En esta sección puedes crear mochilas personalizadas para organizar lo que necesitas
            preparar. Añade los elementos que quieras y configura una notificación para que la app
            te recuerde cuándo debes hacerla y que elementos debe de llevar, asegurándote de no
            olvidar nada importante.
            </p>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-purple-600 text-xl text-center font-bold">Mochila escolar</h3>
            <p>
              Se genera automáticamente cada día con tus asignaturas del día siguiente que añadiste al horario.
              Puedes editarla, añadir mas elementos, cambiar el color o la hora de la notificación.
            </p>           
          </>
        );  
      case 2:
        return (
          <>
            <h3 className="text-purple-600 text-xl text-center font-bold">Crea tu mochila</h3>
            <p>
              Pulsa <span className="font-bold text-purple-400">“Crear mochila”</span> para crear mochilas nuevas, hay algunas predefinidas: playa, gimnasio, piscina… o crea una personalizada.
            </p>            
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-purple-600 text-xl text-center font-bold">Personaliza tus mochilas</h3>
            <p>
              Desliza una mochila a la izquierda para editarla: cambia el color, la hora de notificación, o ajusta los elementos que contiene.
            </p>           
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-purple-600 text-xl text-center font-bold">Consulta y marca tareas</h3>
            <p>
              Pulsa una mochila para abrirla. Verás los elementos que contiene y podrás marcarlos como completados con el sistema de checks.
            </p>
          </>
        );
      case 5:
        return (
          <>
            <h3 className="text-purple-600 text-xl text-center font-bold">Elimina mochilas</h3>
            <p>
              Si ya no necesitas una mochila, deslízala a la derecha para borrarla. Puedes crear nuevas en cualquier momento.
            </p>
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

            {step < 5 ? (
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

  return shouldShowTutorial ? (
    <InfoModal
      activeTab="bags"
      isOpen={shouldShowTutorial}
      onClose={() => setShowModal(false)}
      onNeverShowAgain={() => {
        hideTutorial("bags");
        setShowModal(false);
      }}
      backdropBlur={false}
      blockInteraction={false}
      position={getModalPosition()}
    >
      <div className="space-y-6">
        {getStepContent()}
        {renderFooterButtons()}
      </div>
    </InfoModal>
  ) : null;
};
