import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
    brotliSize: false,
  },
  server: {
    compress: true,
  },
});
