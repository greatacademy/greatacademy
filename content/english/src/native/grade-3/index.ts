// Grade 3: the content new to the grade 3 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade3 is the content of the grade 3 course, with passages of 140 to 260 words. */
export const grade3: Pack = { ...emptyPack, passageWords: [140, 260] };
