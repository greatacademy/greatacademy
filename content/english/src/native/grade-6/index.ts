// Grade 6: the content new to the grade 6 course, which also gathers topics of the band course and the skill courses.

import { emptyPack, type Pack } from "../../pack.ts";

/** grade6 is the content of the grade 6 course, with passages of 200 to 400 words. */
export const grade6: Pack = { ...emptyPack, passageWords: [200, 400] };
