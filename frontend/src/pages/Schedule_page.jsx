/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * Schedule_page: página que muestra el horario semanal y tutorial asociado.                       │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Muestra el componente `Schedule` con la vista completa del horario.                         │
 *   • Controla la visibilidad del tutorial usando `useTutoSchedule()`.                            │
 *   • Renderiza el tutorial `TutoSchedule` si corresponde.                                        │
 *                                                                                                 │
 * Hooks y componentes utilizados:                                                                 │
 *   - useTutoSchedule: hook que gestiona la visibilidad del tutorial para la página de horario.   │
 *   - Schedule: componente principal que renderiza las materias y franjas horarias.               │
 *   - TutoSchedule: modal/tutorial explicativo del horario.                                       │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   Renderiza la página de horario con el tutorial opcional.                                      │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

import { Schedule } from "../components/schedule/Schedule";
import { useTutorialStore } from "../store/useTutorialStore";
import { stepsSchedule } from "../components/tutorials/tutorials";
import { TutorialModal } from "../components/tutorials/TutorialModal";

export const Schedule_page = () => {
    const hideTutorial = useTutorialStore((state) => state.hideTutorial);
    const shouldShowTutorial = !useTutorialStore((state) => state.isHidden("schedule"));

    return (
        <div className="flex flex-col h-full items-center bg-black ">
            <h2 className="text-purple-400 font-bold font-poppins text-4xl mt-10 mb-5">Horario</h2>
            <Schedule />
            {shouldShowTutorial && (
                <TutorialModal
                    activeTab="schedule"
                    steps={stepsSchedule}
                    isOpen={shouldShowTutorial}
                    onNeverShowAgain={() => hideTutorial("schedule")}
                />
            )}
        </div>
    );
};
