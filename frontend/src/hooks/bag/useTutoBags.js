import { useState, useEffect } from "react";
import { useTutorialStore } from "../../store/useTutorialStore";

export const useTutoBags = () => {
  const { isHidden, hideTutorial } = useTutorialStore();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const hideKey = "hideTutorial_bags";
    const shouldShow = localStorage.getItem(hideKey) !== "true";
    setShowModal(shouldShow);
  }, []);

  const shouldShowTutorial = !isHidden("bags") && showModal;

  return { shouldShowTutorial, setShowModal, hideTutorial };
};
