/**─────────────────────────────────────────────────────────────────────────────┐
 * Componente de tutorial por pasos para la pantalla principal (Home).         │
 * Muestra una secuencia de mensajes guiados para enseñar al usuario cómo usar │
 * Nome: bienvenida, grabación por voz, y visualización de tareas.             │
 * Utiliza InfoModal como contenedor visual y se activa si no está oculto.     │
 *                                                                             │
 * - Controla el flujo con estado `step`.                                      │
 * - Se puede cerrar o desactivar permanentemente.                             │
 *                                                                             │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

import { InfoModal } from "./InfoModal";
import { useTutorialStore } from "../../store/useTutorialStore";
import { useState, useEffect } from "react";
import { Bell, Mic, SquarePen, Notebook, MoveLeft, Backpack, NotebookPen } from "lucide-react";

export const TutoHome = ({ activeTab }) => {
    const { isHidden, hideTutorial } = useTutorialStore();
    const [showModal, setShowModal] = useState(true);
    const [step, setStep] = useState(0); // ← Aquí defines el paso actual
    const shouldShowTutorial = !isHidden(activeTab) && showModal;

    useEffect(() => {
        const hideKey = `hideTutorial_${activeTab}`;
        const shouldShow = localStorage.getItem(hideKey) !== "true";
        setShowModal(shouldShow);
    }, [activeTab]);

    const getModalPosition = () => {
        switch (step) {
            case 0:
                return { top: "50%", left: "50%" }; // Bienvenida
            case 1:
                return { top: "32%", left: "50%" }; // Grabación por voz
            case 2:
                return { top: "65%", left: "50%" }; // Visualización de tareas
            case 3:
                return { top: "61%", left: "50%" }; // Visualización de tareas   
            case 4:
                return { top: "62%", left: "50%" }; // Visualización de tareas       
            default:
                return { top: "78%", left: "50%" }; // Centro por defecto
        }
    };

    const getStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        <h3 className="text-purple-600 text-center text-2xl font-bold">¡Bienvenido a Nome!</h3>
                        <p>
                            Esta es tu pantalla principal. Aquí verás tus tareas, podrás grabar nuevas y acceder a todo
                            lo importante.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                            <div>
                                <Bell className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm">
                                Si no lo esta ya, activa las notificaciones pulsando en el icono.
                            </span>
                        </div>
                    </>
                );
            case 1:
                return (
                    <>
                        <h3 className="text-purple-600 text-xl text-center font-bold">Vamos a probar algo</h3>
                        <p>
                            Pulsa el botón morado <Mic className="inline w-6 h-6 text-purple-600" /> y di:
                            <span className="italic text-pink-400"> "Quedé con Marcos en las canchas a las 6"</span>.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                            <div>
                                <SquarePen className="w-6 h-6 text-blue-600" />
                            </div>
                            <span>También puedes añadir tareas manualmente tocando el lápiz</span>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3 className="text-purple-600 text-xl text-center font-bold">¡Perfecto!</h3>
                        <p>
                            Ahora podrás ver tus citas en <Notebook className="inline w-4 h-4 text-purple-600" /> (abajo a
                            la izquierda), pero espera, aún hay más, continuemos...
                        </p>
                    </>
                );
            case 3:
                return (
                              <>
                        <h3 className="text-purple-600 text-xl text-center font-bold">Organiza tus deberes</h3>
                        <p>
                            En el botón <NotebookPen className="inline text-purple-400" />"Deberes" puedes añadir tareas como “deberes”, "trabajo" o "examen". Aquí va todo lo relacionado 
                            con los trabajos escolares.
                        </p>
                    </>
                    
                );
            case 4:
                return (
                    <>
                        <h3 className="text-purple-600 text-xl text-center font-bold">Horario</h3>
                        <p>
                            Aquí podras meter tu horario de clase. La app lo consulta para 
                            avisarte con una notificación de lo que tienes que meter en la mochila <Backpack className="inline text-purple-600" /> para el día siguiente.
                        </p>
                    </>
                );
            case 5:
                return (
                    <>
                        <h3 className="text-purple-600 text-xl text-center font-bold">Tareas para hoy</h3>
                        <p className="text-sm sm:text-xs">
                            Aquí podras ver las tareas que tienes para hoy, cuales de ellas están aún pendientes y cuales están completadas.
                            Puedes pinchar en cada una de las categorias para verlas.
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
        <>
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
                position={getModalPosition()}
            >
                <div className="space-y-7">
                    {getStepContent()}
                    {renderFooterButtons()}
                </div>
            </InfoModal>
        </>
    ) : null;
};
