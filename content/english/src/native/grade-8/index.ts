// Grade 8: the content new to the grade 8 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade8 is the content of the grade 8 course, with passages of 200 to 400 words. */
export const grade8: Pack = { ...emptyPack, passageWords: [200, 400] };
