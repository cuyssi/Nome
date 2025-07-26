const COLOR_POOL = ["blue-400", "purple-400", "orange-400", "pink-400", "red-400", "teal-400", "green-400"];

let colorIndex = 0;
export const getTaskColor = () => {
    const assignColor = () => {
        const color = COLOR_POOL[colorIndex];
        colorIndex = (colorIndex + 1) % COLOR_POOL.length;
        return color;
    };
    return { assignColor, COLOR_POOL };
};
