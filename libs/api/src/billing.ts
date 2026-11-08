import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import { t } from "@ga/content";
import {
  addPlan,
  appleTokenOf,
  approveByPayment,
  coveringScopes,
  customerOf,
  type Db,
  emailOf,
  endPlan,
  extendPlan,
  firstPayment,
  firstPaymentOfPayer,
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

import { type AppStore, appleProduct, recordApple } from "./apple.ts";
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
  return shiftMonths(ms, interval === "year" ? 12 : 1);
}

function shiftMonths(ms: number, months: number): number {
  const d = new Date(ms);
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d.getUTCDate(), last));
  target.setUTCHours(d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
  return target.getTime();
}

/** MIN_CHARGE is the least Stripe charges, in cents; an upgrade must cost at least this. */
export const MIN_CHARGE = 50;

/**
 * unusedValue returns what is left of a plan, in cents: the price of its last period times the share
 * of paid time still to come. Grants, refunded plans and plans that ended have none (docs/billing.md §5).
 */
export function unusedValue(plan: Pick<PlanRow, "account" | "scope" | "interval" | "paidUntil" | "refundedAt">, now: number): number {
  const end = plan.paidUntil.getTime();
  // An App Store plan is Apple's to end, so nothing on the web replaces it.
  if (plan.account === "grant" || plan.account === "apple" || plan.refundedAt || end <= now) return 0;
  const length = end - shiftMonths(end, plan.interval === "year" ? -12 : -1);
  return Math.floor((priceOf(plan.scope, plan.interval) * (end - now)) / length);
}

/** Upgrade is what moving a learner to all subjects replaces: the payer's running single-subject plans, and their unused value. */
export interface Upgrade {
  readonly plans: readonly PlanRow[];
  readonly credit: number;
}

/** upgradeOf returns the plans of a learner that a payer's upgrade to all subjects would replace. */
export async function upgradeOf(db: Db, payerId: string, learnerId: string, now: number): Promise<Upgrade> {
  const plans = (await plansOfLearner(db, learnerId)).filter(
    (p) => p.payerId === payerId && p.scope !== ALL_SUBJECTS && unusedValue(p, now) > 0,
  );
  return { plans, credit: plans.reduce((sum, p) => sum + unusedValue(p, now), 0) };
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
  /** replaces lists the plans an upgrade to all subjects ends once it is paid. */
  readonly replaces?: readonly string[];
}

/** CheckoutRequest is what Payments needs to open a Checkout page. */
export interface CheckoutRequest {
  readonly meta: PlanMeta;
  readonly email: string;
  /** customer is the payer's Stripe customer, when they have one. */
  readonly customer?: string;
  readonly amount: number;
  /** credit comes off the first payment: the unused value of the plans an upgrade replaces. */
  readonly credit: number;
  /** creditName says what the credit is, in the payer's language. */
  readonly creditName: string;
  readonly productName: string;
  readonly successUrl: string;
  readonly cancelUrl: string;
  readonly locale: string;
}

/** Payments is the host's link to its Stripe account. */
export interface Payments {
  /** wallet tells whether Alipay and WeChat Pay are turned on in the account. */
  readonly wallet: boolean;
  /** checkout opens a Checkout session: a subscription for a card, a single payment for Alipay or WeChat Pay. */
  checkout(method: "card" | "wallet", req: CheckoutRequest): Promise<{ id: string; url: string }>;
  /** setRenewal sets whether a card subscription renews at the end of its period. */
  setRenewal(stripeSubscription: string, renew: boolean): Promise<void>;
  /** endNow ends a card subscription at once. */
  endNow(stripeSubscription: string): Promise<void>;
  /** refund refunds a charge, in full or by amount cents; the same refund asked twice is made once. */
  refund(paymentIntent: string, amount?: number): Promise<void>;
  /** portal opens Stripe's customer portal. */
  portal(customer: string, returnUrl: string): Promise<string>;
}

/** BillingEvent is a Stripe event as the host's webhook reads it, after checking its signature. */
export type BillingEvent =
  | {
      /** checkout: a card Checkout session finished; prepaid says whether the card was prepaid. */
      readonly kind: "card-checkout";
      readonly checkout: string;
      readonly meta: PlanMeta;
      readonly stripeSubscription: string;
      readonly customer: string;
      readonly paid: boolean;
      readonly prepaid: boolean;
    }
  | {
      /** invoice-paid: a card subscription was charged for a period ending at periodEnd. */
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
      /** wallet-paid: a Checkout session paid by Alipay or WeChat Pay. */
      readonly kind: "wallet-paid";
      readonly checkout: string;
      readonly meta: PlanMeta;
      readonly paymentIntent: string;
      readonly amount: number;
      readonly currency: string;
    };

const learnerOf = (meta: PlanMeta) => meta.learner || null;

/**
 * replacePlans ends the plans an upgrade replaced, once it is paid. Card subscriptions end at Stripe
 * without proration, since their unused time came off the upgrade's price.
 */
async function replacePlans(db: Db, meta: PlanMeta, at: Date, payments: Payments | undefined): Promise<void> {
  for (const id of meta.replaces ?? []) {
    const plan = await planById(db, id).catch(() => undefined);
    if (!plan || plan.payerId !== meta.payer || plan.refundedAt || plan.paidUntil <= at) continue;
    if (plan.account === "card" && plan.stripeSubscription) {
      if (!payments) throw new Error("billing is off");
      await payments.endNow(plan.stripeSubscription);
    }
    await endPlan(db, plan.id, at);
  }
}

/**
 * applyBillingEvent records what a Stripe event says; every event can arrive twice or out of order.
 * payments ends the card subscriptions an upgrade replaces.
 */
export async function applyBillingEvent(db: Db, e: BillingEvent, now: number, payments?: Payments): Promise<void> {
  const at = new Date(now);
  switch (e.kind) {
    case "card-checkout": {
      await addPlan(db, {
        payerId: e.meta.payer,
        learnerId: learnerOf(e.meta),
        scope: e.meta.scope,
        interval: e.meta.interval,
        account: "card",
        stripeSubscription: e.stripeSubscription,
        customer: e.customer,
        paidUntil: at,
        at,
      });
      // A paid card that is not prepaid proves an adult (docs/billing.md §7).
      if (e.paid && !e.prepaid) await approveByPayment(db, e.meta.payer, at);
      if (e.paid) await replacePlans(db, e.meta, at, payments);
      return;
    }
    case "invoice-paid": {
      const plan = await addPlan(db, {
        payerId: e.meta.payer,
        learnerId: learnerOf(e.meta),
        scope: e.meta.scope,
        interval: e.meta.interval,
        account: "card",
        stripeSubscription: e.stripeSubscription,
        customer: e.customer,
        paidUntil: at,
        at,
      });
      await recordPayment(db, {
        subscriptionId: plan.id,
        account: "card",
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
      if (recorded) {
        // A payment before the period ends adds to it; after, it starts now.
        const from = Math.max(now, plan.paidUntil.getTime());
        await extendPlan(db, plan.id, new Date(addInterval(from, e.meta.interval)));
      }
      await replacePlans(db, e.meta, at, payments);
      return;
    }
  }
}

/**
 * refundableUntil returns when a plan's first payment stops being refundable, or 0 when it cannot be refunded.
 * Only a payer's first payment ever is refundable, and only if it bought a month (docs/billing.md §5).
 */
export async function refundableUntil(db: Db, plan: PlanRow, now: number): Promise<number> {
  // A plan that ended, as one an upgrade replaced, has nothing left to refund.
  // Apple decides refunds of App Store plans.
  if (
    plan.refundedAt ||
    plan.account === "grant" ||
    plan.account === "apple" ||
    plan.interval !== "month" ||
    plan.paidUntil.getTime() <= now
  )
    return 0;
  const first = await firstPayment(db, plan.id);
  if (!first || first.refundedAt) return 0;
  if ((await firstPaymentOfPayer(db, plan.payerId))?.id !== first.id) return 0;
  const until = first.paidAt.getTime() + REFUND_WINDOW;
  return until > now ? until : 0;
}

/** endPlansOf ends at once every card plan a person pays for that still runs, as before their account is deleted. */
export async function endPlansOf(db: Db, payments: Payments, payerId: string, now: number): Promise<void> {
  for (const plan of await plansOfPayer(db, payerId)) {
    if (plan.account !== "card" || !plan.stripeSubscription || plan.refundedAt || plan.paidUntil.getTime() <= now) continue;
    await payments.endNow(plan.stripeSubscription);
    await endPlan(db, plan.id, new Date(now));
  }
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
      await remind(to, plan.account === "card" && !plan.cancelledAt ? "renews-soon" : "ends-soon");
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
  /** origin is the only origin Checkout may return to; without it, the one the request came to. */
  readonly origin?: string;
  /** appStore is absent until the App Store Server API is set up; then the iOS app sells nothing. */
  readonly appStore?: AppStore;
}

const INTERVALS: Record<number, PlanInterval | undefined> = { [Interval.MONTH]: "month", [Interval.YEAR]: "year" };
const ACCOUNTS: Record<PaymentAccount, Account> = {
  card: Account.CARD,
  wallet: Account.WALLET,
  apple: Account.APPLE,
  grant: Account.GRANT,
};

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

  const ownUrl = (url: string, ctx: HandlerContext): URL => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new ConnectError("that address is not valid", Code.InvalidArgument);
    }
    if (parsed.origin !== (deps.origin ?? new URL(ctx.url).origin))
      throw new ConnectError("that address is not this site", Code.InvalidArgument);
    return parsed;
  };

  const scopes = () => [ALL_SUBJECTS, ...deps.registry.listings.map((s) => s.id)];

  const payersPlan = async (db: Db, userId: string, id: string): Promise<PlanRow> => {
    const plan = await planById(db, id).catch(() => undefined);
    if (!plan || plan.payerId !== userId) throw new ConnectError("no such plan", Code.NotFound);
    return plan;
  };

  return {
    async listPlans(req, ctx) {
      const db = ctx.values.get(dbKey);
      const userId = ctx.values.get(userIdKey);
      // What an upgrade to all subjects would replace, for the learner the plan is for.
      let upgrade: Upgrade = { plans: [], credit: 0 };
      let endsRefund = false;
      if (db && userId && !req.forNewChild) {
        const learner = req.learnerId && (await isGuardian(db, userId, req.learnerId)) ? req.learnerId : await learnerFor(db, userId);
        const now = deps.now();
        upgrade = await upgradeOf(db, userId, learner, now);
        for (const p of upgrade.plans) if (await refundableUntil(db, p, now)) endsRefund = true;
      }
      return {
        required: deps.payments !== undefined,
        wallet: deps.payments?.wallet ?? false,
        firstRefund: !db || !userId || !(await firstPaymentOfPayer(db, userId)),
        upgradeCreditCents: upgrade.credit,
        upgradeScopes: upgrade.plans.map((p) => p.scope),
        upgradeEndsRefund: endsRefund,
        plans: [
          ...deps.registry.listings.map((s) => ({
            scope: s.id,
            title: text(s.title),
            monthCents: PRICES.subject.month,
            yearCents: PRICES.subject.year,
            appleMonth: appleProduct(s.id, "month"),
            appleYear: appleProduct(s.id, "year"),
          })),
          {
            scope: ALL_SUBJECTS,
            title: text(t("All subjects", "全部学科")),
            monthCents: PRICES.all.month,
            yearCents: PRICES.all.year,
            appleMonth: appleProduct(ALL_SUBJECTS, "month"),
            appleYear: appleProduct(ALL_SUBJECTS, "year"),
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
      const method = req.account === Account.CARD ? "card" : req.account === Account.WALLET ? "wallet" : undefined;
      if (!method) throw new ConnectError("choose how to pay", Code.InvalidArgument);
      if (method === "wallet" && !pay.wallet) throw new ConnectError("Alipay and WeChat Pay are not set up", Code.FailedPrecondition);
      if (!req.agreedTerms || !req.agreedRefund || (method === "card" && !req.agreedRenewal))
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
      if (learner) {
        const covered = await coveringScopes(db, learner, new Date(deps.now()));
        if (covered.includes(ALL_SUBJECTS) || covered.includes(req.scope))
          throw new ConnectError("this learner already has a plan for that", Code.AlreadyExists);
      }
      const back = ownUrl(req.returnUrl, ctx);
      const success = new URL(back);
      success.searchParams.set("checkout", "{CHECKOUT_SESSION_ID}");
      const email = await emailOf(db, userId);
      if (!email) throw new ConnectError("no email", Code.FailedPrecondition);
      const listing = deps.registry.listings.find((s) => s.id === req.scope);
      const name = listing ? `Great Academy: ${listing.title.en}` : "Great Academy: All subjects";
      const customer = method === "card" ? await customerOf(db, userId) : undefined;
      const amount = priceOf(req.scope, interval);
      // Buying all subjects for a learner with subject plans is an upgrade: their unused value comes off (docs/billing.md §5).
      const upgrade = learner && req.scope === ALL_SUBJECTS ? await upgradeOf(db, userId, learner, deps.now()) : { plans: [], credit: 0 };
      if (amount - upgrade.credit < MIN_CHARGE)
        throw new ConnectError("the unused time of the current plans is worth more than this plan", Code.FailedPrecondition);
      const session = await pay.checkout(method, {
        meta: {
          payer: userId,
          learner,
          scope: req.scope,
          interval,
          ...(upgrade.plans.length > 0 && { replaces: upgrade.plans.map((p) => p.id) }),
        },
        email,
        ...(customer && { customer }),
        amount,
        credit: upgrade.credit,
        creditName: req.locale === "zh-CN" ? "未用时间抵扣" : "Credit for unused time",
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
      const recent = (await plansOfPayer(db, userId)).find((p) => p.account === "card" && p.paidUntil.getTime() > deps.now());
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
      if (plan.account === "apple") throw new ConnectError("cancel it in the App Store", Code.FailedPrecondition);
      if (plan.account !== "card" || !plan.stripeSubscription) throw new ConnectError("this plan does not renew", Code.FailedPrecondition);
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
      await pay.refund(first.paymentIntent);
      if (plan.stripeSubscription) await pay.endNow(plan.stripeSubscription);
      await markRefunded(db, plan.id, first.paymentIntent, new Date(now));
      return {};
    },

    async startApplePurchase(req, ctx) {
      const { db, userId } = auth(ctx);
      if (!deps.appStore) throw new ConnectError("App Store purchases are not set up", Code.FailedPrecondition);
      const interval = INTERVALS[req.interval];
      if (!interval) throw new ConnectError("choose monthly or yearly", Code.InvalidArgument);
      if (!scopes().includes(req.scope)) throw new ConnectError("no such plan", Code.InvalidArgument);
      if (!req.agreedTerms || !req.agreedRenewal || !req.agreedRefund)
        throw new ConnectError("tick every statement first", Code.FailedPrecondition);
      const self = await learnerFor(db, userId);
      if ((await learnerAge(db, self)).band !== "adult") throw new ConnectError("only an adult can pay", Code.PermissionDenied);
      // Whom it is for, as on the web: the payer, a learner they guard, or the next child they add.
      let learner: string | null = self;
      if (req.forNewChild) learner = null;
      else if (req.learnerId) {
        if (!(await isGuardian(db, userId, req.learnerId))) throw new ConnectError("no such learner", Code.NotFound);
        learner = req.learnerId;
      }
      const now = deps.now();
      if (learner) {
        const covered = await coveringScopes(db, learner, new Date(now));
        if (covered.includes(ALL_SUBJECTS) || covered.includes(req.scope))
          throw new ConnectError("this learner already has a plan for that", Code.AlreadyExists);
      }
      // An Apple account holds one subscription of ours at a time: it stays with its learner and only moves up to all subjects.
      const apple = (await plansOfPayer(db, userId)).find((p) => p.account === "apple" && !p.refundedAt && p.paidUntil.getTime() > now);
      if (apple && (apple.learnerId !== learner || learner === null))
        throw new ConnectError("an Apple account holds one App Store subscription", Code.FailedPrecondition);
      if (apple && req.scope !== ALL_SUBJECTS)
        throw new ConnectError("an App Store subject plan can only move to all subjects", Code.FailedPrecondition);
      return { productId: appleProduct(req.scope, interval), accountToken: await appleTokenOf(db, userId, learner) };
    },

    async confirmApplePurchase(req, ctx) {
      const { db, userId } = auth(ctx);
      if (!deps.appStore) throw new ConnectError("App Store purchases are not set up", Code.FailedPrecondition);
      if (!/^\d{1,32}$/.test(req.transactionId)) throw new ConnectError("no such transaction", Code.InvalidArgument);
      const payer = await recordApple(db, deps.appStore, req.transactionId, deps.now(), deps.payments);
      return { done: payer === userId };
    },

    async openPortal(req, ctx) {
      const { db, userId } = auth(ctx);
      const pay = payments();
      const customer = await customerOf(db, userId);
      if (!customer) throw new ConnectError("no card plan", Code.FailedPrecondition);
      return { url: await pay.portal(customer, ownUrl(req.returnUrl, ctx).toString()) };
    },
  };
}
