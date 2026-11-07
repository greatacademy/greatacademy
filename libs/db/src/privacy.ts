import { and, desc, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";

import type { Db } from "./db.ts";
import { session, user } from "./schema/auth.ts";
import { type AgeBand, answer, enrollment, event, guardian, learner, taskSession } from "./schema/learning.ts";
import { type ConsentScope, consent, guardianVerification } from "./schema/privacy.ts";

/** LearnerAge is what the age question left on a learner. */
export interface LearnerAge {
  readonly band: AgeBand | null;
  readonly bandEndsAt: Date | null;
  readonly country: string | null;
  readonly managed: boolean;
  readonly dailyMinutes: number | null;
}

/** learnerAge reads a learner's age band and limits. */
export async function learnerAge(db: Db, learnerId: string): Promise<LearnerAge> {
  const [row] = await db
    .select({
      band: learner.band,
      bandEndsAt: learner.bandEndsAt,
      country: learner.country,
      managed: learner.managed,
      dailyMinutes: learner.dailyMinutes,
    })
    .from(learner)
    .where(eq(learner.id, learnerId));
  if (!row) throw new Error(`no learner ${learnerId}`);
  return row;
}

/** setLearnerAge stores a learner's band, its end and country, turning league play off for a child. */
export async function setLearnerAge(
  db: Db,
  learnerId: string,
  age: { band: AgeBand; bandEndsAt: Date | null; country: string },
): Promise<void> {
  await db
    .update(learner)
    .set({ ...age, ...(age.band === "child" && { leagues: false }) })
    .where(eq(learner.id, learnerId));
}

/** setManaged marks a learner as a child's account made by a guardian. */
export async function setManaged(db: Db, learnerId: string): Promise<void> {
  await db.update(learner).set({ managed: true }).where(eq(learner.id, learnerId));
}

/** setDailyMinutes sets or clears a guardian's study limit. */
export async function setDailyMinutes(db: Db, learnerId: string, minutes: number | null): Promise<void> {
  await db.update(learner).set({ dailyMinutes: minutes }).where(eq(learner.id, learnerId));
}

/** userOfLearner returns the account behind a learner. */
export async function userOfLearner(db: Db, learnerId: string): Promise<string> {
  const [row] = await db.select({ userId: learner.userId }).from(learner).where(eq(learner.id, learnerId));
  if (!row) throw new Error(`no learner ${learnerId}`);
  return row.userId;
}

/** ConsentRow is a stored consent. */
export type ConsentRow = typeof consent.$inferSelect;

/** recordConsent appends a grant. */
export async function recordConsent(db: Db, grant: typeof consent.$inferInsert): Promise<void> {
  await db.insert(consent).values(grant);
}

/** consentsOf lists all of a learner's consents, newest first. */
export async function consentsOf(db: Db, learnerId: string): Promise<ConsentRow[]> {
  return db.select().from(consent).where(eq(consent.learnerId, learnerId)).orderBy(desc(consent.grantedAt));
}

/** currentConsents lists the consents in force at a time. */
export async function currentConsents(db: Db, learnerId: string, at: Date): Promise<ConsentRow[]> {
  return db
    .select()
    .from(consent)
    .where(and(eq(consent.learnerId, learnerId), isNull(consent.withdrawnAt), gt(consent.expiresAt, at)));
}

/** withdrawConsent ends every grant of a scope in force, returning how many it ended. */
export async function withdrawConsent(db: Db, learnerId: string, scope: ConsentScope, by: string, at: Date): Promise<number> {
  const rows = await db
    .update(consent)
    .set({ withdrawnAt: at, withdrawnBy: by })
    .where(and(eq(consent.learnerId, learnerId), eq(consent.scope, scope), isNull(consent.withdrawnAt)))
    .returning({ id: consent.id });
  return rows.length;
}

/** VerificationRow is a stored guardian verification. */
export type VerificationRow = typeof guardianVerification.$inferSelect;

/** submitVerification records a guardian's proof, waiting for a decision. */
export async function submitVerification(
  db: Db,
  v: { userId: string; method: string; formKey: string; formType: string; at: Date },
): Promise<string> {
  const [row] = await db
    .insert(guardianVerification)
    .values({ userId: v.userId, method: v.method, formKey: v.formKey, formType: v.formType, submittedAt: v.at })
    .returning({ id: guardianVerification.id });
  return row!.id;
}

/** latestVerification returns a person's newest verification. */
export async function latestVerification(db: Db, userId: string): Promise<VerificationRow | undefined> {
  const rows = await db
    .select()
    .from(guardianVerification)
    .where(eq(guardianVerification.userId, userId))
    .orderBy(desc(guardianVerification.submittedAt))
    .limit(1);
  return rows[0];
}

/** approvedVerification returns the method of a person's approved verification, if any. */
export async function approvedVerification(db: Db, userId: string): Promise<string | undefined> {
  const rows = await db
    .select({ method: guardianVerification.method })
    .from(guardianVerification)
    .where(and(eq(guardianVerification.userId, userId), eq(guardianVerification.status, "approved")))
    .limit(1);
  return rows[0]?.method;
}

/** studiedMs sums the time of a learner's sessions that touch the period from since on. */
export async function studiedMs(db: Db, learnerId: string, since: Date): Promise<number> {
  const [row] = await db
    .select({
      ms: sql<string>`coalesce(sum(extract(epoch from ${taskSession.updatedAt} - greatest(${taskSession.startedAt}, ${since.toISOString()}::timestamptz))) * 1000, 0)`,
    })
    .from(taskSession)
    .where(and(eq(taskSession.learnerId, learnerId), gt(taskSession.updatedAt, since)));
  return Number(row?.ms ?? 0);
}

/** blankedRuns rewrites a stored run with the response of every asked question emptied. */
const blankedRuns = sql`jsonb_set(${taskSession.state}, '{asked}', (
  select coalesce(jsonb_agg(jsonb_set(a.value, '{response}', '""') order by a.ordinality), '[]'::jsonb)
  from jsonb_array_elements(${taskSession.state} -> 'asked') with ordinality as a
))`;

/** hasAsked selects the runs that hold a list of asked questions. */
const hasAsked = sql`jsonb_typeof(${taskSession.state} -> 'asked') = 'array'`;

/** clearResponses empties a learner's free text in answers and in finished runs, keeping whether each was right. */
export async function clearResponses(db: Db, learnerId: string): Promise<number> {
  const rows = await db
    .update(answer)
    .set({ response: "" })
    .where(and(eq(answer.learnerId, learnerId), sql`${answer.response} <> ''`))
    .returning({ id: answer.id });
  await db
    .update(taskSession)
    .set({ state: blankedRuns })
    .where(and(eq(taskSession.learnerId, learnerId), sql`${taskSession.status} <> 'active'`, hasAsked));
  return rows.length;
}

/** clearOldResponses empties the free text of learners of a band older than a time, in answers and in the runs that ended by then. */
export async function clearOldResponses(db: Db, band: AgeBand, before: Date): Promise<number> {
  const ofBand = db.select({ id: learner.id }).from(learner).where(eq(learner.band, band));
  const rows = await db
    .update(answer)
    .set({ response: "" })
    .where(and(inArray(answer.learnerId, ofBand), lt(answer.at, before), sql`${answer.response} <> ''`))
    .returning({ id: answer.id });
  await db
    .update(taskSession)
    .set({ state: blankedRuns })
    .where(
      and(inArray(taskSession.learnerId, ofBand), sql`${taskSession.status} <> 'active'`, lt(taskSession.updatedAt, before), hasAsked),
    );
  return rows.length;
}

/** clearOldSessionTraces empties the addresses and browsers of sign-in sessions begun before a time. */
export async function clearOldSessionTraces(db: Db, before: Date): Promise<number> {
  const rows = await db
    .update(session)
    .set({ ipAddress: null, userAgent: null })
    .where(and(lt(session.createdAt, before), or(sql`${session.ipAddress} is not null`, sql`${session.userAgent} is not null`)))
    .returning({ id: session.id });
  return rows.length;
}

/** contactsOf lists whom to tell about a minor's account: its guardians, and the account itself unless it is a child's. */
export async function contactsOf(db: Db, learnerId: string): Promise<string[]> {
  const guardians = await db
    .select({ email: user.email })
    .from(guardian)
    .innerJoin(user, eq(user.id, guardian.userId))
    .where(eq(guardian.learnerId, learnerId));
  const [own] = await db
    .select({ email: user.email, managed: learner.managed })
    .from(learner)
    .innerJoin(user, eq(user.id, learner.userId))
    .where(eq(learner.id, learnerId));
  const list = guardians.map((g) => g.email);
  return own && !own.managed ? [own.email, ...list] : list;
}

/** expiringConsents lists the consents that end before a time and have had no reminder. */
export async function expiringConsents(db: Db, at: Date, before: Date): Promise<ConsentRow[]> {
  return db
    .select()
    .from(consent)
    .where(and(isNull(consent.withdrawnAt), isNull(consent.remindedAt), gt(consent.expiresAt, at), lt(consent.expiresAt, before)));
}

/** markConsentReminded records that a reminder went out. */
export async function markConsentReminded(db: Db, id: string, at: Date): Promise<void> {
  await db.update(consent).set({ remindedAt: at }).where(eq(consent.id, id));
}

/** lastSeen is the expression for when a learner last did anything: a task, or a sign-in session. */
const lastSeen = sql`greatest(
  ${learner.createdAt},
  (select max(${taskSession.updatedAt}) from ${taskSession} where ${taskSession.learnerId} = ${learner.id}),
  (select max(${session.updatedAt}) from ${session} where ${session.userId} = ${learner.userId})
)`;

/** inactiveMinors lists minors not seen since a time who have not yet been told. */
export async function inactiveMinors(db: Db, since: Date): Promise<string[]> {
  const rows = await db
    .select({ id: learner.id })
    .from(learner)
    .where(
      and(
        inArray(learner.band, ["child", "teen"]),
        isNull(learner.inactiveNoticeAt),
        sql`${lastSeen} < ${since.toISOString()}::timestamptz`,
      ),
    );
  return rows.map((r) => r.id);
}

/** markInactiveNotice records that a minor's account was told of its coming deletion. */
export async function markInactiveNotice(db: Db, learnerId: string, at: Date): Promise<void> {
  await db.update(learner).set({ inactiveNoticeAt: at }).where(eq(learner.id, learnerId));
}

/** clearInactiveNotices forgets the notice of minors seen again since they were told. */
export async function clearInactiveNotices(db: Db): Promise<void> {
  await db
    .update(learner)
    .set({ inactiveNoticeAt: null })
    .where(and(sql`${learner.inactiveNoticeAt} is not null`, sql`${lastSeen} > ${learner.inactiveNoticeAt}`));
}

/** noticedBefore lists the users of minors told before a time and not seen since, whose accounts are due for deletion. */
export async function noticedBefore(db: Db, before: Date): Promise<string[]> {
  const rows = await db
    .select({ userId: learner.userId })
    .from(learner)
    .where(and(inArray(learner.band, ["child", "teen"]), lt(learner.inactiveNoticeAt, before)));
  return rows.map((r) => r.userId);
}

/** deleteUserData deletes an account with everything under it through the foreign keys, returning storage keys of forms that must go too. */
export async function deleteUserData(db: Db, userId: string): Promise<string[]> {
  const forms = await db
    .select({ key: guardianVerification.formKey })
    .from(guardianVerification)
    .where(and(eq(guardianVerification.userId, userId), sql`${guardianVerification.formKey} is not null`));
  await db.delete(user).where(eq(user.id, userId));
  return forms.flatMap((f) => (f.key ? [f.key] : []));
}

/** LearnerExport is everything stored about a learner's study, for the guardian's or learner's copy. */
export interface LearnerExport {
  readonly age: LearnerAge;
  readonly enrollments: unknown[];
  readonly events: unknown[];
  readonly answers: unknown[];
  readonly consents: unknown[];
}

/** exportLearner gathers a learner's data for their own copy. */
export async function exportLearner(db: Db, learnerId: string): Promise<LearnerExport> {
  const [age, enrollments, events, answers, consents] = await Promise.all([
    learnerAge(db, learnerId),
    db.select().from(enrollment).where(eq(enrollment.learnerId, learnerId)),
    db
      .select({ at: event.at, type: event.type, courseId: event.courseId, xp: event.xp, data: event.data })
      .from(event)
      .where(eq(event.learnerId, learnerId)),
    db
      .select({ at: answer.at, topicId: answer.topicId, response: answer.response, correct: answer.correct, skipped: answer.skipped })
      .from(answer)
      .where(eq(answer.learnerId, learnerId)),
    consentsOf(db, learnerId),
  ]);
  return { age, enrollments, events, answers, consents };
}

/** assentConsent records a child's agreement on the grants in force for a scope. */
export async function assentConsent(db: Db, learnerId: string, scope: ConsentScope, at: Date): Promise<number> {
  const rows = await db
    .update(consent)
    .set({ assentAt: at })
    .where(and(eq(consent.learnerId, learnerId), eq(consent.scope, scope), isNull(consent.withdrawnAt), gt(consent.expiresAt, at)))
    .returning({ id: consent.id });
  return rows.length;
}

/** soleManagedChildren lists the users of children's accounts that only this person guards, which cannot outlive them. */
export async function soleManagedChildren(db: Db, userId: string): Promise<string[]> {
  const rows = await db
    .select({ userId: learner.userId })
    .from(guardian)
    .innerJoin(learner, eq(learner.id, guardian.learnerId))
    .where(
      and(
        eq(guardian.userId, userId),
        eq(learner.managed, true),
        sql`not exists (select 1 from ${guardian} g2 where g2.learner_id = ${learner.id} and g2.user_id <> ${userId})`,
      ),
    );
  return rows.map((r) => r.userId);
}

/** isManagedUser tells whether a user is a child's account made by a guardian. */
export async function isManagedUser(db: Db, userId: string): Promise<boolean> {
  const [row] = await db.select({ managed: learner.managed }).from(learner).where(eq(learner.userId, userId));
  return row?.managed ?? false;
}

/** approveByPayment records a guardian verified by a card payment, unless they are verified already. */
export async function approveByPayment(db: Db, userId: string, at: Date): Promise<boolean> {
  if (await approvedVerification(db, userId)) return false;
  await db
    .insert(guardianVerification)
    .values({ userId, method: "card", status: "approved", submittedAt: at, decidedAt: at, decidedBy: "payment" });
  return true;
}
