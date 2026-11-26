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
];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "cumulative-distribution-functions-for-continuous-random-variables",
  "median-quartiles-and-percentiles-of-continuous-random-variables",
  "finding-the-mode-of-a-continuous-random-variable",
  "approximating-discrete-random-variables-as-continuous",
  "simulating-random-observations",
  "the-distribution-function-method",
  "the-change-of-variables-method-for-continuous-random-variables",
  "the-distribution-function-method-with-many-to-one-transformations",
  "the-cdf-of-the-binomial-distribution",
  "the-cdf-of-the-poisson-distribution",
  "mean-and-variance-of-the-negative-binomial-distribution",
  "moments-of-continuous-random-variables",
  "expected-values-of-continuous-random-variables",
  "variance-of-continuous-random-variables",
  "the-rule-of-the-lazy-statistician",
  "moment-generating-functions",
  "calculating-moments-using-moment-generating-functions",
  "calculating-variance-and-standard-deviation-using-moment-generating-functions",
  "constructing-moment-generating-functions-for-discrete-probability-distributions",
  "constructing-moment-generating-functions-for-continuous-probability-distributions",
  "properties-of-moment-generating-functions",
  "the-uniqueness-property-of-mgfs",
];
