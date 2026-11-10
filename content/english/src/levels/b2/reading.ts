// The reading units of B2, one on each theme: articles, essays, histories, profiles and reports of 250 to 450 words
// in the words of Pre-A1 to B2.

import type { ReadingUnitDef } from "@ga/content";
import { readingEconomy } from "./reading-economy.ts";
import { readingSociety } from "./reading-society.ts";

/** reading are the reading units of B2, in the order of the units. */
export const reading: readonly ReadingUnitDef[] = [readingSociety, readingEconomy];
