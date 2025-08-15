import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { buildDateTimeFromManual } from "../../utils/dateUtils";
import { v4 as uuidv4 } from "uuid";

const tiposDisponibles = ["deberes", "trabajo", "medico", "cita", "otro"];
const coloresDisponibles = [
  { value: "red-400", label: "Rojo" },
  { value: "blue-400", label: "Azul" },
  { value: "yellow-400", label: "Amarillo" },
  { value: "purple-400", label: "Morado" },
  { value: "pink-400", label: "Rosa" },
  { value: "orange-400", label: "Naranja" },
  { value: "gray-300", label: "Gris" },
  { value: "green-400", label: "Verde" },
];

// Genera intervalos de 5 min
const generarHoras = () => {
  const result = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      result.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return result;
};
const horasDisponibles = generarHoras();

export function Form({ task, onClose, onSubmit }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    date: "",
    hour: "",
    color: coloresDisponibles[0].value,
    type: tiposDisponibles[0],
  });

  // Convierte dd/MM o YYYY-MM-DD a formato ISO para input date
  const parseFechaParaInput = (fechaStr) => {
    if (!fechaStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) return fechaStr;
    if (/^\d{1,2}\/\d{1,2}$/.test(fechaStr)) {
      const [d, m] = fechaStr.split("/").map(Number);
      const year = new Date().getFullYear();
      return `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    return "";
  };

  useEffect(() => {
    if (task) {
      setFormData({
        text: task.text || task.text_raw || "",
        date: parseFechaParaInput(task.date),
        hour: task.hour || "00:00",
        color: task.color || coloresDisponibles[0].value,
        type: task.type || tiposDisponibles[0],
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const normalizarFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split("-");
    return `${Number(day)}/${Number(month)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let dateTime = null;
    try {
      dateTime = buildDateTimeFromManual(formData.date, formData.hour);
    } catch (err) {
      console.error("Error al construir dateTime:", err, formData.date, formData.hour);
      return;
    }

    const finalTask = task?.id
      ? {
          ...task,
          text: formData.text,
          text_raw: formData.text,
          date: normalizarFecha(formData.date),
          hour: formData.hour,
          color: formData.color,
          type: formData.type,
          dateTime,
        }
      : {
          id: uuidv4(),
          completed: false,
          text: formData.text,
          text_raw: formData.text,
          date: normalizarFecha(formData.date),
          hour: formData.hour,
          color: formData.color,
          type: formData.type,
          dateTime,
        };

    onSubmit(finalTask);
    setShowConfirmation(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <form className="relative bg-white rounded-xl p-6 w-[90%] h-[62%]">
      {showConfirmation && (
        <p className="text-green-600 text-center mb-3 font-semibold">
          ✅ Cambios guardados con éxito
        </p>
      )}

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-red-900 hover:text-red-700"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="flex flex-col gap-3 text-gray-900 mt-4">
        <label>
          Texto:
          <input
            name="text"
            value={formData.text}
            onChange={handleChange}
            className="border border-blue-400 rounded-lg w-full p-1"
          />
        </label>

        <label>
          Fecha:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border w-full border-blue-400 rounded-lg p-1"
          />
        </label>

        <label>
          Hora:
          <select
            name="hour"
            value={formData.hour}
            onChange={handleChange}
            className="border w-full border-blue-400 rounded-lg p-1"
          >
            {horasDisponibles.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>

        <label>
          Color:
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="border w-full border-blue-400 rounded-lg p-1"
          >
            {coloresDisponibles.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tipo:
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border w-full border-blue-400 rounded-lg p-1"
          >
            {tiposDisponibles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-1 rounded mt-4"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
