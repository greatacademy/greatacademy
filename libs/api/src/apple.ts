import {
  addPlan,
  applePlansOf,
  type Db,
  endPlan,
  extendPlan,
  hasPaid,
  markRefunded,
  type PlanInterval,
  type PlanRow,
  paymentsOf,
  recordPayment,
  setCancelled,
  userOfAppleToken,
} from "@ga/db";

import { ALL_SUBJECTS, type Payments, unusedValue, upgradeOf } from "./billing.ts";

/** APPLE_BUNDLE is the iOS app's bundle id; a transaction of any other app is not ours. */
export const APPLE_BUNDLE = "dev.greatacademy.app";

/** appleProduct names the App Store product of a plan: `ga.<scope>.<interval>` (docs/billing.md §8). */
export function appleProduct(scope: string, interval: PlanInterval): string {
  return `ga.${scope}.${interval}`;
}

/** planOfProduct reads a plan's scope and interval back out of an App Store product id. */
export function planOfProduct(productId: string): { scope: string; interval: PlanInterval } | undefined {
  const m = /^ga\.([a-z0-9-]+)\.(month|year)$/.exec(productId);
  return m ? { scope: m[1]!, interval: m[2] as PlanInterval } : undefined;
}

/** AppleTransaction is an App Store transaction, as Apple's server API returns it. */
export interface AppleTransaction {
  readonly transactionId: string;
  readonly originalTransactionId: string;
  readonly productId: string;
  readonly bundleId: string;
  /** appAccountToken is the token the purchase carried: whose it is. */
  readonly appAccountToken?: string;
  readonly purchaseDate: number;
  readonly expiresDate: number;
  /** revocationDate is set when Apple refunded the transaction. */
  readonly revocationDate?: number;
  /** price is in cents of currency. */
  readonly price: number;
  readonly currency: string;
  readonly environment: "Production" | "Sandbox";
}

/** AppleStatus is where an App Store subscription stands now. */
export interface AppleStatus {
  /** latest is the subscription's newest transaction: its product is the plan it is now. */
  readonly latest: AppleTransaction;
  /** renews is false once the subscriber turned renewal off. */
  readonly renews: boolean;
  /** graceUntil is the end of a billing grace period, while Apple retries a failed renewal. */
  readonly graceUntil?: number;
}

/** AppStore is the host's link to Apple's App Store Server API, whose answers come over TLS from Apple. */
export interface AppStore {
  /** transaction asks Apple about a transaction, in production then in the sandbox. */
  transaction(transactionId: string): Promise<AppleTransaction | undefined>;
  /** status asks Apple where the subscription of a transaction stands. */
  status(transactionId: string, environment: AppleTransaction["environment"]): Promise<AppleStatus | undefined>;
}

const planFor = (db: Db, payer: string, learner: string | null, t: AppleTransaction, at: Date): Promise<PlanRow> | undefined => {
  const plan = planOfProduct(t.productId);
  if (!plan) return undefined;
  return addPlan(db, {
    payerId: payer,
    learnerId: learner,
    scope: plan.scope,
    interval: plan.interval,
    account: "apple",
    apple: `${t.originalTransactionId}/${t.productId}`,
    paidUntil: at,
    at,
  });
};

/**
 * recordApple records what Apple says about a transaction and the subscription it belongs to: its charge, the
 * plan its product is now, the plans it moved from, renewal and refunds. It returns the payer, or undefined when the
 * transaction is not ours. Asking Apple again each time makes repeats and any order of notifications harmless.
 */
export async function recordApple(
  db: Db,
  store: AppStore,
  transactionId: string,
  now: number,
  payments: Payments | undefined,
): Promise<string | undefined> {
  const t = await store.transaction(transactionId);
  if (!t || t.bundleId !== APPLE_BUNDLE || !t.appAccountToken) return undefined;
  const account = await userOfAppleToken(db, t.appAccountToken);
  if (!account) return undefined;
  const payer = account.userId;
  // The subscription stays with the learner it was first bought for; a new one is for whom the payer chose.
  const earlier = (await applePlansOf(db, t.originalTransactionId)).find((p) => p.payerId === payer);
  const learner = earlier ? earlier.learnerId : account.learnerId;
  const at = new Date(now);
  const plan = await planFor(db, payer, learner, t, at);
  if (!plan) return undefined;
  const first = !(await hasPaid(db, plan.id));
  await recordPayment(db, {
    subscriptionId: plan.id,
    account: "apple",
    paymentIntent: t.transactionId,
    amount: t.price,
    currency: t.currency,
    paidAt: new Date(t.purchaseDate),
    first,
  });
  if (t.revocationDate) await markRefunded(db, plan.id, t.transactionId, new Date(t.revocationDate));

  const status = await store.status(t.transactionId, t.environment);
  const latest = status?.latest ?? t;
  const current = await planFor(db, payer, learner, latest, at);
  if (!current) return payer;
  // An upgrade or a change of interval moves the subscription to another product: the plan it was ends.
  for (const p of await applePlansOf(db, latest.originalTransactionId))
    if (p.id !== current.id && !p.refundedAt && p.paidUntil > at) await endPlan(db, p.id, at);
  if (latest.revocationDate) await markRefunded(db, current.id, latest.transactionId, new Date(latest.revocationDate));
  else {
    await extendPlan(db, current.id, new Date(Math.max(latest.expiresDate, status?.graceUntil ?? 0)));
    await setCancelled(db, current.id, status && !status.renews ? (current.cancelledAt ?? at) : null);
  }
  // Moving to all subjects in the app ends the learner's subject plans paid on the web, refunding their unused time;
  // only running plans are replaced and each refund is idempotent at Stripe, so a repeat does nothing more.
  if (learner && current.scope === ALL_SUBJECTS && latest.transactionId === t.transactionId && !latest.revocationDate)
    await replaceWebPlans(db, payments, payer, learner, now);
  return payer;
}

/**
 * replaceWebPlans ends a learner's subject plans that a payer pays for by card or wallet, refunding the unused
 * value of each from its newest charges, as Apple's price cannot take a credit (docs/billing.md §5).
 */
async function replaceWebPlans(db: Db, payments: Payments | undefined, payer: string, learner: string, now: number): Promise<void> {
  if (!payments) return;
  for (const plan of (await upgradeOf(db, payer, learner, now)).plans) {
    let left = unusedValue(plan, now);
    if (plan.account === "card" && plan.stripeSubscription) await payments.endNow(plan.stripeSubscription);
    for (const charge of (await paymentsOf(db, plan.id)).reverse()) {
      if (left <= 0) break;
      if (charge.refundedAt || charge.amount <= 0) continue;
      const amount = Math.min(left, charge.amount);
      await payments.refund(charge.paymentIntent, amount);
      left -= amount;
    }
    await endPlan(db, plan.id, new Date(now));
  }
}
