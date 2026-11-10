import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import type { ConversationDef } from "@ga/content";
import {
  type ConversationRow,
  conversationsSince,
  countTurn,
  createConversation,
  currentCourse,
  type Db,
  endConversation,
  getConversation,
  learnerAge,
  learnerFor,
  type NewCall,
  providers,
  recentConversations,
  recordCalls,
  type StoredLine,
} from "@ga/db";
import { DAY } from "@ga/engine";
import { type ConversationLine, callCost, configure, converse, gatewayHeaders, MAX_LINE_CHARS, MAX_LINES, ReplyRejected } from "@ga/judge";
import type { ConversationService, Session } from "@ga/proto/conversation/v1/conversation_pb";

import { requirePlan } from "./billing.ts";
import { type QualifiedRoute, qualifyingRoute, requireStudy } from "./capabilities.ts";
import { dbKey, userIdKey } from "./context.ts";
import { text } from "./convert.ts";
import type { JudgingDeps } from "./judging.ts";
import type { CourseEntry, Registry } from "./registry.ts";
import { decryptSecret } from "./secrets.ts";

/** TICKET_LIFETIME_SECS is how long a ticket for the voice service is valid. */
export const TICKET_LIFETIME_SECS = 60;

/** DAILY_CONVERSATIONS is how many conversations a learner may start in 24 hours (*starting*), which bounds their cost. */
export const DAILY_CONVERSATIONS = 10;

/** MAX_TURNS is the tutor turns a conversation may ask for; the one that reaches it closes the conversation. */
export const MAX_TURNS = 40;

/** END_REASONS are the reasons the voice service gives for the end of a session. */
export const END_REASONS = ["tutor_ended", "learner_ended", "time_limit", "disconnected", "error"] as const;

/** VoiceConfig is how the web Worker reaches the voice service and is reached by it (deploy/voice). */
export interface VoiceConfig {
  /** url is the voice service's WebSocket, such as wss://voice.greatacademy.dev/v1/conversation. */
  readonly url: string;
  /** privateKey is the Ed25519 key that signs tickets in base64url: its raw 32 bytes, as `ga_voice.devkeys` prints it, or PKCS #8 DER. */
  readonly privateKey: string;
  /** credential is what the voice service presents as a bearer token. */
  readonly credential: string;
}

/** ConversationDeps are the conversation service's dependencies besides the request context. */
export interface ConversationDeps {
  readonly registry: Registry;
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
  /** billing makes a conversation need a plan that covers its subject, as studying does. */
  readonly billing?: boolean;
  /** voice is the voice service; without it no conversation is offered. */
  readonly voice?: VoiceConfig;
  /** judging reaches the models; the tutor's turns use its key and its connect. */
  readonly judging?: JudgingDeps;
}

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

/** TicketPayload is what a ticket says, as apps/voice/src/ga_voice/tickets.py reads it. */
export interface TicketPayload {
  readonly v: 1;
  readonly id: string;
  readonly learner: string;
  readonly course: string;
  readonly session: string;
  readonly level: { readonly cefr: string } | { readonly grade: number } | Record<string, never>;
  readonly iat: number;
  readonly exp: number;
}

/** ED25519_PKCS8_PREFIX is the PKCS #8 DER that comes before a raw Ed25519 private key (RFC 8410). */
const ED25519_PKCS8_PREFIX = Uint8Array.from([
  0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20,
]);

/** pkcs8 wraps a raw 32-byte Ed25519 private key in PKCS #8 DER, which WebCrypto imports; DER passes unchanged. */
function pkcs8(key: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
  if (key.length !== 32) return key;
  const der = new Uint8Array(ED25519_PKCS8_PREFIX.length + 32);
  der.set(ED25519_PKCS8_PREFIX);
  der.set(key, ED25519_PKCS8_PREFIX.length);
  return der;
}

/** signTicket signs a ticket: base64url JSON, a dot, and the Ed25519 signature of the base64url text. */
export async function signTicket(privateKey: string, payload: TicketPayload): Promise<string> {
  const key = await crypto.subtle.importKey("pkcs8", pkcs8(fromB64url(privateKey)), { name: "Ed25519" }, false, ["sign"]);
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = new Uint8Array(await crypto.subtle.sign({ name: "Ed25519" }, key, new TextEncoder().encode(body)));
  return `${body}.${b64url(signature)}`;
}

/** sameSecret compares a presented credential with the expected one in time that does not depend on where they differ. */
function sameSecret(given: string, expected: string): boolean {
  if (expected === "" || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function auth(ctx: HandlerContext): { db: Db; userId: string } {
  const db = ctx.values.get(dbKey);
  if (!db) throw new ConnectError("no database", Code.Internal);
  const userId = ctx.values.get(userIdKey);
  if (!userId) throw new ConnectError("sign in first", Code.Unauthenticated);
  return { db, userId };
}

/** sessionMessage is what a learner sees of a stored conversation. */
function sessionMessage(row: ConversationRow): Omit<Session, "$typeName"> {
  return {
    id: row.id,
    conversationId: row.conversationId,
    status: row.status,
    reason: row.reason ?? "",
    durationSecs: row.durationSecs ?? 0,
    startedAt: BigInt(row.startedAt.getTime()),
    learnerLines: row.learnerLines ?? 0,
  };
}

/** conversationRoute finds the route the tutor of a conversation may use for a learner, if any. */
function conversationRoute(db: Db, id: string, learnerId: string, at: number, avoid?: "primary", budget = true) {
  return qualifyingRoute(db, id, learnerId, "conversation", at, avoid, budget);
}

/**
 * conversationService implements ConversationService. A learner may start a
 * conversation of a course they take when the voice service is configured, a
 * route for that conversation qualifies for them (so for a minor, only with the
 * conversation consent, which is not offered yet), and they have not reached
 * DAILY_CONVERSATIONS.
 */
export function conversationService(deps: ConversationDeps): ServiceImpl<typeof ConversationService> {
  /** current resolves the learner and the course they take, refusing one who may not study it now. */
  const current = async (ctx: HandlerContext, courseId: string) => {
    const { db, userId } = auth(ctx);
    const learnerId = await learnerFor(db, userId);
    const c = await deps.registry.course(courseId);
    if (!c) throw new ConnectError(`unknown course ${courseId}`, Code.NotFound);
    await requireStudy(db, learnerId, deps.now());
    if (deps.billing) await requirePlan(db, learnerId, c.subject.def.id, deps.now());
    if (!(await currentCourse(db, learnerId, courseId)))
      throw new ConnectError(`${courseId} is not the current course`, Code.FailedPrecondition);
    return { db, learnerId, c };
  };

  const offered = (c: CourseEntry): ConversationDef[] =>
    (c.course.def.conversations ?? []).flatMap((id) => {
      const def = c.subject.conversations.get(id);
      return def ? [def] : [];
    });

  const message = (def: ConversationDef, available: boolean) => ({
    id: def.id,
    title: text(def.title),
    task: text(def.task),
    minutes: def.minutes,
    available,
  });

  return {
    async listConversations(req, ctx) {
      const { db, learnerId, c } = await current(ctx, req.courseId);
      const now = deps.now();
      const unavailable = !deps.voice
        ? "voice-off"
        : (await conversationsSince(db, learnerId, new Date(now - DAY))) >= DAILY_CONVERSATIONS
          ? "daily-limit"
          : "";
      const conversations = await Promise.all(
        offered(c).map(async (def) => message(def, !unavailable && (await conversationRoute(db, def.id, learnerId, now)) !== undefined)),
      );
      const recent = await recentConversations(db, learnerId, c.id, 10);
      return { conversations, unavailable, recent: recent.map(sessionMessage) };
    },

    async startConversation(req, ctx) {
      const { db, learnerId, c } = await current(ctx, req.courseId);
      const def = offered(c).find((d) => d.id === req.conversationId);
      if (!def) throw new ConnectError(`${req.courseId} has no conversation ${req.conversationId}`, Code.NotFound);
      const voice = deps.voice;
      if (!voice) throw new ConnectError("conversations are not available: voice-off", Code.FailedPrecondition);
      const now = deps.now();
      if ((await conversationsSince(db, learnerId, new Date(now - DAY))) >= DAILY_CONVERSATIONS)
        throw new ConnectError("conversations are not available: daily-limit", Code.ResourceExhausted);
      if (!(await conversationRoute(db, def.id, learnerId, now)))
        throw new ConnectError("conversations are not available: no-route", Code.FailedPrecondition);
      const row = await createConversation(db, {
        learnerId,
        subjectId: c.subject.def.id,
        courseId: c.id,
        conversationId: def.id,
        startedAt: new Date(now),
      });
      const iat = Math.floor(now / 1000);
      const ticket = await signTicket(voice.privateKey, {
        v: 1,
        id: crypto.randomUUID(),
        learner: learnerId,
        course: c.id,
        session: row.id,
        level: {},
        iat,
        exp: iat + TICKET_LIFETIME_SECS,
      });
      return { sessionId: row.id, ticket, url: voice.url, conversation: message(def, true) };
    },

    async getConversation(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const row = await getConversation(db, req.sessionId);
      if (!row || row.learnerId !== learnerId) throw new ConnectError("no such conversation", Code.NotFound);
      return { session: sessionMessage(row), lines: (row.lines ?? []).map((l) => ({ speaker: l.speaker, text: l.text })) };
    },
  };
}

/** VOICE_PREFIX is where the voice service's calls to the web Worker arrive. */
export const VOICE_PREFIX = "/voice/v1/";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

/** readLines checks the lines the voice service sends. */
function readLines(raw: unknown): ConversationLine[] | undefined {
  if (!Array.isArray(raw) || raw.length > MAX_LINES) return undefined;
  const lines: ConversationLine[] = [];
  for (const l of raw as unknown[]) {
    if (typeof l !== "object" || l === null) return undefined;
    const { speaker, text: said } = l as { speaker?: unknown; text?: unknown };
    if ((speaker !== "learner" && speaker !== "tutor") || typeof said !== "string" || said.length > MAX_LINE_CHARS) return undefined;
    lines.push({ speaker, text: said });
  }
  return lines;
}

/** readSession checks the fields that name a session, and finds it. */
async function readSession(db: Db, body: Record<string, unknown>): Promise<ConversationRow | undefined> {
  const { session, learner, course } = body;
  if (typeof session !== "string" || typeof learner !== "string" || typeof course !== "string") return undefined;
  const row = await getConversation(db, session);
  return row && row.learnerId === learner && row.courseId === course ? row : undefined;
}

/**
 * handleVoice answers the voice service's calls (apps/voice/src/ga_voice/worker_client.py):
 * POST turn asks for the tutor's next line, and PUT sessions/{id}/result writes
 * the session's result, idempotently. Both need the service's credential. The
 * first turn is the conversation's opening line, with no model call; after
 * the conversation's minutes or MAX_TURNS the tutor is asked to close.
 */
export async function handleVoice(request: Request, db: Db, deps: ConversationDeps): Promise<Response> {
  const voice = deps.voice;
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!voice || !sameSecret(given, voice.credential)) return json({ error: "unauthorized" }, 401);
  const path = new URL(request.url).pathname.slice(VOICE_PREFIX.length);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return json({ error: "bad-request" }, 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: "bad-request" }, 400);
  }

  if (path === "turn" && request.method === "POST") {
    const lines = readLines(body.lines);
    const row = await readSession(db, body);
    if (!lines) return json({ error: "bad-request" }, 400);
    if (!row) return json({ error: "no-session" }, 404);
    if (row.status !== "active") return json({ error: "ended" }, 409);
    const c = await deps.registry.course(row.courseId);
    const def = c?.subject.conversations.get(row.conversationId);
    if (!def) return json({ error: "no-conversation" }, 404);
    if (lines.length === 0) return json({ text: def.opening, end: false });
    const turns = await countTurn(db, row.id);
    if (turns === undefined) return json({ error: "ended" }, 409);
    if (turns > MAX_TURNS + 1) return json({ error: "too-many-turns" }, 429);
    const now = deps.now();
    const closing = turns >= MAX_TURNS || now - row.startedAt.getTime() >= def.minutes * 60_000;
    return tutorTurn(db, deps, row, def, lines, closing, turns === 1, now);
  }

  const result = /^sessions\/([^/]+)\/result$/.exec(path);
  if (result && request.method === "PUT") {
    const row = await readSession(db, body);
    const lines = readLines(body.lines);
    const { reason, duration_secs: duration } = body;
    if (body.session !== result[1] || !lines || typeof duration !== "number" || !Number.isFinite(duration) || duration < 0)
      return json({ error: "bad-request" }, 400);
    if (!END_REASONS.includes(reason as (typeof END_REASONS)[number])) return json({ error: "bad-request" }, 400);
    if (!row) return json({ error: "no-session" }, 404);
    // A child's transcript is never kept (docs/minors-data.md §10).
    const kept = (await learnerAge(db, row.learnerId)).band !== "child";
    await endConversation(db, row.id, {
      reason: reason as string,
      durationSecs: duration,
      learnerLines: lines.filter((l) => l.speaker === "learner").length,
      lines: kept ? lines.map((l): StoredLine => ({ speaker: l.speaker, text: l.text })) : null,
      at: new Date(deps.now()),
    });
    return new Response(null, { status: 204 });
  }
  return json({ error: "not-found" }, 404);
}

/**
 * tutorTurn asks a model for the tutor's next line, on the primary route and
 * then once on the backup. The first turn needs the vendor's budget; a
 * conversation already started finishes whatever the budget. Every call is
 * recorded with its cost, failed ones too.
 */
async function tutorTurn(
  db: Db,
  deps: ConversationDeps,
  row: ConversationRow,
  def: ConversationDef,
  lines: readonly ConversationLine[],
  closing: boolean,
  first: boolean,
  now: number,
): Promise<Response> {
  if (!deps.judging) return json({ error: "no-route" }, 503);
  const calls: NewCall[] = [];
  const call = (route: QualifiedRoute, usage: { input: number; output: number } | undefined, ok: boolean) =>
    calls.push({
      providerId: route.providerId,
      model: route.model,
      use: "conversation",
      learnerId: row.learnerId,
      inputTokens: usage?.input ?? 0,
      outputTokens: usage?.output ?? 0,
      cost: usage ? callCost(usage, route.price) : 0,
      ok,
      at: new Date(now),
    });
  const list = await providers(db);
  try {
    for (const avoid of [undefined, "primary"] as const) {
      const route = await conversationRoute(db, def.id, row.learnerId, now, avoid, first);
      if (!route || (avoid && route.position === "primary")) continue;
      const p = list.find((x) => x.id === route.providerId);
      if (!p?.keyCipher) continue;
      const config = {
        id: p.id,
        name: p.name,
        api: p.api,
        baseUrl: p.baseUrl,
        apiKey: await decryptSecret(deps.judging.aiKeysSecret, p.keyCipher),
        catalog: p.catalog,
      };
      const { models, model, gateway } = (deps.judging.connect ?? configure)(config, route.model);
      try {
        const reply = await converse(
          models,
          model,
          { scene: { scenario: def.scenario }, lines, promptVersion: route.promptVersion, closing },
          gateway ? { headers: gatewayHeaders({ use: "conversation", conversation: def.id, prompt: route.promptVersion }) } : {},
        );
        call(route, reply.usage, true);
        return json({ text: reply.text, end: reply.end });
      } catch (e) {
        // Only the failure is kept: a provider's message may repeat the learner's words.
        call(route, e instanceof ReplyRejected ? e.usage : undefined, false);
      }
    }
    return json({ error: "no-route" }, 503);
  } finally {
    await recordCalls(db, calls);
  }
}
