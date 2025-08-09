import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "favicon.png",        
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Nome olvides",
        short_name: "Nome",
        description: "Tu app PWA con React y Vite",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },          
        ],
      },
    }),
  ],
});
