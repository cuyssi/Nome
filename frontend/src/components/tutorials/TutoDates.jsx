import { InfoModal } from "./InfoModal";
import { useTutorialStore } from "../../store/useTutorialStore";
import { useState, useEffect } from "react";

export const TutoDates = ({ activeTab }) => {
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
            case "citas":
                return (
                    <>
                        <p>
                            Aquí se mostrarán todas tus citas que contengan expresiones como
                            <span className="italic text-purple-600">
                                {" "}
                                “quedé”, “me veré con”, “tengo una cita con”
                            </span>
                            ...
                        </p>

                        <p className="mt-2">
                            <span className="italic text-gray-400">
                                Ej. Mañana quedé con Marcos a las cinco y media de la tarde en la plaza.
                            </span>
                        </p>

                        <div className="mt-6 bg-purple-100 p-3 rounded text-xs text-gray-600 font-poppins">
                            <p className="text-purple-600 text-sm font-poppins font-semibold text-center mb-4">
                                Puedes interactuar con las tareas:
                            </p>
                            <p>
                                Desliza hacia la izquierda para <span className="text-orange-400">editar</span>, hacia
                                la derecha para <span className="text-red-600">eliminar</span>.
                            </p>
                            <p>
                                Mantén pulsado para marcar como<span className="text-green-400"> completada</span>.
                            </p>
                            <p className="mt-4">
                                Al editar, puedes cambiar el color, la fecha, la hora, configurar repeticiones, o
                                ajustar cuándo quieres recibir la notificación, etc...
                            </p>
                        </div>
                    </>
                );
            case "medico":
                return (
                    <>
                        <p>
                            Aquí se mostrarán tus citas que contengan la palabra{" "}
                            <span className="italic text-purple-600">"médico"</span>.
                        </p>
                        <p className="mt-2">
                            <span className="italic text-gray-400">
                                Ej. Tengo cita con el médico el día 24 a las ocho y media de la mañana.
                            </span>
                        </p>
                    </>
                );
            case "otros":
                return (
                    <>
                        <p>Aquí se agrupan tareas que no encajan en ninguna categoría específica.</p>
                        <p className="mt-2">
                            <span className="italic text-gray-400">
                                Ej.Comprar bolígrafos de punta fina. 
                            </span>
                        </p>
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
