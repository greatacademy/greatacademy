// The native courses by grade band, built from the topics of the skill courses and new ones by theme.

import { emptyPack, type Pack } from "../pack.ts";
import { conversationsCollege } from "./college/conversations.ts";
import { courseCollege } from "./college/course.ts";
import { grammarTopicsCollege } from "./college/grammar.ts";
import { lexiconCollege } from "./college/lexicon.ts";
import { abstractMoves } from "./college/reading-abstracts.ts";
import { academicProse } from "./college/reading-academic.ts";
import { theEthicsOfKnowledge } from "./college/reading-ethics.ts";
import { numbersInTheNews } from "./college/reading-numbers.ts";
import { insideAResearchPaper } from "./college/reading-paper.ts";
import { plansThatWorked } from "./college/reading-plans.ts";
import { researchInPractice } from "./college/reading-research.ts";
import { readingSkillTopicsCollege } from "./college/reading-skills.ts";
import { essaysOnWriting } from "./college/reading-style.ts";
import { writingAtWork } from "./college/reading-work.ts";
import { vocabularyCollege, wordTopicsCollege } from "./college/words.ts";
import { writingTopicsCollege } from "./college/writing.ts";
import { grade3 } from "./grade-3/index.ts";
import { grade4 } from "./grade-4/index.ts";
import { grade5 } from "./grade-5/index.ts";
import { grade6 } from "./grade-6/index.ts";
import { grade7 } from "./grade-7/index.ts";
import { grade8 } from "./grade-8/index.ts";
import { grade9 } from "./grade-9/index.ts";
import { grade10 } from "./grade-10/index.ts";
import { grade11 } from "./grade-11/index.ts";
import { grade12 } from "./grade-12/index.ts";
import { conversations35 } from "./grades-3-5/conversations.ts";
import { course35 } from "./grades-3-5/course.ts";
import { grammarTopics35 } from "./grades-3-5/grammar.ts";
import { lexicon35 } from "./grades-3-5/lexicon.ts";
import { ourSolarSystem } from "./grades-3-5/reading.ts";
import { vocabulary35, wordTopics35 } from "./grades-3-5/words.ts";
import { writingTopics35 } from "./grades-3-5/writing.ts";
import { conversations68 } from "./grades-6-8/conversations.ts";
import { course68 } from "./grades-6-8/course.ts";
import { grammarTopics68 } from "./grades-6-8/grammar.ts";
import { lexicon68 } from "./grades-6-8/lexicon.ts";
import { explorersAndVoyages } from "./grades-6-8/reading-explorers.ts";
import { machinesThatChangedTheWorld } from "./grades-6-8/reading-machines.ts";
import { mythsAndLegends } from "./grades-6-8/reading-myths.ts";
import { lifeInTheOcean } from "./grades-6-8/reading-ocean.ts";
import { ancientRome } from "./grades-6-8/reading-rome.ts";
import { readingSkillTopics68 } from "./grades-6-8/reading-skills.ts";
import { turningPoints } from "./grades-6-8/reading-turning-points.ts";
import { vocabulary68, wordTopics68 } from "./grades-6-8/words.ts";
import { writingTopics68 } from "./grades-6-8/writing.ts";
import { conversations912 } from "./grades-9-12/conversations.ts";
import { course912 } from "./grades-9-12/course.ts";
import { grammarTopics912 } from "./grades-9-12/grammar.ts";
import { lexicon912 } from "./grades-9-12/lexicon.ts";
import { aCenturyOfChange } from "./grades-9-12/reading-century.ts";
import { essaysOfExperience } from "./grades-9-12/reading-essays.ts";
import { rightsAndLaws } from "./grades-9-12/reading-law.ts";
import { poemsAcrossTime } from "./grades-9-12/reading-poems.ts";
import { scienceAndSociety } from "./grades-9-12/reading-science.ts";
import { readingSkillTopics912 } from "./grades-9-12/reading-skills.ts";
import { tragedyOnTheStage } from "./grades-9-12/reading-stage.ts";
import { vocabulary912, wordTopics912 } from "./grades-9-12/words.ts";
import { writingTopics912 } from "./grades-9-12/writing.ts";

/** grades35 is the content of the grades 3 to 5 course. */
const grades35: Pack = {
  topics: [...wordTopics35, ...grammarTopics35, ...writingTopics35],
  courses: [course35],
  reading: [ourSolarSystem],
  conversations: conversations35,
  lexicon: lexicon35,
  vocabulary: vocabulary35,
  passageWords: [140, 260],
};

/** grades68 is the content of the grades 6 to 8 course, with passages of 200 to 400 words. */
const grades68: Pack = {
  topics: [...wordTopics68, ...grammarTopics68, ...readingSkillTopics68, ...writingTopics68],
  courses: [course68],
  reading: [mythsAndLegends, ancientRome, lifeInTheOcean, turningPoints, machinesThatChangedTheWorld, explorersAndVoyages],
  conversations: conversations68,
  lexicon: lexicon68,
  vocabulary: vocabulary68,
  passageWords: [200, 400],
};

/** grades912 is the content of the grades 9 to 12 course, with passages of 300 to 600 words. */
const grades912: Pack = {
  topics: [...wordTopics912, ...grammarTopics912, ...readingSkillTopics912, ...writingTopics912],
  courses: [course912],
  reading: [tragedyOnTheStage, essaysOfExperience, poemsAcrossTime, aCenturyOfChange, scienceAndSociety, rightsAndLaws],
  conversations: conversations912,
  lexicon: lexicon912,
  vocabulary: vocabulary912,
  passageWords: [300, 600],
};

/** college is the content of the college writing course, with passages of 500 to 900 words. */
const college: Pack = {
  ...emptyPack,
  topics: [...wordTopicsCollege, ...grammarTopicsCollege, ...readingSkillTopicsCollege, abstractMoves, ...writingTopicsCollege],
  courses: [courseCollege],
  reading: [
    academicProse,
    researchInPractice,
    theEthicsOfKnowledge,
    insideAResearchPaper,
    essaysOnWriting,
    numbersInTheNews,
    writingAtWork,
    plansThatWorked,
  ],
  conversations: conversationsCollege,
  lexicon: lexiconCollege,
  vocabulary: vocabularyCollege,
  passageWords: [500, 900],
};

/** nativePacks are the native courses by grade band, one pack each, so that each band has its own passage lengths. */
export const nativePacks: readonly Pack[] = [
  grades35,
  grade3,
  grade4,
  grade5,
  grades68,
  grade6,
  grade7,
  grade8,
  grades912,
  grade9,
  grade10,
  grade11,
  grade12,
  college,
];
