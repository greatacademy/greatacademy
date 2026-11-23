import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { gcd, Q } from "@ga/subject-math";
import { precalculusDrawings2 } from "../explanation-drawings-precalculus-2.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { remainingDrawings5 } from "../explanation-drawings-remaining-5.ts";
import { remainingDrawings6 } from "../explanation-drawings-remaining-6.ts";
import { choiceProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";
import { quad, stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus unit 4: Trigonometry (modules 4.13 to 4.15: elementary, transformed,
// and advanced trigonometric equations).

/** scaled multiplies an exact value such as $\\frac{\\sqrt{3}}{3}$ by a whole number and simplifies. */
function scaled(tex: string, by: number): string {
  if (by === 1 || tex === "0") return tex;
  const m = /^(-?)(?:\\frac\{(\d*)(\\sqrt\{\d+\})?\}\{(\d+)\}|(\d*)(\\sqrt\{\d+\})?)$/.exec(tex);
  if (!m) return `${by}\\left(${tex}\\right)`;
  const top = Number(m[2] || m[5] || 1) * by;
  const den = Number(m[4] ?? 1);
  const root = m[3] ?? m[6] ?? "";
  const g = gcd(top, den);
  const n = top / g;
  const d = den / g;
  const head = n === 1 && root !== "" ? root : `${n}${root}`;
  return `${m[1]}${d === 1 ? head : `\\frac{${head}}{${d}}`}`;
}

/** inTurn sorts angles after bringing each into one full turn of degrees. */
const inTurn = (angles: readonly number[]) => angles.map((a) => ((a % 360) + 360) % 360).sort((a, b) => a - b);

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled, with reasons for the wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** Step is one labelled step of a solution: its title, what it says, and display lines. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** Fn names a trigonometric function. */
type Fn = "sin" | "cos" | "tan" | "sec" | "csc" | "cot";

/** Basic names sine, cosine or tangent, the functions every equation here comes down to. */
type Basic = "sin" | "cos" | "tan";

/** Unit says whether a problem measures angles in degrees or in radians. */
type Unit = "deg" | "rad";

/** near tells whether two numbers agree up to rounding. */
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

/** valueAt gives fn at an angle of d degrees, or undefined where fn is undefined. */
function valueAt(fn: Fn, d: number): number | undefined {
  const r = (d * Math.PI) / 180;
  const clean = (x: number) => (Math.abs(x) < 1e-12 ? 0 : x);
  const s = clean(Math.sin(r));
  const c = clean(Math.cos(r));
  if (fn === "sin") return s;
  if (fn === "cos") return c;
  if (fn === "tan") return c === 0 ? undefined : s / c;
  if (fn === "sec") return c === 0 ? undefined : 1 / c;
  if (fn === "csc") return s === 0 ? undefined : 1 / s;
  return s === 0 ? undefined : c / s;
}

/** exactValues lists the sizes of the exact values these equations use, with their LaTeX. */
const exactValues: readonly (readonly [number, string])[] = [
  [0, "0"],
  [1 / 2, "\\frac{1}{2}"],
  [Math.SQRT2 / 2, "\\frac{\\sqrt{2}}{2}"],
  [Math.sqrt(3) / 2, "\\frac{\\sqrt{3}}{2}"],
  [1, "1"],
  [Math.sqrt(3), "\\sqrt{3}"],
  [Math.sqrt(3) / 3, "\\frac{\\sqrt{3}}{3}"],
  [2, "2"],
  [Math.SQRT2, "\\sqrt{2}"],
  [(2 * Math.sqrt(3)) / 3, "\\frac{2\\sqrt{3}}{3}"],
];

/** exact writes an exact value of a trigonometric function in LaTeX, such as -\frac{\sqrt{3}}{2}. */
function exact(x: number): string {
  const hit = exactValues.find(([size]) => near(size, Math.abs(x)));
  if (!hit) return String(Number(x.toPrecision(3)));
  return x < 0 ? `-${hit[1]}` : hit[1];
}

/** amountOf reads an exact value written in LaTeX, such as -\frac{\sqrt{3}}{2} or 2\sqrt{3}. */
function amountOf(tex: string): number {
  const m = /^(-?)(?:\\frac\{(\d*)(?:\\sqrt\{(\d+)\})?\}\{(\d+)\}|(\d*)(?:\\sqrt\{(\d+)\})?)$/.exec(tex);
  if (!m) throw new Error(`not an exact value: ${tex}`);
  const top = Number(m[2] || m[5] || 1) * Math.sqrt(Number(m[3] ?? m[6] ?? 1));
  return ((m[1] ? -1 : 1) * top) / Number(m[4] ?? 1);
}

/** piTex writes an angle of d degrees as a multiple of pi in LaTeX. */
function piTex(d: number): string {
  if (d === 0) return "0";
  const g = gcd(Math.abs(2 * d), 360);
  const n = (2 * d) / g;
  const den = 360 / g;
  const head = Math.abs(n) === 1 ? "\\pi" : `${Math.abs(n)}\\pi`;
  return `${n < 0 ? "-" : ""}${den === 1 ? head : `\\frac{${head}}{${den}}`}`;
}

/** degreesOf reads an angle such as 0, \pi, 2\pi or -\frac{5\pi}{6} as degrees, or NaN when it is not one. */
function degreesOf(tex: string): number {
  if (tex === "0") return 0;
  const m = /^(-?)(?:\\frac\{(\d*)\\pi\}\{(\d+)\}|(\d*)\\pi)$/.exec(tex);
  if (!m) return Number.NaN;
  return ((m[1] ? -1 : 1) * Number(m[2] || m[4] || 1) * 180) / Number(m[3] ?? 1);
}

/** anglesOf lists the angles in [0°, 360°), at multiples of 7.5°, where fn takes the value w. */
function anglesOf(fn: Fn, w: number): number[] {
  const out: number[] = [];
  for (let d = 0; d < 360; d += 7.5) {
    const y = valueAt(fn, d);
    if (y !== undefined && near(y, w)) out.push(d);
  }
  return out;
}

/** fnNames gives each function's name in English and Chinese. */
const fnNames: Record<Fn, readonly [en: string, zh: string]> = {
  sin: ["sine", "正弦"],
  cos: ["cosine", "余弦"],
  tan: ["tangent", "正切"],
  sec: ["secant", "正割"],
  csc: ["cosecant", "余割"],
  cot: ["cotangent", "余切"],
};

/** cap starts a word with a capital letter. */
const cap = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

/** baseOf gives the function a reciprocal function is the reciprocal of, and any other function itself. */
const baseOf = (fn: Fn): Basic => (fn === "sec" ? "cos" : fn === "csc" ? "sin" : fn === "cot" ? "tan" : fn);

/** of writes fn of the variable as the prompts do: \sin x in radians, \sin(x^{\circ}) in degrees. */
const of = (fn: Fn, v: string, unit: Unit) => (unit === "deg" ? `\\${fn}(${v}^{\\circ})` : `\\${fn} ${v}`);

/** shown writes an angle of d degrees as a problem gives it: 150 in degrees, \frac{5\pi}{6} in radians. */
const shown = (d: number, unit: Unit) => (unit === "deg" ? String(d) : piTex(d));

/** fnAt writes fn at an angle of d degrees: \sin(150^{\circ}) or \sin\left(\frac{5\pi}{6}\right). */
const fnAt = (fn: Fn, d: number, unit: Unit) => {
  if (unit === "deg") return `\\${fn}(${d}^{\\circ})`;
  const a = piTex(d);
  return a.includes("\\frac") ? `\\${fn}\\left(${a}\\right)` : `\\${fn} ${a}`;
};

/** half writes half a turn, and full a full turn, in the unit of a problem. */
const half = (unit: Unit) => (unit === "deg" ? "180" : "\\pi");
const full = (unit: Unit) => (unit === "deg" ? "360" : "2\\pi");

/** reference gives the reference angle of an angle of d degrees. */
const reference = (d: number) => {
  const r = d % 180;
  return r > 90 ? 180 - r : r;
};

/** solveBasic writes the step that finds where sine, cosine or tangent takes the value w in one turn, and returns those angles. */
function solveBasic(fn: Basic, w: number, v: string, unit: Unit): readonly [Step, number[]] {
  const ds = anglesOf(fn, w);
  const [en, zh] = fnNames[fn];
  const list = ds.map((d) => shown(d, unit)).join(", \\; ");
  if (ds.every((d) => d % 90 === 0)) {
    const axes = [0, 90, 180, 270].map((d) => shown(d, unit)).join(", ");
    return [
      [
        ["Use the axes", "看坐标轴上的角"],
        t(
          `The value $${exact(w)}$ belongs to a point on an axis of the unit circle, so test the quadrantal angles $${axes}$. Of these, ${en} equals $${exact(w)}$ only at`,
          `值 $${exact(w)}$ 对应单位圆坐标轴上的点，所以逐一检验轴上的角 $${axes}$。其中${zh}等于 $${exact(w)}$ 的只有`,
        ),
        [`${v} = ${list}`],
      ],
      ds,
    ];
  }
  const a = reference(ds[0]!);
  const A = shown(a, unit);
  const named = unit === "deg" ? `${a}^{\\circ}` : A;
  const roman = ["I", "II", "III", "IV"];
  const cn = ["一", "二", "三", "四"];
  const quads = ds.map((d) => Math.floor(d / 90));
  const form = (d: number) => {
    const q = Math.floor(d / 90);
    if (q === 0) return `${v} = ${A}`;
    const how = q === 1 ? `${half(unit)} - ${A}` : q === 2 ? `${half(unit)} + ${A}` : `${full(unit)} - ${A}`;
    return `${v} = ${how} = ${shown(d, unit)}`;
  };
  return [
    [
      ["Use the reference angle", "用参考角"],
      t(
        `The reference angle is $${named}$, because $${fnAt(fn, a, unit)} = ${exact(Math.abs(w))}$. ${cap(en)} is ${w > 0 ? "positive" : "negative"} in Quadrants ${quads.map((q) => roman[q]).join(" and ")}, so`,
        `参考角是 $${named}$，因为 $${fnAt(fn, a, unit)} = ${exact(Math.abs(w))}$。${zh}在第${quads.map((q) => cn[q]).join("、")}象限为${w > 0 ? "正" : "负"}，所以`,
      ),
      ds.map(form),
    ],
    ds,
  ];
}

/** countNote confirms a list of solutions of a basic equation in one turn is complete, in a way other than solving. */
function countNote(fn: Basic, ds: readonly number[], unit: Unit): Text {
  if (fn === "tan") {
    return t(
      `Tangent repeats every half turn, and indeed $${shown(ds[1]!, unit)} - ${shown(ds[0]!, unit)} = ${half(unit)}$.`,
      `正切每半圈重复一次，而 $${shown(ds[1]!, unit)} - ${shown(ds[0]!, unit)} = ${half(unit)}$，正好相差半圈。`,
    );
  }
  const [en, zh] = fnNames[fn];
  if (ds.length === 1) {
    return t(
      `That value is the greatest or least that ${en} takes, reached once per turn, so one solution is all there is.`,
      `这个值是${zh}的最大值或最小值，每圈只取到一次，所以只有这一个解。`,
    );
  }
  return t(
    `${cap(en)} takes each value strictly between $-1$ and $1$ exactly twice per turn, so these two solutions are all of them.`,
    `${zh}在 $-1$ 和 $1$ 之间（不含端点）的每个值每圈恰好取到两次，所以这两个解就是全部。`,
  );
}

/** elementary solves c·f(x) = c·val in one turn, step by step, and checks the solutions by substituting them. */
function elementary(o: { fn: Fn; v: string; coeff: number; val: string; unit: Unit }): Text {
  const { fn, v, coeff, val, unit } = o;
  const w = amountOf(val);
  const lhs = of(fn, v, unit);
  const parts: Step[] = [
    [
      ["Isolate the function", "把函数单独留在一边"],
      coeff === 1
        ? t("The function already stands alone:", "函数已经单独在一边：")
        : t(`Divide both sides by $${coeff}$:`, `两边除以 $${coeff}$：`),
      [`${lhs} = ${val}`],
    ],
  ];
  let basic = baseOf(fn);
  let target = w;
  if (fn === "cot" && w === 0) {
    basic = "cos";
    parts.push([
      ["Rewrite with cosine", "改写成余弦"],
      t(
        `$${lhs}$ is cosine over sine, and a fraction is zero exactly when its numerator is:`,
        `$${lhs}$ 是余弦除以正弦，分数为零恰好是分子为零：`,
      ),
      [`${of("cos", v, unit)} = 0`],
    ]);
  } else if (basic !== fn) {
    target = 1 / w;
    parts.push([
      ["Take reciprocals", "取倒数"],
      t(
        `${cap(fnNames[fn][0])} is the reciprocal of ${fnNames[basic][0]}, so flip both sides:`,
        `${fnNames[fn][1]}是${fnNames[basic][1]}的倒数，所以两边取倒数：`,
      ),
      [`${of(basic, v, unit)} = ${exact(target)}`],
    ]);
  }
  if (basic !== "tan" && Math.abs(target) > 1) {
    parts.push([
      ["Compare with the range", "与值域比较"],
      t(
        `${cap(fnNames[basic][0])} only takes values from $-1$ to $1$, and $${exact(target)}$ is outside that range, so there is no real solution.`,
        `${fnNames[basic][1]}只取 $-1$ 到 $1$ 之间的值，而 $${exact(target)}$ 不在这个范围内，所以没有实数解。`,
      ),
    ]);
    return walked(
      parts,
      t(
        `Look at the size of the original function instead: $|${of(basic, v, unit)}| \\le 1$ forces $|${lhs}| \\ge 1$, while $\\left|${val}\\right| < 1$. No angle can work.`,
        `换个角度看原函数的大小：$|${of(basic, v, unit)}| \\le 1$ 使得 $|${lhs}| \\ge 1$，而 $\\left|${val}\\right| < 1$。没有哪个角能满足。`,
      ),
    );
  }
  const [step, ds] = solveBasic(basic, target, v, unit);
  parts.push(step);
  const lines = ds.map((d) => `${fnAt(fn, d, unit)} = ${exact(valueAt(fn, d)!)}`);
  const note = countNote(basic, ds, unit);
  const rhs = scaled(val, coeff);
  return walked(
    parts,
    t(
      `Substitute ${ds.length > 1 ? "each solution" : "the solution"} into the original function:${steps(...lines)}${coeff > 1 ? `Times $${coeff}$, that is $${rhs}$${ds.length > 1 ? " each time" : ""}, the right side.` : ds.length > 1 ? "Each value is the right side." : "That is the right side."} ${note.en}`,
      `把${ds.length > 1 ? "每个解" : "这个解"}代入原来的函数：${steps(...lines)}${coeff > 1 ? `乘以 $${coeff}$ 后${ds.length > 1 ? "每次都" : ""}是 $${rhs}$，正是右边。` : ds.length > 1 ? "每个值都等于右边。" : "这正是右边。"}${note["zh-CN"]}`,
    ),
  );
}

/** listReasons says what is wrong with each wrong list of radian angles: an angle outside the interval, an angle that fails, or one missing. */
function listReasons(
  wrong: readonly string[],
  v: string,
  hi: number,
  truth: readonly number[],
  fail: (d: number) => Text | undefined,
  from?: (d: number) => Text,
): Reason[] {
  const iv = hi === 360 ? "[0, 2\\pi)" : `[0, ${piTex(hi)})`;
  return wrong.flatMap((w): Reason[] => {
    const ds = w.split(", ").map(degreesOf);
    if (ds.some((d) => Number.isNaN(d))) return [];
    const option = `$${v} = ${w}$`;
    const out = ds.find((d) => d < 0 || d >= hi);
    if (out !== undefined) {
      const same = out === 360;
      return [
        [
          option,
          `$${piTex(out)}$ lies outside $${iv}$${same ? ", which stops just before it: it is the same point as $0$" : ""}.`,
          `$${piTex(out)}$ 不在 $${iv}$ 内${same ? "：区间在它之前就结束了，它和 $0$ 是同一个位置" : ""}。`,
        ],
      ];
    }
    for (const d of ds) {
      const r = fail(d);
      if (r) return [[option, r.en, r["zh-CN"]]];
    }
    const miss = truth.find((d) => !ds.some((e) => near(e, d)));
    if (miss === undefined) return [];
    const extra = from?.(miss);
    return [
      [
        option,
        `Every angle listed is a solution, but $${piTex(miss)}$ is missing.${extra ? ` ${extra.en}` : ""}`,
        `列出的角都是解，但漏掉了 $${piTex(miss)}$。${extra ? extra["zh-CN"] : ""}`,
      ],
    ];
  });
}

/** valueFail says why an angle of d degrees fails fn(x) = val, or nothing when it is a solution. */
function valueFail(fn: Fn, v: string, val: string, d: number): Text | undefined {
  const y = valueAt(fn, d);
  const w = amountOf(val);
  const [en, zh] = fnNames[fn];
  if (y === undefined) {
    return t(`${cap(en)} is not defined at $${piTex(d)}$, so it cannot be a solution.`, `${zh}在 $${piTex(d)}$ 处无定义，不可能是解。`);
  }
  if (near(y, w)) return undefined;
  if (near(Math.abs(y), Math.abs(w))) {
    return t(
      `At $${v} = ${piTex(d)}$, $\\${fn} ${v} = ${exact(y)}$: the reference angle is right, but the sign is wrong in that quadrant.`,
      `在 $${v} = ${piTex(d)}$ 处，$\\${fn} ${v} = ${exact(y)}$：参考角对了，但这个象限里的符号不对。`,
    );
  }
  return t(
    `At $${v} = ${piTex(d)}$, $\\${fn} ${v} = ${exact(y)}$, not $${val}$: that angle belongs to a different value.`,
    `在 $${v} = ${piTex(d)}$ 处，$\\${fn} ${v} = ${exact(y)}$，不是 $${val}$：这个角对应的是另一个值。`,
  );
}

/** elementaryReasons explains each wrong list of angles for fn(x) = val on [0, 2π). */
const elementaryReasons = (fn: Fn, v: string, val: string, wrong: readonly string[]) =>
  listReasons(wrong, v, 360, anglesOf(fn, amountOf(val)), (d) => valueFail(fn, v, val, d));

/** Inner is an equation c·f(B·x + shift) = rhs, read from its LaTeX, with the shift in degrees. */
type Inner = { c: number; fn: Basic; B: number; shift: number; rhs: string; w: number; sign: string };

/** innerOf reads an equation such as 2\sin(2x) = 1 or \cos\left(x - \frac{\pi}{4}\right) = 0. */
function innerOf(expr: string): Inner {
  const m = /^(\d*)\\(sin|cos|tan)(?:\((\d*)x\)|\\left\(x ([+-]) \\frac\{(\d*)\\pi\}\{(\d+)\}\\right\)) = (.+)$/.exec(expr);
  if (!m) throw new Error(`not a transformed equation: ${expr}`);
  const c = Number(m[1] || 1);
  const sign = m[4] ?? "";
  const shift = sign === "" ? 0 : ((sign === "+" ? 1 : -1) * Number(m[5] || 1) * 180) / Number(m[6]);
  return { c, fn: m[2] as Basic, B: Number(m[3] || 1), shift, rhs: m[7]!, w: amountOf(m[7]!) / c, sign };
}

/** innerTex writes the inner angle of an equation in the variable v. */
const innerTex = (e: Inner, v: string) => (e.sign === "" ? `${e.B}${v}` : `${v} ${e.sign} ${piTex(Math.abs(e.shift))}`);

/** innerValues lists the inner angles, in degrees, that solve an equation while the variable runs over [0, hi). */
function innerValues(e: Inner, hi: number): number[] {
  const lo = e.shift;
  const top = e.B * hi + e.shift;
  const out: number[] = [];
  for (const b of anglesOf(e.fn, e.w)) {
    for (let k = -2; k <= 2 * e.B + 2; k++) {
      const a = b + 360 * k;
      if (a >= lo - 1e-9 && a < top - 1e-9) out.push(a);
    }
  }
  return out.sort((a, b) => a - b);
}

/** transformed solves c·f(B·x + shift) = rhs for x in [0, hi) through the inner angle, and checks by substituting and counting. */
function transformed(expr: string, v: string, hi: number): Text {
  const e = innerOf(expr);
  const u = innerTex(e, v);
  const [en, zh] = fnNames[e.fn];
  const period = e.fn === "tan" ? 180 : 360;
  const lo = e.shift;
  const top = e.B * hi + e.shift;
  const us = innerValues(e, hi);
  const xs = us.map((a) => (a - e.shift) / e.B);
  const n = (top - lo) / period;
  const per = (anglesOf(e.fn, e.w).length * period) / 360;
  const iv = hi === 360 ? "[0, 2\\pi)" : `[0, ${piTex(hi)})`;
  const lhs = `\\${e.fn}\\left(${u}\\right)`;
  const parts: Step[] = [];
  if (e.c > 1)
    parts.push([
      ["Isolate the function", "把函数单独留在一边"],
      t(`Divide both sides by $${e.c}$:`, `两边除以 $${e.c}$：`),
      [`${lhs} = ${exact(e.w)}`],
    ]);
  parts.push(
    [
      ["Find the range of the inner angle", "求内层角的范围"],
      t(
        `Let $w = ${u}$. As $${v}$ runs over $${iv}$, $w$ runs over $[${piTex(lo)}, ${piTex(top)})$, which is $${n}$ ${n === 1 ? "period" : "periods"} of ${en}.`,
        `设 $w = ${u}$。当 $${v}$ 取遍 $${iv}$ 时，$w$ 取遍 $[${piTex(lo)}, ${piTex(top)})$，也就是${zh}的 $${n}$ 个周期。`,
      ),
    ],
    [
      ["List the inner angles", "列出内层角"],
      t(`In that range $\\${e.fn} w = ${exact(e.w)}$ at`, `在这个范围内，$\\${e.fn} w = ${exact(e.w)}$ 的角是`),
      [`w = ${us.map(piTex).join(", \\; ")}`],
    ],
    [
      ["Solve for the variable", "解出变量"],
      e.sign === ""
        ? t(`Divide each by $${e.B}$:`, `每个都除以 $${e.B}$：`)
        : e.shift < 0
          ? t(`Add $${piTex(-e.shift)}$ to each:`, `每个都加上 $${piTex(-e.shift)}$：`)
          : t(`Subtract $${piTex(e.shift)}$ from each:`, `每个都减去 $${piTex(e.shift)}$：`),
      [`${v} = ${xs.map(piTex).join(", \\; ")}`],
    ],
  );
  const x0 = xs[0]!;
  const u0 = us[0]!;
  const into =
    e.sign === "" ? `${e.B} \\cdot ${piTex(x0)} = ${piTex(u0)}` : `${piTex(x0)} ${e.sign} ${piTex(Math.abs(e.shift))} = ${piTex(u0)}`;
  const value = `${e.c > 1 ? e.c : ""}${fnAt(e.fn, u0, "rad")} = ${exact(e.c * valueAt(e.fn, u0)!)}`;
  return walked(
    parts,
    t(
      `Substitute the first solution into the inner angle and then into the left side:${steps(into, value)}That is the right side. Counting instead of solving: $w$ covers $${n}$ ${n === 1 ? "period" : "periods"} with $${per}$ ${per === 1 ? "solution" : "solutions"} in each, so there are $${n * per}$ solutions, as found.`,
      `把第一个解代入内层角，再代入左边：${steps(into, value)}正是右边。再换个办法数一数：$w$ 走过 $${n}$ 个周期，每个周期 $${per}$ 个解，共 $${n * per}$ 个解，与求出的一致。`,
    ),
  );
}

/** transformedReasons explains each wrong list of angles for a transformed equation on [0, hi). */
function transformedReasons(expr: string, v: string, hi: number, wrong: readonly string[]): Reason[] {
  const e = innerOf(expr);
  const truth = innerValues(e, hi).map((a) => (a - e.shift) / e.B);
  return listReasons(
    wrong,
    v,
    hi,
    truth,
    (d) => {
      const a = e.B * d + e.shift;
      const y = valueAt(e.fn, a);
      if (y === undefined) {
        return t(
          `At $${v} = ${piTex(d)}$ the inner angle is $${piTex(a)}$, where tangent is not defined.`,
          `在 $${v} = ${piTex(d)}$ 处内层角是 $${piTex(a)}$，正切在那里无定义。`,
        );
      }
      if (near(y, e.w)) return undefined;
      const lhs = `${e.c > 1 ? e.c : ""}${fnAt(e.fn, a, "rad")} = ${exact(e.c * y)}`;
      return t(
        `At $${v} = ${piTex(d)}$ the inner angle is $${piTex(a)}$, and $${lhs}$, not $${e.rhs}$.`,
        `在 $${v} = ${piTex(d)}$ 处内层角是 $${piTex(a)}$，而 $${lhs}$，不是 $${e.rhs}$。`,
      );
    },
    (d) => t(`It comes from the inner angle $${piTex(e.B * d + e.shift)}$.`, `它来自内层角 $${piTex(e.B * d + e.shift)}$。`),
  );
}

/** shiftedDegrees solves f(x° ∓ shift°) = val for x in [0, hi) through the inner angle, and checks by substituting. */
function shiftedDegrees(o: { fn: Basic; v: string; sign: number; shift: number; val: string; hi: number; inside: string }): Text {
  const { fn, v, sign, shift, val, hi, inside } = o;
  const [en, zh] = fnNames[fn];
  const lo = -sign * shift;
  const top = hi - sign * shift;
  const base = anglesOf(fn, amountOf(val)).filter((b) => fn !== "tan" || b < 180);
  const step = fn === "tan" ? 180 : 360;
  const us: number[] = [];
  for (const b of base) for (let k = -1; k <= 2; k++) if (b + step * k >= lo && b + step * k < top) us.push(b + step * k);
  us.sort((a, b) => a - b);
  const deg = (d: number) => `${d}^{\\circ}`;
  const one = us.length === 1;
  const back = us.map(
    (a) => `\\${fn}(${deg(a + sign * shift)} ${sign === 1 ? "-" : "+"} ${deg(shift)}) = \\${fn}(${deg(a)}) = ${exact(valueAt(fn, a)!)}`,
  );
  const note =
    fn === "tan"
      ? t(
          `Tangent repeats every $180^{\\circ}$, so an interval of length $${hi}$ holds exactly one solution.`,
          `正切每 $180^{\\circ}$ 重复一次，所以长度为 $${hi}$ 的区间里恰好有一个解。`,
        )
      : countNote(fn, us, "deg");
  return walked(
    [
      [
        ["Name the inner angle", "给内层角命名"],
        t(
          `Let $w = ${inside}$. As $${v}$ runs over $[0, ${hi})$, $w$ runs over $[${deg(lo)}, ${deg(top)})$.`,
          `设 $w = ${inside}$。当 $${v}$ 取遍 $[0, ${hi})$ 时，$w$ 取遍 $[${deg(lo)}, ${deg(top)})$。`,
        ),
      ],
      [
        ["Solve for the inner angle", "解出内层角"],
        t(
          `${cap(en)} equals $${val}$ at $${base.map(deg).join(", ")}$${fn === "tan" ? " and every half turn from there" : " and every full turn from there"}. The ones in the range of $w$ are`,
          `${zh}在 $${base.map(deg).join(", ")}$ 处等于 $${val}$，并且${fn === "tan" ? "每隔半圈" : "每隔一整圈"}重复。落在 $w$ 的范围内的是`,
        ),
        [`w = ${us.map(deg).join(", \\; ")}`],
      ],
      [
        ["Undo the shift", "去掉平移"],
        sign === 1
          ? t(`Add $${shift}$ to each:`, `每个都加上 $${shift}$：`)
          : t(`Subtract $${shift}$ from each:`, `每个都减去 $${shift}$：`),
        us.map((a) => `${v} = ${a} ${sign === 1 ? "+" : "-"} ${shift} = ${a + sign * shift}`),
      ],
    ],
    t(
      `Substitute ${one ? "the answer" : "each answer"} into the left side:${steps(...back)}${one ? "That is the right side, and the answer lies" : "Each is the right side, and each answer lies"} in $[0, ${hi})$. ${note.en}`,
      `把${one ? "这个答案" : "每个答案"}代入左边：${steps(...back)}${one ? "正是右边，而且答案在" : "每个都等于右边，而且每个答案都在"} $[0, ${hi})$ 内。${note["zh-CN"]}`,
    ),
  );
}

/** Part is one elementary equation f(x) = value that a factored equation splits into. */
type Part = readonly [fn: Fn, value: string];

/** partAngles lists the angles in [0°, 360°) that solve any of the parts, without repeats. */
const partAngles = (parts: readonly Part[]) =>
  [...new Set(parts.flatMap(([fn, val]) => anglesOf(fn, amountOf(val))))].sort((a, b) => a - b);

/** factored solves an equation through its factored form and the elementary equations of its factors, and checks one angle of each. */
function factored(o: { v: string; unit: Unit; fac: string; parts: readonly Part[]; pre?: readonly string[]; check?: Text }): Text {
  const { v, unit, fac, parts, pre } = o;
  const all = partAngles(parts);
  const solveLine = ([fn, val]: Part) => {
    const ds = anglesOf(fn, amountOf(val));
    return `${of(fn, v, unit)} = ${val} \\implies ${v} = ${ds.map((d) => shown(d, unit)).join(", \\; ")}`;
  };
  const head: Step[] = pre
    ? [
        [
          ["Rewrite in one function", "化成同一个函数"],
          t("Use the Pythagorean identity so that only one function is left:", "用平方关系，使方程里只剩一个函数："),
          pre,
        ],
      ]
    : [];
  const spot = parts.map(([fn, val]) => {
    const d = anglesOf(fn, amountOf(val))[0]!;
    return `${fnAt(fn, d, unit)} = ${exact(valueAt(fn, d)!)}`;
  });
  const halves = parts.every(([fn]) => fn === "tan" || fn === "cot");
  return walked(
    [
      ...head,
      [["Factor", "分解因式"], t("Write the equation as a product equal to zero:", "把方程写成乘积等于零："), [fac]],
      [
        ["Solve each factor", "分别令每个因式为零"],
        t(
          "A product is zero exactly when one of its factors is, so each factor gives an elementary equation:",
          "乘积为零当且仅当某个因式为零，所以每个因式给出一个基本方程：",
        ),
        parts.map(solveLine),
      ],
      [
        ["Combine", "合并"],
        t("Put the lists together, counting a repeated angle once:", "把各组解合在一起，重复的角只算一次："),
        [`${v} = ${all.map((d) => shown(d, unit)).join(", \\; ")}`],
      ],
    ],
    o.check ??
      t(
        `Multiplying the factors back out returns the left side${pre ? " after the rewrite" : ""}. And one angle from each factor gives that factor its value:${steps(...spot)}${halves ? "Each value of the tangent or cotangent appears twice, a half turn apart, as it must for a function that repeats every half turn." : "Each is the value that factor needs."}`,
        `把因式乘开就回到${pre ? "改写后的" : "原来的"}左边。再从每个因式取一个角，它都给出这个因式所需的值：${steps(...spot)}${halves ? "正切或余切的每个值都出现两次，相差半圈，这正是每半圈重复一次的函数应有的样子。" : "每个都是这个因式所需的值。"}`,
      ),
  );
}

/** vieta checks the two values of a quadratic in one function by the sum and product of its roots. */
function vieta(fn: Fn, v: string, unit: Unit, parts: readonly Part[], abc: readonly [number, number, number]): Text {
  const [a, b, c] = abc;
  const [p, q] = [parts[0]![1], parts[1]![1]];
  if (!near(amountOf(p) + amountOf(q), -b / a) || !near(amountOf(p) * amountOf(q), c / a))
    throw new Error(`${p}, ${q} do not solve ${abc}`);
  const pr = (s: string) => (s.startsWith("-") ? `\\left(${s}\\right)` : s);
  const eq = `${quad(a, b, c, "t")} = 0`;
  const lines = [`${p} + ${pr(q)} = ${Q.of(-b, a).toLatex()}`, `${p} \\cdot ${pr(q)} = ${Q.of(c, a).toLatex()}`];
  return t(
    `With $t = ${of(fn, v, unit)}$ the equation is $${eq}$, and its two roots must add to $-\\frac{b}{a}$ and multiply to $\\frac{c}{a}$:${steps(...lines)}Both hold, so the values $${p}$ and $${q}$ are right, and the steps above turned each of them into its angles.`,
    `令 $t = ${of(fn, v, unit)}$，方程就是 $${eq}$，它的两个根之和应为 $-\\frac{b}{a}$，之积应为 $\\frac{c}{a}$：${steps(...lines)}两式都成立，所以 $${p}$ 和 $${q}$ 这两个值是对的，上面的步骤再由它们分别求出了角。`,
  );
}

/** generalSolution solves f(B·x) = val for all real x: one cycle, then whole periods, then division by B; and checks k = 1. */
function generalSolution(o: { fn: Basic; B: number; v: string; val: string; ans: string }): Text {
  const { fn, B, v, val, ans } = o;
  const [en, zh] = fnNames[fn];
  const u = B === 1 ? v : `${B}${v}`;
  const ds = anglesOf(fn, amountOf(val));
  const P = fn === "tan" ? 180 : 360;
  let bases: number[];
  let first: Step;
  if (fn === "tan") {
    const a = ds.map((d) => (d >= 90 ? d - 180 : d)).find((d) => d > -90 && d < 90)!;
    bases = [a];
    first = [
      ["Find the principal angle", "求主值"],
      t(
        `In the half turn $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ tangent takes the value $${val}$ exactly once:`,
        `在半圈 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 内，正切恰好一次取值 $${val}$：`,
      ),
      [`${u} = ${piTex(a)}`],
    ];
  } else if (fn === "cos") {
    const a = ds[0]!;
    bases = [a, -a];
    first = [
      ["Solve in one turn", "在一圈内求解"],
      t(
        `The arccosine of $${val}$ is $${piTex(a)}$, and cosine is even, so the solutions in one turn are $${piTex(a)}$ and $${piTex(-a)}$, which is $${piTex(360 - a)}$ less a full turn:`,
        `$${val}$ 的反余弦是 $${piTex(a)}$，而余弦是偶函数，所以一圈内的解是 $${piTex(a)}$ 和 $${piTex(-a)}$，后者就是 $${piTex(360 - a)}$ 减去一整圈：`,
      ),
      [`${u} = \\pm ${piTex(a)}`],
    ];
  } else {
    bases = ds;
    first = [
      ["Solve in one turn", "在一圈内求解"],
      t(`In $[0, 2\\pi)$ sine takes the value $${val}$ at`, `在 $[0, 2\\pi)$ 内，正弦取值 $${val}$ 的角是`),
      [`${u} = ${ds.map(piTex).join(", \\; ")}`],
    ];
  }
  const period = fn === "tan" ? "k\\pi" : "2k\\pi";
  const family = fn === "cos" ? `\\pm ${piTex(bases[0]!)} + ${period}` : bases.map((b) => `${piTex(b)} + ${period}`).join(", \\; ");
  const parts: Step[] = [
    first,
    [
      ["Add whole periods", "加上整数个周期"],
      t(
        `${cap(en)} repeats every $${piTex(P)}$, so every solution is one of these plus a whole number of periods, with $k \\in \\mathbb{Z}$:`,
        `${zh}每隔 $${piTex(P)}$ 重复一次，所以每个解都是上面的角加上整数个周期，其中 $k \\in \\mathbb{Z}$：`,
      ),
      [`${u} = ${family}`],
    ],
  ];
  if (B > 1) {
    parts.push([
      ["Divide by the coefficient", "除以系数"],
      t(`Divide everything by $${B}$, the period as well:`, `全部除以 $${B}$，周期也一起除：`),
      [`${v} = ${ans}`],
    ]);
  }
  const lines = bases.map((b) => {
    const x = (b + P) / B;
    return `${B === 1 ? "" : `${B} \\cdot ${piTex(x)} = ${piTex(b + P)}, \\quad `}\\${fn}\\left(${piTex(b + P)}\\right) = ${exact(valueAt(fn, b + P)!)}`;
  });
  return walked(
    parts,
    t(
      `Take $k = 1$, which gives $${v} = ${bases.map((b) => piTex((b + P) / B)).join(", \\; ")}$, and substitute:${steps(...lines)}${bases.length > 1 ? "Each gives" : "It gives"} $${val}$ again, as a member of the family must.`,
      `取 $k = 1$，得 $${v} = ${bases.map((b) => piTex((b + P) / B)).join(", \\; ")}$，代入：${steps(...lines)}${bases.length > 1 ? "每个都" : ""}再次得到 $${val}$，族中的每个角都应如此。`,
    ),
  );
}

/** tangentFrom solves an equation between multiples of sine and cosine by dividing by cosine, and checks with sine and cosine. */
function tangentFrom(o: { v: string; eq: string; tan: string; unit: Unit }): Text {
  const { v, eq, tan, unit } = o;
  const [step, ds] = solveBasic("tan", amountOf(tan), v, unit);
  const a = ds[0]!;
  const s = of("sin", v, unit);
  const c = of("cos", v, unit);
  return walked(
    [
      [
        ["Divide by cosine", "除以余弦"],
        t(
          `Where $${c} = 0$, $${s} = \\pm 1$, so the sine term is not zero while the cosine term is, and $${eq}$ fails there. Dividing by $${c}$ therefore loses no solution, and sine over cosine is tangent:`,
          `在 $${c} = 0$ 处 $${s} = \\pm 1$，正弦项不为零而余弦项为零，所以 $${eq}$ 在那里不成立。因此除以 $${c}$ 不会丢解，而正弦除以余弦就是正切：`,
        ),
        [`${of("tan", v, unit)} = ${tan}`],
      ],
      step,
    ],
    t(
      `Go back to sine and cosine at $${v} = ${shown(a, unit)}$: $${fnAt("sin", a, unit)} = ${exact(valueAt("sin", a)!)}$ and $${fnAt("cos", a, unit)} = ${exact(valueAt("cos", a)!)}$, whose ratio is $${tan}$. Half a turn later both change sign, so the ratio stays the same.`,
      `回到正弦和余弦，在 $${v} = ${shown(a, unit)}$ 处：$${fnAt("sin", a, unit)} = ${exact(valueAt("sin", a)!)}$，$${fnAt("cos", a, unit)} = ${exact(valueAt("cos", a)!)}$，两者之比是 $${tan}$。半圈之后两者都变号，比值不变。`,
    ),
  );
}

/** balanceReasons explains each wrong list of angles for an equation between sine and cosine whose tangent must be tan. */
const balanceReasons = (v: string, tan: string, wrong: readonly string[]) =>
  listReasons(wrong, v, 360, anglesOf("tan", amountOf(tan)), (d) => {
    const y = valueAt("tan", d);
    if (y === undefined) {
      return t(
        `At $${v} = ${piTex(d)}$, $\\cos ${v} = 0$ but $\\sin ${v} = ${exact(valueAt("sin", d)!)}$, so the two sides cannot balance.`,
        `在 $${v} = ${piTex(d)}$ 处 $\\cos ${v} = 0$，但 $\\sin ${v} = ${exact(valueAt("sin", d)!)}$，两边不可能相等。`,
      );
    }
    if (near(y, amountOf(tan))) return undefined;
    return t(
      `At $${v} = ${piTex(d)}$, $\\tan ${v} = ${exact(y)}$, not $${tan}$, so the two sides do not balance.`,
      `在 $${v} = ${piTex(d)}$ 处 $\\tan ${v} = ${exact(y)}$，不是 $${tan}$，两边不相等。`,
    );
  });

/** factoredReasons explains each wrong list of radian angles for an equation that splits into parts. */
function factoredReasons(v: string, parts: readonly Part[], wrong: readonly string[]): Reason[] {
  const fns = [...new Set(parts.map(([fn]) => fn))];
  return listReasons(
    wrong,
    v,
    360,
    partAngles(parts),
    (d) => {
      if (parts.some(([fn, val]) => near(valueAt(fn, d) ?? Number.NaN, amountOf(val)))) return undefined;
      const vals = fns.map((fn) => {
        const y = valueAt(fn, d);
        return y === undefined ? `\\${fn} ${v}` : `\\${fn} ${v} = ${exact(y)}`;
      });
      const undef = fns.some((fn) => valueAt(fn, d) === undefined);
      return t(
        `At $${v} = ${piTex(d)}$, ${undef ? `$${vals.join("$ and $")}$ is not defined` : `$${vals.join("$ and $")}$`}, so the equation fails there.`,
        `在 $${v} = ${piTex(d)}$ 处，${undef ? `$${vals.join("$、$")}$ 无定义` : `$${vals.join("$、$")}$`}，方程不成立。`,
      );
    },
    (d) => {
      const [fn, val] = parts.find(([f, w]) => near(valueAt(f, d) ?? Number.NaN, amountOf(w)))!;
      return t(`It comes from $\\${fn} ${v} = ${val}$.`, `它来自 $\\${fn} ${v} = ${val}$。`);
    },
  );
}

/** Family is one branch base + k·period of a general solution, in degrees. */
type Family = { readonly base: number; readonly period: number };

/** familiesOf reads general solutions such as \pm \frac{\pi}{3} + \frac{2k\pi}{3}, \; \frac{5\pi}{6} + 2k\pi. */
function familiesOf(tex: string): Family[] {
  return tex.split(", \\; ").flatMap((term) => {
    const m = /^(\\pm )?(.+?) \+ (?:(\d*)k\\pi|\\frac\{(\d*)k\\pi\}\{(\d+)\})$/.exec(term);
    if (!m) return [];
    const base = degreesOf(m[2]!);
    const period = m[5] ? (Number(m[4] || 1) * 180) / Number(m[5]) : Number(m[3] || 1) * 180;
    return m[1]
      ? [
          { base, period },
          { base: -base, period },
        ]
      : [{ base, period }];
  });
}

/** members lists the members of families for k from -n to n, with their k. */
const members = (fs: readonly Family[], n: number) =>
  fs.flatMap((f) => Array.from({ length: 2 * n + 1 }, (_, i) => ({ k: i - n, d: f.base + (i - n) * f.period })));

/** familyReasons explains each wrong general solution of f(B·x) = val: a member that fails, or members that are missing. */
function familyReasons(fn: Basic, B: number, v: string, val: string, right: string, wrong: readonly string[]): Reason[] {
  const w = amountOf(val);
  const inner = (d: number) => (B === 1 ? fnAt(fn, d, "rad") : `\\${fn}\\left(${B} \\cdot ${piTex(d)}\\right) = ${fnAt(fn, B * d, "rad")}`);
  const truth = members(familiesOf(right), 12)
    .map((m) => m.d)
    .filter((d) => d >= 0 && d < 360);
  return wrong.flatMap((tex): Reason[] => {
    const fs = familiesOf(tex);
    if (fs.length === 0) return [];
    const option = `$${v} = ${tex}$`;
    const order = members(fs, 2).sort((a, b) => Math.abs(a.k) - Math.abs(b.k) || b.k - a.k);
    const bad = order.find((m) => !near(valueAt(fn, B * m.d) ?? Number.NaN, w));
    if (bad) {
      const y = valueAt(fn, B * bad.d);
      const said =
        y === undefined
          ? t(`but tangent is not defined at $${piTex(B * bad.d)}$`, `但正切在 $${piTex(B * bad.d)}$ 处无定义`)
          : t(`but $${inner(bad.d)} = ${exact(y)}$, not $${val}$`, `但 $${inner(bad.d)} = ${exact(y)}$，不等于 $${val}$`);
      return [
        [
          option,
          `Taking $k = ${bad.k}$ gives $${v} = ${piTex(bad.d)}$, ${said.en}.`,
          `取 $k = ${bad.k}$ 得 $${v} = ${piTex(bad.d)}$，${said["zh-CN"]}。`,
        ],
      ];
    }
    const mine = members(fs, 24).map((m) => m.d);
    const miss = truth.find((d) => !mine.some((e) => near(((e % 360) + 360) % 360, d)));
    if (miss === undefined) return [];
    return [
      [
        option,
        `Every member of this family is a solution, but it never reaches $${v} = ${piTex(miss)}$, which is also one.`,
        `这族里的每个角都是解，但它永远取不到 $${v} = ${piTex(miss)}$，而这也是一个解。`,
      ],
    ];
  });
}

// ─── 4.13.1 Elementary sine equations ───────────────────────────────────────

/** elementaryTrigonometricEquationsContainingSine covers sin(x) = c. */
export const elementaryTrigonometricEquationsContainingSine: TopicDef = {
  id: "elementary-trigonometric-equations-containing-sine",
  title: t("Elementary Trigonometric Equations Containing Sine", "含正弦的基本三角方程"),
  summary: t(
    "Solve equations of the form sin(x) = c on intervals such as [0, 2π) or [0°, 360°) using reference angles and quadrants.",
    "利用参考角与象限知识在 [0, 2π) 或 [0°, 360°) 上求解形如 sin(x) = c 的方程。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Where is $\\sin x = \\frac{1}{2}$? On the unit circle sine is the height of the point, and the horizontal line at height $\\frac{1}{2}$ meets the circle twice: at $30^{\\circ}$ in Quadrant I, and at its mirror image $180^{\\circ} - 30^{\\circ} = 150^{\\circ}$ in Quadrant II.

Check: $\\sin 150^{\\circ} = \\sin 30^{\\circ} = \\frac{1}{2}$, and no other point of the circle has that height.

In this lesson we solve $\\sin x = c$ in one turn, in degrees and in radians, from a reference angle and the signs of sine in the four quadrants.`,
    `$\\sin x = \\frac{1}{2}$ 在哪里成立？在单位圆上，正弦是点的纵坐标，高度为 $\\frac{1}{2}$ 的水平线与单位圆交于两点：第一象限的 $30^{\\circ}$，以及与它对称的第二象限的 $180^{\\circ} - 30^{\\circ} = 150^{\\circ}$。

检验：$\\sin 150^{\\circ} = \\sin 30^{\\circ} = \\frac{1}{2}$，而圆上没有别的点有这个高度。

这节课我们在一圈内求解 $\\sin x = c$，分角度制和弧度制，方法是用参考角和正弦在四个象限的符号。`,
  ),
  knowledgePoints: [
    {
      id: "solve-elementary-sine-equations-degrees",
      figure: precalculusDrawings2["elementary-trigonometric-equations-containing-sine#solve-elementary-sine-equations-degrees"],
      title: t("Solve sin(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解正弦方程（角度制）"),
      explanation: t(
        "To solve $\\sin x^{\\circ} = c$ on $[0, 360)$:\n\n1. Find the reference angle $\\alpha = \\arcsin|c|$.\n2. Sine is positive in Quadrants I and II ($x = \\alpha, 180 - \\alpha$) and negative in Quadrants III and IV ($x = 180 + \\alpha, 360 - \\alpha$).\n\nFor example, $\\sin x^{\\circ} = \\frac{1}{2}$ has reference angle $30^{\\circ}$, giving solutions $x = 30, 150$.\n\nFor $\\sin x^{\\circ} = -\\frac{\\sqrt{2}}{2}$ the reference angle is $45^{\\circ}$ and sine is negative, so $x = 180 + 45 = 225$ and $x = 360 - 45 = 315$. Check: $\\sin 225^{\\circ} = \\sin 315^{\\circ} = -\\frac{\\sqrt{2}}{2}$.\n\n> **Watch out.** The reference angle comes from $|c|$, never from $c$ itself: $\\arcsin\\left(-\\frac{\\sqrt{2}}{2}\\right) = -45^{\\circ}$ is not in $[0, 360)$, and adding $180^{\\circ}$ to it gives $135^{\\circ}$, where sine is positive.",
        "在 $[0, 360)$ 上求解 $\\sin x^{\\circ} = c$：\n\n1. 求参考角 $\\alpha = \\arcsin|c|$。\n2. 正弦在第一、二象限为正（$x = \\alpha, 180 - \\alpha$），在第三、四象限为负（$x = 180 + \\alpha, 360 - \\alpha$）。\n\n例如，$\\sin x^{\\circ} = \\frac{1}{2}$ 的参考角为 $30^{\\circ}$，解为 $x = 30, 150$。\n\n对于 $\\sin x^{\\circ} = -\\frac{\\sqrt{2}}{2}$，参考角是 $45^{\\circ}$，而正弦为负，所以 $x = 180 + 45 = 225$，$x = 360 - 45 = 315$。检验：$\\sin 225^{\\circ} = \\sin 315^{\\circ} = -\\frac{\\sqrt{2}}{2}$。\n\n> **注意。** 参考角由 $|c|$ 求出，而不是由 $c$ 本身：$\\arcsin\\left(-\\frac{\\sqrt{2}}{2}\\right) = -45^{\\circ}$ 不在 $[0, 360)$ 内，给它加 $180^{\\circ}$ 得到的 $135^{\\circ}$ 处正弦却是正的。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            val: "0",
            ans: ["0", "180"],
            wrong: [
              ["0", "360"],
              ["90", "270"],
              ["0", "90"],
            ],
          },
          { val: "1", ans: ["90"], wrong: [["90", "270"], ["0", "180"], ["270"]] },
          { val: "-1", ans: ["270"], wrong: [["90"], ["180"], ["90", "270"]] },
          {
            val: "\\frac{1}{2}",
            ans: ["30", "150"],
            wrong: [
              ["60", "120"],
              ["30", "330"],
              ["30", "210"],
            ],
          },
          {
            val: "-\\frac{1}{2}",
            ans: ["210", "330"],
            wrong: [
              ["150", "210"],
              ["240", "300"],
              ["30", "330"],
            ],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "135"],
            wrong: [
              ["45", "315"],
              ["45", "225"],
              ["135", "225"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: ["225", "315"],
            wrong: [
              ["135", "315"],
              ["45", "225"],
              ["225", "270"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: ["60", "120"],
            wrong: [
              ["30", "150"],
              ["60", "300"],
              ["120", "240"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: ["240", "300"],
            wrong: [
              ["210", "330"],
              ["120", "240"],
              ["300", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\sin(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\sin(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: elementary({ fn: "sin", v, coeff, val: item.val, unit: "deg" }),
        });
      },
    },
    {
      id: "solve-elementary-sine-equations-radians",
      title: t("Solve sin(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解正弦方程（弧度制）"),
      explanation: t(
        "Sine is positive in the first two quadrants and negative in the last two, so most equations of this kind have two solutions in one full turn. For $\\sin x = c$ on $[0, 2\\pi)$:\n\n$$\\sin x = \\frac{\\sqrt{3}}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}$$\n\n$$\\sin x = -\\frac{1}{2} \\implies x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}$$\n\nWith a coefficient, divide first: $2\\sin x = 1$ gives $\\sin x = \\frac{1}{2}$, so $x = \\frac{\\pi}{6}$ and $x = \\pi - \\frac{\\pi}{6} = \\frac{5\\pi}{6}$. Check: $2\\sin\\frac{5\\pi}{6} = 2 \\cdot \\frac{1}{2} = 1$.\n\n> **Watch out.** The second solution of a sine equation is $\\pi - \\alpha$, not $2\\pi - \\alpha$: the angle $2\\pi - \\alpha$ mirrors $\\alpha$ across the horizontal axis, which keeps the cosine and flips the sign of the sine.",
        "正弦在第一、二象限为正，在第三、四象限为负，所以这类方程在一整圈内通常有两个解。在 $[0, 2\\pi)$ 上求解 $\\sin x = c$：\n\n$$\\sin x = \\frac{\\sqrt{3}}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}$$\n\n$$\\sin x = -\\frac{1}{2} \\implies x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}$$\n\n有系数时先除掉：$2\\sin x = 1$ 化为 $\\sin x = \\frac{1}{2}$，所以 $x = \\frac{\\pi}{6}$，$x = \\pi - \\frac{\\pi}{6} = \\frac{5\\pi}{6}$。检验：$2\\sin\\frac{5\\pi}{6} = 2 \\cdot \\frac{1}{2} = 1$。\n\n> **注意。** 正弦方程的第二个解是 $\\pi - \\alpha$，不是 $2\\pi - \\alpha$：$2\\pi - \\alpha$ 是 $\\alpha$ 关于横轴的对称角，它保持余弦不变，却使正弦变号。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0, \\pi", wrong: ["0, 2\\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\frac{\\pi}{2}"] },
          { val: "1", ans: "\\frac{\\pi}{2}", wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\pi", "\\pi"] },
          { val: "-1", ans: "\\frac{3\\pi}{2}", wrong: ["\\frac{\\pi}{2}", "\\pi", "-\\frac{\\pi}{2}"] },
          {
            val: "\\frac{1}{2}",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            val: "-\\frac{1}{2}",
            ans: "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{3\\pi}{2}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{3}, \\frac{11\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\sin ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\sin ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          elementary({ fn: "sin", v, coeff, val: item.val, unit: "rad" }),
          elementaryReasons("sin", v, item.val, item.wrong),
        );
      },
    },
  ],
};

// ─── 4.13.2 Elementary cosine equations ─────────────────────────────────────

/** elementaryTrigonometricEquationsContainingCosine covers cos(x) = c. */
export const elementaryTrigonometricEquationsContainingCosine: TopicDef = {
  id: "elementary-trigonometric-equations-containing-cosine",
  title: t("Elementary Trigonometric Equations Containing Cosine", "含余弦的基本三角方程"),
  summary: t(
    "Solve equations of the form cos(x) = c on intervals such as [0, 2π) or [0°, 360°).",
    "在 [0, 2π) 或 [0°, 360°) 上求解形如 cos(x) = c 的三角方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-sine"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Where is $\\cos x = \\frac{1}{2}$? Cosine is the first coordinate of the point on the unit circle, and the vertical line through $\\frac{1}{2}$ meets the circle twice: at $60^{\\circ}$ above the axis, and at its mirror image $360^{\\circ} - 60^{\\circ} = 300^{\\circ}$ below it.

Check: $\\cos 300^{\\circ} = \\cos(-60^{\\circ}) = \\cos 60^{\\circ} = \\frac{1}{2}$.

In this lesson we solve $\\cos x = c$ in one turn, in degrees and in radians, from a reference angle and the signs of cosine in the four quadrants.`,
    `$\\cos x = \\frac{1}{2}$ 在哪里成立？余弦是单位圆上点的横坐标，过 $\\frac{1}{2}$ 的竖直线与单位圆交于两点：轴上方的 $60^{\\circ}$，以及轴下方与它对称的 $360^{\\circ} - 60^{\\circ} = 300^{\\circ}$。

检验：$\\cos 300^{\\circ} = \\cos(-60^{\\circ}) = \\cos 60^{\\circ} = \\frac{1}{2}$。

这节课我们在一圈内求解 $\\cos x = c$，分角度制和弧度制，方法是用参考角和余弦在四个象限的符号。`,
  ),
  knowledgePoints: [
    {
      id: "solve-elementary-cosine-equations-degrees",
      title: t("Solve cos(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解余弦方程（角度制）"),
      explanation: t(
        "Cosine is positive in Quadrants I and IV ($x = \\alpha, 360 - \\alpha$) and negative in Quadrants II and III ($x = 180 - \\alpha, 180 + \\alpha$).\n\nFor example, $\\cos x^{\\circ} = \\frac{1}{2} \\implies x = 60, 300$.\n\nFor $2\\cos x^{\\circ} = -\\sqrt{3}$, divide by $2$: $\\cos x^{\\circ} = -\\frac{\\sqrt{3}}{2}$, with reference angle $30^{\\circ}$, so $x = 180 - 30 = 150$ and $x = 180 + 30 = 210$. Check: the two solutions add to $360$, as the two solutions of a cosine equation in one turn always do.\n\n> **Watch out.** Cosine pairs $\\alpha$ with $360 - \\alpha$, not with $180 - \\alpha$; sine is the one that pairs $\\alpha$ with $180 - \\alpha$.",
        "余弦在第一、四象限为正（$x = \\alpha, 360 - \\alpha$），在第二、三象限为负（$x = 180 - \\alpha, 180 + \\alpha$）。\n\n例如，$\\cos x^{\\circ} = \\frac{1}{2} \\implies x = 60, 300$。\n\n对于 $2\\cos x^{\\circ} = -\\sqrt{3}$，两边除以 $2$：$\\cos x^{\\circ} = -\\frac{\\sqrt{3}}{2}$，参考角是 $30^{\\circ}$，所以 $x = 180 - 30 = 150$，$x = 180 + 30 = 210$。检验：两个解之和是 $360$，一圈内余弦方程的两个解总是这样。\n\n> **注意。** 余弦把 $\\alpha$ 与 $360 - \\alpha$ 配对，而不是与 $180 - \\alpha$ 配对；把 $\\alpha$ 与 $180 - \\alpha$ 配对的是正弦。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            val: "0",
            ans: ["90", "270"],
            wrong: [
              ["0", "180"],
              ["90", "180"],
              ["0", "360"],
            ],
          },
          { val: "1", ans: ["0"], wrong: [["90"], ["180"], ["0", "180"]] },
          { val: "-1", ans: ["180"], wrong: [["0"], ["270"], ["90", "270"]] },
          {
            val: "\\frac{1}{2}",
            ans: ["60", "300"],
            wrong: [
              ["30", "330"],
              ["60", "120"],
              ["120", "240"],
            ],
          },
          {
            val: "-\\frac{1}{2}",
            ans: ["120", "240"],
            wrong: [
              ["60", "300"],
              ["150", "210"],
              ["120", "300"],
            ],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "315"],
            wrong: [
              ["45", "135"],
              ["135", "225"],
              ["45", "225"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: ["135", "225"],
            wrong: [
              ["45", "315"],
              ["135", "315"],
              ["225", "315"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: ["30", "330"],
            wrong: [
              ["60", "300"],
              ["30", "150"],
              ["150", "210"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: ["150", "210"],
            wrong: [
              ["120", "240"],
              ["30", "330"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\cos(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\cos(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: elementary({ fn: "cos", v, coeff, val: item.val, unit: "deg" }),
        });
      },
    },
    {
      id: "solve-elementary-cosine-equations-radians",
      title: t("Solve cos(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解余弦方程（弧度制）"),
      explanation: t(
        "Cosine is positive in the first and fourth quadrants and negative in the second and third, so each value strictly between $-1$ and $1$ gives two solutions in one turn. For $\\cos x = c$ on $[0, 2\\pi)$:\n\n$$\\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n$$\\cos x = -\\frac{\\sqrt{3}}{2} \\implies x = \\frac{5\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\nFor $\\cos x = -1$ there is only one solution, $x = \\pi$, the leftmost point of the unit circle. Check: $\\cos\\pi = -1$, and $-1$ is the least value cosine takes, so it is reached once per turn.\n\n> **Watch out.** For $\\cos x = 0$ the solutions are $\\frac{\\pi}{2}$ and $\\frac{3\\pi}{2}$, at the top and bottom of the circle; $0$ and $\\pi$ are where sine is zero.",
        "余弦在第一、四象限为正，在第二、三象限为负，所以介于 −1 和 1 之间的每个值在一周内都有两个解。在 $[0, 2\\pi)$ 上求解 $\\cos x = c$：\n\n$$\\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n$$\\cos x = -\\frac{\\sqrt{3}}{2} \\implies x = \\frac{5\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\n$\\cos x = -1$ 只有一个解 $x = \\pi$，即单位圆最左边的点。检验：$\\cos\\pi = -1$，而 $-1$ 是余弦的最小值，每圈只取到一次。\n\n> **注意。** $\\cos x = 0$ 的解是 $\\frac{\\pi}{2}$ 和 $\\frac{3\\pi}{2}$，对应圆的最高点和最低点；$0$ 和 $\\pi$ 是正弦为零的地方。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", wrong: ["0, \\pi", "\\pi, 2\\pi", "0, \\frac{\\pi}{2}"] },
          { val: "1", ans: "0", wrong: ["\\pi", "\\frac{\\pi}{2}", "0, \\pi"] },
          { val: "-1", ans: "\\pi", wrong: ["0", "\\frac{3\\pi}{2}", "2\\pi"] },
          {
            val: "\\frac{1}{2}",
            ans: "\\frac{\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            val: "-\\frac{1}{2}",
            ans: "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\cos ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\cos ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          elementary({ fn: "cos", v, coeff, val: item.val, unit: "rad" }),
          elementaryReasons("cos", v, item.val, item.wrong),
        );
      },
    },
  ],
};

// ─── 4.13.3 Elementary tangent equations ────────────────────────────────────

/** elementaryTrigonometricEquationsContainingTangent covers tan(x) = c. */
export const elementaryTrigonometricEquationsContainingTangent: TopicDef = {
  id: "elementary-trigonometric-equations-containing-tangent",
  title: t("Elementary Trigonometric Equations Containing Tangent", "含正切的基本三角方程"),
  summary: t(
    "Solve equations of the form tan(x) = c on [0, 2π) or [0°, 360°) using the period π and quadrants.",
    "利用周期 π 与象限知识在 [0, 2π) 或 [0°, 360°) 上求解形如 tan(x) = c 的方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-sine"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\tan x = 1$. Tangent is sine over cosine, so we need sine and cosine to be equal. That happens at $45^{\\circ}$, where both are $\\frac{\\sqrt{2}}{2}$, and half a turn later at $225^{\\circ}$, where both are $-\\frac{\\sqrt{2}}{2}$.

Check: at $225^{\\circ}$ the ratio of two equal negative numbers is $1$, and $225 - 45 = 180$, the period of tangent.

In this lesson we solve $\\tan x = c$ in one turn: one reference solution, and one more half a turn away.`,
    `解 $\\tan x = 1$。正切是正弦除以余弦，所以要求正弦与余弦相等。这发生在 $45^{\\circ}$ 处，两者都是 $\\frac{\\sqrt{2}}{2}$；半圈之后的 $225^{\\circ}$ 处，两者都是 $-\\frac{\\sqrt{2}}{2}$。

检验：在 $225^{\\circ}$ 处，两个相等的负数之比是 $1$，而 $225 - 45 = 180$，正是正切的周期。

这节课我们在一圈内求解 $\\tan x = c$：先求一个基准解，再在半圈之外得到另一个解。`,
  ),
  knowledgePoints: [
    {
      id: "solve-elementary-tangent-equations-degrees",
      title: t("Solve tan(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解正切方程（角度制）"),
      explanation: t(
        "Tangent has period $180^{\\circ}$. It is positive in Quadrants I and III ($x = \\alpha, 180 + \\alpha$) and negative in Quadrants II and IV ($x = 180 - \\alpha, 360 - \\alpha$).\n\nFor example, $\\tan x^{\\circ} = 1 \\implies x = 45, 225$.\n\nFor $3\\tan x^{\\circ} = -\\sqrt{3}$, divide by $3$: $\\tan x^{\\circ} = -\\frac{\\sqrt{3}}{3}$, with reference angle $30^{\\circ}$; tangent is negative in Quadrants II and IV, so $x = 150$ and $x = 330$. Check: $330 - 150 = 180$, one period of tangent.\n\n> **Watch out.** The two solutions of a tangent equation are always $180^{\\circ}$ apart. A pair such as $30, 150$ follows the pattern of sine and is wrong for tangent.",
        "正切函数的周期为 $180^{\\circ}$。在第一、三象限为正（$x = \\alpha, 180 + \\alpha$），在第二、四象限为负（$x = 180 - \\alpha, 360 - \\alpha$）。\n\n例如，$\\tan x^{\\circ} = 1 \\implies x = 45, 225$。\n\n对于 $3\\tan x^{\\circ} = -\\sqrt{3}$，两边除以 $3$：$\\tan x^{\\circ} = -\\frac{\\sqrt{3}}{3}$，参考角是 $30^{\\circ}$；正切在第二、四象限为负，所以 $x = 150$，$x = 330$。检验：$330 - 150 = 180$，正好是正切的一个周期。\n\n> **注意。** 正切方程的两个解总是相差 $180^{\\circ}$。像 $30, 150$ 这样的一对是正弦的规律，用在正切上就错了。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: ["0", "180"], wrong: [["90", "270"], ["0", "360"], ["180"]] },
          {
            val: "1",
            ans: ["45", "225"],
            wrong: [
              ["45", "135"],
              ["135", "315"],
              ["45", "315"],
            ],
          },
          {
            val: "-1",
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["135", "225"],
              ["225", "315"],
            ],
          },
          {
            val: "\\sqrt{3}",
            ans: ["60", "240"],
            wrong: [
              ["30", "210"],
              ["60", "120"],
              ["120", "300"],
            ],
          },
          {
            val: "-\\sqrt{3}",
            ans: ["120", "300"],
            wrong: [
              ["60", "240"],
              ["150", "330"],
              ["240", "300"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: ["30", "210"],
            wrong: [
              ["60", "240"],
              ["30", "150"],
              ["150", "330"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: ["150", "330"],
            wrong: [
              ["30", "210"],
              ["120", "300"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\tan(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\tan(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: elementary({ fn: "tan", v, coeff, val: item.val, unit: "deg" }),
        });
      },
    },
    {
      id: "solve-elementary-tangent-equations-radians",
      title: t("Solve tan(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解正切方程（弧度制）"),
      explanation: t(
        "Tangent has period $\\pi$, so first find the reference solution in $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$, then add $\\pi$ to get the second solution in the interval. For $\\tan x = c$ on $[0, 2\\pi)$:\n\n$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$\n\n$$\\tan x = -1 \\implies x = \\frac{3\\pi}{4}, \\; \\frac{7\\pi}{4}$$\n\nFor $\\tan x = \\frac{\\sqrt{3}}{3}$ the reference solution is $\\frac{\\pi}{6}$, and adding $\\pi$ gives $\\frac{7\\pi}{6}$. Check: at $\\frac{7\\pi}{6}$ sine and cosine are $-\\frac{1}{2}$ and $-\\frac{\\sqrt{3}}{2}$, and their ratio is $\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$.\n\n> **Watch out.** Adding $\\pi$ once gives the second solution; adding it again gives $\\frac{13\\pi}{6}$, which is past $2\\pi$ and outside the interval.",
        "正切函数的周期是 $\\pi$，所以先在 $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$ 内找到基准解，再加上 $\\pi$ 得到区间内的第二个解。在 $[0, 2\\pi)$ 上求解 $\\tan x = c$：\n\n$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$\n\n$$\\tan x = -1 \\implies x = \\frac{3\\pi}{4}, \\; \\frac{7\\pi}{4}$$\n\n对于 $\\tan x = \\frac{\\sqrt{3}}{3}$，基准解是 $\\frac{\\pi}{6}$，加上 $\\pi$ 得 $\\frac{7\\pi}{6}$。检验：在 $\\frac{7\\pi}{6}$ 处，正弦和余弦分别是 $-\\frac{1}{2}$ 和 $-\\frac{\\sqrt{3}}{2}$，比值是 $\\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$。\n\n> **注意。** 加一次 $\\pi$ 得到第二个解；再加一次得到 $\\frac{13\\pi}{6}$，它超过了 $2\\pi$，不在区间内。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0, \\pi", wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, 2\\pi", "\\pi"] },
          {
            val: "1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "-1",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\sqrt{3}",
            ans: "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "-\\sqrt{3}",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\tan ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\tan ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          elementary({ fn: "tan", v, coeff, val: item.val, unit: "rad" }),
          elementaryReasons("tan", v, item.val, item.wrong),
        );
      },
    },
  ],
};

// ─── 4.13.4 Elementary secant equations ─────────────────────────────────────

/** elementaryTrigonometricEquationsContainingSecant covers sec(x) = c. */
export const elementaryTrigonometricEquationsContainingSecant: TopicDef = {
  id: "elementary-trigonometric-equations-containing-secant",
  title: t("Elementary Trigonometric Equations Containing Secant", "含正割的基本三角方程"),
  summary: t(
    "Solve sec(x) = c by converting to cos(x) = 1/c and identifying domain restrictions.",
    "通过将 sec(x) = c 转化为 cos(x) = 1/c 并结合定义域求解三角方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-cosine"],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-cosine", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\sec x = 2$. Secant is one over cosine, so the equation says $\\cos x = \\frac{1}{2}$, which holds at $x = \\frac{\\pi}{3}$ and $x = \\frac{5\\pi}{3}$. But $\\sec x = \\frac{1}{2}$ would need $\\cos x = 2$, which never happens.

Check: $\\cos\\frac{5\\pi}{3} = \\frac{1}{2}$, so $\\sec\\frac{5\\pi}{3} = 2$.

In this lesson we solve secant equations by turning them into cosine equations, and recognise the ones with no solution.`,
    `解 $\\sec x = 2$。正割是余弦的倒数，所以方程就是 $\\cos x = \\frac{1}{2}$，它在 $x = \\frac{\\pi}{3}$ 和 $x = \\frac{5\\pi}{3}$ 处成立。而 $\\sec x = \\frac{1}{2}$ 要求 $\\cos x = 2$，这不可能发生。

检验：$\\cos\\frac{5\\pi}{3} = \\frac{1}{2}$，所以 $\\sec\\frac{5\\pi}{3} = 2$。

这节课我们把正割方程化成余弦方程来求解，并认出那些无解的方程。`,
  ),
  knowledgePoints: [
    {
      id: "solve-elementary-secant-equations",
      title: t("Solve sec(x) = c on [0, 2π)", "在 [0, 2π) 上求解正割方程"),
      explanation: t(
        "Secant is the reciprocal of cosine, so rewrite the equation as a cosine equation, which has no solution when the reciprocal lies outside the range of cosine. Convert using $\\cos x = \\frac{1}{\\sec x}$:\n\n$$\\sec x = 2 \\iff \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\nIf $|c| < 1$, $\\sec x = c$ has no real solution because $|\\sec x| \\ge 1$.\n\nFor $\\sec x = -\\sqrt{2}$: $\\cos x = -\\frac{1}{\\sqrt{2}} = -\\frac{\\sqrt{2}}{2}$, so $x = \\frac{3\\pi}{4}, \\frac{5\\pi}{4}$. Check: $\\cos\\frac{3\\pi}{4} = -\\frac{\\sqrt{2}}{2}$, whose reciprocal is $-\\sqrt{2}$.\n\n> **Watch out.** The reciprocal changes the size, not the sign: $\\sec x = -2$ becomes $\\cos x = -\\frac{1}{2}$, not $\\cos x = \\frac{1}{2}$ or $\\cos x = -2$.",
        "正割是余弦的倒数，所以把方程改写成余弦方程；如果倒数超出余弦的值域，方程就没有解。利用 $\\cos x = \\frac{1}{\\sec x}$ 进行转化：\n\n$$\\sec x = 2 \\iff \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n若 $|c| < 1$，由于 $|\\sec x| \\ge 1$，方程 $\\sec x = c$ 无实数解。\n\n对于 $\\sec x = -\\sqrt{2}$：$\\cos x = -\\frac{1}{\\sqrt{2}} = -\\frac{\\sqrt{2}}{2}$，所以 $x = \\frac{3\\pi}{4}, \\frac{5\\pi}{4}$。检验：$\\cos\\frac{3\\pi}{4} = -\\frac{\\sqrt{2}}{2}$，它的倒数是 $-\\sqrt{2}$。\n\n> **注意。** 取倒数改变的是大小，不是符号：$\\sec x = -2$ 化为 $\\cos x = -\\frac{1}{2}$，而不是 $\\cos x = \\frac{1}{2}$ 或 $\\cos x = -2$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", ans: "0", wrong: ["\\pi", "\\frac{\\pi}{2}", "0, \\pi"] },
          { val: "-1", ans: "\\pi", wrong: ["0", "\\frac{3\\pi}{2}", "2\\pi"] },
          {
            val: "2",
            ans: "\\frac{\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            val: "-2",
            ans: "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\sqrt{2}",
            ans: "\\frac{\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\sqrt{2}",
            ans: "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          { val: "\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "0", "\\frac{\\pi}{6}"] },
          { val: "-\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\pi", "\\frac{5\\pi}{6}"] },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const isNoSol = item.ans === "\\text{No solution}";
        return oneOf(
          rng,
          t(`Solve $\\sec ${v} = ${item.val}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $\\sec ${v} = ${item.val}$。`),
          isNoSol ? t("No real solution", "无实数解") : t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          isNoSol
            ? [
                t(`$${v} = \\frac{\\pi}{3}$`, `$${v} = \\frac{\\pi}{3}$`),
                t(`$${v} = 0$`, `$${v} = 0$`),
                t(`$${v} = \\pi$`, `$${v} = \\pi$`),
              ]
            : item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          elementary({ fn: "sec", v, coeff: 1, val: item.val, unit: "rad" }),
          elementaryReasons("sec", v, item.val, isNoSol ? ["\\frac{\\pi}{3}", "0", "\\pi"] : item.wrong),
        );
      },
    },
    {
      id: "solve-elementary-secant-equations-degrees",
      figure: precalculusDrawings4["elementary-trigonometric-equations-containing-secant#solve-elementary-secant-equations-degrees"],
      title: t("Solve sec(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 上求解正割方程（角度制）"),
      explanation: t(
        "Take the reciprocal to get an equation in cosine, then use the reference angle and the signs of cosine in each quadrant to list the degree solutions. Use $\\cos(x^{\\circ}) = \\frac{1}{\\sec(x^{\\circ})}$:\n\n$$\\sec(x^{\\circ}) = 2 \\iff \\cos(x^{\\circ}) = \\frac{1}{2} \\implies x = 60, 300$$\n\nFor $3\\sec(x^{\\circ}) = 6$, divide by $3$ first: $\\sec(x^{\\circ}) = 2$, so $\\cos(x^{\\circ}) = \\frac{1}{2}$ and $x = 60, 300$. Check: $3\\sec(60^{\\circ}) = 3 \\cdot 2 = 6$.\n\n> **Watch out.** $\\sec x$ means $\\frac{1}{\\cos x}$, not the inverse cosine: $\\sec(x^{\\circ}) = 2$ asks for the angles whose cosine is $\\frac{1}{2}$, not for $\\arccos 2$, which does not exist.",
        "取倒数得到余弦方程，再用参考角和余弦在各象限的符号写出所有度数解。利用 $\\cos(x^{\\circ}) = \\frac{1}{\\sec(x^{\\circ})}$：\n\n$$\\sec(x^{\\circ}) = 2 \\iff \\cos(x^{\\circ}) = \\frac{1}{2} \\implies x = 60, 300$$\n\n对于 $3\\sec(x^{\\circ}) = 6$，先两边除以 $3$：$\\sec(x^{\\circ}) = 2$，所以 $\\cos(x^{\\circ}) = \\frac{1}{2}$，$x = 60, 300$。检验：$3\\sec(60^{\\circ}) = 3 \\cdot 2 = 6$。\n\n> **注意。** $\\sec x$ 表示 $\\frac{1}{\\cos x}$，不是反余弦：$\\sec(x^{\\circ}) = 2$ 求的是余弦为 $\\frac{1}{2}$ 的角，而不是并不存在的 $\\arccos 2$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", inv: "1", ans: ["0"], wrong: [["90"], ["180"], ["0", "180"]] },
          { val: "-1", inv: "-1", ans: ["180"], wrong: [["0"], ["270"], ["90", "270"]] },
          {
            val: "2",
            inv: "\\frac{1}{2}",
            ans: ["60", "300"],
            wrong: [
              ["30", "330"],
              ["60", "120"],
              ["120", "240"],
            ],
          },
          {
            val: "-2",
            inv: "-\\frac{1}{2}",
            ans: ["120", "240"],
            wrong: [
              ["60", "300"],
              ["150", "210"],
              ["120", "300"],
            ],
          },
          {
            val: "\\sqrt{2}",
            inv: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "315"],
            wrong: [
              ["45", "135"],
              ["135", "225"],
              ["45", "225"],
            ],
          },
          {
            val: "-\\sqrt{2}",
            inv: "-\\frac{\\sqrt{2}}{2}",
            ans: ["135", "225"],
            wrong: [
              ["45", "315"],
              ["135", "315"],
              ["225", "315"],
            ],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            inv: "\\frac{\\sqrt{3}}{2}",
            ans: ["30", "330"],
            wrong: [
              ["60", "300"],
              ["30", "150"],
              ["150", "210"],
            ],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            inv: "-\\frac{\\sqrt{3}}{2}",
            ans: ["150", "210"],
            wrong: [
              ["120", "240"],
              ["30", "330"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\sec(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\sec(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: elementary({ fn: "sec", v, coeff, val: item.val, unit: "deg" }),
        });
      },
    },
  ],
};

// ─── 4.13.5 Elementary cosecant equations ───────────────────────────────────

/** elementaryTrigonometricEquationsContainingCosecant covers csc(x) = c. */
export const elementaryTrigonometricEquationsContainingCosecant: TopicDef = {
  id: "elementary-trigonometric-equations-containing-cosecant",
  title: t("Elementary Trigonometric Equations Containing Cosecant", "含余割的基本三角方程"),
  summary: t("Solve csc(x) = c by converting to sin(x) = 1/c.", "通过将 csc(x) = c 转化为 sin(x) = 1/c 求解三角方程。"),
  prerequisites: ["elementary-trigonometric-equations-containing-sine"],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-sine", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\csc x = -2$. Cosecant is one over sine, so this says $\\sin x = -\\frac{1}{2}$, which holds at $x = \\frac{7\\pi}{6}$ and $x = \\frac{11\\pi}{6}$.

Check: $\\sin\\frac{7\\pi}{6} = -\\frac{1}{2}$, and one over $-\\frac{1}{2}$ is $-2$.

In this lesson we solve cosecant equations through sine, in radians and in degrees, and spot values such as $\\csc x = \\frac{1}{2}$ that cosecant never takes.`,
    `解 $\\csc x = -2$。余割是正弦的倒数，所以方程就是 $\\sin x = -\\frac{1}{2}$，它在 $x = \\frac{7\\pi}{6}$ 和 $x = \\frac{11\\pi}{6}$ 处成立。

检验：$\\sin\\frac{7\\pi}{6} = -\\frac{1}{2}$，而 $-\\frac{1}{2}$ 的倒数是 $-2$。

这节课我们借助正弦求解余割方程，分弧度制和角度制，并认出像 $\\csc x = \\frac{1}{2}$ 这样余割永远取不到的值。`,
  ),
  knowledgePoints: [
    {
      id: "solve-elementary-cosecant-equations",
      title: t("Solve csc(x) = c on [0, 2π)", "在 [0, 2π) 上求解余割方程"),
      explanation: t(
        "Cosecant is the reciprocal of sine, so rewrite the equation as a sine equation, which has no solution when the reciprocal lies outside the range of sine. Convert using $\\sin x = \\frac{1}{\\csc x}$:\n\n$$\\csc x = 2 \\iff \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$\n\nFor $\\csc x = -\\sqrt{2}$: $\\sin x = -\\frac{\\sqrt{2}}{2}$, so $x = \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$. Check: $\\sin\\frac{7\\pi}{4} = -\\frac{\\sqrt{2}}{2}$, whose reciprocal is $-\\sqrt{2}$.\n\n> **Watch out.** Cosecant is the reciprocal of sine, not of cosine: $\\csc x = 2$ gives $\\frac{\\pi}{6}, \\frac{5\\pi}{6}$, while $\\frac{\\pi}{3}, \\frac{5\\pi}{3}$ solve $\\sec x = 2$.",
        "余割是正弦的倒数，所以把方程改写成正弦方程；如果倒数超出正弦的值域，方程就没有解。利用 $\\sin x = \\frac{1}{\\csc x}$ 进行转化：\n\n$$\\csc x = 2 \\iff \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$\n\n对于 $\\csc x = -\\sqrt{2}$：$\\sin x = -\\frac{\\sqrt{2}}{2}$，所以 $x = \\frac{5\\pi}{4}, \\frac{7\\pi}{4}$。检验：$\\sin\\frac{7\\pi}{4} = -\\frac{\\sqrt{2}}{2}$，它的倒数是 $-\\sqrt{2}$。\n\n> **注意。** 余割是正弦的倒数，不是余弦的倒数：$\\csc x = 2$ 的解是 $\\frac{\\pi}{6}, \\frac{5\\pi}{6}$，而 $\\frac{\\pi}{3}, \\frac{5\\pi}{3}$ 是 $\\sec x = 2$ 的解。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", ans: "\\frac{\\pi}{2}", wrong: ["\\pi", "0", "\\frac{3\\pi}{2}"] },
          { val: "-1", ans: "\\frac{3\\pi}{2}", wrong: ["\\frac{\\pi}{2}", "\\pi", "2\\pi"] },
          {
            val: "2",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "-2",
            ans: "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\sqrt{2}",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\sqrt{2}",
            ans: "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          { val: "\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{2}", "0"] },
          { val: "-\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{3\\pi}{2}", "\\pi"] },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const isNoSol = item.ans === "\\text{No solution}";
        return oneOf(
          rng,
          t(`Solve $\\csc ${v} = ${item.val}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $\\csc ${v} = ${item.val}$。`),
          isNoSol ? t("No real solution", "无实数解") : t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          isNoSol
            ? [
                t(`$${v} = \\frac{\\pi}{6}$`, `$${v} = \\frac{\\pi}{6}$`),
                t(`$${v} = \\frac{\\pi}{2}$`, `$${v} = \\frac{\\pi}{2}$`),
                t(`$${v} = \\pi$`, `$${v} = \\pi$`),
              ]
            : item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          elementary({ fn: "csc", v, coeff: 1, val: item.val, unit: "rad" }),
          elementaryReasons("csc", v, item.val, isNoSol ? ["\\frac{\\pi}{6}", "\\frac{\\pi}{2}", "\\pi"] : item.wrong),
        );
      },
    },
    {
      id: "solve-elementary-cosecant-equations-degrees",
      title: t("Solve csc(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 上求解余割方程（角度制）"),
      figure: remainingDrawings5["elementary-trigonometric-equations-containing-cosecant#solve-elementary-cosecant-equations-degrees"],
      explanation: t(
        "Take the reciprocal to get an equation in sine, then use the reference angle and the signs of sine in each quadrant to list the degree solutions. Use $\\sin(x^{\\circ}) = \\frac{1}{\\csc(x^{\\circ})}$:\n\n$$\\csc(x^{\\circ}) = 2 \\iff \\sin(x^{\\circ}) = \\frac{1}{2} \\implies x = 30, 150$$\n\nFor $2\\csc(x^{\\circ}) = -4$, divide by $2$: $\\csc(x^{\\circ}) = -2$, so $\\sin(x^{\\circ}) = -\\frac{1}{2}$ and $x = 210, 330$. Check: $\\sin(210^{\\circ}) = -\\frac{1}{2}$, so $2\\csc(210^{\\circ}) = 2 \\cdot (-2) = -4$.\n\n> **Watch out.** Cosecant is not defined where sine is zero, so $0$ and $180$ are never solutions of a cosecant equation, and $\\csc(x^{\\circ}) = 1$ or $-1$ has just one solution, $90$ or $270$.",
        "取倒数得到正弦方程，再用参考角和正弦在各象限的符号写出所有度数解。利用 $\\sin(x^{\\circ}) = \\frac{1}{\\csc(x^{\\circ})}$：\n\n$$\\csc(x^{\\circ}) = 2 \\iff \\sin(x^{\\circ}) = \\frac{1}{2} \\implies x = 30, 150$$\n\n对于 $2\\csc(x^{\\circ}) = -4$，两边除以 $2$：$\\csc(x^{\\circ}) = -2$，所以 $\\sin(x^{\\circ}) = -\\frac{1}{2}$，$x = 210, 330$。检验：$\\sin(210^{\\circ}) = -\\frac{1}{2}$，所以 $2\\csc(210^{\\circ}) = 2 \\cdot (-2) = -4$。\n\n> **注意。** 正弦为零的地方余割无定义，所以 $0$ 和 $180$ 永远不是余割方程的解；而 $\\csc(x^{\\circ}) = 1$ 或 $-1$ 各只有一个解，$90$ 或 $270$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", inv: "1", ans: ["90"], wrong: [["90", "270"], ["0", "180"], ["270"]] },
          { val: "-1", inv: "-1", ans: ["270"], wrong: [["90"], ["180"], ["90", "270"]] },
          {
            val: "2",
            inv: "\\frac{1}{2}",
            ans: ["30", "150"],
            wrong: [
              ["60", "120"],
              ["30", "330"],
              ["30", "210"],
            ],
          },
          {
            val: "-2",
            inv: "-\\frac{1}{2}",
            ans: ["210", "330"],
            wrong: [
              ["150", "210"],
              ["240", "300"],
              ["30", "330"],
            ],
          },
          {
            val: "\\sqrt{2}",
            inv: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "135"],
            wrong: [
              ["45", "315"],
              ["45", "225"],
              ["135", "225"],
            ],
          },
          {
            val: "-\\sqrt{2}",
            inv: "-\\frac{\\sqrt{2}}{2}",
            ans: ["225", "315"],
            wrong: [
              ["135", "315"],
              ["45", "225"],
              ["225", "270"],
            ],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            inv: "\\frac{\\sqrt{3}}{2}",
            ans: ["60", "120"],
            wrong: [
              ["30", "150"],
              ["60", "300"],
              ["120", "240"],
            ],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            inv: "-\\frac{\\sqrt{3}}{2}",
            ans: ["240", "300"],
            wrong: [
              ["210", "330"],
              ["120", "240"],
              ["300", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\csc(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\csc(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: elementary({ fn: "csc", v, coeff, val: item.val, unit: "deg" }),
        });
      },
    },
  ],
};

// ─── 4.13.6 Elementary cotangent equations ──────────────────────────────────

/** elementaryTrigonometricEquationsContainingCotangent covers cot(x) = c. */
export const elementaryTrigonometricEquationsContainingCotangent: TopicDef = {
  id: "elementary-trigonometric-equations-containing-cotangent",
  title: t("Elementary Trigonometric Equations Containing Cotangent", "含余切的基本三角方程"),
  summary: t(
    "Solve cot(x) = c on [0, 2π) by converting to tan(x) = 1/c or finding points where cos(x)/sin(x) = c.",
    "通过转化为 tan(x) = 1/c 或利用 cos(x)/sin(x) = c 在 [0, 2π) 上求解余切方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-tangent"],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-tangent", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\cot x = \\sqrt{3}$. Cotangent is one over tangent, so $\\tan x = \\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$, which holds at $\\frac{\\pi}{6}$ and half a turn later at $\\frac{7\\pi}{6}$.

Check: at $\\frac{\\pi}{6}$, cosine over sine is $\\frac{\\sqrt{3}}{2} \\div \\frac{1}{2} = \\sqrt{3}$.

In this lesson we solve cotangent equations through tangent, and solve $\\cot x = 0$ through cosine instead.`,
    `解 $\\cot x = \\sqrt{3}$。余切是正切的倒数，所以 $\\tan x = \\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$，它在 $\\frac{\\pi}{6}$ 处成立，半圈之后的 $\\frac{7\\pi}{6}$ 处也成立。

检验：在 $\\frac{\\pi}{6}$ 处，余弦除以正弦是 $\\frac{\\sqrt{3}}{2} \\div \\frac{1}{2} = \\sqrt{3}$。

这节课我们借助正切求解余切方程，而 $\\cot x = 0$ 则借助余弦求解。`,
  ),
  knowledgePoints: [
    {
      id: "solve-elementary-cotangent-equations",
      title: t("Solve cot(x) = c on [0, 2π)", "在 [0, 2π) 上求解余切方程"),
      explanation: t(
        "Cotangent is the reciprocal of tangent, so rewrite the equation in tangent; a cotangent of zero instead means that cosine is zero. Using $\\tan x = \\frac{1}{\\cot x}$:\n\n$$\\cot x = \\sqrt{3} \\iff \\tan x = \\frac{1}{\\sqrt{3}} \\implies x = \\frac{\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\nIf $\\cot x = 0$, $\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}$.\n\nFor $\\cot x = -1$: $\\tan x = -1$, so $x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$. Check: at $\\frac{3\\pi}{4}$, $\\cos x = -\\frac{\\sqrt{2}}{2}$ and $\\sin x = \\frac{\\sqrt{2}}{2}$, and their ratio is $-1$.\n\n> **Watch out.** $\\cot x = 0$ cannot be turned into a tangent equation, since one over zero has no value. Use cotangent as cosine over sine instead: it is zero where $\\cos x = 0$.",
        "余切是正切的倒数，所以把方程改写成正切方程；余切为零则意味着余弦为零。利用 $\\tan x = \\frac{1}{\\cot x}$：\n\n$$\\cot x = \\sqrt{3} \\iff \\tan x = \\frac{1}{\\sqrt{3}} \\implies x = \\frac{\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\n若 $\\cot x = 0$，则 $\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}$。\n\n对于 $\\cot x = -1$：$\\tan x = -1$，所以 $x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$。检验：在 $\\frac{3\\pi}{4}$ 处，$\\cos x = -\\frac{\\sqrt{2}}{2}$，$\\sin x = \\frac{\\sqrt{2}}{2}$，两者之比是 $-1$。\n\n> **注意。** $\\cot x = 0$ 不能化成正切方程，因为零的倒数无意义。应把余切看成余弦除以正弦：它在 $\\cos x = 0$ 处为零。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", wrong: ["0, \\pi", "\\pi, 2\\pi", "0, \\frac{\\pi}{2}"] },
          {
            val: "1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "-1",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\sqrt{3}",
            ans: "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "-\\sqrt{3}",
            ans: "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\cot ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\cot ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          elementary({ fn: "cot", v, coeff, val: item.val, unit: "rad" }),
          elementaryReasons("cot", v, item.val, item.wrong),
        );
      },
    },
    {
      id: "solve-elementary-cotangent-equations-degrees",
      title: t("Solve cot(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 上求解余切方程（角度制）"),
      explanation: t(
        "Rewrite the equation as a tangent equation and remember that tangent repeats every $180^{\\circ}$, giving two solutions in a full turn. Use $\\tan(x^{\\circ}) = \\frac{1}{\\cot(x^{\\circ})}$:\n\n$$\\cot(x^{\\circ}) = \\sqrt{3} \\iff \\tan(x^{\\circ}) = \\frac{\\sqrt{3}}{3} \\implies x = 30, 210$$\n\nFor $3\\cot(x^{\\circ}) = 3$: $\\cot(x^{\\circ}) = 1$, so $\\tan(x^{\\circ}) = 1$ and $x = 45, 225$. Check: $225 - 45 = 180$, one period of cotangent.\n\n> **Watch out.** $\\cot(x^{\\circ}) = \\sqrt{3}$ gives $\\tan(x^{\\circ}) = \\frac{\\sqrt{3}}{3}$ and $x = 30, 210$, not $60, 240$: the reciprocal changes the reference angle from $60^{\\circ}$ to $30^{\\circ}$.",
        "把方程改写成正切方程，并记住正切每 180° 重复一次，所以一整周内有两个解。利用 $\\tan(x^{\\circ}) = \\frac{1}{\\cot(x^{\\circ})}$：\n\n$$\\cot(x^{\\circ}) = \\sqrt{3} \\iff \\tan(x^{\\circ}) = \\frac{\\sqrt{3}}{3} \\implies x = 30, 210$$\n\n对于 $3\\cot(x^{\\circ}) = 3$：$\\cot(x^{\\circ}) = 1$，所以 $\\tan(x^{\\circ}) = 1$，$x = 45, 225$。检验：$225 - 45 = 180$，正好是余切的一个周期。\n\n> **注意。** $\\cot(x^{\\circ}) = \\sqrt{3}$ 化为 $\\tan(x^{\\circ}) = \\frac{\\sqrt{3}}{3}$，解是 $x = 30, 210$，不是 $60, 240$：取倒数把参考角从 $60^{\\circ}$ 变成了 $30^{\\circ}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            val: "0",
            ans: ["90", "270"],
            wrong: [
              ["0", "180"],
              ["90", "180"],
              ["0", "360"],
            ],
          },
          {
            val: "1",
            ans: ["45", "225"],
            wrong: [
              ["45", "135"],
              ["135", "315"],
              ["45", "315"],
            ],
          },
          {
            val: "-1",
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["135", "225"],
              ["225", "315"],
            ],
          },
          {
            val: "\\sqrt{3}",
            ans: ["30", "210"],
            wrong: [
              ["60", "240"],
              ["30", "150"],
              ["150", "330"],
            ],
          },
          {
            val: "-\\sqrt{3}",
            ans: ["150", "330"],
            wrong: [
              ["30", "210"],
              ["120", "300"],
              ["210", "330"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: ["60", "240"],
            wrong: [
              ["30", "210"],
              ["60", "120"],
              ["120", "300"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: ["120", "300"],
            wrong: [
              ["60", "240"],
              ["150", "330"],
              ["240", "300"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = scaled(item.val, coeff);
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\cot(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\cot(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: elementary({ fn: "cot", v, coeff, val: item.val, unit: "deg" }),
        });
      },
    },
  ],
};

// ─── 4.13.7 General solutions of elementary equations ────────────────────────

/** generalSolutionsOfElementaryTrigonometricEquations expresses infinite solution families. */
export const generalSolutionsOfElementaryTrigonometricEquations: TopicDef = {
  id: "general-solutions-of-elementary-trigonometric-equations",
  title: t("General Solutions of Elementary Trigonometric Equations", "基本三角方程的通解"),
  summary: t(
    "Write general solutions over the real numbers by adding 2kπ for sine/cosine or kπ for tangent/cotangent, where k ∈ ℤ.",
    "通过为正弦/余弦加上 2kπ、为正切/余切加上 kπ（k ∈ ℤ）表示实数范围内的通解。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-cosine", "elementary-trigonometric-equations-containing-tangent"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `In one turn, $\\sin x = \\frac{1}{2}$ holds at $x = \\frac{\\pi}{6}$ and $x = \\frac{5\\pi}{6}$. Sine repeats every $2\\pi$, so adding any whole number of turns gives another solution, and every real solution is one of

$$x = \\frac{\\pi}{6} + 2k\\pi, \\quad x = \\frac{5\\pi}{6} + 2k\\pi, \\quad k \\in \\mathbb{Z}$$

Check: $k = -1$ in the first family gives $x = -\\frac{11\\pi}{6}$, and $\\sin\\left(-\\frac{11\\pi}{6}\\right) = \\sin\\frac{\\pi}{6} = \\frac{1}{2}$.

In this lesson we write the general solutions of sine, cosine and tangent equations, and pick out particular solutions from them.`,
    `在一圈内，$\\sin x = \\frac{1}{2}$ 在 $x = \\frac{\\pi}{6}$ 和 $x = \\frac{5\\pi}{6}$ 处成立。正弦每隔 $2\\pi$ 重复一次，所以加上任意整数圈都得到另一个解，而所有实数解都在下面两族之中：

$$x = \\frac{\\pi}{6} + 2k\\pi, \\quad x = \\frac{5\\pi}{6} + 2k\\pi, \\quad k \\in \\mathbb{Z}$$

检验：在第一族中取 $k = -1$ 得 $x = -\\frac{11\\pi}{6}$，而 $\\sin\\left(-\\frac{11\\pi}{6}\\right) = \\sin\\frac{\\pi}{6} = \\frac{1}{2}$。

这节课我们写出正弦、余弦、正切方程的通解，并从通解中求出特定的解。`,
  ),
  knowledgePoints: [
    {
      id: "general-solutions-sin-cos-tan",
      title: t("General solution formulas for trigonometric equations", "三角方程通解公式形式"),
      explanation: t(
        "Because trigonometric functions repeat, an equation has infinitely many solutions, which we describe by adding whole multiples of the period to the solutions in one cycle. For $k \\in \\mathbb{Z}$:\n\n- $\\sin x = c$: $x = \\alpha + 2k\\pi$ or $x = (\\pi - \\alpha) + 2k\\pi$\n- $\\cos x = c$: $x = \\pm \\alpha + 2k\\pi$\n- $\\tan x = c$: $x = \\alpha + k\\pi$\n\nFor $\\cos x = -\\frac{\\sqrt{2}}{2}$ the arccosine is $\\frac{3\\pi}{4}$, so $x = \\pm \\frac{3\\pi}{4} + 2k\\pi$. Check: the minus sign with $k = 1$ gives $x = \\frac{5\\pi}{4}$, and $\\cos\\frac{5\\pi}{4} = -\\frac{\\sqrt{2}}{2}$.\n\n> **Watch out.** Tangent repeats every $\\pi$, so its family is $\\alpha + k\\pi$. Writing $\\alpha + 2k\\pi$ loses half of the solutions: for $\\tan x = 1$ it never reaches $\\frac{5\\pi}{4}$.",
        "由于三角函数是周期函数，方程有无穷多个解，我们在一个周期内的解上加上周期的整数倍来描述它们。对于 $k \\in \\mathbb{Z}$：\n\n- $\\sin x = c$：$x = \\alpha + 2k\\pi$ 或 $x = (\\pi - \\alpha) + 2k\\pi$\n- $\\cos x = c$：$x = \\pm \\alpha + 2k\\pi$\n- $\\tan x = c$：$x = \\alpha + k\\pi$\n\n对于 $\\cos x = -\\frac{\\sqrt{2}}{2}$，反余弦是 $\\frac{3\\pi}{4}$，所以 $x = \\pm \\frac{3\\pi}{4} + 2k\\pi$。检验：取负号和 $k = 1$ 得 $x = \\frac{5\\pi}{4}$，而 $\\cos\\frac{5\\pi}{4} = -\\frac{\\sqrt{2}}{2}$。\n\n> **注意。** 正切每隔 $\\pi$ 重复一次，所以它的解族是 $\\alpha + k\\pi$。写成 $\\alpha + 2k\\pi$ 会丢掉一半的解：对于 $\\tan x = 1$，它永远取不到 $\\frac{5\\pi}{4}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            fn: "\\sin",
            val: "\\frac{1}{2}",
            ans: "\\frac{\\pi}{6} + 2k\\pi, \\; \\frac{5\\pi}{6} + 2k\\pi",
            wrong: ["\\frac{\\pi}{6} + k\\pi", "\\frac{\\pi}{3} + 2k\\pi", "\\pm \\frac{\\pi}{6} + 2k\\pi"],
          },
          {
            fn: "\\sin",
            val: "-\\frac{1}{2}",
            ans: "\\frac{7\\pi}{6} + 2k\\pi, \\; \\frac{11\\pi}{6} + 2k\\pi",
            wrong: ["\\frac{7\\pi}{6} + k\\pi", "\\pm \\frac{\\pi}{6} + 2k\\pi", "\\frac{4\\pi}{3} + 2k\\pi"],
          },
          {
            fn: "\\cos",
            val: "\\frac{1}{2}",
            ans: "\\pm \\frac{\\pi}{3} + 2k\\pi",
            wrong: ["\\frac{\\pi}{3} + k\\pi", "\\frac{\\pi}{6} + 2k\\pi", "\\pm \\frac{\\pi}{6} + 2k\\pi"],
          },
          {
            fn: "\\cos",
            val: "-\\frac{1}{2}",
            ans: "\\pm \\frac{2\\pi}{3} + 2k\\pi",
            wrong: ["\\frac{2\\pi}{3} + k\\pi", "\\pm \\frac{\\pi}{3} + 2k\\pi", "\\frac{5\\pi}{6} + 2k\\pi"],
          },
          {
            fn: "\\cos",
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "\\pm \\frac{\\pi}{4} + 2k\\pi",
            wrong: ["\\frac{\\pi}{4} + k\\pi", "\\pm \\frac{3\\pi}{4} + 2k\\pi", "\\frac{\\pi}{4} + 2k\\pi"],
          },
          {
            fn: "\\tan",
            val: "1",
            ans: "\\frac{\\pi}{4} + k\\pi",
            wrong: ["\\frac{\\pi}{4} + 2k\\pi", "\\pm \\frac{\\pi}{4} + k\\pi", "\\frac{5\\pi}{4} + 2k\\pi"],
          },
          {
            fn: "\\tan",
            val: "-1",
            ans: "-\\frac{\\pi}{4} + k\\pi",
            wrong: ["\\pm \\frac{\\pi}{4} + k\\pi", "-\\frac{\\pi}{4} + 2k\\pi", "\\frac{3\\pi}{4} + 2k\\pi"],
          },
          {
            fn: "\\tan",
            val: "\\sqrt{3}",
            ans: "\\frac{\\pi}{3} + k\\pi",
            wrong: ["\\frac{\\pi}{3} + 2k\\pi", "\\pm \\frac{\\pi}{3} + k\\pi", "\\frac{\\pi}{6} + k\\pi"],
          },
          {
            fn: "\\tan",
            val: "\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{6} + k\\pi",
            wrong: ["\\frac{\\pi}{6} + 2k\\pi", "\\pm \\frac{\\pi}{6} + k\\pi", "\\frac{\\pi}{3} + k\\pi"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        return oneOf(
          rng,
          t(
            `Find all real solutions to $${item.fn} ${v} = ${item.val}$ (where $k \\in \\mathbb{Z}$).`,
            `求方程 $${item.fn} ${v} = ${item.val}$ 的所有实数解（其中 $k \\in \\mathbb{Z}$）。`,
          ),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          generalSolution({ fn: item.fn.slice(1) as Basic, B: 1, v, val: item.val, ans: item.ans }),
          familyReasons(item.fn.slice(1) as Basic, 1, v, item.val, item.ans, item.wrong),
        );
      },
    },
    {
      id: "particular-solutions-from-general-trig",
      title: t("Evaluate particular degree solutions from general formulas", "由通解公式求特定角度解"),
      figure: remainingDrawings5["general-solutions-of-elementary-trigonometric-equations#particular-solutions-from-general-trig"],
      explanation: t(
        "A general solution is a family of angles indexed by an integer, and choosing a specific integer picks out one member of the family. Given a general solution $x = \\alpha + 360k$ or $x = \\alpha + 180k$ in degrees, substitute an integer $k$ to find a particular solution, and choose the integer that lands in the interval you need.\n\nFor $\\tan(x^{\\circ}) = 1$ the branch is $x = 45 + 180k$. In $[360, 540)$, take $k = 2$: $x = 45 + 360 = 405$. Check: $405 - 360 = 45$, so $\\tan(405^{\\circ}) = \\tan(45^{\\circ}) = 1$.\n\n> **Watch out.** $k$ counts periods, not degrees: for $x = 30 + 360k$ in $[720, 1080)$, $k = 2$, because $720 = 2 \\cdot 360$.",
        "通解是一族以整数为下标的角，选定一个具体的整数就得到这族角中的一个。给定角度制下的通解 $x = \\alpha + 360k$ 或 $x = \\alpha + 180k$，选取使结果落在给定区间内的整数 $k$ 并代入，即可求得对应的特解。\n\n对于 $\\tan(x^{\\circ}) = 1$，这一分支是 $x = 45 + 180k$。在 $[360, 540)$ 内取 $k = 2$：$x = 45 + 360 = 405$。检验：$405 - 360 = 45$，所以 $\\tan(405^{\\circ}) = \\tan(45^{\\circ}) = 1$。\n\n> **注意。** $k$ 数的是周期的个数，不是度数：对于 $x = 30 + 360k$，在 $[720, 1080)$ 内 $k = 2$，因为 $720 = 2 \\cdot 360$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { fn: "\\sin", val: "\\frac{1}{2}", alpha: 30, period: 360 },
          { fn: "\\sin", val: "\\frac{\\sqrt{2}}{2}", alpha: 45, period: 360 },
          { fn: "\\sin", val: "\\frac{\\sqrt{3}}{2}", alpha: 60, period: 360 },
          { fn: "\\cos", val: "\\frac{1}{2}", alpha: 60, period: 360 },
          { fn: "\\cos", val: "\\frac{\\sqrt{3}}{2}", alpha: 30, period: 360 },
          { fn: "\\tan", val: "1", alpha: 45, period: 180 },
          { fn: "\\tan", val: "\\sqrt{3}", alpha: 60, period: 180 },
          { fn: "\\tan", val: "\\frac{\\sqrt{3}}{3}", alpha: 30, period: 180 },
        ]);
        const k = rng.pick([-2, -1, 1, 2, 3]);
        const ans = item.alpha + k * item.period;
        return numberProblem({
          prompt: t(
            `One branch of the general solution to $${item.fn}(x^{\\circ}) = ${item.val}$ is $x = ${item.alpha} + ${item.period}k$. Find the member of this branch in the interval $[${k * item.period}, ${(k + 1) * item.period})$.`,
            `方程 $${item.fn}(x^{\\circ}) = ${item.val}$ 的通解分支之一为 $x = ${item.alpha} + ${item.period}k$。求这一分支落在区间 $[${k * item.period}, ${(k + 1) * item.period})$ 内的解。`,
          ),
          answer: ans,
          wrong: [item.alpha - k * item.period, item.alpha + k * 180, item.alpha + (k + 1) * item.period],
          solution: walked(
            [
              [
                ["Choose k", "选取 k"],
                t(
                  `The branch moves by $${item.period}$ each time $k$ goes up by $1$. Since $0 \\le ${item.alpha} < ${item.period}$, the member $${item.alpha} + ${item.period}k$ lies in $[${k * item.period}, ${(k + 1) * item.period})$ exactly when`,
                  `$k$ 每增加 $1$，这一分支就移动 $${item.period}$。因为 $0 \\le ${item.alpha} < ${item.period}$，所以 $${item.alpha} + ${item.period}k$ 落在 $[${k * item.period}, ${(k + 1) * item.period})$ 内恰好当`,
                ),
                [`k = ${k}`],
              ],
              [
                ["Substitute", "代入"],
                t("Put this $k$ into the branch:", "把这个 $k$ 代入这一分支："),
                [`x = ${item.alpha} + ${item.period}(${k}) = ${ans}`],
              ],
            ],
            t(
              `The answer lies in the interval, since $${k * item.period} \\le ${ans} < ${(k + 1) * item.period}$. And it solves the equation, because it differs from $${item.alpha}$ by whole periods: $${fnAt(item.fn.slice(1) as Fn, ans, "deg")} = ${fnAt(item.fn.slice(1) as Fn, item.alpha, "deg")} = ${item.val}$.`,
              `答案在区间内，因为 $${k * item.period} \\le ${ans} < ${(k + 1) * item.period}$。它也满足方程，因为它与 $${item.alpha}$ 相差整数个周期：$${fnAt(item.fn.slice(1) as Fn, ans, "deg")} = ${fnAt(item.fn.slice(1) as Fn, item.alpha, "deg")} = ${item.val}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 4.14.1 General solutions with transformed functions ─────────────────────

/** generalSolutionsOfTrigonometricEquationsWithTransformedFunctions covers sin(Bx) = c. */
export const generalSolutionsOfTrigonometricEquationsWithTransformedFunctions: TopicDef = {
  id: "general-solutions-of-trigonometric-equations-with-transformed-functions",
  title: t("General Solutions of Trigonometric Equations With Transformed Functions", "含变换函数的三角方程通解"),
  summary: t(
    "Solve equations of the form sin(Bx) = c, cos(Bx) = c, or tan(Bx) = c by substituting u = Bx and dividing by B.",
    "通过令 u = Bx 并两边除以 B 求解形如 sin(Bx) = c、cos(Bx) = c 或 tan(Bx) = c 的方程通解。",
  ),
  prerequisites: ["general-solutions-of-elementary-trigonometric-equations"],
  encompasses: [{ topic: "general-solutions-of-elementary-trigonometric-equations", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\tan(2x) = 1$ for all real $x$. Treat $2x$ as one angle: tangent is $1$ at $\\frac{\\pi}{4}$ and every $\\pi$ from there, so $2x = \\frac{\\pi}{4} + k\\pi$. Dividing by $2$ divides the spacing too:

$$x = \\frac{\\pi}{8} + \\frac{k\\pi}{2}, \\quad k \\in \\mathbb{Z}$$

Check: $k = 1$ gives $x = \\frac{5\\pi}{8}$, so $2x = \\frac{5\\pi}{4}$, and $\\tan\\frac{5\\pi}{4} = 1$.

In this lesson we solve $\\sin(Bx) = c$, $\\cos(Bx) = c$ and $\\tan(Bx) = c$ over the real numbers, and find how far apart their solutions lie.`,
    `对所有实数 $x$ 求解 $\\tan(2x) = 1$。把 $2x$ 看作一个角：正切在 $\\frac{\\pi}{4}$ 处等于 $1$，并且每隔 $\\pi$ 重复，所以 $2x = \\frac{\\pi}{4} + k\\pi$。除以 $2$ 时，间隔也一起被除：

$$x = \\frac{\\pi}{8} + \\frac{k\\pi}{2}, \\quad k \\in \\mathbb{Z}$$

检验：取 $k = 1$ 得 $x = \\frac{5\\pi}{8}$，于是 $2x = \\frac{5\\pi}{4}$，而 $\\tan\\frac{5\\pi}{4} = 1$。

这节课我们在实数范围内求解 $\\sin(Bx) = c$、$\\cos(Bx) = c$ 和 $\\tan(Bx) = c$，并求出它们的解之间相隔多远。`,
  ),
  knowledgePoints: [
    {
      id: "general-solution-multi-angle",
      figure: precalculusDrawings2["general-solutions-of-trigonometric-equations-with-transformed-functions#general-solution-multi-angle"],
      title: t("General solution of sin(Bx) = c and cos(Bx) = c", "sin(Bx) = c 与 cos(Bx) = c 的通解"),
      explanation: t(
        "Solve for the whole inner angle first, adding multiples of the period, and only then divide by the coefficient, which also divides the period. For $\\sin(2x) = \\frac{1}{2}$:\n\n$$2x = \\frac{\\pi}{6} + 2k\\pi \\implies x = \\frac{\\pi}{12} + k\\pi$$\n\n$$2x = \\frac{5\\pi}{6} + 2k\\pi \\implies x = \\frac{5\\pi}{12} + k\\pi$$\n\nFor $\\cos(3x) = \\frac{1}{2}$: $3x = \\pm \\frac{\\pi}{3} + 2k\\pi$, so $x = \\pm \\frac{\\pi}{9} + \\frac{2k\\pi}{3}$. Check: the plus sign with $k = 1$ gives $x = \\frac{7\\pi}{9}$, and $3 \\cdot \\frac{7\\pi}{9} = \\frac{7\\pi}{3} = \\frac{\\pi}{3} + 2\\pi$, whose cosine is $\\frac{1}{2}$.\n\n> **Watch out.** Divide the period by the coefficient as well. Writing $x = \\pm \\frac{\\pi}{9} + 2k\\pi$ keeps only every third solution and misses $x = \\frac{7\\pi}{9}$.",
        "先对整个内层角求解并加上周期的整数倍，然后再除以系数，周期也随之被除。对于 $\\sin(2x) = \\frac{1}{2}$：\n\n$$2x = \\frac{\\pi}{6} + 2k\\pi \\implies x = \\frac{\\pi}{12} + k\\pi$$\n\n$$2x = \\frac{5\\pi}{6} + 2k\\pi \\implies x = \\frac{5\\pi}{12} + k\\pi$$\n\n对于 $\\cos(3x) = \\frac{1}{2}$：$3x = \\pm \\frac{\\pi}{3} + 2k\\pi$，所以 $x = \\pm \\frac{\\pi}{9} + \\frac{2k\\pi}{3}$。检验：取正号和 $k = 1$ 得 $x = \\frac{7\\pi}{9}$，而 $3 \\cdot \\frac{7\\pi}{9} = \\frac{7\\pi}{3} = \\frac{\\pi}{3} + 2\\pi$，它的余弦是 $\\frac{1}{2}$。\n\n> **注意。** 周期也要除以系数。写成 $x = \\pm \\frac{\\pi}{9} + 2k\\pi$ 只保留了每三个解中的一个，漏掉了 $x = \\frac{7\\pi}{9}$。",
      ),
      generate(rng) {
        const B = rng.pick([2, 3, 4]);
        const turn = B === 2 ? "k\\pi" : B === 4 ? "\\frac{k\\pi}{2}" : `\\frac{2k\\pi}{${B}}`;
        const item = rng.pick([
          {
            fn: "\\cos",
            val: "\\frac{1}{2}",
            ans: `\\pm \\frac{\\pi}{${3 * B}} + ${turn}`,
            wrong: [
              `\\pm \\frac{\\pi}{3} + 2k\\pi`,
              `\\pm \\frac{\\pi}{${3 * B}} + 2k\\pi`,
              `\\frac{\\pi}{${6 * B}} + \\frac{k\\pi}{${B}}`,
            ],
          },
          {
            fn: "\\cos",
            val: "\\frac{\\sqrt{2}}{2}",
            ans: `\\pm \\frac{\\pi}{${4 * B}} + ${turn}`,
            wrong: [
              `\\pm \\frac{\\pi}{4} + 2k\\pi`,
              `\\pm \\frac{\\pi}{${4 * B}} + 2k\\pi`,
              `\\frac{\\pi}{${2 * B}} + \\frac{k\\pi}{${B}}`,
            ],
          },
          {
            fn: "\\tan",
            val: "1",
            ans: `\\frac{\\pi}{${4 * B}} + \\frac{k\\pi}{${B}}`,
            wrong: [`\\frac{\\pi}{4} + k\\pi`, `\\frac{\\pi}{${4 * B}} + 2k\\pi`, `\\frac{\\pi}{${2 * B}} + \\frac{k\\pi}{${B}}`],
          },
          {
            fn: "\\tan",
            val: "\\sqrt{3}",
            ans: `\\frac{\\pi}{${3 * B}} + \\frac{k\\pi}{${B}}`,
            wrong: [`\\frac{\\pi}{3} + k\\pi`, `\\frac{\\pi}{${3 * B}} + 2k\\pi`, `\\frac{\\pi}{${6 * B}} + \\frac{k\\pi}{${B}}`],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        return oneOf(
          rng,
          t(
            `Find the general solution to $${item.fn}(${B}${v}) = ${item.val}$ for $k \\in \\mathbb{Z}$.`,
            `求方程 $${item.fn}(${B}${v}) = ${item.val}$ 的通解（其中 $k \\in \\mathbb{Z}$）。`,
          ),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          generalSolution({ fn: item.fn.slice(1) as Basic, B, v, val: item.val, ans: item.ans }),
          familyReasons(item.fn.slice(1) as Basic, B, v, item.val, item.ans, item.wrong),
        );
      },
    },
    {
      id: "period-and-spacing-of-transformed-trig-solutions",
      title: t("Particular degree solutions of transformed equations", "变换三角方程的特解计算"),
      figure:
        remainingDrawings6[
          "general-solutions-of-trigonometric-equations-with-transformed-functions#period-and-spacing-of-transformed-trig-solutions"
        ],
      explanation: t(
        "Multiplying the input by a constant squeezes the graph horizontally, so the solutions are spaced more closely, by the period divided by that constant. For $\\sin(Bx^{\\circ}) = c$, dividing the general solution $Bx = \\alpha + 360k$ by $B$ gives $x = \\frac{\\alpha}{B} + \\frac{360}{B}k$.\n\nFor $\\tan(3x^{\\circ}) = 1$, one solution is $x = 15$, since $3 \\cdot 15 = 45$. The period of the left side is $\\frac{180}{3} = 60$, so the next solutions are $75$ and $135$. Check: $3 \\cdot 75 = 225$, and $\\tan(225^{\\circ}) = 1$.\n\n> **Watch out.** The solutions are spaced by the period of the left side, $\\frac{360}{B}$ or $\\frac{180}{B}$, not by $360$ or $180$, the period of the plain function.",
        "把自变量乘以一个常数会在水平方向压缩图像，所以解之间的间隔变小，等于周期除以这个常数。对于 $\\sin(Bx^{\\circ}) = c$，将 $Bx = \\alpha + 360k$ 两边除以 $B$ 可得 $x = \\frac{\\alpha}{B} + \\frac{360}{B}k$。\n\n对于 $\\tan(3x^{\\circ}) = 1$，$x = 15$ 是一个解，因为 $3 \\cdot 15 = 45$。左边函数的周期是 $\\frac{180}{3} = 60$，所以接下来的解是 $75$ 和 $135$。检验：$3 \\cdot 75 = 225$，而 $\\tan(225^{\\circ}) = 1$。\n\n> **注意。** 解之间的间隔是左边函数的周期 $\\frac{360}{B}$ 或 $\\frac{180}{B}$，而不是原函数的周期 $360$ 或 $180$。",
      ),
      generate(rng) {
        const B = rng.pick([2, 3, 5, 6]);
        const item = rng.pick([
          { fn: "\\sin", val: "\\frac{1}{2}", alpha: 30, basePeriod: 360 },
          { fn: "\\cos", val: "\\frac{1}{2}", alpha: 60, basePeriod: 360 },
          { fn: "\\sin", val: "1", alpha: 90, basePeriod: 360 },
          { fn: "\\tan", val: "0", alpha: 0, basePeriod: 180 },
          { fn: "\\tan", val: "\\sqrt{3}", alpha: 60, basePeriod: 180 },
        ]);
        const k = rng.pick([1, 2, 3]);
        const step = item.basePeriod / B;
        const base = item.alpha / B;
        const ans = base + k * step;
        return numberProblem({
          prompt: t(
            `One solution of $${item.fn}(${B}x^{\\circ}) = ${item.val}$ is $x = ${base}$. Moving up from it by whole periods of the left side gives more solutions. Find the solution $${k}$ ${k === 1 ? "period" : "periods"} above $x = ${base}$.`,
            `$x = ${base}$ 是方程 $${item.fn}(${B}x^{\\circ}) = ${item.val}$ 的一个解。从它向上移动左边函数的整数个周期，得到其他解。求比 $x = ${base}$ 大 $${k}$ 个周期的解。`,
          ),
          answer: ans,
          wrong: [item.alpha + k * step, base + k * item.basePeriod, ans + step],
          solution: walked(
            [
              [
                ["Find the period", "求周期"],
                t(
                  `The input $${B}x$ runs $${B}$ times as fast as $x$, so the left side repeats when $x$ grows by $\\frac{1}{${B}}$ of $${item.basePeriod}$:`,
                  `输入 $${B}x$ 的变化速度是 $x$ 的 $${B}$ 倍，所以 $x$ 增加 $${item.basePeriod}$ 的 $\\frac{1}{${B}}$ 时，左边就重复一次：`,
                ),
                [`\\frac{${item.basePeriod}}{${B}} = ${step}`],
              ],
              [
                ["Step up", "向上移动"],
                t(`Add $${k}$ ${k === 1 ? "period" : "periods"} to the known solution:`, `在已知的解上加 $${k}$ 个周期：`),
                [`x = ${base} + ${k} \\cdot ${step} = ${ans}`],
              ],
            ],
            t(
              `Substitute into the left side:${steps(`${B} \\cdot ${ans} = ${B * ans}`, `\\${item.fn.slice(1)}(${B * ans}^{\\circ}) = ${exact(valueAt(item.fn.slice(1) as Fn, B * ans)!)}`)}That is the right side. Also $${B * ans} - ${item.alpha} = ${B * ans - item.alpha} = ${k} \\cdot ${item.basePeriod}$, a whole number of periods of the plain function.`,
              `代入左边：${steps(`${B} \\cdot ${ans} = ${B * ans}`, `\\${item.fn.slice(1)}(${B * ans}^{\\circ}) = ${exact(valueAt(item.fn.slice(1) as Fn, B * ans)!)}`)}正是右边。而且 $${B * ans} - ${item.alpha} = ${B * ans - item.alpha} = ${k} \\cdot ${item.basePeriod}$，正好是原函数的整数个周期。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 4.14.2 Transformed sine equations ──────────────────────────────────────

/** trigonometricEquationsContainingTransformedSineFunctions solves on [0, 2π). */
export const trigonometricEquationsContainingTransformedSineFunctions: TopicDef = {
  id: "trigonometric-equations-containing-transformed-sine-functions",
  title: t("Trigonometric Equations Containing Transformed Sine Functions", "含变换正弦函数的三角方程"),
  summary: t(
    "Find all solutions on [0, 2π) for sine equations with altered frequency sin(Bx) = c or phase shift sin(x - φ) = c.",
    "在 [0, 2π) 上求解具有频率变化 sin(Bx) = c 或相位平移 sin(x - φ) = c 的正弦方程全部解。",
  ),
  prerequisites: ["general-solutions-of-trigonometric-equations-with-transformed-functions"],
  encompasses: [{ topic: "general-solutions-of-trigonometric-equations-with-transformed-functions", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\sin(2x) = \\frac{1}{2}$ for $x$ in $[0, 2\\pi)$. As $x$ runs over $[0, 2\\pi)$, the inner angle $2x$ runs over $[0, 4\\pi)$, two full turns. Sine is $\\frac{1}{2}$ twice in each turn:

$$2x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}, \\; \\frac{13\\pi}{6}, \\; \\frac{17\\pi}{6} \\implies x = \\frac{\\pi}{12}, \\; \\frac{5\\pi}{12}, \\; \\frac{13\\pi}{12}, \\; \\frac{17\\pi}{12}$$

Check: two turns with two solutions each make four solutions, and $\\sin\\left(2 \\cdot \\frac{13\\pi}{12}\\right) = \\sin\\frac{13\\pi}{6} = \\sin\\frac{\\pi}{6} = \\frac{1}{2}$.

In this lesson we solve sine equations with a stretched or shifted input on a given interval, by working with the inner angle first.`,
    `在 $[0, 2\\pi)$ 上求解 $\\sin(2x) = \\frac{1}{2}$。当 $x$ 取遍 $[0, 2\\pi)$ 时，内层角 $2x$ 取遍 $[0, 4\\pi)$，也就是两整圈。正弦每圈两次等于 $\\frac{1}{2}$：

$$2x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}, \\; \\frac{13\\pi}{6}, \\; \\frac{17\\pi}{6} \\implies x = \\frac{\\pi}{12}, \\; \\frac{5\\pi}{12}, \\; \\frac{13\\pi}{12}, \\; \\frac{17\\pi}{12}$$

检验：两圈、每圈两个解，共四个解；并且 $\\sin\\left(2 \\cdot \\frac{13\\pi}{12}\\right) = \\sin\\frac{13\\pi}{6} = \\sin\\frac{\\pi}{6} = \\frac{1}{2}$。

这节课我们求解自变量经过伸缩或平移的正弦方程，在给定区间上先处理内层角。`,
  ),
  knowledgePoints: [
    {
      id: "solve-transformed-sine-frequency-and-phase",
      title: t("Solve transformed sine equations on [0, 2π)", "在 [0, 2π) 上求解变换正弦方程"),
      explanation: t(
        "Find the interval that the inner expression covers as the variable runs over the given interval, list every solution for the inner expression there, and then solve for the variable. For $\\sin(2x) = 1$ on $[0, 2\\pi)$:\n\n$$2x \\in [0, 4\\pi) \\implies 2x = \\frac{\\pi}{2}, \\; \\frac{5\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\nFor $\\sin\\left(x + \\frac{\\pi}{6}\\right) = 1$, the inner angle runs over $\\left[\\frac{\\pi}{6}, \\frac{13\\pi}{6}\\right)$, where sine is $1$ only at $\\frac{\\pi}{2}$, so $x = \\frac{\\pi}{2} - \\frac{\\pi}{6} = \\frac{\\pi}{3}$. Check: $\\sin\\left(\\frac{\\pi}{3} + \\frac{\\pi}{6}\\right) = \\sin\\frac{\\pi}{2} = 1$.\n\n> **Watch out.** Find the range of the inner angle before solving. For $\\sin(2x)$ on $[0, 2\\pi)$ the inner angle covers two turns, and stopping at the solutions of one turn loses half of them.",
        "先求出变量取遍给定区间时内层式子所覆盖的区间，在其中写出内层式子的所有解，再解出变量。在 $[0, 2\\pi)$ 上求解 $\\sin(2x) = 1$：\n\n$$2x \\in [0, 4\\pi) \\implies 2x = \\frac{\\pi}{2}, \\; \\frac{5\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\n对于 $\\sin\\left(x + \\frac{\\pi}{6}\\right) = 1$，内层角取遍 $\\left[\\frac{\\pi}{6}, \\frac{13\\pi}{6}\\right)$，其中正弦只在 $\\frac{\\pi}{2}$ 处等于 $1$，所以 $x = \\frac{\\pi}{2} - \\frac{\\pi}{6} = \\frac{\\pi}{3}$。检验：$\\sin\\left(\\frac{\\pi}{3} + \\frac{\\pi}{6}\\right) = \\sin\\frac{\\pi}{2} = 1$。\n\n> **注意。** 先求内层角的范围再求解。对于 $[0, 2\\pi)$ 上的 $\\sin(2x)$，内层角走过两圈，只求一圈内的解会丢掉一半。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\sin(2x) = 1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{\\pi}{4}"],
          },
          {
            expr: "\\sin(2x) = -1",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{3\\pi}{2}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}"],
          },
          {
            expr: "\\sin(2x) = 0",
            ans: "0, \\frac{\\pi}{2}, \\pi, \\frac{3\\pi}{2}",
            wrong: ["0, \\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\frac{\\pi}{4}, \\frac{\\pi}{2}"],
          },
          {
            expr: "\\sin\\left(x - \\frac{\\pi}{4}\\right) = 0",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["0, \\pi", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}"],
          },
          {
            expr: "\\sin\\left(x + \\frac{\\pi}{3}\\right) = 1",
            ans: "\\frac{\\pi}{6}",
            wrong: ["\\frac{\\pi}{2}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{3}"],
          },
          {
            expr: "\\sin\\left(x - \\frac{\\pi}{6}\\right) = 1",
            ans: "\\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{2}", "\\frac{\\pi}{3}", "\\frac{5\\pi}{6}"],
          },
          {
            expr: "2\\sin(2x) = \\sqrt{3}",
            ans: "\\frac{\\pi}{6}, \\frac{\\pi}{3}, \\frac{7\\pi}{6}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{6}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "2\\sin(2x) = 1",
            ans: "\\frac{\\pi}{12}, \\frac{5\\pi}{12}, \\frac{13\\pi}{12}, \\frac{17\\pi}{12}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{12}, \\frac{7\\pi}{12}", "\\frac{5\\pi}{12}, \\frac{11\\pi}{12}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ for $${v} \\in [0, 2\\pi)$.`, `在 $${v} \\in [0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          transformed(item.expr, v, 360),
          transformedReasons(item.expr, v, 360, item.wrong),
        );
      },
    },
    {
      id: "solve-transformed-sine-degrees",
      title: t("Solve transformed sine equations in degrees", "在角度制下求解变换正弦方程"),
      figure: remainingDrawings6["trigonometric-equations-containing-transformed-sine-functions#solve-transformed-sine-degrees"],
      explanation: t(
        "Treat the shifted angle as a single unknown, find all its values with the given sine, and then add the shift back to each one. To solve $\\sin(x^{\\circ} - \\varphi^{\\circ}) = c$ on $[0, 360)$, find the reference angles for $x - \\varphi$ and add $\\varphi$.\n\nFor $\\sin(x^{\\circ} + 40^{\\circ}) = \\frac{1}{2}$, let $w = x + 40$, which runs over $[40, 400)$. There sine is $\\frac{1}{2}$ at $w = 150$ and $w = 390$, so $x = 110$ and $x = 350$. Check: $\\sin(350^{\\circ} + 40^{\\circ}) = \\sin(390^{\\circ}) = \\sin(30^{\\circ}) = \\frac{1}{2}$.\n\n> **Watch out.** Undo the shift in the right direction: $\\sin(x^{\\circ} - 20^{\\circ}) = 1$ means $x - 20 = 90$, so $x = 110$, not $70$.",
        "把平移后的角看作一个未知数，求出正弦为给定值的所有角，再给每个角加回平移量。在 $[0, 360)$ 上求解 $\\sin(x^{\\circ} - \\varphi^{\\circ}) = c$ 时，先求出 $x - \\varphi$ 的解，再加上 $\\varphi$。\n\n对于 $\\sin(x^{\\circ} + 40^{\\circ}) = \\frac{1}{2}$，设 $w = x + 40$，它取遍 $[40, 400)$。在这个范围内正弦在 $w = 150$ 和 $w = 390$ 处等于 $\\frac{1}{2}$，所以 $x = 110$，$x = 350$。检验：$\\sin(350^{\\circ} + 40^{\\circ}) = \\sin(390^{\\circ}) = \\sin(30^{\\circ}) = \\frac{1}{2}$。\n\n> **注意。** 去掉平移时方向要对：$\\sin(x^{\\circ} - 20^{\\circ}) = 1$ 意味着 $x - 20 = 90$，所以 $x = 110$，不是 $70$。",
      ),
      generate(rng) {
        const shift = rng.pick([10, 15, 20, 25, 30, 40]);
        const sign = rng.pick([1, -1]);
        const item = rng.pick([
          { val: "1", base: [90] },
          { val: "-1", base: [270] },
          { val: "\\frac{1}{2}", base: [30, 150] },
          { val: "\\frac{\\sqrt{2}}{2}", base: [45, 135] },
          { val: "\\frac{\\sqrt{3}}{2}", base: [60, 120] },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const shiftLatex = sign === 1 ? `${v}^{\\circ} - ${shift}^{\\circ}` : `${v}^{\\circ} + ${shift}^{\\circ}`;
        const ansNums = inTurn(item.base.map((b) => b + sign * shift));
        const ans = ansNums.map(String);
        const wrong1 = item.base.map((b) => String(b - sign * shift));
        const wrong2 = item.base.map(String);
        const wrong3 = ansNums.map((a) => String(a + 30));
        return solutionsProblem({
          prompt: t(
            `Solve $\\sin(${shiftLatex}) = ${item.val}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $\\sin(${shiftLatex}) = ${item.val}$。`,
          ),
          variable: v,
          values: ans,
          wrong: [wrong1, wrong2, wrong3],
          solution: shiftedDegrees({ fn: "sin", v, sign, shift, val: item.val, hi: 360, inside: shiftLatex }),
        });
      },
    },
  ],
};

// ─── 4.14.3 Transformed cosine equations ────────────────────────────────────

/** trigonometricEquationsContainingTransformedCosineFunctions solves on [0, 2π). */
export const trigonometricEquationsContainingTransformedCosineFunctions: TopicDef = {
  id: "trigonometric-equations-containing-transformed-cosine-functions",
  title: t("Trigonometric Equations Containing Transformed Cosine Functions", "含变换余弦函数的三角方程"),
  summary: t(
    "Find all solutions on [0, 2π) for cosine equations with transformed frequencies cos(Bx) = c or shifts.",
    "在 [0, 2π) 上求解具有频率变化或平移的余弦方程。",
  ),
  prerequisites: ["general-solutions-of-trigonometric-equations-with-transformed-functions"],
  encompasses: [{ topic: "general-solutions-of-trigonometric-equations-with-transformed-functions", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\cos(2x) = 0$ for $x$ in $[0, 2\\pi)$. The inner angle $2x$ runs over $[0, 4\\pi)$, and cosine is $0$ at the top and bottom of the circle in each of the two turns:

$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$

Check: $\\cos\\left(2 \\cdot \\frac{3\\pi}{4}\\right) = \\cos\\frac{3\\pi}{2} = 0$, and the solutions are $\\frac{\\pi}{2}$ apart, half the period $\\pi$ of $\\cos(2x)$, just as the zeros of cosine are half a period apart.

In this lesson we solve cosine equations with a stretched or shifted input on a given interval.`,
    `在 $[0, 2\\pi)$ 上求解 $\\cos(2x) = 0$。内层角 $2x$ 取遍 $[0, 4\\pi)$，在两圈中的每一圈里，余弦都在圆的最高点和最低点为 $0$：

$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$

检验：$\\cos\\left(2 \\cdot \\frac{3\\pi}{4}\\right) = \\cos\\frac{3\\pi}{2} = 0$；而且相邻两个解相差 $\\frac{\\pi}{2}$，是 $\\cos(2x)$ 的周期 $\\pi$ 的一半，正如余弦的零点相隔半个周期。

这节课我们在给定区间上求解自变量经过伸缩或平移的余弦方程。`,
  ),
  knowledgePoints: [
    {
      id: "solve-transformed-cosine-frequency-and-phase",
      figure:
        precalculusDrawings2[
          "trigonometric-equations-containing-transformed-cosine-functions#solve-transformed-cosine-frequency-and-phase"
        ],
      title: t("Solve transformed cosine equations on [0, 2π)", "在 [0, 2π) 上求解变换余弦方程"),
      explanation: t(
        "Work with the inner expression as one angle, list its solutions across the stretched interval, and then divide or shift to recover the original variable. For $\\cos(2x) = 1$ on $[0, 2\\pi)$:\n\n$$2x = 0, \\; 2\\pi \\implies x = 0, \\; \\pi$$\n\nFor $\\cos(2x) = 0$:\n\n$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$\n\nFor $\\cos\\left(x - \\frac{\\pi}{3}\\right) = 0$, the inner angle runs over $\\left[-\\frac{\\pi}{3}, \\frac{5\\pi}{3}\\right)$, where cosine is $0$ at $\\frac{\\pi}{2}$ and $\\frac{3\\pi}{2}$, so $x = \\frac{5\\pi}{6}, \\frac{11\\pi}{6}$. Check: $\\cos\\left(\\frac{5\\pi}{6} - \\frac{\\pi}{3}\\right) = \\cos\\frac{\\pi}{2} = 0$.\n\n> **Watch out.** For $\\cos(2x) = 1$ on $[0, 2\\pi)$ the answer includes $x = \\pi$, from $2x = 2\\pi$: the inner range $[0, 4\\pi)$ contains $2\\pi$, even though $x = 2\\pi$ itself is left out.",
        "把内层式子当作一个角，在伸缩后的区间内写出它的所有解，再通过除法或平移求回原变量。在 $[0, 2\\pi)$ 上求解 $\\cos(2x) = 1$：\n\n$$2x = 0, \\; 2\\pi \\implies x = 0, \\; \\pi$$\n\n求解 $\\cos(2x) = 0$：\n\n$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$\n\n对于 $\\cos\\left(x - \\frac{\\pi}{3}\\right) = 0$，内层角取遍 $\\left[-\\frac{\\pi}{3}, \\frac{5\\pi}{3}\\right)$，其中余弦在 $\\frac{\\pi}{2}$ 和 $\\frac{3\\pi}{2}$ 处为 $0$，所以 $x = \\frac{5\\pi}{6}, \\frac{11\\pi}{6}$。检验：$\\cos\\left(\\frac{5\\pi}{6} - \\frac{\\pi}{3}\\right) = \\cos\\frac{\\pi}{2} = 0$。\n\n> **注意。** 在 $[0, 2\\pi)$ 上解 $\\cos(2x) = 1$，答案包括由 $2x = 2\\pi$ 得到的 $x = \\pi$：内层范围 $[0, 4\\pi)$ 含有 $2\\pi$，尽管 $x = 2\\pi$ 本身不在区间内。",
      ),
      generate(rng) {
        const item = rng.pick([
          { expr: "\\cos(2x) = 1", ans: "0, \\pi", wrong: ["0, 2\\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\pi"] },
          {
            expr: "\\cos(2x) = -1",
            ans: "\\frac{\\pi}{2}, \\frac{3\\pi}{2}",
            wrong: ["\\pi", "0, \\pi", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            expr: "\\cos(2x) = 0",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\frac{\\pi}{2}, \\pi", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            expr: "\\cos\\left(x - \\frac{\\pi}{4}\\right) = 0",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}"],
          },
          {
            expr: "\\cos\\left(x + \\frac{\\pi}{6}\\right) = 1",
            ans: "\\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}", "0", "\\frac{5\\pi}{6}"],
          },
          {
            expr: "2\\cos(2x) = 1",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "2\\cos(2x) = -1",
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            expr: "\\cos\\left(x - \\frac{\\pi}{3}\\right) = 1",
            ans: "\\frac{\\pi}{3}",
            wrong: ["0", "\\frac{5\\pi}{3}", "\\frac{2\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        const ansLatex = item.ans;
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${ansLatex}$`, `$${v} = ${ansLatex}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          transformed(item.expr, v, 360),
          transformedReasons(item.expr, v, 360, item.wrong),
        );
      },
    },
    {
      id: "solve-transformed-cosine-degrees",
      title: t("Solve transformed cosine equations in degrees", "在角度制下求解变换余弦方程"),
      figure: remainingDrawings6["trigonometric-equations-containing-transformed-cosine-functions#solve-transformed-cosine-degrees"],
      explanation: t(
        "Treat the shifted angle as a single unknown, find all its values with the given cosine, and then add the shift back to each one. To solve $\\cos(x^{\\circ} - \\varphi^{\\circ}) = c$ on $[0, 360)$, find the reference angles for $x - \\varphi$ and add $\\varphi$.\n\nFor $\\cos(x^{\\circ} - 15^{\\circ}) = 0$, let $w = x - 15$, which runs over $[-15, 345)$. There cosine is $0$ at $w = 90$ and $w = 270$, so $x = 105$ and $x = 285$. Check: $\\cos(285^{\\circ} - 15^{\\circ}) = \\cos(270^{\\circ}) = 0$.\n\n> **Watch out.** Take every angle in the range of $w$, not only those in $[0, 360)$: for $\\cos(x^{\\circ} + 25^{\\circ}) = 1$, $w$ runs over $[25, 385)$ and reaches $w = 360$, so $x = 335$.",
        "把平移后的角看作一个未知数，求出余弦为给定值的所有角，再给每个角加回平移量。在 $[0, 360)$ 上求解 $\\cos(x^{\\circ} - \\varphi^{\\circ}) = c$ 时，先求内层角的值，再解出 $x$。\n\n对于 $\\cos(x^{\\circ} - 15^{\\circ}) = 0$，设 $w = x - 15$，它取遍 $[-15, 345)$。在这个范围内余弦在 $w = 90$ 和 $w = 270$ 处为 $0$，所以 $x = 105$，$x = 285$。检验：$\\cos(285^{\\circ} - 15^{\\circ}) = \\cos(270^{\\circ}) = 0$。\n\n> **注意。** 要取 $w$ 范围内的所有角，而不只是 $[0, 360)$ 内的角：对于 $\\cos(x^{\\circ} + 25^{\\circ}) = 1$，$w$ 取遍 $[25, 385)$，能取到 $w = 360$，所以 $x = 335$。",
      ),
      generate(rng) {
        const shift = rng.pick([10, 15, 20, 25]);
        const sign = rng.pick([1, -1]);
        const item = rng.pick([
          { val: "0", base: [90, 270] },
          { val: "-1", base: [180] },
          { val: "\\frac{1}{2}", base: [60, 300] },
          { val: "\\frac{\\sqrt{2}}{2}", base: [45, 315] },
          { val: "\\frac{\\sqrt{3}}{2}", base: [30, 330] },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const shiftLatex = sign === 1 ? `${v}^{\\circ} - ${shift}^{\\circ}` : `${v}^{\\circ} + ${shift}^{\\circ}`;
        const ansNums = inTurn(item.base.map((b) => b + sign * shift));
        const ans = ansNums.map(String);
        const wrong1 = item.base.map((b) => String(b - sign * shift));
        const wrong2 = item.base.map(String);
        const wrong3 = ansNums.map((a) => String(a + 30));
        return solutionsProblem({
          prompt: t(
            `Solve $\\cos(${shiftLatex}) = ${item.val}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $\\cos(${shiftLatex}) = ${item.val}$。`,
          ),
          variable: v,
          values: ans,
          wrong: [wrong1, wrong2, wrong3],
          solution: shiftedDegrees({ fn: "cos", v, sign, shift, val: item.val, hi: 360, inside: shiftLatex }),
        });
      },
    },
  ],
};

// ─── 4.14.4 Transformed tangent equations ───────────────────────────────────

/** trigonometricEquationsContainingTransformedTangentFunctions solves on intervals. */
export const trigonometricEquationsContainingTransformedTangentFunctions: TopicDef = {
  id: "trigonometric-equations-containing-transformed-tangent-functions",
  title: t("Trigonometric Equations Containing Transformed Tangent Functions", "含变换正切函数的三角方程"),
  summary: t(
    "Solve equations of the form tan(Bx) = c or tan(x - φ) = c on specified intervals.",
    "在给定区间上求解形如 tan(Bx) = c 或 tan(x - φ) = c 的正切方程。",
  ),
  prerequisites: ["general-solutions-of-trigonometric-equations-with-transformed-functions"],
  encompasses: [{ topic: "general-solutions-of-trigonometric-equations-with-transformed-functions", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\tan(2x) = \\sqrt{3}$ for $x$ in $[0, \\pi)$. The inner angle $2x$ runs over $[0, 2\\pi)$, two periods of tangent, and tangent is $\\sqrt{3}$ once in each:

$$2x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3} \\implies x = \\frac{\\pi}{6}, \\; \\frac{2\\pi}{3}$$

Check: $\\tan\\left(2 \\cdot \\frac{2\\pi}{3}\\right) = \\tan\\frac{4\\pi}{3} = \\sqrt{3}$, and the two solutions are $\\frac{\\pi}{2}$ apart, the period of $\\tan(2x)$.

In this lesson we solve tangent equations with a stretched or shifted input on a given interval.`,
    `在 $[0, \\pi)$ 上求解 $\\tan(2x) = \\sqrt{3}$。内层角 $2x$ 取遍 $[0, 2\\pi)$，是正切的两个周期，每个周期里正切恰好一次等于 $\\sqrt{3}$：

$$2x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3} \\implies x = \\frac{\\pi}{6}, \\; \\frac{2\\pi}{3}$$

检验：$\\tan\\left(2 \\cdot \\frac{2\\pi}{3}\\right) = \\tan\\frac{4\\pi}{3} = \\sqrt{3}$，并且两个解相差 $\\frac{\\pi}{2}$，正是 $\\tan(2x)$ 的周期。

这节课我们在给定区间上求解自变量经过伸缩或平移的正切方程。`,
  ),
  knowledgePoints: [
    {
      id: "solve-transformed-tangent-equations",
      figure: precalculusDrawings2["trigonometric-equations-containing-transformed-tangent-functions#solve-transformed-tangent-equations"],
      title: t("Solve transformed tangent equations on [0, π)", "在 [0, π) 上求解变换正切方程"),
      explanation: t(
        "Tangent repeats every half turn, so after finding one solution for the inner angle, add multiples of $\\pi$ to cover the whole stretched interval before solving for the variable. For $\\tan(2x) = 1$ on $[0, \\pi)$:\n\n$$2x \\in [0, 2\\pi) \\implies 2x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4} \\implies x = \\frac{\\pi}{8}, \\; \\frac{5\\pi}{8}$$\n\nFor $\\tan(2x) = -1$ on $[0, \\pi)$: $2x \\in [0, 2\\pi)$ gives $2x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$, so $x = \\frac{3\\pi}{8}, \\frac{7\\pi}{8}$. Check: $\\frac{7\\pi}{8} - \\frac{3\\pi}{8} = \\frac{\\pi}{2}$, the period of $\\tan(2x)$.\n\n> **Watch out.** The period of $\\tan(2x)$ is $\\frac{\\pi}{2}$, not $\\pi$, so on $[0, \\pi)$ there are two solutions, not one.",
        "正切每半周重复一次，所以求出内层角的一个解后，加上 $\\pi$ 的倍数覆盖整个伸缩后的区间，再解出变量。在 $[0, \\pi)$ 上求解 $\\tan(2x) = 1$：\n\n$$2x \\in [0, 2\\pi) \\implies 2x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4} \\implies x = \\frac{\\pi}{8}, \\; \\frac{5\\pi}{8}$$\n\n在 $[0, \\pi)$ 上解 $\\tan(2x) = -1$：由 $2x \\in [0, 2\\pi)$ 得 $2x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$，所以 $x = \\frac{3\\pi}{8}, \\frac{7\\pi}{8}$。检验：$\\frac{7\\pi}{8} - \\frac{3\\pi}{8} = \\frac{\\pi}{2}$，正是 $\\tan(2x)$ 的周期。\n\n> **注意。** $\\tan(2x)$ 的周期是 $\\frac{\\pi}{2}$，不是 $\\pi$，所以在 $[0, \\pi)$ 上有两个解，而不是一个。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\tan(2x) = 1",
            ans: "\\frac{\\pi}{8}, \\frac{5\\pi}{8}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{8}, \\frac{3\\pi}{8}", "\\frac{\\pi}{4}"],
          },
          {
            expr: "\\tan(2x) = -1",
            ans: "\\frac{3\\pi}{8}, \\frac{7\\pi}{8}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{8}, \\frac{5\\pi}{8}", "\\frac{3\\pi}{8}"],
          },
          { expr: "\\tan(2x) = 0", ans: "0, \\frac{\\pi}{2}", wrong: ["0, \\pi", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "0"] },
          {
            expr: "\\tan(2x) = \\sqrt{3}",
            ans: "\\frac{\\pi}{6}, \\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{3}"],
          },
          {
            expr: "\\tan(2x) = -\\sqrt{3}",
            ans: "\\frac{\\pi}{3}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}"],
          },
          {
            expr: "\\tan\\left(x - \\frac{\\pi}{4}\\right) = 0",
            ans: "\\frac{\\pi}{4}",
            wrong: ["0", "\\frac{3\\pi}{4}", "\\frac{5\\pi}{4}"],
            shift: { inner: "x - \\frac{\\pi}{4}", range: "\\left[-\\frac{\\pi}{4}, \\frac{3\\pi}{4}\\right)", zero: "0" },
          },
          {
            expr: "\\tan\\left(x + \\frac{\\pi}{3}\\right) = 0",
            ans: "\\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}", "0", "\\frac{5\\pi}{6}"],
            shift: { inner: "x + \\frac{\\pi}{3}", range: "\\left[\\frac{\\pi}{3}, \\frac{4\\pi}{3}\\right)", zero: "\\pi" },
          },
          {
            expr: "\\tan(2x) = \\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{12}, \\frac{7\\pi}{12}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{12}, \\frac{5\\pi}{12}", "\\frac{\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ for $${v} \\in [0, \\pi)$.`, `在 $${v} \\in [0, \\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          transformed(item.expr, v, 180),
          transformedReasons(item.expr, v, 180, item.wrong),
        );
      },
    },
    {
      id: "solve-transformed-tangent-degrees",
      title: t("Solve transformed tangent equations in degrees", "在角度制下求解变换正切方程"),
      figure: remainingDrawings6["trigonometric-equations-containing-transformed-tangent-functions#solve-transformed-tangent-degrees"],
      explanation: t(
        "Treat the shifted angle as a single unknown, find its value with the given tangent, and then add the shift back, keeping the answers inside the interval. To solve $\\tan(x^{\\circ} - \\varphi^{\\circ}) = c$ on $[0, 180)$, find the principal angle in $[0, 180)$ and shift by $\\varphi$.\n\nFor $\\tan(x^{\\circ} + 15^{\\circ}) = 1$ on $[0, 180)$, let $w = x + 15$, which runs over $[15, 195)$. There tangent is $1$ only at $w = 45$, since $225$ is past $195$, so $x = 30$. Check: $\\tan(30^{\\circ} + 15^{\\circ}) = \\tan(45^{\\circ}) = 1$.\n\n> **Watch out.** Tangent repeats every $180^{\\circ}$, so an interval of length $180$ holds exactly one solution; two answers $90$ apart, such as $30$ and $120$, cannot both be right.",
        "把平移后的角看作一个未知数，求出正切为给定值的角，再加回平移量，并使答案保持在区间内。在 $[0, 180)$ 上求解 $\\tan(x^{\\circ} - \\varphi^{\\circ}) = c$ 时，先求出主值角并加上偏移量 $\\varphi$。\n\n在 $[0, 180)$ 上解 $\\tan(x^{\\circ} + 15^{\\circ}) = 1$，设 $w = x + 15$，它取遍 $[15, 195)$。在这个范围内正切只在 $w = 45$ 处等于 $1$，因为 $225$ 已超过 $195$，所以 $x = 30$。检验：$\\tan(30^{\\circ} + 15^{\\circ}) = \\tan(45^{\\circ}) = 1$。\n\n> **注意。** 正切每 $180^{\\circ}$ 重复一次，所以长度为 $180$ 的区间里恰好有一个解；相差 $90$ 的两个答案，比如 $30$ 和 $120$，不可能都对。",
      ),
      generate(rng) {
        const shift = rng.pick([5, 10, 15, 20, 25]);
        const sign = rng.pick([1, -1]);
        const item = rng.pick([
          { val: "1", base: 45 },
          { val: "-1", base: 135 },
          { val: "\\sqrt{3}", base: 60 },
          { val: "-\\sqrt{3}", base: 120 },
          { val: "\\frac{\\sqrt{3}}{3}", base: 30 },
          { val: "-\\frac{\\sqrt{3}}{3}", base: 150 },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const shiftLatex = sign === 1 ? `${v}^{\\circ} - ${shift}^{\\circ}` : `${v}^{\\circ} + ${shift}^{\\circ}`;
        const ans = item.base + sign * shift;
        return solutionsProblem({
          prompt: t(
            `Solve $\\tan(${shiftLatex}) = ${item.val}$ for $${v} \\in [0, 180)$.`,
            `在 $${v} \\in [0, 180)$ 上解方程 $\\tan(${shiftLatex}) = ${item.val}$。`,
          ),
          variable: v,
          values: [String(ans)],
          wrong: [[String(item.base - sign * shift)], [String(item.base)], [String(ans + 90)]],
          solution: shiftedDegrees({ fn: "tan", v, sign, shift, val: item.val, hi: 180, inside: shiftLatex }),
        });
      },
    },
  ],
};

// ─── 4.15.1 Solving using sin-cos-tan identity ──────────────────────────────

/** solvingTrigonometricEquationsUsingTheSinCosTanIdentity covers dividing by cos(x). */
export const solvingTrigonometricEquationsUsingTheSinCosTanIdentity: TopicDef = {
  id: "solving-trigonometric-equations-using-the-sin-cos-tan-identity",
  title: t("Solving Trigonometric Equations Using the Sin-Cos-Tan Identity", "利用商数关系求解三角方程"),
  summary: t(
    "Solve equations involving both sine and cosine such as A sin(x) = B cos(x) by dividing by cos(x) to form a tangent equation.",
    "通过两边同除以 cos(x) 化为正切方程，求解形如 A sin(x) = B cos(x) 的三角方程。",
  ),
  prerequisites: [
    "elementary-trigonometric-equations-containing-tangent",
    "writing-sums-of-trigonometric-functions-in-amplitude-phase-form",
  ],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-tangent", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\sin x = \\sqrt{3}\\cos x$ on $[0, 2\\pi)$. Where $\\cos x = 0$, $\\sin x = \\pm 1$, so the left side is not zero while the right side is; those angles are not solutions. Everywhere else we may divide by $\\cos x$:

$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$

Check: at $\\frac{\\pi}{3}$, $\\sin x = \\frac{\\sqrt{3}}{2}$ and $\\sqrt{3}\\cos x = \\sqrt{3} \\cdot \\frac{1}{2} = \\frac{\\sqrt{3}}{2}$.

In this lesson we solve equations between multiples of sine and cosine by turning them into tangent equations.`,
    `在 $[0, 2\\pi)$ 上求解 $\\sin x = \\sqrt{3}\\cos x$。在 $\\cos x = 0$ 处 $\\sin x = \\pm 1$，左边不为零而右边为零，所以这些角不是解。在其他地方都可以除以 $\\cos x$：

$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$

检验：在 $\\frac{\\pi}{3}$ 处，$\\sin x = \\frac{\\sqrt{3}}{2}$，而 $\\sqrt{3}\\cos x = \\sqrt{3} \\cdot \\frac{1}{2} = \\frac{\\sqrt{3}}{2}$。

这节课我们把正弦与余弦倍数之间的方程化成正切方程来求解。`,
  ),
  knowledgePoints: [
    {
      id: "divide-by-cosine-to-tangent",
      title: t("Convert A sin(x) = B cos(x) into tan(x) = B/A", "将 A sin(x) = B cos(x) 化为 tan(x) = B/A"),
      explanation: t(
        "When an equation compares a multiple of sine with a multiple of cosine, dividing by cosine leaves a single tangent equation, which is easier to solve. Divide both sides by $\\cos x$ (noting $\\cos x \\ne 0$):\n\n$$\\sin x = \\cos x \\implies \\frac{\\sin x}{\\cos x} = 1 \\implies \\tan x = 1 \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\n$$\\sin x + \\sqrt{3}\\cos x = 0 \\implies \\tan x = -\\sqrt{3} \\implies x = \\frac{2\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\nFor $\\sqrt{3}\\sin x + \\cos x = 0$, dividing by $\\cos x$ gives $\\sqrt{3}\\tan x + 1 = 0$, so $\\tan x = -\\frac{\\sqrt{3}}{3}$ and $x = \\frac{5\\pi}{6}, \\frac{11\\pi}{6}$. Check: at $\\frac{5\\pi}{6}$, $\\sqrt{3} \\cdot \\frac{1}{2} + \\left(-\\frac{\\sqrt{3}}{2}\\right) = 0$.\n\n> **Watch out.** Dividing by $\\cos x$ is safe here only because $\\cos x = 0$ forces $\\sin x = \\pm 1$, so no solution is lost. In $\\sin x \\cos x = \\cos x$ the angles with $\\cos x = 0$ are solutions, and dividing would lose them; factor instead.",
        "当方程比较正弦的倍数与余弦的倍数时，两边除以余弦就只剩一个正切方程，更容易求解。两边同除以 $\\cos x$（注意 $\\cos x \\ne 0$）：\n\n$$\\sin x = \\cos x \\implies \\frac{\\sin x}{\\cos x} = 1 \\implies \\tan x = 1 \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\n$$\\sin x + \\sqrt{3}\\cos x = 0 \\implies \\tan x = -\\sqrt{3} \\implies x = \\frac{2\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n对于 $\\sqrt{3}\\sin x + \\cos x = 0$，除以 $\\cos x$ 得 $\\sqrt{3}\\tan x + 1 = 0$，所以 $\\tan x = -\\frac{\\sqrt{3}}{3}$，$x = \\frac{5\\pi}{6}, \\frac{11\\pi}{6}$。检验：在 $\\frac{5\\pi}{6}$ 处，$\\sqrt{3} \\cdot \\frac{1}{2} + \\left(-\\frac{\\sqrt{3}}{2}\\right) = 0$。\n\n> **注意。** 这里能除以 $\\cos x$，只是因为 $\\cos x = 0$ 时 $\\sin x = \\pm 1$，不会丢解。在 $\\sin x \\cos x = \\cos x$ 中，使 $\\cos x = 0$ 的角都是解，除以它就会丢掉这些解，应改用因式分解。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\sin x = \\cos x",
            tan: "1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}"],
          },
          {
            expr: "\\sin x = -\\cos x",
            tan: "-1",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "0, \\pi"],
          },
          {
            expr: "\\sin x - \\sqrt{3}\\cos x = 0",
            tan: "\\sqrt{3}",
            ans: "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "\\sin x + \\sqrt{3}\\cos x = 0",
            tan: "-\\sqrt{3}",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            expr: "\\sqrt{3}\\sin x - \\cos x = 0",
            tan: "\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}"],
          },
          {
            expr: "\\sqrt{3}\\sin x + \\cos x = 0",
            tan: "-\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            expr: "3\\sin x - 3\\cos x = 0",
            tan: "1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}", "0, \\pi"],
          },
          {
            expr: "2\\sin x + 2\\sqrt{3}\\cos x = 0",
            tan: "-\\sqrt{3}",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ for $${v} \\in [0, 2\\pi)$.`, `在 $${v} \\in [0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          tangentFrom({ v, eq: promptExpr, tan: item.tan, unit: "rad" }),
          balanceReasons(v, item.tan, item.wrong),
        );
      },
    },
    {
      id: "solve-sin-cos-tan-identity-degrees",
      title: t("Solve A sin(x) = B cos(x) in degrees on [0°, 360°)", "在 [0°, 360°) 上利用商数关系求解（角度制）"),
      explanation: t(
        "Before dividing, check that the values where cosine is zero are not solutions, since dividing by cosine would lose them. Divide both sides by $\\cos(x^{\\circ})$ to obtain $\\tan(x^{\\circ}) = \\frac{B}{A}$, then find all solutions in $[0, 360)$.\n\nFor $\\sin(x^{\\circ}) + \\cos(x^{\\circ}) = 0$, dividing by $\\cos(x^{\\circ})$ gives $\\tan(x^{\\circ}) = -1$, so $x = 135, 315$. Check: $\\sin(135^{\\circ}) = \\frac{\\sqrt{2}}{2}$ and $\\cos(135^{\\circ}) = -\\frac{\\sqrt{2}}{2}$, which add to $0$.\n\n> **Watch out.** A common coefficient cancels: $5\\sin(x^{\\circ}) = 5\\cos(x^{\\circ})$ gives $\\tan(x^{\\circ}) = 1$, not $\\tan(x^{\\circ}) = 5$. And the two solutions are $180$ apart, so $45$ and $135$ cannot both be right.",
        "在相除之前，先检查使余弦为零的值是不是解，因为除以余弦会丢掉这些值。两边同除以 $\\cos(x^{\\circ})$ 得到 $\\tan(x^{\\circ}) = \\frac{B}{A}$，再求出 $[0, 360)$ 内的所有解。\n\n对于 $\\sin(x^{\\circ}) + \\cos(x^{\\circ}) = 0$，除以 $\\cos(x^{\\circ})$ 得 $\\tan(x^{\\circ}) = -1$，所以 $x = 135, 315$。检验：$\\sin(135^{\\circ}) = \\frac{\\sqrt{2}}{2}$，$\\cos(135^{\\circ}) = -\\frac{\\sqrt{2}}{2}$，两者之和是 $0$。\n\n> **注意。** 公共系数会约掉：$5\\sin(x^{\\circ}) = 5\\cos(x^{\\circ})$ 化为 $\\tan(x^{\\circ}) = 1$，而不是 $\\tan(x^{\\circ}) = 5$。而且两个解相差 $180$，所以 $45$ 和 $135$ 不可能都对。",
      ),
      generate(rng) {
        const coeff = rng.pick([1, 2, 3, 5]);
        const cStr = coeff === 1 ? "" : `${coeff}`;
        const item = rng.pick([
          {
            expr: `${cStr}\\sin(x^{\\circ}) = ${cStr}\\cos(x^{\\circ})`,
            tanVal: "1",
            ans: ["45", "225"],
            wrong: [
              ["45", "135"],
              ["135", "315"],
              ["45", "315"],
            ],
          },
          {
            expr: `${cStr}\\sin(x^{\\circ}) = -${cStr}\\cos(x^{\\circ})`,
            tanVal: "-1",
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["135", "225"],
              ["225", "315"],
            ],
          },
          {
            expr: `${cStr}\\sin(x^{\\circ}) - ${cStr}\\sqrt{3}\\cos(x^{\\circ}) = 0`,
            tanVal: "\\sqrt{3}",
            ans: ["60", "240"],
            wrong: [
              ["30", "210"],
              ["60", "120"],
              ["120", "300"],
            ],
          },
          {
            expr: `${cStr}\\sin(x^{\\circ}) + ${cStr}\\sqrt{3}\\cos(x^{\\circ}) = 0`,
            tanVal: "-\\sqrt{3}",
            ans: ["120", "300"],
            wrong: [
              ["60", "240"],
              ["150", "330"],
              ["240", "300"],
            ],
          },
          {
            expr: `${cStr}\\sqrt{3}\\sin(x^{\\circ}) - ${cStr}\\cos(x^{\\circ}) = 0`,
            tanVal: "\\frac{\\sqrt{3}}{3}",
            ans: ["30", "210"],
            wrong: [
              ["60", "240"],
              ["30", "150"],
              ["150", "330"],
            ],
          },
          {
            expr: `${cStr}\\sqrt{3}\\sin(x^{\\circ}) + ${cStr}\\cos(x^{\\circ}) = 0`,
            tanVal: "-\\frac{\\sqrt{3}}{3}",
            ans: ["150", "330"],
            wrong: [
              ["30", "210"],
              ["120", "300"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: tangentFrom({ v, eq: promptExpr, tan: item.tanVal, unit: "deg" }),
        });
      },
    },
  ],
};

// ─── 4.15.2 Solving using zero-product property ─────────────────────────────

/** solvingTrigonometricEquationsUsingTheZeroProductProperty covers factored equations. */
export const solvingTrigonometricEquationsUsingTheZeroProductProperty: TopicDef = {
  id: "solving-trigonometric-equations-using-the-zero-product-property",
  title: t("Solving Trigonometric Equations Using the Zero-Product Property", "利用零乘积性质求解三角方程"),
  summary: t(
    "Factor expressions such as 2 sin(x) cos(x) - sin(x) = 0 and solve each factor independently.",
    "通过因式分解（例如 2 sin(x) cos(x) - sin(x) = 0）并分别令各因式为零求解三角方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-cosine"],
  encompasses: [
    { topic: "elementary-trigonometric-equations-containing-sine", weight: 0.3 },
    { topic: "elementary-trigonometric-equations-containing-cosine", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $2\\sin x\\cos x - \\sin x = 0$ on $[0, 2\\pi)$. Factor out $\\sin x$:

$$\\sin x(2\\cos x - 1) = 0$$

A product is zero exactly when a factor is: $\\sin x = 0$ gives $x = 0, \\pi$, and $\\cos x = \\frac{1}{2}$ gives $x = \\frac{\\pi}{3}, \\frac{5\\pi}{3}$.

Check: at $\\frac{\\pi}{3}$, $2 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{1}{2} - \\frac{\\sqrt{3}}{2} = 0$. Dividing by $\\sin x$ instead would have lost $0$ and $\\pi$.

In this lesson we solve trigonometric equations by factoring them and solving each factor.`,
    `在 $[0, 2\\pi)$ 上求解 $2\\sin x\\cos x - \\sin x = 0$。提出 $\\sin x$：

$$\\sin x(2\\cos x - 1) = 0$$

乘积为零当且仅当某个因式为零：由 $\\sin x = 0$ 得 $x = 0, \\pi$，由 $\\cos x = \\frac{1}{2}$ 得 $x = \\frac{\\pi}{3}, \\frac{5\\pi}{3}$。

检验：在 $\\frac{\\pi}{3}$ 处，$2 \\cdot \\frac{\\sqrt{3}}{2} \\cdot \\frac{1}{2} - \\frac{\\sqrt{3}}{2} = 0$。如果改为除以 $\\sin x$，就会丢掉 $0$ 和 $\\pi$。

这节课我们通过因式分解、分别令每个因式为零来求解三角方程。`,
  ),
  knowledgePoints: [
    {
      id: "factor-and-zero-product-trig",
      title: t("Factoring trigonometric equations", "分解因式求解三角方程"),
      explanation: t(
        "Never divide both sides by a trigonometric factor, because that loses solutions; instead factor it out and set each factor equal to zero. Factor out common factors:\n\n$$2\\sin x\\cos x - \\cos x = 0 \\implies \\cos x(2\\sin x - 1) = 0$$\n\n$$\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\qquad \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$\n\nFor $\\cos^2 x - \\cos x = 0$: $\\cos x(\\cos x - 1) = 0$, so $\\cos x = 0$ or $\\cos x = 1$, and $x = 0, \\frac{\\pi}{2}, \\frac{3\\pi}{2}$. Check: at $x = 0$, $1^2 - 1 = 0$.\n\n> **Watch out.** Dividing $\\sin^2 x = \\sin x$ by $\\sin x$ leaves $\\sin x = 1$ and loses $x = 0$ and $x = \\pi$, where $\\sin x = 0$.",
        "不要把两边同除以一个三角因式，因为那样会丢掉解；应把它提出来，令每个因式等于零。提出公因式：\n\n$$2\\sin x\\cos x - \\cos x = 0 \\implies \\cos x(2\\sin x - 1) = 0$$\n\n$$\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\qquad \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$\n\n对于 $\\cos^2 x - \\cos x = 0$：$\\cos x(\\cos x - 1) = 0$，所以 $\\cos x = 0$ 或 $\\cos x = 1$，$x = 0, \\frac{\\pi}{2}, \\frac{3\\pi}{2}$。检验：在 $x = 0$ 处，$1^2 - 1 = 0$。\n\n> **注意。** 把 $\\sin^2 x = \\sin x$ 两边除以 $\\sin x$，只剩 $\\sin x = 1$，就丢掉了使 $\\sin x = 0$ 的 $x = 0$ 和 $x = \\pi$。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "2\\sin x\\cos x - \\cos x = 0",
            fac: "\\cos x(2\\sin x - 1) = 0",
            parts: [
              ["cos", "0"],
              ["sin", "\\frac{1}{2}"],
            ] as const,
            ans: "\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}",
            wrong: [
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
              "\\frac{\\pi}{2}, \\frac{3\\pi}{2}",
              "\\frac{\\pi}{3}, \\frac{\\pi}{2}, \\frac{2\\pi}{3}",
            ],
          },
          {
            expr: "2\\sin x\\cos x + \\cos x = 0",
            fac: "\\cos x(2\\sin x + 1) = 0",
            parts: [
              ["cos", "0"],
              ["sin", "-\\frac{1}{2}"],
            ] as const,
            ans: "\\frac{\\pi}{2}, \\frac{7\\pi}{6}, \\frac{3\\pi}{2}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
              "\\frac{\\pi}{2}, \\frac{3\\pi}{2}",
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{\\pi}{2}",
            ],
          },
          {
            expr: "2\\sin x\\cos x - \\sin x = 0",
            fac: "\\sin x(2\\cos x - 1) = 0",
            parts: [
              ["sin", "0"],
              ["cos", "\\frac{1}{2}"],
            ] as const,
            ans: "0, \\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}",
            wrong: ["0, \\pi", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, 0"],
          },
          {
            expr: "2\\sin x\\cos x + \\sin x = 0",
            fac: "\\sin x(2\\cos x + 1) = 0",
            parts: [
              ["sin", "0"],
              ["cos", "-\\frac{1}{2}"],
            ] as const,
            ans: "0, \\frac{2\\pi}{3}, \\pi, \\frac{4\\pi}{3}",
            wrong: ["0, \\pi", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}"],
          },
          {
            expr: "\\sin^2 x - \\sin x = 0",
            fac: "\\sin x(\\sin x - 1) = 0",
            parts: [
              ["sin", "0"],
              ["sin", "1"],
            ] as const,
            ans: "0, \\frac{\\pi}{2}, \\pi",
            wrong: ["0, \\pi", "\\frac{\\pi}{2}", "0, \\frac{\\pi}{2}"],
          },
          {
            expr: "\\cos^2 x - \\cos x = 0",
            fac: "\\cos x(\\cos x - 1) = 0",
            parts: [
              ["cos", "0"],
              ["cos", "1"],
            ] as const,
            ans: "0, \\frac{\\pi}{2}, \\frac{3\\pi}{2}",
            wrong: ["0, \\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0"],
          },
          {
            expr: "2\\cos^2 x - \\cos x = 0",
            fac: "\\cos x(2\\cos x - 1) = 0",
            parts: [
              ["cos", "0"],
              ["cos", "\\frac{1}{2}"],
            ] as const,
            ans: "\\frac{\\pi}{3}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\frac{\\pi}{6}, \\frac{\\pi}{2}"],
          },
          {
            expr: "2\\sin^2 x - \\sin x = 0",
            fac: "\\sin x(2\\sin x - 1) = 0",
            parts: [
              ["sin", "0"],
              ["sin", "\\frac{1}{2}"],
            ] as const,
            ans: "0, \\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\pi",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "0, \\pi", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          factored({ v, unit: "rad", fac: item.fac.replaceAll("x", v), parts: item.parts }),
          factoredReasons(v, item.parts, item.wrong),
        );
      },
    },
    {
      id: "solve-zero-product-trig-degrees",
      title: t("Solve factored trigonometric equations in degrees", "在角度制下分解因式求解三角方程"),
      explanation: t(
        "Each factor gives its own elementary equation, and the solutions of the original equation are all the solutions of these equations taken together. Factor the equation into a product equal to zero and collect all degree solutions on $[0, 360)$.\n\nFor $2\\sin(x^{\\circ})\\cos(x^{\\circ}) + \\cos(x^{\\circ}) = 0$: $\\cos(x^{\\circ})(2\\sin(x^{\\circ}) + 1) = 0$, so $x = 90, 270$ from the first factor and $x = 210, 330$ from the second. Check: at $210$, $2 \\cdot \\left(-\\frac{1}{2}\\right) \\cdot \\left(-\\frac{\\sqrt{3}}{2}\\right) - \\frac{\\sqrt{3}}{2} = 0$.\n\n> **Watch out.** A number factor such as the $3$ in $3\\sin(x^{\\circ})(\\sin(x^{\\circ}) - 1) = 0$ is never zero, so it gives no solutions; only the factors that contain the function do.",
        "每个因式都给出一个基本方程，原方程的解就是这些方程的所有解合在一起。将方程分解因式后令各因式等于零，合并 $[0, 360)$ 上的全部角度解。\n\n对于 $2\\sin(x^{\\circ})\\cos(x^{\\circ}) + \\cos(x^{\\circ}) = 0$：$\\cos(x^{\\circ})(2\\sin(x^{\\circ}) + 1) = 0$，由第一个因式得 $x = 90, 270$，由第二个因式得 $x = 210, 330$。检验：在 $210$ 处，$2 \\cdot \\left(-\\frac{1}{2}\\right) \\cdot \\left(-\\frac{\\sqrt{3}}{2}\\right) - \\frac{\\sqrt{3}}{2} = 0$。\n\n> **注意。** 像 $3\\sin(x^{\\circ})(\\sin(x^{\\circ}) - 1) = 0$ 中的数字因数 $3$ 永远不为零，不给出解；只有含函数的因式才给出解。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) = 0`,
            fac: `${kStr}\\cos(x^{\\circ})(2\\sin(x^{\\circ}) - 1) = 0`,
            parts: [
              ["cos", "0"],
              ["sin", "\\frac{1}{2}"],
            ] as const,
            ans: ["30", "90", "150", "270"],
            wrong: [
              ["30", "150"],
              ["90", "270"],
              ["60", "90", "120"],
            ],
          },
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) + ${kStr}\\cos(x^{\\circ}) = 0`,
            fac: `${kStr}\\cos(x^{\\circ})(2\\sin(x^{\\circ}) + 1) = 0`,
            parts: [
              ["cos", "0"],
              ["sin", "-\\frac{1}{2}"],
            ] as const,
            ans: ["90", "210", "270", "330"],
            wrong: [
              ["210", "330"],
              ["90", "270"],
              ["30", "90", "150"],
            ],
          },
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) = 0`,
            fac: `${kStr}\\sin(x^{\\circ})(2\\cos(x^{\\circ}) - 1) = 0`,
            parts: [
              ["sin", "0"],
              ["cos", "\\frac{1}{2}"],
            ] as const,
            ans: ["0", "60", "180", "300"],
            wrong: [
              ["0", "180"],
              ["60", "300"],
              ["0", "30", "150"],
            ],
          },
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) + ${kStr}\\sin(x^{\\circ}) = 0`,
            fac: `${kStr}\\sin(x^{\\circ})(2\\cos(x^{\\circ}) + 1) = 0`,
            parts: [
              ["sin", "0"],
              ["cos", "-\\frac{1}{2}"],
            ] as const,
            ans: ["0", "120", "180", "240"],
            wrong: [
              ["0", "180"],
              ["120", "240"],
              ["0", "60", "300"],
            ],
          },
          {
            expr: `${kStr}\\sin^2(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) = 0`,
            fac: `${kStr}\\sin(x^{\\circ})(\\sin(x^{\\circ}) - 1) = 0`,
            parts: [
              ["sin", "0"],
              ["sin", "1"],
            ] as const,
            ans: ["0", "90", "180"],
            wrong: [["0", "180"], ["90"], ["0", "90"]],
          },
          {
            expr: `${kStr}\\cos^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) = 0`,
            fac: `${kStr}\\cos(x^{\\circ})(\\cos(x^{\\circ}) - 1) = 0`,
            parts: [
              ["cos", "0"],
              ["cos", "1"],
            ] as const,
            ans: ["0", "90", "270"],
            wrong: [["0", "180"], ["90", "270"], ["0"]],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) = 0`,
            fac: `${kStr}\\cos(x^{\\circ})(2\\cos(x^{\\circ}) - 1) = 0`,
            parts: [
              ["cos", "0"],
              ["cos", "\\frac{1}{2}"],
            ] as const,
            ans: ["60", "90", "270", "300"],
            wrong: [
              ["60", "300"],
              ["90", "270"],
              ["30", "90"],
            ],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) = 0`,
            fac: `${kStr}\\sin(x^{\\circ})(2\\sin(x^{\\circ}) - 1) = 0`,
            parts: [
              ["sin", "0"],
              ["sin", "\\frac{1}{2}"],
            ] as const,
            ans: ["0", "30", "150", "180"],
            wrong: [
              ["30", "150"],
              ["0", "180"],
              ["60", "120"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${kStr}\\tan(x^{\\circ}) = 0`,
            fac: `${kStr}\\tan(x^{\\circ})(\\tan(x^{\\circ}) - 1) = 0`,
            parts: [
              ["tan", "0"],
              ["tan", "1"],
            ] as const,
            ans: ["0", "45", "180", "225"],
            wrong: [
              ["0", "180"],
              ["45", "225"],
              ["45", "135"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: factored({ v, unit: "deg", fac: item.fac.replaceAll("x", v), parts: item.parts }),
        });
      },
    },
  ],
};

// ─── 4.15.3 Quadratic equations in sine or cosine ───────────────────────────

/** quadraticTrigonometricEquationsContainingSineOrCosine covers quadratic forms. */
export const quadraticTrigonometricEquationsContainingSineOrCosine: TopicDef = {
  id: "quadratic-trigonometric-equations-containing-sine-or-cosine",
  title: t("Quadratic Trigonometric Equations Containing Sine or Cosine", "含正弦或余弦的一元二次三角方程"),
  summary: t(
    "Solve quadratic equations in sin(x) or cos(x), substituting identities such as sin²(x) = 1 - cos²(x) when needed.",
    "求解正弦或余弦的一元二次方程，必要时利用 sin²(x) = 1 - cos²(x) 进行恒等转化。",
  ),
  prerequisites: [
    "solving-trigonometric-equations-using-the-zero-product-property",
    "simplifying-expressions-using-the-pythagorean-identity",
  ],
  encompasses: [{ topic: "solving-trigonometric-equations-using-the-zero-product-property", weight: 0.5 }],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $2\\sin^2 x - \\sin x - 1 = 0$ on $[0, 2\\pi)$. With $t = \\sin x$ this is the quadratic $2t^2 - t - 1 = 0$, which factors:

$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\quad \\text{or} \\quad \\sin x = 1$$

So $x = \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$ from the first value and $x = \\frac{\\pi}{2}$ from the second.

Check: at $\\frac{\\pi}{2}$, $2 \\cdot 1 - 1 - 1 = 0$.

In this lesson we solve quadratic equations in sine or cosine, rewriting with $\\sin^2 x + \\cos^2 x = 1$ when both functions appear.`,
    `在 $[0, 2\\pi)$ 上求解 $2\\sin^2 x - \\sin x - 1 = 0$。令 $t = \\sin x$，它就是二次方程 $2t^2 - t - 1 = 0$，可以分解：

$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\quad \\text{或} \\quad \\sin x = 1$$

由第一个值得 $x = \\frac{7\\pi}{6}, \\frac{11\\pi}{6}$，由第二个值得 $x = \\frac{\\pi}{2}$。

检验：在 $\\frac{\\pi}{2}$ 处，$2 \\cdot 1 - 1 - 1 = 0$。

这节课我们求解正弦或余弦的二次方程；两种函数同时出现时，先用 $\\sin^2 x + \\cos^2 x = 1$ 改写。`,
  ),
  knowledgePoints: [
    {
      id: "solve-quadratic-sin-cos-equations",
      title: t("Solve quadratic equations in sin or cos on [0, 2π)", "在 [0, 2π) 上求解正弦或余弦二次方程"),
      explanation: t(
        "Treat the trigonometric function as the unknown of a quadratic, factor or use the formula, and discard any value outside the range from $-1$ to $1$. For $2\\sin^{2} x - \\sin x - 1 = 0$:\n\n$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\text{ or } \\sin x = 1$$\n\n$$x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}, \\; \\frac{\\pi}{2}$$\n\nFor $2\\cos^2 x + 3\\sin x - 3 = 0$, replace $\\cos^2 x$ by $1 - \\sin^2 x$: $2\\sin^2 x - 3\\sin x + 1 = 0$, so $(2\\sin x - 1)(\\sin x - 1) = 0$ and $x = \\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}$. Check: at $\\frac{\\pi}{6}$, $2 \\cdot \\frac{3}{4} + \\frac{3}{2} - 3 = 0$.\n\n> **Watch out.** A root outside $[-1, 1]$ gives no angle: in $2\\sin^2 x + 3\\sin x - 2 = 0$, the root $\\sin x = -2$ is discarded and only $\\sin x = \\frac{1}{2}$ remains.",
        "把三角函数当作二次方程的未知数，因式分解或用求根公式求解，并舍去不在 −1 到 1 之间的值。对于 $2\\sin^{2} x - \\sin x - 1 = 0$：\n\n$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\text{ 或 } \\sin x = 1$$\n\n$$x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}, \\; \\frac{\\pi}{2}$$\n\n对于 $2\\cos^2 x + 3\\sin x - 3 = 0$，把 $\\cos^2 x$ 换成 $1 - \\sin^2 x$：$2\\sin^2 x - 3\\sin x + 1 = 0$，所以 $(2\\sin x - 1)(\\sin x - 1) = 0$，$x = \\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}$。检验：在 $\\frac{\\pi}{6}$ 处，$2 \\cdot \\frac{3}{4} + \\frac{3}{2} - 3 = 0$。\n\n> **注意。** 不在 $[-1, 1]$ 内的根不给出角：在 $2\\sin^2 x + 3\\sin x - 2 = 0$ 中，根 $\\sin x = -2$ 要舍去，只剩 $\\sin x = \\frac{1}{2}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "2\\sin^2 x - \\sin x - 1 = 0",
            fac: "(2\\sin x + 1)(\\sin x - 1) = 0",
            parts: [
              ["sin", "-\\frac{1}{2}"],
              ["sin", "1"],
            ] as const,
            abc: [2, -1, -1] as const,
            ans: "\\frac{\\pi}{2}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}",
              "\\frac{\\pi}{2}, \\frac{5\\pi}{6}",
              "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
          {
            expr: "2\\sin^2 x + \\sin x - 1 = 0",
            fac: "(2\\sin x - 1)(\\sin x + 1) = 0",
            parts: [
              ["sin", "\\frac{1}{2}"],
              ["sin", "-1"],
            ] as const,
            abc: [2, 1, -1] as const,
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}",
            wrong: ["\\frac{\\pi}{2}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{3\\pi}{2}"],
          },
          {
            expr: "2\\cos^2 x - \\cos x - 1 = 0",
            fac: "(2\\cos x + 1)(\\cos x - 1) = 0",
            parts: [
              ["cos", "-\\frac{1}{2}"],
              ["cos", "1"],
            ] as const,
            abc: [2, -1, -1] as const,
            ans: "0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: [
              "\\pi, \\frac{\\pi}{3}, \\frac{5\\pi}{3}",
              "0, \\frac{\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            ],
          },
          {
            expr: "2\\cos^2 x + \\cos x - 1 = 0",
            fac: "(2\\cos x - 1)(\\cos x + 1) = 0",
            parts: [
              ["cos", "\\frac{1}{2}"],
              ["cos", "-1"],
            ] as const,
            abc: [2, 1, -1] as const,
            ans: "\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}",
            wrong: ["0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\pi"],
          },
          {
            expr: "4\\sin^2 x - 1 = 0",
            fac: "(2\\sin x - 1)(2\\sin x + 1) = 0",
            parts: [
              ["sin", "\\frac{1}{2}"],
              ["sin", "-\\frac{1}{2}"],
            ] as const,
            abc: [4, 0, -1] as const,
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
              "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
          {
            expr: "4\\cos^2 x - 3 = 0",
            fac: "(2\\cos x - \\sqrt{3})(2\\cos x + \\sqrt{3}) = 0",
            parts: [
              ["cos", "\\frac{\\sqrt{3}}{2}"],
              ["cos", "-\\frac{\\sqrt{3}}{2}"],
            ] as const,
            abc: [4, 0, -3] as const,
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{11\\pi}{6}",
              "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}",
            ],
          },
          {
            expr: "2\\cos^2 x + 3\\sin x - 3 = 0",
            pre: ["2(1 - \\sin^2 x) + 3\\sin x - 3 = 0", "2\\sin^2 x - 3\\sin x + 1 = 0"],
            fac: "(2\\sin x - 1)(\\sin x - 1) = 0",
            parts: [
              ["sin", "\\frac{1}{2}"],
              ["sin", "1"],
            ] as const,
            abc: [2, -3, 1] as const,
            ans: "\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{2}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "2\\sin^2 x - \\cos x - 1 = 0",
            pre: ["2(1 - \\cos^2 x) - \\cos x - 1 = 0", "2\\cos^2 x + \\cos x - 1 = 0"],
            fac: "(2\\cos x - 1)(\\cos x + 1) = 0",
            parts: [
              ["cos", "\\frac{1}{2}"],
              ["cos", "-1"],
            ] as const,
            abc: [2, 1, -1] as const,
            ans: "\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}",
            wrong: ["0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "0, \\pi"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          factored({
            v,
            unit: "rad",
            fac: item.fac.replaceAll("x", v),
            parts: item.parts,
            pre: item.pre?.map((l) => l.replaceAll("x", v)),
            check: vieta(item.parts[0][0], v, "rad", item.parts, item.abc),
          }),
          factoredReasons(v, item.parts, item.wrong),
        );
      },
    },
    {
      id: "solve-quadratic-sin-cos-degrees",
      title: t("Solve quadratic equations in sin or cos in degrees", "在角度制下求解正弦或余弦二次方程"),
      figure: remainingDrawings6["quadratic-trigonometric-equations-containing-sine-or-cosine#solve-quadratic-sin-cos-degrees"],
      explanation: t(
        "Solve the quadratic for the function value first, then turn each valid value into angles using reference angles and the signs in each quadrant. Factor the quadratic in $\\sin(x^{\\circ})$ or $\\cos(x^{\\circ})$ and find all degree solutions in $[0, 360)$.\n\nFor $4\\cos^2(x^{\\circ}) - 3 = 0$: $\\cos^2(x^{\\circ}) = \\frac{3}{4}$, so $\\cos(x^{\\circ}) = \\pm \\frac{\\sqrt{3}}{2}$ and $x = 30, 150, 210, 330$. Check: $4 \\cdot \\left(\\frac{\\sqrt{3}}{2}\\right)^2 - 3 = 4 \\cdot \\frac{3}{4} - 3 = 0$.\n\n> **Watch out.** A square root has two signs: $4\\sin^2(x^{\\circ}) = 1$ means $\\sin(x^{\\circ}) = \\frac{1}{2}$ or $\\sin(x^{\\circ}) = -\\frac{1}{2}$, and keeping only the positive root loses $210$ and $330$.",
        "先解二次方程求出函数值，再用参考角和各象限的符号把每个有效值化为角度。对关于 $\\sin(x^{\\circ})$ 或 $\\cos(x^{\\circ})$ 的二次方程分解因式，求出 $[0, 360)$ 内的全部角度解。\n\n对于 $4\\cos^2(x^{\\circ}) - 3 = 0$：$\\cos^2(x^{\\circ}) = \\frac{3}{4}$，所以 $\\cos(x^{\\circ}) = \\pm \\frac{\\sqrt{3}}{2}$，$x = 30, 150, 210, 330$。检验：$4 \\cdot \\left(\\frac{\\sqrt{3}}{2}\\right)^2 - 3 = 4 \\cdot \\frac{3}{4} - 3 = 0$。\n\n> **注意。** 开平方有正负两个值：$4\\sin^2(x^{\\circ}) = 1$ 意味着 $\\sin(x^{\\circ}) = \\frac{1}{2}$ 或 $\\sin(x^{\\circ}) = -\\frac{1}{2}$，只取正根就会丢掉 $210$ 和 $330$。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(2\\sin(x^{\\circ}) + 1)(\\sin(x^{\\circ}) - 1) = 0`,
            parts: [
              ["sin", "-\\frac{1}{2}"],
              ["sin", "1"],
            ] as const,
            abc: [2 * k, -k, -k] as const,
            ans: ["90", "210", "330"],
            wrong: [
              ["30", "150", "270"],
              ["90", "150"],
              ["210", "330"],
            ],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) + ${kStr}\\sin(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(2\\sin(x^{\\circ}) - 1)(\\sin(x^{\\circ}) + 1) = 0`,
            parts: [
              ["sin", "\\frac{1}{2}"],
              ["sin", "-1"],
            ] as const,
            abc: [2 * k, k, -k] as const,
            ans: ["30", "150", "270"],
            wrong: [["90", "210", "330"], ["30", "150"], ["270"]],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(2\\cos(x^{\\circ}) + 1)(\\cos(x^{\\circ}) - 1) = 0`,
            parts: [
              ["cos", "-\\frac{1}{2}"],
              ["cos", "1"],
            ] as const,
            abc: [2 * k, -k, -k] as const,
            ans: ["0", "120", "240"],
            wrong: [
              ["60", "180", "300"],
              ["0", "60", "300"],
              ["120", "240"],
            ],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) + ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(2\\cos(x^{\\circ}) - 1)(\\cos(x^{\\circ}) + 1) = 0`,
            parts: [
              ["cos", "\\frac{1}{2}"],
              ["cos", "-1"],
            ] as const,
            abc: [2 * k, k, -k] as const,
            ans: ["60", "180", "300"],
            wrong: [["0", "120", "240"], ["60", "300"], ["180"]],
          },
          {
            expr: `${4 * k}\\sin^2(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(2\\sin(x^{\\circ}) - 1)(2\\sin(x^{\\circ}) + 1) = 0`,
            parts: [
              ["sin", "\\frac{1}{2}"],
              ["sin", "-\\frac{1}{2}"],
            ] as const,
            abc: [4 * k, 0, -k] as const,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "150"],
              ["210", "330"],
            ],
          },
          {
            expr: `${4 * k}\\cos^2(x^{\\circ}) - ${3 * k} = 0`,
            fac: `${kStr}(2\\cos(x^{\\circ}) - \\sqrt{3})(2\\cos(x^{\\circ}) + \\sqrt{3}) = 0`,
            parts: [
              ["cos", "\\frac{\\sqrt{3}}{2}"],
              ["cos", "-\\frac{\\sqrt{3}}{2}"],
            ] as const,
            abc: [4 * k, 0, -3 * k] as const,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "330"],
              ["150", "210"],
            ],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) + ${3 * k}\\sin(x^{\\circ}) - ${3 * k} = 0`,
            pre: [
              `${2 * k}(1 - \\sin^2(x^{\\circ})) + ${3 * k}\\sin(x^{\\circ}) - ${3 * k} = 0`,
              `${2 * k}\\sin^2(x^{\\circ}) - ${3 * k}\\sin(x^{\\circ}) + ${k} = 0`,
            ],
            fac: `${kStr}(2\\sin(x^{\\circ}) - 1)(\\sin(x^{\\circ}) - 1) = 0`,
            parts: [
              ["sin", "\\frac{1}{2}"],
              ["sin", "1"],
            ] as const,
            abc: [2 * k, -3 * k, k] as const,
            ans: ["30", "90", "150"],
            wrong: [["30", "150"], ["90"], ["60", "120"]],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
            pre: [
              `${2 * k}(1 - \\cos^2(x^{\\circ})) - ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
              `${2 * k}\\cos^2(x^{\\circ}) + ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
            ],
            fac: `${kStr}(2\\cos(x^{\\circ}) - 1)(\\cos(x^{\\circ}) + 1) = 0`,
            parts: [
              ["cos", "\\frac{1}{2}"],
              ["cos", "-1"],
            ] as const,
            abc: [2 * k, k, -k] as const,
            ans: ["60", "180", "300"],
            wrong: [
              ["0", "120", "240"],
              ["60", "300"],
              ["0", "180"],
            ],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${3 * k}\\sin(x^{\\circ}) + ${k} = 0`,
            fac: `${kStr}(2\\sin(x^{\\circ}) - 1)(\\sin(x^{\\circ}) - 1) = 0`,
            parts: [
              ["sin", "\\frac{1}{2}"],
              ["sin", "1"],
            ] as const,
            abc: [2 * k, -3 * k, k] as const,
            ans: ["30", "90", "150"],
            wrong: [
              ["30", "150"],
              ["90", "270"],
              ["60", "90", "120"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: factored({
            v,
            unit: "deg",
            fac: item.fac.replaceAll("x", v),
            parts: item.parts,
            pre: item.pre?.map((l) => l.replaceAll("x", v)),
            check: vieta(item.parts[0][0], v, "deg", item.parts, item.abc),
          }),
        });
      },
    },
  ],
};

// ─── 4.15.4 Quadratic equations in tangent or cotangent ─────────────────────

/** quadraticTrigonometricEquationsContainingTangentOrCotangent covers tangent quadratics. */
export const quadraticTrigonometricEquationsContainingTangentOrCotangent: TopicDef = {
  id: "quadratic-trigonometric-equations-containing-tangent-or-cotangent",
  title: t("Quadratic Trigonometric Equations Containing Tangent or Cotangent", "含正切或余切的一元二次三角方程"),
  summary: t(
    "Solve quadratic equations in tan(x) or cot(x), utilizing identities like 1 + tan²(x) = sec²(x) when appropriate.",
    "求解正切或余切的一元二次三角方程，必要时利用 1 + tan²(x) = sec²(x) 化简。",
  ),
  prerequisites: [
    "quadratic-trigonometric-equations-containing-sine-or-cosine",
    "simplifying-expressions-using-the-secant-tangent-identity",
  ],
  encompasses: [{ topic: "quadratic-trigonometric-equations-containing-sine-or-cosine", weight: 0.3 }],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  intro: t(
    `Solve $\\tan^2 x - 1 = 0$ on $[0, 2\\pi)$. Factor as a difference of squares:

$$(\\tan x - 1)(\\tan x + 1) = 0 \\implies \\tan x = 1 \\quad \\text{or} \\quad \\tan x = -1$$

Tangent takes each value twice per turn, half a turn apart, so $x = \\frac{\\pi}{4}, \\frac{5\\pi}{4}$ and $x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$.

Check: $\\tan\\frac{3\\pi}{4} = -1$, whose square is $1$.

In this lesson we solve quadratic equations in tangent or cotangent, rewriting $\\sec^2 x$ as $1 + \\tan^2 x$ when it appears.`,
    `在 $[0, 2\\pi)$ 上求解 $\\tan^2 x - 1 = 0$。按平方差分解：

$$(\\tan x - 1)(\\tan x + 1) = 0 \\implies \\tan x = 1 \\quad \\text{或} \\quad \\tan x = -1$$

正切每圈两次取到同一个值，相差半圈，所以 $x = \\frac{\\pi}{4}, \\frac{5\\pi}{4}$ 以及 $x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$。

检验：$\\tan\\frac{3\\pi}{4} = -1$，它的平方是 $1$。

这节课我们求解正切或余切的二次方程；出现 $\\sec^2 x$ 时，把它改写成 $1 + \\tan^2 x$。`,
  ),
  knowledgePoints: [
    {
      id: "solve-quadratic-tangent-cotangent-equations",
      title: t("Solve quadratic equations in tangent on [0, 2π)", "在 [0, 2π) 上求解正切二次方程"),
      explanation: t(
        "Tangent can take any real value, so every real root of the quadratic gives solutions, two in each full turn. For $\\tan^{2} x - 3 = 0$:\n\n$$\\tan x = \\pm \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}, \\; \\frac{4\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\nIf mixed with $\\sec^{2} x$, substitute $\\sec^{2} x = 1 + \\tan^{2} x$.\n\nFor $\\sec^2 x + 2\\tan x = 0$: $1 + \\tan^2 x + 2\\tan x = (\\tan x + 1)^2 = 0$, so $\\tan x = -1$ and $x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$. Check: at $\\frac{3\\pi}{4}$, $\\sec^2 x = 2$ and $2\\tan x = -2$, which add to $0$.\n\n> **Watch out.** Each root gives two angles in $[0, 2\\pi)$ that are $\\pi$ apart: $\\tan x = \\sqrt{3}$ gives $\\frac{\\pi}{3}$ and $\\frac{4\\pi}{3}$, not $\\frac{\\pi}{3}$ and $\\frac{2\\pi}{3}$.",
        "正切可以取任意实数值，所以二次方程的每个实根都给出解，每一整周内有两个。对于 $\\tan^{2} x - 3 = 0$：\n\n$$\\tan x = \\pm \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}, \\; \\frac{4\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n若含有 $\\sec^{2} x$，代入 $\\sec^{2} x = 1 + \\tan^{2} x$ 化为二次方程。\n\n对于 $\\sec^2 x + 2\\tan x = 0$：$1 + \\tan^2 x + 2\\tan x = (\\tan x + 1)^2 = 0$，所以 $\\tan x = -1$，$x = \\frac{3\\pi}{4}, \\frac{7\\pi}{4}$。检验：在 $\\frac{3\\pi}{4}$ 处，$\\sec^2 x = 2$，$2\\tan x = -2$，两者之和是 $0$。\n\n> **注意。** 每个根在 $[0, 2\\pi)$ 内给出两个相差 $\\pi$ 的角：$\\tan x = \\sqrt{3}$ 给出 $\\frac{\\pi}{3}$ 和 $\\frac{4\\pi}{3}$，而不是 $\\frac{\\pi}{3}$ 和 $\\frac{2\\pi}{3}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\tan^2 x - 3 = 0",
            fac: "(\\tan x - \\sqrt{3})(\\tan x + \\sqrt{3}) = 0",
            parts: [
              ["tan", "\\sqrt{3}"],
              ["tan", "-\\sqrt{3}"],
            ] as const,
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: [
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
              "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
              "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            ],
          },
          {
            expr: "3\\tan^2 x - 1 = 0",
            fac: "(\\sqrt{3}\\tan x - 1)(\\sqrt{3}\\tan x + 1) = 0",
            parts: [
              ["tan", "\\frac{\\sqrt{3}}{3}"],
              ["tan", "-\\frac{\\sqrt{3}}{3}"],
            ] as const,
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
              "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
          {
            expr: "\\tan^2 x - 1 = 0",
            fac: "(\\tan x - 1)(\\tan x + 1) = 0",
            parts: [
              ["tan", "1"],
              ["tan", "-1"],
            ] as const,
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}"],
          },
          {
            expr: "\\tan^2 x - \\sqrt{3}\\tan x = 0",
            fac: "\\tan x(\\tan x - \\sqrt{3}) = 0",
            parts: [
              ["tan", "0"],
              ["tan", "\\sqrt{3}"],
            ] as const,
            ans: "0, \\frac{\\pi}{3}, \\pi, \\frac{4\\pi}{3}",
            wrong: ["0, \\pi", "\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\pi, \\frac{7\\pi}{6}"],
          },
          {
            expr: "\\sec^2 x + 2\\tan x = 0",
            pre: ["1 + \\tan^2 x + 2\\tan x = 0"],
            fac: "(\\tan x + 1)^2 = 0",
            parts: [["tan", "-1"]] as const,
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "0, \\pi"],
          },
          {
            expr: "2\\sec^2 x + \\tan^2 x - 5 = 0",
            pre: ["2(1 + \\tan^2 x) + \\tan^2 x - 5 = 0", "3\\tan^2 x - 3 = 0"],
            fac: "3(\\tan x - 1)(\\tan x + 1) = 0",
            parts: [
              ["tan", "1"],
              ["tan", "-1"],
            ] as const,
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
            ],
          },
          {
            expr: "\\tan^2 x + (1 - \\sqrt{3})\\tan x - \\sqrt{3} = 0",
            fac: "(\\tan x + 1)(\\tan x - \\sqrt{3}) = 0",
            parts: [
              ["tan", "-1"],
              ["tan", "\\sqrt{3}"],
            ] as const,
            ans: "\\frac{\\pi}{3}, \\frac{3\\pi}{4}, \\frac{4\\pi}{3}, \\frac{7\\pi}{4}",
            wrong: [
              "\\frac{\\pi}{4}, \\frac{\\pi}{3}, \\frac{5\\pi}{4}, \\frac{4\\pi}{3}",
              "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
              "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            ],
          },
          {
            expr: "\\cot^2 x - 3 = 0",
            fac: "(\\cot x - \\sqrt{3})(\\cot x + \\sqrt{3}) = 0",
            parts: [
              ["cot", "\\sqrt{3}"],
              ["cot", "-\\sqrt{3}"],
            ] as const,
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
              "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        const cleanAns = item.ans;
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${cleanAns}$`, `$${v} = ${cleanAns}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          factored({
            v,
            unit: "rad",
            fac: item.fac.replaceAll("x", v),
            parts: item.parts,
            pre: item.pre?.map((l) => l.replaceAll("x", v)),
          }),
          factoredReasons(v, item.parts, item.wrong),
        );
      },
    },
    {
      id: "solve-quadratic-tangent-cotangent-degrees",
      title: t("Solve quadratic equations in tangent or cotangent in degrees", "在角度制下求解正切或余切二次方程"),
      figure:
        remainingDrawings6["quadratic-trigonometric-equations-containing-tangent-or-cotangent#solve-quadratic-tangent-cotangent-degrees"],
      explanation: t(
        "Solve the quadratic for the value of the function, then use the period of $180^{\\circ}$ to list every angle in a full turn. Solve the quadratic equation for $\\tan(x^{\\circ})$ or $\\cot(x^{\\circ})$ and list all degree solutions in $[0, 360)$.\n\nFor $\\cot^2(x^{\\circ}) - 1 = 0$: $\\cot(x^{\\circ}) = \\pm 1$, so $\\tan(x^{\\circ}) = \\pm 1$ and $x = 45, 135, 225, 315$. Check: $\\cot(135^{\\circ}) = \\frac{-\\frac{\\sqrt{2}}{2}}{\\frac{\\sqrt{2}}{2}} = -1$, whose square is $1$.\n\n> **Watch out.** Tangent and cotangent take every real value, so no root is discarded for being too large, unlike with sine and cosine: $\\tan^2(x^{\\circ}) = 3$ has the four solutions $60, 120, 240, 300$.",
        "先解二次方程求出函数值，再利用 180° 的周期写出一整周内的所有角。求出 $\\tan(x^{\\circ})$ 或 $\\cot(x^{\\circ})$ 的二次方程解，并列出 $[0, 360)$ 内的所有角度解。\n\n对于 $\\cot^2(x^{\\circ}) - 1 = 0$：$\\cot(x^{\\circ}) = \\pm 1$，所以 $\\tan(x^{\\circ}) = \\pm 1$，$x = 45, 135, 225, 315$。检验：$\\cot(135^{\\circ}) = \\frac{-\\frac{\\sqrt{2}}{2}}{\\frac{\\sqrt{2}}{2}} = -1$，它的平方是 $1$。\n\n> **注意。** 正切和余切能取任意实数值，所以不会像正弦、余弦那样因为根太大而舍去：$\\tan^2(x^{\\circ}) = 3$ 有 $60, 120, 240, 300$ 四个解。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${3 * k} = 0`,
            fac: `${kStr}(\\tan(x^{\\circ}) - \\sqrt{3})(\\tan(x^{\\circ}) + \\sqrt{3}) = 0`,
            parts: [
              ["tan", "\\sqrt{3}"],
              ["tan", "-\\sqrt{3}"],
            ] as const,
            ans: ["60", "120", "240", "300"],
            wrong: [
              ["30", "150", "210", "330"],
              ["60", "240"],
              ["120", "300"],
            ],
          },
          {
            expr: `${3 * k}\\tan^2(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(\\sqrt{3}\\tan(x^{\\circ}) - 1)(\\sqrt{3}\\tan(x^{\\circ}) + 1) = 0`,
            parts: [
              ["tan", "\\frac{\\sqrt{3}}{3}"],
              ["tan", "-\\frac{\\sqrt{3}}{3}"],
            ] as const,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "210"],
              ["150", "330"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(\\tan(x^{\\circ}) - 1)(\\tan(x^{\\circ}) + 1) = 0`,
            parts: [
              ["tan", "1"],
              ["tan", "-1"],
            ] as const,
            ans: ["45", "135", "225", "315"],
            wrong: [
              ["45", "225"],
              ["135", "315"],
              ["45", "135"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${kStr}\\sqrt{3}\\tan(x^{\\circ}) = 0`,
            fac: `${kStr}\\tan(x^{\\circ})(\\tan(x^{\\circ}) - \\sqrt{3}) = 0`,
            parts: [
              ["tan", "0"],
              ["tan", "\\sqrt{3}"],
            ] as const,
            ans: ["0", "60", "180", "240"],
            wrong: [
              ["0", "180"],
              ["60", "240"],
              ["0", "30", "180", "210"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) + ${kStr}\\sqrt{3}\\tan(x^{\\circ}) = 0`,
            fac: `${kStr}\\tan(x^{\\circ})(\\tan(x^{\\circ}) + \\sqrt{3}) = 0`,
            parts: [
              ["tan", "0"],
              ["tan", "-\\sqrt{3}"],
            ] as const,
            ans: ["0", "120", "180", "300"],
            wrong: [
              ["0", "180"],
              ["120", "300"],
              ["0", "60", "180", "240"],
            ],
          },
          {
            expr: `${kStr}\\sec^2(x^{\\circ}) + ${2 * k}\\tan(x^{\\circ}) = 0`,
            pre: [`${kStr}(1 + \\tan^2(x^{\\circ})) + ${2 * k}\\tan(x^{\\circ}) = 0`],
            fac: `${kStr}(\\tan(x^{\\circ}) + 1)^2 = 0`,
            parts: [["tan", "-1"]] as const,
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["45", "135"],
              ["0", "180"],
            ],
          },
          {
            expr: `${2 * k}\\sec^2(x^{\\circ}) + ${kStr}\\tan^2(x^{\\circ}) - ${5 * k} = 0`,
            pre: [
              `${2 * k}(1 + \\tan^2(x^{\\circ})) + ${kStr}\\tan^2(x^{\\circ}) - ${5 * k} = 0`,
              `${3 * k}\\tan^2(x^{\\circ}) - ${3 * k} = 0`,
            ],
            fac: `${3 * k}(\\tan(x^{\\circ}) - 1)(\\tan(x^{\\circ}) + 1) = 0`,
            parts: [
              ["tan", "1"],
              ["tan", "-1"],
            ] as const,
            ans: ["45", "135", "225", "315"],
            wrong: [
              ["60", "120", "240", "300"],
              ["45", "225"],
              ["30", "150"],
            ],
          },
          {
            expr: `${kStr}\\cot^2(x^{\\circ}) - ${3 * k} = 0`,
            fac: `${kStr}(\\cot(x^{\\circ}) - \\sqrt{3})(\\cot(x^{\\circ}) + \\sqrt{3}) = 0`,
            parts: [
              ["cot", "\\sqrt{3}"],
              ["cot", "-\\sqrt{3}"],
            ] as const,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "210"],
              ["150", "330"],
            ],
          },
          {
            expr: `${kStr}\\cot^2(x^{\\circ}) - ${k} = 0`,
            fac: `${kStr}(\\cot(x^{\\circ}) - 1)(\\cot(x^{\\circ}) + 1) = 0`,
            parts: [
              ["cot", "1"],
              ["cot", "-1"],
            ] as const,
            ans: ["45", "135", "225", "315"],
            wrong: [
              ["45", "225"],
              ["135", "315"],
              ["30", "150"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: factored({
            v,
            unit: "deg",
            fac: item.fac.replaceAll("x", v),
            parts: item.parts,
            pre: item.pre?.map((l) => l.replaceAll("x", v)),
          }),
        });
      },
    },
  ],
};

// ─── Export array: all 15 topics, modules 4.13–4.15 ──────────────────────────

export const precalculusTrigonometricEquationTopics: readonly TopicDef[] = [
  elementaryTrigonometricEquationsContainingSine,
  elementaryTrigonometricEquationsContainingCosine,
  elementaryTrigonometricEquationsContainingTangent,
  elementaryTrigonometricEquationsContainingSecant,
  elementaryTrigonometricEquationsContainingCosecant,
  elementaryTrigonometricEquationsContainingCotangent,
  generalSolutionsOfElementaryTrigonometricEquations,
  generalSolutionsOfTrigonometricEquationsWithTransformedFunctions,
  trigonometricEquationsContainingTransformedSineFunctions,
  trigonometricEquationsContainingTransformedCosineFunctions,
  trigonometricEquationsContainingTransformedTangentFunctions,
  solvingTrigonometricEquationsUsingTheSinCosTanIdentity,
  solvingTrigonometricEquationsUsingTheZeroProductProperty,
  quadraticTrigonometricEquationsContainingSineOrCosine,
  quadraticTrigonometricEquationsContainingTangentOrCotangent,
];
