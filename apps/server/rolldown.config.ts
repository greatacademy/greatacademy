// Bundles the server into dist/server.mjs, which the image of Dockerfile runs on Node alone.

import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/main.ts",
  platform: "node",
  output: { file: "dist/server.mjs", format: "esm", codeSplitting: false },
});
