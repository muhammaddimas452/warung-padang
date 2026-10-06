import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Ini penting agar bisa diakses dari jaringan luar (Ngrok)
    allowedHosts: [".ngrok-free.app"], // Izinkan semua subdomain Ngrok
  },
});
