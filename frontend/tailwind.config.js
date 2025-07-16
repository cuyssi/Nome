/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-red-400", "bg-blue-400", "bg-yellow-400", "bg-purple-400",
    "bg-pink-400", "bg-orange-400", "bg-gray-300",
    "border-red-400", "border-blue-400", "border-yellow-400",
    "border-purple-400", "border-pink-400", "border-orange-400", "border-gray-300"
  ],
  theme: {
    extend: {
      fontFamily: {
        neon: ['Neon Tubes', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
