// The recitation topics of the Chinese subject: a topic a poem from grade 1 to grade 9 (docs/chinese-curriculum.md §7), each poem
// following the grade's one before. The lines of a grade's other poems are offered against a poem's own.

import type { TopicDef } from "@ga/content";

import { gradeFivePoems, gradeFourPoems, gradeSixPoems, gradeThreePoems } from "./data.ts";
import { gradeOnePoems, gradeTwoPoems } from "./early.ts";
import { gradeEightPoems, gradeNinePoems, gradeSevenPoems } from "./later.ts";
import { type Poem, poemTopic } from "./poems.ts";

/** GradePoem is a recitation topic and the grade it is taught in. */
export interface GradePoem {
  readonly grade: number;
  readonly poem: Poem;
  readonly topic: TopicDef;
}

function grade(n: number, poems: readonly Poem[]): readonly GradePoem[] {
  return poems.map((poem, i) => ({
    grade: n,
    poem,
    topic: poemTopic(
      poem,
      i === 0 ? [] : [poems[i - 1]!.id],
      poems.filter((p) => p !== poem),
    ),
  }));
}

/** recitedPoems are the recited poems of every grade, in order. */
export const recitedPoems: readonly GradePoem[] = [
  ...grade(1, gradeOnePoems),
  ...grade(2, gradeTwoPoems),
  ...grade(3, gradeThreePoems),
  ...grade(4, gradeFourPoems),
  ...grade(5, gradeFivePoems),
  ...grade(6, gradeSixPoems),
  ...grade(7, gradeSevenPoems),
  ...grade(8, gradeEightPoems),
  ...grade(9, gradeNinePoems),
];

/** recitationTopics are the recitation topics. */
export const recitationTopics: readonly TopicDef[] = recitedPoems.map((p) => p.topic);
