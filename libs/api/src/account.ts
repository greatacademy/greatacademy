import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError, type HandlerContext, type ServiceImpl } from "@connectrpc/connect";
import {
  addGuardian,
  createGuardianInvite,
  type Db,
  enrollments,
  groupMembers,
  guardedLearners,
  guardiansOf,
  isGuardian,
  learnerFor,
  learnerSettings,
  leaveWeek,
  loadState,
  recentEvents,
  removeGuardian,
  takeGuardianInvite,
  updateLearnerSettings,
  usernameTaken,
} from "@ga/db";
import { courseProgress, DAY, initialState, leagueZones, type LeagueOutcome as Outcome, rankMembers, WEEK, weekStart } from "@ga/engine";
import { type AccountService, type GoalsSchema, type GuardedLearnerSchema, LeagueOutcome } from "@ga/proto/account/v1/account_pb";

import { dbKey, userIdKey } from "./context.ts";
import { joinLeague, leaguePlace } from "./league.ts";
import type { Registry } from "./registry.ts";
import { xpSummary } from "./summary.ts";

/** inviteDays is how long a guardian invitation stays valid. */
const inviteDays = 7;

/** maxDailyGoal bounds a weekday's goal, far above what anyone studies in a day. */
const maxDailyGoal = 1000;

/** AccountDeps are the account service's dependencies besides the request context. */
export interface AccountDeps {
  readonly registry: Registry;
  /** now is the clock, in milliseconds since the epoch. */
  now(): number;
}

/** normalUsername checks a username: 3 to 20 letters, digits, underscores or hyphens, of any script. */
export function normalUsername(username: string): string {
  const name = username.trim().normalize("NFC");
  if (!/^[\p{L}\p{N}_-]{3,20}$/u.test(name)) throw new ConnectError("that username is not valid", Code.InvalidArgument);
  return name;
}

function auth(ctx: HandlerContext): { db: Db; userId: string } {
  const db = ctx.values.get(dbKey);
  if (!db) throw new ConnectError("no database", Code.Internal);
  const userId = ctx.values.get(userIdKey);
  if (!userId) throw new ConnectError("sign in first", Code.Unauthenticated);
  return { db, userId };
}

function checkGoals(goals: { weekdays: readonly number[]; paused: boolean } | undefined): { goals: number[] | null; goalsPaused: boolean } {
  const days = goals?.weekdays ?? [];
  if (days.length !== 0 && days.length !== 7) throw new ConnectError("goals need seven weekdays", Code.InvalidArgument);
  if (days.some((d) => !Number.isInteger(d) || d < 0 || d > maxDailyGoal))
    throw new ConnectError("goal out of range", Code.InvalidArgument);
  return { goals: days.length === 0 ? null : [...days], goalsPaused: goals?.paused ?? false };
}

function goalsMessage(s: { goals: readonly number[] | null; goalsPaused: boolean }): MessageInitShape<typeof GoalsSchema> {
  return { weekdays: [...(s.goals ?? [])], paused: s.goalsPaused };
}

const outcomes: Record<Outcome, LeagueOutcome> = {
  promoted: LeagueOutcome.PROMOTED,
  stayed: LeagueOutcome.STAYED,
  demoted: LeagueOutcome.DEMOTED,
};

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
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(learnerId);
    if (!uuid || !(await isGuardian(db, userId, learnerId))) throw new ConnectError("no such learner", Code.NotFound);
    return db;
  };

  const summary = async (
    db: Db,
    learnerId: string,
    name: string,
    timeZone: string,
  ): Promise<MessageInitShape<typeof GuardedLearnerSchema>> => ({
    learnerId,
    name,
    xp: await xpSummary(db, learnerId, deps.now(), timeZone),
  });

  return {
    async getSettings(_req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const s = await learnerSettings(db, learnerId);
      return { username: s.username ?? "", leagues: s.leagues, goals: goalsMessage(s), guardians: await guardiansOf(db, learnerId) };
    },

    async setUsername(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const username = normalUsername(req.username);
      if (await usernameTaken(db, learnerId, username)) throw new ConnectError("that username is taken", Code.AlreadyExists);
      await updateLearnerSettings(db, learnerId, { username });
      return {};
    },

    async setLeagues(req, ctx) {
      const { db, userId } = auth(ctx);
      const learnerId = await learnerFor(db, userId);
      const now = deps.now();
      const { username } = await learnerSettings(db, learnerId);
      if (req.enabled && !username) throw new ConnectError("choose a username first", Code.FailedPrecondition);
      await updateLearnerSettings(db, learnerId, { leagues: req.enabled });
      if (req.enabled) await joinLeague(db, learnerId, now);
      else await leaveWeek(db, learnerId, new Date(weekStart(now)));
      return {};
    },

    async setGoals(req, ctx) {
      const { db, userId } = auth(ctx);
      await updateLearnerSettings(db, await learnerFor(db, userId), checkGoals(req.goals));
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
      if (learnerId === (await learnerFor(db, userId))) throw new ConnectError("you cannot be your own guardian", Code.InvalidArgument);
      await addGuardian(db, userId, learnerId);
      return { learnerId };
    },

    async removeGuardian(req, ctx) {
      const { db, userId } = auth(ctx);
      await removeGuardian(db, req.userId, await learnerFor(db, userId));
      return {};
    },

    async listGuardedLearners(req, ctx) {
      const { db, userId } = auth(ctx);
      const rows = await guardedLearners(db, userId);
      return { learners: await Promise.all(rows.map((r) => summary(db, r.learnerId, r.name, req.timeZone))) };
    },

    async getGuardedLearner(req, ctx) {
      const db = await guarded(ctx, req.learnerId);
      const { userId } = auth(ctx);
      const now = deps.now();
      const row = (await guardedLearners(db, userId)).find((r) => r.learnerId === req.learnerId)!;
      const list = [];
      for (const e of await enrollments(db, req.learnerId)) {
        const c = await registry.course(e.courseId);
        if (!c) continue;
        const { state } = await loadState(db, req.learnerId, c.subject.def.id, initialState);
        const p = courseProgress(c.planner, state, now);
        list.push({ courseId: c.id, stats: { learned: p.learned, total: p.total, due: p.due } });
      }
      return {
        learner: await summary(db, req.learnerId, row.name, req.timeZone),
        goals: goalsMessage(await learnerSettings(db, req.learnerId)),
        enrollments: list,
        recent: await recentEvents(db, req.learnerId, new Date(now - 14 * DAY)),
      };
    },

    async setGuardedGoals(req, ctx) {
      const db = await guarded(ctx, req.learnerId);
      await updateLearnerSettings(db, req.learnerId, checkGoals(req.goals));
      return {};
    },

    async removeGuardedLearner(req, ctx) {
      const db = await guarded(ctx, req.learnerId);
      await removeGuardian(db, auth(ctx).userId, req.learnerId);
      return {};
    },
  };
}
