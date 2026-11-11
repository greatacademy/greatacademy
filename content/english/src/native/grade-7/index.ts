// Grade 7: the content new to the grade 7 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade7 is the content of the grade 7 course, with passages of 200 to 400 words. */
export const grade7: Pack = { ...emptyPack, passageWords: [200, 400] };
