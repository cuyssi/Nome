/**─────────────────────────────────────────────────────────────────────────────┐
 * Función utilitaria para normalizar el tipo de tarea a una forma estándar.   │
 * Convierte a minúsculas, elimina acentos y artículos innecesarios.            │
 * Reduce múltiples espacios y recorta bordes para asegurar limpieza textual.   │
 * Ideal para clasificar, comparar o colorear tareas sin inconsistencias.       │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

export function normalizeType(type = "") {
    return type
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\b(el|la|los|las|un|una|unos|unas)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
