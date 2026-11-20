import { defineConfig } from "vitest/config";

// The tests run the built shards in Node, without the Cloudflare plugin of vite.config.ts.
export default defineConfig({ test: { include: ["scripts/**/*.test.ts"] } });
