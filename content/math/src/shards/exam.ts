// The topics of the `exam` shard: SAT and ACT preparation. See docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";

import { withExamDrawings } from "../explanation-drawings-exam.ts";
import { finishTopics } from "../finish.ts";
import { actFundamentalsAlgebraTopics } from "../topics/act-fundamentals-algebra.ts";
import { actFundamentalsChanceConicsTopics } from "../topics/act-fundamentals-chance-conics.ts";
import { actFundamentalsFigureUnitTopics } from "../topics/act-fundamentals-figures-units.ts";
import { actFundamentalsFunctionTopics } from "../topics/act-fundamentals-functions.ts";
import { actFundamentalsGeometryTopics } from "../topics/act-fundamentals-geometry.ts";
import { actFundamentalsModelingTopics } from "../topics/act-fundamentals-modeling.ts";
import { actFundamentalsNumberTopics } from "../topics/act-fundamentals-number.ts";
import { actFundamentalsReasoningAlgebraTopics } from "../topics/act-fundamentals-reasoning-algebra.ts";
import { actFundamentalsReasoningDataTopics } from "../topics/act-fundamentals-reasoning-data.ts";
import { actFundamentalsReasoningGeometryTopics } from "../topics/act-fundamentals-reasoning-geometry.ts";
import { actGeometryDataTopics } from "../topics/act-geometry-data.ts";
import { actNumberAlgebraTopics } from "../topics/act-number-algebra.ts";
import { deeperExamThirdPoints } from "../topics/deeper-exam-college-third.ts";
import { deeperExamFundamentalsThirdPoints } from "../topics/deeper-exam-fundamentals-third.ts";
import { deeperExamFundamentalsThird2Points } from "../topics/deeper-exam-fundamentals-third-2.ts";
import { deeperRemainingExamThirdPoints } from "../topics/deeper-remaining-third.ts";
import { examTopics } from "../topics/exam-topics.ts";
import { outlineGapTopics } from "../topics/outline-gaps.ts";
import { satFundamentalsAdvancedTopics } from "../topics/sat-fundamentals-advanced.ts";
import { satFundamentalsAlgebraTopics } from "../topics/sat-fundamentals-algebra.ts";
import { satFundamentalsDataTopics } from "../topics/sat-fundamentals-data.ts";
import { satFundamentalsGeometryTopics } from "../topics/sat-fundamentals-geometry.ts";
import { satMathStrategyTopics } from "../topics/sat-math-strategies.ts";
import { satPrepAdvancedTopics } from "../topics/sat-prep-advanced.ts";
import { satPrepAlgebraTopics } from "../topics/sat-prep-algebra.ts";
import { satPrepDataTopics } from "../topics/sat-prep-data.ts";

/** examShardTopics are the finished topics of the `exam` shard. */
export const examShardTopics: readonly TopicDef[] = withExamDrawings(
  finishTopics(
    [
      ...satFundamentalsAlgebraTopics,
      ...satFundamentalsGeometryTopics,
      ...satFundamentalsAdvancedTopics,
      ...satFundamentalsDataTopics,
      ...satPrepAlgebraTopics,
      ...satPrepAdvancedTopics,
      ...satPrepDataTopics,
      ...actNumberAlgebraTopics,
      ...actFundamentalsNumberTopics,
      ...actFundamentalsAlgebraTopics,
      ...actFundamentalsFunctionTopics,
      ...actFundamentalsGeometryTopics,
      ...actFundamentalsModelingTopics,
      ...actFundamentalsChanceConicsTopics,
      ...actFundamentalsFigureUnitTopics,
      ...actFundamentalsReasoningAlgebraTopics,
      ...actFundamentalsReasoningGeometryTopics,
      ...actFundamentalsReasoningDataTopics,
      ...outlineGapTopics,
      ...actGeometryDataTopics,
      ...satMathStrategyTopics,
      ...examTopics,
    ],
    [deeperExamThirdPoints, deeperRemainingExamThirdPoints, deeperExamFundamentalsThirdPoints, deeperExamFundamentalsThird2Points],
  ),
);
