import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  gcd,
  type Interval,
  intervalLatex,
  type PlaneMark,
  plane,
  Q,
  q,
  type RealSet,
  radical,
  realLine,
  simplifyRadical,
  union,
} from "@ga/subject-math";

import {
  choiceProblem,
  expressionProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  radicalProblem,
  steps,
  yesNo,
} from "../problems.ts";

// Algebra II, units 8 and 9: the exact trigonometric ratios of quadrantal and
// special angles read from the unit circle, in and beyond one turn, and
// expressions built from them; then the graphs of the six trigonometric
// functions and their properties: domain, range, period, symmetry, zeros,
// extrema, asymptotes and intervals of increase and decrease.
//
// Graphs are drawn with one grid unit on the x-axis standing for π/2, so that
// the grid lines fall on the key points, and with the x-axis numbered in
// multiples of π/2 along the bottom edge.

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** mod is a modulo m, in [0, m). */
const mod = (a: number, m: number) => ((a % m) + m) % m;

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** Fn is one of the six trigonometric functions. */
type Fn = "sin" | "cos" | "tan" | "csc" | "sec" | "cot";

const fnNames: Record<Fn, Text> = {
  sin: t("sine", "正弦"),
  cos: t("cosine", "余弦"),
  tan: t("tangent", "正切"),
  csc: t("cosecant", "余割"),
  sec: t("secant", "正割"),
  cot: t("cotangent", "余切"),
};

/** cofunction is the ratio a learner confuses with f. */
const cofunction: Record<Fn, Fn> = { sin: "cos", cos: "sin", tan: "cot", cot: "tan", sec: "csc", csc: "sec" };

/** reciprocalOf is the ratio whose reciprocal f is. */
const reciprocalOf: Record<Fn, Fn> = { sin: "csc", csc: "sin", cos: "sec", sec: "cos", tan: "cot", cot: "tan" };

/** piTex writes c·π in LaTeX: "\pi", "2\pi", "\frac{5\pi}{6}", "-\frac{\pi}{3}". */
function piTex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** piProblem builds a problem whose answer is a simplified expression in π. */
const piProblem = (prompt: Text, answer: string, solution: Text, wrong: readonly string[], prefix?: string): Problem =>
  expressionProblem({ prompt, answer, solution, simplified: true, wrong, ...(prefix && { prefix }) });

const degTex = (d: number) => `${d}^\\circ`;
const radTex = (d: number) => piTex(q(d, 180));
/** angTex writes an angle of d degrees in degrees or in radians. */
const angTex = (d: number, inRad: boolean) => (inRad ? radTex(d) : degTex(d));

/** arg writes an angle as the argument of a ratio, in parentheses when negative. */
const arg = (tex: string) => (tex.startsWith("-") ? `(${tex})` : tex);

/** call writes a ratio of an angle: "\sin 30^\circ", "\cos(-\pi)". */
const call = (f: Fn, tex: string) => `\\${f} ${arg(tex)}`;

/** both builds a text from one English and one Chinese sentence around the same LaTeX steps. */
const both = (en: string, zh: string, ...lines: string[]) => t(`${en}${steps(...lines)}`, `${zh}${steps(...lines)}`);

/** join concatenates texts locale by locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

// --- Exact values ------------------------------------------------------------

/** S is an exact number c·√m with m square-free; m = 1 for a rational number. */
type S = readonly [Q, number];

const ONE: S = [Q.one, 1];
const sTex = (s: S) => radical(s[0], s[1]);
const norm = (s: S): S => (s[0].isZero() ? [Q.zero, 1] : s);
const sNeg = (s: S): S => norm([s[0].neg(), s[1]]);
const sScale = (c: Coefficient, s: S): S => norm([toQ(c).mul(s[0]), s[1]]);

function sMul(a: S, b: S): S {
  const [k, m] = simplifyRadical(a[1] * b[1]);
  return norm([a[0].mul(b[0]).mul(Q.of(k)), m]);
}

/** sDiv is a / b, rationalized, or undefined when b is 0. */
function sDiv(a: S, b: S): S | undefined {
  if (b[0].isZero()) return undefined;
  const [k, m] = simplifyRadical(a[1] * b[1]);
  return norm([a[0].div(b[0]).div(Q.of(b[1])).mul(Q.of(k)), m]);
}

/** sAdd is a + b when it is again one term c√m, else undefined. */
function sAdd(a: S, b: S): S | undefined {
  if (a[0].isZero()) return b;
  if (b[0].isZero()) return a;
  return a[1] === b[1] ? norm([a[0].add(b[0]), a[1]]) : undefined;
}

/** sSquare is s². */
const sSquare = (s: S): Q => s[0].mul(s[0]).mul(Q.of(s[1]));

const half = q(1, 2);
const sinMagnitudes: Record<number, S> = { 0: [Q.zero, 1], 30: [half, 1], 45: [half, 2], 60: [half, 3], 90: [Q.one, 1] };

/** sinS is the exact sine of d degrees, a multiple of 30° or 45°. */
function sinS(d: number): S {
  const m = mod(d, 360);
  const r0 = m % 180;
  const v = sinMagnitudes[r0 > 90 ? 180 - r0 : r0];
  if (!v) throw new RangeError(`not a special angle: ${d}`);
  return m >= 180 ? sNeg(v) : v;
}

const cosS = (d: number): S => sinS(d + 90);

/** exact is the exact value of a ratio of d degrees, or undefined where it is undefined. */
function exact(f: Fn, d: number): S | undefined {
  switch (f) {
    case "sin":
      return sinS(d);
    case "cos":
      return cosS(d);
    case "tan":
      return sDiv(sinS(d), cosS(d));
    case "cot":
      return sDiv(cosS(d), sinS(d));
    case "csc":
      return sDiv(ONE, sinS(d));
    case "sec":
      return sDiv(ONE, cosS(d));
  }
}

/** formulas are the ratios in terms of the point (x, y) on the unit circle. */
const formulas: Record<Fn, string> = {
  sin: "y",
  cos: "x",
  tan: "\\frac{y}{x}",
  csc: "\\frac{1}{y}",
  sec: "\\frac{1}{x}",
  cot: "\\frac{x}{y}",
};

/** substituted writes the formula of a ratio with the coordinates put in. */
function substituted(f: Fn, x: S, y: S): string {
  const [xt, yt] = [sTex(x), sTex(y)];
  return { sin: yt, cos: xt, tan: `\\frac{${yt}}{${xt}}`, csc: `\\frac{1}{${yt}}`, sec: `\\frac{1}{${xt}}`, cot: `\\frac{${xt}}{${yt}}` }[
    f
  ];
}

const roman = ["", "I", "II", "III", "IV"] as const;
const zhNumbers = ["", "一", "二", "三", "四"] as const;

const axisEn = ["the positive $x$-axis", "the positive $y$-axis", "the negative $x$-axis", "the negative $y$-axis"] as const;
const axisZh = ["$x$ 轴正半轴", "$y$ 轴正半轴", "$x$ 轴负半轴", "$y$ 轴负半轴"] as const;

/** turnsLine writes the removal of full turns: "750^\circ - 2 \cdot 360^\circ = 30^\circ". */
function turnsLine(d: number, inRad: boolean): string | undefined {
  const m = mod(d, 360);
  const turns = (d - m) / 360;
  if (turns === 0) return undefined;
  const k = Math.abs(turns);
  const full = inRad ? piTex(2 * k) : k === 1 ? "360^\\circ" : `${k} \\cdot 360^\\circ`;
  return `${angTex(d, inRad)} ${turns > 0 ? "-" : "+"} ${full} = ${angTex(m, inRad)}`;
}

/** whereText locates the terminal side of an angle of d degrees and the point where it meets the unit circle. */
function whereText(d: number, inRad: boolean): Text {
  const m = mod(d, 360);
  const line = turnsLine(d, inRad);
  const co = line
    ? t(
        `Removing full turns gives a coterminal angle with the same ratios:${steps(line)}`,
        `去掉整圈，得到三角比相同的终边相同的角：${steps(line)}`,
      )
    : t("", "");
  const mTex = angTex(m, inRad);
  const p = `P = \\left(${sTex(cosS(m))}, ${sTex(sinS(m))}\\right)`;
  if (m % 90 === 0) {
    const i = m / 90;
    return join(
      co,
      t(
        `The terminal side of $${mTex}$ lies on ${axisEn[i]}, so it meets the unit circle at $${p}$.`,
        `$${mTex}$ 的终边在${axisZh[i]}上，所以它与单位圆交于 $${p}$。`,
      ),
    );
  }
  const n = Math.floor(m / 90) + 1;
  const r = [m, 180 - m, m - 180, 360 - m][n - 1]!;
  return join(
    co,
    t(
      `The angle $${mTex}$ is in Quadrant ${roman[n]} with reference angle $${angTex(r, inRad)}$, so its terminal side meets the unit circle at $${p}$.`,
      `角 $${mTex}$ 在第${zhNumbers[n]}象限，参考角为 $${angTex(r, inRad)}$，所以它的终边与单位圆交于 $${p}$。`,
    ),
  );
}

/** valueSolution explains the value of a ratio of d degrees from the unit circle. */
function valueSolution(f: Fn, d: number, inRad: boolean): Text {
  const m = mod(d, 360);
  const [x, y] = [cosS(m), sinS(m)];
  const v = exact(f, d);
  const c = call(f, angTex(d, inRad));
  const last = v
    ? f === "sin" || f === "cos"
      ? both(" Then", " 于是", `${c} = ${formulas[f]} = ${sTex(v)}`)
      : both(" Then", " 于是", `${c} = ${formulas[f]} = ${substituted(f, x, y)} = ${sTex(v)}`)
    : t(
        ` Then $${c} = ${formulas[f]}$, and here $${f === "tan" || f === "sec" ? "x" : "y"} = 0$. Division by zero is not defined, so $${c}$ is not defined.`,
        `于是 $${c} = ${formulas[f]}$，而这里 $${f === "tan" || f === "sec" ? "x" : "y"} = 0$。除以零无意义，所以 $${c}$ 无定义。`,
      );
  return join(whereText(d, inRad), last);
}

const quadrantal = [0, 90, 180, 270, 360] as const;
const specials = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330] as const;
const allSixes: readonly Fn[] = ["sin", "cos", "tan", "csc", "sec", "cot"];

const undefinedText = t("Undefined", "无定义");
const smallOptions: readonly Text[] = [same("$-1$"), same("$0$"), same("$1$"), undefinedText];

/** smallChoice asks for a ratio whose value is −1, 0, 1 or undefined. */
function smallChoice(f: Fn, d: number, inRad: boolean): Problem {
  const v = exact(f, d);
  const c = call(f, angTex(d, inRad));
  return choiceProblem({
    prompt: t(`Find $${c}$.`, `求 $${c}$。`),
    options: smallOptions,
    correct: v ? Number(v[0].n) + 1 : 3,
    solution: valueSolution(f, d, inRad),
  });
}

/** valueProblem asks for the exact value of a ratio of d degrees. */
function valueProblem(f: Fn, d: number, inRad: boolean, prompt?: Text): Problem {
  const v = exact(f, d);
  if (!v) throw new RangeError(`undefined ratio ${f} ${d}`);
  const c = call(f, angTex(d, inRad));
  const co = exact(cofunction[f], d);
  const re = exact(reciprocalOf[f], d);
  const wrong = [sNeg(v), ...(co ? [co, sNeg(co)] : []), ...(re ? [re] : []), [v[0].abs(), v[1]] as S].map(sTex);
  return radicalProblem({
    prompt: prompt ?? t(`Find the exact value of $${c}$.`, `求 $${c}$ 的精确值。`),
    answer: [v[0], v[1]],
    wrong,
    solution: valueSolution(f, d, inRad),
  });
}

// ---------------------------------------------------------------------------
// 8.24 Special trigonometric ratios
// ---------------------------------------------------------------------------

/** findingTrigonometricRatiosOfQuadrantalAngles reads the ratios of 0°, 90°, 180°, 270° and 360° off the unit circle. */
export const findingTrigonometricRatiosOfQuadrantalAngles: TopicDef = {
  id: "finding-trigonometric-ratios-of-quadrantal-angles",
  title: t("Finding Trigonometric Ratios of Quadrantal Angles", "求象限角的三角比"),
  summary: t(
    "Find the six trigonometric ratios of 0°, 90°, 180°, 270° and 360° (0, π/2, π, 3π/2, 2π) from the points where their terminal sides meet the unit circle.",
    "由终边与单位圆的交点，求 0°、90°、180°、270°、360°（0、π/2、π、3π/2、2π）的六个三角比。",
  ),
  prerequisites: ["extending-the-trigonometric-ratios-using-angles-in-radians"],
  encompasses: [
    { topic: "extending-the-trigonometric-ratios-using-angles-in-radians", weight: 0.3 },
    { topic: "extending-the-trigonometric-ratios-using-the-unit-circle", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "sine-and-cosine-of-quadrantal-angles",
      title: t("Sine and cosine of quadrantal angles", "象限角的正弦与余弦"),
      explanation: t(
        "A **quadrantal angle** has its terminal side on an axis. Its terminal side meets the unit circle at one of four points:\n\n| $\\theta$ | $0^\\circ$ | $90^\\circ$ | $180^\\circ$ | $270^\\circ$ |\n| :--- | :---: | :---: | :---: | :---: |\n| in radians | $0$ | $\\frac{\\pi}{2}$ | $\\pi$ | $\\frac{3\\pi}{2}$ |\n| point $(x, y)$ | $(1, 0)$ | $(0, 1)$ | $(-1, 0)$ | $(0, -1)$ |\n\nThe angle $360^\\circ = 2\\pi$ is a full turn and ends at $(1, 0)$ again. Since $\\cos \\theta = x$ and $\\sin \\theta = y$, read them off the point. For $180^\\circ$, the point is $(-1, 0)$, so $\\cos 180^\\circ = -1$ and $\\sin 180^\\circ = 0$.",
        "**象限角**的终边在坐标轴上。它的终边与单位圆交于以下四点之一：\n\n| $\\theta$ | $0^\\circ$ | $90^\\circ$ | $180^\\circ$ | $270^\\circ$ |\n| :--- | :---: | :---: | :---: | :---: |\n| 弧度 | $0$ | $\\frac{\\pi}{2}$ | $\\pi$ | $\\frac{3\\pi}{2}$ |\n| 点 $(x, y)$ | $(1, 0)$ | $(0, 1)$ | $(-1, 0)$ | $(0, -1)$ |\n\n角 $360^\\circ = 2\\pi$ 是一整圈，又回到 $(1, 0)$。因为 $\\cos \\theta = x$，$\\sin \\theta = y$，直接从点读出。对 $180^\\circ$，交点为 $(-1, 0)$，所以 $\\cos 180^\\circ = -1$，$\\sin 180^\\circ = 0$。",
      ),
      generate(rng) {
        const d = rng.pick(quadrantal);
        const inRad = rng.bool();
        const tex = angTex(d, inRad);
        if (rng.bool(0.3)) {
          const [x, y] = [cosS(d), sinS(d)].map((s) => s[0]);
          return pointProblem({
            prompt: t(
              `Find the point where the terminal side of an angle of $${tex}$ in standard position meets the unit circle.`,
              `求标准位置下 $${tex}$ 角的终边与单位圆的交点。`,
            ),
            answer: [x!, y!],
            wrong: [
              [y!, x!],
              [x!.neg(), y!.neg()],
            ],
            solution: whereText(d, inRad),
          });
        }
        const f = rng.pick<Fn>(["sin", "cos"]);
        const v = exact(f, d)![0];
        return numberProblem({
          prompt: t(`Find $${call(f, tex)}$.`, `求 $${call(f, tex)}$。`),
          answer: v,
          wrong: [exact(cofunction[f], d)![0], v.neg()],
          solution: valueSolution(f, d, inRad),
        });
      },
    },
    {
      id: "tangent-and-reciprocal-ratios-of-quadrantal-angles",
      title: t("Tangent and the reciprocal ratios of quadrantal angles", "象限角的正切与倒数三角比"),
      explanation: t(
        "The other ratios are quotients of the coordinates of the point $(x, y)$:\n\n$$\\tan \\theta = \\frac{y}{x}, \\quad \\cot \\theta = \\frac{x}{y}, \\quad \\sec \\theta = \\frac{1}{x}, \\quad \\csc \\theta = \\frac{1}{y}.$$\n\nAt a quadrantal angle one coordinate is $0$, and a ratio with $0$ in the denominator is **undefined**. For $90^\\circ$, the point is $(0, 1)$: $\\tan 90^\\circ = \\frac{1}{0}$ is undefined, $\\cot 90^\\circ = \\frac{0}{1} = 0$, $\\sec 90^\\circ$ is undefined and $\\csc 90^\\circ = \\frac{1}{1} = 1$.",
        "其他三角比是点 $(x, y)$ 坐标的商：\n\n$$\\tan \\theta = \\frac{y}{x}, \\quad \\cot \\theta = \\frac{x}{y}, \\quad \\sec \\theta = \\frac{1}{x}, \\quad \\csc \\theta = \\frac{1}{y}.$$\n\n象限角的交点有一个坐标为 $0$，分母为 $0$ 的比**无定义**。对 $90^\\circ$，交点为 $(0, 1)$：$\\tan 90^\\circ = \\frac{1}{0}$ 无定义，$\\cot 90^\\circ = \\frac{0}{1} = 0$，$\\sec 90^\\circ$ 无定义，$\\csc 90^\\circ = \\frac{1}{1} = 1$。",
      ),
      generate: (rng) => smallChoice(rng.pick<Fn>(["tan", "cot", "sec", "csc"]), rng.pick(quadrantal), rng.bool()),
    },
    {
      id: "expressions-with-quadrantal-angles",
      title: t("Expressions with quadrantal angles", "含象限角的式子"),
      explanation: t(
        "To evaluate an expression, replace each ratio by its value, then do the arithmetic. For example, with $\\sin 270^\\circ = -1$ and $\\cos 180^\\circ = -1$:\n\n$$3\\sin 270^\\circ - 2\\cos 180^\\circ = 3(-1) - 2(-1) = -1.$$",
        "求式子的值时，把每个三角比换成它的值，再计算。例如 $\\sin 270^\\circ = -1$，$\\cos 180^\\circ = -1$：\n\n$$3\\sin 270^\\circ - 2\\cos 180^\\circ = 3(-1) - 2(-1) = -1.$$",
      ),
      generate(rng) {
        const inRad = rng.bool();
        for (;;) {
          const [d1, d2] = [rng.pick(quadrantal), rng.pick(quadrantal)];
          const [f1, f2] = [rng.pick<Fn>(["sin", "cos"]), rng.pick<Fn>(["sin", "cos"])];
          const [a, b] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
          const [v1, v2] = [exact(f1, d1)![0], exact(f2, d2)![0]];
          if (v1.isZero() && v2.isZero()) continue;
          const [c1, c2] = [call(f1, angTex(d1, inRad)), call(f2, angTex(d2, inRad))];
          const expr = `${a === 1 ? "" : a === -1 ? "-" : a}${c1} ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}${c2}`;
          const answer = v1.mul(Q.of(a)).add(v2.mul(Q.of(b)));
          const par = (v: Q) => `(${v.toLatex()})`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer,
            wrong: [
              v1.mul(Q.of(a)).sub(v2.mul(Q.of(b))),
              exact(cofunction[f1], d1)![0]
                .mul(Q.of(a))
                .add(exact(cofunction[f2], d2)![0].mul(Q.of(b))),
              answer.neg(),
            ],
            solution: both(
              "Replace each ratio by its value from the unit circle:",
              "把每个三角比换成单位圆上读出的值：",
              `${c1} = ${v1.toLatex()}, \\quad ${c2} = ${v2.toLatex()}`,
              `${expr} = ${a}${par(v1)} ${b > 0 ? "+" : "-"} ${Math.abs(b)}${par(v2)} = ${answer.toLatex()}`,
            ),
          });
        }
      },
    },
  ],
};

/** largeQuadrantal is a random multiple of 90° outside [0°, 360°]. */
const largeQuadrantal = (rng: Rng) => 90 * (rng.bool(0.4) ? rng.int(-12, -1) : rng.int(5, 16));

/** outsideProblem asks for a ratio of a quadrantal angle outside the standard range. */
function outsideProblem(rng: Rng, inRad: boolean): Problem {
  const d = largeQuadrantal(rng);
  const f = rng.pick(allSixes);
  if (f !== "sin" && f !== "cos") return smallChoice(f, d, inRad);
  const v = exact(f, d)![0];
  const c = call(f, angTex(d, inRad));
  return numberProblem({
    prompt: t(`Find $${c}$.`, `求 $${c}$。`),
    answer: v,
    wrong: [exact(cofunction[f], d)![0], v.neg()],
    solution: valueSolution(f, d, inRad),
  });
}

/** trigonometricRatiosOfQuadrantalAnglesOutsideTheStandardRange removes full turns from multiples of 90° first. */
export const trigonometricRatiosOfQuadrantalAnglesOutsideTheStandardRange: TopicDef = {
  id: "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range",
  title: t("Trigonometric Ratios of Quadrantal Angles Outside the Standard Range", "标准范围以外的象限角的三角比"),
  summary: t(
    "Find the ratios of negative quadrantal angles and of quadrantal angles beyond one turn, such as 450° or −3π/2, through coterminal angles.",
    "借助终边相同的角，求负的象限角和超过一圈的象限角（如 450° 或 −3π/2）的三角比。",
  ),
  prerequisites: ["finding-trigonometric-ratios-of-quadrantal-angles", "extending-the-trigonometric-ratios-to-large-angles"],
  encompasses: [
    { topic: "finding-trigonometric-ratios-of-quadrantal-angles", weight: 0.6 },
    { topic: "extending-the-trigonometric-ratios-to-large-angles", weight: 0.3 },
    { topic: "coterminal-angles", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "quadrantal-angles-in-degrees-outside-the-standard-range",
      title: t("Quadrantal angles in degrees", "角度制的象限角"),
      explanation: t(
        "Coterminal angles have the same ratios, so first add or subtract multiples of $360^\\circ$ to land between $0^\\circ$ and $360^\\circ$, then read the point on the unit circle.\n\nFor $\\cos 900^\\circ$: $900^\\circ - 2 \\cdot 360^\\circ = 180^\\circ$, whose terminal side meets the unit circle at $(-1, 0)$, so $\\cos 900^\\circ = -1$. For $\\tan(-270^\\circ)$: $-270^\\circ + 360^\\circ = 90^\\circ$, at $(0, 1)$, so $\\tan(-270^\\circ) = \\frac{1}{0}$ is undefined.",
        "终边相同的角三角比相同，所以先加减 $360^\\circ$ 的倍数，落到 $0^\\circ$ 与 $360^\\circ$ 之间，再读单位圆上的点。\n\n对 $\\cos 900^\\circ$：$900^\\circ - 2 \\cdot 360^\\circ = 180^\\circ$，终边与单位圆交于 $(-1, 0)$，所以 $\\cos 900^\\circ = -1$。对 $\\tan(-270^\\circ)$：$-270^\\circ + 360^\\circ = 90^\\circ$，交于 $(0, 1)$，所以 $\\tan(-270^\\circ) = \\frac{1}{0}$ 无定义。",
      ),
      generate: (rng) => outsideProblem(rng, false),
    },
    {
      id: "quadrantal-angles-in-radians-outside-the-standard-range",
      title: t("Quadrantal angles in radians", "弧度制的象限角"),
      explanation: t(
        "In radians the quadrantal angles are the multiples of $\\frac{\\pi}{2}$, and a full turn is $2\\pi$. For $\\sin \\frac{7\\pi}{2}$: $\\frac{7\\pi}{2} - 2\\pi = \\frac{3\\pi}{2}$, at $(0, -1)$, so $\\sin \\frac{7\\pi}{2} = -1$. For $\\sec(-3\\pi)$: $-3\\pi + 4\\pi = \\pi$, at $(-1, 0)$, so $\\sec(-3\\pi) = \\frac{1}{-1} = -1$.",
        "用弧度表示时，象限角是 $\\frac{\\pi}{2}$ 的倍数，一整圈是 $2\\pi$。对 $\\sin \\frac{7\\pi}{2}$：$\\frac{7\\pi}{2} - 2\\pi = \\frac{3\\pi}{2}$，交于 $(0, -1)$，所以 $\\sin \\frac{7\\pi}{2} = -1$。对 $\\sec(-3\\pi)$：$-3\\pi + 4\\pi = \\pi$，交于 $(-1, 0)$，所以 $\\sec(-3\\pi) = \\frac{1}{-1} = -1$。",
      ),
      generate: (rng) => outsideProblem(rng, true),
    },
  ],
};

/** specialTable is the table of the points on the unit circle at the special angles of Quadrant I. */
const specialTable = t(
  "| $\\theta$ | $30^\\circ = \\frac{\\pi}{6}$ | $45^\\circ = \\frac{\\pi}{4}$ | $60^\\circ = \\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: |\n| $(\\cos \\theta, \\sin \\theta)$ | $\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$ | $\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)$ | $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$ |",
  "| $\\theta$ | $30^\\circ = \\frac{\\pi}{6}$ | $45^\\circ = \\frac{\\pi}{4}$ | $60^\\circ = \\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: |\n| $(\\cos \\theta, \\sin \\theta)$ | $\\left(\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$ | $\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)$ | $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$ |",
);

/** findingTrigonometricRatiosOfSpecialAnglesUsingTheUnitCircle finds exact ratios of multiples of 30° and 45° in every quadrant. */
export const findingTrigonometricRatiosOfSpecialAnglesUsingTheUnitCircle: TopicDef = {
  id: "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
  title: t("Finding Trigonometric Ratios of Special Angles Using the Unit Circle", "用单位圆求特殊角的三角比"),
  summary: t(
    "Find the exact sine, cosine and tangent of the multiples of 30° and 45° (π/6 and π/4) in every quadrant, and find such an angle from its point on the unit circle.",
    "求各象限中 30° 与 45°（π/6 与 π/4）的倍数的正弦、余弦、正切的精确值，并由单位圆上的点求出这样的角。",
  ),
  prerequisites: ["extending-the-trigonometric-ratios-using-angles-in-radians"],
  encompasses: [
    { topic: "extending-the-trigonometric-ratios-using-angles-in-radians", weight: 0.5 },
    { topic: "trigonometric-ratios-with-radians", weight: 0.4 },
    { topic: "special-trigonometric-ratios", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.A.2", "CCSS.HSF.TF.A.3"],
  knowledgePoints: [
    {
      id: "special-angles-in-degrees",
      title: t("Special angles in degrees", "角度制的特殊角"),
      explanation: join(
        t(
          "The special right triangles give the points on the unit circle at $30^\\circ$, $45^\\circ$ and $60^\\circ$:\n\n",
          "由特殊直角三角形可得单位圆上 $30^\\circ$、$45^\\circ$、$60^\\circ$ 处的点：\n\n",
        ),
        specialTable,
        t(
          "\n\nAn angle with one of these as its reference angle meets the circle at the same point up to the signs of the coordinates, which the quadrant decides. For $150^\\circ$: Quadrant II, reference angle $30^\\circ$, so the point is $\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$, and\n\n$$\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}, \\qquad \\tan 150^\\circ = \\frac{1/2}{-\\sqrt{3}/2} = -\\frac{\\sqrt{3}}{3}.$$",
          "\n\n以它们为参考角的角，与单位圆的交点只在坐标符号上不同，符号由象限决定。对 $150^\\circ$：在第二象限，参考角 $30^\\circ$，交点为 $\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$，所以\n\n$$\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}, \\qquad \\tan 150^\\circ = \\frac{1/2}{-\\sqrt{3}/2} = -\\frac{\\sqrt{3}}{3}.$$",
        ),
      ),
      generate: (rng) => valueProblem(rng.pick<Fn>(["sin", "cos", "tan"]), rng.pick(specials), false),
    },
    {
      id: "special-angles-in-radians",
      title: t("Special angles in radians", "弧度制的特殊角"),
      explanation: t(
        "In radians the special angles are the multiples of $\\frac{\\pi}{6}$ and $\\frac{\\pi}{4}$. Find the quadrant and the reference angle, which is $\\frac{\\pi}{6}$, $\\frac{\\pi}{4}$ or $\\frac{\\pi}{3}$. For $\\frac{5\\pi}{4}$: $\\pi < \\frac{5\\pi}{4} < \\frac{3\\pi}{2}$, Quadrant III, reference angle $\\frac{5\\pi}{4} - \\pi = \\frac{\\pi}{4}$, so the point is $\\left(-\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)$ and $\\sin \\frac{5\\pi}{4} = -\\frac{\\sqrt{2}}{2}$, $\\tan \\frac{5\\pi}{4} = 1$.",
        "用弧度表示时，特殊角是 $\\frac{\\pi}{6}$ 与 $\\frac{\\pi}{4}$ 的倍数。先求象限和参考角，参考角是 $\\frac{\\pi}{6}$、$\\frac{\\pi}{4}$ 或 $\\frac{\\pi}{3}$。对 $\\frac{5\\pi}{4}$：$\\pi < \\frac{5\\pi}{4} < \\frac{3\\pi}{2}$，在第三象限，参考角 $\\frac{5\\pi}{4} - \\pi = \\frac{\\pi}{4}$，交点为 $\\left(-\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)$，所以 $\\sin \\frac{5\\pi}{4} = -\\frac{\\sqrt{2}}{2}$，$\\tan \\frac{5\\pi}{4} = 1$。",
      ),
      generate: (rng) => valueProblem(rng.pick<Fn>(["sin", "cos", "tan"]), rng.pick(specials), true),
    },
    {
      id: "special-angles-from-points-on-the-unit-circle",
      title: t("The angle from its point on the unit circle", "由单位圆上的点求角"),
      explanation: t(
        "Read backward: the coordinates' sizes give the reference angle, and their signs give the quadrant. If the terminal side meets the unit circle at $\\left(-\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$, then the sizes $\\frac{1}{2}$ and $\\frac{\\sqrt{3}}{2}$ of $x$ and $y$ match $60^\\circ$, and both coordinates are negative, so the angle is in Quadrant III:\n\n$$\\theta = 180^\\circ + 60^\\circ = 240^\\circ = \\frac{4\\pi}{3}.$$",
        "反过来读：坐标的大小给出参考角，符号给出象限。若终边与单位圆交于 $\\left(-\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$，则 $x$、$y$ 的大小 $\\frac{1}{2}$、$\\frac{\\sqrt{3}}{2}$ 对应 $60^\\circ$，两个坐标都为负，所以角在第三象限：\n\n$$\\theta = 180^\\circ + 60^\\circ = 240^\\circ = \\frac{4\\pi}{3}.$$",
      ),
      generate(rng) {
        const d = rng.pick(specials);
        const inRad = rng.bool();
        const [x, y] = [cosS(d), sinS(d)];
        const n = Math.floor(d / 90) + 1;
        const r = [d, 180 - d, d - 180, 360 - d][n - 1]!;
        const rangeTex = inRad ? "0 \\le \\theta < 2\\pi" : "0^\\circ \\le \\theta < 360^\\circ";
        const given = rng.bool()
          ? t(
              `The terminal side of an angle $\\theta$ in standard position meets the unit circle at $\\left(${sTex(x)}, ${sTex(y)}\\right)$.`,
              `标准位置下角 $\\theta$ 的终边与单位圆交于 $\\left(${sTex(x)}, ${sTex(y)}\\right)$。`,
            )
          : t(
              `An angle $\\theta$ has $\\cos \\theta = ${sTex(x)}$ and $\\sin \\theta = ${sTex(y)}$.`,
              `角 $\\theta$ 满足 $\\cos \\theta = ${sTex(x)}$，$\\sin \\theta = ${sTex(y)}$。`,
            );
        const prompt = t(
          `${given.en} Find $\\theta$ with $${rangeTex}$${inRad ? ", in radians" : ""}.`,
          `${given["zh-CN"]}求满足 $${rangeTex}$ 的 $\\theta$${inRad ? "（用弧度表示）" : ""}。`,
        );
        const line = [`${r}^\\circ`, `180^\\circ - ${r}^\\circ`, `180^\\circ + ${r}^\\circ`, `360^\\circ - ${r}^\\circ`][n - 1]!;
        const solution = both(
          `The sizes of the coordinates match the reference angle $${angTex(r, inRad)}$, and their signs put the terminal side in Quadrant ${roman[n]}. So`,
          `坐标的大小对应参考角 $${angTex(r, inRad)}$，符号说明终边在第${zhNumbers[n]}象限。所以`,
          `\\theta = ${line} = ${degTex(d)}${inRad ? ` = ${radTex(d)}` : ""}`,
        );
        const others = [r, 180 - r, 180 + r, 360 - r, 90 - r].filter((w) => w !== d);
        if (inRad) return piProblem(prompt, radTex(d), solution, others.map(radTex));
        return numberProblem({ prompt, answer: d, unit: "°", wrong: others, solution });
      },
    },
  ],
};

/** Term is one ratio of an angle in an expression. */
interface Term {
  readonly f: Fn;
  readonly d: number;
  readonly v: S;
}

/** randomTerm is a defined ratio of a special or quadrantal angle in [0°, 360°). */
function randomTerm(rng: Rng, fns: readonly Fn[], withQuadrantal = true): Term {
  for (;;) {
    const f = rng.pick(fns);
    const d = withQuadrantal && rng.bool(0.25) ? rng.pick([90, 180, 270]) : rng.pick(specials);
    const v = exact(f, d);
    if (v) return { f, d, v };
  }
}

/** coefTex writes a coefficient in front of a factor: "", "-", "3". */
const coefTex = (a: number) => (a === 1 ? "" : a === -1 ? "-" : String(a));

/** paren writes an exact number in parentheses. */
const paren = (s: S) => `\\left(${sTex(s)}\\right)`;

/** valuesLine lists the values of the terms of an expression. */
const valuesLine = (terms: readonly Term[], inRad: boolean) =>
  terms.map((x) => `${call(x.f, angTex(x.d, inRad))} = ${sTex(x.v)}`).join(", \\quad ");

/** productProblem evaluates a·f(A)·g(B) or f(A)/g(B). */
function productProblem(rng: Rng, fns: readonly Fn[]): Problem {
  const inRad = rng.bool();
  for (;;) {
    const [p, r] = [randomTerm(rng, fns), randomTerm(rng, fns)];
    if (p.v[0].isZero() || r.v[0].isZero()) continue;
    const [cp, cr] = [call(p.f, angTex(p.d, inRad)), call(r.f, angTex(r.d, inRad))];
    if (cp === cr) continue;
    const swap = (x: Term) => exact(cofunction[x.f], x.d);
    if (rng.bool(0.35)) {
      const answer = sDiv(p.v, r.v)!;
      const sp = swap(p);
      const sr = swap(r);
      const wrong = [sNeg(answer), sDiv(r.v, p.v)!, ...(sp && sr && !sr[0].isZero() ? [sDiv(sp, sr)!] : [])].map(sTex);
      const expr = `\\frac{${cp}}{${cr}}`;
      return radicalProblem({
        prompt: t(`Evaluate $${expr}$. Give the exact answer in simplest radical form.`, `求 $${expr}$ 的精确值，结果化为最简根式。`),
        answer: [answer[0], answer[1]],
        wrong,
        solution: both(
          "Replace each ratio by its exact value, then simplify, rationalizing the denominator:",
          "把每个三角比换成精确值，再化简并将分母有理化：",
          valuesLine([p, r], inRad),
          `${expr} = \\frac{${sTex(p.v)}}{${sTex(r.v)}} = ${sTex(answer)}`,
        ),
      });
    }
    const a = rng.pick([1, 1, 2, 3, 4, 6, -1, -2]);
    const answer = sScale(a, sMul(p.v, r.v));
    const sp = swap(p);
    const sr = swap(r);
    const wrong = [sNeg(answer), ...(sp && sr ? [sScale(a, sMul(sp, sr))] : []), sMul(p.v, r.v)].map(sTex);
    const expr = `${coefTex(a)}${cp} ${cr}`;
    return radicalProblem({
      prompt: t(`Evaluate $${expr}$. Give the exact answer in simplest radical form.`, `求 $${expr}$ 的精确值，结果化为最简根式。`),
      answer: [answer[0], answer[1]],
      wrong,
      solution: both(
        "Replace each ratio by its exact value, then multiply:",
        "把每个三角比换成精确值，再相乘：",
        valuesLine([p, r], inRad),
        `${expr} = ${coefTex(a)}${paren(p.v)}${paren(r.v)} = ${sTex(answer)}`,
      ),
    });
  }
}

/** evaluatingTrigonometricExpressions evaluates expressions in exact ratios of special and quadrantal angles. */
export const evaluatingTrigonometricExpressions: TopicDef = {
  id: "evaluating-trigonometric-expressions",
  title: t("Evaluating Trigonometric Expressions", "求三角式的值"),
  summary: t(
    "Evaluate products, quotients, sums and squares of exact trigonometric ratios of special and quadrantal angles.",
    "求特殊角与象限角的精确三角比的积、商、和与平方。",
  ),
  prerequisites: [
    "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
    "finding-trigonometric-ratios-of-quadrantal-angles",
  ],
  encompasses: [
    { topic: "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle", weight: 0.6 },
    { topic: "finding-trigonometric-ratios-of-quadrantal-angles", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.3"],
  knowledgePoints: [
    {
      id: "products-and-quotients-of-ratios",
      title: t("Products and quotients", "积与商"),
      explanation: t(
        "Replace each ratio by its exact value, multiply or divide, and give the result in simplest radical form, with no radical in the denominator:\n\n$$4\\sin 60^\\circ \\cos 45^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{2}}{2} = \\sqrt{6}, \\qquad \\frac{\\cos \\frac{\\pi}{4}}{\\sin \\frac{\\pi}{3}} = \\frac{\\sqrt{2}/2}{\\sqrt{3}/2} = \\frac{\\sqrt{2}}{\\sqrt{3}} = \\frac{\\sqrt{6}}{3}.$$",
        "把每个三角比换成精确值，相乘或相除，结果化为最简根式，分母中不含根号：\n\n$$4\\sin 60^\\circ \\cos 45^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{2}}{2} = \\sqrt{6}, \\qquad \\frac{\\cos \\frac{\\pi}{4}}{\\sin \\frac{\\pi}{3}} = \\frac{\\sqrt{2}/2}{\\sqrt{3}/2} = \\frac{\\sqrt{2}}{\\sqrt{3}} = \\frac{\\sqrt{6}}{3}.$$",
      ),
      generate: (rng) => productProblem(rng, ["sin", "cos", "tan"]),
    },
    {
      id: "sums-and-differences-of-ratios",
      title: t("Sums and differences", "和与差"),
      explanation: t(
        "Replace each ratio by its value and combine like terms: rational numbers with rational numbers, multiples of the same square root with each other.\n\n$$2\\sin 150^\\circ + 3\\tan 225^\\circ = 2 \\cdot \\frac{1}{2} + 3 \\cdot 1 = 4, \\qquad \\sin \\frac{2\\pi}{3} - 2\\cos \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2} - \\sqrt{3} = -\\frac{\\sqrt{3}}{2}.$$",
        "把每个三角比换成它的值，再合并同类项：有理数与有理数合并，同一个平方根的倍数相互合并。\n\n$$2\\sin 150^\\circ + 3\\tan 225^\\circ = 2 \\cdot \\frac{1}{2} + 3 \\cdot 1 = 4, \\qquad \\sin \\frac{2\\pi}{3} - 2\\cos \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2} - \\sqrt{3} = -\\frac{\\sqrt{3}}{2}.$$",
      ),
      generate(rng) {
        const inRad = rng.bool();
        for (;;) {
          const [p, r] = [randomTerm(rng, ["sin", "cos", "tan"]), randomTerm(rng, ["sin", "cos", "tan"])];
          const [a, b] = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
          const [cp, cr] = [call(p.f, angTex(p.d, inRad)), call(r.f, angTex(r.d, inRad))];
          if (cp === cr || p.v[0].isZero() || r.v[0].isZero()) continue;
          const answer = sAdd(sScale(a, p.v), sScale(b, r.v));
          if (!answer) continue;
          const minus = sAdd(sScale(a, p.v), sScale(-b, r.v));
          const flipped = sAdd(sScale(-a, p.v), sScale(b, r.v));
          const expr = `${coefTex(a)}${cp} ${b > 0 ? "+" : "-"} ${coefTex(Math.abs(b))}${cr}`;
          const timesTex = (c: number, s: S) => `${c === 1 ? "" : c === -1 ? "-" : `${c} \\cdot `}${paren(s)}`;
          return radicalProblem({
            prompt: t(`Evaluate $${expr}$. Give the exact answer.`, `求 $${expr}$ 的精确值。`),
            answer: [answer[0], answer[1]],
            wrong: [sNeg(answer), ...(minus ? [minus] : []), ...(flipped ? [flipped] : [])].map(sTex),
            solution: both(
              "Replace each ratio by its exact value, then combine like terms:",
              "把每个三角比换成精确值，再合并同类项：",
              valuesLine([p, r], inRad),
              `${expr} = ${timesTex(a, p.v)} ${b > 0 ? "+" : "-"} ${timesTex(Math.abs(b), r.v)} = ${sTex(answer)}`,
            ),
          });
        }
      },
    },
    {
      id: "squares-of-ratios",
      title: t("Squares of ratios", "三角比的平方"),
      explanation: t(
        "The notation $\\sin^2 \\theta$ means $(\\sin \\theta)^2$. Square the value, including its sign:\n\n$$\\sin^2 \\frac{\\pi}{3} + 2\\cos^2 135^\\circ = \\left(\\frac{\\sqrt{3}}{2}\\right)^2 + 2\\left(-\\frac{\\sqrt{2}}{2}\\right)^2 = \\frac{3}{4} + 2 \\cdot \\frac{2}{4} = \\frac{7}{4}.$$\n\nThe square of every exact value here is rational, so the result is a rational number.",
        "记号 $\\sin^2 \\theta$ 表示 $(\\sin \\theta)^2$。把值连同符号一起平方：\n\n$$\\sin^2 \\frac{\\pi}{3} + 2\\cos^2 135^\\circ = \\left(\\frac{\\sqrt{3}}{2}\\right)^2 + 2\\left(-\\frac{\\sqrt{2}}{2}\\right)^2 = \\frac{3}{4} + 2 \\cdot \\frac{2}{4} = \\frac{7}{4}.$$\n\n这里每个精确值的平方都是有理数，所以结果是有理数。",
      ),
      generate(rng) {
        const inRad = rng.bool();
        for (;;) {
          const [p, r] = [randomTerm(rng, ["sin", "cos", "tan"]), randomTerm(rng, ["sin", "cos", "tan"])];
          const [a, b] = [rng.pick([1, 1, 2, 3, 4]), rng.nonZero(-4, 4)];
          const [cp, cr] = [angTex(p.d, inRad), angTex(r.d, inRad)];
          if (p.f === r.f && p.d === r.d) continue;
          const [sp, sr] = [sSquare(p.v), sSquare(r.v)];
          const answer = sp.mul(Q.of(a)).add(sr.mul(Q.of(b)));
          const sq = (f: Fn, tex: string) => `\\${f}^2 ${arg(tex)}`;
          const expr = `${coefTex(a)}${sq(p.f, cp)} ${b > 0 ? "+" : "-"} ${coefTex(Math.abs(b))}${sq(r.f, cr)}`;
          const unsquared = p.v[0].mul(Q.of(a)).mul(Q.of(p.v[1] === 1 ? 1 : 0));
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer,
            wrong: [sp.mul(Q.of(a)).sub(sr.mul(Q.of(b))), sp.add(sr), unsquared.add(sr.mul(Q.of(b)))],
            solution: both(
              "Square each exact value, then combine:",
              "把每个精确值平方，再合并：",
              valuesLine([p, r], inRad),
              `${expr} = ${coefTex(a)}${paren(p.v)}^2 ${b > 0 ? "+" : "-"} ${coefTex(Math.abs(b))}${paren(r.v)}^2 = ${answer.toLatex()}`,
            ),
          });
        }
      },
    },
  ],
};

/** largeSpecial is a special angle in degrees outside [0°, 360°): a multiple of 30° or 45° plus or minus whole turns. */
function largeSpecial(rng: Rng): number {
  const turns = rng.bool(0.45) ? rng.int(-2, -1) : rng.int(1, 3);
  return rng.pick(specials) + 360 * turns;
}

/** furtherExtensionsOfTheSpecialTrigonometricRatios finds the reciprocal ratios of special angles and the ratios of special angles beyond one turn. */
export const furtherExtensionsOfTheSpecialTrigonometricRatios: TopicDef = {
  id: "further-extensions-of-the-special-trigonometric-ratios",
  title: t("Further Extensions of the Special Trigonometric Ratios", "特殊角三角比的进一步推广"),
  summary: t(
    "Find the exact cosecant, secant and cotangent of special angles, and the exact ratios of negative special angles and special angles beyond one turn.",
    "求特殊角的余割、正割、余切的精确值，以及负的特殊角和超过一圈的特殊角的精确三角比。",
  ),
  prerequisites: [
    "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
    "extending-the-trigonometric-ratios-to-large-angles",
  ],
  encompasses: [
    { topic: "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle", weight: 0.6 },
    { topic: "extending-the-trigonometric-ratios-to-large-angles", weight: 0.4 },
    { topic: "the-reciprocal-trigonometric-ratios", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.A.2", "CCSS.HSF.TF.A.3"],
  knowledgePoints: [
    {
      id: "reciprocal-ratios-of-special-angles",
      title: t("Reciprocal ratios of special angles", "特殊角的倒数三角比"),
      explanation: t(
        "Take the point $(x, y)$ on the unit circle and use $\\csc \\theta = \\frac{1}{y}$, $\\sec \\theta = \\frac{1}{x}$, $\\cot \\theta = \\frac{x}{y}$, then rationalize. For $\\frac{7\\pi}{6}$, in Quadrant III with reference angle $\\frac{\\pi}{6}$, the point is $\\left(-\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$:\n\n$$\\sec \\frac{7\\pi}{6} = \\frac{1}{-\\frac{\\sqrt{3}}{2}} = -\\frac{2}{\\sqrt{3}} = -\\frac{2\\sqrt{3}}{3}, \\qquad \\csc \\frac{7\\pi}{6} = \\frac{1}{-\\frac{1}{2}} = -2.$$",
        "取单位圆上的点 $(x, y)$，用 $\\csc \\theta = \\frac{1}{y}$、$\\sec \\theta = \\frac{1}{x}$、$\\cot \\theta = \\frac{x}{y}$，再将分母有理化。对 $\\frac{7\\pi}{6}$，在第三象限，参考角 $\\frac{\\pi}{6}$，交点为 $\\left(-\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$：\n\n$$\\sec \\frac{7\\pi}{6} = \\frac{1}{-\\frac{\\sqrt{3}}{2}} = -\\frac{2}{\\sqrt{3}} = -\\frac{2\\sqrt{3}}{3}, \\qquad \\csc \\frac{7\\pi}{6} = \\frac{1}{-\\frac{1}{2}} = -2.$$",
      ),
      generate: (rng) => valueProblem(rng.pick<Fn>(["csc", "sec", "cot"]), rng.pick(specials), rng.bool()),
    },
    {
      id: "special-angles-outside-the-standard-range",
      title: t("Special angles outside the standard range", "标准范围以外的特殊角"),
      explanation: t(
        "Remove full turns first, then proceed as before. For $\\tan(-\\frac{5\\pi}{3})$: $-\\frac{5\\pi}{3} + 2\\pi = \\frac{\\pi}{3}$, in Quadrant I, at $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$, so $\\tan(-\\frac{5\\pi}{3}) = \\sqrt{3}$. For $\\cos 855^\\circ$: $855^\\circ - 2 \\cdot 360^\\circ = 135^\\circ$, so $\\cos 855^\\circ = -\\frac{\\sqrt{2}}{2}$.",
        "先去掉整圈，再照前面的方法做。对 $\\tan(-\\frac{5\\pi}{3})$：$-\\frac{5\\pi}{3} + 2\\pi = \\frac{\\pi}{3}$，在第一象限，交点为 $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$，所以 $\\tan(-\\frac{5\\pi}{3}) = \\sqrt{3}$。对 $\\cos 855^\\circ$：$855^\\circ - 2 \\cdot 360^\\circ = 135^\\circ$，所以 $\\cos 855^\\circ = -\\frac{\\sqrt{2}}{2}$。",
      ),
      generate: (rng) => valueProblem(rng.pick(allSixes), largeSpecial(rng), rng.bool()),
    },
    {
      id: "expressions-with-all-six-ratios",
      title: t("Expressions with all six ratios", "含六个三角比的式子"),
      explanation: t(
        "Products and quotients of any of the six ratios work the same way: replace each by its exact value and simplify.\n\n$$\\sec \\frac{\\pi}{4} \\cot 120^\\circ = \\sqrt{2} \\cdot \\left(-\\frac{\\sqrt{3}}{3}\\right) = -\\frac{\\sqrt{6}}{3}.$$",
        "六个三角比中任意几个的积与商，做法相同：把每个换成精确值再化简。\n\n$$\\sec \\frac{\\pi}{4} \\cot 120^\\circ = \\sqrt{2} \\cdot \\left(-\\frac{\\sqrt{3}}{3}\\right) = -\\frac{\\sqrt{6}}{3}.$$",
      ),
      generate: (rng) => productProblem(rng, allSixes),
    },
  ],
};

// ---------------------------------------------------------------------------
// Graphs
// ---------------------------------------------------------------------------

// On the graphs, x is measured in units u of π/2: x = uπ/2.

/** Kind is a key feature of a trigonometric graph. */
type Kind = "zero" | "max" | "min" | "asymptote";

/** Feature is a family of key points x = (off + kP)·π/2 for integers k. */
interface Feature {
  readonly kind: Kind;
  readonly P: number;
  readonly off: number;
}

/** FnData describes a trigonometric function on the graph: period in units of π/2, parity and key features. */
interface FnData {
  readonly period: number;
  readonly even: boolean;
  readonly features: readonly Feature[];
  /** pieces are its intervals of monotony over one period, in units of π/4. */
  readonly pieces: readonly (readonly [number, number, boolean])[];
}

const fnData: Record<Fn, FnData> = {
  sin: {
    period: 4,
    even: false,
    features: [
      { kind: "zero", P: 2, off: 0 },
      { kind: "max", P: 4, off: 1 },
      { kind: "min", P: 4, off: 3 },
    ],
    pieces: [
      [-2, 2, true],
      [2, 6, false],
    ],
  },
  cos: {
    period: 4,
    even: true,
    features: [
      { kind: "zero", P: 2, off: 1 },
      { kind: "max", P: 4, off: 0 },
      { kind: "min", P: 4, off: 2 },
    ],
    pieces: [
      [0, 4, false],
      [4, 8, true],
    ],
  },
  tan: {
    period: 2,
    even: false,
    features: [
      { kind: "zero", P: 2, off: 0 },
      { kind: "asymptote", P: 2, off: 1 },
    ],
    pieces: [[-2, 2, true]],
  },
  cot: {
    period: 2,
    even: false,
    features: [
      { kind: "zero", P: 2, off: 1 },
      { kind: "asymptote", P: 2, off: 0 },
    ],
    pieces: [[0, 4, false]],
  },
  sec: {
    period: 4,
    even: true,
    features: [
      { kind: "asymptote", P: 2, off: 1 },
      { kind: "min", P: 4, off: 0 },
      { kind: "max", P: 4, off: 2 },
    ],
    pieces: [
      [0, 2, true],
      [2, 4, true],
      [4, 6, false],
      [6, 8, false],
    ],
  },
  csc: {
    period: 4,
    even: false,
    features: [
      { kind: "asymptote", P: 2, off: 0 },
      { kind: "min", P: 4, off: 1 },
      { kind: "max", P: 4, off: 3 },
    ],
    pieces: [
      [-2, 0, false],
      [0, 2, false],
      [2, 4, true],
      [4, 6, true],
    ],
  },
};

/** uTex writes x = uπ/2 in LaTeX. */
const uTex = (u: number) => piTex(q(u, 2));

/** uLabel writes x = uπ/2 as plain text for a figure: "π/2", "−3π/2", "2π". */
function uLabel(u: number): string {
  const v = q(u, 2);
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "π" : `${n}π`;
  return `${v.sign() < 0 ? "−" : ""}${v.d === 1n ? top : `${top}/2`}`;
}

/** has tells whether u is in the family of a feature. */
const has = (ft: Feature, u: number) => mod(u - ft.off, ft.P) === 0;

/** featuresOf lists the members of a family in [p, q]. */
function membersIn(ft: Feature, p: number, qq: number): number[] {
  const out: number[] = [];
  for (let u = Math.ceil(p); u <= qq; u++) if (has(ft, u)) out.push(u);
  return out;
}

/** firstFrom is the member of a family in [a, a + P). */
const firstFrom = (ft: Feature, a: number) => a + mod(ft.off - a, ft.P);

const singular = (f: Fn, u: number) => fnData[f].features.some((ft) => ft.kind === "asymptote" && has(ft, u));

/** valueAt evaluates a trigonometric function of x in radians. */
function valueAt(f: Fn, x: number): number {
  const [s, c] = [Math.sin(x), Math.cos(x)];
  return { sin: s, cos: c, tan: s / c, cot: c / s, sec: 1 / c, csc: 1 / s }[f];
}

const round = (x: number) => Math.round(x * 100) / 100;

/** graphSvg draws y = f(x) for x from u0·π/2 to (u0 + w)·π/2, with dashed asymptotes and the axes numbered along the edges. */
function graphSvg(f: Fn, u0: number, w: number): string {
  const Y = f === "sin" || f === "cos" ? 2 : 4;
  const view = { xMin: u0, xMax: u0 + w, yMin: -Y, yMax: Y, labelEvery: 1000 };
  const g = (u: number) => valueAt(f, (u * Math.PI) / 2);
  const asym: number[] = [];
  for (let u = Math.ceil(u0); u <= u0 + w; u++) if (singular(f, u)) asym.push(u);
  const marks: PlaneMark[] = asym.filter((u) => u !== 0).map((u) => ({ kind: "line", a: [u, 0], b: [u, 1], dashed: true }));
  const cuts = [u0, ...asym.filter((u) => u > u0 && u < u0 + w), u0 + w];
  for (let i = 0; i + 1 < cuts.length; i++) {
    const [lo, hi] = [cuts[i]!, cuts[i + 1]!];
    marks.push({ kind: "curve", f: g, from: singular(f, lo) ? lo + 1e-4 : lo, to: singular(f, hi) ? hi - 1e-4 : hi, accent: true });
  }
  const svg = plane(view, marks);
  const s = Math.min(260 / w, 260 / (2 * Y));
  const sx = (u: number) => round(22 + (u - u0) * s);
  const sy = (y: number) => round(22 + (Y - y) * s);
  let labels = `<g stroke="none" fill="currentColor" font-size="10">`;
  for (let u = Math.ceil(u0); u <= u0 + w; u++) {
    if (u !== 0) labels += `<text x="${sx(u)}" y="${round(sy(-Y) + 13)}">${uLabel(u)}</text>`;
  }
  for (let y = -Y; y <= Y; y++) {
    if (y !== 0)
      labels += `<text x="${round(sx(u0) - 6)}" y="${round(sy(y) + 3.5)}" text-anchor="end">${String(y).replace("-", "−")}</text>`;
  }
  labels += "</g>";
  return svg.replace(/<\/svg>$/, `${labels}</svg>`);
}

/** listEn joins labels: "a, b and c". */
function listEn(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** graphFigure draws y = f(x) and describes its key points without naming it. */
function graphFigure(f: Fn, u0: number, w: number): Figure {
  const [lo, hi] = [u0, u0 + w];
  const at = (kind: Kind) =>
    fnData[f].features.filter((ft) => ft.kind === kind).flatMap((ft) => membersIn(ft, lo, hi).map((u) => (u === 0 ? "0" : uLabel(u))));
  const zeros = at("zero");
  const asym = at("asymptote");
  const ups = at(f === "sec" || f === "csc" ? "min" : "max");
  const downs = at(f === "sec" || f === "csc" ? "max" : "min");
  const en: string[] = [`The graph of a function for x from ${uLabel(lo)} to ${uLabel(hi)}, with the x-axis marked every π/2`];
  const zh: string[] = [`一个函数在 x 从 ${uLabel(lo)} 到 ${uLabel(hi)} 的图象，x 轴每隔 π/2 标一个刻度`];
  if (asym.length) {
    en.push(`vertical asymptotes at x = ${listEn(asym)}`);
    zh.push(`竖直渐近线为 x = ${asym.join("、")}`);
  }
  if (zeros.length) {
    en.push(`crossing the x-axis at x = ${listEn(zeros)}`);
    zh.push(`与 x 轴交于 x = ${zeros.join("、")}`);
  }
  if (ups.length) {
    en.push(`y = 1 at x = ${listEn(ups)}`);
    zh.push(`在 x = ${ups.join("、")} 处 y = 1`);
  }
  if (downs.length) {
    en.push(`y = −1 at x = ${listEn(downs)}`);
    zh.push(`在 x = ${downs.join("、")} 处 y = −1`);
  }
  return { svg: graphSvg(f, u0, w), alt: t(`${en.join("; ")}.`, `${zh.join("；")}。`) };
}

/** graphSolution says how to recognize the graph of f. */
const graphSolution: Record<Fn, Text> = {
  sin: t(
    "The graph passes through the origin and rises to $y = 1$ at $x = \\frac{\\pi}{2}$. That is $y = \\sin x$: $\\sin 0 = 0$ and $\\sin \\frac{\\pi}{2} = 1$. The graph of $y = \\cos x$ would pass through $(0, 1)$ instead.",
    "图象经过原点，并在 $x = \\frac{\\pi}{2}$ 处升到 $y = 1$。这是 $y = \\sin x$：$\\sin 0 = 0$，$\\sin \\frac{\\pi}{2} = 1$。而 $y = \\cos x$ 的图象会经过 $(0, 1)$。",
  ),
  cos: t(
    "The graph has its highest point $(0, 1)$ on the $y$-axis and crosses the $x$-axis at $x = \\pm\\frac{\\pi}{2}$. That is $y = \\cos x$: $\\cos 0 = 1$. The graph of $y = \\sin x$ would pass through the origin instead.",
    "图象的最高点 $(0, 1)$ 在 $y$ 轴上，并在 $x = \\pm\\frac{\\pi}{2}$ 处与 $x$ 轴相交。这是 $y = \\cos x$：$\\cos 0 = 1$。而 $y = \\sin x$ 的图象会经过原点。",
  ),
  tan: t(
    "The graph passes through the origin and rises from left to right between the asymptotes $x = -\\frac{\\pi}{2}$ and $x = \\frac{\\pi}{2}$. That is $y = \\tan x$: $\\tan 0 = 0$, and $\\tan x = \\frac{\\sin x}{\\cos x}$ is not defined where $\\cos x = 0$. The graph of $y = \\cot x$ has the $y$-axis as an asymptote and falls.",
    "图象经过原点，在渐近线 $x = -\\frac{\\pi}{2}$ 与 $x = \\frac{\\pi}{2}$ 之间从左到右上升。这是 $y = \\tan x$：$\\tan 0 = 0$，且 $\\tan x = \\frac{\\sin x}{\\cos x}$ 在 $\\cos x = 0$ 处无定义。$y = \\cot x$ 的图象以 $y$ 轴为渐近线，并且下降。",
  ),
  cot: t(
    "The $y$-axis is an asymptote, and each branch falls from left to right, crossing the $x$-axis at $x = \\pm\\frac{\\pi}{2}$. That is $y = \\cot x = \\frac{\\cos x}{\\sin x}$, not defined where $\\sin x = 0$, with $\\cot \\frac{\\pi}{2} = 0$. The graph of $y = \\tan x$ passes through the origin and rises.",
    "$y$ 轴是渐近线，每一支从左到右下降，并在 $x = \\pm\\frac{\\pi}{2}$ 处与 $x$ 轴相交。这是 $y = \\cot x = \\frac{\\cos x}{\\sin x}$，在 $\\sin x = 0$ 处无定义，且 $\\cot \\frac{\\pi}{2} = 0$。$y = \\tan x$ 的图象经过原点并且上升。",
  ),
  sec: t(
    "The graph has a turning point at $(0, 1)$ and asymptotes at $x = \\pm\\frac{\\pi}{2}$, and it never comes between $y = -1$ and $y = 1$. That is $y = \\sec x = \\frac{1}{\\cos x}$: $\\sec 0 = 1$, not defined where $\\cos x = 0$. The graph of $y = \\csc x$ has the $y$-axis as an asymptote.",
    "图象在 $(0, 1)$ 处有一个转折点，渐近线为 $x = \\pm\\frac{\\pi}{2}$，并且从不进入 $y = -1$ 与 $y = 1$ 之间。这是 $y = \\sec x = \\frac{1}{\\cos x}$：$\\sec 0 = 1$，在 $\\cos x = 0$ 处无定义。$y = \\csc x$ 的图象以 $y$ 轴为渐近线。",
  ),
  csc: t(
    "The $y$-axis is an asymptote and the graph has a turning point at $\\left(\\frac{\\pi}{2}, 1\\right)$, never coming between $y = -1$ and $y = 1$. That is $y = \\csc x = \\frac{1}{\\sin x}$: not defined where $\\sin x = 0$, with $\\csc \\frac{\\pi}{2} = 1$. The graph of $y = \\sec x$ has a turning point at $(0, 1)$ instead.",
    "$y$ 轴是渐近线，图象在 $\\left(\\frac{\\pi}{2}, 1\\right)$ 处有转折点，并且从不进入 $y = -1$ 与 $y = 1$ 之间。这是 $y = \\csc x = \\frac{1}{\\sin x}$：在 $\\sin x = 0$ 处无定义，且 $\\csc \\frac{\\pi}{2} = 1$。$y = \\sec x$ 的图象则在 $(0, 1)$ 处有转折点。",
  ),
};

/** identifyProblem shows the graph of f in a random window and asks which function it is. */
function identifyProblem(rng: Rng, f: Fn, options: readonly Fn[]): Problem {
  const w = rng.int(6, 8);
  const u0 = rng.int(-w + 1, -1);
  return {
    ...oneOf(
      rng,
      t("Which function is graphed?", "图中是哪个函数的图象？"),
      same(`$y = \\${f} x$`),
      options.filter((g) => g !== f).map((g) => same(`$y = \\${g} x$`)),
      graphSolution[f],
    ),
    figure: graphFigure(f, u0, w),
  };
}

/** pointOnGraphProblem asks for the y-coordinate of the point of y = f(x) at a special angle in [−2π, 2π]. */
function pointOnGraphProblem(rng: Rng, fns: readonly Fn[]): Problem {
  for (;;) {
    const f = rng.pick(fns);
    const n = rng.pick([1, 2, 3, 4, 6]);
    const k = rng.int(-2 * n, 2 * n);
    if (gcd(Math.abs(k), n) !== 1 && !(k === 0 && n === 1)) continue;
    const d = (180 * k) / n;
    if (!exact(f, d)) continue;
    const x = radTex(d);
    return valueProblem(
      f,
      d,
      true,
      t(
        `The point $\\left(${x}, b\\right)$ lies on the graph of $y = \\${f} x$. Find the exact value of $b$.`,
        `点 $\\left(${x}, b\\right)$ 在 $y = \\${f} x$ 的图象上。求 $b$ 的精确值。`,
      ),
    );
  }
}

/** kindWords name the features in the counting questions. */
function countPrompt(f: Fn, kind: Kind, p: string, qq: string): Text {
  const range = `${p} \\le x \\le ${qq}`;
  const y = `y = \\${f} x`;
  switch (kind) {
    case "zero":
      return t(
        `How many $x$-intercepts does the graph of $${y}$ have for $${range}$?`,
        `$${y}$ 的图象在 $${range}$ 内与 $x$ 轴有几个交点？`,
      );
    case "asymptote":
      return t(
        `How many vertical asymptotes does the graph of $${y}$ have for $${range}$?`,
        `$${y}$ 的图象在 $${range}$ 内有几条竖直渐近线？`,
      );
    default: {
      const v = (kind === "max") === (f === "sin" || f === "cos") ? "1" : "-1";
      return t(
        `At how many points with $${range}$ does the graph of $${y}$ have $y = ${v}$?`,
        `$${y}$ 的图象在 $${range}$ 内有几个点满足 $y = ${v}$？`,
      );
    }
  }
}

/** familyTex writes the family of a feature: "\frac{\pi}{2} + k\pi", "2k\pi". */
function familyTex(ft: Feature): string {
  const step = ft.P === 2 ? "k\\pi" : "2k\\pi";
  return ft.off === 0 ? step : `${uTex(ft.off)} + ${step}`;
}

const kindNames: Record<Kind, Text> = {
  zero: t("$x$-intercepts", "与 $x$ 轴的交点"),
  asymptote: t("vertical asymptotes", "竖直渐近线"),
  max: t("points with $y = 1$", "满足 $y = 1$ 的点"),
  min: t("points with $y = -1$", "满足 $y = -1$ 的点"),
};

/** countProblem asks how many key points of a kind the graph of f has in [p, q]. */
function countProblem(rng: Rng, fns: readonly Fn[]): Problem {
  const f = rng.pick(fns);
  const ft = rng.pick(fnData[f].features);
  const p = rng.int(-8, 4);
  const qq = p + rng.int(2, 10);
  const found = membersIn(ft, p, qq);
  const others = fnData[f].features.filter((g) => g !== ft).map((g) => membersIn(g, p, qq).length);
  // For sec and csc the local minimum has y = 1, and the local maximum y = −1.
  const name =
    ft.kind === "max" || ft.kind === "min"
      ? kindNames[(ft.kind === "max") === (f === "sin" || f === "cos") ? "max" : "min"]
      : kindNames[ft.kind];
  const list = found.map(uTex).join(", ");
  return numberProblem({
    prompt: countPrompt(f, ft.kind, uTex(p), uTex(qq)),
    answer: found.length,
    wrong: [found.length + 1, Math.max(0, found.length - 1), ...others],
    solution: t(
      `The ${name.en} of the graph of $y = \\${f} x$ are at $x = ${familyTex(ft)}$ for integers $k$. ${found.length ? `Those with $${uTex(p)} \\le x \\le ${uTex(qq)}$ are $x = ${list}$, so there ${found.length === 1 ? "is $1$" : `are $${found.length}$`}.` : `None of them lies in $${uTex(p)} \\le x \\le ${uTex(qq)}$, so there are $0$.`}`,
      `$y = \\${f} x$ 的图象的${name["zh-CN"]}位于 $x = ${familyTex(ft)}$（$k$ 为整数）。${found.length ? `其中满足 $${uTex(p)} \\le x \\le ${uTex(qq)}$ 的是 $x = ${list}$，共 $${found.length}$ 个。` : `其中没有一个在 $${uTex(p)} \\le x \\le ${uTex(qq)}$ 内，所以是 $0$ 个。`}`,
    ),
  });
}

/** graphingSineAndCosine draws the sine and cosine waves from the unit circle. */
export const graphingSineAndCosine: TopicDef = {
  id: "graphing-sine-and-cosine",
  title: t("Graphing Sine and Cosine", "画正弦与余弦函数的图象"),
  summary: t(
    "Graph y = sin x and y = cos x from the unit circle, recognize the two waves, and find their x-intercepts, highest and lowest points.",
    "由单位圆画出 y = sin x 和 y = cos x 的图象，辨认这两条波形曲线，并求它们与 x 轴的交点、最高点和最低点。",
  ),
  prerequisites: [
    "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle",
    "finding-trigonometric-ratios-of-quadrantal-angles",
    "periodic-functions",
  ],
  encompasses: [
    { topic: "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle", weight: 0.3 },
    { topic: "finding-trigonometric-ratios-of-quadrantal-angles", weight: 0.3 },
    { topic: "periodic-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7e", "CCSS.HSF.TF.A.2"],
  knowledgePoints: [
    {
      id: "points-on-the-sine-and-cosine-graphs",
      title: t("Points on the graphs", "图象上的点"),
      explanation: t(
        "As the angle $x$ (in radians) turns, the point $(\\cos x, \\sin x)$ moves around the unit circle. Plotting its height $\\sin x$ against $x$ gives the graph of $y = \\sin x$; plotting $\\cos x$ gives $y = \\cos x$. Each point of the graph comes from a value on the unit circle:\n\n| $x$ | $0$ | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{2}$ | $\\frac{5\\pi}{6}$ | $\\pi$ | $\\frac{3\\pi}{2}$ | $2\\pi$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $\\sin x$ | $0$ | $\\frac{1}{2}$ | $1$ | $\\frac{1}{2}$ | $0$ | $-1$ | $0$ |\n| $\\cos x$ | $1$ | $\\frac{\\sqrt{3}}{2}$ | $0$ | $-\\frac{\\sqrt{3}}{2}$ | $-1$ | $0$ | $1$ |\n\nFor example, $\\left(\\frac{5\\pi}{6}, \\frac{1}{2}\\right)$ is on the graph of $y = \\sin x$. The figure shows $y = \\sin x$.",
        "角 $x$（弧度）转动时，点 $(\\cos x, \\sin x)$ 在单位圆上移动。把它的高度 $\\sin x$ 对 $x$ 描点，得到 $y = \\sin x$ 的图象；描 $\\cos x$ 得到 $y = \\cos x$。图象上的每个点都来自单位圆上的一个值：\n\n| $x$ | $0$ | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{2}$ | $\\frac{5\\pi}{6}$ | $\\pi$ | $\\frac{3\\pi}{2}$ | $2\\pi$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $\\sin x$ | $0$ | $\\frac{1}{2}$ | $1$ | $\\frac{1}{2}$ | $0$ | $-1$ | $0$ |\n| $\\cos x$ | $1$ | $\\frac{\\sqrt{3}}{2}$ | $0$ | $-\\frac{\\sqrt{3}}{2}$ | $-1$ | $0$ | $1$ |\n\n例如，$\\left(\\frac{5\\pi}{6}, \\frac{1}{2}\\right)$ 在 $y = \\sin x$ 的图象上。图中是 $y = \\sin x$。",
      ),
      figure: graphFigure("sin", -4, 8),
      generate: (rng) => pointOnGraphProblem(rng, ["sin", "cos"]),
    },
    {
      id: "recognizing-the-sine-and-cosine-graphs",
      title: t("Recognizing the graphs", "辨认图象"),
      explanation: t(
        "Both graphs are waves between $y = -1$ and $y = 1$ that repeat every $2\\pi$, and the graph of $y = \\cos x$ is the graph of $y = \\sin x$ shifted left by $\\frac{\\pi}{2}$. Tell them apart at $x = 0$: $y = \\sin x$ passes through the origin, rising, while $y = \\cos x$ is at its highest point $(0, 1)$. The figure shows $y = \\cos x$.",
        "两个图象都是在 $y = -1$ 与 $y = 1$ 之间、每隔 $2\\pi$ 重复的波形，$y = \\cos x$ 的图象是把 $y = \\sin x$ 的图象向左平移 $\\frac{\\pi}{2}$。在 $x = 0$ 处区分它们：$y = \\sin x$ 经过原点并且上升，$y = \\cos x$ 则在最高点 $(0, 1)$。图中是 $y = \\cos x$。",
      ),
      figure: graphFigure("cos", -4, 8),
      generate: (rng) => identifyProblem(rng, rng.pick<Fn>(["sin", "cos"]), ["sin", "cos"]),
    },
    {
      id: "key-points-of-the-sine-and-cosine-graphs",
      title: t("Key points over an interval", "区间上的关键点"),
      explanation: t(
        "The key points repeat with the period $2\\pi$, and the $x$-intercepts every $\\pi$:\n\n| | $x$-intercepts | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sin x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n| $y = \\cos x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n\nfor integers $k$. To count them on an interval, list the members of the family that lie in it. For $y = \\cos x$ on $-\\pi \\le x \\le 2\\pi$, the $x$-intercepts are $-\\frac{\\pi}{2}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}$: three of them.",
        "关键点以周期 $2\\pi$ 重复，与 $x$ 轴的交点每隔 $\\pi$ 出现一次：\n\n| | 与 $x$ 轴的交点 | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sin x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n| $y = \\cos x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n\n其中 $k$ 为整数。要数出区间上的个数，就列出这一族中落在区间内的值。对 $y = \\cos x$ 在 $-\\pi \\le x \\le 2\\pi$ 上，与 $x$ 轴的交点为 $-\\frac{\\pi}{2}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}$，共三个。",
      ),
      keyPrerequisites: ["periodic-functions"],
      generate: (rng) => countProblem(rng, ["sin", "cos"]),
    },
  ],
};

/** graphingTangentAndCotangent draws the branches of tangent and cotangent between their asymptotes. */
export const graphingTangentAndCotangent: TopicDef = {
  id: "graphing-tangent-and-cotangent",
  title: t("Graphing Tangent and Cotangent", "画正切与余切函数的图象"),
  summary: t(
    "Graph y = tan x and y = cot x with their vertical asymptotes, recognize them, and find their x-intercepts and asymptotes.",
    "画出带竖直渐近线的 y = tan x 和 y = cot x 的图象，辨认它们，并求它们与 x 轴的交点和渐近线。",
  ),
  prerequisites: ["graphing-sine-and-cosine", "further-extensions-of-the-special-trigonometric-ratios"],
  encompasses: [
    { topic: "graphing-sine-and-cosine", weight: 0.3 },
    { topic: "further-extensions-of-the-special-trigonometric-ratios", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "points-on-the-tangent-and-cotangent-graphs",
      title: t("Points on the graphs", "图象上的点"),
      explanation: t(
        "Since $\\tan x = \\frac{\\sin x}{\\cos x}$, the graph of $y = \\tan x$ has a **vertical asymptote** wherever $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$: as $x$ approaches $\\frac{\\pi}{2}$ from the left, $\\sin x \\to 1$ while $\\cos x \\to 0^+$, so $\\tan x$ grows without bound. Between the asymptotes the values come from the unit circle:\n\n| $x$ | $-\\frac{\\pi}{3}$ | $-\\frac{\\pi}{4}$ | $0$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| $\\tan x$ | $-\\sqrt{3}$ | $-1$ | $0$ | $1$ | $\\sqrt{3}$ |\n\nThe graph of $y = \\cot x = \\frac{\\cos x}{\\sin x}$ has its asymptotes where $\\sin x = 0$, at $x = k\\pi$. For example, $\\cot \\frac{3\\pi}{4} = -1$, so $\\left(\\frac{3\\pi}{4}, -1\\right)$ is on it. The figure shows $y = \\tan x$.",
        "因为 $\\tan x = \\frac{\\sin x}{\\cos x}$，$y = \\tan x$ 的图象在 $\\cos x = 0$ 处，即 $x = \\frac{\\pi}{2} + k\\pi$ 处，有**竖直渐近线**：当 $x$ 从左侧趋近 $\\frac{\\pi}{2}$ 时，$\\sin x \\to 1$ 而 $\\cos x \\to 0^+$，所以 $\\tan x$ 无限增大。渐近线之间的值来自单位圆：\n\n| $x$ | $-\\frac{\\pi}{3}$ | $-\\frac{\\pi}{4}$ | $0$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| $\\tan x$ | $-\\sqrt{3}$ | $-1$ | $0$ | $1$ | $\\sqrt{3}$ |\n\n$y = \\cot x = \\frac{\\cos x}{\\sin x}$ 的图象的渐近线在 $\\sin x = 0$ 处，即 $x = k\\pi$。例如 $\\cot \\frac{3\\pi}{4} = -1$，所以 $\\left(\\frac{3\\pi}{4}, -1\\right)$ 在它上面。图中是 $y = \\tan x$。",
      ),
      figure: graphFigure("tan", -4, 8),
      generate: (rng) => pointOnGraphProblem(rng, ["tan", "cot"]),
    },
    {
      id: "recognizing-the-tangent-and-cotangent-graphs",
      title: t("Recognizing the graphs", "辨认图象"),
      explanation: t(
        "Both graphs repeat every $\\pi$ and take every real value on each branch. The graph of $y = \\tan x$ passes through the origin and **rises** on each branch, with asymptotes at $x = \\pm\\frac{\\pi}{2}$. The graph of $y = \\cot x$ has the $y$-axis as an asymptote and **falls** on each branch, crossing the $x$-axis at $x = \\frac{\\pi}{2}$. The figure shows $y = \\cot x$.",
        "两个图象都每隔 $\\pi$ 重复，每一支都取遍所有实数。$y = \\tan x$ 的图象经过原点，每一支都**上升**，渐近线为 $x = \\pm\\frac{\\pi}{2}$。$y = \\cot x$ 的图象以 $y$ 轴为渐近线，每一支都**下降**，并在 $x = \\frac{\\pi}{2}$ 处与 $x$ 轴相交。图中是 $y = \\cot x$。",
      ),
      figure: graphFigure("cot", -4, 8),
      generate: (rng) => identifyProblem(rng, rng.pick<Fn>(["tan", "cot"]), ["tan", "cot", "sin", "cos"]),
    },
    {
      id: "intercepts-and-asymptotes-over-an-interval",
      title: t("Intercepts and asymptotes over an interval", "区间上的交点与渐近线"),
      explanation: t(
        "The key features repeat every $\\pi$:\n\n| | $x$-intercepts | vertical asymptotes |\n| :--- | :---: | :---: |\n| $y = \\tan x$ | $k\\pi$ | $\\frac{\\pi}{2} + k\\pi$ |\n| $y = \\cot x$ | $\\frac{\\pi}{2} + k\\pi$ | $k\\pi$ |\n\nThe $x$-intercepts of one are the asymptotes of the other. For $y = \\tan x$ on $0 \\le x \\le 3\\pi$, the asymptotes are $x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}$: three of them.",
        "关键特征每隔 $\\pi$ 重复：\n\n| | 与 $x$ 轴的交点 | 竖直渐近线 |\n| :--- | :---: | :---: |\n| $y = \\tan x$ | $k\\pi$ | $\\frac{\\pi}{2} + k\\pi$ |\n| $y = \\cot x$ | $\\frac{\\pi}{2} + k\\pi$ | $k\\pi$ |\n\n一个函数与 $x$ 轴的交点正是另一个的渐近线。对 $y = \\tan x$ 在 $0 \\le x \\le 3\\pi$ 上，渐近线为 $x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}$，共三条。",
      ),
      generate: (rng) => countProblem(rng, ["tan", "cot"]),
    },
  ],
};

/** graphingSecantAndCosecant draws the reciprocals of cosine and sine. */
export const graphingSecantAndCosecant: TopicDef = {
  id: "graphing-secant-and-cosecant",
  title: t("Graphing Secant and Cosecant", "画正割与余割函数的图象"),
  summary: t(
    "Graph y = sec x and y = csc x as the reciprocals of cosine and sine, recognize them, and find their asymptotes and turning points.",
    "把 y = sec x 和 y = csc x 看作余弦与正弦的倒数画出图象，辨认它们，并求它们的渐近线和转折点。",
  ),
  prerequisites: ["graphing-tangent-and-cotangent"],
  encompasses: [
    { topic: "graphing-tangent-and-cotangent", weight: 0.3 },
    { topic: "graphing-sine-and-cosine", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "points-on-the-secant-and-cosecant-graphs",
      title: t("Points on the graphs", "图象上的点"),
      explanation: t(
        "Each value of $y = \\sec x = \\frac{1}{\\cos x}$ is the reciprocal of a value of cosine. Where $\\cos x = 0$ the graph has a vertical asymptote; where $\\cos x = \\pm 1$ the two graphs touch, at $(0, 1)$ and $(\\pi, -1)$; and since $|\\cos x| \\le 1$, the values of $\\sec x$ are at least $1$ or at most $-1$. For example,\n\n$$\\sec \\frac{2\\pi}{3} = \\frac{1}{\\cos \\frac{2\\pi}{3}} = \\frac{1}{-\\frac{1}{2}} = -2.$$\n\nLikewise $y = \\csc x = \\frac{1}{\\sin x}$ has asymptotes where $\\sin x = 0$. The figure shows $y = \\sec x$.",
        "$y = \\sec x = \\frac{1}{\\cos x}$ 的每个值都是余弦值的倒数。在 $\\cos x = 0$ 处图象有竖直渐近线；在 $\\cos x = \\pm 1$ 处两个图象相接，即 $(0, 1)$ 与 $(\\pi, -1)$；又因为 $|\\cos x| \\le 1$，$\\sec x$ 的值不小于 $1$ 或不大于 $-1$。例如\n\n$$\\sec \\frac{2\\pi}{3} = \\frac{1}{\\cos \\frac{2\\pi}{3}} = \\frac{1}{-\\frac{1}{2}} = -2.$$\n\n同样，$y = \\csc x = \\frac{1}{\\sin x}$ 在 $\\sin x = 0$ 处有渐近线。图中是 $y = \\sec x$。",
      ),
      figure: graphFigure("sec", -4, 8),
      generate: (rng) => pointOnGraphProblem(rng, ["sec", "csc"]),
    },
    {
      id: "recognizing-the-secant-and-cosecant-graphs",
      title: t("Recognizing the graphs", "辨认图象"),
      explanation: t(
        "Both graphs are made of U-shaped branches, opening up from $y = 1$ and down from $y = -1$, between asymptotes $\\pi$ apart, and both repeat every $2\\pi$. The graph of $y = \\sec x$ has a turning point at $(0, 1)$ on the $y$-axis. The graph of $y = \\csc x$ has the $y$-axis as an asymptote, with turning points at $\\left(\\frac{\\pi}{2}, 1\\right)$ and $\\left(-\\frac{\\pi}{2}, -1\\right)$. The figure shows $y = \\csc x$.",
        "两个图象都由 U 形的分支组成，从 $y = 1$ 向上开口、从 $y = -1$ 向下开口，位于相距 $\\pi$ 的渐近线之间，并且都每隔 $2\\pi$ 重复。$y = \\sec x$ 的图象在 $y$ 轴上的 $(0, 1)$ 处有转折点。$y = \\csc x$ 的图象以 $y$ 轴为渐近线，转折点为 $\\left(\\frac{\\pi}{2}, 1\\right)$ 与 $\\left(-\\frac{\\pi}{2}, -1\\right)$。图中是 $y = \\csc x$。",
      ),
      figure: graphFigure("csc", -4, 8),
      generate: (rng) => identifyProblem(rng, rng.pick<Fn>(["sec", "csc"]), ["sec", "csc", "tan", "cot"]),
    },
    {
      id: "asymptotes-and-turning-points-over-an-interval",
      title: t("Asymptotes and turning points over an interval", "区间上的渐近线与转折点"),
      explanation: t(
        "The asymptotes of $y = \\sec x$ are those of $y = \\tan x$, and the asymptotes of $y = \\csc x$ are those of $y = \\cot x$; neither graph meets the $x$-axis:\n\n| | vertical asymptotes | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sec x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n| $y = \\csc x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n\nFor $y = \\csc x$ on $-\\pi \\le x \\le 2\\pi$, the points with $y = 1$ are at $x = \\frac{\\pi}{2}$ only (the next ones, $-\\frac{3\\pi}{2}$ and $\\frac{5\\pi}{2}$, lie outside): one point.",
        "$y = \\sec x$ 的渐近线就是 $y = \\tan x$ 的渐近线，$y = \\csc x$ 的渐近线就是 $y = \\cot x$ 的渐近线；两个图象都不与 $x$ 轴相交：\n\n| | 竖直渐近线 | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sec x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n| $y = \\csc x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n\n对 $y = \\csc x$ 在 $-\\pi \\le x \\le 2\\pi$ 上，满足 $y = 1$ 的点只有 $x = \\frac{\\pi}{2}$（相邻的 $-\\frac{3\\pi}{2}$ 和 $\\frac{5\\pi}{2}$ 在区间外）：一个点。",
      ),
      generate: (rng) => countProblem(rng, ["sec", "csc"]),
    },
  ],
};

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

/** iv is the interval between lo and hi (infinite when undefined), closed at the finite ends. */
function iv(lo: Coefficient | undefined, hi: Coefficient | undefined): Interval {
  return {
    ...(lo !== undefined && { lo: toQ(lo) }),
    ...(hi !== undefined && { hi: toQ(hi) }),
    loClosed: lo !== undefined,
    hiClosed: hi !== undefined,
  };
}

const ranges = {
  box: union(iv(-1, 1)),
  all: realLine,
  outside: union(iv(undefined, -1), iv(1, undefined)),
} as const satisfies Record<string, RealSet>;

const rangeOf: Record<Fn, keyof typeof ranges> = { sin: "box", cos: "box", tan: "all", cot: "all", sec: "outside", csc: "outside" };

const domainOptions: readonly Text[] = [
  t("All real numbers", "全体实数"),
  t(
    "All real numbers except $x = \\frac{\\pi}{2} + k\\pi$ for integers $k$",
    "除 $x = \\frac{\\pi}{2} + k\\pi$（$k$ 为整数）以外的全体实数",
  ),
  t("All real numbers except $x = k\\pi$ for integers $k$", "除 $x = k\\pi$（$k$ 为整数）以外的全体实数"),
  same("$-1 \\le x \\le 1$"),
];

const domainIndex: Record<Fn, number> = { sin: 0, cos: 0, tan: 1, sec: 1, cot: 2, csc: 2 };

/** zeroOf names what makes f undefined: "\cos x" for tangent and secant, "\sin x" for cotangent and cosecant. */
const zeroOf = (f: Fn) => (f === "tan" || f === "sec" ? "\\cos x" : "\\sin x");

/** randomValue is a random nonzero exact number c√m. */
function randomValue(rng: Rng): S {
  if (rng.bool(0.7)) {
    const d = rng.int(1, 6);
    return [q(rng.sign() * rng.int(1, 3 * d), d), 1];
  }
  return [q(rng.sign() * rng.int(1, 3), rng.int(1, 3)), rng.pick([2, 3, 5])];
}

/** inRange tells whether a value is taken by f. */
function inRange(f: Fn, v: S): boolean {
  const sq = sSquare(v);
  const r = rangeOf[f];
  return r === "all" || (r === "box" ? sq.cmp(Q.one) <= 0 : sq.cmp(Q.one) >= 0);
}

/** rangeQuestion asks whether f takes a value. */
function rangeQuestion(rng: Rng, f: Fn): Problem {
  const want = rangeOf[f] === "all" || rng.bool();
  let v = randomValue(rng);
  while (inRange(f, v) !== want) v = randomValue(rng);
  const r = rangeOf[f];
  const rangeTex = intervalLatex(ranges[r]);
  const sq = v[1] === 1 ? "" : ` (its square is $${sSquare(v).toLatex()}$)`;
  const sqZh = v[1] === 1 ? "" : `（它的平方是 $${sSquare(v).toLatex()}$）`;
  const cmpEn =
    r === "all"
      ? ""
      : r === "box"
        ? want
          ? ", between $-1$ and $1$"
          : ", not between $-1$ and $1$"
        : want
          ? ", not between $-1$ and $1$"
          : ", strictly between $-1$ and $1$";
  const cmpZh =
    r === "all"
      ? ""
      : r === "box"
        ? want
          ? "，在 $-1$ 与 $1$ 之间"
          : "，不在 $-1$ 与 $1$ 之间"
        : want
          ? "，不在 $-1$ 与 $1$ 之间"
          : "，严格位于 $-1$ 与 $1$ 之间";
  return choiceProblem({
    prompt: t(`Is there a value of $x$ for which $\\${f} x = ${sTex(v)}$?`, `是否存在 $x$ 使 $\\${f} x = ${sTex(v)}$？`),
    options: yesNo,
    correct: want ? 0 : 1,
    solution: t(
      `The range of $y = \\${f} x$ is $${rangeTex}$. The number $${sTex(v)}$${sq}${cmpEn} is ${want ? "" : "not "}in the range, so the answer is ${want ? "yes" : "no"}.`,
      `$y = \\${f} x$ 的值域是 $${rangeTex}$。数 $${sTex(v)}$${sqZh}${cmpZh}，${want ? "在" : "不在"}值域内，所以答案是${want ? "是" : "否"}。`,
    ),
  });
}

/** domainQuestion asks whether f is defined at a special angle. */
function domainQuestion(rng: Rng, f: Fn): Problem {
  const asym = fnData[f].features.find((ft) => ft.kind === "asymptote")!;
  let d: number;
  if (rng.bool()) {
    d = 90 * (asym.off + asym.P * rng.int(-4, 3));
  } else {
    for (;;) {
      const n = rng.pick([1, 2, 3, 4, 6]);
      const k = rng.nonZero(-4 * n, 4 * n);
      if (gcd(Math.abs(k), n) !== 1) continue;
      d = (180 * k) / n;
      if (exact(f, d)) break;
    }
  }
  const x = radTex(d);
  const defined = exact(f, d) !== undefined;
  const z = zeroOf(f);
  const u = d / 90;
  const k = (u - asym.off) / asym.P;
  const form = familyTex(asym);
  const zv = sTex(f === "tan" || f === "sec" ? cosS(d) : sinS(d));
  return choiceProblem({
    prompt: t(`Is $\\${f} x$ defined at $x = ${x}$?`, `$\\${f} x$ 在 $x = ${x}$ 处有定义吗？`),
    options: yesNo,
    correct: defined ? 0 : 1,
    solution: defined
      ? t(
          `The function $\\${f} x$ is not defined only where $${z} = 0$, at $x = ${form}$. Here $${z.replace("x", arg(x))} = ${zv} \\ne 0$, so $\\${f} ${arg(x)}$ is defined.`,
          `$\\${f} x$ 只在 $${z} = 0$ 处无定义，即 $x = ${form}$。这里 $${z.replace("x", arg(x))} = ${zv} \\ne 0$，所以 $\\${f} ${arg(x)}$ 有定义。`,
        )
      : t(
          `The function $\\${f} x$ is not defined where $${z} = 0$, at $x = ${form}$. Here $${x} = ${form.replace("k", k === 1 ? "" : k === -1 ? "-" : String(k))}$ with $k = ${k}$, so $${z.replace("x", arg(x))} = 0$ and $\\${f} ${arg(x)}$ is not defined.`,
          `$\\${f} x$ 在 $${z} = 0$ 处无定义，即 $x = ${form}$。这里 $${x} = ${form.replace("k", k === 1 ? "" : k === -1 ? "-" : String(k))}$，$k = ${k}$，所以 $${z.replace("x", arg(x))} = 0$，$\\${f} ${arg(x)}$ 无定义。`,
        ),
  });
}

/** domainRangeProblem draws from the questions about the domain and range of f. */
function domainRangeProblem(rng: Rng, f: Fn): Problem {
  const r = rng.next();
  const hasHoles = domainIndex[f] !== 0;
  if (r < 0.1) {
    const set = ranges[rangeOf[f]];
    const others = (Object.keys(ranges) as (keyof typeof ranges)[]).filter((k) => k !== rangeOf[f]).map((k) => ranges[k]);
    return intervalProblem({
      prompt: t(`Find the range of $y = \\${f} x$.`, `求 $y = \\${f} x$ 的值域。`),
      set,
      wrong: [...others, union(iv(0, 1))],
      solution: rangeSolution[f],
    });
  }
  if (r < 0.2) {
    return choiceProblem({
      prompt: t(`What is the domain of $y = \\${f} x$?`, `$y = \\${f} x$ 的定义域是什么？`),
      options: domainOptions,
      correct: domainIndex[f],
      solution: domainSolution[f],
    });
  }
  if (hasHoles && (rangeOf[f] === "all" || r < 0.6)) return domainQuestion(rng, f);
  return rangeQuestion(rng, f);
}

const domainSolution: Record<Fn, Text> = {
  sin: t(
    "Every angle has a terminal side meeting the unit circle at a point $(\\cos x, \\sin x)$, so $\\sin x$ is defined for every real $x$: the domain is all real numbers.",
    "每个角的终边都与单位圆交于一点 $(\\cos x, \\sin x)$，所以 $\\sin x$ 对每个实数 $x$ 都有定义：定义域是全体实数。",
  ),
  cos: t(
    "Every angle has a terminal side meeting the unit circle at a point $(\\cos x, \\sin x)$, so $\\cos x$ is defined for every real $x$: the domain is all real numbers.",
    "每个角的终边都与单位圆交于一点 $(\\cos x, \\sin x)$，所以 $\\cos x$ 对每个实数 $x$ 都有定义：定义域是全体实数。",
  ),
  tan: t(
    "$\\tan x = \\frac{\\sin x}{\\cos x}$ is not defined where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$, and defined everywhere else.",
    "$\\tan x = \\frac{\\sin x}{\\cos x}$ 在 $\\cos x = 0$ 处无定义，即 $x = \\frac{\\pi}{2} + k\\pi$，其余各处都有定义。",
  ),
  sec: t(
    "$\\sec x = \\frac{1}{\\cos x}$ is not defined where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$, and defined everywhere else.",
    "$\\sec x = \\frac{1}{\\cos x}$ 在 $\\cos x = 0$ 处无定义，即 $x = \\frac{\\pi}{2} + k\\pi$，其余各处都有定义。",
  ),
  cot: t(
    "$\\cot x = \\frac{\\cos x}{\\sin x}$ is not defined where $\\sin x = 0$, at $x = k\\pi$, and defined everywhere else.",
    "$\\cot x = \\frac{\\cos x}{\\sin x}$ 在 $\\sin x = 0$ 处无定义，即 $x = k\\pi$，其余各处都有定义。",
  ),
  csc: t(
    "$\\csc x = \\frac{1}{\\sin x}$ is not defined where $\\sin x = 0$, at $x = k\\pi$, and defined everywhere else.",
    "$\\csc x = \\frac{1}{\\sin x}$ 在 $\\sin x = 0$ 处无定义，即 $x = k\\pi$，其余各处都有定义。",
  ),
};

const rangeSolution: Record<Fn, Text> = {
  sin: t(
    "The sine is the $y$-coordinate of a point on the unit circle, which takes every value from $-1$ to $1$ and no other: the range is $[-1, 1]$.",
    "正弦是单位圆上点的 $y$ 坐标，它取遍 $-1$ 到 $1$ 之间的所有值，且不取其他值：值域为 $[-1, 1]$。",
  ),
  cos: t(
    "The cosine is the $x$-coordinate of a point on the unit circle, which takes every value from $-1$ to $1$ and no other: the range is $[-1, 1]$.",
    "余弦是单位圆上点的 $x$ 坐标，它取遍 $-1$ 到 $1$ 之间的所有值，且不取其他值：值域为 $[-1, 1]$。",
  ),
  tan: t(
    "On each branch between two asymptotes the graph rises from $-\\infty$ to $\\infty$, so the range is all real numbers, $(-\\infty, \\infty)$.",
    "在两条渐近线之间的每一支上，图象从 $-\\infty$ 升到 $\\infty$，所以值域是全体实数 $(-\\infty, \\infty)$。",
  ),
  cot: t(
    "On each branch between two asymptotes the graph falls from $\\infty$ to $-\\infty$, so the range is all real numbers, $(-\\infty, \\infty)$.",
    "在两条渐近线之间的每一支上，图象从 $\\infty$ 降到 $-\\infty$，所以值域是全体实数 $(-\\infty, \\infty)$。",
  ),
  sec: t(
    "Since $0 < |\\cos x| \\le 1$ where it is defined, $|\\sec x| = \\frac{1}{|\\cos x|} \\ge 1$, and every such value occurs: the range is $(-\\infty, -1] \\cup [1, \\infty)$.",
    "在有定义处 $0 < |\\cos x| \\le 1$，所以 $|\\sec x| = \\frac{1}{|\\cos x|} \\ge 1$，且每个这样的值都能取到：值域为 $(-\\infty, -1] \\cup [1, \\infty)$。",
  ),
  csc: t(
    "Since $0 < |\\sin x| \\le 1$ where it is defined, $|\\csc x| = \\frac{1}{|\\sin x|} \\ge 1$, and every such value occurs: the range is $(-\\infty, -1] \\cup [1, \\infty)$.",
    "在有定义处 $0 < |\\sin x| \\le 1$，所以 $|\\csc x| = \\frac{1}{|\\sin x|} \\ge 1$，且每个这样的值都能取到：值域为 $(-\\infty, -1] \\cup [1, \\infty)$。",
  ),
};

const parityOptions: readonly Text[] = [t("Even", "偶函数"), t("Odd", "奇函数"), t("Neither", "既不是奇函数也不是偶函数")];

/** paritySolution explains the symmetry of f. */
const paritySolution: Record<Fn, Text> = {
  sin: t(
    "The angles $x$ and $-x$ have terminal sides that are mirror images across the $x$-axis, meeting the unit circle at $(a, b)$ and $(a, -b)$. So $\\sin(-x) = -\\sin x$: sine is **odd**, and its graph is symmetric about the origin.",
    "角 $x$ 与 $-x$ 的终边关于 $x$ 轴对称，分别与单位圆交于 $(a, b)$ 与 $(a, -b)$。所以 $\\sin(-x) = -\\sin x$：正弦是**奇函数**，图象关于原点对称。",
  ),
  cos: t(
    "The angles $x$ and $-x$ have terminal sides that are mirror images across the $x$-axis, meeting the unit circle at $(a, b)$ and $(a, -b)$. So $\\cos(-x) = \\cos x$: cosine is **even**, and its graph is symmetric about the $y$-axis.",
    "角 $x$ 与 $-x$ 的终边关于 $x$ 轴对称，分别与单位圆交于 $(a, b)$ 与 $(a, -b)$。所以 $\\cos(-x) = \\cos x$：余弦是**偶函数**，图象关于 $y$ 轴对称。",
  ),
  tan: t(
    "$\\tan(-x) = \\frac{\\sin(-x)}{\\cos(-x)} = \\frac{-\\sin x}{\\cos x} = -\\tan x$: tangent is **odd**, and its graph is symmetric about the origin.",
    "$\\tan(-x) = \\frac{\\sin(-x)}{\\cos(-x)} = \\frac{-\\sin x}{\\cos x} = -\\tan x$：正切是**奇函数**，图象关于原点对称。",
  ),
  cot: t(
    "$\\cot(-x) = \\frac{\\cos(-x)}{\\sin(-x)} = \\frac{\\cos x}{-\\sin x} = -\\cot x$: cotangent is **odd**, and its graph is symmetric about the origin.",
    "$\\cot(-x) = \\frac{\\cos(-x)}{\\sin(-x)} = \\frac{\\cos x}{-\\sin x} = -\\cot x$：余切是**奇函数**，图象关于原点对称。",
  ),
  sec: t(
    "$\\sec(-x) = \\frac{1}{\\cos(-x)} = \\frac{1}{\\cos x} = \\sec x$: secant is **even**, and its graph is symmetric about the $y$-axis.",
    "$\\sec(-x) = \\frac{1}{\\cos(-x)} = \\frac{1}{\\cos x} = \\sec x$：正割是**偶函数**，图象关于 $y$ 轴对称。",
  ),
  csc: t(
    "$\\csc(-x) = \\frac{1}{\\sin(-x)} = \\frac{1}{-\\sin x} = -\\csc x$: cosecant is **odd**, and its graph is symmetric about the origin.",
    "$\\csc(-x) = \\frac{1}{\\sin(-x)} = \\frac{1}{-\\sin x} = -\\csc x$：余割是**奇函数**，图象关于原点对称。",
  ),
};

/** randomValueIn is a random nonzero rational value of f. */
function randomValueIn(rng: Rng, f: Fn): Q {
  const r = rangeOf[f];
  const d = rng.int(2, 9);
  const n = rng.int(1, d - 1);
  const v = r === "box" ? q(n, d) : r === "outside" ? q(d, n) : rng.bool() ? q(n, d) : q(d, n);
  return rng.bool() ? v : v.neg();
}

/** shiftTex writes θ + c·π: "\theta + 4\pi", "\theta - 2\pi", "2\pi - \theta". */
function shiftTex(u: number, minusTheta: boolean): string {
  const c = uTex(Math.abs(u));
  if (minusTheta) return `${uTex(u)} - \\theta`;
  return `\\theta ${u > 0 ? "+" : "-"} ${c}`;
}

/** periodSymmetryProblem draws from the questions about the period and the symmetry of f. */
function periodSymmetryProblem(rng: Rng, f: Fn): Problem {
  const { period, even } = fnData[f];
  const r = rng.next();
  const pTex = uTex(period);
  const name = fnNames[f];
  if (r < 0.1) {
    return piProblem(
      t(`What is the period of $y = \\${f} x$?`, `$y = \\${f} x$ 的周期是多少？`),
      pTex,
      period === 4
        ? t(
            `Adding $2\\pi$ to an angle is one full turn, which brings the terminal side back to the same place, so $\\${f}(x + 2\\pi) = \\${f} x$, and no smaller positive shift works for every $x$. The period is $2\\pi$.`,
            `给角加上 $2\\pi$ 就是转一整圈，终边回到原处，所以 $\\${f}(x + 2\\pi) = \\${f} x$，而更小的正平移不能对所有 $x$ 成立。周期是 $2\\pi$。`,
          )
        : t(
            `Adding $\\pi$ to an angle moves the point $(a, b)$ on the unit circle to $(-a, -b)$, and the ratio of the coordinates does not change. So $\\${f}(x + \\pi) = \\${f} x$, and the period is $\\pi$.`,
            `给角加上 $\\pi$，单位圆上的点 $(a, b)$ 变为 $(-a, -b)$，坐标之比不变。所以 $\\${f}(x + \\pi) = \\${f} x$，周期是 $\\pi$。`,
          ),
      [uTex(period * 2), uTex(period / 2), uTex(1)],
    );
  }
  if (r < 0.2) {
    return choiceProblem({
      prompt: t(`Is $y = \\${f} x$ even, odd or neither?`, `$y = \\${f} x$ 是偶函数、奇函数，还是都不是？`),
      options: parityOptions,
      correct: even ? 0 : 1,
      solution: paritySolution[f],
    });
  }
  const v = randomValueIn(rng, f);
  const kind = rng.int(0, 2);
  const j = rng.nonZero(-3, 3);
  const arg0 = kind === 0 ? shiftTex(j * period, false) : kind === 1 ? "-\\theta" : shiftTex(Math.abs(j) * period, true);
  const flips = kind !== 0 && !even;
  const answer = flips ? v.neg() : v;
  const periodLine = t(
    `The period of $y = \\${f} x$ is $${pTex}$, so adding or subtracting a multiple of $${pTex}$ does not change the value.`,
    `$y = \\${f} x$ 的周期是 $${pTex}$，所以加减 $${pTex}$ 的倍数不改变函数值。`,
  );
  const parityLine = even
    ? t(`The ${name.en} is even: $\\${f}(-\\theta) = \\${f} \\theta$.`, `${name["zh-CN"]}是偶函数：$\\${f}(-\\theta) = \\${f} \\theta$。`)
    : t(`The ${name.en} is odd: $\\${f}(-\\theta) = -\\${f} \\theta$.`, `${name["zh-CN"]}是奇函数：$\\${f}(-\\theta) = -\\${f} \\theta$。`);
  const parts = kind === 0 ? [periodLine] : kind === 1 ? [parityLine] : [periodLine, t(" ", ""), parityLine];
  const last = kind === 2 ? `\\${f}(${arg0}) = \\${f}(-\\theta) = ${answer.toLatex()}` : `\\${f}(${arg0}) = ${answer.toLatex()}`;
  return numberProblem({
    prompt: t(
      `If $\\${f} \\theta = ${v.toLatex()}$, find $\\${f}(${arg0})$.`,
      `若 $\\${f} \\theta = ${v.toLatex()}$，求 $\\${f}(${arg0})$。`,
    ),
    answer,
    wrong: [answer.neg(), Q.one.div(answer)],
    solution: join(...parts, both("", "", last)),
  });
}

/** featurePrompt asks for the member of a feature's family in [a, b). */
function featurePrompt(f: Fn, kind: Kind, a: string, b: string): Text {
  const range = `${a} \\le x < ${b}`;
  const y = `y = \\${f} x`;
  const local = f === "sec" || f === "csc";
  switch (kind) {
    case "zero":
      return t(`Find the zero of $${y}$ with $${range}$.`, `求 $${y}$ 在 $${range}$ 内的零点。`);
    case "asymptote":
      return t(`Find the vertical asymptote of the graph of $${y}$ with $${range}$.`, `求 $${y}$ 的图象在 $${range}$ 内的竖直渐近线。`);
    case "max":
      return local
        ? t(`Find the value of $x$ with $${range}$ at which $${y}$ has a local maximum.`, `求 $${range}$ 内使 $${y}$ 取得极大值的 $x$。`)
        : t(
            `Find the value of $x$ with $${range}$ at which $${y}$ takes its maximum value.`,
            `求 $${range}$ 内使 $${y}$ 取得最大值的 $x$。`,
          );
    case "min":
      return local
        ? t(`Find the value of $x$ with $${range}$ at which $${y}$ has a local minimum.`, `求 $${range}$ 内使 $${y}$ 取得极小值的 $x$。`)
        : t(
            `Find the value of $x$ with $${range}$ at which $${y}$ takes its minimum value.`,
            `求 $${range}$ 内使 $${y}$ 取得最小值的 $x$。`,
          );
  }
}

const featureNames: Record<Kind, Text> = {
  zero: t("zeros", "零点"),
  asymptote: t("vertical asymptotes", "竖直渐近线"),
  max: t("maximum points", "最大值点"),
  min: t("minimum points", "最小值点"),
};

const localNames: Partial<Record<Kind, Text>> = {
  max: t("local maxima, where $y = -1$,", "极大值点（$y = -1$）"),
  min: t("local minima, where $y = 1$,", "极小值点（$y = 1$）"),
};

/** featureProblem asks for the zero, extremum or asymptote of f in an interval of one spacing. */
function featureProblem(rng: Rng, f: Fn): Problem {
  const fts = fnData[f].features;
  const ft = rng.pick(fts);
  const a = rng.int(-8, 6);
  const u = firstFrom(ft, a);
  const k = (u - ft.off) / ft.P;
  const step = ft.P === 2 ? "\\pi" : "2\\pi";
  const kTimes = k === 1 ? step : k === -1 ? `-${step}` : `${k} \\cdot ${step}`;
  const line =
    ft.off === 0
      ? `x = ${k === 0 ? "0" : kTimes}${k === 0 || Math.abs(k) === 1 ? "" : ` = ${uTex(u)}`}`
      : `x = ${uTex(ft.off)}${k === 0 ? "" : ` ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? step : `${Math.abs(k)} \\cdot ${step}`} = ${uTex(u)}`}`;
  const name = (f === "sec" || f === "csc") && localNames[ft.kind] ? localNames[ft.kind]! : featureNames[ft.kind];
  const wrong = [...fts.filter((g) => g !== ft).map((g) => firstFrom(g, a)), u + ft.P, u - ft.P, u + 1, u - 1].map(uTex);
  return piProblem(
    featurePrompt(f, ft.kind, uTex(a), uTex(a + ft.P)),
    uTex(u),
    both(
      `The ${name.en} of $y = \\${f} x$ are at $x = ${familyTex(ft)}$ for integers $k$, one in every interval of length $${step}$. The one with $${uTex(a)} \\le x < ${uTex(a + ft.P)}$ has $k = ${k}$:`,
      `$y = \\${f} x$ 的${name["zh-CN"]}位于 $x = ${familyTex(ft)}$（$k$ 为整数），每个长为 $${step}$ 的区间内恰有一个。满足 $${uTex(a)} \\le x < ${uTex(a + ft.P)}$ 的那个对应 $k = ${k}$：`,
      line,
    ),
    wrong,
    ft.kind === "asymptote" ? "x =" : undefined,
  );
}

const monotonyOptions: readonly Text[] = [t("Increasing", "递增"), t("Decreasing", "递减")];

/** qTex writes x = aπ/4 in LaTeX. */
const qTex = (a: number) => piTex(q(a, 4));

/** monotonyProblem asks whether f increases or decreases on an interval of length π/4 between key points. */
function monotonyProblem(rng: Rng, f: Fn): Problem {
  const { pieces, period } = fnData[f];
  const P = 2 * period;
  const a = rng.int(-16, 15);
  const base = pieces[0]![0];
  const j = Math.floor((a - base) / P);
  const a0 = a - j * P;
  const piece = pieces.find(([lo, hi]) => lo <= a0 && a0 + 1 <= hi)!;
  const [lo, hi, inc] = piece;
  const iTex = `\\left(${qTex(a)}, ${qTex(a + 1)}\\right)`;
  const shift =
    j === 0
      ? ""
      : ` = \\left(${qTex(a0)}, ${qTex(a0 + 1)}\\right) ${j > 0 ? "+" : "-"} ${Math.abs(j) === 1 ? uTex(period) : `${Math.abs(j)} \\cdot ${uTex(period)}`}`;
  const word = inc ? t("increasing", "递增") : t("decreasing", "递减");
  return choiceProblem({
    prompt: t(`Is $y = \\${f} x$ increasing or decreasing on the interval $${iTex}$?`, `$y = \\${f} x$ 在区间 $${iTex}$ 上递增还是递减？`),
    options: monotonyOptions,
    correct: inc ? 0 : 1,
    solution: join(
      j === 0
        ? t("", "")
        : both(
            `The period is $${uTex(period)}$, so shift the interval back into one period:`,
            `周期是 $${uTex(period)}$，所以把区间平移回一个周期内：`,
            `${iTex}${shift}`,
          ),
      t(
        `The interval $\\left(${qTex(a0)}, ${qTex(a0 + 1)}\\right)$ lies inside $\\left(${qTex(lo)}, ${qTex(hi)}\\right)$, on which $y = \\${f} x$ is ${word.en}. So it is ${word.en} on $${iTex}$.`,
        `区间 $\\left(${qTex(a0)}, ${qTex(a0 + 1)}\\right)$ 包含在 $\\left(${qTex(lo)}, ${qTex(hi)}\\right)$ 内，$y = \\${f} x$ 在其上${word["zh-CN"]}。所以它在 $${iTex}$ 上${word["zh-CN"]}。`,
      ),
    ),
  });
}

/** PropertyTexts are the explanations of the four knowledge points of a properties topic. */
interface PropertyTexts {
  readonly domainRange: Text;
  readonly periodSymmetry: Text;
  readonly features: Text;
  readonly monotony: Text;
}

/** propertyKnowledgePoints builds the four knowledge points of the properties of f. */
function propertyKnowledgePoints(f: Fn, texts: PropertyTexts): KnowledgePointDef[] {
  const name = fnNames[f];
  const figure = graphFigure(f, -4, 8);
  const featureTitle =
    f === "sin" || f === "cos"
      ? t("Zeros and extrema", "零点与最值")
      : f === "tan" || f === "cot"
        ? t("Zeros and asymptotes", "零点与渐近线")
        : t("Asymptotes and local extrema", "渐近线与极值");
  return [
    {
      id: `domain-and-range-of-the-${name.en}-function`,
      title: t("Domain and range", "定义域与值域"),
      explanation: texts.domainRange,
      figure,
      generate: (rng) => domainRangeProblem(rng, f),
    },
    {
      id: `period-and-symmetry-of-the-${name.en}-function`,
      title: t("Period and symmetry", "周期与对称性"),
      explanation: texts.periodSymmetry,
      keyPrerequisites: ["even-and-odd-functions"],
      generate: (rng) => periodSymmetryProblem(rng, f),
    },
    {
      id: `key-points-of-the-${name.en}-function`,
      title: featureTitle,
      explanation: texts.features,
      figure,
      generate: (rng) => featureProblem(rng, f),
    },
    {
      id: `intervals-of-increase-and-decrease-of-the-${name.en}-function`,
      title: t("Intervals of increase and decrease", "单调区间"),
      explanation: texts.monotony,
      keyPrerequisites: ["increasing-and-decreasing"],
      generate: (rng) => monotonyProblem(rng, f),
    },
  ];
}

/** describingPropertiesOfTheSineFunction states the domain, range, period, symmetry, zeros, extrema and monotony of sine. */
export const describingPropertiesOfTheSineFunction: TopicDef = {
  id: "describing-properties-of-the-sine-function",
  title: t("Describing Properties of the Sine Function", "描述正弦函数的性质"),
  summary: t(
    "Describe y = sin x: its domain and range, period 2π, odd symmetry, zeros, maximum and minimum points, and intervals of increase and decrease.",
    "描述 y = sin x：定义域与值域、周期 2π、奇对称性、零点、最大值点与最小值点，以及单调区间。",
  ),
  prerequisites: ["graphing-sine-and-cosine", "even-and-odd-functions", "local-extrema"],
  encompasses: [
    { topic: "graphing-sine-and-cosine", weight: 0.4 },
    { topic: "even-and-odd-functions", weight: 0.2 },
    { topic: "local-extrema", weight: 0.2 },
    { topic: "periodic-functions", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.TF.A.4"],
  knowledgePoints: propertyKnowledgePoints("sin", {
    domainRange: t(
      "The sine of any angle is the $y$-coordinate of the point where its terminal side meets the unit circle, so:\n\n- the **domain** of $y = \\sin x$ is all real numbers;\n- the **range** is $[-1, 1]$, since the $y$-coordinates on the unit circle run from $-1$ to $1$.\n\nSo $\\sin x = \\frac{3}{4}$ has solutions, but $\\sin x = \\frac{5}{4}$ has none. For a value with a radical, compare its square with $1$: $\\left(\\frac{\\sqrt{5}}{2}\\right)^2 = \\frac{5}{4} > 1$, so $\\sin x = \\frac{\\sqrt{5}}{2}$ has no solution.",
      "任意角的正弦是其终边与单位圆交点的 $y$ 坐标，所以：\n\n- $y = \\sin x$ 的**定义域**是全体实数；\n- **值域**是 $[-1, 1]$，因为单位圆上的 $y$ 坐标从 $-1$ 取到 $1$。\n\n所以 $\\sin x = \\frac{3}{4}$ 有解，而 $\\sin x = \\frac{5}{4}$ 无解。对含根号的值，比较它的平方与 $1$：$\\left(\\frac{\\sqrt{5}}{2}\\right)^2 = \\frac{5}{4} > 1$，所以 $\\sin x = \\frac{\\sqrt{5}}{2}$ 无解。",
    ),
    periodSymmetry: t(
      "One full turn returns the terminal side to the same place, so $\\sin(x + 2\\pi) = \\sin x$: the **period** is $2\\pi$. The angles $x$ and $-x$ are mirror images across the $x$-axis, so $\\sin(-x) = -\\sin x$: sine is **odd**, and its graph is symmetric about the origin.\n\nIf $\\sin \\theta = \\frac{2}{5}$, then $\\sin(\\theta - 4\\pi) = \\frac{2}{5}$, $\\sin(-\\theta) = -\\frac{2}{5}$, and $\\sin(2\\pi - \\theta) = \\sin(-\\theta) = -\\frac{2}{5}$.",
      "转一整圈终边回到原处，所以 $\\sin(x + 2\\pi) = \\sin x$：**周期**是 $2\\pi$。角 $x$ 与 $-x$ 关于 $x$ 轴对称，所以 $\\sin(-x) = -\\sin x$：正弦是**奇函数**，图象关于原点对称。\n\n若 $\\sin \\theta = \\frac{2}{5}$，则 $\\sin(\\theta - 4\\pi) = \\frac{2}{5}$，$\\sin(-\\theta) = -\\frac{2}{5}$，$\\sin(2\\pi - \\theta) = \\sin(-\\theta) = -\\frac{2}{5}$。",
    ),
    features: t(
      "For integers $k$, $y = \\sin x$ has\n\n- **zeros** at $x = k\\pi$,\n- its **maximum** $1$ at $x = \\frac{\\pi}{2} + 2k\\pi$,\n- its **minimum** $-1$ at $x = \\frac{3\\pi}{2} + 2k\\pi$.\n\nEach interval of length $2\\pi$ such as $a \\le x < a + 2\\pi$ contains exactly one maximum point. For $4\\pi \\le x < 6\\pi$, take $k = 2$: $x = \\frac{\\pi}{2} + 2 \\cdot 2\\pi = \\frac{9\\pi}{2}$.",
      "对整数 $k$，$y = \\sin x$ 有\n\n- **零点** $x = k\\pi$，\n- **最大值** $1$，在 $x = \\frac{\\pi}{2} + 2k\\pi$ 处取得，\n- **最小值** $-1$，在 $x = \\frac{3\\pi}{2} + 2k\\pi$ 处取得。\n\n每个长为 $2\\pi$ 的区间，如 $a \\le x < a + 2\\pi$，恰含一个最大值点。对 $4\\pi \\le x < 6\\pi$，取 $k = 2$：$x = \\frac{\\pi}{2} + 2 \\cdot 2\\pi = \\frac{9\\pi}{2}$。",
    ),
    monotony: t(
      "Between a minimum and the next maximum the graph rises, and between a maximum and the next minimum it falls. Over one period, $y = \\sin x$ is **increasing** on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ and **decreasing** on $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$, and this repeats every $2\\pi$.\n\nOn $\\left(\\frac{11\\pi}{4}, 3\\pi\\right)$: subtract $2\\pi$ to get $\\left(\\frac{3\\pi}{4}, \\pi\\right)$, inside $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$, so sine is decreasing there.",
      "从最小值点到下一个最大值点图象上升，从最大值点到下一个最小值点图象下降。在一个周期内，$y = \\sin x$ 在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 上**递增**，在 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$ 上**递减**，并且每隔 $2\\pi$ 重复。\n\n在 $\\left(\\frac{11\\pi}{4}, 3\\pi\\right)$ 上：减去 $2\\pi$ 得 $\\left(\\frac{3\\pi}{4}, \\pi\\right)$，它在 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$ 内，所以正弦在那里递减。",
    ),
  }),
};

/** describingPropertiesOfTheCosineFunction states the domain, range, period, symmetry, zeros, extrema and monotony of cosine. */
export const describingPropertiesOfTheCosineFunction: TopicDef = {
  id: "describing-properties-of-the-cosine-function",
  title: t("Describing Properties of the Cosine Function", "描述余弦函数的性质"),
  summary: t(
    "Describe y = cos x: its domain and range, period 2π, even symmetry, zeros, maximum and minimum points, and intervals of increase and decrease.",
    "描述 y = cos x：定义域与值域、周期 2π、偶对称性、零点、最大值点与最小值点，以及单调区间。",
  ),
  prerequisites: ["describing-properties-of-the-sine-function"],
  encompasses: [
    { topic: "graphing-sine-and-cosine", weight: 0.4 },
    { topic: "even-and-odd-functions", weight: 0.2 },
    { topic: "local-extrema", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.TF.A.4"],
  knowledgePoints: propertyKnowledgePoints("cos", {
    domainRange: t(
      "The cosine of any angle is the $x$-coordinate of the point where its terminal side meets the unit circle, so the **domain** of $y = \\cos x$ is all real numbers and the **range** is $[-1, 1]$.\n\nSo $\\cos x = -\\frac{2}{3}$ has solutions, but $\\cos x = -\\frac{3}{2}$ has none. With a radical, compare the square with $1$: $\\left(\\frac{2\\sqrt{2}}{3}\\right)^2 = \\frac{8}{9} \\le 1$, so $\\cos x = \\frac{2\\sqrt{2}}{3}$ has solutions.",
      "任意角的余弦是其终边与单位圆交点的 $x$ 坐标，所以 $y = \\cos x$ 的**定义域**是全体实数，**值域**是 $[-1, 1]$。\n\n所以 $\\cos x = -\\frac{2}{3}$ 有解，而 $\\cos x = -\\frac{3}{2}$ 无解。含根号时，比较平方与 $1$：$\\left(\\frac{2\\sqrt{2}}{3}\\right)^2 = \\frac{8}{9} \\le 1$，所以 $\\cos x = \\frac{2\\sqrt{2}}{3}$ 有解。",
    ),
    periodSymmetry: t(
      "Like sine, cosine has **period** $2\\pi$: $\\cos(x + 2\\pi) = \\cos x$. The angles $x$ and $-x$ meet the unit circle at $(a, b)$ and $(a, -b)$, with the same $x$-coordinate, so $\\cos(-x) = \\cos x$: cosine is **even**, and its graph is symmetric about the $y$-axis.\n\nIf $\\cos \\theta = -\\frac{1}{4}$, then $\\cos(\\theta + 6\\pi) = -\\frac{1}{4}$ and $\\cos(4\\pi - \\theta) = \\cos(-\\theta) = -\\frac{1}{4}$.",
      "与正弦一样，余弦的**周期**是 $2\\pi$：$\\cos(x + 2\\pi) = \\cos x$。角 $x$ 与 $-x$ 与单位圆交于 $(a, b)$ 与 $(a, -b)$，$x$ 坐标相同，所以 $\\cos(-x) = \\cos x$：余弦是**偶函数**，图象关于 $y$ 轴对称。\n\n若 $\\cos \\theta = -\\frac{1}{4}$，则 $\\cos(\\theta + 6\\pi) = -\\frac{1}{4}$，$\\cos(4\\pi - \\theta) = \\cos(-\\theta) = -\\frac{1}{4}$。",
    ),
    features: t(
      "For integers $k$, $y = \\cos x$ has\n\n- **zeros** at $x = \\frac{\\pi}{2} + k\\pi$,\n- its **maximum** $1$ at $x = 2k\\pi$,\n- its **minimum** $-1$ at $x = \\pi + 2k\\pi$.\n\nFor the minimum with $-2\\pi \\le x < 0$, take $k = -1$: $x = \\pi - 2\\pi = -\\pi$.",
      "对整数 $k$，$y = \\cos x$ 有\n\n- **零点** $x = \\frac{\\pi}{2} + k\\pi$，\n- **最大值** $1$，在 $x = 2k\\pi$ 处取得，\n- **最小值** $-1$，在 $x = \\pi + 2k\\pi$ 处取得。\n\n求 $-2\\pi \\le x < 0$ 内的最小值点，取 $k = -1$：$x = \\pi - 2\\pi = -\\pi$。",
    ),
    monotony: t(
      "Over one period, $y = \\cos x$ is **decreasing** on $(0, \\pi)$, from its maximum to its minimum, and **increasing** on $(\\pi, 2\\pi)$, and this repeats every $2\\pi$.\n\nOn $\\left(-\\frac{3\\pi}{4}, -\\frac{\\pi}{2}\\right)$: add $2\\pi$ to get $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$, inside $(\\pi, 2\\pi)$, so cosine is increasing there.",
      "在一个周期内，$y = \\cos x$ 在 $(0, \\pi)$ 上从最大值降到最小值，**递减**；在 $(\\pi, 2\\pi)$ 上**递增**，并且每隔 $2\\pi$ 重复。\n\n在 $\\left(-\\frac{3\\pi}{4}, -\\frac{\\pi}{2}\\right)$ 上：加 $2\\pi$ 得 $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$，在 $(\\pi, 2\\pi)$ 内，所以余弦在那里递增。",
    ),
  }),
};

/** describingPropertiesOfTheTangentFunction states the domain, range, period, symmetry, zeros, asymptotes and monotony of tangent. */
export const describingPropertiesOfTheTangentFunction: TopicDef = {
  id: "describing-properties-of-the-tangent-function",
  title: t("Describing Properties of the Tangent Function", "描述正切函数的性质"),
  summary: t(
    "Describe y = tan x: its domain and range, period π, odd symmetry, zeros, vertical asymptotes, and where it increases.",
    "描述 y = tan x：定义域与值域、周期 π、奇对称性、零点、竖直渐近线，以及它的递增区间。",
  ),
  prerequisites: ["describing-properties-of-the-cosine-function", "graphing-tangent-and-cotangent"],
  encompasses: [
    { topic: "graphing-tangent-and-cotangent", weight: 0.4 },
    { topic: "describing-properties-of-the-sine-function", weight: 0.2 },
    { topic: "describing-properties-of-the-cosine-function", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.TF.A.4"],
  knowledgePoints: propertyKnowledgePoints("tan", {
    domainRange: t(
      "Since $\\tan x = \\frac{\\sin x}{\\cos x}$, it is undefined where $\\cos x = 0$:\n\n- the **domain** is all real numbers except $x = \\frac{\\pi}{2} + k\\pi$ for integers $k$;\n- the **range** is all real numbers, $(-\\infty, \\infty)$, since each branch rises from $-\\infty$ to $\\infty$.\n\nFor example, $\\tan \\frac{5\\pi}{2}$ is undefined, because $\\frac{5\\pi}{2} = \\frac{\\pi}{2} + 2\\pi$ and $\\cos \\frac{5\\pi}{2} = 0$; but $\\tan \\frac{5\\pi}{4} = 1$ is defined. Any value, such as $\\tan x = 25$, has solutions.",
      "因为 $\\tan x = \\frac{\\sin x}{\\cos x}$，它在 $\\cos x = 0$ 处无定义：\n\n- **定义域**是除 $x = \\frac{\\pi}{2} + k\\pi$（$k$ 为整数）以外的全体实数；\n- **值域**是全体实数 $(-\\infty, \\infty)$，因为每一支都从 $-\\infty$ 升到 $\\infty$。\n\n例如 $\\tan \\frac{5\\pi}{2}$ 无定义，因为 $\\frac{5\\pi}{2} = \\frac{\\pi}{2} + 2\\pi$，$\\cos \\frac{5\\pi}{2} = 0$；而 $\\tan \\frac{5\\pi}{4} = 1$ 有定义。任何值，如 $\\tan x = 25$，都有解。",
    ),
    periodSymmetry: t(
      "Adding $\\pi$ to an angle moves its point on the unit circle from $(a, b)$ to $(-a, -b)$, and $\\frac{-b}{-a} = \\frac{b}{a}$, so $\\tan(x + \\pi) = \\tan x$: the **period** is $\\pi$, half that of sine and cosine. Also $\\tan(-x) = \\frac{-\\sin x}{\\cos x} = -\\tan x$: tangent is **odd**.\n\nIf $\\tan \\theta = \\frac{7}{3}$, then $\\tan(\\theta + 3\\pi) = \\frac{7}{3}$ and $\\tan(2\\pi - \\theta) = \\tan(-\\theta) = -\\frac{7}{3}$.",
      "给角加上 $\\pi$，它在单位圆上的点从 $(a, b)$ 变为 $(-a, -b)$，而 $\\frac{-b}{-a} = \\frac{b}{a}$，所以 $\\tan(x + \\pi) = \\tan x$：**周期**是 $\\pi$，是正弦、余弦周期的一半。又 $\\tan(-x) = \\frac{-\\sin x}{\\cos x} = -\\tan x$：正切是**奇函数**。\n\n若 $\\tan \\theta = \\frac{7}{3}$，则 $\\tan(\\theta + 3\\pi) = \\frac{7}{3}$，$\\tan(2\\pi - \\theta) = \\tan(-\\theta) = -\\frac{7}{3}$。",
    ),
    features: t(
      "For integers $k$, $y = \\tan x$ has **zeros** where $\\sin x = 0$, at $x = k\\pi$, and **vertical asymptotes** where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$. It has no maximum or minimum. Each interval of length $\\pi$ such as $a \\le x < a + \\pi$ contains exactly one of each.\n\nFor the asymptote with $2\\pi \\le x < 3\\pi$, take $k = 2$: $x = \\frac{\\pi}{2} + 2\\pi = \\frac{5\\pi}{2}$.",
      "对整数 $k$，$y = \\tan x$ 在 $\\sin x = 0$ 处有**零点** $x = k\\pi$，在 $\\cos x = 0$ 处有**竖直渐近线** $x = \\frac{\\pi}{2} + k\\pi$。它没有最大值和最小值。每个长为 $\\pi$ 的区间，如 $a \\le x < a + \\pi$，各恰含一个。\n\n求 $2\\pi \\le x < 3\\pi$ 内的渐近线，取 $k = 2$：$x = \\frac{\\pi}{2} + 2\\pi = \\frac{5\\pi}{2}$。",
    ),
    monotony: t(
      "On each branch, $\\left(-\\frac{\\pi}{2} + k\\pi, \\frac{\\pi}{2} + k\\pi\\right)$, the graph of $y = \\tan x$ rises from $-\\infty$ to $\\infty$: tangent is **increasing** on every interval between consecutive asymptotes, and never decreasing. (It is not increasing across an asymptote: $\\tan \\frac{\\pi}{4} = 1 > \\tan \\frac{3\\pi}{4} = -1$.)\n\nOn $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$: subtract $\\pi$ to get $\\left(\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right)$, inside $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, so tangent is increasing there.",
      "在每一支 $\\left(-\\frac{\\pi}{2} + k\\pi, \\frac{\\pi}{2} + k\\pi\\right)$ 上，$y = \\tan x$ 的图象从 $-\\infty$ 升到 $\\infty$：正切在相邻两条渐近线之间的每个区间上都**递增**，从不递减。（跨过渐近线时不是递增的：$\\tan \\frac{\\pi}{4} = 1 > \\tan \\frac{3\\pi}{4} = -1$。）\n\n在 $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$ 上：减去 $\\pi$ 得 $\\left(\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right)$，在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 内，所以正切在那里递增。",
    ),
  }),
};

/** describingPropertiesOfTheSecantFunction states the domain, range, period, symmetry, asymptotes, local extrema and monotony of secant. */
export const describingPropertiesOfTheSecantFunction: TopicDef = {
  id: "describing-properties-of-the-secant-function",
  title: t("Describing Properties of the Secant Function", "描述正割函数的性质"),
  summary: t(
    "Describe y = sec x: its domain and range, period 2π, even symmetry, vertical asymptotes, local extrema, and intervals of increase and decrease.",
    "描述 y = sec x：定义域与值域、周期 2π、偶对称性、竖直渐近线、极值，以及单调区间。",
  ),
  prerequisites: ["describing-properties-of-the-tangent-function", "graphing-secant-and-cosecant"],
  encompasses: [
    { topic: "graphing-secant-and-cosecant", weight: 0.4 },
    { topic: "describing-properties-of-the-cosine-function", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4"],
  knowledgePoints: propertyKnowledgePoints("sec", {
    domainRange: t(
      "Since $\\sec x = \\frac{1}{\\cos x}$:\n\n- the **domain** is all real numbers except where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$;\n- the **range** is $(-\\infty, -1] \\cup [1, \\infty)$: where defined, $0 < |\\cos x| \\le 1$, so $|\\sec x| \\ge 1$.\n\nSo $\\sec x = \\frac{1}{2}$ has no solution, since it would need $\\cos x = 2$; but $\\sec x = -3$ has solutions, with $\\cos x = -\\frac{1}{3}$.",
      "因为 $\\sec x = \\frac{1}{\\cos x}$：\n\n- **定义域**是除 $\\cos x = 0$ 处，即 $x = \\frac{\\pi}{2} + k\\pi$ 以外的全体实数；\n- **值域**是 $(-\\infty, -1] \\cup [1, \\infty)$：在有定义处 $0 < |\\cos x| \\le 1$，所以 $|\\sec x| \\ge 1$。\n\n所以 $\\sec x = \\frac{1}{2}$ 无解，因为那需要 $\\cos x = 2$；而 $\\sec x = -3$ 有解，此时 $\\cos x = -\\frac{1}{3}$。",
    ),
    periodSymmetry: t(
      "Secant inherits its properties from cosine: $\\sec(x + 2\\pi) = \\frac{1}{\\cos(x + 2\\pi)} = \\sec x$, so the **period** is $2\\pi$, and $\\sec(-x) = \\frac{1}{\\cos(-x)} = \\sec x$, so secant is **even**, with its graph symmetric about the $y$-axis.\n\nIf $\\sec \\theta = \\frac{9}{4}$, then $\\sec(\\theta - 2\\pi) = \\frac{9}{4}$ and $\\sec(-\\theta) = \\frac{9}{4}$.",
      "正割的性质来自余弦：$\\sec(x + 2\\pi) = \\frac{1}{\\cos(x + 2\\pi)} = \\sec x$，所以**周期**是 $2\\pi$；$\\sec(-x) = \\frac{1}{\\cos(-x)} = \\sec x$，所以正割是**偶函数**，图象关于 $y$ 轴对称。\n\n若 $\\sec \\theta = \\frac{9}{4}$，则 $\\sec(\\theta - 2\\pi) = \\frac{9}{4}$，$\\sec(-\\theta) = \\frac{9}{4}$。",
    ),
    features: t(
      "For integers $k$, $y = \\sec x$ has **vertical asymptotes** at $x = \\frac{\\pi}{2} + k\\pi$ and no zeros, since $\\frac{1}{\\cos x}$ is never $0$. Where $\\cos x$ has its maximum $1$, secant has a **local minimum** $1$, at $x = 2k\\pi$; where $\\cos x$ has its minimum $-1$, secant has a **local maximum** $-1$, at $x = \\pi + 2k\\pi$.\n\nFor the local maximum with $2\\pi \\le x < 4\\pi$, take $k = 1$: $x = \\pi + 2\\pi = 3\\pi$.",
      "对整数 $k$，$y = \\sec x$ 有**竖直渐近线** $x = \\frac{\\pi}{2} + k\\pi$，没有零点，因为 $\\frac{1}{\\cos x}$ 永不为 $0$。在 $\\cos x$ 取最大值 $1$ 处，正割有**极小值** $1$，即 $x = 2k\\pi$；在 $\\cos x$ 取最小值 $-1$ 处，正割有**极大值** $-1$，即 $x = \\pi + 2k\\pi$。\n\n求 $2\\pi \\le x < 4\\pi$ 内的极大值点，取 $k = 1$：$x = \\pi + 2\\pi = 3\\pi$。",
    ),
    monotony: t(
      "Taking reciprocals of numbers of the same sign reverses their order, so secant increases where cosine decreases, and the other way around. Over one period, $y = \\sec x$ is **increasing** on $\\left(0, \\frac{\\pi}{2}\\right)$ and $\\left(\\frac{\\pi}{2}, \\pi\\right)$, and **decreasing** on $\\left(\\pi, \\frac{3\\pi}{2}\\right)$ and $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$.\n\nOn $\\left(-\\frac{\\pi}{4}, 0\\right)$: add $2\\pi$ to get $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$, inside $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$, so secant is decreasing there.",
      "对同号的数取倒数会颠倒它们的大小顺序，所以余弦递减处正割递增，反之亦然。在一个周期内，$y = \\sec x$ 在 $\\left(0, \\frac{\\pi}{2}\\right)$ 和 $\\left(\\frac{\\pi}{2}, \\pi\\right)$ 上**递增**，在 $\\left(\\pi, \\frac{3\\pi}{2}\\right)$ 和 $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$ 上**递减**。\n\n在 $\\left(-\\frac{\\pi}{4}, 0\\right)$ 上：加 $2\\pi$ 得 $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$，在 $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$ 内，所以正割在那里递减。",
    ),
  }),
};

/** describingPropertiesOfTheCosecantFunction states the domain, range, period, symmetry, asymptotes, local extrema and monotony of cosecant. */
export const describingPropertiesOfTheCosecantFunction: TopicDef = {
  id: "describing-properties-of-the-cosecant-function",
  title: t("Describing Properties of the Cosecant Function", "描述余割函数的性质"),
  summary: t(
    "Describe y = csc x: its domain and range, period 2π, odd symmetry, vertical asymptotes, local extrema, and intervals of increase and decrease.",
    "描述 y = csc x：定义域与值域、周期 2π、奇对称性、竖直渐近线、极值，以及单调区间。",
  ),
  prerequisites: ["describing-properties-of-the-secant-function"],
  encompasses: [
    { topic: "describing-properties-of-the-secant-function", weight: 0.3 },
    { topic: "describing-properties-of-the-sine-function", weight: 0.3 },
    { topic: "graphing-secant-and-cosecant", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4"],
  knowledgePoints: propertyKnowledgePoints("csc", {
    domainRange: t(
      "Since $\\csc x = \\frac{1}{\\sin x}$:\n\n- the **domain** is all real numbers except where $\\sin x = 0$, at $x = k\\pi$;\n- the **range** is $(-\\infty, -1] \\cup [1, \\infty)$: where defined, $0 < |\\sin x| \\le 1$, so $|\\csc x| \\ge 1$.\n\nSo $\\csc x = -\\frac{2}{5}$ has no solution, since it would need $\\sin x = -\\frac{5}{2}$; but $\\csc x = \\frac{5}{2}$ has solutions, with $\\sin x = \\frac{2}{5}$.",
      "因为 $\\csc x = \\frac{1}{\\sin x}$：\n\n- **定义域**是除 $\\sin x = 0$ 处，即 $x = k\\pi$ 以外的全体实数；\n- **值域**是 $(-\\infty, -1] \\cup [1, \\infty)$：在有定义处 $0 < |\\sin x| \\le 1$，所以 $|\\csc x| \\ge 1$。\n\n所以 $\\csc x = -\\frac{2}{5}$ 无解，因为那需要 $\\sin x = -\\frac{5}{2}$；而 $\\csc x = \\frac{5}{2}$ 有解，此时 $\\sin x = \\frac{2}{5}$。",
    ),
    periodSymmetry: t(
      "Cosecant inherits its properties from sine: the **period** is $2\\pi$, and $\\csc(-x) = \\frac{1}{\\sin(-x)} = -\\csc x$, so cosecant is **odd**, with its graph symmetric about the origin.\n\nIf $\\csc \\theta = -\\frac{5}{3}$, then $\\csc(\\theta + 4\\pi) = -\\frac{5}{3}$ and $\\csc(-\\theta) = \\frac{5}{3}$.",
      "余割的性质来自正弦：**周期**是 $2\\pi$；$\\csc(-x) = \\frac{1}{\\sin(-x)} = -\\csc x$，所以余割是**奇函数**，图象关于原点对称。\n\n若 $\\csc \\theta = -\\frac{5}{3}$，则 $\\csc(\\theta + 4\\pi) = -\\frac{5}{3}$，$\\csc(-\\theta) = \\frac{5}{3}$。",
    ),
    features: t(
      "For integers $k$, $y = \\csc x$ has **vertical asymptotes** at $x = k\\pi$ and no zeros. Where $\\sin x$ has its maximum $1$, cosecant has a **local minimum** $1$, at $x = \\frac{\\pi}{2} + 2k\\pi$; where $\\sin x$ has its minimum $-1$, cosecant has a **local maximum** $-1$, at $x = \\frac{3\\pi}{2} + 2k\\pi$.\n\nFor the local minimum with $-2\\pi \\le x < 0$, take $k = -1$: $x = \\frac{\\pi}{2} - 2\\pi = -\\frac{3\\pi}{2}$.",
      "对整数 $k$，$y = \\csc x$ 有**竖直渐近线** $x = k\\pi$，没有零点。在 $\\sin x$ 取最大值 $1$ 处，余割有**极小值** $1$，即 $x = \\frac{\\pi}{2} + 2k\\pi$；在 $\\sin x$ 取最小值 $-1$ 处，余割有**极大值** $-1$，即 $x = \\frac{3\\pi}{2} + 2k\\pi$。\n\n求 $-2\\pi \\le x < 0$ 内的极小值点，取 $k = -1$：$x = \\frac{\\pi}{2} - 2\\pi = -\\frac{3\\pi}{2}$。",
    ),
    monotony: t(
      "Cosecant increases where sine decreases, and the other way around. Over one period, $y = \\csc x$ is **decreasing** on $\\left(-\\frac{\\pi}{2}, 0\\right)$ and $\\left(0, \\frac{\\pi}{2}\\right)$, and **increasing** on $\\left(\\frac{\\pi}{2}, \\pi\\right)$ and $\\left(\\pi, \\frac{3\\pi}{2}\\right)$.\n\nOn $\\left(\\frac{5\\pi}{2}, \\frac{11\\pi}{4}\\right)$: subtract $2\\pi$ to get $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$, inside $\\left(\\frac{\\pi}{2}, \\pi\\right)$, so cosecant is increasing there.",
      "正弦递减处余割递增，反之亦然。在一个周期内，$y = \\csc x$ 在 $\\left(-\\frac{\\pi}{2}, 0\\right)$ 和 $\\left(0, \\frac{\\pi}{2}\\right)$ 上**递减**，在 $\\left(\\frac{\\pi}{2}, \\pi\\right)$ 和 $\\left(\\pi, \\frac{3\\pi}{2}\\right)$ 上**递增**。\n\n在 $\\left(\\frac{5\\pi}{2}, \\frac{11\\pi}{4}\\right)$ 上：减去 $2\\pi$ 得 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$，在 $\\left(\\frac{\\pi}{2}, \\pi\\right)$ 内，所以余割在那里递增。",
    ),
  }),
};

/** describingPropertiesOfTheCotangentFunction states the domain, range, period, symmetry, zeros, asymptotes and monotony of cotangent. */
export const describingPropertiesOfTheCotangentFunction: TopicDef = {
  id: "describing-properties-of-the-cotangent-function",
  title: t("Describing Properties of the Cotangent Function", "描述余切函数的性质"),
  summary: t(
    "Describe y = cot x: its domain and range, period π, odd symmetry, zeros, vertical asymptotes, and where it decreases.",
    "描述 y = cot x：定义域与值域、周期 π、奇对称性、零点、竖直渐近线，以及它的递减区间。",
  ),
  prerequisites: ["describing-properties-of-the-tangent-function"],
  encompasses: [
    { topic: "describing-properties-of-the-tangent-function", weight: 0.4 },
    { topic: "graphing-tangent-and-cotangent", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4"],
  knowledgePoints: propertyKnowledgePoints("cot", {
    domainRange: t(
      "Since $\\cot x = \\frac{\\cos x}{\\sin x}$, it is undefined where $\\sin x = 0$:\n\n- the **domain** is all real numbers except $x = k\\pi$ for integers $k$;\n- the **range** is all real numbers, $(-\\infty, \\infty)$, since each branch falls from $\\infty$ to $-\\infty$.\n\nFor example, $\\cot(-2\\pi)$ is undefined, since $\\sin(-2\\pi) = 0$; but $\\cot \\frac{3\\pi}{2} = 0$ is defined.",
      "因为 $\\cot x = \\frac{\\cos x}{\\sin x}$，它在 $\\sin x = 0$ 处无定义：\n\n- **定义域**是除 $x = k\\pi$（$k$ 为整数）以外的全体实数；\n- **值域**是全体实数 $(-\\infty, \\infty)$，因为每一支都从 $\\infty$ 降到 $-\\infty$。\n\n例如 $\\cot(-2\\pi)$ 无定义，因为 $\\sin(-2\\pi) = 0$；而 $\\cot \\frac{3\\pi}{2} = 0$ 有定义。",
    ),
    periodSymmetry: t(
      "Like tangent, cotangent is a ratio of the coordinates, unchanged when the point $(a, b)$ moves to $(-a, -b)$, so its **period** is $\\pi$: $\\cot(x + \\pi) = \\cot x$. Also $\\cot(-x) = \\frac{\\cos x}{-\\sin x} = -\\cot x$: cotangent is **odd**.\n\nIf $\\cot \\theta = -\\frac{8}{5}$, then $\\cot(\\theta - 2\\pi) = -\\frac{8}{5}$ and $\\cot(-\\theta) = \\frac{8}{5}$.",
      "与正切一样，余切是坐标之比，点 $(a, b)$ 变为 $(-a, -b)$ 时不变，所以它的**周期**是 $\\pi$：$\\cot(x + \\pi) = \\cot x$。又 $\\cot(-x) = \\frac{\\cos x}{-\\sin x} = -\\cot x$：余切是**奇函数**。\n\n若 $\\cot \\theta = -\\frac{8}{5}$，则 $\\cot(\\theta - 2\\pi) = -\\frac{8}{5}$，$\\cot(-\\theta) = \\frac{8}{5}$。",
    ),
    features: t(
      "For integers $k$, $y = \\cot x$ has **zeros** where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$, and **vertical asymptotes** where $\\sin x = 0$, at $x = k\\pi$: exactly where tangent has its asymptotes and zeros. It has no maximum or minimum.\n\nFor the zero with $-\\pi \\le x < 0$, take $k = -1$: $x = \\frac{\\pi}{2} - \\pi = -\\frac{\\pi}{2}$.",
      "对整数 $k$，$y = \\cot x$ 在 $\\cos x = 0$ 处有**零点** $x = \\frac{\\pi}{2} + k\\pi$，在 $\\sin x = 0$ 处有**竖直渐近线** $x = k\\pi$：恰好是正切的渐近线和零点所在。它没有最大值和最小值。\n\n求 $-\\pi \\le x < 0$ 内的零点，取 $k = -1$：$x = \\frac{\\pi}{2} - \\pi = -\\frac{\\pi}{2}$。",
    ),
    monotony: t(
      "On each branch, $(k\\pi, \\pi + k\\pi)$, the graph of $y = \\cot x$ falls from $\\infty$ to $-\\infty$: cotangent is **decreasing** on every interval between consecutive asymptotes, and never increasing.\n\nOn $\\left(-\\frac{\\pi}{2}, -\\frac{\\pi}{4}\\right)$: add $\\pi$ to get $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$, inside $(0, \\pi)$, so cotangent is decreasing there.",
      "在每一支 $(k\\pi, \\pi + k\\pi)$ 上，$y = \\cot x$ 的图象从 $\\infty$ 降到 $-\\infty$：余切在相邻两条渐近线之间的每个区间上都**递减**，从不递增。\n\n在 $\\left(-\\frac{\\pi}{2}, -\\frac{\\pi}{4}\\right)$ 上：加 $\\pi$ 得 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$，在 $(0, \\pi)$ 内，所以余切在那里递减。",
    ),
  }),
};

/** algebraIITrigonometricGraphTopics are the topics of the special ratios, graphs and properties modules of Algebra II, in outline order. */
export const algebraIITrigonometricGraphTopics: readonly TopicDef[] = [
  findingTrigonometricRatiosOfQuadrantalAngles,
  trigonometricRatiosOfQuadrantalAnglesOutsideTheStandardRange,
  findingTrigonometricRatiosOfSpecialAnglesUsingTheUnitCircle,
  evaluatingTrigonometricExpressions,
  furtherExtensionsOfTheSpecialTrigonometricRatios,
  graphingSineAndCosine,
  graphingTangentAndCotangent,
  graphingSecantAndCosecant,
  describingPropertiesOfTheSineFunction,
  describingPropertiesOfTheCosineFunction,
  describingPropertiesOfTheTangentFunction,
  describingPropertiesOfTheSecantFunction,
  describingPropertiesOfTheCosecantFunction,
  describingPropertiesOfTheCotangentFunction,
];
