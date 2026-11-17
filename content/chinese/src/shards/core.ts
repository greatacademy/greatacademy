// The topics of the `core` shard: for now, all of Chinese. See docs/architecture.md on why content is split.

import type { ReadingUnitDef, TopicDef } from "@ga/content";

import { characterTopics } from "../characters/index.ts";
import { grammarTopics } from "../grammar/index.ts";
import { idiomTopics } from "../idioms/index.ts";
import { chineseReading } from "../reading/index.ts";
import { recitationTopics } from "../recitation/index.ts";
import { wordTopics } from "../words/index.ts";

/** coreShardTopics are the topics of the core shard. */
export const coreShardTopics: readonly TopicDef[] = [
  ...characterTopics,
  ...wordTopics,
  ...idiomTopics,
  ...grammarTopics,
  ...recitationTopics,
];

/** coreShardReading are the reading units held by the `core` shard. */
export const coreShardReading: readonly ReadingUnitDef[] = chineseReading.map((r) => r.unit);
