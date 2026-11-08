import { boolean, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth.ts";
import { learner } from "./learning.ts";

const at = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

/** PlanScope is what a plan covers: a subject id, or "all" for every subject. */
export type PlanScope = string;

/** PlanInterval is how long one payment lasts. */
export type PlanInterval = "month" | "year";

/**
 * PaymentAccount is how a plan is paid: by card, which renews; by Alipay or WeChat Pay, one period at a time;
 * by an App Store subscription bought in the iOS app; or granted by an administrator.
 */
export type PaymentAccount = "card" | "wallet" | "apple" | "grant";

/**
 * subscription is one plan for one learner, paid by an adult; see docs/billing.md §9.
 * A learner may study a covered subject while paidUntil is later than now and the plan was not refunded.
 */
export const subscription = pgTable(
  "subscription",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    payerId: text("payer_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** learnerId is empty while the plan waits for a child the payer has yet to add, and again if that child is deleted. */
    learnerId: uuid("learner_id").references(() => learner.id, { onDelete: "set null" }),
    scope: text("scope").notNull().$type<PlanScope>(),
    interval: text("interval").notNull().$type<PlanInterval>(),
    account: text("account").notNull().$type<PaymentAccount>(),
    /** stripeSubscription is the card plan's Stripe subscription id; empty for wallet periods and grants. */
    stripeSubscription: text("stripe_subscription").unique(),
    /** customer is the Stripe customer that pays a card plan, for its portal. */
    customer: text("customer"),
    /** checkout is the Checkout session that bought the plan, so a repeated event changes nothing. */
    checkout: text("checkout").unique(),
    /** apple is an App Store plan's original transaction id and product, "<original>/<product>": one plan per product it moved through. */
    apple: text("apple").unique(),
    paidUntil: at("paid_until").notNull(),
    createdAt: at("created_at").notNull(),
    /** cancelledAt marks a card plan that will not renew. */
    cancelledAt: at("cancelled_at"),
    refundedAt: at("refunded_at"),
    /** remindedFor is the paidUntil a reminder was sent for, so each period is reminded once. */
    remindedFor: at("reminded_for"),
  },
  (t) => [
    index("subscription_learner").on(t.learnerId),
    index("subscription_payer").on(t.payerId),
    index("subscription_paid_until").on(t.paidUntil),
  ],
);

/**
 * appleAccount is the token an App Store purchase carries back to name the person who made it (appAccountToken),
 * and whom the purchase they last started is for: a learner, or none for the next child they add.
 */
export const appleAccount = pgTable("apple_account", {
  token: uuid("token").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  learnerId: uuid("learner_id").references(() => learner.id, { onDelete: "set null" }),
});

/** payment is one charge for a plan; Stripe or Apple keeps the receipt. */
export const payment = pgTable(
  "payment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscription.id, { onDelete: "cascade" }),
    account: text("account").notNull().$type<PaymentAccount>(),
    /** paymentIntent is Stripe's id for the charge, or Apple's transaction id, unique so that a repeated event records it once. */
    paymentIntent: text("payment_intent").notNull().unique(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    paidAt: at("paid_at").notNull(),
    /** first marks the plan's first payment, the only one that can be refunded. */
    first: boolean("first").notNull().default(false),
    refundedAt: at("refunded_at"),
  },
  (t) => [index("payment_subscription").on(t.subscriptionId)],
);
