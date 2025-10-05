/**─────────────────────────────────────────────────────────────────────────────┐
 * uuid: generador universal de identificadores únicos.                         │
 *                                                                              │
 * Funcionalidad:                                                               │
 *   • Usa `crypto.randomUUID()` si está disponible (browsers modernos).         │
 *   • Fallback manual si el navegador no soporta `crypto.randomUUID`.           │
 *   • Devuelve un string UUID v4 compatible (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxx).│
 *                                                                              │
 * Uso:                                                                         │
 *   import { uuid } from "@/utils/uuid";                                       │
 *   const id = uuid();                                                         │
 *                                                                              │
 * Autor: Ana Castro                                                            │
 ─────────────────────────────────────────────────────────────────────────────*/
export const uuid = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback para navegadores antiguos o WebView
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
