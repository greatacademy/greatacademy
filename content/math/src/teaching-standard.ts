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
];
