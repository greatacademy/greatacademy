# Content

> English | [简体中文](content.zh-CN.md)

This document specifies the content model of Great Academy and how content is authored, validated and served. The model lives in `libs/content` and knows nothing about any particular subject; a subject contributes its topics, courses and answer checkers as a `SubjectDef`.

The pedagogical background is in [The Math Academy Way](the-math-academy-way.md); how the engine uses the graph is in [Learning Engine](learning-engine.md).

---

## 1. Concepts

| Concept | Type | Meaning |
| :--- | :--- | :--- |
| Subject | `SubjectDef` | A discipline such as mathematics: one knowledge graph, its courses, its checkers |
| Topic | `TopicDef` | One teachable idea; a node of the knowledge graph and one lesson |
| Knowledge point | `KnowledgePointDef` | One step of a topic: an explanation, a worked example, practice problems |
| Prerequisite edge | `TopicDef.prerequisites` | The topic cannot be learned before these |
| Encompassing edge | `EncompassingDef` | Practicing the topic implicitly practices a fraction (`weight`) of a simpler topic |
| Key prerequisite | `KnowledgePointDef.keyPrerequisites` | The earlier topics a step depends on most directly; used for remediation |
| Course | `CourseDef` | An ordered selection of topics in units and modules, plus a mastery floor |
| Problem | `Problem` | One generated instance: prompt, answer specification, solution, canonical and wrong responses |
| Checker | `Checker` | Judges a response against a problem's expected data |

## 2. Texts and Locales

Every user-visible string is a `Text`: a record with one Markdown string per locale. The locales are `en` and `zh-CN`; mathematics is written in TeX between `$…$` (inline) or `$$…$$` (display).

```ts
import { t, same } from "@ga/content";

t("Add the numbers.", "把这两个数相加。");
same("$3 + 4$");   // identical in every locale
```

The compiler and the generator sampler reject texts that are empty in any locale.

## 3. Topics

```ts
const addingIntegers: TopicDef = {
  id: "adding-integers",
  title: t("Adding Integers", "整数加法"),
  summary: t("Add positive and negative integers.", "正负整数相加。"),
  prerequisites: ["integers-on-the-number-line"],
  encompasses: [{ topic: "integers-on-the-number-line", weight: 0.5 }],
  xp: 12,
  knowledgePoints: [sameSign, differentSigns],
  standards: ["CCSS.7.NS.A.1"],
};
```

Rules:

- **Ids** are kebab case, unique within the subject, and never change once published: learner state refers to them. Knowledge point ids are unique within their topic.
- **Granularity.** A topic is the smallest idea worth a lesson: two to five knowledge points, `xp` (expected minutes for a serious learner) usually between 8 and 25.
- **Prerequisites** list only the direct ones. A prerequisite implied by another prerequisite is redundant and produces a warning.
- **Encompassings** point to ancestors (direct or indirect prerequisites). An equivalent topic that is not an ancestor may be encompassed only with `nonAncestor: true`. `weight` is in (0, 1]: 1 means the whole simpler topic is practiced, 0.5 half of it.
- **Diagnostic knowledge point.** The diagnostic asks one problem per topic, from the knowledge point named by `diagnostic`, or the last one by default, because it is the most complete.

## 4. Knowledge Points and Generators

A knowledge point is one step of the lesson flow: the learner reads its `explanation`, studies a worked example, then answers practice problems from the same generator until they pass ([Learning Engine](learning-engine.md)).

```ts
const sameSign: KnowledgePointDef = {
  id: "same-sign",
  title: t("Same signs", "同号相加"),
  explanation: t("To add two integers with the same sign, …", "两个同号整数相加，…"),
  keyPrerequisites: ["integers-on-the-number-line"],
  generate(rng) {
    const s = rng.sign();
    const a = s * rng.int(2, 30);
    const b = s * rng.int(2, 30);
    return {
      prompt: t(`Evaluate $${a} + (${b})$.`, `计算 $${a} + (${b})$。`),
      answer: { checker: "number", expected: a + b, input: { kind: "math" } },
      solution: t(…, …),
      canonical: String(a + b),
      wrong: [String(Math.abs(a) + Math.abs(b) * -s), String(a - b)],
    };
  },
};
```

A generator is a function from a seeded `Rng` to a `Problem`:

- **Deterministic.** The same seed always produces the same problem. A problem is stored as a reference `{ topic, kp, seed }` and regenerated on the server whenever it is needed, so problems never need to be stored, and the answer never needs to leave the server before the learner responds.
- **No ambient randomness or time.** Use only the `Rng` passed in (`int`, `nonZero`, `sign`, `bool`, `pick`, `shuffle`, `sample`). `createRng` is sfc32 seeded through splitmix32; `hashSeed` turns a string into a seed.
- **Canonical response.** `canonical` is a response the checker must accept, written as a learner would type it. It is also shown after a wrong attempt.
- **Wrong responses.** `wrong` lists the responses that typical mistakes produce (sign errors, adding instead of subtracting, an unsimplified form when a simplified one is required). The checker must reject each of them. They document the misconceptions the step targets and guard the checker against being too lenient.
- **Variety.** A generator must produce enough distinct problems that the practice and reviews of one learner rarely repeat.
- **No give-aways.** A prompt never contains its answer; scaffolding belongs in the explanation, the worked example and extra knowledge points.
- **Termination.** Every loop that retries until a condition holds must succeed for every value its parameters can take. Check the extremes: a divisor of 9 with a two-digit dividend has no quotient of the requested shape, so a generator that drew it and retried would hang the sampler.
- **Every value defined.** Wrong responses are computed from the same parameters as the answer, so guard each one: a denominator that can be zero, a value at a point outside the domain, an index past the end of a list.
- **Template literals.** Text that interpolates `${…}` must be a template literal; inside a plain quoted string it is shown to the learner verbatim.
- **Figures.** A problem may carry a `figure` the prompt refers to, and a knowledge point a `figure` shown with its explanation. A `Figure` is `{ svg, alt }`: a self-contained SVG drawing with a `viewBox`, drawn in `currentColor` so that it follows the client's text color in light and dark themes, with class `accent` on the marks the client may draw in its accent color. Text in the drawing is language-neutral (numbers, letters, units); `alt` describes the figure in every locale for screen readers. Clients inline the SVG, so it may use only drawing elements (`svg`, `g`, `line`, `polyline`, `polygon`, `path`, `circle`, `ellipse`, `rect`, `text`, `tspan`, `title`, `defs`, `marker`), with no event handlers, `style` attributes, links or `url()`.

## 5. Answers and Checkers

`AnswerSpec` tells the server how to check and the client what to show:

| `input.kind` | Client shows | Response |
| :--- | :--- | :--- |
| `choice` | The `options`, in order | The index of the chosen option |
| `math` | A math field, with optional `prefix` and `suffix` (such as `x =` or `\text{cm}`) | The LaTeX the learner entered |
| `text` | A plain text field | The text |

`checker` names a registered checker and `expected` is that checker's data. The core registers two checkers; subjects register their own (for mathematics: numbers, fractions, expressions, equations, and so on).

| Checker | `expected` | Accepts |
| :--- | :--- | :--- |
| `choice` | The index of the correct option | Exactly that index |
| `text` | An array of accepted strings | Any of them, ignoring case, Unicode width and spacing |

A checker returns a `Verdict`: `correct`, and optional `feedback` for a rejection that deserves an explanation (for example "simplify the fraction"). The `CheckerRegistry`:

- rejects two checkers with the same id;
- rejects responses longer than 2,000 characters;
- treats a checker that throws as a rejection.

Checkers must be strict about **value** and explicit about **form**: when a topic teaches simplification, `expected` says that the simplified form is required, and the checker rejects equal but unsimplified answers with feedback.

## 6. Courses

```ts
const prealgebra: CourseDef = {
  id: "prealgebra",
  title: t("Prealgebra", "代数预备"),
  description: t(…, …),
  masteryFloor: ["counting"],
  units: [
    { title: t("Integers", "整数"), modules: [{ title: t("Adding and Subtracting", "加法与减法"), topics: ["adding-integers", …] }] },
  ],
};
```

- A course lists its topics in teaching order, grouped into units and modules for display only.
- Every topic appears once, and after all of its prerequisites that are in the course.
- **Mastery floor.** Topics that every learner of the course is assumed to know. They and their ancestors are never taught or reviewed by the course. A floor topic must not be in the course.
- **Foundations** (computed). Ancestors of course topics that are neither in the course nor below the floor. The diagnostic places the learner on them, and a learner who lacks them is taught them first.

## 7. The Compiler

`compileSubject(def)` validates a `SubjectDef` and builds the indexes the engine uses. Any error throws a `CompileError` listing every issue with a path such as `topic adding-integers › kp same-sign`; warnings are returned in `CompiledSubject.warnings`.

| Checks | Severity |
| :--- | :--- |
| Ids are kebab case and unique; texts are non-empty in every locale; `xp > 0`; at least one knowledge point; the diagnostic knowledge point exists | Error |
| Prerequisites exist, are not the topic itself, are not repeated, and form no cycle | Error |
| A prerequisite implied by another prerequisite | Warning |
| Encompassed topics exist, are ancestors unless marked `nonAncestor`, have weights in (0, 1], and form no cycle | Error |
| Key prerequisites are ancestors of their topic | Error |
| Knowledge point figures are well formed (§4) and have alt text in every locale | Error |
| Course topics exist, are not repeated, follow their in-course prerequisites; floor topics are not in the course | Error |

The compiled graph provides:

- `order`: topics in topological order, stable with respect to definition order;
- `dependents`: the inverse of the prerequisite edges;
- `encompassedBy`: the inverse of the encompassing edges, with weights;
- `ancestors`: the transitive prerequisites of each topic, nearest first.

## 8. Generator Sampling

`sampleGenerators(subject, { samples, minDistinct })` runs every generator over many seeds (200 by default). It reports an error when a generator:

- throws, or is not deterministic;
- produces a text empty in some locale or containing `NaN`, `undefined`, `Infinity` or `[object Object]`;
- carries a figure that is not well formed (§4);
- names an unknown checker;
- for a choice: has fewer than two options, repeated options, or an expected index out of range;
- has a canonical response its checker rejects, or a wrong response its checker accepts.

It warns when fewer than `minDistinct` distinct prompts appear; prompts with different figures count as distinct. Every content package runs `compileSubject` and `sampleGenerators` in its tests, so content cannot be merged in a state the runtime would reject. The option `shard: { index, count }` samples only every `count`-th topic starting at `index`, so a package can split sampling across test files that Vitest runs in parallel; `content/math` uses four.

## 9. Serving Problems

`generateProblem(subject, ref)` regenerates a problem from a `ProblemRef` (`{ topic, kp, seed }`, where `kp` is the knowledge point's index). The server sends the client only `viewOf(problem)`: the prompt, its figure and the input specification. The answer, the canonical response and the solution are revealed only after the learner responds, and the response is checked on the server.

## 10. Mathematics

`libs/subject-math` implements the mathematics checkers on an exact core: a parser for the LaTeX subset that the math input produces (numbers, variables, `+ - \cdot \times \div /`, implicit multiplication, `\frac`, `^`, `\sqrt`, parentheses, `= < > \le \ge`), rational arithmetic on `bigint` (`Q`), and polynomial normal forms. No floating point is involved in judging an answer. The parser keeps the form of the response (parentheses, `\frac` versus `/`, decimals), so checkers judge form as well as value.

| Checker | `expected` | Accepts |
| :--- | :--- | :--- |
| `number` | `{ value, form?, var?, percent?, unit? }`: `value` is a rational such as `"-3"`, `"3/4"` or `"2.5"` | A single number equal to `value`. `form` `"number"` (default): integer, decimal, fraction in lowest terms or mixed number; `"integer"`; `"fraction"` (no decimals); `"decimal"`; `"mixed"` (integer, mixed number or proper fraction). Arithmetic such as `3+4` is rejected with feedback. With `var`, `x = 3` and `3 = x` are accepted too. With `percent`, the field is followed by `%` and a `%` typed by the learner is ignored; likewise with `unit`, `"°"` or a unit such as `"cm"` or `"cm^2"` |
| `expression` | `{ expr, form?, positive? }`: `expr` is LaTeX | An expression equivalent to `expr`: polynomials are compared exactly; other expressions exactly at several rational points, with roots kept exact as sums of terms c·ⁿ√r (so 3∛(2x²) equals ∛(54x²)); points where a value leaves that form, such as a fractional power of a negative number, are skipped. Expressions may contain roots `\sqrt[n]{…}`, absolute values `|…|`, fractional exponents (`x^{\frac{3}{4}}` is ⁴√(x³), `200(0.5)^{\frac{t}{3}}`) and variable exponents (`x^{a+b}` equals `x^{a}x^{b}`). With `positive: true`, only positive values are substituted, so that √(x²) equals x. With `form: "simplified"`, the response must be a sum of monomials in simplest form with no like terms, no parentheses, no unit coefficients and no doubled signs, where a monomial may have a monomial denominator that shares no variable or number factor with its numerator, such as $\frac{8x^{6}}{27y^{3}}$; with `form: "radical"`, in simplest radical form: at most one root per term, no perfect nth-power factor under an nth root (a number, a variable exponent of n or more, or a polynomial factor repeated n times, so $\sqrt{x^2-6x+9}$ is not simplest), no fraction under a root, no root in a denominator, no number factor or fraction inside absolute value bars (6|x|, not |-6x|), and no like terms, where a sum with integer coefficients may stand over a number that shares no factor with all of them, such as $\frac{3+\sqrt{5}}{2}$; with `form: "lowest"`, a polynomial or one fraction of polynomials in lowest terms, each written expanded or as a product of simplified factors (at most one number, written first, powers of distinct variables, and sums in parentheses, so neither $2 \cdot 3x^{5}$ nor $(2x^{2})^{3}$ qualifies), with no common factor (in several variables, only common numbers and monomials are detected); with `form: "vertex"`, a quadratic in vertex form $a(x-h)^{2}+k$ with a single squared binomial, a, h and k numbers in simplest form, a omitted when it is 1, k omitted when it is 0 and $ax^{2}+k$ when h is 0: `2(x-3)^{2}+1`, `-(x+1)^{2}-4`, `(x-5)^{2}`; another equivalent form is rejected with feedback |
| `inequality` | `{ var, op, value }`: `op` is `<`, `<=`, `>` or `>=` | `x < 3` or the equivalent `3 > x`, with the number written as for `number` |
| `factorization` | `{ value }`: an integer ≥ 2 | A product of primes and powers of primes equal to `value`, in any order: `2^{3} \cdot 3` or `2 \cdot 2 \cdot 2 \cdot 3`. A product with a composite factor, or `value` itself when it is composite, is rejected with feedback |
| `scientific` | `{ value }`: a rational | `value` in scientific notation, `a \times 10^{n}` (or `\cdot`) with `1 ≤ \|a\| < 10` written as an integer or decimal, or `10^{n}` alone. The same value in another form is rejected with feedback |
| `radical` | `{ coef, radicand }`: a rational and a square-free integer ≥ 1 | `coef·√radicand` in simplest radical form: `6\sqrt{2}`, `-\sqrt{5}`, `\frac{2\sqrt{3}}{3}` or `\frac{2}{3}\sqrt{3}`; with radicand 1, a rational. The same value with a square factor under the root, a root in the denominator or a fraction not in lowest terms is rejected with feedback |
| `solutions` | `{ var, values }`: the solutions in LaTeX, rationals or numbers such as `\frac{3+\sqrt{5}}{2}`; empty when there are none | The solution set: the solutions in any order, separated by commas, semicolons or "or", each alone or as `x = …`, with `\pm` allowed (`x = \pm 3`, `\frac{3 \pm \sqrt{5}}{2}`); `\varnothing`, `\emptyset` or "no solution" when there are none. Repeated solutions count once. Each number must be in simplest form, otherwise it is rejected with feedback |
| `interval` | `{ set, form?, var? }`: `set` in interval notation; `form` is `"interval"` or `"inequality"` | A set of real numbers equal to `set`. With `form` `"interval"`, in interval notation: `(-2, 5]`, `(-\infty, 1) \cup [3, \infty)`, `\mathbb{R}`, `\varnothing`, single points as `\{3\}`; with `"inequality"`, as inequalities in `var`: `-2 < x \le 5`, `x < 1 \text{ or } x \ge 3`, `x > 0 \text{ and } x \le 4`, `x = 3`; without `form`, either. "No solution" is accepted for the empty set in either form. A response in the other form is rejected with feedback; endpoints are numbers in simplest form |
| `point` | `{ values, vars? }`: rationals | An ordered pair or tuple equal to `values`: `(3, -2)`, or, with `vars`, `x = 3, y = -2` in any order; each number as for `number` |
| `equation` | `{ eq, form?, vars? }`: a polynomial equation in LaTeX; `form` is `"slope-intercept"`, `"standard"` or `"point-slope"` | An equation whose sides differ by a nonzero multiple of those of `eq`: `4x - 2y + 6 = 0` for `y = 2x + 3`. `form` requires the form of a line in `vars` (`x` and `y` by default): `y = mx + b` with the right side simplified; `Ax + By = C` with integers without a common factor and `A > 0`; or `y - k = m(x - h)`. An equivalent equation in another form is rejected with feedback |
| `factored` | `{ expr }`: a polynomial in LaTeX, factored completely over the integers | A complete factorization of `expr`: equivalent, with as many nonconstant factors (counted with multiplicity) as `expr`, each with integer coefficients without a common factor, times an integer, in any order: `2(x + 1)(x - 3)` or `-2(3 - x)(x + 1)`. `(2x + 2)(x - 3)` and `2(x^2 - 2x - 3)` are rejected with feedback |

`content/math` builds problems with `numberProblem`, `expressionProblem`, `inequalityProblem`, `factorizationProblem`, `scientificProblem`, `radicalProblem`, `solutionsProblem`, `intervalProblem`, `pointProblem`, `equationProblem`, `factoredProblem` and `choiceProblem`, which fill in the answer specification, the canonical response and the input (`expressionProblem` takes the form to require, `positive`, and a `prefix` such as `y =` shown before the field), and drop listed wrong responses that happen to equal the answer for a given seed. LaTeX for prompts and solutions is written with `num`, `paren`, `poly` and `linear`, which never produce `+ -`, `1x` or `-1x`, with `dec` for decimals, `sci` for scientific notation `radical` for simplest radical form and `surdLatex` for numbers $a + b\sqrt{m}$ (`surdValue` computes them exactly). Sets of real numbers are built with `union`, `intersect` and `parseIntervals` and written with `intervalLatex` and `inequalityLatexOf`. Figures are drawn with `dotPlot` and `boxPlot` over an `Axis`, and geometry figures with `sketch` from marks in the figure's own coordinates: segments, polygons, angle arcs, right-angle marks, labels, side lengths, ticks for equal sides and arrows for parallel lines. Graphs are drawn with `plane` in a window of the coordinate plane: a grid, the axes with numbers, curves $y = f(x)$, lines, segments, filled and open points, labels, and regions shaded where several half-planes hold, all clipped to the window. `sketch` scales every drawing to about the same size, so labels keep one size, and fits the view box to everything drawn, labels included. The canonical response of a decimal or mixed-number answer is written in that form.

Pitfalls when writing mathematics generators:

- Numeric wrong responses are integers or `Q` values: `wrong` is checked exactly on `bigint`, and a fraction computed in floating point, such as `n / 10`, throws. Build such values with `Q.of(a, b)` or as LaTeX strings.
- The `expression` checker compares expressions at fixed rational sample points up to about ±15 and needs at least three points where both sides are defined. An answer defined only far from zero, such as $\sqrt{x - 20}$, cannot be checked; keep shifts and domains within that range. The parser does not read `\log` or `\ln`, so logarithmic answers are numbers, solutions or choices.
- Avoid answers that land on a rounding boundary: when a prompt asks to round, choose values whose exact result is not within rounding error of a half.
- Every topic in a topic file goes into the list the file exports and `src/index.ts` spreads; a topic missing from it is silently absent, and topics that depend on it fail to compile.

The first course, **Foundations of Algebra** (`algebra-foundations`), has 20 topics in four units: integers (opposites and comparison, absolute value, the four operations, powers, order of operations), algebraic expressions (evaluating, combining like terms, the distributive property, simplifying), linear equations (one-step, two-step, variables on both sides including no solution and infinitely many, parentheses) and linear inequalities (checking and writing solutions, one-step including reversing the symbol, multi-step).

**Prealgebra** (`prealgebra`) has 72 topics in ten units. It adds 52 topics to those of Foundations of Algebra: number theory (divisibility rules, primes and composites, prime factorization, greatest common factor, least common multiple), fractions (equivalent fractions, adding and subtracting, mixed numbers, multiplying, dividing), decimals and percents (converting fractions and decimals, decimal arithmetic, percents, percent of a number, percent change), negative fractions, exponents (powers of rational numbers, zero and negative exponents, the rules of exponents, scientific notation and operations in it), radicals (square and cube roots, simplifying square roots, adding and subtracting radicals, rationalizing denominators), ratios and proportions (ratios, unit rates, proportions), statistics (the mean, the median and the mode, the range and the interquartile range, the mean absolute deviation, comparing data sets, outliers, dot plots, box plots), and geometry (angles and angle measures, complementary and supplementary angles, vertical angles, parallel lines and transversals, classifying triangles, the angles of a triangle, exterior angles, isosceles and equilateral triangles, the angles of polygons, perimeter, the areas of rectangles, parallelograms, triangles and trapezoids, composite shapes). The two courses share their common topics: a learner's progress on a topic counts in both, and the diagnostic of the second course asks only about the topics not yet learned ([Learning Engine §9](learning-engine.md#9-diagnostic)).

**Algebra I** (`algebra-i`) has 224 topics in fourteen units. Equations and inequalities (26 topics): equations and inequalities with unknown coefficients, many-variable equations and rearranging formulas, interpreting linear expressions, modeling with linear equations (consecutive integers, speed, distance and time, work and mixtures), compound inequalities with interval notation, unions and intersections, modeling with inequalities, and equations solved with square roots and nth roots. Two-variable equations and inequalities (34 topics): the coordinate plane, slope, slope-intercept, point-slope and standard form with the properties of lines in each, parallel and perpendicular lines, linear models and their graphs, distance–time and speed–time graphs, and systems of linear equations solved by graphing, elimination and substitution, with no or infinitely many solutions, consistency and dependency, intersections of lines, modeling and coin problems, and linear inequalities in two variables and their systems, graphed and modeled. Units (13 topics): metric units of mass and length, two-step conversions, units of time, mixed units, units of area, units in formulas and rates of change, degrees of accuracy, and direct and inverse variation with their models. Polynomials (20 topics): terms and degree, simplifying, the distributive law, adding and subtracting, multiplying binomials and polynomials, squaring binomials, Pascal's triangle, the difference of squares, and factoring by greatest common factors, perfect-square trinomials, differences of squares and trinomials with and without leading coefficients. Quadratic equations (17 topics): perfect-square equations, the zero product rule, solving by factoring, completing the square, the quadratic formula and the discriminant, equations with exactly one solution, modeling, equating coefficients and Vieta's formulas. Radical expressions (12 topics): roots of algebraic perfect squares and cubes with their domain restrictions, simplifying, multiplying and dividing, evaluating, adding and subtracting radical expressions, rationalizing one- and two-term denominators, and radical equations with extraneous solutions. Rational expressions and equations (7 topics): equivalent expressions with fractions, excluded values, simplifying rational expressions by cancelling monomials and factors, and rational equations solved directly, by cross-multiplication, with binomials and by taking reciprocals, rejecting excluded values. Functions (18 topics): functions and their representations and graphs, the vertical line test, domain and range, extrema, end behavior, roots, increasing and decreasing intervals, piecewise functions, linear functions as models, the arithmetic of functions, composition and an introduction to inverse functions. Absolute value (14 topics): absolute value expressions and their product and quotient rules; absolute value equations, including isolating first, |u| = |v| and extraneous solutions; absolute value inequalities; and graphs of y = a|x − h| + k with reflections, stretches, combined transformations, domain and range, and roots. Exponential functions (22 topics): fractional exponents and the rules of exponents with algebraic expressions, exponential equations, exponential growth and decay expressions and models with their interpretation, linear versus exponential change, and graphs of exponential functions. Quadratic functions (12 topics): graphs of quadratic functions and their reflections, roots and the discriminant, the axis of symmetry and the average of the roots, vertex form, domain and range, and systems of a line and a parabola. Modeling with quadratic functions (6 topics): vertical motion, and revenue, cost and profit functions with maximum profit and break-even points. Sequences (16 topics): recursive sequences and the Fibonacci sequence; arithmetic sequences with their recursive and explicit formulas, terms from two terms, the index of a term and modeling; and geometric sequences with the same ideas. Bivariate statistics (7 topics): scatter plots, trend lines and their equations, predictions and residuals, the meaning of a trend line's slope and intercept, the direction and strength of linear correlation, correlation and causation, and choosing a linear, exponential or quadratic model. Its topics build on those of Prealgebra, whose progress carries over.
