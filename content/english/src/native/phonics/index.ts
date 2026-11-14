// Phonics: the content of the phonics course of kindergarten to grade 2.

import { emptyPack, inStrand, type Pack } from "../../pack.ts";
import { coursePhonics } from "./course.ts";
import { letterTopics } from "./letters.ts";
import { shortVowelTopics } from "./short-vowels.ts";

const [reading, spelling] = [shortVowelTopics.slice(0, 1), shortVowelTopics.slice(1)];

/** phonics is the content of the phonics course. */
export const phonics: Pack = {
  ...emptyPack,
  topics: [...inStrand("reading", [...letterTopics, ...reading]), ...inStrand("writing", spelling)],
  courses: [coursePhonics],
};
