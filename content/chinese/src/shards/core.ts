// The topics of the `core` shard: the native grades, heritage, the Gaokao and the reading units. The levels of Chinese as
// a foreign language are in levels.ts and the HSK in hsk.ts. Its folder groups the subject's topics (docs/architecture.md §6.1).

import type { ReadingUnitDef, TopicDef } from "@ga/content";

import { bookTopics } from "../books/index.ts";
import { dictionaryTopics } from "../characters/dictionary.ts";
import { characterTopics } from "../characters/index.ts";
import { traditionalTopics } from "../characters/traditional.ts";
import { classicalTopics } from "../classical/index.ts";
import { gaokaoTopics } from "../gaokao/index.ts";
import { grammarTopics } from "../grammar/index.ts";
import { heritageTopics } from "../heritage/topics.ts";
import { idiomTopics } from "../idioms/index.ts";
import { readingAloudTopics } from "../oral/reading-aloud.ts";
import { pinyinTopics } from "../pinyin/index.ts";
import { heritageReading } from "../reading/heritage.ts";
import { chineseReading } from "../reading/index.ts";
import { recitationTopics } from "../recitation/index.ts";
import { componentTopics, strokeOrderTopics } from "../strokes/index.ts";
import { handwritingTopics } from "../strokes/writing.ts";
import { wordTopics } from "../words/index.ts";
import { earlySentenceTopics } from "../writing/early-sentences.ts";
import { writingTopics } from "../writing/index.ts";
import { laterWritingTopics } from "../writing/later.ts";

/** coreShardTopics are the topics of the core shard. */
export const coreShardTopics: readonly TopicDef[] = [
  ...pinyinTopics,
  ...strokeOrderTopics,
  ...componentTopics,
  ...characterTopics,
  ...dictionaryTopics,
  ...handwritingTopics,
  ...wordTopics,
  ...idiomTopics,
  ...grammarTopics,
  ...earlySentenceTopics.map((x) => x.topic),
  ...writingTopics.map((x) => x.topic),
  ...laterWritingTopics.map((x) => x.topic),
  ...recitationTopics,
  ...readingAloudTopics.map((x) => x.topic),
  ...bookTopics.map((x) => x.topic),
  ...classicalTopics,
  ...heritageTopics,
  ...traditionalTopics,
  ...gaokaoTopics,
];

/** coreShardReading are the reading units held by the `core` shard. */
export const coreShardReading: readonly ReadingUnitDef[] = [...chineseReading, ...heritageReading].map((r) => r.unit);
