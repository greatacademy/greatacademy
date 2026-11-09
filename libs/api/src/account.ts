import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import {
  addGuardian,
  createGuardianInvite,
  currentCourses,
  type Db,
  groupMembers,
  guardedLearners,
  guardiansOf,
  isGuardian,
  lastSession,
  learnerAge,
  learnerFor,
  learnerSettings,
  leaveWeek,
  loadState,
  recentEvents,
  removeGuardian,
  setLeagues,
  setUsername,
  takeGuardianInvite,
  usernameTaken,
} from "@ga/db";
import { courseProgress, DAY, initialState, leagueZones, type LeagueOutcome as Outcome, rankMembers, WEEK, weekStart } from "@ga/engine";
import { type AccountService, type GuardedLearnerSchema, LeagueOutcome } from "@ga/proto/account/v1/account_pb";

import { dbKey, userIdKey } from "./context.ts";
import { joinLeague, leaguePlace } from "./league.ts";
import type { Registry } from "./registry.ts";
import { xpSummary } from "./summary.ts";

/** inviteDays is how long a guardian invitation stays valid. */
const inviteDays = 7;

/** AccountDeps are the account service's dependencies besides the request context. */
export interface AccountDeps {
  readonly registry: Registry;
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
}

/** usernamePattern is what a username may be: 3 to 20 letters, digits, underscores or hyphens, of any script. */
export const usernamePattern = /^[\p{L}\p{N}_-]{3,20}$/u;

/** normalUsername checks a username and returns it as stored for display, trimmed and in Unicode NFC. */
export function normalUsername(username: string): string {
  const name = username.trim().normalize("NFC");
  if (!usernamePattern.test(name)) throw new ConnectError("that username is not valid", Code.InvalidArgument);
  return name;
}

function auth(ctx: HandlerContext): { db: Db; userId: string } {
  const db = ctx.values.get(dbKey);
  if (!db) throw new ConnectError("no database", Code.Internal);
  const userId = ctx.values.get(userIdKey);
  if (!userId) throw new ConnectError("sign in first", Code.Unauthenticated);
  return { db, userId };
}

/** refuseChild stops what a child's account may not do: dropping a guardian. */
async function refuseChild(db: Db, learnerId: string): Promise<void> {
  if ((await learnerAge(db, learnerId)).band === "child")
    throw new ConnectError("not available on a child's account", Code.PermissionDenied);
}

const outcomes: Record<Outcome, LeagueOutcome> = {
  promoted: LeagueOutcome.PROMOTED,
  stayed: LeagueOutcome.STAYED,
  demoted: LeagueOutcome.DEMOTED,
};

/** studyingWindow is how long after its last answer an open task still counts as being worked on. */
const studyingWindow = 10 * 60_000;

/** inviteCode draws a code that cannot be guessed, without letters and digits that look alike. */
function inviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8)}`;
}

/** accountService implements AccountService. */
export function accountService(deps: AccountDeps): ServiceImpl<typeof AccountService> {
  const { registry } = deps;

  /** guarded checks that the caller is a guardian of a learner. */
  const guarded = async (ctx: HandlerContext, learnerId: string) => {
    const { db, userId } = auth(ctx);
    if (!(await isGuardian(db, userId, learnerId))) throw new ConnectError("no such learner", Code.NotFound);
    return db;
  };

  /** courses lists a learner's courses that still exist, most recently worked on first, with their standing. */
  const courses = async (db: Db, learnerId: string) => {
    const now = deps.now();
    const list = [];
    for (const e of await currentCourses(db, learnerId)) {
      const c = await registry.course(e.courseId);
      if (!c) continue;
      const { state } = await loadState(db, learnerId, c.subject.def.id, initialState);
      const p = courseProgress(c.planner, state, now);
      list.push({ courseId: c.id, subjectId: e.subjectId, stats: { learned: p.learned, total: p.total, due: p.due } });
    }
    return list;
  };

  /** withXp adds to each course the learner's XP in its subject, against the subject's goals. */
  const withXp = (db: Db, learnerId: string, timeZone: string, list: Awaited<ReturnType<typeof courses>>) =>
    Promise.all(list.map(async (e) => ({ ...e, xp: await xpSummary(db, learnerId, deps.now(), timeZone, e.subjectId) })));

  const summary = async (
    db: Db,
    learnerId: string,
    name: string,
    timeZone: string,
    list: Awaited<ReturnType<typeof courses>>,
  ): Promise<MessageInitShape<typeof GuardedLearnerSchema>> => {
    const now = deps.now();
    const last = await lastSession(db, learnerId);
    return {
      learnerId,
      name,
      xp: await xpSummary(db, learnerId, now, timeZone),
      enrollments: await withXp(db, learnerId, timeZone, list),
      lastActiveAt: BigInt(last?.updatedAt.getTime() ?? 0),
      studying: last?.status === "active" && now - last.updatedAt.getTime() < studyingWindow,
      recent: await recentEvents(db, learnerId, new Date(now - 14 * DAY)),
    };
  };

  return {
    async getSettings(_req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const s = await learnerSettings(db, learnerId);
      return { username: s.username ?? "", leagues: s.leagues, guardians: await guardiansOf(db, learnerId) };
    },

    async setUsername(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const username = normalUsername(req.username);
      if (await usernameTaken(db, learnerId, username)) throw new ConnectError("that username is taken", Code.AlreadyExists);
      await setUsername(db, learnerId, username);
      return {};
    },

    async setLeagues(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      const { username } = await learnerSettings(db, learnerId);
      if (req.enabled && !username) throw new ConnectError("choose a username first", Code.FailedPrecondition);
      await setLeagues(db, learnerId, req.enabled);
      if (req.enabled) await joinLeague(db, learnerId, now);
      else await leaveWeek(db, learnerId, new Date(weekStart(now)));
      return {};
    },

    async getLeague(_req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      const { leagues } = await learnerSettings(db, learnerId);
      if (leagues) await joinLeague(db, learnerId, now);
      const place = await leaguePlace(db, learnerId, now);
      const week = new Date(place.week);
      const members = place.current ? rankMembers(await groupMembers(db, place.current.groupId, week, new Date(place.week + WEEK))) : [];
      const zones = leagueZones(place.tier, members.length);
      return {
        enabled: leagues,
        tier: place.tier,
        endsAt: BigInt(place.week + WEEK),
        rows: members.map((m, i) => ({ rank: i + 1, username: m.username ?? "", xp: Math.max(0, m.xp), me: m.id === learnerId })),
        promote: zones.promote,
        demote: zones.demote,
        ...(place.last && { last: { ...place.last, outcome: outcomes[place.last.outcome] } }),
      };
    },

    async createGuardianInvite(_req, ctx) {
      const { db, userId } = auth(ctx);
      const code = inviteCode();
      const expiresAt = deps.now() + inviteDays * DAY;
      await createGuardianInvite(db, code, await learnerFor(db, userId), new Date(expiresAt));
      return { code, expiresAt: BigInt(expiresAt) };
    },

    async acceptGuardianInvite(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await takeGuardianInvite(db, req.code.trim().toUpperCase(), new Date(deps.now()));
      if (!learnerId) throw new ConnectError("that code is not valid", Code.NotFound);
      const own = await learnerFor(db, userId);
      if (learnerId === own) throw new ConnectError("you cannot be your own guardian", Code.InvalidArgument);
      if ((await learnerAge(db, own)).band !== "adult") throw new ConnectError("only an adult can be a guardian", Code.PermissionDenied);
      await addGuardian(db, userId, learnerId);
      return { learnerId };
    },

    async removeGuardian(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      await refuseChild(db, learnerId);
      await removeGuardian(db, req.userId, learnerId);
      return {};
    },

    async listGuardedLearners(req, ctx) {
      const { db, userId } = auth(ctx);
      const rows = await guardedLearners(db, userId);
      return {
        learners: await Promise.all(rows.map(async (r) => summary(db, r.learnerId, r.name, req.timeZone, await courses(db, r.learnerId)))),
      };
    },

    async getGuardedLearner(req, ctx) {
      const db = await guarded(ctx, req.learnerId);
      const { userId } = auth(ctx);
      const row = (await guardedLearners(db, userId)).find((r) => r.learnerId === req.learnerId)!;
      const list = await courses(db, req.learnerId);
      return {
        learner: await summary(db, req.learnerId, row.name, req.timeZone, list),
      };
    },

    async removeGuardedLearner(req, ctx) {
      const db = await guarded(ctx, req.learnerId);
      if ((await learnerAge(db, req.learnerId)).managed)
        throw new ConnectError("delete a child's account instead", Code.FailedPrecondition);
      await removeGuardian(db, auth(ctx).userId, req.learnerId);
      return {};
    },
  };
}
