// The reading units of B2, one on each theme: articles, essays, histories, profiles and reports of 250 to 450 words
// in the words of Pre-A1 to B2.

import type { ReadingUnitDef } from "@ga/content";
import { readingClimate } from "./reading-climate.ts";
import { readingCulture } from "./reading-culture.ts";
import { readingEconomy } from "./reading-economy.ts";
import { readingEducation } from "./reading-education.ts";
import { readingLaw } from "./reading-law.ts";
import { readingMedia } from "./reading-media.ts";
import { readingMedicine } from "./reading-medicine.ts";
import { readingMind } from "./reading-mind.ts";
import { readingSociety } from "./reading-society.ts";
import { readingTechnology } from "./reading-technology.ts";

/** reading are the reading units of B2, in the order of the units. */
export const reading: readonly ReadingUnitDef[] = [
  readingSociety,
  readingEconomy,
  readingMedicine,
  readingClimate,
  readingMedia,
  readingEducation,
  readingCulture,
  readingTechnology,
  readingLaw,
  readingMind,
];
