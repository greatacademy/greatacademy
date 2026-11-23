import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import { choiceProblem, numberProblem, say, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { bare, cdot, fracL, oneOf, type Poly, pAt, par, pDer, pLatex, power, sumLatex, table } from "./calculus-common.ts";
import { firsts, fmt, functionWith, none, quotients, type Value, walked } from "./calculus-i-differentiation.ts";

// Calculus I unit 5: Advanced Differentiation, module 5.11.

/** Inner is an inner function g with its derivative. */
interface Inner {
  readonly g: string;
  readonly dg: string;
  /** coef is g' when it is a constant, which then multiplies in front. */
  readonly coef?: number;
  /** at evaluates g. */
  readonly at: (x: number) => number;
  /** slope evaluates g'. */
  readonly slope: (x: number) => number;
}

/** linearInner is ax + b with a ≠ 0, ±1 most of the time. */
function linearInner(rng: Rng, positive = false): Inner {
  const a = positive ? rng.int(2, 5) : rng.pick([2, 3, 4, 5, -2, -3, -1]);
  const b = positive ? rng.int(1, 9) : rng.int(-9, 9);
  return { g: poly([a, "x"], [b, ""]), dg: String(a), coef: a, at: (x) => a * x + b, slope: () => a };
}

/** quadraticInner is x² + c or ax² + c. */
function quadraticInner(rng: Rng, positive = false): Inner {
  const a = rng.pick([1, 1, 2, 3]);
  const c = positive ? rng.int(1, 9) : rng.nonZero(-9, 9);
  return { g: poly([a, "x^{2}"], [c, ""]), dg: poly([2 * a, "x"]), at: (x) => a * x * x + c, slope: (x) => 2 * a * x };
}

/** times writes k·g'·rest, putting a constant g' in front: "6(2x + 1)^{2}", "4x(x^{2} + 1)". */
function times(k: number, inner: Inner, rest: string): string {
  if (inner.coef !== undefined) return poly([k * inner.coef, rest]);
  const [m, v] = splitMonomial(inner.dg);
  return poly([k * m, `${v}${rest}`]);
}

/** splitMonomial splits "6x" into [6, "x"], "-x" into [-1, "x"]. */
function splitMonomial(s: string): [number, string] {
  const m = /^(-?\d*)(.*)$/.exec(s)!;
  const c = m[1] === "" ? 1 : m[1] === "-" ? -1 : Number(m[1]);
  return [c, m[2]!];
}

/** factor writes g' as a factor after a product sign, in parentheses when it is negative. */
const factor = (inner: Inner) => (inner.coef !== undefined && inner.coef < 0 ? `(${inner.dg})` : inner.dg);

/** checkAt picks a point near 0 where g has a small nonzero value and a nonzero slope, and where ok holds. */
function checkAt(inner: Inner, ok: (x: number) => boolean = () => true): number {
  const xs = [1, -1, 2, -2, 0, 3, -3].filter((x) => inner.slope(x) !== 0 && inner.at(x) !== 0 && ok(x));
  return xs.find((x) => Math.abs(inner.at(x)) <= 4) ?? xs[0] ?? 1;
}

/** fp writes a number to four decimal places, in parentheses when it is negative. */
const fp = (v: number) => (v < 0 ? `(${fmt(v)})` : fmt(v));

/** pre writes a coefficient in front of a parenthesis: "", "-" or "3". */
const pre = (k: number) => (k === 1 ? "" : k === -1 ? "-" : String(k));

/** atOne is the value of a polynomial's derivative over the polynomial at 1. */
const atOne = (k: number, g: Poly) => Q.of(k * pAt(pDer(g), 1), pAt(g, 1));

/** theChainRuleForDifferentiation differentiates composite functions. */
export const theChainRuleForDifferentiation: TopicDef = {
  id: "the-chain-rule-for-differentiation",
  title: t("The Chain Rule for Differentiation", "求导的链式法则"),
  summary: t(
    "Differentiate powers and roots of inner functions, and composite functions at a point, with the chain rule.",
    "用链式法则对内层函数的幂和根式求导，并计算复合函数在某点处的导数。",
  ),
  intro: t(
    "Expanding $(3x + 1)^{2} = 9x^{2} + 6x + 1$ gives the derivative $18x + 6 = 2(3x + 1) \\cdot 3$. The outer square contributes $2(3x + 1)$, with the inner function left inside, and the inner function $3x + 1$ contributes its slope $3$. That is the chain rule: differentiate the outside, keep the inside, and multiply by the derivative of the inside.\n\nCheck: at $x = 1$, $18 \\cdot 1 + 6 = 24$ and $2 \\cdot 4 \\cdot 3 = 24$.\n\nIn this lesson we use the chain rule on powers of inner functions, on roots and reciprocals written as powers, and on a composite function at a point.",
    "展开 $(3x + 1)^{2} = 9x^{2} + 6x + 1$，得到导数 $18x + 6 = 2(3x + 1) \\cdot 3$。外层的平方给出 $2(3x + 1)$，内层函数保留在里面；内层函数 $3x + 1$ 贡献它的斜率 $3$。这就是链式法则：对外层求导，内层保持不变，再乘以内层的导数。\n\n检验：在 $x = 1$ 处，$18 \\cdot 1 + 6 = 24$，$2 \\cdot 4 \\cdot 3 = 24$。\n\n本课我们对内层函数的幂、写成幂的根式与倒数，以及复合函数在某点处使用链式法则。",
  ),
  prerequisites: ["the-quotient-rule-for-differentiation", "function-composition"],
  encompasses: [
    { topic: "the-power-rule-for-differentiation", weight: 0.3 },
    { topic: "function-composition", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "powers-of-inner-functions",
      title: t("Powers of inner functions", "内层函数的幂"),
      explanation: t(
        "**Chain rule.** If $y = f(g(x))$, then\n\n$$\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x):$$\n\ndifferentiate the outer function, keep the inner function inside it, and multiply by the derivative of the inner function. For a power,\n\n$$\\frac{d}{dx}\\left(x^{2} + 1\\right)^{5} = 5\\left(x^{2} + 1\\right)^{4} \\cdot 2x = 10x\\left(x^{2} + 1\\right)^{4}.$$\n\nCheck: at $x = 1$ this is $10 \\cdot 1 \\cdot 2^{4} = 160$. The difference quotients $\\frac{(1.01^{2} + 1)^{5} - 2^{5}}{0.01} \\approx 164.06$ and $\\frac{(0.99^{2} + 1)^{5} - 2^{5}}{-0.01} \\approx 156.06$ lie on either side of it.\n\n> **Watch out.** Keep the inner function inside the outer derivative, then multiply by its derivative: $5\\left(x^{2} + 1\\right)^{4}$ alone leaves out the factor $2x$, and $5(2x)^{4}$ puts the derivative where the inner function belongs.",
        "**链式法则** 若 $y = f(g(x))$，则\n\n$$\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)$$\n\n即先对外层函数求导（内层函数保持不变），再乘以内层函数的导数。对幂函数，\n\n$$\\frac{d}{dx}\\left(x^{2} + 1\\right)^{5} = 5\\left(x^{2} + 1\\right)^{4} \\cdot 2x = 10x\\left(x^{2} + 1\\right)^{4}.$$\n\n检验：在 $x = 1$ 处它等于 $10 \\cdot 1 \\cdot 2^{4} = 160$。差商 $\\frac{(1.01^{2} + 1)^{5} - 2^{5}}{0.01} \\approx 164.06$ 与 $\\frac{(0.99^{2} + 1)^{5} - 2^{5}}{-0.01} \\approx 156.06$ 分别位于它的两侧。\n\n> **注意。** 外层求导时内层函数保持不变，然后再乘以内层的导数：只写 $5\\left(x^{2} + 1\\right)^{4}$ 漏掉了因子 $2x$，而 $5(2x)^{4}$ 把导数放到了内层函数的位置上。",
      ),
      generate(rng) {
        const inner = rng.bool() ? linearInner(rng) : quadraticInner(rng);
        const n = rng.int(2, 7);
        const k = rng.pick([1, 1, 1, 2, 3, -1, -2]);
        const f = poly([k, `(${inner.g})^{${n}}`]);
        const lower = `(${inner.g})${n === 2 ? "" : `^{${n - 1}}`}`;
        const answer = times(k * n, inner, lower);
        const x0 = checkAt(inner);
        const value = k * n * inner.at(x0) ** (n - 1) * inner.slope(x0);
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Name the inner function", "确定内层函数"],
                  t(`The outer function is $${poly([k, `u^{${n}}`])}$ with`, `外层函数是 $${poly([k, `u^{${n}}`])}$，其中`),
                  [`u = ${inner.g}, \\quad u' = ${inner.dg}`],
                ],
                [
                  ["Differentiate the outer function", "对外层函数求导"],
                  t(`Lower the power and keep $${inner.g}$ inside:`, `把幂次降一，$${inner.g}$ 保留在里面：`),
                  [
                    `\\frac{d}{du}\\left(${poly([k, `u^{${n}}`])}\\right) = ${poly([k * n, `u${n === 2 ? "" : `^{${n - 1}}`}`])} = ${poly([k * n, lower])}`,
                  ],
                ],
                [["Multiply by $u'$", "乘以 $u'$"], none, [`f'(x) = ${poly([k * n, lower])} \\cdot ${factor(inner)} = ${answer}`]],
              ],
              quotients(
                (x) => k * inner.at(x) ** n,
                x0,
                value,
                "f",
                "x",
                t(`At $x = ${x0}$ the answer gives $f'(${x0}) = ${value}$.`, `在 $x = ${x0}$ 处，答案给出 $f'(${x0}) = ${value}$。`),
              ),
            ),
          },
          [
            say(
              poly([k * n, lower]),
              `This differentiates the outer power but leaves out the factor $u' = ${inner.dg}$.`,
              `这对外层的幂求了导，但漏掉了因子 $u' = ${inner.dg}$。`,
            ),
            say(
              times(k * n, inner, `(${inner.g})^{${n}}`),
              `This keeps the power $${n}$. The power rule lowers it to $${n - 1}$.`,
              `这保留了幂次 $${n}$。幂法则要把它降为 $${n - 1}$。`,
            ),
            say(
              poly([k * n, `(${inner.dg})^{${n - 1}}`]),
              `This puts the derivative $${inner.dg}$ inside the power. The inner function $${inner.g}$ stays inside, and its derivative multiplies in front.`,
              `这把导数 $${inner.dg}$ 放进了幂里。内层函数 $${inner.g}$ 应保留在里面，它的导数乘在前面。`,
            ),
          ],
        );
      },
    },
    {
      id: "roots-and-reciprocals-of-inner-functions",
      title: t("Roots and reciprocals of inner functions", "内层函数的根式与倒数"),
      explanation: t(
        "Writing roots and reciprocals as powers lets you use the power rule together with the chain rule, multiplying by the derivative of the inside. Write roots and reciprocals as powers first: $\\sqrt{u} = u^{\\frac{1}{2}}$ and $\\frac{k}{u} = ku^{-1}$. Then\n\n$$\\frac{d}{dx}\\sqrt{u} = \\frac{u'}{2\\sqrt{u}}, \\qquad \\frac{d}{dx}\\frac{k}{u} = -\\frac{ku'}{u^{2}}.$$\n\nFor example, $\\frac{d}{dx}\\sqrt{x^{2} + 9} = \\frac{2x}{2\\sqrt{x^{2} + 9}} = \\frac{x}{\\sqrt{x^{2} + 9}}$, which is $\\frac{4}{5}$ at $x = 4$.\n\nCheck: $\\frac{\\sqrt{4.01^{2} + 9} - 5}{0.01} \\approx 0.8004$, close to $0.8$.\n\n> **Watch out.** The power $\\frac{1}{2}$ drops to $-\\frac{1}{2}$, which puts the root in the denominator. And $\\frac{k}{u}$ has derivative $-\\frac{ku'}{u^{2}}$, with a minus sign and a square; it is not $\\frac{k}{u'}$.",
        "把根式和倒数写成幂的形式，就可以把幂法则与链式法则结合起来，再乘以内层函数的导数。先把根式和倒数写成幂：$\\sqrt{u} = u^{\\frac{1}{2}}$，$\\frac{k}{u} = ku^{-1}$。于是\n\n$$\\frac{d}{dx}\\sqrt{u} = \\frac{u'}{2\\sqrt{u}}, \\qquad \\frac{d}{dx}\\frac{k}{u} = -\\frac{ku'}{u^{2}}.$$\n\n例如 $\\frac{d}{dx}\\sqrt{x^{2} + 9} = \\frac{2x}{2\\sqrt{x^{2} + 9}} = \\frac{x}{\\sqrt{x^{2} + 9}}$，在 $x = 4$ 处等于 $\\frac{4}{5}$。\n\n检验：$\\frac{\\sqrt{4.01^{2} + 9} - 5}{0.01} \\approx 0.8004$，接近 $0.8$。\n\n> **注意。** 幂 $\\frac{1}{2}$ 降为 $-\\frac{1}{2}$，根式因此到了分母上。$\\frac{k}{u}$ 的导数是 $-\\frac{ku'}{u^{2}}$，有负号，分母是平方；它不是 $\\frac{k}{u'}$。",
      ),
      generate(rng) {
        const inner = rng.bool() ? linearInner(rng, true) : quadraticInner(rng, true);
        const root = rng.bool();
        const k = rng.pick([1, 2, 3, 4, 6, -1, -2]);
        if (root) {
          const f = poly([k, `\\sqrt{${inner.g}}`]);
          const whole = k * (inner.coef ?? splitMonomial(inner.dg)[0]);
          const v = inner.coef !== undefined ? "" : "x";
          const num = (m: number) => (m === 1 && v ? v : `${m}${v}`);
          const sign = whole < 0 ? "-" : "";
          const size = Math.abs(whole);
          const top = `${sign}${num(size)}`;
          const answer =
            size % 2 === 0 ? `${sign}\\frac{${num(size / 2)}}{\\sqrt{${inner.g}}}` : `${sign}\\frac{${num(size)}}{2\\sqrt{${inner.g}}}`;
          const squares = [1, 2, 3, 4, 5, 6, 7, 8, 0].filter(
            (x) => inner.slope(x) !== 0 && Number.isInteger(Math.sqrt(inner.at(x))) && Math.sqrt(inner.at(x)) <= 6,
          );
          const x0 = squares[0] ?? 1;
          const r = Math.sqrt(inner.at(x0));
          const top0 = k * inner.slope(x0);
          const value: Value = Number.isInteger(r)
            ? Q.of(top0, 2 * r)
            : [top0 % 2 === 0 ? fracL(top0 / 2, `\\sqrt{${inner.at(x0)}}`) : fracL(top0, `2\\sqrt{${inner.at(x0)}}`), top0 / (2 * r)];
          return functionWith(
            {
              prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
              answer,
              prefix: "f'(x) =",
              solution: walked(
                [
                  [["Write the root as a power", "把根式写成幂"], none, [`f(x) = ${poly([k, `(${inner.g})^{\\frac{1}{2}}`])}`]],
                  [
                    ["Use the chain rule", "用链式法则"],
                    t(
                      `Lower the power $\\frac{1}{2}$ to $-\\frac{1}{2}$ and multiply by $${inner.dg}$:`,
                      `把幂 $\\frac{1}{2}$ 降为 $-\\frac{1}{2}$，再乘以 $${inner.dg}$：`,
                    ),
                    [`f'(x) = ${poly([Q.of(k, 2), `(${inner.g})^{-\\frac{1}{2}}`])} \\cdot ${inner.dg}`],
                  ],
                  [["Simplify", "化简"], none, [`f'(x) = ${answer}`]],
                ],
                quotients(
                  (x) => k * Math.sqrt(inner.at(x)),
                  x0,
                  value,
                  "f",
                  "x",
                  t(
                    `At $x = ${x0}$, where $${inner.g} = ${inner.at(x0)}$, the answer gives this value.`,
                    `在 $x = ${x0}$ 处 $${inner.g} = ${inner.at(x0)}$，答案给出这个值。`,
                  ),
                ),
              ),
            },
            [
              say(
                k % 2 === 0 ? fracL(k / 2, `\\sqrt{${inner.g}}`) : fracL(k, `2\\sqrt{${inner.g}}`),
                `This leaves out the factor $${inner.dg}$, the derivative of the inside.`,
                `这漏掉了因子 $${inner.dg}$，即内层函数的导数。`,
              ),
              say(
                `${sign}\\frac{${num(size)}}{\\sqrt{${inner.g}}}`,
                "This drops the $\\frac{1}{2}$ that comes down from the power $\\frac{1}{2}$.",
                "这丢掉了从幂 $\\frac{1}{2}$ 拿下来的 $\\frac{1}{2}$。",
              ),
              say(
                `${top === "1" ? "" : top === "-1" ? "-" : top}\\sqrt{${inner.g}}`,
                "This keeps the root in the numerator. The power rule brings down $\\frac{1}{2}$ and lowers the power to $-\\frac{1}{2}$, which puts the root in the denominator.",
                "这把根式留在了分子上。幂法则拿下 $\\frac{1}{2}$，并把幂降为 $-\\frac{1}{2}$，根式因此到分母上。",
              ),
            ],
          );
        }
        const f = `\\frac{${k}}{${inner.g}}`;
        const top = inner.coef !== undefined ? -k * inner.coef : -k * splitMonomial(inner.dg)[0];
        const v = inner.coef !== undefined ? "" : "x";
        const answer = `${top < 0 ? "-" : ""}\\frac{${Math.abs(top)}${v}}{(${inner.g})^{2}}`;
        const value = Q.of(-k * inner.slope(1), inner.at(1) ** 2);
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [["Write the reciprocal as a power", "把倒数写成幂"], none, [`f(x) = ${k}(${inner.g})^{-1}`]],
                [
                  ["Use the chain rule", "用链式法则"],
                  t(
                    `Bring down $-1$, lower the power to $-2$ and multiply by $${inner.dg}$:`,
                    `拿下 $-1$，把幂降为 $-2$，再乘以 $${inner.dg}$：`,
                  ),
                  [`f'(x) = ${-k}(${inner.g})^{-2} \\cdot ${inner.dg}`],
                ],
                [["Simplify", "化简"], none, [`f'(x) = ${answer}`]],
              ],
              quotients(
                (x) => k / inner.at(x),
                1,
                value,
                "f",
                "x",
                t(
                  `At $x = 1$, where $${inner.g} = ${inner.at(1)}$, the answer gives $f'(1) = ${value.toLatex()}$.`,
                  `在 $x = 1$ 处 $${inner.g} = ${inner.at(1)}$，答案给出 $f'(1) = ${value.toLatex()}$。`,
                ),
              ),
            ),
          },
          [
            say(
              fracL(-k, `(${inner.g})^{2}`),
              `This leaves out the factor $${inner.dg}$, the derivative of the inside.`,
              `这漏掉了因子 $${inner.dg}$，即内层函数的导数。`,
            ),
            say(
              `${top < 0 ? "" : "-"}\\frac{${Math.abs(top)}${v}}{(${inner.g})^{2}}`,
              "This has the wrong sign. The power $-1$ comes down as a factor, so the derivative of $\\frac{k}{u}$ is $-\\frac{ku'}{u^{2}}$.",
              "符号错了。幂 $-1$ 作为因子拿下来，所以 $\\frac{k}{u}$ 的导数是 $-\\frac{ku'}{u^{2}}$。",
            ),
            say(
              fracL(k, inner.dg),
              "This divides by the derivative of the denominator. A reciprocal is differentiated as the power $-1$, not by differentiating the denominator alone.",
              "这除以了分母的导数。倒数要按 $-1$ 次幂求导，不能只对分母求导。",
            ),
          ],
        );
      },
    },
    {
      id: "derivatives-of-composite-functions-at-a-point",
      title: t("Derivatives of composite functions at a point", "复合函数在某点处的导数"),
      explanation: t(
        "The chain rule works from the inside out: find where the inner function sends the point, then use the slopes of both functions at the right places. For $h(x) = f(g(x))$, $h'(a) = f'(g(a)) \\cdot g'(a)$: evaluate $g(a)$ first, then $f'$ at that value, then multiply by $g'(a)$.\n\nFor example, with $f(x) = x^{2}$ and $g(x) = 3x + 1$: $g(1) = 4$, $f'(4) = 8$ and $g'(1) = 3$, so $h'(1) = 8 \\cdot 3 = 24$.\n\nCheck: $h(x) = (3x + 1)^{2} = 9x^{2} + 6x + 1$, so $h'(x) = 18x + 6$ and $h'(1) = 24$.\n\n> **Watch out.** Evaluate $f'$ at $g(a)$, not at $a$. Here $f'(1) \\cdot g'(1) = 2 \\cdot 3 = 6$ is wrong.",
        "链式法则由内向外进行：先求内层函数把该点送到哪里，再在相应的位置用两个函数的斜率。对 $h(x) = f(g(x))$，$h'(a) = f'(g(a)) \\cdot g'(a)$：先求 $g(a)$，再求 $f'$ 在该值处的值，最后乘以 $g'(a)$。\n\n例如取 $f(x) = x^{2}$，$g(x) = 3x + 1$：$g(1) = 4$，$f'(4) = 8$，$g'(1) = 3$，所以 $h'(1) = 8 \\cdot 3 = 24$。\n\n检验：$h(x) = (3x + 1)^{2} = 9x^{2} + 6x + 1$，所以 $h'(x) = 18x + 6$，$h'(1) = 24$。\n\n> **注意。** $f'$ 要在 $g(a)$ 处取值，而不是在 $a$ 处。这里 $f'(1) \\cdot g'(1) = 2 \\cdot 3 = 6$ 是错的。",
      ),
      generate(rng) {
        const f: Poly = [rng.int(-5, 5), rng.int(-4, 4), rng.nonZero(-3, 3)];
        const g: Poly = rng.bool() ? [rng.int(-4, 4), rng.nonZero(-3, 3)] : [rng.int(-4, 4), rng.int(-3, 3), rng.nonZero(-2, 2)];
        const a = rng.int(-2, 2);
        const ga = pAt(g, a);
        const dfga = pAt(pDer(f), ga);
        const dga = pAt(pDer(g), a);
        const answer = dfga * dga;
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${pLatex(f)}$ and $g(x) = ${pLatex(g)}$, and let $h(x) = f(g(x))$. Find $h'(${a})$.`,
            `设 $f(x) = ${pLatex(f)}$，$g(x) = ${pLatex(g)}$，$h(x) = f(g(x))$。求 $h'(${a})$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              dfga,
              `This is $f'(${ga})$ alone; the chain rule also multiplies by $g'(${a}) = ${dga}$.`,
              `这只是 $f'(${ga})$；链式法则还要乘以 $g'(${a}) = ${dga}$。`,
            ),
            why(
              pAt(pDer(f), a) * dga,
              `This evaluates $f'$ at $${a}$. The outer derivative belongs at the inner value $g(${a}) = ${ga}$.`,
              `这是在 $${a}$ 处求 $f'$。外层导数应在内层的值 $g(${a}) = ${ga}$ 处取值。`,
            ),
            why(
              pAt(pDer(f), dga),
              `This puts $g'(${a}) = ${dga}$ into $f'$. The input of $f'$ is $g(${a}) = ${ga}$, and $g'(${a})$ multiplies.`,
              `这把 $g'(${a}) = ${dga}$ 代入了 $f'$。$f'$ 的输入是 $g(${a}) = ${ga}$，$g'(${a})$ 是乘上去的因子。`,
            ),
            why(dfga + dga, "This adds the two slopes; the chain rule multiplies them.", "这把两个斜率相加了；链式法则是把它们相乘。"),
            why(
              pAt(f, ga) * dga,
              `This uses the value $f(${ga})$ in place of the slope $f'(${ga})$.`,
              `这用了函数值 $f(${ga})$，而不是斜率 $f'(${ga})$。`,
            ),
          ]),
          solution: walked(
            [
              [["Find the inner value", "求内层函数的值"], none, [`g(${a}) = ${ga}`]],
              [
                ["Find the two slopes", "求两个斜率"],
                t(
                  `$g'(x) = ${pLatex(pDer(g))}$ and $f'(x) = ${pLatex(pDer(f))}$, so`,
                  `$g'(x) = ${pLatex(pDer(g))}$，$f'(x) = ${pLatex(pDer(f))}$，所以`,
                ),
                [`g'(${a}) = ${dga}, \\quad f'(${ga}) = ${dfga}`],
              ],
              [["Multiply", "相乘"], none, [`h'(${a}) = f'(${ga}) \\cdot g'(${a}) = ${par(dfga)} \\cdot ${par(dga)} = ${answer}`]],
            ],
            quotients(
              (x) => pAt(f, pAt(g, x)),
              a,
              answer,
              "h",
              "x",
              t(
                `Work with $h(x) = f(g(x))$ itself: $h(${a}) = f(${ga}) = ${pAt(f, ga)}$.`,
                `直接用 $h(x) = f(g(x))$：$h(${a}) = f(${ga}) = ${pAt(f, ga)}$。`,
              ),
              "\\Delta x",
            ),
          ),
        });
      },
    },
  ],
};

/** theChainRuleWithExponentialFunctions differentiates e^{g(x)} and b^{g(x)}. */
export const theChainRuleWithExponentialFunctions: TopicDef = {
  id: "the-chain-rule-with-exponential-functions",
  title: t("The Chain Rule With Exponential Functions", "指数函数的链式法则"),
  summary: t("Differentiate exponentials of inner functions.", "对以内层函数为指数的指数函数求导。"),
  intro: t(
    "$e^{x}$ is its own derivative. For $e^{3x}$ the exponent grows three times as fast as $x$, and the chain rule multiplies by that rate: $\\frac{d}{dx} e^{3x} = 3e^{3x}$.\n\nCheck: at $x = 0$, $\\frac{e^{0.03} - 1}{0.01} \\approx 3.0455$ and $\\frac{e^{-0.03} - 1}{-0.01} \\approx 2.9554$, on either side of $3e^{0} = 3$.\n\nIn this lesson we differentiate $e$ raised to an inner function, then other bases raised to an inner function, which carry an extra factor $\\ln b$.",
    "$e^{x}$ 的导数就是它自己。对 $e^{3x}$，指数增长的速度是 $x$ 的三倍，链式法则就乘以这个速度：$\\frac{d}{dx} e^{3x} = 3e^{3x}$。\n\n检验：在 $x = 0$ 处，$\\frac{e^{0.03} - 1}{0.01} \\approx 3.0455$，$\\frac{e^{-0.03} - 1}{-0.01} \\approx 2.9554$，位于 $3e^{0} = 3$ 的两侧。\n\n本课我们先对 $e$ 的内层函数次幂求导，再对其他底数的内层函数次幂求导，后者多一个因子 $\\ln b$。",
  ),
  prerequisites: ["the-chain-rule-for-differentiation"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.4 },
    { topic: "differentiating-exponential-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "e-to-an-inner-function",
      title: t("e to an inner function", "e 的内层函数次幂"),
      explanation: t(
        "The exponential function is its own derivative, so by the chain rule only the derivative of the exponent is added as a factor. $$\\frac{d}{dx} e^{g(x)} = g'(x)e^{g(x)}.$$\n\nThe exponent stays the same; multiply by its derivative. For example, $\\frac{d}{dx} e^{x^{2} - 3x} = (2x - 3)e^{x^{2} - 3x}$, which is $-3$ at $x = 0$.\n\nCheck: $\\frac{e^{0.01^{2} - 0.03} - 1}{0.01} \\approx -2.9457$, close to $-3$.\n\n> **Watch out.** $e^{g(x)}$ is not a power of $x$: the exponent does not come down or drop by one. It stays as it is, and its derivative $g'(x)$ multiplies in front.",
        "指数函数的导数就是它自己，所以根据链式法则，只需多乘一个指数的导数。$$\\frac{d}{dx} e^{g(x)} = g'(x)e^{g(x)}.$$\n\n指数保持不变，再乘以指数的导数。例如 $\\frac{d}{dx} e^{x^{2} - 3x} = (2x - 3)e^{x^{2} - 3x}$，在 $x = 0$ 处等于 $-3$。\n\n检验：$\\frac{e^{0.01^{2} - 0.03} - 1}{0.01} \\approx -2.9457$，接近 $-3$。\n\n> **注意。** $e^{g(x)}$ 不是 $x$ 的幂：指数既不拿下来，也不减一。指数保持原样，它的导数 $g'(x)$ 乘在前面。",
      ),
      generate(rng) {
        const linear = rng.bool();
        const g: Poly = linear ? [rng.int(-5, 5), rng.pick([2, 3, 4, 5, -1, -2, -3])] : [0, rng.int(-4, 4), rng.pick([1, 1, 2, -1])];
        const k = rng.pick([1, 1, 2, 3, -1, 4]);
        const e = `e^{${pLatex(g)}}`;
        const dg = pDer(g);
        const answer = linear ? poly([k * dg[0]!, e]) : `${pre(k)}(${pLatex(dg)})${e}`;
        const slope0 = k * pAt(dg, 0) * Math.exp(g[0]!);
        const value: Value = g[0] === 0 ? k * pAt(dg, 0) : [poly([k * pAt(dg, 0), power(g[0]!, "e")]), slope0];
        const shownAt0 = typeof value === "number" ? String(value) : value[0];
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, e])}$.`, `设 $f(x) = ${poly([k, e])}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Differentiate the exponent", "对指数求导"],
                  t(`The exponent is $g(x) = ${pLatex(g)}$, and`, `指数是 $g(x) = ${pLatex(g)}$，且`),
                  [`g'(x) = ${pLatex(dg)}`],
                ],
                [
                  ["Multiply by the exponential", "乘以指数函数"],
                  t(
                    "The exponential copies itself with the same exponent, and the chain rule multiplies by $g'(x)$:",
                    "指数函数照抄自身，指数不变，链式法则再乘以 $g'(x)$：",
                  ),
                  [`f'(x) = ${answer}`],
                ],
              ],
              quotients(
                (x) => k * Math.exp(pAt(g, x)),
                0,
                value,
                "f",
                "x",
                t(`At $x = 0$ the answer gives $f'(0) = ${shownAt0}$.`, `在 $x = 0$ 处，答案给出 $f'(0) = ${shownAt0}$。`),
              ),
            ),
          },
          [
            say(
              poly([k, e]),
              `This copies the function but leaves out the factor $g'(x) = ${pLatex(dg)}$.`,
              `这照抄了函数，但漏掉了因子 $g'(x) = ${pLatex(dg)}$。`,
            ),
            say(
              linear ? poly([k * dg[0]!, `e^{${pLatex(dg)}}`]) : `${pre(k)}(${pLatex(dg)})e^{${pLatex(dg)}}`,
              `This changes the exponent to its derivative. The exponent stays $${pLatex(g)}$; its derivative multiplies in front.`,
              `这把指数换成了它的导数。指数仍是 $${pLatex(g)}$，它的导数乘在前面。`,
            ),
            say(
              `${pre(k)}(${pLatex(g)})${e}`,
              `This multiplies by the exponent itself. The factor is its derivative, $${pLatex(dg)}$.`,
              `这乘的是指数本身。因子应是它的导数 $${pLatex(dg)}$。`,
            ),
            say(
              `${pre(k)}(${pLatex(g)})e^{${pLatex([g[0]! - 1, ...g.slice(1)])}}`,
              "This treats the exponential as a power of $x$, bringing the exponent down and lowering it by one. That rule is for $x^{n}$, not for $e^{g(x)}$.",
              "这把指数函数当成了 $x$ 的幂，把指数拿下来再减一。这条法则只适用于 $x^{n}$，不适用于 $e^{g(x)}$。",
            ),
          ],
        );
      },
    },
    {
      id: "other-bases-to-an-inner-function",
      title: t("Other bases to an inner function", "其他底数的内层函数次幂"),
      explanation: t(
        "Any base can be written as $e$ raised to its natural logarithm, which is why the derivative of a power of another base carries that extra logarithm factor. $$\\frac{d}{dx} b^{g(x)} = g'(x)\\,b^{g(x)}\\ln b.$$\n\nFor example, $\\frac{d}{dx} 2^{3x} = 3 \\cdot 2^{3x}\\ln 2$, which is $3\\ln 2 \\approx 2.0794$ at $x = 0$.\n\nCheck: $\\frac{2^{0.03} - 1}{0.01} \\approx 2.1012$, close to $2.0794$.\n\n> **Watch out.** Two factors come out: $g'(x)$ from the chain rule and $\\ln b$ from the base. Only base $e$ has no $\\ln$ factor, because $\\ln e = 1$.",
        "任何底数都可以写成 $e$ 的其自然对数次幂，所以其他底数的指数函数的导数会多一个对数因子。$$\\frac{d}{dx} b^{g(x)} = g'(x)\\,b^{g(x)}\\ln b.$$\n\n例如 $\\frac{d}{dx} 2^{3x} = 3 \\cdot 2^{3x}\\ln 2$，在 $x = 0$ 处等于 $3\\ln 2 \\approx 2.0794$。\n\n检验：$\\frac{2^{0.03} - 1}{0.01} \\approx 2.1012$，接近 $2.0794$。\n\n> **注意。** 要多出两个因子：链式法则给出的 $g'(x)$，以及底数给出的 $\\ln b$。只有底数为 $e$ 时没有 $\\ln$ 因子，因为 $\\ln e = 1$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 5, 10]);
        const a = rng.pick([2, 3, 4, 5, -1, -2]);
        const c = rng.int(-4, 4);
        const g = poly([a, "x"], [c, ""]);
        const answer = cdot(a, `${b}^{${g}}\\ln ${b}`);
        const latex0 = cdot(a, `${power(c, String(b))}\\ln ${b}`);
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${b}^{${g}}$.`, `设 $f(x) = ${b}^{${g}}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Write the base as a power of $e$", "把底数写成 $e$ 的幂"],
                  t(`Since $${b} = e^{\\ln ${b}}$,`, `因为 $${b} = e^{\\ln ${b}}$，`),
                  [`${b}^{${g}} = e^{(${g})\\ln ${b}}`],
                ],
                [
                  ["Use the chain rule", "用链式法则"],
                  t(
                    `The exponent $(${g})\\ln ${b}$ has derivative $${cdot(a, `\\ln ${b}`)}$, so`,
                    `指数 $(${g})\\ln ${b}$ 的导数是 $${cdot(a, `\\ln ${b}`)}$，所以`,
                  ),
                  [`f'(x) = ${cdot(a, `\\ln ${b}`)} \\cdot e^{(${g})\\ln ${b}} = ${answer}`],
                ],
              ],
              quotients(
                (x) => b ** (a * x + c),
                0,
                [latex0, a * b ** c * Math.log(b)],
                "f",
                "x",
                t(`At $x = 0$ the answer gives $f'(0) = ${latex0}$.`, `在 $x = 0$ 处，答案给出 $f'(0) = ${latex0}$。`),
              ),
            ),
          },
          [
            say(
              `${b}^{${g}}\\ln ${b}`,
              `This leaves out the factor $g'(x) = ${a}$ from the chain rule.`,
              `这漏掉了链式法则给出的因子 $g'(x) = ${a}$。`,
            ),
            say(
              cdot(a, `${b}^{${g}}`),
              `This leaves out $\\ln ${b}$, which comes from writing $${b} = e^{\\ln ${b}}$. Only base $e$ has no such factor.`,
              `这漏掉了 $\\ln ${b}$，它来自 $${b} = e^{\\ln ${b}}$。只有底数为 $e$ 时才没有这个因子。`,
            ),
            say(
              `(${g}) \\cdot ${b}^{${poly([a, "x"], [c - 1, ""])}}`,
              "This uses the power rule, which is for a variable base and a constant exponent. Here the exponent varies.",
              "这用了幂法则，幂法则适用于底数是变量、指数是常数的情形。这里变的是指数。",
            ),
          ],
        );
      },
    },
  ],
};

/** theChainRuleWithLogarithmicFunctions differentiates ln(g(x)). */
export const theChainRuleWithLogarithmicFunctions: TopicDef = {
  id: "the-chain-rule-with-logarithmic-functions",
  title: t("The Chain Rule With Logarithmic Functions", "对数函数的链式法则"),
  summary: t("Differentiate logarithms of inner functions.", "对内层函数的对数求导。"),
  intro: t(
    "$\\ln(3x) = \\ln 3 + \\ln x$, so its derivative is $\\frac{1}{x}$. The chain rule gives the same: the derivative of $\\ln u$ is $\\frac{1}{u}$, so $\\frac{d}{dx}\\ln(3x) = \\frac{1}{3x} \\cdot 3 = \\frac{1}{x}$.\n\nCheck: at $x = 1$, $\\frac{\\ln 3.03 - \\ln 3}{0.01} \\approx 0.995$, close to $1$.\n\nIn this lesson we differentiate the logarithm of an inner function, and first simplify logarithms of powers and products with the laws of logarithms.",
    "$\\ln(3x) = \\ln 3 + \\ln x$，所以它的导数是 $\\frac{1}{x}$。链式法则给出同样的结果：$\\ln u$ 的导数是 $\\frac{1}{u}$，所以 $\\frac{d}{dx}\\ln(3x) = \\frac{1}{3x} \\cdot 3 = \\frac{1}{x}$。\n\n检验：在 $x = 1$ 处，$\\frac{\\ln 3.03 - \\ln 3}{0.01} \\approx 0.995$，接近 $1$。\n\n本课我们对内层函数的对数求导，并先用对数运算法则化简幂与积的对数。",
  ),
  prerequisites: ["the-chain-rule-for-differentiation"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.4 },
    { topic: "differentiating-logarithmic-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "ln-of-an-inner-function",
      title: t("ln of an inner function", "内层函数的自然对数"),
      explanation: t(
        "The derivative of the natural logarithm of a function is the derivative of the function divided by the function itself. $$\\frac{d}{dx} \\ln g(x) = \\frac{g'(x)}{g(x)}.$$\n\nFor example, $\\frac{d}{dx} \\ln\\left(x^{2} + 4\\right) = \\frac{2x}{x^{2} + 4}$, which is $\\frac{2}{5}$ at $x = 1$.\n\nCheck: $\\frac{\\ln(1.01^{2} + 4) - \\ln 5}{0.01} \\approx 0.4012$, close to $0.4$.\n\n> **Watch out.** The derivative of the inside goes on top and the inside itself below: $\\frac{g'}{g}$. Leaving out $g'$ gives $\\frac{1}{g}$, and turning it over gives $\\frac{g}{g'}$; both are wrong.",
        "函数的自然对数的导数，等于这个函数的导数除以函数本身。$$\\frac{d}{dx} \\ln g(x) = \\frac{g'(x)}{g(x)}.$$\n\n例如 $\\frac{d}{dx} \\ln\\left(x^{2} + 4\\right) = \\frac{2x}{x^{2} + 4}$，在 $x = 1$ 处等于 $\\frac{2}{5}$。\n\n检验：$\\frac{\\ln(1.01^{2} + 4) - \\ln 5}{0.01} \\approx 0.4012$，接近 $0.4$。\n\n> **注意。** 内层的导数在分子，内层本身在分母：$\\frac{g'}{g}$。漏掉 $g'$ 会得到 $\\frac{1}{g}$，上下颠倒会得到 $\\frac{g}{g'}$，两者都错。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const g: Poly =
          kind === 0
            ? [rng.int(1, 9), rng.int(2, 6)]
            : kind === 1
              ? [rng.int(1, 9), 0, rng.pick([1, 1, 2, 3])]
              : [rng.int(1, 6), rng.int(1, 4), 0, 1];
        const k = rng.pick([1, 1, 2, 3, -1]);
        const dg = pDer(g);
        const top = pLatex(dg.map((c) => c * Math.abs(k)));
        const answer = `${k < 0 ? "-" : ""}\\frac{${top}}{${pLatex(g)}}`;
        const scale = k === 1 ? "" : k === -1 ? "-" : `${k} \\cdot `;
        const value = atOne(k, g);
        const sign = k < 0 ? "-" : "";
        const size = Math.abs(k) === 1 ? "" : `${Math.abs(k)}`;
        return functionWith(
          {
            prompt: t(
              `Find $f'(x)$ for $f(x) = ${poly([k, `\\ln\\left(${pLatex(g)}\\right)`])}$, where $x > 0$.`,
              `设 $f(x) = ${poly([k, `\\ln\\left(${pLatex(g)}\\right)`])}$，其中 $x > 0$。求 $f'(x)$。`,
            ),
            answer,
            prefix: "f'(x) =",
            positive: true,
            solution: walked(
              [
                [
                  ["Find the inner function and its derivative", "求内层函数及其导数"],
                  t(`The inner function is $g(x) = ${pLatex(g)}$, with`, `内层函数是 $g(x) = ${pLatex(g)}$，且`),
                  [`g'(x) = ${pLatex(dg)}`],
                ],
                [
                  ["Divide by the inner function", "除以内层函数"],
                  t("The derivative of $\\ln u$ is $\\frac{u'}{u}$, so", "$\\ln u$ 的导数是 $\\frac{u'}{u}$，所以"),
                  [`f'(x) = ${scale}\\frac{${pLatex(dg)}}{${pLatex(g)}}${Math.abs(k) === 1 ? "" : ` = ${answer}`}`],
                ],
              ],
              quotients(
                (x) => k * Math.log(pAt(g, x)),
                1,
                value,
                "f",
                "x",
                t(
                  `At $x = 1$, where $g(1) = ${pAt(g, 1)}$, the answer gives $f'(1) = ${value.toLatex()}$.`,
                  `在 $x = 1$ 处 $g(1) = ${pAt(g, 1)}$，答案给出 $f'(1) = ${value.toLatex()}$。`,
                ),
              ),
            ),
          },
          [
            say(fracL(k, pLatex(g)), `This leaves out $g'(x) = ${pLatex(dg)}$ on top.`, `这漏掉了分子上的 $g'(x) = ${pLatex(dg)}$。`),
            say(
              `${sign}\\frac{${size === "" ? pLatex(g) : `${size}(${pLatex(g)})`}}{${pLatex(dg)}}`,
              "This turns the fraction upside down. The derivative of $\\ln g$ is $g'$ over $g$.",
              "这把分数上下颠倒了。$\\ln g$ 的导数是 $g'$ 除以 $g$。",
            ),
            say(
              pLatex(dg.map((c) => c * k)),
              "This differentiates only the inside. The derivative of $\\ln u$ also divides by $u$.",
              "这只对内层求了导。$\\ln u$ 的导数还要除以 $u$。",
            ),
            say(
              fracL(k, pLatex(dg)),
              "This divides by $g'$. The derivative of $\\ln g$ divides $g'$ by $g$.",
              "这除以了 $g'$。$\\ln g$ 的导数是用 $g'$ 除以 $g$。",
            ),
          ],
        );
      },
    },
    {
      id: "logarithms-of-powers-and-products",
      title: t("Logarithms of powers and products", "幂与乘积的对数"),
      explanation: t(
        "Using the laws of logarithms to break apart powers and products first leaves simpler pieces that are much easier to differentiate. Simplify with the laws of logarithms before differentiating:\n\n$$\\frac{d}{dx} \\ln\\left((2x + 1)^{3}\\right) = \\frac{d}{dx} 3\\ln(2x + 1) = \\frac{6}{2x + 1},$$\n\nwhich is $2$ at $x = 1$.\n\nCheck: $\\frac{\\ln(3.02^{3}) - \\ln 27}{0.01} \\approx 1.9934$, close to $2$.\n\n> **Watch out.** The logarithm of a product is a sum, $\\ln(uv) = \\ln u + \\ln v$, so the derivatives are added, not multiplied. Each logarithm still needs the derivative of its own inside.",
        "先用对数运算法则把幂和积拆开，得到的部分要简单得多，也更容易求导。求导前先用对数运算法则化简：\n\n$$\\frac{d}{dx} \\ln\\left((2x + 1)^{3}\\right) = \\frac{d}{dx} 3\\ln(2x + 1) = \\frac{6}{2x + 1},$$\n\n在 $x = 1$ 处等于 $2$。\n\n检验：$\\frac{\\ln(3.02^{3}) - \\ln 27}{0.01} \\approx 1.9934$，接近 $2$。\n\n> **注意。** 积的对数是和，$\\ln(uv) = \\ln u + \\ln v$，所以导数相加，而不是相乘。每个对数仍要乘以它自己内层的导数。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(1, 9);
        const n = rng.int(2, 6);
        const g = poly([a, "x"], [b, ""]);
        const product = rng.bool();
        const f = product ? `\\ln\\left(x^{${n}}(${g})\\right)` : `\\ln\\left((${g})^{${n}}\\right)`;
        const answer = product ? `\\frac{${n}}{x} + \\frac{${a}}{${g}}` : `\\frac{${n * a}}{${g}}`;
        const value = product ? Q.of(n).add(Q.of(a, a + b)) : Q.of(n * a, a + b);
        const fn = product ? (x: number) => n * Math.log(x) + Math.log(a * x + b) : (x: number) => n * Math.log(a * x + b);
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            positive: true,
            solution: walked(
              product
                ? [
                    [
                      ["Split the logarithm", "拆开对数"],
                      t(
                        "The logarithm of a product is the sum of the logarithms, and a power comes down in front:",
                        "积的对数等于对数之和，幂可以提到前面：",
                      ),
                      [`f(x) = ${n}\\ln x + \\ln(${g})`],
                    ],
                    [
                      ["Differentiate each term", "逐项求导"],
                      t(`The derivative of $\\ln(${g})$ is $\\frac{${a}}{${g}}$, so`, `$\\ln(${g})$ 的导数是 $\\frac{${a}}{${g}}$，所以`),
                      [`f'(x) = ${answer}`],
                    ],
                  ]
                : [
                    [["Bring the power down", "把幂提到前面"], none, [`f(x) = ${n}\\ln(${g})`]],
                    [
                      ["Differentiate", "求导"],
                      t(`The derivative of $\\ln(${g})$ is $\\frac{${a}}{${g}}$, so`, `$\\ln(${g})$ 的导数是 $\\frac{${a}}{${g}}$，所以`),
                      [`f'(x) = ${n} \\cdot \\frac{${a}}{${g}} = ${answer}`],
                    ],
                  ],
              quotients(
                fn,
                1,
                value,
                "f",
                "x",
                t(`At $x = 1$ the answer gives $f'(1) = ${value.toLatex()}$.`, `在 $x = 1$ 处，答案给出 $f'(1) = ${value.toLatex()}$。`),
              ),
            ),
          },
          product
            ? [
                say(
                  `\\frac{${n}}{x} \\cdot \\frac{${a}}{${g}}`,
                  "This multiplies the derivatives of the two logarithms. The logarithm of a product splits into a sum, so they are added.",
                  "这把两个对数的导数相乘了。积的对数拆成和，所以应相加。",
                ),
                say(
                  `\\frac{${n}}{x} + \\frac{1}{${g}}`,
                  `This leaves out the factor $${a}$, the derivative of $${g}$.`,
                  `这漏掉了因子 $${a}$，即 $${g}$ 的导数。`,
                ),
                say(
                  `\\frac{1}{x^{${n}}(${g})}`,
                  "This is $\\frac{1}{u}$ with the derivative of the inside left out.",
                  "这是 $\\frac{1}{u}$，漏掉了内层的导数。",
                ),
              ]
            : [
                say(
                  `\\frac{${n}}{${g}}`,
                  `This leaves out the factor $${a}$, the derivative of $${g}$.`,
                  `这漏掉了因子 $${a}$，即 $${g}$ 的导数。`,
                ),
                say(`\\frac{${a}}{${g}}`, `This loses the power $${n}$, which comes down in front.`, `这丢掉了幂 $${n}$，它应提到前面。`),
                say(
                  `\\frac{${n * a}(${g})^{${n - 1}}}{${g}}`,
                  `This differentiates $(${g})^{${n}}$ on top but divides only by $${g}$. The bottom must be the whole inside, $(${g})^{${n}}$.`,
                  `这在分子上对 $(${g})^{${n}}$ 求了导，却只除以 $${g}$。分母应是整个内层 $(${g})^{${n}}$。`,
                ),
              ],
        );
      },
    },
  ],
};

/** TrigOuter is a trigonometric function with its derivative, as a coefficient sign and a function name, and both as numbers. */
interface TrigOuter {
  readonly f: string;
  readonly d: readonly [number, string];
  readonly at: (x: number) => number;
  readonly slope: (x: number) => number;
}

/** trigOuters are sin, cos and tan as outer functions. */
const trigOuters: readonly TrigOuter[] = [
  { f: "\\sin", d: [1, "\\cos"], at: Math.sin, slope: Math.cos },
  { f: "\\cos", d: [-1, "\\sin"], at: Math.cos, slope: (x) => -Math.sin(x) },
  { f: "\\tan", d: [1, "\\sec^{2}"], at: Math.tan, slope: (x) => 1 / Math.cos(x) ** 2 },
];

/** signWhy says what the sign of a trigonometric derivative is. */
const signWhy = (o: TrigOuter): Text =>
  o.f === "\\cos"
    ? t("The derivative of $\\cos u$ is $-\\sin u$; the minus sign is missing.", "$\\cos u$ 的导数是 $-\\sin u$；这里漏了负号。")
    : t(`The derivative of $${o.f} u$ is $${o.d[1]} u$, with no minus sign.`, `$${o.f} u$ 的导数是 $${o.d[1]} u$，没有负号。`);

/** theChainRuleWithTrigonometricFunctions differentiates trigonometric functions of inner functions. */
export const theChainRuleWithTrigonometricFunctions: TopicDef = {
  id: "the-chain-rule-with-trigonometric-functions",
  title: t("The Chain Rule With Trigonometric Functions", "三角函数的链式法则"),
  summary: t(
    "Differentiate trigonometric functions of inner functions and powers of trigonometric functions.",
    "对内层函数的三角函数以及三角函数的幂求导。",
  ),
  intro: t(
    "$\\sin(3x)$ runs through its cycle three times as fast as $\\sin x$, so its slopes are three times as steep: $\\frac{d}{dx}\\sin(3x) = 3\\cos(3x)$. The cosine keeps the inner function $3x$, and the chain rule multiplies by its derivative $3$.\n\nCheck: at $x = 0$, $\\frac{\\sin 0.03 - \\sin 0}{0.01} \\approx 2.9996$, close to $3\\cos 0 = 3$.\n\nIn this lesson we differentiate sine, cosine and tangent of an inner function, and powers of trigonometric functions, where the power is the outer function.",
    "$\\sin(3x)$ 走完一个周期的速度是 $\\sin x$ 的三倍，所以它的斜率也陡三倍：$\\frac{d}{dx}\\sin(3x) = 3\\cos(3x)$。余弦里保留内层函数 $3x$，链式法则再乘以它的导数 $3$。\n\n检验：在 $x = 0$ 处，$\\frac{\\sin 0.03 - \\sin 0}{0.01} \\approx 2.9996$，接近 $3\\cos 0 = 3$。\n\n本课我们对内层函数的正弦、余弦和正切求导，再对三角函数的幂求导，那时幂是外层函数。",
  ),
  prerequisites: ["the-chain-rule-for-differentiation", "differentiating-reciprocal-trigonometric-functions"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.4 },
    { topic: "differentiating-trigonometric-functions", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "trigonometric-functions-of-inner-functions",
      title: t("Trigonometric functions of inner functions", "内层函数的三角函数"),
      explanation: t(
        "Differentiate the outer trigonometric function as usual, keeping the inner function unchanged inside it, then multiply by the derivative of the inner function. $$\\frac{d}{dx} \\sin g(x) = g'(x)\\cos g(x), \\quad \\frac{d}{dx} \\cos g(x) = -g'(x)\\sin g(x), \\quad \\frac{d}{dx} \\tan g(x) = g'(x)\\sec^{2} g(x).$$\n\nFor example, $\\frac{d}{dx} \\cos\\left(x^{2}\\right) = -2x\\sin\\left(x^{2}\\right)$, which is $-2\\sin 1 \\approx -1.6829$ at $x = 1$.\n\nCheck: $\\frac{\\cos(1.01^{2}) - \\cos 1}{0.01} \\approx -1.7022$ and $\\frac{\\cos(0.99^{2}) - \\cos 1}{-0.01} \\approx -1.6637$; their average is $-1.6829$.\n\n> **Watch out.** The inner function stays inside: $\\cos\\left(x^{2}\\right)$ becomes $-\\sin\\left(x^{2}\\right)$ times $2x$, not $-\\sin(2x)$. And the derivative of $\\cos$ carries a minus sign.",
        "像平常一样对外层三角函数求导，里面的内层函数保持不变，再乘以内层函数的导数。$$\\frac{d}{dx} \\sin g(x) = g'(x)\\cos g(x), \\quad \\frac{d}{dx} \\cos g(x) = -g'(x)\\sin g(x), \\quad \\frac{d}{dx} \\tan g(x) = g'(x)\\sec^{2} g(x).$$\n\n例如 $\\frac{d}{dx} \\cos\\left(x^{2}\\right) = -2x\\sin\\left(x^{2}\\right)$，在 $x = 1$ 处等于 $-2\\sin 1 \\approx -1.6829$。\n\n检验：$\\frac{\\cos(1.01^{2}) - \\cos 1}{0.01} \\approx -1.7022$，$\\frac{\\cos(0.99^{2}) - \\cos 1}{-0.01} \\approx -1.6637$，它们的平均值是 $-1.6829$。\n\n> **注意。** 内层函数保留在里面：$\\cos\\left(x^{2}\\right)$ 变成 $-\\sin\\left(x^{2}\\right)$ 乘以 $2x$，而不是 $-\\sin(2x)$。$\\cos$ 的导数带负号。",
      ),
      generate(rng) {
        const o = rng.pick(trigOuters);
        const inner = rng.bool() ? linearInner(rng) : quadraticInner(rng);
        const k = rng.pick([1, 1, 2, 3, -1, -2, 5]);
        const f = poly([k, `${o.f}(${inner.g})`]);
        const answer = times(k * o.d[0], inner, `${o.d[1]}(${inner.g})`);
        const x0 = checkAt(inner, (x) => Math.abs(o.slope(inner.at(x))) > 0.1 && Math.abs(o.slope(inner.at(x))) < 20);
        const g0 = inner.at(x0);
        const latex0 = poly([k * o.d[0] * inner.slope(x0), `${o.d[1]}(${g0})`]);
        const value0 = k * inner.slope(x0) * o.slope(g0);
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Name the inner function", "确定内层函数"],
                  t("The inner function and its derivative are", "内层函数及其导数是"),
                  [`u = ${inner.g}, \\quad u' = ${inner.dg}`],
                ],
                [
                  ["Differentiate the outer function", "对外层函数求导"],
                  t(`Keep $${inner.g}$ inside:`, `$${inner.g}$ 保留在里面：`),
                  [`\\frac{d}{du}\\left(${poly([k, `${o.f} u`])}\\right) = ${poly([k * o.d[0], `${o.d[1]} u`])}`],
                ],
                [
                  ["Multiply by $u'$", "乘以 $u'$"],
                  none,
                  [`f'(x) = ${poly([k * o.d[0], `${o.d[1]}(${inner.g})`])} \\cdot ${factor(inner)} = ${answer}`],
                ],
              ],
              quotients(
                (x) => k * o.at(inner.at(x)),
                x0,
                [latex0, value0],
                "f",
                "x",
                t(
                  `At $x = ${x0}$, where $${inner.g} = ${g0}$, the answer gives $f'(${x0}) = ${latex0}$.`,
                  `在 $x = ${x0}$ 处 $${inner.g} = ${g0}$，答案给出 $f'(${x0}) = ${latex0}$。`,
                ),
              ),
            ),
          },
          [
            say(
              poly([k * o.d[0], `${o.d[1]}(${inner.g})`]),
              `This differentiates the outer function but leaves out the factor $u' = ${inner.dg}$.`,
              `这对外层函数求了导，但漏掉了因子 $u' = ${inner.dg}$。`,
            ),
            { response: times(-k * o.d[0], inner, `${o.d[1]}(${inner.g})`), why: signWhy(o) },
            say(
              poly([k * o.d[0], `${o.d[1]}(${inner.dg})`]),
              `This puts the derivative $${inner.dg}$ inside. The inner function $${inner.g}$ stays inside, and its derivative multiplies in front.`,
              `这把导数 $${inner.dg}$ 放进了括号里。内层函数 $${inner.g}$ 应保留在里面，它的导数乘在前面。`,
            ),
            say(
              times(k, inner, `${o.f}(${inner.g})`),
              `This multiplies by $u'$ but does not differentiate $${o.f}$.`,
              `这乘了 $u'$，但没有对 $${o.f}$ 求导。`,
            ),
          ],
        );
      },
    },
    {
      id: "powers-of-trigonometric-functions",
      title: t("Powers of trigonometric functions", "三角函数的幂"),
      explanation: t(
        "A power of a trigonometric function has the power on the outside, so use the power rule first and then multiply by the derivative of the trigonometric function. $\\sin^{n}x$ means $(\\sin x)^{n}$: the outer function is the power. So\n\n$$\\frac{d}{dx} \\sin^{3}x = 3\\sin^{2}x\\cos x, \\qquad \\frac{d}{dx} \\cos^{4}x = -4\\cos^{3}x\\sin x.$$\n\nCheck: at $x = 1$, $3\\sin^{2}1\\cos 1 \\approx 1.1477$, and $\\frac{\\sin^{3}1.01 - \\sin^{3}1}{0.01} \\approx 1.146$.\n\n> **Watch out.** Two factors come out, one for each layer: the power rule gives $3\\sin^{2}x$, and the derivative of $\\sin x$ gives $\\cos x$. Writing only $3\\sin^{2}x$, or only $\\cos^{3}x$, drops a layer.",
        "三角函数的幂中，幂在外层，所以先用幂法则，再乘以三角函数的导数。$\\sin^{n}x$ 表示 $(\\sin x)^{n}$：外层函数是幂函数。所以\n\n$$\\frac{d}{dx} \\sin^{3}x = 3\\sin^{2}x\\cos x, \\qquad \\frac{d}{dx} \\cos^{4}x = -4\\cos^{3}x\\sin x.$$\n\n检验：在 $x = 1$ 处，$3\\sin^{2}1\\cos 1 \\approx 1.1477$，而 $\\frac{\\sin^{3}1.01 - \\sin^{3}1}{0.01} \\approx 1.146$。\n\n> **注意。** 每一层各出一个因子：幂法则给出 $3\\sin^{2}x$，$\\sin x$ 的导数给出 $\\cos x$。只写 $3\\sin^{2}x$，或只写 $\\cos^{3}x$，都漏掉了一层。",
      ),
      generate(rng) {
        const o = rng.pick(trigOuters);
        const n = rng.int(2, 6);
        const k = rng.pick([1, 1, 2, 3, -1, -2]);
        const pow = (m: number) => (m === 1 ? `${o.f} x` : `${o.f}^{${m}}x`);
        const dPart = o.f === "\\tan" ? "\\sec^{2}x" : `${o.d[1]} x`;
        const dFactor = o.d[0] < 0 ? `\\left(${poly([o.d[0], dPart])}\\right)` : poly([o.d[0], dPart]);
        const answer = poly([k * n * o.d[0], `${pow(n - 1)}${dPart}`]);
        const outer = poly([k * n, n === 2 ? `${o.f} x` : `(${o.f} x)^{${n - 1}}`]);
        const latex1 = answer.replace(/x/g, "(1)");
        const value1 = k * n * o.at(1) ** (n - 1) * o.slope(1);
        const insideOnly = o.f === "\\tan" ? `\\sec^{${2 * (n - 1)}}x` : n === 2 ? `${o.d[1]} x` : `${o.d[1]}^{${n - 1}}x`;
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${poly([k, pow(n)])}$.`, `设 $f(x) = ${poly([k, pow(n)])}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Write it as a power", "写成幂的形式"],
                  t(`The outer function is the power, and the inner function is $${o.f} x$:`, `外层函数是幂函数，内层函数是 $${o.f} x$：`),
                  [`f(x) = ${poly([k, `(${o.f} x)^{${n}}`])}`],
                ],
                [
                  ["Use the power rule on the outside", "对外层用幂法则"],
                  t(`Lower the power and keep $${o.f} x$ inside:`, `把幂次降一，$${o.f} x$ 保留在里面：`),
                  [outer],
                ],
                [
                  ["Multiply by the derivative of the inside", "乘以内层函数的导数"],
                  t(`$\\frac{d}{dx} ${o.f} x = ${poly([o.d[0], dPart])}$, so`, `$\\frac{d}{dx} ${o.f} x = ${poly([o.d[0], dPart])}$，所以`),
                  [`f'(x) = ${outer} \\cdot ${dFactor} = ${answer}`],
                ],
              ],
              quotients(
                (x) => k * o.at(x) ** n,
                1,
                [latex1, value1],
                "f",
                "x",
                t(`At $x = 1$ the answer gives $f'(1) = ${latex1}$.`, `在 $x = 1$ 处，答案给出 $f'(1) = ${latex1}$。`),
              ),
            ),
          },
          [
            say(
              poly([k * n, pow(n - 1)]),
              `This uses the power rule but leaves out the derivative of the inside, $${poly([o.d[0], dPart])}$.`,
              `这用了幂法则，但漏掉了内层的导数 $${poly([o.d[0], dPart])}$。`,
            ),
            say(
              poly([k * n * o.d[0], insideOnly]),
              `This replaces $${o.f} x$ by its derivative under the power. The power rule keeps $${o.f} x$ inside, and its derivative multiplies as a separate factor.`,
              `这在幂里把 $${o.f} x$ 换成了它的导数。幂法则要把 $${o.f} x$ 保留在里面，它的导数作为单独的因子乘上去。`,
            ),
            { response: poly([-k * n * o.d[0], `${pow(n - 1)}${dPart}`]), why: signWhy(o) },
          ],
        );
      },
    },
  ],
};

/** calculatingDerivativesFromDataUsingTheChainRule uses tables with the chain rule. */
export const calculatingDerivativesFromDataUsingTheChainRule: TopicDef = {
  id: "calculating-derivatives-from-data-using-the-chain-rule",
  title: t("Calculating Derivatives From Data Using the Chain Rule", "用链式法则由数据计算导数"),
  summary: t(
    "Use tables of function and derivative values to differentiate compositions and powers.",
    "利用函数值和导数值的表格对复合函数和幂求导。",
  ),
  intro: t(
    "The chain rule at a point needs only numbers: for $h(x) = f(g(x))$, $h'(a) = f'(g(a)) \\cdot g'(a)$. If $g(1) = 2$, $g'(1) = 4$ and $f'(2) = -3$, then $h'(1) = -3 \\cdot 4 = -12$, with no formulas for $f$ or $g$.\n\nCheck: $g(x) = 4x - 2$ and $f(x) = -3x$ have these values, and then $h(x) = -3(4x - 2) = -12x + 6$, whose slope is $-12$.\n\nIn this lesson we read such values from tables, first for a composition of two functions and then for powers and roots of a function.",
    "在一点处用链式法则只需要数值：对 $h(x) = f(g(x))$，$h'(a) = f'(g(a)) \\cdot g'(a)$。若 $g(1) = 2$，$g'(1) = 4$，$f'(2) = -3$，则 $h'(1) = -3 \\cdot 4 = -12$，不需要 $f$ 或 $g$ 的式子。\n\n检验：$g(x) = 4x - 2$ 与 $f(x) = -3x$ 符合这些值，此时 $h(x) = -3(4x - 2) = -12x + 6$，斜率是 $-12$。\n\n本课我们从表格中读出这样的值，先求两个函数的复合，再求一个函数的幂与根式。",
  ),
  prerequisites: ["the-chain-rule-for-differentiation", "calculating-derivatives-from-data-and-tables"],
  encompasses: [
    { topic: "the-chain-rule-for-differentiation", weight: 0.3 },
    { topic: "calculating-derivatives-from-data-and-tables", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "compositions-from-a-table",
      title: t("Compositions from a table", "由表格求复合函数的导数"),
      explanation: t(
        "For $h(x) = f(g(x))$, $h'(a) = f'(g(a))\\,g'(a)$. Read $g(a)$ from the table, then look up $f'$ at that value, which is usually in a different row.\n\nFor example, if $g(2) = 5$, $g'(2) = 3$ and $f'(5) = 4$, then $h'(2) = f'(5) \\cdot g'(2) = 12$.\n\nCheck: $g(x) = 3x - 1$ and $f(x) = 4x$ have these values, and then $h(x) = 4(3x - 1) = 12x - 4$, whose slope is $12$.\n\n> **Watch out.** Read $f'$ in the row of $g(a)$, not in the row of $a$, and use the slope $f'$ there, not the value $f$.",
        "对 $h(x) = f(g(x))$，$h'(a) = f'(g(a))\\,g'(a)$。先从表中读出 $g(a)$，再查 $f'$ 在该值处的值，它通常在另一行。\n\n例如，若 $g(2) = 5$，$g'(2) = 3$，$f'(5) = 4$，则 $h'(2) = f'(5) \\cdot g'(2) = 12$。\n\n检验：$g(x) = 3x - 1$ 与 $f(x) = 4x$ 符合这些值，此时 $h(x) = 4(3x - 1) = 12x - 4$，斜率是 $12$。\n\n> **注意。** $f'$ 要在 $g(a)$ 那一行读，而不是在 $a$ 那一行；读的是斜率 $f'$，不是函数值 $f$。",
      ),
      generate(rng) {
        const xs = [1, 2, 3, 4];
        const rows = xs.map(() => [rng.int(1, 4), rng.nonZero(-5, 5), rng.int(1, 4), rng.nonZero(-5, 5)] as const);
        const i = rng.int(0, 3);
        const a = xs[i]!;
        const fOfG = rng.bool();
        const [inner, dInner] = fOfG ? [rows[i]![2], rows[i]![3]] : [rows[i]![0], rows[i]![1]];
        const dOuter = fOfG ? rows[inner - 1]![1] : rows[inner - 1]![3];
        const outerValue = fOfG ? rows[inner - 1]![0] : rows[inner - 1]![2];
        const answer = dOuter * dInner;
        const [F, G] = fOfG ? ["f", "g"] : ["g", "f"];
        const sameRow = fOfG ? rows[i]![1] : rows[i]![3];
        const tab = table(
          ["$x$", "$f(x)$", "$f'(x)$", "$g(x)$", "$g'(x)$"],
          ...xs.map((x, j) => [`$${x}$`, ...rows[j]!.map((v) => `$${v}$`)]),
        );
        const move = dInner * 0.01;
        return numberProblem({
          prompt: t(
            `The table gives values of $f$, $g$ and their derivatives.\n\n${tab}\n\nLet $h(x) = ${F}(${G}(x))$. Find $h'(${a})$.`,
            `下表给出 $f$、$g$ 及其导数的值。\n\n${tab}\n\n设 $h(x) = ${F}(${G}(x))$。求 $h'(${a})$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              sameRow * dInner,
              `This reads $${F}'$ in the row $x = ${a}$. The outer derivative belongs at $${G}(${a}) = ${inner}$.`,
              `这是在 $x = ${a}$ 那一行读的 $${F}'$。外层导数应在 $${G}(${a}) = ${inner}$ 处读取。`,
            ),
            why(
              dOuter,
              `This is $${F}'(${inner})$ alone; multiply by $${G}'(${a}) = ${dInner}$.`,
              `这只是 $${F}'(${inner})$；还要乘以 $${G}'(${a}) = ${dInner}$。`,
            ),
            why(
              dOuter * inner,
              `This multiplies by the value $${G}(${a}) = ${inner}$. The chain rule needs the slope $${G}'(${a}) = ${dInner}$.`,
              `这乘的是函数值 $${G}(${a}) = ${inner}$。链式法则需要的是斜率 $${G}'(${a}) = ${dInner}$。`,
            ),
            why(
              outerValue * dInner,
              `This uses the value $${F}(${inner}) = ${outerValue}$, not the slope $${F}'(${inner})$.`,
              `这用了函数值 $${F}(${inner}) = ${outerValue}$，而不是斜率 $${F}'(${inner})$。`,
            ),
          ]),
          solution: walked(
            [
              [
                [`Read the inner function at $x = ${a}$`, `在 $x = ${a}$ 处读内层函数`],
                t(`In the row $x = ${a}$:`, `在 $x = ${a}$ 那一行：`),
                [`${G}(${a}) = ${inner}, \\quad ${G}'(${a}) = ${dInner}`],
              ],
              [
                ["Read the outer slope at the inner value", "在内层的值处读外层斜率"],
                t(`The outer derivative is read in the row $x = ${inner}$:`, `外层导数在 $x = ${inner}$ 那一行读取：`),
                [`${F}'(${inner}) = ${dOuter}`],
              ],
              [
                ["Multiply", "相乘"],
                none,
                [`h'(${a}) = ${F}'(${G}(${a})) \\cdot ${G}'(${a}) = ${par(dOuter)} \\cdot ${par(dInner)} = ${answer}`],
              ],
            ],
            t(
              `Follow a small step. When $x$ moves from $${a}$ to $${a}.01$, $${G}(x)$ moves away from $${inner}$ by about $${par(dInner)} \\cdot 0.01 = ${fmt(move)}$. Near $${inner}$, $${F}$ changes about $${par(dOuter)}$ times as much, by $${fmt(dOuter * move)}$. Dividing that change in $h$ by $0.01$ gives $${answer}$ again.`,
              `跟着一小步走。当 $x$ 从 $${a}$ 变到 $${a}.01$ 时，$${G}(x)$ 从 $${inner}$ 大约移动 $${par(dInner)} \\cdot 0.01 = ${fmt(move)}$。在 $${inner}$ 附近，$${F}$ 的变化大约是它的 $${par(dOuter)}$ 倍，即 $${fmt(dOuter * move)}$。把 $h$ 的这个变化除以 $0.01$，又得到 $${answer}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "powers-and-roots-from-a-table",
      title: t("Powers and roots from a table", "由表格求幂与根式的导数"),
      explanation: t(
        "Use the chain rule at the point with the tabulated values, putting the value of the inner function into the derivative of the power or root. For $h(x) = [f(x)]^{n}$, $h'(a) = n[f(a)]^{n - 1}f'(a)$. For $h(x) = \\sqrt{f(x)}$, $h'(a) = \\frac{f'(a)}{2\\sqrt{f(a)}}$.\n\nFor example, if $f(2) = 3$ and $f'(2) = 5$, then $[f(x)]^{2}$ has derivative $2 \\cdot 3 \\cdot 5 = 30$ at $x = 2$.\n\nCheck: near $x = 2$, $f(x) \\approx 3 + 5(x - 2)$, so at $x = 2.01$, $[f(x)]^{2} \\approx 3.05^{2} = 9.3025$, and $\\frac{9.3025 - 9}{0.01} = 30.25$, close to $30$.\n\n> **Watch out.** The power is applied to the value $f(a)$, and the slope $f'(a)$ multiplies once: $n[f(a)]^{n - 1}f'(a)$, not $n[f'(a)]^{n - 1}$. For a root, $2\\sqrt{f(a)}$ goes in the denominator.",
        "在该点用表中的值套用链式法则，把内层函数的值代入幂或根式的导数中。对 $h(x) = [f(x)]^{n}$，$h'(a) = n[f(a)]^{n - 1}f'(a)$。对 $h(x) = \\sqrt{f(x)}$，$h'(a) = \\frac{f'(a)}{2\\sqrt{f(a)}}$。\n\n例如，若 $f(2) = 3$，$f'(2) = 5$，则 $[f(x)]^{2}$ 在 $x = 2$ 处的导数是 $2 \\cdot 3 \\cdot 5 = 30$。\n\n检验：在 $x = 2$ 附近 $f(x) \\approx 3 + 5(x - 2)$，所以在 $x = 2.01$ 处 $[f(x)]^{2} \\approx 3.05^{2} = 9.3025$，而 $\\frac{9.3025 - 9}{0.01} = 30.25$，接近 $30$。\n\n> **注意。** 幂作用在函数值 $f(a)$ 上，斜率 $f'(a)$ 只乘一次：是 $n[f(a)]^{n - 1}f'(a)$，不是 $n[f'(a)]^{n - 1}$。对根式，$2\\sqrt{f(a)}$ 在分母上。",
      ),
      generate(rng) {
        const xs = [0, 1, 2, 3];
        const root = rng.bool();
        const rows = xs.map(() => [root ? rng.pick([1, 4, 9, 16]) : rng.nonZero(-4, 4), rng.nonZero(-6, 6)] as const);
        const i = rng.int(0, 3);
        const a = xs[i]!;
        const [f, df] = rows[i]!;
        const n = rng.int(2, 4);
        const tab = table(
          ["$x$", ...xs.map((x) => `$${x}$`)],
          ["$f(x)$", ...rows.map((r) => `$${r[0]}$`)],
          ["$f'(x)$", ...rows.map((r) => `$${r[1]}$`)],
        );
        const h = root ? "\\sqrt{f(x)}" : `[f(x)]^{${n}}`;
        const r = Math.sqrt(f);
        const answer = root ? Q.of(df, 2 * r) : Q.of(n * f ** (n - 1) * df);
        const outer = (y: number) => (root ? Math.sqrt(y) : y ** n);
        const tangent = `${f} + ${par(df)}(${bare(a)})`;
        return numberProblem({
          prompt: t(
            `The table gives values of $f$ and $f'$.\n\n${tab}\n\nLet $h(x) = ${h}$. Find $h'(${a})$.`,
            `下表给出 $f$ 和 $f'$ 的值。\n\n${tab}\n\n设 $h(x) = ${h}$。求 $h'(${a})$。`,
          ),
          answer,
          mistakes: firsts(
            root
              ? [
                  why(
                    Q.of(df, 2),
                    `This leaves out the root: divide by $2\\sqrt{f(${a})} = ${2 * r}$, not by $2$.`,
                    `这漏掉了根式：应除以 $2\\sqrt{f(${a})} = ${2 * r}$，而不是 $2$。`,
                  ),
                  why(
                    Q.of(df, r),
                    "This drops the $2$ that comes from the power $\\frac{1}{2}$.",
                    "这丢掉了来自幂 $\\frac{1}{2}$ 的 $2$。",
                  ),
                  why(Q.of(1, 2 * r), `This leaves out the factor $f'(${a}) = ${df}$.`, `这漏掉了因子 $f'(${a}) = ${df}$。`),
                ]
              : [
                  why(Q.of(n * f ** (n - 1)), `This leaves out the factor $f'(${a}) = ${df}$.`, `这漏掉了因子 $f'(${a}) = ${df}$。`),
                  why(
                    Q.of(n * df ** (n - 1)),
                    `This raises the slope $f'(${a})$ to the power. The power belongs on the value $f(${a}) = ${f}$.`,
                    `这把斜率 $f'(${a})$ 乘方了。乘方的应是函数值 $f(${a}) = ${f}$。`,
                  ),
                  why(Q.of(f ** n), `This is $h(${a})$, the value of $h$, not its slope.`, `这是 $h(${a})$，即 $h$ 的值，不是它的斜率。`),
                ],
          ),
          solution: walked(
            [
              [[`Read the table at $x = ${a}$`, `在 $x = ${a}$ 处读表`], none, [`f(${a}) = ${f}, \\quad f'(${a}) = ${df}`]],
              root
                ? [
                    ["Use the chain rule", "用链式法则"],
                    t("The derivative of $\\sqrt{u}$ is $\\frac{u'}{2\\sqrt{u}}$:", "$\\sqrt{u}$ 的导数是 $\\frac{u'}{2\\sqrt{u}}$："),
                    [`h'(${a}) = \\frac{f'(${a})}{2\\sqrt{f(${a})}} = \\frac{${df}}{2\\sqrt{${f}}} = ${answer.toLatex()}`],
                  ]
                : [
                    ["Use the chain rule", "用链式法则"],
                    t(
                      `The derivative of $u^{${n}}$ is $${n}u${n === 2 ? "" : `^{${n - 1}}`}u'$:`,
                      `$u^{${n}}$ 的导数是 $${n}u${n === 2 ? "" : `^{${n - 1}}`}u'$：`,
                    ),
                    [
                      `h'(${a}) = ${n}${n === 2 ? `f(${a})` : `[f(${a})]^{${n - 1}}`}f'(${a}) = ${n} \\cdot ${n === 2 ? par(f) : `${par(f)}^{${n - 1}}`} \\cdot ${par(df)} = ${answer.toLatex()}`,
                    ],
                  ],
            ],
            quotients(
              (x) => outer(f + df * (x - a)),
              a,
              answer,
              "h",
              "x",
              t(
                `Near $x = ${a}$, $f(x) \\approx ${tangent}$, its tangent line, so $h$ can be estimated just beside $x = ${a}$.`,
                `在 $x = ${a}$ 附近 $f(x) \\approx ${tangent}$，即它的切线，所以可以估计 $h$ 在 $x = ${a}$ 两旁的值。`,
              ),
              "\\Delta x",
            ),
          ),
        });
      },
    },
  ],
};

/** polyXs are the x-coordinates of a polyline's vertices. */
const polyXs = [-6, -4, -2, 0, 2, 4, 6];

/** polyline chooses a piecewise linear graph through integer points at x = −6, −4, …, 6. */
function polyline(rng: Rng): readonly number[] {
  const ys = [rng.int(-4, 4)];
  for (let i = 1; i < polyXs.length; i++) {
    let y = ys[i - 1]! + rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
    if (y > 6 || y < -6) y = ys[i - 1]! - Math.sign(y) * 2;
    ys.push(y);
  }
  return ys;
}

/** polylineFigure draws a polyline. */
function polylineFigure(ys: readonly number[]): Figure {
  const marks: PlaneMark[] = ys.slice(1).map((y, i) => ({
    kind: "segment" as const,
    a: [polyXs[i]!, ys[i]!] as const,
    b: [polyXs[i + 1]!, y] as const,
    accent: true,
  }));
  return {
    svg: plane({ xMin: -7, xMax: 7, yMin: -7, yMax: 7 }, marks),
    alt: t(
      `A piecewise linear graph through ${ys.map((y, i) => `(${polyXs[i]}, ${y})`).join(", ")}.`,
      `经过 ${ys.map((y, i) => `(${polyXs[i]}, ${y})`).join("、")} 的折线图。`,
    ),
  };
}

/** polyAt is the value and slope of a polyline at an odd x, inside a segment, with the segment's ends. */
function polyAt(ys: readonly number[], x: number) {
  const i = (x + 6 - 1) / 2;
  return {
    value: Q.of(ys[i]! + ys[i + 1]!, 2),
    slope: Q.of(ys[i + 1]! - ys[i]!, 2),
    from: `(${x - 1}, ${ys[i]})`,
    to: `(${x + 1}, ${ys[i + 1]})`,
    rise: `\\frac{${ys[i + 1]} - ${par(ys[i]!)}}{2}`,
  };
}

/** calculatingDerivativesFromGraphsUsingTheChainRule reads graphs with the chain rule. */
export const calculatingDerivativesFromGraphsUsingTheChainRule: TopicDef = {
  id: "calculating-derivatives-from-graphs-using-the-chain-rule",
  title: t("Calculating Derivatives From Graphs Using the Chain Rule", "用链式法则由图像计算导数"),
  summary: t(
    "Read values and slopes from a graph and combine them with the chain rule.",
    "从图像读出函数值和斜率，并结合链式法则计算导数。",
  ),
  intro: t(
    "A graph gives both the heights and the slopes the chain rule needs. Suppose that near $x = 3$ the graph of $f$ is a line through $(3, 2)$ with slope $\\frac{1}{2}$. For $h(x) = f(2x + 1)$, the input at $x = 1$ is $3$, so $h'(1) = 2 \\cdot f'(3) = 2 \\cdot \\frac{1}{2} = 1$.\n\nCheck: $h(1.01) = f(3.02) = 2 + \\frac{1}{2} \\cdot 0.02 = 2.01$ and $h(1) = f(3) = 2$, so $\\frac{2.01 - 2}{0.01} = 1$.\n\nIn this lesson we read slopes from a graph made of line segments, first when a linear function sits inside the graphed function and then when the graphed function sits inside another.",
    "图像既给出链式法则需要的高度，也给出斜率。设在 $x = 3$ 附近 $f$ 的图像是一条经过 $(3, 2)$、斜率为 $\\frac{1}{2}$ 的直线。对 $h(x) = f(2x + 1)$，$x = 1$ 时的输入是 $3$，所以 $h'(1) = 2 \\cdot f'(3) = 2 \\cdot \\frac{1}{2} = 1$。\n\n检验：$h(1.01) = f(3.02) = 2 + \\frac{1}{2} \\cdot 0.02 = 2.01$，$h(1) = f(3) = 2$，所以 $\\frac{2.01 - 2}{0.01} = 1$。\n\n本课我们从由线段组成的图像中读出斜率，先处理一次函数在图中函数内部的情形，再处理图中函数在另一个函数内部的情形。",
  ),
  prerequisites: ["calculating-derivatives-from-data-using-the-chain-rule", "calculating-derivatives-from-graphs"],
  encompasses: [
    { topic: "calculating-derivatives-from-data-using-the-chain-rule", weight: 0.4 },
    { topic: "calculating-derivatives-from-graphs", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "inner-linear-functions-from-a-graph",
      figure: calculusDrawings2["calculating-derivatives-from-graphs-using-the-chain-rule#inner-linear-functions-from-a-graph"],
      title: t("Inner linear functions from a graph", "由图像求内层为一次函数的导数"),
      explanation: t(
        "For $h(x) = f(kx + b)$, $h'(a) = k \\cdot f'(ka + b)$: find the input $ka + b$, read the slope of the graph of $f$ there, and multiply by $k$.\n\nFor example, if the graph of $f$ has slope $-2$ at $x = 5$, then $h(x) = f(3x - 1)$ has $h'(2) = 3 \\cdot f'(5) = -6$.\n\nCheck: on that piece of the graph $f$ falls $2$ for each unit, and $x$ moving by $0.01$ moves the input $3x - 1$ by $0.03$, so $h$ falls by $0.06$, which is $-6$ per unit.\n\n> **Watch out.** Read the slope at the input $ka + b$, not at $a$, and multiply by the inner slope $k$, including its sign.",
        "对 $h(x) = f(kx + b)$，$h'(a) = k \\cdot f'(ka + b)$：先求出输入值 $ka + b$，读出 $f$ 的图像在该处的斜率，再乘以 $k$。\n\n例如，若 $f$ 的图像在 $x = 5$ 处的斜率是 $-2$，则 $h(x) = f(3x - 1)$ 满足 $h'(2) = 3 \\cdot f'(5) = -6$。\n\n检验：在图像的这一段上，$f$ 每单位下降 $2$；$x$ 移动 $0.01$ 时，输入 $3x - 1$ 移动 $0.03$，所以 $h$ 下降 $0.06$，即每单位 $-6$。\n\n> **注意。** 斜率要在输入值 $ka + b$ 处读，而不是在 $a$ 处读；还要乘以内层斜率 $k$，连同它的符号。",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const k = rng.pick([2, 3, -1, -2, -3]);
        const u = rng.pick([-5, -3, -1, 1, 3, 5]);
        const a = rng.int(-3, 3);
        const b = u - k * a;
        const s = polyAt(ys, u);
        const answer = s.slope.mul(Q.of(k));
        const inner = poly([k, "x"], [b, ""]);
        const v0 = s.value.toNumber();
        const v1 = v0 + s.slope.toNumber() * k * 0.01;
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Let $h(x) = f(${inner})$. Find $h'(${a})$.`,
              `$y = f(x)$ 的图像由若干线段组成。设 $h(x) = f(${inner})$。求 $h'(${a})$。`,
            ),
            answer,
            mistakes: firsts([
              why(
                s.slope,
                `This is $f'(${u})$ alone; the chain rule multiplies by the inner slope $${k}$.`,
                `这只是 $f'(${u})$；链式法则还要乘以内层斜率 $${k}$。`,
              ),
              why(
                s.value.mul(Q.of(k)),
                `This uses the height $f(${u}) = ${s.value.toLatex()}$ in place of the slope $f'(${u})$.`,
                `这用了高度 $f(${u}) = ${s.value.toLatex()}$，而不是斜率 $f'(${u})$。`,
              ),
              ...(a % 2 !== 0 && a !== u
                ? [
                    why(
                      polyAt(ys, a).slope.mul(Q.of(k)),
                      `This reads the slope at $x = ${a}$. The slope of $f$ is needed at the input $${u}$.`,
                      `这是在 $x = ${a}$ 处读的斜率。$f$ 的斜率应在输入值 $${u}$ 处读取。`,
                    ),
                  ]
                : []),
              ...(k < 0 ? [why(answer.neg(), `This drops the sign of the inner slope $${k}$.`, `这丢掉了内层斜率 $${k}$ 的符号。`)] : []),
            ]),
            solution: walked(
              [
                [
                  ["Find the input", "求输入值"],
                  t(`At $x = ${a}$ the input of $f$ is`, `在 $x = ${a}$ 处 $f$ 的输入值是`),
                  [`${inner.replace("x", `(${a})`)} = ${u}`],
                ],
                [
                  ["Read the slope of the graph there", "读出该处的斜率"],
                  t(
                    `At $x = ${u}$ the graph is the segment from $${s.from}$ to $${s.to}$, so`,
                    `在 $x = ${u}$ 处图像是从 $${s.from}$ 到 $${s.to}$ 的线段，所以`,
                  ),
                  [`f'(${u}) = ${s.rise} = ${s.slope.toLatex()}`],
                ],
                [
                  ["Multiply by the inner slope", "乘以内层函数的斜率"],
                  t(`The inner function $${inner}$ has slope $${k}$:`, `内层函数 $${inner}$ 的斜率是 $${k}$：`),
                  [`h'(${a}) = ${k} \\cdot ${par(s.slope)} = ${answer.toLatex()}`],
                ],
              ],
              t(
                `Near $x = ${u}$ the graph is a straight line through $(${u}, ${s.value.toLatex()})$. At $x = ${fmt(a + 0.01)}$ the input is $${fmt(u + 0.01 * k)}$, where $f$ is $${fmt(v1)}$. So $\\frac{h(${fmt(a + 0.01)}) - h(${a})}{0.01} = \\frac{${fmt(v1)} - ${fp(v0)}}{0.01} = ${fmt((v1 - v0) / 0.01)}$, as found.`,
                `在 $x = ${u}$ 附近，图像是经过 $(${u}, ${s.value.toLatex()})$ 的直线。在 $x = ${fmt(a + 0.01)}$ 处输入值是 $${fmt(u + 0.01 * k)}$，$f$ 在那里等于 $${fmt(v1)}$。所以 $\\frac{h(${fmt(a + 0.01)}) - h(${a})}{0.01} = \\frac{${fmt(v1)} - ${fp(v0)}}{0.01} = ${fmt((v1 - v0) / 0.01)}$，与所求一致。`,
              ),
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
    {
      id: "outer-functions-of-a-graphed-function",
      figure: calculusDrawings2["calculating-derivatives-from-graphs-using-the-chain-rule#outer-functions-of-a-graphed-function"],
      title: t("Outer functions of a graphed function", "以图中函数为内层的导数"),
      explanation: t(
        "When the graphed function is inside another function, the chain rule needs both its height and its slope at the point, both of which you read from the graph. When the graphed function is the inner one, read both $f(a)$ and $f'(a)$. For $h(x) = [f(x)]^{2}$, $h'(a) = 2f(a)f'(a)$; for $h(x) = e^{f(x)}$, $h'(a) = f'(a)e^{f(a)}$.\n\nFor example, if the graph passes through $(1, 3)$ with slope $2$, then $[f(x)]^{2}$ has derivative $2 \\cdot 3 \\cdot 2 = 12$ at $x = 1$.\n\nCheck: $f(1.01) = 3.02$, so $\\frac{3.02^{2} - 3^{2}}{0.01} = 12.04$, close to $12$.\n\n> **Watch out.** The power goes on the height $f(a)$, and the slope $f'(a)$ multiplies once. Read the height at the point itself: on a segment it is halfway between the ends.",
        "当图像给出的函数位于另一个函数内部时，链式法则既要用到它在该点的高度，也要用到斜率，两者都从图像读出。当图中的函数是内层函数时，要读出 $f(a)$ 和 $f'(a)$。对 $h(x) = [f(x)]^{2}$，$h'(a) = 2f(a)f'(a)$；对 $h(x) = e^{f(x)}$，$h'(a) = f'(a)e^{f(a)}$。\n\n例如，若图像经过 $(1, 3)$ 且斜率为 $2$，则 $[f(x)]^{2}$ 在 $x = 1$ 处的导数是 $2 \\cdot 3 \\cdot 2 = 12$。\n\n检验：$f(1.01) = 3.02$，所以 $\\frac{3.02^{2} - 3^{2}}{0.01} = 12.04$，接近 $12$。\n\n> **注意。** 乘方作用在高度 $f(a)$ 上，斜率 $f'(a)$ 只乘一次。高度要在该点本身读：在线段上，它位于两端的正中间。",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const a = rng.pick([-5, -3, -1, 1, 3, 5]);
        const s = polyAt(ys, a);
        const n = rng.int(2, 3);
        const answer = Q.of(n)
          .mul(s.value.pow(n - 1))
          .mul(s.slope);
        const v = s.value.toNumber();
        const m = s.slope.toNumber();
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Let $h(x) = [f(x)]^{${n}}$. Find $h'(${a})$.`,
              `$y = f(x)$ 的图像由若干线段组成。设 $h(x) = [f(x)]^{${n}}$。求 $h'(${a})$。`,
            ),
            answer,
            mistakes: firsts([
              why(
                Q.of(n).mul(s.slope.pow(n - 1)),
                `This raises the slope to the power. The power belongs on the height $f(${a}) = ${s.value.toLatex()}$.`,
                `这把斜率乘方了。乘方的应是高度 $f(${a}) = ${s.value.toLatex()}$。`,
              ),
              why(
                Q.of(n).mul(s.value.pow(n - 1)),
                `This leaves out the factor $f'(${a}) = ${s.slope.toLatex()}$.`,
                `这漏掉了因子 $f'(${a}) = ${s.slope.toLatex()}$。`,
              ),
              why(s.value.pow(n), `This is $h(${a})$, the height of $h$, not its slope.`, `这是 $h(${a})$，即 $h$ 的高度，不是它的斜率。`),
            ]),
            solution: walked(
              [
                [
                  [`Read the graph at $x = ${a}$`, `在 $x = ${a}$ 处读图`],
                  t(
                    `At $x = ${a}$ the graph is the segment from $${s.from}$ to $${s.to}$. The height is halfway between the ends, and the slope is the rise over $2$:`,
                    `在 $x = ${a}$ 处图像是从 $${s.from}$ 到 $${s.to}$ 的线段。高度位于两端的正中间，斜率是上升量除以 $2$：`,
                  ),
                  [`f(${a}) = ${s.value.toLatex()}, \\quad f'(${a}) = ${s.rise} = ${s.slope.toLatex()}`],
                ],
                [
                  ["Use the chain rule", "用链式法则"],
                  none,
                  [
                    `h'(${a}) = ${n}${n === 2 ? `f(${a})` : `[f(${a})]^{${n - 1}}`}f'(${a}) = ${n} \\cdot ${n === 2 ? par(s.value) : `\\left(${s.value.toLatex()}\\right)^{${n - 1}}`} \\cdot ${par(s.slope)} = ${answer.toLatex()}`,
                  ],
                ],
              ],
              quotients(
                (x) => (v + m * (x - a)) ** n,
                a,
                answer,
                "h",
                "x",
                t(
                  `On that segment $f(x) = ${s.value.toLatex()} + ${par(s.slope)}(${bare(a)})$ exactly, so $h$ can be evaluated just beside $x = ${a}$.`,
                  `在这条线段上 $f(x) = ${s.value.toLatex()} + ${par(s.slope)}(${bare(a)})$ 精确成立，所以可以计算 $h$ 在 $x = ${a}$ 两旁的值。`,
                ),
                "\\Delta x",
              ),
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
  ],
};

/** Procedure is the rule to apply first. */
type Procedure = "product" | "quotient" | "chain" | "basic";

/** procedures are the rules in the order of the options. */
const procedures: readonly Procedure[] = ["product", "quotient", "chain", "basic"];

/** evaluate gives a basic function's value at a number. */
const evaluate: Record<string, (x: number) => number> = {
  "\\sin x": Math.sin,
  "\\cos x": Math.cos,
  "e^{x}": Math.exp,
  "\\ln x": Math.log,
  "\\tan x": Math.tan,
};

/** selectingProceduresForCalculatingDerivatives chooses and combines rules. */
export const selectingProceduresForCalculatingDerivatives: TopicDef = {
  id: "selecting-procedures-for-calculating-derivatives",
  title: t("Selecting Procedures for Calculating Derivatives", "选择求导方法"),
  summary: t(
    "Decide which differentiation rule an expression needs, and combine the product, quotient and chain rules.",
    "判断一个式子需要用哪条求导法则，并综合运用乘积、商和链式法则。",
  ),
  intro: t(
    "$x^{2}\\sin x$ and $\\sin\\left(x^{2}\\right)$ are built from the same pieces, but the first multiplies them and the second puts one inside the other. So the first needs the product rule, $2x\\sin x + x^{2}\\cos x$, and the second the chain rule, $2x\\cos\\left(x^{2}\\right)$.\n\nCheck: at $x = 1$, $2\\cos 1 \\approx 1.0806$, and $\\frac{\\sin(1.01^{2}) - \\sin 1}{0.01} \\approx 1.0689$ and $\\frac{\\sin(0.99^{2}) - \\sin 1}{-0.01} \\approx 1.0918$ lie on either side of it.\n\nIn this lesson we find the outermost operation of an expression to choose the rule, combine the product and chain rules, and pick out the correct derivative from common mistakes.",
    "$x^{2}\\sin x$ 与 $\\sin\\left(x^{2}\\right)$ 由同样的部分组成，但前者把它们相乘，后者把一个放进另一个里面。所以前者要用乘积法则，得 $2x\\sin x + x^{2}\\cos x$；后者要用链式法则，得 $2x\\cos\\left(x^{2}\\right)$。\n\n检验：在 $x = 1$ 处，$2\\cos 1 \\approx 1.0806$，而 $\\frac{\\sin(1.01^{2}) - \\sin 1}{0.01} \\approx 1.0689$ 与 $\\frac{\\sin(0.99^{2}) - \\sin 1}{-0.01} \\approx 1.0918$ 位于它的两侧。\n\n本课我们通过找出式子最外层的运算来选择法则，综合运用乘积法则与链式法则，并从常见错误中选出正确的导数。",
  ),
  prerequisites: [
    "the-chain-rule-with-exponential-functions",
    "the-chain-rule-with-logarithmic-functions",
    "the-chain-rule-with-trigonometric-functions",
  ],
  encompasses: [
    { topic: "the-chain-rule-with-exponential-functions", weight: 0.2 },
    { topic: "the-chain-rule-with-trigonometric-functions", weight: 0.2 },
    { topic: "the-product-rule-for-differentiation", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "identifying-the-outermost-operation",
      title: t("Identifying the outermost operation", "识别最外层的运算"),
      explanation: t(
        "The rule to use first is set by the **last** operation you would do to evaluate the expression:\n\n- a product of two functions of $x$: the product rule, as in $x^{2}\\sin x$;\n- a quotient of two functions of $x$: the quotient rule, as in $\\frac{e^{x}}{x}$;\n- a function applied to an inner function: the chain rule, as in $\\sin\\left(x^{2}\\right)$;\n- a constant times a basic function: the constant multiple rule only, as in $5e^{x}$.\n\nCheck: to evaluate $\\sin\\left(x^{2}\\right)$ at $x = 3$, first square, $9$, then take $\\sin 9$; the last step applies $\\sin$, so the chain rule comes first.\n\n> **Watch out.** $e^{x^{2}}$ is not a power of $x$ but $e$ raised to an inner function, so it needs the chain rule. And $5e^{x}$ is not a product of two functions of $x$: the constant just stays in front.",
        "首先使用的法则由求值时**最后**进行的运算决定：\n\n- 两个关于 $x$ 的函数之积：乘积法则，如 $x^{2}\\sin x$；\n- 两个关于 $x$ 的函数之商：商法则，如 $\\frac{e^{x}}{x}$；\n- 函数作用于内层函数：链式法则，如 $\\sin\\left(x^{2}\\right)$；\n- 常数乘以基本函数：只需常数倍法则，如 $5e^{x}$。\n\n检验：在 $x = 3$ 处计算 $\\sin\\left(x^{2}\\right)$，先平方得 $9$，再求 $\\sin 9$；最后一步是作用 $\\sin$，所以先用链式法则。\n\n> **注意。** $e^{x^{2}}$ 不是 $x$ 的幂，而是 $e$ 的内层函数次幂，所以要用链式法则。$5e^{x}$ 也不是两个关于 $x$ 的函数之积：常数只需留在前面。",
      ),
      generate(rng) {
        const fs = ["\\sin x", "\\cos x", "e^{x}", "\\ln x", "\\tan x"];
        const [u, v] = rng.sample(fs, 2) as [string, string];
        const n = rng.int(2, 5);
        const kind = rng.pick<Procedure>(["product", "quotient", "chain", "basic"]);
        const strip = (f: string) => f.replace(" x", "").replace("^{x}", "");
        const overPower = rng.bool();
        const bottom = overPower ? `x^{${n}}` : v;
        const expr =
          kind === "product"
            ? `x^{${n}}${u}`
            : kind === "quotient"
              ? `\\frac{${u}}{${bottom}}`
              : kind === "chain"
                ? u === "e^{x}"
                  ? `e^{x^{${n}}}`
                  : `${strip(u)}\\left(x^{${n}}\\right)`
                : `${n}${u}`;
        const options = [
          t("The product rule", "乘积法则"),
          t("The quotient rule", "商法则"),
          t("The chain rule", "链式法则"),
          t("Only the constant multiple rule", "只需常数倍法则"),
        ];
        const index = procedures.indexOf(kind);
        const at2 = (f: string) => f.replace(/x/g, "2");
        const U2 = evaluate[u]!(2);
        const p2 = 2 ** n;
        const outerName = u === "e^{x}" ? "e^{u}" : `${strip(u)} u`;
        const outer2 = u === "e^{x}" ? `e^{${p2}}` : `${strip(u)} ${p2}`;
        const lastStep: Record<Procedure, Text> = {
          product: t(
            `To evaluate $${expr}$ at a number, find $x^{${n}}$ and $${u}$ and then multiply them: the last step is a product of two functions of $x$.`,
            `在某个数处计算 $${expr}$，要先求 $x^{${n}}$ 和 $${u}$，再把它们相乘：最后一步是两个关于 $x$ 的函数之积。`,
          ),
          quotient: t(
            `To evaluate $${expr}$ at a number, find the top and the bottom and then divide: the last step is a quotient of two functions of $x$.`,
            `在某个数处计算 $${expr}$，要先求分子和分母，再相除：最后一步是两个关于 $x$ 的函数之商。`,
          ),
          chain: t(
            `To evaluate $${expr}$ at a number, first find $x^{${n}}$ and then apply $${outerName}$ to it: the last step applies a function to the inner function $x^{${n}}$.`,
            `在某个数处计算 $${expr}$，要先求 $x^{${n}}$，再对它作用 $${outerName}$：最后一步是把函数作用于内层函数 $x^{${n}}$。`,
          ),
          basic: t(
            `To evaluate $${expr}$ at a number, find $${u}$ and then multiply by the constant $${n}$: only a constant multiplies.`,
            `在某个数处计算 $${expr}$，要先求 $${u}$，再乘以常数 $${n}$：乘上去的只是常数。`,
          ),
        };
        const bottom2 = overPower ? String(p2) : `${at2(v)} \\approx ${fmt(evaluate[v]!(2))}`;
        const check: Record<Procedure, Text> = {
          product: t(
            `At $x = 2$: $2^{${n}} = ${p2}$ and $${at2(u)} \\approx ${fmt(U2)}$, and the last step multiplies them, $${p2} \\times ${fp(U2)}$.`,
            `在 $x = 2$ 处：$2^{${n}} = ${p2}$，$${at2(u)} \\approx ${fmt(U2)}$，最后一步把它们相乘：$${p2} \\times ${fp(U2)}$。`,
          ),
          quotient: t(
            `At $x = 2$: the top is $${at2(u)} \\approx ${fmt(U2)}$ and the bottom is $${bottom2}$, and the last step divides one by the other.`,
            `在 $x = 2$ 处：分子是 $${at2(u)} \\approx ${fmt(U2)}$，分母是 $${bottom2}$，最后一步是相除。`,
          ),
          chain: t(
            `At $x = 2$: first $2^{${n}} = ${p2}$, then $${outer2}$; the last step applies $${outerName}$ to $${p2}$.`,
            `在 $x = 2$ 处：先算 $2^{${n}} = ${p2}$，再算 $${outer2}$；最后一步是对 $${p2}$ 作用 $${outerName}$。`,
          ),
          basic: t(
            `At $x = 2$: $${at2(u)} \\approx ${fmt(U2)}$, and the last step multiplies it by $${n}$.`,
            `在 $x = 2$ 处：$${at2(u)} \\approx ${fmt(U2)}$，最后一步把它乘以 $${n}$。`,
          ),
        };
        const lastName: Record<Procedure, readonly [string, string]> = {
          product: ["a product of two functions of $x$", "两个关于 $x$ 的函数之积"],
          quotient: ["a quotient of two functions of $x$", "两个关于 $x$ 的函数之商"],
          chain: [`applying $${outerName}$ to $x^{${n}}$`, `对 $x^{${n}}$ 作用 $${outerName}$`],
          basic: [`multiplying by the constant $${n}$`, `乘以常数 $${n}$`],
        };
        const ruleFor: Record<Procedure, readonly [string, string]> = {
          product: ["the product rule is for a product of two functions of $x$", "乘积法则用于两个关于 $x$ 的函数之积"],
          quotient: ["the quotient rule is for a quotient of two functions of $x$", "商法则用于两个关于 $x$ 的函数之商"],
          chain: ["the chain rule is for a function applied to an inner function", "链式法则用于函数作用于内层函数"],
          basic: [
            "the constant multiple rule alone is enough only for a constant times a basic function",
            "只有常数乘以基本函数时，单用常数倍法则才够",
          ],
        };
        const names = ["the product rule", "the quotient rule", "the chain rule", "only the constant multiple rule"];
        const namesZh = ["乘积法则", "商法则", "链式法则", "只需常数倍法则"];
        return reasoned(
          choiceProblem({
            prompt: t(`Which rule is needed first to differentiate $${expr}$?`, `对 $${expr}$ 求导时，首先需要哪条法则？`),
            options,
            correct: index,
            solution: walked(
              [
                [["Find the last operation", "找出最后一步运算"], lastStep[kind]],
                [["Match the rule", "对应法则"], t(`So the rule needed first is ${names[index]}.`, `所以首先需要的是${namesZh[index]}。`)],
              ],
              check[kind],
            ),
          }),
          procedures
            .filter((p) => p !== kind)
            .map((p) => [
              options[procedures.indexOf(p)]!.en,
              `The last step in $${expr}$ is ${lastName[kind][0]}, and ${ruleFor[p][0]}.`,
              `$${expr}$ 的最后一步是${lastName[kind][1]}，而${ruleFor[p][1]}。`,
            ]),
        );
      },
    },
    {
      id: "combining-the-product-and-chain-rules",
      title: t("Combining the product and chain rules", "综合运用乘积法则与链式法则"),
      explanation: t(
        "Apply the outer rule first, using the chain rule for each factor that needs it:\n\n$$\\frac{d}{dx}\\left(x^{2}e^{3x}\\right) = 2xe^{3x} + x^{2} \\cdot 3e^{3x},$$\n\nwhich is $5e^{3} \\approx 100.43$ at $x = 1$.\n\nCheck: $\\frac{1.01^{2}e^{3.03} - e^{3}}{0.01} \\approx 102.77$ and $\\frac{0.99^{2}e^{2.97} - e^{3}}{-0.01} \\approx 98.15$ lie on either side of it.\n\n> **Watch out.** The product rule gives two terms, $u'v + uv'$, and the chain rule works inside $v'$: the derivative of $e^{3x}$ is $3e^{3x}$, not $e^{3x}$. Multiplying the two derivatives, $2x \\cdot 3e^{3x}$, is not the product rule.",
        "先用最外层的法则，再对需要的因式使用链式法则：\n\n$$\\frac{d}{dx}\\left(x^{2}e^{3x}\\right) = 2xe^{3x} + x^{2} \\cdot 3e^{3x},$$\n\n在 $x = 1$ 处等于 $5e^{3} \\approx 100.43$。\n\n检验：$\\frac{1.01^{2}e^{3.03} - e^{3}}{0.01} \\approx 102.77$ 与 $\\frac{0.99^{2}e^{2.97} - e^{3}}{-0.01} \\approx 98.15$ 位于它的两侧。\n\n> **注意。** 乘积法则给出两项 $u'v + uv'$，链式法则在 $v'$ 里起作用：$e^{3x}$ 的导数是 $3e^{3x}$，不是 $e^{3x}$。把两个导数相乘，即 $2x \\cdot 3e^{3x}$，不是乘积法则。",
      ),
      generate(rng) {
        const n = rng.int(1, 4);
        const k = rng.pick([2, 3, 4, 5, -1, -2, -3]);
        const kind = rng.int(0, 2);
        const kx = poly([k, "x"]);
        const [g, dg] =
          kind === 0
            ? [`e^{${kx}}`, [k, `e^{${kx}}`] as const]
            : kind === 1
              ? [`\\sin(${kx})`, [k, `\\cos(${kx})`] as const]
              : [`\\cos(${kx})`, [-k, `\\sin(${kx})`] as const];
        const G = kind === 0 ? Math.exp : kind === 1 ? Math.sin : Math.cos;
        const D = kind === 0 ? Math.exp : kind === 1 ? Math.cos : Math.sin;
        const f = `${power(n)}${g}`;
        const first = poly([n, `${power(n - 1)}${g}`]);
        const second = poly([dg[0], `${power(n)}${dg[1]}`]);
        const answer = sumLatex([first, second]);
        const flip = (x: string) => (x.startsWith("-") ? x.slice(1) : `-${x}`);
        const latex1 =
          kind === 0
            ? poly([n + k, `e^{${k}}`])
            : kind === 1
              ? sumLatex([poly([n, `\\sin ${k}`]), poly([k, `\\cos ${k}`])])
              : sumLatex([poly([n, `\\cos ${k}`]), poly([-k, `\\sin ${k}`])]);
        const value1 = n * G(k) + dg[0] * D(k);
        return functionWith(
          {
            prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
            answer,
            prefix: "f'(x) =",
            solution: walked(
              [
                [
                  ["Choose the factors", "确定因式"],
                  t("The last operation is a product, of", "最后一步运算是乘积，两个因式是"),
                  [`u = ${power(n)}, \\quad v = ${g}`],
                ],
                [
                  ["Differentiate each factor", "对每个因式求导"],
                  t(
                    `The power rule gives $u'$, and the chain rule gives $v'$ with the factor $${k}$ from $${kx}$:`,
                    `由幂法则得 $u'$，由链式法则得 $v'$，其中因子 $${k}$ 来自 $${kx}$：`,
                  ),
                  [`u' = ${poly([n, power(n - 1)]) || "1"}, \\quad v' = ${poly(dg)}`],
                ],
                [["Use the product rule", "用乘积法则"], t("Add $u'v$ and $uv'$:", "把 $u'v$ 与 $uv'$ 相加："), [`f'(x) = ${answer}`]],
              ],
              quotients(
                (x) => x ** n * G(k * x),
                1,
                [latex1, value1],
                "f",
                "x",
                t(`At $x = 1$ the answer gives $f'(1) = ${latex1}$.`, `在 $x = 1$ 处，答案给出 $f'(1) = ${latex1}$。`),
              ),
            ),
          },
          [
            say(
              sumLatex([first, poly([dg[0] / k, `${power(n)}${dg[1]}`])]),
              `This leaves out the factor $${k}$ that the chain rule gives for $${g}$.`,
              `这漏掉了链式法则对 $${g}$ 给出的因子 $${k}$。`,
            ),
            say(
              poly([n * dg[0], `${power(n - 1)}${dg[1]}`]),
              "This multiplies the two derivatives. The product rule has two terms, $u'v + uv'$.",
              "这把两个导数相乘了。乘积法则有两项：$u'v + uv'$。",
            ),
            say(
              sumLatex([first, flip(second)]),
              `The second term has the wrong sign: $v' = ${poly(dg)}$.`,
              `第二项的符号错了：$v' = ${poly(dg)}$。`,
            ),
            say(
              first,
              `This is only $u'v$. The product rule adds $uv' = ${second}$.`,
              `这只有 $u'v$。乘积法则还要加上 $uv' = ${second}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "choosing-the-correct-derivative",
      title: t("Choosing the correct derivative", "选出正确的导数"),
      explanation: t(
        "Common mistakes are forgetting the inner derivative, multiplying derivatives instead of using the product rule, and reversing the order in the quotient rule. Check each step against the rule it uses.\n\nFor example, $(x^{2} + 1)e^{3x}$ has derivative $2xe^{3x} + 3(x^{2} + 1)e^{3x}$, which is $3$ at $x = 0$.\n\nCheck: $\\frac{(0.01^{2} + 1)e^{0.03} - 1}{0.01} \\approx 3.0558$ and $\\frac{(0.01^{2} + 1)e^{-0.03} - 1}{-0.01} \\approx 2.9457$ lie on either side of $3$.\n\n> **Watch out.** A candidate that looks almost right can drop the factor $3$ from $e^{3x}$, or subtract the two terms of the product rule. Evaluating a candidate at a simple point such as $x = 0$ catches both.",
        "常见错误有：漏乘内层函数的导数、把导数直接相乘而不用乘积法则、商法则分子顺序颠倒。逐步对照所用的法则检查。\n\n例如 $(x^{2} + 1)e^{3x}$ 的导数是 $2xe^{3x} + 3(x^{2} + 1)e^{3x}$，在 $x = 0$ 处等于 $3$。\n\n检验：$\\frac{(0.01^{2} + 1)e^{0.03} - 1}{0.01} \\approx 3.0558$ 与 $\\frac{(0.01^{2} + 1)e^{-0.03} - 1}{-0.01} \\approx 2.9457$ 位于 $3$ 的两侧。\n\n> **注意。** 看上去几乎正确的选项，可能漏掉了 $e^{3x}$ 带来的因子 $3$，或者把乘积法则的两项相减。在 $x = 0$ 这样简单的点代入选项，就能发现这两种错误。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3, 4, 5, 6]);
        const n = rng.int(2, 5);
        const c = rng.int(1, 6);
        const f = `\\left(x^{${n}} + ${c}\\right)e^{${k}x}`;
        const correctL = `${poly([n, power(n - 1)])}e^{${k}x} + ${k}\\left(x^{${n}} + ${c}\\right)e^{${k}x}`;
        const correct = `$${correctL}$`;
        const wrong = [
          `$${poly([n, power(n - 1)])}e^{${k}x} + \\left(x^{${n}} + ${c}\\right)e^{${k}x}$`,
          `$${poly([n * k, power(n - 1)])}e^{${k}x}$`,
          `$${poly([n, power(n - 1)])}e^{${k}x} - ${k}\\left(x^{${n}} + ${c}\\right)e^{${k}x}$`,
        ];
        return reasoned(
          oneOf(
            rng,
            t(`Which is the derivative of $${f}$?`, `$${f}$ 的导数是哪一个？`),
            same(correct),
            wrong.map(same),
            walked(
              [
                [
                  ["Differentiate each factor", "对每个因式求导"],
                  t(
                    `With $u = x^{${n}} + ${c}$ and $v = e^{${k}x}$, the chain rule gives $v'$:`,
                    `取 $u = x^{${n}} + ${c}$，$v = e^{${k}x}$，由链式法则得 $v'$：`,
                  ),
                  [`u' = ${poly([n, power(n - 1)])}, \\quad v' = ${k}e^{${k}x}`],
                ],
                [["Use the product rule", "用乘积法则"], t("Add $u'v$ and $uv'$:", "把 $u'v$ 与 $uv'$ 相加："), [`f'(x) = ${correctL}`]],
              ],
              quotients(
                (x) => (x ** n + c) * Math.exp(k * x),
                0,
                k * c,
                "f",
                "x",
                t(
                  `At $x = 0$, $u' = 0$, $u = ${c}$, $v = 1$ and $v' = ${k}$, so the derivative is $0 \\cdot 1 + ${c} \\cdot ${k} = ${k * c}$.`,
                  `在 $x = 0$ 处，$u' = 0$，$u = ${c}$，$v = 1$，$v' = ${k}$，所以导数是 $0 \\cdot 1 + ${c} \\cdot ${k} = ${k * c}$。`,
                ),
              ),
            ),
          ),
          [
            [
              wrong[0]!,
              `The chain rule is missing: the derivative of $e^{${k}x}$ has a factor of $${k}$.`,
              `漏了链式法则：$e^{${k}x}$ 的导数有因子 $${k}$。`,
            ],
            [
              wrong[1]!,
              "This multiplies the two derivatives, but the product rule has two terms.",
              "这里把两个导数相乘了，但乘积法则有两项。",
            ],
            [wrong[2]!, "The product rule adds its two terms, and this subtracts.", "乘积法则是两项相加，而这里相减。"],
          ],
        );
      },
    },
  ],
};

/** calculusIChainRuleTopics are the topics of Calculus I module 5.11. */
export const calculusIChainRuleTopics: readonly TopicDef[] = [
  theChainRuleForDifferentiation,
  theChainRuleWithExponentialFunctions,
  theChainRuleWithLogarithmicFunctions,
  theChainRuleWithTrigonometricFunctions,
  calculatingDerivativesFromDataUsingTheChainRule,
  calculatingDerivativesFromGraphsUsingTheChainRule,
  selectingProceduresForCalculatingDerivatives,
];
