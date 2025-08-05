/**
 * Construye una fecha en formato ISO a partir de inputs manuales
 * de fecha (dd/mm) y hora (HH:mm). Se usa para crear una tarea.
 *
 * @param {string} date - Fecha en formato "dd/mm"
 * @param {string} hour - Hora en formato "HH:mm"
 * @returns {string} Fecha en formato ISO (toISOString)
 */

export const buildDateTimeFromManual = (date, hour) => {   
  const [day, month] = date.split('/');
  const [h, m] = hour.split(':');
  const year = new Date().getFullYear();
  const dt = new Date(year, Number(month) - 1, Number(day), Number(h), Number(m)); 
  return dt.toISOString();
};


/**
 * Verifica si una fecha dada es hoy.
 *
 * @param {string} dateString - Fecha en formato ISO
 * @returns {boolean}
 */

export const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

