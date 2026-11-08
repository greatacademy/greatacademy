import { Code, ConnectError, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { compileMath } from "@ga/content-math";
import { type Db, payment, schema, subscription } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { Account, BillingService, Interval } from "@ga/proto/billing/v1/billing_pb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { APPLE_BUNDLE, type AppleStatus, type AppleTransaction, type AppStore, planOfProduct, recordApple } from "./apple.ts";
import { addInterval, applyBillingEvent, billingService, type Payments } from "./billing.ts";
import { dbKey, userIdKey } from "./context.ts";
import { localGateway, Registry } from "./registry.ts";

const registry = await Registry.open([localGateway(compileMath())]);
const SUBJECT = registry.listings[0]!.id;
const NOW = Date.UTC(2026, 10, 6, 12);
const DAY = 86_400_000;

let db: Db & { close(): Promise<void> };
let now: number;
let calls: string[];
let transactions: Map<string, AppleTransaction>;
let statuses: Map<string, AppleStatus>;

const store: AppStore = {
  async transaction(id) {
    return transactions.get(id);
  },
  async status(id) {
    const original = transactions.get(id)?.originalTransactionId;
    return original ? statuses.get(original) : undefined;
  },
};

const payments: Payments = {
  wallet: true,
  async checkout() {
    return { id: "cs", url: "https://checkout.stripe.com/x" };
  },
  async setRenewal() {},
  async endNow(sub) {
    calls.push(`end ${sub}`);
  },
  async refund(pi, amount) {
    calls.push(`refund ${pi} ${amount ?? "all"}`);
  },
  async portal() {
    return "";
  },
};

const bill = (user: string) => {
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    req.contextValues.set(userIdKey, user);
    return next(req);
  };
  return createClient(
    BillingService,
    createRouterTransport(
      (router) => router.service(BillingService, billingService({ registry, now: () => now, payments, appStore: store })),
      { router: { interceptors: [auth] } },
    ),
  );
};

async function code(p: Promise<unknown>): Promise<Code | undefined> {
  return p.then(
    () => undefined,
    (e) => ConnectError.from(e).code,
  );
}

const statements = { agreedTerms: true, agreedRenewal: true, agreedRefund: true };

/** bought makes Apple know of a purchase, as the App Store would after the app paid for it. */
function bought(id: string, over: Partial<AppleTransaction>, renews = true): AppleTransaction {
  const t: AppleTransaction = {
    transactionId: id,
    originalTransactionId: "1000",
    productId: `ga.${SUBJECT}.month`,
    bundleId: APPLE_BUNDLE,
    purchaseDate: now,
    expiresDate: addInterval(now, "month"),
    price: 2299,
    currency: "USD",
    environment: "Sandbox",
    ...over,
  };
  transactions.set(id, t);
  statuses.set(t.originalTransactionId, { latest: t, renews });
  return t;
}

const plans = () => db.select().from(subscription);

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "parent");
  now = NOW;
  calls = [];
  transactions = new Map();
  statuses = new Map();
});
afterEach(() => db.close());

describe("App Store", () => {
  it("names products by plan", () => {
    expect(planOfProduct("ga.all.year")).toEqual({ scope: "all", interval: "year" });
    expect(planOfProduct("ga.math.week")).toBeUndefined();
  });

  it("sells an adult a plan for themselves and records it once Apple confirms it", async () => {
    const start = await bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, ...statements });
    expect(start.productId).toBe(`ga.${SUBJECT}.month`);
    const again = await bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, ...statements });
    expect(again.accountToken).toBe(start.accountToken);
    bought("1000", { appAccountToken: start.accountToken });
    expect((await bill("parent").confirmApplePurchase({ transactionId: "1000" })).done).toBe(true);
    expect((await bill("parent").confirmApplePurchase({ transactionId: "1000" })).done).toBe(true);
    const [plan] = await plans();
    expect(plan).toMatchObject({ account: "apple", scope: SUBJECT, apple: `1000/ga.${SUBJECT}.month`, cancelledAt: null });
    expect(plan?.paidUntil.getTime()).toBe(addInterval(NOW, "month"));
    expect(await db.select().from(payment)).toMatchObject([{ paymentIntent: "1000", amount: 2299, first: true }]);
    const [s] = (await bill("parent").listSubscriptions({})).subscriptions;
    expect(s).toMatchObject({ account: Account.APPLE, refundableUntil: 0n });
    expect(await code(bill("parent").cancelSubscription({ id: s!.id }))).toBe(Code.FailedPrecondition);
    expect(await code(bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.YEAR, ...statements }))).toBe(
      Code.AlreadyExists,
    );
  });

  it("refuses minors, unticked statements, another subject beside an App Store one, and other people's purchases", async () => {
    await db.insert(schema.user).values({ id: "teen", name: "teen", email: "teen@example.com" });
    await db.insert(schema.learner).values({ userId: "teen", band: "teen", country: "US" });
    expect(await code(bill("teen").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, ...statements }))).toBe(
      Code.PermissionDenied,
    );
    expect(await code(bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, agreedTerms: true }))).toBe(
      Code.FailedPrecondition,
    );
    const { accountToken } = await bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, ...statements });
    bought("1000", { appAccountToken: accountToken, productId: "ga.english.month" });
    await createUser(db, "other");
    expect((await bill("other").confirmApplePurchase({ transactionId: "1000" })).done).toBe(false);
    expect(await code(bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, ...statements }))).toBe(
      Code.FailedPrecondition,
    );
    await bill("parent").startApplePurchase({ scope: "all", interval: Interval.MONTH, ...statements });
    bought("2000", { appAccountToken: accountToken, bundleId: "com.example.other" });
    expect(await recordApple(db, store, "2000", now, payments)).toBeUndefined();
    expect(await code(bill("parent").confirmApplePurchase({ transactionId: "x" }))).toBe(Code.InvalidArgument);
  });

  it("buys the one App Store subscription for a learner of the payer's choice, and keeps it with them", async () => {
    const { accountToken } = await bill("parent").startApplePurchase({
      scope: SUBJECT,
      interval: Interval.MONTH,
      forNewChild: true,
      ...statements,
    });
    bought("1000", { appAccountToken: accountToken });
    await recordApple(db, store, "1000", now, payments);
    const [waiting] = await plans();
    expect(waiting).toMatchObject({ learnerId: null, account: "apple" });
    // The Apple account already holds it: no second one, for the payer or another child.
    expect(await code(bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, ...statements }))).toBe(
      Code.FailedPrecondition,
    );
    expect(
      await code(bill("parent").startApplePurchase({ scope: "all", interval: Interval.MONTH, forNewChild: true, ...statements })),
    ).toBe(Code.FailedPrecondition);
    // Choosing someone else later does not move the subscription it renews.
    await bill("parent")
      .startApplePurchase({ scope: "all", interval: Interval.YEAR, ...statements })
      .catch(() => undefined);
    now += 30 * DAY;
    bought("1001", { appAccountToken: accountToken, purchaseDate: now, expiresDate: addInterval(now, "month") });
    await recordApple(db, store, "1001", now, payments);
    expect((await plans()).map((r) => r.learnerId)).toEqual([null]);
  });

  it("follows renewals, a turned-off renewal, an upgrade and a refund", async () => {
    const { accountToken } = await bill("parent").startApplePurchase({ scope: SUBJECT, interval: Interval.MONTH, ...statements });
    bought("1000", { appAccountToken: accountToken });
    await recordApple(db, store, "1000", now, payments);
    now += 30 * DAY;
    bought("1001", { appAccountToken: accountToken, purchaseDate: now, expiresDate: addInterval(now, "month") }, false);
    await recordApple(db, store, "1001", now, payments);
    let [plan] = await plans();
    expect(plan?.paidUntil.getTime()).toBe(addInterval(now, "month"));
    expect(plan?.cancelledAt?.getTime()).toBe(now);
    expect((await db.select().from(payment)).map((p) => p.first)).toEqual([true, false]);
    // Upgrading in the App Store moves the same subscription to another product.
    now += DAY;
    bought("1002", { appAccountToken: accountToken, productId: "ga.all.month", price: 5799, expiresDate: addInterval(now, "month") });
    await recordApple(db, store, "1002", now, payments);
    const rows = await plans();
    expect(rows.find((r) => r.scope === SUBJECT)?.paidUntil.getTime()).toBe(now);
    expect(rows.find((r) => r.scope === "all")).toMatchObject({ cancelledAt: null });
    // Apple refunds it.
    now += DAY;
    bought("1002", { appAccountToken: accountToken, productId: "ga.all.month", price: 5799, revocationDate: now });
    await recordApple(db, store, "1002", now, payments);
    [plan] = (await plans()).filter((r) => r.scope === "all");
    expect(plan?.refundedAt?.getTime()).toBe(now);
  });

  it("ends web subject plans when all subjects are bought in the app, refunding their unused time", async () => {
    const learner = (await db.select().from(schema.learner))[0]!.id;
    const meta = { payer: "parent", learner, scope: SUBJECT, interval: "month" as const };
    await applyBillingEvent(
      db,
      { kind: "card-checkout", checkout: "cs_1", meta, stripeSubscription: "sub_1", customer: "cus", paid: true, prepaid: false },
      now,
    );
    await applyBillingEvent(
      db,
      {
        kind: "invoice-paid",
        meta,
        stripeSubscription: "sub_1",
        customer: "cus",
        paymentIntent: "pi_1",
        amount: 1900,
        currency: "usd",
        periodEnd: addInterval(now, "month"),
        first: true,
      },
      now,
    );
    now += 10 * DAY;
    const { accountToken } = await bill("parent").startApplePurchase({ scope: "all", interval: Interval.MONTH, ...statements });
    bought("1000", { appAccountToken: accountToken, productId: "ga.all.month", price: 5799 });
    await recordApple(db, store, "1000", now, payments);
    await recordApple(db, store, "1000", now, payments);
    expect(calls).toEqual(["end sub_1", "refund pi_1 1266"]);
    const card = (await plans()).find((r) => r.account === "card");
    expect(card?.paidUntil.getTime()).toBe(now);
  });
});
