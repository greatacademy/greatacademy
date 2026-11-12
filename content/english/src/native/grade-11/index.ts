// Grade 11: the content new to the grade 11 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade11 is the content of the grade 11 course, with passages of 300 to 600 words. */
export const grade11: Pack = { ...emptyPack, passageWords: [300, 600] };
