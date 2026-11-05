import type { CourseDef } from "@ga/content";
import { t } from "@ga/content";

import { earlyGradesMoreUnits } from "./topics/early-grades-more.ts";

/** algebraFoundations is the first course: integers, expressions, linear equations and inequalities. */
export const algebraFoundations: CourseDef = {
  id: "algebra-foundations",
  title: t("Foundations of Algebra", "代数基础"),
  description: t(
    "Integers and their operations, algebraic expressions, and linear equations and inequalities in one variable: the core of a prealgebra course, preparing for Algebra I.",
    "整数及其运算、代数式、一元一次方程与不等式：代数预备课程的核心内容，为代数一做准备。",
  ),
  units: [
    {
      title: t("Integers", "整数"),
      modules: [
        { title: t("The Number Line", "数轴"), topics: ["integers-and-opposites", "absolute-value"] },
        { title: t("Adding and Subtracting", "加法与减法"), topics: ["adding-integers", "subtracting-integers"] },
        {
          title: t("Multiplying, Dividing and Powers", "乘法、除法与乘方"),
          topics: ["multiplying-integers", "dividing-integers", "powers-of-integers", "order-of-operations-with-integers"],
        },
      ],
    },
    {
      title: t("Algebraic Expressions", "代数式"),
      modules: [
        { title: t("Variables", "变量"), topics: ["evaluating-expressions"] },
        { title: t("Simplifying", "化简"), topics: ["combining-like-terms", "distributive-property", "simplifying-expressions"] },
      ],
    },
    {
      title: t("Linear Equations", "一元一次方程"),
      modules: [
        {
          title: t("One and Two Steps", "一步与两步"),
          topics: ["one-step-equations-addition", "one-step-equations-multiplication", "two-step-equations"],
        },
        { title: t("Multi-Step Equations", "多步方程"), topics: ["equations-with-variables-on-both-sides", "equations-with-parentheses"] },
      ],
    },
    {
      title: t("Linear Inequalities", "一元一次不等式"),
      modules: [
        {
          title: t("Solving Inequalities", "解不等式"),
          topics: ["inequalities-and-solutions", "solving-one-step-inequalities", "solving-multi-step-inequalities"],
        },
      ],
    },
  ],
};

/**
 * prealgebra is the bridge from arithmetic to Algebra I, following the full
 * Prealgebra outline: ratios and percentages, rational numbers and number
 * theory, exponents and radicals, expressions, linear equations and
 * inequalities with their graphs, geometry, and statistics.
 */
export const prealgebra: CourseDef = {
  id: "prealgebra",
  title: t("Prealgebra", "代数预备"),
  description: t(
    "A review of fractions and decimals; ratios, rates, proportional relationships and percentages; operations with rational numbers and number theory; exponents, scientific notation, order of operations and radicals; algebraic expressions; linear equations and inequalities, graphs of lines and systems of equations; angles, triangles, polygons, perimeter, area and volume; and summarizing and representing data.",
    "分数与小数复习；比、率、比例关系与百分数；有理数运算与数论初步；指数、科学记数法、运算顺序与根式；代数式；一次方程与不等式、直线图像与方程组；角、三角形、多边形、周长、面积与体积；数据的概括与展示。",
  ),
  units: [
    {
      title: t("Fractions and Decimals", "分数与小数"),
      modules: [
        {
          title: t("Fractions and Decimals", "分数与小数"),
          topics: ["equivalent-fractions", "mixed-numbers", "fractions-and-decimals", "decimal-arithmetic"],
        },
      ],
    },
    {
      title: t("Ratios and Percentages", "比与百分数"),
      modules: [
        {
          title: t("Ratios", "比"),
          topics: [
            "ratios",
            "equivalent-ratios",
            "writing-ratios-using-fractions",
            "reasoning-with-equivalent-ratios",
            "further-reasoning-with-equivalent-ratios",
            "ratio-tables",
            "graphing-ratios",
          ],
        },
        {
          title: t("Unit Rates", "单位率"),
          topics: [
            "unit-rates",
            "solving-problems-using-unit-rates",
            "speed-as-a-unit-rate",
            "unit-rates-associated-with-ratios-of-fractions",
            "solving-unit-rate-problems-using-ratios-of-fractions",
          ],
        },
        {
          title: t("Proportional Relationships", "比例关系"),
          topics: [
            "understanding-proportional-relationships-using-tables",
            "understanding-proportional-relationships-using-graphs",
            "understanding-proportional-relationships-from-descriptions",
          ],
        },
        {
          title: t("Percentages", "百分数"),
          topics: [
            "understanding-percentages-using-models",
            "converting-between-percentages-and-fractions",
            "converting-between-percentages-and-decimals",
            "comparing-fractions-percents-and-decimals",
            "finding-part-of-a-number-given-a-whole-and-a-percentage",
            "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems",
            "finding-a-percentage-given-two-numbers",
            "finding-a-percentage-given-two-numbers-word-problems",
            "finding-a-total-given-a-part-and-a-percentage",
            "applying-percentage-increases",
            "applying-percentage-decreases",
            "calculating-percentage-change",
            "applying-percentages-in-succession",
          ],
        },
        {
          title: t("Percentage Change", "百分比增减、利息与折扣"),
          topics: ["finding-original-values-from-percentage-increases", "finding-original-values-from-percentage-decreases"],
        },
      ],
    },
    {
      title: t("The Number System", "数系"),
      modules: [
        {
          title: t("Addition and Subtraction of Rational Numbers", "有理数的加减"),
          topics: [
            "subtracting-a-positive-number-from-a-smaller-positive-number",
            "subtracting-a-positive-number-from-a-negative-number",
            "subtracting-a-positive-fraction-from-a-smaller-fraction",
            "subtracting-a-positive-decimal-from-a-smaller-decimal",
            "adding-a-positive-number-to-a-negative-number",
            "adding-a-negative-number",
            "subtracting-a-negative-number",
            "additive-inverses-of-numbers",
            "interpreting-additive-opposites-and-addition-using-absolute-value",
            "solving-problems-using-addition-and-subtraction-of-rational-numbers",
          ],
        },
        {
          title: t("Multiplication and Division of Rational Numbers", "有理数的乘除"),
          topics: [
            "multiplying-positive-numbers-with-negative-numbers",
            "multiplying-negative-numbers",
            "dividing-with-negative-numbers",
            "equivalent-fractions-with-negative-numbers",
            "dividing-with-negative-decimals-and-fractions",
            "reciprocals-of-rational-numbers",
            "multiplying-and-dividing-with-zero",
            "fractions-of-fractions",
            "solving-problems-using-multiplication-and-division-of-rational-numbers",
            "solving-problems-using-the-four-operations-on-rational-numbers",
          ],
        },
        {
          title: t("Number Theory", "数论初步"),
          topics: [
            "divisibility-of-integers-by-2-5-10-4-and-8",
            "divisibility-of-integers-by-3-9-6-and-7",
            "natural-numbers-integers-and-rational-numbers",
            "rational-numbers-as-finite-or-repeating-decimals",
            "prime-and-composite-numbers",
            "prime-factors",
            "the-fundamental-theorem-of-arithmetic",
            "finding-greatest-common-factors-using-prime-factorization",
            "finding-lowest-common-multiples-using-prime-factorization",
          ],
        },
      ],
    },
    {
      title: t("Exponents and Radicals", "指数与根式"),
      modules: [
        {
          title: t("Exponents", "指数"),
          topics: [
            "squaring-rational-numbers",
            "cubing-rational-numbers",
            "exponents-with-rational-bases",
            "powers-of-rational-numbers",
            "the-zeroth-power",
            "powers-of-negative-one",
            "negative-exponents",
          ],
        },
        {
          title: t("The Rules of Exponents", "指数法则"),
          topics: [
            "the-product-rule-for-exponents",
            "the-quotient-rule-for-exponents",
            "the-power-rule-for-exponents",
            "the-power-of-product-rule-for-exponents",
            "the-power-of-quotient-rule-for-exponents",
            "combining-the-rules-of-exponents",
          ],
        },
        {
          title: t("Scientific Notation", "科学记数法"),
          topics: [
            "writing-numbers-in-scientific-notation",
            "converting-scientific-notation-to-standard-notation",
            "comparing-numbers-in-scientific-notation",
            "addition-and-subtraction-in-scientific-notation",
            "addition-in-scientific-notation-with-different-powers-of-ten",
            "subtraction-in-scientific-notation-with-different-powers-of-ten",
            "further-addition-in-scientific-notation-with-different-powers-of-ten",
            "multiplying-numbers-in-scientific-notation",
            "dividing-numbers-in-scientific-notation",
          ],
        },
        {
          title: t("Order of Operations", "运算顺序"),
          topics: [
            "evaluating-rational-number-expressions-without-exponents",
            "evaluating-expressions-with-positive-integer-exponents",
            "evaluating-expressions-with-integer-exponents",
          ],
        },
        {
          title: t("Radicals", "根式"),
          topics: [
            "the-square-root-of-a-perfect-square",
            "squaring-a-square-root",
            "the-cube-root-of-a-perfect-cube",
            "approximating-square-roots",
            "classifying-rational-and-irrational-numbers",
            "surds",
            "evaluating-radical-expressions",
            "rationalizing-denominators",
          ],
        },
        {
          title: t("The Rules of Radicals", "根式运算法则"),
          topics: ["writing-radicals-using-fractional-exponents", "the-product-rule-for-radicals", "the-quotient-rule-for-radicals"],
        },
      ],
    },
    {
      title: t("Algebraic Expressions", "代数式"),
      modules: [
        {
          title: t("Algebraic Expressions", "代数式"),
          topics: [
            "introduction-to-algebraic-expressions",
            "constructing-algebraic-expressions",
            "evaluating-linear-expressions",
            "evaluating-rational-expressions",
            "identifying-terms-in-linear-expressions",
            "identifying-coefficients-and-constants",
            "the-greatest-common-factor-of-two-linear-expressions",
          ],
        },
        {
          title: t("Simplifying Linear Expressions", "化简一次式"),
          topics: [
            "identifying-like-terms-in-linear-expressions",
            "combining-like-terms",
            "evaluating-numerical-expressions-containing-radicals",
            "adding-and-subtracting-radicals",
            "simplifying-expressions-with-surds",
            "applying-the-distributive-law-to-linear-expressions",
            "the-distributive-law-with-three-terms",
            "distributing-the-negative-sign-in-a-linear-expression",
            "simplifying-linear-expressions-using-the-distributive-law",
            "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted",
            "simplifying-linear-expressions-containing-fractions",
            "factoring-numerical-expressions",
            "factoring-linear-expressions",
          ],
        },
      ],
    },
    {
      title: t("Equations and Inequalities", "方程与不等式"),
      modules: [
        {
          title: t("Solving One-Step Linear Equations", "解一步一次方程"),
          topics: ["solving-linear-equations-by-trial-and-error", "one-step-equations-addition", "one-step-equations-multiplication"],
        },
        {
          title: t("Solving Multi-Step Linear Equations", "解多步一次方程"),
          topics: [
            "two-step-equations",
            "solving-linear-equations-with-fractional-coefficients",
            "solving-linear-equations-with-decimal-coefficients",
            "equations-with-variables-on-both-sides",
            "solving-linear-equations-by-clearing-a-rational-expression",
            "solving-linear-equations-using-cross-multiplication",
            "two-variable-linear-equations-and-their-solutions",
            "solving-two-variable-equations",
            "linear-equations-with-infinitely-many-solutions",
            "linear-equations-with-no-solutions",
          ],
        },
        {
          title: t("Solving Linear Inequalities", "解一次不等式"),
          topics: [
            "inequalities-and-solutions",
            "compound-inequalities",
            "verifying-solutions-of-linear-inequalities",
            "solving-one-step-inequalities",
            "solving-multi-step-inequalities",
            "representing-solutions-to-inequalities-on-number-lines",
            "further-solving-linear-inequalities",
          ],
        },
        {
          title: t("Graphs of Linear Equations", "直线图像"),
          topics: [
            "the-cartesian-coordinate-system",
            "distances-between-points-in-the-coordinate-plane",
            "graphing-linear-equations",
            "horizontal-and-vertical-lines",
            "slope-of-a-line",
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
          ],
        },
        {
          title: t("Systems of Equations", "方程组"),
          topics: ["systems-of-linear-equations", "solving-systems-by-substitution"],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Introduction to Geometry", "几何初步"),
          topics: [
            "units-of-area-and-volume",
            "points-lines-rays-and-segments",
            "measures-of-segments",
            "congruent-segments",
            "midpoints",
            "collinear-points",
            "the-segment-addition-postulate",
          ],
        },
        {
          title: t("Angles", "角"),
          topics: [
            "angles-and-angle-measures",
            "connecting-angles-and-circles",
            "measuring-angles-using-a-protractor",
            "sums-of-angles",
            "right-straight-full-and-null-angles",
            "parallel-and-perpendicular-lines",
            "acute-obtuse-and-reflex-angles",
            "congruent-angles",
            "vertical-angles",
          ],
        },
        {
          title: t("Advanced Angles", "三角形内外角"),
          topics: [
            "complementary-angles",
            "non-adjacent-complementary-angles",
            "supplementary-angles",
            "solving-problems-with-angles",
            "corresponding-angles",
            "alternate-angles",
            "consecutive-angles",
            "angle-criteria-for-parallel-lines",
            "angle-bisectors",
            "segment-bisectors-and-the-perpendicular-bisector-theorem",
          ],
        },
        {
          title: t("Triangles", "三角形"),
          topics: [
            "angles-of-a-triangle",
            "exterior-angles-of-triangles",
            "problem-solving-with-angles-of-triangles",
            "classifying-triangles",
            "the-triangle-inequality",
            "isosceles-triangles",
            "heights-of-triangles",
          ],
        },
        {
          title: t("Polygons", "多边形"),
          topics: ["polygons", "angles-of-polygons", "exterior-angles-of-polygons", "congruent-polygons", "regular-polygons", "perimeter"],
        },
        {
          title: t("Quadrilaterals", "四边形"),
          topics: ["classifying-quadrilaterals", "properties-of-rectangles-and-squares", "properties-of-trapezoids"],
        },
        {
          title: t("Area and Perimeter", "面积与周长"),
          topics: [
            "area-of-rectangles-and-squares",
            "area-of-parallelograms",
            "areas-of-triangles",
            "area-of-trapezoids",
            "composite-shapes",
            "finding-areas-between-shapes",
          ],
        },
      ],
    },
    {
      title: t("Statistics", "统计"),
      modules: [
        {
          title: t("Summarizing Data", "数据的概括"),
          topics: [
            "introduction-to-statistics",
            "the-mean-of-a-data-set",
            "the-median-of-a-data-set",
            "the-mode-of-a-data-set",
            "range-quartiles-and-iqr",
            "mean-absolute-deviation",
            "comparing-data-sets",
            "outliers",
            "removing-outliers",
            "comparing-measures-of-center",
            "box-plots",
            "comparing-data-sets-using-range-and-quartiles",
            "comparing-measures-of-spread",
            "dot-plots",
            "frequency-tables",
            "measuring-centrality-from-dot-plots",
            "measuring-range-and-mad-from-dot-plots",
            "comparing-data-set-visualizations-using-standard-deviation-and-mad",
            "comparing-data-sets-using-standard-deviation-and-mad",
          ],
        },
        {
          title: t("Representing Data", "数据展示"),
          topics: ["measuring-quartiles-and-iqr-from-dot-plots", "symmetry-skew-and-outliers", "histograms"],
        },
      ],
    },
  ],
};

/** algebraI is the first high-school algebra course. */
export const algebraI: CourseDef = {
  id: "algebra-i",
  title: t("Algebra I", "代数一"),
  description: t(
    "Linear equations with parameters, formulas and word problems; compound inequalities and interval notation; equations solved with roots; the coordinate plane, equations of lines, linear models and their graphs, systems of linear equations and linear inequalities in two variables; units and variation; polynomials, their products and factoring; quadratic equations; radical expressions and equations; rational expressions and equations; functions, their features and their composition; absolute value equations, inequalities and graphs; rules of exponents, exponential equations and exponential growth and decay; quadratic functions, parabolas and quadratic models; arithmetic and geometric sequences; and scatter plots, trend lines and correlation.",
    "含参数的一次方程、公式变形与应用题；复合不等式与区间记号；用开方解方程；坐标平面、直线方程、一次模型及其图像、二元一次方程组与二元一次不等式；单位与比例关系；多项式的乘法与因式分解；一元二次方程；根式及根式方程；分式及分式方程；函数及其性质、运算与复合；绝对值方程、不等式与图像；指数法则、指数方程与指数增长和衰减；二次函数、抛物线与二次模型；等差数列与等比数列；散点图、趋势线与相关性。",
  ),
  units: [
    {
      title: t("Equations and Inequalities", "方程与不等式"),
      modules: [
        {
          title: t("Linear Equations", "一次方程"),
          topics: [
            "linear-equations-with-unknown-coefficients",
            "unknown-coefficients-by-factoring",
            "linear-inequalities-with-parameters",
            "many-variable-equations",
            "rearranging-formulas",
          ],
        },
        {
          title: t("Modeling With Linear Equations", "用一次方程建模"),
          topics: [
            "interpreting-linear-expressions",
            "modeling-with-linear-equations",
            "consecutive-integer-problems",
            "speed-distance-time",
            "further-speed-distance-time",
            "work-problems",
            "mixture-problems",
          ],
        },
        {
          title: t("Linear Inequalities", "一次不等式"),
          topics: [
            "solving-compound-inequalities",
            "interval-notation",
            "unbounded-intervals",
            "unions-of-intervals",
            "intersections-of-intervals",
            "compound-or-inequalities",
            "compound-and-inequalities",
          ],
        },
        {
          title: t("Modeling With Inequalities", "用不等式建模"),
          topics: [
            "introduction-to-modeling-with-inequalities",
            "modeling-with-one-step-inequalities",
            "modeling-with-two-step-inequalities",
            "modeling-with-compound-inequalities",
          ],
        },
        {
          title: t("Nonlinear Equations", "非线性方程"),
          topics: ["solving-equations-with-square-roots", "solving-odd-power-equations", "solving-even-power-equations"],
        },
      ],
    },
    {
      title: t("Two-Variable Equations and Inequalities", "二元方程与不等式"),
      modules: [
        { title: t("The Coordinate Plane and Slope", "坐标平面与斜率"), topics: ["the-coordinate-plane", "slope-of-a-line"] },
        {
          title: t("Equations of Lines", "直线方程"),
          topics: [
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
            "point-slope-form",
            "standard-form",
            "properties-of-lines-in-standard-form",
            "parallel-lines-in-the-coordinate-plane",
            "perpendicular-lines-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Modeling With Linear Equations and Graphs", "一次方程与图像建模"),
          topics: [
            "modeling-with-two-variable-linear-equations",
            "modeling-totals-with-two-variable-equations",
            "analyzing-graphs-of-linear-models",
            "further-modeling-with-two-variable-equations",
            "distance-time-graphs",
            "speed-time-graphs",
            "distance-from-speed-time-graphs",
          ],
        },
        {
          title: t("Systems of Linear Equations", "二元一次方程组"),
          topics: [
            "systems-of-linear-equations",
            "introduction-to-elimination",
            "elimination-with-one-transformation",
            "elimination-with-two-transformations",
            "systems-with-fractional-coefficients",
            "systems-with-decimal-coefficients",
            "systems-with-no-solution-or-infinitely-many-solutions",
            "consistency-and-dependency",
            "solving-systems-by-substitution",
            "intersection-of-two-lines",
            "modeling-with-systems",
            "coin-problems",
            "approximating-solutions-to-systems-of-linear-equations",
          ],
        },
        {
          title: t("Two-Variable Linear Inequalities", "二元一次不等式"),
          topics: [
            "graphing-strict-linear-inequalities",
            "graphing-non-strict-linear-inequalities",
            "further-graphing-linear-inequalities",
            "systems-of-linear-inequalities",
            "modeling-with-two-variable-inequalities",
            "modeling-with-systems-of-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Units", "单位"),
      modules: [
        {
          title: t("Unit Conversions", "单位换算"),
          topics: [
            "metric-units-of-mass",
            "metric-units-of-length",
            "two-step-unit-conversions",
            "unit-conversions-using-base-units-of-mass",
            "units-of-time",
            "mixed-units",
            "unit-conversions-using-base-units-of-length",
            "unit-conversions-using-units-of-time",
            "converting-units-of-area",
          ],
        },
        {
          title: t("Working With Units", "单位的运用"),
          topics: ["converting-units-of-area-to-larger-units", "units-in-formulas", "units-of-rates-of-change", "degrees-of-accuracy"],
        },
        {
          title: t("Direct and Inverse Variation", "正比例与反比例"),
          topics: ["direct-variation", "modeling-with-direct-variation", "inverse-variation", "modeling-with-inverse-variation"],
        },
      ],
    },
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Polynomials", "多项式"),
          topics: [
            "introduction-to-polynomials",
            "degree-of-a-polynomial",
            "simplifying-polynomials",
            "distributive-law-for-polynomials",
            "adding-and-subtracting-polynomials",
            "monomials-binomials-and-trinomials",
          ],
        },
        {
          title: t("Multiplying Polynomials", "多项式的乘法"),
          topics: [
            "multiplying-binomials",
            "multiplying-polynomials",
            "squaring-binomials",
            "expanding-binomials-using-pascals-triangle",
            "difference-of-squares-formula",
          ],
        },
        {
          title: t("Factoring Polynomials", "因式分解"),
          topics: [
            "greatest-common-factor-of-monomials",
            "factoring-polynomials-using-gcfs",
            "factoring-perfect-square-trinomials",
            "factoring-perfect-square-trinomials-with-leading-coefficients",
            "factoring-differences-of-squares",
            "factoring-trinomials",
            "factoring-trinomials-using-common-factors",
            "factoring-trinomials-with-leading-coefficients",
            "further-factoring-trinomials-with-leading-coefficients",
          ],
        },
      ],
    },
    {
      title: t("Quadratic Equations", "一元二次方程"),
      modules: [
        {
          title: t("Solving Quadratic Equations by Factoring", "因式分解法解一元二次方程"),
          topics: [
            "introduction-to-quadratic-equations",
            "solving-perfect-square-quadratic-equations",
            "perfect-square-quadratic-equations-with-one-or-no-solutions",
            "zero-product-rule",
            "solving-quadratic-equations-using-a-difference-of-squares",
            "solving-quadratic-equations-with-no-constant-term",
            "solving-quadratic-equations-by-factoring",
            "solving-quadratic-equations-with-leading-coefficients-by-factoring",
          ],
        },
        {
          title: t("Completing the Square and the Quadratic Formula", "配方法与求根公式"),
          topics: [
            "completing-the-square",
            "completing-the-square-with-odd-linear-terms",
            "completing-the-square-with-leading-coefficients",
            "solving-quadratic-equations-by-completing-the-square",
            "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
            "the-quadratic-formula",
            "the-discriminant-of-a-quadratic-equation",
            "quadratic-equations-with-one-real-solution",
          ],
        },
        {
          title: t("Applications of Quadratic Equations", "一元二次方程的应用"),
          topics: ["modeling-with-quadratic-equations", "equating-polynomial-coefficients", "vietas-formulas"],
        },
      ],
    },
    {
      title: t("Radical Expressions", "根式"),
      modules: [
        {
          title: t("Roots of Algebraic Expressions", "代数式的方根"),
          topics: [
            "square-roots-of-algebraic-perfect-squares",
            "square-roots-with-domain-restrictions",
            "cube-roots-of-algebraic-perfect-cubes",
          ],
        },
        {
          title: t("Simplifying and Combining Radicals", "根式的化简与运算"),
          topics: [
            "simplifying-square-roots-with-variables",
            "multiplying-radical-expressions",
            "quotient-rule-for-square-roots",
            "evaluating-radical-expressions",
            "adding-and-subtracting-radical-expressions",
          ],
        },
        {
          title: t("Rationalizing Denominators", "分母有理化"),
          topics: ["rationalizing-algebraic-denominators", "rationalizing-two-term-denominators", "further-rationalizing-denominators"],
        },
        { title: t("Radical Equations", "根式方程"), topics: ["solving-radical-equations"] },
      ],
    },
    {
      title: t("Rational Expressions and Equations", "分式与分式方程"),
      modules: [
        {
          title: t("Rational Expressions", "分式"),
          topics: [
            "equivalent-expressions-with-fractions",
            "simplifying-rational-expressions",
            "simplifying-rational-expressions-by-factoring",
          ],
        },
        {
          title: t("Rational Equations", "分式方程"),
          topics: [
            "rational-equations-with-one-fractional-term",
            "rational-equations-using-cross-multiplication",
            "rational-equations-containing-binomials",
            "rational-equations-using-the-flip-method",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Introduction to Functions", "函数入门"),
          topics: ["introduction-to-functions", "representations-of-functions", "graphs-of-functions", "vertical-line-test"],
        },
        {
          title: t("Features of Functions", "函数的性质"),
          topics: [
            "domain-of-a-function",
            "global-extrema",
            "end-behavior",
            "range-of-a-function",
            "range-advanced-cases",
            "roots-of-a-function",
            "increasing-and-decreasing",
            "piecewise-functions",
          ],
        },
        {
          title: t("Linear Functions as Models", "一次函数模型"),
          topics: ["modeling-with-linear-functions", "constructing-linear-functions"],
        },
        {
          title: t("Combining Functions", "函数的运算与复合"),
          topics: [
            "arithmetic-of-functions",
            "function-composition",
            "describing-function-composition",
            "introduction-to-inverse-functions",
          ],
        },
      ],
    },
    {
      title: t("Absolute Value", "绝对值"),
      modules: [
        {
          title: t("Absolute Value Expressions, Equations and Inequalities", "绝对值表达式、方程与不等式"),
          topics: [
            "absolute-value-expressions",
            "rules-of-absolute-value",
            "further-rules-of-absolute-value",
            "absolute-value-equations",
            "further-absolute-value-equations",
            "equations-connecting-absolute-value-and-linear-functions",
            "absolute-value-equations-with-extraneous-solutions",
            "absolute-value-inequalities",
          ],
        },
        {
          title: t("Absolute Value Functions", "绝对值函数"),
          topics: [
            "absolute-value-graphs",
            "vertical-reflections-of-absolute-value-graphs",
            "stretches-of-absolute-value-graphs",
            "combining-transformations-of-absolute-value-graphs",
            "domain-and-range-of-absolute-value-functions",
            "roots-of-absolute-value-functions",
          ],
        },
      ],
    },
    {
      title: t("Exponential Functions", "指数函数"),
      modules: [
        {
          title: t("Rules of Exponents", "指数法则"),
          topics: [
            "writing-radicals-using-fractional-exponents",
            "product-rule-with-algebraic-expressions",
            "quotient-rule-with-algebraic-expressions",
            "power-rule-with-algebraic-expressions",
            "power-of-product-rule-with-algebraic-expressions",
            "power-of-quotient-rule-with-algebraic-expressions",
            "combining-rules-of-exponents-with-algebraic-expressions",
          ],
        },
        {
          title: t("Exponential Expressions and Equations", "指数式与指数方程"),
          topics: [
            "solving-exponential-equations",
            "solving-exponential-equations-with-fractional-solutions",
            "creating-exponential-growth-expressions",
            "creating-exponential-decay-expressions",
          ],
        },
        {
          title: t("Exponential Growth and Decay", "指数增长与衰减"),
          topics: [
            "exponential-functions",
            "modeling-exponential-growth-with-functions",
            "interpreting-exponential-growth",
            "solving-exponential-growth-problems",
            "modeling-exponential-decay-with-functions",
            "interpreting-exponential-decay",
            "solving-exponential-decay-problems",
          ],
        },
        {
          title: t("Comparing and Graphing Exponential Functions", "指数函数的比较与图象"),
          topics: [
            "linear-vs-exponential-growth-and-decay",
            "linear-vs-exponential-models",
            "graphing-exponential-growth-functions",
            "graphing-exponential-decay-functions",
          ],
        },
      ],
    },
    {
      title: t("Quadratic Functions", "二次函数"),
      modules: [
        {
          title: t("Graphs of Quadratic Functions", "二次函数的图象"),
          topics: [
            "graphing-elementary-quadratic-functions",
            "vertical-reflections-of-quadratic-functions",
            "graphs-of-general-quadratic-functions",
            "roots-of-quadratic-functions",
            "the-discriminant-of-a-quadratic-function",
          ],
        },
        {
          title: t("Parabolas and Vertex Form", "抛物线与顶点式"),
          topics: [
            "the-axis-of-symmetry-of-a-parabola",
            "the-average-of-the-roots-formula",
            "the-vertex-form-of-a-parabola",
            "writing-the-equation-of-a-parabola-in-vertex-form",
            "domain-and-range-of-quadratic-functions",
          ],
        },
        {
          title: t("Nonlinear Systems", "非线性方程组"),
          topics: [
            "solving-systems-of-nonlinear-equations",
            "finding-intersections-of-lines-and-quadratic-functions",
            "solving-systems-of-nonlinear-equations-using-graphs",
            "approximating-solutions-to-systems-of-nonlinear-equations",
          ],
        },
      ],
    },
    {
      title: t("Modeling With Quadratic Functions", "用二次函数建模"),
      modules: [
        {
          title: t("Vertical Motion", "竖直运动"),
          topics: ["modeling-downwards-vertical-motion", "modeling-upwards-vertical-motion", "vertical-motion"],
        },
        {
          title: t("Revenue, Cost and Profit", "收入、成本与利润"),
          topics: [
            "revenue-cost-and-profit-functions",
            "constructing-revenue-cost-and-profit-functions",
            "maximizing-profit-and-break-even-points",
          ],
        },
      ],
    },
    {
      title: t("Sequences", "数列"),
      modules: [
        {
          title: t("Introduction to Sequences", "数列入门"),
          topics: ["introduction-to-sequences", "recursive-sequences", "fibonacci-sequences"],
        },
        {
          title: t("Arithmetic Sequences", "等差数列"),
          topics: [
            "arithmetic-sequences",
            "recursive-formulas-for-arithmetic-sequences",
            "nth-term-of-an-arithmetic-sequence",
            "explicit-and-recursive-arithmetic-formulas",
            "finding-the-common-difference-of-an-arithmetic-sequence",
            "arithmetic-sequences-from-two-terms",
            "index-of-a-term-in-an-arithmetic-sequence",
            "solving-for-variables-in-arithmetic-sequences",
            "modeling-with-arithmetic-sequences",
          ],
        },
        {
          title: t("Geometric Sequences", "等比数列"),
          topics: [
            "geometric-sequences",
            "nth-term-of-a-geometric-sequence",
            "recursive-formulas-for-geometric-sequences",
            "geometric-sequences-from-two-terms",
            "index-of-a-term-in-a-geometric-sequence",
          ],
        },
      ],
    },
    {
      title: t("Bivariate Statistics", "双变量统计"),
      modules: [
        {
          title: t("Scatter Plots and Trend Lines", "散点图与趋势线"),
          topics: ["scatter-plots", "trend-lines", "predictions-with-trend-lines", "interpreting-trend-line-coefficients"],
        },
        {
          title: t("Correlation and Regression Models", "相关与回归模型"),
          topics: ["linear-correlation", "correlation-and-causation", "selecting-a-regression-model"],
        },
      ],
    },
  ],
};

/** geometry is the high-school geometry course. */
export const geometry: CourseDef = {
  id: "geometry",
  title: t("Geometry", "几何"),
  description: t(
    "Angle postulates and theorems and their proofs; translations, rotations, reflections, dilations and stretches, and symmetry; congruence and similarity criteria for triangles and proofs with them; circles, arcs and sectors, circle theorems, and radian measure; coordinate geometry of lines, segments, polygons and circles; special right triangles, medians and centroids, and properties of parallelograms; right-triangle trigonometry; polyhedrons, prisms, pyramids, cylinders, cones, spheres and solids of revolution; and probability, compound and conditional events, and combinatorics.",
    "角的公设与定理及其证明；平移、旋转、反射、位似、伸缩与对称；三角形全等与相似的判定及相关证明；圆、弧与扇形，圆的定理，弧度制；直线、线段、多边形与圆的坐标几何；特殊直角三角形、中线与重心、平行四边形的性质；直角三角形中的三角比；多面体、棱柱、棱锥、圆柱、圆锥、球与旋转体；概率、复合事件与条件概率、组合。",
  ),
  units: [
    {
      title: t("Proof, Congruence, and Similarity", "证明、全等与相似"),
      modules: [
        {
          title: t("Proof", "证明"),
          topics: [
            "identifying-angle-postulates",
            "identifying-angle-theorems",
            "proving-alternate-angle-theorems",
            "proving-alternate-angle-converses",
            "proving-consecutive-angle-theorems",
            "proving-consecutive-angle-converse",
            "proving-perpendicular-line-theorems",
            "further-proving-perpendicular-line-theorems",
            "the-exterior-angle-theorem",
          ],
        },
        {
          title: t("Transformations", "变换"),
          topics: [
            "translations-of-geometric-figures",
            "rotations-of-geometric-figures",
            "rotation-rules-in-the-coordinate-plane",
            "reflections-in-the-coordinate-plane",
            "parallel-lines-in-the-coordinate-plane",
            "perpendicular-lines-in-the-coordinate-plane",
            "reflections-across-arbitrary-lines",
            "dilations-of-geometric-figures",
            "dilations-of-figures-in-the-coordinate-plane",
            "stretches-of-geometric-figures",
            "combining-stretches-of-geometric-figures",
            "combining-geometric-transformations",
            "reflective-symmetry",
            "rotational-symmetry",
          ],
        },
        {
          title: t("Congruence", "全等"),
          topics: [
            "the-asa-congruence-criterion",
            "the-aas-congruence-criterion",
            "the-sas-congruence-criterion",
            "the-sss-congruence-criterion",
            "the-pythagorean-theorem",
            "the-hl-congruence-criterion",
            "combining-congruence-criteria-for-triangles",
            "rigid-motions-and-congruence",
            "properties-of-congruence",
            "proving-congruence-statements",
          ],
        },
        {
          title: t("Similarity", "相似"),
          topics: [
            "similarity-and-similar-polygons",
            "side-lengths-and-angle-measures-of-similar-polygons",
            "areas-of-similar-polygons",
            "working-with-areas-of-similar-polygons",
            "similarity-transformations",
            "the-aa-similarity-criterion",
            "the-sss-similarity-criterion",
            "the-sas-similarity-criterion",
            "combining-similarity-criteria-for-triangles",
            "proving-triangle-theorems",
            "proving-similarity-statements",
            "the-midpoint-theorem",
            "proving-the-midpoint-theorem",
            "the-triangle-proportionality-theorem",
          ],
        },
      ],
    },
    {
      title: t("Circles and Radian Measure", "圆与弧度制"),
      modules: [
        {
          title: t("Circles Essentials", "圆的基础"),
          topics: [
            "circles",
            "arcs-segments-and-sectors-of-circles",
            "the-circumference-of-a-circle",
            "areas-of-circles",
            "central-angles-and-arcs",
            "calculating-arc-lengths-of-circular-sectors",
            "calculating-areas-of-circular-sectors",
            "further-calculating-areas-of-sectors",
            "problem-solving-with-circles",
            "circles-inscribed-in-squares",
            "squares-inscribed-in-circles",
          ],
        },
        {
          title: t("Circle Theorems", "圆的定理"),
          topics: [
            "inscribed-angles",
            "problem-solving-with-inscribed-angles",
            "thales-theorem",
            "angles-in-inscribed-right-triangles",
            "further-angles-in-inscribed-right-triangles",
            "inscribed-quadrilaterals",
            "tangent-lines-to-circles",
            "tangent-tangent-lines-to-circles",
            "secant-secant-angles-to-circles",
            "secant-tangent-angles-to-circles",
            "the-tangent-chord-theorem",
            "circle-similarity",
            "proving-circle-similarity",
          ],
        },
        {
          title: t("Radians", "弧度"),
          topics: ["introduction-to-radians", "calculating-arc-length-using-radians", "calculating-areas-of-sectors-using-radians"],
        },
      ],
    },
    {
      title: t("Geometry in the Coordinate Plane", "坐标平面中的几何"),
      modules: [
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "finding-equations-of-parallel-lines",
            "finding-equations-of-perpendicular-lines",
            "midpoints-in-the-coordinate-plane",
            "partitioning-line-segments",
            "the-distance-formula",
            "the-shortest-distance-between-a-point-and-a-line",
            "calculating-perimeters-in-the-plane",
            "calculating-areas-of-rectangles-in-the-plane",
            "calculating-areas-of-triangles-and-quadrilaterals-in-the-plane",
          ],
        },
        {
          title: t("Circles in the Coordinate Plane", "坐标平面中的圆"),
          topics: [
            "circles-in-the-coordinate-plane",
            "equations-of-circles-centered-at-the-origin",
            "equations-of-circles",
            "determining-circle-properties-by-completing-the-square",
            "calculating-circle-intercepts",
            "intersections-of-circles-with-lines",
            "equations-of-tangent-lines-to-circles",
            "perpendicular-bisectors-of-diameters-in-the-coordinate-plane",
            "perpendicular-bisectors-of-chords",
            "perpendicular-bisectors-of-chords-in-the-coordinate-plane",
            "thales-theorem-in-the-coordinate-plane",
          ],
        },
      ],
    },
    {
      title: t("Triangles, Quadrilaterals, and Trigonometry", "三角形、四边形与三角"),
      modules: [
        {
          title: t("Triangles", "三角形"),
          topics: [
            "isosceles-right-triangles",
            "thirty-sixty-ninety-triangles",
            "area-of-isosceles-right-triangles",
            "area-of-thirty-sixty-ninety-triangles",
            "area-of-equilateral-triangles",
            "proofs-involving-isosceles-triangles",
            "medians-and-centroids",
            "proofs-involving-medians-and-centroids",
          ],
        },
        {
          title: t("Quadrilaterals", "四边形"),
          topics: [
            "diagonals-of-squares",
            "properties-of-parallelograms",
            "proving-properties-of-parallelograms",
            "proving-criteria-for-parallelograms-and-rectangles",
          ],
        },
        {
          title: t("Trigonometry", "三角"),
          topics: [
            "angles-and-sides-in-right-triangles",
            "the-trigonometric-ratios",
            "calculating-trigonometric-ratios-using-the-pythagorean-theorem",
            "calculating-side-lengths-of-right-triangles-using-trigonometry",
            "calculating-angles-in-right-triangles-using-trigonometry",
            "modeling-with-trigonometry",
            "the-reciprocal-trigonometric-ratios",
            "trigonometric-ratios-in-similar-right-triangles",
            "trigonometric-functions-of-complementary-angles",
            "special-trigonometric-ratios",
            "calculating-areas-of-right-triangles-using-trigonometry",
            "solving-multiple-right-triangles-using-trigonometry",
            "trigonometric-ratios-with-radians",
          ],
        },
      ],
    },
    {
      title: t("Solid Geometry", "立体几何"),
      modules: [
        {
          title: t("Introduction to Solid Geometry", "立体几何入门"),
          topics: [
            "identifying-three-dimensional-shapes",
            "faces-vertices-and-edges-of-polyhedrons",
            "nets-of-polyhedrons",
            "finding-surface-areas-using-nets",
            "eulers-formula-for-polyhedra",
            "the-five-platonic-solids",
          ],
        },
        {
          title: t("Rectangular Solids and Pyramids", "长方体与棱锥"),
          topics: [
            "volumes-of-cubes",
            "surface-areas-of-cubes",
            "face-diagonals-of-cubes",
            "diagonals-of-cubes",
            "volumes-of-rectangular-solids",
            "surface-areas-of-rectangular-solids",
            "diagonals-of-rectangular-solids",
            "the-distance-formula-in-three-dimensions",
            "volumes-of-pyramids",
            "surface-areas-of-pyramids",
            "surface-areas-and-volumes-of-similar-solids",
          ],
        },
        {
          title: t("Non-Polyhedrons", "非多面体"),
          topics: [
            "volumes-of-cylinders",
            "surface-areas-of-cylinders",
            "volumes-of-right-cones",
            "slant-heights-of-right-cones",
            "surface-areas-of-right-cones",
            "volumes-of-spheres",
            "surface-areas-of-spheres",
            "conical-frustums",
            "volumes-of-revolution",
          ],
        },
      ],
    },
    {
      title: t("Probability and Combinatorics", "概率与组合"),
      modules: [
        {
          title: t("Introduction to Probability", "概率入门"),
          topics: [
            "sets",
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "the-complement-of-an-event",
            "venn-diagrams-in-probability",
            "geometric-probability",
          ],
        },
        {
          title: t("Compound Events in Probability", "概率中的复合事件"),
          topics: [
            "the-union-of-sets",
            "the-intersection-of-sets",
            "compound-events-in-probability-from-experimental-data",
            "computing-probabilities-for-compound-events-using-venn-diagrams",
            "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
            "computing-probabilities-for-three-events-using-venn-diagrams",
            "the-addition-law-of-probability",
            "applying-the-addition-law-with-event-complements",
            "mutually-exclusive-events",
          ],
        },
        {
          title: t("Conditional Probability", "条件概率"),
          topics: [
            "conditional-probabilities-from-venn-diagrams",
            "conditional-probabilities-from-tables",
            "the-multiplication-law-for-conditional-probability",
            "the-law-of-total-probability",
            "tree-diagrams-for-dependent-events",
            "tree-diagrams-for-dependent-events-applications",
            "independent-events",
            "tree-diagrams-for-independent-events",
          ],
        },
        {
          title: t("Combinatorics", "组合"),
          topics: [
            "the-rules-of-sum-and-product",
            "factorials",
            "factorials-in-variable-expressions",
            "ordering-objects",
            "permutations",
            "combinations",
            "computing-probabilities-using-combinatorics",
          ],
        },
      ],
    },
  ],
};

/** algebraII is the high-school Algebra II course. */
export const algebraII: CourseDef = {
  id: "algebra-ii",
  title: t("Algebra II", "代数 II"),
  description: t(
    "The real numbers and an introduction to complex numbers; polynomials, their factoring, division, equations, theorems and graphs; functions and their graph transformations; logarithms, exponential and logarithmic equations, graphs and models; rational and radical expressions and functions; parabolas as conic sections; the unit circle, special trigonometric ratios and trigonometry with general triangles; and the graphs, properties, transformations and models of trigonometric functions.",
    "实数与复数入门；多项式及其因式分解、除法、方程、定理与图象；函数及其图象变换；对数，指数与对数方程、图象与模型；有理式与根式及其函数；作为圆锥曲线的抛物线；单位圆、特殊三角比与一般三角形中的三角学；三角函数的图象、性质、变换与模型。",
  ),
  units: [
    {
      title: t("Number Systems", "数系"),
      modules: [
        {
          title: t("The Real Number System", "实数系"),
          topics: [
            "the-real-number-system",
            "writing-repeating-decimals-as-fractions",
            "sums-and-products-of-rational-and-irrational-numbers",
          ],
        },
        {
          title: t("Introduction to Complex Numbers", "复数入门"),
          topics: [
            "imaginary-numbers",
            "quadratic-equations-with-purely-imaginary-solutions",
            "complex-numbers",
            "adding-and-subtracting-complex-numbers",
            "multiplying-complex-numbers",
            "solving-quadratic-equations-with-complex-roots",
            "cyclic-property-of-the-imaginary-unit",
          ],
        },
      ],
    },
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Polynomials", "多项式"),
          topics: [
            "the-least-common-multiple-of-two-monomials",
            "the-least-common-multiple-of-two-polynomials",
            "describing-relationships-using-polynomial-identities",
          ],
        },
        {
          title: t("Factoring Polynomials", "多项式的因式分解"),
          topics: [
            "further-factoring-of-polynomials-using-gcfs",
            "factoring-higher-order-polynomials-as-a-difference-of-squares",
            "factoring-cubic-expressions-by-grouping",
            "factoring-sums-and-differences-of-cubes",
            "factoring-biquadratic-expressions",
          ],
        },
        {
          title: t("Dividing Polynomials", "多项式除法"),
          topics: [
            "splitting-rational-expressions-into-terms",
            "dividing-polynomials-using-synthetic-division",
            "dividing-polynomials-by-linear-binomials-using-long-division",
            "dividing-polynomials-using-long-division",
            "dividing-polynomials-by-manipulating-rational-expressions",
          ],
        },
        {
          title: t("Polynomial Equations", "多项式方程"),
          topics: [
            "determining-the-roots-of-polynomials",
            "solving-polynomial-equations-using-the-gcf",
            "solving-cubic-equations-by-grouping",
            "solving-biquadratic-equations",
          ],
        },
        {
          title: t("Polynomial Theorems", "多项式定理"),
          topics: [
            "the-factor-theorem",
            "determining-polynomial-coefficients-using-the-factor-theorem",
            "factoring-cubic-polynomials-using-the-factor-theorem",
            "factoring-quartic-polynomials-using-the-factor-theorem",
            "multiplicities-of-the-roots-of-polynomials",
            "finding-multiplicities-of-the-roots-of-quartic-polynomials-by-factoring",
            "the-remainder-theorem",
            "the-rational-roots-theorem",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Functions", "函数"),
          topics: [
            "local-extrema",
            "one-to-one-functions",
            "graphs-of-inverse-functions",
            "domain-and-range-of-inverse-functions",
            "invertible-functions",
            "calculating-the-inverse-of-a-function",
            "inverses-of-quadratic-functions",
            "plotting-x-as-a-function-of-y",
            "periodic-functions",
            "even-and-odd-functions",
            "products-of-even-and-odd-functions",
            "end-behavior",
            "unbounded-behavior-of-functions-near-a-point",
            "the-average-rate-of-change-of-a-function",
          ],
        },
        {
          title: t("Graph Transformations of Functions", "函数图象的变换"),
          topics: [
            "vertical-translations-of-functions",
            "horizontal-translations-of-functions",
            "vertical-stretches-of-functions",
            "horizontal-stretches-of-functions",
            "combining-graph-transformations-two-operations",
            "combining-graph-transformations-three-or-more-operations",
            "constructing-functions-using-transformations",
            "vertical-reflections-of-functions",
            "horizontal-reflections-of-functions",
            "combining-reflections-with-other-graph-transformations",
            "finding-points-on-transformed-curves",
            "the-domain-and-range-of-transformed-functions",
            "absolute-value-graph-transformations",
          ],
        },
        {
          title: t("Graphs of Polynomials", "多项式的图象"),
          topics: [
            "graphing-elementary-cubic-functions",
            "graphing-cubic-curves-containing-three-distinct-real-roots",
            "graphing-cubic-curves-containing-a-double-root",
            "graphing-cubic-curves-containing-one-distinct-real-root",
            "end-behavior-of-polynomials",
            "graphing-general-polynomials",
          ],
        },
      ],
    },
    {
      title: t("Exponentials & Logarithms", "指数与对数"),
      modules: [
        {
          title: t("Introduction to Logarithms", "对数入门"),
          topics: [
            "converting-between-exponential-and-logarithmic-form",
            "evaluating-logarithms",
            "natural-logarithm",
            "common-logarithm",
            "simplifying-logarithmic-expressions",
          ],
        },
        {
          title: t("The Laws of Logarithms", "对数运算法则"),
          topics: [
            "product-rule-for-logarithms",
            "quotient-rule-for-logarithms",
            "power-rule-for-logarithms",
            "combining-laws-of-logarithms",
            "change-of-base-formula",
          ],
        },
        {
          title: t("Exponential Equations", "指数方程"),
          topics: [
            "solving-exponential-equations-using-logarithms",
            "solving-equations-containing-the-exponential-function",
            "solving-exponential-equations",
            "solving-exponential-equations-with-different-bases-using-logarithms",
            "solving-exponential-equations-using-the-zero-product-property",
          ],
        },
        {
          title: t("Logarithmic Equations", "对数方程"),
          topics: [
            "solving-logarithmic-equations",
            "solving-logarithmic-equations-containing-the-natural-logarithm",
            "solving-logarithmic-equations-using-the-laws-of-logarithms",
            "solving-logarithmic-equations-by-combining-the-laws-of-logarithms",
            "solving-logarithmic-equations-with-logarithms-on-both-sides",
            "solving-logarithmic-equations-using-the-zero-product-property",
          ],
        },
        {
          title: t("Graphs of Exponential Functions", "指数函数的图象"),
          topics: [
            "vertical-translations-of-exponential-growth-functions",
            "vertical-translations-of-exponential-decay-functions",
            "interpreting-graphs-of-exponential-functions",
            "vertical-reflections-of-exponential-functions",
            "combining-graph-transformations-of-exponential-functions",
            "properties-of-transformed-exponential-functions",
          ],
        },
        {
          title: t("Graphs of Logarithmic Functions", "对数函数的图象"),
          topics: [
            "graphing-logarithmic-functions",
            "combining-graph-transformations-of-logarithmic-functions",
            "properties-of-transformed-logarithmic-functions",
            "inverses-of-exponential-and-logarithmic-functions",
          ],
        },
        {
          title: t("Modeling with Exponential Functions", "用指数函数建模"),
          topics: ["modeling-with-compound-interest", "continuously-compounded-interest", "converting-between-exponents"],
        },
      ],
    },
    {
      title: t("Rational Expressions & Functions", "有理式与有理函数"),
      modules: [
        {
          title: t("Rational Expressions", "有理式"),
          topics: [
            "simplifying-rational-expressions-using-polynomial-factorization",
            "adding-and-subtracting-rational-expressions",
            "adding-rational-expressions-with-unlike-denominators",
            "multiplying-rational-expressions",
            "dividing-rational-expressions",
            "simplifying-complex-fractions",
          ],
        },
        {
          title: t("Reciprocal Functions", "反比例函数"),
          topics: [
            "graphing-reciprocal-functions",
            "graph-transformations-of-reciprocal-functions",
            "combining-graph-transformations-of-reciprocal-functions",
            "domain-and-range-of-transformed-reciprocal-functions",
            "inverses-of-reciprocal-functions",
            "finding-intersections-of-lines-and-reciprocal-functions",
          ],
        },
      ],
    },
    {
      title: t("Radical Expressions & Functions", "根式与根式函数"),
      modules: [
        {
          title: t("Radical Expressions", "根式"),
          topics: ["simplifying-square-root-expressions-using-polynomial-factorization", "solving-advanced-radical-equations"],
        },
        {
          title: t("Graphs of Radical Functions", "根式函数的图象"),
          topics: [
            "graphing-the-square-root-function",
            "graph-transformations-of-square-root-functions",
            "graphing-the-cube-root-function",
            "properties-of-transformed-square-root-functions",
            "the-domain-of-a-transformed-radical-function",
            "the-range-of-a-transformed-radical-function",
            "roots-of-transformed-radical-functions",
            "inverses-of-radical-functions",
            "finding-intersections-of-lines-and-radical-functions",
          ],
        },
      ],
    },
    {
      title: t("Conic Sections", "圆锥曲线"),
      modules: [
        {
          title: t("Parabolas as Conic Sections", "作为圆锥曲线的抛物线"),
          topics: [
            "upward-and-downward-opening-parabolas",
            "left-and-right-opening-parabolas",
            "the-vertex-of-a-parabola",
            "calculating-the-vertex-of-a-parabola-by-completing-the-square",
            "the-focus-directrix-property-of-a-parabola",
            "calculating-the-focus-of-a-parabola",
            "calculating-the-directrix-of-a-parabola",
            "calculating-intercepts-of-parabolas",
            "intersections-of-parabolas-with-lines",
          ],
        },
      ],
    },
    {
      title: t("The Unit Circle", "单位圆"),
      modules: [
        {
          title: t("The Unit Circle", "单位圆"),
          topics: [
            "angles-in-the-coordinate-plane",
            "negative-angles-in-the-coordinate-plane",
            "coterminal-angles",
            "calculating-reference-angles",
            "properties-of-the-unit-circle-in-the-first-quadrant",
            "extending-the-trigonometric-ratios-using-the-unit-circle",
            "extending-the-trigonometric-ratios-using-angles-in-radians",
            "extending-the-trigonometric-ratios-to-negative-angles",
            "extending-the-trigonometric-ratios-to-large-angles",
            "using-the-pythagorean-identity-in-the-first-quadrant",
            "extending-the-pythagorean-identity-to-all-quadrants",
          ],
        },
        {
          title: t("Special Trigonometric Ratios", "特殊三角比"),
          topics: [
            "finding-trigonometric-ratios-of-quadrantal-angles",
            "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range",
            "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
            "evaluating-trigonometric-expressions",
            "further-extensions-of-the-special-trigonometric-ratios",
          ],
        },
        {
          title: t("Trigonometry with General Triangles", "一般三角形中的三角学"),
          topics: [
            "the-law-of-sines",
            "the-law-of-cosines",
            "the-area-of-a-general-triangle",
            "modeling-using-the-law-of-sines",
            "modeling-using-the-law-of-cosines",
          ],
        },
      ],
    },
    {
      title: t("Trigonometric Functions", "三角函数"),
      modules: [
        {
          title: t("Graphing Trigonometric Functions", "画三角函数的图象"),
          topics: ["graphing-sine-and-cosine", "graphing-tangent-and-cotangent", "graphing-secant-and-cosecant"],
        },
        {
          title: t("Properties of Trigonometric Functions", "三角函数的性质"),
          topics: [
            "describing-properties-of-the-sine-function",
            "describing-properties-of-the-cosine-function",
            "describing-properties-of-the-tangent-function",
            "describing-properties-of-the-secant-function",
            "describing-properties-of-the-cosecant-function",
            "describing-properties-of-the-cotangent-function",
          ],
        },
        {
          title: t("Graph Transformations of Trigonometric Functions", "三角函数图象的变换"),
          topics: [
            "vertical-translations-of-trigonometric-functions",
            "vertical-stretches-of-trigonometric-functions",
            "horizontal-translations-of-trigonometric-functions",
            "horizontal-stretches-of-trigonometric-functions",
            "combining-graph-transformations-of-sine-and-cosine",
            "graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-secant-and-cosecant",
            "graphing-reflections-of-trigonometric-functions",
            "graphing-reflections-of-trigonometric-functions-three-or-more-transformations",
          ],
        },
        {
          title: t("Properties of Transformed Trigonometric Functions", "变换后三角函数的性质"),
          topics: [
            "properties-of-transformed-sine-and-cosine-functions",
            "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions",
            "properties-of-transformed-tangent-and-cotangent-functions",
            "properties-of-transformed-secant-and-cosecant-functions",
            "interpreting-trigonometric-models",
            "modeling-with-trigonometric-functions",
          ],
        },
      ],
    },
  ],
};

/** precalculus is the high-school Precalculus course. */
export const precalculus: CourseDef = {
  id: "precalculus",
  title: t("Precalculus", "预备微积分"),
  description: t(
    "Arithmetic and finite geometric series and the binomial theorem; rational expressions, equations and functions with their asymptotes, holes and limits at infinity; quadratic, polynomial, rational and other nonlinear inequalities; inverse trigonometric functions, trigonometric identities, the sum, difference and double-angle formulas, and trigonometric equations; vectors in two and three dimensions with the dot and cross products; matrices, determinants, inverses and linear transformations; ellipses and hyperbolas; parametric and polar equations; complex numbers in the complex plane and in polar form, De Moivre's theorem, roots of unity and the fundamental theorem of algebra; probability, combinatorics, discrete random variables and the normal distribution; and statistics: variance, covariance, z-scores, correlation and regression.",
    "等差级数与有限等比级数、二项式定理；有理式、有理方程与有理函数，及其渐近线、洞与无穷远处的极限；二次、多项式、有理与其他非线性不等式；反三角函数、三角恒等式、和差公式与二倍角公式、三角方程；二维与三维向量及点积和叉积；矩阵、行列式、逆矩阵与线性变换；椭圆与双曲线；参数方程与极坐标方程；复平面上与极坐标形式的复数、棣莫弗定理、单位根与代数基本定理；概率、组合、离散随机变量与正态分布；统计：方差、协方差、z 分数、相关与回归。",
  ),
  units: [
    {
      title: t("Sequences and Series", "数列与级数"),
      modules: [
        {
          title: t("Arithmetic Series", "等差级数"),
          topics: [
            "sigma-notation",
            "properties-of-finite-series",
            "expressing-an-arithmetic-series-in-sigma-notation",
            "finding-the-sum-of-an-arithmetic-series",
            "finding-the-first-term-of-an-arithmetic-series",
            "calculating-the-number-of-terms-in-an-arithmetic-series",
            "modeling-with-arithmetic-series",
          ],
        },
        {
          title: t("Finite Geometric Series", "有限等比级数"),
          topics: [
            "the-sum-of-a-finite-geometric-series",
            "the-sum-of-the-first-n-terms-of-a-geometric-series",
            "writing-geometric-series-in-sigma-notation",
            "sums-of-finite-geometric-series-given-in-sigma-notation",
            "solving-geometric-series-problems-using-exponential-equations-and-inequalities",
            "modeling-with-geometric-series",
            "modeling-financial-problems-using-geometric-series",
          ],
        },
      ],
    },
    {
      title: t("Rational Functions", "有理函数"),
      modules: [
        {
          title: t("Rational Expressions and Equations", "有理式与有理方程"),
          topics: [
            "closure-properties-of-polynomials",
            "closure-properties-of-rational-expressions",
            "rational-equations-with-three-terms",
            "advanced-rational-equations",
            "further-advanced-rational-equations",
          ],
        },
        {
          title: t("Rational Functions", "有理函数"),
          topics: [
            "roots-of-rational-functions",
            "vertical-asymptotes-of-rational-functions",
            "locating-holes-in-rational-functions",
            "horizontal-asymptotes-of-rational-functions",
            "end-behavior-of-rational-functions",
            "infinite-limits-of-rational-functions",
            "infinite-limits-of-rational-functions-advanced-cases",
            "the-domain-and-range-of-a-rational-function",
            "identifying-a-rational-function-from-a-graph",
            "identifying-a-rational-function-from-a-graph-containing-holes",
            "identifying-the-graph-of-a-rational-function",
          ],
        },
      ],
    },
    {
      title: t("Inequalities", "不等式"),
      modules: [
        {
          title: t("Quadratic Inequalities", "二次不等式"),
          topics: [
            "solving-elementary-quadratic-inequalities",
            "solving-quadratic-inequalities-from-graphs",
            "solving-quadratic-inequalities-using-the-graphical-method",
            "solving-quadratic-inequalities-using-the-sign-table-method",
            "determining-unknown-parameters-in-quadratic-equations-with-real-solutions",
            "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
            "determining-unknown-parameters-in-quadratic-equations-advanced-cases",
          ],
        },
        {
          title: t("Polynomial Inequalities", "多项式不等式"),
          topics: [
            "inequalities-involving-powers-of-binomials",
            "solving-polynomial-inequalities-using-a-graphical-method",
            "solving-polynomial-inequalities-using-special-factoring-techniques-and-the-graphical-method",
            "solving-polynomial-inequalities-using-the-sign-table-method",
          ],
        },
        {
          title: t("Non-Polynomial Inequalities", "非多项式不等式"),
          topics: [
            "solving-radical-inequalities",
            "solving-inequalities-involving-exponential-functions",
            "solving-inequalities-involving-logarithmic-functions",
            "solving-inequalities-involving-exponential-functions-and-polynomials",
            "solving-inequalities-involving-positive-and-negative-factors",
            "solving-inequalities-involving-geometric-sequences",
            "solving-rational-inequalities",
            "further-solving-of-rational-inequalities",
            "solving-two-variable-nonlinear-inequalities",
            "further-solving-of-two-variable-nonlinear-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Trigonometry", "三角学"),
      modules: [
        {
          title: t("The Inverse Trigonometric Functions", "反三角函数"),
          topics: [
            "graphing-the-inverse-sine-function",
            "graphing-the-inverse-cosine-function",
            "graphing-the-inverse-tangent-function",
            "evaluating-expressions-containing-inverse-trigonometric-functions",
            "further-evaluating-expressions-containing-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Trigonometric Identities", "三角恒等式"),
          topics: [
            "simplifying-expressions-using-basic-trigonometric-identities",
            "simplifying-expressions-using-the-pythagorean-identity",
            "alternate-forms-of-the-pythagorean-identity",
            "simplifying-expressions-using-the-secant-tangent-identity",
            "alternate-forms-of-the-secant-tangent-identity",
            "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity",
            "simplifying-trigonometric-expressions-using-cofunction-identities",
          ],
        },
        {
          title: t("The Sum and Difference Formulas", "和差公式"),
          topics: [
            "converting-between-exponential-and-logarithmic-form",
            "the-sum-and-difference-formulas-for-sine",
            "the-sum-and-difference-formulas-for-cosine",
            "the-sum-and-difference-formulas-for-tangent",
            "calculating-trigonometric-ratios-using-the-sum-formula-for-sine",
            "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine",
            "calculating-trigonometric-ratios-using-the-sum-formula-for-tangent",
            "writing-sums-of-trigonometric-functions-in-amplitude-phase-form",
          ],
        },
        {
          title: t("The Double-Angle Formulas", "二倍角公式"),
          topics: [
            "the-double-angle-formula-for-sine",
            "verifying-trigonometric-identities-using-the-double-angle-formula-for-sine",
            "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem",
            "the-double-angle-formula-for-cosine",
            "verifying-trigonometric-identities-using-the-double-angle-formulas-for-cosine",
            "finding-exact-values-of-trigonometric-expressions-using-the-double-angle-formulas-for-cosine",
            "simplifying-expressions-using-the-double-angle-formula-for-tangent",
            "verifying-trigonometric-identities-using-the-double-angle-formula-for-tangent",
          ],
        },
        {
          title: t("Elementary Trigonometric Equations", "基本三角方程"),
          topics: [
            "elementary-trigonometric-equations-containing-sine",
            "elementary-trigonometric-equations-containing-cosine",
            "solving-exponential-equations-with-different-bases-using-logarithms",
            "elementary-trigonometric-equations-containing-tangent",
            "elementary-trigonometric-equations-containing-secant",
            "elementary-trigonometric-equations-containing-cosecant",
            "elementary-trigonometric-equations-containing-cotangent",
            "general-solutions-of-elementary-trigonometric-equations",
          ],
        },
        {
          title: t("Trigonometric Equations Containing Transformed Functions", "含变换函数的三角方程"),
          topics: [
            "general-solutions-of-trigonometric-equations-with-transformed-functions",
            "trigonometric-equations-containing-transformed-sine-functions",
            "trigonometric-equations-containing-transformed-cosine-functions",
            "trigonometric-equations-containing-transformed-tangent-functions",
          ],
        },
        {
          title: t("Advanced Trigonometric Equations", "高级三角方程"),
          topics: [
            "solving-trigonometric-equations-using-the-sin-cos-tan-identity",
            "solving-trigonometric-equations-using-the-zero-product-property",
            "quadratic-trigonometric-equations-containing-sine-or-cosine",
            "quadratic-trigonometric-equations-containing-tangent-or-cotangent",
          ],
        },
      ],
    },
    {
      title: t("Vectors", "向量"),
      modules: [
        {
          title: t("Introduction to Vectors", "向量入门"),
          topics: [
            "introduction-to-vectors",
            "the-triangle-law-for-the-addition-of-two-vectors",
            "the-magnitude-of-a-vector",
            "problem-solving-using-vector-diagrams",
            "parallel-vectors",
            "unit-vectors",
            "linear-combinations-of-vectors-and-their-properties",
            "describing-the-position-vector-of-a-point-using-known-vectors",
          ],
        },
        {
          title: t("Vectors in 2D Cartesian Coordinates", "二维直角坐标中的向量"),
          topics: [
            "two-dimensional-vectors-expressed-in-component-form",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d",
            "calculating-the-magnitude-of-cartesian-vectors-in-2d",
            "calculating-the-direction-of-cartesian-vectors-in-2d",
            "calculating-the-components-of-cartesian-vectors-in-2d",
            "velocity-and-acceleration-for-plane-motion",
            "calculating-displacement-for-plane-motion",
          ],
        },
        {
          title: t("Vectors in 3D Cartesian Coordinates", "三维直角坐标中的向量"),
          topics: [
            "three-dimensional-vectors-in-component-form",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-3d",
            "calculating-the-magnitude-of-cartesian-vectors-in-3d",
          ],
        },
        {
          title: t("The Dot Product", "点积"),
          topics: [
            "calculating-the-dot-product-using-angle-and-magnitude",
            "calculating-the-dot-product-using-components",
            "the-angle-between-two-vectors",
            "calculating-a-scalar-projection",
            "calculating-a-vector-projection",
          ],
        },
        {
          title: t("The Cross Product", "叉积"),
          topics: [
            "the-cross-product-of-two-vectors",
            "properties-of-the-cross-product",
            "calculating-the-cross-product-using-determinants",
            "finding-areas-using-the-cross-product",
            "the-scalar-triple-product",
            "volumes-of-parallelepipeds",
            "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products",
          ],
        },
      ],
    },
    {
      title: t("Matrices", "矩阵"),
      modules: [
        {
          title: t("Introduction to Matrices", "矩阵入门"),
          topics: [
            "introduction-to-matrices",
            "index-notation-for-matrices",
            "adding-and-subtracting-matrices",
            "properties-of-matrix-addition",
            "scalar-multiplication-of-matrices",
            "zero-square-diagonal-and-identity-matrices",
            "the-transpose-of-a-matrix",
          ],
        },
        {
          title: t("Matrix Multiplication", "矩阵乘法"),
          topics: [
            "multiplying-a-matrix-by-a-column-vector",
            "multiplying-square-matrices",
            "conformability-for-matrix-multiplication",
            "multiplying-matrices",
            "powers-of-matrices",
            "multiplying-a-matrix-by-the-identity-matrix",
            "properties-of-matrix-multiplication",
            "representing-2x2-systems-of-equations-using-a-matrix-product",
            "representing-3x3-systems-of-equations-using-a-matrix-product",
          ],
        },
        {
          title: t("Determinants", "行列式"),
          topics: [
            "the-determinant-of-a-2x2-matrix",
            "the-geometric-interpretation-of-the-2x2-determinant",
            "the-minors-of-a-3x3-matrix",
            "the-determinant-of-a-3x3-matrix",
          ],
        },
        {
          title: t("The Inverse of a Matrix", "逆矩阵"),
          topics: [
            "introduction-to-the-inverse-of-a-matrix",
            "inverses-of-2x2-matrices",
            "calculating-the-inverse-of-a-3x3-matrix-using-the-cofactor-method",
            "solving-2x2-systems-of-equations-using-inverse-matrices",
            "solving-systems-of-equations-using-inverse-matrices",
          ],
        },
        {
          title: t("Linear Transformations", "线性变换"),
          topics: [
            "introduction-to-linear-transformations",
            "the-standard-matrix-of-a-linear-transformation",
            "linear-transformations-of-points-and-lines-in-the-plane",
            "linear-transformations-of-objects-in-the-plane",
            "dilations-and-reflections-as-linear-transformations",
            "shear-and-stretch-as-linear-transformations",
            "right-angle-rotations-as-linear-transformations",
            "rotations-as-linear-transformations",
            "combining-linear-transformations-using-2x2-matrices",
            "inverting-linear-transformations",
            "area-scale-factors-of-linear-transformations",
            "singular-linear-transformations-in-the-plane",
          ],
        },
      ],
    },
    {
      title: t("Conic Sections", "圆锥曲线"),
      modules: [
        {
          title: t("Ellipses as Conic Sections", "作为圆锥曲线的椭圆"),
          topics: [
            "introduction-to-ellipses",
            "equations-of-ellipses-centered-at-the-origin",
            "equations-of-ellipses-centered-at-a-general-point",
            "finding-the-center-and-axes-of-ellipses-by-completing-the-square",
            "finding-intercepts-of-ellipses",
            "finding-intersections-of-ellipses-and-lines",
            "foci-of-ellipses",
            "vertices-and-eccentricity-of-ellipses",
            "directrices-of-ellipses",
            "the-area-of-an-ellipse",
          ],
        },
        {
          title: t("Hyperbolas as Conic Sections", "作为圆锥曲线的双曲线"),
          topics: [
            "equations-of-hyperbolas-centered-at-the-origin",
            "equations-of-hyperbolas-centered-at-a-general-point",
            "asymptotes-of-hyperbolas-centered-at-the-origin",
            "asymptotes-of-hyperbolas-centered-at-a-general-point",
            "finding-intercepts-and-intersections-of-hyperbolas",
            "transverse-axes-of-hyperbolas",
            "conjugate-axes-of-hyperbolas",
            "foci-of-hyperbolas",
            "eccentricity-and-vertices-of-hyperbolas",
            "directrices-of-hyperbolas",
          ],
        },
      ],
    },
    {
      title: t("Parametric Equations", "参数方程"),
      modules: [
        {
          title: t("Parametric Equations", "参数方程"),
          topics: [
            "graphing-curves-defined-parametrically",
            "cartesian-equations-of-parametric-curves",
            "finding-intercepts-of-curves-defined-parametrically",
            "finding-intersections-of-parametric-curves-and-lines",
            "parametric-equations-of-circles",
            "parametric-equations-of-ellipses",
            "parametric-equations-of-parabolas",
            "parametric-equations-of-parabolas-centered-at-hk",
            "parametric-equations-of-horizontal-hyperbolas",
            "parametric-equations-of-vertical-hyperbolas",
          ],
        },
      ],
    },
    {
      title: t("Polar Equations", "极坐标方程"),
      modules: [
        {
          title: t("Polar Coordinates", "极坐标"),
          topics: [
            "introduction-to-polar-coordinates",
            "converting-from-polar-coordinates-to-cartesian-coordinates",
            "polar-equations-of-circles-centered-at-the-origin",
            "polar-equations-of-radial-lines",
            "polar-equations-of-circles-centered-on-the-coordinate-axes",
            "finding-intersections-of-polar-curves",
          ],
        },
      ],
    },
    {
      title: t("Complex Numbers", "复数"),
      modules: [
        {
          title: t("The Complex Plane", "复平面"),
          topics: [
            "the-complex-plane",
            "the-magnitude-of-a-complex-number",
            "the-argument-of-a-complex-number",
            "arithmetic-in-the-complex-plane",
            "geometry-in-the-complex-plane",
          ],
        },
        {
          title: t("Further Complex Numbers", "复数进阶"),
          topics: [
            "the-complex-conjugate",
            "special-properties-of-the-complex-conjugate",
            "the-complex-conjugate-and-the-roots-of-a-quadratic-equation",
            "dividing-complex-numbers",
            "solving-equations-by-equating-real-and-imaginary-parts",
            "extending-polynomial-identities-to-the-complex-numbers",
          ],
        },
        {
          title: t("Complex Numbers in Polar Form", "复数的极坐标形式"),
          topics: [
            "the-polar-form-of-a-complex-number",
            "products-of-complex-numbers-expressed-in-polar-form",
            "quotients-of-complex-numbers-expressed-in-polar-form",
            "the-cis-notation",
          ],
        },
        {
          title: t("De Moivre's Theorem", "棣莫弗定理"),
          topics: [
            "de-moivres-theorem",
            "finding-powers-of-complex-numbers-using-de-moivres-theorem",
            "the-power-reducing-formulas-for-sine-and-cosine",
            "eulers-formula",
            "the-roots-of-unity",
            "properties-of-roots-of-unity",
            "square-roots-of-complex-numbers",
            "higher-roots-of-complex-numbers",
          ],
        },
        {
          title: t("The Fundamental Theorem of Algebra", "代数基本定理"),
          topics: [
            "the-fundamental-theorem-of-algebra-for-quadratic-equations",
            "the-fundamental-theorem-of-algebra-with-cubic-equations",
            "solving-cubic-equations-with-complex-roots",
            "the-fundamental-theorem-of-algebra-with-quartic-equations",
            "solving-quartic-equations-with-complex-roots",
          ],
        },
      ],
    },
    {
      title: t("Probability & Combinatorics", "概率与组合"),
      modules: [
        {
          title: t("Combinatorics", "组合"),
          topics: [
            "the-rules-of-sum-and-product",
            "factorials",
            "factorials-in-variable-expressions",
            "ordering-objects",
            "permutations",
            "combinations",
            "computing-probabilities-using-combinatorics",
          ],
        },
        {
          title: t("The Binomial Theorem", "二项式定理"),
          topics: [
            "pascals-triangle-and-the-binomial-coefficients",
            "expanding-a-binomial-using-binomial-coefficients",
            "the-special-case-of-the-binomial-theorem",
            "approximating-values-using-the-binomial-theorem",
          ],
        },
        {
          title: t("Introduction to Probability", "概率入门"),
          topics: [
            "sets",
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "the-complement-of-an-event",
            "venn-diagrams-in-probability",
            "geometric-probability",
          ],
        },
        {
          title: t("Compound Events in Probability", "概率中的复合事件"),
          topics: [
            "the-union-of-sets",
            "the-intersection-of-sets",
            "compound-events-in-probability-from-experimental-data",
            "computing-probabilities-for-compound-events-using-venn-diagrams",
            "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
            "computing-probabilities-for-three-events-using-venn-diagrams",
            "the-addition-law-of-probability",
            "applying-the-addition-law-with-event-complements",
            "mutually-exclusive-events",
          ],
        },
        {
          title: t("Conditional Probability", "条件概率"),
          topics: [
            "conditional-probabilities-from-venn-diagrams",
            "conditional-probabilities-from-tables",
            "the-multiplication-law-for-conditional-probability",
            "the-law-of-total-probability",
            "tree-diagrams-for-dependent-events",
            "tree-diagrams-for-dependent-events-applications",
            "independent-events",
            "tree-diagrams-for-independent-events",
          ],
        },
        {
          title: t("Discrete Random Variables", "离散随机变量"),
          topics: [
            "probability-mass-functions-of-discrete-random-variables",
            "cumulative-distribution-functions-for-discrete-random-variables",
            "expected-values-of-discrete-random-variables",
            "the-binomial-distribution",
            "modeling-with-the-binomial-distribution",
            "the-geometric-distribution",
            "modeling-with-the-geometric-distribution",
          ],
        },
        {
          title: t("The Normal Distribution", "正态分布"),
          topics: [
            "the-standard-normal-distribution",
            "symmetry-properties-of-the-standard-normal-distribution",
            "the-normal-distribution",
            "mean-and-variance-of-the-normal-distribution",
            "percentage-points-of-the-standard-normal-distribution",
            "modeling-with-the-normal-distribution",
            "the-empirical-rule-for-the-normal-distribution",
          ],
        },
      ],
    },
    {
      title: t("Statistics", "统计"),
      modules: [
        {
          title: t("Analyzing Data", "数据分析"),
          topics: [
            "sampling",
            "the-mean-of-a-data-set",
            "variance-and-standard-deviation",
            "estimating-means-and-variances-for-grouped-data",
            "scatter-plots",
            "covariance",
            "sums-of-squares",
            "the-z-score",
          ],
        },
        {
          title: t("Correlation", "相关"),
          topics: [
            "trend-lines",
            "predictions-with-trend-lines",
            "interpreting-trend-line-coefficients",
            "linear-correlation",
            "residuals-and-residual-plots",
            "the-linear-correlation-coefficient",
            "correlation-and-causation",
          ],
        },
        {
          title: t("Regression", "回归"),
          topics: [
            "selecting-a-regression-model",
            "linear-regression",
            "quadratic-regression",
            "semi-log-scatter-plots",
            "exponential-regression",
          ],
        },
      ],
    },
  ],
};

/** calculusI is the university Calculus I course. */
export const calculusI: CourseDef = {
  id: "calculus-i",
  title: t("Calculus I", "微积分 I"),
  description: t(
    "The hyperbolic functions; limits from graphs, the algebra of limits, limits of elementary functions, limits by algebraic manipulation, and special limits; continuity, the intermediate value theorem and removing discontinuities; the derivative and the rules of differentiation, the chain rule, implicit, inverse and logarithmic differentiation; rates of change, estimating derivatives, related rates and L'Hopital's rule; the mean value theorem, extrema, curve sketching, linearization, optimization and straight-line motion; and integration: antiderivatives, Riemann sums, definite integrals and the fundamental theorem of calculus, areas under curves and accumulation functions.",
    "双曲函数；由图像估计极限、极限的运算法则、初等函数的极限、用代数变形求极限与特殊极限；连续性、介值定理与消除间断点；导数与求导法则、链式法则、隐函数求导、反函数求导与对数求导法；变化率、估计导数、相关变化率与洛必达法则；中值定理、极值、曲线作图、线性化、最优化与直线运动；积分：原函数、黎曼和、定积分与微积分基本定理、曲线下的面积与累积函数。",
  ),
  units: [
    {
      title: t("Preliminaries", "预备知识"),
      modules: [
        {
          title: t("The Hyperbolic Functions", "双曲函数"),
          topics: [
            "the-hyperbolic-functions",
            "the-reciprocal-hyperbolic-functions",
            "solving-equations-containing-hyperbolic-functions",
            "graphs-of-the-hyperbolic-functions",
            "graphs-of-the-reciprocal-hyperbolic-functions",
            "the-inverse-hyperbolic-functions",
          ],
        },
      ],
    },
    {
      title: t("Limits", "极限"),
      modules: [
        {
          title: t("Estimating Limits from Graphs", "由图像估计极限"),
          topics: [
            "the-finite-limit-of-a-function",
            "the-left-and-right-sided-limits-of-a-function",
            "finding-the-existence-of-a-limit-using-one-sided-limits",
            "limits-at-infinity-from-graphs",
            "infinite-limits-from-graphs",
          ],
        },
        {
          title: t("The Algebra of Limits", "极限的运算法则"),
          topics: [
            "limits-of-power-functions-and-the-constant-rule-for-limits",
            "the-sum-rule-for-limits",
            "the-product-and-quotient-rules-for-limits",
            "the-power-and-root-rules-for-limits",
          ],
        },
        {
          title: t("Limits of Functions", "函数的极限"),
          topics: [
            "limits-at-infinity-of-polynomials",
            "limits-of-reciprocal-functions",
            "limits-of-exponential-functions",
            "limits-of-logarithmic-functions",
            "limits-of-radical-functions",
            "limits-of-trigonometric-functions",
            "limits-of-reciprocal-trigonometric-functions",
            "limits-of-inverse-trigonometric-functions",
            "limits-of-piecewise-functions",
          ],
        },
        {
          title: t("Determining Limits Using Algebraic Manipulation", "用代数变形求极限"),
          topics: [
            "calculating-limits-of-rational-functions-by-factoring",
            "limits-of-absolute-value-functions",
            "calculating-limits-of-radical-functions-using-conjugate-multiplication",
            "calculating-limits-using-trigonometric-identities",
            "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
            "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
            "evaluating-limits-at-infinity-of-radical-functions",
            "vertical-asymptotes-of-rational-functions",
            "infinite-limits-of-rational-functions",
          ],
        },
        {
          title: t("Special Limits", "特殊极限"),
          topics: [
            "the-squeeze-theorem",
            "special-limits-involving-sine",
            "evaluating-special-limits-involving-sine-using-a-substitution",
            "special-limits-involving-cosine",
            "limits-involving-the-exponential-function",
            "further-limits-involving-the-exponential-function",
          ],
        },
      ],
    },
    {
      title: t("Continuity", "连续性"),
      modules: [
        {
          title: t("Continuity", "连续性"),
          topics: [
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
          ],
        },
        {
          title: t("Removing Discontinuities", "消除间断点"),
          topics: ["removing-point-discontinuities", "removing-jump-discontinuities", "removing-discontinuities-from-rational-functions"],
        },
      ],
    },
    {
      title: t("Introduction to Differentiation", "微分入门"),
      modules: [
        {
          title: t("Introduction to Differentiation", "微分入门"),
          topics: [
            "the-average-rate-of-change-of-a-function",
            "the-average-rate-of-change-of-a-function-over-a-varying-interval",
            "the-instantaneous-rate-of-change-of-a-function-at-a-point",
            "defining-the-derivative-using-derivative-notation",
            "continuity-and-differentiability-of-functions",
            "the-power-rule-for-differentiation",
            "the-sum-and-constant-multiple-rules-for-differentiation",
            "calculating-the-slope-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-normal-line-using-differentiation",
          ],
        },
        {
          title: t("Derivatives of Functions and the Rules of Differentiation", "函数的导数与求导法则"),
          topics: [
            "differentiating-exponential-functions",
            "differentiating-logarithmic-functions",
            "differentiating-trigonometric-functions",
            "differentiating-hyperbolic-functions",
            "differentiating-reciprocal-hyperbolic-functions",
            "second-and-higher-order-derivatives",
            "the-product-rule-for-differentiation",
            "the-quotient-rule-for-differentiation",
            "differentiating-reciprocal-trigonometric-functions",
            "calculating-derivatives-from-data-and-tables",
            "calculating-derivatives-from-graphs",
            "recognizing-derivatives-in-limits",
          ],
        },
      ],
    },
    {
      title: t("Advanced Differentiation", "进阶微分"),
      modules: [
        {
          title: t("Differentiating Composite Functions", "复合函数求导"),
          topics: [
            "the-chain-rule-for-differentiation",
            "the-chain-rule-with-exponential-functions",
            "the-chain-rule-with-logarithmic-functions",
            "the-chain-rule-with-trigonometric-functions",
            "calculating-derivatives-from-data-using-the-chain-rule",
            "calculating-derivatives-from-graphs-using-the-chain-rule",
            "selecting-procedures-for-calculating-derivatives",
          ],
        },
        {
          title: t("Differentiating Implicit and Inverse Functions", "隐函数与反函数求导"),
          topics: [
            "implicit-differentiation",
            "calculating-slopes-of-circles-ellipses-and-parabolas",
            "calculating-dy-dx-using-dx-dy",
            "differentiating-inverse-functions",
            "differentiating-an-inverse-function-at-a-point",
            "differentiating-inverse-trigonometric-functions",
            "differentiating-inverse-reciprocal-trigonometric-functions",
            "differentiating-inverse-hyperbolic-functions",
            "differentiating-inverse-reciprocal-hyperbolic-functions",
          ],
        },
        {
          title: t("Differentiation Using Logarithms", "对数求导法"),
          topics: ["logarithmic-differentiation", "further-logarithmic-differentiation"],
        },
      ],
    },
    {
      title: t("Contextual Applications of Differentiation", "微分的情境应用"),
      modules: [
        {
          title: t("Contextual Applications of Differentiation", "微分的情境应用"),
          topics: ["interpreting-the-meaning-of-the-derivative-in-context", "rates-of-change-in-applied-contexts"],
        },
        {
          title: t("Estimating Derivatives", "估计导数"),
          topics: [
            "estimating-derivatives-using-a-forward-difference-quotient",
            "estimating-derivatives-using-a-backward-difference-quotient",
            "estimating-derivatives-using-a-central-difference-quotient",
          ],
        },
        {
          title: t("Related Rates of Change", "相关变化率"),
          topics: [
            "introduction-to-related-rates",
            "related-rates-with-implicit-functions",
            "calculating-related-rates-with-circles-and-spheres",
            "calculating-related-rates-with-squares",
            "calculating-related-rates-with-rectangular-solids",
            "calculating-related-rates-using-the-pythagorean-theorem",
            "calculating-related-rates-using-similar-triangles",
            "calculating-related-rates-using-trigonometry",
            "calculating-related-rates-with-cones",
          ],
        },
        {
          title: t("L'Hopital's Rule", "洛必达法则"),
          topics: ["lhopitals-rule", "lhopitals-rule-applied-to-tables"],
        },
      ],
    },
    {
      title: t("Analytical Applications of Differentiation", "微分的分析应用"),
      modules: [
        {
          title: t("Analytical Applications of Differentiation", "微分的分析应用"),
          topics: [
            "the-mean-value-theorem",
            "global-vs-local-extrema-and-critical-points",
            "the-extreme-value-theorem",
            "using-differentiation-to-calculate-critical-points",
            "determining-intervals-on-which-a-function-is-increasing-or-decreasing",
            "using-the-first-derivative-test-to-classify-local-extrema",
            "the-candidates-test",
            "intervals-of-concavity",
            "relating-concavity-to-the-second-derivative",
            "points-of-inflection",
            "the-second-derivative-test",
          ],
        },
        {
          title: t("Analysis of Curves", "曲线分析"),
          topics: [
            "sketching-the-derivative-of-a-function-from-the-functions-graph",
            "interpreting-the-graph-of-a-functions-derivative",
            "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection",
            "sketching-a-function-from-the-graph-of-its-derivative",
            "sketching-a-function-given-some-derivative-properties",
          ],
        },
        {
          title: t("Approximating Values of a Function", "函数值的近似"),
          topics: [
            "approximating-functions-using-local-linearity-and-linearization",
            "approximating-the-roots-of-a-number-using-local-linearity",
            "approximating-trigonometric-functions-using-local-linearity",
          ],
        },
        {
          title: t("Optimization", "最优化"),
          topics: [
            "solving-optimization-problems-using-derivatives",
            "optimization-problems-involving-sectors-of-circles",
            "optimization-problems-involving-boxes-and-trays",
            "optimization-problems-involving-cylinders",
            "optimizing-distances",
            "optimizing-distances-to-curves",
            "optimization-problems-with-inscribed-shapes",
            "optimization-problems-in-economics",
            "newtons-method",
            "newtons-method-for-optimizing-single-variable-functions",
          ],
        },
        {
          title: t("Displacement, Velocity, and Acceleration", "位移、速度与加速度"),
          topics: [
            "calculating-velocity-for-straight-line-motion-using-differentiation",
            "calculating-acceleration-for-straight-line-motion-using-differentiation",
            "determining-characteristics-of-moving-objects-using-differentiation",
            "newtons-second-law",
          ],
        },
      ],
    },
    {
      title: t("Integration", "积分"),
      modules: [
        {
          title: t("Indefinite Integrals", "不定积分"),
          topics: [
            "the-antiderivative",
            "the-constant-multiple-rule-for-indefinite-integrals",
            "the-sum-rule-for-indefinite-integrals",
            "integrating-the-reciprocal-function",
            "integrating-exponential-functions",
            "integrating-trigonometric-functions",
            "integration-using-inverse-trigonometric-functions",
            "integrating-hyperbolic-functions",
            "integration-using-inverse-hyperbolic-functions",
            "integration-using-inverse-reciprocal-hyperbolic-functions",
          ],
        },
        {
          title: t("Approximating Areas with Riemann Sums", "用黎曼和近似面积"),
          topics: [
            "approximating-areas-with-the-left-riemann-sum",
            "approximating-areas-with-the-right-riemann-sum",
            "approximating-areas-with-the-midpoint-riemann-sum",
            "approximating-areas-with-the-trapezoidal-rule",
            "left-and-right-riemann-sums-in-sigma-notation",
            "midpoint-and-trapezoidal-rules-in-sigma-notation",
            "approximating-areas-under-graphs-of-composite-functions",
          ],
        },
        {
          title: t("Definite Integrals", "定积分"),
          topics: [
            "defining-definite-integrals-using-left-and-right-riemann-sums",
            "the-fundamental-theorem-of-calculus",
            "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
            "the-sum-and-constant-multiple-rules-for-definite-integrals",
            "properties-of-definite-integrals-involving-the-limits-of-integration",
          ],
        },
        {
          title: t("The Area Under a Curve", "曲线下的面积"),
          topics: [
            "the-area-bounded-by-a-curve-and-the-x-axis",
            "evaluating-definite-integrals-using-symmetry",
            "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
            "the-area-bounded-by-a-curve-and-the-y-axis",
            "calculating-the-definite-integral-of-a-function-given-its-graph",
            "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph",
            "definite-integrals-of-piecewise-functions",
          ],
        },
        {
          title: t("Accumulation Functions", "累积函数"),
          topics: [
            "the-integral-as-an-accumulation-function",
            "the-second-fundamental-theorem-of-calculus",
            "maximizing-a-function-using-the-graph-of-its-derivative",
            "minimizing-a-function-using-the-graph-of-its-derivative",
            "further-optimizing-functions-using-graphs-of-derivatives",
          ],
        },
      ],
    },
  ],
};

/** linearAlgebra defines the complete Linear Algebra curriculum. */
export const linearAlgebra: CourseDef = {
  id: "linear-algebra",
  title: t("Linear Algebra", "线性代数"),
  description: t(
    "Systems of equations and matrices, Gaussian elimination, determinants, elementary matrices, and LU factorization; vectors in n-dimensional Euclidean space, linear combinations, span, linear independence, subspaces, bases, dimension, rank, and abstract vector spaces; linear transformations, kernel, image, and matrix representations; eigenvalues, eigenvectors, the characteristic equation, diagonalization, complex eigenvalues, generalized eigenvectors, and Jordan canonical form; inner product spaces, orthogonality, orthogonal projections, and the Gram-Schmidt process; quadratic forms, diagonalization of symmetric matrices, the spectral theorem, and singular value decomposition; with applications to linear least-squares problems, Markov chains, and linear regression.",
    "线性方程组与矩阵、高斯消元法、行列式、初等矩阵与 LU 分解；n 维欧几里得空间中的向量、线性组合、生成空间、线性无关性、子空间、基、维数、秩与抽象向量空间；线性变换、核、像与矩阵表示；特征值、特征向量、特征方程、对角化、复特征值、广义特征向量与若尔当标准型；内积空间、正交性、正交投影与施密特正交化过程；二次型、对称矩阵对角化、谱定理与奇异值分解；以及线性最小二乘问题、马尔可夫链和线性回归等实际应用。",
  ),
  units: [
    {
      title: t("Preliminaries", "预备知识"),
      modules: [
        {
          title: t("Introduction to Set Theory", "集合论初步"),
          topics: [
            "special-sets",
            "statements-and-predicates",
            "equivalent-sets",
            "the-constructive-definition-of-a-set",
            "the-conditional-definition-of-a-set",
            "describing-sets-using-set-builder-notation",
            "describing-planar-regions-using-set-builder-notation",
            "cardinality-of-finite-sets",
            "infinite-sets",
            "subsets",
          ],
        },
        {
          title: t("Set Operations", "集合运算"),
          topics: [
            "the-difference-of-sets",
            "set-complements",
            "the-cartesian-product",
            "visualizing-cartesian-products",
            "indexed-sets",
            "sets-and-functions",
          ],
        },
        {
          title: t("Vector Geometry", "向量几何"),
          topics: [
            "the-vector-equation-of-a-line",
            "the-parametric-equations-of-a-line",
            "the-cartesian-equation-of-a-line",
            "the-vector-equation-of-a-plane",
            "the-cartesian-equation-of-a-plane",
            "the-parametric-equations-of-a-plane",
            "the-intersection-of-two-planes",
            "the-shortest-distance-between-a-plane-and-a-point",
            "the-intersection-between-a-line-and-a-plane",
          ],
        },
      ],
    },
    {
      title: t("Matrices", "矩阵"),
      modules: [
        {
          title: t("Determinants", "行列式"),
          topics: [
            "cramers-rule-for-2x2-systems-of-linear-equations",
            "cramers-rule-for-3x3-systems",
            "the-determinant-of-an-nxn-matrix",
            "finding-determinants-using-laplace-expansions",
            "basic-properties-of-determinants",
            "further-properties-of-determinants",
            "row-and-column-operations-on-determinants",
            "conditions-when-a-determinant-equals-zero",
            "finding-determinants-using-row-and-column-operations",
            "partitioned-and-block-matrices",
          ],
        },
        {
          title: t("Gaussian Elimination", "高斯消元法"),
          topics: [
            "systems-of-equations-as-augmented-matrices",
            "row-echelon-form",
            "solving-systems-of-equations-using-back-substitution",
            "elementary-row-operations",
            "creating-rows-or-columns-containing-zeros-using-gaussian-elimination",
            "solving-2x2-systems-of-equations-using-gaussian-elimination",
            "solving-2x2-singular-systems-of-equations-using-gaussian-elimination",
            "solving-3x3-systems-of-equations-using-gaussian-elimination",
            "identifying-the-pivot-columns-of-a-matrix",
            "solving-3x3-singular-systems-of-equations-using-gaussian-elimination",
            "reduced-row-echelon-form",
            "gaussian-elimination-for-nxm-systems-of-equations",
          ],
        },
        {
          title: t("Elementary Matrices", "初等矩阵"),
          topics: [
            "elementary-2x2-matrices",
            "row-operations-on-2x2-matrices-as-products-of-elementary-matrices",
            "elementary-3x3-matrices",
            "row-operations-on-3x3-matrices-as-products-of-elementary-matrices",
          ],
        },
        {
          title: t("The Inverse of a Matrix", "逆矩阵"),
          topics: [
            "the-invertible-matrix-theorem-in-terms-of-2x2-systems-of-equations",
            "finding-the-inverse-of-a-2x2-matrix-using-row-operations",
            "finding-the-inverse-of-a-3x3-matrix-using-row-operations",
            "finding-the-inverse-of-an-nxn-square-matrix-using-row-operations",
            "matrices-with-easy-to-find-inverses",
          ],
        },
        {
          title: t("LU Factorization", "LU 分解"),
          topics: [
            "triangular-matrices",
            "lu-factorization-of-2x2-matrices",
            "lu-factorization-of-3x3-matrices",
            "lu-factorization-of-nxn-matrices",
            "solving-systems-of-equations-using-lu-factorization",
          ],
        },
      ],
    },
    {
      title: t("Vector Spaces", "向量空间"),
      modules: [
        {
          title: t("Vectors in N-Dimensional Space", "N 维空间中的向量"),
          topics: [
            "vectors-in-n-dimensional-euclidean-space",
            "linear-combinations-of-vectors-in-n-dimensional-euclidean-space",
            "linear-span-of-vectors-in-n-dimensional-euclidean-space",
            "linear-dependence-and-independence",
          ],
        },
        {
          title: t("Subspaces of N-Dimensional Space", "N 维空间的子空间"),
          topics: [
            "subspaces-of-n-dimensional-space",
            "subspaces-of-n-dimensional-space-geometric-interpretation",
            "the-column-space-of-a-matrix",
            "the-null-space-of-a-matrix",
          ],
        },
        {
          title: t("Bases of N-Dimensional Space", "N 维空间的基"),
          topics: [
            "finding-a-basis-of-a-span",
            "finding-a-basis-of-the-column-space-of-a-matrix",
            "finding-a-basis-of-the-null-space-of-a-matrix",
            "expressing-the-coordinates-of-a-vector-in-a-given-basis",
            "writing-vectors-in-different-bases",
            "the-change-of-coordinates-matrix",
            "changing-a-basis-using-the-change-of-coordinates-matrix",
          ],
        },
        {
          title: t("Dimension and Rank in N-Dimensional Space", "N 维空间的维数与秩"),
          topics: [
            "the-dimension-of-a-span",
            "the-rank-of-a-matrix",
            "the-dimension-of-the-null-space-of-a-matrix",
            "the-invertible-matrix-theorem-in-terms-of-dimension-rank-and-nullity",
            "the-rank-nullity-theorem",
          ],
        },
        {
          title: t("Abstract Vector Spaces", "抽象向量空间"),
          topics: [
            "introduction-to-abstract-vector-spaces",
            "defining-abstract-vector-spaces",
            "linear-independence-in-abstract-vector-spaces",
            "subspaces-of-abstract-vector-spaces",
            "bases-in-abstract-vector-spaces",
            "the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces",
            "dimension-in-abstract-vector-spaces",
          ],
        },
      ],
    },
    {
      title: t("Linear Transformations", "线性变换"),
      modules: [
        {
          title: t("Linear Transformations", "线性变换"),
          topics: [
            "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis",
            "kernel-of-a-linear-transformation",
            "image-and-rank-of-a-linear-transformation",
            "image-of-a-linear-transformation-in-the-cartesian-plane",
            "invertible-matrix-theorem-in-terms-of-linear-transformations",
            "rank-nullity-theorem-in-terms-of-linear-transformations",
          ],
        },
        {
          title: t("Linear Maps and Their Matrix Representations", "线性映射及其矩阵表示"),
          topics: [
            "matrix-of-a-linear-transformation-relative-to-a-basis",
            "connections-between-matrix-representations-of-a-linear-transformation",
            "linear-maps-between-two-different-vector-spaces",
            "matrix-of-a-linear-map-relative-to-two-bases",
          ],
        },
      ],
    },
    {
      title: t("Diagonalization of Matrices", "矩阵的对角化"),
      modules: [
        {
          title: t("Eigenvectors and Eigenvalues", "特征向量与特征值"),
          topics: [
            "eigenvalues-and-eigenvectors-of-a-2x2-matrix",
            "calculating-the-eigenvalues-of-a-2x2-matrix",
            "calculating-the-eigenvectors-of-a-2x2-matrix",
            "characteristic-equation-of-a-matrix",
            "cayley-hamilton-theorem",
            "calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues",
            "calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case",
            "invertible-matrix-theorem-in-terms-of-eigenvalues",
          ],
        },
        {
          title: t("Diagonalization", "对角化"),
          topics: [
            "diagonalizing-a-2x2-matrix",
            "properties-of-diagonalization",
            "diagonalizing-a-3x3-matrix-with-distinct-eigenvalues",
            "diagonalizing-a-3x3-matrix-in-the-general-case",
          ],
        },
        {
          title: t("Real Matrices With Complex Eigenvalues", "具有复特征值的实矩阵"),
          topics: [
            "vectors-over-the-complex-numbers",
            "matrices-over-the-complex-numbers",
            "finding-complex-eigenvalues-of-real-2x2-matrices",
            "finding-complex-eigenvectors-of-real-2x2-matrices",
            "rotation-scaling-matrices",
            "reducing-real-2x2-matrices-to-rotation-scaling-form",
            "block-diagonalization-of-nxn-matrices",
          ],
        },
        {
          title: t("Generalized Eigenvectors", "广义特征向量"),
          topics: [
            "nilpotent-and-idempotent-matrices",
            "generalized-eigenvectors",
            "ranks-of-generalized-eigenvectors",
            "finding-generalized-eigenvectors-of-specific-ranks",
          ],
        },
        {
          title: t("Jordan Canonical Decomposition", "若尔当标准型分解"),
          topics: [
            "jordan-blocks-and-jordan-matrices",
            "jordan-canonical-form-of-a-2x2-matrix",
            "jordan-canonical-decomposition-of-a-2x2-matrix",
            "jordan-canonical-form-of-a-3x3-matrix",
            "jordan-canonical-decomposition-of-a-3x3-matrix",
            "matrix-functions",
          ],
        },
      ],
    },
    {
      title: t("Projections", "投影"),
      modules: [
        {
          title: t("Inner Products", "内积"),
          topics: [
            "dot-product-in-n-dimensional-euclidean-space",
            "norm-of-a-vector-in-n-dimensional-euclidean-space",
            "inner-product-spaces",
            "inner-product-in-vector-spaces-over-the-complex-numbers",
            "norm-of-a-vector-in-inner-product-spaces",
          ],
        },
        {
          title: t("Orthogonality", "正交性"),
          topics: [
            "orthogonal-vectors-in-euclidean-spaces",
            "orthogonal-vectors-in-inner-product-spaces",
            "cauchy-schwarz-inequality-and-angle-between-two-vectors",
            "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces",
            "orthogonal-complements",
            "orthogonal-sets-in-euclidean-spaces",
            "orthogonal-sets-in-inner-product-spaces",
            "orthogonal-matrices",
            "orthogonal-linear-transformations",
            "four-fundamental-subspaces-of-a-matrix",
          ],
        },
        {
          title: t("Orthogonal Projections", "正交投影"),
          topics: [
            "projecting-vectors-onto-one-dimensional-subspaces",
            "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases-applications",
            "projection-matrices-linear-transformations-and-their-properties",
            "projecting-vectors-onto-subspaces-in-inner-product-spaces",
          ],
        },
        {
          title: t("Orthogonalization Processes", "正交化过程"),
          topics: ["gram-schmidt-process-for-two-vectors", "gram-schmidt-process-in-the-general-case", "qr-factorization"],
        },
      ],
    },
    {
      title: t("Quadratic Forms", "二次型"),
      modules: [
        {
          title: t("Diagonalization of Symmetric Matrices", "对称矩阵的对角化"),
          topics: [
            "symmetric-matrices",
            "diagonalization-of-2x2-symmetric-matrices",
            "diagonalization-of-3x3-symmetric-matrices",
            "spectral-theorem",
          ],
        },
        {
          title: t("Quadratic Forms", "二次型"),
          topics: [
            "bilinear-forms",
            "quadratic-forms",
            "change-of-variables-in-quadratic-forms",
            "canonical-form-of-a-quadratic-form-using-lagranges-method",
            "canonical-form-of-a-quadratic-form-using-orthogonal-transformations",
            "positive-definite-and-negative-definite-quadratic-forms",
          ],
        },
        {
          title: t("Quadratic Forms in Euclidian Space", "欧几里得空间中的二次型"),
          topics: ["reducing-a-quadratic-curve-to-its-principal-axes", "classifying-quadratic-curves"],
        },
        {
          title: t("Singular Value Decomposition", "奇异值分解"),
          topics: [
            "constrained-optimization-of-quadratic-forms",
            "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained",
            "singular-values-of-a-matrix",
            "computing-the-singular-values-of-a-matrix",
            "singular-value-decomposition-of-2x2-matrices",
            "singular-value-decomposition-of-2x2-matrices-with-zero-or-repeated-eigenvalues",
            "singular-value-decomposition-of-larger-matrices",
            "singular-value-decomposition-and-the-pseudoinverse-matrix",
          ],
        },
      ],
    },
    {
      title: t("Applications of Linear Algebra", "线性代数的应用"),
      modules: [
        {
          title: t("Linear Least-Squares Problems", "线性最小二乘问题"),
          topics: [
            "least-squares-solution-of-a-linear-system-without-collinearity",
            "least-squares-solution-of-a-linear-system-with-collinearity",
            "finding-a-least-squares-solution-using-qr-factorization",
            "weighted-least-squares",
          ],
        },
        {
          title: t("Markov Chains", "马尔可夫链"),
          topics: ["markov-chains", "steady-state-vectors"],
        },
        {
          title: t("Linear Regression", "线性回归"),
          topics: ["linear-regression-with-matrices", "polynomial-regression-with-matrices", "multiple-linear-regression-with-matrices"],
        },
      ],
    },
  ],
};

/** calculusII is the university Calculus II course. */
export const calculusII: CourseDef = {
  id: "calculus-ii",
  title: t("Calculus II", "微积分 II"),
  description: t(
    "Integration techniques: substitution, polynomial division, completing the square, trigonometric and hyperbolic identities, integration by parts, partial fractions and improper integrals; applications of integration: areas between curves, volumes, surface areas and motion; parametric equations, vector-valued functions and polar coordinates; sequences, series, convergence tests, Taylor polynomials and Taylor series; and first-order differential equations: separation of variables, exponential and logistic models, slope fields and Euler's method.",
    "积分技巧：换元法、多项式除法、配方、三角与双曲恒等式、分部积分、部分分式与反常积分；积分的应用：曲线间的面积、体积、曲面面积与运动；参数方程、向量值函数与极坐标；数列、级数、收敛判别法、泰勒多项式与泰勒级数；一阶微分方程：分离变量、指数与逻辑斯谛模型、斜率场与欧拉法。",
  ),
  units: [
    {
      title: t("Integration Techniques", "积分技巧"),
      modules: [
        {
          title: t("Integration Using Substitution", "换元积分法"),
          topics: [
            "integrating-algebraic-functions-using-substitution",
            "integrating-linear-rational-functions-using-substitution",
            "integration-using-substitution",
            "calculating-definite-integrals-using-substitution",
            "further-integration-of-algebraic-functions-using-substitution",
            "integrating-exponential-functions-using-linear-substitution",
            "integrating-exponential-functions-using-substitution",
            "integrating-trigonometric-functions-using-substitution",
            "integrating-logarithmic-functions-using-substitution",
            "integration-by-substitution-with-inverse-trigonometric-functions",
            "integrating-hyperbolic-functions-using-substitution",
            "integration-by-substitution-with-inverse-hyperbolic-functions",
            "integration-by-substitution-with-inverse-reciprocal-hyperbolic-functions",
          ],
        },
        {
          title: t("Special Techniques for Integration", "特殊积分技巧"),
          topics: [
            "integrating-functions-using-polynomial-division",
            "integrating-functions-by-completing-the-square",
            "integration-using-hyperbolic-functions-and-completing-the-square",
            "integration-using-inverse-reciprocal-hyperbolic-functions-and-completing-the-square",
          ],
        },
        {
          title: t("Integration Using Trigonometric Identities", "用三角恒等式积分"),
          topics: [
            "integration-using-basic-trigonometric-identities",
            "integration-using-the-pythagorean-identities",
            "integration-using-the-double-angle-formulas",
            "integrating-products-of-trigonometric-functions",
          ],
        },
        {
          title: t("Integration Using Hyperbolic Identities", "用双曲恒等式积分"),
          topics: [
            "integration-using-basic-hyperbolic-identities",
            "integration-using-the-hyperbolic-pythagorean-identities",
            "integration-using-the-hyperbolic-double-angle-formulas",
          ],
        },
        {
          title: t("Integration by Parts", "分部积分法"),
          topics: [
            "introduction-to-integration-by-parts",
            "using-integration-by-parts-to-calculate-integrals-with-logarithms",
            "applying-the-integration-by-parts-twice",
            "the-tabular-method-of-integration-by-parts",
            "integration-by-parts-in-cyclic-cases",
          ],
        },
        {
          title: t("Integration Using Partial Fractions", "用部分分式积分"),
          topics: [
            "expressing-rational-functions-as-sums-of-partial-fractions",
            "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions",
            "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions",
            "integrating-rational-functions-using-partial-fractions",
            "integrating-rational-functions-with-repeated-factors",
            "integrating-rational-functions-with-irreducible-quadratic-factors",
          ],
        },
        {
          title: t("Improper Integrals", "反常积分"),
          topics: [
            "improper-integrals",
            "improper-integrals-involving-exponential-functions",
            "improper-integrals-involving-arctangent",
            "improper-integrals-over-the-real-line",
            "improper-integrals-of-the-second-kind",
            "improper-integrals-of-the-second-kind-discontinuities-at-interior-points",
          ],
        },
      ],
    },
    {
      title: t("Applications of Integration", "积分的应用"),
      modules: [
        {
          title: t("Applications of Integration", "积分的应用"),
          topics: [
            "integrating-rates-of-change",
            "integrating-density-functions",
            "the-average-value-of-a-function",
            "the-area-between-curves-expressed-as-functions-of-x",
            "the-area-between-curves-expressed-as-functions-of-y",
            "finding-areas-between-curves-that-intersect-at-more-than-two-points",
            "the-arc-length-of-a-planar-curve",
          ],
        },
        {
          title: t("Volumes of Solids With Known Cross Sections", "已知截面的立体的体积"),
          topics: [
            "volumes-of-solids-with-square-cross-sections",
            "volumes-of-solids-with-rectangular-cross-sections",
            "volumes-of-solids-with-triangular-cross-sections",
            "volumes-of-solids-with-circular-cross-sections",
          ],
        },
        {
          title: t("Volumes of Revolution", "旋转体的体积"),
          topics: [
            "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes",
            "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes",
            "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes",
            "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes",
            "the-shell-method-rotating-a-region-about-the-x-axis",
            "the-shell-method-rotating-a-region-between-two-curves-about-the-x-axis",
            "the-shell-method-rotation-about-the-y-axis",
          ],
        },
        {
          title: t("Surface Areas of Revolution", "旋转曲面的面积"),
          topics: ["surface-areas-of-revolution-rotation-about-the-x-axis", "surface-areas-of-revolution-rotation-about-the-y-axis"],
        },
        {
          title: t("Connecting Position, Velocity and Acceleration Using Integrals", "用积分联系位置、速度与加速度"),
          topics: [
            "calculating-velocity-using-integration",
            "determining-characteristics-of-moving-objects-using-integration",
            "calculating-the-position-function-of-a-particle-using-integration",
            "calculating-the-displacement-of-a-particle-using-integration",
            "calculating-the-total-distance-traveled-by-a-particle",
            "average-position-velocity-and-acceleration",
          ],
        },
      ],
    },
    {
      title: t("Parametric & Polar Equations", "参数方程与极坐标方程"),
      modules: [
        {
          title: t("Parametric Equations", "参数方程"),
          topics: [
            "differentiating-parametric-curves",
            "calculating-tangent-and-normal-lines-with-parametric-equations",
            "second-derivatives-of-parametric-equations",
            "the-arc-length-of-a-parametric-curve",
            "surface-areas-of-revolution-for-parametric-curves",
            "calculating-areas-bounded-by-parametric-functions",
          ],
        },
        {
          title: t("Vector-Valued Functions", "向量值函数"),
          topics: ["defining-vector-valued-functions", "differentiating-vector-valued-functions", "integrating-vector-valued-functions"],
        },
        {
          title: t("The Planar Motion of a Particle", "质点的平面运动"),
          topics: [
            "calculating-velocity-for-plane-motion-using-differentiation",
            "calculating-acceleration-for-plane-motion-using-differentiation",
            "finding-velocity-vectors-in-two-dimensions-using-integration",
            "finding-displacement-vectors-in-two-dimensions-using-integration",
            "applying-newtons-second-law-in-the-plane",
          ],
        },
        {
          title: t("Polar Coordinates", "极坐标"),
          topics: [
            "differentiating-curves-given-in-polar-form",
            "further-differentiation-of-curves-given-in-polar-form",
            "horizontal-and-vertical-tangents-to-polar-curves",
            "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases",
            "tangent-and-normal-lines-to-polar-curves",
            "finding-the-area-of-a-polar-region",
            "finding-the-limits-of-integration-for-a-given-polar-region",
            "the-total-area-bounded-by-a-single-polar-curve",
            "the-area-bounded-by-two-polar-curves",
            "the-arc-length-of-a-polar-curve",
          ],
        },
      ],
    },
    {
      title: t("Sequences & Series", "数列与级数"),
      modules: [
        {
          title: t("Sequences", "数列"),
          topics: [
            "limits-of-sequences",
            "convergence-of-geometric-sequences",
            "further-convergence-of-geometric-sequences",
            "limits-of-sequences-with-factorials",
            "determining-limits-of-sequences-using-relative-magnitudes",
            "further-determining-limits-of-sequences-using-relative-magnitudes",
          ],
        },
        {
          title: t("Monotonic Sequences", "单调数列"),
          topics: [
            "monotonic-sequences",
            "identifying-monotonic-sequences-using-differentiation",
            "identifying-monotonic-sequences-using-ratios",
          ],
        },
        {
          title: t("Infinite Series", "无穷级数"),
          topics: [
            "infinite-series-and-partial-sums",
            "convergent-and-divergent-infinite-series",
            "properties-of-infinite-series",
            "further-properties-of-infinite-series",
            "telescoping-series",
          ],
        },
        {
          title: t("Geometric Series", "几何级数"),
          topics: [
            "finding-the-sum-of-an-infinite-geometric-series",
            "writing-an-infinite-geometric-series-in-sigma-notation",
            "sums-of-infinite-geometric-series-given-in-sigma-notation",
            "convergence-of-geometric-series",
            "repeating-decimals-as-infinite-geometric-series",
          ],
        },
        {
          title: t("Infinite Series Convergence Tests", "无穷级数的收敛判别法"),
          topics: [
            "the-nth-term-test-for-divergence",
            "the-integral-test",
            "the-remainder-estimate-for-the-integral-test",
            "harmonic-series-and-p-series",
            "the-comparison-test",
            "the-limit-comparison-test",
            "the-alternating-series-test",
            "the-ratio-test",
            "the-root-test",
            "absolute-and-conditional-convergence",
            "the-alternating-series-error-bound",
            "determining-convergence-parameters-for-infinite-series",
            "selecting-procedures-for-analyzing-infinite-series",
          ],
        },
        {
          title: t("Taylor Polynomials", "泰勒多项式"),
          topics: [
            "second-degree-taylor-polynomials",
            "analyzing-second-degree-taylor-polynomials",
            "third-degree-taylor-polynomials",
            "higher-degree-taylor-polynomials",
            "the-lagrange-error-bound",
          ],
        },
        {
          title: t("Taylor Series", "泰勒级数"),
          topics: [
            "radius-of-convergence-of-power-series-centered-at-the-origin",
            "radius-of-convergence-of-power-series",
            "maclaurin-series",
            "taylor-series",
            "representing-functions-as-power-series",
            "recognizing-standard-maclaurin-series",
            "recognizing-standard-maclaurin-series-for-trigonometric-functions",
            "differentiating-taylor-series",
            "approximating-integrals-using-taylor-series",
          ],
        },
      ],
    },
    {
      title: t("Differential Equations", "微分方程"),
      modules: [
        {
          title: t("Introduction to Differential Equations", "微分方程简介"),
          topics: [
            "introduction-to-differential-equations",
            "verifying-solutions-of-differential-equations",
            "solving-first-order-odes-using-direct-integration",
            "solving-first-order-odes-using-separation-of-variables",
            "solving-first-order-ivps-using-separation-of-variables",
            "modeling-with-first-order-odes",
            "further-modeling-with-first-order-odes",
          ],
        },
        {
          title: t("Qualitative Techniques for Differential Equations", "微分方程的定性方法"),
          topics: ["qualitative-analysis-of-first-order-odes", "equilibrium-solutions-of-first-order-odes"],
        },
        {
          title: t("Modeling Exponential Growth and Decay With Differential Equations", "用微分方程建立指数增长与衰减模型"),
          topics: [
            "exponential-growth-and-decay-models-with-first-order-odes",
            "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
            "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems",
          ],
        },
        {
          title: t("Modeling Logistic Growth With Differential Equations", "用微分方程建立逻辑斯谛增长模型"),
          topics: [
            "logistic-growth-models-with-first-order-odes",
            "qualitative-analysis-of-the-logistic-growth-equation",
            "solving-the-logistic-growth-equation",
          ],
        },
        {
          title: t("Slope Fields", "斜率场"),
          topics: [
            "slope-fields-for-directly-integrable-differential-equations",
            "slope-fields-for-autonomous-differential-equations",
            "slope-fields-for-nonautonomous-differential-equations",
            "analyzing-slope-fields-for-directly-integrable-differential-equations",
            "analyzing-slope-fields-for-autonomous-differential-equations",
            "analyzing-slope-fields-for-nonautonomous-differential-equations",
          ],
        },
        {
          title: t("Numerical Solutions of Differential Equations", "微分方程的数值解"),
          topics: ["eulers-method-calculating-one-step", "eulers-method-calculating-multiple-steps"],
        },
      ],
    },
  ],
};

/** apCalculusAB is the AP Calculus AB course. */
export const apCalculusAB: CourseDef = {
  id: "ap-calculus-ab",
  title: t("AP Calculus AB", "AP 微积分 AB"),
  description: t(
    "Limits and continuity; differentiation from the definition and fundamental rules, composite, implicit and inverse functions; contextual and analytical applications of differentiation, including related rates, straight-line motion, L'Hopital's rule, curve analysis, linearization and optimization; indefinite and definite integration, Riemann sums, the fundamental theorem of calculus, accumulation functions and substitution; first-order differential equations, exponential models and slope fields; applications of integration to average value, areas between curves, volumes of known cross sections and volumes of revolution; and graphing calculator techniques.",
    "极限与连续性；导数的定义与基本求导法则、复合函数、隐函数与反函数求导；微分的情境与分析应用，包括相关变化率、直线运动、洛必达法则、曲线分析、线性化与最优化；不定积分与定积分、黎曼和、微积分基本定理、累积函数与换元积分法；一阶微分方程、指数增长与衰减模型及斜率场；积分在函数平均值、曲线间面积、已知截面立体体积与旋转体体积中的应用；以及图形计算器技术应用。",
  ),
  units: [
    {
      title: t("Limits and Continuity", "极限与连续性"),
      modules: [
        {
          title: t("Estimating Limits from Graphs", "由图像估计极限"),
          topics: [
            "the-finite-limit-of-a-function",
            "the-left-and-right-sided-limits-of-a-function",
            "finding-the-existence-of-a-limit-using-one-sided-limits",
            "limits-at-infinity-from-graphs",
            "infinite-limits-from-graphs",
          ],
        },
        {
          title: t("The Algebra of Limits", "极限的运算法则"),
          topics: [
            "limits-of-power-functions-and-the-constant-rule-for-limits",
            "the-sum-rule-for-limits",
            "the-product-and-quotient-rules-for-limits",
            "the-power-and-root-rules-for-limits",
          ],
        },
        {
          title: t("Limits of Functions", "函数的极限"),
          topics: [
            "limits-at-infinity-of-polynomials",
            "limits-of-reciprocal-functions",
            "limits-of-exponential-functions",
            "limits-of-logarithmic-functions",
            "limits-of-radical-functions",
            "limits-of-trigonometric-functions",
            "limits-of-reciprocal-trigonometric-functions",
            "limits-of-piecewise-functions",
          ],
        },
        {
          title: t("Determining Limits Using Algebraic Manipulation", "用代数变形求极限"),
          topics: [
            "calculating-limits-of-rational-functions-by-factoring",
            "limits-of-absolute-value-functions",
            "calculating-limits-of-radical-functions-using-conjugate-multiplication",
            "calculating-limits-using-trigonometric-identities",
            "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
            "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
            "evaluating-limits-at-infinity-of-radical-functions",
            "vertical-asymptotes-of-rational-functions",
            "infinite-limits-of-rational-functions",
          ],
        },
        {
          title: t("Special Limits", "特殊极限"),
          topics: [
            "the-squeeze-theorem",
            "special-limits-involving-sine",
            "evaluating-special-limits-involving-sine-using-a-substitution",
            "special-limits-involving-cosine",
          ],
        },
        {
          title: t("Continuity", "连续性"),
          topics: [
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
          ],
        },
        {
          title: t("Removing Discontinuities", "消除间断点"),
          topics: ["removing-point-discontinuities", "removing-jump-discontinuities", "removing-discontinuities-from-rational-functions"],
        },
      ],
    },
    {
      title: t("Differentiation: Definition and Fundamental Properties", "微分：定义与基本性质"),
      modules: [
        {
          title: t("Introduction to Differentiation", "微分入门"),
          topics: [
            "the-average-rate-of-change-of-a-function-over-a-varying-interval",
            "the-instantaneous-rate-of-change-of-a-function-at-a-point",
            "defining-the-derivative-using-derivative-notation",
            "continuity-and-differentiability-of-functions",
            "the-power-rule-for-differentiation",
            "the-sum-and-constant-multiple-rules-for-differentiation",
            "calculating-the-slope-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-normal-line-using-differentiation",
          ],
        },
        {
          title: t("Derivatives of Functions and the Rules of Differentiation", "函数的导数与求导法则"),
          topics: [
            "differentiating-exponential-functions",
            "differentiating-logarithmic-functions",
            "differentiating-trigonometric-functions",
            "second-and-higher-order-derivatives",
            "the-product-rule-for-differentiation",
            "the-quotient-rule-for-differentiation",
            "differentiating-reciprocal-trigonometric-functions",
            "calculating-derivatives-from-data-and-tables",
            "calculating-derivatives-from-graphs",
            "recognizing-derivatives-in-limits",
          ],
        },
      ],
    },
    {
      title: t("Differentiation: Composite, Implicit, and Inverse Functions", "微分：复合函数、隐函数与反函数"),
      modules: [
        {
          title: t("Differentiating Composite Functions", "复合函数求导"),
          topics: [
            "the-chain-rule-for-differentiation",
            "the-chain-rule-with-exponential-functions",
            "the-chain-rule-with-logarithmic-functions",
            "the-chain-rule-with-trigonometric-functions",
            "calculating-derivatives-from-data-using-the-chain-rule",
            "calculating-derivatives-from-graphs-using-the-chain-rule",
            "selecting-procedures-for-calculating-derivatives",
          ],
        },
        {
          title: t("Differentiating Implicit and Inverse Functions", "隐函数与反函数求导"),
          topics: [
            "implicit-differentiation",
            "calculating-dy-dx-using-dx-dy",
            "differentiating-inverse-functions",
            "differentiating-an-inverse-function-at-a-point",
            "differentiating-inverse-trigonometric-functions",
            "differentiating-inverse-reciprocal-trigonometric-functions",
          ],
        },
      ],
    },
    {
      title: t("Contextual Applications of Differentiation", "微分的情境应用"),
      modules: [
        {
          title: t("Contextual Applications of Differentiation", "微分的情境应用"),
          topics: ["interpreting-the-meaning-of-the-derivative-in-context", "rates-of-change-in-applied-contexts"],
        },
        {
          title: t("Estimating Derivatives", "估计导数"),
          topics: [
            "estimating-derivatives-using-a-forward-difference-quotient",
            "estimating-derivatives-using-a-backward-difference-quotient",
            "estimating-derivatives-using-a-central-difference-quotient",
          ],
        },
        {
          title: t("Displacement, Velocity, and Acceleration", "位移、速度与加速度"),
          topics: [
            "calculating-velocity-for-straight-line-motion-using-differentiation",
            "calculating-acceleration-for-straight-line-motion-using-differentiation",
            "determining-characteristics-of-moving-objects-using-differentiation",
          ],
        },
        {
          title: t("Related Rates of Change", "相关变化率"),
          topics: [
            "introduction-to-related-rates",
            "related-rates-with-implicit-functions",
            "calculating-related-rates-with-circles-and-spheres",
            "calculating-related-rates-with-squares",
            "calculating-related-rates-with-rectangular-solids",
            "calculating-related-rates-using-the-pythagorean-theorem",
            "calculating-related-rates-using-similar-triangles",
            "calculating-related-rates-using-trigonometry",
            "calculating-related-rates-with-cones",
          ],
        },
      ],
    },
    {
      title: t("Analytical Applications of Differentiation", "微分的分析应用"),
      modules: [
        {
          title: t("L'Hopital's Rule", "洛必达法则"),
          topics: ["lhopitals-rule", "lhopitals-rule-applied-to-tables"],
        },
        {
          title: t("Analytical Applications of Differentiation", "微分的分析应用"),
          topics: [
            "the-mean-value-theorem",
            "global-vs-local-extrema-and-critical-points",
            "the-extreme-value-theorem",
            "using-differentiation-to-calculate-critical-points",
            "determining-intervals-on-which-a-function-is-increasing-or-decreasing",
            "using-the-first-derivative-test-to-classify-local-extrema",
            "the-candidates-test",
            "intervals-of-concavity",
            "relating-concavity-to-the-second-derivative",
            "points-of-inflection",
            "the-second-derivative-test",
          ],
        },
        {
          title: t("Analysis of Curves", "曲线分析"),
          topics: [
            "sketching-the-derivative-of-a-function-from-the-functions-graph",
            "interpreting-the-graph-of-a-functions-derivative",
            "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection",
            "sketching-a-function-from-the-graph-of-its-derivative",
            "sketching-a-function-given-some-derivative-properties",
          ],
        },
        {
          title: t("Approximating Values of a Function", "函数值的近似"),
          topics: [
            "approximating-functions-using-local-linearity-and-linearization",
            "approximating-the-roots-of-a-number-using-local-linearity",
            "approximating-trigonometric-functions-using-local-linearity",
          ],
        },
        {
          title: t("Optimization", "最优化"),
          topics: [
            "solving-optimization-problems-using-derivatives",
            "optimization-problems-involving-sectors-of-circles",
            "optimization-problems-involving-boxes-and-trays",
            "optimization-problems-involving-cylinders",
            "optimizing-distances",
            "optimizing-distances-to-curves",
            "optimization-problems-with-inscribed-shapes",
            "optimization-problems-in-economics",
          ],
        },
      ],
    },
    {
      title: t("Integration", "积分"),
      modules: [
        {
          title: t("Indefinite Integrals", "不定积分"),
          topics: [
            "the-antiderivative",
            "the-constant-multiple-rule-for-indefinite-integrals",
            "the-sum-rule-for-indefinite-integrals",
            "integrating-the-reciprocal-function",
            "integrating-exponential-functions",
            "integrating-trigonometric-functions",
            "integration-using-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Approximating Areas with Riemann Sums", "用黎曼和近似面积"),
          topics: [
            "approximating-areas-with-the-left-riemann-sum",
            "approximating-areas-with-the-right-riemann-sum",
            "approximating-areas-with-the-midpoint-riemann-sum",
            "approximating-areas-with-the-trapezoidal-rule",
            "left-and-right-riemann-sums-in-sigma-notation",
            "midpoint-and-trapezoidal-rules-in-sigma-notation",
            "approximating-areas-under-graphs-of-composite-functions",
          ],
        },
        {
          title: t("Definite Integrals", "定积分"),
          topics: [
            "defining-definite-integrals-using-left-and-right-riemann-sums",
            "the-fundamental-theorem-of-calculus",
            "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
            "the-sum-and-constant-multiple-rules-for-definite-integrals",
            "properties-of-definite-integrals-involving-the-limits-of-integration",
          ],
        },
        {
          title: t("The Area Under a Curve", "曲线下的面积"),
          topics: [
            "the-area-bounded-by-a-curve-and-the-x-axis",
            "evaluating-definite-integrals-using-symmetry",
            "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
            "the-area-bounded-by-a-curve-and-the-y-axis",
            "calculating-the-definite-integral-of-a-function-given-its-graph",
            "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph",
            "definite-integrals-of-piecewise-functions",
          ],
        },
        {
          title: t("Accumulation Functions", "累积函数"),
          topics: [
            "the-integral-as-an-accumulation-function",
            "the-second-fundamental-theorem-of-calculus",
            "maximizing-a-function-using-the-graph-of-its-derivative",
            "minimizing-a-function-using-the-graph-of-its-derivative",
            "further-optimizing-functions-using-graphs-of-derivatives",
            "integrating-rates-of-change",
            "integrating-density-functions",
          ],
        },
        {
          title: t("Integration Using Substitution", "换元积分法"),
          topics: [
            "integrating-algebraic-functions-using-substitution",
            "integrating-linear-rational-functions-using-substitution",
            "integration-using-substitution",
            "calculating-definite-integrals-using-substitution",
            "further-integration-of-algebraic-functions-using-substitution",
            "integrating-exponential-functions-using-linear-substitution",
            "integrating-exponential-functions-using-substitution",
            "integrating-trigonometric-functions-using-substitution",
            "integrating-logarithmic-functions-using-substitution",
            "integration-by-substitution-with-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Integration Using Trigonometric Identities", "用三角恒等式积分"),
          topics: [
            "integration-using-basic-trigonometric-identities",
            "integration-using-the-pythagorean-identities",
            "integration-using-the-double-angle-formulas",
          ],
        },
        {
          title: t("Special Techniques for Integration", "特殊积分技巧"),
          topics: ["integrating-functions-using-polynomial-division", "integrating-functions-by-completing-the-square"],
        },
      ],
    },
    {
      title: t("Differential Equations", "微分方程"),
      modules: [
        {
          title: t("Introduction to Differential Equations", "微分方程简介"),
          topics: [
            "introduction-to-differential-equations",
            "verifying-solutions-of-differential-equations",
            "solving-first-order-odes-using-direct-integration",
            "solving-first-order-odes-using-separation-of-variables",
            "solving-first-order-ivps-using-separation-of-variables",
            "modeling-with-first-order-odes",
            "further-modeling-with-first-order-odes",
            "exponential-growth-and-decay-models-with-first-order-odes",
            "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
            "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems",
          ],
        },
        {
          title: t("Qualitative Techniques for Differential Equations", "微分方程的定性方法"),
          topics: ["qualitative-analysis-of-first-order-odes", "equilibrium-solutions-of-first-order-odes"],
        },
        {
          title: t("Slope Fields", "斜率场"),
          topics: [
            "slope-fields-for-directly-integrable-differential-equations",
            "slope-fields-for-autonomous-differential-equations",
            "slope-fields-for-nonautonomous-differential-equations",
            "analyzing-slope-fields-for-directly-integrable-differential-equations",
            "analyzing-slope-fields-for-autonomous-differential-equations",
            "analyzing-slope-fields-for-nonautonomous-differential-equations",
          ],
        },
      ],
    },
    {
      title: t("Applications of Integration", "积分的应用"),
      modules: [
        {
          title: t("Applications of Integration", "积分的应用"),
          topics: [
            "the-average-value-of-a-function",
            "the-area-between-curves-expressed-as-functions-of-x",
            "the-area-between-curves-expressed-as-functions-of-y",
            "finding-areas-between-curves-that-intersect-at-more-than-two-points",
          ],
        },
        {
          title: t("Connecting Position, Velocity and Acceleration Using Integrals", "用积分联系位置、速度与加速度"),
          topics: [
            "calculating-velocity-using-integration",
            "determining-characteristics-of-moving-objects-using-integration",
            "calculating-the-position-function-of-a-particle-using-integration",
            "calculating-the-displacement-of-a-particle-using-integration",
            "calculating-the-total-distance-traveled-by-a-particle",
            "average-position-velocity-and-acceleration",
          ],
        },
        {
          title: t("Volumes of Solids With Known Cross Sections", "已知截面的立体的体积"),
          topics: [
            "volumes-of-solids-with-square-cross-sections",
            "volumes-of-solids-with-rectangular-cross-sections",
            "volumes-of-solids-with-triangular-cross-sections",
            "volumes-of-solids-with-circular-cross-sections",
          ],
        },
        {
          title: t("Volumes of Revolution", "旋转体的体积"),
          topics: [
            "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes",
            "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes",
            "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes",
            "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes",
          ],
        },
      ],
    },
    {
      title: t("Applications of Technology", "技术应用"),
      modules: [
        {
          title: t("Using Graphing Calculators", "使用图形计算器"),
          topics: [
            "evaluating-expressions-using-a-graphing-calculator",
            "finding-roots-of-functions-using-a-graphing-calculator",
            "finding-intersections-of-functions-using-a-graphing-calculator",
            "finding-extrema-of-functions-using-a-graphing-calculator",
            "finding-derivatives-using-a-graphing-calculator",
            "finding-definite-integrals-using-a-graphing-calculator",
            "exploring-functions-using-technology",
          ],
        },
      ],
    },
  ],
};

/** apCalculusBC is the AP Calculus BC course. */
export const apCalculusBC: CourseDef = {
  id: "ap-calculus-bc",
  title: t("AP Calculus BC", "AP 微积分 BC"),
  description: t(
    "Complete AP Calculus BC curriculum: limits and continuity; differentiation and advanced differentiation; contextual and analytical applications of differentiation; indefinite and definite integrals, Riemann sums and accumulation functions; integration techniques including substitution, integration by parts, partial fractions and improper integrals; first-order differential equations, logistic growth, slope fields and Euler's method; applications of integration including arc length and volumes; parametric equations, vector-valued functions, polar calculus and planar particle dynamics; sequences, infinite series and convergence tests; Taylor polynomials, power series and Taylor series; and graphing calculator techniques.",
    "完整的 AP 微积分 BC 课程：极限与连续性；微分与进阶微分；微分的情境与分析应用；不定积分与定积分、黎曼和与累积函数；换元法、分部积分法、部分分式与反常积分等积分技巧；一阶微分方程、逻辑斯谛增长、斜率场与欧拉法；含弧长与体积在内的积分应用；参数方程、向量值函数、极坐标微积分与平面质点动力学；数列、无穷级数与收敛判别法；泰勒多项式、幂级数与泰勒级数；以及图形计算器技术应用。",
  ),
  units: [
    {
      title: t("Limits", "极限"),
      modules: [
        {
          title: t("Estimating Limits from Graphs", "由图像估计极限"),
          topics: [
            "the-finite-limit-of-a-function",
            "the-left-and-right-sided-limits-of-a-function",
            "finding-the-existence-of-a-limit-using-one-sided-limits",
            "limits-at-infinity-from-graphs",
            "infinite-limits-from-graphs",
          ],
        },
        {
          title: t("The Algebra of Limits", "极限的运算法则"),
          topics: [
            "limits-of-power-functions-and-the-constant-rule-for-limits",
            "the-sum-rule-for-limits",
            "the-product-and-quotient-rules-for-limits",
            "the-power-and-root-rules-for-limits",
          ],
        },
        {
          title: t("Limits of Functions", "函数的极限"),
          topics: [
            "limits-at-infinity-of-polynomials",
            "limits-of-reciprocal-functions",
            "limits-of-exponential-functions",
            "limits-of-logarithmic-functions",
            "limits-of-radical-functions",
            "limits-of-trigonometric-functions",
            "limits-of-reciprocal-trigonometric-functions",
            "limits-of-inverse-trigonometric-functions",
            "limits-of-piecewise-functions",
          ],
        },
        {
          title: t("Determining Limits Using Algebraic Manipulation", "用代数变形求极限"),
          topics: [
            "calculating-limits-of-rational-functions-by-factoring",
            "limits-of-absolute-value-functions",
            "calculating-limits-of-radical-functions-using-conjugate-multiplication",
            "calculating-limits-using-trigonometric-identities",
            "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
            "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
            "evaluating-limits-at-infinity-of-radical-functions",
            "vertical-asymptotes-of-rational-functions",
            "infinite-limits-of-rational-functions",
          ],
        },
        {
          title: t("Special Limits", "特殊极限"),
          topics: [
            "the-squeeze-theorem",
            "special-limits-involving-sine",
            "evaluating-special-limits-involving-sine-using-a-substitution",
            "special-limits-involving-cosine",
            "limits-involving-the-exponential-function",
          ],
        },
      ],
    },
    {
      title: t("Continuity", "连续性"),
      modules: [
        {
          title: t("Continuity", "连续性"),
          topics: [
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
          ],
        },
        {
          title: t("Removing Discontinuities", "消除间断点"),
          topics: ["removing-point-discontinuities", "removing-jump-discontinuities", "removing-discontinuities-from-rational-functions"],
        },
      ],
    },
    {
      title: t("Introduction to Differentiation", "微分入门"),
      modules: [
        {
          title: t("Introduction to Differentiation", "微分入门"),
          topics: [
            "the-average-rate-of-change-of-a-function-over-a-varying-interval",
            "the-instantaneous-rate-of-change-of-a-function-at-a-point",
            "defining-the-derivative-using-derivative-notation",
            "continuity-and-differentiability-of-functions",
            "the-power-rule-for-differentiation",
            "the-sum-and-constant-multiple-rules-for-differentiation",
            "calculating-the-slope-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-normal-line-using-differentiation",
          ],
        },
        {
          title: t("Derivatives of Functions and the Rules of Differentiation", "函数的导数与求导法则"),
          topics: [
            "differentiating-exponential-functions",
            "differentiating-logarithmic-functions",
            "differentiating-trigonometric-functions",
            "second-and-higher-order-derivatives",
            "the-product-rule-for-differentiation",
            "the-quotient-rule-for-differentiation",
            "differentiating-reciprocal-trigonometric-functions",
            "calculating-derivatives-from-data-and-tables",
            "calculating-derivatives-from-graphs",
            "recognizing-derivatives-in-limits",
          ],
        },
      ],
    },
    {
      title: t("Advanced Differentiation", "进阶微分"),
      modules: [
        {
          title: t("Differentiating Composite Functions", "复合函数求导"),
          topics: [
            "the-chain-rule-for-differentiation",
            "the-chain-rule-with-exponential-functions",
            "the-chain-rule-with-logarithmic-functions",
            "the-chain-rule-with-trigonometric-functions",
            "calculating-derivatives-from-data-using-the-chain-rule",
            "calculating-derivatives-from-graphs-using-the-chain-rule",
            "selecting-procedures-for-calculating-derivatives",
          ],
        },
        {
          title: t("Differentiating Implicit and Inverse Functions", "隐函数与反函数求导"),
          topics: [
            "implicit-differentiation",
            "calculating-slopes-of-circles-ellipses-and-parabolas",
            "calculating-dy-dx-using-dx-dy",
            "differentiating-inverse-functions",
            "differentiating-an-inverse-function-at-a-point",
            "differentiating-inverse-trigonometric-functions",
            "differentiating-inverse-reciprocal-trigonometric-functions",
          ],
        },
      ],
    },
    {
      title: t("Contextual Applications of Differentiation", "微分的情境应用"),
      modules: [
        {
          title: t("Contextual Applications of Differentiation", "微分的情境应用"),
          topics: ["interpreting-the-meaning-of-the-derivative-in-context", "rates-of-change-in-applied-contexts"],
        },
        {
          title: t("Estimating Derivatives", "估计导数"),
          topics: [
            "estimating-derivatives-using-a-forward-difference-quotient",
            "estimating-derivatives-using-a-backward-difference-quotient",
            "estimating-derivatives-using-a-central-difference-quotient",
          ],
        },
        {
          title: t("Related Rates of Change", "相关变化率"),
          topics: [
            "introduction-to-related-rates",
            "related-rates-with-implicit-functions",
            "calculating-related-rates-with-circles-and-spheres",
            "calculating-related-rates-with-squares",
            "calculating-related-rates-with-rectangular-solids",
            "calculating-related-rates-using-the-pythagorean-theorem",
            "calculating-related-rates-using-similar-triangles",
            "calculating-related-rates-using-trigonometry",
            "calculating-related-rates-with-cones",
          ],
        },
        {
          title: t("L'Hopital's Rule", "洛必达法则"),
          topics: ["lhopitals-rule", "lhopitals-rule-applied-to-tables"],
        },
      ],
    },
    {
      title: t("Analytical Applications of Differentiation", "微分的分析应用"),
      modules: [
        {
          title: t("Analytical Applications of Differentiation", "微分的分析应用"),
          topics: [
            "the-mean-value-theorem",
            "global-vs-local-extrema-and-critical-points",
            "the-extreme-value-theorem",
            "using-differentiation-to-calculate-critical-points",
            "determining-intervals-on-which-a-function-is-increasing-or-decreasing",
            "using-the-first-derivative-test-to-classify-local-extrema",
            "the-candidates-test",
            "intervals-of-concavity",
            "relating-concavity-to-the-second-derivative",
            "points-of-inflection",
            "the-second-derivative-test",
          ],
        },
        {
          title: t("Analysis of Curves", "曲线分析"),
          topics: [
            "sketching-the-derivative-of-a-function-from-the-functions-graph",
            "interpreting-the-graph-of-a-functions-derivative",
            "interpreting-the-graph-of-a-functions-derivative-concavity-and-points-of-inflection",
            "sketching-a-function-from-the-graph-of-its-derivative",
            "sketching-a-function-given-some-derivative-properties",
          ],
        },
        {
          title: t("Approximating Values of a Function", "函数值的近似"),
          topics: [
            "approximating-functions-using-local-linearity-and-linearization",
            "approximating-the-roots-of-a-number-using-local-linearity",
            "approximating-trigonometric-functions-using-local-linearity",
          ],
        },
        {
          title: t("Optimization", "最优化"),
          topics: [
            "solving-optimization-problems-using-derivatives",
            "optimization-problems-involving-sectors-of-circles",
            "optimization-problems-involving-boxes-and-trays",
            "optimization-problems-involving-cylinders",
            "optimizing-distances",
            "optimizing-distances-to-curves",
            "optimization-problems-with-inscribed-shapes",
            "optimization-problems-in-economics",
          ],
        },
      ],
    },
    {
      title: t("Integration", "积分"),
      modules: [
        {
          title: t("Indefinite Integrals", "不定积分"),
          topics: [
            "the-antiderivative",
            "the-constant-multiple-rule-for-indefinite-integrals",
            "the-sum-rule-for-indefinite-integrals",
            "integrating-the-reciprocal-function",
            "integrating-exponential-functions",
            "integrating-trigonometric-functions",
            "integration-using-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Approximating Areas with Riemann Sums", "用黎曼和近似面积"),
          topics: [
            "approximating-areas-with-the-left-riemann-sum",
            "approximating-areas-with-the-right-riemann-sum",
            "approximating-areas-with-the-midpoint-riemann-sum",
            "approximating-areas-with-the-trapezoidal-rule",
            "left-and-right-riemann-sums-in-sigma-notation",
            "midpoint-and-trapezoidal-rules-in-sigma-notation",
            "approximating-areas-under-graphs-of-composite-functions",
          ],
        },
        {
          title: t("Definite Integrals", "定积分"),
          topics: [
            "defining-definite-integrals-using-left-and-right-riemann-sums",
            "the-fundamental-theorem-of-calculus",
            "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
            "the-sum-and-constant-multiple-rules-for-definite-integrals",
            "properties-of-definite-integrals-involving-the-limits-of-integration",
          ],
        },
        {
          title: t("The Area Under a Curve", "曲线下的面积"),
          topics: [
            "the-area-bounded-by-a-curve-and-the-x-axis",
            "evaluating-definite-integrals-using-symmetry",
            "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
            "the-area-bounded-by-a-curve-and-the-y-axis",
            "calculating-the-definite-integral-of-a-function-given-its-graph",
            "calculating-the-definite-integral-of-a-functions-derivative-given-its-graph",
            "definite-integrals-of-piecewise-functions",
          ],
        },
        {
          title: t("Accumulation Functions", "累积函数"),
          topics: [
            "the-integral-as-an-accumulation-function",
            "the-second-fundamental-theorem-of-calculus",
            "maximizing-a-function-using-the-graph-of-its-derivative",
            "minimizing-a-function-using-the-graph-of-its-derivative",
            "further-optimizing-functions-using-graphs-of-derivatives",
            "integrating-rates-of-change",
            "integrating-density-functions",
          ],
        },
      ],
    },
    {
      title: t("Techniques of Integration", "积分技巧"),
      modules: [
        {
          title: t("Integration Using Substitution", "换元积分法"),
          topics: [
            "integrating-algebraic-functions-using-substitution",
            "integrating-linear-rational-functions-using-substitution",
            "integration-using-substitution",
            "calculating-definite-integrals-using-substitution",
            "further-integration-of-algebraic-functions-using-substitution",
            "integrating-exponential-functions-using-linear-substitution",
            "integrating-exponential-functions-using-substitution",
            "integrating-trigonometric-functions-using-substitution",
            "integrating-logarithmic-functions-using-substitution",
            "integration-by-substitution-with-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Integration Using Trigonometric Identities", "用三角恒等式积分"),
          topics: [
            "integration-using-basic-trigonometric-identities",
            "integration-using-the-pythagorean-identities",
            "integration-using-the-double-angle-formulas",
          ],
        },
        {
          title: t("Special Techniques for Integration", "特殊积分技巧"),
          topics: ["integrating-functions-using-polynomial-division", "integrating-functions-by-completing-the-square"],
        },
        {
          title: t("Integration by Parts", "分部积分法"),
          topics: [
            "introduction-to-integration-by-parts",
            "using-integration-by-parts-to-calculate-integrals-with-logarithms",
            "applying-the-integration-by-parts-twice",
            "the-tabular-method-of-integration-by-parts",
            "integration-by-parts-in-cyclic-cases",
          ],
        },
        {
          title: t("Integration Using Partial Fractions", "用部分分式积分"),
          topics: [
            "expressing-rational-functions-as-sums-of-partial-fractions",
            "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions",
            "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions",
            "integrating-rational-functions-using-partial-fractions",
            "integrating-rational-functions-with-repeated-factors",
            "integrating-rational-functions-with-irreducible-quadratic-factors",
          ],
        },
        {
          title: t("Improper Integrals", "反常积分"),
          topics: [
            "improper-integrals",
            "improper-integrals-involving-exponential-functions",
            "improper-integrals-involving-arctangent",
            "improper-integrals-over-the-real-line",
            "improper-integrals-of-the-second-kind",
            "improper-integrals-of-the-second-kind-discontinuities-at-interior-points",
          ],
        },
      ],
    },
    {
      title: t("Differential Equations", "微分方程"),
      modules: [
        {
          title: t("Introduction to Differential Equations", "微分方程简介"),
          topics: [
            "introduction-to-differential-equations",
            "verifying-solutions-of-differential-equations",
            "solving-first-order-odes-using-direct-integration",
            "solving-first-order-odes-using-separation-of-variables",
            "solving-first-order-ivps-using-separation-of-variables",
            "modeling-with-first-order-odes",
            "further-modeling-with-first-order-odes",
          ],
        },
        {
          title: t("Qualitative Techniques for Differential Equations", "微分方程的定性方法"),
          topics: ["qualitative-analysis-of-first-order-odes", "equilibrium-solutions-of-first-order-odes"],
        },
        {
          title: t("Modeling Exponential Growth and Decay With Differential Equations", "用微分方程建立指数增长与衰减模型"),
          topics: [
            "exponential-growth-and-decay-models-with-first-order-odes",
            "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
            "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems",
          ],
        },
        {
          title: t("Modeling Logistic Growth With Differential Equations", "用微分方程建立逻辑斯谛增长模型"),
          topics: [
            "logistic-growth-models-with-first-order-odes",
            "qualitative-analysis-of-the-logistic-growth-equation",
            "solving-the-logistic-growth-equation",
          ],
        },
        {
          title: t("Slope Fields", "斜率场"),
          topics: [
            "slope-fields-for-directly-integrable-differential-equations",
            "slope-fields-for-autonomous-differential-equations",
            "slope-fields-for-nonautonomous-differential-equations",
            "analyzing-slope-fields-for-directly-integrable-differential-equations",
            "analyzing-slope-fields-for-autonomous-differential-equations",
            "analyzing-slope-fields-for-nonautonomous-differential-equations",
          ],
        },
        {
          title: t("Numerical Solutions of Differential Equations", "微分方程的数值解"),
          topics: ["eulers-method-calculating-one-step", "eulers-method-calculating-multiple-steps"],
        },
      ],
    },
    {
      title: t("Applications of Integration", "积分的应用"),
      modules: [
        {
          title: t("Applications of Integration", "积分的应用"),
          topics: [
            "the-average-value-of-a-function",
            "the-area-between-curves-expressed-as-functions-of-x",
            "the-area-between-curves-expressed-as-functions-of-y",
            "finding-areas-between-curves-that-intersect-at-more-than-two-points",
            "the-arc-length-of-a-planar-curve",
          ],
        },
        {
          title: t("Volumes of Solids With Known Cross Sections", "已知截面的立体的体积"),
          topics: [
            "volumes-of-solids-with-square-cross-sections",
            "volumes-of-solids-with-rectangular-cross-sections",
            "volumes-of-solids-with-triangular-cross-sections",
            "volumes-of-solids-with-circular-cross-sections",
          ],
        },
        {
          title: t("Volumes of Revolution", "旋转体的体积"),
          topics: [
            "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes",
            "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes",
            "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes",
            "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes",
          ],
        },
      ],
    },
    {
      title: t("Parametric Equations", "参数方程"),
      modules: [
        {
          title: t("Parametric Equations", "参数方程"),
          topics: [
            "differentiating-parametric-curves",
            "calculating-tangent-and-normal-lines-with-parametric-equations",
            "second-derivatives-of-parametric-equations",
            "the-arc-length-of-a-parametric-curve",
          ],
        },
        {
          title: t("Vector-Valued Functions", "向量值函数"),
          topics: ["defining-vector-valued-functions", "differentiating-vector-valued-functions", "integrating-vector-valued-functions"],
        },
      ],
    },
    {
      title: t("Polar Equations", "极坐标方程"),
      modules: [
        {
          title: t("Polar Coordinates", "极坐标"),
          topics: [
            "differentiating-curves-given-in-polar-form",
            "further-differentiation-of-curves-given-in-polar-form",
            "horizontal-and-vertical-tangents-to-polar-curves",
            "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases",
            "tangent-and-normal-lines-to-polar-curves",
            "finding-the-area-of-a-polar-region",
            "finding-the-limits-of-integration-for-a-given-polar-region",
            "the-total-area-bounded-by-a-single-polar-curve",
            "the-area-bounded-by-two-polar-curves",
            "the-arc-length-of-a-polar-curve",
          ],
        },
      ],
    },
    {
      title: t("Particle Dynamics", "质点动力学"),
      modules: [
        {
          title: t("Displacement, Velocity, and Acceleration", "位移、速度与加速度"),
          topics: [
            "calculating-velocity-for-straight-line-motion-using-differentiation",
            "calculating-acceleration-for-straight-line-motion-using-differentiation",
            "determining-characteristics-of-moving-objects-using-differentiation",
          ],
        },
        {
          title: t("Connecting Position, Velocity and Acceleration Using Integrals", "用积分联系位置、速度与加速度"),
          topics: [
            "calculating-velocity-using-integration",
            "determining-characteristics-of-moving-objects-using-integration",
            "calculating-the-position-function-of-a-particle-using-integration",
            "calculating-the-displacement-of-a-particle-using-integration",
            "calculating-the-total-distance-traveled-by-a-particle",
            "average-position-velocity-and-acceleration",
          ],
        },
        {
          title: t("The Planar Motion of a Particle", "质点的平面运动"),
          topics: [
            "calculating-velocity-for-plane-motion-using-differentiation",
            "calculating-acceleration-for-plane-motion-using-differentiation",
            "finding-velocity-vectors-in-two-dimensions-using-integration",
            "finding-displacement-vectors-in-two-dimensions-using-integration",
          ],
        },
      ],
    },
    {
      title: t("Sequences & Series", "数列与级数"),
      modules: [
        {
          title: t("Sequences", "数列"),
          topics: [
            "limits-of-sequences",
            "convergence-of-geometric-sequences",
            "further-convergence-of-geometric-sequences",
            "limits-of-sequences-with-factorials",
            "determining-limits-of-sequences-using-relative-magnitudes",
            "further-determining-limits-of-sequences-using-relative-magnitudes",
          ],
        },
        {
          title: t("Monotonic Sequences", "单调数列"),
          topics: [
            "monotonic-sequences",
            "identifying-monotonic-sequences-using-differentiation",
            "identifying-monotonic-sequences-using-ratios",
          ],
        },
        {
          title: t("Infinite Series", "无穷级数"),
          topics: [
            "infinite-series-and-partial-sums",
            "convergent-and-divergent-infinite-series",
            "properties-of-infinite-series",
            "further-properties-of-infinite-series",
            "telescoping-series",
          ],
        },
        {
          title: t("Geometric Series", "几何级数"),
          topics: [
            "finding-the-sum-of-an-infinite-geometric-series",
            "writing-an-infinite-geometric-series-in-sigma-notation",
            "sums-of-infinite-geometric-series-given-in-sigma-notation",
            "convergence-of-geometric-series",
            "repeating-decimals-as-infinite-geometric-series",
          ],
        },
        {
          title: t("Infinite Series Convergence Tests", "无穷级数的收敛判别法"),
          topics: [
            "the-nth-term-test-for-divergence",
            "the-integral-test",
            "harmonic-series-and-p-series",
            "the-comparison-test",
            "the-limit-comparison-test",
            "the-alternating-series-test",
            "the-ratio-test",
            "absolute-and-conditional-convergence",
            "the-alternating-series-error-bound",
            "determining-convergence-parameters-for-infinite-series",
            "selecting-procedures-for-analyzing-infinite-series",
          ],
        },
      ],
    },
    {
      title: t("Power Series", "幂级数"),
      modules: [
        {
          title: t("Taylor Polynomials", "泰勒多项式"),
          topics: [
            "second-degree-taylor-polynomials",
            "analyzing-second-degree-taylor-polynomials",
            "third-degree-taylor-polynomials",
            "higher-degree-taylor-polynomials",
            "the-lagrange-error-bound",
          ],
        },
        {
          title: t("Taylor Series", "泰勒级数"),
          topics: [
            "radius-of-convergence-of-power-series-centered-at-the-origin",
            "radius-of-convergence-of-power-series",
            "maclaurin-series",
            "taylor-series",
            "representing-functions-as-power-series",
            "recognizing-standard-maclaurin-series",
            "recognizing-standard-maclaurin-series-for-trigonometric-functions",
            "differentiating-taylor-series",
            "approximating-integrals-using-taylor-series",
          ],
        },
      ],
    },
    {
      title: t("Applications of Technology", "技术应用"),
      modules: [
        {
          title: t("Using Graphing Calculators", "使用图形计算器"),
          topics: [
            "evaluating-expressions-using-a-graphing-calculator",
            "finding-roots-of-functions-using-a-graphing-calculator",
            "finding-intersections-of-functions-using-a-graphing-calculator",
            "finding-extrema-of-functions-using-a-graphing-calculator",
            "finding-derivatives-using-a-graphing-calculator",
            "finding-definite-integrals-using-a-graphing-calculator",
            "finding-improper-integrals-using-a-graphing-calculator",
            "exploring-functions-using-technology",
            "plotting-parametric-and-polar-curves-using-technology",
          ],
        },
      ],
    },
  ],
};

/** methodsOfProof is the university Methods of Proof course. */
export const methodsOfProof: CourseDef = {
  id: "methods-of-proof",
  title: t("Methods of Proof", "证明方法"),
  description: t(
    "Propositional and predicate logic, quantifiers and logical inference; sets, subsets and set operations; direct proof, proof by contrapositive and by contradiction; divisibility, the division algorithm, primes and proof by induction; sequences and their limits, injections, surjections, bijections and the cardinality of infinite sets; modular congruence, linear congruences and the Chinese remainder theorem; and relations, equivalence relations, equivalence classes and the integers modulo n.",
    "命题逻辑与谓词逻辑、量词与逻辑推理；集合、子集与集合运算；直接证明、逆否证法与反证法；整除、带余除法、素数与数学归纳法；数列及其极限，单射、满射、双射与无限集的基数；模同余、线性同余方程与中国剩余定理；关系、等价关系、等价类与模 n 整数。",
  ),
  units: [
    {
      title: t("Set Theory", "集合论"),
      modules: [
        {
          title: t("Introduction to Set Theory", "集合论入门"),
          topics: [
            "special-sets",
            "equivalent-sets",
            "the-constructive-definition-of-a-set",
            "the-conditional-definition-of-a-set",
            "describing-sets-using-set-builder-notation",
            "describing-planar-regions-using-set-builder-notation",
            "cardinality-of-finite-sets",
            "infinite-sets",
            "the-maximum-and-minimum-of-a-set",
          ],
        },
        {
          title: t("Subsets", "子集"),
          topics: ["subsets", "power-sets", "partitions-of-sets"],
        },
        {
          title: t("Set Operations", "集合运算"),
          topics: [
            "the-difference-of-sets",
            "set-complements",
            "indicator-functions",
            "the-cartesian-product",
            "visualizing-cartesian-products",
            "indexed-sets",
            "disjoint-sets",
          ],
        },
      ],
    },
    {
      title: t("Logic", "逻辑"),
      modules: [
        {
          title: t("Statements", "命题"),
          topics: [
            "statements-and-predicates",
            "the-and-and-or-connectives",
            "truth-tables",
            "the-not-connective",
            "logical-equivalence",
            "logical-associative-and-commutative-laws",
            "the-distributive-laws",
            "the-absorption-laws",
            "de-morgans-laws-for-logic",
          ],
        },
        {
          title: t("Implications and Biconditionals", "蕴涵与双条件"),
          topics: [
            "conditional-statements",
            "logical-equivalence-with-conditional-statements",
            "biconditional-statements",
            "tautologies-and-contradictions",
            "converse-inverse-and-contrapositive",
          ],
        },
        {
          title: t("Predicates", "谓词"),
          topics: [
            "truth-sets-of-predicates",
            "the-and-and-or-connectives-with-predicates",
            "the-not-connective-with-predicates",
            "simplifying-predicate-expressions-using-de-morgans-laws",
            "conditional-statements-with-predicates",
            "necessary-and-sufficient-conditions",
            "grammatical-constructions-for-conditional-statements",
            "translating-between-logical-and-set-operations",
          ],
        },
        {
          title: t("Quantifiers", "量词"),
          topics: [
            "universal-and-existential-quantifiers",
            "negating-quantified-statements",
            "nested-quantifiers",
            "formal-and-informal-language",
            "negating-statements-with-nested-quantifiers",
            "prenex-normal-form",
          ],
        },
        {
          title: t("Logical Inference", "逻辑推理"),
          topics: [
            "implication-elimination-and-denying-the-consequent",
            "disjunctive-syllogism-and-transitivity-of-implication",
            "additional-rules-of-logical-inference",
          ],
        },
        {
          title: t("Properties of Set Operations", "集合运算的性质"),
          topics: [
            "proving-subset-relations",
            "elementary-properties-of-set-operations",
            "proving-elementary-properties-of-set-operations",
            "de-morgans-laws-for-sets",
            "proving-de-morgans-laws-for-sets",
            "distributive-properties-of-set-operations",
            "proving-distributive-properties-of-union-and-intersection",
            "proving-distributive-properties-of-the-cartesian-product",
          ],
        },
      ],
    },
    {
      title: t("Mathematical Proof", "数学证明"),
      modules: [
        {
          title: t("Introduction to Mathematical Proof", "数学证明入门"),
          topics: [
            "direct-proof",
            "proving-parity",
            "proving-divisibility",
            "proof-by-cases",
            "disproving-universal-statements",
            "disproving-implications",
            "trivial-and-vacuous-proofs",
            "proving-biconditional-statements",
          ],
        },
        {
          title: t("Proof by Contrapositive and Contradiction", "逆否证法与反证法"),
          topics: [
            "proof-by-contrapositive",
            "proving-parity-by-contrapositive",
            "proving-divisibility-by-contrapositive",
            "proof-by-contradiction",
            "proving-irrationality-by-contradiction",
            "proving-properties-of-irrationals-by-contradiction",
            "proving-divisibility-by-contradiction",
          ],
        },
      ],
    },
    {
      title: t("Discrete Mathematics & Number Theory", "离散数学与数论"),
      modules: [
        {
          title: t("Divisibility", "整除"),
          topics: [
            "parity",
            "integer-divisibility",
            "the-division-algorithm",
            "the-euclidean-algorithm",
            "the-extended-euclidean-algorithm",
            "linear-diophantine-equations",
            "properties-of-integer-divisibility",
            "properties-of-prime-divisibility",
          ],
        },
        {
          title: t("Proof by Induction", "数学归纳法"),
          topics: [
            "mathematical-induction",
            "proving-inequalities-using-induction",
            "proving-divisibility-using-induction",
            "proving-matrix-identities-using-induction",
            "strong-induction-and-recurrence-relations",
          ],
        },
      ],
    },
    {
      title: t("Sequences & Functions", "数列与函数"),
      modules: [
        {
          title: t("Sequences", "数列"),
          topics: [
            "the-limit-of-a-null-sequence",
            "proving-the-limit-of-a-null-sequence",
            "proving-the-finite-limit-of-a-sequence",
            "infinite-limits-of-sequences",
            "proving-a-sequence-has-an-infinite-limit",
          ],
        },
        {
          title: t("Functions", "函数"),
          topics: [
            "sets-and-functions",
            "injections",
            "proving-injectivity",
            "surjections",
            "into-functions",
            "proving-surjectivity",
            "bijections",
            "the-floor-and-ceiling-functions",
          ],
        },
        {
          title: t("Cardinality", "基数"),
          topics: [
            "discrete-infinite-sets-with-equal-cardinality",
            "continuous-infinite-sets-with-equal-cardinality",
            "cardinality-of-the-natural-numbers-integers-and-rationals",
            "cantors-diagonal-argument",
            "the-cantor-bernstein-schroder-theorem",
            "the-cardinality-of-the-power-set-of-natural-numbers",
            "cantors-theorem",
          ],
        },
      ],
    },
    {
      title: t("Congruence of Integers", "整数的同余"),
      modules: [
        {
          title: t("Modular Congruence", "模同余"),
          topics: [
            "modular-congruence",
            "the-addition-property-of-modular-arithmetic",
            "modular-residues",
            "the-multiplication-properties-of-modular-arithmetic",
            "the-division-properties-of-modular-arithmetic",
            "proving-properties-of-modular-congruence",
            "proving-divisibility-using-congruence",
            "proving-congruence-by-contrapositive",
          ],
        },
        {
          title: t("Linear Congruences", "线性同余方程"),
          topics: [
            "additive-inverses-modulo-n",
            "multiplicative-inverses-modulo-n",
            "solving-linear-congruences",
            "solving-advanced-linear-congruences",
            "the-chinese-remainder-theorem",
            "proving-properties-of-linear-congruences",
          ],
        },
      ],
    },
    {
      title: t("Equivalence Relations", "等价关系"),
      modules: [
        {
          title: t("Relations", "关系"),
          topics: [
            "relations-on-finite-sets",
            "relations-on-infinite-sets",
            "the-domain-and-range-of-a-relation",
            "graphical-representations-of-relations",
            "operations-on-relations",
            "n-ary-relations",
            "functional-relations",
          ],
        },
        {
          title: t("Equivalence Relations", "等价关系"),
          topics: [
            "reflexive-and-irreflexive-relations",
            "symmetric-and-antisymmetric-relations",
            "transitive-relations",
            "equivalence-relations",
            "proving-a-relation-is-an-equivalence-relation",
            "residue-classes",
            "equivalence-classes",
            "the-integers-modulo-n",
          ],
        },
      ],
    },
  ],
};

/** discreteMathematics is the university course on Boolean algebra, number theory, probability, recursion, graphs and the theory of algorithms. */
export const discreteMathematics: CourseDef = {
  id: "discrete-mathematics",
  title: t("Discrete Mathematics", "离散数学"),
  description: t(
    "Boolean functions, normal forms, Karnaugh maps, Post's functional completeness theorem and logic circuits; numbers in different bases, Fermat's and Euler's theorems and cryptography; discrete random variables and distributions, Bayes' theorem and combinatorics; finite and geometric series and the binomial theorem; recurrence relations and generating functions; graphs, trees, matrix representations of graphs and graph algorithms; and finite-state machines, Turing machines and asymptotic notation.",
    "布尔函数、范式、卡诺图、Post 函数完备性定理与逻辑电路；不同进制的数、费马定理与欧拉定理以及密码学；离散随机变量及其分布、贝叶斯定理与组合学；有限级数、几何级数与二项式定理；递推关系与生成函数；图、树、图的矩阵表示与图算法；以及有限状态机、图灵机与渐近记号。",
  ),
  units: [
    {
      title: t("Preliminaries", "预备知识"),
      modules: [
        {
          title: t("Matrices", "矩阵"),
          topics: [
            "systems-of-equations-as-augmented-matrices",
            "row-echelon-form",
            "solving-systems-of-equations-using-back-substitution",
            "symmetric-matrices",
          ],
        },
      ],
    },
    {
      title: t("Boolean Algebra", "布尔代数"),
      modules: [
        {
          title: t("Boolean Functions", "布尔函数"),
          topics: [
            "boolean-functions",
            "boolean-functions-and-logical-operations",
            "disjunctive-normal-forms",
            "principal-disjunctive-normal-forms",
            "conjunctive-normal-forms",
            "principal-conjunctive-normal-forms",
            "boolean-polynomials",
            "simplifying-logical-expressions-using-karnaugh-maps",
          ],
        },
        {
          title: t("Classes of Boolean Functions", "布尔函数类"),
          topics: [
            "truth-preserving-boolean-functions",
            "self-dual-boolean-functions",
            "monotonic-boolean-functions",
            "affine-boolean-functions",
            "functionally-complete-sets",
            "posts-functional-completeness-theorem",
          ],
        },
        {
          title: t("Logic Circuits", "逻辑电路"),
          topics: ["introduction-to-logic-circuits", "logic-gates-and-combinational-circuits", "simplifying-logic-circuits"],
        },
      ],
    },
    {
      title: t("Number Theory", "数论"),
      modules: [
        {
          title: t("Numbers in Different Bases", "不同进制的数"),
          topics: [
            "binary-integers",
            "adding-and-subtracting-binary-integers",
            "multiplying-and-dividing-binary-integers",
            "binary-fractions",
            "hexadecimal-integers",
            "converting-between-binary-and-hexadecimal-integers",
            "integers-in-arbitrary-bases",
            "fractions-in-arbitrary-bases",
          ],
        },
        {
          title: t("Fermat and Euler's Theorems", "费马定理与欧拉定理"),
          topics: ["fermats-little-theorem", "eulers-totient-function", "eulers-theorem"],
        },
        {
          title: t("Cryptography", "密码学"),
          topics: ["introduction-to-cryptography", "the-linear-cipher", "the-diffie-hellman-protocol", "the-rsa-cryptosystem"],
        },
      ],
    },
    {
      title: t("Probability and Combinatorics", "概率与组合"),
      modules: [
        {
          title: t("Discrete Random Variables", "离散随机变量"),
          topics: [
            "probability-mass-functions-of-discrete-random-variables",
            "cumulative-distribution-functions-for-discrete-random-variables",
            "one-to-one-transformations-of-discrete-random-variables",
            "many-to-one-transformations-of-discrete-random-variables",
            "expected-values-of-discrete-random-variables",
            "properties-of-expectation-for-discrete-random-variables",
            "variance-of-discrete-random-variables",
            "moments-of-discrete-random-variables",
            "properties-of-variance-for-discrete-random-variables",
          ],
        },
        {
          title: t("The Discrete Uniform Distribution", "离散均匀分布"),
          topics: [
            "the-discrete-uniform-distribution",
            "mean-and-variance-of-the-discrete-uniform-distribution",
            "modeling-with-discrete-uniform-distributions",
          ],
        },
        {
          title: t("The Bernoulli Distribution", "伯努利分布"),
          topics: ["the-bernoulli-distribution", "mean-and-variance-of-the-bernoulli-distribution"],
        },
        {
          title: t("The Binomial Distribution", "二项分布"),
          topics: [
            "the-binomial-distribution",
            "modeling-with-the-binomial-distribution",
            "mean-and-variance-of-the-binomial-distribution",
          ],
        },
        {
          title: t("The Poisson Distribution", "泊松分布"),
          topics: [
            "the-poisson-distribution",
            "modeling-with-the-poisson-distribution",
            "mean-and-variance-of-the-poisson-distribution",
            "the-poisson-approximation-of-the-binomial-distribution",
          ],
        },
        {
          title: t("The Geometric Distribution", "几何分布"),
          topics: [
            "the-geometric-distribution",
            "modeling-with-the-geometric-distribution",
            "mean-and-variance-of-the-geometric-distribution",
          ],
        },
        {
          title: t("The Negative Binomial Distribution", "负二项分布"),
          topics: ["the-negative-binomial-distribution", "modeling-with-the-negative-binomial-distribution"],
        },
        {
          title: t("The Hypergeometric Distribution", "超几何分布"),
          topics: ["the-hypergeometric-distribution", "the-pmf-of-the-hypergeometric-distribution"],
        },
        {
          title: t("Bayes' Theorem", "贝叶斯定理"),
          topics: ["the-law-of-total-probability", "extending-the-law-of-total-probability", "bayes-theorem", "extending-bayes-theorem"],
        },
        {
          title: t("Combinatorics", "组合学"),
          topics: [
            "permutations-with-repetition",
            "k-permutations-of-n-with-repetition",
            "combinations-with-repetition",
            "the-inclusion-exclusion-principle",
            "counting-integer-solutions-of-a-constrained-equation",
            "partitions-of-natural-numbers",
            "the-pigeonhole-principle",
          ],
        },
      ],
    },
    {
      title: t("Sequences", "数列"),
      modules: [
        {
          title: t("Finite Series", "有限级数"),
          topics: ["finite-linear-series", "finite-quadratic-series", "finite-cubic-series"],
        },
        {
          title: t("Geometric Series", "几何级数"),
          topics: [
            "infinite-series-and-partial-sums",
            "convergent-and-divergent-infinite-series",
            "finding-the-sum-of-an-infinite-geometric-series",
            "writing-an-infinite-geometric-series-in-sigma-notation",
            "sums-of-infinite-geometric-series-given-in-sigma-notation",
          ],
        },
        {
          title: t("The Binomial Theorem", "二项式定理"),
          topics: [
            "the-generalized-binomial-theorem",
            "working-with-the-generalized-binomial-theorem",
            "determining-ranges-of-validity-for-generalized-binomial-expansions",
            "approximating-values-using-the-generalized-binomial-theorem",
            "the-multinomial-theorem",
            "counting-terms-in-multinomial-expansions",
          ],
        },
      ],
    },
    {
      title: t("Recursion", "递归"),
      modules: [
        {
          title: t("Recurrence Relations", "递推关系"),
          topics: [
            "introduction-to-recurrence-relations",
            "first-order-recurrence-relations",
            "first-order-recurrence-relations-with-polynomial-forcing",
            "first-order-recurrence-relations-with-exponential-forcing",
          ],
        },
        {
          title: t("Second-Order Recurrence Relations", "二阶递推关系"),
          topics: [
            "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
            "second-order-homogeneous-recurrence-relations-with-repeated-roots",
            "second-order-homogeneous-recurrence-relations-with-complex-roots",
            "second-order-recurrence-relations-with-polynomial-forcing",
            "second-order-recurrence-relations-with-exponential-forcing",
          ],
        },
        {
          title: t("Generating Functions", "生成函数"),
          topics: [
            "generating-functions",
            "generating-functions-of-homogeneous-recurrence-relations",
            "determining-the-general-term-of-a-sequence-from-its-generating-function",
            "solving-homogeneous-recurrence-relations-using-generating-functions",
            "generating-functions-for-inhomogeneous-recurrence-relations",
          ],
        },
      ],
    },
    {
      title: t("Graph Theory", "图论"),
      modules: [
        {
          title: t("Introduction to Graph Theory", "图论入门"),
          topics: [
            "introduction-to-graphs",
            "walks-trails-paths-and-distances",
            "walks-paths-and-distances-in-directed-graphs",
            "the-degree-of-a-vertex",
            "the-handshaking-lemma",
            "subgraphs-and-graph-complements",
            "complete-and-bipartite-graphs",
            "regular-graphs",
            "planar-graphs",
          ],
        },
        {
          title: t("Connectivity in Graphs", "图的连通性"),
          topics: ["cycles-in-graphs", "connected-graphs", "cut-vertices-and-cut-edges"],
        },
        {
          title: t("Trees", "树"),
          topics: ["trees-and-forests", "counting-trees"],
        },
        {
          title: t("Matrix Representations of Graphs", "图的矩阵表示"),
          topics: ["incidence-matrices", "adjacency-matrices", "adjacency-matrices-of-directed-graphs", "distance-matrices"],
        },
        {
          title: t("DAGs and Topological Ordering", "有向无环图与拓扑排序"),
          topics: ["directed-acyclic-graphs", "topological-ordering", "kahns-algorithm"],
        },
        {
          title: t("Algorithms on Graphs", "图算法"),
          topics: [
            "breadth-first-search",
            "kruskals-algorithm",
            "prims-algorithm",
            "applying-prims-algorithm-to-a-distance-matrix",
            "shortest-paths-in-unweighted-graphs",
            "dijkstras-algorithm",
          ],
        },
      ],
    },
    {
      title: t("The Theory of Algorithms", "算法理论"),
      modules: [
        {
          title: t("Finite-State Transducers", "有限状态转换器"),
          topics: ["mealy-machines", "moore-machines"],
        },
        {
          title: t("Finite-State Acceptors", "有限状态接受器"),
          topics: [
            "deterministic-finite-automata",
            "processing-strings-using-deterministic-finite-automata",
            "nondeterministic-finite-automata",
            "the-language-of-automata",
            "regular-expressions",
          ],
        },
        {
          title: t("Turing Machines", "图灵机"),
          topics: ["introduction-to-turing-machines", "processing-strings-using-turing-machines", "nondeterministic-turing-machines"],
        },
        {
          title: t("Algorithmic Complexity", "算法复杂度"),
          topics: ["big-o-notation", "big-omega-notation", "big-theta-notation"],
        },
      ],
    },
  ],
};

/** integratedMathI is the high-school integrated mathematics course. */
export const integratedMathI: CourseDef = {
  id: "integrated-math-i",
  title: t("Integrated Math I", "综合数学一"),
  description: t(
    "Linear equations and inequalities, linear modeling, systems of equations and two-variable inequalities; units and variation; polynomials, operations and factoring; rational and radical expressions and equations; function concepts, domain, range, and behavior; absolute value equations, inequalities, and graphs; exponent rules, exponential equations, and exponential growth and decay; geometric transformations in the coordinate plane, right triangles and the Pythagorean theorem, circles, arcs and sectors, and coordinate geometry.",
    "一元一次方程与不等式、线性建模、方程组与二元一次不等式；单位换算与比例关系；多项式运算与因式分解；分式与根式及方程；函数概念、定义域、值域与性质；绝对值方程、不等式与图像；指数法则、指数方程与指数增长和衰减；坐标平面上的几何变换、直角三角形与勾股定理、圆与扇形及坐标几何。",
  ),
  units: [
    {
      title: t("Equations & Inequalities", "方程与不等式"),
      modules: [
        {
          title: t("Linear Equations", "一次方程"),
          topics: [
            "linear-equations-with-unknown-coefficients",
            "unknown-coefficients-by-factoring",
            "linear-inequalities-with-parameters",
            "many-variable-equations",
          ],
        },
        {
          title: t("Modeling With Linear Equations", "用一次方程建模"),
          topics: [
            "interpreting-linear-expressions",
            "modeling-with-linear-equations",
            "consecutive-integer-problems",
            "speed-distance-time",
            "further-speed-distance-time",
            "work-problems",
            "mixture-problems",
          ],
        },
        {
          title: t("Linear Inequalities", "一次不等式"),
          topics: [
            "solving-compound-inequalities",
            "interval-notation",
            "unbounded-intervals",
            "unions-of-intervals",
            "intersections-of-intervals",
            "compound-or-inequalities",
            "compound-and-inequalities",
            "introduction-to-modeling-with-inequalities",
            "modeling-with-one-step-inequalities",
            "modeling-with-two-step-inequalities",
            "modeling-with-compound-inequalities",
          ],
        },
        {
          title: t("Nonlinear Equations", "非线性方程"),
          topics: ["solving-equations-with-square-roots", "solving-odd-power-equations", "solving-even-power-equations"],
        },
      ],
    },
    {
      title: t("Two-Variable Equations & Inequalities", "二元方程与不等式"),
      modules: [
        {
          title: t("Graphs of Linear Equations", "直线图像"),
          topics: [
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
            "point-slope-form",
            "standard-form",
            "properties-of-lines-in-standard-form",
            "parallel-lines-in-the-coordinate-plane",
            "perpendicular-lines-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Modeling With Two-Variable Linear Equations", "用二元一次方程建模"),
          topics: [
            "modeling-with-two-variable-linear-equations",
            "modeling-totals-with-two-variable-equations",
            "analyzing-graphs-of-linear-models",
            "further-modeling-with-two-variable-equations",
            "distance-time-graphs",
            "speed-time-graphs",
            "distance-from-speed-time-graphs",
          ],
        },
        {
          title: t("Systems of Equations", "方程组"),
          topics: [
            "systems-of-linear-equations",
            "introduction-to-elimination",
            "elimination-with-one-transformation",
            "elimination-with-two-transformations",
            "systems-with-fractional-coefficients",
            "systems-with-decimal-coefficients",
            "systems-with-no-solution-or-infinitely-many-solutions",
            "consistency-and-dependency",
            "intersection-of-two-lines",
            "modeling-with-systems",
            "coin-problems",
            "approximating-solutions-to-systems-of-linear-equations",
            "solving-systems-of-nonlinear-equations",
            "finding-intersections-of-lines-and-quadratic-functions",
            "solving-systems-of-nonlinear-equations-using-graphs",
            "approximating-solutions-to-systems-of-nonlinear-equations",
          ],
        },
        {
          title: t("Two-Variable Linear Inequalities", "二元一次不等式"),
          topics: [
            "graphing-strict-linear-inequalities",
            "graphing-non-strict-linear-inequalities",
            "further-graphing-linear-inequalities",
            "systems-of-linear-inequalities",
            "modeling-with-two-variable-inequalities",
            "modeling-with-systems-of-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Units", "单位"),
      modules: [
        {
          title: t("Working With Units", "单位的运用"),
          topics: [
            "metric-units-of-mass",
            "metric-units-of-length",
            "two-step-unit-conversions",
            "unit-conversions-using-base-units-of-mass",
            "unit-conversions-using-base-units-of-length",
            "unit-conversions-using-units-of-time",
            "units-of-time",
            "mixed-units",
            "converting-units-of-area",
            "converting-units-of-area-to-larger-units",
            "units-in-formulas",
            "units-of-rates-of-change",
            "degrees-of-accuracy",
          ],
        },
        {
          title: t("Direct and Inverse Variation", "正比例与反比例"),
          topics: ["modeling-with-direct-variation", "inverse-variation", "modeling-with-inverse-variation"],
        },
      ],
    },
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Polynomial Essentials", "多项式基础"),
          topics: [
            "introduction-to-polynomials",
            "degree-of-a-polynomial",
            "simplifying-polynomials",
            "distributive-law-for-polynomials",
            "adding-and-subtracting-polynomials",
            "monomials-binomials-and-trinomials",
            "multiplying-binomials",
            "multiplying-polynomials",
            "squaring-binomials",
            "expanding-binomials-using-pascals-triangle",
            "difference-of-squares-formula",
          ],
        },
        {
          title: t("Factoring Polynomials", "多项式因式分解"),
          topics: [
            "greatest-common-factor-of-monomials",
            "factoring-polynomials-using-gcfs",
            "factoring-perfect-square-trinomials",
            "factoring-perfect-square-trinomials-with-leading-coefficients",
            "factoring-differences-of-squares",
            "factoring-trinomials",
            "factoring-trinomials-using-common-factors",
            "factoring-trinomials-with-leading-coefficients",
            "further-factoring-trinomials-with-leading-coefficients",
          ],
        },
      ],
    },
    {
      title: t("Rationals & Radicals", "分式与根式"),
      modules: [
        {
          title: t("Rational Expressions", "分式"),
          topics: [
            "equivalent-expressions-with-fractions",
            "simplifying-rational-expressions",
            "simplifying-rational-expressions-by-factoring",
            "splitting-rational-expressions-into-terms",
          ],
        },
        {
          title: t("Rational Equations", "分式方程"),
          topics: [
            "rational-equations-with-one-fractional-term",
            "rational-equations-using-cross-multiplication",
            "rational-equations-containing-binomials",
            "rational-equations-using-the-flip-method",
          ],
        },
        {
          title: t("Radical Expressions", "根式"),
          topics: [
            "square-roots-of-algebraic-perfect-squares",
            "cube-roots-of-algebraic-perfect-cubes",
            "writing-radicals-using-fractional-exponents",
            "square-roots-with-domain-restrictions",
            "simplifying-square-roots-with-variables",
            "multiplying-radical-expressions",
            "quotient-rule-for-square-roots",
            "evaluating-radical-expressions",
            "adding-and-subtracting-radical-expressions",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Function Essentials", "函数基础"),
          topics: [
            "introduction-to-functions",
            "representations-of-functions",
            "graphs-of-functions",
            "domain-of-a-function",
            "vertical-line-test",
            "global-extrema",
            "end-behavior",
            "range-of-a-function",
            "range-advanced-cases",
            "roots-of-a-function",
            "increasing-and-decreasing",
            "piecewise-functions",
            "modeling-with-linear-functions",
            "constructing-linear-functions",
          ],
        },
      ],
    },
    {
      title: t("Absolute Value", "绝对值"),
      modules: [
        {
          title: t("Absolute Value Expressions, Equations & Inequalities", "绝对值表达式、方程与不等式"),
          topics: [
            "absolute-value-expressions",
            "rules-of-absolute-value",
            "further-rules-of-absolute-value",
            "absolute-value-equations",
            "further-absolute-value-equations",
            "absolute-value-inequalities",
          ],
        },
        {
          title: t("Absolute Value Functions", "绝对值函数"),
          topics: [
            "absolute-value-graphs",
            "vertical-reflections-of-absolute-value-graphs",
            "stretches-of-absolute-value-graphs",
            "combining-transformations-of-absolute-value-graphs",
            "domain-and-range-of-absolute-value-functions",
            "roots-of-absolute-value-functions",
            "equations-connecting-absolute-value-and-linear-functions",
            "absolute-value-equations-with-extraneous-solutions",
          ],
        },
      ],
    },
    {
      title: t("Exponents", "指数"),
      modules: [
        {
          title: t("The Rules of Exponents", "指数法则"),
          topics: [
            "product-rule-with-algebraic-expressions",
            "quotient-rule-with-algebraic-expressions",
            "power-rule-with-algebraic-expressions",
            "power-of-product-rule-with-algebraic-expressions",
            "power-of-quotient-rule-with-algebraic-expressions",
            "combining-rules-of-exponents-with-algebraic-expressions",
          ],
        },
        {
          title: t("Exponential Expressions, Equations, and Functions", "指数表达式、方程与函数"),
          topics: [
            "solving-exponential-equations",
            "solving-exponential-equations-with-fractional-solutions",
            "creating-exponential-growth-expressions",
            "creating-exponential-decay-expressions",
            "exponential-functions",
            "modeling-exponential-growth-with-functions",
            "interpreting-exponential-growth",
            "solving-exponential-growth-problems",
            "modeling-exponential-decay-with-functions",
            "interpreting-exponential-decay",
            "solving-exponential-decay-problems",
            "linear-vs-exponential-growth-and-decay",
            "linear-vs-exponential-models",
            "graphing-exponential-growth-functions",
            "graphing-exponential-decay-functions",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Geometric Transformations", "几何变换"),
          topics: [
            "translations-of-geometric-figures",
            "rotations-of-geometric-figures",
            "rotation-rules-in-the-coordinate-plane",
            "reflections-in-the-coordinate-plane",
            "reflections-across-arbitrary-lines",
            "dilations-of-geometric-figures",
            "dilations-of-figures-in-the-coordinate-plane",
            "stretches-of-geometric-figures",
            "combining-stretches-of-geometric-figures",
            "combining-geometric-transformations",
            "reflective-symmetry",
            "rotational-symmetry",
          ],
        },
        {
          title: t("Triangles", "三角形"),
          topics: [
            "the-pythagorean-theorem",
            "isosceles-right-triangles",
            "thirty-sixty-ninety-triangles",
            "area-of-isosceles-right-triangles",
            "area-of-thirty-sixty-ninety-triangles",
            "area-of-equilateral-triangles",
            "diagonals-of-squares",
            "the-exterior-angle-theorem",
            "medians-and-centroids",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "circles",
            "arcs-segments-and-sectors-of-circles",
            "the-circumference-of-a-circle",
            "areas-of-circles",
            "central-angles-and-arcs",
            "calculating-arc-lengths-of-circular-sectors",
            "calculating-areas-of-circular-sectors",
            "further-calculating-areas-of-sectors",
            "problem-solving-with-circles",
            "circles-inscribed-in-squares",
            "squares-inscribed-in-circles",
          ],
        },
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "finding-equations-of-parallel-lines",
            "finding-equations-of-perpendicular-lines",
            "midpoints-in-the-coordinate-plane",
            "partitioning-line-segments",
            "the-distance-formula",
            "the-shortest-distance-between-a-point-and-a-line",
            "calculating-perimeters-in-the-plane",
            "calculating-areas-of-rectangles-in-the-plane",
            "calculating-areas-of-triangles-and-quadrilaterals-in-the-plane",
          ],
        },
      ],
    },
  ],
};

/** integratedMathII is the high-school integrated mathematics course. */
export const integratedMathII: CourseDef = {
  id: "integrated-math-ii",
  title: t("Integrated Math II", "综合数学二"),
  description: t(
    "Quadratic equations, quadratic functions, parabolas and quadratic modeling; function features, compositions, inverses, and graph transformations; sequences; graphs of exponential functions, introduction to logarithms and the laws of logarithms; proofs, congruence, and similarity criteria; circles, circular sectors, and circle theorems; solid geometry of prisms, pyramids, cylinders, cones, and spheres; right-triangle trigonometry, radians, the unit circle, and special trigonometric ratios; and introductory probability, compound events, and bivariate correlation.",
    "一元二次方程、二次函数、抛物线与二次建模；函数性质、复合、反函数与图像变换；数列入门；指数函数图像、对数概念与对数运算法则；几何证明、全等与相似判定；圆、扇形与圆的几何定理；柱体、锥体、球等立体几何；直角三角形中的三角比、弧度制、单位圆与特殊角三角比；以及概率基础、复合事件与双变量相关性。",
  ),
  units: [
    {
      title: t("Quadratics", "二次式与二次方程"),
      modules: [
        {
          title: t("Quadratic Equations", "一元二次方程"),
          topics: [
            "introduction-to-quadratic-equations",
            "solving-perfect-square-quadratic-equations",
            "perfect-square-quadratic-equations-with-one-or-no-solutions",
            "zero-product-rule",
            "solving-quadratic-equations-using-a-difference-of-squares",
            "solving-quadratic-equations-with-no-constant-term",
            "solving-quadratic-equations-by-factoring",
            "solving-quadratic-equations-with-leading-coefficients-by-factoring",
            "completing-the-square",
            "completing-the-square-with-odd-linear-terms",
            "completing-the-square-with-leading-coefficients",
            "solving-quadratic-equations-by-completing-the-square",
            "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
            "the-quadratic-formula",
            "the-discriminant-of-a-quadratic-equation",
            "quadratic-equations-with-one-real-solution",
            "modeling-with-quadratic-equations",
            "solving-radical-equations",
            "equating-polynomial-coefficients",
            "vietas-formulas",
          ],
        },
        {
          title: t("Quadratic Functions", "二次函数"),
          topics: [
            "graphing-elementary-quadratic-functions",
            "vertical-reflections-of-quadratic-functions",
            "graphs-of-general-quadratic-functions",
            "roots-of-quadratic-functions",
            "the-discriminant-of-a-quadratic-function",
            "the-axis-of-symmetry-of-a-parabola",
            "the-average-of-the-roots-formula",
            "the-vertex-form-of-a-parabola",
            "writing-the-equation-of-a-parabola-in-vertex-form",
            "domain-and-range-of-quadratic-functions",
            "solving-systems-of-nonlinear-equations",
            "finding-intersections-of-lines-and-quadratic-functions",
          ],
        },
      ],
    },
    {
      title: t("Functions & Sequences", "函数与数列"),
      modules: [
        {
          title: t("Functions", "函数"),
          topics: [
            "arithmetic-of-functions",
            "function-composition",
            "describing-function-composition",
            "local-extrema",
            "one-to-one-functions",
            "introduction-to-inverse-functions",
            "graphs-of-inverse-functions",
            "domain-and-range-of-inverse-functions",
            "invertible-functions",
            "calculating-the-inverse-of-a-function",
            "inverses-of-quadratic-functions",
            "plotting-x-as-a-function-of-y",
            "periodic-functions",
            "even-and-odd-functions",
            "unbounded-behavior-of-functions-near-a-point",
            "the-average-rate-of-change-of-a-function",
          ],
        },
        {
          title: t("Modeling With Quadratic Functions", "用二次函数建模"),
          topics: [
            "modeling-downwards-vertical-motion",
            "modeling-upwards-vertical-motion",
            "vertical-motion",
            "revenue-cost-and-profit-functions",
            "constructing-revenue-cost-and-profit-functions",
            "maximizing-profit-and-break-even-points",
          ],
        },
        {
          title: t("Graph Transformations of Functions", "函数的图像变换"),
          topics: [
            "vertical-translations-of-functions",
            "horizontal-translations-of-functions",
            "vertical-stretches-of-functions",
            "horizontal-stretches-of-functions",
            "vertical-reflections-of-functions",
            "horizontal-reflections-of-functions",
            "combining-graph-transformations-two-operations",
            "combining-graph-transformations-three-or-more-operations",
            "constructing-functions-using-transformations",
            "combining-reflections-with-other-graph-transformations",
            "finding-points-on-transformed-curves",
            "the-domain-and-range-of-transformed-functions",
            "absolute-value-graph-transformations",
          ],
        },
        {
          title: t("Sequences", "数列"),
          topics: ["introduction-to-sequences", "recursive-sequences", "fibonacci-sequences"],
        },
      ],
    },
    {
      title: t("Exponentials & Logarithms", "指数与对数"),
      modules: [
        {
          title: t("Graphs of Exponential Functions", "指数函数图像"),
          topics: [
            "vertical-translations-of-exponential-growth-functions",
            "vertical-translations-of-exponential-decay-functions",
            "interpreting-graphs-of-exponential-functions",
            "vertical-reflections-of-exponential-functions",
            "combining-graph-transformations-of-exponential-functions",
            "properties-of-transformed-exponential-functions",
          ],
        },
        {
          title: t("Introduction to Logarithms", "对数入门"),
          topics: [
            "converting-between-exponential-and-logarithmic-form",
            "evaluating-logarithms",
            "natural-logarithm",
            "common-logarithm",
            "simplifying-logarithmic-expressions",
          ],
        },
        {
          title: t("The Laws of Logarithms", "对数运算法则"),
          topics: [
            "product-rule-for-logarithms",
            "quotient-rule-for-logarithms",
            "power-rule-for-logarithms",
            "combining-laws-of-logarithms",
            "change-of-base-formula",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Proof", "证明"),
          topics: [
            "identifying-angle-postulates",
            "identifying-angle-theorems",
            "proving-alternate-angle-theorems",
            "proving-alternate-angle-converses",
            "proving-consecutive-angle-theorems",
            "proving-consecutive-angle-converse",
            "proving-perpendicular-line-theorems",
            "further-proving-perpendicular-line-theorems",
            "proving-triangle-theorems",
          ],
        },
        {
          title: t("Congruence", "全等"),
          topics: [
            "the-asa-congruence-criterion",
            "the-aas-congruence-criterion",
            "the-sas-congruence-criterion",
            "the-sss-congruence-criterion",
            "the-hl-congruence-criterion",
            "combining-congruence-criteria-for-triangles",
            "rigid-motions-and-congruence",
            "properties-of-congruence",
            "proving-congruence-statements",
          ],
        },
        {
          title: t("Similarity", "相似"),
          topics: [
            "similarity-and-similar-polygons",
            "side-lengths-and-angle-measures-of-similar-polygons",
            "areas-of-similar-polygons",
            "working-with-areas-of-similar-polygons",
            "similarity-transformations",
            "the-aa-similarity-criterion",
            "the-sss-similarity-criterion",
            "the-sas-similarity-criterion",
            "combining-similarity-criteria-for-triangles",
            "proving-similarity-statements",
            "the-midpoint-theorem",
            "the-triangle-proportionality-theorem",
            "proving-the-midpoint-theorem",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "inscribed-angles",
            "problem-solving-with-inscribed-angles",
            "thales-theorem",
            "angles-in-inscribed-right-triangles",
            "further-angles-in-inscribed-right-triangles",
            "inscribed-quadrilaterals",
            "tangent-lines-to-circles",
            "tangent-tangent-lines-to-circles",
            "secant-secant-angles-to-circles",
            "secant-tangent-angles-to-circles",
            "the-tangent-chord-theorem",
            "circle-similarity",
            "proving-circle-similarity",
          ],
        },
        {
          title: t("Introduction to Solid Geometry", "立体几何入门"),
          topics: [
            "identifying-three-dimensional-shapes",
            "faces-vertices-and-edges-of-polyhedrons",
            "nets-of-polyhedrons",
            "finding-surface-areas-using-nets",
            "eulers-formula-for-polyhedra",
            "the-five-platonic-solids",
          ],
        },
        {
          title: t("Rectangular Solids and Pyramids", "长方体与棱锥"),
          topics: [
            "volumes-of-cubes",
            "surface-areas-of-cubes",
            "face-diagonals-of-cubes",
            "diagonals-of-cubes",
            "volumes-of-rectangular-solids",
            "surface-areas-of-rectangular-solids",
            "diagonals-of-rectangular-solids",
            "volumes-of-pyramids",
            "surface-areas-of-pyramids",
            "the-distance-formula-in-three-dimensions",
            "surface-areas-and-volumes-of-similar-solids",
          ],
        },
        {
          title: t("Non-Polyhedrons", "非多面体"),
          topics: [
            "volumes-of-cylinders",
            "surface-areas-of-cylinders",
            "volumes-of-right-cones",
            "slant-heights-of-right-cones",
            "surface-areas-of-right-cones",
            "volumes-of-spheres",
            "surface-areas-of-spheres",
            "conical-frustums",
            "volumes-of-revolution",
          ],
        },
      ],
    },
    {
      title: t("Trigonometry", "三角学"),
      modules: [
        {
          title: t("Introduction to Trigonometry", "三角学入门"),
          topics: [
            "angles-and-sides-in-right-triangles",
            "the-trigonometric-ratios",
            "calculating-trigonometric-ratios-using-the-pythagorean-theorem",
            "calculating-side-lengths-of-right-triangles-using-trigonometry",
            "calculating-angles-in-right-triangles-using-trigonometry",
            "modeling-with-trigonometry",
            "the-reciprocal-trigonometric-ratios",
            "trigonometric-ratios-in-similar-right-triangles",
            "trigonometric-functions-of-complementary-angles",
            "special-trigonometric-ratios",
            "calculating-areas-of-right-triangles-using-trigonometry",
            "solving-multiple-right-triangles-using-trigonometry",
          ],
        },
        {
          title: t("Radians", "弧度制"),
          topics: [
            "introduction-to-radians",
            "calculating-arc-length-using-radians",
            "calculating-areas-of-sectors-using-radians",
            "trigonometric-ratios-with-radians",
          ],
        },
        {
          title: t("The Unit Circle", "单位圆"),
          topics: [
            "angles-in-the-coordinate-plane",
            "negative-angles-in-the-coordinate-plane",
            "coterminal-angles",
            "calculating-reference-angles",
            "properties-of-the-unit-circle-in-the-first-quadrant",
            "extending-the-trigonometric-ratios-using-the-unit-circle",
            "extending-the-trigonometric-ratios-using-angles-in-radians",
            "extending-the-trigonometric-ratios-to-negative-angles",
            "extending-the-trigonometric-ratios-to-large-angles",
            "using-the-pythagorean-identity-in-the-first-quadrant",
            "extending-the-pythagorean-identity-to-all-quadrants",
          ],
        },
        {
          title: t("Special Trigonometric Ratios", "特殊角的三角比"),
          topics: [
            "finding-trigonometric-ratios-of-quadrantal-angles",
            "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range",
            "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
            "evaluating-trigonometric-expressions",
            "further-extensions-of-the-special-trigonometric-ratios",
          ],
        },
      ],
    },
    {
      title: t("Probability & Statistics", "概率与统计"),
      modules: [
        {
          title: t("Introduction to Probability", "概率入门"),
          topics: [
            "sets",
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "the-complement-of-an-event",
            "venn-diagrams-in-probability",
            "geometric-probability",
          ],
        },
        {
          title: t("Compound Events in Probability", "概率中的复合事件"),
          topics: [
            "the-union-of-sets",
            "the-intersection-of-sets",
            "compound-events-in-probability-from-experimental-data",
            "computing-probabilities-for-compound-events-using-venn-diagrams",
            "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
            "computing-probabilities-for-three-events-using-venn-diagrams",
          ],
        },
        {
          title: t("Correlation", "相关性"),
          topics: [
            "scatter-plots",
            "trend-lines",
            "predictions-with-trend-lines",
            "residuals-and-residual-plots",
            "interpreting-trend-line-coefficients",
            "linear-correlation",
            "selecting-a-regression-model",
            "correlation-and-causation",
          ],
        },
      ],
    },
  ],
};

/** integratedMathIII is the high-school integrated mathematics course. */
export const integratedMathIII: CourseDef = {
  id: "integrated-math-iii",
  title: t("Integrated Math III", "综合数学三"),
  description: t(
    "Advanced polynomial operations, division, theorems, factoring, and graphs; rational and radical expressions and equations, reciprocal and radical functions; exponential and logarithmic equations and models; real and complex numbers; arithmetic and geometric sequences and series; proofs of circle theorems, secants, tangents, and coordinate parabolas; general triangle trigonometry with the Laws of Sines and Cosines, trigonometric functions, and their transformations; and conditional probability, combinatorics, and data analysis.",
    "进阶多项式运算、除法、定理、因式分解与图像；分式与根式及方程、倒数函数与根式函数；指数与对数方程及模型；实数与复数系；等差与等比数列；圆的定理证明、割线、切线与抛物线的坐标几何；正弦定理与余弦定理、三角函数及其图像变换；以及条件概率、组合与数据分析。",
  ),
  units: [
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Factoring Polynomials", "多项式因式分解"),
          topics: [
            "further-factoring-of-polynomials-using-gcfs",
            "factoring-higher-order-polynomials-as-a-difference-of-squares",
            "factoring-cubic-expressions-by-grouping",
            "factoring-sums-and-differences-of-cubes",
            "factoring-biquadratic-expressions",
          ],
        },
        {
          title: t("Polynomial Equations", "多项式方程"),
          topics: [
            "determining-the-roots-of-polynomials",
            "solving-polynomial-equations-using-the-gcf",
            "solving-cubic-equations-by-grouping",
            "solving-biquadratic-equations",
          ],
        },
        {
          title: t("Dividing Polynomials", "多项式除法"),
          topics: [
            "dividing-polynomials-using-synthetic-division",
            "dividing-polynomials-by-linear-binomials-using-long-division",
            "dividing-polynomials-using-long-division",
            "dividing-polynomials-by-manipulating-rational-expressions",
          ],
        },
        {
          title: t("Polynomial Theorems", "多项式定理"),
          topics: [
            "the-factor-theorem",
            "determining-polynomial-coefficients-using-the-factor-theorem",
            "factoring-cubic-polynomials-using-the-factor-theorem",
            "factoring-quartic-polynomials-using-the-factor-theorem",
            "multiplicities-of-the-roots-of-polynomials",
            "finding-multiplicities-of-the-roots-of-quartic-polynomials-by-factoring",
            "the-remainder-theorem",
            "the-rational-roots-theorem",
          ],
        },
        {
          title: t("Graphs of Polynomials", "多项式图像"),
          topics: [
            "end-behavior",
            "graphing-elementary-cubic-functions",
            "graphing-cubic-curves-containing-three-distinct-real-roots",
            "graphing-cubic-curves-containing-a-double-root",
            "graphing-cubic-curves-containing-one-distinct-real-root",
            "end-behavior-of-polynomials",
            "graphing-general-polynomials",
          ],
        },
        {
          title: t("Properties of Polynomials", "多项式的性质"),
          topics: [
            "the-least-common-multiple-of-two-monomials",
            "the-least-common-multiple-of-two-polynomials",
            "describing-relationships-using-polynomial-identities",
          ],
        },
      ],
    },
    {
      title: t("Rationals and Radicals", "分式与根式"),
      modules: [
        {
          title: t("Rational Expressions", "分式"),
          topics: [
            "simplifying-rational-expressions-using-polynomial-factorization",
            "adding-and-subtracting-rational-expressions",
            "adding-rational-expressions-with-unlike-denominators",
            "multiplying-rational-expressions",
            "dividing-rational-expressions",
          ],
        },
        {
          title: t("Reciprocal Functions", "倒数函数"),
          topics: [
            "graphing-reciprocal-functions",
            "graph-transformations-of-reciprocal-functions",
            "combining-graph-transformations-of-reciprocal-functions",
            "domain-and-range-of-transformed-reciprocal-functions",
            "inverses-of-reciprocal-functions",
            "finding-intersections-of-lines-and-reciprocal-functions",
          ],
        },
        {
          title: t("Radical Expressions", "根式"),
          topics: [
            "simplifying-square-root-expressions-using-polynomial-factorization",
            "rationalizing-algebraic-denominators",
            "rationalizing-two-term-denominators",
            "further-rationalizing-denominators",
          ],
        },
        {
          title: t("Radical Functions", "根式函数"),
          topics: [
            "graphing-the-square-root-function",
            "graph-transformations-of-square-root-functions",
            "graphing-the-cube-root-function",
            "properties-of-transformed-square-root-functions",
            "the-domain-of-a-transformed-radical-function",
            "the-range-of-a-transformed-radical-function",
            "solving-advanced-radical-equations",
            "roots-of-transformed-radical-functions",
            "inverses-of-radical-functions",
            "finding-intersections-of-lines-and-radical-functions",
          ],
        },
      ],
    },
    {
      title: t("Exponentials & Logarithms", "指数与对数"),
      modules: [
        {
          title: t("Exponential Equations", "指数方程"),
          topics: [
            "solving-exponential-equations-using-logarithms",
            "solving-equations-containing-the-exponential-function",
            "solving-exponential-equations",
            "solving-exponential-equations-with-different-bases-using-logarithms",
            "solving-exponential-equations-using-the-zero-product-property",
          ],
        },
        {
          title: t("Logarithmic Equations", "对数方程"),
          topics: [
            "solving-logarithmic-equations",
            "solving-logarithmic-equations-containing-the-natural-logarithm",
            "solving-logarithmic-equations-using-the-laws-of-logarithms",
            "solving-logarithmic-equations-by-combining-the-laws-of-logarithms",
            "solving-logarithmic-equations-with-logarithms-on-both-sides",
            "solving-logarithmic-equations-using-the-zero-product-property",
          ],
        },
        {
          title: t("Graphs of Logarithmic Functions", "对数函数图像"),
          topics: [
            "graphing-logarithmic-functions",
            "combining-graph-transformations-of-logarithmic-functions",
            "properties-of-transformed-logarithmic-functions",
            "inverses-of-exponential-and-logarithmic-functions",
          ],
        },
        {
          title: t("Modeling with Exponential Functions", "用指数函数建模"),
          topics: ["modeling-with-compound-interest", "continuously-compounded-interest", "converting-between-exponents"],
        },
      ],
    },
    {
      title: t("Number Systems", "数系"),
      modules: [
        {
          title: t("Real Numbers", "实数"),
          topics: [
            "the-real-number-system",
            "writing-repeating-decimals-as-fractions",
            "sums-and-products-of-rational-and-irrational-numbers",
          ],
        },
        {
          title: t("Complex Numbers", "复数"),
          topics: [
            "imaginary-numbers",
            "quadratic-equations-with-purely-imaginary-solutions",
            "complex-numbers",
            "adding-and-subtracting-complex-numbers",
            "multiplying-complex-numbers",
            "solving-quadratic-equations-with-complex-roots",
            "cyclic-property-of-the-imaginary-unit",
          ],
        },
      ],
    },
    {
      title: t("Sequences", "数列"),
      modules: [
        {
          title: t("Arithmetic Sequences", "等差数列"),
          topics: [
            "arithmetic-sequences",
            "recursive-formulas-for-arithmetic-sequences",
            "nth-term-of-an-arithmetic-sequence",
            "explicit-and-recursive-arithmetic-formulas",
            "finding-the-common-difference-of-an-arithmetic-sequence",
            "arithmetic-sequences-from-two-terms",
            "index-of-a-term-in-an-arithmetic-sequence",
            "solving-for-variables-in-arithmetic-sequences",
            "modeling-with-arithmetic-sequences",
          ],
        },
        {
          title: t("Geometric Sequences", "等比数列"),
          topics: [
            "geometric-sequences",
            "nth-term-of-a-geometric-sequence",
            "recursive-formulas-for-geometric-sequences",
            "geometric-sequences-from-two-terms",
            "index-of-a-term-in-a-geometric-sequence",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Proof", "证明"),
          topics: [
            "proofs-involving-isosceles-triangles",
            "proofs-involving-medians-and-centroids",
            "properties-of-parallelograms",
            "proving-properties-of-parallelograms",
            "proving-criteria-for-parallelograms-and-rectangles",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "circles-in-the-coordinate-plane",
            "equations-of-circles-centered-at-the-origin",
            "equations-of-circles",
            "determining-circle-properties-by-completing-the-square",
            "calculating-circle-intercepts",
            "intersections-of-circles-with-lines",
            "equations-of-tangent-lines-to-circles",
            "perpendicular-bisectors-of-diameters-in-the-coordinate-plane",
            "perpendicular-bisectors-of-chords",
            "perpendicular-bisectors-of-chords-in-the-coordinate-plane",
            "thales-theorem-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Parabolas", "抛物线"),
          topics: [
            "upward-and-downward-opening-parabolas",
            "left-and-right-opening-parabolas",
            "the-vertex-of-a-parabola",
            "calculating-the-vertex-of-a-parabola-by-completing-the-square",
            "the-focus-directrix-property-of-a-parabola",
            "calculating-the-focus-of-a-parabola",
            "calculating-the-directrix-of-a-parabola",
            "calculating-intercepts-of-parabolas",
            "intersections-of-parabolas-with-lines",
          ],
        },
      ],
    },
    {
      title: t("Trigonometry", "三角学"),
      modules: [
        {
          title: t("Trigonometry with General Triangles", "任意三角形的三角学"),
          topics: [
            "the-law-of-sines",
            "the-law-of-cosines",
            "the-area-of-a-general-triangle",
            "modeling-using-the-law-of-sines",
            "modeling-using-the-law-of-cosines",
          ],
        },
        {
          title: t("Trigonometric Functions", "三角函数"),
          topics: [
            "graphing-sine-and-cosine",
            "graphing-tangent-and-cotangent",
            "graphing-secant-and-cosecant",
            "describing-properties-of-the-sine-function",
            "describing-properties-of-the-cosine-function",
            "describing-properties-of-the-tangent-function",
            "describing-properties-of-the-secant-function",
            "describing-properties-of-the-cosecant-function",
            "describing-properties-of-the-cotangent-function",
            "products-of-even-and-odd-functions",
          ],
        },
        {
          title: t("Graph Transformations of Trigonometric Functions", "三角函数的图像变换"),
          topics: [
            "vertical-translations-of-trigonometric-functions",
            "vertical-stretches-of-trigonometric-functions",
            "horizontal-translations-of-trigonometric-functions",
            "horizontal-stretches-of-trigonometric-functions",
            "combining-graph-transformations-of-sine-and-cosine",
            "graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-secant-and-cosecant",
            "graphing-reflections-of-trigonometric-functions",
            "graphing-reflections-of-trigonometric-functions-three-or-more-transformations",
          ],
        },
        {
          title: t("Properties of Transformed Trigonometric Functions", "变换后三角函数的性质"),
          topics: [
            "properties-of-transformed-sine-and-cosine-functions",
            "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions",
            "properties-of-transformed-tangent-and-cotangent-functions",
            "properties-of-transformed-secant-and-cosecant-functions",
            "interpreting-trigonometric-models",
            "modeling-with-trigonometric-functions",
          ],
        },
      ],
    },
    {
      title: t("Probability & Statistics", "概率与统计"),
      modules: [
        {
          title: t("Conditional Probability", "条件概率"),
          topics: [
            "conditional-probabilities-from-venn-diagrams",
            "conditional-probabilities-from-tables",
            "the-multiplication-law-for-conditional-probability",
            "the-law-of-total-probability",
            "tree-diagrams-for-dependent-events",
            "tree-diagrams-for-dependent-events-applications",
            "independent-events",
            "tree-diagrams-for-independent-events",
            "the-addition-law-of-probability",
            "applying-the-addition-law-with-event-complements",
            "mutually-exclusive-events",
          ],
        },
        {
          title: t("Combinatorics", "组合"),
          topics: [
            "the-rules-of-sum-and-product",
            "factorials",
            "factorials-in-variable-expressions",
            "ordering-objects",
            "permutations",
            "combinations",
            "computing-probabilities-using-combinatorics",
          ],
        },
        {
          title: t("Analyzing Data", "数据分析"),
          topics: ["sampling", "sigma-notation", "mean-of-a-data-set", "variance-and-standard-deviation"],
        },
      ],
    },
  ],
};

/** integratedMathIHonors is the high-school integrated mathematics honors course. */
export const integratedMathIHonors: CourseDef = {
  id: "integrated-math-i-honors",
  title: t("Integrated Math I (Honors)", "综合数学一（荣誉）"),
  description: t(
    "Linear equations and inequalities, linear modeling, systems of equations and two-variable inequalities; units and variation; polynomials, operations and factoring; rational and radical expressions and equations; function concepts, domain, range, and behavior; absolute value equations, inequalities, and graphs; exponent rules, exponential equations, and exponential growth and decay; arithmetic sequences; geometric transformations in the coordinate plane, right triangles and the Pythagorean theorem, congruence, circles, arcs and sectors, and coordinate geometry; and univariate statistics.",
    "一元一次方程与不等式、线性建模、方程组与二元一次不等式；单位换算与比例关系；多项式运算与因式分解；分式与根式及方程；函数概念、定义域、值域与性质；绝对值方程、不等式与图像；指数法则、指数方程与指数增长和衰减；等差数列；坐标平面上的几何变换、直角三角形与勾股定理、全等、圆与扇形及坐标几何；以及单变量统计。",
  ),
  units: [
    {
      title: t("Equations & Inequalities", "方程与不等式"),
      modules: [
        {
          title: t("Linear Equations", "一次方程"),
          topics: [
            "linear-equations-with-unknown-coefficients",
            "unknown-coefficients-by-factoring",
            "linear-inequalities-with-parameters",
            "many-variable-equations",
          ],
        },
        {
          title: t("Modeling With Linear Equations", "用一次方程建模"),
          topics: [
            "interpreting-linear-expressions",
            "modeling-with-linear-equations",
            "consecutive-integer-problems",
            "speed-distance-time",
            "further-speed-distance-time",
            "work-problems",
            "mixture-problems",
          ],
        },
        {
          title: t("Linear Inequalities", "一次不等式"),
          topics: [
            "solving-compound-inequalities",
            "interval-notation",
            "unbounded-intervals",
            "unions-of-intervals",
            "intersections-of-intervals",
            "compound-or-inequalities",
            "compound-and-inequalities",
            "introduction-to-modeling-with-inequalities",
            "modeling-with-one-step-inequalities",
            "modeling-with-two-step-inequalities",
            "modeling-with-compound-inequalities",
          ],
        },
        {
          title: t("Nonlinear Equations", "非线性方程"),
          topics: ["solving-equations-with-square-roots", "solving-odd-power-equations", "solving-even-power-equations"],
        },
      ],
    },
    {
      title: t("Two-Variable Equations & Inequalities", "二元方程与不等式"),
      modules: [
        {
          title: t("Graphs of Linear Equations", "直线图像"),
          topics: [
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
            "point-slope-form",
            "standard-form",
            "properties-of-lines-in-standard-form",
            "parallel-lines-in-the-coordinate-plane",
            "perpendicular-lines-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Modeling With Two-Variable Linear Equations", "用二元一次方程建模"),
          topics: [
            "modeling-with-two-variable-linear-equations",
            "modeling-totals-with-two-variable-equations",
            "analyzing-graphs-of-linear-models",
            "further-modeling-with-two-variable-equations",
            "distance-time-graphs",
            "speed-time-graphs",
            "distance-from-speed-time-graphs",
          ],
        },
        {
          title: t("Systems of Equations", "方程组"),
          topics: [
            "systems-of-linear-equations",
            "introduction-to-elimination",
            "elimination-with-one-transformation",
            "elimination-with-two-transformations",
            "systems-with-fractional-coefficients",
            "systems-with-decimal-coefficients",
            "systems-with-no-solution-or-infinitely-many-solutions",
            "consistency-and-dependency",
            "intersection-of-two-lines",
            "modeling-with-systems",
            "coin-problems",
            "approximating-solutions-to-systems-of-linear-equations",
            "solving-systems-of-nonlinear-equations",
            "finding-intersections-of-lines-and-quadratic-functions",
            "solving-systems-of-nonlinear-equations-using-graphs",
            "approximating-solutions-to-systems-of-nonlinear-equations",
          ],
        },
        {
          title: t("Two-Variable Linear Inequalities", "二元一次不等式"),
          topics: [
            "graphing-strict-linear-inequalities",
            "graphing-non-strict-linear-inequalities",
            "further-graphing-linear-inequalities",
            "systems-of-linear-inequalities",
            "modeling-with-two-variable-inequalities",
            "modeling-with-systems-of-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Units", "单位"),
      modules: [
        {
          title: t("Working With Units", "单位的运用"),
          topics: [
            "metric-units-of-mass",
            "metric-units-of-length",
            "two-step-unit-conversions",
            "unit-conversions-using-base-units-of-mass",
            "unit-conversions-using-base-units-of-length",
            "unit-conversions-using-units-of-time",
            "units-of-time",
            "mixed-units",
            "converting-units-of-area",
            "converting-units-of-area-to-larger-units",
            "units-in-formulas",
            "units-of-rates-of-change",
            "degrees-of-accuracy",
          ],
        },
        {
          title: t("Direct and Inverse Variation", "正比例与反比例"),
          topics: ["modeling-with-direct-variation", "inverse-variation", "modeling-with-inverse-variation"],
        },
      ],
    },
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Polynomials", "多项式"),
          topics: [
            "introduction-to-polynomials",
            "degree-of-a-polynomial",
            "simplifying-polynomials",
            "distributive-law-for-polynomials",
            "adding-and-subtracting-polynomials",
            "monomials-binomials-and-trinomials",
            "multiplying-binomials",
            "multiplying-polynomials",
            "squaring-binomials",
            "expanding-binomials-using-pascals-triangle",
            "difference-of-squares-formula",
          ],
        },
        {
          title: t("Factoring Polynomials", "多项式因式分解"),
          topics: [
            "greatest-common-factor-of-monomials",
            "factoring-polynomials-using-gcfs",
            "factoring-perfect-square-trinomials",
            "factoring-perfect-square-trinomials-with-leading-coefficients",
            "factoring-differences-of-squares",
            "factoring-trinomials",
            "factoring-trinomials-using-common-factors",
            "factoring-trinomials-with-leading-coefficients",
            "further-factoring-trinomials-with-leading-coefficients",
          ],
        },
      ],
    },
    {
      title: t("Radicals and Rationals", "根式与分式"),
      modules: [
        {
          title: t("Radical Expressions", "根式"),
          topics: [
            "square-roots-of-algebraic-perfect-squares",
            "cube-roots-of-algebraic-perfect-cubes",
            "writing-radicals-using-fractional-exponents",
            "square-roots-with-domain-restrictions",
            "simplifying-square-roots-with-variables",
            "multiplying-radical-expressions",
            "quotient-rule-for-square-roots",
            "evaluating-radical-expressions",
            "adding-and-subtracting-radical-expressions",
          ],
        },
        {
          title: t("Rational Expressions", "分式"),
          topics: [
            "equivalent-expressions-with-fractions",
            "simplifying-rational-expressions",
            "simplifying-rational-expressions-by-factoring",
            "splitting-rational-expressions-into-terms",
          ],
        },
        {
          title: t("Rational Equations", "分式方程"),
          topics: [
            "rational-equations-with-one-fractional-term",
            "rational-equations-using-cross-multiplication",
            "rational-equations-containing-binomials",
            "rational-equations-using-the-flip-method",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Functions", "函数"),
          topics: [
            "introduction-to-functions",
            "representations-of-functions",
            "graphs-of-functions",
            "domain-of-a-function",
            "vertical-line-test",
            "global-extrema",
            "end-behavior",
            "range-of-a-function",
            "range-advanced-cases",
            "roots-of-a-function",
            "increasing-and-decreasing",
            "piecewise-functions",
            "modeling-with-linear-functions",
            "constructing-linear-functions",
          ],
        },
      ],
    },
    {
      title: t("Absolute Value", "绝对值"),
      modules: [
        {
          title: t("Absolute Value Expressions, Equations & Inequalities", "绝对值表达式、方程与不等式"),
          topics: [
            "absolute-value-expressions",
            "rules-of-absolute-value",
            "further-rules-of-absolute-value",
            "absolute-value-equations",
            "further-absolute-value-equations",
            "absolute-value-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Exponents", "指数"),
      modules: [
        {
          title: t("Rules of Exponents", "指数法则"),
          topics: [
            "product-rule-with-algebraic-expressions",
            "quotient-rule-with-algebraic-expressions",
            "power-rule-with-algebraic-expressions",
            "power-of-product-rule-with-algebraic-expressions",
            "power-of-quotient-rule-with-algebraic-expressions",
            "combining-rules-of-exponents-with-algebraic-expressions",
          ],
        },
        {
          title: t("Exponential Expressions and Equations", "指数式与指数方程"),
          topics: [
            "solving-exponential-equations",
            "solving-exponential-equations-with-fractional-solutions",
            "creating-exponential-growth-expressions",
            "creating-exponential-decay-expressions",
          ],
        },
        {
          title: t("Exponential Functions", "指数函数"),
          topics: [
            "exponential-functions",
            "modeling-exponential-growth-with-functions",
            "interpreting-exponential-growth",
            "solving-exponential-growth-problems",
            "modeling-exponential-decay-with-functions",
            "interpreting-exponential-decay",
            "solving-exponential-decay-problems",
            "linear-vs-exponential-growth-and-decay",
            "linear-vs-exponential-models",
            "graphing-exponential-growth-functions",
            "graphing-exponential-decay-functions",
          ],
        },
      ],
    },
    {
      title: t("Sequences", "数列"),
      modules: [
        {
          title: t("Introduction to Sequences", "数列入门"),
          topics: ["introduction-to-sequences", "recursive-sequences", "fibonacci-sequences"],
        },
        {
          title: t("Arithmetic Sequences", "等差数列"),
          topics: [
            "arithmetic-sequences",
            "recursive-formulas-for-arithmetic-sequences",
            "nth-term-of-an-arithmetic-sequence",
            "explicit-and-recursive-arithmetic-formulas",
            "finding-the-common-difference-of-an-arithmetic-sequence",
            "arithmetic-sequences-from-two-terms",
            "index-of-a-term-in-an-arithmetic-sequence",
            "solving-for-variables-in-arithmetic-sequences",
            "modeling-with-arithmetic-sequences",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Geometric Proofs", "几何证明"),
          topics: [
            "identifying-angle-postulates",
            "identifying-angle-theorems",
            "proving-alternate-angle-theorems",
            "proving-alternate-angle-converses",
            "proving-consecutive-angle-theorems",
            "proving-consecutive-angle-converse",
            "proving-perpendicular-line-theorems",
            "further-proving-perpendicular-line-theorems",
          ],
        },
        {
          title: t("Geometric Transformations", "几何变换"),
          topics: [
            "translations-of-geometric-figures",
            "rotations-of-geometric-figures",
            "rotation-rules-in-the-coordinate-plane",
            "reflections-in-the-coordinate-plane",
            "reflections-across-arbitrary-lines",
            "dilations-of-geometric-figures",
            "dilations-of-figures-in-the-coordinate-plane",
            "stretches-of-geometric-figures",
            "combining-stretches-of-geometric-figures",
            "combining-geometric-transformations",
            "reflective-symmetry",
            "rotational-symmetry",
          ],
        },
        {
          title: t("Triangles", "三角形"),
          topics: [
            "the-pythagorean-theorem",
            "isosceles-right-triangles",
            "thirty-sixty-ninety-triangles",
            "area-of-isosceles-right-triangles",
            "area-of-thirty-sixty-ninety-triangles",
            "area-of-equilateral-triangles",
            "diagonals-of-squares",
            "medians-and-centroids",
            "the-exterior-angle-theorem",
          ],
        },
        {
          title: t("Congruence", "全等"),
          topics: [
            "the-asa-congruence-criterion",
            "the-aas-congruence-criterion",
            "the-sas-congruence-criterion",
            "the-sss-congruence-criterion",
            "the-hl-congruence-criterion",
            "combining-congruence-criteria-for-triangles",
            "rigid-motions-and-congruence",
            "properties-of-congruence",
            "proving-congruence-statements",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "circles",
            "arcs-segments-and-sectors-of-circles",
            "the-circumference-of-a-circle",
            "areas-of-circles",
            "central-angles-and-arcs",
            "calculating-arc-lengths-of-circular-sectors",
            "calculating-areas-of-circular-sectors",
            "further-calculating-areas-of-sectors",
            "problem-solving-with-circles",
            "circles-inscribed-in-squares",
            "squares-inscribed-in-circles",
          ],
        },
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "finding-equations-of-parallel-lines",
            "finding-equations-of-perpendicular-lines",
            "midpoints-in-the-coordinate-plane",
            "partitioning-line-segments",
            "the-distance-formula",
            "the-shortest-distance-between-a-point-and-a-line",
            "calculating-perimeters-in-the-plane",
            "calculating-areas-of-rectangles-in-the-plane",
            "calculating-areas-of-triangles-and-quadrilaterals-in-the-plane",
          ],
        },
      ],
    },
    {
      title: t("Statistics", "统计"),
      modules: [
        {
          title: t("Correlation", "相关性"),
          topics: [
            "scatter-plots",
            "trend-lines",
            "predictions-with-trend-lines",
            "interpreting-trend-line-coefficients",
            "linear-correlation",
            "correlation-and-causation",
          ],
        },
      ],
    },
  ],
};

/** integratedMathIIHonors is the high-school integrated mathematics honors course. */
export const integratedMathIIHonors: CourseDef = {
  id: "integrated-math-ii-honors",
  title: t("Integrated Math II (Honors)", "综合数学二（荣誉）"),
  description: t(
    "Complex numbers; polynomial operations, division, factoring, theorems and quadratic equations; quadratic functions, parabolas and quadratic modeling; absolute value functions; general functions, inverses, and graph transformations; exponential and logarithmic functions, equations, and models; rational and radical expressions and functions; arithmetic and geometric sequences and series; proofs, congruence, polygons, and similarity criteria; solid geometry of prisms, pyramids, cylinders, cones, and spheres; right-triangle trigonometry, radians, the unit circle, and special trigonometric ratios; and probability, compound events, combinatorics, the binomial theorem, and bivariate correlation.",
    "复数；多项式运算、除法、因式分解、基本定理与一元二次方程；二次函数、抛物线与二次建模；绝对值函数；一般函数、反函数与图像变换；指数与对数函数、方程与模型；分式与根式表达式及函数；等差与等比数列及级数；几何证明、全等、多边形与相似判定；柱体、锥体、球等立体几何；直角三角形中的三角比、弧度制、单位圆与特殊角三角比；以及概率、复合事件、组合、二项式定理与双变量相关性。",
  ),
  units: [
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Polynomials", "多项式"),
          topics: [
            "the-least-common-multiple-of-two-monomials",
            "the-least-common-multiple-of-two-polynomials",
            "describing-relationships-using-polynomial-identities",
          ],
        },
        {
          title: t("Quadratic Equations", "一元二次方程"),
          topics: [
            "introduction-to-quadratic-equations",
            "solving-perfect-square-quadratic-equations",
            "perfect-square-quadratic-equations-with-one-or-no-solutions",
            "zero-product-rule",
            "solving-quadratic-equations-using-a-difference-of-squares",
            "solving-quadratic-equations-with-no-constant-term",
            "solving-quadratic-equations-by-factoring",
            "solving-quadratic-equations-with-leading-coefficients-by-factoring",
            "completing-the-square",
            "completing-the-square-with-odd-linear-terms",
            "completing-the-square-with-leading-coefficients",
            "solving-quadratic-equations-by-completing-the-square",
            "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
            "the-quadratic-formula",
            "the-discriminant-of-a-quadratic-equation",
            "quadratic-equations-with-one-real-solution",
            "modeling-with-quadratic-equations",
            "equating-polynomial-coefficients",
            "vietas-formulas",
          ],
        },
        {
          title: t("Factoring Polynomials", "多项式因式分解"),
          topics: [
            "further-factoring-of-polynomials-using-gcfs",
            "factoring-higher-order-polynomials-as-a-difference-of-squares",
            "factoring-cubic-expressions-by-grouping",
            "factoring-sums-and-differences-of-cubes",
            "factoring-biquadratic-expressions",
          ],
        },
        {
          title: t("Polynomial Equations", "多项式方程"),
          topics: [
            "determining-the-roots-of-polynomials",
            "solving-polynomial-equations-using-the-gcf",
            "solving-cubic-equations-by-grouping",
            "solving-biquadratic-equations",
          ],
        },
      ],
    },
    {
      title: t("Number Systems", "数系"),
      modules: [
        {
          title: t("The Number System", "数系"),
          topics: [
            "the-real-number-system",
            "writing-repeating-decimals-as-fractions",
            "sums-and-products-of-rational-and-irrational-numbers",
          ],
        },
        {
          title: t("Introduction to Complex Numbers", "复数入门"),
          topics: [
            "imaginary-numbers",
            "quadratic-equations-with-purely-imaginary-solutions",
            "complex-numbers",
            "adding-and-subtracting-complex-numbers",
            "multiplying-complex-numbers",
            "solving-quadratic-equations-with-complex-roots",
            "cyclic-property-of-the-imaginary-unit",
          ],
        },
      ],
    },
    {
      title: t("Quadratic Functions", "二次函数"),
      modules: [
        {
          title: t("Quadratic Functions", "二次函数"),
          topics: [
            "graphing-elementary-quadratic-functions",
            "vertical-reflections-of-quadratic-functions",
            "graphs-of-general-quadratic-functions",
            "roots-of-quadratic-functions",
            "the-discriminant-of-a-quadratic-function",
            "the-axis-of-symmetry-of-a-parabola",
            "the-average-of-the-roots-formula",
            "the-vertex-form-of-a-parabola",
            "writing-the-equation-of-a-parabola-in-vertex-form",
            "domain-and-range-of-quadratic-functions",
            "solving-systems-of-nonlinear-equations",
            "finding-intersections-of-lines-and-quadratic-functions",
          ],
        },
      ],
    },
    {
      title: t("Absolute Value Functions", "绝对值函数"),
      modules: [
        {
          title: t("Absolute Value Functions", "绝对值函数"),
          topics: [
            "absolute-value-graphs",
            "vertical-reflections-of-absolute-value-graphs",
            "stretches-of-absolute-value-graphs",
            "combining-transformations-of-absolute-value-graphs",
            "domain-and-range-of-absolute-value-functions",
            "roots-of-absolute-value-functions",
            "equations-connecting-absolute-value-and-linear-functions",
            "absolute-value-equations-with-extraneous-solutions",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Functions", "函数"),
          topics: [
            "arithmetic-of-functions",
            "function-composition",
            "describing-function-composition",
            "local-extrema",
            "one-to-one-functions",
            "introduction-to-inverse-functions",
            "graphs-of-inverse-functions",
            "domain-and-range-of-inverse-functions",
            "invertible-functions",
            "calculating-the-inverse-of-a-function",
            "inverses-of-quadratic-functions",
            "plotting-x-as-a-function-of-y",
            "periodic-functions",
            "even-and-odd-functions",
            "products-of-even-and-odd-functions",
            "unbounded-behavior-of-functions-near-a-point",
            "the-average-rate-of-change-of-a-function",
          ],
        },
        {
          title: t("Graph Transformations of Functions", "函数的图像变换"),
          topics: [
            "vertical-translations-of-functions",
            "horizontal-translations-of-functions",
            "vertical-stretches-of-functions",
            "horizontal-stretches-of-functions",
            "vertical-reflections-of-functions",
            "horizontal-reflections-of-functions",
            "combining-graph-transformations-two-operations",
            "combining-graph-transformations-three-or-more-operations",
            "constructing-functions-using-transformations",
            "combining-reflections-with-other-graph-transformations",
            "finding-points-on-transformed-curves",
            "the-domain-and-range-of-transformed-functions",
            "absolute-value-graph-transformations",
          ],
        },
        {
          title: t("Modeling With Quadratic Functions", "用二次函数建模"),
          topics: [
            "modeling-downwards-vertical-motion",
            "modeling-upwards-vertical-motion",
            "vertical-motion",
            "revenue-cost-and-profit-functions",
            "constructing-revenue-cost-and-profit-functions",
            "maximizing-profit-and-break-even-points",
          ],
        },
      ],
    },
    {
      title: t("Exponentials & Logarithms", "指数与对数"),
      modules: [
        {
          title: t("Introduction to Logarithms", "对数入门"),
          topics: [
            "converting-between-exponential-and-logarithmic-form",
            "evaluating-logarithms",
            "natural-logarithm",
            "common-logarithm",
            "simplifying-logarithmic-expressions",
          ],
        },
        {
          title: t("The Laws of Logarithms", "对数运算法则"),
          topics: [
            "product-rule-for-logarithms",
            "quotient-rule-for-logarithms",
            "power-rule-for-logarithms",
            "combining-laws-of-logarithms",
            "change-of-base-formula",
          ],
        },
        {
          title: t("Graphs of Exponential Functions", "指数函数图像"),
          topics: [
            "vertical-translations-of-exponential-growth-functions",
            "vertical-translations-of-exponential-decay-functions",
            "interpreting-graphs-of-exponential-functions",
            "vertical-reflections-of-exponential-functions",
            "combining-graph-transformations-of-exponential-functions",
            "properties-of-transformed-exponential-functions",
          ],
        },
        {
          title: t("Exponential Equations", "指数方程"),
          topics: [
            "solving-exponential-equations-using-logarithms",
            "solving-equations-containing-the-exponential-function",
            "solving-exponential-equations",
            "solving-exponential-equations-with-different-bases-using-logarithms",
            "solving-exponential-equations-using-the-zero-product-property",
          ],
        },
        {
          title: t("Logarithmic Equations", "对数方程"),
          topics: [
            "solving-logarithmic-equations",
            "solving-logarithmic-equations-containing-the-natural-logarithm",
            "solving-logarithmic-equations-using-the-laws-of-logarithms",
            "solving-logarithmic-equations-by-combining-the-laws-of-logarithms",
            "solving-logarithmic-equations-with-logarithms-on-both-sides",
            "solving-logarithmic-equations-using-the-zero-product-property",
          ],
        },
        {
          title: t("Graphs of Logarithmic Functions", "对数函数图像"),
          topics: [
            "graphing-logarithmic-functions",
            "combining-graph-transformations-of-logarithmic-functions",
            "properties-of-transformed-logarithmic-functions",
            "inverses-of-exponential-and-logarithmic-functions",
          ],
        },
        {
          title: t("Modeling with Exponential Functions", "用指数函数建模"),
          topics: ["modeling-with-compound-interest", "continuously-compounded-interest", "converting-between-exponents"],
        },
      ],
    },
    {
      title: t("Rationals & Radicals", "分式与根式"),
      modules: [
        {
          title: t("Rational Expressions", "分式"),
          topics: [
            "simplifying-rational-expressions-using-polynomial-factorization",
            "adding-and-subtracting-rational-expressions",
            "adding-rational-expressions-with-unlike-denominators",
            "multiplying-rational-expressions",
            "dividing-rational-expressions",
          ],
        },
        {
          title: t("Radical Equations", "根式方程"),
          topics: ["solving-radical-equations", "solving-advanced-radical-equations"],
        },
      ],
    },
    {
      title: t("Sequences & Series", "数列与级数"),
      modules: [
        {
          title: t("Geometric Sequences", "等比数列"),
          topics: [
            "geometric-sequences",
            "nth-term-of-a-geometric-sequence",
            "recursive-formulas-for-geometric-sequences",
            "geometric-sequences-from-two-terms",
            "index-of-a-term-in-a-geometric-sequence",
          ],
        },
        {
          title: t("Arithmetic Series", "等差级数"),
          topics: [
            "sigma-notation",
            "properties-of-finite-series",
            "expressing-an-arithmetic-series-in-sigma-notation",
            "finding-the-sum-of-an-arithmetic-series",
            "finding-the-first-term-of-an-arithmetic-series",
            "calculating-the-number-of-terms-in-an-arithmetic-series",
            "modeling-with-arithmetic-series",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Polygons", "多边形"),
          topics: [
            "proving-triangle-theorems",
            "proofs-involving-isosceles-triangles",
            "proofs-involving-medians-and-centroids",
            "diagonals-of-squares",
            "properties-of-parallelograms",
            "proving-properties-of-parallelograms",
            "proving-criteria-for-parallelograms-and-rectangles",
          ],
        },
        {
          title: t("Similarity", "相似"),
          topics: [
            "similarity-and-similar-polygons",
            "side-lengths-and-angle-measures-of-similar-polygons",
            "areas-of-similar-polygons",
            "working-with-areas-of-similar-polygons",
            "similarity-transformations",
            "the-aa-similarity-criterion",
            "the-sss-similarity-criterion",
            "the-sas-similarity-criterion",
            "combining-similarity-criteria-for-triangles",
            "proving-similarity-statements",
            "the-midpoint-theorem",
            "proving-the-midpoint-theorem",
            "the-triangle-proportionality-theorem",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "inscribed-angles",
            "problem-solving-with-inscribed-angles",
            "thales-theorem",
            "angles-in-inscribed-right-triangles",
            "further-angles-in-inscribed-right-triangles",
            "inscribed-quadrilaterals",
            "tangent-lines-to-circles",
            "tangent-tangent-lines-to-circles",
            "secant-secant-angles-to-circles",
            "secant-tangent-angles-to-circles",
            "the-tangent-chord-theorem",
            "circle-similarity",
            "proving-circle-similarity",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "circles-in-the-coordinate-plane",
            "equations-of-circles-centered-at-the-origin",
            "equations-of-circles",
            "determining-circle-properties-by-completing-the-square",
            "calculating-circle-intercepts",
            "intersections-of-circles-with-lines",
            "equations-of-tangent-lines-to-circles",
            "perpendicular-bisectors-of-diameters-in-the-coordinate-plane",
            "perpendicular-bisectors-of-chords",
            "perpendicular-bisectors-of-chords-in-the-coordinate-plane",
            "thales-theorem-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Parabolas", "抛物线"),
          topics: [
            "upward-and-downward-opening-parabolas",
            "left-and-right-opening-parabolas",
            "the-vertex-of-a-parabola",
            "calculating-the-vertex-of-a-parabola-by-completing-the-square",
            "the-focus-directrix-property-of-a-parabola",
            "calculating-the-focus-of-a-parabola",
            "calculating-the-directrix-of-a-parabola",
            "calculating-intercepts-of-parabolas",
            "intersections-of-parabolas-with-lines",
          ],
        },
      ],
    },
    {
      title: t("Solid Geometry", "立体几何"),
      modules: [
        {
          title: t("Introduction to Solid Geometry", "立体几何入门"),
          topics: [
            "identifying-three-dimensional-shapes",
            "faces-vertices-and-edges-of-polyhedrons",
            "nets-of-polyhedrons",
            "finding-surface-areas-using-nets",
            "eulers-formula-for-polyhedra",
            "the-five-platonic-solids",
          ],
        },
        {
          title: t("Rectangular Solids and Pyramids", "长方体与棱锥"),
          topics: [
            "volumes-of-cubes",
            "surface-areas-of-cubes",
            "face-diagonals-of-cubes",
            "diagonals-of-cubes",
            "volumes-of-rectangular-solids",
            "surface-areas-of-rectangular-solids",
            "diagonals-of-rectangular-solids",
            "volumes-of-pyramids",
            "surface-areas-of-pyramids",
            "the-distance-formula-in-three-dimensions",
            "surface-areas-and-volumes-of-similar-solids",
          ],
        },
        {
          title: t("Non-Polyhedrons", "非多面体"),
          topics: [
            "volumes-of-cylinders",
            "surface-areas-of-cylinders",
            "volumes-of-right-cones",
            "slant-heights-of-right-cones",
            "surface-areas-of-right-cones",
            "volumes-of-spheres",
            "surface-areas-of-spheres",
            "conical-frustums",
            "volumes-of-revolution",
          ],
        },
      ],
    },
    {
      title: t("Trigonometry", "三角学"),
      modules: [
        {
          title: t("Introduction to Trigonometry", "三角学入门"),
          topics: [
            "angles-and-sides-in-right-triangles",
            "the-trigonometric-ratios",
            "calculating-trigonometric-ratios-using-the-pythagorean-theorem",
            "calculating-side-lengths-of-right-triangles-using-trigonometry",
            "calculating-angles-in-right-triangles-using-trigonometry",
            "modeling-with-trigonometry",
            "the-reciprocal-trigonometric-ratios",
            "trigonometric-ratios-in-similar-right-triangles",
            "trigonometric-functions-of-complementary-angles",
            "special-trigonometric-ratios",
            "calculating-areas-of-right-triangles-using-trigonometry",
            "solving-multiple-right-triangles-using-trigonometry",
          ],
        },
        {
          title: t("Radians", "弧度制"),
          topics: [
            "introduction-to-radians",
            "calculating-arc-length-using-radians",
            "calculating-areas-of-sectors-using-radians",
            "trigonometric-ratios-with-radians",
          ],
        },
        {
          title: t("The Unit Circle", "单位圆"),
          topics: [
            "angles-in-the-coordinate-plane",
            "negative-angles-in-the-coordinate-plane",
            "coterminal-angles",
            "calculating-reference-angles",
            "properties-of-the-unit-circle-in-the-first-quadrant",
            "extending-the-trigonometric-ratios-using-the-unit-circle",
            "extending-the-trigonometric-ratios-using-angles-in-radians",
            "extending-the-trigonometric-ratios-to-negative-angles",
            "extending-the-trigonometric-ratios-to-large-angles",
            "using-the-pythagorean-identity-in-the-first-quadrant",
            "extending-the-pythagorean-identity-to-all-quadrants",
          ],
        },
        {
          title: t("Special Trigonometric Ratios", "特殊角的三角比"),
          topics: [
            "finding-trigonometric-ratios-of-quadrantal-angles",
            "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range",
            "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
            "evaluating-trigonometric-expressions",
            "further-extensions-of-the-special-trigonometric-ratios",
          ],
        },
        {
          title: t("Graphing Trigonometric Functions", "画三角函数的图象"),
          topics: ["graphing-sine-and-cosine", "graphing-tangent-and-cotangent", "graphing-secant-and-cosecant"],
        },
        {
          title: t("Properties of Trigonometric Functions", "三角函数的性质"),
          topics: [
            "describing-properties-of-the-sine-function",
            "describing-properties-of-the-cosine-function",
            "describing-properties-of-the-tangent-function",
            "describing-properties-of-the-secant-function",
            "describing-properties-of-the-cosecant-function",
            "describing-properties-of-the-cotangent-function",
          ],
        },
        {
          title: t("Graph Transformations of Trigonometric Functions", "三角函数的图像变换"),
          topics: [
            "vertical-translations-of-trigonometric-functions",
            "vertical-stretches-of-trigonometric-functions",
            "horizontal-translations-of-trigonometric-functions",
            "horizontal-stretches-of-trigonometric-functions",
            "combining-graph-transformations-of-sine-and-cosine",
            "graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-secant-and-cosecant",
            "graphing-reflections-of-trigonometric-functions",
            "graphing-reflections-of-trigonometric-functions-three-or-more-transformations",
          ],
        },
        {
          title: t("Properties of Transformed Trigonometric Functions", "变换后三角函数的性质"),
          topics: [
            "properties-of-transformed-sine-and-cosine-functions",
            "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions",
            "properties-of-transformed-tangent-and-cotangent-functions",
            "properties-of-transformed-secant-and-cosecant-functions",
            "interpreting-trigonometric-models",
            "modeling-with-trigonometric-functions",
          ],
        },
      ],
    },
    {
      title: t("Probability & Statistics", "概率与统计"),
      modules: [
        {
          title: t("Introduction to Probability", "概率入门"),
          topics: [
            "sets",
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "the-complement-of-an-event",
            "venn-diagrams-in-probability",
            "geometric-probability",
          ],
        },
        {
          title: t("Compound Events in Probability", "概率中的复合事件"),
          topics: [
            "the-union-of-sets",
            "the-intersection-of-sets",
            "compound-events-in-probability-from-experimental-data",
            "computing-probabilities-for-compound-events-using-venn-diagrams",
            "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
            "computing-probabilities-for-three-events-using-venn-diagrams",
          ],
        },
        {
          title: t("Conditional Probability", "条件概率"),
          topics: [
            "conditional-probabilities-from-venn-diagrams",
            "conditional-probabilities-from-tables",
            "the-multiplication-law-for-conditional-probability",
            "the-law-of-total-probability",
            "tree-diagrams-for-dependent-events",
            "tree-diagrams-for-dependent-events-applications",
            "independent-events",
            "tree-diagrams-for-independent-events",
            "the-addition-law-of-probability",
            "applying-the-addition-law-with-event-complements",
            "mutually-exclusive-events",
          ],
        },
        {
          title: t("Combinatorics", "组合"),
          topics: [
            "the-rules-of-sum-and-product",
            "factorials",
            "factorials-in-variable-expressions",
            "ordering-objects",
            "permutations",
            "combinations",
            "computing-probabilities-using-combinatorics",
          ],
        },
        {
          title: t("The Binomial Theorem", "二项式定理"),
          topics: [
            "pascals-triangle-and-the-binomial-coefficients",
            "expanding-a-binomial-using-binomial-coefficients",
            "the-special-case-of-the-binomial-theorem",
            "approximating-values-using-the-binomial-theorem",
          ],
        },
        {
          title: t("Analyzing Data", "数据分析"),
          topics: [
            "sampling",
            "mean-of-a-data-set",
            "variance-and-standard-deviation",
            "estimating-means-and-variances-for-grouped-data",
            "covariance",
            "sums-of-squares",
          ],
        },
        {
          title: t("Correlation and Regression", "相关与回归"),
          topics: ["the-linear-correlation-coefficient", "residuals-and-residual-plots", "selecting-a-regression-model"],
        },
      ],
    },
  ],
};

/** integratedMathIIIHonors is the high-school integrated mathematics honors course. */
export const integratedMathIIIHonors: CourseDef = {
  id: "integrated-math-iii-honors",
  title: t("Integrated Math III (Honors)", "综合数学三（荣誉）"),
  description: t(
    "Finite geometric series; advanced polynomial operations, division, theorems, factoring, and graphs; rational equations, reciprocal and rational functions; radical functions; quadratic, polynomial, rational, and nonlinear inequalities; conics (parabolas, circles, ellipses, hyperbolas); general triangle trigonometry and the Laws of Sines and Cosines, trigonometric functions, graphs, identities, and equations; parametric and polar equations; vectors in two and three dimensions; complex numbers and the complex plane, polar form and De Moivre's theorem; matrices, determinants, and linear transformations; and conditional probability, combinatorics, discrete random variables, the normal distribution, and statistical analysis.",
    "有限等比级数；进阶多项式运算、除法、定理、因式分解与图像；分式方程、倒数函数与有理函数；根式函数；二次、多项式、分式与其他非线性不等式；圆锥曲线（抛物线、圆、椭圆、双曲线）；任意三角形的三角学与正弦定理、余弦定理、三角函数、图像、恒等式与方程；参数方程与极坐标方程；二维与三维向量；复数与复平面、极坐标形式与棣莫弗定理；矩阵、行列式与线性变换；以及条件概率、组合、离散随机变量、正态分布与统计分析。",
  ),
  units: [
    {
      title: t("Sequences & Series", "数列与级数"),
      modules: [
        {
          title: t("Finite Geometric Series", "有限等比级数"),
          topics: [
            "the-sum-of-a-finite-geometric-series",
            "the-sum-of-the-first-n-terms-of-a-geometric-series",
            "writing-geometric-series-in-sigma-notation",
            "sums-of-finite-geometric-series-given-in-sigma-notation",
            "solving-geometric-series-problems-using-exponential-equations-and-inequalities",
            "modeling-with-geometric-series",
            "modeling-financial-problems-using-geometric-series",
          ],
        },
      ],
    },
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Dividing Polynomials", "多项式除法"),
          topics: [
            "dividing-polynomials-using-synthetic-division",
            "dividing-polynomials-by-linear-binomials-using-long-division",
            "dividing-polynomials-using-long-division",
            "dividing-polynomials-by-manipulating-rational-expressions",
          ],
        },
        {
          title: t("Polynomial Theorems", "多项式定理"),
          topics: [
            "the-factor-theorem",
            "determining-polynomial-coefficients-using-the-factor-theorem",
            "factoring-cubic-polynomials-using-the-factor-theorem",
            "factoring-quartic-polynomials-using-the-factor-theorem",
            "multiplicities-of-the-roots-of-polynomials",
            "finding-multiplicities-of-the-roots-of-quartic-polynomials-by-factoring",
            "the-remainder-theorem",
            "the-rational-roots-theorem",
            "closure-properties-of-polynomials",
          ],
        },
        {
          title: t("Graphs of Polynomials", "多项式图像"),
          topics: [
            "end-behavior",
            "graphing-elementary-cubic-functions",
            "graphing-cubic-curves-containing-three-distinct-real-roots",
            "graphing-cubic-curves-containing-a-double-root",
            "graphing-cubic-curves-containing-one-distinct-real-root",
            "end-behavior-of-polynomials",
            "graphing-general-polynomials",
          ],
        },
      ],
    },
    {
      title: t("Rational Equations & Functions", "分式方程与有理函数"),
      modules: [
        {
          title: t("Rational Equations", "分式方程"),
          topics: [
            "closure-properties-of-rational-expressions",
            "rational-equations-with-three-terms",
            "advanced-rational-equations",
            "further-advanced-rational-equations",
          ],
        },
        {
          title: t("Reciprocal Functions", "倒数函数"),
          topics: [
            "graphing-reciprocal-functions",
            "graph-transformations-of-reciprocal-functions",
            "combining-graph-transformations-of-reciprocal-functions",
            "domain-and-range-of-transformed-reciprocal-functions",
            "inverses-of-reciprocal-functions",
            "finding-intersections-of-lines-and-reciprocal-functions",
          ],
        },
        {
          title: t("Rational Functions", "有理函数"),
          topics: [
            "roots-of-rational-functions",
            "vertical-asymptotes-of-rational-functions",
            "locating-holes-in-rational-functions",
            "horizontal-asymptotes-of-rational-functions",
            "end-behavior-of-rational-functions",
            "infinite-limits-of-rational-functions",
            "infinite-limits-of-rational-functions-advanced-cases",
            "the-domain-and-range-of-a-rational-function",
            "identifying-a-rational-function-from-a-graph",
            "identifying-a-rational-function-from-a-graph-containing-holes",
            "identifying-the-graph-of-a-rational-function",
          ],
        },
      ],
    },
    {
      title: t("Radical Functions", "根式函数"),
      modules: [
        {
          title: t("Radical Expressions", "根式"),
          topics: [
            "simplifying-square-root-expressions-using-polynomial-factorization",
            "rationalizing-algebraic-denominators",
            "rationalizing-two-term-denominators",
            "further-rationalizing-denominators",
          ],
        },
        {
          title: t("Graphs of Radical Functions", "根式函数的图象"),
          topics: [
            "graphing-the-square-root-function",
            "graph-transformations-of-square-root-functions",
            "graphing-the-cube-root-function",
            "properties-of-transformed-square-root-functions",
            "the-domain-of-a-transformed-radical-function",
            "the-range-of-a-transformed-radical-function",
            "roots-of-transformed-radical-functions",
            "inverses-of-radical-functions",
            "finding-intersections-of-lines-and-radical-functions",
          ],
        },
      ],
    },
    {
      title: t("Inequalities", "不等式"),
      modules: [
        {
          title: t("Quadratic Inequalities", "二次不等式"),
          topics: [
            "solving-elementary-quadratic-inequalities",
            "solving-quadratic-inequalities-from-graphs",
            "solving-quadratic-inequalities-using-the-graphical-method",
            "solving-quadratic-inequalities-using-the-sign-table-method",
            "determining-unknown-parameters-in-quadratic-equations-with-real-solutions",
            "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
            "determining-unknown-parameters-in-quadratic-equations-advanced-cases",
          ],
        },
        {
          title: t("Polynomial Inequalities", "多项式不等式"),
          topics: [
            "inequalities-involving-powers-of-binomials",
            "solving-polynomial-inequalities-using-a-graphical-method",
            "solving-polynomial-inequalities-using-special-factoring-techniques-and-the-graphical-method",
            "solving-polynomial-inequalities-using-the-sign-table-method",
          ],
        },
        {
          title: t("Non-Polynomial Inequalities", "非多项式不等式"),
          topics: [
            "solving-radical-inequalities",
            "solving-inequalities-involving-exponential-functions",
            "solving-inequalities-involving-logarithmic-functions",
            "solving-inequalities-involving-exponential-functions-and-polynomials",
            "solving-inequalities-involving-positive-and-negative-factors",
            "solving-inequalities-involving-geometric-sequences",
            "solving-rational-inequalities",
            "further-solving-of-rational-inequalities",
            "solving-two-variable-nonlinear-inequalities",
            "further-solving-of-two-variable-nonlinear-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Conics", "圆锥曲线"),
      modules: [
        {
          title: t("Ellipses as Conic Sections", "作为圆锥曲线的椭圆"),
          topics: [
            "introduction-to-ellipses",
            "equations-of-ellipses-centered-at-the-origin",
            "equations-of-ellipses-centered-at-a-general-point",
            "finding-the-center-and-axes-of-ellipses-by-completing-the-square",
            "finding-intercepts-of-ellipses",
            "finding-intersections-of-ellipses-and-lines",
            "foci-of-ellipses",
            "vertices-and-eccentricity-of-ellipses",
            "directrices-of-ellipses",
            "the-area-of-an-ellipse",
          ],
        },
        {
          title: t("Hyperbolas as Conic Sections", "作为圆锥曲线的双曲线"),
          topics: [
            "equations-of-hyperbolas-centered-at-the-origin",
            "equations-of-hyperbolas-centered-at-a-general-point",
            "asymptotes-of-hyperbolas-centered-at-the-origin",
            "asymptotes-of-hyperbolas-centered-at-a-general-point",
            "finding-intercepts-and-intersections-of-hyperbolas",
            "transverse-axes-of-hyperbolas",
            "conjugate-axes-of-hyperbolas",
            "foci-of-hyperbolas",
            "eccentricity-and-vertices-of-hyperbolas",
            "directrices-of-hyperbolas",
          ],
        },
      ],
    },
    {
      title: t("Trigonometric Functions", "三角函数"),
      modules: [
        {
          title: t("Trigonometry with General Triangles", "任意三角形的三角学"),
          topics: [
            "the-law-of-sines",
            "the-law-of-cosines",
            "the-area-of-a-general-triangle",
            "modeling-using-the-law-of-sines",
            "modeling-using-the-law-of-cosines",
          ],
        },
        {
          title: t("The Inverse Trigonometric Functions", "反三角函数"),
          topics: [
            "graphing-the-inverse-sine-function",
            "graphing-the-inverse-cosine-function",
            "graphing-the-inverse-tangent-function",
            "evaluating-expressions-containing-inverse-trigonometric-functions",
            "further-evaluating-expressions-containing-inverse-trigonometric-functions",
          ],
        },
      ],
    },
    {
      title: t("Trigonometric Identities", "三角恒等式"),
      modules: [
        {
          title: t("Trigonometric Identities", "三角恒等式"),
          topics: [
            "simplifying-expressions-using-basic-trigonometric-identities",
            "simplifying-expressions-using-the-pythagorean-identity",
            "alternate-forms-of-the-pythagorean-identity",
            "simplifying-expressions-using-the-secant-tangent-identity",
            "alternate-forms-of-the-secant-tangent-identity",
            "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity",
            "simplifying-trigonometric-expressions-using-cofunction-identities",
          ],
        },
        {
          title: t("The Sum and Difference Formulas", "和差公式"),
          topics: [
            "the-sum-and-difference-formulas-for-sine",
            "the-sum-and-difference-formulas-for-cosine",
            "the-sum-and-difference-formulas-for-tangent",
            "calculating-trigonometric-ratios-using-the-sum-formula-for-sine",
            "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine",
            "calculating-trigonometric-ratios-using-the-sum-formula-for-tangent",
            "writing-sums-of-trigonometric-functions-in-amplitude-phase-form",
          ],
        },
        {
          title: t("The Double-Angle Formulas", "二倍角公式"),
          topics: [
            "the-double-angle-formula-for-sine",
            "verifying-trigonometric-identities-using-the-double-angle-formula-for-sine",
            "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem",
            "the-double-angle-formula-for-cosine",
            "verifying-trigonometric-identities-using-the-double-angle-formulas-for-cosine",
            "finding-exact-values-of-trigonometric-expressions-using-the-double-angle-formulas-for-cosine",
            "simplifying-expressions-using-the-double-angle-formula-for-tangent",
            "verifying-trigonometric-identities-using-the-double-angle-formula-for-tangent",
          ],
        },
      ],
    },
    {
      title: t("Trigonometric Equations", "三角方程"),
      modules: [
        {
          title: t("Elementary Trigonometric Equations", "基本三角方程"),
          topics: [
            "elementary-trigonometric-equations-containing-sine",
            "elementary-trigonometric-equations-containing-cosine",
            "elementary-trigonometric-equations-containing-tangent",
            "elementary-trigonometric-equations-containing-secant",
            "elementary-trigonometric-equations-containing-cosecant",
            "elementary-trigonometric-equations-containing-cotangent",
            "general-solutions-of-elementary-trigonometric-equations",
          ],
        },
        {
          title: t("Trigonometric Equations Containing Transformed Functions", "含变换函数的三角方程"),
          topics: [
            "general-solutions-of-trigonometric-equations-with-transformed-functions",
            "trigonometric-equations-containing-transformed-sine-functions",
            "trigonometric-equations-containing-transformed-cosine-functions",
            "trigonometric-equations-containing-transformed-tangent-functions",
          ],
        },
        {
          title: t("Advanced Trigonometric Equations", "高级三角方程"),
          topics: [
            "solving-trigonometric-equations-using-the-sin-cos-tan-identity",
            "solving-trigonometric-equations-using-the-zero-product-property",
            "quadratic-trigonometric-equations-containing-sine-or-cosine",
            "quadratic-trigonometric-equations-containing-tangent-or-cotangent",
          ],
        },
      ],
    },
    {
      title: t("Parametric Equations", "参数方程"),
      modules: [
        {
          title: t("Parametric Equations", "参数方程"),
          topics: [
            "graphing-curves-defined-parametrically",
            "cartesian-equations-of-parametric-curves",
            "finding-intercepts-of-curves-defined-parametrically",
            "finding-intersections-of-parametric-curves-and-lines",
            "parametric-equations-of-circles",
            "parametric-equations-of-ellipses",
            "parametric-equations-of-parabolas",
            "parametric-equations-of-parabolas-centered-at-hk",
            "parametric-equations-of-horizontal-hyperbolas",
            "parametric-equations-of-vertical-hyperbolas",
          ],
        },
      ],
    },
    {
      title: t("Polar Equations", "极坐标方程"),
      modules: [
        {
          title: t("Polar Coordinates", "极坐标"),
          topics: [
            "introduction-to-polar-coordinates",
            "converting-from-polar-coordinates-to-cartesian-coordinates",
            "polar-equations-of-circles-centered-at-the-origin",
            "polar-equations-of-radial-lines",
            "polar-equations-of-circles-centered-on-the-coordinate-axes",
            "finding-intersections-of-polar-curves",
          ],
        },
      ],
    },
    {
      title: t("Vectors", "向量"),
      modules: [
        {
          title: t("Introduction to Vectors", "向量入门"),
          topics: [
            "introduction-to-vectors",
            "the-triangle-law-for-the-addition-of-two-vectors",
            "the-magnitude-of-a-vector",
            "problem-solving-using-vector-diagrams",
            "parallel-vectors",
            "unit-vectors",
            "linear-combinations-of-vectors-and-their-properties",
            "describing-the-position-vector-of-a-point-using-known-vectors",
          ],
        },
        {
          title: t("Vectors in 2D Cartesian Coordinates", "二维直角坐标中的向量"),
          topics: [
            "two-dimensional-vectors-expressed-in-component-form",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d",
            "calculating-the-magnitude-of-cartesian-vectors-in-2d",
            "calculating-the-direction-of-cartesian-vectors-in-2d",
            "calculating-the-components-of-cartesian-vectors-in-2d",
            "velocity-and-acceleration-for-plane-motion",
            "calculating-displacement-for-plane-motion",
          ],
        },
        {
          title: t("Vectors in 3D Cartesian Coordinates", "三维直角坐标中的向量"),
          topics: [
            "three-dimensional-vectors-in-component-form",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-3d",
            "calculating-the-magnitude-of-cartesian-vectors-in-3d",
          ],
        },
        {
          title: t("The Dot Product", "点积"),
          topics: [
            "calculating-the-dot-product-using-angle-and-magnitude",
            "calculating-the-dot-product-using-components",
            "the-angle-between-two-vectors",
            "calculating-a-scalar-projection",
            "calculating-a-vector-projection",
          ],
        },
        {
          title: t("The Cross Product", "叉积"),
          topics: [
            "the-cross-product-of-two-vectors",
            "properties-of-the-cross-product",
            "calculating-the-cross-product-using-determinants",
            "finding-areas-using-the-cross-product",
            "the-scalar-triple-product",
            "volumes-of-parallelepipeds",
            "finding-volumes-of-tetrahedrons-and-pyramids-using-vector-products",
          ],
        },
      ],
    },
    {
      title: t("Complex Numbers", "复数"),
      modules: [
        {
          title: t("The Complex Plane", "复平面"),
          topics: [
            "the-complex-plane",
            "the-magnitude-of-a-complex-number",
            "the-argument-of-a-complex-number",
            "arithmetic-in-the-complex-plane",
            "geometry-in-the-complex-plane",
          ],
        },
        {
          title: t("Further Complex Numbers", "复数进阶"),
          topics: [
            "the-complex-conjugate",
            "special-properties-of-the-complex-conjugate",
            "the-complex-conjugate-and-the-roots-of-a-quadratic-equation",
            "dividing-complex-numbers",
            "solving-equations-by-equating-real-and-imaginary-parts",
            "extending-polynomial-identities-to-the-complex-numbers",
          ],
        },
        {
          title: t("Complex Numbers in Polar Form", "复数的极坐标形式"),
          topics: [
            "the-polar-form-of-a-complex-number",
            "products-of-complex-numbers-expressed-in-polar-form",
            "quotients-of-complex-numbers-expressed-in-polar-form",
            "the-cis-notation",
          ],
        },
        {
          title: t("De Moivre's Theorem", "棣莫弗定理"),
          topics: [
            "de-moivres-theorem",
            "finding-powers-of-complex-numbers-using-de-moivres-theorem",
            "the-power-reducing-formulas-for-sine-and-cosine",
            "eulers-formula",
            "the-roots-of-unity",
            "properties-of-roots-of-unity",
            "square-roots-of-complex-numbers",
            "higher-roots-of-complex-numbers",
          ],
        },
        {
          title: t("The Fundamental Theorem of Algebra", "代数基本定理"),
          topics: [
            "the-fundamental-theorem-of-algebra-for-quadratic-equations",
            "the-fundamental-theorem-of-algebra-with-cubic-equations",
            "solving-cubic-equations-with-complex-roots",
            "the-fundamental-theorem-of-algebra-with-quartic-equations",
            "solving-quartic-equations-with-complex-roots",
          ],
        },
      ],
    },
    {
      title: t("Matrices", "矩阵"),
      modules: [
        {
          title: t("Introduction to Matrices", "矩阵入门"),
          topics: [
            "introduction-to-matrices",
            "index-notation-for-matrices",
            "adding-and-subtracting-matrices",
            "properties-of-matrix-addition",
            "scalar-multiplication-of-matrices",
            "zero-square-diagonal-and-identity-matrices",
            "the-transpose-of-a-matrix",
          ],
        },
        {
          title: t("Matrix Multiplication", "矩阵乘法"),
          topics: [
            "multiplying-a-matrix-by-a-column-vector",
            "multiplying-square-matrices",
            "conformability-for-matrix-multiplication",
            "multiplying-matrices",
            "powers-of-matrices",
            "multiplying-a-matrix-by-the-identity-matrix",
            "properties-of-matrix-multiplication",
            "representing-2x2-systems-of-equations-using-a-matrix-product",
            "representing-3x3-systems-of-equations-using-a-matrix-product",
          ],
        },
        {
          title: t("Determinants", "行列式"),
          topics: [
            "the-determinant-of-a-2x2-matrix",
            "the-geometric-interpretation-of-the-2x2-determinant",
            "the-minors-of-a-3x3-matrix",
            "the-determinant-of-a-3x3-matrix",
          ],
        },
        {
          title: t("The Inverse of a Matrix", "逆矩阵"),
          topics: [
            "introduction-to-the-inverse-of-a-matrix",
            "inverses-of-2x2-matrices",
            "calculating-the-inverse-of-a-3x3-matrix-using-the-cofactor-method",
            "solving-2x2-systems-of-equations-using-inverse-matrices",
            "solving-systems-of-equations-using-inverse-matrices",
          ],
        },
        {
          title: t("Linear Transformations", "线性变换"),
          topics: [
            "introduction-to-linear-transformations",
            "the-standard-matrix-of-a-linear-transformation",
            "linear-transformations-of-points-and-lines-in-the-plane",
            "linear-transformations-of-objects-in-the-plane",
            "dilations-and-reflections-as-linear-transformations",
            "shear-and-stretch-as-linear-transformations",
            "right-angle-rotations-as-linear-transformations",
            "rotations-as-linear-transformations",
            "combining-linear-transformations-using-2x2-matrices",
            "inverting-linear-transformations",
            "area-scale-factors-of-linear-transformations",
            "singular-linear-transformations-in-the-plane",
          ],
        },
      ],
    },
    {
      title: t("Probability and Statistics", "概率与统计"),
      modules: [
        {
          title: t("Regression", "回归"),
          topics: ["linear-regression", "quadratic-regression", "semi-log-scatter-plots", "exponential-regression"],
        },
        {
          title: t("Discrete Random Variables", "离散随机变量"),
          topics: [
            "probability-mass-functions-of-discrete-random-variables",
            "cumulative-distribution-functions-for-discrete-random-variables",
            "expected-values-of-discrete-random-variables",
            "the-binomial-distribution",
            "modeling-with-the-binomial-distribution",
            "the-geometric-distribution",
            "modeling-with-the-geometric-distribution",
          ],
        },
        {
          title: t("The Normal Distribution", "正态分布"),
          topics: [
            "the-z-score",
            "the-standard-normal-distribution",
            "symmetry-properties-of-the-standard-normal-distribution",
            "the-normal-distribution",
            "mean-and-variance-of-the-normal-distribution",
            "percentage-points-of-the-standard-normal-distribution",
            "modeling-with-the-normal-distribution",
            "the-empirical-rule-for-the-normal-distribution",
          ],
        },
      ],
    },
  ],
};

/** mathematicalFoundationsI is the Mathematical Foundations I course. */
export const mathematicalFoundationsI: CourseDef = {
  id: "mathematical-foundations-i",
  title: t("Mathematical Foundations I", "数学基础 I"),
  description: t(
    "Mathematical Foundations I develops numerical fluency, algebraic reasoning, and geometric fundamentals for adult learners returning to mathematics, covering integers, fractions, decimals, ratios, linear equations and inequalities, graphs of lines, systems of linear equations, units, polynomials, radical and rational expressions, functions, absolute value, exponential functions, and introductory geometry.",
    "数学基础 I 为重返数学学习的成年学习者培养数感运算能力、代数推理与几何基础，涵盖整数、分数、小数、比例、一次方程与不等式、直线图象、线性方程组、单位、多项式、根式与分式、函数、绝对值、指数函数以及初等几何。",
  ),
  units: [
    {
      title: t("Fractions", "分数"),
      modules: [
        {
          title: t("Adding and Subtracting Fractions and Whole Numbers", "分数与整数的加减法"),
          topics: [
            "adding-fractions-and-whole-numbers-using-models",
            "adding-fractions-and-whole-numbers",
            "subtracting-fractions-and-whole-numbers-using-models",
            "subtracting-fractions-and-whole-numbers",
          ],
        },
        {
          title: t("Adding and Subtracting Fractions", "分数的加减法"),
          topics: [
            "least-common-multiple",
            "least-common-denominators",
            "comparing-fraction-models-using-common-denominators",
            "comparing-fractions-using-common-denominators",
            "adding-fractions-with-unlike-denominators-using-models",
            "subtracting-fractions-with-unlike-denominators-using-models",
            "adding-fractions-with-unlike-denominators",
            "subtracting-fractions-with-unlike-denominators",
          ],
        },
        {
          title: t("Adding and Subtracting Mixed Numbers", "带分数加减法"),
          topics: [
            "adding-mixed-numbers-with-unlike-denominators",
            "subtracting-mixed-numbers-with-unlike-denominators",
            "subtracting-mixed-numbers-with-unlike-denominators-using-improper-fractions",
          ],
        },
        {
          title: t("Multiplying Fractions", "分数乘法"),
          topics: [
            "multiplying-unit-fractions-by-whole-numbers-using-models",
            "multiplying-fractions-by-whole-numbers-using-models",
            "multiplying-fractions-by-whole-numbers",
            "multiplying-fractions-by-whole-numbers-word-problems",
            "strategies-to-simplify-whole-number-and-fraction-multiplication",
            "multiplying-mixed-numbers-by-whole-numbers",
            "multiplying-fractions-by-unit-fractions-using-models",
            "multiplying-fractions-using-models",
            "multiplying-fractions",
            "multiplying-fractions-word-problems",
            "multiplying-fractions-by-swapping-denominators",
            "multiplying-mixed-numbers-by-fractions",
            "multiplying-mixed-numbers",
            "multiplying-mixed-numbers-word-problems",
          ],
        },
        {
          title: t("Dividing Fractions", "分数除法"),
          topics: [
            "dividing-whole-numbers-by-unit-fractions-using-models",
            "dividing-whole-numbers-by-unit-fractions",
            "dividing-unit-fractions-by-whole-numbers-using-models",
            "dividing-unit-fractions-by-whole-numbers",
            "reciprocals",
            "dividing-whole-numbers-by-fractions-using-models-whole-number-results",
            "dividing-whole-numbers-by-fractions-using-models-fractional-results",
            "dividing-whole-numbers-by-fractions",
            "dividing-fractions-by-whole-numbers-using-models",
            "dividing-fractions-by-whole-numbers",
            "dividing-fractions-using-models",
            "dividing-fractions",
          ],
        },
      ],
    },
    {
      title: t("Ratios and Percentages", "比与百分数"),
      modules: [
        {
          title: t("Ratios", "比"),
          topics: [
            "ratios",
            "equivalent-ratios",
            "writing-ratios-using-fractions",
            "reasoning-with-equivalent-ratios",
            "further-reasoning-with-equivalent-ratios",
            "ratio-tables",
            "graphing-ratios",
            "unit-rates",
            "solving-problems-using-unit-rates",
            "speed-as-a-unit-rate",
          ],
        },
        {
          title: t("Proportional Relationships", "比例关系"),
          topics: [
            "understanding-proportional-relationships-using-tables",
            "understanding-proportional-relationships-using-graphs",
            "understanding-proportional-relationships-from-descriptions",
            "modeling-with-direct-variation",
            "inverse-variation",
            "modeling-with-inverse-variation",
          ],
        },
        {
          title: t("Working With Units", "单位的运用"),
          topics: [
            "units-of-length",
            "units-of-mass",
            "metric-units-of-mass",
            "metric-units-of-length",
            "two-step-unit-conversions",
            "units-of-time",
            "units-of-volume",
            "perimeter",
            "area-of-rectangles-and-squares",
            "understanding-volume-using-unit-cubes",
            "units-of-area-and-volume",
            "unit-conversions-using-base-units-of-mass",
            "unit-conversions-using-base-units-of-length",
            "unit-conversions-using-units-of-time",
            "converting-units-of-area",
            "converting-units-of-area-to-larger-units",
            "mixed-units",
            "units-in-formulas",
            "units-of-rates-of-change",
            "degrees-of-accuracy",
          ],
        },
        {
          title: t("Percentages", "百分数"),
          topics: [
            "understanding-percentages-using-models",
            "converting-between-percentages-and-fractions",
            "converting-between-percentages-and-decimals",
            "comparing-fractions-percents-and-decimals",
            "finding-part-of-a-number-given-a-whole-and-a-percentage",
            "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems",
            "finding-a-percentage-given-two-numbers",
            "finding-a-percentage-given-two-numbers-word-problems",
            "finding-a-total-given-a-part-and-a-percentage",
            "applying-percentage-increases",
            "applying-percentage-decreases",
            "calculating-percentage-change",
            "applying-percentages-in-succession",
          ],
        },
        {
          title: t("Percentage Change", "百分比增减、利息与折扣"),
          topics: ["finding-original-values-from-percentage-increases", "finding-original-values-from-percentage-decreases"],
        },
      ],
    },
    {
      title: t("The Number System", "数系"),
      modules: [
        {
          title: t("Addition and Subtraction of Rational Numbers", "有理数的加减"),
          topics: [
            "subtracting-a-positive-number-from-a-smaller-positive-number",
            "subtracting-a-positive-number-from-a-negative-number",
            "subtracting-a-positive-fraction-from-a-smaller-fraction",
            "subtracting-a-positive-decimal-from-a-smaller-decimal",
            "absolute-value",
            "adding-a-positive-number-to-a-negative-number",
            "adding-a-negative-number",
            "subtracting-a-negative-number",
            "additive-inverses-of-numbers",
            "interpreting-additive-opposites-and-addition-using-absolute-value",
            "solving-problems-using-addition-and-subtraction-of-rational-numbers",
          ],
        },
        {
          title: t("Multiplication and Division of Rational Numbers", "有理数的乘除"),
          topics: [
            "multiplying-positive-numbers-with-negative-numbers",
            "multiplying-negative-numbers",
            "dividing-with-negative-numbers",
            "equivalent-fractions-with-negative-numbers",
            "dividing-with-negative-decimals-and-fractions",
            "reciprocals-of-rational-numbers",
            "multiplying-and-dividing-with-zero",
            "fractions-of-fractions",
            "solving-problems-using-multiplication-and-division-of-rational-numbers",
            "solving-problems-using-the-four-operations-on-rational-numbers",
          ],
        },
        {
          title: t("Number Theory", "数论初步"),
          topics: [
            "divisibility-of-integers-by-2-5-10-4-and-8",
            "divisibility-of-integers-by-3-9-6-and-7",
            "prime-and-composite-numbers",
            "prime-factors",
            "the-fundamental-theorem-of-arithmetic",
            "finding-greatest-common-factors-using-prime-factorization",
            "finding-lowest-common-multiples-using-prime-factorization",
            "natural-numbers-integers-and-rational-numbers",
            "rational-numbers-as-finite-or-repeating-decimals",
          ],
        },
      ],
    },
    {
      title: t("Exponents and Radicals", "指数与根式"),
      modules: [
        {
          title: t("Exponents", "指数"),
          topics: [
            "introduction-to-exponents",
            "evaluating-exponents",
            "evaluating-larger-exponents",
            "evaluating-exponents-with-fractional-bases",
            "evaluating-exponents-with-decimal-bases",
            "evaluating-whole-number-expressions-containing-exponents",
            "squaring-rational-numbers",
            "cubing-rational-numbers",
            "exponents-with-rational-bases",
            "the-zeroth-power",
            "powers-of-negative-one",
            "negative-exponents",
          ],
        },
        {
          title: t("The Rules of Exponents", "指数法则"),
          topics: [
            "the-product-rule-for-exponents",
            "the-quotient-rule-for-exponents",
            "the-power-rule-for-exponents",
            "the-power-of-product-rule-for-exponents",
            "the-power-of-quotient-rule-for-exponents",
            "combining-the-rules-of-exponents",
          ],
        },
        {
          title: t("Order of Operations", "运算顺序"),
          topics: [
            "evaluating-rational-number-expressions-without-exponents",
            "evaluating-expressions-with-positive-integer-exponents",
            "evaluating-expressions-with-integer-exponents",
          ],
        },
        {
          title: t("Radicals", "根式"),
          topics: [
            "the-square-root-of-a-perfect-square",
            "squaring-a-square-root",
            "the-cube-root-of-a-perfect-cube",
            "surds",
            "evaluating-radical-expressions",
            "rationalizing-denominators",
          ],
        },
        {
          title: t("The Rules of Radicals", "根式运算法则"),
          topics: [
            "square-roots-of-algebraic-perfect-squares",
            "cube-roots-of-algebraic-perfect-cubes",
            "writing-radicals-using-fractional-exponents",
            "the-product-rule-for-radicals",
            "the-quotient-rule-for-radicals",
          ],
        },
      ],
    },
    {
      title: t("Equations and Inequalities", "方程与不等式"),
      modules: [
        {
          title: t("Algebraic Expressions", "代数式"),
          topics: [
            "introduction-to-algebraic-expressions",
            "constructing-algebraic-expressions",
            "evaluating-linear-expressions",
            "evaluating-rational-expressions",
            "identifying-terms-in-linear-expressions",
            "identifying-coefficients-and-constants",
            "the-greatest-common-factor-of-two-linear-expressions",
          ],
        },
        {
          title: t("Simplifying Linear Expressions", "化简一次式"),
          topics: [
            "identifying-like-terms-in-linear-expressions",
            "combining-like-terms",
            "evaluating-numerical-expressions-containing-radicals",
            "adding-and-subtracting-radicals",
            "simplifying-expressions-with-surds",
            "applying-the-distributive-law-to-linear-expressions",
            "the-distributive-law-with-three-terms",
            "distributing-the-negative-sign-in-a-linear-expression",
            "simplifying-linear-expressions-using-the-distributive-law",
            "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted",
            "simplifying-linear-expressions-containing-fractions",
            "factoring-linear-expressions",
          ],
        },
        {
          title: t("Solving One-Step Linear Equations", "解一步一次方程"),
          topics: [
            "solving-linear-equations-by-trial-and-error",
            "one-step-equations-addition",
            "one-step-equations-multiplication",
            "writing-repeating-decimals-as-fractions",
          ],
        },
        {
          title: t("Solving Multi-Step Linear Equations", "解多步一次方程"),
          topics: [
            "two-step-equations",
            "solving-linear-equations-with-fractional-coefficients",
            "solving-linear-equations-with-decimal-coefficients",
            "equations-with-variables-on-both-sides",
            "solving-linear-equations-by-clearing-a-rational-expression",
            "solving-linear-equations-using-cross-multiplication",
            "two-variable-linear-equations-and-their-solutions",
            "solving-two-variable-equations",
            "linear-equations-with-infinitely-many-solutions",
            "linear-equations-with-no-solutions",
            "linear-equations-with-unknown-coefficients",
            "unknown-coefficients-by-factoring",
            "many-variable-equations",
          ],
        },
        {
          title: t("Modeling With Linear Equations", "用一次方程建模"),
          topics: ["interpreting-linear-expressions", "modeling-with-linear-equations"],
        },
        {
          title: t("Solving Linear Inequalities", "解一次不等式"),
          topics: [
            "inequalities-and-solutions",
            "compound-inequalities",
            "verifying-solutions-of-linear-inequalities",
            "solving-one-step-inequalities",
            "solving-multi-step-inequalities",
            "representing-solutions-to-inequalities-on-number-lines",
            "further-solving-linear-inequalities",
            "solving-compound-inequalities",
            "interval-notation",
            "unbounded-intervals",
            "unions-of-intervals",
            "intersections-of-intervals",
            "compound-or-inequalities",
            "compound-and-inequalities",
          ],
        },
        {
          title: t("Nonlinear Equations", "非线性方程"),
          topics: ["solving-equations-with-square-roots", "solving-odd-power-equations", "solving-even-power-equations"],
        },
      ],
    },
    {
      title: t("Two-Variable Equations", "二元方程"),
      modules: [
        {
          title: t("Graphs of Linear Equations", "直线图像"),
          topics: [
            "the-cartesian-coordinate-system",
            "distances-between-points-in-the-coordinate-plane",
            "graphing-linear-equations",
            "horizontal-and-vertical-lines",
            "slope-of-a-line",
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
            "point-slope-form",
            "standard-form",
            "properties-of-lines-in-standard-form",
            "parallel-lines-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Modeling With Two-Variable Linear Equations", "用二元一次方程建模"),
          topics: [
            "modeling-with-two-variable-linear-equations",
            "analyzing-graphs-of-linear-models",
            "further-modeling-with-two-variable-equations",
            "distance-time-graphs",
            "speed-time-graphs",
          ],
        },
        {
          title: t("Systems of Linear Equations", "二元一次方程组"),
          topics: [
            "systems-of-linear-equations",
            "solving-systems-by-substitution",
            "introduction-to-elimination",
            "elimination-with-one-transformation",
            "elimination-with-two-transformations",
            "systems-with-fractional-coefficients",
            "systems-with-decimal-coefficients",
            "solving-systems-of-nonlinear-equations",
            "solving-systems-of-nonlinear-equations-using-graphs",
            "systems-with-no-solution-or-infinitely-many-solutions",
            "consistency-and-dependency",
            "intersection-of-two-lines",
          ],
        },
      ],
    },
    {
      title: t("Radical and Rational Expressions", "根式与分式"),
      modules: [
        {
          title: t("Radical Expressions", "根式"),
          topics: [
            "simplifying-square-roots-with-variables",
            "quotient-rule-for-square-roots",
            "multiplying-radical-expressions",
            "adding-and-subtracting-radical-expressions",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Functions", "函数"),
          topics: [
            "introduction-to-functions",
            "representations-of-functions",
            "graphs-of-functions",
            "domain-of-a-function",
            "global-extrema",
            "range-of-a-function",
            "range-advanced-cases",
            "roots-of-a-function",
            "increasing-and-decreasing",
            "piecewise-functions",
            "modeling-with-linear-functions",
            "constructing-linear-functions",
          ],
        },
      ],
    },
    {
      title: t("Absolute Value", "绝对值"),
      modules: [
        {
          title: t("Absolute Value Expressions, Equations & Inequalities", "绝对值表达式、方程与不等式"),
          topics: [
            "absolute-value-expressions",
            "rules-of-absolute-value",
            "further-rules-of-absolute-value",
            "absolute-value-equations",
            "further-absolute-value-equations",
            "absolute-value-inequalities",
            "absolute-value-graphs",
            "vertical-reflections-of-absolute-value-graphs",
            "stretches-of-absolute-value-graphs",
            "combining-transformations-of-absolute-value-graphs",
            "domain-and-range-of-absolute-value-functions",
          ],
        },
      ],
    },
    {
      title: t("Exponential Functions", "指数函数"),
      modules: [
        {
          title: t("Rules of Exponents", "指数法则"),
          topics: [
            "product-rule-with-algebraic-expressions",
            "quotient-rule-with-algebraic-expressions",
            "power-rule-with-algebraic-expressions",
            "power-of-product-rule-with-algebraic-expressions",
            "power-of-quotient-rule-with-algebraic-expressions",
            "combining-rules-of-exponents-with-algebraic-expressions",
          ],
        },
        {
          title: t("Exponential Expressions and Equations", "指数式与指数方程"),
          topics: ["solving-exponential-equations", "creating-exponential-growth-expressions", "creating-exponential-decay-expressions"],
        },
        {
          title: t("Exponential Functions", "指数函数"),
          topics: [
            "exponential-functions",
            "modeling-exponential-growth-with-functions",
            "interpreting-exponential-growth",
            "solving-exponential-growth-problems",
            "modeling-exponential-decay-with-functions",
            "interpreting-exponential-decay",
            "solving-exponential-decay-problems",
            "graphing-exponential-growth-functions",
            "graphing-exponential-decay-functions",
          ],
        },
      ],
    },
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Polynomials", "多项式"),
          topics: [
            "introduction-to-polynomials",
            "degree-of-a-polynomial",
            "end-behavior",
            "simplifying-polynomials",
            "distributive-law-for-polynomials",
            "equivalent-expressions-with-fractions",
            "adding-and-subtracting-polynomials",
            "monomials-binomials-and-trinomials",
            "multiplying-binomials",
            "multiplying-polynomials",
            "squaring-binomials",
            "square-roots-with-domain-restrictions",
            "expanding-binomials-using-pascals-triangle",
            "difference-of-squares-formula",
          ],
        },
        {
          title: t("Factoring Polynomials", "因式分解"),
          topics: [
            "greatest-common-factor-of-monomials",
            "simplifying-rational-expressions",
            "rational-equations-with-one-fractional-term",
            "rational-equations-using-cross-multiplication",
            "rational-equations-using-the-flip-method",
            "rational-equations-containing-binomials",
            "splitting-rational-expressions-into-terms",
            "factoring-polynomials-using-gcfs",
            "factoring-perfect-square-trinomials",
            "factoring-perfect-square-trinomials-with-leading-coefficients",
            "factoring-differences-of-squares",
            "factoring-trinomials",
            "simplifying-rational-expressions-by-factoring",
            "factoring-trinomials-using-common-factors",
            "factoring-trinomials-with-leading-coefficients",
            "further-factoring-trinomials-with-leading-coefficients",
          ],
        },
      ],
    },
    {
      title: t("Geometry Fundamentals", "几何基础"),
      modules: [
        {
          title: t("Introduction to Geometry", "几何初步"),
          topics: [
            "points-lines-rays-and-segments",
            "measures-of-segments",
            "congruent-segments",
            "midpoints",
            "collinear-points",
            "the-segment-addition-postulate",
          ],
        },
        {
          title: t("Angles", "角"),
          topics: [
            "angles-and-angle-measures",
            "measuring-angles-using-a-protractor",
            "sums-of-angles",
            "right-straight-full-and-null-angles",
            "parallel-and-perpendicular-lines",
            "acute-obtuse-and-reflex-angles",
            "congruent-angles",
            "vertical-angles",
          ],
        },
        {
          title: t("Advanced Angles", "三角形内外角"),
          topics: [
            "complementary-angles",
            "non-adjacent-complementary-angles",
            "supplementary-angles",
            "solving-problems-with-angles",
            "corresponding-angles",
            "alternate-angles",
            "consecutive-angles",
            "angle-bisectors",
            "segment-bisectors-and-the-perpendicular-bisector-theorem",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: ["circles", "arcs-segments-and-sectors-of-circles", "the-circumference-of-a-circle", "areas-of-circles"],
        },
      ],
    },
    {
      title: t("Polygons", "多边形"),
      modules: [
        {
          title: t("Triangles", "三角形"),
          topics: [
            "angles-of-a-triangle",
            "exterior-angles-of-triangles",
            "classifying-triangles",
            "the-triangle-inequality",
            "isosceles-triangles",
            "heights-of-triangles",
            "the-pythagorean-theorem",
            "isosceles-right-triangles",
            "thirty-sixty-ninety-triangles",
          ],
        },
        {
          title: t("Polygons", "多边形"),
          topics: [
            "polygons",
            "angles-of-polygons",
            "exterior-angles-of-polygons",
            "congruent-polygons",
            "regular-polygons",
            "classifying-quadrilaterals",
            "properties-of-rectangles-and-squares",
          ],
        },
        {
          title: t("Area and Perimeter", "面积与周长"),
          topics: ["areas-of-triangles", "area-of-trapezoids", "distance-from-speed-time-graphs", "composite-shapes"],
        },
      ],
    },
  ],
};

/** mathematicalFoundationsII is the Mathematical Foundations II course. */
export const mathematicalFoundationsII: CourseDef = {
  id: "mathematical-foundations-ii",
  title: t("Mathematical Foundations II", "数学基础 II"),
  description: t(
    "Mathematical Foundations II covers intermediate algebra, functions, exponentials and logarithms, radical and rational functions, sequences, geometry, trigonometry, vectors, introductory calculus, statistics, and probability.",
    "数学基础 II 涵盖中级代数、函数、指数与对数、根式与有理函数、数列、几何、三角学、向量、初等微积分、统计与概率。",
  ),
  units: [
    {
      title: t("Quadratics", "二次式"),
      modules: [
        {
          title: t("Quadratic Equations", "二次方程"),
          topics: [
            "introduction-to-quadratic-equations",
            "solving-perfect-square-quadratic-equations",
            "perfect-square-quadratic-equations-with-one-or-no-solutions",
            "zero-product-rule",
            "solving-quadratic-equations-using-a-difference-of-squares",
            "solving-quadratic-equations-with-no-constant-term",
            "solving-quadratic-equations-by-factoring",
            "solving-quadratic-equations-with-leading-coefficients-by-factoring",
            "completing-the-square",
            "completing-the-square-with-odd-linear-terms",
            "completing-the-square-with-leading-coefficients",
            "solving-quadratic-equations-by-completing-the-square",
            "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
            "the-quadratic-formula",
            "the-discriminant-of-a-quadratic-equation",
            "quadratic-equations-with-one-real-solution",
            "equating-polynomial-coefficients",
            "vietas-formulas",
          ],
        },
        {
          title: t("Quadratic Functions", "二次函数"),
          topics: [
            "graphing-elementary-quadratic-functions",
            "vertical-reflections-of-quadratic-functions",
            "graphs-of-general-quadratic-functions",
            "roots-of-quadratic-functions",
            "the-discriminant-of-a-quadratic-function",
            "the-axis-of-symmetry-of-a-parabola",
            "the-average-of-the-roots-formula",
            "the-vertex-form-of-a-parabola",
            "writing-the-equation-of-a-parabola-in-vertex-form",
            "domain-and-range-of-quadratic-functions",
            "solving-systems-of-nonlinear-equations",
            "finding-intersections-of-lines-and-quadratic-functions",
            "modeling-downwards-vertical-motion",
          ],
        },
      ],
    },
    {
      title: t("Vectors", "向量"),
      modules: [
        {
          title: t("Introduction to Vectors", "向量入门"),
          topics: [
            "introduction-to-vectors",
            "the-triangle-law-for-the-addition-of-two-vectors",
            "the-magnitude-of-a-vector",
            "problem-solving-using-vector-diagrams",
            "parallel-vectors",
            "unit-vectors",
            "linear-combinations-of-vectors-and-their-properties",
            "describing-the-position-vector-of-a-point-using-known-vectors",
          ],
        },
        {
          title: t("Vectors in 2D Cartesian Coordinates", "二维笛卡尔坐标系中的向量"),
          topics: [
            "two-dimensional-vectors-expressed-in-component-form",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d",
            "calculating-the-magnitude-of-cartesian-vectors-in-2d",
          ],
        },
      ],
    },
    {
      title: t("Polynomials", "多项式"),
      modules: [
        {
          title: t("Factoring Polynomials", "多项式因式分解"),
          topics: [
            "further-factoring-of-polynomials-using-gcfs",
            "factoring-higher-order-polynomials-as-a-difference-of-squares",
            "factoring-cubic-expressions-by-grouping",
            "factoring-sums-and-differences-of-cubes",
            "factoring-biquadratic-expressions",
          ],
        },
        {
          title: t("Polynomials", "多项式"),
          topics: [
            "the-least-common-multiple-of-two-monomials",
            "the-least-common-multiple-of-two-polynomials",
            "determining-the-roots-of-polynomials",
            "solving-polynomial-equations-using-the-gcf",
            "solving-cubic-equations-by-grouping",
            "end-behavior",
          ],
        },
        {
          title: t("Dividing Polynomials", "多项式除法"),
          topics: [
            "dividing-polynomials-using-synthetic-division",
            "dividing-polynomials-by-linear-binomials-using-long-division",
            "dividing-polynomials-using-long-division",
            "dividing-polynomials-by-manipulating-rational-expressions",
          ],
        },
        {
          title: t("Polynomial Theorems", "多项式定理"),
          topics: [
            "the-factor-theorem",
            "determining-polynomial-coefficients-using-the-factor-theorem",
            "factoring-cubic-polynomials-using-the-factor-theorem",
            "factoring-quartic-polynomials-using-the-factor-theorem",
            "multiplicities-of-the-roots-of-polynomials",
            "the-remainder-theorem",
            "the-rational-roots-theorem",
            "closure-properties-of-polynomials",
          ],
        },
      ],
    },
    {
      title: t("Number Systems", "数系"),
      modules: [
        {
          title: t("The Number System", "数系"),
          topics: ["the-real-number-system", "sums-and-products-of-rational-and-irrational-numbers"],
        },
        {
          title: t("Introduction to Complex Numbers", "复数入门"),
          topics: [
            "imaginary-numbers",
            "quadratic-equations-with-purely-imaginary-solutions",
            "complex-numbers",
            "adding-and-subtracting-complex-numbers",
            "multiplying-complex-numbers",
            "solving-quadratic-equations-with-complex-roots",
            "cyclic-property-of-the-imaginary-unit",
          ],
        },
        {
          title: t("The Complex Plane", "复平面"),
          topics: ["the-complex-plane", "the-magnitude-of-a-complex-number", "the-argument-of-a-complex-number"],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Functions", "函数"),
          topics: [
            "arithmetic-of-functions",
            "function-composition",
            "describing-function-composition",
            "local-extrema",
            "one-to-one-functions",
            "introduction-to-inverse-functions",
            "graphs-of-inverse-functions",
            "domain-and-range-of-inverse-functions",
            "calculating-the-inverse-of-a-function",
            "invertible-functions",
            "inverses-of-quadratic-functions",
            "plotting-x-as-a-function-of-y",
            "periodic-functions",
            "even-and-odd-functions",
            "unbounded-behavior-of-functions-near-a-point",
          ],
        },
        {
          title: t("Graph Transformations of Functions", "函数的图像变换"),
          topics: [
            "vertical-translations-of-functions",
            "horizontal-translations-of-functions",
            "vertical-stretches-of-functions",
            "horizontal-stretches-of-functions",
            "vertical-reflections-of-functions",
            "horizontal-reflections-of-functions",
            "combining-graph-transformations-two-operations",
            "combining-graph-transformations-three-or-more-operations",
            "constructing-functions-using-transformations",
            "combining-reflections-with-other-graph-transformations",
            "finding-points-on-transformed-curves",
            "the-domain-and-range-of-transformed-functions",
          ],
        },
        {
          title: t("Graphs of Polynomials", "多项式图像"),
          topics: [
            "graphing-elementary-cubic-functions",
            "end-behavior-of-polynomials",
            "graphing-cubic-curves-containing-three-distinct-real-roots",
            "graphing-cubic-curves-containing-a-double-root",
            "graphing-cubic-curves-containing-one-distinct-real-root",
            "graphing-general-polynomials",
          ],
        },
      ],
    },
    {
      title: t("Exponentials & Logarithms", "指数与对数"),
      modules: [
        {
          title: t("Introduction to Logarithms", "对数入门"),
          topics: [
            "converting-between-exponential-and-logarithmic-form",
            "evaluating-logarithms",
            "natural-logarithm",
            "common-logarithm",
            "simplifying-logarithmic-expressions",
          ],
        },
        {
          title: t("The Laws of Logarithms", "对数运算法则"),
          topics: [
            "product-rule-for-logarithms",
            "quotient-rule-for-logarithms",
            "power-rule-for-logarithms",
            "combining-laws-of-logarithms",
            "change-of-base-formula",
          ],
        },
        {
          title: t("Exponential Equations", "指数方程"),
          topics: [
            "solving-exponential-equations-using-logarithms",
            "solving-equations-containing-the-exponential-function",
            "solving-exponential-equations",
            "solving-exponential-equations-with-different-bases-using-logarithms",
            "solving-exponential-equations-using-the-zero-product-property",
          ],
        },
        {
          title: t("Logarithmic Equations", "对数方程"),
          topics: [
            "solving-logarithmic-equations",
            "solving-logarithmic-equations-containing-the-natural-logarithm",
            "solving-logarithmic-equations-using-the-laws-of-logarithms",
            "solving-logarithmic-equations-by-combining-the-laws-of-logarithms",
            "solving-logarithmic-equations-with-logarithms-on-both-sides",
          ],
        },
        {
          title: t("Graphs of Exponential Functions", "指数函数图象"),
          topics: [
            "vertical-translations-of-exponential-growth-functions",
            "vertical-translations-of-exponential-decay-functions",
            "vertical-reflections-of-exponential-functions",
            "combining-graph-transformations-of-exponential-functions",
            "properties-of-transformed-exponential-functions",
          ],
        },
        {
          title: t("Graphs of Logarithmic Functions", "对数函数图象"),
          topics: [
            "graphing-logarithmic-functions",
            "combining-graph-transformations-of-logarithmic-functions",
            "properties-of-transformed-logarithmic-functions",
            "inverses-of-exponential-and-logarithmic-functions",
          ],
        },
      ],
    },
    {
      title: t("Radical & Rational Functions", "根式与有理函数"),
      modules: [
        {
          title: t("Rational Expressions", "分式"),
          topics: [
            "simplifying-rational-expressions-using-polynomial-factorization",
            "adding-and-subtracting-rational-expressions",
            "adding-rational-expressions-with-unlike-denominators",
            "multiplying-rational-expressions",
            "dividing-rational-expressions",
            "expressing-rational-functions-as-sums-of-partial-fractions",
          ],
        },
        {
          title: t("Rational Equations", "分式方程"),
          topics: ["rational-equations-with-three-terms", "advanced-rational-equations"],
        },
        {
          title: t("Rational Functions", "有理函数"),
          topics: [
            "graphing-reciprocal-functions",
            "graph-transformations-of-reciprocal-functions",
            "combining-graph-transformations-of-reciprocal-functions",
            "domain-and-range-of-transformed-reciprocal-functions",
            "inverses-of-reciprocal-functions",
            "finding-intersections-of-lines-and-reciprocal-functions",
            "roots-of-rational-functions",
            "vertical-asymptotes-of-rational-functions",
            "horizontal-asymptotes-of-rational-functions",
          ],
        },
        {
          title: t("Radical Expressions", "根式"),
          topics: ["rationalizing-algebraic-denominators", "rationalizing-two-term-denominators", "further-rationalizing-denominators"],
        },
        {
          title: t("Radical Functions", "根式函数"),
          topics: [
            "solving-radical-equations",
            "graphing-the-square-root-function",
            "graph-transformations-of-square-root-functions",
            "graphing-the-cube-root-function",
            "properties-of-transformed-square-root-functions",
            "the-domain-of-a-transformed-radical-function",
            "the-range-of-a-transformed-radical-function",
            "inverses-of-radical-functions",
            "roots-of-transformed-radical-functions",
          ],
        },
      ],
    },
    {
      title: t("Sequences", "数列"),
      modules: [
        {
          title: t("Introduction to Sequences", "数列入门"),
          topics: [
            "introduction-to-sequences",
            "recursive-sequences",
            "fibonacci-sequences",
            "sigma-notation",
            "properties-of-finite-series",
          ],
        },
        {
          title: t("Arithmetic Sequences", "等差数列"),
          topics: [
            "arithmetic-sequences",
            "recursive-formulas-for-arithmetic-sequences",
            "nth-term-of-an-arithmetic-sequence",
            "explicit-and-recursive-arithmetic-formulas",
            "finding-the-common-difference-of-an-arithmetic-sequence",
            "arithmetic-sequences-from-two-terms",
            "index-of-a-term-in-an-arithmetic-sequence",
          ],
        },
        {
          title: t("Geometric Sequences", "等比数列"),
          topics: [
            "geometric-sequences",
            "nth-term-of-a-geometric-sequence",
            "recursive-formulas-for-geometric-sequences",
            "geometric-sequences-from-two-terms",
            "index-of-a-term-in-a-geometric-sequence",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "finding-equations-of-parallel-lines",
            "perpendicular-lines-in-the-coordinate-plane",
            "finding-equations-of-perpendicular-lines",
            "midpoints-in-the-coordinate-plane",
            "the-distance-formula",
            "the-shortest-distance-between-a-point-and-a-line",
            "the-distance-formula-in-three-dimensions",
          ],
        },
        {
          title: t("Geometric Transformations", "几何变换"),
          topics: [
            "translations-of-geometric-figures",
            "rotations-of-geometric-figures",
            "rotation-rules-in-the-coordinate-plane",
            "reflections-in-the-coordinate-plane",
            "reflections-across-arbitrary-lines",
            "dilations-of-geometric-figures",
            "dilations-of-figures-in-the-coordinate-plane",
            "stretches-of-geometric-figures",
            "combining-stretches-of-geometric-figures",
            "combining-geometric-transformations",
            "rigid-motions-and-congruence",
            "similarity-and-similar-polygons",
            "similarity-transformations",
            "reflective-symmetry",
            "rotational-symmetry",
          ],
        },
        {
          title: t("Solid Geometry", "立体几何"),
          topics: [
            "identifying-three-dimensional-shapes",
            "faces-vertices-and-edges-of-polyhedrons",
            "nets-of-polyhedrons",
            "finding-surface-areas-using-nets",
            "volumes-of-cubes",
            "volumes-of-rectangular-solids",
            "surface-areas-of-cubes",
            "volumes-of-cylinders",
            "volumes-of-spheres",
            "surface-areas-of-spheres",
            "surface-areas-of-cylinders",
            "eulers-formula-for-polyhedra",
            "the-five-platonic-solids",
          ],
        },
      ],
    },
    {
      title: t("Trigonometry", "三角学"),
      modules: [
        {
          title: t("Introduction to Trigonometry", "三角学入门"),
          topics: [
            "angles-and-sides-in-right-triangles",
            "the-trigonometric-ratios",
            "calculating-trigonometric-ratios-using-the-pythagorean-theorem",
            "calculating-side-lengths-of-right-triangles-using-trigonometry",
            "calculating-angles-in-right-triangles-using-trigonometry",
            "the-reciprocal-trigonometric-ratios",
            "trigonometric-functions-of-complementary-angles",
            "special-trigonometric-ratios",
            "calculating-areas-of-right-triangles-using-trigonometry",
            "introduction-to-radians",
            "trigonometric-ratios-with-radians",
          ],
        },
        {
          title: t("Trigonometry with General Triangles", "任意三角形中的三角学"),
          topics: ["the-law-of-sines", "the-law-of-cosines", "the-area-of-a-general-triangle"],
        },
        {
          title: t("The Unit Circle", "单位圆"),
          topics: [
            "angles-in-the-coordinate-plane",
            "negative-angles-in-the-coordinate-plane",
            "coterminal-angles",
            "calculating-reference-angles",
            "properties-of-the-unit-circle-in-the-first-quadrant",
            "extending-the-trigonometric-ratios-using-the-unit-circle",
            "extending-the-trigonometric-ratios-using-angles-in-radians",
            "extending-the-trigonometric-ratios-to-negative-angles",
            "extending-the-trigonometric-ratios-to-large-angles",
            "using-the-pythagorean-identity-in-the-first-quadrant",
            "extending-the-pythagorean-identity-to-all-quadrants",
          ],
        },
        {
          title: t("Special Trigonometric Ratios", "特殊角三角比"),
          topics: [
            "finding-trigonometric-ratios-of-quadrantal-angles",
            "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range",
            "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
            "evaluating-trigonometric-expressions",
            "further-extensions-of-the-special-trigonometric-ratios",
          ],
        },
        {
          title: t("Graphing Trigonometric Functions", "绘制三角函数图象"),
          topics: ["graphing-sine-and-cosine", "graphing-tangent-and-cotangent", "graphing-secant-and-cosecant"],
        },
        {
          title: t("Properties of Trigonometric Functions", "三角函数的性质"),
          topics: [
            "describing-properties-of-the-sine-function",
            "describing-properties-of-the-cosine-function",
            "describing-properties-of-the-tangent-function",
            "describing-properties-of-the-secant-function",
            "describing-properties-of-the-cosecant-function",
            "describing-properties-of-the-cotangent-function",
          ],
        },
        {
          title: t("Graph Transformations of Trigonometric Functions", "三角函数的图象变换"),
          topics: [
            "vertical-translations-of-trigonometric-functions",
            "vertical-stretches-of-trigonometric-functions",
            "horizontal-translations-of-trigonometric-functions",
            "horizontal-stretches-of-trigonometric-functions",
            "combining-graph-transformations-of-sine-and-cosine",
            "graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-secant-and-cosecant",
            "graphing-reflections-of-trigonometric-functions",
          ],
        },
        {
          title: t("Properties of Transformed Trigonometric Functions", "变换后三角函数的性质"),
          topics: [
            "properties-of-transformed-sine-and-cosine-functions",
            "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions",
            "properties-of-transformed-tangent-and-cotangent-functions",
            "properties-of-transformed-secant-and-cosecant-functions",
          ],
        },
      ],
    },
    {
      title: t("Limits & Continuity", "极限与连续性"),
      modules: [
        {
          title: t("Estimating Limits from Graphs", "由图象估计极限"),
          topics: [
            "the-finite-limit-of-a-function",
            "the-left-and-right-sided-limits-of-a-function",
            "finding-the-existence-of-a-limit-using-one-sided-limits",
            "limits-at-infinity-from-graphs",
            "infinite-limits-from-graphs",
          ],
        },
        {
          title: t("The Algebra of Limits", "极限的代数运算法则"),
          topics: [
            "limits-of-power-functions-and-the-constant-rule-for-limits",
            "the-sum-rule-for-limits",
            "the-product-and-quotient-rules-for-limits",
            "the-power-and-root-rules-for-limits",
          ],
        },
        {
          title: t("Limits of Functions", "函数的极限"),
          topics: [
            "limits-at-infinity-of-polynomials",
            "limits-of-reciprocal-functions",
            "limits-of-exponential-functions",
            "limits-of-logarithmic-functions",
            "limits-of-radical-functions",
            "limits-of-trigonometric-functions",
            "limits-of-reciprocal-trigonometric-functions",
            "limits-of-piecewise-functions",
            "calculating-limits-of-rational-functions-by-factoring",
          ],
        },
        {
          title: t("Continuity", "连续性"),
          topics: [
            "determining-continuity-from-graphs",
            "defining-continuity-at-a-point",
            "left-and-right-continuity",
            "continuity-over-an-interval",
          ],
        },
      ],
    },
    {
      title: t("Introduction to Calculus", "微积分入门"),
      modules: [
        {
          title: t("Introduction to Differentiation", "微分入门"),
          topics: [
            "the-average-rate-of-change-of-a-function",
            "the-average-rate-of-change-of-a-function-over-a-varying-interval",
            "the-instantaneous-rate-of-change-of-a-function-at-a-point",
            "defining-the-derivative-using-derivative-notation",
            "the-power-rule-for-differentiation",
            "the-sum-and-constant-multiple-rules-for-differentiation",
            "calculating-the-slope-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-tangent-line-using-differentiation",
            "calculating-the-equation-of-a-normal-line-using-differentiation",
          ],
        },
        {
          title: t("Derivatives of Functions and the Rules of Differentiation", "函数的导数与求导法则"),
          topics: [
            "differentiating-exponential-functions",
            "differentiating-logarithmic-functions",
            "differentiating-trigonometric-functions",
            "second-and-higher-order-derivatives",
            "the-product-rule-for-differentiation",
            "the-quotient-rule-for-differentiation",
            "calculating-derivatives-from-data-and-tables",
            "calculating-derivatives-from-graphs",
            "differentiating-reciprocal-trigonometric-functions",
          ],
        },
        {
          title: t("Differentiating Composite Functions", "复合函数求导"),
          topics: [
            "the-chain-rule-for-differentiation",
            "the-chain-rule-with-exponential-functions",
            "the-chain-rule-with-logarithmic-functions",
            "the-chain-rule-with-trigonometric-functions",
            "selecting-procedures-for-calculating-derivatives",
            "interpreting-the-meaning-of-the-derivative-in-context",
          ],
        },
        {
          title: t("Indefinite Integrals", "不定积分"),
          topics: [
            "the-antiderivative",
            "the-constant-multiple-rule-for-indefinite-integrals",
            "the-sum-rule-for-indefinite-integrals",
            "integrating-the-reciprocal-function",
            "integrating-exponential-functions",
            "integrating-trigonometric-functions",
          ],
        },
      ],
    },
    {
      title: t("Statistics", "统计"),
      modules: [
        {
          title: t("Analyzing Data", "数据分析"),
          topics: [
            "mean-of-a-data-set",
            "variance-and-standard-deviation",
            "estimating-means-and-variances-for-grouped-data",
            "the-z-score",
          ],
        },
        {
          title: t("Correlation and Regression", "相关与回归"),
          topics: [
            "scatter-plots",
            "trend-lines",
            "predictions-with-trend-lines",
            "linear-correlation",
            "residuals-and-residual-plots",
            "selecting-a-regression-model",
            "covariance",
            "sums-of-squares",
            "the-linear-correlation-coefficient",
            "linear-regression",
          ],
        },
      ],
    },
    {
      title: t("Probability & Combinatorics", "概率与组合"),
      modules: [
        {
          title: t("Introduction to Probability", "概率入门"),
          topics: [
            "sets",
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "the-complement-of-an-event",
            "venn-diagrams-in-probability",
          ],
        },
        {
          title: t("Compound Events in Probability", "复合事件概率"),
          topics: [
            "the-union-of-sets",
            "the-intersection-of-sets",
            "compound-events-in-probability-from-experimental-data",
            "computing-probabilities-for-compound-events-using-venn-diagrams",
            "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
          ],
        },
        {
          title: t("Combinatorics", "排列组合"),
          topics: [
            "the-rules-of-sum-and-product",
            "factorials",
            "factorials-in-variable-expressions",
            "ordering-objects",
            "permutations",
            "combinations",
            "computing-probabilities-using-combinatorics",
          ],
        },
      ],
    },
  ],
};

/** mathematicalFoundationsIII is the Mathematical Foundations III course. */
export const mathematicalFoundationsIII: CourseDef = {
  id: "mathematical-foundations-iii",
  title: t("Mathematical Foundations III", "数学基础 III"),
  description: t(
    "Mathematical Foundations III develops advanced mathematical maturity through sequences and series, inequalities, parametric and polar coordinates, conic sections, advanced trigonometry, complex numbers, differential and integral calculus, differential equations, vectors, linear algebra, and probability.",
    "数学基础 III 通过数列与级数、不等式、参数方程与极坐标、圆锥曲线、进阶三角学、复数、微分与积分微积分、微分方程、向量、线性代数和概率培养高阶数学素养。",
  ),
  units: [
    {
      title: t("Conic Sections", "圆锥曲线"),
      modules: [
        {
          title: t("Circles", "圆"),
          topics: [
            "circles-in-the-coordinate-plane",
            "equations-of-circles-centered-at-the-origin",
            "equations-of-circles",
            "determining-circle-properties-by-completing-the-square",
            "calculating-circle-intercepts",
            "intersections-of-circles-with-lines",
          ],
        },
        {
          title: t("Parabolas", "抛物线"),
          topics: [
            "upward-and-downward-opening-parabolas",
            "left-and-right-opening-parabolas",
            "the-vertex-of-a-parabola",
            "calculating-the-vertex-of-a-parabola-by-completing-the-square",
            "calculating-intercepts-of-parabolas",
          ],
        },
        {
          title: t("Ellipses", "椭圆"),
          topics: [
            "introduction-to-ellipses",
            "equations-of-ellipses-centered-at-the-origin",
            "equations-of-ellipses-centered-at-a-general-point",
            "finding-the-center-and-axes-of-ellipses-by-completing-the-square",
            "finding-intercepts-of-ellipses",
          ],
        },
        {
          title: t("Hyperbolas", "双曲线"),
          topics: [
            "equations-of-hyperbolas-centered-at-the-origin",
            "equations-of-hyperbolas-centered-at-a-general-point",
            "asymptotes-of-hyperbolas-centered-at-the-origin",
            "asymptotes-of-hyperbolas-centered-at-a-general-point",
            "finding-intercepts-and-intersections-of-hyperbolas",
          ],
        },
      ],
    },
    {
      title: t("Parametric & Polar Coordinates", "参数方程与极坐标"),
      modules: [
        {
          title: t("Parametric Equations", "参数方程"),
          topics: [
            "graphing-curves-defined-parametrically",
            "cartesian-equations-of-parametric-curves",
            "finding-intersections-of-parametric-curves-and-lines",
            "differentiating-parametric-curves",
            "calculating-tangent-and-normal-lines-with-parametric-equations",
            "second-derivatives-of-parametric-equations",
            "parametric-equations-of-circles",
            "parametric-equations-of-ellipses",
            "parametric-equations-of-parabolas",
            "parametric-equations-of-parabolas-centered-at-hk",
            "parametric-equations-of-horizontal-hyperbolas",
            "parametric-equations-of-vertical-hyperbolas",
          ],
        },
        {
          title: t("Polar Coordinates", "极坐标"),
          topics: [
            "introduction-to-polar-coordinates",
            "converting-from-polar-coordinates-to-cartesian-coordinates",
            "polar-equations-of-circles-centered-at-the-origin",
            "polar-equations-of-radial-lines",
            "differentiating-curves-given-in-polar-form",
            "further-differentiation-of-curves-given-in-polar-form",
          ],
        },
      ],
    },
    {
      title: t("Trigonometry", "三角学"),
      modules: [
        {
          title: t("The Inverse Trigonometric Functions", "反三角函数"),
          topics: [
            "graphing-the-inverse-sine-function",
            "graphing-the-inverse-cosine-function",
            "graphing-the-inverse-tangent-function",
            "evaluating-expressions-containing-inverse-trigonometric-functions",
            "limits-of-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Trigonometric Identities", "三角恒等式"),
          topics: [
            "simplifying-expressions-using-basic-trigonometric-identities",
            "simplifying-expressions-using-the-pythagorean-identity",
            "alternate-forms-of-the-pythagorean-identity",
            "simplifying-expressions-using-the-secant-tangent-identity",
            "alternate-forms-of-the-secant-tangent-identity",
            "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity",
          ],
        },
        {
          title: t("The Sum and Difference Formulas", "和差角公式"),
          topics: [
            "the-sum-and-difference-formulas-for-sine",
            "the-sum-and-difference-formulas-for-cosine",
            "writing-sums-of-trigonometric-functions-in-amplitude-phase-form",
            "the-double-angle-formula-for-sine",
            "the-double-angle-formula-for-cosine",
          ],
        },
        {
          title: t("Elementary Trigonometric Equations", "初等三角方程"),
          topics: [
            "elementary-trigonometric-equations-containing-sine",
            "elementary-trigonometric-equations-containing-cosine",
            "elementary-trigonometric-equations-containing-tangent",
            "elementary-trigonometric-equations-containing-secant",
            "elementary-trigonometric-equations-containing-cosecant",
            "elementary-trigonometric-equations-containing-cotangent",
            "solving-trigonometric-equations-using-the-sin-cos-tan-identity",
            "general-solutions-of-elementary-trigonometric-equations",
            "general-solutions-of-trigonometric-equations-with-transformed-functions",
            "trigonometric-equations-containing-transformed-tangent-functions",
          ],
        },
      ],
    },
    {
      title: t("Complex Numbers", "复数"),
      modules: [
        {
          title: t("Further Complex Numbers", "复数进阶"),
          topics: [
            "the-complex-conjugate",
            "special-properties-of-the-complex-conjugate",
            "the-complex-conjugate-and-the-roots-of-a-quadratic-equation",
            "dividing-complex-numbers",
            "solving-equations-by-equating-real-and-imaginary-parts",
            "extending-polynomial-identities-to-the-complex-numbers",
          ],
        },
        {
          title: t("Euler's Formula", "欧拉公式"),
          topics: [
            "the-polar-form-of-a-complex-number",
            "de-moivres-theorem",
            "eulers-formula",
            "the-roots-of-unity",
            "properties-of-roots-of-unity",
          ],
        },
        {
          title: t("The Fundamental Theorem of Algebra", "代数基本定理"),
          topics: [
            "the-fundamental-theorem-of-algebra-for-quadratic-equations",
            "the-fundamental-theorem-of-algebra-with-cubic-equations",
            "solving-cubic-equations-with-complex-roots",
            "the-fundamental-theorem-of-algebra-with-quartic-equations",
            "solving-quartic-equations-with-complex-roots",
          ],
        },
      ],
    },
    {
      title: t("Vectors", "向量"),
      modules: [
        {
          title: t("Vectors in 3D Cartesian Coordinates", "三维笛卡尔坐标系中的向量"),
          topics: [
            "three-dimensional-vectors-in-component-form",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-3d",
            "calculating-the-magnitude-of-cartesian-vectors-in-3d",
          ],
        },
        {
          title: t("The Dot Product", "点积"),
          topics: [
            "calculating-the-dot-product-using-angle-and-magnitude",
            "calculating-the-dot-product-using-components",
            "the-angle-between-two-vectors",
            "calculating-a-scalar-projection",
            "calculating-a-vector-projection",
          ],
        },
        {
          title: t("The Cross Product", "叉积"),
          topics: [
            "the-cross-product-of-two-vectors",
            "properties-of-the-cross-product",
            "calculating-the-cross-product-using-determinants",
            "finding-areas-using-the-cross-product",
            "the-scalar-triple-product",
            "volumes-of-parallelepipeds",
          ],
        },
      ],
    },
    {
      title: t("Linear Algebra", "线性代数"),
      modules: [
        {
          title: t("Introduction to Matrices", "矩阵入门"),
          topics: [
            "introduction-to-matrices",
            "index-notation-for-matrices",
            "adding-and-subtracting-matrices",
            "properties-of-matrix-addition",
            "scalar-multiplication-of-matrices",
            "zero-square-diagonal-and-identity-matrices",
            "the-transpose-of-a-matrix",
          ],
        },
        {
          title: t("Matrix Multiplication", "矩阵乘法"),
          topics: [
            "multiplying-a-matrix-by-a-column-vector",
            "multiplying-square-matrices",
            "conformability-for-matrix-multiplication",
            "multiplying-matrices",
            "powers-of-matrices",
            "multiplying-a-matrix-by-the-identity-matrix",
            "properties-of-matrix-multiplication",
            "representing-2x2-systems-of-equations-using-a-matrix-product",
            "representing-3x3-systems-of-equations-using-a-matrix-product",
          ],
        },
        {
          title: t("Determinants", "行列式"),
          topics: [
            "the-determinant-of-a-2x2-matrix",
            "the-geometric-interpretation-of-the-2x2-determinant",
            "the-minors-of-a-3x3-matrix",
            "the-determinant-of-a-3x3-matrix",
          ],
        },
        {
          title: t("The Inverse of a Matrix", "逆矩阵"),
          topics: [
            "introduction-to-the-inverse-of-a-matrix",
            "inverses-of-2x2-matrices",
            "calculating-the-inverse-of-a-3x3-matrix-using-the-cofactor-method",
            "solving-2x2-systems-of-equations-using-inverse-matrices",
            "solving-systems-of-equations-using-inverse-matrices",
          ],
        },
        {
          title: t("Linear Transformations", "线性变换"),
          topics: [
            "introduction-to-linear-transformations",
            "the-standard-matrix-of-a-linear-transformation",
            "linear-transformations-of-points-and-lines-in-the-plane",
            "linear-transformations-of-objects-in-the-plane",
            "dilations-and-reflections-as-linear-transformations",
            "shear-and-stretch-as-linear-transformations",
            "right-angle-rotations-as-linear-transformations",
            "rotations-as-linear-transformations",
            "combining-linear-transformations-using-2x2-matrices",
            "inverting-linear-transformations",
            "area-scale-factors-of-linear-transformations",
            "singular-linear-transformations-in-the-plane",
          ],
        },
      ],
    },
    {
      title: t("Limits & Continuity", "极限与连续性"),
      modules: [
        {
          title: t("Limits", "极限"),
          topics: [
            "lhopitals-rule",
            "special-limits-involving-sine",
            "limits-involving-the-exponential-function",
            "vertical-asymptotes-of-rational-functions",
            "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
            "calculating-limits-of-radical-functions-using-conjugate-multiplication",
            "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
          ],
        },
        {
          title: t("Continuity", "连续性"),
          topics: ["continuity-of-functions", "the-intermediate-value-theorem"],
        },
      ],
    },
    {
      title: t("Inequalities", "不等式"),
      modules: [
        {
          title: t("Single-Variable Inequalities", "一元不等式"),
          topics: [
            "solving-elementary-quadratic-inequalities",
            "solving-quadratic-inequalities-from-graphs",
            "solving-quadratic-inequalities-using-the-graphical-method",
            "solving-quadratic-inequalities-using-the-sign-table-method",
            "inequalities-involving-powers-of-binomials",
            "solving-polynomial-inequalities-using-a-graphical-method",
            "solving-polynomial-inequalities-using-the-sign-table-method",
            "solving-inequalities-involving-positive-and-negative-factors",
            "solving-rational-inequalities",
            "solving-radical-inequalities",
            "solving-inequalities-involving-exponential-functions",
            "solving-inequalities-involving-exponential-functions-and-polynomials",
            "solving-inequalities-involving-logarithmic-functions",
            "solving-inequalities-involving-geometric-sequences",
          ],
        },
        {
          title: t("Two-Variable Inequalities", "二元不等式"),
          topics: [
            "graphing-strict-linear-inequalities",
            "graphing-non-strict-linear-inequalities",
            "further-graphing-linear-inequalities",
            "systems-of-linear-inequalities",
            "solving-two-variable-nonlinear-inequalities",
            "further-solving-of-two-variable-nonlinear-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Differentiation", "微分"),
      modules: [
        {
          title: t("Differentiating Implicit and Inverse Functions", "隐函数与反函数求导"),
          topics: [
            "implicit-differentiation",
            "calculating-slopes-of-circles-ellipses-and-parabolas",
            "calculating-dy-dx-using-dx-dy",
            "differentiating-inverse-functions",
            "differentiating-an-inverse-function-at-a-point",
            "differentiating-inverse-trigonometric-functions",
            "differentiating-inverse-reciprocal-trigonometric-functions",
            "integration-using-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Analytical Applications of Differentiation", "导数的分析应用"),
          topics: [
            "continuity-and-differentiability-of-functions",
            "the-mean-value-theorem",
            "global-vs-local-extrema-and-critical-points",
            "the-extreme-value-theorem",
            "using-differentiation-to-calculate-critical-points",
            "determining-intervals-on-which-a-function-is-increasing-or-decreasing",
            "using-the-first-derivative-test-to-classify-local-extrema",
            "the-candidates-test",
            "intervals-of-concavity",
            "relating-concavity-to-the-second-derivative",
            "points-of-inflection",
            "the-second-derivative-test",
            "approximating-functions-using-local-linearity-and-linearization",
          ],
        },
        {
          title: t("Estimating Derivatives", "估计导数"),
          topics: [
            "estimating-derivatives-using-a-forward-difference-quotient",
            "estimating-derivatives-using-a-backward-difference-quotient",
            "estimating-derivatives-using-a-central-difference-quotient",
          ],
        },
        {
          title: t("Taylor Series", "泰勒级数"),
          topics: [
            "second-degree-taylor-polynomials",
            "analyzing-second-degree-taylor-polynomials",
            "third-degree-taylor-polynomials",
            "higher-degree-taylor-polynomials",
            "maclaurin-series",
            "taylor-series",
            "representing-functions-as-power-series",
            "recognizing-standard-maclaurin-series",
          ],
        },
      ],
    },
    {
      title: t("Definite Integrals", "定积分"),
      modules: [
        {
          title: t("Approximating Areas with Riemann Sums", "用黎曼和近似面积"),
          topics: [
            "approximating-areas-with-the-left-riemann-sum",
            "approximating-areas-with-the-right-riemann-sum",
            "left-and-right-riemann-sums-in-sigma-notation",
            "approximating-areas-with-the-trapezoidal-rule",
          ],
        },
        {
          title: t("Definite Integrals", "定积分"),
          topics: [
            "defining-definite-integrals-using-left-and-right-riemann-sums",
            "the-fundamental-theorem-of-calculus",
            "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
            "the-sum-and-constant-multiple-rules-for-definite-integrals",
            "properties-of-definite-integrals-involving-the-limits-of-integration",
          ],
        },
        {
          title: t("The Area Under a Curve", "曲线下方区域的面积"),
          topics: [
            "the-area-bounded-by-a-curve-and-the-x-axis",
            "the-area-bounded-by-a-curve-and-the-y-axis",
            "evaluating-definite-integrals-using-symmetry",
            "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
            "calculating-the-definite-integral-of-a-function-given-its-graph",
            "definite-integrals-of-piecewise-functions",
          ],
        },
        {
          title: t("Accumulation Functions", "累积函数"),
          topics: ["the-integral-as-an-accumulation-function", "the-second-fundamental-theorem-of-calculus"],
        },
      ],
    },
    {
      title: t("Integration Techniques", "积分技巧"),
      modules: [
        {
          title: t("Integration Using Substitution", "换元积分法"),
          topics: [
            "integrating-algebraic-functions-using-substitution",
            "integrating-linear-rational-functions-using-substitution",
            "integration-using-substitution",
            "calculating-definite-integrals-using-substitution",
            "further-integration-of-algebraic-functions-using-substitution",
            "integrating-exponential-functions-using-linear-substitution",
            "integrating-exponential-functions-using-substitution",
            "integrating-trigonometric-functions-using-substitution",
            "integrating-logarithmic-functions-using-substitution",
            "integration-by-substitution-with-inverse-trigonometric-functions",
          ],
        },
        {
          title: t("Integration Using Trigonometric Identities", "利用三角恒等式积分"),
          topics: [
            "integration-using-basic-trigonometric-identities",
            "integration-using-the-pythagorean-identities",
            "integration-using-the-double-angle-formulas",
          ],
        },
        {
          title: t("Special Techniques for Integration", "特殊积分技巧"),
          topics: ["integrating-functions-using-polynomial-division", "integrating-functions-by-completing-the-square"],
        },
        {
          title: t("Integration by Parts", "分部积分法"),
          topics: [
            "introduction-to-integration-by-parts",
            "using-integration-by-parts-to-calculate-integrals-with-logarithms",
            "applying-the-integration-by-parts-twice",
            "integration-by-parts-in-cyclic-cases",
          ],
        },
        {
          title: t("Integration Using Partial Fractions", "部分分式积分法"),
          topics: [
            "expressing-rational-functions-as-sums-of-partial-fractions",
            "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions",
            "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions",
            "integrating-rational-functions-using-partial-fractions",
            "integrating-rational-functions-with-repeated-factors",
            "integrating-rational-functions-with-irreducible-quadratic-factors",
          ],
        },
        {
          title: t("Improper Integrals", "反常积分"),
          topics: [
            "improper-integrals",
            "improper-integrals-involving-exponential-functions",
            "improper-integrals-involving-arctangent",
            "improper-integrals-over-the-real-line",
            "improper-integrals-of-the-second-kind",
          ],
        },
      ],
    },
    {
      title: t("Applications of Integration", "积分的应用"),
      modules: [
        {
          title: t("Applications of Integration", "积分的应用"),
          topics: [
            "the-average-value-of-a-function",
            "the-area-between-curves-expressed-as-functions-of-x",
            "the-arc-length-of-a-planar-curve",
            "the-arc-length-of-a-parametric-curve",
            "finding-the-area-of-a-polar-region",
            "the-arc-length-of-a-polar-curve",
          ],
        },
      ],
    },
    {
      title: t("Contextual Applications of Calculus", "微积分的情境应用"),
      modules: [
        {
          title: t("Related Rates and Optimization", "相关变化率与最优化"),
          topics: [
            "rates-of-change-in-applied-contexts",
            "introduction-to-related-rates",
            "related-rates-with-implicit-functions",
            "calculating-related-rates-with-circles-and-spheres",
            "calculating-related-rates-using-the-pythagorean-theorem",
            "solving-optimization-problems-using-derivatives",
            "optimizing-distances",
            "optimizing-distances-to-curves",
          ],
        },
        {
          title: t("Displacement, Velocity, and Acceleration", "位移、速度与加速度"),
          topics: [
            "calculating-velocity-for-straight-line-motion-using-differentiation",
            "calculating-acceleration-for-straight-line-motion-using-differentiation",
            "determining-characteristics-of-moving-objects-using-differentiation",
            "calculating-velocity-using-integration",
            "determining-characteristics-of-moving-objects-using-integration",
            "calculating-the-position-function-of-a-particle-using-integration",
            "calculating-the-displacement-of-a-particle-using-integration",
          ],
        },
        {
          title: t("Vector-Valued Functions", "向量值函数"),
          topics: ["defining-vector-valued-functions", "differentiating-vector-valued-functions", "integrating-vector-valued-functions"],
        },
        {
          title: t("The Planar Motion of a Particle", "质点的平面运动"),
          topics: [
            "velocity-and-acceleration-for-plane-motion",
            "calculating-displacement-for-plane-motion",
            "calculating-velocity-for-plane-motion-using-differentiation",
            "calculating-acceleration-for-plane-motion-using-differentiation",
            "finding-velocity-vectors-in-two-dimensions-using-integration",
            "finding-displacement-vectors-in-two-dimensions-using-integration",
          ],
        },
      ],
    },
    {
      title: t("Sequences and Series", "数列与级数"),
      modules: [
        {
          title: t("The Binomial Theorem", "二项式定理"),
          topics: [
            "pascals-triangle-and-the-binomial-coefficients",
            "expanding-a-binomial-using-binomial-coefficients",
            "the-special-case-of-the-binomial-theorem",
            "approximating-values-using-the-binomial-theorem",
          ],
        },
        {
          title: t("Arithmetic Series", "等差数列求和"),
          topics: [
            "expressing-an-arithmetic-series-in-sigma-notation",
            "finding-the-sum-of-an-arithmetic-series",
            "finding-the-first-term-of-an-arithmetic-series",
            "calculating-the-number-of-terms-in-an-arithmetic-series",
          ],
        },
        {
          title: t("Finite Geometric Series", "有限等比数列求和"),
          topics: [
            "the-sum-of-a-finite-geometric-series",
            "the-sum-of-the-first-n-terms-of-a-geometric-series",
            "writing-geometric-series-in-sigma-notation",
            "sums-of-finite-geometric-series-given-in-sigma-notation",
          ],
        },
        {
          title: t("Infinite Series", "无穷级数"),
          topics: [
            "limits-of-sequences",
            "convergence-of-geometric-sequences",
            "further-convergence-of-geometric-sequences",
            "determining-limits-of-sequences-using-relative-magnitudes",
            "infinite-series-and-partial-sums",
            "convergent-and-divergent-infinite-series",
            "properties-of-infinite-series",
            "further-properties-of-infinite-series",
            "finding-the-sum-of-an-infinite-geometric-series",
            "writing-an-infinite-geometric-series-in-sigma-notation",
            "sums-of-infinite-geometric-series-given-in-sigma-notation",
            "convergence-of-geometric-series",
          ],
        },
      ],
    },
    {
      title: t("Differential Equations", "微分方程"),
      modules: [
        {
          title: t("Introduction to Differential Equations", "微分方程入门"),
          topics: [
            "introduction-to-differential-equations",
            "verifying-solutions-of-differential-equations",
            "solving-first-order-odes-using-direct-integration",
            "solving-first-order-odes-using-separation-of-variables",
            "solving-first-order-ivps-using-separation-of-variables",
            "qualitative-analysis-of-first-order-odes",
            "modeling-with-first-order-odes",
          ],
        },
        {
          title: t("Numerical Solutions of Differential Equations", "微分方程的数值解"),
          topics: ["eulers-method-calculating-one-step", "eulers-method-calculating-multiple-steps"],
        },
      ],
    },
    {
      title: t("Probability", "概率"),
      modules: [
        {
          title: t("Probability", "概率"),
          topics: [
            "conditional-probabilities-from-venn-diagrams",
            "the-multiplication-law-for-conditional-probability",
            "the-law-of-total-probability",
            "independent-events",
            "the-addition-law-of-probability",
            "applying-the-addition-law-with-event-complements",
            "mutually-exclusive-events",
          ],
        },
        {
          title: t("Discrete Random Variables", "离散型随机变量"),
          topics: [
            "probability-mass-functions-of-discrete-random-variables",
            "cumulative-distribution-functions-for-discrete-random-variables",
            "expected-values-of-discrete-random-variables",
            "the-binomial-distribution",
            "modeling-with-the-binomial-distribution",
            "the-geometric-distribution",
            "modeling-with-the-geometric-distribution",
          ],
        },
        {
          title: t("The Normal Distribution", "正态分布"),
          topics: [
            "the-standard-normal-distribution",
            "symmetry-properties-of-the-standard-normal-distribution",
            "the-normal-distribution",
            "mean-and-variance-of-the-normal-distribution",
            "percentage-points-of-the-standard-normal-distribution",
            "modeling-with-the-normal-distribution",
          ],
        },
      ],
    },
  ],
};

/** multivariableCalculus is the university Multivariable Calculus course. */
export const multivariableCalculus: CourseDef = {
  id: "multivariable-calculus",
  title: t("Multivariable Calculus", "多变量微积分"),
  description: t(
    "Differential, integral, and vector calculus in multiple dimensions: vector-valued functions, space curves, and vector fields; limits, continuity, partial derivatives, directional derivatives, gradients, tangent planes, and optimization; double and triple integrals in Cartesian, polar, cylindrical, and spherical coordinates; line and surface integrals, circulation, flux, Green's theorem, Stokes' theorem, and the Divergence theorem; and applications to mechanics, center of mass, moments of inertia, and multivariable probability distributions.",
    "多维空间中的微分、积分与向量微积分：向量值函数、空间曲线与向量场；极限、连续性、偏导数、方向导数、梯度、切平面与多元最优化；笛卡尔坐标、极坐标、柱坐标与球坐标下的二重与三重积分；第一型与第二型曲线和曲面积分、环量、通量、格林公式、斯托克斯公式与高斯散度定理；以及在力学、质心、转动惯量与多元概率分布中的应用。",
  ),
  units: [
    {
      title: t("Vector Functions and Vector Fields", "向量函数与向量场"),
      modules: [
        {
          title: t("Vector-Valued Functions", "向量值函数"),
          topics: [
            "defining-vector-valued-functions",
            "the-domain-of-a-vector-valued-function",
            "limits-of-vector-valued-functions",
            "continuity-and-differentiability-of-vector-valued-functions",
            "differentiation-rules-for-vector-valued-functions",
            "integration-rules-for-vector-valued-functions",
            "the-arc-length-of-a-vector-valued-function",
            "tangent-vectors-and-tangent-lines-to-curves",
            "unit-tangent-vectors",
            "principal-normal-vectors",
            "binormal-vectors",
            "the-osculating-plane",
            "parameterization-by-arc-length",
          ],
        },
        {
          title: t("Curvature", "曲率"),
          topics: [
            "introduction-to-curvature",
            "finding-curvature-using-the-cross-product",
            "radius-of-curvature",
            "the-curvature-of-a-plane-curve",
          ],
        },
        {
          title: t("Vector Fields", "向量场"),
          topics: [
            "vector-fields",
            "visualizing-vector-fields",
            "gradient-vector-fields",
            "conservative-vector-fields-in-the-cartesian-plane",
            "calculating-potential-functions",
            "connected-and-simply-connected-regions",
            "stream-functions",
          ],
        },
        {
          title: t("Divergence and Curl", "散度与旋度"),
          topics: [
            "the-divergence-of-a-vector-field",
            "properties-of-the-divergence-operator",
            "the-curl-of-a-vector-field",
            "properties-of-the-curl-operator",
          ],
        },
      ],
    },
    {
      title: t("Multivariable Functions", "多元函数"),
      modules: [
        {
          title: t("Introduction to Multivariable Functions", "多元函数概论"),
          topics: [
            "interior-and-boundary-points",
            "interiors-and-boundaries-of-sets",
            "open-and-closed-sets",
            "the-domain-of-a-multivariable-function",
            "level-curves",
            "level-surfaces",
            "limits-and-continuity-of-multivariable-functions",
          ],
        },
        {
          title: t("Quadric Surfaces and Cylinders", "二次曲面与柱面"),
          topics: [
            "ellipsoids",
            "hyperboloids",
            "paraboloids",
            "elliptic-cones",
            "cylinders",
            "intersections-of-lines-and-planes-with-surfaces",
            "identifying-quadric-surfaces",
          ],
        },
        {
          title: t("Partial Derivatives", "偏导数"),
          topics: [
            "introduction-to-partial-derivatives",
            "computing-partial-derivatives-using-the-rules-of-differentiation",
            "geometric-interpretations-of-partial-derivatives",
            "partial-differentiability-of-multivariable-functions",
            "higher-order-partial-derivatives",
            "equality-of-mixed-partial-derivatives",
            "tangent-planes-to-surfaces",
            "linearization-of-multivariable-functions",
            "differentiating-under-the-integral-sign",
          ],
        },
        {
          title: t("The Gradient Vector", "梯度向量"),
          topics: [
            "the-gradient-vector",
            "the-gradient-as-a-normal-vector",
            "tangent-lines-to-level-curves",
            "tangent-planes-to-level-surfaces",
            "directional-derivatives",
            "the-multivariable-mean-value-theorem",
          ],
        },
        {
          title: t("The Multivariable Chain Rule", "多元链式法则"),
          topics: [
            "the-multivariable-chain-rule",
            "the-multivariable-chain-rule-with-polar-coordinates",
            "the-multivariable-chain-rule-in-vector-form",
          ],
        },
        {
          title: t("Coordinate Transformations", "坐标变换与雅可比行列式"),
          topics: [
            "differentials",
            "affine-transformations",
            "the-image-of-an-affine-transformation",
            "the-inverse-of-an-affine-transformation",
            "nonlinear-transformations-of-plane-regions",
            "polar-coordinate-transformations",
            "transformations-of-regions-between-curves",
            "the-jacobian",
            "the-inverse-function-theorem",
          ],
        },
        {
          title: t("Taylor Polynomials and Higher Derivatives", "泰勒多项式与高阶导数"),
          topics: [
            "the-jacobian-of-a-three-dimensional-transformation",
            "the-derivative-of-a-multivariable-function",
            "the-second-derivative-of-a-multivariable-function",
            "second-degree-taylor-polynomials-of-multivariable-functions",
          ],
        },
        {
          title: t("Optimization", "最优化与拉格朗日乘数法"),
          topics: [
            "global-vs-local-extrema-and-critical-points-of-multivariable-functions",
            "the-second-partial-derivatives-test",
            "calculating-global-extrema-of-multivariable-functions",
            "lagrange-multipliers-with-one-constraint",
            "lagrange-multipliers-with-multiple-constraints",
            "optimizing-multivariable-functions-using-lagrange-multipliers",
            "newtons-method-for-multivariable-functions",
            "newtons-method-for-optimizing-multivariable-functions",
          ],
        },
      ],
    },
    {
      title: t("Multiple Integrals", "重积分"),
      modules: [
        {
          title: t("Riemann Sums", "黎曼和"),
          topics: [
            "double-summations",
            "partitions-of-intervals",
            "calculating-double-summations-over-partitions",
            "approximating-volumes-using-lower-riemann-sums",
            "approximating-volumes-using-upper-riemann-sums",
            "lower-riemann-sums-over-general-rectangular-partitions",
            "upper-riemann-sums-over-general-rectangular-partitions",
          ],
        },
        {
          title: t("Double Integrals", "二重积分"),
          topics: [
            "defining-double-integrals-using-lower-and-upper-riemann-sums",
            "double-integrals-over-rectangular-domains",
            "double-integrals-over-non-rectangular-domains",
            "properties-of-double-integrals",
            "type-i-and-ii-regions-in-two-dimensional-space",
            "double-integrals-over-type-i-regions",
            "double-integrals-over-type-ii-regions",
            "double-integrals-over-partitioned-regions",
            "changing-the-order-of-integration-in-double-integrals",
          ],
        },
        {
          title: t("Triple Integrals", "三重积分"),
          topics: [
            "repeated-integrals-in-three-dimensions",
            "triple-integrals-over-rectangular-domains",
            "type-i-ii-and-iii-regions-in-three-dimensional-space",
            "triple-integrals-over-type-i-regions",
            "triple-integrals-over-type-ii-regions",
            "triple-integrals-over-type-iii-regions",
            "calculating-volumes-of-solids-using-triple-integrals",
            "changing-the-order-of-integration-in-triple-integrals-changing-projection",
            "changing-the-order-of-integration-in-triple-integrals-changing-region",
          ],
        },
        {
          title: t("Double Integrals in Polar Coordinates", "极坐标二重积分与变量替换"),
          topics: [
            "double-integrals-in-plane-polar-coordinates",
            "double-integrals-between-polar-curves",
            "computing-areas-using-a-change-of-variables",
            "computing-double-integrals-using-a-change-of-variables",
          ],
        },
        {
          title: t("Cylindrical and Spherical Coordinates", "柱坐标与球坐标"),
          topics: [
            "cylindrical-polar-coordinates",
            "surfaces-in-cylindrical-polar-coordinates",
            "triple-integrals-in-cylindrical-polar-coordinates",
            "spherical-polar-coordinates",
            "surfaces-in-spherical-polar-coordinates",
            "triple-integrals-in-spherical-polar-coordinates",
            "computing-triple-integrals-using-a-change-of-variables",
          ],
        },
      ],
    },
    {
      title: t("Line Integrals", "曲线积分"),
      modules: [
        {
          title: t("Line Integrals of Scalar Functions", "标量函数的曲线积分"),
          topics: [
            "simple-closed-and-oriented-curves",
            "line-integrals-of-scalar-functions",
            "properties-of-line-integrals-of-scalar-functions",
            "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x",
            "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-y",
          ],
        },
        {
          title: t("Line Integrals of Scalar Functions Over Parametric Curves", "参数曲线上的标量曲线积分"),
          topics: [
            "line-integrals-of-scalar-functions-over-line-segments",
            "line-integrals-of-scalar-functions-over-circles",
            "line-integrals-of-scalar-functions-over-ellipses",
            "further-properties-of-line-integrals-of-scalar-functions",
            "line-integrals-of-scalar-functions-over-polar-curves",
          ],
        },
        {
          title: t("Line Integrals With Respect to X and Y", "对坐标的曲线积分"),
          topics: [
            "line-integrals-with-respect-to-x-and-y",
            "properties-of-line-integrals-with-respect-to-x-and-y",
            "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves",
            "sums-of-line-integrals-with-respect-to-x-and-y",
          ],
        },
        {
          title: t("Line Integrals of Vector-Valued Functions", "向量线积分与做功"),
          topics: [
            "line-integrals-of-vector-valued-functions-over-parametric-curves",
            "line-integrals-of-vector-valued-functions-over-general-curves",
            "interpreting-line-integrals-of-vector-valued-functions",
            "properties-of-line-integrals-of-vector-valued-functions",
            "work-done-by-a-force-field",
            "the-fundamental-theorem-of-line-integrals",
          ],
        },
        {
          title: t("Path Independence and Conservation", "路径无关性与势函数"),
          topics: [
            "path-independence-of-line-integrals",
            "conservative-vector-fields-and-closed-paths",
            "calculating-potential-functions-for-line-integrals",
            "line-integrals-of-conservative-vector-fields-in-three-dimensions",
            "conservation-of-mechanical-energy",
          ],
        },
        {
          title: t("Circulation and Flux", "环量与通量"),
          topics: [
            "outward-pointing-unit-normal-vectors-in-2d",
            "circulation",
            "flux-in-two-dimensional-vector-fields",
            "calculating-flux-in-two-dimensional-vector-fields",
            "source-free-vector-fields",
          ],
        },
        {
          title: t("Green's Theorem", "格林公式"),
          topics: [
            "circulation-and-flux-across-simple-closed-plane-curves",
            "greens-theorem-in-circulation-curl-form",
            "greens-theorem-in-polar-coordinates",
            "calculating-areas-using-greens-theorem",
            "greens-theorem-in-flux-divergence-form",
            "greens-theorem-on-regions-with-holes",
          ],
        },
      ],
    },
    {
      title: t("Surface Integrals", "曲面积分"),
      modules: [
        {
          title: t("Parametric Surfaces", "参数曲面"),
          topics: [
            "parametric-surfaces",
            "tangent-planes-to-parametric-surfaces",
            "parametrizations-of-ellipsoids-and-cones",
            "parametrizations-of-paraboloids-and-hyperboloids",
            "parametrizations-of-cylinders",
          ],
        },
        {
          title: t("Surface Area", "曲面面积"),
          topics: [
            "surface-areas-of-revolution-rotation-about-the-x-axis",
            "surface-areas-of-revolution-rotation-about-the-y-axis",
            "surface-areas-of-revolution-for-parametric-curves",
            "areas-of-parametric-surfaces",
            "surfaces-of-revolution",
            "areas-of-surfaces",
          ],
        },
        {
          title: t("Surface Integrals", "曲面积分与场论定理"),
          topics: [
            "surface-integrals-over-parametric-surfaces",
            "surface-integrals-over-cartesian-surfaces",
            "flux-in-three-dimensional-vector-fields",
            "flux-through-closed-surfaces",
            "calculating-flux-through-parametric-surfaces",
            "calculating-flux-through-cartesian-surfaces",
            "calculating-flux-through-closed-surfaces",
            "the-divergence-theorem",
            "stokes-theorem",
          ],
        },
      ],
    },
    {
      title: t("Applications of Multivariable Calculus", "多变量微积分的应用"),
      modules: [
        {
          title: t("Vector Mechanics", "矢量力学"),
          topics: [
            "velocity-and-acceleration-as-functions-of-displacement",
            "determining-properties-of-objects-described-as-functions-of-displacement",
            "the-components-of-acceleration",
            "newtons-second-law",
            "applying-newtons-second-law-in-the-plane",
            "the-work-energy-principle",
            "circular-motion-about-the-origin",
          ],
        },
        {
          title: t("Applications of Multiple Integrals", "重积分的几何与物理应用"),
          topics: [
            "the-average-value-of-a-multivariable-function",
            "density-mass-and-charge-of-plane-laminas",
            "moments-and-center-of-mass",
            "moments-and-centers-of-mass-of-thin-rods",
            "moments-and-centers-of-mass-of-plane-laminas",
            "moments-of-inertia-of-laminas-about-the-coordinate-axes",
            "moments-of-inertia-of-laminas-about-other-axes",
            "calculating-the-radius-of-gyration-of-a-plane-lamina",
            "the-parallel-axis-theorem",
          ],
        },
        {
          title: t("Random Variables", "多元随机变量与概率分布"),
          topics: [
            "probability-density-functions-of-continuous-random-variables",
            "calculating-probabilities-with-continuous-random-variables",
            "continuous-random-variables-over-infinite-domains",
            "joint-distributions-for-discrete-random-variables",
            "joint-distributions-for-continuous-random-variables",
          ],
        },
      ],
    },
  ],
};

/** Differential Equations course definition. */
export const differentialEquations: CourseDef = {
  id: "differential-equations",
  title: t("Differential Equations", "常微分方程"),
  description: t(
    "Differential Equations is a comprehensive, advanced course devoted to the theory, solution techniques, and applications of ordinary differential equations. Building on multivariable calculus (with prior foundations in linear algebra and Calculus I-II), this course develops the analytical, qualitative, and numerical tools used to model and understand dynamic systems across mathematics, physics, engineering, and the applied sciences.",
    "常微分方程是一门全面深入的高级数学课程，涵盖常微分方程的理论、求解方法与广泛应用。以多变量微积分、线性代数和微积分基础为依托，系统讲授用于建模和分析动态系统的解析、定性与数值工具，广泛应用于数学、物理、工程及应用科学领域。",
  ),
  units: [
    {
      title: t("First-Order Differential Equations", "一阶常微分方程"),
      modules: [
        {
          title: t("Techniques for Solving First-Order ODEs", "一阶常微分方程的解法"),
          topics: [
            "solving-first-order-odes-using-separation-of-variables",
            "solving-first-order-ivps-using-separation-of-variables",
            "introduction-to-first-order-linear-odes",
            "general-solutions-of-first-order-linear-odes",
            "solving-first-order-linear-odes-with-exponential-forcing",
            "solving-first-order-linear-odes-with-sinusoidal-forcing",
            "solving-first-order-linear-odes-using-integrating-factors",
            "solving-first-order-odes-by-substitution",
            "further-solving-first-order-odes-by-substitution",
            "reducing-odes-to-first-order-linear-by-substitution",
          ],
        },
        {
          title: t("Special First-Order Equations", "特殊一阶微分方程"),
          topics: [
            "homogeneous-functions",
            "homogeneous-first-order-odes",
            "exact-differential-equations",
            "solving-exact-odes-using-integrating-factors",
            "bernoulli-differential-equations",
            "riccati-differential-equations",
            "clairaut-differential-equations",
            "dalembert-differential-equations",
          ],
        },
        {
          title: t("Qualitative Techniques for Differential Equations", "微分方程的定性方法"),
          topics: [
            "qualitative-analysis-of-first-order-odes",
            "equilibrium-solutions-of-first-order-odes",
            "phase-lines-of-first-order-odes",
            "classifying-equilibrium-solutions-of-first-order-odes",
          ],
        },
        {
          title: t("Slope Fields", "斜率场"),
          topics: [
            "slope-fields-for-directly-integrable-differential-equations",
            "slope-fields-for-autonomous-differential-equations",
            "slope-fields-for-nonautonomous-differential-equations",
            "analyzing-slope-fields-for-directly-integrable-differential-equations",
            "analyzing-slope-fields-for-autonomous-differential-equations",
            "analyzing-slope-fields-for-nonautonomous-differential-equations",
          ],
        },
      ],
    },
    {
      title: t("Modeling With First-Order Differential Equations", "一阶常微分方程建模"),
      modules: [
        {
          title: t("Applications of First-Order ODEs", "一阶常微分方程的应用"),
          topics: [
            "modeling-with-first-order-odes",
            "further-modeling-with-first-order-odes",
            "modeling-mixture-problems-with-first-order-separable-odes",
            "modeling-mixture-problems-with-first-order-linear-odes",
            "orthogonal-trajectories",
          ],
        },
        {
          title: t("Growth and Decay Models With First-Order ODEs", "增长与衰减模型"),
          topics: [
            "exponential-growth-and-decay-models-with-first-order-odes",
            "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
            "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems",
            "inhibited-growth-models-with-first-order-odes",
            "inhibited-decay-models-with-first-order-odes",
            "logistic-growth-models-with-first-order-odes",
            "qualitative-analysis-of-the-logistic-growth-equation",
            "solving-the-logistic-growth-equation",
          ],
        },
        {
          title: t("Physical Applications of First-Order ODEs", "物理应用模型"),
          topics: [
            "velocity-and-acceleration-as-functions-of-displacement",
            "determining-properties-of-objects-described-as-functions-of-displacement",
            "falling-body-problems-with-linear-drag",
            "falling-body-problems-with-quadratic-drag",
            "newtons-law-of-universal-gravitation",
            "modeling-escape-velocity-with-first-order-odes",
            "modeling-rl-circuits-with-first-order-odes",
            "modeling-rc-circuits-with-first-order-odes",
          ],
        },
      ],
    },
    {
      title: t("Linear Differential Equations", "线性微分方程"),
      modules: [
        {
          title: t("Theory of Solutions to Linear ODEs", "线性微分方程解的理论"),
          topics: [
            "differential-operators",
            "linear-differential-operators",
            "introduction-to-second-order-linear-odes",
            "the-superposition-principle",
            "reduction-of-order",
            "linear-independence-of-solutions-to-homogeneous-odes",
            "general-solutions-of-linear-odes",
            "abels-identity",
          ],
        },
        {
          title: t("Second-Order Linear ODEs With Constant Coefficients", "二阶常系数线性常微分方程"),
          topics: [
            "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
            "second-order-homogeneous-odes-characteristic-equations-with-repeated-roots",
            "second-order-homogeneous-odes-characteristic-equations-with-complex-roots",
            "second-order-homogeneous-initial-value-problems",
            "second-order-inhomogeneous-odes-with-polynomial-forcing",
            "second-order-inhomogeneous-odes-with-exponential-forcing",
            "second-order-inhomogeneous-odes-with-sinusoidal-forcing",
          ],
        },
        {
          title: t("The Cauchy-Euler Equations", "柯西-欧拉方程"),
          topics: [
            "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
            "cauchy-euler-equations-characteristic-equations-with-repeated-roots",
            "cauchy-euler-equations-characteristic-equations-with-complex-roots",
            "cauchy-euler-equations-with-forcing",
          ],
        },
        {
          title: t("Variation of Parameters", "常数变易法"),
          topics: [
            "variation-of-parameters-for-first-order-linear-odes",
            "variation-of-parameters-for-second-order-odes",
            "solving-second-order-odes-using-variation-of-parameters",
            "variation-of-parameters-with-higher-order-odes",
          ],
        },
        {
          title: t("Modeling With Second-Order ODEs", "二阶常微分方程建模"),
          topics: [
            "simple-harmonic-oscillators",
            "damped-oscillators",
            "forced-oscillators",
            "resonance-in-vibrating-systems",
            "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes",
            "modeling-current-in-rcl-circuits-with-second-order-odes",
          ],
        },
      ],
    },
    {
      title: t("Systems of Differential Equations", "微分方程组"),
      modules: [
        {
          title: t("Systems of ODEs", "微分方程组基础"),
          topics: [
            "introduction-to-systems-of-linear-odes",
            "expressing-homogeneous-odes-as-first-order-systems",
            "expressing-inhomogeneous-odes-as-first-order-systems",
            "linear-independence-for-homogeneous-systems-of-odes",
            "general-solutions-of-first-order-linear-systems-of-odes",
          ],
        },
        {
          title: t("Solving Systems of Linear ODEs", "求解线性微分方程组"),
          topics: [
            "solving-decoupled-homogeneous-systems-of-odes",
            "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
            "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues-and-initial-conditions",
            "solving-homogeneous-systems-of-odes-with-repeated-eigenvalues",
            "solving-homogeneous-systems-of-odes-with-complex-eigenvalues",
            "solving-inhomogeneous-systems-of-odes",
          ],
        },
        {
          title: t("Phase Portraits for Systems of Linear ODEs", "线性微分方程组的相图"),
          topics: [
            "phase-planes-and-phase-portraits",
            "equilibrium-points-and-stability-for-systems-of-odes",
            "phase-portraits-for-decoupled-linear-systems",
            "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues",
            "phase-portraits-for-linear-systems-with-repeated-eigenvalues",
            "phase-portraits-for-linear-systems-with-zero-eigenvalues",
            "phase-portraits-for-linear-systems-with-complex-eigenvalues",
            "shifted-systems-of-odes",
            "linear-approximations-near-equilibria",
          ],
        },
        {
          title: t("Solving Systems of ODEs Using Matrix Methods", "用矩阵方法求解微分方程组"),
          topics: [
            "matrix-exponentials",
            "fundamental-matrices",
            "solving-homogeneous-systems-of-odes-using-matrix-methods",
            "solving-inhomogeneous-systems-of-odes-using-matrix-methods",
            "solving-systems-of-odes-using-variation-of-parameters",
          ],
        },
        {
          title: t("Modeling With Systems of Linear ODEs", "微分方程组建模"),
          topics: ["the-lotka-volterra-predator-prey-model", "the-lotka-volterra-model-with-carrying-capacity"],
        },
      ],
    },
    {
      title: t("Laplace Transforms", "拉普拉斯变换"),
      modules: [
        {
          title: t("Laplace Transforms", "拉普拉斯变换基础"),
          topics: [
            "the-floor-and-ceiling-functions",
            "the-unit-step-function",
            "piecewise-continuity-and-piecewise-smoothness",
            "introduction-to-laplace-transforms",
            "linearity-of-laplace-transforms",
            "laplace-transforms-of-piecewise-continuous-functions",
            "the-smoothness-property-of-laplace-transforms",
            "laplace-transforms-of-derivatives",
            "laplace-transforms-of-integrals",
            "the-first-shifting-theorem-of-laplace-transforms",
            "the-second-shifting-theorem-of-laplace-transforms",
            "inverse-laplace-transforms",
          ],
        },
        {
          title: t("Solving Linear ODEs Using Laplace Transforms", "用拉普拉斯变换求解线性常微分方程"),
          topics: [
            "solving-first-order-odes-using-laplace-transforms",
            "solving-first-order-odes-with-time-delayed-forcing-using-laplace-transforms",
            "solving-second-order-odes-using-laplace-transforms",
            "solving-second-order-odes-with-time-delayed-forcing-using-laplace-transforms",
            "solving-homogeneous-systems-of-odes-using-laplace-transforms",
            "solving-inhomogeneous-systems-of-odes-using-laplace-transforms",
          ],
        },
      ],
    },
    {
      title: t("Boundary Value Problems", "边值问题"),
      modules: [
        {
          title: t("Boundary Value Problems", "边值问题理论"),
          topics: [
            "introduction-to-boundary-value-problems",
            "second-order-homogeneous-boundary-value-problems",
            "second-order-inhomogeneous-boundary-value-problems",
            "eigenvalues-and-eigenfunctions-of-homogeneous-bvps",
          ],
        },
        {
          title: t("Fourier Series", "傅里叶级数"),
          topics: [
            "introduction-to-fourier-series",
            "properties-of-fourier-series",
            "fourier-sine-series",
            "fourier-cosine-series",
            "fourier-series-of-arbitrary-period",
            "convergence-of-fourier-series",
            "differentiating-and-integrating-fourier-series",
            "solving-odes-using-fourier-series",
            "solving-ivps-using-fourier-series",
            "solving-bvps-using-fourier-series",
          ],
        },
      ],
    },
    {
      title: t("Approximating Solutions to Differential Equations", "常微分方程的近似解法"),
      modules: [
        {
          title: t("Series Solutions of Differential Equations", "微分方程的级数解法"),
          topics: [
            "introduction-to-recurrence-relations",
            "taylor-series-solutions-of-differential-equations",
            "power-series-solutions-of-differential-equations",
            "regular-singular-points",
            "the-method-of-frobenius",
            "finding-recurrence-relations-for-the-coefficients-of-a-frobenius-solution",
            "finding-general-solutions-using-the-method-of-frobenius",
          ],
        },
        {
          title: t("Euler's Method", "欧拉方法"),
          topics: [
            "eulers-method-calculating-one-step",
            "eulers-method-calculating-multiple-steps",
            "the-modified-euler-method",
            "eulers-method-for-systems-of-odes",
            "eulers-method-for-second-order-odes",
          ],
        },
        {
          title: t("Higher-Order Numerical Methods", "高阶数值方法"),
          topics: ["the-rk4-method", "the-abm2-method"],
        },
        {
          title: t("Implicit Numerical Methods", "隐式数值方法"),
          topics: [
            "the-implicit-euler-method",
            "the-trapezoidal-method",
            "using-the-implicit-euler-method-with-newtons-method",
            "using-the-trapezoidal-method-with-newtons-method",
          ],
        },
        {
          title: t("Analyzing Numerical Methods", "数值方法分析"),
          topics: ["big-o-notation", "error-in-numerical-methods", "order-of-numerical-methods", "stability-of-numerical-methods"],
        },
      ],
    },
  ],
};

/** probabilityAndStatistics course covers probability theory and statistical methods. */
export const probabilityAndStatistics: CourseDef = {
  id: "probability-and-statistics",
  title: t("Probability & Statistics", "概率与数理统计"),
  description: t(
    "A rigorous foundation in probability and statistical theory and methods, building on multivariable calculus and linear algebra: probability, combinatorics, random variables, expectation, common distributions, joint distributions, estimation, confidence intervals, hypothesis testing, ANOVA, regression, and goodness-of-fit.",
    "以多元微积分和线性代数为基础，奠定概率与数理统计理论及方法的坚实根基：概率论、组合学、随机变量、数学期望、常见分布、联合分布、参数估计、置信区间、假设检验、方差分析、回归分析与拟合优度检验。",
  ),
  units: [
    {
      title: t("Probability & Random Variables", "概率与随机变量"),
      modules: [
        {
          title: t("Probability", "概率"),
          topics: ["the-law-of-total-probability", "extending-the-law-of-total-probability", "bayes-theorem", "extending-bayes-theorem"],
        },
        {
          title: t("Combinatorics", "组合学"),
          topics: ["permutations-with-repetition", "k-permutations-of-n-with-repetition", "combinations-with-repetition"],
        },
        {
          title: t("Random Variables", "随机变量"),
          topics: [
            "probability-density-functions-of-continuous-random-variables",
            "calculating-probabilities-with-continuous-random-variables",
            "continuous-random-variables-over-infinite-domains",
            "cumulative-distribution-functions-for-continuous-random-variables",
            "median-quartiles-and-percentiles-of-continuous-random-variables",
            "finding-the-mode-of-a-continuous-random-variable",
            "approximating-discrete-random-variables-as-continuous",
            "simulating-random-observations",
          ],
        },
        {
          title: t("Functions of Random Variables", "随机变量的函数"),
          topics: [
            "one-to-one-transformations-of-discrete-random-variables",
            "many-to-one-transformations-of-discrete-random-variables",
            "the-distribution-function-method",
            "the-change-of-variables-method-for-continuous-random-variables",
            "the-distribution-function-method-with-many-to-one-transformations",
          ],
        },
      ],
    },
    {
      title: t("Expectation", "数学期望"),
      modules: [
        {
          title: t("Expectation of Random Variables", "随机变量的数学期望"),
          topics: [
            "expected-values-of-discrete-random-variables",
            "properties-of-expectation-for-discrete-random-variables",
            "variance-of-discrete-random-variables",
            "moments-of-discrete-random-variables",
            "properties-of-variance-for-discrete-random-variables",
            "moments-of-continuous-random-variables",
            "expected-values-of-continuous-random-variables",
            "variance-of-continuous-random-variables",
            "the-rule-of-the-lazy-statistician",
          ],
        },
        {
          title: t("Moment-Generating Functions", "矩母函数"),
          topics: [
            "moment-generating-functions",
            "calculating-moments-using-moment-generating-functions",
            "calculating-variance-and-standard-deviation-using-moment-generating-functions",
            "constructing-moment-generating-functions-for-discrete-probability-distributions",
            "constructing-moment-generating-functions-for-continuous-probability-distributions",
            "properties-of-moment-generating-functions",
            "the-uniqueness-property-of-mgfs",
          ],
        },
      ],
    },
    {
      title: t("Discrete Probability Distributions", "离散型概率分布"),
      modules: [
        {
          title: t("The Discrete Uniform Distribution", "离散均匀分布"),
          topics: [
            "the-discrete-uniform-distribution",
            "mean-and-variance-of-the-discrete-uniform-distribution",
            "modeling-with-discrete-uniform-distributions",
          ],
        },
        {
          title: t("The Bernoulli Distribution", "伯努利分布"),
          topics: ["the-bernoulli-distribution", "mean-and-variance-of-the-bernoulli-distribution"],
        },
        {
          title: t("The Binomial Distribution", "二项分布"),
          topics: [
            "the-binomial-distribution",
            "modeling-with-the-binomial-distribution",
            "mean-and-variance-of-the-binomial-distribution",
            "the-cdf-of-the-binomial-distribution",
          ],
        },
        {
          title: t("The Poisson Distribution", "泊松分布"),
          topics: [
            "the-poisson-distribution",
            "modeling-with-the-poisson-distribution",
            "mean-and-variance-of-the-poisson-distribution",
            "the-cdf-of-the-poisson-distribution",
            "the-poisson-approximation-of-the-binomial-distribution",
          ],
        },
        {
          title: t("The Geometric Distribution", "几何分布"),
          topics: [
            "the-geometric-distribution",
            "modeling-with-the-geometric-distribution",
            "mean-and-variance-of-the-geometric-distribution",
          ],
        },
        {
          title: t("The Negative Binomial Distribution", "负二项分布"),
          topics: [
            "the-negative-binomial-distribution",
            "modeling-with-the-negative-binomial-distribution",
            "mean-and-variance-of-the-negative-binomial-distribution",
          ],
        },
      ],
    },
    {
      title: t("Continuous Probability Distributions", "连续型概率分布"),
      modules: [
        {
          title: t("The Normal Distribution", "正态分布"),
          topics: [
            "the-z-score",
            "the-standard-normal-distribution",
            "symmetry-properties-of-the-standard-normal-distribution",
            "the-normal-distribution",
            "mean-and-variance-of-the-normal-distribution",
            "percentage-points-of-the-standard-normal-distribution",
            "modeling-with-the-normal-distribution",
            "the-empirical-rule-for-the-normal-distribution",
            "normal-approximations-of-binomial-distributions",
            "the-normal-approximation-of-the-poisson-distribution",
          ],
        },
        {
          title: t("The Continuous Uniform Distribution", "连续均匀分布"),
          topics: [
            "the-continuous-uniform-distribution",
            "mean-and-variance-of-the-continuous-uniform-distribution",
            "modeling-with-continuous-uniform-distributions",
          ],
        },
        {
          title: t("The Exponential Distribution", "指数分布"),
          topics: [
            "the-exponential-distribution",
            "modeling-with-the-exponential-distribution",
            "mean-and-variance-of-the-exponential-distribution",
          ],
        },
        {
          title: t("Other Continous Distributions", "其他连续型分布"),
          topics: [
            "the-gamma-function",
            "the-gamma-distribution",
            "the-chi-square-distribution",
            "the-students-t-distribution",
            "the-f-distribution",
          ],
        },
      ],
    },
    {
      title: t("Combining Random Variables", "复合随机变量"),
      modules: [
        {
          title: t("Distributions of Two Discrete Random Variables", "两个离散随机变量的分布"),
          topics: [
            "joint-distributions-for-discrete-random-variables",
            "the-joint-cdf-of-two-discrete-random-variables",
            "marginal-distributions-for-discrete-random-variables",
            "independence-of-discrete-random-variables",
            "conditional-distributions-for-discrete-random-variables",
            "the-trinomial-distribution",
            "the-multinomial-distribution",
          ],
        },
        {
          title: t("Distributions of Two Continuous Random Variables", "两个连续随机变量的分布"),
          topics: [
            "joint-distributions-for-continuous-random-variables",
            "marginal-distributions-for-continuous-random-variables",
            "independence-of-continuous-random-variables",
            "conditional-distributions-for-continuous-random-variables",
            "the-joint-cdf-of-two-continuous-random-variables",
            "properties-of-the-joint-cdf-of-two-continuous-random-variables",
            "the-bivariate-normal-distribution",
          ],
        },
        {
          title: t("Linear Combinations of Random Variables", "随机变量的线性组合"),
          topics: [
            "linear-combinations-of-binomial-random-variables",
            "linear-combinations-of-poisson-random-variables",
            "combining-two-normally-distributed-random-variables",
            "combining-multiple-normally-distributed-random-variables",
            "iid-normal-random-variables",
          ],
        },
        {
          title: t("Expectation for Multivariate Distributions", "多元分布的数学期望"),
          topics: [
            "expected-values-of-sums-and-products-of-random-variables",
            "variance-of-sums-of-independent-random-variables",
            "computing-expected-values-from-joint-distributions",
            "conditional-expectation-for-discrete-random-variables",
            "conditional-variance-for-discrete-random-variables",
            "the-rule-of-the-lazy-statistician-for-two-random-variables",
            "the-law-of-total-expectation-for-discrete-random-variables",
          ],
        },
        {
          title: t("Covariance of Random Variables", "随机变量的协方差"),
          topics: [
            "the-covariance-of-two-random-variables",
            "variance-of-sums-of-random-variables",
            "the-covariance-matrix",
            "the-correlation-coefficient-for-two-random-variables",
            "the-sample-covariance-matrix",
          ],
        },
      ],
    },
    {
      title: t("Parametric Inference", "参数推断"),
      modules: [
        {
          title: t("Mean, Variance, and Proportion", "均值、方差与比例"),
          topics: [
            "the-sample-mean",
            "sampling-distributions",
            "the-sample-variance",
            "pooled-variance",
            "variance-of-sample-means",
            "sample-means-from-normal-populations",
            "sampling-proportions-from-finite-populations",
            "the-method-of-moments",
            "the-method-of-moments-two-parameter-distributions",
          ],
        },
        {
          title: t("The Central Limit Theorem", "中心极限定理"),
          topics: [
            "the-central-limit-theorem",
            "applications-of-the-central-limit-theorem",
            "finite-population-corrections-for-sample-means",
            "point-estimates-of-population-proportions",
            "finite-population-corrections-for-sample-proportions",
          ],
        },
        {
          title: t("Maximum Likelihood", "最大似然估计"),
          topics: [
            "product-notation",
            "logarithmic-differentiation",
            "likelihood-functions-for-discrete-probability-distributions",
            "log-likelihood-functions-for-discrete-probability-distributions",
            "likelihood-functions-for-continuous-probability-distributions",
            "log-likelihood-functions-for-continuous-probability-distributions",
            "maximum-likelihood-estimation",
          ],
        },
      ],
    },
    {
      title: t("Confidence Intervals", "置信区间"),
      modules: [
        {
          title: t("One-Sample Procedures", "单样本方法"),
          topics: [
            "confidence-intervals-for-one-mean-known-population-variance",
            "confidence-intervals-for-one-mean-unknown-population-variance",
            "confidence-intervals-for-one-mean-finite-population-correction",
            "confidence-intervals-for-one-proportion",
            "confidence-intervals-for-one-proportion-finite-population-corrections",
            "confidence-intervals-for-one-variance",
          ],
        },
        {
          title: t("Two-Sample Procedures", "双样本方法"),
          topics: [
            "confidence-intervals-for-differences-between-two-means-known-population-variances",
            "confidence-intervals-for-differences-between-two-means-unknown-equal-population-variances",
            "confidence-intervals-for-differences-between-two-means-unknown-unequal-population-variances",
            "confidence-intervals-for-differences-between-two-proportions",
            "confidence-intervals-for-paired-samples-known-variances",
            "confidence-intervals-for-paired-samples-unknown-variances",
          ],
        },
        {
          title: t("Sample Size", "样本容量"),
          topics: [
            "sample-size-determination-for-estimating-means",
            "sample-size-determination-for-estimating-proportions",
            "sample-size-determination-for-estimating-means-finite-populations",
            "sample-size-determination-for-estimating-proportions-finite-populations",
          ],
        },
      ],
    },
    {
      title: t("Hypothesis Testing", "假设检验"),
      modules: [
        {
          title: t("One-Sample Procedures", "单样本方法"),
          topics: [
            "introduction-to-hypothesis-testing",
            "hypothesis-tests-for-the-rate-of-a-poisson-distribution",
            "critical-regions-for-left-tailed-hypothesis-tests",
            "critical-regions-for-right-tailed-hypothesis-tests",
            "two-tailed-hypothesis-tests",
            "type-i-and-type-ii-errors",
            "hypothesis-tests-for-one-mean-known-population-variance",
            "hypothesis-tests-for-one-mean-unknown-population-variance",
            "hypothesis-tests-for-one-variance",
          ],
        },
        {
          title: t("Two-Sample Procedures", "双样本方法"),
          topics: [
            "hypothesis-tests-for-two-means-known-population-variances",
            "hypothesis-tests-for-two-means-equal-but-unknown-population-variances",
            "hypothesis-tests-for-two-means-unequal-and-unknown-population-variances",
            "hypothesis-tests-for-two-proportions",
            "hypothesis-tests-for-two-means-paired-sample-z-test",
            "hypothesis-tests-for-two-means-paired-sample-t-test",
            "hypothesis-tests-for-two-variances",
          ],
        },
        {
          title: t("Analysis of Variance", "方差分析"),
          topics: [
            "one-factor-within-groups-and-between-groups-variation",
            "the-relationship-between-ssw-ssb-sst",
            "one-factor-analysis-of-variance",
          ],
        },
      ],
    },
    {
      title: t("Regression", "回归分析"),
      modules: [
        {
          title: t("Correlation and Regression", "相关与回归"),
          topics: [
            "the-linear-correlation-coefficient",
            "linear-regression",
            "residuals-and-residual-plots",
            "spearmans-rank-correlation-coefficient",
            "confidence-intervals-for-linear-regression-slope-parameters",
            "confidence-intervals-for-linear-regression-intercept-parameters",
          ],
        },
        {
          title: t("Linear and Nonlinear Regression With Matrices", "矩阵形式的线性和非线性回归"),
          topics: [
            "least-squares-solution-of-a-linear-system-without-collinearity",
            "least-squares-solution-of-a-linear-system-with-collinearity",
            "linear-regression-with-matrices",
            "polynomial-regression-with-matrices",
            "multiple-linear-regression-with-matrices",
          ],
        },
      ],
    },
    {
      title: t("Nonparametric Inference", "非参数推断"),
      modules: [
        {
          title: t("Goodness-of-Fit and Order Statistics", "拟合优度与顺序统计量"),
          topics: [
            "introduction-to-chi-square-goodness-of-fit",
            "testing-binomial-models-using-chi-square-goodness-of-fit",
            "testing-poisson-models-using-chi-square-goodness-of-fit",
            "testing-continuous-uniform-models-using-chi-square-goodness-of-fit",
            "testing-normal-models-using-chi-square-goodness-of-fit",
            "chi-square-tests-of-independence-and-homogeneity",
            "introduction-to-order-statistics",
          ],
        },
      ],
    },
  ],
};

/** mathematicsForMachineLearning course provides mathematical tools for modern machine learning. */
export const mathematicsForMachineLearning: CourseDef = {
  id: "mathematics-for-machine-learning",
  title: t("Mathematics for Machine Learning", "机器学习数学基础"),
  description: t(
    "A comprehensive foundation of the essential mathematical tools required for modern machine learning, spanning linear algebra, vector calculus, probability, and optimization: matrices, vector spaces, eigenvalues, singular value decomposition, principal component analysis, multivariable calculus, matrix calculus, probability distributions, point estimation, and confidence intervals.",
    "全面奠定现代机器学习所需的坚实数学基础，涵盖线性代数、向量微积分、概率论与最优化：矩阵、向量空间、特征值、奇异值分解、主成分分析、多元微积分、矩阵微积分、概率分布、点估计与置信区间。",
  ),
  units: [
    {
      title: t("Set Theory", "集合论"),
      modules: [
        {
          title: t("Introduction to Set Theory", "集合论引论"),
          topics: [
            "special-sets",
            "equivalent-sets",
            "the-constructive-definition-of-a-set",
            "the-conditional-definition-of-a-set",
            "describing-sets-using-set-builder-notation",
            "describing-planar-regions-using-set-builder-notation",
          ],
        },
        {
          title: t("Properties of Sets", "集合的性质"),
          topics: [
            "subsets",
            "cardinality-of-finite-sets",
            "infinite-sets",
            "interior-and-boundary-points",
            "interiors-and-boundaries-of-sets",
            "open-and-closed-sets",
            "the-maximum-and-minimum-of-a-set",
            "supremum-and-infimum",
            "argmax-and-argmin-notation",
            "finding-argmax-and-argmin-from-tables-and-graphs",
          ],
        },
        {
          title: t("Set Operations", "集合运算"),
          topics: [
            "the-difference-of-sets",
            "set-complements",
            "indicator-functions",
            "indicator-functions-for-predicates",
            "the-cartesian-product",
            "visualizing-cartesian-products",
            "indexed-sets",
            "disjoint-sets",
            "sets-and-functions",
          ],
        },
      ],
    },
    {
      title: t("Logic", "逻辑"),
      modules: [
        {
          title: t("Logical Statements", "逻辑命题"),
          topics: [
            "statements-and-predicates",
            "the-and-and-or-connectives",
            "truth-tables",
            "the-not-connective",
            "logical-equivalence",
            "logical-associative-and-commutative-laws",
            "the-distributive-laws",
            "the-absorption-laws",
            "de-morgans-laws-for-logic",
          ],
        },
        {
          title: t("Implications and Biconditionals", "Implications and Biconditionals"),
          topics: [
            "conditional-statements",
            "logical-equivalence-with-conditional-statements",
            "biconditional-statements",
            "truth-sets-of-predicates",
            "the-and-and-or-connectives-with-predicates",
            "the-not-connective-with-predicates",
            "simplifying-predicate-expressions-using-de-morgans-laws",
            "conditional-statements-with-predicates",
          ],
        },
        {
          title: t("Introduction to Boolean Algebra", "Introduction to Boolean Algebra"),
          topics: ["boolean-functions", "boolean-functions-and-logical-operations"],
        },
      ],
    },
    {
      title: t("Vectors and Matrices", "向量与矩阵"),
      modules: [
        {
          title: t("Vector Geometry", "Vector Geometry"),
          topics: [
            "the-vector-equation-of-a-line",
            "the-parametric-equations-of-a-line",
            "the-cartesian-equation-of-a-line",
            "the-vector-equation-of-a-plane",
            "the-cartesian-equation-of-a-plane",
            "the-parametric-equations-of-a-plane",
            "the-intersection-of-two-planes",
            "the-shortest-distance-between-a-plane-and-a-point",
            "the-intersection-between-a-line-and-a-plane",
          ],
        },
        {
          title: t("Determinants", "行列式"),
          topics: [
            "the-determinant-of-an-nxn-matrix",
            "finding-determinants-using-laplace-expansions",
            "basic-properties-of-determinants",
            "further-properties-of-determinants",
            "row-and-column-operations-on-determinants",
            "conditions-when-a-determinant-equals-zero",
          ],
        },
        {
          title: t("Gaussian Elimination", "高斯消元法"),
          topics: [
            "systems-of-equations-as-augmented-matrices",
            "row-echelon-form",
            "solving-systems-of-equations-using-back-substitution",
            "elementary-row-operations",
            "creating-rows-or-columns-containing-zeros-using-gaussian-elimination",
            "solving-2x2-systems-of-equations-using-gaussian-elimination",
            "solving-2x2-singular-systems-of-equations-using-gaussian-elimination",
            "solving-3x3-systems-of-equations-using-gaussian-elimination",
            "identifying-the-pivot-columns-of-a-matrix",
            "solving-3x3-singular-systems-of-equations-using-gaussian-elimination",
            "reduced-row-echelon-form",
            "gaussian-elimination-for-nxm-systems-of-equations",
          ],
        },
        {
          title: t("The Inverse of a Matrix", "矩阵的逆"),
          topics: [
            "finding-the-inverse-of-a-2x2-matrix-using-row-operations",
            "finding-the-inverse-of-a-3x3-matrix-using-row-operations",
            "matrices-with-easy-to-find-inverses",
            "the-invertible-matrix-theorem-in-terms-of-2x2-systems-of-equations",
            "triangular-matrices",
          ],
        },
        {
          title: t("Affine Transformations", "仿射变换"),
          topics: ["affine-transformations", "the-image-of-an-affine-transformation", "the-inverse-of-an-affine-transformation"],
        },
      ],
    },
    {
      title: t("Vector Spaces", "向量空间"),
      modules: [
        {
          title: t("Vectors in N-Dimensional Space", "N 维空间中的向量"),
          topics: [
            "vectors-in-n-dimensional-euclidean-space",
            "linear-combinations-of-vectors-in-n-dimensional-euclidean-space",
            "linear-span-of-vectors-in-n-dimensional-euclidean-space",
            "linear-dependence-and-independence",
            "the-hadamard-product",
          ],
        },
        {
          title: t("Subspaces of N-Dimensional Space", "N 维空间的子空间"),
          topics: [
            "subspaces-of-n-dimensional-space",
            "subspaces-of-n-dimensional-space-geometric-interpretation",
            "the-column-space-of-a-matrix",
            "the-null-space-of-a-matrix",
          ],
        },
        {
          title: t("Bases of N-Dimensional Space", "N 维空间的基"),
          topics: [
            "finding-a-basis-of-a-span",
            "finding-a-basis-of-the-column-space-of-a-matrix",
            "finding-a-basis-of-the-null-space-of-a-matrix",
            "expressing-the-coordinates-of-a-vector-in-a-given-basis",
            "writing-vectors-in-different-bases",
            "the-change-of-coordinates-matrix",
            "changing-a-basis-using-the-change-of-coordinates-matrix",
          ],
        },
        {
          title: t("Dimension and Rank in N-Dimensional Space", "N 维空间的维数与秩"),
          topics: [
            "the-dimension-of-a-span",
            "the-rank-of-a-matrix",
            "the-dimension-of-the-null-space-of-a-matrix",
            "the-invertible-matrix-theorem-in-terms-of-dimension-rank-and-nullity",
            "the-rank-nullity-theorem",
          ],
        },
      ],
    },
    {
      title: t("Diagonalization of Matrices", "矩阵的对角化"),
      modules: [
        {
          title: t("Eigenvectors and Eigenvalues", "Eigenvectors and Eigenvalues"),
          topics: [
            "eigenvalues-and-eigenvectors-of-a-2x2-matrix",
            "calculating-the-eigenvalues-of-a-2x2-matrix",
            "calculating-the-eigenvectors-of-a-2x2-matrix",
            "characteristic-equation-of-a-matrix",
            "calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues",
            "calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case",
          ],
        },
        {
          title: t("Diagonalization", "对角化"),
          topics: [
            "diagonalizing-a-2x2-matrix",
            "properties-of-diagonalization",
            "diagonalizing-a-3x3-matrix-with-distinct-eigenvalues",
            "diagonalizing-a-3x3-matrix-in-the-general-case",
            "symmetric-matrices",
            "diagonalization-of-2x2-symmetric-matrices",
            "diagonalization-of-3x3-symmetric-matrices",
          ],
        },
      ],
    },
    {
      title: t("Orthogonality & Projections", "正交性与投影"),
      modules: [
        {
          title: t("Inner Products", "内积"),
          topics: [
            "dot-product-in-n-dimensional-euclidean-space",
            "norm-of-a-vector-in-n-dimensional-euclidean-space",
            "euclidean-manhattan-and-minkowski-distance",
            "introduction-to-abstract-vector-spaces",
            "defining-abstract-vector-spaces",
            "inner-product-spaces",
          ],
        },
        {
          title: t("Orthogonality", "正交性"),
          topics: [
            "orthogonal-vectors-in-euclidean-spaces",
            "cauchy-schwarz-inequality-and-angle-between-two-vectors",
            "orthogonal-complements",
            "orthogonal-sets-in-euclidean-spaces",
            "orthogonal-matrices",
            "orthogonal-linear-transformations",
          ],
        },
        {
          title: t("Orthogonal Projections", "正交投影"),
          topics: [
            "projecting-vectors-onto-one-dimensional-subspaces",
            "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases-applications",
            "gram-schmidt-process-for-two-vectors",
          ],
        },
      ],
    },
    {
      title: t("Singular Value Decomposition", "奇异值分解"),
      modules: [
        {
          title: t("Quadratic Forms", "二次型"),
          topics: [
            "bilinear-forms",
            "quadratic-forms",
            "change-of-variables-in-quadratic-forms",
            "positive-definite-and-negative-definite-quadratic-forms",
            "constrained-optimization-of-quadratic-forms",
            "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained",
          ],
        },
        {
          title: t("Singular Value Decomposition", "奇异值分解"),
          topics: [
            "singular-values-of-a-matrix",
            "computing-the-singular-values-of-a-matrix",
            "singular-value-decomposition-of-2x2-matrices",
            "singular-value-decomposition-of-2x2-matrices-with-zero-or-repeated-eigenvalues",
            "singular-value-decomposition-of-larger-matrices",
            "singular-value-decomposition-and-the-pseudoinverse-matrix",
          ],
        },
      ],
    },
    {
      title: t("Applications of Linear Algebra", "线性代数的应用"),
      modules: [
        {
          title: t("Linear Least-Squares Problems", "Linear Least-Squares Problems"),
          topics: [
            "least-squares-solution-of-a-linear-system-without-collinearity",
            "least-squares-solution-of-a-linear-system-with-collinearity",
          ],
        },
        {
          title: t("Linear Regression", "线性回归"),
          topics: ["linear-regression-with-matrices", "polynomial-regression-with-matrices", "multiple-linear-regression-with-matrices"],
        },
        {
          title: t("Principal Component Analysis", "主成分分析"),
          topics: [
            "introduction-to-principal-component-analysis",
            "computing-principal-components",
            "the-connection-between-pca-and-svd",
            "feature-extraction-using-pca",
          ],
        },
      ],
    },
    {
      title: t("Multivariable Calculus", "多元微积分"),
      modules: [
        {
          title: t("Introduction to Multivariable Functions", "多元函数引论"),
          topics: [
            "the-domain-of-a-multivariable-function",
            "level-curves",
            "level-surfaces",
            "limits-and-continuity-of-multivariable-functions",
          ],
        },
        {
          title: t("Quadric Surfaces and Cylinders", "二次曲面与柱面"),
          topics: [
            "ellipsoids",
            "hyperboloids",
            "paraboloids",
            "elliptic-cones",
            "cylinders",
            "intersections-of-lines-and-planes-with-surfaces",
            "identifying-quadric-surfaces",
          ],
        },
        {
          title: t("Partial Derivatives", "偏导数"),
          topics: [
            "introduction-to-partial-derivatives",
            "computing-partial-derivatives-using-the-rules-of-differentiation",
            "geometric-interpretations-of-partial-derivatives",
            "partial-differentiability-of-multivariable-functions",
            "higher-order-partial-derivatives",
            "equality-of-mixed-partial-derivatives",
            "tangent-planes-to-surfaces",
            "linearization-of-multivariable-functions",
          ],
        },
        {
          title: t("Vector-Valued Functions", "向量值函数"),
          topics: [
            "the-domain-of-a-vector-valued-function",
            "tangent-vectors-and-tangent-lines-to-curves",
            "the-gradient-vector",
            "the-gradient-as-a-normal-vector",
            "directional-derivatives",
            "the-multivariable-chain-rule",
            "the-multivariable-chain-rule-in-vector-form",
            "gradients-with-respect-to-a-variable-subset",
          ],
        },
        {
          title: t("Differentiation", "微分"),
          topics: [
            "the-jacobian",
            "the-inverse-function-theorem",
            "the-jacobian-of-a-three-dimensional-transformation",
            "the-derivative-of-a-multivariable-function",
            "the-second-derivative-of-a-multivariable-function",
            "second-degree-taylor-polynomials-of-multivariable-functions",
          ],
        },
        {
          title: t("Matrix Calculus", "矩阵微积分"),
          topics: [
            "total-and-tensor-derivatives",
            "the-chain-rule-for-total-derivatives",
            "vector-gradients",
            "further-vector-gradients",
            "matrix-gradients",
          ],
        },
        {
          title: t("Approximating Volumes With Riemann Sums", "用黎曼和近似体积"),
          topics: [
            "double-summations",
            "partitions-of-intervals",
            "calculating-double-summations-over-partitions",
            "approximating-volumes-using-lower-riemann-sums",
            "approximating-volumes-using-upper-riemann-sums",
            "lower-riemann-sums-over-general-rectangular-partitions",
            "upper-riemann-sums-over-general-rectangular-partitions",
            "defining-double-integrals-using-lower-and-upper-riemann-sums",
          ],
        },
        {
          title: t("Double Integrals", "二重积分"),
          topics: [
            "double-integrals-over-rectangular-domains",
            "double-integrals-over-non-rectangular-domains",
            "properties-of-double-integrals",
            "type-i-and-ii-regions-in-two-dimensional-space",
            "double-integrals-over-type-i-regions",
            "double-integrals-over-type-ii-regions",
          ],
        },
        {
          title: t("Optimization", "最优化"),
          topics: [
            "global-vs-local-extrema-and-critical-points-of-multivariable-functions",
            "the-second-partial-derivatives-test",
            "calculating-global-extrema-of-multivariable-functions",
            "lagrange-multipliers-with-one-constraint",
            "lagrange-multipliers-with-multiple-constraints",
            "optimizing-multivariable-functions-using-lagrange-multipliers",
          ],
        },
      ],
    },
    {
      title: t("Probability & Random Variables", "概率与随机变量"),
      modules: [
        {
          title: t("Probability", "概率"),
          topics: ["extending-the-law-of-total-probability", "bayes-theorem", "extending-bayes-theorem"],
        },
        {
          title: t("Random Variables", "随机变量"),
          topics: [
            "probability-density-functions-of-continuous-random-variables",
            "calculating-probabilities-with-continuous-random-variables",
            "continuous-random-variables-over-infinite-domains",
            "cumulative-distribution-functions-for-continuous-random-variables",
            "approximating-discrete-random-variables-as-continuous",
            "simulating-random-observations",
          ],
        },
        {
          title: t("Transformations of Random Variables", "随机变量的变换"),
          topics: [
            "one-to-one-transformations-of-discrete-random-variables",
            "many-to-one-transformations-of-discrete-random-variables",
            "the-distribution-function-method",
            "the-change-of-variables-method-for-continuous-random-variables",
            "the-distribution-function-method-with-many-to-one-transformations",
          ],
        },
        {
          title: t("Expectation", "数学期望"),
          topics: [
            "expected-values-of-discrete-random-variables",
            "properties-of-expectation-for-discrete-random-variables",
            "variance-of-discrete-random-variables",
            "moments-of-discrete-random-variables",
            "properties-of-variance-for-discrete-random-variables",
            "moments-of-continuous-random-variables",
            "expected-values-of-continuous-random-variables",
            "variance-of-continuous-random-variables",
            "the-rule-of-the-lazy-statistician",
          ],
        },
        {
          title: t("Discrete Probability Distributions", "Discrete Probability Distributions"),
          topics: [
            "the-bernoulli-distribution",
            "modeling-with-the-binomial-distribution",
            "the-cdf-of-the-binomial-distribution",
            "mean-and-variance-of-the-binomial-distribution",
            "the-discrete-uniform-distribution",
            "mean-and-variance-of-the-discrete-uniform-distribution",
            "modeling-with-discrete-uniform-distributions",
            "the-poisson-distribution",
            "modeling-with-the-poisson-distribution",
            "the-cdf-of-the-poisson-distribution",
          ],
        },
        {
          title: t("Continuous Probability Distributions", "Continuous Probability Distributions"),
          topics: [
            "the-continuous-uniform-distribution",
            "mean-and-variance-of-the-continuous-uniform-distribution",
            "modeling-with-continuous-uniform-distributions",
            "the-gamma-function",
            "the-chi-square-distribution",
            "the-students-t-distribution",
            "the-exponential-distribution",
          ],
        },
      ],
    },
    {
      title: t("Combining Random Variables", "复合随机变量"),
      modules: [
        {
          title: t("Distributions of Two Discrete Random Variables", "Distributions of Two Discrete Random Variables"),
          topics: [
            "joint-distributions-for-discrete-random-variables",
            "marginal-distributions-for-discrete-random-variables",
            "independence-of-discrete-random-variables",
            "conditional-distributions-for-discrete-random-variables",
            "the-joint-cdf-of-two-discrete-random-variables",
          ],
        },
        {
          title: t("Distributions of Two Continuous Random Variables", "Distributions of Two Continuous Random Variables"),
          topics: [
            "joint-distributions-for-continuous-random-variables",
            "marginal-distributions-for-continuous-random-variables",
            "independence-of-continuous-random-variables",
            "conditional-distributions-for-continuous-random-variables",
            "the-joint-cdf-of-two-continuous-random-variables",
            "properties-of-the-joint-cdf-of-two-continuous-random-variables",
          ],
        },
        {
          title: t("Expectation for Joint Distributions", "联合分布的数学期望"),
          topics: [
            "expected-values-of-sums-and-products-of-random-variables",
            "variance-of-sums-of-independent-random-variables",
            "computing-expected-values-from-joint-distributions",
            "conditional-expectation-for-discrete-random-variables",
            "the-law-of-total-expectation-for-discrete-random-variables",
            "conditional-variance-for-discrete-random-variables",
            "conditional-expectation-for-continuous-random-variables",
            "conditional-variance-for-continuous-random-variables",
            "the-rule-of-the-lazy-statistician-for-two-random-variables",
          ],
        },
        {
          title: t("Covariance of Random Variables", "随机变量的协方差"),
          topics: [
            "the-covariance-of-two-random-variables",
            "variance-of-sums-of-random-variables",
            "the-correlation-coefficient-for-two-random-variables",
            "the-covariance-matrix",
          ],
        },
        {
          title: t("Normally Distributed Random Variables", "正态分布随机变量"),
          topics: [
            "normal-approximations-of-binomial-distributions",
            "combining-two-normally-distributed-random-variables",
            "combining-multiple-normally-distributed-random-variables",
            "iid-normal-random-variables",
            "the-bivariate-normal-distribution",
          ],
        },
      ],
    },
    {
      title: t("Parametric Inference", "参数推断"),
      modules: [
        {
          title: t("Point Estimation", "点估计"),
          topics: [
            "the-sample-mean",
            "sampling-distributions",
            "the-sample-variance",
            "variance-of-sample-means",
            "sample-means-from-normal-populations",
            "the-central-limit-theorem",
            "sampling-proportions-from-finite-populations",
            "point-estimates-of-population-proportions",
            "the-sample-covariance-matrix",
          ],
        },
        {
          title: t("Maximum Likelihood", "极大似然"),
          topics: [
            "product-notation",
            "logarithmic-differentiation",
            "likelihood-functions-for-discrete-probability-distributions",
            "log-likelihood-functions-for-discrete-probability-distributions",
            "likelihood-functions-for-continuous-probability-distributions",
            "log-likelihood-functions-for-continuous-probability-distributions",
            "maximum-likelihood-estimation",
          ],
        },
        {
          title: t("Confidence Intervals", "置信区间"),
          topics: [
            "confidence-intervals-for-one-mean-known-population-variance",
            "confidence-intervals-for-one-mean-unknown-population-variance",
            "confidence-intervals-for-one-proportion",
            "confidence-intervals-for-differences-between-two-means-known-population-variances",
            "confidence-intervals-for-linear-regression-slope-parameters",
            "confidence-intervals-for-linear-regression-intercept-parameters",
          ],
        },
      ],
    },
  ],
};

/** abstractAlgebra is the university course on groups, permutations, quotients, homomorphisms, group actions, the Sylow theorems, rings and fields. */
export const abstractAlgebra: CourseDef = {
  id: "abstract-algebra",
  title: t("Abstract Algebra", "抽象代数"),
  description: t(
    "Binary operations, groups, subgroups and cyclic groups; permutations, permutation groups and isometries; direct products, cosets, Lagrange's theorem and quotient groups; homomorphisms and the isomorphism theorems; group actions, Burnside's lemma and the Sylow theorems; and rings, integral domains, fields, ideals, quotient rings, polynomial rings, irreducibility and the quaternions.",
    "二元运算、群、子群与循环群；置换、置换群与等距变换；直积、陪集、拉格朗日定理与商群；同态与同构定理；群作用、伯恩赛德引理与西罗定理；以及环、整环、域、理想、商环、多项式环、不可约性与四元数。",
  ),
  units: [
    {
      title: t("Preliminaries", "预备知识"),
      modules: [
        {
          title: t("Fermat and Euler's Theorems", "费马定理与欧拉定理"),
          topics: ["fermats-little-theorem", "eulers-totient-function", "eulers-theorem"],
        },
      ],
    },
    {
      title: t("Groups", "群"),
      modules: [
        {
          title: t("Binary Operations", "二元运算"),
          topics: [
            "introduction-to-binary-operations",
            "associative-binary-operations",
            "commutative-binary-operations",
            "identities-of-binary-operations",
            "inverses-under-binary-operations",
          ],
        },
        {
          title: t("Groups", "群"),
          topics: [
            "introduction-to-groups",
            "real-rational-and-complex-groups",
            "matrix-groups",
            "function-groups",
            "general-groups",
            "the-order-of-a-group",
            "orders-of-group-elements",
            "computing-inverses-of-elements-in-zn",
            "cayley-tables",
            "cayley-diagrams",
            "abelian-groups",
          ],
        },
        {
          title: t("Subgroups", "子群"),
          topics: ["subgroups-of-scalar-groups", "subgroups-of-matrix-groups", "subgroups-of-function-groups", "properties-of-subgroups"],
        },
        {
          title: t("Cyclic Groups", "循环群"),
          topics: [
            "finite-cyclic-groups",
            "cyclic-groups",
            "cyclic-subgroups",
            "cyclic-subgroups-in-the-complex-plane",
            "generators-of-cyclic-groups",
            "properties-of-cyclic-groups",
          ],
        },
        {
          title: t("Generating Sets and Presentations", "生成集与表示"),
          topics: ["generating-sets", "free-groups", "universal-property-of-free-groups", "presentations-of-groups"],
        },
      ],
    },
    {
      title: t("Permutations", "置换"),
      modules: [
        {
          title: t("Permutations and Cycles", "置换与轮换"),
          topics: [
            "permutations",
            "cycles",
            "converting-between-permutations-and-cycles",
            "the-inverse-of-a-cycle",
            "the-inverse-of-a-permutation",
            "the-order-of-a-cycle",
            "the-order-of-a-permutation",
            "transpositions",
          ],
        },
        {
          title: t("Permutation Groups", "置换群"),
          topics: ["the-symmetric-group-on-n-symbols", "the-alternating-group-on-n-symbols"],
        },
        {
          title: t("Isometries", "等距变换"),
          topics: [
            "the-symmetry-group-of-a-figure",
            "dihedral-group",
            "the-symmetry-group-of-a-tetrahedron",
            "the-symmetry-group-of-a-cube-rotations-and-reflections",
            "the-symmetry-group-of-a-cube-combining-rotations-and-reflections",
          ],
        },
      ],
    },
    {
      title: t("Product and Quotient Groups", "积群与商群"),
      modules: [
        {
          title: t("Direct Products", "直积"),
          topics: [
            "external-direct-products",
            "cyclic-direct-product-groups",
            "torsion-groups",
            "finitely-generated-abelian-groups",
            "free-abelian-groups",
            "internal-direct-products",
          ],
        },
        {
          title: t("Cosets and Quotient Groups", "陪集与商群"),
          topics: [
            "cosets-of-the-additive-groups-of-integers-modulo-n",
            "cosets-of-the-multiplicative-groups-of-integers-modulo-n",
            "cosets-of-infinite-scalar-groups",
            "left-and-right-cosets-in-matrix-groups",
            "left-and-right-cosets-in-permutation-groups",
            "normal-subgroups",
            "maximal-normal-subgroups",
            "the-normalizer-of-a-subgroup",
            "the-center-of-a-group",
            "the-centralizer-of-a-subgroup",
            "quotient-groups",
            "lagranges-theorem",
            "simple-groups",
          ],
        },
      ],
    },
    {
      title: t("Homomorphisms & Isomorphisms", "同态与同构"),
      modules: [
        {
          title: t("Group Homomorphisms", "群同态"),
          topics: ["group-homomorphisms", "the-image-of-a-group-homomorphism", "the-kernel-of-a-group-homomorphism", "group-isomorphisms"],
        },
        {
          title: t("The Isomorphism Theorems", "同构定理"),
          topics: ["the-first-isomorphism-theorem", "the-second-isomorphism-theorem", "the-third-isomorphism-theorem"],
        },
      ],
    },
    {
      title: t("Group Actions", "群作用"),
      modules: [
        {
          title: t("Group Actions", "群作用"),
          topics: [
            "natural-actions-of-symmetric-and-dihedral-groups",
            "group-actions",
            "orbits",
            "stabilizers",
            "the-orbit-stabilizer-theorem",
            "burnsides-lemma",
            "the-class-equation-of-a-group-action",
            "conjugation-and-conjugacy-classes",
            "conjugacy-of-group-subsets-and-subgroups",
          ],
        },
        {
          title: t("Applications of Burnside Formula to Counting", "伯恩赛德公式在计数中的应用"),
          topics: [
            "cycle-types-of-permutations",
            "cycle-types-of-permutations-of-some-groups",
            "permutation-actions-on-sets-of-words",
            "colorings-of-necklaces",
          ],
        },
      ],
    },
    {
      title: t("Group Structures", "群的结构"),
      modules: [
        {
          title: t("The Sylow Theorems", "西罗定理"),
          topics: ["p-groups", "the-first-sylow-theorem", "the-second-sylow-theorem", "the-third-sylow-theorem"],
        },
      ],
    },
    {
      title: t("Rings & Fields", "环与域"),
      modules: [
        {
          title: t("Rings", "环"),
          topics: [
            "introduction-to-rings",
            "commutative-rings",
            "rings-with-unity",
            "integral-domains",
            "introduction-to-fields",
            "the-characteristic-of-a-ring",
            "the-units-of-a-ring",
            "finding-the-inverse-of-a-matrix-over-a-ring",
            "the-field-of-quotients-of-an-integral-domain",
          ],
        },
        {
          title: t("Ideals and Factor Rings", "理想与商环"),
          topics: [
            "subrings",
            "ideals",
            "generating-elements-of-principal-ideal-rings",
            "quotient-rings",
            "polynomial-quotient-rings",
            "ring-homomorphisms",
            "ring-homomorphisms-between-residue-rings",
            "the-image-and-kernel-of-a-ring-homomorphism",
            "prime-ideals-and-maximal-ideals",
          ],
        },
        {
          title: t("Rings of Polynomials", "多项式环"),
          topics: [
            "rings-of-polynomials",
            "units-in-polynomial-rings",
            "the-division-algorithm-in-rings-of-polynomials-over-finite-fields",
            "the-euclidian-algorithm-in-rings-of-polynomials",
            "the-extended-euclidian-algorithm-in-rings-of-polynomials",
            "irreducible-polynomials-over-the-real-and-complex-numbers",
            "irreducible-polynomials-over-the-integers-and-rational-numbers",
            "irreducible-polynomials-over-a-finite-field",
            "reducibility-tests-for-polynomials-over-the-integers-and-rationals",
          ],
        },
        {
          title: t("Quaternions", "四元数"),
          topics: ["the-division-ring-of-quaternions", "inverting-quaternions", "linear-equations-over-quaternions"],
        },
      ],
    },
    {
      title: t("Vector Spaces", "向量空间"),
      modules: [
        {
          title: t("Abstract Vector Spaces", "抽象向量空间"),
          topics: [
            "introduction-to-abstract-vector-spaces",
            "defining-abstract-vector-spaces",
            "linear-independence-in-abstract-vector-spaces",
            "subspaces-of-abstract-vector-spaces",
            "bases-in-abstract-vector-spaces",
            "the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces",
            "dimension-in-abstract-vector-spaces",
            "vector-spaces-over-finite-fields",
          ],
        },
      ],
    },
  ],
};

/** mathematicalMethodsForThePhysicalSciencesI develops mathematical methods for the physical sciences. */
export const mathematicalMethodsForThePhysicalSciencesI: CourseDef = {
  id: "mathematical-methods-for-the-physical-sciences-i",
  title: t("Mathematical Methods for the Physical Sciences I", "物理科学的数学方法一"),
  description: t(
    "The core mathematical structures and analytical tools used throughout theoretical and applied physics: vector geometry, linear algebra (systems of equations, determinants, vector spaces, linear transformations, eigenvalues and diagonalization), multivariable functions and calculus (partial derivatives, gradients, vector fields, multiple integrals), probability and continuous random variables, and first- and second-order ordinary differential equations with physical modeling and oscillatory dynamics.",
    "理论与应用物理的核心数学结构与解析工具：空间向量几何、线性代数（线性方程组、行列式、向量空间、线性变换、特征值与对角化）、多元函数与微积分（偏导数、梯度、向量场、重积分）、概率与连续随机变量，以及用于物理建模和振动动力学的一阶与二阶常微分方程。",
  ),
  units: [
    {
      title: t("Preliminaries", "预备知识"),
      modules: [
        {
          title: t("Vector Geometry", "向量几何"),
          topics: [
            "the-vector-equation-of-a-line",
            "the-parametric-equations-of-a-line",
            "the-cartesian-equation-of-a-line",
            "the-vector-equation-of-a-plane",
            "the-cartesian-equation-of-a-plane",
            "the-parametric-equations-of-a-plane",
            "the-intersection-of-two-planes",
            "the-shortest-distance-between-a-plane-and-a-point",
            "the-intersection-between-a-line-and-a-plane",
          ],
        },
        {
          title: t("Introduction to Set Theory", "集合论初步"),
          topics: [
            "special-sets",
            "statements-and-predicates",
            "equivalent-sets",
            "the-constructive-definition-of-a-set",
            "the-conditional-definition-of-a-set",
            "describing-sets-using-set-builder-notation",
            "describing-planar-regions-using-set-builder-notation",
            "cardinality-of-finite-sets",
            "infinite-sets",
            "subsets",
          ],
        },
        {
          title: t("Set Operations", "集合运算"),
          topics: [
            "the-difference-of-sets",
            "set-complements",
            "the-cartesian-product",
            "visualizing-cartesian-products",
            "indexed-sets",
            "sets-and-functions",
          ],
        },
      ],
    },
    {
      title: t("Matrices", "矩阵"),
      modules: [
        {
          title: t("Gaussian Elimination", "高斯消元法"),
          topics: [
            "systems-of-equations-as-augmented-matrices",
            "row-echelon-form",
            "solving-systems-of-equations-using-back-substitution",
            "elementary-row-operations",
            "creating-rows-or-columns-containing-zeros-using-gaussian-elimination",
            "solving-2x2-systems-of-equations-using-gaussian-elimination",
            "solving-2x2-singular-systems-of-equations-using-gaussian-elimination",
            "solving-3x3-systems-of-equations-using-gaussian-elimination",
            "identifying-the-pivot-columns-of-a-matrix",
            "solving-3x3-singular-systems-of-equations-using-gaussian-elimination",
            "reduced-row-echelon-form",
            "gaussian-elimination-for-nxm-systems-of-equations",
          ],
        },
        {
          title: t("Elementary Matrices", "初等矩阵"),
          topics: [
            "elementary-2x2-matrices",
            "row-operations-on-2x2-matrices-as-products-of-elementary-matrices",
            "elementary-3x3-matrices",
            "row-operations-on-3x3-matrices-as-products-of-elementary-matrices",
          ],
        },
        {
          title: t("The Inverse of a Matrix", "逆矩阵"),
          topics: [
            "the-invertible-matrix-theorem-in-terms-of-2x2-systems-of-equations",
            "finding-the-inverse-of-a-2x2-matrix-using-row-operations",
            "finding-the-inverse-of-a-3x3-matrix-using-row-operations",
            "finding-the-inverse-of-an-nxn-square-matrix-using-row-operations",
            "matrices-with-easy-to-find-inverses",
          ],
        },
        {
          title: t("Determinants", "行列式"),
          topics: [
            "the-determinant-of-an-nxn-matrix",
            "finding-determinants-using-laplace-expansions",
            "basic-properties-of-determinants",
            "further-properties-of-determinants",
            "row-and-column-operations-on-determinants",
            "conditions-when-a-determinant-equals-zero",
            "finding-determinants-using-row-and-column-operations",
            "cramers-rule-for-2x2-systems-of-linear-equations",
          ],
        },
        {
          title: t("LU Factorization", "LU 分解"),
          topics: [
            "triangular-matrices",
            "lu-factorization-of-2x2-matrices",
            "lu-factorization-of-3x3-matrices",
            "lu-factorization-of-nxn-matrices",
            "solving-systems-of-equations-using-lu-factorization",
          ],
        },
      ],
    },
    {
      title: t("Vector Spaces", "向量空间"),
      modules: [
        {
          title: t("Vectors in N-Dimensional Space", "n 维空间中的向量"),
          topics: [
            "vectors-in-n-dimensional-euclidean-space",
            "linear-combinations-of-vectors-in-n-dimensional-euclidean-space",
            "linear-span-of-vectors-in-n-dimensional-euclidean-space",
            "linear-dependence-and-independence",
          ],
        },
        {
          title: t("Subspaces of N-Dimensional Space", "n 维空间的子空间"),
          topics: [
            "subspaces-of-n-dimensional-space",
            "subspaces-of-n-dimensional-space-geometric-interpretation",
            "the-column-space-of-a-matrix",
            "the-null-space-of-a-matrix",
          ],
        },
        {
          title: t("Bases of N-Dimensional Space", "n 维空间的基"),
          topics: [
            "finding-a-basis-of-a-span",
            "finding-a-basis-of-the-column-space-of-a-matrix",
            "finding-a-basis-of-the-null-space-of-a-matrix",
            "expressing-the-coordinates-of-a-vector-in-a-given-basis",
            "writing-vectors-in-different-bases",
            "the-change-of-coordinates-matrix",
            "changing-a-basis-using-the-change-of-coordinates-matrix",
          ],
        },
        {
          title: t("Dimension and Rank in N-Dimensional Space", "n 维空间的维数与秩"),
          topics: [
            "the-dimension-of-a-span",
            "the-rank-of-a-matrix",
            "the-dimension-of-the-null-space-of-a-matrix",
            "the-invertible-matrix-theorem-in-terms-of-dimension-rank-and-nullity",
            "the-rank-nullity-theorem",
          ],
        },
        {
          title: t("Abstract Vector Spaces", "抽象向量空间"),
          topics: [
            "introduction-to-abstract-vector-spaces",
            "defining-abstract-vector-spaces",
            "linear-independence-in-abstract-vector-spaces",
            "subspaces-of-abstract-vector-spaces",
            "bases-in-abstract-vector-spaces",
            "the-coordinates-of-a-vector-relative-to-a-basis-in-abstract-vector-spaces",
            "dimension-in-abstract-vector-spaces",
          ],
        },
      ],
    },
    {
      title: t("Linear Transformations", "线性变换"),
      modules: [
        {
          title: t("Linear Transformations", "线性变换"),
          topics: [
            "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis",
            "kernel-of-a-linear-transformation",
            "image-and-rank-of-a-linear-transformation",
            "image-of-a-linear-transformation-in-the-cartesian-plane",
            "invertible-matrix-theorem-in-terms-of-linear-transformations",
            "rank-nullity-theorem-in-terms-of-linear-transformations",
          ],
        },
        {
          title: t("Linear Maps and Their Matrix Representations", "线性映射及其矩阵表示"),
          topics: [
            "matrix-of-a-linear-transformation-relative-to-a-basis",
            "connections-between-matrix-representations-of-a-linear-transformation",
            "linear-maps-between-two-different-vector-spaces",
            "matrix-of-a-linear-map-relative-to-two-bases",
          ],
        },
      ],
    },
    {
      title: t("Diagonalization of Matrices", "矩阵对角化"),
      modules: [
        {
          title: t("Eigenvectors and Eigenvalues", "特征向量与特征值"),
          topics: [
            "eigenvalues-and-eigenvectors-of-a-2x2-matrix",
            "calculating-the-eigenvalues-of-a-2x2-matrix",
            "calculating-the-eigenvectors-of-a-2x2-matrix",
            "characteristic-equation-of-a-matrix",
            "cayley-hamilton-theorem",
            "calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues",
            "calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case",
            "invertible-matrix-theorem-in-terms-of-eigenvalues",
          ],
        },
        {
          title: t("Diagonalization", "对角化"),
          topics: [
            "diagonalizing-a-2x2-matrix",
            "properties-of-diagonalization",
            "diagonalizing-a-3x3-matrix-with-distinct-eigenvalues",
            "diagonalizing-a-3x3-matrix-in-the-general-case",
          ],
        },
        {
          title: t("Real Matrices With Complex Eigenvalues", "具有复特征值的实矩阵"),
          topics: [
            "vectors-over-the-complex-numbers",
            "matrices-over-the-complex-numbers",
            "finding-complex-eigenvalues-of-real-2x2-matrices",
            "finding-complex-eigenvectors-of-real-2x2-matrices",
          ],
        },
        {
          title: t("Generalized Eigenvectors", "广义特征向量"),
          topics: [
            "nilpotent-and-idempotent-matrices",
            "generalized-eigenvectors",
            "ranks-of-generalized-eigenvectors",
            "finding-generalized-eigenvectors-of-specific-ranks",
          ],
        },
      ],
    },
    {
      title: t("Multivariable Functions", "多元函数"),
      modules: [
        {
          title: t("Introduction to Multivariable Functions", "多元函数入门"),
          topics: [
            "interior-and-boundary-points",
            "interiors-and-boundaries-of-sets",
            "open-and-closed-sets",
            "the-domain-of-a-multivariable-function",
            "level-curves",
            "level-surfaces",
            "limits-and-continuity-of-multivariable-functions",
          ],
        },
        {
          title: t("Quadric Surfaces and Cylinders", "二次曲面与柱面"),
          topics: [
            "ellipsoids",
            "hyperboloids",
            "paraboloids",
            "elliptic-cones",
            "cylinders",
            "intersections-of-lines-and-planes-with-surfaces",
            "identifying-quadric-surfaces",
          ],
        },
        {
          title: t("Partial Derivatives", "偏导数"),
          topics: [
            "introduction-to-partial-derivatives",
            "computing-partial-derivatives-using-the-rules-of-differentiation",
            "geometric-interpretations-of-partial-derivatives",
            "partial-differentiability-of-multivariable-functions",
            "higher-order-partial-derivatives",
            "equality-of-mixed-partial-derivatives",
            "tangent-planes-to-surfaces",
            "linearization-of-multivariable-functions",
            "differentiating-under-the-integral-sign",
          ],
        },
        {
          title: t("The Gradient Vector", "梯度向量"),
          topics: [
            "the-gradient-vector",
            "the-gradient-as-a-normal-vector",
            "tangent-lines-to-level-curves",
            "tangent-planes-to-level-surfaces",
            "directional-derivatives",
            "the-multivariable-mean-value-theorem",
          ],
        },
        {
          title: t("Plane Transformations", "平面变换"),
          topics: [
            "affine-transformations",
            "the-image-of-an-affine-transformation",
            "the-inverse-of-an-affine-transformation",
            "nonlinear-transformations-of-plane-regions",
            "polar-coordinate-transformations",
            "transformations-of-regions-between-curves",
          ],
        },
        {
          title: t("Differentiation", "多元微分"),
          topics: [
            "the-jacobian",
            "the-inverse-function-theorem",
            "the-jacobian-of-a-three-dimensional-transformation",
            "the-derivative-of-a-multivariable-function",
            "symmetric-matrices",
            "the-second-derivative-of-a-multivariable-function",
            "second-degree-taylor-polynomials-of-multivariable-functions",
          ],
        },
        {
          title: t("The Multivariable Chain Rule", "多元链式法则"),
          topics: ["the-multivariable-chain-rule", "the-multivariable-chain-rule-in-vector-form", "differentials"],
        },
      ],
    },
    {
      title: t("Vector Functions and Vector Fields", "向量函数与向量场"),
      modules: [
        {
          title: t("Vector-Valued Functions", "向量值函数"),
          topics: [
            "the-domain-of-a-vector-valued-function",
            "differentiation-rules-for-vector-valued-functions",
            "integration-rules-for-vector-valued-functions",
            "the-arc-length-of-a-vector-valued-function",
            "tangent-vectors-and-tangent-lines-to-curves",
            "unit-tangent-vectors",
            "principal-normal-vectors",
            "binormal-vectors",
            "the-osculating-plane",
            "parameterization-by-arc-length",
          ],
        },
        {
          title: t("Curvature", "曲率"),
          topics: [
            "introduction-to-curvature",
            "finding-curvature-using-the-cross-product",
            "radius-of-curvature",
            "the-curvature-of-a-plane-curve",
          ],
        },
        {
          title: t("Vector Fields", "向量场"),
          topics: [
            "vector-fields",
            "visualizing-vector-fields",
            "gradient-vector-fields",
            "conservative-vector-fields-in-the-cartesian-plane",
            "calculating-potential-functions",
            "simple-closed-and-oriented-curves",
            "connected-and-simply-connected-regions",
            "stream-functions",
          ],
        },
        {
          title: t("Divergence and Curl", "散度与旋度"),
          topics: [
            "the-divergence-of-a-vector-field",
            "properties-of-the-divergence-operator",
            "the-curl-of-a-vector-field",
            "properties-of-the-curl-operator",
          ],
        },
      ],
    },
    {
      title: t("Multiple Integrals", "重积分"),
      modules: [
        {
          title: t("Double Integrals", "二重积分"),
          topics: [
            "double-integrals-over-rectangular-domains",
            "double-integrals-over-non-rectangular-domains",
            "properties-of-double-integrals",
            "type-i-and-ii-regions-in-two-dimensional-space",
            "double-integrals-over-type-i-regions",
            "double-integrals-over-type-ii-regions",
            "double-integrals-over-partitioned-regions",
            "changing-the-order-of-integration-in-double-integrals",
          ],
        },
        {
          title: t("Change of Variables for Double Integrals", "二重积分的变量代换"),
          topics: [
            "double-integrals-in-plane-polar-coordinates",
            "double-integrals-between-polar-curves",
            "computing-areas-using-a-change-of-variables",
            "computing-double-integrals-using-a-change-of-variables",
          ],
        },
      ],
    },
    {
      title: t("Probability & Random Variables", "概率与随机变量"),
      modules: [
        {
          title: t("Probability", "概率"),
          topics: ["the-law-of-total-probability", "extending-the-law-of-total-probability", "bayes-theorem", "extending-bayes-theorem"],
        },
        {
          title: t("Random Variables", "随机变量"),
          topics: [
            "probability-density-functions-of-continuous-random-variables",
            "calculating-probabilities-with-continuous-random-variables",
            "continuous-random-variables-over-infinite-domains",
            "cumulative-distribution-functions-for-continuous-random-variables",
            "median-quartiles-and-percentiles-of-continuous-random-variables",
            "finding-the-mode-of-a-continuous-random-variable",
            "approximating-discrete-random-variables-as-continuous",
            "one-to-one-transformations-of-discrete-random-variables",
            "many-to-one-transformations-of-discrete-random-variables",
          ],
        },
        {
          title: t("Distributions of Two Discrete Random Variables", "二维离散随机变量的分布"),
          topics: [
            "double-summations",
            "joint-distributions-for-discrete-random-variables",
            "the-joint-cdf-of-two-discrete-random-variables",
            "marginal-distributions-for-discrete-random-variables",
            "conditional-distributions-for-discrete-random-variables",
            "independence-of-discrete-random-variables",
          ],
        },
        {
          title: t("Expectation of Random Variables", "随机变量的期望"),
          topics: [
            "expected-values-of-discrete-random-variables",
            "properties-of-expectation-for-discrete-random-variables",
            "variance-of-discrete-random-variables",
            "moments-of-discrete-random-variables",
            "properties-of-variance-for-discrete-random-variables",
            "moments-of-continuous-random-variables",
            "expected-values-of-continuous-random-variables",
            "variance-of-continuous-random-variables",
            "the-rule-of-the-lazy-statistician",
          ],
        },
      ],
    },
    {
      title: t("Continuous Probability Distributions", "连续概率分布"),
      modules: [
        {
          title: t("The Normal Distribution", "正态分布"),
          topics: [
            "the-z-score",
            "the-standard-normal-distribution",
            "symmetry-properties-of-the-standard-normal-distribution",
            "the-normal-distribution",
            "mean-and-variance-of-the-normal-distribution",
            "percentage-points-of-the-standard-normal-distribution",
            "modeling-with-the-normal-distribution",
          ],
        },
        {
          title: t("The Exponential Distribution", "指数分布"),
          topics: [
            "the-exponential-distribution",
            "modeling-with-the-exponential-distribution",
            "mean-and-variance-of-the-exponential-distribution",
          ],
        },
      ],
    },
    {
      title: t("First-Order Differential Equations", "一阶微分方程"),
      modules: [
        {
          title: t("First-Order ODEs", "一阶常微分方程"),
          topics: [
            "solving-first-order-odes-using-separation-of-variables",
            "solving-first-order-ivps-using-separation-of-variables",
            "introduction-to-first-order-linear-odes",
            "general-solutions-of-first-order-linear-odes",
            "solving-first-order-linear-odes-with-exponential-forcing",
            "solving-first-order-linear-odes-with-sinusoidal-forcing",
            "solving-first-order-linear-odes-using-integrating-factors",
            "solving-first-order-odes-by-substitution",
            "further-solving-first-order-odes-by-substitution",
            "reducing-odes-to-first-order-linear-by-substitution",
            "phase-lines-of-first-order-odes",
            "classifying-equilibrium-solutions-of-first-order-odes",
          ],
        },
      ],
    },
    {
      title: t("Modeling With First-Order Differential Equations", "一阶微分方程建模"),
      modules: [
        {
          title: t("Applications of First-Order ODEs", "一阶常微分方程的应用"),
          topics: [
            "modeling-with-first-order-odes",
            "further-modeling-with-first-order-odes",
            "modeling-mixture-problems-with-first-order-separable-odes",
            "modeling-mixture-problems-with-first-order-linear-odes",
            "orthogonal-trajectories",
          ],
        },
        {
          title: t("Growth and Decay Models With First-Order ODEs", "一阶常微分方程的增长与衰减模型"),
          topics: [
            "exponential-growth-and-decay-models-with-first-order-odes",
            "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
            "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems",
            "inhibited-growth-models-with-first-order-odes",
            "inhibited-decay-models-with-first-order-odes",
            "logistic-growth-models-with-first-order-odes",
            "qualitative-analysis-of-the-logistic-growth-equation",
            "solving-the-logistic-growth-equation",
          ],
        },
        {
          title: t("Physical Applications of First-Order ODEs", "一阶常微分方程的物理应用"),
          topics: [
            "velocity-and-acceleration-as-functions-of-displacement",
            "determining-properties-of-objects-described-as-functions-of-displacement",
            "falling-body-problems-with-linear-drag",
            "falling-body-problems-with-quadratic-drag",
            "newtons-law-of-universal-gravitation",
            "modeling-escape-velocity-with-first-order-odes",
            "modeling-rl-circuits-with-first-order-odes",
            "modeling-rc-circuits-with-first-order-odes",
          ],
        },
      ],
    },
    {
      title: t("Linear Differential Equations", "线性微分方程"),
      modules: [
        {
          title: t("Theory of Solutions to Linear ODEs", "线性常微分方程解的理论"),
          topics: [
            "differential-operators",
            "linear-differential-operators",
            "introduction-to-second-order-linear-odes",
            "the-superposition-principle",
            "reduction-of-order",
            "linear-independence-of-solutions-to-homogeneous-odes",
            "general-solutions-of-linear-odes",
            "abels-identity",
          ],
        },
        {
          title: t("Second-Order Linear ODEs With Constant Coefficients", "常系数二阶线性常微分方程"),
          topics: [
            "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
            "second-order-homogeneous-odes-characteristic-equations-with-repeated-roots",
            "second-order-homogeneous-odes-characteristic-equations-with-complex-roots",
            "second-order-homogeneous-initial-value-problems",
            "second-order-inhomogeneous-odes-with-polynomial-forcing",
            "second-order-inhomogeneous-odes-with-exponential-forcing",
            "second-order-inhomogeneous-odes-with-sinusoidal-forcing",
          ],
        },
        {
          title: t("Modeling With Second-Order ODEs", "二阶常微分方程建模"),
          topics: [
            "simple-harmonic-oscillators",
            "damped-oscillators",
            "forced-oscillators",
            "resonance-in-vibrating-systems",
            "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes",
            "modeling-current-in-rcl-circuits-with-second-order-odes",
          ],
        },
        {
          title: t("Variation of Parameters", "常数变易法"),
          topics: [
            "variation-of-parameters-for-first-order-linear-odes",
            "variation-of-parameters-for-second-order-odes",
            "solving-second-order-odes-using-variation-of-parameters",
          ],
        },
      ],
    },
  ],
};

/** mathematicalMethodsForThePhysicalSciencesII develops mathematical methods for the physical sciences. */
export const mathematicalMethodsForThePhysicalSciencesII: CourseDef = {
  id: "mathematical-methods-for-the-physical-sciences-ii",
  title: t("Mathematical Methods for the Physical Sciences II", "物理科学的数学方法二"),
  description: t(
    "Advanced mathematical analysis and methods for the physical sciences: inner product spaces, orthogonal projections and the Gram-Schmidt process; quadratic forms, symmetric matrix diagonalization and singular value decomposition; triple integrals and vector calculus (line integrals, circulation and flux, Green's theorem, surface integrals and divergence/Stokes applications); systems of linear differential equations and phase portraits; Laplace transforms; boundary value problems and Fourier series; numerical methods for differential equations; and multivariate distributions, covariance and the central limit theorem.",
    "物理科学的高级数学分析与方法：内积空间、正交投影与施密特正交化；二次型、实对称矩阵对角化与奇异值分解；三重积分与向量微积分（曲线积分、环量与通量、格林公式、曲面积分及散度与斯托克斯应用）；线性微分方程组与相图；拉普拉斯变换；边值问题与傅里叶级数；微分方程的数值近似解法；以及多元概率分布、协方差与中心极限定理。",
  ),
  units: [
    {
      title: t("Projections", "投影与正交"),
      modules: [
        {
          title: t("Inner Products", "内积"),
          topics: [
            "dot-product-in-n-dimensional-euclidean-space",
            "norm-of-a-vector-in-n-dimensional-euclidean-space",
            "inner-product-spaces",
            "inner-product-in-vector-spaces-over-the-complex-numbers",
            "norm-of-a-vector-in-inner-product-spaces",
          ],
        },
        {
          title: t("Orthogonality", "正交性"),
          topics: [
            "orthogonal-vectors-in-euclidean-spaces",
            "orthogonal-vectors-in-inner-product-spaces",
            "cauchy-schwarz-inequality-and-angle-between-two-vectors",
            "pythagorean-theorem-and-triangle-inequality-in-inner-product-spaces",
            "orthogonal-complements",
            "orthogonal-sets-in-euclidean-spaces",
            "orthogonal-sets-in-inner-product-spaces",
            "orthogonal-matrices",
            "orthogonal-linear-transformations",
            "four-fundamental-subspaces-of-a-matrix",
          ],
        },
        {
          title: t("Orthogonal Projections", "正交投影"),
          topics: [
            "projecting-vectors-onto-one-dimensional-subspaces",
            "components-of-a-vector-with-respect-to-an-orthogonal-or-orthonormal-basis",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-orthogonal-bases",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases",
            "projecting-vectors-onto-subspaces-in-euclidean-spaces-arbitrary-bases-applications",
            "projection-matrices-linear-transformations-and-their-properties",
            "projecting-vectors-onto-subspaces-in-inner-product-spaces",
          ],
        },
        {
          title: t("Orthogonalization Processes", "正交化方法"),
          topics: ["gram-schmidt-process-for-two-vectors", "gram-schmidt-process-in-the-general-case", "qr-factorization"],
        },
      ],
    },
    {
      title: t("Quadratic Forms", "二次型"),
      modules: [
        {
          title: t("Diagonalization of Symmetric Matrices", "对称矩阵的对角化"),
          topics: ["diagonalization-of-2x2-symmetric-matrices", "diagonalization-of-3x3-symmetric-matrices", "spectral-theorem"],
        },
        {
          title: t("Quadratic Forms", "二次型"),
          topics: [
            "bilinear-forms",
            "quadratic-forms",
            "change-of-variables-in-quadratic-forms",
            "positive-definite-and-negative-definite-quadratic-forms",
            "constrained-optimization-of-quadratic-forms",
            "constrained-optimization-of-quadratic-forms-determining-where-extrema-are-attained",
          ],
        },
        {
          title: t("Singular Value Decomposition", "奇异值分解"),
          topics: [
            "singular-values-of-a-matrix",
            "computing-the-singular-values-of-a-matrix",
            "singular-value-decomposition-of-2x2-matrices",
            "singular-value-decomposition-of-2x2-matrices-with-zero-or-repeated-eigenvalues",
            "singular-value-decomposition-of-larger-matrices",
            "singular-value-decomposition-and-the-pseudoinverse-matrix",
          ],
        },
      ],
    },
    {
      title: t("Applications of Linear Algebra", "线性代数的应用"),
      modules: [
        {
          title: t("Linear Least-Squares Problems", "线性最小二乘问题"),
          topics: [
            "least-squares-solution-of-a-linear-system-without-collinearity",
            "least-squares-solution-of-a-linear-system-with-collinearity",
            "finding-a-least-squares-solution-using-qr-factorization",
            "weighted-least-squares",
          ],
        },
      ],
    },
    {
      title: t("Multiple Integrals", "重积分"),
      modules: [
        {
          title: t("Triple Integrals", "三重积分"),
          topics: [
            "repeated-integrals-in-three-dimensions",
            "triple-integrals-over-rectangular-domains",
            "type-i-ii-and-iii-regions-in-three-dimensional-space",
            "triple-integrals-over-type-i-regions",
            "triple-integrals-over-type-ii-regions",
            "triple-integrals-over-type-iii-regions",
            "calculating-volumes-of-solids-using-triple-integrals",
            "changing-the-order-of-integration-in-triple-integrals-changing-projection",
            "changing-the-order-of-integration-in-triple-integrals-changing-region",
          ],
        },
        {
          title: t("Change of Variables for Triple Integrals", "三重积分的变量代换"),
          topics: [
            "cylindrical-polar-coordinates",
            "surfaces-in-cylindrical-polar-coordinates",
            "spherical-polar-coordinates",
            "surfaces-in-spherical-polar-coordinates",
            "the-multivariable-chain-rule-with-polar-coordinates",
            "triple-integrals-in-cylindrical-polar-coordinates",
            "triple-integrals-in-spherical-polar-coordinates",
            "computing-triple-integrals-using-a-change-of-variables",
          ],
        },
      ],
    },
    {
      title: t("Line Integrals", "曲线积分"),
      modules: [
        {
          title: t("Line Integrals of Scalar Functions", "标量函数的曲线积分"),
          topics: [
            "line-integrals-of-scalar-functions",
            "properties-of-line-integrals-of-scalar-functions",
            "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-x",
            "line-integrals-of-scalar-functions-over-paths-expressed-as-functions-of-y",
          ],
        },
        {
          title: t("Line Integrals of Scalar Functions Over Parametric Curves", "参数曲线上的标量曲线积分"),
          topics: [
            "line-integrals-of-scalar-functions-over-line-segments",
            "line-integrals-of-scalar-functions-over-circles",
            "line-integrals-of-scalar-functions-over-ellipses",
            "further-properties-of-line-integrals-of-scalar-functions",
            "line-integrals-of-scalar-functions-over-polar-curves",
          ],
        },
        {
          title: t("Line Integrals With Respect to X and Y", "对坐标的曲线积分"),
          topics: [
            "line-integrals-with-respect-to-x-and-y",
            "properties-of-line-integrals-with-respect-to-x-and-y",
            "sums-of-line-integrals-with-respect-to-x-and-y-over-parametric-curves",
            "sums-of-line-integrals-with-respect-to-x-and-y",
          ],
        },
        {
          title: t("Line Integrals of Vector-Valued Functions", "向量线积分与做功"),
          topics: [
            "line-integrals-of-vector-valued-functions-over-parametric-curves",
            "line-integrals-of-vector-valued-functions-over-general-curves",
            "interpreting-line-integrals-of-vector-valued-functions",
            "properties-of-line-integrals-of-vector-valued-functions",
            "work-done-by-a-force-field",
            "the-fundamental-theorem-of-line-integrals",
          ],
        },
        {
          title: t("Path Independence and Conservation", "路径无关性与势函数"),
          topics: [
            "path-independence-of-line-integrals",
            "conservative-vector-fields-and-closed-paths",
            "calculating-potential-functions-for-line-integrals",
            "line-integrals-of-conservative-vector-fields-in-three-dimensions",
            "conservation-of-mechanical-energy",
          ],
        },
        {
          title: t("Circulation and Flux", "环量与通量"),
          topics: [
            "outward-pointing-unit-normal-vectors-in-2d",
            "circulation",
            "flux-in-two-dimensional-vector-fields",
            "calculating-flux-in-two-dimensional-vector-fields",
            "source-free-vector-fields",
          ],
        },
        {
          title: t("Green's Theorem", "格林公式"),
          topics: [
            "circulation-and-flux-across-simple-closed-plane-curves",
            "greens-theorem-in-circulation-curl-form",
            "greens-theorem-in-polar-coordinates",
            "calculating-areas-using-greens-theorem",
            "greens-theorem-in-flux-divergence-form",
            "greens-theorem-on-regions-with-holes",
          ],
        },
      ],
    },
    {
      title: t("Surface Integrals", "曲面积分"),
      modules: [
        {
          title: t("Parametric Surfaces", "参数曲面"),
          topics: [
            "parametric-surfaces",
            "tangent-planes-to-parametric-surfaces",
            "parametrizations-of-ellipsoids-and-cones",
            "parametrizations-of-paraboloids-and-hyperboloids",
            "parametrizations-of-cylinders",
          ],
        },
        {
          title: t("Surface Area", "曲面面积"),
          topics: [
            "surface-areas-of-revolution-rotation-about-the-x-axis",
            "surface-areas-of-revolution-rotation-about-the-y-axis",
            "surface-areas-of-revolution-for-parametric-curves",
            "areas-of-parametric-surfaces",
            "surfaces-of-revolution",
            "areas-of-surfaces",
          ],
        },
        {
          title: t("Surface Integrals", "曲面积分"),
          topics: [
            "surface-integrals-over-parametric-surfaces",
            "surface-integrals-over-cartesian-surfaces",
            "flux-in-three-dimensional-vector-fields",
            "flux-through-closed-surfaces",
            "calculating-flux-through-parametric-surfaces",
            "calculating-flux-through-cartesian-surfaces",
            "calculating-flux-through-closed-surfaces",
            "the-divergence-theorem",
            "stokes-theorem",
          ],
        },
      ],
    },
    {
      title: t("Applications of Multivariable Calculus", "多元微积分的应用"),
      modules: [
        {
          title: t("Vector Mechanics", "向量力学"),
          topics: [
            "velocity-and-acceleration-as-functions-of-displacement",
            "determining-properties-of-objects-described-as-functions-of-displacement",
            "the-components-of-acceleration",
            "newtons-second-law",
            "applying-newtons-second-law-in-the-plane",
            "the-work-energy-principle",
            "circular-motion-about-the-origin",
          ],
        },
        {
          title: t("Optimization", "最优化"),
          topics: [
            "global-vs-local-extrema-and-critical-points-of-multivariable-functions",
            "the-second-partial-derivatives-test",
            "calculating-global-extrema-of-multivariable-functions",
            "lagrange-multipliers-with-one-constraint",
            "lagrange-multipliers-with-multiple-constraints",
            "optimizing-multivariable-functions-using-lagrange-multipliers",
          ],
        },
        {
          title: t("Applications of Multiple Integrals", "重积分的应用"),
          topics: [
            "the-average-value-of-a-multivariable-function",
            "density-mass-and-charge-of-plane-laminas",
            "moments-and-center-of-mass",
            "moments-and-centers-of-mass-of-thin-rods",
            "moments-and-centers-of-mass-of-plane-laminas",
            "moments-of-inertia-of-laminas-about-the-coordinate-axes",
            "moments-of-inertia-of-laminas-about-other-axes",
            "calculating-the-radius-of-gyration-of-a-plane-lamina",
            "the-parallel-axis-theorem",
          ],
        },
      ],
    },
    {
      title: t("Systems of Differential Equations", "微分方程组"),
      modules: [
        {
          title: t("Systems of ODEs", "常微分方程组"),
          topics: [
            "introduction-to-systems-of-linear-odes",
            "expressing-homogeneous-odes-as-first-order-systems",
            "expressing-inhomogeneous-odes-as-first-order-systems",
            "linear-independence-for-homogeneous-systems-of-odes",
            "general-solutions-of-first-order-linear-systems-of-odes",
          ],
        },
        {
          title: t("Solving Systems of Linear ODEs", "线性常微分方程组的求解"),
          topics: [
            "solving-decoupled-homogeneous-systems-of-odes",
            "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues",
            "solving-homogeneous-systems-of-odes-with-distinct-eigenvalues-and-initial-conditions",
            "solving-homogeneous-systems-of-odes-with-repeated-eigenvalues",
            "solving-homogeneous-systems-of-odes-with-complex-eigenvalues",
            "solving-inhomogeneous-systems-of-odes",
          ],
        },
        {
          title: t("Phase Portraits for Systems of Linear ODEs", "线性常微分方程组的相图"),
          topics: [
            "phase-planes-and-phase-portraits",
            "equilibrium-points-and-stability-for-systems-of-odes",
            "phase-portraits-for-decoupled-linear-systems",
            "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues",
            "phase-portraits-for-linear-systems-with-repeated-eigenvalues",
            "phase-portraits-for-linear-systems-with-zero-eigenvalues",
            "phase-portraits-for-linear-systems-with-complex-eigenvalues",
            "shifted-systems-of-odes",
            "linear-approximations-near-equilibria",
          ],
        },
        {
          title: t("Solving Systems of ODEs Using Matrix Methods", "用矩阵方法求解常微分方程组"),
          topics: [
            "matrix-exponentials",
            "fundamental-matrices",
            "solving-homogeneous-systems-of-odes-using-matrix-methods",
            "solving-inhomogeneous-systems-of-odes-using-matrix-methods",
            "solving-systems-of-odes-using-variation-of-parameters",
          ],
        },
        {
          title: t("Modeling With Systems of Linear ODEs", "线性常微分方程组建模"),
          topics: ["the-lotka-volterra-predator-prey-model", "the-lotka-volterra-model-with-carrying-capacity"],
        },
      ],
    },
    {
      title: t("Laplace Transforms", "拉普拉斯变换"),
      modules: [
        {
          title: t("Laplace Transforms", "拉普拉斯变换"),
          topics: [
            "the-floor-and-ceiling-functions",
            "the-unit-step-function",
            "piecewise-continuity-and-piecewise-smoothness",
            "introduction-to-laplace-transforms",
            "linearity-of-laplace-transforms",
            "laplace-transforms-of-piecewise-continuous-functions",
            "the-smoothness-property-of-laplace-transforms",
            "laplace-transforms-of-derivatives",
            "laplace-transforms-of-integrals",
            "the-first-shifting-theorem-of-laplace-transforms",
            "the-second-shifting-theorem-of-laplace-transforms",
            "inverse-laplace-transforms",
          ],
        },
        {
          title: t("Solving Linear ODEs Using Laplace Transforms", "用拉普拉斯变换求解线性常微分方程"),
          topics: [
            "solving-first-order-odes-using-laplace-transforms",
            "solving-first-order-odes-with-time-delayed-forcing-using-laplace-transforms",
            "solving-second-order-odes-using-laplace-transforms",
            "solving-second-order-odes-with-time-delayed-forcing-using-laplace-transforms",
            "solving-homogeneous-systems-of-odes-using-laplace-transforms",
            "solving-inhomogeneous-systems-of-odes-using-laplace-transforms",
          ],
        },
      ],
    },
    {
      title: t("Boundary Value Problems", "边值问题"),
      modules: [
        {
          title: t("Boundary Value Problems", "边值问题"),
          topics: [
            "introduction-to-boundary-value-problems",
            "second-order-homogeneous-boundary-value-problems",
            "second-order-inhomogeneous-boundary-value-problems",
            "eigenvalues-and-eigenfunctions-of-homogeneous-bvps",
          ],
        },
        {
          title: t("Fourier Series", "傅里叶级数"),
          topics: [
            "introduction-to-fourier-series",
            "properties-of-fourier-series",
            "fourier-sine-series",
            "fourier-cosine-series",
            "fourier-series-of-arbitrary-period",
            "convergence-of-fourier-series",
            "differentiating-and-integrating-fourier-series",
            "solving-odes-using-fourier-series",
            "solving-ivps-using-fourier-series",
            "solving-bvps-using-fourier-series",
          ],
        },
      ],
    },
    {
      title: t("Approximating Solutions to Differential Equations", "微分方程的近似解法"),
      modules: [
        {
          title: t("Euler's Method", "欧拉方法"),
          topics: [
            "eulers-method-calculating-one-step",
            "eulers-method-calculating-multiple-steps",
            "the-modified-euler-method",
            "eulers-method-for-systems-of-odes",
            "eulers-method-for-second-order-odes",
          ],
        },
        {
          title: t("Higher-Order Numerical Methods", "高阶数值方法"),
          topics: ["the-rk4-method", "the-abm2-method"],
        },
        {
          title: t("Implicit Numerical Methods", "隐式数值方法"),
          topics: [
            "the-implicit-euler-method",
            "the-trapezoidal-method",
            "newtons-method",
            "using-the-implicit-euler-method-with-newtons-method",
            "using-the-trapezoidal-method-with-newtons-method",
          ],
        },
        {
          title: t("Analyzing Numerical Methods", "数值方法的分析"),
          topics: ["big-o-notation", "error-in-numerical-methods", "order-of-numerical-methods", "stability-of-numerical-methods"],
        },
      ],
    },
    {
      title: t("Combining Random Variables", "随机变量的组合"),
      modules: [
        {
          title: t("Distributions of Two Continuous Random Variables", "二维连续随机变量的分布"),
          topics: [
            "joint-distributions-for-continuous-random-variables",
            "marginal-distributions-for-continuous-random-variables",
            "independence-of-continuous-random-variables",
            "conditional-distributions-for-continuous-random-variables",
            "the-joint-cdf-of-two-continuous-random-variables",
            "properties-of-the-joint-cdf-of-two-continuous-random-variables",
            "the-bivariate-normal-distribution",
          ],
        },
        {
          title: t("Combining Normal Random Variables", "正态随机变量的组合"),
          topics: [
            "combining-two-normally-distributed-random-variables",
            "combining-multiple-normally-distributed-random-variables",
            "iid-normal-random-variables",
          ],
        },
        {
          title: t("Expectation for Multivariate Distributions", "多维分布的期望"),
          topics: [
            "expected-values-of-sums-and-products-of-random-variables",
            "variance-of-sums-of-independent-random-variables",
            "computing-expected-values-from-joint-distributions",
            "conditional-expectation-for-discrete-random-variables",
            "conditional-variance-for-discrete-random-variables",
            "the-rule-of-the-lazy-statistician-for-two-random-variables",
          ],
        },
        {
          title: t("Covariance of Random Variables", "随机变量的协方差"),
          topics: [
            "the-covariance-of-two-random-variables",
            "variance-of-sums-of-random-variables",
            "the-covariance-matrix",
            "the-correlation-coefficient-for-two-random-variables",
          ],
        },
        {
          title: t("The Central Limit Theorem", "中心极限定理"),
          topics: [
            "the-sample-mean",
            "sampling-distributions",
            "variance-of-sample-means",
            "sample-means-from-normal-populations",
            "the-central-limit-theorem",
          ],
        },
      ],
    },
  ],
};

/** sixthGradeMath is the Common Core-aligned 6th Grade Math course. */
export const sixthGradeMath: CourseDef = {
  id: "6th-grade-math",
  title: t("6th Grade Math", "六年级数学"),
  description: t(
    "Ratios, ratio tables and graphs, tape diagrams, unit rates, percentages, and unit conversions; whole number and fraction division and decimal operations; rational numbers, absolute value, the coordinate plane, and exponents; algebraic expressions, one-step equations, inequalities, and two-variable equations; areas of polygons, lines of symmetry, nets, surface area, volumes with fractional edges, and coordinate geometry; and statistics with measures of center and spread, outliers, frequency tables, dot plots, box plots, and histograms.",
    "比、比例表与比的图像、线段图、单位率、百分比与单位换算；整数除法、分数除法与小数运算；有理数、绝对值、坐标平面与指数；代数式、一步方程、不等式与二元方程；多边形的面积、对称轴、展开图、表面积、棱长为分数的体积与坐标几何；以及集中趋势与离散程度的量、离群值、频数表、点图、箱线图与直方图等统计内容。",
  ),
  units: [
    {
      title: t("Ratios & Proportional Relationships", "比与比例关系"),
      modules: [
        {
          title: t("Ratios", "比"),
          topics: [
            "ratios",
            "equivalent-ratios",
            "writing-ratios-using-fractions",
            "comparing-ratios",
            "approximating-ratios",
            "reasoning-with-equivalent-ratios",
            "further-reasoning-with-equivalent-ratios",
          ],
        },
        {
          title: t("Representing Ratios", "比的表示"),
          topics: ["ratio-tables", "graphing-ratios", "tape-diagrams"],
        },
        {
          title: t("Unit Rates", "单位率"),
          topics: ["unit-rates", "solving-problems-using-unit-rates", "speed-as-a-unit-rate"],
        },
        {
          title: t("Introduction to Percentages", "百分比初步"),
          topics: [
            "understanding-percentages-using-models",
            "converting-between-percentages-and-fractions",
            "converting-between-percentages-and-decimals",
            "comparing-fractions-percents-and-decimals",
          ],
        },
        {
          title: t("Solving Problems With Percentages", "用百分比解决问题"),
          topics: [
            "finding-a-percentage-given-two-numbers",
            "finding-part-of-a-number-given-a-whole-and-a-percentage",
            "finding-a-total-given-a-part-and-a-percentage",
            "finding-a-percentage-given-two-numbers-word-problems",
            "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems",
          ],
        },
        {
          title: t("Unit Conversions", "单位换算"),
          topics: [
            "converting-metric-units-of-length-to-larger-units",
            "converting-customary-units-of-length-to-larger-units",
            "converting-units-of-length-to-larger-units-using-long-division",
            "converting-units-of-volume-to-larger-units",
            "converting-units-of-mass-to-larger-units",
            "converting-units-of-time-to-larger-units",
          ],
        },
      ],
    },
    {
      title: t("The Number System: Whole Number Division", "数系：整数除法"),
      modules: [
        {
          title: t("Dividing Whole Numbers by One-Digit Numbers", "一位数除多位数"),
          topics: [
            "two-digit-by-one-digit-division",
            "three-digit-by-one-digit-division",
            "four-digit-by-one-digit-division",
            "using-fractions-to-represent-division-of-whole-numbers",
            "dividing-numbers-by-one-digit-numbers-with-rounding",
            "dividing-numbers-by-one-digit-numbers-interpreting-the-remainder",
          ],
        },
        {
          title: t("Dividing Whole Numbers by Two-Digit Numbers", "两位数除多位数"),
          topics: [
            "three-digit-by-two-digit-division",
            "four-digit-by-two-digit-division",
            "dividing-by-two-digit-numbers-by-connecting-multiplication-and-division",
            "dividing-by-two-digit-numbers-with-remainders-by-connecting-multiplication-and-division",
            "estimating-multi-digit-division",
          ],
        },
      ],
    },
    {
      title: t("The Number System: Dividing Fractions", "数系：分数除法"),
      modules: [
        {
          title: t("Dividing Fractions and Whole Numbers", "分数与整数相除"),
          topics: [
            "reciprocals",
            "dividing-whole-numbers-by-fractions-using-models-whole-number-results",
            "dividing-whole-numbers-by-fractions-using-models-fractional-results",
            "dividing-fractions-by-whole-numbers-using-models",
            "dividing-whole-numbers-by-fractions",
            "dividing-fractions-by-whole-numbers",
            "dividing-fractions-and-whole-numbers-word-problems",
          ],
        },
        {
          title: t("Dividing Fractions", "分数除法"),
          topics: [
            "dividing-fractions-using-models",
            "dividing-fractions",
            "dividing-fractions-word-problems",
            "finding-side-lengths-using-fraction-division",
          ],
        },
        {
          title: t("Dividing Mixed Numbers", "带分数除法"),
          topics: [
            "dividing-mixed-numbers-by-whole-numbers",
            "dividing-mixed-numbers-by-fractions",
            "dividing-whole-numbers-by-mixed-numbers",
            "dividing-fractions-by-mixed-numbers",
            "dividing-mixed-numbers",
            "dividing-mixed-numbers-word-problems",
          ],
        },
      ],
    },
    {
      title: t("The Number System: Decimals", "数系：小数"),
      modules: [
        {
          title: t("Decimal Addition", "小数加减法"),
          topics: [
            "adding-decimals",
            "subtracting-decimals",
            "addition-with-unequal-numbers-of-decimals",
            "subtraction-with-unequal-numbers-of-decimals",
          ],
        },
        {
          title: t("Decimal Multiplication", "小数乘法"),
          topics: [
            "multiplying-a-decimal-by-a-multi-digit-whole-number",
            "multiplying-two-digit-decimals",
            "multiplying-two-digit-decimals-by-three-digit-decimals",
            "multiplying-three-digit-decimals",
          ],
        },
        {
          title: t("Decimal Division", "小数除法"),
          topics: [
            "dividing-decimals-using-place-value-strategies",
            "division-of-whole-numbers-with-decimal-quotients",
            "division-of-whole-numbers-with-decimal-quotients-and-rounding",
            "dividing-decimals-using-the-standard-algorithm",
            "dividing-three-digit-decimals-by-two-digit-decimals",
            "dividing-four-digit-and-five-digit-decimals",
            "estimating-decimal-division",
            "estimating-multi-digit-division-with-decimals",
          ],
        },
      ],
    },
    {
      title: t("The Number System: Rational Numbers", "数系：有理数"),
      modules: [
        {
          title: t("Negative Numbers", "负数"),
          topics: [
            "negative-numbers",
            "absolute-value",
            "comparing-negative-numbers",
            "interpreting-negative-numbers",
            "interpreting-absolute-value",
          ],
        },
        {
          title: t("Rational Numbers", "有理数"),
          topics: [
            "natural-numbers-integers-and-rational-numbers",
            "identifying-rational-numbers-on-a-number-line",
            "comparing-rational-numbers",
            "ordering-rational-numbers",
          ],
        },
        {
          title: t("The Coordinate Plane", "坐标平面"),
          topics: [
            "the-cartesian-coordinate-system",
            "rational-numbers-in-the-coordinate-plane",
            "reflections-of-points-in-the-coordinate-plane",
            "solving-problems-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Exponents", "指数"),
          topics: [
            "introduction-to-exponents",
            "evaluating-exponents",
            "evaluating-larger-exponents",
            "evaluating-exponents-with-fractional-bases",
            "evaluating-exponents-with-decimal-bases",
            "comparing-exponents",
            "evaluating-whole-number-expressions-containing-exponents",
          ],
        },
      ],
    },
    {
      title: t("Expressions & Equations", "式与方程"),
      modules: [
        {
          title: t("Algebraic Expressions", "代数式"),
          topics: [
            "introduction-to-algebraic-expressions",
            "constructing-algebraic-expressions",
            "evaluating-linear-expressions",
            "evaluating-algebraic-expressions",
            "identifying-terms-in-linear-expressions",
            "identifying-coefficients-and-constants",
            "identifying-like-terms-in-linear-expressions",
            "the-greatest-common-factor-of-two-linear-expressions",
          ],
        },
        {
          title: t("Equivalent Expressions", "等价式"),
          topics: [
            "simplifying-linear-expressions",
            "applying-the-distributive-law-to-linear-expressions",
            "factoring-linear-expressions",
            "identifying-equivalent-expressions",
          ],
        },
        {
          title: t("Linear Equations", "一次方程"),
          topics: [
            "identifying-solutions-to-linear-equations",
            "one-step-addition-equations",
            "one-step-subtraction-equations",
            "one-step-multiplication-equations",
            "one-step-multiplication-equations-containing-fractions",
            "one-step-division-equations",
            "modeling-real-world-problems-using-one-step-equations",
            "solving-real-world-problems-using-one-step-equations",
          ],
        },
        {
          title: t("Linear Inequalities", "一次不等式"),
          topics: [
            "identifying-solutions-to-linear-inequalities",
            "representing-inequalities-on-number-lines",
            "modeling-real-world-problems-using-inequalities",
          ],
        },
        {
          title: t("Two-Variable Equations", "二元方程"),
          topics: [
            "introduction-to-two-variable-equations",
            "two-variable-equations-solving-for-the-independent-variable",
            "analyzing-two-variable-equations-using-tables",
            "analyzing-two-variable-equations-using-graphs",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Two-Dimensional Geometry", "平面几何"),
          topics: [
            "units-of-area-and-volume",
            "areas-of-rectangles",
            "classifying-figures-based-on-angles",
            "areas-of-right-triangles",
            "areas-of-triangles",
            "areas-and-perimeters-of-parallelograms",
            "finding-areas-of-polygons-using-decomposition",
            "finding-areas-between-shapes",
            "lines-of-symmetry",
          ],
        },
        {
          title: t("Three-Dimensional Geometry", "立体几何"),
          topics: [
            "identifying-three-dimensional-shapes",
            "faces-vertices-and-edges-of-polyhedrons",
            "nets-of-polyhedrons",
            "finding-surface-areas-using-nets",
            "volumes-of-right-rectangular-prisms",
            "volumes-of-right-rectangular-prisms-word-problems",
            "volumes-of-rectangular-prisms-with-fractional-edge-lengths",
            "volumes-of-rectangular-prisms-with-fractional-edge-lengths-word-problems",
          ],
        },
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "distances-between-points-in-the-coordinate-plane",
            "polygons-in-the-coordinate-plane",
            "finding-areas-and-perimeters-in-the-coordinate-plane",
          ],
        },
      ],
    },
    {
      title: t("Statistics & Probability", "统计与概率"),
      modules: [
        {
          title: t("Summarizing Data", "数据概述"),
          topics: [
            "introduction-to-statistics",
            "the-mean-of-a-data-set",
            "the-median-of-a-data-set",
            "the-mode-of-a-data-set",
            "range-quartiles-and-iqr",
            "mean-absolute-deviation",
            "outliers",
            "removing-outliers",
            "comparing-measures-of-center",
            "comparing-measures-of-spread",
          ],
        },
        {
          title: t("Representing Data", "数据展示"),
          topics: [
            "frequency-tables",
            "dot-plots",
            "box-plots",
            "histograms",
            "measuring-centrality-from-dot-plots",
            "measuring-range-and-mad-from-dot-plots",
            "measuring-quartiles-and-iqr-from-dot-plots",
            "symmetry-skew-and-outliers",
          ],
        },
      ],
    },
  ],
};

/** seventhGradeMath is the Common Core-aligned 7th Grade Math course. */
export const seventhGradeMath: CourseDef = {
  id: "7th-grade-math",
  title: t("7th Grade Math", "七年级数学"),
  description: t(
    "Unit prices and unit rates with ratios of fractions, proportional relationships, percentage change, commerce and finance percentages and simple interest; operations on rational numbers and exponents; linear expressions, one-step and multi-step linear equations, two-variable equations, systems, linear inequalities, modeling and rational expressions; segments, angles, polygons, area and perimeter, scale drawings, circles and prisms; and sampling, frequency tables and histograms, comparing data sets, probability models and compound events.",
    "分数之比的单价与单位率、比例关系、百分比变化、商业与金融中的百分数和单利；有理数运算与乘方；一次式、一步与多步一次方程、二元方程、方程组、一次不等式、建模与分式；线段、角、多边形、面积与周长、比例图、圆与棱柱；以及抽样、频数表与直方图、比较数据集、概率模型与复合事件。",
  ),
  units: [
    {
      title: t("Ratios & Proportional Relationships", "比与比例关系"),
      modules: [
        {
          title: t("Unit Rates", "单位率"),
          topics: [
            "finding-unit-prices",
            "working-with-unit-prices",
            "solving-multi-step-unit-price-problems",
            "unit-rates-associated-with-ratios-of-fractions",
            "unit-rates-associated-with-ratios-of-mixed-numbers",
            "solving-unit-rate-problems-using-ratios-of-fractions",
            "solving-unit-rate-problems-using-ratios-of-mixed-numbers",
          ],
        },
        {
          title: t("Proportional Relationships", "比例关系"),
          topics: [
            "understanding-proportional-relationships-using-tables",
            "understanding-proportional-relationships-using-graphs",
            "understanding-proportional-relationships-from-descriptions",
            "interpreting-data-from-proportional-relationships",
          ],
        },
        {
          title: t("Percentages", "百分数"),
          topics: [
            "applying-percentage-increases",
            "applying-percentage-decreases",
            "calculating-percentage-change",
            "finding-original-values-from-percentage-increases",
            "finding-original-values-from-percentage-decreases",
            "applying-percentages-in-succession",
            "interpreting-percentage-change",
          ],
        },
        {
          title: t("Applications of Percentages", "百分数的应用"),
          topics: [
            "percentages-in-commerce-and-finance",
            "further-percentages-in-commerce-and-finance",
            "solving-multipart-commerce-and-finance-percentage-problems",
            "calculating-simple-interest",
          ],
        },
      ],
    },
    {
      title: t("The Number System", "数系"),
      modules: [
        {
          title: t("Addition and Subtraction of Rational Numbers", "有理数的加减"),
          topics: [
            "subtracting-a-positive-number-from-a-smaller-positive-number",
            "subtracting-a-positive-number-from-a-negative-number",
            "subtracting-a-positive-fraction-from-a-smaller-fraction",
            "subtracting-a-positive-decimal-from-a-smaller-decimal",
            "adding-a-positive-number-to-a-negative-number",
            "adding-a-negative-number",
            "subtracting-a-negative-number",
            "additive-inverses-of-numbers",
            "interpreting-additive-opposites-and-addition-using-absolute-value",
            "solving-problems-using-addition-and-subtraction-of-rational-numbers",
          ],
        },
        {
          title: t("Multiplication and Division of Rational Numbers", "有理数的乘除"),
          topics: [
            "multiplying-positive-numbers-with-negative-numbers",
            "multiplying-negative-numbers",
            "dividing-with-negative-numbers",
            "equivalent-fractions-with-negative-numbers",
            "dividing-with-negative-decimals-and-fractions",
            "reciprocals-of-rational-numbers",
            "multiplying-and-dividing-with-zero",
            "fractions-of-fractions",
            "interpreting-products-and-quotients-of-rational-numbers",
            "evaluating-rational-number-expressions-without-exponents",
            "solving-problems-using-multiplication-and-division-of-rational-numbers",
            "solving-problems-using-the-four-operations-on-rational-numbers",
            "solving-multistep-problems-with-rational-numbers",
            "rational-numbers-as-finite-or-repeating-decimals",
          ],
        },
        {
          title: t("Exponents", "乘方"),
          topics: [
            "squaring-rational-numbers",
            "cubing-rational-numbers",
            "exponents-with-rational-bases",
            "evaluating-expressions-with-positive-integer-exponents",
          ],
        },
      ],
    },
    {
      title: t("Expressions & Equations", "式与方程"),
      modules: [
        {
          title: t("Algebraic Expressions", "代数式"),
          topics: [
            "evaluating-linear-expressions",
            "identifying-like-terms-in-linear-expressions",
            "combining-like-terms",
            "applying-the-distributive-law-to-linear-expressions",
            "the-distributive-law-with-three-terms",
            "distributing-the-negative-sign-in-a-linear-expression",
            "simplifying-linear-expressions-using-the-distributive-law",
            "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted",
            "simplifying-linear-expressions-containing-fractions",
            "the-greatest-common-factor-of-two-linear-expressions",
            "factoring-numerical-expressions",
            "factoring-linear-expressions",
          ],
        },
        {
          title: t("Solving One-Step Linear Equations", "解一步一次方程"),
          topics: ["solving-linear-equations-by-trial-and-error", "one-step-equations-addition", "one-step-equations-multiplication"],
        },
        {
          title: t("Solving Multi-Step Linear Equations", "解多步一次方程"),
          topics: [
            "two-step-equations",
            "solving-linear-equations-with-fractional-coefficients",
            "solving-linear-equations-with-decimal-coefficients",
            "equations-with-variables-on-both-sides",
            "solving-linear-equations-by-clearing-a-rational-expression",
            "solving-linear-equations-using-cross-multiplication",
          ],
        },
        {
          title: t("Two-Variable Equations", "二元方程"),
          topics: [
            "the-cartesian-coordinate-system",
            "distances-between-points-in-the-coordinate-plane",
            "two-variable-linear-equations-and-their-solutions",
            "solving-two-variable-equations",
            "graphing-linear-equations",
          ],
        },
        {
          title: t("Systems of Equations", "方程组"),
          topics: ["systems-of-linear-equations", "solving-systems-by-substitution"],
        },
        {
          title: t("Solving Linear Inequalities", "解一次不等式"),
          topics: [
            "inequalities-and-solutions",
            "compound-inequalities",
            "verifying-solutions-of-linear-inequalities",
            "solving-one-step-inequalities",
            "solving-multi-step-inequalities",
            "further-solving-linear-inequalities",
            "representing-solutions-to-inequalities-on-number-lines",
          ],
        },
        {
          title: t("Modeling With Linear Equations and Inequalities", "用一次方程和不等式建模"),
          topics: [
            "interpreting-linear-expressions",
            "modeling-with-linear-equations",
            "introduction-to-modeling-with-inequalities",
            "modeling-with-one-step-inequalities",
            "modeling-with-two-step-inequalities",
          ],
        },
        {
          title: t("Rational Expressions and Equations", "分式与分式方程"),
          topics: [
            "evaluating-rational-expressions",
            "equivalent-expressions-with-fractions",
            "simplifying-rational-expressions",
            "simplifying-rational-expressions-by-factoring",
            "rational-equations-with-one-fractional-term",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Introduction to Geometry", "几何初步"),
          topics: [
            "parallel-and-perpendicular-lines",
            "measures-of-segments",
            "congruent-segments",
            "midpoints",
            "collinear-points",
            "the-segment-addition-postulate",
            "segment-bisectors-and-the-perpendicular-bisector-theorem",
          ],
        },
        {
          title: t("Angles", "角"),
          topics: [
            "congruent-angles",
            "vertical-angles",
            "complementary-angles",
            "supplementary-angles",
            "angle-bisectors",
            "solving-problems-with-angles",
          ],
        },
        {
          title: t("Polygons", "多边形"),
          topics: [
            "angles-of-a-triangle",
            "classifying-triangles",
            "classifying-quadrilaterals",
            "polygons-in-the-coordinate-plane",
            "heights-of-triangles",
            "properties-of-rectangles-and-squares",
            "properties-of-trapezoids",
            "polygons",
            "congruent-polygons",
          ],
        },
        {
          title: t("Area and Perimeter", "面积与周长"),
          topics: [
            "perimeter",
            "perimeters-of-shapes",
            "area-of-rectangles-and-squares",
            "area-of-parallelograms",
            "areas-of-triangles",
            "area-of-trapezoids",
            "composite-shapes",
            "finding-areas-between-shapes",
          ],
        },
        {
          title: t("Scale Drawings", "比例图"),
          topics: [
            "introduction-to-scale-drawings",
            "calculating-lengths-from-scale-drawings",
            "calculating-perimeters-and-areas-of-scaled-shapes",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "circles",
            "the-circumference-of-a-circle",
            "areas-of-circles",
            "relating-the-circumference-and-area-of-a-circle",
            "composite-shapes-with-circles",
            "finding-areas-and-perimeters-of-part-circles",
          ],
        },
        {
          title: t("Solid Geometry", "立体几何"),
          topics: [
            "volumes-of-cubes",
            "surface-areas-of-cubes",
            "surface-areas-of-rectangular-solids",
            "volumes-of-triangular-prisms",
            "surface-areas-of-triangular-prisms",
            "surface-areas-of-combined-rectangular-prisms",
            "cross-sections-of-three-dimensional-shapes",
          ],
        },
      ],
    },
    {
      title: t("Statistics & Probability", "统计与概率"),
      modules: [
        {
          title: t("Sampling", "抽样"),
          topics: [
            "sampling",
            "estimation-from-samples",
            "biased-and-unbiased-samples",
            "interpreting-survey-results",
            "sampling-and-margin-of-error",
          ],
        },
        {
          title: t("Representing Data", "数据的表示"),
          topics: [
            "joint-frequency-tables",
            "cumulative-frequency",
            "calculating-means-from-frequency-tables",
            "calculating-medians-from-frequency-tables",
            "calculating-modes-from-frequency-tables",
            "calculating-modes-and-medians-from-histograms",
            "calculating-means-from-histograms",
          ],
        },
        {
          title: t("Comparing Data", "比较数据"),
          topics: [
            "comparing-means",
            "comparing-medians",
            "comparing-modes",
            "comparing-data-sets-using-range-and-quartiles",
            "comparing-data-set-visualizations-using-standard-deviation-and-mad",
            "comparing-data-sets-using-standard-deviation-and-mad",
            "assessing-visual-overlap-of-data-distributions",
          ],
        },
        {
          title: t("Probability", "概率"),
          topics: [
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "analyzing-probability-models",
          ],
        },
        {
          title: t("Compound Events in Probability", "复合事件的概率"),
          topics: [
            "sample-spaces-for-compound-events",
            "experimental-probability-for-compound-events",
            "computing-probabilities-of-compound-events",
            "simulating-compound-events",
          ],
        },
      ],
    },
  ],
};

/** eighthGradeMath is the Common Core-aligned 8th Grade Math course. */
export const eighthGradeMath: CourseDef = {
  id: "8th-grade-math",
  title: t("8th Grade Math", "八年级数学"),
  description: t(
    "Rational and irrational numbers; integer exponents, scientific notation and units; square and cube roots, radicals and equations solved with roots; divisibility and prime numbers; linear equations in one variable, slopes and equations of lines, and systems of linear equations; functions, their properties and linear models; angles and parallel lines, angles of triangles and polygons, rigid motions, dilations and similarity; the Pythagorean theorem, distance and volumes of cylinders, cones and spheres; and bivariate data with scatter plots, trend lines and two-way tables.",
    "有理数与无理数；整数指数、科学记数法与单位；平方根与立方根、根式及用开方解方程；整除与质数；一元一次方程、直线的斜率与方程、二元一次方程组；函数及其性质与一次函数模型；角与平行线、三角形与多边形的角、刚体变换、位似与相似；勾股定理、距离以及圆柱、圆锥与球的体积；以及用散点图、趋势线与双向表分析双变量数据。",
  ),
  units: [
    {
      title: t("The Real Number System", "实数系"),
      modules: [
        {
          title: t("Rational and Irrational Numbers", "有理数与无理数"),
          topics: [
            "the-real-number-system",
            "classifying-square-roots-and-cube-roots-as-rational-or-irrational",
            "writing-repeating-decimals-as-fractions",
          ],
        },
        {
          title: t("Approximating Irrational Numbers", "估算无理数"),
          topics: [
            "approximating-square-roots-and-cube-roots",
            "comparing-and-ordering-real-numbers",
            "estimating-expressions-with-irrational-numbers",
          ],
        },
      ],
    },
    {
      title: t("Exponents & Scientific Notation", "指数与科学记数法"),
      modules: [
        {
          title: t("Integer Exponents", "整数指数"),
          topics: ["the-zeroth-power", "powers-of-negative-one", "negative-exponents"],
        },
        {
          title: t("The Rules of Exponents", "指数运算法则"),
          topics: [
            "evaluating-expressions-with-integer-exponents",
            "the-product-rule-for-exponents",
            "the-quotient-rule-for-exponents",
            "the-power-rule-for-exponents",
            "the-power-of-product-rule-for-exponents",
            "the-power-of-quotient-rule-for-exponents",
            "combining-the-rules-of-exponents",
          ],
        },
        {
          title: t("Writing and Comparing Numbers in Scientific Notation", "用科学记数法表示和比较数"),
          topics: [
            "writing-numbers-in-scientific-notation",
            "converting-scientific-notation-to-standard-notation",
            "comparing-numbers-in-scientific-notation",
          ],
        },
        {
          title: t("Operations in Scientific Notation", "科学记数法的运算"),
          topics: [
            "addition-and-subtraction-in-scientific-notation",
            "addition-in-scientific-notation-with-different-powers-of-ten",
            "subtraction-in-scientific-notation-with-different-powers-of-ten",
            "further-addition-in-scientific-notation-with-different-powers-of-ten",
            "multiplying-numbers-in-scientific-notation",
            "dividing-numbers-in-scientific-notation",
            "estimating-and-comparing-real-world-quantities-using-scientific-notation",
          ],
        },
        {
          title: t("Working With Units", "单位的运用"),
          topics: ["units-in-formulas", "units-of-rates-of-change"],
        },
      ],
    },
    {
      title: t("Radicals", "根式"),
      modules: [
        {
          title: t("Square Roots and Cube Roots", "平方根与立方根"),
          topics: ["the-square-root-of-a-perfect-square", "squaring-a-square-root", "the-cube-root-of-a-perfect-cube", "surds"],
        },
        {
          title: t("Simplifying and Operating With Radicals", "根式的化简与运算"),
          topics: [
            "simplifying-square-roots",
            "evaluating-radical-expressions",
            "evaluating-numerical-expressions-containing-radicals",
            "adding-and-subtracting-radicals",
            "rationalizing-denominators",
          ],
        },
        {
          title: t("The Rules of Radicals", "根式运算法则"),
          topics: [
            "writing-radicals-using-fractional-exponents",
            "the-product-rule-for-radicals",
            "simplifying-expressions-with-surds",
            "the-quotient-rule-for-radicals",
          ],
        },
        {
          title: t("Solving Equations Using Square and Cube Roots", "用平方根和立方根解方程"),
          topics: [
            "solving-equations-with-square-roots",
            "solving-radical-equations-with-square-roots",
            "solving-equations-using-cube-roots",
            "solving-radical-equations-with-cube-roots",
            "finding-side-lengths-of-squares-and-cubes-from-area-or-volume",
          ],
        },
      ],
    },
    {
      title: t("Number Theory", "数论初步"),
      modules: [
        {
          title: t("Integer Divisibility and Prime Numbers", "整除与质数"),
          topics: [
            "divisibility-of-integers-by-2-5-10-4-and-8",
            "divisibility-of-integers-by-3-9-6-and-7",
            "rational-numbers-as-finite-or-repeating-decimals",
            "prime-and-composite-numbers",
            "prime-factors",
            "the-fundamental-theorem-of-arithmetic",
            "finding-greatest-common-factors-using-prime-factorization",
            "finding-lowest-common-multiples-using-prime-factorization",
          ],
        },
      ],
    },
    {
      title: t("Linear Equations", "一次方程"),
      modules: [
        {
          title: t("Solving Linear Equations in One Variable", "解一元一次方程"),
          topics: ["equations-with-variables-on-both-sides", "equations-with-parentheses"],
        },
        {
          title: t("Slopes and Equations of Lines", "斜率与直线方程"),
          topics: [
            "graphing-linear-equations",
            "horizontal-and-vertical-lines",
            "slope-of-a-line",
            "slope-as-a-unit-rate-in-proportional-relationships",
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
          ],
        },
        {
          title: t("Solving and Analyzing Linear Equations", "一次方程的求解与分析"),
          topics: [
            "linear-equations-with-infinitely-many-solutions",
            "linear-equations-with-no-solutions",
            "determining-the-number-of-solutions-of-a-linear-equation",
          ],
        },
        {
          title: t("Systems of Linear Equations", "二元一次方程组"),
          topics: [
            "systems-of-linear-equations",
            "solving-systems-by-substitution",
            "introduction-to-elimination",
            "elimination-with-one-transformation",
            "elimination-with-two-transformations",
            "identifying-the-number-of-solutions-to-a-system-by-inspection",
            "systems-with-no-solution-or-infinitely-many-solutions",
            "modeling-with-systems",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Introduction to Functions", "函数初步"),
          topics: ["introduction-to-functions", "representations-of-functions", "graphs-of-functions"],
        },
        {
          title: t("Properties of Functions", "函数的性质"),
          topics: [
            "increasing-and-decreasing",
            "identifying-maximum-and-minimum-values-of-a-function",
            "global-extrema",
            "describing-the-functional-relationship-between-two-quantities-from-a-graph",
          ],
        },
        {
          title: t("Linear Functions and Modeling", "一次函数与建模"),
          topics: [
            "linear-functions-versus-nonlinear-functions",
            "modeling-with-linear-equations",
            "modeling-with-two-variable-linear-equations",
            "analyzing-graphs-of-linear-models",
            "modeling-totals-with-two-variable-equations",
            "modeling-with-linear-functions",
            "interpreting-rate-of-change-and-initial-value-in-context",
            "comparing-properties-of-two-functions-represented-differently",
          ],
        },
      ],
    },
    {
      title: t("Geometry: Transformations, Congruence, & Similarity", "几何：变换、全等与相似"),
      modules: [
        {
          title: t("Angles and Parallel Lines", "角与平行线"),
          topics: [
            "complementary-angles",
            "non-adjacent-complementary-angles",
            "corresponding-angles",
            "alternate-angles",
            "consecutive-angles",
            "angle-criteria-for-parallel-lines",
          ],
        },
        {
          title: t("Angles in Triangles and Polygons", "三角形与多边形中的角"),
          topics: [
            "angles-of-a-triangle",
            "exterior-angles-of-triangles",
            "problem-solving-with-angles-of-triangles",
            "the-triangle-inequality",
            "isosceles-triangles",
            "angles-of-polygons",
            "exterior-angles-of-polygons",
            "regular-polygons",
          ],
        },
        {
          title: t("Rigid Transformations", "刚体变换"),
          topics: [
            "translations-of-geometric-figures",
            "reflections-of-points-in-the-coordinate-plane",
            "reflections-in-the-coordinate-plane",
            "rotations-of-geometric-figures",
            "verifying-properties-of-rigid-motions",
            "applying-sequences-of-rigid-motions",
            "congruence-through-rigid-motions",
          ],
        },
        {
          title: t("Dilations and Similarity", "位似与相似"),
          topics: [
            "dilations-of-geometric-figures",
            "dilations-of-figures-in-the-coordinate-plane",
            "similarity-and-similar-polygons",
            "side-lengths-and-angle-measures-of-similar-polygons",
            "similarity-transformations",
            "the-aa-similarity-criterion",
            "using-similar-triangles-to-explain-slope",
            "describing-a-sequence-of-transformations-that-maps-one-figure-onto-another",
          ],
        },
      ],
    },
    {
      title: t("The Pythagorean Theorem & Volume", "勾股定理与体积"),
      modules: [
        {
          title: t("The Pythagorean Theorem and Distance", "勾股定理与距离"),
          topics: [
            "the-pythagorean-theorem",
            "the-converse-of-the-pythagorean-theorem",
            "understanding-and-proving-the-pythagorean-theorem",
            "solving-real-world-problems-using-the-pythagorean-theorem",
            "finding-the-distance-between-two-points-using-the-pythagorean-theorem",
            "the-distance-formula",
            "applying-the-pythagorean-theorem-to-three-dimensional-figures",
          ],
        },
        {
          title: t("Volumes of Cylinders, Cones, and Spheres", "圆柱、圆锥与球的体积"),
          topics: [
            "volumes-of-cylinders",
            "volumes-of-right-cones",
            "volumes-of-spheres",
            "solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres",
          ],
        },
      ],
    },
    {
      title: t("Statistics: Bivariate Data", "统计：双变量数据"),
      modules: [
        {
          title: t("Scatter Plots and Linear Models", "散点图与线性模型"),
          topics: [
            "scatter-plots",
            "describing-patterns-of-association-in-scatter-plots",
            "trend-lines",
            "informally-assessing-the-fit-of-a-trend-line-to-a-scatter-plot",
            "predictions-with-trend-lines",
            "interpreting-trend-line-coefficients",
          ],
        },
        {
          title: t("Bivariate Categorical Data and Two-Way Tables", "双变量分类数据与双向表"),
          topics: [
            "joint-frequency-tables",
            "calculating-relative-frequencies-from-two-way-tables",
            "identifying-patterns-of-association-from-two-way-tables",
          ],
        },
      ],
    },
  ],
};

/** satMathFundamentals covers the complete mathematical foundations tested on the digital SAT. */
export const satMathFundamentals: CourseDef = {
  id: "sat-math-fundamentals",
  title: t("SAT Math Fundamentals", "SAT 数学基础"),
  description: t(
    "Comprehensive coverage of the mathematical concepts, skills, and non-routine problem structures tested on the digital SAT: arithmetic, linear equations and inequalities, graphs and systems, geometry and measurement, right-triangle trigonometry, functions, polynomials, quadratics, exponentials, rational and radical equations, ratios, percentages, units, statistics, and probability.",
    "全面涵盖数字 SAT 考试所测验的数学概念、解题技巧与典型题型结构：算术、一次方程与不等式、直线与方程组、几何与度量、直角三角形三角学、函数、多项式、二次方程、指数模型、分式与根式方程、比与百分比、单位换算、统计与概率。",
  ),
  units: [
    {
      title: t("Preliminaries", "预备知识与算术"),
      modules: [
        {
          title: t("Addition and Subtraction of Rational Numbers", "有理数加减法"),
          topics: [
            "subtracting-a-positive-number-from-a-smaller-positive-number",
            "subtracting-a-positive-number-from-a-negative-number",
            "subtracting-a-positive-fraction-from-a-smaller-fraction",
            "subtracting-a-positive-decimal-from-a-smaller-decimal",
            "adding-a-positive-number-to-a-negative-number",
            "adding-a-negative-number",
            "subtracting-a-negative-number",
            "additive-inverses-of-numbers",
            "interpreting-additive-opposites-and-addition-using-absolute-value",
            "solving-problems-using-addition-and-subtraction-of-rational-numbers",
          ],
        },
        {
          title: t("Multiplication and Division of Rational Numbers", "有理数乘除法"),
          topics: [
            "multiplying-positive-numbers-with-negative-numbers",
            "multiplying-negative-numbers",
            "dividing-with-negative-numbers",
            "equivalent-fractions-with-negative-numbers",
            "dividing-with-negative-decimals-and-fractions",
            "reciprocals-of-rational-numbers",
            "multiplying-and-dividing-with-zero",
            "fractions-of-fractions",
            "solving-problems-using-multiplication-and-division-of-rational-numbers",
            "solving-problems-using-the-four-operations-on-rational-numbers",
          ],
        },
        {
          title: t("Exponents", "乘方与指数法则"),
          topics: [
            "squaring-rational-numbers",
            "cubing-rational-numbers",
            "exponents-with-rational-bases",
            "the-zeroth-power",
            "powers-of-negative-one",
            "negative-exponents",
            "the-product-rule-for-exponents",
            "the-quotient-rule-for-exponents",
            "the-power-rule-for-exponents",
            "the-power-of-product-rule-for-exponents",
            "the-power-of-quotient-rule-for-exponents",
            "combining-the-rules-of-exponents",
          ],
        },
        {
          title: t("Radicals", "平方根与立方根"),
          topics: [
            "the-square-root-of-a-perfect-square",
            "squaring-a-square-root",
            "the-cube-root-of-a-perfect-cube",
            "surds",
            "evaluating-numerical-expressions-containing-radicals",
            "combining-like-terms",
            "adding-and-subtracting-radicals",
            "the-product-rule-for-radicals",
            "simplifying-expressions-with-surds",
            "rationalizing-denominators",
            "square-roots-of-algebraic-perfect-squares",
            "cube-roots-of-algebraic-perfect-cubes",
            "writing-radicals-using-fractional-exponents",
            "the-quotient-rule-for-radicals",
            "comparing-radicals",
          ],
        },
        {
          title: t("Order of Operations", "运算顺序"),
          topics: [
            "natural-numbers-integers-and-rational-numbers",
            "rational-numbers-as-finite-or-repeating-decimals",
            "evaluating-rational-number-expressions-without-exponents",
            "evaluating-expressions-with-positive-integer-exponents",
            "evaluating-expressions-with-integer-exponents",
          ],
        },
        {
          title: t("Algebraic Expressions", "代数式求值与化简"),
          topics: [
            "introduction-to-algebraic-expressions",
            "constructing-algebraic-expressions",
            "evaluating-linear-expressions",
            "evaluating-rational-expressions",
            "identifying-terms-in-linear-expressions",
            "identifying-coefficients-and-constants",
            "the-greatest-common-factor-of-two-linear-expressions",
          ],
        },
        {
          title: t("Simplifying Linear Expressions", "化简一次式"),
          topics: [
            "identifying-like-terms-in-linear-expressions",
            "applying-the-distributive-law-to-linear-expressions",
            "the-distributive-law-with-three-terms",
            "distributing-the-negative-sign-in-a-linear-expression",
            "simplifying-linear-expressions-using-the-distributive-law",
            "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted",
            "simplifying-linear-expressions-containing-fractions",
            "factoring-numerical-expressions",
            "factoring-linear-expressions",
          ],
        },
      ],
    },
    {
      title: t("Algebra - Linear Equations in One Variable", "代数：一元一次方程解法"),
      modules: [
        {
          title: t("Solving Linear Equations", "解一元一次方程"),
          topics: [
            "solving-linear-equations-by-trial-and-error",
            "one-step-equations-addition",
            "one-step-equations-multiplication",
            "two-step-equations",
            "solving-linear-equations-with-fractional-coefficients",
            "solving-linear-equations-with-decimal-coefficients",
            "equations-with-variables-on-both-sides",
            "solving-linear-equations-containing-binomials",
            "equations-with-parentheses",
            "solving-linear-equations-containing-binomials-by-factoring",
            "solving-linear-equations-by-clearing-a-rational-expression",
            "solving-linear-equations-using-cross-multiplication",
            "two-variable-linear-equations-and-their-solutions",
            "manipulating-expressions-and-equations",
            "solving-two-variable-equations",
            "linear-equations-with-infinitely-many-solutions",
            "linear-equations-with-no-solutions",
            "linear-equations-with-unknown-coefficients",
            "unknown-coefficients-by-factoring",
            "many-variable-equations",
          ],
        },
        {
          title: t("Modeling With Linear Equations", "一元一次方程建模与实际应用"),
          topics: [
            "ratios",
            "unit-rates",
            "interpreting-linear-expressions",
            "modeling-with-linear-equations",
            "consecutive-integer-problems",
            "speed-distance-time",
            "further-speed-distance-time",
            "work-problems",
            "mixture-problems",
          ],
        },
      ],
    },
    {
      title: t("Algebra - Linear Equations in Two Variables", "代数：二元一次方程与直线"),
      modules: [
        {
          title: t("Graphs of Linear Equations", "直线图象与方程形式"),
          topics: [
            "the-cartesian-coordinate-system",
            "distances-between-points-in-the-coordinate-plane",
            "graphing-linear-equations",
            "horizontal-and-vertical-lines",
            "slope-of-a-line",
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
            "point-slope-form",
            "standard-form",
            "properties-of-lines-in-standard-form",
            "parallel-lines-in-the-coordinate-plane",
            "finding-equations-of-parallel-lines",
            "perpendicular-lines-in-the-coordinate-plane",
            "finding-equations-of-perpendicular-lines",
          ],
        },
        {
          title: t("Modeling With Two-Variable Linear Equations", "二元一次方程建模"),
          topics: [
            "modeling-with-two-variable-linear-equations",
            "modeling-totals-with-two-variable-equations",
            "interpreting-coefficients-of-two-variable-equations",
            "analyzing-graphs-of-linear-models",
            "further-modeling-with-two-variable-equations",
            "distance-time-graphs",
            "speed-time-graphs",
            "area-of-trapezoids",
            "distance-from-speed-time-graphs",
          ],
        },
        {
          title: t("Systems of Equations", "二次与非线性方程组"),
          topics: [
            "systems-of-linear-equations",
            "solving-systems-by-substitution",
            "introduction-to-elimination",
            "elimination-with-one-transformation",
            "elimination-with-two-transformations",
            "systems-with-fractional-coefficients",
            "systems-with-decimal-coefficients",
            "systems-with-no-solution-or-infinitely-many-solutions",
            "parametrizing-systems-with-infinitely-many-solutions",
            "sat-linear-systems-unknown-constants",
            "intersection-of-two-lines",
            "solving-systems-of-linear-equations-by-identifying-structure",
            "larger-systems-of-equations",
            "modeling-with-systems",
            "coin-problems",
            "consistency-and-dependency",
          ],
        },
      ],
    },
    {
      title: t("Algebra - Linear Inequalities", "代数：线性不等式"),
      modules: [
        {
          title: t("Linear Inequalities", "一元与二元一次不等式"),
          topics: [
            "inequalities-and-solutions",
            "compound-inequalities",
            "verifying-solutions-of-linear-inequalities",
            "solving-one-step-inequalities",
            "solving-multi-step-inequalities",
            "linear-inequalities-with-parameters",
            "representing-solutions-to-inequalities-on-number-lines",
            "further-solving-linear-inequalities",
            "solving-compound-inequalities",
            "interval-notation",
            "unbounded-intervals",
            "unions-of-intervals",
            "intersections-of-intervals",
            "compound-or-inequalities",
            "optimizing-sums-differences-products-and-quotients",
          ],
        },
        {
          title: t("Two-Variable Linear Inequalities", "二元一次不等式图象"),
          topics: [
            "graphing-strict-linear-inequalities",
            "graphing-non-strict-linear-inequalities",
            "further-graphing-linear-inequalities",
            "systems-of-linear-inequalities",
          ],
        },
        {
          title: t("Modeling With Inequalities", "不等式建模"),
          topics: [
            "introduction-to-modeling-with-inequalities",
            "modeling-with-one-step-inequalities",
            "modeling-with-two-step-inequalities",
            "modeling-with-compound-inequalities",
            "modeling-with-two-variable-inequalities",
            "modeling-with-systems-of-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Geometry - Points, Lines, & Angles", "几何：点、线与角"),
      modules: [
        {
          title: t("Introduction to Geometry", "角的初步"),
          topics: [
            "units-of-area-and-volume",
            "points-lines-rays-and-segments",
            "measures-of-segments",
            "congruent-segments",
            "midpoints",
            "collinear-points",
            "the-segment-addition-postulate",
          ],
        },
        {
          title: t("Angles", "角的性质与平行线"),
          topics: [
            "angles-and-angle-measures",
            "connecting-angles-and-circles",
            "measuring-angles-using-a-protractor",
            "sums-of-angles",
            "right-straight-full-and-null-angles",
            "parallel-and-perpendicular-lines",
            "acute-obtuse-and-reflex-angles",
            "congruent-angles",
            "complementary-and-supplementary-angles",
            "vertical-angles",
            "supplementary-angles",
            "complementary-angles",
            "solving-problems-with-angles",
            "parallel-lines-and-transversals",
          ],
        },
        {
          title: t("Advanced Angles", "三角形内外角"),
          topics: [
            "non-adjacent-complementary-angles",
            "corresponding-angles",
            "alternate-angles",
            "consecutive-angles",
            "angle-criteria-for-parallel-lines",
            "angle-bisectors",
            "segment-bisectors-and-the-perpendicular-bisector-theorem",
          ],
        },
        {
          title: t("Geometric Transformations", "刚体变换"),
          topics: [
            "translations-of-geometric-figures",
            "rotations-of-geometric-figures",
            "reflections-in-the-coordinate-plane",
            "reflections-across-arbitrary-lines",
            "angles-of-a-triangle",
            "angles-of-polygons",
            "reflective-symmetry",
            "rotational-symmetry",
          ],
        },
      ],
    },
    {
      title: t("Geometry - Polygons & Solids", "几何：多边形与立体图形"),
      modules: [
        {
          title: t("Triangles", "三角形分类"),
          topics: [
            "exterior-angles-of-triangles",
            "problem-solving-with-angles-of-triangles",
            "classifying-triangles",
            "the-triangle-inequality",
            "isosceles-triangles",
            "heights-of-triangles",
            "medians-and-centroids",
            "the-exterior-angle-theorem",
          ],
        },
        {
          title: t("Right Triangles", "直角三角形与勾股定理"),
          topics: [
            "solving-equations-with-square-roots",
            "the-pythagorean-theorem",
            "isosceles-right-triangles",
            "thirty-sixty-ninety-triangles",
            "area-of-isosceles-right-triangles",
            "area-of-thirty-sixty-ninety-triangles",
            "area-of-equilateral-triangles",
            "perimeter",
            "area-of-rectangles-and-squares",
            "diagonals-of-squares",
            "solving-geometry-problems-by-manipulating-radicals",
          ],
        },
        {
          title: t("Polygons", "多边形内角与对称"),
          topics: [
            "polygons",
            "exterior-angles-of-polygons",
            "congruent-polygons",
            "regular-polygons",
            "properties-of-rectangles-and-squares",
          ],
        },
        {
          title: t("Solid Geometry", "柱锥球体表面积与体积"),
          topics: [
            "identifying-three-dimensional-shapes",
            "faces-vertices-and-edges-of-polyhedrons",
            "nets-of-polyhedrons",
            "finding-surface-areas-using-nets",
          ],
        },
      ],
    },
    {
      title: t("Geometry - Congruence & Similarity", "几何：全等与相似"),
      modules: [
        {
          title: t("Congruence", "三角形全等判定与刚性变换"),
          topics: [
            "the-asa-congruence-criterion",
            "the-aas-congruence-criterion",
            "the-sas-congruence-criterion",
            "the-sss-congruence-criterion",
            "the-hl-congruence-criterion",
            "combining-congruence-criteria-for-triangles",
            "properties-of-congruence",
            "solving-problems-describing-congruent-triangles",
            "reasoning-about-congruent-triangles",
            "rigid-motions-and-congruence",
          ],
        },
        {
          title: t("Similarity", "相似多边形与比例图"),
          topics: [
            "similarity-and-similar-polygons",
            "side-lengths-and-angle-measures-of-similar-polygons",
            "areas-of-similar-polygons",
            "working-with-areas-of-similar-polygons",
            "working-with-descriptions-of-similar-shapes",
            "the-aa-similarity-criterion",
            "the-sss-similarity-criterion",
            "the-sas-similarity-criterion",
            "combining-similarity-criteria-for-triangles",
            "solving-angle-problems-from-descriptions-of-similar-triangles",
            "solving-parallel-line-problems-from-descriptions",
            "the-midpoint-theorem",
            "the-triangle-proportionality-theorem",
            "reasoning-about-similar-triangles",
            "scale-drawings-and-scale-factor",
          ],
        },
      ],
    },
    {
      title: t("Geometry - Length, Area & Volume", "几何：长度、面积与体积"),
      modules: [
        {
          title: t("Perimeter & Area of Plane Figures", "平面图形面积与周长"),
          topics: ["area-of-parallelograms", "areas-of-triangles", "composite-shapes", "finding-areas-between-shapes"],
        },
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "midpoints-in-the-coordinate-plane",
            "the-distance-formula",
            "calculating-perimeters-in-the-plane",
            "calculating-areas-of-rectangles-in-the-plane",
            "calculating-areas-of-triangles-and-quadrilaterals-in-the-plane",
          ],
        },
        {
          title: t("Inscribed Shapes in Two Dimensions", "平面内接图形"),
          topics: [
            "circles",
            "the-circumference-of-a-circle",
            "areas-of-circles",
            "circles-inscribed-in-squares",
            "squares-inscribed-in-circles",
            "equilateral-triangles-inscribed-in-circles",
            "circles-inscribed-in-equilateral-triangles",
            "areas-of-inscribed-triangles",
          ],
        },
        {
          title: t("Surface Area and Volume", "柱体、锥体与球体表面积与体积"),
          topics: [
            "volumes-of-cubes",
            "surface-areas-of-cubes",
            "face-diagonals-of-cubes",
            "volumes-of-rectangular-solids",
            "surface-areas-of-rectangular-solids",
            "surface-areas-and-volumes-of-similar-solids",
            "working-with-descriptions-of-similar-solids",
            "volumes-of-cylinders",
            "surface-areas-of-cylinders",
            "volumes-of-spheres",
            "volumes-of-pyramids",
            "volumes-of-right-cones",
            "slant-heights-of-right-cones",
            "constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids",
            "composite-solids",
            "surface-areas-of-combined-rectangular-prisms",
            "surface-areas-of-right-cones",
            "surface-areas-of-spheres",
          ],
        },
      ],
    },
    {
      title: t("Geometry - Circles", "几何：圆与弧度"),
      modules: [
        {
          title: t("Circles", "圆、弧长与扇形面积"),
          topics: [
            "arcs-segments-and-sectors-of-circles",
            "central-angles-and-arcs",
            "calculating-arc-lengths-of-circular-sectors",
            "calculating-areas-of-circular-sectors",
            "further-calculating-areas-of-sectors",
            "problem-solving-with-circles",
            "tangent-lines-to-circles",
            "tangent-tangent-lines-to-circles",
            "isosceles-triangles-in-circles",
            "perpendicular-bisectors-of-chords",
          ],
        },
        {
          title: t("Circles in the Coordinate Plane", "坐标平面中的圆方程"),
          topics: [
            "circles-in-the-coordinate-plane",
            "equations-of-circles-centered-at-the-origin",
            "equations-of-circles",
            "equations-of-tangent-lines-to-circles",
            "transforming-circles",
          ],
        },
        {
          title: t("Radians", "弧度制与扇形"),
          topics: ["introduction-to-radians", "calculating-arc-length-using-radians", "calculating-areas-of-sectors-using-radians"],
        },
      ],
    },
    {
      title: t("Trigonometry", "直角三角函数与互余关系"),
      modules: [
        {
          title: t("Trigonometry", "直角三角函数与互余关系"),
          topics: [
            "angles-and-sides-in-right-triangles",
            "the-trigonometric-ratios",
            "calculating-trigonometric-ratios-using-the-pythagorean-theorem",
            "degrees-of-accuracy",
            "calculating-side-lengths-of-right-triangles-using-trigonometry",
            "calculating-angles-in-right-triangles-using-trigonometry",
            "modeling-with-trigonometry",
            "the-reciprocal-trigonometric-ratios",
            "trigonometric-ratios-in-similar-right-triangles",
            "trigonometric-functions-of-complementary-angles",
            "calculating-trigonometric-ratios-from-descriptions",
            "special-trigonometric-ratios",
            "trigonometric-ratios-with-radians",
            "calculating-areas-of-right-triangles-using-trigonometry",
            "solving-multiple-right-triangles-using-trigonometry",
          ],
        },
        {
          title: t("The Unit Circle", "单位圆与任意角三角比"),
          topics: [
            "angles-in-the-coordinate-plane",
            "negative-angles-in-the-coordinate-plane",
            "coterminal-angles",
            "calculating-reference-angles",
            "properties-of-the-unit-circle-in-the-first-quadrant",
            "extending-the-trigonometric-ratios-using-the-unit-circle",
            "extending-the-trigonometric-ratios-using-angles-in-radians",
            "extending-the-trigonometric-ratios-to-negative-angles",
            "extending-the-trigonometric-ratios-to-large-angles",
            "using-the-pythagorean-identity-in-the-first-quadrant",
            "extending-the-pythagorean-identity-to-all-quadrants",
          ],
        },
        {
          title: t("Special Trigonometric Ratios", "特殊角三角比"),
          topics: [
            "finding-trigonometric-ratios-of-quadrantal-angles",
            "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range",
            "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
            "evaluating-trigonometric-expressions",
            "further-extensions-of-the-special-trigonometric-ratios",
          ],
        },
      ],
    },
    {
      title: t("Advanced Algebra - Functions", "进阶代数：函数概念与性质"),
      modules: [
        {
          title: t("Functions", "函数"),
          topics: [
            "introduction-to-functions",
            "representations-of-functions",
            "graphs-of-functions",
            "domain-of-a-function",
            "vertical-line-test",
            "global-extrema",
            "increasing-and-decreasing",
            "local-extrema",
            "introduction-to-polynomials",
            "degree-of-a-polynomial",
            "end-behavior",
            "range-of-a-function",
            "range-advanced-cases",
            "roots-of-a-function",
            "piecewise-functions",
            "simplifying-polynomials",
            "distributive-law-for-polynomials",
            "adding-and-subtracting-polynomials",
            "multiplying-binomials",
            "arithmetic-of-functions",
            "squaring-binomials",
            "function-composition",
            "describing-function-composition",
            "introduction-to-inverse-functions",
            "even-and-odd-functions",
            "introduction-to-sequences",
          ],
        },
        {
          title: t("Linear Functions", "一次函数基础与特征"),
          topics: [
            "modeling-with-linear-functions",
            "constructing-linear-functions",
            "linear-functions-in-tabular-form",
            "analyzing-linear-functions-in-tabular-form",
            "linear-functions-in-tabular-form-containing-unknown-parameters",
          ],
        },
        {
          title: t("Graph Transformations of Functions", "函数图象平移变换"),
          topics: [
            "absolute-value-expressions",
            "absolute-value-graphs",
            "graphing-elementary-quadratic-functions",
            "vertical-reflections-of-quadratic-functions",
            "graphs-of-general-quadratic-functions",
            "the-axis-of-symmetry-of-a-parabola",
            "the-vertex-form-of-a-parabola",
            "vertical-translations-of-functions",
            "horizontal-translations-of-functions",
            "transformations-of-linear-functions-in-tabular-form",
            "vertical-reflections-of-absolute-value-graphs",
            "vertical-reflections-of-functions",
            "finding-equations-of-translated-functions",
            "transforming-polynomial-functions",
          ],
        },
      ],
    },
    {
      title: t("Advanced Algebra - Absolute Value", "进阶代数：绝对值"),
      modules: [
        {
          title: t("Absolute Value Expressions and Equations", "绝对值式与方程"),
          topics: [
            "rules-of-absolute-value",
            "further-rules-of-absolute-value",
            "absolute-value-equations",
            "further-absolute-value-equations",
            "absolute-value-inequalities",
            "equations-connecting-absolute-value-and-linear-functions",
            "absolute-value-equations-with-extraneous-solutions",
          ],
        },
        {
          title: t("Absolute Value Functions", "绝对值函数"),
          topics: [
            "stretches-of-absolute-value-graphs",
            "combining-transformations-of-absolute-value-graphs",
            "roots-of-absolute-value-functions",
          ],
        },
      ],
    },
    {
      title: t("Advanced Algebra - Polynomials", "进阶代数：多项式与二次方程"),
      modules: [
        {
          title: t("Polynomials", "多项式乘法与恒等式"),
          topics: [
            "constructing-functions-representing-properties-of-2d-shapes",
            "constructing-functions-representing-properties-of-rectangular-solids",
            "monomials-binomials-and-trinomials",
            "applying-the-distributive-law-to-radical-expressions",
            "multiplying-polynomials",
            "difference-of-squares-formula",
            "rationalizing-two-term-denominators",
          ],
        },
        {
          title: t("Factoring Polynomials", "多项式因式分解"),
          topics: [
            "greatest-common-factor-of-monomials",
            "the-least-common-multiple-of-two-monomials",
            "factoring-polynomials-using-gcfs",
            "factoring-perfect-square-trinomials",
            "factoring-perfect-square-trinomials-with-leading-coefficients",
            "factoring-differences-of-squares",
            "factoring-differences-of-squares-using-surds",
            "factoring-trinomials",
            "factoring-trinomials-using-common-factors",
            "the-least-common-multiple-of-two-polynomials",
            "factoring-trinomials-with-leading-coefficients",
            "further-factoring-trinomials-with-leading-coefficients",
            "factoring-higher-order-polynomials-as-a-difference-of-squares",
            "factoring-biquadratic-expressions",
            "factoring-expressions-containing-binomials",
            "factoring-expressions-containing-hidden-factors",
            "equating-polynomial-coefficients",
            "sat-equating-polynomial-coefficients",
          ],
        },
        {
          title: t("Quadratic Equations", "一元二次方程与根"),
          topics: [
            "introduction-to-quadratic-equations",
            "solving-odd-power-equations",
            "solving-even-power-equations",
            "solving-perfect-square-quadratic-equations",
            "perfect-square-quadratic-equations-with-one-or-no-solutions",
            "zero-product-rule",
            "solving-quadratic-equations-using-a-difference-of-squares",
            "solving-quadratic-equations-with-no-constant-term",
            "solving-quadratic-equations-by-factoring",
            "border-problems",
            "solving-quadratic-equations-with-leading-coefficients-by-factoring",
            "completing-the-square",
            "completing-the-square-with-odd-linear-terms",
            "determining-circle-properties-by-completing-the-square",
            "calculating-circle-intercepts",
            "completing-the-square-with-leading-coefficients",
            "solving-quadratic-equations-by-completing-the-square",
            "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
            "the-quadratic-formula",
            "the-discriminant-of-a-quadratic-equation",
            "vietas-formulas",
            "determining-the-roots-of-polynomials",
            "solving-biquadratic-equations",
            "solving-quadratic-equations-containing-unknown-parameters",
            "solving-elementary-quadratic-inequalities",
            "determining-unknown-parameters-in-quadratic-equations-with-real-solutions",
            "quadratic-equations-with-one-real-solution",
            "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
            "roots-of-quadratic-functions",
            "reasoning-about-coefficients-of-quadratics-using-standard-and-factored-forms",
          ],
        },
        {
          title: t("Quadratic Functions", "二次函数与顶点式"),
          topics: [
            "the-discriminant-of-a-quadratic-function",
            "the-average-of-the-roots-formula",
            "writing-the-equation-of-a-parabola-in-vertex-form",
            "fitting-quadratic-functions-to-data-using-vertex-form",
            "reasoning-about-coefficients-of-quadratics-using-symmetry",
            "sat-quadratic-vertex-and-constants",
          ],
        },
        {
          title: t("Systems of Equations", "二次与非线性方程组"),
          topics: [
            "solving-systems-of-nonlinear-equations",
            "solving-systems-of-nonlinear-equations-using-graphs",
            "intersections-of-circles-with-lines",
            "solving-systems-of-nonlinear-equations-by-identifying-structure",
            "finding-intersections-of-lines-and-quadratic-functions",
            "determining-unknown-parameters-in-quadratic-systems-with-one-intersection-point",
            "determining-unknown-parameters-in-quadratic-systems-with-zero-or-two-intersection-points",
          ],
        },
        {
          title: t("Modeling With Quadratic Functions", "二次模型与最优化"),
          topics: [
            "modeling-downwards-vertical-motion",
            "modeling-upwards-vertical-motion",
            "vertical-motion",
            "revenue-cost-and-profit-functions",
            "modeling-using-systems-of-non-linear-equations",
            "maximizing-profit-and-break-even-points",
          ],
        },
        {
          title: t("Polynomial Expressions & Equations", "多项式待定系数法"),
          topics: [
            "further-factoring-of-polynomials-using-gcfs",
            "factoring-cubic-expressions-by-grouping",
            "solving-polynomial-equations-using-the-gcf",
            "the-zero-product-rule-for-solving-polynomial-equations",
          ],
        },
        {
          title: t("Polynomial Theorems", "多项式除法与因式余数定理"),
          topics: [
            "multiplicities-of-the-roots-of-polynomials",
            "equivalent-expressions-with-fractions",
            "simplifying-rational-expressions",
            "splitting-rational-expressions-into-terms",
            "dividing-polynomials-using-synthetic-division",
            "the-factor-theorem",
            "reasoning-about-coefficients-in-quadratic-equations-using-the-factor-theorem",
            "factoring-cubic-polynomials-using-the-factor-theorem",
            "the-remainder-theorem",
          ],
        },
        {
          title: t("Graphs of Polynomials", "多项式图像"),
          topics: [
            "graphing-elementary-cubic-functions",
            "graphing-cubic-curves-containing-three-distinct-real-roots",
            "graphing-cubic-curves-containing-a-double-root",
            "graphing-cubic-curves-containing-one-distinct-real-root",
            "end-behavior-of-polynomials",
            "graphing-general-polynomials",
            "identifying-valid-outputs-of-factored-polynomials",
          ],
        },
      ],
    },
    {
      title: t("Advanced Algebra - Exponential Equations & Functions", "进阶代数：指数方程与函数"),
      modules: [
        {
          title: t("Exponential Expressions & Equations", "解简单指数方程"),
          topics: [
            "product-rule-with-algebraic-expressions",
            "quotient-rule-with-algebraic-expressions",
            "power-rule-with-algebraic-expressions",
            "power-of-product-rule-with-algebraic-expressions",
            "power-of-quotient-rule-with-algebraic-expressions",
            "combining-rules-of-exponents-with-algebraic-expressions",
            "rewriting-radical-expressions-using-the-laws-of-exponents",
            "applying-the-distributive-law-to-exponential-expressions",
            "combining-exponential-expressions",
            "solving-exponential-equations",
            "solving-exponential-equations-with-fractional-solutions",
            "creating-exponential-growth-expressions",
            "creating-exponential-decay-expressions",
          ],
        },
        {
          title: t("Exponential Functions", "指数函数性质与图象"),
          topics: [
            "exponential-functions",
            "modeling-exponential-growth-with-functions",
            "interpreting-exponential-growth",
            "solving-exponential-growth-problems",
            "modeling-exponential-decay-with-functions",
            "interpreting-exponential-decay",
            "solving-exponential-decay-problems",
            "linear-vs-exponential-growth-and-decay",
            "linear-vs-exponential-models",
            "time-shifting-exponential-models",
            "sat-exponential-model-rewriting",
          ],
        },
        {
          title: t("Graphs of Exponential Functions", "指数函数图象"),
          topics: [
            "graphing-exponential-growth-functions",
            "graphing-exponential-decay-functions",
            "vertical-translations-of-exponential-growth-functions",
            "vertical-translations-of-exponential-decay-functions",
            "vertical-reflections-of-exponential-functions",
            "extrema-of-exponential-functions",
            "interpreting-graphs-of-exponential-functions",
            "determining-unknown-parameters-in-exponential-functions",
          ],
        },
      ],
    },
    {
      title: t("Advanced Algebra - Rational and Radical Equations", "进阶代数：分式与根式方程"),
      modules: [
        {
          title: t("Rational Expressions", "分式化简"),
          topics: [
            "simplifying-rational-expressions-by-factoring",
            "unbounded-behavior-of-functions-near-a-point",
            "simplifying-rational-expressions-using-polynomial-factorization",
            "adding-and-subtracting-rational-expressions",
            "adding-rational-expressions-with-unlike-denominators",
            "adding-rational-expressions-using-polynomial-factorization",
            "multiplying-rational-expressions",
            "dividing-rational-expressions",
            "fractions-of-fractions-with-algebraic-expressions",
          ],
        },
        {
          title: t("Rational Equations", "分式方程解法"),
          topics: [
            "rational-equations-with-one-fractional-term",
            "rational-equations-using-cross-multiplication",
            "rational-equations-containing-binomials",
            "rational-equations-using-the-flip-method",
            "rational-equations-with-three-terms",
            "advanced-rational-equations",
            "solving-many-variable-rational-equations",
            "graphing-reciprocal-functions",
            "graph-transformations-of-reciprocal-functions",
          ],
        },
        {
          title: t("Radical Expressions", "根式"),
          topics: [
            "square-roots-with-domain-restrictions",
            "simplifying-square-roots-with-variables",
            "multiplying-radical-expressions",
            "quotient-rule-for-square-roots",
            "evaluating-radical-expressions",
            "adding-and-subtracting-radical-expressions",
            "solving-radical-equations",
            "solving-advanced-radical-equations",
            "solving-many-variable-nonlinear-equations",
          ],
        },
      ],
    },
    {
      title: t("Problem Solving - Ratios & Percentages", "问题解决：比与百分数"),
      modules: [
        {
          title: t("Ratios", "比与条形图"),
          topics: [
            "equivalent-ratios",
            "writing-ratios-using-fractions",
            "reasoning-with-equivalent-ratios",
            "further-reasoning-with-equivalent-ratios",
            "ratio-tables",
            "graphing-ratios",
          ],
        },
        {
          title: t("Unit Rates", "单位率与单价"),
          topics: [
            "solving-problems-using-unit-rates",
            "speed-as-a-unit-rate",
            "unit-rates-associated-with-ratios-of-fractions",
            "solving-unit-rate-problems-using-ratios-of-fractions",
            "manipulating-ratios-in-various-contexts",
          ],
        },
        {
          title: t("Proportional Relationships", "正比例与比例方程"),
          topics: [
            "understanding-proportional-relationships-using-tables",
            "understanding-proportional-relationships-using-graphs",
            "understanding-proportional-relationships-from-descriptions",
            "modeling-with-direct-variation",
          ],
        },
        {
          title: t("Percentages", "百分数计算与应用"),
          topics: [
            "understanding-percentages-using-models",
            "converting-between-percentages-and-fractions",
            "converting-between-percentages-and-decimals",
            "comparing-fractions-percents-and-decimals",
            "finding-part-of-a-number-given-a-whole-and-a-percentage",
            "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems",
            "finding-a-percentage-given-two-numbers",
            "finding-a-percentage-given-two-numbers-word-problems",
            "finding-a-total-given-a-part-and-a-percentage",
            "applying-percentage-increases",
            "applying-percentage-decreases",
            "calculating-percentage-change",
            "finding-original-values-from-percentage-increases",
            "finding-original-values-from-percentage-decreases",
            "applying-percentages-in-succession",
            "percentages-in-commerce-and-finance",
            "further-percentages-in-commerce-and-finance",
            "solving-multipart-commerce-and-finance-percentage-problems",
          ],
        },
        {
          title: t("Units", "单位"),
          topics: [
            "two-step-unit-conversions",
            "unit-conversions-using-base-units-of-mass",
            "unit-conversions-using-base-units-of-length",
            "unit-conversions-using-units-of-time",
            "converting-units-of-area",
            "converting-units-of-area-to-larger-units",
            "units-in-formulas",
            "units-of-rates-of-change",
            "the-average-rate-of-change-of-a-function",
            "mixed-units",
            "converting-between-mixed-units-containing-squares",
            "density",
            "interpreting-descriptions-of-physical-phenomena",
            "interpreting-rates-of-change-of-physical-phenomena",
          ],
        },
      ],
    },
    {
      title: t("Data Analysis - Statistics & Probability", "数据分析：统计与概率"),
      modules: [
        {
          title: t("Sampling", "随机抽样"),
          topics: [
            "sampling",
            "estimation-from-samples",
            "biased-and-unbiased-samples",
            "interpreting-survey-results",
            "sampling-and-margin-of-error",
            "sat-margin-of-error-interpretation",
          ],
        },
        {
          title: t("Summarizing Data", "数据中心趋势"),
          topics: [
            "introduction-to-statistics",
            "mean-of-a-data-set",
            "the-median-of-a-data-set",
            "the-mode-of-a-data-set",
            "range-quartiles-and-iqr",
            "mean-absolute-deviation",
            "outliers",
            "removing-outliers",
            "combining-means",
            "determining-unknown-observations-given-statistical-metrics",
          ],
        },
        {
          title: t("Frequency Tables", "频数表"),
          topics: [
            "frequency-tables",
            "joint-frequency-tables",
            "cumulative-frequency",
            "calculating-means-from-frequency-tables",
            "calculating-medians-from-frequency-tables",
            "calculating-modes-from-frequency-tables",
          ],
        },
        {
          title: t("Representing Data", "点图、箱线图与直方图"),
          topics: [
            "dot-plots",
            "box-plots",
            "histograms",
            "measuring-centrality-from-dot-plots",
            "measuring-range-and-mad-from-dot-plots",
            "measuring-quartiles-and-iqr-from-dot-plots",
            "calculating-modes-and-medians-from-histograms",
            "calculating-means-from-histograms",
            "comparing-measures-of-center",
            "symmetry-skew-and-outliers",
          ],
        },
        {
          title: t("Comparing Data", "异常值与数据集比较"),
          topics: [
            "comparing-means",
            "comparing-medians",
            "comparing-modes",
            "comparing-data-sets-using-range-and-quartiles",
            "comparing-measures-of-spread",
            "comparing-data-set-visualizations-using-standard-deviation-and-mad",
            "comparing-data-sets-using-standard-deviation-and-mad",
            "bounding-statistics-for-grouped-data",
            "effects-of-data-change-on-the-mean",
            "comparing-effects-of-data-change-on-measures-of-centrality",
            "statistical-effects-of-data-transformations",
          ],
        },
        {
          title: t("Correlation", "相关性"),
          topics: [
            "scatter-plots",
            "trend-lines",
            "predictions-with-trend-lines",
            "comparing-data-points-to-lines-of-best-fit",
            "interpreting-trend-line-coefficients",
            "linear-correlation",
            "residuals-and-residual-plots",
            "selecting-a-regression-model",
            "quadratic-regression",
          ],
        },
        {
          title: t("Introduction to Probability", "概率基础与互补事件"),
          topics: [
            "sets",
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "the-complement-of-an-event",
            "venn-diagrams-in-probability",
            "geometric-probability",
          ],
        },
        {
          title: t("Compound Events in Probability", "复合事件概率"),
          topics: [
            "the-union-of-sets",
            "the-intersection-of-sets",
            "compound-events-in-probability-from-experimental-data",
            "computing-probabilities-for-compound-events-using-venn-diagrams",
            "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
            "conditional-probabilities-from-venn-diagrams",
            "conditional-probabilities-from-tables",
            "the-multiplication-law-for-conditional-probability",
            "independent-events",
          ],
        },
      ],
    },
  ],
};

/** satMathPrep is an exam-focused digital SAT Math preparation course. */
export const satMathPrep: CourseDef = {
  id: "sat-math-prep",
  title: t("SAT Math Prep", "SAT 数学冲刺"),
  description: t(
    "A rigorous, exam-focused course covering the four domains of the digital SAT Math test: Algebra (linear equations, systems, inequalities, and graphs), Advanced Math (polynomials, quadratics, nonlinear equations, and exponentials), Geometry and Trigonometry (angles, triangles, circles, coordinate geometry, and right-triangle trigonometry), and Problem-Solving and Data Analysis (ratios, percentages, units, scatter plots, and probability).",
    "面向数字 SAT 考试四大核心板块的精讲冲刺课程：代数（一次方程、方程组、不等式与图象）、进阶数学（多项式、二次函数、非线性方程与指数模型）、几何与三角学（角、三角形、圆、坐标几何与直角三角形三角学）以及问题解决与数据分析（比、百分比、单位换算、散点图与概率）。",
  ),
  units: [
    {
      title: t("Algebra", "代数"),
      modules: [
        {
          title: t("Linear Expressions and Equations in One Variable", "一元一次表达式与方程"),
          topics: [
            "sat-exam-evaluating-expressions",
            "finding-equivalent-equations",
            "sat-exam-solving-one-step-addition-equations",
            "sat-exam-solving-one-step-multiplication-equations",
            "sat-exam-solving-multistep-linear-equations",
            "solving-equations-by-combining-terms",
            "sat-exam-solving-equations-with-fractional-coefficients",
            "sat-exam-solving-linear-equations-containing-binomials",
            "sat-exam-solving-linear-equations-containing-binomials-by-factoring",
            "sat-exam-solving-linear-equations-with-binomials-on-both-sides",
            "manipulating-linear-equations-containing-binomials",
          ],
        },
        {
          title: t("Word Problems and Modeling", "一次方程建模与应用题"),
          topics: [
            "numerical-word-problems",
            "multistep-numerical-word-problems",
            "sat-exam-constructing-models-with-one-variable-linear-equations",
            "sat-exam-modeling-and-solving-problems-using-linear-equations",
            "linear-models-presented-in-unsimplified-form",
            "sat-exam-modeling-geometry-problems-using-linear-equations",
          ],
        },
        {
          title: t("Two-Variable Linear Equations", "二元一次方程"),
          topics: [
            "sat-exam-solving-two-variable-linear-models",
            "sat-exam-constructing-models-with-two-variable-linear-equations",
            "sat-exam-modeling-totals-using-two-variable-linear-equations",
            "sat-exam-interpreting-two-variable-linear-equations",
            "sat-exam-interpreting-coefficients-of-two-variable-linear-equations",
          ],
        },
        {
          title: t("Linear Functions", "一次函数基础与特征"),
          topics: [
            "sat-exam-evaluating-linear-functions",
            "finding-a-function-input-for-a-given-output",
            "linear-functions-containing-unknown-parameters",
            "sat-exam-working-with-function-composition",
          ],
        },
        {
          title: t("Functions in Tabular Form", "表格形式的函数"),
          topics: [
            "sat-exam-identifying-tables-corresponding-to-linear-functions",
            "sat-exam-identifying-linear-functions-corresponding-to-tables",
            "linear-functions-as-tables-in-applications",
            "sat-exam-analyzing-functions-in-tabular-form",
            "sat-exam-function-tables-containing-unknown-parameters",
          ],
        },
        {
          title: t("Graphs of Linear Equations", "直线图象与方程形式"),
          topics: [
            "sat-exam-interpreting-coefficients-of-lines-in-slope-intercept-form",
            "sat-exam-finding-equations-of-lines-using-slopes-and-points",
            "sat-exam-graphs-of-linear-equations-in-slope-intercept-form",
            "finding-intercepts-of-lines-in-slope-intercept-form",
            "sat-exam-constructing-and-analyzing-slope-intercept-equations",
            "sat-exam-properties-of-lines-given-in-standard-or-general-form",
            "sat-exam-analyzing-linear-equations-in-general-form",
            "analyzing-linear-equations-of-shifted-lines",
            "sat-exam-constructing-linear-functions-using-slope-intercept-form",
          ],
        },
        {
          title: t("Parallel and Perpendicular Lines", "平行线与垂线方程"),
          topics: ["sat-exam-parallel-lines", "sat-exam-slopes-of-perpendicular-lines", "sat-exam-perpendicular-lines"],
        },
        {
          title: t("Modeling With Linear Functions", "用一次函数建模"),
          topics: [
            "sat-exam-modeling-with-linear-functions",
            "sat-exam-constructing-models-using-linear-functions",
            "sat-exam-further-constructing-models-using-linear-functions",
            "sat-exam-interpreting-coefficients-of-linear-functions-in-context",
            "sat-exam-interpreting-graphs-of-linear-functions",
            "sat-exam-modeling-using-slope-intercept-form",
          ],
        },
        {
          title: t("Systems of Two-Variable Linear Equations", "二元一次方程组解法"),
          topics: [
            "sat-exam-solving-simple-systems-of-linear-equations",
            "sat-exam-identifying-structure-in-systems-of-linear-equations",
            "sat-exam-solving-systems-of-equations-using-addition-or-subtraction",
            "sat-exam-solving-systems-of-equations-using-elimination",
            "sat-exam-modeling-word-problems-with-systems-of-linear-equations",
            "sat-exam-solving-problems-with-systems-of-linear-equations",
            "sat-exam-solving-problems-with-systems-of-linear-equations-in-standard-form",
            "sat-exam-the-intersection-of-two-lines",
            "sat-exam-the-relationship-between-systems-of-linear-equations-and-graphs",
          ],
        },
        {
          title: t("Linear Equations With Infinitely Many or No Solutions", "特殊解与待定参数方程组"),
          topics: [
            "sat-exam-determining-the-number-of-solutions-to-a-linear-equation",
            "sat-exam-linear-equations-with-infinitely-many-solutions",
            "sat-exam-linear-equations-with-no-solutions",
            "sat-exam-determining-the-number-of-solutions-to-a-linear-system",
            "sat-exam-linear-systems-with-infinitely-many-solutions",
            "sat-exam-parametrizing-systems-of-linear-equations",
            "sat-exam-linear-systems-with-no-solution",
          ],
        },
        {
          title: t("Linear Inequalities One Variable", "一元一次不等式"),
          topics: [
            "sat-exam-constructing-models-with-one-variable-linear-inequalities",
            "sat-exam-modeling-and-solving-with-one-variable-linear-inequalities",
            "modeling-and-solving-percentage-problems-with-one-variable-linear-inequalities",
            "sat-exam-modeling-and-solving-with-one-variable-linear-inequalities-advanced-cases",
            "sat-exam-compound-inequalities",
            "sat-exam-constructing-models-with-compound-inequalities",
          ],
        },
        {
          title: t("Linear Inequalities in Two Variables", "二元一次不等式与图象"),
          topics: [
            "sat-exam-solutions-of-two-variable-linear-inequalities",
            "sat-exam-modeling-with-two-variable-linear-inequalities",
            "sat-exam-modeling-and-solving-two-variable-linear-inequalities",
            "sat-exam-systems-of-two-variable-inequalities",
            "sat-exam-modeling-with-systems-of-inequalities",
            "sat-exam-modeling-and-solving-systems-of-linear-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Advanced Math", "进阶数学"),
      modules: [
        {
          title: t("Polynomial Expressions", "多项式乘积与恒等变形"),
          topics: [
            "sat-exam-adding-polynomials",
            "sat-exam-adding-polynomials-using-the-distributive-law",
            "sat-exam-multiplying-binomials",
            "sat-exam-factoring-polynomials-using-the-gcf",
            "sat-exam-factoring-binomials-using-differences-of-squares",
            "sat-exam-factoring-trinomials",
            "sat-exam-factoring-higher-order-polynomials",
          ],
        },
        {
          title: t("Rational Expressions", "分式化简"),
          topics: [
            "sat-exam-simplifying-rational-expressions-by-factoring",
            "sat-exam-simplifying-rational-expressions-using-polynomial-factorization",
            "sat-exam-adding-rational-expressions",
            "sat-exam-further-adding-rational-expressions",
            "sat-exam-fractions-of-fractions",
          ],
        },
        {
          title: t("Exponential Expressions", "指数幂与根式化简"),
          topics: [
            "sat-exam-exponential-expressions",
            "sat-exam-simplifying-exponential-expressions",
            "sat-exam-simplifying-exponential-expressions-using-the-distributive-law",
          ],
        },
        {
          title: t("Quadratic Equations", "一元二次方程与根"),
          topics: [
            "sat-exam-perfect-square-quadratic-equations",
            "sat-exam-solving-quadratic-equations-using-the-zero-product-rule",
            "sat-exam-solving-quadratic-equations-by-factoring",
            "sat-exam-solving-quadratic-equations-with-leading-coefficients-by-factoring",
            "sat-exam-solving-quadratic-equations-using-the-quadratic-formula",
            "sat-exam-quadratic-equations-with-one-real-solution",
            "sat-exam-quadratic-equations-with-two-real-solutions",
            "sat-exam-quadratic-equations-with-no-real-solutions",
            "sat-exam-counting-solutions-to-quadratic-equations",
            "sat-exam-applying-vieta-s-formulas",
            "sat-exam-solving-quadratic-equations-with-unknown-parameters",
          ],
        },
        {
          title: t("Quadratic Functions", "二次函数与顶点式"),
          topics: [
            "sat-exam-quadratic-functions",
            "sat-exam-graphs-of-quadratic-functions",
            "determining-inputs-of-quadratic-functions-for-given-outputs",
            "finding-extreme-values-of-quadratic-functions-in-factored-form",
            "sat-exam-finding-extreme-values-of-quadratic-functions-in-vertex-form",
            "finding-extreme-values-of-quadratic-functions-in-standard-form",
            "sat-exam-using-standard-and-factored-forms-to-reason-about-quadratic-functions",
            "sat-exam-using-symmetry-to-reason-about-quadratic-functions",
            "sat-exam-identifying-quadratic-functions-from-tabular-data",
          ],
        },
        {
          title: t("Modeling With Quadratics", "二次模型与最值"),
          topics: [
            "sat-exam-modeling-number-problems-with-quadratic-equations",
            "modeling-geometry-problems-with-quadratic-equations",
            "sat-exam-solving-border-problems-with-quadratic-equations",
            "sat-exam-interpreting-quadratic-functions-in-modeling-contexts",
            "sat-exam-interpreting-graphs-of-quadratic-functions-in-modeling-contexts",
            "sat-exam-modeling-planar-motion-using-quadratic-functions",
          ],
        },
        {
          title: t("Polynomials", "多项式乘法与恒等式"),
          topics: [
            "sat-exam-elementary-cubic-functions",
            "sat-exam-higher-degree-polynomials",
            "sat-exam-graphs-of-higher-degree-polynomials",
            "sat-exam-polynomial-transformations",
            "sat-exam-further-polynomial-transformations",
            "sat-exam-using-the-factor-theorem-to-reason-about-polynomials",
          ],
        },
        {
          title: t("Exponential Functions", "指数函数性质与图象"),
          topics: [
            "sat-exam-exponential-functions",
            "sat-exam-maxima-and-minima-of-exponential-functions",
            "sat-exam-exponential-functions-containing-unknown-parameters",
            "sat-exam-constructing-exponential-functions-from-descriptions",
            "sat-exam-exponential-functions-expressed-in-equivalent-forms",
            "transforming-exponential-functions",
            "identifying-exponential-functions-from-tabular-data",
          ],
        },
        {
          title: t("Modeling With Exponential Functions", "指数函数建模与年化率"),
          topics: [
            "sat-exam-constructing-exponential-growth-models",
            "sat-exam-constructing-exponential-decay-models",
            "sat-exam-determining-unknown-parameters-in-exponential-models",
            "calculating-unknown-times-in-exponential-models",
            "converting-units-of-time-in-exponential-models",
            "sat-exam-interpreting-exponential-models",
          ],
        },
        {
          title: t("Nonlinear Equations and Functions", "非线性方程与函数"),
          topics: [
            "sat-exam-absolute-value-equations",
            "sat-exam-rational-equations",
            "sat-exam-radical-equations",
            "sat-exam-equations-containing-multiple-radicals",
            "sat-exam-absolute-value-functions",
            "sat-exam-rational-functions",
          ],
        },
        {
          title: t("Multivariable Equations", "多元公式变形"),
          topics: [
            "sat-exam-solving-multivariable-equations",
            "sat-exam-further-multivariable-equations",
            "sat-exam-solving-multivariable-rational-equations",
            "sat-exam-solving-multivariable-nonlinear-equations",
          ],
        },
        {
          title: t("Interpreting Graphs", "解读图象"),
          topics: [
            "sat-exam-identifying-intercepts-of-functions-from-graphs",
            "identifying-graph-properties-in-modeling-contexts",
            "sat-exam-interpreting-graph-properties-in-modeling-contexts",
          ],
        },
        {
          title: t("Systems of Nonlinear Equations", "非线性方程组"),
          topics: [
            "solving-constant-quadratic-systems-of-equations",
            "sat-exam-solving-linear-quadratic-systems-of-equations",
            "sat-exam-solving-challenging-linear-quadratic-systems-of-equations",
            "sat-exam-exploiting-structure-to-solve-nonlinear-systems-of-equations",
            "sat-exam-linear-quadratic-systems-with-one-solution",
            "sat-exam-linear-quadratic-systems-with-zero-or-two-solutions",
            "sat-exam-other-systems-of-nonlinear-equations",
          ],
        },
      ],
    },
    {
      title: t("Geometry and Trigonometry", "几何与三角学"),
      modules: [
        {
          title: t("Lines, Angles, and Triangles", "线、角与三角形内角"),
          topics: [
            "sat-exam-corresponding-angles",
            "sat-exam-consecutive-angles",
            "sat-exam-vertical-angles",
            "sat-exam-problem-solving-with-corresponding-angles",
            "sat-exam-interior-angles-of-triangles",
            "sat-exam-interior-angles-of-special-triangles",
            "sat-exam-exterior-angles-of-triangles",
            "sat-exam-solving-problems-with-multiple-triangles",
            "sat-exam-interior-and-exterior-angles-in-connected-triangles",
          ],
        },
        {
          title: t("Area and Perimeter", "平面多边形周长与面积"),
          topics: [
            "sat-exam-areas-of-rectangles-and-squares",
            "sat-exam-perimeters-of-squares-rectangles-and-triangles",
            "sat-exam-calculating-areas-in-the-coordinate-plane",
            "sat-exam-constructing-functions-representing-area-and-perimeter",
          ],
        },
        {
          title: t("Right Triangles", "直角三角形与勾股定理"),
          topics: [
            "sat-exam-areas-of-right-triangles",
            "sat-exam-the-pythagorean-theorem",
            "sat-exam-modeling-situations-using-the-pythagorean-theorem",
            "sat-exam-problem-solving-with-isosceles-right-triangles",
            "sat-exam-problem-solving-with-special-triangles",
            "sat-exam-further-problem-solving-with-special-triangles",
            "sat-exam-solving-right-triangle-problems-by-manipulating-radicals",
          ],
        },
        {
          title: t("Circles", "圆、弧长与扇形面积"),
          topics: [
            "sat-exam-radians",
            "sat-exam-arc-lengths-of-sectors",
            "sat-exam-areas-and-circumferences-of-circles",
            "sat-exam-isosceles-triangles-formed-within-circles",
            "sat-exam-tangent-lines-to-circles",
            "sat-exam-bisectors-of-chords",
          ],
        },
        {
          title: t("Circles in the Coordinate Plane", "坐标平面中的圆方程"),
          topics: [
            "sat-exam-the-canonical-equation-of-a-circle",
            "sat-exam-canonical-equations-of-transformed-circles",
            "sat-exam-general-equations-of-circles-in-the-coordinate-plane",
            "sat-exam-solving-problems-involving-the-canonical-equation-of-a-circle",
          ],
        },
        {
          title: t("Inscribed Shapes", "内接与相切图形"),
          topics: [
            "sat-exam-solving-problems-involving-inscribed-squares",
            "sat-exam-solving-problems-involving-inscribed-circles",
            "sat-exam-solving-problems-involving-circles-inscribed-in-equilateral-triangles",
            "sat-exam-solving-problems-involving-equilateral-triangles-inscribed-in-circles",
          ],
        },
        {
          title: t("Surface Area and Volume", "柱体、锥体与球体表面积与体积"),
          topics: [
            "sat-exam-volumes-of-right-rectangular-prisms",
            "sat-exam-surface-areas-of-right-rectangular-prisms",
            "sat-exam-volumes-and-surface-areas-of-cubes",
            "sat-exam-volumes-of-cylinders",
            "sat-exam-volumes-of-cylinders-word-problems",
            "sat-exam-volumes-of-spheres",
            "sat-exam-volumes-of-cones",
            "sat-exam-volumes-of-composite-solids",
            "sat-exam-constructing-functions-representing-surface-area-and-volume",
            "sat-exam-surface-areas-of-combined-rectangular-prisms",
          ],
        },
        {
          title: t("Congruence and Similarity", "全等与相似"),
          topics: [
            "sat-exam-congruent-triangles",
            "sat-exam-finding-corresponding-angles-in-similar-shapes",
            "sat-exam-finding-corresponding-lengths-in-similar-shapes",
            "sat-exam-solving-problems-with-similar-triangles",
            "solving-problems-with-embedded-right-triangles",
            "sat-exam-further-problem-solving-with-embedded-right-triangles",
            "sat-exam-identifying-information-needed-to-determine-similarity",
            "sat-exam-relating-length-and-area-in-similar-shapes",
            "sat-exam-length-surface-area-and-volume-in-similar-solids",
          ],
        },
        {
          title: t("Trigonometry", "直角三角函数与互余关系"),
          topics: [
            "sat-exam-trigonometric-ratios-in-right-triangles",
            "sat-exam-calculating-lengths-and-areas-using-trigonometry",
            "sat-exam-calculating-trigonometric-ratios-using-the-pythagorean-theorem",
            "sat-exam-cofunction-relationships-and-identities",
            "sat-exam-relations-between-trigonometric-ratios-in-similar-right-triangles",
            "sat-exam-problem-solving-using-trigonometric-ratios-in-similar-right-triangles",
            "sat-exam-trigonometric-ratios-of-large-special-angles",
          ],
        },
      ],
    },
    {
      title: t("Problem-Solving and Data Analysis", "问题解决与数据分析"),
      modules: [
        {
          title: t("Sampling and Surveys", "随机抽样与误差范围"),
          topics: [
            "sat-exam-sampling-bias-and-validity",
            "sat-exam-estimation-from-proportions-and-samples",
            "sat-exam-interpreting-survey-data",
            "sat-exam-margin-of-error",
            "sat-margin-of-error-interpretation",
          ],
        },
        {
          title: t("Measures of Centrality", "均值、中位数与众数"),
          topics: [
            "sat-exam-the-mean-of-a-dataset",
            "sat-exam-the-median-of-a-dataset",
            "sat-exam-comparing-measures-of-center",
            "sat-exam-the-relationship-between-means-and-sums",
            "sat-exam-finding-unknown-observations-from-centrality-measures",
          ],
        },
        {
          title: t("Representing Data", "点图、箱线图与直方图"),
          topics: [
            "sat-exam-tabular-datasets",
            "sat-exam-frequency-tables",
            "bar-graphs",
            "sat-exam-box-plots",
            "sat-exam-measuring-centrality-from-frequency-tables",
            "sat-exam-bounding-statistical-metrics",
          ],
        },
        {
          title: t("Comparing Data", "异常值与数据集比较"),
          topics: [
            "sat-exam-comparing-data-sets",
            "sat-exam-comparing-data-sets-presented-visually",
            "sat-exam-comparing-centrality-measures-from-frequency-tables",
            "sat-exam-comparing-centrality-measures-with-symmetric-datasets",
            "sat-exam-comparing-statistical-effects-of-data-change",
            "sat-exam-effects-of-additional-data-on-centrality-measures",
          ],
        },
        {
          title: t("Probability", "事件概率与互补独立事件"),
          topics: [
            "sat-exam-simple-probabilities-in-real-world-contexts",
            "sat-exam-calculating-probabilities-from-datasets",
            "calculating-probabilities-from-frequency-tables",
            "sat-exam-simple-probabilities-from-two-way-frequency-tables",
            "sat-exam-conditional-probabilities-from-two-way-frequency-tables",
            "sat-exam-calculating-conditional-probabilities",
          ],
        },
        {
          title: t("Linear Regression", "散点图、趋势线与相关性"),
          topics: [
            "sat-exam-making-predictions-using-best-fit-lines",
            "sat-exam-the-slope-of-a-best-fit-line",
            "sat-exam-identifying-best-fit-lines",
            "best-fit-lines-with-compressed-axes",
            "sat-exam-analyzing-residuals-of-best-fit-lines",
            "transformations-of-best-fit-lines",
          ],
        },
        {
          title: t("Nonlinear Data Models", "非线性回归选择"),
          topics: [
            "sat-exam-interpreting-data-plots",
            "sat-exam-interpreting-time-series-graphs",
            "sat-exam-average-rate-of-change-from-data-plots",
            "sat-exam-linear-vs-exponential-models",
            "quadratic-vs-exponential-models",
          ],
        },
        {
          title: t("Percentages", "百分数计算与应用"),
          topics: [
            "sat-exam-finding-parts-of-numbers-from-percentages",
            "sat-exam-expressing-ratios-of-numbers-as-percentages",
            "finding-percentages-represented-by-variables",
            "sat-exam-finding-totals-from-percentages",
            "sat-exam-applying-percentages-in-succession",
          ],
        },
        {
          title: t("Percentage Change", "百分比增减、利息与折扣"),
          topics: [
            "sat-exam-expressing-percentage-change-using-decimals",
            "sat-exam-calculating-percentage-change",
            "sat-exam-applying-percentage-change",
            "sat-exam-finding-original-values-from-percentage-change",
            "sat-exam-applying-successive-percentage-changes",
            "further-successive-percentage-changes",
            "sat-exam-multistep-percentage-problems",
          ],
        },
        {
          title: t("Unit Conversions", "单位换算"),
          topics: [
            "sat-exam-unit-conversions-to-smaller-units-of-length",
            "sat-exam-unit-conversions-to-larger-units-of-length",
            "sat-exam-unit-conversions-between-units-of-mass-and-volume",
            "sat-exam-two-step-unit-conversions",
            "sat-exam-unit-conversions-between-mixed-units",
            "sat-exam-converting-between-mixed-units-containing-squares",
          ],
        },
        {
          title: t("Ratios, Rates and Proportional Relationships", "比、比率与比例关系"),
          topics: [
            "sat-exam-ratios",
            "sat-exam-applying-ratios",
            "sat-exam-working-with-ratios-in-various-settings",
            "sat-exam-rate-problems",
            "sat-exam-multistep-rate-problems",
            "sat-exam-speed-problems",
            "algebraic-expressions-with-rates-and-ratios",
            "sat-exam-solving-equations-describing-proportional-relationships",
            "sat-exam-calculating-density",
            "sat-exam-descriptions-of-physical-phenomena",
          ],
        },
      ],
    },
  ],
};

/** actMathFundamentals covers the complete mathematical foundations tested on the ACT exam. */
export const actMathFundamentals: CourseDef = {
  id: "act-math-fundamentals",
  title: t("ACT Math Fundamentals", "ACT 数学基础"),
  description: t(
    "Comprehensive coverage of the mathematical concepts, skills, and problem structures tested on the ACT exam: arithmetic, number theory, complex numbers, matrices, vectors, algebra, functions, trigonometry, geometry, conics, statistics, probability, and mathematical modeling.",
    "全面涵盖 ACT 考试所测验的数学概念、技巧与典型题型：算术、数论、复数、矩阵、向量、代数、函数、三角学、几何、圆锥曲线、统计、概率与数学建模。",
  ),
  units: [
    {
      title: t("Number & Quantity", "数与数量"),
      modules: [
        {
          title: t("Vectors in Cartesian Coordinates", "直角坐标系中的向量"),
          topics: [
            "one-step-equations-addition",
            "one-step-equations-multiplication",
            "two-step-equations",
            "solving-equations-with-square-roots",
            "classifying-triangles",
            "the-pythagorean-theorem",
            "introduction-to-vectors",
            "the-triangle-law-for-the-addition-of-two-vectors",
            "parallel-vectors",
            "linear-combinations-of-vectors-and-their-properties",
            "describing-the-position-vector-of-a-point-using-known-vectors",
            "two-dimensional-vectors-expressed-in-component-form",
            "reasoning-from-direction-and-displacement",
            "calculating-displacement-for-plane-motion",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d",
            "calculating-the-magnitude-of-cartesian-vectors-in-2d",
            "three-dimensional-vectors-in-component-form",
            "addition-and-scalar-multiplication-of-cartesian-vectors-in-3d",
            "calculating-the-dot-product-using-angle-and-magnitude",
            "calculating-the-dot-product-using-components",
          ],
        },
        {
          title: t("Matrix Multiplication and Determinants", "矩阵乘法与行列式"),
          topics: [
            "introduction-to-matrices",
            "adding-and-subtracting-matrices",
            "scalar-multiplication-of-matrices",
            "matrix-equations",
            "multiplying-a-matrix-by-a-column-vector",
            "multiplying-square-matrices",
            "conformability-for-matrix-multiplication",
            "multiplying-matrices",
            "powers-of-matrices",
            "zero-square-diagonal-and-identity-matrices",
            "multiplying-a-matrix-by-the-identity-matrix",
            "properties-of-matrix-multiplication",
            "the-determinant-of-a-2x2-matrix",
          ],
        },
        {
          title: t("Exponents", "指数"),
          topics: [
            "the-product-rule-for-exponents",
            "the-quotient-rule-for-exponents",
            "the-power-rule-for-exponents",
            "the-power-of-product-rule-for-exponents",
            "the-power-of-quotient-rule-for-exponents",
            "combining-the-rules-of-exponents",
          ],
        },
        {
          title: t("Scientific Notation", "科学记数法"),
          topics: [
            "writing-numbers-in-scientific-notation",
            "comparing-numbers-in-scientific-notation",
            "addition-and-subtraction-in-scientific-notation",
            "addition-in-scientific-notation-with-different-powers-of-ten",
            "subtraction-in-scientific-notation-with-different-powers-of-ten",
            "further-addition-in-scientific-notation-with-different-powers-of-ten",
            "multiplying-numbers-in-scientific-notation",
            "dividing-numbers-in-scientific-notation",
          ],
        },
        {
          title: t("Radicals", "根式"),
          topics: [
            "the-square-root-of-a-perfect-square",
            "the-cube-root-of-a-perfect-cube",
            "surds",
            "squaring-a-square-root",
            "evaluating-numerical-expressions-containing-radicals",
            "combining-like-terms",
            "adding-and-subtracting-radicals",
            "the-product-rule-for-radicals",
            "simplifying-expressions-with-surds",
            "rationalizing-denominators",
            "square-roots-of-algebraic-perfect-squares",
            "cube-roots-of-algebraic-perfect-cubes",
            "writing-radicals-using-fractional-exponents",
            "the-quotient-rule-for-radicals",
            "comparing-radicals",
          ],
        },
        {
          title: t("Order of Operations", "运算顺序"),
          topics: [
            "the-real-number-system",
            "evaluating-rational-number-expressions-without-exponents",
            "solving-problems-using-multiplication-and-division-of-rational-numbers",
            "solving-problems-using-the-four-operations-on-rational-numbers",
            "evaluating-expressions-with-positive-integer-exponents",
            "evaluating-expressions-with-integer-exponents",
          ],
        },
        {
          title: t("Number Theory", "数论"),
          topics: [
            "natural-numbers-integers-and-rational-numbers",
            "rational-numbers-as-finite-or-repeating-decimals",
            "divisibility-of-integers-by-2-5-10-4-and-8",
            "parity",
            "deducing-parity-from-an-integer-valued-expression",
            "finding-ones-digits-of-powers",
            "recovering-digits-from-base-expansions",
            "divisibility-of-integers-by-3-9-6-and-7",
            "prime-factors",
            "the-fundamental-theorem-of-arithmetic",
            "finding-greatest-common-factors-using-prime-factorization",
            "inequalities-and-solutions",
            "approximating-square-roots",
            "locating-a-radical-among-known-values",
            "finding-lowest-common-multiples-using-prime-factorization",
          ],
        },
        {
          title: t("Conditional Statements", "条件语句"),
          topics: [
            "conditional-statements",
            "converse-inverse-and-contrapositive",
            "forming-related-conditional-statements",
            "necessary-and-sufficient-conditions",
          ],
        },
        {
          title: t("Introduction to Complex Numbers", "复数入门"),
          topics: [
            "imaginary-numbers",
            "complex-numbers",
            "adding-and-subtracting-complex-numbers",
            "quadratic-equations-with-purely-imaginary-solutions",
            "cyclic-property-of-the-imaginary-unit",
          ],
        },
        {
          title: t("The Complex Conjugate and the Complex Plane", "共轭复数与复平面"),
          topics: [
            "the-complex-plane",
            "the-complex-conjugate",
            "special-properties-of-the-complex-conjugate",
            "the-complex-conjugate-and-the-roots-of-a-quadratic-equation",
            "dividing-complex-numbers",
          ],
        },
        {
          title: t("Introduction to Vectors", "向量入门"),
          topics: ["the-magnitude-of-a-vector", "problem-solving-using-vector-diagrams", "unit-vectors"],
        },
        {
          title: t("Introduction to Matrices", "矩阵入门"),
          topics: ["index-notation-for-matrices", "properties-of-matrix-addition"],
        },
      ],
    },
    {
      title: t("Algebra", "代数"),
      modules: [
        {
          title: t("Algebraic Expressions", "代数式"),
          topics: [
            "introduction-to-algebraic-expressions",
            "constructing-algebraic-expressions",
            "writing-combined-earnings-expressions",
            "evaluating-linear-expressions",
            "evaluating-algebraic-expressions",
            "evaluating-nested-expressions-after-substitution",
            "applying-defined-operations",
            "evaluating-rational-expressions",
            "identifying-terms-in-linear-expressions",
            "identifying-coefficients-and-constants",
            "the-greatest-common-factor-of-two-linear-expressions",
          ],
        },
        {
          title: t("Simplifying Linear Expressions", "化简一次式"),
          topics: [
            "properties-of-real-number-operations",
            "identifying-like-terms-in-linear-expressions",
            "applying-the-distributive-law-to-linear-expressions",
            "the-distributive-law-with-three-terms",
            "distributing-the-negative-sign-in-a-linear-expression",
            "simplifying-linear-expressions-using-the-distributive-law",
            "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted",
            "simplifying-linear-expressions-containing-fractions",
            "applying-a-common-multiple",
            "factoring-numerical-expressions",
            "factoring-linear-expressions",
          ],
        },
        {
          title: t("Solving Linear Equations", "解一元一次方程"),
          topics: [
            "solving-linear-equations-by-trial-and-error",
            "solving-linear-equations-with-fractional-coefficients",
            "solving-linear-equations-with-decimal-coefficients",
            "equations-with-variables-on-both-sides",
            "solving-linear-equations-containing-binomials",
            "equations-with-parentheses",
            "solving-linear-equations-by-clearing-a-rational-expression",
            "solving-linear-equations-using-cross-multiplication",
            "two-variable-linear-equations-and-their-solutions",
            "manipulating-expressions-and-equations",
            "solving-two-variable-equations",
            "linear-equations-with-infinitely-many-solutions",
            "linear-equations-with-no-solutions",
            "linear-equations-with-unknown-coefficients",
            "unknown-coefficients-by-factoring",
            "many-variable-equations",
            "rearranging-formulas",
            "solving-and-adjusting-a-given-formula",
          ],
        },
        {
          title: t("Graphs of Linear Equations", "一次方程的图象"),
          topics: [
            "the-cartesian-coordinate-system",
            "distances-between-points-in-the-coordinate-plane",
            "graphing-linear-equations",
            "horizontal-and-vertical-lines",
            "slope-of-a-line",
            "slope-intercept-form",
            "properties-of-lines-in-slope-intercept-form",
            "reasoning-from-incomplete-linear-graphs",

            "point-slope-form",
            "standard-form",
            "properties-of-lines-in-standard-form",
            "parallel-lines-in-the-coordinate-plane",
            "finding-equations-of-parallel-lines",
            "perpendicular-lines-in-the-coordinate-plane",
            "finding-equations-of-perpendicular-lines",
          ],
        },
        {
          title: t("Systems of Equations", "方程组"),
          topics: [
            "systems-of-linear-equations",
            "systems-of-equations-as-augmented-matrices",
            "solving-systems-by-substitution",
            "introduction-to-elimination",
            "elimination-with-one-transformation",
            "elimination-with-two-transformations",
            "systems-with-fractional-coefficients",
            "systems-with-decimal-coefficients",
            "systems-with-no-solution-or-infinitely-many-solutions",
            "intersection-of-two-lines",
            "modeling-with-systems",
            "coin-problems",
          ],
        },
        {
          title: t("Linear Inequalities", "一次不等式"),
          topics: [
            "representing-inequalities-on-number-lines",
            "compound-inequalities",
            "verifying-solutions-of-linear-inequalities",
            "solving-one-step-inequalities",
            "solving-multi-step-inequalities",
            "linear-inequalities-with-parameters",
            "solving-compound-inequalities",
            "counting-integers-within-bounds",
            "real-number-restrictions",
            "representing-solutions-to-inequalities-on-number-lines",
            "further-solving-linear-inequalities",
            "interval-notation",
            "unbounded-intervals",
            "unions-of-intervals",
            "intersections-of-intervals",
            "compound-or-inequalities",
            "optimizing-sums-differences-products-and-quotients",
            "comparing-quantities-under-constraints",
          ],
        },
        {
          title: t("Two-Variable Linear Inequalities", "二元一次不等式"),
          topics: [
            "graphing-strict-linear-inequalities",
            "graphing-non-strict-linear-inequalities",
            "further-graphing-linear-inequalities",
            "systems-of-linear-inequalities",
          ],
        },
        {
          title: t("Absolute Value Expressions and Equations", "绝对值式与方程"),
          topics: [
            "absolute-value-expressions",
            "rules-of-absolute-value",
            "further-rules-of-absolute-value",
            "absolute-value-equations",
            "absolute-value-inequalities",
            "reasoning-under-absolute-value-constraints",
            "further-absolute-value-equations",
          ],
        },
        {
          title: t("Polynomials", "多项式"),
          topics: [
            "introduction-to-polynomials",
            "degree-of-a-polynomial",
            "simplifying-polynomials",
            "distributive-law-for-polynomials",
            "adding-and-subtracting-polynomials",
            "monomials-binomials-and-trinomials",
            "multiplying-binomials",
            "multiplying-complex-numbers",
            "evaluating-mixed-complex-expressions",
            "reasoning-from-complex-products-and-nonreal-zeros",
            "multiplying-polynomials",
            "squaring-binomials",
            "square-roots-with-domain-restrictions",
            "difference-of-squares-formula",
            "expanding-binomials-using-pascals-triangle",
          ],
        },
        {
          title: t("Factoring Polynomials", "多项式因式分解"),
          topics: [
            "greatest-common-factor-of-monomials",
            "the-least-common-multiple-of-two-monomials",
            "factoring-polynomials-using-gcfs",
            "factoring-perfect-square-trinomials",
            "factoring-perfect-square-trinomials-with-leading-coefficients",
            "factoring-differences-of-squares",
            "factoring-trinomials",
            "factoring-trinomials-using-common-factors",
            "the-least-common-multiple-of-two-polynomials",
            "factoring-trinomials-with-leading-coefficients",
            "further-factoring-trinomials-with-leading-coefficients",
            "factoring-higher-order-polynomials-as-a-difference-of-squares",
            "factoring-biquadratic-expressions",
            "factoring-expressions-containing-binomials",
            "factoring-expressions-containing-hidden-factors",
            "equating-polynomial-coefficients",
          ],
        },
        {
          title: t("Quadratic Equations", "一元二次方程与根"),
          topics: [
            "introduction-to-quadratic-equations",
            "solving-odd-power-equations",
            "solving-even-power-equations",
            "solving-perfect-square-quadratic-equations",
            "perfect-square-quadratic-equations-with-one-or-no-solutions",
            "zero-product-rule",
            "solving-quadratic-equations-using-a-difference-of-squares",
            "solving-quadratic-equations-with-no-constant-term",
            "solving-quadratic-equations-by-factoring",
            "finding-variable-ratios-from-homogeneous-equations",
            "solving-quadratic-equations-containing-unknown-parameters",
            "solving-quadratic-equations-with-leading-coefficients-by-factoring",
            "completing-the-square",
            "completing-the-square-with-odd-linear-terms",
            "solving-quadratic-equations-by-completing-the-square",
            "completing-the-square-with-leading-coefficients",
            "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
            "the-quadratic-formula",
            "the-discriminant-of-a-quadratic-equation",
            "solving-quadratic-equations-with-complex-roots",
            "vietas-formulas",
            "solving-elementary-quadratic-inequalities",
            "matching-simple-quadratic-inequalities-to-number-lines",
            "determining-unknown-parameters-in-quadratic-equations-with-real-solutions",
            "quadratic-equations-with-one-real-solution",
            "solving-quadratic-inequalities-using-the-sign-table-method",
            "determining-unknown-parameters-in-quadratic-equations-with-no-real-solutions",
          ],
        },
        {
          title: t("Polynomial Expressions & Equations", "多项式式子与方程"),
          topics: [
            "further-factoring-of-polynomials-using-gcfs",
            "factoring-cubic-expressions-by-grouping",
            "factoring-sums-and-differences-of-cubes",
            "introduction-to-functions",
            "representations-of-functions",
            "graphs-of-functions",
            "roots-of-a-function",
            "determining-the-roots-of-polynomials",
            "solving-biquadratic-equations",
            "solving-polynomial-equations-using-the-gcf",
            "the-zero-product-rule-for-solving-polynomial-equations",
          ],
        },
        {
          title: t("Polynomial Theorems", "多项式定理"),
          topics: [
            "multiplicities-of-the-roots-of-polynomials",
            "equivalent-expressions-with-fractions",
            "simplifying-rational-expressions",
            "splitting-rational-expressions-into-terms",
            "dividing-polynomials-using-synthetic-division",
            "the-factor-theorem",
            "reasoning-about-coefficients-in-quadratic-equations-using-the-factor-theorem",
            "factoring-cubic-polynomials-using-the-factor-theorem",
            "the-remainder-theorem",
          ],
        },
        {
          title: t("Exponential Expressions & Equations", "指数式与指数方程"),
          topics: [
            "product-rule-with-algebraic-expressions",
            "quotient-rule-with-algebraic-expressions",
            "power-rule-with-algebraic-expressions",
            "power-of-product-rule-with-algebraic-expressions",
            "power-of-quotient-rule-with-algebraic-expressions",
            "combining-rules-of-exponents-with-algebraic-expressions",
            "rewriting-radical-expressions-using-the-laws-of-exponents",
            "simplifying-exponential-radical-expressions",
            "solving-exponential-equations",
            "solving-exponential-equations-with-a-quadratic-exponent",
            "solving-exponential-equations-with-fractional-solutions",
            "solving-exponential-equations-using-the-zero-product-property",
            "creating-exponential-growth-expressions",
            "creating-exponential-decay-expressions",
          ],
        },
        {
          title: t("Rational Expressions", "有理式"),
          topics: [
            "simplifying-rational-expressions-by-factoring",
            "simplifying-rational-expressions-with-sums-and-differences-of-cubes",
            "simplifying-rational-expressions-using-polynomial-factorization",
            "adding-and-subtracting-rational-expressions",
            "adding-rational-expressions-with-unlike-denominators",
            "multiplying-rational-expressions",
            "dividing-rational-expressions",
          ],
        },
        {
          title: t("Rational Equations", "有理方程"),
          topics: [
            "rational-equations-with-one-fractional-term",
            "identifying-impossible-cases-of-symbolic-quotients",
            "rational-equations-using-cross-multiplication",
            "rational-equations-containing-binomials",
            "rational-equations-using-the-flip-method",
            "rational-equations-with-three-terms",
            "advanced-rational-equations",
            "solving-many-variable-rational-equations",
            "inverse-variation",
          ],
        },
        {
          title: t("Radical Expressions", "根式"),
          topics: [
            "simplifying-square-roots-with-variables",
            "multiplying-radical-expressions",
            "quotient-rule-for-square-roots",
            "evaluating-radical-expressions",
            "adding-and-subtracting-radical-expressions",
            "solving-radical-equations",
            "solving-advanced-radical-equations",
            "solving-many-variable-nonlinear-equations",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("The Unit Circle", "单位圆"),
          topics: [
            "angles-in-the-coordinate-plane",
            "negative-angles-in-the-coordinate-plane",
            "circles",
            "arcs-segments-and-sectors-of-circles",
            "the-circumference-of-a-circle",
            "central-angles-and-arcs",
            "calculating-arc-lengths-of-circular-sectors",
            "introduction-to-radians",
            "coterminal-angles",
            "calculating-reference-angles",
            "angles-of-a-triangle",
            "isosceles-triangles",
            "isosceles-right-triangles",
            "thirty-sixty-ninety-triangles",
            "angles-and-sides-in-right-triangles",
            "ratios",
            "the-trigonometric-ratios",
            "calculating-trigonometric-ratios-using-the-pythagorean-theorem",
            "the-reciprocal-trigonometric-ratios",
            "special-trigonometric-ratios",
            "circles-in-the-coordinate-plane",
            "equations-of-circles-centered-at-the-origin",
            "properties-of-the-unit-circle-in-the-first-quadrant",
            "extending-the-trigonometric-ratios-using-the-unit-circle",
            "unit-rates",
            "degrees-of-accuracy",
            "calculating-side-lengths-of-right-triangles-using-trigonometry",
            "using-a-circle-with-a-second-condition",
            "trigonometric-ratios-with-radians",
            "extending-the-trigonometric-ratios-using-angles-in-radians",
            "extending-the-trigonometric-ratios-to-negative-angles",
            "extending-the-trigonometric-ratios-to-large-angles",
            "using-the-pythagorean-identity-in-the-first-quadrant",
            "extending-the-pythagorean-identity-to-all-quadrants",
          ],
        },
        {
          title: t("Special Trigonometric Ratios", "特殊角三角比"),
          topics: [
            "finding-trigonometric-ratios-of-quadrantal-angles",
            "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range",
            "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
            "evaluating-trigonometric-expressions",
            "further-extensions-of-the-special-trigonometric-ratios",
          ],
        },
        {
          title: t("Graphs of Trigonometric Functions", "三角函数的图象"),
          topics: [
            "periodic-functions",
            "graphing-sine-and-cosine",
            "graphing-tangent-and-cotangent",
            "even-and-odd-functions",
            "domain-of-a-function",
            "global-extrema",
            "increasing-and-decreasing",
            "local-extrema",
            "describing-properties-of-the-sine-function",
            "describing-properties-of-the-cosine-function",
            "describing-properties-of-the-tangent-function",
            "describing-properties-of-the-cotangent-function",
          ],
        },
        {
          title: t("Graph Transformations of Trigonometric Functions", "三角函数的图象变换"),
          topics: [
            "absolute-value-graphs",
            "graphing-elementary-quadratic-functions",
            "vertical-reflections-of-quadratic-functions",
            "graphs-of-general-quadratic-functions",
            "the-axis-of-symmetry-of-a-parabola",
            "the-vertex-form-of-a-parabola",
            "vertical-translations-of-functions",
            "vertical-translations-of-trigonometric-functions",
            "stretches-of-absolute-value-graphs",
            "vertical-stretches-of-functions",
            "vertical-stretches-of-trigonometric-functions",
            "horizontal-translations-of-functions",
            "horizontal-translations-of-trigonometric-functions",
            "horizontal-stretches-of-functions",
            "horizontal-stretches-of-trigonometric-functions",
            "combining-graph-transformations-two-operations",
            "combining-graph-transformations-three-or-more-operations",
            "combining-graph-transformations-of-sine-and-cosine",
            "graph-transformations-of-tangent-and-cotangent",
            "combining-graph-transformations-of-tangent-and-cotangent",
            "vertical-reflections-of-absolute-value-graphs",
            "vertical-reflections-of-functions",
            "horizontal-reflections-of-functions",
            "combining-reflections-with-other-graph-transformations",
            "graphing-reflections-of-trigonometric-functions",
            "graphing-reflections-of-trigonometric-functions-three-or-more-transformations",
          ],
        },
        {
          title: t("Properties of Transformed Trigonometric Functions", "变换后三角函数的性质"),
          topics: [
            "properties-of-transformed-sine-and-cosine-functions",
            "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions",
            "properties-of-transformed-tangent-and-cotangent-functions",
            "interpreting-trigonometric-models",
            "modeling-with-trigonometric-functions",
          ],
        },
        {
          title: t("Trigonometric Identities", "三角恒等式"),
          topics: [
            "simplifying-expressions-using-basic-trigonometric-identities",
            "simplifying-expressions-using-the-pythagorean-identity",
            "alternate-forms-of-the-pythagorean-identity",
            "simplifying-expressions-using-the-secant-tangent-identity",
            "alternate-forms-of-the-secant-tangent-identity",
            "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity",
            "simplifying-trigonometric-expressions-using-cofunction-identities",
          ],
        },
        {
          title: t("The Double-Angle Formulas", "二倍角公式"),
          topics: [
            "the-sum-and-difference-formulas-for-sine",
            "the-double-angle-formula-for-sine",
            "verifying-trigonometric-identities-using-the-double-angle-formula-for-sine",
            "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem",
            "the-sum-and-difference-formulas-for-cosine",
            "reasoning-with-trigonometric-identities",
            "the-double-angle-formula-for-cosine",
            "verifying-trigonometric-identities-using-the-double-angle-formulas-for-cosine",
          ],
        },
        {
          title: t("Functions", "函数"),
          topics: [
            "vertical-line-test",
            "end-behavior",
            "range-of-a-function",
            "range-advanced-cases",
            "unbounded-behavior-of-functions-near-a-point",
            "graphing-reciprocal-functions",
            "piecewise-functions",
            "arithmetic-of-functions",
            "function-composition",
            "reasoning-with-nested-function-composition",
            "describing-function-composition",
            "introduction-to-inverse-functions",
            "one-to-one-functions",
            "graphs-of-inverse-functions",
            "domain-and-range-of-inverse-functions",
            "invertible-functions",
            "calculating-the-inverse-of-a-function",
            "graphing-the-inverse-sine-function",
            "graphing-the-inverse-cosine-function",
            "graphing-the-inverse-tangent-function",
          ],
        },
        {
          title: t("Linear Functions", "一次函数"),
          topics: [
            "interpreting-linear-expressions",
            "modeling-with-linear-functions",
            "constructing-linear-functions",
            "linear-functions-in-tabular-form",
            "analyzing-linear-functions-in-tabular-form",
          ],
        },
        {
          title: t("Graph Transformations of Functions", "函数图象的变换"),
          topics: [
            "graph-transformations-of-reciprocal-functions",
            "combining-graph-transformations-of-reciprocal-functions",
            "domain-and-range-of-transformed-reciprocal-functions",
            "inverses-of-reciprocal-functions",
            "absolute-value-graph-transformations",
            "finding-equations-of-translated-functions",
            "transforming-polynomial-functions",
          ],
        },
        {
          title: t("Absolute Value Functions", "绝对值函数"),
          topics: ["combining-transformations-of-absolute-value-graphs", "roots-of-absolute-value-functions"],
        },
        {
          title: t("Quadratic Functions", "二次函数"),
          topics: [
            "roots-of-quadratic-functions",
            "solving-systems-of-nonlinear-equations",
            "the-discriminant-of-a-quadratic-function",
            "finding-intersections-of-lines-and-quadratic-functions",
            "solving-two-variable-nonlinear-inequalities",
            "the-average-of-the-roots-formula",
            "writing-the-equation-of-a-parabola-in-vertex-form",
            "fitting-quadratic-functions-to-data-using-vertex-form",
            "reasoning-from-function-representations",
            "reasoning-about-coefficients-of-quadratics-using-symmetry",
          ],
        },
        {
          title: t("Graphs of Polynomials", "多项式的图象"),
          topics: [
            "graphing-elementary-cubic-functions",
            "graphing-cubic-curves-containing-three-distinct-real-roots",
            "graphing-cubic-curves-containing-a-double-root",
            "graphing-cubic-curves-containing-one-distinct-real-root",
            "end-behavior-of-polynomials",
            "graphing-general-polynomials",
            "identifying-valid-outputs-of-factored-polynomials",
          ],
        },
        {
          title: t("Exponential Functions", "指数函数"),
          topics: [
            "exponential-functions",
            "modeling-exponential-growth-with-functions",
            "interpreting-exponential-growth",
            "solving-exponential-growth-problems",
            "modeling-exponential-decay-with-functions",
            "interpreting-exponential-decay",
            "solving-exponential-decay-problems",
            "linear-vs-exponential-growth-and-decay",
            "quadratic-vs-exponential-models",
            "deciding-which-function-eventually-exceeds-the-others",
          ],
        },
        {
          title: t("Graphs of Exponential Functions", "指数函数图象"),
          topics: [
            "graphing-exponential-growth-functions",
            "graphing-exponential-decay-functions",
            "vertical-translations-of-exponential-growth-functions",
            "vertical-translations-of-exponential-decay-functions",
            "vertical-reflections-of-exponential-functions",
            "interpreting-graphs-of-exponential-functions",
          ],
        },
        {
          title: t("Introduction to Logarithms", "对数入门"),
          topics: [
            "converting-between-exponential-and-logarithmic-form",
            "evaluating-logarithms",
            "solving-for-an-unknown-in-a-logarithm-statement",
            "natural-logarithm",
            "common-logarithm",
            "simplifying-logarithmic-expressions",
          ],
        },
        {
          title: t("The Laws of Logarithms", "对数运算法则"),
          topics: [
            "product-rule-for-logarithms",
            "quotient-rule-for-logarithms",
            "power-rule-for-logarithms",
            "combining-laws-of-logarithms",
            "change-of-base-formula",
            "solving-exponential-equations-using-logarithms",
            "solving-equations-containing-the-exponential-function",
            "using-scientific-notation-with-exponential-values",
            "modeling-with-compound-interest",
          ],
        },
        {
          title: t("Logarithmic Equations", "对数方程"),
          topics: [
            "solving-logarithmic-equations",
            "solving-logarithmic-equations-containing-the-natural-logarithm",
            "solving-logarithmic-equations-using-the-laws-of-logarithms",
            "solving-logarithmic-equations-with-logarithms-on-both-sides",
          ],
        },
        {
          title: t("Logarithmic Functions", "对数函数"),
          topics: [
            "graphing-logarithmic-functions",
            "combining-graph-transformations-of-logarithmic-functions",
            "inverses-of-exponential-and-logarithmic-functions",
          ],
        },
        {
          title: t("Rational Functions", "有理函数"),
          topics: [
            "vertical-asymptotes-of-rational-functions",
            "locating-holes-in-rational-functions",
            "horizontal-asymptotes-of-rational-functions",
            "the-domain-and-range-of-a-rational-function",
            "slant-asymptotes-of-rational-functions",
          ],
        },
        {
          title: t("Radical Functions", "根式函数"),
          topics: [
            "graphing-the-square-root-function",
            "graph-transformations-of-square-root-functions",
            "graphing-the-cube-root-function",
            "properties-of-transformed-square-root-functions",
            "the-domain-of-a-transformed-radical-function",
            "the-range-of-a-transformed-radical-function",
            "inverses-of-radical-functions",
          ],
        },
        {
          title: t("Introduction to Sequences", "数列入门"),
          topics: ["introduction-to-sequences", "recursive-sequences", "computing-terms-from-nonstandard-recurrences"],
        },
        {
          title: t("Arithmetic Sequences", "等差数列"),
          topics: [
            "arithmetic-sequences",
            "recursive-formulas-for-arithmetic-sequences",
            "nth-term-of-an-arithmetic-sequence",
            "explicit-and-recursive-arithmetic-formulas",
            "finding-the-common-difference-of-an-arithmetic-sequence",
            "arithmetic-sequences-from-two-terms",
            "index-of-a-term-in-an-arithmetic-sequence",
            "modeling-with-arithmetic-sequences",
          ],
        },
        {
          title: t("Geometric Sequences", "等比数列"),
          topics: [
            "geometric-sequences",
            "nth-term-of-a-geometric-sequence",
            "recursive-formulas-for-geometric-sequences",
            "geometric-sequences-from-two-terms",
            "index-of-a-term-in-a-geometric-sequence",
          ],
        },
        {
          title: t("Arithmetic Series", "等差数列求和"),
          topics: [
            "sigma-notation",
            "expressing-an-arithmetic-series-in-sigma-notation",
            "finding-the-sum-of-an-arithmetic-series",
            "finding-the-first-term-of-an-arithmetic-series",
            "calculating-the-number-of-terms-in-an-arithmetic-series",
            "modeling-with-arithmetic-series",
          ],
        },
        {
          title: t("Geometric Series", "等比数列求和"),
          topics: [
            "the-sum-of-a-finite-geometric-series",
            "finding-the-sum-of-an-infinite-geometric-series",
            "finding-terms-and-infinite-sums-of-geometric-sequences",
            "the-sum-of-the-first-n-terms-of-a-geometric-series",
          ],
        },
        {
          title: t("Parametric Equations and Polar Coordinates", "参数方程与极坐标"),
          topics: [
            "midpoints-in-the-coordinate-plane",
            "equations-of-circles",
            "solving-systems-of-nonlinear-equations-using-graphs",
            "systems-with-a-circle-and-a-line",
            "graphing-curves-defined-parametrically",
            "cartesian-equations-of-parametric-curves",
            "introduction-to-polar-coordinates",
            "converting-from-polar-coordinates-to-cartesian-coordinates",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何与三角学"),
      modules: [
        {
          title: t("Introduction to Geometry", "几何入门"),
          topics: [
            "the-segment-addition-postulate",
            "estimating-segment-lengths-from-other-lengths-in-a-figure",
            "midpoints",
            "collinear-points",
          ],
        },
        {
          title: t("Advanced Angles", "角的进阶"),
          topics: [
            "complementary-angles",
            "non-adjacent-complementary-angles",
            "supplementary-angles",
            "finding-angles-from-linear-pairs-and-adjacent-angles",
            "vertical-angles",
            "corresponding-angles",
            "alternate-angles",
            "consecutive-angles",
            "angle-criteria-for-parallel-lines",
            "congruent-angles",
            "angle-bisectors",
            "segment-bisectors-and-the-perpendicular-bisector-theorem",
            "solving-problems-with-angles",
          ],
        },
        {
          title: t("Geometric Transformations", "几何变换"),
          topics: [
            "translations-of-geometric-figures",
            "rotations-of-geometric-figures",
            "rotation-rules-in-the-coordinate-plane",
            "reflections-in-the-coordinate-plane",
            "reflections-across-arbitrary-lines",
            "dilations-of-geometric-figures",
            "dilations-of-figures-in-the-coordinate-plane",
            "stretches-of-geometric-figures",
            "combining-stretches-of-geometric-figures",
            "combining-geometric-transformations",
            "angles-of-polygons",
            "reflective-symmetry",
            "applying-sequences-of-rigid-motions",
            "reasoning-from-rigid-motions",
            "rotational-symmetry",
          ],
        },
        {
          title: t("Triangles", "三角形"),
          topics: [
            "exterior-angles-of-triangles",
            "the-exterior-angle-theorem",
            "problem-solving-with-angles-of-triangles",
            "the-triangle-inequality",
            "heights-of-triangles",
            "medians-and-centroids",
          ],
        },
        {
          title: t("Right Triangles", "直角三角形"),
          topics: ["area-of-isosceles-right-triangles", "area-of-thirty-sixty-ninety-triangles", "area-of-equilateral-triangles"],
        },
        {
          title: t("Polygons", "多边形"),
          topics: [
            "exterior-angles-of-polygons",
            "congruent-polygons",
            "regular-polygons",
            "properties-of-parallelograms",
            "properties-of-rectangles-and-squares",
            "properties-of-trapezoids",
            "finding-the-length-of-a-trapezoid-midsegment",
          ],
        },
        {
          title: t("Solid Geometry", "立体几何"),
          topics: [
            "identifying-three-dimensional-shapes",
            "introduction-to-ellipses",
            "conic-sections-as-slices-of-a-cone",
            "faces-vertices-and-edges-of-polyhedrons",
            "eulers-formula-for-polyhedra",
            "nets-of-polyhedrons",
            "finding-surface-areas-using-nets",
          ],
        },
        {
          title: t("Congruence", "全等"),
          topics: [
            "the-asa-congruence-criterion",
            "the-aas-congruence-criterion",
            "the-sas-congruence-criterion",
            "the-sss-congruence-criterion",
            "the-hl-congruence-criterion",
            "combining-congruence-criteria-for-triangles",
            "properties-of-congruence",
            "solving-problems-describing-congruent-triangles",
            "reasoning-about-congruent-triangles",
          ],
        },
        {
          title: t("Similarity", "相似"),
          topics: [
            "similarity-and-similar-polygons",
            "side-lengths-and-angle-measures-of-similar-polygons",
            "matching-parts-across-congruence-and-similarity",
            "areas-of-similar-polygons",
            "working-with-areas-of-similar-polygons",
            "working-with-descriptions-of-similar-shapes",
            "the-aa-similarity-criterion",
            "recovering-lengths-from-similarity-descriptions",
            "solving-problems-with-embedded-right-triangles",
            "the-sss-similarity-criterion",
            "the-sas-similarity-criterion",
            "combining-similarity-criteria-for-triangles",
            "solving-angle-problems-from-descriptions-of-similar-triangles",
            "solving-parallel-line-problems-from-descriptions",
            "the-midpoint-theorem",
            "the-triangle-proportionality-theorem",
            "reasoning-about-similar-triangles",
          ],
        },
        {
          title: t("Perimeter & Area of Plane Figures", "平面图形的周长与面积"),
          topics: [
            "perimeter",
            "area-of-rectangles-and-squares",
            "recovering-measures-of-squares-and-rectangles",
            "finding-the-area-covered-by-crossing-rectangular-strips",
            "diagonals-of-squares",
            "modeling-with-rectangles",
            "area-of-parallelograms",
            "areas-of-triangles",
            "area-of-trapezoids",
            "composite-shapes",
            "areas-of-regular-polygons",
            "areas-of-rhombuses-and-kites",
            "finding-areas-between-shapes",
            "constructing-functions-representing-properties-of-2d-shapes",
            "border-problems",
          ],
        },
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "partitioning-line-segments",
            "the-distance-formula",
            "the-distance-formula-in-three-dimensions",
            "calculating-perimeters-in-the-plane",
            "calculating-areas-of-rectangles-in-the-plane",
            "calculating-areas-of-triangles-and-quadrilaterals-in-the-plane",
            "finding-areas-and-perimeters-in-the-coordinate-plane",
            "finding-a-coordinate-triangles-area",
            "equations-of-tangent-lines-to-circles",
          ],
        },
        {
          title: t("Surface Area and Volume", "表面积与体积"),
          topics: [
            "volumes-of-cubes",
            "volumes-from-orthographic-views",
            "surface-areas-of-cubes",
            "face-diagonals-of-cubes",
            "diagonals-of-cubes",
            "volumes-of-rectangular-solids",
            "surface-areas-of-rectangular-solids",
            "surface-areas-and-volumes-of-similar-solids",
            "working-with-descriptions-of-similar-solids",
            "volumes-of-right-rectangular-prisms",
            "reasoning-from-a-rectangular-prism",
            "areas-of-circles",
            "volumes-of-cylinders",
            "surface-areas-of-cylinders",
            "volumes-of-spheres",
            "spheres-and-cubes-inscribed-in-each-other",
            "volumes-of-pyramids",
            "volumes-of-right-cones",
            "slant-heights-of-right-cones",
            "surface-areas-of-right-cones",
            "conical-frustums",
            "volumes-of-revolution",
            "surface-areas-of-pyramids",
            "recovering-solid-measures-from-diagrams",
            "solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres",
            "constructing-functions-representing-properties-of-rectangular-solids",
            "constructing-functions-representing-volumes-of-cylinders-cones-and-pyramids",
            "composite-solids",
            "surface-areas-of-combined-rectangular-prisms",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "circles-inscribed-in-squares",
            "squares-inscribed-in-circles",
            "reasoning-from-compound-right-triangles",
            "calculating-areas-of-circular-sectors",
            "further-calculating-areas-of-sectors",
            "problem-solving-with-circles",
            "composite-shapes-with-circles",
            "reasoning-from-composite-circle-figures",
            "tangent-lines-to-circles",
            "tangent-tangent-lines-to-circles",
            "isosceles-triangles-in-circles",
            "recovering-measures-from-central-angles",
            "perpendicular-bisectors-of-chords",
          ],
        },
        {
          title: t("Circle Theorems", "圆的定理"),
          topics: [
            "inscribed-angles",
            "problem-solving-with-inscribed-angles",
            "thales-theorem",
            "equilateral-triangles-inscribed-in-circles",
            "reasoning-from-inscribed-special-polygons",

            "angles-in-inscribed-right-triangles",
            "areas-of-inscribed-triangles",
            "further-angles-in-inscribed-right-triangles",
            "inscribed-quadrilaterals",
          ],
        },
        {
          title: t("Circles in the Coordinate Plane", "坐标平面中的圆"),
          topics: [
            "graphing-systems-of-linear-and-circular-inequalities",
            "determining-circle-properties-by-completing-the-square",
            "calculating-circle-intercepts",
            "intersections-of-circles-with-lines",
            "transforming-circles",
          ],
        },
        {
          title: t("Radians", "弧度制"),
          topics: ["calculating-arc-length-using-radians", "calculating-areas-of-sectors-using-radians"],
        },
        {
          title: t("Trigonometry", "三角学"),
          topics: [
            "calculating-angles-in-right-triangles-using-trigonometry",
            "evaluating-expressions-containing-inverse-trigonometric-functions",
            "evaluating-trigonometric-functions-of-inverse-ratios",
            "writing-angles-as-inverse-tangents",
            "modeling-with-trigonometry",
            "trigonometric-ratios-in-similar-right-triangles",
            "trigonometric-functions-of-complementary-angles",
            "calculating-trigonometric-ratios-from-descriptions",
            "calculating-areas-of-right-triangles-using-trigonometry",
            "solving-multiple-right-triangles-using-trigonometry",
          ],
        },
        {
          title: t("Trigonometry With General Triangles", "一般三角形中的三角学"),
          topics: [
            "the-law-of-sines",
            "the-law-of-cosines",
            "the-area-of-a-general-triangle",
            "modeling-using-the-law-of-sines",
            "modeling-using-the-law-of-cosines",
          ],
        },
        {
          title: t("Ellipses", "椭圆"),
          topics: [
            "equations-of-ellipses-centered-at-the-origin",
            "equations-of-ellipses-centered-at-a-general-point",
            "finding-the-center-and-axes-of-ellipses-by-completing-the-square",
            "finding-intercepts-of-ellipses",
            "finding-intersections-of-ellipses-and-lines",
            "foci-of-ellipses",
          ],
        },
        {
          title: t("Hyperbolas", "双曲线"),
          topics: [
            "equations-of-hyperbolas-centered-at-the-origin",
            "equations-of-hyperbolas-centered-at-a-general-point",
            "asymptotes-of-hyperbolas-centered-at-the-origin",
            "finding-intercepts-and-intersections-of-hyperbolas",
            "foci-of-hyperbolas",
            "recovering-unstated-features-of-hyperbolas",
            "focal-distance-properties-of-ellipses-and-hyperbolas",
          ],
        },
      ],
    },
    {
      title: t("Statistics & Probability", "统计与概率"),
      modules: [
        {
          title: t("Sampling", "抽样"),
          topics: [
            "sampling",
            "estimation-from-samples",
            "biased-and-unbiased-samples",
            "classifying-statistical-studies",
            "interpreting-survey-results",
          ],
        },
        {
          title: t("Summarizing Data", "数据的概括"),
          topics: [
            "mean-of-a-data-set",
            "mean-absolute-deviation",
            "variance-and-standard-deviation",
            "the-median-of-a-data-set",
            "comparing-statistics-a-constraint-forces",
            "the-mode-of-a-data-set",
            "range-quartiles-and-iqr",
            "outliers",
            "removing-outliers",
            "combining-means",
            "determining-unknown-observations-given-statistical-metrics",
          ],
        },
        {
          title: t("Frequency Tables", "频数表"),
          topics: [
            "frequency-tables",
            "joint-frequency-tables",
            "dot-plots",
            "two-way-frequency-tables",
            "interpreting-completed-two-way-tables",
            "cumulative-frequency",
            "calculating-means-from-frequency-tables",
            "calculating-medians-from-frequency-tables",
            "calculating-modes-from-frequency-tables",
          ],
        },
        {
          title: t("Representing Data", "数据的表示"),
          topics: [
            "box-plots",
            "histograms",
            "measuring-centrality-from-dot-plots",
            "measuring-range-and-mad-from-dot-plots",
            "measuring-quartiles-and-iqr-from-dot-plots",
            "calculating-modes-and-medians-from-histograms",
            "calculating-means-from-histograms",
            "comparing-measures-of-center",
            "symmetry-skew-and-outliers",
          ],
        },
        {
          title: t("Comparing Data", "数据的比较"),
          topics: [
            "comparing-means",
            "comparing-medians",
            "comparing-data-sets-using-range-and-quartiles",
            "comparing-measures-of-spread",
            "comparing-data-set-visualizations-using-standard-deviation-and-mad",
            "comparing-data-sets-using-standard-deviation-and-mad",
            "effects-of-data-change-on-the-mean",
            "comparing-effects-of-data-change-on-measures-of-centrality",
            "tracking-a-data-change",
            "comparing-data-sets",
          ],
        },
        {
          title: t("Correlation", "相关性"),
          topics: [
            "scatter-plots",
            "trend-lines",
            "predictions-with-trend-lines",
            "comparing-data-points-to-lines-of-best-fit",
            "interpreting-trend-line-coefficients",
            "linear-correlation",
            "residuals-and-residual-plots",
            "selecting-a-regression-model",
            "quadratic-regression",
          ],
        },
        {
          title: t("Introduction to Probability", "概率入门"),
          topics: [
            "sets",
            "experimental-probability",
            "using-experimental-probability-to-make-predictions",
            "sample-spaces-and-events-in-probability",
            "the-likelihood-of-an-event",
            "single-events-in-probability",
            "using-probability-to-make-predictions",
            "analyzing-probability-models",
            "constructing-probability-models-from-context",
            "judging-evidence-against-a-probability-model",
            "the-complement-of-an-event",
            "counting-favorable-outcomes-in-a-constructed-sample-space",
            "venn-diagrams-in-probability",
            "geometric-probability",
            "adjusting-outcomes-to-a-target-probability",
          ],
        },
        {
          title: t("Compound Events in Probability", "复合事件概率"),
          topics: [
            "the-union-of-sets",
            "the-intersection-of-sets",
            "compound-events-in-probability-from-experimental-data",
            "computing-probabilities-for-compound-events-using-venn-diagrams",
            "counting-members-from-venn-data",
            "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
            "computing-probabilities-for-three-events-using-venn-diagrams",
            "the-addition-law-of-probability",
            "applying-the-addition-law-with-event-complements",
            "mutually-exclusive-events",
            "reasoning-from-stated-probability-relationships",
            "computing-probabilities-of-compound-events",
            "conditional-probabilities-from-venn-diagrams",
            "conditional-probabilities-from-tables",
            "the-multiplication-law-for-conditional-probability",
            "independent-events",
            "the-law-of-total-probability",
            "tree-diagrams-for-dependent-events",
            "tree-diagrams-for-dependent-events-applications",
          ],
        },
        {
          title: t("Combinatorics and Discrete Random Variables", "组合数学与离散随机变量"),
          topics: [
            "the-rules-of-sum-and-product",
            "factorials",
            "factorials-in-variable-expressions",
            "ordering-objects",
            "permutations",
            "combinations",
            "counting-discrete-cases-indirectly",
            "pascals-triangle-and-the-binomial-coefficients",
            "expanding-a-binomial-using-binomial-coefficients",
            "counting-integer-solutions-of-a-constrained-equation",
            "computing-probabilities-using-combinatorics",
            "probability-mass-functions-of-discrete-random-variables",
            "expected-values-of-discrete-random-variables",
          ],
        },
        {
          title: t("The Normal Distribution", "正态分布"),
          topics: [
            "cumulative-distribution-functions-for-discrete-random-variables",
            "the-z-score",
            "the-standard-normal-distribution",
            "symmetry-properties-of-the-standard-normal-distribution",
            "the-normal-distribution",
            "the-empirical-rule-for-the-normal-distribution",
          ],
        },
      ],
    },
    {
      title: t("Integrating Essential Skills", "基本技能整合"),
      modules: [
        {
          title: t("Ratios", "比"),
          topics: [
            "equivalent-ratios",
            "writing-ratios-using-fractions",
            "reasoning-with-equivalent-ratios",
            "scaling-a-mix-after-converting-units",

            "further-reasoning-with-equivalent-ratios",
            "partitioning-totals-using-ratios",
            "fractions-of-fractions",
            "reasoning-with-multi-stage-fractional-amounts",
            "ratio-tables",
            "graphing-ratios",
          ],
        },
        {
          title: t("Unit Rates", "单位率"),
          topics: [
            "algebraic-expressions-with-rates-and-ratios",
            "solving-problems-using-unit-rates",
            "computing-totals-from-stated-rates",
            "speed-as-a-unit-rate",
            "unit-rates-associated-with-ratios-of-fractions",
            "solving-unit-rate-problems-using-ratios-of-fractions",
            "manipulating-ratios-in-various-contexts",
          ],
        },
        {
          title: t("Proportional Relationships", "比例关系"),
          topics: [
            "understanding-proportional-relationships-using-tables",
            "understanding-proportional-relationships-using-graphs",
            "understanding-proportional-relationships-from-descriptions",
            "modeling-with-direct-variation",
            "selecting-function-models-and-outputs",
            "joint-variation",
            "modeling-with-inverse-variation",
          ],
        },
        {
          title: t("Percentages", "百分数"),
          topics: [
            "understanding-percentages-using-models",
            "converting-between-percentages-and-fractions",
            "converting-between-percentages-and-decimals",
            "comparing-fractions-percents-and-decimals",
            "finding-part-of-a-number-given-a-whole-and-a-percentage",
            "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems",
            "finding-a-percentage-given-two-numbers",
            "finding-a-percentage-given-two-numbers-word-problems",
            "finding-a-total-given-a-part-and-a-percentage",
            "applying-percentage-increases",
            "applying-percentage-decreases",
            "calculating-percentage-change",
            "finding-original-values-from-percentage-increases",
            "finding-original-values-from-percentage-decreases",
            "applying-percentages-in-succession",
            "percentages-in-commerce-and-finance",
            "further-percentages-in-commerce-and-finance",
            "solving-multipart-commerce-and-finance-percentage-problems",
            "reasoning-from-multi-stage-percentages",
          ],
        },
        {
          title: t("Units", "单位"),
          topics: [
            "two-step-unit-conversions",
            "unit-conversions-using-base-units-of-mass",
            "converting-units-of-volume-to-smaller-units",
            "unit-conversions-using-base-units-of-length",
            "applying-converted-lengths",
            "converting-units-of-length-to-larger-units-using-long-division",
            "unit-conversions-using-units-of-time",
            "converting-units-of-time-to-smaller-units",
            "taking-a-part-of-a-converted-duration",
            "converting-units-of-area",
            "converting-units-of-area-to-larger-units",
            "using-converted-units-of-area",
            "units-in-formulas",
            "units-of-rates-of-change",
            "the-average-rate-of-change-of-a-function",
            "mixed-units",
            "converting-between-mixed-units-containing-squares",
            "solving-one-and-two-step-money-problems-with-rounded-amounts",
            "division-of-whole-numbers-with-decimal-quotients-and-rounding",
            "interpreting-descriptions-of-physical-phenomena",
          ],
        },
      ],
    },
    {
      title: t("Modeling", "建模"),
      modules: [
        {
          title: t("Modeling With Linear Equations", "用一元一次方程建模"),
          topics: [
            "modeling-with-linear-equations",
            "consecutive-integer-problems",
            "speed-distance-time",
            "reasoning-with-derived-travel-rates",
            "further-speed-distance-time",
            "reasoning-about-multi-leg-travel",
            "work-problems",
            "mixture-problems",
          ],
        },
        {
          title: t("Modeling With Two-Variable Linear Equations", "二元一次方程建模"),
          topics: [
            "modeling-with-two-variable-linear-equations",
            "modeling-totals-with-two-variable-equations",
            "analyzing-graphs-of-linear-models",
            "further-modeling-with-two-variable-equations",
            "distance-time-graphs",
            "speed-time-graphs",
            "distance-from-speed-time-graphs",
          ],
        },
        {
          title: t("Modeling With Inequalities", "不等式建模"),
          topics: [
            "introduction-to-modeling-with-inequalities",
            "modeling-with-one-step-inequalities",
            "modeling-with-two-step-inequalities",
            "modeling-real-world-problems-using-inequalities",
            "modeling-with-compound-inequalities",
            "modeling-with-two-variable-inequalities",
          ],
        },
        {
          title: t("Modeling With Quadratic Functions", "用二次函数建模"),
          topics: [
            "modeling-downwards-vertical-motion",
            "modeling-upwards-vertical-motion",
            "vertical-motion",
            "revenue-cost-and-profit-functions",
          ],
        },
      ],
    },
  ],
};

/** actMathPrep is an exam-focused ACT Math preparation course covering the six reporting categories. */
export const actMathPrep: CourseDef = {
  id: "act-math-prep",
  title: t("ACT Math Prep", "ACT 数学冲刺"),
  description: t(
    "An intensive, exam-focused preparation course covering the six ACT Math reporting categories: Number & Quantity (exponents, radicals, number theory), Integrating Essential Skills (ratios, proportions, percentages, units), Algebra (equations, inequalities, systems, polynomials, quadratics), Functions (linear, quadratic, exponential, logarithmic, and trigonometric), Geometry (angles, polygons, circles, solids, conics, vectors, matrices, complex numbers), and Statistics & Probability (data, probability, combinatorics, and regression modeling).",
    "面向 ACT 数学考试六大题型板块的专项精讲冲刺课程：数与数量（指数、根式与数论）、基本技能整合（比、比例、百分比与单位换算）、代数（方程、不等式、方程组、多项式与二次方程）、函数（一次、二次、指数、对数与三角函数）、几何（角、多边形、圆、立体、圆锥曲线、向量、矩阵与复平面）以及统计与概率（数据分析、概率、排列组合与回归建模）。",
  ),
  units: [
    {
      title: t("Number & Quantity", "数与数量"),
      modules: [
        {
          title: t("Exponents and Radicals", "指数与根式"),
          topics: [
            "act-exam-simplifying-integer-powers",
            "act-exam-simplifying-negative-exponents",
            "act-exam-applying-scientific-notation",
            "act-exam-simplifying-rational-exponents",
            "act-exam-evaluating-powers",
            "act-exam-reducing-radical-expressions",
            "act-exam-rewriting-radical-sums-and-binomials",
            "act-exam-estimating-roots",
            "act-exam-identifying-characteristics-of-powers",
            "act-exam-solving-exponential-equations",
          ],
        },
        {
          title: t("Number Theory", "数论"),
          topics: [
            "act-exam-finding-a-greatest-common-factor",
            "act-exam-applying-divisibility-conditions",
            "act-exam-finding-a-least-common-multiple",
            "act-exam-using-remainders",
            "act-exam-finding-a-digit-in-a-repeating-decimal",
            "act-exam-comparing-repeating-decimals",
            "act-exam-using-prime-factorizations",
            "act-exam-identifying-prime-numbers",
            "act-exam-determining-parity",
            "act-exam-identifying-irrational-numbers",
            "act-exam-using-properties-of-consecutive-integers",
            "act-exam-identifying-true-statements-about-integers",
          ],
        },
        {
          title: t("Complex Numbers", "复数"),
          topics: [
            "act-exam-simplifying-expressions-with-the-imaginary-unit",
            "act-exam-computing-with-complex-numbers",
            "act-exam-multiplying-complex-numbers",
            "act-exam-using-complex-conjugates",
            "act-exam-dividing-complex-numbers",
          ],
        },
        {
          title: t("Matrices", "矩阵"),
          topics: [
            "act-exam-combining-matrices",
            "act-exam-multiplying-a-matrix-by-a-scalar",
            "act-exam-multiplying-matrices",
            "act-exam-finding-determinants",
            "modeling-with-matrix-products",
          ],
        },
        {
          title: t("Vectors", "向量"),
          topics: ["act-exam-finding-components-of-a-vector", "act-exam-combining-vectors"],
        },
      ],
    },
    {
      title: t("Algebra", "代数"),
      modules: [
        {
          title: t("Algebraic Expressions", "代数式"),
          topics: [
            "act-exam-combining-like-terms",
            "act-exam-distributing-over-binomials",
            "act-exam-expanding-products-of-binomials",
            "act-exam-expanding-powers-of-binomials",
            "act-exam-factoring-algebraic-expressions",
            "act-exam-simplifying-by-canceling-factors",
            "act-exam-evaluating-algebraic-expressions",
            "applying-defined-operations",
            "act-exam-rewriting-expressions-using-relations",
          ],
        },
        {
          title: t("Linear Equations", "一次方程"),
          topics: [
            "act-exam-solving-linear-equations",
            "act-exam-working-backward-to-find-an-unknown",
            "act-exam-solving-linear-equations-with-parentheses",
            "act-exam-evaluating-expressions-after-solving",
            "act-exam-solving-literal-equations",
            "act-exam-applying-linear-formulas",
            "act-exam-identifying-characteristics-of-linear-equations",
          ],
        },
        {
          title: t("Linear Inequalities", "一次不等式"),
          topics: [
            "act-exam-solving-linear-inequalities",
            "act-exam-identifying-consequences-of-inequalities",
            "act-exam-writing-linear-inequalities",
            "act-exam-finding-a-threshold-from-a-linear-inequality",
            "act-exam-graphing-linear-inequalities",
            "act-exam-using-systems-of-linear-inequalities",
          ],
        },
        {
          title: t("Systems of Linear Equations", "一次方程组"),
          topics: [
            "act-exam-solving-linear-systems",
            "act-exam-solving-systems-by-elimination",
            "act-exam-determining-how-many-solutions-a-system-has",
            "act-exam-modeling-word-problems-with-systems",
            "act-exam-using-a-system-solution",
            "act-exam-solving-three-variable-systems",
          ],
        },
        {
          title: t("Quadratic Equations", "二次方程"),
          topics: [
            "act-exam-factoring-quadratic-expressions",
            "act-exam-using-factors-of-a-quadratic",
            "act-exam-solving-perfect-square-equations",
            "act-exam-solving-quadratic-equations-by-factoring",
            "act-exam-applying-the-quadratic-formula",
            "act-exam-using-the-discriminant",
            "act-exam-applying-vieta-s-formulas",
            "act-exam-modeling-with-quadratic-equations",
          ],
        },
        {
          title: t("Polynomials", "多项式"),
          topics: ["act-exam-expanding-binomial-powers", "act-exam-factoring-polynomials", "act-exam-solving-higher-degree-equations"],
        },
        {
          title: t("Rational, Radical, and Absolute Value Equations", "有理方程、根式方程与绝对值方程"),
          topics: [
            "act-exam-simplifying-rational-expressions",
            "act-exam-combining-rational-expressions",
            "act-exam-identifying-characteristics-of-rational-expressions",
            "act-exam-solving-proportions",
            "act-exam-solving-rational-equations",
            "act-exam-solving-square-root-equations",
            "act-exam-isolating-variables-from-powers",
            "act-exam-identifying-characteristics-of-radical-expressions",
            "act-exam-identifying-characteristics-of-absolute-values",
            "act-exam-solving-absolute-value-equations",
            "act-exam-determining-absolute-value-solution-sets",
            "act-exam-solving-absolute-value-inequalities",
          ],
        },
        {
          title: t("Modeling With Algebra", "用代数建模"),
          topics: [
            "act-exam-writing-rate-and-earnings-models",
            "act-exam-writing-structural-linear-models",
            "act-exam-writing-quantity-and-spending-models",
            "act-exam-expressing-related-quantities",
            "act-exam-writing-linear-models-from-data",
            "act-exam-using-a-given-algebraic-model",
            "act-exam-modeling-perimeter-problems",
            "act-exam-modeling-cost-problems",
            "act-exam-modeling-related-quantity-problems",
            "act-exam-modeling-mixture-problems",
            "act-exam-equating-linear-models",
            "act-exam-modeling-with-nonlinear-equations",
          ],
        },
      ],
    },
    {
      title: t("Functions", "函数"),
      modules: [
        {
          title: t("Function Notation and Composition", "函数记号与复合"),
          topics: [
            "act-exam-evaluating-a-function",
            "act-exam-evaluating-a-function-in-context",
            "act-exam-evaluating-a-multivariable-function",
            "act-exam-performing-operations-on-functions",
            "act-exam-evaluating-function-compositions",
            "act-exam-composing-functions-algebraically",
            "act-exam-finding-an-inverse-function",
            "act-exam-identifying-characteristics-of-functions",
          ],
        },
        {
          title: t("Linear and Quadratic Functions", "一次函数与二次函数"),
          topics: [
            "act-exam-writing-function-rules-from-data",
            "act-exam-matching-functions-to-representations",
            "act-exam-determining-rates-of-change",
            "act-exam-determining-function-outputs",
            "act-exam-finding-extreme-values-of-quadratics",
            "act-exam-locating-points-on-a-parabola",
            "act-exam-transforming-quadratic-functions",
          ],
        },
        {
          title: t("Exponential and Logarithmic Functions", "指数函数与对数函数"),
          topics: [
            "act-exam-evaluating-exponential-functions",
            "act-exam-constructing-exponential-models",
            "act-exam-identifying-features-of-exponential-functions",
            "act-exam-finding-inputs-of-exponential-functions",
            "act-exam-evaluating-logarithms",
            "act-exam-applying-logarithm-properties",
            "act-exam-relating-exponential-and-logarithmic-forms",
            "act-exam-solving-logarithmic-equations",
            "act-exam-identifying-features-of-logarithmic-functions",
          ],
        },
        {
          title: t("Polynomial, Rational, and Other Functions", "多项式函数、有理函数及其他函数"),
          topics: [
            "act-exam-determining-domain-from-an-equation",
            "act-exam-reading-domain-from-a-graph",
            "act-exam-finding-asymptotes-of-a-rational-function",
            "act-exam-finding-points-and-zeros-of-a-function",
            "act-exam-describing-behavior-of-a-function-graph",
            "act-exam-determining-the-range-of-a-function",
            "act-exam-translating-function-graphs-vertically",
            "act-exam-translating-horizontally-and-reflecting-graphs",
            "act-exam-matching-a-graph-to-an-equation",
            "act-exam-interpreting-piecewise-graphs",
          ],
        },
        {
          title: t("Sequences and Series", "数列与级数"),
          topics: [
            "act-exam-working-with-arithmetic-sequences",
            "act-exam-finding-a-term-of-a-geometric-sequence",
            "act-exam-writing-an-explicit-formula-for-a-sequence",
            "act-exam-computing-terms-of-a-recursive-sequence",
            "act-exam-summing-an-arithmetic-series",
            "act-exam-summing-geometric-and-other-series",
          ],
        },
        {
          title: t("Trigonometric Functions", "三角函数"),
          topics: [
            "act-exam-converting-angle-measures",
            "act-exam-finding-points-in-standard-position",
            "act-exam-using-the-pythagorean-identity",
            "act-exam-finding-cosine-from-sine",
            "act-exam-applying-quotient-and-angle-identities",
            "act-exam-identifying-equivalent-trig-representations",
            "act-exam-finding-amplitude-period-and-range",
            "act-exam-matching-and-transforming-trig-graphs",
            "act-exam-finding-triangle-area-using-sine",
            "act-exam-using-the-law-of-sines",
            "act-exam-using-the-law-of-cosines",
            "act-exam-solving-trig-equations-and-inequalities",
          ],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Lines, Angles, and Polygons", "线、角与多边形"),
          topics: [
            "act-exam-finding-lengths-on-a-line",
            "act-exam-finding-angles-formed-by-intersecting-lines",
            "act-exam-finding-reflex-and-divided-angles",
            "act-exam-problem-solving-with-intersecting-lines",
            "act-exam-solving-angle-bisector-problems",
            "act-exam-finding-angles-with-parallel-lines",
            "act-exam-problem-solving-with-parallel-lines",
            "act-exam-finding-interior-angles-of-triangles",
            "act-exam-finding-exterior-angles-of-triangles",
            "act-exam-finding-angles-in-isosceles-triangles",
            "act-exam-problem-solving-with-isosceles-triangles",
            "act-exam-relating-sides-to-opposite-angles",
            "act-exam-applying-the-triangle-inequality",
            "act-exam-classifying-triangles",
            "act-exam-identifying-angle-and-shape-properties",
            "act-exam-finding-interior-angles-of-polygons",
            "act-exam-finding-angles-in-parallelograms",
            "act-exam-finding-lengths-with-parallel-sides",
            "act-exam-finding-lengths-in-regular-polygons",
          ],
        },
        {
          title: t("Congruence and Similarity", "全等与相似"),
          topics: [
            "act-exam-translating-and-reflecting-a-point",
            "act-exam-applying-a-rigid-motion",
            "act-exam-dilating-a-figure",
            "act-exam-identifying-corresponding-parts-under-congruence",
            "act-exam-using-corresponding-parts-under-similarity",
            "act-exam-finding-corresponding-lengths-in-similar-figures",
            "act-exam-using-scale-factors-in-similar-figures",
            "act-exam-finding-lengths-using-parallel-lines",
            "act-exam-finding-areas-of-similar-figures",
          ],
        },
        {
          title: t("Right Triangles and Right-Triangle Trigonometry", "直角三角形与直角三角形中的三角学"),
          topics: [
            "act-exam-applying-the-pythagorean-theorem",
            "act-exam-modeling-situations-using-the-pythagorean-theorem",
            "act-exam-finding-diagonals-and-perimeters-with-the-pythagorean-theorem",
            "act-exam-finding-lengths-in-figures-with-the-pythagorean-theorem",
            "act-exam-finding-altitudes-and-areas-with-the-pythagorean-theorem",
            "act-exam-checking-and-applying-pythagorean-relationships",
            "act-exam-problem-solving-with-special-triangles",
            "act-exam-finding-trigonometric-ratios",
            "act-exam-finding-a-trigonometric-ratio-from-other-ratios",
            "act-exam-using-cofunction-relationships",
            "act-exam-finding-a-side-from-a-trigonometric-ratio",
            "act-exam-finding-a-length-from-an-angle-measure",
            "act-exam-writing-an-inverse-trigonometric-expression",
          ],
        },
        {
          title: t("Area and Perimeter", "面积与周长"),
          topics: [
            "act-exam-finding-areas-of-composite-rectilinear-figures",
            "act-exam-finding-areas-of-divided-rectangles",
            "act-exam-finding-perimeters-of-figures",
            "act-exam-using-a-given-perimeter",
            "act-exam-finding-areas-of-quadrilaterals",
            "act-exam-finding-areas-of-triangles",
            "act-exam-finding-shaded-areas-with-circles",
            "act-exam-comparing-areas-of-figures",
            "act-exam-finding-areas-of-nested-regions",
            "act-exam-finding-a-length-from-area",
          ],
        },
        {
          title: t("Circles", "圆"),
          topics: [
            "act-exam-finding-areas-involving-circles",
            "act-exam-finding-the-circumference-of-a-circle",
            "act-exam-finding-distance-along-a-circle",
            "act-exam-comparing-areas-of-circles",
            "act-exam-finding-arc-measure",
            "act-exam-finding-arc-length",
            "act-exam-finding-angles-in-circles",
            "act-exam-problem-solving-with-circle-lengths",
          ],
        },
        {
          title: t("Coordinate Geometry", "坐标几何"),
          topics: [
            "act-exam-finding-the-midpoint-of-a-segment",
            "act-exam-finding-a-point-dividing-a-segment",
            "act-exam-finding-the-distance-between-points",
            "act-exam-finding-slope-from-two-points",
            "act-exam-finding-slope-from-an-equation",
            "act-exam-comparing-and-reading-slopes",
            "act-exam-interpreting-slope-and-its-changes",
            "act-exam-using-slopes-of-parallel-lines",
            "act-exam-using-slopes-of-perpendicular-lines",
            "act-exam-writing-the-equation-of-a-line",
            "act-exam-finding-a-point-on-a-line",
            "act-exam-writing-the-equation-of-a-circle",
            "act-exam-problem-solving-with-circles",
            "act-exam-further-problem-solving-with-circles",
            "act-exam-finding-area-in-the-coordinate-plane",
            "act-exam-placing-figures-in-the-coordinate-plane",
            "act-exam-locating-points-in-the-coordinate-plane",
          ],
        },
        {
          title: t("Solid Geometry", "立体几何"),
          topics: [
            "act-exam-finding-volumes-of-prisms-and-cylinders",
            "act-exam-finding-volumes-of-pyramids-cones-and-spheres",
            "act-exam-finding-a-dimension-from-volume",
            "act-exam-finding-the-surface-area-of-a-solid",
            "act-exam-converting-volume-in-context",
            "act-exam-applying-volume-scale-factors",
            "act-exam-packing-congruent-solids",
            "act-exam-identifying-features-of-a-solid",
          ],
        },
        {
          title: t("Conic Sections", "圆锥曲线"),
          topics: [
            "act-exam-writing-ellipse-equations",
            "act-exam-finding-features-of-an-ellipse",
            "act-exam-working-with-hyperbolas",
            "act-exam-analyzing-intersections-of-conics",
          ],
        },
      ],
    },
    {
      title: t("Statistics & Probability", "统计与概率"),
      modules: [
        {
          title: t("Measures of Center and Spread", "集中趋势与离散程度"),
          topics: [
            "act-exam-finding-a-weighted-mean",
            "act-exam-finding-a-median-from-frequencies",
            "act-exam-comparing-measures-of-center",
            "act-exam-finding-how-a-data-change-affects-a-mean",
            "act-exam-using-means-and-sums",
            "act-exam-determining-effects-of-changing-data",
            "act-exam-finding-unknown-values-from-center-measures",
            "act-exam-comparing-measures-of-spread",
          ],
        },
        {
          title: t("Data Displays", "数据的呈现"),
          topics: [
            "act-exam-reading-two-way-tables",
            "act-exam-reading-category-tables",
            "act-exam-reading-bar-graphs",
            "act-exam-working-with-circle-graphs",
            "act-exam-reading-frequency-distributions",
            "act-exam-reasoning-about-data-displays",
            "act-exam-reading-trend-graphs",
          ],
        },
        {
          title: t("Probability", "概率"),
          topics: [
            "act-exam-finding-a-simple-probability",
            "act-exam-solving-for-a-count-given-a-probability",
            "act-exam-working-with-event-relationships",
            "act-exam-finding-a-union-with-overlap",
            "act-exam-finding-a-probability-from-a-two-way-table",
            "act-exam-finding-a-conditional-probability-from-a-table",
            "act-exam-finding-a-conditional-probability",
            "act-exam-applying-a-conditional-probability",
            "act-exam-multiplying-independent-probabilities",
            "act-exam-finding-a-without-replacement-probability",
            "act-exam-problem-solving-with-dependent-selections",
            "act-exam-finding-a-probability-of-an-arrangement",
            "act-exam-finding-a-probability-from-a-sample-space",
            "act-exam-finding-a-geometric-probability",
            "act-exam-computing-an-expected-value",
            "act-exam-problem-solving-with-expected-value",
          ],
        },
        {
          title: t("Counting and Combinatorics", "计数与组合"),
          topics: [
            "act-exam-counting-independent-choices",
            "act-exam-counting-character-codes",
            "act-exam-counting-permutations",
            "act-exam-counting-combinations",
            "act-exam-counting-overlapping-sets",
            "act-exam-identifying-possible-set-sizes",
          ],
        },
        {
          title: t("Data Modeling", "数据建模"),
          topics: [
            "act-exam-estimating-a-population-mean",
            "act-exam-estimating-a-population-from-a-sample-proportion",
            "act-exam-judging-evidence-from-a-sample",
            "act-exam-identifying-a-model-type",
            "act-exam-applying-the-empirical-rule",
            "act-exam-fitting-a-linear-model-to-data",
            "act-exam-using-a-linear-model",
          ],
        },
      ],
    },
    {
      title: t("Integrating Essential Skills", "基本技能整合"),
      modules: [
        {
          title: t("Arithmetic and Number Sense", "算术与数感"),
          topics: [
            "act-exam-evaluating-absolute-value-expressions",
            "act-exam-evaluating-numeric-expressions",
            "act-exam-evaluating-factorials-and-quotients",
            "act-exam-comparing-signed-number-changes",
            "act-exam-computing-integer-amounts-in-context",
            "act-exam-identifying-place-value-and-properties",
            "act-exam-adding-fractions",
            "act-exam-subtracting-fractions",
            "act-exam-multiplying-fractions",
            "act-exam-dividing-with-fractions",
            "act-exam-finding-a-midpoint-between-fractions",
            "act-exam-locating-numbers-on-a-number-line",
            "act-exam-ordering-rational-numbers",
            "act-exam-estimating-square-roots",
          ],
        },
        {
          title: t("Ratios, Rates, and Proportions", "比、率与比例"),
          topics: [
            "act-exam-partitioning-a-total-in-a-given-ratio",
            "act-exam-finding-a-whole-from-a-ratio",
            "act-exam-composing-chained-ratios",
            "act-exam-comparing-ratios",
            "act-exam-applying-proportions",
            "act-exam-finding-a-unit-rate",
            "act-exam-solving-fuel-mileage-problems",
            "act-exam-working-with-a-rate-of-change",
            "act-exam-finding-distance-at-constant-speed",
            "act-exam-finding-position-or-travel-time",
            "act-exam-finding-an-average-speed",
            "act-exam-solving-multi-leg-speed-problems",
            "act-exam-combining-rates",
          ],
        },
        {
          title: t("Percentages", "百分数"),
          topics: [
            "act-exam-finding-a-percent-of-a-number",
            "act-exam-expressing-a-ratio-as-a-percent",
            "act-exam-finding-a-total-from-a-percent",
            "act-exam-applying-a-percent-change",
            "act-exam-taking-successive-percents",
            "act-exam-applying-successive-percent-changes",
            "act-exam-finding-a-percent-in-a-mixture",
          ],
        },
        {
          title: t("Units and Conversions", "单位与换算"),
          topics: [
            "act-exam-computing-with-mixed-units",
            "act-exam-converting-a-measurement",
            "act-exam-applying-conversion-factors",
            "act-exam-converting-a-rate",
          ],
        },
        {
          title: t("Numerical Word Problems", "数值应用题"),
          topics: [
            "act-exam-computing-a-total-from-unit-prices",
            "act-exam-finding-a-total-from-repeated-amounts",
            "act-exam-computing-a-cost-from-a-unit-rate",
            "act-exam-finding-a-remaining-amount",
            "act-exam-comparing-two-totals",
            "act-exam-finding-a-net-cost-or-profit",
            "act-exam-computing-overtime-pay",
            "act-exam-finding-a-unit-amount",
            "act-exam-finding-a-fractional-part-of-a-whole",
            "act-exam-applying-successive-fractions",
            "act-exam-packing-into-whole-groups",
            "act-exam-finding-counts-from-waste-and-limits",
            "act-exam-combining-segments-of-a-trip",
            "act-exam-identifying-a-necessary-conclusion",
          ],
        },
        {
          title: t("Basic Statistics", "基础统计"),
          topics: [
            "act-exam-finding-a-mean",
            "act-exam-finding-a-median",
            "act-exam-finding-a-value-from-a-mean",
            "act-exam-finding-a-difference-of-center-measures",
          ],
        },
        {
          title: t("Basic Measurement Geometry", "基础度量几何"),
          topics: [
            "act-exam-finding-the-area-of-a-rectangle",
            "act-exam-finding-the-area-of-a-square",
            "act-exam-finding-the-area-of-a-triangle",
            "act-exam-finding-a-side-from-equal-areas",
            "act-exam-combining-rectangle-areas",
            "act-exam-finding-a-shaded-fractional-area",
            "act-exam-finding-the-perimeter-of-a-rectangle",
            "act-exam-finding-the-perimeter-of-a-square",
            "act-exam-finding-the-volume-of-a-rectangular-prism",
            "act-exam-scaling-a-rectangular-prism-volume",
            "act-exam-counting-packed-rectangular-units",
          ],
        },
      ],
    },
  ],
};

/** firstGradeMath is the Common Core-aligned 1st Grade Math course. */
export const firstGradeMath: CourseDef = {
  id: "1st-grade-math",
  title: t("1st Grade Math", "一年级数学"),
  description: t(
    "Counting to 120, tens and ones, adding and subtracting within 20, word problems, adding tens, length, time, first graphs and shapes.",
    "数到 120、十和一、20 以内的加减法、应用题、整十数加减、长度、时间、初步的统计图和图形。",
  ),
  units: [
    {
      title: t("Numbers to 120", "120 以内的数"),
      modules: [
        { title: t("Counting and Writing Numbers", "数数和写数"), topics: ["counting-to-120", "reading-and-writing-numbers-to-120"] },
        {
          title: t("Tens and Ones", "十和一"),
          topics: ["ten-and-some-ones", "tens-and-ones", "counting-groups-of-ten", "comparing-two-digit-numbers"],
        },
      ],
    },
    {
      title: t("Adding and Subtracting Within 20", "20 以内的加减法"),
      modules: [
        {
          title: t("Strategies for Adding", "加法的策略"),
          topics: [
            "counting-on-to-add",
            "counting-back-to-subtract",
            "making-ten-to-add",
            "doubles-and-near-doubles",
            "adding-in-any-order",
            "adding-three-numbers-within-20",
          ],
        },
        {
          title: t("Connecting Addition and Subtraction", "联系加法和减法"),
          topics: ["subtracting-through-ten", "related-addition-and-subtraction-facts", "missing-addends-within-20", "the-equal-sign"],
        },
      ],
    },
    {
      title: t("Word Problems", "应用题"),
      modules: [
        {
          title: t("Stories Within 20", "20 以内的故事"),
          topics: [
            "adding-to-word-problems",
            "taking-away-word-problems",
            "comparing-word-problems-within-20",
            "word-problems-with-a-missing-part",
            "three-addend-word-problems",
          ],
        },
      ],
    },
    {
      title: t("Adding and Subtracting Tens", "整十数的加减"),
      modules: [
        {
          title: t("Working With Tens", "用十来计算"),
          topics: ["adding-multiples-of-ten", "adding-tens-to-two-digit-numbers", "ten-more-and-ten-less", "subtracting-multiples-of-ten"],
        },
      ],
    },
    {
      title: t("Length and Time", "长度和时间"),
      modules: [
        { title: t("Length", "长度"), topics: ["comparing-lengths-directly", "measuring-with-non-standard-units"] },
        { title: t("Time", "时间"), topics: ["telling-time-to-the-hour", "telling-time-to-the-half-hour"] },
      ],
    },
    {
      title: t("Data", "统计"),
      modules: [{ title: t("Tallies and Graphs", "计数表和统计图"), topics: ["tally-charts", "first-picture-graphs", "first-bar-graphs"] }],
    },
    {
      title: t("Shapes", "图形"),
      modules: [
        {
          title: t("Attributes and Equal Shares", "特征和等分"),
          topics: ["defining-attributes-of-shapes", "composing-shapes", "halves-and-fourths-of-shapes"],
        },
      ],
    },
    ...earlyGradesMoreUnits["1st-grade-math"],
  ],
};

/** secondGradeMath is the Common Core-aligned 2nd Grade Math course. */
export const secondGradeMath: CourseDef = {
  id: "2nd-grade-math",
  title: t("2nd Grade Math", "二年级数学"),
  description: t(
    "Place value to 1000, adding and subtracting within 100 and 1000, word problems, measuring length, time, money, graphs and shapes.",
    "1000 以内的位值、100 和 1000 以内的加减法、应用题、测量长度、时间、钱币、统计图和图形。",
  ),
  units: [
    {
      title: t("Number Patterns", "数的规律"),
      modules: [
        {
          title: t("Skip Counting and Arrays", "跳着数和点阵"),
          topics: ["skip-counting-by-2s-5s-and-10s", "even-and-odd-numbers", "arrays-and-repeated-addition"],
        },
      ],
    },
    {
      title: t("Place Value to 1000", "1000 以内的位值"),
      modules: [
        {
          title: t("Hundreds, Tens and Ones", "百、十和一"),
          topics: [
            "hundreds-as-bundles-of-tens",
            "skip-counting-by-100s",
            "place-value-up-to-1000",
            "expanded-form-up-to-1000",
            "number-names-up-to-1000",
          ],
        },
        {
          title: t("Comparing and Changing Numbers", "比较和改变数"),
          topics: ["comparing-numbers-up-to-1000", "adding-and-subtracting-10-or-100"],
        },
      ],
    },
    {
      title: t("Adding and Subtracting", "加法和减法"),
      modules: [
        {
          title: t("Within 100", "100 以内"),
          topics: [
            "adding-and-subtracting-within-20-quickly",
            "adding-within-100",
            "subtracting-within-100",
            "adding-several-two-digit-numbers",
            "missing-numbers-within-100",
          ],
        },
        { title: t("Within 1000", "1000 以内"), topics: ["adding-within-1000-with-models", "subtracting-within-1000-with-models"] },
      ],
    },
    {
      title: t("Word Problems", "应用题"),
      modules: [
        {
          title: t("Stories Within 100", "100 以内的故事"),
          topics: ["word-problems-within-100", "comparing-word-problems-within-100", "two-step-word-problems-within-100"],
        },
      ],
    },
    {
      title: t("Length", "长度"),
      modules: [
        {
          title: t("Measuring", "测量"),
          topics: [
            "measuring-length-in-inches-and-centimeters",
            "feet-and-meters",
            "same-length-in-different-units",
            "estimating-lengths",
            "comparing-lengths-by-measuring",
          ],
        },
        { title: t("Using Lengths", "运用长度"), topics: ["length-word-problems", "sums-and-differences-on-a-number-line"] },
      ],
    },
    {
      title: t("Time and Money", "时间和钱币"),
      modules: [
        { title: t("Time", "时间"), topics: ["telling-time-to-five-minutes", "a-m-and-p-m"] },
        { title: t("Money", "钱币"), topics: ["counting-coins", "dollars-and-cents"] },
      ],
    },
    {
      title: t("Data", "统计"),
      modules: [
        {
          title: t("Plots and Graphs", "线图和统计图"),
          topics: ["line-plots-of-lengths", "picture-graphs-of-single-units", "reading-bar-graphs"],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Shapes and Shares", "图形和等分"),
          topics: [
            "naming-polygons-by-their-sides",
            "counting-sides-and-angles",
            "faces-of-a-cube",
            "rows-and-columns-of-squares",
            "halves-thirds-and-fourths-of-shapes",
          ],
        },
      ],
    },
    ...earlyGradesMoreUnits["2nd-grade-math"],
  ],
};

/** thirdGradeMath is the Common Core-aligned 3rd Grade Math course. */
export const thirdGradeMath: CourseDef = {
  id: "3rd-grade-math",
  title: t("3rd Grade Math", "三年级数学"),
  description: t(
    "The meaning of multiplication and division, the facts up to 10 times 10, and the properties that make them easier; two-step word problems and number patterns; rounding and three-digit addition and subtraction; fractions as numbers on a number line; time to the minute, mass and liquid volume; scaled graphs and line plots; area, perimeter and the sorting of quadrilaterals.",
    "乘法和除法的意义，10 乘 10 以内的算式，以及使计算更容易的运算律；两步应用题和数的规律；取近似和三位数加减法；数轴上的分数；钟表读到分钟，质量和容积；带比例的统计图和线图；面积、周长和四边形的分类。",
  ),
  units: [
    {
      title: t("Multiplication", "乘法"),
      modules: [
        {
          title: t("The Meaning of Multiplication", "乘法的意义"),
          topics: ["multiplication-as-equal-groups", "multiplication-with-arrays"],
        },
        {
          title: t("Multiplication Facts", "乘法算式"),
          topics: ["multiplying-by-2-5-and-10", "multiplying-by-3-and-4", "multiplying-by-6-7-8-and-9", "multiplying-by-0-and-1"],
        },
        {
          title: t("Making Multiplication Easier", "让乘法更容易"),
          topics: ["properties-of-multiplication", "splitting-a-factor-to-multiply", "multiplying-by-multiples-of-10"],
        },
      ],
    },
    {
      title: t("Division", "除法"),
      modules: [
        {
          title: t("The Meaning of Division", "除法的意义"),
          topics: ["division-as-sharing", "division-as-making-groups", "relating-multiplication-and-division"],
        },
        {
          title: t("Division Facts", "除法算式"),
          topics: ["division-facts-to-100"],
        },
      ],
    },
    {
      title: t("Problem Solving and Patterns", "解决问题和规律"),
      modules: [
        {
          title: t("Word Problems", "应用题"),
          topics: [
            "multiplication-and-division-word-problems",
            "two-step-word-problems-with-all-operations",
            "expressions-with-two-operations",
          ],
        },
        {
          title: t("Patterns", "规律"),
          topics: ["arithmetic-patterns"],
        },
      ],
    },
    {
      title: t("Place Value", "数位"),
      modules: [
        {
          title: t("Three-Digit Numbers and Rounding", "三位数和取近似"),
          topics: ["understanding-three-digit-numbers", "rounding-to-the-nearest-ten", "rounding-to-the-nearest-hundred"],
        },
        {
          title: t("Adding and Subtracting", "加法和减法"),
          topics: ["adding-within-1000", "subtracting-within-1000"],
        },
      ],
    },
    {
      title: t("Fractions", "分数"),
      modules: [
        {
          title: t("Fractions as Numbers", "分数是数"),
          topics: ["unit-fractions", "fractions-as-parts-of-a-whole", "fractions-on-the-number-line"],
        },
        {
          title: t("Equal and Unequal Fractions", "相等和不等的分数"),
          topics: ["equal-fractions-with-pictures", "comparing-fractions-with-a-common-part"],
        },
      ],
    },
    {
      title: t("Measurement and Data", "测量和数据"),
      modules: [
        {
          title: t("Time, Mass and Volume", "时间、质量和容积"),
          topics: ["telling-time-to-the-minute", "elapsed-time-in-minutes", "grams-kilograms-and-liters"],
        },
        {
          title: t("Graphs and Line Plots", "统计图和线图"),
          topics: ["scaled-picture-graphs", "scaled-bar-graphs", "line-plots-of-measurements"],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Area", "面积"),
          topics: ["area-with-unit-squares", "area-of-a-rectangle-by-multiplying", "area-of-combined-rectangles"],
        },
        {
          title: t("Perimeter", "周长"),
          topics: ["perimeter-of-polygons", "same-perimeter-or-same-area"],
        },
        {
          title: t("Shapes", "图形"),
          topics: ["sorting-quadrilaterals", "equal-parts-of-shapes"],
        },
      ],
    },
    ...earlyGradesMoreUnits["3rd-grade-math"],
  ],
};

/** fourthGradeMath is the Common Core-aligned 4th Grade Math course. */
export const fourthGradeMath: CourseDef = {
  id: "4th-grade-math",
  title: t("4th Grade Math", "四年级数学"),
  description: t(
    "Place value, comparing and rounding whole numbers, and multi-digit addition and subtraction; multiplication and division with area models and place-value strategies, factors and multiples; fractions, mixed numbers, equivalent fractions, comparing, adding and subtracting fractions with like denominators, multiplying fractions by whole numbers, and decimal fractions; units and conversions, line plots, and the geometry of lines, rays and angles.",
    "数位、整数的比较与取近似数、多位数加减法；用面积模型和数位策略做乘除法，因数与倍数；分数、带分数、等值分数，分数的比较、同分母分数加减法、整数乘分数以及十进分数；单位与换算、线图，以及直线、射线与角的几何。",
  ),
  units: [
    {
      title: t("The Number System", "数系"),
      modules: [
        {
          title: t("Place Value", "数位"),
          topics: [
            "place-value-with-numbers-up-to-four-digits",
            "place-value-with-numbers-up-to-seven-digits",
            "writing-whole-numbers-in-words",
            "reading-whole-numbers-written-in-words",
            "converting-from-standard-form-to-expanded-form",
            "converting-from-expanded-form-to-standard-form",
            "equivalent-place-value-representations",
            "more-on-equivalent-place-value-representations",
            "equivalent-place-value-representations-and-borrowing",
          ],
        },
        {
          title: t("Comparing Whole Numbers", "比较整数"),
          topics: [
            "comparing-place-values",
            "comparing-whole-numbers",
            "comparing-whole-numbers-using-place-value",
            "rounding-down-whole-numbers",
            "rounding-up-whole-numbers",
            "rounding-up-the-digit-9",
          ],
        },
      ],
    },
    {
      title: t("Addition & Subtraction", "加法与减法"),
      modules: [
        {
          title: t("Adding Whole Numbers", "整数加法"),
          topics: [
            "adding-two-digit-whole-numbers",
            "adding-three-digit-and-two-digit-numbers",
            "adding-three-digit-numbers",
            "adding-numbers-up-to-five-digits",
            "adding-numbers-up-to-seven-digits",
            "adding-three-multi-digit-numbers",
            "estimating-multi-digit-addition",
          ],
        },
        {
          title: t("Subtracting Whole Numbers", "整数减法"),
          topics: [
            "subtracting-two-digit-numbers",
            "subtracting-two-digit-numbers-from-three-digit-numbers",
            "subtracting-three-digit-numbers",
            "subtracting-numbers-up-to-five-digits",
            "subtracting-numbers-up-to-seven-digits",
            "estimating-multi-digit-subtraction",
          ],
        },
      ],
    },
    {
      title: t("Multiplication", "乘法"),
      modules: [
        {
          title: t("Factors, Products, and Multiples", "因数、积与倍数"),
          topics: [
            "products-and-factors",
            "factors-of-a-number",
            "prime-and-composite-numbers",
            "multiples-of-a-number",
            "least-common-multiple",
            "least-common-multiple-by-listing",
            "connecting-factors-and-multiples",
            "greatest-common-factor-by-listing",
          ],
        },
        {
          title: t("Multiplying Whole Numbers", "整数乘法"),
          topics: [
            "multiplying-by-10-100-and-1000",
            "rewriting-numbers-ending-in-zeros",
            "multiplying-numbers-ending-in-zeros",
            "multiplying-using-repeated-addition",
            "multiplying-using-repeated-subtraction",
            "estimating-multi-digit-multiplication",
          ],
        },
        {
          title: t("Multiplying Whole Numbers Using Models", "用模型做整数乘法"),
          topics: [
            "two-digit-by-one-digit-multiplication-using-area-models",
            "multi-digit-by-one-digit-multiplication-using-area-models",
            "two-digit-by-one-digit-multiplication-using-place-value",
            "multi-digit-by-one-digit-multiplication-using-place-value",
            "two-digit-by-two-digit-multiplication-using-area-models",
            "two-digit-by-two-digit-multiplication-using-place-value",
          ],
        },
      ],
    },
    {
      title: t("Division", "除法"),
      modules: [
        {
          title: t("Dividing Whole Numbers", "整数除法"),
          topics: [
            "relationship-between-multiplication-and-division",
            "understanding-remainders-using-models",
            "finding-remainders",
            "dividends-divisors-quotients-and-remainders",
            "division-with-remainders",
            "interpreting-remainders-in-context",
            "dividing-by-10-100-and-1000",
            "dividing-by-one-digit-numbers-using-multiplication",
            "dividing-using-place-value-strategies",
            "estimating-multi-digit-division",
          ],
        },
        {
          title: t("Dividing Whole Numbers Using Models", "用模型做整数除法"),
          topics: [
            "two-digit-by-one-digit-division-using-area-models",
            "multi-digit-by-one-digit-division-using-area-models",
            "more-multi-digit-by-one-digit-division-using-area-models",
            "two-digit-by-one-digit-division-using-partial-quotients",
            "two-digit-by-one-digit-division-with-remainders-using-partial-quotients",
            "multi-digit-by-one-digit-division-using-partial-quotients",
          ],
        },
      ],
    },
    {
      title: t("Operations & Algebraic Thinking", "运算与代数思维"),
      modules: [
        {
          title: t("Operations on Numbers", "数的运算"),
          topics: [
            "evaluating-expressions-involving-addition-and-multiplication",
            "evaluating-expressions-containing-multiplication-and-division",
            "solving-multistep-word-problems-using-number-operations",
            "further-solving-multistep-word-problems-using-the-four-operations",
          ],
        },
        {
          title: t("Thinking Algebraically", "代数思维"),
          topics: [
            "interpreting-multiplication-equations-as-a-comparison",
            "representing-comparison-statements-as-equations",
            "word-problems-involving-additive-and-multiplicative-comparison",
            "generating-patterns",
            "identifying-patterns",
          ],
        },
      ],
    },
    {
      title: t("Fractions & Decimals", "分数与小数"),
      modules: [
        {
          title: t("Fractions", "分数"),
          topics: [
            "fraction-models",
            "modeling-fractions-using-number-lines",
            "writing-unit-fractions-in-words",
            "writing-fractions-in-words",
            "interpreting-fractions-as-division",
          ],
        },
        {
          title: t("Improper Fractions and Mixed Numbers", "假分数与带分数"),
          topics: [
            "improper-fractions",
            "models-for-mixed-numbers",
            "modeling-mixed-numbers-using-number-lines",
            "interpreting-division-problems-as-mixed-numbers",
            "converting-improper-fractions-to-mixed-numbers",
            "converting-mixed-numbers-to-improper-fractions",
          ],
        },
        {
          title: t("Equivalent Fractions", "等值分数"),
          topics: [
            "finding-equivalent-fractions-using-area-models",
            "equivalent-fractions-by-multiplying-and-dividing",
            "equivalent-fractions",
            "least-common-denominators",
            "writing-fractions-in-lowest-terms",
          ],
        },
        {
          title: t("Comparing Fractions", "比较分数"),
          topics: [
            "comparing-fractions",
            "comparing-fractions-using-unit-benchmarks",
            "comparing-fractions-using-one-half-benchmarks",
            "comparing-fraction-models-using-common-denominators",
            "comparing-fractions-using-common-denominators",
          ],
        },
        {
          title: t("Adding Fractions", "分数加法"),
          topics: [
            "adding-fractions-with-like-denominators-using-models",
            "adding-fractions-with-like-denominators",
            "subtracting-fractions-with-like-denominators",
            "adding-fractions-with-like-denominators-word-problems",
            "subtracting-fractions-with-like-denominators-word-problems",
            "decomposing-fractions-into-sums-using-models",
            "decomposing-fractions-into-sums",
          ],
        },
        {
          title: t("Adding Mixed Numbers", "带分数加法"),
          topics: [
            "adding-mixed-numbers-with-like-denominators",
            "subtracting-mixed-numbers-with-like-denominators",
            "subtracting-mixed-numbers-with-like-denominators-using-improper-fractions",
            "adding-mixed-numbers-with-like-denominators-word-problems",
            "subtracting-mixed-numbers-with-like-denominators-word-problems",
          ],
        },
        {
          title: t("Multiplying Fractions", "分数乘法"),
          topics: [
            "multiplying-unit-fractions-by-whole-numbers-using-models",
            "multiplying-fractions-by-whole-numbers-using-models",
            "multiplying-fractions-by-whole-numbers",
            "multiplying-fractions-by-whole-numbers-word-problems",
            "strategies-to-simplify-whole-number-and-fraction-multiplication",
          ],
        },
        {
          title: t("Decimals", "小数"),
          topics: [
            "decimal-fractions",
            "plotting-decimals-on-number-lines",
            "comparing-decimals-up-to-hundredths",
            "converting-fractions-to-decimals",
            "converting-mixed-numbers-to-decimals",
            "converting-decimals-to-fractions",
            "converting-decimals-to-mixed-numbers",
            "adding-decimal-fractions",
          ],
        },
      ],
    },
    {
      title: t("Measurement & Data", "测量与数据"),
      modules: [
        {
          title: t("Units", "单位"),
          topics: [
            "units-of-length",
            "units-of-mass",
            "units-of-time-and-elapsed-time",
            "units-of-volume",
            "converting-metric-units-of-length-to-smaller-units",
            "converting-customary-units-of-length-to-smaller-units",
            "converting-units-of-volume-to-smaller-units",
            "converting-units-of-mass-to-smaller-units",
            "converting-units-of-time-to-smaller-units",
          ],
        },
        {
          title: t("Representing and Interpreting Data", "表示与解读数据"),
          topics: ["creating-and-interpreting-line-plots", "creating-and-interpreting-line-plots-with-fractions"],
        },
        {
          title: t("Geometry", "几何"),
          topics: [
            "points-lines-rays-and-segments",
            "angles-and-angle-measures",
            "connecting-angles-and-circles",
            "measuring-angles-using-a-protractor",
            "right-straight-full-and-null-angles",
            "acute-obtuse-and-reflex-angles",
            "classifying-figures-based-on-angles",
            "sums-of-angles",
            "solving-angle-problems",
            "parallel-and-perpendicular-lines",
            "modeling-with-rectangles",
          ],
        },
      ],
    },
  ],
};

/** fifthGradeMath is the Common Core-aligned 5th Grade Math course. */
export const fifthGradeMath: CourseDef = {
  id: "5th-grade-math",
  title: t("5th Grade Math", "五年级数学"),
  description: t(
    "Whole number expressions and an introduction to negative numbers; multi-digit multiplication and division; adding and subtracting fractions and mixed numbers with unlike denominators; multiplying and dividing fractions; decimal place value, rounding and the four operations with decimals; exponents and powers of ten; converting to larger units, line plots with fractions, the coordinate plane and numerical patterns; volume of rectangular prisms, and classifying polygons and quadrilaterals.",
    "整数表达式与负数初步；多位数乘除法；异分母分数和带分数的加减法；分数乘除法；小数的数位、取近似数及小数四则运算；指数与 10 的幂；化成较大的单位、分数线图、坐标平面与数的规律；长方体的体积，以及多边形和四边形的分类。",
  ),
  units: [
    {
      title: t("The Number System", "数系"),
      modules: [
        {
          title: t("Whole Number Expressions", "整数表达式"),
          topics: [
            "evaluating-whole-number-expressions",
            "evaluating-whole-number-expressions-with-parentheses",
            "creating-and-interpreting-whole-number-expressions",
            "creating-whole-number-expressions-from-terminology",
            "additive-comparisons-of-whole-number-expressions",
            "multiplicative-comparisons-of-whole-number-expressions",
          ],
        },
        {
          title: t("Introduction to Negative Numbers", "负数初步"),
          topics: ["negative-numbers", "comparing-negative-numbers", "integers-and-opposites", "absolute-value"],
        },
      ],
    },
    {
      title: t("Multiplying & Dividing Whole Numbers", "整数乘除法"),
      modules: [
        {
          title: t("Multiplying Whole Numbers", "整数乘法"),
          topics: [
            "multiplying-numbers-by-powers-of-ten-using-place-value",
            "two-digit-by-one-digit-multiplication",
            "three-and-four-digit-by-one-digit-multiplication",
            "five-and-six-digit-by-one-digit-multiplication",
            "two-digit-by-two-digit-multiplication",
            "multi-digit-by-two-digit-multiplication",
            "three-digit-by-three-digit-multiplication",
          ],
        },
        {
          title: t("Dividing Whole Numbers", "整数除法"),
          topics: [
            "two-digit-by-one-digit-division",
            "three-digit-by-one-digit-division",
            "four-digit-by-one-digit-division",
            "using-fractions-to-represent-division-of-whole-numbers",
            "dividing-numbers-by-one-digit-numbers-with-rounding",
            "dividing-numbers-by-one-digit-numbers-interpreting-the-remainder",
            "dividing-by-two-digit-numbers-by-connecting-multiplication-and-division",
            "dividing-by-two-digit-numbers-with-remainders-by-connecting-multiplication-and-division",
            "multi-digit-by-two-digit-division-using-partial-quotients",
            "three-digit-by-two-digit-division",
            "four-digit-by-two-digit-division",
          ],
        },
      ],
    },
    {
      title: t("Adding & Subtracting Fractions", "分数加减法"),
      modules: [
        {
          title: t("Adding and Subtracting Fractions and Whole Numbers", "分数与整数的加减法"),
          topics: [
            "adding-fractions-and-whole-numbers-using-models",
            "adding-fractions-and-whole-numbers",
            "subtracting-fractions-and-whole-numbers-using-models",
            "subtracting-fractions-and-whole-numbers",
          ],
        },
        {
          title: t("Adding and Subtracting Fractions", "分数加减法"),
          topics: [
            "estimating-sums-and-differences-of-fractions",
            "adding-fractions-with-unlike-denominators-using-models",
            "subtracting-fractions-with-unlike-denominators-using-models",
            "adding-fractions-with-unlike-denominators",
            "subtracting-fractions-with-unlike-denominators",
            "adding-and-subtracting-fractions-with-unlike-denominators-word-problems",
          ],
        },
        {
          title: t("Adding and Subtracting Mixed Numbers", "带分数加减法"),
          topics: [
            "adding-mixed-numbers-with-unlike-denominators",
            "subtracting-mixed-numbers-with-unlike-denominators",
            "subtracting-mixed-numbers-with-unlike-denominators-using-improper-fractions",
            "adding-and-subtracting-mixed-numbers-with-unlike-denominators-word-problems",
          ],
        },
      ],
    },
    {
      title: t("Multiplying & Dividing Fractions", "分数乘除法"),
      modules: [
        {
          title: t("Multiplying Fractions", "分数乘法"),
          topics: [
            "multiplying-fractions-by-unit-fractions-using-models",
            "multiplying-fractions-using-models",
            "multiplying-fractions",
            "multiplying-fractions-word-problems",
            "multiplying-fractions-by-swapping-denominators",
            "multiplying-mixed-numbers-by-whole-numbers",
            "multiplying-mixed-numbers-by-fractions",
            "multiplying-mixed-numbers",
            "multiplying-mixed-numbers-word-problems",
            "connecting-fraction-multiplication-and-area",
            "finding-areas-using-fraction-multiplication",
            "fraction-multiplication-number-sense",
          ],
        },
        {
          title: t("Dividing Fractions", "分数除法"),
          topics: [
            "interpreting-fraction-division-using-area-models",
            "dividing-whole-numbers-by-unit-fractions-using-models",
            "dividing-whole-numbers-by-unit-fractions",
            "dividing-unit-fractions-by-whole-numbers-using-models",
            "dividing-unit-fractions-by-whole-numbers",
            "reciprocals",
            "dividing-whole-numbers-by-fractions-using-models-whole-number-results",
            "dividing-whole-numbers-by-fractions-using-models-fractional-results",
            "dividing-whole-numbers-by-fractions",
            "dividing-fractions-by-whole-numbers-using-models",
            "dividing-fractions-by-whole-numbers",
            "dividing-fractions-and-whole-numbers-word-problems",
            "dividing-fractions-using-models",
            "dividing-fractions",
          ],
        },
      ],
    },
    {
      title: t("Decimals", "小数"),
      modules: [
        {
          title: t("Decimals", "小数"),
          topics: [
            "the-place-value-system-with-decimals",
            "comparing-place-values-with-decimals",
            "reading-and-writing-decimals-written-in-words",
            "converting-decimals-from-standard-to-expanded-form",
            "converting-decimals-from-expanded-to-standard-form",
            "equivalent-decimals",
            "comparing-decimals",
            "rounding-down-decimals",
            "rounding-up-decimals",
            "significant-figures",
            "significant-figures-with-decimals",
          ],
        },
        {
          title: t("Adding and Subtracting Decimals", "小数加减法"),
          topics: [
            "estimating-decimal-addition-and-subtraction",
            "adding-decimals",
            "addition-with-unequal-numbers-of-decimals",
            "subtracting-decimals",
            "subtraction-with-unequal-numbers-of-decimals",
            "estimating-decimal-addition-with-benchmarks",
            "estimating-decimal-subtraction-with-benchmarks",
          ],
        },
      ],
    },
    {
      title: t("Multiplying & Dividing Decimals", "小数乘除法"),
      modules: [
        {
          title: t("Multiplying Decimals", "小数乘法"),
          topics: [
            "multiplying-decimals-by-powers-of-ten-using-place-value",
            "multiplying-decimals-by-powers-of-ten-using-decimal-point-placement",
            "estimating-decimal-multiplication",
            "multiplying-a-decimal-by-a-one-digit-whole-number",
            "multiplying-a-decimal-by-a-multi-digit-whole-number",
            "multiplying-two-digit-decimals",
            "multiplying-two-digit-decimals-by-three-digit-decimals",
            "multiplying-three-digit-decimals",
          ],
        },
        {
          title: t("Dividing Decimals", "小数除法"),
          topics: [
            "dividing-decimals-by-powers-of-ten-using-place-value",
            "dividing-decimals-by-powers-of-ten-using-decimal-point-placement",
            "estimating-decimal-division",
            "dividing-decimals-using-place-value-strategies",
            "division-of-whole-numbers-with-decimal-quotients",
            "division-of-whole-numbers-with-decimal-quotients-and-rounding",
            "dividing-decimals-using-the-standard-algorithm",
            "dividing-three-digit-decimals-by-two-digit-decimals",
            "dividing-four-digit-and-five-digit-decimals",
          ],
        },
      ],
    },
    {
      title: t("Exponents", "指数"),
      modules: [
        {
          title: t("Exponents", "指数"),
          topics: [
            "powers-of-ten",
            "multiplying-numbers-by-powers-of-ten-with-exponents",
            "multiplying-decimals-by-powers-of-ten-with-exponents",
            "introduction-to-exponents",
            "evaluating-exponents",
            "evaluating-larger-exponents",
            "evaluating-exponents-with-fractional-bases",
            "evaluating-exponents-with-decimal-bases",
            "comparing-exponents",
            "evaluating-whole-number-expressions-containing-exponents",
          ],
        },
      ],
    },
    {
      title: t("Measurement & Data", "测量与数据"),
      modules: [
        {
          title: t("Units and Data", "单位与数据"),
          topics: [
            "converting-metric-units-of-length-to-larger-units",
            "converting-customary-units-of-length-to-larger-units",
            "converting-units-of-volume-to-larger-units",
            "converting-units-of-mass-to-larger-units",
            "converting-units-of-time-to-larger-units",
            "operations-on-fractions-with-line-plots",
          ],
        },
        {
          title: t("Coordinates", "坐标"),
          topics: ["describing-the-coordinate-plane", "solving-real-world-problems-using-coordinates", "coordinate-planes-as-maps"],
        },
        {
          title: t("Patterns and Relationships", "规律与关系"),
          topics: ["connecting-patterns", "comparing-patterns", "graphing-patterns"],
        },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Volume", "体积"),
          topics: [
            "understanding-volume-using-unit-cubes",
            "units-of-area-and-volume",
            "volumes-of-right-rectangular-prisms",
            "volumes-of-right-rectangular-prisms-word-problems",
          ],
        },
        {
          title: t("2D Shapes", "平面图形"),
          topics: ["polygons", "quadrilaterals", "rectangles-rhombuses-and-squares", "perimeters-of-shapes", "classifying-quadrilaterals"],
        },
      ],
    },
  ],
};

/** numberTheory is the course on the integers: arithmetic functions, congruences, primitive roots, residues and Diophantine equations. */
export const numberTheory: CourseDef = {
  id: "number-theory",
  title: t("Number Theory", "数论"),
  description: t(
    "Divisors and primes, powers modulo n through the theorems of Fermat and Euler, primitive roots and discrete logarithms, quadratic residues and reciprocity, and classic equations in whole numbers.",
    "因数和质数，通过费马定理和欧拉定理研究模 n 的幂，原根和离散对数，二次剩余和互反律，以及经典的整数方程。",
  ),
  units: [
    {
      title: t("Divisors and Primes", "因数和质数"),
      modules: [
        {
          title: t("Foundations From Proof", "来自证明课的基础"),
          topics: [
            "the-division-algorithm",
            "the-euclidean-algorithm",
            "the-extended-euclidean-algorithm",
            "linear-diophantine-equations",
            "properties-of-prime-divisibility",
          ],
        },
        {
          title: t("Arithmetic Functions", "算术函数"),
          topics: ["counting-divisors", "the-sum-of-divisors-function", "perfect-numbers"],
        },
        {
          title: t("The Primes", "质数"),
          topics: ["the-sieve-of-eratosthenes", "the-distribution-of-primes"],
        },
      ],
    },
    {
      title: t("Congruences", "同余"),
      modules: [
        {
          title: t("Working Modulo n", "模 n 运算"),
          topics: [
            "modular-congruence",
            "the-multiplication-properties-of-modular-arithmetic",
            "multiplicative-inverses-modulo-n",
            "solving-linear-congruences",
            "the-chinese-remainder-theorem",
          ],
        },
        {
          title: t("Powers", "幂"),
          topics: [
            "powers-modulo-n",
            "fermats-little-theorem",
            "using-fermats-little-theorem",
            "eulers-totient-function",
            "computing-and-counting-with-the-totient",
            "eulers-theorem",
            "reducing-exponents-with-eulers-theorem",
            "wilsons-theorem",
            "multiplicative-functions",
            "the-mobius-function",
          ],
        },
        {
          title: t("Orders and Generators", "阶和生成元"),
          topics: ["the-order-of-an-integer-modulo-n", "primitive-roots", "discrete-logarithms"],
        },
      ],
    },
    {
      title: t("Quadratic Residues", "二次剩余"),
      modules: [
        {
          title: t("Squares Modulo a Prime", "模质数的平方数"),
          topics: ["quadratic-residues", "the-legendre-symbol", "eulers-criterion", "quadratic-reciprocity"],
        },
      ],
    },
    {
      title: t("Equations in Whole Numbers", "整数方程"),
      modules: [
        {
          title: t("Classic Equations", "经典方程"),
          topics: ["pythagorean-triples", "sums-of-two-squares", "continued-fractions", "pells-equation"],
        },
      ],
    },
  ],
};

/** realAnalysis is the course on the rigorous foundations of calculus: sequences, series, continuity, differentiation, integration and sequences of functions. */
export const realAnalysis: CourseDef = {
  id: "real-analysis",
  title: t("Real Analysis", "实分析"),
  description: t(
    "The rigorous foundations of calculus: completeness, sequences and series, limits and continuity through epsilons and deltas, compactness, the Riemann integral, and uniform convergence.",
    "微积分的严格基础：完备性，数列和级数，用 ε 和 δ 研究极限和连续，紧性，黎曼积分，以及一致收敛。",
  ),
  units: [
    {
      title: t("Sequences", "数列"),
      modules: [
        {
          title: t("Bounds and Limits", "界和极限"),
          topics: [
            "supremum-and-infimum",
            "suprema-of-sets-of-reals",
            "limits-of-sequences",
            "proving-the-finite-limit-of-a-sequence",
            "the-epsilon-definition-for-sequences",
          ],
        },
        {
          title: t("Convergence Without the Limit", "不用极限判断收敛"),
          topics: [
            "monotonic-sequences",
            "the-monotone-convergence-theorem",
            "subsequences-and-the-bolzano-weierstrass-theorem",
            "cauchy-sequences",
            "limit-superior-and-limit-inferior",
          ],
        },
      ],
    },
    {
      title: t("Series", "级数"),
      modules: [
        {
          title: t("Convergence of Series", "级数的收敛"),
          topics: ["harmonic-series-and-p-series", "absolute-and-conditional-convergence-of-series"],
        },
      ],
    },
    {
      title: t("Limits and Continuity", "极限和连续"),
      modules: [
        {
          title: t("Rigorous Limits", "严格的极限"),
          topics: ["defining-continuity-at-a-point", "epsilon-delta-proofs-of-limits", "the-sequential-criterion-for-continuity"],
        },
        {
          title: t("Topology of the Line", "直线的拓扑"),
          topics: ["distances-in-metric-spaces", "open-and-closed-sets-of-reals", "compactness-on-the-real-line", "uniform-continuity"],
        },
      ],
    },
    {
      title: t("Differentiation and Integration", "微分和积分"),
      modules: [
        {
          title: t("The Derivative", "导数"),
          topics: ["differentiability-in-analysis", "the-mean-value-theorem", "bounds-from-the-mean-value-theorem"],
        },
        {
          title: t("The Riemann Integral", "黎曼积分"),
          topics: [
            "defining-definite-integrals-using-left-and-right-riemann-sums",
            "upper-and-lower-darboux-sums",
            "riemann-integrability",
          ],
        },
      ],
    },
    {
      title: t("Sequences of Functions", "函数列"),
      modules: [
        {
          title: t("Uniform Convergence", "一致收敛"),
          topics: ["pointwise-and-uniform-convergence", "the-weierstrass-m-test", "the-contraction-mapping-principle"],
        },
      ],
    },
  ],
};

/** complexAnalysis is the course on analytic functions, contour integrals, series, residues and conformal maps. */
export const complexAnalysis: CourseDef = {
  id: "complex-analysis",
  title: t("Complex Analysis", "复分析"),
  description: t(
    "Calculus for functions of a complex variable: analytic functions and the Cauchy–Riemann equations, contour integrals and Cauchy's theorems, Taylor and Laurent series, residues, and conformal maps.",
    "复变函数的微积分：解析函数和柯西–黎曼方程，围道积分和柯西定理，泰勒级数和洛朗级数，留数，以及共形映射。",
  ),
  units: [
    {
      title: t("Analytic Functions", "解析函数"),
      modules: [
        {
          title: t("Complex Numbers Revisited", "复数回顾"),
          topics: ["the-complex-plane", "the-polar-form-of-a-complex-number", "eulers-formula", "higher-roots-of-complex-numbers"],
        },
        {
          title: t("Differentiation", "微分"),
          topics: [
            "functions-of-a-complex-variable",
            "limits-of-complex-functions",
            "the-complex-derivative",
            "the-cauchy-riemann-equations",
            "harmonic-functions-and-conjugates",
          ],
        },
        {
          title: t("Elementary Functions", "初等函数"),
          topics: ["the-complex-exponential-function", "the-complex-logarithm"],
        },
      ],
    },
    {
      title: t("Integration", "积分"),
      modules: [
        {
          title: t("Cauchy's Theorems", "柯西定理"),
          topics: ["contour-integrals", "cauchys-integral-theorem", "cauchys-integral-formula", "cauchys-estimates-and-liouvilles-theorem"],
        },
      ],
    },
    {
      title: t("Series and Residues", "级数和留数"),
      modules: [
        {
          title: t("Series", "级数"),
          topics: ["taylor-series-of-analytic-functions", "laurent-series", "classifying-isolated-singularities"],
        },
        {
          title: t("Residues", "留数"),
          topics: ["computing-residues", "the-residue-theorem"],
        },
      ],
    },
    {
      title: t("Geometry of Analytic Maps", "解析映射的几何"),
      modules: [
        {
          title: t("Conformal Maps", "共形映射"),
          topics: ["mobius-transformations", "conformal-maps"],
        },
      ],
    },
  ],
};

/** linearProgramming is the course on linear programs, the simplex method, duality and network problems. */
export const linearProgramming: CourseDef = {
  id: "linear-programming",
  title: t("Linear Programming", "线性规划"),
  description: t(
    "Optimization with linear constraints: formulating programs, the graphical and simplex methods, duality and sensitivity, transportation, assignment and flow problems, integer programs, and matrix games.",
    "线性约束下的优化：建立规划，图解法和单纯形法，对偶和灵敏度，运输、指派和流问题，整数规划，以及矩阵博弈。",
  ),
  units: [
    {
      title: t("Foundations", "基础"),
      modules: [
        {
          title: t("Linear Programs", "线性规划"),
          topics: [
            "formulating-linear-programs",
            "the-graphical-method-for-linear-programs",
            "standard-form-and-slack-variables",
            "basic-feasible-solutions",
          ],
        },
        {
          title: t("Geometry and Variations", "几何与变化形式"),
          topics: ["convex-sets-and-convex-combinations", "infeasible-programs-and-farkas-lemma", "minimization-and-surplus-variables"],
        },
      ],
    },
    {
      title: t("The Simplex Method", "单纯形法"),
      modules: [
        {
          title: t("Tableaus and Pivots", "单纯形表和主元运算"),
          topics: ["the-simplex-tableau", "pivoting-in-the-simplex-method", "the-two-phase-method", "unboundedness-and-degeneracy"],
        },
        {
          title: t("Refinements of the Method", "方法的改进"),
          topics: ["alternative-optimal-solutions", "the-big-m-method"],
        },
      ],
    },
    {
      title: t("Duality", "对偶"),
      modules: [
        {
          title: t("Duality and Sensitivity", "对偶和灵敏度"),
          topics: ["the-dual-of-a-linear-program", "weak-duality", "strong-duality-and-complementary-slackness", "sensitivity-analysis"],
        },
        {
          title: t("Working With the Inverse", "利用逆矩阵"),
          topics: ["reduced-costs", "the-revised-simplex-method", "the-dual-simplex-method", "right-hand-side-ranging"],
        },
      ],
    },
    {
      title: t("Applications", "应用"),
      modules: [
        {
          title: t("Network Problems", "网络问题"),
          topics: [
            "the-transportation-problem",
            "improving-a-transportation-plan",
            "the-assignment-problem",
            "maximum-flow-and-minimum-cut",
            "shortest-paths-as-linear-programs",
            "minimum-cost-flow",
          ],
        },
        {
          title: t("Beyond the Continuous Case", "连续情形之外"),
          topics: ["integer-programming", "gomory-cutting-planes", "matrix-games"],
        },
      ],
    },
  ],
};

/** partialDifferentialEquations is the course on the heat, wave and Laplace equations and how to solve them. */
export const partialDifferentialEquations: CourseDef = {
  id: "partial-differential-equations",
  title: t("Partial Differential Equations", "偏微分方程"),
  description: t(
    "Equations in several variables: classification, characteristics, separation of variables, the heat, wave and Laplace equations, Fourier series for initial data, and finite differences.",
    "多变量的方程：分类，特征线，分离变量，热方程、波动方程和拉普拉斯方程，初始数据的傅里叶级数，以及有限差分。",
  ),
  units: [
    {
      title: t("First Ideas", "初步概念"),
      modules: [
        {
          title: t("Equations and Their Types", "方程及其类型"),
          topics: ["introduction-to-partial-differential-equations", "classifying-second-order-equations"],
        },
        {
          title: t("First-Order Equations", "一阶方程"),
          topics: ["the-transport-equation", "the-method-of-characteristics"],
        },
        {
          title: t("Separation of Variables", "分离变量"),
          topics: ["separation-of-variables-for-pdes", "orthogonal-eigenfunctions-for-pdes", "matching-initial-data-with-fourier-series"],
        },
      ],
    },
    {
      title: t("The Heat Equation", "热方程"),
      modules: [
        {
          title: t("Diffusion", "扩散"),
          topics: [
            "the-heat-equation",
            "solving-the-heat-equation-on-an-interval",
            "the-heat-equation-with-insulated-ends",
            "nonhomogeneous-heat-problems",
            "finite-differences-for-the-heat-equation",
          ],
        },
      ],
    },
    {
      title: t("The Wave Equation", "波动方程"),
      modules: [
        {
          title: t("Waves", "波"),
          topics: ["the-wave-equation", "dalemberts-formula", "the-wave-equation-on-a-finite-string"],
        },
      ],
    },
    {
      title: t("Laplace's Equation", "拉普拉斯方程"),
      modules: [
        {
          title: t("Equilibrium", "平衡"),
          topics: ["laplaces-equation", "laplaces-equation-in-a-rectangle-and-a-disc"],
        },
      ],
    },
  ],
};

/** mathCourses are the courses of the mathematics subject. */
export const mathCourses: readonly CourseDef[] = [
  algebraFoundations,
  prealgebra,
  algebraI,
  geometry,
  algebraII,
  precalculus,
  calculusI,
  linearAlgebra,
  calculusII,
  multivariableCalculus,
  differentialEquations,
  apCalculusAB,
  apCalculusBC,
  methodsOfProof,
  discreteMathematics,
  abstractAlgebra,
  numberTheory,
  realAnalysis,
  complexAnalysis,
  linearProgramming,
  partialDifferentialEquations,
  integratedMathI,
  integratedMathII,
  integratedMathIII,
  integratedMathIHonors,
  integratedMathIIHonors,
  integratedMathIIIHonors,
  mathematicalFoundationsI,
  mathematicalFoundationsII,
  mathematicalFoundationsIII,
  probabilityAndStatistics,
  mathematicsForMachineLearning,
  mathematicalMethodsForThePhysicalSciencesI,
  mathematicalMethodsForThePhysicalSciencesII,
  firstGradeMath,
  secondGradeMath,
  thirdGradeMath,
  fourthGradeMath,
  fifthGradeMath,
  sixthGradeMath,
  seventhGradeMath,
  eighthGradeMath,
  satMathFundamentals,
  satMathPrep,
  actMathFundamentals,
  actMathPrep,
];
