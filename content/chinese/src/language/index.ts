// The language, revising and planning topics of grades 3 to 7 (docs/chinese-curriculum.md §18.9).

import type { GradeTopic } from "../grammar/index.ts";
import { gradeThreeLanguage } from "./grade-3.ts";
import { gradeFourLanguage } from "./grade-4.ts";
import { gradeFiveLanguage } from "./grade-5.ts";
import { gradeSixLanguage } from "./grade-6.ts";

export { planningTopics } from "./planning.ts";
export { revisingTopics } from "./revising.ts";

/** stageThreeFourLanguage are the language topics of grades 3 and 4: the dictionary, like characters and readings. */
export const stageThreeFourLanguage: readonly GradeTopic[] = [...gradeThreeLanguage, ...gradeFourLanguage];

/** stageFiveSixLanguage are the language and inquiry topics of grades 5 and 6: how characters and words are made, and finding information. */
export const stageFiveSixLanguage: readonly GradeTopic[] = [...gradeFiveLanguage, ...gradeSixLanguage];
