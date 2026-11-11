// Grade 5: the content new to the grade 5 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade5 is the content of the grade 5 course, with passages of 140 to 260 words. */
export const grade5: Pack = { ...emptyPack, passageWords: [140, 260] };
