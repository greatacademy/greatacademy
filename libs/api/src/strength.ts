import { courseProgress, dueTopics, type LearnerState, type Planner } from "@ga/engine";

/** STRENGTHS is how many shades the progress map gives learned topics. */
export const STRENGTHS = 6;

/** strengthOf is a learned topic's shade on the map: its whole spaced repetitions, capped at the darkest shade. */
export const strengthOf = (repNum: number) => Math.min(STRENGTHS - 1, Math.max(0, Math.floor(repNum)));

/**
 * courseStats counts a course's own topics: learned, in all, due, and the learned ones by strength, which the course's
 * bar shades as the map does. Like the map's legend, it leaves out the foundations, whose reviews still come as tasks.
 */
export function courseStats(pl: Planner, state: LearnerState, now: number) {
  const p = courseProgress(pl, state, now);
  const strengths = Array.from({ length: STRENGTHS }, () => 0);
  for (const id of pl.scope.inCourse) {
    const t = state.topics[id];
    if (t?.learned) strengths[strengthOf(t.repNum)] = (strengths[strengthOf(t.repNum)] ?? 0) + 1;
  }
  const due = dueTopics(pl, state, now).filter((id) => pl.scope.inCourse.has(id)).length;
  return { learned: p.learned, total: p.total, due, strengths };
}
