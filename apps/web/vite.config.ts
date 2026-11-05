import { cloudflare } from "@cloudflare/vite-plugin";
import { gatewayWorker, shardWorkers } from "@ga/math-workers/workers";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 5173 },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      // In development the subject Workers run alongside the web Worker; in production they are deployed on their own.
      auxiliaryWorkers: [gatewayWorker, ...shardWorkers].map((config) => ({ config, devOnly: true })),
    }),
    tailwindcss(),
    tanstackStart(),
    react(),
  ],
});
