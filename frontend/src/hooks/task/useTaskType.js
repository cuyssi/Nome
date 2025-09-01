export const useTaskType = () => {
    const normalizeText = (text = "") => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\b(el|la|los|las|un|una|unos|unas|de|del|al)\b/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };

    const getTaskType = (text = "") => {
        const cleaned = normalizeText(text);

        if (cleaned.includes("quede")) return "quede";
        if (cleaned.includes("medico")) return "medico";
        if (cleaned.includes("deberes") || cleaned.includes("estudiar")) return "deberes";
        if (cleaned.includes("trabajo") || cleaned.includes("reunion")) return "trabajo";

        return "otros";
    };

    return { getTaskType };
};
