import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    base: "/",
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg", "favicon.ico","favicon.png", "robots.txt", "apple-touch-icon.png"],
            manifest: {
                name: "Nome - Tareas por Voz",
                short_name: "Nome",
                description: "Tu asistente de tareas con voz",
                theme_color: "#000000",
                background_color: "#000000",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/pwa-icon-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    build: {
        assetsDir: "assets",
        rollupOptions: {
            output: {
                assetFileNames: "assets/[name][extname]",
            },
        },
    },
});
