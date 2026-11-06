// The topics of the `school` shard: 1st to 8th Grade Math. See docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";
import { remainingDrawings2 } from "../explanation-drawings-remaining-2.ts";
import { withDrawings } from "../explanation-drawings-remaining-kit.ts";
import { finishTopics } from "../finish.ts";
import { deeperSchoolFundamentalsThirdPoints } from "../topics/deeper-exam-fundamentals-third-2.ts";
import { figureChoicePoints } from "../topics/deeper-figure-choices.ts";
import { deeperGrade1ThirdPoints } from "../topics/deeper-grade-1-third.ts";
import { deeperGrade2ThirdPoints } from "../topics/deeper-grade-2-third.ts";
import { deeperGrade3ThirdPoints } from "../topics/deeper-grade-3-third.ts";
import { deeperGrade4Points } from "../topics/deeper-grade-4.ts";
import { deeperGrade4MorePoints } from "../topics/deeper-grade-4-more.ts";
import { deeperGrade4ThirdPoints } from "../topics/deeper-grade-4-third.ts";
import { deeperGrade4Third2Points } from "../topics/deeper-grade-4-third-2.ts";
import { deeperGrade5Points } from "../topics/deeper-grade-5.ts";
import { deeperGrade5MorePoints } from "../topics/deeper-grade-5-more.ts";
import { deeperGrade5ThirdPoints } from "../topics/deeper-grade-5-third.ts";
import { deeperGrade5Third2Points } from "../topics/deeper-grade-5-third-2.ts";
import { deeperGrade6Points } from "../topics/deeper-grade-6.ts";
import { deeperGrade6ThirdPoints } from "../topics/deeper-grade-6-third.ts";
import { deeperGrade6Third2Points } from "../topics/deeper-grade-6-third-2.ts";
import { deeperGrade7Points } from "../topics/deeper-grade-7.ts";
import { deeperGrade8Points } from "../topics/deeper-grade-8.ts";
import { deeperMiddleSchoolThirdPoints } from "../topics/deeper-middle-school-third.ts";
import { deeperMiddleSchoolThird2Points } from "../topics/deeper-middle-school-third-2.ts";
import { plottingPoints } from "../topics/deeper-plotting.ts";
import { deeperPrealgebraPoints } from "../topics/deeper-prealgebra.ts";
import { earlyGradesMoreTopics } from "../topics/early-grades-more.ts";
import { gradeOneMeasureTopics } from "../topics/grade-1-measurement-geometry.ts";
import { gradeOneNumberTopics } from "../topics/grade-1-numbers-operations.ts";
import { gradeTwoMeasureTopics } from "../topics/grade-2-measurement-geometry.ts";
import { gradeTwoNumberTopics } from "../topics/grade-2-numbers-operations.ts";
import { gradeThreeMeasureTopics } from "../topics/grade-3-fractions-measurement.ts";
import { gradeThreeOperationTopics } from "../topics/grade-3-operations.ts";
import { grade4FractionTopics } from "../topics/grade-4-fractions.ts";
import { grade4MeasurementTopics } from "../topics/grade-4-measurement.ts";
import { grade4OperationTopics } from "../topics/grade-4-operations.ts";
import { grade4WholeNumberTopics } from "../topics/grade-4-whole-numbers.ts";
import { grade5DecimalTopics } from "../topics/grade-5-decimals.ts";
import { grade5FractionTopics } from "../topics/grade-5-fractions.ts";
import { grade5MeasurementTopics } from "../topics/grade-5-measurement.ts";
import { grade5WholeNumberTopics } from "../topics/grade-5-whole-numbers.ts";
import { grade6to8FoundationTopics } from "../topics/grade-6-8-foundations.ts";
import { grade6EquationTopics } from "../topics/grade-6-equations.ts";
import { grade6ExpressionTopics } from "../topics/grade-6-expressions.ts";
import { grade6GeometryTopics } from "../topics/grade-6-geometry.ts";
import { grade6NumberSystemTopics } from "../topics/grade-6-number-system.ts";
import { grade6RatioTopics } from "../topics/grade-6-ratios.ts";
import { grade6StatisticsTopics } from "../topics/grade-6-statistics.ts";
import { grade7EquationTopics } from "../topics/grade-7-equations.ts";
import { grade7ExpressionTopics } from "../topics/grade-7-expressions.ts";
import { grade7GeometryTopics } from "../topics/grade-7-geometry.ts";
import { grade7MeasurementTopics } from "../topics/grade-7-measurement.ts";
import { grade7NumberSystemTopics } from "../topics/grade-7-number-system.ts";
import { grade7ProbabilityTopics } from "../topics/grade-7-probability.ts";
import { grade7RatioTopics } from "../topics/grade-7-ratios.ts";
import { grade7StatisticsTopics } from "../topics/grade-7-statistics.ts";
import { grade8AngleTopics } from "../topics/grade-8-angles.ts";
import { grade8BivariateTopics } from "../topics/grade-8-bivariate.ts";
import { grade8ExponentTopics } from "../topics/grade-8-exponents.ts";
import { grade8FunctionTopics } from "../topics/grade-8-functions.ts";
import { grade8LinearEquationTopics } from "../topics/grade-8-linear-equations.ts";
import { grade8NumberTheoryTopics } from "../topics/grade-8-number-theory.ts";
import { grade8PythagoreanTopics } from "../topics/grade-8-pythagorean.ts";
import { grade8RadicalTopics } from "../topics/grade-8-radicals.ts";
import { grade8RealNumberTopics } from "../topics/grade-8-real-numbers.ts";
import { grade8ScientificNotationTopics } from "../topics/grade-8-scientific-notation.ts";
import { grade8TransformationTopics } from "../topics/grade-8-transformations.ts";

/** schoolShardTopics are the finished topics of the `school` shard. */
export const schoolShardTopics: readonly TopicDef[] = withDrawings(
  finishTopics(
    [
      ...grade4WholeNumberTopics,
      ...grade4FractionTopics,
      ...grade4MeasurementTopics,
      ...grade4OperationTopics,
      ...grade5WholeNumberTopics,
      ...grade5FractionTopics,
      ...grade5DecimalTopics,
      ...grade5MeasurementTopics,
      ...grade6RatioTopics,
      ...grade6NumberSystemTopics,
      ...grade6ExpressionTopics,
      ...grade6EquationTopics,
      ...grade6GeometryTopics,
      ...grade6StatisticsTopics,
      ...grade7RatioTopics,
      ...grade7NumberSystemTopics,
      ...grade7ExpressionTopics,
      ...grade7EquationTopics,
      ...grade7GeometryTopics,
      ...grade7MeasurementTopics,
      ...grade7StatisticsTopics,
      ...grade7ProbabilityTopics,
      ...grade8RealNumberTopics,
      ...grade8ExponentTopics,
      ...grade8ScientificNotationTopics,
      ...grade8RadicalTopics,
      ...grade8NumberTheoryTopics,
      ...grade8LinearEquationTopics,
      ...grade8FunctionTopics,
      ...grade8AngleTopics,
      ...grade8TransformationTopics,
      ...grade8PythagoreanTopics,
      ...grade8BivariateTopics,
      ...earlyGradesMoreTopics,
      ...grade6to8FoundationTopics,
      ...gradeOneNumberTopics,
      ...gradeOneMeasureTopics,
      ...gradeTwoNumberTopics,
      ...gradeTwoMeasureTopics,
      ...gradeThreeOperationTopics,
      ...gradeThreeMeasureTopics,
    ],
    [
      deeperPrealgebraPoints,
      deeperGrade8Points,
      deeperGrade7Points,
      deeperGrade6Points,
      deeperGrade5Points,
      deeperGrade4Points,
      deeperGrade5MorePoints,
      deeperGrade4MorePoints,
      deeperGrade1ThirdPoints,
      deeperGrade2ThirdPoints,
      deeperGrade3ThirdPoints,
      deeperGrade4ThirdPoints,
      deeperGrade4Third2Points,
      deeperGrade5ThirdPoints,
      deeperGrade5Third2Points,
      deeperGrade6ThirdPoints,
      deeperGrade6Third2Points,
      deeperMiddleSchoolThirdPoints,
      deeperMiddleSchoolThird2Points,
      deeperSchoolFundamentalsThirdPoints,
      figureChoicePoints,
      plottingPoints,
    ],
  ),
  { ...remainingDrawings2 },
);
