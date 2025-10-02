/**────────────────────────────────────────────────────────────────────────────────┐
 * useItems: hook para gestionar elementos (items) dentro de una mochila.          │
 *                                                                                 │
 * Funcionalidad:                                                                  │
 *   • Mantiene el estado local de los elementos marcados como “empaquetados”.     │
 *   • Permite alternar (toggle) el estado de cada elemento.                       │
 *   • Notifica al hook padre (onUpdateBag) cuando cambia el estado de empaquetado.│
 *   • Detecta si todos los elementos de la mochila han sido empaquetados.         │
 *   • Produce una vibración corta si el navegador lo soporta.                     │
 *                                                                                 │
 * Parámetros:                                                                     │
 *   - bag: objeto mochila con propiedades `items` y `packed`.                     │
 *   - onUpdateBag: función que se llama al actualizar el estado de empaquetado.   │
 *                                                                                 │
 * Devuelve:                                                                       │
 *   - allItems: todos los elementos de la mochila.                                │
 *   - localPacked: elementos actualmente marcados como empaquetados.              │
 *   - toggleItem(nombre): alterna el estado de empaquetado de un elemento.        │
 *   - isComplete: booleano indicando si todos los elementos están empaquetados.   │
 *   - packedItems: elementos empaquetados originales del bag.                     │
 *                                                                                 │
 * Autor: Ana Castro                                                               │
└─────────────────────────────────────────────────────────────────────────────────*/

import { useEffect, useState } from "react";

export const useItems = (bag, onUpdateBag) => {
    const allItems = Array.isArray(bag?.items) ? bag.items : [];
    const initialPacked = Array.isArray(bag?.packed) ? bag.packed : [];
    const [localPacked, setLocalPacked] = useState(initialPacked);

    useEffect(() => {
        setLocalPacked(initialPacked);
    }, [bag]);

    const toggleItem = (nombre) => {
        const updatedPacked = localPacked.includes(nombre)
            ? localPacked.filter((i) => i !== nombre)
            : [...localPacked, nombre];

        setLocalPacked(updatedPacked);

        if (bag) {
            onUpdateBag({
                ...bag,
                packed: updatedPacked,
            });
        }

        if (navigator.vibrate) navigator.vibrate(100);
    };

    const isComplete = allItems.length > 0 && allItems.every((item) => localPacked.includes(item));

    return {
        allItems,
        localPacked,
        toggleItem,
        isComplete,
    };
};
