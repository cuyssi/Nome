import React from "react";

const DAYS = [
    { key: "L", label: "L" },
    { key: "M", label: "M" },
    { key: "X", label: "X" },
    { key: "J", label: "J" },
    { key: "V", label: "V" },
    { key: "S", label: "S" },
    { key: "D", label: "D" },
];

export const DaySelector = ({ selectedDays, setSelectedDays }) => {
    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    return (
        <div className="flex gap-2 flex-wrap mt-2">
            {DAYS.map((day) => (
                <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center 
            ${
                selectedDays.includes(day.key)
                    ? "bg-purple-500 text-white border-purple-700"
                    : "bg-gray-200 text-gray-700 border-gray-300"
            }`}
                >
                    {day.label}
                </button>
            ))}
        </div>
    );
};
