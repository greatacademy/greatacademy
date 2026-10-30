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
          topics: ["solving-systems-of-nonlinear-equations", "finding-intersections-of-lines-and-quadratic-functions"],
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

/** mathCourses are the courses of the mathematics subject. */
export const mathCourses: readonly CourseDef[] = [algebraFoundations, prealgebra, algebraI, geometry];
