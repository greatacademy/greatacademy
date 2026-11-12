// Grade 10: the content new to the grade 10 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade10 is the content of the grade 10 course, with passages of 300 to 600 words. */
export const grade10: Pack = { ...emptyPack, passageWords: [300, 600] };
