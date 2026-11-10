// The words the passages of B2 may use: those of the vocabulary batches of Pre-A1, A1, A2, B1 and B2.

import type { WordBatch } from "../../pack.ts";
import { vocabulary as a1 } from "../a1/topics.ts";
import { vocabulary as a2 } from "../a2/topics.ts";
import { vocabulary as b1 } from "../b1/topics.ts";
import { vocabulary as preA1 } from "../pre-a1/topics.ts";
import { vocabulary as b2 } from "./topics.ts";

/** readingWords are the batches whose words the passages of B2 may use. */
export const readingWords: readonly WordBatch[] = [...preA1, ...a1, ...a2, ...b1, ...b2];
