import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem } from "./problems.ts";

// Exam-style practice for SAT Math Prep and ACT Math Prep. A topic here teaches nothing new: it asks the questions
// of its Fundamentals topic the way the exam does, in context and with four options whose distractors come from
// real mistakes. The Fundamentals topic is its prerequisite, so a struggling student is routed back to the lesson.

/** Exam names the test a topic prepares for. */
export type Exam = "sat" | "act";

/** ExamSpec describes one exam-style topic: its outline title, its Fundamentals topics and one generator with an easier and a harder form. */
export interface ExamSpec {
  /** title is the outline title; the topic id derives from its English form and never changes. */
  readonly title: Text;
  /** base are the Fundamentals topics the question practices, which become prerequisites. */
  readonly base: readonly string[];
  /** tip is what to look for on the exam, shown before the first question. */
  readonly tip: Text;
  /** hardTip is what makes the harder questions harder. */
  readonly hardTip: Text;
  readonly make: (rng: Rng, hard: boolean) => Problem;
}

/** examSlug derives a kebab-case id part from an outline title. */
export function examSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** examTopic builds the topic of a spec: two knowledge points and an encompassing of each Fundamentals topic. */
export function examTopic(exam: Exam, spec: ExamSpec): TopicDef {
  const name = exam.toUpperCase();
  return {
    id: `${exam}-exam-${examSlug(spec.title.en)}`,
    title: spec.title,
    summary: t(
      `${name}-style questions on ${spec.title.en.toLowerCase()}, at exam difficulty and pace.`,
      `${name} 风格的“${spec.title["zh-CN"]}”题目，难度与节奏同考试一致。`,
    ),
    prerequisites: [...spec.base],
    encompasses: spec.base.map((topic) => ({ topic, weight: 0.5 })),
    xp: 8,
    knowledgePoints: [
      {
        id: "exam-question",
        title: t("Exam-Style Question", "考试风格题"),
        explanation: spec.tip,
        generate: (rng) => spec.make(rng, false),
      },
      {
        id: "harder-exam-question",
        title: t("Harder Exam-Style Question", "较难的考试风格题"),
        explanation: spec.hardTip,
        generate: (rng) => spec.make(rng, true),
      },
    ],
  };
}

/** x is a shorthand for writing an ExamSpec on few lines. */
export function x(en: string, zh: string, base: readonly string[], tip: Text, hardTip: Text, make: ExamSpec["make"]): ExamSpec {
  return { title: t(en, zh), base, tip, hardTip, make };
}

/** mod fixes the exam tips of a module, so its specs need only a title, Fundamentals topics and a generator. */
export function mod(tip: Text, hardTip: Text): (en: string, zh: string, base: readonly string[], make: ExamSpec["make"]) => ExamSpec {
  return (en, zh, base, make) => x(en, zh, base, tip, hardTip, make);
}

/** Option is a numeric or LaTeX answer choice. */
export type Option = Coefficient | string;

const latexOf = (o: Option): string => (typeof o === "string" ? o : (o instanceof Q ? o : Q.of(o)).toLatex());

/** mc builds a four-option question from a correct option and its distractors, in shuffled order so that the position of the answer tells nothing; missing distractors are filled with nearby values. */
export function mc(rng: Rng, prompt: Text, correct: Option, wrong: readonly Option[], solution: Text, figure?: Figure): Problem {
  const key = latexOf(correct);
  const seen = new Set([key]);
  const rest: string[] = [];
  for (const w of wrong) {
    const l = latexOf(w);
    if (!seen.has(l) && rest.length < 3) {
      seen.add(l);
      rest.push(l);
    }
  }
  for (let d = 1; rest.length < 3 && typeof correct !== "string"; d++) {
    for (const c of [
      correct instanceof Q ? correct.add(Q.of(d)) : Q.of(correct).add(Q.of(d)),
      correct instanceof Q ? correct.sub(Q.of(d)) : Q.of(correct).sub(Q.of(d)),
    ]) {
      const l = c.toLatex();
      if (!seen.has(l) && rest.length < 3) {
        seen.add(l);
        rest.push(l);
      }
    }
  }
  const ordered = rng.shuffle([key, ...rest]);
  const options = ordered.map((l) => t(`$${l}$`, `$${l}$`));
  return { ...choiceProblem({ prompt, options, correct: ordered.indexOf(key), solution }), ...(figure && { figure }) };
}

/** words builds a four-option question whose options are sentences or phrases, in shuffled order. */
export function words(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text, figure?: Figure): Problem {
  const seen = new Set([correct.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))).slice(0, 3);
  const options = rng.shuffle([correct, ...rest]);
  return { ...choiceProblem({ prompt, options, correct: options.indexOf(correct), solution }), ...(figure && { figure }) };
}

/** spr builds a student-produced response: a number typed in, as a fraction or a decimal. */
export function spr(prompt: Text, answer: Coefficient, wrong: readonly Coefficient[], solution: Text, figure?: Figure): Problem {
  return { ...numberProblem({ prompt, answer, wrong, solution }), ...(figure && { figure }) };
}

/** sg writes a signed term after an expression: sg(3) is "+ 3" and sg(-3) is "- 3". */
export const sg = (n: number, suffix = ""): string => `${n < 0 ? "-" : "+"} ${Math.abs(n)}${suffix}`;

/** cx writes a leading coefficient with a variable: cx(1, "x") is "x", cx(-1, "x") is "-x" and cx(3, "x") is "3x". */
export const cx = (c: number, v = "x"): string => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);

/** tx writes a later term with its sign: tx(-1, "y") is "- y" and tx(3, "y") is "+ 3y". */
export const tx = (c: number, v = "x"): string => `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? v : `${Math.abs(c)}${v}`}`;

/** table writes a two-row table of values as display math. */
export function table(x1: string, y1: string, xs: readonly (number | string)[], ys: readonly (number | string)[]): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} ${x1} & ${xs.join(" & ")} \\\\ \\hline ${y1} & ${ys.join(" & ")} \\end{array}$$`;
}
