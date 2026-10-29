import type { CompiledCourse, CompiledSubject } from "@ga/content";
import { courseScope, defaultParams, type EngineContext, type EngineGraph, engineGraph, type Params, type Planner } from "@ga/engine";

/** SubjectEntry is a compiled subject with its engine graph. */
export interface SubjectEntry {
  readonly subject: CompiledSubject;
  readonly ctx: EngineContext;
}

/** CourseEntry is everything the services need about one course. */
export interface CourseEntry {
  readonly id: string;
  readonly course: CompiledCourse;
  readonly subject: CompiledSubject;
  readonly ctx: EngineContext;
  readonly planner: Planner;
}

/**
 * Registry indexes the compiled subjects served by the API. Course ids are
 * unique across subjects, so that clients name a course by its id alone. It
 * is built once per process (per isolate in a Worker).
 */
export class Registry {
  readonly subjects: ReadonlyMap<string, SubjectEntry>;
  readonly courses: ReadonlyMap<string, CourseEntry>;

  constructor(subjects: readonly CompiledSubject[], params: Params = defaultParams) {
    const bySubject = new Map<string, SubjectEntry>();
    const byCourse = new Map<string, CourseEntry>();
    for (const subject of subjects) {
      const id = subject.def.id;
      if (bySubject.has(id)) throw new Error(`duplicate subject ${id}`);
      const graph: EngineGraph = engineGraph(subject.graph);
      const ctx = { params, graph };
      bySubject.set(id, { subject, ctx });
      for (const [courseId, course] of subject.courses) {
        if (byCourse.has(courseId)) throw new Error(`duplicate course ${courseId}`);
        byCourse.set(courseId, { id: courseId, course, subject, ctx, planner: { params, graph, scope: courseScope(graph, course) } });
      }
    }
    this.subjects = bySubject;
    this.courses = byCourse;
  }
}
