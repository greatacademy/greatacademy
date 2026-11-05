// The topics of the `calculus` shard: Precalculus, calculus, differential equations and analysis. See docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";

import { finishTopics } from "../finish.ts";
import { apCalculusTechnologyTopics } from "../topics/ap-calculus-technology.ts";
import { calculusIAccumulationTopics } from "../topics/calculus-i-accumulation.ts";
import { calculusIAntiderivativeTopics } from "../topics/calculus-i-antiderivatives.ts";
import { calculusIChainRuleTopics } from "../topics/calculus-i-chain-rule.ts";
import { calculusIContextualTopics } from "../topics/calculus-i-contextual.ts";
import { calculusIContinuityTopics } from "../topics/calculus-i-continuity.ts";
import { calculusICurveTopics } from "../topics/calculus-i-curves.ts";
import { calculusIDerivativeRuleTopics } from "../topics/calculus-i-derivative-rules.ts";
import { calculusIDifferentiationTopics } from "../topics/calculus-i-differentiation.ts";
import { calculusIExtremaTopics } from "../topics/calculus-i-extrema.ts";
import { calculusIHyperbolicTopics } from "../topics/calculus-i-hyperbolic.ts";
import { calculusIImplicitInverseTopics } from "../topics/calculus-i-implicit-inverse.ts";
import { calculusILimitTechniqueTopics } from "../topics/calculus-i-limit-techniques.ts";
import { calculusILimitTopics } from "../topics/calculus-i-limits.ts";
import { calculusIOptimizationTopics } from "../topics/calculus-i-optimization.ts";
import { calculusIRiemannTopics } from "../topics/calculus-i-riemann.ts";
import { calculusIIAreaTopics } from "../topics/calculus-ii-areas.ts";
import { calculusIIConvergenceTopics } from "../topics/calculus-ii-convergence.ts";
import { calculusIIDifferentialEquationTopics } from "../topics/calculus-ii-differential-equations.ts";
import { calculusIIFractionImproperTopics } from "../topics/calculus-ii-fractions-improper.ts";
import { calculusIIIdentityPartsTopics } from "../topics/calculus-ii-identities-parts.ts";
import { calculusIIMotionTopics } from "../topics/calculus-ii-motion.ts";
import { calculusIIParametricTopics } from "../topics/calculus-ii-parametric.ts";
import { calculusIIPolarTopics } from "../topics/calculus-ii-polar.ts";
import { calculusIIRevolutionTopics } from "../topics/calculus-ii-revolution.ts";
import { calculusIISequenceTopics } from "../topics/calculus-ii-sequences.ts";
import { calculusIISubstitutionTopics } from "../topics/calculus-ii-substitution.ts";
import { calculusIITaylorTopics } from "../topics/calculus-ii-taylor.ts";
import { calculusIIVectorTopics } from "../topics/calculus-ii-vectors.ts";
import { complexAnalysisTopics } from "../topics/complex-analysis.ts";
import { complexAnalysisExtraTopics } from "../topics/complex-analysis-extra.ts";
import { complexAnalysisMoreTopics } from "../topics/complex-analysis-more.ts";
import { deeperCalculusIPoints } from "../topics/deeper-calculus-i.ts";
import { deeperCalculusIThirdPoints } from "../topics/deeper-calculus-i-third.ts";
import { deeperCalculusIThird2Points } from "../topics/deeper-calculus-i-third-2.ts";
import { deeperCalculusIIPoints } from "../topics/deeper-calculus-ii.ts";
import { deeperCalculusIIThirdPoints } from "../topics/deeper-calculus-ii-third.ts";
import { deeperCalculusIIThird2Points } from "../topics/deeper-calculus-ii-third-2.ts";
import { deeperComplexAnalysisPoints } from "../topics/deeper-complex-analysis.ts";
import { deeperComplexAnalysisThirdPoints } from "../topics/deeper-complex-analysis-third.ts";
import { deeperDifferentialEquationsPoints } from "../topics/deeper-differential-equations.ts";
import { deeperDifferentialEquationsThirdPoints } from "../topics/deeper-differential-equations-third.ts";
import { deeperDifferentialEquationsThird2Points } from "../topics/deeper-differential-equations-third-2.ts";
import { deeperDiscreteMathematicsPoints } from "../topics/deeper-discrete-mathematics.ts";
import { deeperFiguresCalculusIiPoints } from "../topics/deeper-figures-calculus-ii.ts";
import { deeperFiguresComplexAnalysisPoints } from "../topics/deeper-figures-complex-analysis.ts";
import { deeperFiguresDifferentialEquationsPoints } from "../topics/deeper-figures-differential-equations.ts";
import { deeperFiguresMultivariableCalculusPoints } from "../topics/deeper-figures-multivariable-calculus.ts";
import { deeperFiguresPartialDifferentialEquationsPoints } from "../topics/deeper-figures-partial-differential-equations.ts";
import { deeperFiguresProbabilityCalculusPoints } from "../topics/deeper-figures-probability-and-statistics.ts";
import { deeperFiguresProbability2CalculusPoints } from "../topics/deeper-figures-probability-and-statistics-2.ts";
import { deeperFiguresRealAnalysisPoints } from "../topics/deeper-figures-real-analysis.ts";
import { deeperMultivariableCalculusPoints } from "../topics/deeper-multivariable-calculus.ts";
import { deeperMultivariableCalculusThirdPoints } from "../topics/deeper-multivariable-calculus-third.ts";
import { deeperMultivariableCalculusThird2Points } from "../topics/deeper-multivariable-calculus-third-2.ts";
import { deeperPartialDifferentialEquationsPoints } from "../topics/deeper-partial-differential-equations.ts";
import { deeperPartialDifferentialEquationsThirdPoints } from "../topics/deeper-partial-differential-equations-third.ts";
import { deeperPrecalculusPoints } from "../topics/deeper-precalculus.ts";
import { deeperPrecalculusThirdPoints } from "../topics/deeper-precalculus-third.ts";
import { deeperPrecalculusThird2Points } from "../topics/deeper-precalculus-third-2.ts";
import { deeperPrecalculusThird3Points } from "../topics/deeper-precalculus-third-3.ts";
import { deeperProbabilityStatisticsPoints } from "../topics/deeper-probability-statistics.ts";
import { deeperRealAnalysisPoints } from "../topics/deeper-real-analysis.ts";
import { deeperRealAnalysisThirdPoints } from "../topics/deeper-real-analysis-third.ts";
import { deeperRemainingCalculusThirdPoints } from "../topics/deeper-remaining-third.ts";
import { differentialEquationsBvpTopics } from "../topics/differential-equations-bvp.ts";
import { differentialEquationsFirstOrderTopics } from "../topics/differential-equations-first-order.ts";
import { differentialEquationsLaplaceTopics } from "../topics/differential-equations-laplace.ts";
import { differentialEquationsLinearTopics } from "../topics/differential-equations-linear.ts";
import { differentialEquationsModelingTopics } from "../topics/differential-equations-modeling.ts";
import { differentialEquationsNumericalTopics } from "../topics/differential-equations-numerical.ts";
import { differentialEquationsSystemsTopics } from "../topics/differential-equations-systems.ts";
import { figureReadingPoints } from "../topics/figure-reading.ts";
import { collegeFigurePoints } from "../topics/figure-reading-college.ts";
import { moreFigureReadingPoints } from "../topics/figure-reading-more.ts";
import { multivariableCalculusApplicationTopics } from "../topics/multivariable-calculus-applications.ts";
import { multivariableCalculusLineIntegralTopics } from "../topics/multivariable-calculus-line-integrals.ts";
import { multivariableCalculusMultipleIntegralTopics } from "../topics/multivariable-calculus-multiple-integrals.ts";
import { multivariableCalculusMultivariableFunctionTopics } from "../topics/multivariable-calculus-multivariable-functions.ts";
import { multivariableCalculusSurfaceIntegralTopics } from "../topics/multivariable-calculus-surface-integrals.ts";
import { multivariableCalculusVectorFunctionTopics } from "../topics/multivariable-calculus-vector-functions.ts";
import { partialDifferentialEquationsTopics } from "../topics/partial-differential-equations.ts";
import { partialDifferentialEquationsExtraTopics } from "../topics/partial-differential-equations-extra.ts";
import { partialDifferentialEquationsMoreTopics } from "../topics/partial-differential-equations-more.ts";
import { precalculusComplexNumberTopics } from "../topics/precalculus-complex-numbers.ts";
import { precalculusConicSectionTopics } from "../topics/precalculus-conic-sections.ts";
import { precalculusDeMoivreTopics } from "../topics/precalculus-de-moivre.ts";
import { precalculusInequalityTopics } from "../topics/precalculus-inequalities.ts";
import { precalculusLinearTransformationTopics } from "../topics/precalculus-linear-transformations.ts";
import { precalculusMatrixTopics } from "../topics/precalculus-matrices.ts";
import { precalculusParametricPolarTopics } from "../topics/precalculus-parametric-polar.ts";
import { precalculusRandomVariableTopics } from "../topics/precalculus-random-variables.ts";
import { precalculusRationalFunctionTopics } from "../topics/precalculus-rational-functions.ts";
import { precalculusSeriesTopics } from "../topics/precalculus-series.ts";
import { precalculusStatisticsTopics } from "../topics/precalculus-statistics.ts";
import { precalculusTrigonometricEquationTopics } from "../topics/precalculus-trigonometric-equations.ts";
import { precalculusTrigonometricIdentityTopics } from "../topics/precalculus-trigonometric-identities.ts";
import { precalculusVector2DTopics } from "../topics/precalculus-vectors-2d.ts";
import { precalculusVector3DTopics } from "../topics/precalculus-vectors-3d.ts";
import { realAnalysisTopics } from "../topics/real-analysis.ts";
import { realAnalysisExtraTopics } from "../topics/real-analysis-extra.ts";
import { realAnalysisMoreTopics } from "../topics/real-analysis-more.ts";

/** calculusShardTopics are the finished topics of the `calculus` shard. */
export const calculusShardTopics: readonly TopicDef[] = finishTopics(
  [
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
    ...partialDifferentialEquationsTopics,
    ...partialDifferentialEquationsMoreTopics,
    ...partialDifferentialEquationsExtraTopics,
    ...complexAnalysisTopics,
    ...complexAnalysisMoreTopics,
    ...complexAnalysisExtraTopics,
    ...realAnalysisTopics,
    ...realAnalysisMoreTopics,
    ...realAnalysisExtraTopics,
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
  ],
  [
    deeperCalculusIPoints,
    deeperPartialDifferentialEquationsPoints,
    deeperRealAnalysisPoints,
    deeperComplexAnalysisPoints,
    deeperCalculusIIPoints,
    deeperDifferentialEquationsPoints,
    deeperDiscreteMathematicsPoints,
    deeperMultivariableCalculusPoints,
    deeperPrecalculusPoints,
    deeperProbabilityStatisticsPoints,
    figureReadingPoints,
    moreFigureReadingPoints,
    collegeFigurePoints,
    deeperCalculusIThirdPoints,
    deeperCalculusIThird2Points,
    deeperCalculusIIThirdPoints,
    deeperCalculusIIThird2Points,
    deeperDifferentialEquationsThirdPoints,
    deeperDifferentialEquationsThird2Points,
    deeperPrecalculusThirdPoints,
    deeperPrecalculusThird2Points,
    deeperMultivariableCalculusThirdPoints,
    deeperPrecalculusThird3Points,
    deeperMultivariableCalculusThird2Points,
    deeperRemainingCalculusThirdPoints,
    deeperRealAnalysisThirdPoints,
    deeperComplexAnalysisThirdPoints,
    deeperPartialDifferentialEquationsThirdPoints,
    deeperFiguresComplexAnalysisPoints,
    deeperFiguresMultivariableCalculusPoints,
    deeperFiguresDifferentialEquationsPoints,
    deeperFiguresCalculusIiPoints,
    deeperFiguresRealAnalysisPoints,
    deeperFiguresPartialDifferentialEquationsPoints,
    deeperFiguresProbabilityCalculusPoints,
    deeperFiguresProbability2CalculusPoints,
  ],
);
