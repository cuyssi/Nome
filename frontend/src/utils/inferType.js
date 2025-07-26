export const inferType = (text) => {
  if (text.includes("quede")) return "quede";
  if (text.includes("medico")) return "medico";
  if (text.includes("deberes")) return "deberes";
  if (text.includes("estudiar")) return "deberes";
  if (text.includes("trabajo")) return "trabajo";
  return "otros";
};
