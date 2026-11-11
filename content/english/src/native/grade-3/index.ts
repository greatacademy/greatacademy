// Grade 3: the content new to the grade 3 course, which also gathers topics of the band course and the skill courses.

import { inStrand, type Pack } from "../../pack.ts";
import { batchesOf } from "./batches.ts";
import { grade3Conversations } from "./conversations.ts";
import { courseGrade3 } from "./course.ts";
import { grammarTopics } from "./grammar.ts";
import { lexicon3 } from "./lexicon.ts";
import { factTopics } from "./reading-facts.ts";
import { pushesPullsAndMagnets } from "./reading-forces.ts";
import { ourWorldOnAMap } from "./reading-maps.ts";
import { theWorldOfMusic } from "./reading-music.ts";
import { poemTopics } from "./reading-poems.ts";
import { poemsForAllSeasons } from "./reading-seasons.ts";
import { sequenceTopics } from "./reading-sequence.ts";
import { storyTopics } from "./reading-stories.ts";
import { taleTopics } from "./reading-tales.ts";
import { alongTheYellowRiver } from "./reading-yellow-river.ts";
import { wordStudyTopics } from "./word-study.ts";
import { batchesA } from "./words.ts";
import { batchesB } from "./words-2.ts";
import { writingRuleTopics } from "./writing.ts";
import { writingJudgedTopics } from "./writing-judged.ts";
import { writingStoryTopics } from "./writing-stories.ts";

const batches = batchesOf([...batchesA, ...batchesB]);

/** grade3 is the content of the grade 3 course, with passages of 140 to 260 words. */
export const grade3: Pack = {
  topics: [
    ...inStrand("vocabulary", [...batches.topics, ...wordStudyTopics]),
    ...inStrand("grammar", grammarTopics),
    ...inStrand("reading", [...storyTopics, ...taleTopics, ...poemTopics, ...factTopics, ...sequenceTopics]),
    ...inStrand("writing", [...writingRuleTopics, ...writingStoryTopics, ...writingJudgedTopics]),
  ],
  courses: [courseGrade3],
  reading: [ourWorldOnAMap, alongTheYellowRiver, pushesPullsAndMagnets, theWorldOfMusic, poemsForAllSeasons],
  conversations: grade3Conversations,
  lexicon: lexicon3,
  vocabulary: batches.words,
  passageWords: [140, 260],
};
