import { emptyPack, type Pack } from "../../pack.ts";
import { conversations7 } from "./conversations.ts";
import { courseGrade7 } from "./course.ts";
import { grammarTopics7a } from "./grammar-a.ts";
import { grammarTopics7b } from "./grammar-b.ts";
import { lexicon7 } from "./lexicon.ts";
import { readingTopics7a } from "./reading-a.ts";
import { readingTopics7b } from "./reading-b.ts";
import { theInvisibleEnemy } from "./reading-disease.ts";
import { takingToTheAir } from "./reading-flight.ts";
import { tomorrowsWorlds } from "./reading-futures.ts";
import { whatMoneyDoes } from "./reading-money.ts";
import { aRebirthOfIdeas } from "./reading-renaissance.ts";
import { voicesForChange } from "./reading-rights.ts";
import { goldSaltAndBooks } from "./reading-sahel.ts";
import { wordStudyTopics7 } from "./word-study.ts";
import { batchTopics7, vocabulary7 } from "./words.ts";
import { writingTopics7a } from "./writing-a.ts";
import { writingTopics7b } from "./writing-b.ts";
import { writingJudgedTopics7a } from "./writing-judged-a.ts";
import { writingJudgedTopics7b } from "./writing-judged-b.ts";

/** grade7 is the content of the grade 7 course, with passages of 200 to 400 words. */
export const grade7: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics7,
    ...wordStudyTopics7,
    ...grammarTopics7a,
    ...grammarTopics7b,
    ...readingTopics7a,
    ...readingTopics7b,
    ...writingTopics7a,
    ...writingTopics7b,
    ...writingJudgedTopics7a,
    ...writingJudgedTopics7b,
  ],
  reading: [aRebirthOfIdeas, goldSaltAndBooks, theInvisibleEnemy, whatMoneyDoes, tomorrowsWorlds, voicesForChange, takingToTheAir],
  lexicon: lexicon7,
  courses: [courseGrade7],
  conversations: conversations7,
  vocabulary: vocabulary7,
  passageWords: [200, 400],
};
