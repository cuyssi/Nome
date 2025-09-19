/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useTutoTask: hook para gestionar la visibilidad del tutorial de tareas según la pestaña activa. │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Lee de localStorage si el tutorial de la pestaña actual ha sido ocultado previamente.       │
 *   • Combina este estado con el store `useTutorialStore` para determinar si se debe mostrar.     │
 *   • Permite ocultar o mostrar el modal del tutorial dinámicamente.                              │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   - shouldShowTutorial: boolean indicando si se debe mostrar el tutorial.                       │
 *   - setShowModal: función para cambiar manualmente la visibilidad del modal.                    │
 *   - hideTutorial: función del store para marcar el tutorial como oculto permanentemente.        │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/


import { useState, useEffect } from "react";
import { useTutorialStore } from "../../store/useTutorialStore";

export const useTutoTask = (activeTab) => {
  const { isHidden, hideTutorial } = useTutorialStore();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const hideKey = `hideTutorial_${activeTab}`;
    const shouldShow = localStorage.getItem(hideKey) !== "true";
    setShowModal(shouldShow);
  }, [activeTab]);

  const shouldShowTutorial = !isHidden(activeTab) && showModal;

  return { shouldShowTutorial, setShowModal, hideTutorial };
};
