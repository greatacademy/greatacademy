// B2: the pack of the level, gathered from its files.

import type { Pack } from "../../pack.ts";
import { conversations } from "./conversations.ts";
import { courses } from "./course.ts";
import { topics as listening } from "./listening.ts";
import { reading } from "./reading.ts";
import { topics as speaking } from "./speaking.ts";
import { topics, vocabulary } from "./topics.ts";

/** pack is the content of B2. */
export const pack: Pack = {
  topics: [...topics, ...listening, ...speaking],
  courses,
  reading,
  conversations,
  lexicon: [],
  vocabulary,
  passageWords: [250, 450],
};
