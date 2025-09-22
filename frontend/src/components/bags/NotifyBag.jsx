/**──────────────────────────────────────────────────────────────────────────────┐
 * Componente NotifyBag: revisa la URL en busca de parámetros que indiquen abrir │
 * una mochila específica automáticamente al pinchar en la notificación.         │
 *                                                                               │
 * Props:                                                                        │
 *   - onOpenBag: función que se llama con el nombre/id de la mochila a abrir.   │
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
