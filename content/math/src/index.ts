import type { SubjectDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { mathCheckers } from "@ga/subject-math";

import { mathCourses } from "./courses.ts";
import { absoluteValueTopics } from "./topics/absolute-value.ts";
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
import { differentialEquationsFirstOrderTopics } from "./topics/differential-equations-first-order.ts";
import { differentialEquationsModelingTopics } from "./topics/differential-equations-modeling.ts";
import { discreteMathematicsBooleanTopics } from "./topics/discrete-mathematics-boolean.ts";
import { discreteMathematicsCountingTopics } from "./topics/discrete-mathematics-counting.ts";
import { discreteMathematicsNumberTheoryTopics } from "./topics/discrete-mathematics-number-theory.ts";
import { discreteMathematicsRandomVariableTopics } from "./topics/discrete-mathematics-random-variables.ts";
import { discreteMathematicsRecurrenceTopics } from "./topics/discrete-mathematics-recurrences.ts";
import { discreteMathematicsSeriesTopics } from "./topics/discrete-mathematics-series.ts";
import { equationTopics } from "./topics/equations.ts";
import { exponentialFunctionTopics } from "./topics/exponential-functions.ts";
import { exponentTopics } from "./topics/exponents.ts";
import { expressionTopics } from "./topics/expressions.ts";
import { factoringTopics } from "./topics/factoring.ts";
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
import { grade4OperationTopics } from "./topics/grade-4-operations.ts";
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
import { quadraticEquationTopics } from "./topics/quadratic-equations.ts";
import { quadraticFunctionTopics } from "./topics/quadratic-functions.ts";
import { radicalExpressionTopics } from "./topics/radical-expressions.ts";
import { radicalTopics } from "./topics/radicals.ts";
import { rationalExpressionTopics } from "./topics/rational-expressions.ts";
import { ratioTopics } from "./topics/ratios.ts";
import { sequenceTopics } from "./topics/sequences.ts";
import { statisticsTopics } from "./topics/statistics.ts";
import { twoVariableTopics } from "./topics/two-variable-models.ts";
import { unitTopics } from "./topics/units.ts";

/** math is the definition of the mathematics subject. */
export const math: SubjectDef = {
  id: "math",
  title: t("Mathematics", "数学"),
  topics: [
    ...grade4OperationTopics,
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
    ...multivariableCalculusVectorFunctionTopics,
    ...multivariableCalculusMultivariableFunctionTopics,
    ...multivariableCalculusMultipleIntegralTopics,
    ...multivariableCalculusLineIntegralTopics,
    ...multivariableCalculusSurfaceIntegralTopics,
    ...multivariableCalculusApplicationTopics,
    ...differentialEquationsFirstOrderTopics,
    ...differentialEquationsModelingTopics,
  ],
  courses: mathCourses,
  checkers: mathCheckers,
};

/** compileMath compiles the mathematics subject; it throws a CompileError if the content is invalid. */
export const compileMath = () => compileSubject(math);
