export const buildDateTimeFromManual = (date, hour) => {   
  const [day, month] = date.split('/');
  const [h, m] = hour.split(':');
  const year = new Date().getFullYear();
  const dt = new Date(year, Number(month) - 1, Number(day), Number(h), Number(m)); 
  return dt.toISOString();
};
