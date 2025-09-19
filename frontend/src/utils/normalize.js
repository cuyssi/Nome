/**──────────────────────────────────────────────────────────────────────────────┐
 * Normaliza un string para URLs o comparaciones:                                │
 *   • normalize(str)                                                            │
 *       - Quita acentos, pasa a minúsculas y reemplaza espacios por guiones.    │
 *                                                                               │
 * Autor: Ana Castro                                                             │
└───────────────────────────────────────────────────────────────────────────────*/

export const normalize = (str) =>
    str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-");
