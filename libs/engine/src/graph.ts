import type { CompiledCourse, Graph } from "@ga/content";

/**
 * EngineGraph is a subject graph with the closures the engine needs,
 * computed once per graph.
 */
export interface EngineGraph {
  readonly graph: Graph;
  /** encompassed maps a topic to every topic it practices implicitly, with the largest product of weights over all paths. */
  readonly encompassed: ReadonlyMap<string, ReadonlyMap<string, number>>;
  /** encompassers is the inverse of encompassed. */
  readonly encompassers: ReadonlyMap<string, ReadonlyMap<string, number>>;
  /** descendants maps a topic to every topic that has it as an ancestor. */
  readonly descendants: ReadonlyMap<string, ReadonlySet<string>>;
  /** keyPrerequisites are the union of a topic's knowledge points' key prerequisites, or its direct prerequisites when none are given. */
  readonly keyPrerequisites: ReadonlyMap<string, readonly string[]>;
}

/** engineGraph computes the closures of a compiled graph. */
export function engineGraph(graph: Graph): EngineGraph {
  const encompassed = new Map<string, Map<string, number>>();
  // The compiler guarantees that encompassing edges form no cycle, so a memoized depth-first walk terminates.
  const visit = (id: string): Map<string, number> => {
    const done = encompassed.get(id);
    if (done) return done;
    const out = new Map<string, number>();
    encompassed.set(id, out);
    for (const e of graph.topics.get(id)?.encompasses ?? []) {
      const put = (t: string, w: number) => out.set(t, Math.max(out.get(t) ?? 0, w));
      put(e.topic, e.weight);
      for (const [t, w] of visit(e.topic)) put(t, e.weight * w);
    }
    return out;
  };
  for (const id of graph.order) visit(id);

  const encompassers = new Map<string, Map<string, number>>(graph.order.map((id) => [id, new Map()]));
  for (const [id, below] of encompassed) for (const [t, w] of below) encompassers.get(t)!.set(id, w);

  const descendants = new Map<string, Set<string>>(graph.order.map((id) => [id, new Set()]));
  for (const [id, ancestors] of graph.ancestors) for (const a of ancestors) descendants.get(a)!.add(id);

  const keyPrerequisites = new Map<string, string[]>();
  for (const [id, topic] of graph.topics) {
    const keys = [...new Set(topic.knowledgePoints.flatMap((kp) => kp.keyPrerequisites))];
    keyPrerequisites.set(id, keys.length > 0 ? keys : [...topic.prerequisites]);
  }
  return { graph, encompassed, encompassers, descendants, keyPrerequisites };
}

/** CourseScope is the part of the graph a course teaches and reviews. */
export interface CourseScope {
  /** course is the course's id. */
  readonly course: string;
  /** topics are the foundations then the course topics, in teaching order. */
  readonly topics: readonly string[];
  readonly inCourse: ReadonlySet<string>;
  /** assumed are the mastery floor and its ancestors: known by assumption, never taught or reviewed. */
  readonly assumed: ReadonlySet<string>;
}

/** courseScope derives the scope of a compiled course. */
export function courseScope(g: EngineGraph, course: CompiledCourse): CourseScope {
  const assumed = new Set<string>();
  for (const f of course.masteryFloor) {
    assumed.add(f);
    for (const a of g.graph.ancestors.get(f) ?? []) assumed.add(a);
  }
  return { course: course.def.id, topics: [...course.foundations, ...course.topics], inCourse: new Set(course.topics), assumed };
}
