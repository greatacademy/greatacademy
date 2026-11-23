// Grammar drills (docs/chinese-curriculum.md §6): topics of connectives, sentence forms and rhetoric, each of two
// knowledge points that ask one kind of question. An item is what is shown, the right answer and three wrong ones; each
// item is asked with two of its wrong answers at a time, in three different pairs.

import type { Text, TopicDef } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type Show, type Why, type WhyNot } from "@ga/subject-chinese";

/** DrillItem is what an item shows (empty when the question says it all), its right answer and three wrong ones. */
export interface DrillItem {
  readonly shown: string;
  readonly right: string;
  readonly wrong: readonly [string, string, string];
}

/** drillItem makes an item, checking that its four answers differ. */
export function drillItem(shown: string, right: string, wrong: readonly [string, string, string]): DrillItem {
  if (new Set([right, ...wrong]).size !== 4) throw new Error(`grammar drill: the answers of ${shown || right}`);
  return { shown, right, wrong };
}

/** DrillPoint is a knowledge point of a drill: its id suffix, title, explanation, question, items and solution. */
export interface DrillPoint {
  readonly suffix: string;
  readonly title: Text;
  readonly explanation: Text;
  readonly question: Text;
  readonly items: readonly DrillItem[];
  readonly why: Why;
  /** whyNot says why a wrong option is wrong: told to a learner who picks it, and listed after the solution. */
  readonly whyNot?: WhyNot;
  /** show writes what an item shows in each locale, where it would otherwise mix the languages. */
  readonly show?: Show;
}

/** DrillSpec describes a drill topic. */
export interface DrillSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly prerequisites: readonly string[];
  readonly points: readonly [DrillPoint, DrillPoint];
  /** intro is the short tutorial read before the first knowledge point. */
  readonly intro?: Text;
  /** strand is the topic's strand, grammar unless given. */
  readonly strand?: string;
}

/** PAIRS are the pairs of wrong answers an item is asked with, one a round. */
const PAIRS = [
  [0, 1],
  [1, 2],
  [0, 2],
] as const;

/** MIN_ITEMS is how many items a knowledge point needs, so that it has 30 distinct problems. */
const MIN_ITEMS = 10;

/** drillTopic builds a drill topic; its banks go item by item within each round, so consecutive seeds never show the same item. */
export function drillTopic(spec: DrillSpec): TopicDef {
  for (const p of spec.points) {
    if (p.items.length < MIN_ITEMS) throw new Error(`${spec.id}-${p.suffix}: a drill needs ${MIN_ITEMS} items`);
  }
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    ...(spec.intro && { intro: spec.intro }),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: spec.points[0].items.length,
    strand: spec.strand ?? "grammar",
    knowledgePoints: spec.points.map((p) => {
      const bank: readonly ChoiceItem[] = PAIRS.flatMap(([a, b]) =>
        p.items.map((item): ChoiceItem => [item.shown, item.right, [item.wrong[a], item.wrong[b]]]),
      );
      return point(`${spec.id}-${p.suffix}`, p.title, p.explanation, choiceGenerator(p.question, bank, p.why, p.whyNot, p.show));
    }),
  };
}

/** lines splits data into its trimmed lines, each split at ` | `, checking each has `fields` fields. */
export function lines(data: string, fields: number): readonly (readonly string[])[] {
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const parts = line.split(" | ").map((f) => f.trim());
      if (parts.length !== fields) throw new Error(`grammar drill data: ${line}`);
      return parts;
    });
}
