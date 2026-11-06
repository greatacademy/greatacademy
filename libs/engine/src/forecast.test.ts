import { describe, expect, it } from "vitest";

import { ctx, graph, planner } from "./fixture.test-util.ts";
import { daysAtPace, remainingXp } from "./forecast.ts";
import { initialState, newTopicState } from "./state.ts";

describe("the forecast", () => {
  it("counts the lessons not yet learned with the reviews they bring", () => {
    const total = planner.scope.topics.reduce((sum, id) => sum + graph.graph.topics.get(id)!.xp, 0);
    const overhead = 1 + ctx.params.forecastOverhead;
    expect(remainingXp(planner, initialState)).toBe(Math.round(total * overhead));
    const first = planner.scope.topics[0]!;
    const learned = { ...initialState, topics: { [first]: newTopicState(0, 0, 1, false) } };
    expect(remainingXp(planner, learned)).toBe(Math.round((total - graph.graph.topics.get(first)!.xp) * overhead));
  });

  it("divides by the pace, rounding up, and has no answer without one", () => {
    expect(daysAtPace(100, 30)).toBe(4);
    expect(daysAtPace(100, 0)).toBeUndefined();
  });
});
