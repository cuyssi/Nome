export const normalize = (str) =>
  str
    .normalize("NFD") // separa letras de sus acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
    .toLowerCase() // todo en minúsculas
    .replace(/\s+/g, "-"); // reemplaza espacios por guiones
