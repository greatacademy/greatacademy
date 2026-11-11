// Grade 5: the content new to the grade 5 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";
import { conversations5 } from "./conversations.ts";
import { courseGrade5 } from "./course.ts";
import { grammarTopics5a } from "./grammar.ts";
import { grammarTopics5b } from "./grammar-2.ts";
import { lexicon5 } from "./lexicon.ts";
import { readingTopics5a } from "./reading-a.ts";
import { theMayaAztecAndInca } from "./reading-americas.ts";
import { readingTopics5b } from "./reading-b.ts";
import { bridgesTowersAndDomes } from "./reading-bridges.ts";
import { ancientGreece } from "./reading-greece.ts";
import { lettersAndDiariesFromThePast } from "./reading-letters.ts";
import { matterAndItsChanges } from "./reading-matter.ts";
import { theWorldUnderAMicroscope } from "./reading-microscope.ts";
import { mysteriesAndDetectives } from "./reading-mysteries.ts";
import { storiesOfSurvival } from "./reading-survival.ts";
import { wordStudyTopics5 } from "./word-study.ts";
import { batchTopics5, vocabulary5 } from "./words.ts";
import { writingTopics5 } from "./writing.ts";
import { judgedTopics5a } from "./writing-judged-a.ts";
import { judgedTopics5b } from "./writing-judged-b.ts";

/** grade5 is the content of the grade 5 course, with passages of 140 to 260 words. */
export const grade5: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics5,
    ...wordStudyTopics5,
    ...grammarTopics5a,
    ...grammarTopics5b,
    ...readingTopics5a,
    ...readingTopics5b,
    ...writingTopics5,
    ...judgedTopics5a,
    ...judgedTopics5b,
  ],
  reading: [
    matterAndItsChanges,
    theWorldUnderAMicroscope,
    ancientGreece,
    theMayaAztecAndInca,
    bridgesTowersAndDomes,
    mysteriesAndDetectives,
    storiesOfSurvival,
    lettersAndDiariesFromThePast,
  ],
  lexicon: lexicon5,
  courses: [courseGrade5],
  conversations: conversations5,
  vocabulary: vocabulary5,
  passageWords: [140, 260],
};
