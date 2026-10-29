import type { CourseDef } from "@ga/content";
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

/** mathCourses are the courses of the mathematics subject. */
export const mathCourses: readonly CourseDef[] = [algebraFoundations];
