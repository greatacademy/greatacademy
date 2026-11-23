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
import {
  planningTopics,
  revisingTopics,
  stageFiveSixLanguage,
  stageSevenNineLanguage,
  stageTenElevenLanguage,
  stageThreeFourLanguage,
} from "../language/index.ts";
import { readingAloudTopics } from "../oral/reading-aloud.ts";
import { stageSpeakingTopics } from "../oral/speaking-1-2.ts";
import { stageThreeFourSpeaking } from "../oral/speaking-3-4.ts";
import { stageFiveSixSpeaking } from "../oral/speaking-5-6.ts";
import { stageSevenNineSpeaking } from "../oral/speaking-7-9.ts";
import { stageTenElevenSpeaking } from "../oral/speaking-10-11.ts";
import { pinyinAlphabet } from "../pinyin/alphabet.ts";
import { pinyinTopics } from "../pinyin/index.ts";
import { heritageReading } from "../reading/heritage.ts";
import { chineseReading } from "../reading/index.ts";
import { stageReadingTopics } from "../reading/stage-1-2.ts";
import { stageThreeFourReading } from "../reading/stage-3-4.ts";
import { stageFiveSixReading } from "../reading/stage-5-6.ts";
import { stageSevenNineReading } from "../reading/stage-7-9.ts";
import { stageTenElevenReading } from "../reading/stage-10-11.ts";
import { recitationTopics } from "../recitation/index.ts";
import { componentTopics, strokeOrderTopics } from "../strokes/index.ts";
import { handwritingTopics } from "../strokes/writing.ts";
import { wordTopics } from "../words/index.ts";
import { earlyJudgedTopics } from "../writing/early-judged.ts";
import { earlySentenceTopics } from "../writing/early-sentences.ts";
import { writingTopics } from "../writing/index.ts";
import { laterWritingTopics } from "../writing/later.ts";
import { stageThreeFourJudged } from "../writing/stage-3-4.ts";
import { stageFiveSixJudged } from "../writing/stage-5-6.ts";
import { stageSevenNineJudged } from "../writing/stage-7-9.ts";
import { stageTenElevenJudged } from "../writing/stage-10-11.ts";

/** coreShardTopics are the topics of the core shard. */
export const coreShardTopics: readonly TopicDef[] = [
  ...pinyinTopics,
  pinyinAlphabet,
  ...strokeOrderTopics,
  ...componentTopics,
  ...characterTopics,
  ...dictionaryTopics,
  ...handwritingTopics,
  ...wordTopics,
  ...idiomTopics,
  ...grammarTopics,
  ...earlySentenceTopics.map((x) => x.topic),
  ...earlyJudgedTopics.map((x) => x.topic),
  ...writingTopics.map((x) => x.topic),
  ...laterWritingTopics.map((x) => x.topic),
  ...stageThreeFourJudged.map((x) => x.topic),
  ...stageFiveSixJudged.map((x) => x.topic),
  ...stageSevenNineJudged.map((x) => x.topic),
  ...stageTenElevenJudged.map((x) => x.topic),
  ...revisingTopics.map((x) => x.topic),
  ...planningTopics.map((x) => x.topic),
  ...stageThreeFourLanguage.map((x) => x.topic),
  ...stageFiveSixLanguage.map((x) => x.topic),
  ...stageSevenNineLanguage.map((x) => x.topic),
  ...stageTenElevenLanguage.map((x) => x.topic),
  ...recitationTopics,
  ...readingAloudTopics.map((x) => x.topic),
  ...stageReadingTopics.map((x) => x.topic),
  ...stageSpeakingTopics.map((x) => x.topic),
  ...stageThreeFourReading.map((x) => x.topic),
  ...stageThreeFourSpeaking.map((x) => x.topic),
  ...stageFiveSixReading.map((x) => x.topic),
  ...stageFiveSixSpeaking.map((x) => x.topic),
  ...stageSevenNineReading.map((x) => x.topic),
  ...stageSevenNineSpeaking.map((x) => x.topic),
  ...stageTenElevenReading.map((x) => x.topic),
  ...stageTenElevenSpeaking.map((x) => x.topic),
  ...bookTopics.map((x) => x.topic),
  ...classicalTopics,
  ...heritageTopics,
  ...traditionalTopics,
  ...gaokaoTopics,
];

/** coreShardReading are the reading units held by the `core` shard. */
export const coreShardReading: readonly ReadingUnitDef[] = [...chineseReading, ...heritageReading].map((r) => r.unit);
