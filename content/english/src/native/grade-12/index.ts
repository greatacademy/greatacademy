// Grade 12: the content new to the grade 12 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade12 is the content of the grade 12 course, with passages of 300 to 600 words. */
export const grade12: Pack = { ...emptyPack, passageWords: [300, 600] };
