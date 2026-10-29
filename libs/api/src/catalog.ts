import type { MessageInitShape } from "@bufbuild/protobuf";
import { Code, ConnectError, type ServiceImpl } from "@connectrpc/connect";
import type { CatalogService, CourseSchema } from "@ga/proto/catalog/v1/catalog_pb";

import { text } from "./convert.ts";
import type { CourseEntry, Registry } from "./registry.ts";

function course(c: CourseEntry, outline: boolean): MessageInitShape<typeof CourseSchema> {
  const def = c.course.def;
  const topic = (id: string) => c.subject.topics.get(id)!;
  return {
    id: c.id,
    subjectId: c.subject.def.id,
    subjectTitle: text(c.subject.def.title),
    title: text(def.title),
    description: text(def.description),
    topicCount: c.course.topics.length,
    xp: c.course.topics.reduce((sum, id) => sum + topic(id).xp, 0),
    units: outline
      ? def.units.map((u) => ({
          title: text(u.title),
          modules: u.modules.map((m) => ({
            title: text(m.title),
            topics: m.topics.map((id) => {
              const t = topic(id);
              return { id, title: text(t.title), summary: text(t.summary), xp: t.xp, knowledgePoints: t.knowledgePoints.length };
            }),
          })),
        }))
      : [],
  };
}

/** catalogService implements CatalogService from the registry. */
export function catalogService(registry: Registry): ServiceImpl<typeof CatalogService> {
  return {
    listCourses() {
      return { courses: [...registry.courses.values()].map((c) => course(c, false)) };
    },
    getCourse(req) {
      const c = registry.courses.get(req.courseId);
      if (!c) throw new ConnectError(`unknown course ${req.courseId}`, Code.NotFound);
      return { course: course(c, true) };
    },
  };
}
