/**────────────────────────────────────────────────────────────────────────────────────────────────┐
 * useTaskType: hook para determinar el tipo de una tarea según su texto.                          │
 *                                                                                                 │
 * Funcionalidad:                                                                                  │
 *   • Normaliza el texto eliminando mayúsculas, tildes y palabras vacías comunes (stopwords).     │
 *   • Reemplaza múltiples espacios por uno solo y recorta espacios al inicio y final.             │
 *   • Determina el tipo de tarea mediante palabras clave agrupadas por categoría:                 │
 *       - "quede" → "cita"                                                                        │
 *       - "medico", "especialista", "psicologo" → "medico"                                        │
 *       - "deberes", "estudiar" → "deberes"                                                       │
 *       - "trabajo", "reunion" → "trabajo"                                                        │
 *       - "examen", "preparar" → "examen"                                                         │
 *       - cualquier otro caso → "otros"                                                           │
 *                                                                                                 │
 * Devuelve:                                                                                       │
 *   - getTaskType(text): devuelve el tipo de tarea como string.                                   │
 *                                                                                                 │
 * Autor: Ana Castro                                                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────*/

export const useTaskType = () => {
  const normalizeText = (text = "") => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\b(el|la|los|las|un|una|unos|unas|de|del|al)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const keywordMap = {
    cita: ["quede"],
    medico: ["medico", "especialista", "psicologo"],
    deberes: ["deberes", "estudiar"],
    trabajo: ["trabajo", "reunion"],
    examen: ["examen", "preparar"],
  };

  const getTaskType = (text = "") => {
    const cleaned = normalizeText(text);

    for (const [type, keywords] of Object.entries(keywordMap)) {
      if (keywords.some((kw) => cleaned.includes(kw))) return type;
    }

    return "otros";
  };

  return { getTaskType };
};
