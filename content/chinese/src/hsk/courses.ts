// The HSK courses (docs/chinese-curriculum.md §8.5): each holds the units of the levels it tests, then its own exam
// topics of index.ts. Apart from index.ts, so that the exam topics are built without the topics of the levels.

import type { CourseDef } from "@ga/content";

import { levelOneCourse } from "../level-1/index.ts";
import { levelTwoCourse } from "../level-2/index.ts";
import { levelThreeCourse } from "../level-3/index.ts";
import { levelFourCourse } from "../level-4/index.ts";
import { levelFiveCourse } from "../level-5/index.ts";
import { levelSixCourse } from "../level-6/index.ts";
import { levelSevenCourse } from "../level-7/index.ts";
import { levelEightCourse } from "../level-8/index.ts";
import { levelNineCourse } from "../level-9/index.ts";
import { hskParts } from "./index.ts";

/** LEVELS are the courses of the levels each HSK course tests, and the courses it builds on, in the order of hskParts. */
const LEVELS: readonly { readonly courses: readonly CourseDef[]; readonly buildsOn: readonly string[] }[] = [
  ...[levelOneCourse, levelTwoCourse, levelThreeCourse, levelFourCourse, levelFiveCourse, levelSixCourse].map((c) => ({
    courses: [c],
    buildsOn: c.buildsOn ?? [],
  })),
  { courses: [levelSevenCourse, levelEightCourse, levelNineCourse], buildsOn: ["chinese-level-6"] },
];

/** hskCourses are the seven HSK courses, HSK 1 to 6 and HSK 7–9. */
export const hskCourses: readonly CourseDef[] = hskParts.map((part, i) => {
  const levels = LEVELS[i];
  if (!levels) throw new Error(`hsk ${part.key}: no levels`);
  return part.course(levels.courses, levels.buildsOn);
});
