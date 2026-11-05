// The topics of the `college` shard: linear algebra, proof, discrete mathematics, abstract algebra, number theory, linear programming, probability and statistics, and mathematics for machine learning. See docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";

import { finishTopics } from "../finish.ts";
import { abstractAlgebraActionTopics } from "../topics/abstract-algebra-actions.ts";
import { abstractAlgebraGroupTopics } from "../topics/abstract-algebra-groups.ts";
import { abstractAlgebraHomomorphismTopics } from "../topics/abstract-algebra-homomorphisms.ts";
import { abstractAlgebraPermutationTopics } from "../topics/abstract-algebra-permutations.ts";
import { abstractAlgebraPolynomialTopics } from "../topics/abstract-algebra-polynomials.ts";
import { abstractAlgebraQuotientTopics } from "../topics/abstract-algebra-quotients.ts";
import { abstractAlgebraRingTopics } from "../topics/abstract-algebra-rings.ts";
import { abstractAlgebraSubgroupTopics } from "../topics/abstract-algebra-subgroups.ts";
import { abstractAlgebraSylowTopics } from "../topics/abstract-algebra-sylow.ts";
import { combinatoricsTopics } from "../topics/combinatorics.ts";
import { deeperAbstractAlgebraPoints } from "../topics/deeper-abstract-algebra.ts";
import { deeperDifferentialEquationsPoints } from "../topics/deeper-differential-equations.ts";
import { deeperDiscreteMathematicsPoints } from "../topics/deeper-discrete-mathematics.ts";
import { deeperCollegeThirdPoints } from "../topics/deeper-exam-college-third.ts";
import { deeperGrade4Points } from "../topics/deeper-grade-4.ts";
import { deeperGrade4MorePoints } from "../topics/deeper-grade-4-more.ts";
import { deeperGrade7Points } from "../topics/deeper-grade-7.ts";
import { deeperLinearAlgebraPoints } from "../topics/deeper-linear-algebra.ts";
import { deeperLinearProgrammingPoints } from "../topics/deeper-linear-programming.ts";
import { deeperMethodsOfProofPoints } from "../topics/deeper-methods-of-proof.ts";
import { deeperNumberTheoryPoints } from "../topics/deeper-number-theory.ts";
import { deeperPrecalculusPoints } from "../topics/deeper-precalculus.ts";
import { deeperProbabilityStatisticsPoints } from "../topics/deeper-probability-statistics.ts";
import { deeperRealAnalysisPoints } from "../topics/deeper-real-analysis.ts";
import { deeperRemainingCollegeThirdPoints } from "../topics/deeper-remaining-college-third.ts";
import { discreteMathematicsAutomataTopics } from "../topics/discrete-mathematics-automata.ts";
import { discreteMathematicsBooleanTopics } from "../topics/discrete-mathematics-boolean.ts";
import { discreteMathematicsCountingTopics } from "../topics/discrete-mathematics-counting.ts";
import { discreteMathematicsGraphAlgorithmTopics } from "../topics/discrete-mathematics-graph-algorithms.ts";
import { discreteMathematicsGraphTopics } from "../topics/discrete-mathematics-graphs.ts";
import { discreteMathematicsNumberTheoryTopics } from "../topics/discrete-mathematics-number-theory.ts";
import { discreteMathematicsRandomVariableTopics } from "../topics/discrete-mathematics-random-variables.ts";
import { discreteMathematicsRecurrenceTopics } from "../topics/discrete-mathematics-recurrences.ts";
import { discreteMathematicsSeriesTopics } from "../topics/discrete-mathematics-series.ts";
import { figureReadingPoints } from "../topics/figure-reading.ts";
import { collegeFigurePoints } from "../topics/figure-reading-college.ts";
import { moreFigureReadingPoints } from "../topics/figure-reading-more.ts";
import { linearAlgebraMatrixTopics } from "../topics/linear-algebra-matrices.ts";
import { linearAlgebraPreliminaryTopics } from "../topics/linear-algebra-preliminaries.ts";
import { linearAlgebraProjectionsTopics } from "../topics/linear-algebra-projections.ts";
import { linearAlgebraQuadraticFormsApplicationsTopics } from "../topics/linear-algebra-quadratic-forms-applications.ts";
import { linearAlgebraTransformationsEigenvaluesTopics } from "../topics/linear-algebra-transformations-eigenvalues.ts";
import { linearAlgebraVectorSpaceTopics } from "../topics/linear-algebra-vector-spaces.ts";
import { linearProgrammingTopics } from "../topics/linear-programming.ts";
import { linearProgrammingMoreTopics } from "../topics/linear-programming-more.ts";
import { mathematicsForMachineLearningContinuousConditioningTopics } from "../topics/mathematics-for-machine-learning-continuous-conditioning.ts";
import { mathematicsForMachineLearningMatrixCalculusTopics } from "../topics/mathematics-for-machine-learning-matrix-calculus.ts";
import { mathematicsForMachineLearningPcaTopics } from "../topics/mathematics-for-machine-learning-pca.ts";
import { mathematicsForMachineLearningSetTheoryTopics } from "../topics/mathematics-for-machine-learning-set-theory.ts";
import { mathematicsForMachineLearningVectorSpaceTopics } from "../topics/mathematics-for-machine-learning-vector-spaces.ts";
import { methodsOfProofCongruenceTopics } from "../topics/methods-of-proof-congruence.ts";
import { methodsOfProofFunctionTopics } from "../topics/methods-of-proof-functions.ts";
import { methodsOfProofLogicTopics } from "../topics/methods-of-proof-logic.ts";
import { methodsOfProofNumberTheoryTopics } from "../topics/methods-of-proof-number-theory.ts";
import { methodsOfProofPredicateTopics } from "../topics/methods-of-proof-predicates.ts";
import { methodsOfProofProofTopics } from "../topics/methods-of-proof-proofs.ts";
import { methodsOfProofRelationTopics } from "../topics/methods-of-proof-relations.ts";
import { methodsOfProofSetTopics } from "../topics/methods-of-proof-sets.ts";
import { numberTheoryTopics } from "../topics/number-theory.ts";
import { numberTheoryCourseTopics } from "../topics/number-theory-course.ts";
import { numberTheoryExtraTopics } from "../topics/number-theory-extra.ts";
import { numberTheoryMoreTopics } from "../topics/number-theory-more.ts";
import { probabilityTopics } from "../topics/probability.ts";
import { probabilityAndStatisticsCombiningVariablesTopics } from "../topics/probability-and-statistics-combining-variables.ts";
import { probabilityAndStatisticsConfidenceIntervalTopics } from "../topics/probability-and-statistics-confidence-intervals.ts";
import { probabilityAndStatisticsContinuousDistributionTopics } from "../topics/probability-and-statistics-continuous-distributions.ts";
import { probabilityAndStatisticsDiscreteDistributionTopics } from "../topics/probability-and-statistics-discrete-distributions.ts";
import { probabilityAndStatisticsExpectationTopics } from "../topics/probability-and-statistics-expectation.ts";
import { probabilityAndStatisticsHypothesisTestingTopics } from "../topics/probability-and-statistics-hypothesis-testing.ts";
import { probabilityAndStatisticsNonparametricTopics } from "../topics/probability-and-statistics-nonparametric.ts";
import { probabilityAndStatisticsParametricInferenceTopics } from "../topics/probability-and-statistics-parametric-inference.ts";
import { probabilityAndStatisticsRandomVariablesTopics } from "../topics/probability-and-statistics-random-variables.ts";
import { probabilityAndStatisticsRegressionTopics } from "../topics/probability-and-statistics-regression.ts";

/** collegeShardTopics are the finished topics of the `college` shard. */
export const collegeShardTopics: readonly TopicDef[] = finishTopics(
  [
    ...numberTheoryTopics,
    ...combinatoricsTopics,
    ...probabilityTopics,
    ...linearAlgebraPreliminaryTopics,
    ...linearAlgebraMatrixTopics,
    ...linearAlgebraVectorSpaceTopics,
    ...linearAlgebraTransformationsEigenvaluesTopics,
    ...linearAlgebraProjectionsTopics,
    ...linearAlgebraQuadraticFormsApplicationsTopics,
    ...methodsOfProofLogicTopics,
    ...methodsOfProofPredicateTopics,
    ...methodsOfProofSetTopics,
    ...methodsOfProofProofTopics,
    ...methodsOfProofNumberTheoryTopics,
    ...numberTheoryCourseTopics,
    ...numberTheoryMoreTopics,
    ...numberTheoryExtraTopics,
    ...linearProgrammingTopics,
    ...linearProgrammingMoreTopics,
    ...methodsOfProofFunctionTopics,
    ...methodsOfProofCongruenceTopics,
    ...methodsOfProofRelationTopics,
    ...discreteMathematicsBooleanTopics,
    ...discreteMathematicsNumberTheoryTopics,
    ...discreteMathematicsRandomVariableTopics,
    ...discreteMathematicsCountingTopics,
    ...discreteMathematicsSeriesTopics,
    ...discreteMathematicsRecurrenceTopics,
    ...discreteMathematicsGraphTopics,
    ...discreteMathematicsGraphAlgorithmTopics,
    ...discreteMathematicsAutomataTopics,
    ...abstractAlgebraGroupTopics,
    ...abstractAlgebraSubgroupTopics,
    ...abstractAlgebraPermutationTopics,
    ...abstractAlgebraQuotientTopics,
    ...abstractAlgebraHomomorphismTopics,
    ...abstractAlgebraActionTopics,
    ...abstractAlgebraSylowTopics,
    ...abstractAlgebraRingTopics,
    ...abstractAlgebraPolynomialTopics,
    ...probabilityAndStatisticsRandomVariablesTopics,
    ...probabilityAndStatisticsExpectationTopics,
    ...probabilityAndStatisticsDiscreteDistributionTopics,
    ...probabilityAndStatisticsContinuousDistributionTopics,
    ...probabilityAndStatisticsCombiningVariablesTopics,
    ...probabilityAndStatisticsParametricInferenceTopics,
    ...probabilityAndStatisticsConfidenceIntervalTopics,
    ...probabilityAndStatisticsHypothesisTestingTopics,
    ...probabilityAndStatisticsRegressionTopics,
    ...probabilityAndStatisticsNonparametricTopics,
    ...mathematicsForMachineLearningSetTheoryTopics,
    ...mathematicsForMachineLearningVectorSpaceTopics,
    ...mathematicsForMachineLearningPcaTopics,
    ...mathematicsForMachineLearningMatrixCalculusTopics,
    ...mathematicsForMachineLearningContinuousConditioningTopics,
  ],
  [
    deeperGrade7Points,
    deeperGrade4Points,
    deeperAbstractAlgebraPoints,
    deeperGrade4MorePoints,
    deeperNumberTheoryPoints,
    deeperRealAnalysisPoints,
    deeperLinearProgrammingPoints,
    deeperDifferentialEquationsPoints,
    deeperDiscreteMathematicsPoints,
    deeperLinearAlgebraPoints,
    deeperMethodsOfProofPoints,
    deeperPrecalculusPoints,
    deeperProbabilityStatisticsPoints,
    figureReadingPoints,
    moreFigureReadingPoints,
    collegeFigurePoints,
    deeperCollegeThirdPoints,
    deeperRemainingCollegeThirdPoints,
  ],
);
