// src/hooks/useTaskColor.js

const defaultColorMap = {
  deberes: "blue-400",
  ejercicios: "blue-400",
  estudiar: "purple-400",
  comprar: "yellow-400",
  medico: "pink-400",
  pagar: "orange-400",
  trabajo: "orange-400",
  cita: "red-400",
};

const deberesColors = ["blue-400", "purple-400", "orange-400", "pink-400"];

function getRandomColorForDeberes(subtype) {
  const hash = [...subtype].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % deberesColors.length;
  return deberesColors[index];
}

function getUserColorMap() {
  const stored = localStorage.getItem("userColorMap");
  return stored ? JSON.parse(stored) : {};
}

function setUserColorMap(map) {
  localStorage.setItem("userColorMap", JSON.stringify(map));
}

export const useTaskColor = () => {
  const getColor = (task) => {
    const type = task.type?.toLowerCase() || "";
    const subtype = task.text_raw?.toLowerCase()?.split(" ")[0] || "";

    const userMap = getUserColorMap();
    const userColor = userMap[type]?.[subtype];

    const finalColor =
      userColor ||
      (type === "deberes" ? getRandomColorForDeberes(subtype) : defaultColorMap[type]) ||
      "gray-300";

    return {
      type,
      base: finalColor,
      bg: `bg-${finalColor}`,
      border: `border-${finalColor}`,
      text: `text-${finalColor}`,
    };
  };

  return {
    getColor,
    getUserColorMap,
    setUserColorMap,
  };
};
