// The topics of the `core` shard: for now, all of English. See docs/architecture.md on why content is split.

import type { ReadingUnitDef, TopicDef } from "@ga/content";
import { inStrand } from "../pack.ts";
import { englishPacks } from "../packs.ts";
import { howAnimalsSurvive } from "../reading/animals.ts";
import { makingTheCase } from "../reading/arguments.ts";
import { theHumanBody } from "../reading/body.ts";
import { theWritersCraft } from "../reading/craft.ts";
import { ourChangingEarth } from "../reading/earth.ts";
import { lifeOnTheNile } from "../reading/nile.ts";
import { howPlantsLive } from "../reading/plants.ts";
import { voicesOfPersuasion } from "../reading/speeches.ts";
import { storiesAndFables } from "../reading/stories.ts";
import { talesAndPoems } from "../reading/tales.ts";
import { waterOnEarth } from "../reading/water.ts";
import { weatherAndClimate } from "../reading/weather.ts";
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
import { judgedEssayTopics } from "../topics/writing-essays-judged.ts";
import { paragraphTopics } from "../topics/writing-paragraphs.ts";
import { judgedParagraphTopics } from "../topics/writing-paragraphs-judged.ts";
import { sentenceWritingTopics } from "../topics/writing-sentences.ts";
import { judgedSentenceTopics } from "../topics/writing-sentences-judged.ts";

/** writingByModel are the topics of reading files whose problems are writing judged by a model. */
const writingByModel = new Set(["writing-a-literary-analysis-paragraph", "writing-a-rhetorical-analysis", "synthesizing-sources"]);

/** skillTopics are the topics of the skill courses, each in its strand. */
const skillTopics: readonly TopicDef[] = [
  ...inStrand("grammar", [...sentenceTopics, ...clauseTopics, ...usageTopics]),
  ...inStrand("writing", [
    ...sentenceWritingTopics,
    ...judgedSentenceTopics,
    ...paragraphTopics,
    ...judgedParagraphTopics,
    ...mechanicsTopics,
    ...judgedEssayTopics,
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
export const coreShardTopics: readonly TopicDef[] = [...skillTopics, ...englishPacks.flatMap((pack) => pack.topics)];

/** coreShardReading are the reading units held by the `core` shard. */
export const coreShardReading: readonly ReadingUnitDef[] = [
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
  ...englishPacks.flatMap((pack) => pack.reading),
];
