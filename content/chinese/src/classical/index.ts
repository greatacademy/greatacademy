// Classical language (文言) of grades 3 to 9 and senior secondary school (docs/chinese-curriculum.md §7): recited
// passages of classical prose, each following the one before in its grade, and the drills of content and function words
// that read them.

import type { TopicDef } from "@ga/content";

import { drillTopic } from "../grammar/drill.ts";
import type { GradeTopic } from "../grammar/index.ts";
import { type Poem, poemTopic } from "../recitation/poems.ts";
import { classicalDrills } from "./drills.ts";
import { gradeEightPassages, gradeNinePassages, gradeSevenPassages } from "./junior.ts";
import { gradeFivePassages, gradeFourPassages, gradeSixPassages, gradeThreePassages } from "./passages.ts";
import { seniorRequiredPassages, seniorSelectivePassages } from "./senior.ts";
import { seniorClassicalDrills } from "./senior-drills.ts";

/**
 * grade chains a grade's passages; pool holds the passages whose lines are offered against each one's, by default those
 * of its grade, and for primary school all of its few passages, since a grade may have only one.
 */
function grade(n: number, passages: readonly Poem[], pool: readonly Poem[] = passages): readonly GradeTopic[] {
  return passages.map((passage, i) => ({
    grade: n,
    topic: poemTopic(
      passage,
      i === 0 ? [] : [passages[i - 1]!.id],
      pool.filter((p) => p !== passage),
    ),
  }));
}

/** PRIMARY are the recited classical passages of grades 3 to 6. */
const PRIMARY = [...gradeThreePassages, ...gradeFourPassages, ...gradeFivePassages, ...gradeSixPassages];

/** classicalPassages are the recited classical passages of grades 3 to 9 and senior secondary school, in order. */
export const classicalPassages: readonly GradeTopic[] = [
  ...grade(3, gradeThreePassages, PRIMARY),
  ...grade(4, gradeFourPassages, PRIMARY),
  ...grade(5, gradeFivePassages, PRIMARY),
  ...grade(6, gradeSixPassages, PRIMARY),
  ...grade(7, gradeSevenPassages),
  ...grade(8, gradeEightPassages),
  ...grade(9, gradeNinePassages),
  ...grade(10, seniorRequiredPassages),
  ...grade(11, seniorSelectivePassages),
];

const drills = [...classicalDrills, ...seniorClassicalDrills];

/** classicalDrillTopics are the drills of classical language; the first of a grade builds on its passages, through the last. */
export const classicalDrillTopics: readonly GradeTopic[] = drills.map(({ grade: g, ...spec }, i) => ({
  grade: g,
  topic: drillTopic({
    ...spec,
    strand: "classical",
    prerequisites: [
      ...(i === 0 ? [] : [drills[i - 1]!.id]),
      ...classicalPassages
        .filter((p) => p.grade === g && drills[i - 1]?.grade !== g)
        .slice(-1)
        .map((p) => p.topic.id),
    ],
  }),
}));

/** classicalTopics are the topics of classical language. */
export const classicalTopics: readonly TopicDef[] = [...classicalPassages, ...classicalDrillTopics].map((g) => g.topic);
