import { useState, useEffect } from "react";
import { useTutorialStore } from "../../store/useTutorialStore";

export const useTutoCalendar = () => {
  const { isHidden, hideTutorial } = useTutorialStore();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const hideKey = "hideTutorial_calendar";
    const shouldShow = localStorage.getItem(hideKey) !== "true";
    setShowModal(shouldShow);
  }, []);

  const shouldShowTutorial = !isHidden("calendar") && showModal;

  return { shouldShowTutorial, setShowModal, hideTutorial };
};
