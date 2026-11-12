// Grade 10: the vocabulary topics of the grade, ten words to a batch, and the words they teach.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { batchTopic, batchWords } from "../grade-5/batches.ts";
import { batchesA } from "./words-a.ts";
import { batchesB } from "./words-b.ts";
import { batchesC } from "./words-c.ts";

const batches = [...batchesA, ...batchesB, ...batchesC];

/** batchTopics10 are the vocabulary batches of grade 10. */
export const batchTopics10: readonly TopicDef[] = batches.map(batchTopic);

/** vocabulary10 are the words the batches of grade 10 teach. */
export const vocabulary10: readonly WordBatch[] = batches.map(batchWords);
