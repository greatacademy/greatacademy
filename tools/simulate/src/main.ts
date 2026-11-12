import { compileEnglish } from "@ga/content-english";
import { compileMath } from "@ga/content-math";

import { simulate } from "./simulate.ts";

// The course to simulate is the first argument: `pnpm nx run simulate:simulate -- prealgebra`.
const courseId = process.argv[2] ?? "algebra-foundations";
// English compiles in a moment and mathematics takes seconds, so English is tried first.
const english = compileEnglish();
const subject = english.courses.has(courseId) ? english : compileMath();
// A placed student starts with the course: they know its foundations, the topics of earlier courses it builds on, and
// the diagnostic should find them. Students who start from nothing learn the foundations as lessons on the way.
const foundations = subject.courses.get(courseId)?.foundations ?? [];
const students = [
  { name: "strong", ability: 0.95, xpPerDay: 40 },
  { name: "typical", ability: 0.85, xpPerDay: 30 },
  { name: "struggling", ability: 0.7, xpPerDay: 20 },
  { name: "placed", ability: 0.85, xpPerDay: 30, knows: foundations },
  { name: "struggling, placed", ability: 0.7, xpPerDay: 20, knows: foundations },
];
const rows = students.map(({ name, ...student }) => {
  const runs = Array.from({ length: 20 }, (_, i) => simulate(subject, courseId, student, i + 1));
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
    passages: mean((r) => r.passages),
  };
});
console.log(courseId);
console.table(rows);
