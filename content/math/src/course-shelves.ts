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

/** onShelves puts each course on its shelf and lists them in the order of the shelves; a course on no shelf is an error. */
export function onShelves(courses: readonly CourseDef[]): readonly CourseDef[] {
  const byId = new Map(courses.map((c) => [c.id, c]));
  const listed = shelves.flatMap((shelf) =>
    shelf.courses.map((id): CourseDef => {
      const course = byId.get(id);
      if (!course) throw new Error(`course shelf lists unknown course ${id}`);
      return { ...course, group: shelf.title };
    }),
  );
  const missing = courses.filter((c) => !shelves.some((shelf) => shelf.courses.includes(c.id))).map((c) => c.id);
  if (missing.length > 0) throw new Error(`courses on no shelf: ${missing.join(", ")}`);
  return listed;
}
