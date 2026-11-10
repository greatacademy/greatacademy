import { type Client, Code, ConnectError, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { compileMath } from "@ga/content-math";
import {
  answer,
  calibrationPassed,
  consent,
  type Db,
  enrollment,
  event,
  guardian,
  guardianVerification,
  learner,
  learnerFor,
  recordCalibration,
  schema,
  session,
  taskSession,
} from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { DAY } from "@ga/engine";
import { AccountService } from "@ga/proto/account/v1/account_pb";
import { AdminService } from "@ga/proto/admin/v1/admin_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";
import { AccessStatus, Band, PrivacyService } from "@ga/proto/privacy/v1/privacy_pb";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { accountService } from "./account.ts";
import { adminService } from "./admin.ts";
import { qualifyingRoute, startOfDay } from "./capabilities.ts";
import { accountsKey, type ChildAccounts, dbKey, userIdKey } from "./context.ts";
import { learningService } from "./learning.ts";
import { type FormStore, privacyService } from "./privacy.ts";
import { localGateway, Registry } from "./registry.ts";
import { RETENTION, runRetention } from "./retention.ts";
import { decryptSecret } from "./secrets.ts";

const registry = await Registry.open([localGateway(compileMath())]);
const COURSE = "algebra-foundations";
const NOW = Date.UTC(2026, 10, 6, 12);
const SECRET = "test-secret";
const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 1]);

let db: Db & { close(): Promise<void> };
let now: number;
let seed: number;
let forms: Map<string, Uint8Array>;
let sent: { to: string; kind: string }[];

const store: FormStore = {
  put: async (k, f) => void forms.set(k, f),
  get: async (k) => forms.get(k),
  delete: async (k) => void forms.delete(k),
};
const notify = async (to: string, kind: string) => void sent.push({ to, kind });

const accounts: ChildAccounts = {
  async create(name, username) {
    const id = `child-${username}`;
    await db
      .insert(schema.user)
      .values({ id, name, email: `${id}@child.invalid`, username: username.toLowerCase(), displayUsername: username });
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
      router.service(AccountService, accountService({ registry, now: () => now }));
      router.service(PrivacyService, privacyService({ now: () => now, forms: store, notify }));
      router.service(AdminService, adminService({ now: () => now, forms: store, notify, aiKeysSecret: SECRET }));
      router.service(LearningService, learningService({ registry, now: () => now, seed: () => seed++ }));
    },
    { router: { interceptors: [auth] } },
  );
};
const privacy = (user?: string): Client<typeof PrivacyService> => createClient(PrivacyService, transport(user));
const admin = (user?: string): Client<typeof AdminService> => createClient(AdminService, transport(user));
const learning = (user?: string): Client<typeof LearningService> => createClient(LearningService, transport(user));

async function code(p: Promise<unknown>): Promise<Code | undefined> {
  return p.then(
    () => undefined,
    (e) => ConnectError.from(e).code,
  );
}

/** newUser signs someone up without answering the age question. */
async function newUser(id: string) {
  await db.insert(schema.user).values({ id, name: id, email: `${id}@example.com` });
}

/** openMarket makes "root" an administrator and opens a market. */
async function openMarket(country: string) {
  await admin("root").setMarketOpen({ country, open: true, signedOffBy: "Counsel", signedOffOn: "2026-11-01", languageGapAccepted: true });
}

/** verified gives a guardian an approved signed form. */
async function verified(user: string) {
  await privacy(user).submitVerification({ form: PDF, contentType: "application/pdf" });
  const { verifications } = await admin("root").listVerifications({});
  await admin("root").decideVerification({ id: verifications[0]!.id, approve: true });
}

/** child makes a verified guardian's child in an open market, with basic consent. */
async function child(guardianUser: string, username = "kid01") {
  const { learnerId } = await privacy(guardianUser).addChild({
    name: "Kid",
    username,
    password: "long-enough",
    country: "US",
    birthYear: 2016,
    birthMonth: 5,
  });
  await privacy(guardianUser).grantConsent({ learnerId, scope: "basic" });
  return { learnerId, user: `child-${username}` };
}

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "root");
  await createUser(db, "parent");
  await db.insert(schema.platformAdmin).values({ userId: "root", grantedAt: new Date(NOW) });
  now = NOW;
  seed = 1;
  forms = new Map();
  sent = [];
});
afterEach(() => db.close());

describe("the age question", () => {
  it("needs no account, stores nothing and reports closed markets", async () => {
    const before = await db.select().from(learner);
    expect(await privacy().checkAge({ country: "US", birthYear: 1990, birthMonth: 1 })).toMatchObject({ band: Band.ADULT, closed: false });
    expect(await privacy().checkAge({ country: "US", birthYear: 2012, birthMonth: 1 })).toMatchObject({ band: Band.TEEN, closed: true });
    expect(await db.select().from(learner)).toEqual(before);
    await openMarket("US");
    expect(await privacy().checkAge({ country: "US", birthYear: 2012, birthMonth: 1 })).toMatchObject({ band: Band.TEEN, closed: false });
    expect(await privacy().checkAge({ country: "CN", birthYear: 2012, birthMonth: 1 })).toMatchObject({ closed: true });
    expect(await privacy().checkAge({ country: "other", birthYear: 2012, birthMonth: 1 })).toMatchObject({
      band: Band.CHILD,
      closed: true,
    });
    expect(await code(privacy().checkAge({ country: "ZZ", birthYear: 2000, birthMonth: 1 }))).toBe(Code.InvalidArgument);
  });

  it("is required before study, can be answered once, and keeps no birth date", async () => {
    await newUser("u");
    expect((await privacy("u").getAccess({})).status).toBe(AccessStatus.NEEDS_AGE);
    expect(await code(learning("u").chooseCourse({ courseId: COURSE }))).toBe(Code.PermissionDenied);
    await privacy("u").setAge({ country: "US", birthYear: 1990, birthMonth: 3 });
    expect((await privacy("u").getAccess({})).status).toBe(AccessStatus.OK);
    expect(await code(privacy("u").setAge({ country: "US", birthYear: 2000, birthMonth: 3 }))).toBe(Code.FailedPrecondition);
    await learning("u").chooseCourse({ courseId: COURSE });
    const columns = Object.keys((await db.select().from(learner).where(eq(learner.band, "adult")))[0]!);
    expect(columns.filter((c) => /birth/i.test(c))).toEqual([]);
  });

  it("does not let a bypassed sign-up study as a child", async () => {
    await openMarket("US");
    await newUser("u");
    await privacy("u").setAge({ country: "US", birthYear: 2018, birthMonth: 1 });
    expect((await privacy("u").getAccess({})).status).toBe(AccessStatus.NEEDS_GUARDIAN);
    expect(await code(learning("u").chooseCourse({ courseId: COURSE }))).toBe(Code.PermissionDenied);
  });

  it("closes minors out of a market that is not open, leaving adults alone", async () => {
    await newUser("teen");
    await privacy("teen").setAge({ country: "BR", birthYear: 2009, birthMonth: 1 });
    expect((await privacy("teen").getAccess({})).status).toBe(AccessStatus.MARKET_CLOSED);
    await newUser("grown");
    await privacy("grown").setAge({ country: "CN", birthYear: 1990, birthMonth: 1 });
    expect((await privacy("grown").getAccess({})).status).toBe(AccessStatus.OK);
  });

  it("lets a teen decide their course until a guardian follows them, and then only the guardian", async () => {
    await openMarket("US");
    await newUser("teen");
    await privacy("teen").setAge({ country: "US", birthYear: 2010, birthMonth: 1 });
    await learning("teen").chooseCourse({ courseId: COURSE });
    expect((await learning("teen").getProfile({ timeZone: "UTC" })).canDecide).toBe(true);
    const account = (user: string) => createClient(AccountService, transport(user));
    const { code: invite } = await account("teen").createGuardianInvite({});
    const { learnerId } = await account("parent").acceptGuardianInvite({ code: invite });
    expect((await learning("teen").getProfile({ timeZone: "UTC" })).canDecide).toBe(false);
    expect(await code(learning("teen").chooseCourse({ courseId: "prealgebra" }))).toBe(Code.PermissionDenied);
    const goals = { weekdays: [], paused: false };
    expect(await code(learning("teen").setGoals({ subjectId: "math", goals }))).toBe(Code.PermissionDenied);
    expect(await code(learning("teen").setEndDate({ subjectId: "math", endDate: "" }))).toBe(Code.PermissionDenied);
    await learning("parent").chooseCourse({ courseId: "prealgebra", learnerId });
    expect((await learning("parent").getDashboard({ courseId: "prealgebra", timeZone: "UTC", learnerId })).canDecide).toBe(true);
  });

  it("widens nothing when a band ends until the learner confirms", async () => {
    await openMarket("US");
    await newUser("teen");
    await privacy("teen").setAge({ country: "US", birthYear: 2010, birthMonth: 1 });
    expect(await code(privacy("teen").confirmBand({}))).toBe(Code.FailedPrecondition);
    now = Date.UTC(2028, 2, 1);
    const a = await privacy("teen").getAccess({});
    expect(a.band).toBe(Band.TEEN);
    expect(a.nextBand).toBe(Band.ADULT);
    await privacy("teen").confirmBand({});
    expect((await privacy("teen").getAccess({})).band).toBe(Band.ADULT);
  });

  it("moves a teen to the stricter row", async () => {
    await openMarket("US");
    await newUser("teen");
    await privacy("teen").setAge({ country: "US", birthYear: 2012, birthMonth: 1 });
    await privacy("teen").setCountry({ country: "JP" });
    const a = await privacy("teen").getAccess({});
    expect(a.band).toBe(Band.CHILD);
    expect(a.status).toBe(AccessStatus.MARKET_CLOSED);
  });
});

describe("guardians", () => {
  beforeEach(() => openMarket("US"));

  it("verify with a form that is deleted on either decision", async () => {
    expect(
      await code(
        privacy("parent").addChild({
          name: "Kid",
          username: "kid01",
          password: "long-enough",
          country: "US",
          birthYear: 2016,
          birthMonth: 5,
        }),
      ),
    ).toBe(Code.FailedPrecondition);
    await privacy("parent").submitVerification({ form: PDF, contentType: "application/pdf" });
    expect(forms.size).toBe(1);
    const { verifications } = await admin("root").listVerifications({});
    expect((await admin("root").getVerificationForm({ id: verifications[0]!.id })).form).toEqual(PDF);
    expect(await code(admin("root").decideVerification({ id: verifications[0]!.id, approve: false }))).toBe(Code.InvalidArgument);
    await admin("root").decideVerification({ id: verifications[0]!.id, approve: false, reason: "unreadable" });
    expect(forms.size).toBe(0);
    expect(await privacy("parent").getVerification({})).toMatchObject({ status: "refused", reason: "unreadable" });
    expect(sent).toEqual([{ to: "parent@example.com", kind: "verification-decided" }]);
    const [row] = await db.select().from(guardianVerification);
    expect(row?.formKey).toBeNull();
    now += 60_000;
    await verified("parent");
    expect((await privacy("parent").getVerification({})).status).toBe("approved");
  });

  it("refuse forms of the wrong type or size, and minors", async () => {
    expect(await code(privacy("parent").submitVerification({ form: new Uint8Array([1]), contentType: "text/html" }))).toBe(
      Code.InvalidArgument,
    );
    expect(await code(privacy("parent").submitVerification({ form: PDF, contentType: "image/png" }))).toBe(Code.InvalidArgument);
    expect(
      await code(privacy("parent").submitVerification({ form: new Uint8Array(5 * 1024 * 1024 + 1), contentType: "application/pdf" })),
    ).toBe(Code.InvalidArgument);
    await newUser("teen");
    await privacy("teen").setAge({ country: "US", birthYear: 2010, birthMonth: 1 });
    expect(await code(privacy("teen").submitVerification({ form: PDF, contentType: "application/pdf" }))).toBe(Code.PermissionDenied);
  });

  it("add a child who studies only after consent", async () => {
    await verified("parent");
    const { learnerId } = await privacy("parent").addChild({
      name: "Kid",
      username: "kid01",
      password: "long-enough",
      country: "US",
      birthYear: 2016,
      birthMonth: 5,
    });
    const kid = "child-kid01";
    expect((await privacy(kid).getAccess({})).status).toBe(AccessStatus.NEEDS_GUARDIAN);
    expect(await code(learning(kid).chooseCourse({ courseId: COURSE }))).toBe(Code.PermissionDenied);
    await privacy("parent").grantConsent({ learnerId, scope: "basic" });
    const a = await privacy(kid).getAccess({});
    expect(a.status).toBe(AccessStatus.OK);
    expect(a.managed).toBe(true);
    // A child studies the course their guardian chooses.
    expect(await code(learning(kid).chooseCourse({ courseId: COURSE }))).toBe(Code.PermissionDenied);
    await learning("parent").chooseCourse({ courseId: COURSE, learnerId });
    expect((await learning(kid).getDashboard({ courseId: COURSE, timeZone: "UTC" })).canDecide).toBe(false);
    const account = createClient(AccountService, transport(kid));
    // A child's name stays private; their username is what a league shows, and they may join one.
    expect(await account.getSettings({})).toMatchObject({ username: "kid01", leagues: false });
    await account.setUsername({ username: "Kid-One" });
    await account.setLeagues({ enabled: true });
    expect(await account.getSettings({})).toMatchObject({ username: "Kid-One", leagues: true });
  });

  it("cannot add a teen as a child, or a child in a closed market", async () => {
    await verified("parent");
    expect(
      await code(
        privacy("parent").addChild({
          name: "Kid",
          username: "kid02",
          password: "long-enough",
          country: "US",
          birthYear: 2010,
          birthMonth: 5,
        }),
      ),
    ).toBe(Code.FailedPrecondition);
    expect(
      await code(
        privacy("parent").addChild({
          name: "Kid",
          username: "kid02",
          password: "long-enough",
          country: "BR",
          birthYear: 2016,
          birthMonth: 5,
        }),
      ),
    ).toBe(Code.FailedPrecondition);
    expect(
      await code(
        privacy("parent").addChild({ name: "Kid", username: "kid02", password: "short", country: "US", birthYear: 2016, birthMonth: 5 }),
      ),
    ).toBe(Code.InvalidArgument);
  });

  it("lose a child's access when consent is withdrawn or expires, by either of them", async () => {
    await verified("parent");
    const { learnerId, user } = await child("parent");
    now += 366 * DAY;
    expect((await privacy(user).getAccess({})).status).toBe(AccessStatus.NEEDS_GUARDIAN);
    await privacy("parent").grantConsent({ learnerId, scope: "basic" });
    expect((await privacy(user).getAccess({})).status).toBe(AccessStatus.OK);
    await privacy(user).withdrawConsent({ scope: "basic" });
    expect((await privacy(user).getAccess({})).status).toBe(AccessStatus.NEEDS_GUARDIAN);
    expect(sent).toContainEqual({ to: "parent@example.com", kind: "child-reduced" });
    const log = await db.select().from(consent);
    expect(log).toHaveLength(2);
  });

  it("keep others out, and an unverified guardian from consenting", async () => {
    await verified("parent");
    const { learnerId } = await child("parent");
    await createUser(db, "stranger");
    for (const call of [
      privacy("stranger").grantConsent({ learnerId, scope: "basic" }),
      privacy("stranger").exportData({ learnerId }),
      privacy("stranger").deleteChild({ learnerId }),
      privacy("stranger").resetChildPassword({ learnerId, password: "long-enough" }),
      privacy("stranger").setTimeLimit({ learnerId, minutes: 10 }),
    ])
      expect(await code(call)).toBe(Code.NotFound);
    await db.insert(guardian).values({ userId: "stranger", learnerId });
    expect(await code(privacy("stranger").grantConsent({ learnerId, scope: "basic" }))).toBe(Code.FailedPrecondition);
  });

  it("never have conversation or research on offer, and AI scopes wait for a vendor", async () => {
    await verified("parent");
    const { learnerId } = await child("parent");
    for (const scope of ["conversation", "research", "writing", "speech"])
      expect(await code(privacy("parent").grantConsent({ learnerId, scope }))).toBe(Code.FailedPrecondition);
    const { scopes } = await privacy("parent").listConsents({ learnerId });
    expect(scopes.find((s) => s.scope === "basic")).toMatchObject({ inForce: true, canGrant: true });
    expect(scopes.find((s) => s.scope === "conversation")).toMatchObject({ inForce: false, canGrant: false });
  });

  it("set a daily limit counted in the learner's day", async () => {
    await verified("parent");
    const { learnerId, user } = await child("parent");
    await learning("parent").chooseCourse({ courseId: COURSE, learnerId });
    await learning(user).skipDiagnostic({ courseId: COURSE });
    await privacy("parent").setTimeLimit({ learnerId, minutes: 20 });
    expect(await code(privacy(user).setTimeLimit({ learnerId: "", minutes: 0 }))).toBe(Code.PermissionDenied);
    const offered = (await learning(user).getDashboard({ courseId: COURSE, timeZone: "UTC" })).tasks[0]!;
    const first = await learning(user).startTask({ courseId: COURSE, task: offered, timeZone: "UTC" });
    now += 30 * 60_000;
    await db
      .update(taskSession)
      .set({ updatedAt: new Date(now), status: "abandoned" })
      .where(eq(taskSession.id, first.session!.id));
    expect(await code(learning(user).startTask({ courseId: COURSE, task: offered, timeZone: "UTC" }))).toBe(Code.ResourceExhausted);
    now += DAY;
    expect(await code(learning(user).startTask({ courseId: COURSE, task: offered, timeZone: "UTC" }))).toBeUndefined();
  });

  it("delete a child leaving no row of them", async () => {
    await verified("parent");
    const { learnerId, user } = await child("parent");
    await learning("parent").chooseCourse({ courseId: COURSE, learnerId });
    await learning(user).skipDiagnostic({ courseId: COURSE });
    const offered = (await learning(user).getDashboard({ courseId: COURSE, timeZone: "UTC" })).tasks[0]!;
    await learning(user).startTask({ courseId: COURSE, task: offered });
    await privacy("parent").deleteChild({ learnerId });
    for (const table of [learner, enrollment, event, taskSession, answer, consent, guardian]) {
      const rows = await db.select().from(table);
      expect(JSON.stringify(rows)).not.toContain(learnerId);
    }
    expect(await db.select().from(schema.user).where(eq(schema.user.id, user))).toEqual([]);
    expect((await privacy("parent").listConsents({ learnerId: "" })).consents).toEqual([]);
  });
});

describe("free text", () => {
  const MARK = "MARKED-TEXT-7f3a";

  beforeEach(() => openMarket("US"));

  async function studied() {
    await newUser("teen");
    await privacy("teen").setAge({ country: "US", birthYear: 2010, birthMonth: 1 });
    await learning("teen").chooseCourse({ courseId: COURSE });
    await learning("teen").skipDiagnostic({ courseId: COURSE });
    const offered = (await learning("teen").getDashboard({ courseId: COURSE, timeZone: "UTC" })).tasks[0]!;
    const s = (await learning("teen").startTask({ courseId: COURSE, task: offered })).session!;
    const res = await learning("teen").submitAnswer({ sessionId: s.id, index: 0, response: MARK });
    const learnerId = await learnerFor(db, "teen");
    // A judged text, as a writing topic leaves it: the verdict quotes the learner.
    const at = new Date(now);
    await db.insert(schema.judgment).values({
      sessionId: s.id,
      learnerId,
      index: 1,
      attempt: 1,
      topicId: "t",
      kp: 0,
      seed: 1,
      response: MARK,
      criteria: ["c@1"],
      status: "done",
      verdict: {
        criteria: [{ id: "c", version: "1", met: true, quotation: MARK, note: MARK }],
        feedback: [{ point: MARK, quotation: MARK }],
      },
      createdAt: at,
      nextAt: at,
    });
    return { learnerId, res };
  }

  const judgmentsKeepOnlyMet = async () => {
    const [j] = await db.select().from(schema.judgment);
    expect(JSON.stringify(j)).not.toContain(MARK);
    expect(j?.verdict).toEqual({ criteria: [{ id: "c", version: "1", met: true, quotation: "", note: "" }], feedback: [] });
  };

  it("never reaches the event log", async () => {
    const { learnerId } = await studied();
    expect((await db.select().from(answer).where(eq(answer.learnerId, learnerId))).map((a) => a.response)).toContain(MARK);
    expect(JSON.stringify(await db.select().from(event).where(eq(event.learnerId, learnerId)))).not.toContain(MARK);
    expect(JSON.stringify(await db.select().from(schema.adminLog))).not.toContain(MARK);
  });

  it("is emptied on request, in answers and finished runs, keeping whether it was right", async () => {
    const { learnerId } = await studied();
    const before = (await db.select().from(answer).where(eq(answer.learnerId, learnerId)))[0]!;
    await db.update(taskSession).set({ status: "abandoned" }).where(eq(taskSession.learnerId, learnerId));
    await privacy("teen").deleteResponses({ learnerId: "" });
    const after = (await db.select().from(answer).where(eq(answer.learnerId, learnerId)))[0]!;
    expect(after.response).toBe("");
    expect(after.correct).toBe(before.correct);
    expect(JSON.stringify(await db.select().from(taskSession).where(eq(taskSession.learnerId, learnerId)))).not.toContain(MARK);
    await judgmentsKeepOnlyMet();
  });

  it("is emptied by the retention run only after its period, and only for that band", async () => {
    const { learnerId } = await studied();
    await db.update(taskSession).set({ status: "abandoned" }).where(eq(taskSession.learnerId, learnerId));
    const deps = { forms: store, notify };
    await runRetention(db, now + RETENTION.teenResponses - DAY, deps);
    expect(JSON.stringify(await db.select().from(answer))).toContain(MARK);
    expect(JSON.stringify(await db.select().from(schema.judgment))).toContain(MARK);
    expect((await runRetention(db, now + RETENTION.teenResponses + DAY, deps)).responses).toBe(1);
    expect(JSON.stringify(await db.select().from(answer))).not.toContain(MARK);
    expect(JSON.stringify(await db.select().from(taskSession))).not.toContain(MARK);
    await judgmentsKeepOnlyMet();
    expect((await runRetention(db, now + RETENTION.teenResponses + 2 * DAY, deps)).responses).toBe(0);
  });
});

describe("the retention run", () => {
  beforeEach(() => openMarket("US"));
  const deps = () => ({ forms: store, notify });

  it("empties old addresses and browsers", async () => {
    await db.insert(session).values({
      id: "s1",
      token: "t1",
      userId: "parent",
      expiresAt: new Date(now + 90 * DAY),
      createdAt: new Date(now),
      ipAddress: "192.0.2.1",
      userAgent: "test",
    });
    expect((await runRetention(db, now + 29 * DAY, deps())).traces).toBe(0);
    expect((await runRetention(db, now + 31 * DAY, deps())).traces).toBe(1);
    expect((await db.select().from(session))[0]).toMatchObject({ ipAddress: null, userAgent: null });
  });

  it("reminds about expiring consent once", async () => {
    await verified("parent");
    await child("parent");
    sent = [];
    await runRetention(db, now + 340 * DAY, deps());
    expect(sent).toEqual([{ to: "parent@example.com", kind: "consent-expiring" }]);
    await runRetention(db, now + 341 * DAY, deps());
    expect(sent).toHaveLength(1);
  });

  it("gives an inactive minor notice, then deletes unless they come back; adults stay", async () => {
    await verified("parent");
    const a = await child("parent", "kid01");
    const b = await child("parent", "kid02");
    await newUser("grown");
    await privacy("grown").setAge({ country: "US", birthYear: 1990, birthMonth: 1 });
    // The rows' creation time defaults to the wall clock; the test's clock decides instead.
    await db.update(learner).set({ createdAt: new Date(now) });
    sent = [];
    const t0 = now + RETENTION.inactive + DAY;
    expect((await runRetention(db, t0, deps())).notices).toBe(2);
    expect(sent.filter((s) => s.kind === "account-inactive")).toHaveLength(2);
    await db.insert(session).values({
      id: "s2",
      token: "t2",
      userId: b.user,
      expiresAt: new Date(t0 + 90 * DAY),
      createdAt: new Date(t0 + DAY),
      updatedAt: new Date(t0 + DAY),
    });
    const result = await runRetention(db, t0 + RETENTION.inactiveNotice + DAY, deps());
    expect(result.deleted).toBe(1);
    const left = (await db.select({ id: learner.id }).from(learner)).map((r) => r.id);
    expect(left).not.toContain(a.learnerId);
    expect(left).toContain(b.learnerId);
    expect(await db.select().from(schema.user).where(eq(schema.user.id, "grown"))).toHaveLength(1);
  });

  it("is on the overview after it runs", async () => {
    await runRetention(db, now, deps());
    const o = await admin("root").getOverview({});
    expect(o.lastRetentionAt).toBe(BigInt(now));
    expect(JSON.parse(o.lastRetentionDetail)).toMatchObject({ deleted: 0 });
  });
});

describe("the admin console", () => {
  it("does not exist for anyone else", async () => {
    await expect(code(admin("parent").getOverview({}))).resolves.toBe(Code.NotFound);
    await expect(code(admin().listProviders({}))).resolves.toBe(Code.NotFound);
    await expect(code(admin("parent").setMarketOpen({ country: "US", open: true }))).resolves.toBe(Code.NotFound);
    await expect(code(admin("parent").addAdmin({ email: "parent@example.com" }))).resolves.toBe(Code.NotFound);
  });

  it("opens markets only with a sign-off and languages, and never mainland China", async () => {
    expect(await code(admin("root").setMarketOpen({ country: "US", open: true }))).toBe(Code.InvalidArgument);
    await admin("root").setMarketOpen({ country: "US", open: true, signedOffBy: "Counsel", signedOffOn: "2026-11-01" });
    expect(await code(admin("root").setMarketOpen({ country: "JP", open: true, signedOffBy: "Counsel", signedOffOn: "2026-11-01" }))).toBe(
      Code.FailedPrecondition,
    );
    await admin("root").setMarketOpen({
      country: "JP",
      open: true,
      signedOffBy: "Counsel",
      signedOffOn: "2026-11-01",
      languageGapAccepted: true,
    });
    expect(
      await code(
        admin("root").setMarketOpen({
          country: "CN",
          open: true,
          signedOffBy: "Counsel",
          signedOffOn: "2026-11-01",
          languageGapAccepted: true,
        }),
      ),
    ).toBe(Code.FailedPrecondition);
    expect(await code(admin("root").setMarketOpen({ country: "FR", open: true, signedOffBy: "Counsel", signedOffOn: "2026-11-01" }))).toBe(
      Code.NotFound,
    );
    const { markets } = await admin("root").listMarkets({});
    expect(markets.find((m) => m.country === "US")?.minorsOpen).toBe(true);
    expect(markets.find((m) => m.country === "CN")?.minorsOpen).toBe(false);
    expect((await admin("root").listLog({ kind: "market" })).entries.map((e) => e.action)).toEqual(["market.open", "market.open"]);
  });

  it("stores keys encrypted and never returns them or logs them", async () => {
    const key = "sk-super-secret-1234";
    const { id } = await admin("root").saveProvider({
      provider: { name: "Vendor", kind: "model", api: "openai-completions", enabled: true },
      apiKey: key,
    });
    const [row] = await db.select().from(schema.aiProvider);
    expect(row?.keyCipher).not.toContain(key);
    expect(await decryptSecret(SECRET, row!.keyCipher!)).toBe(key);
    const { providers } = await admin("root").listProviders({});
    expect(JSON.stringify(providers, (_k, v) => (typeof v === "bigint" ? v.toString() : v))).not.toContain("super-secret");
    expect(providers[0]?.keyHint).toBe("1234");
    expect(JSON.stringify(await db.select().from(schema.adminLog))).not.toContain("super-secret");
    await admin("root").saveProvider({ provider: { id, name: "Vendor", kind: "model", api: "openai-completions", enabled: false } });
    expect((await db.select().from(schema.aiProvider))[0]?.keyHint).toBe("1234");
  });

  it("lists the catalog, and a vendor picked from it speaks the catalog's API", async () => {
    expect(await code(admin("learner").listCatalog({}))).toBe(Code.NotFound);
    const { providers: catalog } = await admin("root").listCatalog({});
    const deepseek = catalog.find((p) => p.id === "deepseek");
    expect(deepseek?.models.length).toBeGreaterThan(0);
    expect(deepseek?.models[0]?.inputPerMillion).toBeGreaterThan(0);
    await admin("root").saveProvider({
      provider: { name: "DeepSeek", kind: "model", catalog: "deepseek", api: "anthropic-messages", enabled: false },
    });
    const { providers } = await admin("root").listProviders({});
    expect(providers[0]).toMatchObject({ catalog: "deepseek", api: deepseek?.api });
    expect(
      await code(admin("root").saveProvider({ provider: { name: "X", kind: "model", catalog: "no-such-vendor", enabled: false } })),
    ).toBe(Code.InvalidArgument);
  });

  it("asks an AI model for a supported API, and a speech vendor for none", async () => {
    expect(await code(admin("root").saveProvider({ provider: { name: "X", kind: "model", api: "x", enabled: false } }))).toBe(
      Code.InvalidArgument,
    );
    const { id } = await admin("root").saveProvider({ provider: { name: "Voice", kind: "speech", api: "x", enabled: false } });
    expect((await admin("root").listProviders({})).providers.find((p) => p.id === id)?.api).toBe("");
  });

  it("sets routes live only with a calibration, and a changed model goes back to draft", async () => {
    const { id } = await admin("root").saveProvider({
      provider: { name: "Vendor", kind: "model", api: "openai-completions", enabled: true },
    });
    const route = { criterion: "w1", position: "primary", providerId: id, model: "m1", promptVersion: "p1", live: true };
    expect(await code(admin("root").saveRoute({ route }))).toBe(Code.FailedPrecondition);
    await admin("root").saveRoute({ route: { ...route, live: false } });
    await recordCalibration(db, {
      criterion: "w1",
      providerId: id,
      model: "m1",
      promptVersion: "p1",
      kappa: 0.8,
      humanKappa: 0.82,
      passed: true,
      at: new Date(now),
    });
    expect((await admin("root").saveRoute({ route })).live).toBe(true);
    expect((await admin("root").saveRoute({ route: { ...route, model: "m2" } })).live).toBe(false);
    expect(await calibrationPassed(db, { criterion: "w1", providerId: id, model: "m2", promptVersion: "p1" })).toBe(false);
    expect(await code(admin("root").deleteProvider({ id }))).toBe(Code.FailedPrecondition);
    await admin("root").saveRoute({ route: { ...route, live: true } });
    await admin("root").saveProvider({ provider: { id, name: "Vendor", kind: "model", api: "openai-completions", enabled: false } });
    expect((await admin("root").getOverview({})).brokenRoutes).toEqual(["w1/primary"]);
  });

  it("lets a minor's data go out only when all five conditions hold", async () => {
    await openMarket("US");
    await newUser("teen");
    await privacy("teen").setAge({ country: "US", birthYear: 2010, birthMonth: 1 });
    const learnerId = await learnerFor(db, "teen");
    const { id } = await admin("root").saveProvider({
      provider: { name: "Vendor", kind: "model", api: "openai-completions", enabled: true, dailyBudget: 1, monthlyBudget: 10 },
    });
    await admin("root").savePrice({ price: { providerId: id, model: "m1", inputPerMillion: 2, outputPerMillion: 8 } });
    await recordCalibration(db, {
      criterion: "w1",
      providerId: id,
      model: "m1",
      promptVersion: "p1",
      kappa: 0.8,
      humanKappa: 0.82,
      passed: true,
      at: new Date(now),
    });
    await admin("root").saveRoute({
      route: { criterion: "w1", position: "primary", providerId: id, model: "m1", promptVersion: "p1", live: true },
    });
    const route = () => qualifyingRoute(db, "w1", learnerId, "writing", now);
    expect(await route()).toBeUndefined();
    expect(await code(privacy("teen").grantConsent({ scope: "writing" }))).toBe(Code.FailedPrecondition);
    const entry = {
      providerId: id,
      country: "US",
      servesMarket: true,
      minorsAllowed: true,
      noTraining: true,
      shortRetention: true,
      processingAgreement: true,
      transferMechanism: true,
    };
    await admin("root").saveRegisterEntry({ entry });
    await admin("root").publishNotice({ version: "2026-12", vendors: [id] });
    await privacy("teen").grantConsent({ scope: "writing" });
    expect(await route()).toMatchObject({ providerId: id, model: "m1" });
    // A stale check stops it.
    const later = now + 366 * DAY;
    expect(await qualifyingRoute(db, "w1", learnerId, "writing", later)).toBeUndefined();
    // A notice that does not name the vendor stops new consents, not those under the older version.
    now += 60_000;
    await admin("root").publishNotice({ version: "2027-01", vendors: [] });
    expect(await route()).toBeDefined();
    await privacy("teen").withdrawConsent({ scope: "writing" });
    expect(await code(privacy("teen").grantConsent({ scope: "writing" }))).toBe(Code.FailedPrecondition);
    expect(await route()).toBeUndefined();
  });

  it("offers an AI scope only with a live route", async () => {
    await openMarket("US");
    const { id } = await admin("root").saveProvider({
      provider: { name: "Vendor", kind: "model", api: "openai-completions", enabled: true },
    });
    await admin("root").saveRegisterEntry({
      entry: {
        providerId: id,
        country: "US",
        servesMarket: true,
        minorsAllowed: true,
        noTraining: true,
        shortRetention: true,
        processingAgreement: true,
        transferMechanism: true,
      },
    });
    await admin("root").publishNotice({ version: "2026-12", vendors: [id] });
    const offered = async () => (await admin("root").listMarkets({})).markets.find((m) => m.country === "US")?.aiScopes;
    expect(await offered()).toEqual([]);
    await recordCalibration(db, {
      criterion: "w1",
      providerId: id,
      model: "m1",
      promptVersion: "p1",
      kappa: 0.8,
      humanKappa: 0.82,
      passed: true,
      at: new Date(now),
    });
    await admin("root").saveRoute({
      route: { criterion: "w1", position: "primary", providerId: id, model: "m1", promptVersion: "p1", live: true },
    });
    expect(await offered()).toEqual(["writing"]);
  });

  it("keeps Hong Kong without AI even with a vendor registered", async () => {
    await openMarket("HK");
    const { id } = await admin("root").saveProvider({
      provider: { name: "Vendor", kind: "model", api: "openai-completions", enabled: true },
    });
    await admin("root").saveRegisterEntry({
      entry: {
        providerId: id,
        country: "HK",
        servesMarket: true,
        minorsAllowed: true,
        noTraining: true,
        shortRetention: true,
        processingAgreement: true,
        transferMechanism: true,
      },
    });
    await admin("root").publishNotice({ version: "2026-12", vendors: [id] });
    const { markets } = await admin("root").listMarkets({});
    expect(markets.find((m) => m.country === "HK")?.aiScopes).toEqual([]);
  });

  it("adds only adults, and an administrator cannot remove themselves", async () => {
    await newUser("teen");
    await privacy("teen").setAge({ country: "US", birthYear: 2010, birthMonth: 1 });
    expect(await code(admin("root").addAdmin({ email: "teen@example.com" }))).toBe(Code.FailedPrecondition);
    await admin("root").addAdmin({ email: "PARENT@example.com" });
    expect((await admin("parent").listAdmins({})).admins).toHaveLength(2);
    expect(await code(admin("root").removeAdmin({ userId: "root" }))).toBe(Code.FailedPrecondition);
    await admin("root").removeAdmin({ userId: "parent" });
    expect(await code(admin("parent").listAdmins({}))).toBe(Code.NotFound);
  });
});

describe("startOfDay", () => {
  it("finds local midnight", () => {
    expect(startOfDay(Date.UTC(2026, 10, 6, 12, 30, 15, 500), "UTC")).toBe(Date.UTC(2026, 10, 6));
    expect(startOfDay(Date.UTC(2026, 10, 6, 20), "Asia/Shanghai")).toBe(Date.UTC(2026, 10, 6, 16));
  });
});
