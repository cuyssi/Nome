import { useState } from "react";

export function useScheduleHourForm(initialHour = "08:00") {
    const safeHour = initialHour || "08:00";
    const [hour, setHour] = useState(safeHour.split(":")[0]);
    const [minute, setMinute] = useState(safeHour.split(":")[1]);

    const handleChange = (field, value) => {
        if (field === "hour") setHour(value);
        if (field === "minute") setMinute(value);
    };

    const getFormattedHour = () => `${hour}:${minute}`;

    return { hour, minute, handleChange, getFormattedHour };
}
