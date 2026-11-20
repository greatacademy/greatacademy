// The API: better-auth, the Connect services, the Stripe and App Store notifications and the voice service's calls,
// with every subject compiled in this process (docs/architecture.md §6).

import { createConnectRouter, createContextValues } from "@connectrpc/connect";
import { type UniversalHandler, universalServerRequestFromFetch, universalServerResponseToFetch } from "@connectrpc/connect/protocol";
import {
  type AppStore,
  accountService,
  accountsKey,
  adminService,
  applyBillingEvent,
  billingService,
  type ConversationDeps,
  catalogService,
  conversationService,
  dbKey,
  endPlansOf,
  type FormStore,
  handleVoice,
  learningService,
  localGateway,
  type Notify,
  type Payments,
  privacyService,
  Registry,
  recordApple,
  runBillingReminders,
  runCostCheck,
  runEssays,
  runRetention,
  userIdKey,
  VOICE_PREFIX,
} from "@ga/api";
import type { CompiledSubject } from "@ga/content";
import { type Db, localeOfEmail, setUserLocale } from "@ga/db";
import { AccountService } from "@ga/proto/account/v1/account_pb";
import { AdminService } from "@ga/proto/admin/v1/admin_pb";
import { BillingService } from "@ga/proto/billing/v1/billing_pb";
import { CatalogService } from "@ga/proto/catalog/v1/catalog_pb";
import { ConversationService } from "@ga/proto/conversation/v1/conversation_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";
import { PrivacyService } from "@ga/proto/privacy/v1/privacy_pb";

import { appStore, notifiedTransaction } from "./apple.ts";
import { childAccounts, createAuth } from "./auth.ts";
import type { Config } from "./config.ts";
import { emailSender, type SendEmail } from "./email.ts";
import { r2Forms } from "./forms.ts";
import { readWebhook, stripePayments, WebhookError } from "./stripe.ts";
import { alarmEmail, billingEmail, privacyEmail, requestLocale } from "./templates.ts";

/** RPC_PREFIX is where the Connect services are mounted. */
export const RPC_PREFIX = "/api/rpc";

/** WEBHOOK is where the Stripe account sends its events. */
const WEBHOOK = "/api/stripe";

/** APPLE_NOTIFICATIONS is where App Store Server Notifications V2 arrive. */
const APPLE_NOTIFICATIONS = "/api/apple";

/** memoryForms keeps forms in memory, for a server without an R2 bucket, as in development. */
function memoryForms(): FormStore {
  const kept = new Map<string, Uint8Array>();
  return {
    async put(key, form) {
      kept.set(key, form);
    },
    async get(key) {
      return kept.get(key);
    },
    async delete(key) {
      kept.delete(key);
    },
  };
}

/** Services are what the API and the scheduled jobs share: the database, the subjects and the outside services. */
export interface Services {
  readonly config: Config;
  readonly db: Db;
  readonly registry: Registry;
  readonly forms: FormStore;
  readonly mail: SendEmail;
  readonly notify: Notify;
  readonly payments: Payments | undefined;
  readonly appStore: AppStore | undefined;
}

/** openServices opens the registry of the subjects and the links to the outside services, all once per process. */
export async function openServices(config: Config, db: Db, subjects: readonly CompiledSubject[]): Promise<Services> {
  const registry = await Registry.open(subjects.map(localGateway));
  const mail = emailSender(config.email);
  const notify: Notify = async (to, kind) => {
    try {
      await mail(privacyEmail(to, kind, (await localeOfEmail(db, to)) ?? "en"));
    } catch (e) {
      // A failure to tell someone does not undo what happened.
      console.error(`privacy notice ${kind} failed`, e instanceof Error ? e.message : "");
    }
  };
  return {
    config,
    db,
    registry,
    forms: config.forms ? r2Forms(config.forms) : memoryForms(),
    mail,
    notify,
    payments: config.stripe ? stripePayments(config.stripe) : undefined,
    appStore: config.apple ? appStore(config.apple) : undefined,
  };
}

/** Api answers a request to the API. */
export type Api = (request: Request) => Promise<Response>;

/**
 * createApi builds the routing table once and serves /api: better-auth under /api/auth, the Connect services under
 * /api/rpc and the notifications of Stripe and the App Store; and the voice service's calls under /voice/v1.
 */
export function createApi(services: Services): Api {
  const { config, db, registry, payments, notify, forms } = services;
  const billing = payments !== undefined;
  const judging = config.aiKeysSecret ? { judging: { aiKeysSecret: config.aiKeysSecret } } : {};
  const router = createConnectRouter();
  router.service(CatalogService, catalogService(registry));
  router.service(AccountService, accountService({ registry, now: Date.now }));
  router.service(
    LearningService,
    learningService({ registry, now: Date.now, seed: () => Math.floor(Math.random() * 0x7fffffff), billing, ...judging }),
  );
  router.service(PrivacyService, privacyService({ now: Date.now, forms, notify, billing }));
  router.service(
    BillingService,
    billingService({
      registry,
      now: Date.now,
      ...(payments && { payments }),
      ...(services.appStore && { appStore: services.appStore }),
    }),
  );
  router.service(AdminService, adminService({ now: Date.now, forms, notify, aiKeysSecret: config.aiKeysSecret ?? "", registry }));
  const conversations: ConversationDeps = { registry, now: Date.now, billing, ...(config.voice && { voice: config.voice }), ...judging };
  router.service(ConversationService, conversationService(conversations));
  const handlers: ReadonlyMap<string, UniversalHandler> = new Map(router.handlers.map((h) => [h.requestPath, h]));
  const endPlans = async (userId: string) => {
    if (payments) await endPlansOf(db, payments, userId, Date.now());
  };
  const auth = createAuth(db, config.authSecret, config.siteUrl, services.mail, endPlans);
  const accounts = childAccounts(auth, db);

  return async (request) => {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith(VOICE_PREFIX)) return handleVoice(request, db, conversations);
    if (pathname === WEBHOOK) return webhook(services, request);
    if (pathname === APPLE_NOTIFICATIONS) return appleNotification(services, request);
    if (pathname.startsWith("/api/auth/")) return auth.handler(request);
    if (!pathname.startsWith(`${RPC_PREFIX}/`)) return new Response("Not Found", { status: 404 });
    const handler = handlers.get(pathname.slice(RPC_PREFIX.length));
    if (!handler) return new Response("Not Found", { status: 404 });
    const session = await auth.api.getSession({ headers: request.headers });
    // The language a person uses is the one their scheduled email is written in.
    const locale = requestLocale(request.headers);
    if (session && locale && session.user.locale !== locale) await setUserLocale(db, session.user.id, locale);
    const req = universalServerRequestFromFetch(request, {});
    req.contextValues = createContextValues().set(dbKey, db).set(userIdKey, session?.user.id).set(accountsKey, accounts);
    return universalServerResponseToFetch(await handler(req));
  };
}

/** webhook records a Stripe event; a failure answers 500 so that Stripe sends it again. */
async function webhook({ config, db, payments }: Services, request: Request): Promise<Response> {
  if (request.method !== "POST" || !config.stripe) return new Response("Not Found", { status: 404 });
  try {
    for (const e of await readWebhook(config.stripe, request)) await applyBillingEvent(db, e, Date.now(), payments);
    return new Response("ok");
  } catch (e) {
    if (e instanceof WebhookError) return new Response("Bad Request", { status: 400 });
    console.error("stripe webhook failed", e instanceof Error ? e.message : "");
    return new Response("Internal Server Error", { status: 500 });
  }
}

/** appleNotification records the transaction an App Store notification is about; a failure answers 500 so that Apple sends it again. */
async function appleNotification({ db, appStore: store, payments }: Services, request: Request): Promise<Response> {
  if (request.method !== "POST" || !store) return new Response("Not Found", { status: 404 });
  const id = notifiedTransaction(await request.json().catch(() => undefined));
  // A notification without a transaction, as Apple's test, needs nothing.
  if (!id || !/^\d{1,32}$/.test(id)) return new Response("ok");
  try {
    await recordApple(db, store, id, Date.now(), payments);
    return new Response("ok");
  } catch (e) {
    console.error("App Store notification failed", e instanceof Error ? e.message : "");
    return new Response("Internal Server Error", { status: 500 });
  }
}

/** Job is a scheduled job: the daily retention run and plan reminders, or the quarter-hourly cost check and essays. */
export type Job = "daily" | "quarter";

/** isJob tells a job's name from any other string. */
export const isJob = (name: string | undefined): name is Job => name === "daily" || name === "quarter";

/**
 * runJob runs the daily retention rules of docs/minors-data.md §10 and plan reminders of docs/billing.md §3, or, every
 * quarter hour, the cost check of docs/admin.md §5 and the judgments of submitted essays. The CronJobs of deploy/k8s
 * run it.
 */
export async function runJob(services: Services, job: Job, at: number): Promise<void> {
  const { db, mail, config } = services;
  if (job === "quarter") {
    const raised = await runCostCheck(db, at, async (to, alarm) => mail(alarmEmail(to, alarm, (await localeOfEmail(db, to)) ?? "en")));
    if (raised.length > 0) console.log("cost alarms", JSON.stringify(raised.map((a) => `${a.target}: ${a.detail}`)));
    if (config.aiKeysSecret) {
      const seed = () => Math.floor(Math.random() * 0x7fffffff);
      console.log("essays", JSON.stringify(await runEssays(db, services.registry, { aiKeysSecret: config.aiKeysSecret }, at, seed)));
    }
    return;
  }
  const result = await runRetention(db, at, { forms: services.forms, notify: services.notify });
  console.log("retention run", JSON.stringify(result));
  if (services.payments) {
    const reminder = async (to: string, kind: Parameters<typeof billingEmail>[1]) => {
      try {
        await mail(billingEmail(to, kind, (await localeOfEmail(db, to)) ?? "en"));
      } catch (e) {
        // The next period tries again.
        console.error(`billing reminder ${kind} failed`, e instanceof Error ? e.message : "");
      }
    };
    console.log("billing reminders", await runBillingReminders(db, at, reminder));
  }
}
