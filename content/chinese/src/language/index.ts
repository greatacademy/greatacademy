// The language and revising topics of grades 3 and 4 (docs/chinese-curriculum.md §18.9).

import type { GradeTopic } from "../grammar/index.ts";
import { gradeThreeLanguage } from "./grade-3.ts";
import { gradeFourLanguage } from "./grade-4.ts";

export { revisingTopics } from "./revising.ts";

/** stageThreeFourLanguage are the language topics of grades 3 and 4: the dictionary, like characters and readings. */
export const stageThreeFourLanguage: readonly GradeTopic[] = [...gradeThreeLanguage, ...gradeFourLanguage];
