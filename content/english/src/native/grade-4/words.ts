// Grade 4: the topics of the word batches, ten words to a batch, built from the lines of each unit's themes.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { batchTopicWithPool, batchWords, wordPool } from "../batch.ts";
import { batchSpec } from "./batches.ts";
import { earthBodyBatches } from "./words-earth-body.ts";
import { historyArtsBatches } from "./words-history-arts.ts";

const specs = [...earthBodyBatches, ...historyArtsBatches].map(batchSpec);
const pool = wordPool(specs);

/** batchTopics4 are the vocabulary topics of the word batches of grade 4. */
export const batchTopics4: readonly TopicDef[] = specs.map((s) => batchTopicWithPool(s, pool));

/** vocabulary4 are the words the batches of grade 4 teach. */
export const vocabulary4: readonly WordBatch[] = specs.map(batchWords);
