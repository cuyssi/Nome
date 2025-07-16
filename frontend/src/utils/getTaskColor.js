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
        bg: "bg-green-300",
        border: "border-green-300",
        text: "text-gray-300",
    };
}
