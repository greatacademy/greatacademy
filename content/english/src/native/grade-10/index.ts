// Grade 10: the content new to the grade 10 course, which also gathers topics of the band course of grades 9 to 12.

import { emptyPack, type Pack } from "../../pack.ts";
import { conversations10 } from "./conversations.ts";
import { courseGrade10 } from "./course.ts";
import { grammarTopics10a } from "./grammar-a.ts";
import { grammarTopics10b } from "./grammar-b.ts";
import { lexicon10 } from "./lexicon.ts";
import { readingTopics10a } from "./reading-a.ts";
import { ambitionAndPower } from "./reading-ambition.ts";
import { readingTopics10b } from "./reading-b.ts";
import { mediaAndTruth } from "./reading-media.ts";
import { moneyAndWork } from "./reading-money.ts";
import { theNaturalWorld } from "./reading-nature.ts";
import { satireAndHumor } from "./reading-satire.ts";
import { warAndMemory } from "./reading-war.ts";
import { wordStudyTopics10 } from "./word-study.ts";
import { batchTopics10, vocabulary10 } from "./words.ts";
import { writingTopics10 } from "./writing.ts";
import { judgedTopics10a } from "./writing-judged-a.ts";
import { judgedTopics10b } from "./writing-judged-b.ts";

/** grade10 is the content of the grade 10 course, with passages of 300 to 600 words. */
export const grade10: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics10,
    ...wordStudyTopics10,
    ...grammarTopics10a,
    ...grammarTopics10b,
    ...readingTopics10a,
    ...readingTopics10b,
    ...writingTopics10,
    ...judgedTopics10a,
    ...judgedTopics10b,
  ],
  reading: [ambitionAndPower, warAndMemory, theNaturalWorld, mediaAndTruth, moneyAndWork, satireAndHumor],
  lexicon: lexicon10,
  courses: [courseGrade10],
  conversations: conversations10,
  vocabulary: vocabulary10,
  passageWords: [300, 600],
};
