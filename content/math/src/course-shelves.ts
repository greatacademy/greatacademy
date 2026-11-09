import type { CourseDef, Text } from "@ga/content";
import { t } from "@ga/content";

/** shelves group the courses by who they are for, from the youngest learner to the most advanced. */
const shelves: readonly { readonly title: Text; readonly courses: readonly string[] }[] = [
  {
    title: t("Grades 1–5", "小学"),
    courses: ["1st-grade-math", "2nd-grade-math", "3rd-grade-math", "4th-grade-math", "5th-grade-math"],
  },
  {
    title: t("Grades 6–8", "初中"),
    courses: ["6th-grade-math", "7th-grade-math", "8th-grade-math", "algebra-foundations", "prealgebra"],
  },
  {
    title: t("High school", "高中"),
    courses: [
      "algebra-i",
      "geometry",
      "algebra-ii",
      "precalculus",
      "integrated-math-i",
      "integrated-math-ii",
      "integrated-math-iii",
      "integrated-math-i-honors",
      "integrated-math-ii-honors",
      "integrated-math-iii-honors",
    ],
  },
  {
    title: t("Exam preparation", "备考"),
    courses: ["sat-math-fundamentals", "sat-math-prep", "act-math-fundamentals", "act-math-prep", "ap-calculus-ab", "ap-calculus-bc"],
  },
  {
    title: t("Refreshers for adults", "成人重学"),
    courses: ["mathematical-foundations-i", "mathematical-foundations-ii", "mathematical-foundations-iii"],
  },
  {
    title: t("University", "大学"),
    courses: [
      "calculus-i",
      "calculus-ii",
      "multivariable-calculus",
      "linear-algebra",
      "differential-equations",
      "methods-of-proof",
      "discrete-mathematics",
      "probability-and-statistics",
      "mathematics-for-machine-learning",
      "abstract-algebra",
      "number-theory",
      "real-analysis",
      "complex-analysis",
      "linear-programming",
      "partial-differential-equations",
      "mathematical-methods-for-the-physical-sciences-i",
      "mathematical-methods-for-the-physical-sciences-ii",
    ],
  },
];

/**
 * buildsOn names, for each course, the courses it follows on from, nearest
 * first ([Content §6](../../../docs/content.md#6-courses)). Alternatives such
 * as the traditional and the integrated sequence are listed side by side.
 */
const buildsOn: Readonly<Record<string, readonly string[]>> = {
  "2nd-grade-math": ["1st-grade-math"],
  "3rd-grade-math": ["2nd-grade-math"],
  "4th-grade-math": ["3rd-grade-math"],
  "5th-grade-math": ["4th-grade-math"],
  "6th-grade-math": ["5th-grade-math"],
  "7th-grade-math": ["6th-grade-math"],
  "8th-grade-math": ["7th-grade-math"],
  "algebra-foundations": ["6th-grade-math"],
  prealgebra: ["5th-grade-math"],
  "algebra-i": ["prealgebra", "8th-grade-math"],
  geometry: ["algebra-i"],
  "algebra-ii": ["geometry", "algebra-i"],
  precalculus: ["algebra-ii", "integrated-math-iii", "integrated-math-iii-honors"],
  "integrated-math-i": ["prealgebra", "8th-grade-math"],
  "integrated-math-ii": ["integrated-math-i"],
  "integrated-math-iii": ["integrated-math-ii"],
  "integrated-math-i-honors": ["prealgebra", "8th-grade-math"],
  "integrated-math-ii-honors": ["integrated-math-i-honors"],
  "integrated-math-iii-honors": ["integrated-math-ii-honors"],
  "sat-math-fundamentals": ["algebra-i", "integrated-math-i"],
  "sat-math-prep": ["sat-math-fundamentals", "algebra-ii"],
  "act-math-fundamentals": ["algebra-i", "integrated-math-i"],
  "act-math-prep": ["act-math-fundamentals", "algebra-ii"],
  "ap-calculus-ab": ["precalculus"],
  "ap-calculus-bc": ["precalculus"],
  "mathematical-foundations-ii": ["mathematical-foundations-i"],
  "mathematical-foundations-iii": ["mathematical-foundations-ii"],
  "calculus-i": ["precalculus", "mathematical-foundations-ii"],
  "calculus-ii": ["calculus-i", "ap-calculus-ab"],
  "multivariable-calculus": ["calculus-ii", "ap-calculus-bc", "mathematical-foundations-iii"],
  "linear-algebra": ["precalculus", "mathematical-foundations-iii"],
  "differential-equations": ["calculus-ii", "ap-calculus-bc"],
  "methods-of-proof": ["precalculus", "mathematical-foundations-iii"],
  "discrete-mathematics": ["methods-of-proof"],
  "probability-and-statistics": ["calculus-ii", "ap-calculus-bc", "mathematical-foundations-iii"],
  "mathematics-for-machine-learning": ["linear-algebra", "multivariable-calculus"],
  "abstract-algebra": ["methods-of-proof", "linear-algebra"],
  "number-theory": ["methods-of-proof"],
  "real-analysis": ["methods-of-proof", "calculus-ii"],
  "complex-analysis": ["real-analysis", "multivariable-calculus"],
  "linear-programming": ["linear-algebra"],
  "partial-differential-equations": ["differential-equations", "multivariable-calculus"],
  "mathematical-methods-for-the-physical-sciences-i": ["calculus-ii", "ap-calculus-bc"],
  "mathematical-methods-for-the-physical-sciences-ii": ["mathematical-methods-for-the-physical-sciences-i"],
};

/**
 * onShelves puts each course on its shelf, with the courses it builds on, and
 * lists them in the order of the shelves; a course on no shelf is an error.
 */
export function onShelves(courses: readonly CourseDef[]): readonly CourseDef[] {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const listed = shelves.flatMap((shelf) =>
    shelf.courses.map((id): CourseDef => {
      const course = byId.get(id);
      if (!course) throw new Error(`course shelf lists unknown course ${id}`);
      const before = buildsOn[id];
      return { ...course, group: shelf.title, ...(before && { buildsOn: before }) };
    }),
  );
  const missing = courses.filter((c) => !shelves.some((shelf) => shelf.courses.includes(c.id))).map((c) => c.id);
  if (missing.length > 0) throw new Error(`courses on no shelf: ${missing.join(", ")}`);
  return listed;
}
