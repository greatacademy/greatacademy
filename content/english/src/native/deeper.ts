// The knowledge points added to grammar and writing topics of the grade courses after they were written, by topic id,
// so that most topics of grades 6 to 8 teach three steps; some of the topics they deepen live outside the grade packs.

import type { KnowledgePointDef } from "@ga/content";
import { deeper6 } from "./grade-6/grammar-c.ts";
import { deeper7 } from "./grade-7/grammar-c.ts";
import { deeper8 } from "./grade-8/grammar-c.ts";

/** deeperPoints are the knowledge points to append to topics, by topic id. */
export const deeperPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = { ...deeper6, ...deeper7, ...deeper8 };
