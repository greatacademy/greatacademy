// More topics for 1st, 2nd and 3rd Grade Math, with the units that place them in the courses.

import type { CourseDef, TopicDef } from "@ga/content";

/** earlyGradesMoreTopics are the added topics of the 1st, 2nd and 3rd grade courses. */
export const earlyGradesMoreTopics: readonly TopicDef[] = [];

/** earlyGradesMoreUnits are the units added to the end of each of the 1st, 2nd and 3rd grade courses, by course id. */
export const earlyGradesMoreUnits: Readonly<Record<"1st-grade-math" | "2nd-grade-math" | "3rd-grade-math", CourseDef["units"]>> = {
  "1st-grade-math": [],
  "2nd-grade-math": [],
  "3rd-grade-math": [],
};
