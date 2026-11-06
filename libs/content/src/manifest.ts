import type { CompiledCourse, CompiledSubject, Graph, GraphPassage, GraphTopic, WeightedEdge } from "./compile.ts";
import type { Text } from "./text.ts";
import type { CourseDef } from "./types.ts";

/** ManifestTopic is what serving a subject needs of a topic without its generators. */
export interface ManifestTopic extends GraphTopic {
  readonly title: Text;
  readonly summary: Text;
  readonly practiceOnly?: boolean;
}

/** ManifestPassage is what serving a subject needs of a passage without its text. */
export interface ManifestPassage extends GraphPassage {
  readonly title: Text;
}

/** ManifestCourse is a compiled course as plain JSON. */
export interface ManifestCourse {
  readonly def: CourseDef;
  readonly topics: readonly string[];
  readonly masteryFloor: readonly string[];
  readonly foundations: readonly string[];
}

/**
 * SubjectManifest is a subject without its code: plain JSON, produced from the
 * compiled subject at build time and enough for catalogs and for the engine.
 * Its topics are in topological order.
 */
export interface SubjectManifest {
  readonly id: string;
  readonly title: Text;
  readonly topics: readonly ManifestTopic[];
  /** passages are in reading order. */
  readonly passages: readonly ManifestPassage[];
  readonly courses: readonly ManifestCourse[];
}

/** CourseListing is what a list of courses shows of a course. */
export interface CourseListing {
  readonly id: string;
  readonly title: Text;
  readonly description: Text;
  readonly group?: Text;
  readonly topicCount: number;
  readonly xp: number;
}

/** SubjectListing is the small part of a manifest needed to list a subject's courses. */
export interface SubjectListing {
  readonly id: string;
  readonly title: Text;
  readonly courses: readonly CourseListing[];
}

/** SubjectCatalog is a manifest read into the indexes the services and the engine use. */
export interface SubjectCatalog {
  readonly def: { readonly id: string; readonly title: Text };
  readonly graph: Graph;
  readonly topics: ReadonlyMap<string, ManifestTopic>;
  readonly passages: ReadonlyMap<string, ManifestPassage>;
  readonly courses: ReadonlyMap<string, CompiledCourse>;
}

/** subjectManifest writes a compiled subject as a manifest. */
export function subjectManifest(subject: CompiledSubject): SubjectManifest {
  return {
    id: subject.def.id,
    title: subject.def.title,
    topics: subject.graph.order.map((id) => {
      const topic = subject.topics.get(id)!;
      return {
        ...subject.graph.topics.get(id)!,
        title: topic.title,
        summary: topic.summary,
        ...(topic.practiceOnly && { practiceOnly: true }),
      };
    }),
    passages: (subject.def.reading ?? []).flatMap((unit) =>
      unit.passages.map((p) => ({ ...subject.graph.passages.get(p.id)!, title: p.title })),
    ),
    courses: [...subject.courses.values()].map((c) => ({
      def: c.def,
      topics: c.topics,
      masteryFloor: [...c.masteryFloor],
      foundations: c.foundations,
    })),
  };
}

/** subjectListing takes the listing out of a manifest. */
export function subjectListing(manifest: SubjectManifest): SubjectListing {
  const xp = new Map(manifest.topics.map((t) => [t.id, t.xp]));
  return {
    id: manifest.id,
    title: manifest.title,
    courses: manifest.courses.map((c) => ({
      id: c.def.id,
      title: c.def.title,
      description: c.def.description,
      ...(c.def.group && { group: c.def.group }),
      topicCount: c.topics.length,
      xp: c.topics.reduce((sum, id) => sum + xp.get(id)!, 0),
    })),
  };
}

/** readManifest rebuilds the graph and the indexes of a manifest. */
export function readManifest(manifest: SubjectManifest): SubjectCatalog {
  const order = manifest.topics.map((t) => t.id);
  const dependents = new Map<string, string[]>(order.map((id) => [id, []]));
  const encompassedBy = new Map<string, WeightedEdge[]>(order.map((id) => [id, []]));
  const ancestors = new Map<string, Set<string>>();
  for (const topic of manifest.topics) {
    const above = new Set<string>();
    for (const p of topic.prerequisites) {
      dependents.get(p)!.push(topic.id);
      above.add(p);
      for (const a of ancestors.get(p)!) above.add(a);
    }
    ancestors.set(topic.id, above);
    for (const e of topic.encompasses) encompassedBy.get(e.topic)!.push({ topic: topic.id, weight: e.weight });
  }
  const topics = new Map(manifest.topics.map((t) => [t.id, t]));
  const passages = new Map(manifest.passages.map((p) => [p.id, p]));
  return {
    def: { id: manifest.id, title: manifest.title },
    graph: { subject: manifest.id, topics, order, dependents, encompassedBy, ancestors, passages },
    topics,
    passages,
    courses: new Map(manifest.courses.map((c) => [c.def.id, { ...c, masteryFloor: new Set(c.masteryFloor) }])),
  };
}
