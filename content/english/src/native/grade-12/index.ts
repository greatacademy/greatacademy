// Grade 12: the content new to the grade 12 course, which also gathers the last topics of the band course of grades 9 to 12.

import { emptyPack, type Pack } from "../../pack.ts";
import { conversations12 } from "./conversations.ts";
import { courseGrade12 } from "./course.ts";
import { grammarTopics12 } from "./grammar.ts";
import { lexicon12 } from "./lexicon.ts";
import { readingTopics12 } from "./reading.ts";
import { artAndItsCritics } from "./reading-art.ts";
import { questionsOfPhilosophy } from "./reading-philosophy.ts";
import { powerAndCorruption } from "./reading-power.ts";
import { riskAndResponsibility } from "./reading-risk.ts";
import { literatureAcrossLanguages } from "./reading-translation.ts";
import { wordStudyTopics12 } from "./word-study.ts";
import { batchTopics12, vocabulary12 } from "./words.ts";
import { writingTopics12 } from "./writing.ts";
import { judgedTopics12a } from "./writing-judged-a.ts";
import { judgedTopics12b } from "./writing-judged-b.ts";

/** grade12 is the content of the grade 12 course, with passages of 300 to 600 words. */
export const grade12: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics12,
    ...wordStudyTopics12,
    ...grammarTopics12,
    ...readingTopics12,
    ...writingTopics12,
    ...judgedTopics12a,
    ...judgedTopics12b,
  ],
  reading: [powerAndCorruption, questionsOfPhilosophy, artAndItsCritics, literatureAcrossLanguages, riskAndResponsibility],
  lexicon: lexicon12,
  courses: [courseGrade12],
  conversations: conversations12,
  vocabulary: vocabulary12,
  passageWords: [300, 600],
};
