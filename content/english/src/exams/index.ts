// The exam courses: practice over topics already in the graph, in the formats of each exam. Their passages use the
// words of the levels they build on, and they teach no words of their own.

import type { Pack } from "../pack.ts";
import * as cambridgeFirst from "./cambridge-first.ts";
import * as gaokao from "./gaokao.ts";
import * as ielts from "./ielts.ts";
import * as toefl from "./toefl.ts";

const exams = [ielts, toefl, cambridgeFirst, gaokao];

/** pack is the content of the exam courses. */
export const pack: Pack = {
  topics: exams.flatMap((exam) => exam.topics),
  courses: exams.map((exam) => exam.course),
  reading: exams.flatMap((exam) => exam.reading),
  conversations: [],
  lexicon: [],
  vocabulary: [],
  passageWords: [100, 520],
};
