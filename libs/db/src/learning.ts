import type { EngineEvent, LearnerState } from "@ga/engine";
import { and, asc, desc, eq, gte, isNull, ne, sql, sum } from "drizzle-orm";

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

/**
 * chooseCourse makes a course the learner's current course of its subject at
 * `at`: the one it replaces ends, and a course taken before becomes current
 * again with its history. Choosing the current course changes nothing.
 */
export async function chooseCourse(db: Db, learnerId: string, subjectId: string, courseId: string, at: Date): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .update(enrollment)
      .set({ endedAt: at })
      .where(
        and(
          eq(enrollment.learnerId, learnerId),
          eq(enrollment.subjectId, subjectId),
          isNull(enrollment.endedAt),
          ne(enrollment.courseId, courseId),
        ),
      );
    await tx
      .insert(enrollment)
      .values({ learnerId, subjectId, courseId, createdAt: at, chosenAt: at })
      .onConflictDoUpdate({
        target: [enrollment.learnerId, enrollment.courseId],
        set: {
          chosenAt: sql`case when ${enrollment.endedAt} is null then ${enrollment.chosenAt} else excluded.chosen_at end`,
          endedAt: null,
        },
      });
  });
}

/** CurrentCourse is a learner's current course of a subject. */
export interface CurrentCourse {
  readonly subjectId: string;
  readonly courseId: string;
  /** decided tells that its diagnostic report was answered: the course kept or another taken. */
  readonly decided: boolean;
}

/** currentCourses lists a learner's current courses, one per subject, the one most recently chosen or worked on first. */
export async function currentCourses(db: Db, learnerId: string): Promise<CurrentCourse[]> {
  const rows = await db
    .select({ subjectId: enrollment.subjectId, courseId: enrollment.courseId, decidedAt: enrollment.decidedAt })
    .from(enrollment)
    .where(and(eq(enrollment.learnerId, learnerId), isNull(enrollment.endedAt)))
    .orderBy(
      desc(
        sql`greatest(${enrollment.chosenAt}, (
          select max(${taskSession.startedAt}) from ${taskSession}
          where ${taskSession.learnerId} = ${enrollment.learnerId} and ${taskSession.courseId} = ${enrollment.courseId}
        ))`,
      ),
      asc(enrollment.courseId),
    );
  return rows.map((r) => ({ subjectId: r.subjectId, courseId: r.courseId, decided: r.decidedAt !== null }));
}

/** currentCourse gives a learner's current course if it is `courseId`. */
export async function currentCourse(db: Db, learnerId: string, courseId: string): Promise<CurrentCourse | undefined> {
  return (await currentCourses(db, learnerId)).find((c) => c.courseId === courseId);
}

/** decidePlacement records that the diagnostic report of a learner's course was answered. */
export async function decidePlacement(db: Db, learnerId: string, courseId: string, at: Date): Promise<void> {
  await db
    .update(enrollment)
    .set({ decidedAt: at })
    .where(and(eq(enrollment.learnerId, learnerId), eq(enrollment.courseId, courseId), isNull(enrollment.decidedAt)));
}

/** placedEvent gives the event that ended a course's diagnostic for a learner, if it ended. */
export async function placedEvent(
  db: Db,
  learnerId: string,
  subjectId: string,
  courseId: string,
): Promise<Extract<EngineEvent, { type: "placed" }> | undefined> {
  const [row] = await db
    .select({ data: event.data })
    .from(event)
    .where(and(eq(event.learnerId, learnerId), eq(event.subjectId, subjectId), eq(event.type, "placed"), eq(event.courseId, courseId)))
    .orderBy(desc(event.seq))
    .limit(1);
  return row?.data.type === "placed" ? row.data : undefined;
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
  return row ? { seq: row.seq, state: { ...initial, ...row.state } } : { seq: 0, state: initial };
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

/** totalXp sums the XP of a learner's events in a subject, or across subjects when subjectId is omitted. */
export async function totalXp(db: Db, learnerId: string, subjectId?: string): Promise<number> {
  const [row] = await db
    .select({ xp: sum(event.xp) })
    .from(event)
    .where(and(eq(event.learnerId, learnerId), subjectId === undefined ? undefined : eq(event.subjectId, subjectId)));
  return Number(row?.xp ?? 0);
}

/**
 * xpByDay sums a learner's XP per calendar day in a time zone, for events at or after since, in a subject or across
 * subjects when subjectId is omitted. Days are "YYYY-MM-DD".
 */
export async function xpByDay(db: Db, learnerId: string, since: Date, timeZone: string, subjectId?: string): Promise<Map<string, number>> {
  const day = sql<string>`to_char(${event.at} at time zone ${timeZone}, 'YYYY-MM-DD')`;
  const rows = await db
    .select({ day, xp: sum(event.xp) })
    .from(event)
    .where(and(eq(event.learnerId, learnerId), gte(event.at, since), subjectId === undefined ? undefined : eq(event.subjectId, subjectId)))
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

/** lastSession returns the session a learner touched last, if any. */
export async function lastSession(db: Db, learnerId: string): Promise<Pick<SessionRow, "status" | "updatedAt"> | undefined> {
  const [row] = await db
    .select({ status: taskSession.status, updatedAt: taskSession.updatedAt })
    .from(taskSession)
    .where(eq(taskSession.learnerId, learnerId))
    .orderBy(desc(taskSession.updatedAt))
    .limit(1);
  return row;
}

/** completedSessions returns a learner's finished sessions in a course, newest first. */
export async function completedSessions(db: Db, learnerId: string, courseId: string, limit: number): Promise<SessionRow[]> {
  return db
    .select()
    .from(taskSession)
    .where(and(eq(taskSession.learnerId, learnerId), eq(taskSession.courseId, courseId), eq(taskSession.status, "completed")))
    .orderBy(desc(taskSession.completedAt))
    .limit(limit);
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

const uuidShape = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** getSession reads a learner's session; `lock` locks it until the transaction ends. */
export async function getSession(db: Db, learnerId: string, id: string, lock = false): Promise<SessionRow | undefined> {
  // Ids come from addresses and are stored as uuids: anything else names no session, and PostgreSQL would reject it.
  if (!uuidShape.test(id)) return undefined;
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
