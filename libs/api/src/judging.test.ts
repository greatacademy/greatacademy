import { Code, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { createModels, fauxAssistantMessage, fauxProvider, fauxToolCall, type JsonObject } from "@earendil-works/pi-ai";
import { compileSubject, type Problem, type SubjectDef, same, type TopicDef, t } from "@ga/content";
import { createProvider, type Db, grantAdmin, recordCalibration, recordCalls, schema, setPrice, setRoute, updateProvider } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { LearningService, type Session } from "@ga/proto/learning/v1/learning_pb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { dbKey, userIdKey } from "./context.ts";
import { type Alarm, DAILY_JUDGMENTS, JUDGING_DAILY_REFUSAL, JUDGING_RATE_REFUSAL, MAX_TRIES, runCostCheck } from "./costs.ts";
import { JUDGE_LIMIT_MS, retryDelay } from "./judging.ts";
import { learningService } from "./learning.ts";
import { localGateway, Registry } from "./registry.ts";
import { encryptSecret } from "./secrets.ts";

const SECRET = "test-secret-for-keys-0123456789";
const states = { id: "states-point", version: "1", question: "Does the paragraph state its point first?", quoteWhenMet: true };
const details = { id: "gives-detail", version: "1", question: "Does the paragraph give a detail?", quoteWhenMet: true };

const writing = (n: number): Problem => ({
  prompt: t(`Write a paragraph about pet number ${n}.`, `用英语写一段话，谈第 ${n} 只宠物。`),
  answer: {
    checker: "writing",
    expected: { minWords: 8, maxChars: 800 },
    input: { kind: "writing", minWords: 8, maxChars: 800 },
    judged: { criteria: ["states-point", "gives-detail"] },
  },
  solution: same("Cats are easy pets. They clean themselves and sleep most of the day."),
  canonical: "Cats are easy pets. They clean themselves and sleep most of the day.",
  wrong: ["Cats."],
});

const topic = (id: string, extra: Partial<TopicDef> = {}): TopicDef => ({
  id,
  title: t(id, id),
  summary: t(`About ${id}`, `关于 ${id}`),
  prerequisites: [],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "kp",
      title: t("Step", "步骤"),
      explanation: t("Explain", "讲解"),
      generate: (rng) => {
        const n = rng.int(1, 50);
        return {
          prompt: same(`${n}?`),
          answer: { checker: "text", expected: [String(n)], input: { kind: "text" } },
          solution: same(`${n}`),
          canonical: String(n),
          wrong: ["x"],
        };
      },
    },
  ],
  ...extra,
});

const def: SubjectDef = {
  id: "writing-test",
  title: t("Writing", "写作"),
  mark: "W",
  hue: 30,
  checkers: [],
  topics: [
    topic("basics"),
    topic("paragraphs", {
      criteria: [states, details],
      knowledgePoints: [
        { id: "write", title: t("Write", "写"), explanation: t("Explain", "讲解"), generate: (rng) => writing(rng.int(1, 50)) },
      ],
    }),
  ],
  courses: [
    {
      id: "writing-course",
      title: t("Writing", "写作"),
      description: t("Writing", "写作"),
      units: [{ title: t("Unit", "单元"), modules: [{ title: t("Module", "模块"), topics: ["basics", "paragraphs"] }] }],
    },
  ],
};
const registry = await Registry.open([localGateway(compileSubject(def))]);
const COURSE = "writing-course";
const TEXT = "Dogs make good pets. My dog Max waits by the door every day when I come home.";

let db: Db & { close(): Promise<void> };
let now: number;
let deferred: Promise<unknown>[];
let faux: ReturnType<typeof fauxProvider>;
let learning: ReturnType<typeof createClient<typeof LearningService>>;

const respond = (met: [boolean, boolean]) =>
  fauxAssistantMessage(
    [
      fauxToolCall("respond", {
        criteria: [
          { id: "states-point", met: met[0], quotation: met[0] ? "Dogs make good pets." : "", note: "The first sentence." },
          { id: "gives-detail", met: met[1], quotation: met[1] ? "My dog Max" : "", note: "A detail." },
        ],
        feedback: [{ point: "Say why the detail matters.", quotation: "every day" }],
      } as JsonObject),
    ],
    { stopReason: "toolUse" },
  );

const PRICE = { inputPerMillion: 2, outputPerMillion: 8 };

async function addRoutes(): Promise<string> {
  const at = new Date(now);
  const providerId = await createProvider(db, {
    name: "Vendor",
    kind: "model",
    api: "openai-completions",
    keyCipher: await encryptSecret(SECRET, "test-key"),
    enabled: true,
    dailyBudget: 1,
    monthlyBudget: 10,
    createdAt: at,
    updatedAt: at,
  });
  await setPrice(db, { providerId, model: "m1", ...PRICE, updatedAt: at });
  for (const c of ["states-point@1", "gives-detail@1"]) {
    await recordCalibration(db, {
      criterion: c,
      providerId,
      model: "m1",
      promptVersion: "writing-1",
      kappa: 0.8,
      humanKappa: 0.8,
      passed: true,
      at,
    });
    await setRoute(db, {
      criterion: c,
      position: "primary",
      providerId,
      model: "m1",
      promptVersion: "writing-1",
      live: true,
      updatedAt: at,
    });
  }
  return providerId;
}

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "u1");
  now = Date.UTC(2026, 9, 1, 8);
  deferred = [];
  faux = fauxProvider();
  let seed = 1;
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    req.contextValues.set(userIdKey, "u1");
    return next(req);
  };
  const transport = createRouterTransport(
    (router) => {
      router.service(
        LearningService,
        learningService({
          registry,
          now: () => now,
          seed: () => seed++,
          defer: (work) => deferred.push(work),
          judging: {
            aiKeysSecret: SECRET,
            connect: () => {
              const models = createModels();
              models.setProvider(faux.provider);
              return { models, model: faux.getModel() };
            },
          },
        }),
      );
    },
    { router: { interceptors: [auth] } },
  );
  learning = createClient(LearningService, transport);
  await learning.chooseCourse({ courseId: COURSE });
  await learning.skipDiagnostic({ courseId: COURSE });
});
afterEach(() => db.close());

const settled = () => Promise.all(deferred.splice(0));

async function startParagraphs(): Promise<Session> {
  const { tasks } = await learning.getDashboard({ courseId: COURSE, timeZone: "UTC" });
  const task = tasks.find((x) => x.kind.case === "lesson" && x.kind.value.topicId === "paragraphs");
  if (!task) throw new Error("no paragraphs lesson");
  return (await learning.startTask({ courseId: COURSE, task })).session!;
}

const questionOf = (s: Session | undefined) => {
  if (s?.step.case !== "question") throw new Error("expected a question");
  return s.step.value;
};

describe("judged writing", () => {
  it("leaves out a judged topic for a learner no route may receive, and teaches it once one does", async () => {
    const topics = async () => (await learning.getCourseProgress({ courseId: COURSE })).topics.map((x) => x.topicId);
    expect(await topics()).toEqual(["basics"]);
    await addRoutes();
    expect(await topics()).toEqual(["basics", "paragraphs"]);
  });

  it("waits for the verdict, sends a weak text back once, and counts the rewrite", async () => {
    await addRoutes();
    const session = await startParagraphs();
    expect(questionOf(session).problem?.input?.kind.case).toBe("writing");

    const short = await learning.submitAnswer({ sessionId: session.id, index: 0, response: "Dogs are nice." });
    expect(short.pending).toBe(false);
    expect(short.feedback).toMatchObject({ correct: false, revise: true, answer: "" });
    expect(short.feedback?.message?.values.en).toBe("Write at least 8 words.");

    faux.setResponses([respond([true, false])]);
    const first = await learning.submitAnswer({ sessionId: session.id, index: 0, response: TEXT });
    expect(first.pending).toBe(true);
    expect(questionOf(first.session).judging?.response).toBe(TEXT);
    await settled();
    const weak = await learning.getJudgment({ sessionId: session.id, index: 0 });
    expect(weak.feedback).toMatchObject({ correct: false, revise: true, score: 0.5, answer: "" });
    expect(weak.feedback?.criteria.map((c) => [c.id, c.met, c.quotation])).toEqual([
      ["states-point", true, "Dogs make good pets."],
      ["gives-detail", false, ""],
    ]);
    expect(weak.feedback?.points[0]?.quotation).toBe("every day");
    expect(questionOf(weak.session)).toMatchObject({ index: 0, attempt: 1 });
    expect(questionOf(weak.session).judging).toBeUndefined();

    faux.setResponses([respond([true, true])]);
    await learning.submitAnswer({ sessionId: session.id, index: 0, response: `${TEXT} He wags his tail.` });
    await settled();
    const good = await learning.getJudgment({ sessionId: session.id, index: 0 });
    expect(good.feedback).toMatchObject({ correct: true, score: 1, revise: false });
    expect(good.feedback?.answer).not.toBe("");
    expect(questionOf(good.session)).toMatchObject({ index: 1, attempt: 0 });
    // Asking again changes nothing.
    expect(questionOf((await learning.getJudgment({ sessionId: session.id, index: 0 })).session).index).toBe(1);

    const [answer] = await db.select().from(schema.answer);
    expect(answer).toMatchObject({ index: 0, correct: true, score: 1 });
    const judgments = await db.select().from(schema.judgment);
    expect(judgments.map((j) => [j.attempt, j.status, j.score])).toEqual([
      [1, "done", 0.5],
      [2, "done", 1],
    ]);
    expect(judgments.every((j) => j.criteria.join() === "states-point@1,gives-detail@1" && j.model === "m1")).toBe(true);
  });

  it("retries a failing model, keeps its reason without the text, and after the limit lets the learner skip", async () => {
    await addRoutes();
    const session = await startParagraphs();
    // No response is queued, so every call fails.
    await learning.submitAnswer({ sessionId: session.id, index: 0, response: TEXT });
    await settled();
    let r = await learning.getJudgment({ sessionId: session.id, index: 0 });
    expect(r.pending).toBe(true);
    expect(questionOf(r.session).judging).toMatchObject({ delayed: true, failed: false });
    const [row] = await db.select().from(schema.judgment);
    expect(row).toMatchObject({ status: "pending", tries: 1, error: "provider-error" });
    expect(row!.nextAt.getTime()).toBe(now + retryDelay(1));

    now += JUDGE_LIMIT_MS;
    r = await learning.getJudgment({ sessionId: session.id, index: 0 });
    expect(questionOf(r.session).judging).toMatchObject({ failed: true });
    const left = await learning.submitAnswer({ sessionId: session.id, index: 0, response: "", skip: true });
    expect(left.session?.step.case).toBe("question");
    const [ended] = await db.select().from(schema.taskSession);
    expect(ended?.status).toBe("abandoned");
    expect(await db.select().from(schema.answer)).toEqual([]);
  });

  it("records every call with its cost at the model's price, the failed ones too", async () => {
    await addRoutes();
    const session = await startParagraphs();
    await learning.submitAnswer({ sessionId: session.id, index: 0, response: TEXT });
    await settled(); // No response is queued: this call fails.
    now += retryDelay(1);
    faux.setResponses([respond([true, true])]);
    await learning.getJudgment({ sessionId: session.id, index: 0 });
    const calls = await db.select().from(schema.aiCall);
    expect(calls.map((c) => [c.use, c.model, c.ok])).toEqual([
      ["judgment", "m1", false],
      ["judgment", "m1", true],
    ]);
    const good = calls[1]!;
    expect(good.learnerId).not.toBeNull();
    expect(good.cost).toBeCloseTo((good.inputTokens * 2 + good.outputTokens * 8) / 1e6, 12);
    const [row] = await db.select().from(schema.judgment);
    expect(row?.cost).toBeCloseTo(good.cost, 12);
  });

  it("serves no learner from a model without a price or a vendor without budgets", async () => {
    const topics = async () => (await learning.getCourseProgress({ courseId: COURSE })).topics.map((x) => x.topicId);
    const providerId = await addRoutes();
    await db.delete(schema.aiPrice);
    expect(await topics()).toEqual(["basics"]);
    await setPrice(db, { providerId, model: "m1", ...PRICE, updatedAt: new Date(now) });
    await updateProvider(db, providerId, { dailyBudget: null });
    expect(await topics()).toEqual(["basics"]);
  });

  it("takes no new texts once a budget is spent, but finishes a text already taken", async () => {
    const topics = async () => (await learning.getCourseProgress({ courseId: COURSE })).topics.map((x) => x.topicId);
    const providerId = await addRoutes();
    const session = await startParagraphs();
    await learning.submitAnswer({ sessionId: session.id, index: 0, response: TEXT });
    await recordCalls(db, [
      { providerId, model: "m1", use: "judgment", inputTokens: 0, outputTokens: 0, cost: 1, ok: true, at: new Date(now) },
    ]);
    expect(await topics()).toEqual(["basics"]);
    faux.setResponses([respond([true, true])]);
    await settled();
    const done = await learning.getJudgment({ sessionId: session.id, index: 0 });
    expect(done.feedback).toMatchObject({ correct: true });
    // The next UTC day has a fresh daily budget.
    now += 24 * 3600_000;
    expect(await topics()).toEqual(["basics", "paragraphs"]);
  });

  it("fails a judgment for good after MAX_TRIES, before the time limit", async () => {
    await addRoutes();
    const session = await startParagraphs();
    await learning.submitAnswer({ sessionId: session.id, index: 0, response: TEXT });
    await settled();
    for (let i = 1; i < MAX_TRIES; i++) {
      now += retryDelay(i);
      await learning.getJudgment({ sessionId: session.id, index: 0 });
    }
    const [row] = await db.select().from(schema.judgment);
    expect(row).toMatchObject({ status: "failed", tries: MAX_TRIES });
    expect(now - row!.createdAt.getTime()).toBeLessThan(JUDGE_LIMIT_MS);
  });

  it("refuses texts beyond the learner's limits per minute and per day, recording nothing", async () => {
    await addRoutes();
    const session = await startParagraphs();
    faux.setResponses([respond([true, true])]);
    await learning.submitAnswer({ sessionId: session.id, index: 0, response: TEXT });
    await settled();
    expect(questionOf((await learning.getJudgment({ sessionId: session.id, index: 0 })).session).index).toBe(1);
    const [first] = await db.select().from(schema.judgment);
    const copy = ({ id: _, ...rest }: typeof first & object, at: number) => ({ ...rest, status: "done" as const, createdAt: new Date(at) });
    await db.insert(schema.judgment).values(Array.from({ length: 4 }, () => copy(first!, now)));
    const refused = (message: string) => expect.objectContaining({ code: Code.ResourceExhausted, rawMessage: message });
    const again = () => learning.submitAnswer({ sessionId: session.id, index: 1, response: TEXT });
    await expect(again()).rejects.toEqual(refused(JUDGING_RATE_REFUSAL));
    now += 2 * 60_000;
    await db.insert(schema.judgment).values(Array.from({ length: DAILY_JUDGMENTS - 5 }, () => copy(first!, now - 90_000)));
    await expect(again()).rejects.toEqual(refused(JUDGING_DAILY_REFUSAL));
    expect(await db.select().from(schema.judgment)).toHaveLength(DAILY_JUDGMENTS);
  });
});

describe("cost alarms", () => {
  it("warns each administrator once per budget step, model cost jump and run of failures", async () => {
    await createUser(db, "admin");
    await grantAdmin(db, "admin", null, new Date(now));
    const providerId = await addRoutes();
    const call = (cost: number, ok: boolean, at: number) => ({
      providerId,
      model: "m1",
      use: "judgment" as const,
      inputTokens: 100,
      outputTokens: 50,
      cost,
      ok,
      at: new Date(at),
    });
    const day = 24 * 3600_000;
    await recordCalls(
      db,
      Array.from({ length: 10 }, (_, i) => call(0.001, true, now - 2 * day + i)),
    );
    // Today: 10 calls at 0.085 each, 4 failed: 0.85 of the daily budget of 1, and 85 times the usual cost.
    await recordCalls(
      db,
      Array.from({ length: 10 }, (_, i) => call(0.085, i >= 4, now - 1000 + i)),
    );
    const mails: [string, Alarm][] = [];
    const mail = async (to: string, alarm: Alarm) => void mails.push([to, alarm]);
    const raised = await runCostCheck(db, now, mail);
    expect(raised.map((a) => a.detail).sort()).toEqual([
      "budget day 2026-10-01 50%",
      "budget day 2026-10-01 80%",
      "cost-jump 2026-10-01",
      "failures 2026-10-01",
    ]);
    expect(mails).toHaveLength(4);
    expect(mails.every(([to]) => to === "admin@example.com")).toBe(true);
    expect(await runCostCheck(db, now + 60_000, mail)).toEqual([]);
    const log = await db.select().from(schema.adminLog);
    expect(log.filter((l) => l.action === "ai.alarm")).toHaveLength(4);
  });
});
