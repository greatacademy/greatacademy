import { and, asc, eq, gt, gte, isNull, lt, or, sql } from "drizzle-orm";

import type { Db } from "./db.ts";
import { user } from "./schema/auth.ts";
import { type PaymentAccount, type PlanInterval, type PlanScope, payment, subscription } from "./schema/billing.ts";

// A Date inside a sql template reaches postgres.js unconverted, which refuses it (PGlite does not); pass an ISO string and cast.
const timestamp = (d: Date) => sql`${d.toISOString()}::timestamptz`;

/** PlanRow is a stored plan. */
export type PlanRow = typeof subscription.$inferSelect;

/** PaymentRow is a stored charge. */
export type PaymentRow = typeof payment.$inferSelect;

/** NewPlan is what a plan starts with. */
export interface NewPlan {
  readonly payerId: string;
  readonly learnerId: string | null;
  readonly scope: PlanScope;
  readonly interval: PlanInterval;
  readonly account: PaymentAccount;
  readonly stripeSubscription?: string;
  readonly checkout?: string;
  readonly customer?: string;
  readonly paidUntil: Date;
  readonly at: Date;
}

/** addPlan stores a plan, or finds the one already stored for the same Stripe subscription or Checkout session. */
export async function addPlan(db: Db, p: NewPlan): Promise<PlanRow> {
  const [row] = await db
    .insert(subscription)
    .values({
      payerId: p.payerId,
      learnerId: p.learnerId,
      scope: p.scope,
      interval: p.interval,
      account: p.account,
      stripeSubscription: p.stripeSubscription ?? null,
      checkout: p.checkout ?? null,
      customer: p.customer ?? null,
      paidUntil: p.paidUntil,
      createdAt: p.at,
    })
    .onConflictDoNothing()
    .returning();
  if (row) return row;
  const found =
    (p.stripeSubscription && (await planByStripe(db, p.stripeSubscription))) || (p.checkout && (await planByCheckout(db, p.checkout)));
  if (!found) throw new Error("a plan conflicted with none");
  return found;
}

/** planById returns a plan. */
export async function planById(db: Db, id: string): Promise<PlanRow | undefined> {
  return (await db.select().from(subscription).where(eq(subscription.id, id)))[0];
}

/** planByStripe returns the plan of a card plan's Stripe subscription. */
export async function planByStripe(db: Db, stripeSubscription: string): Promise<PlanRow | undefined> {
  return (await db.select().from(subscription).where(eq(subscription.stripeSubscription, stripeSubscription)))[0];
}

/** planByCheckout returns the plan a Checkout session bought. */
export async function planByCheckout(db: Db, checkout: string): Promise<PlanRow | undefined> {
  return (await db.select().from(subscription).where(eq(subscription.checkout, checkout)))[0];
}

/** coveringScopes returns the scopes of a learner's plans paid past a time and not refunded. */
export async function coveringScopes(db: Db, learnerId: string, at: Date): Promise<PlanScope[]> {
  const rows = await db
    .select({ scope: subscription.scope })
    .from(subscription)
    .where(and(eq(subscription.learnerId, learnerId), gt(subscription.paidUntil, at), isNull(subscription.refundedAt)));
  return [...new Set(rows.map((r) => r.scope))];
}

/** plansOfPayer returns the plans a person pays for, newest first. */
export async function plansOfPayer(db: Db, payerId: string): Promise<PlanRow[]> {
  return db.select().from(subscription).where(eq(subscription.payerId, payerId)).orderBy(sql`${subscription.createdAt} desc`);
}

/** plansOfLearner returns the plans that name a learner, newest first. */
export async function plansOfLearner(db: Db, learnerId: string): Promise<PlanRow[]> {
  return db.select().from(subscription).where(eq(subscription.learnerId, learnerId)).orderBy(sql`${subscription.createdAt} desc`);
}

/** waitingPlan returns a payer's oldest paid plan that waits for a child. */
export async function waitingPlan(db: Db, payerId: string, at: Date): Promise<PlanRow | undefined> {
  const rows = await db
    .select()
    .from(subscription)
    .where(
      and(
        eq(subscription.payerId, payerId),
        isNull(subscription.learnerId),
        gt(subscription.paidUntil, at),
        isNull(subscription.refundedAt),
      ),
    )
    .orderBy(asc(subscription.createdAt))
    .limit(1);
  return rows[0];
}

/** assignPlan gives a waiting plan to a learner. */
export async function assignPlan(db: Db, id: string, learnerId: string): Promise<void> {
  await db
    .update(subscription)
    .set({ learnerId })
    .where(and(eq(subscription.id, id), isNull(subscription.learnerId)));
}

/** extendPlan moves a plan's paid-until time later, never earlier. */
export async function extendPlan(db: Db, id: string, paidUntil: Date): Promise<void> {
  await db
    .update(subscription)
    .set({ paidUntil: sql`greatest(${subscription.paidUntil}, ${timestamp(paidUntil)})` })
    .where(eq(subscription.id, id));
}

/** walletPlanToExtend returns the payer's wallet plan for the same learner, scope and interval that a new payment extends. */
export async function walletPlanToExtend(
  db: Db,
  p: { payerId: string; learnerId: string | null; scope: PlanScope; interval: PlanInterval },
): Promise<PlanRow | undefined> {
  if (!p.learnerId) return undefined;
  const rows = await db
    .select()
    .from(subscription)
    .where(
      and(
        eq(subscription.payerId, p.payerId),
        eq(subscription.learnerId, p.learnerId),
        eq(subscription.scope, p.scope),
        eq(subscription.interval, p.interval),
        eq(subscription.account, "wallet"),
        isNull(subscription.refundedAt),
      ),
    )
    .orderBy(sql`${subscription.paidUntil} desc`)
    .limit(1);
  return rows[0];
}

/** setCancelled records whether a card plan will stop renewing; null means it renews again. */
export async function setCancelled(db: Db, id: string, at: Date | null): Promise<void> {
  await db.update(subscription).set({ cancelledAt: at }).where(eq(subscription.id, id));
}

/** endPlan ends a plan now, as when its Stripe subscription is deleted. */
export async function endPlan(db: Db, id: string, at: Date): Promise<void> {
  await db
    .update(subscription)
    .set({
      paidUntil: sql`least(${subscription.paidUntil}, ${timestamp(at)})`,
      cancelledAt: sql`coalesce(${subscription.cancelledAt}, ${timestamp(at)})`,
    })
    .where(eq(subscription.id, id));
}

/** recordPayment stores a charge once; it returns false when the charge was already stored. */
export async function recordPayment(
  db: Db,
  p: {
    subscriptionId: string;
    account: PaymentAccount;
    paymentIntent: string;
    amount: number;
    currency: string;
    paidAt: Date;
    first: boolean;
  },
): Promise<boolean> {
  const rows = await db.insert(payment).values(p).onConflictDoNothing().returning({ id: payment.id });
  return rows.length > 0;
}

/** firstPayment returns a plan's first charge. */
export async function firstPayment(db: Db, subscriptionId: string): Promise<PaymentRow | undefined> {
  const rows = await db
    .select()
    .from(payment)
    .where(and(eq(payment.subscriptionId, subscriptionId), eq(payment.first, true)))
    .limit(1);
  return rows[0];
}

/** paymentsOf returns a plan's charges, oldest first. */
export async function paymentsOf(db: Db, subscriptionId: string): Promise<PaymentRow[]> {
  return db.select().from(payment).where(eq(payment.subscriptionId, subscriptionId)).orderBy(asc(payment.paidAt));
}

/** hasPaid tells whether a plan already has a charge, so that the next one is not its first. */
export async function hasPaid(db: Db, subscriptionId: string): Promise<boolean> {
  return (await db.select({ id: payment.id }).from(payment).where(eq(payment.subscriptionId, subscriptionId)).limit(1)).length > 0;
}

/** markRefunded records a refund of a plan's charge and ends the plan at once. */
export async function markRefunded(db: Db, subscriptionId: string, paymentIntent: string, at: Date): Promise<void> {
  await db
    .update(payment)
    .set({ refundedAt: at })
    .where(and(eq(payment.paymentIntent, paymentIntent), isNull(payment.refundedAt)));
  await db
    .update(subscription)
    .set({
      refundedAt: at,
      paidUntil: sql`least(${subscription.paidUntil}, ${timestamp(at)})`,
      cancelledAt: sql`coalesce(${subscription.cancelledAt}, ${timestamp(at)})`,
    })
    .where(eq(subscription.id, subscriptionId));
}

/** plansToRemind returns paid plans that end within a window and have not been reminded for that end. */
export async function plansToRemind(db: Db, from: Date, to: Date): Promise<PlanRow[]> {
  return db
    .select()
    .from(subscription)
    .where(
      and(
        gte(subscription.paidUntil, from),
        lt(subscription.paidUntil, to),
        isNull(subscription.refundedAt),
        or(eq(subscription.account, "card"), eq(subscription.account, "wallet")),
        or(isNull(subscription.remindedFor), sql`${subscription.remindedFor} <> ${subscription.paidUntil}`),
      ),
    );
}

/** markPlanReminded records that the payer was told about the plan's current end. */
export async function markPlanReminded(db: Db, id: string): Promise<void> {
  await db
    .update(subscription)
    .set({ remindedFor: sql`${subscription.paidUntil}` })
    .where(eq(subscription.id, id));
}

/** customerOf returns the Stripe customer of a person's newest card plan. */
export async function customerOf(db: Db, payerId: string): Promise<string | undefined> {
  const rows = await db
    .select({ customer: subscription.customer })
    .from(subscription)
    .where(and(eq(subscription.payerId, payerId), eq(subscription.account, "card"), sql`${subscription.customer} is not null`))
    .orderBy(sql`${subscription.createdAt} desc`)
    .limit(1);
  return rows[0]?.customer ?? undefined;
}

/** emailOf returns a person's email address. */
export async function emailOf(db: Db, userId: string): Promise<string | undefined> {
  return (await db.select({ email: user.email }).from(user).where(eq(user.id, userId)))[0]?.email;
}
