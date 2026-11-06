import { describe, expect, it } from "vitest";

import { leagueOutcome, leagueTierCount, leagueZones, nextTier, paceBand, rankMembers, WEEK, weekStart } from "./league.ts";

describe("the league week", () => {
  it("starts on Monday at midnight UTC", () => {
    const monday = Date.UTC(2026, 10, 2);
    expect(weekStart(monday)).toBe(monday);
    expect(weekStart(Date.UTC(2026, 10, 5, 13))).toBe(monday);
    expect(weekStart(monday + WEEK - 1)).toBe(monday);
    expect(weekStart(monday + WEEK)).toBe(monday + WEEK);
  });
});

describe("a league group", () => {
  it("ranks by XP, then by who joined first", () => {
    const ranked = rankMembers([
      { id: "a", xp: 5, joinedAt: 2 },
      { id: "b", xp: 9, joinedAt: 3 },
      { id: "c", xp: 5, joinedAt: 1 },
    ]);
    expect(ranked.map((m) => m.id)).toEqual(["b", "c", "a"]);
  });

  it("moves a third up and a third down, none past the ends", () => {
    expect(leagueZones(3, 30)).toEqual({ promote: 10, demote: 10 });
    expect(leagueZones(0, 30).demote).toBe(0);
    expect(leagueZones(leagueTierCount - 1, 30).promote).toBe(0);
    expect(leagueZones(3, 2)).toEqual({ promote: 1, demote: 0 });
  });

  it("decides the outcome by rank and XP", () => {
    expect(leagueOutcome(3, 10, 30, 50)).toBe("promoted");
    expect(leagueOutcome(3, 11, 30, 50)).toBe("stayed");
    expect(leagueOutcome(3, 20, 30, 50)).toBe("stayed");
    expect(leagueOutcome(3, 21, 30, 50)).toBe("demoted");
    expect(leagueOutcome(3, 1, 30, 0)).toBe("demoted");
    expect(leagueOutcome(0, 1, 30, 0)).toBe("stayed");
  });

  it("sets the next tier, one lower for each week missed", () => {
    expect(nextTier(3, "promoted", 0)).toBe(4);
    expect(nextTier(3, "demoted", 0)).toBe(2);
    expect(nextTier(3, "stayed", 2)).toBe(1);
    expect(nextTier(1, "stayed", 5)).toBe(0);
    expect(nextTier(leagueTierCount - 1, "promoted", 0)).toBe(leagueTierCount - 1);
  });

  it("bands learners by speed", () => {
    expect([0, 99, 100, 249, 250, 499, 500].map(paceBand)).toEqual([0, 0, 1, 1, 2, 2, 3]);
  });
});
