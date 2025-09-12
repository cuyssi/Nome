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
                        <p>
                            Aquí se mostrarán todas tus tareas que contengan la palabra
                            <span className="italic"> “deberes”</span>...
                        </p>
                        <p className="mt-2">
                            <span className="italic text-gray-400">Ej. Deberes de matemáticas pag.143, ej: 2, 3 y 5.</span>
                        </p>
                                                
                    </>
                );
            case "trabajo":
                return (
                    <>
                        Aquí se mostrarán todas tus tareas que contengan la palabra{" "}
                        <span className="italic">"trabajo"</span>.
                        <p className="mt-2">
                            <span className="italic text-gray-400">Ej. Trabajo de ciencias sobre el sistema solar.</span>
                        </p>
                    </>
                );
            case "examenes":
                return (
                    <>
                        Aquí se agrupan tareas que contengan la palabra <span className="italic">"examen"</span>.
                        <p className="mt-2">
                            <span className="italic text-gray-400">Ej: Examen de historia el 24 de Octubre.</span>
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
