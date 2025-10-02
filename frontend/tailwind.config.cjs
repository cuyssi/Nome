module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    safelist: [
        "bg-red-400",
        "bg-blue-400",
        "bg-yellow-400",
        "bg-purple-400",
        "bg-pink-400",
        "bg-orange-400",
        "bg-gray-300",
        "bg-green-400",
        "bg-green-500",
        "border-red-400",
        "border-blue-400",
        "border-yellow-400",
        "border-purple-400",
        "border-pink-400",
        "border-orange-400",
        "border-gray-300",
        "border-green-400",
        "bg-stone-600",
        "bg-cyan-600",
        "bg-teal-400",
        "border-stone-600",
        "border-cyan-600",
        "border-teal-400",
    ],

    theme: {
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
        extend: {
            colors: {
                bg: 'var(--color-bg)',
                text: 'var(--color-text)',
                bg_button: 'var(--color-bg_button)',
                toogle: 'var(--color-toogle)',
                border_toogle: 'var(--color-border_toogle)',
                tabs: 'var(--color-tabs)',
                text_tabs: 'var(--color-text_tabs)',                
            },
            fontFamily: {
                neon: ["Neon Tubes", "sans-serif"],
                poppins: ["Poppins", "sans-serif"],
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(-6px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                bounceStrong: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(-80%)" },
                },
            },
            animation: {
                fadeIn: "fadeIn 0.5s ease-out forwards",
                bounceStrong: "bounceStrong 1.5s infinite",
            },
        },
    },
};
