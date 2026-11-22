/**
 * taughtCourses lists the courses written to the teaching standard (docs/content.md §4, "Teaching, not stating"):
 * every topic has an introduction, every explanation ends with a callout on its typical mistake, and solutions are
 * worked step by step and check their answer. Its test holds every topic of these courses to it.
 */
export const taughtCourses: readonly string[] = ["algebra-i", "geometry", "algebra-ii"];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "solving-elementary-quadratic-inequalities",
  "solving-quadratic-inequalities-from-graphs",
  "solving-quadratic-inequalities-using-the-graphical-method",
  "solving-quadratic-inequalities-using-the-sign-table-method",
  "determining-unknown-parameters-in-quadratic-equations-with-real-solutions",
  "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
  "determining-unknown-parameters-in-quadratic-equations-advanced-cases",
  "inequalities-involving-powers-of-binomials",
  "solving-polynomial-inequalities-using-a-graphical-method",
  "solving-polynomial-inequalities-using-special-factoring-techniques-and-the-graphical-method",
  "graphing-the-inverse-sine-function",
  "graphing-the-inverse-cosine-function",
  "graphing-the-inverse-tangent-function",
  "evaluating-expressions-containing-inverse-trigonometric-functions",
  "further-evaluating-expressions-containing-inverse-trigonometric-functions",
  "simplifying-expressions-using-basic-trigonometric-identities",
  "simplifying-expressions-using-the-pythagorean-identity",
  "alternate-forms-of-the-pythagorean-identity",
  "simplifying-expressions-using-the-secant-tangent-identity",
  "alternate-forms-of-the-secant-tangent-identity",
  "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity",
  "simplifying-trigonometric-expressions-using-cofunction-identities",
  "the-sum-and-difference-formulas-for-sine",
];
