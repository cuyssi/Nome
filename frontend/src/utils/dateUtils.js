export const buildDateTimeFromManual = (date, hour) => {   
  const [day, month] = date.split('/');
  const [h, m] = hour.split(':');
  const year = new Date().getFullYear();
  const dt = new Date(year, Number(month) - 1, Number(day), Number(h), Number(m)); 
  return dt.toISOString();
};

export const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

