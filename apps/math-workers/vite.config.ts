import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

import { shardWorkers } from "./workers.ts";

export default defineConfig({
  plugins: [cloudflare({ auxiliaryWorkers: shardWorkers.map((config) => ({ config })) })],
});
