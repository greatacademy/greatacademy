import { appendEvent, type Db, loadState, recordAnswer, type SessionRow, updateSession } from "@ga/db";
import { applyEvent, type EngineEvent, initialState } from "@ga/engine";

import { joinLeague } from "./league.ts";
import type { CourseEntry } from "./registry.ts";
import type { Answered, RunState } from "./runner.ts";

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

/**
 * settleAnswer records the answers that moved a run on, appending the run's event when it ended. A part of a multistep
 * problem before its last records nothing: the problem is one question, recorded with its last part. A quiz records its
 * answers when it is handed in.
 */
export async function settleAnswer(
  db: Db,
  learnerId: string,
  c: CourseEntry,
  row: SessionRow,
  answered: Pick<Answered, "run" | "event"> & { readonly verdict?: Answered["verdict"] },
  at: number,
): Promise<SessionRow> {
  const asked = answered.run.asked;
  const before = (row.state as RunState).asked.length;
  for (let index = before; index < asked.length; index++) {
    const a = asked[index]!;
    // A single answer records the checker's verdict; a multistep problem is correct only when every part is.
    const single = asked.length - before === 1 && answered.verdict && !a.parts && answered.run.kind !== "quiz";
    await recordAnswer(db, {
      sessionId: row.id,
      learnerId,
      index,
      topicId: a.topic,
      kp: a.kp,
      seed: a.seed,
      response: a.response,
      skipped: a.skipped,
      correct: single ? answered.verdict!.correct : a.correct,
      ...(a.score !== undefined && { score: a.score }),
      at: new Date(at),
    });
  }
  if (answered.event) {
    await appendTo(db, learnerId, c, answered.event, row.id);
    await joinLeague(db, learnerId, at);
  }
  const status = answered.event ? "completed" : "active";
  await updateSession(db, row.id, answered.run, status, new Date(at));
  return { ...row, status, state: answered.run };
}
