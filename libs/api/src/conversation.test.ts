import { generateKeyPairSync, verify } from "node:crypto";

import { Code, ConnectError, createClient, createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { createModels, fauxAssistantMessage, fauxProvider, fauxToolCall } from "@earendil-works/pi-ai";
import { compileSubject, type SubjectDef, same, t } from "@ga/content";
import { createProvider, type Db, recordCalibration, schema, setMarketLaunch, setPrice, setRoute } from "@ga/db";
import { createTestDb, createUser } from "@ga/db/testing";
import { ConversationService } from "@ga/proto/conversation/v1/conversation_pb";
import { LearningService } from "@ga/proto/learning/v1/learning_pb";
import { eq } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { dbKey, userIdKey } from "./context.ts";
import { type ConversationDeps, conversationService, DAILY_CONVERSATIONS, handleVoice, MAX_TURNS, signTicket } from "./conversation.ts";
import { learningService } from "./learning.ts";
import { localGateway, Registry } from "./registry.ts";
import { encryptSecret } from "./secrets.ts";

const SECRET = "test-secret-for-keys-0123456789";
const CREDENTIAL = "voice-credential";
const keys = generateKeyPairSync("ed25519");
const PRIVATE = keys.privateKey.export({ type: "pkcs8", format: "der" }).toString("base64url");

const def: SubjectDef = {
  id: "talk",
  title: t("Talk", "对话"),
  mark: "T",
  hue: 10,
  checkers: [],
  topics: [
    {
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
          generate: () => ({
            prompt: same("1?"),
            answer: { checker: "text", expected: ["1"], input: { kind: "text" } },
            solution: same("1"),
            canonical: "1",
            wrong: ["2"],
          }),
        },
      ],
    },
  ],
  conversations: [
    {
      id: "at-the-desk",
      title: t("At the desk", "在服务台"),
      task: t("Ask for a book.", "借一本书。"),
      scenario: "You are a librarian.",
      opening: "Hello! How can I help?",
      minutes: 3,
    },
  ],
  courses: [
    {
      id: "talk-course",
      title: t("Talk", "对话"),
      description: t("Talk", "对话"),
      units: [{ title: t("Unit", "单元"), modules: [{ title: t("Module", "模块"), topics: ["basics"] }] }],
      conversations: ["at-the-desk"],
    },
  ],
};
const registry = await Registry.open([localGateway(compileSubject(def))]);
const COURSE = "talk-course";

let db: Db & { close(): Promise<void> };
let now: number;
let faux: ReturnType<typeof fauxProvider>;
let deps: ConversationDeps;
let client: ReturnType<typeof createClient<typeof ConversationService>>;

const reply = (text: string, end = false) => fauxAssistantMessage([fauxToolCall("reply", { text, end })], { stopReason: "toolUse" });

async function addRoute(calibrated = true): Promise<string> {
  const at = new Date(now);
  const providerId = await createProvider(db, {
    name: "Vendor",
    api: "openai-completions",
    keyCipher: await encryptSecret(SECRET, "test-key"),
    enabled: true,
    createdAt: at,
    updatedAt: at,
  });
  await setPrice(db, { providerId, model: "m1", inputPerMillion: 2, outputPerMillion: 8, updatedAt: at });
  if (calibrated)
    await recordCalibration(db, {
      criterion: "at-the-desk",
      providerId,
      model: "m1",
      promptVersion: "conversation-1",
      kappa: 0.8,
      humanKappa: 0.8,
      passed: true,
      at,
    });
  await setRoute(db, {
    use: "conversation",
    target: "at-the-desk",
    position: "primary",
    providerId,
    model: "m1",
    promptVersion: "conversation-1",
    live: true,
    updatedAt: at,
  });
  return providerId;
}

const voice = (path: string, method: string, body: unknown, credential = CREDENTIAL) =>
  handleVoice(
    new Request(`https://greatacademy.dev/voice/v1/${path}`, {
      method,
      headers: { authorization: `Bearer ${credential}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    db,
    deps,
  );

beforeEach(async () => {
  db = await createTestDb();
  await createUser(db, "u1");
  now = Date.UTC(2026, 10, 10, 8);
  faux = fauxProvider();
  deps = {
    registry,
    now: () => now,
    voice: { url: "wss://voice.test/v1/conversation", privateKey: PRIVATE, credential: CREDENTIAL },
    judging: {
      aiKeysSecret: SECRET,
      connect: () => {
        const models = createModels();
        models.setProvider(faux.provider);
        return { models, model: faux.getModel(), gateway: false };
      },
    },
  };
  const auth: Interceptor = (next) => (req) => {
    req.contextValues.set(dbKey, db);
    req.contextValues.set(userIdKey, "u1");
    return next(req);
  };
  const transport = createRouterTransport(
    (router) => {
      router.service(ConversationService, conversationService(deps));
      router.service(LearningService, learningService({ registry, now: () => now, seed: () => 1 }));
    },
    { router: { interceptors: [auth] } },
  );
  client = createClient(ConversationService, transport);
  await createClient(LearningService, transport).chooseCourse({ courseId: COURSE });
});

afterEach(async () => {
  await db.close();
});

describe("conversations", () => {
  it("offers nothing without a calibrated route, and refuses to start", async () => {
    await addRoute(false);
    const list = await client.listConversations({ courseId: COURSE });
    expect(list.conversations.map((c) => [c.id, c.available])).toEqual([["at-the-desk", false]]);
    const e = await client.startConversation({ courseId: COURSE, conversationId: "at-the-desk" }).catch((x: unknown) => x);
    expect(ConnectError.from(e).code).toBe(Code.FailedPrecondition);
  });

  it("offers nothing to a minor, who has no conversation consent", async () => {
    await addRoute();
    // A teen in a market open to minors studies, but is never offered the conversation consent.
    await setMarketLaunch(db, { country: "US", minorsOpen: true, updatedAt: new Date(now), updatedBy: "root" });
    await db.update(schema.learner).set({ band: "teen", country: "US" }).where(eq(schema.learner.userId, "u1"));
    const list = await client.listConversations({ courseId: COURSE });
    expect(list.conversations.every((c) => !c.available)).toBe(true);
  });

  it("signs a ticket the voice service can verify", async () => {
    await addRoute();
    const list = await client.listConversations({ courseId: COURSE });
    expect(list.conversations[0]?.available).toBe(true);
    const started = await client.startConversation({ courseId: COURSE, conversationId: "at-the-desk" });
    expect(started.url).toBe("wss://voice.test/v1/conversation");
    const [payload, signature] = started.ticket.split(".") as [string, string];
    expect(verify(null, Buffer.from(payload), keys.publicKey, Buffer.from(signature, "base64url"))).toBe(true);
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
    expect(claims).toMatchObject({ v: 1, course: COURSE, session: started.sessionId, level: {} });
    expect(claims.exp - claims.iat).toBe(60);
  });

  it("signs with a raw key as the voice service's devkeys print it", async () => {
    const raw = keys.privateKey.export({ type: "pkcs8", format: "der" }).subarray(-32).toString("base64url");
    const payload = { v: 1 as const, id: "t", learner: "l", course: "c", session: "s", level: {}, iat: 0, exp: 60 };
    const [body, signature] = (await signTicket(raw, payload)).split(".") as [string, string];
    expect(verify(null, Buffer.from(body), keys.publicKey, Buffer.from(signature, "base64url"))).toBe(true);
  });

  it("plays a conversation: opening, model turns, closing, and an idempotent result", async () => {
    await addRoute();
    const started = await client.startConversation({ courseId: COURSE, conversationId: "at-the-desk" });
    const learner = JSON.parse(Buffer.from(started.ticket.split(".")[0]!, "base64url").toString()).learner as string;
    const base = { session: started.sessionId, learner, course: COURSE };

    expect(await (await voice("turn", "POST", { ...base, lines: [] })).json()).toEqual({ text: "Hello! How can I help?", end: false });
    expect(faux.state.callCount).toBe(0);

    faux.setResponses([reply("Here is a book on volcanoes.")]);
    const lines = [
      { speaker: "tutor", text: "Hello! How can I help?" },
      { speaker: "learner", text: "A book about volcanoes, please." },
    ];
    expect(await (await voice("turn", "POST", { ...base, lines })).json()).toEqual({ text: "Here is a book on volcanoes.", end: false });

    now += 4 * 60_000;
    faux.setResponses([reply("Good luck!")]);
    expect(await (await voice("turn", "POST", { ...base, lines })).json()).toEqual({ text: "Good luck!", end: true });
    const calls = await db.select().from(schema.aiCall);
    expect(calls.map((c) => [c.use, c.ok])).toEqual([
      ["conversation", true],
      ["conversation", true],
    ]);

    const result = { ...base, lines, reason: "tutor_ended", duration_secs: 250 };
    expect((await voice(`sessions/${started.sessionId}/result`, "PUT", result)).status).toBe(204);
    expect((await voice(`sessions/${started.sessionId}/result`, "PUT", { ...result, reason: "error" })).status).toBe(204);
    const got = await client.getConversation({ sessionId: started.sessionId });
    expect(got.session).toMatchObject({ status: "ended", reason: "tutor_ended", durationSecs: 250, learnerLines: 1 });
    expect(got.lines.map((l) => l.text)).toEqual(["Hello! How can I help?", "A book about volcanoes, please."]);
    expect((await voice("turn", "POST", { ...base, lines })).status).toBe(409);
  });

  it("refuses calls without the credential, or for another learner's session", async () => {
    await addRoute();
    const started = await client.startConversation({ courseId: COURSE, conversationId: "at-the-desk" });
    const base = { session: started.sessionId, learner: crypto.randomUUID(), course: COURSE, lines: [] };
    expect((await voice("turn", "POST", base, "wrong")).status).toBe(401);
    expect((await voice("turn", "POST", base)).status).toBe(404);
  });

  it("closes a conversation at MAX_TURNS and limits starts per day", async () => {
    await addRoute();
    const started = await client.startConversation({ courseId: COURSE, conversationId: "at-the-desk" });
    const learner = JSON.parse(Buffer.from(started.ticket.split(".")[0]!, "base64url").toString()).learner as string;
    const turn = { session: started.sessionId, learner, course: COURSE, lines: [{ speaker: "learner", text: "Hi" }] };
    faux.setResponses(Array.from({ length: MAX_TURNS }, () => reply("Go on.")));
    let last: unknown;
    for (let i = 0; i < MAX_TURNS; i++) last = await (await voice("turn", "POST", turn)).json();
    expect(last).toEqual({ text: "Go on.", end: true });

    for (let i = 1; i < DAILY_CONVERSATIONS; i++) await client.startConversation({ courseId: COURSE, conversationId: "at-the-desk" });
    expect((await client.listConversations({ courseId: COURSE })).unavailable).toBe("daily-limit");
    const e = await client.startConversation({ courseId: COURSE, conversationId: "at-the-desk" }).catch((x: unknown) => x);
    expect(ConnectError.from(e).code).toBe(Code.ResourceExhausted);
  });
});
