import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, gcd, plane, Q } from "@ga/subject-math";
import { precalculusDrawings } from "../explanation-drawings-precalculus.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { remainingDrawings5 } from "../explanation-drawings-remaining-5.ts";
import { choiceProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus unit 4: Trigonometry (modules 4.9 to 4.12: inverse functions,
// identities, sum/difference formulas, and double-angle formulas).

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** piTex writes c·π in LaTeX. */
function _piTex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** scalePi writes mult times an angle such as -\\frac{2\\pi}{3} in lowest terms. */
function scalePi(tex: string, mult: number): string {
  if (tex === "0") return "0";
  const m = /^(-?)(?:\\frac\{(\d*)\\pi\}\{(\d+)\}|(\d*)\\pi)$/.exec(tex);
  if (!m) throw new Error(`scalePi: ${tex}`);
  const num = Number(m[2] || m[4] || 1) * (m[1] === "-" ? -1 : 1);
  return _piTex(Q.of(num * mult, Number(m[3] ?? 1)));
}

/** specialSin holds the exact sines of the angles reached by the collapsing problems. */
const specialSin: Readonly<Record<number, string>> = {
  30: "\\frac{1}{2}",
  45: "\\frac{\\sqrt{2}}{2}",
  60: "\\frac{\\sqrt{3}}{2}",
  90: "1",
  120: "\\frac{\\sqrt{3}}{2}",
  135: "\\frac{\\sqrt{2}}{2}",
  150: "\\frac{1}{2}",
};

/** specialCos holds the exact cosines of the angles reached by the collapsing problems. */
const specialCos: Readonly<Record<number, string>> = {
  30: "\\frac{\\sqrt{3}}{2}",
  45: "\\frac{\\sqrt{2}}{2}",
  60: "\\frac{1}{2}",
  90: "0",
  120: "-\\frac{1}{2}",
  135: "-\\frac{\\sqrt{2}}{2}",
  150: "-\\frac{\\sqrt{3}}{2}",
};

/** specialTan holds the exact tangents of the angles reached by the collapsing problems. */
const specialTan: Readonly<Record<number, string>> = {
  30: "\\frac{\\sqrt{3}}{3}",
  45: "1",
  60: "\\sqrt{3}",
  120: "-\\sqrt{3}",
  135: "-1",
  150: "-\\frac{\\sqrt{3}}{3}",
};

/** splitAngle writes a special angle as a + b or a - b, with a and b multiples of 5 degrees. */
function splitAngle(rng: Rng, targets: readonly number[]): { a: number; b: number; isSum: boolean; target: number } {
  const target = rng.pick(targets);
  const isSum = rng.bool();
  let b = 5 * (isSum ? rng.int(1, target / 5 - 1) : rng.int(1, 8));
  if (b === 90 || (isSum ? target - b : target + b) === 90) b += 5;
  return { a: isSum ? target - b : target + b, b, isSum, target };
}

/** negated writes the opposite of a LaTeX number. */
const negated = (tex: string) => (tex === "0" ? "1" : tex.startsWith("-") ? tex.slice(1) : `-${tex}`);

/** scaleSurd multiplies an exact value such as $\\frac{\\sqrt{6} + \\sqrt{2}}{4}$ by mult and simplifies. */
function scaleSurd(tex: string, mult: number): string {
  if (mult === 1) return tex;
  const whole = /^-?\d+$/.test(tex);
  if (whole) return `${Number(tex) * mult}`;
  const m = /^(-?)\\frac\{(.+)\}\{(\d+)\}$/.exec(tex);
  if (!m) return `${mult}${tex}`;
  const sign = m[1] ?? "";
  const top = m[2] ?? "";
  const den = Number(m[3]);
  const divisor = gcd(mult, den);
  const coefficient = mult / divisor;
  const rest = den / divisor;
  if (rest > 1) {
    const scaledTop = coefficient === 1 ? top : `${coefficient}${top}`;
    return `${sign}\\frac{${scaledTop}}{${rest}}`;
  }
  if (top === "1") return `${sign}${coefficient}`;
  if (top.includes(" ")) {
    if (sign === "") return top;
    return top.includes(" + ") ? `-${top.replace(" + ", " - ")}` : top.split(" - ").reverse().join(" - ");
  }
  return `${sign}${coefficient === 1 ? "" : coefficient}${top}`;
}

/** scaleTangent multiplies a value such as $-2 + \\sqrt{3}$ by mult and removes the brackets. */
function scaleTangent(tex: string, mult: number): string {
  const m = /^(-?)2 ([+-]) \\sqrt\{3\}$/.exec(tex);
  const root = `${mult === 1 ? "" : mult}\\sqrt{3}`;
  return m ? `${m[1]}${2 * mult} ${m[2]} ${root}` : root;
}

/** mathOption turns LaTeX into a math option in both languages. */
const mathOption = (tex: string): Text => t(`$${tex}$`, `$${tex}$`);

/** oneOf builds a multiple-choice problem with options shuffled, telling a learner what is wrong with each reasoned option. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps (one step goes unlabelled) followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], say, lines = []], i) => {
        const head = parts.length > 1 ? `${stepLabel(i + 1, en, zh)[locale]} ` : "";
        return `${head}${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** why pairs a wrong option, written in LaTeX, with what is wrong with it in English and Chinese. */
const why = (tex: string, en: string, zh: string): Reason => [`$${tex}$`, en, zh];

/** dec4 writes a number to four decimal places, never as -0.0000. */
const dec4 = (x: number): string => {
  const s = x.toFixed(4);
  return s === "-0.0000" ? "0.0000" : s;
};

/** rad turns degrees into radians. */
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Value is a function of an angle in radians, for checking a simplification numerically. */
type Value = (x: number) => number;

/**
 * agreeAt checks a simplification at the sample angle 20°: it names the angle (and the multiple of it inside the functions, when
 * there is one) and shows both expressions taking the same value. The functions take the angle inside, in radians.
 */
function agreeAt(v: string, mult: number, from: string, to: string, f: Value, g: Value): Text {
  const x = rad(20 * mult);
  const inner = mult === 1 ? "" : `${mult}${v} = ${20 * mult}^{\\circ}`;
  return t(
    `Put $${v} = 20^{\\circ}$${inner ? `, so $${inner}$` : ""}. Then $${from} \\approx ${dec4(f(x))}$ and $${to} \\approx ${dec4(g(x))}$, which agree.`,
    `取 $${v} = 20^{\\circ}$${inner ? `，则 $${inner}$` : ""}。这时 $${from} \\approx ${dec4(f(x))}$，$${to} \\approx ${dec4(g(x))}$，两者相等。`,
  );
}

/** agreeAtSixth checks a simplification at $v = \\frac{\\pi}{6}$, for expressions written with $\\frac{\\pi}{2}$. */
function agreeAtSixth(v: string, from: string, to: string, f: Value, g: Value): Text {
  const x = Math.PI / 6;
  return t(
    `Put $${v} = \\frac{\\pi}{6}$. Then $${from} \\approx ${dec4(f(x))}$ and $${to} \\approx ${dec4(g(x))}$, which agree.`,
    `取 $${v} = \\frac{\\pi}{6}$。这时 $${from} \\approx ${dec4(f(x))}$，$${to} \\approx ${dec4(g(x))}$，两者相等。`,
  );
}

/** inputBound writes the solution of finding where arcsine or arccosine of an expression is defined: bound the input, then solve. */
function inputBound(fn: "arcsin" | "arccos", input: string, solve: Text, solved: string, check: Text): Text {
  const name = fn === "arcsin" ? t("Arcsine", "反正弦") : t("Arccosine", "反余弦");
  return walked(
    [
      [
        ["Bound the input", "限制输入"],
        t(`${name.en} accepts only inputs from $-1$ to $1$, so`, `${name["zh-CN"]}只接受 $-1$ 到 $1$ 的输入，所以`),
        [`-1 \\le ${input} \\le 1`],
      ],
      [["Solve for $x$", "解出 $x$"], solve, [solved]],
    ],
    check,
  );
}

/** undone reads an inverse function of a function of an angle, such as \\arcsin\\left(\\sin\\left(\\frac{5\\pi}{6}\\right)\\right). */
function undone(expr: string): { fn: keyof typeof inverses; inner: string } {
  const m = /^\\(arc[a-z]+)\\left\(\\[a-z]+\\left\((.+)\\right\)\\right\)$/.exec(expr);
  if (!m || !(m[1]! in inverses)) throw new Error(`undone: ${expr}`);
  return { fn: m[1] as keyof typeof inverses, inner: m[2]! };
}

/** outsideRange writes the solution of an inverse function of a function of an angle: the inside first, then the principal angle. */
function outsideRange(expr: string, ans: string, mult: number): Text {
  const { fn, inner } = undone(expr);
  const inv = inverses[fn];
  const val = exactOf(inv.at(piValue(inner)));
  return principal(fn, val, ans, mult, [
    [
      ["Evaluate the inside", "先算里面"],
      t(
        `$\\${inv.ratio}\\left(${inner}\\right) = ${val}$, so the expression is $${mult === 1 ? "" : mult}\\${fn}\\left(${val}\\right)$. The angle $${inner}$ is outside $${inv.range}$, so it is not the answer.`,
        `$\\${inv.ratio}\\left(${inner}\\right) = ${val}$，所以原式是 $${mult === 1 ? "" : mult}\\${fn}\\left(${val}\\right)$。角 $${inner}$ 不在 $${inv.range}$ 内，所以它不是答案。`,
      ),
    ],
  ]);
}

/** outsideReasons says what is wrong with each wrong angle of an inverse function of a function of an angle. */
function outsideReasons(expr: string, ans: string, bases: readonly string[], mult: number): Reason[] {
  const { fn, inner } = undone(expr);
  return principalReasons(fn, exactOf(inverses[fn].at(piValue(inner))), ans, bases, mult);
}

/**
 * Rewrite is a simplification problem: the expression, its simplest form and the wrong forms with what is wrong with each
 * (in English and Chinese), the identity used, a middle form ("" for none), and the values of the expression and of the simplest
 * form as functions of the angle inside.
 */
type Rewrite = {
  readonly expr: string;
  readonly ans: string;
  readonly wrong: readonly string[];
  readonly use: string;
  readonly mid: string;
  readonly f: Value;
  readonly g: Value;
  readonly why: readonly (readonly string[])[];
};

/** rewritten writes the solution of a simplification: the identity, the substitution, and a check at the sample angle. */
function rewritten(r: Rewrite, v: string, mult: number, say: Text): Text {
  return walked(
    [
      [["Recall the identity", "写出恒等式"], say, [r.use]],
      [
        ["Substitute and simplify", "代入并化简"],
        t("Replace and simplify:", "代入并化简："),
        [r.mid ? `${r.expr} = ${r.mid} = ${r.ans}` : `${r.expr} = ${r.ans}`],
      ],
    ],
    agreeAt(v, mult, r.expr, r.ans, r.f, r.g),
  );
}

/** rewriteReasons pairs each wrong form of a simplification with what is wrong with it. */
const rewriteReasons = (r: Rewrite): Reason[] => r.wrong.map((w, i) => why(w, r.why[i]?.[0] ?? "", r.why[i]?.[1] ?? ""));

/** piValue reads an angle such as -\\frac{5\\pi}{6}, 2\\pi or 0 as a number of radians. */
function piValue(tex: string): number {
  if (tex === "0") return 0;
  const m = /^(-?)(?:\\frac\{(\d*)\\pi\}\{(\d+)\}|(\d*)\\pi)$/.exec(tex);
  if (!m) throw new Error(`piValue: ${tex}`);
  return ((m[1] === "-" ? -1 : 1) * Number(m[2] || m[4] || 1) * Math.PI) / Number(m[3] ?? 1);
}

/** exactValues lists the exact values of sine, cosine and tangent at the special angles, with their sizes. */
const exactValues: readonly (readonly [tex: string, size: number])[] = [
  ["0", 0],
  ["\\frac{1}{2}", 0.5],
  ["\\frac{\\sqrt{2}}{2}", Math.SQRT2 / 2],
  ["\\frac{\\sqrt{3}}{2}", Math.sqrt(3) / 2],
  ["1", 1],
  ["\\frac{\\sqrt{3}}{3}", Math.sqrt(3) / 3],
  ["\\sqrt{3}", Math.sqrt(3)],
];

/** exactOf writes a value of sine, cosine or tangent at a special angle exactly, as in -\\frac{\\sqrt{3}}{2}. */
function exactOf(x: number): string {
  const found = exactValues.find(([, size]) => Math.abs(Math.abs(x) - size) < 1e-9);
  if (!found) throw new Error(`exactOf: ${x}`);
  return x < -1e-9 ? `-${found[0]}` : found[0];
}

/** Inverse describes an inverse function: its ratio, the ratio's value at an angle, and its principal range. */
type Inverse = {
  readonly ratio: "sin" | "cos" | "tan";
  readonly at: Value;
  readonly range: string;
  readonly inRange: (x: number) => boolean;
};

/** inverses describes arcsine, arccosine and arctangent. */
const inverses: Readonly<Record<"arcsin" | "arccos" | "arctan", Inverse>> = {
  arcsin: {
    ratio: "sin",
    at: Math.sin,
    range: "\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]",
    inRange: (x) => x >= -halfPi - 1e-9 && x <= halfPi + 1e-9,
  },
  arccos: { ratio: "cos", at: Math.cos, range: "[0, \\pi]", inRange: (x) => x >= -1e-9 && x <= Math.PI + 1e-9 },
  arctan: {
    ratio: "tan",
    at: Math.tan,
    range: "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)",
    inRange: (x) => x > -halfPi + 1e-9 && x < halfPi - 1e-9,
  },
};

/**
 * principal writes the solution of finding mult times an inverse function at a special value: the range, the angle in it with
 * that ratio, the multiple, and a check that the angle has the ratio and lies in the range.
 */
function principal(fn: keyof typeof inverses, val: string, ans: string, mult: number, lead: Step[] = []): Text {
  const inv = inverses[fn];
  const scaled = scalePi(ans, mult);
  return walked(
    [
      ...lead,
      [
        ["Name the range", "确定值域"],
        t(
          `$\\${fn}$ returns the one angle in $${inv.range}$ whose ${inv.ratio === "sin" ? "sine" : inv.ratio === "cos" ? "cosine" : "tangent"} is $${val}$.`,
          `$\\${fn}$ 返回 $${inv.range}$ 中${inv.ratio === "sin" ? "正弦" : inv.ratio === "cos" ? "余弦" : "正切"}为 $${val}$ 的那个角。`,
        ),
      ],
      [["Find the angle", "求出这个角"], t("That angle is", "这个角是"), [`\\${fn}\\left(${val}\\right) = ${ans}`]],
      ...(mult === 1
        ? []
        : [[["Multiply", "乘以系数"], t(`Multiply by $${mult}$:`, `乘以 $${mult}$：`), [`${mult} \\cdot ${ans} = ${scaled}`]] as Step]),
    ],
    t(
      `$${ans}$ lies in $${inv.range}$, and $\\${inv.ratio}\\left(${ans}\\right) = ${val}$.`,
      `$${ans}$ 在 $${inv.range}$ 内，并且 $\\${inv.ratio}\\left(${ans}\\right) = ${val}$。`,
    ),
  );
}

/**
 * principalReasons says what is wrong with each wrong angle, given as mult times an angle: either its ratio is not the value, or
 * it has the value but lies outside the principal range.
 */
function principalReasons(fn: keyof typeof inverses, val: string, ans: string, bases: readonly string[], mult: number): Reason[] {
  const inv = inverses[fn];
  const target = inv.at(piValue(ans));
  return bases.map((base) => {
    const x = piValue(base);
    const shown = scalePi(base, mult);
    const from = mult === 1 ? "" : ` This is $${mult}$ times $${base}$.`;
    const fromZh = mult === 1 ? "" : `这是 $${base}$ 的 $${mult}$ 倍。`;
    const name = inv.ratio === "sin" ? "sine" : inv.ratio === "cos" ? "cosine" : "tangent";
    const nameZh = inv.ratio === "sin" ? "正弦" : inv.ratio === "cos" ? "余弦" : "正切";
    const same = Math.abs(inv.at(x) - target) < 1e-9;
    return why(
      shown,
      same
        ? `${from} $${base}$ has ${name} $${val}$ too, but it lies outside $${inv.range}$, where $\\${fn}$ takes its values.`.trim()
        : `${from} The ${name} of $${base}$ is $${exactOf(inv.at(x))}$, not $${val}$.`.trim(),
      same
        ? `${fromZh}$${base}$ 的${nameZh}也是 $${val}$，但它不在 $\\${fn}$ 的取值范围 $${inv.range}$ 内。`
        : `${fromZh}$${base}$ 的${nameZh}是 $${exactOf(inv.at(x))}$，不是 $${val}$。`,
    );
  });
}

/** Pythagorean triples [a, b, c] with a² + b² = c². */
const _triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [7, 24, 25],
  [24, 7, 25],
  [8, 15, 17],
  [15, 8, 17],
];

const halfPi = Math.PI / 2;

/** evenHalfPi writes k times pi over two, for an even k. */
const evenHalfPi = (k: number): string => (k === 2 ? "\\pi" : `${k / 2}\\pi`);

/** arcsinFigure graphs y = arcsin x from (−1, −π/2) to (1, π/2). */
const arcsinFigure: Figure = {
  svg: plane({ xMin: -2, xMax: 2, yMin: -2, yMax: 2, step: 0.5, labelEvery: 2 }, [
    { kind: "curve", f: Math.asin, from: -1, to: 1, accent: true },
    { kind: "point", at: [-1, -halfPi], label: "(−1, −π/2)", dir: "se" },
    { kind: "point", at: [0, 0] },
    { kind: "point", at: [1, halfPi], label: "(1, π/2)", dir: "nw" },
  ]),
  alt: t(
    "The graph of y = arcsin x, an increasing curve from (−1, −π/2) through the origin to (1, π/2); it exists only for x from −1 to 1.",
    "y = arcsin x 的图象：一条从 (−1, −π/2) 经过原点上升到 (1, π/2) 的曲线，只在 x 从 −1 到 1 时存在。",
  ),
};

/** arccosFigure graphs y = arccos x from (−1, π) to (1, 0). */
const arccosFigure: Figure = {
  svg: plane({ xMin: -2, xMax: 2, yMin: -0.5, yMax: 3.5, step: 0.5, labelEvery: 2 }, [
    { kind: "curve", f: Math.acos, from: -1, to: 1, accent: true },
    { kind: "point", at: [-1, Math.PI], label: "(−1, π)", dir: "w" },
    { kind: "point", at: [0, halfPi], label: "(0, π/2)", dir: "ne" },
    { kind: "point", at: [1, 0], label: "(1, 0)", dir: "ne" },
  ]),
  alt: t(
    "The graph of y = arccos x, a decreasing curve from (−1, π) through (0, π/2) to (1, 0); it exists only for x from −1 to 1.",
    "y = arccos x 的图象：一条从 (−1, π) 经过 (0, π/2) 下降到 (1, 0) 的曲线，只在 x 从 −1 到 1 时存在。",
  ),
};

/** arctanFigure graphs y = arctan x between its horizontal asymptotes y = ±π/2. */
const arctanFigure: Figure = {
  svg: plane({ xMin: -6, xMax: 6, yMin: -2.5, yMax: 2.5, step: 0.5, labelEvery: 4 }, [
    { kind: "curve", f: Math.atan, accent: true },
    { kind: "line", a: [0, halfPi], b: [1, halfPi], dashed: true },
    { kind: "line", a: [0, -halfPi], b: [1, -halfPi], dashed: true },
    { kind: "label", at: [-6, halfPi], text: "y = π/2", dir: "ne" },
    { kind: "label", at: [6, -halfPi], text: "y = −π/2", dir: "sw" },
  ]),
  alt: t(
    "The graph of y = arctan x, an increasing curve through the origin that levels off toward the dashed horizontal asymptotes y = −π/2 on the left and y = π/2 on the right.",
    "y = arctan x 的图象：一条经过原点的上升曲线，向左趋近虚线所示的水平渐近线 y = −π/2，向右趋近 y = π/2。",
  ),
};

// ─── 4.9.1 Graphing the inverse sine function ───────────────────────────────

/** graphingTheInverseSineFunction covers domain, range, and properties of arcsin. */
export const graphingTheInverseSineFunction: TopicDef = {
  id: "graphing-the-inverse-sine-function",
  title: t("Graphing the Inverse Sine Function", "反弦函数的图象与性质"),
  summary: t(
    "Describe the domain, range, key points, and symmetry of the inverse sine function y = arcsin(x).",
    "描述反正弦函数 y = arcsin(x) 的定义域、值域、关键点与对称性。",
  ),
  prerequisites: ["graphing-sine-and-cosine", "calculating-the-inverse-of-a-function"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.TF.B.6"],
  intro: t(
    `Sine is not one-to-one: $\\sin\\frac{\\pi}{6}$ and $\\sin\\frac{5\\pi}{6}$ are both $\\frac{1}{2}$. To undo it, keep only the stretch from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$, where sine rises from $-1$ to $1$ and takes each value once. The inverse of that piece is $y = \\arcsin x$: it takes a number from $-1$ to $1$ and returns the angle in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ with that sine. So $\\arcsin\\frac{1}{2} = \\frac{\\pi}{6}$, and the point $\\left(\\frac{1}{2}, \\frac{\\pi}{6}\\right)$ is on its graph.

Check: $\\frac{\\pi}{6}$ lies between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$, and $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$. The other angle, $\\frac{5\\pi}{6}$, is outside the kept stretch, so it is not the value of arcsine.

In this lesson we find the domain and range of arcsine and of functions built from it, and use its key points and its symmetry to find exact values.`,
    `正弦不是一一对应的：$\\sin\\frac{\\pi}{6}$ 和 $\\sin\\frac{5\\pi}{6}$ 都等于 $\\frac{1}{2}$。要还原它，只保留从 $-\\frac{\\pi}{2}$ 到 $\\frac{\\pi}{2}$ 的一段，在这一段上正弦从 $-1$ 增加到 $1$，每个值只取一次。这一段的反函数就是 $y = \\arcsin x$：它接受 $-1$ 到 $1$ 之间的数，返回 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 中正弦为这个数的角。所以 $\\arcsin\\frac{1}{2} = \\frac{\\pi}{6}$，点 $\\left(\\frac{1}{2}, \\frac{\\pi}{6}\\right)$ 在它的图象上。

检验：$\\frac{\\pi}{6}$ 在 $-\\frac{\\pi}{2}$ 与 $\\frac{\\pi}{2}$ 之间，且 $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$。另一个角 $\\frac{5\\pi}{6}$ 不在保留的一段内，所以它不是反正弦的值。

这节课我们求反正弦以及由它构成的函数的定义域和值域，并利用它的关键点和对称性求精确值。`,
  ),
  knowledgePoints: [
    {
      id: "domain-and-range-of-arcsin",
      title: t("Domain and range of arcsin", "反正弦函数的定义域与值域"),
      explanation: t(
        `Sine takes every value between $-1$ and $1$ again and again, so on the whole real line it has no inverse. Keeping only $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, where sine rises from $-1$ to $1$ and takes each value once, gives $y = \\arcsin x$ with:

- **Domain**: $[-1, 1]$, the values sine takes
- **Range**: $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, the angles that were kept

When arcsine is applied to an expression, that expression must stay between $-1$ and $1$. For $f(x) = \\arcsin(x - 2)$:

$$-1 \\le x - 2 \\le 1 \\quad\\Longrightarrow\\quad 1 \\le x \\le 3$$

so the domain is $[1, 3]$. Check: at $x = 3$ the input is $1$, and $\\arcsin 1 = \\frac{\\pi}{2}$; at $x = 4$ the input is $2$, which no sine reaches.

A factor in front stretches the outputs instead: $3\\arcsin x$ has range $\\left[-\\frac{3\\pi}{2}, \\frac{3\\pi}{2}\\right]$.

> **Watch out.** The endpoints belong to the domain, since $\\arcsin(\\pm 1) = \\pm\\frac{\\pi}{2}$, so the brackets are square. Keep the two intervals apart as well: $[-1, 1]$ holds the inputs, and the angles $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ are the outputs.`,
        `正弦一次又一次地取遍 $-1$ 到 $1$ 之间的每个值，所以在整个实数轴上它没有反函数。只保留 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$，在这一段上正弦从 $-1$ 增加到 $1$，每个值只取一次，就得到 $y = \\arcsin x$：

- **定义域**：$[-1, 1]$，即正弦取到的值
- **值域**：$\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$，即保留下来的角

把反正弦作用在一个式子上时，这个式子必须在 $-1$ 和 $1$ 之间。对 $f(x) = \\arcsin(x - 2)$：

$$-1 \\le x - 2 \\le 1 \\quad\\Longrightarrow\\quad 1 \\le x \\le 3$$

所以定义域是 $[1, 3]$。检验：$x = 3$ 时输入是 $1$，$\\arcsin 1 = \\frac{\\pi}{2}$；$x = 4$ 时输入是 $2$，没有正弦能取到。

前面的系数则是拉伸输出：$3\\arcsin x$ 的值域是 $\\left[-\\frac{3\\pi}{2}, \\frac{3\\pi}{2}\\right]$。

> **注意。** 端点属于定义域，因为 $\\arcsin(\\pm 1) = \\pm\\frac{\\pi}{2}$，所以用方括号。还要把两个区间分清：$[-1, 1]$ 是输入，角 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 是输出。`,
      ),
      figure: arcsinFigure,
      generate(rng) {
        const type = rng.pick(["scaled", "shifted", "linear", "range"] as const);
        if (type === "scaled") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
          return oneOf(
            rng,
            t(
              `What is the domain of $f(x) = \\arcsin\\left(\\frac{x}{${a}}\\right)$?`,
              `$f(x) = \\arcsin\\left(\\frac{x}{${a}}\\right)$ 的定义域是什么？`,
            ),
            t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$(-${a}, ${a})$`, `$(-${a}, ${a})$`), t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$")],
            walked(
              [
                [
                  ["Bound the input", "限制输入"],
                  t("Arcsine accepts only inputs from $-1$ to $1$, so", "反正弦只接受 $-1$ 到 $1$ 的输入，所以"),
                  [`-1 \\le \\frac{x}{${a}} \\le 1`],
                ],
                [["Solve for $x$", "解出 $x$"], t(`Multiply each part by $${a}$:`, `每一部分乘以 $${a}$：`), [`-${a} \\le x \\le ${a}`]],
              ],
              t(
                `At $x = ${a}$ the input is $\\frac{${a}}{${a}} = 1$, and $\\arcsin 1 = \\frac{\\pi}{2}$ is defined. At $x = ${a + 1}$ it is $\\frac{${a + 1}}{${a}} > 1$, which no sine reaches. So the domain is $[-${a}, ${a}]$.`,
                `$x = ${a}$ 时输入是 $\\frac{${a}}{${a}} = 1$，$\\arcsin 1 = \\frac{\\pi}{2}$ 有定义。$x = ${a + 1}$ 时输入是 $\\frac{${a + 1}}{${a}} > 1$，没有正弦能取到。所以定义域是 $[-${a}, ${a}]$。`,
              ),
            ),
            [
              why(
                "[-1, 1]",
                `That is the domain of $\\arcsin x$ itself. Here the input is $\\frac{x}{${a}}$, which reaches $\\pm 1$ only at $x = \\pm ${a}$.`,
                `这是 $\\arcsin x$ 本身的定义域。这里输入是 $\\frac{x}{${a}}$，在 $x = \\pm ${a}$ 时才达到 $\\pm 1$。`,
              ),
              why(
                `(-${a}, ${a})`,
                `The endpoints belong: at $x = \\pm ${a}$ the input is $\\pm 1$, and arcsine is defined there.`,
                `端点应包含在内：$x = \\pm ${a}$ 时输入是 $\\pm 1$，反正弦在那里有定义。`,
              ),
              why(
                "(-\\infty, \\infty)",
                `Not every $x$ works: for $|x| > ${a}$ the input lies outside $[-1, 1]$.`,
                `不是所有 $x$ 都可以：$|x| > ${a}$ 时输入不在 $[-1, 1]$ 内。`,
              ),
            ],
          );
        }
        if (type === "shifted") {
          const h = rng.pick([-10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 10]);
          const sign = h > 0 ? `-${h}` : `+${-h}`;
          const left = h - 1;
          const right = h + 1;
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arcsin(x ${sign})$?`, `$f(x) = \\arcsin(x ${sign})$ 的定义域是什么？`),
            t(`$[${left}, ${right}]$`, `$[${left}, ${right}]$`),
            [
              t("$[-1, 1]$", "$[-1, 1]$"),
              t(`$[${left - 1}, ${right + 1}]$`, `$[${left - 1}, ${right + 1}]$`),
              t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
            ],
            walked(
              [
                [
                  ["Bound the input", "限制输入"],
                  t("Arcsine accepts only inputs from $-1$ to $1$, so", "反正弦只接受 $-1$ 到 $1$ 的输入，所以"),
                  [`-1 \\le x ${sign} \\le 1`],
                ],
                [
                  ["Solve for $x$", "解出 $x$"],
                  h > 0
                    ? t(`Add $${h}$ to each part:`, `每一部分加上 $${h}$：`)
                    : t(`Subtract $${-h}$ from each part:`, `每一部分减去 $${-h}$：`),
                  [`${left} \\le x \\le ${right}`],
                ],
              ],
              t(
                `At $x = ${right}$ the input is $${right} ${sign} = 1$, and at $x = ${left}$ it is $${left} ${sign} = -1$, the two ends of what arcsine accepts.`,
                `$x = ${right}$ 时输入是 $${right} ${sign} = 1$，$x = ${left}$ 时输入是 $${left} ${sign} = -1$，正好是反正弦所接受范围的两端。`,
              ),
            ),
            [
              why(
                "[-1, 1]",
                `That is the domain of $\\arcsin x$ before the shift. The input $x ${sign}$ is $\\pm 1$ at $x = ${left}$ and $x = ${right}$.`,
                `这是平移前 $\\arcsin x$ 的定义域。输入 $x ${sign}$ 在 $x = ${left}$ 和 $x = ${right}$ 时为 $\\pm 1$。`,
              ),
              why(
                `[${left - 1}, ${right + 1}]`,
                `This is one unit too wide on each side: at $x = ${right + 1}$ the input is $2$, which no sine reaches.`,
                `两边各宽了一个单位：$x = ${right + 1}$ 时输入是 $2$，没有正弦能取到。`,
              ),
              why(
                "(-\\infty, \\infty)",
                "Not every $x$ works: the input must stay between $-1$ and $1$.",
                "不是所有 $x$ 都可以：输入必须在 $-1$ 和 $1$ 之间。",
              ),
            ],
          );
        }
        if (type === "linear") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8]);
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arcsin(${a}x)$?`, `$f(x) = \\arcsin(${a}x)$ 的定义域是什么？`),
            t(`$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`, `$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`), t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$")],
            inputBound(
              "arcsin",
              `${a}x`,
              t(`Divide each part by $${a}$:`, `每一部分除以 $${a}$：`),
              `-\\frac{1}{${a}} \\le x \\le \\frac{1}{${a}}`,
              t(
                `At $x = \\frac{1}{${a}}$ the input is $${a} \\cdot \\frac{1}{${a}} = 1$, and at $x = -\\frac{1}{${a}}$ it is $-1$, the two ends that arcsine accepts. Already at $x = 1$ the input is $${a}$, too large.`,
                `$x = \\frac{1}{${a}}$ 时输入是 $${a} \\cdot \\frac{1}{${a}} = 1$，$x = -\\frac{1}{${a}}$ 时输入是 $-1$，正好是反正弦所接受范围的两端。$x = 1$ 时输入已经是 $${a}$，太大了。`,
              ),
            ),
            [
              why(
                "[-1, 1]",
                `That is the domain of $\\arcsin x$. Here the input $${a}x$ reaches $\\pm 1$ sooner, at $x = \\pm\\frac{1}{${a}}$.`,
                `这是 $\\arcsin x$ 的定义域。这里输入 $${a}x$ 更早达到 $\\pm 1$，在 $x = \\pm\\frac{1}{${a}}$ 处。`,
              ),
              why(
                `[-${a}, ${a}]`,
                `This multiplies by $${a}$ instead of dividing: at $x = ${a}$ the input is $${a * a}$, far above $1$.`,
                `这里乘了 $${a}$ 而不是除以 $${a}$：$x = ${a}$ 时输入是 $${a * a}$，远大于 $1$。`,
              ),
              why(
                "(-\\infty, \\infty)",
                "Not every $x$ works: the input must stay between $-1$ and $1$.",
                "不是所有 $x$ 都可以：输入必须在 $-1$ 和 $1$ 之间。",
              ),
            ],
          );
        }
        const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        return oneOf(
          rng,
          t(`What is the range of $f(x) = ${k}\\arcsin x$?`, `$f(x) = ${k}\\arcsin x$ 的值域是什么？`),
          t(
            k % 2 === 0 ? `$[-${k / 2}\\pi, ${k / 2}\\pi]$` : `$\\left[-\\frac{${k}\\pi}{2}, \\frac{${k}\\pi}{2}\\right]$`,
            k % 2 === 0 ? `$[-${k / 2}\\pi, ${k / 2}\\pi]$` : `$\\left[-\\frac{${k}\\pi}{2}, \\frac{${k}\\pi}{2}\\right]$`,
          ),
          [t("$[-1, 1]$", "$[-1, 1]$"), t("$[0, \\pi]$", "$[0, \\pi]$"), t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$")],
          walked(
            [
              [
                ["Start from the range of arcsine", "从反正弦的值域出发"],
                t("Every value of $\\arcsin x$ lies in", "$\\arcsin x$ 的每个值都满足"),
                [`-\\frac{\\pi}{2} \\le \\arcsin x \\le \\frac{\\pi}{2}`],
              ],
              [
                [`Multiply by $${k}$`, `乘以 $${k}$`],
                t(
                  `Multiply each part by $${k}$, which is positive, so the inequalities keep their direction:`,
                  `每一部分乘以正数 $${k}$，不等号方向不变：`,
                ),
                [`-${scalePi("\\frac{\\pi}{2}", k)} \\le ${k}\\arcsin x \\le ${scalePi("\\frac{\\pi}{2}", k)}`],
              ],
            ],
            t(
              `$f(1) = ${k} \\cdot \\frac{\\pi}{2} = ${scalePi("\\frac{\\pi}{2}", k)}$ and $f(-1) = -${scalePi("\\frac{\\pi}{2}", k)}$, so both ends are reached.`,
              `$f(1) = ${k} \\cdot \\frac{\\pi}{2} = ${scalePi("\\frac{\\pi}{2}", k)}$，$f(-1) = -${scalePi("\\frac{\\pi}{2}", k)}$，两端都能取到。`,
            ),
          ),
          [
            why("[-1, 1]", "That is the domain of arcsine, its inputs, not its outputs.", "这是反正弦的定义域，即输入，而不是输出。"),
            why("[0, \\pi]", "That is the range of arccosine, not of a multiple of arcsine.", "这是反余弦的值域，不是反正弦的倍数的值域。"),
            why(
              "(-\\infty, \\infty)",
              `Arcsine is bounded, so $${k}\\arcsin x$ stays between $\\pm ${scalePi("\\frac{\\pi}{2}", k)}$.`,
              `反正弦是有界的，所以 $${k}\\arcsin x$ 在 $\\pm ${scalePi("\\frac{\\pi}{2}", k)}$ 之间。`,
            ),
          ],
        );
      },
    },
    {
      id: "key-points-and-symmetry-of-arcsin",
      figure: precalculusDrawings["graphing-the-inverse-sine-function#key-points-and-symmetry-of-arcsin"],
      title: t("Key points and odd symmetry of arcsin", "反正弦的关键点与奇函数性质"),
      explanation: t(
        `The graph of $y = \\arcsin x$ gives its exact values. It passes through $\\left(-1, -\\frac{\\pi}{2}\\right)$, $(0, 0)$ and $\\left(1, \\frac{\\pi}{2}\\right)$, and through the points of the special angles, such as $\\left(\\frac{1}{2}, \\frac{\\pi}{6}\\right)$, $\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\pi}{4}\\right)$ and $\\left(\\frac{\\sqrt{3}}{2}, \\frac{\\pi}{3}\\right)$. Sine is odd, so arcsine is odd too: $\\arcsin(-x) = -\\arcsin x$, and the graph is symmetric about the origin.

To find $2\\arcsin\\left(-\\frac{\\sqrt{3}}{2}\\right)$, use the symmetry. Since $\\arcsin\\frac{\\sqrt{3}}{2} = \\frac{\\pi}{3}$, we get $\\arcsin\\left(-\\frac{\\sqrt{3}}{2}\\right) = -\\frac{\\pi}{3}$, and

$$2\\arcsin\\left(-\\frac{\\sqrt{3}}{2}\\right) = 2 \\cdot \\left(-\\frac{\\pi}{3}\\right) = -\\frac{2\\pi}{3}$$

Check: $\\sin\\left(-\\frac{\\pi}{3}\\right) = -\\frac{\\sqrt{3}}{2}$, and $-\\frac{\\pi}{3}$ lies in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$.

> **Watch out.** Arcsine of a negative number is a negative angle, not an angle in the second or third quadrant: $\\arcsin\\left(-\\frac{1}{2}\\right) = -\\frac{\\pi}{6}$, not $\\frac{7\\pi}{6}$ or $\\frac{5\\pi}{6}$. Find the angle first and multiply afterwards.`,
        `$y = \\arcsin x$ 的图象给出它的精确值。它经过 $\\left(-1, -\\frac{\\pi}{2}\\right)$、$(0, 0)$ 和 $\\left(1, \\frac{\\pi}{2}\\right)$，也经过特殊角对应的点，例如 $\\left(\\frac{1}{2}, \\frac{\\pi}{6}\\right)$、$\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\pi}{4}\\right)$ 和 $\\left(\\frac{\\sqrt{3}}{2}, \\frac{\\pi}{3}\\right)$。正弦是奇函数，所以反正弦也是奇函数：$\\arcsin(-x) = -\\arcsin x$，图象关于原点对称。

求 $2\\arcsin\\left(-\\frac{\\sqrt{3}}{2}\\right)$ 时利用对称性。因为 $\\arcsin\\frac{\\sqrt{3}}{2} = \\frac{\\pi}{3}$，所以 $\\arcsin\\left(-\\frac{\\sqrt{3}}{2}\\right) = -\\frac{\\pi}{3}$，于是

$$2\\arcsin\\left(-\\frac{\\sqrt{3}}{2}\\right) = 2 \\cdot \\left(-\\frac{\\pi}{3}\\right) = -\\frac{2\\pi}{3}$$

检验：$\\sin\\left(-\\frac{\\pi}{3}\\right) = -\\frac{\\sqrt{3}}{2}$，且 $-\\frac{\\pi}{3}$ 在 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 内。

> **注意。** 负数的反正弦是负角，而不是第二或第三象限的角：$\\arcsin\\left(-\\frac{1}{2}\\right) = -\\frac{\\pi}{6}$，不是 $\\frac{7\\pi}{6}$ 或 $\\frac{5\\pi}{6}$。先求出角，再乘系数。`,
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0", wrong: ["\\frac{\\pi}{2}", "-\\frac{\\pi}{2}", "\\pi"] },
          { val: "1", ans: "\\frac{\\pi}{2}", wrong: ["\\pi", "0", "\\frac{\\pi}{4}"] },
          { val: "-1", ans: "-\\frac{\\pi}{2}", wrong: ["\\frac{\\pi}{2}", "\\pi", "-\\pi"] },
          { val: "\\frac{1}{2}", ans: "\\frac{\\pi}{6}", wrong: ["\\frac{\\pi}{3}", "\\frac{\\pi}{4}", "\\frac{\\pi}{2}"] },
          { val: "-\\frac{1}{2}", ans: "-\\frac{\\pi}{6}", wrong: ["\\frac{5\\pi}{6}", "-\\frac{\\pi}{3}", "-\\frac{\\pi}{4}"] },
          { val: "\\frac{\\sqrt{2}}{2}", ans: "\\frac{\\pi}{4}", wrong: ["\\frac{\\pi}{6}", "\\frac{\\pi}{3}", "\\frac{3\\pi}{4}"] },
          { val: "-\\frac{\\sqrt{2}}{2}", ans: "-\\frac{\\pi}{4}", wrong: ["\\frac{3\\pi}{4}", "-\\frac{\\pi}{6}", "-\\frac{\\pi}{3}"] },
          { val: "\\frac{\\sqrt{3}}{2}", ans: "\\frac{\\pi}{3}", wrong: ["\\frac{\\pi}{6}", "\\frac{\\pi}{4}", "\\frac{2\\pi}{3}"] },
          { val: "-\\frac{\\sqrt{3}}{2}", ans: "-\\frac{\\pi}{3}", wrong: ["\\frac{2\\pi}{3}", "-\\frac{\\pi}{6}", "-\\frac{\\pi}{4}"] },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `\\arcsin\\left(${item.val}\\right)` : `${mult}\\arcsin\\left(${item.val}\\right)`;
        const ansStr = scalePi(item.ans, mult);
        const wrongStr = item.wrong.map((w) => `$${scalePi(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          principal("arcsin", item.val, item.ans, mult),
          principalReasons("arcsin", item.val, item.ans, item.wrong, mult),
        );
      },
    },
  ],
};

// ─── 4.9.2 Graphing the inverse cosine function ─────────────────────────────

/** graphingTheInverseCosineFunction covers domain, range, and properties of arccos. */
export const graphingTheInverseCosineFunction: TopicDef = {
  id: "graphing-the-inverse-cosine-function",
  title: t("Graphing the Inverse Cosine Function", "反余弦函数的图象与性质"),
  summary: t(
    "Describe the domain, range, key points, and symmetry properties of the inverse cosine function y = arccos(x).",
    "描述反余弦函数 y = arccos(x) 的定义域、值域、关键点与对称性。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.TF.B.6"],
  intro: t(
    `Cosine is kept on $[0, \\pi]$, where it falls from $1$ to $-1$ and takes each value once. Its inverse $y = \\arccos x$ takes a number from $-1$ to $1$ and returns the angle in $[0, \\pi]$ with that cosine. So $\\arccos 0 = \\frac{\\pi}{2}$ and $\\arccos(-1) = \\pi$.

Check: $\\cos\\frac{\\pi}{2} = 0$ and $\\cos\\pi = -1$, and both angles lie in $[0, \\pi]$.

Unlike arcsine, arccosine never gives a negative angle, so it is not odd. Instead, a negative input gives an angle past $\\frac{\\pi}{2}$: $\\arccos(-x) = \\pi - \\arccos x$.

In this lesson we find the domain and range of arccosine and of functions built from it, and use its key points to find exact values.`,
    `余弦保留在 $[0, \\pi]$ 上，在这一段上它从 $1$ 减小到 $-1$，每个值只取一次。它的反函数 $y = \\arccos x$ 接受 $-1$ 到 $1$ 之间的数，返回 $[0, \\pi]$ 中余弦为这个数的角。所以 $\\arccos 0 = \\frac{\\pi}{2}$，$\\arccos(-1) = \\pi$。

检验：$\\cos\\frac{\\pi}{2} = 0$，$\\cos\\pi = -1$，两个角都在 $[0, \\pi]$ 内。

与反正弦不同，反余弦从不给出负角，所以它不是奇函数。负的输入给出大于 $\\frac{\\pi}{2}$ 的角：$\\arccos(-x) = \\pi - \\arccos x$。

这节课我们求反余弦以及由它构成的函数的定义域和值域，并利用它的关键点求精确值。`,
  ),
  knowledgePoints: [
    {
      id: "domain-and-range-of-arccos",
      title: t("Domain and range of arccos", "反余弦函数的定义域与值域"),
      explanation: t(
        `Cosine takes every value many times, so to have an inverse it is kept on an interval where it takes each value exactly once: $[0, \\pi]$, where it falls from $1$ to $-1$. So $y = \\arccos x$ has:

- **Domain**: $[-1, 1]$, the values cosine takes
- **Range**: $[0, \\pi]$, the angles that were kept

When arccosine is applied to an expression, that expression must stay between $-1$ and $1$. For $f(x) = \\arccos\\left(\\frac{x}{3}\\right)$:

$$-1 \\le \\frac{x}{3} \\le 1 \\quad\\Longrightarrow\\quad -3 \\le x \\le 3$$

so the domain is $[-3, 3]$. Check: at $x = -3$ the input is $-1$, and $\\arccos(-1) = \\pi$; at $x = 6$ the input is $2$, which no cosine reaches.

A factor in front stretches the outputs: $2\\arccos x$ has range $[0, 2\\pi]$.

> **Watch out.** The range of arccosine starts at $0$, so $k\\arccos x$ has range $[0, k\\pi]$, not $[-k\\pi, k\\pi]$. And the endpoints belong to the domain, since $\\arccos 1 = 0$ and $\\arccos(-1) = \\pi$.`,
        `余弦的每个值都会取到很多次，所以要有反函数，就把它限制在每个值恰好取一次的区间上：$[0, \\pi]$，在这一段上它从 $1$ 减小到 $-1$。所以 $y = \\arccos x$：

- **定义域**：$[-1, 1]$，即余弦取到的值
- **值域**：$[0, \\pi]$，即保留下来的角

把反余弦作用在一个式子上时，这个式子必须在 $-1$ 和 $1$ 之间。对 $f(x) = \\arccos\\left(\\frac{x}{3}\\right)$：

$$-1 \\le \\frac{x}{3} \\le 1 \\quad\\Longrightarrow\\quad -3 \\le x \\le 3$$

所以定义域是 $[-3, 3]$。检验：$x = -3$ 时输入是 $-1$，$\\arccos(-1) = \\pi$；$x = 6$ 时输入是 $2$，没有余弦能取到。

前面的系数拉伸输出：$2\\arccos x$ 的值域是 $[0, 2\\pi]$。

> **注意。** 反余弦的值域从 $0$ 开始，所以 $k\\arccos x$ 的值域是 $[0, k\\pi]$，不是 $[-k\\pi, k\\pi]$。端点属于定义域，因为 $\\arccos 1 = 0$，$\\arccos(-1) = \\pi$。`,
      ),
      figure: arccosFigure,
      generate(rng) {
        const type = rng.pick(["scaled", "shifted", "linear", "range"] as const);
        if (type === "scaled") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
          return oneOf(
            rng,
            t(
              `What is the domain of $f(x) = \\arccos\\left(\\frac{x}{${a}}\\right)$?`,
              `$f(x) = \\arccos\\left(\\frac{x}{${a}}\\right)$ 的定义域是什么？`,
            ),
            t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$(-${a}, ${a})$`, `$(-${a}, ${a})$`), t("$[0, \\pi]$", "$[0, \\pi]$")],
            inputBound(
              "arccos",
              `\\frac{x}{${a}}`,
              t(`Multiply each part by $${a}$:`, `每一部分乘以 $${a}$：`),
              `-${a} \\le x \\le ${a}`,
              t(
                `At $x = -${a}$ the input is $-1$, and $\\arccos(-1) = \\pi$ is defined. At $x = ${a + 1}$ it is $\\frac{${a + 1}}{${a}} > 1$, which no cosine reaches.`,
                `$x = -${a}$ 时输入是 $-1$，$\\arccos(-1) = \\pi$ 有定义。$x = ${a + 1}$ 时输入是 $\\frac{${a + 1}}{${a}} > 1$，没有余弦能取到。`,
              ),
            ),
            [
              why(
                "[-1, 1]",
                `That is the domain of $\\arccos x$ itself. Here the input is $\\frac{x}{${a}}$, which reaches $\\pm 1$ only at $x = \\pm ${a}$.`,
                `这是 $\\arccos x$ 本身的定义域。这里输入是 $\\frac{x}{${a}}$，在 $x = \\pm ${a}$ 时才达到 $\\pm 1$。`,
              ),
              why(
                `(-${a}, ${a})`,
                `The endpoints belong: at $x = \\pm ${a}$ the input is $\\pm 1$, and arccosine is defined there.`,
                `端点应包含在内：$x = \\pm ${a}$ 时输入是 $\\pm 1$，反余弦在那里有定义。`,
              ),
              why("[0, \\pi]", "That is the range of arccosine, its outputs, not the inputs.", "这是反余弦的值域，即输出，而不是输入。"),
            ],
          );
        }
        if (type === "shifted") {
          const h = rng.pick([-10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 10]);
          const sign = h > 0 ? `-${h}` : `+${-h}`;
          const left = h - 1;
          const right = h + 1;
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arccos(x ${sign})$?`, `$f(x) = \\arccos(x ${sign})$ 的定义域是什么？`),
            t(`$[${left}, ${right}]$`, `$[${left}, ${right}]$`),
            [
              t("$[-1, 1]$", "$[-1, 1]$"),
              t(`$[${left - 1}, ${right + 1}]$`, `$[${left - 1}, ${right + 1}]$`),
              t("$[0, \\pi]$", "$[0, \\pi]$"),
            ],
            inputBound(
              "arccos",
              `x ${sign}`,
              h > 0
                ? t(`Add $${h}$ to each part:`, `每一部分加上 $${h}$：`)
                : t(`Subtract $${-h}$ from each part:`, `每一部分减去 $${-h}$：`),
              `${left} \\le x \\le ${right}`,
              t(
                `At $x = ${right}$ the input is $${right} ${sign} = 1$, and at $x = ${left}$ it is $${left} ${sign} = -1$, the two ends of what arccosine accepts.`,
                `$x = ${right}$ 时输入是 $${right} ${sign} = 1$，$x = ${left}$ 时输入是 $${left} ${sign} = -1$，正好是反余弦所接受范围的两端。`,
              ),
            ),
            [
              why(
                "[-1, 1]",
                `That is the domain of $\\arccos x$ before the shift. The input $x ${sign}$ is $\\pm 1$ at $x = ${left}$ and $x = ${right}$.`,
                `这是平移前 $\\arccos x$ 的定义域。输入 $x ${sign}$ 在 $x = ${left}$ 和 $x = ${right}$ 时为 $\\pm 1$。`,
              ),
              why(
                `[${left - 1}, ${right + 1}]`,
                `This is one unit too wide on each side: at $x = ${right + 1}$ the input is $2$, which no cosine reaches.`,
                `两边各宽了一个单位：$x = ${right + 1}$ 时输入是 $2$，没有余弦能取到。`,
              ),
              why("[0, \\pi]", "That is the range of arccosine, its outputs, not the inputs.", "这是反余弦的值域，即输出，而不是输入。"),
            ],
          );
        }
        if (type === "linear") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8]);
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arccos(${a}x)$?`, `$f(x) = \\arccos(${a}x)$ 的定义域是什么？`),
            t(`$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`, `$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`), t("$[0, \\pi]$", "$[0, \\pi]$")],
            inputBound(
              "arccos",
              `${a}x`,
              t(`Divide each part by $${a}$:`, `每一部分除以 $${a}$：`),
              `-\\frac{1}{${a}} \\le x \\le \\frac{1}{${a}}`,
              t(
                `At $x = \\frac{1}{${a}}$ the input is $${a} \\cdot \\frac{1}{${a}} = 1$, and at $x = -\\frac{1}{${a}}$ it is $-1$, the two ends that arccosine accepts. Already at $x = 1$ the input is $${a}$, too large.`,
                `$x = \\frac{1}{${a}}$ 时输入是 $${a} \\cdot \\frac{1}{${a}} = 1$，$x = -\\frac{1}{${a}}$ 时输入是 $-1$，正好是反余弦所接受范围的两端。$x = 1$ 时输入已经是 $${a}$，太大了。`,
              ),
            ),
            [
              why(
                "[-1, 1]",
                `That is the domain of $\\arccos x$. Here the input $${a}x$ reaches $\\pm 1$ sooner, at $x = \\pm\\frac{1}{${a}}$.`,
                `这是 $\\arccos x$ 的定义域。这里输入 $${a}x$ 更早达到 $\\pm 1$，在 $x = \\pm\\frac{1}{${a}}$ 处。`,
              ),
              why(
                `[-${a}, ${a}]`,
                `This multiplies by $${a}$ instead of dividing: at $x = ${a}$ the input is $${a * a}$, far above $1$.`,
                `这里乘了 $${a}$ 而不是除以 $${a}$：$x = ${a}$ 时输入是 $${a * a}$，远大于 $1$。`,
              ),
              why("[0, \\pi]", "That is the range of arccosine, its outputs, not the inputs.", "这是反余弦的值域，即输出，而不是输入。"),
            ],
          );
        }
        const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        return oneOf(
          rng,
          t(`What is the range of $f(x) = ${k}\\arccos x$?`, `$f(x) = ${k}\\arccos x$ 的值域是什么？`),
          t(`$[0, ${k}\\pi]$`, `$[0, ${k}\\pi]$`),
          [t("$[0, \\pi]$", "$[0, \\pi]$"), t(`$[-${k}\\pi, ${k}\\pi]$`, `$[-${k}\\pi, ${k}\\pi]$`), t("$[-1, 1]$", "$[-1, 1]$")],
          walked(
            [
              [
                ["Start from the range of arccosine", "从反余弦的值域出发"],
                t("Every value of $\\arccos x$ lies in", "$\\arccos x$ 的每个值都满足"),
                ["0 \\le \\arccos x \\le \\pi"],
              ],
              [
                [`Multiply by $${k}$`, `乘以 $${k}$`],
                t(`Multiply each part by $${k}$, which is positive:`, `每一部分乘以正数 $${k}$：`),
                [`0 \\le ${k}\\arccos x \\le ${k}\\pi`],
              ],
            ],
            t(
              `$f(1) = ${k} \\cdot 0 = 0$ and $f(-1) = ${k} \\cdot \\pi = ${k}\\pi$, so both ends are reached.`,
              `$f(1) = ${k} \\cdot 0 = 0$，$f(-1) = ${k} \\cdot \\pi = ${k}\\pi$，两端都能取到。`,
            ),
          ),
          [
            why(
              "[0, \\pi]",
              `That is the range of $\\arccos x$ before multiplying by $${k}$.`,
              `这是乘以 $${k}$ 之前 $\\arccos x$ 的值域。`,
            ),
            why(
              `[-${k}\\pi, ${k}\\pi]`,
              "Arccosine is never negative, so the range starts at $0$.",
              "反余弦从不取负值，所以值域从 $0$ 开始。",
            ),
            why("[-1, 1]", "That is the domain of arccosine, its inputs, not its outputs.", "这是反余弦的定义域，即输入，而不是输出。"),
          ],
        );
      },
    },
    {
      id: "key-points-and-symmetry-of-arccos",
      figure: precalculusDrawings["graphing-the-inverse-cosine-function#key-points-and-symmetry-of-arccos"],
      title: t("Key points and evaluation of arccos", "反余弦的关键点与求值"),
      explanation: t(
        `Reflecting the kept piece of cosine in the line $y = x$ swaps the coordinates of its points. So $y = \\arccos x$ passes through $(1, 0)$, $\\left(0, \\frac{\\pi}{2}\\right)$ and $(-1, \\pi)$, and through $\\left(\\frac{\\sqrt{3}}{2}, \\frac{\\pi}{6}\\right)$, $\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\pi}{4}\\right)$ and $\\left(\\frac{1}{2}, \\frac{\\pi}{3}\\right)$. A negative input gives an angle past $\\frac{\\pi}{2}$: $\\arccos(-x) = \\pi - \\arccos x$.

To find $3\\arccos\\left(-\\frac{1}{2}\\right)$: since $\\arccos\\frac{1}{2} = \\frac{\\pi}{3}$, we get $\\arccos\\left(-\\frac{1}{2}\\right) = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$, and

$$3\\arccos\\left(-\\frac{1}{2}\\right) = 3 \\cdot \\frac{2\\pi}{3} = 2\\pi$$

Check: $\\cos\\frac{2\\pi}{3} = -\\frac{1}{2}$, and $\\frac{2\\pi}{3}$ lies in $[0, \\pi]$.

> **Watch out.** Arccosine is never negative, so $\\arccos\\left(-\\frac{1}{2}\\right)$ is not $-\\frac{\\pi}{3}$. The symmetry of arcsine, $\\arcsin(-x) = -\\arcsin x$, does not carry over; use $\\arccos(-x) = \\pi - \\arccos x$ instead.`,
        `把余弦保留的一段关于直线 $y = x$ 翻折，点的横纵坐标互换。所以 $y = \\arccos x$ 经过 $(1, 0)$、$\\left(0, \\frac{\\pi}{2}\\right)$ 和 $(-1, \\pi)$，也经过 $\\left(\\frac{\\sqrt{3}}{2}, \\frac{\\pi}{6}\\right)$、$\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\pi}{4}\\right)$ 和 $\\left(\\frac{1}{2}, \\frac{\\pi}{3}\\right)$。负的输入给出大于 $\\frac{\\pi}{2}$ 的角：$\\arccos(-x) = \\pi - \\arccos x$。

求 $3\\arccos\\left(-\\frac{1}{2}\\right)$：因为 $\\arccos\\frac{1}{2} = \\frac{\\pi}{3}$，所以 $\\arccos\\left(-\\frac{1}{2}\\right) = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$，于是

$$3\\arccos\\left(-\\frac{1}{2}\\right) = 3 \\cdot \\frac{2\\pi}{3} = 2\\pi$$

检验：$\\cos\\frac{2\\pi}{3} = -\\frac{1}{2}$，且 $\\frac{2\\pi}{3}$ 在 $[0, \\pi]$ 内。

> **注意。** 反余弦从不取负值，所以 $\\arccos\\left(-\\frac{1}{2}\\right)$ 不是 $-\\frac{\\pi}{3}$。反正弦的对称性 $\\arcsin(-x) = -\\arcsin x$ 在这里不成立，要用 $\\arccos(-x) = \\pi - \\arccos x$。`,
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", ans: "0", wrong: ["\\pi", "\\frac{\\pi}{2}", "\\frac{\\pi}{4}"] },
          { val: "0", ans: "\\frac{\\pi}{2}", wrong: ["0", "\\pi", "-\\frac{\\pi}{2}"] },
          { val: "-1", ans: "\\pi", wrong: ["0", "\\frac{\\pi}{2}", "-\\pi"] },
          { val: "\\frac{1}{2}", ans: "\\frac{\\pi}{3}", wrong: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{\\pi}{4}"] },
          { val: "-\\frac{1}{2}", ans: "\\frac{2\\pi}{3}", wrong: ["-\\frac{\\pi}{3}", "\\frac{\\pi}{3}", "\\frac{5\\pi}{6}"] },
          { val: "\\frac{\\sqrt{2}}{2}", ans: "\\frac{\\pi}{4}", wrong: ["\\frac{\\pi}{6}", "\\frac{\\pi}{3}", "\\frac{3\\pi}{4}"] },
          { val: "-\\frac{\\sqrt{2}}{2}", ans: "\\frac{3\\pi}{4}", wrong: ["-\\frac{\\pi}{4}", "\\frac{\\pi}{4}", "\\frac{5\\pi}{4}"] },
          { val: "\\frac{\\sqrt{3}}{2}", ans: "\\frac{\\pi}{6}", wrong: ["\\frac{\\pi}{3}", "\\frac{\\pi}{4}", "\\frac{5\\pi}{6}"] },
          { val: "-\\frac{\\sqrt{3}}{2}", ans: "\\frac{5\\pi}{6}", wrong: ["-\\frac{\\pi}{6}", "\\frac{\\pi}{6}", "\\frac{2\\pi}{3}"] },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `\\arccos\\left(${item.val}\\right)` : `${mult}\\arccos\\left(${item.val}\\right)`;
        const ansStr = scalePi(item.ans, mult);
        const wrongStr = item.wrong.map((w) => `$${scalePi(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          principal("arccos", item.val, item.ans, mult),
          principalReasons("arccos", item.val, item.ans, item.wrong, mult),
        );
      },
    },
  ],
};

// ─── 4.9.3 Graphing the inverse tangent function ────────────────────────────

/** graphingTheInverseTangentFunction covers domain, range, and asymptotes of arctan. */
export const graphingTheInverseTangentFunction: TopicDef = {
  id: "graphing-the-inverse-tangent-function",
  title: t("Graphing the Inverse Tangent Function", "反正切函数的图象与性质"),
  summary: t(
    "Describe the domain, range, horizontal asymptotes, and symmetry of the inverse tangent function y = arctan(x).",
    "描述反正切函数 y = arctan(x) 的定义域、值域、水平渐近线与对称性。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function", "graphing-tangent-and-cotangent"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.TF.B.6"],
  intro: t(
    `Tangent is kept on $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, the branch between two vertical asymptotes, where it rises through every real number once. Its inverse $y = \\arctan x$ accepts any real number and returns the angle in that open interval with that tangent. So $\\arctan 1 = \\frac{\\pi}{4}$, and $\\arctan 1000$ is just below $\\frac{\\pi}{2}$.

Check: $\\tan\\frac{\\pi}{4} = 1$. And $\\arctan 1000 \\approx 1.5698$, while $\\frac{\\pi}{2} \\approx 1.5708$: close, but never reached, because $\\tan\\frac{\\pi}{2}$ is not defined.

In this lesson we find the domain and range of arctangent and of functions built from it, and describe its horizontal asymptotes and its symmetry.`,
    `正切保留在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 上，即两条竖直渐近线之间的一支，在这一支上它增加并取遍每个实数一次。它的反函数 $y = \\arctan x$ 接受任何实数，返回这个开区间中正切为这个数的角。所以 $\\arctan 1 = \\frac{\\pi}{4}$，而 $\\arctan 1000$ 略小于 $\\frac{\\pi}{2}$。

检验：$\\tan\\frac{\\pi}{4} = 1$。$\\arctan 1000 \\approx 1.5698$，而 $\\frac{\\pi}{2} \\approx 1.5708$：很接近，但永远取不到，因为 $\\tan\\frac{\\pi}{2}$ 没有定义。

这节课我们求反正切以及由它构成的函数的定义域和值域，并描述它的水平渐近线和对称性。`,
  ),
  knowledgePoints: [
    {
      id: "domain-and-range-of-arctan",
      title: t("Domain and range of arctan", "反正切函数的定义域与值域"),
      explanation: t(
        `Tangent repeats its values, so it is kept on one branch between two asymptotes, $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, where it takes every real value once. So $y = \\arctan x$ has:

- **Domain**: $(-\\infty, \\infty)$, since tangent reaches every real number
- **Range**: $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, open, since the ends are asymptotes

No input is ever too large, so changing the input changes nothing in the domain. What changes the range is what happens outside: for $f(x) = \\arctan(x) - 2$, every value moves down $2$:

$$-\\frac{\\pi}{2} - 2 < \\arctan(x) - 2 < \\frac{\\pi}{2} - 2$$

Check: $f(0) = 0 - 2 = -2$, the middle of this interval, just as $0$ is the middle of $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.

> **Watch out.** The range is open: $\\pm\\frac{\\pi}{2}$ are never reached, because $\\tan\\left(\\pm\\frac{\\pi}{2}\\right)$ is not defined. And do not carry over $[-1, 1]$ from arcsine: arctangent accepts every real number.`,
        `正切的值会重复，所以把它保留在两条渐近线之间的一支 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 上，在这一支上它取遍每个实数一次。所以 $y = \\arctan x$：

- **定义域**：$(-\\infty, \\infty)$，因为正切取遍所有实数
- **值域**：$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$，是开区间，因为两端是渐近线

输入永远不会太大，所以改变里面的式子不影响定义域。改变值域的是外面的变化：对 $f(x) = \\arctan(x) - 2$，每个值都向下移动 $2$：

$$-\\frac{\\pi}{2} - 2 < \\arctan(x) - 2 < \\frac{\\pi}{2} - 2$$

检验：$f(0) = 0 - 2 = -2$，正是这个区间的中点，就像 $0$ 是 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 的中点一样。

> **注意。** 值域是开区间：$\\pm\\frac{\\pi}{2}$ 永远取不到，因为 $\\tan\\left(\\pm\\frac{\\pi}{2}\\right)$ 没有定义。也不要把反正弦的 $[-1, 1]$ 搬过来：反正切接受任何实数。`,
      ),
      figure: arctanFigure,
      generate(rng) {
        const type = rng.pick(["domain", "range-scaled", "range-shifted"] as const);
        if (type === "domain") {
          const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
          const h = rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
          const expr = h === 0 ? `${k === 1 ? "" : k}x` : `${k === 1 ? "" : k}x ${h > 0 ? `+ ${h}` : `- ${-h}`}`;
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arctan(${expr})$?`, `$f(x) = \\arctan(${expr})$ 的定义域是什么？`),
            t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
            [
              t("$[-1, 1]$", "$[-1, 1]$"),
              t("$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", "$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$"),
              t("$[0, \\infty)$", "$[0, \\infty)$"),
            ],
            walked(
              [
                [
                  ["Ask what arctangent accepts", "看反正切接受什么输入"],
                  t(
                    "On $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ tangent takes every real value, so $\\arctan$ accepts every real number.",
                    "在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 上正切取遍所有实数，所以 $\\arctan$ 接受任何实数。",
                  ),
                ],
                [
                  ["Look at the input", "看里面的式子"],
                  t(
                    `The input $${expr}$ is defined for every $x$, and whatever value it takes is allowed. So the domain is all real numbers.`,
                    `输入 $${expr}$ 对每个 $x$ 都有定义，它取什么值都可以。所以定义域是全体实数。`,
                  ),
                ],
              ],
              t(
                `Even a large input works: at $x = 100$ the input is $${k * 100 + h}$, and $\\arctan ${k * 100 + h} \\approx ${dec4(Math.atan(k * 100 + h))}$, just below $\\frac{\\pi}{2} \\approx 1.5708$.`,
                `很大的输入也可以：$x = 100$ 时输入是 $${k * 100 + h}$，$\\arctan ${k * 100 + h} \\approx ${dec4(Math.atan(k * 100 + h))}$，略小于 $\\frac{\\pi}{2} \\approx 1.5708$。`,
              ),
            ),
            [
              why(
                "[-1, 1]",
                "That is the domain of arcsine and arccosine. Tangent reaches every real number, so arctangent accepts them all.",
                "这是反正弦和反余弦的定义域。正切能取到每个实数，所以反正切全部接受。",
              ),
              why(
                "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)",
                "That is the range of arctangent, its outputs, not its inputs.",
                "这是反正切的值域，即输出，而不是输入。",
              ),
              why(
                "[0, \\infty)",
                "Negative inputs are allowed too: $\\arctan(-1) = -\\frac{\\pi}{4}$.",
                "负的输入也可以：$\\arctan(-1) = -\\frac{\\pi}{4}$。",
              ),
            ],
          );
        }
        if (type === "range-scaled") {
          const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
          const ans = k % 2 === 0 ? `(-${evenHalfPi(k)}, ${evenHalfPi(k)})` : `\\left(-\\frac{${k}\\pi}{2}, \\frac{${k}\\pi}{2}\\right)`;
          return oneOf(
            rng,
            t(`What is the range of $f(x) = ${k}\\arctan x$?`, `$f(x) = ${k}\\arctan x$ 的值域是什么？`),
            t(`$${ans}$`, `$${ans}$`),
            [
              t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
              t("$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", "$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$"),
              t(`$[0, ${k}\\pi]$`, `$[0, ${k}\\pi]$`),
            ],
            walked(
              [
                [
                  ["Start from the range of arctangent", "从反正切的值域出发"],
                  t("Every value of $\\arctan x$ lies strictly between the asymptotes:", "$\\arctan x$ 的每个值都严格位于两条渐近线之间："),
                  ["-\\frac{\\pi}{2} < \\arctan x < \\frac{\\pi}{2}"],
                ],
                [
                  [`Multiply by $${k}$`, `乘以 $${k}$`],
                  t(`Multiply each part by $${k}$, which is positive:`, `每一部分乘以正数 $${k}$：`),
                  [`-${scalePi("\\frac{\\pi}{2}", k)} < ${k}\\arctan x < ${scalePi("\\frac{\\pi}{2}", k)}`],
                ],
              ],
              t(
                `As $x$ grows, $\\arctan x$ approaches $\\frac{\\pi}{2}$ without reaching it: $${k}\\arctan 1000 \\approx ${dec4(k * Math.atan(1000))}$, just below $${scalePi("\\frac{\\pi}{2}", k)} \\approx ${dec4(k * halfPi)}$.`,
                `$x$ 增大时，$\\arctan x$ 趋近 $\\frac{\\pi}{2}$ 但取不到：$${k}\\arctan 1000 \\approx ${dec4(k * Math.atan(1000))}$，略小于 $${scalePi("\\frac{\\pi}{2}", k)} \\approx ${dec4(k * halfPi)}$。`,
              ),
            ),
            [
              why(
                "(-\\infty, \\infty)",
                `Arctangent is bounded, so $${k}\\arctan x$ stays between $\\pm ${scalePi("\\frac{\\pi}{2}", k)}$.`,
                `反正切是有界的，所以 $${k}\\arctan x$ 在 $\\pm ${scalePi("\\frac{\\pi}{2}", k)}$ 之间。`,
              ),
              why(
                "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)",
                `That is the range of $\\arctan x$ before multiplying by $${k}$.`,
                `这是乘以 $${k}$ 之前 $\\arctan x$ 的值域。`,
              ),
              why(
                `[0, ${k}\\pi]`,
                "Arctangent takes negative values too, and its ends are never reached, so the interval is open and centred on $0$.",
                "反正切也取负值，而且两端取不到，所以值域是以 $0$ 为中心的开区间。",
              ),
            ],
          );
        }
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const sign = c > 0 ? `+ ${c}` : `- ${-c}`;
        return oneOf(
          rng,
          t(`What is the range of $f(x) = \\arctan(x) ${sign}$?`, `$f(x) = \\arctan(x) ${sign}$ 的值域是什么？`),
          t(
            `$\\left(-\\frac{\\pi}{2} ${sign}, \\frac{\\pi}{2} ${sign}\\right)$`,
            `$\\left(-\\frac{\\pi}{2} ${sign}, \\frac{\\pi}{2} ${sign}\\right)$`,
          ),
          [
            t("$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", "$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$"),
            t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
            t(`$[0, \\pi ${sign}]$`, `$[0, \\pi ${sign}]$`),
          ],
          walked(
            [
              [
                ["Start from the range of arctangent", "从反正切的值域出发"],
                t("Every value of $\\arctan x$ lies strictly between the asymptotes:", "$\\arctan x$ 的每个值都严格位于两条渐近线之间："),
                ["-\\frac{\\pi}{2} < \\arctan x < \\frac{\\pi}{2}"],
              ],
              [
                ["Shift", "平移"],
                c > 0
                  ? t(`Add $${c}$ to each part:`, `每一部分加上 $${c}$：`)
                  : t(`Subtract $${-c}$ from each part:`, `每一部分减去 $${-c}$：`),
                [`-\\frac{\\pi}{2} ${sign} < \\arctan(x) ${sign} < \\frac{\\pi}{2} ${sign}`],
              ],
            ],
            t(
              `$f(0) = 0 ${sign} = ${c}$, the middle of the interval, just as $0$ is the middle of $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.`,
              `$f(0) = 0 ${sign} = ${c}$，正是区间的中点，就像 $0$ 是 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 的中点一样。`,
            ),
          ),
          [
            why(
              "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)",
              `This leaves out the shift: adding $${c}$ to every value moves both ends by $${c}$.`,
              `这里漏掉了平移：每个值加上 $${c}$，两端也都移动 $${c}$。`,
            ),
            why("(-\\infty, \\infty)", "Arctangent is bounded, and a shift keeps it bounded.", "反正切是有界的，平移后仍然有界。"),
            why(
              `[0, \\pi ${sign}]`,
              "That shape belongs to arccosine. Arctangent is centred on $0$ before the shift, and its ends are never reached.",
              "这是反余弦的形状。平移前反正切以 $0$ 为中心，而且两端取不到。",
            ),
          ],
        );
      },
    },
    {
      id: "asymptotes-and-symmetry-of-arctan",
      figure: precalculusDrawings["graphing-the-inverse-tangent-function#asymptotes-and-symmetry-of-arctan"],
      title: t("Horizontal asymptotes and symmetry of arctan", "反正切函数的渐近线与对称性"),
      explanation: t(
        `Reflecting the kept branch of tangent in the line $y = x$ turns its vertical asymptotes $x = \\pm\\frac{\\pi}{2}$ into horizontal ones. So as $x \\to \\infty$, $\\arctan x \\to \\frac{\\pi}{2}$, and as $x \\to -\\infty$, $\\arctan x \\to -\\frac{\\pi}{2}$: the horizontal asymptotes are $y = \\pm\\frac{\\pi}{2}$. Tangent is odd, so arctangent is odd too: $\\arctan(-x) = -\\arctan x$, and the graph is symmetric about the origin.

A factor stretches the asymptotes with the graph. For $f(x) = 4\\arctan x$, the asymptotes are

$$y = \\pm 4 \\cdot \\frac{\\pi}{2} = \\pm 2\\pi$$

Check: $4\\arctan 1000 \\approx 6.2792$, just below $2\\pi \\approx 6.2832$.

> **Watch out.** The asymptote of $k\\arctan x$ is $y = k \\cdot \\frac{\\pi}{2}$, not $y = k\\pi$ or $y = k$. And it is horizontal: arctangent is defined for every $x$, so it has no vertical asymptote.`,
        `把正切保留的一支关于直线 $y = x$ 翻折，它的竖直渐近线 $x = \\pm\\frac{\\pi}{2}$ 就变成水平渐近线。所以当 $x \\to \\infty$ 时 $\\arctan x \\to \\frac{\\pi}{2}$，当 $x \\to -\\infty$ 时 $\\arctan x \\to -\\frac{\\pi}{2}$：水平渐近线是 $y = \\pm\\frac{\\pi}{2}$。正切是奇函数，所以反正切也是奇函数：$\\arctan(-x) = -\\arctan x$，图象关于原点对称。

系数会把渐近线和图象一起拉伸。对 $f(x) = 4\\arctan x$，渐近线是

$$y = \\pm 4 \\cdot \\frac{\\pi}{2} = \\pm 2\\pi$$

检验：$4\\arctan 1000 \\approx 6.2792$，略小于 $2\\pi \\approx 6.2832$。

> **注意。** $k\\arctan x$ 的渐近线是 $y = k \\cdot \\frac{\\pi}{2}$，不是 $y = k\\pi$ 或 $y = k$。而且它是水平的：反正切对每个 $x$ 都有定义，所以没有竖直渐近线。`,
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]);
        const askAsymptote = rng.pick(["pos", "neg", "sym"] as const);
        const kTex = k === 1 ? "" : `${k}`;
        if (askAsymptote === "pos") {
          const ans = k === 1 ? "y = \\frac{\\pi}{2}" : k % 2 === 0 ? `y = ${evenHalfPi(k)}` : `y = \\frac{${k}\\pi}{2}`;
          return oneOf(
            rng,
            t(
              `What is the horizontal asymptote of $f(x) = ${kTex}\\arctan x$ as $x \\to \\infty$?`,
              `当 $x \\to \\infty$ 时，$f(x) = ${kTex}\\arctan x$ 的水平渐近线是什么？`,
            ),
            t(`$${ans}$`, `$${ans}$`),
            [t(`$y = ${kTex}\\pi$`, `$y = ${kTex}\\pi$`), t("$y = 0$", "$y = 0$"), t(`$y = ${k}$`, `$y = ${k}$`)],
            walked(
              [
                [
                  ["Find the limit of arctangent", "求反正切的极限"],
                  t(
                    "As $x \\to \\infty$, $\\arctan x$ rises toward $\\frac{\\pi}{2}$ without reaching it.",
                    "当 $x \\to \\infty$ 时，$\\arctan x$ 增大并趋近 $\\frac{\\pi}{2}$，但取不到。",
                  ),
                ],
                [
                  ["Multiply", "乘以系数"],
                  t(`So $${kTex}\\arctan x$ approaches this, and the asymptote is`, `所以 $${kTex}\\arctan x$ 趋近于它，渐近线是`),
                  [k === 1 ? `${ans}` : `y = ${k} \\cdot \\left(\\frac{\\pi}{2}\\right) = ${ans.slice(4)}`],
                ],
              ],
              t(
                `$${kTex}\\arctan(1000) \\approx ${dec4(k * Math.atan(1000))}$, close to $${ans.slice(4)} \\approx ${dec4(k * halfPi)}$.`,
                `$${kTex}\\arctan(1000) \\approx ${dec4(k * Math.atan(1000))}$，接近 $${ans.slice(4)} \\approx ${dec4(k * halfPi)}$。`,
              ),
            ),
            [
              why(
                `y = ${kTex}\\pi`,
                "This uses $\\pi$ instead of $\\frac{\\pi}{2}$: the whole range is $\\pi$ wide, but each asymptote is only $\\frac{\\pi}{2}$ from the axis before the factor.",
                "这里用了 $\\pi$ 而不是 $\\frac{\\pi}{2}$：整个值域宽 $\\pi$，但乘系数之前每条渐近线离轴只有 $\\frac{\\pi}{2}$。",
              ),
              why(
                "y = 0",
                "That is the value at $x = 0$, not the limit as $x \\to \\infty$.",
                "这是 $x = 0$ 时的值，不是 $x \\to \\infty$ 时的极限。",
              ),
              why(`y = ${k}`, "The limit of arctangent is $\\frac{\\pi}{2}$, not $1$.", "反正切的极限是 $\\frac{\\pi}{2}$，不是 $1$。"),
            ],
          );
        }
        if (askAsymptote === "neg") {
          const ans = k === 1 ? "y = -\\frac{\\pi}{2}" : k % 2 === 0 ? `y = -${evenHalfPi(k)}` : `y = -\\frac{${k}\\pi}{2}`;
          return oneOf(
            rng,
            t(
              `What is the horizontal asymptote of $f(x) = ${kTex}\\arctan x$ as $x \\to -\\infty$?`,
              `当 $x \\to -\\infty$ 时，$f(x) = ${kTex}\\arctan x$ 的水平渐近线是什么？`,
            ),
            t(`$${ans}$`, `$${ans}$`),
            [t(`$y = -${kTex}\\pi$`, `$y = -${kTex}\\pi$`), t("$y = 0$", "$y = 0$"), t(`$y = -${k}$`, `$y = -${k}$`)],
            walked(
              [
                [
                  ["Find the limit of arctangent", "求反正切的极限"],
                  t(
                    "As $x \\to -\\infty$, $\\arctan x$ falls toward $-\\frac{\\pi}{2}$ without reaching it.",
                    "当 $x \\to -\\infty$ 时，$\\arctan x$ 减小并趋近 $-\\frac{\\pi}{2}$，但取不到。",
                  ),
                ],
                [
                  ["Multiply", "乘以系数"],
                  t(`So $${kTex}\\arctan x$ approaches this, and the asymptote is`, `所以 $${kTex}\\arctan x$ 趋近于它，渐近线是`),
                  [k === 1 ? `${ans}` : `y = ${k} \\cdot \\left(-\\frac{\\pi}{2}\\right) = ${ans.slice(4)}`],
                ],
              ],
              t(
                `$${kTex}\\arctan(-1000) \\approx ${dec4(-k * Math.atan(1000))}$, close to $${ans.slice(4)} \\approx ${dec4(-k * halfPi)}$.`,
                `$${kTex}\\arctan(-1000) \\approx ${dec4(-k * Math.atan(1000))}$，接近 $${ans.slice(4)} \\approx ${dec4(-k * halfPi)}$。`,
              ),
            ),
            [
              why(
                `y = -${kTex}\\pi`,
                "This uses $\\pi$ instead of $\\frac{\\pi}{2}$: the whole range is $\\pi$ wide, but each asymptote is only $\\frac{\\pi}{2}$ from the axis before the factor.",
                "这里用了 $\\pi$ 而不是 $\\frac{\\pi}{2}$：整个值域宽 $\\pi$，但乘系数之前每条渐近线离轴只有 $\\frac{\\pi}{2}$。",
              ),
              why(
                "y = 0",
                "That is the value at $x = 0$, not the limit as $x \\to -\\infty$.",
                "这是 $x = 0$ 时的值，不是 $x \\to -\\infty$ 时的极限。",
              ),
              why(
                `y = -${k}`,
                "The limit of arctangent is $-\\frac{\\pi}{2}$, not $-1$.",
                "反正切的极限是 $-\\frac{\\pi}{2}$，不是 $-1$。",
              ),
            ],
          );
        }
        return oneOf(
          rng,
          t(
            `Which statement correctly describes the symmetry of $f(x) = ${kTex}\\arctan x$?`,
            `关于 $f(x) = ${kTex}\\arctan x$ 的对称性，下列哪项描述正确？`,
          ),
          t("Odd function, symmetric about the origin", "奇函数，关于原点对称"),
          [
            t("Even function, symmetric about the $y$-axis", "偶函数，关于 $y$ 轴对称"),
            t("Periodic with period $\\pi$", "周期函数，周期为 $\\pi$"),
            t("Neither even nor odd", "非奇非偶函数"),
          ],
          walked(
            [
              [
                ["Use the symmetry of arctangent", "利用反正切的对称性"],
                t("Tangent is odd, so its inverse is odd too:", "正切是奇函数，所以它的反函数也是奇函数："),
                ["\\arctan(-x) = -\\arctan x"],
              ],
              [["Apply it to $f$", "用于 $f$"], t("So", "所以"), [`f(-x) = ${kTex}\\arctan(-x) = -${kTex}\\arctan x = -f(x)`]],
            ],
            t(
              `$f(1) = ${k === 1 ? "" : `${k} \\cdot `}\\frac{\\pi}{4} \\approx ${dec4((k * Math.PI) / 4)}$ and $f(-1) \\approx ${dec4((-k * Math.PI) / 4)}$: opposite values, as an odd function needs.`,
              `$f(1) = ${k === 1 ? "" : `${k} \\cdot `}\\frac{\\pi}{4} \\approx ${dec4((k * Math.PI) / 4)}$，$f(-1) \\approx ${dec4((-k * Math.PI) / 4)}$：互为相反数，符合奇函数。`,
            ),
          ),
          [
            [
              "Even function, symmetric about the $y$-axis",
              "An even function has $f(-x) = f(x)$, but $f(1)$ and $f(-1)$ have opposite signs.",
              "偶函数满足 $f(-x) = f(x)$，但 $f(1)$ 和 $f(-1)$ 符号相反。",
            ],
            [
              "Periodic with period $\\pi$",
              "Tangent is periodic, but arctangent keeps increasing and never repeats a value.",
              "正切是周期函数，但反正切一直增加，从不重复取值。",
            ],
            [
              "Neither even nor odd",
              "It is odd, since $f(-x) = -f(x)$ for every $x$.",
              "它是奇函数，因为对每个 $x$ 都有 $f(-x) = -f(x)$。",
            ],
          ],
        );
      },
    },
  ],
};

// ─── 4.9.4 Evaluating expressions with inverse trigonometric functions ──────

/** evaluatingExpressionsContainingInverseTrigonometricFunctions calculates special values. */
export const evaluatingExpressionsContainingInverseTrigonometricFunctions: TopicDef = {
  id: "evaluating-expressions-containing-inverse-trigonometric-functions",
  title: t("Evaluating Expressions Containing Inverse Trigonometric Functions", "求含反三角函数表达式的值"),
  summary: t(
    "Evaluate exact values of inverse trigonometric functions at special unit circle ratios.",
    "求反三角函数在单位圆特殊角比值处的精确值。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.TF.B.6"],
  intro: t(
    `At a special value, an inverse trigonometric function names a special angle, the one in its principal range. To evaluate $\\arctan\\left(-\\frac{\\sqrt{3}}{3}\\right) + \\arccos 0$, find each angle in turn. The angle in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ with tangent $-\\frac{\\sqrt{3}}{3}$ is $-\\frac{\\pi}{6}$, and the angle in $[0, \\pi]$ with cosine $0$ is $\\frac{\\pi}{2}$. So

$$\\arctan\\left(-\\frac{\\sqrt{3}}{3}\\right) + \\arccos 0 = -\\frac{\\pi}{6} + \\frac{\\pi}{2} = \\frac{\\pi}{3}$$

Check: $\\tan\\left(-\\frac{\\pi}{6}\\right) = -\\frac{\\sqrt{3}}{3}$ and $\\cos\\frac{\\pi}{2} = 0$, and each angle lies in its range.

In this lesson we find the exact values of arcsine, arccosine and arctangent at the special values, and of multiples of them.`,
    `在特殊值处，反三角函数给出一个特殊角，即它主值区间内的那个角。求 $\\arctan\\left(-\\frac{\\sqrt{3}}{3}\\right) + \\arccos 0$ 时，依次求出每个角。$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 中正切为 $-\\frac{\\sqrt{3}}{3}$ 的角是 $-\\frac{\\pi}{6}$，$[0, \\pi]$ 中余弦为 $0$ 的角是 $\\frac{\\pi}{2}$。所以

$$\\arctan\\left(-\\frac{\\sqrt{3}}{3}\\right) + \\arccos 0 = -\\frac{\\pi}{6} + \\frac{\\pi}{2} = \\frac{\\pi}{3}$$

检验：$\\tan\\left(-\\frac{\\pi}{6}\\right) = -\\frac{\\sqrt{3}}{3}$，$\\cos\\frac{\\pi}{2} = 0$，且每个角都在各自的值域内。

这节课我们求反正弦、反余弦和反正切在特殊值处的精确值，以及它们的倍数。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-arcsin-and-arccos-special",
      figure:
        precalculusDrawings4["evaluating-expressions-containing-inverse-trigonometric-functions#evaluating-arcsin-and-arccos-special"],
      title: t("Exact values of arcsin and arccos", "反正弦与反余弦的精确值"),
      explanation: t(
        `Each special value of sine or cosine belongs to many angles, and the principal range picks one: arcsine answers in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, arccosine in $[0, \\pi]$. So one value can give different angles: $\\arcsin\\left(-\\frac{1}{2}\\right) = -\\frac{\\pi}{6}$, but $\\arccos\\left(-\\frac{1}{2}\\right) = \\frac{2\\pi}{3}$.

To find $6\\arccos\\left(-\\frac{\\sqrt{2}}{2}\\right)$: cosine is $\\frac{\\sqrt{2}}{2}$ at $\\frac{\\pi}{4}$, and the angle in $[0, \\pi]$ with the opposite cosine is $\\pi - \\frac{\\pi}{4} = \\frac{3\\pi}{4}$. So

$$6\\arccos\\left(-\\frac{\\sqrt{2}}{2}\\right) = 6 \\cdot \\frac{3\\pi}{4} = \\frac{9\\pi}{2}$$

Check: $\\cos\\frac{3\\pi}{4} = -\\frac{\\sqrt{2}}{2}$, and $\\frac{3\\pi}{4}$ lies in $[0, \\pi]$.

> **Watch out.** For a negative value the two functions behave differently: arcsine gives a negative angle, and arccosine gives an angle between $\\frac{\\pi}{2}$ and $\\pi$. Find the angle first and multiply afterwards, so that a factor in front does not push you outside the range.`,
        `正弦或余弦的每个特殊值都对应许多角，主值区间从中选出一个：反正弦的答案在 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 内，反余弦在 $[0, \\pi]$ 内。所以同一个值可能给出不同的角：$\\arcsin\\left(-\\frac{1}{2}\\right) = -\\frac{\\pi}{6}$，而 $\\arccos\\left(-\\frac{1}{2}\\right) = \\frac{2\\pi}{3}$。

求 $6\\arccos\\left(-\\frac{\\sqrt{2}}{2}\\right)$：余弦在 $\\frac{\\pi}{4}$ 处为 $\\frac{\\sqrt{2}}{2}$，$[0, \\pi]$ 中余弦为它的相反数的角是 $\\pi - \\frac{\\pi}{4} = \\frac{3\\pi}{4}$。所以

$$6\\arccos\\left(-\\frac{\\sqrt{2}}{2}\\right) = 6 \\cdot \\frac{3\\pi}{4} = \\frac{9\\pi}{2}$$

检验：$\\cos\\frac{3\\pi}{4} = -\\frac{\\sqrt{2}}{2}$，且 $\\frac{3\\pi}{4}$ 在 $[0, \\pi]$ 内。

> **注意。** 对负值，两个函数表现不同：反正弦给出负角，反余弦给出 $\\frac{\\pi}{2}$ 与 $\\pi$ 之间的角。先求出角，再乘系数，这样前面的系数就不会让你跑出值域。`,
      ),
      generate(rng) {
        const item = rng.pick([
          { fn: "arcsin", val: "\\frac{1}{2}", ans: "\\frac{\\pi}{6}" },
          { fn: "arcsin", val: "\\frac{\\sqrt{2}}{2}", ans: "\\frac{\\pi}{4}" },
          { fn: "arcsin", val: "\\frac{\\sqrt{3}}{2}", ans: "\\frac{\\pi}{3}" },
          { fn: "arcsin", val: "-\\frac{1}{2}", ans: "-\\frac{\\pi}{6}" },
          { fn: "arcsin", val: "-\\frac{\\sqrt{2}}{2}", ans: "-\\frac{\\pi}{4}" },
          { fn: "arcsin", val: "-\\frac{\\sqrt{3}}{2}", ans: "-\\frac{\\pi}{3}" },
          { fn: "arccos", val: "\\frac{1}{2}", ans: "\\frac{\\pi}{3}" },
          { fn: "arccos", val: "\\frac{\\sqrt{2}}{2}", ans: "\\frac{\\pi}{4}" },
          { fn: "arccos", val: "\\frac{\\sqrt{3}}{2}", ans: "\\frac{\\pi}{6}" },
          { fn: "arccos", val: "-\\frac{1}{2}", ans: "\\frac{2\\pi}{3}" },
          { fn: "arccos", val: "-\\frac{\\sqrt{2}}{2}", ans: "\\frac{3\\pi}{4}" },
          { fn: "arccos", val: "-\\frac{\\sqrt{3}}{2}", ans: "\\frac{5\\pi}{6}" },
          { fn: "arcsin", val: "1", ans: "\\frac{\\pi}{2}" },
          { fn: "arcsin", val: "-1", ans: "-\\frac{\\pi}{2}" },
          { fn: "arccos", val: "1", ans: "0" },
          { fn: "arccos", val: "-1", ans: "\\pi" },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `\\${item.fn}\\left(${item.val}\\right)` : `${mult}\\${item.fn}\\left(${item.val}\\right)`;
        const ansStr = scalePi(item.ans, mult);
        const wrongList = [
          "\\frac{\\pi}{6}",
          "\\frac{\\pi}{4}",
          "\\frac{\\pi}{3}",
          "\\frac{2\\pi}{3}",
          "\\frac{3\\pi}{4}",
          "\\frac{5\\pi}{6}",
          "-\\frac{\\pi}{6}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => `$${scalePi(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          principal(item.fn as "arcsin" | "arccos", item.val, item.ans, mult),
          principalReasons(item.fn as "arcsin" | "arccos", item.val, item.ans, wrongList, mult),
        );
      },
    },
    {
      id: "evaluating-arctan-special",
      figure: precalculusDrawings4["evaluating-expressions-containing-inverse-trigonometric-functions#evaluating-arctan-special"],
      title: t("Exact values of arctan", "反正切的精确值"),
      explanation: t(
        `The inverse tangent gives the angle whose tangent is $x$. Tangent repeats every $\\pi$, so many angles share a tangent, and the answer is the one strictly between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$. The special values are $0$, $\\pm\\frac{\\sqrt{3}}{3}$, $\\pm 1$ and $\\pm\\sqrt{3}$, at $0$, $\\pm\\frac{\\pi}{6}$, $\\pm\\frac{\\pi}{4}$ and $\\pm\\frac{\\pi}{3}$.

To find $3\\arctan\\left(-\\sqrt{3}\\right)$: tangent is $\\sqrt{3}$ at $\\frac{\\pi}{3}$, and tangent is odd, so the angle in the range with tangent $-\\sqrt{3}$ is $-\\frac{\\pi}{3}$. So

$$3\\arctan\\left(-\\sqrt{3}\\right) = 3 \\cdot \\left(-\\frac{\\pi}{3}\\right) = -\\pi$$

Check: $\\tan\\left(-\\frac{\\pi}{3}\\right) = -\\sqrt{3}$, and $-\\frac{\\pi}{3}$ lies in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$.

> **Watch out.** Arctangent of a negative number is a negative angle, not one in the second quadrant: $\\arctan(-1) = -\\frac{\\pi}{4}$, not $\\frac{3\\pi}{4}$. And $\\arctan 0 = 0$, not $\\pi$.`,
        `反正切给出正切为 $x$ 的角。正切每隔 $\\pi$ 重复一次，所以许多角的正切相同，答案取严格位于 $-\\frac{\\pi}{2}$ 与 $\\frac{\\pi}{2}$ 之间的那个。特殊值是 $0$、$\\pm\\frac{\\sqrt{3}}{3}$、$\\pm 1$ 和 $\\pm\\sqrt{3}$，对应 $0$、$\\pm\\frac{\\pi}{6}$、$\\pm\\frac{\\pi}{4}$ 和 $\\pm\\frac{\\pi}{3}$。

求 $3\\arctan\\left(-\\sqrt{3}\\right)$：正切在 $\\frac{\\pi}{3}$ 处为 $\\sqrt{3}$，而正切是奇函数，所以值域内正切为 $-\\sqrt{3}$ 的角是 $-\\frac{\\pi}{3}$。所以

$$3\\arctan\\left(-\\sqrt{3}\\right) = 3 \\cdot \\left(-\\frac{\\pi}{3}\\right) = -\\pi$$

检验：$\\tan\\left(-\\frac{\\pi}{3}\\right) = -\\sqrt{3}$，且 $-\\frac{\\pi}{3}$ 在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 内。

> **注意。** 负数的反正切是负角，而不是第二象限的角：$\\arctan(-1) = -\\frac{\\pi}{4}$，不是 $\\frac{3\\pi}{4}$。$\\arctan 0 = 0$，不是 $\\pi$。`,
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0" },
          { val: "\\frac{\\sqrt{3}}{3}", ans: "\\frac{\\pi}{6}" },
          { val: "1", ans: "\\frac{\\pi}{4}" },
          { val: "\\sqrt{3}", ans: "\\frac{\\pi}{3}" },
          { val: "-\\frac{\\sqrt{3}}{3}", ans: "-\\frac{\\pi}{6}" },
          { val: "-1", ans: "-\\frac{\\pi}{4}" },
          { val: "-\\sqrt{3}", ans: "-\\frac{\\pi}{3}" },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `\\arctan\\left(${item.val}\\right)` : `${mult}\\arctan\\left(${item.val}\\right)`;
        const ansStr = scalePi(item.ans, mult);
        const wrongList = [
          "0",
          "\\frac{\\pi}{6}",
          "\\frac{\\pi}{4}",
          "\\frac{\\pi}{3}",
          "-\\frac{\\pi}{6}",
          "-\\frac{\\pi}{4}",
          "-\\frac{\\pi}{3}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => `$${scalePi(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          principal("arctan", item.val, item.ans, mult),
          principalReasons("arctan", item.val, item.ans, wrongList, mult),
        );
      },
    },
  ],
};

// ─── 4.9.5 Further evaluating expressions containing inverse trig ───────────

/** furtherEvaluatingExpressionsContainingInverseTrigonometricFunctions covers compositions. */
export const furtherEvaluatingExpressionsContainingInverseTrigonometricFunctions: TopicDef = {
  id: "further-evaluating-expressions-containing-inverse-trigonometric-functions",
  title: t("Further Evaluating Expressions Containing Inverse Trigonometric Functions", "进一步求含反三角函数表达式的值"),
  summary: t(
    "Evaluate compositions of trigonometric and inverse trigonometric functions, including angles outside the principal branch.",
    "求三角函数与反三角函数的复合表达式的值，包括角位于主值区间外的情形。",
  ),
  prerequisites: ["evaluating-expressions-containing-inverse-trigonometric-functions"],
  encompasses: [{ topic: "evaluating-expressions-containing-inverse-trigonometric-functions", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.B.6"],
  intro: t(
    `A trigonometric function of an inverse one need not be a special value, but a right triangle finds it. In $\\tan\\left(\\arcsin\\frac{5}{13}\\right)$, the angle $\\theta = \\arcsin\\frac{5}{13}$ is acute with opposite side $5$ and hypotenuse $13$, so the adjacent side is $\\sqrt{13^{2} - 5^{2}} = 12$ and $\\tan\\theta = \\frac{5}{12}$.

Check: $\\left(\\frac{5}{13}\\right)^{2} + \\left(\\frac{12}{13}\\right)^{2} = \\frac{25 + 144}{169} = 1$, so the sine and cosine fit the Pythagorean identity.

In the other order the principal range decides: $\\arccos\\left(\\cos\\frac{4\\pi}{3}\\right) = \\frac{2\\pi}{3}$, not $\\frac{4\\pi}{3}$, because arccosine answers only in $[0, \\pi]$.

In this lesson we evaluate trigonometric functions of inverse ones with reference triangles, inverse functions of angles outside their principal range, and the tangent of a sum of two inverse tangents.`,
    `三角函数作用在反三角函数上，结果不一定是特殊值，但可以用直角三角形求出。在 $\\tan\\left(\\arcsin\\frac{5}{13}\\right)$ 中，角 $\\theta = \\arcsin\\frac{5}{13}$ 是锐角，对边为 $5$，斜边为 $13$，所以邻边是 $\\sqrt{13^{2} - 5^{2}} = 12$，$\\tan\\theta = \\frac{5}{12}$。

检验：$\\left(\\frac{5}{13}\\right)^{2} + \\left(\\frac{12}{13}\\right)^{2} = \\frac{25 + 144}{169} = 1$，正弦和余弦符合勾股恒等式。

反过来的顺序由主值区间决定：$\\arccos\\left(\\cos\\frac{4\\pi}{3}\\right) = \\frac{2\\pi}{3}$，不是 $\\frac{4\\pi}{3}$，因为反余弦的答案只在 $[0, \\pi]$ 内。

这节课我们用参考三角形求反三角函数的三角函数值，求主值区间外的角的反三角函数值，并求两个反正切之和的正切。`,
  ),
  knowledgePoints: [
    {
      id: "compositions-using-reference-triangles",
      figure:
        precalculusDrawings4[
          "further-evaluating-expressions-containing-inverse-trigonometric-functions#compositions-using-reference-triangles"
        ],
      title: t("Evaluating trig of inverse trig using triangles", "借助参考直角三角形计算复合三角值"),
      explanation: t(
        `For a positive number, arcsine and arccosine give an acute angle, so the angle fits in a right triangle with positive sides. The number inside gives two sides, the Pythagorean theorem gives the third, and the triangle then gives every ratio of the angle.

To find $\\sin\\left(\\arccos\\frac{8}{17}\\right)$, let $\\theta = \\arccos\\frac{8}{17}$, so $\\cos\\theta = \\frac{8}{17}$: the adjacent side is $8$ and the hypotenuse $17$. The opposite side is

$$\\sqrt{17^{2} - 8^{2}} = \\sqrt{225} = 15$$

so $\\sin\\theta = \\frac{15}{17}$. Check: $8^{2} + 15^{2} = 64 + 225 = 289 = 17^{2}$.

> **Watch out.** Put the number on the right sides. For arccosine it is adjacent over hypotenuse, for arcsine opposite over hypotenuse. And tangent is opposite over adjacent, so the hypotenuse does not appear in it.`,
        `对正数，反正弦和反余弦给出锐角，所以这个角可以放进边长为正的直角三角形。里面的数给出两条边，勾股定理给出第三条边，三角形再给出这个角的每个三角比。

求 $\\sin\\left(\\arccos\\frac{8}{17}\\right)$：设 $\\theta = \\arccos\\frac{8}{17}$，则 $\\cos\\theta = \\frac{8}{17}$：邻边为 $8$，斜边为 $17$。对边是

$$\\sqrt{17^{2} - 8^{2}} = \\sqrt{225} = 15$$

所以 $\\sin\\theta = \\frac{15}{17}$。检验：$8^{2} + 15^{2} = 64 + 225 = 289 = 17^{2}$。

> **注意。** 把数放在正确的边上。反余弦是邻边比斜边，反正弦是对边比斜边。正切是对边比邻边，其中没有斜边。`,
      ),
      generate(rng) {
        const triplesList = [
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const;
        const [a, b, c] = rng.pick(triplesList);
        const outer = rng.pick(["sin", "cos", "tan"] as const);
        const inner = rng.pick(["arccos", "arcsin"] as const);
        let ansNum = 0;
        let ansDen = 1;
        if (inner === "arccos") {
          // cos(θ) = b/c, so adjacent = b, hypotenuse = c, opposite = a
          if (outer === "sin") {
            ansNum = a;
            ansDen = c;
          } else if (outer === "cos") {
            ansNum = b;
            ansDen = c;
          } else {
            ansNum = a;
            ansDen = b;
          }
        } else {
          // sin(θ) = a/c, so opposite = a, hypotenuse = c, adjacent = b
          if (outer === "sin") {
            ansNum = a;
            ansDen = c;
          } else if (outer === "cos") {
            ansNum = b;
            ansDen = c;
          } else {
            ansNum = a;
            ansDen = b;
          }
        }
        const ans = Q.of(ansNum, ansDen);
        const wrong = [Q.of(ansDen, ansNum), Q.of(b, c), Q.of(a, b)].filter((w) => !w.eq(ans));
        const known = inner === "arccos" ? b : a;
        const missing = inner === "arccos" ? a : b;
        const side = inner === "arccos" ? t("adjacent side", "邻边") : t("opposite side", "对边");
        const other = inner === "arccos" ? t("opposite side", "对边") : t("adjacent side", "邻边");
        const ratio = {
          sin: t("opposite over hypotenuse", "对边比斜边"),
          cos: t("adjacent over hypotenuse", "邻边比斜边"),
          tan: t("opposite over adjacent", "对边比邻边"),
        }[outer];
        return numberProblem({
          prompt: t(
            `Find the exact value of $\\${outer}\\left(\\${inner}\\left(\\frac{${inner === "arccos" ? b : a}}{${c}}\\right)\\right)$.`,
            `求 $\\${outer}\\left(\\${inner}\\left(\\frac{${inner === "arccos" ? b : a}}{${c}}\\right)\\right)$ 的精确值。`,
          ),
          answer: ans,
          wrong,
          solution: walked(
            [
              [
                ["Name the angle", "设出角"],
                t(
                  `Let $\\theta = \\${inner}\\left(\\frac{${known}}{${c}}\\right)$. It is acute, and $\\${inner === "arccos" ? "cos" : "sin"}\\theta = \\frac{${known}}{${c}}$, so in a right triangle the ${side.en} is $${known}$ and the hypotenuse is $${c}$.`,
                  `设 $\\theta = \\${inner}\\left(\\frac{${known}}{${c}}\\right)$。它是锐角，且 $\\${inner === "arccos" ? "cos" : "sin"}\\theta = \\frac{${known}}{${c}}$，所以在直角三角形中${side["zh-CN"]}为 $${known}$，斜边为 $${c}$。`,
                ),
              ],
              [
                ["Find the third side", "求第三边"],
                t(`By the Pythagorean theorem, the ${other.en} is`, `由勾股定理，${other["zh-CN"]}是`),
                [`\\sqrt{${c}^{2} - ${known}^{2}} = \\sqrt{${c * c - known * known}} = ${missing}`],
              ],
              [
                ["Read off the ratio", "读出比值"],
                t(`$\\${outer}\\theta$ is ${ratio.en}:`, `$\\${outer}\\theta$ 是${ratio["zh-CN"]}：`),
                [`\\${outer}\\theta = \\frac{${ansNum}}{${ansDen}}`],
              ],
            ],
            t(
              `$${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${c * c} = ${c}^{2}$, so the sides fit a right triangle, and $\\theta$ is acute, so its ${outer === "sin" ? "sine" : outer === "cos" ? "cosine" : "tangent"} is positive.`,
              `$${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${c * c} = ${c}^{2}$，三边构成直角三角形；$\\theta$ 是锐角，所以它的${outer === "sin" ? "正弦" : outer === "cos" ? "余弦" : "正切"}为正。`,
            ),
          ),
          form: "fraction",
        });
      },
    },
    {
      id: "evaluating-inverse-trig-outside-principal-range",
      figure:
        precalculusDrawings4[
          "further-evaluating-expressions-containing-inverse-trigonometric-functions#evaluating-inverse-trig-outside-principal-range"
        ],
      title: t("Inverse trig of trig outside principal range", "主值区间外的反三角复合值"),
      explanation: t(
        `An inverse trigonometric function always returns an angle in its principal range. So while $\\sin(\\arcsin x) = x$ for every $x$ in $[-1, 1]$, the other order $\\arcsin(\\sin\\theta) = \\theta$ holds **only** when $\\theta$ is already in $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$. Otherwise evaluate the inside first, then find the angle in the range with that value.

For $\\arccos\\left(\\cos\\frac{5\\pi}{3}\\right)$: first $\\cos\\frac{5\\pi}{3} = \\frac{1}{2}$, and the angle in $[0, \\pi]$ with cosine $\\frac{1}{2}$ is $\\frac{\\pi}{3}$:

$$\\arccos\\left(\\cos\\frac{5\\pi}{3}\\right) = \\arccos\\frac{1}{2} = \\frac{\\pi}{3}$$

Check: $\\cos\\frac{\\pi}{3} = \\frac{1}{2} = \\cos\\frac{5\\pi}{3}$, and $\\frac{\\pi}{3}$ lies in $[0, \\pi]$.

> **Watch out.** The answer is never the angle you started with when that angle is outside the range, and the sign comes from the inside value: $\\arcsin\\left(\\sin\\frac{7\\pi}{6}\\right) = -\\frac{\\pi}{6}$, negative, because $\\sin\\frac{7\\pi}{6} = -\\frac{1}{2}$.`,
        `反三角函数总是返回主值区间内的角。所以虽然对 $[-1, 1]$ 中的每个 $x$ 都有 $\\sin(\\arcsin x) = x$，反过来的 $\\arcsin(\\sin\\theta) = \\theta$ **仅**在 $\\theta$ 本来就在 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 内时成立。否则先算里面，再找值域内具有这个值的角。

对 $\\arccos\\left(\\cos\\frac{5\\pi}{3}\\right)$：先算 $\\cos\\frac{5\\pi}{3} = \\frac{1}{2}$，$[0, \\pi]$ 中余弦为 $\\frac{1}{2}$ 的角是 $\\frac{\\pi}{3}$：

$$\\arccos\\left(\\cos\\frac{5\\pi}{3}\\right) = \\arccos\\frac{1}{2} = \\frac{\\pi}{3}$$

检验：$\\cos\\frac{\\pi}{3} = \\frac{1}{2} = \\cos\\frac{5\\pi}{3}$，且 $\\frac{\\pi}{3}$ 在 $[0, \\pi]$ 内。

> **注意。** 原来的角在值域外时，答案绝不是这个角；符号由里面的值决定：$\\arcsin\\left(\\sin\\frac{7\\pi}{6}\\right) = -\\frac{\\pi}{6}$，是负的，因为 $\\sin\\frac{7\\pi}{6} = -\\frac{1}{2}$。`,
      ),
      generate(rng) {
        const item = rng.pick([
          { expr: "\\arcsin\\left(\\sin\\left(\\frac{5\\pi}{6}\\right)\\right)", ans: "\\frac{\\pi}{6}" },
          { expr: "\\arcsin\\left(\\sin\\left(\\frac{7\\pi}{6}\\right)\\right)", ans: "-\\frac{\\pi}{6}" },
          { expr: "\\arcsin\\left(\\sin\\left(\\frac{3\\pi}{4}\\right)\\right)", ans: "\\frac{\\pi}{4}" },
          { expr: "\\arcsin\\left(\\sin\\left(\\frac{5\\pi}{4}\\right)\\right)", ans: "-\\frac{\\pi}{4}" },
          { expr: "\\arcsin\\left(\\sin\\left(\\frac{2\\pi}{3}\\right)\\right)", ans: "\\frac{\\pi}{3}" },
          { expr: "\\arcsin\\left(\\sin\\left(\\frac{4\\pi}{3}\\right)\\right)", ans: "-\\frac{\\pi}{3}" },
          { expr: "\\arccos\\left(\\cos\\left(\\frac{4\\pi}{3}\\right)\\right)", ans: "\\frac{2\\pi}{3}" },
          { expr: "\\arccos\\left(\\cos\\left(\\frac{5\\pi}{3}\\right)\\right)", ans: "\\frac{\\pi}{3}" },
          { expr: "\\arccos\\left(\\cos\\left(\\frac{7\\pi}{4}\\right)\\right)", ans: "\\frac{\\pi}{4}" },
          { expr: "\\arccos\\left(\\cos\\left(-\\frac{\\pi}{6}\\right)\\right)", ans: "\\frac{\\pi}{6}" },
          { expr: "\\arccos\\left(\\cos\\left(\\frac{7\\pi}{6}\\right)\\right)", ans: "\\frac{5\\pi}{6}" },
          { expr: "\\arctan\\left(\\tan\\left(\\frac{3\\pi}{4}\\right)\\right)", ans: "-\\frac{\\pi}{4}" },
          { expr: "\\arctan\\left(\\tan\\left(\\frac{5\\pi}{6}\\right)\\right)", ans: "-\\frac{\\pi}{6}" },
          { expr: "\\arctan\\left(\\tan\\left(\\frac{4\\pi}{3}\\right)\\right)", ans: "\\frac{\\pi}{3}" },
          { expr: "\\arctan\\left(\\tan\\left(\\frac{7\\pi}{6}\\right)\\right)", ans: "\\frac{\\pi}{6}" },
        ]);
        const mult = rng.pick([1, 2, 3]);
        const promptStr = mult === 1 ? item.expr : `${mult}\\left(${item.expr}\\right)`;
        const ansStr = scalePi(item.ans, mult);
        const wrongList = [
          "\\frac{\\pi}{6}",
          "\\frac{\\pi}{4}",
          "\\frac{\\pi}{3}",
          "-\\frac{\\pi}{6}",
          "-\\frac{\\pi}{4}",
          "-\\frac{\\pi}{3}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => `$${scalePi(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          outsideRange(item.expr, item.ans, mult),
          outsideReasons(item.expr, item.ans, wrongList, mult),
        );
      },
    },
  ],
};

// ─── 4.10.1 Simplifying expressions using basic identities ─────────────────

/** simplifyingExpressionsUsingBasicTrigonometricIdentities simplifies with reciprocal & quotient identities. */
export const simplifyingExpressionsUsingBasicTrigonometricIdentities: TopicDef = {
  id: "simplifying-expressions-using-basic-trigonometric-identities",
  title: t("Simplifying Expressions Using Basic Trigonometric Identities", "利用基本三角恒等式化简表达式"),
  summary: t(
    "Simplify trigonometric products and quotients using reciprocal identities (csc = 1/sin, sec = 1/cos, cot = 1/tan) and quotient identities (tan = sin/cos, cot = cos/sin).",
    "利用倒数关系与商数关系化简三角函数的乘积与分式。",
  ),
  prerequisites: ["further-extensions-of-the-special-trigonometric-ratios"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.TF.C.8"],
  intro: t(
    `Every trigonometric function can be written with sine and cosine alone:

$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}, \\quad \\csc\\theta = \\frac{1}{\\sin\\theta}$$

Written this way, an expression often shows factors that cancel. For example,

$$\\sec\\theta\\cot\\theta = \\frac{1}{\\cos\\theta} \\cdot \\frac{\\cos\\theta}{\\sin\\theta} = \\frac{1}{\\sin\\theta} = \\csc\\theta$$

Check: at $\\theta = 30^{\\circ}$, $\\sec 30^{\\circ} \\cot 30^{\\circ} = \\frac{2}{\\sqrt{3}} \\cdot \\sqrt{3} = 2$, and $\\csc 30^{\\circ} = \\frac{1}{1/2} = 2$.

In this lesson we simplify products and fractions of trigonometric functions with the reciprocal and quotient identities.`,
    `每个三角函数都可以只用正弦和余弦来写：

$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}, \\quad \\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}, \\quad \\csc\\theta = \\frac{1}{\\sin\\theta}$$

这样写之后，式子中常常出现可以约去的因式。例如

$$\\sec\\theta\\cot\\theta = \\frac{1}{\\cos\\theta} \\cdot \\frac{\\cos\\theta}{\\sin\\theta} = \\frac{1}{\\sin\\theta} = \\csc\\theta$$

检验：当 $\\theta = 30^{\\circ}$ 时，$\\sec 30^{\\circ} \\cot 30^{\\circ} = \\frac{2}{\\sqrt{3}} \\cdot \\sqrt{3} = 2$，而 $\\csc 30^{\\circ} = \\frac{1}{1/2} = 2$。

这节课我们用倒数关系和商数关系化简三角函数的乘积与分式。`,
  ),
  knowledgePoints: [
    {
      id: "reciprocal-and-quotient-products",
      title: t("Products of reciprocal and quotient expressions", "倒数与商关系的乘积"),
      explanation: t(
        `Tangent, cotangent, secant and cosecant are all built from sine and cosine, so rewriting them shows which factors cancel:

- $\\tan x = \\frac{\\sin x}{\\cos x}$ and $\\cot x = \\frac{\\cos x}{\\sin x}$
- $\\sec x = \\frac{1}{\\cos x}$ and $\\csc x = \\frac{1}{\\sin x}$

For $3\\cot x \\sin x$:

$$3\\cot x \\sin x = 3 \\cdot \\frac{\\cos x}{\\sin x} \\cdot \\sin x = 3\\cos x$$

Check: at $x = 60^{\\circ}$, $3\\cot 60^{\\circ} \\sin 60^{\\circ} = 3 \\cdot \\frac{\\sqrt{3}}{3} \\cdot \\frac{\\sqrt{3}}{2} = \\frac{3}{2}$, and $3\\cos 60^{\\circ} = \\frac{3}{2}$.

> **Watch out.** Only a function times its own reciprocal gives $1$: $\\sin x \\csc x = 1$, but $\\tan x \\cos x = \\sin x$. Keep the coefficient in front through every step.`,
        `正切、余切、正割和余割都由正弦和余弦构成，所以改写之后就能看出哪些因式可以约去：

- $\\tan x = \\frac{\\sin x}{\\cos x}$，$\\cot x = \\frac{\\cos x}{\\sin x}$
- $\\sec x = \\frac{1}{\\cos x}$，$\\csc x = \\frac{1}{\\sin x}$

对 $3\\cot x \\sin x$：

$$3\\cot x \\sin x = 3 \\cdot \\frac{\\cos x}{\\sin x} \\cdot \\sin x = 3\\cos x$$

检验：当 $x = 60^{\\circ}$ 时，$3\\cot 60^{\\circ} \\sin 60^{\\circ} = 3 \\cdot \\frac{\\sqrt{3}}{3} \\cdot \\frac{\\sqrt{3}}{2} = \\frac{3}{2}$，而 $3\\cos 60^{\\circ} = \\frac{3}{2}$。

> **注意。** 只有函数乘以它自己的倒数才得 $1$：$\\sin x \\csc x = 1$，但 $\\tan x \\cos x = \\sin x$。前面的系数要在每一步都保留。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "\\beta", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const kTex = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${kTex}\\tan(${v})\\cos(${v})`,
            ans: `${kTex}\\sin(${v})`,
            wrong: [`${kTex}\\cos(${v})`, `${kTex}\\cot(${v})`, "1"],
            use: `\\tan(${v}) = \\frac{\\sin(${v})}{\\cos(${v})}`,
            mid: `${kTex}\\frac{\\sin(${v})}{\\cos(${v})} \\cdot \\cos(${v})`,
            f: (x: number) => k * Math.tan(x) * Math.cos(x),
            g: (x: number) => k * Math.sin(x),
            why: [
              ["The cosine cancels, leaving the sine from the numerator of the tangent.", "余弦约去了，剩下的是正切分子中的正弦。"],
              ["Cotangent is cosine over sine, but this tangent is sine over cosine.", "余切是余弦比正弦，而这里的正切是正弦比余弦。"],
              [
                "Only a function times its own reciprocal cancels completely, and cosine is not the reciprocal of tangent.",
                "只有函数乘以它自己的倒数才能完全约去，余弦不是正切的倒数。",
              ],
            ],
          },
          {
            expr: `${kTex}\\cot(${v})\\sin(${v})`,
            ans: `${kTex}\\cos(${v})`,
            wrong: [`${kTex}\\sin(${v})`, `${kTex}\\tan(${v})`, "1"],
            use: `\\cot(${v}) = \\frac{\\cos(${v})}{\\sin(${v})}`,
            mid: `${kTex}\\frac{\\cos(${v})}{\\sin(${v})} \\cdot \\sin(${v})`,
            f: (x: number) => (k * Math.sin(x)) / Math.tan(x),
            g: (x: number) => k * Math.cos(x),
            why: [
              ["The sine cancels, leaving the cosine from the numerator of the cotangent.", "正弦约去了，剩下的是余切分子中的余弦。"],
              ["Tangent is sine over cosine, but this cotangent is cosine over sine.", "正切是正弦比余弦，而这里的余切是余弦比正弦。"],
              [
                "Only a function times its own reciprocal cancels completely, and sine is not the reciprocal of cotangent.",
                "只有函数乘以它自己的倒数才能完全约去，正弦不是余切的倒数。",
              ],
            ],
          },
          {
            expr: `${kTex}\\sin(${v})\\csc(${v})`,
            ans: `${k}`,
            wrong: ["0", `${kTex}\\cos(${v})`, "-1"],
            use: `\\csc(${v}) = \\frac{1}{\\sin(${v})}`,
            mid: `${kTex}\\sin(${v}) \\cdot \\frac{1}{\\sin(${v})}`,
            f: (x: number) => (k * Math.sin(x)) / Math.sin(x),
            g: () => k,
            why: [
              ["The two factors are reciprocals, so they cancel to $1$, not to $0$.", "两个因式互为倒数，约去后得 $1$，不是 $0$。"],
              ["Cosecant is the reciprocal of sine, so no cosine appears.", "余割是正弦的倒数，所以不会出现余弦。"],
              ["Sine and cosecant always have the same sign, so their product is positive.", "正弦和余割总是同号，所以它们的积是正的。"],
            ],
          },
          {
            expr: `${kTex}\\cos(${v})\\sec(${v})`,
            ans: `${k}`,
            wrong: ["0", `${kTex}\\sin(${v})`, "-1"],
            use: `\\sec(${v}) = \\frac{1}{\\cos(${v})}`,
            mid: `${kTex}\\cos(${v}) \\cdot \\frac{1}{\\cos(${v})}`,
            f: (x: number) => (k * Math.cos(x)) / Math.cos(x),
            g: () => k,
            why: [
              ["The two factors are reciprocals, so they cancel to $1$, not to $0$.", "两个因式互为倒数，约去后得 $1$，不是 $0$。"],
              ["Secant is the reciprocal of cosine, so no sine appears.", "正割是余弦的倒数，所以不会出现正弦。"],
              ["Cosine and secant always have the same sign, so their product is positive.", "余弦和正割总是同号，所以它们的积是正的。"],
            ],
          },
          {
            expr: `${kTex}\\tan(${v})\\cot(${v})`,
            ans: `${k}`,
            wrong: ["0", `${kTex}\\sec(${v})`, "-1"],
            use: `\\cot(${v}) = \\frac{1}{\\tan(${v})}`,
            mid: `${kTex}\\tan(${v}) \\cdot \\frac{1}{\\tan(${v})}`,
            f: (x: number) => (k * Math.tan(x)) / Math.tan(x),
            g: () => k,
            why: [
              ["The two factors are reciprocals, so they cancel to $1$, not to $0$.", "两个因式互为倒数，约去后得 $1$，不是 $0$。"],
              [
                "Cotangent is the reciprocal of tangent, so the product is a number, with no secant left.",
                "余切是正切的倒数，所以积是一个数，不会剩下正割。",
              ],
              [
                "Tangent and cotangent always have the same sign, so their product is positive.",
                "正切和余切总是同号，所以它们的积是正的。",
              ],
            ],
          },
          {
            expr: `${kTex}\\frac{\\sin(${v})}{\\tan(${v})}`,
            ans: `${kTex}\\cos(${v})`,
            wrong: [`${kTex}\\sin(${v})`, "1", `${kTex}\\sec(${v})`],
            use: `\\tan(${v}) = \\frac{\\sin(${v})}{\\cos(${v})}`,
            mid: `${kTex}\\sin(${v}) \\cdot \\frac{\\cos(${v})}{\\sin(${v})}`,
            f: (x: number) => (k * Math.sin(x)) / Math.tan(x),
            g: (x: number) => k * Math.cos(x),
            why: [
              [
                "Dividing by the tangent multiplies by $\\frac{\\cos}{\\sin}$, so the sine cancels.",
                "除以正切就是乘以 $\\frac{\\cos}{\\sin}$，所以正弦约去了。",
              ],
              ["Sine and tangent are different functions, so their quotient is not $1$.", "正弦和正切是不同的函数，所以它们的商不是 $1$。"],
              [
                "Dividing by the tangent puts the cosine in the numerator, not in the denominator.",
                "除以正切会把余弦放到分子上，而不是分母上。",
              ],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, 1, t("Write the expression in sine and cosine, using", "用下式把式子写成正弦和余弦：")),
          rewriteReasons(item),
        );
      },
    },
    {
      id: "simplifying-trig-fractions",
      title: t("Simplifying trigonometric fractions", "化简三角分式"),
      explanation: t(
        `Once everything is written in sine and cosine, a fraction of trigonometric functions is a fraction of fractions, and dividing by a fraction multiplies by its reciprocal. For $\\frac{\\tan\\theta}{\\sec\\theta}$:

$$\\frac{\\tan\\theta}{\\sec\\theta} = \\frac{\\sin\\theta}{\\cos\\theta} \\cdot \\cos\\theta = \\sin\\theta$$

Check: at $\\theta = 60^{\\circ}$, $\\frac{\\tan 60^{\\circ}}{\\sec 60^{\\circ}} = \\frac{\\sqrt{3}}{2}$, and $\\sin 60^{\\circ} = \\frac{\\sqrt{3}}{2}$.

> **Watch out.** Dividing by a reciprocal function multiplies by the function itself: dividing by $\\csc\\theta$ multiplies by $\\sin\\theta$. Mixing up which function ends on top turns $\\tan$ into $\\cot$, or $\\sec$ into $\\cos$.`,
        `把一切都写成正弦和余弦之后，三角函数的分式就是分式的分式，而除以一个分式就是乘以它的倒数。对 $\\frac{\\tan\\theta}{\\sec\\theta}$：

$$\\frac{\\tan\\theta}{\\sec\\theta} = \\frac{\\sin\\theta}{\\cos\\theta} \\cdot \\cos\\theta = \\sin\\theta$$

检验：当 $\\theta = 60^{\\circ}$ 时，$\\frac{\\tan 60^{\\circ}}{\\sec 60^{\\circ}} = \\frac{\\sqrt{3}}{2}$，而 $\\sin 60^{\\circ} = \\frac{\\sqrt{3}}{2}$。

> **注意。** 除以一个倒数函数，就是乘以那个函数本身：除以 $\\csc\\theta$ 就是乘以 $\\sin\\theta$。把哪个函数在上面弄混，就会把 $\\tan$ 写成 $\\cot$，或把 $\\sec$ 写成 $\\cos$。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "\\beta", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const kTex = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${kTex}\\frac{\\sec ${v}}{\\csc ${v}}`,
            ans: `${kTex}\\tan ${v}`,
            wrong: [`${kTex}\\cot ${v}`, "1", `${kTex}\\cos ${v}`],
            use: `\\sec ${v} = \\frac{1}{\\cos ${v}}, \\quad \\csc ${v} = \\frac{1}{\\sin ${v}}`,
            mid: `${kTex}\\frac{1}{\\cos ${v}} \\cdot \\sin ${v}`,
            f: (x: number) => (k * Math.sin(x)) / Math.cos(x),
            g: (x: number) => k * Math.tan(x),
            why: [
              [
                "Secant over cosecant is sine over cosine, the tangent; cotangent is the other way up.",
                "正割比余割是正弦比余弦，即正切；余切是倒过来的。",
              ],
              [
                "Secant and cosecant are different functions, so their quotient is not $1$.",
                "正割和余割是不同的函数，所以它们的商不是 $1$。",
              ],
              ["Dividing by the cosecant multiplies by the sine, so a sine stays on top.", "除以余割就是乘以正弦，所以分子上留下正弦。"],
            ],
          },
          {
            expr: `${kTex}\\frac{\\csc ${v}}{\\sec ${v}}`,
            ans: `${kTex}\\cot ${v}`,
            wrong: [`${kTex}\\tan ${v}`, "1", `${kTex}\\sin ${v}`],
            use: `\\csc ${v} = \\frac{1}{\\sin ${v}}, \\quad \\sec ${v} = \\frac{1}{\\cos ${v}}`,
            mid: `${kTex}\\frac{1}{\\sin ${v}} \\cdot \\cos ${v}`,
            f: (x: number) => (k * Math.cos(x)) / Math.sin(x),
            g: (x: number) => k / Math.tan(x),
            why: [
              [
                "Cosecant over secant is cosine over sine, the cotangent; tangent is the other way up.",
                "余割比正割是余弦比正弦，即余切；正切是倒过来的。",
              ],
              [
                "Cosecant and secant are different functions, so their quotient is not $1$.",
                "余割和正割是不同的函数，所以它们的商不是 $1$。",
              ],
              [
                "Dividing by the secant multiplies by the cosine, so a cosine stays on top, over a sine.",
                "除以正割就是乘以余弦，所以分子上留下余弦，分母是正弦。",
              ],
            ],
          },
          {
            expr: `${kTex}\\frac{\\tan ${v}}{\\sin ${v}}`,
            ans: `${kTex}\\sec ${v}`,
            wrong: [`${kTex}\\csc ${v}`, `${kTex}\\cos ${v}`, "1"],
            use: `\\tan ${v} = \\frac{\\sin ${v}}{\\cos ${v}}`,
            mid: `${kTex}\\frac{\\sin ${v}}{\\cos ${v}} \\cdot \\frac{1}{\\sin ${v}} = ${kTex}\\frac{1}{\\cos ${v}}`,
            f: (x: number) => (k * Math.tan(x)) / Math.sin(x),
            g: (x: number) => k / Math.cos(x),
            why: [
              [
                "The sine cancels and $\\frac{1}{\\cos}$ is left, which is secant; cosecant is $\\frac{1}{\\sin}$.",
                "正弦约去后剩下 $\\frac{1}{\\cos}$，即正割；余割是 $\\frac{1}{\\sin}$。",
              ],
              [
                "What is left is $\\frac{1}{\\cos}$, the reciprocal of cosine, not cosine itself.",
                "剩下的是 $\\frac{1}{\\cos}$，是余弦的倒数，不是余弦本身。",
              ],
              ["Tangent and sine are different functions, so their quotient is not $1$.", "正切和正弦是不同的函数，所以它们的商不是 $1$。"],
            ],
          },
          {
            expr: `${kTex}\\frac{\\cot ${v}}{\\cos ${v}}`,
            ans: `${kTex}\\csc ${v}`,
            wrong: [`${kTex}\\sec ${v}`, `${kTex}\\sin ${v}`, "1"],
            use: `\\cot ${v} = \\frac{\\cos ${v}}{\\sin ${v}}`,
            mid: `${kTex}\\frac{\\cos ${v}}{\\sin ${v}} \\cdot \\frac{1}{\\cos ${v}} = ${kTex}\\frac{1}{\\sin ${v}}`,
            f: (x: number) => k / Math.tan(x) / Math.cos(x),
            g: (x: number) => k / Math.sin(x),
            why: [
              [
                "The cosine cancels and $\\frac{1}{\\sin}$ is left, which is cosecant; secant is $\\frac{1}{\\cos}$.",
                "余弦约去后剩下 $\\frac{1}{\\sin}$，即余割；正割是 $\\frac{1}{\\cos}$。",
              ],
              [
                "What is left is $\\frac{1}{\\sin}$, the reciprocal of sine, not sine itself.",
                "剩下的是 $\\frac{1}{\\sin}$，是正弦的倒数，不是正弦本身。",
              ],
              [
                "Cotangent and cosine are different functions, so their quotient is not $1$.",
                "余切和余弦是不同的函数，所以它们的商不是 $1$。",
              ],
            ],
          },
          {
            expr: `${kTex}\\sin ${v}\\sec ${v}`,
            ans: `${kTex}\\tan ${v}`,
            wrong: [`${kTex}\\cot ${v}`, "1", `${kTex}\\cos ${v}`],
            use: `\\sec ${v} = \\frac{1}{\\cos ${v}}`,
            mid: `${kTex}\\sin ${v} \\cdot \\frac{1}{\\cos ${v}} = ${kTex}\\frac{\\sin ${v}}{\\cos ${v}}`,
            f: (x: number) => (k * Math.sin(x)) / Math.cos(x),
            g: (x: number) => k * Math.tan(x),
            why: [
              ["Sine over cosine is the tangent; cotangent is cosine over sine.", "正弦比余弦是正切；余切是余弦比正弦。"],
              [
                "Sine and secant are not reciprocals, so the product does not cancel to a number.",
                "正弦和正割不互为倒数，所以积不会约成一个数。",
              ],
              ["Multiplying by the secant divides by the cosine, so the cosine ends up below.", "乘以正割就是除以余弦，所以余弦在分母上。"],
            ],
          },
          {
            expr: `${kTex}\\cos ${v}\\csc ${v}`,
            ans: `${kTex}\\cot ${v}`,
            wrong: [`${kTex}\\tan ${v}`, "1", `${kTex}\\sin ${v}`],
            use: `\\csc ${v} = \\frac{1}{\\sin ${v}}`,
            mid: `${kTex}\\cos ${v} \\cdot \\frac{1}{\\sin ${v}} = ${kTex}\\frac{\\cos ${v}}{\\sin ${v}}`,
            f: (x: number) => (k * Math.cos(x)) / Math.sin(x),
            g: (x: number) => k / Math.tan(x),
            why: [
              ["Cosine over sine is the cotangent; tangent is sine over cosine.", "余弦比正弦是余切；正切是正弦比余弦。"],
              [
                "Cosine and cosecant are not reciprocals, so the product does not cancel to a number.",
                "余弦和余割不互为倒数，所以积不会约成一个数。",
              ],
              ["Multiplying by the cosecant divides by the sine, so the sine ends up below.", "乘以余割就是除以正弦，所以正弦在分母上。"],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, 1, t("Write the expression in sine and cosine, using", "用下式把式子写成正弦和余弦：")),
          rewriteReasons(item),
        );
      },
    },
  ],
};

// ─── 4.10.2 Simplifying expressions using the Pythagorean identity ──────────

/** simplifyingExpressionsUsingThePythagoreanIdentity applies sin² + cos² = 1. */
export const simplifyingExpressionsUsingThePythagoreanIdentity: TopicDef = {
  id: "simplifying-expressions-using-the-pythagorean-identity",
  title: t("Simplifying Expressions Using the Pythagorean Identity", "利用勾股恒等式化简表达式"),
  summary: t(
    "Simplify expressions using the fundamental Pythagorean identity sin²(θ) + cos²(θ) = 1.",
    "利用基本的勾股（平方）恒等式 sin²(θ) + cos²(θ) = 1 化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-basic-trigonometric-identities", "extending-the-pythagorean-identity-to-all-quadrants"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  intro: t(
    `The point at angle $\\theta$ on the unit circle is $(\\cos\\theta, \\sin\\theta)$, at distance $1$ from the origin. By the Pythagorean theorem, then,

$$\\sin^{2}\\theta + \\cos^{2}\\theta = 1$$

for every angle. Rearranged, it trades one square for the other, $1 - \\sin^{2}\\theta = \\cos^{2}\\theta$, so for instance $\\frac{\\cos^{2}\\theta}{1 - \\sin^{2}\\theta} = 1$ whenever $\\cos\\theta \\ne 0$.

Check: at $\\theta = 30^{\\circ}$, $\\sin^{2} 30^{\\circ} + \\cos^{2} 30^{\\circ} = \\frac{1}{4} + \\frac{3}{4} = 1$.

In this lesson we simplify expressions with the Pythagorean identity, directly and in products of conjugates, and use it with the quadrant to find one ratio from another.`,
    `单位圆上角 $\\theta$ 对应的点是 $(\\cos\\theta, \\sin\\theta)$，它到原点的距离是 $1$。由勾股定理，

$$\\sin^{2}\\theta + \\cos^{2}\\theta = 1$$

对每个角都成立。变形之后，它可以把一个平方换成另一个：$1 - \\sin^{2}\\theta = \\cos^{2}\\theta$，所以例如只要 $\\cos\\theta \\ne 0$，就有 $\\frac{\\cos^{2}\\theta}{1 - \\sin^{2}\\theta} = 1$。

检验：当 $\\theta = 30^{\\circ}$ 时，$\\sin^{2} 30^{\\circ} + \\cos^{2} 30^{\\circ} = \\frac{1}{4} + \\frac{3}{4} = 1$。

这节课我们用勾股恒等式直接化简、化简共轭因式的积，并结合象限由一个三角比求另一个。`,
  ),
  knowledgePoints: [
    {
      id: "direct-pythagorean-simplification",
      title: t("Direct Pythagorean substitution", "直接利用平方关系代换"),
      explanation: t(
        `From $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$, taking either square away from $1$ leaves the other:

$$1 - \\sin^{2}\\theta = \\cos^{2}\\theta, \\quad 1 - \\cos^{2}\\theta = \\sin^{2}\\theta$$

This holds for any angle inside, so $1 - \\cos^{2}(2x) = \\sin^{2}(2x)$ as well. In a fraction:

$$\\frac{1 - \\cos^{2}(2x)}{\\sin(2x)} = \\frac{\\sin^{2}(2x)}{\\sin(2x)} = \\sin(2x)$$

Check: at $x = 15^{\\circ}$, $2x = 30^{\\circ}$, and $\\frac{1 - \\cos^{2} 30^{\\circ}}{\\sin 30^{\\circ}} = \\frac{1/4}{1/2} = \\frac{1}{2} = \\sin 30^{\\circ}$.

> **Watch out.** $1 - \\sin^{2}$ is $\\cos^{2}$, not $\\sin^{2}$ or $-\\cos^{2}$: it is never negative, since sine stays between $-1$ and $1$. And the angle inside must be the same: $\\sin^{2}(3x) + \\cos^{2}(3x) = 1$, but $\\sin^{2}(3x) + \\cos^{2} x$ is not $1$ in general.`,
        `由 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$，从 $1$ 中减去其中一个平方，剩下另一个：

$$1 - \\sin^{2}\\theta = \\cos^{2}\\theta, \\quad 1 - \\cos^{2}\\theta = \\sin^{2}\\theta$$

里面是任何角都成立，所以 $1 - \\cos^{2}(2x) = \\sin^{2}(2x)$ 也成立。在分式中：

$$\\frac{1 - \\cos^{2}(2x)}{\\sin(2x)} = \\frac{\\sin^{2}(2x)}{\\sin(2x)} = \\sin(2x)$$

检验：当 $x = 15^{\\circ}$ 时 $2x = 30^{\\circ}$，$\\frac{1 - \\cos^{2} 30^{\\circ}}{\\sin 30^{\\circ}} = \\frac{1/4}{1/2} = \\frac{1}{2} = \\sin 30^{\\circ}$。

> **注意。** $1 - \\sin^{2}$ 是 $\\cos^{2}$，不是 $\\sin^{2}$ 或 $-\\cos^{2}$：它永远不是负的，因为正弦在 $-1$ 和 $1$ 之间。里面的角必须相同：$\\sin^{2}(3x) + \\cos^{2}(3x) = 1$，但 $\\sin^{2}(3x) + \\cos^{2} x$ 一般不等于 $1$。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `1 - \\sin^2(${arg})`,
            ans: `\\cos^2(${arg})`,
            wrong: [`\\sin^2(${arg})`, `-\\cos^2(${arg})`, "1"],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: "",
            f: (x: number) => 1 - Math.sin(x) ** 2,
            g: (x: number) => Math.cos(x) ** 2,
            why: [
              [
                "Taking $\\sin^2$ away from $1$ leaves the other square, $\\cos^2$.",
                "从 $1$ 中减去 $\\sin^2$，剩下的是另一个平方 $\\cos^2$。",
              ],
              [
                "$1 - \\sin^2$ is never negative, since sine stays between $-1$ and $1$.",
                "$1 - \\sin^2$ 永远不是负的，因为正弦在 $-1$ 和 $1$ 之间。",
              ],
              [
                "Taking $\\sin^2$ away from $1$ changes the value, except where the sine is $0$.",
                "从 $1$ 中减去 $\\sin^2$ 会改变值，除非正弦为 $0$。",
              ],
            ],
          },
          {
            expr: `1 - \\cos^2(${arg})`,
            ans: `\\sin^2(${arg})`,
            wrong: [`\\cos^2(${arg})`, `-\\sin^2(${arg})`, "1"],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: "",
            f: (x: number) => 1 - Math.cos(x) ** 2,
            g: (x: number) => Math.sin(x) ** 2,
            why: [
              [
                "Taking $\\cos^2$ away from $1$ leaves the other square, $\\sin^2$.",
                "从 $1$ 中减去 $\\cos^2$，剩下的是另一个平方 $\\sin^2$。",
              ],
              [
                "$1 - \\cos^2$ is never negative, since cosine stays between $-1$ and $1$.",
                "$1 - \\cos^2$ 永远不是负的，因为余弦在 $-1$ 和 $1$ 之间。",
              ],
              [
                "Taking $\\cos^2$ away from $1$ changes the value, except where the cosine is $0$.",
                "从 $1$ 中减去 $\\cos^2$ 会改变值，除非余弦为 $0$。",
              ],
            ],
          },
          {
            expr: `\\sin^2(${arg}) + \\cos^2(${arg})`,
            ans: "1",
            wrong: ["0", "-1", `2\\sin^2(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: "",
            f: (x: number) => Math.sin(x) ** 2 + Math.cos(x) ** 2,
            g: () => 1,
            why: [
              ["The two squares add up to $1$, not $0$.", "两个平方之和是 $1$，不是 $0$。"],
              ["A sum of squares cannot be negative.", "平方和不可能是负的。"],
              [
                "This replaces the cosine by a sine; the two squares are different, and together they make $1$.",
                "这里把余弦换成了正弦；两个平方并不相同，合起来是 $1$。",
              ],
            ],
          },
          {
            expr: `\\sin^2(${arg}) + \\cos^2(${arg}) - 1`,
            ans: "0",
            wrong: ["1", "-1", `\\cos^2(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: "1 - 1",
            f: (x: number) => Math.sin(x) ** 2 + Math.cos(x) ** 2 - 1,
            g: () => 0,
            why: [
              ["The two squares make $1$, and then $1$ is taken away.", "两个平方合起来是 $1$，然后又减去了 $1$。"],
              ["$1 - 1 = 0$, not $-1$.", "$1 - 1 = 0$，不是 $-1$。"],
              [
                "The whole sum $\\sin^2 + \\cos^2$ is $1$; the $\\cos^2$ does not survive on its own.",
                "整个和 $\\sin^2 + \\cos^2$ 是 $1$；$\\cos^2$ 不会单独留下。",
              ],
            ],
          },
          {
            expr: `\\frac{1 - \\cos^2(${arg})}{\\sin(${arg})}`,
            ans: `\\sin(${arg})`,
            wrong: [`\\cos(${arg})`, "1", `\\sin^2(${arg})`],
            use: `1 - \\cos^2(${arg}) = \\sin^2(${arg})`,
            mid: `\\frac{\\sin^2(${arg})}{\\sin(${arg})}`,
            f: (x: number) => (1 - Math.cos(x) ** 2) / Math.sin(x),
            g: (x: number) => Math.sin(x),
            why: [
              ["The numerator is $\\sin^2$, so a sine is left, not a cosine.", "分子是 $\\sin^2$，所以剩下的是正弦，不是余弦。"],
              ["$\\sin^2$ over $\\sin$ leaves one factor of $\\sin$, not $1$.", "$\\sin^2$ 除以 $\\sin$ 剩下一个 $\\sin$，不是 $1$。"],
              ["Dividing by $\\sin$ removes one factor of the sine.", "除以 $\\sin$ 会去掉一个正弦因式。"],
            ],
          },
          {
            expr: `\\frac{1 - \\sin^2(${arg})}{\\cos(${arg})}`,
            ans: `\\cos(${arg})`,
            wrong: [`\\sin(${arg})`, "1", `\\cos^2(${arg})`],
            use: `1 - \\sin^2(${arg}) = \\cos^2(${arg})`,
            mid: `\\frac{\\cos^2(${arg})}{\\cos(${arg})}`,
            f: (x: number) => (1 - Math.sin(x) ** 2) / Math.cos(x),
            g: (x: number) => Math.cos(x),
            why: [
              ["The numerator is $\\cos^2$, so a cosine is left, not a sine.", "分子是 $\\cos^2$，所以剩下的是余弦，不是正弦。"],
              ["$\\cos^2$ over $\\cos$ leaves one factor of $\\cos$, not $1$.", "$\\cos^2$ 除以 $\\cos$ 剩下一个 $\\cos$，不是 $1$。"],
              ["Dividing by $\\cos$ removes one factor of the cosine.", "除以 $\\cos$ 会去掉一个余弦因式。"],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, k, t("The identity to use is", "要用的恒等式是")),
          rewriteReasons(item),
        );
      },
    },
    {
      id: "products-yielding-the-pythagorean-identity",
      title: t("Conjugate products yielding Pythagorean identity", "共轭乘积化简"),
      explanation: t(
        `Two factors that differ only in the sign between their terms multiply to a difference of squares, $(a - b)(a + b) = a^{2} - b^{2}$. When one of the squares is a trigonometric square, the Pythagorean identity finishes the job:

$$(1 - \\cos\\theta)(1 + \\cos\\theta) = 1 - \\cos^{2}\\theta = \\sin^{2}\\theta$$

With the $1$ second the sign flips: $(\\sin\\theta - 1)(\\sin\\theta + 1) = \\sin^{2}\\theta - 1 = -\\cos^{2}\\theta$.

Check: at $\\theta = 60^{\\circ}$, $\\left(1 - \\frac{1}{2}\\right)\\left(1 + \\frac{1}{2}\\right) = \\frac{3}{4}$, and $\\sin^{2} 60^{\\circ} = \\frac{3}{4}$.

> **Watch out.** The middle terms cancel, so no first powers are left: the product is a difference of squares, never $1$ or $1 - \\cos\\theta$. Watch the order too: $\\cos^{2}\\theta - 1$ is the negative of $1 - \\cos^{2}\\theta$.`,
        `两个因式如果只在两项之间的符号上不同，它们的积就是平方差：$(a - b)(a + b) = a^{2} - b^{2}$。当其中一个平方是三角函数的平方时，再用勾股恒等式就完成了：

$$(1 - \\cos\\theta)(1 + \\cos\\theta) = 1 - \\cos^{2}\\theta = \\sin^{2}\\theta$$

如果 $1$ 在后面，符号就反过来：$(\\sin\\theta - 1)(\\sin\\theta + 1) = \\sin^{2}\\theta - 1 = -\\cos^{2}\\theta$。

检验：当 $\\theta = 60^{\\circ}$ 时，$\\left(1 - \\frac{1}{2}\\right)\\left(1 + \\frac{1}{2}\\right) = \\frac{3}{4}$，而 $\\sin^{2} 60^{\\circ} = \\frac{3}{4}$。

> **注意。** 中间的项互相抵消，所以不会剩下一次项：积是平方差，绝不是 $1$ 或 $1 - \\cos\\theta$。也要注意顺序：$\\cos^{2}\\theta - 1$ 是 $1 - \\cos^{2}\\theta$ 的相反数。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `(1 - \\sin(${arg}))(1 + \\sin(${arg}))`,
            ans: `\\cos^2(${arg})`,
            wrong: [`\\sin^2(${arg})`, "1", `1 - \\sin(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: `1 - \\sin^2(${arg})`,
            f: (x: number) => (1 - Math.sin(x)) * (1 + Math.sin(x)),
            g: (x: number) => Math.cos(x) ** 2,
            why: [
              [
                "The difference of squares is $1 - \\sin^2$, which is $\\cos^2$, not $\\sin^2$.",
                "平方差是 $1 - \\sin^2$，它等于 $\\cos^2$，不是 $\\sin^2$。",
              ],
              [
                "The middle terms cancel, but the product of the last terms, $-\\sin^2$, remains.",
                "中间的项抵消了，但最后两项的积 $-\\sin^2$ 还在。",
              ],
              [
                "Multiplying the two factors gives squares; no first power of the sine is left.",
                "两个因式相乘得到平方；不会剩下正弦的一次项。",
              ],
            ],
          },
          {
            expr: `(1 - \\cos(${arg}))(1 + \\cos(${arg}))`,
            ans: `\\sin^2(${arg})`,
            wrong: [`\\cos^2(${arg})`, "1", `1 - \\cos(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: `1 - \\cos^2(${arg})`,
            f: (x: number) => (1 - Math.cos(x)) * (1 + Math.cos(x)),
            g: (x: number) => Math.sin(x) ** 2,
            why: [
              [
                "The difference of squares is $1 - \\cos^2$, which is $\\sin^2$, not $\\cos^2$.",
                "平方差是 $1 - \\cos^2$，它等于 $\\sin^2$，不是 $\\cos^2$。",
              ],
              [
                "The middle terms cancel, but the product of the last terms, $-\\cos^2$, remains.",
                "中间的项抵消了，但最后两项的积 $-\\cos^2$ 还在。",
              ],
              [
                "Multiplying the two factors gives squares; no first power of the cosine is left.",
                "两个因式相乘得到平方；不会剩下余弦的一次项。",
              ],
            ],
          },
          {
            expr: `(\\cos(${arg}) - 1)(\\cos(${arg}) + 1)`,
            ans: `-\\sin^2(${arg})`,
            wrong: [`\\sin^2(${arg})`, `-1`, `\\cos^2(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: `\\cos^2(${arg}) - 1`,
            f: (x: number) => (Math.cos(x) - 1) * (Math.cos(x) + 1),
            g: (x: number) => -(Math.sin(x) ** 2),
            why: [
              [
                "$\\cos^2 - 1$ is the negative of $1 - \\cos^2$, so the sign is minus.",
                "$\\cos^2 - 1$ 是 $1 - \\cos^2$ 的相反数，所以是负号。",
              ],
              ["The product is $\\cos^2 - 1$, and the cosine squared does not drop out.", "积是 $\\cos^2 - 1$，余弦的平方不会消失。"],
              [
                "The $-1$ from the last terms remains, and $\\cos^2 - 1 = -\\sin^2$.",
                "最后两项的积 $-1$ 还在，而 $\\cos^2 - 1 = -\\sin^2$。",
              ],
            ],
          },
          {
            expr: `(\\sin(${arg}) - 1)(\\sin(${arg}) + 1)`,
            ans: `-\\cos^2(${arg})`,
            wrong: [`\\cos^2(${arg})`, `-1`, `\\sin^2(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: `\\sin^2(${arg}) - 1`,
            f: (x: number) => (Math.sin(x) - 1) * (Math.sin(x) + 1),
            g: (x: number) => -(Math.cos(x) ** 2),
            why: [
              [
                "$\\sin^2 - 1$ is the negative of $1 - \\sin^2$, so the sign is minus.",
                "$\\sin^2 - 1$ 是 $1 - \\sin^2$ 的相反数，所以是负号。",
              ],
              ["The product is $\\sin^2 - 1$, and the sine squared does not drop out.", "积是 $\\sin^2 - 1$，正弦的平方不会消失。"],
              [
                "The $-1$ from the last terms remains, and $\\sin^2 - 1 = -\\cos^2$.",
                "最后两项的积 $-1$ 还在，而 $\\sin^2 - 1 = -\\cos^2$。",
              ],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(
            item,
            v,
            k,
            t("The product is a difference of squares, and the Pythagorean identity finishes it:", "这个积是平方差，再用勾股恒等式："),
          ),
          rewriteReasons(item),
        );
      },
    },
  ],
};

// ─── 4.10.3 Alternate forms of the Pythagorean identity ─────────────────────

/** alternateFormsOfThePythagoreanIdentity factors and rearranges sin² + cos² = 1. */
export const alternateFormsOfThePythagoreanIdentity: TopicDef = {
  id: "alternate-forms-of-the-pythagorean-identity",
  title: t("Alternate Forms of the Pythagorean Identity", "勾股恒等式的变式"),
  summary: t(
    "Factor and substitute alternate forms of the Pythagorean identity in higher-order expressions and fractions.",
    "在高次表达式和分式中因式分解与代换勾股恒等式的变式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-pythagorean-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  intro: t(
    `Higher powers of sine and cosine are squares of squares, so the Pythagorean identity still applies once they are factored. The sum below is a perfect square:

$$\\sin^{4} x + 2\\sin^{2} x\\cos^{2} x + \\cos^{4} x = \\left(\\sin^{2} x + \\cos^{2} x\\right)^{2} = 1^{2} = 1$$

Check: at $x = 45^{\\circ}$, $\\sin^{2} x = \\cos^{2} x = \\frac{1}{2}$, and $\\frac{1}{4} + 2 \\cdot \\frac{1}{4} + \\frac{1}{4} = 1$.

In this lesson we factor higher powers of sine and cosine, substitute alternate forms of the identity in fractions, and find $\\sin x \\cos x$ from $\\sin x + \\cos x$.`,
    `正弦和余弦的高次幂是平方的平方，所以因式分解之后仍然可以用勾股恒等式。下面的和是一个完全平方：

$$\\sin^{4} x + 2\\sin^{2} x\\cos^{2} x + \\cos^{4} x = \\left(\\sin^{2} x + \\cos^{2} x\\right)^{2} = 1^{2} = 1$$

检验：当 $x = 45^{\\circ}$ 时，$\\sin^{2} x = \\cos^{2} x = \\frac{1}{2}$，而 $\\frac{1}{4} + 2 \\cdot \\frac{1}{4} + \\frac{1}{4} = 1$。

这节课我们分解正弦和余弦的高次幂，在分式中代换恒等式的变式，并由 $\\sin x + \\cos x$ 求 $\\sin x \\cos x$。`,
  ),
  knowledgePoints: [
    {
      id: "difference-of-squares-higher-powers",
      title: t("Factoring higher powers of sine and cosine", "正弦与余弦高次幂的因式分解"),
      explanation: t(
        `A fourth power is the square of a square, so $\\cos^{4}\\theta - \\sin^{4}\\theta$ is a difference of squares of $\\cos^{2}\\theta$ and $\\sin^{2}\\theta$, and one of its factors is the Pythagorean sum:

$$\\cos^{4}\\theta - \\sin^{4}\\theta = \\left(\\cos^{2}\\theta - \\sin^{2}\\theta\\right)\\left(\\cos^{2}\\theta + \\sin^{2}\\theta\\right) = \\cos^{2}\\theta - \\sin^{2}\\theta$$

Check: at $\\theta = 30^{\\circ}$, $\\cos^{4}\\theta - \\sin^{4}\\theta = \\frac{9}{16} - \\frac{1}{16} = \\frac{1}{2}$, and $\\cos^{2}\\theta - \\sin^{2}\\theta = \\frac{3}{4} - \\frac{1}{4} = \\frac{1}{2}$.

> **Watch out.** Only the sum factor equals $1$; the difference factor stays, so the answer is not $1$. Keep the order: $\\sin^{4} - \\cos^{4}$ gives $\\sin^{2} - \\cos^{2}$, the negative of $\\cos^{2} - \\sin^{2}$.`,
        `四次方是平方的平方，所以 $\\cos^{4}\\theta - \\sin^{4}\\theta$ 是 $\\cos^{2}\\theta$ 与 $\\sin^{2}\\theta$ 的平方差，其中一个因式就是勾股恒等式中的和：

$$\\cos^{4}\\theta - \\sin^{4}\\theta = \\left(\\cos^{2}\\theta - \\sin^{2}\\theta\\right)\\left(\\cos^{2}\\theta + \\sin^{2}\\theta\\right) = \\cos^{2}\\theta - \\sin^{2}\\theta$$

检验：当 $\\theta = 30^{\\circ}$ 时，$\\cos^{4}\\theta - \\sin^{4}\\theta = \\frac{9}{16} - \\frac{1}{16} = \\frac{1}{2}$，而 $\\cos^{2}\\theta - \\sin^{2}\\theta = \\frac{3}{4} - \\frac{1}{4} = \\frac{1}{2}$。

> **注意。** 只有和的那个因式等于 $1$；差的因式还在，所以答案不是 $1$。注意顺序：$\\sin^{4} - \\cos^{4}$ 得到 $\\sin^{2} - \\cos^{2}$，它是 $\\cos^{2} - \\sin^{2}$ 的相反数。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `\\cos^4(${arg}) - \\sin^4(${arg})`,
            ans: `\\cos^2(${arg}) - \\sin^2(${arg})`,
            wrong: ["1", `\\sin^2(${arg}) - \\cos^2(${arg})`, `2\\cos^2(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: `(\\cos^2(${arg}) - \\sin^2(${arg}))(\\cos^2(${arg}) + \\sin^2(${arg}))`,
            f: (x: number) => Math.cos(x) ** 4 - Math.sin(x) ** 4,
            g: (x: number) => Math.cos(x) ** 2 - Math.sin(x) ** 2,
            why: [
              [
                "Only the factor $\\cos^2 + \\sin^2$ is $1$; the other factor remains.",
                "只有因式 $\\cos^2 + \\sin^2$ 等于 $1$；另一个因式还在。",
              ],
              [
                "The order is reversed: the expression starts with the cosine, so the remaining factor is $\\cos^2 - \\sin^2$.",
                "顺序反了：式子以余弦开头，所以剩下的因式是 $\\cos^2 - \\sin^2$。",
              ],
              [
                "The remaining factor $\\cos^2 - \\sin^2$ equals $2\\cos^2 - 1$, not $2\\cos^2$.",
                "剩下的因式 $\\cos^2 - \\sin^2$ 等于 $2\\cos^2 - 1$，不是 $2\\cos^2$。",
              ],
            ],
          },
          {
            expr: `\\sin^4(${arg}) - \\cos^4(${arg})`,
            ans: `\\sin^2(${arg}) - \\cos^2(${arg})`,
            wrong: ["-1", `\\cos^2(${arg}) - \\sin^2(${arg})`, `2\\sin^2(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: `(\\sin^2(${arg}) - \\cos^2(${arg}))(\\sin^2(${arg}) + \\cos^2(${arg}))`,
            f: (x: number) => Math.sin(x) ** 4 - Math.cos(x) ** 4,
            g: (x: number) => Math.sin(x) ** 2 - Math.cos(x) ** 2,
            why: [
              [
                "Only the factor $\\sin^2 + \\cos^2$ is $1$; the other factor remains, and it is not $-1$ in general.",
                "只有因式 $\\sin^2 + \\cos^2$ 等于 $1$；另一个因式还在，它一般不等于 $-1$。",
              ],
              [
                "The order is reversed: the expression starts with the sine, so the remaining factor is $\\sin^2 - \\cos^2$.",
                "顺序反了：式子以正弦开头，所以剩下的因式是 $\\sin^2 - \\cos^2$。",
              ],
              [
                "The remaining factor $\\sin^2 - \\cos^2$ equals $2\\sin^2 - 1$, not $2\\sin^2$.",
                "剩下的因式 $\\sin^2 - \\cos^2$ 等于 $2\\sin^2 - 1$，不是 $2\\sin^2$。",
              ],
            ],
          },
          {
            expr: `\\frac{\\cos^4(${arg}) - \\sin^4(${arg})}{\\cos^2(${arg}) - \\sin^2(${arg})}`,
            ans: "1",
            wrong: ["0", "-1", `\\cos^2(${arg})`],
            use: `\\sin^2(${arg}) + \\cos^2(${arg}) = 1`,
            mid: `\\frac{(\\cos^2(${arg}) - \\sin^2(${arg}))(\\cos^2(${arg}) + \\sin^2(${arg}))}{\\cos^2(${arg}) - \\sin^2(${arg})} = \\cos^2(${arg}) + \\sin^2(${arg})`,
            f: (x: number) => (Math.cos(x) ** 4 - Math.sin(x) ** 4) / (Math.cos(x) ** 2 - Math.sin(x) ** 2),
            g: () => 1,
            why: [
              ["After cancelling, $\\cos^2 + \\sin^2$ is left, which is $1$.", "约分后剩下 $\\cos^2 + \\sin^2$，它等于 $1$。"],
              ["What is left, $\\cos^2 + \\sin^2$, is positive.", "剩下的 $\\cos^2 + \\sin^2$ 是正的。"],
              [
                "What is left is the sum $\\cos^2 + \\sin^2$, not $\\cos^2$ alone.",
                "剩下的是和 $\\cos^2 + \\sin^2$，不是单独的 $\\cos^2$。",
              ],
            ],
          },
          {
            expr: `(1 - \\sin^2(${arg}))^2 + 2\\sin^2(${arg})\\cos^2(${arg}) + \\sin^4(${arg})`,
            ans: "1",
            wrong: ["0", `\\cos^2(${arg})`, "2"],
            use: `1 - \\sin^2(${arg}) = \\cos^2(${arg})`,
            mid: `\\cos^4(${arg}) + 2\\sin^2(${arg})\\cos^2(${arg}) + \\sin^4(${arg}) = (\\cos^2(${arg}) + \\sin^2(${arg}))^2`,
            f: (x: number) => (1 - Math.sin(x) ** 2) ** 2 + 2 * Math.sin(x) ** 2 * Math.cos(x) ** 2 + Math.sin(x) ** 4,
            g: () => 1,
            why: [
              [
                "Every term is a square or a positive product, so the sum is not $0$: it is $(\\cos^2 + \\sin^2)^2 = 1$.",
                "每一项都是平方或正的积，所以和不是 $0$：它是 $(\\cos^2 + \\sin^2)^2 = 1$。",
              ],
              [
                "The three terms form the perfect square $(\\cos^2 + \\sin^2)^2$, which is $1$.",
                "三项构成完全平方 $(\\cos^2 + \\sin^2)^2$，它等于 $1$。",
              ],
              [
                "The perfect square is $(\\cos^2 + \\sin^2)^2 = 1^2 = 1$, not $2$.",
                "完全平方是 $(\\cos^2 + \\sin^2)^2 = 1^2 = 1$，不是 $2$。",
              ],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, k, t("Factor, then use", "因式分解，再利用")),
          rewriteReasons(item),
        );
      },
    },
    {
      id: "fractions-with-pythagorean-substitutions",
      title: t("Pythagorean substitutions in fractions", "分式中的勾股恒等式代换"),
      explanation: t(
        `In a fraction, replace each expression from the Pythagorean identity by the single square it equals, $1 - \\sin^{2}\\theta = \\cos^{2}\\theta$ and $1 - \\cos^{2}\\theta = \\sin^{2}\\theta$, and then cancel what the numerator and the denominator share:

$$\\frac{1 - \\cos^{2}\\theta}{1 - \\sin^{2}\\theta} = \\frac{\\sin^{2}\\theta}{\\cos^{2}\\theta} = \\tan^{2}\\theta$$

Check: at $\\theta = 60^{\\circ}$, $\\frac{1 - \\frac{1}{4}}{1 - \\frac{3}{4}} = \\frac{3/4}{1/4} = 3$, and $\\tan^{2} 60^{\\circ} = 3$.

> **Watch out.** $1 - \\cos^{2}$ becomes $\\sin^{2}$, not $\\cos^{2}$. And a square over a single power leaves one factor: $\\frac{\\sin^{2}\\theta}{\\sin\\theta} = \\sin\\theta$, not $1$ or $\\sin^{2}\\theta$.`,
        `在分式中，把勾股恒等式中的式子换成与它相等的单个平方，$1 - \\sin^{2}\\theta = \\cos^{2}\\theta$，$1 - \\cos^{2}\\theta = \\sin^{2}\\theta$，然后约去分子和分母的公因式：

$$\\frac{1 - \\cos^{2}\\theta}{1 - \\sin^{2}\\theta} = \\frac{\\sin^{2}\\theta}{\\cos^{2}\\theta} = \\tan^{2}\\theta$$

检验：当 $\\theta = 60^{\\circ}$ 时，$\\frac{1 - \\frac{1}{4}}{1 - \\frac{3}{4}} = \\frac{3/4}{1/4} = 3$，而 $\\tan^{2} 60^{\\circ} = 3$。

> **注意。** $1 - \\cos^{2}$ 换成 $\\sin^{2}$，不是 $\\cos^{2}$。平方除以一次方会剩下一个因式：$\\frac{\\sin^{2}\\theta}{\\sin\\theta} = \\sin\\theta$，不是 $1$，也不是 $\\sin^{2}\\theta$。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `\\frac{1 - \\sin^2(${arg})}{\\cos(${arg})}`,
            ans: `\\cos(${arg})`,
            wrong: [`\\sin(${arg})`, "1", `\\cos^2(${arg})`],
            use: `1 - \\sin^2(${arg}) = \\cos^2(${arg})`,
            mid: `\\frac{\\cos^2(${arg})}{\\cos(${arg})}`,
            f: (x: number) => (1 - Math.sin(x) ** 2) / Math.cos(x),
            g: (x: number) => Math.cos(x),
            why: [
              ["$1 - \\sin^2$ is $\\cos^2$, so a cosine is left.", "$1 - \\sin^2$ 是 $\\cos^2$，所以剩下的是余弦。"],
              ["$\\cos^2$ over $\\cos$ leaves one factor of $\\cos$, not $1$.", "$\\cos^2$ 除以 $\\cos$ 剩下一个 $\\cos$，不是 $1$。"],
              ["Dividing by $\\cos$ removes one factor of the cosine.", "除以 $\\cos$ 会去掉一个余弦因式。"],
            ],
          },
          {
            expr: `\\frac{1 - \\cos^2(${arg})}{\\sin(${arg})}`,
            ans: `\\sin(${arg})`,
            wrong: [`\\cos(${arg})`, "1", `\\sin^2(${arg})`],
            use: `1 - \\cos^2(${arg}) = \\sin^2(${arg})`,
            mid: `\\frac{\\sin^2(${arg})}{\\sin(${arg})}`,
            f: (x: number) => (1 - Math.cos(x) ** 2) / Math.sin(x),
            g: (x: number) => Math.sin(x),
            why: [
              ["$1 - \\cos^2$ is $\\sin^2$, so a sine is left.", "$1 - \\cos^2$ 是 $\\sin^2$，所以剩下的是正弦。"],
              ["$\\sin^2$ over $\\sin$ leaves one factor of $\\sin$, not $1$.", "$\\sin^2$ 除以 $\\sin$ 剩下一个 $\\sin$，不是 $1$。"],
              ["Dividing by $\\sin$ removes one factor of the sine.", "除以 $\\sin$ 会去掉一个正弦因式。"],
            ],
          },
          {
            expr: `\\frac{1 - \\cos^2(${arg})}{1 - \\sin^2(${arg})}`,
            ans: `\\tan^2(${arg})`,
            wrong: [`\\cot^2(${arg})`, "1", `\\sin^2(${arg})`],
            use: `1 - \\cos^2(${arg}) = \\sin^2(${arg}), \\quad 1 - \\sin^2(${arg}) = \\cos^2(${arg})`,
            mid: `\\frac{\\sin^2(${arg})}{\\cos^2(${arg})}`,
            f: (x: number) => (1 - Math.cos(x) ** 2) / (1 - Math.sin(x) ** 2),
            g: (x: number) => Math.tan(x) ** 2,
            why: [
              [
                "The numerator becomes $\\sin^2$ and the denominator $\\cos^2$, so it is $\\tan^2$, not $\\cot^2$.",
                "分子变成 $\\sin^2$，分母变成 $\\cos^2$，所以是 $\\tan^2$，不是 $\\cot^2$。",
              ],
              [
                "The numerator and the denominator are different squares, so the quotient is not $1$.",
                "分子和分母是不同的平方，所以商不是 $1$。",
              ],
              [
                "The denominator $\\cos^2$ does not disappear: $\\frac{\\sin^2}{\\cos^2} = \\tan^2$.",
                "分母 $\\cos^2$ 不会消失：$\\frac{\\sin^2}{\\cos^2} = \\tan^2$。",
              ],
            ],
          },
          {
            expr: `\\frac{1 - \\sin^2(${arg})}{1 - \\cos^2(${arg})}`,
            ans: `\\cot^2(${arg})`,
            wrong: [`\\tan^2(${arg})`, "1", `\\cos^2(${arg})`],
            use: `1 - \\sin^2(${arg}) = \\cos^2(${arg}), \\quad 1 - \\cos^2(${arg}) = \\sin^2(${arg})`,
            mid: `\\frac{\\cos^2(${arg})}{\\sin^2(${arg})}`,
            f: (x: number) => (1 - Math.sin(x) ** 2) / (1 - Math.cos(x) ** 2),
            g: (x: number) => 1 / Math.tan(x) ** 2,
            why: [
              [
                "The numerator becomes $\\cos^2$ and the denominator $\\sin^2$, so it is $\\cot^2$, not $\\tan^2$.",
                "分子变成 $\\cos^2$，分母变成 $\\sin^2$，所以是 $\\cot^2$，不是 $\\tan^2$。",
              ],
              [
                "The numerator and the denominator are different squares, so the quotient is not $1$.",
                "分子和分母是不同的平方，所以商不是 $1$。",
              ],
              [
                "The denominator $\\sin^2$ does not disappear: $\\frac{\\cos^2}{\\sin^2} = \\cot^2$.",
                "分母 $\\sin^2$ 不会消失：$\\frac{\\cos^2}{\\sin^2} = \\cot^2$。",
              ],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, k, t("Replace each expression from the Pythagorean identity, using", "用下式替换勾股恒等式中的式子：")),
          rewriteReasons(item),
        );
      },
    },
  ],
};

// ─── 4.10.4 Simplifying expressions using secant-tangent identity ───────────

/** simplifyingExpressionsUsingTheSecantTangentIdentity applies 1 + tan² = sec². */
export const simplifyingExpressionsUsingTheSecantTangentIdentity: TopicDef = {
  id: "simplifying-expressions-using-the-secant-tangent-identity",
  title: t("Simplifying Expressions Using the Secant-Tangent Identity", "利用正割-正切恒等式化简表达式"),
  summary: t(
    "Simplify expressions using the identity 1 + tan²(θ) = sec²(θ) and its difference sec²(θ) - tan²(θ) = 1.",
    "利用恒等式 1 + tan²(θ) = sec²(θ) 及其差的形式 sec²(θ) - tan²(θ) = 1 化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-pythagorean-identity"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  intro: t(
    `Dividing $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ by $\\cos^{2}\\theta$ gives a second identity:

$$\\tan^{2}\\theta + 1 = \\sec^{2}\\theta$$

It links tangent and secant the way the first identity links sine and cosine, and it holds wherever $\\cos\\theta \\ne 0$. So $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$ at every such angle.

Check: at $\\theta = 60^{\\circ}$, $\\tan^{2} 60^{\\circ} = 3$ and $\\sec^{2} 60^{\\circ} = 2^{2} = 4$, and $4 - 3 = 1$.

In this lesson we simplify expressions and fractions with the secant and tangent identity, and find a secant from a tangent.`,
    `把 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ 两边除以 $\\cos^{2}\\theta$，得到第二个恒等式：

$$\\tan^{2}\\theta + 1 = \\sec^{2}\\theta$$

它联系正切和正割，就像第一个恒等式联系正弦和余弦一样；只要 $\\cos\\theta \\ne 0$ 就成立。所以在每个这样的角上都有 $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$。

检验：当 $\\theta = 60^{\\circ}$ 时，$\\tan^{2} 60^{\\circ} = 3$，$\\sec^{2} 60^{\\circ} = 2^{2} = 4$，而 $4 - 3 = 1$。

这节课我们用正割与正切的恒等式化简式子和分式，并由正切求正割。`,
  ),
  knowledgePoints: [
    {
      id: "direct-secant-tangent-substitutions",
      title: t("Direct secant-tangent substitution", "直接利用正割-正切关系代换"),
      explanation: t(
        `Dividing the Pythagorean identity by $\\cos^{2}\\theta$ gives $\\tan^{2}\\theta + 1 = \\sec^{2}\\theta$, which trades a secant square for a tangent square plus one. Rearranged:

$$\\sec^{2}\\theta - \\tan^{2}\\theta = 1, \\quad \\sec^{2}\\theta - 1 = \\tan^{2}\\theta$$

Any angle can sit inside: $\\sec^{2}(2x) - 1 = \\tan^{2}(2x)$. Check: at $x = 30^{\\circ}$, $2x = 60^{\\circ}$, and $\\sec^{2} 60^{\\circ} - 1 = 4 - 1 = 3 = \\tan^{2} 60^{\\circ}$.

> **Watch out.** Secant goes with tangent, and cosecant with cotangent: $1 + \\tan^{2} = \\sec^{2}$, but $1 + \\cot^{2} = \\csc^{2}$. And the secant square is the larger, so $\\sec^{2} - \\tan^{2} = 1$ while $\\tan^{2} - \\sec^{2} = -1$.`,
        `把勾股恒等式两边除以 $\\cos^{2}\\theta$ 得 $\\tan^{2}\\theta + 1 = \\sec^{2}\\theta$，它把正割的平方换成正切的平方加一。变形得：

$$\\sec^{2}\\theta - \\tan^{2}\\theta = 1, \\quad \\sec^{2}\\theta - 1 = \\tan^{2}\\theta$$

里面可以是任何角：$\\sec^{2}(2x) - 1 = \\tan^{2}(2x)$。检验：当 $x = 30^{\\circ}$ 时 $2x = 60^{\\circ}$，$\\sec^{2} 60^{\\circ} - 1 = 4 - 1 = 3 = \\tan^{2} 60^{\\circ}$。

> **注意。** 正割与正切配对，余割与余切配对：$1 + \\tan^{2} = \\sec^{2}$，而 $1 + \\cot^{2} = \\csc^{2}$。正割的平方较大，所以 $\\sec^{2} - \\tan^{2} = 1$，而 $\\tan^{2} - \\sec^{2} = -1$。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `\\sec^2(${arg}) - \\tan^2(${arg})`,
            ans: "1",
            wrong: ["-1", "0", `\\cos^2(${arg})`],
            use: `1 + \\tan^2(${arg}) = \\sec^2(${arg})`,
            mid: "",
            f: (x: number) => 1 / Math.cos(x) ** 2 - Math.tan(x) ** 2,
            g: () => 1,
            why: [
              [
                "The secant square is the larger, since $\\sec^2 = 1 + \\tan^2$, so the difference is $+1$.",
                "正割的平方较大，因为 $\\sec^2 = 1 + \\tan^2$，所以差是 $+1$。",
              ],
              ["$\\sec^2$ and $\\tan^2$ differ by exactly $1$.", "$\\sec^2$ 和 $\\tan^2$ 恰好相差 $1$。"],
              ["The difference is a number, $1$, not a function of the angle.", "差是一个数 $1$，不是角的函数。"],
            ],
          },
          {
            expr: `\\tan^2(${arg}) - \\sec^2(${arg})`,
            ans: "-1",
            wrong: ["1", "0", `-\\cos^2(${arg})`],
            use: `1 + \\tan^2(${arg}) = \\sec^2(${arg})`,
            mid: "",
            f: (x: number) => Math.tan(x) ** 2 - 1 / Math.cos(x) ** 2,
            g: () => -1,
            why: [
              [
                "The order is reversed: the smaller square comes first, so the difference is $-1$.",
                "顺序反了：较小的平方在前，所以差是 $-1$。",
              ],
              ["$\\tan^2$ and $\\sec^2$ differ by exactly $1$.", "$\\tan^2$ 和 $\\sec^2$ 恰好相差 $1$。"],
              ["The difference is a number, $-1$, not a function of the angle.", "差是一个数 $-1$，不是角的函数。"],
            ],
          },
          {
            expr: `1 + \\tan^2(${arg})`,
            ans: `\\sec^2(${arg})`,
            wrong: [`\\csc^2(${arg})`, "1", `\\sin^2(${arg})`],
            use: `1 + \\tan^2(${arg}) = \\sec^2(${arg})`,
            mid: "",
            f: (x: number) => 1 + Math.tan(x) ** 2,
            g: (x: number) => 1 / Math.cos(x) ** 2,
            why: [
              [
                "Cosecant goes with cotangent: $1 + \\cot^2 = \\csc^2$. With tangent the result is $\\sec^2$.",
                "余割与余切配对：$1 + \\cot^2 = \\csc^2$。与正切配对的是 $\\sec^2$。",
              ],
              [
                "$\\tan^2$ is added to $1$, so the result is more than $1$ unless the tangent is $0$.",
                "$1$ 加上了 $\\tan^2$，所以除非正切为 $0$，结果都大于 $1$。",
              ],
              [
                "$\\sin^2 + \\cos^2 = 1$ is the other identity; $1 + \\tan^2$ is $\\sec^2$.",
                "$\\sin^2 + \\cos^2 = 1$ 是另一个恒等式；$1 + \\tan^2$ 是 $\\sec^2$。",
              ],
            ],
          },
          {
            expr: `\\sec^2(${arg}) - 1`,
            ans: `\\tan^2(${arg})`,
            wrong: [`\\cot^2(${arg})`, "1", `\\cos^2(${arg})`],
            use: `1 + \\tan^2(${arg}) = \\sec^2(${arg})`,
            mid: "",
            f: (x: number) => 1 / Math.cos(x) ** 2 - 1,
            g: (x: number) => Math.tan(x) ** 2,
            why: [
              [
                "Cotangent goes with cosecant: $\\csc^2 - 1 = \\cot^2$. Here it is $\\tan^2$.",
                "余切与余割配对：$\\csc^2 - 1 = \\cot^2$。这里是 $\\tan^2$。",
              ],
              ["Taking $1$ from $\\sec^2$ leaves $\\tan^2$, not $1$.", "$\\sec^2$ 减去 $1$ 剩下 $\\tan^2$，不是 $1$。"],
              ["$\\cos^2$ is the reciprocal of $\\sec^2$, not $\\sec^2 - 1$.", "$\\cos^2$ 是 $\\sec^2$ 的倒数，不是 $\\sec^2 - 1$。"],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, k, t("The secant and tangent identity is", "正割与正切的恒等式是")),
          rewriteReasons(item),
        );
      },
    },
    {
      id: "secant-tangent-fractions",
      title: t("Fractions involving secant and tangent", "含正割与正切的分式"),
      explanation: t(
        `In a fraction, look for $\\sec^{2}\\theta - \\tan^{2}\\theta$, $\\sec^{2}\\theta - 1$ or $1 + \\tan^{2}\\theta$, and replace it by its simpler equal before cancelling:

$$\\frac{\\sec^{2}\\theta - 1}{\\tan\\theta} = \\frac{\\tan^{2}\\theta}{\\tan\\theta} = \\tan\\theta, \\qquad \\frac{\\sec^{2}\\theta - \\tan^{2}\\theta}{\\sec\\theta} = \\frac{1}{\\sec\\theta} = \\cos\\theta$$

Check: at $\\theta = 45^{\\circ}$, $\\frac{\\sec^{2} 45^{\\circ} - 1}{\\tan 45^{\\circ}} = \\frac{2 - 1}{1} = 1 = \\tan 45^{\\circ}$.

> **Watch out.** When the numerator becomes $1$, the result is the reciprocal of the denominator: $\\frac{1}{\\sec} = \\cos$ and $\\frac{1}{\\tan} = \\cot$, not $\\sec$ or $\\tan$ themselves.`,
        `在分式中，找出 $\\sec^{2}\\theta - \\tan^{2}\\theta$、$\\sec^{2}\\theta - 1$ 或 $1 + \\tan^{2}\\theta$，先把它换成更简单的等值式，再约分：

$$\\frac{\\sec^{2}\\theta - 1}{\\tan\\theta} = \\frac{\\tan^{2}\\theta}{\\tan\\theta} = \\tan\\theta, \\qquad \\frac{\\sec^{2}\\theta - \\tan^{2}\\theta}{\\sec\\theta} = \\frac{1}{\\sec\\theta} = \\cos\\theta$$

检验：当 $\\theta = 45^{\\circ}$ 时，$\\frac{\\sec^{2} 45^{\\circ} - 1}{\\tan 45^{\\circ}} = \\frac{2 - 1}{1} = 1 = \\tan 45^{\\circ}$。

> **注意。** 分子变成 $1$ 时，结果是分母的倒数：$\\frac{1}{\\sec} = \\cos$，$\\frac{1}{\\tan} = \\cot$，而不是 $\\sec$ 或 $\\tan$ 本身。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `\\frac{\\sec^2(${arg}) - 1}{\\tan(${arg})}`,
            ans: `\\tan(${arg})`,
            wrong: [`\\cot(${arg})`, "1", `\\sec(${arg})`],
            use: `\\sec^2(${arg}) - 1 = \\tan^2(${arg})`,
            mid: `\\frac{\\tan^2(${arg})}{\\tan(${arg})}`,
            f: (x: number) => (1 / Math.cos(x) ** 2 - 1) / Math.tan(x),
            g: (x: number) => Math.tan(x),
            why: [
              ["$\\tan^2$ over $\\tan$ leaves $\\tan$, not its reciprocal.", "$\\tan^2$ 除以 $\\tan$ 剩下 $\\tan$，不是它的倒数。"],
              ["$\\tan^2$ over $\\tan$ leaves one factor of $\\tan$, not $1$.", "$\\tan^2$ 除以 $\\tan$ 剩下一个 $\\tan$，不是 $1$。"],
              ["$\\sec^2 - 1$ is $\\tan^2$, so the secant is gone.", "$\\sec^2 - 1$ 是 $\\tan^2$，所以正割没有了。"],
            ],
          },
          {
            expr: `\\frac{\\sec^2(${arg}) - \\tan^2(${arg})}{\\sec(${arg})}`,
            ans: `\\cos(${arg})`,
            wrong: [`\\sec(${arg})`, "1", `\\sin(${arg})`],
            use: `\\sec^2(${arg}) - \\tan^2(${arg}) = 1`,
            mid: `\\frac{1}{\\sec(${arg})}`,
            f: (x: number) => (1 / Math.cos(x) ** 2 - Math.tan(x) ** 2) * Math.cos(x),
            g: (x: number) => Math.cos(x),
            why: [
              ["The numerator is $1$, so the result is the reciprocal of the secant.", "分子是 $1$，所以结果是正割的倒数。"],
              ["Only the numerator is $1$; the secant in the denominator remains.", "只有分子是 $1$；分母上的正割还在。"],
              ["The reciprocal of the secant is the cosine, not the sine.", "正割的倒数是余弦，不是正弦。"],
            ],
          },
          {
            expr: `\\frac{\\sec^2(${arg}) - \\tan^2(${arg})}{\\tan(${arg})}`,
            ans: `\\cot(${arg})`,
            wrong: [`\\tan(${arg})`, "1", `\\cos(${arg})`],
            use: `\\sec^2(${arg}) - \\tan^2(${arg}) = 1`,
            mid: `\\frac{1}{\\tan(${arg})}`,
            f: (x: number) => (1 / Math.cos(x) ** 2 - Math.tan(x) ** 2) / Math.tan(x),
            g: (x: number) => 1 / Math.tan(x),
            why: [
              ["The numerator is $1$, so the result is the reciprocal of the tangent.", "分子是 $1$，所以结果是正切的倒数。"],
              ["Only the numerator is $1$; the tangent in the denominator remains.", "只有分子是 $1$；分母上的正切还在。"],
              [
                "The reciprocal of the tangent is the cotangent, $\\frac{\\cos}{\\sin}$, not the cosine.",
                "正切的倒数是余切 $\\frac{\\cos}{\\sin}$，不是余弦。",
              ],
            ],
          },
          {
            expr: `\\frac{1 + \\tan^2(${arg})}{\\sec(${arg})}`,
            ans: `\\sec(${arg})`,
            wrong: [`\\cos(${arg})`, "1", `\\tan(${arg})`],
            use: `1 + \\tan^2(${arg}) = \\sec^2(${arg})`,
            mid: `\\frac{\\sec^2(${arg})}{\\sec(${arg})}`,
            f: (x: number) => (1 + Math.tan(x) ** 2) * Math.cos(x),
            g: (x: number) => 1 / Math.cos(x),
            why: [
              ["$\\sec^2$ over $\\sec$ leaves $\\sec$, not its reciprocal.", "$\\sec^2$ 除以 $\\sec$ 剩下 $\\sec$，不是它的倒数。"],
              ["$\\sec^2$ over $\\sec$ leaves one factor of $\\sec$, not $1$.", "$\\sec^2$ 除以 $\\sec$ 剩下一个 $\\sec$，不是 $1$。"],
              ["$1 + \\tan^2$ is $\\sec^2$, so the tangent is gone.", "$1 + \\tan^2$ 是 $\\sec^2$，所以正切没有了。"],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, k, t("The form of the secant and tangent identity to use is", "要用的正割与正切恒等式的形式是")),
          rewriteReasons(item),
        );
      },
    },
  ],
};

// ─── 4.10.5 Alternate forms of the secant-tangent identity ──────────────────

/** alternateFormsOfTheSecantTangentIdentity factors and manipulates sec² - tan² = 1. */
export const alternateFormsOfTheSecantTangentIdentity: TopicDef = {
  id: "alternate-forms-of-the-secant-tangent-identity",
  title: t("Alternate Forms of the Secant-Tangent Identity", "正割-正切恒等式的变式"),
  summary: t(
    "Manipulate expressions involving secant and tangent using algebraic identities and reciprocals.",
    "利用代数恒等式与倒数关系对含正割与正切的表达式进行变式化简。",
  ),
  prerequisites: ["simplifying-expressions-using-the-secant-tangent-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-secant-tangent-identity", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  intro: t(
    `The identity $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$ is a difference of squares, so it factors:

$$(\\sec\\theta - \\tan\\theta)(\\sec\\theta + \\tan\\theta) = 1$$

Two numbers whose product is $1$ are reciprocals, so the sum and the difference of secant and tangent are reciprocals of each other.

Check: at $\\theta = 60^{\\circ}$, $\\sec\\theta = 2$ and $\\tan\\theta = \\sqrt{3}$, and $(2 - \\sqrt{3})(2 + \\sqrt{3}) = 4 - 3 = 1$.

In this lesson we factor higher powers of secant and tangent, use the two conjugate factors as reciprocals, and find one factor from the other.`,
    `恒等式 $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$ 是平方差，所以可以分解：

$$(\\sec\\theta - \\tan\\theta)(\\sec\\theta + \\tan\\theta) = 1$$

积为 $1$ 的两个数互为倒数，所以正割与正切的和与差互为倒数。

检验：当 $\\theta = 60^{\\circ}$ 时，$\\sec\\theta = 2$，$\\tan\\theta = \\sqrt{3}$，而 $(2 - \\sqrt{3})(2 + \\sqrt{3}) = 4 - 3 = 1$。

这节课我们分解正割与正切的高次幂，把两个共轭因式当作倒数来用，并由一个因式求另一个。`,
  ),
  knowledgePoints: [
    {
      id: "factoring-secant-tangent-powers",
      title: t("Factoring higher powers of secant and tangent", "正割与正切高次幂的因式分解"),
      explanation: t(
        `A fourth power is the square of a square, so $\\sec^{4}\\theta - \\tan^{4}\\theta$ factors as a difference of squares, and the difference factor is $1$ by the secant and tangent identity:

$$\\sec^{4}\\theta - \\tan^{4}\\theta = (\\sec^{2}\\theta - \\tan^{2}\\theta)(\\sec^{2}\\theta + \\tan^{2}\\theta) = \\sec^{2}\\theta + \\tan^{2}\\theta$$

Check: at $\\theta = 45^{\\circ}$, $\\sec^{2}\\theta = 2$ and $\\tan^{2}\\theta = 1$, so $\\sec^{4}\\theta - \\tan^{4}\\theta = 4 - 1 = 3$ and $\\sec^{2}\\theta + \\tan^{2}\\theta = 2 + 1 = 3$.

> **Watch out.** Only the difference factor is $1$; the sum factor $\\sec^{2}\\theta + \\tan^{2}\\theta$ stays. In $\\tan^{4}\\theta - \\sec^{4}\\theta$ the order is reversed, so the result is the negative, $-(\\sec^{2}\\theta + \\tan^{2}\\theta)$.`,
        `四次方是平方的平方，所以 $\\sec^{4}\\theta - \\tan^{4}\\theta$ 可以按平方差分解，而由正割与正切的恒等式，差的那个因式等于 $1$：

$$\\sec^{4}\\theta - \\tan^{4}\\theta = (\\sec^{2}\\theta - \\tan^{2}\\theta)(\\sec^{2}\\theta + \\tan^{2}\\theta) = \\sec^{2}\\theta + \\tan^{2}\\theta$$

检验：当 $\\theta = 45^{\\circ}$ 时，$\\sec^{2}\\theta = 2$，$\\tan^{2}\\theta = 1$，所以 $\\sec^{4}\\theta - \\tan^{4}\\theta = 4 - 1 = 3$，而 $\\sec^{2}\\theta + \\tan^{2}\\theta = 2 + 1 = 3$。

> **注意。** 只有差的因式等于 $1$；和的因式 $\\sec^{2}\\theta + \\tan^{2}\\theta$ 还在。在 $\\tan^{4}\\theta - \\sec^{4}\\theta$ 中顺序反了，所以结果是相反数 $-(\\sec^{2}\\theta + \\tan^{2}\\theta)$。`,
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `\\sec^4(${arg}) - \\tan^4(${arg})`,
            ans: `\\sec^2(${arg}) + \\tan^2(${arg})`,
            wrong: ["1", `\\sec^2(${arg}) - \\tan^2(${arg})`, "0"],
            use: `\\sec^2(${arg}) - \\tan^2(${arg}) = 1`,
            mid: `(\\sec^2(${arg}) - \\tan^2(${arg}))(\\sec^2(${arg}) + \\tan^2(${arg}))`,
            f: (x: number) => 1 / Math.cos(x) ** 4 - Math.tan(x) ** 4,
            g: (x: number) => 1 / Math.cos(x) ** 2 + Math.tan(x) ** 2,
            why: [
              [
                "Only the factor $\\sec^2 - \\tan^2$ is $1$; the factor $\\sec^2 + \\tan^2$ remains.",
                "只有因式 $\\sec^2 - \\tan^2$ 等于 $1$；因式 $\\sec^2 + \\tan^2$ 还在。",
              ],
              [
                "This is the factor that equals $1$; the factor that is left is the sum.",
                "这正是等于 $1$ 的那个因式；剩下的是和的那个因式。",
              ],
              [
                "$\\sec^2$ is always larger than $\\tan^2$, so $\\sec^4 - \\tan^4$ is positive.",
                "$\\sec^2$ 总是大于 $\\tan^2$，所以 $\\sec^4 - \\tan^4$ 是正的。",
              ],
            ],
          },
          {
            expr: `\\frac{\\sec^4(${arg}) - \\tan^4(${arg})}{\\sec^2(${arg}) + \\tan^2(${arg})}`,
            ans: "1",
            wrong: ["-1", "0", `\\sec^2(${arg})`],
            use: `\\sec^2(${arg}) - \\tan^2(${arg}) = 1`,
            mid: `\\frac{(\\sec^2(${arg}) - \\tan^2(${arg}))(\\sec^2(${arg}) + \\tan^2(${arg}))}{\\sec^2(${arg}) + \\tan^2(${arg})} = \\sec^2(${arg}) - \\tan^2(${arg})`,
            f: (x: number) => (1 / Math.cos(x) ** 4 - Math.tan(x) ** 4) / (1 / Math.cos(x) ** 2 + Math.tan(x) ** 2),
            g: () => 1,
            why: [
              ["The factor left is $\\sec^2 - \\tan^2$, which is $+1$.", "剩下的因式是 $\\sec^2 - \\tan^2$，它等于 $+1$。"],
              ["The factor left, $\\sec^2 - \\tan^2$, is $1$, not $0$.", "剩下的因式 $\\sec^2 - \\tan^2$ 等于 $1$，不是 $0$。"],
              [
                "The tangent square is still subtracted: what is left is $\\sec^2 - \\tan^2$.",
                "正切的平方仍然被减去：剩下的是 $\\sec^2 - \\tan^2$。",
              ],
            ],
          },
          {
            expr: `\\tan^4(${arg}) - \\sec^4(${arg})`,
            ans: `-(\\sec^2(${arg}) + \\tan^2(${arg}))`,
            wrong: ["-1", "1", `\\sec^2(${arg}) + \\tan^2(${arg})`],
            use: `\\sec^2(${arg}) - \\tan^2(${arg}) = 1`,
            mid: `-(\\sec^4(${arg}) - \\tan^4(${arg})) = -(\\sec^2(${arg}) - \\tan^2(${arg}))(\\sec^2(${arg}) + \\tan^2(${arg}))`,
            f: (x: number) => Math.tan(x) ** 4 - 1 / Math.cos(x) ** 4,
            g: (x: number) => -(1 / Math.cos(x) ** 2 + Math.tan(x) ** 2),
            why: [
              [
                "Only the factor $\\sec^2 - \\tan^2$ is $1$; the sum $\\sec^2 + \\tan^2$ remains, with the minus sign.",
                "只有因式 $\\sec^2 - \\tan^2$ 等于 $1$；和 $\\sec^2 + \\tan^2$ 还在，并带着负号。",
              ],
              ["The order is reversed: $\\tan^4$ is the smaller, so the result is negative.", "顺序反了：$\\tan^4$ 较小，所以结果是负的。"],
              ["The minus sign taken out has been lost: $\\tan^4 - \\sec^4$ is negative.", "提出的负号丢了：$\\tan^4 - \\sec^4$ 是负的。"],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, k, t("Factor as a difference of squares, then use", "按平方差分解，再利用")),
          rewriteReasons(item),
        );
      },
    },
    {
      id: "secant-tangent-reciprocal-relationships",
      title: t("Conjugate reciprocal relationship", "共轭因式的倒数关系"),
      explanation: t(
        `Factoring $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$ gives $(\\sec\\theta - \\tan\\theta)(\\sec\\theta + \\tan\\theta) = 1$. Two factors with product $1$ are reciprocals, so either one can replace the reciprocal of the other:

$$\\frac{1}{\\sec\\theta - \\tan\\theta} = \\sec\\theta + \\tan\\theta, \\quad \\frac{1}{\\sec\\theta + \\tan\\theta} = \\sec\\theta - \\tan\\theta$$

Check: at $\\theta = 60^{\\circ}$, $\\frac{1}{\\sec\\theta - \\tan\\theta} = \\frac{1}{2 - \\sqrt{3}}$, and since $(2 - \\sqrt{3})(2 + \\sqrt{3}) = 1$, this is $2 + \\sqrt{3} = \\sec\\theta + \\tan\\theta$.

> **Watch out.** The reciprocal of a sum is not the sum of the reciprocals: $\\frac{1}{\\sec\\theta + \\tan\\theta}$ is not $\\cos\\theta + \\cot\\theta$. Taking the reciprocal flips the sign between the two terms.`,
        `分解 $\\sec^{2}\\theta - \\tan^{2}\\theta = 1$ 得 $(\\sec\\theta - \\tan\\theta)(\\sec\\theta + \\tan\\theta) = 1$。积为 $1$ 的两个因式互为倒数，所以任一个都可以代替另一个的倒数：

$$\\frac{1}{\\sec\\theta - \\tan\\theta} = \\sec\\theta + \\tan\\theta, \\quad \\frac{1}{\\sec\\theta + \\tan\\theta} = \\sec\\theta - \\tan\\theta$$

检验：当 $\\theta = 60^{\\circ}$ 时，$\\frac{1}{\\sec\\theta - \\tan\\theta} = \\frac{1}{2 - \\sqrt{3}}$，因为 $(2 - \\sqrt{3})(2 + \\sqrt{3}) = 1$，它等于 $2 + \\sqrt{3} = \\sec\\theta + \\tan\\theta$。

> **注意。** 和的倒数不是倒数的和：$\\frac{1}{\\sec\\theta + \\tan\\theta}$ 不等于 $\\cos\\theta + \\cot\\theta$。取倒数时，两项之间的符号要反过来。`,
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta", "u"]);
        const conj = `(\\sec ${v} - \\tan ${v})(\\sec ${v} + \\tan ${v}) = \\sec^2 ${v} - \\tan^2 ${v} = 1`;
        const sec = (x: number) => 1 / Math.cos(x);
        const item = rng.pick([
          {
            expr: `\\frac{1}{\\sec ${v} + \\tan ${v}}`,
            ans: `\\sec ${v} - \\tan ${v}`,
            wrong: [`\\sec ${v} + \\tan ${v}`, "1", `\\cos ${v}`],
            use: conj,
            mid: `\\frac{\\sec ${v} - \\tan ${v}}{(\\sec ${v} + \\tan ${v})(\\sec ${v} - \\tan ${v})} = \\frac{\\sec ${v} - \\tan ${v}}{1}`,
            f: (x: number) => 1 / (sec(x) + Math.tan(x)),
            g: (x: number) => sec(x) - Math.tan(x),
            why: [
              [
                "This is the denominator itself; its reciprocal is the other factor, with the opposite sign.",
                "这是分母本身；它的倒数是另一个因式，符号相反。",
              ],
              [
                "$\\sec + \\tan$ is not $1$ in general, so its reciprocal is not $1$.",
                "$\\sec + \\tan$ 一般不等于 $1$，所以它的倒数也不是 $1$。",
              ],
              [
                "$\\cos$ is the reciprocal of $\\sec$ alone, but the denominator also has the tangent.",
                "$\\cos$ 只是 $\\sec$ 的倒数，而分母中还有正切。",
              ],
            ],
          },
          {
            expr: `\\frac{1}{\\sec ${v} - \\tan ${v}}`,
            ans: `\\sec ${v} + \\tan ${v}`,
            wrong: [`\\sec ${v} - \\tan ${v}`, "1", `\\cos ${v}`],
            use: conj,
            mid: `\\frac{\\sec ${v} + \\tan ${v}}{(\\sec ${v} - \\tan ${v})(\\sec ${v} + \\tan ${v})} = \\frac{\\sec ${v} + \\tan ${v}}{1}`,
            f: (x: number) => 1 / (sec(x) - Math.tan(x)),
            g: (x: number) => sec(x) + Math.tan(x),
            why: [
              [
                "This is the denominator itself; its reciprocal is the other factor, with the opposite sign.",
                "这是分母本身；它的倒数是另一个因式，符号相反。",
              ],
              [
                "$\\sec - \\tan$ is not $1$ in general, so its reciprocal is not $1$.",
                "$\\sec - \\tan$ 一般不等于 $1$，所以它的倒数也不是 $1$。",
              ],
              [
                "$\\cos$ is the reciprocal of $\\sec$ alone, but the denominator also has the tangent.",
                "$\\cos$ 只是 $\\sec$ 的倒数，而分母中还有正切。",
              ],
            ],
          },
          {
            expr: `(\\sec ${v} - \\tan ${v})^{-1}`,
            ans: `\\sec ${v} + \\tan ${v}`,
            wrong: [`\\sec ${v} - \\tan ${v}`, "1", `\\cot ${v}`],
            use: conj,
            mid: `\\frac{1}{\\sec ${v} - \\tan ${v}}`,
            f: (x: number) => 1 / (sec(x) - Math.tan(x)),
            g: (x: number) => sec(x) + Math.tan(x),
            why: [
              ["The power $-1$ takes the reciprocal; this leaves the factor unchanged.", "$-1$ 次方表示取倒数；这里却把因式原样留下了。"],
              [
                "$\\sec - \\tan$ is not $1$ in general, so its reciprocal is not $1$.",
                "$\\sec - \\tan$ 一般不等于 $1$，所以它的倒数也不是 $1$。",
              ],
              [
                "$\\cot$ is the reciprocal of $\\tan$ alone, but the factor also has the secant.",
                "$\\cot$ 只是 $\\tan$ 的倒数，而因式中还有正割。",
              ],
            ],
          },
          {
            expr: `(\\sec ${v} + \\tan ${v})(\\sec ${v} - \\tan ${v})`,
            ans: "1",
            wrong: ["-1", "2", `\\sec^2 ${v}`],
            use: `1 + \\tan^2 ${v} = \\sec^2 ${v}`,
            mid: `\\sec^2 ${v} - \\tan^2 ${v}`,
            f: (x: number) => (sec(x) + Math.tan(x)) * (sec(x) - Math.tan(x)),
            g: () => 1,
            why: [
              ["The secant square is the larger, so $\\sec^2 - \\tan^2$ is $+1$.", "正割的平方较大，所以 $\\sec^2 - \\tan^2$ 等于 $+1$。"],
              ["The product is a difference of squares, $\\sec^2 - \\tan^2$, not a sum.", "积是平方差 $\\sec^2 - \\tan^2$，不是和。"],
              ["The tangent square is subtracted, and $\\sec^2 - \\tan^2 = 1$.", "正切的平方被减去了，而 $\\sec^2 - \\tan^2 = 1$。"],
            ],
          },
          {
            expr: `(\\sec ${v})^2 - (\\tan ${v})^2`,
            ans: "1",
            wrong: ["-1", "0", `\\sec^2 ${v} - 1`],
            use: `1 + \\tan^2 ${v} = \\sec^2 ${v}`,
            mid: `\\sec^2 ${v} - \\tan^2 ${v}`,
            f: (x: number) => sec(x) ** 2 - Math.tan(x) ** 2,
            g: () => 1,
            why: [
              ["The secant square is the larger, so the difference is $+1$.", "正割的平方较大，所以差是 $+1$。"],
              ["$\\sec^2$ and $\\tan^2$ differ by exactly $1$.", "$\\sec^2$ 和 $\\tan^2$ 恰好相差 $1$。"],
              [
                "$\\sec^2 - 1$ is $\\tan^2$, but here $\\tan^2$ is taken from $\\sec^2$, which leaves $1$.",
                "$\\sec^2 - 1$ 是 $\\tan^2$，而这里是从 $\\sec^2$ 中减去 $\\tan^2$，剩下 $1$。",
              ],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, 1, t("Secant and tangent are linked by", "正割与正切满足")),
          rewriteReasons(item),
        );
      },
    },
  ],
};

// ─── 4.10.6 Cotangent-cosecant identity ─────────────────────────────────────

/** simplifyingTrigonometricExpressionsUsingTheCotangentCosecantIdentity applies 1 + cot² = csc². */
export const simplifyingTrigonometricExpressionsUsingTheCotangentCosecantIdentity: TopicDef = {
  id: "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity",
  title: t("Simplifying Trigonometric Expressions Using the Cotangent-Cosecant Identity", "利用余切-余割恒等式化简表达式"),
  summary: t(
    "Simplify expressions using 1 + cot²(θ) = csc²(θ) and csc²(θ) - cot²(θ) = 1.",
    "利用恒等式 1 + cot²(θ) = csc²(θ) 与 csc²(θ) - cot²(θ) = 1 化简三角表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-secant-tangent-identity"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  intro: t(
    `Dividing $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ by $\\sin^{2}\\theta$, instead of by $\\cos^{2}\\theta$, gives the third Pythagorean identity:

$$1 + \\cot^{2}\\theta = \\csc^{2}\\theta$$

It holds wherever $\\sin\\theta \\ne 0$, and pairs cotangent with cosecant just as $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$ pairs tangent with secant.

Check: at $\\theta = 30^{\\circ}$, $\\cot\\theta = \\sqrt{3}$ and $\\csc\\theta = 2$, and $1 + 3 = 4 = 2^{2}$.

In this lesson we simplify expressions and fractions with the cotangent and cosecant identity, and find a cosecant from a cotangent.`,
    `把 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ 两边除以 $\\sin^{2}\\theta$（而不是 $\\cos^{2}\\theta$），得到第三个勾股恒等式：

$$1 + \\cot^{2}\\theta = \\csc^{2}\\theta$$

只要 $\\sin\\theta \\ne 0$ 它就成立；它把余切与余割配对，正如 $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$ 把正切与正割配对。

检验：当 $\\theta = 30^{\\circ}$ 时，$\\cot\\theta = \\sqrt{3}$，$\\csc\\theta = 2$，而 $1 + 3 = 4 = 2^{2}$。

这节课我们用余切与余割的恒等式化简式子和分式，并由余切求余割。`,
  ),
  knowledgePoints: [
    {
      id: "cotangent-cosecant-basic",
      title: t("Basic cotangent-cosecant substitutions", "余切-余割基本代换"),
      explanation: t(
        `Dividing $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ by $\\sin^{2}\\theta$ gives $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$, and rearranging it gives the other forms:

$$\\csc^{2}\\theta - \\cot^{2}\\theta = 1, \\quad \\csc^{2}\\theta - 1 = \\cot^{2}\\theta$$

A product can hide it too: $\\csc^{2}\\theta(1 - \\cos^{2}\\theta) = \\csc^{2}\\theta\\sin^{2}\\theta = 1$. Check: at $\\theta = 30^{\\circ}$, $\\csc^{2}\\theta = 4$ and $1 - \\cos^{2}\\theta = 1 - \\frac{3}{4} = \\frac{1}{4}$, and $4 \\cdot \\frac{1}{4} = 1$.

> **Watch out.** Cosecant goes with cotangent and secant with tangent: $\\csc^{2}\\theta - 1$ is $\\cot^{2}\\theta$, not $\\tan^{2}\\theta$. The cosecant square is the larger, so $\\csc^{2}\\theta - \\cot^{2}\\theta = 1$ and $\\cot^{2}\\theta - \\csc^{2}\\theta = -1$.`,
        `把 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$ 两边除以 $\\sin^{2}\\theta$ 得 $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$，变形得到其他形式：

$$\\csc^{2}\\theta - \\cot^{2}\\theta = 1, \\quad \\csc^{2}\\theta - 1 = \\cot^{2}\\theta$$

乘积里也可能藏着它：$\\csc^{2}\\theta(1 - \\cos^{2}\\theta) = \\csc^{2}\\theta\\sin^{2}\\theta = 1$。检验：当 $\\theta = 30^{\\circ}$ 时，$\\csc^{2}\\theta = 4$，$1 - \\cos^{2}\\theta = 1 - \\frac{3}{4} = \\frac{1}{4}$，而 $4 \\cdot \\frac{1}{4} = 1$。

> **注意。** 余割与余切配对，正割与正切配对：$\\csc^{2}\\theta - 1$ 是 $\\cot^{2}\\theta$，不是 $\\tan^{2}\\theta$。余割的平方较大，所以 $\\csc^{2}\\theta - \\cot^{2}\\theta = 1$，而 $\\cot^{2}\\theta - \\csc^{2}\\theta = -1$。`,
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta"]);
        const id = `1 + \\cot^{2}${v} = \\csc^{2}${v}`;
        const csc = (x: number) => 1 / Math.sin(x);
        const cot = (x: number) => Math.cos(x) / Math.sin(x);
        const item = rng.pick([
          {
            expr: `\\csc^{2}${v} - \\cot^{2}${v}`,
            ans: "1",
            wrong: ["-1", "0", `\\sin^{2}${v}`],
            use: id,
            mid: "",
            f: (x: number) => csc(x) ** 2 - cot(x) ** 2,
            g: () => 1,
            why: [
              [
                "The cosecant square is the larger, since $\\csc^2 = 1 + \\cot^2$, so the difference is $+1$.",
                "余割的平方较大，因为 $\\csc^2 = 1 + \\cot^2$，所以差是 $+1$。",
              ],
              ["$\\csc^2$ and $\\cot^2$ differ by exactly $1$.", "$\\csc^2$ 和 $\\cot^2$ 恰好相差 $1$。"],
              ["The difference is the number $1$, not a function of the angle.", "差是数 $1$，不是角的函数。"],
            ],
          },
          {
            expr: `\\cot^{2}${v} - \\csc^{2}${v}`,
            ans: "-1",
            wrong: ["1", "0", `-\\sin^{2}${v}`],
            use: id,
            mid: "",
            f: (x: number) => cot(x) ** 2 - csc(x) ** 2,
            g: () => -1,
            why: [
              [
                "The order is reversed: the smaller square comes first, so the difference is $-1$.",
                "顺序反了：较小的平方在前，所以差是 $-1$。",
              ],
              ["$\\cot^2$ and $\\csc^2$ differ by exactly $1$.", "$\\cot^2$ 和 $\\csc^2$ 恰好相差 $1$。"],
              ["The difference is the number $-1$, not a function of the angle.", "差是数 $-1$，不是角的函数。"],
            ],
          },
          {
            expr: `\\csc^{2}${v} - 1`,
            ans: `\\cot^{2}${v}`,
            wrong: [`\\tan^{2}${v}`, "1", `\\sin^{2}${v}`],
            use: id,
            mid: "",
            f: (x: number) => csc(x) ** 2 - 1,
            g: (x: number) => cot(x) ** 2,
            why: [
              [
                "Tangent goes with secant: $\\sec^2 - 1 = \\tan^2$. With cosecant it is $\\cot^2$.",
                "正切与正割配对：$\\sec^2 - 1 = \\tan^2$。与余割配对的是 $\\cot^2$。",
              ],
              ["Taking $1$ from $\\csc^2$ leaves $\\cot^2$, not $1$.", "$\\csc^2$ 减去 $1$ 剩下 $\\cot^2$，不是 $1$。"],
              ["$\\sin^2$ is the reciprocal of $\\csc^2$, not $\\csc^2 - 1$.", "$\\sin^2$ 是 $\\csc^2$ 的倒数，不是 $\\csc^2 - 1$。"],
            ],
          },
          {
            expr: `1 + \\cot^{2}${v}`,
            ans: `\\csc^{2}${v}`,
            wrong: [`\\sec^{2}${v}`, "1", `\\cos^{2}${v}`],
            use: id,
            mid: "",
            f: (x: number) => 1 + cot(x) ** 2,
            g: (x: number) => csc(x) ** 2,
            why: [
              [
                "Secant goes with tangent: $1 + \\tan^2 = \\sec^2$. With cotangent it is $\\csc^2$.",
                "正割与正切配对：$1 + \\tan^2 = \\sec^2$。与余切配对的是 $\\csc^2$。",
              ],
              [
                "$\\cot^2$ is added to $1$, so the result is more than $1$ unless the cotangent is $0$.",
                "$1$ 加上了 $\\cot^2$，所以除非余切为 $0$，结果都大于 $1$。",
              ],
              [
                "$\\cos^2$ is $1 - \\sin^2$, from a different identity; $1 + \\cot^2$ is $\\csc^2$.",
                "$\\cos^2$ 是 $1 - \\sin^2$，来自另一个恒等式；$1 + \\cot^2$ 是 $\\csc^2$。",
              ],
            ],
          },
          {
            expr: `(\\csc ${v} - \\cot ${v})(\\csc ${v} + \\cot ${v})`,
            ans: "1",
            wrong: ["-1", "0", "2"],
            use: id,
            mid: `\\csc^{2}${v} - \\cot^{2}${v}`,
            f: (x: number) => (csc(x) - cot(x)) * (csc(x) + cot(x)),
            g: () => 1,
            why: [
              [
                "The product is $\\csc^2 - \\cot^2$, and the cosecant square is the larger, so it is $+1$.",
                "积是 $\\csc^2 - \\cot^2$，余割的平方较大，所以是 $+1$。",
              ],
              ["$\\csc^2$ and $\\cot^2$ differ by exactly $1$.", "$\\csc^2$ 和 $\\cot^2$ 恰好相差 $1$。"],
              [
                "The product is a difference of squares, $\\csc^2 - \\cot^2 = 1$, not a sum.",
                "积是平方差 $\\csc^2 - \\cot^2 = 1$，不是和。",
              ],
            ],
          },
          {
            expr: `\\csc^{2}${v} - \\cot^{2}${v} + 1`,
            ans: "2",
            wrong: ["1", "0", `-\\cot^{2}${v}`],
            use: id,
            mid: "1 + 1",
            f: (x: number) => csc(x) ** 2 - cot(x) ** 2 + 1,
            g: () => 2,
            why: [
              ["$\\csc^2 - \\cot^2$ is $1$, and the $+1$ at the end is still added.", "$\\csc^2 - \\cot^2$ 是 $1$，最后的 $+1$ 还要加上。"],
              ["$\\csc^2 - \\cot^2$ is $1$, not $-1$, so the sum is $1 + 1$.", "$\\csc^2 - \\cot^2$ 是 $1$，不是 $-1$，所以和是 $1 + 1$。"],
              ["$\\csc^2 - \\cot^2$ is $1$, so no cotangent is left.", "$\\csc^2 - \\cot^2$ 是 $1$，所以不会剩下余切。"],
            ],
          },
          {
            expr: `\\csc^{2}${v}(1 - \\cos^{2}${v})`,
            ans: "1",
            wrong: [`\\csc^{2}${v}`, `\\sin^{2}${v}`, "0"],
            use: `1 - \\cos^{2}${v} = \\sin^{2}${v}`,
            mid: `\\csc^{2}${v}\\sin^{2}${v}`,
            f: (x: number) => csc(x) ** 2 * (1 - Math.cos(x) ** 2),
            g: () => 1,
            why: [
              [
                "$1 - \\cos^2$ is $\\sin^2$, the reciprocal of $\\csc^2$, so the two cancel.",
                "$1 - \\cos^2$ 是 $\\sin^2$，它是 $\\csc^2$ 的倒数，所以两者约去。",
              ],
              ["The $\\csc^2$ in front multiplies $\\sin^2$ and cancels it.", "前面的 $\\csc^2$ 乘以 $\\sin^2$，正好把它约去。"],
              [
                "$1 - \\cos^2$ is $\\sin^2$, not $0$, except where the sine is $0$.",
                "$1 - \\cos^2$ 是 $\\sin^2$，不是 $0$，除非正弦为 $0$。",
              ],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, 1, t("The identity to use is", "要用的恒等式是")),
          rewriteReasons(item),
        );
      },
    },
    {
      id: "cotangent-cosecant-fractions",
      title: t("Cotangent-cosecant fractions and reciprocals", "余切-余割分式与倒数关系"),
      explanation: t(
        `In a fraction, first replace any expression from the cotangent and cosecant identity by its simpler equal, then cancel. When the numerator becomes $1$, the result is the reciprocal of the denominator:

$$\\frac{\\csc^{2}\\theta - \\cot^{2}\\theta}{\\cot\\theta} = \\frac{1}{\\cot\\theta} = \\tan\\theta$$

Factoring the identity, $(\\csc\\theta - \\cot\\theta)(\\csc\\theta + \\cot\\theta) = 1$, so the two factors are reciprocals: $\\frac{1}{\\csc\\theta + \\cot\\theta} = \\csc\\theta - \\cot\\theta$. Check: at $\\theta = 30^{\\circ}$, $\\csc\\theta = 2$ and $\\cot\\theta = \\sqrt{3}$, and $(2 + \\sqrt{3})(2 - \\sqrt{3}) = 4 - 3 = 1$.

> **Watch out.** $\\frac{1}{\\csc}$ is $\\sin$ and $\\frac{1}{\\cot}$ is $\\tan$; a numerator of $1$ does not make the whole fraction $1$. And the reciprocal of $\\csc\\theta + \\cot\\theta$ flips the sign between the terms.`,
        `在分式中，先把余切与余割恒等式中的式子换成更简单的等值式，再约分。分子变成 $1$ 时，结果是分母的倒数：

$$\\frac{\\csc^{2}\\theta - \\cot^{2}\\theta}{\\cot\\theta} = \\frac{1}{\\cot\\theta} = \\tan\\theta$$

把恒等式分解得 $(\\csc\\theta - \\cot\\theta)(\\csc\\theta + \\cot\\theta) = 1$，所以两个因式互为倒数：$\\frac{1}{\\csc\\theta + \\cot\\theta} = \\csc\\theta - \\cot\\theta$。检验：当 $\\theta = 30^{\\circ}$ 时，$\\csc\\theta = 2$，$\\cot\\theta = \\sqrt{3}$，而 $(2 + \\sqrt{3})(2 - \\sqrt{3}) = 4 - 3 = 1$。

> **注意。** $\\frac{1}{\\csc}$ 是 $\\sin$，$\\frac{1}{\\cot}$ 是 $\\tan$；分子是 $1$ 并不意味着整个分式是 $1$。$\\csc\\theta + \\cot\\theta$ 的倒数要把两项之间的符号反过来。`,
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta", "u"]);
        const conj = `(\\csc ${v} - \\cot ${v})(\\csc ${v} + \\cot ${v}) = \\csc^{2}${v} - \\cot^{2}${v} = 1`;
        const csc = (x: number) => 1 / Math.sin(x);
        const cot = (x: number) => Math.cos(x) / Math.sin(x);
        const item = rng.pick([
          {
            expr: `\\frac{\\csc^{2}${v} - 1}{\\cot ${v}}`,
            ans: `\\cot ${v}`,
            wrong: [`\\tan ${v}`, "1", `\\csc ${v}`],
            use: `\\csc^{2}${v} - 1 = \\cot^{2}${v}`,
            mid: `\\frac{\\cot^{2}${v}}{\\cot ${v}}`,
            f: (x: number) => (csc(x) ** 2 - 1) / cot(x),
            g: cot,
            why: [
              ["$\\cot^2$ over $\\cot$ leaves $\\cot$, not its reciprocal.", "$\\cot^2$ 除以 $\\cot$ 剩下 $\\cot$，不是它的倒数。"],
              ["$\\cot^2$ over $\\cot$ leaves one factor of $\\cot$, not $1$.", "$\\cot^2$ 除以 $\\cot$ 剩下一个 $\\cot$，不是 $1$。"],
              ["$\\csc^2 - 1$ is $\\cot^2$, so the cosecant is gone.", "$\\csc^2 - 1$ 是 $\\cot^2$，所以余割没有了。"],
            ],
          },
          {
            expr: `\\frac{1}{\\csc ${v} + \\cot ${v}}`,
            ans: `\\csc ${v} - \\cot ${v}`,
            wrong: [`\\csc ${v} + \\cot ${v}`, "1", `\\sin ${v}`],
            use: conj,
            mid: `\\frac{\\csc ${v} - \\cot ${v}}{(\\csc ${v} + \\cot ${v})(\\csc ${v} - \\cot ${v})} = \\frac{\\csc ${v} - \\cot ${v}}{1}`,
            f: (x: number) => 1 / (csc(x) + cot(x)),
            g: (x: number) => csc(x) - cot(x),
            why: [
              [
                "This is the denominator itself; its reciprocal is the other factor, with the opposite sign.",
                "这是分母本身；它的倒数是另一个因式，符号相反。",
              ],
              [
                "$\\csc + \\cot$ is not $1$ in general, so its reciprocal is not $1$.",
                "$\\csc + \\cot$ 一般不等于 $1$，所以它的倒数也不是 $1$。",
              ],
              [
                "$\\sin$ is the reciprocal of $\\csc$ alone, but the denominator also has the cotangent.",
                "$\\sin$ 只是 $\\csc$ 的倒数，而分母中还有余切。",
              ],
            ],
          },
          {
            expr: `\\frac{\\csc^{2}${v} - \\cot^{2}${v}}{\\csc ${v}}`,
            ans: `\\sin ${v}`,
            wrong: [`\\csc ${v}`, "1", `\\cos ${v}`],
            use: `\\csc^{2}${v} - \\cot^{2}${v} = 1`,
            mid: `\\frac{1}{\\csc ${v}}`,
            f: (x: number) => (csc(x) ** 2 - cot(x) ** 2) / csc(x),
            g: (x: number) => Math.sin(x),
            why: [
              ["The numerator is $1$, so the result is the reciprocal of the cosecant.", "分子是 $1$，所以结果是余割的倒数。"],
              ["Only the numerator is $1$; the cosecant in the denominator remains.", "只有分子是 $1$；分母上的余割还在。"],
              ["The reciprocal of the cosecant is the sine, not the cosine.", "余割的倒数是正弦，不是余弦。"],
            ],
          },
          {
            expr: `\\frac{1}{\\csc ${v} - \\cot ${v}}`,
            ans: `\\csc ${v} + \\cot ${v}`,
            wrong: [`\\csc ${v} - \\cot ${v}`, "1", `\\cos ${v}`],
            use: conj,
            mid: `\\frac{\\csc ${v} + \\cot ${v}}{(\\csc ${v} - \\cot ${v})(\\csc ${v} + \\cot ${v})} = \\frac{\\csc ${v} + \\cot ${v}}{1}`,
            f: (x: number) => 1 / (csc(x) - cot(x)),
            g: (x: number) => csc(x) + cot(x),
            why: [
              [
                "This is the denominator itself; its reciprocal is the other factor, with the opposite sign.",
                "这是分母本身；它的倒数是另一个因式，符号相反。",
              ],
              [
                "$\\csc - \\cot$ is not $1$ in general, so its reciprocal is not $1$.",
                "$\\csc - \\cot$ 一般不等于 $1$，所以它的倒数也不是 $1$。",
              ],
              [
                "The reciprocal is a sum of cosecant and cotangent; no cosine on its own comes out.",
                "倒数是余割与余切的和；不会单独得出余弦。",
              ],
            ],
          },
          {
            expr: `\\frac{\\cot^{2}${v} + 1}{\\csc ${v}}`,
            ans: `\\csc ${v}`,
            wrong: [`\\sin ${v}`, `\\cot ${v}`, "1"],
            use: `1 + \\cot^{2}${v} = \\csc^{2}${v}`,
            mid: `\\frac{\\csc^{2}${v}}{\\csc ${v}}`,
            f: (x: number) => (cot(x) ** 2 + 1) / csc(x),
            g: csc,
            why: [
              ["$\\csc^2$ over $\\csc$ leaves $\\csc$, not its reciprocal.", "$\\csc^2$ 除以 $\\csc$ 剩下 $\\csc$，不是它的倒数。"],
              ["$\\cot^2 + 1$ is $\\csc^2$, so the cotangent is gone.", "$\\cot^2 + 1$ 是 $\\csc^2$，所以余切没有了。"],
              ["$\\csc^2$ over $\\csc$ leaves one factor of $\\csc$, not $1$.", "$\\csc^2$ 除以 $\\csc$ 剩下一个 $\\csc$，不是 $1$。"],
            ],
          },
          {
            expr: `\\frac{\\csc^{2}${v} - \\cot^{2}${v}}{\\cot ${v}}`,
            ans: `\\tan ${v}`,
            wrong: [`\\cot ${v}`, `\\csc ${v}`, "1"],
            use: `\\csc^{2}${v} - \\cot^{2}${v} = 1`,
            mid: `\\frac{1}{\\cot ${v}}`,
            f: (x: number) => (csc(x) ** 2 - cot(x) ** 2) / cot(x),
            g: (x: number) => Math.tan(x),
            why: [
              ["The numerator is $1$, so the result is the reciprocal of the cotangent.", "分子是 $1$，所以结果是余切的倒数。"],
              ["$\\csc^2 - \\cot^2$ is $1$, so the cosecant is gone.", "$\\csc^2 - \\cot^2$ 是 $1$，所以余割没有了。"],
              ["Only the numerator is $1$; the cotangent in the denominator remains.", "只有分子是 $1$；分母上的余切还在。"],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          rewritten(item, v, 1, t("The form of the identity to use is", "要用的恒等式形式是")),
          rewriteReasons(item),
        );
      },
    },
  ],
};

// ─── 4.10.7 Cofunction identities ───────────────────────────────────────────

/** simplifyingTrigonometricExpressionsUsingCofunctionIdentities applies cofunctions. */
export const simplifyingTrigonometricExpressionsUsingCofunctionIdentities: TopicDef = {
  id: "simplifying-trigonometric-expressions-using-cofunction-identities",
  title: t("Simplifying Trigonometric Expressions Using Cofunction Identities", "利用余角（诱导）恒等式化简表达式"),
  summary: t(
    "Simplify expressions using cofunction identities sin(π/2 - θ) = cos(θ), cos(π/2 - θ) = sin(θ), and tan(π/2 - θ) = cot(θ).",
    "利用余角恒等式 sin(π/2 - θ) = cos(θ)、cos(π/2 - θ) = sin(θ) 和 tan(π/2 - θ) = cot(θ) 化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-basic-trigonometric-identities"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.TF.C.8"],
  intro: t(
    `In a right triangle the two acute angles add up to $90^{\\circ}$, and the side opposite one of them is adjacent to the other. So the sine of one angle is the cosine of the other:

$$\\sin\\theta = \\cos(90^{\\circ} - \\theta), \\quad \\tan\\theta = \\cot(90^{\\circ} - \\theta)$$

Sine and cosine, tangent and cotangent, secant and cosecant are cofunctions: each pair swaps between complementary angles.

Check: $\\sin 30^{\\circ} = \\frac{1}{2}$, and $\\cos 60^{\\circ} = \\frac{1}{2}$.

In this lesson we simplify expressions with the cofunction identities in radians and with numerical angles, and solve equations with them.`,
    `直角三角形的两个锐角之和是 $90^{\\circ}$，其中一个角的对边是另一个角的邻边。所以一个角的正弦等于另一个角的余弦：

$$\\sin\\theta = \\cos(90^{\\circ} - \\theta), \\quad \\tan\\theta = \\cot(90^{\\circ} - \\theta)$$

正弦与余弦、正切与余切、正割与余割互为余函数：在互余的两个角之间，它们互相交换。

检验：$\\sin 30^{\\circ} = \\frac{1}{2}$，而 $\\cos 60^{\\circ} = \\frac{1}{2}$。

这节课我们在弧度制和具体角度中用余角恒等式化简式子，并用它们解方程。`,
  ),
  knowledgePoints: [
    {
      id: "cofunction-identities-basic",
      title: t("Cofunction identities in radians", "弧度制下的余角恒等式"),
      figure: remainingDrawings5["simplifying-trigonometric-expressions-using-cofunction-identities#cofunction-identities-basic"],
      explanation: t(
        `Two angles that add up to a right angle are complementary, and each trigonometric function of one equals the cofunction of the other:

$$\\sin\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cos\\theta, \\quad \\cos\\left(\\frac{\\pi}{2} - \\theta\\right) = \\sin\\theta, \\quad \\tan\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cot\\theta$$

and likewise secant and cosecant swap. For example, $\\tan\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cot\\theta$. Check: at $\\theta = \\frac{\\pi}{6}$, $\\tan\\frac{\\pi}{3} = \\sqrt{3}$ and $\\cot\\frac{\\pi}{6} = \\sqrt{3}$.

Adding $\\frac{\\pi}{2}$ instead is a quarter turn, which moves the point $(\\cos\\theta, \\sin\\theta)$ to $(-\\sin\\theta, \\cos\\theta)$. So $\\sin\\left(\\frac{\\pi}{2} + \\theta\\right) = \\cos\\theta$ and $\\cos\\left(\\frac{\\pi}{2} + \\theta\\right) = -\\sin\\theta$.

> **Watch out.** Subtracting from $\\frac{\\pi}{2}$ swaps each function for its cofunction with no change of sign. Adding $\\frac{\\pi}{2}$ also swaps them, but the cosine picks up a minus sign: $\\cos\\left(\\frac{\\pi}{2} + \\theta\\right) = -\\sin\\theta$.`,
        `和为直角的两个角互余，其中一个角的三角函数等于另一个角的余函数：

$$\\sin\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cos\\theta, \\quad \\cos\\left(\\frac{\\pi}{2} - \\theta\\right) = \\sin\\theta, \\quad \\tan\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cot\\theta$$

正割与余割也同样互换。例如 $\\tan\\left(\\frac{\\pi}{2} - \\theta\\right) = \\cot\\theta$。检验：当 $\\theta = \\frac{\\pi}{6}$ 时，$\\tan\\frac{\\pi}{3} = \\sqrt{3}$，而 $\\cot\\frac{\\pi}{6} = \\sqrt{3}$。

如果是加上 $\\frac{\\pi}{2}$，就是转四分之一圈，它把点 $(\\cos\\theta, \\sin\\theta)$ 移到 $(-\\sin\\theta, \\cos\\theta)$。所以 $\\sin\\left(\\frac{\\pi}{2} + \\theta\\right) = \\cos\\theta$，$\\cos\\left(\\frac{\\pi}{2} + \\theta\\right) = -\\sin\\theta$。

> **注意。** 用 $\\frac{\\pi}{2}$ 减去角时，每个函数换成它的余函数，符号不变。加上 $\\frac{\\pi}{2}$ 时也要互换，但余弦会多出负号：$\\cos\\left(\\frac{\\pi}{2} + \\theta\\right) = -\\sin\\theta$。`,
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta", "u"]);
        const less = t(
          `$\\frac{\\pi}{2} - ${v}$ is the complement of $${v}$, and a function of an angle equals the cofunction of its complement. The cofunction pairs are`,
          `$\\frac{\\pi}{2} - ${v}$ 是 $${v}$ 的余角，一个角的三角函数等于它余角的余函数。互为余函数的是`,
        );
        const more = t(
          `Adding $\\frac{\\pi}{2}$ turns the point of $${v}$ on the unit circle a quarter turn:`,
          `加上 $\\frac{\\pi}{2}$ 就是把单位圆上 $${v}$ 对应的点转四分之一圈：`,
        );
        const pairs = ["\\sin \\leftrightarrow \\cos, \\quad \\tan \\leftrightarrow \\cot, \\quad \\sec \\leftrightarrow \\csc"];
        const turn = [`(\\cos ${v}, \\sin ${v}) \\to (-\\sin ${v}, \\cos ${v})`];
        const sameSign = [
          "The angle is subtracted from $\\frac{\\pi}{2}$, so the function changes to its cofunction.",
          "角是从 $\\frac{\\pi}{2}$ 中减去的，所以函数要换成余函数。",
        ];
        const noMinus = [
          "Subtracting from $\\frac{\\pi}{2}$ swaps the function with no change of sign.",
          "从 $\\frac{\\pi}{2}$ 中减去角时，函数互换，符号不变。",
        ];
        const item = rng.pick([
          {
            expr: `\\sin\\left(\\frac{\\pi}{2} - ${v}\\right)`,
            ans: `\\cos ${v}`,
            wrong: [`\\sin ${v}`, `-\\cos ${v}`, `\\tan ${v}`],
            say: less,
            lines: pairs,
            f: (x: number) => Math.sin(Math.PI / 2 - x),
            g: (x: number) => Math.cos(x),
            why: [sameSign, noMinus, ["The cofunction of sine is cosine, not tangent.", "正弦的余函数是余弦，不是正切。"]],
          },
          {
            expr: `\\cos\\left(\\frac{\\pi}{2} - ${v}\\right)`,
            ans: `\\sin ${v}`,
            wrong: [`\\cos ${v}`, `-\\sin ${v}`, `\\cot ${v}`],
            say: less,
            lines: pairs,
            f: (x: number) => Math.cos(Math.PI / 2 - x),
            g: (x: number) => Math.sin(x),
            why: [sameSign, noMinus, ["The cofunction of cosine is sine, not cotangent.", "余弦的余函数是正弦，不是余切。"]],
          },
          {
            expr: `\\tan\\left(\\frac{\\pi}{2} - ${v}\\right)`,
            ans: `\\cot ${v}`,
            wrong: [`\\tan ${v}`, `-\\cot ${v}`, `\\sec ${v}`],
            say: less,
            lines: pairs,
            f: (x: number) => Math.tan(Math.PI / 2 - x),
            g: (x: number) => 1 / Math.tan(x),
            why: [sameSign, noMinus, ["The cofunction of tangent is cotangent, not secant.", "正切的余函数是余切，不是正割。"]],
          },
          {
            expr: `\\sec\\left(\\frac{\\pi}{2} - ${v}\\right)`,
            ans: `\\csc ${v}`,
            wrong: [`\\sec ${v}`, `-\\csc ${v}`, `\\cos ${v}`],
            say: less,
            lines: pairs,
            f: (x: number) => 1 / Math.cos(Math.PI / 2 - x),
            g: (x: number) => 1 / Math.sin(x),
            why: [sameSign, noMinus, ["Cosine is the reciprocal of secant, not its cofunction.", "余弦是正割的倒数，不是它的余函数。"]],
          },
          {
            expr: `\\csc\\left(\\frac{\\pi}{2} - ${v}\\right)`,
            ans: `\\sec ${v}`,
            wrong: [`\\csc ${v}`, `-\\sec ${v}`, `\\sin ${v}`],
            say: less,
            lines: pairs,
            f: (x: number) => 1 / Math.sin(Math.PI / 2 - x),
            g: (x: number) => 1 / Math.cos(x),
            why: [sameSign, noMinus, ["Sine is the reciprocal of cosecant, not its cofunction.", "正弦是余割的倒数，不是它的余函数。"]],
          },
          {
            expr: `\\cot\\left(\\frac{\\pi}{2} - ${v}\\right)`,
            ans: `\\tan ${v}`,
            wrong: [`\\cot ${v}`, `-\\tan ${v}`, `\\cos ${v}`],
            say: less,
            lines: pairs,
            f: (x: number) => 1 / Math.tan(Math.PI / 2 - x),
            g: (x: number) => Math.tan(x),
            why: [sameSign, noMinus, ["The cofunction of cotangent is tangent, not cosine.", "余切的余函数是正切，不是余弦。"]],
          },
          {
            expr: `\\sin\\left(\\frac{\\pi}{2} + ${v}\\right)`,
            ans: `\\cos ${v}`,
            wrong: [`-\\cos ${v}`, `\\sin ${v}`, `-\\sin ${v}`],
            say: more,
            lines: turn,
            f: (x: number) => Math.sin(Math.PI / 2 + x),
            g: (x: number) => Math.cos(x),
            why: [
              [
                "The new $y$-coordinate is $\\cos$ with no minus sign; the minus sign goes with the new cosine.",
                "新的纵坐标是不带负号的 $\\cos$；负号属于新的余弦。",
              ],
              ["Adding $\\frac{\\pi}{2}$ turns the sine into a cosine.", "加上 $\\frac{\\pi}{2}$ 会把正弦变成余弦。"],
              [
                "$-\\sin$ is the new $x$-coordinate, the cosine of the new angle, not its sine.",
                "$-\\sin$ 是新的横坐标，即新角的余弦，不是它的正弦。",
              ],
            ],
          },
          {
            expr: `\\cos\\left(\\frac{\\pi}{2} + ${v}\\right)`,
            ans: `-\\sin ${v}`,
            wrong: [`\\sin ${v}`, `\\cos ${v}`, `-\\cos ${v}`],
            say: more,
            lines: turn,
            f: (x: number) => Math.cos(Math.PI / 2 + x),
            g: (x: number) => -Math.sin(x),
            why: [
              ["The new $x$-coordinate is $-\\sin$: the sign is minus.", "新的横坐标是 $-\\sin$：符号是负的。"],
              ["Adding $\\frac{\\pi}{2}$ turns the cosine into a sine.", "加上 $\\frac{\\pi}{2}$ 会把余弦变成正弦。"],
              [
                "The new $x$-coordinate is $-\\sin$, not $-\\cos$: the cosine becomes a sine.",
                "新的横坐标是 $-\\sin$，不是 $-\\cos$：余弦变成了正弦。",
              ],
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          walked(
            [
              [["Name the identity", "找出恒等式"], item.say, item.lines],
              [["Apply it", "应用"], t("So", "所以"), [`${item.expr} = ${item.ans}`]],
            ],
            agreeAtSixth(v, item.expr, item.ans, item.f, item.g),
          ),
          item.wrong.map((w, i) => why(w, item.why[i]?.[0] ?? "", item.why[i]?.[1] ?? "")),
        );
      },
    },
    {
      id: "cofunction-identities-in-degree-expressions",
      title: t("Cofunction identities with numerical angles", "数字角度中的余角恒等式"),
      figure:
        remainingDrawings5["simplifying-trigonometric-expressions-using-cofunction-identities#cofunction-identities-in-degree-expressions"],
      explanation: t(
        `Look for two angles that add up to $90^{\\circ}$. A function of one equals the cofunction of the other, $\\sin(90^{\\circ} - x) = \\cos x$, so rewriting one of them makes the two terms the same and lets them combine. For $\\frac{\\sin 70^{\\circ}}{\\cos 20^{\\circ}}$, $70^{\\circ} + 20^{\\circ} = 90^{\\circ}$, so

$$\\cos 20^{\\circ} = \\cos(90^{\\circ} - 70^{\\circ}) = \\sin 70^{\\circ}, \\quad \\frac{\\sin 70^{\\circ}}{\\cos 20^{\\circ}} = 1$$

Check: $\\sin 70^{\\circ} \\approx 0.9397$ and $\\cos 20^{\\circ} \\approx 0.9397$.

> **Watch out.** The cofunction identity needs the angles to add up to $90^{\\circ}$: $\\sin 70^{\\circ}$ equals $\\cos 20^{\\circ}$, not $\\cos 70^{\\circ}$. For tangent the complement gives the reciprocal, $\\tan(90^{\\circ} - x) = \\frac{1}{\\tan x}$, so a product of the two is $1$.`,
        `找出和为 $90^{\\circ}$ 的两个角。一个角的函数等于另一个角的余函数，$\\sin(90^{\\circ} - x) = \\cos x$，所以改写其中一个，两项就相同，可以合并。对 $\\frac{\\sin 70^{\\circ}}{\\cos 20^{\\circ}}$，$70^{\\circ} + 20^{\\circ} = 90^{\\circ}$，所以

$$\\cos 20^{\\circ} = \\cos(90^{\\circ} - 70^{\\circ}) = \\sin 70^{\\circ}, \\quad \\frac{\\sin 70^{\\circ}}{\\cos 20^{\\circ}} = 1$$

检验：$\\sin 70^{\\circ} \\approx 0.9397$，$\\cos 20^{\\circ} \\approx 0.9397$。

> **注意。** 余角恒等式要求两角之和为 $90^{\\circ}$：$\\sin 70^{\\circ}$ 等于 $\\cos 20^{\\circ}$，而不是 $\\cos 70^{\\circ}$。对正切，余角给出倒数，$\\tan(90^{\\circ} - x) = \\frac{1}{\\tan x}$，所以两者之积是 $1$。`,
      ),
      generate(rng) {
        const deg = rng.int(10, 80);
        const comp = 90 - deg;
        const kind = rng.pick(["sinCos", "tanCot", "diff"] as const);
        const sinD = (d: number) => dec4(Math.sin(rad(d)));
        const pair: Step = [
          ["Spot the complementary angles", "找出互余的角"],
          t("The two angles add up to a right angle:", "两个角之和是直角："),
          [`${deg}^{\\circ} + ${comp}^{\\circ} = 90^{\\circ}`],
        ];
        const positive = why(
          "-1",
          `Both ratios are positive for angles between $0^{\\circ}$ and $90^{\\circ}$, so the result is not negative.`,
          `在 $0^{\\circ}$ 到 $90^{\\circ}$ 之间两个三角比都是正的，所以结果不是负的。`,
        );
        if (kind === "sinCos") {
          return oneOf(
            rng,
            t(
              `Simplify $\\frac{\\sin(${deg}^{\\circ})}{\\cos(${comp}^{\\circ})}$.`,
              `化简 $\\frac{\\sin(${deg}^{\\circ})}{\\cos(${comp}^{\\circ})}$。`,
            ),
            t("$1$", "$1$"),
            [t("$0$", "$0$"), t("$-1$", "$-1$"), t(`$\\tan(${deg}^{\\circ})$`, `$\\tan(${deg}^{\\circ})$`)],
            walked(
              [
                pair,
                [
                  ["Use the cofunction identity", "用余角恒等式"],
                  t("The cosine of the complement is the sine, so the two terms are equal:", "余角的余弦就是正弦，所以两项相等："),
                  [
                    `\\cos(${comp}^{\\circ}) = \\cos(90^{\\circ} - ${deg}^{\\circ}) = \\sin(${deg}^{\\circ})`,
                    `\\frac{\\sin(${deg}^{\\circ})}{\\cos(${comp}^{\\circ})} = \\frac{\\sin(${deg}^{\\circ})}{\\sin(${deg}^{\\circ})} = 1`,
                  ],
                ],
              ],
              t(
                `$\\sin(${deg}^{\\circ}) \\approx ${sinD(deg)}$ and $\\cos(${comp}^{\\circ}) \\approx ${sinD(deg)}$, so the quotient is $1$.`,
                `$\\sin(${deg}^{\\circ}) \\approx ${sinD(deg)}$，$\\cos(${comp}^{\\circ}) \\approx ${sinD(deg)}$，所以商是 $1$。`,
              ),
            ),
            [
              why("0", "The two terms are equal, so their quotient is $1$, not $0$.", "两项相等，所以商是 $1$，不是 $0$。"),
              positive,
              why(
                `\\tan(${deg}^{\\circ})`,
                `$\\tan(${deg}^{\\circ})$ is $\\frac{\\sin(${deg}^{\\circ})}{\\cos(${deg}^{\\circ})}$, with the cosine of the same angle; here the cosine is of the complement, which equals the sine.`,
                `$\\tan(${deg}^{\\circ})$ 是 $\\frac{\\sin(${deg}^{\\circ})}{\\cos(${deg}^{\\circ})}$，用的是同一个角的余弦；这里是余角的余弦，它等于正弦。`,
              ),
            ],
          );
        }
        if (kind === "tanCot") {
          return oneOf(
            rng,
            t(`Simplify $\\tan(${deg}^{\\circ}) \\tan(${comp}^{\\circ})$.`, `化简 $\\tan(${deg}^{\\circ}) \\tan(${comp}^{\\circ})$。`),
            t("$1$", "$1$"),
            [t("$0$", "$0$"), t("$-1$", "$-1$"), t(`$\\tan^{2}(${deg}^{\\circ})$`, `$\\tan^{2}(${deg}^{\\circ})$`)],
            walked(
              [
                pair,
                [
                  ["Use the cofunction identity", "用余角恒等式"],
                  t("The tangent of the complement is the cotangent, the reciprocal of the tangent:", "余角的正切是余切，即正切的倒数："),
                  [
                    `\\tan(${comp}^{\\circ}) = \\cot(${deg}^{\\circ}) = \\frac{1}{\\tan(${deg}^{\\circ})}`,
                    `\\tan(${deg}^{\\circ}) \\tan(${comp}^{\\circ}) = \\tan(${deg}^{\\circ}) \\cdot \\frac{1}{\\tan(${deg}^{\\circ})} = 1`,
                  ],
                ],
              ],
              t(
                `$\\tan(${deg}^{\\circ}) \\approx ${dec4(Math.tan(rad(deg)))}$ and $\\tan(${comp}^{\\circ}) \\approx ${dec4(Math.tan(rad(comp)))}$, and their product is about $${dec4(Math.tan(rad(deg)) * Math.tan(rad(comp)))}$.`,
                `$\\tan(${deg}^{\\circ}) \\approx ${dec4(Math.tan(rad(deg)))}$，$\\tan(${comp}^{\\circ}) \\approx ${dec4(Math.tan(rad(comp)))}$，两者之积约为 $${dec4(Math.tan(rad(deg)) * Math.tan(rad(comp)))}$。`,
              ),
            ),
            [
              why("0", "The two tangents are reciprocals, so their product is $1$, not $0$.", "两个正切互为倒数，所以积是 $1$，不是 $0$。"),
              positive,
              why(
                `\\tan^{2}(${deg}^{\\circ})`,
                `$\\tan(${comp}^{\\circ})$ is the reciprocal of $\\tan(${deg}^{\\circ})$, not equal to it, so the product is not a square.`,
                `$\\tan(${comp}^{\\circ})$ 是 $\\tan(${deg}^{\\circ})$ 的倒数，而不是与它相等，所以积不是平方。`,
              ),
            ],
          );
        }
        return oneOf(
          rng,
          t(`Simplify $\\sin(${deg}^{\\circ}) - \\cos(${comp}^{\\circ})$.`, `化简 $\\sin(${deg}^{\\circ}) - \\cos(${comp}^{\\circ})$。`),
          t("$0$", "$0$"),
          [t("$1$", "$1$"), t("$-1$", "$-1$"), t(`$2\\sin(${deg}^{\\circ})$`, `$2\\sin(${deg}^{\\circ})$`)],
          walked(
            [
              pair,
              [
                ["Use the cofunction identity", "用余角恒等式"],
                t("The cosine of the complement is the sine, so the two terms are equal:", "余角的余弦就是正弦，所以两项相等："),
                [
                  `\\cos(${comp}^{\\circ}) = \\cos(90^{\\circ} - ${deg}^{\\circ}) = \\sin(${deg}^{\\circ})`,
                  `\\sin(${deg}^{\\circ}) - \\cos(${comp}^{\\circ}) = \\sin(${deg}^{\\circ}) - \\sin(${deg}^{\\circ}) = 0`,
                ],
              ],
            ],
            t(
              `$\\sin(${deg}^{\\circ}) \\approx ${sinD(deg)}$ and $\\cos(${comp}^{\\circ}) \\approx ${sinD(deg)}$, so the difference is $0$.`,
              `$\\sin(${deg}^{\\circ}) \\approx ${sinD(deg)}$，$\\cos(${comp}^{\\circ}) \\approx ${sinD(deg)}$，所以差是 $0$。`,
            ),
          ),
          [
            why("1", "The two terms are equal, so they cancel to $0$.", "两项相等，所以相减得 $0$。"),
            why("-1", "The two terms are equal, so they cancel to $0$, not $-1$.", "两项相等，所以相减得 $0$，不是 $-1$。"),
            why(
              `2\\sin(${deg}^{\\circ})`,
              "The cosine is subtracted, not added, so the equal terms cancel.",
              "余弦是被减去的，不是加上的，所以相等的两项抵消。",
            ),
          ],
        );
      },
    },
  ],
};

// ─── 4.11.1 The sum and difference formulas for sine ────────────────────────

/** theSumAndDifferenceFormulasForSine applies sin(α ± β) = sin α cos β ± cos α sin β. */
export const theSumAndDifferenceFormulasForSine: TopicDef = {
  id: "the-sum-and-difference-formulas-for-sine",
  title: t("The Sum and Difference Formulas for Sine", "正弦的和差角公式"),
  summary: t(
    "Expand and collapse expressions using the angle addition and subtraction identities for sine: sin(α ± β) = sin α cos β ± cos α sin β.",
    "利用正弦的和角与差角公式 sin(α ± β) = sin α cos β ± cos α sin β 展开与化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-pythagorean-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `The sine of a sum is not the sum of the sines: $\\sin 90^{\\circ} = 1$, but $\\sin 30^{\\circ} + \\sin 60^{\\circ} = \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\approx 1.366$. The correct rule mixes sines and cosines:

$$\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta$$

Check: with $\\alpha = 30^{\\circ}$ and $\\beta = 60^{\\circ}$, $\\frac{1}{2} \\cdot \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} = \\frac{1}{4} + \\frac{3}{4} = 1 = \\sin 90^{\\circ}$.

In this lesson we recognise the expansions of $\\sin(\\alpha \\pm \\beta)$, collapse them to special values, and find the sine of a sum from two triangles.`,
    `和的正弦不等于正弦的和：$\\sin 90^{\\circ} = 1$，但 $\\sin 30^{\\circ} + \\sin 60^{\\circ} = \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\approx 1.366$。正确的法则把正弦和余弦交叉相乘：

$$\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta$$

检验：取 $\\alpha = 30^{\\circ}$，$\\beta = 60^{\\circ}$，$\\frac{1}{2} \\cdot \\frac{1}{2} + \\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2} = \\frac{1}{4} + \\frac{3}{4} = 1 = \\sin 90^{\\circ}$。

这节课我们认出 $\\sin(\\alpha \\pm \\beta)$ 的展开式，把它们合并成特殊值，并由两个三角形求和角的正弦。`,
  ),
  knowledgePoints: [
    {
      id: "sine-sum-difference-formulas",
      title: t("Sine sum and difference identities", "正弦和差公式形式"),
      explanation: t(
        `The sine of a sum is not the sum of the sines. The formulas mix the two angles' sines and cosines, and the sign in the middle matches the sign between the angles:

$$\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta, \\quad \\sin(\\alpha - \\beta) = \\sin\\alpha\\cos\\beta - \\cos\\alpha\\sin\\beta$$

Read backwards, they collapse an expansion to one sine: $\\sin 50^{\\circ}\\cos 20^{\\circ} - \\cos 50^{\\circ}\\sin 20^{\\circ} = \\sin(50^{\\circ} - 20^{\\circ}) = \\sin 30^{\\circ}$. Check: $\\sin 50^{\\circ}\\cos 20^{\\circ} \\approx 0.7198$ and $\\cos 50^{\\circ}\\sin 20^{\\circ} \\approx 0.2198$, and $0.7198 - 0.2198 = 0.5000 = \\sin 30^{\\circ}$.

> **Watch out.** The pattern sine times cosine, then cosine times sine, gives a sine; cosine times cosine and sine times sine gives a cosine. And in the sine formulas the sign between the terms is the same as the sign between the angles.`,
        `和的正弦不等于正弦的和。公式把两个角的正弦和余弦交叉相乘，中间的符号与两角之间的符号相同：

$$\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta, \\quad \\sin(\\alpha - \\beta) = \\sin\\alpha\\cos\\beta - \\cos\\alpha\\sin\\beta$$

反过来读，它们把展开式合并成一个正弦：$\\sin 50^{\\circ}\\cos 20^{\\circ} - \\cos 50^{\\circ}\\sin 20^{\\circ} = \\sin(50^{\\circ} - 20^{\\circ}) = \\sin 30^{\\circ}$。检验：$\\sin 50^{\\circ}\\cos 20^{\\circ} \\approx 0.7198$，$\\cos 50^{\\circ}\\sin 20^{\\circ} \\approx 0.2198$，而 $0.7198 - 0.2198 = 0.5000 = \\sin 30^{\\circ}$。

> **注意。** 正弦乘余弦、再余弦乘正弦的形式得到正弦；余弦乘余弦与正弦乘正弦的形式得到余弦。在正弦公式中，两项之间的符号与两角之间的符号相同。`,
      ),
      generate(rng) {
        const isSum = rng.bool();
        const b = rng.int(10, 40);
        const a = b + rng.int(3, 40);
        const opStr = isSum ? "+" : "-";
        const resAngle = isSum ? a + b : a - b;
        return reasoned(
          oneOf(
            rng,
            t(
              `Simplify $\\sin(${a}^{\\circ})\\cos(${b}^{\\circ}) ${opStr} \\cos(${a}^{\\circ})\\sin(${b}^{\\circ})$.`,
              `化简 $\\sin(${a}^{\\circ})\\cos(${b}^{\\circ}) ${opStr} \\cos(${a}^{\\circ})\\sin(${b}^{\\circ})$。`,
            ),
            t(`$\\sin(${resAngle}^{\\circ})$`, `$\\sin(${resAngle}^{\\circ})$`),
            [
              t(`$\\cos(${resAngle}^{\\circ})$`, `$\\cos(${resAngle}^{\\circ})$`),
              mathOption(`\\sin(${isSum ? a - b : a + b}^{\\circ})`),
              mathOption(`\\cos(${isSum ? a - b : a + b}^{\\circ})`),
            ],
            walked(
              [
                [
                  ["Match the formula", "对照公式"],
                  t(
                    `The expression is sine times cosine ${isSum ? "plus" : "minus"} cosine times sine, the ${isSum ? "sum" : "difference"} formula for sine:`,
                    `式子是正弦乘余弦${isSum ? "加" : "减"}余弦乘正弦，正是正弦的${isSum ? "和角" : "差角"}公式：`,
                  ),
                  [`\\sin(\\alpha ${opStr} \\beta) = \\sin \\alpha \\cos \\beta ${opStr} \\cos \\alpha \\sin \\beta`],
                ],
                [
                  ["Read off the angles", "读出两个角"],
                  t(
                    `Here $\\alpha = ${a}^{\\circ}$ and $\\beta = ${b}^{\\circ}$, so`,
                    `这里 $\\alpha = ${a}^{\\circ}$，$\\beta = ${b}^{\\circ}$，所以`,
                  ),
                  [
                    `\\sin(${a}^{\\circ})\\cos(${b}^{\\circ}) ${opStr} \\cos(${a}^{\\circ})\\sin(${b}^{\\circ}) = \\sin(${a}^{\\circ} ${opStr} ${b}^{\\circ}) = \\sin(${resAngle}^{\\circ})`,
                  ],
                ],
              ],
              t(
                `The expression is about $${dec4(Math.sin(rad(a)) * Math.cos(rad(b)) + (isSum ? 1 : -1) * Math.cos(rad(a)) * Math.sin(rad(b)))}$, and $\\sin(${resAngle}^{\\circ}) \\approx ${dec4(Math.sin(rad(resAngle)))}$.`,
                `原式约为 $${dec4(Math.sin(rad(a)) * Math.cos(rad(b)) + (isSum ? 1 : -1) * Math.cos(rad(a)) * Math.sin(rad(b)))}$，而 $\\sin(${resAngle}^{\\circ}) \\approx ${dec4(Math.sin(rad(resAngle)))}$。`,
              ),
            ),
          ),
          [
            [
              `$\\cos(${resAngle}^{\\circ})$`,
              "The pattern sine times cosine, cosine times sine collapses to a sine: a cosine comes from cosine times cosine and sine times sine.",
              "正弦乘余弦、余弦乘正弦的形式合并成正弦；余弦来自余弦乘余弦和正弦乘正弦。",
            ],
            [
              mathOption(`\\sin(${isSum ? a - b : a + b}^{\\circ})`).en,
              "The sign is the wrong way: in a sine formula the sign between the terms is the sign between the angles.",
              "符号反了：正弦公式中两项之间的符号就是两角之间的符号。",
            ],
            [
              mathOption(`\\cos(${isSum ? a - b : a + b}^{\\circ})`).en,
              "Both the function and the sign are wrong: this pattern gives a sine, with the same sign between the angles.",
              "函数和符号都错了：这个形式得到正弦，两角之间的符号也相同。",
            ],
          ],
        );
      },
    },
    {
      id: "collapsing-sine-to-special-values",
      title: t("Evaluating collapsed sine formulas", "正弦和差公式计算特殊角"),
      explanation: t(
        `An expression of the form $\\sin\\alpha\\cos\\beta \\pm \\cos\\alpha\\sin\\beta$ is the sine of the single angle $\\alpha \\pm \\beta$, and when that angle is special its exact value is known. For example,

$$\\sin 100^{\\circ}\\cos 55^{\\circ} - \\cos 100^{\\circ}\\sin 55^{\\circ} = \\sin(100^{\\circ} - 55^{\\circ}) = \\sin 45^{\\circ} = \\frac{\\sqrt{2}}{2}$$

Check: $\\sin 100^{\\circ}\\cos 55^{\\circ} \\approx 0.5649$ and $\\cos 100^{\\circ}\\sin 55^{\\circ} \\approx -0.1422$, and $0.5649 - (-0.1422) = 0.7071 \\approx \\frac{\\sqrt{2}}{2}$.

> **Watch out.** Collapse first and evaluate once: the separate factors are not special angles. Then read the value of the sine, not the cosine, and remember that sine is positive for every angle between $0^{\\circ}$ and $180^{\\circ}$, so $\\sin 120^{\\circ} = \\sin 60^{\\circ} = \\frac{\\sqrt{3}}{2}$.`,
        `形如 $\\sin\\alpha\\cos\\beta \\pm \\cos\\alpha\\sin\\beta$ 的式子是单个角 $\\alpha \\pm \\beta$ 的正弦；当这个角是特殊角时，它的精确值是已知的。例如

$$\\sin 100^{\\circ}\\cos 55^{\\circ} - \\cos 100^{\\circ}\\sin 55^{\\circ} = \\sin(100^{\\circ} - 55^{\\circ}) = \\sin 45^{\\circ} = \\frac{\\sqrt{2}}{2}$$

检验：$\\sin 100^{\\circ}\\cos 55^{\\circ} \\approx 0.5649$，$\\cos 100^{\\circ}\\sin 55^{\\circ} \\approx -0.1422$，而 $0.5649 - (-0.1422) = 0.7071 \\approx \\frac{\\sqrt{2}}{2}$。

> **注意。** 先合并，再只求一次值：单独的各个因式并不是特殊角。然后读出的是正弦的值，不是余弦的值；并且在 $0^{\\circ}$ 到 $180^{\\circ}$ 之间正弦都是正的，所以 $\\sin 120^{\\circ} = \\sin 60^{\\circ} = \\frac{\\sqrt{3}}{2}$。`,
      ),
      generate(rng) {
        const { a, b, isSum, target } = splitAngle(rng, [30, 45, 60, 90, 120, 135, 150]);
        const opStr = isSum ? "+" : "-";
        const ans = specialSin[target]!;
        const expr = `\\sin(${a}^{\\circ})\\cos(${b}^{\\circ}) ${opStr} \\cos(${a}^{\\circ})\\sin(${b}^{\\circ})`;
        return oneOf(
          rng,
          t(`Find the exact value of $${expr}$.`, `求 $${expr}$ 的精确值。`),
          mathOption(ans),
          [specialCos[target]!, negated(ans), "\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}", "0"].map(mathOption),
          walked(
            [
              [
                ["Collapse the expression", "合并式子"],
                t(
                  `This is the ${isSum ? "sum" : "difference"} formula for sine read backwards:`,
                  `这是反过来读的正弦${isSum ? "和角" : "差角"}公式：`,
                ),
                [`${expr} = \\sin(${a}^{\\circ} ${opStr} ${b}^{\\circ}) = \\sin(${target}^{\\circ})`],
              ],
              [
                ["Use the special value", "用特殊角的值"],
                t(`The angle $${target}^{\\circ}$ is special:`, `$${target}^{\\circ}$ 是特殊角：`),
                [`\\sin(${target}^{\\circ}) = ${ans}`],
              ],
            ],
            t(
              `$\\sin(${a}^{\\circ})\\cos(${b}^{\\circ}) \\approx ${dec4(Math.sin(rad(a)) * Math.cos(rad(b)))}$ and $\\cos(${a}^{\\circ})\\sin(${b}^{\\circ}) \\approx ${dec4(Math.cos(rad(a)) * Math.sin(rad(b)))}$, so the expression is about $${dec4(Math.sin(rad(a)) * Math.cos(rad(b)) + (isSum ? 1 : -1) * Math.cos(rad(a)) * Math.sin(rad(b)))}$, and $${ans} \\approx ${dec4(Math.sin(rad(target)))}$.`,
              `$\\sin(${a}^{\\circ})\\cos(${b}^{\\circ}) \\approx ${dec4(Math.sin(rad(a)) * Math.cos(rad(b)))}$，$\\cos(${a}^{\\circ})\\sin(${b}^{\\circ}) \\approx ${dec4(Math.cos(rad(a)) * Math.sin(rad(b)))}$，所以原式约为 $${dec4(Math.sin(rad(a)) * Math.cos(rad(b)) + (isSum ? 1 : -1) * Math.cos(rad(a)) * Math.sin(rad(b)))}$，而 $${ans} \\approx ${dec4(Math.sin(rad(target)))}$。`,
            ),
          ),
          [
            why(
              specialCos[target]!,
              `This is $\\cos(${target}^{\\circ})$; the pattern sine times cosine, cosine times sine collapses to a sine.`,
              `这是 $\\cos(${target}^{\\circ})$；正弦乘余弦、余弦乘正弦的形式合并成正弦。`,
            ),
            why(
              negated(ans),
              `The sign is wrong: the sine of $${target}^{\\circ}$ is ${target === 90 ? "$1$" : "positive"}, since $${target}^{\\circ}$ lies between $0^{\\circ}$ and $180^{\\circ}$.`,
              `符号错了：$${target}^{\\circ}$ 在 $0^{\\circ}$ 到 $180^{\\circ}$ 之间，所以它的正弦${target === 90 ? "是 $1$" : "是正的"}。`,
            ),
            ...(
              [
                ["\\frac{1}{2}", "30", "150"],
                ["\\frac{\\sqrt{2}}{2}", "45", "135"],
                ["\\frac{\\sqrt{3}}{2}", "60", "120"],
                ["0", "0", "180"],
              ] as const
            ).map(([w, p, q]) =>
              why(
                w,
                `$${w}$ is the sine of $${p}^{\\circ}$ and $${q}^{\\circ}$, but the collapsed angle is $${target}^{\\circ}$.`,
                `$${w}$ 是 $${p}^{\\circ}$ 和 $${q}^{\\circ}$ 的正弦，而合并后的角是 $${target}^{\\circ}$。`,
              ),
            ),
          ],
        );
      },
    },
  ],
};

// ─── 4.11.2 The sum and difference formulas for cosine ──────────────────────

/** theSumAndDifferenceFormulasForCosine applies cos(α ± β) = cos α cos β ∓ sin α sin β. */
export const theSumAndDifferenceFormulasForCosine: TopicDef = {
  id: "the-sum-and-difference-formulas-for-cosine",
  title: t("The Sum and Difference Formulas for Cosine", "余弦的和差角公式"),
  summary: t(
    "Expand and collapse expressions using the angle addition and subtraction identities for cosine: cos(α ± β) = cos α cos β ∓ sin α sin β.",
    "利用余弦的和角与差角公式 cos(α ± β) = cos α cos β ∓ sin α sin β 展开与化简表达式。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "cosine-sum-difference-formulas",
      title: t("Cosine sum and difference identities", "余弦和差公式形式"),
      explanation: t(
        "The cosine formulas multiply cosine with cosine and sine with sine. The sign in the middle is the opposite of the sign between the angles.\n\nNote the sign flip in cosine formulas:\n\n$$\\cos(\\alpha + \\beta) = \\cos \\alpha \\cos \\beta - \\sin \\alpha \\sin \\beta, \\quad \\cos(\\alpha - \\beta) = \\cos \\alpha \\cos \\beta + \\sin \\alpha \\sin \\beta$$",
        "余弦公式是余弦乘余弦、正弦乘正弦。中间的符号与两角之间的符号相反。\n\n注意余弦和差公式中的正负号反转：\n\n$$\\cos(\\alpha + \\beta) = \\cos \\alpha \\cos \\beta - \\sin \\alpha \\sin \\beta, \\quad \\cos(\\alpha - \\beta) = \\cos \\alpha \\cos \\beta + \\sin \\alpha \\sin \\beta$$",
      ),
      generate(rng) {
        const isSum = rng.bool();
        const b = rng.int(10, 45);
        const a = b + rng.int(3, 30);
        const signStr = isSum ? "-" : "+";
        const resAngle = isSum ? a + b : a - b;
        return oneOf(
          rng,
          t(
            `Simplify $\\cos(${a}^{\\circ})\\cos(${b}^{\\circ}) ${signStr} \\sin(${a}^{\\circ})\\sin(${b}^{\\circ})$.`,
            `化简 $\\cos(${a}^{\\circ})\\cos(${b}^{\\circ}) ${signStr} \\sin(${a}^{\\circ})\\sin(${b}^{\\circ})$。`,
          ),
          t(`$\\cos(${resAngle}^{\\circ})$`, `$\\cos(${resAngle}^{\\circ})$`),
          [
            t(`$\\sin(${resAngle}^{\\circ})$`, `$\\sin(${resAngle}^{\\circ})$`),
            mathOption(`\\cos(${isSum ? a - b : a + b}^{\\circ})`),
            mathOption(`\\sin(${isSum ? a - b : a + b}^{\\circ})`),
          ],
          t(
            `By the cosine ${isSum ? "sum" : "difference"} formula (remembering the sign flip), this equals $\\cos(${resAngle}^\\circ)$.`,
            `由余弦${isSum ? "和角" : "差角"}公式（注意符号反转），该式等于 $\\cos(${resAngle}^\\circ)$。`,
          ),
        );
      },
    },
    {
      id: "collapsing-cosine-to-special-values",
      title: t("Evaluating collapsed cosine formulas", "余弦和差公式计算特殊角"),
      explanation: t(
        "An expression of the form $\\cos\\alpha\\cos\\beta \\mp \\sin\\alpha\\sin\\beta$ can be read backwards as the cosine of a sum or difference, which is often a special angle.\n\nCollapsing terms with the cosine formula:\n\n$$\\cos(70^{\\circ})\\cos(10^{\\circ}) + \\sin(70^{\\circ})\\sin(10^{\\circ}) = \\cos(60^{\\circ}) = \\frac{1}{2}$$",
        "形如 $\\cos\\alpha\\cos\\beta \\mp \\sin\\alpha\\sin\\beta$ 的式子可以反过来看成两角和或差的余弦，这个角往往是特殊角。\n\n利用余弦和差公式合并求特殊角：\n\n$$\\cos(70^{\\circ})\\cos(10^{\\circ}) + \\sin(70^{\\circ})\\sin(10^{\\circ}) = \\cos(60^{\\circ}) = \\frac{1}{2}$$",
      ),
      generate(rng) {
        const { a, b, isSum, target } = splitAngle(rng, [30, 45, 60, 90, 120, 135, 150]);
        const signStr = isSum ? "-" : "+";
        const ans = specialCos[target]!;
        const expr = `\\cos(${a}^{\\circ})\\cos(${b}^{\\circ}) ${signStr} \\sin(${a}^{\\circ})\\sin(${b}^{\\circ})`;
        return oneOf(
          rng,
          t(`Find the exact value of $${expr}$.`, `求 $${expr}$ 的精确值。`),
          mathOption(ans),
          [specialSin[target]!, negated(ans), "\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}", "0"].map(mathOption),
          t(
            `The sign in the middle is the opposite of the sign between the angles, so this is $\\cos(${a}^\\circ ${isSum ? "+" : "-"} ${b}^\\circ) = \\cos(${target}^\\circ) = ${ans}$.`,
            `中间的符号与两角之间的符号相反，所以原式是 $\\cos(${a}^\\circ ${isSum ? "+" : "-"} ${b}^\\circ) = \\cos(${target}^\\circ) = ${ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.3 The sum and difference formulas for tangent ─────────────────────

/** theSumAndDifferenceFormulasForTangent applies tan(α ± β) = (tan α ± tan β)/(1 ∓ tan α tan β). */
export const theSumAndDifferenceFormulasForTangent: TopicDef = {
  id: "the-sum-and-difference-formulas-for-tangent",
  title: t("The Sum and Difference Formulas for Tangent", "正切的和差角公式"),
  summary: t(
    "Expand and collapse expressions using the tangent addition and subtraction formulas.",
    "利用正切的和角与差角公式展开与化简表达式。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-cosine"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "tangent-sum-difference-formulas",
      title: t("Tangent sum and difference identities", "正切和差公式形式"),
      explanation: t(
        "Dividing the sine formula by the cosine formula and then dividing every term by the product of the cosines gives formulas that use tangents alone. The angle addition and subtraction formulas for tangent are:\n\n$$\\tan(\\alpha + \\beta) = \\frac{\\tan\\alpha + \\tan\\beta}{1 - \\tan\\alpha\\tan\\beta}, \\quad \\tan(\\alpha - \\beta) = \\frac{\\tan\\alpha - \\tan\\beta}{1 + \\tan\\alpha\\tan\\beta}$$",
        "把正弦公式除以余弦公式，再把每一项都除以两个余弦的积，就得到只含正切的公式。正切的和差角公式为：\n\n$$\\tan(\\alpha + \\beta) = \\frac{\\tan\\alpha + \\tan\\beta}{1 - \\tan\\alpha\\tan\\beta}, \\quad \\tan(\\alpha - \\beta) = \\frac{\\tan\\alpha - \\tan\\beta}{1 + \\tan\\alpha\\tan\\beta}$$",
      ),
      generate(rng) {
        const isSum = rng.bool();
        const b = rng.int(10, 30);
        const a = b + rng.int(3, 29);
        const topSign = isSum ? "+" : "-";
        const botSign = isSum ? "-" : "+";
        const resAngle = isSum ? a + b : a - b;
        return oneOf(
          rng,
          t(
            `Simplify $\\frac{\\tan(${a}^{\\circ}) ${topSign} \\tan(${b}^{\\circ})}{1 ${botSign} \\tan(${a}^{\\circ})\\tan(${b}^{\\circ})}$.`,
            `化简 $\\frac{\\tan(${a}^{\\circ}) ${topSign} \\tan(${b}^{\\circ})}{1 ${botSign} \\tan(${a}^{\\circ})\\tan(${b}^{\\circ})}$。`,
          ),
          t(`$\\tan(${resAngle}^{\\circ})$`, `$\\tan(${resAngle}^{\\circ})$`),
          [
            t(`$\\cot(${resAngle}^{\\circ})$`, `$\\cot(${resAngle}^{\\circ})$`),
            mathOption(`\\tan(${isSum ? a - b : a + b}^{\\circ})`),
            mathOption(`\\cot(${isSum ? a - b : a + b}^{\\circ})`),
          ],
          t(
            `By the tangent ${isSum ? "sum" : "difference"} formula, the expression equals $\\tan(${resAngle}^\\circ)$.`,
            `由正切${isSum ? "和角" : "差角"}公式，该式等于 $\\tan(${resAngle}^\\circ)$。`,
          ),
        );
      },
    },
    {
      id: "collapsing-tangent-to-special-values",
      title: t("Evaluating collapsed tangent formulas", "正切和差公式计算特殊角"),
      explanation: t(
        "When an expression has exactly the shape of the tangent sum or difference formula, read off the two angles and replace the whole fraction by the tangent of their sum or difference. Collapsing tangent expressions to special angles:\n\n$$\\frac{\\tan(50^{\\circ}) - \\tan(20^{\\circ})}{1 + \\tan(50^{\\circ})\\tan(20^{\\circ})} = \\tan(30^{\\circ}) = \\frac{\\sqrt{3}}{3}$$",
        "当一个式子恰好具有正切和角或差角公式的形式时，读出两个角，把整个分式换成它们的和或差的正切。利用正切公式合并求特殊角：\n\n$$\\frac{\\tan(50^{\\circ}) - \\tan(20^{\\circ})}{1 + \\tan(50^{\\circ})\\tan(20^{\\circ})} = \\tan(30^{\\circ}) = \\frac{\\sqrt{3}}{3}$$",
      ),
      generate(rng) {
        const { a, b, isSum, target } = splitAngle(rng, [30, 45, 60, 120, 135, 150]);
        const topSign = isSum ? "+" : "-";
        const botSign = isSum ? "-" : "+";
        const ans = specialTan[target]!;
        const expr = `\\frac{\\tan(${a}^{\\circ}) ${topSign} \\tan(${b}^{\\circ})}{1 ${botSign} \\tan(${a}^{\\circ})\\tan(${b}^{\\circ})}`;
        return reasoned(
          oneOf(
            rng,
            t(`Find the exact value of $${expr}$.`, `求 $${expr}$ 的精确值。`),
            mathOption(ans),
            [negated(ans), "1", "\\sqrt{3}", "\\frac{\\sqrt{3}}{3}", "0"].map(mathOption),
            t(
              `Collapse using the tangent ${isSum ? "sum" : "difference"} formula: $\\tan(${a}^\\circ ${topSign} ${b}^\\circ) = \\tan(${target}^\\circ) = ${ans}$.`,
              `利用正切${isSum ? "和角" : "差角"}公式合并：$\\tan(${a}^\\circ ${topSign} ${b}^\\circ) = \\tan(${target}^\\circ) = ${ans}$。`,
            ),
          ),
          [
            [
              mathOption(negated(ans)).en,
              `The sign is wrong: the expression collapses to $\\tan ${target}^{\\circ}$, sign included.`,
              `符号错了：原式合并为 $\\tan ${target}^{\\circ}$，符号也要算上。`,
            ],
            ...["1", "\\sqrt{3}", "\\frac{\\sqrt{3}}{3}", "0"].map(
              (o) =>
                [
                  mathOption(o).en,
                  `That is the tangent of another angle: the expression collapses to $\\tan ${target}^{\\circ}$.`,
                  `这是另一个角的正切值：原式合并为 $\\tan ${target}^{\\circ}$。`,
                ] as const,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 4.11.4 Calculating sine ratios using sum formula ───────────────────────

/** calculatingTrigonometricRatiosUsingTheSumFormulaForSine finds exact values. */
export const calculatingTrigonometricRatiosUsingTheSumFormulaForSine: TopicDef = {
  id: "calculating-trigonometric-ratios-using-the-sum-formula-for-sine",
  title: t("Calculating Trigonometric Ratios Using the Sum Formula for Sine", "用正弦和差角公式求三角比的精确值"),
  summary: t(
    "Calculate the exact values of sine for non-standard angles such as 75° (5π/12) and 15° (π/12).",
    "利用正弦和差角公式计算 75° (5π/12) 与 15° (π/12) 等非标准特殊角的精确值。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine", "evaluating-trigonometric-expressions"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-sine", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "exact-sine-of-fifteen-and-seventy-five",
      title: t("Exact sine of 15° and 75°", "15° 与 75° 的正弦精确值"),
      explanation: t(
        "Angles such as $15^{\\circ}$ and $75^{\\circ}$ are sums or differences of familiar special angles, so the sum and difference formulas give their exact values. Using $75^{\\circ} = 45^{\\circ} + 30^{\\circ}$ and $15^{\\circ} = 45^{\\circ} - 30^{\\circ}$:\n\n$$\\sin(75^{\\circ}) = \\sin(45^{\\circ})\\cos(30^{\\circ}) + \\cos(45^{\\circ})\\sin(30^{\\circ}) = \\frac{\\sqrt{2}}{2}\\frac{\\sqrt{3}}{2} + \\frac{\\sqrt{2}}{2}\\frac{1}{2} = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$$\n\n$$\\sin(15^{\\circ}) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$$",
        "像 $15^{\\circ}$ 和 $75^{\\circ}$ 这样的角是熟悉的特殊角的和或差，所以用和角与差角公式可以求出它们的精确值。由 $75^{\\circ} = 45^{\\circ} + 30^{\\circ}$ 以及 $15^{\\circ} = 45^{\\circ} - 30^{\\circ}$：\n\n$$\\sin(75^{\\circ}) = \\frac{\\sqrt{6} + \\sqrt{2}}{4}, \\quad \\sin(15^{\\circ}) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { deg: 15, decomp: "45^\\circ - 30^\\circ", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 75, decomp: "45^\\circ + 30^\\circ", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 105, decomp: "60^\\circ + 45^\\circ", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 165, decomp: "180^\\circ - 15^\\circ", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 195, decomp: "180^\\circ + 15^\\circ", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 255, decomp: "270^\\circ - 15^\\circ", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 285, decomp: "270^\\circ + 15^\\circ", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 345, decomp: "360^\\circ - 15^\\circ", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: -15, decomp: "-(45^\\circ - 30^\\circ)", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: -75, decomp: "-(45^\\circ + 30^\\circ)", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 375, decomp: "360^\\circ + 15^\\circ", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 435, decomp: "360^\\circ + 75^\\circ", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `\\sin(${item.deg}^\\circ)` : `${mult}\\sin(${item.deg}^\\circ)`;
        const ansStr = scaleSurd(item.ans, mult);
        const wrongList = [
          "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "\\frac{\\sqrt{3}}{2}",
          "\\frac{\\sqrt{2}}{2}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => `$${scaleSurd(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Decompose using $${item.decomp}$ and apply the sine formula to get $${item.ans}$${mult === 1 ? "" : `, and multiplying by $${mult}$ gives $${ansStr}$`}.`,
            `利用 $${item.decomp}$ 分解并应用正弦和差公式，得 $${item.ans}$${mult === 1 ? "" : `，乘以 $${mult}$ 得 $${ansStr}$`}。`,
          ),
        );
      },
    },
    {
      id: "exact-sine-in-radians-twelfths",
      title: t("Exact sine for radian multiples of π/12", "π/12 弧度倍角处的正弦精确值"),
      explanation: t(
        "Radian multiples of $\\frac{\\pi}{12}$ are sums or differences of the special angles with denominators $3$, $4$ and $6$, so write the angle that way first. In radians, $\\frac{5\\pi}{12} = 75^{\\circ}$ and $\\frac{\\pi}{12} = 15^{\\circ}$:\n\n$$\\sin\\left(\\frac{5\\pi}{12}\\right) = \\frac{\\sqrt{6} + \\sqrt{2}}{4}, \\quad \\sin\\left(\\frac{\\pi}{12}\\right) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$$",
        "$\\frac{\\pi}{12}$ 的倍数可以写成分母为 $3$、$4$、$6$ 的特殊角的和或差，所以先把角写成这样的形式。在弧度制下，$\\frac{5\\pi}{12} = 75^{\\circ}$，$\\frac{\\pi}{12} = 15^{\\circ}$：\n\n$$\\sin\\left(\\frac{5\\pi}{12}\\right) = \\frac{\\sqrt{6} + \\sqrt{2}}{4}, \\quad \\sin\\left(\\frac{\\pi}{12}\\right) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { frac: "\\frac{5\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\frac{\\pi}{4} + \\frac{\\pi}{6}" },
          { frac: "\\frac{\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\frac{\\pi}{4} - \\frac{\\pi}{6}" },
          { frac: "\\frac{7\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\frac{\\pi}{3} + \\frac{\\pi}{4}" },
          { frac: "\\frac{11\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi - \\frac{\\pi}{12}" },
          { frac: "\\frac{13\\pi}{12}", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi + \\frac{\\pi}{12}" },
          { frac: "\\frac{17\\pi}{12}", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\pi + \\frac{5\\pi}{12}" },
          { frac: "\\frac{19\\pi}{12}", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "2\\pi - \\frac{5\\pi}{12}" },
          { frac: "\\frac{23\\pi}{12}", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "2\\pi - \\frac{\\pi}{12}" },
          { frac: "-\\frac{\\pi}{12}", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "-(\\frac{\\pi}{4} - \\frac{\\pi}{6})" },
          { frac: "-\\frac{5\\pi}{12}", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "-(\\frac{\\pi}{4} + \\frac{\\pi}{6})" },
          { frac: "\\frac{25\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "2\\pi + \\frac{\\pi}{12}" },
          { frac: "\\frac{29\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "2\\pi + \\frac{5\\pi}{12}" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `\\sin\\left(${item.frac}\\right)` : `${mult}\\sin\\left(${item.frac}\\right)`;
        const ansStr = scaleSurd(item.ans, mult);
        const wrongList = [
          "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
        ].filter((w) => w !== item.ans);
        const wrongStr = wrongList.map((w) => `$${scaleSurd(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.slice(0, 3).map((w) => t(w, w)),
          t(
            `Write $${item.frac} = ${item.decomp}$ and apply the sine formula to get $${item.ans}$${mult === 1 ? "" : `, and multiplying by $${mult}$ gives $${ansStr}$`}.`,
            `将角写成 $${item.frac} = ${item.decomp}$，应用正弦公式，得 $${item.ans}$${mult === 1 ? "" : `，乘以 $${mult}$ 得 $${ansStr}$`}。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.5 Calculating cosine ratios using sum formula ─────────────────────

/** calculatingTrigonometricRatiosUsingTheSumFormulaForCosine finds exact values. */
export const calculatingTrigonometricRatiosUsingTheSumFormulaForCosine: TopicDef = {
  id: "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine",
  title: t("Calculating Trigonometric Ratios Using the Sum Formula for Cosine", "用余弦和差角公式求三角比的精确值"),
  summary: t(
    "Calculate the exact values of cosine for non-standard angles such as 75° (5π/12) and 15° (π/12).",
    "利用余弦和差角公式计算 75° (5π/12) 与 15° (π/12) 等非标准特殊角的精确值。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-cosine", "calculating-trigonometric-ratios-using-the-sum-formula-for-sine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-cosine", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "exact-cosine-of-fifteen-and-seventy-five",
      title: t("Exact cosine of 15° and 75°", "15° 与 75° 的余弦精确值"),
      explanation: t(
        "The cosine formulas keep the products of matching functions together and flip the sign in the middle, so take care with the sign before simplifying. Using $75^{\\circ} = 45^{\\circ} + 30^{\\circ}$ and $15^{\\circ} = 45^{\\circ} - 30^{\\circ}$:\n\n$$\\cos(75^{\\circ}) = \\cos(45^{\\circ})\\cos(30^{\\circ}) - \\sin(45^{\\circ})\\sin(30^{\\circ}) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}$$\n\n$$\\cos(15^{\\circ}) = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$$",
        "余弦公式把同名函数的积放在一起，并且中间的符号与角之间的符号相反，所以化简前要注意符号。由 $75^{\\circ} = 45^{\\circ} + 30^{\\circ}$ 与 $15^{\\circ} = 45^{\\circ} - 30^{\\circ}$：\n\n$$\\cos(75^{\\circ}) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}, \\quad \\cos(15^{\\circ}) = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { deg: 15, decomp: "45^\\circ - 30^\\circ", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 75, decomp: "45^\\circ + 30^\\circ", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 105, decomp: "60^\\circ + 45^\\circ", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 165, decomp: "180^\\circ - 15^\\circ", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 195, decomp: "180^\\circ + 15^\\circ", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 255, decomp: "270^\\circ - 15^\\circ", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 285, decomp: "270^\\circ + 15^\\circ", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 345, decomp: "360^\\circ - 15^\\circ", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: -15, decomp: "-(45^\\circ - 30^\\circ)", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: -75, decomp: "-(45^\\circ + 30^\\circ)", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: -105, decomp: "-105^\\circ", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: -165, decomp: "-165^\\circ", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 375, decomp: "360^\\circ + 15^\\circ", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 435, decomp: "360^\\circ + 75^\\circ", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `\\cos(${item.deg}^\\circ)` : `${mult}\\cos(${item.deg}^\\circ)`;
        const ansStr = scaleSurd(item.ans, mult);
        const wrongList = [
          "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "\\frac{\\sqrt{3}}{2}",
          "\\frac{1}{2}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => `$${scaleSurd(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Expand using the cosine formula with $${item.decomp}$ to get $${item.ans}$${mult === 1 ? "" : `, and multiplying by $${mult}$ gives $${ansStr}$`}.`,
            `用 $${item.decomp}$ 和余弦公式展开，得 $${item.ans}$${mult === 1 ? "" : `，乘以 $${mult}$ 得 $${ansStr}$`}。`,
          ),
        );
      },
    },
    {
      id: "exact-cosine-in-radians-twelfths",
      title: t("Exact cosine for radian multiples of π/12", "π/12 弧度倍角处的余弦精确值"),
      explanation: t(
        "To find these values, split the radian angle into two special angles, apply the cosine sum or difference formula, and simplify the products of the radicals. For angles in radians:\n\n$$\\cos\\left(\\frac{5\\pi}{12}\\right) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}, \\quad \\cos\\left(\\frac{\\pi}{12}\\right) = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$$",
        "求这些值时，把弧度角拆成两个特殊角，用余弦的和角或差角公式，再化简根式的乘积。对于弧度制下的角：\n\n$$\\cos\\left(\\frac{5\\pi}{12}\\right) = \\frac{\\sqrt{6} - \\sqrt{2}}{4}, \\quad \\cos\\left(\\frac{\\pi}{12}\\right) = \\frac{\\sqrt{6} + \\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { frac: "\\frac{5\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi/4 + \\pi/6" },
          { frac: "\\frac{\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\pi/4 - \\pi/6" },
          { frac: "\\frac{7\\pi}{12}", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi/3 + \\pi/4" },
          { frac: "\\frac{11\\pi}{12}", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\pi - \\pi/12" },
          { frac: "\\frac{13\\pi}{12}", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\pi + \\pi/12" },
          { frac: "\\frac{17\\pi}{12}", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi + 5\\pi/12" },
          { frac: "\\frac{19\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "2\\pi - 5\\pi/12" },
          { frac: "\\frac{23\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "2\\pi - \\pi/12" },
          { frac: "-\\frac{\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "-(\\pi/4 - \\pi/6)" },
          { frac: "-\\frac{5\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "-(\\pi/4 + \\pi/6)" },
          { frac: "\\frac{25\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "2\\pi + \\pi/12" },
          { frac: "\\frac{29\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "2\\pi + 5\\pi/12" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `\\cos\\left(${item.frac}\\right)` : `${mult}\\cos\\left(${item.frac}\\right)`;
        const ansStr = scaleSurd(item.ans, mult);
        const wrongList = [
          "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
        ].filter((w) => w !== item.ans);
        const wrongStr = wrongList.map((w) => `$${scaleSurd(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.slice(0, 3).map((w) => t(w, w)),
          t(
            `Apply the cosine formula with $${item.decomp}$ to get $\\cos(${item.frac}) = ${item.ans}$${mult === 1 ? "" : `, and multiplying by $${mult}$ gives $${ansStr}$`}.`,
            `用 $${item.decomp}$ 和余弦公式计算，得 $\\cos(${item.frac}) = ${item.ans}$${mult === 1 ? "" : `，乘以 $${mult}$ 得 $${ansStr}$`}。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.6 Calculating tangent ratios using sum formula ────────────────────

/** calculatingTrigonometricRatiosUsingTheSumFormulaForTangent finds exact values. */
export const calculatingTrigonometricRatiosUsingTheSumFormulaForTangent: TopicDef = {
  id: "calculating-trigonometric-ratios-using-the-sum-formula-for-tangent",
  title: t("Calculating Trigonometric Ratios Using the Sum Formula for Tangent", "用正切和差角公式求三角比的精确值"),
  summary: t(
    "Calculate exact values of tangent for angles such as 75° = 2 + √3 and 15° = 2 - √3.",
    "利用正切和差角公式计算 75° = 2 + √3 与 15° = 2 - √3 等角的精确值。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-tangent", "calculating-trigonometric-ratios-using-the-sum-formula-for-sine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-tangent", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "exact-tangent-fifteen-seventy-five",
      title: t("Exact tangent of 15° and 75°", "15° 与 75° 的正切精确值"),
      explanation: t(
        "After substituting the known tangents, the result is a fraction with radicals in the denominator, which you rationalize by multiplying by the conjugate. Using $75^{\\circ} = 45^{\\circ} + 30^{\\circ}$:\n\n$$\\tan(75^{\\circ}) = \\frac{\\tan 45^{\\circ} + \\tan 30^{\\circ}}{1 - \\tan 45^{\\circ}\\tan 30^{\\circ}} = \\frac{1 + 1/\\sqrt{3}}{1 - 1/\\sqrt{3}} = \\frac{\\sqrt{3} + 1}{\\sqrt{3} - 1} = 2 + \\sqrt{3}$$\n\nSimilarly, $\\tan(15^{\\circ}) = 2 - \\sqrt{3}$.",
        "代入已知的正切值后，得到分母含根式的分式，要乘以共轭式把分母有理化。由 $75^{\\circ} = 45^{\\circ} + 30^{\\circ}$：\n\n$$\\tan(75^{\\circ}) = 2 + \\sqrt{3}, \\quad \\tan(15^{\\circ}) = 2 - \\sqrt{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { deg: 15, ans: "2 - \\sqrt{3}", via: "\\tan(45^\\circ - 30^\\circ)" },
          { deg: 75, ans: "2 + \\sqrt{3}", via: "\\tan(45^\\circ + 30^\\circ)" },
          { deg: 105, ans: "-2 - \\sqrt{3}", via: "-\\tan 75^\\circ" },
          { deg: 165, ans: "-2 + \\sqrt{3}", via: "-\\tan 15^\\circ" },
          { deg: 195, ans: "2 - \\sqrt{3}", via: "\\tan 15^\\circ" },
          { deg: 255, ans: "2 + \\sqrt{3}", via: "\\tan 75^\\circ" },
          { deg: 285, ans: "-2 - \\sqrt{3}", via: "-\\tan 75^\\circ" },
          { deg: 345, ans: "-2 + \\sqrt{3}", via: "-\\tan 15^\\circ" },
          { deg: -15, ans: "-2 + \\sqrt{3}", via: "-\\tan 15^\\circ" },
          { deg: -75, ans: "-2 - \\sqrt{3}", via: "-\\tan 75^\\circ" },
          { deg: 375, ans: "2 - \\sqrt{3}", via: "\\tan 15^\\circ" },
          { deg: 435, ans: "2 + \\sqrt{3}", via: "\\tan 75^\\circ" },
        ]);
        const mult = rng.pick([1, 2, 3]);
        const promptStr = mult === 1 ? `\\tan(${item.deg}^\\circ)` : `${mult}\\tan(${item.deg}^\\circ)`;
        const ansStr = scaleTangent(item.ans, mult);
        const wrongList = ["2 + \\sqrt{3}", "2 - \\sqrt{3}", "-2 - \\sqrt{3}", "-2 + \\sqrt{3}", "\\sqrt{3}"]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => `$${scaleTangent(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `The tangent repeats every $180^\\circ$ and is an odd function, and the sum and difference formulas give $\\tan 15^\\circ = 2 - \\sqrt{3}$ and $\\tan 75^\\circ = 2 + \\sqrt{3}$. Here $\\tan(${item.deg}^\\circ) = ${item.via} = ${item.ans}$${mult === 1 ? "" : `, and multiplying by $${mult}$ gives $${ansStr}$`}.`,
            `正切以 $180^\\circ$ 为周期且是奇函数，由和差公式得 $\\tan 15^\\circ = 2 - \\sqrt{3}$，$\\tan 75^\\circ = 2 + \\sqrt{3}$。这里 $\\tan(${item.deg}^\\circ) = ${item.via} = ${item.ans}$${mult === 1 ? "" : `，乘以 $${mult}$ 得 $${ansStr}$`}。`,
          ),
        );
      },
    },
    {
      id: "exact-tangent-in-radians",
      title: t("Exact tangent in radians", "弧度制下的正切精确值"),
      explanation: t(
        "These values come from the same sum and difference formulas, with the radian angles written as sums or differences of $\\frac{\\pi}{4}$ and $\\frac{\\pi}{6}$. In radians:\n\n$$\\tan\\left(\\frac{5\\pi}{12}\\right) = 2 + \\sqrt{3}, \\quad \\tan\\left(\\frac{\\pi}{12}\\right) = 2 - \\sqrt{3}$$",
        "这些值来自同样的和角与差角公式，把弧度角写成 $\\frac{\\pi}{4}$ 与 $\\frac{\\pi}{6}$ 的和或差即可。在弧度制下：\n\n$$\\tan\\left(\\frac{5\\pi}{12}\\right) = 2 + \\sqrt{3}, \\quad \\tan\\left(\\frac{\\pi}{12}\\right) = 2 - \\sqrt{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { frac: "\\frac{5\\pi}{12}", ans: "2 + \\sqrt{3}", via: "\\tan\\left(\\frac{\\pi}{4} + \\frac{\\pi}{6}\\right)" },
          { frac: "\\frac{\\pi}{12}", ans: "2 - \\sqrt{3}", via: "\\tan\\left(\\frac{\\pi}{4} - \\frac{\\pi}{6}\\right)" },
          { frac: "\\frac{7\\pi}{12}", ans: "-2 - \\sqrt{3}", via: "-\\tan \\frac{5\\pi}{12}" },
          { frac: "\\frac{11\\pi}{12}", ans: "-2 + \\sqrt{3}", via: "-\\tan \\frac{\\pi}{12}" },
          { frac: "\\frac{13\\pi}{12}", ans: "2 - \\sqrt{3}", via: "\\tan \\frac{\\pi}{12}" },
          { frac: "\\frac{17\\pi}{12}", ans: "2 + \\sqrt{3}", via: "\\tan \\frac{5\\pi}{12}" },
          { frac: "\\frac{19\\pi}{12}", ans: "-2 - \\sqrt{3}", via: "-\\tan \\frac{5\\pi}{12}" },
          { frac: "\\frac{23\\pi}{12}", ans: "-2 + \\sqrt{3}", via: "-\\tan \\frac{\\pi}{12}" },
          { frac: "-\\frac{\\pi}{12}", ans: "-2 + \\sqrt{3}", via: "-\\tan \\frac{\\pi}{12}" },
          { frac: "-\\frac{5\\pi}{12}", ans: "-2 - \\sqrt{3}", via: "-\\tan \\frac{5\\pi}{12}" },
          { frac: "\\frac{25\\pi}{12}", ans: "2 - \\sqrt{3}", via: "\\tan \\frac{\\pi}{12}" },
          { frac: "\\frac{29\\pi}{12}", ans: "2 + \\sqrt{3}", via: "\\tan \\frac{5\\pi}{12}" },
        ]);
        const mult = rng.pick([1, 2, 3]);
        const promptStr = mult === 1 ? `\\tan\\left(${item.frac}\\right)` : `${mult}\\tan\\left(${item.frac}\\right)`;
        const ansStr = scaleTangent(item.ans, mult);
        const wrongList = ["2 + \\sqrt{3}", "2 - \\sqrt{3}", "-2 - \\sqrt{3}", "-2 + \\sqrt{3}"].filter((w) => w !== item.ans);
        const wrongStr = wrongList.map((w) => `$${scaleTangent(w, mult)}$`);
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.slice(0, 3).map((w) => t(w, w)),
          t(
            `The tangent repeats every $\\pi$ and is an odd function, and the sum and difference formulas give $\\tan\\frac{\\pi}{12} = 2 - \\sqrt{3}$ and $\\tan\\frac{5\\pi}{12} = 2 + \\sqrt{3}$. Here $\\tan\\left(${item.frac}\\right) = ${item.via} = ${item.ans}$${mult === 1 ? "" : `, and multiplying by $${mult}$ gives $${ansStr}$`}.`,
            `正切以 $\\pi$ 为周期且是奇函数，由和差公式得 $\\tan\\frac{\\pi}{12} = 2 - \\sqrt{3}$，$\\tan\\frac{5\\pi}{12} = 2 + \\sqrt{3}$。这里 $\\tan\\left(${item.frac}\\right) = ${item.via} = ${item.ans}$${mult === 1 ? "" : `，乘以 $${mult}$ 得 $${ansStr}$`}。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.7 Writing sums in amplitude-phase form ────────────────────────────

/** writingSumsOfTrigonometricFunctionsInAmplitudePhaseForm converts A sin + B cos. */
export const writingSumsOfTrigonometricFunctionsInAmplitudePhaseForm: TopicDef = {
  id: "writing-sums-of-trigonometric-functions-in-amplitude-phase-form",
  title: t("Writing Sums of Trigonometric Functions in Amplitude-Phase Form", "将三角函数和写为振幅-初相形式（辅助角公式）"),
  summary: t(
    "Convert a linear combination A sin(x) + B cos(x) into R sin(x + φ) where R = √(A² + B²) and tan(φ) = B/A.",
    "利用辅助角公式将线性组合 A sin(x) + B cos(x) 化为 R sin(x + φ)，其中 R = √(A² + B²) 且 tan(φ) = B/A。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "amplitude-of-linear-combination",
      title: t("Amplitude of a sum of sine and cosine", "正弦与余弦线性组合的振幅"),
      explanation: t(
        "A sum of a sine and a cosine with the same input is a single shifted sine wave, and its amplitude is the length of the vector made from the two coefficients. For $f(x) = A \\sin x + B \\cos x$, the maximum value (amplitude) is $R = \\sqrt{A^{2} + B^{2}}$. For $3\\sin x + 4\\cos x$:\n\n$$R = \\sqrt{3^{2} + 4^{2}} = 5$$",
        "同一自变量的正弦与余弦之和是一条平移后的正弦曲线，它的振幅等于由两个系数构成的向量的长度。对于 $f(x) = A \\sin x + B \\cos x$，其最大值（振幅）为 $R = \\sqrt{A^{2} + B^{2}}$。以 $3\\sin x + 4\\cos x$ 为例：\n\n$$R = \\sqrt{3^{2} + 4^{2}} = 5$$",
      ),
      generate(rng) {
        const allTriples = [
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
          [20, 21, 29],
          [21, 20, 29],
          [9, 40, 41],
          [40, 9, 41],
          [12, 35, 37],
          [35, 12, 37],
        ] as const;
        const [baseA, baseB, baseC] = rng.pick(allTriples);
        const k = rng.pick([1, 2, 3, 4]);
        const a = k * baseA;
        const b = k * baseB;
        const c = k * baseC;
        const v = rng.pick(["x", "\\theta", "t", "u"]);
        const sign = rng.pick(["+", "-"]);
        return numberProblem({
          prompt: t(
            `Find the amplitude (maximum value) of $f(${v}) = ${a}\\sin ${v} ${sign} ${b}\\cos ${v}$.`,
            `求 $f(${v}) = ${a}\\sin ${v} ${sign} ${b}\\cos ${v}$ 的振幅（最大值）。`,
          ),
          answer: c,
          wrong: [a + b, Math.abs(a - b), c + k],
          solution: t(
            `The amplitude is $R = \\sqrt{A^{2} + B^{2}} = \\sqrt{${a}^{2} + ${b}^{2}} = ${c}$.`,
            `振幅为 $R = \\sqrt{A^{2} + B^{2}} = \\sqrt{${a}^{2} + ${b}^{2}} = ${c}$。`,
          ),
        });
      },
    },
    {
      id: "amplitude-phase-form-exact",
      title: t("Complete amplitude-phase form", "完整的振幅-初相表达式"),
      explanation: t(
        "Factor out the amplitude so that the remaining coefficients are the cosine and sine of one angle, then recognize the sum formula for sine. Rewrite using the auxiliary angle:\n\n$$\\sqrt{3}\\sin x + \\cos x = 2\\left(\\frac{\\sqrt{3}}{2}\\sin x + \\frac{1}{2}\\cos x\\right) = 2\\sin\\left(x + \\frac{\\pi}{6}\\right)$$",
        "先提出振幅，使剩下的系数分别是同一个角的余弦和正弦，再认出这是正弦的和角公式。利用辅助角改写：\n\n$$\\sqrt{3}\\sin x + \\cos x = 2\\left(\\frac{\\sqrt{3}}{2}\\sin x + \\frac{1}{2}\\cos x\\right) = 2\\sin\\left(x + \\frac{\\pi}{6}\\right)$$",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const v = rng.pick(["x", "\\theta", "t"]);
        const p = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${p}\\sqrt{3}\\sin ${v} + ${p}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
              `${2 * k}\\cos\\left(${v} + \\frac{\\pi}{6}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} + ${p}\\sqrt{3}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
              `${2 * k}\\cos\\left(${v} + \\frac{\\pi}{3}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} + ${p}\\cos ${v}`,
            ans: `${p}\\sqrt{2}\\sin\\left(${v} + \\frac{\\pi}{4}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{4}\\right)`,
              `${p}\\sqrt{2}\\sin\\left(${v} + \\frac{\\pi}{2}\\right)`,
              `${p}\\cos\\left(${v} + \\frac{\\pi}{4}\\right)`,
            ],
          },
          {
            expr: `${p}\\sqrt{3}\\sin ${v} - ${p}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} - \\frac{\\pi}{6}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
              `${2 * k}\\cos\\left(${v} - \\frac{\\pi}{6}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} - \\frac{\\pi}{6}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} - ${p}\\sqrt{3}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} - \\frac{\\pi}{3}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
              `${2 * k}\\cos\\left(${v} - \\frac{\\pi}{3}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} - \\frac{\\pi}{3}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} - ${p}\\cos ${v}`,
            ans: `${p}\\sqrt{2}\\sin\\left(${v} - \\frac{\\pi}{4}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} - \\frac{\\pi}{4}\\right)`,
              `${p}\\sqrt{2}\\sin\\left(${v} + \\frac{\\pi}{4}\\right)`,
              `${p}\\cos\\left(${v} - \\frac{\\pi}{4}\\right)`,
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Write $${item.expr}$ in the form $R\\sin(${v} + \\phi)$.`, `将 $${item.expr}$ 化为 $R\\sin(${v} + \\phi)$ 的形式。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Factor out $R = \\sqrt{A^2 + B^2}$ and identify the auxiliary phase angle: the result is $${item.ans}$.`,
            `提出 $R = \\sqrt{A^2 + B^2}$ 并确定初相角：结果为 $${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.12.1 The double-angle formula for sine ────────────────────────────────

/** theDoubleAngleFormulaForSine introduces sin(2θ) = 2 sin(θ) cos(θ). */
export const theDoubleAngleFormulaForSine: TopicDef = {
  id: "the-double-angle-formula-for-sine",
  title: t("The Double-Angle Formula for Sine", "正弦的二倍角公式"),
  summary: t(
    "Use sin(2θ) = 2 sin(θ) cos(θ) to rewrite or evaluate trigonometric expressions.",
    "利用 sin(2θ) = 2 sin(θ) cos(θ) 改写或求值三角表达式。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "double-angle-formula-for-sine-statement",
      title: t("The double-angle formula for sine", "正弦二倍角公式的陈述"),
      figure: remainingDrawings5["the-double-angle-formula-for-sine#double-angle-formula-for-sine-statement"],
      explanation: t(
        "The double-angle formula is a special case of the sum formula, so it does not need to be memorized separately. Note that $\\sin(2\\theta)$ is not $2\\sin\\theta$.\n\nApplying the addition formula with both angles equal gives:\n\n$$\\sin(2\\theta) = \\sin(\\theta + \\theta) = \\sin\\theta\\cos\\theta + \\cos\\theta\\sin\\theta = 2\\sin\\theta\\cos\\theta$$",
        "二倍角公式是和角公式的特例，所以不必另外记忆。注意 $\\sin(2\\theta)$ 不等于 $2\\sin\\theta$。\n\n将和角公式中两个角取相同值，即得：\n\n$$\\sin(2\\theta) = \\sin(\\theta + \\theta) = \\sin\\theta\\cos\\theta + \\cos\\theta\\sin\\theta = 2\\sin\\theta\\cos\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u", "A"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const mode = rng.pick(["forward", "reverse", "evaluate"] as const);
        if (mode === "forward") {
          return oneOf(
            rng,
            t(`Which of the following is equal to $\\sin(${doubleArg})$?`, `下列哪个式子恒等于 $\\sin(${doubleArg})$？`),
            t(`$2\\sin(${arg})\\cos(${arg})$`, `$2\\sin(${arg})\\cos(${arg})$`),
            [
              t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
              t(`$\\sin^2(${arg}) - \\cos^2(${arg})$`, `$\\sin^2(${arg}) - \\cos^2(${arg})$`),
              t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
            ],
            t(
              `By the double-angle formula, $\\sin(2A) = 2\\sin A\\cos A$ with $A = ${arg}$.`,
              `由二倍角公式，当 $A = ${arg}$ 时，$\\sin(2A) = 2\\sin A\\cos A$。`,
            ),
          );
        } else if (mode === "reverse") {
          return oneOf(
            rng,
            t(`Rewrite $2\\sin(${arg})\\cos(${arg})$ using a double-angle formula.`, `将 $2\\sin(${arg})\\cos(${arg})$ 用二倍角公式改写。`),
            t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
            [
              t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
              t(`$2\\sin(${doubleArg})$`, `$2\\sin(${doubleArg})$`),
            ],
            t(
              `Since $2\\sin A\\cos A = \\sin(2A)$, the expression equals $\\sin(${doubleArg})$.`,
              `因为 $2\\sin A\\cos A = \\sin(2A)$，所以原式等于 $\\sin(${doubleArg})$。`,
            ),
          );
        } else {
          return oneOf(
            rng,
            t(`Simplify $\\frac{\\sin(${doubleArg})}{2\\cos(${arg})}$.`, `化简 $\\frac{\\sin(${doubleArg})}{2\\cos(${arg})}$。`),
            t(`$\\sin(${arg})$`, `$\\sin(${arg})$`),
            [
              t(`$\\cos(${arg})$`, `$\\cos(${arg})$`),
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
            ],
            t(
              `Substitute $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$ and simplify: $\\sin(${arg})$.`,
              `代入 $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$ 约分得：$\\sin(${arg})$。`,
            ),
          );
        }
      },
    },
    {
      id: "evaluating-sin-double-angle",
      title: t("Evaluating $\\sin 2\\theta$ from given values", "由已知值求 $\\sin 2\\theta$"),
      explanation: t(
        "To use $\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$ you need both the sine and the cosine of $\\theta$. Find the missing one from the Pythagorean identity and the quadrant.\n\nIf $\\sin\\theta = \\frac{3}{5}$ and $\\theta$ is in the first quadrant, then $\\cos\\theta = \\frac{4}{5}$ (from the Pythagorean identity) and:\n\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\frac{4}{5} = \\frac{24}{25}$$",
        "要用 $\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta$，需要同时知道 $\\theta$ 的正弦和余弦。由勾股恒等式和所在象限求出缺少的那个。\n\n若 $\\sin\\theta = \\frac{3}{5}$ 且 $\\theta$ 在第一象限，则由勾股恒等式得 $\\cos\\theta = \\frac{4}{5}$，从而：\n\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\frac{4}{5} = \\frac{24}{25}$$",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const);
        const quad = rng.pick([
          { num: "first", numZh: "第一", sinSign: 1, cosSign: 1 },
          { num: "second", numZh: "第二", sinSign: 1, cosSign: -1 },
          { num: "third", numZh: "第三", sinSign: -1, cosSign: -1 },
          { num: "fourth", numZh: "第四", sinSign: -1, cosSign: 1 },
        ]);
        const v = rng.pick(["\\theta", "x", "\\alpha"]);
        const sinVal = Q.of(quad.sinSign * a, c);
        const cosVal = Q.of(quad.cosSign * b, c);
        const ans = sinVal.mul(cosVal).mul(Q.of(2));
        const w1 = Q.of(-ans.n, ans.d);
        const w2 = sinVal.mul(sinVal).mul(Q.of(2));
        const w3 = Q.of(a * b, c * c);
        return numberProblem({
          prompt: t(
            `If $\\sin ${v} = ${sinVal.toLatex()}$ and $${v}$ is in the ${quad.num} quadrant, find $\\sin(2${v})$.`,
            `若 $\\sin ${v} = ${sinVal.toLatex()}$ 且 $${v}$ 在${quad.numZh}象限，求 $\\sin(2${v})$。`,
          ),
          answer: ans,
          wrong: [w1, w2, w3],
          solution: t(
            `In the ${quad.num} quadrant, $\\cos ${v} = ${cosVal.toLatex()}$. Then $\\sin(2${v}) = 2\\cdot(${sinVal.toLatex()})\\cdot(${cosVal.toLatex()}) = ${ans.toLatex()}$.`,
            `在${quad.numZh}象限中，$\\cos ${v} = ${cosVal.toLatex()}$。则 $\\sin(2${v}) = 2\\cdot(${sinVal.toLatex()})\\cdot(${cosVal.toLatex()}) = ${ans.toLatex()}$。`,
          ),
          form: "fraction",
        });
      },
    },
    {
      id: "rewriting-products-as-sin-double-angle",
      title: t("Rewriting products using the double-angle formula", "用二倍角公式改写乘积"),
      explanation: t(
        "A product of sine and cosine of the same angle can be written as a single sine of the double angle. Pull out a factor of $2$ first.\n\nThe product $6\\sin x\\cos x$ can be rewritten as $3\\cdot(2\\sin x\\cos x) = 3\\sin(2x)$.",
        "同一个角的正弦与余弦之积可以写成二倍角的正弦。先凑出因数 $2$。\n\n乘积 $6\\sin x\\cos x$ 可改写为 $3\\cdot(2\\sin x\\cos x) = 3\\sin(2x)$。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const m = rng.pick([1, 2, 3, 4, 5]);
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const coeff = 2 * k;
        const arg = m === 1 ? v : `${m}${v}`;
        const doubleArg = `${2 * m}${v}`;
        return oneOf(
          rng,
          t(
            `Rewrite $${coeff}\\sin(${arg})\\cos(${arg})$ using a double-angle formula.`,
            `用二倍角公式改写 $${coeff}\\sin(${arg})\\cos(${arg})$。`,
          ),
          t(
            k === 1 ? `$\\sin(${doubleArg})$` : `$${k}\\sin(${doubleArg})$`,
            k === 1 ? `$\\sin(${doubleArg})$` : `$${k}\\sin(${doubleArg})$`,
          ),
          [
            t(k === 1 ? `$\\sin^2(${arg})$` : `$${k}\\sin^2(${arg})$`, k === 1 ? `$\\sin^2(${arg})$` : `$${k}\\sin^2(${arg})$`),
            t(
              k === 1 ? `$\\cos(${doubleArg})$` : `$${k}\\cos(${doubleArg})$`,
              k === 1 ? `$\\cos(${doubleArg})$` : `$${k}\\cos(${doubleArg})$`,
            ),
            t(`$${coeff}\\sin(${doubleArg})$`, `$${coeff}\\sin(${doubleArg})$`),
          ],
          t(
            `Factor: $${coeff}\\sin(${arg})\\cos(${arg}) = ${k}\\cdot(2\\sin(${arg})\\cos(${arg})) = ${k === 1 ? "" : k}\\sin(${doubleArg})$.`,
            `提取因子：$${coeff}\\sin(${arg})\\cos(${arg}) = ${k}\\cdot(2\\sin(${arg})\\cos(${arg})) = ${k === 1 ? "" : k}\\sin(${doubleArg})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.12.2 Verifying identities using sin double-angle ──────────────────────

/** verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForSine covers identity verification. */
export const verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForSine: TopicDef = {
  id: "verifying-trigonometric-identities-using-the-double-angle-formula-for-sine",
  title: t("Verifying Trigonometric Identities Using the Double-Angle Formula for Sine", "利用正弦二倍角公式验证三角恒等式"),
  summary: t(
    "Prove identities by substituting sin(2θ) = 2 sin(θ) cos(θ) and simplifying.",
    "通过代入 sin(2θ) = 2 sin(θ) cos(θ) 并化简来证明三角恒等式。",
  ),
  prerequisites: ["the-double-angle-formula-for-sine"],
  encompasses: [{ topic: "the-double-angle-formula-for-sine", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "verifying-double-angle-sine-identities",
      title: t("Verifying identities with $\\sin 2\\theta$", "利用 $\\sin 2\\theta$ 验证恒等式"),
      explanation: t(
        "To verify an identity, transform one side step by step until it matches the other side, here by replacing the sine of a double angle with its formula. To verify $\\frac{\\sin(2\\theta)}{\\sin\\theta} = 2\\cos\\theta$, substitute and simplify the left side:\n\n$$\\frac{\\sin(2\\theta)}{\\sin\\theta} = \\frac{2\\sin\\theta\\cos\\theta}{\\sin\\theta} = 2\\cos\\theta \\checkmark$$",
        "验证恒等式时，把一边逐步变形，直到与另一边相同；这里是把二倍角的正弦换成它的公式。为验证 $\\frac{\\sin(2\\theta)}{\\sin\\theta} = 2\\cos\\theta$，代入并化简左边：\n\n$$\\frac{\\sin(2\\theta)}{\\sin\\theta} = \\frac{2\\sin\\theta\\cos\\theta}{\\sin\\theta} = 2\\cos\\theta \\checkmark$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const identities = [
          {
            prompt: t(
              `Which expression is equal to $\\dfrac{\\sin(${doubleArg})}{\\sin(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{\\sin(${doubleArg})}{\\sin(${arg})}$？`,
            ),
            ans: t(`$2\\cos(${arg})$`, `$2\\cos(${arg})$`),
            wrong: [
              t(`$2\\sin(${arg})$`, `$2\\sin(${arg})$`),
              t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            ],
            sol: t(
              `Substitute $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$: result is $2\\cos(${arg})$.`,
              `代入 $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$：结果为 $2\\cos(${arg})$。`,
            ),
          },
          {
            prompt: t(
              `Which expression equals $\\dfrac{\\sin(${doubleArg})}{2\\cos(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{\\sin(${doubleArg})}{2\\cos(${arg})}$？`,
            ),
            ans: t(`$\\sin(${arg})$`, `$\\sin(${arg})$`),
            wrong: [
              t(`$\\cos(${arg})$`, `$\\cos(${arg})$`),
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
            ],
            sol: t(
              `Substitute $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$: result is $\\sin(${arg})$.`,
              `代入 $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$：结果为 $\\sin(${arg})$。`,
            ),
          },
          {
            prompt: t(`Which expression equals $\\sin(${doubleArg})\\tan(${arg})$?`, `哪个表达式等于 $\\sin(${doubleArg})\\tan(${arg})$？`),
            ans: t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
            wrong: [
              t(`$2\\cos^2(${arg})$`, `$2\\cos^2(${arg})$`),
              t(`$\\sin(${4 * k}${v})$`, `$\\sin(${4 * k}${v})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            ],
            sol: t(
              `$\\sin(${doubleArg})\\tan(${arg}) = 2\\sin(${arg})\\cos(${arg})\\cdot\\frac{\\sin(${arg})}{\\cos(${arg})} = 2\\sin^2(${arg})$.`,
              `$\\sin(${doubleArg})\\tan(${arg}) = 2\\sin(${arg})\\cos(${arg})\\cdot\\frac{\\sin(${arg})}{\\cos(${arg})} = 2\\sin^2(${arg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $\\dfrac{\\sin(${doubleArg})}{2}$.`, `化简 $\\dfrac{\\sin(${doubleArg})}{2}$。`),
            ans: t(`$\\sin(${arg})\\cos(${arg})$`, `$\\sin(${arg})\\cos(${arg})$`),
            wrong: [
              t(`$\\sin^2(${arg})$`, `$\\sin^2(${arg})$`),
              t(`$\\cos^2(${arg})$`, `$\\cos^2(${arg})$`),
              t(`$\\sin(${arg})$`, `$\\sin(${arg})$`),
            ],
            sol: t(
              `$\\frac{\\sin(${doubleArg})}{2} = \\frac{2\\sin(${arg})\\cos(${arg})}{2} = \\sin(${arg})\\cos(${arg})$.`,
              `$\\frac{\\sin(${doubleArg})}{2} = \\frac{2\\sin(${arg})\\cos(${arg})}{2} = \\sin(${arg})\\cos(${arg})$。`,
            ),
          },
        ];
        const item = rng.pick(identities);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
    {
      id: "sin-double-angle-inside-squares-and-factors",
      title: t("Finding $\\sin 2\\theta$ inside squares and factored sums", "在平方与因式分解中找出 $\\sin 2\\theta$"),
      explanation: t(
        "Sometimes the product $2\\sin\\theta\\cos\\theta$ is hidden: it appears as the middle term of a squared binomial, or after a common factor is pulled out. Expand or factor first, use $\\sin^2\\theta + \\cos^2\\theta = 1$ for the rest, and then recognize the double angle:\n\n$$(\\sin\\theta + \\cos\\theta)^2 = \\sin^2\\theta + 2\\sin\\theta\\cos\\theta + \\cos^2\\theta = 1 + \\sin(2\\theta)$$",
        "有时乘积 $2\\sin\\theta\\cos\\theta$ 是隐藏的：它出现在二项式平方的中间项里，或在提出公因式之后才出现。先展开或因式分解，其余部分用 $\\sin^2\\theta + \\cos^2\\theta = 1$ 化简，再认出二倍角：\n\n$$(\\sin\\theta + \\cos\\theta)^2 = \\sin^2\\theta + 2\\sin\\theta\\cos\\theta + \\cos^2\\theta = 1 + \\sin(2\\theta)$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const m = (s: string) => t(`$${s}$`, `$${s}$`);
        const items = [
          {
            prompt: t(
              `Which expression is equal to $(\\sin(${arg}) + \\cos(${arg}))^2$?`,
              `哪个表达式等于 $(\\sin(${arg}) + \\cos(${arg}))^2$？`,
            ),
            ans: m(`1 + \\sin(${doubleArg})`),
            wrong: [m(`1`), m(`1 - \\sin(${doubleArg})`), m(`\\sin(${doubleArg})`), m(`1 + 2\\sin(${doubleArg})`)],
            sol: t(
              `Expanding gives $\\sin^2(${arg}) + \\cos^2(${arg}) + 2\\sin(${arg})\\cos(${arg}) = 1 + \\sin(${doubleArg})$.`,
              `展开得 $\\sin^2(${arg}) + \\cos^2(${arg}) + 2\\sin(${arg})\\cos(${arg}) = 1 + \\sin(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Which expression is equal to $(\\sin(${arg}) - \\cos(${arg}))^2$?`,
              `哪个表达式等于 $(\\sin(${arg}) - \\cos(${arg}))^2$？`,
            ),
            ans: m(`1 - \\sin(${doubleArg})`),
            wrong: [m(`1`), m(`1 + \\sin(${doubleArg})`), m(`-\\cos(${doubleArg})`), m(`1 - 2\\sin(${doubleArg})`)],
            sol: t(
              `Expanding gives $\\sin^2(${arg}) + \\cos^2(${arg}) - 2\\sin(${arg})\\cos(${arg}) = 1 - \\sin(${doubleArg})$.`,
              `展开得 $\\sin^2(${arg}) + \\cos^2(${arg}) - 2\\sin(${arg})\\cos(${arg}) = 1 - \\sin(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $2\\sin(${arg})\\cos^3(${arg}) + 2\\sin^3(${arg})\\cos(${arg})$.`,
              `化简 $2\\sin(${arg})\\cos^3(${arg}) + 2\\sin^3(${arg})\\cos(${arg})$。`,
            ),
            ans: m(`\\sin(${doubleArg})`),
            wrong: [m(`\\sin^2(${doubleArg})`), m(`2\\sin(${doubleArg})`), m(`\\cos(${doubleArg})`)],
            sol: t(
              `Factor out $2\\sin(${arg})\\cos(${arg})$: it multiplies $\\cos^2(${arg}) + \\sin^2(${arg}) = 1$, leaving $\\sin(${doubleArg})$.`,
              `提出 $2\\sin(${arg})\\cos(${arg})$：它乘以 $\\cos^2(${arg}) + \\sin^2(${arg}) = 1$，结果为 $\\sin(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $(\\sin(${arg}) + \\cos(${arg}))^2 - (\\sin(${arg}) - \\cos(${arg}))^2$.`,
              `化简 $(\\sin(${arg}) + \\cos(${arg}))^2 - (\\sin(${arg}) - \\cos(${arg}))^2$。`,
            ),
            ans: m(`2\\sin(${doubleArg})`),
            wrong: [m(`\\sin(${doubleArg})`), m(`0`), m(`2`), m(`4\\sin(${doubleArg})`)],
            sol: t(
              `The squares are $1 + \\sin(${doubleArg})$ and $1 - \\sin(${doubleArg})$, so the difference is $2\\sin(${doubleArg})$.`,
              `两个平方分别是 $1 + \\sin(${doubleArg})$ 与 $1 - \\sin(${doubleArg})$，故差为 $2\\sin(${doubleArg})$。`,
            ),
          },
        ];
        const item = rng.pick(items);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
  ],
};

// ─── 4.12.3 Using sin double-angle with Pythagorean theorem ──────────────────

/** usingTheDoubleAngleFormulaForSineWithThePythagoreanTheorem combines double-angle and Pythagorean identities. */
export const usingTheDoubleAngleFormulaForSineWithThePythagoreanTheorem: TopicDef = {
  id: "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem",
  title: t("Using the Double-Angle Formula for Sine With the Pythagorean Theorem", "结合勾股定理使用正弦二倍角公式"),
  summary: t(
    "Compute sin(2θ) from sin(θ) or cos(θ) alone using the Pythagorean identity to find the missing ratio.",
    "仅用 sin(θ) 或 cos(θ) 的值，借助勾股恒等式求得另一个比值，从而计算 sin(2θ)。",
  ),
  prerequisites: ["the-double-angle-formula-for-sine"],
  encompasses: [
    { topic: "the-double-angle-formula-for-sine", weight: 0.5 },
    { topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.4 },
  ],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "sin-double-angle-from-cos-only",
      title: t("Finding $\\sin 2\\theta$ from $\\cos\\theta$ in a given quadrant", "由 $\\cos\\theta$ 在给定象限求 $\\sin 2\\theta$"),
      figure: remainingDrawings5["using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem#sin-double-angle-from-cos-only"],
      explanation: t(
        "When only the cosine is given, find the sine from the Pythagorean identity, choosing its sign from the quadrant, before using the double-angle formula. If $\\cos\\theta = -\\frac{4}{5}$ and $\\theta$ is in quadrant II, then $\\sin\\theta = \\frac{3}{5}$ (positive in QII) and:\n\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$$",
        "只给出余弦时，先用勾股恒等式求正弦，并根据所在象限确定符号，再用二倍角公式。若 $\\cos\\theta = -\\frac{4}{5}$ 且 $\\theta$ 在第二象限，则 $\\sin\\theta = \\frac{3}{5}$（第二象限正弦为正），从而：\n\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$$",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const);
        const v = rng.pick(["\\theta", "x", "\\alpha"]);
        const quadrant = rng.pick([
          { sinSign: 1, cosSign: 1, quad: "I", quadZh: "一", sinTex: `\\frac{${a}}{${c}}`, cosTex: `\\frac{${b}}{${c}}` },
          { sinSign: 1, cosSign: -1, quad: "II", quadZh: "二", sinTex: `\\frac{${a}}{${c}}`, cosTex: `-\\frac{${b}}{${c}}` },
          { sinSign: -1, cosSign: -1, quad: "III", quadZh: "三", sinTex: `-\\frac{${a}}{${c}}`, cosTex: `-\\frac{${b}}{${c}}` },
          { sinSign: -1, cosSign: 1, quad: "IV", quadZh: "四", sinTex: `-\\frac{${a}}{${c}}`, cosTex: `\\frac{${b}}{${c}}` },
        ] as const);
        const sinVal = quadrant.sinSign * a;
        const cosVal = quadrant.cosSign * b;
        const num = 2 * sinVal * cosVal;
        const den = c * c;
        const ansFrac = Q.of(num, den).toLatex();
        return numberProblem({
          prompt: t(
            `If $\\cos ${v} = ${quadrant.cosTex}$ and $${v}$ is in quadrant ${quadrant.quad}, find $\\sin(2${v})$.`,
            `若 $\\cos ${v} = ${quadrant.cosTex}$ 且 $${v}$ 在第${quadrant.quadZh}象限，求 $\\sin(2${v})$。`,
          ),
          answer: Q.of(num, den),
          wrong: [Q.of(-num, den), Q.of(Math.abs(num), den), Q.of(2 * a * b, c * c)],
          solution: t(
            `In quadrant ${quadrant.quad} the sine is ${quadrant.sinSign > 0 ? "positive" : "negative"}, so $\\sin ${v} = ${quadrant.sinTex}$. So $\\sin(2${v}) = 2\\cdot\\left(${quadrant.sinTex}\\right)\\cdot\\left(${quadrant.cosTex}\\right) = ${ansFrac}$.`,
            `第${quadrant.quadZh}象限正弦为${quadrant.sinSign > 0 ? "正" : "负"}，所以 $\\sin ${v} = ${quadrant.sinTex}$。故 $\\sin(2${v}) = 2\\cdot\\left(${quadrant.sinTex}\\right)\\cdot\\left(${quadrant.cosTex}\\right) = ${ansFrac}$。`,
          ),
          form: "fraction",
        });
      },
    },
    {
      id: "sin-double-angle-from-sin-only",
      title: t("Finding $\\sin 2\\theta$ from $\\sin\\theta$ in a given quadrant", "由 $\\sin\\theta$ 在给定象限求 $\\sin 2\\theta$"),
      explanation: t(
        "When only the sine is given, the cosine comes from $\\cos^2\\theta = 1 - \\sin^2\\theta$, and the quadrant decides its sign. If $\\sin\\theta = -\\frac{5}{13}$ with $\\theta$ in quadrant III, then $\\cos^2\\theta = \\frac{144}{169}$ and the cosine is negative there, so $\\cos\\theta = -\\frac{12}{13}$:\n\n$$\\sin(2\\theta) = 2\\cdot\\left(-\\frac{5}{13}\\right)\\cdot\\left(-\\frac{12}{13}\\right) = \\frac{120}{169}$$",
        "只给出正弦时，余弦由 $\\cos^2\\theta = 1 - \\sin^2\\theta$ 求出，所在象限决定它的符号。若 $\\sin\\theta = -\\frac{5}{13}$ 且 $\\theta$ 在第三象限，则 $\\cos^2\\theta = \\frac{144}{169}$，而第三象限余弦为负，故 $\\cos\\theta = -\\frac{12}{13}$：\n\n$$\\sin(2\\theta) = 2\\cdot\\left(-\\frac{5}{13}\\right)\\cdot\\left(-\\frac{12}{13}\\right) = \\frac{120}{169}$$",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick(_triples);
        const v = rng.pick(["\\theta", "x", "\\beta"]);
        const quadrant = rng.pick([
          { sinSign: 1, cosSign: 1, quad: "I", quadZh: "一" },
          { sinSign: 1, cosSign: -1, quad: "II", quadZh: "二" },
          { sinSign: -1, cosSign: -1, quad: "III", quadZh: "三" },
          { sinSign: -1, cosSign: 1, quad: "IV", quadZh: "四" },
        ] as const);
        const frac = (sign: number, n: number) => `${sign < 0 ? "-" : ""}\\frac{${n}}{${c}}`;
        const sinTex = frac(quadrant.sinSign, a);
        const cosTex = frac(quadrant.cosSign, b);
        const ans = Q.of(2 * quadrant.sinSign * quadrant.cosSign * a * b, c * c);
        return numberProblem({
          prompt: t(
            `If $\\sin ${v} = ${sinTex}$ and $${v}$ is in quadrant ${quadrant.quad}, find $\\sin(2${v})$.`,
            `若 $\\sin ${v} = ${sinTex}$ 且 $${v}$ 在第${quadrant.quadZh}象限，求 $\\sin(2${v})$。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of(2 * quadrant.sinSign * a, c), Q.of(2 * quadrant.sinSign * a * a, c * c)],
          solution: t(
            `$\\cos^2 ${v} = 1 - \\frac{${a * a}}{${c * c}} = \\frac{${b * b}}{${c * c}}$, and in quadrant ${quadrant.quad} the cosine is ${quadrant.cosSign > 0 ? "positive" : "negative"}, so $\\cos ${v} = ${cosTex}$. Then $\\sin(2${v}) = 2\\cdot(${sinTex})\\cdot(${cosTex}) = ${ans.toLatex()}$.`,
            `$\\cos^2 ${v} = 1 - \\frac{${a * a}}{${c * c}} = \\frac{${b * b}}{${c * c}}$，第${quadrant.quadZh}象限余弦为${quadrant.cosSign > 0 ? "正" : "负"}，故 $\\cos ${v} = ${cosTex}$。于是 $\\sin(2${v}) = 2\\cdot(${sinTex})\\cdot(${cosTex}) = ${ans.toLatex()}$。`,
          ),
          form: "fraction",
        });
      },
    },
  ],
};

// ─── 4.12.4 The double-angle formula for cosine ──────────────────────────────

/** theDoubleAngleFormulaForCosine covers the three forms of cos(2θ). */
export const theDoubleAngleFormulaForCosine: TopicDef = {
  id: "the-double-angle-formula-for-cosine",
  title: t("The Double-Angle Formula for Cosine", "余弦的二倍角公式"),
  summary: t(
    "Know and apply the three equivalent forms of cos(2θ): cos²θ − sin²θ, 2cos²θ − 1, and 1 − 2sin²θ.",
    "掌握并应用 cos(2θ) 的三种等价形式：cos²θ − sin²θ、2cos²θ − 1 和 1 − 2sin²θ。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-cosine", "alternate-forms-of-the-pythagorean-identity"],
  encompasses: [],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "three-forms-of-cos-double-angle",
      title: t("The three forms of the cosine double-angle formula", "余弦二倍角公式的三种形式"),
      explanation: t(
        "The cosine double-angle formula has three equivalent forms. Choose the one that uses the information you have, sine only, cosine only, or both.\n\nFrom $\\cos(\\alpha+\\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta$ with $\\alpha=\\beta=\\theta$:\n\n$$\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$$\n\nThe last two forms use $\\sin^2\\theta + \\cos^2\\theta = 1$.",
        "余弦的二倍角公式有三种等价形式。根据已知条件选择：只有正弦、只有余弦，或者两者都有。\n\n由余弦和角公式令 $\\alpha=\\beta=\\theta$，得：\n\n$$\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$$\n\n后两种形式利用了 $\\sin^2\\theta + \\cos^2\\theta = 1$。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const items = [
          {
            prompt: t(`Which expression is NOT equal to $\\cos(${doubleArg})$?`, `哪个表达式不等于 $\\cos(${doubleArg})$？`),
            ans: t(`$\\sin^2(${arg}) - \\cos^2(${arg})$`, `$\\sin^2(${arg}) - \\cos^2(${arg})$`),
            wrong: [
              t(`$\\cos^2(${arg}) - \\sin^2(${arg})$`, `$\\cos^2(${arg}) - \\sin^2(${arg})$`),
              t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
              t(`$1 - 2\\sin^2(${arg})$`, `$1 - 2\\sin^2(${arg})$`),
            ],
            sol: t(
              `The three valid forms are $\\cos^2(${arg}) - \\sin^2(${arg})$, $2\\cos^2(${arg}) - 1$, and $1 - 2\\sin^2(${arg})$. Note: $\\sin^2 - \\cos^2$ has opposite sign.`,
              `三种有效形式为 $\\cos^2(${arg}) - \\sin^2(${arg})$、$2\\cos^2(${arg}) - 1$ 和 $1 - 2\\sin^2(${arg})$。注意符号：$\\sin^2 - \\cos^2$ 与之相反。`,
            ),
          },
          {
            prompt: t(
              `Which form of $\\cos(${doubleArg})$ contains only $\\cos(${arg})$?`,
              `$\\cos(${doubleArg})$ 的哪种形式只含 $\\cos(${arg})$？`,
            ),
            ans: t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
            wrong: [
              t(`$\\cos^2(${arg}) - \\sin^2(${arg})$`, `$\\cos^2(${arg}) - \\sin^2(${arg})$`),
              t(`$1 - 2\\sin^2(${arg})$`, `$1 - 2\\sin^2(${arg})$`),
              t(`$2\\cos(${arg})$`, `$2\\cos(${arg})$`),
            ],
            sol: t(
              `Replacing $\\sin^2(${arg}) = 1 - \\cos^2(${arg})$ gives $2\\cos^2(${arg}) - 1$.`,
              `将 $\\sin^2(${arg}) = 1 - \\cos^2(${arg})$ 代入得 $2\\cos^2(${arg}) - 1$。`,
            ),
          },
          {
            prompt: t(
              `Which form of $\\cos(${doubleArg})$ contains only $\\sin(${arg})$?`,
              `$\\cos(${doubleArg})$ 的哪种形式只含 $\\sin(${arg})$？`,
            ),
            ans: t(`$1 - 2\\sin^2(${arg})$`, `$1 - 2\\sin^2(${arg})$`),
            wrong: [
              t(`$\\cos^2(${arg}) - \\sin^2(${arg})$`, `$\\cos^2(${arg}) - \\sin^2(${arg})$`),
              t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
              t(`$2\\sin(${arg})$`, `$2\\sin(${arg})$`),
            ],
            sol: t(
              `Replacing $\\cos^2(${arg}) = 1 - \\sin^2(${arg})$ gives $1 - 2\\sin^2(${arg})$.`,
              `将 $\\cos^2(${arg}) = 1 - \\sin^2(${arg})$ 代入得 $1 - 2\\sin^2(${arg})$。`,
            ),
          },
        ];
        const item = rng.pick(items);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
    {
      id: "evaluating-cos-double-angle",
      title: t("Evaluating $\\cos 2\\theta$ from a given value", "由已知值求 $\\cos 2\\theta$"),
      explanation: t(
        "Picking the form that matches the given ratio saves a step and avoids worrying about the sign of the other ratio.\n\nIf $\\sin\\theta = \\frac{5}{13}$, use the form $1 - 2\\sin^2\\theta$ (only sine needed):\n\n$$\\cos(2\\theta) = 1 - 2\\left(\\frac{5}{13}\\right)^2 = 1 - \\frac{50}{169} = \\frac{119}{169}$$",
        "选用与已知三角比相对应的形式，可以省去一步，也不用考虑另一个三角比的符号。\n\n若 $\\sin\\theta = \\frac{5}{13}$，使用只含正弦的形式 $1 - 2\\sin^2\\theta$：\n\n$$\\cos(2\\theta) = 1 - 2\\left(\\frac{5}{13}\\right)^2 = 1 - \\frac{50}{169} = \\frac{119}{169}$$",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const);
        const v = rng.pick(["\\theta", "x", "\\alpha"]);
        const sign = rng.pick([1, -1]);
        const useSin = rng.pick([true, false]);
        const sinSq = Q.of(a * a, c * c);
        const cosSq = Q.of(b * b, c * c);
        const ans = cosSq.sub(sinSq);
        const wrong1 = sinSq.sub(cosSq);
        const wrong2 = sinSq.mul(Q.of(2)).sub(Q.of(1));
        const wrong3 = Q.of(a * b * 2, c * c);
        if (useSin) {
          const val = Q.of(sign * a, c);
          return numberProblem({
            prompt: t(
              `If $\\sin ${v} = ${val.toLatex()}$, find $\\cos(2${v})$.`,
              `若 $\\sin ${v} = ${val.toLatex()}$，求 $\\cos(2${v})$。`,
            ),
            answer: ans,
            wrong: [wrong1, wrong2, wrong3],
            solution: t(
              `Use $\\cos(2${v}) = 1 - 2\\sin^2 ${v} = 1 - 2\\left(${val.toLatex()}\\right)^2 = ${ans.toLatex()}$.`,
              `使用 $\\cos(2${v}) = 1 - 2\\sin^2 ${v} = 1 - 2\\left(${val.toLatex()}\\right)^2 = ${ans.toLatex()}$。`,
            ),
            form: "fraction",
          });
        } else {
          const val = Q.of(sign * b, c);
          return numberProblem({
            prompt: t(
              `If $\\cos ${v} = ${val.toLatex()}$, find $\\cos(2${v})$.`,
              `若 $\\cos ${v} = ${val.toLatex()}$，求 $\\cos(2${v})$。`,
            ),
            answer: ans,
            wrong: [wrong1, wrong2, wrong3],
            solution: t(
              `Use $\\cos(2${v}) = 2\\cos^2 ${v} - 1 = 2\\left(${val.toLatex()}\\right)^2 - 1 = ${ans.toLatex()}$.`,
              `使用 $\\cos(2${v}) = 2\\cos^2 ${v} - 1 = 2\\left(${val.toLatex()}\\right)^2 - 1 = ${ans.toLatex()}$。`,
            ),
            form: "fraction",
          });
        }
      },
    },
  ],
};

// ─── 4.12.5 Verifying identities using cos double-angle ──────────────────────

/** verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulasForCosine covers identity verification with cos(2θ). */
export const verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulasForCosine: TopicDef = {
  id: "verifying-trigonometric-identities-using-the-double-angle-formulas-for-cosine",
  title: t("Verifying Trigonometric Identities Using the Double-Angle Formulas for Cosine", "利用余弦二倍角公式验证三角恒等式"),
  summary: t(
    "Prove identities by choosing the most useful form of cos(2θ) and simplifying.",
    "选择 cos(2θ) 最适用的形式并化简来证明三角恒等式。",
  ),
  prerequisites: ["the-double-angle-formula-for-cosine"],
  encompasses: [{ topic: "the-double-angle-formula-for-cosine", weight: 0.6 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "choosing-form-for-cos-identity",
      title: t("Choosing the right form of $\\cos 2\\theta$ for verification", "选择合适的 $\\cos 2\\theta$ 形式来验证恒等式"),
      explanation: t(
        "The cosine of a double angle has three forms, so choose the one that makes the expression match the other side of the identity most directly. To show $1 + \\cos(2\\theta) = 2\\cos^2\\theta$, substitute $\\cos(2\\theta) = 2\\cos^2\\theta - 1$:\n\n$$1 + (2\\cos^2\\theta - 1) = 2\\cos^2\\theta \\checkmark$$",
        "二倍角的余弦有三种形式，要选择能使式子最直接地与恒等式另一边相同的那一种。为证明 $1 + \\cos(2\\theta) = 2\\cos^2\\theta$，代入 $\\cos(2\\theta) = 2\\cos^2\\theta - 1$：\n\n$$1 + (2\\cos^2\\theta - 1) = 2\\cos^2\\theta \\checkmark$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const items = [
          {
            prompt: t(`Which is equal to $1 + \\cos(${doubleArg})$?`, `哪个表达式等于 $1 + \\cos(${doubleArg})$？`),
            ans: t(`$2\\cos^2(${arg})$`, `$2\\cos^2(${arg})$`),
            wrong: [
              t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
              t(`$\\cos^2(${arg})$`, `$\\cos^2(${arg})$`),
              t(`$2\\cos(${doubleArg})$`, `$2\\cos(${doubleArg})$`),
            ],
            sol: t(
              `Substitute $\\cos(${doubleArg}) = 2\\cos^2(${arg}) - 1$: result is $2\\cos^2(${arg})$.`,
              `代入 $\\cos(${doubleArg}) = 2\\cos^2(${arg}) - 1$：结果为 $2\\cos^2(${arg})$。`,
            ),
          },
          {
            prompt: t(`Which is equal to $1 - \\cos(${doubleArg})$?`, `哪个表达式等于 $1 - \\cos(${doubleArg})$？`),
            ans: t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
            wrong: [
              t(`$2\\cos^2(${arg})$`, `$2\\cos^2(${arg})$`),
              t(`$\\sin^2(${arg})$`, `$\\sin^2(${arg})$`),
              t(`$-2\\sin^2(${arg})$`, `$-2\\sin^2(${arg})$`),
            ],
            sol: t(
              `Substitute $\\cos(${doubleArg}) = 1 - 2\\sin^2(${arg})$: result is $2\\sin^2(${arg})$.`,
              `代入 $\\cos(${doubleArg}) = 1 - 2\\sin^2(${arg})$：结果为 $2\\sin^2(${arg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $\\cos^2(${arg}) - \\sin^2(${arg})$.`, `化简 $\\cos^2(${arg}) - \\sin^2(${arg})$。`),
            ans: t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\cos^2(${doubleArg})$`, `$\\cos^2(${doubleArg})$`),
              t(`$1$`, `$1$`),
            ],
            sol: t(
              `By the double-angle formula, $\\cos^2(${arg}) - \\sin^2(${arg}) = \\cos(${doubleArg})$.`,
              `由二倍角公式，$\\cos^2(${arg}) - \\sin^2(${arg}) = \\cos(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $2\\cos^2(${arg}) - 1$.`, `化简 $2\\cos^2(${arg}) - 1$。`),
            ans: t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\cos^2(${arg})$`, `$\\cos^2(${arg})$`),
              t(`$2\\cos(${doubleArg}) - 1$`, `$2\\cos(${doubleArg}) - 1$`),
            ],
            sol: t(
              `$2\\cos^2(${arg}) - 1 = \\cos(${doubleArg})$ is one form of the double-angle formula.`,
              `$2\\cos^2(${arg}) - 1 = \\cos(${doubleArg})$ 是二倍角公式的一种形式。`,
            ),
          },
        ];
        const item = rng.pick(items);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
    {
      id: "cos-double-angle-in-quotients",
      title: t("Simplifying quotients that contain $\\cos 2\\theta$", "化简含 $\\cos 2\\theta$ 的分式"),
      explanation: t(
        "In a quotient, pick the form of $\\cos(2\\theta)$ that shares a factor with the other part, then cancel. The form $\\cos^2\\theta - \\sin^2\\theta$ factors as a difference of squares, so it cancels a sum or difference of sine and cosine:\n\n$$\\frac{\\cos(2\\theta)}{\\cos\\theta + \\sin\\theta} = \\frac{(\\cos\\theta - \\sin\\theta)(\\cos\\theta + \\sin\\theta)}{\\cos\\theta + \\sin\\theta} = \\cos\\theta - \\sin\\theta$$\n\nThe forms $1 - 2\\sin^2\\theta$ and $2\\cos^2\\theta - 1$ instead turn $1 \\pm \\cos(2\\theta)$ into a single square.",
        "在分式中，选择与另一部分有公因式的 $\\cos(2\\theta)$ 形式，然后约分。形式 $\\cos^2\\theta - \\sin^2\\theta$ 可按平方差分解，因此能约去正弦与余弦的和或差：\n\n$$\\frac{\\cos(2\\theta)}{\\cos\\theta + \\sin\\theta} = \\frac{(\\cos\\theta - \\sin\\theta)(\\cos\\theta + \\sin\\theta)}{\\cos\\theta + \\sin\\theta} = \\cos\\theta - \\sin\\theta$$\n\n而形式 $1 - 2\\sin^2\\theta$ 与 $2\\cos^2\\theta - 1$ 则把 $1 \\pm \\cos(2\\theta)$ 变成单个平方。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const m = (s: string) => t(`$${s}$`, `$${s}$`);
        const s = `\\sin(${arg})`;
        const c = `\\cos(${arg})`;
        const items = [
          {
            prompt: t(`Simplify $\\dfrac{\\cos(${doubleArg})}{${c} + ${s}}$.`, `化简 $\\dfrac{\\cos(${doubleArg})}{${c} + ${s}}$。`),
            ans: m(`${c} - ${s}`),
            wrong: [m(`${c} + ${s}`), m(`${s} - ${c}`), m(`1`)],
            sol: t(
              `$\\cos(${doubleArg}) = (${c} - ${s})(${c} + ${s})$, so the quotient is $${c} - ${s}$.`,
              `$\\cos(${doubleArg}) = (${c} - ${s})(${c} + ${s})$，故商为 $${c} - ${s}$。`,
            ),
          },
          {
            prompt: t(`Simplify $\\dfrac{\\cos(${doubleArg})}{${c} - ${s}}$.`, `化简 $\\dfrac{\\cos(${doubleArg})}{${c} - ${s}}$。`),
            ans: m(`${c} + ${s}`),
            wrong: [m(`${c} - ${s}`), m(`-${c} - ${s}`), m(`1`)],
            sol: t(
              `$\\cos(${doubleArg}) = (${c} - ${s})(${c} + ${s})$, so the quotient is $${c} + ${s}$.`,
              `$\\cos(${doubleArg}) = (${c} - ${s})(${c} + ${s})$，故商为 $${c} + ${s}$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $\\dfrac{1 - \\cos(${doubleArg})}{1 + \\cos(${doubleArg})}$.`,
              `化简 $\\dfrac{1 - \\cos(${doubleArg})}{1 + \\cos(${doubleArg})}$。`,
            ),
            ans: m(`\\tan^2(${arg})`),
            wrong: [m(`\\cot^2(${arg})`), m(`\\tan(${arg})`), m(`\\tan^2(${doubleArg})`)],
            sol: t(
              `The top is $2\\sin^2(${arg})$ and the bottom is $2\\cos^2(${arg})$, so the quotient is $\\tan^2(${arg})$.`,
              `分子为 $2\\sin^2(${arg})$，分母为 $2\\cos^2(${arg})$，故商为 $\\tan^2(${arg})$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $\\dfrac{1 - \\cos(${doubleArg})}{\\sin(${doubleArg})}$.`,
              `化简 $\\dfrac{1 - \\cos(${doubleArg})}{\\sin(${doubleArg})}$。`,
            ),
            ans: m(`\\tan(${arg})`),
            wrong: [m(`\\cot(${arg})`), m(`\\tan(${doubleArg})`), m(`\\sin(${arg})`)],
            sol: t(
              `$\\dfrac{2\\sin^2(${arg})}{2${s}${c}} = \\dfrac{${s}}{${c}} = \\tan(${arg})$.`,
              `$\\dfrac{2\\sin^2(${arg})}{2${s}${c}} = \\dfrac{${s}}{${c}} = \\tan(${arg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $\\cos^4(${arg}) - \\sin^4(${arg})$.`, `化简 $\\cos^4(${arg}) - \\sin^4(${arg})$。`),
            ans: m(`\\cos(${doubleArg})`),
            wrong: [m(`\\cos^2(${doubleArg})`), m(`1`), m(`\\cos(${4 * k}${v})`)],
            sol: t(
              `Factor: $(\\cos^2(${arg}) - \\sin^2(${arg}))(\\cos^2(${arg}) + \\sin^2(${arg})) = \\cos(${doubleArg})\\cdot 1$.`,
              `分解：$(\\cos^2(${arg}) - \\sin^2(${arg}))(\\cos^2(${arg}) + \\sin^2(${arg})) = \\cos(${doubleArg})\\cdot 1$。`,
            ),
          },
        ];
        const item = rng.pick(items);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
  ],
};

// ─── 4.12.6 Exact values using cos double-angle ──────────────────────────────

/** findingExactValuesOfTrigonometricExpressionsUsingTheDoubleAngleFormulasForCosine. */
export const findingExactValuesOfTrigonometricExpressionsUsingTheDoubleAngleFormulasForCosine: TopicDef = {
  id: "finding-exact-values-of-trigonometric-expressions-using-the-double-angle-formulas-for-cosine",
  title: t(
    "Finding Exact Values of Trigonometric Expressions Using the Double-Angle Formulas for Cosine",
    "用余弦二倍角公式求三角表达式的精确值",
  ),
  summary: t(
    "Compute exact values like cos(π/8) and cos(5π/12) by applying the cosine double-angle formula in reverse.",
    "通过逆用余弦二倍角公式求 cos(π/8)、cos(5π/12) 等精确值。",
  ),
  prerequisites: ["the-double-angle-formula-for-cosine", "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine"],
  encompasses: [{ topic: "the-double-angle-formula-for-cosine", weight: 0.5 }],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "evaluating-cos-2theta-at-special-angles",
      title: t("Evaluating $\\cos 2\\theta$ at special angles", "在特殊角处求 $\\cos 2\\theta$"),
      explanation: t(
        "When an angle is twice a special angle, the double angle formula expresses its cosine through the known values of the smaller angle. Use a known double angle:\n\n$$\\cos\\left(\\frac{\\pi}{3}\\right) = \\cos\\left(2\\cdot\\frac{\\pi}{6}\\right) = 2\\cos^2\\frac{\\pi}{6} - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2} \\checkmark$$",
        "当一个角是某个特殊角的两倍时，二倍角公式可以用小角的已知值表示它的余弦。利用已知的二倍角：\n\n$$\\cos\\left(\\frac{\\pi}{3}\\right) = \\cos\\left(2\\cdot\\frac{\\pi}{6}\\right) = 2\\cos^2\\frac{\\pi}{6} - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2} \\checkmark$$",
      ),
      generate(rng) {
        const items = [
          {
            expr: "\\cos\\left(\\frac{\\pi}{3}\\right)",
            half: "\\frac{\\pi}{6}",
            ans: "\\frac{1}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{2}}{2}", "-\\frac{1}{2}"],
            sol: "$\\cos(\\pi/3) = 2\\cos^2(\\pi/6) - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2}$",
          },
          {
            expr: "\\cos\\left(\\frac{2\\pi}{3}\\right)",
            half: "\\frac{\\pi}{3}",
            ans: "-\\frac{1}{2}",
            wrong: ["\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}", "-\\frac{\\sqrt{3}}{2}"],
            sol: "$\\cos(2\\pi/3) = 2\\cos^2(\\pi/3) - 1 = 2\\cdot\\frac{1}{4} - 1 = -\\frac{1}{2}$",
          },
          {
            expr: "\\cos\\left(\\frac{\\pi}{2}\\right)",
            half: "\\frac{\\pi}{4}",
            ans: "0",
            wrong: ["1", "\\frac{\\sqrt{2}}{2}", "\\frac{1}{2}"],
            sol: "$\\cos(\\pi/2) = 2\\cos^2(\\pi/4) - 1 = 2\\cdot\\frac{1}{2} - 1 = 0$",
          },
          {
            expr: "\\cos(\\pi)",
            half: "\\frac{\\pi}{2}",
            ans: "-1",
            wrong: ["0", "1", "-\\frac{1}{2}"],
            sol: "$\\cos(\\pi) = 2\\cos^2(\\pi/2) - 1 = 2\\cdot 0 - 1 = -1$",
          },
          {
            expr: "\\cos(60^\\circ)",
            half: "30^\\circ",
            ans: "\\frac{1}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{2}}{2}", "1"],
            sol: "$\\cos(60^\\circ) = 2\\cos^2(30^\\circ) - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2}$",
          },
          {
            expr: "\\cos(90^\\circ)",
            half: "45^\\circ",
            ans: "0",
            wrong: ["1", "\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}"],
            sol: "$\\cos(90^\\circ) = 2\\cos^2(45^\\circ) - 1 = 2\\cdot\\frac{1}{2} - 1 = 0$",
          },
          {
            expr: "\\cos(120^\\circ)",
            half: "60^\\circ",
            ans: "-\\frac{1}{2}",
            wrong: ["\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}", "0"],
            sol: "$\\cos(120^\\circ) = 2\\cos^2(60^\\circ) - 1 = 2\\cdot\\frac{1}{4} - 1 = -\\frac{1}{2}$",
          },
          {
            expr: "\\cos(180^\\circ)",
            half: "90^\\circ",
            ans: "-1",
            wrong: ["0", "1", "-\\frac{1}{2}"],
            sol: "$\\cos(180^\\circ) = 2\\cos^2(90^\\circ) - 1 = -1$",
          },
          {
            expr: "2\\cos^2(15^\\circ) - 1",
            half: "15^\\circ",
            ans: "\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "1"],
            sol: "$2\\cos^2(15^\\circ) - 1 = \\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}$",
          },
          {
            expr: "1 - 2\\sin^2(15^\\circ)",
            half: "15^\\circ",
            ans: "\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{3}}{2}"],
            sol: "$1 - 2\\sin^2(15^\\circ) = \\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}$",
          },
          {
            expr: "2\\cos^2(22.5^\\circ) - 1",
            half: "22.5^\\circ",
            ans: "\\frac{\\sqrt{2}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}", "1"],
            sol: "$2\\cos^2(22.5^\\circ) - 1 = \\cos(45^\\circ) = \\frac{\\sqrt{2}}{2}$",
          },
          {
            expr: "1 - 2\\sin^2(22.5^\\circ)",
            half: "22.5^\\circ",
            ans: "\\frac{\\sqrt{2}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}", "-\\frac{\\sqrt{2}}{2}"],
            sol: "$1 - 2\\sin^2(22.5^\\circ) = \\cos(45^\\circ) = \\frac{\\sqrt{2}}{2}$",
          },
          {
            expr: "2\\cos^2(75^\\circ) - 1",
            half: "75^\\circ",
            ans: "-\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}", "\\frac{1}{2}"],
            sol: "$2\\cos^2(75^\\circ) - 1 = \\cos(150^\\circ) = -\\frac{\\sqrt{3}}{2}$",
          },
          {
            expr: "1 - 2\\sin^2(75^\\circ)",
            half: "75^\\circ",
            ans: "-\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}", "0"],
            sol: "$1 - 2\\sin^2(75^\\circ) = \\cos(150^\\circ) = -\\frac{\\sqrt{3}}{2}$",
          },
        ];
        const mult = rng.pick([1, 2, 4]);
        const item = rng.pick(items);
        const promptStr = mult === 1 ? item.expr : `${mult}\\left(${item.expr}\\right)`;
        const ansStr = scaleSurd(item.ans, mult);
        const wrongStr = item.wrong.map((w) => `$${scaleSurd(w, mult)}$`);
        return oneOf(
          rng,
          t(
            `Find the exact value of $\\displaystyle ${promptStr}$ using double-angle properties.`,
            `利用二倍角性质求 $\\displaystyle ${promptStr}$ 的精确值。`,
          ),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `${item.sol}${mult === 1 ? "" : `, and multiplying by $${mult}$ gives $${ansStr}$`}.`,
            `${item.sol}${mult === 1 ? "" : `，乘以 $${mult}$ 得 $${ansStr}$`}。`,
          ),
        );
      },
    },
    {
      id: "squares-from-a-known-cos-2theta",
      title: t(
        "Finding $\\cos^2\\theta$ or $\\sin^2\\theta$ from $\\cos 2\\theta$",
        "由 $\\cos 2\\theta$ 求 $\\cos^2\\theta$ 或 $\\sin^2\\theta$",
      ),
      explanation: t(
        "Solving the forms $\\cos(2\\theta) = 2\\cos^2\\theta - 1$ and $\\cos(2\\theta) = 1 - 2\\sin^2\\theta$ for the squares runs the formula in reverse:\n\n$$\\cos^2\\theta = \\frac{1 + \\cos(2\\theta)}{2}, \\qquad \\sin^2\\theta = \\frac{1 - \\cos(2\\theta)}{2}$$\n\nSo a known value of $\\cos(2\\theta)$ gives both squares exactly. If $\\cos(2\\theta) = \\frac{1}{3}$, then $\\cos^2\\theta = \\frac{1 + 1/3}{2} = \\frac{2}{3}$ and $\\sin^2\\theta = \\frac{1}{3}$; the two always add to $1$.",
        "把 $\\cos(2\\theta) = 2\\cos^2\\theta - 1$ 与 $\\cos(2\\theta) = 1 - 2\\sin^2\\theta$ 解出平方项，就是逆用公式：\n\n$$\\cos^2\\theta = \\frac{1 + \\cos(2\\theta)}{2}, \\qquad \\sin^2\\theta = \\frac{1 - \\cos(2\\theta)}{2}$$\n\n因此已知 $\\cos(2\\theta)$ 的值就能精确求出两个平方。若 $\\cos(2\\theta) = \\frac{1}{3}$，则 $\\cos^2\\theta = \\frac{1 + 1/3}{2} = \\frac{2}{3}$，$\\sin^2\\theta = \\frac{1}{3}$；两者之和总是 $1$。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha"]);
        const d = rng.int(3, 9);
        const n = rng.pick([-1, 1]) * rng.int(1, d - 1);
        const given = Q.of(n, d);
        const wantCos = rng.bool();
        const one = Q.of(1);
        const half = Q.of(1, 2);
        const ans = (wantCos ? one.add(given) : one.sub(given)).mul(half);
        const other = (wantCos ? one.sub(given) : one.add(given)).mul(half);
        const sq = wantCos ? `\\cos^2 ${v}` : `\\sin^2 ${v}`;
        const sign = wantCos ? "+" : "-";
        return numberProblem({
          prompt: t(`If $\\cos(2${v}) = ${given.toLatex()}$, find $${sq}$.`, `若 $\\cos(2${v}) = ${given.toLatex()}$，求 $${sq}$。`),
          answer: ans,
          wrong: [other, wantCos ? one.add(given) : one.sub(given), given.mul(half)].filter((w) => !w.eq(ans)),
          solution: t(
            `$${sq} = \\dfrac{1 ${sign} \\cos(2${v})}{2} = \\dfrac{1 ${sign} (${given.toLatex()})}{2} = ${ans.toLatex()}$.`,
            `$${sq} = \\dfrac{1 ${sign} \\cos(2${v})}{2} = \\dfrac{1 ${sign} (${given.toLatex()})}{2} = ${ans.toLatex()}$。`,
          ),
          form: "fraction",
        });
      },
    },
  ],
};

// ─── 4.12.7 Simplifying expressions using tan double-angle ───────────────────

/** simplifyingExpressionsUsingTheDoubleAngleFormulaForTangent covers tan(2θ) = 2tan(θ)/(1−tan²θ). */
export const simplifyingExpressionsUsingTheDoubleAngleFormulaForTangent: TopicDef = {
  id: "simplifying-expressions-using-the-double-angle-formula-for-tangent",
  title: t("Simplifying Expressions Using the Double-Angle Formula for Tangent", "用正切二倍角公式化简表达式"),
  summary: t(
    "Apply tan(2θ) = 2tan(θ) / (1 − tan²θ) to simplify or evaluate tangent expressions.",
    "应用 tan(2θ) = 2tan(θ) / (1 − tan²θ) 化简或求值正切表达式。",
  ),
  prerequisites: [
    "the-sum-and-difference-formulas-for-tangent",
    "the-double-angle-formula-for-sine",
    "the-double-angle-formula-for-cosine",
  ],
  encompasses: [],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "tan-double-angle-formula",
      title: t("The double-angle formula for tangent", "正切的二倍角公式"),
      explanation: t(
        "Setting both angles equal in the tangent sum formula gives the double angle formula, which finds the tangent of twice an angle from the tangent of the angle. From the addition formula with $A=B=\\theta$:\n\n$$\\tan(2\\theta) = \\frac{2\\tan\\theta}{1 - \\tan^2\\theta}$$\n\nExample: if $\\tan\\theta = \\frac{1}{2}$, then $\\tan(2\\theta) = \\frac{2\\cdot\\frac{1}{2}}{1 - \\frac{1}{4}} = \\frac{1}{\\frac{3}{4}} = \\frac{4}{3}$.",
        "在正切和角公式中令两个角相等，就得到二倍角公式，它由一个角的正切求出两倍角的正切。由和角公式令 $A=B=\\theta$，得：\n\n$$\\tan(2\\theta) = \\frac{2\\tan\\theta}{1 - \\tan^2\\theta}$$\n\n例如，若 $\\tan\\theta = \\frac{1}{2}$，则 $\\tan(2\\theta) = \\frac{2\\cdot\\frac{1}{2}}{1 - \\frac{1}{4}} = \\frac{1}{\\frac{3}{4}} = \\frac{4}{3}$。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const pairs: [number, number][] = [
          [1, 2],
          [1, 3],
          [1, 4],
          [1, 5],
          [2, 3],
          [2, 5],
          [3, 4],
          [3, 5],
          [4, 3],
          [3, 2],
          [5, 2],
        ];
        const [p, q2] = rng.pick(pairs);
        const sign = rng.pick([1, -1]);
        const tanVal = Q.of(sign * p, q2);
        const tan2val = tanVal.mul(Q.of(2)).div(Q.of(1).sub(tanVal.mul(tanVal)));
        const wrong2a = tanVal.mul(Q.of(2));
        const wrong2b = Q.of(sign * p * 2, q2);
        const wrong2c = Q.of(-tan2val.n, tan2val.d);
        return numberProblem({
          prompt: t(
            `If $\\tan ${v} = ${tanVal.toLatex()}$, find $\\tan(2${v})$.`,
            `若 $\\tan ${v} = ${tanVal.toLatex()}$，求 $\\tan(2${v})$。`,
          ),
          answer: tan2val,
          wrong: [wrong2a, wrong2b, wrong2c],
          solution: t(
            `$\\tan(2${v}) = \\frac{2\\cdot(${tanVal.toLatex()})}{1 - (${tanVal.toLatex()})^2} = ${tan2val.toLatex()}$.`,
            `$\\tan(2${v}) = \\frac{2\\cdot(${tanVal.toLatex()})}{1 - (${tanVal.toLatex()})^2} = ${tan2val.toLatex()}$。`,
          ),
          form: "fraction",
        });
      },
    },
    {
      id: "tan-double-angle-rewriting",
      title: t("Rewriting products as tan double-angle", "将乘积改写为正切二倍角"),
      explanation: t(
        "When a fraction has twice a tangent on top and one minus its square below, it collapses to the tangent of the doubled angle. To simplify $\\dfrac{2\\tan x}{1 - \\tan^2 x}$, recognize the double-angle pattern:\n\n$$\\frac{2\\tan x}{1 - \\tan^2 x} = \\tan(2x)$$",
        "当一个分式的分子是正切的两倍、分母是 1 减去它的平方时，它可以合并为两倍角的正切。化简 $\\dfrac{2\\tan x}{1 - \\tan^2 x}$ 时，识别二倍角模式：\n\n$$\\frac{2\\tan x}{1 - \\tan^2 x} = \\tan(2x)$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([2, 3, 4, 5, 6, 7]);
        const m = rng.pick([1, 2, 3, 4]);
        const arg = m === 1 ? v : `${m}${v}`;
        const doubleArg = `${2 * m}${v}`;
        const kTex = `${k}`;
        return oneOf(
          rng,
          t(
            `Simplify $\\dfrac{${2 * k}\\tan(${arg})}{${k}(1 - \\tan^2(${arg}))}$.`,
            `化简 $\\dfrac{${2 * k}\\tan(${arg})}{${k}(1 - \\tan^2(${arg}))}$。`,
          ),
          t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
          [
            t(`$\\tan^2(${arg})$`, `$\\tan^2(${arg})$`),
            t(`$${kTex}\\tan(${doubleArg})$`, `$${kTex}\\tan(${doubleArg})$`),
            t(`$2\\tan(${arg})$`, `$2\\tan(${arg})$`),
          ],
          t(
            `Cancel the factor $${k}$: $\\frac{2\\tan(${arg})}{1 - \\tan^2(${arg})} = \\tan(${doubleArg})$.`,
            `约去因子 $${k}$：$\\frac{2\\tan(${arg})}{1 - \\tan^2(${arg})} = \\tan(${doubleArg})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.12.8 Verifying identities using tan double-angle ──────────────────────

/** verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForTangent. */
export const verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForTangent: TopicDef = {
  id: "verifying-trigonometric-identities-using-the-double-angle-formula-for-tangent",
  title: t("Verifying Trigonometric Identities Using the Double-Angle Formula for Tangent", "利用正切二倍角公式验证三角恒等式"),
  summary: t(
    "Prove identities by substituting tan(2θ) = 2tan(θ)/(1−tan²θ) and simplifying.",
    "通过代入 tan(2θ) = 2tan(θ)/(1−tan²θ) 并化简来证明三角恒等式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-double-angle-formula-for-tangent"],
  encompasses: [{ topic: "simplifying-expressions-using-the-double-angle-formula-for-tangent", weight: 0.6 }],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "verifying-tan-double-angle-identities",
      title: t("Verifying identities involving $\\tan 2\\theta$", "验证含 $\\tan 2\\theta$ 的恒等式"),
      explanation: t(
        "To verify such an identity, rewrite every function in terms of sine and cosine or in terms of tangent, then simplify one side until it matches the other. Verify $\\tan(2\\theta) = \\dfrac{2}{\\cot\\theta - \\tan\\theta}$:\n\n$$\\frac{2}{\\cot\\theta - \\tan\\theta} = \\frac{2}{\\frac{\\cos\\theta}{\\sin\\theta} - \\frac{\\sin\\theta}{\\cos\\theta}} = \\frac{2}{\\frac{\\cos^2\\theta - \\sin^2\\theta}{\\sin\\theta\\cos\\theta}} = \\frac{2\\sin\\theta\\cos\\theta}{\\cos^2\\theta - \\sin^2\\theta} = \\frac{\\sin(2\\theta)}{\\cos(2\\theta)} = \\tan(2\\theta) \\checkmark$$",
        "验证这样的恒等式时，把所有函数都用正弦和余弦或都用正切表示，再化简一边直到与另一边相同。验证 $\\tan(2\\theta) = \\dfrac{2}{\\cot\\theta - \\tan\\theta}$：\n\n$$\\frac{2}{\\cot\\theta - \\tan\\theta} = \\frac{2}{\\frac{\\cos\\theta}{\\sin\\theta} - \\frac{\\sin\\theta}{\\cos\\theta}} = \\frac{2}{\\frac{\\cos^2\\theta - \\sin^2\\theta}{\\sin\\theta\\cos\\theta}} = \\frac{2\\sin\\theta\\cos\\theta}{\\cos^2\\theta - \\sin^2\\theta} = \\frac{\\sin(2\\theta)}{\\cos(2\\theta)} = \\tan(2\\theta) \\checkmark$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const identities = [
          {
            prompt: t(`Which expression equals $\\dfrac{\\tan(${doubleArg})}{2}$?`, `哪个表达式等于 $\\dfrac{\\tan(${doubleArg})}{2}$？`),
            ans: t(`$\\dfrac{\\tan(${arg})}{1 - \\tan^2(${arg})}$`, `$\\dfrac{\\tan(${arg})}{1 - \\tan^2(${arg})}$`),
            wrong: [
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
              t(`$\\dfrac{\\tan(${arg})}{2}$`, `$\\dfrac{\\tan(${arg})}{2}$`),
              t(`$\\dfrac{2\\tan(${arg})}{1 - \\tan^2(${arg})}$`, `$\\dfrac{2\\tan(${arg})}{1 - \\tan^2(${arg})}$`),
            ],
            sol: t(
              `$\\frac{\\tan(${doubleArg})}{2} = \\frac{1}{2}\\cdot\\frac{2\\tan(${arg})}{1-\\tan^2(${arg})} = \\frac{\\tan(${arg})}{1-\\tan^2(${arg})}$.`,
              `$\\frac{\\tan(${doubleArg})}{2} = \\frac{1}{2}\\cdot\\frac{2\\tan(${arg})}{1-\\tan^2(${arg})} = \\frac{\\tan(${arg})}{1-\\tan^2(${arg})}$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $\\sin(${doubleArg})\\cdot\\dfrac{1 - \\tan^2(${arg})}{2\\tan(${arg})}$.`,
              `化简 $\\sin(${doubleArg})\\cdot\\dfrac{1 - \\tan^2(${arg})}{2\\tan(${arg})}$.`,
            ),
            ans: t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
              t(`$1$`, `$1$`),
            ],
            sol: t(
              `$\\frac{\\sin(${doubleArg})}{\\tan(${doubleArg})} = \\cos(${doubleArg})$.`,
              `$\\frac{\\sin(${doubleArg})}{\\tan(${doubleArg})} = \\cos(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Which expression equals $\\dfrac{2}{\\cot(${arg}) - \\tan(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{2}{\\cot(${arg}) - \\tan(${arg})}$？`,
            ),
            ans: t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$2\\tan(${arg})$`, `$2\\tan(${arg})$`),
              t(`$\\cot(${doubleArg})$`, `$\\cot(${doubleArg})$`),
            ],
            sol: t(
              `$\\cot(${arg}) - \\tan(${arg}) = 2\\cot(${doubleArg})$, so $\\frac{2}{2\\cot(${doubleArg})} = \\tan(${doubleArg})$.`,
              `$\\cot(${arg}) - \\tan(${arg}) = 2\\cot(${doubleArg})$，故 $\\frac{2}{2\\cot(${doubleArg})} = \\tan(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $\\dfrac{2\\sin(${arg})\\cos(${arg})}{\\cos^2(${arg}) - \\sin^2(${arg})}$.`,
              `化简 $\\dfrac{2\\sin(${arg})\\cos(${arg})}{\\cos^2(${arg}) - \\sin^2(${arg})}$。`,
            ),
            ans: t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
              t(`$\\cot(${doubleArg})$`, `$\\cot(${doubleArg})$`),
            ],
            sol: t(
              `The numerator is $\\sin(${doubleArg})$ and the denominator is $\\cos(${doubleArg})$, and their ratio is $\\tan(${doubleArg})$.`,
              `分子是 $\\sin(${doubleArg})$，分母是 $\\cos(${doubleArg})$，它们的比是 $\\tan(${doubleArg})$。`,
            ),
          },
        ];
        const item = rng.pick(identities);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
    {
      id: "double-angles-in-terms-of-tangent",
      title: t("Writing double angles in terms of $\\tan\\theta$", "用 $\\tan\\theta$ 表示二倍角"),
      explanation: t(
        "Dividing the top and bottom of an expression by $\\cos^2\\theta$ turns sines and cosines into tangents, and $1 + \\tan^2\\theta = \\sec^2\\theta$ handles the denominator. This verifies identities such as\n\n$$\\frac{2\\tan\\theta}{1 + \\tan^2\\theta} = \\frac{2\\tan\\theta}{\\sec^2\\theta} = 2\\cdot\\frac{\\sin\\theta}{\\cos\\theta}\\cdot\\cos^2\\theta = \\sin(2\\theta)$$\n\nCombining fractions over a common denominator also often produces $1 - \\tan^2\\theta$, the denominator of $\\tan(2\\theta)$.",
        "把表达式的分子分母同除以 $\\cos^2\\theta$，正弦与余弦就变成正切，而 $1 + \\tan^2\\theta = \\sec^2\\theta$ 可以处理分母。由此可以验证如下恒等式：\n\n$$\\frac{2\\tan\\theta}{1 + \\tan^2\\theta} = \\frac{2\\tan\\theta}{\\sec^2\\theta} = 2\\cdot\\frac{\\sin\\theta}{\\cos\\theta}\\cdot\\cos^2\\theta = \\sin(2\\theta)$$\n\n把分式通分时，也常会得到 $\\tan(2\\theta)$ 的分母 $1 - \\tan^2\\theta$。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const m = (s: string) => t(`$${s}$`, `$${s}$`);
        const tn = `\\tan(${arg})`;
        const items = [
          {
            prompt: t(
              `Which expression is equal to $\\dfrac{2${tn}}{1 + \\tan^2(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{2${tn}}{1 + \\tan^2(${arg})}$？`,
            ),
            ans: m(`\\sin(${doubleArg})`),
            wrong: [m(`\\tan(${doubleArg})`), m(`\\cos(${doubleArg})`), m(`2\\sin(${arg})`)],
            sol: t(
              `$1 + \\tan^2(${arg}) = \\sec^2(${arg})$, so the expression is $2\\sin(${arg})\\cos(${arg}) = \\sin(${doubleArg})$.`,
              `$1 + \\tan^2(${arg}) = \\sec^2(${arg})$，故表达式为 $2\\sin(${arg})\\cos(${arg}) = \\sin(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Which expression is equal to $\\dfrac{1 - \\tan^2(${arg})}{1 + \\tan^2(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{1 - \\tan^2(${arg})}{1 + \\tan^2(${arg})}$？`,
            ),
            ans: m(`\\cos(${doubleArg})`),
            wrong: [m(`\\cot(${doubleArg})`), m(`\\sin(${doubleArg})`), m(`1`)],
            sol: t(
              `Multiply top and bottom by $\\cos^2(${arg})$: $\\dfrac{\\cos^2(${arg}) - \\sin^2(${arg})}{\\cos^2(${arg}) + \\sin^2(${arg})} = \\cos(${doubleArg})$.`,
              `分子分母同乘 $\\cos^2(${arg})$：$\\dfrac{\\cos^2(${arg}) - \\sin^2(${arg})}{\\cos^2(${arg}) + \\sin^2(${arg})} = \\cos(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $\\dfrac{1}{1 - ${tn}} - \\dfrac{1}{1 + ${tn}}$.`,
              `化简 $\\dfrac{1}{1 - ${tn}} - \\dfrac{1}{1 + ${tn}}$。`,
            ),
            ans: m(`\\tan(${doubleArg})`),
            wrong: [m(`2${tn}`), m(`0`), m(`\\sin(${doubleArg})`)],
            sol: t(
              `Over the common denominator $1 - \\tan^2(${arg})$ the numerator is $2${tn}$, giving $\\tan(${doubleArg})$.`,
              `通分后分母为 $1 - \\tan^2(${arg})$，分子为 $2${tn}$，结果为 $\\tan(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $\\tan(${doubleArg})\\,(1 - \\tan^2(${arg}))$.`, `化简 $\\tan(${doubleArg})\\,(1 - \\tan^2(${arg}))$。`),
            ans: m(`2${tn}`),
            wrong: [m(`${tn}`), m(`\\tan(${doubleArg})`), m(`2\\tan(${doubleArg})`)],
            sol: t(
              `$\\tan(${doubleArg}) = \\dfrac{2${tn}}{1 - \\tan^2(${arg})}$, so multiplying by the denominator leaves $2${tn}$.`,
              `$\\tan(${doubleArg}) = \\dfrac{2${tn}}{1 - \\tan^2(${arg})}$，乘以分母后剩下 $2${tn}$。`,
            ),
          },
        ];
        const item = rng.pick(items);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
  ],
};

// ─── Export array: all 27 topics, modules 4.9–4.12 ───────────────────────────

export const precalculusTrigonometricIdentityTopics: readonly TopicDef[] = [
  graphingTheInverseSineFunction,
  graphingTheInverseCosineFunction,
  graphingTheInverseTangentFunction,
  evaluatingExpressionsContainingInverseTrigonometricFunctions,
  furtherEvaluatingExpressionsContainingInverseTrigonometricFunctions,
  simplifyingExpressionsUsingBasicTrigonometricIdentities,
  simplifyingExpressionsUsingThePythagoreanIdentity,
  alternateFormsOfThePythagoreanIdentity,
  simplifyingExpressionsUsingTheSecantTangentIdentity,
  alternateFormsOfTheSecantTangentIdentity,
  simplifyingTrigonometricExpressionsUsingTheCotangentCosecantIdentity,
  simplifyingTrigonometricExpressionsUsingCofunctionIdentities,
  theSumAndDifferenceFormulasForSine,
  theSumAndDifferenceFormulasForCosine,
  theSumAndDifferenceFormulasForTangent,
  calculatingTrigonometricRatiosUsingTheSumFormulaForSine,
  calculatingTrigonometricRatiosUsingTheSumFormulaForCosine,
  calculatingTrigonometricRatiosUsingTheSumFormulaForTangent,
  writingSumsOfTrigonometricFunctionsInAmplitudePhaseForm,
  theDoubleAngleFormulaForSine,
  verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForSine,
  usingTheDoubleAngleFormulaForSineWithThePythagoreanTheorem,
  theDoubleAngleFormulaForCosine,
  verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulasForCosine,
  findingExactValuesOfTrigonometricExpressionsUsingTheDoubleAngleFormulasForCosine,
  simplifyingExpressionsUsingTheDoubleAngleFormulaForTangent,
  verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForTangent,
];
