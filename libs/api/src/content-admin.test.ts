import { Code, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { compileSubject, generateProblem, type SubjectDef, same, type TopicDef, t } from "@ga/content";
import { type Db, grantAdmin, schema } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { AdminService } from "@ga/proto/admin/v1/admin_pb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { adminService } from "./admin.ts";
import { dbKey, userIdKey } from "./context.ts";
import { localGateway, Registry } from "./registry.ts";

const topic = (id: string, prerequisites: string[] = [], extra: Partial<TopicDef> = {}): TopicDef => ({
  id,
  title: t(`Topic ${id}`, `主题 ${id}`),
  summary: t(`About ${id}`, `关于 ${id}`),
  prerequisites,
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "kp",
      title: t("Step", "步骤"),
      explanation: t("Add one.", "加一。"),
      generate: (rng) => {
        const n = rng.int(1, 50);
        return {
          prompt: same(`${n} + 1?`),
          answer: { checker: "text", expected: [String(n + 1)], input: { kind: "text" } },
          solution: same(`${n} + 1 = ${n + 1}`),
          canonical: String(n + 1),
          wrong: ["x"],
        };
      },
    },
  ],
  ...extra,
});

const def: SubjectDef = {
  id: "content-test",
  title: t("Content", "内容"),
  mark: "C",
  hue: 30,
  checkers: [],
  topics: [
    topic("first"),
    topic("second", ["first"]),
    topic("essay", ["second"], {
      criteria: [{ id: "point", version: "1", question: "Does it state a point?", quoteWhenMet: true }],
      knowledgePoints: [
        {
          id: "write",
          title: t("Write", "写"),
          explanation: t("Write a sentence.", "写一句话。"),
          generate: () => ({
            prompt: same("Write a sentence."),
            answer: {
              checker: "writing",
              expected: { minWords: 3, maxChars: 200 },
              input: { kind: "writing", minWords: 3, maxChars: 200 },
              judged: { criteria: ["point"] },
            },
            solution: same("Cats are easy pets."),
            canonical: "Cats are easy pets.",
            wrong: ["Cats."],
          }),
        },
      ],
    }),
  ],
  courses: [
    {
      id: "early",
      title: t("Early", "前"),
      description: t("Early", "前"),
      units: [{ title: t("U", "单"), modules: [{ title: t("M", "模"), topics: ["first"] }] }],
    },
    {
      id: "later",
      title: t("Later", "后"),
      description: t("Later", "后"),
      buildsOn: ["early"],
      units: [{ title: t("Unit", "单元"), modules: [{ title: t("Module", "模块"), topics: ["second", "essay"] }] }],
    },
  ],
};
const compiled = compileSubject(def);
const registry = await Registry.open([localGateway(compiled)]);

let db: Db & { close(): Promise<void> };
beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "admin");
  await createUser(db, "learner");
  await grantAdmin(db, "admin", null, new Date(0));
});
afterEach(() => db.close());

const client = (userId: string) => {
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    req.contextValues.set(userIdKey, userId);
    return next(req);
  };
  const forms = { put: async () => {}, get: async () => undefined, delete: async () => {} };
  return createClient(
    AdminService,
    createRouterTransport(
      (router) =>
        router.service(AdminService, adminService({ now: () => 0, forms, notify: async () => {}, aiKeysSecret: "x".repeat(32), registry })),
      { router: { interceptors: [auth] } },
    ),
  );
};

describe("content in the admin console", () => {
  it("shows a whole course, with the foundations it relies on", async () => {
    const res = await client("admin").getCourseContent({ courseId: "later" });
    expect(res.course?.units[0]?.modules[0]?.topics.map((x) => x.id)).toEqual(["second", "essay"]);
    expect(res.foundations.map((x) => x.id)).toEqual(["first"]);
    expect(res.passages).toEqual([]);
  });

  it("previews a topic as a lesson, with its links", async () => {
    const res = await client("admin").previewTopic({ courseId: "later", topicId: "second", exampleSeed: 0 });
    expect(res.knowledgePoints).toHaveLength(1);
    expect(res.knowledgePoints[0]?.example?.answer).toMatch(/^\d+$/);
    expect(res.prerequisites.map((x) => x.topicId)).toEqual(["first"]);
    expect(res.dependents.map((x) => x.topicId)).toEqual(["essay"]);
  });

  it("tries a problem and checks answers by the subject's rules, recording nothing", async () => {
    const admin = client("admin");
    const ref = { courseId: "later", topicId: "second", kp: 0, seed: 7 };
    const tried = await admin.tryProblem({ ref });
    const expected = generateProblem(compiled, { topic: "second", kp: 0, seed: 7 });
    expect(tried.checkable).toBe(true);
    expect(tried.answer?.answer).toBe(expected.canonical);
    expect((await admin.checkTry({ ref, response: expected.canonical })).feedback?.correct).toBe(true);
    expect((await admin.checkTry({ ref, response: "x" })).feedback).toMatchObject({ correct: false, answer: expected.canonical });
    expect(await db.select().from(schema.taskSession)).toEqual([]);
    expect(await db.select().from(schema.event)).toEqual([]);
    expect(await db.select().from(schema.answer)).toEqual([]);
  });

  it("does not check an answer a model judges", async () => {
    const admin = client("admin");
    const ref = { courseId: "later", topicId: "essay", kp: 0, seed: 1 };
    expect((await admin.tryProblem({ ref })).checkable).toBe(false);
    await expect(admin.checkTry({ ref, response: "Dogs are good pets." })).rejects.toMatchObject({ code: Code.FailedPrecondition });
  });

  it("refuses what does not exist, and anyone without the role", async () => {
    const admin = client("admin");
    await expect(admin.tryProblem({ ref: { courseId: "later", topicId: "second", kp: 3, seed: 1 } })).rejects.toMatchObject({
      code: Code.NotFound,
    });
    await expect(admin.previewTopic({ courseId: "nowhere", topicId: "second" })).rejects.toMatchObject({ code: Code.NotFound });
    await expect(client("learner").getCourseContent({ courseId: "later" })).rejects.toMatchObject({ code: Code.NotFound });
  });
});
