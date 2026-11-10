// The native courses by grade band, built from the topics of the skill courses and new ones by theme.

import { emptyPack, type Pack } from "../pack.ts";
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
const grades912: Pack = { ...emptyPack, passageWords: [300, 600] };

/** college is the content of the college writing course, with passages of 500 to 900 words. */
const college: Pack = { ...emptyPack, passageWords: [500, 900] };

/** nativePacks are the native courses by grade band, one pack each, so that each band has its own passage lengths. */
export const nativePacks: readonly Pack[] = [grades35, grades68, grades912, college];
