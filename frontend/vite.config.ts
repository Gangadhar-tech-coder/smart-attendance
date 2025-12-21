import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      // Proxy backend endpoints to Django dev server to avoid CORS and use relative paths
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/signup': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/login': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/logout': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
