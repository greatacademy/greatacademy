import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import { t } from "@ga/content";
import {
  addPlan,
  approveByPayment,
  coveringScopes,
  customerOf,
  type Db,
  emailOf,
  endPlan,
  extendPlan,
  firstPayment,
  guardedLearners,
  hasPaid,
  isGuardian,
  learnerAge,
  learnerFor,
  markPlanReminded,
  markRefunded,
  type PaymentAccount,
  type PlanInterval,
  type PlanRow,
  planByCheckout,
  planById,
  planByStripe,
  plansOfLearner,
  plansOfPayer,
  plansToRemind,
  recordPayment,
  setCancelled,
  walletPlanToExtend,
} from "@ga/db";
import { Account, type BillingService, Interval } from "@ga/proto/billing/v1/billing_pb";

import { dbKey, userIdKey } from "./context.ts";
import { text } from "./convert.ts";
import type { Registry } from "./registry.ts";

const DAY = 86_400_000;

/** ALL_SUBJECTS is the scope of the bundle that covers every subject. */
export const ALL_SUBJECTS = "all";

/** PRICES are the plans' prices in US cents, per learner (docs/billing.md §1). */
export const PRICES = {
  subject: { month: 1900, year: 19900 },
  all: { month: 4900, year: 49900 },
} as const;

/** REFUND_WINDOW is how long a plan's first payment can be refunded. */
export const REFUND_WINDOW = 30 * DAY;

/** REMIND_BEFORE is how long before a plan ends its payer is told. */
export const REMIND_BEFORE = 7 * DAY;

/** priceOf returns the price of a scope for an interval, in cents. */
export function priceOf(scope: string, interval: PlanInterval): number {
  return (scope === ALL_SUBJECTS ? PRICES.all : PRICES.subject)[interval];
}

/** addInterval adds a calendar month or year to a time, in UTC; a day past the new month's end falls back to its last day. */
export function addInterval(ms: number, interval: PlanInterval): number {
  const d = new Date(ms);
  const months = interval === "year" ? 12 : 1;
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d.getUTCDate(), last));
  target.setUTCHours(d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
  return target.getTime();
}

/** covers tells whether a set of scopes lets a learner study a subject. */
export function covers(scopes: readonly string[], subjectId: string): boolean {
  return scopes.includes(ALL_SUBJECTS) || scopes.includes(subjectId);
}

/** requirePlan refuses a learner whose plans do not cover a subject. */
export async function requirePlan(db: Db, learnerId: string, subjectId: string, at: number): Promise<void> {
  if (!covers(await coveringScopes(db, learnerId, new Date(at)), subjectId))
    throw new ConnectError(`no plan covers ${subjectId}`, Code.PermissionDenied);
}

/** PlanMeta names what a Checkout session buys; it travels in Stripe's metadata and comes back in its events. */
export interface PlanMeta {
  readonly payer: string;
  /** learner is empty for a plan that waits for a child. */
  readonly learner: string;
  readonly scope: string;
  readonly interval: PlanInterval;
}

/** CheckoutRequest is what Payments needs to open a Checkout page. */
export interface CheckoutRequest {
  readonly meta: PlanMeta;
  readonly email: string;
  /** customer is the payer's Stripe customer on the main account, when they have one. */
  readonly customer?: string;
  readonly amount: number;
  readonly productName: string;
  readonly successUrl: string;
  readonly cancelUrl: string;
  readonly locale: string;
}

/** Payments is the host's link to Stripe, one account for cards and one for Alipay and WeChat Pay. */
export interface Payments {
  /** checkout opens a Checkout session: a subscription on the main account, a single payment on the wallet account. */
  checkout(account: "main" | "wallet", req: CheckoutRequest): Promise<{ id: string; url: string }>;
  /** setRenewal sets whether a main-account subscription renews at the end of its period. */
  setRenewal(stripeSubscription: string, renew: boolean): Promise<void>;
  /** endNow ends a main-account subscription at once. */
  endNow(stripeSubscription: string): Promise<void>;
  /** refund refunds a charge in full. */
  refund(account: "main" | "wallet", paymentIntent: string): Promise<void>;
  /** portal opens the main account's customer portal. */
  portal(customer: string, returnUrl: string): Promise<string>;
}

/** BillingEvent is a Stripe event as the host's webhook reads it, after checking its signature. */
export type BillingEvent =
  | {
      /** checkout: a main-account Checkout session finished; prepaid says whether the card was prepaid. */
      readonly kind: "card-checkout";
      readonly checkout: string;
      readonly meta: PlanMeta;
      readonly stripeSubscription: string;
      readonly customer: string;
      readonly paid: boolean;
      readonly prepaid: boolean;
    }
  | {
      /** invoice-paid: a main-account subscription was charged for a period ending at periodEnd. */
      readonly kind: "invoice-paid";
      readonly meta: PlanMeta;
      readonly stripeSubscription: string;
      readonly customer: string;
      readonly paymentIntent: string;
      readonly amount: number;
      readonly currency: string;
      readonly periodEnd: number;
      readonly first: boolean;
    }
  | { readonly kind: "renewal-changed"; readonly stripeSubscription: string; readonly renews: boolean }
  | { readonly kind: "subscription-ended"; readonly stripeSubscription: string }
  | {
      /** wallet-paid: a wallet-account Checkout session was paid. */
      readonly kind: "wallet-paid";
      readonly checkout: string;
      readonly meta: PlanMeta;
      readonly paymentIntent: string;
      readonly amount: number;
      readonly currency: string;
    };

const learnerOf = (meta: PlanMeta) => meta.learner || null;

/** applyBillingEvent records what a Stripe event says; every event can arrive twice or out of order. */
export async function applyBillingEvent(db: Db, e: BillingEvent, now: number): Promise<void> {
  const at = new Date(now);
  switch (e.kind) {
    case "card-checkout": {
      await addPlan(db, {
        payerId: e.meta.payer,
        learnerId: learnerOf(e.meta),
        scope: e.meta.scope,
        interval: e.meta.interval,
        account: "main",
        stripeSubscription: e.stripeSubscription,
        customer: e.customer,
        paidUntil: at,
        at,
      });
      // A paid card that is not prepaid proves an adult (docs/billing.md §7).
      if (e.paid && !e.prepaid) await approveByPayment(db, e.meta.payer, at);
      return;
    }
    case "invoice-paid": {
      const plan = await addPlan(db, {
        payerId: e.meta.payer,
        learnerId: learnerOf(e.meta),
        scope: e.meta.scope,
        interval: e.meta.interval,
        account: "main",
        stripeSubscription: e.stripeSubscription,
        customer: e.customer,
        paidUntil: at,
        at,
      });
      await recordPayment(db, {
        subscriptionId: plan.id,
        account: "main",
        paymentIntent: e.paymentIntent,
        amount: e.amount,
        currency: e.currency,
        paidAt: at,
        first: e.first,
      });
      await extendPlan(db, plan.id, new Date(e.periodEnd));
      return;
    }
    case "renewal-changed": {
      const plan = await planByStripe(db, e.stripeSubscription);
      if (plan) await setCancelled(db, plan.id, e.renews ? null : (plan.cancelledAt ?? at));
      return;
    }
    case "subscription-ended": {
      const plan = await planByStripe(db, e.stripeSubscription);
      if (plan) await endPlan(db, plan.id, at);
      return;
    }
    case "wallet-paid": {
      if (await planByCheckout(db, e.checkout)) return;
      const existing = await walletPlanToExtend(db, {
        payerId: e.meta.payer,
        learnerId: learnerOf(e.meta),
        scope: e.meta.scope,
        interval: e.meta.interval,
      });
      const plan =
        existing ??
        (await addPlan(db, {
          payerId: e.meta.payer,
          learnerId: learnerOf(e.meta),
          scope: e.meta.scope,
          interval: e.meta.interval,
          account: "wallet",
          checkout: e.checkout,
          paidUntil: at,
          at,
        }));
      const recorded = await recordPayment(db, {
        subscriptionId: plan.id,
        account: "wallet",
        paymentIntent: e.paymentIntent,
        amount: e.amount,
        currency: e.currency,
        paidAt: at,
        first: !existing && !(await hasPaid(db, plan.id)),
      });
      if (!recorded) return;
      // A payment before the period ends adds to it; after, it starts now.
      const from = Math.max(now, plan.paidUntil.getTime());
      await extendPlan(db, plan.id, new Date(addInterval(from, e.meta.interval)));
      return;
    }
  }
}

/** refundableUntil returns when a plan's first payment stops being refundable, or 0 when it cannot be refunded. */
export async function refundableUntil(db: Db, plan: PlanRow, now: number): Promise<number> {
  if (plan.refundedAt || plan.account === "grant") return 0;
  const first = await firstPayment(db, plan.id);
  if (!first || first.refundedAt) return 0;
  const until = first.paidAt.getTime() + REFUND_WINDOW;
  return until > now ? until : 0;
}

/** BillingReminder is a message to a payer about a plan that ends soon. */
export type BillingReminder = "renews-soon" | "ends-soon";

/** runBillingReminders tells payers, once a period, that a plan renews or ends within REMIND_BEFORE. */
export async function runBillingReminders(
  db: Db,
  now: number,
  remind: (to: string, kind: BillingReminder) => Promise<void>,
): Promise<number> {
  let sent = 0;
  for (const plan of await plansToRemind(db, new Date(now), new Date(now + REMIND_BEFORE))) {
    const to = await emailOf(db, plan.payerId);
    if (to) {
      await remind(to, plan.account === "main" && !plan.cancelledAt ? "renews-soon" : "ends-soon");
      sent++;
    }
    await markPlanReminded(db, plan.id);
  }
  return sent;
}

/** BillingDeps are the billing service's dependencies besides the request context. */
export interface BillingDeps {
  readonly registry: Registry;
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
  /** payments is absent while billing is off; then nothing is sold and nobody needs a plan. */
  readonly payments?: Payments;
  /** origin is the site's own origin, the only one Checkout may return to. */
  readonly origin: string;
}

const INTERVALS: Record<number, PlanInterval | undefined> = { [Interval.MONTH]: "month", [Interval.YEAR]: "year" };
const ACCOUNTS: Record<PaymentAccount, Account> = { main: Account.CARD, wallet: Account.WALLET, grant: Account.GRANT };

/** billingService implements BillingService. */
export function billingService(deps: BillingDeps): ServiceImpl<typeof BillingService> {
  const auth = (ctx: HandlerContext): { db: Db; userId: string } => {
    const db = ctx.values.get(dbKey);
    if (!db) throw new ConnectError("no database", Code.Internal);
    const userId = ctx.values.get(userIdKey);
    if (!userId) throw new ConnectError("sign in first", Code.Unauthenticated);
    return { db, userId };
  };

  const payments = (): Payments => {
    if (!deps.payments) throw new ConnectError("billing is off", Code.FailedPrecondition);
    return deps.payments;
  };

  const ownUrl = (url: string): URL => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new ConnectError("that address is not valid", Code.InvalidArgument);
    }
    if (parsed.origin !== deps.origin) throw new ConnectError("that address is not this site", Code.InvalidArgument);
    return parsed;
  };

  const scopes = () => [ALL_SUBJECTS, ...deps.registry.listings.map((s) => s.id)];

  const payersPlan = async (db: Db, userId: string, id: string): Promise<PlanRow> => {
    const plan = await planById(db, id).catch(() => undefined);
    if (!plan || plan.payerId !== userId) throw new ConnectError("no such plan", Code.NotFound);
    return plan;
  };

  return {
    listPlans() {
      return {
        required: deps.payments !== undefined,
        plans: [
          ...deps.registry.listings.map((s) => ({
            scope: s.id,
            title: text(s.title),
            monthCents: PRICES.subject.month,
            yearCents: PRICES.subject.year,
          })),
          {
            scope: ALL_SUBJECTS,
            title: text(t("All subjects", "全部学科")),
            monthCents: PRICES.all.month,
            yearCents: PRICES.all.year,
          },
        ],
      };
    },

    async startCheckout(req, ctx) {
      const { db, userId } = auth(ctx);
      const pay = payments();
      const interval = INTERVALS[req.interval];
      if (!interval) throw new ConnectError("choose monthly or yearly", Code.InvalidArgument);
      if (!scopes().includes(req.scope)) throw new ConnectError("no such plan", Code.InvalidArgument);
      const account = req.account === Account.CARD ? "main" : req.account === Account.WALLET ? "wallet" : undefined;
      if (!account) throw new ConnectError("choose how to pay", Code.InvalidArgument);
      if (!req.agreedTerms || !req.agreedRefund || (account === "main" && !req.agreedRenewal))
        throw new ConnectError("tick every statement first", Code.FailedPrecondition);
      const payer = await learnerFor(db, userId);
      if ((await learnerAge(db, payer)).band !== "adult") throw new ConnectError("only an adult can pay", Code.PermissionDenied);
      // A plan for a new child waits unassigned; one for a followed learner names them; otherwise it is the payer's.
      let learner = payer;
      if (req.forNewChild) learner = "";
      else if (req.learnerId) {
        if (!(await isGuardian(db, userId, req.learnerId))) throw new ConnectError("no such learner", Code.NotFound);
        learner = req.learnerId;
      }
      const back = ownUrl(req.returnUrl);
      const success = new URL(back);
      success.searchParams.set("checkout", "{CHECKOUT_SESSION_ID}");
      const email = await emailOf(db, userId);
      if (!email) throw new ConnectError("no email", Code.FailedPrecondition);
      const listing = deps.registry.listings.find((s) => s.id === req.scope);
      const name = listing ? `Great Academy: ${listing.title.en}` : "Great Academy: All subjects";
      const customer = account === "main" ? await customerOf(db, userId) : undefined;
      const session = await pay.checkout(account, {
        meta: { payer: userId, learner, scope: req.scope, interval },
        email,
        ...(customer && { customer }),
        amount: priceOf(req.scope, interval),
        productName: `${name} (${interval === "year" ? "yearly" : "monthly"})`,
        // Stripe fills in the session id; the braces must reach it unescaped.
        successUrl: success.toString().replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}"),
        cancelUrl: back.toString(),
        locale: req.locale === "zh-CN" ? "zh" : "en",
      });
      return { url: session.url };
    },

    async getCheckout(req, ctx) {
      const { db, userId } = auth(ctx);
      const byCheckout = await planByCheckout(db, req.checkoutId);
      if (byCheckout) return { done: byCheckout.payerId === userId };
      // A card plan is found by its Stripe subscription once its first invoice arrives; the newest paid plan will do.
      const recent = (await plansOfPayer(db, userId)).find((p) => p.account === "main" && p.paidUntil.getTime() > deps.now());
      return { done: recent !== undefined && (await hasPaid(db, recent.id)) };
    },

    async listSubscriptions(_req, ctx) {
      const { db, userId } = auth(ctx);
      const now = deps.now();
      const self = await learnerFor(db, userId);
      const names = new Map((await guardedLearners(db, userId)).map((l) => [l.learnerId, l.name]));
      const paid = await plansOfPayer(db, userId);
      const covering = (await plansOfLearner(db, self)).filter((p) => p.payerId !== userId);
      const list = [];
      for (const p of [...paid, ...covering]) {
        const payer = p.payerId === userId;
        list.push({
          id: p.id,
          scope: p.scope,
          interval: p.interval === "year" ? Interval.YEAR : Interval.MONTH,
          account: ACCOUNTS[p.account],
          learnerId: p.learnerId ?? "",
          learnerName: p.learnerId === self ? "" : (names.get(p.learnerId ?? "") ?? ""),
          paidUntil: BigInt(p.paidUntil.getTime()),
          cancelled: p.cancelledAt !== null,
          refunded: p.refundedAt !== null,
          refundableUntil: BigInt(payer ? await refundableUntil(db, p, now) : 0),
          payer,
        });
      }
      return { subscriptions: list };
    },

    async cancelSubscription(req, ctx) {
      const { db, userId } = auth(ctx);
      const plan = await payersPlan(db, userId, req.id);
      if (plan.account !== "main" || !plan.stripeSubscription) throw new ConnectError("this plan does not renew", Code.FailedPrecondition);
      if (plan.refundedAt) throw new ConnectError("this plan has ended", Code.FailedPrecondition);
      await payments().setRenewal(plan.stripeSubscription, req.resume);
      await setCancelled(db, plan.id, req.resume ? null : new Date(deps.now()));
      return {};
    },

    async refundSubscription(req, ctx) {
      const { db, userId } = auth(ctx);
      const pay = payments();
      const now = deps.now();
      const plan = await payersPlan(db, userId, req.id);
      if (!(await refundableUntil(db, plan, now)))
        throw new ConnectError("this payment can no longer be refunded", Code.FailedPrecondition);
      const first = await firstPayment(db, plan.id);
      if (!first || plan.account === "grant") throw new ConnectError("nothing to refund", Code.FailedPrecondition);
      await pay.refund(plan.account, first.paymentIntent);
      if (plan.stripeSubscription) await pay.endNow(plan.stripeSubscription);
      await markRefunded(db, plan.id, first.paymentIntent, new Date(now));
      return {};
    },

    async openPortal(req, ctx) {
      const { db, userId } = auth(ctx);
      const pay = payments();
      const customer = await customerOf(db, userId);
      if (!customer) throw new ConnectError("no card plan", Code.FailedPrecondition);
      return { url: await pay.portal(customer, ownUrl(req.returnUrl).toString()) };
    },
  };
}
