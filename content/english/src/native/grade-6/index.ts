import { emptyPack, type Pack } from "../../pack.ts";
import { conversations6 } from "./conversations.ts";
import { courseGrade6 } from "./course.ts";
import { grammarTopics6a } from "./grammar-a.ts";
import { grammarTopics6b } from "./grammar-b.ts";
import { lexicon6 } from "./lexicon.ts";
import { readingTopics6a } from "./reading-a.ts";
import { readingTopics6b } from "./reading-b.ts";
import { insideLivingThings } from "./reading-cells.ts";
import { theFirstCities } from "./reading-cities.ts";
import { theRestlessEarth } from "./reading-earth.ts";
import { feedingTheWorld } from "./reading-food.ts";
import { growingUp } from "./reading-growing.ts";
import { fairPlay } from "./reading-sport.ts";
import { wordStudyTopics6 } from "./word-study.ts";
import { batchTopics6, vocabulary6 } from "./words.ts";
import { writingTopics6a } from "./writing-a.ts";
import { writingTopics6b } from "./writing-b.ts";
import { writingJudgedTopics6a } from "./writing-judged-a.ts";
import { writingJudgedTopics6b } from "./writing-judged-b.ts";

/** grade6 is the content of the grade 6 course, with passages of 200 to 400 words. */
export const grade6: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics6,
    ...wordStudyTopics6,
    ...grammarTopics6a,
    ...grammarTopics6b,
    ...readingTopics6a,
    ...readingTopics6b,
    ...writingTopics6a,
    ...writingTopics6b,
    ...writingJudgedTopics6a,
    ...writingJudgedTopics6b,
  ],
  reading: [theFirstCities, theRestlessEarth, insideLivingThings, growingUp, feedingTheWorld, fairPlay],
  lexicon: lexicon6,
  courses: [courseGrade6],
  conversations: conversations6,
  vocabulary: vocabulary6,
  passageWords: [200, 400],
};
