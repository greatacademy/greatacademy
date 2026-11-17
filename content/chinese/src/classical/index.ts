// Classical language (文言) of grades 5 to 9 (docs/chinese-curriculum.md §7): recited passages of classical prose,
// each following the one before in its grade, and the drills of content and function words that read them.

import type { TopicDef } from "@ga/content";

import { drillTopic } from "../grammar/drill.ts";
import type { GradeTopic } from "../grammar/index.ts";
import { type Poem, poemTopic } from "../recitation/poems.ts";
import { classicalDrills } from "./drills.ts";
import { gradeEightPassages, gradeNinePassages, gradeSevenPassages } from "./junior.ts";
import { gradeFivePassages, gradeSixPassages } from "./passages.ts";

function grade(n: number, passages: readonly Poem[]): readonly GradeTopic[] {
  return passages.map((passage, i) => ({
    grade: n,
    topic: poemTopic(
      passage,
      i === 0 ? [] : [passages[i - 1]!.id],
      passages.filter((p) => p !== passage),
    ),
  }));
}

/** classicalPassages are the recited classical passages of grades 5 to 9, in order. */
export const classicalPassages: readonly GradeTopic[] = [
  ...grade(5, gradeFivePassages),
  ...grade(6, gradeSixPassages),
  ...grade(7, gradeSevenPassages),
  ...grade(8, gradeEightPassages),
  ...grade(9, gradeNinePassages),
];

/** classicalDrillTopics are the drills of classical language; each builds on the passages of its grade, through the last. */
export const classicalDrillTopics: readonly GradeTopic[] = classicalDrills.map(({ grade: g, ...spec }, i) => ({
  grade: g,
  topic: drillTopic({
    ...spec,
    strand: "classical",
    prerequisites: [
      ...(i === 0 ? [] : [classicalDrills[i - 1]!.id]),
      ...classicalPassages
        .filter((p) => p.grade === g)
        .slice(-1)
        .map((p) => p.topic.id),
    ],
  }),
}));

/** classicalTopics are the topics of classical language. */
export const classicalTopics: readonly TopicDef[] = [...classicalPassages, ...classicalDrillTopics].map((g) => g.topic);
