import { t } from "@ga/content";

import type { ExamSpec } from "../exam.ts";
import { actOwnAlgebra1 } from "./act-exam-own-1.ts";
import { actOwnAlgebra2 } from "./act-exam-own-2.ts";
import { actOwnGeometry } from "./act-exam-own-3.ts";
import { actOwnData } from "./act-exam-own-4.ts";
import { satExamAdvanced1 } from "./sat-exam-advanced-1.ts";
import { satExamAdvanced2 } from "./sat-exam-advanced-2.ts";
import { satExamAdvanced3 } from "./sat-exam-advanced-3.ts";
import { satExamAlgebra1 } from "./sat-exam-algebra-1.ts";
import { satExamAlgebra2 } from "./sat-exam-algebra-2.ts";
import { satExamAlgebra3 } from "./sat-exam-algebra-3.ts";
import { satExamAlgebra4 } from "./sat-exam-algebra-4.ts";
import { satExamData1 } from "./sat-exam-data-1.ts";
import { satExamData2 } from "./sat-exam-data-2.ts";
import { satExamGeometry1 } from "./sat-exam-geometry-1.ts";
import { satExamGeometry2 } from "./sat-exam-geometry-2.ts";

// ACT Math Prep topics on the same mathematics as an SAT Math Prep topic.

const sat = new Map(
  [
    satExamAdvanced1,
    satExamAdvanced2,
    satExamAdvanced3,
    satExamAlgebra1,
    satExamAlgebra2,
    satExamAlgebra3,
    satExamAlgebra4,
    satExamData1,
    satExamData2,
    satExamGeometry1,
    satExamGeometry2,
  ]
    .flat()
    .map((spec) => [spec.title.en, spec]),
);

const shared: readonly (readonly [string, string, string])[] = [
  ["Combining Like Terms", "合并同类项", "Adding Polynomials"],
  ["Distributing Over Binomials", "对二项式使用分配律", "Adding Polynomials Using the Distributive Law"],
  ["Expanding Products of Binomials", "展开二项式之积", "Multiplying Binomials"],
  ["Factoring Algebraic Expressions", "代数式因式分解", "Factoring Polynomials Using the GCF"],
  ["Simplifying by Canceling Factors", "约去因式化简", "Simplifying Rational Expressions by Factoring"],
  ["Evaluating Algebraic Expressions", "代数式求值", "Evaluating Expressions"],
  ["Solving Linear Equations", "解一次方程", "Solving Multistep Linear Equations"],
  ["Solving Linear Equations With Parentheses", "解含括号的一次方程", "Solving Linear Equations Containing Binomials"],
  ["Solving Literal Equations", "解字母方程", "Solving Multivariable Equations"],
  ["Identifying Characteristics of Linear Equations", "判断一次方程的特征", "Determining the Number of Solutions to a Linear Equation"],
  ["Writing Linear Inequalities", "列一次不等式", "Constructing Models With One-Variable Linear Inequalities"],
  ["Finding a Threshold From a Linear Inequality", "由一次不等式求临界值", "Modeling and Solving With One-Variable Linear Inequalities"],
  ["Graphing Linear Inequalities", "一次不等式的图像", "Solutions of Two-Variable Linear Inequalities"],
  ["Using Systems of Linear Inequalities", "运用一次不等式组", "Systems of Two-Variable Inequalities"],
  ["Solving Linear Systems", "解一次方程组", "Solving Simple Systems of Linear Equations"],
  ["Solving Systems by Elimination", "用消元法解方程组", "Solving Systems of Equations Using Elimination"],
  ["Determining How Many Solutions a System Has", "判断方程组解的个数", "Determining the Number of Solutions to a Linear System"],
  ["Modeling Word Problems With Systems", "用方程组建模应用题", "Modeling Word Problems With Systems of Linear Equations"],
  ["Using a System Solution", "运用方程组的解", "Identifying Structure in Systems of Linear Equations"],
  ["Factoring Quadratic Expressions", "二次式因式分解", "Factoring Trinomials"],
  ["Using Factors of a Quadratic", "运用二次式的因式", "Solving Quadratic Equations Using the Zero-Product Rule"],
  ["Solving Perfect Square Equations", "解完全平方方程", "Perfect Square Quadratic Equations"],
  ["Solving Quadratic Equations by Factoring", "用因式分解解二次方程", "Solving Quadratic Equations by Factoring"],
  ["Applying the Quadratic Formula", "应用求根公式", "Solving Quadratic Equations Using the Quadratic Formula"],
  ["Using the Discriminant", "运用判别式", "Counting Solutions to Quadratic Equations"],
  ["Applying Vieta's Formulas", "应用韦达定理", "Applying Vieta's Formulas"],
  ["Modeling With Quadratic Equations", "用二次方程建模", "Modeling Number Problems With Quadratic Equations"],
  ["Factoring Polynomials", "多项式因式分解", "Factoring Higher-Order Polynomials"],
  ["Simplifying Rational Expressions", "化简有理式", "Simplifying Rational Expressions Using Polynomial Factorization"],
  ["Combining Rational Expressions", "合并有理式", "Adding Rational Expressions"],
  ["Solving Rational Equations", "解有理方程", "Rational Equations"],
  ["Solving Square-Root Equations", "解平方根方程", "Radical Equations"],
  ["Solving Absolute Value Equations", "解绝对值方程", "Absolute Value Equations"],
  ["Writing Rate and Earnings Models", "列速率和收入模型", "Constructing Models With Two-Variable Linear Equations"],
  ["Expressing Related Quantities", "表示相关的量", "Constructing Models With One-Variable Linear Equations"],
  ["Using a Given Algebraic Model", "运用给定的代数模型", "Solving Two-Variable Linear Models"],
  ["Modeling Perimeter Problems", "周长问题建模", "Modeling Geometry Problems Using Linear Equations"],
  ["Modeling Cost Problems", "费用问题建模", "Modeling Totals Using Two-Variable Linear Equations"],
  ["Modeling Related-Quantity Problems", "相关量问题建模", "Modeling and Solving Problems Using Linear Equations"],
  ["Writing Linear Models From Data", "由数据列线性模型", "Constructing Models Using Linear Functions"],
  ["Evaluating a Function", "函数求值", "Evaluating Linear Functions"],
  ["Evaluating Function Compositions", "复合函数求值", "Working With Function Composition"],
  ["Writing Function Rules From Data", "由数据写函数规则", "Identifying Linear Functions Corresponding to Tables"],
  ["Matching Functions to Representations", "匹配函数与其表示", "Identifying Tables Corresponding to Linear Functions"],
  ["Determining Rates of Change", "确定变化率", "Average Rate of Change From Data Plots"],
  ["Finding Extreme Values of Quadratics", "求二次函数的最值", "Finding Extreme Values of Quadratic Functions in Vertex Form"],
  ["Locating Points on a Parabola", "确定抛物线上的点", "Using Symmetry to Reason About Quadratic Functions"],
  ["Transforming Quadratic Functions", "变换二次函数", "Polynomial Transformations"],
  ["Evaluating Exponential Functions", "指数函数求值", "Exponential Functions"],
  ["Constructing Exponential Models", "构造指数模型", "Constructing Exponential Growth Models"],
  ["Identifying Features of Exponential Functions", "判断指数函数的特征", "Maxima and Minima of Exponential Functions"],
  ["Finding Points and Zeros of a Function", "求函数的点和零点", "Identifying Intercepts of Functions From Graphs"],
  ["Finding Angles Formed by Intersecting Lines", "求相交直线形成的角", "Vertical Angles"],
  ["Finding Angles With Parallel Lines", "求平行线中的角", "Corresponding Angles"],
  ["Problem-Solving With Parallel Lines", "平行线问题", "Problem-Solving With Corresponding Angles"],
  ["Finding Interior Angles of Triangles", "求三角形的内角", "Interior Angles of Triangles"],
  ["Finding Exterior Angles of Triangles", "求三角形的外角", "Exterior Angles of Triangles"],
  ["Finding Angles in Isosceles Triangles", "求等腰三角形的角", "Interior Angles of Special Triangles"],
  ["Problem-Solving With Isosceles Triangles", "等腰三角形问题", "Solving Problems With Multiple Triangles"],
  ["Identifying Corresponding Parts Under Congruence", "确定全等的对应部分", "Congruent Triangles"],
  ["Using Corresponding Parts Under Similarity", "运用相似的对应部分", "Finding Corresponding Angles in Similar Shapes"],
  ["Finding Corresponding Lengths in Similar Figures", "求相似图形的对应长度", "Finding Corresponding Lengths in Similar Shapes"],
  ["Using Scale Factors in Similar Figures", "运用相似图形的比例因子", "Solving Problems With Similar Triangles"],
  ["Finding Areas of Similar Figures", "求相似图形的面积", "Relating Length and Area in Similar Shapes"],
  ["Applying the Pythagorean Theorem", "应用勾股定理", "The Pythagorean Theorem"],
  ["Modeling Situations Using the Pythagorean Theorem", "用勾股定理建模", "Modeling Situations Using the Pythagorean Theorem"],
  ["Problem-Solving With Special Triangles", "特殊三角形问题", "Problem-Solving With Special Triangles"],
  ["Finding Trigonometric Ratios", "求三角比", "Trigonometric Ratios in Right Triangles"],
  ["Finding a Trigonometric Ratio From Other Ratios", "由其他比求三角比", "Calculating Trigonometric Ratios Using the Pythagorean Theorem"],
  ["Using Cofunction Relationships", "运用余函数关系", "Cofunction Relationships and Identities"],
  ["Finding a Side From a Trigonometric Ratio", "由三角比求边", "Calculating Lengths and Areas Using Trigonometry"],
  ["Finding Perimeters of Figures", "求图形的周长", "Perimeters of Squares, Rectangles, and Triangles"],
  ["Finding Areas Involving Circles", "求与圆有关的面积", "Areas and Circumferences of Circles"],
  ["Finding Arc Length", "求弧长", "Arc Lengths of Sectors"],
  ["Writing the Equation of a Circle", "写圆的方程", "The Canonical Equation of a Circle"],
  ["Problem-Solving With Circles", "圆的问题", "Solving Problems Involving the Canonical Equation of a Circle"],
  ["Further Problem-Solving With Circles", "圆的进阶问题", "General Equations of Circles in the Coordinate Plane"],
  ["Using Slopes of Parallel Lines", "运用平行线的斜率", "Parallel Lines"],
  ["Using Slopes of Perpendicular Lines", "运用垂直线的斜率", "Slopes of Perpendicular Lines"],
  ["Writing the Equation of a Line", "写直线方程", "Finding Equations of Lines Using Slopes and Points"],
  ["Interpreting Slope and Its Changes", "解释斜率及其变化", "Interpreting Coefficients of Linear Functions in Context"],
  ["Finding Area in the Coordinate Plane", "求坐标平面内的面积", "Calculating Areas in the Coordinate Plane"],
  ["Finding Volumes of Prisms and Cylinders", "求棱柱和圆柱的体积", "Volumes of Cylinders"],
  ["Finding Volumes of Pyramids, Cones, and Spheres", "求棱锥、圆锥和球的体积", "Volumes of Cones"],
  ["Finding the Surface Area of a Solid", "求立体的表面积", "Surface Areas of Right Rectangular Prisms"],
  ["Applying Volume Scale Factors", "应用体积比例因子", "Length, Surface Area, and Volume in Similar Solids"],
  ["Comparing Measures of Center", "比较中心度量", "Comparing Measures of Center"],
  ["Determining Effects of Changing Data", "确定数据变化的影响", "Comparing Statistical Effects of Data Change"],
  ["Finding How a Data Change Affects a Mean", "求数据变化对平均数的影响", "Effects of Additional Data on Centrality Measures"],
  ["Using Means and Sums", "运用平均数和总和", "The Relationship Between Means and Sums"],
  ["Finding Unknown Values From Center Measures", "由中心度量求未知值", "Finding Unknown Observations From Centrality Measures"],
  ["Comparing Measures of Spread", "比较离散度量", "Comparing Data Sets"],
  ["Finding a Median From Frequencies", "由频数求中位数", "Measuring Centrality From Frequency Tables"],
  ["Reading Frequency Distributions", "读频数分布", "Frequency Tables"],
  ["Reading Category Tables", "读分类表", "Tabular Datasets"],
  ["Reading Trend Graphs", "读趋势图", "Interpreting Time-Series Graphs"],
  ["Reasoning About Data Displays", "分析数据图表", "Box Plots"],
  ["Finding a Simple Probability", "求简单概率", "Simple Probabilities in Real-World Contexts"],
  ["Finding a Probability From a Two-Way Table", "由双向表求概率", "Simple Probabilities From Two-Way Frequency Tables"],
  ["Finding a Conditional Probability From a Table", "由表格求条件概率", "Conditional Probabilities From Two-Way Frequency Tables"],
  ["Finding a Conditional Probability", "求条件概率", "Calculating Conditional Probabilities"],
  ["Estimating a Population From a Sample Proportion", "由样本比例估计总体", "Estimation From Proportions and Samples"],
  ["Judging Evidence From a Sample", "判断样本证据", "Sampling Bias and Validity"],
  ["Identifying a Model Type", "判断模型类型", "Linear vs. Exponential Models"],
  ["Fitting a Linear Model to Data", "用线性模型拟合数据", "Identifying Best-Fit Lines"],
  ["Using a Linear Model", "运用线性模型", "Making Predictions Using Best-Fit Lines"],
  ["Partitioning a Total in a Given Ratio", "按给定比分配总量", "Applying Ratios"],
  ["Composing Chained Ratios", "合并连比", "Working With Ratios in Various Settings"],
  ["Applying Proportions", "应用比例", "Solving Equations Describing Proportional Relationships"],
  ["Finding a Unit Rate", "求单位速率", "Rate Problems"],
  ["Finding Distance at Constant Speed", "求匀速行驶的路程", "Speed Problems"],
  ["Finding a Percent of a Number", "求一个数的百分比", "Finding Parts of Numbers From Percentages"],
  ["Expressing a Ratio as a Percent", "把比表示为百分比", "Expressing Ratios of Numbers as Percentages"],
  ["Finding a Total From a Percent", "由百分比求总数", "Finding Totals From Percentages"],
  ["Applying a Percent Change", "应用百分比变化", "Applying Percentage Change"],
  ["Taking Successive Percents", "连续取百分比", "Applying Percentages in Succession"],
  ["Applying Successive Percent Changes", "应用连续百分比变化", "Applying Successive Percentage Changes"],
  ["Computing With Mixed Units", "混合单位计算", "Unit Conversions Between Mixed Units"],
  ["Converting a Measurement", "换算度量", "Unit Conversions to Smaller Units of Length"],
  ["Applying Conversion Factors", "应用转换系数", "Two-Step Unit Conversions"],
  ["Finding a Mean", "求平均数", "The Mean of a Dataset"],
  ["Finding a Median", "求中位数", "The Median of a Dataset"],
  ["Finding the Area of a Rectangle", "求长方形的面积", "Areas of Rectangles and Squares"],
  ["Finding the Volume of a Rectangular Prism", "求长方体的体积", "Volumes of Right Rectangular Prisms"],
];

const own: Record<string, ExamSpec["make"]> = { ...actOwnAlgebra1, ...actOwnAlgebra2, ...actOwnGeometry, ...actOwnData };

/** actExamShared are the ACT Math Prep topics on the same mathematics as an SAT Math Prep topic: they share its prerequisites and tips and ask questions of their own. */
export const actExamShared: ExamSpec[] = shared.map(([en, zh, from]) => {
  const spec = sat.get(from);
  if (!spec) throw new Error(`no SAT spec titled ${from}`);
  const make = own[en];
  if (!make) throw new Error(`no ACT question generator titled ${en}`);
  return { ...spec, title: t(en, zh), make };
});
