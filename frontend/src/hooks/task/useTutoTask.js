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
