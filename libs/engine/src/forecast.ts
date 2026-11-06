import type { LearnerState } from "./state.ts";
import { isKnown, type Planner } from "./tasks.ts";

/** remainingXp estimates the XP a course still takes: the lessons not yet learned, with the reviews and quizzes they bring. */
export function remainingXp(pl: Planner, state: LearnerState): number {
  let lessons = 0;
  for (const id of pl.scope.topics) {
    if (!isKnown(pl, state, id)) lessons += pl.graph.graph.topics.get(id)?.xp ?? 0;
  }
  return Math.round(lessons * (1 + pl.params.forecastOverhead));
}

/** daysAtPace is how many days an amount of XP takes at some XP per day; undefined when the pace is not positive. */
export function daysAtPace(xp: number, xpPerDay: number): number | undefined {
  return xpPerDay > 0 ? Math.ceil(xp / xpPerDay) : undefined;
}
