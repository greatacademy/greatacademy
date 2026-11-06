import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError, type ServiceImpl } from "@connectrpc/connect";
import type { CourseListing, SubjectListing } from "@ga/content";
import type { CatalogService, CourseSchema } from "@ga/proto/catalog/v1/catalog_pb";

import { text } from "./convert.ts";
import type { CourseEntry, Registry } from "./registry.ts";

function listed(
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
    topicCount: c.topicCount,
    xp: c.xp,
    ...(outline && { units: outline }),
  };
}

function units(c: CourseEntry): MessageInitShape<typeof CourseSchema>["units"] {
  return c.course.def.units.map((u) => ({
    title: text(u.title),
    modules: u.modules.map((m) => ({
      title: text(m.title),
      topics: m.topics.map((id) => {
        const t = c.subject.topics.get(id)!;
        return { id, title: text(t.title), summary: text(t.summary), xp: t.xp, knowledgePoints: t.knowledgePoints.length };
      }),
    })),
  }));
}

/** catalogService implements CatalogService from the registry. */
export function catalogService(registry: Registry): ServiceImpl<typeof CatalogService> {
  return {
    listCourses() {
      return { courses: registry.listings.flatMap((s) => s.courses.map((c) => listed(s, c))) };
    },
    async getCourse(req) {
      const c = await registry.course(req.courseId);
      if (!c) throw new ConnectError(`unknown course ${req.courseId}`, Code.NotFound);
      const listing = registry.listings.find((s) => s.id === c.subject.def.id)!;
      return { course: listed(listing, listing.courses.find((l) => l.id === c.id)!, units(c)) };
    },
  };
}
