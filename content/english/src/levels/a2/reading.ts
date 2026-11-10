// The reading units of A2, one on each theme: stories, emails, recipes and simple articles in the words of Pre-A1,
// A1 and A2.

import type { ReadingUnitDef } from "@ga/content";
import { readingAnimals } from "./reading-animals.ts";
import { readingCooking } from "./reading-cooking.ts";
import { readingFestivals } from "./reading-festivals.ts";
import { readingHealth } from "./reading-health.ts";
import { readingJobs } from "./reading-jobs.ts";
import { readingLastWeekend } from "./reading-last-weekend.ts";
import { readingMoney } from "./reading-money.ts";
import { readingNature } from "./reading-nature.ts";
import { readingNeighborhood } from "./reading-neighborhood.ts";
import { readingSports } from "./reading-sports.ts";
import { readingTechnology } from "./reading-technology.ts";
import { readingTravel } from "./reading-travel.ts";

/** reading are the reading units of A2, in the order of the units. */
export const reading: readonly ReadingUnitDef[] = [
  readingLastWeekend,
  readingHealth,
  readingNeighborhood,
  readingCooking,
  readingSports,
  readingAnimals,
  readingTravel,
  readingNature,
  readingMoney,
  readingTechnology,
  readingFestivals,
  readingJobs,
];
