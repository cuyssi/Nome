import { InfoModal } from "./InfoModal";
import { useTutoSchedule } from "../../hooks/schedule/useTutoSchedule";
import { useState } from "react";
import { CalendarDays, Plus, BookOpenText, Pencil, Trash2, Backpack, MoveLeft } from "lucide-react";

export const TutoSchedule = () => {
  const { shouldShowTutorial, setShowModal, hideTutorial } = useTutoSchedule();
  const [step, setStep] = useState(0);

  const getModalPosition = () => {
    switch (step) {
      case 0: return { top: "40%", left: "50%" };
      case 1: return { top: "55%", left: "50%" };
      case 2: return { top: "65%", left: "50%" };
      case 3: return { top: "50%", left: "50%" };
      case 4: return { top: "45%", left: "50%" };      
      default: return { top: "50%", left: "50%" };
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <h3 className="text-purple-600 text-center text-2xl font-bold">Tu horario escolar</h3>
            <p className="text-justify">
              Aquí puedes configurar tus clases por día y hora. Así Nome sabrá qué asignaturas tienes cada jornada.
              Añade tu horario de clase.
            </p>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Añadir horas</h3>
            <p className="text-justify">
              Usa el botón <span className="font-bold text-purple-400">“➕ Add hour”</span> para definir los bloques que necesitas.
            </p>
            <div className="mt-4 flex items-center gap-2 justify-center text-sm text-gray-600">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>Ejemplo: 08:30, 10:15, etc.</span>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Asignar asignaturas</h3>
            <p className="text-justify">
              Haz clic en una celda para asignar una asignatura. Puedes elegir el nombre y el color para identificarla fácilmente.
            </p>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Editar o eliminar</h3>
            <p className="text-justify">
              Pulsa sobre una asignatura para editarla. También puedes eliminar horas con el botón “➖ Remove hour”.
            </p>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-purple-600 text-center text-xl font-bold">Tu mochila se prepara sola</h3>
            <p className="text-justify">
              Nome consulta tu horario para preparar automáticamente la mochila escolar del día siguiente. ¡Así no se te olvida nada!
            </p>
            <div className="mt-4 flex items-center gap-2 justify-center text-sm text-gray-600">
              <Backpack className="w-5 h-5 text-purple-500" />
              <span>Funciona con la sección Mochilas</span>
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

  return shouldShowTutorial ? (
    <InfoModal
      activeTab="schedule"
      isOpen={shouldShowTutorial}
      onClose={() => setShowModal(false)}
      onNeverShowAgain={() => {
        hideTutorial("schedule");
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
