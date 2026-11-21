import type { CourseDef, SequenceDef, Text } from "@ga/content";
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
 * Where Math Academy offers the course, these are its prerequisites.
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
  "algebra-i": ["prealgebra", "8th-grade-math", "algebra-foundations"],
  geometry: ["algebra-i"],
  "algebra-ii": ["geometry"],
  precalculus: ["algebra-ii", "integrated-math-iii"],
  "integrated-math-i": ["prealgebra", "8th-grade-math"],
  "integrated-math-ii": ["integrated-math-i"],
  "integrated-math-iii": ["integrated-math-ii"],
  "integrated-math-i-honors": ["prealgebra", "8th-grade-math"],
  "integrated-math-ii-honors": ["integrated-math-i-honors"],
  "integrated-math-iii-honors": ["integrated-math-ii-honors"],
  "sat-math-fundamentals": ["algebra-ii", "integrated-math-ii", "integrated-math-ii-honors"],
  "sat-math-prep": ["sat-math-fundamentals"],
  "act-math-fundamentals": ["precalculus", "integrated-math-iii-honors"],
  "act-math-prep": ["act-math-fundamentals"],
  "ap-calculus-ab": ["precalculus", "integrated-math-iii-honors"],
  "ap-calculus-bc": ["precalculus", "integrated-math-iii-honors"],
  "mathematical-foundations-ii": ["mathematical-foundations-i"],
  "mathematical-foundations-iii": ["mathematical-foundations-ii"],
  "calculus-i": ["precalculus", "integrated-math-iii-honors"],
  "calculus-ii": ["calculus-i", "ap-calculus-ab"],
  "linear-algebra": ["calculus-i", "ap-calculus-bc", "mathematical-foundations-iii"],
  "multivariable-calculus": ["linear-algebra"],
  "methods-of-proof": ["calculus-i", "ap-calculus-bc", "mathematical-foundations-iii"],
  "differential-equations": ["multivariable-calculus"],
  "discrete-mathematics": ["methods-of-proof"],
  "probability-and-statistics": ["multivariable-calculus"],
  "mathematics-for-machine-learning": ["calculus-ii", "ap-calculus-bc", "mathematical-foundations-iii"],
  "mathematical-methods-for-the-physical-sciences-i": ["calculus-ii", "ap-calculus-bc", "mathematical-foundations-iii"],
  "mathematical-methods-for-the-physical-sciences-ii": ["mathematical-methods-for-the-physical-sciences-i"],
  "abstract-algebra": ["methods-of-proof", "linear-algebra"],
  "number-theory": ["methods-of-proof"],
  "real-analysis": ["methods-of-proof", "calculus-ii"],
  "complex-analysis": ["real-analysis", "multivariable-calculus"],
  "linear-programming": ["linear-algebra"],
  "partial-differential-equations": ["differential-equations", "multivariable-calculus"],
};

/** university continues every route that reaches calculus, as Math Academy's do. */
const university = ["linear-algebra", "multivariable-calculus", "differential-equations"];

/** HONORS_STANDING is the share of recent answers right that the honors sequence asks of a learner. */
const HONORS_STANDING = 0.8;

/**
 * mathSequences are the routes through the courses
 * ([Content §6](../../../docs/content.md#6-courses)): the three high-school
 * sequences, each from the first grade, the traditional one first and the
 * honors one only for a learner doing well, the grade-by-grade middle school,
 * the foundations for adults and the two exams. A learner follows the one
 * their courses and their answers point to and moves on along it on finishing
 * a course.
 */
export const mathSequences: readonly SequenceDef[] = [
  {
    id: "traditional",
    title: t("Traditional Math", "传统数学"),
    courses: [...grades(1, 5), "prealgebra", "algebra-i", "geometry", "algebra-ii", "precalculus", "ap-calculus-bc", ...university],
  },
  {
    id: "integrated",
    title: t("Integrated Math", "综合数学"),
    courses: [
      ...grades(1, 5),
      "prealgebra",
      "integrated-math-i",
      "integrated-math-ii",
      "integrated-math-iii",
      "precalculus",
      "ap-calculus-bc",
      ...university,
    ],
  },
  {
    id: "integrated-honors",
    title: t("Integrated Math (Honors)", "综合数学（荣誉）"),
    // Honors covers four years in three: a learner keeps to it while getting most answers right.
    minStanding: HONORS_STANDING,
    courses: [
      ...grades(1, 5),
      "prealgebra",
      "integrated-math-i-honors",
      "integrated-math-ii-honors",
      "integrated-math-iii-honors",
      "ap-calculus-bc",
      ...university,
    ],
  },
  {
    id: "grade-by-grade",
    title: t("Grade by Grade", "按年级"),
    courses: [...grades(1, 8), "algebra-i", "geometry", "algebra-ii", "precalculus", "ap-calculus-bc", ...university],
  },
  {
    id: "mathematical-foundations",
    title: t("Mathematical Foundations", "数学基础"),
    courses: ["mathematical-foundations-i", "mathematical-foundations-ii", "mathematical-foundations-iii", ...university],
  },
  { id: "sat", title: t("SAT", "SAT"), courses: ["sat-math-fundamentals", "sat-math-prep"] },
  { id: "act", title: t("ACT", "ACT"), courses: ["act-math-fundamentals", "act-math-prep"] },
];

/** grades lists the grade courses from `from` to `to`. */
function grades(from: number, to: number): string[] {
  const ordinal = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;
  return Array.from({ length: to - from + 1 }, (_, i) => `${ordinal(from + i)}-grade-math`);
}

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
