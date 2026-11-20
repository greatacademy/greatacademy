// Bundles the server into dist/server.mjs and the chunks it imports when a command needs them, which the image of
// Dockerfile runs on Node alone.

import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/main.ts",
  platform: "node",
  output: { dir: "dist", entryFileNames: "server.mjs", chunkFileNames: "chunks/[name]-[hash].mjs", format: "esm" },
});
