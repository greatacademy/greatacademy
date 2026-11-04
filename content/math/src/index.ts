import type { SubjectDef, TopicDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { mathCheckers } from "@ga/subject-math";

import { mathCourses } from "./courses.ts";
import { inferredEncompassings } from "./encompassings.ts";
import { oneOfFourTopic } from "./one-of-four.ts";
import { polishTopic } from "./polish.ts";
import { absoluteValueTopics } from "./topics/absolute-value.ts";
import { abstractAlgebraActionTopics } from "./topics/abstract-algebra-actions.ts";
import { abstractAlgebraGroupTopics } from "./topics/abstract-algebra-groups.ts";
import { abstractAlgebraHomomorphismTopics } from "./topics/abstract-algebra-homomorphisms.ts";
import { abstractAlgebraPermutationTopics } from "./topics/abstract-algebra-permutations.ts";
import { abstractAlgebraPolynomialTopics } from "./topics/abstract-algebra-polynomials.ts";
import { abstractAlgebraQuotientTopics } from "./topics/abstract-algebra-quotients.ts";
import { abstractAlgebraRingTopics } from "./topics/abstract-algebra-rings.ts";
import { abstractAlgebraSubgroupTopics } from "./topics/abstract-algebra-subgroups.ts";
import { abstractAlgebraSylowTopics } from "./topics/abstract-algebra-sylow.ts";
import { actFundamentalsAlgebraTopics } from "./topics/act-fundamentals-algebra.ts";
import { actFundamentalsChanceConicsTopics } from "./topics/act-fundamentals-chance-conics.ts";
import { actFundamentalsFigureUnitTopics } from "./topics/act-fundamentals-figures-units.ts";
import { actFundamentalsFunctionTopics } from "./topics/act-fundamentals-functions.ts";
import { actFundamentalsGeometryTopics } from "./topics/act-fundamentals-geometry.ts";
import { actFundamentalsModelingTopics } from "./topics/act-fundamentals-modeling.ts";
import { actFundamentalsNumberTopics } from "./topics/act-fundamentals-number.ts";
import { actFundamentalsReasoningAlgebraTopics } from "./topics/act-fundamentals-reasoning-algebra.ts";
import { actFundamentalsReasoningDataTopics } from "./topics/act-fundamentals-reasoning-data.ts";
import { actFundamentalsReasoningGeometryTopics } from "./topics/act-fundamentals-reasoning-geometry.ts";
import { actGeometryDataTopics } from "./topics/act-geometry-data.ts";
import { actNumberAlgebraTopics } from "./topics/act-number-algebra.ts";
import { approximatingSystemsTopics } from "./topics/algebra-i-approximating-systems.ts";
import { conicTopics } from "./topics/algebra-ii-conics.ts";
import { algebraIIFactoringTopics } from "./topics/algebra-ii-factoring.ts";
import { algebraIIFunctionTopics } from "./topics/algebra-ii-functions.ts";
import { algebraIIGeneralTrianglesTopics } from "./topics/algebra-ii-general-triangles.ts";
import { algebraIIInverseTopics } from "./topics/algebra-ii-inverses.ts";
import { logarithmicEquationTopics } from "./topics/algebra-ii-log-equations.ts";
import { algebraIILogarithmTopics } from "./topics/algebra-ii-logarithms.ts";
import { algebraIIPolynomialGraphsTopics } from "./topics/algebra-ii-polynomial-graphs.ts";
import { polynomialTheoremTopics } from "./topics/algebra-ii-polynomial-theorems.ts";
import { algebraIIPolynomialTopics } from "./topics/algebra-ii-polynomials.ts";
import { algebraIIRadicalFunctionsTopics } from "./topics/algebra-ii-radical-functions.ts";
import { algebraIIRationalRadicalTopics } from "./topics/algebra-ii-rational-radical.ts";
import { algebraIIReciprocalFunctionsTopics } from "./topics/algebra-ii-reciprocal-functions.ts";
import { graphTransformationTopics } from "./topics/algebra-ii-transformations.ts";
import { algebraIITrigonometricGraphTopics } from "./topics/algebra-ii-trigonometric-graphs.ts";
import { algebraIITrigonometricTransformationTopics } from "./topics/algebra-ii-trigonometric-transformations.ts";
import { algebraIIUnitCircleTopics } from "./topics/algebra-ii-unit-circle.ts";
import { angleTopics } from "./topics/angles.ts";
import { apCalculusTechnologyTopics } from "./topics/ap-calculus-technology.ts";
import { areaTopics } from "./topics/area.ts";
import { bivariateStatisticsTopics } from "./topics/bivariate-statistics.ts";
import { calculusIAccumulationTopics } from "./topics/calculus-i-accumulation.ts";
import { calculusIAntiderivativeTopics } from "./topics/calculus-i-antiderivatives.ts";
import { calculusIChainRuleTopics } from "./topics/calculus-i-chain-rule.ts";
import { calculusIContextualTopics } from "./topics/calculus-i-contextual.ts";
import { calculusIContinuityTopics } from "./topics/calculus-i-continuity.ts";
import { calculusICurveTopics } from "./topics/calculus-i-curves.ts";
import { calculusIDerivativeRuleTopics } from "./topics/calculus-i-derivative-rules.ts";
import { calculusIDifferentiationTopics } from "./topics/calculus-i-differentiation.ts";
import { calculusIExtremaTopics } from "./topics/calculus-i-extrema.ts";
import { calculusIHyperbolicTopics } from "./topics/calculus-i-hyperbolic.ts";
import { calculusIImplicitInverseTopics } from "./topics/calculus-i-implicit-inverse.ts";
import { calculusILimitTechniqueTopics } from "./topics/calculus-i-limit-techniques.ts";
import { calculusILimitTopics } from "./topics/calculus-i-limits.ts";
import { calculusIOptimizationTopics } from "./topics/calculus-i-optimization.ts";
import { calculusIRiemannTopics } from "./topics/calculus-i-riemann.ts";
import { calculusIIAreaTopics } from "./topics/calculus-ii-areas.ts";
import { calculusIIConvergenceTopics } from "./topics/calculus-ii-convergence.ts";
import { calculusIIDifferentialEquationTopics } from "./topics/calculus-ii-differential-equations.ts";
import { calculusIIFractionImproperTopics } from "./topics/calculus-ii-fractions-improper.ts";
import { calculusIIIdentityPartsTopics } from "./topics/calculus-ii-identities-parts.ts";
import { calculusIIMotionTopics } from "./topics/calculus-ii-motion.ts";
import { calculusIIParametricTopics } from "./topics/calculus-ii-parametric.ts";
import { calculusIIPolarTopics } from "./topics/calculus-ii-polar.ts";
import { calculusIIRevolutionTopics } from "./topics/calculus-ii-revolution.ts";
import { calculusIISequenceTopics } from "./topics/calculus-ii-sequences.ts";
import { calculusIISubstitutionTopics } from "./topics/calculus-ii-substitution.ts";
import { calculusIITaylorTopics } from "./topics/calculus-ii-taylor.ts";
import { calculusIIVectorTopics } from "./topics/calculus-ii-vectors.ts";
import { combinatoricsTopics } from "./topics/combinatorics.ts";
import { compoundInequalityTopics } from "./topics/compound-inequalities.ts";
import { decimalAndPercentTopics } from "./topics/decimals-and-percents.ts";
import { deeperAbstractAlgebraPoints } from "./topics/deeper-abstract-algebra.ts";
import { deeperCalculusIPoints } from "./topics/deeper-calculus-i.ts";
import { deeperCalculusIIPoints } from "./topics/deeper-calculus-ii.ts";
import { deeperDifferentialEquationsPoints } from "./topics/deeper-differential-equations.ts";
import { deeperDiscreteMathematicsPoints } from "./topics/deeper-discrete-mathematics.ts";
import { deeperGrade4Points } from "./topics/deeper-grade-4.ts";
import { deeperGrade5Points } from "./topics/deeper-grade-5.ts";
import { deeperGrade6Points } from "./topics/deeper-grade-6.ts";
import { deeperLinearAlgebraPoints } from "./topics/deeper-linear-algebra.ts";
import { deeperMethodsOfProofPoints } from "./topics/deeper-methods-of-proof.ts";
import { deeperMultivariableCalculusPoints } from "./topics/deeper-multivariable-calculus.ts";
import { deeperPrecalculusPoints } from "./topics/deeper-precalculus.ts";
import { deeperProbabilityStatisticsPoints } from "./topics/deeper-probability-statistics.ts";
import { differentialEquationsBvpTopics } from "./topics/differential-equations-bvp.ts";
import { differentialEquationsFirstOrderTopics } from "./topics/differential-equations-first-order.ts";
import { differentialEquationsLaplaceTopics } from "./topics/differential-equations-laplace.ts";
import { differentialEquationsLinearTopics } from "./topics/differential-equations-linear.ts";
import { differentialEquationsModelingTopics } from "./topics/differential-equations-modeling.ts";
import { differentialEquationsNumericalTopics } from "./topics/differential-equations-numerical.ts";
import { differentialEquationsSystemsTopics } from "./topics/differential-equations-systems.ts";
import { discreteMathematicsAutomataTopics } from "./topics/discrete-mathematics-automata.ts";
import { discreteMathematicsBooleanTopics } from "./topics/discrete-mathematics-boolean.ts";
import { discreteMathematicsCountingTopics } from "./topics/discrete-mathematics-counting.ts";
import { discreteMathematicsGraphAlgorithmTopics } from "./topics/discrete-mathematics-graph-algorithms.ts";
import { discreteMathematicsGraphTopics } from "./topics/discrete-mathematics-graphs.ts";
import { discreteMathematicsNumberTheoryTopics } from "./topics/discrete-mathematics-number-theory.ts";
import { discreteMathematicsRandomVariableTopics } from "./topics/discrete-mathematics-random-variables.ts";
import { discreteMathematicsRecurrenceTopics } from "./topics/discrete-mathematics-recurrences.ts";
import { discreteMathematicsSeriesTopics } from "./topics/discrete-mathematics-series.ts";
import { equationTopics } from "./topics/equations.ts";
import { examTopics } from "./topics/exam-topics.ts";
import { exponentialFunctionTopics } from "./topics/exponential-functions.ts";
import { exponentTopics } from "./topics/exponents.ts";
import { expressionTopics } from "./topics/expressions.ts";
import { factoringTopics } from "./topics/factoring.ts";
import { figureReadingPoints } from "./topics/figure-reading.ts";
import { fractionTopics } from "./topics/fractions.ts";
import { functionTopics } from "./topics/functions.ts";
import { circleTheoremTopics } from "./topics/geometry-circle-theorems.ts";
import { circleTopics } from "./topics/geometry-circles.ts";
import { congruenceTopics } from "./topics/geometry-congruence.ts";
import { coordinateGeometryTopics } from "./topics/geometry-coordinate.ts";
import { coordinateCircleTopics } from "./topics/geometry-coordinate-circles.ts";
import { proofCongruenceSimilarityTopics } from "./topics/geometry-proof-congruence-similarity.ts";
import { geometryRadiansTopics } from "./topics/geometry-radians.ts";
import { similarityTopics } from "./topics/geometry-similarity.ts";
import { solidGeometryTopics } from "./topics/geometry-solids.ts";
import { transformationTopics } from "./topics/geometry-transformations.ts";
import { triangleTrigonometryTopics } from "./topics/geometry-triangles-trigonometry.ts";
import { trigonometryTopics } from "./topics/geometry-trigonometry.ts";
import { grade4FractionTopics } from "./topics/grade-4-fractions.ts";
import { grade4MeasurementTopics } from "./topics/grade-4-measurement.ts";
import { grade4OperationTopics } from "./topics/grade-4-operations.ts";
import { grade4WholeNumberTopics } from "./topics/grade-4-whole-numbers.ts";
import { grade5DecimalTopics } from "./topics/grade-5-decimals.ts";
import { grade5FractionTopics } from "./topics/grade-5-fractions.ts";
import { grade5MeasurementTopics } from "./topics/grade-5-measurement.ts";
import { grade5WholeNumberTopics } from "./topics/grade-5-whole-numbers.ts";
import { grade6to8FoundationTopics } from "./topics/grade-6-8-foundations.ts";
import { grade6EquationTopics } from "./topics/grade-6-equations.ts";
import { grade6ExpressionTopics } from "./topics/grade-6-expressions.ts";
import { grade6GeometryTopics } from "./topics/grade-6-geometry.ts";
import { grade6NumberSystemTopics } from "./topics/grade-6-number-system.ts";
import { grade6RatioTopics } from "./topics/grade-6-ratios.ts";
import { grade6StatisticsTopics } from "./topics/grade-6-statistics.ts";
import { grade7EquationTopics } from "./topics/grade-7-equations.ts";
import { grade7ExpressionTopics } from "./topics/grade-7-expressions.ts";
import { grade7GeometryTopics } from "./topics/grade-7-geometry.ts";
import { grade7MeasurementTopics } from "./topics/grade-7-measurement.ts";
import { grade7NumberSystemTopics } from "./topics/grade-7-number-system.ts";
import { grade7ProbabilityTopics } from "./topics/grade-7-probability.ts";
import { grade7RatioTopics } from "./topics/grade-7-ratios.ts";
import { grade7StatisticsTopics } from "./topics/grade-7-statistics.ts";
import { grade8AngleTopics } from "./topics/grade-8-angles.ts";
import { grade8BivariateTopics } from "./topics/grade-8-bivariate.ts";
import { grade8ExponentTopics } from "./topics/grade-8-exponents.ts";
import { grade8FunctionTopics } from "./topics/grade-8-functions.ts";
import { grade8LinearEquationTopics } from "./topics/grade-8-linear-equations.ts";
import { grade8NumberTheoryTopics } from "./topics/grade-8-number-theory.ts";
import { grade8PythagoreanTopics } from "./topics/grade-8-pythagorean.ts";
import { grade8RadicalTopics } from "./topics/grade-8-radicals.ts";
import { grade8RealNumberTopics } from "./topics/grade-8-real-numbers.ts";
import { grade8ScientificNotationTopics } from "./topics/grade-8-scientific-notation.ts";
import { grade8TransformationTopics } from "./topics/grade-8-transformations.ts";
import { inequalityTopics } from "./topics/inequalities.ts";
import { integerTopics } from "./topics/integers.ts";
import { linearAlgebraMatrixTopics } from "./topics/linear-algebra-matrices.ts";
import { linearAlgebraPreliminaryTopics } from "./topics/linear-algebra-preliminaries.ts";
import { linearAlgebraProjectionsTopics } from "./topics/linear-algebra-projections.ts";
import { linearAlgebraQuadraticFormsApplicationsTopics } from "./topics/linear-algebra-quadratic-forms-applications.ts";
import { linearAlgebraTransformationsEigenvaluesTopics } from "./topics/linear-algebra-transformations-eigenvalues.ts";
import { linearAlgebraVectorSpaceTopics } from "./topics/linear-algebra-vector-spaces.ts";
import { linearEquationTopics } from "./topics/linear-equations.ts";
import { lineTopics } from "./topics/lines.ts";
import { mathematicsForMachineLearningContinuousConditioningTopics } from "./topics/mathematics-for-machine-learning-continuous-conditioning.ts";
import { mathematicsForMachineLearningMatrixCalculusTopics } from "./topics/mathematics-for-machine-learning-matrix-calculus.ts";
import { mathematicsForMachineLearningPcaTopics } from "./topics/mathematics-for-machine-learning-pca.ts";
import { mathematicsForMachineLearningSetTheoryTopics } from "./topics/mathematics-for-machine-learning-set-theory.ts";
import { mathematicsForMachineLearningVectorSpaceTopics } from "./topics/mathematics-for-machine-learning-vector-spaces.ts";
import { methodsOfProofCongruenceTopics } from "./topics/methods-of-proof-congruence.ts";
import { methodsOfProofFunctionTopics } from "./topics/methods-of-proof-functions.ts";
import { methodsOfProofLogicTopics } from "./topics/methods-of-proof-logic.ts";
import { methodsOfProofNumberTheoryTopics } from "./topics/methods-of-proof-number-theory.ts";
import { methodsOfProofPredicateTopics } from "./topics/methods-of-proof-predicates.ts";
import { methodsOfProofProofTopics } from "./topics/methods-of-proof-proofs.ts";
import { methodsOfProofRelationTopics } from "./topics/methods-of-proof-relations.ts";
import { methodsOfProofSetTopics } from "./topics/methods-of-proof-sets.ts";
import { multivariableCalculusApplicationTopics } from "./topics/multivariable-calculus-applications.ts";
import { multivariableCalculusLineIntegralTopics } from "./topics/multivariable-calculus-line-integrals.ts";
import { multivariableCalculusMultipleIntegralTopics } from "./topics/multivariable-calculus-multiple-integrals.ts";
import { multivariableCalculusMultivariableFunctionTopics } from "./topics/multivariable-calculus-multivariable-functions.ts";
import { multivariableCalculusSurfaceIntegralTopics } from "./topics/multivariable-calculus-surface-integrals.ts";
import { multivariableCalculusVectorFunctionTopics } from "./topics/multivariable-calculus-vector-functions.ts";
import { numberTheoryTopics } from "./topics/number-theory.ts";
import { outlineGapTopics } from "./topics/outline-gaps.ts";
import { polynomialTopics } from "./topics/polynomials.ts";
import { precalculusComplexNumberTopics } from "./topics/precalculus-complex-numbers.ts";
import { precalculusConicSectionTopics } from "./topics/precalculus-conic-sections.ts";
import { precalculusDeMoivreTopics } from "./topics/precalculus-de-moivre.ts";
import { precalculusInequalityTopics } from "./topics/precalculus-inequalities.ts";
import { precalculusLinearTransformationTopics } from "./topics/precalculus-linear-transformations.ts";
import { precalculusMatrixTopics } from "./topics/precalculus-matrices.ts";
import { precalculusParametricPolarTopics } from "./topics/precalculus-parametric-polar.ts";
import { precalculusRandomVariableTopics } from "./topics/precalculus-random-variables.ts";
import { precalculusRationalFunctionTopics } from "./topics/precalculus-rational-functions.ts";
import { precalculusSeriesTopics } from "./topics/precalculus-series.ts";
import { precalculusStatisticsTopics } from "./topics/precalculus-statistics.ts";
import { precalculusTrigonometricEquationTopics } from "./topics/precalculus-trigonometric-equations.ts";
import { precalculusTrigonometricIdentityTopics } from "./topics/precalculus-trigonometric-identities.ts";
import { precalculusVector2DTopics } from "./topics/precalculus-vectors-2d.ts";
import { precalculusVector3DTopics } from "./topics/precalculus-vectors-3d.ts";
import { probabilityTopics } from "./topics/probability.ts";
import { probabilityAndStatisticsCombiningVariablesTopics } from "./topics/probability-and-statistics-combining-variables.ts";
import { probabilityAndStatisticsConfidenceIntervalTopics } from "./topics/probability-and-statistics-confidence-intervals.ts";
import { probabilityAndStatisticsContinuousDistributionTopics } from "./topics/probability-and-statistics-continuous-distributions.ts";
import { probabilityAndStatisticsDiscreteDistributionTopics } from "./topics/probability-and-statistics-discrete-distributions.ts";
import { probabilityAndStatisticsExpectationTopics } from "./topics/probability-and-statistics-expectation.ts";
import { probabilityAndStatisticsHypothesisTestingTopics } from "./topics/probability-and-statistics-hypothesis-testing.ts";
import { probabilityAndStatisticsNonparametricTopics } from "./topics/probability-and-statistics-nonparametric.ts";
import { probabilityAndStatisticsParametricInferenceTopics } from "./topics/probability-and-statistics-parametric-inference.ts";
import { probabilityAndStatisticsRandomVariablesTopics } from "./topics/probability-and-statistics-random-variables.ts";
import { probabilityAndStatisticsRegressionTopics } from "./topics/probability-and-statistics-regression.ts";
import { quadraticEquationTopics } from "./topics/quadratic-equations.ts";
import { quadraticFunctionTopics } from "./topics/quadratic-functions.ts";
import { radicalExpressionTopics } from "./topics/radical-expressions.ts";
import { radicalTopics } from "./topics/radicals.ts";
import { rationalExpressionTopics } from "./topics/rational-expressions.ts";
import { ratioTopics } from "./topics/ratios.ts";
import { satFundamentalsAdvancedTopics } from "./topics/sat-fundamentals-advanced.ts";
import { satFundamentalsAlgebraTopics } from "./topics/sat-fundamentals-algebra.ts";
import { satFundamentalsDataTopics } from "./topics/sat-fundamentals-data.ts";
import { satFundamentalsGeometryTopics } from "./topics/sat-fundamentals-geometry.ts";
import { satMathStrategyTopics } from "./topics/sat-math-strategies.ts";
import { satPrepAdvancedTopics } from "./topics/sat-prep-advanced.ts";
import { satPrepAlgebraTopics } from "./topics/sat-prep-algebra.ts";
import { satPrepDataTopics } from "./topics/sat-prep-data.ts";
import { sequenceTopics } from "./topics/sequences.ts";
import { statisticsTopics } from "./topics/statistics.ts";
import { twoVariableTopics } from "./topics/two-variable-models.ts";
import { unitTopics } from "./topics/units.ts";

/** judgedOverFourCases holds the topics of the proof courses, where yes-or-no questions become questions over four cases. */
const judgedOverFourCases = new Set(
  mathCourses
    .filter((course) => course.id === "abstract-algebra" || course.id === "methods-of-proof")
    .flatMap((course) => course.units.flatMap((unit) => unit.modules.flatMap((module) => module.topics))),
);

/** finished applies the passes every topic goes through: inferred encompassings, added knowledge points, questions over four cases and polish. */
function finished(topic: TopicDef): TopicDef {
  const weighted = {
    ...topic,
    encompasses: topic.encompasses.length ? topic.encompasses : (inferredEncompassings[topic.id] ?? []),
    knowledgePoints: [
      ...topic.knowledgePoints,
      ...(deeperGrade6Points[topic.id] ?? []),
      ...(deeperGrade5Points[topic.id] ?? []),
      ...(deeperGrade4Points[topic.id] ?? []),
      ...(deeperAbstractAlgebraPoints[topic.id] ?? []),
      ...(deeperCalculusIPoints[topic.id] ?? []),
      ...(deeperCalculusIIPoints[topic.id] ?? []),
      ...(deeperDifferentialEquationsPoints[topic.id] ?? []),
      ...(deeperDiscreteMathematicsPoints[topic.id] ?? []),
      ...(deeperLinearAlgebraPoints[topic.id] ?? []),
      ...(deeperMethodsOfProofPoints[topic.id] ?? []),
      ...(deeperMultivariableCalculusPoints[topic.id] ?? []),
      ...(deeperPrecalculusPoints[topic.id] ?? []),
      ...(deeperProbabilityStatisticsPoints[topic.id] ?? []),
      ...(figureReadingPoints[topic.id] ?? []),
    ],
  };
  return polishTopic(judgedOverFourCases.has(topic.id) ? oneOfFourTopic(weighted) : weighted);
}

/** math is the definition of the mathematics subject. */
export const math: SubjectDef = {
  id: "math",
  title: t("Mathematics", "数学"),
  topics: [
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
    ...numberTheoryTopics,
    ...fractionTopics,
    ...decimalAndPercentTopics,
    ...integerTopics,
    ...expressionTopics,
    ...exponentTopics,
    ...radicalTopics,
    ...equationTopics,
    ...inequalityTopics,
    ...ratioTopics,
    ...statisticsTopics,
    ...angleTopics,
    ...areaTopics,
    ...linearEquationTopics,
    ...compoundInequalityTopics,
    ...lineTopics,
    ...approximatingSystemsTopics,
    ...twoVariableTopics,
    ...functionTopics,
    ...absoluteValueTopics,
    ...exponentialFunctionTopics,
    ...quadraticFunctionTopics,
    ...unitTopics,
    ...polynomialTopics,
    ...factoringTopics,
    ...quadraticEquationTopics,
    ...radicalExpressionTopics,
    ...rationalExpressionTopics,
    ...sequenceTopics,
    ...bivariateStatisticsTopics,
    ...transformationTopics,
    ...congruenceTopics,
    ...proofCongruenceSimilarityTopics,
    ...similarityTopics,
    ...coordinateGeometryTopics,
    ...circleTopics,
    ...circleTheoremTopics,
    ...coordinateCircleTopics,
    ...triangleTrigonometryTopics,
    ...trigonometryTopics,
    ...geometryRadiansTopics,
    ...solidGeometryTopics,
    ...algebraIIFactoringTopics,
    ...polynomialTheoremTopics,
    ...algebraIIPolynomialTopics,
    ...algebraIIPolynomialGraphsTopics,
    ...algebraIIFunctionTopics,
    ...graphTransformationTopics,
    ...algebraIIInverseTopics,
    ...algebraIILogarithmTopics,
    ...logarithmicEquationTopics,
    ...algebraIIRationalRadicalTopics,
    ...algebraIIRadicalFunctionsTopics,
    ...algebraIIReciprocalFunctionsTopics,
    ...conicTopics,
    ...algebraIIUnitCircleTopics,
    ...algebraIIGeneralTrianglesTopics,
    ...algebraIITrigonometricGraphTopics,
    ...algebraIITrigonometricTransformationTopics,
    ...combinatoricsTopics,
    ...probabilityTopics,
    ...precalculusSeriesTopics,
    ...precalculusRationalFunctionTopics,
    ...precalculusInequalityTopics,
    ...precalculusTrigonometricIdentityTopics,
    ...precalculusTrigonometricEquationTopics,
    ...precalculusVector2DTopics,
    ...precalculusVector3DTopics,
    ...precalculusConicSectionTopics,
    ...precalculusMatrixTopics,
    ...precalculusLinearTransformationTopics,
    ...precalculusParametricPolarTopics,
    ...precalculusComplexNumberTopics,
    ...precalculusDeMoivreTopics,
    ...precalculusRandomVariableTopics,
    ...precalculusStatisticsTopics,
    ...linearAlgebraPreliminaryTopics,
    ...linearAlgebraMatrixTopics,
    ...linearAlgebraVectorSpaceTopics,
    ...linearAlgebraTransformationsEigenvaluesTopics,
    ...linearAlgebraProjectionsTopics,
    ...linearAlgebraQuadraticFormsApplicationsTopics,
    ...calculusIHyperbolicTopics,
    ...calculusILimitTopics,
    ...calculusILimitTechniqueTopics,
    ...calculusIContinuityTopics,
    ...calculusIDifferentiationTopics,
    ...calculusIDerivativeRuleTopics,
    ...calculusIChainRuleTopics,
    ...calculusIImplicitInverseTopics,
    ...calculusIContextualTopics,
    ...calculusIExtremaTopics,
    ...calculusICurveTopics,
    ...calculusIOptimizationTopics,
    ...calculusIAntiderivativeTopics,
    ...calculusIRiemannTopics,
    ...calculusIAccumulationTopics,
    ...calculusIISubstitutionTopics,
    ...calculusIIIdentityPartsTopics,
    ...calculusIIFractionImproperTopics,
    ...calculusIIAreaTopics,
    ...calculusIIRevolutionTopics,
    ...calculusIIMotionTopics,
    ...calculusIIParametricTopics,
    ...calculusIIVectorTopics,
    ...calculusIIPolarTopics,
    ...calculusIISequenceTopics,
    ...calculusIIConvergenceTopics,
    ...calculusIITaylorTopics,
    ...calculusIIDifferentialEquationTopics,
    ...apCalculusTechnologyTopics,
    ...methodsOfProofLogicTopics,
    ...methodsOfProofPredicateTopics,
    ...methodsOfProofSetTopics,
    ...methodsOfProofProofTopics,
    ...methodsOfProofNumberTheoryTopics,
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
    ...multivariableCalculusVectorFunctionTopics,
    ...multivariableCalculusMultivariableFunctionTopics,
    ...multivariableCalculusMultipleIntegralTopics,
    ...multivariableCalculusLineIntegralTopics,
    ...multivariableCalculusSurfaceIntegralTopics,
    ...multivariableCalculusApplicationTopics,
    ...differentialEquationsFirstOrderTopics,
    ...differentialEquationsModelingTopics,
    ...differentialEquationsLinearTopics,
    ...differentialEquationsSystemsTopics,
    ...differentialEquationsLaplaceTopics,
    ...differentialEquationsBvpTopics,
    ...differentialEquationsNumericalTopics,
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
    ...grade6to8FoundationTopics,
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
  ].map(finished),
  courses: mathCourses,
  checkers: mathCheckers,
};

/** compileMath compiles the mathematics subject; it throws a CompileError if the content is invalid. */
export const compileMath = () => compileSubject(math);
