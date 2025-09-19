/**───────────────────────────────────────────────────────────────────────────────────┐
 * Componente Help: centro de ayuda interactivo con tutoriales por sección.           │
 *                                                                                    │
 * Props:                                                                             │
 *   - isOpen → controla si el modal está visible                                     │
 *   - onClose → función que cierra el modal                                          │
 *                                                                                    │
 * Estado interno:                                                                    │
 *   - activeSection → sección activa del tutorial (ej. calendar, bags, citas…)       │
 *   - activeTab → pestaña activa dentro de la sección (si aplica)                    │
 *   - stepIndex → índice del paso actual dentro de la pestaña o sección              │
 *                                                                                    │
 * Funcionalidad:                                                                     │
 *   - Muestra botones para cambiar de sección                                        │
 *   - Si la sección tiene pestañas, las muestra dinámicamente                        │
 *   - Navega entre pasos con botones "Atrás" y "Siguiente"                           │
 *   - Renderiza título y contenido del paso actual                                   │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";
import { InfoModal } from "./InfoModal";
import { stepsTasks, stepsCalendar, stepsBags, stepsDates, stepsSettings } from "./tutorials";
import { ButtonDefault } from "../commons/buttons/ButtonDefault";
import { MoveLeft } from "lucide-react";
const sections = {
    calendar: {
        label: "Calendario",
        steps: stepsCalendar,
    },

    bags: {
        label: "Mochilas",
        tabs: {
            mochilas: {
                label: "Mochilas",
                steps: stepsBags.mochilas || [],
            },
            escolar: {
                label: "Mochila escolar",
                steps: stepsBags.escolar || [],
            },
            crear: {
                label: "Crea tu mochila",
                steps: stepsBags.crear || [],
            },
            personalizar: {
                label: "Personaliza",
                steps: stepsBags.personalizar || [],
            },
            consultar: {
                label: "Consulta",
                steps: stepsBags.consultar || [],
            },
            eliminar: {
                label: "Elimina",
                steps: stepsBags.eliminar || [],
            },
        },
    },

    citas: {
        label: "Citas",
        tabs: {
            personales: {
                label: "Personales",
                steps: stepsDates.citas,
            },
            medico: {
                label: "Médicas",
                steps: stepsDates.medico || [],
            },
            otros: {
                label: "Otros",
                steps: stepsDates.otros || [],
            },
        },
    },

    deberes: {
        label: "Deberes",
        tabs: {
            deberes: {
                label: "Deberes",
                steps: stepsTasks.deberes || [],
            },
            trabajo: {
                label: "Trabajo",
                steps: stepsTasks.trabajo || [],
            },
            examen: {
                label: "Examen",
                steps: stepsTasks.examenes || [],
            },
        },
    },

    settings: {
        label: "Notificaciones",
        steps: stepsSettings,
    },
};

export const Help = ({ isOpen, onClose }) => {
    const [activeSection, setActiveSection] = useState("calendar");
    const [activeTab, setActiveTab] = useState(null);
    const [stepIndex, setStepIndex] = useState(0);

    const section = sections[activeSection];
    const isTabbed = !!section.tabs;

    const currentSteps = isTabbed ? section.tabs[activeTab]?.steps || [] : section.steps || [];

    const currentStep = currentSteps[stepIndex];

    if (!isOpen || !currentStep) return null;

    const handleNext = () => setStepIndex((i) => Math.min(i + 1, currentSteps.length - 1));

    const handlePrev = () => setStepIndex((i) => Math.max(i - 1, 0));

    const handleSectionClick = (key) => {
        setActiveSection(key);
        setStepIndex(0);
        const hasTabs = !!sections[key].tabs;
        setActiveTab(hasTabs ? Object.keys(sections[key].tabs)[0] : null);
    };

    return (
        <InfoModal isOpen={isOpen} onClose={onClose} hideInternalFooter>
            <div className="flex flex-col h-min-[65%] gap-4">
                <h2 className="text-purple-600 text-xl font-bold text-center">Centro de ayuda</h2>

                {/* Secciones principales */}
                <div className="flex justify-center gap-2 flex-wrap">
                    {Object.entries(sections).map(([key, { label }]) => (
                        <ButtonDefault
                            key={key}
                            text={label}
                            onClick={() => handleSectionClick(key)}
                            className={`text-sm px-3 py-1 ${
                                activeSection === key ? "bg-purple-400" : "bg-gray-200 text-gray-700"
                            }`}
                        />
                    ))}
                </div>

                {/* Pestañas internas si la sección tiene tabs */}
                {isTabbed && (
  <div className="mt-4 flex justify-center">
    <select
      value={activeTab}
      onChange={(e) => {
        setActiveTab(e.target.value);
        setStepIndex(0);
      }}
      className="text-sm px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      {Object.entries(section.tabs).map(([tabKey, { label }]) => (
        <option key={tabKey} value={tabKey}>
          {label}
        </option>
      ))}
    </select>
  </div>
)}


                {/* Contenido del paso actual */}
                <div className="mt-2 space-y-4">
                    {currentStep.title && (
                        <h3 className="text-purple-900 text-lg font-bold text-center">{currentStep.title}</h3>
                    )}
                    <div className="text-sm">{currentStep.content}</div>
                </div>

                {/* Navegación entre pasos */}
                <div className="flex justify-between mt-6 fixed bottom-10 w-[90%]">
                    <ButtonDefault
                        icon={<MoveLeft className="inline mr-1" />}
                        text="Atrás"
                        onClick={handlePrev}
                        disabled={stepIndex === 0}
                        className="bg-gray-200 text-gray-700 w-[7rem] hover:bg-gray-300"
                    />
                    <ButtonDefault
                        text={stepIndex === currentSteps.length - 1 ? "Cerrar" : "Siguiente"}
                        onClick={stepIndex === currentSteps.length - 1 ? onClose : handleNext}
                        className="w-[7rem]"
                    />
                </div>
            </div>
        </InfoModal>
    );
};
