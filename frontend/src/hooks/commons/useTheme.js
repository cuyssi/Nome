/**─────────────────────────────────────────────────────────────────────────────
 * useTheme: hook para gestionar el modo de tema (claro/oscuro) de la aplicación.
 *
 * Funcionalidad:
 *   • Lee y aplica el tema actual desde `localStorage` al iniciar la app.
 *   • Añade o elimina las clases `dark` y `light` en el elemento raíz (`<html>`).
 *   • Actualiza dinámicamente el tema cuando cambia el estado.
 *   • Persiste la preferencia del usuario entre sesiones.
 *
 * Parámetros:
 *   — No recibe parámetros.
 *
 * Devuelve:
 *   • theme: string con el tema actual ("light" o "dark").
 *   • setTheme: función para cambiar el tema manualmente.
 *
 * Autor: Ana Castro
 ─────────────────────────────────────────────────────────────────────────────*/

import { useState, useEffect } from "react";

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    return { theme, setTheme };
}
