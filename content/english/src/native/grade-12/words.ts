// Grade 12: the vocabulary topics of the grade, ten words to a batch, and the words they teach.

import type { TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { batchTopic, batchWords } from "../grade-5/batches.ts";
import { batchesA } from "./words-a.ts";
import { batchesB } from "./words-b.ts";
import { batchesC } from "./words-c.ts";
import { batchesD } from "./words-d.ts";
import { batchesE } from "./words-e.ts";
import { batchesF } from "./words-f.ts";
import { batchesG } from "./words-g.ts";
import { batchesH } from "./words-h.ts";

const batches = [...batchesA, ...batchesB, ...batchesC, ...batchesD, ...batchesE, ...batchesF, ...batchesG, ...batchesH];

/** batchTopics12 are the vocabulary batches of grade 12. */
export const batchTopics12: readonly TopicDef[] = batches.map(batchTopic);

/** vocabulary12 are the words the batches of grade 12 teach. */
export const vocabulary12: readonly WordBatch[] = batches.map(batchWords);
