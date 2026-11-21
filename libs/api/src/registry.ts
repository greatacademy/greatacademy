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
import {
  type CourseIndex,
  courseIndex,
  courseScope,
  defaultParams,
  type EngineContext,
  type EngineGraph,
  engineGraph,
  type Params,
  type Planner,
} from "@ga/engine";

/** localGateway serves a compiled subject from this process; tests and tools use it. */
export function localGateway(subject: CompiledSubject): SubjectGateway {
  const manifest = subjectManifest(subject);
  return {
    ...topicSource(subject.topics.values(), subject.def.checkers, subject.def.reading),
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
  /** index relates the subject's courses: what each builds on and which teach a topic. */
  readonly index: CourseIndex;
}

/** CourseEntry is everything the services need about one course. */
export interface CourseEntry {
  readonly id: string;
  readonly course: CompiledCourse;
  readonly subject: SubjectCatalog;
  readonly source: SubjectSource;
  readonly ctx: EngineContext;
  readonly planner: Planner;
  /** index relates the courses of the course's subject. */
  readonly index: CourseIndex;
}

/**
 * Registry indexes the subjects served by the API. Course ids are unique across
 * subjects, so that clients name a course by its id alone. It is built once per
 * process and indexes every subject when opened, so that no request waits for a
 * subject to be indexed.
 */
export class Registry {
  /** listings are the subjects served, enough to list their courses. */
  readonly listings: readonly SubjectListing[];
  readonly #subjects = new Map<string, SubjectEntry>();
  readonly #courses = new Map<string, CourseEntry>();

  private constructor(listings: readonly SubjectListing[], entries: readonly SubjectEntry[]) {
    this.listings = listings;
    listings.forEach((listing, i) => {
      if (this.#subjects.has(listing.id)) throw new Error(`duplicate subject ${listing.id}`);
      const entry = entries[i]!;
      this.#subjects.set(listing.id, entry);
      for (const { id } of listing.courses) {
        if (this.#courses.has(id)) throw new Error(`duplicate course ${id}`);
        const course = entry.courses.get(id);
        if (!course) throw new Error(`subject ${listing.id} lists course ${id} without it`);
        this.#courses.set(id, course);
      }
    });
  }

  /** open indexes the manifest of each subject served by gateways. */
  static async open(gateways: readonly SubjectGateway[], params: Params = defaultParams): Promise<Registry> {
    const manifests = await Promise.all(gateways.map((g) => g.manifest()));
    return new Registry(
      manifests.map(subjectListing),
      manifests.map((m, i) => read(readManifest(m), gateways[i]!, params)),
    );
  }

  /** subject gives a subject by id. */
  async subject(id: string): Promise<SubjectEntry | undefined> {
    return this.#subjects.get(id);
  }

  /** course gives a course by id. */
  async course(id: string): Promise<CourseEntry | undefined> {
    return this.#courses.get(id);
  }
}

/** read indexes a subject's catalog for the services: its graph, its courses' scopes and how its courses relate. */
function read(subject: SubjectCatalog, source: SubjectGateway, params: Params): SubjectEntry {
  const graph: EngineGraph = engineGraph(subject.graph);
  const ctx = { params, graph };
  const index = courseIndex(subject.courses, subject.sequences);
  const courses = new Map<string, CourseEntry>();
  for (const [id, course] of subject.courses) {
    const { explanationLocale } = course.def;
    courses.set(id, {
      id,
      course,
      subject,
      source: explanationLocale ? sourceInLocale(source, explanationLocale) : source,
      ctx,
      planner: { params, graph, scope: courseScope(graph, course) },
      index,
    });
  }
  return { subject, source, ctx, courses, index };
}
