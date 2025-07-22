/**─────────────────────────────────────────────────────────────────────────────┐
 * Función para asignar color visual a tareas según palabras clave en el texto. │
 * Utiliza expresiones regulares para buscar coincidencias en el contenido.     │
 * Devuelve clases tailwind (bg, border, text) basadas en color aleatorio.      │
 * Asigna por defecto una paleta "otros" si no se encuentra coincidencia.       │
 * Ideal para destacar tareas por contexto visual sin depender del tipo directo.│
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

export function getTaskColor(text) {
    const lower = text?.toLowerCase() || "";
    const allColors = ["blue-400", "purple-400", "orange-400", "pink-400"];
    const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
    const colorMap = {
        quede: randomColor,
        deberes: randomColor,
        ejercicios: randomColor,
        estudiar: randomColor,
        comprar: randomColor,
        medico: randomColor,
        pagar: randomColor,
        trabajo: randomColor,
        otros: randomColor,
    };

    const keywords = Object.keys(colorMap);
    for (const keyword of keywords) {
        const re = new RegExp(`\\b${keyword}\\b`, "i");
        if (re.test(lower)) {
            return {
                type: keyword,
                base: colorMap[keyword],
                bg: `bg-${colorMap[keyword]}`,
                border: `border-${colorMap[keyword]}`,
                text: `text-${colorMap[keyword]}`,
            };
        }
    }

    return {
        type: "otros",
        base: "green-400",
        bg: "bg-blue-200",
        border: "border-green-300",
        text: "text-gray-300",
    };
}
