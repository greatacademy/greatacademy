import { and, count, desc, eq, gte, isNotNull, lt, sql } from "drizzle-orm";

import type { Db } from "./db.ts";
import { conversationSession, type StoredLine } from "./schema/learning.ts";

/** ConversationRow is a stored spoken conversation. */
export type ConversationRow = typeof conversationSession.$inferSelect;

/** NewConversation is a conversation whose ticket is being signed. */
export type NewConversation = Pick<
  typeof conversationSession.$inferInsert,
  "learnerId" | "subjectId" | "courseId" | "conversationId" | "startedAt"
>;

/** createConversation stores a conversation as active. */
export async function createConversation(db: Db, c: NewConversation): Promise<ConversationRow> {
  const [row] = await db.insert(conversationSession).values(c).returning();
  return row!;
}

/** getConversation finds a conversation by id; an id that is not a UUID finds none. */
export async function getConversation(db: Db, id: string): Promise<ConversationRow | undefined> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return undefined;
  const [row] = await db.select().from(conversationSession).where(eq(conversationSession.id, id));
  return row;
}

/** conversationsSince counts the conversations a learner started since a time. */
export async function conversationsSince(db: Db, learnerId: string, since: Date): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(conversationSession)
    .where(and(eq(conversationSession.learnerId, learnerId), gte(conversationSession.startedAt, since)));
  return row?.n ?? 0;
}

/** recentConversations lists a learner's conversations in a course, newest first. */
export async function recentConversations(db: Db, learnerId: string, courseId: string, limit: number): Promise<ConversationRow[]> {
  return db
    .select()
    .from(conversationSession)
    .where(and(eq(conversationSession.learnerId, learnerId), eq(conversationSession.courseId, courseId)))
    .orderBy(desc(conversationSession.startedAt))
    .limit(limit);
}

/** countTurn counts a tutor turn of an active conversation and returns the new count, or undefined if it is not active. */
export async function countTurn(db: Db, id: string): Promise<number | undefined> {
  const [row] = await db
    .update(conversationSession)
    .set({ turns: sql`${conversationSession.turns} + 1` })
    .where(and(eq(conversationSession.id, id), eq(conversationSession.status, "active")))
    .returning({ turns: conversationSession.turns });
  return row?.turns;
}

/** ConversationResult is what the voice service reports at the end of a conversation. */
export interface ConversationResult {
  readonly reason: string;
  readonly durationSecs: number;
  readonly learnerLines: number;
  /** lines is the transcript to keep, or null when none may be kept. */
  readonly lines: readonly StoredLine[] | null;
  readonly at: Date;
}

/** endConversation records the result of an active conversation; a second result changes nothing, so writing it is idempotent. */
export async function endConversation(db: Db, id: string, r: ConversationResult): Promise<boolean> {
  const rows = await db
    .update(conversationSession)
    .set({ status: "ended", reason: r.reason, durationSecs: r.durationSecs, learnerLines: r.learnerLines, lines: r.lines, endedAt: r.at })
    .where(and(eq(conversationSession.id, id), eq(conversationSession.status, "active")))
    .returning({ id: conversationSession.id });
  return rows.length > 0;
}

/** clearOldConversationLines deletes the transcripts of conversations that ended before a time; their results remain. */
export async function clearOldConversationLines(db: Db, before: Date): Promise<number> {
  const rows = await db
    .update(conversationSession)
    .set({ lines: null })
    .where(and(lt(conversationSession.endedAt, before), isNotNull(conversationSession.lines)))
    .returning({ id: conversationSession.id });
  return rows.length;
}
