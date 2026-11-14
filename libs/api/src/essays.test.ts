import { createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { createModels, fauxAssistantMessage, fauxProvider, fauxToolCall, type JsonObject } from "@earendil-works/pi-ai";
import { compileSubject, type SubjectDef, same, type TopicDef, t } from "@ga/content";
import { createProvider, type Db, recordCalibration, schema, setPrice, setRoute } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { LearningService, type Session } from "@ga/proto/learning/v1/learning_pb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { dbKey, userIdKey } from "./context.ts";
import { ESSAY_JUDGE_LIMIT_MS, runEssays } from "./essays.ts";
import type { JudgingDeps } from "./judging.ts";
import { learningService } from "./learning.ts";
import { localGateway, Registry } from "./registry.ts";
import { encryptSecret } from "./secrets.ts";

const SECRET = "test-secret-for-keys-0123456789";
const thesis = { id: "has-thesis", version: "1", question: "Does the essay state a thesis?", quoteWhenMet: true };
const counter = { id: "answers-counterclaim", version: "1", question: "Does the essay answer a counterclaim?", quoteWhenMet: true };

const basics: TopicDef = {
  id: "basics",
  title: t("Basics", "基础"),
  summary: t("Basics", "基础"),
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
        };
      },
    },
  ],
};

const essay: TopicDef = {
  id: "essay",
  title: t("Writing an Essay", "写文章"),
  summary: t("A whole essay", "整篇文章"),
  prerequisites: [],
  encompasses: [],
  xp: 40,
  essay: true,
  criteria: [thesis, counter],
  knowledgePoints: [
    {
      id: "write",
      title: t("Write", "写"),
      explanation: t("Explain", "讲解"),
      generate: (rng) => ({
        prompt: same(`Write an essay on question ${rng.int(1, 50)}.`),
        answer: {
          checker: "writing",
          expected: { minWords: 8, maxChars: 4000 },
          input: { kind: "writing", minWords: 8, maxChars: 4000 },
          judged: { criteria: ["has-thesis", "answers-counterclaim"] },
        },
        solution: same("A model essay."),
        canonical: "A model essay that states a thesis and answers the other side.",
      }),
    },
  ],
};

const def: SubjectDef = {
  id: "essay-test",
  title: t("Writing", "写作"),
  mark: "W",
  hue: 30,
  checkers: [],
  topics: [basics, essay],
  courses: [
    {
      id: "essay-course",
      title: t("Writing", "写作"),
      description: t("Writing", "写作"),
      units: [{ title: t("Unit", "单元"), modules: [{ title: t("Module", "模块"), topics: ["basics", "essay"] }] }],
    },
  ],
};
const registry = await Registry.open([localGateway(compileSubject(def))]);
const COURSE = "essay-course";
const TEXT = "Schools should start later. Some say buses cost more, but sleep matters more than buses.";

let db: Db & { close(): Promise<void> };
let now: number;
let seed: number;
let deferred: Promise<unknown>[];
let faux: ReturnType<typeof fauxProvider>;
let judging: JudgingDeps;
let learning: ReturnType<typeof createClient<typeof LearningService>>;

const respond = (met: [boolean, boolean]) =>
  fauxAssistantMessage(
    [
      fauxToolCall("respond", {
        criteria: [
          { id: "has-thesis", met: met[0], quotation: met[0] ? "Schools should start later." : "", note: "The thesis." },
          { id: "answers-counterclaim", met: met[1], quotation: met[1] ? "Some say buses cost more" : "", note: "The other side." },
        ],
        feedback: [{ point: "Give evidence for the thesis.", quotation: "sleep matters" }],
      } as JsonObject),
    ],
    { stopReason: "toolUse" },
  );

async function addRoutes(): Promise<void> {
  const at = new Date(now);
  const providerId = await createProvider(db, {
    name: "Vendor",
    api: "openai-completions",
    keyCipher: await encryptSecret(SECRET, "test-key"),
    enabled: true,
    dailyBudget: 1,
    monthlyBudget: 10,
    createdAt: at,
    updatedAt: at,
  });
  await setPrice(db, { providerId, model: "m1", inputPerMillion: 2, outputPerMillion: 8, updatedAt: at });
  for (const c of ["has-thesis@1", "answers-counterclaim@1"]) {
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
      use: "judgment",
      target: c,
      position: "primary",
      providerId,
      model: "m1",
      promptVersion: "writing-1",
      live: true,
      updatedAt: at,
    });
  }
}

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "u1");
  now = Date.UTC(2026, 9, 1, 8);
  seed = 1;
  deferred = [];
  faux = fauxProvider();
  judging = {
    aiKeysSecret: SECRET,
    connect: () => {
      const models = createModels();
      models.setProvider(faux.provider);
      return { models, model: faux.getModel(), gateway: false };
    },
  };
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    req.contextValues.set(userIdKey, "u1");
    return next(req);
  };
  const transport = createRouterTransport(
    (router) => {
      router.service(
        LearningService,
        learningService({ registry, now: () => now, seed: () => seed++, defer: (work) => deferred.push(work), judging }),
      );
    },
    { router: { interceptors: [auth] } },
  );
  learning = createClient(LearningService, transport);
  await learning.chooseCourse({ courseId: COURSE });
  await learning.skipDiagnostic({ courseId: COURSE });
  await addRoutes();
});
afterEach(() => db.close());

const settled = () => Promise.all(deferred.splice(0));
const dashboard = () => learning.getDashboard({ courseId: COURSE, timeZone: "UTC" });
const offered = async () => (await dashboard()).tasks.map((x) => (x.kind.case === "lesson" ? x.kind.value.topicId : x.kind.case));

async function submitEssay(): Promise<Session> {
  const task = (await dashboard()).tasks.find((x) => x.kind.case === "lesson" && x.kind.value.topicId === "essay");
  if (!task) throw new Error("no essay lesson");
  const session = (await learning.startTask({ courseId: COURSE, task })).session!;
  if (session.step.case !== "question") throw new Error("expected a question");
  expect(session.step.value).toMatchObject({ essay: true, lesson: { needed: 1 } });
  const r = await learning.submitAnswer({ sessionId: session.id, index: 0, response: TEXT });
  expect(r.pending).toBe(true);
  return r.session!;
}

describe("essays", () => {
  it("end their session on submission, leave the learner free, and show the verdict once judged", async () => {
    faux.setResponses([respond([true, true])]);
    const submitted = await submitEssay();
    expect(submitted.step).toMatchObject({ case: "submitted", value: { response: TEXT, failed: false } });
    const [row] = await db.select().from(schema.taskSession);
    expect(row?.status).toBe("submitted");
    // Not offered again while it is judged; another task can start meanwhile.
    expect(await offered()).toEqual(["basics"]);
    const d = await dashboard();
    expect(d.active).toBeUndefined();
    expect(d.essays.map((e) => [e.title?.values.en, e.judged])).toEqual([["Writing an Essay", false]]);

    await settled();
    const { session } = await learning.getSession({ id: submitted.id });
    if (session?.step.case !== "result") throw new Error("expected a result");
    expect(session.step.value).toMatchObject({ passed: true, feedback: { correct: true, score: 1, revise: false } });
    expect(session.step.value.feedback?.criteria.map((c) => c.met)).toEqual([true, true]);
    expect((await dashboard()).essays.map((e) => [e.judged, e.passed])).toEqual([[true, true]]);
    const events = await db.select().from(schema.event);
    expect(events.map((e) => e.data)).toContainEqual(expect.objectContaining({ type: "lesson", topic: "essay", passed: true, asked: 1 }));

    // Listed for a week after.
    now += 8 * 24 * 60 * 60_000;
    expect((await dashboard()).essays).toEqual([]);
  });

  it("fail their lesson on a weak verdict, with no rewrite", async () => {
    faux.setResponses([respond([true, false])]);
    const submitted = await submitEssay();
    await settled();
    const r = await learning.getJudgment({ sessionId: submitted.id, index: 0 });
    expect(r.pending).toBe(false);
    if (r.session?.step.case !== "result") throw new Error("expected a result");
    expect(r.session.step.value).toMatchObject({ passed: false, feedback: { correct: false, score: 0.5, revise: false } });
    expect(await offered()).toContain("essay");
  });

  it("are judged by the scheduled job once the learner has left", async () => {
    // No response is queued, so the first try fails.
    const submitted = await submitEssay();
    await settled();
    expect((await db.select().from(schema.judgment))[0]).toMatchObject({ status: "pending", tries: 1 });

    now += 15 * 60_000;
    faux.setResponses([respond([true, true])]);
    expect(await runEssays(db, registry, judging, now, () => seed++)).toEqual({ waiting: 0, settled: 1 });
    expect((await db.select().from(schema.taskSession))[0]?.status).toBe("completed");

    const { session } = await learning.getSession({ id: submitted.id });
    expect(session?.step.case === "result" && session.step.value.passed).toBe(true);
    expect(await offered()).not.toContain("essay");
  });

  it("are abandoned with no result when they cannot be judged", async () => {
    const submitted = await submitEssay();
    await settled();
    now += ESSAY_JUDGE_LIMIT_MS;
    expect(await runEssays(db, registry, judging, now, () => seed++)).toEqual({ waiting: 0, settled: 1 });
    const { session } = await learning.getSession({ id: submitted.id });
    expect(session?.step).toMatchObject({ case: "submitted", value: { failed: true } });
    expect((await dashboard()).essays).toEqual([]);
    expect(await offered()).toContain("essay");
    expect((await db.select().from(schema.event)).some((e) => (e.data as { topic?: string }).topic === "essay")).toBe(false);
  });
});
