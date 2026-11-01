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
  apCalculusAB,
  apCalculusBC,
];
