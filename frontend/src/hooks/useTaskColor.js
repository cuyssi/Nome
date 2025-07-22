/**─────────────────────────────────────────────────────────────────────────────────┐
 * Hook que asigna colores dinámicos a tareas según su tipo o subtipo.              │
 * Usa un mapa por defecto y genera colores aleatorios para subtareas de deberes    │
 * Permite personalizar y guardar preferencias de color por usuario en localStorage.│
 * Devuelve clases tailwind listas para aplicar en estilo visual de la tarjeta.     │
 *                                                                                  │
 * @author: Ana Castro                                                              │
 └─────────────────────────────────────────────────────────────────────────────────*/

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
            userColor || (type === "deberes" ? getRandomColorForDeberes(subtype) : defaultColorMap[type]) || "gray-300";

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
