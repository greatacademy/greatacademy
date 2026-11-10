// B2: the pack of the level, gathered from its files.

import type { Pack } from "../../pack.ts";
import { conversations } from "./conversations.ts";
import { courses } from "./course.ts";
import { reading } from "./reading.ts";
import { topics, vocabulary } from "./topics.ts";

/** pack is the content of B2. */
export const pack: Pack = {
  topics,
  courses,
  reading,
  conversations,
  lexicon: [],
  vocabulary,
  passageWords: [160, 320],
};
