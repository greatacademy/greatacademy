import { env, waitUntil } from "cloudflare:workers";
import { createConnectRouter, createContextValues } from "@connectrpc/connect";
import { type UniversalHandler, universalServerRequestFromFetch, universalServerResponseToFetch } from "@connectrpc/connect/protocol";
import {
  type AppStore,
  accountService,
  accountsKey,
  adminService,
  applyBillingEvent,
  billingService,
  catalogService,
  dbKey,
  endPlansOf,
  type FormStore,
  learningService,
  type Notify,
  type Payments,
  privacyService,
  Registry,
  recordApple,
  runBillingReminders,
  runRetention,
  userIdKey,
} from "@ga/api";
import type { SubjectGateway } from "@ga/content";
import { connect } from "@ga/db";
import { AccountService } from "@ga/proto/account/v1/account_pb";
import { AdminService } from "@ga/proto/admin/v1/admin_pb";
import { BillingService } from "@ga/proto/billing/v1/billing_pb";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";
import { PrivacyService } from "@ga/proto/privacy/v1/privacy_pb";
import { appStore, notifiedTransaction } from "./apple.ts";
import { childAccounts, createAuth } from "./auth.ts";
import { billingEmail, emailSender, privacyEmail } from "./email.ts";
import { readWebhook, type StripeKeys, stripePayments, WebhookError } from "./stripe.ts";

/** RPC_PREFIX is where the Connect services are mounted. */
export const RPC_PREFIX = "/api/rpc";

/** subjectGateways are the Workers serving each subject; a new subject adds its binding here. */
const subjectGateways = (): readonly SubjectGateway[] => [
  env.SUBJECT_MATH as unknown as SubjectGateway,
  env.SUBJECT_ENGLISH as unknown as SubjectGateway,
];

/** forms keeps guardians' signed forms in R2. */
const forms = (): FormStore => ({
  async put(key, form, contentType) {
    await env.GUARDIAN_FORMS.put(key, form, { httpMetadata: { contentType } });
  },
  async get(key) {
    const object = await env.GUARDIAN_FORMS.get(key);
    return object ? new Uint8Array(await object.arrayBuffer()) : undefined;
  },
  async delete(key) {
    await env.GUARDIAN_FORMS.delete(key);
  },
});

/** notify sends a privacy notice by email; a failure to tell someone does not undo what happened. */
const notify: Notify = async (to, kind) => {
  try {
    await emailSender(env.RESEND_API_KEY, env.EMAIL_FROM)(privacyEmail(to, kind));
  } catch (e) {
    console.error(`privacy notice ${kind} failed`, e instanceof Error ? e.message : "");
  }
};

/** stripeKeys are the Stripe account's secrets and settings, or undefined while billing is off. */
const stripeKeys = (): StripeKeys | undefined =>
  env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET
    ? {
        secret: env.STRIPE_SECRET_KEY,
        webhook: env.STRIPE_WEBHOOK_SECRET,
        wallet: env.STRIPE_WALLET === "on",
        tax: env.STRIPE_TAX === "on",
      }
    : undefined;

let payments: Payments | null | undefined;

/** stripe returns the link to Stripe once per isolate, or undefined while billing is off. */
const stripe = (): Payments | undefined => {
  if (payments === undefined) {
    const keys = stripeKeys();
    payments = keys ? stripePayments(keys) : null;
  }
  return payments ?? undefined;
};

/** WEBHOOK is where the Stripe account sends its events. */
const WEBHOOK = "/api/stripe";

let store: AppStore | null | undefined;

/** apple returns the link to the App Store Server API once per isolate, or undefined until its key is set. */
const apple = (): AppStore | undefined => {
  if (store === undefined)
    store =
      env.APPLE_IAP_KEY_ID && env.APPLE_IAP_ISSUER_ID && env.APPLE_IAP_KEY
        ? appStore({ keyId: env.APPLE_IAP_KEY_ID, issuerId: env.APPLE_IAP_ISSUER_ID, privateKey: env.APPLE_IAP_KEY })
        : null;
  return store ?? undefined;
};

/** APPLE_NOTIFICATIONS is where App Store Server Notifications V2 arrive. */
const APPLE_NOTIFICATIONS = "/api/apple";

let loaded: ReadonlyMap<string, UniversalHandler> | undefined;

/**
 * routes reads the subject listings and builds the routing table once per
 * isolate. Concurrent first requests each read for themselves: a promise of one
 * request must not be awaited by another, which would fail if the first is cancelled.
 */
async function routes(): Promise<ReadonlyMap<string, UniversalHandler>> {
  if (loaded) return loaded;
  const registry = await Registry.open(subjectGateways());
  if (loaded) return loaded;
  const router = createConnectRouter();
  router.service(CatalogService, catalogService(registry));
  router.service(AccountService, accountService({ registry, now: Date.now }));
  const pay = stripe();
  const billing = pay !== undefined;
  router.service(
    LearningService,
    learningService({ registry, now: Date.now, seed: () => Math.floor(Math.random() * 0x7fffffff), billing }),
  );
  router.service(PrivacyService, privacyService({ now: Date.now, forms: forms(), notify, billing }));
  const appleStore = apple();
  router.service(
    BillingService,
    billingService({ registry, now: Date.now, ...(pay && { payments: pay }), ...(appleStore && { appStore: appleStore }) }),
  );
  router.service(AdminService, adminService({ now: Date.now, forms: forms(), notify, aiKeysSecret: env.AI_KEYS_SECRET }));
  loaded = new Map(router.handlers.map((h) => [h.requestPath, h]));
  return loaded;
}

/**
 * handleApi serves /api: better-auth under /api/auth and the Connect services
 * under /api/rpc. Each request opens its own database client through
 * Hyperdrive and closes it once the response is sent.
 */
export async function handleApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const conn = connect(env.HYPERDRIVE.connectionString);
  try {
    const pay = stripe();
    if (url.pathname === WEBHOOK) return await webhook(conn.db, request);
    if (url.pathname === APPLE_NOTIFICATIONS) return await appleNotification(conn.db, request);
    const endPlans = async (userId: string) => {
      if (pay) await endPlansOf(conn.db, pay, userId, Date.now());
    };
    const auth = createAuth(conn.db, env.BETTER_AUTH_SECRET, url.origin, emailSender(env.RESEND_API_KEY, env.EMAIL_FROM), endPlans);
    if (url.pathname.startsWith("/api/auth/")) return await auth.handler(request);
    if (!url.pathname.startsWith(`${RPC_PREFIX}/`)) return new Response("Not Found", { status: 404 });
    const handler = (await routes()).get(url.pathname.slice(RPC_PREFIX.length));
    if (!handler) return new Response("Not Found", { status: 404 });
    const session = await auth.api.getSession({ headers: request.headers });
    const req = universalServerRequestFromFetch(request, {});
    req.contextValues = createContextValues()
      .set(dbKey, conn.db)
      .set(userIdKey, session?.user.id)
      .set(accountsKey, childAccounts(auth, conn.db));
    return universalServerResponseToFetch(await handler(req));
  } finally {
    waitUntil(conn.close());
  }
}

/** webhook records a Stripe event; a failure answers 500 so that Stripe sends it again. */
async function webhook(db: Parameters<typeof applyBillingEvent>[0], request: Request): Promise<Response> {
  const keys = stripeKeys();
  if (request.method !== "POST" || !keys) return new Response("Not Found", { status: 404 });
  try {
    for (const e of await readWebhook(keys, request)) await applyBillingEvent(db, e, Date.now(), stripe());
    return new Response("ok");
  } catch (e) {
    if (e instanceof WebhookError) return new Response("Bad Request", { status: 400 });
    console.error("stripe webhook failed", e instanceof Error ? e.message : "");
    return new Response("Internal Server Error", { status: 500 });
  }
}

/** appleNotification records the transaction an App Store notification is about; a failure answers 500 so that Apple sends it again. */
async function appleNotification(db: Parameters<typeof applyBillingEvent>[0], request: Request): Promise<Response> {
  const store = apple();
  if (request.method !== "POST" || !store) return new Response("Not Found", { status: 404 });
  const id = notifiedTransaction(await request.json().catch(() => undefined));
  // A notification without a transaction, as Apple's test, needs nothing.
  if (!id || !/^\d{1,32}$/.test(id)) return new Response("ok");
  try {
    await recordApple(db, store, id, Date.now(), stripe());
    return new Response("ok");
  } catch (e) {
    console.error("App Store notification failed", e instanceof Error ? e.message : "");
    return new Response("Internal Server Error", { status: 500 });
  }
}

/** remind sends a plan reminder by email; a failure is logged, and the next period tries again. */
const remind = async (to: string, kind: Parameters<typeof billingEmail>[1]) => {
  try {
    await emailSender(env.RESEND_API_KEY, env.EMAIL_FROM)(billingEmail(to, kind));
  } catch (e) {
    console.error(`billing reminder ${kind} failed`, e instanceof Error ? e.message : "");
  }
};

/** runScheduled runs the daily retention rules and plan reminders. */
export async function runScheduled(at: number): Promise<void> {
  const conn = connect(env.HYPERDRIVE.connectionString);
  try {
    const result = await runRetention(conn.db, at, { forms: forms(), notify });
    console.log("retention run", JSON.stringify(result));
    if (stripe()) console.log("billing reminders", await runBillingReminders(conn.db, at, remind));
  } finally {
    await conn.close();
  }
}
