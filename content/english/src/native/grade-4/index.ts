// Grade 4: the content new to the grade 4 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade4 is the content of the grade 4 course, with passages of 140 to 260 words. */
export const grade4: Pack = { ...emptyPack, passageWords: [140, 260] };
