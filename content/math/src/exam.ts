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
  /** tip is what to look for on the exam, shown when a learner comes back to a lesson they failed. */
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
    practiceOnly: true,
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

/** optionValue is the number an option shows, or undefined if it is not a plain number or fraction. */
function optionValue(o: Option): Q | undefined {
  if (typeof o !== "string") return o instanceof Q ? o : Q.of(o);
  if (/^-?\d+(\.\d+)?$/.test(o)) return Q.parse(o);
  const frac = /^(-?)\\frac\{(\d+)\}\{([1-9]\d*)\}$/.exec(o);
  return frac ? Q.of(BigInt(`${frac[1]}${frac[2]}`), BigInt(frac[3] as string)) : undefined;
}

/**
 * orderedOptions lists numeric options from least to greatest, as the real tests do, with the answer at a position drawn at random so that
 * "pick the smallest" tells nothing. Distractors on the side that has too many are mirrored across the answer, or replaced by a near value if
 * the mirror image would be out of place, such as a negative among positive quantities; the first distractors listed, the most plausible, stay.
 */
function orderedOptions(rng: Rng, correct: Q, wrong: readonly Q[]): Q[] {
  const all = [correct, ...wrong];
  const positive = correct.sign() > 0 && all.every((v) => v.sign() >= 0);
  const fraction = all.every((v) => v.sign() >= 0 && v.cmp(Q.one) <= 0);
  const fits = (v: Q): boolean => !v.eq(correct) && !(positive && v.sign() <= 0) && !(fraction && v.cmp(Q.one) >= 0);
  const step = correct.isInteger() ? Q.one : Q.of(1n, 2n * correct.d);
  const nearBy = (side: number): Q[] => [1, 2, 3, 4, 5, 6].map((d) => correct.add(step.mul(Q.of(side * d)))).filter(fits);
  const least = Math.max(0, 3 - nearBy(1).length);
  const target = rng.int(Math.min(least, 3), Math.max(least, Math.min(3, nearBy(-1).length)));
  const options = [...wrong];
  const below = (): number => options.filter((o) => o.cmp(correct) < 0).length;
  for (let i = options.length - 1; i >= 0 && below() !== target; i--) {
    const w = options[i] as Q;
    const isBelow = w.cmp(correct) < 0;
    if (isBelow !== below() > target) continue;
    const free = (v: Q): boolean => fits(v) && !options.some((o) => o.eq(v));
    const mirror = correct.add(correct.sub(w));
    const next = free(mirror) ? mirror : nearBy(isBelow ? 1 : -1).find(free);
    if (next) options[i] = next;
  }
  return [correct, ...options].sort((a, b) => a.cmp(b));
}

/** concluded ends a solution by stating the answer, unless it already explains itself and names it. */
function concluded(solution: Text, answer: Text): Text {
  if (solution.en.length >= 25 && solution.en.includes(answer.en.replace(/\.$/, ""))) return solution;
  return t(
    `${solution.en} So the answer is ${answer.en.replace(/\.$/, "")}.`,
    `${solution["zh-CN"]} 所以答案是 ${answer["zh-CN"].replace(/。$/, "")}。`,
  );
}

/** mc builds a four-option question from a correct option and its distractors. Numeric options are listed from least to greatest, as on the real tests (see orderedOptions), and other options are shuffled, so that the position of the answer tells nothing; missing distractors are filled with nearby values. */
export function mc(rng: Rng, prompt: Text, correct: Option, wrong: readonly Option[], solution: Text, figure?: Figure): Problem {
  const key = latexOf(correct);
  const seen = new Set([key]);
  const rest: Option[] = [];
  for (const w of wrong) {
    const l = latexOf(w);
    if (!seen.has(l) && rest.length < 3) {
      seen.add(l);
      rest.push(w);
    }
  }
  for (let d = 1; rest.length < 3 && typeof correct !== "string"; d++) {
    for (const c of [
      (correct instanceof Q ? correct : Q.of(correct)).add(Q.of(d)),
      (correct instanceof Q ? correct : Q.of(correct)).sub(Q.of(d)),
    ]) {
      const l = c.toLatex();
      if (!seen.has(l) && rest.length < 3) {
        seen.add(l);
        rest.push(c);
      }
    }
  }
  const value = optionValue(correct);
  const values = rest.map(optionValue);
  const ordered =
    value && values.every((v) => v !== undefined)
      ? orderedOptions(rng, value, values as Q[]).map((v) => v.toLatex())
      : rng.shuffle([key, ...rest.map(latexOf)]);
  const options = ordered.map((l) => t(`$${l}$`, `$${l}$`));
  return {
    ...choiceProblem({ prompt, options, correct: ordered.indexOf(key), solution: concluded(solution, t(`$${key}$`, `$${key}$`)) }),
    ...(figure && { figure }),
  };
}

/** words builds a four-option question whose options are sentences or phrases, in shuffled order. */
export function words(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text, figure?: Figure): Problem {
  const seen = new Set([correct.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))).slice(0, 3);
  const options = rng.shuffle([correct, ...rest]);
  return {
    ...choiceProblem({ prompt, options, correct: options.indexOf(correct), solution: concluded(solution, correct) }),
    ...(figure && { figure }),
  };
}

/** spr builds a student-produced response: a number typed in, as a fraction or a decimal. */
export function spr(prompt: Text, answer: Coefficient, wrong: readonly Coefficient[], solution: Text, figure?: Figure): Problem {
  const key = latexOf(answer);
  return {
    ...numberProblem({ prompt, answer, wrong, solution: concluded(solution, t(`$${key}$`, `$${key}$`)) }),
    ...(figure && { figure }),
  };
}

/** sg writes a signed term after an expression: sg(3) is "+ 3", sg(-3) is "- 3" and sg(0) is empty. */
export const sg = (n: number, suffix = ""): string => (n === 0 ? "" : `${n < 0 ? "-" : "+"} ${Math.abs(n)}${suffix}`);

/** cx writes a leading coefficient with a variable: cx(1, "x") is "x", cx(-1, "x") is "-x" and cx(3, "x") is "3x". */
export const cx = (c: number, v = "x"): string => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);

/** tx writes a later term with its sign: tx(-1, "y") is "- y", tx(3, "y") is "+ 3y" and tx(0, "y") is empty. */
export const tx = (c: number, v = "x"): string => (c === 0 ? "" : `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? v : `${Math.abs(c)}${v}`}`);

/** table writes a two-row table of values as display math. */
export function table(x1: string, y1: string, xs: readonly (number | string)[], ys: readonly (number | string)[]): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} ${x1} & ${xs.join(" & ")} \\\\ \\hline ${y1} & ${ys.join(" & ")} \\end{array}$$`;
}

/** PlotView is the window of a coordinate figure: its ranges and the spacing of its grid lines. */
export interface PlotView {
  readonly x: readonly [number, number];
  readonly y: readonly [number, number];
  readonly dx: number;
  readonly dy: number;
}

const round1 = (n: number): string => String(Math.round(n * 10) / 10);

/** plotFrame draws the grid and axes of a coordinate figure and what body adds in its coordinates. */
export const plotFrame = (v: PlotView, body: (px: (x: number) => number, py: (y: number) => number) => string, alt: Text): Figure => {
  const [W, H, M] = [320, 240, 26];
  const px = (x: number) => M + ((x - v.x[0]) / (v.x[1] - v.x[0])) * (W - 2 * M);
  const py = (y: number) => H - M - ((y - v.y[0]) / (v.y[1] - v.y[0])) * (H - 2 * M);
  const x0 = Math.min(Math.max(0, v.x[0]), v.x[1]);
  const y0 = Math.min(Math.max(0, v.y[0]), v.y[1]);
  const parts: string[] = [];
  for (let x = v.x[0]; x <= v.x[1] + 1e-9; x += v.dx) {
    parts.push(`<line x1="${round1(px(x))}" y1="${M}" x2="${round1(px(x))}" y2="${H - M}" stroke-width="0.4" opacity="0.4"/>`);
    if (Math.abs(x - x0) > 1e-9 || x0 === v.x[0])
      parts.push(
        `<text x="${round1(px(x))}" y="${round1(py(y0) + 13)}" font-size="10" text-anchor="middle" fill="currentColor" stroke="none">${round1(x)}</text>`,
      );
  }
  for (let y = v.y[0]; y <= v.y[1] + 1e-9; y += v.dy) {
    parts.push(`<line x1="${M}" y1="${round1(py(y))}" x2="${W - M}" y2="${round1(py(y))}" stroke-width="0.4" opacity="0.4"/>`);
    if (Math.abs(y - y0) > 1e-9)
      parts.push(
        `<text x="${round1(px(x0) - 4)}" y="${round1(py(y) + 3)}" font-size="10" text-anchor="end" fill="currentColor" stroke="none">${round1(y)}</text>`,
      );
  }
  parts.push(`<line x1="${M}" y1="${round1(py(y0))}" x2="${W - M}" y2="${round1(py(y0))}" stroke-width="1.2"/>`);
  parts.push(`<line x1="${round1(px(x0))}" y1="${M}" x2="${round1(px(x0))}" y2="${H - M}" stroke-width="1.2"/>`);
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor">${parts.join("")}${body(px, py)}</svg>`,
    alt,
  };
};

/** curveFigure draws the graph of f over a grid, leaving out the parts outside the window. */
export function curveFigure(f: (x: number) => number, view: PlotView, alt: Text): Figure {
  return plotFrame(
    view,
    (px, py) => {
      const runs: string[][] = [[]];
      const n = 160;
      for (let i = 0; i <= n; i++) {
        const x = view.x[0] + ((view.x[1] - view.x[0]) * i) / n;
        const y = f(x);
        if (y >= view.y[0] && y <= view.y[1]) runs[runs.length - 1]?.push(`${round1(px(x))},${round1(py(y))}`);
        else runs.push([]);
      }
      return runs
        .filter((r) => r.length > 1)
        .map((r) => `<polyline class="accent" points="${r.join(" ")}" stroke-width="2"/>`)
        .join("");
    },
    alt,
  );
}

/** dotsFigure draws points on a grid, with an optional line of best fit through two points. */
export function dotsFigure(
  points: readonly (readonly [number, number])[],
  view: PlotView,
  alt: Text,
  line?: readonly [readonly [number, number], readonly [number, number]],
): Figure {
  return plotFrame(
    view,
    (px, py) => {
      const dots = points
        .map(([x, y]) => `<circle cx="${round1(px(x))}" cy="${round1(py(y))}" r="3.2" fill="currentColor" stroke="none"/>`)
        .join("");
      const fit = line
        ? `<line class="accent" x1="${round1(px(line[0][0]))}" y1="${round1(py(line[0][1]))}" x2="${round1(px(line[1][0]))}" y2="${round1(py(line[1][1]))}" stroke-width="2"/>`
        : "";
      return dots + fit;
    },
    alt,
  );
}

/** Sketch lists what sketchFigure draws on its 320 by 240 canvas: segments, circles and text labels. */
export interface Sketch {
  readonly segs?: readonly (readonly [number, number, number, number])[];
  readonly circles?: readonly (readonly [number, number, number])[];
  readonly labels?: readonly (readonly [number, number, string])[];
}

/** sketchFigure draws a geometric figure from segments, circles and labels. */
export function sketchFigure(s: Sketch, alt: Text): Figure {
  const segs = (s.segs ?? []).map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke-width="1.6"/>`);
  const circles = (s.circles ?? []).map(([a, b, r]) => `<circle cx="${a}" cy="${b}" r="${r}" stroke-width="1.6"/>`);
  const labels = (s.labels ?? []).map(
    ([x, y, l]) => `<text x="${x}" y="${y}" font-size="14" text-anchor="middle" fill="currentColor" stroke="none">${l}</text>`,
  );
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor">${[...segs, ...circles, ...labels].join("")}</svg>`,
    alt,
  };
}

/** ask builds a four-option question from English and Chinese strings, the short form used across ACT Math Prep. */
export function ask(
  rng: Rng,
  en: string,
  zh: string,
  correct: Option,
  wrong: readonly Option[],
  solEn: string,
  solZh: string,
  figure?: Figure,
): Problem {
  return mc(rng, t(en, zh), correct, wrong, t(solEn, solZh), figure);
}

/** asChoice gives a typed-answer problem four options, using its listed mistakes as distractors; every question on the ACT is multiple choice. */
export function asChoice(rng: Rng, p: Problem): Problem {
  if (p.answer.checker !== "number") return p;
  const value = Q.parse((p.answer.expected as { value: string }).value);
  return mc(rng, p.prompt, value, p.wrong ?? [], p.solution, p.figure);
}

/** multipleChoice retitles a spec for another exam outline and makes every one of its questions multiple choice. */
export function multipleChoice(spec: ExamSpec, en: string, zh: string): ExamSpec {
  return { ...spec, title: t(en, zh), make: (rng, hard) => asChoice(rng, spec.make(rng, hard)) };
}
