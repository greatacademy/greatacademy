import { bindings, defineConfig, triggers } from "cf/config";

export default defineConfig({
  worker: {
    name: "ga-web",
    compatibilityDate: "2026-10-23",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint: "./src/server.ts",
    observability: { enabled: true },
    domains: ["greatacademy.dev"],
    // Near PostgreSQL in Hillsboro, since a request makes several queries (docs/architecture.md §6).
    placement: { region: "aws:us-west-2" },
    // The retention run of docs/minors-data.md §10 and the plan reminders of docs/billing.md §3, once a day
    // (DAILY_CRON in src/server/handler.ts), and the AI cost check of docs/admin.md §5 every quarter hour.
    triggers: [triggers.scheduled({ schedule: "0 3 * * *" }), triggers.scheduled({ schedule: "*/15 * * * *" })],
    env: {
      // Postgres through Hyperdrive, which reaches pg-cluster through the Tunnel of deploy/postgres; locally, the
      // OrbStack database of compose.yaml.
      HYPERDRIVE: bindings.hyperdrive({
        id: "45b55d1646e34061b2ef0711d43f35cb",
        dev: { connectionString: "postgres://postgres:postgres@localhost:54329/greatacademy" },
      }),
      // The gateway Worker of each subject, from apps/<subject>-workers; see docs/architecture.md.
      SUBJECT_MATH: bindings.worker({ worker: "ga-math" }),
      SUBJECT_ENGLISH: bindings.worker({ worker: "ga-english" }),
      // Signs better-auth sessions; locally from .dev.vars.
      BETTER_AUTH_SECRET: bindings.secret(),
      // EMAIL_PROVIDER lists the email services to try in order: "cloudflare" (Cloudflare Email Service through
      // EMAIL), "resend", or "cloudflare,resend" to fall back on a rate limit or an outage. Empty means Resend when
      // RESEND_API_KEY is set; locally, with neither, the links are logged instead.
      EMAIL_PROVIDER: bindings.secret(),
      RESEND_API_KEY: bindings.secret(),
      // Remote in development too, so that EMAIL_PROVIDER=cloudflare in .dev.vars sends real email; the sending
      // subdomain mail.greatacademy.dev is onboarded to Email Service.
      EMAIL: bindings.sendEmail({ dev: { remote: true } }),
      // The sender, "Great Academy <noreply@mail.greatacademy.dev>", verified with the chosen service.
      EMAIL_FROM: bindings.secret(),
      // Guardians' signed forms, kept only until an administrator decides.
      GUARDIAN_FORMS: bindings.r2({ name: "ga-guardian-forms" }),
      // Encrypts AI vendors' API keys; the database never sees it. Locally from .dev.vars.
      AI_KEYS_SECRET: bindings.secret(),
      // The Stripe account; without its key billing is off and anyone can study (docs/billing.md §3, §6).
      STRIPE_SECRET_KEY: bindings.secret(),
      STRIPE_WEBHOOK_SECRET: bindings.secret(),
      // "on" once Alipay and WeChat Pay are turned on in the account.
      STRIPE_WALLET: bindings.secret(),
      // "on" turns on Stripe Tax for card plans.
      STRIPE_TAX: bindings.secret(),
      // The voice service of English (deploy/voice): the Ed25519 key that signs its tickets, PKCS #8 in base64url,
      // whose public half is VOICE_TICKET_PUBLIC_KEY in each overlay's config.env, and the credential it presents.
      VOICE_TICKET_PRIVATE_KEY: bindings.secret(),
      VOICE_SERVICE_CREDENTIAL: bindings.secret(),
      // The voice service's WebSocket, such as wss://voice.greatacademy.dev/v1/conversation; without the three, no
      // conversation is offered.
      VOICE_URL: bindings.secret(),
      // The App Store Server API's in-app purchase key; without it the iOS app sells nothing (docs/billing.md §8).
      APPLE_IAP_KEY_ID: bindings.secret(),
      APPLE_IAP_ISSUER_ID: bindings.secret(),
      // The key's .p8 file, PEM.
      APPLE_IAP_KEY: bindings.secret(),
    },
  },
});
