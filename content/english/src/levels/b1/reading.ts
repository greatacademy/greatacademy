// The reading units of B1, one on each theme: articles, emails, opinions, narratives and reports in the words of
// Pre-A1 to B1.

import type { ReadingUnitDef } from "@ga/content";
import { readingArts } from "./reading-arts.ts";
import { readingCities } from "./reading-cities.ts";
import { readingCulture } from "./reading-culture.ts";
import { readingEducation } from "./reading-education.ts";
import { readingEnvironment } from "./reading-environment.ts";
import { readingHealth } from "./reading-health.ts";
import { readingMedia } from "./reading-media.ts";
import { readingMoney } from "./reading-money.ts";
import { readingRelationships } from "./reading-relationships.ts";
import { readingScience } from "./reading-science.ts";
import { readingTechnology } from "./reading-technology.ts";
import { readingWork } from "./reading-work.ts";

/** reading are the reading units of B1, in the order of the units. */
export const reading: readonly ReadingUnitDef[] = [
  readingEducation,
  readingWork,
  readingHealth,
  readingEnvironment,
  readingMedia,
  readingTechnology,
  readingCulture,
  readingRelationships,
  readingCities,
  readingScience,
  readingMoney,
  readingArts,
];
