/**
 * outlineAliases maps an outline title to the topics that cover it under another title. A course that has one of them
 * covers that outline entry, so the audit does not report it. Add an entry only after reading the topic.
 */
export const outlineAliases: ReadonlyMap<string, readonly string[]> = new Map<string, readonly string[]>([
  ["Introduction to Ratios", ["ratios"]],
  ["The Mean of a Data Set", ["the-mean-of-a-data-set", "mean-of-a-data-set"]],
  ["Units of Time", ["units-of-time-and-elapsed-time"]],
  ["Radicals as Fractional Exponents", ["writing-radicals-using-fractional-exponents"]],
  ["Collecting Like Terms in Linear Expressions", ["simplifying-linear-expressions", "identifying-like-terms-in-linear-expressions"]],
  [
    "Applying the Distributive Law With Linear Expressions",
    ["applying-the-distributive-law-to-linear-expressions", "simplifying-linear-expressions-using-the-distributive-law"],
  ],
  ["The Area Between Two Shapes", ["finding-areas-between-shapes"]],
  ["Comparing Data Sets Using Measures of Centrality", ["comparing-data-sets"]],
  [
    "Modeling and Solving Systems of Linear Inequalities Using Technology",
    ["modeling-with-systems-of-inequalities", "sat-exam-modeling-and-solving-systems-of-linear-inequalities"],
  ],
  ["Converting Units of Area to Smaller Units", ["converting-units-of-area"]],
  ["Converting From Exponential to Logarithmic Form", ["converting-between-exponential-and-logarithmic-form"]],
  ["Converting From Logarithmic to Exponential Form", ["converting-between-exponential-and-logarithmic-form"]],
  ["Solving Exponential Equations With Different Bases", ["solving-exponential-equations"]],
  ["Translating Between Explicit and Recursive Formulas for Geometric Sequences", ["recursive-formulas-for-geometric-sequences"]],
  [
    "Connecting Infinite Limits and Vertical Asymptotes of Rational Functions",
    ["vertical-asymptotes-of-rational-functions", "infinite-limits-of-rational-functions"],
  ],
  ["Partitions", ["partitions-of-natural-numbers"]],
  ["The Euclidian Algorithm in Rings of Polynomials", ["the-euclidian-algorithm-in-rings-of-polynomials"]],
  ["The Extended Euclidian Algorithm in Rings of Polynomials", ["the-extended-euclidian-algorithm-in-rings-of-polynomials"]],
  ["Confidence Intervals for One Means: Finite Population Correction", ["confidence-intervals-for-one-mean-finite-population-correction"]],
  ["Greatest Common Factors", ["greatest-common-factor", "greatest-common-factor-by-listing"]],
  ["Least Common Multiples", ["least-common-multiple"]],
  ["Multiplying by 10, 100, and 1,000 Using Place Value", ["multiplying-by-10-100-and-1000"]],
  ["Multiplying by 10, 100, and 1,000 Using the Pattern of Zeros", ["multiplying-by-10-100-and-1000"]],
  ["Converting Units to of Length to Larger Units Using Long Division", ["converting-units-of-length-to-larger-units-using-long-division"]],
  ["The Perimeter of a Polygon", ["perimeter"]],
  ["Introduction to Circles", ["circles"]],
  ["The Area of a Circle", ["areas-of-circles"]],
  ["Solving Equations Using Square Roots", ["solving-equations-with-square-roots"]],
  [
    "Solving Multi-Step Linear Equations",
    ["multi-step-equations", "solving-multi-step-equations", "equations-with-variables-on-both-sides"],
  ],
  [
    "Solving Real-World Problems Using Systems of Linear Equations",
    ["modeling-with-systems", "word-problems-with-systems", "solving-word-problems-using-systems-of-linear-equations"],
  ],
  [
    "Identifying Where a Function Is Increasing or Decreasing",
    ["increasing-and-decreasing", "determining-intervals-on-which-a-function-is-increasing-or-decreasing"],
  ],
  ["Modeling Real-World Situations With Linear Equations", ["modeling-with-linear-equations"]],
  ["The Sum of Interior Angles of a Triangle", ["angles-of-a-triangle"]],
  ["Reflections of Geometric Figures in the Coordinate Plane", ["reflections-in-the-coordinate-plane"]],
  ["Similar Polygons", ["similarity-and-similar-polygons"]],
  ["Calculating Side Lengths and Angles of Similar Polygons", ["side-lengths-and-angle-measures-of-similar-polygons"]],
  ["Similarity Through Sequences of Transformations", ["similarity-transformations"]],
  ["The Angle-Angle Criterion for Similar Triangles", ["the-aa-similarity-criterion"]],
  ["Applying the Pythagorean Theorem to Find Missing Side Lengths", ["the-pythagorean-theorem"]],
  ["Volumes of Cones", ["volumes-of-right-cones"]],
  ["Working With Lines in Slope-Intercept Form", ["slope-intercept-form", "properties-of-lines-in-slope-intercept-form"]],
  ["Recognizing 30-60-90 Triangles", ["thirty-sixty-ninety-triangles"]],
  [
    "Surface Areas of Combined Prisms",
    ["surface-areas-of-combined-rectangular-prisms", "sat-exam-surface-areas-of-combined-rectangular-prisms"],
  ],
  [
    "Trigonometric Ratios of Large Angles in Degrees",
    ["extending-the-trigonometric-ratios-to-large-angles", "sat-exam-trigonometric-ratios-of-large-special-angles"],
  ],
  [
    "Trigonometric Ratios of Large Angles in Radians",
    ["extending-the-trigonometric-ratios-using-angles-in-radians", "trigonometric-ratios-with-radians"],
  ],
  ["Finding Conditional Probabilities From Frequency Tables", ["conditional-probabilities-from-tables"]],
  ["Interpreting Conditional Statements", ["conditional-statements"]],
  ["Identifying Necessary and Sufficient Conditions", ["necessary-and-sufficient-conditions"]],
  ["Applying Defined Operations on Whole Numbers", ["applying-defined-operations"]],
  ["Writing the Augmented Matrix of a Two-Equation System", ["systems-of-equations-as-augmented-matrices"]],
  ["Inequalities", ["inequalities-and-solutions"]],
  ["Solving Two-Step Inequalities", ["two-step-inequalities", "solving-multi-step-inequalities"]],
]);

/**
 * binaryChoices are knowledge points whose choice has two options by nature, such as *a* or *an*, so the audit does not
 * report them as two-option choices. Add an entry only after reading the knowledge point and its topic's other points.
 */
export const binaryChoices: ReadonlySet<string> = new Set<string>([
  "a-and-an#choose",
  "primary-and-secondary-sources#primary-or-secondary",
]);

/**
 * noDrawingNeeded are knowledge points that name something visual without explaining it, such as the graphs a reader
 * finds in the results of a paper, so the audit does not ask for a drawing. Add an entry only after reading the point.
 */
export const noDrawingNeeded: ReadonlySet<string> = new Set<string>(["reading-a-research-paper#where-to-look"]);
