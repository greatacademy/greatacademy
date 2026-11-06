// The drawings of the SAT and ACT explanations, given to the topics of the exam shard.

import type { Figure, TopicDef } from "@ga/content";
import { examActDrawings1 } from "./explanation-drawings-exam-act-1.ts";
import { examActDrawings2 } from "./explanation-drawings-exam-act-2.ts";
import { examActDrawings3 } from "./explanation-drawings-exam-act-3.ts";
import { examActDrawings4 } from "./explanation-drawings-exam-act-4.ts";
import { examActDrawings5 } from "./explanation-drawings-exam-act-5.ts";
import { examSatDrawings1 } from "./explanation-drawings-exam-sat-1.ts";
import { examSatDrawings2 } from "./explanation-drawings-exam-sat-2.ts";
import { examSatDrawings3 } from "./explanation-drawings-exam-sat-3.ts";
import { examSatDrawings4 } from "./explanation-drawings-exam-sat-4.ts";
import { examSatDrawings5 } from "./explanation-drawings-exam-sat-5.ts";

/** examDrawings is every drawing of an exam explanation, keyed by "topic#knowledge point". */
export const examDrawings: Readonly<Record<string, Figure>> = {
  ...examSatDrawings1,
  ...examSatDrawings2,
  ...examSatDrawings3,
  ...examSatDrawings4,
  ...examSatDrawings5,
  ...examActDrawings1,
  ...examActDrawings2,
  ...examActDrawings3,
  ...examActDrawings4,
  ...examActDrawings5,
};

/** withExamDrawings gives each knowledge point of the topics its drawing from examDrawings, leaving a figure it already has. */
export function withExamDrawings(topics: readonly TopicDef[]): readonly TopicDef[] {
  return topics.map((topic) => ({
    ...topic,
    knowledgePoints: topic.knowledgePoints.map((kp) => {
      const figure = examDrawings[`${topic.id}#${kp.id}`];
      return figure && !kp.figure ? { ...kp, figure } : kp;
    }),
  }));
}
