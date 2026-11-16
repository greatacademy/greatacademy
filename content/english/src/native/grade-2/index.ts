// Grade 2: the content new to the grade 2 course, which also gathers topics of the phonics course and of grade 1.

import { emptyPack, type Pack } from "../../pack.ts";
import { courseGrade2 } from "./course.ts";
import { grammarTopics2 } from "./grammar.ts";
import { lexicon2 } from "./lexicon.ts";
import { readingUnits2 } from "./reading.ts";
import { readingTopics2, wordTopics2, writingTopics2 } from "./skills.ts";

/** grade2 is the content of the grade 2 course, with passages of 90 to 180 words. */
export const grade2: Pack = {
  ...emptyPack,
  topics: [...grammarTopics2, ...readingTopics2, ...wordTopics2, ...writingTopics2],
  courses: [courseGrade2],
  reading: readingUnits2,
  lexicon: lexicon2,
  passageWords: [90, 180],
};
