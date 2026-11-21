import type { CompiledCourse, SequenceDef } from "@ga/content";

import type { Placement } from "./diagnostic.ts";
import type { EngineEvent } from "./events.ts";
import type { Params } from "./params.ts";
import type { LearnerState } from "./state.ts";
import { isKnown, type Planner } from "./tasks.ts";

/**
 * CourseIndex relates the courses of one subject: what each builds on, what
 * builds on each, and which courses teach a topic. It is computed once per
 * subject.
 */
export interface CourseIndex {
  /** order lists the course ids in catalog order, the youngest learner's first. */
  readonly order: readonly string[];
  /** earlier maps a course to every course it builds on, directly or not, nearest first. */
  readonly earlier: ReadonlyMap<string, readonly string[]>;
  /** next maps a course to the courses that build on it directly, in catalog order. */
  readonly next: ReadonlyMap<string, readonly string[]>;
  /** teaching maps a topic to the courses that list it, in catalog order. */
  readonly teaching: ReadonlyMap<string, readonly string[]>;
  readonly courses: ReadonlyMap<string, CompiledCourse>;
  /** sequences are the routes through the courses, in the order the subject lists them. */
  readonly sequences: readonly SequenceDef[];
}

/** courseIndex indexes a subject's courses, given in catalog order, and the routes through them. */
export function courseIndex(courses: ReadonlyMap<string, CompiledCourse>, sequences: readonly SequenceDef[] = []): CourseIndex {
  const order = [...courses.keys()];
  const earlier = new Map<string, string[]>();
  for (const id of order) {
    const seen = new Set<string>([id]);
    const out: string[] = [];
    const queue = [...(courses.get(id)!.def.buildsOn ?? [])];
    while (queue.length > 0) {
      const before = queue.shift()!;
      if (seen.has(before) || !courses.has(before)) continue;
      seen.add(before);
      out.push(before);
      queue.push(...(courses.get(before)!.def.buildsOn ?? []));
    }
    earlier.set(id, out);
  }
  const next = new Map<string, string[]>(order.map((id) => [id, []]));
  for (const id of order) for (const before of courses.get(id)!.def.buildsOn ?? []) next.get(before)?.push(id);
  const teaching = new Map<string, string[]>();
  for (const id of order) {
    for (const topic of courses.get(id)!.topics) {
      const list = teaching.get(topic);
      if (list) list.push(id);
      else teaching.set(topic, [id]);
    }
  }
  return { order, earlier, next, teaching, courses, sequences };
}

/**
 * courseStanding is how well a learner is doing in their current course (docs/learning-engine.md §9): the share of
 * answers right in the course's latest `standingTasks` lessons, reviews and quizzes, retakes left out, given its events
 * in order. It is undefined below `standingMinAnswers` answers, when too little is known to judge.
 */
export function courseStanding(p: Params, events: readonly EngineEvent[]): number | undefined {
  let asked = 0;
  let right = 0;
  let tasks = 0;
  for (let i = events.length - 1; i >= 0 && tasks < p.standingTasks; i--) {
    const e = events[i]!;
    if (e.type === "lesson") {
      asked += e.asked;
      right += e.correct;
    } else if (e.type === "review") {
      asked += e.total;
      right += e.correct;
    } else if (e.type === "quiz" && !e.retake) {
      asked += e.results.length;
      right += e.results.filter((r) => r.correct).length;
    } else continue;
    tasks++;
  }
  return asked >= p.standingMinAnswers ? right / asked : undefined;
}

/**
 * courseRoute picks the sequence a learner of `course` follows
 * (docs/learning-engine.md §9). Among the sequences through the course, those
 * whose `minStanding` is above the learner's `standing` are left out, unless
 * none would remain; one left out counts toward its `fallback`, as if the
 * fallback led where it does and listed the courses it does. Of the rest it takes the one that leads on to the course
 * they set out to take, `target`, if any; else the one that lists most of the
 * courses they took, `taken`; on a tie, a demanding sequence when the standing
 * reaches its bar, and one that is not while the standing is unknown; else the
 * first. A course on no sequence has none.
 */
export function courseRoute(
  index: CourseIndex,
  course: string,
  taken: readonly string[],
  target?: string,
  standing?: number,
): SequenceDef | undefined {
  const through = index.sequences.filter((s) => s.courses.includes(course));
  const fit = standing === undefined ? through : through.filter((s) => (s.minStanding ?? 0) <= standing);
  const pool = fit.length > 0 ? fit : through;
  const leads = (s: SequenceDef) => (target && s.courses.indexOf(target) > s.courses.indexOf(course) ? 1 : 0);
  const count = (s: SequenceDef) => taken.filter((id) => s.courses.includes(id)).length;
  // A sequence left out for its bar hands what it holds to its fallback.
  const left = through.filter((s) => !pool.includes(s));
  const rank = (s: SequenceDef): readonly number[] => {
    const from = [s, ...left.filter((l) => l.fallback === s.id)];
    return [Math.max(...from.map(leads)), Math.max(...from.map(count)), s.minStanding === undefined ? 0 : standing === undefined ? -1 : 1];
  };
  let best: SequenceDef | undefined;
  let bestRank: readonly number[] = [];
  for (const s of pool) {
    const r = rank(s);
    const i = r.findIndex((v, k) => v !== bestRank[k]);
    if (!best || (i >= 0 && r[i]! > bestRank[i]!)) {
      best = s;
      bestRank = r;
    }
  }
  return best;
}

/**
 * routeTarget is the course set out for that a learner still heads to on `route`: `target`, unless the route leaves
 * it out while another sequence holds it, as when the learner fell below the bar of the sequence that leads to it.
 */
export function routeTarget(index: CourseIndex, route: SequenceDef | undefined, target: string | undefined): string | undefined {
  if (!target || !route || route.courses.includes(target)) return target;
  return index.sequences.some((s) => s.courses.includes(target)) ? undefined : target;
}

/**
 * followingCourse names the course a learner moves on to from `course`: the
 * next on their route, else the first course that builds on it.
 */
export function followingCourse(index: CourseIndex, route: SequenceDef | undefined, course: string): string | undefined {
  const at = route?.courses.indexOf(course) ?? -1;
  if (route && at >= 0 && at + 1 < route.courses.length) return route.courses[at + 1];
  return index.next.get(course)?.[0];
}

/**
 * nextCourse names the course a learner who finishes `course` is promoted
 * into (docs/learning-engine.md §9): the course that follows on their route,
 * unless they moved back from `target` to fill gaps and that course does not
 * lead back to it, when it is `target` itself.
 */
export function nextCourse(index: CourseIndex, route: SequenceDef | undefined, course: string, target?: string): string | undefined {
  const following = followingCourse(index, route, course);
  const before = target && target !== course ? index.earlier.get(target) : undefined;
  if (!before?.includes(course)) return following;
  return following && (following === target || before.includes(following)) ? following : target;
}

/**
 * coursesAfter lists up to `count` courses a learner takes after `course`,
 * each the one they are promoted into from the one before, leaving out those
 * in `skip`. Each course builds on the one before it, so the walk ends.
 */
export function coursesAfter(
  index: CourseIndex,
  route: SequenceDef | undefined,
  course: string,
  count: number,
  skip: readonly string[] = [],
  target?: string,
): string[] {
  const after: string[] = [];
  let aim = target;
  for (let id = nextCourse(index, route, course, aim); id && after.length < count; id = nextCourse(index, route, id, aim)) {
    if (id === aim) aim = undefined;
    if (id !== course && !skip.includes(id) && !after.includes(id)) after.push(id);
  }
  return after;
}

/**
 * homeCourse names the course a foundation of `course` comes from: the
 * nearest course it builds on that teaches the topic, else the first course
 * in the catalog that does. A topic of the course itself has none.
 */
export function homeCourse(index: CourseIndex, course: string, topic: string): string | undefined {
  const teaching = index.teaching.get(topic) ?? [];
  if (teaching.includes(course)) return undefined;
  return index.earlier.get(course)?.find((id) => teaching.includes(id)) ?? teaching[0];
}

/**
 * PlacementAdvice is the course a diagnostic recommends: the course taken
 * ("stay"), an earlier course with gaps the answers showed, or the course
 * after it when most of it is known.
 */
export type PlacementAdvice =
  | { readonly kind: "stay" }
  | { readonly kind: "earlier"; readonly course: string }
  | { readonly kind: "later"; readonly course: string };

/**
 * placementAdvice recommends where a learner placed by a course's diagnostic
 * should start (docs/learning-engine.md §9); the course after is the one that
 * follows on their route. A diagnostic that asked nothing
 * (one skipped) recommends nothing. Gaps count only where the answers showed
 * them: a topic answered wrongly and everything that depends on it, since
 * placement counts unresolved topics as not known to err on the side of
 * teaching, which says nothing about where the learner stands.
 */
export function placementAdvice(
  pl: Planner,
  index: CourseIndex,
  state: LearnerState,
  placement: Placement,
  route?: SequenceDef,
): PlacementAdvice {
  if (placement.tested.length === 0 && placement.missed.length === 0) return { kind: "stay" };
  const g = pl.graph;
  const xp = (id: string) => g.graph.topics.get(id)?.xp ?? 0;
  const course = index.courses.get(pl.scope.course);
  if (!course) return { kind: "stay" };

  const total = course.topics.reduce((sum, id) => sum + xp(id), 0);
  const known = course.topics.reduce((sum, id) => sum + (isKnown(pl, state, id) ? xp(id) : 0), 0);
  const after = followingCourse(index, route, course.def.id);
  if (after && total > 0 && known >= pl.params.adviceAheadShare * total) return { kind: "later", course: after };

  const knownNow = new Set(placement.known);
  const shown = new Set<string>();
  for (const t of placement.missed) {
    if (knownNow.has(t)) continue;
    shown.add(t);
    for (const d of g.descendants.get(t) ?? []) shown.add(d);
  }
  const foundations = new Set(course.foundations);
  let lowest: string | undefined;
  for (const before of index.earlier.get(course.def.id) ?? []) {
    let gap = 0;
    let resolved = 0;
    let count = 0;
    for (const id of index.courses.get(before)!.topics) {
      if (!foundations.has(id)) continue;
      if (shown.has(id)) gap += xp(id);
      else if (!isKnown(pl, state, id)) continue;
      resolved += xp(id);
      count++;
    }
    // The courses are listed nearest first, so the last weak one is the lowest gap.
    if (count >= pl.params.adviceMinTopics && gap >= pl.params.adviceWeakShare * resolved) lowest = before;
  }
  return lowest ? { kind: "earlier", course: lowest } : { kind: "stay" };
}

/** courseFinished tells whether every topic of the course is learned. */
export function courseFinished(pl: Planner, state: LearnerState): boolean {
  for (const id of pl.scope.inCourse) if (!isKnown(pl, state, id)) return false;
  return true;
}
