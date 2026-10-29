import type { EngineEvent, LearnerState } from "@ga/engine";
import { and, asc, eq, gte, sql, sum } from "drizzle-orm";

import type { Db } from "./db.ts";
import { answer, enrollment, event, learner, learnerState, type SessionStatus, taskSession } from "./schema/learning.ts";

/** learnerFor returns the learner of a user, creating it on first use. */
export async function learnerFor(db: Db, userId: string): Promise<string> {
  const [created] = await db.insert(learner).values({ userId }).onConflictDoNothing().returning({ id: learner.id });
  if (created) return created.id;
  const [found] = await db.select({ id: learner.id }).from(learner).where(eq(learner.userId, userId));
  if (!found) throw new Error(`no learner for user ${userId}`);
  return found.id;
}

/** enroll enrolls a learner in a course; enrolling twice is harmless. */
export async function enroll(db: Db, learnerId: string, subjectId: string, courseId: string): Promise<void> {
  await db.insert(enrollment).values({ learnerId, subjectId, courseId }).onConflictDoNothing();
}

/** enrollments lists a learner's enrollments, oldest first. */
export async function enrollments(db: Db, learnerId: string): Promise<{ subjectId: string; courseId: string }[]> {
  return db
    .select({ subjectId: enrollment.subjectId, courseId: enrollment.courseId })
    .from(enrollment)
    .where(eq(enrollment.learnerId, learnerId))
    .orderBy(asc(enrollment.createdAt), asc(enrollment.courseId));
}

/** isEnrolled tells whether a learner is enrolled in a course. */
export async function isEnrolled(db: Db, learnerId: string, courseId: string): Promise<boolean> {
  const rows = await db
    .select({ c: enrollment.courseId })
    .from(enrollment)
    .where(and(eq(enrollment.learnerId, learnerId), eq(enrollment.courseId, courseId)));
  return rows.length > 0;
}

/** StoredState is a learner's state in a subject and the seq of the last event folded into it (0 for none). */
export interface StoredState {
  readonly seq: number;
  readonly state: LearnerState;
}

/** loadState reads the state snapshot; `lock` locks it until the transaction ends, serializing writers. */
export async function loadState(db: Db, learnerId: string, subjectId: string, initial: LearnerState, lock = false): Promise<StoredState> {
  const q = db
    .select({ seq: learnerState.seq, state: learnerState.state })
    .from(learnerState)
    .where(and(eq(learnerState.learnerId, learnerId), eq(learnerState.subjectId, subjectId)));
  const [row] = lock ? await q.for("update") : await q;
  return row ?? { seq: 0, state: initial };
}

/** NewEvent is an event to append with the state that results from it. */
export interface NewEvent {
  readonly learnerId: string;
  readonly subjectId: string;
  /** seq must be the stored seq plus one; a concurrent append makes the insert fail. */
  readonly seq: number;
  readonly event: EngineEvent;
  readonly xp: number;
  readonly state: LearnerState;
  readonly courseId?: string;
  readonly sessionId?: string;
}

/** appendEvent appends an event and stores the resulting state. Call it in a transaction. */
export async function appendEvent(db: Db, e: NewEvent): Promise<void> {
  const at = new Date(e.event.at);
  await db.insert(event).values({
    learnerId: e.learnerId,
    subjectId: e.subjectId,
    seq: e.seq,
    at,
    type: e.event.type,
    courseId: e.courseId ?? null,
    sessionId: e.sessionId ?? null,
    xp: e.xp,
    data: e.event,
  });
  await db
    .insert(learnerState)
    .values({ learnerId: e.learnerId, subjectId: e.subjectId, seq: e.seq, state: e.state, updatedAt: at })
    .onConflictDoUpdate({ target: [learnerState.learnerId, learnerState.subjectId], set: { seq: e.seq, state: e.state, updatedAt: at } });
}

/** events reads a learner's event log in a subject, in order. */
export async function events(db: Db, learnerId: string, subjectId: string): Promise<EngineEvent[]> {
  const rows = await db
    .select({ data: event.data })
    .from(event)
    .where(and(eq(event.learnerId, learnerId), eq(event.subjectId, subjectId)))
    .orderBy(asc(event.seq));
  return rows.map((r) => r.data);
}

/** totalXp sums the XP of a learner's events across subjects. */
export async function totalXp(db: Db, learnerId: string): Promise<number> {
  const [row] = await db
    .select({ xp: sum(event.xp) })
    .from(event)
    .where(eq(event.learnerId, learnerId));
  return Number(row?.xp ?? 0);
}

/** xpByDay sums a learner's XP per calendar day in a time zone, for events at or after since. Days are "YYYY-MM-DD". */
export async function xpByDay(db: Db, learnerId: string, since: Date, timeZone: string): Promise<Map<string, number>> {
  const day = sql<string>`to_char(${event.at} at time zone ${timeZone}, 'YYYY-MM-DD')`;
  const rows = await db
    .select({ day, xp: sum(event.xp) })
    .from(event)
    .where(and(eq(event.learnerId, learnerId), gte(event.at, since)))
    .groupBy(sql`1`);
  return new Map(rows.map((r) => [r.day, Number(r.xp ?? 0)]));
}

/** SessionRow is a stored task session. */
export type SessionRow = typeof taskSession.$inferSelect;

/** activeSession returns a learner's active session in a course, if any. */
export async function activeSession(db: Db, learnerId: string, courseId: string): Promise<SessionRow | undefined> {
  const [row] = await db
    .select()
    .from(taskSession)
    .where(and(eq(taskSession.learnerId, learnerId), eq(taskSession.courseId, courseId), eq(taskSession.status, "active")));
  return row;
}

/** NewSession is a session to create. */
export interface NewSession {
  readonly learnerId: string;
  readonly subjectId: string;
  readonly courseId: string;
  readonly kind: string;
  readonly topicId?: string;
  readonly state: unknown;
  readonly at: Date;
}

/** createSession creates an active session. It fails if the learner already has one in the course. */
export async function createSession(db: Db, s: NewSession): Promise<SessionRow> {
  const [row] = await db
    .insert(taskSession)
    .values({
      learnerId: s.learnerId,
      subjectId: s.subjectId,
      courseId: s.courseId,
      kind: s.kind,
      topicId: s.topicId ?? null,
      state: s.state,
      startedAt: s.at,
      updatedAt: s.at,
    })
    .returning();
  return row!;
}

/** getSession reads a learner's session; `lock` locks it until the transaction ends. */
export async function getSession(db: Db, learnerId: string, id: string, lock = false): Promise<SessionRow | undefined> {
  const q = db
    .select()
    .from(taskSession)
    .where(and(eq(taskSession.id, id), eq(taskSession.learnerId, learnerId)));
  const [row] = lock ? await q.for("update") : await q;
  return row;
}

/** updateSession stores a session's new state and status. */
export async function updateSession(db: Db, id: string, state: unknown, status: SessionStatus, at: Date): Promise<void> {
  await db
    .update(taskSession)
    .set({ state, status, updatedAt: at, ...(status !== "active" && { completedAt: at }) })
    .where(eq(taskSession.id, id));
}

/** NewAnswer is a judged response. */
export type NewAnswer = Omit<typeof answer.$inferInsert, "id">;

/** recordAnswer appends a judged response to the answer log. */
export async function recordAnswer(db: Db, a: NewAnswer): Promise<void> {
  await db.insert(answer).values(a);
}
