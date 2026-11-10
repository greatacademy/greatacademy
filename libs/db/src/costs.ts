import { and, asc, count, desc, eq, gte, isNotNull, sql, sum } from "drizzle-orm";

import type { Db } from "./db.ts";
import { user } from "./schema/auth.ts";
import { judgment, learner } from "./schema/learning.ts";
import { adminLog, aiCall, aiPrice } from "./schema/privacy.ts";

/** PriceRow is what a vendor charges for a model. */
export type PriceRow = typeof aiPrice.$inferSelect;

/** prices lists the prices of models. */
export async function prices(db: Db): Promise<PriceRow[]> {
  return db.select().from(aiPrice).orderBy(asc(aiPrice.providerId), asc(aiPrice.model));
}

/** setPrice writes the price of a model. */
export async function setPrice(db: Db, row: typeof aiPrice.$inferInsert): Promise<void> {
  await db
    .insert(aiPrice)
    .values(row)
    .onConflictDoUpdate({ target: [aiPrice.providerId, aiPrice.model], set: row });
}

/** deletePrice removes the price of a model. */
export async function deletePrice(db: Db, providerId: string, model: string): Promise<void> {
  await db.delete(aiPrice).where(and(eq(aiPrice.providerId, providerId), eq(aiPrice.model, model)));
}

/** NewCall is one call to a vendor, as recorded. */
export type NewCall = Omit<typeof aiCall.$inferInsert, "id">;

/** recordCalls records calls to vendors. */
export async function recordCalls(db: Db, rows: readonly NewCall[]): Promise<void> {
  if (rows.length > 0) await db.insert(aiCall).values([...rows]);
}

/** spendByProvider sums the cost of calls since a time, per vendor. */
export async function spendByProvider(db: Db, since: Date): Promise<Map<string, number>> {
  const rows = await db
    .select({ providerId: aiCall.providerId, cost: sum(aiCall.cost) })
    .from(aiCall)
    .where(gte(aiCall.at, since))
    .groupBy(aiCall.providerId);
  return new Map(rows.map((r) => [r.providerId, Number(r.cost ?? 0)]));
}

/** ModelCalls is what the calls of one vendor's model since a time came to. */
export interface ModelCalls {
  readonly providerId: string;
  readonly model: string;
  readonly calls: number;
  readonly failed: number;
  readonly cost: number;
}

/** callsByModel counts the calls of each vendor's model between two times, with how many failed and their cost. */
export async function callsByModel(db: Db, since: Date, until: Date): Promise<ModelCalls[]> {
  const rows = await db
    .select({
      providerId: aiCall.providerId,
      model: aiCall.model,
      calls: count(),
      failed: sql<string>`count(*) filter (where not ${aiCall.ok})`,
      cost: sum(aiCall.cost),
    })
    .from(aiCall)
    .where(and(gte(aiCall.at, since), sql`${aiCall.at} < ${until}`))
    .groupBy(aiCall.providerId, aiCall.model);
  return rows.map((r) => ({ ...r, failed: Number(r.failed), cost: Number(r.cost ?? 0) }));
}

/** judgmentsSince counts the texts a learner has sent to be judged since a time, rewrites included. */
export async function judgmentsSince(db: Db, learnerId: string, since: Date): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(judgment)
    .where(and(eq(judgment.learnerId, learnerId), gte(judgment.createdAt, since)));
  return row?.n ?? 0;
}

/** LearnerSpend is what one learner's calls cost since a time. */
export interface LearnerSpend {
  readonly learnerId: string;
  readonly email: string;
  readonly calls: number;
  readonly cost: number;
}

/** topSpenders lists the learners whose calls cost most since a time. */
export async function topSpenders(db: Db, since: Date, limit: number): Promise<LearnerSpend[]> {
  const cost = sum(aiCall.cost);
  const rows = await db
    .select({ learnerId: aiCall.learnerId, email: user.email, calls: count(), cost })
    .from(aiCall)
    .innerJoin(learner, eq(learner.id, aiCall.learnerId))
    .innerJoin(user, eq(user.id, learner.userId))
    .where(and(gte(aiCall.at, since), isNotNull(aiCall.learnerId)))
    .groupBy(aiCall.learnerId, user.email)
    .orderBy(desc(cost))
    .limit(limit);
  return rows.map((r) => ({ learnerId: r.learnerId!, email: r.email, calls: r.calls, cost: Number(r.cost ?? 0) }));
}

/** learnerSpend sums what learners' calls cost since a time, and counts the learners who made them. */
export async function learnerSpend(db: Db, since: Date): Promise<{ learners: number; cost: number }> {
  const [row] = await db
    .select({ learners: sql<string>`count(distinct ${aiCall.learnerId})`, cost: sum(aiCall.cost) })
    .from(aiCall)
    .where(and(gte(aiCall.at, since), eq(aiCall.use, "judgment")));
  return { learners: Number(row?.learners ?? 0), cost: Number(row?.cost ?? 0) };
}

/** logged tells whether the change log already holds an entry of an action with this target and detail. */
export async function logged(db: Db, action: string, target: string, detail: string): Promise<boolean> {
  const rows = await db
    .select({ id: adminLog.id })
    .from(adminLog)
    .where(and(eq(adminLog.action, action), eq(adminLog.target, target), eq(adminLog.detail, detail)))
    .limit(1);
  return rows.length > 0;
}
