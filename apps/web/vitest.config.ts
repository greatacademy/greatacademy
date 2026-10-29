import { defineConfig } from "vitest/config";

// Unit tests run in Node without the Cloudflare and TanStack Start plugins of vite.config.ts.
export default defineConfig({ test: { include: ["src/**/*.test.{ts,tsx}"] } });
