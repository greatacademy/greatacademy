import type { CompiledCourse, CompiledSubject, Graph, GraphPassage, GraphTopic, WeightedEdge } from "./compile.ts";
import type { Text } from "./text.ts";
import type { CourseDef, CriterionSpec } from "./types.ts";

/** ManifestTopic is what serving a subject needs of a topic without its generators. */
export interface ManifestTopic extends GraphTopic {
  readonly title: Text;
  readonly summary: Text;
  readonly practiceOnly?: boolean;
  /** criteria make the topic judged by a model, as in TopicDef. */
  readonly criteria?: readonly CriterionSpec[];
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
  readonly mark: string;
  readonly hue: number;
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
  /** buildsOn lists the courses this one follows on from, nearest first. */
  readonly buildsOn: readonly string[];
  readonly topicCount: number;
  readonly xp: number;
}

/** SubjectListing is the small part of a manifest needed to list a subject's courses. */
export interface SubjectListing {
  readonly id: string;
  readonly title: Text;
  readonly mark: string;
  readonly hue: number;
  readonly courses: readonly CourseListing[];
  /** criteria are the criteria the subject's judged topics are judged on, each once, so that a route can name one. */
  readonly criteria: readonly CriterionSpec[];
}

/** SubjectCatalog is a manifest read into the indexes the services and the engine use. */
export interface SubjectCatalog {
  readonly def: { readonly id: string; readonly title: Text; readonly mark: string; readonly hue: number };
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
    mark: subject.def.mark,
    hue: subject.def.hue,
    topics: subject.graph.order.map((id) => {
      const topic = subject.topics.get(id)!;
      return {
        ...subject.graph.topics.get(id)!,
        title: topic.title,
        summary: topic.summary,
        ...(topic.practiceOnly && { practiceOnly: true }),
        ...(topic.criteria && { criteria: topic.criteria }),
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
    mark: manifest.mark,
    hue: manifest.hue,
    courses: manifest.courses.map((c) => ({
      id: c.def.id,
      title: c.def.title,
      description: c.def.description,
      ...(c.def.group && { group: c.def.group }),
      buildsOn: c.def.buildsOn ?? [],
      topicCount: c.topics.length,
      xp: c.topics.reduce((sum, id) => sum + xp.get(id)!, 0),
    })),
    criteria: [...new Map(manifest.topics.flatMap((t) => t.criteria ?? []).map((c) => [`${c.id}@${c.version}`, c])).values()],
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
    def: { id: manifest.id, title: manifest.title, mark: manifest.mark, hue: manifest.hue },
    graph: { subject: manifest.id, topics, order, dependents, encompassedBy, ancestors, passages },
    topics,
    passages,
    courses: new Map(manifest.courses.map((c) => [c.def.id, { ...c, masteryFloor: new Set(c.masteryFloor) }])),
  };
}
