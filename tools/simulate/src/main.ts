import { compileMath } from "@ga/content-math";

import { simulate } from "./simulate.ts";

const subject = compileMath();
const students = [
  { name: "strong", ability: 0.95, xpPerDay: 40 },
  { name: "typical", ability: 0.85, xpPerDay: 30 },
  { name: "struggling", ability: 0.7, xpPerDay: 20 },
  {
    name: "placed",
    ability: 0.85,
    xpPerDay: 30,
    knows: [
      "integers-and-opposites",
      "absolute-value",
      "adding-integers",
      "subtracting-integers",
      "multiplying-integers",
      "dividing-integers",
    ],
  },
];
const rows = students.map(({ name, ...student }) => {
  const runs = Array.from({ length: 20 }, (_, i) => simulate(subject, "algebra-foundations", student, i + 1));
  const mean = (f: (r: (typeof runs)[number]) => number) => (runs.reduce((s, r) => s + f(r), 0) / runs.length).toFixed(2);
  return {
    student: name,
    finished: `${runs.filter((r) => r.finished).length}/${runs.length}`,
    days: mean((r) => r.days),
    lessons: mean((r) => r.lessons),
    failedLessons: mean((r) => r.failedLessons),
    reviews: mean((r) => r.reviews),
    reviewsPerTopic: mean((r) => r.reviewsPerTopic),
    quizzes: mean((r) => r.quizzes),
  };
});
console.table(rows);
