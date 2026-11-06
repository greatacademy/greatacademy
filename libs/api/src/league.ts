import { type Db, groupMembers, joinGroup, latestMembership, learnerSettings, type Membership, openGroup, xpBetween } from "@ga/db";
import { type LeagueOutcome, leagueGroupSize, leagueOutcome, nextTier, paceBand, rankMembers, WEEK, weekStart } from "@ga/engine";

/** Settled is how the learner's last finished week in a league ended. */
export interface Settled {
  readonly rank: number;
  readonly tier: number;
  readonly outcome: LeagueOutcome;
  readonly missedWeeks: number;
}

/** settle works out a finished week from its group and the event log, which do not change. */
async function settle(db: Db, learnerId: string, m: Membership, week: number): Promise<Settled> {
  const from = m.week;
  const members = rankMembers(await groupMembers(db, m.groupId, from, new Date(from.getTime() + WEEK)));
  const index = members.findIndex((r) => r.id === learnerId);
  const xp = members[index]?.xp ?? 0;
  return {
    rank: index + 1,
    tier: m.tier,
    outcome: leagueOutcome(m.tier, index + 1, members.length, xp),
    missedWeeks: Math.round((week - from.getTime()) / WEEK) - 1,
  };
}

/** LeaguePlace is where a learner stands in the league week holding a time. */
export interface LeaguePlace {
  readonly week: number;
  readonly tier: number;
  /** current is the learner's group this week, once they joined one. */
  readonly current?: Membership;
  readonly last?: Settled;
}

/** leaguePlace finds a learner's tier this week: from this week's group, or else from how the last week ended. */
export async function leaguePlace(db: Db, learnerId: string, now: number): Promise<LeaguePlace> {
  const week = weekStart(now);
  const latest = await latestMembership(db, learnerId, new Date(week));
  if (!latest) return { week, tier: 0 };
  const inWeek = latest.week.getTime() === week;
  const previous = inWeek ? await latestMembership(db, learnerId, new Date(week - WEEK)) : latest;
  const last = previous && (await settle(db, learnerId, previous, week));
  const tier = inWeek ? latest.tier : nextTier(last!.tier, last!.outcome, last!.missedWeeks);
  return { week, tier, ...(inWeek && { current: latest }), ...(last && { last }) };
}

/** joinLeague puts a learner who takes part in leagues and earned XP this week into a group. */
export async function joinLeague(db: Db, learnerId: string, now: number): Promise<void> {
  const { leagues, username } = await learnerSettings(db, learnerId);
  if (!leagues || !username) return;
  const place = await leaguePlace(db, learnerId, now);
  if (place.current) return;
  const week = new Date(place.week);
  if ((await xpBetween(db, learnerId, week, new Date(now + 1))) <= 0) return;
  const recent = await xpBetween(db, learnerId, new Date(place.week - 4 * WEEK), week);
  const band = paceBand(recent / 4);
  const group = await openGroup(db, week, place.tier, band, leagueGroupSize);
  await joinGroup(db, learnerId, week, place.tier, band, group, new Date(now));
}
