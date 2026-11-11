// Grade 4: the content new to the grade 4 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";
import { conversations4 } from "./conversations.ts";
import { courseGrade4 } from "./course.ts";
import { spellingTopics4 } from "./grammar-spelling.ts";
import { usageTopics4 } from "./grammar-usage.ts";
import { verbTopics4 } from "./grammar-verbs.ts";
import { reportLetterTopics4 } from "./judged-report-letter.ts";
import { scriptBioTopics4 } from "./judged-script-bio.ts";
import { taleArtTopics4 } from "./judged-tale-art.ts";
import { lexicon4 } from "./lexicon.ts";
import { artUnit, livesUnit, playsUnit } from "./reading-arts-lives.ts";
import { historyTopics4 } from "./reading-history.ts";
import { infoTopics4 } from "./reading-info.ts";
import { playTopics4 } from "./reading-plays.ts";
import { biomesUnit, energyUnit } from "./reading-science.ts";
import { taleTopics4 } from "./reading-tales.ts";
import { middleAgesUnit, silkRoadUnit, talesUnit } from "./reading-tales-history.ts";
import { wordStudyTopics4 } from "./word-study.ts";
import { batchTopics4, vocabulary4 } from "./words.ts";
import { craftWritingTopics4 } from "./writing-craft.ts";
import { infoWritingTopics4 } from "./writing-info.ts";

/** grade4 is the content of the grade 4 course, with passages of 140 to 260 words. */
export const grade4: Pack = {
  ...emptyPack,
  topics: [
    ...batchTopics4,
    ...verbTopics4,
    ...spellingTopics4,
    ...usageTopics4,
    ...wordStudyTopics4,
    ...infoTopics4,
    ...taleTopics4,
    ...historyTopics4,
    ...playTopics4,
    ...infoWritingTopics4,
    ...craftWritingTopics4,
    ...reportLetterTopics4,
    ...taleArtTopics4,
    ...scriptBioTopics4,
  ],
  reading: [biomesUnit, energyUnit, talesUnit, middleAgesUnit, silkRoadUnit, artUnit, playsUnit, livesUnit],
  vocabulary: vocabulary4,
  lexicon: lexicon4,
  courses: [courseGrade4],
  conversations: conversations4,
  passageWords: [140, 260],
};
