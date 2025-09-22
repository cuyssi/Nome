import { useEffect, useState } from "react";

/**─────────────────────────────────────────────────────────────────────────────┐
 * Hook usePointerOverlay: calcula posición para PointerOverlay.                │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Si se pasa un selector → busca el elemento y calcula posición relativa.  │
 *   • Si se pasa un objeto con top/left → lo usa directamente.                 │
 *   • Devuelve: { top, left, transform } listo para pasar al componente.       │
 *                                                                              │
 * Autor: Ana Castro                                                            │
└──────────────────────────────────────────────────────────────────────────────*/

export const usePointerOverlay = (highlight = {}) => {
  const { position = {}, transform, animationClass } = highlight;

  if (!position.top || !position.left) return null;

  return {
    top: position.top,
    left: position.left,
    transform: transform || position.transform || "translate(-50%, -100%)",
    animationClass,
  };
};

