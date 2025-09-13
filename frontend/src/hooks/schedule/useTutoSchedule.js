import { useState, useEffect } from "react";
import { useTutorialStore } from "../../store/useTutorialStore";

export const useTutoSchedule = () => {
  const { isHidden, hideTutorial } = useTutorialStore();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const hideKey = "hideTutorial_schedule";
    const shouldShow = localStorage.getItem(hideKey) !== "true";
    setShowModal(shouldShow);
  }, []);

  const shouldShowTutorial = !isHidden("schedule") && showModal;

  return { shouldShowTutorial, setShowModal, hideTutorial };
};
