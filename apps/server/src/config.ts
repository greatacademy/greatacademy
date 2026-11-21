// The settings of the API server, read from its environment: in the cluster from the Secret and ConfigMap of
// deploy/k8s, locally from apps/server/.env.local (docs/architecture.md §6).

import type { VoiceConfig } from "@ga/api";

import type { AppleKeys } from "./apple.ts";
import type { EmailSettings } from "./email.ts";
import type { R2Bucket } from "./forms.ts";
import type { StripeKeys } from "./stripe.ts";

/** Config is everything the server reads from its environment. */
export interface Config {
  /** port is where the server listens. */
  readonly port: number;
  /**
   * siteUrl is the site's origin, such as https://greatacademy.dev, under whose /api the API is served: better-auth's
   * base, every request's origin and the links of emails.
   */
  readonly siteUrl: string;
  /**
   * otherOrigins are origins trusted besides the site's, such as a phone's http://192.168.1.20:4700 in development,
   * where an app packaged for the phone calls the site by this machine's address.
   */
  readonly otherOrigins: readonly string[];
  /** databaseUrl is the PostgreSQL connection string. */
  readonly databaseUrl: string;
  /** authSecret signs better-auth sessions. */
  readonly authSecret: string;
  /** aiKeysSecret encrypts AI vendors' API keys; without it nothing is judged by a model. */
  readonly aiKeysSecret: string | undefined;
  readonly email: EmailSettings;
  /** forms is the R2 bucket of guardians' signed forms; without it they are kept in memory, as in development. */
  readonly forms: R2Bucket | undefined;
  /** stripe is the Stripe account; without it billing is off and anyone can study (docs/billing.md §3, §6). */
  readonly stripe: StripeKeys | undefined;
  /** apple is the App Store Server API's in-app purchase key; without it the iOS app sells nothing (docs/billing.md §8). */
  readonly apple: AppleKeys | undefined;
  /** voice is the voice service of English; without it no conversation is offered. */
  readonly voice: VoiceConfig | undefined;
}

/** Env is an environment of strings, as process.env is. */
export type Env = Readonly<Record<string, string | undefined>>;

/** readConfig reads the configuration from env; it throws on a missing required setting. */
export function readConfig(env: Env): Config {
  const value = (name: string) => {
    const v = env[name]?.trim();
    return v === "" ? undefined : v;
  };
  const required = (name: string) => {
    const v = value(name);
    if (v === undefined) throw new Error(`${name} is not set`);
    return v;
  };
  const accountId = value("CLOUDFLARE_ACCOUNT_ID");
  const emailToken = value("CLOUDFLARE_EMAIL_TOKEN");
  const r2Key = value("R2_ACCESS_KEY_ID");
  const r2Secret = value("R2_SECRET_ACCESS_KEY");
  const stripeSecret = value("STRIPE_SECRET_KEY");
  const stripeWebhook = value("STRIPE_WEBHOOK_SECRET");
  const appleKeyId = value("APPLE_IAP_KEY_ID");
  const appleIssuer = value("APPLE_IAP_ISSUER_ID");
  const appleKey = value("APPLE_IAP_KEY");
  const voiceUrl = value("VOICE_URL");
  const voiceKey = value("VOICE_TICKET_PRIVATE_KEY");
  const voiceCredential = value("VOICE_SERVICE_CREDENTIAL");
  return {
    port: Number(value("PORT") ?? "8080"),
    siteUrl: new URL(required("SITE_URL")).origin,
    otherOrigins: (value("OTHER_ORIGINS") ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter((o) => o !== "")
      .map((o) => new URL(o).origin),
    databaseUrl: required("DATABASE_URL"),
    authSecret: required("BETTER_AUTH_SECRET"),
    aiKeysSecret: value("AI_KEYS_SECRET"),
    email: {
      provider: value("EMAIL_PROVIDER"),
      resendApiKey: value("RESEND_API_KEY"),
      cloudflare: accountId && emailToken ? { accountId, token: emailToken } : undefined,
      from: value("EMAIL_FROM") ?? "Great Academy <noreply@mail.greatacademy.dev>",
    },
    forms:
      accountId && r2Key && r2Secret
        ? { accountId, bucket: value("GUARDIAN_FORMS_BUCKET") ?? "ga-guardian-forms", accessKeyId: r2Key, secretAccessKey: r2Secret }
        : undefined,
    stripe:
      stripeSecret && stripeWebhook
        ? { secret: stripeSecret, webhook: stripeWebhook, wallet: value("STRIPE_WALLET") === "on", tax: value("STRIPE_TAX") === "on" }
        : undefined,
    apple: appleKeyId && appleIssuer && appleKey ? { keyId: appleKeyId, issuerId: appleIssuer, privateKey: appleKey } : undefined,
    voice: voiceUrl && voiceKey && voiceCredential ? { url: voiceUrl, privateKey: voiceKey, credential: voiceCredential } : undefined,
  };
}
