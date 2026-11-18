// The grammar topics of level 3 (docs/chinese-curriculum.md §6, §8.4), after the grammar points of level 3 of GF 0025-2021:
// those of units 1 to 6 and those of units 7 to 12. Every sentence is written for the subject.

import type { LevelGrammar } from "../level-1/grammar.ts";
import { earlyGrammar } from "./grammar-early.ts";
import { lateGrammar } from "./grammar-late.ts";

/** grammar are the grammar topics of level 3, each in the unit whose theme uses it. */
export const grammar: readonly LevelGrammar[] = [...earlyGrammar, ...lateGrammar];
