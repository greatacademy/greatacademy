// The topics of B2: words, grammar and writing, by theme. See docs/english-courses/english-b2.md.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import * as economy from "./economy.ts";
import * as science from "./science.ts";
import * as society from "./society.ts";

const units = [society, economy, science];

/** topics are the topics of B2. */
export const topics: readonly TopicDef[] = units.flatMap((unit) => unit.topics);

/** vocabulary are the words that the vocabulary topics of B2 teach. */
export const vocabulary: readonly WordBatch[] = units.flatMap((unit) => unit.vocabulary);
