// The topics of the `core` shard: for now, all of English. See docs/architecture.md on why content is split.

import type { ReadingUnitDef, TopicDef } from "@ga/content";

import { clauseTopics } from "../topics/grammar-clauses.ts";
import { sentenceTopics } from "../topics/grammar-sentences.ts";
import { wordTopics } from "../topics/words.ts";
import { paragraphTopics } from "../topics/writing-paragraphs.ts";
import { sentenceWritingTopics } from "../topics/writing-sentences.ts";

/** coreShardTopics are the topics held by the `core` shard. */
export const coreShardTopics: readonly TopicDef[] = [
  ...sentenceTopics,
  ...clauseTopics,
  ...sentenceWritingTopics,
  ...paragraphTopics,
  ...wordTopics,
];

/** coreShardReading are the reading units held by the `core` shard: none until the course's passages are written. */
export const coreShardReading: readonly ReadingUnitDef[] = [];
