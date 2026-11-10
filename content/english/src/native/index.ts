// The native courses by grade band, built from the topics of the skill courses and new ones by theme.

import type { Pack } from "../pack.ts";
import { conversations35 } from "./grades-3-5/conversations.ts";
import { course35 } from "./grades-3-5/course.ts";
import { grammarTopics35 } from "./grades-3-5/grammar.ts";
import { lexicon35 } from "./grades-3-5/lexicon.ts";
import { ourSolarSystem } from "./grades-3-5/reading.ts";
import { vocabulary35, wordTopics35 } from "./grades-3-5/words.ts";
import { writingTopics35 } from "./grades-3-5/writing.ts";

/** native is the content of the native courses. */
export const native: Pack = {
  topics: [...wordTopics35, ...grammarTopics35, ...writingTopics35],
  courses: [course35],
  reading: [ourSolarSystem],
  conversations: conversations35,
  lexicon: lexicon35,
  vocabulary: vocabulary35,
  passageWords: [140, 260],
};
