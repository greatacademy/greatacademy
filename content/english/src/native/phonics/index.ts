// Phonics: the content of the phonics course of kindergarten to grade 2.

import { emptyPack, inStrand, type Pack } from "../../pack.ts";
import { blendTopics } from "./blends.ts";
import { coursePhonics } from "./course.ts";
import { digraphTopics } from "./digraphs.ts";
import { letterTopics } from "./letters.ts";
import { shortVowelTopics } from "./short-vowels.ts";
import { silentETopics } from "./silent-e.ts";
import { vowelTeamTopics } from "./vowel-teams.ts";

const reading = [
  ...shortVowelTopics.slice(0, 1),
  ...digraphTopics.slice(0, 1),
  ...blendTopics.slice(0, 1),
  ...silentETopics.slice(0, 1),
  ...vowelTeamTopics.slice(0, 1),
];
const spelling = [
  ...shortVowelTopics.slice(1),
  ...digraphTopics.slice(1),
  ...blendTopics.slice(1),
  ...silentETopics.slice(1),
  ...vowelTeamTopics.slice(1),
];

/** phonics is the content of the phonics course. */
export const phonics: Pack = {
  ...emptyPack,
  topics: [...inStrand("reading", [...letterTopics, ...reading]), ...inStrand("writing", spelling)],
  courses: [coursePhonics],
};
