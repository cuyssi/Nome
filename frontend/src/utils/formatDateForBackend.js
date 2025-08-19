import { dateAndTime } from "./transcriptionUtils";

export const formatDateForBackend = (date) => {
    const { dateWithYear, hour } = dateAndTime(date);
    const [day, month, year] = dateWithYear.split("/");
    const [hours, minutes] = hour.split(":");

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
};
