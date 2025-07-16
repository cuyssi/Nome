export function normalizeType(type = "") {
  return type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(el|la|los|las|un|una|unos|unas)\b/g, "")
    .replace(/\s+/g, " ")    
    .trim();
}