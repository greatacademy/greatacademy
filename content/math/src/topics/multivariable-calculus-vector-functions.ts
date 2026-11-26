import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { intervalLatex, paren, poly, Q, type RealSet } from "@ga/subject-math";
import { multivariableDrawings1 } from "../explanation-drawings-multivariable-1.ts";

import {
  choiceProblem,
  equationProblem,
  explainedChoice,
  expressionProblem,
  intervalProblem,
  numberProblem,
  type PointProblem,
  pointLatex,
  pointProblem,
  say,
  vectorLatex,
  verdictChoice,
  why,
  withMistakes,
} from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { none, walked } from "./calculus-i-differentiation.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Vec3 = readonly [number, number, number];

const dot3 = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const v3L = (v: readonly (number | Q)[]): string => vectorLatex(v);

/** asQ turns a number into a rational number so that values can be compared. */
const asQ = (c: number | Q): Q => (typeof c === "number" ? Q.of(c) : c);

/** distinct drops the mistakes whose value is the answer or repeats an earlier one. */
function distinct<M extends { readonly value: number | Q }>(answer: number | Q, mistakes: readonly M[]): M[] {
  return mistakes.filter((m, i, all) => !asQ(m.value).eq(asQ(answer)) && all.findIndex((x) => asQ(x.value).eq(asQ(m.value))) === i);
}

/** Wrong is a point or vector that a typical mistake gives, with what to say about it in English and Chinese. */
type Wrong = readonly [values: readonly (number | Q)[], en: string, zh: string];

/** located builds a point or vector problem whose wrong responses say what went wrong; repeats and the answer are dropped. */
function located(p: Omit<PointProblem, "wrong">, mistakes: readonly Wrong[]): Problem {
  const write = p.vector ? vectorLatex : pointLatex;
  const seen = new Set([write(p.answer)]);
  const kept = mistakes.filter(([v]) => !seen.has(write(v)) && Boolean(seen.add(write(v))));
  return withMistakes(
    pointProblem({ ...p, wrong: kept.map(([v]) => v) }),
    kept.map(([v, en, zh]) => say(write(v), en, zh)),
  );
}

/** num writes a decimal to two places, without a negative zero. */
const num = (x: number): string => String(Number(x.toFixed(2)) || 0);

/** cubicCurve writes ⟨2at, at², (a/3)t³⟩, the curve whose speed a(t² + 2) makes arc length and curvature exact. */
function cubicCurve(a: number, sign = 1): string {
  const z = a === 3 ? "t^3" : `\\frac{${a}}{3}t^3`;
  return `\\left\\langle ${2 * a}t, ${poly([sign * a, "t^2"])}, ${z} \\right\\rangle`;
}

/** pythagoreanTriples are integer right triangles used to yield nice integer or rational magnitudes. */
const pythagoreanTriples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [9, 12, 15],
  [12, 9, 15],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
];

// ---------------------------------------------------------------------------
// 1.1 Vector-Valued Functions
// ---------------------------------------------------------------------------

/** theDomainOfAVectorValuedFunction finds the domain of a vector-valued function. */
export const theDomainOfAVectorValuedFunction: TopicDef = {
  id: "the-domain-of-a-vector-valued-function",
  title: t("The Domain of a Vector-Valued Function", "向量值函数的定义域"),
  summary: t(
    "The domain of a vector-valued function is the intersection of the domains of its component functions.",
    "向量值函数的定义域是其所有分量函数定义域的交集。",
  ),
  intro: t(
    "For $\\mathbf{r}(t) = \\left\\langle \\sqrt{t}, \\frac{1}{t - 2}, 3t \\right\\rangle$, the first component needs $t \\ge 0$, the second needs $t \\ne 2$, and the third is defined for every $t$. A value of $t$ belongs to the domain only when all three are defined, so the domain is $[0, 2) \\cup (2, \\infty)$.\n\nCheck: at $t = 1$ every component is defined, $\\mathbf{r}(1) = \\langle 1, -1, 3 \\rangle$, while at $t = 2$ the second component divides by zero and at $t = -1$ the first takes the root of a negative number.\n\nIn this lesson we find the domain of a vector-valued function as the set of $t$ where every component is defined.",
    "对 $\\mathbf{r}(t) = \\left\\langle \\sqrt{t}, \\frac{1}{t - 2}, 3t \\right\\rangle$，第一个分量要求 $t \\ge 0$，第二个分量要求 $t \\ne 2$，第三个分量对每个 $t$ 都有定义。只有三个分量都有定义的 $t$ 才属于定义域，所以定义域是 $[0, 2) \\cup (2, \\infty)$。\n\n检验：$t = 1$ 时每个分量都有定义，$\\mathbf{r}(1) = \\langle 1, -1, 3 \\rangle$；而 $t = 2$ 时第二个分量除以零，$t = -1$ 时第一个分量对负数开方。\n\n本课我们把向量值函数的定义域求成使每个分量都有定义的 $t$ 的集合。",
  ),
  prerequisites: ["defining-vector-valued-functions", "describing-sets-using-set-builder-notation"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-the-domain-of-a-vector-valued-function",
      title: t("Finding the domain of a vector-valued function", "求向量值函数的定义域"),
      explanation: t(
        "For a vector-valued function $\\mathbf{r}(t) = \\langle f(t), g(t), h(t) \\rangle$, a value of $t$ is in the domain if and only if each component function $f(t)$, $g(t)$, and $h(t)$ is defined at $t$. Thus, the domain is the intersection:\n\n$$\\operatorname{Dom}(\\mathbf{r}) = \\operatorname{Dom}(f) \\cap \\operatorname{Dom}(g) \\cap \\operatorname{Dom}(h).$$\n\nFor $\\left\\langle \\sqrt{t + 1}, \\sqrt{3 - t} \\right\\rangle$ the first component needs $t \\ge -1$ and the second $t \\le 3$, so the domain is $[-1, 3]$.\n\n> **Watch out.** Take the intersection, not the union: a $t$ at which one component fails is outside the domain, however well the others behave. A square root allows $0$, so its endpoint is included, with a square bracket.",
        "对于向量值函数 $\\mathbf{r}(t) = \\langle f(t), g(t), h(t) \\rangle$，$t$ 属于定义域当且仅当每个分量函数 $f(t)$、$g(t)$ 和 $h(t)$ 在 $t$ 处均有定义。因此其定义域为各分量定义域的交集：\n\n$$\\operatorname{Dom}(\\mathbf{r}) = \\operatorname{Dom}(f) \\cap \\operatorname{Dom}(g) \\cap \\operatorname{Dom}(h)$$\n\n对 $\\left\\langle \\sqrt{t + 1}, \\sqrt{3 - t} \\right\\rangle$，第一个分量要求 $t \\ge -1$，第二个要求 $t \\le 3$，所以定义域是 $[-1, 3]$。\n\n> **注意。** 要取交集而不是并集：只要有一个分量在 $t$ 处没有定义，这个 $t$ 就不在定义域中，不论其他分量如何。平方根允许 $0$，所以它的端点要包含在内，用方括号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-8, -1);
        const b = rng.int(1, 8);
        const c = rng.pick([rng.int(b + 1, b + 5), rng.int(a - 5, a - 1)]);
        const closed = (lo: number, loClosed: boolean, hi: number | null, hiClosed: boolean): RealSet => [
          hi === null ? { lo: Q.of(lo), loClosed, hiClosed } : { lo: Q.of(lo), hi: Q.of(hi), loClosed, hiClosed },
        ];
        const set = closed(a, true, b, true);
        const p1 = poly([1, "t"], [-a, ""]);
        const p2 = poly([-1, "t"], [b, ""]);
        const p3 = poly([1, "t"], [-c, ""]);
        const mistakes = [
          [
            closed(a, false, b, false),
            `Both square roots are defined where the inside is $0$, so the endpoints $${a}$ and $${b}$ belong to the domain.`,
            `两个平方根在被开方数为 $0$ 时都有定义，所以端点 $${a}$ 和 $${b}$ 属于定义域。`,
          ],
          [
            closed(a, true, b, false),
            `At $t = ${b}$ the second component is $\\sqrt{0} = 0$, which is defined, so $${b}$ belongs to the domain.`,
            `$t = ${b}$ 时第二个分量是 $\\sqrt{0} = 0$，有定义，所以 $${b}$ 属于定义域。`,
          ],
          [
            closed(a, false, b, true),
            `At $t = ${a}$ the first component is $\\sqrt{0} = 0$, which is defined, so $${a}$ belongs to the domain.`,
            `$t = ${a}$ 时第一个分量是 $\\sqrt{0} = 0$，有定义，所以 $${a}$ 属于定义域。`,
          ],
          [
            closed(a, true, null, false),
            `The second component limits $t$ as well: $\\sqrt{${p2}}$ needs $${p2} \\ge 0$.`,
            `第二个分量也限制 $t$：$\\sqrt{${p2}}$ 要求 $${p2} \\ge 0$。`,
          ],
        ] as const;
        return withMistakes(
          intervalProblem({
            prompt: t(
              `Find the domain of the vector-valued function $\\mathbf{r}(t) = \\left\\langle \\sqrt{${p1}}, \\sqrt{${p2}}, \\frac{1}{${p3}} \\right\\rangle$ in interval notation.`,
              `用区间记号求向量值函数 $\\mathbf{r}(t) = \\left\\langle \\sqrt{${p1}}, \\sqrt{${p2}}, \\frac{1}{${p3}} \\right\\rangle$ 的定义域。`,
            ),
            set,
            form: "interval",
            wrong: mistakes.map(([s]) => s),
            solution: walked(
              [
                [
                  ["Find what each component needs", "写出每个分量的要求"],
                  t(
                    `$\\sqrt{${p1}}$ needs $${p1} \\ge 0$, that is $t \\ge ${a}$. $\\sqrt{${p2}}$ needs $${p2} \\ge 0$, that is $t \\le ${b}$. $\\frac{1}{${p3}}$ needs $t \\ne ${c}$.`,
                    `$\\sqrt{${p1}}$ 要求 $${p1} \\ge 0$，即 $t \\ge ${a}$。$\\sqrt{${p2}}$ 要求 $${p2} \\ge 0$，即 $t \\le ${b}$。$\\frac{1}{${p3}}$ 要求 $t \\ne ${c}$。`,
                  ),
                ],
                [
                  ["Intersect", "取交集"],
                  t(
                    `The two roots together allow $[${a}, ${b}]$, and $${c}$ lies outside this interval, so the fraction removes nothing from it. The domain is $[${a}, ${b}]$.`,
                    `两个平方根合起来允许 $[${a}, ${b}]$，而 $${c}$ 在这个区间之外，所以分式不会从中去掉任何点。定义域是 $[${a}, ${b}]$。`,
                  ),
                ],
              ],
              t(
                `At $t = ${a}$ the components are $\\sqrt{0}$, $\\sqrt{${b - a}}$ and $\\frac{1}{${a - c}}$, all defined; at $t = ${b}$ they are $\\sqrt{${b - a}}$, $\\sqrt{0}$ and $\\frac{1}{${b - c}}$, all defined. Just beyond either end one root has a negative inside.`,
                `$t = ${a}$ 时各分量为 $\\sqrt{0}$、$\\sqrt{${b - a}}$ 和 $\\frac{1}{${a - c}}$，都有定义；$t = ${b}$ 时为 $\\sqrt{${b - a}}$、$\\sqrt{0}$ 和 $\\frac{1}{${b - c}}$，都有定义。越过任一端点，就有一个平方根的被开方数为负。`,
              ),
            ),
          }),
          mistakes.map(([s, en, zh]) => say(intervalLatex(s), en, zh)),
        );
      },
    },
    {
      id: "a-domain-with-a-logarithm-and-a-hole",
      title: t("A domain with a logarithm and an excluded point", "含对数与挖去点的定义域"),
      explanation: t(
        "The domain of $\\mathbf{r}(t)$ is the set of $t$ where every component is defined. A logarithm $\\ln(t - a)$ needs $t > a$ strictly, a square root $\\sqrt{c - t}$ needs $c - t \\ge 0$, and a quotient $\\frac{1}{t - b}$ removes the single point $t = b$. When the removed point lies inside the interval allowed by the other components, the domain splits into two intervals joined by $\\cup$. For $\\left\\langle \\ln t, \\frac{1}{t - 1}, \\sqrt{4 - t} \\right\\rangle$ the domain is $(0, 1) \\cup (1, 4]$.\n\n> **Watch out.** A logarithm's endpoint is open, because $\\ln 0$ is not defined, while a square root's endpoint is closed, because $\\sqrt{0} = 0$. The removed point is open on both sides: it splits the interval in two.",
        "$\\mathbf{r}(t)$ 的定义域是使每个分量都有定义的 $t$ 的集合。对数 $\\ln(t - a)$ 需要严格的 $t > a$，平方根 $\\sqrt{c - t}$ 需要 $c - t \\ge 0$，商 $\\frac{1}{t - b}$ 去掉单个点 $t = b$。若去掉的点落在其他分量允许的区间内部，定义域就分成用 $\\cup$ 连接的两个区间。对 $\\left\\langle \\ln t, \\frac{1}{t - 1}, \\sqrt{4 - t} \\right\\rangle$，定义域是 $(0, 1) \\cup (1, 4]$。\n\n> **注意。** 对数的端点是开的，因为 $\\ln 0$ 没有定义；平方根的端点是闭的，因为 $\\sqrt{0} = 0$。被去掉的点两侧都是开的：它把区间分成两段。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-6, 2);
        const b = a + rng.int(1, 4);
        const c = b + rng.int(1, 4);
        const iv = (lo: number, loClosed: boolean, hi: number, hiClosed: boolean) => ({
          lo: Q.of(lo),
          hi: Q.of(hi),
          loClosed,
          hiClosed,
        });
        const set: RealSet = [iv(a, false, b, false), iv(b, false, c, true)];
        const mistakes = [
          [
            [iv(a, false, c, true)],
            `The fraction $\\frac{1}{${tMinus(b)}}$ is not defined at $t = ${b}$, which lies inside the interval, so that point must be removed.`,
            `分式 $\\frac{1}{${tMinus(b)}}$ 在 $t = ${b}$ 处没有定义，而这个点在区间内部，所以必须去掉。`,
          ],
          [
            [iv(a, true, b, false), iv(b, false, c, true)],
            `At $t = ${a}$ the logarithm would be $\\ln 0$, which is not defined: its endpoint is open.`,
            `$t = ${a}$ 时对数是 $\\ln 0$，没有定义：它的端点是开的。`,
          ],
          [
            [iv(a, false, b, false), iv(b, false, c, false)],
            `At $t = ${c}$ the square root is $\\sqrt{0} = 0$, which is defined, so $${c}$ belongs to the domain.`,
            `$t = ${c}$ 时平方根是 $\\sqrt{0} = 0$，有定义，所以 $${c}$ 属于定义域。`,
          ],
        ] as const;
        const root = poly([-1, "t"], [c, ""]);
        return withMistakes(
          intervalProblem({
            prompt: t(
              `Find the domain of $\\mathbf{r}(t) = \\left\\langle \\ln(${tMinus(a)}), \\frac{1}{${tMinus(b)}}, \\sqrt{${root}} \\right\\rangle$ in interval notation.`,
              `用区间记号求 $\\mathbf{r}(t) = \\left\\langle \\ln(${tMinus(a)}), \\frac{1}{${tMinus(b)}}, \\sqrt{${root}} \\right\\rangle$ 的定义域。`,
            ),
            set,
            form: "interval",
            wrong: mistakes.map(([s]) => s),
            solution: walked(
              [
                [
                  ["Find what each component needs", "写出每个分量的要求"],
                  t(
                    `The logarithm needs $${tMinus(a)} > 0$, that is $t > ${a}$. The fraction needs $t \\ne ${b}$. The square root needs $${root} \\ge 0$, that is $t \\le ${c}$.`,
                    `对数要求 $${tMinus(a)} > 0$，即 $t > ${a}$。分式要求 $t \\ne ${b}$。平方根要求 $${root} \\ge 0$，即 $t \\le ${c}$。`,
                  ),
                ],
                [
                  ["Intersect", "取交集"],
                  t(
                    `The logarithm and the root together allow $(${a}, ${c}]$. The point $${b}$ lies inside it and must be removed, which splits it: the domain is $(${a}, ${b}) \\cup (${b}, ${c}]$.`,
                    `对数和平方根合起来允许 $(${a}, ${c}]$。点 $${b}$ 在其内部，必须去掉，这把区间分成两段：定义域是 $(${a}, ${b}) \\cup (${b}, ${c}]$。`,
                  ),
                ],
              ],
              t(
                `At $t = ${c}$ the components are $\\ln ${c - a}$, $\\frac{1}{${c - b}}$ and $\\sqrt{0}$, all defined. At $t = ${b}$ the fraction divides by zero, and at $t = ${a}$ the logarithm is $\\ln 0$.`,
                `$t = ${c}$ 时各分量为 $\\ln ${c - a}$、$\\frac{1}{${c - b}}$ 和 $\\sqrt{0}$，都有定义。$t = ${b}$ 时分式除以零，$t = ${a}$ 时对数是 $\\ln 0$。`,
              ),
            ),
          }),
          mistakes.map(([s, en, zh]) => say(intervalLatex(s), en, zh)),
        );
      },
    },
  ],
};

/** tMinus writes t − a, or t + |a| when a is negative. */
const tMinus = (a: number) => poly([1, "t"], [-a, ""]);

/** limitsOfVectorValuedFunctions takes limits of vector-valued functions component by component. */
export const limitsOfVectorValuedFunctions: TopicDef = {
  id: "limits-of-vector-valued-functions",
  title: t("Limits of Vector-Valued Functions", "向量值函数的极限"),
  summary: t(
    "The limit of a vector-valued function is the vector of the limits of its components, and it exists only when every component has a limit.",
    "向量值函数的极限是其各分量极限组成的向量；只有每个分量都有极限时，它的极限才存在。",
  ),
  intro: t(
    "To find $\\lim_{t \\to 2} \\left\\langle t^2, \\frac{t^2 - 4}{t - 2}, 5 \\right\\rangle$, take the limit of each component: $t^2 \\to 4$; the middle component equals $t + 2$ for $t \\ne 2$, so it tends to $4$; and the constant stays $5$. The limit is $\\langle 4, 4, 5 \\rangle$.\n\nCheck: at $t = 2.01$ the vector is $\\langle 4.0401, 4.01, 5 \\rangle$, already close to $\\langle 4, 4, 5 \\rangle$.\n\nIn this lesson we take limits of vector-valued functions one component at a time, and recognize when a single component stops the limit from existing.",
    "求 $\\lim_{t \\to 2} \\left\\langle t^2, \\frac{t^2 - 4}{t - 2}, 5 \\right\\rangle$ 时，对每个分量求极限：$t^2 \\to 4$；中间的分量在 $t \\ne 2$ 时等于 $t + 2$，所以趋于 $4$；常数保持为 $5$。极限是 $\\langle 4, 4, 5 \\rangle$。\n\n检验：$t = 2.01$ 时向量是 $\\langle 4.0401, 4.01, 5 \\rangle$，已经接近 $\\langle 4, 4, 5 \\rangle$。\n\n本课我们逐个分量求向量值函数的极限，并识别何时一个分量就使极限不存在。",
  ),
  prerequisites: ["the-domain-of-a-vector-valued-function", "special-limits-involving-cosine"],
  encompasses: [{ topic: "defining-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "limits-component-by-component",
      title: t("Limits component by component", "逐个分量求极限"),
      explanation: t(
        "A vector $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$ approaches a vector $\\mathbf{L}$ exactly when each component approaches the matching component of $\\mathbf{L}$, so the limit is taken one component at a time, each with the techniques for ordinary limits:\n\n$$\\lim_{t \\to a} \\mathbf{r}(t) = \\left\\langle \\lim_{t \\to a} x(t), \\lim_{t \\to a} y(t), \\lim_{t \\to a} z(t) \\right\\rangle.$$\n\nFor $\\mathbf{r}(t) = \\left\\langle \\frac{t^{2} - 9}{t - 3}, 2t^{2}, \\sqrt{t + 1} \\right\\rangle$ at $t = 3$, the first component is $\\frac{0}{0}$, but it equals $t + 3$ for $t \\ne 3$, so its limit is $6$; the others are continuous and give $18$ and $2$. The limit is $\\langle 6, 18, 2 \\rangle$.\n\n> **Watch out.** A component that is $\\frac{0}{0}$ at the point has a limit that is neither $0$ nor missing: cancel the common factor first, then substitute. Keep each limit in the slot of its own component.",
        "向量 $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$ 趋于向量 $\\mathbf{L}$，恰好是每个分量都趋于 $\\mathbf{L}$ 的对应分量，所以极限要逐个分量求，每个分量都用普通极限的方法：\n\n$$\\lim_{t \\to a} \\mathbf{r}(t) = \\left\\langle \\lim_{t \\to a} x(t), \\lim_{t \\to a} y(t), \\lim_{t \\to a} z(t) \\right\\rangle$$\n\n对 $\\mathbf{r}(t) = \\left\\langle \\frac{t^{2} - 9}{t - 3}, 2t^{2}, \\sqrt{t + 1} \\right\\rangle$ 在 $t = 3$ 处，第一个分量是 $\\frac{0}{0}$ 型，但当 $t \\ne 3$ 时它等于 $t + 3$，所以极限是 $6$；其余分量连续，分别给出 $18$ 和 $2$。极限是 $\\langle 6, 18, 2 \\rangle$。\n\n> **注意。** 在该点为 $\\frac{0}{0}$ 型的分量，其极限既不是 $0$，也不是不存在：先约去公因式，再代入。每个极限要放在它自己分量的位置上。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const r = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== a));
        const c = rng.nonZero(-3, 3);
        const d = rng.int(-6, 6);
        const root = rng.int(1, 4);
        const m = root * root - a;
        const top = poly([1, "t^{2}"], [-(a + r), "t"], [a * r, ""]);
        const second = poly([c, "t^{2}"], [d, ""]);
        const inside = poly([1, "t"], [m, ""]);
        const y = c * a * a + d;
        const answer = [a - r, y, root];
        const r3 = `\\left\\langle \\frac{${top}}{${tMinus(a)}}, ${second}, \\sqrt{${inside}} \\right\\rangle`;
        return located(
          {
            prompt: t(
              `Let $\\mathbf{r}(t) = ${r3}$. Find $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$. Enter the vector as $\\langle a, b, c \\rangle$.`,
              `设 $\\mathbf{r}(t) = ${r3}$。求 $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$。按 $\\langle a, b, c \\rangle$ 的形式输入向量。`,
            ),
            answer,
            vector: true,
            solution: walked(
              [
                [
                  ["Cancel the common factor", "约去公因式"],
                  t(
                    `The first component is $\\frac{0}{0}$ at $t = ${a}$. Factoring the top gives $\\frac{(${tMinus(a)})(${tMinus(r)})}{${tMinus(a)}} = ${tMinus(r)}$ for $t \\ne ${a}$, which tends to $${a} - ${paren(r)} = ${a - r}$.`,
                    `第一个分量在 $t = ${a}$ 处是 $\\frac{0}{0}$ 型。分子因式分解得 $\\frac{(${tMinus(a)})(${tMinus(r)})}{${tMinus(a)}} = ${tMinus(r)}$（$t \\ne ${a}$），它趋于 $${a} - ${paren(r)} = ${a - r}$。`,
                  ),
                ],
                [
                  ["Substitute into the continuous components", "代入连续的分量"],
                  t(
                    `The polynomial gives $${paren(c)} \\cdot ${paren(a)}^{2} + ${paren(d)} = ${y}$, and the root gives $\\sqrt{${a} + ${paren(m)}} = \\sqrt{${root * root}} = ${root}$.`,
                    `多项式给出 $${paren(c)} \\cdot ${paren(a)}^{2} + ${paren(d)} = ${y}$，平方根给出 $\\sqrt{${a} + ${paren(m)}} = \\sqrt{${root * root}} = ${root}$。`,
                  ),
                ],
                [["Collect the limits", "组成向量"], t(`The limit is $${vectorLatex(answer)}$.`, `极限是 $${vectorLatex(answer)}$。`)],
              ],
              t(
                `Multiplying back, $(${tMinus(a)})(${tMinus(r)}) = ${top}$, the numerator, so the cancellation is right.`,
                `乘回去，$(${tMinus(a)})(${tMinus(r)}) = ${top}$，正是分子，所以约分是对的。`,
              ),
            ),
          },
          [
            [
              [a + r, y, root],
              "The first entry has the wrong sign inside: after cancelling, substitute into the factor that is left, minding its sign.",
              "第一个分量的符号错了：约分后，代入剩下的那个因式，注意它的符号。",
            ],
            [
              [0, y, root],
              "Substituting directly gives $\\frac{0}{0}$, which is not $0$: cancel the common factor first.",
              "直接代入得到 $\\frac{0}{0}$，它不是 $0$：先约去公因式。",
            ],
            [
              [a - r, y, root * root],
              `The third component is a square root: take the root of $${root * root}$.`,
              `第三个分量是平方根：要对 $${root * root}$ 开方。`,
            ],
            [
              [root, y, a - r],
              "The first and third entries are swapped: keep each limit in its own component's place.",
              "第一和第三个分量互换了：每个极限要放在它自己分量的位置上。",
            ],
          ],
        );
      },
    },
    {
      id: "trigonometric-components",
      title: t("Components with special limits", "含特殊极限的分量"),
      explanation: t(
        "A component that is $\\frac{0}{0}$ at the point may need a special limit rather than factoring. At $t = 0$, $\\frac{\\sin kt}{t} = k \\cdot \\frac{\\sin kt}{kt} \\to k$ and $\\frac{1 - \\cos t}{t} \\to 0$. So\n\n$$\\lim_{t \\to 0} \\left\\langle \\frac{\\sin 3t}{t}, \\frac{1 - \\cos t}{t}, 5\\cos t \\right\\rangle = \\langle 3, 0, 5 \\rangle.$$\n\n> **Watch out.** $\\frac{\\sin u}{u} \\to 1$ needs the same $u$ on top and below. In $\\frac{\\sin 3t}{t}$ the angle is $3t$ but the denominator is $t$, so the limit is $3$, not $1$. And $\\frac{1 - \\cos t}{t}$ tends to $0$, not $1$.",
        "在该点为 $\\frac{0}{0}$ 型的分量，可能需要用特殊极限而不是因式分解。在 $t = 0$ 处，$\\frac{\\sin kt}{t} = k \\cdot \\frac{\\sin kt}{kt} \\to k$，$\\frac{1 - \\cos t}{t} \\to 0$。所以\n\n$$\\lim_{t \\to 0} \\left\\langle \\frac{\\sin 3t}{t}, \\frac{1 - \\cos t}{t}, 5\\cos t \\right\\rangle = \\langle 3, 0, 5 \\rangle$$\n\n> **注意。** $\\frac{\\sin u}{u} \\to 1$ 要求分子分母是同一个 $u$。在 $\\frac{\\sin 3t}{t}$ 中，角是 $3t$，分母却是 $t$，所以极限是 $3$ 而不是 $1$。而 $\\frac{1 - \\cos t}{t}$ 趋于 $0$，不是 $1$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const m = rng.nonZero(-6, 6);
        const order = rng.shuffle([0, 1, 2]);
        const kt = k < 0 ? `(${k}t)` : `${k}t`;
        const parts = [`\\frac{\\sin ${kt}}{t}`, `\\frac{1 - \\cos t}{t}`, `${m === 1 ? "" : m === -1 ? "-" : m}\\cos t`];
        const values = [k, 0, m];
        const answer = order.map((i) => values[i]!);
        const with_ = (v: readonly (number | Q)[]) => order.map((i) => v[i]!);
        const r3 = `\\left\\langle ${order.map((i) => parts[i]).join(", ")} \\right\\rangle`;
        const near = num(Math.sin(0.01 * k) / 0.01);
        return located(
          {
            prompt: t(
              `Let $\\mathbf{r}(t) = ${r3}$. Find $\\lim\\limits_{t \\to 0} \\mathbf{r}(t)$. Enter the vector as $\\langle a, b, c \\rangle$.`,
              `设 $\\mathbf{r}(t) = ${r3}$。求 $\\lim\\limits_{t \\to 0} \\mathbf{r}(t)$。按 $\\langle a, b, c \\rangle$ 的形式输入向量。`,
            ),
            answer,
            vector: true,
            solution: walked(
              [
                [
                  ["Match the sine to its angle", "让正弦与它的角相配"],
                  t(
                    `$${parts[0]} = ${k} \\cdot \\frac{\\sin ${kt}}{${k}t} \\to ${k} \\cdot 1 = ${k}$, since $\\frac{\\sin u}{u} \\to 1$ as $u \\to 0$.`,
                    `$${parts[0]} = ${k} \\cdot \\frac{\\sin ${kt}}{${k}t} \\to ${k} \\cdot 1 = ${k}$，因为 $u \\to 0$ 时 $\\frac{\\sin u}{u} \\to 1$。`,
                  ),
                ],
                [
                  ["The other two components", "另外两个分量"],
                  t(
                    `$\\frac{1 - \\cos t}{t} \\to 0$, and $${parts[2]} \\to ${paren(m)} \\cdot \\cos 0 = ${m}$, since cosine is continuous.`,
                    `$\\frac{1 - \\cos t}{t} \\to 0$，且 $${parts[2]} \\to ${paren(m)} \\cdot \\cos 0 = ${m}$，因为余弦函数连续。`,
                  ),
                ],
                [["Collect in order", "按顺序组成向量"], t(`The limit is $${vectorLatex(answer)}$.`, `极限是 $${vectorLatex(answer)}$。`)],
              ],
              t(
                `At $t = 0.01$ the sine component is $\\frac{\\sin(${num(0.01 * k)})}{0.01} \\approx ${near}$, already close to $${k}$.`,
                `$t = 0.01$ 时正弦分量为 $\\frac{\\sin(${num(0.01 * k)})}{0.01} \\approx ${near}$，已经接近 $${k}$。`,
              ),
            ),
          },
          [
            [
              with_([1, 0, m]),
              `In $${parts[0]}$ the angle is $${k}t$ but the denominator is $t$, so it is not of the form $\\frac{\\sin u}{u}$ yet; rewrite it with $${k}t$ below first.`,
              `在 $${parts[0]}$ 中，角是 $${k}t$，分母却是 $t$，还不是 $\\frac{\\sin u}{u}$ 的形式；先改写成分母为 $${k}t$。`,
            ],
            [
              with_([k, 1, m]),
              "$\\frac{1 - \\cos t}{t}$ does not tend to $1$; that is the limit of $\\frac{\\sin t}{t}$.",
              "$\\frac{1 - \\cos t}{t}$ 不趋于 $1$；趋于 $1$ 的是 $\\frac{\\sin t}{t}$。",
            ],
            [
              with_([0, 0, m]),
              "The sine component is $\\frac{0}{0}$ at $t = 0$, which is not $0$: use $\\frac{\\sin u}{u} \\to 1$.",
              "正弦分量在 $t = 0$ 处是 $\\frac{0}{0}$ 型，它不是 $0$：用 $\\frac{\\sin u}{u} \\to 1$。",
            ],
            [
              with_([Q.of(1, k), 0, m]),
              "The factor came out upside down: multiplying and dividing by the angle's coefficient leaves that coefficient in front.",
              "提出的因子颠倒了：分子分母同乘角的系数后，留在前面的是这个系数本身。",
            ],
          ],
        );
      },
    },
    {
      id: "when-the-limit-does-not-exist",
      title: t("When the limit does not exist", "极限不存在的情形"),
      explanation: t(
        "Because the limit is taken component by component, $\\lim_{t \\to a} \\mathbf{r}(t)$ exists only if every component has a limit at $a$. One component that grows without bound, such as $\\frac{1}{t - 2}$ at $t = 2$, or that approaches different values from the two sides, such as $\\frac{|t - 2|}{t - 2}$, is enough to make the limit of the whole vector fail to exist, however well the other components behave. A $\\frac{0}{0}$ component, by contrast, often has a limit. So $\\left\\langle t, \\frac{1}{t} \\right\\rangle$ has no limit at $t = 0$, while $\\left\\langle t, \\frac{\\sin t}{t} \\right\\rangle$ tends to $\\langle 0, 1 \\rangle$.\n\n> **Watch out.** Not being defined at the point decides nothing: $\\frac{0}{0}$ there often cancels to a limit. What stops a limit is a component that is unbounded nearby or that jumps between the two sides.",
        "由于极限是逐个分量求的，只有每个分量在 $a$ 处都有极限时，$\\lim_{t \\to a} \\mathbf{r}(t)$ 才存在。只要有一个分量无界增长（例如 $\\frac{1}{t - 2}$ 在 $t = 2$ 处），或者从两侧趋于不同的值（例如 $\\frac{|t - 2|}{t - 2}$），整个向量的极限就不存在，无论其他分量多么正常。相反，$\\frac{0}{0}$ 型的分量往往有极限。所以 $\\left\\langle t, \\frac{1}{t} \\right\\rangle$ 在 $t = 0$ 处没有极限，而 $\\left\\langle t, \\frac{\\sin t}{t} \\right\\rangle$ 趋于 $\\langle 0, 1 \\rangle$。\n\n> **注意。** 在该点没有定义并不能说明什么：那里的 $\\frac{0}{0}$ 往往能约分得到极限。使极限不存在的，是在附近无界或在两侧跳跃的分量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const ta = tMinus(a);
        const c = rng.nonZero(-4, 4);
        /** Part is a component with its limit at t = a written out, or the reason it has none. */
        type Part = { readonly tex: string; readonly why: Text };
        const good: Part[] = [
          {
            tex: `\\frac{t^{2} - ${a * a}}{${ta}}`,
            why: t(
              `$\\frac{t^{2} - ${a * a}}{${ta}} = t + ${a} \\to ${2 * a}$`,
              `$\\frac{t^{2} - ${a * a}}{${ta}} = t + ${a} \\to ${2 * a}$`,
            ),
          },
          {
            tex: `\\frac{\\sin(${ta})}{${ta}}`,
            why: t(`$\\frac{\\sin(${ta})}{${ta}} \\to 1$`, `$\\frac{\\sin(${ta})}{${ta}} \\to 1$`),
          },
          {
            tex: `\\frac{(${ta})^{2}}{${ta}}`,
            why: t(`$\\frac{(${ta})^{2}}{${ta}} = ${ta} \\to 0$`, `$\\frac{(${ta})^{2}}{${ta}} = ${ta} \\to 0$`),
          },
          {
            tex: `\\frac{1}{t + ${a}}`,
            why: t(`$\\frac{1}{t + ${a}} \\to \\frac{1}{${2 * a}}$`, `$\\frac{1}{t + ${a}} \\to \\frac{1}{${2 * a}}$`),
          },
          {
            tex: poly([c, "t^{2}"]),
            why: t(`$${poly([c, "t^{2}"])} \\to ${c * a * a}$`, `$${poly([c, "t^{2}"])} \\to ${c * a * a}$`),
          },
        ];
        const bad: Part[] = [
          {
            tex: `\\frac{${c}}{${ta}}`,
            why: t(`$\\frac{${c}}{${ta}}$ is unbounded`, `$\\frac{${c}}{${ta}}$ 无界`),
          },
          {
            tex: `\\frac{|${ta}|}{${ta}}`,
            why: t(
              `$\\frac{|${ta}|}{${ta}}$ is $-1$ on the left and $1$ on the right`,
              `$\\frac{|${ta}|}{${ta}}$ 在左侧为 $-1$，在右侧为 $1$`,
            ),
          },
          {
            tex: `\\frac{t}{(${ta})^{2}}`,
            why: t(`$\\frac{t}{(${ta})^{2}}$ grows without bound`, `$\\frac{t}{(${ta})^{2}}$ 无界增长`),
          },
        ];
        const broken = rng.bool(0.8) ? rng.int(0, 2) : 3;
        const parts = rng.sample(good, broken === 3 ? 3 : 2);
        if (broken < 3) parts.splice(broken, 0, rng.pick(bad));
        const options = [
          t("The first component", "第一个分量"),
          t("The second component", "第二个分量"),
          t("The third component", "第三个分量"),
          t("None: the limit exists", "没有：极限存在"),
        ];
        const r3 = `\\left\\langle ${parts.map((q) => q.tex).join(", ")} \\right\\rangle`;
        const all = (lang: "en" | "zh-CN") => parts.map((q) => q.why[lang]).join(lang === "en" ? "; " : "；");
        const reasons = options.flatMap((o, i): [string, string, string][] =>
          i === broken
            ? []
            : i < 3
              ? [[o.en, `That component has a limit: ${parts[i]!.why.en}.`, `这个分量有极限：${parts[i]!.why["zh-CN"]}。`]]
              : [
                  [
                    o.en,
                    `One component has no limit at $t = ${a}$, and one is enough to stop the limit of the vector.`,
                    `有一个分量在 $t = ${a}$ 处没有极限，一个就足以使向量的极限不存在。`,
                  ],
                ],
        );
        return reasoned(
          choiceProblem({
            prompt: t(
              `Let $\\mathbf{r}(t) = ${r3}$. Which component keeps $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$ from existing?`,
              `设 $\\mathbf{r}(t) = ${r3}$。哪个分量使 $\\lim\\limits_{t \\to ${a}} \\mathbf{r}(t)$ 不存在？`,
            ),
            options,
            correct: broken,
            solution: walked(
              [
                [["Test each component", "逐个检查分量"], t(`As $t \\to ${a}$: ${all("en")}.`, `当 $t \\to ${a}$ 时：${all("zh-CN")}。`)],
                [
                  ["Decide", "下结论"],
                  broken === 3
                    ? t("Every component has a limit, so the limit of the vector exists.", "每个分量都有极限，所以向量的极限存在。")
                    : t(
                        `The ${["first", "second", "third"][broken]} component has no limit, so the vector has none either.`,
                        `第${["一", "二", "三"][broken]}个分量没有极限，所以向量也没有极限。`,
                      ),
                ],
              ],
              broken === 3
                ? t(
                    `No component is unbounded near $t = ${a}$ or jumps between the two sides, so nothing stands in the way.`,
                    `没有分量在 $t = ${a}$ 附近无界或在两侧跳跃，所以没有任何阻碍。`,
                  )
                : t(
                    `The other two components do have limits, so this one alone is what stands in the way.`,
                    `另外两个分量都有极限，所以阻碍极限存在的只有这一个分量。`,
                  ),
            ),
          }),
          reasons,
        );
      },
    },
  ],
};

/** continuityAndDifferentiabilityOfVectorValuedFunctions explores continuity and differentiability componentwise. */
export const continuityAndDifferentiabilityOfVectorValuedFunctions: TopicDef = {
  id: "continuity-and-differentiability-of-vector-valued-functions",
  title: t("Continuity and Differentiability of Vector-Valued Functions", "向量值函数的连续性与可微性"),
  summary: t(
    "A vector-valued function is continuous or differentiable at a point if and only if each of its component functions is continuous or differentiable at that point.",
    "向量值函数在某点连续或可微，当且仅当其每一个分量函数在该点连续或可微。",
  ),
  intro: t(
    "$\\mathbf{r}(t) = \\langle t^2, |t - 1| \\rangle$ is continuous everywhere, since both components are. But $|t - 1|$ has a corner at $t = 1$: its slope is $-1$ to the left and $1$ to the right. So $\\mathbf{r}$ is not differentiable at $t = 1$, even though $t^2$ is differentiable everywhere.\n\nCheck: the difference quotient of $|t - 1|$ at $t = 1$ is $\\frac{|h|}{h}$, which is $1$ for $h = 0.1$ and $-1$ for $h = -0.1$, so it settles on no single value.\n\nIn this lesson we decide, component by component, where a vector-valued function is continuous or differentiable, and choose values that make it so.",
    "$\\mathbf{r}(t) = \\langle t^2, |t - 1| \\rangle$ 处处连续，因为两个分量都连续。但 $|t - 1|$ 在 $t = 1$ 处有折点：左侧斜率为 $-1$，右侧为 $1$。所以 $\\mathbf{r}$ 在 $t = 1$ 处不可微，尽管 $t^2$ 处处可微。\n\n检验：$|t - 1|$ 在 $t = 1$ 处的差商是 $\\frac{|h|}{h}$，$h = 0.1$ 时为 $1$，$h = -0.1$ 时为 $-1$，不趋于同一个值。\n\n本课我们逐个分量判断向量值函数在何处连续或可微，并选取使它连续或可微的值。",
  ),
  prerequisites: ["defining-vector-valued-functions", "defining-continuity-at-a-point"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "identifying-points-of-discontinuity-or-non-differentiability",
      title: t("Identifying points of non-differentiability", "识别不可微点"),
      explanation: t(
        "A vector-valued function $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$ fails to be differentiable at $t_0$ whenever at least one of its component functions is not differentiable at $t_0$. Common causes include sharp corners (such as $|t - c|$ at $t = c$) or vertical tangents. So $\\langle t^3, |t + 2| \\rangle$ is not differentiable at $t = -2$, where the inside of the absolute value is zero.\n\n> **Watch out.** The corner of $|t - c|$ is where the inside is zero, at $t = c$; for $|t + 2|$ that is $t = -2$, not $t = 2$. And continuity is not enough: $|t - c|$ is continuous at $c$ yet not differentiable there.",
        "当向量值函数 $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$ 的至少一个分量函数在 $t_0$ 处不可微时，该向量值函数在 $t_0$ 处不可微。常见情形包括绝对值折点（如 $|t - c|$ 在 $t = c$ 处）或垂直切线。所以 $\\langle t^3, |t + 2| \\rangle$ 在 $t = -2$ 处不可微，那里绝对值里面为零。\n\n> **注意。** $|t - c|$ 的折点在里面为零处，即 $t = c$；对 $|t + 2|$ 是 $t = -2$，不是 $t = 2$。而且连续还不够：$|t - c|$ 在 $c$ 处连续，却不可微。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.nonZero(-10, 10);
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const inside = tMinus(c);
        const x = poly([a, "t^2"]);
        const z = poly([b, "t"], [1, ""]);
        const off = t(
          `At that value the inside of $|${inside}|$ is not zero, so there is no corner there and every component is differentiable.`,
          `在这个值处 $|${inside}|$ 里面不为零，那里没有折点，每个分量都可微。`,
        );
        return numberProblem({
          prompt: t(
            `Find the value of $t$ at which the vector-valued function $\\mathbf{r}(t) = \\left\\langle ${x}, |${inside}|, ${z} \\right\\rangle$ fails to be differentiable.`,
            `求向量值函数 $\\mathbf{r}(t) = \\left\\langle ${x}, |${inside}|, ${z} \\right\\rangle$ 不可微的 $t$ 值。`,
          ),
          answer: c,
          mistakes: distinct(c, [
            why(
              -c,
              `At $t = ${-c}$ the inside of $|${inside}|$ is $${-2 * c}$, not zero: the corner is where the inside vanishes.`,
              `$t = ${-c}$ 时 $|${inside}|$ 里面是 $${-2 * c}$，不是零：折点在里面为零的地方。`,
            ),
            { value: 0, why: off },
            { value: c + 1, why: off },
            { value: c - 1, why: off },
          ]),
          solution: walked(
            [
              [
                ["Check the polynomial components", "检查多项式分量"],
                t(
                  `$x(t) = ${x}$ and $z(t) = ${z}$ are polynomials, differentiable for every $t$.`,
                  `$x(t) = ${x}$ 和 $z(t) = ${z}$ 是多项式，对每个 $t$ 都可微。`,
                ),
              ],
              [
                ["Find the corner", "找出折点"],
                t(
                  `$y(t) = |${inside}|$ has a corner where $${inside} = 0$, at $t = ${c}$: its slope is $-1$ to the left and $1$ to the right. So $\\mathbf{r}$ fails to be differentiable at $t = ${c}$.`,
                  `$y(t) = |${inside}|$ 在 $${inside} = 0$ 处有折点，即 $t = ${c}$：左侧斜率为 $-1$，右侧为 $1$。所以 $\\mathbf{r}$ 在 $t = ${c}$ 处不可微。`,
                ),
              ],
            ],
            t(
              `The difference quotient of $y$ at $t = ${c}$ is $\\frac{|h|}{h}$: $1$ for $h > 0$ and $-1$ for $h < 0$, so the derivative does not exist there.`,
              `$y$ 在 $t = ${c}$ 处的差商是 $\\frac{|h|}{h}$：$h > 0$ 时为 $1$，$h < 0$ 时为 $-1$，所以那里导数不存在。`,
            ),
          ),
        });
      },
    },
    {
      id: "choosing-a-value-that-makes-a-vector-function-continuous",
      title: t("Choosing a value that makes $\\mathbf{r}$ continuous", "选取使 $\\mathbf{r}$ 连续的值"),
      explanation: t(
        "A vector-valued function is continuous at $t = a$ exactly when each component is continuous there, that is, when $\\lim_{t \\to a}\\mathbf{r}(t) = \\mathbf{r}(a)$ component by component. If one component is $\\frac{t^2 - a^2}{t - a}$ for $t \\ne a$, its limit is found by cancelling: $\\frac{t^2 - a^2}{t - a} = t + a \\to 2a$. Defining that component to be $2a$ at $t = a$ removes the discontinuity. For $\\frac{t^2 - 9}{t - 3}$ at $t = 3$ the value to choose is $6$.\n\n> **Watch out.** The value to choose is the limit, found after cancelling; substituting $t = a$ into the formula gives $\\frac{0}{0}$, which is not a value. Every other component must match its limit too.",
        "向量值函数在 $t = a$ 处连续，当且仅当每个分量在该处连续，即逐分量地 $\\lim_{t \\to a}\\mathbf{r}(t) = \\mathbf{r}(a)$。若某分量在 $t \\ne a$ 时为 $\\frac{t^2 - a^2}{t - a}$，约分可求极限：$\\frac{t^2 - a^2}{t - a} = t + a \\to 2a$。把该分量在 $t = a$ 处定义为 $2a$ 就消除了间断。对 $\\frac{t^2 - 9}{t - 3}$ 在 $t = 3$ 处，应取的值是 $6$。\n\n> **注意。** 应取的值是约分后求得的极限；把 $t = a$ 代入公式得到 $\\frac{0}{0}$，它不是一个值。其他每个分量也必须与各自的极限相符。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        const m = rng.int(1, 3);
        const ans = 2 * a * m;
        const tPlus = poly([1, "t"], [a, ""]);
        const lead = m === 1 ? "" : m;
        const numer = m === 1 ? `t^2 - ${a * a}` : `${m}(t^2 - ${a * a})`;
        return numberProblem({
          prompt: t(
            `$\\mathbf{r}(t) = \\left\\langle \\frac{${numer}}{${tMinus(a)}}, t^2 \\right\\rangle$ for $t \\ne ${a}$, and $\\mathbf{r}(${a}) = \\langle k, ${a * a} \\rangle$. Find $k$ so that $\\mathbf{r}$ is continuous at $t = ${a}$.`,
            `当 $t \\ne ${a}$ 时 $\\mathbf{r}(t) = \\left\\langle \\frac{${numer}}{${tMinus(a)}}, t^2 \\right\\rangle$，且 $\\mathbf{r}(${a}) = \\langle k, ${a * a} \\rangle$。求 $k$ 使 $\\mathbf{r}$ 在 $t = ${a}$ 处连续。`,
          ),
          answer: ans,
          solveFor: "k",
          mistakes: distinct(ans, [
            why(
              0,
              `Substituting $t = ${a}$ gives $\\frac{0}{0}$, which is not $0$: cancel the factor $${tMinus(a)}$ first.`,
              `代入 $t = ${a}$ 得到 $\\frac{0}{0}$，它不是 $0$：先约去因式 $${tMinus(a)}$。`,
            ),
            why(
              a * m,
              `After cancelling, evaluate the whole factor $${tPlus}$ at $t = ${a}$, both of its terms.`,
              `约分后，要把整个因式 $${tPlus}$ 在 $t = ${a}$ 处求值，两项都要算。`,
            ),
            why(
              -ans,
              `The sign is flipped: $t^2 - ${a * a}$ factors as $(${tMinus(a)})(${tPlus})$.`,
              `符号反了：$t^2 - ${a * a}$ 分解为 $(${tMinus(a)})(${tPlus})$。`,
            ),
            why(
              a * a * m,
              `That is the constant $${m === 1 ? "" : `${m} \\cdot `}${a * a}$ from the numerator; the limit comes from the factor left after cancelling.`,
              `这是分子中的常数 $${m === 1 ? "" : `${m} \\cdot `}${a * a}$；极限来自约分后剩下的因式。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Cancel the common factor", "约去公因式"],
                t(
                  `For $t \\ne ${a}$, $\\frac{${numer}}{${tMinus(a)}} = \\frac{${lead}(${tMinus(a)})(${tPlus})}{${tMinus(a)}} = ${lead}(${tPlus})$, which tends to $${m === 1 ? "" : `${m} \\cdot `}${paren(2 * a)} = ${ans}$ as $t \\to ${a}$.`,
                  `当 $t \\ne ${a}$ 时，$\\frac{${numer}}{${tMinus(a)}} = \\frac{${lead}(${tMinus(a)})(${tPlus})}{${tMinus(a)}} = ${lead}(${tPlus})$，当 $t \\to ${a}$ 时趋于 $${m === 1 ? "" : `${m} \\cdot `}${paren(2 * a)} = ${ans}$。`,
                ),
              ],
              [
                ["Match the limit", "与极限相符"],
                t(
                  `The second component already matches, since $t^2 \\to ${a * a}$. Continuity needs the first entry of $\\mathbf{r}(${a})$ to equal its limit, so $k = ${ans}$.`,
                  `第二个分量已经相符，因为 $t^2 \\to ${a * a}$。连续要求 $\\mathbf{r}(${a})$ 的第一个分量等于它的极限，所以 $k = ${ans}$。`,
                ),
              ],
            ],
            t(
              `At $t = ${a} + 0.01$ the first component is $${lead}(${num(2 * a + 0.01)}) = ${num(ans + 0.01 * m)}$, close to $${ans}$.`,
              `$t = ${a} + 0.01$ 时第一个分量为 $${lead}(${num(2 * a + 0.01)}) = ${num(ans + 0.01 * m)}$，接近 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** differentiationRulesForVectorValuedFunctions covers dot and cross product rules. */
export const differentiationRulesForVectorValuedFunctions: TopicDef = {
  id: "differentiation-rules-for-vector-valued-functions",
  title: t("Differentiation Rules for Vector-Valued Functions", "向量值函数的求导法则"),
  summary: t(
    "Vector-valued functions satisfy sum, scalar multiple, dot product, and cross product differentiation rules.",
    "向量值函数满足和、数乘、点积以及叉积的求导法则。",
  ),
  intro: t(
    "For $\\mathbf{u}(t) = \\langle t, 1 \\rangle$ and $\\mathbf{v}(t) = \\langle t, t \\rangle$, the product rule gives $\\frac{d}{dt}(\\mathbf{u} \\cdot \\mathbf{v}) = \\mathbf{u}' \\cdot \\mathbf{v} + \\mathbf{u} \\cdot \\mathbf{v}' = \\langle 1, 0 \\rangle \\cdot \\langle t, t \\rangle + \\langle t, 1 \\rangle \\cdot \\langle 1, 1 \\rangle = t + (t + 1) = 2t + 1$.\n\nCheck: directly, $\\mathbf{u} \\cdot \\mathbf{v} = t^2 + t$, whose derivative is $2t + 1$, the same.\n\nIn this lesson we differentiate dot products, cross products and scalar multiples of vector functions with the product rules.",
    "对 $\\mathbf{u}(t) = \\langle t, 1 \\rangle$ 和 $\\mathbf{v}(t) = \\langle t, t \\rangle$，乘积法则给出 $\\frac{d}{dt}(\\mathbf{u} \\cdot \\mathbf{v}) = \\mathbf{u}' \\cdot \\mathbf{v} + \\mathbf{u} \\cdot \\mathbf{v}' = \\langle 1, 0 \\rangle \\cdot \\langle t, t \\rangle + \\langle t, 1 \\rangle \\cdot \\langle 1, 1 \\rangle = t + (t + 1) = 2t + 1$。\n\n检验：直接算，$\\mathbf{u} \\cdot \\mathbf{v} = t^2 + t$，它的导数是 $2t + 1$，结果相同。\n\n本课我们用乘积法则对向量函数的点积、叉积和数乘求导。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-cross-product-of-two-vectors"],
  encompasses: [{ topic: "differentiating-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "derivative-of-dot-and-cross-products",
      title: t("Derivative of dot and cross products", "点积与叉积的导数"),
      explanation: t(
        "For differentiable vector-valued functions $\\mathbf{u}(t)$ and $\\mathbf{v}(t)$:\n\n1. Product Rule for Dot Product:\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)] = \\mathbf{u}'(t) \\cdot \\mathbf{v}(t) + \\mathbf{u}(t) \\cdot \\mathbf{v}'(t).$$\n\n2. Product Rule for Cross Product:\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\times \\mathbf{v}(t)] = \\mathbf{u}'(t) \\times \\mathbf{v}(t) + \\mathbf{u}(t) \\times \\mathbf{v}'(t).$$\n\nIf at some instant $\\mathbf{u} = \\langle 1, 0, 0 \\rangle$, $\\mathbf{u}' = \\langle 0, 1, 0 \\rangle$, $\\mathbf{v} = \\langle 0, 2, 0 \\rangle$ and $\\mathbf{v}' = \\langle 3, 0, 0 \\rangle$, then $(\\mathbf{u} \\cdot \\mathbf{v})' = 2 + 3 = 5$.\n\n> **Watch out.** Each term differentiates exactly one factor: $\\mathbf{u}' \\cdot \\mathbf{v}'$ is not a term, and the two terms are added. For the cross product keep the order of each term, since $\\mathbf{v} \\times \\mathbf{u}' = -\\mathbf{u}' \\times \\mathbf{v}$.",
        "对于可微向量值函数 $\\mathbf{u}(t)$ 和 $\\mathbf{v}(t)$：\n\n1. 点积乘积法则：\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)] = \\mathbf{u}'(t) \\cdot \\mathbf{v}(t) + \\mathbf{u}(t) \\cdot \\mathbf{v}'(t)$$\n\n2. 叉积乘积法则：\n$$\\frac{d}{dt}[\\mathbf{u}(t) \\times \\mathbf{v}(t)] = \\mathbf{u}'(t) \\times \\mathbf{v}(t) + \\mathbf{u}(t) \\times \\mathbf{v}'(t)$$\n\n若某一时刻 $\\mathbf{u} = \\langle 1, 0, 0 \\rangle$，$\\mathbf{u}' = \\langle 0, 1, 0 \\rangle$，$\\mathbf{v} = \\langle 0, 2, 0 \\rangle$，$\\mathbf{v}' = \\langle 3, 0, 0 \\rangle$，则 $(\\mathbf{u} \\cdot \\mathbf{v})' = 2 + 3 = 5$。\n\n> **注意。** 每一项只对一个因子求导：$\\mathbf{u}' \\cdot \\mathbf{v}'$ 不是其中的项，两项要相加。对叉积，每一项的顺序都要保持，因为 $\\mathbf{v} \\times \\mathbf{u}' = -\\mathbf{u}' \\times \\mathbf{v}$。",
      ),
      generate(rng: Rng): Problem {
        const u: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const up: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const v: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const vp: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const t0 = rng.int(1, 4);
        const d1 = dot3(up, v);
        const d2 = dot3(u, vp);
        const ans = d1 + d2;
        const terms = (p: Vec3, q: Vec3) => `(${p[0]})(${q[0]}) + (${p[1]})(${q[1]}) + (${p[2]})(${q[2]})`;
        return numberProblem({
          prompt: t(
            `Suppose $\\mathbf{u}(${t0}) = ${v3L(u)}$, $\\mathbf{u}'(${t0}) = ${v3L(up)}$, $\\mathbf{v}(${t0}) = ${v3L(v)}$, and $\\mathbf{v}'(${t0}) = ${v3L(vp)}$. Find $\\left.\\frac{d}{dt}\\left[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)\\right]\\right|_{t=${t0}}$.`,
            `已知 $\\mathbf{u}(${t0}) = ${v3L(u)}$、$\\mathbf{u}'(${t0}) = ${v3L(up)}$、$\\mathbf{v}(${t0}) = ${v3L(v)}$、$\\mathbf{v}'(${t0}) = ${v3L(vp)}$。求 $\\left.\\frac{d}{dt}\\left[\\mathbf{u}(t) \\cdot \\mathbf{v}(t)\\right]\\right|_{t=${t0}}$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              dot3(up, vp),
              "That differentiates both factors at once; each term of the product rule differentiates only one of them.",
              "这把两个因子同时求导了；乘积法则的每一项只对其中一个求导。",
            ),
            why(
              dot3(u, v),
              "That is $\\mathbf{u} \\cdot \\mathbf{v}$ itself, not its derivative.",
              "这是 $\\mathbf{u} \\cdot \\mathbf{v}$ 本身，不是它的导数。",
            ),
            why(d1 - d2, "The two terms of the product rule are added, not subtracted.", "乘积法则的两项要相加，不是相减。"),
            why(
              d1,
              "That is only $\\mathbf{u}' \\cdot \\mathbf{v}$; the term $\\mathbf{u} \\cdot \\mathbf{v}'$ is missing.",
              "这只是 $\\mathbf{u}' \\cdot \\mathbf{v}$；缺了 $\\mathbf{u} \\cdot \\mathbf{v}'$ 这一项。",
            ),
            why(
              d2,
              "That is only $\\mathbf{u} \\cdot \\mathbf{v}'$; the term $\\mathbf{u}' \\cdot \\mathbf{v}$ is missing.",
              "这只是 $\\mathbf{u} \\cdot \\mathbf{v}'$；缺了 $\\mathbf{u}' \\cdot \\mathbf{v}$ 这一项。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the product rule", "写出乘积法则"],
                t(
                  "$\\frac{d}{dt}[\\mathbf{u} \\cdot \\mathbf{v}] = \\mathbf{u}' \\cdot \\mathbf{v} + \\mathbf{u} \\cdot \\mathbf{v}'$, each term differentiating one factor.",
                  "$\\frac{d}{dt}[\\mathbf{u} \\cdot \\mathbf{v}] = \\mathbf{u}' \\cdot \\mathbf{v} + \\mathbf{u} \\cdot \\mathbf{v}'$，每一项对一个因子求导。",
                ),
              ],
              [
                ["Compute the two dot products", "计算两个点积"],
                none,
                [
                  `\\mathbf{u}'(${t0}) \\cdot \\mathbf{v}(${t0}) = ${terms(up, v)} = ${d1}`,
                  `\\mathbf{u}(${t0}) \\cdot \\mathbf{v}'(${t0}) = ${terms(u, vp)} = ${d2}`,
                ],
              ],
              [["Add", "相加"], t(`$${d1} + ${paren(d2)} = ${ans}$.`, `$${d1} + ${paren(d2)} = ${ans}$。`)],
            ],
            t(
              `Near $t = ${t0}$, $\\mathbf{u} \\approx \\mathbf{u}(${t0}) + h\\mathbf{u}'(${t0})$ and $\\mathbf{v} \\approx \\mathbf{v}(${t0}) + h\\mathbf{v}'(${t0})$, so $\\mathbf{u} \\cdot \\mathbf{v} \\approx ${dot3(u, v)} + ${paren(ans)}h + ${paren(dot3(up, vp))}h^2$, whose rate of change at $h = 0$ is $${ans}$.`,
              `在 $t = ${t0}$ 附近，$\\mathbf{u} \\approx \\mathbf{u}(${t0}) + h\\mathbf{u}'(${t0})$，$\\mathbf{v} \\approx \\mathbf{v}(${t0}) + h\\mathbf{v}'(${t0})$，所以 $\\mathbf{u} \\cdot \\mathbf{v} \\approx ${dot3(u, v)} + ${paren(ans)}h + ${paren(dot3(up, vp))}h^2$，它在 $h = 0$ 处的变化率是 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-product-rule-for-a-scalar-times-a-vector",
      title: t("The product rule for $f(t)\\mathbf{u}(t)$", "$f(t)\\mathbf{u}(t)$ 的乘积法则"),
      explanation: t(
        "A scalar function times a vector function is differentiated with the ordinary product rule, applied componentwise:\n\n$$\\frac{d}{dt}\\left[f(t)\\mathbf{u}(t)\\right] = f'(t)\\mathbf{u}(t) + f(t)\\mathbf{u}'(t).$$\n\nSo at a single instant only four pieces of data are needed: $f$, $f'$, $\\mathbf{u}$ and $\\mathbf{u}'$ at that instant. With $f = 2$, $f' = 1$, $\\mathbf{u} = \\langle 1, 0, 0 \\rangle$ and $\\mathbf{u}' = \\langle 0, 1, 0 \\rangle$, the derivative is $\\langle 1, 0, 0 \\rangle + \\langle 0, 2, 0 \\rangle = \\langle 1, 2, 0 \\rangle$.\n\n> **Watch out.** Pair each scalar with the right vector: $f'$ multiplies $\\mathbf{u}$, and $f$ multiplies $\\mathbf{u}'$. Both terms are needed; $f'\\mathbf{u}'$ is not part of the derivative.",
        "标量函数乘以向量函数按普通乘积法则逐分量求导：\n\n$$\\frac{d}{dt}\\left[f(t)\\mathbf{u}(t)\\right] = f'(t)\\mathbf{u}(t) + f(t)\\mathbf{u}'(t)$$\n\n所以在某一时刻只需四个数据：该时刻的 $f$、$f'$、$\\mathbf{u}$ 与 $\\mathbf{u}'$。取 $f = 2$，$f' = 1$，$\\mathbf{u} = \\langle 1, 0, 0 \\rangle$，$\\mathbf{u}' = \\langle 0, 1, 0 \\rangle$，导数是 $\\langle 1, 0, 0 \\rangle + \\langle 0, 2, 0 \\rangle = \\langle 1, 2, 0 \\rangle$。\n\n> **注意。** 每个标量要配对正确的向量：$f'$ 乘 $\\mathbf{u}$，$f$ 乘 $\\mathbf{u}'$。两项都需要；$f'\\mathbf{u}'$ 不是导数的一部分。",
      ),
      generate(rng: Rng): Problem {
        const t0 = rng.int(0, 3);
        const f = rng.nonZero(-4, 4);
        const fp = rng.nonZero(-4, 4);
        const u: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.nonZero(-3, 3)];
        const up: Vec3 = [rng.int(-3, 3), rng.nonZero(-3, 3), rng.int(-3, 3)];
        const first = [0, 1, 2].map((i) => fp * u[i]!);
        const second = [0, 1, 2].map((i) => f * up[i]!);
        const ans = [0, 1, 2].map((i) => first[i]! + second[i]!);
        return located(
          {
            prompt: t(
              `$f(${t0}) = ${f}$, $f'(${t0}) = ${fp}$, $\\mathbf{u}(${t0}) = ${v3L(u)}$ and $\\mathbf{u}'(${t0}) = ${v3L(up)}$. Find $\\frac{d}{dt}\\left[f(t)\\mathbf{u}(t)\\right]$ at $t = ${t0}$.`,
              `$f(${t0}) = ${f}$，$f'(${t0}) = ${fp}$，$\\mathbf{u}(${t0}) = ${v3L(u)}$，$\\mathbf{u}'(${t0}) = ${v3L(up)}$。求 $t = ${t0}$ 处的 $\\frac{d}{dt}\\left[f(t)\\mathbf{u}(t)\\right]$。`,
            ),
            answer: ans,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Write the product rule", "写出乘积法则"],
                  t(
                    "$\\frac{d}{dt}[f\\mathbf{u}] = f'\\mathbf{u} + f\\mathbf{u}'$.",
                    "$\\frac{d}{dt}[f\\mathbf{u}] = f'\\mathbf{u} + f\\mathbf{u}'$。",
                  ),
                ],
                [
                  ["Scale each vector", "分别数乘向量"],
                  none,
                  [`f'\\mathbf{u} = ${paren(fp)}${v3L(u)} = ${v3L(first)}`, `f\\mathbf{u}' = ${paren(f)}${v3L(up)} = ${v3L(second)}`],
                ],
                [["Add", "相加"], t(`$${v3L(first)} + ${v3L(second)} = ${v3L(ans)}$.`, `$${v3L(first)} + ${v3L(second)} = ${v3L(ans)}$。`)],
              ],
              t(
                `On the second component alone the ordinary product rule gives $f'u_2 + fu_2' = ${paren(fp)} \\cdot ${paren(u[1])} + ${paren(f)} \\cdot ${paren(up[1])} = ${ans[1]}$, the same entry.`,
                `只看第二个分量，普通乘积法则给出 $f'u_2 + fu_2' = ${paren(fp)} \\cdot ${paren(u[1])} + ${paren(f)} \\cdot ${paren(up[1])} = ${ans[1]}$，是同一个分量。`,
              ),
            ),
          },
          [
            [
              [0, 1, 2].map((i) => fp * up[i]!),
              "That is $f'\\mathbf{u}'$, which differentiates both factors at once; each term differentiates only one.",
              "这是 $f'\\mathbf{u}'$，把两个因子同时求导了；每一项只对一个因子求导。",
            ],
            [
              [0, 1, 2].map((i) => f * u[i]! + fp * up[i]!),
              "The scalars are paired with the wrong vectors: the derivative of $f$ goes with $\\mathbf{u}$ itself.",
              "标量与向量配错了：$f$ 的导数要乘 $\\mathbf{u}$ 本身。",
            ],
            [
              first,
              "That is only the term $f'\\mathbf{u}$; the term $f\\mathbf{u}'$ is missing.",
              "这只是 $f'\\mathbf{u}$ 一项；缺了 $f\\mathbf{u}'$ 这一项。",
            ],
            [
              second,
              "That is only the term $f\\mathbf{u}'$; the term $f'\\mathbf{u}$ is missing.",
              "这只是 $f\\mathbf{u}'$ 一项；缺了 $f'\\mathbf{u}$ 这一项。",
            ],
          ],
        );
      },
    },
  ],
};

/** integrationRulesForVectorValuedFunctions computes definite integrals of vector functions. */
export const integrationRulesForVectorValuedFunctions: TopicDef = {
  id: "integration-rules-for-vector-valued-functions",
  title: t("Integration Rules for Vector-Valued Functions", "向量值函数的积分法则"),
  summary: t(
    "Integrals of vector-valued functions are computed componentwise and satisfy linearity.",
    "向量值函数的积分按分量逐项计算，并满足线性性质。",
  ),
  intro: t(
    "$\\int_0^2 \\langle 2t, 3 \\rangle\\,dt$ is found one component at a time: $\\int_0^2 2t\\,dt = \\left[t^2\\right]_0^2 = 4$ and $\\int_0^2 3\\,dt = 6$, so the integral is the vector $\\langle 4, 6 \\rangle$.\n\nCheck: $\\mathbf{R}(t) = \\langle t^2, 3t \\rangle$ has derivative $\\langle 2t, 3 \\rangle$, and $\\mathbf{R}(2) - \\mathbf{R}(0) = \\langle 4, 6 \\rangle$.\n\nIn this lesson we integrate vector-valued functions component by component and use a starting value to recover a position from its derivative.",
    "$\\int_0^2 \\langle 2t, 3 \\rangle\\,dt$ 逐个分量计算：$\\int_0^2 2t\\,dt = \\left[t^2\\right]_0^2 = 4$，$\\int_0^2 3\\,dt = 6$，所以积分是向量 $\\langle 4, 6 \\rangle$。\n\n检验：$\\mathbf{R}(t) = \\langle t^2, 3t \\rangle$ 的导数是 $\\langle 2t, 3 \\rangle$，且 $\\mathbf{R}(2) - \\mathbf{R}(0) = \\langle 4, 6 \\rangle$。\n\n本课我们逐个分量对向量值函数积分，并利用初值由导数还原位置。",
  ),
  prerequisites: ["integrating-vector-valued-functions"],
  encompasses: [{ topic: "integrating-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-definite-integrals-of-vector-functions",
      title: t("Evaluating definite integrals of vector functions", "计算向量值函数的定积分"),
      explanation: t(
        "Each component is an ordinary function of the parameter, so integrate each one over the interval and collect the results as a vector. The definite integral of a vector-valued function is evaluated component by component:\n\n$$\\int_a^b \\mathbf{r}(t)\\,dt = \\left\\langle \\int_a^b x(t)\\,dt, \\int_a^b y(t)\\,dt, \\int_a^b z(t)\\,dt \\right\\rangle.$$\n\nFor example, $\\int_0^1 \\langle 1, 2t, 3t^2 \\rangle\\,dt = \\langle 1, 1, 1 \\rangle$.\n\n> **Watch out.** The integral of a vector function is a vector: keep one entry per component, in order. Integrating raises the power, $\\int t^2\\,dt = \\frac{t^3}{3}$; evaluating the integrand at the end of the interval is not integrating.",
        "每个分量都是参数的普通函数，所以把每个分量在区间上积分，再把结果组成一个向量。向量值函数的定积分逐个分量分别进行积分计算：\n\n$$\\int_a^b \\mathbf{r}(t)\\,dt = \\left\\langle \\int_a^b x(t)\\,dt, \\int_a^b y(t)\\,dt, \\int_a^b z(t)\\,dt \\right\\rangle$$\n\n例如 $\\int_0^1 \\langle 1, 2t, 3t^2 \\rangle\\,dt = \\langle 1, 1, 1 \\rangle$。\n\n> **注意。** 向量函数的积分是一个向量：每个分量一项，按顺序排列。积分会使次数升高，$\\int t^2\\,dt = \\frac{t^3}{3}$；把被积函数在区间端点处求值并不是积分。",
      ),
      generate(rng: Rng): Problem {
        const aCoeff = rng.pick([2, 4, 6, 8, 10]);
        const bCoeff = rng.pick([3, 6, 9, 12]);
        const cCoeff = rng.int(1, 8);
        const k = rng.int(1, 4);
        const intX = (aCoeff * k * k) / 2;
        const intY = (bCoeff * k * k * k) / 3;
        const intZ = cCoeff * k;
        const answer: Vec3 = [intX, intY, intZ];
        const R = `\\left\\langle ${poly([aCoeff / 2, "t^2"])}, ${poly([bCoeff / 3, "t^3"])}, ${poly([cCoeff, "t"])} \\right\\rangle`;
        return located(
          {
            prompt: t(
              `Evaluate the definite integral $\\int_{0}^{${k}} \\left\\langle ${poly([aCoeff, "t"])}, ${poly([bCoeff, "t^2"])}, ${cCoeff} \\right\\rangle dt$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `计算定积分 $\\int_{0}^{${k}} \\left\\langle ${poly([aCoeff, "t"])}, ${poly([bCoeff, "t^2"])}, ${cCoeff} \\right\\rangle dt$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  [`Integrate each component from $0$ to $${k}$`, `把每个分量从 $0$ 积到 $${k}$`],
                  none,
                  [
                    `\\int_{0}^{${k}} ${poly([aCoeff, "t"])}\\,dt = \\left[ ${poly([aCoeff / 2, "t^2"])} \\right]_{0}^{${k}} = ${intX}`,
                    `\\int_{0}^{${k}} ${poly([bCoeff, "t^2"])}\\,dt = \\left[ ${poly([bCoeff / 3, "t^3"])} \\right]_{0}^{${k}} = ${intY}`,
                    `\\int_{0}^{${k}} ${cCoeff}\\,dt = \\left[ ${poly([cCoeff, "t"])} \\right]_{0}^{${k}} = ${intZ}`,
                  ],
                ],
                [["Collect the components", "组成向量"], t(`The integral is $${v3L(answer)}$.`, `积分是 $${v3L(answer)}$。`)],
              ],
              t(
                `$\\mathbf{R}(t) = ${R}$ has derivative $\\left\\langle ${poly([aCoeff, "t"])}, ${poly([bCoeff, "t^2"])}, ${cCoeff} \\right\\rangle$, the integrand, and $\\mathbf{R}(${k}) - \\mathbf{R}(0) = ${v3L(answer)}$.`,
                `$\\mathbf{R}(t) = ${R}$ 的导数是 $\\left\\langle ${poly([aCoeff, "t"])}, ${poly([bCoeff, "t^2"])}, ${cCoeff} \\right\\rangle$，即被积函数，且 $\\mathbf{R}(${k}) - \\mathbf{R}(0) = ${v3L(answer)}$。`,
              ),
            ),
          },
          [
            [
              [aCoeff * k, bCoeff * k * k, cCoeff],
              `That evaluates the integrand at $t = ${k}$ instead of integrating it.`,
              `这是把被积函数在 $t = ${k}$ 处求值，而不是对它积分。`,
            ],
            [
              [intY, intX, intZ],
              "The first two entries are swapped: keep each integral in its own component's place.",
              "前两个分量互换了：每个积分要放在它自己分量的位置上。",
            ],
            [
              [intX, intY, 0],
              `The integral of the constant $${cCoeff}$ is not $0$: a constant integrates to itself times the length of the interval.`,
              `常数 $${cCoeff}$ 的积分不是 $0$：常数的积分等于它乘以区间长度。`,
            ],
          ],
        );
      },
    },
    {
      id: "recovering-a-position-from-its-derivative-and-a-starting-value",
      title: t(
        "Recovering $\\mathbf{r}(t)$ from $\\mathbf{r}'(t)$ and $\\mathbf{r}(0)$",
        "由 $\\mathbf{r}'(t)$ 与 $\\mathbf{r}(0)$ 还原 $\\mathbf{r}(t)$",
      ),
      explanation: t(
        "Integrating a vector function componentwise leaves one constant per component, which together form a constant vector $\\mathbf{C}$. An initial value fixes it: since $\\mathbf{r}(t) = \\mathbf{r}(0) + \\int_0^t \\mathbf{r}'(u)\\,du$, the position at time $T$ is the starting position plus the definite integral of the derivative from $0$ to $T$. If $\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$ and $\\mathbf{r}(0) = \\langle 3, 0 \\rangle$, then $\\mathbf{r}(t) = \\langle t + 3, t^2 \\rangle$ and $\\mathbf{r}(2) = \\langle 5, 4 \\rangle$.\n\n> **Watch out.** The integral alone is only the change in position; add the starting value $\\mathbf{r}(0)$. And integrate $\\mathbf{r}'$ over $[0, T]$; the velocity at $T$ is not the change in position.",
        "逐分量积分向量函数时，每个分量留下一个常数，合起来是常向量 $\\mathbf{C}$。初值确定它：由于 $\\mathbf{r}(t) = \\mathbf{r}(0) + \\int_0^t \\mathbf{r}'(u)\\,du$，时刻 $T$ 的位置是起始位置加上导数从 $0$ 到 $T$ 的定积分。若 $\\mathbf{r}'(t) = \\langle 1, 2t \\rangle$，$\\mathbf{r}(0) = \\langle 3, 0 \\rangle$，则 $\\mathbf{r}(t) = \\langle t + 3, t^2 \\rangle$，$\\mathbf{r}(2) = \\langle 5, 4 \\rangle$。\n\n> **注意。** 单独的积分只是位置的变化量；还要加上初值 $\\mathbf{r}(0)$。并且要在 $[0, T]$ 上对 $\\mathbf{r}'$ 积分；$T$ 时刻的速度不是位置的变化量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-2, 2);
        const r0: Vec3 = [rng.int(-5, 5), rng.int(-5, 5), rng.int(-5, 5)];
        const T = rng.int(1, 3);
        const change = [a * T, b * T * T, c * T ** 3];
        const ans = [r0[0] + change[0]!, r0[1] + change[1]!, r0[2] + change[2]!];
        const rt = `\\left\\langle ${poly([a, "t"], [r0[0], ""])}, ${poly([b, "t^2"], [r0[1], ""])}, ${poly([c, "t^3"], [r0[2], ""])} \\right\\rangle`;
        const rp = `\\left\\langle ${a}, ${poly([2 * b, "t"])}, ${poly([3 * c, "t^2"])} \\right\\rangle`;
        return located(
          {
            prompt: t(
              `$\\mathbf{r}'(t) = ${rp}$ and $\\mathbf{r}(0) = ${v3L(r0)}$. Find $\\mathbf{r}(${T})$.`,
              `$\\mathbf{r}'(t) = ${rp}$，$\\mathbf{r}(0) = ${v3L(r0)}$。求 $\\mathbf{r}(${T})$。`,
            ),
            answer: ans,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Integrate each component", "逐个分量积分"],
                  t(
                    `An antiderivative of $\\mathbf{r}'$ is $\\left\\langle ${poly([a, "t"])}, ${poly([b, "t^2"])}, ${poly([c, "t^3"])} \\right\\rangle$, so $\\mathbf{r}(t) = \\left\\langle ${poly([a, "t"])}, ${poly([b, "t^2"])}, ${poly([c, "t^3"])} \\right\\rangle + \\mathbf{C}$.`,
                    `$\\mathbf{r}'$ 的一个原函数是 $\\left\\langle ${poly([a, "t"])}, ${poly([b, "t^2"])}, ${poly([c, "t^3"])} \\right\\rangle$，所以 $\\mathbf{r}(t) = \\left\\langle ${poly([a, "t"])}, ${poly([b, "t^2"])}, ${poly([c, "t^3"])} \\right\\rangle + \\mathbf{C}$。`,
                  ),
                ],
                [
                  ["Fix the constant", "确定常向量"],
                  t(
                    `At $t = 0$ the antiderivative is $\\mathbf{0}$, so $\\mathbf{C} = \\mathbf{r}(0) = ${v3L(r0)}$ and $\\mathbf{r}(t) = ${rt}$.`,
                    `$t = 0$ 时原函数为 $\\mathbf{0}$，所以 $\\mathbf{C} = \\mathbf{r}(0) = ${v3L(r0)}$，$\\mathbf{r}(t) = ${rt}$。`,
                  ),
                ],
                [
                  [`Substitute $t = ${T}$`, `代入 $t = ${T}$`],
                  t(
                    `$\\mathbf{r}(${T}) = ${v3L(r0)} + ${v3L(change)} = ${v3L(ans)}$.`,
                    `$\\mathbf{r}(${T}) = ${v3L(r0)} + ${v3L(change)} = ${v3L(ans)}$。`,
                  ),
                ],
              ],
              t(
                `Differentiating $\\mathbf{r}(t) = ${rt}$ gives back $${rp}$, and at $t = 0$ it equals $${v3L(r0)}$.`,
                `对 $\\mathbf{r}(t) = ${rt}$ 求导得回 $${rp}$，且 $t = 0$ 时它等于 $${v3L(r0)}$。`,
              ),
            ),
          },
          [
            [
              change,
              "That is only the change in position; add the starting position $\\mathbf{r}(0)$.",
              "这只是位置的变化量；还要加上起始位置 $\\mathbf{r}(0)$。",
            ],
            [
              [r0[0] + a, r0[1] + 2 * b * T, r0[2] + 3 * c * T * T],
              `That adds $\\mathbf{r}'(${T})$, the velocity at a single instant; integrate $\\mathbf{r}'$ from $0$ to $${T}$ instead.`,
              `这加上的是 $\\mathbf{r}'(${T})$，即某一时刻的速度；应当把 $\\mathbf{r}'$ 从 $0$ 积到 $${T}$。`,
            ],
            [
              [r0[0] + a * T, r0[1] + 2 * b * T * T, r0[2] + 3 * c * T ** 3],
              "When integrating, divide by the new power: the coefficients of the second and third components should shrink.",
              "积分时要除以新的次数：第二、第三个分量的系数应当变小。",
            ],
          ],
        );
      },
    },
  ],
};

/** theArcLengthOfAVectorValuedFunction calculates the arc length of a space curve. */
export const theArcLengthOfAVectorValuedFunction: TopicDef = {
  id: "the-arc-length-of-a-vector-valued-function",
  title: t("The Arc Length of a Vector-Valued Function", "向量值函数的弧长"),
  summary: t(
    "The arc length of a space curve r(t) from t = a to t = b is the integral of speed: L = ∫ ||r'(t)|| dt.",
    "空间曲线 r(t) 从 t = a 到 t = b 的弧长是速率的积分：L = ∫ ||r'(t)|| dt。",
  ),
  intro: t(
    "The helix $\\mathbf{r}(t) = \\langle 3\\cos t, 3\\sin t, 4t \\rangle$ has velocity $\\langle -3\\sin t, 3\\cos t, 4 \\rangle$ and speed $\\sqrt{9\\sin^2 t + 9\\cos^2 t + 16} = 5$ at every moment. Over $0 \\le t \\le 2$ it therefore travels $L = \\int_0^2 5\\,dt = 10$.\n\nCheck: unroll the cylinder of radius $3$ flat. The helix becomes a straight segment that goes $3 \\cdot 2 = 6$ across and $4 \\cdot 2 = 8$ up, and $\\sqrt{6^2 + 8^2} = 10$.\n\nIn this lesson we find the length of a space curve by integrating its speed.",
    "螺旋线 $\\mathbf{r}(t) = \\langle 3\\cos t, 3\\sin t, 4t \\rangle$ 的速度为 $\\langle -3\\sin t, 3\\cos t, 4 \\rangle$，速率时时都是 $\\sqrt{9\\sin^2 t + 9\\cos^2 t + 16} = 5$。所以在 $0 \\le t \\le 2$ 上它走过 $L = \\int_0^2 5\\,dt = 10$。\n\n检验：把半径为 $3$ 的圆柱面展平。螺旋线变成一条线段，横向走 $3 \\cdot 2 = 6$，向上走 $4 \\cdot 2 = 8$，而 $\\sqrt{6^2 + 8^2} = 10$。\n\n本课我们通过对速率积分求空间曲线的长度。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-arc-length-of-a-planar-curve"],
  encompasses: [{ topic: "the-arc-length-of-a-planar-curve", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-arc-length-of-a-space-curve",
      figure: multivariableDrawings1["the-arc-length-of-a-vector-valued-function#computing-arc-length-of-a-space-curve"],
      title: t("Computing the arc length of a space curve", "计算空间曲线的弧长"),
      explanation: t(
        "The speed is the length of the velocity vector, and integrating the speed over the time interval adds up the distance travelled along the curve. For a smooth space curve $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$, the arc length from $t = a$ to $t = b$ is given by:\n\n$$L = \\int_a^b \\|\\mathbf{r}'(t)\\|\\,dt = \\int_a^b \\sqrt{[x'(t)]^2 + [y'(t)]^2 + [z'(t)]^2}\\,dt.$$\n\nFor $\\langle 2\\cos t, 2\\sin t, t \\rangle$ the speed is $\\sqrt{4 + 1} = \\sqrt{5}$, so one full turn, $0 \\le t \\le 2\\pi$, has length $2\\pi\\sqrt{5}$.\n\n> **Watch out.** The speed is the square root of the sum of the squared components of $\\mathbf{r}'$, not the sum of the components. And the speed is the length per unit of time: multiply by the length of the time interval, or integrate.",
        "速率是速度向量的长度，把速率在时间区间上积分，就把沿曲线走过的路程加了起来。对于光滑空间曲线 $\\mathbf{r}(t) = \\langle x(t), y(t), z(t) \\rangle$，从 $t = a$ 到 $t = b$ 的弧长为：\n\n$$L = \\int_a^b \\|\\mathbf{r}'(t)\\|\\,dt = \\int_a^b \\sqrt{[x'(t)]^2 + [y'(t)]^2 + [z'(t)]^2}\\,dt$$\n\n对 $\\langle 2\\cos t, 2\\sin t, t \\rangle$，速率是 $\\sqrt{4 + 1} = \\sqrt{5}$，所以一整圈 $0 \\le t \\le 2\\pi$ 的长度是 $2\\pi\\sqrt{5}$。\n\n> **注意。** 速率是 $\\mathbf{r}'$ 各分量平方和的平方根，不是各分量之和。速率是单位时间走过的长度：要乘以时间区间的长度，或者积分。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const k = rng.int(2, 6);
        const ans = c * k;
        return numberProblem({
          prompt: t(
            `Find the arc length of the circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ for $0 \\le t \\le ${k}$.`,
            `求圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 在 $0 \\le t \\le ${k}$ 上的弧长。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * k,
              "That is only the distance around the cylinder; the climb of the third component adds to the length.",
              "这只是绕圆柱面的距离；第三个分量的上升也计入长度。",
            ),
            why(
              b * k,
              "That is only the climb; the turning of the first two components adds to the length.",
              "这只是上升的高度；前两个分量的转动也计入长度。",
            ),
            why(
              (a + b) * k,
              `The speed is $\\sqrt{${a}^2 + ${b}^2}$, not $${a} + ${b}$: lengths combine like the sides of a right triangle.`,
              `速率是 $\\sqrt{${a}^2 + ${b}^2}$，不是 $${a} + ${b}$：长度像直角三角形的边那样合成。`,
            ),
            why(
              c,
              `$${c}$ is the speed, the length per unit of time; multiply by the $${k}$ units of time.`,
              `$${c}$ 是速率，即单位时间的长度；还要乘以 $${k}$ 个单位时间。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the velocity and the speed", "求速度与速率"],
                t(
                  `$\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$, so $\\|\\mathbf{r}'(t)\\| = \\sqrt{${a * a}(\\sin^2 t + \\cos^2 t) + ${b * b}} = \\sqrt{${c * c}} = ${c}$.`,
                  `$\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$，所以 $\\|\\mathbf{r}'(t)\\| = \\sqrt{${a * a}(\\sin^2 t + \\cos^2 t) + ${b * b}} = \\sqrt{${c * c}} = ${c}$。`,
                ),
              ],
              [
                ["Integrate the speed", "对速率积分"],
                t(
                  `$L = \\int_0^{${k}} ${c}\\,dt = ${c} \\cdot ${k} = ${ans}$.`,
                  `$L = \\int_0^{${k}} ${c}\\,dt = ${c} \\cdot ${k} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `Unrolled flat, the cylinder of radius $${a}$ turns the helix into a straight segment going $${a * k}$ across and $${b * k}$ up, of length $\\sqrt{${a * k}^2 + ${b * k}^2} = ${ans}$.`,
              `把半径为 $${a}$ 的圆柱面展平，螺旋线变成横向 $${a * k}$、向上 $${b * k}$ 的线段，长度为 $\\sqrt{${a * k}^2 + ${b * k}^2} = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "arc-length-when-the-speed-is-a-perfect-square",
      figure: multivariableDrawings1["the-arc-length-of-a-vector-valued-function#arc-length-when-the-speed-is-a-perfect-square"],
      title: t("Arc length when the speed is a perfect square", "速率为完全平方时的弧长"),
      explanation: t(
        "Arc length $L = \\int_a^b \\|\\mathbf{r}'(t)\\|\\,dt$ is usually hard because of the square root, but some curves make it a perfect square. For $\\mathbf{r}(t) = \\langle 2at, at^2, \\frac{a}{3}t^3 \\rangle$ with $a > 0$,\n\n$$\\|\\mathbf{r}'(t)\\| = a\\sqrt{4 + 4t^2 + t^4} = a(t^2 + 2),$$\n\nso $L = a\\left[\\frac{t^3}{3} + 2t\\right]_{t_0}^{t_1}$. With $a = 5$ on $0 \\le t \\le 1$ this is $5\\left(\\frac{1}{3} + 2\\right) = \\frac{35}{3}$.\n\n> **Watch out.** The factor $a$ comes out of the square root and stays in front of the integral. The integrand is the speed $a(t^2 + 2)$, so its antiderivative has both terms $\\frac{t^3}{3}$ and $2t$; the change in speed is not the length.",
        "弧长 $L = \\int_a^b \\|\\mathbf{r}'(t)\\|\\,dt$ 通常因平方根而困难，但有些曲线使它成为完全平方。对 $\\mathbf{r}(t) = \\langle 2at, at^2, \\frac{a}{3}t^3 \\rangle$（$a > 0$），\n\n$$\\|\\mathbf{r}'(t)\\| = a\\sqrt{4 + 4t^2 + t^4} = a(t^2 + 2),$$\n\n所以 $L = a\\left[\\frac{t^3}{3} + 2t\\right]_{t_0}^{t_1}$。取 $a = 5$，在 $0 \\le t \\le 1$ 上为 $5\\left(\\frac{1}{3} + 2\\right) = \\frac{35}{3}$。\n\n> **注意。** 因子 $a$ 从平方根里提出后留在积分前面。被积函数是速率 $a(t^2 + 2)$，所以原函数有 $\\frac{t^3}{3}$ 和 $2t$ 两项；速率的变化量不是长度。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 3);
        const t0 = rng.int(0, 2);
        const t1 = t0 + rng.int(1, 3);
        const F = (x: number) => Q.of(x ** 3, 3).add(Q.of(2 * x));
        const ans = F(t1).sub(F(t0)).mul(Q.of(a));
        const lead = a === 1 ? "" : a;
        const d1 = t1 - t0;
        const d2 = t1 * t1 - t0 * t0;
        const d3 = t1 ** 3 - t0 ** 3;
        const chord = a * Math.sqrt(4 * d1 * d1 + d2 * d2 + (d3 * d3) / 9);
        return numberProblem({
          prompt: t(
            `Find the arc length of $\\mathbf{r}(t) = ${cubicCurve(a)}$ for $${t0} \\le t \\le ${t1}$.`,
            `求 $\\mathbf{r}(t) = ${cubicCurve(a)}$ 在 $${t0} \\le t \\le ${t1}$ 上的弧长。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              F(t1).sub(F(t0)),
              `The factor $${a}$ from the speed $${lead}(t^2 + 2)$ is missing.`,
              `缺了速率 $${lead}(t^2 + 2)$ 中的因子 $${a}$。`,
            ),
            why(
              Q.of(a * d3, 3),
              "That integrates only $t^2$; the speed also has the constant term $2$, whose integral is $2t$.",
              "这只积分了 $t^2$；速率还有常数项 $2$，它的积分是 $2t$。",
            ),
            why(
              Q.of(a * d2),
              "That is the change in speed between the endpoints; the length is the integral of the speed.",
              "这是两端速率之差；长度是速率的积分。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the speed", "求速率"],
                t(
                  `$\\mathbf{r}'(t) = ${lead}\\langle 2, 2t, t^2 \\rangle$, and $4 + 4t^2 + t^4 = (t^2 + 2)^2$, so $\\|\\mathbf{r}'(t)\\| = ${lead}(t^2 + 2)$.`,
                  `$\\mathbf{r}'(t) = ${lead}\\langle 2, 2t, t^2 \\rangle$，而 $4 + 4t^2 + t^4 = (t^2 + 2)^2$，所以 $\\|\\mathbf{r}'(t)\\| = ${lead}(t^2 + 2)$。`,
                ),
              ],
              [
                ["Integrate the speed", "对速率积分"],
                t(
                  `$L = ${lead}\\left[\\frac{t^3}{3} + 2t\\right]_{${t0}}^{${t1}} = ${lead}\\left(${F(t1).toLatex()} - ${paren(F(t0))}\\right) = ${ans.toLatex()}$.`,
                  `$L = ${lead}\\left[\\frac{t^3}{3} + 2t\\right]_{${t0}}^{${t1}} = ${lead}\\left(${F(t1).toLatex()} - ${paren(F(t0))}\\right) = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The straight segment from $\\mathbf{r}(${t0})$ to $\\mathbf{r}(${t1})$ has length about $${num(chord)}$, and the arc, about $${num(ans.toNumber())}$, is longer, as a curve between two points must be.`,
              `从 $\\mathbf{r}(${t0})$ 到 $\\mathbf{r}(${t1})$ 的直线段长度约为 $${num(chord)}$，弧长约为 $${num(ans.toNumber())}$，更长，两点间的曲线理应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

/** tangentVectorsAndTangentLinesToCurves computes tangent vectors to curves. */
export const tangentVectorsAndTangentLinesToCurves: TopicDef = {
  id: "tangent-vectors-and-tangent-lines-to-curves",
  title: t("Tangent Vectors and Tangent Lines to Curves", "曲线的切向量与切线"),
  summary: t(
    "The derivative r'(t0) is a tangent vector to the curve at t0, determining the direction of the tangent line.",
    "导数 r'(t0) 是曲线在 t0 处的切向量，决定了切线的方向。",
  ),
  intro: t(
    "For $\\mathbf{r}(t) = \\langle t, t^2, 3 \\rangle$ at $t = 2$, the curve is at $\\mathbf{r}(2) = \\langle 2, 4, 3 \\rangle$ and moving in the direction $\\mathbf{r}'(2) = \\langle 1, 4, 0 \\rangle$. The tangent line there is $\\boldsymbol{\\ell}(s) = \\langle 2, 4, 3 \\rangle + s\\langle 1, 4, 0 \\rangle$.\n\nCheck: the curve lies on the parabola $y = x^2$ in the plane $z = 3$, whose slope at $x = 2$ is $2 \\cdot 2 = 4$, and the direction $\\langle 1, 4, 0 \\rangle$ rises $4$ for each $1$ across.\n\nIn this lesson we find tangent vectors and tangent lines of space curves and where a tangent line meets a plane.",
    "对 $\\mathbf{r}(t) = \\langle t, t^2, 3 \\rangle$ 在 $t = 2$ 处，曲线位于 $\\mathbf{r}(2) = \\langle 2, 4, 3 \\rangle$，运动方向为 $\\mathbf{r}'(2) = \\langle 1, 4, 0 \\rangle$。那里的切线是 $\\boldsymbol{\\ell}(s) = \\langle 2, 4, 3 \\rangle + s\\langle 1, 4, 0 \\rangle$。\n\n检验：曲线位于平面 $z = 3$ 内的抛物线 $y = x^2$ 上，它在 $x = 2$ 处的斜率是 $2 \\cdot 2 = 4$，而方向 $\\langle 1, 4, 0 \\rangle$ 每横移 $1$ 上升 $4$。\n\n本课我们求空间曲线的切向量与切线，以及切线与平面的交点。",
  ),
  prerequisites: ["differentiating-vector-valued-functions", "the-vector-equation-of-a-line"],
  encompasses: [{ topic: "differentiating-vector-valued-functions", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-tangent-vectors-to-space-curves",
      title: t("Finding tangent vectors to space curves", "求空间曲线的切向量"),
      explanation: t(
        "If $\\mathbf{r}(t)$ is a smooth space curve, the derivative $\\mathbf{r}'(t_0) = \\langle x'(t_0), y'(t_0), z'(t_0) \\rangle$ provides a tangent vector to the curve at the point corresponding to $t = t_0$. For $\\langle t^2, t, 1 \\rangle$ at $t = 1$ it is $\\langle 2, 1, 0 \\rangle$.\n\n> **Watch out.** $\\mathbf{r}'(t_0)$ is a direction, not the point $\\mathbf{r}(t_0)$. Differentiate first and substitute $t_0$ afterwards: substituting first turns each component into a constant, whose derivative is $0$.",
        "若 $\\mathbf{r}(t)$ 是一条光滑空间曲线，则导数 $\\mathbf{r}'(t_0) = \\langle x'(t_0), y'(t_0), z'(t_0) \\rangle$ 提供了曲线在参数 $t = t_0$ 对应点处的切向量。对 $\\langle t^2, t, 1 \\rangle$ 在 $t = 1$ 处，它是 $\\langle 2, 1, 0 \\rangle$。\n\n> **注意。** $\\mathbf{r}'(t_0)$ 是方向，不是点 $\\mathbf{r}(t_0)$。先求导再代入 $t_0$：先代入会把每个分量变成常数，而常数的导数是 $0$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const c = rng.nonZero(-5, 5);
        const t0 = rng.int(-2, 2);
        const answer: Vec3 = [2 * a * t0, 3 * b * t0 * t0, c];
        const r = `\\left\\langle ${poly([a, "t^2"])}, ${poly([b, "t^3"])}, ${poly([c, "t"], [2, ""])} \\right\\rangle`;
        return located(
          {
            prompt: t(
              `Find the tangent vector $\\mathbf{r}'(${t0})$ to the curve $\\mathbf{r}(t) = ${r}$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `求曲线 $\\mathbf{r}(t) = ${r}$ 在 $t = ${t0}$ 处的切向量 $\\mathbf{r}'(${t0})$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Differentiate each component", "对每个分量求导"],
                  t(
                    `$\\mathbf{r}'(t) = \\left\\langle ${poly([2 * a, "t"])}, ${poly([3 * b, "t^2"])}, ${c} \\right\\rangle$.`,
                    `$\\mathbf{r}'(t) = \\left\\langle ${poly([2 * a, "t"])}, ${poly([3 * b, "t^2"])}, ${c} \\right\\rangle$。`,
                  ),
                ],
                [
                  [`Substitute $t = ${t0}$`, `代入 $t = ${t0}$`],
                  t(`$\\mathbf{r}'(${t0}) = ${v3L(answer)}$.`, `$\\mathbf{r}'(${t0}) = ${v3L(answer)}$。`),
                ],
              ],
              t(
                `A difference quotient agrees: the first component of $\\frac{\\mathbf{r}(${t0} + 0.01) - \\mathbf{r}(${t0})}{0.01}$ is $${paren(a)}(${num(2 * t0 + 0.01)}) = ${num(a * (2 * t0 + 0.01))}$, close to $${answer[0]}$.`,
                `差商与之相符：$\\frac{\\mathbf{r}(${t0} + 0.01) - \\mathbf{r}(${t0})}{0.01}$ 的第一个分量是 $${paren(a)}(${num(2 * t0 + 0.01)}) = ${num(a * (2 * t0 + 0.01))}$，接近 $${answer[0]}$。`,
              ),
            ),
          },
          [
            [
              [a * t0 * t0, b * t0 ** 3, c * t0 + 2],
              `That is the point $\\mathbf{r}(${t0})$ on the curve, not the tangent vector there.`,
              `这是曲线上的点 $\\mathbf{r}(${t0})$，不是那里的切向量。`,
            ],
            [
              [2 * a, 3 * b, c],
              `Those are the coefficients of $\\mathbf{r}'(t)$; substitute $t = ${t0}$ into the derivative.`,
              `这些是 $\\mathbf{r}'(t)$ 的系数；还要把 $t = ${t0}$ 代入导数。`,
            ],
            [
              [answer[1], answer[0], answer[2]],
              "The first two entries are swapped: keep each derivative in its own component's place.",
              "前两个分量互换了：每个导数要放在它自己分量的位置上。",
            ],
          ],
        );
      },
    },
    {
      id: "where-a-tangent-line-meets-the-xy-plane",
      title: t("Where a tangent line meets the $xy$-plane", "切线与 $xy$ 平面的交点"),
      explanation: t(
        "The tangent line to $\\mathbf{r}(t)$ at $t = t_0$ is $\\boldsymbol{\\ell}(s) = \\mathbf{r}(t_0) + s\\,\\mathbf{r}'(t_0)$. To find where it meets a plane, substitute its coordinates into the plane's equation and solve for $s$. For the plane $z = 0$, solve $z(t_0) + s\\,z'(t_0) = 0$, then put that $s$ back into the other two coordinates. For $\\langle t^2, t, t^3 \\rangle$ at $t = 3$: $\\mathbf{r}(3) = \\langle 9, 3, 27 \\rangle$ and $\\mathbf{r}'(3) = \\langle 6, 1, 27 \\rangle$, so $27 + 27s = 0$ gives $s = -1$ and the point $(3, 2, 0)$.\n\n> **Watch out.** Solve for the line's parameter $s$, not the curve's $t$: setting $z(t) = 0$ finds where the curve itself meets the plane. And $s$ is negative when the line must run backwards to reach the plane; keep its sign.",
        "$\\mathbf{r}(t)$ 在 $t = t_0$ 处的切线为 $\\boldsymbol{\\ell}(s) = \\mathbf{r}(t_0) + s\\,\\mathbf{r}'(t_0)$。要求它与某平面的交点，把坐标代入平面方程解出 $s$。对平面 $z = 0$，解 $z(t_0) + s\\,z'(t_0) = 0$，再把 $s$ 代回另外两个坐标。对 $\\langle t^2, t, t^3 \\rangle$ 在 $t = 3$ 处：$\\mathbf{r}(3) = \\langle 9, 3, 27 \\rangle$，$\\mathbf{r}'(3) = \\langle 6, 1, 27 \\rangle$，由 $27 + 27s = 0$ 得 $s = -1$，交点为 $(3, 2, 0)$。\n\n> **注意。** 要解的是切线的参数 $s$，不是曲线的 $t$：令 $z(t) = 0$ 求的是曲线本身与平面的交点。当切线要反向才能到达平面时 $s$ 为负；要保留它的符号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const t0 = rng.nonZero(-3, 3);
        const ans = [Q.of(2 * a * t0, 3), Q.of(t0 * t0, 3), Q.zero];
        const s = Q.of(-t0, 3);
        const P = [a * t0, t0 * t0, t0 ** 3];
        const D = [a, 2 * t0, 3 * t0 * t0];
        return located(
          {
            prompt: t(
              `Where does the tangent line to $\\mathbf{r}(t) = \\langle ${poly([a, "t"])}, t^2, t^3 \\rangle$ at $t = ${t0}$ meet the $xy$-plane?`,
              `$\\mathbf{r}(t) = \\langle ${poly([a, "t"])}, t^2, t^3 \\rangle$ 在 $t = ${t0}$ 处的切线与 $xy$ 平面交于何处？`,
            ),
            answer: ans,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Write the tangent line", "写出切线"],
                  t(
                    `$\\mathbf{r}(${t0}) = ${v3L(P)}$ and $\\mathbf{r}'(${t0}) = ${v3L(D)}$, so $\\boldsymbol{\\ell}(s) = ${v3L(P)} + s${v3L(D)}$.`,
                    `$\\mathbf{r}(${t0}) = ${v3L(P)}$，$\\mathbf{r}'(${t0}) = ${v3L(D)}$，所以 $\\boldsymbol{\\ell}(s) = ${v3L(P)} + s${v3L(D)}$。`,
                  ),
                ],
                [
                  ["Solve $z = 0$ for $s$", "由 $z = 0$ 解出 $s$"],
                  t(`$${P[2]} + ${D[2]}s = 0$ gives $s = ${s.toLatex()}$.`, `由 $${P[2]} + ${D[2]}s = 0$ 得 $s = ${s.toLatex()}$。`),
                ],
                [
                  ["Substitute back", "代回"],
                  t(
                    `$x = ${P[0]} + ${paren(a)}${paren(s)} = ${ans[0]!.toLatex()}$ and $y = ${P[1]} + ${paren(D[1]!)}${paren(s)} = ${ans[1]!.toLatex()}$, so the point is $${pointLatex(ans)}$.`,
                    `$x = ${P[0]} + ${paren(a)}${paren(s)} = ${ans[0]!.toLatex()}$，$y = ${P[1]} + ${paren(D[1]!)}${paren(s)} = ${ans[1]!.toLatex()}$，所以交点为 $${pointLatex(ans)}$。`,
                  ),
                ],
              ],
              t(
                `From $\\mathbf{r}(${t0})$ to the point the change is $${v3L([ans[0]!.sub(Q.of(P[0]!)), ans[1]!.sub(Q.of(P[1]!)), Q.of(-P[2]!)])} = ${s.toLatex()}${v3L(D)}$, along the tangent direction, and the point has $z = 0$.`,
                `从 $\\mathbf{r}(${t0})$ 到交点的变化量是 $${v3L([ans[0]!.sub(Q.of(P[0]!)), ans[1]!.sub(Q.of(P[1]!)), Q.of(-P[2]!)])} = ${s.toLatex()}${v3L(D)}$，沿着切线方向，且交点的 $z = 0$。`,
              ),
            ),
          },
          [
            [
              [a * t0, t0 * t0, 0],
              `That keeps $x$ and $y$ of $\\mathbf{r}(${t0})$ and sets $z = 0$; moving along the tangent line changes $x$ and $y$ too.`,
              `这保留了 $\\mathbf{r}(${t0})$ 的 $x$、$y$ 并令 $z = 0$；沿切线移动时 $x$ 和 $y$ 也会改变。`,
            ],
            [
              [Q.of(4 * a * t0, 3), Q.of(5 * t0 * t0, 3), Q.zero],
              `That uses $s = ${s.neg().toLatex()}$, the wrong sign: solving $${P[2]} + ${D[2]}s = 0$ gives $s = ${s.toLatex()}$.`,
              `这用了 $s = ${s.neg().toLatex()}$，符号错了：解 $${P[2]} + ${D[2]}s = 0$ 得 $s = ${s.toLatex()}$。`,
            ],
            [
              [0, 0, 0],
              "That is where the curve itself meets the $xy$-plane, at $t = 0$; the tangent line leaves the curve.",
              "这是曲线本身与 $xy$ 平面的交点（$t = 0$ 时）；切线会离开曲线。",
            ],
          ],
        );
      },
    },
  ],
};

/** unitTangentVectors calculates the unit tangent vector T(t). */
export const unitTangentVectors: TopicDef = {
  id: "unit-tangent-vectors",
  title: t("Unit Tangent Vectors", "单位切向量"),
  summary: t(
    "The unit tangent vector T(t) = r'(t) / ||r'(t)|| points in the direction of motion with unit length.",
    "单位切向量 T(t) = r'(t) / ||r'(t)|| 指向运动方向且长度为 1。",
  ),
  intro: t(
    "For $\\mathbf{r}(t) = \\langle 3t, 4t \\rangle$ the velocity is $\\langle 3, 4 \\rangle$ with length $5$. Dividing by the length gives the unit tangent $\\mathbf{T} = \\left\\langle \\frac{3}{5}, \\frac{4}{5} \\right\\rangle$: the same direction, but length one.\n\nCheck: $\\left(\\frac{3}{5}\\right)^2 + \\left(\\frac{4}{5}\\right)^2 = \\frac{9 + 16}{25} = 1$.\n\nIn this lesson we compute unit tangent vectors by dividing the velocity by the speed.",
    "对 $\\mathbf{r}(t) = \\langle 3t, 4t \\rangle$，速度为 $\\langle 3, 4 \\rangle$，长度为 $5$。除以长度得单位切向量 $\\mathbf{T} = \\left\\langle \\frac{3}{5}, \\frac{4}{5} \\right\\rangle$：方向相同，长度为 1。\n\n检验：$\\left(\\frac{3}{5}\\right)^2 + \\left(\\frac{4}{5}\\right)^2 = \\frac{9 + 16}{25} = 1$。\n\n本课我们用速度除以速率来求单位切向量。",
  ),
  prerequisites: ["tangent-vectors-and-tangent-lines-to-curves"],
  encompasses: [{ topic: "tangent-vectors-and-tangent-lines-to-curves", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-unit-tangent-vectors",
      title: t("Calculating unit tangent vectors", "计算单位切向量"),
      explanation: t(
        "Dividing the velocity by its length keeps only its direction, giving a vector of length one that points along the curve in the direction of motion. The unit tangent vector $\\mathbf{T}(t)$ is obtained by normalizing the velocity vector:\n\n$$\\mathbf{T}(t) = \\frac{\\mathbf{r}'(t)}{\\|\\mathbf{r}'(t)\\|}.$$\n\nIf $\\mathbf{r}'(t_0) = \\langle 1, 2, 2 \\rangle$, its length is $3$ and $\\mathbf{T}(t_0) = \\left\\langle \\frac{1}{3}, \\frac{2}{3}, \\frac{2}{3} \\right\\rangle$.\n\n> **Watch out.** Divide every component by the same length $\\|\\mathbf{r}'\\|$; a vector whose squared entries do not add to $1$ is not yet a unit vector. On a helix the third entry of $\\mathbf{T}$ is a nonzero constant, since the curve keeps climbing.",
        "把速度除以它的长度只保留方向，得到一个长度为 1、沿曲线指向运动方向的向量。单位切向量 $\\mathbf{T}(t)$ 通过对速度向量进行单位化得到：\n\n$$\\mathbf{T}(t) = \\frac{\\mathbf{r}'(t)}{\\|\\mathbf{r}'(t)\\|}$$\n\n若 $\\mathbf{r}'(t_0) = \\langle 1, 2, 2 \\rangle$，其长度为 $3$，$\\mathbf{T}(t_0) = \\left\\langle \\frac{1}{3}, \\frac{2}{3}, \\frac{2}{3} \\right\\rangle$。\n\n> **注意。** 每个分量都除以同一个长度 $\\|\\mathbf{r}'\\|$；各分量平方和不等于 $1$ 的向量还不是单位向量。在螺旋线上 $\\mathbf{T}$ 的第三个分量是非零常数，因为曲线一直在上升。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const [tVal, cs, sn] = rng.pick([
          ["0", 1, 0],
          ["\\frac{\\pi}{2}", 0, 1],
          ["\\pi", -1, 0],
          ["\\frac{3\\pi}{2}", 0, -1],
        ] as const);
        const velocity = [-a * sn, a * cs, b];
        const answer = velocity.map((x) => Q.of(x, c));
        return located(
          {
            prompt: t(
              `Find the unit tangent vector $\\mathbf{T}(${tVal})$ for the helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `求螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 在 $t = ${tVal}$ 处的单位切向量 $\\mathbf{T}(${tVal})$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Find the velocity", "求速度"],
                  t(
                    `$\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$, so $\\mathbf{r}'(${tVal}) = ${v3L(velocity)}$.`,
                    `$\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$，所以 $\\mathbf{r}'(${tVal}) = ${v3L(velocity)}$。`,
                  ),
                ],
                [
                  ["Find the speed", "求速率"],
                  t(
                    `$\\|\\mathbf{r}'(t)\\| = \\sqrt{${a * a}(\\sin^2 t + \\cos^2 t) + ${b * b}} = \\sqrt{${c * c}} = ${c}$.`,
                    `$\\|\\mathbf{r}'(t)\\| = \\sqrt{${a * a}(\\sin^2 t + \\cos^2 t) + ${b * b}} = \\sqrt{${c * c}} = ${c}$。`,
                  ),
                ],
                [
                  ["Divide by the speed", "除以速率"],
                  t(
                    `$\\mathbf{T}(${tVal}) = \\frac{1}{${c}}${v3L(velocity)} = ${v3L(answer)}$.`,
                    `$\\mathbf{T}(${tVal}) = \\frac{1}{${c}}${v3L(velocity)} = ${v3L(answer)}$。`,
                  ),
                ],
              ],
              t(
                `The squared entries add to $\\frac{${a * a} + ${b * b}}{${c * c}} = 1$, so the answer is a unit vector.`,
                `各分量平方和为 $\\frac{${a * a} + ${b * b}}{${c * c}} = 1$，所以答案是单位向量。`,
              ),
            ),
          },
          [
            [
              velocity,
              `That is the velocity $\\mathbf{r}'(${tVal})$, of length $${c}$; divide it by its length.`,
              `这是速度 $\\mathbf{r}'(${tVal})$，长度为 $${c}$；还要除以它的长度。`,
            ],
            [
              [answer[1]!, answer[0]!, answer[2]!],
              "The first two entries are swapped: the derivative of $\\cos t$ is $-\\sin t$ and goes first.",
              "前两个分量互换了：$\\cos t$ 的导数是 $-\\sin t$，放在第一个位置。",
            ],
            [
              [answer[0]!, answer[1]!, Q.zero],
              `The helix keeps climbing, so the third entry is $\\frac{${b}}{${c}}$, not $0$.`,
              `螺旋线一直在上升，所以第三个分量是 $\\frac{${b}}{${c}}$，不是 $0$。`,
            ],
            [
              [answer[0]!.neg(), answer[1]!.neg(), answer[2]!],
              "The signs of the first two entries are flipped: $(\\cos t)' = -\\sin t$ and $(\\sin t)' = \\cos t$.",
              "前两个分量的符号反了：$(\\cos t)' = -\\sin t$，$(\\sin t)' = \\cos t$。",
            ],
          ],
        );
      },
    },
    {
      id: "a-unit-tangent-vector-with-rational-entries",
      title: t("A unit tangent vector with rational entries", "分量为有理数的单位切向量"),
      explanation: t(
        "The unit tangent vector is $\\mathbf{T}(t) = \\frac{\\mathbf{r}'(t)}{\\|\\mathbf{r}'(t)\\|}$. For $\\mathbf{r}(t) = \\langle 2at, \\pm at^2, \\frac{a}{3}t^3 \\rangle$ with $a > 0$, $\\mathbf{r}'(t) = a\\langle 2, \\pm 2t, t^2 \\rangle$ and $\\|\\mathbf{r}'(t)\\| = a(t^2 + 2)$. The factor $a$ cancels, leaving\n\n$$\\mathbf{T}(t) = \\frac{\\langle 2, \\pm 2t, t^2 \\rangle}{t^2 + 2}.$$\n\nRescaling a curve's speed never changes its unit tangent. At $t = 4$ with the $+$ sign, $\\mathbf{T} = \\frac{\\langle 2, 8, 16 \\rangle}{18} = \\left\\langle \\frac{1}{9}, \\frac{4}{9}, \\frac{8}{9} \\right\\rangle$.\n\n> **Watch out.** The factor $a$ appears in both $\\mathbf{r}'$ and its length, so it cancels; do not divide by it a second time. The sign of the middle entry follows the sign of the $t^2$ component.",
        "单位切向量为 $\\mathbf{T}(t) = \\frac{\\mathbf{r}'(t)}{\\|\\mathbf{r}'(t)\\|}$。对 $\\mathbf{r}(t) = \\langle 2at, \\pm at^2, \\frac{a}{3}t^3 \\rangle$（$a > 0$），$\\mathbf{r}'(t) = a\\langle 2, \\pm 2t, t^2 \\rangle$，$\\|\\mathbf{r}'(t)\\| = a(t^2 + 2)$。因子 $a$ 约去，得\n\n$$\\mathbf{T}(t) = \\frac{\\langle 2, \\pm 2t, t^2 \\rangle}{t^2 + 2}$$\n\n改变曲线速率的倍数从不改变其单位切向量。取 $+$ 号、$t = 4$ 时，$\\mathbf{T} = \\frac{\\langle 2, 8, 16 \\rangle}{18} = \\left\\langle \\frac{1}{9}, \\frac{4}{9}, \\frac{8}{9} \\right\\rangle$。\n\n> **注意。** 因子 $a$ 同时出现在 $\\mathbf{r}'$ 和它的长度中，所以会约去；不要再除一次。中间分量的符号跟随 $t^2$ 分量的符号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const s = rng.pick([1, -1]);
        const t0 = rng.int(-3, 3);
        const n = t0 * t0 + 2;
        const ans = [Q.of(2, n), Q.of(2 * s * t0, n), Q.of(t0 * t0, n)];
        const velocity = [2 * a, 2 * a * s * t0, a * t0 * t0];
        return located(
          {
            prompt: t(
              `Find the unit tangent vector $\\mathbf{T}(${t0})$ of $\\mathbf{r}(t) = ${cubicCurve(a, s)}$.`,
              `求 $\\mathbf{r}(t) = ${cubicCurve(a, s)}$ 的单位切向量 $\\mathbf{T}(${t0})$。`,
            ),
            answer: ans,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Find the velocity", "求速度"],
                  t(
                    `$\\mathbf{r}'(t) = \\left\\langle ${2 * a}, ${poly([2 * a * s, "t"])}, ${poly([a, "t^2"])} \\right\\rangle$, so $\\mathbf{r}'(${t0}) = ${v3L(velocity)}$.`,
                    `$\\mathbf{r}'(t) = \\left\\langle ${2 * a}, ${poly([2 * a * s, "t"])}, ${poly([a, "t^2"])} \\right\\rangle$，所以 $\\mathbf{r}'(${t0}) = ${v3L(velocity)}$。`,
                  ),
                ],
                [
                  ["Find the speed", "求速率"],
                  t(
                    `$\\|\\mathbf{r}'(${t0})\\| = ${a === 1 ? "" : a}(${t0 * t0} + 2) = ${a * n}$.`,
                    `$\\|\\mathbf{r}'(${t0})\\| = ${a === 1 ? "" : a}(${t0 * t0} + 2) = ${a * n}$。`,
                  ),
                ],
                [
                  ["Divide by the speed", "除以速率"],
                  t(
                    `$\\mathbf{T}(${t0}) = \\frac{1}{${a * n}}${v3L(velocity)} = ${v3L(ans)}$.`,
                    `$\\mathbf{T}(${t0}) = \\frac{1}{${a * n}}${v3L(velocity)} = ${v3L(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The squared entries add to $\\frac{4 + ${4 * t0 * t0} + ${t0 ** 4}}{${n * n}} = \\frac{${n * n}}{${n * n}} = 1$.`,
                `各分量平方和为 $\\frac{4 + ${4 * t0 * t0} + ${t0 ** 4}}{${n * n}} = \\frac{${n * n}}{${n * n}} = 1$。`,
              ),
            ),
          },
          [
            [
              velocity,
              `That is the velocity $\\mathbf{r}'(${t0})$; divide it by its length $${a * n}$.`,
              `这是速度 $\\mathbf{r}'(${t0})$；还要除以它的长度 $${a * n}$。`,
            ],
            [
              ans.map((x) => x.div(Q.of(a))),
              `The factor $${a}$ cancels between $\\mathbf{r}'$ and its length; dividing by it again makes the vector too short.`,
              `因子 $${a}$ 在 $\\mathbf{r}'$ 与其长度之间约去；再除一次会使向量太短。`,
            ],
            [
              [ans[0]!, ans[1]!.neg(), ans[2]!],
              "The middle sign is flipped: it follows the sign of the $t^2$ component of $\\mathbf{r}$.",
              "中间分量的符号反了：它跟随 $\\mathbf{r}$ 中 $t^2$ 分量的符号。",
            ],
          ],
        );
      },
    },
  ],
};

/** turning gives cos t and sin t at the four quarter turns used by the helix problems. */
const turning = [
  ["0", 1, 0],
  ["\\frac{\\pi}{2}", 0, 1],
  ["\\pi", -1, 0],
  ["\\frac{3\\pi}{2}", 0, -1],
] as const;

/** principalNormalVectors calculates the principal normal vector N(t). */
export const principalNormalVectors: TopicDef = {
  id: "principal-normal-vectors",
  title: t("Principal Normal Vectors", "主法向量"),
  summary: t(
    "The principal normal vector N(t) = T'(t) / ||T'(t)|| points in the direction the curve is turning, perpendicular to T(t).",
    "主法向量 N(t) = T'(t) / ||T'(t)|| 指向曲线转弯的方向，且与 T(t) 垂直。",
  ),
  intro: t(
    "On the circle $\\mathbf{r}(t) = \\langle 2\\cos t, 2\\sin t \\rangle$ the unit tangent is $\\mathbf{T} = \\langle -\\sin t, \\cos t \\rangle$, so $\\mathbf{T}' = \\langle -\\cos t, -\\sin t \\rangle$, already of length $1$. Hence $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t \\rangle$; at $t = 0$, at the point $(2, 0)$, it is $\\langle -1, 0 \\rangle$, pointing to the center.\n\nCheck: $\\mathbf{T}(0) = \\langle 0, 1 \\rangle$ and $\\mathbf{N}(0) \\cdot \\mathbf{T}(0) = 0$, so the normal is perpendicular to the motion.\n\nIn this lesson we compute the principal normal, the unit vector in the direction the curve is turning.",
    "在圆 $\\mathbf{r}(t) = \\langle 2\\cos t, 2\\sin t \\rangle$ 上，单位切向量为 $\\mathbf{T} = \\langle -\\sin t, \\cos t \\rangle$，所以 $\\mathbf{T}' = \\langle -\\cos t, -\\sin t \\rangle$，长度已经是 $1$。因此 $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t \\rangle$；$t = 0$ 时在点 $(2, 0)$ 处它是 $\\langle -1, 0 \\rangle$，指向圆心。\n\n检验：$\\mathbf{T}(0) = \\langle 0, 1 \\rangle$，且 $\\mathbf{N}(0) \\cdot \\mathbf{T}(0) = 0$，所以法向量与运动方向垂直。\n\n本课我们计算主法向量，即指向曲线弯曲方向的单位向量。",
  ),
  prerequisites: ["unit-tangent-vectors"],
  encompasses: [{ topic: "unit-tangent-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-principal-normal-vectors",
      title: t("Calculating principal normal vectors", "计算主法向量"),
      explanation: t(
        "Since $\\mathbf{T}(t)$ has constant unit length, $\\mathbf{T}'(t)$ is orthogonal to $\\mathbf{T}(t)$. The principal unit normal vector $\\mathbf{N}(t)$ is defined by:\n\n$$\\mathbf{N}(t) = \\frac{\\mathbf{T}'(t)}{\\|\\mathbf{T}'(t)\\|}.$$\n\nFor the helix $\\langle \\cos t, \\sin t, t \\rangle$, $\\mathbf{T}' = \\frac{1}{\\sqrt{2}}\\langle -\\cos t, -\\sin t, 0 \\rangle$, so $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t, 0 \\rangle$.\n\n> **Watch out.** On a helix $\\mathbf{N}$ points horizontally toward the axis, the inside of the turn, not away from it; the climb belongs to $\\mathbf{T}$, so the third entry of $\\mathbf{N}$ is $0$. Divide $\\mathbf{T}'$ by its length.",
        "由于 $\\mathbf{T}(t)$ 具有恒定单位长度，因此 $\\mathbf{T}'(t)$ 与 $\\mathbf{T}(t)$ 正交。主单位法向量 $\\mathbf{N}(t)$ 定义为：\n\n$$\\mathbf{N}(t) = \\frac{\\mathbf{T}'(t)}{\\|\\mathbf{T}'(t)\\|}$$\n\n对螺旋线 $\\langle \\cos t, \\sin t, t \\rangle$，$\\mathbf{T}' = \\frac{1}{\\sqrt{2}}\\langle -\\cos t, -\\sin t, 0 \\rangle$，所以 $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t, 0 \\rangle$。\n\n> **注意。** 在螺旋线上 $\\mathbf{N}$ 水平地指向轴线，即弯曲的内侧，而不是背离轴线；上升属于 $\\mathbf{T}$，所以 $\\mathbf{N}$ 的第三个分量是 $0$。要把 $\\mathbf{T}'$ 除以它的长度。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const [tText, cs, sn] = rng.pick(turning);
        const ans = [-cs, -sn, 0];
        const T = [Q.of(-a * sn, c), Q.of(a * cs, c), Q.of(b, c)];
        return located(
          {
            prompt: t(
              `Find the principal unit normal vector $\\mathbf{N}\\left(${tText}\\right)$ for the circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `求圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 在 $t = ${tText}$ 处的主单位法向量 $\\mathbf{N}\\left(${tText}\\right)$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer: ans,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Find the unit tangent", "求单位切向量"],
                  t(
                    `$\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$ has length $\\sqrt{${a * a} + ${b * b}} = ${c}$, so $\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{${c}}\\sin t, \\frac{${a}}{${c}}\\cos t, \\frac{${b}}{${c}} \\right\\rangle$.`,
                    `$\\mathbf{r}'(t) = \\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$ 的长度为 $\\sqrt{${a * a} + ${b * b}} = ${c}$，所以 $\\mathbf{T}(t) = \\left\\langle -\\frac{${a}}{${c}}\\sin t, \\frac{${a}}{${c}}\\cos t, \\frac{${b}}{${c}} \\right\\rangle$。`,
                  ),
                ],
                [
                  ["Differentiate and normalize", "求导并单位化"],
                  t(
                    `$\\mathbf{T}'(t) = \\left\\langle -\\frac{${a}}{${c}}\\cos t, -\\frac{${a}}{${c}}\\sin t, 0 \\right\\rangle$ has length $\\frac{${a}}{${c}}$, so $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t, 0 \\rangle$.`,
                    `$\\mathbf{T}'(t) = \\left\\langle -\\frac{${a}}{${c}}\\cos t, -\\frac{${a}}{${c}}\\sin t, 0 \\right\\rangle$ 的长度为 $\\frac{${a}}{${c}}$，所以 $\\mathbf{N}(t) = \\langle -\\cos t, -\\sin t, 0 \\rangle$。`,
                  ),
                ],
                [
                  [`Evaluate at $t = ${tText}$`, `代入 $t = ${tText}$`],
                  t(`$\\mathbf{N}\\left(${tText}\\right) = ${v3L(ans)}$.`, `$\\mathbf{N}\\left(${tText}\\right) = ${v3L(ans)}$。`),
                ],
              ],
              t(
                `$\\mathbf{T}\\left(${tText}\\right) = ${v3L(T)}$, and its dot product with $${v3L(ans)}$ is $0$; the point $(${a * cs}, ${a * sn})$ in the $xy$-plane moves along $${v3L(ans)}$ straight to the axis.`,
                `$\\mathbf{T}\\left(${tText}\\right) = ${v3L(T)}$，它与 $${v3L(ans)}$ 的点积为 $0$；在 $xy$ 平面内，点 $(${a * cs}, ${a * sn})$ 沿 $${v3L(ans)}$ 方向直指轴线。`,
              ),
            ),
          },
          [
            [[cs, sn, 0], "That points away from the axis; the helix turns toward its axis.", "这背离轴线；螺旋线朝它的轴线弯曲。"],
            [
              [0, 0, 1],
              "The climb belongs to the tangent; $\\mathbf{T}'$ has third entry $0$, so $\\mathbf{N}$ is horizontal.",
              "上升属于切向量；$\\mathbf{T}'$ 的第三个分量为 $0$，所以 $\\mathbf{N}$ 是水平的。",
            ],
            [
              [Q.of(-a * cs, c), Q.of(-a * sn, c), Q.zero],
              `That is $\\mathbf{T}'$, of length $\\frac{${a}}{${c}}$; divide it by its length.`,
              `这是 $\\mathbf{T}'$，长度为 $\\frac{${a}}{${c}}$；还要除以它的长度。`,
            ],
            [
              [-sn, -cs, 0],
              "The first two entries are swapped: $\\mathbf{N} = \\langle -\\cos t, -\\sin t, 0 \\rangle$.",
              "前两个分量互换了：$\\mathbf{N} = \\langle -\\cos t, -\\sin t, 0 \\rangle$。",
            ],
          ],
        );
      },
    },
    {
      id: "the-principal-normal-of-a-circle-points-to-its-center",
      figure: multivariableDrawings1["principal-normal-vectors#the-principal-normal-of-a-circle-points-to-its-center"],
      title: t("The principal normal of a circle points to its center", "圆的主法向量指向圆心"),
      explanation: t(
        "The principal unit normal $\\mathbf{N} = \\frac{\\mathbf{T}'}{\\|\\mathbf{T}'\\|}$ points in the direction the curve is turning. On a circle the curve always turns toward the center, so at a point $P$ of the circle with center $C$,\n\n$$\\mathbf{N} = \\frac{C - P}{\\|C - P\\|},$$\n\nwhatever the direction of travel or the speed. On the circle of radius $3$ centered at $(1, 2)$, at the point $(4, 2)$, $\\mathbf{N} = \\frac{\\langle -3, 0 \\rangle}{3} = \\langle -1, 0 \\rangle$.\n\n> **Watch out.** Reversing the direction of travel flips $\\mathbf{T}$ but not $\\mathbf{N}$: the curve still turns toward the center. Divide $C - P$ by the radius, since $\\mathbf{N}$ is a unit vector.",
        "主单位法向量 $\\mathbf{N} = \\frac{\\mathbf{T}'}{\\|\\mathbf{T}'\\|}$ 指向曲线弯曲的方向。在圆上曲线总是朝圆心弯曲，所以在圆心为 $C$ 的圆上一点 $P$ 处，\n\n$$\\mathbf{N} = \\frac{C - P}{\\|C - P\\|},$$\n\n与运动方向和速率无关。在圆心为 $(1, 2)$、半径为 $3$ 的圆上，点 $(4, 2)$ 处 $\\mathbf{N} = \\frac{\\langle -3, 0 \\rangle}{3} = \\langle -1, 0 \\rangle$。\n\n> **注意。** 反转运动方向会使 $\\mathbf{T}$ 反向，但 $\\mathbf{N}$ 不变：曲线仍然朝圆心弯曲。要把 $C - P$ 除以半径，因为 $\\mathbf{N}$ 是单位向量。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 6);
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 4);
        const w = rng.pick([1, 2, 3]);
        const cw = rng.int(0, 1) === 1;
        const [n, den, cs, sn] = rng.pick([
          [0, 1, 1, 0],
          [1, 2, 0, 1],
          [1, 1, -1, 0],
          [3, 2, 0, -1],
        ] as const);
        const wt = w === 1 ? "t" : `${w}t`;
        const tq = Q.of(n, den * w);
        const t0 = n === 0 ? "0" : tq.isInteger() ? `${tq.n === 1n ? "" : tq.n}\\pi` : `\\frac{${tq.n === 1n ? "" : tq.n}\\pi}{${tq.d}}`;
        const ys = cw ? -sn : sn;
        const ans = [-cs, -ys];
        const x = `${R === 1 ? "" : R}\\cos ${wt}${h === 0 ? "" : h > 0 ? ` + ${h}` : ` - ${-h}`}`;
        const y = `${cw ? "-" : ""}${R === 1 ? "" : R}\\sin ${wt}${k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`}`;
        const P = [h + R * cs, k + R * ys];
        const vel = [-w * R * sn, (cw ? -1 : 1) * w * R * cs];
        return located(
          {
            prompt: t(
              `Find the principal unit normal $\\mathbf{N}$ of $\\mathbf{r}(t) = \\langle ${x}, ${y} \\rangle$ at $t = ${t0}$.`,
              `求 $\\mathbf{r}(t) = \\langle ${x}, ${y} \\rangle$ 在 $t = ${t0}$ 处的主单位法向量 $\\mathbf{N}$。`,
            ),
            answer: ans,
            vector: true,
            solution: walked(
              [
                [
                  ["Find the circle and the point", "确定圆与点"],
                  t(
                    `$\\mathbf{r}$ traces the circle of radius $${R}$ centered at $C = (${h}, ${k})$, and at $t = ${t0}$ it is at $P = (${P[0]}, ${P[1]})$.`,
                    `$\\mathbf{r}$ 描出圆心为 $C = (${h}, ${k})$、半径为 $${R}$ 的圆，$t = ${t0}$ 时位于 $P = (${P[0]}, ${P[1]})$。`,
                  ),
                ],
                [
                  ["Point to the center", "指向圆心"],
                  t(
                    `$C - P = \\langle ${-R * cs}, ${-R * ys} \\rangle$ has length $${R}$, so $\\mathbf{N} = \\langle ${-cs}, ${-ys} \\rangle$.`,
                    `$C - P = \\langle ${-R * cs}, ${-R * ys} \\rangle$ 的长度为 $${R}$，所以 $\\mathbf{N} = \\langle ${-cs}, ${-ys} \\rangle$。`,
                  ),
                ],
              ],
              t(
                `The velocity there is $\\mathbf{r}'(${t0}) = \\langle ${vel[0]}, ${vel[1]} \\rangle$, and $\\langle ${-cs}, ${-ys} \\rangle \\cdot \\langle ${vel[0]}, ${vel[1]} \\rangle = 0$: the normal is perpendicular to the motion.`,
                `该处速度为 $\\mathbf{r}'(${t0}) = \\langle ${vel[0]}, ${vel[1]} \\rangle$，且 $\\langle ${-cs}, ${-ys} \\rangle \\cdot \\langle ${vel[0]}, ${vel[1]} \\rangle = 0$：法向量与运动方向垂直。`,
              ),
            ),
          },
          [
            [[cs, ys], "That points away from the center; a circle turns toward its center.", "这背离圆心；圆朝圆心弯曲。"],
            [
              [-ys, cs],
              "That is a tangent direction, along the motion; $\\mathbf{N}$ is perpendicular to it.",
              "这是切线方向，沿着运动方向；$\\mathbf{N}$ 与它垂直。",
            ],
            [
              [ys, -cs],
              "That is a tangent direction, along the motion; $\\mathbf{N}$ is perpendicular to it.",
              "这是切线方向，沿着运动方向；$\\mathbf{N}$ 与它垂直。",
            ],
            [
              [-R * cs, -R * ys],
              `That is $C - P$, of length $${R}$; divide by the radius to get a unit vector.`,
              `这是 $C - P$，长度为 $${R}$；除以半径才得到单位向量。`,
            ],
          ],
        );
      },
    },
  ],
};

/** binormalVectors computes the binormal vector B(t) = T(t) × N(t). */
export const binormalVectors: TopicDef = {
  id: "binormal-vectors",
  title: t("Binormal Vectors", "次法向量"),
  summary: t(
    "The binormal vector B(t) = T(t) × N(t) completes the right-handed Frenet-Serret orthonormal frame {T, N, B}.",
    "次法向量 B(t) = T(t) × N(t) 构成了右手系 Frenet-Serret 正交标架 {T, N, B}。",
  ),
  intro: t(
    "If at some point $\\mathbf{T} = \\langle 1, 0, 0 \\rangle$ and $\\mathbf{N} = \\langle 0, 1, 0 \\rangle$, then $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N} = \\langle 0 \\cdot 0 - 0 \\cdot 1, 0 \\cdot 0 - 1 \\cdot 0, 1 \\cdot 1 - 0 \\cdot 0 \\rangle = \\langle 0, 0, 1 \\rangle$.\n\nCheck: $\\mathbf{B}$ is perpendicular to both, $\\mathbf{B} \\cdot \\mathbf{T} = 0$ and $\\mathbf{B} \\cdot \\mathbf{N} = 0$, has length $1$, and the right-hand rule from $x$ toward $y$ points up the $z$-axis.\n\nIn this lesson we compute the binormal $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$ that completes the moving frame of a curve.",
    "若某点处 $\\mathbf{T} = \\langle 1, 0, 0 \\rangle$，$\\mathbf{N} = \\langle 0, 1, 0 \\rangle$，则 $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N} = \\langle 0 \\cdot 0 - 0 \\cdot 1, 0 \\cdot 0 - 1 \\cdot 0, 1 \\cdot 1 - 0 \\cdot 0 \\rangle = \\langle 0, 0, 1 \\rangle$。\n\n检验：$\\mathbf{B}$ 与两者都垂直，$\\mathbf{B} \\cdot \\mathbf{T} = 0$，$\\mathbf{B} \\cdot \\mathbf{N} = 0$，长度为 $1$，而右手从 $x$ 转向 $y$ 时拇指指向 $z$ 轴正方向。\n\n本课我们计算补全曲线活动标架的次法向量 $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$。",
  ),
  prerequisites: ["principal-normal-vectors", "the-cross-product-of-two-vectors"],
  encompasses: [{ topic: "principal-normal-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-binormal-vectors",
      title: t("Computing binormal vectors", "计算次法向量"),
      explanation: t(
        "The binormal vector $\\mathbf{B}(t)$ is defined by the cross product of the unit tangent and principal normal vectors:\n\n$$\\mathbf{B}(t) = \\mathbf{T}(t) \\times \\mathbf{N}(t).$$\n\nWith $\\mathbf{T} = \\langle 0, 1, 0 \\rangle$ and $\\mathbf{N} = \\langle -1, 0, 0 \\rangle$, $\\mathbf{B} = \\langle 1 \\cdot 0 - 0 \\cdot 0, 0 \\cdot (-1) - 0 \\cdot 0, 0 \\cdot 0 - 1 \\cdot (-1) \\rangle = \\langle 0, 0, 1 \\rangle$.\n\n> **Watch out.** The order matters: $\\mathbf{N} \\times \\mathbf{T} = -\\mathbf{B}$. Take the cross product with $\\mathbf{T}$ in the second row and $\\mathbf{N}$ in the third, and check that the result is perpendicular to both.",
        "次法向量 $\\mathbf{B}(t)$ 定义为单位切向量与主法向量的叉积：\n\n$$\\mathbf{B}(t) = \\mathbf{T}(t) \\times \\mathbf{N}(t)$$\n\n取 $\\mathbf{T} = \\langle 0, 1, 0 \\rangle$，$\\mathbf{N} = \\langle -1, 0, 0 \\rangle$，$\\mathbf{B} = \\langle 1 \\cdot 0 - 0 \\cdot 0, 0 \\cdot (-1) - 0 \\cdot 0, 0 \\cdot 0 - 1 \\cdot (-1) \\rangle = \\langle 0, 0, 1 \\rangle$。\n\n> **注意。** 顺序很重要：$\\mathbf{N} \\times \\mathbf{T} = -\\mathbf{B}$。计算叉积时 $\\mathbf{T}$ 放在第二行、$\\mathbf{N}$ 放在第三行，并检查结果与两者都垂直。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const [tVal, cs, sn] = rng.pick(turning);
        const T = [Q.of(-a * sn, c), Q.of(a * cs, c), Q.of(b, c)] as const;
        const N = [Q.of(-cs), Q.of(-sn), Q.zero] as const;
        const ans = [T[1].mul(N[2]).sub(T[2].mul(N[1])), T[2].mul(N[0]).sub(T[0].mul(N[2])), T[0].mul(N[1]).sub(T[1].mul(N[0]))];
        const dotQ = (u: readonly Q[], v: readonly Q[]) => u.reduce((s, x, i) => s.add(x.mul(v[i]!)), Q.zero);
        const entries = [
          `${paren(T[1])} \\cdot 0 - ${paren(T[2])} \\cdot ${paren(N[1])}`,
          `${paren(T[2])} \\cdot ${paren(N[0])} - ${paren(T[0])} \\cdot 0`,
          `${paren(T[0])} \\cdot ${paren(N[1])} - ${paren(T[1])} \\cdot ${paren(N[0])}`,
        ];
        return located(
          {
            prompt: t(
              `For the helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ with unit tangent vector $\\mathbf{T}(${tVal}) = ${v3L(T)}$ and principal normal $\\mathbf{N}(${tVal}) = ${v3L(N)}$, find the binormal vector $\\mathbf{B}(${tVal})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `对于螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$，已知其在 $t = ${tVal}$ 处的单位切向量为 $\\mathbf{T}(${tVal}) = ${v3L(T)}$，主法向量为 $\\mathbf{N}(${tVal}) = ${v3L(N)}$。求次法向量 $\\mathbf{B}(${tVal})$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer: ans,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Set up the cross product", "列出叉积"],
                  t(
                    "$\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N} = \\langle T_2N_3 - T_3N_2, T_3N_1 - T_1N_3, T_1N_2 - T_2N_1 \\rangle$.",
                    "$\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N} = \\langle T_2N_3 - T_3N_2, T_3N_1 - T_1N_3, T_1N_2 - T_2N_1 \\rangle$。",
                  ),
                ],
                [["Compute each entry", "逐个计算分量"], none, entries.map((e, i) => `${e} = ${ans[i]!.toLatex()}`)],
                [["Collect the entries", "组成向量"], t(`$\\mathbf{B}(${tVal}) = ${v3L(ans)}$.`, `$\\mathbf{B}(${tVal}) = ${v3L(ans)}$。`)],
              ],
              t(
                `$\\mathbf{B} \\cdot \\mathbf{T} = ${dotQ(ans, T).toLatex()}$ and $\\mathbf{B} \\cdot \\mathbf{N} = ${dotQ(ans, N).toLatex()}$, and the squared entries add to $\\frac{${b * b} + ${a * a}}{${c * c}} = 1$.`,
                `$\\mathbf{B} \\cdot \\mathbf{T} = ${dotQ(ans, T).toLatex()}$，$\\mathbf{B} \\cdot \\mathbf{N} = ${dotQ(ans, N).toLatex()}$，且各分量平方和为 $\\frac{${b * b} + ${a * a}}{${c * c}} = 1$。`,
              ),
            ),
          },
          [
            [
              ans.map((x) => x.neg()),
              "That is $\\mathbf{N} \\times \\mathbf{T}$, the order reversed, which gives $-\\mathbf{B}$.",
              "这是 $\\mathbf{N} \\times \\mathbf{T}$，顺序反了，得到 $-\\mathbf{B}$。",
            ],
            [
              [0, 0, 1],
              "The binormal of a helix tilts: it is perpendicular to $\\mathbf{T}$, which climbs.",
              "螺旋线的次法向量是倾斜的：它与正在上升的 $\\mathbf{T}$ 垂直。",
            ],
            [
              [ans[1]!, ans[0]!, ans[2]!],
              "The first two entries are swapped; keep the cross product's entries in order.",
              "前两个分量互换了；叉积的分量要按顺序排列。",
            ],
          ],
        );
      },
    },
    {
      id: "the-binormal-of-a-plane-curve",
      figure: multivariableDrawings1["binormal-vectors#the-binormal-of-a-plane-curve"],
      title: t("The binormal of a plane curve", "平面曲线的副法向量"),
      explanation: t(
        "For a curve lying in a plane, both $\\mathbf{T}$ and $\\mathbf{N}$ lie in that plane, so $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$ is a unit normal to the plane. For a circle in a horizontal plane $z = c$, the right-hand rule decides the sign: traversed counterclockwise when viewed from above, $\\mathbf{B} = \\langle 0, 0, 1 \\rangle$; clockwise, $\\mathbf{B} = \\langle 0, 0, -1 \\rangle$. The radius and the speed do not matter. So $\\langle \\cos t, \\sin t, 7 \\rangle$, counterclockwise, has $\\mathbf{B} = \\langle 0, 0, 1 \\rangle$.\n\n> **Watch out.** $\\mathbf{B}$ is a unit vector: neither the radius nor the height $c$ of the plane appears in it. A minus sign on $\\sin$ reverses the direction of travel, which flips $\\mathbf{B}$.",
        "对位于平面内的曲线，$\\mathbf{T}$ 与 $\\mathbf{N}$ 都在该平面内，所以 $\\mathbf{B} = \\mathbf{T} \\times \\mathbf{N}$ 是该平面的单位法向量。对水平平面 $z = c$ 内的圆，右手法则决定符号：从上方看逆时针运动时 $\\mathbf{B} = \\langle 0, 0, 1 \\rangle$；顺时针时 $\\mathbf{B} = \\langle 0, 0, -1 \\rangle$。半径与速率无关。所以逆时针的 $\\langle \\cos t, \\sin t, 7 \\rangle$ 有 $\\mathbf{B} = \\langle 0, 0, 1 \\rangle$。\n\n> **注意。** $\\mathbf{B}$ 是单位向量：半径和平面的高度 $c$ 都不出现在其中。$\\sin$ 前的负号使运动方向反转，从而使 $\\mathbf{B}$ 反向。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(1, 6);
        const w = rng.int(1, 4);
        const c = rng.int(-5, 5);
        const cw = rng.int(0, 1) === 1;
        const wt = w === 1 ? "t" : `${w}t`;
        const r = R === 1 ? "" : String(R);
        const sg = cw ? -1 : 1;
        const ans = [0, 0, sg];
        const mistakes: Wrong[] = [
          [
            [0, 0, -sg],
            "The direction is reversed: use the right-hand rule with the direction of travel seen from above.",
            "方向反了：按从上方看到的运动方向使用右手法则。",
          ],
          [
            [0, 0, R],
            `$\\mathbf{B}$ is a unit vector; the radius $${R}$ does not appear in it.`,
            `$\\mathbf{B}$ 是单位向量；半径 $${R}$ 不出现在其中。`,
          ],
        ];
        if (Math.abs(c) > 1)
          mistakes.push([
            [0, 0, c],
            `The height $${c}$ of the plane does not appear in $\\mathbf{B}$, a unit vector.`,
            `平面的高度 $${c}$ 不出现在单位向量 $\\mathbf{B}$ 中。`,
          ]);
        return located(
          {
            prompt: t(
              `Find the binormal vector $\\mathbf{B}(t)$ of $\\mathbf{r}(t) = \\langle ${r}\\cos ${wt}, ${cw ? "-" : ""}${r}\\sin ${wt}, ${c} \\rangle$.`,
              `求 $\\mathbf{r}(t) = \\langle ${r}\\cos ${wt}, ${cw ? "-" : ""}${r}\\sin ${wt}, ${c} \\rangle$ 的副法向量 $\\mathbf{B}(t)$。`,
            ),
            answer: ans,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Recognize the plane curve", "识别平面曲线"],
                  t(
                    `The curve is a circle in the plane $z = ${c}$, traversed ${cw ? "clockwise" : "counterclockwise"} seen from above, so $\\mathbf{B}$ is a unit normal of that plane, $\\langle 0, 0, \\pm 1 \\rangle$.`,
                    `该曲线是平面 $z = ${c}$ 内的圆，从上方看${cw ? "顺时针" : "逆时针"}运动，所以 $\\mathbf{B}$ 是该平面的单位法向量 $\\langle 0, 0, \\pm 1 \\rangle$。`,
                  ),
                ],
                [
                  ["Choose the sign", "确定符号"],
                  t(
                    `By the right-hand rule a ${cw ? "clockwise" : "counterclockwise"} turn gives $\\mathbf{B} = ${v3L(ans)}$.`,
                    `由右手法则，${cw ? "顺时针" : "逆时针"}转动给出 $\\mathbf{B} = ${v3L(ans)}$。`,
                  ),
                ],
              ],
              t(
                `At $t = 0$, $\\mathbf{T} = \\langle 0, ${sg}, 0 \\rangle$ and $\\mathbf{N} = \\langle -1, 0, 0 \\rangle$, and $\\mathbf{T} \\times \\mathbf{N} = \\langle 0, 0, 0 \\cdot 0 - ${paren(sg)} \\cdot (-1) \\rangle = ${v3L(ans)}$.`,
                `$t = 0$ 时 $\\mathbf{T} = \\langle 0, ${sg}, 0 \\rangle$，$\\mathbf{N} = \\langle -1, 0, 0 \\rangle$，且 $\\mathbf{T} \\times \\mathbf{N} = \\langle 0, 0, 0 \\cdot 0 - ${paren(sg)} \\cdot (-1) \\rangle = ${v3L(ans)}$。`,
              ),
            ),
          },
          mistakes,
        );
      },
    },
  ],
};

/** theOsculatingPlane finds the Cartesian equation of the osculating plane. */
export const theOsculatingPlane: TopicDef = {
  id: "the-osculating-plane",
  title: t("The Osculating Plane", "密切平面"),
  summary: t(
    "The osculating plane contains the tangent and principal normal vectors and has normal vector B(t).",
    "密切平面包含切向量和主法向量，其法向量为次法向量 B(t)。",
  ),
  intro: t(
    "The circle $\\mathbf{r}(t) = \\langle \\cos t, \\sin t, 2 \\rangle$ lies in the plane $z = 2$. At $t = 0$, $\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 1, 0 \\rangle \\times \\langle -1, 0, 0 \\rangle = \\langle 0, 0, 1 \\rangle$, so the osculating plane through $(1, 0, 2)$ with that normal is $z = 2$.\n\nCheck: the plane contains the point $(1, 0, 2)$ and both directions $\\langle 0, 1, 0 \\rangle$ and $\\langle -1, 0, 0 \\rangle$, whose third entries are $0$.\n\nIn this lesson we find the osculating plane, the plane in which a curve is momentarily moving and turning.",
    "圆 $\\mathbf{r}(t) = \\langle \\cos t, \\sin t, 2 \\rangle$ 位于平面 $z = 2$ 内。$t = 0$ 时 $\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 1, 0 \\rangle \\times \\langle -1, 0, 0 \\rangle = \\langle 0, 0, 1 \\rangle$，所以过 $(1, 0, 2)$、以它为法向量的密切平面是 $z = 2$。\n\n检验：该平面包含点 $(1, 0, 2)$ 以及两个方向 $\\langle 0, 1, 0 \\rangle$ 与 $\\langle -1, 0, 0 \\rangle$，它们的第三个分量都是 $0$。\n\n本课我们求密切平面，即曲线在某一瞬间运动和弯曲所在的平面。",
  ),
  prerequisites: ["binormal-vectors", "the-cartesian-equation-of-a-plane"],
  encompasses: [{ topic: "binormal-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-the-equation-of-the-osculating-plane",
      title: t("Finding the equation of the osculating plane", "求密切平面的方程"),
      explanation: t(
        "The osculating plane to a curve at $\\mathbf{r}(t_0) = (x_0, y_0, z_0)$ is the plane spanned by $\\mathbf{T}(t_0)$ and $\\mathbf{N}(t_0)$. Its normal vector is the binormal vector $\\mathbf{B}(t_0)$, so its Cartesian equation is:\n\n$$B_x (x - x_0) + B_y (y - y_0) + B_z (z - z_0) = 0.$$\n\nAny multiple of $\\mathbf{B}$ works, such as $\\mathbf{r}' \\times \\mathbf{r}''$. For $\\langle 20\\cos t, 20\\sin t, 21t \\rangle$ at $t = 0$, $\\mathbf{r}' \\times \\mathbf{r}'' = 20\\langle 0, -21, 20 \\rangle$ and the point is $(20, 0, 0)$, so the plane is $20z - 21y = 0$.\n\n> **Watch out.** The normal of the osculating plane is $\\mathbf{B}$, not $\\mathbf{N}$: a plane with normal $\\mathbf{N}$, such as $x = x_0$ here, contains $\\mathbf{T}$ and $\\mathbf{B}$ instead. The constant comes from the point $\\mathbf{r}(t_0)$.",
        "曲线在 $\\mathbf{r}(t_0) = (x_0, y_0, z_0)$ 处的密切平面是由 $\\mathbf{T}(t_0)$ 和 $\\mathbf{N}(t_0)$ 张成的平面。其法向量为次法向量 $\\mathbf{B}(t_0)$，故其笛卡尔方程为：\n\n$$B_x (x - x_0) + B_y (y - y_0) + B_z (z - z_0) = 0$$\n\n$\\mathbf{B}$ 的任何倍数都可以，例如 $\\mathbf{r}' \\times \\mathbf{r}''$。对 $\\langle 20\\cos t, 20\\sin t, 21t \\rangle$ 在 $t = 0$ 处，$\\mathbf{r}' \\times \\mathbf{r}'' = 20\\langle 0, -21, 20 \\rangle$，点为 $(20, 0, 0)$，所以平面是 $20z - 21y = 0$。\n\n> **注意。** 密切平面的法向量是 $\\mathbf{B}$，不是 $\\mathbf{N}$：以 $\\mathbf{N}$ 为法向量的平面（这里如 $x = x_0$）包含的是 $\\mathbf{T}$ 和 $\\mathbf{B}$。常数由点 $\\mathbf{r}(t_0)$ 决定。",
      ),
      generate(rng: Rng): Problem {
        const [a, b] = rng.pick(pythagoreanTriples);
        const d = rng.int(-4, 4);
        const rhs = a * d;
        const zTerm = poly([a, "z"], [-b, "y"]);
        const answer = `${zTerm} = ${rhs}`;
        const zComponent = d === 0 ? `${b}t` : poly([b, "t"], [d, ""]);
        const mistakes = [
          say(
            `${poly([b, "z"], [-a, "y"])} = ${b * d}`,
            `The coefficients are swapped: the normal is $\\langle 0, ${-b}, ${a} \\rangle$, with $${-b}$ on $y$ and $${a}$ on $z$.`,
            `系数互换了：法向量是 $\\langle 0, ${-b}, ${a} \\rangle$，$y$ 的系数是 $${-b}$，$z$ 的系数是 $${a}$。`,
          ),
          say(
            `${poly([a, "z"], [b, "y"])} = ${rhs}`,
            `The sign of the $y$ term is wrong: the second entry of $\\mathbf{r}' \\times \\mathbf{r}''$ is $${-a * b}$.`,
            `$y$ 项的符号错了：$\\mathbf{r}' \\times \\mathbf{r}''$ 的第二个分量是 $${-a * b}$。`,
          ),
          say(
            `x = ${a}`,
            "That plane has normal $\\mathbf{N}$ and contains $\\mathbf{T}$ and $\\mathbf{B}$; the osculating plane has normal $\\mathbf{B}$.",
            "这个平面以 $\\mathbf{N}$ 为法向量，包含 $\\mathbf{T}$ 和 $\\mathbf{B}$；密切平面以 $\\mathbf{B}$ 为法向量。",
          ),
          ...(rhs === 0
            ? []
            : [
                say(
                  `${zTerm} = 0`,
                  `The plane must pass through $(${a}, 0, ${d})$; the constant is $${a} \\cdot ${paren(d)} = ${rhs}$.`,
                  `平面必须经过 $(${a}, 0, ${d})$；常数是 $${a} \\cdot ${paren(d)} = ${rhs}$。`,
                ),
              ]),
        ];
        return withMistakes(
          equationProblem({
            prompt: t(
              `Find the equation of the osculating plane to the helix $\\mathbf{r}(t) = \\left\\langle ${a}\\cos t, ${a}\\sin t, ${zComponent} \\right\\rangle$ at $t = 0$.`,
              `求螺旋线 $\\mathbf{r}(t) = \\left\\langle ${a}\\cos t, ${a}\\sin t, ${zComponent} \\right\\rangle$ 在 $t = 0$ 处的密切平面方程。`,
            ),
            answer,
            wrong: mistakes.map((m) => m.response),
            solution: walked(
              [
                [["Find the point", "求点"], t(`$\\mathbf{r}(0) = (${a}, 0, ${d})$.`, `$\\mathbf{r}(0) = (${a}, 0, ${d})$。`)],
                [
                  ["Find a normal", "求法向量"],
                  t(
                    `$\\mathbf{r}'(0) = \\langle 0, ${a}, ${b} \\rangle$ and $\\mathbf{r}''(0) = \\langle -${a}, 0, 0 \\rangle$, so $\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, ${-a * b}, ${a * a} \\rangle = ${a}\\langle 0, ${-b}, ${a} \\rangle$, parallel to $\\mathbf{B}(0)$.`,
                    `$\\mathbf{r}'(0) = \\langle 0, ${a}, ${b} \\rangle$，$\\mathbf{r}''(0) = \\langle -${a}, 0, 0 \\rangle$，所以 $\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, ${-a * b}, ${a * a} \\rangle = ${a}\\langle 0, ${-b}, ${a} \\rangle$，与 $\\mathbf{B}(0)$ 平行。`,
                  ),
                ],
                [
                  ["Write the plane", "写出平面"],
                  t(
                    `$${paren(-b)}(y - 0) + ${a}(z - ${paren(d)}) = 0$, that is, $${answer}$.`,
                    `$${paren(-b)}(y - 0) + ${a}(z - ${paren(d)}) = 0$，即 $${answer}$。`,
                  ),
                ],
              ],
              t(
                `The point $(${a}, 0, ${d})$ gives $${a} \\cdot ${paren(d)} - 0 = ${rhs}$; the tangent direction $\\langle 0, ${a}, ${b} \\rangle$ gives $${a} \\cdot ${b} - ${b} \\cdot ${a} = 0$, and the normal direction $\\langle -1, 0, 0 \\rangle$ gives $0$, so the plane contains the point, $\\mathbf{T}$ and $\\mathbf{N}$.`,
                `点 $(${a}, 0, ${d})$ 给出 $${a} \\cdot ${paren(d)} - 0 = ${rhs}$；切线方向 $\\langle 0, ${a}, ${b} \\rangle$ 给出 $${a} \\cdot ${b} - ${b} \\cdot ${a} = 0$，法线方向 $\\langle -1, 0, 0 \\rangle$ 给出 $0$，所以平面包含该点以及 $\\mathbf{T}$ 和 $\\mathbf{N}$。`,
              ),
            ),
          }),
          mistakes,
        );
      },
    },
    {
      id: "the-osculating-plane-of-a-plane-curve",
      title: t("The osculating plane of a plane curve", "平面曲线的密切平面"),
      explanation: t(
        "The osculating plane at a point contains $\\mathbf{T}$ and $\\mathbf{N}$, the directions in which the curve is moving and turning. If the whole curve lies in a plane, every tangent and normal lies in that plane too, so the osculating plane is the same plane at every point. To find it, look for a linear relation among the coordinates, such as $z = \\alpha x + \\beta y + \\gamma$, that holds for every $t$. For $\\langle t, t^2, 5t + 6t^2 - 7 \\rangle$, substituting $x = t$ and $y = t^2$ gives $z = 5x + 6y - 7$.\n\n> **Watch out.** Match each coefficient to its coordinate: the $t$ term goes with $x = t$ and the $t^2$ term with $y = t^2$. The constant term is $\\gamma$ and keeps its sign.",
        "某点处的密切平面包含 $\\mathbf{T}$ 与 $\\mathbf{N}$，即曲线运动与弯曲的方向。若整条曲线位于一个平面内，每个切向量和法向量也都在其中，所以每点的密切平面都是这个平面。要找到它，就寻找对每个 $t$ 都成立的坐标间的线性关系，如 $z = \\alpha x + \\beta y + \\gamma$。对 $\\langle t, t^2, 5t + 6t^2 - 7 \\rangle$，代入 $x = t$、$y = t^2$ 得 $z = 5x + 6y - 7$。\n\n> **注意。** 每个系数要对应到它的坐标：$t$ 项对应 $x = t$，$t^2$ 项对应 $y = t^2$。常数项就是 $\\gamma$，符号保持不变。",
      ),
      generate(rng: Rng): Problem {
        const al = rng.nonZero(-4, 4);
        const be = rng.nonZero(-4, 4);
        const ga = rng.int(-5, 5);
        const z = poly([al, "t"], [be, "t^2"], [ga, ""]);
        const plane = poly([al, "x"], [be, "y"], [ga, ""]);
        return located(
          {
            prompt: t(
              `The osculating plane of $\\mathbf{r}(t) = \\langle t, t^2, ${z} \\rangle$ is the same at every point and has the form $z = \\alpha x + \\beta y + \\gamma$. Enter $(\\alpha, \\beta, \\gamma)$.`,
              `$\\mathbf{r}(t) = \\langle t, t^2, ${z} \\rangle$ 的密切平面在每点都相同，形如 $z = \\alpha x + \\beta y + \\gamma$。输入 $(\\alpha, \\beta, \\gamma)$。`,
            ),
            answer: [al, be, ga],
            vars: ["\\alpha", "\\beta", "\\gamma"],
            solution: walked(
              [
                [
                  ["Write $z$ in terms of $x$ and $y$", "用 $x$、$y$ 表示 $z$"],
                  t(
                    `With $x = t$ and $y = t^2$, $z = ${z} = ${plane}$ for every $t$.`,
                    `由 $x = t$，$y = t^2$，对每个 $t$ 有 $z = ${z} = ${plane}$。`,
                  ),
                ],
                [
                  ["Read off the plane", "读出平面"],
                  t(
                    `The whole curve lies in the plane $z = ${plane}$, so that is the osculating plane at every point: $(\\alpha, \\beta, \\gamma) = (${al}, ${be}, ${ga})$.`,
                    `整条曲线位于平面 $z = ${plane}$ 内，所以它是每点处的密切平面：$(\\alpha, \\beta, \\gamma) = (${al}, ${be}, ${ga})$。`,
                  ),
                ],
              ],
              t(
                `At $t = 2$ the curve is at $(2, 4, ${2 * al + 4 * be + ga})$, and $${al} \\cdot 2 + ${paren(be)} \\cdot 4 + ${paren(ga)} = ${2 * al + 4 * be + ga}$, so the point lies in the plane.`,
                `$t = 2$ 时曲线位于 $(2, 4, ${2 * al + 4 * be + ga})$，而 $${al} \\cdot 2 + ${paren(be)} \\cdot 4 + ${paren(ga)} = ${2 * al + 4 * be + ga}$，所以该点在平面内。`,
              ),
            ),
          },
          [
            [
              [be, al, ga],
              "$\\alpha$ and $\\beta$ are swapped: the $t$ term goes with $x = t$, the $t^2$ term with $y = t^2$.",
              "$\\alpha$ 与 $\\beta$ 互换了：$t$ 项对应 $x = t$，$t^2$ 项对应 $y = t^2$。",
            ],
            [[al, be, 0], `The constant term $${ga}$ is $\\gamma$; it cannot be dropped.`, `常数项 $${ga}$ 就是 $\\gamma$；不能丢掉。`],
            [
              [-al, -be, -ga],
              "The signs are flipped: the plane is $z = \\alpha x + \\beta y + \\gamma$, with $z$ alone on the left.",
              "符号反了：平面是 $z = \\alpha x + \\beta y + \\gamma$，左边只有 $z$。",
            ],
          ],
        );
      },
    },
  ],
};

/** parameterizationByArcLength reparameterizes curves with respect to arc length s. */
export const parameterizationByArcLength: TopicDef = {
  id: "parameterization-by-arc-length",
  title: t("Parameterization by Arc Length", "弧长参数化"),
  summary: t(
    "Reparameterizing a curve by arc length s yields a natural parameterization with unit speed: ||r'(s)|| = 1.",
    "用弧长 s 对曲线重新参数化可得到自然参数化，其速率为单位长度：||r'(s)|| = 1。",
  ),
  intro: t(
    "$\\mathbf{r}(t) = \\langle 3t, 4t \\rangle$ moves at speed $5$, so after time $t$ it has travelled $s = 5t$. Solving, $t = \\frac{s}{5}$ and $\\mathbf{r}(s) = \\left\\langle \\frac{3s}{5}, \\frac{4s}{5} \\right\\rangle$; the point at arc length $10$ is $(6, 8)$.\n\nCheck: the distance from the origin to $(6, 8)$ is $\\sqrt{36 + 64} = 10$, and $\\left\\|\\left\\langle \\frac{3}{5}, \\frac{4}{5} \\right\\rangle\\right\\| = 1$, so the new parameterization has unit speed.\n\nIn this lesson we reparameterize curves by arc length and find the point a given distance along a curve.",
    "$\\mathbf{r}(t) = \\langle 3t, 4t \\rangle$ 以速率 $5$ 运动，所以经过时间 $t$ 走过 $s = 5t$。解得 $t = \\frac{s}{5}$，$\\mathbf{r}(s) = \\left\\langle \\frac{3s}{5}, \\frac{4s}{5} \\right\\rangle$；弧长为 $10$ 处的点是 $(6, 8)$。\n\n检验：原点到 $(6, 8)$ 的距离是 $\\sqrt{36 + 64} = 10$，且 $\\left\\|\\left\\langle \\frac{3}{5}, \\frac{4}{5} \\right\\rangle\\right\\| = 1$，所以新的参数化速率为 1。\n\n本课我们按弧长重新参数化曲线，并求沿曲线走过给定距离处的点。",
  ),
  prerequisites: ["the-arc-length-of-a-vector-valued-function"],
  encompasses: [{ topic: "the-arc-length-of-a-vector-valued-function", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "reparameterizing-curves-by-arc-length",
      figure: multivariableDrawings1["parameterization-by-arc-length#reparameterizing-curves-by-arc-length"],
      title: t("Reparameterizing curves by arc length", "按弧长重新参数化曲线"),
      explanation: t(
        "The arc length function starting from $t = 0$ is $s(t) = \\int_0^t \\|\\mathbf{r}'(u)\\|\\,du$. If the speed is a constant $c$, then $s = ct$, which inverts to $t = \\frac{s}{c}$. Substituting $t(s)$ gives the arc length parameterization $\\mathbf{r}(s)$. For $\\langle 20\\cos t, 20\\sin t, 21t \\rangle$ the speed is $29$, so arc length $58$ is reached at $t = 2$.\n\n> **Watch out.** $s = ct$ is undone by dividing by the speed, not multiplying. And $s$ and $t$ agree only when the speed is $1$.",
        "以 $t = 0$ 为基准的弧长函数为 $s(t) = \\int_0^t \\|\\mathbf{r}'(u)\\|\\,du$。若速率为常数 $c$，则 $s = ct$，反解得 $t = \\frac{s}{c}$。代入 $t(s)$ 即可得到弧长参数化 $\\mathbf{r}(s)$。对 $\\langle 20\\cos t, 20\\sin t, 21t \\rangle$，速率为 $29$，所以弧长 $58$ 在 $t = 2$ 时达到。\n\n> **注意。** 要用除以速率来还原 $s = ct$，不是乘以速率。只有速率为 $1$ 时 $s$ 与 $t$ 才相同。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c] = rng.pick(pythagoreanTriples);
        const t0 = rng.int(2, 7);
        const sVal = c * t0;
        return numberProblem({
          prompt: t(
            `If the circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ is parameterized by arc length $s$ starting from $t = 0$, what is the parameter value $t$ when the arc length is $s = ${sVal}$?`,
            `若把圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 以 $t = 0$ 为起点按弧长 $s$ 进行参数化，当弧长 $s = ${sVal}$ 时对应的参数 $t$ 为多少？`,
          ),
          answer: t0,
          mistakes: distinct(t0, [
            why(
              sVal * c,
              `$s = ${c}t$ is undone by dividing by the speed $${c}$, not multiplying.`,
              `$s = ${c}t$ 要除以速率 $${c}$ 来还原，不是乘以它。`,
            ),
            why(
              sVal,
              `$s$ and $t$ agree only at speed $1$; this helix moves at speed $${c}$.`,
              `只有速率为 $1$ 时 $s$ 与 $t$ 才相同；这条螺旋线的速率是 $${c}$。`,
            ),
            why(
              sVal - c,
              `The relation is $s = ${c}t$, a product, so divide by $${c}$; subtracting it does not undo a product.`,
              `关系是乘积 $s = ${c}t$，所以要除以 $${c}$；减去它不能还原乘积。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the speed", "求速率"],
                t(
                  `$\\|\\mathbf{r}'(t)\\| = \\sqrt{${a}^2 + ${b}^2} = ${c}$, a constant, so $s(t) = \\int_0^t ${c}\\,du = ${c}t$.`,
                  `$\\|\\mathbf{r}'(t)\\| = \\sqrt{${a}^2 + ${b}^2} = ${c}$，是常数，所以 $s(t) = \\int_0^t ${c}\\,du = ${c}t$。`,
                ),
              ],
              [
                ["Invert", "反解"],
                t(
                  `$t = \\frac{s}{${c}}$, so for $s = ${sVal}$, $t = \\frac{${sVal}}{${c}} = ${t0}$.`,
                  `$t = \\frac{s}{${c}}$，所以 $s = ${sVal}$ 时 $t = \\frac{${sVal}}{${c}} = ${t0}$。`,
                ),
              ],
            ],
            t(
              `Going forward, at $t = ${t0}$ the helix has travelled $${c} \\cdot ${t0} = ${sVal}$.`,
              `反过来算，$t = ${t0}$ 时螺旋线走过 $${c} \\cdot ${t0} = ${sVal}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-point-at-a-given-arc-length-along-a-line",
      figure: multivariableDrawings1["parameterization-by-arc-length#a-point-at-a-given-arc-length-along-a-line"],
      title: t("The point at a given arc length along a line", "直线上给定弧长处的点"),
      explanation: t(
        "A line $\\mathbf{r}(t) = P + t\\mathbf{v}$ has constant speed $\\|\\mathbf{v}\\|$, so the arc length from $t = 0$ is $s = \\|\\mathbf{v}\\|t$. Solving $t = s/\\|\\mathbf{v}\\|$ gives the arc length parametrization\n\n$$\\mathbf{r}(s) = P + \\frac{s}{\\|\\mathbf{v}\\|}\\mathbf{v},$$\n\nwhich moves at unit speed. The point at arc length $s$ is $P$ plus $s$ times the unit vector in the direction of $\\mathbf{v}$. From $P = (1, 0, 0)$ along $\\mathbf{v} = \\langle 3, 4, 12 \\rangle$, of length $13$, arc length $26$ is reached at $t = 2$, at $(7, 8, 24)$.\n\n> **Watch out.** Divide $s$ by $\\|\\mathbf{v}\\|$ before stepping along $\\mathbf{v}$: using $s$ as $t$ goes too far unless $\\mathbf{v}$ is a unit vector. And start from $P$, not from the origin.",
        "直线 $\\mathbf{r}(t) = P + t\\mathbf{v}$ 速率恒为 $\\|\\mathbf{v}\\|$，所以从 $t = 0$ 起的弧长为 $s = \\|\\mathbf{v}\\|t$。解出 $t = s/\\|\\mathbf{v}\\|$ 得弧长参数化\n\n$$\\mathbf{r}(s) = P + \\frac{s}{\\|\\mathbf{v}\\|}\\mathbf{v},$$\n\n它以单位速率运动。弧长 $s$ 处的点是 $P$ 加上 $s$ 乘以 $\\mathbf{v}$ 方向的单位向量。从 $P = (1, 0, 0)$ 沿长度为 $13$ 的 $\\mathbf{v} = \\langle 3, 4, 12 \\rangle$ 出发，弧长 $26$ 在 $t = 2$ 时达到，位于 $(7, 8, 24)$。\n\n> **注意。** 沿 $\\mathbf{v}$ 前进之前先把 $s$ 除以 $\\|\\mathbf{v}\\|$：除非 $\\mathbf{v}$ 是单位向量，否则把 $s$ 当作 $t$ 会走过头。而且要从 $P$ 出发，不是从原点出发。",
      ),
      generate(rng: Rng): Problem {
        const [a, b, c, n] = rng.pick([
          [1, 2, 2, 3],
          [2, 3, 6, 7],
          [1, 4, 8, 9],
          [4, 4, 7, 9],
          [2, 6, 9, 11],
        ] as const);
        const sg = [rng.pick([1, -1]), rng.pick([1, -1]), rng.pick([1, -1])];
        const v: Vec3 = [sg[0]! * a, sg[1]! * b, sg[2]! * c];
        const P: Vec3 = [rng.int(-4, 4), rng.int(-4, 4), rng.int(-4, 4)];
        const s = n * rng.int(1, 3);
        const k = s / n;
        const kv = [k * v[0], k * v[1], k * v[2]];
        const ans = [P[0] + kv[0]!, P[1] + kv[1]!, P[2] + kv[2]!];
        return located(
          {
            prompt: t(
              `Starting at $t = 0$, find the point at arc length $${s}$ along $\\mathbf{r}(t) = ${v3L(P)} + t${v3L(v)}$, $t \\ge 0$.`,
              `从 $t = 0$ 开始，求沿 $\\mathbf{r}(t) = ${v3L(P)} + t${v3L(v)}$（$t \\ge 0$）弧长为 $${s}$ 处的点。`,
            ),
            answer: ans,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Find the speed", "求速率"],
                  t(
                    `$\\|\\mathbf{v}\\| = \\sqrt{${a * a} + ${b * b} + ${c * c}} = ${n}$, so $s = ${n}t$.`,
                    `$\\|\\mathbf{v}\\| = \\sqrt{${a * a} + ${b * b} + ${c * c}} = ${n}$，所以 $s = ${n}t$。`,
                  ),
                ],
                [["Find the parameter", "求参数"], t(`$t = \\frac{${s}}{${n}} = ${k}$.`, `$t = \\frac{${s}}{${n}} = ${k}$。`)],
                [
                  ["Substitute", "代入"],
                  t(
                    `$\\mathbf{r}(${k}) = ${v3L(P)} + ${v3L(kv)} = ${v3L(ans)}$, the point $${pointLatex(ans)}$.`,
                    `$\\mathbf{r}(${k}) = ${v3L(P)} + ${v3L(kv)} = ${v3L(ans)}$，即点 $${pointLatex(ans)}$。`,
                  ),
                ],
              ],
              t(
                `The distance from $${pointLatex(P)}$ to $${pointLatex(ans)}$ is $\\sqrt{${kv[0]! ** 2} + ${kv[1]! ** 2} + ${kv[2]! ** 2}} = ${s}$, the required arc length.`,
                `从 $${pointLatex(P)}$ 到 $${pointLatex(ans)}$ 的距离是 $\\sqrt{${kv[0]! ** 2} + ${kv[1]! ** 2} + ${kv[2]! ** 2}} = ${s}$，正是要求的弧长。`,
              ),
            ),
          },
          [
            [
              [P[0] + s * v[0], P[1] + s * v[1], P[2] + s * v[2]],
              `That uses $t = ${s}$; the speed is $${n}$, so arc length $${s}$ is reached at $t = ${k}$.`,
              `这用了 $t = ${s}$；速率是 $${n}$，所以弧长 $${s}$ 在 $t = ${k}$ 时达到。`,
            ],
            [
              kv,
              `That is the displacement $${k}\\mathbf{v}$ alone; start from $P = ${pointLatex(P)}$.`,
              `这只是位移 $${k}\\mathbf{v}$；要从 $P = ${pointLatex(P)}$ 出发。`,
            ],
            [
              [P[0] - kv[0]!, P[1] - kv[1]!, P[2] - kv[2]!],
              "That steps backwards; for $t \\ge 0$ the point moves in the direction of $\\mathbf{v}$.",
              "这是反向走的；$t \\ge 0$ 时点沿 $\\mathbf{v}$ 的方向运动。",
            ],
          ],
        );
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.2 Curvature
// ---------------------------------------------------------------------------

/** introductionToCurvature defines curvature κ = ||dT/ds||. */
export const introductionToCurvature: TopicDef = {
  id: "introduction-to-curvature",
  title: t("Introduction to Curvature", "曲率简介"),
  summary: t(
    "Curvature κ = ||dT/ds|| measures the rate at which the unit tangent vector turns per unit of arc length.",
    "曲率 κ = ||dT/ds|| 度量单位切向量随弧长转动的速率。",
  ),
  intro: t(
    "On the circle $\\mathbf{r}(t) = \\langle 4\\cos t, 4\\sin t \\rangle$ the unit tangent is $\\mathbf{T} = \\langle -\\sin t, \\cos t \\rangle$, so $\\|\\mathbf{T}'\\| = 1$, while the speed is $4$. The tangent turns $1$ radian per unit of $t$ while the point travels $4$, so $\\kappa = \\frac{1}{4}$.\n\nCheck: in one lap the tangent turns through $2\\pi$ over a distance of $8\\pi$, and $\\frac{2\\pi}{8\\pi} = \\frac{1}{4}$.\n\nIn this lesson we measure curvature, how fast the direction of a curve turns per unit of distance.",
    "在圆 $\\mathbf{r}(t) = \\langle 4\\cos t, 4\\sin t \\rangle$ 上，单位切向量为 $\\mathbf{T} = \\langle -\\sin t, \\cos t \\rangle$，所以 $\\|\\mathbf{T}'\\| = 1$，而速率为 $4$。每单位 $t$ 切向转过 $1$ 弧度，点走过 $4$，所以 $\\kappa = \\frac{1}{4}$。\n\n检验：一圈中切向转过 $2\\pi$，走过的距离是 $8\\pi$，而 $\\frac{2\\pi}{8\\pi} = \\frac{1}{4}$。\n\n本课我们度量曲率，即曲线方向每单位距离转动的快慢。",
  ),
  prerequisites: ["unit-tangent-vectors", "the-arc-length-of-a-vector-valued-function"],
  encompasses: [{ topic: "unit-tangent-vectors", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "defining-and-calculating-curvature",
      title: t("Defining and calculating curvature", "曲率的定义与计算"),
      explanation: t(
        "Curvature $\\kappa$ measures how quickly a curve changes direction. In terms of parameter $t$:\n\n$$\\kappa = \\frac{\\|\\mathbf{T}'(t)\\|}{\\|\\mathbf{r}'(t)\\|}.$$ For a circular helix $\\mathbf{r}(t) = \\langle a\\cos t, a\\sin t, bt \\rangle$, the curvature is constant: $\\kappa = \\frac{a}{a^2 + b^2}$. So $\\langle \\cos t, \\sin t, t \\rangle$ has $\\kappa = \\frac{1}{2}$.\n\n> **Watch out.** $\\|\\mathbf{T}'\\|$ alone is the turning per unit of $t$; divide by the speed to get the turning per unit of length. The climb $b$ spreads the turn out, so a helix bends less than the circle of radius $a$: $\\kappa < \\frac{1}{a}$.",
        "曲率 $\\kappa$ 度量曲线改变方向的快慢。用参数 $t$ 表示为：\n\n$$\\kappa = \\frac{\\|\\mathbf{T}'(t)\\|}{\\|\\mathbf{r}'(t)\\|}$$ 对于圆柱螺旋线 $\\mathbf{r}(t) = \\langle a\\cos t, a\\sin t, bt \\rangle$，其曲率为常数：$\\kappa = \\frac{a}{a^2 + b^2}$。所以 $\\langle \\cos t, \\sin t, t \\rangle$ 的 $\\kappa = \\frac{1}{2}$。\n\n> **注意。** $\\|\\mathbf{T}'\\|$ 本身只是每单位 $t$ 的转动；要除以速率才得到每单位长度的转动。上升量 $b$ 把转弯拉长，所以螺旋线比半径为 $a$ 的圆弯得少：$\\kappa < \\frac{1}{a}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 10);
        const b = rng.int(1, 10);
        const sumSq = a * a + b * b;
        const ans = Q.of(a, sumSq);
        const root = `\\sqrt{${sumSq}}`;
        return numberProblem({
          prompt: t(
            `Find the curvature $\\kappa$ of the circular helix $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$.`,
            `求圆柱螺旋线 $\\mathbf{r}(t) = \\langle ${a}\\cos t, ${a}\\sin t, ${b}t \\rangle$ 的曲率 $\\kappa$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(1, a),
              `That is the curvature of the circle of radius $${a}$; the climb $${b}t$ makes the helix bend less.`,
              `这是半径为 $${a}$ 的圆的曲率；上升项 $${b}t$ 使螺旋线弯得更少。`,
            ),
            why(
              Q.of(b, sumSq),
              `The numerator is the radius $${a}$, which comes from $\\|\\mathbf{T}'\\|$, not the climb $${b}$.`,
              `分子是半径 $${a}$，它来自 $\\|\\mathbf{T}'\\|$，不是上升量 $${b}$。`,
            ),
            why(
              Q.of(1, sumSq),
              `$\\|\\mathbf{T}'\\| = \\frac{${a}}{${root}}$, not $\\frac{1}{${root}}$: the factor $${a}$ stays.`,
              `$\\|\\mathbf{T}'\\| = \\frac{${a}}{${root}}$，不是 $\\frac{1}{${root}}$：因子 $${a}$ 要保留。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the speed and the unit tangent", "求速率与单位切向量"],
                t(
                  `$\\|\\mathbf{r}'(t)\\| = \\sqrt{${a}^2 + ${b}^2} = ${root}$, so $\\mathbf{T}(t) = \\frac{1}{${root}}\\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$.`,
                  `$\\|\\mathbf{r}'(t)\\| = \\sqrt{${a}^2 + ${b}^2} = ${root}$，所以 $\\mathbf{T}(t) = \\frac{1}{${root}}\\langle -${a}\\sin t, ${a}\\cos t, ${b} \\rangle$。`,
                ),
              ],
              [
                ["Differentiate $\\mathbf{T}$", "对 $\\mathbf{T}$ 求导"],
                t(
                  `$\\mathbf{T}'(t) = \\frac{1}{${root}}\\langle -${a}\\cos t, -${a}\\sin t, 0 \\rangle$, with length $\\frac{${a}}{${root}}$.`,
                  `$\\mathbf{T}'(t) = \\frac{1}{${root}}\\langle -${a}\\cos t, -${a}\\sin t, 0 \\rangle$，长度为 $\\frac{${a}}{${root}}$。`,
                ),
              ],
              [
                ["Divide by the speed", "除以速率"],
                t(
                  `$\\kappa = \\frac{${a}/${root}}{${root}} = \\frac{${a}}{${sumSq}}${ans.d === BigInt(sumSq) ? "" : ` = ${ans.toLatex()}`}$.`,
                  `$\\kappa = \\frac{${a}/${root}}{${root}} = \\frac{${a}}{${sumSq}}${ans.d === BigInt(sumSq) ? "" : ` = ${ans.toLatex()}`}$。`,
                ),
              ],
            ],
            t(
              `With no climb, $b = 0$, the formula would give $\\frac{${a}}{${a * a}} = \\frac{1}{${a}}$, the curvature of the circle of radius $${a}$; the climb makes $\\kappa$ smaller than that, as $\\frac{${a}}{${sumSq}} < \\frac{1}{${a}}$.`,
              `若没有上升，$b = 0$，公式给出 $\\frac{${a}}{${a * a}} = \\frac{1}{${a}}$，即半径为 $${a}$ 的圆的曲率；上升使 $\\kappa$ 比它小，确有 $\\frac{${a}}{${sumSq}} < \\frac{1}{${a}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-curvature-of-a-circle-is-the-reciprocal-of-its-radius",
      figure: multivariableDrawings1["introduction-to-curvature#the-curvature-of-a-circle-is-the-reciprocal-of-its-radius"],
      title: t("The curvature of a circle", "圆的曲率"),
      explanation: t(
        "Curvature $\\kappa = \\left\\|\\frac{d\\mathbf{T}}{ds}\\right\\|$ measures how fast the direction turns per unit of distance travelled. Around a circle of radius $R$ the tangent turns through $2\\pi$ while the point travels $2\\pi R$, at a steady rate, so\n\n$$\\kappa = \\frac{2\\pi}{2\\pi R} = \\frac{1}{R}.$$\n\nThe parametrization's speed and the circle's center do not affect $\\kappa$, because curvature is measured per unit arc length. A circle of radius $10$ has $\\kappa = \\frac{1}{10}$.\n\n> **Watch out.** Curvature is $\\frac{1}{R}$, not $R$: a smaller circle bends more. Going around faster, as with $\\cos 3t$, changes the turning per unit of time but not per unit of length.",
        "曲率 $\\kappa = \\left\\|\\frac{d\\mathbf{T}}{ds}\\right\\|$ 衡量每走过单位距离方向转动多快。绕半径为 $R$ 的圆一周，切向转过 $2\\pi$，而点走过 $2\\pi R$，且速率均匀，所以\n\n$$\\kappa = \\frac{2\\pi}{2\\pi R} = \\frac{1}{R}$$\n\n参数化的速率和圆心位置都不影响 $\\kappa$，因为曲率是按单位弧长度量的。半径为 $10$ 的圆有 $\\kappa = \\frac{1}{10}$。\n\n> **注意。** 曲率是 $\\frac{1}{R}$，不是 $R$：圆越小弯得越厉害。转得更快（如 $\\cos 3t$）会改变每单位时间的转动，但不改变每单位长度的转动。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 9);
        const w = rng.int(1, 5);
        const h = rng.int(-4, 4);
        const wt = w === 1 ? "t" : `${w}t`;
        const ans = Q.of(1, R);
        const shift = h === 0 ? "" : h > 0 ? ` + ${h}` : ` - ${-h}`;
        return numberProblem({
          prompt: t(
            `Find the curvature of $\\mathbf{r}(t) = \\langle ${R}\\cos ${wt}${shift}, ${R}\\sin ${wt} \\rangle$.`,
            `求 $\\mathbf{r}(t) = \\langle ${R}\\cos ${wt}${shift}, ${R}\\sin ${wt} \\rangle$ 的曲率。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(w, R),
              `The speed is $${R * w}$, not $${R}$: the factor $${w}$ in $${wt}$ multiplies the speed too, and it cancels.`,
              `速率是 $${R * w}$，不是 $${R}$：$${wt}$ 中的因子 $${w}$ 也乘进速率，并且会约去。`,
            ),
            why(
              Q.of(R),
              "That is the radius; curvature is its reciprocal, and a larger circle bends less.",
              "这是半径；曲率是它的倒数，圆越大弯得越少。",
            ),
            why(
              Q.of(1, R * w),
              `$\\|\\mathbf{T}'\\| = ${w}$, not $1$: the tangent turns $${w}$ radians per unit of $t$.`,
              `$\\|\\mathbf{T}'\\| = ${w}$，不是 $1$：每单位 $t$ 切向转过 $${w}$ 弧度。`,
            ),
            why(Q.of(1, R * R), "Curvature is $\\frac{1}{R}$, not $\\frac{1}{R^2}$.", "曲率是 $\\frac{1}{R}$，不是 $\\frac{1}{R^2}$。"),
          ]),
          solution: walked(
            [
              [
                ["Recognize the circle", "识别圆"],
                t(
                  `$\\mathbf{r}$ traces the circle of radius $${R}$ centered at $(${h}, 0)$, at speed $\\|\\mathbf{r}'\\| = ${R * w}$.`,
                  `$\\mathbf{r}$ 以速率 $\\|\\mathbf{r}'\\| = ${R * w}$ 描出圆心为 $(${h}, 0)$、半径为 $${R}$ 的圆。`,
                ),
              ],
              [
                ["Use $\\kappa = \\frac{1}{R}$", "用 $\\kappa = \\frac{1}{R}$"],
                t(
                  `Curvature does not depend on the speed or the center, so $\\kappa = \\frac{1}{${R}}$.`,
                  `曲率与速率、圆心都无关，所以 $\\kappa = \\frac{1}{${R}}$。`,
                ),
              ],
            ],
            t(
              `$\\mathbf{T} = \\langle -\\sin ${wt}, \\cos ${wt} \\rangle$ has $\\|\\mathbf{T}'\\| = ${w}$, and $\\frac{\\|\\mathbf{T}'\\|}{\\|\\mathbf{r}'\\|} = \\frac{${w}}{${R * w}} = \\frac{1}{${R}}$.`,
              `$\\mathbf{T} = \\langle -\\sin ${wt}, \\cos ${wt} \\rangle$ 的 $\\|\\mathbf{T}'\\| = ${w}$，且 $\\frac{\\|\\mathbf{T}'\\|}{\\|\\mathbf{r}'\\|} = \\frac{${w}}{${R * w}} = \\frac{1}{${R}}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** findingCurvatureUsingTheCrossProduct computes curvature using the cross product formula. */
export const findingCurvatureUsingTheCrossProduct: TopicDef = {
  id: "finding-curvature-using-the-cross-product",
  title: t("Finding Curvature Using the Cross Product", "利用叉积求曲率"),
  summary: t(
    "The curvature of a space curve is $\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}$.",
    "空间曲线的曲率为 $\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}$。",
  ),
  intro: t(
    "For $\\mathbf{r}(t) = \\langle t, t^2, 0 \\rangle$ at $t = 0$: $\\mathbf{r}'(0) = \\langle 1, 0, 0 \\rangle$ and $\\mathbf{r}''(0) = \\langle 0, 2, 0 \\rangle$, so $\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 0, 2 \\rangle$ and $\\kappa(0) = \\frac{2}{1^3} = 2$.\n\nCheck: near its vertex the parabola $y = x^2$ hugs a circle of radius $\\rho$, which near its lowest point looks like $y \\approx \\frac{x^2}{2\\rho}$; matching gives $\\rho = \\frac{1}{2}$, and $\\frac{1}{\\rho} = 2$.\n\nIn this lesson we compute curvature from the first two derivatives with the cross product formula.",
    "对 $\\mathbf{r}(t) = \\langle t, t^2, 0 \\rangle$ 在 $t = 0$ 处：$\\mathbf{r}'(0) = \\langle 1, 0, 0 \\rangle$，$\\mathbf{r}''(0) = \\langle 0, 2, 0 \\rangle$，所以 $\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 0, 2 \\rangle$，$\\kappa(0) = \\frac{2}{1^3} = 2$。\n\n检验：抛物线 $y = x^2$ 在顶点附近贴近半径为 $\\rho$ 的圆，而这个圆在最低点附近近似为 $y \\approx \\frac{x^2}{2\\rho}$；比较得 $\\rho = \\frac{1}{2}$，而 $\\frac{1}{\\rho} = 2$。\n\n本课我们用叉积公式由前两阶导数计算曲率。",
  ),
  prerequisites: ["introduction-to-curvature", "the-cross-product-of-two-vectors"],
  encompasses: [{ topic: "introduction-to-curvature", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-curvature-via-cross-product",
      title: t("Computing curvature via cross product", "通过叉积计算曲率"),
      explanation: t(
        "Curvature measures how quickly the direction of the curve turns, and the cross product of velocity and acceleration captures that turning without normalizing first. For any smooth three-dimensional curve $\\mathbf{r}(t)$, the curvature can be computed directly without finding $\\mathbf{T}(t)$:\n\n$$\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}.$$\n\nFor $\\langle t, 9t^2, t^3 \\rangle$ at $t = 0$, $\\mathbf{r}' = \\langle 1, 0, 0 \\rangle$ and $\\mathbf{r}'' = \\langle 0, 18, 0 \\rangle$, so $\\kappa(0) = 18$.\n\n> **Watch out.** Differentiating $at^2$ twice gives $2a$, not $a$. The denominator is the cube of the speed, and a $t^3$ term contributes nothing at $t = 0$, where its first and second derivatives vanish.",
        "曲率衡量曲线方向转动的快慢，速度与加速度的叉积不必先单位化就能反映这种转动。对于任意光滑三维空间曲线 $\\mathbf{r}(t)$，无需先求出 $\\mathbf{T}(t)$，可直接利用叉积公式计算曲率：\n\n$$\\kappa(t) = \\frac{\\|\\mathbf{r}'(t) \\times \\mathbf{r}''(t)\\|}{\\|\\mathbf{r}'(t)\\|^3}$$\n\n对 $\\langle t, 9t^2, t^3 \\rangle$ 在 $t = 0$ 处，$\\mathbf{r}' = \\langle 1, 0, 0 \\rangle$，$\\mathbf{r}'' = \\langle 0, 18, 0 \\rangle$，所以 $\\kappa(0) = 18$。\n\n> **注意。** $at^2$ 求两次导得 $2a$，不是 $a$。分母是速率的立方，而 $t^3$ 项在 $t = 0$ 处毫无贡献，那里它的一阶、二阶导数都为零。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const b = rng.int(1, 5);
        const ans = 2 * a;
        return numberProblem({
          prompt: t(
            `Use the cross product formula to find the curvature $\\kappa(0)$ of the curve $\\mathbf{r}(t) = \\left\\langle t, ${poly([a, "t^2"])}, ${poly([b, "t^3"])} \\right\\rangle$ at $t = 0$.`,
            `使用叉积公式求曲线 $\\mathbf{r}(t) = \\left\\langle t, ${poly([a, "t^2"])}, ${poly([b, "t^3"])} \\right\\rangle$ 在 $t = 0$ 处的曲率 $\\kappa(0)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a,
              `The second derivative of $${poly([a, "t^2"])}$ is $${2 * a}$, not $${a}$.`,
              `$${poly([a, "t^2"])}$ 的二阶导数是 $${2 * a}$，不是 $${a}$。`,
            ),
            why(
              4 * a,
              "The cross product has length $2a$ and the speed is $1$; nothing doubles it again.",
              "叉积长度为 $2a$，速率为 $1$；没有再翻倍的因素。",
            ),
            why(
              6 * b,
              `At $t = 0$ the $t^3$ term has $\\mathbf{r}''$ entry $${6 * b}t = 0$; it contributes nothing there.`,
              `$t = 0$ 时 $t^3$ 项在 $\\mathbf{r}''$ 中的分量 $${6 * b}t = 0$；它在那里毫无贡献。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate twice", "求两阶导数"],
                none,
                [
                  `\\mathbf{r}'(t) = \\langle 1, ${2 * a}t, ${3 * b}t^2 \\rangle, \\quad \\mathbf{r}'(0) = \\langle 1, 0, 0 \\rangle`,
                  `\\mathbf{r}''(t) = \\langle 0, ${2 * a}, ${6 * b}t \\rangle, \\quad \\mathbf{r}''(0) = \\langle 0, ${2 * a}, 0 \\rangle`,
                ],
              ],
              [
                ["Take the cross product", "求叉积"],
                t(
                  `$\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 0, ${2 * a} \\rangle$, of length $${2 * a}$, and $\\|\\mathbf{r}'(0)\\| = 1$.`,
                  `$\\mathbf{r}'(0) \\times \\mathbf{r}''(0) = \\langle 0, 0, ${2 * a} \\rangle$，长度为 $${2 * a}$，且 $\\|\\mathbf{r}'(0)\\| = 1$。`,
                ),
              ],
              [
                ["Apply the formula", "代入公式"],
                t(`$\\kappa(0) = \\frac{${2 * a}}{1^3} = ${ans}$.`, `$\\kappa(0) = \\frac{${2 * a}}{1^3} = ${ans}$。`),
              ],
            ],
            t(
              `Near $t = 0$ the curve's shadow in the $xy$-plane is $y = ${poly([a, "x^2"])}$, which hugs a circle of radius $\\rho$ shaped like $y \\approx \\frac{x^2}{2\\rho}$; so $\\rho = \\frac{1}{${2 * a}}$ and $\\kappa = ${ans}$.`,
              `在 $t = 0$ 附近，曲线在 $xy$ 平面上的投影是 $y = ${poly([a, "x^2"])}$，它贴近形如 $y \\approx \\frac{x^2}{2\\rho}$ 的半径为 $\\rho$ 的圆；所以 $\\rho = \\frac{1}{${2 * a}}$，$\\kappa = ${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "curvature-of-a-cubic-space-curve-by-the-cross-product",
      figure: multivariableDrawings1["finding-curvature-using-the-cross-product#curvature-of-a-cubic-space-curve-by-the-cross-product"],
      title: t("Curvature of a cubic space curve", "三次空间曲线的曲率"),
      explanation: t(
        "The cross product formula $\\kappa = \\frac{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}{\\|\\mathbf{r}'\\|^3}$ works for any parametrization, so there is no need to reparametrize by arc length first. Compute the first two derivatives, take their cross product, and divide its length by the cube of the speed. For $\\mathbf{r}(t) = \\langle 2at, at^2, \\frac{a}{3}t^3 \\rangle$, $\\mathbf{r}' = a\\langle 2, 2t, t^2 \\rangle$ and $\\mathbf{r}'' = a\\langle 0, 2, 2t \\rangle$, so\n\n$$\\mathbf{r}' \\times \\mathbf{r}'' = a^2\\langle 2t^2, -4t, 4 \\rangle, \\qquad \\|\\mathbf{r}' \\times \\mathbf{r}''\\| = 2a^2(t^2 + 2).$$\n\nWith $\\|\\mathbf{r}'\\| = a(t^2 + 2)$ this gives $\\kappa(t) = \\frac{2}{a(t^2 + 2)^2}$. With $a = 5$ at $t = 0$, $\\kappa = \\frac{2}{5 \\cdot 4} = \\frac{1}{10}$.\n\n> **Watch out.** The denominator is the cube of the speed, $a^3(t^2 + 2)^3$, so $a^2$ over $a^3$ leaves $\\frac{1}{a}$, not $a$. Keep the factor $2$ of the cross product's length.",
        "叉积公式 $\\kappa = \\frac{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}{\\|\\mathbf{r}'\\|^3}$ 对任意参数化都成立，因此不必先改用弧长参数。求出前两阶导数，取叉积，再用其长度除以速率的立方。对 $\\mathbf{r}(t) = \\langle 2at, at^2, \\frac{a}{3}t^3 \\rangle$，$\\mathbf{r}' = a\\langle 2, 2t, t^2 \\rangle$，$\\mathbf{r}'' = a\\langle 0, 2, 2t \\rangle$，所以\n\n$$\\mathbf{r}' \\times \\mathbf{r}'' = a^2\\langle 2t^2, -4t, 4 \\rangle, \\qquad \\|\\mathbf{r}' \\times \\mathbf{r}''\\| = 2a^2(t^2 + 2)$$\n\n由 $\\|\\mathbf{r}'\\| = a(t^2 + 2)$ 得 $\\kappa(t) = \\frac{2}{a(t^2 + 2)^2}$。取 $a = 5$、$t = 0$，$\\kappa = \\frac{2}{5 \\cdot 4} = \\frac{1}{10}$。\n\n> **注意。** 分母是速率的立方 $a^3(t^2 + 2)^3$，所以 $a^2$ 除以 $a^3$ 剩下 $\\frac{1}{a}$，不是 $a$。叉积长度中的因子 $2$ 要保留。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const t0 = rng.int(-3, 3);
        const n = t0 * t0 + 2;
        const ans = Q.of(2, a * n * n);
        const cross = [2 * a * a * t0 * t0, -4 * a * a * t0, 4 * a * a];
        return numberProblem({
          prompt: t(
            `Find the curvature of $\\mathbf{r}(t) = ${cubicCurve(a)}$ at $t = ${t0}$.`,
            `求 $\\mathbf{r}(t) = ${cubicCurve(a)}$ 在 $t = ${t0}$ 处的曲率。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(2, n * n),
              `The factor $\\frac{1}{${a}}$ is missing: $a^2$ in the cross product over $a^3$ in the cubed speed leaves $\\frac{1}{a}$.`,
              `缺了因子 $\\frac{1}{${a}}$：叉积中的 $a^2$ 除以速率立方中的 $a^3$ 剩下 $\\frac{1}{a}$。`,
            ),
            why(
              Q.of(2, a * n),
              "That divides by the square of the speed; the formula has the cube.",
              "这除以的是速率的平方；公式中是立方。",
            ),
            why(
              Q.of(2 * a, n * n),
              "$a^2$ over $a^3$ is $\\frac{1}{a}$, so $a$ belongs in the denominator.",
              "$a^2$ 除以 $a^3$ 是 $\\frac{1}{a}$，所以 $a$ 应在分母。",
            ),
            why(
              Q.of(1, a * n * n),
              "The cross product has length $2a^2(t^2 + 2)$; the factor $2$ is missing.",
              "叉积长度为 $2a^2(t^2 + 2)$；缺了因子 $2$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the cross product", "求叉积"],
                t(
                  `$\\mathbf{r}'(${t0}) \\times \\mathbf{r}''(${t0}) = ${v3L(cross)}$, of length $2 \\cdot ${a * a} \\cdot ${n} = ${2 * a * a * n}$.`,
                  `$\\mathbf{r}'(${t0}) \\times \\mathbf{r}''(${t0}) = ${v3L(cross)}$，长度为 $2 \\cdot ${a * a} \\cdot ${n} = ${2 * a * a * n}$。`,
                ),
              ],
              [
                ["Cube the speed", "速率立方"],
                t(
                  `$\\|\\mathbf{r}'(${t0})\\| = ${a} \\cdot ${n} = ${a * n}$, so $\\|\\mathbf{r}'\\|^3 = ${(a * n) ** 3}$.`,
                  `$\\|\\mathbf{r}'(${t0})\\| = ${a} \\cdot ${n} = ${a * n}$，所以 $\\|\\mathbf{r}'\\|^3 = ${(a * n) ** 3}$。`,
                ),
              ],
              [
                ["Divide", "相除"],
                t(
                  `$\\kappa = \\frac{${2 * a * a * n}}{${(a * n) ** 3}} = ${ans.toLatex()}$.`,
                  `$\\kappa = \\frac{${2 * a * a * n}}{${(a * n) ** 3}} = ${ans.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The squared entries of the cross product add to $${cross.map((x) => x * x).join(" + ")} = ${cross.reduce((s, x) => s + x * x, 0)} = ${2 * a * a * n}^2$, confirming its length.`,
              `叉积各分量平方和为 $${cross.map((x) => x * x).join(" + ")} = ${cross.reduce((s, x) => s + x * x, 0)} = ${2 * a * a * n}^2$，确认了它的长度。`,
            ),
          ),
        });
      },
    },
  ],
};

/** radiusOfCurvature computes the radius of curvature ρ = 1 / κ. */
export const radiusOfCurvature: TopicDef = {
  id: "radius-of-curvature",
  title: t("Radius of Curvature", "曲率半径"),
  summary: t(
    "The radius of curvature ρ = 1 / κ is the radius of the osculating circle that best approximates the curve at a point.",
    "曲率半径 ρ = 1 / κ 是在某点处最佳逼近曲线的密切圆的半径。",
  ),
  intro: t(
    "At a point where $\\|\\mathbf{r}'\\| = 10$ and $\\|\\mathbf{r}' \\times \\mathbf{r}''\\| = 50$, the curvature is $\\kappa = \\frac{50}{10^3} = \\frac{1}{20}$, so the radius of curvature is $\\rho = \\frac{1}{\\kappa} = 20$: near that point the curve bends like a circle of radius $20$.\n\nCheck: $\\kappa\\rho = \\frac{1}{20} \\cdot 20 = 1$, and a circle of radius $20$ has curvature $\\frac{1}{20}$.\n\nIn this lesson we find the radius of curvature, the radius of the circle that best fits a curve at a point.",
    "在 $\\|\\mathbf{r}'\\| = 10$、$\\|\\mathbf{r}' \\times \\mathbf{r}''\\| = 50$ 的点处，曲率 $\\kappa = \\frac{50}{10^3} = \\frac{1}{20}$，所以曲率半径 $\\rho = \\frac{1}{\\kappa} = 20$：在该点附近曲线像半径为 $20$ 的圆那样弯曲。\n\n检验：$\\kappa\\rho = \\frac{1}{20} \\cdot 20 = 1$，而半径为 $20$ 的圆的曲率是 $\\frac{1}{20}$。\n\n本课我们求曲率半径，即在某点处最贴合曲线的圆的半径。",
  ),
  prerequisites: ["introduction-to-curvature"],
  encompasses: [{ topic: "introduction-to-curvature", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "calculating-the-radius-of-curvature",
      figure: multivariableDrawings1["radius-of-curvature#calculating-the-radius-of-curvature"],
      title: t("Calculating the radius of curvature", "计算曲率半径"),
      explanation: t(
        "The radius of curvature $\\rho$ at a point on a curve is the reciprocal of its curvature:\n\n$$\\rho = \\frac{1}{\\kappa}.$$ It represents the radius of the osculating circle (circle of curvature) at that point. With $\\kappa = \\frac{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}{\\|\\mathbf{r}'\\|^3}$ this reads $\\rho = \\frac{\\|\\mathbf{r}'\\|^3}{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}$. If $\\|\\mathbf{r}'\\| = 3$ and $\\|\\mathbf{r}' \\times \\mathbf{r}''\\| = 9$, then $\\rho = \\frac{27}{9} = 3$.\n\n> **Watch out.** $\\rho$ is the reciprocal of $\\kappa$, so the cubed speed goes on top: a sharp bend has large $\\kappa$ and small $\\rho$. Cube the speed; the cross product's length is not squared.",
        "曲线在某点处的曲率半径 $\\rho$ 为该点曲率的倒数：\n\n$$\\rho = \\frac{1}{\\kappa}$$ 它表示在该点处的密切圆（曲率圆）的半径。由 $\\kappa = \\frac{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}{\\|\\mathbf{r}'\\|^3}$ 可写成 $\\rho = \\frac{\\|\\mathbf{r}'\\|^3}{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}$。若 $\\|\\mathbf{r}'\\| = 3$，$\\|\\mathbf{r}' \\times \\mathbf{r}''\\| = 9$，则 $\\rho = \\frac{27}{9} = 3$。\n\n> **注意。** $\\rho$ 是 $\\kappa$ 的倒数，所以速率的立方在分子上：急弯的 $\\kappa$ 大而 $\\rho$ 小。速率要立方；叉积的长度不要平方。",
      ),
      generate(rng: Rng): Problem {
        const speed = rng.int(2, 6);
        const cross = rng.int(3, 7);
        const cube = speed ** 3;
        const ans = Q.of(cube, cross);
        return numberProblem({
          prompt: t(
            `At a point $P$ of a curve, $\\|\\mathbf{r}'\\| = ${speed}$ and $\\|\\mathbf{r}' \\times \\mathbf{r}''\\| = ${cross}$. Find the radius of curvature $\\rho$ at $P$.`,
            `在曲线的点 $P$ 处，$\\|\\mathbf{r}'\\| = ${speed}$，$\\|\\mathbf{r}' \\times \\mathbf{r}''\\| = ${cross}$。求曲线在点 $P$ 处的曲率半径 $\\rho$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              Q.of(cross, cube),
              "That is the curvature $\\kappa$; the radius of curvature is its reciprocal.",
              "这是曲率 $\\kappa$；曲率半径是它的倒数。",
            ),
            why(
              Q.of(speed * speed, cross),
              `The speed is cubed: $${speed}^3 = ${cube}$, not $${speed}^2$.`,
              `速率要立方：$${speed}^3 = ${cube}$，不是 $${speed}^2$。`,
            ),
            why(
              Q.of(cube, cross * cross),
              `The cross product's length $${cross}$ appears to the first power, not squared.`,
              `叉积长度 $${cross}$ 是一次方，不要平方。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the curvature", "求曲率"],
                t(
                  `$\\kappa = \\frac{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}{\\|\\mathbf{r}'\\|^3} = \\frac{${cross}}{${speed}^3} = \\frac{${cross}}{${cube}}$.`,
                  `$\\kappa = \\frac{\\|\\mathbf{r}' \\times \\mathbf{r}''\\|}{\\|\\mathbf{r}'\\|^3} = \\frac{${cross}}{${speed}^3} = \\frac{${cross}}{${cube}}$。`,
                ),
              ],
              [
                ["Take the reciprocal", "取倒数"],
                t(`$\\rho = \\frac{1}{\\kappa} = ${ans.toLatex()}$.`, `$\\rho = \\frac{1}{\\kappa} = ${ans.toLatex()}$。`),
              ],
            ],
            t(
              `$\\kappa\\rho = \\frac{${cross}}{${cube}} \\cdot ${ans.toLatex()} = 1$.`,
              `$\\kappa\\rho = \\frac{${cross}}{${cube}} \\cdot ${ans.toLatex()} = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-radius-of-curvature-at-a-vertex-of-an-ellipse",
      figure: multivariableDrawings1["radius-of-curvature#the-radius-of-curvature-at-a-vertex-of-an-ellipse"],
      title: t("The radius of curvature at a vertex of an ellipse", "椭圆顶点处的曲率半径"),
      explanation: t(
        "For the ellipse $\\mathbf{r}(t) = \\langle A\\cos t, B\\sin t \\rangle$, the cross product formula gives\n\n$$\\kappa(t) = \\frac{AB}{(A^2\\sin^2 t + B^2\\cos^2 t)^{3/2}}.$$\n\nAt the vertex $(A, 0)$, where $t = 0$, this is $\\kappa = \\frac{A}{B^2}$, so the radius of curvature is $\\rho = \\frac{1}{\\kappa} = \\frac{B^2}{A}$. At $(0, B)$ the roles swap and $\\rho = \\frac{A^2}{B}$. For $\\frac{x^2}{100} + \\frac{y^2}{4} = 1$ at $(10, 0)$, $\\rho = \\frac{4}{10} = \\frac{2}{5}$: the ellipse is sharp at the ends of its long axis.\n\n> **Watch out.** At $(A, 0)$ the radius squares the other semi-axis, $\\frac{B^2}{A}$; it is neither semi-axis itself. And $\\rho$ is $\\frac{1}{\\kappa}$, not $\\kappa$.",
        "对椭圆 $\\mathbf{r}(t) = \\langle A\\cos t, B\\sin t \\rangle$，叉积公式给出\n\n$$\\kappa(t) = \\frac{AB}{(A^2\\sin^2 t + B^2\\cos^2 t)^{3/2}}$$\n\n在顶点 $(A, 0)$（$t = 0$）处，$\\kappa = \\frac{A}{B^2}$，所以曲率半径 $\\rho = \\frac{1}{\\kappa} = \\frac{B^2}{A}$。在 $(0, B)$ 处角色互换，$\\rho = \\frac{A^2}{B}$。对 $\\frac{x^2}{100} + \\frac{y^2}{4} = 1$ 在 $(10, 0)$ 处，$\\rho = \\frac{4}{10} = \\frac{2}{5}$：椭圆在长轴两端很尖。\n\n> **注意。** 在 $(A, 0)$ 处半径平方的是另一条半轴，$\\frac{B^2}{A}$；它不是任何一条半轴本身。而且 $\\rho$ 是 $\\frac{1}{\\kappa}$，不是 $\\kappa$。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.int(2, 9);
        let B = rng.int(2, 9);
        if (B === A) B += 1;
        const onX = rng.int(0, 1) === 0;
        const ans = onX ? Q.of(B * B, A) : Q.of(A * A, B);
        const point = onX ? `(${A}, 0)` : `(0, ${B})`;
        const kappa = onX ? `\\frac{${A}}{${B * B}}` : `\\frac{${B}}{${A * A}}`;
        const local = onX ? `x \\approx ${A} - ${Q.of(A, 2 * B * B).toLatex()}y^2` : `y \\approx ${B} - ${Q.of(B, 2 * A * A).toLatex()}x^2`;
        return numberProblem({
          prompt: t(
            `Find the radius of curvature of the ellipse $\\frac{x^2}{${A * A}} + \\frac{y^2}{${B * B}} = 1$ at the point $${point}$.`,
            `求椭圆 $\\frac{x^2}{${A * A}} + \\frac{y^2}{${B * B}} = 1$ 在点 $${point}$ 处的曲率半径。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              onX ? Q.of(A, B * B) : Q.of(B, A * A),
              "That is the curvature $\\kappa$; the radius of curvature is its reciprocal.",
              "这是曲率 $\\kappa$；曲率半径是它的倒数。",
            ),
            why(
              onX ? Q.of(A * A, B) : Q.of(B * B, A),
              "That is the radius of curvature at the other vertex; the semi-axes swap roles there.",
              "这是另一个顶点处的曲率半径；那里两条半轴的角色互换。",
            ),
            why(
              Q.of(A),
              `$${A}$ is a semi-axis, not the radius of the circle that fits the ellipse at the vertex.`,
              `$${A}$ 是半轴，不是在顶点处贴合椭圆的圆的半径。`,
            ),
            why(
              Q.of(B),
              `$${B}$ is a semi-axis, not the radius of the circle that fits the ellipse at the vertex.`,
              `$${B}$ 是半轴，不是在顶点处贴合椭圆的圆的半径。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Read off the semi-axes", "读出半轴"],
                t(
                  `$A = ${A}$ and $B = ${B}$, and $${point}$ is the vertex at $t = ${onX ? "0" : "\\frac{\\pi}{2}"}$ of $\\langle ${A}\\cos t, ${B}\\sin t \\rangle$.`,
                  `$A = ${A}$，$B = ${B}$，$${point}$ 是 $\\langle ${A}\\cos t, ${B}\\sin t \\rangle$ 在 $t = ${onX ? "0" : "\\frac{\\pi}{2}"}$ 处的顶点。`,
                ),
              ],
              [["Find the curvature", "求曲率"], t(`There $\\kappa = ${kappa}$.`, `那里 $\\kappa = ${kappa}$。`)],
              [["Take the reciprocal", "取倒数"], t(`$\\rho = ${ans.toLatex()}$.`, `$\\rho = ${ans.toLatex()}$。`)],
            ],
            t(
              `Near $${point}$ the ellipse is $${local}$, and a circle of radius $\\rho$ near its own extreme point looks like a parabola with coefficient $\\frac{1}{2\\rho}$; $\\frac{1}{2 \\cdot ${paren(ans)}} = ${Q.of(1, 2).div(ans).toLatex()}$ matches.`,
              `在 $${point}$ 附近椭圆为 $${local}$，而半径为 $\\rho$ 的圆在其极端点附近像系数为 $\\frac{1}{2\\rho}$ 的抛物线；$\\frac{1}{2 \\cdot ${paren(ans)}} = ${Q.of(1, 2).div(ans).toLatex()}$，相符。`,
            ),
          ),
        });
      },
    },
  ],
};
/** theCurvatureOfAPlaneCurve computes curvature for y = f(x). */
export const theCurvatureOfAPlaneCurve: TopicDef = {
  id: "the-curvature-of-a-plane-curve",
  title: t("The Curvature of a Plane Curve", "平面曲线的曲率"),
  summary: t(
    "For a plane curve $y = f(x)$, the curvature is $\\kappa(x) = \\frac{|f''(x)|}{\\left(1 + f'(x)^2\\right)^{3/2}}$.",
    "对于平面曲线 $y = f(x)$，曲率为 $\\kappa(x) = \\frac{|f''(x)|}{\\left(1 + f'(x)^2\\right)^{3/2}}$。",
  ),
  intro: t(
    "Take $y = \\frac{3}{8}x^2$ at $x = 1$. There $f'(1) = \\frac{3}{4}$ and $f''(1) = \\frac{3}{4}$, so $1 + f'^2 = \\frac{25}{16}$, whose $\\frac{3}{2}$ power is $\\frac{125}{64}$, and the curvature is $\\kappa = \\frac{3}{4} \\cdot \\frac{64}{125} = \\frac{48}{125}$.\n\nCheck: at the vertex $x = 0$ the slope is $0$ and $\\kappa = \\frac{3}{4} = \\frac{75}{100}$, larger than $\\frac{48}{125} = \\frac{38.4}{100}$, as it should be: the parabola flattens out as it gets steeper.\n\nIn this lesson we find the curvature of the graph of a function from its first and second derivatives.",
    "取 $y = \\frac{3}{8}x^2$ 在 $x = 1$ 处。这里 $f'(1) = \\frac{3}{4}$，$f''(1) = \\frac{3}{4}$，所以 $1 + f'^2 = \\frac{25}{16}$，其 $\\frac{3}{2}$ 次幂为 $\\frac{125}{64}$，曲率为 $\\kappa = \\frac{3}{4} \\cdot \\frac{64}{125} = \\frac{48}{125}$。\n\n检验：在顶点 $x = 0$ 处斜率为 $0$，$\\kappa = \\frac{3}{4} = \\frac{75}{100}$，比 $\\frac{48}{125} = \\frac{38.4}{100}$ 大，这是应该的：抛物线越陡越平直。\n\n本课我们由一阶和二阶导数求函数图像的曲率。",
  ),
  prerequisites: ["introduction-to-curvature", "second-and-higher-order-derivatives"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-curvature-of-function-graphs",
      figure: multivariableDrawings1["the-curvature-of-a-plane-curve#computing-curvature-of-function-graphs"],
      title: t("Computing curvature of function graphs", "计算显式函数图像的曲率"),
      explanation: t(
        "For a graph the second derivative measures bending, and dividing by a power of one plus the square of the slope corrects for how steep the graph is. For a plane curve given as the graph of a function $y = f(x)$, the curvature formula reduces to:\n\n$$\\kappa(x) = \\frac{|f''(x)|}{\\left[1 + (f'(x))^2\\right]^{3/2}}.$$\n\nFor $y = \\frac{1}{2}x^2$ at its vertex, $f'(0) = 0$ and $f''(0) = 1$, so $\\kappa(0) = \\frac{1}{1} = 1$: the parabola bends there like a circle of radius $1$.\n\n> **Watch out.** The second derivative of $ax^2$ is $2a$, not $a$. At a vertex the slope is $0$ and the denominator is $1$, so the curvature is $|f''|$ itself; its reciprocal is the radius of curvature, not the curvature.",
        "对于函数图像，二阶导数衡量弯曲程度，再除以 1 加斜率平方的某次幂，以修正图像陡峭程度的影响。对于由显式函数图像 $y = f(x)$ 给出的平面曲线，曲率公式简化为：\n\n$$\\kappa(x) = \\frac{|f''(x)|}{\\left[1 + (f'(x))^2\\right]^{3/2}}$$\n\n对 $y = \\frac{1}{2}x^2$ 在顶点处，$f'(0) = 0$，$f''(0) = 1$，所以 $\\kappa(0) = \\frac{1}{1} = 1$：抛物线在那里像半径为 $1$ 的圆那样弯曲。\n\n> **注意。** $ax^2$ 的二阶导数是 $2a$，不是 $a$。在顶点处斜率为 $0$，分母为 $1$，曲率就是 $|f''|$ 本身；它的倒数是曲率半径，不是曲率。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 40);
        const ans = 2 * a;
        const curve = poly([a, "x^2"]);
        return numberProblem({
          prompt: t(
            `Find the curvature $\\kappa(0)$ of the parabola $y = ${curve}$ at its vertex $(0, 0)$.`,
            `求抛物线 $y = ${curve}$ 在其顶点 $(0, 0)$ 处的曲率 $\\kappa(0)$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a,
              `$\\frac{d^2}{dx^2}(${curve}) = ${2 * a}$: differentiating $x^2$ twice gives $2$.`,
              `$\\frac{d^2}{dx^2}(${curve}) = ${2 * a}$：$x^2$ 求两次导得 $2$。`,
            ),
            why(
              Q.of(1, 2 * a),
              "That is the radius of curvature $\\frac{1}{\\kappa}$; the curvature is its reciprocal.",
              "这是曲率半径 $\\frac{1}{\\kappa}$；曲率是它的倒数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate", "求导"],
                t(
                  `$f'(x) = ${2 * a}x$, so $f'(0) = 0$, and $f''(x) = ${2 * a}$.`,
                  `$f'(x) = ${2 * a}x$，所以 $f'(0) = 0$；$f''(x) = ${2 * a}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t(
                  `$\\kappa(0) = \\frac{|f''(0)|}{\\left[1 + 0^2\\right]^{3/2}} = \\frac{${2 * a}}{1} = ${ans}$.`,
                  `$\\kappa(0) = \\frac{|f''(0)|}{\\left[1 + 0^2\\right]^{3/2}} = \\frac{${2 * a}}{1} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `A circle of radius $\\rho$ near its lowest point is $y \\approx \\frac{x^2}{2\\rho}$. With $\\rho = \\frac{1}{${ans}}$ this is $\\frac{${ans}}{2}x^2 = ${curve}$, the parabola itself.`,
              `半径为 $\\rho$ 的圆在其最低点附近为 $y \\approx \\frac{x^2}{2\\rho}$。取 $\\rho = \\frac{1}{${ans}}$，得 $\\frac{${ans}}{2}x^2 = ${curve}$，正是这条抛物线。`,
            ),
          ),
        });
      },
    },
    {
      id: "curvature-of-a-graph-from-its-slope-and-concavity",
      figure: multivariableDrawings1["the-curvature-of-a-plane-curve#curvature-of-a-graph-from-its-slope-and-concavity"],
      title: t("Curvature of a graph from $f'$ and $f''$", "由 $f'$ 与 $f''$ 求图像的曲率"),
      explanation: t(
        "For the graph $y = f(x)$ the curvature is\n\n$$\\kappa = \\frac{|f''(x)|}{\\left(1 + f'(x)^2\\right)^{3/2}}.$$\n\nIt grows with the concavity $|f''|$ but is damped where the graph is steep. When the slope is a ratio from a Pythagorean triple, such as $\\frac34$, the denominator is rational: $1 + \\frac{9}{16} = \\frac{25}{16}$, whose $\\frac32$ power is $\\frac{125}{64}$. So with $f' = \\frac{3}{4}$ and $f'' = 10$, $\\kappa = 10 \\cdot \\frac{64}{125} = \\frac{128}{25}$.\n\n> **Watch out.** Raise $1 + f'^2$ to the power $\\frac{3}{2}$: take the square root and then cube it, not just one of the two. And take $|f''|$: curvature is never negative.",
        "对图像 $y = f(x)$，曲率为\n\n$$\\kappa = \\frac{|f''(x)|}{\\left(1 + f'(x)^2\\right)^{3/2}}$$\n\n它随凹凸程度 $|f''|$ 增大，但在图像陡峭处被削弱。当斜率是勾股数之比如 $\\frac34$ 时分母为有理数：$1 + \\frac{9}{16} = \\frac{25}{16}$，其 $\\frac32$ 次幂为 $\\frac{125}{64}$。所以当 $f' = \\frac{3}{4}$，$f'' = 10$ 时，$\\kappa = 10 \\cdot \\frac{64}{125} = \\frac{128}{25}$。\n\n> **注意。** 要把 $1 + f'^2$ 取 $\\frac{3}{2}$ 次幂：先开平方再立方，两步都不能少。还要取 $|f''|$：曲率从不为负。",
      ),
      generate(rng: Rng): Problem {
        const [p, q, r] = rng.pick([
          [0, 1, 1],
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
        ] as const);
        const sg = rng.pick([1, -1]);
        const slope = Q.of(sg * p, q);
        const k = rng.nonZero(-9, 9);
        const x0 = rng.int(-3, 3);
        const size = Math.abs(k);
        const ans = Q.of(size * q ** 3, r ** 3);
        return numberProblem({
          prompt: t(
            `At $x = ${x0}$ a function has $f'(${x0}) = ${slope.toLatex()}$ and $f''(${x0}) = ${k}$. Find the curvature of $y = f(x)$ there.`,
            `某函数在 $x = ${x0}$ 处 $f'(${x0}) = ${slope.toLatex()}$，$f''(${x0}) = ${k}$。求 $y = f(x)$ 在该处的曲率。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(size, "That leaves out the denominator; a nonzero slope damps the curvature.", "这漏掉了分母；斜率不为零时曲率会被削弱。"),
            why(
              Q.of(size * q * q, r * r),
              `That divides by $1 + f'^2 = \\frac{${r * r}}{${q * q}}$ itself; its power is $\\frac{3}{2}$.`,
              `这是直接除以 $1 + f'^2 = \\frac{${r * r}}{${q * q}}$；它的指数是 $\\frac{3}{2}$。`,
            ),
            why(
              Q.of(size * q, r),
              `That divides by the square root $\\frac{${r}}{${q}}$ only; it must also be cubed.`,
              `这只除以了平方根 $\\frac{${r}}{${q}}$；还要立方。`,
            ),
            why(Q.of(k * q ** 3, r ** 3), "Curvature uses $|f''|$, so it is never negative.", "曲率用的是 $|f''|$，所以从不为负。"),
          ]),
          solution: walked(
            [
              [
                ["Find the denominator", "求分母"],
                p === 0
                  ? t("$f' = 0$, so $\\left(1 + f'^2\\right)^{3/2} = 1$.", "$f' = 0$，所以 $\\left(1 + f'^2\\right)^{3/2} = 1$。")
                  : t(
                      `$1 + f'^2 = 1 + \\frac{${p * p}}{${q * q}} = \\frac{${r * r}}{${q * q}}$, whose square root is $\\frac{${r}}{${q}}$ and whose $\\frac{3}{2}$ power is $\\frac{${r ** 3}}{${q ** 3}}$.`,
                      `$1 + f'^2 = 1 + \\frac{${p * p}}{${q * q}} = \\frac{${r * r}}{${q * q}}$，其平方根为 $\\frac{${r}}{${q}}$，$\\frac{3}{2}$ 次幂为 $\\frac{${r ** 3}}{${q ** 3}}$。`,
                    ),
              ],
              [
                ["Divide", "相除"],
                p === 0
                  ? t(`$\\kappa = |${k}| = ${size}$.`, `$\\kappa = |${k}| = ${size}$。`)
                  : t(
                      `$\\kappa = \\frac{|${k}|}{${Q.of(r ** 3, q ** 3).toLatex()}} = ${size} \\cdot \\frac{${q ** 3}}{${r ** 3}} = ${ans.toLatex()}$.`,
                      `$\\kappa = \\frac{|${k}|}{${Q.of(r ** 3, q ** 3).toLatex()}} = ${size} \\cdot \\frac{${q ** 3}}{${r ** 3}} = ${ans.toLatex()}$。`,
                    ),
              ],
            ],
            p === 0
              ? t(
                  `Where the graph is level, curvature and $|f''|$ agree, and here both are $${size}$.`,
                  `图像水平处，曲率与 $|f''|$ 相等，这里两者都是 $${size}$。`,
                )
              : t(
                  `$${ans.toLatex()} < ${size}$: a steep graph bends less than its concavity $|f''| = ${size}$ alone suggests, as the denominator $\\frac{${r ** 3}}{${q ** 3}} > 1$ says.`,
                  `$${ans.toLatex()} < ${size}$：陡峭的图像弯得比单看凹凸程度 $|f''| = ${size}$ 要少，正如分母 $\\frac{${r ** 3}}{${q ** 3}} > 1$ 所示。`,
                ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.3 Vector Fields
// ---------------------------------------------------------------------------

/** vectorFields evaluates vector fields at points in space. */
export const vectorFields: TopicDef = {
  id: "vector-fields",
  title: t("Vector Fields", "向量场"),
  summary: t(
    "A vector field assigns a vector F(x, y) or F(x, y, z) to each point in space.",
    "向量场为空间中的每个点赋予一个向量 F(x, y) 或 F(x, y, z)。",
  ),
  intro: t(
    "The field $\\mathbf{F}(x, y) = \\langle y, x \\rangle$ attaches an arrow to every point of the plane. At $(3, 4)$, put $x = 3$ and $y = 4$ into each entry: $\\mathbf{F}(3, 4) = \\langle 4, 3 \\rangle$, an arrow drawn with its tail at $(3, 4)$.\n\nCheck: $\\|\\langle 4, 3 \\rangle\\| = 5$, the distance from the origin to $(3, 4)$, as it must be for this field, whose entries are those of the position swapped.\n\nIn this lesson we evaluate vector fields at points and find where a field vanishes.",
    "向量场 $\\mathbf{F}(x, y) = \\langle y, x \\rangle$ 给平面上的每个点附上一个箭头。在 $(3, 4)$ 处，把 $x = 3$、$y = 4$ 代入每个分量：$\\mathbf{F}(3, 4) = \\langle 4, 3 \\rangle$，这是一个以 $(3, 4)$ 为起点的箭头。\n\n检验：$\\|\\langle 4, 3 \\rangle\\| = 5$，正是原点到 $(3, 4)$ 的距离；这个场的分量就是位置的分量互换，理应如此。\n\n本课我们求向量场在各点的值，并求场为零的点。",
  ),
  prerequisites: ["defining-vector-valued-functions", "three-dimensional-vectors-in-component-form"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "evaluating-vector-fields-at-points",
      title: t("Evaluating vector fields at points", "在各点处求向量场的值"),
      explanation: t(
        "To evaluate a vector field, substitute the coordinates of the point into each component formula to get the vector attached to that point. A vector field in $\\mathbb{R}^3$ is a function $\\mathbf{F}$ that assigns to each point $(x, y, z)$ a three-dimensional vector:\n\n$$\\mathbf{F}(x, y, z) = P(x, y, z)\\mathbf{i} + Q(x, y, z)\\mathbf{j} + R(x, y, z)\\mathbf{k} = \\langle P, Q, R \\rangle.$$\n\nFor $\\mathbf{F} = \\langle 2x - y, 4yz, x - z \\rangle$ at $(1, 2, 3)$: $P = 2 - 2 = 0$, $Q = 4 \\cdot 2 \\cdot 3 = 24$ and $R = 1 - 3 = -2$, so $\\mathbf{F}(1, 2, 3) = \\langle 0, 24, -2 \\rangle$.\n\n> **Watch out.** The answer is a vector attached to the point, not the point itself, and its entries keep their order $\\langle P, Q, R \\rangle$. Put a negative coordinate in parentheses: $x - z$ at $z = -2$ is $x - (-2) = x + 2$.",
        "求向量场的值时，把点的坐标代入每个分量公式，就得到附着在该点的向量。$\\mathbb{R}^3$ 中的向量场是一个函数 $\\mathbf{F}$，它为空间中的每个点 $(x, y, z)$ 赋予一个三维向量：\n\n$$\\mathbf{F}(x, y, z) = P(x, y, z)\\mathbf{i} + Q(x, y, z)\\mathbf{j} + R(x, y, z)\\mathbf{k} = \\langle P, Q, R \\rangle$$\n\n对 $\\mathbf{F} = \\langle 2x - y, 4yz, x - z \\rangle$ 在 $(1, 2, 3)$ 处：$P = 2 - 2 = 0$，$Q = 4 \\cdot 2 \\cdot 3 = 24$，$R = 1 - 3 = -2$，所以 $\\mathbf{F}(1, 2, 3) = \\langle 0, 24, -2 \\rangle$。\n\n> **注意。** 答案是附着在该点的向量，不是点本身，分量顺序是 $\\langle P, Q, R \\rangle$。负坐标要加括号：$x - z$ 在 $z = -2$ 时为 $x - (-2) = x + 2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const [x, y, z]: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        const ansX = a * x + b * y;
        const ansY = c * y * z;
        const ansZ = x - z;
        const answer: Vec3 = [ansX, ansY, ansZ];
        const field = `\\left\\langle ${poly([a, "x"], [b, "y"])}, ${poly([c, "yz"])}, x - z \\right\\rangle`;
        return located(
          {
            prompt: t(
              `Evaluate the vector field $\\mathbf{F}(x, y, z) = ${field}$ at the point $(${x}, ${y}, ${z})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `计算向量场 $\\mathbf{F}(x, y, z) = ${field}$ 在点 $(${x}, ${y}, ${z})$ 处的值。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Substitute into the first entry", "代入第一个分量"],
                  t(
                    `$P = ${a} \\cdot ${paren(x)} + ${paren(b)} \\cdot ${paren(y)} = ${ansX}$.`,
                    `$P = ${a} \\cdot ${paren(x)} + ${paren(b)} \\cdot ${paren(y)} = ${ansX}$。`,
                  ),
                ],
                [
                  ["Substitute into the other two", "代入另外两个分量"],
                  t(
                    `$Q = ${c} \\cdot ${paren(y)} \\cdot ${paren(z)} = ${ansY}$ and $R = ${x} - ${paren(z)} = ${ansZ}$, so $\\mathbf{F}(${x}, ${y}, ${z}) = ${v3L(answer)}$.`,
                    `$Q = ${c} \\cdot ${paren(y)} \\cdot ${paren(z)} = ${ansY}$，$R = ${x} - ${paren(z)} = ${ansZ}$，所以 $\\mathbf{F}(${x}, ${y}, ${z}) = ${v3L(answer)}$。`,
                  ),
                ],
              ],
              t(
                `In the other order: $${paren(b)} \\cdot ${paren(y)} + ${paren(a)} \\cdot ${paren(x)} = ${ansX}$, $${paren(z)} \\cdot ${paren(y)} \\cdot ${paren(c)} = ${ansY}$ and $${paren(x)} + ${paren(-z)} = ${ansZ}$.`,
                `换个顺序算：$${paren(b)} \\cdot ${paren(y)} + ${paren(a)} \\cdot ${paren(x)} = ${ansX}$，$${paren(z)} \\cdot ${paren(y)} \\cdot ${paren(c)} = ${ansY}$，$${paren(x)} + ${paren(-z)} = ${ansZ}$。`,
              ),
            ),
          },
          [
            [[ansY, ansX, ansZ], "The first two entries are swapped; $P$ comes first.", "前两个分量对调了；$P$ 在前。"],
            [[x, y, z], "That is the point itself; the field gives the vector attached to it.", "这是点本身；场给出的是附着在该点的向量。"],
            [
              [ansX, ansY, x + z],
              `$R = x - z$ subtracts $z$: $${x} - ${paren(z)} = ${ansZ}$.`,
              `$R = x - z$ 要减去 $z$：$${x} - ${paren(z)} = ${ansZ}$。`,
            ],
          ],
        );
      },
    },
    {
      id: "finding-where-a-vector-field-vanishes",
      title: t("Finding where a vector field vanishes", "求向量场为零的点"),
      explanation: t(
        "A point where $\\mathbf{F} = \\mathbf{0}$ is an equilibrium of the field: a particle carried by the flow and placed there stays put. To find it, set every component equal to zero and solve the resulting system. For $\\mathbf{F} = \\langle 2x + 5y - 1, x - 4y + 6 \\rangle$, the system $2x + 5y = 1$, $x - 4y = -6$ gives $x = 4y - 6$, then $13y - 12 = 1$, so $y = 1$, $x = -2$: the field vanishes at $(-2, 1)$.\n\n> **Watch out.** Every component must be zero at the same point: one equation alone gives a whole line. Move each constant to the right with its sign changed, so $2x + 5y - 1 = 0$ becomes $2x + 5y = 1$, not $-1$.",
        "使 $\\mathbf{F} = \\mathbf{0}$ 的点是场的平衡点：放在那里随流运动的质点保持不动。求它时令每个分量为零并解所得方程组。对 $\\mathbf{F} = \\langle 2x + 5y - 1, x - 4y + 6 \\rangle$，方程组 $2x + 5y = 1$，$x - 4y = -6$ 给出 $x = 4y - 6$，于是 $13y - 12 = 1$，所以 $y = 1$，$x = -2$：场在 $(-2, 1)$ 处为零。\n\n> **注意。** 每个分量必须在同一点为零：只用一个方程得到的是一整条直线。把常数移到右边时要变号，所以 $2x + 5y - 1 = 0$ 变成 $2x + 5y = 1$，不是 $-1$。",
      ),
      generate(rng: Rng): Problem {
        const x = rng.int(-5, 5);
        const y = rng.int(-5, 5);
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        let c = rng.nonZero(-3, 3);
        let d = rng.nonZero(-3, 3);
        if (a * d - b * c === 0) {
          c = -c;
          if (a * d - b * c === 0) d += 1;
          if (d === 0) d = 2;
        }
        const p = a * x + b * y;
        const q = c * x + d * y;
        const D = a * d - b * c;
        const first = poly([a, "x"], [b, "y"]);
        const second = poly([c, "x"], [d, "y"]);
        return located(
          {
            prompt: t(
              `At which point is $\\mathbf{F}(x, y) = \\langle ${poly([a, "x"], [b, "y"], [-p, ""])}, ${poly([c, "x"], [d, "y"], [-q, ""])} \\rangle$ the zero vector?`,
              `$\\mathbf{F}(x, y) = \\langle ${poly([a, "x"], [b, "y"], [-p, ""])}, ${poly([c, "x"], [d, "y"], [-q, ""])} \\rangle$ 在哪一点为零向量？`,
            ),
            answer: [x, y],
            solution: walked(
              [
                [
                  ["Set both entries to zero", "令两个分量为零"],
                  t(`$${first} = ${p}$ and $${second} = ${q}$.`, `$${first} = ${p}$ 且 $${second} = ${q}$。`),
                ],
                [
                  ["Solve the system", "解方程组"],
                  t(
                    `The determinant is $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$, so $x = \\frac{${p} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(q)}}{${D}} = ${x}$ and $y = \\frac{${a} \\cdot ${paren(q)} - ${paren(c)} \\cdot ${paren(p)}}{${D}} = ${y}$.`,
                    `行列式为 $${a} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(c)} = ${D}$，所以 $x = \\frac{${p} \\cdot ${paren(d)} - ${paren(b)} \\cdot ${paren(q)}}{${D}} = ${x}$，$y = \\frac{${a} \\cdot ${paren(q)} - ${paren(c)} \\cdot ${paren(p)}}{${D}} = ${y}$。`,
                  ),
                ],
              ],
              t(
                `$${a} \\cdot ${paren(x)} + ${paren(b)} \\cdot ${paren(y)} = ${p}$ and $${c} \\cdot ${paren(x)} + ${paren(d)} \\cdot ${paren(y)} = ${q}$, so both entries of $\\mathbf{F}(${x}, ${y})$ are $0$.`,
                `$${a} \\cdot ${paren(x)} + ${paren(b)} \\cdot ${paren(y)} = ${p}$，$${c} \\cdot ${paren(x)} + ${paren(d)} \\cdot ${paren(y)} = ${q}$，所以 $\\mathbf{F}(${x}, ${y})$ 的两个分量都是 $0$。`,
              ),
            ),
          },
          [
            [[y, x], "The coordinates are swapped; $x$ comes first.", "坐标对调了；$x$ 在前。"],
            [
              [-x, -y],
              "That solves the system with the constants moved across without changing their signs.",
              "这是把常数移到另一边时没有变号所解出的结果。",
            ],
            [[p, q], "Those are the constants of the system, not its solution.", "这是方程组的常数项，不是它的解。"],
          ],
        );
      },
    },
  ],
};

/** visualizingVectorFields qualitative interpretation of vector fields. */
export const visualizingVectorFields: TopicDef = {
  id: "visualizing-vector-fields",
  title: t("Visualizing Vector Fields", "向量场的可视化"),
  summary: t(
    "Vector fields are visualized by drawing vectors at representative grid points, displaying direction and magnitude.",
    "通过在代表性网格点绘制向量来可视化向量场，直观显示其方向和大小。",
  ),
  intro: t(
    "Sketch $\\mathbf{F}(x, y) = \\langle -y, x \\rangle$ by evaluating it at a few points: $\\mathbf{F}(2, 0) = \\langle 0, 2 \\rangle$ points up, $\\mathbf{F}(0, 2) = \\langle -2, 0 \\rangle$ points left and $\\mathbf{F}(-2, 0) = \\langle 0, -2 \\rangle$ points down. The arrows run around the origin counterclockwise, longer farther out.\n\nCheck: $\\langle -y, x \\rangle \\cdot \\langle x, y \\rangle = -xy + xy = 0$, so every arrow is perpendicular to the line from the origin, as arrows going around circles must be.\n\nIn this lesson we read the direction and pattern of a field from its formula and match formulas with plots.",
    "通过在几个点求值来画 $\\mathbf{F}(x, y) = \\langle -y, x \\rangle$：$\\mathbf{F}(2, 0) = \\langle 0, 2 \\rangle$ 指向上，$\\mathbf{F}(0, 2) = \\langle -2, 0 \\rangle$ 指向左，$\\mathbf{F}(-2, 0) = \\langle 0, -2 \\rangle$ 指向下。箭头绕原点逆时针转，离原点越远越长。\n\n检验：$\\langle -y, x \\rangle \\cdot \\langle x, y \\rangle = -xy + xy = 0$，所以每个箭头都垂直于从原点出发的直线，绕圆周转的箭头必然如此。\n\n本课我们由公式读出场的方向和形态，并把公式与图对应起来。",
  ),
  prerequisites: ["vector-fields"],
  encompasses: [{ topic: "vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "interpreting-vector-field-plots",
      figure: multivariableDrawings1["visualizing-vector-fields#interpreting-vector-field-plots"],
      title: t("Interpreting vector field plots", "解读向量场图像"),
      explanation: t(
        "A vector field plot shows arrows attached to sample points $(x, y)$. Key patterns include:\n\n- Radial fields: $\\mathbf{F} = \\langle x, y \\rangle$ points directly away from the origin.\n- Rotational fields: $\\mathbf{F} = \\langle -y, x \\rangle$ circulates counterclockwise around the origin.\n- Constant fields: $\\mathbf{F} = \\langle c_1, c_2 \\rangle$ have identical vectors at every point.\n\nFor $\\mathbf{F} = \\langle \\frac{1}{2}x, \\frac{1}{2}y \\rangle$ every arrow points away from the origin. For $\\mathbf{F} = \\langle \\frac{1}{2}y, -\\frac{1}{2}x \\rangle$ the arrow at $(1, 0)$ is $\\langle 0, -\\frac{1}{2} \\rangle$, pointing down, so the arrows run clockwise.\n\n> **Watch out.** To tell clockwise from counterclockwise, evaluate at one point such as $(1, 0)$ rather than guessing from the signs. A negative multiple of $\\langle x, y \\rangle$ points inward, not outward.",
        "向量场图显示附着在各采样点 $(x, y)$ 处的箭头。主要形态包括：\n\n- 径向场：$\\mathbf{F} = \\langle x, y \\rangle$ 直接背离原点指向外侧。\n- 旋转场：$\\mathbf{F} = \\langle -y, x \\rangle$ 绕原点逆时针环流。\n- 常数场：$\\mathbf{F} = \\langle c_1, c_2 \\rangle$ 在每个点处的向量均相同。\n\n对 $\\mathbf{F} = \\langle \\frac{1}{2}x, \\frac{1}{2}y \\rangle$，每个箭头都背离原点。对 $\\mathbf{F} = \\langle \\frac{1}{2}y, -\\frac{1}{2}x \\rangle$，$(1, 0)$ 处的箭头为 $\\langle 0, -\\frac{1}{2} \\rangle$，指向下，所以箭头顺时针转。\n\n> **注意。** 判断顺时针还是逆时针，要在一个点（如 $(1, 0)$）求值，不要凭符号猜。$\\langle x, y \\rangle$ 的负数倍指向内，不是向外。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(1, 9);
        const cStr = c === 1 ? "" : String(c);
        const outward = t("Points radially outward from the origin", "从原点向外径向发散");
        const inward = t("Points radially inward toward the origin", "向原点径向汇聚");
        const ccw = t("Circulates counterclockwise around the origin", "绕原点逆时针环流");
        const cw = t("Circulates clockwise around the origin", "绕原点顺时针环流");
        const constant = t("Points in a constant fixed direction", "指向恒定的固定方向");
        const notConstant = t(
          `The arrows change from point to point: at $(1, 0)$ and $(0, 1)$ they differ.`,
          `箭头随点而变：在 $(1, 0)$ 和 $(0, 1)$ 处不同。`,
        );
        const perpendicular = t(
          "Its dot product with $\\langle x, y \\rangle$ is $0$, so the arrows go around the origin, not along lines through it.",
          "它与 $\\langle x, y \\rangle$ 的点积为 $0$，所以箭头绕原点转，而不是沿过原点的直线。",
        );
        const parallel = t(
          "It is a multiple of $\\langle x, y \\rangle$, so the arrows lie along lines through the origin instead of going around it.",
          "它是 $\\langle x, y \\rangle$ 的倍数，所以箭头沿过原点的直线，而不是绕原点转。",
        );
        const kinds = [
          {
            field: `\\langle ${cStr}x, ${cStr}y \\rangle`,
            at: `\\langle ${c}, 0 \\rangle`,
            says: t("pointing straight away from the origin.", "正好背离原点。"),
            right: outward,
            look: t(
              `It is $${c}$ times the position vector $\\langle x, y \\rangle$, a positive multiple.`,
              `它是位置向量 $\\langle x, y \\rangle$ 的 $${c}$ 倍，是正数倍。`,
            ),
            wrong: [
              {
                option: inward,
                why: t(
                  `The multiple $${c}$ is positive, so the arrows point away from the origin.`,
                  `倍数 $${c}$ 为正，所以箭头背离原点。`,
                ),
              },
              { option: ccw, why: parallel },
              { option: constant, why: notConstant },
            ],
          },
          {
            field: `\\langle -${cStr}y, ${cStr}x \\rangle`,
            at: `\\langle 0, ${c} \\rangle`,
            says: t(
              "pointing up: a quarter turn counterclockwise from the direction of $(1, 0)$.",
              "指向上：从 $(1, 0)$ 的方向逆时针转了四分之一圈。",
            ),
            right: ccw,
            look: t(
              "Its dot product with $\\langle x, y \\rangle$ is $0$, so each arrow is tangent to a circle about the origin.",
              "它与 $\\langle x, y \\rangle$ 的点积为 $0$，所以每个箭头都与以原点为圆心的圆相切。",
            ),
            wrong: [
              { option: outward, why: perpendicular },
              {
                option: cw,
                why: t(
                  `At $(1, 0)$ the arrow is $\\langle 0, ${c} \\rangle$, pointing up: that is counterclockwise.`,
                  `在 $(1, 0)$ 处箭头为 $\\langle 0, ${c} \\rangle$，指向上：这是逆时针。`,
                ),
              },
              { option: constant, why: notConstant },
            ],
          },
          {
            field: `\\langle ${cStr}y, -${cStr}x \\rangle`,
            at: `\\langle 0, -${c} \\rangle`,
            says: t(
              "pointing down: a quarter turn clockwise from the direction of $(1, 0)$.",
              "指向下：从 $(1, 0)$ 的方向顺时针转了四分之一圈。",
            ),
            right: cw,
            look: t(
              "Its dot product with $\\langle x, y \\rangle$ is $0$, so each arrow is tangent to a circle about the origin.",
              "它与 $\\langle x, y \\rangle$ 的点积为 $0$，所以每个箭头都与以原点为圆心的圆相切。",
            ),
            wrong: [
              { option: outward, why: perpendicular },
              {
                option: ccw,
                why: t(
                  `At $(1, 0)$ the arrow is $\\langle 0, -${c} \\rangle$, pointing down: that is clockwise.`,
                  `在 $(1, 0)$ 处箭头为 $\\langle 0, -${c} \\rangle$，指向下：这是顺时针。`,
                ),
              },
              { option: inward, why: perpendicular },
            ],
          },
          {
            field: `\\langle -${cStr}x, -${cStr}y \\rangle`,
            at: `\\langle -${c}, 0 \\rangle`,
            says: t("pointing straight toward the origin.", "正好指向原点。"),
            right: inward,
            look: t(
              `It is $-${c}$ times the position vector $\\langle x, y \\rangle$, a negative multiple.`,
              `它是位置向量 $\\langle x, y \\rangle$ 的 $-${c}$ 倍，是负数倍。`,
            ),
            wrong: [
              {
                option: outward,
                why: t(`The multiple $-${c}$ is negative, so the arrows point toward the origin.`, `倍数 $-${c}$ 为负，所以箭头指向原点。`),
              },
              { option: ccw, why: parallel },
              { option: constant, why: notConstant },
            ],
          },
        ];
        const item = rng.pick(kinds);
        return explainedChoice(rng, {
          prompt: t(
            `Which geometric description correctly characterizes the vector field $\\mathbf{F}(x, y) = ${item.field}$?`,
            `以下哪项几何描述正确表征了向量场 $\\mathbf{F}(x, y) = ${item.field}$？`,
          ),
          correct: item.right,
          wrong: item.wrong,
          solution: walked(
            [
              [["Compare with the position vector", "与位置向量比较"], item.look],
              [["Decide", "下结论"], t(`So the field ${item.right.en.toLowerCase()}.`, `所以该场${item.right["zh-CN"]}。`)],
            ],
            t(`At $(1, 0)$ the arrow is $${item.at}$, ${item.says.en}`, `在 $(1, 0)$ 处箭头为 $${item.at}$，${item.says["zh-CN"]}`),
          ),
        });
      },
    },
    {
      id: "the-direction-of-a-field-arrow-at-a-point",
      title: t("The direction of a field arrow at a point", "某点处场箭头的方向"),
      explanation: t(
        "A plot of a vector field draws the arrow $\\mathbf{F}(x, y)$ with its tail at $(x, y)$. The signs of the two components already tell the rough direction: a positive first component points right and a negative one left, while a positive second component points up and a negative one down. This is often enough to match a formula with a picture. For $\\mathbf{F} = \\langle y^2, x - 3 \\rangle$ at $(1, 2)$, $\\mathbf{F}(1, 2) = \\langle 4, -2 \\rangle$: right and down.\n\n> **Watch out.** Put both coordinates in with their signs: a product of two negatives is positive. The first entry is the horizontal part and the second the vertical part, never the other way round.",
        "向量场图在点 $(x, y)$ 处画出以该点为起点的箭头 $\\mathbf{F}(x, y)$。两个分量的符号已能说明大致方向：第一分量为正指向右、为负指向左；第二分量为正指向上、为负指向下。这通常足以把公式与图对应起来。对 $\\mathbf{F} = \\langle y^2, x - 3 \\rangle$ 在 $(1, 2)$ 处，$\\mathbf{F}(1, 2) = \\langle 4, -2 \\rangle$：向右下方。\n\n> **注意。** 两个坐标都要连同符号代入：两个负数之积为正。第一个分量是水平部分，第二个是竖直部分，不能弄反。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const swap = rng.int(0, 1) === 1;
        const x0 = rng.nonZero(-4, 4);
        const y0 = rng.nonZero(-4, 4);
        const P = swap ? a * x0 * y0 : a * y0;
        const Qv = swap ? b * x0 : b * x0 * y0;
        const Pe = swap ? poly([a, "xy"]) : poly([a, "y"]);
        const Qe = swap ? poly([b, "x"]) : poly([b, "xy"]);
        const Pwork = swap ? `${a} \\cdot ${paren(x0)} \\cdot ${paren(y0)}` : `${a} \\cdot ${paren(y0)}`;
        const Qwork = swap ? `${b} \\cdot ${paren(x0)}` : `${b} \\cdot ${paren(x0)} \\cdot ${paren(y0)}`;
        const dir = (h: number, v: number) =>
          h > 0
            ? v > 0
              ? t("Up and to the right", "向右上方")
              : t("Down and to the right", "向右下方")
            : v > 0
              ? t("Up and to the left", "向左上方")
              : t("Down and to the left", "向左下方");
        const right = dir(P, Qv);
        const horizontal = P > 0 ? t("right", "右") : t("left", "左");
        const vertical = Qv > 0 ? t("up", "上") : t("down", "下");
        return explainedChoice(rng, {
          prompt: t(
            `In a plot of $\\mathbf{F}(x, y) = \\langle ${Pe}, ${Qe} \\rangle$, which way does the arrow at $(${x0}, ${y0})$ point?`,
            `在 $\\mathbf{F}(x, y) = \\langle ${Pe}, ${Qe} \\rangle$ 的图中，点 $(${x0}, ${y0})$ 处的箭头指向哪里？`,
          ),
          correct: right,
          wrong: [
            {
              option: dir(-P, Qv),
              why: t(
                `The first entry is $${P}$, so the arrow points ${horizontal.en}.`,
                `第一个分量为 $${P}$，所以箭头指向${horizontal["zh-CN"]}。`,
              ),
            },
            {
              option: dir(P, -Qv),
              why: t(
                `The second entry is $${Qv}$, so the arrow points ${vertical.en}.`,
                `第二个分量为 $${Qv}$，所以箭头指向${vertical["zh-CN"]}。`,
              ),
            },
            {
              option: dir(-P, -Qv),
              why: t("Both signs are reversed: that is the direction of $-\\mathbf{F}$.", "两个符号都反了：那是 $-\\mathbf{F}$ 的方向。"),
            },
          ],
          solution: walked(
            [
              [
                ["Evaluate the field", "求场的值"],
                t(
                  `$P = ${Pwork} = ${P}$ and $Q = ${Qwork} = ${Qv}$, so $\\mathbf{F}(${x0}, ${y0}) = \\langle ${P}, ${Qv} \\rangle$.`,
                  `$P = ${Pwork} = ${P}$，$Q = ${Qwork} = ${Qv}$，所以 $\\mathbf{F}(${x0}, ${y0}) = \\langle ${P}, ${Qv} \\rangle$。`,
                ),
              ],
              [
                ["Read the signs", "读符号"],
                t(
                  `The first entry points ${horizontal.en} and the second ${vertical.en}: the arrow points ${right.en.toLowerCase()}.`,
                  `第一个分量指向${horizontal["zh-CN"]}，第二个指向${vertical["zh-CN"]}：箭头指${right["zh-CN"]}。`,
                ),
              ],
            ],
            t(
              `The tip of the arrow is at $(${x0} + ${paren(P)}, ${y0} + ${paren(Qv)}) = (${x0 + P}, ${y0 + Qv})$, which lies ${horizontal.en === "right" ? "to the right of" : "to the left of"} and ${vertical.en === "up" ? "above" : "below"} the tail $(${x0}, ${y0})$.`,
              `箭头的尖端在 $(${x0} + ${paren(P)}, ${y0} + ${paren(Qv)}) = (${x0 + P}, ${y0 + Qv})$，位于起点 $(${x0}, ${y0})$ 的${horizontal["zh-CN"]}${vertical["zh-CN"]}方。`,
            ),
          ),
        });
      },
    },
  ],
};

/** gradientVectorFields connects gradient fields to scalar potentials. */
export const gradientVectorFields: TopicDef = {
  id: "gradient-vector-fields",
  title: t("Gradient Vector Fields", "梯度向量场"),
  summary: t(
    "A gradient vector field is the gradient of a scalar potential function: F = ∇f = ⟨fx, fy, fz⟩.",
    "梯度向量场是标量势函数的梯度：F = ∇f = ⟨fx, fy, fz⟩。",
  ),
  intro: t(
    "For $f(x, y) = x^2y$, differentiate in each variable with the other held fixed: $f_x = 2xy$ and $f_y = x^2$, so $\\nabla f = \\langle 2xy, x^2 \\rangle$ and $\\nabla f(3, 1) = \\langle 6, 9 \\rangle$.\n\nCheck: moving from $(3, 1)$ to $(3.01, 1)$ changes $f$ from $9$ to $3.01^2 = 9.0601$, a change of about $0.06 = 6 \\cdot 0.01$, the first entry times the step.\n\nIn this lesson we compute gradient fields, the vector fields made of a function's partial derivatives.",
    "对 $f(x, y) = x^2y$，固定另一个变量，对每个变量求导：$f_x = 2xy$，$f_y = x^2$，所以 $\\nabla f = \\langle 2xy, x^2 \\rangle$，$\\nabla f(3, 1) = \\langle 6, 9 \\rangle$。\n\n检验：从 $(3, 1)$ 移到 $(3.01, 1)$，$f$ 从 $9$ 变为 $3.01^2 = 9.0601$，变化约为 $0.06 = 6 \\cdot 0.01$，正是第一个分量乘以步长。\n\n本课我们计算梯度场，即由函数的偏导数组成的向量场。",
  ),
  prerequisites: ["vector-fields"],
  encompasses: [{ topic: "vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-gradient-fields",
      title: t("Computing gradient fields", "计算梯度向量场"),
      explanation: t(
        "The gradient collects the partial derivatives into a vector, which at each point points in the direction in which the function increases fastest. If $f(x, y, z)$ is a scalar function, its gradient vector field $\\nabla f$ is defined by:\n\n$$\\nabla f = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right\\rangle.$$\n\nFor $f = 5x^2 - y^2 + 4z^2$, $\\nabla f = \\langle 10x, -2y, 8z \\rangle$, and at $(1, 2, -1)$ this is $\\langle 10, -4, -8 \\rangle$.\n\n> **Watch out.** The derivative of $ax^2$ is $2ax$: keep the factor $2$. Each entry differentiates in its own variable, in the order $x$, $y$, $z$, and the result is a vector, not the value of $f$.",
        "梯度把各个偏导数组成一个向量，它在每一点都指向函数增长最快的方向。若 $f(x, y, z)$ 为标量函数，其梯度向量场 $\\nabla f$ 定义为：\n\n$$\\nabla f = \\left\\langle \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right\\rangle$$\n\n对 $f = 5x^2 - y^2 + 4z^2$，$\\nabla f = \\langle 10x, -2y, 8z \\rangle$，在 $(1, 2, -1)$ 处为 $\\langle 10, -4, -8 \\rangle$。\n\n> **注意。** $ax^2$ 的导数是 $2ax$：不要丢掉因子 $2$。每个分量对自己的变量求导，顺序为 $x$、$y$、$z$，结果是向量，不是 $f$ 的值。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const [x, y, z]: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        const answer: Vec3 = [2 * a * x, 2 * b * y, 2 * c * z];
        const f = poly([a, "x^2"], [b, "y^2"], [c, "z^2"]);
        const value = a * x * x + b * y * y + c * z * z;
        return located(
          {
            prompt: t(
              `Compute the gradient vector field $\\nabla f$ of $f(x, y, z) = ${f}$ at the point $(${x}, ${y}, ${z})$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `计算函数 $f(x, y, z) = ${f}$ 在点 $(${x}, ${y}, ${z})$ 处的梯度向量 $\\nabla f$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Take the partial derivatives", "求偏导数"],
                  t(
                    `$\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle$.`,
                    `$\\nabla f = \\langle ${poly([2 * a, "x"])}, ${poly([2 * b, "y"])}, ${poly([2 * c, "z"])} \\rangle$。`,
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `At $(${x}, ${y}, ${z})$: $\\langle ${2 * a} \\cdot ${paren(x)}, ${2 * b} \\cdot ${paren(y)}, ${2 * c} \\cdot ${paren(z)} \\rangle = ${v3L(answer)}$.`,
                    `在 $(${x}, ${y}, ${z})$ 处：$\\langle ${2 * a} \\cdot ${paren(x)}, ${2 * b} \\cdot ${paren(y)}, ${2 * c} \\cdot ${paren(z)} \\rangle = ${v3L(answer)}$。`,
                  ),
                ],
              ],
              t(
                `Every term of $f$ has degree $2$, so $\\langle x, y, z \\rangle \\cdot \\nabla f = 2f$: here $${dot3([x, y, z], answer)} = 2 \\cdot ${paren(value)}$.`,
                `$f$ 的每一项都是二次的，所以 $\\langle x, y, z \\rangle \\cdot \\nabla f = 2f$：这里 $${dot3([x, y, z], answer)} = 2 \\cdot ${paren(value)}$。`,
              ),
            ),
          },
          [
            [
              [a * x, b * y, c * z],
              "The derivative of $ax^2$ is $2ax$; the factor $2$ is missing.",
              "$ax^2$ 的导数是 $2ax$；漏了因子 $2$。",
            ],
            [[answer[1], answer[0], answer[2]], "The first two entries are swapped; $f_x$ comes first.", "前两个分量对调了；$f_x$ 在前。"],
            [
              [a * x * x, b * y * y, c * z * z],
              "Those are the terms of $f$ at the point; the gradient differentiates them first.",
              "这是 $f$ 的各项在该点的值；梯度要先对它们求导。",
            ],
          ],
        );
      },
    },
    {
      id: "the-gradient-of-a-sum-of-products",
      title: t("The gradient of a sum of products", "乘积之和的梯度"),
      explanation: t(
        "The gradient field $\\nabla f = \\langle f_x, f_y, f_z \\rangle$ is found one partial derivative at a time, treating the other variables as constants. For $f = axy + byz + cxz$, each product contributes to the two variables it contains:\n\n$$\\nabla f = \\langle ay + cz,\\ ax + bz,\\ by + cx \\rangle.$$\n\nFor $f = 5xy - yz + 6xz$ at $(1, 1, 2)$, $\\nabla f = \\langle 5y + 6z, 5x - z, -y + 6x \\rangle = \\langle 17, 3, 5 \\rangle$.\n\n> **Watch out.** A product such as $axy$ adds to two entries, $ay$ to $f_x$ and $ax$ to $f_y$, and nothing to $f_z$. Each entry of this gradient therefore has two terms.",
        "梯度场 $\\nabla f = \\langle f_x, f_y, f_z \\rangle$ 逐个偏导求出，把其他变量视为常数。对 $f = axy + byz + cxz$，每个乘积对它所含的两个变量都有贡献：\n\n$$\\nabla f = \\langle ay + cz,\\ ax + bz,\\ by + cx \\rangle$$\n\n对 $f = 5xy - yz + 6xz$ 在 $(1, 1, 2)$ 处，$\\nabla f = \\langle 5y + 6z, 5x - z, -y + 6x \\rangle = \\langle 17, 3, 5 \\rangle$。\n\n> **注意。** 像 $axy$ 这样的乘积会出现在两个分量里：$f_x$ 中是 $ay$，$f_y$ 中是 $ax$，$f_z$ 中没有它。所以这个梯度的每个分量都有两项。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const [x, y, z] = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const ans: Vec3 = [a * y + c * z, a * x + b * z, b * y + c * x];
        const value = a * x * y + b * y * z + c * x * z;
        return located(
          {
            prompt: t(
              `Find $\\nabla f(${x}, ${y}, ${z})$ for $f(x, y, z) = ${poly([a, "xy"], [b, "yz"], [c, "xz"])}$.`,
              `对 $f(x, y, z) = ${poly([a, "xy"], [b, "yz"], [c, "xz"])}$ 求 $\\nabla f(${x}, ${y}, ${z})$。`,
            ),
            answer: ans,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["Differentiate in each variable", "对每个变量求导"],
                  t(
                    `$\\nabla f = \\langle ${poly([a, "y"], [c, "z"])}, ${poly([a, "x"], [b, "z"])}, ${poly([b, "y"], [c, "x"])} \\rangle$.`,
                    `$\\nabla f = \\langle ${poly([a, "y"], [c, "z"])}, ${poly([a, "x"], [b, "z"])}, ${poly([b, "y"], [c, "x"])} \\rangle$。`,
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(`At $(${x}, ${y}, ${z})$ this is $${v3L(ans)}$.`, `在 $(${x}, ${y}, ${z})$ 处为 $${v3L(ans)}$。`),
                ],
              ],
              t(
                `Every term of $f$ has degree $2$, so $\\langle x, y, z \\rangle \\cdot \\nabla f = 2f$: here $${dot3([x, y, z], ans)} = 2 \\cdot ${paren(value)}$.`,
                `$f$ 的每一项都是二次的，所以 $\\langle x, y, z \\rangle \\cdot \\nabla f = 2f$：这里 $${dot3([x, y, z], ans)} = 2 \\cdot ${paren(value)}$。`,
              ),
            ),
          },
          [
            [
              [a * y, b * z, c * x],
              "Each entry has two terms: every product adds to both of its variables.",
              "每个分量都有两项：每个乘积对它的两个变量都有贡献。",
            ],
            [[ans[1], ans[0], ans[2]], "The first two entries are swapped; $f_x$ comes first.", "前两个分量对调了；$f_x$ 在前。"],
          ],
        );
      },
    },
  ],
};

/** conservativeVectorFieldsInTheCartesianPlane tests for conservative fields in R^2. */
export const conservativeVectorFieldsInTheCartesianPlane: TopicDef = {
  id: "conservative-vector-fields-in-the-cartesian-plane",
  title: t("Conservative Vector Fields in the Cartesian Plane", "笛卡尔平面中的保守向量场"),
  summary: t(
    "On a simply connected domain, F = P i + Q j is conservative if and only if ∂P/∂y = ∂Q/∂x.",
    "在单连通区域上，F = P i + Q j 为保守场当且仅当 ∂P/∂y = ∂Q/∂x。",
  ),
  intro: t(
    "Is $\\mathbf{F} = \\langle 2xy + 1, x^2 + 3 \\rangle$ the gradient of some function? Compare the cross partials: $\\frac{\\partial P}{\\partial y} = 2x$ and $\\frac{\\partial Q}{\\partial x} = 2x$. They agree everywhere, and the field is defined on the whole plane, so it is conservative; indeed $f = x^2y + x + 3y$ works.\n\nCheck: $f_x = 2xy + 1$ and $f_y = x^2 + 3$, the two entries of $\\mathbf{F}$.\n\nIn this lesson we test plane fields for being conservative by comparing $\\frac{\\partial P}{\\partial y}$ with $\\frac{\\partial Q}{\\partial x}$.",
    "$\\mathbf{F} = \\langle 2xy + 1, x^2 + 3 \\rangle$ 是某个函数的梯度吗？比较交叉偏导：$\\frac{\\partial P}{\\partial y} = 2x$，$\\frac{\\partial Q}{\\partial x} = 2x$。它们处处相等，而场定义在整个平面上，所以它是保守的；事实上 $f = x^2y + x + 3y$ 就满足要求。\n\n检验：$f_x = 2xy + 1$，$f_y = x^2 + 3$，正是 $\\mathbf{F}$ 的两个分量。\n\n本课我们通过比较 $\\frac{\\partial P}{\\partial y}$ 与 $\\frac{\\partial Q}{\\partial x}$ 来判断平面向量场是否保守。",
  ),
  prerequisites: ["gradient-vector-fields"],
  encompasses: [{ topic: "gradient-vector-fields", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "testing-for-conservative-vector-fields",
      title: t("Testing for conservative vector fields", "判别保守向量场"),
      explanation: t(
        "Let $\\mathbf{F}(x, y) = P(x, y)\\mathbf{i} + Q(x, y)\\mathbf{j}$ have continuous first partial derivatives on an open simply connected region $D$. Then $\\mathbf{F}$ is conservative if and only if:\n\n$$\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}.$$\n\nFor $\\mathbf{F} = \\langle kxy^2, x^2y + 1 \\rangle$, $\\frac{\\partial P}{\\partial y} = 2kxy$ and $\\frac{\\partial Q}{\\partial x} = 2xy$, so the field is conservative exactly when $k = 1$.\n\n> **Watch out.** Differentiate $P$ in $y$ and $Q$ in $x$, the variable that is not its own; $\\frac{\\partial P}{\\partial x}$ and $\\frac{\\partial Q}{\\partial y}$ play no part. The two sides are equal, with no minus sign between them.",
        "设 $\\mathbf{F}(x, y) = P(x, y)\\mathbf{i} + Q(x, y)\\mathbf{j}$ 在开单连通区域 $D$ 上具有连续一阶偏导数。则 $\\mathbf{F}$ 为保守场当且仅当：\n\n$$\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$$\n\n对 $\\mathbf{F} = \\langle kxy^2, x^2y + 1 \\rangle$，$\\frac{\\partial P}{\\partial y} = 2kxy$，$\\frac{\\partial Q}{\\partial x} = 2xy$，所以场保守当且仅当 $k = 1$。\n\n> **注意。** $P$ 对 $y$ 求导，$Q$ 对 $x$ 求导，即对不是“自己”的那个变量；$\\frac{\\partial P}{\\partial x}$ 与 $\\frac{\\partial Q}{\\partial y}$ 不起作用。两边相等，中间没有负号。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.nonZero(-25, 25);
        const ans = 2 * A;
        const Q2 = poly([A, "x^2"], [2, "y^2"]);
        return numberProblem({
          prompt: t(
            `Find the value of the constant $k$ that makes the vector field $\\mathbf{F}(x, y) = \\left\\langle k x y, ${Q2} \\right\\rangle$ conservative on $\\mathbb{R}^2$.`,
            `求使向量场 $\\mathbf{F}(x, y) = \\left\\langle k x y, ${Q2} \\right\\rangle$ 在 $\\mathbb{R}^2$ 上为保守场的常数 $k$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              A,
              `$\\frac{\\partial}{\\partial x}(${poly([A, "x^2"])}) = ${2 * A}x$: the derivative of $x^2$ brings a factor $2$.`,
              `$\\frac{\\partial}{\\partial x}(${poly([A, "x^2"])}) = ${2 * A}x$：$x^2$ 求导带出因子 $2$。`,
            ),
            why(
              -ans,
              "The test is $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$, with no minus sign.",
              "检验条件是 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$，没有负号。",
            ),
            why(
              4,
              "That compares $\\frac{\\partial P}{\\partial x} = ky$ with $\\frac{\\partial Q}{\\partial y} = 4y$; the test uses the cross partials.",
              "这是比较 $\\frac{\\partial P}{\\partial x} = ky$ 与 $\\frac{\\partial Q}{\\partial y} = 4y$；检验用的是交叉偏导。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the cross partials", "求交叉偏导"],
                t(
                  `$\\frac{\\partial P}{\\partial y} = \\frac{\\partial}{\\partial y}(kxy) = kx$ and $\\frac{\\partial Q}{\\partial x} = ${2 * A}x$.`,
                  `$\\frac{\\partial P}{\\partial y} = \\frac{\\partial}{\\partial y}(kxy) = kx$，$\\frac{\\partial Q}{\\partial x} = ${2 * A}x$。`,
                ),
              ],
              [
                ["Match them for every $x$", "对每个 $x$ 都相等"],
                t(`$kx = ${2 * A}x$ for all $x$ gives $k = ${ans}$.`, `对所有 $x$ 有 $kx = ${2 * A}x$，得 $k = ${ans}$。`),
              ],
            ],
            t(
              `With $k = ${ans}$, $f = ${poly([A, "x^2y"], [Q.of(2, 3), "y^3"])}$ has $f_x = ${poly([ans, "xy"])}$ and $f_y = ${Q2}$, so $\\mathbf{F} = \\nabla f$.`,
              `取 $k = ${ans}$，$f = ${poly([A, "x^2y"], [Q.of(2, 3), "y^3"])}$ 满足 $f_x = ${poly([ans, "xy"])}$，$f_y = ${Q2}$，所以 $\\mathbf{F} = \\nabla f$。`,
            ),
          ),
        });
      },
    },
    {
      id: "deciding-whether-a-polynomial-field-is-conservative",
      title: t("Deciding whether a polynomial field is conservative", "判断多项式场是否保守"),
      explanation: t(
        "On the whole plane, $\\mathbf{F} = \\langle P, Q \\rangle$ with continuous partial derivatives is conservative exactly when $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$ at every point. For $P = px^2y + r$ and $Q = qx^3 + sy$, the test gives $px^2 = 3qx^2$, which holds for every $x$ only when $p = 3q$. So $\\langle 12x^2y, 4x^3 + y \\rangle$ is conservative, since $12 = 3 \\cdot 4$.\n\n> **Watch out.** Equality at a single point is not enough: at $x = 0$ both sides are $0$ whatever $p$ and $q$ are. The two partials must be the same polynomial.",
        "在整个平面上，偏导连续的 $\\mathbf{F} = \\langle P, Q \\rangle$ 是保守的，当且仅当每点都有 $\\frac{\\partial P}{\\partial y} = \\frac{\\partial Q}{\\partial x}$。对 $P = px^2y + r$，$Q = qx^3 + sy$，检验给出 $px^2 = 3qx^2$，只有当 $p = 3q$ 时才对所有 $x$ 成立。所以 $\\langle 12x^2y, 4x^3 + y \\rangle$ 是保守的，因为 $12 = 3 \\cdot 4$。\n\n> **注意。** 在单个点相等是不够的：在 $x = 0$ 处无论 $p$、$q$ 为何两边都是 $0$。两个偏导必须是同一个多项式。",
      ),
      generate(rng: Rng): Problem {
        const q = rng.nonZero(-3, 3);
        const yes = rng.int(0, 1) === 0;
        const p = yes ? 3 * q : rng.pick([q, 2 * q, -3 * q, 4 * q]);
        const r = rng.int(-5, 5);
        const s = rng.nonZero(-5, 5);
        return verdictChoice(rng, {
          prompt: t(
            `Is $\\mathbf{F}(x, y) = \\langle ${poly([p, "x^2y"], [r, ""])}, ${poly([q, "x^3"], [s, "y"])} \\rangle$ conservative on the plane?`,
            `$\\mathbf{F}(x, y) = \\langle ${poly([p, "x^2y"], [r, ""])}, ${poly([q, "x^3"], [s, "y"])} \\rangle$ 在平面上是保守场吗？`,
          ),
          holds: yes,
          yes: t(
            "$\\frac{\\partial P}{\\partial y}$ and $\\frac{\\partial Q}{\\partial x}$ are the same polynomial",
            "$\\frac{\\partial P}{\\partial y}$ 与 $\\frac{\\partial Q}{\\partial x}$ 是同一个多项式",
          ),
          no: t(
            "$\\frac{\\partial P}{\\partial y}$ and $\\frac{\\partial Q}{\\partial x}$ differ at some point",
            "$\\frac{\\partial P}{\\partial y}$ 与 $\\frac{\\partial Q}{\\partial x}$ 在某点不相等",
          ),
          yesWrong: t(
            "$\\frac{\\partial P}{\\partial y}$ and $\\frac{\\partial Q}{\\partial x}$ are equal at $x = 0$",
            "$\\frac{\\partial P}{\\partial y}$ 与 $\\frac{\\partial Q}{\\partial x}$ 在 $x = 0$ 处相等",
          ),
          noWrong: t("$P$ and $Q$ have different degrees", "$P$ 与 $Q$ 的次数不同"),
          solution: walked(
            [
              [
                ["Take the cross partials", "求交叉偏导"],
                t(
                  `$\\frac{\\partial P}{\\partial y} = ${poly([p, "x^2"])}$ and $\\frac{\\partial Q}{\\partial x} = ${poly([3 * q, "x^2"])}$.`,
                  `$\\frac{\\partial P}{\\partial y} = ${poly([p, "x^2"])}$，$\\frac{\\partial Q}{\\partial x} = ${poly([3 * q, "x^2"])}$。`,
                ),
              ],
              [
                ["Compare", "比较"],
                yes
                  ? t("They are the same polynomial, so the field is conservative.", "二者是同一个多项式，所以场是保守的。")
                  : t(
                      `They differ, since $${p} \\ne ${3 * q}$, so the field is not conservative.`,
                      `由于 $${p} \\ne ${3 * q}$，二者不同，所以场不是保守的。`,
                    ),
              ],
            ],
            yes
              ? t(
                  `$f = ${poly([q, "x^3y"], [r, "x"], [Q.of(s, 2), "y^2"])}$ has $\\nabla f = \\langle ${poly([p, "x^2y"], [r, ""])}, ${poly([q, "x^3"], [s, "y"])} \\rangle$.`,
                  `$f = ${poly([q, "x^3y"], [r, "x"], [Q.of(s, 2), "y^2"])}$ 满足 $\\nabla f = \\langle ${poly([p, "x^2y"], [r, ""])}, ${poly([q, "x^3"], [s, "y"])} \\rangle$。`,
                )
              : t(
                  `At $x = 1$ the two partials are $${p}$ and $${3 * q}$, so they are not equal there.`,
                  `在 $x = 1$ 处两个偏导分别为 $${p}$ 和 $${3 * q}$，并不相等。`,
                ),
          ),
        });
      },
    },
  ],
};

/** calculatingPotentialFunctions finds a scalar potential by integration. */
export const calculatingPotentialFunctions: TopicDef = {
  id: "calculating-potential-functions",
  title: t("Calculating Potential Functions", "计算势函数"),
  summary: t(
    "A potential function f satisfies ∇f = F and is found by partial integration and comparing components.",
    "势函数 f 满足 ∇f = F，可通过偏积分和比较分量求得。",
  ),
  intro: t(
    "Find $f$ with $\\nabla f = \\langle y\\cos x, \\sin x + 2y \\rangle$. Integrating the first entry in $x$ gives $f = y\\sin x + g(y)$. Then $f_y = \\sin x + g'(y)$ must equal $\\sin x + 2y$, so $g'(y) = 2y$ and $g(y) = y^2 + C$: $f = y\\sin x + y^2 + C$.\n\nCheck: $f_x = y\\cos x$ and $f_y = \\sin x + 2y$, the two entries of the field.\n\nIn this lesson we find potential functions by integrating one component and fixing the leftover function with the others.",
    "求 $f$ 使 $\\nabla f = \\langle y\\cos x, \\sin x + 2y \\rangle$。把第一个分量对 $x$ 积分得 $f = y\\sin x + g(y)$。于是 $f_y = \\sin x + g'(y)$ 必须等于 $\\sin x + 2y$，所以 $g'(y) = 2y$，$g(y) = y^2 + C$：$f = y\\sin x + y^2 + C$。\n\n检验：$f_x = y\\cos x$，$f_y = \\sin x + 2y$，正是场的两个分量。\n\n本课我们通过积分一个分量、再用其余分量确定剩下的函数来求势函数。",
  ),
  prerequisites: ["conservative-vector-fields-in-the-cartesian-plane"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-potential-functions-by-integration",
      title: t("Finding potential functions by integration", "通过积分求势函数"),
      explanation: t(
        "To find a potential function $f(x, y)$ such that $\\nabla f = \\langle P, Q \\rangle$:\n\n1. Integrate $P$ with respect to $x$: $f(x, y) = \\int P\\,dx + g(y)$.\n2. Differentiate with respect to $y$: $\\frac{\\partial f}{\\partial y} = Q(x, y)$ to determine $g'(y)$ and $g(y)$.\n\nFor $\\langle 2x + 5y, 5x - 6y \\rangle$, step 1 gives $x^2 + 5xy + g(y)$, step 2 gives $5x + g'(y) = 5x - 6y$, so $g = -3y^2$ and $f = x^2 + 5xy - 3y^2$.\n\n> **Watch out.** The constant of integrating in $x$ is a function $g(y)$, not a number. Do not add the integral of $Q$ in full as well: the $xy$ term would then be counted twice.",
        "求满足 $\\nabla f = \\langle P, Q \\rangle$ 的势函数 $f(x, y)$：\n\n1. 将 $P$ 对 $x$ 偏积分：$f(x, y) = \\int P\\,dx + g(y)$。\n2. 对 $y$ 求偏导：令 $\\frac{\\partial f}{\\partial y} = Q(x, y)$，从而确定 $g'(y)$ 和 $g(y)$。\n\n对 $\\langle 2x + 5y, 5x - 6y \\rangle$，第一步得 $x^2 + 5xy + g(y)$，第二步得 $5x + g'(y) = 5x - 6y$，所以 $g = -3y^2$，$f = x^2 + 5xy - 3y^2$。\n\n> **注意。** 对 $x$ 积分得到的“常数”是函数 $g(y)$，不是数。不要再把 $Q$ 的积分整个加上：那样 $xy$ 项会算两次。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 4);
        const b = rng.nonZero(-3, 3);
        const c = rng.int(1, 4);
        const ans = poly([a, "x^2"], [b, "xy"], [c, "y^2"]);
        const P = poly([2 * a, "x"], [b, "y"]);
        const Qf = poly([b, "x"], [2 * c, "y"]);
        return expressionProblem({
          prompt: t(
            `Find the potential function $f(x, y)$ satisfying $\\nabla f(x, y) = \\left\\langle ${P}, ${Qf} \\right\\rangle$ with $f(0, 0) = 0$.`,
            `求满足 $\\nabla f(x, y) = \\left\\langle ${P}, ${Qf} \\right\\rangle$ 且 $f(0, 0) = 0$ 的势函数 $f(x, y)$。`,
          ),
          answer: ans,
          mistakes: [
            say(
              poly([a, "x^2"], [2 * b, "xy"], [c, "y^2"]),
              `That adds the integrals of both entries, so the $${poly([b, "xy"])}$ term is counted twice.`,
              `这是把两个分量的积分都加上了，所以 $${poly([b, "xy"])}$ 项算了两次。`,
            ),
            say(
              poly([2 * a, "x^2"], [b, "xy"], [2 * c, "y^2"]),
              `$\\int ${2 * a}x\\,dx = ${poly([a, "x^2"])}$: integrating $x$ gives $\\frac{x^2}{2}$.`,
              `$\\int ${2 * a}x\\,dx = ${poly([a, "x^2"])}$：$x$ 积分得 $\\frac{x^2}{2}$。`,
            ),
            say(
              poly([a, "x^2"], [b, "xy"]),
              `That leaves out $g(y) = ${poly([c, "y^2"])}$; its derivative must supply the $${poly([2 * c, "y"])}$ in the second entry.`,
              `这漏掉了 $g(y) = ${poly([c, "y^2"])}$；第二个分量中的 $${poly([2 * c, "y"])}$ 要靠它的导数提供。`,
            ),
          ],
          solution: walked(
            [
              [
                ["Integrate the first entry in $x$", "把第一个分量对 $x$ 积分"],
                t(`$f(x, y) = ${poly([a, "x^2"], [b, "xy"])} + g(y)$.`, `$f(x, y) = ${poly([a, "x^2"], [b, "xy"])} + g(y)$。`),
              ],
              [
                ["Match the second entry", "与第二个分量比较"],
                t(
                  `$f_y = ${poly([b, "x"])} + g'(y)$ must equal $${Qf}$, so $g'(y) = ${poly([2 * c, "y"])}$ and $g(y) = ${poly([c, "y^2"])} + C$.`,
                  `$f_y = ${poly([b, "x"])} + g'(y)$ 必须等于 $${Qf}$，所以 $g'(y) = ${poly([2 * c, "y"])}$，$g(y) = ${poly([c, "y^2"])} + C$。`,
                ),
              ],
              [
                ["Fix the constant", "确定常数"],
                t(`$f(0, 0) = 0$ gives $C = 0$, so $f(x, y) = ${ans}$.`, `由 $f(0, 0) = 0$ 得 $C = 0$，所以 $f(x, y) = ${ans}$。`),
              ],
            ],
            t(
              `$f_x = ${P}$ and $f_y = ${Qf}$, the two entries of the field, and $f(0, 0) = 0$.`,
              `$f_x = ${P}$，$f_y = ${Qf}$，正是场的两个分量，且 $f(0, 0) = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-potential-function-in-three-variables",
      title: t("A potential function in three variables", "三元势函数"),
      explanation: t(
        "In three variables, integrate the first component in $x$, then fix the leftover function of $y$ and $z$ using the second component, and finally fix the leftover function of $z$ using the third. For $\\mathbf{F} = \\langle 2ax + dy, dx + ez, ey + 2cz \\rangle$ the steps give\n\n$$f(x, y, z) = ax^2 + dxy + eyz + cz^2,$$\n\nup to a constant, which the condition $f(0, 0, 0) = 0$ sets to zero. For $\\langle 2x + 5y, 5x + z, y + 8z \\rangle$ this is $f = x^2 + 5xy + yz + 4z^2$, and $f(1, 1, 1) = 11$.\n\n> **Watch out.** A mixed term such as $dxy$ shows up in two components, $dy$ in the first and $dx$ in the second, but belongs in $f$ only once. A square term $2ax$ integrates to $ax^2$, not $2ax^2$.",
        "在三个变量中，先把第一个分量对 $x$ 积分，再用第二个分量确定剩下的 $y$、$z$ 的函数，最后用第三个分量确定剩下的 $z$ 的函数。对 $\\mathbf{F} = \\langle 2ax + dy, dx + ez, ey + 2cz \\rangle$，这些步骤给出\n\n$$f(x, y, z) = ax^2 + dxy + eyz + cz^2,$$\n\n相差一个常数，条件 $f(0, 0, 0) = 0$ 使它为零。对 $\\langle 2x + 5y, 5x + z, y + 8z \\rangle$，得 $f = x^2 + 5xy + yz + 4z^2$，$f(1, 1, 1) = 11$。\n\n> **注意。** 像 $dxy$ 这样的混合项在两个分量里都出现（第一个分量中是 $dy$，第二个中是 $dx$），但在 $f$ 中只算一次。平方项 $2ax$ 积分得 $ax^2$，不是 $2ax^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const d = rng.nonZero(-4, 4);
        const e = rng.nonZero(-4, 4);
        const [x, y, z] = [rng.int(-2, 3), rng.int(-2, 3), rng.nonZero(-2, 3)];
        const ans = a * x * x + d * x * y + e * y * z + c * z * z;
        const f = poly([a, "x^2"], [d, "xy"], [e, "yz"], [c, "z^2"]);
        return numberProblem({
          prompt: t(
            `$\\nabla f = \\langle ${poly([2 * a, "x"], [d, "y"])}, ${poly([d, "x"], [e, "z"])}, ${poly([e, "y"], [2 * c, "z"])} \\rangle$ and $f(0, 0, 0) = 0$. Find $f(${x}, ${y}, ${z})$.`,
            `$\\nabla f = \\langle ${poly([2 * a, "x"], [d, "y"])}, ${poly([d, "x"], [e, "z"])}, ${poly([e, "y"], [2 * c, "z"])} \\rangle$，$f(0, 0, 0) = 0$。求 $f(${x}, ${y}, ${z})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              2 * a * x * x + d * x * y + e * y * z + 2 * c * z * z,
              `$\\int ${2 * a}x\\,dx = ${poly([a, "x^2"])}$ and $\\int ${2 * c}z\\,dz = ${poly([c, "z^2"])}$: integrating halves the square terms.`,
              `$\\int ${2 * a}x\\,dx = ${poly([a, "x^2"])}$，$\\int ${2 * c}z\\,dz = ${poly([c, "z^2"])}$：积分后平方项要减半。`,
            ),
            why(
              a * x * x + 2 * d * x * y + 2 * e * y * z + c * z * z,
              "Each mixed term appears in two components but belongs in $f$ once.",
              "每个混合项在两个分量中出现，但在 $f$ 中只算一次。",
            ),
            why(a * x * x + c * z * z, "The mixed terms $dxy$ and $eyz$ are part of $f$ too.", "混合项 $dxy$ 与 $eyz$ 也是 $f$ 的一部分。"),
          ]),
          solution: walked(
            [
              [
                ["Integrate the first entry in $x$", "把第一个分量对 $x$ 积分"],
                t(`$f = ${poly([a, "x^2"], [d, "xy"])} + g(y, z)$.`, `$f = ${poly([a, "x^2"], [d, "xy"])} + g(y, z)$。`),
              ],
              [
                ["Use the second entry", "用第二个分量"],
                t(
                  `$f_y = ${poly([d, "x"])} + g_y$ must be $${poly([d, "x"], [e, "z"])}$, so $g_y = ${poly([e, "z"])}$ and $g = ${poly([e, "yz"])} + h(z)$.`,
                  `$f_y = ${poly([d, "x"])} + g_y$ 必须等于 $${poly([d, "x"], [e, "z"])}$，所以 $g_y = ${poly([e, "z"])}$，$g = ${poly([e, "yz"])} + h(z)$。`,
                ),
              ],
              [
                ["Use the third entry and evaluate", "用第三个分量并求值"],
                t(
                  `$f_z = ${poly([e, "y"])} + h'(z)$ must be $${poly([e, "y"], [2 * c, "z"])}$, so $h = ${poly([c, "z^2"])}$ with constant $0$. Then $f = ${f}$ and $f(${x}, ${y}, ${z}) = ${ans}$.`,
                  `$f_z = ${poly([e, "y"])} + h'(z)$ 必须等于 $${poly([e, "y"], [2 * c, "z"])}$，所以 $h = ${poly([c, "z^2"])}$，常数为 $0$。于是 $f = ${f}$，$f(${x}, ${y}, ${z}) = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The terms at the point are $${a * x * x}$, $${d * x * y}$, $${e * y * z}$ and $${c * z * z}$, which add up to $${ans}$; and $f_x = ${poly([2 * a, "x"], [d, "y"])}$, the first entry.`,
              `各项在该点的值为 $${a * x * x}$、$${d * x * y}$、$${e * y * z}$、$${c * z * z}$，和为 $${ans}$；且 $f_x = ${poly([2 * a, "x"], [d, "y"])}$，正是第一个分量。`,
            ),
          ),
        });
      },
    },
  ],
};

/** connectedAndSimplyConnectedRegions topological properties of planar domains. */
export const connectedAndSimplyConnectedRegions: TopicDef = {
  id: "connected-and-simply-connected-regions",
  title: t("Connected and Simply-Connected Regions", "连通与单连通区域"),
  summary: t(
    "A region is connected if any two points can be joined by a path, and simply connected if every closed curve can be shrunk to a point without leaving the region.",
    "若区域内任意两点可用路径相连则为连通区域；若每条闭曲线均可在区域内连续收缩为一点（无孔洞）则为单连通区域。",
  ),
  intro: t(
    "The annulus $1 < x^2 + y^2 < 4$ is connected: any two of its points can be joined by going around the ring. But the circle $x^2 + y^2 = 2$ inside it cannot be shrunk to a point without crossing the missing disk $x^2 + y^2 \\le 1$, so the annulus is not simply connected.\n\nCheck: fill in the hole to get the disk $x^2 + y^2 < 4$; there the same circle shrinks to the origin, so the hole is exactly what stopped it.\n\nIn this lesson we decide whether plane regions are connected and whether they are simply connected.",
    "圆环 $1 < x^2 + y^2 < 4$ 是连通的：其中任意两点都能沿环绕行相连。但其中的圆 $x^2 + y^2 = 2$ 不穿过缺失的圆盘 $x^2 + y^2 \\le 1$ 就无法收缩为一点，所以圆环不是单连通的。\n\n检验：把洞补上得到圆盘 $x^2 + y^2 < 4$；在那里同一个圆可以收缩到原点，可见挡住它的正是那个洞。\n\n本课我们判断平面区域是否连通、是否单连通。",
  ),
  prerequisites: ["conservative-vector-fields-in-the-cartesian-plane"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "classifying-topological-properties-of-planar-regions",
      title: t("Classifying topological properties of planar regions", "分类平面区域的拓扑性质"),
      explanation: t(
        "A region $D$ in the plane is:\n\n- **Connected**: any two points in $D$ can be joined by a continuous curve lying entirely in $D$.\n- **Simply connected**: $D$ is connected and every simple closed curve in $D$ encloses only points in $D$ (intuitively, $D$ has no 'holes').\n\nThe plane with the segment from $(-1, 0)$ to $(1, 0)$ removed is connected, since a path can go around the segment, but not simply connected: the circle $x^2 + y^2 = 4$ encloses points of the segment, which are missing.\n\n> **Watch out.** Simply connected includes connected, so 'simply connected but not connected' never happens. Removing even one point makes a hole.",
        "平面区域 $D$：\n\n- **连通**：$D$ 内任意两点均可用完全位于 $D$ 内的连续曲线连接。\n- **单连通**：$D$ 连通，且 $D$ 内的任意简单闭曲线所围成的区域全属于 $D$（直观上，$D$ 没有“孔洞”）。\n\n去掉从 $(-1, 0)$ 到 $(1, 0)$ 的线段后的平面是连通的，因为路径可以绕过线段；但它不是单连通的：圆 $x^2 + y^2 = 4$ 围住了线段上缺失的点。\n\n> **注意。** 单连通本身包含连通，所以“单连通但不连通”不可能出现。哪怕只去掉一个点，也会形成一个洞。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 9);
        const r1 = rng.int(1, 4);
        const r2 = rng.int(5, 10);
        const d = rng.int(2, 8);
        const both = t("Connected and simply connected", "连通且单连通");
        const holed = t("Connected but not simply connected", "连通但非单连通");
        const impossible = t("Simply connected but not connected", "单连通但非连通");
        const neither = t("Neither connected nor simply connected", "既非连通亦非单连通");
        const never = t(
          "Simply connected regions are connected by definition, so this never happens.",
          "单连通区域按定义就是连通的，所以这种情况不会出现。",
        );
        const joined = t("Any two of its points can be joined by a path inside it.", "其中任意两点都能用区域内的路径相连。");
        const apart = t(
          "Points in different disks cannot be joined by a path inside the region.",
          "位于不同圆盘内的点无法用区域内的路径相连。",
        );
        const scenarios = [
          {
            desc: t(`the open disk $x^2 + y^2 < ${R * R}$`, `开圆盘 $x^2 + y^2 < ${R * R}$`),
            right: both,
            connected: t("Any two points of the disk are joined by the segment between them.", "圆盘内任意两点由它们之间的线段相连。"),
            holes: t("The disk has no holes.", "圆盘没有洞。"),
            check: t(
              `A loop in the disk can be pulled straight toward the origin, staying inside $x^2 + y^2 < ${R * R}$.`,
              `圆盘内的环路可以直接向原点收拢，始终留在 $x^2 + y^2 < ${R * R}$ 内。`,
            ),
            wrong: [
              {
                option: holed,
                why: t("There is no hole: every loop in it can be shrunk inside it.", "没有洞：其中每条环路都能在区域内收缩。"),
              },
              { option: impossible, why: never },
              { option: neither, why: joined },
            ],
          },
          {
            desc: t(`the punctured disk $0 < x^2 + y^2 < ${R * R}$`, `去心圆盘 $0 < x^2 + y^2 < ${R * R}$`),
            right: holed,
            connected: t("Any two points can be joined by a path that avoids the origin.", "任意两点都能用避开原点的路径相连。"),
            holes: t("The missing origin is a hole.", "缺失的原点是一个洞。"),
            check: t(
              `The circle $x^2 + y^2 = ${Q.of(R * R, 4).toLatex()}$ lies in the region and goes around the origin, so it cannot be shrunk to a point inside it.`,
              `圆 $x^2 + y^2 = ${Q.of(R * R, 4).toLatex()}$ 位于区域内并绕着原点，所以无法在区域内收缩为一点。`,
            ),
            wrong: [
              {
                option: both,
                why: t(
                  "A loop around the missing origin cannot be shrunk to a point inside the region.",
                  "绕缺失原点的环路无法在区域内收缩为一点。",
                ),
              },
              { option: neither, why: joined },
              { option: impossible, why: never },
            ],
          },
          {
            desc: t(`the open annulus $${r1 * r1} < x^2 + y^2 < ${r2 * r2}$`, `开圆环 $${r1 * r1} < x^2 + y^2 < ${r2 * r2}$`),
            right: holed,
            connected: t("Any two points can be joined by going around the ring.", "任意两点都能沿环绕行相连。"),
            holes: t(`The inner disk $x^2 + y^2 \\le ${r1 * r1}$ is a hole.`, `内圆盘 $x^2 + y^2 \\le ${r1 * r1}$ 是一个洞。`),
            check: t(
              `The circle $x^2 + y^2 = ${r1 * r2}$ lies in the annulus and goes around the hole, so it cannot be shrunk inside it.`,
              `圆 $x^2 + y^2 = ${r1 * r2}$ 位于圆环内并绕着洞，所以无法在圆环内收缩。`,
            ),
            wrong: [
              {
                option: both,
                why: t(
                  "A loop around the inner hole cannot be shrunk to a point inside the region.",
                  "绕内部洞的环路无法在区域内收缩为一点。",
                ),
              },
              { option: neither, why: joined },
              { option: impossible, why: never },
            ],
          },
          {
            desc: t(
              `the union of two disjoint disks $(x-${d})^2 + y^2 < 1$ and $(x+${d})^2 + y^2 < 1$`,
              `两个互不相交的圆盘 $(x-${d})^2 + y^2 < 1$ 与 $(x+${d})^2 + y^2 < 1$ 的并集`,
            ),
            right: neither,
            connected: apart,
            holes: t("A region that is not connected is not simply connected either.", "不连通的区域也不是单连通的。"),
            check: t(
              `The disks are centred $${2 * d}$ apart with radius $1$ each, and $${2 * d} > 2$, so they do not touch.`,
              `两个圆盘的圆心相距 $${2 * d}$，半径都是 $1$，而 $${2 * d} > 2$，所以它们不相接。`,
            ),
            wrong: [
              { option: both, why: apart },
              { option: holed, why: apart },
              { option: impossible, why: never },
            ],
          },
        ];
        const item = rng.pick(scenarios);
        return explainedChoice(rng, {
          prompt: t(
            `Classify the topological property of the following region in $\\mathbb{R}^2$: ${item.desc.en}.`,
            `对 $\\mathbb{R}^2$ 中的以下区域分类其拓扑性质：${item.desc["zh-CN"]}。`,
          ),
          correct: item.right,
          wrong: item.wrong,
          solution: walked(
            [
              [["Decide whether it is connected", "判断是否连通"], item.connected],
              [["Look for holes", "寻找洞"], item.holes],
            ],
            item.check,
          ),
        });
      },
    },
    {
      id: "picking-the-simply-connected-region",
      figure: multivariableDrawings1["connected-and-simply-connected-regions#picking-the-simply-connected-region"],
      title: t("Picking the simply connected region", "挑出单连通区域"),
      explanation: t(
        "A region is connected if any two of its points can be joined by a path inside it, and simply connected if, in addition, every closed curve in it can be shrunk to a point without leaving it. A disk, a half-plane and a rectangle are simply connected. Even the plane with a ray removed is simply connected, because a loop cannot surround the ray's endpoint without crossing the ray. An annulus, a punctured disk or the plane without the origin each have a hole, and two separate disks are not even connected. The plane with the segment from $(0, 0)$ to $(1, 0)$ removed is not simply connected: the circle of radius $2$ about the origin surrounds the segment.\n\n> **Watch out.** A removed ray that runs off to infinity makes no hole, but a removed point or a removed segment of finite length does. Being unbounded, like a half-plane, does not stop a region from being simply connected.",
        "若区域中任意两点都能用区域内的路径连接，则区域连通；若此外区域内每条闭曲线都能在不离开区域的情况下收缩为一点，则区域单连通。圆盘、半平面与矩形都是单连通的。甚至去掉一条射线的平面也是单连通的，因为环路不穿过射线就无法绕住射线端点。圆环、去心圆盘或去掉原点的平面都有洞，而两个分离的圆盘甚至不连通。去掉从 $(0, 0)$ 到 $(1, 0)$ 的线段后的平面不是单连通的：以原点为圆心、半径为 $2$ 的圆绕住了这条线段。\n\n> **注意。** 去掉一条伸向无穷远的射线不会形成洞，但去掉一个点或一条有限长的线段会。像半平面那样无界，并不妨碍区域单连通。",
      ),
      generate(rng: Rng): Problem {
        const R = rng.int(2, 6);
        const r = rng.int(1, R - 1);
        const c = rng.int(-4, 4);
        const disks = t(
          `the union of the disks $x^2 + y^2 < 1$ and $(x - ${R + 2})^2 + y^2 < 1$`,
          `圆盘 $x^2 + y^2 < 1$ 与 $(x - ${R + 2})^2 + y^2 < 1$ 之并`,
        );
        const regions: [Text, boolean, Text][] = [
          [
            t(`the half-plane $y > ${c}$`, `半平面 $y > ${c}$`),
            true,
            t(
              `A loop above the line $y = ${c}$ can be pulled together without reaching the line.`,
              `直线 $y = ${c}$ 上方的环路可以收拢而不碰到这条直线。`,
            ),
          ],
          [
            t(`the plane with the ray $\\{(x, ${c}) : x \\le 0\\}$ removed`, `去掉射线 $\\{(x, ${c}) : x \\le 0\\}$ 的平面`),
            true,
            t(
              "No loop in the region can go around the ray's endpoint, since that would cross the ray.",
              "区域内没有环路能绕住射线的端点，因为那样必然穿过射线。",
            ),
          ],
          [
            t(`the open rectangle $0 < x < ${R}$, $${c} < y < ${c + r}$`, `开矩形 $0 < x < ${R}$，$${c} < y < ${c + r}$`),
            true,
            t(
              "A loop in the rectangle can be shrunk toward any of its points, staying inside.",
              "矩形内的环路可以向其中任一点收缩，始终留在矩形内。",
            ),
          ],
          [
            t(`the open disk $(x - ${R})^2 + y^2 < ${r * r}$`, `开圆盘 $(x - ${R})^2 + y^2 < ${r * r}$`),
            true,
            t(
              `A loop in the disk can be shrunk toward its centre $(${R}, 0)$, staying inside.`,
              `圆盘内的环路可以向圆心 $(${R}, 0)$ 收缩，始终留在圆盘内。`,
            ),
          ],
          [
            t(`the annulus $${r * r} < x^2 + y^2 < ${R * R}$`, `圆环 $${r * r} < x^2 + y^2 < ${R * R}$`),
            false,
            t(
              `The circle $x^2 + y^2 = ${r * R}$ lies in it and goes around the hole $x^2 + y^2 \\le ${r * r}$.`,
              `圆 $x^2 + y^2 = ${r * R}$ 在其中并绕着洞 $x^2 + y^2 \\le ${r * r}$。`,
            ),
          ],
          [
            t(`the punctured disk $0 < x^2 + (y - ${R})^2 < ${r * r}$`, `去心圆盘 $0 < x^2 + (y - ${R})^2 < ${r * r}$`),
            false,
            t(
              `A small circle about the missing centre $(0, ${R})$ lies in it and cannot be shrunk inside it.`,
              `绕缺失圆心 $(0, ${R})$ 的小圆在其中，无法在区域内收缩。`,
            ),
          ],
          [
            t(`the plane with the point $(${c}, ${R})$ removed`, `去掉点 $(${c}, ${R})$ 的平面`),
            false,
            t(
              `A circle about $(${c}, ${R})$ lies in it and cannot be shrunk without passing through the missing point.`,
              `绕 $(${c}, ${R})$ 的圆在其中，不经过缺失的点就无法收缩。`,
            ),
          ],
          [
            disks,
            false,
            t(
              `The disks are centred $${R + 2}$ apart with radius $1$, so they do not touch.`,
              `两个圆盘圆心相距 $${R + 2}$，半径为 $1$，所以不相接。`,
            ),
          ],
        ];
        const [region, yes, check] = rng.pick(regions);
        const split = region === disks;
        return verdictChoice(rng, {
          prompt: t(`Is ${region.en} simply connected?`, `${region["zh-CN"]}是单连通的吗？`),
          holds: yes,
          yes: t(
            "it is connected and every closed curve in it can be shrunk to a point inside it",
            "它连通，且其中每条闭曲线都能在区域内收缩为一点",
          ),
          no: t(
            "it is not connected, or it has a hole that a closed curve in it goes around",
            "它不连通，或者有一个洞被其中的某条闭曲线绕住",
          ),
          yesWrong: t("it is an open set", "它是开集"),
          noWrong: t("it is unbounded", "它无界"),
          solution: walked(
            [
              [
                ["Decide whether it is connected", "判断是否连通"],
                split
                  ? t("No: the two disks do not touch.", "不：两个圆盘不相接。")
                  : t("Yes: any two of its points can be joined by a path inside it.", "是：其中任意两点都能用区域内的路径相连。"),
              ],
              [
                ["Look for a loop around a hole", "寻找绕住洞的环路"],
                split
                  ? t("A region that is not connected is not simply connected.", "不连通的区域不是单连通的。")
                  : yes
                    ? t("No: it has no hole, so it is simply connected.", "没有：它没有洞，所以是单连通的。")
                    : t("Yes: it has a hole, so it is not simply connected.", "有：它有洞，所以不是单连通的。"),
              ],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** streamFunctions covers the stream function for 2D divergence-free flows. */
export const streamFunctions: TopicDef = {
  id: "stream-functions",
  title: t("Stream Functions", "流函数"),
  summary: t(
    "For a 2D divergence-free field F = ⟨P, Q⟩, the stream function ψ satisfies P = ∂ψ/∂y and Q = -∂ψ/∂x, with level curves matching streamlines.",
    "对于二维无散场 F = ⟨P, Q⟩，流函数 ψ 满足 P = ∂ψ/∂y 且 Q = -∂ψ/∂x，其等值线即为流线。",
  ),
  intro: t(
    "Take the stream function $\\psi = xy$. Then $P = \\psi_y = x$ and $Q = -\\psi_x = -y$, so the flow is $\\mathbf{F} = \\langle x, -y \\rangle$: it comes in along the $y$-axis and leaves along the $x$-axis, following the hyperbolas $xy = C$.\n\nCheck: $P_x + Q_y = 1 - 1 = 0$, so the flow is incompressible, and $\\mathbf{F} \\cdot \\nabla\\psi = x \\cdot y + (-y) \\cdot x = 0$, so the flow runs along the level curves of $\\psi$.\n\nIn this lesson we find stream functions of incompressible plane flows and recover flows from stream functions.",
    "取流函数 $\\psi = xy$。则 $P = \\psi_y = x$，$Q = -\\psi_x = -y$，所以流场是 $\\mathbf{F} = \\langle x, -y \\rangle$：它沿 $y$ 轴流入、沿 $x$ 轴流出，沿着双曲线 $xy = C$ 流动。\n\n检验：$P_x + Q_y = 1 - 1 = 0$，所以流动不可压缩；而 $\\mathbf{F} \\cdot \\nabla\\psi = x \\cdot y + (-y) \\cdot x = 0$，所以流动沿 $\\psi$ 的等值线进行。\n\n本课我们求不可压缩平面流的流函数，并由流函数求出流场。",
  ),
  prerequisites: ["calculating-potential-functions"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-stream-functions-for-incompressible-flows",
      title: t("Finding stream functions for incompressible flows", "求不可压缩流场的流函数"),
      explanation: t(
        "For a two-dimensional incompressible vector field $\\mathbf{F} = \\langle P, Q \\rangle$ with $\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} = 0$, there exists a scalar stream function $\\psi(x, y)$ such that:\n\n$$P = \\frac{\\partial \\psi}{\\partial y}, \\quad Q = -\\frac{\\partial \\psi}{\\partial x}.$$ Level curves $\\psi(x, y) = C$ are the streamlines of the velocity field. For $\\mathbf{F} = \\langle 2y, -6x \\rangle$, $\\psi_y = 2y$ gives $\\psi = y^2 + g(x)$, and $-g'(x) = -6x$ gives $g = 3x^2$: $\\psi = y^2 + 3x^2$.\n\n> **Watch out.** $Q = -\\psi_x$ carries a minus sign, so integrating $Q$ in $x$ as it stands gives the wrong sign. And $\\int 2y\\,dy = y^2$, not $2y^2$.",
        "对于满足 $\\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} = 0$ 的二维不可压缩向量场 $\\mathbf{F} = \\langle P, Q \\rangle$，存在标量流函数 $\\psi(x, y)$ 使得：\n\n$$P = \\frac{\\partial \\psi}{\\partial y}, \\quad Q = -\\frac{\\partial \\psi}{\\partial x}$$ 等值线 $\\psi(x, y) = C$ 即为该速度场的流线。对 $\\mathbf{F} = \\langle 2y, -6x \\rangle$，由 $\\psi_y = 2y$ 得 $\\psi = y^2 + g(x)$，由 $-g'(x) = -6x$ 得 $g = 3x^2$：$\\psi = y^2 + 3x^2$。\n\n> **注意。** $Q = -\\psi_x$ 带有负号，所以把 $Q$ 直接对 $x$ 积分会得到相反的符号。还有 $\\int 2y\\,dy = y^2$，不是 $2y^2$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 5);
        const b = rng.int(1, 5);
        const ans = poly([a, "y^2"], [-b, "x^2"]);
        return expressionProblem({
          prompt: t(
            `Find the stream function $\\psi(x, y)$ with $\\psi(0, 0) = 0$ for the incompressible planar flow $\\mathbf{F}(x, y) = \\left\\langle ${2 * a}y, ${2 * b}x \\right\\rangle$, satisfying $P = \\frac{\\partial \\psi}{\\partial y}$ and $Q = -\\frac{\\partial \\psi}{\\partial x}$.`,
            `求满足 $P = \\frac{\\partial \\psi}{\\partial y}$ 与 $Q = -\\frac{\\partial \\psi}{\\partial x}$ 且 $\\psi(0, 0) = 0$ 的不可压缩平面流场 $\\mathbf{F}(x, y) = \\left\\langle ${2 * a}y, ${2 * b}x \\right\\rangle$ 的流函数 $\\psi(x, y)$。`,
          ),
          answer: ans,
          mistakes: [
            say(
              poly([a, "y^2"], [b, "x^2"]),
              `$Q = -\\psi_x$, so $\\psi_x = -${2 * b}x$ and the $x^2$ term is negative.`,
              `$Q = -\\psi_x$，所以 $\\psi_x = -${2 * b}x$，$x^2$ 项为负。`,
            ),
            say(
              poly([2 * a, "y^2"], [-2 * b, "x^2"]),
              `$\\int ${2 * a}y\\,dy = ${poly([a, "y^2"])}$: integrating halves the coefficient.`,
              `$\\int ${2 * a}y\\,dy = ${poly([a, "y^2"])}$：积分后系数减半。`,
            ),
            say(
              poly([-a, "y^2"], [b, "x^2"]),
              "That uses the opposite convention, $P = -\\psi_y$ and $Q = \\psi_x$; here $P = \\psi_y$ and $Q = -\\psi_x$.",
              "这用的是相反的约定 $P = -\\psi_y$，$Q = \\psi_x$；这里是 $P = \\psi_y$，$Q = -\\psi_x$。",
            ),
          ],
          solution: walked(
            [
              [
                ["Integrate $P$ in $y$", "把 $P$ 对 $y$ 积分"],
                t(
                  `$\\psi_y = ${2 * a}y$ gives $\\psi = ${poly([a, "y^2"])} + g(x)$.`,
                  `由 $\\psi_y = ${2 * a}y$ 得 $\\psi = ${poly([a, "y^2"])} + g(x)$。`,
                ),
              ],
              [
                ["Match $Q$", "与 $Q$ 比较"],
                t(
                  `$-\\psi_x = -g'(x)$ must equal $${2 * b}x$, so $g'(x) = -${2 * b}x$ and $g(x) = ${poly([-b, "x^2"])} + C$; $\\psi(0, 0) = 0$ makes $C = 0$. So $\\psi = ${ans}$.`,
                  `$-\\psi_x = -g'(x)$ 必须等于 $${2 * b}x$，所以 $g'(x) = -${2 * b}x$，$g(x) = ${poly([-b, "x^2"])} + C$；由 $\\psi(0, 0) = 0$ 得 $C = 0$。所以 $\\psi = ${ans}$。`,
                ),
              ],
            ],
            t(
              `$\\psi_y = ${2 * a}y = P$ and $-\\psi_x = -(${poly([-2 * b, "x"])}) = ${2 * b}x = Q$.`,
              `$\\psi_y = ${2 * a}y = P$，$-\\psi_x = -(${poly([-2 * b, "x"])}) = ${2 * b}x = Q$。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-velocity-field-from-its-stream-function",
      figure: multivariableDrawings1["stream-functions#a-velocity-field-from-its-stream-function"],
      title: t("A velocity field from its stream function", "由流函数求速度场"),
      explanation: t(
        "A stream function $\\psi$ determines an incompressible flow through $P = \\frac{\\partial \\psi}{\\partial y}$ and $Q = -\\frac{\\partial \\psi}{\\partial x}$. Such a field is automatically divergence free, since $P_x + Q_y = \\psi_{yx} - \\psi_{xy} = 0$. Differentiating $\\psi$ and evaluating at a point gives the velocity there, which is tangent to the streamline $\\psi = C$ through that point. For $\\psi = x^2y$ at $(1, 2)$: $P = x^2 = 1$ and $Q = -2xy = -4$, so the velocity is $\\langle 1, -4 \\rangle$.\n\n> **Watch out.** The first entry comes from $\\psi_y$, the derivative in the other variable, and the second is $-\\psi_x$ with its minus sign. The velocity is not $\\nabla\\psi$; it is perpendicular to it.",
        "流函数 $\\psi$ 通过 $P = \\frac{\\partial \\psi}{\\partial y}$，$Q = -\\frac{\\partial \\psi}{\\partial x}$ 确定一个不可压缩流。这样的场自动无散，因为 $P_x + Q_y = \\psi_{yx} - \\psi_{xy} = 0$。对 $\\psi$ 求导并在某点取值就得到该点的速度，它与过该点的流线 $\\psi = C$ 相切。对 $\\psi = x^2y$ 在 $(1, 2)$ 处：$P = x^2 = 1$，$Q = -2xy = -4$，所以速度为 $\\langle 1, -4 \\rangle$。\n\n> **注意。** 第一个分量来自 $\\psi_y$，即对另一个变量的导数；第二个分量是 $-\\psi_x$，带负号。速度不是 $\\nabla\\psi$，而是与它垂直。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const x = rng.int(-3, 3);
        const y = rng.int(-3, 3);
        const psiY = a * x + 2 * c * y;
        const psiX = a * y + 2 * b * x;
        const P = psiY;
        const Qv = -psiX;
        return located(
          {
            prompt: t(
              `The stream function of a flow is $\\psi(x, y) = ${poly([a, "xy"], [b, "x^2"], [c, "y^2"])}$, with $P = \\psi_y$ and $Q = -\\psi_x$. Find the velocity $\\mathbf{F}(${x}, ${y})$.`,
              `某流动的流函数为 $\\psi(x, y) = ${poly([a, "xy"], [b, "x^2"], [c, "y^2"])}$，$P = \\psi_y$，$Q = -\\psi_x$。求速度 $\\mathbf{F}(${x}, ${y})$。`,
            ),
            answer: [P, Qv],
            vector: true,
            solution: walked(
              [
                [
                  ["Differentiate the stream function", "对流函数求导"],
                  t(
                    `$\\psi_y = ${poly([a, "x"], [2 * c, "y"])}$ and $\\psi_x = ${poly([a, "y"], [2 * b, "x"])}$.`,
                    `$\\psi_y = ${poly([a, "x"], [2 * c, "y"])}$，$\\psi_x = ${poly([a, "y"], [2 * b, "x"])}$。`,
                  ),
                ],
                [
                  ["Evaluate", "代入求值"],
                  t(
                    `At $(${x}, ${y})$, $\\psi_y = ${psiY}$ and $\\psi_x = ${psiX}$, so $\\mathbf{F} = \\langle \\psi_y, -\\psi_x \\rangle = \\langle ${P}, ${Qv} \\rangle$.`,
                    `在 $(${x}, ${y})$ 处，$\\psi_y = ${psiY}$，$\\psi_x = ${psiX}$，所以 $\\mathbf{F} = \\langle \\psi_y, -\\psi_x \\rangle = \\langle ${P}, ${Qv} \\rangle$。`,
                  ),
                ],
              ],
              t(
                `$\\mathbf{F} \\cdot \\nabla\\psi = ${paren(P)} \\cdot ${paren(psiX)} + ${paren(Qv)} \\cdot ${paren(psiY)} = 0$: the velocity runs along the streamline through the point.`,
                `$\\mathbf{F} \\cdot \\nabla\\psi = ${paren(P)} \\cdot ${paren(psiX)} + ${paren(Qv)} \\cdot ${paren(psiY)} = 0$：速度沿着过该点的流线。`,
              ),
            ),
          },
          [
            [
              [psiX, psiY],
              "That is $\\nabla\\psi$; the velocity is $\\langle \\psi_y, -\\psi_x \\rangle$.",
              "这是 $\\nabla\\psi$；速度是 $\\langle \\psi_y, -\\psi_x \\rangle$。",
            ],
            [[psiY, psiX], "The second entry is $-\\psi_x$, with a minus sign.", "第二个分量是 $-\\psi_x$，带负号。"],
            [
              [-P, -Qv],
              "That uses the opposite convention $\\langle -\\psi_y, \\psi_x \\rangle$; here $P = \\psi_y$ and $Q = -\\psi_x$.",
              "这用的是相反的约定 $\\langle -\\psi_y, \\psi_x \\rangle$；这里 $P = \\psi_y$，$Q = -\\psi_x$。",
            ],
          ],
        );
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 1.4 Divergence and Curl
// ---------------------------------------------------------------------------

/** theDivergenceOfAVectorField computes the divergence div F = ∇ · F. */
export const theDivergenceOfAVectorField: TopicDef = {
  id: "the-divergence-of-a-vector-field",
  title: t("The Divergence of a Vector Field", "向量场的散度"),
  summary: t(
    "The divergence div F = ∇ · F measures the net outward flux of a vector field per unit volume.",
    "散度 div F = ∇ · F 度量向量场单位体积向外的净通量。",
  ),
  intro: t(
    "For $\\mathbf{F} = \\langle x^2, yz, 3z \\rangle$, differentiate each component in its own variable: $\\frac{\\partial}{\\partial x}(x^2) = 2x$, $\\frac{\\partial}{\\partial y}(yz) = z$ and $\\frac{\\partial}{\\partial z}(3z) = 3$. So $\\nabla \\cdot \\mathbf{F} = 2x + z + 3$, and at $(1, 2, 3)$ it is $2 + 3 + 3 = 8$: the field spreads out there, like a source.\n\nCheck: the $y$-coordinate $2$ does not enter, because $yz$ is differentiated in $y$ and leaves $z$; changing the point to $(1, 5, 3)$ still gives $8$.\n\nIn this lesson we compute the divergence of a field, as a formula and at a point.",
    "对 $\\mathbf{F} = \\langle x^2, yz, 3z \\rangle$，把每个分量对它自己的变量求导：$\\frac{\\partial}{\\partial x}(x^2) = 2x$，$\\frac{\\partial}{\\partial y}(yz) = z$，$\\frac{\\partial}{\\partial z}(3z) = 3$。所以 $\\nabla \\cdot \\mathbf{F} = 2x + z + 3$，在 $(1, 2, 3)$ 处为 $2 + 3 + 3 = 8$：场在那里向外发散，像一个源。\n\n检验：$y$ 坐标 $2$ 没有出现，因为 $yz$ 对 $y$ 求导后剩下 $z$；把点换成 $(1, 5, 3)$ 结果仍是 $8$。\n\n本课我们计算向量场的散度，既求公式，也求某点处的值。",
  ),
  prerequisites: ["vector-fields"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-the-divergence-of-a-vector-field",
      title: t("Computing the divergence of a vector field", "计算向量场的散度"),
      explanation: t(
        "Divergence adds the rate of change of each component in its own direction, measuring how much the field spreads out from a point. For a three-dimensional vector field $\\mathbf{F} = \\langle P, Q, R \\rangle$, the divergence is the scalar field:\n\n$$\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}.$$\n\nFor $\\mathbf{F} = \\langle 5x^2, -y^2, 4z^2 \\rangle$, $\\nabla \\cdot \\mathbf{F} = 10x - 2y + 8z$, which is $16$ at $(1, 1, 1)$.\n\n> **Watch out.** Add the derivatives of the components, not the components themselves, and keep the factor $2$ that differentiating a square brings. The divergence is a number at each point, not a vector.",
        "散度把每个分量沿自身方向的变化率加起来，衡量向量场从一点向外发散的程度。对于三维向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$，散度是由下式给出的标量场：\n\n$$\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = \\frac{\\partial P}{\\partial x} + \\frac{\\partial Q}{\\partial y} + \\frac{\\partial R}{\\partial z}$$\n\n对 $\\mathbf{F} = \\langle 5x^2, -y^2, 4z^2 \\rangle$，$\\nabla \\cdot \\mathbf{F} = 10x - 2y + 8z$，在 $(1, 1, 1)$ 处为 $16$。\n\n> **注意。** 要加的是各分量的导数，不是分量本身；平方求导带出的因子 $2$ 不能丢。散度在每一点是一个数，不是向量。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        const half = a * pt[0] + b * pt[1] + c * pt[2];
        const ans = 2 * half;
        const P = poly([a, "x^2"]);
        const Qy = poly([b, "y^2"]);
        const R = poly([c, "z^2"]);
        const at = `(${pt[0]}, ${pt[1]}, ${pt[2]})`;
        return numberProblem({
          prompt: t(
            `Compute the divergence $\\operatorname{div}\\mathbf{F}$ of the vector field $\\mathbf{F}(x, y, z) = \\left\\langle ${P}, ${Qy}, ${R} \\right\\rangle$ at the point $${at}$.`,
            `计算向量场 $\\mathbf{F}(x, y, z) = \\left\\langle ${P}, ${Qy}, ${R} \\right\\rangle$ 在点 $${at}$ 处的散度 $\\operatorname{div}\\mathbf{F}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              half,
              `$\\frac{\\partial}{\\partial x}(${P}) = ${2 * a}x$: differentiating a square brings a factor $2$.`,
              `$\\frac{\\partial}{\\partial x}(${P}) = ${2 * a}x$：平方求导带出因子 $2$。`,
            ),
            why(
              a * pt[0] ** 2 + b * pt[1] ** 2 + c * pt[2] ** 2,
              "That adds the components themselves; the divergence adds their derivatives.",
              "这是把分量本身相加；散度加的是它们的导数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate each component in its own variable", "把每个分量对自己的变量求导"],
                t(
                  `$\\frac{\\partial P}{\\partial x} = ${2 * a}x$, $\\frac{\\partial Q}{\\partial y} = ${2 * b}y$ and $\\frac{\\partial R}{\\partial z} = ${2 * c}z$, so $\\operatorname{div}\\mathbf{F} = ${poly([2 * a, "x"], [2 * b, "y"], [2 * c, "z"])}$.`,
                  `$\\frac{\\partial P}{\\partial x} = ${2 * a}x$，$\\frac{\\partial Q}{\\partial y} = ${2 * b}y$，$\\frac{\\partial R}{\\partial z} = ${2 * c}z$，所以 $\\operatorname{div}\\mathbf{F} = ${poly([2 * a, "x"], [2 * b, "y"], [2 * c, "z"])}$。`,
                ),
              ],
              [
                ["Substitute the point", "代入该点"],
                t(
                  `$${2 * a} \\cdot ${paren(pt[0])} + ${paren(2 * b)} \\cdot ${paren(pt[1])} + ${paren(2 * c)} \\cdot ${paren(pt[2])} = ${ans}$.`,
                  `$${2 * a} \\cdot ${paren(pt[0])} + ${paren(2 * b)} \\cdot ${paren(pt[1])} + ${paren(2 * c)} \\cdot ${paren(pt[2])} = ${ans}$。`,
                ),
              ],
            ],
            t(
              `The divergence is $2(${poly([a, "x"], [b, "y"], [c, "z"])})$; at the point the bracket is $${half}$, and twice that is $${ans}$.`,
              `散度为 $2(${poly([a, "x"], [b, "y"], [c, "z"])})$；在该点括号内为 $${half}$，两倍即 $${ans}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-divergence-at-a-point",
      title: t("The divergence at a point", "某点处的散度"),
      explanation: t(
        "The divergence $\\nabla \\cdot \\mathbf{F} = P_x + Q_y + R_z$ is a scalar function, so it can change from point to point. Positive divergence at a point means the flow spreads out there, like a source, and negative divergence means it converges, like a sink. Compute the three partial derivatives first, add them, and only then substitute the coordinates. For $\\mathbf{F} = \\langle xy^2, 5yz, xz \\rangle$ at $(2, 1, 1)$: $P_x = y^2 = 1$, $Q_y = 5z = 5$ and $R_z = x = 2$, so the divergence is $8$.\n\n> **Watch out.** Each component is differentiated in its own variable only: $P$ in $x$, $Q$ in $y$, $R$ in $z$. The other variables in a term stay as they are, so $\\frac{\\partial}{\\partial y}(5yz) = 5z$, not $5y$.",
        "散度 $\\nabla \\cdot \\mathbf{F} = P_x + Q_y + R_z$ 是标量函数，所以随点而变。某点散度为正说明流在那里发散，像源；为负说明汇聚，像汇。先求三个偏导数并相加，再代入坐标。对 $\\mathbf{F} = \\langle xy^2, 5yz, xz \\rangle$ 在 $(2, 1, 1)$ 处：$P_x = y^2 = 1$，$Q_y = 5z = 5$，$R_z = x = 2$，所以散度为 $8$。\n\n> **注意。** 每个分量只对它自己的变量求导：$P$ 对 $x$，$Q$ 对 $y$，$R$ 对 $z$。项中其他变量保持不变，所以 $\\frac{\\partial}{\\partial y}(5yz) = 5z$，不是 $5y$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-3, 3);
        const [x, y, z] = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const [px, qy, rz] = [2 * a * x * y, b * z, 2 * c * x * z];
        const ans = px + qy + rz;
        const div = poly([2 * a, "xy"], [b, "z"], [2 * c, "xz"]);
        return numberProblem({
          prompt: t(
            `Find $\\nabla \\cdot \\mathbf{F}$ at $(${x}, ${y}, ${z})$ for $\\mathbf{F} = \\langle ${poly([a, "x^2y"])}, ${poly([b, "yz"])}, ${poly([c, "xz^2"])} \\rangle$.`,
            `对 $\\mathbf{F} = \\langle ${poly([a, "x^2y"])}, ${poly([b, "yz"])}, ${poly([c, "xz^2"])} \\rangle$ 求 $(${x}, ${y}, ${z})$ 处的 $\\nabla \\cdot \\mathbf{F}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a * x * x + b * y + c * z * z,
              "That differentiates $P$ in $y$, $Q$ in $z$ and $R$ in $x$; each component is differentiated in its own variable.",
              "这是把 $P$ 对 $y$、$Q$ 对 $z$、$R$ 对 $x$ 求导；每个分量应对它自己的变量求导。",
            ),
            why(
              2 * a * x * y + b * y + 2 * c * x * z,
              `$\\frac{\\partial}{\\partial y}(${poly([b, "yz"])}) = ${poly([b, "z"])}$, not $${poly([b, "y"])}$.`,
              `$\\frac{\\partial}{\\partial y}(${poly([b, "yz"])}) = ${poly([b, "z"])}$，不是 $${poly([b, "y"])}$。`,
            ),
            why(
              a * x * x * y + b * y * z + c * x * z * z,
              "That adds the components themselves; the divergence adds their derivatives.",
              "这是把分量本身相加；散度加的是它们的导数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the three partial derivatives", "求三个偏导数"],
                t(
                  `$P_x = ${poly([2 * a, "xy"])}$, $Q_y = ${poly([b, "z"])}$ and $R_z = ${poly([2 * c, "xz"])}$, so $\\nabla \\cdot \\mathbf{F} = ${div}$.`,
                  `$P_x = ${poly([2 * a, "xy"])}$，$Q_y = ${poly([b, "z"])}$，$R_z = ${poly([2 * c, "xz"])}$，所以 $\\nabla \\cdot \\mathbf{F} = ${div}$。`,
                ),
              ],
              [
                ["Substitute the point", "代入该点"],
                t(`At $(${x}, ${y}, ${z})$ the divergence is $${ans}$.`, `在 $(${x}, ${y}, ${z})$ 处散度为 $${ans}$。`),
              ],
            ],
            t(
              `Term by term at the point: $P_x = ${px}$, $Q_y = ${qy}$ and $R_z = ${rz}$, which add up to $${ans}$.`,
              `逐项在该点计算：$P_x = ${px}$，$Q_y = ${qy}$，$R_z = ${rz}$，和为 $${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** propertiesOfTheDivergenceOperator explores properties and solenoidal fields. */
export const propertiesOfTheDivergenceOperator: TopicDef = {
  id: "properties-of-the-divergence-operator",
  title: t("Properties of the Divergence Operator", "散度算子的性质"),
  summary: t(
    "Divergence is linear, obeys product rules with scalar fields, and characterizes incompressible (solenoidal) flows when div F = 0.",
    "散度具有线性性，满足与标量场的乘积法则，当 div F = 0 时表征不可压缩（无散）流场。",
  ),
  intro: t(
    "Is $\\mathbf{F} = \\langle 2x + y, z - 5y, 3z + x \\rangle$ incompressible? Its divergence is $\\frac{\\partial}{\\partial x}(2x + y) + \\frac{\\partial}{\\partial y}(z - 5y) + \\frac{\\partial}{\\partial z}(3z + x) = 2 - 5 + 3 = 0$, so it is solenoidal: it creates and destroys no flow anywhere.\n\nCheck: the terms $y$, $z$ and $x$ sit in components that are not differentiated in their variable, so they add nothing; only the coefficients $2$, $-5$ and $3$ count, and they sum to $0$.\n\nIn this lesson we find solenoidal fields and use the product rule $\\nabla \\cdot (f\\mathbf{F}) = \\nabla f \\cdot \\mathbf{F} + f\\,\\nabla \\cdot \\mathbf{F}$.",
    "$\\mathbf{F} = \\langle 2x + y, z - 5y, 3z + x \\rangle$ 是不可压缩的吗？它的散度为 $\\frac{\\partial}{\\partial x}(2x + y) + \\frac{\\partial}{\\partial y}(z - 5y) + \\frac{\\partial}{\\partial z}(3z + x) = 2 - 5 + 3 = 0$，所以它是无散场：在任何地方都不产生也不消灭流量。\n\n检验：$y$、$z$、$x$ 这几项所在的分量并不对它们求导，所以不起作用；只有系数 $2$、$-5$、$3$ 有贡献，和为 $0$。\n\n本课我们求无散场，并使用乘积法则 $\\nabla \\cdot (f\\mathbf{F}) = \\nabla f \\cdot \\mathbf{F} + f\\,\\nabla \\cdot \\mathbf{F}$。",
  ),
  prerequisites: ["the-divergence-of-a-vector-field"],
  encompasses: [{ topic: "the-divergence-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "solenoidal-fields-and-divergence-properties",
      title: t("Solenoidal fields and divergence properties", "无散场与散度性质"),
      explanation: t(
        "A field with zero divergence neither creates nor destroys flow at any point, like an incompressible fluid that only moves around. A vector field $\\mathbf{F}$ is called **solenoidal** or **incompressible** if $\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = 0$ everywhere. For $\\mathbf{F} = \\langle 6x + 2y, -2y - 3z, x + kz \\rangle$, the divergence is $6 - 2 + k$, so $k = -4$ makes it solenoidal.\n\n> **Watch out.** Only the terms of $P$ in $x$, of $Q$ in $y$ and of $R$ in $z$ count: the $2y$, $-3z$ and $x$ add nothing. Solve $\\text{div} = 0$ for $k$, which flips the sign of the rest.",
        "散度为零的向量场在任何一点既不产生也不消灭流量，就像只会流动的不可压缩流体。若向量场 $\\mathbf{F}$ 处处满足 $\\operatorname{div}\\mathbf{F} = \\nabla \\cdot \\mathbf{F} = 0$，则称其为**无散场**或**不可压缩场**。对 $\\mathbf{F} = \\langle 6x + 2y, -2y - 3z, x + kz \\rangle$，散度为 $6 - 2 + k$，所以 $k = -4$ 时它是无散场。\n\n> **注意。** 只有 $P$ 中关于 $x$、$Q$ 中关于 $y$、$R$ 中关于 $z$ 的项有贡献：$2y$、$-3z$ 与 $x$ 都不起作用。由 $\\text{div} = 0$ 解出 $k$ 时，其余部分要变号。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-5, 5);
        const drawn = rng.nonZero(-5, 5);
        const b = a + drawn === 0 ? a : drawn;
        const ans = -(a + b);
        const P = poly([a, "x"], [2, "y"]);
        const Qf = poly([b, "y"], [-3, "z"]);
        return numberProblem({
          prompt: t(
            `Find the value of the constant $k$ that makes the vector field $\\mathbf{F}(x, y, z) = \\langle ${P}, ${Qf}, x + kz \\rangle$ solenoidal (incompressible) everywhere.`,
            `求使向量场 $\\mathbf{F}(x, y, z) = \\langle ${P}, ${Qf}, x + kz \\rangle$ 处处无散（不可压缩）的常数 $k$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              a + b,
              `$${a + b} + k = 0$ gives $k = ${ans}$: moving $${a + b}$ across changes its sign.`,
              `由 $${a + b} + k = 0$ 得 $k = ${ans}$：把 $${a + b}$ 移到另一边要变号。`,
            ),
            why(
              1 - (a + b),
              "That also adds the coefficients $2$ and $-3$ of $y$ in $P$ and $z$ in $Q$; $P$ is differentiated in $x$ and $Q$ in $y$, so those terms give $0$.",
              "这把 $P$ 中 $y$ 的系数 $2$ 与 $Q$ 中 $z$ 的系数 $-3$ 也加了进去；$P$ 对 $x$ 求导、$Q$ 对 $y$ 求导，这些项都给出 $0$。",
            ),
            why(
              -(a + b) - 1,
              "That adds $\\frac{\\partial R}{\\partial x} = 1$; the divergence uses $\\frac{\\partial R}{\\partial z} = k$ only.",
              "这加上了 $\\frac{\\partial R}{\\partial x} = 1$；散度只用 $\\frac{\\partial R}{\\partial z} = k$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Compute the divergence", "求散度"],
                t(
                  `$\\frac{\\partial}{\\partial x}(${P}) + \\frac{\\partial}{\\partial y}(${Qf}) + \\frac{\\partial}{\\partial z}(x + kz) = ${a} + ${paren(b)} + k = ${poly([1, "k"], [a + b, ""])}$.`,
                  `$\\frac{\\partial}{\\partial x}(${P}) + \\frac{\\partial}{\\partial y}(${Qf}) + \\frac{\\partial}{\\partial z}(x + kz) = ${a} + ${paren(b)} + k = ${poly([1, "k"], [a + b, ""])}$。`,
                ),
              ],
              [
                ["Set it to zero", "令其为零"],
                t(`$${poly([1, "k"], [a + b, ""])} = 0$ gives $k = ${ans}$.`, `由 $${poly([1, "k"], [a + b, ""])} = 0$ 得 $k = ${ans}$。`),
              ],
            ],
            t(
              `With $k = ${ans}$ the three derivatives are $${a}$, $${b}$ and $${ans}$, and $${a} + ${paren(b)} + ${paren(ans)} = 0$.`,
              `取 $k = ${ans}$，三个导数为 $${a}$、$${b}$、$${ans}$，且 $${a} + ${paren(b)} + ${paren(ans)} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-product-rule-for-divergence",
      title: t("The product rule for divergence", "散度的乘积法则"),
      explanation: t(
        "The divergence of a scalar function times a field follows a product rule:\n\n$$\\nabla \\cdot (f\\mathbf{F}) = \\nabla f \\cdot \\mathbf{F} + f\\,(\\nabla \\cdot \\mathbf{F}).$$\n\nFor $f = x$ the gradient is $\\langle 1, 0, 0 \\rangle$, so the first term is just the first component of $\\mathbf{F}$. The rule saves expanding $f\\mathbf{F}$ before differentiating. For $f = x$ and $\\mathbf{F} = \\langle x, y, z \\rangle$: $\\nabla x \\cdot \\mathbf{F} = x$ and $x\\,(\\nabla \\cdot \\mathbf{F}) = 3x$, so $\\nabla \\cdot (x\\mathbf{F}) = 4x$.\n\n> **Watch out.** Both terms are needed, and the divergence of $\\mathbf{F}$ is multiplied by $f$ itself: forgetting either term, or the factor $f$, gives a wrong value.",
        "标量函数乘以场的散度满足乘积法则：\n\n$$\\nabla \\cdot (f\\mathbf{F}) = \\nabla f \\cdot \\mathbf{F} + f\\,(\\nabla \\cdot \\mathbf{F})$$\n\n对 $f = x$，梯度为 $\\langle 1, 0, 0 \\rangle$，所以第一项就是 $\\mathbf{F}$ 的第一个分量。这一法则省去了先展开 $f\\mathbf{F}$ 再求导。对 $f = x$，$\\mathbf{F} = \\langle x, y, z \\rangle$：$\\nabla x \\cdot \\mathbf{F} = x$，$x\\,(\\nabla \\cdot \\mathbf{F}) = 3x$，所以 $\\nabla \\cdot (x\\mathbf{F}) = 4x$。\n\n> **注意。** 两项都不能少，而且 $\\mathbf{F}$ 的散度要乘以 $f$ 本身：漏掉任一项或漏掉因子 $f$ 都会出错。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-4, 4);
        const [x, y, z] = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        const ans = a * y + x * (b + c);
        return numberProblem({
          prompt: t(
            `$\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$. Find $\\nabla \\cdot (x\\mathbf{F})$ at $(${x}, ${y}, ${z})$.`,
            `$\\mathbf{F} = \\langle ${poly([a, "y"])}, ${poly([b, "y"])}, ${poly([c, "z"])} \\rangle$。求 $(${x}, ${y}, ${z})$ 处的 $\\nabla \\cdot (x\\mathbf{F})$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              x * (b + c),
              `That leaves out $\\nabla x \\cdot \\mathbf{F} = ${poly([a, "y"])}$.`,
              `这漏掉了 $\\nabla x \\cdot \\mathbf{F} = ${poly([a, "y"])}$。`,
            ),
            why(
              a * y,
              `That leaves out $x\\,(\\nabla \\cdot \\mathbf{F}) = ${poly([b + c, "x"])}$.`,
              `这漏掉了 $x\\,(\\nabla \\cdot \\mathbf{F}) = ${poly([b + c, "x"])}$。`,
            ),
            why(
              a * y + b + c,
              `The divergence $${b + c}$ is multiplied by $f = x$, giving $${poly([b + c, "x"])}$.`,
              `散度 $${b + c}$ 要乘以 $f = x$，得 $${poly([b + c, "x"])}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Compute the two pieces", "计算两部分"],
                t(
                  `$\\nabla x = \\langle 1, 0, 0 \\rangle$, so $\\nabla x \\cdot \\mathbf{F} = ${poly([a, "y"])}$; and $\\nabla \\cdot \\mathbf{F} = 0 + ${paren(b)} + ${paren(c)} = ${b + c}$.`,
                  `$\\nabla x = \\langle 1, 0, 0 \\rangle$，所以 $\\nabla x \\cdot \\mathbf{F} = ${poly([a, "y"])}$；而 $\\nabla \\cdot \\mathbf{F} = 0 + ${paren(b)} + ${paren(c)} = ${b + c}$。`,
                ),
              ],
              [
                ["Apply the product rule", "应用乘积法则"],
                t(
                  `$\\nabla \\cdot (x\\mathbf{F}) = ${poly([a, "y"], [b + c, "x"])}$, which is $${ans}$ at $(${x}, ${y}, ${z})$.`,
                  `$\\nabla \\cdot (x\\mathbf{F}) = ${poly([a, "y"], [b + c, "x"])}$，在 $(${x}, ${y}, ${z})$ 处为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `Expand first: $x\\mathbf{F} = \\langle ${poly([a, "xy"])}, ${poly([b, "xy"])}, ${poly([c, "xz"])} \\rangle$, whose divergence is $${poly([a, "y"], [b, "x"], [c, "x"])}$, the same.`,
              `先展开：$x\\mathbf{F} = \\langle ${poly([a, "xy"])}, ${poly([b, "xy"])}, ${poly([c, "xz"])} \\rangle$，其散度为 $${poly([a, "y"], [b, "x"], [c, "x"])}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theCurlOfAVectorField computes the curl of a vector field in 3D. */
export const theCurlOfAVectorField: TopicDef = {
  id: "the-curl-of-a-vector-field",
  title: t("The Curl of a Vector Field", "向量场的旋度"),
  summary: t(
    "The curl of F, curl F = ∇ × F, is a vector field measuring the tendency of particles to rotate about each point.",
    "F 的旋度 curl F = ∇ × F 是一个度量流体微元在各点附近旋转趋势的向量场。",
  ),
  intro: t(
    "The field $\\mathbf{F} = \\langle -y, x, 0 \\rangle$ swirls counterclockwise about the $z$-axis. Its curl is $\\left\\langle \\frac{\\partial 0}{\\partial y} - \\frac{\\partial x}{\\partial z}, \\frac{\\partial (-y)}{\\partial z} - \\frac{\\partial 0}{\\partial x}, \\frac{\\partial x}{\\partial x} - \\frac{\\partial (-y)}{\\partial y} \\right\\rangle = \\langle 0, 0, 2 \\rangle$, pointing up the axis of rotation.\n\nCheck: by the right-hand rule, fingers curling counterclockwise in the $xy$-plane put the thumb along $+\\mathbf{k}$, matching the sign of the $\\mathbf{k}$-entry $2$.\n\nIn this lesson we compute the curl of space fields and the scalar curl of plane fields.",
    "场 $\\mathbf{F} = \\langle -y, x, 0 \\rangle$ 绕 $z$ 轴逆时针旋转。它的旋度为 $\\left\\langle \\frac{\\partial 0}{\\partial y} - \\frac{\\partial x}{\\partial z}, \\frac{\\partial (-y)}{\\partial z} - \\frac{\\partial 0}{\\partial x}, \\frac{\\partial x}{\\partial x} - \\frac{\\partial (-y)}{\\partial y} \\right\\rangle = \\langle 0, 0, 2 \\rangle$，沿旋转轴向上。\n\n检验：按右手定则，四指在 $xy$ 平面内逆时针弯曲时拇指指向 $+\\mathbf{k}$，与 $\\mathbf{k}$ 分量 $2$ 的符号一致。\n\n本课我们计算空间场的旋度和平面场的标量旋度。",
  ),
  prerequisites: ["the-cross-product-of-two-vectors", "vector-fields"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "computing-the-curl-of-a-vector-field",
      title: t("Computing the curl of a vector field", "计算向量场的旋度"),
      explanation: t(
        "Curl measures how much a field rotates around each point, and the determinant pattern is a convenient way to remember its three components. For a vector field $\\mathbf{F} = \\langle P, Q, R \\rangle$ in $\\mathbb{R}^3$, the curl is defined by the formal determinant:\n\n$$\\operatorname{curl}\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{vmatrix} = \\left\\langle \\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z}, \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x}, \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right\\rangle.$$\n\nFor $\\mathbf{F} = \\langle yz, 4xz, xy \\rangle$ the entries are $x - 4x$, $y - y$ and $4z - z$, so $\\nabla \\times \\mathbf{F} = \\langle -3x, 0, 3z \\rangle$.\n\n> **Watch out.** Each entry is a difference taken in a fixed order; reversing it negates the entry. The middle entry is $P_z - R_x$, which the determinant gives with a minus sign in front, so it is easy to get backwards.",
        "旋度衡量向量场绕每一点旋转的程度，行列式的形式是记住它三个分量的方便方法。对于 $\\mathbb{R}^3$ 中的向量场 $\\mathbf{F} = \\langle P, Q, R \\rangle$，旋度通过形式行列式定义：\n\n$$\\operatorname{curl}\\mathbf{F} = \\nabla \\times \\mathbf{F} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ \\frac{\\partial}{\\partial x} & \\frac{\\partial}{\\partial y} & \\frac{\\partial}{\\partial z} \\\\ P & Q & R \\end{vmatrix} = \\left\\langle \\frac{\\partial R}{\\partial y} - \\frac{\\partial Q}{\\partial z}, \\frac{\\partial P}{\\partial z} - \\frac{\\partial R}{\\partial x}, \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right\\rangle$$\n\n对 $\\mathbf{F} = \\langle yz, 4xz, xy \\rangle$，三个分量为 $x - 4x$、$y - y$、$4z - z$，所以 $\\nabla \\times \\mathbf{F} = \\langle -3x, 0, 3z \\rangle$。\n\n> **注意。** 每个分量都是按固定顺序作差，顺序反了分量就变号。中间分量是 $P_z - R_x$，行列式展开时它前面带负号，所以很容易弄反。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-3, 3);
        const c = rng.nonZero(-3, 3);
        const pt: Vec3 = [rng.int(-2, 2), rng.int(-2, 2), rng.int(-2, 2)];
        // F = <a y z, b x z, c x y>: curl = <(c - b) x, (a - c) y, (b - a) z>
        const ansX = (c - b) * pt[0];
        const ansY = (a - c) * pt[1];
        const ansZ = (b - a) * pt[2];
        const answer: Vec3 = [ansX, ansY, ansZ];
        const at = `(${pt[0]}, ${pt[1]}, ${pt[2]})`;
        return located(
          {
            prompt: t(
              `Calculate the curl $\\operatorname{curl}\\mathbf{F}$ of the vector field $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "yz"])}, ${poly([b, "xz"])}, ${poly([c, "xy"])} \\rangle$ at the point $${at}$. Express your answer as a vector $\\langle x, y, z \\rangle$.`,
              `计算向量场 $\\mathbf{F}(x, y, z) = \\langle ${poly([a, "yz"])}, ${poly([b, "xz"])}, ${poly([c, "xy"])} \\rangle$ 在点 $${at}$ 处的旋度 $\\operatorname{curl}\\mathbf{F}$。结果以向量 $\\langle x, y, z \\rangle$ 表示。`,
            ),
            answer,
            vector: true,
            vars: ["x", "y", "z"],
            solution: walked(
              [
                [
                  ["The first and last entries", "第一个与最后一个分量"],
                  t(
                    `$R_y - Q_z = ${poly([c, "x"], [-b, "x"])} = ${poly([c - b, "x"])}$ and $Q_x - P_y = ${poly([b, "z"], [-a, "z"])} = ${poly([b - a, "z"])}$.`,
                    `$R_y - Q_z = ${poly([c, "x"], [-b, "x"])} = ${poly([c - b, "x"])}$，$Q_x - P_y = ${poly([b, "z"], [-a, "z"])} = ${poly([b - a, "z"])}$。`,
                  ),
                ],
                [
                  ["The middle entry", "中间分量"],
                  t(
                    `$P_z - R_x = ${poly([a, "y"], [-c, "y"])} = ${poly([a - c, "y"])}$.`,
                    `$P_z - R_x = ${poly([a, "y"], [-c, "y"])} = ${poly([a - c, "y"])}$。`,
                  ),
                ],
                [
                  ["Evaluate at the point", "在该点求值"],
                  t(`At $${at}$ the curl is $${v3L(answer)}$.`, `在 $${at}$ 处旋度为 $${v3L(answer)}$。`),
                ],
              ],
              t(
                `Every curl has zero divergence, and indeed $\\nabla \\cdot \\langle ${poly([c - b, "x"])}, ${poly([a - c, "y"])}, ${poly([b - a, "z"])} \\rangle = ${c - b} + ${paren(a - c)} + ${paren(b - a)} = 0$.`,
                `任何旋度场的散度都为零，确实 $\\nabla \\cdot \\langle ${poly([c - b, "x"])}, ${poly([a - c, "y"])}, ${poly([b - a, "z"])} \\rangle = ${c - b} + ${paren(a - c)} + ${paren(b - a)} = 0$。`,
              ),
            ),
          },
          [
            [
              [-ansX, -ansY, -ansZ],
              "Each difference was taken in the reverse order, which negates every entry.",
              "每个差都取反了顺序，所有分量都变了号。",
            ],
            [[ansX, -ansY, ansZ], "The middle entry is $P_z - R_x$, not $R_x - P_z$.", "中间分量是 $P_z - R_x$，不是 $R_x - P_z$。"],
            [
              [(c + b) * pt[0], (a + c) * pt[1], (b + a) * pt[2]],
              "Each entry is a difference of two partial derivatives, not a sum.",
              "每个分量是两个偏导数之差，不是之和。",
            ],
          ],
        );
      },
    },
    {
      id: "the-scalar-curl-of-a-plane-field-at-a-point",
      figure: multivariableDrawings1["the-curl-of-a-vector-field#the-scalar-curl-of-a-plane-field-at-a-point"],
      title: t("The scalar curl of a plane field at a point", "平面场在某点的标量旋度"),
      explanation: t(
        "For a plane field $\\mathbf{F} = \\langle P, Q \\rangle$, viewed as $\\langle P, Q, 0 \\rangle$ in space, the curl points along $\\mathbf{k}$ with size\n\n$$\\operatorname{curl}\\mathbf{F} \\cdot \\mathbf{k} = \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}.$$\n\nThis scalar curl measures the local rotation: positive means a tiny paddle wheel would spin counterclockwise, negative means clockwise. For $\\mathbf{F} = \\langle xy^2, x^2 + 4y \\rangle$ at $(1, 2)$: $Q_x = 2x = 2$ and $P_y = 2xy = 4$, so the scalar curl is $-2$, a clockwise spin.\n\n> **Watch out.** It is $Q_x - P_y$, in that order: $Q$ in $x$ minus $P$ in $y$. Reversing the order flips the sign, and so the direction of spin.",
        "对平面场 $\\mathbf{F} = \\langle P, Q \\rangle$，视为空间中的 $\\langle P, Q, 0 \\rangle$，旋度沿 $\\mathbf{k}$ 方向，大小为\n\n$$\\operatorname{curl}\\mathbf{F} \\cdot \\mathbf{k} = \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}$$\n\n这个标量旋度衡量局部转动：为正表示小桨轮逆时针转，为负表示顺时针转。对 $\\mathbf{F} = \\langle xy^2, x^2 + 4y \\rangle$ 在 $(1, 2)$ 处：$Q_x = 2x = 2$，$P_y = 2xy = 4$，所以标量旋度为 $-2$，顺时针转。\n\n> **注意。** 是 $Q_x - P_y$，顺序固定：$Q$ 对 $x$ 求导减去 $P$ 对 $y$ 求导。顺序反了符号就变，转向也随之相反。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-3, 3);
        const b = rng.nonZero(-4, 4);
        const c = rng.nonZero(-3, 3);
        const d = rng.nonZero(-4, 4);
        const x = rng.int(-3, 3);
        const y = rng.int(-3, 3);
        const qx = 3 * c * x * x + d;
        const py = a * x * x + b;
        const ans = qx - py;
        return numberProblem({
          prompt: t(
            `Find $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}$ at $(${x}, ${y})$ for $\\mathbf{F} = \\langle ${poly([a, "x^2y"], [b, "y"])}, ${poly([c, "x^3"], [d, "x"])} \\rangle$.`,
            `对 $\\mathbf{F} = \\langle ${poly([a, "x^2y"], [b, "y"])}, ${poly([c, "x^3"], [d, "x"])} \\rangle$ 求 $(${x}, ${y})$ 处的 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}$。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(-ans, "That is $P_y - Q_x$; the scalar curl is $Q_x - P_y$.", "这是 $P_y - Q_x$；标量旋度是 $Q_x - P_y$。"),
            why(qx + py, `$P_y = ${py}$ is subtracted, not added.`, `$P_y = ${py}$ 应当减去，不是加上。`),
            why(qx, `That leaves out $P_y = ${poly([a, "x^2"], [b, ""])}$.`, `这漏掉了 $P_y = ${poly([a, "x^2"], [b, ""])}$。`),
            why(
              2 * a * x * y,
              `That is $P_x = ${poly([2 * a, "xy"])}$; the scalar curl differentiates $Q$ in $x$ and $P$ in $y$.`,
              `这是 $P_x = ${poly([2 * a, "xy"])}$；标量旋度是 $Q$ 对 $x$、$P$ 对 $y$ 求导。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Take the two partials", "求两个偏导"],
                t(
                  `$Q_x = ${poly([3 * c, "x^2"], [d, ""])}$ and $P_y = ${poly([a, "x^2"], [b, ""])}$, so $Q_x - P_y = ${poly([3 * c - a, "x^2"], [d - b, ""])}$.`,
                  `$Q_x = ${poly([3 * c, "x^2"], [d, ""])}$，$P_y = ${poly([a, "x^2"], [b, ""])}$，所以 $Q_x - P_y = ${poly([3 * c - a, "x^2"], [d - b, ""])}$。`,
                ),
              ],
              [
                ["Evaluate", "代入求值"],
                t(`At $x = ${x}$ this is $${ans}$; $y$ does not appear.`, `在 $x = ${x}$ 处它等于 $${ans}$；式中不含 $y$。`),
              ],
            ],
            t(
              `Separately at the point, $Q_x = ${qx}$ and $P_y = ${py}$, and $${qx} - ${paren(py)} = ${ans}$.`,
              `分别在该点计算，$Q_x = ${qx}$，$P_y = ${py}$，且 $${qx} - ${paren(py)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** propertiesOfTheCurlOperator fundamental identities curl(grad f) = 0 and div(curl F) = 0. */
export const propertiesOfTheCurlOperator: TopicDef = {
  id: "properties-of-the-curl-operator",
  title: t("Properties of the Curl Operator", "旋度算子的性质"),
  summary: t(
    "Curl is linear, satisfies curl(∇f) = 0 (gradient fields are irrotational), and div(curl F) = 0 (curl fields are solenoidal).",
    "旋度算子是线性的，满足 curl(∇f) = 0（梯度场无旋）以及 div(curl F) = 0（旋度场无散）。",
  ),
  intro: t(
    "Take $f = x^2y$, so $\\nabla f = \\langle 2xy, x^2, 0 \\rangle$. Its curl has $\\mathbf{k}$-entry $\\frac{\\partial}{\\partial x}(x^2) - \\frac{\\partial}{\\partial y}(2xy) = 2x - 2x = 0$, and the other two entries are $0$ because nothing depends on $z$ and the third component is $0$. So $\\nabla \\times \\nabla f = \\mathbf{0}$.\n\nCheck: the $\\mathbf{k}$-entry is $f_{yx} - f_{xy}$, the two mixed partials of $f$ in opposite orders, which are equal for any smooth $f$.\n\nIn this lesson we use the identities $\\nabla \\times \\nabla f = \\mathbf{0}$ and $\\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0$ and find irrotational fields.",
    "取 $f = x^2y$，则 $\\nabla f = \\langle 2xy, x^2, 0 \\rangle$。它的旋度的 $\\mathbf{k}$ 分量为 $\\frac{\\partial}{\\partial x}(x^2) - \\frac{\\partial}{\\partial y}(2xy) = 2x - 2x = 0$，另外两个分量为 $0$，因为没有任何量依赖 $z$ 且第三个分量为 $0$。所以 $\\nabla \\times \\nabla f = \\mathbf{0}$。\n\n检验：$\\mathbf{k}$ 分量就是 $f_{yx} - f_{xy}$，即 $f$ 按相反顺序求的两个混合偏导，对光滑的 $f$ 二者相等。\n\n本课我们使用恒等式 $\\nabla \\times \\nabla f = \\mathbf{0}$ 与 $\\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0$，并求无旋场。",
  ),
  prerequisites: ["the-curl-of-a-vector-field", "properties-of-the-divergence-operator"],
  encompasses: [{ topic: "the-curl-of-a-vector-field", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "identities-and-irrotational-fields",
      title: t("Identities and irrotational fields", "重要恒等式与无旋场"),
      explanation: t(
        "Two fundamental differential identities link grad, curl, and div:\n\n1. $\\operatorname{curl}(\\nabla f) = \\mathbf{0}$ for every twice continuously differentiable scalar function $f$. A vector field with $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$ is called **irrotational**.\n2. $\\operatorname{div}(\\operatorname{curl}\\mathbf{F}) = 0$ for every twice continuously differentiable vector field $\\mathbf{F}$.\n\nFor $\\mathbf{F} = \\langle 3y + z, kx, x \\rangle$, the curl is $\\langle 0 - 0, 1 - 1, k - 3 \\rangle$, so $k = 3$ makes it irrotational; then $\\mathbf{F} = \\nabla(3xy + xz)$.\n\n> **Watch out.** Irrotational means all three entries of the curl vanish. The $\\mathbf{k}$-entry is $Q_x - P_y$, so setting it to zero gives $k = P_y$, with the same sign.",
        "梯度、旋度与散度之间有两个基本微分恒等式：\n\n1. 对任意二阶连续可微标量函数 $f$，有 $\\operatorname{curl}(\\nabla f) = \\mathbf{0}$。满足 $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$ 的向量场称为**无旋场**。\n2. 对任意二阶连续可微向量场 $\\mathbf{F}$，有 $\\operatorname{div}(\\operatorname{curl}\\mathbf{F}) = 0$。\n\n对 $\\mathbf{F} = \\langle 3y + z, kx, x \\rangle$，旋度为 $\\langle 0 - 0, 1 - 1, k - 3 \\rangle$，所以 $k = 3$ 时它无旋；此时 $\\mathbf{F} = \\nabla(3xy + xz)$。\n\n> **注意。** 无旋意味着旋度的三个分量都为零。$\\mathbf{k}$ 分量是 $Q_x - P_y$，令其为零得 $k = P_y$，符号相同。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.nonZero(-25, 25);
        const ans = a;
        const P = poly([a, "y"]);
        return numberProblem({
          prompt: t(
            `Find the constant $k$ that makes the vector field $\\mathbf{F}(x, y, z) = \\langle ${P}, kx, 3z^2 \\rangle$ irrotational (that is, $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$).`,
            `求使向量场 $\\mathbf{F}(x, y, z) = \\langle ${P}, kx, 3z^2 \\rangle$ 为无旋场（即 $\\operatorname{curl}\\mathbf{F} = \\mathbf{0}$）的常数 $k$ 的值。`,
          ),
          answer: ans,
          mistakes: distinct(ans, [
            why(
              -ans,
              `The $\\mathbf{k}$-entry is $Q_x - P_y = k - ${paren(a)}$, so $k = ${a}$, with the same sign as $P_y$.`,
              `$\\mathbf{k}$ 分量为 $Q_x - P_y = k - ${paren(a)}$，所以 $k = ${a}$，与 $P_y$ 同号。`,
            ),
            why(
              0,
              `With $k = 0$ the $\\mathbf{k}$-entry is $0 - ${paren(a)} = ${-a}$, not $0$; it vanishes only when $k = ${a}$.`,
              `取 $k = 0$ 时 $\\mathbf{k}$ 分量为 $0 - ${paren(a)} = ${-a}$，不是 $0$；只有 $k = ${a}$ 时它才为零。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["The first two entries", "前两个分量"],
                t(
                  `$R_y - Q_z = 0 - 0 = 0$ and $P_z - R_x = 0 - 0 = 0$, whatever $k$ is.`,
                  `$R_y - Q_z = 0 - 0 = 0$，$P_z - R_x = 0 - 0 = 0$，与 $k$ 无关。`,
                ),
              ],
              [
                ["The last entry", "最后一个分量"],
                t(
                  `$Q_x - P_y = k - ${paren(a)}$, which is $0$ when $k = ${ans}$.`,
                  `$Q_x - P_y = k - ${paren(a)}$，当 $k = ${ans}$ 时为 $0$。`,
                ),
              ],
            ],
            t(
              `With $k = ${ans}$, $\\mathbf{F} = \\langle ${P}, ${poly([a, "x"])}, 3z^2 \\rangle = \\nabla(${poly([a, "xy"])} + z^3)$, a gradient, so its curl is $\\mathbf{0}$.`,
              `取 $k = ${ans}$，$\\mathbf{F} = \\langle ${P}, ${poly([a, "x"])}, 3z^2 \\rangle = \\nabla(${poly([a, "xy"])} + z^3)$，是梯度场，所以旋度为 $\\mathbf{0}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "gradient-fields-are-irrotational",
      title: t("Gradient fields are irrotational", "梯度场无旋"),
      explanation: t(
        "For any function $f$ with continuous second partial derivatives, $\\nabla \\times (\\nabla f) = \\mathbf{0}$, because each component of the curl is a difference of mixed partials such as $f_{zy} - f_{yz}$, which cancel. So every gradient field is irrotational, however complicated $f$ is. A field that is not a gradient may or may not be irrotational, and its curl must be computed to tell. For $f = xyz$, $\\nabla f = \\langle yz, xz, xy \\rangle$ and its curl is $\\langle x - x, y - y, z - z \\rangle = \\mathbf{0}$.\n\n> **Watch out.** A field built from the same letters as $f$ need not be a gradient: $\\langle -y, x, 0 \\rangle$ has curl $\\langle 0, 0, 2 \\rangle$. The guarantee holds for $\\nabla f$ only.",
        "对任意二阶偏导连续的函数 $f$，$\\nabla \\times (\\nabla f) = \\mathbf{0}$，因为旋度的每个分量都是 $f_{zy} - f_{yz}$ 这类混合偏导之差，它们相互抵消。所以无论 $f$ 多复杂，梯度场都无旋。不是梯度的场可能无旋也可能有旋，需要计算旋度才能判断。对 $f = xyz$，$\\nabla f = \\langle yz, xz, xy \\rangle$，其旋度为 $\\langle x - x, y - y, z - z \\rangle = \\mathbf{0}$。\n\n> **注意。** 由与 $f$ 相同字母组成的场不一定是梯度：$\\langle -y, x, 0 \\rangle$ 的旋度是 $\\langle 0, 0, 2 \\rangle$。这一保证只对 $\\nabla f$ 成立。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 5);
        const b = rng.int(2, 5);
        const fs = [`x^{${a}}y^{${b}}z`, `${a}x^2yz^{${b}}`, `e^{${a}x}\\sin(${b}y)`, `x^{${a}}z + y^{${b}}`];
        const f = rng.pick(fs);
        return explainedChoice(rng, {
          prompt: t(
            `Let $f(x, y, z) = ${f}$. Which vector field is guaranteed to have zero curl everywhere?`,
            `设 $f(x, y, z) = ${f}$。哪个向量场的旋度处处为零是有保证的？`,
          ),
          correct: t("$\\nabla f$", "$\\nabla f$"),
          wrong: [
            {
              option: t(`$\\langle -${a}y, ${a}x, 0 \\rangle$`, `$\\langle -${a}y, ${a}x, 0 \\rangle$`),
              why: t(
                `Its curl is $\\langle 0, 0, ${2 * a} \\rangle$: it rotates about the $z$-axis.`,
                `它的旋度为 $\\langle 0, 0, ${2 * a} \\rangle$：它绕 $z$ 轴旋转。`,
              ),
            },
            {
              option: t(`$\\langle ${b}yz, 0, 0 \\rangle$`, `$\\langle ${b}yz, 0, 0 \\rangle$`),
              why: t(
                `Its curl is $\\langle 0, ${b}y, ${-b}z \\rangle$, not zero.`,
                `它的旋度为 $\\langle 0, ${b}y, ${-b}z \\rangle$，不为零。`,
              ),
            },
            {
              option: t(`$\\langle 0, 0, ${a}x + ${b}y \\rangle$`, `$\\langle 0, 0, ${a}x + ${b}y \\rangle$`),
              why: t(
                `Its curl is $\\langle ${b}, ${-a}, 0 \\rangle$, not zero.`,
                `它的旋度为 $\\langle ${b}, ${-a}, 0 \\rangle$，不为零。`,
              ),
            },
          ],
          solution: walked(
            [
              [
                ["The curl of a gradient", "梯度的旋度"],
                t(
                  "The entries of $\\nabla \\times \\nabla f$ are $f_{zy} - f_{yz}$, $f_{xz} - f_{zx}$ and $f_{yx} - f_{xy}$, so $\\nabla f$ has zero curl.",
                  "$\\nabla \\times \\nabla f$ 的分量为 $f_{zy} - f_{yz}$、$f_{xz} - f_{zx}$、$f_{yx} - f_{xy}$，所以 $\\nabla f$ 的旋度为零。",
                ),
              ],
              [
                ["The other fields", "其他场"],
                t(
                  "None of them is guaranteed to be a gradient, and computing their curls shows each is nonzero.",
                  "它们都不保证是梯度，计算旋度可知每个都不为零。",
                ),
              ],
            ],
            t(
              `Each entry of $\\nabla \\times \\nabla f$ is zero because the mixed partials of $f = ${f}$ are continuous and so equal in either order (Clairaut's theorem).`,
              `$\\nabla \\times \\nabla f$ 的每个分量都为零，因为 $f = ${f}$ 的混合偏导连续，按任一顺序求都相等（克莱罗定理）。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Exported list of all Unit 1 topics
// ---------------------------------------------------------------------------

/** multivariableCalculusVectorFunctionTopics contains all Unit 1 topics of Multivariable Calculus. */
export const multivariableCalculusVectorFunctionTopics: readonly TopicDef[] = [
  theDomainOfAVectorValuedFunction,
  limitsOfVectorValuedFunctions,
  continuityAndDifferentiabilityOfVectorValuedFunctions,
  differentiationRulesForVectorValuedFunctions,
  integrationRulesForVectorValuedFunctions,
  theArcLengthOfAVectorValuedFunction,
  tangentVectorsAndTangentLinesToCurves,
  unitTangentVectors,
  principalNormalVectors,
  binormalVectors,
  theOsculatingPlane,
  parameterizationByArcLength,
  introductionToCurvature,
  findingCurvatureUsingTheCrossProduct,
  radiusOfCurvature,
  theCurvatureOfAPlaneCurve,
  vectorFields,
  visualizingVectorFields,
  gradientVectorFields,
  conservativeVectorFieldsInTheCartesianPlane,
  calculatingPotentialFunctions,
  connectedAndSimplyConnectedRegions,
  streamFunctions,
  theDivergenceOfAVectorField,
  propertiesOfTheDivergenceOperator,
  theCurlOfAVectorField,
  propertiesOfTheCurlOperator,
];
