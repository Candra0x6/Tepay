import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import environment from "vite-plugin-environment";
import path from "path";
import tailwindcss from "@tailwindcss/vite"

const isLocal = process.env.DFX_NETWORK === "local";
const proxyTarget = isLocal ? "http://127.0.0.1:4943" : "https://icp0.io";

export default defineConfig({
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
    tailwindcss()
  ],
  envDir: "../",
  define: {
    "process.env": process.env,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      '@declarations': path.resolve(__dirname, '../src/declarations'),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
});
