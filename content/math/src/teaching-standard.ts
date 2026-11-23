/**
 * taughtCourses lists the courses written to the teaching standard (docs/content.md §4, "Teaching, not stating"):
 * every topic has an introduction, every explanation ends with a callout on its typical mistake, and solutions are
 * worked step by step and check their answer. Its test holds every topic of these courses to it.
 */
export const taughtCourses: readonly string[] = ["algebra-i", "geometry", "algebra-ii", "precalculus"];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "calculating-limits-of-rational-functions-by-factoring",
  "limits-of-absolute-value-functions",
  "calculating-limits-of-radical-functions-using-conjugate-multiplication",
  "calculating-limits-using-trigonometric-identities",
  "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
  "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
  "evaluating-limits-at-infinity-of-radical-functions",
  "the-squeeze-theorem",
  "special-limits-involving-sine",
  "evaluating-special-limits-involving-sine-using-a-substitution",
  "special-limits-involving-cosine",
  "limits-involving-the-exponential-function",
  "further-limits-involving-the-exponential-function",
  "the-finite-limit-of-a-function",
  "the-left-and-right-sided-limits-of-a-function",
  "finding-the-existence-of-a-limit-using-one-sided-limits",
  "limits-at-infinity-from-graphs",
  "infinite-limits-from-graphs",
  "limits-of-power-functions-and-the-constant-rule-for-limits",
  "the-sum-rule-for-limits",
  "the-product-and-quotient-rules-for-limits",
  "the-power-and-root-rules-for-limits",
  "limits-at-infinity-of-polynomials",
  "limits-of-reciprocal-functions",
  "limits-of-exponential-functions",
  "limits-of-logarithmic-functions",
  "limits-of-radical-functions",
  "limits-of-trigonometric-functions",
  "limits-of-reciprocal-trigonometric-functions",
  "limits-of-inverse-trigonometric-functions",
  "limits-of-piecewise-functions",
  "determining-continuity-from-graphs",
  "defining-continuity-at-a-point",
  "left-and-right-continuity",
  "further-continuity-of-piecewise-functions",
  "point-discontinuities",
  "jump-discontinuities",
  "discontinuities-due-to-vertical-asymptotes",
  "continuity-over-an-interval",
  "continuity-of-functions",
  "the-intermediate-value-theorem",
  "removing-point-discontinuities",
  "removing-jump-discontinuities",
  "removing-discontinuities-from-rational-functions",
  "the-average-rate-of-change-of-a-function-over-a-varying-interval",
  "the-instantaneous-rate-of-change-of-a-function-at-a-point",
  "defining-the-derivative-using-derivative-notation",
  "continuity-and-differentiability-of-functions",
  "the-power-rule-for-differentiation",
  "the-sum-and-constant-multiple-rules-for-differentiation",
  "calculating-the-slope-of-a-tangent-line-using-differentiation",
  "calculating-the-equation-of-a-tangent-line-using-differentiation",
  "calculating-the-equation-of-a-normal-line-using-differentiation",
];
