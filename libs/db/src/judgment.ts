import { and, desc, eq, lte, ne } from "drizzle-orm";

import type { Db } from "./db.ts";
import { judgment, type StoredVerdict } from "./schema/learning.ts";

/** JudgmentRow is a stored judgment. */
export type JudgmentRow = typeof judgment.$inferSelect;

/** NewJudgment is a learner text to judge, as the session that asked for it records it. */
export type NewJudgment = Pick<
  typeof judgment.$inferInsert,
  "sessionId" | "learnerId" | "index" | "attempt" | "topicId" | "kp" | "seed" | "response" | "criteria" | "createdAt" | "nextAt"
>;

/** createJudgment stores a pending judgment, superseding any still pending for the same question. */
export async function createJudgment(db: Db, j: NewJudgment): Promise<JudgmentRow> {
  await db
    .update(judgment)
    .set({ status: "superseded", finishedAt: j.createdAt })
    .where(and(eq(judgment.sessionId, j.sessionId), eq(judgment.index, j.index), eq(judgment.status, "pending")));
  const [row] = await db.insert(judgment).values(j).returning();
  return row!;
}

/** latestJudgment is the newest judgment of a question of a session that was not superseded, if any. */
export async function latestJudgment(db: Db, sessionId: string, index: number): Promise<JudgmentRow | undefined> {
  const [row] = await db
    .select()
    .from(judgment)
    .where(and(eq(judgment.sessionId, sessionId), eq(judgment.index, index), ne(judgment.status, "superseded")))
    .orderBy(desc(judgment.attempt), desc(judgment.createdAt))
    .limit(1);
  return row;
}

/**
 * claimJudgment takes a pending judgment that is due, so that one caller at a
 * time calls a model for it: it counts the try and pushes nextAt out by the
 * lease, after which another caller may try again if this one never finished.
 */
export async function claimJudgment(db: Db, id: string, at: Date, leaseMs: number): Promise<JudgmentRow | undefined> {
  const [row] = await db.select().from(judgment).where(eq(judgment.id, id));
  if (row?.status !== "pending" || row.nextAt > at) return undefined;
  const [claimed] = await db
    .update(judgment)
    .set({ tries: row.tries + 1, nextAt: new Date(at.getTime() + leaseMs) })
    .where(and(eq(judgment.id, id), eq(judgment.status, "pending"), eq(judgment.tries, row.tries), lte(judgment.nextAt, at)))
    .returning();
  return claimed;
}

/** JudgmentUsage is what a model call cost. */
export interface JudgmentUsage {
  readonly providerId: string;
  readonly model: string;
  readonly promptVersion: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly cost: number;
}

/** finishJudgment stores a verdict; it does nothing to a judgment no longer pending. */
export async function finishJudgment(
  db: Db,
  id: string,
  verdict: StoredVerdict,
  score: number,
  usage: JudgmentUsage,
  at: Date,
): Promise<JudgmentRow | undefined> {
  const [row] = await db.select().from(judgment).where(eq(judgment.id, id));
  if (row?.status !== "pending") return undefined;
  const [done] = await db
    .update(judgment)
    .set({
      status: "done",
      verdict,
      score,
      ...usage,
      inputTokens: row.inputTokens + usage.inputTokens,
      outputTokens: row.outputTokens + usage.outputTokens,
      cost: row.cost + usage.cost,
      error: null,
      finishedAt: at,
    })
    .where(and(eq(judgment.id, id), eq(judgment.status, "pending")))
    .returning();
  return done;
}

/**
 * retryJudgment records a failed call: the judgment waits until retryAt, or
 * fails for good when retryAt is unset. error is a reason, never the learner's text.
 */
export async function retryJudgment(db: Db, id: string, error: string, at: Date, retryAt?: Date): Promise<void> {
  await db
    .update(judgment)
    .set(retryAt ? { error, nextAt: retryAt } : { error, status: "failed", finishedAt: at })
    .where(and(eq(judgment.id, id), eq(judgment.status, "pending")));
}
