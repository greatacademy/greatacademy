import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { numberProblem, pointProblem, vectorLatex, withMistakes } from "../problems.ts";
import { type Poly, pAt, par, pDer, pLatex, power } from "./calculus-common.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { intQ } from "./calculus-ii-areas.ts";
import { coef } from "./calculus-ii-substitution.ts";

// Calculus II unit 3: Vector-Valued Functions (module 3.14) and The Planar Motion of a Particle (module 3.15).

/** tL writes a polynomial in t. */
const tL = (p: Poly) => pLatex(p, "t");

/** vec writes a vector whose components are LaTeX. */
const vec = (x: string, y: string) => `\\left\\langle ${x}, ${y} \\right\\rangle`;

/** Pair is a vector with rational components. */
type Pair = readonly [Q, Q];

/** pairL writes a vector with rational components. */
const pairL = (v: Pair) => vectorLatex(v);

/** add adds two vectors. */
const add = (u: Pair, v: Pair): Pair => [u[0].add(v[0]), u[1].add(v[1])];

/** scale multiplies a vector by a rational number. */
const scale = (k: Q, v: Pair): Pair => [k.mul(v[0]), k.mul(v[1])];

/** swap exchanges the two components of a vector. */
const swap = (v: Pair): Pair => [v[1], v[0]];

/** same tells whether two vectors are equal. */
const same = (u: Pair, v: Pair) => u[0].eq(v[0]) && u[1].eq(v[1]);

/** step is a labelled step of a worked solution with its displayed lines. */
const step = (en: string, zh: string, said: Text, ...lines: string[]): Step => [[en, zh], said, lines];

/** Wrong is a wrong vector with its reason in English and Chinese. */
type Wrong = readonly [value: Pair, en: string, zh: string];

/** vectorWorked asks for a vector, explained in labelled steps with a check; each wrong vector keeps its first reason. */
function vectorWorked(prompt: Text, answer: Pair, parts: readonly Step[], check: Text, wrongs: readonly Wrong[]): Problem {
  const kept = wrongs.filter((w, i) => !same(w[0], answer) && wrongs.findIndex((v) => same(v[0], w[0])) === i);
  const problem = pointProblem({ prompt, answer, vector: true, wrong: kept.map((w) => w[0]), solution: walked(parts, check) });
  return withMistakes(
    problem,
    kept.map(([v, en, zh]) => ({ response: pairL(v), why: t(en, zh) })),
  );
}

/** Slip is a wrong number with its reason in English and Chinese. */
type Slip = readonly [value: number | Q, en: string, zh: string];

/** numberWorked asks for a number, explained in labelled steps with a check; each wrong number keeps its first reason. */
function numberWorked(
  prompt: Text,
  answer: number | Q,
  parts: readonly Step[],
  check: Text,
  slips: readonly Slip[],
  unit?: string,
): Problem {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  const right = q(answer);
  const kept = slips.filter((s, i) => !q(s[0]).eq(right) && slips.findIndex((r) => q(r[0]).eq(q(s[0]))) === i);
  return numberProblem({
    prompt,
    answer: right,
    ...(unit ? { unit } : {}),
    mistakes: kept.map(([v, en, zh]) => ({ value: q(v), why: t(en, zh) })),
    solution: walked(parts, check),
  });
}

/** subL writes a polynomial with a number put in for t: "2(3)^{2} - 3 + 1". */
function subL(p: Poly, a: number): string {
  const arg = a < 0 ? `(${a})` : `${a}`;
  const terms = p.map((c, i) => [c, i] as const).filter(([c]) => c !== 0);
  if (terms.length === 0) return "0";
  return terms
    .reverse()
    .map(([c, i], k) => {
      const sign = c < 0 ? (k === 0 ? "-" : " - ") : k === 0 ? "" : " + ";
      const m = Math.abs(c);
      const body = i === 0 ? `${m}` : `${m === 1 ? "" : `${m} \\cdot `}${arg}${i === 1 ? "" : `^{${i}}`}`;
      return sign + body;
    })
    .join("");
}

/** antiL writes an antiderivative of a polynomial in t without its constant. */
const antiL = (p: Poly) => {
  const s = poly(...p.map((c, i) => [Q.of(c, i + 1), power(i + 1, "t")] as const).reverse());
  return s === "" ? "0" : s;
};

/** pAtQ evaluates a polynomial at a rational number. */
const pAtQ = (p: Poly, x: Q) => p.reduce((s: Q, c, i) => s.add(Q.of(c).mul(x.pow(i))), Q.zero);

/** simpson writes Simpson's rule for a polynomial of degree at most 3 on [a, b], which is exact. */
function simpson(p: Poly, a: number, b: number): string {
  const m = Q.of(a + b, 2);
  const value = intQ(p, a, b);
  return `\\frac{${b - a}}{6}\\left(${Q.of(pAt(p, a)).toLatex()} + 4 \\cdot ${par(pAtQ(p, m))} + ${par(Q.of(pAt(p, b)))}\\right) = ${value.toLatex()}`;
}

/** Component is one coordinate function of a vector-valued function. */
interface Component {
  readonly tex: string;
  /** at evaluates the component; transcendental components are only evaluated at t = 0. */
  readonly at: (t0: number) => Q;
  readonly der: () => Component;
  /** plain is the derivative at 0 with the chain-rule factor left out. */
  readonly plain: Q;
}

/** polyC is a polynomial component. */
const polyC = (p: Poly): Component => ({
  tex: tL(p),
  at: (t0) => Q.of(pAt(p, t0)),
  der: () => polyC(pDer(p)),
  plain: Q.of(pAt(pDer(p), 0)),
});

/** argL writes kt as the argument of a function. */
const argL = (k: number) => `${coef(Q.of(k))}t`;

/** expC is the component c e^{kt}. */
const expC = (c: number, k: number): Component => ({
  tex: `${coef(Q.of(c))}e^{${argL(k)}}`,
  at: () => Q.of(c),
  der: () => expC(c * k, k),
  plain: Q.of(c),
});

/** sinC is the component c sin(kt). */
const sinC = (c: number, k: number): Component => ({
  tex: `${coef(Q.of(c))}\\sin(${argL(k)})`,
  at: () => Q.zero,
  der: () => cosC(c * k, k),
  plain: Q.of(c),
});

/** cosC is the component c cos(kt). */
const cosC = (c: number, k: number): Component => ({
  tex: `${coef(Q.of(c))}\\cos(${argL(k)})`,
  at: () => Q.of(c),
  der: () => sinC(-c * k, k),
  plain: Q.zero,
});

/** randomPoly chooses a polynomial in t of degree 2 or 3. */
const randomPoly = (rng: Rng): Poly => [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3), rng.int(-1, 1)];

/** quadratic chooses a polynomial in t of degree at most 2 that is not constant. */
const quadratic = (rng: Rng): Poly => [rng.int(-5, 5), rng.nonZero(-4, 4), rng.int(-3, 3)];

/** linear chooses a polynomial in t of degree at most 1. */
const linear = (rng: Rng): Poly => [rng.int(-6, 6), rng.nonZero(-3, 3)];

/** at evaluates a polynomial vector at t0. */
const at = (x: Poly, y: Poly, t0: number): Pair => [Q.of(pAt(x, t0)), Q.of(pAt(y, t0))];

/** integral integrates a polynomial vector from a to b. */
const integral = (x: Poly, y: Poly, a: number, b: number): Pair => [intQ(x, a, b), intQ(y, a, b)];

/** shifted lowers each power by one without multiplying by the exponent, the slip of a half-remembered power rule. */
const shifted = (p: Poly): Poly => (p.length <= 1 ? [0] : p.slice(1));

/** enterVector asks for the answer as a vector. */
const enterVector = t("Enter the vector as $\\langle a, b \\rangle$.", "以 $\\langle a, b \\rangle$ 的形式填写向量。");

/** factorCheck writes x(t0) as x(0) plus t0 times the rest, a second way to evaluate a polynomial. */
function factorCheck(p: Poly, name: string, t0: number): string {
  const rest = Q.of(pAt(p, t0) - (p[0] ?? 0), t0);
  return `${name}(${t0}) = ${p[0] ?? 0} + ${par(t0)} \\cdot ${par(rest)} = ${pAt(p, t0)}`;
}

/** backCheck antidifferentiates a derivative to get back the function without its constant term. */
const backCheck = (p: Poly) => `\\int \\left(${tL(pDer(p))}\\right) dt = ${tL([0, ...p.slice(1)])} + C`;

/** secondFormula writes x''(t0) = 2c₂ + 6c₃t₀ for a polynomial of degree at most 3. */
function secondFormula(p: Poly, name: string, t0: number): string {
  const [c2, c3] = [p[2] ?? 0, p[3] ?? 0];
  return `${name}''(${t0}) = 2 \\cdot ${par(c2)} + 6 \\cdot ${par(c3)} \\cdot ${par(t0)} = ${2 * c2 + 6 * c3 * t0}`;
}

/** evaluateVectorFunction evaluates a polynomial vector-valued function. */
function evaluateVectorFunction(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.nonZero(-3, 3);
  const answer = at(x, y, t0);
  return vectorWorked(
    t(
      `Let $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$. Find $\\mathbf{r}(${t0})$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$。求 $\\mathbf{r}(${t0})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Evaluate the first component",
        "求第一个分量的值",
        t(`Put $t = ${t0}$ into $x(t)$:`, `把 $t = ${t0}$ 代入 $x(t)$：`),
        `x(${t0}) = ${subL(x, t0)} = ${answer[0].toLatex()}`,
      ),
      step(
        "Evaluate the second component",
        "求第二个分量的值",
        t(`Put $t = ${t0}$ into $y(t)$:`, `把 $t = ${t0}$ 代入 $y(t)$：`),
        `y(${t0}) = ${subL(y, t0)} = ${answer[1].toLatex()}`,
      ),
    ],
    t(
      `Each component minus its constant term has the factor $t$, so it is the constant term plus $t_0$ times the rest:\n\n$$${factorCheck(x, "x", t0)}, \\qquad ${factorCheck(y, "y", t0)}$$`,
      `每个分量减去常数项后都含因子 $t$，所以它等于常数项加 $t_0$ 乘其余部分：\n\n$$${factorCheck(x, "x", t0)}, \\qquad ${factorCheck(y, "y", t0)}$$`,
    ),
    [
      [
        swap(answer),
        "The components are swapped: the first entry is $x(t)$, the second is $y(t)$",
        "分量顺序颠倒了：第一个是 $x(t)$，第二个是 $y(t)$",
      ],
      [at(x, y, -t0), `This puts in $t = ${-t0}$; the sign of $t$ was lost`, `这里代入的是 $t = ${-t0}$，$t$ 的符号丢了`],
      [
        at(x, y, 0),
        `This is $\\mathbf{r}(0)$, the constant terms only; put in $t = ${t0}$`,
        `这是 $\\mathbf{r}(0)$，只是常数项；应代入 $t = ${t0}$`,
      ],
      [
        at(pDer(x), pDer(y), t0),
        `This is $\\mathbf{r}'(${t0})$; the question asks for the value, not the derivative`,
        `这是 $\\mathbf{r}'(${t0})$；题目要的是函数值，不是导数`,
      ],
    ],
  );
}

/** vectorLimit takes the limit of a vector-valued function component by component. */
function vectorLimit(rng: Rng) {
  const a = rng.int(-3, 3);
  const y = quadratic(rng);
  const yv = Q.of(pAt(y, a));
  const k = rng.int(2, 6);
  const factor = `t ${a < 0 ? "+" : "-"} ${Math.abs(a)}`;
  const xTex = a === 0 ? `\\frac{\\sin(${k}t)}{t}` : `\\frac{t^{2} - ${a * a}}{${factor}}`;
  const xv = Q.of(a === 0 ? k : 2 * a);
  const answer: Pair = [xv, yv];
  const near = a === 0 ? (Math.sin(k * 0.01) / 0.01).toFixed(4) : (2 * a + 0.01).toFixed(2);
  const nearT = a === 0 ? "0.01" : (a + 0.01).toFixed(2);
  return vectorWorked(
    t(
      `Let $\\mathbf{r}(t) = ${vec(xTex, tL(y))}$. Find $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(xTex, tL(y))}$。求 $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      a === 0
        ? step(
            "The first component",
            "第一个分量",
            t(
              `Putting in $t = 0$ gives $\\frac{0}{0}$. Make the angle appear in the denominator and use $\\frac{\\sin u}{u} \\to 1$:`,
              `代入 $t = 0$ 得 $\\frac{0}{0}$。让分母出现同一个角，再用 $\\frac{\\sin u}{u} \\to 1$：`,
            ),
            `\\frac{\\sin(${k}t)}{t} = ${k} \\cdot \\frac{\\sin(${k}t)}{${k}t} \\to ${k}`,
          )
        : step(
            "The first component",
            "第一个分量",
            t(
              `Putting in $t = ${a}$ gives $\\frac{0}{0}$. Factor and cancel, since $t \\ne ${a}$:`,
              `代入 $t = ${a}$ 得 $\\frac{0}{0}$。因为 $t \\ne ${a}$，可以因式分解后约分：`,
            ),
            `\\frac{t^{2} - ${a * a}}{${factor}} = t ${a < 0 ? "-" : "+"} ${Math.abs(a)} \\to ${2 * a}`,
          ),
      step(
        "The second component",
        "第二个分量",
        t("A polynomial is continuous, so put the value in directly:", "多项式连续，直接代入："),
        `${subL(y, a)} = ${yv.toLatex()}`,
      ),
    ],
    t(
      `Try a time close to $${a}$: at $t = ${nearT}$ the first component is $${near}$, close to $${xv.toLatex()}$.`,
      `取一个接近 $${a}$ 的时刻：在 $t = ${nearT}$ 时第一个分量是 $${near}$，接近 $${xv.toLatex()}$。`,
    ),
    [
      [
        [Q.zero, yv],
        "The first component is $\\frac{0}{0}$ at the point, which is undecided, not $0$",
        "第一个分量在该点是 $\\frac{0}{0}$，这是未定式，不是 $0$",
      ],
      a === 0
        ? [
            [Q.one, yv],
            `$\\frac{\\sin u}{u} \\to 1$ needs $u = ${k}t$ in the denominator; here the limit is $${k}$`,
            `$\\frac{\\sin u}{u} \\to 1$ 要求分母是 $u = ${k}t$；这里极限是 $${k}$`,
          ]
        : [
            [Q.of(a), yv],
            `After cancelling, $t ${a < 0 ? "-" : "+"} ${Math.abs(a)}$ at $t = ${a}$ is $${2 * a}$, not $${a}$`,
            `约分后 $t ${a < 0 ? "-" : "+"} ${Math.abs(a)}$ 在 $t = ${a}$ 处是 $${2 * a}$，不是 $${a}$`,
          ],
      [swap(answer), "The components are swapped: the first entry is the limit of $x(t)$", "分量顺序颠倒了：第一个是 $x(t)$ 的极限"],
    ],
  );
}

/** definingVectorValuedFunctions introduces functions whose values are vectors. */
export const definingVectorValuedFunctions: TopicDef = {
  id: "defining-vector-valued-functions",
  title: t("Defining Vector-Valued Functions", "向量值函数的定义"),
  summary: t(
    "A vector-valued function r(t) = ⟨x(t), y(t)⟩ assigns a vector to each t; it is evaluated and its limits are taken component by component.",
    "向量值函数 r(t) = ⟨x(t), y(t)⟩ 给每个 t 对应一个向量；求值和求极限都按分量进行。",
  ),
  intro: t(
    "A vector-valued function gives a vector for each value of $t$. For $\\mathbf{r}(t) = \\langle t^{2}, 3t - 1 \\rangle$, put $t = 2$ into each component:\n\n$$\\mathbf{r}(2) = \\langle 2^{2}, 3 \\cdot 2 - 1 \\rangle = \\langle 4, 5 \\rangle.$$\n\nWith its tail at the origin, this vector points to the point $(4, 5)$ of the curve that $\\mathbf{r}$ traces.\n\nCheck: on this curve $t = \\frac{y + 1}{3}$, so $x = \\left(\\frac{y + 1}{3}\\right)^{2}$, and indeed $\\left(\\frac{5 + 1}{3}\\right)^{2} = 4$.\n\nIn this lesson we evaluate vector-valued functions and take their limits, one component at a time.",
    "向量值函数对每个 $t$ 给出一个向量。对 $\\mathbf{r}(t) = \\langle t^{2}, 3t - 1 \\rangle$，把 $t = 2$ 代入每个分量：\n\n$$\\mathbf{r}(2) = \\langle 2^{2}, 3 \\cdot 2 - 1 \\rangle = \\langle 4, 5 \\rangle$$\n\n把起点放在原点，这个向量指向 $\\mathbf{r}$ 描出的曲线上的点 $(4, 5)$。\n\n检验：在这条曲线上 $t = \\frac{y + 1}{3}$，所以 $x = \\left(\\frac{y + 1}{3}\\right)^{2}$，而确实 $\\left(\\frac{5 + 1}{3}\\right)^{2} = 4$。\n\n本课我们逐个分量地求向量值函数的值和极限。",
  ),
  prerequisites: [
    "two-dimensional-vectors-expressed-in-component-form",
    "graphing-curves-defined-parametrically",
    "calculating-limits-of-rational-functions-by-factoring",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-vector-valued-functions",
      title: t("Evaluating vector-valued functions", "向量值函数求值"),
      explanation: t(
        "A **vector-valued function** $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$ gives a vector for each value of $t$. Its **component functions** $x(t)$ and $y(t)$ are ordinary functions. Placed with its tail at the origin, $\\mathbf{r}(t)$ points to the point $(x(t), y(t))$, which traces the parametric curve.\n\nTo evaluate, substitute into each component: for $\\mathbf{r}(t) = \\langle t^{2}, 3t - 1 \\rangle$, $\\mathbf{r}(2) = \\langle 4, 5 \\rangle$.\n\nCheck: $x(2) = 0 + 2 \\cdot 2 = 4$ and $y(2) = -1 + 2 \\cdot 3 = 5$, writing each as its constant term plus $t$ times the rest.\n\n> **Watch out.** Keep the order of the components: $\\langle 5, 4 \\rangle$ is a different vector from $\\langle 4, 5 \\rangle$.",
        "**向量值函数** $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$ 对每个 $t$ 给出一个向量。它的**分量函数** $x(t)$、$y(t)$ 是普通函数。把 $\\mathbf{r}(t)$ 的起点放在原点，它指向点 $(x(t), y(t))$，这些点描出参数曲线。\n\n求值时代入每个分量：对 $\\mathbf{r}(t) = \\langle t^{2}, 3t - 1 \\rangle$，$\\mathbf{r}(2) = \\langle 4, 5 \\rangle$。\n\n检验：把每个分量写成常数项加 $t$ 乘其余部分，$x(2) = 0 + 2 \\cdot 2 = 4$，$y(2) = -1 + 2 \\cdot 3 = 5$。\n\n> **注意。** 分量的顺序不能换：$\\langle 5, 4 \\rangle$ 与 $\\langle 4, 5 \\rangle$ 是不同的向量。",
      ),
      generate: evaluateVectorFunction,
    },
    {
      id: "limits-of-vector-valued-functions",
      title: t("Limits of vector-valued functions", "向量值函数的极限"),
      explanation: t(
        "The limit of a vector-valued function is the vector of the limits of its components:\n\n$$\\lim_{t \\to a} \\mathbf{r}(t) = \\left\\langle \\lim_{t \\to a} x(t), \\lim_{t \\to a} y(t) \\right\\rangle.$$\n\nFor example, $\\lim\\limits_{t \\to 2} \\left\\langle \\frac{t^{2} - 4}{t - 2}, t^{2} \\right\\rangle = \\langle 4, 4 \\rangle$, since $\\frac{t^{2} - 4}{t - 2} = t + 2$ for $t \\ne 2$.\n\nCheck: at $t = 2.01$ the first component is $\\frac{0.0401}{0.01} = 4.01$, close to $4$.\n\n> **Watch out.** A component that gives $\\frac{0}{0}$ at the point has not been found yet: simplify it before putting the value in.",
        "向量值函数的极限是各分量极限组成的向量：\n\n$$\\lim_{t \\to a} \\mathbf{r}(t) = \\left\\langle \\lim_{t \\to a} x(t), \\lim_{t \\to a} y(t) \\right\\rangle$$\n\n例如 $\\lim\\limits_{t \\to 2} \\left\\langle \\frac{t^{2} - 4}{t - 2}, t^{2} \\right\\rangle = \\langle 4, 4 \\rangle$，因为 $t \\ne 2$ 时 $\\frac{t^{2} - 4}{t - 2} = t + 2$。\n\n检验：在 $t = 2.01$ 时第一个分量是 $\\frac{0.0401}{0.01} = 4.01$，接近 $4$。\n\n> **注意。** 某个分量在该点得到 $\\frac{0}{0}$ 时还没有求出极限：要先化简再代值。",
      ),
      generate: vectorLimit,
    },
  ],
};

/** derivativeAtPoint evaluates r′(t0) for a polynomial vector-valued function. */
function derivativeAtPoint(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(-2, 3);
  const answer = at(pDer(x), pDer(y), t0);
  return vectorWorked(
    t(
      `Let $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$. Find $\\mathbf{r}'(${t0})$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$。求 $\\mathbf{r}'(${t0})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Differentiate each component",
        "对每个分量求导",
        t("Use the power rule on each component:", "对每个分量用幂法则："),
        `\\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}`,
      ),
      step(
        "Evaluate",
        "代值",
        t(`Put in $t = ${t0}$:`, `代入 $t = ${t0}$：`),
        `\\mathbf{r}'(${t0}) = ${vec(subL(pDer(x), t0), subL(pDer(y), t0))} = ${pairL(answer)}`,
      ),
    ],
    t(
      `Antidifferentiate each component of $\\mathbf{r}'(t)$; it gives back $x(t)$ and $y(t)$ up to their constant terms:\n\n$$${backCheck(x)}, \\qquad ${backCheck(y)}$$`,
      `对 $\\mathbf{r}'(t)$ 的每个分量求原函数，得到的就是去掉常数项的 $x(t)$ 和 $y(t)$：\n\n$$${backCheck(x)}, \\qquad ${backCheck(y)}$$`,
    ),
    [
      [
        at(x, y, t0),
        `This is the position $\\mathbf{r}(${t0})$; differentiate before putting in $t$`,
        `这是 $\\mathbf{r}(${t0})$ 本身；要先求导再代入 $t$`,
      ],
      [
        at(pDer(pDer(x)), pDer(pDer(y)), t0),
        "This differentiates twice; $\\mathbf{r}'$ needs one derivative",
        "这里求了两次导数；$\\mathbf{r}'$ 只求一次",
      ],
      [swap(answer), "The components are swapped: the first entry is $x'(t)$", "分量顺序颠倒了：第一个是 $x'(t)$"],
      [
        at(shifted(x), shifted(y), t0),
        "This lowers each power without multiplying by the old exponent: $(t^{n})' = nt^{n - 1}$",
        "这里只把指数减一，没有乘以原来的指数：$(t^{n})' = nt^{n - 1}$",
      ],
    ],
  );
}

/** transcendentalDerivative evaluates r′(0) when the components are exponential and trigonometric. */
function transcendentalDerivative(rng: Rng) {
  const c = rng.nonZero(-4, 4);
  const k = rng.nonZero(-3, 3);
  const d = rng.nonZero(-4, 4);
  const m = rng.int(2, 4);
  const first = rng.bool() ? expC(c, k) : polyC(quadratic(rng));
  const second = rng.bool() ? sinC(d, m) : cosC(d, m);
  const [x, y] = rng.bool() ? [first, second] : [second, first];
  const answer: Pair = [x.der().at(0), y.der().at(0)];
  const back = (u: Component) => `\\int ${u.der().tex} \\, dt = ${u.tex} + C`;
  return vectorWorked(
    t(
      `Let $\\mathbf{r}(t) = ${vec(x.tex, y.tex)}$. Find $\\mathbf{r}'(0)$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(x.tex, y.tex)}$。求 $\\mathbf{r}'(0)$。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Differentiate each component",
        "对每个分量求导",
        t("Use the chain rule: the inner function $kt$ contributes the factor $k$.", "用链式法则：内层函数 $kt$ 带来因子 $k$。"),
        `\\mathbf{r}'(t) = ${vec(x.der().tex, y.der().tex)}`,
      ),
      step(
        "Evaluate at 0",
        "在 0 处求值",
        t("Use $e^{0} = 1$, $\\sin 0 = 0$ and $\\cos 0 = 1$:", "用 $e^{0} = 1$、$\\sin 0 = 0$、$\\cos 0 = 1$："),
        `\\mathbf{r}'(0) = ${pairL(answer)}`,
      ),
    ],
    t(
      `Antidifferentiate each component of $\\mathbf{r}'(t)$ to get back $\\mathbf{r}(t)$:\n\n$$${back(x)}, \\qquad ${back(y)}$$`,
      `对 $\\mathbf{r}'(t)$ 的每个分量求原函数，回到 $\\mathbf{r}(t)$：\n\n$$${back(x)}, \\qquad ${back(y)}$$`,
    ),
    [
      [[x.at(0), y.at(0)], "This is $\\mathbf{r}(0)$, the value, not the derivative", "这是 $\\mathbf{r}(0)$，是函数值，不是导数"],
      [
        [x.plain, y.plain],
        "This leaves out the chain-rule factor: the derivative of the inner function $kt$ is $k$",
        "这里漏了链式法则带来的因子：内层函数 $kt$ 的导数是 $k$",
      ],
      [
        [answer[0].neg(), answer[1].neg()],
        "Both signs are reversed: $(\\sin u)' = \\cos u$ and $(\\cos u)' = -\\sin u$",
        "两个符号都反了：$(\\sin u)' = \\cos u$，$(\\cos u)' = -\\sin u$",
      ],
      [
        [x.der().der().at(0), y.der().der().at(0)],
        "This differentiates twice; $\\mathbf{r}'$ needs one derivative",
        "这里求了两次导数；$\\mathbf{r}'$ 只求一次",
      ],
      [swap(answer), "The components are swapped: the first entry is $x'(0)$", "分量顺序颠倒了：第一个是 $x'(0)$"],
    ],
  );
}

/** secondDerivativeAtPoint evaluates r″(t0) for a polynomial vector-valued function. */
function secondDerivativeAtPoint(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.nonZero(-2, 3);
  const [x2, y2] = [pDer(pDer(x)), pDer(pDer(y))];
  const answer = at(x2, y2, t0);
  return vectorWorked(
    t(
      `Let $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$. Find $\\mathbf{r}''(${t0})$. ${enterVector.en}`,
      `设 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$。求 $\\mathbf{r}''(${t0})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Differentiate once",
        "求一阶导数",
        t("Differentiate each component:", "对每个分量求导："),
        `\\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}`,
      ),
      step(
        "Differentiate again and evaluate",
        "再求导并代值",
        t(`Differentiate again and put in $t = ${t0}$:`, `再求一次导数，并代入 $t = ${t0}$：`),
        `\\mathbf{r}''(t) = ${vec(tL(x2), tL(y2))}`,
        `\\mathbf{r}''(${t0}) = ${pairL(answer)}`,
      ),
    ],
    t(
      `For $c_0 + c_1t + c_2t^{2} + c_3t^{3}$ the second derivative is $2c_2 + 6c_3t$, read straight off the coefficients:\n\n$$${secondFormula(x, "x", t0)}, \\qquad ${secondFormula(y, "y", t0)}$$`,
      `对 $c_0 + c_1t + c_2t^{2} + c_3t^{3}$，二阶导数是 $2c_2 + 6c_3t$，可以直接从系数读出：\n\n$$${secondFormula(x, "x", t0)}, \\qquad ${secondFormula(y, "y", t0)}$$`,
    ),
    [
      [
        at(pDer(x), pDer(y), t0),
        `This is $\\mathbf{r}'(${t0})$; differentiate a second time`,
        `这是 $\\mathbf{r}'(${t0})$；还要再求一次导数`,
      ],
      [at(x2, y2, 0), `This is $\\mathbf{r}''(0)$; put in $t = ${t0}$`, `这是 $\\mathbf{r}''(0)$；应代入 $t = ${t0}$`],
      [swap(answer), "The components are swapped: the first entry is $x''(t)$", "分量顺序颠倒了：第一个是 $x''(t)$"],
    ],
  );
}

/** differentiatingVectorValuedFunctions differentiates vector-valued functions component by component. */
export const differentiatingVectorValuedFunctions: TopicDef = {
  id: "differentiating-vector-valued-functions",
  title: t("Differentiating Vector-Valued Functions", "向量值函数的求导"),
  summary: t("r′(t) = ⟨x′(t), y′(t)⟩; it is tangent to the curve traced by r(t).", "r′(t) = ⟨x′(t), y′(t)⟩，它与 r(t) 描出的曲线相切。"),
  intro: t(
    "A vector-valued function is differentiated one component at a time. For $\\mathbf{r}(t) = \\langle t^{3}, 2t \\rangle$:\n\n$$\\mathbf{r}'(t) = \\langle 3t^{2}, 2 \\rangle, \\qquad \\mathbf{r}'(1) = \\langle 3, 2 \\rangle.$$\n\nThis vector is tangent to the curve at $\\mathbf{r}(1) = (1, 2)$ and points the way the curve is traced.\n\nCheck: the curve is $x = \\left(\\frac{y}{2}\\right)^{3}$, whose slope $\\frac{dy}{dx}$ at $(1, 2)$ is $\\frac{2}{3}$, the same as the ratio of the components of $\\langle 3, 2 \\rangle$.\n\nIn this lesson we differentiate vector functions with polynomial, exponential and trigonometric components, once and twice.",
    "向量值函数逐个分量求导。对 $\\mathbf{r}(t) = \\langle t^{3}, 2t \\rangle$：\n\n$$\\mathbf{r}'(t) = \\langle 3t^{2}, 2 \\rangle, \\qquad \\mathbf{r}'(1) = \\langle 3, 2 \\rangle$$\n\n这个向量与曲线在 $\\mathbf{r}(1) = (1, 2)$ 处相切，指向曲线描出的方向。\n\n检验：这条曲线是 $x = \\left(\\frac{y}{2}\\right)^{3}$，它在 $(1, 2)$ 处的斜率 $\\frac{dy}{dx}$ 是 $\\frac{2}{3}$，与 $\\langle 3, 2 \\rangle$ 两个分量之比相同。\n\n本课我们对含多项式、指数和三角分量的向量函数求一阶和二阶导数。",
  ),
  prerequisites: [
    "defining-vector-valued-functions",
    "the-chain-rule-with-exponential-functions",
    "the-chain-rule-with-trigonometric-functions",
  ],
  encompasses: [{ topic: "defining-vector-valued-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "derivatives-of-polynomial-vector-functions",
      figure: calculusDrawings5["differentiating-vector-valued-functions#derivatives-of-polynomial-vector-functions"],
      title: t("Derivatives of polynomial vector functions", "多项式向量函数的导数"),
      explanation: t(
        "The derivative is defined by the same limit as for ordinary functions, and it works out component by component:\n\n$$\\mathbf{r}'(t) = \\lim_{h \\to 0} \\frac{\\mathbf{r}(t + h) - \\mathbf{r}(t)}{h} = \\langle x'(t), y'(t) \\rangle.$$\n\nWhen it is not zero, $\\mathbf{r}'(t)$ is tangent to the curve and points in the direction of motion. For $\\mathbf{r}(t) = \\langle t^{3}, 2t \\rangle$, $\\mathbf{r}'(t) = \\langle 3t^{2}, 2 \\rangle$ and $\\mathbf{r}'(1) = \\langle 3, 2 \\rangle$.\n\nCheck: antidifferentiating gives back $\\int 3t^{2} \\, dt = t^{3} + C$ and $\\int 2 \\, dt = 2t + C$.\n\n> **Watch out.** Differentiate first and put in $t$ afterwards; $\\mathbf{r}(1) = \\langle 1, 2 \\rangle$ is the position, not the derivative.",
        "导数的定义与普通函数相同，并且按分量计算：\n\n$$\\mathbf{r}'(t) = \\lim_{h \\to 0} \\frac{\\mathbf{r}(t + h) - \\mathbf{r}(t)}{h} = \\langle x'(t), y'(t) \\rangle$$\n\n当 $\\mathbf{r}'(t)$ 不为零时，它与曲线相切并指向运动方向。对 $\\mathbf{r}(t) = \\langle t^{3}, 2t \\rangle$，$\\mathbf{r}'(t) = \\langle 3t^{2}, 2 \\rangle$，$\\mathbf{r}'(1) = \\langle 3, 2 \\rangle$。\n\n检验：求原函数可以回到 $\\int 3t^{2} \\, dt = t^{3} + C$ 和 $\\int 2 \\, dt = 2t + C$。\n\n> **注意。** 先求导再代入 $t$；$\\mathbf{r}(1) = \\langle 1, 2 \\rangle$ 是位置，不是导数。",
      ),
      generate: derivativeAtPoint,
    },
    {
      id: "derivatives-with-exponential-and-trigonometric-components",
      title: t("Derivatives with exponential and trigonometric components", "含指数与三角分量的导数"),
      explanation: t(
        "A vector function is differentiated one component at a time, so apply the ordinary rules, including the chain rule, to each component separately. For $\\mathbf{r}(t) = \\langle e^{2t}, 3\\sin(4t) \\rangle$, the chain rule gives $\\mathbf{r}'(t) = \\langle 2e^{2t}, 12\\cos(4t) \\rangle$, so $\\mathbf{r}'(0) = \\langle 2, 12 \\rangle$.\n\nCheck: antidifferentiating gives back $\\int 2e^{2t} \\, dt = e^{2t} + C$ and $\\int 12\\cos(4t) \\, dt = 3\\sin(4t) + C$.\n\n> **Watch out.** The inner function $4t$ contributes the factor $4$: $(3\\sin(4t))' = 12\\cos(4t)$, not $3\\cos(4t)$.",
        "向量函数逐个分量求导，所以对每个分量分别使用普通的求导法则，包括链式法则。对 $\\mathbf{r}(t) = \\langle e^{2t}, 3\\sin(4t) \\rangle$，由链式法则 $\\mathbf{r}'(t) = \\langle 2e^{2t}, 12\\cos(4t) \\rangle$，所以 $\\mathbf{r}'(0) = \\langle 2, 12 \\rangle$。\n\n检验：求原函数可以回到 $\\int 2e^{2t} \\, dt = e^{2t} + C$ 和 $\\int 12\\cos(4t) \\, dt = 3\\sin(4t) + C$。\n\n> **注意。** 内层函数 $4t$ 带来因子 $4$：$(3\\sin(4t))' = 12\\cos(4t)$，而不是 $3\\cos(4t)$。",
      ),
      generate: transcendentalDerivative,
    },
    {
      id: "second-derivatives-of-vector-functions",
      title: t("Second derivatives of vector functions", "向量函数的二阶导数"),
      explanation: t(
        "Differentiating each component twice gives the second derivative, which for a moving point is its acceleration: $\\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$. For $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$, $\\mathbf{r}'(t) = \\langle 3t^{2}, 2t \\rangle$ and $\\mathbf{r}''(t) = \\langle 6t, 2 \\rangle$.\n\nCheck: for $c_0 + c_1t + c_2t^{2} + c_3t^{3}$ the second derivative is $2c_2 + 6c_3t$; for $t^{3}$ that is $6t$, for $t^{2}$ it is $2$.\n\n> **Watch out.** Find $\\mathbf{r}''(t)$ as a function first and put in $t$ last; putting $t$ in after one derivative turns the components into constants, whose derivative is $0$.",
        "把每个分量求两次导数就得到二阶导数，对运动的点来说，这就是它的加速度：$\\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$。对 $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$，$\\mathbf{r}'(t) = \\langle 3t^{2}, 2t \\rangle$，$\\mathbf{r}''(t) = \\langle 6t, 2 \\rangle$。\n\n检验：对 $c_0 + c_1t + c_2t^{2} + c_3t^{3}$，二阶导数是 $2c_2 + 6c_3t$；$t^{3}$ 得 $6t$，$t^{2}$ 得 $2$。\n\n> **注意。** 先把 $\\mathbf{r}''(t)$ 作为函数求出来，最后再代入 $t$；求一次导数后就代值，分量变成常数，再求导只能得 $0$。",
      ),
      generate: secondDerivativeAtPoint,
    },
  ],
};

/** definiteVectorIntegral integrates a polynomial vector-valued function over an interval. */
function definiteVectorIntegral(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const a = rng.int(-2, 1);
  const b = a + rng.int(1, 3);
  const answer = integral(x, y, a, b);
  const diff = add(at(x, y, b), scale(Q.of(-1), at(x, y, a)));
  return vectorWorked(
    t(
      `Evaluate $\\displaystyle\\int_{${a}}^{${b}} ${vec(tL(x), tL(y))} \\, dt$. ${enterVector.en}`,
      `计算 $\\displaystyle\\int_{${a}}^{${b}} ${vec(tL(x), tL(y))} \\, dt$。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Antidifferentiate each component",
        "对每个分量求原函数",
        t("Raise each power by one and divide by the new power:", "每个幂次加一，再除以新的指数："),
        `\\mathbf{R}(t) = ${vec(antiL(x), antiL(y))}`,
      ),
      step(
        "Subtract the values at the limits",
        "用上下限的值相减",
        t(`Take $\\mathbf{R}(${b}) - \\mathbf{R}(${a})$ in each component:`, `在每个分量中计算 $\\mathbf{R}(${b}) - \\mathbf{R}(${a})$：`),
        `${pairL(integral(x, y, 0, b))} - ${pairL(integral(x, y, 0, a))} = ${pairL(answer)}`,
      ),
    ],
    t(
      `Simpson's rule $\\frac{b - a}{6}\\left(f(a) + 4f(m) + f(b)\\right)$, with $m$ the midpoint, is exact for quadratics:\n\n$$${simpson(x, a, b)}, \\qquad ${simpson(y, a, b)}$$`,
      `辛普森公式 $\\frac{b - a}{6}\\left(f(a) + 4f(m) + f(b)\\right)$（$m$ 为中点）对二次函数是精确的：\n\n$$${simpson(x, a, b)}, \\qquad ${simpson(y, a, b)}$$`,
    ),
    [
      [
        diff,
        `This subtracts the integrand's values $\\mathbf{r}(${b}) - \\mathbf{r}(${a})$; subtract the antiderivative's values`,
        `这里用的是被积函数的值 $\\mathbf{r}(${b}) - \\mathbf{r}(${a})$；应当用原函数的值相减`,
      ],
      [integral(x, y, 0, b), `This integrates from $0$; the lower limit is $${a}$`, `这里从 $0$ 开始积分；下限是 $${a}$`],
      [
        scale(Q.of(-1), answer),
        `This takes $\\mathbf{R}(${a}) - \\mathbf{R}(${b})$; the lower limit is subtracted`,
        `这里算成了 $\\mathbf{R}(${a}) - \\mathbf{R}(${b})$；应减去下限处的值`,
      ],
      [swap(answer), "The components are swapped: the first entry is the integral of $x(t)$", "分量顺序颠倒了：第一个是 $x(t)$ 的积分"],
    ],
  );
}

/** vectorInitialValue recovers r(t) from r′(t) and r(0), then evaluates it. */
function vectorInitialValue(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const r0: Pair = [Q.of(rng.int(-6, 6)), Q.of(rng.int(-6, 6))];
  const t1 = rng.int(1, 3);
  const change = integral(x, y, 0, t1);
  const answer = add(r0, change);
  const plusC = (s: string, c: Q) => (c.isZero() ? s : s === "0" ? c.toLatex() : `${s} ${c.sign() < 0 ? "-" : "+"} ${c.abs().toLatex()}`);
  return vectorWorked(
    t(
      `A vector-valued function satisfies $\\mathbf{r}'(t) = ${vec(tL(x), tL(y))}$ and $\\mathbf{r}(0) = ${pairL(r0)}$. Find $\\mathbf{r}(${t1})$. ${enterVector.en}`,
      `向量值函数满足 $\\mathbf{r}'(t) = ${vec(tL(x), tL(y))}$，$\\mathbf{r}(0) = ${pairL(r0)}$。求 $\\mathbf{r}(${t1})$。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Find the change",
        "求变化量",
        t(`Integrate $\\mathbf{r}'$ from $0$ to $${t1}$, component by component:`, `把 $\\mathbf{r}'$ 从 $0$ 到 $${t1}$ 按分量积分：`),
        `\\int_{0}^{${t1}} \\mathbf{r}'(t) \\, dt = ${pairL(change)}`,
      ),
      step("Add the starting value", "加上初值", t("", ""), `\\mathbf{r}(${t1}) = ${pairL(r0)} + ${pairL(change)} = ${pairL(answer)}`),
    ],
    t(
      `Substitute back: $\\mathbf{r}(t) = ${vec(plusC(antiL(x), r0[0]), plusC(antiL(y), r0[1]))}$ has derivative $${vec(tL(x), tL(y))}$, the given $\\mathbf{r}'(t)$, and at $t = 0$ it is $${pairL(r0)}$, the given $\\mathbf{r}(0)$.`,
      `代回检验：$\\mathbf{r}(t) = ${vec(plusC(antiL(x), r0[0]), plusC(antiL(y), r0[1]))}$ 的导数是 $${vec(tL(x), tL(y))}$，正是给出的 $\\mathbf{r}'(t)$；在 $t = 0$ 时它等于 $${pairL(r0)}$，正是给出的 $\\mathbf{r}(0)$。`,
    ),
    [
      [
        change,
        `This is only the change; add the starting value $\\mathbf{r}(0) = ${pairL(r0)}$`,
        `这只是变化量；还要加上初值 $\\mathbf{r}(0) = ${pairL(r0)}$`,
      ],
      [
        add(r0, at(x, y, t1)),
        `This adds the derivative's value $\\mathbf{r}'(${t1})$; the change is the integral of $\\mathbf{r}'$`,
        `这里加的是导数值 $\\mathbf{r}'(${t1})$；变化量是 $\\mathbf{r}'$ 的积分`,
      ],
      [
        add(r0, scale(Q.of(-1), change)),
        "This subtracts the change; the integral of $\\mathbf{r}'$ is added to $\\mathbf{r}(0)$",
        "这里把变化量减掉了；$\\mathbf{r}'$ 的积分要加到 $\\mathbf{r}(0)$ 上",
      ],
    ],
  );
}

/** integratingVectorValuedFunctions integrates vector-valued functions component by component. */
export const integratingVectorValuedFunctions: TopicDef = {
  id: "integrating-vector-valued-functions",
  title: t("Integrating Vector-Valued Functions", "向量值函数的积分"),
  summary: t(
    "Integrals of vector-valued functions are taken component by component, with a constant vector for indefinite integrals.",
    "向量值函数按分量积分，不定积分要加一个常向量。",
  ),
  intro: t(
    "A vector-valued function is integrated one component at a time. For example,\n\n$$\\int_{0}^{2} \\langle 2t, 3 \\rangle \\, dt = \\left\\langle \\left[t^{2}\\right]_{0}^{2}, \\left[3t\\right]_{0}^{2} \\right\\rangle = \\langle 4, 6 \\rangle.$$\n\nCheck: the first component is the area of a triangle with base $2$ and height $4$, which is $4$, and the second is a rectangle $2$ by $3$, which is $6$.\n\nIn this lesson we evaluate definite integrals of vector functions and use an initial value to fix the constant vector of an antiderivative.",
    "向量值函数逐个分量积分。例如\n\n$$\\int_{0}^{2} \\langle 2t, 3 \\rangle \\, dt = \\left\\langle \\left[t^{2}\\right]_{0}^{2}, \\left[3t\\right]_{0}^{2} \\right\\rangle = \\langle 4, 6 \\rangle$$\n\n检验：第一个分量是底为 $2$、高为 $4$ 的三角形面积 $4$，第二个分量是 $2 \\times 3$ 的矩形面积 $6$。\n\n本课我们计算向量函数的定积分，并用初值确定原函数中的常向量。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-fundamental-theorem-of-calculus"],
  encompasses: [{ topic: "the-fundamental-theorem-of-calculus", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "definite-integrals-of-vector-functions",
      title: t("Definite integrals of vector functions", "向量函数的定积分"),
      explanation: t(
        "A vector function is integrated one component at a time, and the result is a vector whose components are ordinary definite integrals: $$\\int_{a}^{b} \\mathbf{r}(t) \\, dt = \\left\\langle \\int_{a}^{b} x(t) \\, dt, \\int_{a}^{b} y(t) \\, dt \\right\\rangle.$$\n\nFor example, $\\int_{0}^{2} \\langle 2t, 3 \\rangle \\, dt = \\langle 4, 6 \\rangle$.\n\nCheck: the areas under $2t$ and under $3$ from $0$ to $2$ are a triangle of area $4$ and a rectangle of area $6$.\n\n> **Watch out.** Subtract the values of the antiderivative, not of the integrand: $\\mathbf{r}(2) - \\mathbf{r}(0) = \\langle 4, 0 \\rangle$ is not the integral.",
        "向量函数逐个分量积分，结果是一个向量，它的各个分量都是普通的定积分：$$\\int_{a}^{b} \\mathbf{r}(t) \\, dt = \\left\\langle \\int_{a}^{b} x(t) \\, dt, \\int_{a}^{b} y(t) \\, dt \\right\\rangle$$\n\n例如 $\\int_{0}^{2} \\langle 2t, 3 \\rangle \\, dt = \\langle 4, 6 \\rangle$。\n\n检验：从 $0$ 到 $2$，$2t$ 下方是面积为 $4$ 的三角形，$3$ 下方是面积为 $6$ 的矩形。\n\n> **注意。** 要用原函数的值相减，而不是被积函数的值：$\\mathbf{r}(2) - \\mathbf{r}(0) = \\langle 4, 0 \\rangle$ 不是积分。",
      ),
      generate: definiteVectorIntegral,
    },
    {
      id: "vector-initial-value-problems",
      title: t("Vector initial value problems", "向量初值问题"),
      explanation: t(
        "An antiderivative of $\\mathbf{r}'(t)$ is determined up to a constant vector $\\mathbf{C}$, which an initial value fixes. Equivalently,\n\n$$\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{r}'(t) \\, dt.$$\n\nFor $\\mathbf{r}'(t) = \\langle 2t, 1 \\rangle$ and $\\mathbf{r}(0) = \\langle 1, -1 \\rangle$: $\\mathbf{r}(t) = \\langle t^{2} + 1, t - 1 \\rangle$.\n\nCheck: its derivative is $\\langle 2t, 1 \\rangle$, and at $t = 0$ it is $\\langle 1, -1 \\rangle$.\n\n> **Watch out.** The integral is only the change in $\\mathbf{r}$; the starting value $\\mathbf{r}(0)$ must be added to it.",
        "$\\mathbf{r}'(t)$ 的原函数只确定到相差一个常向量 $\\mathbf{C}$，由初值确定。等价地，\n\n$$\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{r}'(t) \\, dt$$\n\n对 $\\mathbf{r}'(t) = \\langle 2t, 1 \\rangle$、$\\mathbf{r}(0) = \\langle 1, -1 \\rangle$：$\\mathbf{r}(t) = \\langle t^{2} + 1, t - 1 \\rangle$。\n\n检验：它的导数是 $\\langle 2t, 1 \\rangle$，在 $t = 0$ 时等于 $\\langle 1, -1 \\rangle$。\n\n> **注意。** 积分只是 $\\mathbf{r}$ 的变化量，还要加上初值 $\\mathbf{r}(0)$。",
      ),
      generate: vectorInitialValue,
    },
  ],
};

/** motionPrompt describes the position of a particle moving in the plane. */
const motionPrompt = (x: string, y: string) =>
  t(
    `A particle moves in the plane with position $\\mathbf{r}(t) = ${vec(x, y)}$ meters at time $t$ seconds.`,
    `一个质点在平面上运动，$t$ 秒时的位置为 $\\mathbf{r}(t) = ${vec(x, y)}$ 米。`,
  );

/** planeVelocity finds the velocity vector at a given time. */
function planeVelocity(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(1, 4);
  const answer = at(pDer(x), pDer(y), t0);
  const intro = motionPrompt(tL(x), tL(y));
  return vectorWorked(
    t(
      `${intro.en} Find its velocity vector at $t = ${t0}$, in meters per second. ${enterVector.en}`,
      `${intro["zh-CN"]}求 $t = ${t0}$ 时的速度向量（单位：米/秒）。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Differentiate the position",
        "对位置求导",
        t("Velocity is the derivative of position:", "速度是位置的导数："),
        `\\mathbf{v}(t) = \\mathbf{r}'(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}`,
      ),
      step(
        "Evaluate",
        "代值",
        t(`Put in $t = ${t0}$:`, `代入 $t = ${t0}$：`),
        `\\mathbf{v}(${t0}) = ${vec(subL(pDer(x), t0), subL(pDer(y), t0))} = ${pairL(answer)}`,
      ),
    ],
    t(
      `Antidifferentiate the velocity; it gives back the position up to its constant terms:\n\n$$${backCheck(x)}, \\qquad ${backCheck(y)}$$`,
      `对速度求原函数，回到去掉常数项的位置：\n\n$$${backCheck(x)}, \\qquad ${backCheck(y)}$$`,
    ),
    [
      [
        at(x, y, t0),
        `This is the position $\\mathbf{r}(${t0})$; velocity is its derivative`,
        `这是位置 $\\mathbf{r}(${t0})$；速度是它的导数`,
      ],
      [at(pDer(pDer(x)), pDer(pDer(y)), t0), "This is the acceleration; differentiate only once", "这是加速度；只需求一次导数"],
      [swap(answer), "The components are swapped: the first entry is $x'(t)$", "分量顺序颠倒了：第一个是 $x'(t)$"],
      [
        at(shifted(x), shifted(y), t0),
        "This lowers each power without multiplying by the old exponent: $(t^{n})' = nt^{n - 1}$",
        "这里只把指数减一，没有乘以原来的指数：$(t^{n})' = nt^{n - 1}$",
      ],
    ],
  );
}

/** triples are Pythagorean triples. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [0, 7, 7],
];

/** withVelocity chooses a quadratic whose derivative at t0 is v. */
function withVelocity(rng: Rng, v: number, t0: number): Poly {
  const a = rng.nonZero(-2, 2);
  return [rng.int(-5, 5), v - 2 * a * t0, a];
}

/** planeSpeed finds the speed, the magnitude of the velocity vector. */
function planeSpeed(rng: Rng) {
  const [p, q, h] = rng.pick(triples);
  const sign = () => (rng.bool() ? 1 : -1);
  const [vx, vy] = rng.bool() ? [p * sign(), q * sign()] : [q * sign(), p * sign()];
  const t0 = rng.int(1, 3);
  const [x, y] = [withVelocity(rng, vx, t0), withVelocity(rng, vy, t0)];
  const intro = motionPrompt(tL(x), tL(y));
  const big = Math.max(Math.abs(vx), Math.abs(vy));
  return numberWorked(
    t(`${intro.en} Find its speed at $t = ${t0}$.`, `${intro["zh-CN"]}求 $t = ${t0}$ 时的速率。`),
    h,
    [
      step(
        "Find the velocity",
        "求速度",
        t(`Differentiate and put in $t = ${t0}$:`, `求导并代入 $t = ${t0}$：`),
        `\\mathbf{v}(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}`,
        `\\mathbf{v}(${t0}) = \\langle ${vx}, ${vy} \\rangle`,
      ),
      step(
        "Take its magnitude",
        "求它的模",
        t("Speed is the length of the velocity vector:", "速率是速度向量的长度："),
        `\\|\\mathbf{v}(${t0})\\| = \\sqrt{${par(vx)}^{2} + ${par(vy)}^{2}} = \\sqrt{${vx * vx + vy * vy}} = ${h}`,
      ),
    ],
    t(
      `$${h}^{2} - ${par(vx)}^{2} = ${h * h - vx * vx} = ${par(vy)}^{2}$, and $${h}$ lies between the larger component size $${big}$ and the sum $${Math.abs(vx) + Math.abs(vy)}$, as the hypotenuse of a right triangle must.`,
      `$${h}^{2} - ${par(vx)}^{2} = ${h * h - vx * vx} = ${par(vy)}^{2}$，并且 $${h}$ 介于较大分量的大小 $${big}$ 与两者之和 $${Math.abs(vx) + Math.abs(vy)}$ 之间，正如直角三角形的斜边应当的那样。`,
    ),
    [
      [
        Math.abs(vx) + Math.abs(vy),
        "This adds the component sizes; the length of a vector comes from Pythagoras",
        "这里把分量大小相加了；向量的长度要用勾股定理求",
      ],
      [h * h, "This is the square of the speed; take the square root", "这是速率的平方；还要开平方"],
      [
        Math.abs(vx + vy),
        "This adds the components as numbers; the length of a vector comes from Pythagoras",
        "这里把分量当作数相加了；向量的长度要用勾股定理求",
      ],
      [big, "This is the size of one component only; the speed combines both", "这只是一个分量的大小；速率要把两个分量合起来"],
    ],
    "m/s",
  );
}

/** calculatingVelocityForPlaneMotionUsingDifferentiation differentiates position vectors. */
export const calculatingVelocityForPlaneMotionUsingDifferentiation: TopicDef = {
  id: "calculating-velocity-for-plane-motion-using-differentiation",
  title: t("Calculating Velocity for Plane Motion Using Differentiation", "用求导计算平面运动的速度"),
  summary: t(
    "The velocity of a particle with position r(t) is v(t) = r′(t), and its speed is ‖v(t)‖.",
    "位置为 r(t) 的质点的速度为 v(t) = r′(t)，速率为 ‖v(t)‖。",
  ),
  intro: t(
    "The velocity of a particle moving in the plane is the derivative of its position. For $\\mathbf{r}(t) = \\langle t^{2}, 4t \\rangle$:\n\n$$\\mathbf{v}(t) = \\langle 2t, 4 \\rangle, \\qquad \\mathbf{v}(3) = \\langle 6, 4 \\rangle,$$\n\nand the speed is the length $\\|\\mathbf{v}(3)\\| = \\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$ meters per second.\n\nCheck: from $t = 3$ to $t = 3.01$ the particle moves from $(9, 12)$ to $(9.0601, 12.04)$, a change of $\\langle 0.0601, 0.04 \\rangle$, which is about $0.01 \\cdot \\langle 6, 4 \\rangle$.\n\nIn this lesson we find velocity vectors from position and the speed as the length of the velocity.",
    "平面上运动质点的速度是位置的导数。对 $\\mathbf{r}(t) = \\langle t^{2}, 4t \\rangle$：\n\n$$\\mathbf{v}(t) = \\langle 2t, 4 \\rangle, \\qquad \\mathbf{v}(3) = \\langle 6, 4 \\rangle$$\n\n速率是长度 $\\|\\mathbf{v}(3)\\| = \\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$ 米/秒。\n\n检验：从 $t = 3$ 到 $t = 3.01$，质点从 $(9, 12)$ 移到 $(9.0601, 12.04)$，变化 $\\langle 0.0601, 0.04 \\rangle$，约为 $0.01 \\cdot \\langle 6, 4 \\rangle$。\n\n本课我们由位置求速度向量，并把速率求成速度的长度。",
  ),
  prerequisites: [
    "differentiating-vector-valued-functions",
    "calculating-velocity-for-straight-line-motion-using-differentiation",
    "velocity-and-acceleration-for-plane-motion",
  ],
  encompasses: [{ topic: "differentiating-vector-valued-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "velocity-vectors-from-position",
      figure: calculusDrawings5["calculating-velocity-for-plane-motion-using-differentiation#velocity-vectors-from-position"],
      title: t("Velocity vectors from position", "由位置求速度向量"),
      explanation: t(
        "For a particle with position vector $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$, the **velocity** is\n\n$$\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle,$$\n\ntangent to the path in the direction of motion. For $\\mathbf{r}(t) = \\langle t^{2}, 4t \\rangle$, $\\mathbf{v}(3) = \\langle 6, 4 \\rangle$.\n\nCheck: in the short time from $3$ to $3.01$ the position changes by $\\langle 0.0601, 0.04 \\rangle$, about $0.01 \\cdot \\langle 6, 4 \\rangle$.\n\n> **Watch out.** $\\mathbf{r}(3) = \\langle 9, 12 \\rangle$ says where the particle is, not how fast it moves; velocity needs the derivative.",
        "对位置向量为 $\\mathbf{r}(t) = \\langle x(t), y(t) \\rangle$ 的质点，**速度**为\n\n$$\\mathbf{v}(t) = \\mathbf{r}'(t) = \\langle x'(t), y'(t) \\rangle$$\n\n它与路径相切，指向运动方向。对 $\\mathbf{r}(t) = \\langle t^{2}, 4t \\rangle$，$\\mathbf{v}(3) = \\langle 6, 4 \\rangle$。\n\n检验：在从 $3$ 到 $3.01$ 的短时间内，位置变化 $\\langle 0.0601, 0.04 \\rangle$，约为 $0.01 \\cdot \\langle 6, 4 \\rangle$。\n\n> **注意。** $\\mathbf{r}(3) = \\langle 9, 12 \\rangle$ 说的是质点在哪里，不是它运动多快；速度要求导数。",
      ),
      generate: planeVelocity,
    },
    {
      id: "speed-in-the-plane",
      title: t("Speed in the plane", "平面运动的速率"),
      explanation: t(
        "**Speed** is the magnitude of velocity: $\\|\\mathbf{v}(t)\\| = \\sqrt{x'(t)^{2} + y'(t)^{2}}$. It is a number, not a vector. For $\\mathbf{v} = \\langle 6, -8 \\rangle$ the speed is $\\sqrt{36 + 64} = 10$.\n\nCheck: $10$ is the hypotenuse of a right triangle with legs $6$ and $8$, so it lies between $8$ and $6 + 8 = 14$.\n\n> **Watch out.** Adding the components, $6 + 8 = 14$, is not the speed: the components are at right angles.",
        "**速率**是速度的模：$\\|\\mathbf{v}(t)\\| = \\sqrt{x'(t)^{2} + y'(t)^{2}}$。它是一个数，不是向量。对 $\\mathbf{v} = \\langle 6, -8 \\rangle$，速率为 $\\sqrt{36 + 64} = 10$。\n\n检验：$10$ 是直角边为 $6$ 和 $8$ 的直角三角形的斜边，所以介于 $8$ 与 $6 + 8 = 14$ 之间。\n\n> **注意。** 把分量相加 $6 + 8 = 14$ 不是速率：两个分量互相垂直。",
      ),
      generate: planeSpeed,
    },
  ],
};

/** planeAcceleration finds the acceleration vector at a given time. */
function planeAcceleration(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const t0 = rng.int(1, 4);
  const answer = at(pDer(pDer(x)), pDer(pDer(y)), t0);
  const intro = motionPrompt(tL(x), tL(y));
  return vectorWorked(
    t(
      `${intro.en} Find its acceleration vector at $t = ${t0}$, in meters per second squared. ${enterVector.en}`,
      `${intro["zh-CN"]}求 $t = ${t0}$ 时的加速度向量（单位：米/秒²）。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Find the velocity",
        "求速度",
        t("Differentiate the position:", "对位置求导："),
        `\\mathbf{v}(t) = ${vec(tL(pDer(x)), tL(pDer(y)))}`,
      ),
      step(
        "Differentiate again and evaluate",
        "再求导并代值",
        t(`Acceleration is the derivative of velocity; put in $t = ${t0}$:`, `加速度是速度的导数；代入 $t = ${t0}$：`),
        `\\mathbf{a}(t) = ${vec(tL(pDer(pDer(x))), tL(pDer(pDer(y))))}`,
        `\\mathbf{a}(${t0}) = ${pairL(answer)}`,
      ),
    ],
    t(
      `For $c_0 + c_1t + c_2t^{2} + c_3t^{3}$ the second derivative is $2c_2 + 6c_3t$:\n\n$$${secondFormula(x, "x", t0)}, \\qquad ${secondFormula(y, "y", t0)}$$`,
      `对 $c_0 + c_1t + c_2t^{2} + c_3t^{3}$，二阶导数是 $2c_2 + 6c_3t$：\n\n$$${secondFormula(x, "x", t0)}, \\qquad ${secondFormula(y, "y", t0)}$$`,
    ),
    [
      [at(pDer(x), pDer(y), t0), "This is the velocity; acceleration needs a second derivative", "这是速度；加速度还要再求一次导数"],
      [at(pDer(pDer(x)), pDer(pDer(y)), 0), `This is $\\mathbf{a}(0)$; put in $t = ${t0}$`, `这是 $\\mathbf{a}(0)$；应代入 $t = ${t0}$`],
      [at(x, y, t0), "This is the position; differentiate it twice", "这是位置；要求两次导数"],
      [swap(answer), "The components are swapped: the first entry is $x''(t)$", "分量顺序颠倒了：第一个是 $x''(t)$"],
    ],
  );
}

/** circularMotion finds the speed or the magnitude of acceleration in uniform circular motion. */
function circularMotion(rng: Rng) {
  const R = rng.int(2, 9);
  const w = rng.int(2, 5);
  const fn = (f: string) => `${R}\\${f}(${w}t)`;
  const intro = motionPrompt(fn("cos"), fn("sin"));
  const askSpeed = rng.bool();
  const answer = askSpeed ? R * w : R * w * w;
  const velocity = step(
    "Differentiate once",
    "求一次导数",
    t("The velocity and its length, using $\\sin^{2} + \\cos^{2} = 1$:", "速度及其长度，用到 $\\sin^{2} + \\cos^{2} = 1$："),
    `\\mathbf{v}(t) = \\langle -${R * w}\\sin(${w}t), ${R * w}\\cos(${w}t) \\rangle`,
    `\\|\\mathbf{v}\\| = ${R * w}\\sqrt{\\sin^{2}(${w}t) + \\cos^{2}(${w}t)} = ${R * w}`,
  );
  const acceleration = step(
    "Differentiate again",
    "再求一次导数",
    t("The acceleration is a multiple of the position, pointing to the center:", "加速度是位置的倍数，指向圆心："),
    `\\mathbf{a}(t) = \\langle -${R * w * w}\\cos(${w}t), -${R * w * w}\\sin(${w}t) \\rangle = -${w * w}\\mathbf{r}(t)`,
    `\\|\\mathbf{a}\\| = ${w * w} \\cdot ${R} = ${R * w * w}`,
  );
  return numberWorked(
    t(
      `${intro.en} Find the ${askSpeed ? "speed" : "magnitude of the acceleration"} of the particle.`,
      `${intro["zh-CN"]}求质点的${askSpeed ? "速率" : "加速度大小"}。`,
    ),
    answer,
    askSpeed
      ? [
          step(
            "Read the circle",
            "读出圆",
            t(
              `The particle goes round a circle of radius $${R}$, $${w}$ radians per second.`,
              `质点沿半径为 $${R}$ 的圆运动，每秒转 $${w}$ 弧度。`,
            ),
          ),
          velocity,
        ]
      : [velocity, acceleration],
    askSpeed
      ? t(
          `One turn of length $2\\pi \\cdot ${R}$ takes $\\frac{2\\pi}{${w}}$ seconds, so the speed is $\\frac{2\\pi \\cdot ${R}}{2\\pi / ${w}} = ${R * w}$.`,
          `一圈长 $2\\pi \\cdot ${R}$，用时 $\\frac{2\\pi}{${w}}$ 秒，所以速率是 $\\frac{2\\pi \\cdot ${R}}{2\\pi / ${w}} = ${R * w}$。`,
        )
      : t(
          `Circular motion has $\\|\\mathbf{a}\\| = \\frac{v^{2}}{R}$: $\\frac{${R * w}^{2}}{${R}} = \\frac{${R * R * w * w}}{${R}} = ${R * w * w}$.`,
          `圆周运动有 $\\|\\mathbf{a}\\| = \\frac{v^{2}}{R}$：$\\frac{${R * w}^{2}}{${R}} = \\frac{${R * R * w * w}}{${R}} = ${R * w * w}$。`,
        ),
    askSpeed
      ? [
          [R, "This is the radius, a distance; the speed is the radius times the angular rate", "这是半径，是距离；速率是半径乘角速度"],
          [R * w * w, "This is the size of the acceleration; the speed needs one derivative", "这是加速度的大小；速率只需求一次导数"],
          [
            w,
            `This is the angular rate in radians per second; multiply by the radius $${R}$`,
            `这是以弧度/秒计的角速度；还要乘以半径 $${R}$`,
          ],
        ]
      : [
          [R * w, "This is the speed; the acceleration needs a second derivative", "这是速率；加速度还要再求一次导数"],
          [
            w * w,
            `This leaves out the radius: $\\mathbf{a} = -${w * w}\\mathbf{r}$ and $\\|\\mathbf{r}\\| = ${R}$`,
            `这里漏了半径：$\\mathbf{a} = -${w * w}\\mathbf{r}$，而 $\\|\\mathbf{r}\\| = ${R}$`,
          ],
          [R * R * w * w, `This is the speed squared, $v^{2}$; divide by the radius $${R}$`, `这是速率的平方 $v^{2}$；还要除以半径 $${R}$`],
          [
            0,
            "The speed is constant, but the direction of the velocity turns, so the acceleration is not zero",
            "速率不变，但速度的方向在转，所以加速度不为零",
          ],
        ],
    askSpeed ? "m/s" : "m/s^2",
  );
}

/** calculatingAccelerationForPlaneMotionUsingDifferentiation differentiates velocity vectors. */
export const calculatingAccelerationForPlaneMotionUsingDifferentiation: TopicDef = {
  id: "calculating-acceleration-for-plane-motion-using-differentiation",
  title: t("Calculating Acceleration for Plane Motion Using Differentiation", "用求导计算平面运动的加速度"),
  summary: t("The acceleration of a particle is a(t) = v′(t) = r″(t).", "质点的加速度为 a(t) = v′(t) = r″(t)。"),
  intro: t(
    "Acceleration is the derivative of velocity, so it is the second derivative of position. For $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$:\n\n$$\\mathbf{v}(t) = \\langle 3t^{2}, 2t \\rangle, \\qquad \\mathbf{a}(t) = \\langle 6t, 2 \\rangle, \\qquad \\mathbf{a}(1) = \\langle 6, 2 \\rangle.$$\n\nCheck: the velocity changes from $\\langle 3, 2 \\rangle$ at $t = 1$ to $\\langle 3.0603, 2.02 \\rangle$ at $t = 1.01$, a change of about $0.01 \\cdot \\langle 6, 2 \\rangle$.\n\nIn this lesson we find acceleration vectors and see that motion around a circle at constant speed still has an acceleration, pointing to the center.",
    "加速度是速度的导数，所以是位置的二阶导数。对 $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$：\n\n$$\\mathbf{v}(t) = \\langle 3t^{2}, 2t \\rangle, \\qquad \\mathbf{a}(t) = \\langle 6t, 2 \\rangle, \\qquad \\mathbf{a}(1) = \\langle 6, 2 \\rangle$$\n\n检验：速度从 $t = 1$ 时的 $\\langle 3, 2 \\rangle$ 变为 $t = 1.01$ 时的 $\\langle 3.0603, 2.02 \\rangle$，变化约为 $0.01 \\cdot \\langle 6, 2 \\rangle$。\n\n本课我们求加速度向量，并看到以恒定速率绕圆运动时仍有指向圆心的加速度。",
  ),
  prerequisites: [
    "calculating-velocity-for-plane-motion-using-differentiation",
    "calculating-acceleration-for-straight-line-motion-using-differentiation",
  ],
  encompasses: [{ topic: "calculating-velocity-for-plane-motion-using-differentiation", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "acceleration-vectors-from-position",
      title: t("Acceleration vectors from position", "由位置求加速度向量"),
      explanation: t(
        "Differentiate the position once to get velocity and again to get acceleration, working on each component separately. The **acceleration** is the derivative of velocity: $\\mathbf{a}(t) = \\mathbf{v}'(t) = \\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$. For $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$: $\\mathbf{v}(t) = \\langle 3t^{2}, 2t \\rangle$ and $\\mathbf{a}(t) = \\langle 6t, 2 \\rangle$.\n\nCheck: the second derivative of $c_2t^{2} + c_3t^{3}$ is $2c_2 + 6c_3t$, which gives $6t$ for $t^{3}$ and $2$ for $t^{2}$.\n\n> **Watch out.** The velocity $\\mathbf{v}(1) = \\langle 3, 2 \\rangle$ is one derivative short of the acceleration $\\mathbf{a}(1) = \\langle 6, 2 \\rangle$.",
        "对位置求一次导数得到速度，再求一次得到加速度，每个分量分别计算。**加速度**是速度的导数：$\\mathbf{a}(t) = \\mathbf{v}'(t) = \\mathbf{r}''(t) = \\langle x''(t), y''(t) \\rangle$。对 $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$：$\\mathbf{v}(t) = \\langle 3t^{2}, 2t \\rangle$，$\\mathbf{a}(t) = \\langle 6t, 2 \\rangle$。\n\n检验：$c_2t^{2} + c_3t^{3}$ 的二阶导数是 $2c_2 + 6c_3t$，$t^{3}$ 得 $6t$，$t^{2}$ 得 $2$。\n\n> **注意。** 速度 $\\mathbf{v}(1) = \\langle 3, 2 \\rangle$ 比加速度 $\\mathbf{a}(1) = \\langle 6, 2 \\rangle$ 少求了一次导数。",
      ),
      generate: planeAcceleration,
    },
    {
      id: "uniform-circular-motion",
      figure: calculusDrawings5["calculating-acceleration-for-plane-motion-using-differentiation#uniform-circular-motion"],
      title: t("Uniform circular motion", "匀速圆周运动"),
      explanation: t(
        "A particle with $\\mathbf{r}(t) = \\langle R\\cos(\\omega t), R\\sin(\\omega t) \\rangle$ moves around a circle of radius $R$. Its speed is constant, $R\\omega$, yet it accelerates: $\\mathbf{a}(t) = -\\omega^{2}\\mathbf{r}(t)$ points toward the center with magnitude $R\\omega^{2}$. For $R = 3$ and $\\omega = 2$ the speed is $6$ and the acceleration has size $12$.\n\nCheck: $\\frac{v^{2}}{R} = \\frac{36}{3} = 12$, the usual formula for circular motion.\n\n> **Watch out.** Constant speed does not mean zero acceleration: the direction of the velocity keeps turning.",
        "$\\mathbf{r}(t) = \\langle R\\cos(\\omega t), R\\sin(\\omega t) \\rangle$ 的质点沿半径为 $R$ 的圆运动。它的速率恒为 $R\\omega$，但仍有加速度：$\\mathbf{a}(t) = -\\omega^{2}\\mathbf{r}(t)$ 指向圆心，大小为 $R\\omega^{2}$。$R = 3$、$\\omega = 2$ 时速率为 $6$，加速度大小为 $12$。\n\n检验：$\\frac{v^{2}}{R} = \\frac{36}{3} = 12$，正是圆周运动的常用公式。\n\n> **注意。** 速率不变不等于加速度为零：速度的方向一直在转。",
      ),
      generate: circularMotion,
    },
  ],
};

/** velocityFromAcceleration integrates acceleration from an initial velocity. */
function velocityFromAcceleration(rng: Rng) {
  const [x, y] = [linear(rng), linear(rng)];
  const v0: Pair = [Q.of(rng.int(-6, 6)), Q.of(rng.int(-6, 6))];
  const t1 = rng.int(1, 4);
  const change = integral(x, y, 0, t1);
  const answer = add(v0, change);
  const exactV = (p: Poly, c: Q) => {
    const half = Q.of(p[1] ?? 0, 2);
    const s = poly([half, "t^{2}"], [p[0] ?? 0, "t"], [c, ""]);
    return s === "" ? "0" : s;
  };
  return vectorWorked(
    t(
      `A particle moving in the plane has acceleration $\\mathbf{a}(t) = ${vec(tL(x), tL(y))}$ m/s² and initial velocity $\\mathbf{v}(0) = ${pairL(v0)}$ m/s. Find its velocity at $t = ${t1}$. ${enterVector.en}`,
      `平面上运动的质点的加速度为 $\\mathbf{a}(t) = ${vec(tL(x), tL(y))}$ 米/秒²，初速度为 $\\mathbf{v}(0) = ${pairL(v0)}$ 米/秒。求 $t = ${t1}$ 时的速度。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Integrate the acceleration",
        "对加速度积分",
        t(`The change in velocity from $0$ to $${t1}$:`, `从 $0$ 到 $${t1}$ 速度的变化量：`),
        `\\int_{0}^{${t1}} \\mathbf{a}(t) \\, dt = ${vec(`\\left[${antiL(x)}\\right]_{0}^{${t1}}`, `\\left[${antiL(y)}\\right]_{0}^{${t1}}`)} = ${pairL(change)}`,
      ),
      step("Add the starting velocity", "加上初速度", t("", ""), `\\mathbf{v}(${t1}) = ${pairL(v0)} + ${pairL(change)} = ${pairL(answer)}`),
    ],
    t(
      `Substitute back: $\\mathbf{v}(t) = ${vec(exactV(x, v0[0]), exactV(y, v0[1]))}$ has derivative $${vec(tL(x), tL(y))}$, the given acceleration, and $\\mathbf{v}(0) = ${pairL(v0)}$.`,
      `代回检验：$\\mathbf{v}(t) = ${vec(exactV(x, v0[0]), exactV(y, v0[1]))}$ 的导数是 $${vec(tL(x), tL(y))}$，正是给出的加速度，且 $\\mathbf{v}(0) = ${pairL(v0)}$。`,
    ),
    [
      [
        change,
        `This is only the change in velocity; add $\\mathbf{v}(0) = ${pairL(v0)}$`,
        `这只是速度的变化量；还要加上 $\\mathbf{v}(0) = ${pairL(v0)}$`,
      ],
      [
        add(v0, at(x, y, t1)),
        `This adds the acceleration at $t = ${t1}$; the change in velocity is its integral`,
        `这里加的是 $t = ${t1}$ 时的加速度；速度的变化量是它的积分`,
      ],
      [
        add(v0, scale(Q.of(t1), at(x, y, t1))),
        `This treats the acceleration as constant at its final value $\\mathbf{a}(${t1})$; it changes with $t$, so integrate`,
        `这里把加速度当作一直等于终值 $\\mathbf{a}(${t1})$；它随 $t$ 变化，要积分`,
      ],
      [
        add(v0, scale(Q.of(-1), change)),
        "This subtracts the change; the integral of the acceleration is added",
        "这里把变化量减掉了；加速度的积分要加上去",
      ],
    ],
  );
}

/** projectileVelocity finds the velocity of a projectile, or when it reaches its highest point. */
function projectileVelocity(rng: Rng) {
  const u = rng.int(3, 20);
  const w = rng.int(5, 40);
  const setting = t(
    `A ball is thrown with initial velocity $\\mathbf{v}(0) = \\langle ${u}, ${w} \\rangle$ m/s. Its only acceleration is gravity, $\\mathbf{a}(t) = \\langle 0, -10 \\rangle$ m/s².`,
    `一个球以初速度 $\\mathbf{v}(0) = \\langle ${u}, ${w} \\rangle$ 米/秒抛出，唯一的加速度是重力 $\\mathbf{a}(t) = \\langle 0, -10 \\rangle$ 米/秒²。`,
  );
  const integrate = step(
    "Integrate the acceleration",
    "对加速度积分",
    t("Add the integral of gravity to the initial velocity:", "把重力的积分加到初速度上："),
    `\\mathbf{v}(t) = \\langle ${u}, ${w} \\rangle + \\int_{0}^{t} \\langle 0, -10 \\rangle \\, ds = \\langle ${u}, ${w} - 10t \\rangle`,
  );
  if (rng.bool()) {
    const t1 = rng.int(1, 5);
    const answer: Pair = [Q.of(u), Q.of(w - 10 * t1)];
    return vectorWorked(
      t(
        `${setting.en} Find its velocity at $t = ${t1}$. ${enterVector.en}`,
        `${setting["zh-CN"]}求 $t = ${t1}$ 时的速度。${enterVector["zh-CN"]}`,
      ),
      answer,
      [
        integrate,
        step(
          "Evaluate",
          "代值",
          t(`Put in $t = ${t1}$:`, `代入 $t = ${t1}$：`),
          `\\mathbf{v}(${t1}) = \\langle ${u}, ${w} - ${10 * t1} \\rangle = ${pairL(answer)}`,
        ),
      ],
      t(
        `Gravity takes $10$ m/s off the vertical velocity each second and leaves the horizontal velocity alone: after $${t1}$ s the vertical velocity is $${w} - ${t1} \\cdot 10 = ${w - 10 * t1}$ and the horizontal one is still $${u}$.`,
        `重力每秒使竖直速度减少 $10$ 米/秒，而不改变水平速度：$${t1}$ 秒后竖直速度为 $${w} - ${t1} \\cdot 10 = ${w - 10 * t1}$，水平速度仍为 $${u}$。`,
      ),
      [
        [
          [Q.of(u - 10 * t1), Q.of(w - 10 * t1)],
          "Gravity acts only vertically; the horizontal velocity does not change",
          "重力只沿竖直方向；水平速度不变",
        ],
        [
          [Q.of(u), Q.of(w + 10 * t1)],
          "Gravity points down, so the vertical velocity decreases: subtract $10t$",
          "重力向下，所以竖直速度减小：要减去 $10t$",
        ],
        [
          [Q.zero, Q.of(w - 10 * t1)],
          `With no horizontal force the horizontal velocity stays $${u}$`,
          `没有水平方向的力，水平速度一直是 $${u}$`,
        ],
      ],
    );
  }
  const answer = Q.of(w, 10);
  return numberWorked(
    t(`${setting.en} At what time does it reach its highest point?`, `${setting["zh-CN"]}它在什么时刻到达最高点？`),
    answer,
    [
      integrate,
      step(
        "Set the vertical velocity to zero",
        "令竖直速度为零",
        t("At the highest point the ball stops rising before it starts to fall:", "在最高点，球停止上升，随后开始下落："),
        `${w} - 10t = 0 \\quad\\Rightarrow\\quad t = ${answer.toLatex()}`,
      ),
    ],
    t(
      `The vertical velocity $${w} - 10t$ is $${w}$ at the start and loses $10$ each second, so it takes $\\frac{${w}}{10} = ${answer.toLatex()}$ seconds to reach $0$; substituting, $${w} - 10 \\cdot ${answer.toLatex()} = 0$.`,
      `竖直速度 $${w} - 10t$ 起初为 $${w}$，每秒减少 $10$，所以减到 $0$ 要 $\\frac{${w}}{10} = ${answer.toLatex()}$ 秒；代入得 $${w} - 10 \\cdot ${answer.toLatex()} = 0$。`,
    ),
    [
      [
        Q.of(w, 5),
        "This is the time to come back down to the starting height, twice the time to the top",
        "这是落回起始高度的时间，是到达最高点时间的两倍",
      ],
      [
        Q.of(u, 10),
        `This uses the horizontal velocity $${u}$, which never becomes zero; the top is where the vertical velocity is zero`,
        `这里用了水平速度 $${u}$，它不会变为零；最高点是竖直速度为零的地方`,
      ],
      [
        Q.of(w + u, 10),
        "This adds the components; only the vertical velocity becomes zero at the top",
        "这里把两个分量相加了；在最高点只有竖直速度为零",
      ],
    ],
    "s",
  );
}

/** findingVelocityVectorsInTwoDimensionsUsingIntegration integrates acceleration vectors. */
export const findingVelocityVectorsInTwoDimensionsUsingIntegration: TopicDef = {
  id: "finding-velocity-vectors-in-two-dimensions-using-integration",
  title: t("Finding Velocity Vectors in Two Dimensions Using Integration", "用积分求二维速度向量"),
  summary: t(
    "$\\mathbf{v}(t_1) = \\mathbf{v}(0) + \\int_0^{t_1} \\mathbf{a}(t)\\,dt$, computed component by component.",
    "$\\mathbf{v}(t_1) = \\mathbf{v}(0) + \\int_0^{t_1} \\mathbf{a}(t)\\,dt$，按分量计算。",
  ),
  intro: t(
    "Velocity is an antiderivative of acceleration, so the change in velocity is the integral of acceleration. For $\\mathbf{a}(t) = \\langle 2t, -1 \\rangle$ and $\\mathbf{v}(0) = \\langle 1, 3 \\rangle$:\n\n$$\\mathbf{v}(2) = \\langle 1, 3 \\rangle + \\int_{0}^{2} \\langle 2t, -1 \\rangle \\, dt = \\langle 1, 3 \\rangle + \\langle 4, -2 \\rangle = \\langle 5, 1 \\rangle.$$\n\nCheck: $\\mathbf{v}(t) = \\langle t^{2} + 1, 3 - t \\rangle$ has derivative $\\langle 2t, -1 \\rangle$ and starts at $\\langle 1, 3 \\rangle$; at $t = 2$ it is $\\langle 5, 1 \\rangle$.\n\nIn this lesson we find velocity from acceleration and an initial velocity, including the velocity of a thrown ball.",
    "速度是加速度的原函数，所以速度的变化量是加速度的积分。对 $\\mathbf{a}(t) = \\langle 2t, -1 \\rangle$、$\\mathbf{v}(0) = \\langle 1, 3 \\rangle$：\n\n$$\\mathbf{v}(2) = \\langle 1, 3 \\rangle + \\int_{0}^{2} \\langle 2t, -1 \\rangle \\, dt = \\langle 1, 3 \\rangle + \\langle 4, -2 \\rangle = \\langle 5, 1 \\rangle$$\n\n检验：$\\mathbf{v}(t) = \\langle t^{2} + 1, 3 - t \\rangle$ 的导数是 $\\langle 2t, -1 \\rangle$，起始值是 $\\langle 1, 3 \\rangle$；在 $t = 2$ 时为 $\\langle 5, 1 \\rangle$。\n\n本课我们由加速度和初速度求速度，包括抛出的球的速度。",
  ),
  prerequisites: [
    "integrating-vector-valued-functions",
    "calculating-acceleration-for-plane-motion-using-differentiation",
    "calculating-velocity-using-integration",
  ],
  encompasses: [{ topic: "integrating-vector-valued-functions", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "velocity-from-acceleration-in-the-plane",
      title: t("Velocity from acceleration in the plane", "由加速度求平面速度"),
      explanation: t(
        "Integrating acceleration over a time interval gives the change in velocity, which is then added to the starting velocity:\n\n$$\\mathbf{v}(t_{1}) = \\mathbf{v}(0) + \\int_{0}^{t_{1}} \\mathbf{a}(t) \\, dt.$$\n\nFor $\\mathbf{a}(t) = \\langle 2t, -1 \\rangle$ and $\\mathbf{v}(0) = \\langle 1, 3 \\rangle$: $\\mathbf{v}(t) = \\langle t^{2} + 1, 3 - t \\rangle$.\n\nCheck: the derivative of $\\langle t^{2} + 1, 3 - t \\rangle$ is $\\langle 2t, -1 \\rangle$, and at $t = 0$ it is $\\langle 1, 3 \\rangle$.\n\n> **Watch out.** When the acceleration changes with time, multiplying its final value by the time is not its integral.",
        "把加速度在时间区间上积分得到速度的变化量，再加到初始速度上：\n\n$$\\mathbf{v}(t_{1}) = \\mathbf{v}(0) + \\int_{0}^{t_{1}} \\mathbf{a}(t) \\, dt$$\n\n对 $\\mathbf{a}(t) = \\langle 2t, -1 \\rangle$、$\\mathbf{v}(0) = \\langle 1, 3 \\rangle$：$\\mathbf{v}(t) = \\langle t^{2} + 1, 3 - t \\rangle$。\n\n检验：$\\langle t^{2} + 1, 3 - t \\rangle$ 的导数是 $\\langle 2t, -1 \\rangle$，在 $t = 0$ 时为 $\\langle 1, 3 \\rangle$。\n\n> **注意。** 加速度随时间变化时，用它的终值乘以时间并不是它的积分。",
      ),
      generate: velocityFromAcceleration,
    },
    {
      id: "projectile-velocity",
      title: t("Projectile velocity", "抛体的速度"),
      explanation: t(
        "Near the ground, ignoring air resistance, a projectile's acceleration is $\\langle 0, -g \\rangle$; here $g = 10$ m/s². Integrating, $\\mathbf{v}(t) = \\langle u, w - 10t \\rangle$ for initial velocity $\\langle u, w \\rangle$: the horizontal velocity stays $u$, and the projectile is highest when the vertical velocity $w - 10t$ is zero. For $\\langle 4, 20 \\rangle$ that happens at $t = 2$.\n\nCheck: the vertical velocity goes $20, 10, 0$ at $t = 0, 1, 2$, losing $10$ each second.\n\n> **Watch out.** Gravity changes only the vertical component; the horizontal velocity is the same at every moment.",
        "在地面附近、忽略空气阻力时，抛体的加速度为 $\\langle 0, -g \\rangle$，这里取 $g = 10$ 米/秒²。积分得 $\\mathbf{v}(t) = \\langle u, w - 10t \\rangle$（初速度为 $\\langle u, w \\rangle$）：水平速度保持为 $u$，竖直速度 $w - 10t$ 为零时抛体最高。对 $\\langle 4, 20 \\rangle$，这发生在 $t = 2$。\n\n检验：在 $t = 0, 1, 2$ 时竖直速度依次为 $20, 10, 0$，每秒减少 $10$。\n\n> **注意。** 重力只改变竖直分量；水平速度在每一时刻都相同。",
      ),
      generate: projectileVelocity,
    },
  ],
};

/** planeDisplacement integrates velocity over an interval. */
function planeDisplacement(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const answer = integral(x, y, a, b);
  const diff = add(at(x, y, b), scale(Q.of(-1), at(x, y, a)));
  return vectorWorked(
    t(
      `A particle moving in the plane has velocity $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ m/s. Find its displacement vector from $t = ${a}$ to $t = ${b}$, in meters. ${enterVector.en}`,
      `平面上运动的质点的速度为 $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ 米/秒。求它从 $t = ${a}$ 到 $t = ${b}$ 的位移向量（单位：米）。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Antidifferentiate the velocity",
        "对速度求原函数",
        t("Any antiderivative will do, since the constant cancels:", "任取一个原函数即可，常数会抵消："),
        `\\mathbf{R}(t) = ${vec(antiL(x), antiL(y))}`,
      ),
      step(
        "Subtract the values at the ends",
        "用两端的值相减",
        t(`The displacement is $\\mathbf{R}(${b}) - \\mathbf{R}(${a})$:`, `位移是 $\\mathbf{R}(${b}) - \\mathbf{R}(${a})$：`),
        `${pairL(integral(x, y, 0, b))} - ${pairL(integral(x, y, 0, a))} = ${pairL(answer)}`,
      ),
    ],
    t(
      `Simpson's rule $\\frac{b - a}{6}\\left(f(a) + 4f(m) + f(b)\\right)$ is exact for quadratics:\n\n$$${simpson(x, a, b)}, \\qquad ${simpson(y, a, b)}$$`,
      `辛普森公式 $\\frac{b - a}{6}\\left(f(a) + 4f(m) + f(b)\\right)$ 对二次函数是精确的：\n\n$$${simpson(x, a, b)}, \\qquad ${simpson(y, a, b)}$$`,
    ),
    [
      [
        diff,
        `This is $\\mathbf{v}(${b}) - \\mathbf{v}(${a})$, the change in velocity; the displacement integrates the velocity`,
        `这是 $\\mathbf{v}(${b}) - \\mathbf{v}(${a})$，即速度的变化量；位移要对速度积分`,
      ],
      [integral(x, y, 0, b), `This integrates from $0$; the motion starts at $t = ${a}$`, `这里从 $0$ 开始积分；运动从 $t = ${a}$ 算起`],
      [at(x, y, b), `This is the velocity at $t = ${b}$, not the displacement`, `这是 $t = ${b}$ 时的速度，不是位移`],
      [swap(answer), "The components are swapped: the first entry comes from $x'(t)$", "分量顺序颠倒了：第一个来自速度的第一个分量"],
    ],
  );
}

/** planePosition finds the position at a given time from velocity and the initial position. */
function planePosition(rng: Rng) {
  const [x, y] = [quadratic(rng), quadratic(rng)];
  const r0: Pair = [Q.of(rng.int(-8, 8)), Q.of(rng.int(-8, 8))];
  const t1 = rng.int(1, 4);
  const change = integral(x, y, 0, t1);
  const answer = add(r0, change);
  const plusC = (s: string, c: Q) => (c.isZero() ? s : s === "0" ? c.toLatex() : `${s} ${c.sign() < 0 ? "-" : "+"} ${c.abs().toLatex()}`);
  return vectorWorked(
    t(
      `A particle moving in the plane has velocity $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ m/s and starts at $\\mathbf{r}(0) = ${pairL(r0)}$ m. Find its position at $t = ${t1}$. ${enterVector.en}`,
      `平面上运动的质点的速度为 $\\mathbf{v}(t) = ${vec(tL(x), tL(y))}$ 米/秒，起点为 $\\mathbf{r}(0) = ${pairL(r0)}$ 米。求 $t = ${t1}$ 时的位置。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Find the displacement",
        "求位移",
        t(`Integrate the velocity from $0$ to $${t1}$:`, `把速度从 $0$ 到 $${t1}$ 积分：`),
        `\\int_{0}^{${t1}} \\mathbf{v}(t) \\, dt = ${pairL(change)}`,
      ),
      step("Add the starting position", "加上起点", t("", ""), `\\mathbf{r}(${t1}) = ${pairL(r0)} + ${pairL(change)} = ${pairL(answer)}`),
    ],
    t(
      `Substitute back: $\\mathbf{r}(t) = ${vec(plusC(antiL(x), r0[0]), plusC(antiL(y), r0[1]))}$ has derivative $${vec(tL(x), tL(y))}$, the given velocity, and starts at $${pairL(r0)}$.`,
      `代回检验：$\\mathbf{r}(t) = ${vec(plusC(antiL(x), r0[0]), plusC(antiL(y), r0[1]))}$ 的导数是 $${vec(tL(x), tL(y))}$，正是给出的速度，起点是 $${pairL(r0)}$。`,
    ),
    [
      [change, `This is the displacement only; add the starting position $${pairL(r0)}$`, `这只是位移；还要加上起点 $${pairL(r0)}$`],
      [
        add(r0, at(x, y, t1)),
        `This adds the velocity at $t = ${t1}$; the displacement is the integral of the velocity`,
        `这里加的是 $t = ${t1}$ 时的速度；位移是速度的积分`,
      ],
      [
        add(r0, at(pDer(x), pDer(y), t1)),
        "This differentiates the velocity; position comes from integrating it",
        "这里对速度求了导；位置要对速度积分",
      ],
    ],
  );
}

/** findingDisplacementVectorsInTwoDimensionsUsingIntegration integrates velocity vectors. */
export const findingDisplacementVectorsInTwoDimensionsUsingIntegration: TopicDef = {
  id: "finding-displacement-vectors-in-two-dimensions-using-integration",
  title: t("Finding Displacement Vectors in Two Dimensions Using Integration", "用积分求二维位移向量"),
  summary: t(
    "The displacement from $t = a$ to $t = b$ is $\\int_a^b \\mathbf{v}(t)\\,dt$, and $\\mathbf{r}(t_1) = \\mathbf{r}(0) + \\int_0^{t_1} \\mathbf{v}(t)\\,dt$.",
    "从 $t = a$ 到 $t = b$ 的位移为 $\\int_a^b \\mathbf{v}(t)\\,dt$，且 $\\mathbf{r}(t_1) = \\mathbf{r}(0) + \\int_0^{t_1} \\mathbf{v}(t)\\,dt$。",
  ),
  intro: t(
    "Integrating velocity gives the change in position, the displacement. For $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$ from $t = 1$ to $t = 3$:\n\n$$\\int_{1}^{3} \\langle 2t, 3 \\rangle \\, dt = \\left\\langle \\left[t^{2}\\right]_{1}^{3}, \\left[3t\\right]_{1}^{3} \\right\\rangle = \\langle 8, 6 \\rangle.$$\n\nCheck: the position $\\mathbf{r}(t) = \\langle t^{2}, 3t \\rangle$ has this velocity and goes from $(1, 3)$ to $(9, 9)$, a change of $\\langle 8, 6 \\rangle$.\n\nIn this lesson we find displacement vectors and positions from velocity, including how far a projectile travels.",
    "对速度积分得到位置的变化量，即位移。对 $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$，从 $t = 1$ 到 $t = 3$：\n\n$$\\int_{1}^{3} \\langle 2t, 3 \\rangle \\, dt = \\left\\langle \\left[t^{2}\\right]_{1}^{3}, \\left[3t\\right]_{1}^{3} \\right\\rangle = \\langle 8, 6 \\rangle$$\n\n检验：位置 $\\mathbf{r}(t) = \\langle t^{2}, 3t \\rangle$ 具有这个速度，从 $(1, 3)$ 走到 $(9, 9)$，变化为 $\\langle 8, 6 \\rangle$。\n\n本课我们由速度求位移向量和位置，包括抛体飞行的水平距离。",
  ),
  prerequisites: [
    "finding-velocity-vectors-in-two-dimensions-using-integration",
    "calculating-the-displacement-of-a-particle-using-integration",
  ],
  encompasses: [{ topic: "finding-velocity-vectors-in-two-dimensions-using-integration", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "displacement-vectors-from-velocity",
      title: t("Displacement vectors from velocity", "由速度求位移向量"),
      explanation: t(
        "The displacement vector points from where the object started to where it ended, regardless of the path it followed in between. The **displacement** from $t = a$ to $t = b$ is the change in position,\n\n$$\\mathbf{r}(b) - \\mathbf{r}(a) = \\int_{a}^{b} \\mathbf{v}(t) \\, dt.$$\n\nFor $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$ from $t = 1$ to $t = 3$: $\\left\\langle \\int_{1}^{3} 2t \\, dt, \\int_{1}^{3} 3 \\, dt \\right\\rangle = \\langle 8, 6 \\rangle$.\n\nCheck: $\\mathbf{r}(t) = \\langle t^{2}, 3t \\rangle$ goes from $(1, 3)$ to $(9, 9)$.\n\n> **Watch out.** $\\mathbf{v}(3) - \\mathbf{v}(1) = \\langle 4, 0 \\rangle$ is the change in velocity, not the displacement.",
        "位移向量从物体的起点指向终点，与中间经过的路径无关。从 $t = a$ 到 $t = b$ 的**位移**是位置的变化量：\n\n$$\\mathbf{r}(b) - \\mathbf{r}(a) = \\int_{a}^{b} \\mathbf{v}(t) \\, dt$$\n\n对 $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$，从 $t = 1$ 到 $t = 3$：$\\left\\langle \\int_{1}^{3} 2t \\, dt, \\int_{1}^{3} 3 \\, dt \\right\\rangle = \\langle 8, 6 \\rangle$。\n\n检验：$\\mathbf{r}(t) = \\langle t^{2}, 3t \\rangle$ 从 $(1, 3)$ 走到 $(9, 9)$。\n\n> **注意。** $\\mathbf{v}(3) - \\mathbf{v}(1) = \\langle 4, 0 \\rangle$ 是速度的变化量，不是位移。",
      ),
      generate: planeDisplacement,
    },
    {
      id: "position-from-velocity-in-the-plane",
      title: t("Position from velocity in the plane", "由速度求平面位置"),
      explanation: t(
        "The position at a later time is the starting position plus the displacement, found by integrating each component of the velocity: $\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{v}(t) \\, dt$. For $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$ and $\\mathbf{r}(0) = \\langle 1, 1 \\rangle$: $\\mathbf{r}(2) = \\langle 1, 1 \\rangle + \\langle 4, 6 \\rangle = \\langle 5, 7 \\rangle$.\n\nCheck: $\\mathbf{r}(t) = \\langle t^{2} + 1, 3t + 1 \\rangle$ has velocity $\\langle 2t, 3 \\rangle$, starts at $\\langle 1, 1 \\rangle$, and at $t = 2$ is $\\langle 5, 7 \\rangle$.\n\n> **Watch out.** The integral gives only the displacement $\\langle 4, 6 \\rangle$; the particle did not start at the origin.",
        "之后某一时刻的位置等于初始位置加上位移，位移由速度的各个分量积分得到：$\\mathbf{r}(t_{1}) = \\mathbf{r}(0) + \\int_{0}^{t_{1}} \\mathbf{v}(t) \\, dt$。对 $\\mathbf{v}(t) = \\langle 2t, 3 \\rangle$、$\\mathbf{r}(0) = \\langle 1, 1 \\rangle$：$\\mathbf{r}(2) = \\langle 1, 1 \\rangle + \\langle 4, 6 \\rangle = \\langle 5, 7 \\rangle$。\n\n检验：$\\mathbf{r}(t) = \\langle t^{2} + 1, 3t + 1 \\rangle$ 的速度是 $\\langle 2t, 3 \\rangle$，起点为 $\\langle 1, 1 \\rangle$，在 $t = 2$ 时为 $\\langle 5, 7 \\rangle$。\n\n> **注意。** 积分只给出位移 $\\langle 4, 6 \\rangle$；质点并不是从原点出发的。",
      ),
      generate: planePosition,
    },
  ],
};

/** forceFromPosition applies F = ma to a particle whose position is given. */
function forceFromPosition(rng: Rng) {
  const [x, y] = [randomPoly(rng), randomPoly(rng)];
  const m = rng.int(2, 6);
  const t0 = rng.int(1, 3);
  const acc = at(pDer(pDer(x)), pDer(pDer(y)), t0);
  const answer = scale(Q.of(m), acc);
  return vectorWorked(
    t(
      `An object of mass $${m}$ kg moves in the plane with position $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$ meters at time $t$ seconds. Find the net force on it at $t = ${t0}$, in newtons. ${enterVector.en}`,
      `质量为 $${m}$ 千克的物体在平面上运动，$t$ 秒时的位置为 $\\mathbf{r}(t) = ${vec(tL(x), tL(y))}$ 米。求 $t = ${t0}$ 时它所受的合力（单位：牛顿）。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Find the acceleration",
        "求加速度",
        t("Differentiate the position twice:", "对位置求两次导数："),
        `\\mathbf{a}(t) = \\mathbf{r}''(t) = ${vec(tL(pDer(pDer(x))), tL(pDer(pDer(y))))}`,
        `\\mathbf{a}(${t0}) = ${pairL(acc)}`,
      ),
      step(
        "Multiply by the mass",
        "乘以质量",
        t("Newton's second law, $\\mathbf{F} = m\\mathbf{a}$:", "牛顿第二定律 $\\mathbf{F} = m\\mathbf{a}$："),
        `\\mathbf{F} = ${m}${pairL(acc)} = ${pairL(answer)}`,
      ),
    ],
    t(
      `Each component of the force is $m(2c_2 + 6c_3t)$, read off the coefficients of that component of the position: $${m}\\left(2 \\cdot ${par(x[2] ?? 0)} + 6 \\cdot ${par(x[3] ?? 0)} \\cdot ${t0}\\right) = ${answer[0].toLatex()}$ and $${m}\\left(2 \\cdot ${par(y[2] ?? 0)} + 6 \\cdot ${par(y[3] ?? 0)} \\cdot ${t0}\\right) = ${answer[1].toLatex()}$.`,
      `力的每个分量是 $m(2c_2 + 6c_3t)$，系数从位置的相应分量读出：$${m}\\left(2 \\cdot ${par(x[2] ?? 0)} + 6 \\cdot ${par(x[3] ?? 0)} \\cdot ${t0}\\right) = ${answer[0].toLatex()}$，$${m}\\left(2 \\cdot ${par(y[2] ?? 0)} + 6 \\cdot ${par(y[3] ?? 0)} \\cdot ${t0}\\right) = ${answer[1].toLatex()}$。`,
    ),
    [
      [acc, `This is the acceleration; multiply by the mass $${m}$ kg`, `这是加速度；还要乘以质量 $${m}$ 千克`],
      [
        scale(Q.of(m), at(pDer(x), pDer(y), t0)),
        "This multiplies the velocity by the mass; the force uses the acceleration",
        "这里用质量乘了速度；力要用加速度",
      ],
      [swap(answer), "The components are swapped: the first entry comes from $x(t)$", "分量顺序颠倒了：第一个来自 $x(t)$"],
    ],
  );
}

/** velocityFromForce finds the velocity of an object pushed by a constant force. */
function velocityFromForce(rng: Rng) {
  const m = rng.int(2, 5);
  const F: Pair = [Q.of(rng.int(-12, 12)), Q.of(rng.nonZero(-12, 12))];
  const v0: Pair = [Q.of(rng.int(-5, 5)), Q.of(rng.int(-5, 5))];
  const t1 = rng.int(2, 4);
  const acc = scale(Q.of(1, m), F);
  const answer = add(v0, scale(Q.of(t1), acc));
  return vectorWorked(
    t(
      `A constant force $\\mathbf{F} = ${pairL(F)}$ N acts on an object of mass $${m}$ kg, whose velocity at $t = 0$ is $${pairL(v0)}$ m/s. Find its velocity at $t = ${t1}$ s. ${enterVector.en}`,
      `恒力 $\\mathbf{F} = ${pairL(F)}$ 牛作用在质量为 $${m}$ 千克的物体上，物体在 $t = 0$ 时的速度为 $${pairL(v0)}$ 米/秒。求 $t = ${t1}$ 秒时的速度。${enterVector["zh-CN"]}`,
    ),
    answer,
    [
      step(
        "Find the acceleration",
        "求加速度",
        t("Divide the force by the mass:", "用力除以质量："),
        `\\mathbf{a} = \\frac{\\mathbf{F}}{${m}} = ${pairL(acc)}`,
      ),
      step(
        "Integrate the constant acceleration",
        "对恒定加速度积分",
        t(`A constant acceleration adds $t\\mathbf{a}$ to the velocity:`, `恒定加速度使速度增加 $t\\mathbf{a}$：`),
        `\\mathbf{v}(${t1}) = ${pairL(v0)} + ${t1}${pairL(acc)} = ${pairL(answer)}`,
      ),
    ],
    t(
      `Use momentum instead: the force times the time is the change in momentum, $${t1}${pairL(F)} = ${pairL(scale(Q.of(t1), F))}$, and $${m}${pairL(answer)} - ${m}${pairL(v0)} = ${pairL(add(scale(Q.of(m), answer), scale(Q.of(-m), v0)))}$ agrees.`,
      `改用动量来看：力乘时间等于动量的变化，$${t1}${pairL(F)} = ${pairL(scale(Q.of(t1), F))}$，而 $${m}${pairL(answer)} - ${m}${pairL(v0)} = ${pairL(add(scale(Q.of(m), answer), scale(Q.of(-m), v0)))}$，两者一致。`,
    ),
    [
      [
        add(v0, scale(Q.of(t1), F)),
        `This uses the force as the acceleration; divide by the mass $${m}$ first`,
        `这里把力当成了加速度；要先除以质量 $${m}$`,
      ],
      [
        scale(Q.of(t1), acc),
        `This is only the change in velocity; add the starting velocity $${pairL(v0)}$`,
        `这只是速度的变化量；还要加上初速度 $${pairL(v0)}$`,
      ],
      [
        add(v0, acc),
        `This adds one second's worth of acceleration; the force acts for $${t1}$ seconds`,
        `这里只加了一秒的加速度；力作用了 $${t1}$ 秒`,
      ],
    ],
  );
}

/** applyingNewtonsSecondLawInThePlane relates force, mass and acceleration vectors. */
export const applyingNewtonsSecondLawInThePlane: TopicDef = {
  id: "applying-newtons-second-law-in-the-plane",
  title: t("Applying Newton's Second Law in the Plane", "平面上的牛顿第二定律"),
  summary: t(
    "The net force on an object is F = ma, a vector equation that holds component by component.",
    "物体所受合力为 F = ma，这是一个按分量成立的向量方程。",
  ),
  intro: t(
    "Newton's second law, $\\mathbf{F} = m\\mathbf{a}$, holds for each component. An object of mass $2$ kg with position $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$ has $\\mathbf{a}(t) = \\langle 6t, 2 \\rangle$, so at $t = 1$:\n\n$$\\mathbf{F} = 2\\langle 6, 2 \\rangle = \\langle 12, 4 \\rangle \\text{ N}.$$\n\nCheck: dividing the force by the mass gives back $\\langle 6, 2 \\rangle$, the second derivative of $\\langle t^{3}, t^{2} \\rangle$ at $t = 1$.\n\nIn this lesson we find the force from the motion, and the motion from a force.",
    "牛顿第二定律 $\\mathbf{F} = m\\mathbf{a}$ 对每个分量都成立。质量为 $2$ 千克、位置为 $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$ 的物体有 $\\mathbf{a}(t) = \\langle 6t, 2 \\rangle$，所以在 $t = 1$ 时：\n\n$$\\mathbf{F} = 2\\langle 6, 2 \\rangle = \\langle 12, 4 \\rangle \\text{ 牛}$$\n\n检验：力除以质量回到 $\\langle 6, 2 \\rangle$，正是 $\\langle t^{3}, t^{2} \\rangle$ 在 $t = 1$ 处的二阶导数。\n\n本课我们由运动求力，也由力求运动。",
  ),
  prerequisites: ["finding-velocity-vectors-in-two-dimensions-using-integration", "newtons-second-law"],
  encompasses: [{ topic: "newtons-second-law", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "force-vectors-from-position",
      figure: calculusDrawings5["applying-newtons-second-law-in-the-plane#force-vectors-from-position"],
      title: t("Force vectors from position", "由位置求力向量"),
      explanation: t(
        "**Newton's second law** in the plane is the vector equation $\\mathbf{F} = m\\mathbf{a}$: the net force points the same way as the acceleration. With mass in kilograms and acceleration in m/s², force is in newtons. For $m = 2$ and $\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$: $\\mathbf{a}(1) = \\langle 6, 2 \\rangle$, so $\\mathbf{F} = \\langle 12, 4 \\rangle$ N.\n\nCheck: $\\frac{\\langle 12, 4 \\rangle}{2} = \\langle 6, 2 \\rangle$, the acceleration.\n\n> **Watch out.** Force goes with acceleration, not velocity: $2\\mathbf{v}(1) = \\langle 6, 4 \\rangle$ is a momentum, not a force.",
        "平面上的**牛顿第二定律**是向量方程 $\\mathbf{F} = m\\mathbf{a}$：合力与加速度方向相同。质量以千克、加速度以米/秒²计时，力的单位是牛顿。对 $m = 2$、$\\mathbf{r}(t) = \\langle t^{3}, t^{2} \\rangle$：$\\mathbf{a}(1) = \\langle 6, 2 \\rangle$，所以 $\\mathbf{F} = \\langle 12, 4 \\rangle$ 牛。\n\n检验：$\\frac{\\langle 12, 4 \\rangle}{2} = \\langle 6, 2 \\rangle$，正是加速度。\n\n> **注意。** 力对应的是加速度，不是速度：$2\\mathbf{v}(1) = \\langle 6, 4 \\rangle$ 是动量，不是力。",
      ),
      generate: forceFromPosition,
    },
    {
      id: "motion-under-a-constant-force",
      title: t("Motion under a constant force", "恒力作用下的运动"),
      explanation: t(
        "Given the force, $\\mathbf{a} = \\frac{\\mathbf{F}}{m}$; then integrate as usual. A constant force gives constant acceleration, so $\\mathbf{v}(t) = \\mathbf{v}(0) + t\\frac{\\mathbf{F}}{m}$. For $\\mathbf{F} = \\langle 6, -4 \\rangle$ N on $2$ kg starting at rest: $\\mathbf{v}(3) = 3\\langle 3, -2 \\rangle = \\langle 9, -6 \\rangle$ m/s.\n\nCheck: the momentum gained, $2\\langle 9, -6 \\rangle = \\langle 18, -12 \\rangle$, equals the force times the time, $3\\langle 6, -4 \\rangle$.\n\n> **Watch out.** Divide by the mass before integrating: the force itself is not the acceleration.",
        "已知力时，$\\mathbf{a} = \\frac{\\mathbf{F}}{m}$，再照常积分。恒力产生恒定加速度，所以 $\\mathbf{v}(t) = \\mathbf{v}(0) + t\\frac{\\mathbf{F}}{m}$。对 $\\mathbf{F} = \\langle 6, -4 \\rangle$ 牛作用于静止的 $2$ 千克物体：$\\mathbf{v}(3) = 3\\langle 3, -2 \\rangle = \\langle 9, -6 \\rangle$ 米/秒。\n\n检验：获得的动量 $2\\langle 9, -6 \\rangle = \\langle 18, -12 \\rangle$ 等于力乘时间 $3\\langle 6, -4 \\rangle$。\n\n> **注意。** 积分前先除以质量：力本身不是加速度。",
      ),
      generate: velocityFromForce,
    },
  ],
};

/** calculusIIVectorTopics are the topics of Calculus II modules 3.14 and 3.15. */
export const calculusIIVectorTopics: readonly TopicDef[] = [
  definingVectorValuedFunctions,
  differentiatingVectorValuedFunctions,
  integratingVectorValuedFunctions,
  calculatingVelocityForPlaneMotionUsingDifferentiation,
  calculatingAccelerationForPlaneMotionUsingDifferentiation,
  findingVelocityVectorsInTwoDimensionsUsingIntegration,
  findingDisplacementVectorsInTwoDimensionsUsingIntegration,
  applyingNewtonsSecondLawInThePlane,
];
