import { cpSync, mkdirSync } from "node:fs";
import { cloudflare } from "@cloudflare/vite-plugin";
import { gatewayWorker as englishGateway, shardWorkers as englishShards } from "@ga/english-workers/workers";
import { gatewayWorker as mathGateway, shardWorkers as mathShards } from "@ga/math-workers/workers";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * embedAssets copies what the native apps' web views load (KaTeX's stylesheet
 * and fonts, and MathLive) into public/embed, so that the Worker serves them.
 */
function embedAssets(): Plugin {
  return {
    name: "embed-assets",
    buildStart() {
      mkdirSync("public/embed", { recursive: true });
      cpSync("node_modules/katex/dist/katex.min.css", "public/embed/katex.min.css");
      cpSync("node_modules/katex/dist/fonts", "public/embed/fonts", { recursive: true });
      cpSync("node_modules/mathlive/mathlive.min.js", "public/embed/mathlive.min.js");
    },
    // public/_headers does this in production: a sandboxed web view has no origin, and fonts need CORS.
    configureServer(server) {
      server.middlewares.use("/embed", (_req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
      });
    },
  };
}

export default defineConfig({
  // DEV_HOST=0.0.0.0 lets a phone on the same network reach the dev server.
  server: { port: 5173, host: process.env.DEV_HOST },
  plugins: [
    embedAssets(),
    cloudflare({
      viteEnvironment: { name: "ssr" },
      // In development the subject Workers run alongside the web Worker; in production they are deployed on their own.
      auxiliaryWorkers: [mathGateway, ...mathShards, englishGateway, ...englishShards].map((config) => ({ config, devOnly: true })),
    }),
    tailwindcss(),
    tanstackStart(),
    react(),
  ],
});
