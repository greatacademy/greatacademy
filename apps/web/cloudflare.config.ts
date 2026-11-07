import { bindings, defineConfig, triggers } from "cf/config";

export default defineConfig({
  worker: {
    name: "ga-web",
    compatibilityDate: "2026-10-23",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "./src/server.ts",
    observability: { enabled: true },
    // The retention run of docs/minors-data.md §10, once a day.
    triggers: [triggers.scheduled({ schedule: "0 3 * * *" })],
    env: {
      // Postgres through Hyperdrive; locally, the OrbStack database of compose.yaml.
      HYPERDRIVE: bindings.hyperdrive({
        id: "00000000000000000000000000000000",
        dev: { connectionString: "postgres://postgres:postgres@localhost:54329/greatacademy" },
      }),
      // The gateway Worker of each subject, from apps/<subject>-workers; see docs/architecture.md.
      SUBJECT_MATH: bindings.worker({ worker: "ga-math" }),
      SUBJECT_ENGLISH: bindings.worker({ worker: "ga-english" }),
      // Signs better-auth sessions; locally from .dev.vars.
      BETTER_AUTH_SECRET: bindings.secret(),
      // Sends password resets and address verification through Resend; locally, empty logs the links instead.
      RESEND_API_KEY: bindings.secret(),
      EMAIL_FROM: bindings.secret(),
      // Guardians' signed forms, kept only until an administrator decides.
      GUARDIAN_FORMS: bindings.r2({ name: "ga-guardian-forms" }),
      // Encrypts AI vendors' API keys; the database never sees it. Locally from .dev.vars.
      AI_KEYS_SECRET: bindings.secret(),
    },
  },
});
