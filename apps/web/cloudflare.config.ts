import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "ga-web",
    compatibilityDate: "2026-10-23",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "./src/server.ts",
    observability: { enabled: true },
    domains: ["greatacademy.dev"],
    env: {
      // The bucket of the site's public files, each kind under its own prefix: the recordings of passages read aloud,
      // made and uploaded by tools/audio, at audio/<subject>/<name>.mp3 (docs/content.md).
      BUCKET: bindings.r2({ name: "greatacademy" }),
    },
  },
});
