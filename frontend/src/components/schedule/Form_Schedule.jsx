import React, { useState } from "react";
import { AVAILABLE_COLORS } from "../../utils/constants";

export const Form_Schedule = ({ subject, dia, hora, onSubmit, onClose }) => {
  const [nombre, setNombre] = useState(subject?.nombre || "");
  const [color, setColor] = useState(subject?.color || "#FFFFFF");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre no puede estar vacío.");
    onSubmit({ dia, hora, nombre, color });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-80 animate-fadeIn">
      <h2 className="text-xl font-bold text-center mb-4 text-purple-700">
        {subject ? "Editar asignatura" : "Nueva asignatura"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Ej: Matemáticas"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <select
          name="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border w-full border-blue-400 rounded-lg p-1 font-normal"
        >
          {AVAILABLE_COLORS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Guardar
        </button>
      </div>
    </form>
  );
};
