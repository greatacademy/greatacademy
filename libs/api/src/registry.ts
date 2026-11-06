import {
  type CompiledCourse,
  type CompiledSubject,
  inLocale,
  type Locale,
  readManifest,
  type SubjectCatalog,
  type SubjectGateway,
  type SubjectListing,
  type SubjectSource,
  subjectListing,
  subjectManifest,
  topicSource,
} from "@ga/content";
import { courseScope, defaultParams, type EngineContext, type EngineGraph, engineGraph, type Params, type Planner } from "@ga/engine";

/** localGateway serves a compiled subject from this process; tests and tools use it. */
export function localGateway(subject: CompiledSubject): SubjectGateway {
  const manifest = subjectManifest(subject);
  return {
    ...topicSource(subject.topics.values(), subject.def.checkers, subject.def.reading),
    listing: async () => subjectListing(manifest),
    manifest: async () => manifest,
  };
}

/** sourceInLocale serves a source's lessons and problems in one locale, for a course that teaches in that language. */
function sourceInLocale(source: SubjectSource, locale: Locale): SubjectSource {
  return {
    problems: async (refs) => inLocale(await source.problems(refs), locale),
    lesson: async (topic, kp) => inLocale(await source.lesson(topic, kp), locale),
    judge: async (ref, response) => inLocale(await source.judge(ref, response), locale),
    passage: async (id) => inLocale(await source.passage(id), locale),
  };
}

/** SubjectEntry is a subject's catalog with its source, engine graph and courses. */
export interface SubjectEntry {
  readonly subject: SubjectCatalog;
  readonly source: SubjectGateway;
  readonly ctx: EngineContext;
  readonly courses: ReadonlyMap<string, CourseEntry>;
}

/** CourseEntry is everything the services need about one course. */
export interface CourseEntry {
  readonly id: string;
  readonly course: CompiledCourse;
  readonly subject: SubjectCatalog;
  readonly source: SubjectSource;
  readonly ctx: EngineContext;
  readonly planner: Planner;
}

/** loadedSubjects is how many subjects a Registry keeps in memory: a large subject takes tens of megabytes, and a Worker isolate has 128. */
const loadedSubjects = 2;

/**
 * Registry indexes the subjects served by the API. Course ids are unique across
 * subjects, so that clients name a course by its id alone. It is built once per
 * process (per isolate in a Worker). It reads every subject's listing when
 * opened and loads a subject only when one of its courses is used.
 */
export class Registry {
  /** listings are the subjects served, enough to list their courses. */
  readonly listings: readonly SubjectListing[];
  readonly #gateways = new Map<string, SubjectGateway>();
  readonly #subjectOfCourse = new Map<string, string>();
  readonly #loaded = new Map<string, SubjectEntry>();
  readonly #params: Params;

  private constructor(listings: readonly SubjectListing[], gateways: readonly SubjectGateway[], params: Params) {
    this.listings = listings;
    this.#params = params;
    listings.forEach((listing, i) => {
      if (this.#gateways.has(listing.id)) throw new Error(`duplicate subject ${listing.id}`);
      this.#gateways.set(listing.id, gateways[i]!);
      for (const { id } of listing.courses) {
        if (this.#subjectOfCourse.has(id)) throw new Error(`duplicate course ${id}`);
        this.#subjectOfCourse.set(id, listing.id);
      }
    });
  }

  /** open reads the listings of the subjects served by gateways. */
  static async open(gateways: readonly SubjectGateway[], params: Params = defaultParams): Promise<Registry> {
    return new Registry(await Promise.all(gateways.map((g) => g.listing())), gateways, params);
  }

  /**
   * subject gives a subject by id, loading it if needed. Concurrent first calls
   * each load for themselves: in a Worker, one request must not await a promise
   * of another, which fails if that request is cancelled.
   */
  async subject(id: string): Promise<SubjectEntry | undefined> {
    const kept = this.#loaded.get(id);
    if (kept) {
      // Most recently used last.
      this.#loaded.delete(id);
      this.#loaded.set(id, kept);
      return kept;
    }
    const source = this.#gateways.get(id);
    if (!source) return undefined;
    const manifest = await source.manifest();
    const entry = this.#read(readManifest(manifest), source);
    this.#loaded.set(id, entry);
    if (this.#loaded.size > loadedSubjects) this.#loaded.delete(this.#loaded.keys().next().value!);
    return entry;
  }

  /** course gives a course by id, loading its subject if needed. */
  async course(id: string): Promise<CourseEntry | undefined> {
    const subject = this.#subjectOfCourse.get(id);
    return subject === undefined ? undefined : (await this.subject(subject))?.courses.get(id);
  }

  #read(subject: SubjectCatalog, source: SubjectGateway): SubjectEntry {
    const params = this.#params;
    const graph: EngineGraph = engineGraph(subject.graph);
    const ctx = { params, graph };
    const courses = new Map<string, CourseEntry>();
    for (const [id, course] of subject.courses) {
      // A course's scope is computed when first used: most isolates serve few courses.
      let planner: Planner | undefined;
      const { explanationLocale } = course.def;
      courses.set(id, {
        id,
        course,
        subject,
        source: explanationLocale ? sourceInLocale(source, explanationLocale) : source,
        ctx,
        get planner() {
          planner ??= { params, graph, scope: courseScope(graph, course) };
          return planner;
        },
      });
    }
    return { subject, source, ctx, courses };
  }
}
