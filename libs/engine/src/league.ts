import { DAY } from "./params.ts";

/** WEEK is one week in milliseconds. */
export const WEEK = 7 * DAY;

/** leagueTierCount is the number of league tiers, 0 being the lowest. */
export const leagueTierCount = 9;

/** leagueGroupSize is the most members a league group holds. */
export const leagueGroupSize = 30;

/** weekStart is the start of the league week holding a time: Monday 00:00 UTC, so one week for everyone. */
export function weekStart(at: number): number {
  const day = Math.floor(at / DAY);
  // Day 0 of the epoch was a Thursday, which is 3 days into its week.
  return (day - ((day + 3) % 7)) * DAY;
}

/** LeagueMember is a member's standing in a group for a week. */
export interface LeagueMember {
  readonly id: string;
  readonly xp: number;
  /** joinedAt breaks ties: who got there first ranks higher. */
  readonly joinedAt: number;
}

/** rankMembers orders a group from first to last. */
export function rankMembers<M extends LeagueMember>(members: readonly M[]): M[] {
  return [...members].sort((a, b) => b.xp - a.xp || a.joinedAt - b.joinedAt || (a.id < b.id ? -1 : 1));
}

/** LeagueZones is how many of a group, at the top and at the bottom, change tier when the week ends. */
export interface LeagueZones {
  readonly promote: number;
  readonly demote: number;
}

/** leagueZones gives the zones of a group: a third up and a third down, none past the top or bottom tier. */
export function leagueZones(tier: number, size: number): LeagueZones {
  return {
    promote: tier >= leagueTierCount - 1 ? 0 : Math.ceil(size / 3),
    demote: tier <= 0 ? 0 : Math.floor(size / 3),
  };
}

/** LeagueOutcome is what a finished week did to a member. */
export type LeagueOutcome = "promoted" | "stayed" | "demoted";

/** leagueOutcome is the outcome for the member at a 1-based rank; a member who ended the week with no XP cannot go up and, above the bottom tier, goes down. */
export function leagueOutcome(tier: number, rank: number, size: number, xp: number): LeagueOutcome {
  const zones = leagueZones(tier, size);
  if (xp <= 0) return tier > 0 ? "demoted" : "stayed";
  if (rank <= zones.promote) return "promoted";
  return rank > size - zones.demote ? "demoted" : "stayed";
}

/** nextTier is the tier a member enters after a week with an outcome, losing one more for each whole week then missed. */
export function nextTier(tier: number, outcome: LeagueOutcome, missedWeeks: number): number {
  const moved = outcome === "promoted" ? tier + 1 : outcome === "demoted" ? tier - 1 : tier;
  return Math.max(0, Math.min(leagueTierCount - 1, moved) - missedWeeks);
}

/** paceBand groups learners of similar speed by the XP they earned over recent weeks, so a group's members can keep up with one another. */
export function paceBand(xpPerWeek: number): number {
  if (xpPerWeek < 100) return 0;
  if (xpPerWeek < 250) return 1;
  return xpPerWeek < 500 ? 2 : 3;
}
