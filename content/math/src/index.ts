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
import { algebraIIUnitCircleTopics } from "./topics/algebra-ii-unit-circle.ts";
import { angleTopics } from "./topics/angles.ts";
import { areaTopics } from "./topics/area.ts";
import { bivariateStatisticsTopics } from "./topics/bivariate-statistics.ts";
import { combinatoricsTopics } from "./topics/combinatorics.ts";
import { compoundInequalityTopics } from "./topics/compound-inequalities.ts";
import { decimalAndPercentTopics } from "./topics/decimals-and-percents.ts";
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
import { linearEquationTopics } from "./topics/linear-equations.ts";
import { lineTopics } from "./topics/lines.ts";
import { numberTheoryTopics } from "./topics/number-theory.ts";
import { polynomialTopics } from "./topics/polynomials.ts";
import { precalculusInequalityTopics } from "./topics/precalculus-inequalities.ts";
import { precalculusRationalFunctionTopics } from "./topics/precalculus-rational-functions.ts";
import { precalculusSeriesTopics } from "./topics/precalculus-series.ts";
import { precalculusTrigonometricEquationTopics } from "./topics/precalculus-trigonometric-equations.ts";
import { precalculusTrigonometricIdentityTopics } from "./topics/precalculus-trigonometric-identities.ts";
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
    ...combinatoricsTopics,
    ...probabilityTopics,
    ...precalculusSeriesTopics,
    ...precalculusRationalFunctionTopics,
    ...precalculusInequalityTopics,
    ...precalculusTrigonometricIdentityTopics,
    ...precalculusTrigonometricEquationTopics,
  ],
  courses: mathCourses,
  checkers: mathCheckers,
};

/** compileMath compiles the mathematics subject; it throws a CompileError if the content is invalid. */
export const compileMath = () => compileSubject(math);
