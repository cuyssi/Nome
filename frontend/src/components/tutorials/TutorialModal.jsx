/**───────────────────────────────────────────────────────────────────────────────┐
 * Componente TutorialModal: modal para mostrar tutoriales paso a paso.           │
 *                                                                                │
 * Funcionalidad:                                                                 │
 *   • Muestra un modal flotante con pasos de tutorial (título + contenido).      │
 *   • Navegación entre pasos: "Atrás", "Siguiente" y "Terminar tutorial".        │
 *   • Permite cerrar el modal o marcar "No mostrar más" para no volver a mostrar.│
 *   • Soporta posicionamiento personalizado y desenfoque de fondo.               │
 *                                                                                │
 * Props:                                                                         │
 *   - activeTab: string → identificador de la sección activa del tutorial.       │
 *   - steps: array → lista de pasos del tutorial (title, content, position).     │
 *   - isOpen: boolean → estado inicial de visibilidad (default: true).           │
 *   - backdropBlur: boolean → si true, desenfoca el fondo del modal.             │
 *   - blockInteraction: boolean → si true, bloquea interacción con fondo.        │
 *   - onNeverShowAgain: func → callback al marcar "No mostrar más".              │
 *                                                                                │
 * Estado interno:                                                                │
 *   - visible: boolean → controla la visibilidad del modal.                      │
 *                                                                                │
 * Autor: Ana Castro                                                              │
└────────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { InfoModal } from "./InfoModal";
import { MoveLeft } from "lucide-react";
import { useTutorialSteps } from "../../hooks/tutorials/useTutorialSteps";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { PointerOverlay } from "./PointerOverlay";
import { usePointerOverlay } from "../../hooks/tutorials/usePointerOverlay.js";
import { useDraggable } from "../../hooks/tutorials/useDraggable.js";

export const TutorialModal = ({
    activeTab,
    steps = [],
    isOpen = true,
    backdropBlur = false,
    blockInteraction = false,
    onNeverShowAgain,
}) => {
    const { currentStep, nextStep, prevStep, isLastStep } = useTutorialSteps(steps);
    const [visible, setVisible] = useState(isOpen);
    const handleClose = () => setVisible(false);
    const pointer = usePointerOverlay(currentStep?.highlight || {});
    const { offset, handleStart } = useDraggable();

    const handleNeverShowAgain = () => {
        onNeverShowAgain?.();
        setVisible(false);
    };

    if (!visible || !currentStep) return null;

    return (
        <>
            {currentStep.highlight && <PointerOverlay {...pointer} />}
            <InfoModal
                activeTab={activeTab}
                isOpen={visible}
                onClose={handleClose}
                onNeverShowAgain={handleNeverShowAgain}
                backdropBlur={backdropBlur}
                blockInteraction={blockInteraction}
                position={currentStep.position || { top: "50%", left: "50%" }}
                offset={offset}
                onDragStart={handleStart}
            >
                {currentStep.title && (
                    <h3 className="text-purple-600 text-xl font-bold text-center">{currentStep.title}</h3>
                )}
                <div className="mt-6">{currentStep.content}</div>

                <div className="flex justify-between items-center mt-8">
                    {currentStep.step > 0 ? (
                        <ButtonDefault
                            icon={<MoveLeft className="inline mr-1" />}
                            text="Atrás"
                            onClick={prevStep}
                            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                        />
                    ) : (
                        <div />
                    )}

                    {!isLastStep ? (
                        <ButtonDefault onClick={nextStep} text="Siguiente" />
                    ) : (
                        <ButtonDefault
                            onClick={handleClose}
                            text="Terminar Tutorial"
                            className="bg-green-500 hover:bg-green-600"
                        />
                    )}
                </div>
            </InfoModal>
        </>
    );
};
