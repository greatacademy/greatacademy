import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "ga-web",
    compatibilityDate: "2026-10-23",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "@tanstack/react-start/server-entry",
    observability: { enabled: true },
    env: {
      // Postgres through Hyperdrive; locally, the OrbStack database of compose.yaml.
      HYPERDRIVE: bindings.hyperdrive({
        id: "00000000000000000000000000000000",
        dev: { connectionString: "postgres://postgres:postgres@localhost:54329/greatacademy" },
      }),
      // Signs better-auth sessions; locally from .dev.vars.
      BETTER_AUTH_SECRET: bindings.secret(),
    },
  },
});
