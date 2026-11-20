// The topics of the `core` shard: for now, all of English. Its folder groups the subject's topics (docs/architecture.md §6.1).

import type { ReadingUnitDef, TopicDef } from "@ga/content";
import { withRecordings } from "../audio.ts";
import { withCovers } from "../illustrations.ts";
import { deeperPoints } from "../native/deeper.ts";
import { deepen } from "../native/grade-5/kit.ts";
import { inStrand } from "../pack.ts";
import { englishPacks } from "../packs.ts";
import { baseReading } from "../reading/base.ts";
import { argumentTopics } from "../topics/argument.ts";
import { clauseTopics } from "../topics/grammar-clauses.ts";
import { sentenceTopics } from "../topics/grammar-sentences.ts";
import { literaryAnalysisTopics } from "../topics/literary-analysis.ts";
import { literatureTopics } from "../topics/literature.ts";
import { mechanicsTopics } from "../topics/mechanics.ts";
import { informationalReadingTopics } from "../topics/reading-informational.ts";
import { thinkingReadingTopics } from "../topics/reading-thinking.ts";
import { rhetoricTopics } from "../topics/rhetoric.ts";
import { usageTopics } from "../topics/usage.ts";
import { wordTopics } from "../topics/words.ts";
import { academicWordTopics } from "../topics/words-academic.ts";
import { argumentEssayTopics } from "../topics/writing-argument-essay.ts";
import { judgedEssayTopics } from "../topics/writing-essays-judged.ts";
import { paragraphTopics } from "../topics/writing-paragraphs.ts";
import { judgedParagraphTopics } from "../topics/writing-paragraphs-judged.ts";
import { sentenceWritingTopics } from "../topics/writing-sentences.ts";
import { judgedSentenceTopics } from "../topics/writing-sentences-judged.ts";

/** writingByModel are the topics of reading files whose problems are writing judged by a model. */
const writingByModel = new Set(["writing-a-literary-analysis-paragraph", "writing-a-rhetorical-analysis", "synthesizing-sources"]);

/** skillTopics are the topics of the first slice, by skill, each in its strand. */
const skillTopics: readonly TopicDef[] = [
  ...inStrand("grammar", [...sentenceTopics, ...clauseTopics, ...usageTopics]),
  ...inStrand("writing", [
    ...sentenceWritingTopics,
    ...judgedSentenceTopics,
    ...paragraphTopics,
    ...judgedParagraphTopics,
    ...mechanicsTopics,
    ...judgedEssayTopics,
    ...argumentEssayTopics,
  ]),
  ...inStrand("vocabulary", [...wordTopics, ...academicWordTopics]),
  ...inStrand(
    "reading",
    [
      ...informationalReadingTopics,
      ...thinkingReadingTopics,
      ...literatureTopics,
      ...literaryAnalysisTopics,
      ...argumentTopics,
      ...rhetoricTopics,
    ].map((topic) => (writingByModel.has(topic.id) ? { ...topic, strand: "writing" } : topic)),
  ),
];

/** coreShardTopics are the topics held by the `core` shard: for now, all of English. */
export const coreShardTopics: readonly TopicDef[] = deepen([...skillTopics, ...englishPacks.flatMap((pack) => pack.topics)], deeperPoints);

/** coreShardReading are the reading units held by the `core` shard. */
export const coreShardReading: readonly ReadingUnitDef[] = withRecordings(
  withCovers([...baseReading, ...englishPacks.flatMap((pack) => pack.reading)]),
);
