// Grade 5: the vocabulary topics of the grade, ten words to a batch, and the words they teach.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { batchTopicWithPool, wordPool } from "../batch.ts";
import { batchWords } from "./batches.ts";
import { batchesA } from "./words-a.ts";
import { batchesB } from "./words-b.ts";

const batches = [...batchesA, ...batchesB];
const pool = wordPool(batches);

/** batchTopics5 are the vocabulary batches of grade 5. */
export const batchTopics5: readonly TopicDef[] = batches.map((b) => batchTopicWithPool(b, pool));

/** vocabulary5 are the words the batches of grade 5 teach. */
export const vocabulary5: readonly WordBatch[] = batches.map(batchWords);
