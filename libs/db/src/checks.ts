import { and, asc, count, desc, eq, gte, isNotNull, isNull, sql } from "drizzle-orm";

import type { Db } from "./db.ts";
import { judgment } from "./schema/learning.ts";
import { calibration, verdictCheck } from "./schema/privacy.ts";

/** NewCheck is a sampled criterion of a live judgment. */
export type NewCheck = typeof verdictCheck.$inferInsert;

/** CheckRow is a sampled criterion as stored. */
export type CheckRow = typeof verdictCheck.$inferSelect;

/** addChecks records sampled criteria. */
export async function addChecks(db: Db, rows: readonly NewCheck[]): Promise<void> {
  if (rows.length > 0) await db.insert(verdictCheck).values([...rows]);
}

const hasText = sql`${judgment.response} <> ''`;

/** WaitingCheck is a sample waiting for a person, with the learner's text as stored. */
export interface WaitingCheck {
  readonly check: CheckRow;
  readonly text: string;
}

/** nextCheck finds the oldest sample waiting for a person whose text has not expired. */
export async function nextCheck(db: Db): Promise<WaitingCheck | undefined> {
  const [row] = await db
    .select({ check: verdictCheck, text: judgment.response })
    .from(verdictCheck)
    .innerJoin(judgment, eq(judgment.id, verdictCheck.judgmentId))
    .where(and(isNull(verdictCheck.checkedAt), hasText))
    .orderBy(asc(verdictCheck.sampledAt), asc(verdictCheck.id))
    .limit(1);
  return row;
}

/** waitingChecks counts the samples waiting for a person whose text has not expired. */
export async function waitingChecks(db: Db): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(verdictCheck)
    .innerJoin(judgment, eq(judgment.id, verdictCheck.judgmentId))
    .where(and(isNull(verdictCheck.checkedAt), hasText));
  return row?.n ?? 0;
}

/** saveCheck records a person's verdict on a waiting sample, returning it, or nothing when it was already checked or is gone. */
export async function saveCheck(db: Db, id: string, personMet: boolean, by: string, at: Date): Promise<CheckRow | undefined> {
  const [row] = await db
    .update(verdictCheck)
    .set({ personMet, checkedBy: by, checkedAt: at })
    .where(and(eq(verdictCheck.id, id), isNull(verdictCheck.checkedAt)))
    .returning();
  return row;
}

/** checkedSince lists the samples a person checked since a time. */
export async function checkedSince(db: Db, since: Date): Promise<CheckRow[]> {
  return db
    .select()
    .from(verdictCheck)
    .where(and(isNotNull(verdictCheck.checkedAt), gte(verdictCheck.checkedAt, since)));
}

/** CalibrationKappa is a route's kappa in its newest passing calibration. */
export interface CalibrationKappa {
  readonly criterion: string;
  readonly providerId: string;
  readonly model: string;
  readonly promptVersion: string;
  readonly kappa: number;
}

/** passingKappas lists, for each route with a passing calibration, the kappa of its newest one. */
export async function passingKappas(db: Db): Promise<CalibrationKappa[]> {
  const rows = await db
    .select({
      criterion: calibration.criterion,
      providerId: calibration.providerId,
      model: calibration.model,
      promptVersion: calibration.promptVersion,
      kappa: calibration.kappa,
    })
    .from(calibration)
    .where(eq(calibration.passed, true))
    .orderBy(desc(calibration.at));
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = `${r.criterion}|${r.providerId}|${r.model}|${r.promptVersion}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
