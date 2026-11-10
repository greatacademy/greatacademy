// The words the passages of A2 may use: those of the vocabulary batches of Pre-A1, A1 and A2.

import type { WordBatch } from "../../pack.ts";
import { vocabulary as a1 } from "../a1/topics.ts";
import { vocabulary as preA1 } from "../pre-a1/topics.ts";
import { vocabulary as a2 } from "./topics.ts";

/** readingWords are the batches whose words the passages of A2 may use. */
export const readingWords: readonly WordBatch[] = [...preA1, ...a1, ...a2];
