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
  "real-analysis",
];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "functions-of-a-complex-variable",
  "limits-of-complex-functions",
  "the-complex-derivative",
  "the-cauchy-riemann-equations",
  "harmonic-functions-and-conjugates",
  "the-complex-exponential-function",
  "the-complex-logarithm",
  "contour-integrals",
  "cauchys-integral-theorem",
  "cauchys-integral-formula",
  "cauchys-estimates-and-liouvilles-theorem",
  "taylor-series-of-analytic-functions",
  "laurent-series",
  "classifying-isolated-singularities",
  "computing-residues",
  "the-residue-theorem",
  "mobius-transformations",
  "conformal-maps",
  "power-series-on-discs",
  "complex-trigonometric-and-hyperbolic-functions",
  "complex-powers-and-branches",
  "the-ml-inequality",
  "winding-numbers",
  "zeros-of-analytic-functions",
  "laurent-series-on-annuli",
  "the-argument-principle-and-rouches-theorem",
  "trigonometric-integrals-by-residues",
  "improper-integrals-by-residues",
  "the-cross-ratio",
  "conformal-maps-of-regions",
];
