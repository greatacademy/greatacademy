import type { ProblemRef } from "@ga/content";
import { appendEvent, type Db, loadState, recordAnswer, type SessionRow, updateSession } from "@ga/db";
import { applyEvent, type EngineEvent, initialState } from "@ga/engine";

import { joinLeague } from "./league.ts";
import type { CourseEntry } from "./registry.ts";
import type { Answered } from "./runner.ts";

/** learnerState loads a learner's state in a course's subject, locking it for the caller's transaction when asked. */
export function learnerState(db: Db, learnerId: string, c: CourseEntry, lock = false) {
  return loadState(db, learnerId, c.subject.def.id, initialState, lock);
}

/** appendTo folds an event into the learner's state and appends it, in the caller's transaction. */
export async function appendTo(db: Db, learnerId: string, c: CourseEntry, e: EngineEvent, sessionId?: string) {
  const stored = await learnerState(db, learnerId, c, true);
  const next = applyEvent(c.ctx, stored.state, e);
  await appendEvent(db, {
    learnerId,
    subjectId: c.subject.def.id,
    seq: stored.seq + 1,
    event: e,
    xp: next.xp - stored.state.xp,
    state: next,
    courseId: c.id,
    ...(sessionId && { sessionId }),
  });
  return next;
}

/** settleAnswer records an answer that moved a run on, appending the run's event when it ended. */
export async function settleAnswer(
  db: Db,
  learnerId: string,
  c: CourseEntry,
  row: SessionRow,
  ref: ProblemRef,
  answered: Answered,
  at: number,
): Promise<SessionRow> {
  const last = answered.run.asked[answered.run.asked.length - 1]!;
  await recordAnswer(db, {
    sessionId: row.id,
    learnerId,
    index: answered.run.asked.length - 1,
    topicId: ref.topic,
    kp: ref.kp,
    seed: ref.seed,
    response: last.response,
    skipped: answered.skipped,
    correct: answered.verdict.correct,
    ...(last.score !== undefined && { score: last.score }),
    at: new Date(at),
  });
  if (answered.event) {
    await appendTo(db, learnerId, c, answered.event, row.id);
    await joinLeague(db, learnerId, at);
  }
  const status = answered.event ? "completed" : "active";
  await updateSession(db, row.id, answered.run, status, new Date(at));
  return { ...row, status, state: answered.run };
}
