import { create } from "zustand";

export const useTutorialStore = create((set, get) => ({
  hiddenTutorials: {},

  isHidden: (key) => {
    const local = localStorage.getItem(`hideTutorial_${key}`);
    return local === "true" || get().hiddenTutorials[key];
  },

  hideTutorial: (key) => {
    localStorage.setItem(`hideTutorial_${key}`, "true");
    set((state) => ({
      hiddenTutorials: { ...state.hiddenTutorials, [key]: true },
    }));
  },

  resetTutorial: (key) => {
    localStorage.removeItem(`hideTutorial_${key}`);
    set((state) => ({
      hiddenTutorials: { ...state.hiddenTutorials, [key]: false },
    }));
  },
}));
