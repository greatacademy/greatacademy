// Grade 11: the content new to the grade 11 course, which also gathers topics of the band course of grades 9 to 12.

import { emptyPack, type Pack } from "../../pack.ts";
import { conversations11 } from "./conversations.ts";
import { courseGrade11 } from "./course.ts";
import { grammarTopics11 } from "./grammar.ts";
import { lexicon11 } from "./lexicon.ts";
import { readingTopics11 } from "./reading.ts";
import { dreamsAndPromises } from "./reading-dreams.ts";
import { justiceAndProtest } from "./reading-justice.ts";
import { machinesAndMakers } from "./reading-machines.ts";
import { natureAndTheSelf } from "./reading-nature.ts";
import { betweenTwoWorlds } from "./reading-worlds.ts";
import { wordStudyTopics11 } from "./word-study.ts";
import { batchTopics11, vocabulary11 } from "./words.ts";
import { writingTopics11 } from "./writing.ts";
import { judgedTopics11a } from "./writing-judged-a.ts";
import { judgedTopics11b } from "./writing-judged-b.ts";

/** grade11 is the content of the grade 11 course, with passages of 300 to 600 words. */
export const grade11: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics11,
    ...wordStudyTopics11,
    ...grammarTopics11,
    ...readingTopics11,
    ...writingTopics11,
    ...judgedTopics11a,
    ...judgedTopics11b,
  ],
  reading: [dreamsAndPromises, natureAndTheSelf, justiceAndProtest, betweenTwoWorlds, machinesAndMakers],
  lexicon: lexicon11,
  courses: [courseGrade11],
  conversations: conversations11,
  vocabulary: vocabulary11,
  passageWords: [300, 600],
};
