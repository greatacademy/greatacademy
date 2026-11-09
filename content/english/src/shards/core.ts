// The topics of the `core` shard: for now, all of English. See docs/architecture.md on why content is split.

import type { ReadingUnitDef, TopicDef } from "@ga/content";
import { theHumanBody } from "../reading/body.ts";
import { ourChangingEarth } from "../reading/earth.ts";
import { lifeOnTheNile } from "../reading/nile.ts";
import { howPlantsLive } from "../reading/plants.ts";
import { waterOnEarth } from "../reading/water.ts";
import { weatherAndClimate } from "../reading/weather.ts";
import { argumentTopics } from "../topics/argument.ts";
import { clauseTopics } from "../topics/grammar-clauses.ts";
import { sentenceTopics } from "../topics/grammar-sentences.ts";
import { literatureTopics } from "../topics/literature.ts";
import { mechanicsTopics } from "../topics/mechanics.ts";
import { informationalReadingTopics } from "../topics/reading-informational.ts";
import { thinkingReadingTopics } from "../topics/reading-thinking.ts";
import { usageTopics } from "../topics/usage.ts";
import { wordTopics } from "../topics/words.ts";
import { academicWordTopics } from "../topics/words-academic.ts";
import { paragraphTopics } from "../topics/writing-paragraphs.ts";
import { sentenceWritingTopics } from "../topics/writing-sentences.ts";

/** coreShardTopics are the topics held by the `core` shard. */
export const coreShardTopics: readonly TopicDef[] = [
  ...sentenceTopics,
  ...clauseTopics,
  ...sentenceWritingTopics,
  ...paragraphTopics,
  ...wordTopics,
  ...usageTopics,
  ...mechanicsTopics,
  ...academicWordTopics,
  ...informationalReadingTopics,
  ...thinkingReadingTopics,
  ...literatureTopics,
  ...argumentTopics,
];

/** coreShardReading are the reading units held by the `core` shard. */
export const coreShardReading: readonly ReadingUnitDef[] = [
  waterOnEarth,
  howPlantsLive,
  lifeOnTheNile,
  weatherAndClimate,
  theHumanBody,
  ourChangingEarth,
];
