// Grade 11: the vocabulary topics of the grade, ten words to a batch, and the words they teach.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { batchTopic, batchWords } from "../grade-5/batches.ts";
import { batchesA } from "./words-a.ts";
import { batchesB } from "./words-b.ts";
import { batchesC } from "./words-c.ts";
import { batchesD } from "./words-d.ts";

const batches = [...batchesA, ...batchesB, ...batchesC, ...batchesD];

/** batchTopics11 are the vocabulary batches of grade 11. */
export const batchTopics11: readonly TopicDef[] = batches.map(batchTopic);

/** vocabulary11 are the words the batches of grade 11 teach. */
export const vocabulary11: readonly WordBatch[] = batches.map(batchWords);
