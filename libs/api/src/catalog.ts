import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError, type ServiceImpl } from "@connectrpc/connect";
import type { CourseListing, SubjectListing } from "@ga/content";
import type { CatalogService, CourseSchema } from "@ga/proto/catalog/v1/catalog_pb";

import { text } from "./convert.ts";
import type { CourseEntry, Registry } from "./registry.ts";

/** courseMessage describes a course of a subject for a client, with its outline when given. */
export function courseMessage(
  subject: SubjectListing,
  c: CourseListing,
  outline?: MessageInitShape<typeof CourseSchema>["units"],
): MessageInitShape<typeof CourseSchema> {
  return {
    id: c.id,
    subjectId: subject.id,
    subjectTitle: text(subject.title),
    title: text(c.title),
    description: text(c.description),
    ...(c.group && { group: text(c.group) }),
    buildsOn: [...c.buildsOn],
    retired: c.retired ?? false,
    topicCount: c.topicCount,
    xp: c.xp,
    ...(outline && { units: outline }),
  };
}

/**
 * coursePrerequisites maps each topic of a course to the topics of the course to be learned before it: its direct
 * prerequisites in the course, and through a prerequisite outside it, the nearest topics of the course that one builds
 * on in turn.
 */
export function coursePrerequisites(c: CourseEntry): ReadonlyMap<string, readonly string[]> {
  const inCourse = new Set(c.course.topics);
  const nearest = new Map<string, readonly string[]>();
  // within finds the topics of the course nearest below a topic outside it.
  const within = (id: string, seen: Set<string>): readonly string[] => {
    const known = nearest.get(id);
    if (known) return known;
    if (seen.has(id)) return [];
    seen.add(id);
    const found = [...new Set((c.subject.topics.get(id)?.prerequisites ?? []).flatMap((p) => (inCourse.has(p) ? [p] : within(p, seen))))];
    nearest.set(id, found);
    return found;
  };
  return new Map(
    c.course.topics.map((id) => [
      id,
      [...new Set((c.subject.topics.get(id)?.prerequisites ?? []).flatMap((p) => (inCourse.has(p) ? [p] : within(p, new Set()))))],
    ]),
  );
}

/** courseUnits is the outline of a course: its units, modules and topics, with each topic's prerequisites in it. */
export function courseUnits(c: CourseEntry): MessageInitShape<typeof CourseSchema>["units"] {
  const before = coursePrerequisites(c);
  return c.course.def.units.map((u) => ({
    title: text(u.title),
    modules: u.modules.map((m) => ({
      title: text(m.title),
      topics: m.topics.map((id) => {
        const t = c.subject.topics.get(id)!;
        return {
          id,
          title: text(t.title),
          summary: text(t.summary),
          xp: t.xp,
          knowledgePoints: t.knowledgePoints.length,
          prerequisites: [...(before.get(id) ?? [])],
        };
      }),
    })),
  }));
}

/** catalogService implements CatalogService from the registry. */
export function catalogService(registry: Registry): ServiceImpl<typeof CatalogService> {
  return {
    listCourses() {
      return {
        courses: registry.listings.flatMap((s) => s.courses.map((c) => courseMessage(s, c))),
        subjects: registry.listings.map((s) => ({ id: s.id, title: text(s.title), mark: s.mark, hue: s.hue })),
      };
    },
    async getCourse(req) {
      const c = await registry.course(req.courseId);
      if (!c) throw new ConnectError(`unknown course ${req.courseId}`, Code.NotFound);
      const listing = registry.listings.find((s) => s.id === c.subject.def.id)!;
      return { course: courseMessage(listing, listing.courses.find((l) => l.id === c.id)!, courseUnits(c)) };
    },
  };
}
