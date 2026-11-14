import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { resolve } from "node:path";
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

/**
 * illustrationAssets copies the web files of each subject's illustrations, content/<subject>/illustrations/*.webp,
 * into public/illustrations/<subject>, so that the Worker serves them to the web pages and the native apps.
 */
function illustrationAssets(): Plugin {
  return {
    name: "illustration-assets",
    buildStart() {
      rmSync("public/illustrations", { recursive: true, force: true });
      for (const subject of readdirSync("../../content")) {
        const folder = `../../content/${subject}/illustrations`;
        if (!existsSync(folder)) continue;
        mkdirSync(`public/illustrations/${subject}`, { recursive: true });
        for (const file of readdirSync(folder).filter((f) => f.endsWith(".webp")))
          cpSync(`${folder}/${file}`, `public/illustrations/${subject}/${file}`);
      }
    },
  };
}

/**
 * audioFiles links public/audio/<subject> to the recordings made on this machine, content/<subject>/audio/files, so
 * that Vite serves them in development; a build leaves them out, since the Worker serves them from R2.
 */
function audioFiles(): Plugin {
  let serving = false;
  return {
    name: "audio-files",
    configResolved(config) {
      serving = config.command === "serve";
    },
    buildStart() {
      rmSync("public/audio", { recursive: true, force: true });
      if (!serving) return;
      for (const subject of readdirSync("../../content")) {
        const folder = `../../content/${subject}/audio/files`;
        if (!existsSync(folder)) continue;
        mkdirSync("public/audio", { recursive: true });
        symlinkSync(resolve(folder), `public/audio/${subject}`, "dir");
      }
    },
  };
}

export default defineConfig({
  // DEV_HOST=0.0.0.0 lets a phone on the same network reach the dev server; the voice service in
  // compose reaches it as host.docker.internal.
  server: { port: 5173, host: process.env.DEV_HOST, allowedHosts: ["host.docker.internal"] },
  plugins: [
    embedAssets(),
    illustrationAssets(),
    audioFiles(),
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
