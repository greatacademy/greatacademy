// Grade 1: the content new to the grade 1 course, which also gathers the topics of the phonics course.

import { emptyPack, type Pack } from "../../pack.ts";
import { courseGrade1 } from "./course.ts";
import { grammarTopics1 } from "./grammar.ts";
import { lexicon1 } from "./lexicon.ts";
import { readingUnits1 } from "./reading.ts";
import { readingTopics1, writingTopics1 } from "./skills.ts";

/** grade1 is the content of the grade 1 course, with passages of 60 to 130 words. */
export const grade1: Pack = {
  ...emptyPack,
  topics: [...grammarTopics1, ...readingTopics1, ...writingTopics1],
  courses: [courseGrade1],
  reading: readingUnits1,
  lexicon: lexicon1,
  passageWords: [60, 130],
};
