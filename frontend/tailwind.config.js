export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-red-400", "bg-blue-400", "bg-yellow-400", "bg-purple-400",
    "bg-pink-400", "bg-orange-400", "bg-gray-300", "bg-green-400",
    "border-red-400", "border-blue-400", "border-yellow-400",
    "border-purple-400", "border-pink-400", "border-orange-400", "border-gray-300", "border-green-400",
  ],
  theme: {
    extend: {
      fontFamily: {
        neon: ['Neon Tubes', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
