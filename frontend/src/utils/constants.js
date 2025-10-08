/**────────────────────────────────────────────────────────────────────┐
 * Constantes que se utilizan en diferentes partes de la app.          │
 *  -AVAILABLE_TYPES: distintos tipos usados por la app.               │
 *  -AVAILABLE_COLORS: Guia para colores dinámicos.                    │
 *  -getDragColor: Determinar color de fondo según el desplazamiento X │ 
 *  -PREDEFINED_BAGS: Datos para mochilas predefinidas.                │
 *  -FULL_DAYS: Días de la semana usados por la app.                   │      
 *                                                                     │
 * Autor: Ana Castro                                                   │
└─────────────────────────────────────────────────────────────────────*/

export const AVAILABLE_TYPES = ["deberes", "trabajo", "examen", "médicos", "cita", "otros"];

export const AVAILABLE_COLORS = [
    { value: "red-400", label: "Rojo" },
    { value: "blue-400", label: "Azul" },
    { value: "yellow-400", label: "Amarillo" },
    { value: "purple-400", label: "Morado" },
    { value: "pink-400", label: "Rosa" },
    { value: "orange-400", label: "Naranja" },
    { value: "gray-300", label: "Gris" },
    { value: "green-400", label: "Verde" },
    { value: "stone-600", label: "Marrón" },
    { value: "cyan-600", label: "Cian" },
    { value: "teal-400", label: "Verde azulado" },
];

export const getDragColor = (dragOffset) => {
    if (dragOffset > 120) return "bg-red-900";
    if (dragOffset > 80) return "bg-red-500";
    if (dragOffset > 0) return "bg-red-400";
    if (dragOffset < -120) return "bg-yellow-900";
    if (dragOffset < -80) return "bg-yellow-500";
    if (dragOffset < 0) return "bg-yellow-200";
    return "bg-gray-400";
};

export const PREDEFINED_BAGS = [
    {
        name: "Gimnasio",
        color: "orange-400",
        type: "personalizada",
        items: ["Toalla", "Ropa cambio", "Neceser", "Zapatillas", "Botella agua"],
        notifyDays: ["L", "M", "X", "J", "V"],
        notifyTime: "20:00",
    },
    {
        name: "Playa",
        color: "yellow-400",
        type: "personalizada",
        items: ["Crema solar", "Bañador", "Toalla", "Chanclas"],
        notifyDays: ["L", "M", "X", "J", "V"],
        notifyTime: "20:00",
    },
    {
        name: "Piscina",
        color: "blue-400",
        type: "personalizada",
        items: ["Gorro", "Bañador", "Gafas", "Toalla", "Chanclas"],
        notifyDays: ["L", "M", "X", "J", "V"],
        notifyTime: "20:00",
    },
];

export const FULL_DAYS = {
    L: "Lunes",
    M: "Martes",
    X: "Miércoles",
    J: "Jueves",
    V: "Viernes",
    S: "Sábado",
    D: "Domingo",
};

export const DAYS = [
    { key: "L", label: "L" },
    { key: "M", label: "M" },
    { key: "X", label: "X" },
    { key: "J", label: "J" },
    { key: "V", label: "V" },
    { key: "S", label: "S" },
    { key: "D", label: "D" },
];

export const DAYS_TO_NUMBER = {
    L: 0,
    M: 1,
    X: 2,
    J: 3,
    V: 4,
    S: 5,
    D: 6,
};

export const FULL_WEEKDAYS_NUM = [0, 1, 2, 3, 4];

export const DAYS_INDEX_TO_KEY = ["D", "L", "M", "X", "J", "V", "S"];

export const DEFAULT_HOURS = ["08:15", "09:10", "10:05", "11:00", "11:30", "12:25", "13:20"];
