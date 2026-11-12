// Grade 7: the vocabulary topics of the grade, ten words to a batch, and the words they teach.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { batchTopic, batchWords } from "../grade-5/batches.ts";
import { batchesA } from "./words-a.ts";
import { batchesB } from "./words-b.ts";

const batches = [...batchesA, ...batchesB];

/** batchTopics7 are the vocabulary batches of grade 7. */
export const batchTopics7: readonly TopicDef[] = batches.map(batchTopic);

/** vocabulary7 are the words the batches of grade 7 teach. */
export const vocabulary7: readonly WordBatch[] = batches.map(batchWords);
