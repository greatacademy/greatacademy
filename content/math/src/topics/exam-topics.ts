import type { TopicDef } from "@ga/content";

import { examTopic } from "../exam.ts";
import { satExamAdvanced1 } from "./sat-exam-advanced-1.ts";
import { satExamAdvanced2 } from "./sat-exam-advanced-2.ts";
import { satExamAdvanced3 } from "./sat-exam-advanced-3.ts";
import { satExamAlgebra1 } from "./sat-exam-algebra-1.ts";
import { satExamAlgebra2 } from "./sat-exam-algebra-2.ts";
import { satExamAlgebra3 } from "./sat-exam-algebra-3.ts";
import { satExamAlgebra4 } from "./sat-exam-algebra-4.ts";
import { satExamData1 } from "./sat-exam-data-1.ts";
import { satExamData2 } from "./sat-exam-data-2.ts";
import { satExamGeometry1 } from "./sat-exam-geometry-1.ts";
import { satExamGeometry2 } from "./sat-exam-geometry-2.ts";

/** examTopics are the exam-style topics of SAT Math Prep and ACT Math Prep. */
export const examTopics: TopicDef[] = [
  ...[
    ...satExamAdvanced1,
    ...satExamAdvanced2,
    ...satExamAdvanced3,
    ...satExamAlgebra1,
    ...satExamAlgebra2,
    ...satExamAlgebra3,
    ...satExamAlgebra4,
    ...satExamData1,
    ...satExamData2,
    ...satExamGeometry1,
    ...satExamGeometry2,
  ].map((spec) => examTopic("sat", spec)),
];
