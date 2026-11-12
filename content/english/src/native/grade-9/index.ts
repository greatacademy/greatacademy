import { emptyPack, type Pack } from "../../pack.ts";
import { conversations9 } from "./conversations.ts";
import { courseGrade9 } from "./course.ts";
import { grammarTopics9a } from "./grammar-a.ts";
import { grammarTopics9b } from "./grammar-b.ts";
import { lexicon9 } from "./lexicon.ts";
import { readingTopics9a } from "./reading-a.ts";
import { artAndItsSubjects } from "./reading-art.ts";
import { readingTopics9b } from "./reading-b.ts";
import { comingOfAge } from "./reading-coming.ts";
import { storiesFromManyCultures } from "./reading-cultures.ts";
import { foodHealthAndTheBody } from "./reading-health.ts";
import { heroesAndEpics } from "./reading-heroes.ts";
import { worldsOfTomorrow } from "./reading-tomorrow.ts";
import { wordStudyTopics9 } from "./word-study.ts";
import { batchTopics9, vocabulary9 } from "./words.ts";
import { writingTopics9a } from "./writing-a.ts";
import { writingTopics9b } from "./writing-b.ts";
import { judgedTopics9a } from "./writing-judged-a.ts";
import { judgedTopics9b } from "./writing-judged-b.ts";

/** grade9 is the content of the grade 9 course, with passages of 300 to 600 words. */
export const grade9: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics9,
    ...wordStudyTopics9,
    ...grammarTopics9a,
    ...grammarTopics9b,
    ...readingTopics9a,
    ...readingTopics9b,
    ...writingTopics9a,
    ...writingTopics9b,
    ...judgedTopics9a,
    ...judgedTopics9b,
  ],
  reading: [heroesAndEpics, comingOfAge, worldsOfTomorrow, foodHealthAndTheBody, storiesFromManyCultures, artAndItsSubjects],
  lexicon: lexicon9,
  courses: [courseGrade9],
  conversations: conversations9,
  vocabulary: vocabulary9,
  passageWords: [300, 600],
};
