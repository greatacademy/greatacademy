import type { TopicDef } from "@ga/content";

import { examTopic } from "../exam.ts";
import { satExamAlgebra1 } from "./sat-exam-algebra-1.ts";
import { satExamAlgebra2 } from "./sat-exam-algebra-2.ts";
import { satExamAlgebra3 } from "./sat-exam-algebra-3.ts";
import { satExamAlgebra4 } from "./sat-exam-algebra-4.ts";

/** examTopics are the exam-style topics of SAT Math Prep and ACT Math Prep. */
export const examTopics: TopicDef[] = [...satExamAlgebra1, ...satExamAlgebra2, ...satExamAlgebra3, ...satExamAlgebra4].map((spec) =>
  examTopic("sat", spec),
);
