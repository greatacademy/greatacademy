// Helpers shared by the topic files of A2: criteria by id, combinations of lists, and the shape of a writing topic
// judged by a model.

import { type CriterionSpec, type EncompassingDef, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, type WritingLimits, writingGenerator } from "@ga/subject-english";

/** criterion finds a writing criterion by id, failing for an unknown one. */
export function criterion(id: string): CriterionSpec {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
}

/**
 * combos lists n combinations of three lists, item k taking item k of each list modulo its length. With lengths that
 * share no factor, the first n combinations are all different as long as n is at most their product.
 */
export function combos<A, B, C>(n: number, a: readonly A[], b: readonly B[], c: readonly C[]): readonly (readonly [A, B, C])[] {
  return Array.from({ length: n }, (_, k) => [a[k % a.length]!, b[k % b.length]!, c[k % c.length]!] as const);
}

/** fill puts a word in the gap of a shown sentence and drops a note in brackets at its end. */
export function fill(shown: string, right: string): string {
  return shown.replace(/ \([^)]*\)$/u, "").replace("___", `*${right}*`);
}

/** JudgedSpec is what a writing topic of A2 judged by a model is made of: one knowledge point and its tasks. */
export interface JudgedSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses: readonly EncompassingDef[];
  readonly criteria: readonly string[];
  readonly point: { readonly id: string; readonly title: Text; readonly explanation: Text };
  readonly question: Text;
  readonly bank: readonly WritingItem[];
  readonly limits: WritingLimits;
  /** what names the kind of text in the solution, such as an email. */
  readonly what: Text;
}

const quoted = (model: string) => `> ${model.replace(/\n/gu, "\n> ")}`;

/** judgedTopic builds a writing topic judged by a model against criteria of A2 and A1. */
export function judgedTopic(spec: JudgedSpec): TopicDef {
  if (spec.bank.length < 12) throw new Error(`${spec.id}: fewer than 12 tasks`);
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    prerequisites: spec.prerequisites,
    encompasses: spec.encompasses,
    xp: 30,
    strand: "writing",
    criteria: spec.criteria.map(criterion),
    knowledgePoints: [
      point(
        spec.point.id,
        spec.point.title,
        spec.point.explanation,
        writingGenerator(spec.question, spec.bank, spec.criteria, spec.limits, (model) =>
          t(`One good ${spec.what.en}:\n\n${quoted(model)}`, `一篇好的${spec.what["zh-CN"]}：\n\n${quoted(model)}`),
        ),
      ),
    ],
  };
}
