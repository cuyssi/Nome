/**─────────────────────────────────────────────────────────────────────────────┐
 * Función utilitaria para inferir el tipo de tarea a partir del texto libre.   │
 * Escanea palabras clave en la cadena y devuelve la categoría correspondiente. │
 * Útil para etiquetar tareas automáticamente sin intervención manual.          │
 * Si no detecta ninguna coincidencia conocida, clasifica como "otros".         │
 *                                                                              │
 * Palabras reconocidas: "quede", "medico", "deberes", "estudiar", "trabajo".   │
 *                                                                              │
 * @author: Ana Castro                                                          │
 └─────────────────────────────────────────────────────────────────────────────*/

export const inferType = (text) => {
  if (text.includes("quede")) return "quede";
  if (text.includes("medico")) return "medico";
  if (text.includes("deberes")) return "deberes";
  if (text.includes("estudiar")) return "deberes";
  if (text.includes("trabajo")) return "trabajo";
  return "otros";
};
