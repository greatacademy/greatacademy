/**
 * taughtCourses lists the courses written to the teaching standard (docs/content.md §4, "Teaching, not stating"):
 * every topic has an introduction, every explanation ends with a callout on its typical mistake, and solutions are
 * worked step by step and check their answer. Its test holds every topic of these courses to it.
 */
export const taughtCourses: readonly string[] = [
  "algebra-i",
  "geometry",
  "algebra-ii",
  "precalculus",
  "calculus-i",
  "calculus-ii",
  "ap-calculus-ab",
  "ap-calculus-bc",
  "1st-grade-math",
  "2nd-grade-math",
  "3rd-grade-math",
  "4th-grade-math",
  "5th-grade-math",
  "6th-grade-math",
  "7th-grade-math",
  "8th-grade-math",
  "prealgebra",
  "methods-of-proof",
  "linear-algebra",
  "multivariable-calculus",
  "differential-equations",
  "discrete-mathematics",
  "probability-and-statistics",
  "abstract-algebra",
  "number-theory",
];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "the-epsilon-definition-for-sequences",
  "suprema-of-sets-of-reals",
  "the-monotone-convergence-theorem",
  "subsequences-and-the-bolzano-weierstrass-theorem",
  "cauchy-sequences",
  "limit-superior-and-limit-inferior",
  "absolute-and-conditional-convergence-of-series",
  "epsilon-delta-proofs-of-limits",
  "the-sequential-criterion-for-continuity",
  "distances-in-metric-spaces",
  "open-and-closed-sets-of-reals",
  "compactness-on-the-real-line",
  "uniform-continuity",
  "differentiability-in-analysis",
  "bounds-from-the-mean-value-theorem",
  "upper-and-lower-darboux-sums",
  "riemann-integrability",
  "pointwise-and-uniform-convergence",
  "the-weierstrass-m-test",
  "the-contraction-mapping-principle",
];
