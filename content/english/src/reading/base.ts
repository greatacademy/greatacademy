// The reading units of the first slice, which the native grades offer: those of the packs are listed by the packs.

import type { ReadingUnitDef } from "@ga/content";
import { howAnimalsSurvive } from "./animals.ts";
import { makingTheCase } from "./arguments.ts";
import { theHumanBody } from "./body.ts";
import { theWritersCraft } from "./craft.ts";
import { ourChangingEarth } from "./earth.ts";
import { lifeOnTheNile } from "./nile.ts";
import { howPlantsLive } from "./plants.ts";
import { voicesOfPersuasion } from "./speeches.ts";
import { storiesAndFables } from "./stories.ts";
import { talesAndPoems } from "./tales.ts";
import { waterOnEarth } from "./water.ts";
import { weatherAndClimate } from "./weather.ts";

/** baseReading are the reading units outside the packs, in their order. */
export const baseReading: readonly ReadingUnitDef[] = [
  waterOnEarth,
  howPlantsLive,
  lifeOnTheNile,
  weatherAndClimate,
  theHumanBody,
  ourChangingEarth,
  howAnimalsSurvive,
  storiesAndFables,
  talesAndPoems,
  makingTheCase,
  voicesOfPersuasion,
  theWritersCraft,
];
