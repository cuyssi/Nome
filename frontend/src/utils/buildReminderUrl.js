import { normalize } from "./normalize";

export const buildReminderUrl = (type, nameOrTitle) => {
  const baseMap = {
    bag: "/bags",
    task: "/today",
    evento: "/events", // puedes añadir más tipos si los usas
  };

  const base = baseMap[type] || "/";
  const normalized = encodeURIComponent(normalize(nameOrTitle));

  return `${base}?open=${normalized}`;
};
