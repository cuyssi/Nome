import { useState, useEffect } from "react";
import { useTutorialStore } from "../../store/useTutorialStore";

export const useTutoHome = () => {
  const { isHidden, hideTutorial } = useTutorialStore();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const hideKey = "hideTutorial_home";
    const shouldShow = localStorage.getItem(hideKey) !== "true";
    setShowModal(shouldShow);
  }, []);

  const shouldShowTutorial = !isHidden("home") && showModal;

  return { shouldShowTutorial, setShowModal, hideTutorial };
};
