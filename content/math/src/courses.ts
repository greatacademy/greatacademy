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
 * proportions, and statistics with dot plots and box plots.
 */
export const prealgebra: CourseDef = {
  id: "prealgebra",
  title: t("Prealgebra", "代数预备"),
  description: t(
    "Divisibility, primes and common factors; fractions, decimals and percents; negative and rational numbers; algebraic expressions; exponents, scientific notation and square roots; linear equations and inequalities; ratios, rates and proportions; and summarizing data.",
    "整除、质数与公因数；分数、小数与百分数；负数与有理数；代数式；指数、科学记数法与平方根；一元一次方程与不等式；比、率与比例；数据的概括。",
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
      ],
    },
  ],
};

/** mathCourses are the courses of the mathematics subject. */
export const mathCourses: readonly CourseDef[] = [algebraFoundations, prealgebra];
