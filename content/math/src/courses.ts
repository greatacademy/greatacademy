import type { CourseDef, UnitDef } from "@ga/content";
import { t } from "@ga/content";

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

const [integers, expressions, equations, inequalities] = algebraFoundations.units as [UnitDef, UnitDef, UnitDef, UnitDef];

/**
 * prealgebra is the bridge from arithmetic to Algebra I: number theory,
 * fractions, decimals and percents, then the units of Foundations of Algebra
 * extended to rational numbers, exponents and radicals, ratios and
 * proportions, statistics with dot plots and box plots, and geometry.
 */
export const prealgebra: CourseDef = {
  id: "prealgebra",
  title: t("Prealgebra", "代数预备"),
  description: t(
    "Divisibility, primes and common factors; fractions, decimals and percents; negative and rational numbers; algebraic expressions; exponents, scientific notation and square roots; linear equations and inequalities; ratios, rates and proportions; summarizing data; and angles, triangles and polygons, perimeter and area.",
    "整除、质数与公因数；分数、小数与百分数；负数与有理数；代数式；指数、科学记数法与平方根；一元一次方程与不等式；比、率与比例；数据的概括；角、三角形与多边形，周长与面积。",
  ),
  units: [
    {
      title: t("Number Theory", "数论初步"),
      modules: [
        {
          title: t("Divisibility and Primes", "整除与质数"),
          topics: ["divisibility-rules", "prime-and-composite-numbers", "prime-factorization"],
        },
        { title: t("Common Factors and Multiples", "公因数与公倍数"), topics: ["greatest-common-factor", "least-common-multiple"] },
      ],
    },
    {
      title: t("Fractions", "分数"),
      modules: [
        { title: t("Equivalent Fractions", "等值分数"), topics: ["equivalent-fractions"] },
        { title: t("Adding and Subtracting", "加法与减法"), topics: ["adding-and-subtracting-fractions", "mixed-numbers"] },
        { title: t("Multiplying and Dividing", "乘法与除法"), topics: ["multiplying-fractions", "dividing-fractions"] },
      ],
    },
    {
      title: t("Decimals and Percents", "小数与百分数"),
      modules: [
        { title: t("Decimals", "小数"), topics: ["fractions-and-decimals", "decimal-arithmetic"] },
        { title: t("Percents", "百分数"), topics: ["percents", "percent-of-a-number", "percent-change"] },
      ],
    },
    {
      title: t("Integers and Rational Numbers", "整数与有理数"),
      modules: [...integers.modules, { title: t("Rational Numbers", "有理数"), topics: ["operations-with-rational-numbers"] }],
    },
    expressions,
    {
      title: t("Exponents and Radicals", "指数与根式"),
      modules: [
        { title: t("Exponents", "指数"), topics: ["powers-of-rational-numbers", "zero-and-negative-exponents"] },
        { title: t("The Rules of Exponents", "指数法则"), topics: ["product-and-quotient-rules", "power-rules"] },
        { title: t("Scientific Notation", "科学记数法"), topics: ["scientific-notation", "operations-in-scientific-notation"] },
        {
          title: t("Radicals", "根式"),
          topics: [
            "square-roots-and-cube-roots",
            "simplifying-square-roots",
            "adding-and-subtracting-radicals",
            "rationalizing-denominators",
          ],
        },
      ],
    },
    { title: t("Equations and Inequalities", "方程与不等式"), modules: [...equations.modules, ...inequalities.modules] },
    {
      title: t("Ratios and Proportions", "比与比例"),
      modules: [{ title: t("Ratios and Rates", "比与率"), topics: ["ratios", "unit-rates", "proportions"] }],
    },
    {
      title: t("Statistics", "统计"),
      modules: [
        {
          title: t("Summarizing Data", "数据的概括"),
          topics: [
            "mean-of-a-data-set",
            "median-and-mode",
            "range-and-interquartile-range",
            "mean-absolute-deviation",
            "comparing-data-sets",
            "outliers",
          ],
        },
        { title: t("Data Displays", "数据的图示"), topics: ["dot-plots", "box-plots"] },
      ],
    },
    {
      title: t("Geometry", "几何"),
      modules: [
        {
          title: t("Angles", "角"),
          topics: [
            "angles-and-angle-measures",
            "complementary-and-supplementary-angles",
            "vertical-angles",
            "parallel-lines-and-transversals",
          ],
        },
        {
          title: t("Triangles and Polygons", "三角形与多边形"),
          topics: [
            "classifying-triangles",
            "angles-of-a-triangle",
            "exterior-angles-of-triangles",
            "isosceles-triangles",
            "angles-of-polygons",
          ],
        },
        {
          title: t("Perimeter and Area", "周长与面积"),
          topics: [
            "perimeter",
            "area-of-rectangles-and-squares",
            "area-of-parallelograms",
            "area-of-triangles",
            "area-of-trapezoids",
            "composite-shapes",
          ],
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
    "Linear equations with parameters, formulas and word problems; compound inequalities and interval notation; equations solved with roots; the coordinate plane, equations of lines, linear models and their graphs, systems of linear equations and linear inequalities in two variables; units and variation; polynomials, their products and factoring; quadratic equations; radical expressions and equations; rational expressions and equations; functions, their features and their composition; absolute value equations, inequalities and graphs; arithmetic and geometric sequences; and scatter plots, trend lines and correlation.",
    "含参数的一次方程、公式变形与应用题；复合不等式与区间记号；用开方解方程；坐标平面、直线方程、一次模型及其图像、二元一次方程组与二元一次不等式；单位与比例关系；多项式的乘法与因式分解；一元二次方程；根式及根式方程；分式及分式方程；函数及其性质、运算与复合；绝对值方程、不等式与图像；等差数列与等比数列；散点图、趋势线与相关性。",
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
            "units-of-time",
            "mixed-units",
            "converting-units-of-area",
          ],
        },
        {
          title: t("Working With Units", "单位的运用"),
          topics: ["units-in-formulas", "units-of-rates-of-change", "degrees-of-accuracy"],
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

/** mathCourses are the courses of the mathematics subject. */
export const mathCourses: readonly CourseDef[] = [algebraFoundations, prealgebra, algebraI];
