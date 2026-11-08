import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  addPlan,
  assignPlan,
  coveringScopes,
  endPlan,
  extendPlan,
  firstPayment,
  markPlanReminded,
  markRefunded,
  plansToRemind,
  recordPayment,
  waitingPlan,
  walletPlanToExtend,
} from "./billing.ts";
import type { Db } from "./db.ts";
import { learnerFor } from "./learning.ts";
import { createTestDb, createUser } from "./testing.ts";

const DAY = 86_400_000;
const T = Date.UTC(2026, 10, 1);

describe("billing", () => {
  let db: Db & { close(): Promise<void> };
  let learner: string;
  beforeEach(async () => {
    db = await createTestDb();
    await createUser(db, "payer");
    await createUser(db, "kid");
    learner = await learnerFor(db, "kid");
  });
  afterEach(() => db.close());

  const plan = (over: Partial<Parameters<typeof addPlan>[1]> = {}) =>
    addPlan(db, {
      payerId: "payer",
      learnerId: learner,
      scope: "math",
      interval: "month",
      account: "card",
      stripeSubscription: "sub_1",
      paidUntil: new Date(T + 30 * DAY),
      at: new Date(T),
      ...over,
    });

  it("covers a learner until the paid time, and stores a repeated plan once", async () => {
    const a = await plan();
    const b = await plan();
    expect(b.id).toBe(a.id);
    expect(await coveringScopes(db, learner, new Date(T + DAY))).toEqual(["math"]);
    expect(await coveringScopes(db, learner, new Date(T + 31 * DAY))).toEqual([]);
    await extendPlan(db, a.id, new Date(T + 61 * DAY));
    await extendPlan(db, a.id, new Date(T + 40 * DAY));
    expect(await coveringScopes(db, learner, new Date(T + 60 * DAY))).toEqual(["math"]);
    await endPlan(db, a.id, new Date(T + 2 * DAY));
    expect(await coveringScopes(db, learner, new Date(T + 3 * DAY))).toEqual([]);
  });

  it("records a charge once and ends the plan when it is refunded", async () => {
    const a = await plan();
    const charge = {
      subscriptionId: a.id,
      account: "card" as const,
      paymentIntent: "pi_1",
      amount: 1900,
      currency: "usd",
      paidAt: new Date(T),
      first: true,
    };
    expect(await recordPayment(db, charge)).toBe(true);
    expect(await recordPayment(db, charge)).toBe(false);
    expect((await firstPayment(db, a.id))?.paymentIntent).toBe("pi_1");
    await markRefunded(db, a.id, "pi_1", new Date(T + DAY));
    expect(await coveringScopes(db, learner, new Date(T + 2 * DAY))).toEqual([]);
    expect((await firstPayment(db, a.id))?.refundedAt).toEqual(new Date(T + DAY));
  });

  it("keeps a plan bought for a child until the child is added", async () => {
    const a = await plan({ learnerId: null, stripeSubscription: "sub_2" });
    expect((await waitingPlan(db, "payer", new Date(T)))?.id).toBe(a.id);
    await assignPlan(db, a.id, learner);
    expect(await waitingPlan(db, "payer", new Date(T))).toBeUndefined();
    expect(await coveringScopes(db, learner, new Date(T))).toEqual(["math"]);
  });

  it("finds the wallet plan a new payment extends", async () => {
    const a = await plan({ account: "wallet", stripeSubscription: undefined, checkout: "cs_1" });
    const found = await walletPlanToExtend(db, { payerId: "payer", learnerId: learner, scope: "math", interval: "month" });
    expect(found?.id).toBe(a.id);
    expect(await walletPlanToExtend(db, { payerId: "payer", learnerId: learner, scope: "all", interval: "month" })).toBeUndefined();
  });

  it("reminds each period once", async () => {
    const a = await plan();
    const window = [new Date(T + 23 * DAY), new Date(T + 31 * DAY)] as const;
    expect((await plansToRemind(db, ...window)).map((p) => p.id)).toEqual([a.id]);
    await markPlanReminded(db, a.id);
    expect(await plansToRemind(db, ...window)).toEqual([]);
    await extendPlan(db, a.id, new Date(T + 31 * DAY - 1));
    expect((await plansToRemind(db, ...window)).map((p) => p.id)).toEqual([a.id]);
  });
});
