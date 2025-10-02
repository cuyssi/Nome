import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../hooks/commons/useTheme";

export const ButtonTheme = () => {
    const { theme, setTheme } = useTheme();
    const isLight = theme === "light";

    return (
        <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className="absolute top-3 left-3 w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 border border-border_toogle bg-toogle"
        >
            <div
                className={`absolute w-6 h-6 bg-white z-20 rounded-full shadow-md transform transition-transform duration-300 border border-border_toogle`}
                style={{ transform: isLight ? "translateX(32px)" : "translateX(0)" }}
            />
            <Sun className="absolute left-2 w-4 h-4 text-yellow-600" />
            <Moon className="absolute right-2 w-4 h-4 text-yellow-600" />
        </button>
    );
};
