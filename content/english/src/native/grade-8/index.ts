import { emptyPack, type Pack } from "../../pack.ts";
import { conversations8 } from "./conversations.ts";
import { courseGrade8 } from "./course.ts";
import { grammarTopics8a } from "./grammar-a.ts";
import { grammarTopics8b } from "./grammar-b.ts";
import { lexicon8 } from "./lexicon.ts";
import { readingTopics8a } from "./reading-a.ts";
import { readingTopics8b } from "./reading-b.ts";
import { talesOfDread } from "./reading-dread.ts";
import { theGlobeAndItsPlays } from "./reading-globe.ts";
import { smokeAndSteam } from "./reading-industry.ts";
import { journeysToANewHome } from "./reading-journeys.ts";
import { theStoryOfLife } from "./reading-life.ts";
import { theAgeOfRevolutions } from "./reading-revolutions.ts";
import { wordStudyTopics8 } from "./word-study.ts";
import { batchTopics8, vocabulary8 } from "./words.ts";
import { writingTopics8a } from "./writing-a.ts";
import { writingTopics8b } from "./writing-b.ts";
import { writingJudgedTopics8a } from "./writing-judged-a.ts";
import { writingJudgedTopics8b } from "./writing-judged-b.ts";

/** grade8 is the content of the grade 8 course, with passages of 200 to 400 words. */
export const grade8: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics8,
    ...wordStudyTopics8,
    ...grammarTopics8a,
    ...grammarTopics8b,
    ...readingTopics8a,
    ...readingTopics8b,
    ...writingTopics8a,
    ...writingTopics8b,
    ...writingJudgedTopics8a,
    ...writingJudgedTopics8b,
  ],
  reading: [theAgeOfRevolutions, smokeAndSteam, theStoryOfLife, talesOfDread, theGlobeAndItsPlays, journeysToANewHome],
  lexicon: lexicon8,
  courses: [courseGrade8],
  conversations: conversations8,
  vocabulary: vocabulary8,
  passageWords: [200, 400],
};
