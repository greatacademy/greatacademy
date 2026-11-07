import { type Client, Code, ConnectError, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { compileMath } from "@ga/content-math";
import { type Db, guardianVerification, payment, planByStripe, schema, subscription } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { AdminService } from "@ga/proto/admin/v1/admin_pb";
import { Account, BillingService, Interval } from "@ga/proto/billing/v1/billing_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";
import { PrivacyService } from "@ga/proto/privacy/v1/privacy_pb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { adminService } from "./admin.ts";
import {
  addInterval,
  applyBillingEvent,
  type BillingEvent,
  billingService,
  type CheckoutRequest,
  endPlansOf,
  type Payments,
  type PlanMeta,
  REFUND_WINDOW,
  runBillingReminders,
} from "./billing.ts";
import { accountsKey, type ChildAccounts, dbKey, userIdKey } from "./context.ts";
import { learningService } from "./learning.ts";
import { type FormStore, privacyService } from "./privacy.ts";
import { localGateway, Registry } from "./registry.ts";

const registry = await Registry.open([localGateway(compileMath())]);
const COURSE = "algebra-foundations";
const SUBJECT = registry.listings[0]!.id;
const NOW = Date.UTC(2026, 10, 6, 12);
const DAY = 86_400_000;
const ORIGIN = "https://greatacademy.dev";

let db: Db & { close(): Promise<void> };
let now: number;
let seed: number;
let calls: string[];
let opened: { account: string; req: CheckoutRequest }[];
let billing: boolean;

const payments: Payments = {
  wallet: true,
  async checkout(account, req) {
    opened.push({ account, req });
    return { id: `cs_${opened.length}`, url: `https://checkout.stripe.com/${opened.length}` };
  },
  async setRenewal(sub, renew) {
    calls.push(`renew ${sub} ${renew}`);
  },
  async endNow(sub) {
    calls.push(`end ${sub}`);
  },
  async refund(account, pi) {
    calls.push(`refund ${account} ${pi}`);
  },
  async portal(customer, back) {
    return `https://billing.stripe.com/${customer}?back=${back}`;
  },
};

const store: FormStore = { put: async () => {}, get: async () => undefined, delete: async () => {} };
const accounts: ChildAccounts = {
  async create(username) {
    const id = `child-${username}`;
    await db.insert(schema.user).values({ id, name: username, email: `${id}@child.invalid`, username });
    return id;
  },
  async setPassword() {},
};

const transport = (user: string | undefined) => {
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    req.contextValues.set(userIdKey, user);
    req.contextValues.set(accountsKey, accounts);
    return next(req);
  };
  return createRouterTransport(
    (router) => {
      router.service(BillingService, billingService({ registry, now: () => now, ...(billing && { payments }), origin: ORIGIN }));
      router.service(PrivacyService, privacyService({ now: () => now, forms: store, notify: async () => {}, billing }));
      router.service(AdminService, adminService({ now: () => now, forms: store, notify: async () => {}, aiKeysSecret: "s" }));
      router.service(LearningService, learningService({ registry, now: () => now, seed: () => seed++, billing }));
    },
    { router: { interceptors: [auth] } },
  );
};
const client = <S extends typeof BillingService | typeof PrivacyService | typeof AdminService | typeof LearningService>(
  s: S,
  user?: string,
): Client<S> => createClient(s, transport(user));
const bill = (user?: string) => client(BillingService, user);

async function code(p: Promise<unknown>): Promise<Code | undefined> {
  return p.then(
    () => undefined,
    (e) => ConnectError.from(e).code,
  );
}

const meta = (over: Partial<PlanMeta> = {}): PlanMeta => ({ payer: "parent", learner: "", scope: SUBJECT, interval: "month", ...over });

/** cardBought plays the events of a finished card Checkout: the session, then the first invoice. */
async function cardBought(m: PlanMeta, sub = "sub_1", prepaid = false) {
  const events: BillingEvent[] = [
    { kind: "card-checkout", checkout: `cs_${sub}`, meta: m, stripeSubscription: sub, customer: "cus_1", paid: true, prepaid },
    {
      kind: "invoice-paid",
      meta: m,
      stripeSubscription: sub,
      customer: "cus_1",
      paymentIntent: `pi_${sub}`,
      amount: 1900,
      currency: "usd",
      periodEnd: addInterval(now, m.interval),
      first: true,
    },
  ];
  for (const e of events) await applyBillingEvent(db, e, now);
}

const learnerOf = async (user: string) => (await db.select().from(schema.learner)).find((l) => l.userId === user)?.id ?? "";

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "root");
  await createUser(db, "parent");
  await db.insert(schema.platformAdmin).values({ userId: "root", grantedAt: new Date(NOW) });
  now = NOW;
  seed = 1;
  calls = [];
  opened = [];
  billing = true;
});
afterEach(() => db.close());

describe("addInterval", () => {
  it("adds calendar months and keeps month ends", () => {
    expect(addInterval(Date.UTC(2026, 0, 31, 9), "month")).toBe(Date.UTC(2026, 1, 28, 9));
    expect(addInterval(Date.UTC(2026, 10, 6), "month")).toBe(Date.UTC(2026, 11, 6));
    expect(addInterval(Date.UTC(2028, 1, 29), "year")).toBe(Date.UTC(2029, 1, 28));
  });
});

describe("checkout", () => {
  const base = {
    scope: "all",
    interval: Interval.YEAR,
    account: Account.CARD,
    agreedTerms: true,
    agreedRenewal: true,
    agreedRefund: true,
    returnUrl: `${ORIGIN}/plans`,
    locale: "zh-CN",
  };

  it("opens Stripe for an adult who ticked every statement", async () => {
    const { url } = await bill("parent").startCheckout(base);
    expect(url).toBe("https://checkout.stripe.com/1");
    const [o] = opened;
    expect(o?.account).toBe("main");
    expect(o?.req.amount).toBe(49900);
    expect(o?.req.meta).toEqual({ payer: "parent", learner: await learnerOf("parent"), scope: "all", interval: "year" });
    expect(o?.req.successUrl).toBe(`${ORIGIN}/plans?checkout={CHECKOUT_SESSION_ID}`);
    expect(o?.req.locale).toBe("zh");
    expect(o?.req.email).toBe("parent@example.com");
  });

  it("asks for every statement, renewal only for cards", async () => {
    expect(await code(bill("parent").startCheckout({ ...base, agreedRenewal: false }))).toBe(Code.FailedPrecondition);
    expect(await code(bill("parent").startCheckout({ ...base, agreedRefund: false }))).toBe(Code.FailedPrecondition);
    expect(await code(bill("parent").startCheckout({ ...base, agreedTerms: false }))).toBe(Code.FailedPrecondition);
    await bill("parent").startCheckout({
      ...base,
      account: Account.WALLET,
      agreedRenewal: false,
      scope: SUBJECT,
      interval: Interval.MONTH,
    });
    expect(opened[0]?.account).toBe("wallet");
    expect(opened[0]?.req.amount).toBe(1900);
  });

  it("refuses minors, other sites, unknown plans and learners, and an unset Stripe", async () => {
    await db.insert(schema.user).values({ id: "teen", name: "teen", email: "teen@example.com" });
    await db.insert(schema.learner).values({ userId: "teen", band: "teen", country: "US" });
    expect(await code(bill("teen").startCheckout(base))).toBe(Code.PermissionDenied);
    expect(await code(bill("parent").startCheckout({ ...base, returnUrl: "https://evil.example/plans" }))).toBe(Code.InvalidArgument);
    expect(await code(bill("parent").startCheckout({ ...base, scope: "cooking" }))).toBe(Code.InvalidArgument);
    expect(await code(bill("parent").startCheckout({ ...base, learnerId: await learnerOf("teen") }))).toBe(Code.NotFound);
    expect(await code(bill().startCheckout(base))).toBe(Code.Unauthenticated);
    billing = false;
    expect(await code(bill("parent").startCheckout(base))).toBe(Code.FailedPrecondition);
    expect((await bill().listPlans({})).required).toBe(false);
  });

  it("leaves a plan for a new child unassigned", async () => {
    await bill("parent").startCheckout({ ...base, forNewChild: true });
    expect(opened[0]?.req.meta.learner).toBe("");
  });
});

describe("events", () => {
  it("record a card plan once, however often or in whatever order they arrive", async () => {
    const m = meta({ learner: await learnerOf("parent") });
    const invoice: BillingEvent = {
      kind: "invoice-paid",
      meta: m,
      stripeSubscription: "sub_1",
      customer: "cus_1",
      paymentIntent: "pi_1",
      amount: 1900,
      currency: "usd",
      periodEnd: NOW + 30 * DAY,
      first: true,
    };
    await applyBillingEvent(db, invoice, now);
    await applyBillingEvent(db, invoice, now);
    await applyBillingEvent(
      db,
      { kind: "card-checkout", checkout: "cs_1", meta: m, stripeSubscription: "sub_1", customer: "cus_1", paid: true, prepaid: false },
      now,
    );
    expect(await db.select().from(subscription)).toHaveLength(1);
    expect(await db.select().from(payment)).toHaveLength(1);
    expect((await planByStripe(db, "sub_1"))?.paidUntil.getTime()).toBe(NOW + 30 * DAY);
    // A renewal extends; a late copy of an older invoice never shortens.
    await applyBillingEvent(db, { ...invoice, paymentIntent: "pi_2", periodEnd: NOW + 60 * DAY, first: false }, now);
    await applyBillingEvent(db, invoice, now);
    expect((await planByStripe(db, "sub_1"))?.paidUntil.getTime()).toBe(NOW + 60 * DAY);
    await applyBillingEvent(db, { kind: "renewal-changed", stripeSubscription: "sub_1", renews: false }, now);
    expect((await planByStripe(db, "sub_1"))?.cancelledAt).not.toBeNull();
    await applyBillingEvent(db, { kind: "renewal-changed", stripeSubscription: "sub_1", renews: true }, now);
    expect((await planByStripe(db, "sub_1"))?.cancelledAt).toBeNull();
    await applyBillingEvent(db, { kind: "subscription-ended", stripeSubscription: "sub_1" }, now + DAY);
    expect((await planByStripe(db, "sub_1"))?.paidUntil.getTime()).toBe(NOW + DAY);
  });

  it("verify a guardian by a card that is not prepaid", async () => {
    await cardBought(meta(), "sub_pre", true);
    expect(await db.select().from(guardianVerification)).toHaveLength(0);
    await cardBought(meta(), "sub_card");
    await cardBought(meta(), "sub_more");
    const rows = await db.select().from(guardianVerification);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ method: "card", status: "approved" });
  });

  it("extend a wallet plan by each payment, never twice for one", async () => {
    const m = meta({ learner: await learnerOf("parent") });
    const paid = (checkout: string, at: number): Promise<void> =>
      applyBillingEvent(db, { kind: "wallet-paid", checkout, meta: m, paymentIntent: `pi_${checkout}`, amount: 1900, currency: "cny" }, at);
    await paid("cs_a", NOW);
    await paid("cs_a", NOW);
    let [plan] = await db.select().from(subscription);
    expect(plan?.paidUntil.getTime()).toBe(Date.UTC(2026, 11, 6, 12));
    // Paid early: the next month follows the current one.
    await paid("cs_b", NOW + 10 * DAY);
    [plan] = await db.select().from(subscription);
    expect(plan?.paidUntil.getTime()).toBe(Date.UTC(2027, 0, 6, 12));
    // Paid after it lapsed: the month starts then.
    const late = Date.UTC(2027, 2, 1);
    await paid("cs_c", late);
    [plan] = await db.select().from(subscription);
    expect(plan?.paidUntil.getTime()).toBe(Date.UTC(2027, 3, 1));
    const rows = await db.select().from(payment);
    expect(rows.map((r) => r.first)).toEqual([true, false, false]);
    expect(await db.select().from(guardianVerification)).toHaveLength(0);
  });
});

describe("plans", () => {
  it("cancel, resume and refund within 30 days", async () => {
    await cardBought(meta({ learner: await learnerOf("parent") }));
    const [s] = (await bill("parent").listSubscriptions({})).subscriptions;
    expect(s).toMatchObject({ scope: SUBJECT, account: Account.CARD, payer: true, cancelled: false });
    expect(s?.refundableUntil).toBe(BigInt(NOW + REFUND_WINDOW));
    await bill("parent").cancelSubscription({ id: s!.id });
    await bill("parent").cancelSubscription({ id: s!.id, resume: true });
    expect(calls).toEqual(["renew sub_1 false", "renew sub_1 true"]);
    expect(await code(bill("root").refundSubscription({ id: s!.id }))).toBe(Code.NotFound);
    now += 10 * DAY;
    await bill("parent").refundSubscription({ id: s!.id });
    expect(calls.slice(2)).toEqual(["refund main pi_sub_1", "end sub_1"]);
    const [after] = (await bill("parent").listSubscriptions({})).subscriptions;
    expect(after).toMatchObject({ refunded: true, refundableUntil: 0n });
    expect(after?.paidUntil).toBe(BigInt(now));
    expect(await code(bill("parent").refundSubscription({ id: s!.id }))).toBe(Code.FailedPrecondition);
  });

  it("refund nothing after 30 days", async () => {
    await cardBought(meta({ learner: await learnerOf("parent") }));
    const [s] = (await bill("parent").listSubscriptions({})).subscriptions;
    now += REFUND_WINDOW + 1;
    expect(await code(bill("parent").refundSubscription({ id: s!.id }))).toBe(Code.FailedPrecondition);
    expect(calls).toEqual([]);
  });

  it("gate study by plan only while billing is on", async () => {
    const learning = { enroll: (r: { courseId: string }) => client(LearningService, "parent").enroll(r) };
    expect(await code(learning.enroll({ courseId: COURSE }))).toBe(Code.PermissionDenied);
    expect((await client(PrivacyService, "parent").getAccess({})).billing).toBe(true);
    billing = false;
    await learning.enroll({ courseId: COURSE });
    billing = true;
    await client(AdminService, "root").grantPlan({ email: "parent@example.com", scope: SUBJECT, days: 7 });
    expect((await client(PrivacyService, "parent").getAccess({})).covered).toEqual([SUBJECT]);
    await learning.enroll({ courseId: COURSE });
    now += 8 * DAY;
    expect(await code(learning.enroll({ courseId: COURSE }))).toBe(Code.PermissionDenied);
  });

  it("validate grants", async () => {
    const admin = client(AdminService, "root");
    expect(await code(admin.grantPlan({ email: "parent@example.com", scope: "Bad Scope", days: 7 }))).toBe(Code.InvalidArgument);
    expect(await code(admin.grantPlan({ email: "parent@example.com", scope: SUBJECT, days: 0 }))).toBe(Code.InvalidArgument);
    expect(await code(admin.grantPlan({ email: "nobody@example.com", scope: SUBJECT, days: 7 }))).toBe(Code.NotFound);
    expect(await code(client(AdminService, "parent").grantPlan({ email: "parent@example.com", scope: SUBJECT, days: 7 }))).toBe(
      Code.NotFound,
    );
  });

  it("give a waiting plan to the next child", async () => {
    await cardBought(meta());
    const privacy = client(PrivacyService, "parent");
    const add = (username: string) =>
      privacy.addChild({ username, password: "long-enough", country: "US", birthYear: 2016, birthMonth: 5 });
    await client(AdminService, "root").setMarketOpen({
      country: "US",
      open: true,
      signedOffBy: "Counsel",
      signedOffOn: "2026-11-01",
      languageGapAccepted: true,
    });
    const { learnerId } = await add("kid01");
    const [plan] = await db.select().from(subscription);
    expect(plan?.learnerId).toBe(learnerId);
    expect(await code(add("kid02"))).toBe(Code.FailedPrecondition);
    const subs = (await bill("parent").listSubscriptions({})).subscriptions;
    expect(subs[0]?.learnerName).toBe("kid01");
  });
});

describe("deleting an account", () => {
  it("ends the card plans that still run", async () => {
    await cardBought(meta(), "sub_live");
    await cardBought(meta(), "sub_gone");
    await applyBillingEvent(db, { kind: "subscription-ended", stripeSubscription: "sub_gone" }, now);
    now += DAY;
    await endPlansOf(db, payments, "parent", now);
    expect(calls).toEqual(["end sub_live"]);
    expect((await planByStripe(db, "sub_live"))?.paidUntil.getTime()).toBe(now);
  });
});

describe("reminders", () => {
  it("tell a payer once per period", async () => {
    await cardBought(meta({ learner: await learnerOf("parent") }));
    const sent: string[] = [];
    const remind = async (to: string, kind: string) => void sent.push(`${to} ${kind}`);
    expect(await runBillingReminders(db, now, remind)).toBe(0);
    now = addInterval(NOW, "month") - 3 * DAY;
    await runBillingReminders(db, now, remind);
    await runBillingReminders(db, now + DAY, remind);
    expect(sent).toEqual(["parent@example.com renews-soon"]);
  });
});
