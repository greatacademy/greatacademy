// The topics of Pre-A1: words, grammar and writing, by theme. See docs/english-courses/english-pre-a1.md.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import * as animals from "./animals.ts";
import * as body from "./body.ts";
import * as classroom from "./classroom.ts";
import * as family from "./family.ts";
import * as hello from "./hello.ts";
import * as numbersAndColors from "./numbers-and-colors.ts";

const units = [hello, numbersAndColors, family, classroom, animals, body];

/** topics are the topics of Pre-A1. */
export const topics: readonly TopicDef[] = units.flatMap((unit) => unit.topics);

/** vocabulary are the words that the vocabulary topics of Pre-A1 teach. */
export const vocabulary: readonly WordBatch[] = units.flatMap((unit) => unit.vocabulary);
