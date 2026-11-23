import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { explainedChoice, numberProblem, say } from "../problems.ts";
import { type Poly, pAt, pDer, pLatex } from "./calculus-common.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";
import { antiderivativeAt, antiderivativeLatex } from "./calculus-i-riemann.ts";
import { int, intQ, times } from "./calculus-ii-areas.ts";
import { coef } from "./calculus-ii-substitution.ts";

// Calculus II unit 2: Applications of Integration, module 2.12.

/** tL writes a polynomial in t. */
const tL = (p: Poly) => pLatex(p, "t");

/** plus writes "+ n" or "- n" after another term, or nothing for 0. */
const plus = (n: number) => (n === 0 ? "" : n > 0 ? ` + ${n}` : ` - ${-n}`);

/** inP writes a number in parentheses when it is negative. */
const inP = (q: Q | number) => {
  const v = typeof q === "number" ? Q.of(q) : q;
  return v.sign() < 0 ? `\\left(${v.toLatex()}\\right)` : v.toLatex();
};

/** bracketT writes the antiderivative of p evaluated from a to b, with its two values and the result. */
const bracketT = (p: Poly, a: number, b: number) =>
  `\\Big[${antiderivativeLatex(p).replace(/x/g, "t")}\\Big]_{${a}}^{${b}} = ${antiderivativeAt(p, b).toLatex()} - ${inP(antiderivativeAt(p, a))} = ${intQ(p, a, b).toLatex()}`;

/** pAtQ evaluates a polynomial at a rational number. */
const pAtQ = (p: Poly, x: Q) => p.reduceRight((s: Q, c) => s.mul(x).add(Q.of(c)), Q.zero);

/** simpson works the integral of a polynomial of degree at most 3 by Simpson's rule, which is exact for it. */
function simpson(p: Poly, a: number, b: number, f: string): { value: Q; line: string } {
  const m = Q.of(a + b, 2);
  const [fa, fm, fb] = [Q.of(pAt(p, a)), pAtQ(p, m), Q.of(pAt(p, b))];
  const value = fa
    .add(fm.mul(Q.of(4)))
    .add(fb)
    .mul(Q.of(b - a, 6));
  const line = `\\frac{${b - a}}{6}\\Big(${f}(${a}) + 4${f}\\big(${m.toLatex()}\\big) + ${f}(${b})\\Big) = \\frac{${b - a}}{6}\\Big(${fa.toLatex()} + 4 \\cdot ${inP(fm)} + ${inP(fb)}\\Big) = ${value.toLatex()}`;
  return { value, line };
}

/** over divides a rational number by a whole number, with a division sign when the number is a fraction. */
const over = (q: Q, n: number) => (q.isInteger() ? `\\frac{${q.toLatex()}}{${n}}` : `${q.toLatex()} \\div ${n}`);

/** Mistake is a wrong number with what to say about it. */
type Mistake = { readonly value: Q; readonly why: Text };

/** slip is a wrong number with its reason in English and Chinese. */
const slip = (value: Q | number, en: string, zh: string): Mistake => ({
  value: typeof value === "number" ? Q.of(value) : value,
  why: t(en, zh),
});

/** worked asks for a number with a unit and explains it in labelled steps with a check; each wrong value keeps its first reason. */
function worked(
  prompt: Text,
  answer: Q | number,
  unit: string,
  parts: readonly Step[],
  check: Text,
  mistakes: readonly Mistake[],
): Problem {
  const right = typeof answer === "number" ? Q.of(answer) : answer;
  const kept = mistakes.filter((m, i) => !m.value.eq(right) && mistakes.findIndex((n) => n.value.eq(m.value)) === i);
  return numberProblem({ prompt, answer: right, unit, mistakes: kept, solution: walked(parts, check) });
}

/** exactWorked asks for an expression in t and explains it in labelled steps with a check. */
function exactWorked(
  prompt: Text,
  answer: string,
  parts: readonly Step[],
  check: Text,
  mistakes: readonly Said[],
  variable?: string,
): Problem {
  const kept = mistakes.filter((m) => m.response !== answer);
  return functionWith({ prompt, answer, solution: walked(parts, check), ...(variable && { variable }) }, kept);
}

/** particle introduces a particle moving along a line. */
const particle = t(
  "A particle moves along a horizontal line, with $t$ in seconds and distances in meters.",
  "一个质点沿水平直线运动，$t$ 的单位为秒，距离的单位为米。",
);

/** ask joins the setup of a motion problem with its question. */
const ask = (setup: Text, question: Text) =>
  t(`${particle.en} ${setup.en} ${question.en}`, `${particle["zh-CN"]}${setup["zh-CN"]}${question["zh-CN"]}`);

/** randomCubic chooses a cubic position function with integer coefficients and constant term s0. */
function randomCubic(rng: Rng, s0: number): Poly {
  return [s0, rng.int(-6, 6), rng.nonZero(-4, 4), rng.int(-1, 1)];
}

/** velocityAtATime integrates an acceleration to find the velocity at a given time. */
function velocityAtATime(rng: Rng) {
  const v: Poly = [rng.int(-8, 8), rng.int(-6, 6), rng.nonZero(-3, 3), rng.int(0, 1)];
  const a = pDer(v);
  const T = rng.int(1, 5);
  const v0 = v[0] ?? 0;
  const change = intQ(a, 0, T);
  const answer = pAt(v, T);
  return worked(
    ask(
      t(
        `Its acceleration is $a(t) = ${tL(a)}$ m/s², and its initial velocity is $v(0) = ${v0}$ m/s.`,
        `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，初速度为 $v(0) = ${v0}$ 米/秒。`,
      ),
      t(`Find its velocity at $t = ${T}$, in m/s.`, `求它在 $t = ${T}$ 时的速度（米/秒）。`),
    ),
    answer,
    "m/s",
    [
      [
        ["Integrate the acceleration", "对加速度积分"],
        t("The integral of the acceleration is the change in velocity:", "加速度的积分是速度的变化量："),
        [`${int(0, T, `(${tL(a)})`, "t")} = ${bracketT(a, 0, T)}`],
      ],
      [
        ["Add the initial velocity", "加上初速度"],
        t("The velocity at the end is the velocity at the start plus the change:", "末速度等于初速度加上变化量："),
        [`v(${T}) = ${v0} + ${inP(change)} = ${answer}`],
      ],
    ],
    t(
      `Write the velocity as a function: $v(t) = ${tL(v)}$ has $v(0) = ${v0}$ and $v'(t) = ${tL(a)} = a(t)$, so it is the velocity, and $v(${T}) = ${answer}$.`,
      `把速度写成函数：$v(t) = ${tL(v)}$ 满足 $v(0) = ${v0}$ 且 $v'(t) = ${tL(a)} = a(t)$，所以它就是速度，而 $v(${T}) = ${answer}$。`,
    ),
    [
      slip(
        change,
        `This is only the change in velocity, $\\int_{0}^{${T}} a(t) \\, dt$; add the initial velocity $v(0) = ${v0}$.`,
        `这只是速度的变化量 $\\int_{0}^{${T}} a(t) \\, dt$；还要加上初速度 $v(0) = ${v0}$。`,
      ),
      slip(
        pAt(a, T),
        `This is the acceleration at $t = ${T}$, not the velocity; integrate the acceleration from $0$ to $${T}$.`,
        `这是 $t = ${T}$ 时的加速度，不是速度；要把加速度从 $0$ 积到 $${T}$。`,
      ),
      slip(
        v0 + pAt(a, T) * T,
        `This treats the acceleration as constant at its value $a(${T}) = ${pAt(a, T)}$; it changes over $[0, ${T}]$, so integrate it.`,
        `这里把加速度当作常数 $a(${T}) = ${pAt(a, T)}$；它在 $[0, ${T}]$ 上是变化的，所以要积分。`,
      ),
      slip(
        v0 - change.toNumber(),
        "This subtracts the change in velocity; the velocity at the end is $v(0)$ plus the change.",
        "这里减去了速度的变化量；末速度等于 $v(0)$ 加上变化量。",
      ),
    ],
  );
}

/** velocityFunction integrates an acceleration and uses a known velocity to find the constant. */
function velocityFunction(rng: Rng) {
  const kind = rng.int(0, 3);
  const k = rng.nonZero(-5, 5);
  const w = rng.int(-6, 6);
  const ks = coef(Q.of(k));
  const prompt = (a: string, known: string) =>
    ask(
      t(`Its acceleration is $a(t) = ${a}$ m/s², and $${known}$ m/s.`, `它的加速度为 $a(t) = ${a}$ 米/秒²，且 $${known}$ 米/秒。`),
      t("Find its velocity $v(t)$.", "求它的速度 $v(t)$。"),
    );
  if (kind === 0) {
    const answer = `${ks}\\sin t${plus(w)}`;
    return exactWorked(
      prompt(`${ks}\\cos t`, `v(0) = ${w}`),
      answer,
      [
        [
          ["Integrate the acceleration", "对加速度积分"],
          t("Since $(\\sin t)' = \\cos t$:", "因为 $(\\sin t)' = \\cos t$："),
          [`v(t) = \\int ${ks}\\cos t \\, dt = ${ks}\\sin t + C`],
        ],
        [
          ["Use the known velocity", "利用已知速度"],
          t("Put in $t = 0$, where $\\sin 0 = 0$:", "代入 $t = 0$，此时 $\\sin 0 = 0$："),
          [`v(0) = 0 + C = ${w} \\implies v(t) = ${answer}`],
        ],
      ],
      t(
        `Differentiate: $(${answer})' = ${ks}\\cos t = a(t)$, and at $t = 0$ the value is $0${plus(w)} = ${w}$, as given.`,
        `求导：$(${answer})' = ${ks}\\cos t = a(t)$，且 $t = 0$ 时的值为 $0${plus(w)} = ${w}$，与已知相符。`,
      ),
      [
        say(
          `${ks}\\sin t`,
          `This leaves out the constant; $v(0) = ${w}$ makes $C = ${w}$.`,
          `这里漏掉了常数；由 $v(0) = ${w}$ 得 $C = ${w}$。`,
        ),
        say(
          `${coef(Q.of(-k))}\\sin t${plus(w)}`,
          "This takes $\\int \\cos t \\, dt = -\\sin t$; in fact $(\\sin t)' = \\cos t$, so there is no minus sign.",
          "这里认为 $\\int \\cos t \\, dt = -\\sin t$；实际上 $(\\sin t)' = \\cos t$，没有负号。",
        ),
        say(
          `${coef(Q.of(-k))}\\cos t${plus(w + k)}`,
          "This integrates $\\cos t$ as $-\\cos t$, which is the rule for $\\sin t$; the antiderivative of $\\cos t$ is $\\sin t$.",
          "这里把 $\\cos t$ 积成 $-\\cos t$，那是 $\\sin t$ 的积分公式；$\\cos t$ 的原函数是 $\\sin t$。",
        ),
      ],
      "t",
    );
  }
  if (kind === 1) {
    const answer = `${ks}e^{t}${plus(w - k)}`;
    return exactWorked(
      prompt(`${ks}e^{t}`, `v(0) = ${w}`),
      answer,
      [
        [
          ["Integrate the acceleration", "对加速度积分"],
          t("Since $(e^{t})' = e^{t}$:", "因为 $(e^{t})' = e^{t}$："),
          [`v(t) = \\int ${ks}e^{t} \\, dt = ${ks}e^{t} + C`],
        ],
        [
          ["Use the known velocity", "利用已知速度"],
          t("Put in $t = 0$, where $e^{0} = 1$:", "代入 $t = 0$，此时 $e^{0} = 1$："),
          [`v(0) = ${k} + C = ${w} \\implies C = ${w - k}`, `v(t) = ${answer}`],
        ],
      ],
      t(
        `Differentiate: $(${answer})' = ${ks}e^{t} = a(t)$, and at $t = 0$ the value is $${k}${plus(w - k)} = ${w}$, as given.`,
        `求导：$(${answer})' = ${ks}e^{t} = a(t)$，且 $t = 0$ 时的值为 $${k}${plus(w - k)} = ${w}$，与已知相符。`,
      ),
      [
        say(
          `${ks}e^{t}${plus(w)}`,
          `This takes $C = ${w}$, but $e^{0} = 1$, so $v(0) = ${k} + C$ and $C = ${w - k}$.`,
          `这里取 $C = ${w}$，但 $e^{0} = 1$，所以 $v(0) = ${k} + C$，$C = ${w - k}$。`,
        ),
        say(
          `${ks}e^{t}`,
          `This leaves out the constant; $v(0) = ${w}$ makes $C = ${w - k}$.`,
          `这里漏掉了常数；由 $v(0) = ${w}$ 得 $C = ${w - k}$。`,
        ),
        say(
          `${ks}e^{t}${plus(w + k)}`,
          `This solves $${k} + C = ${w}$ by adding $${k}$; subtract it instead, so $C = ${w - k}$.`,
          `解 $${k} + C = ${w}$ 时加上了 $${k}$；应当减去，得 $C = ${w - k}$。`,
        ),
      ],
      "t",
    );
  }
  const v: Poly = [rng.int(-8, 8), rng.int(-6, 6), rng.nonZero(-3, 3)];
  const a = pDer(v);
  const t1 = rng.int(1, 3);
  const vt1 = pAt(v, t1);
  const free: Poly = [0, ...v.slice(1)];
  const C = v[0] ?? 0;
  const answer = tL(v);
  return exactWorked(
    prompt(tL(a), `v(${t1}) = ${vt1}`),
    answer,
    [
      [
        ["Integrate the acceleration", "对加速度积分"],
        t("Integrate term by term:", "逐项积分："),
        [`v(t) = \\int (${tL(a)}) \\, dt = ${tL(free)} + C`],
      ],
      [
        ["Use the known velocity", "利用已知速度"],
        t(`Put in $t = ${t1}$:`, `代入 $t = ${t1}$：`),
        [`v(${t1}) = ${pAt(free, t1)} + C = ${vt1} \\implies C = ${C}`, `v(t) = ${answer}`],
      ],
    ],
    t(
      `Differentiate: $(${answer})' = ${tL(a)} = a(t)$, and $v(${t1}) = ${vt1}$, as given.`,
      `求导：$(${answer})' = ${tL(a)} = a(t)$，且 $v(${t1}) = ${vt1}$，与已知相符。`,
    ),
    [
      say(
        tL(free),
        `This leaves out the constant; $v(${t1}) = ${vt1}$ makes $C = ${C}$.`,
        `这里漏掉了常数；由 $v(${t1}) = ${vt1}$ 得 $C = ${C}$。`,
      ),
      say(
        tL([vt1, ...v.slice(1)]),
        `This uses $${vt1}$ as the constant, as if it were $v(0)$; it is the velocity at $t = ${t1}$, so solve $${pAt(free, t1)} + C = ${vt1}$.`,
        `这里把 $${vt1}$ 当作常数，好像它是 $v(0)$；它是 $t = ${t1}$ 时的速度，应解 $${pAt(free, t1)} + C = ${vt1}$。`,
      ),
      say(
        tL(pDer(a)),
        "This differentiates the acceleration; the velocity is its antiderivative.",
        "这是对加速度求导；速度是加速度的原函数。",
      ),
    ],
    "t",
  );
}

/** calculatingVelocityUsingIntegration recovers velocity from acceleration and an initial condition. */
export const calculatingVelocityUsingIntegration: TopicDef = {
  id: "calculating-velocity-using-integration",
  title: t("Calculating Velocity Using Integration", "用积分计算速度"),
  summary: t(
    "Velocity is an antiderivative of acceleration; a known velocity fixes the constant.",
    "速度是加速度的原函数；已知某时刻的速度可确定常数。",
  ),
  intro: t(
    "A particle starts with velocity $v(0) = 2$ m/s and accelerates at $a(t) = 6t$ m/s². Acceleration is the rate of change of velocity, so the velocity at $t = 3$ is the starting velocity plus the integral of the acceleration:\n\n$$v(3) = 2 + \\int_{0}^{3} 6t \\, dt = 2 + \\Big[3t^{2}\\Big]_{0}^{3} = 2 + 27 = 29 \\text{ m/s}.$$\n\nCheck: $v(t) = 3t^{2} + 2$ has $v(0) = 2$ and $v'(t) = 6t$, and $v(3) = 27 + 2 = 29$.\n\nIn this lesson we integrate an acceleration to find a velocity, at one time or as a function, using a known velocity to fix the constant.",
    "一个质点的初速度为 $v(0) = 2$ 米/秒，加速度为 $a(t) = 6t$ 米/秒²。加速度是速度的变化率，所以 $t = 3$ 时的速度等于初速度加上加速度的积分：\n\n$$v(3) = 2 + \\int_{0}^{3} 6t \\, dt = 2 + \\Big[3t^{2}\\Big]_{0}^{3} = 2 + 27 = 29 \\text{ 米/秒}$$\n\n检验：$v(t) = 3t^{2} + 2$ 满足 $v(0) = 2$ 且 $v'(t) = 6t$，而 $v(3) = 27 + 2 = 29$。\n\n本课我们对加速度积分，求出某一时刻的速度或速度函数，并用已知的速度确定常数。",
  ),
  prerequisites: ["calculating-acceleration-for-straight-line-motion-using-differentiation", "integrating-rates-of-change"],
  encompasses: [{ topic: "integrating-rates-of-change", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "velocity-at-a-given-time",
      figure: calculusDrawings5["calculating-velocity-using-integration#velocity-at-a-given-time"],
      title: t("Velocity at a given time", "求某一时刻的速度"),
      explanation: t(
        "Acceleration is the rate of change of velocity, $a(t) = v'(t)$, so by the net change theorem\n\n$$v(T) = v(0) + \\int_{0}^{T} a(t) \\, dt.$$\n\nFor example, if $a(t) = 6t$ and $v(0) = 2$, then $v(3) = 2 + \\int_{0}^{3} 6t \\, dt = 2 + 27 = 29$ m/s.\n\nCheck: $v(t) = 3t^{2} + 2$ has $v(0) = 2$ and $v'(t) = 6t$, and $v(3) = 29$.\n\n> **Watch out.** The integral of the acceleration is only the change in velocity; add the initial velocity to it.",
        "加速度是速度的变化率，$a(t) = v'(t)$，由净变化定理\n\n$$v(T) = v(0) + \\int_{0}^{T} a(t) \\, dt$$\n\n例如 $a(t) = 6t$，$v(0) = 2$，则 $v(3) = 2 + \\int_{0}^{3} 6t \\, dt = 2 + 27 = 29$ 米/秒。\n\n检验：$v(t) = 3t^{2} + 2$ 满足 $v(0) = 2$ 且 $v'(t) = 6t$，而 $v(3) = 29$。\n\n> **注意。** 加速度的积分只是速度的变化量，还要加上初速度。",
      ),
      generate: velocityAtATime,
    },
    {
      id: "finding-the-velocity-function",
      title: t("Finding the velocity function", "求速度函数"),
      explanation: t(
        "To find $v(t)$ itself, integrate: $v(t) = \\int a(t) \\, dt$, which includes a constant $C$. A known velocity, such as $v(0)$ or $v(1)$, determines $C$.\n\nFor $a(t) = 2\\cos t$ with $v(0) = 3$: $v(t) = 2\\sin t + C$ and $v(0) = C = 3$, so $v(t) = 2\\sin t + 3$.\n\nCheck: $(2\\sin t + 3)' = 2\\cos t$, and at $t = 0$ the value is $0 + 3 = 3$.\n\n> **Watch out.** The constant is not always the given velocity: with $a(t) = 2e^{t}$ and $v(0) = 3$, $v(0) = 2 + C$, so $C = 1$, because $e^{0} = 1$.",
        "要求 $v(t)$ 本身，就对加速度积分：$v(t) = \\int a(t) \\, dt$，其中含常数 $C$。由已知的速度（如 $v(0)$ 或 $v(1)$）确定 $C$。\n\n对 $a(t) = 2\\cos t$、$v(0) = 3$：$v(t) = 2\\sin t + C$，$v(0) = C = 3$，所以 $v(t) = 2\\sin t + 3$。\n\n检验：$(2\\sin t + 3)' = 2\\cos t$，且 $t = 0$ 时的值为 $0 + 3 = 3$。\n\n> **注意。** 常数不一定等于已知的速度：若 $a(t) = 2e^{t}$、$v(0) = 3$，则 $v(0) = 2 + C$，所以 $C = 1$，因为 $e^{0} = 1$。",
      ),
      generate: velocityFunction,
    },
  ],
};

/** restingVelocity is a velocity c(t - p)(t - q) with 0 < p < q, so the particle is first at rest at t = p. */
function restingVelocity(rng: Rng) {
  const p = rng.int(1, 4);
  const q = p + rng.int(1, 4);
  const c = rng.pick([1, 2, 3, -1, -2, -3]);
  const v: Poly = [c * p * q, -c * (p + q), c];
  return { p, q, c, v, a: pDer(v) };
}

/** factoredV writes c(t - p)(t - q). */
const factoredV = (c: number, p: number, q: number) => `${coef(Q.of(c))}(t - ${p})(t - ${q})`;

/** firstAtRest integrates an acceleration and finds when the velocity is first zero. */
function firstAtRest(rng: Rng) {
  const { p, q, c, v, a } = restingVelocity(rng);
  const v0 = v[0] ?? 0;
  const [b1, b0] = [v[1] ?? 0, v0];
  return worked(
    ask(
      t(
        `Its acceleration is $a(t) = ${tL(a)}$ m/s², and $v(0) = ${v0}$ m/s.`,
        `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，且 $v(0) = ${v0}$ 米/秒。`,
      ),
      t("At what time $t > 0$ is the particle first at rest?", "质点在 $t > 0$ 时第一次静止是在什么时刻？"),
    ),
    p,
    "s",
    [
      [
        ["Recover the velocity", "求出速度"],
        t("Integrate the acceleration and add the initial velocity:", "对加速度积分，再加上初速度："),
        [`v(t) = ${v0} + ${int(0, "t", `(${tL(a).replace(/t/g, "u")})`, "u")} = ${tL(v)}`],
      ],
      [
        ["Solve v(t) = 0", "解 v(t) = 0"],
        t("Factor the velocity:", "把速度因式分解："),
        [`${tL(v)} = ${factoredV(c, p, q)} = 0 \\implies t = ${p} \\text{ or } t = ${q}`],
      ],
    ],
    t(
      `Put $t = ${p}$ into the velocity: $${c * p * p} + ${inP(b1 * p)} + ${inP(b0)} = 0$. Before that, for $0 < t < ${p}$, both factors are negative, so $v(t) \\ne 0$; the first rest is at $t = ${p}$ s.`,
      `把 $t = ${p}$ 代入速度：$${c * p * p} + ${inP(b1 * p)} + ${inP(b0)} = 0$。在此之前，$0 < t < ${p}$ 时两个因式都为负，$v(t) \\ne 0$；所以第一次静止在 $t = ${p}$ 秒。`,
    ),
    [
      slip(
        q,
        `This is the second time the particle is at rest; it first rests at the smaller root, $t = ${p}$.`,
        `这是质点第二次静止的时刻；第一次静止在较小的根 $t = ${p}$。`,
      ),
      slip(
        Q.of(p + q, 2),
        `This is where $a(t) = 0$, the turning point of the velocity; the particle is at rest where $v(t) = 0$.`,
        `这是 $a(t) = 0$ 的时刻，即速度的极值点；质点静止要求 $v(t) = 0$。`,
      ),
      slip(
        p * q,
        `This is the product of the two roots, $\\frac{v(0)}{${c}}$; solve $v(t) = 0$ for the roots themselves.`,
        `这是两根之积 $\\frac{v(0)}{${c}}$；要解 $v(t) = 0$ 求出根本身。`,
      ),
    ],
  );
}

/** motions are the four combinations of direction and change in speed. */
const motions: readonly Text[] = [
  t("Moving right and speeding up", "向右运动，且速率在增大"),
  t("Moving right and slowing down", "向右运动，且速率在减小"),
  t("Moving left and speeding up", "向左运动，且速率在增大"),
  t("Moving left and slowing down", "向左运动，且速率在减小"),
];

/** decimal writes a rational number with four decimal places. */
const decimal = (q: Q) => q.toNumber().toFixed(4);

/** directionAndSpeed integrates an acceleration and classifies the motion at a given time. */
function directionAndSpeed(rng: Rng) {
  for (;;) {
    const v: Poly = [rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-3, 3)];
    const a = pDer(v);
    const T = rng.int(1, 5);
    const [vT, aT] = [pAt(v, T), pAt(a, T)];
    if (vT === 0 || aT === 0) continue;
    const right = vT > 0;
    const faster = vT * aT > 0;
    const i = (right ? 0 : 2) + (faster ? 0 : 1);
    const v0 = v[0] ?? 0;
    const h = Q.of(1, 100);
    const [before, after] = [pAtQ(v, Q.of(T).sub(h)).abs(), pAtQ(v, Q.of(T).add(h)).abs()];
    const direction = (r: boolean): Text =>
      r
        ? t(`$v(${T}) = ${vT}$ is positive, so the particle moves right`, `$v(${T}) = ${vT}$ 为正，所以质点向右运动`)
        : t(`$v(${T}) = ${vT}$ is negative, so the particle moves left`, `$v(${T}) = ${vT}$ 为负，所以质点向左运动`);
    const speed = (f: boolean): Text =>
      f
        ? t(`$v$ and $a$ have the same sign, so it is speeding up`, `$v$ 与 $a$ 同号，所以速率在增大`)
        : t(`$v$ and $a$ have opposite signs, so it is slowing down`, `$v$ 与 $a$ 异号，所以速率在减小`);
    const why = (j: number): Text => {
      const r = j < 2;
      const f = j % 2 === 0;
      const parts = [...(r !== right ? [direction(right)] : []), ...(f !== faster ? [speed(faster)] : [])];
      return t(`Not so: ${parts.map((p) => p.en).join(", and ")}.`, `不对：${parts.map((p) => p["zh-CN"]).join("；")}。`);
    };
    return explainedChoice(rng, {
      prompt: ask(
        t(
          `Its acceleration is $a(t) = ${tL(a)}$ m/s², and $v(0) = ${v0}$ m/s.`,
          `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，且 $v(0) = ${v0}$ 米/秒。`,
        ),
        t(`Describe its motion at $t = ${T}$.`, `描述它在 $t = ${T}$ 时的运动。`),
      ),
      correct: motions[i]!,
      wrong: motions.flatMap((m, j) => (j === i ? [] : [{ option: m, why: why(j) }])),
      solution: walked(
        [
          [
            ["Recover the velocity", "求出速度"],
            t("Integrate the acceleration and add the initial velocity:", "对加速度积分，再加上初速度："),
            [`v(t) = ${v0} + \\int_{0}^{t} a(u) \\, du = ${tL(v)}`, `v(${T}) = ${vT}, \\quad a(${T}) = ${aT}`],
          ],
          [
            ["Read the signs", "看符号"],
            t(`${direction(right).en}, and ${speed(faster).en}.`, `${direction(right)["zh-CN"]}；${speed(faster)["zh-CN"]}。`),
          ],
        ],
        t(
          `Compare the speed just before and just after $t = ${T}$: $|v(${T} - 0.01)| = ${decimal(before)}$ and $|v(${T} + 0.01)| = ${decimal(after)}$, so the speed is ${faster ? "rising" : "falling"}, as found.`,
          `比较 $t = ${T}$ 前后片刻的速率：$|v(${T} - 0.01)| = ${decimal(before)}$，$|v(${T} + 0.01)| = ${decimal(after)}$，速率在${faster ? "增大" : "减小"}，与上面一致。`,
        ),
      ),
    });
  }
}

/** determiningCharacteristicsOfMovingObjectsUsingIntegration uses a velocity found by integration to describe the motion. */
export const determiningCharacteristicsOfMovingObjectsUsingIntegration: TopicDef = {
  id: "determining-characteristics-of-moving-objects-using-integration",
  title: t("Determining Characteristics of Moving Objects Using Integration", "用积分确定运动物体的特征"),
  summary: t(
    "Integrate acceleration to get velocity, then find when the object rests, which way it moves and whether it speeds up.",
    "对加速度积分得到速度，再判断物体何时静止、向哪个方向运动、速率是否增大。",
  ),
  intro: t(
    "A particle has acceleration $a(t) = 2t - 6$ and starts with $v(0) = 5$. Integrating gives its velocity:\n\n$$v(t) = 5 + \\int_{0}^{t} (2u - 6) \\, du = t^{2} - 6t + 5 = (t - 1)(t - 5).$$\n\nSo it is at rest at $t = 1$ and $t = 5$. At $t = 2$, $v = -3$ and $a = -2$: it moves left, and since $v$ and $a$ have the same sign it is speeding up.\n\nCheck: $v'(t) = 2t - 6 = a(t)$ and $v(0) = 5$, so the velocity is right; and $|v(1.9)| = 2.79$ while $|v(2.1)| = 3.19$, so the speed is indeed rising at $t = 2$.\n\nIn this lesson we recover a velocity from an acceleration and use it to find when a particle rests, which way it moves and whether it speeds up.",
    "一个质点的加速度为 $a(t) = 2t - 6$，初速度 $v(0) = 5$。积分得到速度：\n\n$$v(t) = 5 + \\int_{0}^{t} (2u - 6) \\, du = t^{2} - 6t + 5 = (t - 1)(t - 5)$$\n\n所以它在 $t = 1$ 和 $t = 5$ 时静止。在 $t = 2$ 时 $v = -3$，$a = -2$：它向左运动，而 $v$ 与 $a$ 同号，所以速率在增大。\n\n检验：$v'(t) = 2t - 6 = a(t)$ 且 $v(0) = 5$，速度正确；又 $|v(1.9)| = 2.79$，$|v(2.1)| = 3.19$，所以 $t = 2$ 时速率确实在增大。\n\n本课我们由加速度求出速度，再用它判断质点何时静止、向哪个方向运动、速率是否增大。",
  ),
  prerequisites: ["calculating-velocity-using-integration"],
  encompasses: [{ topic: "calculating-velocity-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-when-a-particle-is-at-rest",
      title: t("Finding when a particle is at rest", "求质点静止的时刻"),
      explanation: t(
        "A particle is at rest when $v(t) = 0$. Given the acceleration, first recover $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$, then solve $v(t) = 0$. For example, with $a(t) = 2t - 6$ and $v(0) = 5$, the velocity is $t^{2} - 6t + 5 = (t - 1)(t - 5)$, so the particle is first at rest at $t = 1$.\n\nCheck: $v(1) = 1 - 6 + 5 = 0$.\n\n> **Watch out.** Do not solve $a(t) = 0$: that is where the velocity has a turning point, here $t = 3$, where $v(3) = -4$ and the particle is moving.",
        "质点静止当且仅当 $v(t) = 0$。已知加速度时，先求出 $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$，再解 $v(t) = 0$。例如 $a(t) = 2t - 6$，$v(0) = 5$，速度为 $t^{2} - 6t + 5 = (t - 1)(t - 5)$，所以质点在 $t = 1$ 时第一次静止。\n\n检验：$v(1) = 1 - 6 + 5 = 0$。\n\n> **注意。** 不要解 $a(t) = 0$：那是速度的极值点，这里是 $t = 3$，而 $v(3) = -4$，质点正在运动。",
      ),
      generate: firstAtRest,
    },
    {
      id: "direction-and-change-in-speed",
      title: t("Direction and change in speed", "运动方向与速率变化"),
      explanation: t(
        "The sign of $v(t)$ gives the direction: positive means right, negative means left. The particle speeds up when $v$ and $a$ have the same sign and slows down when they have opposite signs.\n\nFor $a(t) = 2t - 6$ and $v(0) = 5$: $v(t) = t^{2} - 6t + 5$. At $t = 2$, $v = -3$ and $a = -2$, so it moves left and speeds up.\n\nCheck: the speed $|v|$ is $2.79$ at $t = 1.9$ and $3.19$ at $t = 2.1$, so it is rising.\n\n> **Watch out.** A negative acceleration does not by itself mean slowing down: when the velocity is negative too, the particle speeds up.",
        "$v(t)$ 的符号给出方向：为正向右，为负向左。$v$ 与 $a$ 同号时速率增大，异号时速率减小。\n\n对 $a(t) = 2t - 6$、$v(0) = 5$：$v(t) = t^{2} - 6t + 5$。在 $t = 2$ 时 $v = -3$，$a = -2$，所以质点向左运动且速率增大。\n\n检验：速率 $|v|$ 在 $t = 1.9$ 时为 $2.79$，在 $t = 2.1$ 时为 $3.19$，确实在增大。\n\n> **注意。** 加速度为负本身并不意味着速率减小：速度也为负时，速率在增大。",
      ),
      generate: directionAndSpeed,
    },
  ],
};

/** positionFunction integrates a velocity and uses a known position to find the constant. */
function positionFunction(rng: Rng) {
  const s = randomCubic(rng, rng.int(-9, 9));
  const v = pDer(s);
  const t1 = rng.int(0, 2);
  const st1 = pAt(s, t1);
  const free: Poly = [0, ...s.slice(1)];
  const answer = tL(s);
  return exactWorked(
    ask(
      t(
        `Its velocity is $v(t) = ${tL(v)}$ m/s, and its position at $t = ${t1}$ is $s(${t1}) = ${st1}$.`,
        `它的速度为 $v(t) = ${tL(v)}$ 米/秒，且 $t = ${t1}$ 时的位置为 $s(${t1}) = ${st1}$。`,
      ),
      t("Find its position $s(t)$.", "求它的位置 $s(t)$。"),
    ),
    answer,
    [
      [
        ["Integrate the velocity", "对速度积分"],
        t("Position is an antiderivative of velocity:", "位置是速度的原函数："),
        [`s(t) = \\int (${tL(v)}) \\, dt = ${tL(free)} + C`],
      ],
      [
        ["Use the known position", "利用已知位置"],
        t(`Put in $t = ${t1}$:`, `代入 $t = ${t1}$：`),
        [`s(${t1}) = ${pAt(free, t1)} + C = ${st1} \\implies C = ${s[0]}`, `s(t) = ${answer}`],
      ],
    ],
    t(
      `Differentiate: $(${answer})' = ${tL(v)} = v(t)$, and $s(${t1}) = ${st1}$, as given.`,
      `求导：$(${answer})' = ${tL(v)} = v(t)$，且 $s(${t1}) = ${st1}$，与已知相符。`,
    ),
    [
      say(
        tL(free),
        `This leaves out the constant; $s(${t1}) = ${st1}$ makes $C = ${s[0]}$.`,
        `这里漏掉了常数；由 $s(${t1}) = ${st1}$ 得 $C = ${s[0]}$。`,
      ),
      say(
        tL([st1, ...s.slice(1)]),
        `This uses $${st1}$ as the constant, as if it were $s(0)$; it is the position at $t = ${t1}$, so solve $${pAt(free, t1)} + C = ${st1}$.`,
        `这里把 $${st1}$ 当作常数，好像它是 $s(0)$；它是 $t = ${t1}$ 时的位置，应解 $${pAt(free, t1)} + C = ${st1}$。`,
      ),
      say(
        tL(pDer(v)),
        "This differentiates the velocity, which gives the acceleration; the position is its antiderivative.",
        "这是对速度求导，得到的是加速度；位置是速度的原函数。",
      ),
    ],
    "t",
  );
}

/** positionFromAcceleration integrates twice to find the position at a given time. */
function positionFromAcceleration(rng: Rng) {
  const s = randomCubic(rng, rng.int(-9, 9));
  const v = pDer(s);
  const a = pDer(v);
  const T = rng.int(1, 4);
  const [s0, v0] = [s[0] ?? 0, v[0] ?? 0];
  const answer = pAt(s, T);
  const vFree: Poly = [0, ...v.slice(1)];
  return worked(
    ask(
      t(
        `Its acceleration is $a(t) = ${tL(a)}$ m/s², with $v(0) = ${v0}$ m/s and $s(0) = ${s0}$ m.`,
        `它的加速度为 $a(t) = ${tL(a)}$ 米/秒²，$v(0) = ${v0}$ 米/秒，$s(0) = ${s0}$ 米。`,
      ),
      t(`Find its position at $t = ${T}$, in meters.`, `求它在 $t = ${T}$ 时的位置（米）。`),
    ),
    answer,
    "m",
    [
      [
        ["Find the velocity", "求速度"],
        t("Integrate the acceleration and use $v(0)$:", "对加速度积分，并利用 $v(0)$："),
        [`v(t) = ${v0} + \\int_{0}^{t} a(u) \\, du = ${v0}${vFree.some((c) => c !== 0) ? ` + (${tL(vFree)})` : ""} = ${tL(v)}`],
      ],
      [
        ["Find the position", "求位置"],
        t("Integrate the velocity and use $s(0)$:", "对速度积分，并利用 $s(0)$："),
        [`s(t) = ${s0} + \\int_{0}^{t} v(u) \\, du = ${tL(s)}`, `s(${T}) = ${answer}`],
      ],
    ],
    t(
      `Differentiate back: $s'(t) = ${tL(v)}$, which is $${v0}$ at $t = 0$, and $s''(t) = ${tL(a)} = a(t)$; also $s(0) = ${s0}$. So the position is right, and $s(${T}) = ${answer}$ m.`,
      `反过来求导：$s'(t) = ${tL(v)}$，在 $t = 0$ 时为 $${v0}$；$s''(t) = ${tL(a)} = a(t)$；且 $s(0) = ${s0}$。所以位置函数正确，$s(${T}) = ${answer}$ 米。`,
    ),
    [
      slip(
        answer - s0,
        `This leaves out the starting position $s(0) = ${s0}$; the integral of the velocity is only the change in position.`,
        `这里漏掉了初始位置 $s(0) = ${s0}$；速度的积分只是位置的变化量。`,
      ),
      slip(
        answer - v0 * T,
        `This leaves out the starting velocity: $v(0) = ${v0}$ adds $${v0} \\cdot ${T}$ to the position by $t = ${T}$.`,
        `这里漏掉了初速度：$v(0) = ${v0}$ 到 $t = ${T}$ 时使位置增加 $${v0} \\cdot ${T}$。`,
      ),
      slip(
        pAt(v, T),
        `This is the velocity at $t = ${T}$; integrate once more to get the position.`,
        `这是 $t = ${T}$ 时的速度；还要再积分一次才得到位置。`,
      ),
      slip(
        Q.of(s0 + v0 * T).add(Q.of(pAt(a, 0) * T * T, 2)),
        `This uses $s(0) + v(0)t + \\frac{1}{2}a(0)t^{2}$, which holds only for a constant acceleration; here $a(t)$ changes.`,
        `这里用了 $s(0) + v(0)t + \\frac{1}{2}a(0)t^{2}$，它只对匀加速运动成立；这里 $a(t)$ 是变化的。`,
      ),
    ],
  );
}

/** calculatingThePositionFunctionOfAParticleUsingIntegration recovers position from velocity or acceleration. */
export const calculatingThePositionFunctionOfAParticleUsingIntegration: TopicDef = {
  id: "calculating-the-position-function-of-a-particle-using-integration",
  title: t("Calculating the Position Function of a Particle Using Integration", "用积分计算质点的位置函数"),
  summary: t(
    "Position is an antiderivative of velocity; from acceleration, integrate twice using v(0) and s(0).",
    "位置是速度的原函数；已知加速度时，利用 v(0) 和 s(0) 积分两次。",
  ),
  intro: t(
    "A particle has velocity $v(t) = 3t^{2} - 4$ and is at $s(1) = 2$. Position is an antiderivative of velocity, so\n\n$$s(t) = \\int (3t^{2} - 4) \\, dt = t^{3} - 4t + C,$$\n\nand $s(1) = 1 - 4 + C = 2$ gives $C = 5$, so $s(t) = t^{3} - 4t + 5$.\n\nCheck: $(t^{3} - 4t + 5)' = 3t^{2} - 4$, and $s(1) = 1 - 4 + 5 = 2$.\n\nIn this lesson we find a position function from a velocity and a known position, and from an acceleration by integrating twice.",
    "一个质点的速度为 $v(t) = 3t^{2} - 4$，且 $s(1) = 2$。位置是速度的原函数，所以\n\n$$s(t) = \\int (3t^{2} - 4) \\, dt = t^{3} - 4t + C$$\n\n由 $s(1) = 1 - 4 + C = 2$ 得 $C = 5$，所以 $s(t) = t^{3} - 4t + 5$。\n\n检验：$(t^{3} - 4t + 5)' = 3t^{2} - 4$，且 $s(1) = 1 - 4 + 5 = 2$。\n\n本课我们由速度和已知位置求位置函数，并由加速度积分两次求位置。",
  ),
  prerequisites: ["calculating-velocity-using-integration"],
  encompasses: [{ topic: "calculating-velocity-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "position-from-velocity",
      title: t("Position from velocity", "由速度求位置"),
      explanation: t(
        "Position is an antiderivative of velocity, and knowing the position at one moment fixes the constant of integration. Since $s'(t) = v(t)$, the position is $s(t) = \\int v(t) \\, dt$, and a known position fixes the constant.\n\nFor $v(t) = 3t^{2} - 4$ with $s(1) = 2$: $s(t) = t^{3} - 4t + C$ and $s(1) = -3 + C = 2$, so $s(t) = t^{3} - 4t + 5$.\n\nCheck: $(t^{3} - 4t + 5)' = 3t^{2} - 4$ and $s(1) = 2$.\n\n> **Watch out.** A position given at $t = 1$ is not the constant: put $t = 1$ into $t^{3} - 4t + C$ and solve for $C$.",
        "位置是速度的原函数，知道某一时刻的位置就能确定积分常数。因为 $s'(t) = v(t)$，位置为 $s(t) = \\int v(t) \\, dt$，由已知位置确定常数。\n\n对 $v(t) = 3t^{2} - 4$、$s(1) = 2$：$s(t) = t^{3} - 4t + C$，$s(1) = -3 + C = 2$，所以 $s(t) = t^{3} - 4t + 5$。\n\n检验：$(t^{3} - 4t + 5)' = 3t^{2} - 4$，且 $s(1) = 2$。\n\n> **注意。** $t = 1$ 时的位置不是常数本身：要把 $t = 1$ 代入 $t^{3} - 4t + C$ 再解出 $C$。",
      ),
      generate: positionFunction,
    },
    {
      id: "position-from-acceleration",
      title: t("Position from acceleration", "由加速度求位置"),
      explanation: t(
        "Each integration loses a constant, so you need both a starting velocity and a starting position to recover the position from the acceleration. Given the acceleration, integrate twice: first $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$, then $s(t) = s(0) + \\int_{0}^{t} v(u) \\, du$. For example, with $a(t) = 6t$, $v(0) = 1$ and $s(0) = 2$: $v(t) = 3t^{2} + 1$ and $s(t) = t^{3} + t + 2$, so $s(2) = 12$.\n\nCheck: $s''(t) = 6t$, $s'(0) = 1$ and $s(0) = 2$.\n\n> **Watch out.** Each integration needs its own initial value: leaving out $v(0)$ loses the term $v(0)t$, and leaving out $s(0)$ loses the starting position.",
        "每次积分都会丢失一个常数，所以要由加速度还原位置，需要初始速度和初始位置两个条件。已知加速度时积分两次：先求 $v(t) = v(0) + \\int_{0}^{t} a(u) \\, du$，再求 $s(t) = s(0) + \\int_{0}^{t} v(u) \\, du$。例如 $a(t) = 6t$，$v(0) = 1$，$s(0) = 2$：$v(t) = 3t^{2} + 1$，$s(t) = t^{3} + t + 2$，所以 $s(2) = 12$。\n\n检验：$s''(t) = 6t$，$s'(0) = 1$，$s(0) = 2$。\n\n> **注意。** 每次积分都需要各自的初始值：漏掉 $v(0)$ 会丢掉 $v(0)t$ 这一项，漏掉 $s(0)$ 会丢掉初始位置。",
      ),
      generate: positionFromAcceleration,
    },
  ],
};

/** polynomialDisplacement integrates a polynomial velocity over an interval. */
function polynomialDisplacement(rng: Rng) {
  const s = randomCubic(rng, 0);
  const v = pDer(s);
  const a = rng.int(0, 3);
  const b = a + rng.int(1, 3);
  const answer = intQ(v, a, b);
  const check = simpson(v, a, b, "v");
  return worked(
    ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find its displacement from $t = ${a}$ to $t = ${b}$, in meters.`, `求它从 $t = ${a}$ 到 $t = ${b}$ 的位移（米）。`),
    ),
    answer,
    "m",
    [
      [
        ["Set up the integral", "列出积分"],
        t("The displacement is the integral of the velocity over the interval:", "位移是速度在这段时间上的积分："),
        [`s(${b}) - s(${a}) = ${int(a, b, `(${tL(v)})`, "t")}`],
      ],
      [["Evaluate", "计算"], t("Use the antiderivative:", "用原函数计算："), [`${int(a, b, `(${tL(v)})`, "t")} = ${bracketT(v, a, b)}`]],
    ],
    t(
      `Simpson's rule is exact for a quadratic, so it gives the same integral from the values of $v$ at the ends and the middle:\n\n$$${check.line}$$`,
      `辛普森公式对二次函数是精确的，所以用 $v$ 在两端和中点的值也得到同样的积分：\n\n$$${check.line}$$`,
    ),
    [
      slip(
        pAt(v, b) - pAt(v, a),
        `This is the change in velocity, $v(${b}) - v(${a})$; the displacement integrates the velocity itself.`,
        `这是速度的变化量 $v(${b}) - v(${a})$；位移是对速度本身积分。`,
      ),
      slip(
        pAt(s, b),
        `This is the antiderivative at $t = ${b}$ only; subtract its value at $t = ${a}$.`,
        `这只是原函数在 $t = ${b}$ 处的值；还要减去它在 $t = ${a}$ 处的值。`,
      ),
      slip(
        answer.neg(),
        "This subtracts in the wrong order, the value at the start minus the value at the end.",
        "这里减反了，用起点的值减终点的值。",
      ),
    ],
  );
}

/** combine writes n + qσ for an integer n and a multiple q of a symbol σ. */
function combine(n: number, q: Q, symbol: string) {
  if (q.isZero()) return `${n}`;
  if (n === 0) return times(q, symbol);
  return `${n} ${q.sign() > 0 ? "+" : "-"} ${times(q.abs(), symbol)}`;
}

/** ct writes the antiderivative ct of a constant c after another term. */
const ct = (c: number) => (c === 0 ? "" : ` ${c > 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}t`);

/** exactDisplacement integrates a trigonometric, exponential or reciprocal velocity exactly. */
function exactDisplacement(rng: Rng) {
  const k = rng.nonZero(-5, 5);
  const c = rng.int(-4, 4);
  const ks = coef(Q.of(k));
  const m = rng.int(2, 6);
  const cases = [
    {
      v: `${ks}\\cos t${plus(c)}`,
      b: "\\frac{\\pi}{2}",
      F: `${ks}\\sin t${ct(c)}`,
      rule: t("Since $(\\sin t)' = \\cos t$:", "因为 $(\\sin t)' = \\cos t$："),
      values: `\\left(${k}${c === 0 ? "" : ` + ${inP(Q.of(c, 2))}\\pi`}\\right) - 0`,
      answer: combine(k, Q.of(c, 2), "\\pi"),
      derivative: `${ks}\\cos t${plus(c)}`,
      mistakes: [
        say(
          combine(-k, Q.of(c, 2), "\\pi"),
          "This takes $\\int \\cos t \\, dt = -\\sin t$; in fact $(\\sin t)' = \\cos t$, so there is no minus sign.",
          "这里认为 $\\int \\cos t \\, dt = -\\sin t$；实际上 $(\\sin t)' = \\cos t$，没有负号。",
        ),
        say(
          `${k}`,
          `This leaves out the constant term: $${c}$ m/s for $\\frac{\\pi}{2}$ seconds adds $${times(Q.of(c, 2), "\\pi")}$ m.`,
          `这里漏掉了常数项：$${c}$ 米/秒持续 $\\frac{\\pi}{2}$ 秒，增加 $${times(Q.of(c, 2), "\\pi")}$ 米。`,
        ),
        say(
          combine(k, Q.of(c), "\\pi"),
          `This evaluates $${c === 0 ? "" : Math.abs(c) === 1 ? "" : Math.abs(c)}t$ at $\\pi$; the interval ends at $\\frac{\\pi}{2}$.`,
          `这里在 $\\pi$ 处计算 $${Math.abs(c) === 1 ? "" : Math.abs(c)}t$；区间的终点是 $\\frac{\\pi}{2}$。`,
        ),
      ],
    },
    {
      v: `${ks}\\sin t${plus(c)}`,
      b: "\\pi",
      F: `${coef(Q.of(-k))}\\cos t${ct(c)}`,
      rule: t("Since $(-\\cos t)' = \\sin t$:", "因为 $(-\\cos t)' = \\sin t$："),
      values: `\\left(${k}${c === 0 ? "" : ` + ${inP(Q.of(c))}\\pi`}\\right) - ${inP(Q.of(-k))}`,
      answer: combine(2 * k, Q.of(c), "\\pi"),
      derivative: `${ks}\\sin t${plus(c)}`,
      mistakes: [
        say(
          combine(0, Q.of(c), "\\pi"),
          "This takes $\\cos \\pi = \\cos 0$; in fact $\\cos \\pi = -1$, so the sine part gives $2$ times its coefficient.",
          "这里认为 $\\cos \\pi = \\cos 0$；实际上 $\\cos \\pi = -1$，所以正弦部分给出系数的 $2$ 倍。",
        ),
        say(
          combine(k, Q.of(c), "\\pi"),
          "This takes $\\cos \\pi = 0$; in fact $\\cos \\pi = -1$.",
          "这里认为 $\\cos \\pi = 0$；实际上 $\\cos \\pi = -1$。",
        ),
        say(
          combine(-2 * k, Q.of(c), "\\pi"),
          "This takes $\\int \\sin t \\, dt = \\cos t$; the antiderivative is $-\\cos t$.",
          "这里认为 $\\int \\sin t \\, dt = \\cos t$；原函数是 $-\\cos t$。",
        ),
      ],
    },
    {
      v: `${ks}e^{t}${plus(c)}`,
      b: `\\ln ${m}`,
      F: `${ks}e^{t}${ct(c)}`,
      rule: t(`Since $(e^{t})' = e^{t}$, and $e^{\\ln ${m}} = ${m}$:`, `因为 $(e^{t})' = e^{t}$，且 $e^{\\ln ${m}} = ${m}$：`),
      values: `\\left(${k * m}${c === 0 ? "" : ` + ${inP(Q.of(c))}\\ln ${m}`}\\right) - ${inP(Q.of(k))}`,
      answer: combine(k * (m - 1), Q.of(c), `\\ln ${m}`),
      derivative: `${ks}e^{t}${plus(c)}`,
      mistakes: [
        say(
          combine(k * m, Q.of(c), `\\ln ${m}`),
          `This leaves out the value at $t = 0$: $e^{0} = 1$, so subtract $${k}$.`,
          `这里漏掉了 $t = 0$ 处的值：$e^{0} = 1$，所以要减去 $${k}$。`,
        ),
        say(
          `${k * (m - 1)}`,
          `This leaves out the constant term: $${c}$ m/s for $\\ln ${m}$ seconds adds $${times(Q.of(c), `\\ln ${m}`)}$ m.`,
          `这里漏掉了常数项：$${c}$ 米/秒持续 $\\ln ${m}$ 秒，增加 $${times(Q.of(c), `\\ln ${m}`)}$ 米。`,
        ),
        say(
          combine(-k * (m - 1), Q.of(c), `\\ln ${m}`),
          "This subtracts the exponential part in the wrong order, its value at $0$ minus its value at the end.",
          "这里把指数部分减反了，用 $0$ 处的值减终点的值。",
        ),
      ],
    },
    {
      v: `\\frac{${Math.abs(k)}}{t + 1}`.replace("\\frac", k < 0 ? "-\\frac" : "\\frac"),
      b: `${m - 1}`,
      F: `${ks}\\ln(t + 1)`,
      rule: t(
        "Since $(\\ln(t + 1))' = \\frac{1}{t + 1}$, and $\\ln 1 = 0$:",
        "因为 $(\\ln(t + 1))' = \\frac{1}{t + 1}$，且 $\\ln 1 = 0$：",
      ),
      values: `${times(Q.of(k), `\\ln ${m}`)} - 0`,
      answer: times(Q.of(k), `\\ln ${m}`),
      derivative: `\\frac{${Math.abs(k)}}{t + 1}`.replace("\\frac", k < 0 ? "-\\frac" : "\\frac"),
      mistakes: [
        ...(Math.abs(k) === 1
          ? []
          : [
              say(
                `\\ln ${m}`,
                `This leaves out the factor $${k}$: the antiderivative of $\\frac{${k}}{t + 1}$ is $${ks}\\ln(t + 1)$.`,
                `这里漏掉了系数 $${k}$：$\\frac{${k}}{t + 1}$ 的原函数是 $${ks}\\ln(t + 1)$。`,
              ),
            ]),
        say(
          times(Q.of(-k), `\\ln ${m}`),
          "This subtracts in the wrong order, the value at the start minus the value at the end.",
          "这里减反了，用起点的值减终点的值。",
        ),
        say(
          `${Q.of(k * (m - 1), m).toLatex()}`,
          `This is the change in $-\\frac{${k}}{t + 1}$, as if $\\int \\frac{1}{t + 1} \\, dt = -\\frac{1}{t + 1}$; that rule is for $\\frac{1}{(t + 1)^{2}}$.`,
          `这里相当于认为 $\\int \\frac{1}{t + 1} \\, dt = -\\frac{1}{t + 1}$；那是 $\\frac{1}{(t + 1)^{2}}$ 的积分公式。`,
        ),
      ],
    },
  ];
  const e = rng.pick(cases);
  return exactWorked(
    ask(
      t(`Its velocity is $v(t) = ${e.v}$ m/s.`, `它的速度为 $v(t) = ${e.v}$ 米/秒。`),
      t(
        `Find its displacement from $t = 0$ to $t = ${e.b}$, in meters. Give an exact answer.`,
        `求它从 $t = 0$ 到 $t = ${e.b}$ 的位移（米），给出精确值。`,
      ),
    ),
    e.answer,
    [
      [["Find an antiderivative", "求原函数"], e.rule, [`${int(0, e.b, `\\left(${e.v}\\right)`, "t")} = \\Big[${e.F}\\Big]_{0}^{${e.b}}`]],
      [
        ["Evaluate at the ends", "代入上下限"],
        t("Subtract the value at $t = 0$ from the value at the end:", "用终点的值减去 $t = 0$ 处的值："),
        [`\\Big[${e.F}\\Big]_{0}^{${e.b}} = ${e.values} = ${e.answer}`],
      ],
    ],
    t(
      `Differentiate the antiderivative: $\\left(${e.F}\\right)' = ${e.derivative} = v(t)$, so it is an antiderivative of the velocity and the displacement is $${e.answer}$ m.`,
      `对原函数求导：$\\left(${e.F}\\right)' = ${e.derivative} = v(t)$，所以它确是速度的原函数，位移为 $${e.answer}$ 米。`,
    ),
    e.mistakes,
  );
}

/** calculatingTheDisplacementOfAParticleUsingIntegration integrates velocity to find the change in position. */
export const calculatingTheDisplacementOfAParticleUsingIntegration: TopicDef = {
  id: "calculating-the-displacement-of-a-particle-using-integration",
  title: t("Calculating the Displacement of a Particle Using Integration", "用积分计算质点的位移"),
  summary: t(
    "The displacement from t = a to t = b is the integral of the velocity over [a, b].",
    "从 t = a 到 t = b 的位移是速度在 [a, b] 上的积分。",
  ),
  intro: t(
    "A particle moves with velocity $v(t) = 2t - 4$ m/s. Its displacement from $t = 0$ to $t = 3$ is the change in position, which is the integral of the velocity:\n\n$$\\int_{0}^{3} (2t - 4) \\, dt = \\Big[t^{2} - 4t\\Big]_{0}^{3} = -3 \\text{ m}.$$\n\nThe particle ends $3$ m to the left of where it started.\n\nCheck: with $s(t) = t^{2} - 4t$, $s(0) = 0$ and $s(3) = 9 - 12 = -3$.\n\nIn this lesson we find displacements by integrating velocities, polynomial ones and trigonometric, exponential and reciprocal ones.",
    "一个质点以 $v(t) = 2t - 4$ 米/秒运动。它从 $t = 0$ 到 $t = 3$ 的位移是位置的变化量，也就是速度的积分：\n\n$$\\int_{0}^{3} (2t - 4) \\, dt = \\Big[t^{2} - 4t\\Big]_{0}^{3} = -3 \\text{ 米}$$\n\n质点最终位于起点左侧 $3$ 米处。\n\n检验：取 $s(t) = t^{2} - 4t$，则 $s(0) = 0$，$s(3) = 9 - 12 = -3$。\n\n本课我们对速度积分求位移，速度可以是多项式，也可以是三角、指数或倒数函数。",
  ),
  prerequisites: [
    "calculating-the-position-function-of-a-particle-using-integration",
    "applying-the-fundamental-theorem-of-calculus-to-exponential-and-trigonometric-functions",
  ],
  encompasses: [{ topic: "calculating-the-position-function-of-a-particle-using-integration", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "displacement-with-a-polynomial-velocity",
      title: t("Displacement with a polynomial velocity", "速度为多项式时的位移"),
      explanation: t(
        "Displacement is the change in position, $s(b) - s(a)$. Since $s' = v$,\n\n$$s(b) - s(a) = \\int_{a}^{b} v(t) \\, dt.$$\n\nA negative displacement means the particle ends to the left of where it started. For $v(t) = 2t - 4$ on $[0, 3]$: $\\int_{0}^{3} (2t - 4) \\, dt = 9 - 12 = -3$ m.\n\nCheck: the velocity is a line, so the integral is the average of its end values times the time, $\\frac{-4 + 2}{2} \\cdot 3 = -3$.\n\n> **Watch out.** Integrate the velocity, not the acceleration: $v(3) - v(0) = 6$ is the change in velocity, not in position.",
        "位移是位置的变化量 $s(b) - s(a)$。因为 $s' = v$，\n\n$$s(b) - s(a) = \\int_{a}^{b} v(t) \\, dt$$\n\n位移为负说明质点最终位于起点左侧。对 $[0, 3]$ 上的 $v(t) = 2t - 4$：$\\int_{0}^{3} (2t - 4) \\, dt = 9 - 12 = -3$ 米。\n\n检验：速度是一次函数，积分等于两端速度的平均乘以时间，$\\frac{-4 + 2}{2} \\cdot 3 = -3$。\n\n> **注意。** 要对速度积分，而不是对加速度积分：$v(3) - v(0) = 6$ 是速度的变化量，不是位置的变化量。",
      ),
      generate: polynomialDisplacement,
    },
    {
      id: "displacement-with-other-velocities",
      title: t("Displacement with other velocities", "其他速度函数的位移"),
      explanation: t(
        "Displacement is the integral of velocity over the time interval, whatever kind of function the velocity is. The same integral works for any velocity. For $v(t) = 3\\cos t + 2$ from $t = 0$ to $t = \\frac{\\pi}{2}$:\n\n$$\\int_{0}^{\\frac{\\pi}{2}} (3\\cos t + 2) \\, dt = \\Big[3\\sin t + 2t\\Big]_{0}^{\\frac{\\pi}{2}} = 3 + \\pi.$$\n\nCheck: $(3\\sin t + 2t)' = 3\\cos t + 2$, so the antiderivative is right.\n\n> **Watch out.** Subtract the value at $t = 0$ even when it looks like nothing: $e^{0} = 1$ and $\\cos 0 = 1$ are not zero.",
        "无论速度是哪种函数，位移都是速度在时间区间上的积分。对任何速度函数都用同样的积分。对 $v(t) = 3\\cos t + 2$，从 $t = 0$ 到 $t = \\frac{\\pi}{2}$：\n\n$$\\int_{0}^{\\frac{\\pi}{2}} (3\\cos t + 2) \\, dt = \\Big[3\\sin t + 2t\\Big]_{0}^{\\frac{\\pi}{2}} = 3 + \\pi$$\n\n检验：$(3\\sin t + 2t)' = 3\\cos t + 2$，所以原函数正确。\n\n> **注意。** 即使 $t = 0$ 处的值看起来没什么，也要减去：$e^{0} = 1$，$\\cos 0 = 1$，都不是零。",
      ),
      generate: exactDisplacement,
    },
  ],
};

/** distance adds the absolute values of the integrals of v between consecutive breakpoints. */
function distance(v: Poly, points: readonly number[]) {
  let total = Q.zero;
  for (const [i, x] of points.slice(1).entries()) total = total.add(intQ(v, points[i] ?? 0, x).abs());
  return total;
}

/** linearDistance finds the distance traveled when a linear velocity changes sign once. */
function linearDistance(rng: Rng) {
  const m = rng.nonZero(-4, 4);
  const p = rng.int(1, 4);
  const T = p + rng.int(1, 4);
  const v: Poly = [-m * p, m];
  const answer = distance(v, [0, p, T]);
  const net = intQ(v, 0, T);
  const [first, second] = [intQ(v, 0, p).abs(), intQ(v, p, T).abs()];
  const piece = (lo: number, hi: number) => `\\left|${int(lo, hi, `(${tL(v)})`, "t")}\\right|`;
  return worked(
    ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find the total distance it travels from $t = 0$ to $t = ${T}$, in meters.`, `求它从 $t = 0$ 到 $t = ${T}$ 运动的总路程（米）。`),
    ),
    answer,
    "m",
    [
      [
        ["Find where it turns", "找出转向的时刻"],
        t("The velocity changes sign where it is zero:", "速度在为零处变号："),
        [`${tL(v)} = 0 \\implies t = ${p}`],
      ],
      [
        ["Add the pieces", "把各段相加"],
        t("Integrate over each piece and add the sizes:", "在每一段上积分，再把大小相加："),
        [`${piece(0, p)} + ${piece(p, T)} = ${first.toLatex()} + ${second.toLatex()} = ${answer.toLatex()}`],
      ],
    ],
    t(
      `The graph of $v$ is a line, so each piece is a triangle: $\\frac{1}{2} \\cdot ${p} \\cdot ${Math.abs(m * p)} + \\frac{1}{2} \\cdot ${T - p} \\cdot ${Math.abs(m * (T - p))} = ${answer.toLatex()}$.`,
      `$v$ 的图像是直线，所以每一段都是三角形：$\\frac{1}{2} \\cdot ${p} \\cdot ${Math.abs(m * p)} + \\frac{1}{2} \\cdot ${T - p} \\cdot ${Math.abs(m * (T - p))} = ${answer.toLatex()}$。`,
    ),
    [
      slip(
        net.abs(),
        `This is the size of the displacement; the motion before and after $t = ${p}$ cancels in it.`,
        `这是位移的大小；$t = ${p}$ 前后的运动在其中相互抵消了。`,
      ),
      slip(
        net,
        "This is the displacement, $\\int v \\, dt$; the distance adds the size of each piece.",
        "这是位移 $\\int v \\, dt$；路程要把每一段的大小相加。",
      ),
      slip(
        first,
        `This stops at the turn at $t = ${p}$; the particle keeps moving until $t = ${T}$.`,
        `这里在 $t = ${p}$ 转向时就停止了；质点一直运动到 $t = ${T}$。`,
      ),
      slip(
        second,
        `This counts only the motion after the turn at $t = ${p}$; add the motion before it.`,
        `这只算了 $t = ${p}$ 转向之后的运动；还要加上之前的运动。`,
      ),
    ],
  );
}

/** quadraticDistance finds the distance traveled when a quadratic velocity may change sign twice. */
function quadraticDistance(rng: Rng) {
  const { p, q, c, v } = restingVelocity(rng);
  const T = rng.int(p + 1, q + 2);
  const points = [0, ...[p, q].filter((r) => r < T), T];
  const answer = distance(v, points);
  const net = intQ(v, 0, T);
  const pos = (x: number) => antiderivativeAt(v, x);
  const pieces = points.slice(1).map((x, i) =>
    intQ(v, points[i] ?? 0, x)
      .abs()
      .toLatex(),
  );
  const moves = points.slice(1).map((x, i) => `\\left|${inP(pos(x))} - ${inP(pos(points[i] ?? 0))}\\right|`);
  const turns = points.slice(1, -1);
  return worked(
    ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find the total distance it travels from $t = 0$ to $t = ${T}$, in meters.`, `求它从 $t = 0$ 到 $t = ${T}$ 运动的总路程（米）。`),
    ),
    answer,
    "m",
    [
      [
        ["Find where it turns", "找出转向的时刻"],
        t(
          `Factor the velocity; it changes sign at ${turns.map((x) => `$t = ${x}$`).join(" and ")}, inside $[0, ${T}]$:`,
          `把速度因式分解；它在 $[0, ${T}]$ 内的 ${turns.map((x) => `$t = ${x}$`).join(" 和 ")} 处变号：`,
        ),
        [`v(t) = ${factoredV(c, p, q)}`],
      ],
      [
        ["Add the pieces", "把各段相加"],
        t("Integrate over each piece and add the sizes:", "在每一段上积分，再把大小相加："),
        [`${pieces.join(" + ")} = ${answer.toLatex()}`],
      ],
    ],
    t(
      `Track the position instead. It is $s(t) = ${antiderivativeLatex(v).replace(/x/g, "t")}$, with $s(0) = 0$. Between the start, the turns and the end it moves\n\n$$${moves.join(" + ")} = ${answer.toLatex()}$$`,
      `改为追踪位置。位置为 $s(t) = ${antiderivativeLatex(v).replace(/x/g, "t")}$，且 $s(0) = 0$。在起点、各转向点和终点之间，它依次移动了\n\n$$${moves.join(" + ")} = ${answer.toLatex()}$$`,
    ),
    [
      slip(
        net.abs(),
        "This is the size of the displacement; motion in opposite directions cancels in it.",
        "这是位移的大小；相反方向的运动在其中相互抵消了。",
      ),
      slip(
        net,
        "This is the displacement, $\\int v \\, dt$; the distance adds the size of each piece.",
        "这是位移 $\\int v \\, dt$；路程要把每一段的大小相加。",
      ),
      slip(
        intQ(v, 0, p).abs(),
        `This stops at the first turn, $t = ${p}$; the particle keeps moving until $t = ${T}$.`,
        `这里在第一次转向 $t = ${p}$ 时就停止了；质点一直运动到 $t = ${T}$。`,
      ),
      ...(q < T
        ? [
            slip(
              intQ(v, 0, p)
                .abs()
                .add(intQ(v, p, T).abs()),
              `This splits only at $t = ${p}$; the velocity changes sign again at $t = ${q}$, so split there too.`,
              `这里只在 $t = ${p}$ 处分段；速度在 $t = ${q}$ 处再次变号，也要在那里分段。`,
            ),
          ]
        : []),
    ],
  );
}

/** calculatingTheTotalDistanceTraveledByAParticle integrates the speed |v(t)|. */
export const calculatingTheTotalDistanceTraveledByAParticle: TopicDef = {
  id: "calculating-the-total-distance-traveled-by-a-particle",
  title: t("Calculating the Total Distance Traveled by a Particle", "计算质点运动的总路程"),
  summary: t(
    "The total distance is the integral of the speed |v(t)|: split the interval where v changes sign.",
    "总路程是速率 |v(t)| 的积分：在 v 变号处把区间分开。",
  ),
  intro: t(
    "A particle moves with $v(t) = 2t - 4$ m/s from $t = 0$ to $t = 3$. Its displacement is $\\int_{0}^{3} (2t - 4) \\, dt = -3$ m, but it moves left until $t = 2$ and then right, so the distance it covers adds the two pieces:\n\n$$\\left|\\int_{0}^{2} (2t - 4) \\, dt\\right| + \\left|\\int_{2}^{3} (2t - 4) \\, dt\\right| = 4 + 1 = 5 \\text{ m}.$$\n\nCheck: with $s(t) = t^{2} - 4t$, the particle goes from $s(0) = 0$ to $s(2) = -4$ and back to $s(3) = -3$: $4 + 1 = 5$ m.\n\nIn this lesson we find the total distance traveled by splitting the time interval wherever the velocity changes sign.",
    "一个质点以 $v(t) = 2t - 4$ 米/秒从 $t = 0$ 运动到 $t = 3$。它的位移是 $\\int_{0}^{3} (2t - 4) \\, dt = -3$ 米，但它在 $t = 2$ 之前向左、之后向右运动，所以走过的路程要把两段相加：\n\n$$\\left|\\int_{0}^{2} (2t - 4) \\, dt\\right| + \\left|\\int_{2}^{3} (2t - 4) \\, dt\\right| = 4 + 1 = 5 \\text{ 米}$$\n\n检验：取 $s(t) = t^{2} - 4t$，质点从 $s(0) = 0$ 到 $s(2) = -4$，再回到 $s(3) = -3$：$4 + 1 = 5$ 米。\n\n本课我们在速度变号处把时间区间分开，求质点运动的总路程。",
  ),
  prerequisites: [
    "calculating-the-displacement-of-a-particle-using-integration",
    "finding-the-area-between-a-curve-and-the-x-axis-when-they-intersect",
  ],
  encompasses: [{ topic: "calculating-the-displacement-of-a-particle-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "distance-with-one-change-of-direction",
      title: t("Distance with one change of direction", "改变一次方向时的路程"),
      explanation: t(
        "Displacement can cancel: moving $4$ m right and then $4$ m left gives displacement $0$ but distance $8$ m. The total distance is $\\int_{a}^{b} |v(t)| \\, dt$. To evaluate it, find where $v(t) = 0$, integrate over each piece, and add the absolute values.\n\nFor $v(t) = 2t - 4$ on $[0, 3]$: $\\left|\\int_{0}^{2} (2t - 4) \\, dt\\right| + \\left|\\int_{2}^{3} (2t - 4) \\, dt\\right| = 4 + 1 = 5$ m.\n\nCheck: the graph of $v$ makes two triangles with the axis, of areas $\\frac{1}{2} \\cdot 2 \\cdot 4 = 4$ and $\\frac{1}{2} \\cdot 1 \\cdot 2 = 1$.\n\n> **Watch out.** $\\left|\\int_{0}^{3} v \\, dt\\right| = 3$ is not the distance: the absolute value must go on each piece, before the pieces are added.",
        "位移可以相互抵消：先向右 $4$ 米再向左 $4$ 米，位移为 $0$，路程却是 $8$ 米。总路程为 $\\int_{a}^{b} |v(t)| \\, dt$。计算时先找出 $v(t) = 0$ 的点，在各段上积分，再把绝对值相加。\n\n对 $[0, 3]$ 上的 $v(t) = 2t - 4$：$\\left|\\int_{0}^{2} (2t - 4) \\, dt\\right| + \\left|\\int_{2}^{3} (2t - 4) \\, dt\\right| = 4 + 1 = 5$ 米。\n\n检验：$v$ 的图像与横轴围成两个三角形，面积分别为 $\\frac{1}{2} \\cdot 2 \\cdot 4 = 4$ 和 $\\frac{1}{2} \\cdot 1 \\cdot 2 = 1$。\n\n> **注意。** $\\left|\\int_{0}^{3} v \\, dt\\right| = 3$ 不是路程：绝对值要加在每一段上，然后再相加。",
      ),
      generate: linearDistance,
    },
    {
      id: "distance-with-several-changes-of-direction",
      title: t("Distance with several changes of direction", "多次改变方向时的路程"),
      explanation: t(
        "A quadratic velocity can change sign twice. Factor $v(t)$, keep the zeros that lie inside the interval, and split the integral there. For example, $v(t) = t^{2} - 4t + 3 = (t - 1)(t - 3)$ on $[0, 4]$ turns at $t = 1$ and $t = 3$, and the pieces have sizes $\\frac{4}{3}$, $\\frac{4}{3}$ and $\\frac{4}{3}$, so the distance is $4$ m.\n\nCheck: the position $s(t) = \\frac{t^{3}}{3} - 2t^{2} + 3t$ goes $0 \\to \\frac{4}{3} \\to 0 \\to \\frac{4}{3}$, three moves of $\\frac{4}{3}$.\n\n> **Watch out.** Only zeros inside the interval split it, and only zeros where $v$ actually changes sign; splitting at the first zero alone leaves the second change of direction to cancel.",
        "二次速度函数可能变号两次。把 $v(t)$ 因式分解，保留落在区间内的零点，在这些点处拆分积分。例如 $[0, 4]$ 上的 $v(t) = t^{2} - 4t + 3 = (t - 1)(t - 3)$ 在 $t = 1$ 和 $t = 3$ 处转向，各段的大小都是 $\\frac{4}{3}$，所以路程是 $4$ 米。\n\n检验：位置 $s(t) = \\frac{t^{3}}{3} - 2t^{2} + 3t$ 依次为 $0 \\to \\frac{4}{3} \\to 0 \\to \\frac{4}{3}$，三次移动各 $\\frac{4}{3}$。\n\n> **注意。** 只有区间内、并且使 $v$ 真正变号的零点才用来分段；只在第一个零点分段，第二次转向的部分仍会相互抵消。",
      ),
      generate: quadraticDistance,
    },
  ],
};

/** averageVelocity divides the displacement by the elapsed time. */
function averageVelocity(rng: Rng) {
  const s = randomCubic(rng, 0);
  const v = pDer(s);
  const a = rng.int(0, 3);
  const b = a + rng.int(1, 4);
  const net = intQ(v, a, b);
  const answer = net.div(Q.of(b - a));
  const check = simpson(v, a, b, "v");
  return worked(
    ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(`Find its average velocity from $t = ${a}$ to $t = ${b}$, in m/s.`, `求它从 $t = ${a}$ 到 $t = ${b}$ 的平均速度（米/秒）。`),
    ),
    answer,
    "m/s",
    [
      [
        ["Find the displacement", "求位移"],
        t("Integrate the velocity over the interval:", "在这段时间上对速度积分："),
        [`${int(a, b, `(${tL(v)})`, "t")} = ${bracketT(v, a, b)}`],
      ],
      [
        ["Divide by the time", "除以时间"],
        t(`The interval lasts $${b - a}$ s:`, `这段时间长 $${b - a}$ 秒：`),
        [`${over(net, b - a)} = ${answer.toLatex()}`],
      ],
    ],
    t(
      `Find the displacement another way: Simpson's rule is exact for a quadratic,\n\n$$${check.line}$$\n\nand $${check.value.toLatex()} \\div ${b - a} = ${answer.toLatex()}$.`,
      `用另一种方法求位移：辛普森公式对二次函数是精确的，\n\n$$${check.line}$$\n\n而 $${check.value.toLatex()} \\div ${b - a} = ${answer.toLatex()}$。`,
    ),
    [
      slip(net, `This is the displacement; divide it by the time, $${b - a}$ s.`, `这是位移；还要除以时间 $${b - a}$ 秒。`),
      slip(
        Q.of(pAt(v, a) + pAt(v, b), 2),
        "This averages the velocities at the two ends; the velocity is not linear, so that is not its average value.",
        "这是两端速度的平均；速度不是一次函数，所以这不是它的平均值。",
      ),
      slip(
        Q.of(pAt(v, b) - pAt(v, a), b - a),
        "This is the average acceleration, the change in velocity over the time.",
        "这是平均加速度，即速度的变化量除以时间。",
      ),
    ],
  );
}

/** averagePositionOrAcceleration averages a position function, or an acceleration given as the derivative of a velocity. */
function averagePositionOrAcceleration(rng: Rng) {
  const a = rng.int(0, 3);
  const b = a + rng.int(1, 4);
  if (rng.bool()) {
    const s = randomCubic(rng, rng.int(-6, 6));
    const total = intQ(s, a, b);
    const answer = total.div(Q.of(b - a));
    const check = simpson(s, a, b, "s");
    return worked(
      ask(
        t(`Its position is $s(t) = ${tL(s)}$.`, `它的位置为 $s(t) = ${tL(s)}$。`),
        t(`Find its average position from $t = ${a}$ to $t = ${b}$, in meters.`, `求它从 $t = ${a}$ 到 $t = ${b}$ 的平均位置（米）。`),
      ),
      answer,
      "m",
      [
        [
          ["Integrate the position", "对位置积分"],
          t("Integrate the position over the interval:", "在这段时间上对位置积分："),
          [`${int(a, b, `(${tL(s)})`, "t")} = ${bracketT(s, a, b)}`],
        ],
        [
          ["Divide by the time", "除以时间"],
          t(`The interval lasts $${b - a}$ s:`, `这段时间长 $${b - a}$ 秒：`),
          [`${over(total, b - a)} = ${answer.toLatex()}`],
        ],
      ],
      t(
        `Find the integral another way: Simpson's rule is exact for a cubic,\n\n$$${check.line}$$\n\nand $${check.value.toLatex()} \\div ${b - a} = ${answer.toLatex()}$.`,
        `用另一种方法求积分：辛普森公式对三次函数是精确的，\n\n$$${check.line}$$\n\n而 $${check.value.toLatex()} \\div ${b - a} = ${answer.toLatex()}$。`,
      ),
      [
        slip(
          Q.of(pAt(s, b) - pAt(s, a), b - a),
          "This is the average velocity, the change in position over the time; the average position integrates the position itself.",
          "这是平均速度，即位置的变化量除以时间；平均位置要对位置本身积分。",
        ),
        slip(
          total,
          `This is the integral of the position; divide it by the time, $${b - a}$ s.`,
          `这是位置的积分；还要除以时间 $${b - a}$ 秒。`,
        ),
        slip(
          Q.of(pAt(s, a) + pAt(s, b), 2),
          "This averages the positions at the two ends; the position is not linear, so that is not its average value.",
          "这是两端位置的平均；位置不是一次函数，所以这不是它的平均值。",
        ),
      ],
    );
  }
  const v: Poly = [rng.int(-8, 8), rng.int(-6, 6), rng.nonZero(-3, 3), rng.int(-1, 1)];
  const acc = pDer(v);
  const answer = Q.of(pAt(v, b) - pAt(v, a), b - a);
  return worked(
    ask(
      t(`Its velocity is $v(t) = ${tL(v)}$ m/s.`, `它的速度为 $v(t) = ${tL(v)}$ 米/秒。`),
      t(
        `Find its average acceleration from $t = ${a}$ to $t = ${b}$, in m/s².`,
        `求它从 $t = ${a}$ 到 $t = ${b}$ 的平均加速度（米/秒²）。`,
      ),
    ),
    answer,
    "m/s²",
    [
      [
        ["Integrate the acceleration", "对加速度积分"],
        t("The velocity is an antiderivative of the acceleration:", "速度是加速度的原函数："),
        [`${int(a, b, "a(t)", "t")} = v(${b}) - v(${a}) = ${pAt(v, b)} - ${inP(pAt(v, a))} = ${pAt(v, b) - pAt(v, a)}`],
      ],
      [
        ["Divide by the time", "除以时间"],
        t(`The interval lasts $${b - a}$ s:`, `这段时间长 $${b - a}$ 秒：`),
        [`\\frac{${pAt(v, b) - pAt(v, a)}}{${b - a}} = ${answer.toLatex()}`],
      ],
    ],
    t(
      `Integrate the acceleration $a(t) = v'(t) = ${tL(acc)}$ directly:\n\n$$${int(a, b, `(${tL(acc)})`, "t")} = ${bracketT(acc, a, b)}$$\n\nthe same change in velocity, so the average is $${answer.toLatex()}$.`,
      `直接对加速度 $a(t) = v'(t) = ${tL(acc)}$ 积分：\n\n$$${int(a, b, `(${tL(acc)})`, "t")} = ${bracketT(acc, a, b)}$$\n\n得到同样的速度变化量，所以平均值是 $${answer.toLatex()}$。`,
    ),
    [
      slip(
        intQ(v, a, b).div(Q.of(b - a)),
        "This is the average velocity; the average acceleration is the change in velocity over the time.",
        "这是平均速度；平均加速度是速度的变化量除以时间。",
      ),
      slip(
        Q.of(pAt(acc, a) + pAt(acc, b), 2),
        "This averages the accelerations at the two ends; the acceleration is not linear, so that is not its average value.",
        "这是两端加速度的平均；加速度不是一次函数，所以这不是它的平均值。",
      ),
      slip(
        pAt(v, b) - pAt(v, a),
        `This is the change in velocity; divide it by the time, $${b - a}$ s.`,
        `这是速度的变化量；还要除以时间 $${b - a}$ 秒。`,
      ),
    ],
  );
}

/** averagePositionVelocityAndAcceleration applies the average value of a function to motion. */
export const averagePositionVelocityAndAcceleration: TopicDef = {
  id: "average-position-velocity-and-acceleration",
  title: t("Average Position, Velocity, and Acceleration", "平均位置、平均速度与平均加速度"),
  summary: t(
    "The average of s, v or a over [a, b] is its integral divided by b - a.",
    "s、v 或 a 在 [a, b] 上的平均值是其积分除以 b - a。",
  ),
  intro: t(
    "A particle moves with $v(t) = 3t^{2}$ m/s. Its average velocity from $t = 0$ to $t = 2$ is the average value of $v$, the integral divided by the length of the interval:\n\n$$\\frac{1}{2}\\int_{0}^{2} 3t^{2} \\, dt = \\frac{1}{2}\\Big[t^{3}\\Big]_{0}^{2} = \\frac{8}{2} = 4 \\text{ m/s}.$$\n\nThat is the displacement, $8$ m, divided by the time, $2$ s.\n\nCheck: $4$ lies between $v(0) = 0$ and $v(2) = 12$, and $v(t) = 4$ at $t = \\frac{2}{\\sqrt{3}} \\approx 1.15$, inside the interval, as the mean value theorem promises.\n\nIn this lesson we average velocity, position and acceleration over an interval by integrating and dividing by the time.",
    "一个质点以 $v(t) = 3t^{2}$ 米/秒运动。它从 $t = 0$ 到 $t = 2$ 的平均速度是 $v$ 的平均值，即积分除以区间长度：\n\n$$\\frac{1}{2}\\int_{0}^{2} 3t^{2} \\, dt = \\frac{1}{2}\\Big[t^{3}\\Big]_{0}^{2} = \\frac{8}{2} = 4 \\text{ 米/秒}$$\n\n也就是位移 $8$ 米除以时间 $2$ 秒。\n\n检验：$4$ 介于 $v(0) = 0$ 与 $v(2) = 12$ 之间，且 $v(t) = 4$ 在 $t = \\frac{2}{\\sqrt{3}} \\approx 1.15$ 处取到，位于区间内，正如中值定理所说。\n\n本课我们对速度、位置和加速度积分再除以时间，求它们在一段时间上的平均值。",
  ),
  prerequisites: ["the-average-value-of-a-function", "calculating-the-displacement-of-a-particle-using-integration"],
  encompasses: [{ topic: "the-average-value-of-a-function", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "average-velocity",
      title: t("Average velocity", "平均速度"),
      explanation: t(
        "The average value of $v$ on $[a, b]$ is\n\n$$\\frac{1}{b - a}\\int_{a}^{b} v(t) \\, dt = \\frac{s(b) - s(a)}{b - a},$$\n\nthe displacement divided by the elapsed time. For example, $v(t) = 3t^{2}$ on $[0, 2]$ has displacement $8$, so the average velocity is $4$ m/s.\n\nCheck: with $s(t) = t^{3}$, $\\frac{s(2) - s(0)}{2} = \\frac{8}{2} = 4$.\n\n> **Watch out.** It is generally not the average of $v(a)$ and $v(b)$: here that would be $\\frac{0 + 12}{2} = 6$.",
        "$v$ 在 $[a, b]$ 上的平均值为\n\n$$\\frac{1}{b - a}\\int_{a}^{b} v(t) \\, dt = \\frac{s(b) - s(a)}{b - a}$$\n\n即位移除以经过的时间。例如 $[0, 2]$ 上的 $v(t) = 3t^{2}$，位移为 $8$，所以平均速度是 $4$ 米/秒。\n\n检验：取 $s(t) = t^{3}$，$\\frac{s(2) - s(0)}{2} = \\frac{8}{2} = 4$。\n\n> **注意。** 它一般不等于 $v(a)$ 与 $v(b)$ 的平均：这里那样算会得到 $\\frac{0 + 12}{2} = 6$。",
      ),
      generate: averageVelocity,
    },
    {
      id: "average-position-and-acceleration",
      title: t("Average position and acceleration", "平均位置与平均加速度"),
      explanation: t(
        "The average position is $\\frac{1}{b - a}\\int_{a}^{b} s(t) \\, dt$, which needs an antiderivative of $s$. The average acceleration is $\\frac{1}{b - a}\\int_{a}^{b} a(t) \\, dt = \\frac{v(b) - v(a)}{b - a}$, because $v$ is an antiderivative of $a$. For example, with $s(t) = t^{2}$ on $[0, 3]$, the average position is $\\frac{1}{3}\\int_{0}^{3} t^{2} \\, dt = 3$ m; with $v(t) = t^{3}$ on $[0, 2]$, the average acceleration is $\\frac{8 - 0}{2} = 4$ m/s².\n\nCheck: $a(t) = 3t^{2}$, and $\\frac{1}{2}\\int_{0}^{2} 3t^{2} \\, dt = \\frac{8}{2} = 4$.\n\n> **Watch out.** The average position is not the change in position over the time; that is the average velocity, here $\\frac{9 - 0}{3} = 3$ m/s, a different quantity in different units.",
        "平均位置为 $\\frac{1}{b - a}\\int_{a}^{b} s(t) \\, dt$，需要求 $s$ 的原函数。平均加速度为 $\\frac{1}{b - a}\\int_{a}^{b} a(t) \\, dt = \\frac{v(b) - v(a)}{b - a}$，因为 $v$ 是 $a$ 的原函数。例如 $[0, 3]$ 上 $s(t) = t^{2}$，平均位置为 $\\frac{1}{3}\\int_{0}^{3} t^{2} \\, dt = 3$ 米；$[0, 2]$ 上 $v(t) = t^{3}$，平均加速度为 $\\frac{8 - 0}{2} = 4$ 米/秒²。\n\n检验：$a(t) = 3t^{2}$，而 $\\frac{1}{2}\\int_{0}^{2} 3t^{2} \\, dt = \\frac{8}{2} = 4$。\n\n> **注意。** 平均位置不是位置的变化量除以时间；那是平均速度，这里是 $\\frac{9 - 0}{3} = 3$ 米/秒，是单位不同的另一个量。",
      ),
      generate: averagePositionOrAcceleration,
    },
  ],
};

/** calculusIIMotionTopics are the topics of Calculus II module 2.12. */
export const calculusIIMotionTopics: readonly TopicDef[] = [
  calculatingVelocityUsingIntegration,
  determiningCharacteristicsOfMovingObjectsUsingIntegration,
  calculatingThePositionFunctionOfAParticleUsingIntegration,
  calculatingTheDisplacementOfAParticleUsingIntegration,
  calculatingTheTotalDistanceTraveledByAParticle,
  averagePositionVelocityAndAcceleration,
];
