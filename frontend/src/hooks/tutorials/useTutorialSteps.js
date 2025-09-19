/**───────────────────────────────────────────────────────────────────────────────────┐
 * useTutorialSteps: hook para gestionar pasos de un tutorial de forma sencilla       │
 *                                                                                    │
 * Funcionalidad:                                                                     │
 *   • Mantiene el estado del paso actual dentro de un conjunto de pasos.             │
 *   • Proporciona métodos para avanzar, retroceder, reiniciar y consultar            │
 *     el paso actual y si es el último.                                              │
 *   • Protege contra pasos fuera de rango usando `safeStep`.                         │
 *                                                                                    │
 * Props:                                                                             │
 *   - steps: array de objetos que representan los pasos del tutorial.                │
 *            Cada paso puede contener propiedades como title, content,               │
 *            position, etc.                                                          │
 *                                                                                    │
 * Devuelve:                                                                          │
 *   - step: índice seguro del paso actual.                                           │
 *   - currentStep: objeto del paso actual, extendido con `step`.                     │
 *   - nextStep: función para avanzar al siguiente paso.                              │
 *   - prevStep: función para retroceder al paso anterior.                            │
 *   - resetStep: función para reiniciar el tutorial al primer paso.                  │
 *   - isLastStep: booleano que indica si el paso actual es el último.                │
 *                                                                                    │
 * Uso típico:                                                                        │
 *   const { currentStep, nextStep, prevStep, isLastStep } = useTutorialSteps(steps); │
 *                                                                                    │
 * Autor: Ana Castro                                                                  │
└────────────────────────────────────────────────────────────────────────────────────*/

import { useState } from "react";

export const useTutorialSteps = (steps = []) => {
  const [step, setStep] = useState(0);

  const safeStep = Math.min(step, steps.length - 1);
  const currentStep = steps[safeStep] ? { ...steps[safeStep], step: safeStep } : null;

  const nextStep = () => {
    if (safeStep < steps.length - 1) setStep(safeStep + 1);
  };

  const prevStep = () => {
    if (safeStep > 0) setStep(safeStep - 1);
  };

  const resetStep = () => setStep(0);
  const isLastStep = safeStep === steps.length - 1;

  return { step: safeStep, currentStep, nextStep, prevStep, resetStep, isLastStep };
};
