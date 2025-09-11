import { normalize } from "./normalize";

export const buildReminderUrl = (type, nameOrTitle) => {
    const baseMap = {
        bag: "/bags",
        task: "/today",
        evento: "/events",
    };
    const base = baseMap[type] || "/";
    if (type === "bag" || type === "evento") {
        const normalized = encodeURIComponent(normalize(nameOrTitle));
        return `${base}?open=${normalized}`;
    }

    return base;
};
