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
];

/**
 * taughtTopics lists further topics written to the standard while their course is still being rewritten; once the
 * course is listed in taughtCourses, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "the-and-and-or-connectives",
  "truth-tables",
  "the-not-connective",
  "logical-equivalence",
  "logical-associative-and-commutative-laws",
  "the-distributive-laws",
  "the-absorption-laws",
  "de-morgans-laws-for-logic",
  "conditional-statements",
  "logical-equivalence-with-conditional-statements",
  "biconditional-statements",
  "tautologies-and-contradictions",
  "converse-inverse-and-contrapositive",
  "truth-sets-of-predicates",
  "the-and-and-or-connectives-with-predicates",
  "the-not-connective-with-predicates",
  "simplifying-predicate-expressions-using-de-morgans-laws",
  "conditional-statements-with-predicates",
  "necessary-and-sufficient-conditions",
  "grammatical-constructions-for-conditional-statements",
  "translating-between-logical-and-set-operations",
  "universal-and-existential-quantifiers",
  "negating-quantified-statements",
  "nested-quantifiers",
  "formal-and-informal-language",
  "negating-statements-with-nested-quantifiers",
  "prenex-normal-form",
  "implication-elimination-and-denying-the-consequent",
  "disjunctive-syllogism-and-transitivity-of-implication",
  "additional-rules-of-logical-inference",
  "the-maximum-and-minimum-of-a-set",
  "power-sets",
  "partitions-of-sets",
  "indicator-functions",
  "proving-subset-relations",
  "disjoint-sets",
  "elementary-properties-of-set-operations",
  "proving-elementary-properties-of-set-operations",
  "de-morgans-laws-for-sets",
  "proving-de-morgans-laws-for-sets",
  "distributive-properties-of-set-operations",
  "proving-distributive-properties-of-union-and-intersection",
  "proving-distributive-properties-of-the-cartesian-product",
];
