import type { CompiledCourse } from "@ga/content";

import type { Placement } from "./diagnostic.ts";
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
}

/** courseIndex indexes a subject's courses, given in catalog order. */
export function courseIndex(courses: ReadonlyMap<string, CompiledCourse>): CourseIndex {
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
  return { order, earlier, next, teaching, courses };
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
 * should start (docs/learning-engine.md §9). A diagnostic that asked nothing
 * (one skipped) recommends nothing. Gaps count only where the answers showed
 * them: a topic answered wrongly and everything that depends on it, since
 * placement counts unresolved topics as not known to err on the side of
 * teaching, which says nothing about where the learner stands.
 */
export function placementAdvice(pl: Planner, index: CourseIndex, state: LearnerState, placement: Placement): PlacementAdvice {
  if (placement.tested.length === 0 && placement.missed.length === 0) return { kind: "stay" };
  const g = pl.graph;
  const xp = (id: string) => g.graph.topics.get(id)?.xp ?? 0;
  const course = index.courses.get(pl.scope.course);
  if (!course) return { kind: "stay" };

  const total = course.topics.reduce((sum, id) => sum + xp(id), 0);
  const known = course.topics.reduce((sum, id) => sum + (isKnown(pl, state, id) ? xp(id) : 0), 0);
  const after = index.next.get(course.def.id)?.[0];
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
