/**──────────────────────────────────────────────────────────────────────────────┐
 * Componente NotifyBag: revisa la URL en busca de parámetros que indiquen abrir │
 * una mochila específica automáticamente al cargar la página.                   │
 *                                                                               │
 * Props:                                                                        │
 *   - onOpenBag: función que se llama con el nombre/id de la mochila a abrir.   │
 *                                                                               │
 * Funcionamiento:                                                               │
 *   • Usa useLocation() de react-router-dom para obtener la URL actual.         │
 *   • Busca el parámetro "open" en la query string.                             │
 *   • Si existe y onOpenBag está definido, llama a onOpenBag(openBag).          │
 *   • No renderiza nada visualmente (retorna null).                             │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const NotifyBag = ({ onOpenBag }) => {
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const openBag = params.get("open");

        if (openBag && onOpenBag) {
            console.log("🔍 Abriendo desde URL:", openBag);
            onOpenBag(openBag);
        }
    }, [location]);

    return null;
};
