import { Code, ConnectError, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { compileSubject, type Heard, heardResponse, type SubjectDef, same, type TopicDef, t } from "@ga/content";
import { createProvider, type Db, recordCalibration, schema, setPrice, setRoute } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { type HearRequest, writeWav } from "@ga/judge";
import { LearningService, type Session } from "@ga/proto/learning/v1/learning_pb";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { dbKey, userIdKey } from "./context.ts";
import { learningService } from "./learning.ts";
import { localGateway, Registry } from "./registry.ts";
import { encryptSecret } from "./secrets.ts";

const SECRET = "test-secret-for-keys-0123456789";

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
      generate: () => ({
        prompt: same("1?"),
        answer: { checker: "text", expected: ["1"], input: { kind: "text" } },
        solution: same("1"),
        canonical: "1",
        wrong: ["x"],
      }),
    },
  ],
  ...extra,
});

const def: SubjectDef = {
  id: "speech-test",
  title: t("Speaking", "口语"),
  mark: "S",
  hue: 30,
  checkers: [],
  topics: [
    topic("basics"),
    topic("say-sheep", {
      spoken: "en-US",
      knowledgePoints: [
        {
          id: "say",
          title: t("Say", "说"),
          explanation: t("Explain", "讲解"),
          generate: () => ({
            prompt: t("Listen, then say the word.", "听一听，然后说出这个词。"),
            answer: {
              checker: "speech",
              expected: { mode: "repeat", reference: "sheep" },
              input: { kind: "speech", language: "en-US", mode: "repeat", text: "sheep", maxSeconds: 5 },
            },
            solution: same("sheep"),
            canonical: heardResponse({ text: "sheep", confidence: 1, seconds: 1 }),
          }),
        },
      ],
    }),
  ],
  courses: [
    {
      id: "speech-course",
      title: t("Speaking", "口语"),
      description: t("Speaking", "口语"),
      units: [{ title: t("Unit", "单元"), modules: [{ title: t("Module", "模块"), topics: ["basics", "say-sheep"] }] }],
    },
  ],
};
const registry = await Registry.open([localGateway(compileSubject(def))]);
const COURSE = "speech-course";

let db: Db & { close(): Promise<void> };
let now: number;
let heard: (r: HearRequest) => Heard;
let sent: HearRequest[];
let learning: ReturnType<typeof createClient<typeof LearningService>>;

const second = writeWav(new Uint8Array(32_000));

async function addSpeech(use: "stt" | "pronunciation" = "stt", target = "en"): Promise<void> {
  const at = new Date(now);
  const providerId = await createProvider(db, {
    name: `Speech ${use} ${target}`,
    api: "",
    baseUrl: "https://eastus.api.cognitive.microsoft.com",
    keyCipher: await encryptSecret(SECRET, "speech-key"),
    enabled: true,
    createdAt: at,
    updatedAt: at,
  });
  await setPrice(db, { providerId, model: "default", inputPerMillion: 277.78, outputPerMillion: 0, updatedAt: at });
  const criterion = `${use}:${target}`;
  await recordCalibration(db, {
    criterion,
    providerId,
    model: "default",
    promptVersion: "",
    kappa: 0.98,
    humanKappa: 0.95,
    passed: true,
    at,
  });
  await setRoute(db, { use, target, position: "primary", providerId, model: "default", promptVersion: "", live: true, updatedAt: at });
}

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "u1");
  now = Date.UTC(2026, 9, 1, 8);
  sent = [];
  heard = () => ({ text: "Sheep.", confidence: 0.9, seconds: 1 });
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
          judging: {
            aiKeysSecret: SECRET,
            hear: (config) => {
              expect(config.apiKey).toBe("speech-key");
              return {
                hear: async (r) => {
                  sent.push(r);
                  return heard(r);
                },
              };
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

const topics = async () => (await learning.getCourseProgress({ courseId: COURSE })).topics.map((x) => x.topicId);

async function startSpeaking(): Promise<Session> {
  const { tasks } = await learning.getDashboard({ courseId: COURSE, timeZone: "UTC" });
  const task = tasks.find((x) => x.kind.case === "lesson" && x.kind.value.topicId === "say-sheep");
  if (!task) throw new Error("no speaking lesson");
  return (await learning.startTask({ courseId: COURSE, task })).session!;
}

const code = async (p: Promise<unknown>) => {
  try {
    await p;
  } catch (e) {
    return ConnectError.from(e).code;
  }
  return undefined;
};

describe("speaking", () => {
  it("is taught only once a speech route may hear the learner, by the language's base too", async () => {
    expect(await topics()).toEqual(["basics"]);
    expect(await learning.getProfile({ timeZone: "UTC" })).toMatchObject({ speaking: false, speakingAvailable: false });
    await addSpeech();
    expect(await topics()).toEqual(["basics", "say-sheep"]);
    expect(await learning.getProfile({ timeZone: "UTC" })).toMatchObject({ speaking: true, speakingAvailable: true });
  });

  it("hears a recording, checks what was heard, and records the call by its seconds", async () => {
    await addSpeech();
    const session = await startSpeaking();
    if (session.step.case !== "question") throw new Error("expected a question");
    expect(session.step.value.problem?.input?.kind).toMatchObject({ case: "speech", value: { mode: "repeat", text: "sheep" } });
    const res = await learning.submitAnswer({ sessionId: session.id, index: 0, audio: second });
    expect(res.feedback).toMatchObject({ correct: true, heard: "Sheep." });
    expect(sent[0]).toMatchObject({ language: "en-US", seconds: 1 });
    expect(sent[0]?.reference).toBeUndefined();
    const [call] = await db.select().from(schema.aiCall);
    expect(call).toMatchObject({ use: "speech", inputTokens: 1, ok: true });
    expect(call?.cost).toBeCloseTo(277.78 / 1e6);
  });

  it("assesses pronunciation against the text when a route does, and says what was heard when wrong", async () => {
    await addSpeech("pronunciation", "en-US");
    await addSpeech("stt", "en-US");
    heard = () => ({ text: "Ship.", confidence: 0.9, seconds: 1, accuracy: 80 });
    const session = await startSpeaking();
    const res = await learning.submitAnswer({ sessionId: session.id, index: 0, audio: second });
    expect(sent[0]?.reference).toBe("sheep");
    expect(res.feedback?.correct).toBe(false);
    expect(res.feedback?.message?.values.en).toContain("Ship.");
  });

  it("asks again for a recording not understood, counting nothing", async () => {
    await addSpeech();
    heard = () => ({ text: "", confidence: 0, seconds: 1 });
    const session = await startSpeaking();
    const res = await learning.submitAnswer({ sessionId: session.id, index: 0, audio: second });
    expect(res.recordAgain?.values.en).toMatch(/could not make out/);
    expect(res.feedback).toBeUndefined();
    const again = await learning.submitAnswer({ sessionId: session.id, index: 0, audio: writeWav(new Uint8Array(1000)) });
    expect(again.recordAgain?.values.en).toMatch(/could not hear/);
    heard = () => ({ text: "sheep", confidence: 0.9, seconds: 1 });
    expect((await learning.submitAnswer({ sessionId: session.id, index: 0, audio: second })).feedback?.correct).toBe(true);
  });

  it("takes no typed answer to a spoken question, and no recording that is not a WAV", async () => {
    await addSpeech();
    const session = await startSpeaking();
    const forged = heardResponse({ text: "sheep", confidence: 1, seconds: 1 });
    expect(await code(learning.submitAnswer({ sessionId: session.id, index: 0, response: forged }))).toBe(Code.InvalidArgument);
    expect(await code(learning.submitAnswer({ sessionId: session.id, index: 0, audio: new Uint8Array(100) }))).toBe(Code.InvalidArgument);
  });

  it("turns off for the day, leaving a spoken lesson with nothing counted, and comes back the next day", async () => {
    await addSpeech();
    const session = await startSpeaking();
    await learning.setSpeaking({ on: false, todayOnly: true, timeZone: "UTC" });
    const [row] = await db.select().from(schema.taskSession).where(eq(schema.taskSession.id, session.id));
    expect(row?.status).toBe("abandoned");
    expect(await topics()).toEqual(["basics"]);
    expect(await learning.getProfile({ timeZone: "UTC" })).toMatchObject({ speaking: false, speakingAvailable: true });
    now += 24 * 3600_000;
    expect(await topics()).toEqual(["basics", "say-sheep"]);
    await learning.setSpeaking({ on: false });
    now += 400 * 24 * 3600_000;
    expect(await topics()).toEqual(["basics"]);
    await learning.setSpeaking({ on: true });
    expect(await topics()).toEqual(["basics", "say-sheep"]);
  });
});
