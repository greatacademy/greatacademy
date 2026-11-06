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
      // The gateway Worker of each subject, from apps/<subject>-workers; see docs/architecture.md.
      SUBJECT_MATH: bindings.worker({ worker: "ga-math" }),
      // Signs better-auth sessions; locally from .dev.vars.
      BETTER_AUTH_SECRET: bindings.secret(),
      // Sends password resets and address verification through Resend; locally, empty logs the links instead.
      RESEND_API_KEY: bindings.secret(),
      EMAIL_FROM: bindings.secret(),
    },
  },
});
