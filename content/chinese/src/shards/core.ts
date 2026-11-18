// The topics of the `core` shard: for now, all of Chinese. See docs/architecture.md on why content is split.

import type { ReadingUnitDef, TopicDef } from "@ga/content";

import { characterTopics } from "../characters/index.ts";
import { classicalTopics } from "../classical/index.ts";
import { gaokaoTopics } from "../gaokao/index.ts";
import { grammarTopics } from "../grammar/index.ts";
import { heritageTopics } from "../heritage/topics.ts";
import { hskTopics } from "../hsk/index.ts";
import { idiomTopics } from "../idioms/index.ts";
import { levelOneTopics } from "../level-1/index.ts";
import { levelTwoTopics } from "../level-2/index.ts";
import { levelThreeTopics } from "../level-3/index.ts";
import { levelFourTopics } from "../level-4/index.ts";
import { levelFiveTopics } from "../level-5/index.ts";
import { levelSixTopics } from "../level-6/index.ts";
import { levelSevenTopics } from "../level-7/index.ts";
import { levelEightTopics } from "../level-8/index.ts";
import { levelNineTopics } from "../level-9/index.ts";
import { pinyinTopics } from "../pinyin/index.ts";
import { heritageReading } from "../reading/heritage.ts";
import { chineseReading } from "../reading/index.ts";
import { recitationTopics } from "../recitation/index.ts";
import { componentTopics, strokeOrderTopics } from "../strokes/index.ts";
import { wordTopics } from "../words/index.ts";

/** coreShardTopics are the topics of the core shard. */
export const coreShardTopics: readonly TopicDef[] = [
  ...pinyinTopics,
  ...strokeOrderTopics,
  ...componentTopics,
  ...characterTopics,
  ...wordTopics,
  ...idiomTopics,
  ...grammarTopics,
  ...recitationTopics,
  ...classicalTopics,
  ...heritageTopics,
  ...levelOneTopics,
  ...levelTwoTopics,
  ...levelThreeTopics,
  ...levelFourTopics,
  ...levelFiveTopics,
  ...levelSixTopics,
  ...levelSevenTopics,
  ...levelEightTopics,
  ...levelNineTopics,
  ...hskTopics,
  ...gaokaoTopics,
];

/** coreShardReading are the reading units held by the `core` shard. */
export const coreShardReading: readonly ReadingUnitDef[] = [...chineseReading, ...heritageReading].map((r) => r.unit);
