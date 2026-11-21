import { frontier, isDue, type LearnerState, type Params, type Planner } from "@ga/engine";
import { TopicStatus } from "@ga/proto/learning/v1/learning_pb";

/** STRENGTHS is how many shades the progress map gives learned topics. */
export const STRENGTHS = 6;

/** strengthOf is a learned topic's shade on the map: its whole spaced repetitions, capped at the darkest shade. */
export const strengthOf = (repNum: number) => Math.min(STRENGTHS - 1, Math.max(0, Math.floor(repNum)));

/** topicStatus is a learner's standing on a topic; open is the learner's frontier. */
export function topicStatus(pl: Planner, p: Params, s: LearnerState, open: ReadonlySet<string>, id: string, now: number): TopicStatus {
  const t = s.topics[id];
  if (pl.scope.assumed.has(id)) return TopicStatus.ASSUMED;
  if (t?.learned) return isDue(p, t, now) ? TopicStatus.DUE : TopicStatus.LEARNED;
  if (open.has(id)) return TopicStatus.AVAILABLE;
  return t?.failedAt !== undefined ? TopicStatus.FAILED : TopicStatus.LOCKED;
}

/**
 * courseStats counts a course's own topics by the statuses the progress map gives them, and the learned ones by
 * strength, which the course's bar shades as the map does. Like the map's legend, it leaves out the foundations, whose
 * reviews still come as tasks. Learned counts the topics up to date and those due.
 */
export function courseStats(pl: Planner, p: Params, s: LearnerState, now: number) {
  const open = new Set(frontier(pl, s));
  const strengths = Array.from({ length: STRENGTHS }, () => 0);
  const by = new Map<TopicStatus, number>();
  for (const id of pl.scope.inCourse) {
    const status = topicStatus(pl, p, s, open, id, now);
    by.set(status, (by.get(status) ?? 0) + 1);
    const t = s.topics[id];
    if (t && (status === TopicStatus.LEARNED || status === TopicStatus.DUE))
      strengths[strengthOf(t.repNum)] = (strengths[strengthOf(t.repNum)] ?? 0) + 1;
  }
  const n = (k: TopicStatus) => by.get(k) ?? 0;
  return {
    learned: n(TopicStatus.LEARNED) + n(TopicStatus.DUE),
    total: pl.scope.inCourse.size,
    due: n(TopicStatus.DUE),
    strengths,
    available: n(TopicStatus.AVAILABLE),
    failed: n(TopicStatus.FAILED),
    assumed: n(TopicStatus.ASSUMED),
    locked: n(TopicStatus.LOCKED),
  };
}
