// The reading units of B1, one on each theme: articles, emails, opinions, narratives and reports in the words of
// Pre-A1 to B1.

import type { ReadingUnitDef } from "@ga/content";
import { readingEducation } from "./reading-education.ts";

/** reading are the reading units of B1, in the order of the units. */
export const reading: readonly ReadingUnitDef[] = [readingEducation];
