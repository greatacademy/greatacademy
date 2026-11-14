import { createRng } from "@ga/content";
import { type Db, getSession, latestJudgment, type SessionRow, submittedSessions, updateSession } from "@ga/db";

import { type JudgingDeps, runJudgment, viewJudgment } from "./judging.ts";
import type { CourseEntry, Registry } from "./registry.ts";
import { answerRun, type RunState } from "./runner.ts";
import { learnerState, settleAnswer } from "./sessions.ts";

/**
 * ESSAY_JUDGE_LIMIT_MS is how long the judgment of a submitted essay may keep failing before it fails for good: longer
 * than an answer's, since nobody waits on it and the scheduled sweep tries it again only every quarter hour.
 */
export const ESSAY_JUDGE_LIMIT_MS = 6 * 60 * 60_000;

/** ESSAY_NOTICE_MS is how long a judged essay stays listed on the dashboard. */
export const ESSAY_NOTICE_MS = 7 * 24 * 60 * 60_000;

/** essayRun tells whether a run is the lesson of an essay, whose one text ends the session when it is submitted. */
export function essayRun(run: RunState): boolean {
  return run.kind === "lesson" && run.lesson.essay === true;
}

/** essayTopics are the essay topics a course teaches. */
export function essayTopics(c: CourseEntry): string[] {
  return c.planner.scope.topics.filter((id) => c.subject.topics.get(id)?.essay);
}

/**
 * finishEssay settles a submitted essay once its judgment has ended, in a transaction of its own: a verdict passes or
 * fails the lesson, with no rewrite, since the learner has left; a judgment that failed for good abandons the session
 * with no event, so the lesson comes again. It returns the session as it is after, or undefined when the essay is
 * still being judged or was settled already.
 */
export async function finishEssay(
  db: Db,
  c: CourseEntry,
  learnerId: string,
  sessionId: string,
  now: number,
  seed: number,
): Promise<SessionRow | undefined> {
  return db.transaction(async (tx) => {
    const row = await getSession(tx, learnerId, sessionId, true);
    if (row?.status !== "submitted") return undefined;
    const run = row.state as RunState;
    const j = await latestJudgment(tx, row.id, run.asked.length);
    if (!j || run.pending?.judgment !== j.id) return undefined;
    if (j.status === "failed") {
      await updateSession(tx, row.id, run, "abandoned", new Date(now));
      return { ...row, status: "abandoned" as const };
    }
    if (j.status !== "done") return undefined;
    const [problem] = await c.source.problems([{ topic: j.topicId, kp: j.kp, seed: j.seed }]);
    const { state: before } = await learnerState(tx, learnerId, c, true);
    const given = { problem: problem!, verdict: { correct: viewJudgment(j).passed }, score: j.score ?? 0 };
    const answered = await answerRun(c, run, before, j.response, false, now, createRng(seed), given);
    return settleAnswer(tx, learnerId, c, row, run.current!, answered, now);
  });
}

/** judgeEssay tries a submitted essay's judgment if it is due, then settles the essay if it has ended. */
export async function judgeEssay(
  db: Db,
  c: CourseEntry,
  row: SessionRow,
  judging: JudgingDeps | undefined,
  now: number,
  seed: number,
): Promise<SessionRow | undefined> {
  const run = row.state as RunState;
  const j = await latestJudgment(db, row.id, run.asked.length);
  if (judging && j?.status === "pending" && j.nextAt.getTime() <= now) await runJudgment(db, c, j.id, judging, now, ESSAY_JUDGE_LIMIT_MS);
  return finishEssay(db, c, row.learnerId, row.id, now, seed);
}

/** EssayRun counts what runEssays did. */
export interface EssayRun {
  readonly waiting: number;
  readonly settled: number;
}

/**
 * runEssays carries on the judgments of submitted essays, the longest waiting first, from the scheduled job, since a
 * learner who submitted one has left: each due judgment is tried, and each ended one settled.
 */
export async function runEssays(db: Db, registry: Registry, judging: JudgingDeps, now: number, seed: () => number): Promise<EssayRun> {
  const rows = await submittedSessions(db, 50);
  let settled = 0;
  for (const row of rows) {
    const c = await registry.course(row.courseId);
    if (!c) continue;
    try {
      if (await judgeEssay(db, c, row, judging, now, seed())) settled++;
    } catch (e) {
      console.error("essay", row.id, e);
    }
  }
  return { waiting: rows.length - settled, settled };
}
