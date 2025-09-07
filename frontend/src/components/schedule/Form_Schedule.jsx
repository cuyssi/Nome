import { useState } from "react";
import { AVAILABLE_COLORS } from "../../utils/constants";

export const Form_Schedule = ({ subject, day, hour, onSubmit, onClose }) => {
  const [name, setName] = useState(subject?.name || "");
  const [selectedColor, setSelectedColor] = useState(subject?.color || AVAILABLE_COLORS[0].value);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ day, hour, name, color: selectedColor });
      }}
      className="bg-white rounded-lg shadow-lg p-6 w-80 animate-fadeIn"
    >
      <h2 className="text-xl font-bold text-center mb-4 text-purple-700">
        {subject ? "Edit Subject" : "New Subject"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="e.g., Math"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Color</label>
        <div className="flex gap-1 flex-wrap mt-2">
          {AVAILABLE_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color.value ? "border-gray-500 border-4" : "border-transparent"
              } bg-${color.value}`}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};
