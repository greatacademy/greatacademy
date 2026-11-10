import { and, asc, eq, gte, lt, sql, sum } from "drizzle-orm";
import type { Db } from "./db.ts";
import { user } from "./schema/auth.ts";
import { event, guardian, guardianInvite, leagueGroup, leagueMember, learner, learnerSubject } from "./schema/learning.ts";

/** LearnerSettings are the learner's username, as its owner wrote it, and whether they take part in leagues. */
export interface LearnerSettings {
  readonly username: string | null;
  readonly leagues: boolean;
}

/** learnerSettings reads a learner's settings. */
export async function learnerSettings(db: Db, learnerId: string): Promise<LearnerSettings> {
  const [row] = await db
    .select({ username: sql<string | null>`coalesce(${user.displayUsername}, ${user.username})`, leagues: learner.leagues })
    .from(learner)
    .innerJoin(user, eq(user.id, learner.userId))
    .where(eq(learner.id, learnerId));
  if (!row) throw new Error(`no learner ${learnerId}`);
  return row;
}

/** setLeagues records whether a learner takes part in leagues. */
export async function setLeagues(db: Db, learnerId: string, leagues: boolean): Promise<void> {
  await db.update(learner).set({ leagues }).where(eq(learner.id, learnerId));
}

/** setUsername changes the username of a learner's account; display is as written, and the sign-in form is lowercase. */
export async function setUsername(db: Db, learnerId: string, display: string): Promise<void> {
  const owner = db.select({ id: learner.userId }).from(learner).where(eq(learner.id, learnerId));
  await db.update(user).set({ username: display.toLowerCase(), displayUsername: display }).where(sql`${user.id} = (${owner})`);
}

/** SubjectSettings are a learner's decisions about a subject besides its course. */
export interface SubjectSettings {
  /** goals holds the XP goal of each weekday, Monday first; null until set. */
  readonly goals: readonly number[] | null;
  readonly goalsPaused: boolean;
  /** endDate is the day the current course should be finished by, "YYYY-MM-DD", or null. */
  readonly endDate: string | null;
}

const noSubjectSettings: SubjectSettings = { goals: null, goalsPaused: false, endDate: null };

/** subjectSettings reads a learner's settings of a subject. */
export async function subjectSettings(db: Db, learnerId: string, subjectId: string): Promise<SubjectSettings> {
  const [row] = await db
    .select({ goals: learnerSubject.goals, goalsPaused: learnerSubject.goalsPaused, endDate: learnerSubject.endDate })
    .from(learnerSubject)
    .where(and(eq(learnerSubject.learnerId, learnerId), eq(learnerSubject.subjectId, subjectId)));
  return row ?? noSubjectSettings;
}

/** allSubjectSettings reads a learner's settings of every subject that has some, by subject id. */
export async function allSubjectSettings(db: Db, learnerId: string): Promise<Map<string, SubjectSettings>> {
  const rows = await db
    .select({
      subjectId: learnerSubject.subjectId,
      goals: learnerSubject.goals,
      goalsPaused: learnerSubject.goalsPaused,
      endDate: learnerSubject.endDate,
    })
    .from(learnerSubject)
    .where(eq(learnerSubject.learnerId, learnerId));
  return new Map(rows.map(({ subjectId, ...s }) => [subjectId, s]));
}

/** updateSubjectSettings changes some of a learner's settings of a subject. */
export async function updateSubjectSettings(
  db: Db,
  learnerId: string,
  subjectId: string,
  changes: Partial<SubjectSettings>,
): Promise<void> {
  const { goals, ...rest } = changes;
  const set = { ...rest, ...(goals !== undefined && { goals: goals && [...goals] }) };
  await db
    .insert(learnerSubject)
    .values({ learnerId, subjectId, ...set })
    .onConflictDoUpdate({ target: [learnerSubject.learnerId, learnerSubject.subjectId], set });
}

/** usernameTaken tells whether another account has a username, ignoring case. */
export async function usernameTaken(db: Db, learnerId: string, username: string): Promise<boolean> {
  const rows = await db
    .select({ id: learner.id })
    .from(user)
    .leftJoin(learner, eq(learner.userId, user.id))
    .where(eq(user.username, username.toLowerCase()));
  return rows.some((r) => r.id !== learnerId);
}

/** xpBetween sums a learner's XP for events at or after from and before to. */
export async function xpBetween(db: Db, learnerId: string, from: Date, to: Date): Promise<number> {
  const [row] = await db
    .select({ xp: sum(event.xp) })
    .from(event)
    .where(and(eq(event.learnerId, learnerId), gte(event.at, from), lt(event.at, to)));
  return Number(row?.xp ?? 0);
}

/** Membership is a learner's place in a week's league. */
export interface Membership {
  readonly groupId: string;
  readonly week: Date;
  readonly tier: number;
}

/** latestMembership is the learner's latest membership, in the week given or before it. */
export async function latestMembership(db: Db, learnerId: string, upTo: Date): Promise<Membership | undefined> {
  const [row] = await db
    .select({ groupId: leagueMember.groupId, week: leagueMember.week, tier: leagueGroup.tier })
    .from(leagueMember)
    .innerJoin(leagueGroup, eq(leagueGroup.id, leagueMember.groupId))
    .where(and(eq(leagueMember.learnerId, learnerId), sql`${leagueMember.week} <= ${upTo.toISOString()}`))
    .orderBy(sql`${leagueMember.week} desc`)
    .limit(1);
  return row;
}

/** GroupMember is a member of a group with their XP over the group's week. */
export interface GroupMember {
  readonly id: string;
  readonly username: string | null;
  readonly joinedAt: number;
  readonly xp: number;
}

/** groupMembers lists a group's members with the XP of events in [from, to). */
export async function groupMembers(db: Db, groupId: string, from: Date, to: Date): Promise<GroupMember[]> {
  const rows = await db
    .select({
      id: leagueMember.learnerId,
      username: sql<string | null>`coalesce(${user.displayUsername}, ${user.username})`,
      joinedAt: leagueMember.joinedAt,
      xp: sql<string>`coalesce((select sum(${event.xp}) from ${event} where ${event.learnerId} = ${leagueMember.learnerId} and ${event.at} >= ${from.toISOString()} and ${event.at} < ${to.toISOString()}), 0)`,
    })
    .from(leagueMember)
    .innerJoin(learner, eq(learner.id, leagueMember.learnerId))
    .innerJoin(user, eq(user.id, learner.userId))
    .where(eq(leagueMember.groupId, groupId));
  return rows.map((r) => ({ id: r.id, username: r.username, joinedAt: r.joinedAt.getTime(), xp: Number(r.xp) }));
}

/** openGroup finds a group of a week and tier with room, preferring the band given. */
export async function openGroup(db: Db, week: Date, tier: number, band: number, size: number): Promise<string | undefined> {
  const rows = await db
    .select({ id: leagueGroup.id, band: leagueGroup.band })
    .from(leagueGroup)
    .leftJoin(leagueMember, eq(leagueMember.groupId, leagueGroup.id))
    .where(and(eq(leagueGroup.week, week), eq(leagueGroup.tier, tier)))
    .groupBy(leagueGroup.id)
    .having(sql`count(${leagueMember.learnerId}) < ${size}`)
    .orderBy(asc(leagueGroup.id));
  return (rows.find((r) => r.band === band) ?? rows[0])?.id;
}

/** joinGroup puts a learner in a group for a week, in a new group when groupId is undefined; a learner already in a group stays there. */
export async function joinGroup(db: Db, learnerId: string, week: Date, tier: number, band: number, groupId: string | undefined, at: Date) {
  const id = groupId ?? (await db.insert(leagueGroup).values({ week, tier, band }).returning({ id: leagueGroup.id }))[0]!.id;
  await db.insert(leagueMember).values({ learnerId, week, groupId: id, joinedAt: at }).onConflictDoNothing();
}

/** leaveWeek takes a learner out of a week's group. */
export async function leaveWeek(db: Db, learnerId: string, week: Date): Promise<void> {
  await db.delete(leagueMember).where(and(eq(leagueMember.learnerId, learnerId), eq(leagueMember.week, week)));
}

/** createGuardianInvite stores an invitation code of a learner. */
export async function createGuardianInvite(db: Db, code: string, learnerId: string, expiresAt: Date): Promise<void> {
  await db.insert(guardianInvite).values({ code, learnerId, expiresAt });
}

/** takeGuardianInvite consumes a code, returning its learner when it was still valid at the time given. */
export async function takeGuardianInvite(db: Db, code: string, at: Date): Promise<string | undefined> {
  const [row] = await db.delete(guardianInvite).where(eq(guardianInvite.code, code)).returning();
  return row && row.expiresAt > at ? row.learnerId : undefined;
}

/** addGuardian makes a user a guardian of a learner. */
export async function addGuardian(db: Db, userId: string, learnerId: string): Promise<void> {
  await db.insert(guardian).values({ userId, learnerId }).onConflictDoNothing();
}

/** removeGuardian ends a guardianship. */
export async function removeGuardian(db: Db, userId: string, learnerId: string): Promise<void> {
  await db.delete(guardian).where(and(eq(guardian.userId, userId), eq(guardian.learnerId, learnerId)));
}

/** isGuardian tells whether a user is a guardian of a learner. */
export async function isGuardian(db: Db, userId: string, learnerId: string): Promise<boolean> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(learnerId)) return false;
  const rows = await db
    .select({ id: guardian.userId })
    .from(guardian)
    .where(and(eq(guardian.userId, userId), eq(guardian.learnerId, learnerId)));
  return rows.length > 0;
}

/** guardiansOf lists a learner's guardians. */
export async function guardiansOf(db: Db, learnerId: string): Promise<{ userId: string; name: string; email: string }[]> {
  return db
    .select({ userId: user.id, name: user.name, email: user.email })
    .from(guardian)
    .innerJoin(user, eq(user.id, guardian.userId))
    .where(eq(guardian.learnerId, learnerId));
}

/** guardedLearners lists the learners a user is a guardian of. */
export async function guardedLearners(db: Db, userId: string): Promise<{ learnerId: string; name: string }[]> {
  return db
    .select({ learnerId: learner.id, name: user.name })
    .from(guardian)
    .innerJoin(learner, eq(learner.id, guardian.learnerId))
    .innerJoin(user, eq(user.id, learner.userId))
    .where(eq(guardian.userId, userId));
}

/** RecentEvents counts a learner's lessons, failed lessons and blown-off tasks since a time. */
export interface RecentEvents {
  readonly lessons: number;
  readonly failedLessons: number;
  readonly blownOff: number;
}

/** recentEvents counts the signs a guardian watches for since a time. */
export async function recentEvents(db: Db, learnerId: string, since: Date): Promise<RecentEvents> {
  const rows = await db
    .select({ data: event.data })
    .from(event)
    .where(and(eq(event.learnerId, learnerId), gte(event.at, since)));
  const tasks = rows.map((r) => r.data);
  const lessons = tasks.flatMap((e) => (e.type === "lesson" ? [e] : []));
  return {
    lessons: lessons.length,
    failedLessons: lessons.filter((e) => !e.passed).length,
    blownOff: tasks.filter((e) => "blownOff" in e && e.blownOff).length,
  };
}

/** EmailLocale is a language email is written in. */
export type EmailLocale = "en" | "zh-CN";

/** setUserLocale records the language a person last used; it writes only when the language changed. */
export async function setUserLocale(db: Db, userId: string, locale: EmailLocale): Promise<void> {
  await db
    .update(user)
    .set({ locale })
    .where(and(eq(user.id, userId), sql`${user.locale} is distinct from ${locale}`));
}

/** localeOfEmail is the language of the account with an address, or undefined when none is recorded. */
export async function localeOfEmail(db: Db, email: string): Promise<EmailLocale | undefined> {
  const [row] = await db.select({ locale: user.locale }).from(user).where(eq(user.email, email));
  return row?.locale === "en" || row?.locale === "zh-CN" ? row.locale : undefined;
}
