import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
  gcd,
  type Interval,
  intervalLatex,
  type PlaneMark,
  plane,
  poly,
  Q,
  q,
  type RealSet,
  radical,
  realLine,
  simplifyRadical,
  union,
} from "@ga/subject-math";
import { remainingDrawings4 } from "../explanation-drawings-remaining-4.ts";
import { trigDrawings } from "../explanation-drawings-trig.ts";
import { waveDrawings } from "../explanation-drawings-waves.ts";
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
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled, with a reason for each wrong one. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return reasoned(choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution }), reasons);
}

/** dec writes a decimal approximation to three places: "0.866", "-1.5", "0". */
function dec(x: number): string {
  const r = Math.round(x * 1000) / 1000;
  return String(r === 0 ? 0 : r);
}

/** said writes a check sentence in each locale: "**Check.** …" and "**检验。**…", as its own paragraph. */
const said = (en: string, zh: string) => t(`\n\n**Check.** ${en}`, `\n\n**检验。**${zh}`);

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

/** approx is the decimal value of an exact number. */
const approx = (s: S) => (Number(s[0].n) / Number(s[0].d)) * Math.sqrt(s[1]);

/** squared writes s² as it is computed: "0^2", "\left(-\frac{1}{2}\right)^2". */
const squared = (s: S) => (s[1] === 1 && s[0].isInteger() && s[0].sign() >= 0 ? `${sTex(s)}^2` : `\\left(${sTex(s)}\\right)^2`);

/** onCircle writes the check that (x, y) is on the unit circle: "x² + y² = … = 1". */
const onCircle = (x: S, y: S) => `${squared(x)} + ${squared(y)} = ${sSquare(x).toLatex()} + ${sSquare(y).toLatex()} = 1`;

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
  const s1 = stepLabel(1, "Find the point on the unit circle", "找出单位圆上的点");
  const s2 = stepLabel(2, `Use the definition of ${fnNames[f].en}`, `用${fnNames[f]["zh-CN"]}的定义`);
  const den = f === "tan" || f === "sec" ? "x" : "y";
  const last = v
    ? f === "sin" || f === "cos"
      ? both(
          `\n\n${s2.en} The ${fnNames[f].en} is the $${formulas[f]}$-coordinate of $P$:`,
          `\n\n${s2["zh-CN"]}${fnNames[f]["zh-CN"]}是 $P$ 的 $${formulas[f]}$ 坐标：`,
          `${c} = ${formulas[f]} = ${sTex(v)}`,
        )
      : both(
          `\n\n${s2.en} Put the coordinates of $P$ into $${c} = ${formulas[f]}$:`,
          `\n\n${s2["zh-CN"]}把 $P$ 的坐标代入 $${c} = ${formulas[f]}$：`,
          `${c} = ${formulas[f]} = ${substituted(f, x, y)} = ${sTex(v)}`,
        )
    : t(
        `\n\n${s2.en} Here $${den} = 0$. Division by zero is not defined, so $${c}$ is not defined, since by definition $${c} = ${formulas[f]}$.`,
        `\n\n${s2["zh-CN"]}这里 $${den} = 0$。除以零无意义，而按定义 $${c} = ${formulas[f]}$，所以 $${c}$ 无定义。`,
      );
  return join(t(`${s1.en} `, s1["zh-CN"]), whereText(d, inRad), last, valueCheck(f, d, inRad));
}

/** valueCheck checks the value of a ratio of d degrees by a second route: the unit circle for sine and cosine, the reciprocal ratio for the others. */
function valueCheck(f: Fn, d: number, inRad: boolean): Text {
  const m = mod(d, 360);
  const [x, y] = [cosS(m), sinS(m)];
  const v = exact(f, d);
  const c = call(f, angTex(d, inRad));
  const r = reciprocalOf[f];
  const rc = call(r, angTex(d, inRad));
  const rv = exact(r, d);
  if (f === "sin" || f === "cos") {
    const sign =
      m % 90 === 0
        ? t("", "")
        : t(
            ` In Quadrant ${roman[Math.floor(m / 90) + 1]} the $${formulas[f]}$-coordinate is ${v![0].sign() > 0 ? "positive" : "negative"}, and so is the answer.`,
            `在第${zhNumbers[Math.floor(m / 90) + 1]}象限，$${formulas[f]}$ 坐标为${v![0].sign() > 0 ? "正" : "负"}，答案也是${v![0].sign() > 0 ? "正" : "负"}的。`,
          );
    return join(said(`The point $P$ is on the unit circle: $${onCircle(x, y)}$.`, `点 $P$ 在单位圆上：$${onCircle(x, y)}$。`), sign);
  }
  if (!v) {
    return said(
      `The reciprocal ratio here is $${rc} = 0$, and $0$ has no reciprocal. So $${c}$ is indeed not defined, because $${c} = \\frac{1}{${rc}}$.`,
      `这里倒数三角比 $${rc} = 0$，而 $0$ 没有倒数。所以 $${c}$ 确实无定义，因为 $${c} = \\frac{1}{${rc}}$。`,
    );
  }
  if (v[0].isZero()) {
    const [num, den] = f === "tan" ? ["y", "x"] : ["x", "y"];
    const numV = sTex(f === "tan" ? y : x);
    const denV = sTex(f === "tan" ? x : y);
    return said(
      `The numerator is $${num} = ${numV}$ and the denominator is $${den} = ${denV} \\ne 0$, so the quotient is $0$.`,
      `分子 $${num} = ${numV}$，分母 $${den} = ${denV} \\ne 0$，所以商为 $0$。`,
    );
  }
  const product = `${c} \\cdot ${rc} = ${sTex(v)} \\cdot ${paren(rv!)} = 1`;
  return said(
    `A ratio times its reciprocal ratio is $1$. From the same point, $${rc} = ${sTex(rv!)}$. Indeed $${product}$.`,
    `三角比与它的倒数三角比之积为 $1$，由同一点得 $${rc} = ${sTex(rv!)}$。确实 $${product}$。`,
  );
}

/** pointSolution finds the point where the terminal side of an angle of d degrees meets the unit circle, and checks it. */
function pointSolution(d: number, inRad: boolean): Text {
  const m = mod(d, 360);
  const [x, y] = [cosS(m), sinS(m)];
  const i = m / 90;
  return join(
    whereText(d, inRad),
    said(
      `The point lies on ${axisEn[i]}, as the terminal side does, and on the unit circle: $${onCircle(x, y)}$.`,
      `该点在${axisZh[i]}上，与终边一致，并且在单位圆上：$${onCircle(x, y)}$。`,
    ),
  );
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
  return reasoned(
    choiceProblem({
      prompt: t(`Find $${c}$.`, `求 $${c}$。`),
      options: smallOptions,
      correct: v ? Number(v[0].n) + 1 : 3,
      solution: valueSolution(f, d, inRad),
    }),
    smallReasons(f, d, inRad),
  );
}

/** smallReasons says what is wrong with each wrong option −1, 0, 1 or Undefined for a ratio of a quadrantal angle. */
function smallReasons(f: Fn, d: number, inRad: boolean): Reason[] {
  const m = mod(d, 360);
  const [x, y] = [cosS(m)[0], sinS(m)[0]];
  const v = exact(f, d);
  const c = call(f, angTex(d, inRad));
  const den = f === "tan" || f === "sec" ? "x" : "y";
  const denV = (den === "x" ? x : y).toLatex();
  const p = `P = (${x.toLatex()}, ${y.toLatex()})`;
  const co = cofunction[f];
  const coV = exact(co, d);
  const out: Reason[] = [];
  if (v) {
    out.push([
      "Undefined",
      `The denominator is $${den} = ${denV}$, not $0$, so $${c}$ is defined.`,
      `分母 $${den} = ${denV}$ 不为 $0$，所以 $${c}$ 有定义。`,
    ]);
  }
  for (const w of [-1, 0, 1]) {
    const o = `$${w}$`;
    const wq = Q.of(w);
    if (!v) {
      out.push(
        w === 0
          ? [
              o,
              `The coordinate $${den} = 0$ is the denominator, and a quotient by $0$ is not $0$: it has no value at all.`,
              `坐标 $${den} = 0$ 在分母上，除以 $0$ 的商不是 $0$，而是根本没有值。`,
            ]
          : [
              o,
              `At $${p}$ the ratio divides by $${den} = 0$, which gives no number.`,
              `在 $${p}$ 处，这个比要除以 $${den} = 0$，得不到任何数。`,
            ],
      );
    } else if (v[0].eq(wq)) {
      // The correct option needs no reason.
    } else if (coV?.[0].eq(wq)) {
      out.push([
        o,
        `That is $${call(co, angTex(d, inRad))}$, the cofunction, which uses the other coordinate of $${p}$.`,
        `那是余函数 $${call(co, angTex(d, inRad))}$ 的值，它用的是 $${p}$ 的另一个坐标。`,
      ]);
    } else if (v[0].neg().eq(wq)) {
      out.push([o, `That has the wrong sign: with $${p}$ the ratio is $${sTex(v)}$.`, `符号错了：由 $${p}$ 得这个比为 $${sTex(v)}$。`]);
    } else if (v[0].isZero()) {
      const num = f === "tan" ? "y" : "x";
      out.push([o, `The numerator $${num}$ is $0$ at $${p}$, so the quotient is $0$.`, `在 $${p}$ 处分子 $${num}$ 为 $0$，所以商为 $0$。`]);
    } else if (f === "sec" || f === "csc") {
      out.push([o, `A reciprocal $\\frac{1}{${den}}$ is never $0$.`, `倒数 $\\frac{1}{${den}}$ 永远不为 $0$。`]);
    } else {
      const num = f === "tan" ? "y" : "x";
      const numV = (num === "x" ? x : y).toLatex();
      out.push([
        o,
        `The quotient is $0$ only when the numerator is, but here $${num} = ${numV}$.`,
        `只有分子为 $0$ 时商才为 $0$，而这里 $${num} = ${numV}$。`,
      ]);
    }
  }
  return out;
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
  encompasses: [{ topic: "extending-the-trigonometric-ratios-using-the-unit-circle", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.TF.A.2"],
  intro: t(
    `For any angle $\\theta$ in standard position, the terminal side meets the unit circle at the point $(\\cos \\theta, \\sin \\theta)$, and the other four ratios are quotients of those two coordinates. For most angles finding that point takes a triangle. When the terminal side lies on an axis, no triangle is needed: the point is one of the four places where the circle crosses the axes, and every coordinate is $0$, $1$ or $-1$.

Take $\\theta = 270^\\circ = \\frac{3\\pi}{2}$, three quarter turns. The terminal side points straight down, along the negative $y$-axis, so it meets the circle at $(0, -1)$:

$$\\cos 270^\\circ = 0, \\qquad \\sin 270^\\circ = -1, \\qquad \\cot 270^\\circ = \\frac{0}{-1} = 0.$$

The tangent would be $\\frac{-1}{0}$, and there is no such number, so $\\tan 270^\\circ$ is undefined. These values at the axes are the landmarks of the graphs of the trigonometric functions later on.`,
    `对标准位置下的任意角 $\\theta$，终边与单位圆交于点 $(\\cos \\theta, \\sin \\theta)$，其余四个三角比都是这两个坐标的商。对大多数角，求这个点要借助三角形。当终边落在坐标轴上时就不需要三角形：交点是单位圆与坐标轴的四个交点之一，每个坐标都是 $0$、$1$ 或 $-1$。

取 $\\theta = 270^\\circ = \\frac{3\\pi}{2}$，即转四分之三圈。终边竖直向下，沿 $y$ 轴负半轴，所以它与单位圆交于 $(0, -1)$：

$$\\cos 270^\\circ = 0, \\qquad \\sin 270^\\circ = -1, \\qquad \\cot 270^\\circ = \\frac{0}{-1} = 0.$$

正切将是 $\\frac{-1}{0}$，没有这样的数，所以 $\\tan 270^\\circ$ 无定义。坐标轴上的这些值，正是以后三角函数图象上的标志点。`,
  ),
  knowledgePoints: [
    {
      id: "sine-and-cosine-of-quadrantal-angles",
      figure: trigDrawings["finding-trigonometric-ratios-of-quadrantal-angles#sine-and-cosine-of-quadrantal-angles"],
      title: t("Sine and cosine of quadrantal angles", "象限角的正弦与余弦"),
      explanation: t(
        "A **quadrantal angle** has its terminal side on an axis. Its terminal side meets the unit circle at one of four points:\n\n| $\\theta$ | $0^\\circ$ | $90^\\circ$ | $180^\\circ$ | $270^\\circ$ |\n| :--- | :---: | :---: | :---: | :---: |\n| in radians | $0$ | $\\frac{\\pi}{2}$ | $\\pi$ | $\\frac{3\\pi}{2}$ |\n| point $(x, y)$ | $(1, 0)$ | $(0, 1)$ | $(-1, 0)$ | $(0, -1)$ |\n\nThe angle $360^\\circ = 2\\pi$ is a full turn and ends at $(1, 0)$ again. Since $\\cos \\theta = x$ and $\\sin \\theta = y$, read them off the point. For $180^\\circ$, the point is $(-1, 0)$, so $\\cos 180^\\circ = -1$ and $\\sin 180^\\circ = 0$.\n\n> **Watch out.** The cosine is the $x$-coordinate and the sine the $y$-coordinate, not the other way round. At $90^\\circ$ the point is $(0, 1)$, so $\\cos 90^\\circ = 0$ and $\\sin 90^\\circ = 1$; swapping them gives the values of the other ratio.",
        "**象限角**的终边在坐标轴上。它的终边与单位圆交于以下四点之一：\n\n| $\\theta$ | $0^\\circ$ | $90^\\circ$ | $180^\\circ$ | $270^\\circ$ |\n| :--- | :---: | :---: | :---: | :---: |\n| 弧度 | $0$ | $\\frac{\\pi}{2}$ | $\\pi$ | $\\frac{3\\pi}{2}$ |\n| 点 $(x, y)$ | $(1, 0)$ | $(0, 1)$ | $(-1, 0)$ | $(0, -1)$ |\n\n角 $360^\\circ = 2\\pi$ 是一整圈，又回到 $(1, 0)$。因为 $\\cos \\theta = x$，$\\sin \\theta = y$，直接从点读出。对 $180^\\circ$，交点为 $(-1, 0)$，所以 $\\cos 180^\\circ = -1$，$\\sin 180^\\circ = 0$。\n\n> **注意。** 余弦是 $x$ 坐标，正弦是 $y$ 坐标，不能颠倒。在 $90^\\circ$ 处交点为 $(0, 1)$，所以 $\\cos 90^\\circ = 0$，$\\sin 90^\\circ = 1$；两者对调，得到的就是另一个三角比的值。",
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
            solution: pointSolution(d, inRad),
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
      figure: remainingDrawings4["finding-trigonometric-ratios-of-quadrantal-angles#tangent-and-reciprocal-ratios-of-quadrantal-angles"],
      explanation: t(
        "The other ratios are quotients of the coordinates of the point $(x, y)$:\n\n$$\\tan \\theta = \\frac{y}{x}, \\quad \\cot \\theta = \\frac{x}{y}, \\quad \\sec \\theta = \\frac{1}{x}, \\quad \\csc \\theta = \\frac{1}{y}.$$\n\nAt a quadrantal angle one coordinate is $0$, and a ratio with $0$ in the denominator is **undefined**. For $90^\\circ$, the point is $(0, 1)$: $\\tan 90^\\circ = \\frac{1}{0}$ is undefined, $\\cot 90^\\circ = \\frac{0}{1} = 0$, $\\sec 90^\\circ$ is undefined and $\\csc 90^\\circ = \\frac{1}{1} = 1$.\n\n> **Watch out.** A zero in the numerator is harmless, a zero in the denominator is not. $\\cot 90^\\circ = \\frac{0}{1}$ is the number $0$, while $\\tan 90^\\circ = \\frac{1}{0}$ is not $0$ and not any other number: it is undefined. Look at which coordinate the ratio divides by before you answer.",
        "其他三角比是点 $(x, y)$ 坐标的商：\n\n$$\\tan \\theta = \\frac{y}{x}, \\quad \\cot \\theta = \\frac{x}{y}, \\quad \\sec \\theta = \\frac{1}{x}, \\quad \\csc \\theta = \\frac{1}{y}.$$\n\n象限角的交点有一个坐标为 $0$，分母为 $0$ 的比**无定义**。对 $90^\\circ$，交点为 $(0, 1)$：$\\tan 90^\\circ = \\frac{1}{0}$ 无定义，$\\cot 90^\\circ = \\frac{0}{1} = 0$，$\\sec 90^\\circ$ 无定义，$\\csc 90^\\circ = \\frac{1}{1} = 1$。\n\n> **注意。** 分子为零没关系，分母为零才是问题。$\\cot 90^\\circ = \\frac{0}{1}$ 就是数 $0$，而 $\\tan 90^\\circ = \\frac{1}{0}$ 既不是 $0$ 也不是任何别的数：它无定义。作答前先看这个比除以的是哪个坐标。",
      ),
      generate: (rng) => smallChoice(rng.pick<Fn>(["tan", "cot", "sec", "csc"]), rng.pick(quadrantal), rng.bool()),
    },
    {
      id: "expressions-with-quadrantal-angles",
      title: t("Expressions with quadrantal angles", "含象限角的式子"),
      figure: remainingDrawings4["finding-trigonometric-ratios-of-quadrantal-angles#expressions-with-quadrantal-angles"],
      explanation: t(
        "Each ratio of a quadrantal angle is just a number, $0$, $1$ or $-1$, so an expression built from them is ordinary arithmetic once every ratio is replaced by its value. For example, with $\\sin 270^\\circ = -1$ and $\\cos 180^\\circ = -1$:\n\n$$3\\sin 270^\\circ - 2\\cos 180^\\circ = 3(-1) - 2(-1) = -1.$$\n\n> **Watch out.** Put each value in parentheses with its sign. Above, $-2\\cos 180^\\circ = -2(-1) = 2$: dropping the sign of $\\cos 180^\\circ$ gives $-2$ instead, and the answer becomes $-5$.",
        "象限角的每个三角比都只是一个数：$0$、$1$ 或 $-1$。所以把式子里每个三角比换成它的值之后，就是普通的算术。例如 $\\sin 270^\\circ = -1$，$\\cos 180^\\circ = -1$：\n\n$$3\\sin 270^\\circ - 2\\cos 180^\\circ = 3(-1) - 2(-1) = -1.$$\n\n> **注意。** 代入时把每个值连同符号放进括号。上例中 $-2\\cos 180^\\circ = -2(-1) = 2$；若丢掉 $\\cos 180^\\circ$ 的负号，就得到 $-2$，答案也变成 $-5$。",
      ),
      generate(rng) {
        const inRad = rng.bool();
        for (;;) {
          const [d1, d2] = [rng.pick(quadrantal), rng.pick(quadrantal)];
          const [f1, f2] = [rng.pick<Fn>(["sin", "cos"]), rng.pick<Fn>(["sin", "cos"])];
          const [a, b] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
          const [v1, v2] = [exact(f1, d1)![0], exact(f2, d2)![0]];
          if ((v1.isZero() && v2.isZero()) || (f1 === f2 && d1 === d2)) continue;
          const [c1, c2] = [call(f1, angTex(d1, inRad)), call(f2, angTex(d2, inRad))];
          const expr = `${a === 1 ? "" : a === -1 ? "-" : a}${c1} ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}${c2}`;
          const answer = v1.mul(Q.of(a)).add(v2.mul(Q.of(b)));
          const par = (v: Q) => `(${v.toLatex()})`;
          const neg = (v: Q) => (v.sign() < 0 ? par(v) : v.toLatex());
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
            solution: (() => {
              const s1 = stepLabel(1, "Read the values", "读出各值");
              const s2 = stepLabel(2, "Substitute and simplify", "代入并化简");
              const [t1, t2] = [v1.mul(Q.of(a)), v2.mul(Q.of(b))];
              const point = (d: number) => `(${cosS(d)[0].toLatex()}, ${sinS(d)[0].toLatex()})`;
              return join(
                both(
                  `${s1.en} The terminal side of $${angTex(d1, inRad)}$ meets the unit circle at $${point(d1)}$, and that of $${angTex(d2, inRad)}$ at $${point(d2)}$. The sine is the $y$-coordinate and the cosine the $x$-coordinate:`,
                  `${s1["zh-CN"]}$${angTex(d1, inRad)}$ 的终边与单位圆交于 $${point(d1)}$，$${angTex(d2, inRad)}$ 的终边交于 $${point(d2)}$。正弦是 $y$ 坐标，余弦是 $x$ 坐标：`,
                  `${c1} = ${v1.toLatex()}, \\quad ${c2} = ${v2.toLatex()}`,
                ),
                both(
                  `${s2.en} Put each value in parentheses with its sign:`,
                  `${s2["zh-CN"]}把每个值连同符号放进括号：`,
                  `${expr} = ${a}${par(v1)} ${b > 0 ? "+" : "-"} ${Math.abs(b)}${par(v2)} = ${answer.toLatex()}`,
                ),
                said(
                  `Term by term, $${a} \\cdot ${neg(v1)} = ${t1.toLatex()}$ and $${b} \\cdot ${neg(v2)} = ${t2.toLatex()}$. Their sum is $${t1.toLatex()} + ${neg(t2)} = ${answer.toLatex()}$.`,
                  `逐项计算：$${a} \\cdot ${neg(v1)} = ${t1.toLatex()}$，$${b} \\cdot ${neg(v2)} = ${t2.toLatex()}$。两者之和为 $${t1.toLatex()} + ${neg(t2)} = ${answer.toLatex()}$。`,
                ),
              );
            })(),
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
  intro: t(
    `The ratios of $0^\\circ$, $90^\\circ$, $180^\\circ$ and $270^\\circ$ come straight from the points where the unit circle crosses the axes. An angle such as $630^\\circ$ or $-90^\\circ$ also ends on an axis, and its ratios depend only on where its terminal side ends. Coterminal angles, which differ by whole turns, end in the same place, so they have the same ratios.

Take $630^\\circ$. One full turn is $360^\\circ$, and

$$630^\\circ - 360^\\circ = 270^\\circ.$$

So $630^\\circ$ ends on the negative $y$-axis, at $(0, -1)$, and $\\sin 630^\\circ = \\sin 270^\\circ = -1$. Any angle on an axis, however large or negative, reduces this way to one of the four you already know.`,
    `$0^\\circ$、$90^\\circ$、$180^\\circ$、$270^\\circ$ 的三角比直接来自单位圆与坐标轴的交点。像 $630^\\circ$ 或 $-90^\\circ$ 这样的角，终边也落在坐标轴上，而它的三角比只取决于终边停在哪里。终边相同的角相差整数圈，停在同一处，所以三角比相同。

取 $630^\\circ$。一整圈是 $360^\\circ$，而

$$630^\\circ - 360^\\circ = 270^\\circ.$$

所以 $630^\\circ$ 的终边在 $y$ 轴负半轴上，交点为 $(0, -1)$，$\\sin 630^\\circ = \\sin 270^\\circ = -1$。终边在坐标轴上的角，无论多大或为负，都能这样化为已知的四个角之一。`,
  ),
  knowledgePoints: [
    {
      id: "quadrantal-angles-in-degrees-outside-the-standard-range",
      figure:
        trigDrawings[
          "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range#quadrantal-angles-in-degrees-outside-the-standard-range"
        ],
      title: t("Quadrantal angles in degrees", "角度制的象限角"),
      explanation: t(
        "Coterminal angles have the same ratios, so first add or subtract multiples of $360^\\circ$ to land between $0^\\circ$ and $360^\\circ$, then read the point on the unit circle.\n\nFor $\\cos 900^\\circ$: $900^\\circ - 2 \\cdot 360^\\circ = 180^\\circ$, whose terminal side meets the unit circle at $(-1, 0)$, so $\\cos 900^\\circ = -1$. For $\\tan(-270^\\circ)$: $-270^\\circ + 360^\\circ = 90^\\circ$, at $(0, 1)$, so $\\tan(-270^\\circ) = \\frac{1}{0}$ is undefined.\n\n> **Watch out.** Remove whole turns of $360^\\circ$ only. Taking away $900^\\circ - 3 \\cdot 180^\\circ = 360^\\circ$ lands at $(1, 0)$ instead of $(-1, 0)$, and gives $\\cos 900^\\circ = 1$, the right size with the wrong sign.",
        "终边相同的角三角比相同，所以先加减 $360^\\circ$ 的倍数，落到 $0^\\circ$ 与 $360^\\circ$ 之间，再读单位圆上的点。\n\n对 $\\cos 900^\\circ$：$900^\\circ - 2 \\cdot 360^\\circ = 180^\\circ$，终边与单位圆交于 $(-1, 0)$，所以 $\\cos 900^\\circ = -1$。对 $\\tan(-270^\\circ)$：$-270^\\circ + 360^\\circ = 90^\\circ$，交于 $(0, 1)$，所以 $\\tan(-270^\\circ) = \\frac{1}{0}$ 无定义。\n\n> **注意。** 只能去掉整圈 $360^\\circ$。若算成 $900^\\circ - 3 \\cdot 180^\\circ = 360^\\circ$，交点就成了 $(1, 0)$ 而不是 $(-1, 0)$，得到 $\\cos 900^\\circ = 1$：大小对了，符号却错了。",
      ),
      generate: (rng) => outsideProblem(rng, false),
    },
    {
      id: "quadrantal-angles-in-radians-outside-the-standard-range",
      figure:
        trigDrawings[
          "trigonometric-ratios-of-quadrantal-angles-outside-the-standard-range#quadrantal-angles-in-radians-outside-the-standard-range"
        ],
      title: t("Quadrantal angles in radians", "弧度制的象限角"),
      explanation: t(
        "In radians the quadrantal angles are the multiples of $\\frac{\\pi}{2}$, and a full turn is $2\\pi$, so whole turns are the even multiples of $\\pi$. For $\\sin \\frac{7\\pi}{2}$: $\\frac{7\\pi}{2} - 2\\pi = \\frac{3\\pi}{2}$, at $(0, -1)$, so $\\sin \\frac{7\\pi}{2} = -1$. For $\\sec(-3\\pi)$: $-3\\pi + 4\\pi = \\pi$, at $(-1, 0)$, so $\\sec(-3\\pi) = \\frac{1}{-1} = -1$.\n\n> **Watch out.** A full turn is $2\\pi$, not $\\pi$. Adding $\\pi$ to $-3\\pi$ gives $-2\\pi$, which ends at $(1, 0)$ instead of $(-1, 0)$ and flips the sign of the answer.",
        "用弧度表示时，象限角是 $\\frac{\\pi}{2}$ 的倍数，一整圈是 $2\\pi$，所以整圈就是 $\\pi$ 的偶数倍。对 $\\sin \\frac{7\\pi}{2}$：$\\frac{7\\pi}{2} - 2\\pi = \\frac{3\\pi}{2}$，交于 $(0, -1)$，所以 $\\sin \\frac{7\\pi}{2} = -1$。对 $\\sec(-3\\pi)$：$-3\\pi + 4\\pi = \\pi$，交于 $(-1, 0)$，所以 $\\sec(-3\\pi) = \\frac{1}{-1} = -1$。\n\n> **注意。** 一整圈是 $2\\pi$，不是 $\\pi$。给 $-3\\pi$ 加上 $\\pi$ 得 $-2\\pi$，交点成了 $(1, 0)$ 而不是 $(-1, 0)$，答案的符号也随之颠倒。",
      ),
      generate: (rng) => outsideProblem(rng, true),
    },
  ],
};

/** unitCirclePairFigure draws the unit circle with the points at angles a and b degrees, the radius to each and a dashed segment joining them unless they are opposite; labels name the angles. */
function unitCirclePairFigure(a: number, b: number, labels: readonly [string, string], alt: Text): Figure {
  const on = (d: number): [number, number] => [Math.cos((d * Math.PI) / 180), Math.sin((d * Math.PI) / 180)];
  const dir = (d: number) => (["ne", "nw", "sw", "se"] as const)[Math.floor((((d % 360) + 360) % 360) / 90)];
  const [pa, pb] = [on(a), on(b)];
  return {
    svg: plane({ xMin: -1.5, xMax: 1.5, yMin: -1.5, yMax: 1.5, step: 0.5, labelEvery: 2 }, [
      { kind: "circle", center: [0, 0], r: 1 },
      { kind: "segment", a: [0, 0], b: pa },
      { kind: "segment", a: [0, 0], b: pb, accent: true },
      // Opposite points already lie on one line through the origin.
      ...(Math.abs(b - a) === 180 ? [] : [{ kind: "segment", a: pa, b: pb, dashed: true } as const]),
      { kind: "point", at: pa, label: labels[0], dir: dir(a) },
      { kind: "point", at: pb, label: labels[1], dir: dir(b), accent: true },
    ]),
    alt,
  };
}

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
    { topic: "extending-the-trigonometric-ratios-using-angles-in-radians", weight: 0.3 },
    { topic: "special-trigonometric-ratios", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.A.2", "CCSS.HSF.TF.A.3"],
  intro: t(
    `The special right triangles give the exact sides for $30^\\circ$, $45^\\circ$ and $60^\\circ$: with hypotenuse $1$, the legs of the $30^\\circ$–$60^\\circ$–$90^\\circ$ triangle are $\\frac{1}{2}$ and $\\frac{\\sqrt{3}}{2}$, and those of the $45^\\circ$–$45^\\circ$–$90^\\circ$ triangle are both $\\frac{\\sqrt{2}}{2}$. On the unit circle the hypotenuse is a radius, so these legs are the coordinates of a point. That gives exact values at every multiple of $30^\\circ$ and $45^\\circ$, not just in Quadrant I.

Take $330^\\circ$. Its terminal side is $30^\\circ$ short of a full turn, in Quadrant IV, so the triangle it makes with the $x$-axis has a $30^\\circ$ angle at the origin: the **reference angle** is $360^\\circ - 330^\\circ = 30^\\circ$. The legs are $\\frac{\\sqrt{3}}{2}$ across and $\\frac{1}{2}$ down, so the point is

$$\\left(\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right), \\qquad \\cos 330^\\circ = \\frac{\\sqrt{3}}{2}, \\qquad \\sin 330^\\circ = -\\frac{1}{2}.$$

The reference angle fixes the sizes of the coordinates, and the quadrant fixes their signs.`,
    `特殊直角三角形给出了 $30^\\circ$、$45^\\circ$、$60^\\circ$ 的精确边长：斜边为 $1$ 时，$30^\\circ$–$60^\\circ$–$90^\\circ$ 三角形的两条直角边是 $\\frac{1}{2}$ 和 $\\frac{\\sqrt{3}}{2}$，$45^\\circ$–$45^\\circ$–$90^\\circ$ 三角形的两条直角边都是 $\\frac{\\sqrt{2}}{2}$。在单位圆上，斜边就是半径，所以这些直角边就是一个点的坐标。这样，不只第一象限，$30^\\circ$ 与 $45^\\circ$ 的每个倍数都有精确值。

取 $330^\\circ$。它的终边差 $30^\\circ$ 转满一圈，在第四象限，所以它与 $x$ 轴构成的三角形在原点处的角是 $30^\\circ$：**参考角**为 $360^\\circ - 330^\\circ = 30^\\circ$。两条直角边是横向 $\\frac{\\sqrt{3}}{2}$、向下 $\\frac{1}{2}$，所以交点为

$$\\left(\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right), \\qquad \\cos 330^\\circ = \\frac{\\sqrt{3}}{2}, \\qquad \\sin 330^\\circ = -\\frac{1}{2}.$$

参考角决定坐标的大小，象限决定坐标的符号。`,
  ),
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
          "\n\nAn angle with one of these as its reference angle makes the same triangle with the $x$-axis, only reflected, so it meets the circle at the same point up to the signs of the coordinates, which the quadrant decides. For $150^\\circ$: Quadrant II, reference angle $180^\\circ - 150^\\circ = 30^\\circ$, so the point is $\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$, and\n\n$$\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}, \\qquad \\tan 150^\\circ = \\frac{1/2}{-\\sqrt{3}/2} = -\\frac{\\sqrt{3}}{3}.$$\n\n> **Watch out.** Take the sizes from the reference angle and the signs from the quadrant, and keep both. Writing $\\cos 150^\\circ = \\frac{\\sqrt{3}}{2}$ forgets that $x$ is negative in Quadrant II, and writing $\\cos 150^\\circ = -\\frac{1}{2}$ uses the $y$-size, which belongs to the sine.",
          "\n\n以它们为参考角的角，与 $x$ 轴构成同样的三角形，只是位置经过了翻折，所以它与单位圆的交点只在坐标符号上不同，符号由象限决定。对 $150^\\circ$：在第二象限，参考角 $180^\\circ - 150^\\circ = 30^\\circ$，交点为 $\\left(-\\frac{\\sqrt{3}}{2}, \\frac{1}{2}\\right)$，所以\n\n$$\\cos 150^\\circ = -\\frac{\\sqrt{3}}{2}, \\qquad \\tan 150^\\circ = \\frac{1/2}{-\\sqrt{3}/2} = -\\frac{\\sqrt{3}}{3}.$$\n\n> **注意。** 大小取自参考角，符号取自象限，两者都要保留。写成 $\\cos 150^\\circ = \\frac{\\sqrt{3}}{2}$ 是忘了第二象限的 $x$ 为负；写成 $\\cos 150^\\circ = -\\frac{1}{2}$ 则用了 $y$ 的大小，那属于正弦。",
        ),
      ),
      figure: unitCirclePairFigure(
        30,
        150,
        ["30°", "150°"],
        t(
          "The unit circle with the points at 30° and 150°. They are mirror images across the y-axis, joined by a dashed horizontal segment: the same height 1/2, with x-coordinates √3/2 and −√3/2.",
          "单位圆上 30° 与 150° 处的点。它们关于 y 轴对称，由一条水平虚线相连：高度都是 1/2，横坐标分别为 √3/2 和 −√3/2。",
        ),
      ),
      generate: (rng) => valueProblem(rng.pick<Fn>(["sin", "cos", "tan"]), rng.pick(specials), false),
    },
    {
      id: "special-angles-in-radians",
      title: t("Special angles in radians", "弧度制的特殊角"),
      explanation: t(
        "In radians the special angles are the multiples of $\\frac{\\pi}{6}$ and $\\frac{\\pi}{4}$. Find the quadrant and the reference angle, which is $\\frac{\\pi}{6}$, $\\frac{\\pi}{4}$ or $\\frac{\\pi}{3}$. For $\\frac{5\\pi}{4}$: $\\pi < \\frac{5\\pi}{4} < \\frac{3\\pi}{2}$, Quadrant III, reference angle $\\frac{5\\pi}{4} - \\pi = \\frac{\\pi}{4}$, so the point is $\\left(-\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)$ and $\\sin \\frac{5\\pi}{4} = -\\frac{\\sqrt{2}}{2}$, $\\tan \\frac{5\\pi}{4} = 1$.\n\n> **Watch out.** Each ratio gets its own sign. In Quadrant III both coordinates are negative, so the sine is negative, but the tangent $\\frac{y}{x}$ divides two negatives and is positive. Giving $\\tan \\frac{5\\pi}{4} = -1$, or $\\sin \\frac{5\\pi}{4} = \\frac{\\sqrt{2}}{2}$, loses track of that.",
        "用弧度表示时，特殊角是 $\\frac{\\pi}{6}$ 与 $\\frac{\\pi}{4}$ 的倍数。先求象限和参考角，参考角是 $\\frac{\\pi}{6}$、$\\frac{\\pi}{4}$ 或 $\\frac{\\pi}{3}$。对 $\\frac{5\\pi}{4}$：$\\pi < \\frac{5\\pi}{4} < \\frac{3\\pi}{2}$，在第三象限，参考角 $\\frac{5\\pi}{4} - \\pi = \\frac{\\pi}{4}$，交点为 $\\left(-\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)$，所以 $\\sin \\frac{5\\pi}{4} = -\\frac{\\sqrt{2}}{2}$，$\\tan \\frac{5\\pi}{4} = 1$。\n\n> **注意。** 每个三角比各有自己的符号。第三象限两个坐标都为负，所以正弦为负；而正切 $\\frac{y}{x}$ 是两个负数相除，为正。写成 $\\tan \\frac{5\\pi}{4} = -1$ 或 $\\sin \\frac{5\\pi}{4} = \\frac{\\sqrt{2}}{2}$，都是把符号弄错了。",
      ),
      figure: unitCirclePairFigure(
        45,
        225,
        ["π/4", "5π/4"],
        t(
          "The unit circle with the points at π/4 and 5π/4, on one line through the origin: the second point is the first turned half a circle, with both coordinates negated, (−√2/2, −√2/2).",
          "单位圆上 π/4 与 5π/4 处的点，在同一条过原点的直线上：第二个点是第一个点转过半圈，两个坐标都变号，为 (−√2/2, −√2/2)。",
        ),
      ),
      generate: (rng) => valueProblem(rng.pick<Fn>(["sin", "cos", "tan"]), rng.pick(specials), true),
    },
    {
      id: "special-angles-from-points-on-the-unit-circle",
      figure:
        trigDrawings["finding-trigonometric-ratios-of-special-angles-using-the-unit-circle#special-angles-from-points-on-the-unit-circle"],
      title: t("The angle from its point on the unit circle", "由单位圆上的点求角"),
      explanation: t(
        "Read backward: the coordinates' sizes give the reference angle, and their signs give the quadrant. If the terminal side meets the unit circle at $\\left(-\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$, then the sizes $\\frac{1}{2}$ and $\\frac{\\sqrt{3}}{2}$ of $x$ and $y$ match $60^\\circ$, and both coordinates are negative, so the angle is in Quadrant III:\n\n$$\\theta = 180^\\circ + 60^\\circ = 240^\\circ = \\frac{4\\pi}{3}.$$\n\n> **Watch out.** The reference angle is not yet the answer: here it is $60^\\circ$, but the angle is $240^\\circ$. Match the sizes to the right coordinate too: $|x| = \\frac{1}{2}$ belongs to $60^\\circ$, and reading it as the $y$-size would give $30^\\circ$ instead.",
        "反过来读：坐标的大小给出参考角，符号给出象限。若终边与单位圆交于 $\\left(-\\frac{1}{2}, -\\frac{\\sqrt{3}}{2}\\right)$，则 $x$、$y$ 的大小 $\\frac{1}{2}$、$\\frac{\\sqrt{3}}{2}$ 对应 $60^\\circ$，两个坐标都为负，所以角在第三象限：\n\n$$\\theta = 180^\\circ + 60^\\circ = 240^\\circ = \\frac{4\\pi}{3}.$$\n\n> **注意。** 参考角还不是答案：这里参考角是 $60^\\circ$，角却是 $240^\\circ$。大小也要对准坐标：$|x| = \\frac{1}{2}$ 对应 $60^\\circ$，若把它当成 $y$ 的大小，就会得到 $30^\\circ$。",
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
        const s1 = stepLabel(1, "Find the reference angle", "求参考角");
        const s2 = stepLabel(2, "Find the quadrant", "确定象限");
        const [ax, ay] = [sTex([x[0].abs(), x[1]]), sTex([y[0].abs(), y[1]])];
        const signs = (s: S) => (s[0].sign() > 0 ? t("positive", "正") : t("negative", "负"));
        const [gx, gy] = [signs(x), signs(y)];
        const solution = join(
          t(
            `${s1.en} The sizes of the coordinates are $|x| = ${ax}$ and $|y| = ${ay}$. In Quadrant I these are the cosine and sine of $${angTex(r, inRad)}$, so that is the reference angle.`,
            `${s1["zh-CN"]}坐标的大小为 $|x| = ${ax}$，$|y| = ${ay}$。在第一象限，它们是 $${angTex(r, inRad)}$ 的余弦和正弦，所以参考角是 $${angTex(r, inRad)}$。`,
          ),
          both(
            `\n\n${s2.en} The $x$-coordinate is ${gx.en} and the $y$-coordinate ${gy.en}, which happens in Quadrant ${roman[n]}. Measure the reference angle from the $x$-axis in that quadrant:`,
            `\n\n${s2["zh-CN"]}$x$ 坐标为${gx["zh-CN"]}，$y$ 坐标为${gy["zh-CN"]}，这是第${zhNumbers[n]}象限。在该象限中从 $x$ 轴量出参考角：`,
            `\\theta = ${n === 1 ? "" : `${line} = `}${degTex(d)}${inRad ? ` = ${radTex(d)}` : ""}`,
          ),
          said(
            `The answer lies in $${rangeTex}$. Turning to $${angTex(d, inRad)}$ gives the given coordinates. Its cosine is $\\cos ${arg(angTex(d, inRad))} = ${sTex(x)}$. Its sine is $\\sin ${arg(angTex(d, inRad))} = ${sTex(y)}$.`,
            `答案在 $${rangeTex}$ 内。转到 $${angTex(d, inRad)}$，正得所给的坐标。它的余弦 $\\cos ${arg(angTex(d, inRad))} = ${sTex(x)}$。它的正弦 $\\sin ${arg(angTex(d, inRad))} = ${sTex(y)}$。`,
          ),
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

/** decimalCheck estimates an expression in decimals from its terms and compares it with the exact answer. */
function decimalCheck(terms: readonly Term[], inRad: boolean, expr: string, estimate: number, exactValue: number, answer: string): Text {
  const values = terms.map((x) => `$${call(x.f, angTex(x.d, inRad))} \\approx ${dec(approx(x.v))}$`);
  const whole = dec(exactValue) === answer;
  return said(
    `Estimate with decimals: ${values.join(" and ")}. These give $${expr} \\approx ${dec(estimate)}$. ${whole ? "That is the exact answer." : `The exact answer agrees: $${answer} \\approx ${dec(exactValue)}$.`}`,
    `用小数估算：${values.join("，")}。由此 $${expr} \\approx ${dec(estimate)}$。${whole ? "这正是精确答案。" : `精确答案与之相符：$${answer} \\approx ${dec(exactValue)}$。`}`,
  );
}

/** productProblem evaluates a·f(A)·g(B) or f(A)/g(B). */
function productProblem(rng: Rng, fns: readonly Fn[]): Problem {
  const inRad = rng.bool();
  for (;;) {
    const [p, r] = [randomTerm(rng, fns), randomTerm(rng, fns)];
    if (p.v[0].isZero() || r.v[0].isZero()) continue;
    const [cp, cr] = [call(p.f, angTex(p.d, inRad)), call(r.f, angTex(r.d, inRad))];
    if (cp === cr) continue;
    const swap = (x: Term) => exact(cofunction[x.f], x.d);
    const s1 = stepLabel(1, "Replace each ratio by its exact value", "把每个三角比换成精确值");
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
        solution: join(
          both(`${s1.en} Read each one off the unit circle:`, `${s1["zh-CN"]}从单位圆上读出每个值：`, valuesLine([p, r], inRad)),
          both(
            `${stepLabel(2, "Divide and simplify", "相除并化简").en} Divide, and rationalize the denominator if a radical is left there:`,
            `${stepLabel(2, "Divide and simplify", "相除并化简")["zh-CN"]}相除，若分母中留有根号，就把分母有理化：`,
            `${expr} = \\frac{${sTex(p.v)}}{${sTex(r.v)}} = ${sTex(answer)}`,
          ),
          said(
            `The quotient times the denominator must give the numerator, $${cp} = ${sTex(p.v)}$. Indeed $${sTex(answer)} \\cdot ${paren(r.v)} = ${sTex(sMul(answer, r.v))}$.`,
            `商乘以分母应当得到分子 $${cp} = ${sTex(p.v)}$。确实 $${sTex(answer)} \\cdot ${paren(r.v)} = ${sTex(sMul(answer, r.v))}$。`,
          ),
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
      solution: join(
        both(`${s1.en} Read each one off the unit circle:`, `${s1["zh-CN"]}从单位圆上读出每个值：`, valuesLine([p, r], inRad)),
        both(
          `${stepLabel(2, "Multiply and simplify", "相乘并化简").en} Multiply the rational parts and the radicals separately, then simplify the radical:`,
          `${stepLabel(2, "Multiply and simplify", "相乘并化简")["zh-CN"]}有理数部分与根式分别相乘，再化简根式：`,
          `${expr} = ${coefTex(a)}${paren(p.v)}${paren(r.v)} = ${sTex(answer)}`,
        ),
        decimalCheck([p, r], inRad, expr, a * approx(p.v) * approx(r.v), approx(answer), sTex(answer)),
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
  encompasses: [{ topic: "finding-trigonometric-ratios-of-special-angles-using-the-unit-circle", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.A.3"],
  intro: t(
    `Every special and quadrantal angle now has exact ratios: numbers such as $\\frac{1}{2}$, $\\frac{\\sqrt{3}}{2}$ or $-1$. An expression in these ratios is therefore an expression in numbers, and it can be simplified exactly, where a calculator would only give a rounded decimal.

Take $\\tan 60^\\circ \\sin 30^\\circ$. Replace each ratio by its value and multiply:

$$\\tan 60^\\circ \\sin 30^\\circ = \\sqrt{3} \\cdot \\frac{1}{2} = \\frac{\\sqrt{3}}{2}.$$

A calculator shows $0.866\\ldots$, which hides that the result is exactly $\\sin 60^\\circ$. Keeping exact values keeps such facts visible, and the same steps work for quotients, sums and squares.`,
    `每个特殊角和象限角现在都有精确的三角比：如 $\\frac{1}{2}$、$\\frac{\\sqrt{3}}{2}$ 或 $-1$ 这样的数。所以由这些三角比构成的式子就是由数构成的式子，可以精确化简，而计算器只能给出四舍五入的小数。

取 $\\tan 60^\\circ \\sin 30^\\circ$。把每个三角比换成它的值再相乘：

$$\\tan 60^\\circ \\sin 30^\\circ = \\sqrt{3} \\cdot \\frac{1}{2} = \\frac{\\sqrt{3}}{2}.$$

计算器显示 $0.866\\ldots$，看不出结果恰好是 $\\sin 60^\\circ$。保留精确值，这样的事实就一目了然；商、和与平方也按同样的步骤计算。`,
  ),
  knowledgePoints: [
    {
      id: "products-and-quotients-of-ratios",
      title: t("Products and quotients", "积与商"),
      explanation: t(
        "Replace each ratio by its exact value, multiply or divide, and give the result in simplest radical form, with no radical in the denominator:\n\n$$4\\sin 60^\\circ \\cos 45^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{2}}{2} = \\sqrt{6}, \\qquad \\frac{\\cos \\frac{\\pi}{4}}{\\sin \\frac{\\pi}{3}} = \\frac{\\sqrt{2}/2}{\\sqrt{3}/2} = \\frac{\\sqrt{2}}{\\sqrt{3}} = \\frac{\\sqrt{6}}{3}.$$\n\n> **Watch out.** Keep the order of a quotient. Above, $\\frac{\\cos \\frac{\\pi}{4}}{\\sin \\frac{\\pi}{3}} = \\frac{\\sqrt{6}}{3}$, while the upside-down $\\frac{\\sin \\frac{\\pi}{3}}{\\cos \\frac{\\pi}{4}} = \\frac{\\sqrt{6}}{2}$ is its reciprocal. Keep the signs of the values too: a negative factor makes the product negative.",
        "把每个三角比换成精确值，相乘或相除，结果化为最简根式，分母中不含根号：\n\n$$4\\sin 60^\\circ \\cos 45^\\circ = 4 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{2}}{2} = \\sqrt{6}, \\qquad \\frac{\\cos \\frac{\\pi}{4}}{\\sin \\frac{\\pi}{3}} = \\frac{\\sqrt{2}/2}{\\sqrt{3}/2} = \\frac{\\sqrt{2}}{\\sqrt{3}} = \\frac{\\sqrt{6}}{3}.$$\n\n> **注意。** 商的上下不能颠倒。上例中 $\\frac{\\cos \\frac{\\pi}{4}}{\\sin \\frac{\\pi}{3}} = \\frac{\\sqrt{6}}{3}$，而颠倒后的 $\\frac{\\sin \\frac{\\pi}{3}}{\\cos \\frac{\\pi}{4}} = \\frac{\\sqrt{6}}{2}$ 是它的倒数。各值的符号也要保留：有一个负因数，积就是负的。",
      ),
      generate: (rng) => productProblem(rng, ["sin", "cos", "tan"]),
    },
    {
      id: "sums-and-differences-of-ratios",
      title: t("Sums and differences", "和与差"),
      explanation: t(
        "Replace each ratio by its value and combine like terms: rational numbers with rational numbers, multiples of the same square root with each other.\n\n$$2\\sin 150^\\circ + 3\\tan 225^\\circ = 2 \\cdot \\frac{1}{2} + 3 \\cdot 1 = 4, \\qquad \\sin \\frac{2\\pi}{3} - 2\\cos \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2} - \\sqrt{3} = -\\frac{\\sqrt{3}}{2}.$$\n\n> **Watch out.** The sign in front of a term multiplies its value, sign included. With a negative value a minus in front makes the term positive: $-3\\tan 135^\\circ = -3(-1) = 3$. Writing $-3$ there flips one term and changes the answer.",
        "把每个三角比换成它的值，再合并同类项：有理数与有理数合并，同一个平方根的倍数相互合并。\n\n$$2\\sin 150^\\circ + 3\\tan 225^\\circ = 2 \\cdot \\frac{1}{2} + 3 \\cdot 1 = 4, \\qquad \\sin \\frac{2\\pi}{3} - 2\\cos \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{2} - \\sqrt{3} = -\\frac{\\sqrt{3}}{2}.$$\n\n> **注意。** 项前面的符号要乘以它的值，连同值的符号一起。值为负时，前面的减号使这一项变为正：$-3\\tan 135^\\circ = -3(-1) = 3$。若写成 $-3$，就把一项的符号弄反了，答案也随之改变。",
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
            solution: join(
              both(
                `${stepLabel(1, "Replace each ratio by its exact value", "把每个三角比换成精确值").en} Read each one off the unit circle:`,
                `${stepLabel(1, "Replace each ratio by its exact value", "把每个三角比换成精确值")["zh-CN"]}从单位圆上读出每个值：`,
                valuesLine([p, r], inRad),
              ),
              both(
                `${stepLabel(2, "Combine like terms", "合并同类项").en} Both terms are multiples of the same number, so their coefficients combine:`,
                `${stepLabel(2, "Combine like terms", "合并同类项")["zh-CN"]}两项是同一个数的倍数，所以系数可以合并：`,
                `${expr} = ${timesTex(a, p.v)} ${b > 0 ? "+" : "-"} ${timesTex(Math.abs(b), r.v)} = ${sTex(answer)}`,
              ),
              decimalCheck([p, r], inRad, expr, a * approx(p.v) + b * approx(r.v), approx(answer), sTex(answer)),
            ),
          });
        }
      },
    },
    {
      id: "squares-of-ratios",
      title: t("Squares of ratios", "三角比的平方"),
      explanation: t(
        "The notation $\\sin^2 \\theta$ means $(\\sin \\theta)^2$. Square the value, including its sign:\n\n$$\\sin^2 \\frac{\\pi}{3} + 2\\cos^2 135^\\circ = \\left(\\frac{\\sqrt{3}}{2}\\right)^2 + 2\\left(-\\frac{\\sqrt{2}}{2}\\right)^2 = \\frac{3}{4} + 2 \\cdot \\frac{2}{4} = \\frac{7}{4}.$$\n\nThe square of every exact value here is rational, so the result is a rational number.\n\n> **Watch out.** Square the value first, then multiply by the coefficient: $2\\cos^2 135^\\circ = 2\\left(-\\frac{\\sqrt{2}}{2}\\right)^2 = 2 \\cdot \\frac{1}{2} = 1$. Leaving out the square, or the coefficient, gives a different number; and a square is never negative, even when the value is.",
        "记号 $\\sin^2 \\theta$ 表示 $(\\sin \\theta)^2$。把值连同符号一起平方：\n\n$$\\sin^2 \\frac{\\pi}{3} + 2\\cos^2 135^\\circ = \\left(\\frac{\\sqrt{3}}{2}\\right)^2 + 2\\left(-\\frac{\\sqrt{2}}{2}\\right)^2 = \\frac{3}{4} + 2 \\cdot \\frac{2}{4} = \\frac{7}{4}.$$\n\n这里每个精确值的平方都是有理数，所以结果是有理数。\n\n> **注意。** 先把值平方，再乘以系数：$2\\cos^2 135^\\circ = 2\\left(-\\frac{\\sqrt{2}}{2}\\right)^2 = 2 \\cdot \\frac{1}{2} = 1$。漏掉平方或系数，都会得到别的数；而且平方永远不是负数，即使值是负的。",
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
            solution: join(
              both(
                `${stepLabel(1, "Replace each ratio by its exact value", "把每个三角比换成精确值").en} Read each one off the unit circle:`,
                `${stepLabel(1, "Replace each ratio by its exact value", "把每个三角比换成精确值")["zh-CN"]}从单位圆上读出每个值：`,
                valuesLine([p, r], inRad),
              ),
              both(
                `${stepLabel(2, "Square, then combine", "平方，再合并").en} Square each value with its sign; every square here is rational:`,
                `${stepLabel(2, "Square, then combine", "平方，再合并")["zh-CN"]}把每个值连同符号平方，这里每个平方都是有理数：`,
                `${expr} = ${coefTex(a)}${paren(p.v)}^2 ${b > 0 ? "+" : "-"} ${coefTex(Math.abs(b))}${paren(r.v)}^2 = ${a === 1 ? "" : `${a} \\cdot `}${sp.toLatex()} ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : `${Math.abs(b)} \\cdot `}${sr.toLatex()} = ${answer.toLatex()}`,
              ),
              decimalCheck(
                [p, r],
                inRad,
                expr,
                a * approx(p.v) ** 2 + b * approx(r.v) ** 2,
                Number(answer.n) / Number(answer.d),
                answer.toLatex(),
              ),
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
    { topic: "the-reciprocal-trigonometric-ratios", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.A.2", "CCSS.HSF.TF.A.3"],
  intro: t(
    `The sine, cosine and tangent of every special angle come from its point on the unit circle. The other three ratios are their reciprocals, $\\csc \\theta = \\frac{1}{\\sin \\theta}$, $\\sec \\theta = \\frac{1}{\\cos \\theta}$ and $\\cot \\theta = \\frac{1}{\\tan \\theta}$, so the same point gives all six.

Take $135^\\circ$, in Quadrant II with reference angle $45^\\circ$, at $\\left(-\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)$. Flip each coordinate and rationalize:

$$\\csc 135^\\circ = \\frac{1}{\\frac{\\sqrt{2}}{2}} = \\frac{2}{\\sqrt{2}} = \\sqrt{2}, \\qquad \\sec 135^\\circ = -\\sqrt{2}, \\qquad \\cot 135^\\circ = \\frac{x}{y} = -1.$$

An angle beyond one turn, such as $495^\\circ = 135^\\circ + 360^\\circ$, ends at the same point and has the same six ratios.`,
    `每个特殊角的正弦、余弦、正切都来自它在单位圆上的点。另外三个三角比是它们的倒数：$\\csc \\theta = \\frac{1}{\\sin \\theta}$，$\\sec \\theta = \\frac{1}{\\cos \\theta}$，$\\cot \\theta = \\frac{1}{\\tan \\theta}$，所以同一个点给出全部六个三角比。

取 $135^\\circ$，在第二象限，参考角 $45^\\circ$，交点为 $\\left(-\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)$。把坐标取倒数并有理化：

$$\\csc 135^\\circ = \\frac{1}{\\frac{\\sqrt{2}}{2}} = \\frac{2}{\\sqrt{2}} = \\sqrt{2}, \\qquad \\sec 135^\\circ = -\\sqrt{2}, \\qquad \\cot 135^\\circ = \\frac{x}{y} = -1.$$

超过一圈的角，如 $495^\\circ = 135^\\circ + 360^\\circ$，终边停在同一点，六个三角比也相同。`,
  ),
  knowledgePoints: [
    {
      id: "reciprocal-ratios-of-special-angles",
      figure: trigDrawings["further-extensions-of-the-special-trigonometric-ratios#reciprocal-ratios-of-special-angles"],
      title: t("Reciprocal ratios of special angles", "特殊角的倒数三角比"),
      explanation: t(
        "Take the point $(x, y)$ on the unit circle and use $\\csc \\theta = \\frac{1}{y}$, $\\sec \\theta = \\frac{1}{x}$, $\\cot \\theta = \\frac{x}{y}$, then rationalize. For $\\frac{7\\pi}{6}$, in Quadrant III with reference angle $\\frac{\\pi}{6}$, the point is $\\left(-\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$:\n\n$$\\sec \\frac{7\\pi}{6} = \\frac{1}{-\\frac{\\sqrt{3}}{2}} = -\\frac{2}{\\sqrt{3}} = -\\frac{2\\sqrt{3}}{3}, \\qquad \\csc \\frac{7\\pi}{6} = \\frac{1}{-\\frac{1}{2}} = -2.$$\n\n> **Watch out.** The cosecant is the reciprocal of the sine, the $y$-coordinate, and the secant the reciprocal of the cosine, the $x$-coordinate. Swapping them gives $\\csc \\frac{7\\pi}{6} = -\\frac{2\\sqrt{3}}{3}$, the value of the secant. A reciprocal also keeps the sign: $\\sec \\frac{7\\pi}{6}$ is negative because $\\cos \\frac{7\\pi}{6}$ is.",
        "取单位圆上的点 $(x, y)$，用 $\\csc \\theta = \\frac{1}{y}$、$\\sec \\theta = \\frac{1}{x}$、$\\cot \\theta = \\frac{x}{y}$，再将分母有理化。对 $\\frac{7\\pi}{6}$，在第三象限，参考角 $\\frac{\\pi}{6}$，交点为 $\\left(-\\frac{\\sqrt{3}}{2}, -\\frac{1}{2}\\right)$：\n\n$$\\sec \\frac{7\\pi}{6} = \\frac{1}{-\\frac{\\sqrt{3}}{2}} = -\\frac{2}{\\sqrt{3}} = -\\frac{2\\sqrt{3}}{3}, \\qquad \\csc \\frac{7\\pi}{6} = \\frac{1}{-\\frac{1}{2}} = -2.$$\n\n> **注意。** 余割是正弦（$y$ 坐标）的倒数，正割是余弦（$x$ 坐标）的倒数。两者弄反，就会得到 $\\csc \\frac{7\\pi}{6} = -\\frac{2\\sqrt{3}}{3}$，那是正割的值。取倒数也保留符号：$\\cos \\frac{7\\pi}{6}$ 为负，所以 $\\sec \\frac{7\\pi}{6}$ 也为负。",
      ),
      generate: (rng) => valueProblem(rng.pick<Fn>(["csc", "sec", "cot"]), rng.pick(specials), rng.bool()),
    },
    {
      id: "special-angles-outside-the-standard-range",
      figure: trigDrawings["further-extensions-of-the-special-trigonometric-ratios#special-angles-outside-the-standard-range"],
      title: t("Special angles outside the standard range", "标准范围以外的特殊角"),
      explanation: t(
        "Remove full turns first, then proceed as before. For $\\tan(-\\frac{5\\pi}{3})$: $-\\frac{5\\pi}{3} + 2\\pi = \\frac{\\pi}{3}$, in Quadrant I, at $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$, so $\\tan(-\\frac{5\\pi}{3}) = \\sqrt{3}$. For $\\cos 855^\\circ$: $855^\\circ - 2 \\cdot 360^\\circ = 135^\\circ$, so $\\cos 855^\\circ = -\\frac{\\sqrt{2}}{2}$.\n\n> **Watch out.** A negative angle turns clockwise, so $-\\frac{5\\pi}{3}$ is not in Quadrant IV like $\\frac{5\\pi}{3}$. Adding $2\\pi$ shows it ends at $\\frac{\\pi}{3}$, in Quadrant I. Treating it as $\\frac{5\\pi}{3}$ gives $\\tan = -\\sqrt{3}$, the wrong sign.",
        "先去掉整圈，再照前面的方法做。对 $\\tan(-\\frac{5\\pi}{3})$：$-\\frac{5\\pi}{3} + 2\\pi = \\frac{\\pi}{3}$，在第一象限，交点为 $\\left(\\frac{1}{2}, \\frac{\\sqrt{3}}{2}\\right)$，所以 $\\tan(-\\frac{5\\pi}{3}) = \\sqrt{3}$。对 $\\cos 855^\\circ$：$855^\\circ - 2 \\cdot 360^\\circ = 135^\\circ$，所以 $\\cos 855^\\circ = -\\frac{\\sqrt{2}}{2}$。\n\n> **注意。** 负角按顺时针方向转，所以 $-\\frac{5\\pi}{3}$ 并不像 $\\frac{5\\pi}{3}$ 那样在第四象限。加上 $2\\pi$ 可知它的终边在 $\\frac{\\pi}{3}$，位于第一象限。若把它当作 $\\frac{5\\pi}{3}$，就会得到 $\\tan = -\\sqrt{3}$，符号错了。",
      ),
      generate: (rng) => valueProblem(rng.pick(allSixes), largeSpecial(rng), rng.bool()),
    },
    {
      id: "expressions-with-all-six-ratios",
      title: t("Expressions with all six ratios", "含六个三角比的式子"),
      explanation: t(
        "Products and quotients of any of the six ratios work the same way: replace each by its exact value and simplify.\n\n$$\\sec \\frac{\\pi}{4} \\cot 120^\\circ = \\sqrt{2} \\cdot \\left(-\\frac{\\sqrt{3}}{3}\\right) = -\\frac{\\sqrt{6}}{3}.$$\n\n> **Watch out.** Find each reciprocal ratio before you multiply: $\\sec \\frac{\\pi}{4} = \\frac{1}{\\cos \\frac{\\pi}{4}} = \\sqrt{2}$, not $\\frac{\\sqrt{2}}{2}$, and $\\cot 120^\\circ = \\frac{x}{y} = -\\frac{\\sqrt{3}}{3}$, not $-\\sqrt{3}$, which is $\\tan 120^\\circ$.",
        "六个三角比中任意几个的积与商，做法相同：把每个换成精确值再化简。\n\n$$\\sec \\frac{\\pi}{4} \\cot 120^\\circ = \\sqrt{2} \\cdot \\left(-\\frac{\\sqrt{3}}{3}\\right) = -\\frac{\\sqrt{6}}{3}.$$\n\n> **注意。** 相乘之前先求出每个倒数三角比：$\\sec \\frac{\\pi}{4} = \\frac{1}{\\cos \\frac{\\pi}{4}} = \\sqrt{2}$，不是 $\\frac{\\sqrt{2}}{2}$；$\\cot 120^\\circ = \\frac{x}{y} = -\\frac{\\sqrt{3}}{3}$，不是 $-\\sqrt{3}$，后者是 $\\tan 120^\\circ$。",
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

/** graphSolution says how to recognize the graph of f, in two paragraphs, and checks it at a second point. */
const graphSolution: Record<Fn, Text> = {
  sin: t(
    "The graph is a wave between $y = -1$ and $y = 1$ with no asymptotes, so it is a sine or cosine graph. It passes through the origin and rises to $y = 1$ at $x = \\frac{\\pi}{2}$.\n\nThat is $y = \\sin x$: $\\sin 0 = 0$ and $\\sin \\frac{\\pi}{2} = 1$. The graph of $y = \\cos x$ would pass through $(0, 1)$ instead.\n\n**Check.** At $x = -\\frac{\\pi}{2}$ the graph is at its lowest, $y = -1$, and indeed $\\sin\\left(-\\frac{\\pi}{2}\\right) = -1$.",
    "图象是在 $y = -1$ 与 $y = 1$ 之间、没有渐近线的波形，所以是正弦或余弦的图象。它经过原点，并在 $x = \\frac{\\pi}{2}$ 处升到 $y = 1$。\n\n这是 $y = \\sin x$：$\\sin 0 = 0$，$\\sin \\frac{\\pi}{2} = 1$。而 $y = \\cos x$ 的图象会经过 $(0, 1)$。\n\n**检验。**在 $x = -\\frac{\\pi}{2}$ 处图象在最低点 $y = -1$，确实 $\\sin\\left(-\\frac{\\pi}{2}\\right) = -1$。",
  ),
  cos: t(
    "The graph is a wave between $y = -1$ and $y = 1$ with no asymptotes, so it is a sine or cosine graph. Its highest point $(0, 1)$ is on the $y$-axis, and it crosses the $x$-axis at $x = \\pm\\frac{\\pi}{2}$.\n\nThat is $y = \\cos x$: $\\cos 0 = 1$. The graph of $y = \\sin x$ would pass through the origin instead.\n\n**Check.** At $x = \\frac{\\pi}{2}$ the graph crosses the $x$-axis, and indeed $\\cos \\frac{\\pi}{2} = 0$.",
    "图象是在 $y = -1$ 与 $y = 1$ 之间、没有渐近线的波形，所以是正弦或余弦的图象。它的最高点 $(0, 1)$ 在 $y$ 轴上，并在 $x = \\pm\\frac{\\pi}{2}$ 处与 $x$ 轴相交。\n\n这是 $y = \\cos x$：$\\cos 0 = 1$。而 $y = \\sin x$ 的图象会经过原点。\n\n**检验。**在 $x = \\frac{\\pi}{2}$ 处图象与 $x$ 轴相交，确实 $\\cos \\frac{\\pi}{2} = 0$。",
  ),
  tan: t(
    "The graph has vertical asymptotes and branches that take every value, so it is a tangent or cotangent graph. It passes through the origin and rises from left to right between the asymptotes $x = -\\frac{\\pi}{2}$ and $x = \\frac{\\pi}{2}$.\n\nThat is $y = \\tan x$: $\\tan 0 = 0$, and $\\tan x = \\frac{\\sin x}{\\cos x}$ is not defined where $\\cos x = 0$. The graph of $y = \\cot x$ has the $y$-axis as an asymptote and falls.\n\n**Check.** The asymptote $x = \\frac{\\pi}{2}$ is where $\\cos \\frac{\\pi}{2} = 0$, so the tangent has no value there, as the graph shows.",
    "图象有竖直渐近线，各支取遍所有值，所以是正切或余切的图象。它经过原点，在渐近线 $x = -\\frac{\\pi}{2}$ 与 $x = \\frac{\\pi}{2}$ 之间从左到右上升。\n\n这是 $y = \\tan x$：$\\tan 0 = 0$，且 $\\tan x = \\frac{\\sin x}{\\cos x}$ 在 $\\cos x = 0$ 处无定义。$y = \\cot x$ 的图象以 $y$ 轴为渐近线，并且下降。\n\n**检验。**渐近线 $x = \\frac{\\pi}{2}$ 处 $\\cos \\frac{\\pi}{2} = 0$，正切在那里没有值，与图象一致。",
  ),
  cot: t(
    "The graph has vertical asymptotes and branches that take every value, so it is a tangent or cotangent graph. The $y$-axis is an asymptote, and each branch falls from left to right, crossing the $x$-axis at $x = \\pm\\frac{\\pi}{2}$.\n\nThat is $y = \\cot x = \\frac{\\cos x}{\\sin x}$, not defined where $\\sin x = 0$, with $\\cot \\frac{\\pi}{2} = 0$. The graph of $y = \\tan x$ passes through the origin and rises.\n\n**Check.** At $x = -\\frac{\\pi}{2}$ the graph crosses the $x$-axis too, and indeed $\\cot\\left(-\\frac{\\pi}{2}\\right) = \\frac{0}{-1} = 0$.",
    "图象有竖直渐近线，各支取遍所有值，所以是正切或余切的图象。$y$ 轴是渐近线，每一支从左到右下降，并在 $x = \\pm\\frac{\\pi}{2}$ 处与 $x$ 轴相交。\n\n这是 $y = \\cot x = \\frac{\\cos x}{\\sin x}$，在 $\\sin x = 0$ 处无定义，且 $\\cot \\frac{\\pi}{2} = 0$。$y = \\tan x$ 的图象经过原点并且上升。\n\n**检验。**在 $x = -\\frac{\\pi}{2}$ 处图象也与 $x$ 轴相交，确实 $\\cot\\left(-\\frac{\\pi}{2}\\right) = \\frac{0}{-1} = 0$。",
  ),
  sec: t(
    "The graph is made of U-shaped branches that never come between $y = -1$ and $y = 1$, so it is a secant or cosecant graph. It has a turning point at $(0, 1)$ and asymptotes at $x = \\pm\\frac{\\pi}{2}$.\n\nThat is $y = \\sec x = \\frac{1}{\\cos x}$: $\\sec 0 = 1$, and it is not defined where $\\cos x = 0$. The graph of $y = \\csc x$ has the $y$-axis as an asymptote.\n\n**Check.** At the asymptote $x = \\frac{\\pi}{2}$ the cosine is $0$. The secant, $1$ divided by the cosine, has no value there, as the graph shows.",
    "图象由从不进入 $y = -1$ 与 $y = 1$ 之间的 U 形分支组成，所以是正割或余割的图象。它在 $(0, 1)$ 处有一个转折点，渐近线为 $x = \\pm\\frac{\\pi}{2}$。\n\n这是 $y = \\sec x = \\frac{1}{\\cos x}$：$\\sec 0 = 1$，在 $\\cos x = 0$ 处无定义。$y = \\csc x$ 的图象以 $y$ 轴为渐近线。\n\n**检验。**在渐近线 $x = \\frac{\\pi}{2}$ 处余弦为 $0$。正割是 $1$ 除以余弦，在那里没有值，与图象一致。",
  ),
  csc: t(
    "The graph is made of U-shaped branches that never come between $y = -1$ and $y = 1$, so it is a secant or cosecant graph. The $y$-axis is an asymptote and the graph has a turning point at $\\left(\\frac{\\pi}{2}, 1\\right)$.\n\nThat is $y = \\csc x = \\frac{1}{\\sin x}$: not defined where $\\sin x = 0$, with $\\csc \\frac{\\pi}{2} = 1$. The graph of $y = \\sec x$ has a turning point at $(0, 1)$ instead.\n\n**Check.** At $x = -\\frac{\\pi}{2}$ the graph has a turning point at $y = -1$, and indeed $\\csc\\left(-\\frac{\\pi}{2}\\right) = -1$.",
    "图象由从不进入 $y = -1$ 与 $y = 1$ 之间的 U 形分支组成，所以是正割或余割的图象。$y$ 轴是渐近线，图象在 $\\left(\\frac{\\pi}{2}, 1\\right)$ 处有转折点。\n\n这是 $y = \\csc x = \\frac{1}{\\sin x}$：在 $\\sin x = 0$ 处无定义，且 $\\csc \\frac{\\pi}{2} = 1$。$y = \\sec x$ 的图象则在 $(0, 1)$ 处有转折点。\n\n**检验。**在 $x = -\\frac{\\pi}{2}$ 处图象有转折点 $y = -1$，确实 $\\csc\\left(-\\frac{\\pi}{2}\\right) = -1$。",
  ),
};

/** graphLooks describes each graph an option may name by a feature the graph shown would need. */
const graphLooks: Record<string, Text> = {
  "$y = \\sin x$": t("is a wave that rises through the origin", "是上升着穿过原点的波形"),
  "$y = \\cos x$": t("is a wave with its highest point at $(0, 1)$", "是最高点在 $(0, 1)$ 的波形"),
  "$y = \\tan x$": t(
    "rises through the origin between asymptotes at $x = \\pm\\frac{\\pi}{2}$",
    "上升着穿过原点，渐近线为 $x = \\pm\\frac{\\pi}{2}$",
  ),
  "$y = \\cot x$": t("falls on each branch and has the $y$-axis as an asymptote", "每一支都下降，并以 $y$ 轴为渐近线"),
  "$y = \\sec x$": t("is made of U-shaped branches with a turning point at $(0, 1)$", "由 U 形分支组成，在 $(0, 1)$ 处有转折点"),
  "$y = \\csc x$": t("is made of U-shaped branches and has the $y$-axis as an asymptote", "由 U 形分支组成，并以 $y$ 轴为渐近线"),
  "$y = -\\sin x$": t("is a wave that falls through the origin", "是下降着穿过原点的波形"),
  "$y = -\\cos x$": t("is a wave with its lowest point at $(0, -1)$", "是最低点在 $(0, -1)$ 的波形"),
};

/** graphReasons says of each wrong option what its graph would look like, which the graph shown does not. */
const graphReasons = (): Reason[] =>
  Object.entries(graphLooks).map(([o, look]) => [
    o,
    `The graph of ${o} ${look.en}, and the graph shown does not.`,
    `${o} 的图象${look["zh-CN"]}，而图中的图象并非如此。`,
  ]);

/** identifyProblem shows the graph of f in a random window and asks which function it is. */
function identifyProblem(rng: Rng, f: Fn, options: readonly Fn[], also: readonly Text[] = []): Problem {
  const w = rng.int(6, 8);
  const u0 = rng.int(-w + 1, -1);
  return {
    ...oneOf(
      rng,
      t("Which function is graphed?", "图中是哪个函数的图象？"),
      same(`$y = \\${f} x$`),
      [...options.filter((g) => g !== f).map((g) => same(`$y = \\${g} x$`)), ...also],
      graphSolution[f],
      graphReasons(),
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
  const n = found.length;
  const step = ft.P === 2 ? "\\pi" : "2\\pi";
  const range = `${uTex(p)} \\le x \\le ${uTex(qq)}`;
  const s1 = stepLabel(1, "Write the family", "写出这一族");
  const s2 = stepLabel(2, "Keep the members in the interval", "留下区间内的成员");
  const [below, above] = n ? [found[0]! - ft.P, found[n - 1]! + ft.P] : [firstFrom(ft, p) - ft.P, firstFrom(ft, p)];
  const outside = t(
    `The neighbours $x = ${uTex(below)}$ and $x = ${uTex(above)}$ lie outside the interval.`,
    `相邻的 $x = ${uTex(below)}$ 与 $x = ${uTex(above)}$ 在区间外。`,
  );
  const check = n
    ? n === 1
      ? join(said("Only one member fits.", "只有一个成员落在区间内。"), t(` ${outside.en}`, outside["zh-CN"]))
      : join(
          said(
            `Count by the spacing: from $x = ${uTex(found[0]!)}$ to $x = ${uTex(found[n - 1]!)}$ in steps of $${step}$ there are $${n - 1} + 1 = ${n}$ members.`,
            `按间隔数：从 $x = ${uTex(found[0]!)}$ 到 $x = ${uTex(found[n - 1]!)}$，每步 $${step}$，共 $${n - 1} + 1 = ${n}$ 个。`,
          ),
          t(` ${outside.en}`, outside["zh-CN"]),
        )
    : join(said("No member fits.", "没有成员落在区间内。"), t(` ${outside.en}`, outside["zh-CN"]));
  return numberProblem({
    prompt: countPrompt(f, ft.kind, uTex(p), uTex(qq)),
    answer: n,
    wrong: [n + 1, Math.max(0, n - 1), ...others],
    solution: join(
      t(
        `${s1.en} The ${name.en} of the graph of $y = \\${f} x$ are at $x = ${familyTex(ft)}$ for integers $k$, one every $${step}$.`,
        `${s1["zh-CN"]}$y = \\${f} x$ 的图象的${name["zh-CN"]}位于 $x = ${familyTex(ft)}$（$k$ 为整数），每隔 $${step}$ 一个。`,
      ),
      t(
        `\n\n${s2.en} ${n ? `There ${n === 1 ? "is $1$" : `are $${n}$`} with $${range}$: $x = ${list}$.` : `None of them lies in $${range}$, so there are $0$.`}`,
        `\n\n${s2["zh-CN"]}${n ? `满足 $${range}$ 的共 $${n}$ 个：$x = ${list}$。` : `其中没有一个在 $${range}$ 内，所以是 $0$ 个。`}`,
      ),
      check,
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
  intro: t(
    `As an angle $x$ turns, its point $(\\cos x, \\sin x)$ travels around the unit circle, and after a full turn of $2\\pi$ it starts over. Plotting the height $\\sin x$ against $x$ turns that circular motion into a graph, a wave that repeats every $2\\pi$.

Follow the point in eighths of a turn. At $x = 0, \\frac{\\pi}{4}, \\frac{\\pi}{2}, \\frac{3\\pi}{4}, \\pi$ the heights are

$$0, \\quad \\frac{\\sqrt{2}}{2} \\approx 0.71, \\quad 1, \\quad 0.71, \\quad 0,$$

and on the lower half of the circle, from $\\pi$ to $2\\pi$, the same heights come back negative: $-0.71$, $-1$, $-0.71$, $0$. Joining the points smoothly gives one arch up and one arch down. The cosine, the $x$-coordinate of the same point, gives a second wave of the same shape.`,
    `角 $x$ 转动时，它的点 $(\\cos x, \\sin x)$ 沿单位圆运动，转过一整圈 $2\\pi$ 后又从头开始。把高度 $\\sin x$ 对 $x$ 描点，就把这种圆周运动变成了一个图象：每隔 $2\\pi$ 重复的波形。

每次转八分之一圈来跟踪这个点。在 $x = 0, \\frac{\\pi}{4}, \\frac{\\pi}{2}, \\frac{3\\pi}{4}, \\pi$ 处，高度依次为

$$0, \\quad \\frac{\\sqrt{2}}{2} \\approx 0.71, \\quad 1, \\quad 0.71, \\quad 0,$$

在单位圆的下半部分，从 $\\pi$ 到 $2\\pi$，同样的高度以负值出现：$-0.71$、$-1$、$-0.71$、$0$。把这些点光滑地连起来，得到一个向上的拱和一个向下的拱。同一个点的 $x$ 坐标即余弦，给出形状相同的另一条波形。`,
  ),
  knowledgePoints: [
    {
      id: "points-on-the-sine-and-cosine-graphs",
      title: t("Points on the graphs", "图象上的点"),
      explanation: t(
        "As the angle $x$ (in radians) turns, the point $(\\cos x, \\sin x)$ moves around the unit circle. Plotting its height $\\sin x$ against $x$ gives the graph of $y = \\sin x$; plotting $\\cos x$ gives $y = \\cos x$. Each point of the graph comes from a value on the unit circle:\n\n| $x$ | $0$ | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{2}$ | $\\frac{5\\pi}{6}$ | $\\pi$ | $\\frac{3\\pi}{2}$ | $2\\pi$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $\\sin x$ | $0$ | $\\frac{1}{2}$ | $1$ | $\\frac{1}{2}$ | $0$ | $-1$ | $0$ |\n| $\\cos x$ | $1$ | $\\frac{\\sqrt{3}}{2}$ | $0$ | $-\\frac{\\sqrt{3}}{2}$ | $-1$ | $0$ | $1$ |\n\nFor example, $\\left(\\frac{5\\pi}{6}, \\frac{1}{2}\\right)$ is on the graph of $y = \\sin x$. The figure shows $y = \\sin x$.\n\n> **Watch out.** A point on the graph of $y = \\sin x$ is $(x, \\sin x)$: its height is the sine, the $y$-coordinate on the circle. Using the cosine instead gives a point of the other graph: at $x = \\frac{5\\pi}{6}$ the cosine is $-\\frac{\\sqrt{3}}{2}$, but the sine graph is at height $\\frac{1}{2}$.",
        "角 $x$（弧度）转动时，点 $(\\cos x, \\sin x)$ 在单位圆上移动。把它的高度 $\\sin x$ 对 $x$ 描点，得到 $y = \\sin x$ 的图象；描 $\\cos x$ 得到 $y = \\cos x$。图象上的每个点都来自单位圆上的一个值：\n\n| $x$ | $0$ | $\\frac{\\pi}{6}$ | $\\frac{\\pi}{2}$ | $\\frac{5\\pi}{6}$ | $\\pi$ | $\\frac{3\\pi}{2}$ | $2\\pi$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $\\sin x$ | $0$ | $\\frac{1}{2}$ | $1$ | $\\frac{1}{2}$ | $0$ | $-1$ | $0$ |\n| $\\cos x$ | $1$ | $\\frac{\\sqrt{3}}{2}$ | $0$ | $-\\frac{\\sqrt{3}}{2}$ | $-1$ | $0$ | $1$ |\n\n例如，$\\left(\\frac{5\\pi}{6}, \\frac{1}{2}\\right)$ 在 $y = \\sin x$ 的图象上。图中是 $y = \\sin x$。\n\n> **注意。** $y = \\sin x$ 图象上的点是 $(x, \\sin x)$：它的高度是正弦，即单位圆上的 $y$ 坐标。若用余弦，得到的是另一个图象上的点：在 $x = \\frac{5\\pi}{6}$ 处余弦是 $-\\frac{\\sqrt{3}}{2}$，而正弦图象的高度是 $\\frac{1}{2}$。",
      ),
      figure: graphFigure("sin", -4, 8),
      generate: (rng) => pointOnGraphProblem(rng, ["sin", "cos"]),
    },
    {
      id: "recognizing-the-sine-and-cosine-graphs",
      title: t("Recognizing the graphs", "辨认图象"),
      explanation: t(
        "Both graphs are waves between $y = -1$ and $y = 1$ that repeat every $2\\pi$, and the graph of $y = \\cos x$ is the graph of $y = \\sin x$ shifted left by $\\frac{\\pi}{2}$. Tell them apart at $x = 0$: $y = \\sin x$ passes through the origin, rising, while $y = \\cos x$ is at its highest point $(0, 1)$. The figure shows $y = \\cos x$.\n\n> **Watch out.** Check the direction as well as the value at $x = 0$. The graph of $y = -\\sin x$ also passes through the origin, but falls there, and $y = -\\cos x$ has its lowest point at $(0, -1)$. Only $y = \\sin x$ rises through the origin, and only $y = \\cos x$ peaks at $(0, 1)$.",
        "两个图象都是在 $y = -1$ 与 $y = 1$ 之间、每隔 $2\\pi$ 重复的波形，$y = \\cos x$ 的图象是把 $y = \\sin x$ 的图象向左平移 $\\frac{\\pi}{2}$。在 $x = 0$ 处区分它们：$y = \\sin x$ 经过原点并且上升，$y = \\cos x$ 则在最高点 $(0, 1)$。图中是 $y = \\cos x$。\n\n> **注意。** 既要看 $x = 0$ 处的值，也要看走向。$y = -\\sin x$ 的图象也经过原点，但在那里下降；$y = -\\cos x$ 的最低点是 $(0, -1)$。只有 $y = \\sin x$ 上升着穿过原点，只有 $y = \\cos x$ 在 $(0, 1)$ 处达到最高。",
      ),
      figure: graphFigure("cos", -4, 8),
      generate: (rng) =>
        identifyProblem(rng, rng.pick<Fn>(["sin", "cos"]), ["sin", "cos"], [same("$y = -\\sin x$"), same("$y = -\\cos x$")]),
    },
    {
      id: "key-points-of-the-sine-and-cosine-graphs",
      title: t("Key points over an interval", "区间上的关键点"),
      explanation: t(
        "The key points repeat with the period $2\\pi$, and the $x$-intercepts every $\\pi$:\n\n| | $x$-intercepts | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sin x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n| $y = \\cos x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n\nfor integers $k$. To count them on an interval, list the members of the family that lie in it. For $y = \\cos x$ on $-\\pi \\le x \\le 2\\pi$, the $x$-intercepts are $-\\frac{\\pi}{2}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}$: three of them.\n\n> **Watch out.** Use the spacing of the feature you count: the $x$-intercepts come every $\\pi$, the highest and lowest points only every $2\\pi$. And the interval includes its ends, so a key point at an end counts; dropping or adding one end is the usual way to be off by one.",
        "关键点以周期 $2\\pi$ 重复，与 $x$ 轴的交点每隔 $\\pi$ 出现一次：\n\n| | 与 $x$ 轴的交点 | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sin x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n| $y = \\cos x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n\n其中 $k$ 为整数。要数出区间上的个数，就列出这一族中落在区间内的值。对 $y = \\cos x$ 在 $-\\pi \\le x \\le 2\\pi$ 上，与 $x$ 轴的交点为 $-\\frac{\\pi}{2}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}$，共三个。\n\n> **注意。** 要用所数特征自己的间隔：与 $x$ 轴的交点每隔 $\\pi$ 出现，最高点和最低点每隔 $2\\pi$ 才出现。区间包含端点，所以落在端点上的关键点也要算；漏掉或多算一个端点，是差一个的常见原因。",
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
  encompasses: [{ topic: "further-extensions-of-the-special-trigonometric-ratios", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7e"],
  intro: t(
    `The graphs of sine and cosine show both coordinates of the point on the unit circle. Their quotient $\\tan x = \\frac{\\sin x}{\\cos x}$ has a graph of a new kind: wherever $\\cos x = 0$ there is nothing to plot, and near those places the quotient becomes huge.

Watch what happens on either side of $x = \\frac{\\pi}{2}$. Just before it, at $x = \\frac{\\pi}{3}$, $\\tan x = \\sqrt{3} \\approx 1.73$, and the values grow without bound as $\\cos x$ shrinks to $0$. Just after it the cosine is negative, so at $x = \\frac{2\\pi}{3}$:

$$\\tan \\frac{2\\pi}{3} = \\frac{\\frac{\\sqrt{3}}{2}}{-\\frac{1}{2}} = -\\sqrt{3}.$$

The graph leaves upward and comes back from below: the vertical line $x = \\frac{\\pi}{2}$ is an **asymptote**, a line the graph approaches but never meets.`,
    `正弦与余弦的图象画出了单位圆上点的两个坐标。它们的商 $\\tan x = \\frac{\\sin x}{\\cos x}$ 的图象是一种新的样子：在 $\\cos x = 0$ 处没有点可画，在这些位置附近，商变得非常大。

看看 $x = \\frac{\\pi}{2}$ 两侧的情况。在它之前，$x = \\frac{\\pi}{3}$ 处 $\\tan x = \\sqrt{3} \\approx 1.73$，随着 $\\cos x$ 缩小到 $0$，值无限增大。过了它，余弦为负，所以在 $x = \\frac{2\\pi}{3}$ 处：

$$\\tan \\frac{2\\pi}{3} = \\frac{\\frac{\\sqrt{3}}{2}}{-\\frac{1}{2}} = -\\sqrt{3}.$$

图象向上离开，又从下方回来：竖直线 $x = \\frac{\\pi}{2}$ 是一条**渐近线**，图象无限接近它却永不相交。`,
  ),
  knowledgePoints: [
    {
      id: "points-on-the-tangent-and-cotangent-graphs",
      title: t("Points on the graphs", "图象上的点"),
      explanation: t(
        "Since $\\tan x = \\frac{\\sin x}{\\cos x}$, the graph of $y = \\tan x$ has a **vertical asymptote** wherever $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$: as $x$ approaches $\\frac{\\pi}{2}$ from the left, $\\sin x \\to 1$ while $\\cos x \\to 0^+$, so $\\tan x$ grows without bound. Between the asymptotes the values come from the unit circle:\n\n| $x$ | $-\\frac{\\pi}{3}$ | $-\\frac{\\pi}{4}$ | $0$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| $\\tan x$ | $-\\sqrt{3}$ | $-1$ | $0$ | $1$ | $\\sqrt{3}$ |\n\nThe graph of $y = \\cot x = \\frac{\\cos x}{\\sin x}$ has its asymptotes where $\\sin x = 0$, at $x = k\\pi$. For example, $\\cot \\frac{3\\pi}{4} = -1$, so $\\left(\\frac{3\\pi}{4}, -1\\right)$ is on it. The figure shows $y = \\tan x$.\n\n> **Watch out.** The tangent divides sine by cosine; dividing the other way gives the cotangent, its reciprocal. At $x = \\frac{\\pi}{3}$ the tangent graph is at $\\sqrt{3}$ while the cotangent graph is at $\\frac{\\sqrt{3}}{3}$. Keep the signs from the quadrant as well.",
        "因为 $\\tan x = \\frac{\\sin x}{\\cos x}$，$y = \\tan x$ 的图象在 $\\cos x = 0$ 处，即 $x = \\frac{\\pi}{2} + k\\pi$ 处，有**竖直渐近线**：当 $x$ 从左侧趋近 $\\frac{\\pi}{2}$ 时，$\\sin x \\to 1$ 而 $\\cos x \\to 0^+$，所以 $\\tan x$ 无限增大。渐近线之间的值来自单位圆：\n\n| $x$ | $-\\frac{\\pi}{3}$ | $-\\frac{\\pi}{4}$ | $0$ | $\\frac{\\pi}{4}$ | $\\frac{\\pi}{3}$ |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| $\\tan x$ | $-\\sqrt{3}$ | $-1$ | $0$ | $1$ | $\\sqrt{3}$ |\n\n$y = \\cot x = \\frac{\\cos x}{\\sin x}$ 的图象的渐近线在 $\\sin x = 0$ 处，即 $x = k\\pi$。例如 $\\cot \\frac{3\\pi}{4} = -1$，所以 $\\left(\\frac{3\\pi}{4}, -1\\right)$ 在它上面。图中是 $y = \\tan x$。\n\n> **注意。** 正切是正弦除以余弦；反过来除，得到的是它的倒数余切。在 $x = \\frac{\\pi}{3}$ 处，正切图象在 $\\sqrt{3}$，余切图象在 $\\frac{\\sqrt{3}}{3}$。符号也要按象限确定。",
      ),
      figure: graphFigure("tan", -4, 8),
      generate: (rng) => pointOnGraphProblem(rng, ["tan", "cot"]),
    },
    {
      id: "recognizing-the-tangent-and-cotangent-graphs",
      title: t("Recognizing the graphs", "辨认图象"),
      explanation: t(
        "Both graphs repeat every $\\pi$ and take every real value on each branch. The graph of $y = \\tan x$ passes through the origin and **rises** on each branch, with asymptotes at $x = \\pm\\frac{\\pi}{2}$. The graph of $y = \\cot x$ has the $y$-axis as an asymptote and **falls** on each branch, crossing the $x$-axis at $x = \\frac{\\pi}{2}$. The figure shows $y = \\cot x$.\n\n> **Watch out.** Both graphs have branches $\\pi$ wide, so look at the $y$-axis: $y = \\tan x$ crosses it at the origin, while for $y = \\cot x$ it is an asymptote. The directions differ too: tangent rises on each branch, cotangent falls. A wave with no asymptotes is sine or cosine.",
        "两个图象都每隔 $\\pi$ 重复，每一支都取遍所有实数。$y = \\tan x$ 的图象经过原点，每一支都**上升**，渐近线为 $x = \\pm\\frac{\\pi}{2}$。$y = \\cot x$ 的图象以 $y$ 轴为渐近线，每一支都**下降**，并在 $x = \\frac{\\pi}{2}$ 处与 $x$ 轴相交。图中是 $y = \\cot x$。\n\n> **注意。** 两个图象的分支都宽 $\\pi$，所以看 $y$ 轴：$y = \\tan x$ 在原点穿过它，而对 $y = \\cot x$ 来说它是渐近线。走向也不同：正切每一支上升，余切每一支下降。没有渐近线的波形则是正弦或余弦。",
      ),
      figure: graphFigure("cot", -4, 8),
      generate: (rng) => identifyProblem(rng, rng.pick<Fn>(["tan", "cot"]), ["tan", "cot", "sin", "cos"]),
    },
    {
      id: "intercepts-and-asymptotes-over-an-interval",
      figure: waveDrawings["graphing-tangent-and-cotangent#intercepts-and-asymptotes-over-an-interval"],
      title: t("Intercepts and asymptotes over an interval", "区间上的交点与渐近线"),
      explanation: t(
        "The key features repeat every $\\pi$:\n\n| | $x$-intercepts | vertical asymptotes |\n| :--- | :---: | :---: |\n| $y = \\tan x$ | $k\\pi$ | $\\frac{\\pi}{2} + k\\pi$ |\n| $y = \\cot x$ | $\\frac{\\pi}{2} + k\\pi$ | $k\\pi$ |\n\nThe $x$-intercepts of one are the asymptotes of the other. For $y = \\tan x$ on $0 \\le x \\le 3\\pi$, the asymptotes are $x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}$: three of them.\n\n> **Watch out.** The $x$-intercepts of one function are the asymptotes of the other, so read the right column for the function asked. Both features repeat every $\\pi$, not every $2\\pi$, and ends of the interval count when they are included.",
        "关键特征每隔 $\\pi$ 重复：\n\n| | 与 $x$ 轴的交点 | 竖直渐近线 |\n| :--- | :---: | :---: |\n| $y = \\tan x$ | $k\\pi$ | $\\frac{\\pi}{2} + k\\pi$ |\n| $y = \\cot x$ | $\\frac{\\pi}{2} + k\\pi$ | $k\\pi$ |\n\n一个函数与 $x$ 轴的交点正是另一个的渐近线。对 $y = \\tan x$ 在 $0 \\le x \\le 3\\pi$ 上，渐近线为 $x = \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{2}$，共三条。\n\n> **注意。** 一个函数与 $x$ 轴的交点是另一个函数的渐近线，所以要读所问函数的那一栏。两种特征都每隔 $\\pi$ 重复，而不是每隔 $2\\pi$；区间包含端点时，端点上的也要算。",
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
  encompasses: [{ topic: "graphing-sine-and-cosine", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7e"],
  intro: t(
    `The secant and cosecant are the reciprocals of cosine and sine, so each of their graphs is built from a wave you already know: take the reciprocal of every height. Where the wave is $0$ the reciprocal does not exist, which gives an asymptote; where the wave is $1$ or $-1$ the reciprocal is the same number.

Build part of $y = \\csc x = \\frac{1}{\\sin x}$ between $x = 0$ and $x = \\pi$, where $\\sin x$ is positive:

$$\\csc \\frac{\\pi}{6} = \\frac{1}{\\frac{1}{2}} = 2, \\qquad \\csc \\frac{\\pi}{2} = \\frac{1}{1} = 1, \\qquad \\csc \\frac{5\\pi}{6} = 2.$$

Near $0$ and $\\pi$ the sine shrinks toward $0$ and its reciprocal grows without bound. So this piece is a U opening upward, with its lowest point $\\left(\\frac{\\pi}{2}, 1\\right)$ where the sine wave peaks.`,
    `正割与余割是余弦与正弦的倒数，所以它们的图象都由已知的波形得来：把每个高度取倒数。波形为 $0$ 的地方倒数不存在，于是出现渐近线；波形为 $1$ 或 $-1$ 的地方，倒数还是这个数。

在 $x = 0$ 与 $x = \\pi$ 之间，$\\sin x$ 为正，画出 $y = \\csc x = \\frac{1}{\\sin x}$ 的一段：

$$\\csc \\frac{\\pi}{6} = \\frac{1}{\\frac{1}{2}} = 2, \\qquad \\csc \\frac{\\pi}{2} = \\frac{1}{1} = 1, \\qquad \\csc \\frac{5\\pi}{6} = 2.$$

在 $0$ 和 $\\pi$ 附近，正弦趋向 $0$，它的倒数无限增大。所以这一段是开口向上的 U 形，最低点 $\\left(\\frac{\\pi}{2}, 1\\right)$ 正是正弦波的最高点。`,
  ),
  knowledgePoints: [
    {
      id: "points-on-the-secant-and-cosecant-graphs",
      title: t("Points on the graphs", "图象上的点"),
      explanation: t(
        "Each value of $y = \\sec x = \\frac{1}{\\cos x}$ is the reciprocal of a value of cosine. Where $\\cos x = 0$ the graph has a vertical asymptote; where $\\cos x = \\pm 1$ the two graphs touch, at $(0, 1)$ and $(\\pi, -1)$; and since $|\\cos x| \\le 1$, the values of $\\sec x$ are at least $1$ or at most $-1$. For example,\n\n$$\\sec \\frac{2\\pi}{3} = \\frac{1}{\\cos \\frac{2\\pi}{3}} = \\frac{1}{-\\frac{1}{2}} = -2.$$\n\nLikewise $y = \\csc x = \\frac{1}{\\sin x}$ has asymptotes where $\\sin x = 0$. The figure shows $y = \\sec x$.\n\n> **Watch out.** The secant is $1$ over the cosine, not the cosine itself and not $1$ over the sine: $\\sec \\frac{2\\pi}{3} = -2$, while $\\cos \\frac{2\\pi}{3} = -\\frac{1}{2}$ and $\\csc \\frac{2\\pi}{3} = \\frac{2\\sqrt{3}}{3}$. The reciprocal keeps the sign.",
        "$y = \\sec x = \\frac{1}{\\cos x}$ 的每个值都是余弦值的倒数。在 $\\cos x = 0$ 处图象有竖直渐近线；在 $\\cos x = \\pm 1$ 处两个图象相接，即 $(0, 1)$ 与 $(\\pi, -1)$；又因为 $|\\cos x| \\le 1$，$\\sec x$ 的值不小于 $1$ 或不大于 $-1$。例如\n\n$$\\sec \\frac{2\\pi}{3} = \\frac{1}{\\cos \\frac{2\\pi}{3}} = \\frac{1}{-\\frac{1}{2}} = -2.$$\n\n同样，$y = \\csc x = \\frac{1}{\\sin x}$ 在 $\\sin x = 0$ 处有渐近线。图中是 $y = \\sec x$。\n\n> **注意。** 正割是 $1$ 除以余弦，既不是余弦本身，也不是 $1$ 除以正弦：$\\sec \\frac{2\\pi}{3} = -2$，而 $\\cos \\frac{2\\pi}{3} = -\\frac{1}{2}$，$\\csc \\frac{2\\pi}{3} = \\frac{2\\sqrt{3}}{3}$。取倒数不改变符号。",
      ),
      figure: graphFigure("sec", -4, 8),
      generate: (rng) => pointOnGraphProblem(rng, ["sec", "csc"]),
    },
    {
      id: "recognizing-the-secant-and-cosecant-graphs",
      title: t("Recognizing the graphs", "辨认图象"),
      explanation: t(
        "Both graphs are made of U-shaped branches, opening up from $y = 1$ and down from $y = -1$, between asymptotes $\\pi$ apart, and both repeat every $2\\pi$. The graph of $y = \\sec x$ has a turning point at $(0, 1)$ on the $y$-axis. The graph of $y = \\csc x$ has the $y$-axis as an asymptote, with turning points at $\\left(\\frac{\\pi}{2}, 1\\right)$ and $\\left(-\\frac{\\pi}{2}, -1\\right)$. The figure shows $y = \\csc x$.\n\n> **Watch out.** Tangent and cotangent have asymptotes too, but their branches cross the $x$-axis and take every value. The branches of secant and cosecant are U-shaped and never come between $y = -1$ and $y = 1$. Then the $y$-axis decides: a turning point at $(0, 1)$ means secant, an asymptote there means cosecant.",
        "两个图象都由 U 形的分支组成，从 $y = 1$ 向上开口、从 $y = -1$ 向下开口，位于相距 $\\pi$ 的渐近线之间，并且都每隔 $2\\pi$ 重复。$y = \\sec x$ 的图象在 $y$ 轴上的 $(0, 1)$ 处有转折点。$y = \\csc x$ 的图象以 $y$ 轴为渐近线，转折点为 $\\left(\\frac{\\pi}{2}, 1\\right)$ 与 $\\left(-\\frac{\\pi}{2}, -1\\right)$。图中是 $y = \\csc x$。\n\n> **注意。** 正切和余切也有渐近线，但它们的分支穿过 $x$ 轴、取遍所有值。正割和余割的分支是 U 形，从不进入 $y = -1$ 与 $y = 1$ 之间。再看 $y$ 轴：在 $(0, 1)$ 处有转折点的是正割，以 $y$ 轴为渐近线的是余割。",
      ),
      figure: graphFigure("csc", -4, 8),
      generate: (rng) => identifyProblem(rng, rng.pick<Fn>(["sec", "csc"]), ["sec", "csc", "tan", "cot"]),
    },
    {
      id: "asymptotes-and-turning-points-over-an-interval",
      figure: waveDrawings["graphing-secant-and-cosecant#asymptotes-and-turning-points-over-an-interval"],
      title: t("Asymptotes and turning points over an interval", "区间上的渐近线与转折点"),
      explanation: t(
        "The asymptotes of $y = \\sec x$ are those of $y = \\tan x$, and the asymptotes of $y = \\csc x$ are those of $y = \\cot x$; neither graph meets the $x$-axis:\n\n| | vertical asymptotes | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sec x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n| $y = \\csc x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n\nFor $y = \\csc x$ on $-\\pi \\le x \\le 2\\pi$, the points with $y = 1$ are at $x = \\frac{\\pi}{2}$ only (the next ones, $-\\frac{3\\pi}{2}$ and $\\frac{5\\pi}{2}$, lie outside): one point.\n\n> **Watch out.** For secant and cosecant, a point with $y = 1$ is the bottom of a U that opens upward, and one with $y = -1$ the top of a U that opens downward. They come every $2\\pi$, while the asymptotes come every $\\pi$: using the wrong spacing doubles or halves the count.",
        "$y = \\sec x$ 的渐近线就是 $y = \\tan x$ 的渐近线，$y = \\csc x$ 的渐近线就是 $y = \\cot x$ 的渐近线；两个图象都不与 $x$ 轴相交：\n\n| | 竖直渐近线 | $y = 1$ | $y = -1$ |\n| :--- | :---: | :---: | :---: |\n| $y = \\sec x$ | $\\frac{\\pi}{2} + k\\pi$ | $2k\\pi$ | $\\pi + 2k\\pi$ |\n| $y = \\csc x$ | $k\\pi$ | $\\frac{\\pi}{2} + 2k\\pi$ | $\\frac{3\\pi}{2} + 2k\\pi$ |\n\n对 $y = \\csc x$ 在 $-\\pi \\le x \\le 2\\pi$ 上，满足 $y = 1$ 的点只有 $x = \\frac{\\pi}{2}$（相邻的 $-\\frac{3\\pi}{2}$ 和 $\\frac{5\\pi}{2}$ 在区间外）：一个点。\n\n> **注意。** 对正割和余割，$y = 1$ 的点是开口向上的 U 形的底部，$y = -1$ 的点是开口向下的 U 形的顶部。它们每隔 $2\\pi$ 出现一次，而渐近线每隔 $\\pi$ 出现一次：用错间隔，个数就会多一倍或少一半。",
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
  const s1 = stepLabel(1, "Recall the range", "回忆值域");
  const s2 = stepLabel(2, "Compare the number with it", "把这个数与值域比较");
  let check: Text;
  if (r === "box") {
    const rest = Q.one.sub(sSquare(v));
    const ok = rest.sign() >= 0;
    check = said(
      `A point on the unit circle with that coordinate would have its other coordinate squared equal to $1 - ${squared(v)} = ${rest.toLatex()}$. ${ok ? "That is not negative, so such a point exists." : "That is negative, so no such point exists."}`,
      `单位圆上若有一点以它为坐标，另一个坐标的平方应为 $1 - ${squared(v)} = ${rest.toLatex()}$。${ok ? "它不是负数，所以这样的点存在。" : "它是负数，所以这样的点不存在。"}`,
    );
  } else if (r === "all") {
    const pt = f === "tan" ? `(1, ${sTex(v)})` : `(${sTex(v)}, 1)`;
    check = said(
      `An angle whose terminal side passes through $${pt}$ has $\\${f} x = \\frac{${sTex(v)}}{1} = ${sTex(v)}$.`,
      `终边经过 $${pt}$ 的角满足 $\\${f} x = \\frac{${sTex(v)}}{1} = ${sTex(v)}$。`,
    );
  } else {
    const base = f === "sec" ? "cos" : "sin";
    const rv = sDiv(ONE, v)!;
    const ok = sSquare(rv).cmp(Q.one) <= 0;
    check = said(
      `Having $\\${f} x = ${sTex(v)}$ would need $\\${base} x = \\frac{1}{${sTex(v)}} = ${sTex(rv)}$. ${ok ? `That lies between $-1$ and $1$, so it is a value of ${fnNames[base].en}.` : `That is not between $-1$ and $1$, so it is not a value of ${fnNames[base].en}.`}`,
      `要使 $\\${f} x = ${sTex(v)}$，需要 $\\${base} x = \\frac{1}{${sTex(v)}} = ${sTex(rv)}$。${ok ? `它在 $-1$ 与 $1$ 之间，是${fnNames[base]["zh-CN"]}能取到的值。` : `它不在 $-1$ 与 $1$ 之间，${fnNames[base]["zh-CN"]}取不到这个值。`}`,
    );
  }
  return choiceProblem({
    prompt: t(`Is there a value of $x$ for which $\\${f} x = ${sTex(v)}$?`, `是否存在 $x$ 使 $\\${f} x = ${sTex(v)}$？`),
    options: yesNo,
    correct: want ? 0 : 1,
    solution: join(
      t(`${s1.en} The range of $y = \\${f} x$ is $${rangeTex}$.`, `${s1["zh-CN"]}$y = \\${f} x$ 的值域是 $${rangeTex}$。`),
      t(
        `\n\n${s2.en} The number $${sTex(v)}$${sq}${cmpEn}${cmpEn === "" ? "" : ","} is ${want ? "" : "not "}in the range, so the answer is ${want ? "yes" : "no"}.`,
        `\n\n${s2["zh-CN"]}数 $${sTex(v)}$${sqZh}${cmpZh}，${want ? "在" : "不在"}值域内，所以答案为“${want ? "是" : "否"}”。`,
      ),
      check,
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
  // The member of the family for this k: "\\frac{\\pi}{2} - 3\\pi", not "\\frac{\\pi}{2} + -3\\pi".
  const c = (k * asym.P) / 2;
  const at = () =>
    asym.off === 0 ? poly([c, "\\pi"]) : c === 0 ? uTex(asym.off) : `${uTex(asym.off)} ${c < 0 ? "-" : "+"} ${poly([Math.abs(c), "\\pi"])}`;
  const coord = f === "tan" || f === "sec" ? "x" : "y";
  const check = defined
    ? said(`Its value is $\\${f} ${arg(x)} = ${sTex(exact(f, d)!)}$.`, `它的值是 $\\${f} ${arg(x)} = ${sTex(exact(f, d)!)}$。`)
    : said(
        `On the unit circle the angle $${x}$ ends on ${axisEn[mod(d, 360) / 90]}, where the $${coord}$-coordinate is $0$.`,
        `在单位圆上，角 $${x}$ 的终边在${axisZh[mod(d, 360) / 90]}上，那里 $${coord}$ 坐标为 $0$。`,
      );
  return choiceProblem({
    prompt: t(`Is $\\${f} x$ defined at $x = ${x}$?`, `$\\${f} x$ 在 $x = ${x}$ 处有定义吗？`),
    options: yesNo,
    correct: defined ? 0 : 1,
    solution: join(
      defined
        ? t(
            `The function $\\${f} x$ is not defined only where $${z} = 0$, at $x = ${form}$. So $\\${f} ${arg(x)}$ is defined, because $${z.replace("x", arg(x))} = ${zv} \\ne 0$.`,
            `$\\${f} x$ 只在 $${z} = 0$ 处无定义，即 $x = ${form}$。所以 $\\${f} ${arg(x)}$ 有定义，因为 $${z.replace("x", arg(x))} = ${zv} \\ne 0$。`,
          )
        : t(
            `The function $\\${f} x$ is not defined where $${z} = 0$, at $x = ${form}$. Here $k = ${k}$, so $${z.replace("x", arg(x))} = 0$ and $\\${f} ${arg(x)}$ is not defined. Indeed $x = ${asym.off === 0 ? x : `${x} = ${at()}`}$.`,
            `$\\${f} x$ 在 $${z} = 0$ 处无定义，即 $x = ${form}$。这里 $k = ${k}$，所以 $${z.replace("x", arg(x))} = 0$，$\\${f} ${arg(x)}$ 无定义。确实 $x = ${asym.off === 0 ? x : `${x} = ${at()}`}$。`,
          ),
      check,
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
    return reasoned(
      choiceProblem({
        prompt: t(`What is the domain of $y = \\${f} x$?`, `$y = \\${f} x$ 的定义域是什么？`),
        options: domainOptions,
        correct: domainIndex[f],
        solution: domainSolution[f],
      }),
      domainReasons(f),
    );
  }
  if (hasHoles && (rangeOf[f] === "all" || r < 0.6)) return domainQuestion(rng, f);
  return rangeQuestion(rng, f);
}

/** domainReasons says what is wrong with each wrong option for the domain of f. */
function domainReasons(f: Fn): Reason[] {
  const free = domainIndex[f] === 0;
  const coordinate = t(
    `$\\${f} x$ is a coordinate of a point on the unit circle and divides by nothing, so no $x$ is left out.`,
    `$\\${f} x$ 是单位圆上点的坐标，不做除法，所以没有 $x$ 被排除。`,
  );
  const out: Reason[] = [
    [
      domainOptions[0]!.en,
      `$\\${f} x$ divides by $${zeroOf(f)}$, which is $0$ at some angles, so those $x$ are left out.`,
      `$\\${f} x$ 要除以 $${zeroOf(f)}$，而它在某些角处为 $0$，所以这些 $x$ 要排除。`,
    ],
    free
      ? [domainOptions[1]!.en, coordinate.en, coordinate["zh-CN"]]
      : [
          domainOptions[1]!.en,
          `Those are the zeros of $\\cos x$, but $\\${f} x$ divides by $\\sin x$, which is $0$ at $x = k\\pi$.`,
          `那些是 $\\cos x$ 的零点，而 $\\${f} x$ 除以的是 $\\sin x$，它在 $x = k\\pi$ 处为 $0$。`,
        ],
    free
      ? [domainOptions[2]!.en, coordinate.en, coordinate["zh-CN"]]
      : [
          domainOptions[2]!.en,
          `Those are the zeros of $\\sin x$, but $\\${f} x$ divides by $\\cos x$, which is $0$ at $x = \\frac{\\pi}{2} + k\\pi$.`,
          `那些是 $\\sin x$ 的零点，而 $\\${f} x$ 除以的是 $\\cos x$，它在 $x = \\frac{\\pi}{2} + k\\pi$ 处为 $0$。`,
        ],
    [
      domainOptions[3]!.en,
      "The interval $[-1, 1]$ is the range of sine and cosine, a set of values. The domain is a set of angles $x$.",
      "区间 $[-1, 1]$ 是正弦和余弦的值域，是一组函数值；定义域是一组角 $x$。",
    ],
  ];
  return out;
}

const domainStated: Record<Fn, Text> = {
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

const domainChecks: Record<Fn, Text> = {
  sin: said(
    "The graph of $y = \\sin x$ is one unbroken wave with no asymptotes, so no $x$ is left out.",
    "$y = \\sin x$ 的图象是一条连续不断、没有渐近线的波形，所以没有 $x$ 被排除。",
  ),
  cos: said(
    "The graph of $y = \\cos x$ is one unbroken wave with no asymptotes, so no $x$ is left out.",
    "$y = \\cos x$ 的图象是一条连续不断、没有渐近线的波形，所以没有 $x$ 被排除。",
  ),
  tan: said(
    "The graph has an asymptote at $x = \\frac{\\pi}{2}$, where $\\cos x = 0$. At $x = \\pi$ the tangent is defined: $\\tan \\pi = \\frac{0}{-1} = 0$.",
    "图象在 $x = \\frac{\\pi}{2}$ 处有渐近线，那里 $\\cos x = 0$。在 $x = \\pi$ 处正切有定义：$\\tan \\pi = \\frac{0}{-1} = 0$。",
  ),
  sec: said(
    "The graph has an asymptote at $x = \\frac{\\pi}{2}$, where $\\cos x = 0$. At $x = \\pi$ the secant is defined: $\\sec \\pi = \\frac{1}{-1} = -1$.",
    "图象在 $x = \\frac{\\pi}{2}$ 处有渐近线，那里 $\\cos x = 0$。在 $x = \\pi$ 处正割有定义：$\\sec \\pi = \\frac{1}{-1} = -1$。",
  ),
  cot: said(
    "The graph has an asymptote at $x = 0$, where $\\sin x = 0$. At $x = \\frac{\\pi}{2}$ the cotangent is defined: $\\cot \\frac{\\pi}{2} = \\frac{0}{1} = 0$.",
    "图象在 $x = 0$ 处有渐近线，那里 $\\sin x = 0$。在 $x = \\frac{\\pi}{2}$ 处余切有定义：$\\cot \\frac{\\pi}{2} = \\frac{0}{1} = 0$。",
  ),
  csc: said(
    "The graph has an asymptote at $x = 0$, where $\\sin x = 0$. At $x = \\frac{\\pi}{2}$ the cosecant is defined: $\\csc \\frac{\\pi}{2} = \\frac{1}{1} = 1$.",
    "图象在 $x = 0$ 处有渐近线，那里 $\\sin x = 0$。在 $x = \\frac{\\pi}{2}$ 处余割有定义：$\\csc \\frac{\\pi}{2} = \\frac{1}{1} = 1$。",
  ),
};

/** domainSolution explains the domain of f and checks it on the graph. */
const domainSolution = Object.fromEntries(allSixes.map((f) => [f, join(domainStated[f], domainChecks[f])])) as Record<Fn, Text>;

const rangeStated: Record<Fn, Text> = {
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

const rangeChecks: Record<Fn, Text> = {
  sin: said(
    "The ends are reached: $\\sin \\frac{3\\pi}{2} = -1$ and $\\sin \\frac{\\pi}{2} = 1$.",
    "两端都能取到：$\\sin \\frac{3\\pi}{2} = -1$，$\\sin \\frac{\\pi}{2} = 1$。",
  ),
  cos: said("The ends are reached: $\\cos \\pi = -1$ and $\\cos 0 = 1$.", "两端都能取到：$\\cos \\pi = -1$，$\\cos 0 = 1$。"),
  tan: said(
    "Any number $c$ is a value: an angle whose terminal side passes through $(1, c)$ has $\\tan x = \\frac{c}{1} = c$.",
    "任何数 $c$ 都能取到：终边经过 $(1, c)$ 的角满足 $\\tan x = \\frac{c}{1} = c$。",
  ),
  cot: said(
    "Any number $c$ is a value: an angle whose terminal side passes through $(c, 1)$ has $\\cot x = \\frac{c}{1} = c$.",
    "任何数 $c$ 都能取到：终边经过 $(c, 1)$ 的角满足 $\\cot x = \\frac{c}{1} = c$。",
  ),
  sec: said(
    "The ends are reached, $\\sec 0 = 1$ and $\\sec \\pi = -1$. A value such as $\\frac{1}{2}$ would need $\\cos x = 2$, which is impossible.",
    "两端都能取到：$\\sec 0 = 1$，$\\sec \\pi = -1$。而像 $\\frac{1}{2}$ 这样的值需要 $\\cos x = 2$，这不可能。",
  ),
  csc: said(
    "The ends are reached, $\\csc \\frac{\\pi}{2} = 1$ and $\\csc \\frac{3\\pi}{2} = -1$. A value such as $\\frac{1}{2}$ would need $\\sin x = 2$, which is impossible.",
    "两端都能取到：$\\csc \\frac{\\pi}{2} = 1$，$\\csc \\frac{3\\pi}{2} = -1$。而像 $\\frac{1}{2}$ 这样的值需要 $\\sin x = 2$，这不可能。",
  ),
};

/** rangeSolution explains the range of f and checks it at its ends. */
const rangeSolution = Object.fromEntries(allSixes.map((f) => [f, join(rangeStated[f], rangeChecks[f])])) as Record<Fn, Text>;

const parityOptions: readonly Text[] = [t("Even", "偶函数"), t("Odd", "奇函数"), t("Neither", "既不是奇函数也不是偶函数")];

/** parityStated explains the symmetry of f. */
const parityStated: Record<Fn, Text> = {
  sin: t(
    "The angles $x$ and $-x$ have terminal sides that are mirror images across the $x$-axis, meeting the unit circle at $(a, b)$ and $(a, -b)$. So $\\sin(-x) = -\\sin x$: sine is **odd**, and its graph is symmetric about the origin.",
    "角 $x$ 与 $-x$ 的终边关于 $x$ 轴对称，分别与单位圆交于 $(a, b)$ 与 $(a, -b)$。所以 $\\sin(-x) = -\\sin x$：正弦是**奇函数**，图象关于原点对称。",
  ),
  cos: t(
    "The angles $x$ and $-x$ have terminal sides that are mirror images across the $x$-axis, meeting the unit circle at $(a, b)$ and $(a, -b)$. So $\\cos(-x) = \\cos x$: cosine is **even**, and its graph is symmetric about the $y$-axis.",
    "角 $x$ 与 $-x$ 的终边关于 $x$ 轴对称，分别与单位圆交于 $(a, b)$ 与 $(a, -b)$。所以 $\\cos(-x) = \\cos x$：余弦是**偶函数**，图象关于 $y$ 轴对称。",
  ),
  tan: t(
    "Tangent is **odd**, and its graph is symmetric about the origin, because $\\tan(-x) = \\frac{\\sin(-x)}{\\cos(-x)} = \\frac{-\\sin x}{\\cos x} = -\\tan x$.",
    "正切是**奇函数**，图象关于原点对称，因为 $\\tan(-x) = \\frac{\\sin(-x)}{\\cos(-x)} = \\frac{-\\sin x}{\\cos x} = -\\tan x$。",
  ),
  cot: t(
    "Cotangent is **odd**, and its graph is symmetric about the origin, because $\\cot(-x) = \\frac{\\cos(-x)}{\\sin(-x)} = \\frac{\\cos x}{-\\sin x} = -\\cot x$.",
    "余切是**奇函数**，图象关于原点对称，因为 $\\cot(-x) = \\frac{\\cos(-x)}{\\sin(-x)} = \\frac{\\cos x}{-\\sin x} = -\\cot x$。",
  ),
  sec: t(
    "Secant is **even**, and its graph is symmetric about the $y$-axis, because $\\sec(-x) = \\frac{1}{\\cos(-x)} = \\frac{1}{\\cos x} = \\sec x$.",
    "正割是**偶函数**，图象关于 $y$ 轴对称，因为 $\\sec(-x) = \\frac{1}{\\cos(-x)} = \\frac{1}{\\cos x} = \\sec x$。",
  ),
  csc: t(
    "Cosecant is **odd**, and its graph is symmetric about the origin, because $\\csc(-x) = \\frac{1}{\\sin(-x)} = \\frac{1}{-\\sin x} = -\\csc x$.",
    "余割是**奇函数**，图象关于原点对称，因为 $\\csc(-x) = \\frac{1}{\\sin(-x)} = \\frac{1}{-\\sin x} = -\\csc x$。",
  ),
};

/** parityCheck tests the symmetry of f at x = π/3. */
function parityCheck(f: Fn): Text {
  const [a, b] = [sTex(exact(f, -60)!), sTex(exact(f, 60)!)];
  const even = fnData[f].even;
  return said(
    `At $x = \\frac{\\pi}{3}$ the two values are ${even ? "equal" : "opposites"}. First, $\\${f}\\left(-\\frac{\\pi}{3}\\right) = ${a}$. Second, $\\${f} \\frac{\\pi}{3} = ${b}$.`,
    `在 $x = \\frac{\\pi}{3}$ 处两个值${even ? "相等" : "互为相反数"}。一方面 $\\${f}\\left(-\\frac{\\pi}{3}\\right) = ${a}$。另一方面 $\\${f} \\frac{\\pi}{3} = ${b}$。`,
  );
}

/** parityReasons says what is wrong with each wrong option for the symmetry of f. */
function parityReasons(f: Fn): Reason[] {
  const even = fnData[f].even;
  return [
    [
      "Even",
      `An even function has $f(-x) = f(x)$, but $\\${f}(-x) = -\\${f} x$.`,
      `偶函数满足 $f(-x) = f(x)$，但 $\\${f}(-x) = -\\${f} x$。`,
    ],
    [
      "Odd",
      `An odd function has $f(-x) = -f(x)$, but $\\${f}(-x) = \\${f} x$.`,
      `奇函数满足 $f(-x) = -f(x)$，但 $\\${f}(-x) = \\${f} x$。`,
    ],
    [
      "Neither",
      `The rule $\\${f}(-x) = ${even ? "" : "-"}\\${f} x$ holds for every $x$, so the function is ${even ? "even" : "odd"}.`,
      `$\\${f}(-x) = ${even ? "" : "-"}\\${f} x$ 对每个 $x$ 都成立，所以它是${even ? "偶" : "奇"}函数。`,
    ],
  ];
}

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
    const [v0, v1, vh] = [exact(f, 60)!, exact(f, 60 + 90 * period)!, exact(f, 60 + 45 * period)!];
    const periodCheck = said(
      `Shift $x = \\frac{\\pi}{3}$ by one period: $\\${f} ${radTex(60 + 90 * period)} = ${sTex(v1)} = \\${f} \\frac{\\pi}{3}$. Half a period does not work: $\\${f} ${radTex(60 + 45 * period)} = ${sTex(vh)} \\ne ${sTex(v0)}$.`,
      `把 $x = \\frac{\\pi}{3}$ 平移一个周期：$\\${f} ${radTex(60 + 90 * period)} = ${sTex(v1)} = \\${f} \\frac{\\pi}{3}$。平移半个周期则不行：$\\${f} ${radTex(60 + 45 * period)} = ${sTex(vh)} \\ne ${sTex(v0)}$。`,
    );
    return piProblem(
      t(`What is the period of $y = \\${f} x$?`, `$y = \\${f} x$ 的周期是多少？`),
      pTex,
      join(
        period === 4
          ? t(
              `Adding $2\\pi$ to an angle is one full turn, which brings the terminal side back to the same place, so $\\${f}(x + 2\\pi) = \\${f} x$, and no smaller positive shift works for every $x$. The period is $2\\pi$.`,
              `给角加上 $2\\pi$ 就是转一整圈，终边回到原处，所以 $\\${f}(x + 2\\pi) = \\${f} x$，而更小的正平移不能对所有 $x$ 成立。周期是 $2\\pi$。`,
            )
          : t(
              `Adding $\\pi$ to an angle moves the point $(a, b)$ on the unit circle to $(-a, -b)$, and the ratio of the coordinates does not change. So $\\${f}(x + \\pi) = \\${f} x$, and the period is $\\pi$.`,
              `给角加上 $\\pi$，单位圆上的点 $(a, b)$ 变为 $(-a, -b)$，坐标之比不变。所以 $\\${f}(x + \\pi) = \\${f} x$，周期是 $\\pi$。`,
            ),
        periodCheck,
      ),
      [uTex(period * 2), uTex(period / 2), uTex(1)],
    );
  }
  if (r < 0.2) {
    return reasoned(
      choiceProblem({
        prompt: t(`Is $y = \\${f} x$ even, odd or neither?`, `$y = \\${f} x$ 是偶函数、奇函数，还是都不是？`),
        options: parityOptions,
        correct: even ? 0 : 1,
        solution: join(parityStated[f], parityCheck(f)),
      }),
      parityReasons(f),
    );
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
    solution: join(
      ...parts,
      both("", "", last),
      shiftCheck(f, kind === 0 ? 60 + 90 * j * period : kind === 1 ? -60 : 90 * Math.abs(j) * period - 60, arg0, flips),
    ),
  });
}

/** shiftCheck tests a rule for f(θ + c) on θ = π/3, where the argument is d degrees. */
function shiftCheck(f: Fn, d: number, argTex: string, flips: boolean): Text {
  const sub = argTex.replace("\\theta", "\\frac{\\pi}{3}");
  const mid = radTex(d) === sub ? "" : ` = \\${f} ${arg(radTex(d))}`;
  const line = `\\${f}\\left(${sub}\\right)${mid} = ${sTex(exact(f, d)!)}`;
  return said(
    `Test the rule on $\\theta = \\frac{\\pi}{3}$, where $\\${f} \\frac{\\pi}{3} = ${sTex(exact(f, 60)!)}$. Then $${line}$. This is ${flips ? "the opposite of" : "equal to"} $\\${f} \\frac{\\pi}{3}$, just as the answer is ${flips ? "the opposite of" : "equal to"} the given value.`,
    `用 $\\theta = \\frac{\\pi}{3}$ 检验这条规律，此时 $\\${f} \\frac{\\pi}{3} = ${sTex(exact(f, 60)!)}$。于是 $${line}$。它${flips ? "是" : "等于"} $\\${f} \\frac{\\pi}{3}$ ${flips ? "的相反数" : ""}，正如答案${flips ? "是所给值的相反数" : "等于所给值"}。`,
  );
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
  const xu = arg(uTex(u));
  const at =
    ft.kind === "asymptote"
      ? t(
          `At it, $${zeroOf(f).replace("x", xu)} = 0$, so $\\${f} x$ has no value there.`,
          `在该处 $${zeroOf(f).replace("x", xu)} = 0$，所以 $\\${f} x$ 在那里没有值。`,
        )
      : t(`At it, $\\${f} ${xu} = ${sTex(exact(f, 90 * u)!)}$.`, `在该处 $\\${f} ${xu} = ${sTex(exact(f, 90 * u)!)}$。`);
  const featureCheck = join(
    said(
      `The answer is in the interval: $${uTex(a)} \\le ${uTex(u)} < ${uTex(a + ft.P)}$.`,
      `答案在区间内：$${uTex(a)} \\le ${uTex(u)} < ${uTex(a + ft.P)}$。`,
    ),
    t(` ${at.en}`, at["zh-CN"]),
  );
  return piProblem(
    featurePrompt(f, ft.kind, uTex(a), uTex(a + ft.P)),
    uTex(u),
    join(
      both(
        `The ${name.en} of $y = \\${f} x$ are at $x = ${familyTex(ft)}$ for integers $k$, one in every interval of length $${step}$. The one with $${uTex(a)} \\le x < ${uTex(a + ft.P)}$ has $k = ${k}$:`,
        `$y = \\${f} x$ 的${name["zh-CN"]}位于 $x = ${familyTex(ft)}$（$k$ 为整数），每个长为 $${step}$ 的区间内恰有一个。满足 $${uTex(a)} \\le x < ${uTex(a + ft.P)}$ 的那个对应 $k = ${k}$：`,
        line,
      ),
      featureCheck,
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
  if ((f === "tan" || f === "cot") && rng.int(0, 2) === 0) return acrossAsymptoteProblem(rng, f);
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
  const s1 = stepLabel(1, "Move the interval into one period", "把区间移到一个周期内");
  const s2 = stepLabel(2, "Find the piece it lies in", "找出它所在的单调区间");
  // Two points to compare: the end at an odd multiple of π/4 and the multiple of π/6 inside, in degrees.
  const e = 45 * (a % 2 !== 0 ? a : a + 1);
  const m = 15 * ((3 * a + 1) % 2 === 0 ? 3 * a + 1 : 3 * a + 2);
  const [x1, x2] = e < m ? [e, m] : [m, e];
  const [v1, v2] = [exact(f, x1)!, exact(f, x2)!];
  return choiceProblem({
    prompt: t(`Is $y = \\${f} x$ increasing or decreasing on the interval $${iTex}$?`, `$y = \\${f} x$ 在区间 $${iTex}$ 上递增还是递减？`),
    options: monotonyOptions,
    correct: inc ? 0 : 1,
    solution: join(
      j === 0
        ? t(
            `${s1.en} The interval already lies in the period from $${qTex(base)}$ to $${qTex(base + P)}$.`,
            `${s1["zh-CN"]}区间已经在从 $${qTex(base)}$ 到 $${qTex(base + P)}$ 的一个周期内。`,
          )
        : both(
            `${s1.en} The period is $${uTex(period)}$, so shift the interval back into one period:`,
            `${s1["zh-CN"]}周期是 $${uTex(period)}$，所以把区间平移回一个周期内：`,
            `${iTex}${shift}`,
          ),
      t(
        `\n\n${s2.en} The interval $\\left(${qTex(a0)}, ${qTex(a0 + 1)}\\right)$ lies inside $\\left(${qTex(lo)}, ${qTex(hi)}\\right)$, on which $y = \\${f} x$ is ${word.en}. So it is ${word.en} on $${iTex}$.`,
        `\n\n${s2["zh-CN"]}区间 $\\left(${qTex(a0)}, ${qTex(a0 + 1)}\\right)$ 包含在 $\\left(${qTex(lo)}, ${qTex(hi)}\\right)$ 内，$y = \\${f} x$ 在其上${word["zh-CN"]}。所以它在 $${iTex}$ 上${word["zh-CN"]}。`,
      ),
      said(
        `Compare two values. At $x = ${radTex(x1)}$, $\\${f} x = ${sTex(v1)}$. At $x = ${radTex(x2)}$, $\\${f} x = ${sTex(v2)}$. The value ${inc ? "rises" : "falls"} from about $${dec(approx(v1))}$ to $${dec(approx(v2))}$.`,
        `比较两个值。在 $x = ${radTex(x1)}$ 处 $\\${f} x = ${sTex(v1)}$，在 $x = ${radTex(x2)}$ 处 $\\${f} x = ${sTex(v2)}$。函数值从约 $${dec(approx(v1))}$ ${inc ? "升" : "降"}到约 $${dec(approx(v2))}$。`,
      ),
    ),
  });
}

/** acrossAsymptoteProblem asks about tangent or cotangent on an interval that contains an asymptote, where it is neither increasing nor decreasing. */
function acrossAsymptoteProblem(rng: Rng, f: "tan" | "cot"): Problem {
  const u = (f === "tan" ? 2 : 0) + 4 * rng.int(-2, 1);
  const iTex = `\\left(${qTex(u - 1)}, ${qTex(u + 1)}\\right)`;
  const [left, right] = f === "tan" ? [1, -1] : [-1, 1];
  const values = `\\${f}\\left(${qTex(u - 1)}\\right) = ${left} ${f === "tan" ? ">" : "<"} \\${f}\\left(${qTex(u + 1)}\\right) = ${right}`;
  const [rise, side] = f === "tan" ? [t("rises", "上升"), t("increasing", "递增")] : [t("falls", "下降"), t("decreasing", "递减")];
  const s1 = stepLabel(1, "Look for an asymptote", "找渐近线");
  const s2 = stepLabel(2, "Compare the two sides", "比较两侧");
  const [x1, x2] = [45 * u - 30, 45 * u + 30];
  const [v1, v2] = [exact(f, x1)!, exact(f, x2)!];
  const other = f === "tan" ? t("decreasing", "递减") : t("increasing", "递增");
  return reasoned(
    choiceProblem({
      prompt: t(
        `Is $y = \\${f} x$ increasing or decreasing on the interval $${iTex}$?`,
        `$y = \\${f} x$ 在区间 $${iTex}$ 上递增还是递减？`,
      ),
      options: [...monotonyOptions, t("Neither", "都不是")],
      correct: 2,
      solution: join(
        t(
          `${s1.en} The asymptote $x = ${qTex(u)}$ lies inside $${iTex}$ and splits it into two pieces on different branches.`,
          `${s1["zh-CN"]}渐近线 $x = ${qTex(u)}$ 在 $${iTex}$ 内，把它分成位于不同分支上的两段。`,
        ),
        t(
          `\n\n${s2.en} The graph ${rise.en} on each side of it, but $${values}$. So $y = \\${f} x$ is not ${side.en} across the asymptote: it is neither increasing nor decreasing on $${iTex}$.`,
          `\n\n${s2["zh-CN"]}图象在它两侧都${rise["zh-CN"]}，但 $${values}$。所以 $y = \\${f} x$ 跨过渐近线时并不${side["zh-CN"]}：它在 $${iTex}$ 上既不递增也不递减。`,
        ),
        said(
          `Two points closer to the asymptote show the same jump. At $x = ${radTex(x1)}$, $\\${f} x = ${sTex(v1)}$. At $x = ${radTex(x2)}$, $\\${f} x = ${sTex(v2)}$.`,
          `离渐近线更近的两个点也显示同样的跳跃。在 $x = ${radTex(x1)}$ 处 $\\${f} x = ${sTex(v1)}$，在 $x = ${radTex(x2)}$ 处 $\\${f} x = ${sTex(v2)}$。`,
        ),
      ),
    }),
    [
      [
        side.en === "increasing" ? "Increasing" : "Decreasing",
        `Each branch ${rise.en}, but across the asymptote the value jumps the other way: $${values}$.`,
        `每一支都${rise["zh-CN"]}，但跨过渐近线时函数值反向跳跃：$${values}$。`,
      ],
      [
        other.en === "increasing" ? "Increasing" : "Decreasing",
        `The graph ${rise.en} on each side of the asymptote, so it is not ${other.en}.`,
        `图象在渐近线两侧都${rise["zh-CN"]}，所以它不是${other["zh-CN"]}的。`,
      ],
    ],
  );
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
      figure: waveDrawings[`describing-properties-of-the-${name.en}-function#period-and-symmetry-of-the-${name.en}-function`],
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
      figure:
        waveDrawings[`describing-properties-of-the-${name.en}-function#intervals-of-increase-and-decrease-of-the-${name.en}-function`],
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
  intro: t(
    `You have drawn the graph of $y = \\sin x$ and met even and odd functions and local extrema. Now read those features off the graph and say them precisely: the inputs and outputs it allows, how it repeats, its symmetry, where it is $0$, highest or lowest, and where it rises or falls. These properties let you answer questions about sine without drawing it each time.

Walk once around the window $0 \\le x \\le 2\\pi$. The graph starts at $\\sin 0 = 0$, climbs to its **maximum** $\\sin \\frac{\\pi}{2} = 1$, comes back down through $\\sin \\pi = 0$, reaches its **minimum** $\\sin \\frac{3\\pi}{2} = -1$, and returns to $\\sin 2\\pi = 0$. So in this window the zeros are $0$, $\\pi$ and $2\\pi$. Sine **increases** on $\\left(0, \\frac{\\pi}{2}\\right)$, **decreases** on $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$, and increases again on $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$. Every output lies between $-1$ and $1$. The next turn repeats all of it.`,
    `你已经画过 $y = \\sin x$ 的图象，也学过奇函数、偶函数和局部极值。现在要从图象上读出这些特征并准确地说出来：允许的输入与输出、怎样重复、对称性、在哪里为 $0$、最高或最低，以及在哪里上升或下降。有了这些性质，不必每次画图就能回答关于正弦的问题。

在窗口 $0 \\le x \\le 2\\pi$ 上走一圈。图象从 $\\sin 0 = 0$ 出发，升到**最大值** $\\sin \\frac{\\pi}{2} = 1$，再降回 $\\sin \\pi = 0$，到达**最小值** $\\sin \\frac{3\\pi}{2} = -1$，最后回到 $\\sin 2\\pi = 0$。所以在这个窗口里零点是 $0$、$\\pi$ 和 $2\\pi$。正弦在 $\\left(0, \\frac{\\pi}{2}\\right)$ 上**递增**，在 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$ 上**递减**，在 $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$ 上又递增。每个输出都在 $-1$ 与 $1$ 之间。下一圈把这一切重复一遍。`,
  ),
  knowledgePoints: propertyKnowledgePoints("sin", {
    domainRange: t(
      "The sine of any angle is the $y$-coordinate of the point where its terminal side meets the unit circle, so:\n\n- the **domain** of $y = \\sin x$ is all real numbers;\n- the **range** is $[-1, 1]$, since the $y$-coordinates on the unit circle run from $-1$ to $1$.\n\nSo $\\sin x = \\frac{3}{4}$ has solutions, but $\\sin x = \\frac{5}{4}$ has none. For a value with a radical, compare its square with $1$: $\\left(\\frac{\\sqrt{5}}{2}\\right)^2 = \\frac{5}{4} > 1$, so $\\sin x = \\frac{\\sqrt{5}}{2}$ has no solution.\n\n> **Watch out.** The range limits the values of sine, not the angles. $\\sin x = 2$ has no solution, but $\\sin 2$ is a perfectly good number, about $0.909$, since any real $x$ is allowed.",
      "任意角的正弦是其终边与单位圆交点的 $y$ 坐标，所以：\n\n- $y = \\sin x$ 的**定义域**是全体实数；\n- **值域**是 $[-1, 1]$，因为单位圆上的 $y$ 坐标从 $-1$ 取到 $1$。\n\n所以 $\\sin x = \\frac{3}{4}$ 有解，而 $\\sin x = \\frac{5}{4}$ 无解。对含根号的值，比较它的平方与 $1$：$\\left(\\frac{\\sqrt{5}}{2}\\right)^2 = \\frac{5}{4} > 1$，所以 $\\sin x = \\frac{\\sqrt{5}}{2}$ 无解。\n\n> **注意。** 值域限制的是正弦的值，而不是角。$\\sin x = 2$ 无解，但 $\\sin 2$ 是一个完全正常的数，约为 $0.909$，因为任何实数 $x$ 都可以。",
    ),
    periodSymmetry: t(
      "One full turn returns the terminal side to the same place, so $\\sin(x + 2\\pi) = \\sin x$: the **period** is $2\\pi$. The angles $x$ and $-x$ are mirror images across the $x$-axis, so $\\sin(-x) = -\\sin x$: sine is **odd**, and its graph is symmetric about the origin.\n\nIf $\\sin \\theta = \\frac{2}{5}$, then $\\sin(\\theta - 4\\pi) = \\frac{2}{5}$, $\\sin(-\\theta) = -\\frac{2}{5}$, and $\\sin(2\\pi - \\theta) = \\sin(-\\theta) = -\\frac{2}{5}$.\n\n> **Watch out.** $\\sin(2\\pi - \\theta)$ is not $\\sin \\theta$. Dropping the whole turn leaves $\\sin(-\\theta)$, and sine is odd, so the sign flips.",
      "转一整圈终边回到原处，所以 $\\sin(x + 2\\pi) = \\sin x$：**周期**是 $2\\pi$。角 $x$ 与 $-x$ 关于 $x$ 轴对称，所以 $\\sin(-x) = -\\sin x$：正弦是**奇函数**，图象关于原点对称。\n\n若 $\\sin \\theta = \\frac{2}{5}$，则 $\\sin(\\theta - 4\\pi) = \\frac{2}{5}$，$\\sin(-\\theta) = -\\frac{2}{5}$，$\\sin(2\\pi - \\theta) = \\sin(-\\theta) = -\\frac{2}{5}$。\n\n> **注意。** $\\sin(2\\pi - \\theta)$ 不等于 $\\sin \\theta$。去掉整圈后剩下 $\\sin(-\\theta)$，而正弦是奇函数，所以符号要变。",
    ),
    features: t(
      "For integers $k$, $y = \\sin x$ has\n\n- **zeros** at $x = k\\pi$,\n- its **maximum** $1$ at $x = \\frac{\\pi}{2} + 2k\\pi$,\n- its **minimum** $-1$ at $x = \\frac{3\\pi}{2} + 2k\\pi$.\n\nEach interval of length $2\\pi$ such as $a \\le x < a + 2\\pi$ contains exactly one maximum point. For $4\\pi \\le x < 6\\pi$, take $k = 2$: $x = \\frac{\\pi}{2} + 2 \\cdot 2\\pi = \\frac{9\\pi}{2}$.\n\n> **Watch out.** Zeros come every $\\pi$, but maxima only every $2\\pi$. In $a \\le x < a + 2\\pi$ the left end counts and the right end does not, so pick the $k$ that lands inside.",
      "对整数 $k$，$y = \\sin x$ 有\n\n- **零点** $x = k\\pi$，\n- **最大值** $1$，在 $x = \\frac{\\pi}{2} + 2k\\pi$ 处取得，\n- **最小值** $-1$，在 $x = \\frac{3\\pi}{2} + 2k\\pi$ 处取得。\n\n每个长为 $2\\pi$ 的区间，如 $a \\le x < a + 2\\pi$，恰含一个最大值点。对 $4\\pi \\le x < 6\\pi$，取 $k = 2$：$x = \\frac{\\pi}{2} + 2 \\cdot 2\\pi = \\frac{9\\pi}{2}$。\n\n> **注意。** 零点每隔 $\\pi$ 出现一次，最大值点却每隔 $2\\pi$ 才出现一次。在 $a \\le x < a + 2\\pi$ 中左端点算在内、右端点不算，所以要选落在区间内的 $k$。",
    ),
    monotony: t(
      "Between a minimum and the next maximum the graph rises, and between a maximum and the next minimum it falls. Over one period, $y = \\sin x$ is **increasing** on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ and **decreasing** on $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$, and this repeats every $2\\pi$.\n\nOn $\\left(\\frac{11\\pi}{4}, 3\\pi\\right)$: subtract $2\\pi$ to get $\\left(\\frac{3\\pi}{4}, \\pi\\right)$, inside $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$, so sine is decreasing there.\n\n> **Watch out.** Shift by whole periods of $2\\pi$, not by $\\pi$. Shifting $\\left(\\frac{11\\pi}{4}, 3\\pi\\right)$ by $\\pi$ gives $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$, where sine increases, the opposite of the truth.",
      "从最小值点到下一个最大值点图象上升，从最大值点到下一个最小值点图象下降。在一个周期内，$y = \\sin x$ 在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 上**递增**，在 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$ 上**递减**，并且每隔 $2\\pi$ 重复。\n\n在 $\\left(\\frac{11\\pi}{4}, 3\\pi\\right)$ 上：减去 $2\\pi$ 得 $\\left(\\frac{3\\pi}{4}, \\pi\\right)$，它在 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{2}\\right)$ 内，所以正弦在那里递减。\n\n> **注意。** 要平移整周期 $2\\pi$，不能平移 $\\pi$。把 $\\left(\\frac{11\\pi}{4}, 3\\pi\\right)$ 平移 $\\pi$ 得到 $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$，正弦在那里递增，与事实相反。",
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
  intro: t(
    `You can now describe sine: its range, period, symmetry, zeros, extrema and monotony. Cosine has the same shape, shifted, so every property of sine carries over once you know the shift. Knowing them lets you answer questions about cosine at once.

On the unit circle, turning a further $\\frac{\\pi}{2}$ takes the point $(\\cos x, \\sin x)$ to one whose $y$-coordinate is $\\cos x$. So $\\cos x = \\sin\\left(x + \\frac{\\pi}{2}\\right)$, and the cosine graph is the sine graph moved $\\frac{\\pi}{2}$ to the left. Each feature of sine moves with it. The sine maximum at $\\frac{\\pi}{2}$ becomes the cosine maximum at $\\frac{\\pi}{2} - \\frac{\\pi}{2} = 0$, so $\\cos 0 = 1$. The sine zero at $\\pi$ becomes the cosine zero at $\\frac{\\pi}{2}$, so $\\cos \\frac{\\pi}{2} = 0$. The range $[-1, 1]$ and the period $2\\pi$ do not change at all.`,
    `你已经会描述正弦：值域、周期、对称性、零点、极值和单调性。余弦的形状与正弦相同，只是平移了，所以只要知道平移量，正弦的每条性质都能搬过来。掌握这些性质，就能立刻回答关于余弦的问题。

在单位圆上再转 $\\frac{\\pi}{2}$，点 $(\\cos x, \\sin x)$ 就转到一个 $y$ 坐标为 $\\cos x$ 的点。所以 $\\cos x = \\sin\\left(x + \\frac{\\pi}{2}\\right)$，余弦图象就是正弦图象向左平移 $\\frac{\\pi}{2}$。正弦的每个特征都随之移动。正弦在 $\\frac{\\pi}{2}$ 处的最大值变成余弦在 $\\frac{\\pi}{2} - \\frac{\\pi}{2} = 0$ 处的最大值，所以 $\\cos 0 = 1$。正弦在 $\\pi$ 处的零点变成余弦在 $\\frac{\\pi}{2}$ 处的零点，所以 $\\cos \\frac{\\pi}{2} = 0$。值域 $[-1, 1]$ 和周期 $2\\pi$ 完全不变。`,
  ),
  knowledgePoints: propertyKnowledgePoints("cos", {
    domainRange: t(
      "The cosine of any angle is the $x$-coordinate of the point where its terminal side meets the unit circle, so the **domain** of $y = \\cos x$ is all real numbers and the **range** is $[-1, 1]$.\n\nSo $\\cos x = -\\frac{2}{3}$ has solutions, but $\\cos x = -\\frac{3}{2}$ has none. With a radical, compare the square with $1$: $\\left(\\frac{2\\sqrt{2}}{3}\\right)^2 = \\frac{8}{9} \\le 1$, so $\\cos x = \\frac{2\\sqrt{2}}{3}$ has solutions.\n\n> **Watch out.** With a radical, compare the square, not a rough look. $\\frac{2\\sqrt{2}}{3}$ looks large, but its square is $\\frac{8}{9} \\le 1$, so it is a value of cosine.",
      "任意角的余弦是其终边与单位圆交点的 $x$ 坐标，所以 $y = \\cos x$ 的**定义域**是全体实数，**值域**是 $[-1, 1]$。\n\n所以 $\\cos x = -\\frac{2}{3}$ 有解，而 $\\cos x = -\\frac{3}{2}$ 无解。含根号时，比较平方与 $1$：$\\left(\\frac{2\\sqrt{2}}{3}\\right)^2 = \\frac{8}{9} \\le 1$，所以 $\\cos x = \\frac{2\\sqrt{2}}{3}$ 有解。\n\n> **注意。** 带根号时要比较平方，不要凭感觉。$\\frac{2\\sqrt{2}}{3}$ 看起来很大，但它的平方是 $\\frac{8}{9} \\le 1$，所以它是余弦的一个值。",
    ),
    periodSymmetry: t(
      "Like sine, cosine has **period** $2\\pi$: $\\cos(x + 2\\pi) = \\cos x$. The angles $x$ and $-x$ meet the unit circle at $(a, b)$ and $(a, -b)$, with the same $x$-coordinate, so $\\cos(-x) = \\cos x$: cosine is **even**, and its graph is symmetric about the $y$-axis.\n\nIf $\\cos \\theta = -\\frac{1}{4}$, then $\\cos(\\theta + 6\\pi) = -\\frac{1}{4}$ and $\\cos(4\\pi - \\theta) = \\cos(-\\theta) = -\\frac{1}{4}$.\n\n> **Watch out.** Cosine is even, so no sign changes. $\\cos(4\\pi - \\theta) = \\cos(-\\theta) = \\cos \\theta$, while for sine the same steps give $-\\sin \\theta$.",
      "与正弦一样，余弦的**周期**是 $2\\pi$：$\\cos(x + 2\\pi) = \\cos x$。角 $x$ 与 $-x$ 与单位圆交于 $(a, b)$ 与 $(a, -b)$，$x$ 坐标相同，所以 $\\cos(-x) = \\cos x$：余弦是**偶函数**，图象关于 $y$ 轴对称。\n\n若 $\\cos \\theta = -\\frac{1}{4}$，则 $\\cos(\\theta + 6\\pi) = -\\frac{1}{4}$，$\\cos(4\\pi - \\theta) = \\cos(-\\theta) = -\\frac{1}{4}$。\n\n> **注意。** 余弦是偶函数，所以符号不变。$\\cos(4\\pi - \\theta) = \\cos(-\\theta) = \\cos \\theta$，而对正弦，同样的步骤得到 $-\\sin \\theta$。",
    ),
    features: t(
      "For integers $k$, $y = \\cos x$ has\n\n- **zeros** at $x = \\frac{\\pi}{2} + k\\pi$,\n- its **maximum** $1$ at $x = 2k\\pi$,\n- its **minimum** $-1$ at $x = \\pi + 2k\\pi$.\n\nFor the minimum with $-2\\pi \\le x < 0$, take $k = -1$: $x = \\pi - 2\\pi = -\\pi$.\n\n> **Watch out.** The maximum of cosine is at $x = 0$, not at $\\frac{\\pi}{2}$, where sine has it. At $\\frac{\\pi}{2}$ cosine is $0$.",
      "对整数 $k$，$y = \\cos x$ 有\n\n- **零点** $x = \\frac{\\pi}{2} + k\\pi$，\n- **最大值** $1$，在 $x = 2k\\pi$ 处取得，\n- **最小值** $-1$，在 $x = \\pi + 2k\\pi$ 处取得。\n\n求 $-2\\pi \\le x < 0$ 内的最小值点，取 $k = -1$：$x = \\pi - 2\\pi = -\\pi$。\n\n> **注意。** 余弦的最大值点在 $x = 0$，不在正弦取最大值的 $\\frac{\\pi}{2}$。在 $\\frac{\\pi}{2}$ 处余弦为 $0$。",
    ),
    monotony: t(
      "Over one period, $y = \\cos x$ is **decreasing** on $(0, \\pi)$, from its maximum to its minimum, and **increasing** on $(\\pi, 2\\pi)$, and this repeats every $2\\pi$.\n\nOn $\\left(-\\frac{3\\pi}{4}, -\\frac{\\pi}{2}\\right)$: add $2\\pi$ to get $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$, inside $(\\pi, 2\\pi)$, so cosine is increasing there.\n\n> **Watch out.** Cosine starts at its maximum, so it decreases first, on $(0, \\pi)$, and increases on $(\\pi, 2\\pi)$. Do not copy the pattern of sine, which increases first.",
      "在一个周期内，$y = \\cos x$ 在 $(0, \\pi)$ 上从最大值降到最小值，**递减**；在 $(\\pi, 2\\pi)$ 上**递增**，并且每隔 $2\\pi$ 重复。\n\n在 $\\left(-\\frac{3\\pi}{4}, -\\frac{\\pi}{2}\\right)$ 上：加 $2\\pi$ 得 $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$，在 $(\\pi, 2\\pi)$ 内，所以余弦在那里递增。\n\n> **注意。** 余弦从最大值出发，所以先递减，在 $(0, \\pi)$ 上，再在 $(\\pi, 2\\pi)$ 上递增。不要照搬先递增的正弦的规律。",
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
  encompasses: [{ topic: "graphing-tangent-and-cotangent", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.TF.A.4"],
  intro: t(
    `You know the properties of sine and cosine and have graphed $y = \\tan x$. Since $\\tan x = \\frac{\\sin x}{\\cos x}$, its properties follow from theirs, but they look different: tangent has gaps, takes every value, and repeats twice as often. Describing them precisely tells you where tangent can be used and what it does there.

Look at the middle branch on $\\left(-\\frac{\\pi}{4}, \\frac{\\pi}{4}\\right)$. At the left end $\\tan\\left(-\\frac{\\pi}{4}\\right) = -1$. In the middle $\\tan 0 = 0$, a **zero**. At the right end $\\tan \\frac{\\pi}{4} = 1$. The values rise from $-1$ through $0$ to $1$, so tangent is **increasing** here. Going further toward $\\frac{\\pi}{2}$, $\\cos x$ shrinks to $0$ and the values grow without bound, so the line $x = \\frac{\\pi}{2}$ is an asymptote and tangent is not defined there.`,
    `你已经知道正弦、余弦的性质，也画过 $y = \\tan x$ 的图象。由于 $\\tan x = \\frac{\\sin x}{\\cos x}$，它的性质由正弦、余弦得出，但看起来不同：正切有间断，取遍所有值，重复得快一倍。准确描述这些性质，就知道正切在哪里能用、在那里怎样变化。

看中间一支在 $\\left(-\\frac{\\pi}{4}, \\frac{\\pi}{4}\\right)$ 上的部分。左端 $\\tan\\left(-\\frac{\\pi}{4}\\right) = -1$。中间 $\\tan 0 = 0$，是一个**零点**。右端 $\\tan \\frac{\\pi}{4} = 1$。函数值从 $-1$ 经过 $0$ 升到 $1$，所以正切在这里**递增**。再往 $\\frac{\\pi}{2}$ 走，$\\cos x$ 缩到 $0$，函数值无限增大，所以直线 $x = \\frac{\\pi}{2}$ 是渐近线，正切在那里无定义。`,
  ),
  knowledgePoints: propertyKnowledgePoints("tan", {
    domainRange: t(
      "Since $\\tan x = \\frac{\\sin x}{\\cos x}$, it is not defined where $\\cos x = 0$:\n\n- the **domain** is all real numbers except $x = \\frac{\\pi}{2} + k\\pi$ for integers $k$;\n- the **range** is all real numbers, $(-\\infty, \\infty)$, since each branch rises from $-\\infty$ to $\\infty$.\n\nFor example, $\\tan \\frac{5\\pi}{2}$ is not defined, because $\\frac{5\\pi}{2} = \\frac{\\pi}{2} + 2\\pi$ and $\\cos \\frac{5\\pi}{2} = 0$; but $\\tan \\frac{5\\pi}{4} = 1$ is defined. Any value, such as $\\tan x = 25$, has solutions.\n\n> **Watch out.** Tangent is not defined at the odd multiples of $\\frac{\\pi}{2}$, where cosine is $0$. At multiples of $\\pi$ it is defined: $\\tan \\pi = 0$.",
      "因为 $\\tan x = \\frac{\\sin x}{\\cos x}$，它在 $\\cos x = 0$ 处无定义：\n\n- **定义域**是除 $x = \\frac{\\pi}{2} + k\\pi$（$k$ 为整数）以外的全体实数；\n- **值域**是全体实数 $(-\\infty, \\infty)$，因为每一支都从 $-\\infty$ 升到 $\\infty$。\n\n例如 $\\tan \\frac{5\\pi}{2}$ 无定义，因为 $\\frac{5\\pi}{2} = \\frac{\\pi}{2} + 2\\pi$，$\\cos \\frac{5\\pi}{2} = 0$；而 $\\tan \\frac{5\\pi}{4} = 1$ 有定义。任何值，如 $\\tan x = 25$，都有解。\n\n> **注意。** 正切在 $\\frac{\\pi}{2}$ 的奇数倍处无定义，那里余弦为 $0$。在 $\\pi$ 的倍数处它有定义：$\\tan \\pi = 0$。",
    ),
    periodSymmetry: t(
      "Adding $\\pi$ to an angle moves its point on the unit circle from $(a, b)$ to $(-a, -b)$, and $\\frac{-b}{-a} = \\frac{b}{a}$, so $\\tan(x + \\pi) = \\tan x$: the **period** is $\\pi$, half that of sine and cosine. Also $\\tan(-x) = \\frac{-\\sin x}{\\cos x} = -\\tan x$: tangent is **odd**.\n\nIf $\\tan \\theta = \\frac{7}{3}$, then $\\tan(\\theta + 3\\pi) = \\frac{7}{3}$ and $\\tan(2\\pi - \\theta) = \\tan(-\\theta) = -\\frac{7}{3}$.\n\n> **Watch out.** The period is $\\pi$, so any multiple of $\\pi$ may be dropped, and tangent is odd. Do not turn $\\frac{7}{3}$ into its reciprocal $\\frac{3}{7}$: that is the cotangent.",
      "给角加上 $\\pi$，它在单位圆上的点从 $(a, b)$ 变为 $(-a, -b)$，而 $\\frac{-b}{-a} = \\frac{b}{a}$，所以 $\\tan(x + \\pi) = \\tan x$：**周期**是 $\\pi$，是正弦、余弦周期的一半。又 $\\tan(-x) = \\frac{-\\sin x}{\\cos x} = -\\tan x$：正切是**奇函数**。\n\n若 $\\tan \\theta = \\frac{7}{3}$，则 $\\tan(\\theta + 3\\pi) = \\frac{7}{3}$，$\\tan(2\\pi - \\theta) = \\tan(-\\theta) = -\\frac{7}{3}$。\n\n> **注意。** 周期是 $\\pi$，所以 $\\pi$ 的任何倍数都可以去掉，而且正切是奇函数。不要把 $\\frac{7}{3}$ 变成它的倒数 $\\frac{3}{7}$：那是余切。",
    ),
    features: t(
      "For integers $k$, $y = \\tan x$ has **zeros** where $\\sin x = 0$, at $x = k\\pi$, and **vertical asymptotes** where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$. It has no maximum or minimum. Each interval of length $\\pi$ such as $a \\le x < a + \\pi$ contains exactly one of each.\n\nFor the asymptote with $2\\pi \\le x < 3\\pi$, take $k = 2$: $x = \\frac{\\pi}{2} + 2\\pi = \\frac{5\\pi}{2}$.\n\n> **Watch out.** Tangent has no maximum or minimum, since each branch takes every value. Keep zeros and asymptotes apart: zeros where $\\sin x = 0$, asymptotes where $\\cos x = 0$.",
      "对整数 $k$，$y = \\tan x$ 在 $\\sin x = 0$ 处有**零点** $x = k\\pi$，在 $\\cos x = 0$ 处有**竖直渐近线** $x = \\frac{\\pi}{2} + k\\pi$。它没有最大值和最小值。每个长为 $\\pi$ 的区间，如 $a \\le x < a + \\pi$，各恰含一个。\n\n求 $2\\pi \\le x < 3\\pi$ 内的渐近线，取 $k = 2$：$x = \\frac{\\pi}{2} + 2\\pi = \\frac{5\\pi}{2}$。\n\n> **注意。** 正切没有最大值和最小值，因为每一支都取遍所有值。不要混淆零点和渐近线：零点在 $\\sin x = 0$ 处，渐近线在 $\\cos x = 0$ 处。",
    ),
    monotony: t(
      "On each branch, $\\left(-\\frac{\\pi}{2} + k\\pi, \\frac{\\pi}{2} + k\\pi\\right)$, the graph of $y = \\tan x$ rises from $-\\infty$ to $\\infty$: tangent is **increasing** on every interval between consecutive asymptotes, and never decreasing. (It is not increasing across an asymptote: $\\tan \\frac{\\pi}{4} = 1 > \\tan \\frac{3\\pi}{4} = -1$.)\n\nOn $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$: subtract $\\pi$ to get $\\left(\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right)$, inside $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, so tangent is increasing there.\n\n> **Watch out.** Increasing on each branch does not mean increasing across an asymptote. On $\\left(\\frac{\\pi}{4}, \\frac{3\\pi}{4}\\right)$, which contains $\\frac{\\pi}{2}$, tangent drops from $\\infty$ to $-\\infty$ and is neither increasing nor decreasing.",
      "在每一支 $\\left(-\\frac{\\pi}{2} + k\\pi, \\frac{\\pi}{2} + k\\pi\\right)$ 上，$y = \\tan x$ 的图象从 $-\\infty$ 升到 $\\infty$：正切在相邻两条渐近线之间的每个区间上都**递增**，从不递减。（跨过渐近线时不是递增的：$\\tan \\frac{\\pi}{4} = 1 > \\tan \\frac{3\\pi}{4} = -1$。）\n\n在 $\\left(\\frac{5\\pi}{4}, \\frac{3\\pi}{2}\\right)$ 上：减去 $\\pi$ 得 $\\left(\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right)$，在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 内，所以正切在那里递增。\n\n> **注意。** 在每一支上递增，并不表示跨过渐近线也递增。在包含 $\\frac{\\pi}{2}$ 的 $\\left(\\frac{\\pi}{4}, \\frac{3\\pi}{4}\\right)$ 上，正切从 $\\infty$ 跳到 $-\\infty$，既不递增也不递减。",
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
  encompasses: [{ topic: "graphing-secant-and-cosecant", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4"],
  intro: t(
    `You know the properties of cosine and have graphed $y = \\sec x$. Since $\\sec x = \\frac{1}{\\cos x}$, each property of secant comes from one of cosine: where cosine is $0$ secant is not defined, where cosine is large secant is small, and the other way around. Describing them lets you answer questions about secant from what you know of cosine.

Take $x = \\frac{\\pi}{3}$. There $\\cos \\frac{\\pi}{3} = \\frac{1}{2}$, so $\\sec \\frac{\\pi}{3} = \\frac{1}{1/2} = 2$. At $x = \\frac{2\\pi}{3}$, $\\cos \\frac{2\\pi}{3} = -\\frac{1}{2}$, so $\\sec \\frac{2\\pi}{3} = -2$. Between them, at $x = \\frac{\\pi}{2}$, $\\cos x = 0$ and secant has an asymptote. Notice that both values have size at least $1$. Since $|\\cos x| \\le 1$, its reciprocal always has $|\\sec x| \\ge 1$.`,
    `你已经知道余弦的性质，也画过 $y = \\sec x$ 的图象。由于 $\\sec x = \\frac{1}{\\cos x}$，正割的每条性质都来自余弦的一条性质：余弦为 $0$ 处正割无定义，余弦大处正割小，反之亦然。描述这些性质，就能用对余弦的了解回答关于正割的问题。

取 $x = \\frac{\\pi}{3}$。这里 $\\cos \\frac{\\pi}{3} = \\frac{1}{2}$，所以 $\\sec \\frac{\\pi}{3} = \\frac{1}{1/2} = 2$。在 $x = \\frac{2\\pi}{3}$ 处，$\\cos \\frac{2\\pi}{3} = -\\frac{1}{2}$，所以 $\\sec \\frac{2\\pi}{3} = -2$。两者之间的 $x = \\frac{\\pi}{2}$ 处 $\\cos x = 0$，正割有一条渐近线。注意两个值的绝对值都至少是 $1$。因为 $|\\cos x| \\le 1$，它的倒数总有 $|\\sec x| \\ge 1$。`,
  ),
  knowledgePoints: propertyKnowledgePoints("sec", {
    domainRange: t(
      "Since $\\sec x = \\frac{1}{\\cos x}$:\n\n- the **domain** is all real numbers except where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$;\n- the **range** is $(-\\infty, -1] \\cup [1, \\infty)$: where defined, $0 < |\\cos x| \\le 1$, so $|\\sec x| \\ge 1$.\n\nSo $\\sec x = \\frac{1}{2}$ has no solution, since it would need $\\cos x = 2$; but $\\sec x = -3$ has solutions, with $\\cos x = -\\frac{1}{3}$.\n\n> **Watch out.** The range of secant is everything outside $(-1, 1)$, the opposite of the range of cosine. So $\\sec x = \\frac{1}{2}$ has no solution, though $\\cos x = \\frac{1}{2}$ has.",
      "因为 $\\sec x = \\frac{1}{\\cos x}$：\n\n- **定义域**是除 $\\cos x = 0$ 处，即 $x = \\frac{\\pi}{2} + k\\pi$ 以外的全体实数；\n- **值域**是 $(-\\infty, -1] \\cup [1, \\infty)$：在有定义处 $0 < |\\cos x| \\le 1$，所以 $|\\sec x| \\ge 1$。\n\n所以 $\\sec x = \\frac{1}{2}$ 无解，因为那需要 $\\cos x = 2$；而 $\\sec x = -3$ 有解，此时 $\\cos x = -\\frac{1}{3}$。\n\n> **注意。** 正割的值域是 $(-1, 1)$ 以外的全部，与余弦的值域正好相反。所以 $\\sec x = \\frac{1}{2}$ 无解，尽管 $\\cos x = \\frac{1}{2}$ 有解。",
    ),
    periodSymmetry: t(
      "Secant inherits its properties from cosine: $\\sec(x + 2\\pi) = \\frac{1}{\\cos(x + 2\\pi)} = \\sec x$, so the **period** is $2\\pi$, and $\\sec(-x) = \\frac{1}{\\cos(-x)} = \\sec x$, so secant is **even**, with its graph symmetric about the $y$-axis.\n\nIf $\\sec \\theta = \\frac{9}{4}$, then $\\sec(\\theta - 2\\pi) = \\frac{9}{4}$ and $\\sec(-\\theta) = \\frac{9}{4}$.\n\n> **Watch out.** Shifting by a period or changing the sign of the angle leaves secant unchanged, since it is even with period $2\\pi$. It does not turn $\\sec \\theta$ into its reciprocal, which is $\\cos \\theta$.",
      "正割的性质来自余弦：$\\sec(x + 2\\pi) = \\frac{1}{\\cos(x + 2\\pi)} = \\sec x$，所以**周期**是 $2\\pi$；$\\sec(-x) = \\frac{1}{\\cos(-x)} = \\sec x$，所以正割是**偶函数**，图象关于 $y$ 轴对称。\n\n若 $\\sec \\theta = \\frac{9}{4}$，则 $\\sec(\\theta - 2\\pi) = \\frac{9}{4}$，$\\sec(-\\theta) = \\frac{9}{4}$。\n\n> **注意。** 平移一个周期或改变角的符号，正割都不变，因为它是周期为 $2\\pi$ 的偶函数。这不会把 $\\sec \\theta$ 变成它的倒数，那是 $\\cos \\theta$。",
    ),
    features: t(
      "For integers $k$, $y = \\sec x$ has **vertical asymptotes** at $x = \\frac{\\pi}{2} + k\\pi$ and no zeros, since $\\frac{1}{\\cos x}$ is never $0$. Where $\\cos x$ has its maximum $1$, secant has a **local minimum** $1$, at $x = 2k\\pi$; where $\\cos x$ has its minimum $-1$, secant has a **local maximum** $-1$, at $x = \\pi + 2k\\pi$.\n\nFor the local maximum with $2\\pi \\le x < 4\\pi$, take $k = 1$: $x = \\pi + 2\\pi = 3\\pi$.\n\n> **Watch out.** The local minimum $1$ is larger than the local maximum $-1$. Local means compared only with nearby points on the same branch.",
      "对整数 $k$，$y = \\sec x$ 有**竖直渐近线** $x = \\frac{\\pi}{2} + k\\pi$，没有零点，因为 $\\frac{1}{\\cos x}$ 永不为 $0$。在 $\\cos x$ 取最大值 $1$ 处，正割有**极小值** $1$，即 $x = 2k\\pi$；在 $\\cos x$ 取最小值 $-1$ 处，正割有**极大值** $-1$，即 $x = \\pi + 2k\\pi$。\n\n求 $2\\pi \\le x < 4\\pi$ 内的极大值点，取 $k = 1$：$x = \\pi + 2\\pi = 3\\pi$。\n\n> **注意。** 局部极小值 $1$ 比局部极大值 $-1$ 大。局部的意思是只与同一支上附近的点比较。",
    ),
    monotony: t(
      "Taking reciprocals of numbers of the same sign reverses their order, so secant increases where cosine decreases, and the other way around. Over one period, $y = \\sec x$ is **increasing** on $\\left(0, \\frac{\\pi}{2}\\right)$ and $\\left(\\frac{\\pi}{2}, \\pi\\right)$, and **decreasing** on $\\left(\\pi, \\frac{3\\pi}{2}\\right)$ and $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$.\n\nOn $\\left(-\\frac{\\pi}{4}, 0\\right)$: add $2\\pi$ to get $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$, inside $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$, so secant is decreasing there.\n\n> **Watch out.** Secant moves opposite to cosine. On $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$ cosine increases, so secant decreases.",
      "对同号的数取倒数会颠倒它们的大小顺序，所以余弦递减处正割递增，反之亦然。在一个周期内，$y = \\sec x$ 在 $\\left(0, \\frac{\\pi}{2}\\right)$ 和 $\\left(\\frac{\\pi}{2}, \\pi\\right)$ 上**递增**，在 $\\left(\\pi, \\frac{3\\pi}{2}\\right)$ 和 $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$ 上**递减**。\n\n在 $\\left(-\\frac{\\pi}{4}, 0\\right)$ 上：加 $2\\pi$ 得 $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$，在 $\\left(\\frac{3\\pi}{2}, 2\\pi\\right)$ 内，所以正割在那里递减。\n\n> **注意。** 正割与余弦变化方向相反。在 $\\left(\\frac{7\\pi}{4}, 2\\pi\\right)$ 上余弦递增，所以正割递减。",
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
  encompasses: [{ topic: "graphing-secant-and-cosecant", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4"],
  intro: t(
    `You have described secant from cosine. Cosecant is to sine what secant is to cosine: $\\csc x = \\frac{1}{\\sin x}$. So its properties come from those of sine in the same way, and you can find them without new work.

Take $x = \\frac{\\pi}{6}$. There $\\sin \\frac{\\pi}{6} = \\frac{1}{2}$, so $\\csc \\frac{\\pi}{6} = 2$. At $x = \\frac{\\pi}{2}$, $\\sin \\frac{\\pi}{2} = 1$, the largest sine can be, so $\\csc \\frac{\\pi}{2} = 1$, the smallest value of cosecant on $(0, \\pi)$. At $x = \\frac{5\\pi}{6}$ the value is $2$ again. So on this branch cosecant falls from $2$ to $1$ and rises back to $2$: the point $\\left(\\frac{\\pi}{2}, 1\\right)$ is a **local minimum**. At $x = 0$ and $x = \\pi$, $\\sin x = 0$ and cosecant has asymptotes.`,
    `你已经由余弦描述了正割。余割与正弦的关系，正如正割与余弦：$\\csc x = \\frac{1}{\\sin x}$。所以它的性质以同样的方式来自正弦，不必重新推导。

取 $x = \\frac{\\pi}{6}$。这里 $\\sin \\frac{\\pi}{6} = \\frac{1}{2}$，所以 $\\csc \\frac{\\pi}{6} = 2$。在 $x = \\frac{\\pi}{2}$ 处 $\\sin \\frac{\\pi}{2} = 1$，是正弦最大的值，所以 $\\csc \\frac{\\pi}{2} = 1$，是余割在 $(0, \\pi)$ 上最小的值。在 $x = \\frac{5\\pi}{6}$ 处函数值又是 $2$。所以在这一支上余割从 $2$ 降到 $1$ 再升回 $2$：点 $\\left(\\frac{\\pi}{2}, 1\\right)$ 是**局部极小值点**。在 $x = 0$ 和 $x = \\pi$ 处 $\\sin x = 0$，余割有渐近线。`,
  ),
  knowledgePoints: propertyKnowledgePoints("csc", {
    domainRange: t(
      "Since $\\csc x = \\frac{1}{\\sin x}$:\n\n- the **domain** is all real numbers except where $\\sin x = 0$, at $x = k\\pi$;\n- the **range** is $(-\\infty, -1] \\cup [1, \\infty)$: where defined, $0 < |\\sin x| \\le 1$, so $|\\csc x| \\ge 1$.\n\nSo $\\csc x = -\\frac{2}{5}$ has no solution, since it would need $\\sin x = -\\frac{5}{2}$; but $\\csc x = \\frac{5}{2}$ has solutions, with $\\sin x = \\frac{2}{5}$.\n\n> **Watch out.** Cosecant is not defined where $\\sin x = 0$, at $x = k\\pi$, not where $\\cos x = 0$. At $x = \\frac{\\pi}{2}$ it is defined: $\\csc \\frac{\\pi}{2} = 1$.",
      "因为 $\\csc x = \\frac{1}{\\sin x}$：\n\n- **定义域**是除 $\\sin x = 0$ 处，即 $x = k\\pi$ 以外的全体实数；\n- **值域**是 $(-\\infty, -1] \\cup [1, \\infty)$：在有定义处 $0 < |\\sin x| \\le 1$，所以 $|\\csc x| \\ge 1$。\n\n所以 $\\csc x = -\\frac{2}{5}$ 无解，因为那需要 $\\sin x = -\\frac{5}{2}$；而 $\\csc x = \\frac{5}{2}$ 有解，此时 $\\sin x = \\frac{2}{5}$。\n\n> **注意。** 余割在 $\\sin x = 0$ 处，即 $x = k\\pi$ 处无定义，而不是在 $\\cos x = 0$ 处。在 $x = \\frac{\\pi}{2}$ 处它有定义：$\\csc \\frac{\\pi}{2} = 1$。",
    ),
    periodSymmetry: t(
      "Cosecant inherits its properties from sine: the **period** is $2\\pi$, and $\\csc(-x) = \\frac{1}{\\sin(-x)} = -\\csc x$, so cosecant is **odd**, with its graph symmetric about the origin.\n\nIf $\\csc \\theta = -\\frac{5}{3}$, then $\\csc(\\theta + 4\\pi) = -\\frac{5}{3}$ and $\\csc(-\\theta) = \\frac{5}{3}$.\n\n> **Watch out.** Cosecant is odd, so $\\csc(-\\theta) = -\\csc \\theta$. Do not take the reciprocal: if $\\csc \\theta = -\\frac{5}{3}$, then $-\\frac{3}{5}$ is $\\sin \\theta$, not a value of cosecant.",
      "余割的性质来自正弦：**周期**是 $2\\pi$；$\\csc(-x) = \\frac{1}{\\sin(-x)} = -\\csc x$，所以余割是**奇函数**，图象关于原点对称。\n\n若 $\\csc \\theta = -\\frac{5}{3}$，则 $\\csc(\\theta + 4\\pi) = -\\frac{5}{3}$，$\\csc(-\\theta) = \\frac{5}{3}$。\n\n> **注意。** 余割是奇函数，所以 $\\csc(-\\theta) = -\\csc \\theta$。不要取倒数：若 $\\csc \\theta = -\\frac{5}{3}$，则 $-\\frac{3}{5}$ 是 $\\sin \\theta$，不是余割的值。",
    ),
    features: t(
      "For integers $k$, $y = \\csc x$ has **vertical asymptotes** at $x = k\\pi$ and no zeros. Where $\\sin x$ has its maximum $1$, cosecant has a **local minimum** $1$, at $x = \\frac{\\pi}{2} + 2k\\pi$; where $\\sin x$ has its minimum $-1$, cosecant has a **local maximum** $-1$, at $x = \\frac{3\\pi}{2} + 2k\\pi$.\n\nFor the local minimum with $-2\\pi \\le x < 0$, take $k = -1$: $x = \\frac{\\pi}{2} - 2\\pi = -\\frac{3\\pi}{2}$.\n\n> **Watch out.** The maximum and minimum swap. Where sine has its maximum $1$, cosecant has its local minimum $1$, and where sine has its minimum, cosecant has its local maximum.",
      "对整数 $k$，$y = \\csc x$ 有**竖直渐近线** $x = k\\pi$，没有零点。在 $\\sin x$ 取最大值 $1$ 处，余割有**极小值** $1$，即 $x = \\frac{\\pi}{2} + 2k\\pi$；在 $\\sin x$ 取最小值 $-1$ 处，余割有**极大值** $-1$，即 $x = \\frac{3\\pi}{2} + 2k\\pi$。\n\n求 $-2\\pi \\le x < 0$ 内的极小值点，取 $k = -1$：$x = \\frac{\\pi}{2} - 2\\pi = -\\frac{3\\pi}{2}$。\n\n> **注意。** 最大与最小互换。正弦取最大值 $1$ 的地方，余割取局部极小值 $1$；正弦取最小值的地方，余割取局部极大值。",
    ),
    monotony: t(
      "Cosecant increases where sine decreases, and the other way around. Over one period, $y = \\csc x$ is **decreasing** on $\\left(-\\frac{\\pi}{2}, 0\\right)$ and $\\left(0, \\frac{\\pi}{2}\\right)$, and **increasing** on $\\left(\\frac{\\pi}{2}, \\pi\\right)$ and $\\left(\\pi, \\frac{3\\pi}{2}\\right)$.\n\nOn $\\left(\\frac{5\\pi}{2}, \\frac{11\\pi}{4}\\right)$: subtract $2\\pi$ to get $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$, inside $\\left(\\frac{\\pi}{2}, \\pi\\right)$, so cosecant is increasing there.\n\n> **Watch out.** Cosecant moves opposite to sine. On $\\left(\\frac{\\pi}{2}, \\pi\\right)$ sine decreases, so cosecant increases.",
      "正弦递减处余割递增，反之亦然。在一个周期内，$y = \\csc x$ 在 $\\left(-\\frac{\\pi}{2}, 0\\right)$ 和 $\\left(0, \\frac{\\pi}{2}\\right)$ 上**递减**，在 $\\left(\\frac{\\pi}{2}, \\pi\\right)$ 和 $\\left(\\pi, \\frac{3\\pi}{2}\\right)$ 上**递增**。\n\n在 $\\left(\\frac{5\\pi}{2}, \\frac{11\\pi}{4}\\right)$ 上：减去 $2\\pi$ 得 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$，在 $\\left(\\frac{\\pi}{2}, \\pi\\right)$ 内，所以余割在那里递增。\n\n> **注意。** 余割与正弦变化方向相反。在 $\\left(\\frac{\\pi}{2}, \\pi\\right)$ 上正弦递减，所以余割递增。",
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
  encompasses: [{ topic: "graphing-tangent-and-cotangent", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.B.4"],
  intro: t(
    `You have described tangent. Cotangent is its reciprocal, $\\cot x = \\frac{\\cos x}{\\sin x}$, so the zeros and asymptotes of the two trade places, and where tangent rises cotangent falls. These properties let you work with cotangent directly.

Look at the branch on $(0, \\pi)$. At $x = \\frac{\\pi}{4}$, $\\cot \\frac{\\pi}{4} = 1$. At $x = \\frac{\\pi}{2}$, $\\cos \\frac{\\pi}{2} = 0$, so $\\cot \\frac{\\pi}{2} = 0$, a **zero**, exactly where tangent has an asymptote. At $x = \\frac{3\\pi}{4}$, $\\cot \\frac{3\\pi}{4} = -1$. The values fall from $1$ through $0$ to $-1$, so cotangent is **decreasing** on this branch. At the ends $x = 0$ and $x = \\pi$, $\\sin x = 0$ and cotangent has asymptotes.`,
    `你已经描述了正切。余切是它的倒数，$\\cot x = \\frac{\\cos x}{\\sin x}$，所以两者的零点与渐近线互换位置，正切上升的地方余切下降。掌握这些性质，就能直接处理余切。

看 $(0, \\pi)$ 上的一支。在 $x = \\frac{\\pi}{4}$ 处 $\\cot \\frac{\\pi}{4} = 1$。在 $x = \\frac{\\pi}{2}$ 处 $\\cos \\frac{\\pi}{2} = 0$，所以 $\\cot \\frac{\\pi}{2} = 0$，是一个**零点**，恰在正切的渐近线处。在 $x = \\frac{3\\pi}{4}$ 处 $\\cot \\frac{3\\pi}{4} = -1$。函数值从 $1$ 经过 $0$ 降到 $-1$，所以余切在这一支上**递减**。在两端 $x = 0$ 和 $x = \\pi$ 处 $\\sin x = 0$，余切有渐近线。`,
  ),
  knowledgePoints: propertyKnowledgePoints("cot", {
    domainRange: t(
      "Since $\\cot x = \\frac{\\cos x}{\\sin x}$, it is not defined where $\\sin x = 0$:\n\n- the **domain** is all real numbers except $x = k\\pi$ for integers $k$;\n- the **range** is all real numbers, $(-\\infty, \\infty)$, since each branch falls from $\\infty$ to $-\\infty$.\n\nFor example, $\\cot(-2\\pi)$ is not defined, since $\\sin(-2\\pi) = 0$; but $\\cot \\frac{3\\pi}{2} = 0$ is defined.\n\n> **Watch out.** The zeros and the gaps of cotangent are swapped from those of tangent. $\\cot \\frac{3\\pi}{2} = 0$ is defined, while $\\cot \\pi$ is not.",
      "因为 $\\cot x = \\frac{\\cos x}{\\sin x}$，它在 $\\sin x = 0$ 处无定义：\n\n- **定义域**是除 $x = k\\pi$（$k$ 为整数）以外的全体实数；\n- **值域**是全体实数 $(-\\infty, \\infty)$，因为每一支都从 $\\infty$ 降到 $-\\infty$。\n\n例如 $\\cot(-2\\pi)$ 无定义，因为 $\\sin(-2\\pi) = 0$；而 $\\cot \\frac{3\\pi}{2} = 0$ 有定义。\n\n> **注意。** 余切的零点和间断点与正切的正好互换。$\\cot \\frac{3\\pi}{2} = 0$ 有定义，而 $\\cot \\pi$ 无定义。",
    ),
    periodSymmetry: t(
      "Like tangent, cotangent is a ratio of the coordinates, unchanged when the point $(a, b)$ moves to $(-a, -b)$, so its **period** is $\\pi$: $\\cot(x + \\pi) = \\cot x$. Also $\\cot(-x) = \\frac{\\cos x}{-\\sin x} = -\\cot x$: cotangent is **odd**.\n\nIf $\\cot \\theta = -\\frac{8}{5}$, then $\\cot(\\theta - 2\\pi) = -\\frac{8}{5}$ and $\\cot(-\\theta) = \\frac{8}{5}$.\n\n> **Watch out.** Cotangent has period $\\pi$ and is odd, so its value keeps its size. If $\\cot \\theta = -\\frac{8}{5}$, then $-\\frac{5}{8}$ is $\\tan \\theta$, not a value of cotangent at a shifted angle.",
      "与正切一样，余切是坐标之比，点 $(a, b)$ 变为 $(-a, -b)$ 时不变，所以它的**周期**是 $\\pi$：$\\cot(x + \\pi) = \\cot x$。又 $\\cot(-x) = \\frac{\\cos x}{-\\sin x} = -\\cot x$：余切是**奇函数**。\n\n若 $\\cot \\theta = -\\frac{8}{5}$，则 $\\cot(\\theta - 2\\pi) = -\\frac{8}{5}$，$\\cot(-\\theta) = \\frac{8}{5}$。\n\n> **注意。** 余切的周期是 $\\pi$，是奇函数，所以函数值的大小不变。若 $\\cot \\theta = -\\frac{8}{5}$，则 $-\\frac{5}{8}$ 是 $\\tan \\theta$，不是平移后角的余切值。",
    ),
    features: t(
      "For integers $k$, $y = \\cot x$ has **zeros** where $\\cos x = 0$, at $x = \\frac{\\pi}{2} + k\\pi$, and **vertical asymptotes** where $\\sin x = 0$, at $x = k\\pi$: exactly where tangent has its asymptotes and zeros. It has no maximum or minimum.\n\nFor the zero with $-\\pi \\le x < 0$, take $k = -1$: $x = \\frac{\\pi}{2} - \\pi = -\\frac{\\pi}{2}$.\n\n> **Watch out.** In $-\\pi \\le x < 0$ the zero is $-\\frac{\\pi}{2}$, not $-\\pi$. At $x = -\\pi$, $\\sin x = 0$, so there is an asymptote.",
      "对整数 $k$，$y = \\cot x$ 在 $\\cos x = 0$ 处有**零点** $x = \\frac{\\pi}{2} + k\\pi$，在 $\\sin x = 0$ 处有**竖直渐近线** $x = k\\pi$：恰好是正切的渐近线和零点所在。它没有最大值和最小值。\n\n求 $-\\pi \\le x < 0$ 内的零点，取 $k = -1$：$x = \\frac{\\pi}{2} - \\pi = -\\frac{\\pi}{2}$。\n\n> **注意。** 在 $-\\pi \\le x < 0$ 中零点是 $-\\frac{\\pi}{2}$，不是 $-\\pi$。在 $x = -\\pi$ 处 $\\sin x = 0$，那里是渐近线。",
    ),
    monotony: t(
      "On each branch, $(k\\pi, \\pi + k\\pi)$, the graph of $y = \\cot x$ falls from $\\infty$ to $-\\infty$: cotangent is **decreasing** on every interval between consecutive asymptotes, and never increasing. (It is not decreasing across an asymptote: $\\cot\\left(-\\frac{\\pi}{4}\\right) = -1 < \\cot \\frac{\\pi}{4} = 1$.)\n\nOn $\\left(-\\frac{\\pi}{2}, -\\frac{\\pi}{4}\\right)$: add $\\pi$ to get $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$, inside $(0, \\pi)$, so cotangent is decreasing there.\n\n> **Watch out.** Cotangent decreases on each branch, but across an asymptote it is neither increasing nor decreasing. Check that the interval contains no multiple of $\\pi$.",
      "在每一支 $(k\\pi, \\pi + k\\pi)$ 上，$y = \\cot x$ 的图象从 $\\infty$ 降到 $-\\infty$：余切在相邻两条渐近线之间的每个区间上都**递减**，从不递增。（跨过渐近线时不是递减的：$\\cot\\left(-\\frac{\\pi}{4}\\right) = -1 < \\cot \\frac{\\pi}{4} = 1$。）\n\n在 $\\left(-\\frac{\\pi}{2}, -\\frac{\\pi}{4}\\right)$ 上：加 $\\pi$ 得 $\\left(\\frac{\\pi}{2}, \\frac{3\\pi}{4}\\right)$，在 $(0, \\pi)$ 内，所以余切在那里递减。\n\n> **注意。** 余切在每一支上递减，但跨过渐近线时既不递增也不递减。先检查区间里不含 $\\pi$ 的倍数。",
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
