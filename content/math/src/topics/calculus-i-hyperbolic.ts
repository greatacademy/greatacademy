import type { Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { numberProblem, say, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { graphAltOf, oneOf, range, sqrtLatex } from "./calculus-common.ts";
import { firsts, fmt, functionWith, walked } from "./calculus-i-differentiation.ts";

// Calculus I unit 1: Preliminaries, module 1.1 (The Hyperbolic Functions).

/** triples are Pythagorean triples (a, b, c) with a² + b² = c², used for exact hyperbolic values. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
  [12, 35, 37],
  [11, 60, 61],
];

/** sinhLn is sinh(ln k) = (k − 1/k)/2. */
const sinhLn = (k: Q) => k.sub(Q.one.div(k)).div(Q.of(2));
/** coshLn is cosh(ln k) = (k + 1/k)/2. */
const coshLn = (k: Q) => k.add(Q.one.div(k)).div(Q.of(2));
/** tanhLn is tanh(ln k) = (k² − 1)/(k² + 1). */
const tanhLn = (k: Q) => k.mul(k).sub(Q.one).div(k.mul(k).add(Q.one));

/** shift writes "+ k" or "- |k|" after a term, or nothing for 0. */
const shift = (k: number) => (k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`);

/** L writes a rational number in LaTeX. */
const L = (q: Q) => q.toLatex();

/** P writes a rational number in LaTeX, in parentheses when it is negative. */
const P = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** inner writes x − h, in parentheses unless h is 0. */
const innerOf = (h: number) => (h === 0 ? "x" : `(x ${h > 0 ? "-" : "+"} ${Math.abs(h)})`);

/** lnArg writes the argument ln k with a sign in one of three forms. */
function lnArg(k: number, negative: boolean, form: number): string {
  if (!negative) return `\\ln ${k}`;
  return form === 0 ? `-\\ln ${k}` : `\\ln \\frac{1}{${k}}`;
}

/** HyperbolicGraph is a hyperbolic function drawn for identification, with its shape in words. */
interface HyperbolicGraph {
  readonly name: string;
  readonly f: (x: number) => number;
  readonly shape: Text;
}

const basicGraphs: readonly HyperbolicGraph[] = [
  {
    name: "\\sinh x",
    f: Math.sinh,
    shape: t("crosses its centre line and grows without bound in both directions", "穿过它的中心线，并向两侧无界增长"),
  },
  {
    name: "\\cosh x",
    f: Math.cosh,
    shape: t("is U-shaped, with one turning point and no asymptote", "呈 U 形，有一个转折点，没有渐近线"),
  },
  {
    name: "\\tanh x",
    f: Math.tanh,
    shape: t("levels off at two different horizontal asymptotes", "向两条不同的水平渐近线趋平"),
  },
];

const reciprocalGraphs: readonly HyperbolicGraph[] = [
  {
    name: "\\operatorname{sech} x",
    f: (x) => 1 / Math.cosh(x),
    shape: t("is a single bell with no vertical asymptote", "是一个钟形，没有竖直渐近线"),
  },
  {
    name: "\\operatorname{csch} x",
    f: (x) => 1 / Math.sinh(x),
    shape: t(
      "has two branches on either side of $x = 0$, both approaching the same horizontal line",
      "在 $x = 0$ 两侧各有一支，两支趋近同一条水平线",
    ),
  },
  {
    name: "\\coth x",
    f: (x) => 1 / Math.tanh(x),
    shape: t(
      "has two branches on either side of $x = 0$, approaching two different horizontal lines",
      "在 $x = 0$ 两侧各有一支，分别趋近两条不同的水平线",
    ),
  },
];

/** graphChoice asks which equation a drawn hyperbolic graph has. */
function graphChoice(rng: Rng, graphs: readonly HyperbolicGraph[]) {
  const g = rng.pick(graphs);
  const s = rng.pick([1, -1] as const);
  const k = rng.int(-2, 2);
  const eq = (h: HyperbolicGraph, sign: number) => `y = ${sign < 0 ? "-" : ""}${h.name}${shift(k)}`;
  const label = (h: HyperbolicGraph, sign: number) => same(`$${eq(h, sign)}$`);
  const others = graphs.filter((h) => h !== g);
  const figure = {
    svg: plane({ xMin: -4, xMax: 4, yMin: -5, yMax: 5 }, [{ kind: "curve", f: (x) => s * g.f(x) + k, accent: true }]),
    alt: graphAltOf({ xMin: -4, xMax: 4, yMin: -5, yMax: 5 }, [{ kind: "curve", f: (x) => s * g.f(x) + k }]),
  };
  const at1 = s * g.f(1) + k;
  const shapeReason = (h: HyperbolicGraph): Reason => [
    `$${eq(h, 1)}$`,
    `The graph of $y = ${h.name}$ ${h.shape.en}, but this graph ${g.shape.en}.`,
    `$y = ${h.name}$ 的图像${h.shape["zh-CN"]}，而这个图像${g.shape["zh-CN"]}。`,
  ];
  const reasons: Reason[] = [
    [
      `$${eq(g, -s)}$`,
      s < 0
        ? `This leaves out the reflection: the graph is that of $y = ${g.name}$ turned upside down.`
        : `This reflects the graph in the $x$-axis, but the graph has the same orientation as $y = ${g.name}$.`,
      s < 0
        ? `这漏掉了反射：图像是 $y = ${g.name}$ 上下翻转后的样子。`
        : `这把图像关于 $x$ 轴反射了，但图像与 $y = ${g.name}$ 的方向相同。`,
    ],
    ...others.flatMap((h) => {
      const [, en, zh] = shapeReason(h);
      return [[`$${eq(h, s)}$`, en, zh] as Reason, [`$${eq(h, -s)}$`, en, zh] as Reason];
    }),
  ];
  return reasoned(
    oneOf(
      rng,
      t("Which equation does the graph show?", "图中是哪个方程的图像？"),
      label(g, s),
      [label(g, -s), label(others[0]!, s), label(others[1]!, s), label(others[0]!, -s)],
      walked(
        [
          [
            ["Match the shape", "对照形状"],
            t(
              `The curve ${g.shape.en}, which is the shape of $y = ${g.name}$.`,
              `这条曲线${g.shape["zh-CN"]}，这是 $y = ${g.name}$ 的形状。`,
            ),
          ],
          [
            ["Read the reflection and the shift", "读出反射和平移"],
            t(
              `It is ${s < 0 ? "reflected in the $x$-axis" : "not reflected"} and ${k === 0 ? "not shifted vertically" : `shifted ${Math.abs(k)} ${k > 0 ? "up" : "down"}`}, so the equation is $${eq(g, s)}$.`,
              `它${s < 0 ? "关于 $x$ 轴反射" : "没有反射"}，${k === 0 ? "没有竖直平移" : `向${k > 0 ? "上" : "下"}平移 ${Math.abs(k)} 个单位`}，所以方程是 $${eq(g, s)}$。`,
            ),
          ],
        ],
        t(
          `At $x = 1$ the equation gives $y \\approx ${fmt(at1)}$, and the curve passes through the point $(1, ${fmt(at1)})$ on the graph.`,
          `在 $x = 1$ 处，方程给出 $y \\approx ${fmt(at1)}$，曲线也正好经过图上的点 $(1, ${fmt(at1)})$。`,
        ),
      ),
      figure,
    ),
    reasons,
  );
}

/** theHyperbolicFunctions defines sinh, cosh and tanh and evaluates them. */
export const theHyperbolicFunctions: TopicDef = {
  id: "the-hyperbolic-functions",
  title: t("The Hyperbolic Functions", "双曲函数"),
  summary: t(
    "Define the hyperbolic sine, cosine and tangent from the exponential function, evaluate them at logarithms, and use the identity cosh²x − sinh²x = 1.",
    "用指数函数定义双曲正弦、双曲余弦和双曲正切，在对数处求值，并使用恒等式 cosh²x − sinh²x = 1。",
  ),
  intro: t(
    "Averaging $e^{x}$ and $e^{-x}$ gives a new function, and so does halving their difference. At $x = \\ln 2$, $e^{x} = 2$ and $e^{-x} = \\frac{1}{2}$, so the half-difference is $\\frac{2 - \\frac{1}{2}}{2} = \\frac{3}{4}$ and the average is $\\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$. These are the hyperbolic sine and cosine of $\\ln 2$.\n\nCheck: $\\left(\\frac{5}{4}\\right)^{2} - \\left(\\frac{3}{4}\\right)^{2} = \\frac{25 - 9}{16} = 1$, as the identity $\\cosh^{2} x - \\sinh^{2} x = 1$ says.\n\nIn this lesson we define $\\sinh$, $\\cosh$ and $\\tanh$, evaluate them at logarithms, and use the identity to find one value from another.",
    "把 $e^{x}$ 与 $e^{-x}$ 取平均，得到一个新函数；把它们的差取一半，又得到一个。在 $x = \\ln 2$ 处，$e^{x} = 2$，$e^{-x} = \\frac{1}{2}$，所以差的一半是 $\\frac{2 - \\frac{1}{2}}{2} = \\frac{3}{4}$，平均值是 $\\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$。它们就是 $\\ln 2$ 的双曲正弦和双曲余弦。\n\n检验：$\\left(\\frac{5}{4}\\right)^{2} - \\left(\\frac{3}{4}\\right)^{2} = \\frac{25 - 9}{16} = 1$，正如恒等式 $\\cosh^{2} x - \\sinh^{2} x = 1$ 所说。\n\n本课我们定义 $\\sinh$、$\\cosh$ 和 $\\tanh$，在对数处求值，并用恒等式由一个值求出另一个值。",
  ),
  prerequisites: ["natural-logarithm"],
  encompasses: [{ topic: "natural-logarithm", weight: 0.2 }],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-sinh-and-cosh",
      title: t("Evaluating sinh and cosh", "计算 sinh 与 cosh"),
      explanation: t(
        "The hyperbolic functions are built from exponentials, so to evaluate one at a logarithm, substitute and use the fact that the exponential undoes the logarithm. The **hyperbolic sine** and **hyperbolic cosine** are\n\n$$\\sinh x = \\frac{e^{x} - e^{-x}}{2}, \\qquad \\cosh x = \\frac{e^{x} + e^{-x}}{2}.$$\n\n$\\sinh$ is odd and $\\cosh$ is even. At $x = \\ln k$, $e^{x} = k$ and $e^{-x} = \\frac{1}{k}$:\n\n$$\\sinh(\\ln 3) = \\frac{3 - \\frac{1}{3}}{2} = \\frac{4}{3}, \\qquad \\cosh(\\ln 3) = \\frac{3 + \\frac{1}{3}}{2} = \\frac{5}{3}.$$\n\nCheck: $\\left(\\frac{5}{3}\\right)^{2} - \\left(\\frac{4}{3}\\right)^{2} = \\frac{25 - 16}{9} = 1$, as $\\cosh^{2} x - \\sinh^{2} x = 1$ requires.\n\n> **Watch out.** $e^{-\\ln k}$ is $\\frac{1}{k}$, not $-k$. And $\\sinh$ subtracts $e^{-x}$ while $\\cosh$ adds it; both divide by $2$.",
        "双曲函数由指数函数构成，所以在对数处求值时，代入后利用指数函数与对数互逆这一事实化简。**双曲正弦**和**双曲余弦**定义为\n\n$$\\sinh x = \\frac{e^{x} - e^{-x}}{2}, \\qquad \\cosh x = \\frac{e^{x} + e^{-x}}{2}.$$\n\n$\\sinh$ 是奇函数，$\\cosh$ 是偶函数。在 $x = \\ln k$ 处，$e^{x} = k$，$e^{-x} = \\frac{1}{k}$：\n\n$$\\sinh(\\ln 3) = \\frac{3 - \\frac{1}{3}}{2} = \\frac{4}{3}, \\qquad \\cosh(\\ln 3) = \\frac{3 + \\frac{1}{3}}{2} = \\frac{5}{3}.$$\n\n检验：$\\left(\\frac{5}{3}\\right)^{2} - \\left(\\frac{4}{3}\\right)^{2} = \\frac{25 - 16}{9} = 1$，符合 $\\cosh^{2} x - \\sinh^{2} x = 1$。\n\n> **注意。** $e^{-\\ln k}$ 是 $\\frac{1}{k}$，不是 $-k$。$\\sinh$ 减去 $e^{-x}$，$\\cosh$ 加上 $e^{-x}$；两者都要除以 $2$。",
      ),
      keyPrerequisites: ["natural-logarithm"],
      generate(rng) {
        const k = rng.int(2, 9);
        const negative = rng.bool();
        const isSinh = rng.bool();
        const kq = Q.of(negative ? 1 : k, negative ? k : 1);
        const inv = Q.one.div(kq);
        const sinh = sinhLn(kq);
        const cosh = coshLn(kq);
        const answer = isSinh ? sinh : cosh;
        const partner = isSinh ? cosh : sinh;
        const arg = lnArg(k, negative, rng.int(0, 1));
        const name = isSinh ? "\\sinh" : "\\cosh";
        const other = isSinh ? "\\cosh" : "\\sinh";
        return numberProblem({
          prompt: t(`Find the exact value of $${name}(${arg})$.`, `求 $${name}(${arg})$ 的精确值。`),
          answer,
          mistakes: [
            why(
              partner,
              `This is $${other}(${arg})$: it ${isSinh ? "adds" : "subtracts"} $e^{-x}$, where $${name}$ ${isSinh ? "subtracts" : "adds"} it.`,
              `这是 $${other}(${arg})$：它${isSinh ? "加上" : "减去"} $e^{-x}$，而 $${name}$ 要${isSinh ? "减去" : "加上"}它。`,
            ),
            why(answer.mul(Q.of(2)), "This leaves out the division by $2$ in the definition.", "这漏掉了定义中的除以 $2$。"),
            isSinh
              ? why(
                  answer.neg(),
                  `This has the wrong sign: $e^{x} = ${L(kq)}$ comes first and $e^{-x} = ${L(inv)}$ is subtracted from it.`,
                  `符号错了：$e^{x} = ${L(kq)}$ 在前，再减去 $e^{-x} = ${L(inv)}$。`,
                )
              : why(
                  answer.neg(),
                  "$\\cosh$ is a sum of two positive numbers, so it is never negative.",
                  "$\\cosh$ 是两个正数之和，不可能是负数。",
                ),
          ],
          solution: walked(
            [
              [
                ["Find the exponentials", "求出指数"],
                t(
                  `With $x = ${arg}$, $e^{x} = ${L(kq)}$ and $e^{-x} = ${L(inv)}$.`,
                  `取 $x = ${arg}$，则 $e^{x} = ${L(kq)}$，$e^{-x} = ${L(inv)}$。`,
                ),
              ],
              [
                ["Substitute", "代入"],
                t("Put them into the definition:", "代入定义："),
                [`${name}(${arg}) = \\frac{${L(kq)} ${isSinh ? "-" : "+"} ${L(inv)}}{2} = ${L(answer)}`],
              ],
            ],
            t(
              `The same way, $${other}(${arg}) = ${L(partner)}$, and $\\cosh^{2} x - \\sinh^{2} x = \\left(${L(cosh)}\\right)^{2} - \\left(${L(sinh)}\\right)^{2} = ${L(cosh.mul(cosh))} - ${L(sinh.mul(sinh))} = 1$, as the identity requires.`,
              `同样可得 $${other}(${arg}) = ${L(partner)}$，而 $\\cosh^{2} x - \\sinh^{2} x = \\left(${L(cosh)}\\right)^{2} - \\left(${L(sinh)}\\right)^{2} = ${L(cosh.mul(cosh))} - ${L(sinh.mul(sinh))} = 1$，符合恒等式。`,
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-tanh",
      title: t("Evaluating tanh", "计算 tanh"),
      explanation: t(
        "The hyperbolic tangent is the ratio of the hyperbolic sine to the hyperbolic cosine, and its values always lie strictly between minus one and one. The **hyperbolic tangent** is\n\n$$\\tanh x = \\frac{\\sinh x}{\\cosh x} = \\frac{e^{x} - e^{-x}}{e^{x} + e^{-x}}.$$\n\nIt is odd. At $x = \\ln k$, multiply the top and bottom by $k$:\n\n$$\\tanh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2 + \\frac{1}{2}} = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}.$$\n\nCheck: $\\sinh(\\ln 2) = \\frac{3}{4}$ and $\\cosh(\\ln 2) = \\frac{5}{4}$, and $\\frac{3}{4} \\div \\frac{5}{4} = \\frac{3}{5}$.\n\n> **Watch out.** Multiplying top and bottom by $k$ turns $k$ into $k^{2}$: the result is $\\frac{k^{2} - 1}{k^{2} + 1}$, not $\\frac{k - 1}{k + 1}$. At a negative argument, $\\tanh$ is negative.",
        "双曲正切是双曲正弦与双曲余弦之比，它的值总是严格介于 −1 和 1 之间。**双曲正切**定义为\n\n$$\\tanh x = \\frac{\\sinh x}{\\cosh x} = \\frac{e^{x} - e^{-x}}{e^{x} + e^{-x}}.$$\n\n它是奇函数。在 $x = \\ln k$ 处，分子分母同乘 $k$：\n\n$$\\tanh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2 + \\frac{1}{2}} = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}.$$\n\n检验：$\\sinh(\\ln 2) = \\frac{3}{4}$，$\\cosh(\\ln 2) = \\frac{5}{4}$，而 $\\frac{3}{4} \\div \\frac{5}{4} = \\frac{3}{5}$。\n\n> **注意。** 分子分母同乘 $k$ 后，$k$ 变成 $k^{2}$：结果是 $\\frac{k^{2} - 1}{k^{2} + 1}$，不是 $\\frac{k - 1}{k + 1}$。自变量为负时，$\\tanh$ 的值为负。",
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const negative = rng.bool(0.6);
        const form = rng.int(0, 1);
        const kq = Q.of(negative ? 1 : k, negative ? k : 1);
        const answer = tanhLn(kq);
        const positive = Q.of(k * k - 1, k * k + 1);
        const arg = lnArg(k, negative, form);
        const k2 = k * k;
        return numberProblem({
          prompt: t(`Find the exact value of $\\tanh(${arg})$.`, `求 $\\tanh(${arg})$ 的精确值。`),
          answer,
          mistakes: [
            why(
              answer.neg(),
              negative
                ? `This has the wrong sign: $${arg}$ is negative and $\\tanh$ is odd, so the value is negative.`
                : `This has the wrong sign: $\\ln ${k}$ is positive, so $\\tanh(\\ln ${k})$ is positive.`,
              negative
                ? `符号错了：$${arg}$ 是负数，而 $\\tanh$ 是奇函数，所以值为负。`
                : `符号错了：$\\ln ${k}$ 是正数，所以 $\\tanh(\\ln ${k})$ 是正数。`,
            ),
            why(
              Q.of(k2 + 1, k2 - 1),
              "This is upside down: it is $\\frac{\\cosh}{\\sinh}$, that is $\\coth$, not $\\tanh$.",
              "这把分数颠倒了：它是 $\\frac{\\cosh}{\\sinh}$，即 $\\coth$，不是 $\\tanh$。",
            ),
            why(
              Q.of(k - 1, k + 1),
              `This uses $k$ where multiplying by $k$ gives $k^{2}$: the top is $${k2} - 1$ and the bottom is $${k2} + 1$.`,
              `乘以 $k$ 后应得到 $k^{2}$，这里却用了 $k$：分子是 $${k2} - 1$，分母是 $${k2} + 1$。`,
            ),
          ],
          solution: walked(
            [
              [
                ["Write it with exponentials", "写成指数形式"],
                t(
                  `At $\\ln ${k}$, $e^{x} = ${k}$ and $e^{-x} = \\frac{1}{${k}}$; multiply the top and bottom by $${k}$:`,
                  `在 $\\ln ${k}$ 处，$e^{x} = ${k}$，$e^{-x} = \\frac{1}{${k}}$；分子分母同乘 $${k}$：`,
                ),
                [
                  `\\tanh(\\ln ${k}) = \\frac{${k} - \\frac{1}{${k}}}{${k} + \\frac{1}{${k}}} = \\frac{${k2} - 1}{${k2} + 1} = ${L(positive)}`,
                ],
              ],
              negative
                ? [
                    ["Use that $\\tanh$ is odd", "利用 $\\tanh$ 是奇函数"],
                    t(
                      `$${arg} = -\\ln ${k}$, so $\\tanh(${arg}) = -\\tanh(\\ln ${k}) = ${L(answer)}$.`,
                      `$${arg} = -\\ln ${k}$，所以 $\\tanh(${arg}) = -\\tanh(\\ln ${k}) = ${L(answer)}$。`,
                    ),
                  ]
                : [
                    ["State the value", "写出结果"],
                    t(`So $\\tanh(\\ln ${k}) = ${L(answer)}$.`, `所以 $\\tanh(\\ln ${k}) = ${L(answer)}$。`),
                  ],
            ],
            t(
              `$\\sinh(${arg}) = ${L(sinhLn(kq))}$ and $\\cosh(${arg}) = ${L(coshLn(kq))}$, and $${P(sinhLn(kq))} \\div ${L(coshLn(kq))} = ${L(answer)}$.`,
              `$\\sinh(${arg}) = ${L(sinhLn(kq))}$，$\\cosh(${arg}) = ${L(coshLn(kq))}$，而 $${P(sinhLn(kq))} \\div ${L(coshLn(kq))} = ${L(answer)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-hyperbolic-identity",
      title: t("The identity $\\cosh^2 x - \\sinh^2 x = 1$", "恒等式 $\\cosh^2 x - \\sinh^2 x = 1$"),
      explanation: t(
        "This identity plays the same role for hyperbolic functions that the Pythagorean identity plays for sine and cosine, but with a minus sign instead of a plus. Squaring the definitions and subtracting gives\n\n$$\\cosh^{2} x - \\sinh^{2} x = 1.$$\n\nSince $\\cosh x > 0$ always, $\\cosh x = \\sqrt{1 + \\sinh^{2} x}$. If $\\sinh x = \\frac{3}{4}$, then $\\cosh x = \\sqrt{1 + \\frac{9}{16}} = \\frac{5}{4}$ and $\\tanh x = \\frac{3/4}{5/4} = \\frac{3}{5}$.\n\nCheck: $\\cosh^{2} x - \\sinh^{2} x = \\frac{25}{16} - \\frac{9}{16} = 1$.\n\n> **Watch out.** The identity has a minus sign, so $\\cosh^{2} x = 1 + \\sinh^{2} x$, not $1 - \\sinh^{2} x$. Take the positive root for $\\cosh x$ even when $\\sinh x$ is negative; $\\tanh x$ has the sign of $\\sinh x$.",
        "这个恒等式对双曲函数的作用，就像勾股恒等式对正弦和余弦的作用一样，只是把加号换成了减号。把定义平方后相减得\n\n$$\\cosh^{2} x - \\sinh^{2} x = 1.$$\n\n因为 $\\cosh x$ 恒为正，$\\cosh x = \\sqrt{1 + \\sinh^{2} x}$。若 $\\sinh x = \\frac{3}{4}$，则 $\\cosh x = \\sqrt{1 + \\frac{9}{16}} = \\frac{5}{4}$，$\\tanh x = \\frac{3/4}{5/4} = \\frac{3}{5}$。\n\n检验：$\\cosh^{2} x - \\sinh^{2} x = \\frac{25}{16} - \\frac{9}{16} = 1$。\n\n> **注意。** 恒等式中是减号，所以 $\\cosh^{2} x = 1 + \\sinh^{2} x$，不是 $1 - \\sinh^{2} x$。即使 $\\sinh x$ 为负，$\\cosh x$ 也取正根；$\\tanh x$ 与 $\\sinh x$ 同号。",
      ),
      generate(rng) {
        const [p, q, c] = rng.pick(triples);
        const [a, b] = rng.bool() ? [p, q] : [q, p];
        const s = rng.sign();
        const sinh = Q.of(s * a, b);
        const cosh = Q.of(c, b);
        const askTanh = rng.bool();
        const answer = askTanh ? sinh.div(cosh) : cosh;
        const name = askTanh ? "\\tanh" : "\\cosh";
        const parts = [
          [
            ["Use the identity", "使用恒等式"],
            t("$\\cosh^{2} x = 1 + \\sinh^{2} x$:", "$\\cosh^{2} x = 1 + \\sinh^{2} x$："),
            [`\\cosh^{2} x = 1 + ${L(Q.of(a * a, b * b))} = ${L(Q.of(c * c, b * b))}`],
          ],
          [
            ["Take the positive root", "取正根"],
            t(`$\\cosh x$ is always positive, so $\\cosh x = ${L(cosh)}$.`, `$\\cosh x$ 恒为正，所以 $\\cosh x = ${L(cosh)}$。`),
          ],
          ...(askTanh
            ? [
                [
                  ["Divide", "相除"],
                  t("", ""),
                  [`\\tanh x = \\frac{\\sinh x}{\\cosh x} = ${P(sinh)} \\div ${L(cosh)} = ${L(answer)}`],
                ] as const,
              ]
            : []),
        ] as const;
        return numberProblem({
          prompt: t(`If $\\sinh x = ${L(sinh)}$, find $${name} x$.`, `若 $\\sinh x = ${L(sinh)}$，求 $${name} x$。`),
          answer,
          mistakes: askTanh
            ? [
                why(
                  answer.neg(),
                  "This has the wrong sign: $\\cosh x$ is positive, so $\\tanh x$ has the sign of $\\sinh x$.",
                  "符号错了：$\\cosh x$ 为正，所以 $\\tanh x$ 与 $\\sinh x$ 同号。",
                ),
                why(
                  cosh.div(sinh),
                  "This is upside down: $\\tanh x = \\frac{\\sinh x}{\\cosh x}$.",
                  "这把分数颠倒了：$\\tanh x = \\frac{\\sinh x}{\\cosh x}$。",
                ),
                why(
                  sinh.mul(cosh),
                  "This multiplies $\\sinh x$ by $\\cosh x$ instead of dividing.",
                  "这是把 $\\sinh x$ 乘以 $\\cosh x$，而不是相除。",
                ),
              ]
            : [
                why(cosh.neg(), "$\\cosh x$ is always positive, so take the positive root.", "$\\cosh x$ 恒为正，所以取正根。"),
                why(
                  Q.of(b, c),
                  "This is $\\frac{1}{\\cosh x}$, that is $\\operatorname{sech} x$.",
                  "这是 $\\frac{1}{\\cosh x}$，即 $\\operatorname{sech} x$。",
                ),
                why(
                  Q.one.sub(sinh.mul(sinh)),
                  "This uses $1 - \\sinh^{2} x$ and takes no square root; the identity gives $\\cosh^{2} x = 1 + \\sinh^{2} x$.",
                  "这用了 $1 - \\sinh^{2} x$，也没有开方；恒等式给出的是 $\\cosh^{2} x = 1 + \\sinh^{2} x$。",
                ),
              ],
          solution: walked(
            parts,
            askTanh
              ? t(
                  `$1 - \\tanh^{2} x = 1 - ${L(Q.of(a * a, c * c))} = ${L(Q.of(b * b, c * c))}$, which is $\\left(\\frac{1}{\\cosh x}\\right)^{2} = \\left(${L(Q.of(b, c))}\\right)^{2}$, as the identity divided by $\\cosh^{2} x$ requires.`,
                  `$1 - \\tanh^{2} x = 1 - ${L(Q.of(a * a, c * c))} = ${L(Q.of(b * b, c * c))}$，正是 $\\left(\\frac{1}{\\cosh x}\\right)^{2} = \\left(${L(Q.of(b, c))}\\right)^{2}$，符合恒等式除以 $\\cosh^{2} x$ 后的形式。`,
                )
              : t(
                  `$\\cosh^{2} x - \\sinh^{2} x = ${L(Q.of(c * c, b * b))} - ${L(Q.of(a * a, b * b))} = \\frac{${c * c - a * a}}{${b * b}} = 1$.`,
                  `$\\cosh^{2} x - \\sinh^{2} x = ${L(Q.of(c * c, b * b))} - ${L(Q.of(a * a, b * b))} = \\frac{${c * c - a * a}}{${b * b}} = 1$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** reciprocalNames are the reciprocal functions, with their definitions in words. */
const reciprocalNames = ["\\operatorname{sech}", "\\operatorname{csch}", "\\coth"] as const;
const reciprocalDefs = ["\\frac{1}{\\cosh x}", "\\frac{1}{\\sinh x}", "\\frac{\\cosh x}{\\sinh x}"] as const;

/** theReciprocalHyperbolicFunctions defines sech, csch and coth. */
export const theReciprocalHyperbolicFunctions: TopicDef = {
  id: "the-reciprocal-hyperbolic-functions",
  title: t("The Reciprocal Hyperbolic Functions", "倒数双曲函数"),
  summary: t(
    "Define the hyperbolic secant, cosecant and cotangent as reciprocals of cosh, sinh and tanh, and evaluate them.",
    "把双曲正割、双曲余割和双曲余切定义为 cosh、sinh 和 tanh 的倒数，并求值。",
  ),
  intro: t(
    "Since $\\cosh(\\ln 2) = \\frac{5}{4}$, its reciprocal is $\\frac{4}{5}$. This is the hyperbolic secant: $\\operatorname{sech}(\\ln 2) = \\frac{4}{5}$. The hyperbolic cosecant and cotangent are the reciprocals of $\\sinh$ and $\\tanh$ in the same way.\n\nCheck: directly, $\\frac{2}{e^{x} + e^{-x}} = \\frac{2}{2 + \\frac{1}{2}} = \\frac{4}{5}$.\n\nIn this lesson we evaluate $\\operatorname{sech}$, $\\operatorname{csch}$ and $\\coth$ at logarithms and find them from the value of $\\sinh$.",
    "因为 $\\cosh(\\ln 2) = \\frac{5}{4}$，它的倒数是 $\\frac{4}{5}$。这就是双曲正割：$\\operatorname{sech}(\\ln 2) = \\frac{4}{5}$。双曲余割和双曲余切同样分别是 $\\sinh$ 和 $\\tanh$ 的倒数。\n\n检验：直接计算，$\\frac{2}{e^{x} + e^{-x}} = \\frac{2}{2 + \\frac{1}{2}} = \\frac{4}{5}$。\n\n本课我们在对数处计算 $\\operatorname{sech}$、$\\operatorname{csch}$ 和 $\\coth$，并由 $\\sinh$ 的值求出它们。",
  ),
  prerequisites: ["the-hyperbolic-functions"],
  encompasses: [{ topic: "the-hyperbolic-functions", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-the-reciprocal-hyperbolic-functions",
      title: t("Evaluating sech, csch and coth", "计算 sech、csch 与 coth"),
      explanation: t(
        "Each reciprocal hyperbolic function is one over a basic one, so evaluate the basic function first and then take its reciprocal. $$\\operatorname{sech} x = \\frac{1}{\\cosh x} = \\frac{2}{e^{x} + e^{-x}}, \\quad \\operatorname{csch} x = \\frac{1}{\\sinh x}, \\quad \\coth x = \\frac{\\cosh x}{\\sinh x}.$$\n\n$\\operatorname{sech}$ is even; $\\operatorname{csch}$ and $\\coth$ are odd and not defined at $0$. Since $\\cosh(\\ln 2) = \\frac{5}{4}$, $\\operatorname{sech}(\\ln 2) = \\frac{4}{5}$.\n\nCheck: from the exponential form, $\\operatorname{sech}(\\ln 2) = \\frac{2}{2 + \\frac{1}{2}} = \\frac{4}{5}$.\n\n> **Watch out.** Pair each name with the right function: $\\operatorname{sech}$ is $\\frac{1}{\\cosh}$ and $\\operatorname{csch}$ is $\\frac{1}{\\sinh}$. $\\operatorname{sech}$ is always positive, while $\\operatorname{csch}$ and $\\coth$ take the sign of the argument.",
        "每个倒数双曲函数都是某个基本双曲函数的倒数，所以先求出基本函数的值，再取倒数。$$\\operatorname{sech} x = \\frac{1}{\\cosh x} = \\frac{2}{e^{x} + e^{-x}}, \\quad \\operatorname{csch} x = \\frac{1}{\\sinh x}, \\quad \\coth x = \\frac{\\cosh x}{\\sinh x}.$$\n\n$\\operatorname{sech}$ 是偶函数；$\\operatorname{csch}$ 和 $\\coth$ 是奇函数，在 $0$ 处无定义。因为 $\\cosh(\\ln 2) = \\frac{5}{4}$，所以 $\\operatorname{sech}(\\ln 2) = \\frac{4}{5}$。\n\n检验：由指数形式，$\\operatorname{sech}(\\ln 2) = \\frac{2}{2 + \\frac{1}{2}} = \\frac{4}{5}$。\n\n> **注意。** 名称要与函数对应：$\\operatorname{sech}$ 是 $\\frac{1}{\\cosh}$，$\\operatorname{csch}$ 是 $\\frac{1}{\\sinh}$。$\\operatorname{sech}$ 恒为正，而 $\\operatorname{csch}$ 和 $\\coth$ 与自变量同号。",
      ),
      generate(rng) {
        const k = rng.int(2, 10);
        const negative = rng.bool();
        const kq = Q.of(negative ? 1 : k, negative ? k : 1);
        const inv = Q.one.div(kq);
        const which = rng.int(0, 2);
        const name = reciprocalNames[which]!;
        const base = [coshLn(kq), sinhLn(kq), tanhLn(kq)][which]!;
        const answer = Q.one.div(base);
        const arg = lnArg(k, negative, rng.int(0, 1));
        const baseName = ["\\cosh", "\\sinh", "\\tanh"][which]!;
        const baseLine = [
          `\\cosh(${arg}) = \\frac{${L(kq)} + ${L(inv)}}{2} = ${L(base)}`,
          `\\sinh(${arg}) = \\frac{${L(kq)} - ${L(inv)}}{2} = ${L(base)}`,
          `\\tanh(${arg}) = \\frac{${L(kq)} - ${L(inv)}}{${L(kq)} + ${L(inv)}} = ${L(base)}`,
        ][which]!;
        const direct = [
          `\\operatorname{sech}(${arg}) = \\frac{2}{e^{x} + e^{-x}} = \\frac{2}{${L(kq)} + ${L(inv)}} = ${L(answer)}`,
          `\\operatorname{csch}(${arg}) = \\frac{2}{e^{x} - e^{-x}} = \\frac{2}{${L(kq)} - ${L(inv)}} = ${L(answer)}`,
          `\\coth(${arg}) = \\frac{e^{x} + e^{-x}}{e^{x} - e^{-x}} = \\frac{${L(kq)} + ${L(inv)}}{${L(kq)} - ${L(inv)}} = ${L(answer)}`,
        ][which]!;
        const mixUp = [
          why(
            Q.one.div(sinhLn(kq)),
            "This is $\\frac{1}{\\sinh}$, which is $\\operatorname{csch}$; $\\operatorname{sech}$ is $\\frac{1}{\\cosh}$.",
            "这是 $\\frac{1}{\\sinh}$，即 $\\operatorname{csch}$；$\\operatorname{sech}$ 是 $\\frac{1}{\\cosh}$。",
          ),
          why(
            Q.one.div(coshLn(kq)),
            "This is $\\frac{1}{\\cosh}$, which is $\\operatorname{sech}$; $\\operatorname{csch}$ is $\\frac{1}{\\sinh}$.",
            "这是 $\\frac{1}{\\cosh}$，即 $\\operatorname{sech}$；$\\operatorname{csch}$ 是 $\\frac{1}{\\sinh}$。",
          ),
          why(
            Q.one.div(coshLn(kq)),
            "This is $\\frac{1}{\\cosh}$, which is $\\operatorname{sech}$; $\\coth$ is $\\frac{\\cosh}{\\sinh}$.",
            "这是 $\\frac{1}{\\cosh}$，即 $\\operatorname{sech}$；$\\coth$ 是 $\\frac{\\cosh}{\\sinh}$。",
          ),
        ][which]!;
        return numberProblem({
          prompt: t(`Find the exact value of $${name}(${arg})$.`, `求 $${name}(${arg})$ 的精确值。`),
          answer,
          mistakes: firsts([
            why(
              base,
              `This is $${baseName}(${arg})$ itself; $${name}$ is its reciprocal.`,
              `这是 $${baseName}(${arg})$ 本身；$${name}$ 是它的倒数。`,
            ),
            which === 0
              ? why(
                  answer.neg(),
                  "$\\operatorname{sech}$ is always positive, because $\\cosh$ is.",
                  "$\\operatorname{sech}$ 恒为正，因为 $\\cosh$ 恒为正。",
                )
              : why(
                  answer.neg(),
                  `This has the wrong sign: $${name}$ is odd and takes the sign of the argument, which is ${negative ? "negative" : "positive"}.`,
                  `符号错了：$${name}$ 是奇函数，与自变量同号，而自变量是${negative ? "负" : "正"}的。`,
                ),
            mixUp,
          ]),
          solution: walked(
            [
              [
                [`Find $${baseName}$`, `求 $${baseName}$`],
                t(`With $e^{x} = ${L(kq)}$ and $e^{-x} = ${L(inv)}$:`, `由 $e^{x} = ${L(kq)}$，$e^{-x} = ${L(inv)}$：`),
                [baseLine],
              ],
              [
                ["Take the reciprocal", "取倒数"],
                t(
                  `$${name}(${arg}) = \\frac{1}{${L(base)}} = ${L(answer)}$.`,
                  `$${name}(${arg}) = \\frac{1}{${L(base)}} = ${L(answer)}$。`,
                ),
              ],
            ],
            t(`From the exponential form directly: $${direct}$.`, `直接由指数形式：$${direct}$。`),
          ),
        });
      },
    },
    {
      id: "reciprocal-hyperbolic-functions-from-sinh",
      title: t("Reciprocal hyperbolic values from sinh", "由 sinh 求倒数双曲函数值"),
      explanation: t(
        "Knowing one hyperbolic value is enough to find all the others, because the hyperbolic identity gives the cosine and the rest are quotients and reciprocals. From $\\sinh x$, find $\\cosh x = \\sqrt{1 + \\sinh^{2} x}$, then take reciprocals. If $\\sinh x = \\frac{5}{12}$, then $\\cosh x = \\frac{13}{12}$, so\n\n$$\\operatorname{sech} x = \\frac{12}{13}, \\quad \\operatorname{csch} x = \\frac{12}{5}, \\quad \\coth x = \\frac{13}{5}.$$\n\nCheck: $\\coth^{2} x - \\operatorname{csch}^{2} x = \\frac{169}{25} - \\frac{144}{25} = 1$, which is the identity divided by $\\sinh^{2} x$.\n\n> **Watch out.** $\\operatorname{csch} x$ and $\\coth x$ have the sign of $\\sinh x$, but $\\operatorname{sech} x$ is positive whatever the sign of $\\sinh x$.",
        "知道一个双曲函数值就足以求出所有其他值，因为双曲恒等式给出双曲余弦，其余都是商或倒数。由 $\\sinh x$ 先求 $\\cosh x = \\sqrt{1 + \\sinh^{2} x}$，再取倒数。若 $\\sinh x = \\frac{5}{12}$，则 $\\cosh x = \\frac{13}{12}$，所以\n\n$$\\operatorname{sech} x = \\frac{12}{13}, \\quad \\operatorname{csch} x = \\frac{12}{5}, \\quad \\coth x = \\frac{13}{5}.$$\n\n检验：$\\coth^{2} x - \\operatorname{csch}^{2} x = \\frac{169}{25} - \\frac{144}{25} = 1$，这正是恒等式除以 $\\sinh^{2} x$ 的结果。\n\n> **注意。** $\\operatorname{csch} x$ 和 $\\coth x$ 与 $\\sinh x$ 同号，而 $\\operatorname{sech} x$ 无论 $\\sinh x$ 的符号如何都为正。",
      ),
      generate(rng) {
        const [p, q, c] = rng.pick(triples);
        const [a, b] = rng.bool() ? [p, q] : [q, p];
        const s = rng.sign();
        const which = rng.int(0, 2);
        const name = reciprocalNames[which]!;
        const sinh = Q.of(s * a, b);
        const cosh = Q.of(c, b);
        const answer = [Q.of(b, c), Q.of(s * b, a), Q.of(s * c, a)][which]!;
        const defined = `$${name} x = ${reciprocalDefs[which]}$.`;
        const definedZh = `$${name} x = ${reciprocalDefs[which]}$。`;
        const last = [
          `\\operatorname{sech} x = \\frac{1}{\\cosh x} = ${L(answer)}`,
          `\\operatorname{csch} x = \\frac{1}{\\sinh x} = ${L(answer)}`,
          `\\coth x = \\frac{\\cosh x}{\\sinh x} = ${L(cosh)} \\div ${P(sinh)} = ${L(answer)}`,
        ][which]!;
        const check = [
          t(
            `$\\tanh x = ${P(sinh)} \\div ${L(cosh)} = ${L(Q.of(s * a, c))}$, and $1 - \\tanh^{2} x = 1 - ${L(Q.of(a * a, c * c))} = ${L(Q.of(b * b, c * c))} = \\left(${L(answer)}\\right)^{2}$, as $\\operatorname{sech}^{2} x = 1 - \\tanh^{2} x$ requires.`,
            `$\\tanh x = ${P(sinh)} \\div ${L(cosh)} = ${L(Q.of(s * a, c))}$，而 $1 - \\tanh^{2} x = 1 - ${L(Q.of(a * a, c * c))} = ${L(Q.of(b * b, c * c))} = \\left(${L(answer)}\\right)^{2}$，符合 $\\operatorname{sech}^{2} x = 1 - \\tanh^{2} x$。`,
          ),
          t(
            `$\\coth x = ${L(Q.of(s * c, a))}$, and $\\coth^{2} x - 1 = ${L(Q.of(c * c, a * a))} - 1 = ${L(Q.of(b * b, a * a))} = \\left(${L(answer)}\\right)^{2}$, as $\\operatorname{csch}^{2} x = \\coth^{2} x - 1$ requires.`,
            `$\\coth x = ${L(Q.of(s * c, a))}$，而 $\\coth^{2} x - 1 = ${L(Q.of(c * c, a * a))} - 1 = ${L(Q.of(b * b, a * a))} = \\left(${L(answer)}\\right)^{2}$，符合 $\\operatorname{csch}^{2} x = \\coth^{2} x - 1$。`,
          ),
          t(
            `$\\operatorname{csch} x = ${L(Q.of(s * b, a))}$, and $1 + \\operatorname{csch}^{2} x = 1 + ${L(Q.of(b * b, a * a))} = ${L(Q.of(c * c, a * a))} = \\left(${L(answer)}\\right)^{2}$, as $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$ requires.`,
            `$\\operatorname{csch} x = ${L(Q.of(s * b, a))}$，而 $1 + \\operatorname{csch}^{2} x = 1 + ${L(Q.of(b * b, a * a))} = ${L(Q.of(c * c, a * a))} = \\left(${L(answer)}\\right)^{2}$，符合 $\\coth^{2} x = 1 + \\operatorname{csch}^{2} x$。`,
          ),
        ][which]!;
        return numberProblem({
          prompt: t(`If $\\sinh x = ${L(sinh)}$, find $${name} x$.`, `若 $\\sinh x = ${L(sinh)}$，求 $${name} x$。`),
          answer,
          mistakes: firsts([
            why(cosh, `This is $\\cosh x$ itself. ${defined}`, `这是 $\\cosh x$ 本身。${definedZh}`),
            why(
              Q.of(s * a, c),
              `This is $\\tanh x = \\frac{\\sinh x}{\\cosh x}$. ${defined}`,
              `这是 $\\tanh x = \\frac{\\sinh x}{\\cosh x}$。${definedZh}`,
            ),
            which === 0
              ? why(
                  answer.neg(),
                  "$\\operatorname{sech} x$ is positive, because $\\cosh x$ is.",
                  "$\\operatorname{sech} x$ 为正，因为 $\\cosh x$ 为正。",
                )
              : why(
                  answer.neg(),
                  `This has the wrong sign: $${name} x$ has the sign of $\\sinh x$.`,
                  `符号错了：$${name} x$ 与 $\\sinh x$ 同号。`,
                ),
            why(sinh, `This is $\\sinh x$, the value given. ${defined}`, `这是已知的 $\\sinh x$。${definedZh}`),
          ]),
          solution: walked(
            [
              [
                ["Find $\\cosh x$", "求 $\\cosh x$"],
                t("By the identity, taking the positive root:", "由恒等式，取正根："),
                [`\\cosh x = \\sqrt{1 + ${L(Q.of(a * a, b * b))}} = \\sqrt{${L(Q.of(c * c, b * b))}} = ${L(cosh)}`],
              ],
              [which === 2 ? ["Divide", "相除"] : ["Take the reciprocal", "取倒数"], t("", ""), [last]],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** solvingEquationsContainingHyperbolicFunctions solves sinh, cosh and tanh equations through e^x. */
export const solvingEquationsContainingHyperbolicFunctions: TopicDef = {
  id: "solving-equations-containing-hyperbolic-functions",
  title: t("Solving Equations Containing Hyperbolic Functions", "解含双曲函数的方程"),
  summary: t(
    "Solve equations in $\\sinh$, $\\cosh$ and $\\tanh$ by rewriting them as quadratic equations in $e^x$.",
    "把含 $\\sinh$、$\\cosh$、$\\tanh$ 的方程改写成关于 $e^x$ 的二次方程来求解。",
  ),
  intro: t(
    "To solve $\\sinh x = \\frac{3}{4}$, write $u = e^{x}$: $\\frac{u - \\frac{1}{u}}{2} = \\frac{3}{4}$. Multiplying by $4u$ gives $2u^{2} - 3u - 2 = 0$, that is $(2u + 1)(u - 2) = 0$. Since $e^{x}$ is positive, $u = 2$ and $x = \\ln 2$.\n\nCheck: $\\sinh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2} = \\frac{3}{4}$.\n\nIn this lesson we solve equations in $\\sinh$, $\\cosh$ and $\\tanh$ by turning them into quadratic equations in $e^{x}$.",
    "解 $\\sinh x = \\frac{3}{4}$ 时，令 $u = e^{x}$：$\\frac{u - \\frac{1}{u}}{2} = \\frac{3}{4}$。两边乘以 $4u$ 得 $2u^{2} - 3u - 2 = 0$，即 $(2u + 1)(u - 2) = 0$。因为 $e^{x}$ 为正，所以 $u = 2$，$x = \\ln 2$。\n\n检验：$\\sinh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2} = \\frac{3}{4}$。\n\n本课我们把含 $\\sinh$、$\\cosh$、$\\tanh$ 的方程化为关于 $e^{x}$ 的二次方程来求解。",
  ),
  prerequisites: ["the-hyperbolic-functions", "solving-equations-containing-the-exponential-function"],
  encompasses: [
    { topic: "the-hyperbolic-functions", weight: 0.4 },
    { topic: "solving-equations-containing-the-exponential-function", weight: 0.3 },
  ],
  xp: 16,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-sinh-equations",
      title: t("Solving sinh x = c", "解 sinh x = c"),
      explanation: t(
        "To solve $\\sinh x = \\frac{4}{3}$, write it with $u = e^{x}$:\n\n$$\\frac{u - \\frac{1}{u}}{2} = \\frac{4}{3} \\;\\Rightarrow\\; 3u^{2} - 8u - 3 = 0 \\;\\Rightarrow\\; (3u + 1)(u - 3) = 0.$$\n\nSince $u = e^{x} > 0$, $u = 3$ and $x = \\ln 3$. There is always exactly one solution, because $\\sinh$ is increasing.\n\nCheck: $\\sinh(\\ln 3) = \\frac{3 - \\frac{1}{3}}{2} = \\frac{4}{3}$.\n\n> **Watch out.** Reject the negative root: $e^{x}$ is never negative, so $u = -\\frac{1}{3}$ gives no $x$.",
        "解 $\\sinh x = \\frac{4}{3}$ 时，令 $u = e^{x}$：\n\n$$\\frac{u - \\frac{1}{u}}{2} = \\frac{4}{3} \\;\\Rightarrow\\; 3u^{2} - 8u - 3 = 0 \\;\\Rightarrow\\; (3u + 1)(u - 3) = 0.$$\n\n因为 $u = e^{x} > 0$，所以 $u = 3$，$x = \\ln 3$。由于 $\\sinh$ 单调递增，方程总是恰有一个解。\n\n检验：$\\sinh(\\ln 3) = \\frac{3 - \\frac{1}{3}}{2} = \\frac{4}{3}$。\n\n> **注意。** 要舍去负根：$e^{x}$ 不可能为负，所以 $u = -\\frac{1}{3}$ 不给出 $x$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const s = rng.sign();
        const a = rng.int(1, 4);
        const kq = Q.of(k);
        const v = sinhLn(kq).mul(Q.of(s));
        const rhs = v.mul(Q.of(a));
        const r = s > 0 ? kq : Q.one.div(kq);
        const answer = `${s < 0 ? "-" : ""}\\ln ${k}`;
        const lhs = `${a === 1 ? "" : a}\\sinh x`;
        const divide =
          a === 1 ? t("", "") : t(`Dividing by $${a}$ gives $\\sinh x = ${L(v)}$. `, `两边除以 $${a}$，得 $\\sinh x = ${L(v)}$。`);
        return functionWith(
          {
            prompt: t(`Solve $${lhs} = ${L(rhs)}$. Give the exact value of $x$.`, `解方程 $${lhs} = ${L(rhs)}$，写出 $x$ 的精确值。`),
            answer,
            prefix: "x =",
            solution: walked(
              [
                [
                  ["Write it with $u = e^{x}$", "用 $u = e^{x}$ 表示"],
                  t(
                    `${divide.en}With $u = e^{x}$, $e^{-x} = \\frac{1}{u}$:`,
                    `${divide["zh-CN"]}令 $u = e^{x}$，则 $e^{-x} = \\frac{1}{u}$：`,
                  ),
                  [`\\frac{u - \\frac{1}{u}}{2} = ${L(v)}`],
                ],
                [
                  ["Clear the fractions", "去分母"],
                  t(
                    `Multiplying by $2u$ gives a quadratic, with roots $u = ${L(r)}$ and $u = ${L(Q.one.div(r).neg())}$:`,
                    `两边乘以 $2u$，得到一个二次方程，它的根是 $u = ${L(r)}$ 和 $u = ${L(Q.one.div(r).neg())}$：`,
                  ),
                  [`${poly([1, "u^2"], [v.mul(Q.of(-2)), "u"], [-1, ""])} = 0`],
                ],
                [
                  ["Keep the positive root", "保留正根"],
                  t(
                    `$e^{x}$ is positive, so $e^{x} = ${L(r)}$ and $x = ${answer}$.`,
                    `$e^{x}$ 为正，所以 $e^{x} = ${L(r)}$，$x = ${answer}$。`,
                  ),
                ],
              ],
              t(
                `$\\sinh(${answer}) = \\frac{${L(r)} - ${L(Q.one.div(r))}}{2} = ${L(v)}$${a === 1 ? "" : `, and $${a} \\cdot ${P(v)} = ${L(rhs)}$`}.`,
                `$\\sinh(${answer}) = \\frac{${L(r)} - ${L(Q.one.div(r))}}{2} = ${L(v)}$${a === 1 ? "" : `，而 $${a} \\cdot ${P(v)} = ${L(rhs)}$`}。`,
              ),
            ),
          },
          [
            say(
              `${s < 0 ? "" : "-"}\\ln ${k}`,
              `This has the wrong sign: the positive root is $e^{x} = ${L(r)}$, so $x = \\ln ${L(r)} = ${answer}$.`,
              `符号错了：正根是 $e^{x} = ${L(r)}$，所以 $x = \\ln ${L(r)} = ${answer}$。`,
            ),
            say(
              `\\ln ${k * k}`,
              `This takes $e^{x} = ${k * k}$, but the roots of the quadratic are $${L(r)}$ and $${L(Q.one.div(r).neg())}$.`,
              `这取了 $e^{x} = ${k * k}$，但二次方程的根是 $${L(r)}$ 和 $${L(Q.one.div(r).neg())}$。`,
            ),
            ...(s > 0
              ? [
                  say(
                    `\\ln ${L(v.mul(Q.of(2)))}`,
                    "This drops the $e^{-x}$ term: $e^{x} = 2\\sinh x$ would hold only without it.",
                    "这丢掉了 $e^{-x}$ 项：只有没有这一项时才有 $e^{x} = 2\\sinh x$。",
                  ),
                ]
              : []),
          ],
        );
      },
    },
    {
      id: "solving-cosh-and-tanh-equations",
      title: t("Solving cosh x = c and tanh x = c", "解 cosh x = c 与 tanh x = c"),
      explanation: t(
        "$\\cosh x = c$ has two solutions $x = \\pm \\ln k$ when $c > 1$, since $\\cosh$ is even: from $\\frac{u + 1/u}{2} = \\frac{5}{4}$, $2u^{2} - 5u + 2 = 0$, so $u = 2$ or $u = \\frac{1}{2}$, and the positive solution is $\\ln 2$.\n\nFor $\\tanh x = c$ with $-1 < c < 1$, cross-multiply: $\\frac{u^{2} - 1}{u^{2} + 1} = c$ gives $u^{2} = \\frac{1 + c}{1 - c}$. With $c = \\frac{3}{5}$, $u^{2} = 4$, $u = 2$, $x = \\ln 2$.\n\nCheck: $\\cosh(\\ln 2) = \\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$ and $\\tanh(\\ln 2) = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}$.\n\n> **Watch out.** For $\\tanh$, the equation gives $e^{2x}$, not $e^{x}$: from $e^{2x} = 4$, $x = \\frac{1}{2}\\ln 4 = \\ln 2$. For $\\cosh$, both $\\ln k$ and $-\\ln k$ are solutions.",
        "当 $c > 1$ 时，由于 $\\cosh$ 是偶函数，$\\cosh x = c$ 有两个解 $x = \\pm \\ln k$：由 $\\frac{u + 1/u}{2} = \\frac{5}{4}$ 得 $2u^{2} - 5u + 2 = 0$，所以 $u = 2$ 或 $u = \\frac{1}{2}$，正解为 $\\ln 2$。\n\n对于 $-1 < c < 1$ 的 $\\tanh x = c$，交叉相乘：$\\frac{u^{2} - 1}{u^{2} + 1} = c$ 得 $u^{2} = \\frac{1 + c}{1 - c}$。当 $c = \\frac{3}{5}$ 时，$u^{2} = 4$，$u = 2$，$x = \\ln 2$。\n\n检验：$\\cosh(\\ln 2) = \\frac{2 + \\frac{1}{2}}{2} = \\frac{5}{4}$，$\\tanh(\\ln 2) = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}$。\n\n> **注意。** 对 $\\tanh$，方程给出的是 $e^{2x}$，不是 $e^{x}$：由 $e^{2x} = 4$ 得 $x = \\frac{1}{2}\\ln 4 = \\ln 2$。对 $\\cosh$，$\\ln k$ 和 $-\\ln k$ 都是解。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const isCosh = rng.bool();
        const a = rng.int(1, 3);
        const kq = Q.of(k);
        const v = isCosh ? coshLn(kq) : tanhLn(kq);
        const rhs = v.mul(Q.of(a));
        const name = isCosh ? "\\cosh" : "\\tanh";
        const lhs = `${a === 1 ? "" : a}${name} x`;
        const divide =
          a === 1 ? t("", "") : t(`Dividing by $${a}$ gives $${name} x = ${L(v)}$. `, `两边除以 $${a}$，得 $${name} x = ${L(v)}$。`);
        const back = a === 1 ? "" : `, and $${a} \\cdot ${L(v)} = ${L(rhs)}$`;
        const backZh = a === 1 ? "" : `，而 $${a} \\cdot ${L(v)} = ${L(rhs)}$`;
        return functionWith(
          {
            prompt: t(
              `Find the ${isCosh ? "positive " : ""}solution of $${lhs} = ${L(rhs)}$. Give the exact value of $x$.`,
              `求方程 $${lhs} = ${L(rhs)}$ 的${isCosh ? "正" : ""}解，写出 $x$ 的精确值。`,
            ),
            answer: `\\ln ${k}`,
            prefix: "x =",
            solution: isCosh
              ? walked(
                  [
                    [
                      ["Write it with $u = e^{x}$", "用 $u = e^{x}$ 表示"],
                      t(`${divide.en}With $u = e^{x}$:`, `${divide["zh-CN"]}令 $u = e^{x}$：`),
                      [`\\frac{u + \\frac{1}{u}}{2} = ${L(v)}`],
                    ],
                    [
                      ["Clear the fractions", "去分母"],
                      t(
                        `Multiplying by $2u$ gives a quadratic with roots $u = ${k}$ and $u = \\frac{1}{${k}}$:`,
                        `两边乘以 $2u$，得到二次方程，它的根是 $u = ${k}$ 和 $u = \\frac{1}{${k}}$：`,
                      ),
                      [`${poly([1, "u^2"], [v.mul(Q.of(-2)), "u"], [1, ""])} = 0`],
                    ],
                    [
                      ["Pick the positive solution", "取正解"],
                      t(
                        `$e^{x} = ${k}$ gives $x = \\ln ${k}$ and $e^{x} = \\frac{1}{${k}}$ gives $x = -\\ln ${k}$. The positive solution is $x = \\ln ${k}$.`,
                        `$e^{x} = ${k}$ 给出 $x = \\ln ${k}$，$e^{x} = \\frac{1}{${k}}$ 给出 $x = -\\ln ${k}$。正解是 $x = \\ln ${k}$。`,
                      ),
                    ],
                  ],
                  t(
                    `$\\cosh(\\ln ${k}) = \\frac{${k} + \\frac{1}{${k}}}{2} = ${L(v)}$${back}.`,
                    `$\\cosh(\\ln ${k}) = \\frac{${k} + \\frac{1}{${k}}}{2} = ${L(v)}$${backZh}。`,
                  ),
                )
              : walked(
                  [
                    [
                      ["Write it with $e^{2x}$", "用 $e^{2x}$ 表示"],
                      t(
                        `${divide.en}Multiplying the top and bottom of $\\tanh x$ by $e^{x}$:`,
                        `${divide["zh-CN"]}把 $\\tanh x$ 的分子分母同乘 $e^{x}$：`,
                      ),
                      [`\\frac{e^{2x} - 1}{e^{2x} + 1} = ${L(v)}`],
                    ],
                    [
                      ["Solve for $e^{2x}$", "解出 $e^{2x}$"],
                      t("Cross-multiplying:", "交叉相乘："),
                      [`e^{2x} = \\frac{1 + ${L(v)}}{1 - ${L(v)}} = ${k * k}`],
                    ],
                    [
                      ["Take logarithms", "取对数"],
                      t(
                        `$2x = \\ln ${k * k}$, so $x = \\frac{1}{2}\\ln ${k * k} = \\ln ${k}$.`,
                        `$2x = \\ln ${k * k}$，所以 $x = \\frac{1}{2}\\ln ${k * k} = \\ln ${k}$。`,
                      ),
                    ],
                  ],
                  t(
                    `$\\tanh(\\ln ${k}) = \\frac{${k * k} - 1}{${k * k} + 1} = ${L(v)}$${back}.`,
                    `$\\tanh(\\ln ${k}) = \\frac{${k * k} - 1}{${k * k} + 1} = ${L(v)}$${backZh}。`,
                  ),
                ),
          },
          isCosh
            ? [
                say(`-\\ln ${k}`, "This is the negative solution; the question asks for the positive one.", "这是负解；题目要求的是正解。"),
                say(
                  `\\ln ${k * k}`,
                  `This takes $e^{x} = ${k * k}$, but the roots of the quadratic are $${k}$ and $\\frac{1}{${k}}$.`,
                  `这取了 $e^{x} = ${k * k}$，但二次方程的根是 $${k}$ 和 $\\frac{1}{${k}}$。`,
                ),
                say(
                  `\\ln ${L(v.mul(Q.of(2)))}`,
                  "This drops the $e^{-x}$ term: $e^{x} = 2\\cosh x$ would hold only without it.",
                  "这丢掉了 $e^{-x}$ 项：只有没有这一项时才有 $e^{x} = 2\\cosh x$。",
                ),
              ]
            : [
                say(
                  `-\\ln ${k}`,
                  `This has the wrong sign: $\\tanh x = ${L(v)}$ is positive, so $x$ is positive.`,
                  `符号错了：$\\tanh x = ${L(v)}$ 为正，所以 $x$ 为正。`,
                ),
                say(
                  `\\ln ${k * k}`,
                  `This is $2x$: $e^{2x} = ${k * k}$, so $x$ is half of $\\ln ${k * k}$.`,
                  `这是 $2x$：$e^{2x} = ${k * k}$，所以 $x$ 是 $\\ln ${k * k}$ 的一半。`,
                ),
                say(
                  `\\frac{1}{2}\\ln ${k}`,
                  `This halves twice: $x = \\frac{1}{2}\\ln ${k * k} = \\ln ${k}$.`,
                  `这减半了两次：$x = \\frac{1}{2}\\ln ${k * k} = \\ln ${k}$。`,
                ),
              ],
        );
      },
    },
  ],
};

/** graphsOfTheHyperbolicFunctions recognizes and describes the graphs of sinh, cosh and tanh. */
export const graphsOfTheHyperbolicFunctions: TopicDef = {
  id: "graphs-of-the-hyperbolic-functions",
  title: t("Graphs of the Hyperbolic Functions", "双曲函数的图像"),
  summary: t(
    "Recognize the graphs of sinh, cosh and tanh and their transformations, and read off their extreme values and asymptotes.",
    "识别 sinh、cosh、tanh 及其变换的图像，读出最值和渐近线。",
  ),
  intro: t(
    "Since $e^{x}$ and $e^{-x}$ are positive and their product is $1$, their average is at least $1$: $\\cosh x \\ge 1$, with $\\cosh 0 = 1$. So $y = \\cosh x$ has its lowest point at $(0, 1)$. The graph of $\\sinh x$ passes through the origin, and $\\tanh x$ levels off at $-1$ and $1$.\n\nCheck: $\\cosh 1 = \\frac{e + e^{-1}}{2} \\approx 1.5431$, above $1$, and $\\tanh 3 \\approx 0.9951$, just below $1$.\n\nIn this lesson we recognize the graphs of $\\sinh$, $\\cosh$ and $\\tanh$ and their transformations, and read off extreme values and asymptotes.",
    "因为 $e^{x}$ 与 $e^{-x}$ 都为正且乘积为 $1$，它们的平均值至少是 $1$：$\\cosh x \\ge 1$，且 $\\cosh 0 = 1$。所以 $y = \\cosh x$ 的最低点是 $(0, 1)$。$\\sinh x$ 的图像经过原点，$\\tanh x$ 在 $-1$ 和 $1$ 处趋平。\n\n检验：$\\cosh 1 = \\frac{e + e^{-1}}{2} \\approx 1.5431$，大于 $1$；$\\tanh 3 \\approx 0.9951$，略小于 $1$。\n\n本课我们识别 $\\sinh$、$\\cosh$、$\\tanh$ 及其变换的图像，并读出最值和渐近线。",
  ),
  prerequisites: ["the-hyperbolic-functions"],
  encompasses: [],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-hyperbolic-graphs",
      figure: calculusDrawings1["graphs-of-the-hyperbolic-functions#recognizing-hyperbolic-graphs"],
      title: t("Recognizing the graphs", "识别图像"),
      explanation: t(
        "- $y = \\sinh x$ is odd and increasing, passes through the origin and grows without bound in both directions.\n- $y = \\cosh x$ is even, U-shaped (a *catenary*), with minimum $1$ at $x = 0$.\n- $y = \\tanh x$ is odd and increasing, with horizontal asymptotes $y = -1$ and $y = 1$.\n\n$y = -f(x) + k$ reflects the graph in the $x$-axis and shifts it $k$ up. For example, $y = -\\cosh x + 2$ is the catenary turned upside down and moved up $2$, so it has a maximum of $-1 + 2 = 1$ at $x = 0$.\n\nCheck: at $x = 1$, $y = -1.5431 + 2 \\approx 0.4569$, below the maximum.\n\n> **Watch out.** $\\sinh$ and $\\tanh$ both rise through the origin. Tell them apart far out: $\\sinh$ keeps growing, while $\\tanh$ levels off at two horizontal asymptotes.",
        "- $y = \\sinh x$ 是单调递增的奇函数，过原点，向两侧无界。\n- $y = \\cosh x$ 是偶函数，呈 U 形（**悬链线**），在 $x = 0$ 处取最小值 $1$。\n- $y = \\tanh x$ 是单调递增的奇函数，水平渐近线为 $y = -1$ 和 $y = 1$。\n\n$y = -f(x) + k$ 把图像关于 $x$ 轴反射，再向上平移 $k$。例如 $y = -\\cosh x + 2$ 是把悬链线上下翻转后向上平移 $2$，所以在 $x = 0$ 处取最大值 $-1 + 2 = 1$。\n\n检验：在 $x = 1$ 处，$y = -1.5431 + 2 \\approx 0.4569$，小于最大值。\n\n> **注意。** $\\sinh$ 和 $\\tanh$ 都递增地穿过原点。要看远处来区分：$\\sinh$ 一直增长，而 $\\tanh$ 趋向两条水平渐近线。",
      ),
      generate(rng) {
        return graphChoice(rng, basicGraphs);
      },
    },
    {
      id: "extremes-and-asymptotes-of-hyperbolic-graphs",
      figure: calculusDrawings1["graphs-of-the-hyperbolic-functions#extremes-and-asymptotes-of-hyperbolic-graphs"],
      title: t("Extreme values and asymptotes", "最值与渐近线"),
      explanation: t(
        "For $y = a\\cosh(x - h) + k$, the vertex is at $(h, a + k)$: a minimum when $a > 0$, a maximum when $a < 0$.\n\nFor $y = a\\tanh(x - h) + k$, the horizontal asymptotes are $y = k - |a|$ and $y = k + |a|$.\n\nSo $y = 3\\tanh(x + 1) - 2$ has asymptotes $y = -5$ and $y = 1$.\n\nCheck: at $x = 1$, $y = 3\\tanh 2 - 2 \\approx 0.8921$, and at $x = 3$, $y = 3\\tanh 4 - 2 \\approx 0.9980$, closing in on $1$.\n\n> **Watch out.** The asymptotes are $|a|$ above and below $k$, whatever the sign of $a$. For $\\cosh$, the extreme value is $a + k$, not $k$, because $\\cosh$ is $1$ at its vertex, not $0$.",
        "对于 $y = a\\cosh(x - h) + k$，顶点为 $(h, a + k)$：$a > 0$ 时为最小值，$a < 0$ 时为最大值。\n\n对于 $y = a\\tanh(x - h) + k$，水平渐近线为 $y = k - |a|$ 和 $y = k + |a|$。\n\n所以 $y = 3\\tanh(x + 1) - 2$ 的渐近线为 $y = -5$ 和 $y = 1$。\n\n检验：在 $x = 1$ 处，$y = 3\\tanh 2 - 2 \\approx 0.8921$；在 $x = 3$ 处，$y = 3\\tanh 4 - 2 \\approx 0.9980$，越来越接近 $1$。\n\n> **注意。** 渐近线在 $k$ 的上下各相距 $|a|$，与 $a$ 的符号无关。对 $\\cosh$，最值是 $a + k$ 而不是 $k$，因为 $\\cosh$ 在顶点处等于 $1$，不是 $0$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 2, 3, 4, 5]);
        const h = rng.int(-4, 4);
        const k = rng.int(-6, 6);
        const inner = innerOf(h);
        const aL = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        if (rng.bool()) {
          const kind = a > 0 ? t("minimum", "最小值") : t("maximum", "最大值");
          const near = a * Math.cosh(1) + k;
          return numberProblem({
            prompt: t(
              `Find the ${kind.en} value of $y = ${aL}\\cosh ${inner}${shift(k)}$.`,
              `求 $y = ${aL}\\cosh ${inner}${shift(k)}$ 的${kind["zh-CN"]}。`,
            ),
            answer: a + k,
            mistakes: firsts([
              why(k, "This takes $\\cosh$ as $0$ at the vertex; it is $1$ there.", "这把顶点处的 $\\cosh$ 当成了 $0$；它在那里等于 $1$。"),
              why(a, `This leaves out the shift $${k}$.`, `这漏掉了平移量 $${k}$。`),
              why(
                k - a,
                "This takes $\\cosh$ as $-1$ at the vertex; its smallest value is $1$.",
                "这把顶点处的 $\\cosh$ 当成了 $-1$；它的最小值是 $1$。",
              ),
              why(
                h,
                `This is where the ${kind.en} occurs, the $x$-coordinate $${h}$, not the value.`,
                `这是取得${kind["zh-CN"]}的位置，即横坐标 $${h}$，不是最值本身。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the smallest value of $\\cosh$", "找出 $\\cosh$ 的最小值"],
                  t(`$\\cosh ${inner} \\ge 1$, with equality at $x = ${h}$.`, `$\\cosh ${inner} \\ge 1$，在 $x = ${h}$ 处取等号。`),
                ],
                [
                  ["Scale and shift it", "伸缩并平移"],
                  t(
                    `Since $a = ${a}$ is ${a > 0 ? "positive" : "negative"}, $y$ has a ${kind.en} there: $${a} \\cdot 1${shift(k)} = ${a + k}$.`,
                    `由于 $a = ${a}$ ${a > 0 ? "为正" : "为负"}，$y$ 在那里取得${kind["zh-CN"]}：$${a} \\cdot 1${shift(k)} = ${a + k}$。`,
                  ),
                ],
              ],
              t(
                `At $x = ${h - 1}$ and $x = ${h + 1}$, $y = ${a}\\cosh 1${shift(k)} \\approx ${fmt(near)}$, which is ${a > 0 ? "above" : "below"} $${a + k}$.`,
                `在 $x = ${h - 1}$ 和 $x = ${h + 1}$ 处，$y = ${a}\\cosh 1${shift(k)} \\approx ${fmt(near)}$，${a > 0 ? "大于" : "小于"} $${a + k}$。`,
              ),
            ),
          });
        }
        const upper = rng.bool();
        const answer = upper ? k + Math.abs(a) : k - Math.abs(a);
        const which = upper ? t("upper", "上方的") : t("lower", "下方的");
        const right = a * Math.tanh(5) + k;
        const left = a * Math.tanh(-5) + k;
        return numberProblem({
          prompt: t(
            `The graph of $y = ${aL}\\tanh ${inner}${shift(k)}$ has two horizontal asymptotes. The ${which.en} one is $y = c$. Find $c$.`,
            `$y = ${aL}\\tanh ${inner}${shift(k)}$ 的图像有两条水平渐近线，${which["zh-CN"]}一条是 $y = c$。求 $c$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              upper ? k - Math.abs(a) : k + Math.abs(a),
              `This is the ${upper ? "lower" : "upper"} asymptote.`,
              `这是${upper ? "下方" : "上方"}的渐近线。`,
            ),
            why(
              k,
              `This is the centre line $y = ${k}$, which the graph crosses at $x = ${h}$.`,
              `这是中心线 $y = ${k}$，图像在 $x = ${h}$ 处穿过它。`,
            ),
            why(upper ? Math.abs(a) : -Math.abs(a), `This leaves out the shift $${k}$.`, `这漏掉了平移量 $${k}$。`),
            why(
              k + (upper ? 1 : -1),
              `This leaves out the stretch: $\\tanh$ is multiplied by $${a}$.`,
              `这漏掉了伸缩：$\\tanh$ 乘了 $${a}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the range of $\\tanh$", "利用 $\\tanh$ 的值域"],
                t("$\\tanh$ approaches $-1$ and $1$ far out, never reaching them.", "$\\tanh$ 在远处趋近 $-1$ 和 $1$，但取不到。"),
              ],
              [
                ["Scale and shift", "伸缩并平移"],
                t(
                  `So $y$ approaches $${k} \\pm ${Math.abs(a)}$, that is $y = ${k - Math.abs(a)}$ and $y = ${k + Math.abs(a)}$. The ${which.en} asymptote is $y = ${answer}$.`,
                  `所以 $y$ 趋近 $${k} \\pm ${Math.abs(a)}$，即 $y = ${k - Math.abs(a)}$ 和 $y = ${k + Math.abs(a)}$。${which["zh-CN"]}渐近线是 $y = ${answer}$。`,
                ),
              ],
            ],
            t(
              `At $x = ${h + 5}$, $y \\approx ${fmt(right)}$, and at $x = ${h - 5}$, $y \\approx ${fmt(left)}$: the values level off at $${k - Math.abs(a)}$ and $${k + Math.abs(a)}$.`,
              `在 $x = ${h + 5}$ 处 $y \\approx ${fmt(right)}$，在 $x = ${h - 5}$ 处 $y \\approx ${fmt(left)}$：函数值趋于 $${k - Math.abs(a)}$ 和 $${k + Math.abs(a)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** graphsOfTheReciprocalHyperbolicFunctions recognizes and describes the graphs of sech, csch and coth. */
export const graphsOfTheReciprocalHyperbolicFunctions: TopicDef = {
  id: "graphs-of-the-reciprocal-hyperbolic-functions",
  title: t("Graphs of the Reciprocal Hyperbolic Functions", "倒数双曲函数的图像"),
  summary: t(
    "Recognize the graphs of sech, csch and coth and their transformations, and find their asymptotes.",
    "识别 sech、csch、coth 及其变换的图像，求出渐近线。",
  ),
  intro: t(
    "Since $\\cosh x \\ge 1$, its reciprocal $\\operatorname{sech} x$ lies between $0$ and $1$. It equals $1$ at $x = 0$ and shrinks toward $0$ far out, so its graph is a bell with the asymptote $y = 0$.\n\nCheck: $\\cosh 2 \\approx 3.7622$, so $\\operatorname{sech} 2 \\approx \\frac{1}{3.7622} \\approx 0.2658$.\n\nIn this lesson we recognize the graphs of $\\operatorname{sech}$, $\\operatorname{csch}$ and $\\coth$ and find the asymptotes and extreme values of their transformations.",
    "因为 $\\cosh x \\ge 1$，它的倒数 $\\operatorname{sech} x$ 介于 $0$ 与 $1$ 之间。它在 $x = 0$ 处等于 $1$，在远处趋于 $0$，所以图像是一个钟形，渐近线为 $y = 0$。\n\n检验：$\\cosh 2 \\approx 3.7622$，所以 $\\operatorname{sech} 2 \\approx \\frac{1}{3.7622} \\approx 0.2658$。\n\n本课我们识别 $\\operatorname{sech}$、$\\operatorname{csch}$、$\\coth$ 的图像，并求出它们变换后的渐近线和最值。",
  ),
  prerequisites: ["graphs-of-the-hyperbolic-functions", "the-reciprocal-hyperbolic-functions"],
  encompasses: [],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-reciprocal-hyperbolic-graphs",
      figure: calculusDrawings1["graphs-of-the-reciprocal-hyperbolic-functions#recognizing-reciprocal-hyperbolic-graphs"],
      title: t("Recognizing the graphs", "识别图像"),
      explanation: t(
        "- $y = \\operatorname{sech} x$ is an even bell shape with maximum $1$ at $x = 0$ and asymptote $y = 0$.\n- $y = \\operatorname{csch} x$ is odd, with a vertical asymptote $x = 0$ and horizontal asymptote $y = 0$.\n- $y = \\coth x$ is odd, with vertical asymptote $x = 0$ and horizontal asymptotes $y = \\pm 1$; its values satisfy $|y| > 1$.\n\nFor example, $y = \\coth x + 1$ has the vertical asymptote $x = 0$ and the horizontal asymptotes $y = 0$ and $y = 2$.\n\nCheck: at $x = 3$, $\\coth 3 \\approx 1.0050$, so $y \\approx 2.0050$, just above $2$.\n\n> **Watch out.** $\\operatorname{csch}$ and $\\coth$ both break at $x = 0$. $\\operatorname{csch}$ approaches a single horizontal line on both sides, while $\\coth$ approaches two different ones.",
        "- $y = \\operatorname{sech} x$ 是偶函数，呈钟形，在 $x = 0$ 处取最大值 $1$，渐近线为 $y = 0$。\n- $y = \\operatorname{csch} x$ 是奇函数，竖直渐近线为 $x = 0$，水平渐近线为 $y = 0$。\n- $y = \\coth x$ 是奇函数，竖直渐近线为 $x = 0$，水平渐近线为 $y = \\pm 1$；其值满足 $|y| > 1$。\n\n例如 $y = \\coth x + 1$ 的竖直渐近线是 $x = 0$，水平渐近线是 $y = 0$ 和 $y = 2$。\n\n检验：在 $x = 3$ 处 $\\coth 3 \\approx 1.0050$，所以 $y \\approx 2.0050$，略大于 $2$。\n\n> **注意。** $\\operatorname{csch}$ 和 $\\coth$ 都在 $x = 0$ 处断开。$\\operatorname{csch}$ 两侧趋近同一条水平线，而 $\\coth$ 趋近两条不同的水平线。",
      ),
      generate(rng) {
        return graphChoice(rng, reciprocalGraphs);
      },
    },
    {
      id: "asymptotes-of-reciprocal-hyperbolic-graphs",
      figure: calculusDrawings1["graphs-of-the-reciprocal-hyperbolic-functions#asymptotes-of-reciprocal-hyperbolic-graphs"],
      title: t("Asymptotes of the graphs", "图像的渐近线"),
      explanation: t(
        "Transformations move the asymptotes: $y = a\\coth(x - h) + k$ has vertical asymptote $x = h$ and horizontal asymptotes $y = k \\pm a$; $y = a\\operatorname{csch}(x - h) + k$ has $x = h$ and $y = k$; $y = a\\operatorname{sech}(x - h) + k$ has only $y = k$, and its extreme value $a + k$ at $x = h$.\n\nFor example, $y = 2\\coth(x - 1) + 3$ has the vertical asymptote $x = 1$ and the horizontal asymptotes $y = 1$ and $y = 5$.\n\nCheck: at $x = 4$, $2\\coth 3 + 3 \\approx 5.0099$, and at $x = -2$, $2\\coth(-3) + 3 \\approx 0.9901$.\n\n> **Watch out.** The shift $h$ moves the vertical asymptote to $x = h$, not $x = -h$, and the shift $k$ moves the horizontal ones. For $\\coth$, the horizontal asymptotes are $y = k \\pm |a|$.",
        "变换会移动渐近线：$y = a\\coth(x - h) + k$ 的竖直渐近线为 $x = h$，水平渐近线为 $y = k \\pm a$；$y = a\\operatorname{csch}(x - h) + k$ 的渐近线为 $x = h$ 和 $y = k$；$y = a\\operatorname{sech}(x - h) + k$ 只有 $y = k$，并在 $x = h$ 处取极值 $a + k$。\n\n例如 $y = 2\\coth(x - 1) + 3$ 的竖直渐近线是 $x = 1$，水平渐近线是 $y = 1$ 和 $y = 5$。\n\n检验：在 $x = 4$ 处 $2\\coth 3 + 3 \\approx 5.0099$，在 $x = -2$ 处 $2\\coth(-3) + 3 \\approx 0.9901$。\n\n> **注意。** 平移量 $h$ 把竖直渐近线移到 $x = h$，不是 $x = -h$；平移量 $k$ 移动的是水平渐近线。对 $\\coth$，水平渐近线是 $y = k \\pm |a|$。",
      ),
      generate(rng) {
        const a = rng.pick([-3, -2, 2, 3, 4]);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const inner = innerOf(h);
        const which = rng.int(0, 3);
        const fns: Record<string, (x: number) => number> = {
          "\\coth": (x) => 1 / Math.tanh(x),
          "\\operatorname{csch}": (x) => 1 / Math.sinh(x),
          "\\operatorname{sech}": (x) => 1 / Math.cosh(x),
        };
        if (which === 0) {
          const fn = rng.pick(["\\coth", "\\operatorname{csch}"]);
          const near = a * fns[fn]!(0.01) + k;
          return numberProblem({
            prompt: t(
              `The graph of $y = ${a}${fn}${inner}${shift(k)}$ has a vertical asymptote $x = c$. Find $c$.`,
              `$y = ${a}${fn}${inner}${shift(k)}$ 的图像有竖直渐近线 $x = c$。求 $c$。`,
            ),
            answer: h,
            mistakes: firsts([
              why(
                -h,
                `This has the wrong sign: $x ${h > 0 ? "-" : "+"} ${Math.abs(h)} = 0$ at $x = ${h}$.`,
                `符号错了：$x ${h > 0 ? "-" : "+"} ${Math.abs(h)} = 0$ 时 $x = ${h}$。`,
              ),
              why(
                k,
                `This is the vertical shift $k = ${k}$, which moves the graph up or down, not sideways.`,
                `这是竖直平移量 $k = ${k}$，它使图像上下移动，而不是左右移动。`,
              ),
              why(a, `This is the stretch $a = ${a}$, which does not move the asymptote.`, `这是伸缩系数 $a = ${a}$，它不移动渐近线。`),
            ]),
            solution: walked(
              [
                [
                  ["Find where it is not defined", "找出无定义的地方"],
                  t(`$${fn} u$ is not defined at $u = 0$.`, `$${fn} u$ 在 $u = 0$ 处无定义。`),
                ],
                [
                  ["Solve for $x$", "解出 $x$"],
                  t(
                    `$x ${h > 0 ? "-" : "+"} ${Math.abs(h)} = 0$ gives $x = ${h}$.`,
                    `由 $x ${h > 0 ? "-" : "+"} ${Math.abs(h)} = 0$ 得 $x = ${h}$。`,
                  ),
                ],
              ],
              t(
                `Just to the right, at $x = ${h + 0.01}$, $y \\approx ${fmt(near)}$: the values blow up as $x$ approaches $${h}$.`,
                `在右侧附近 $x = ${h + 0.01}$ 处，$y \\approx ${fmt(near)}$：当 $x$ 趋近 $${h}$ 时函数值趋于无穷。`,
              ),
            ),
          });
        }
        if (which === 1) {
          const fn = rng.pick(["\\operatorname{sech}", "\\operatorname{csch}"]);
          const far = a * fns[fn]!(5) + k;
          return numberProblem({
            prompt: t(
              `The graph of $y = ${a}${fn}${inner}${shift(k)}$ has a horizontal asymptote $y = c$. Find $c$.`,
              `$y = ${a}${fn}${inner}${shift(k)}$ 的图像有水平渐近线 $y = c$。求 $c$。`,
            ),
            answer: k,
            mistakes: firsts([
              why(
                a + k,
                `This takes $${fn} u$ to approach $1$, as $\\tanh$ does; $${fn} u$ approaches $0$.`,
                `这把 $${fn} u$ 的极限当成了 $1$，像 $\\tanh$ 那样；其实 $${fn} u$ 趋于 $0$。`,
              ),
              why(
                h,
                `This is the horizontal shift $h = ${h}$, which moves the graph sideways.`,
                `这是水平平移量 $h = ${h}$，它使图像左右移动。`,
              ),
              why(-k, `This has the wrong sign: the graph is shifted by $${k}$.`, `符号错了：图像平移了 $${k}$。`),
            ]),
            solution: walked(
              [
                [
                  ["Find the limit far out", "求远处的极限"],
                  t(`$${fn} u \\to 0$ as $u \\to \\pm\\infty$.`, `当 $u \\to \\pm\\infty$ 时，$${fn} u \\to 0$。`),
                ],
                [
                  ["Scale and shift", "伸缩并平移"],
                  t(`So $y \\to ${a} \\cdot 0${shift(k)} = ${k}$.`, `所以 $y \\to ${a} \\cdot 0${shift(k)} = ${k}$。`),
                ],
              ],
              t(
                `At $x = ${h + 5}$, $y \\approx ${fmt(far)}$, already close to $${k}$.`,
                `在 $x = ${h + 5}$ 处，$y \\approx ${fmt(far)}$，已经接近 $${k}$。`,
              ),
            ),
          });
        }
        if (which === 2) {
          const kind = a > 0 ? t("maximum", "最大值") : t("minimum", "最小值");
          const near = a / Math.cosh(1) + k;
          return numberProblem({
            prompt: t(
              `Find the ${kind.en} value of $y = ${a}\\operatorname{sech}${inner}${shift(k)}$.`,
              `求 $y = ${a}\\operatorname{sech}${inner}${shift(k)}$ 的${kind["zh-CN"]}。`,
            ),
            answer: a + k,
            mistakes: firsts([
              why(
                k,
                `This is the asymptote $y = ${k}$; $\\operatorname{sech}$ is $1$ at its peak, not $0$.`,
                `这是渐近线 $y = ${k}$；$\\operatorname{sech}$ 在峰顶等于 $1$，不是 $0$。`,
              ),
              why(a, `This leaves out the shift $${k}$.`, `这漏掉了平移量 $${k}$。`),
              why(
                k - a,
                "This takes the peak of $\\operatorname{sech}$ as $-1$; it is $1$.",
                "这把 $\\operatorname{sech}$ 的峰值当成了 $-1$；它是 $1$。",
              ),
            ]),
            solution: walked(
              [
                [
                  ["Find the peak of $\\operatorname{sech}$", "找出 $\\operatorname{sech}$ 的峰值"],
                  t(
                    `$0 < \\operatorname{sech} u \\le 1$, with $\\operatorname{sech} 0 = 1$, reached at $x = ${h}$.`,
                    `$0 < \\operatorname{sech} u \\le 1$，且 $\\operatorname{sech} 0 = 1$，在 $x = ${h}$ 处取到。`,
                  ),
                ],
                [
                  ["Scale and shift", "伸缩并平移"],
                  t(
                    `Since $a = ${a}$ is ${a > 0 ? "positive" : "negative"}, the ${kind.en} is $${a} \\cdot 1${shift(k)} = ${a + k}$.`,
                    `由于 $a = ${a}$ ${a > 0 ? "为正" : "为负"}，${kind["zh-CN"]}为 $${a} \\cdot 1${shift(k)} = ${a + k}$。`,
                  ),
                ],
              ],
              t(
                `At $x = ${h - 1}$ and $x = ${h + 1}$, $y = ${a}\\operatorname{sech} 1${shift(k)} \\approx ${fmt(near)}$, which is ${a > 0 ? "below" : "above"} $${a + k}$.`,
                `在 $x = ${h - 1}$ 和 $x = ${h + 1}$ 处，$y = ${a}\\operatorname{sech} 1${shift(k)} \\approx ${fmt(near)}$，${a > 0 ? "小于" : "大于"} $${a + k}$。`,
              ),
            ),
          });
        }
        const upper = rng.bool();
        const answer = upper ? k + Math.abs(a) : k - Math.abs(a);
        const word = upper ? t("upper", "上方的") : t("lower", "下方的");
        const right = a / Math.tanh(3) + k;
        const left = a / Math.tanh(-3) + k;
        return numberProblem({
          prompt: t(
            `The graph of $y = ${a}\\coth${inner}${shift(k)}$ has two horizontal asymptotes. The ${word.en} one is $y = c$. Find $c$.`,
            `$y = ${a}\\coth${inner}${shift(k)}$ 的图像有两条水平渐近线，${word["zh-CN"]}一条是 $y = c$。求 $c$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              upper ? k - Math.abs(a) : k + Math.abs(a),
              `This is the ${upper ? "lower" : "upper"} asymptote.`,
              `这是${upper ? "下方" : "上方"}的渐近线。`,
            ),
            why(
              k,
              `This is the centre line $y = ${k}$, midway between the two asymptotes.`,
              `这是中心线 $y = ${k}$，位于两条渐近线的正中间。`,
            ),
            why(h, `This is $h = ${h}$, which gives the vertical asymptote $x = ${h}$.`, `这是 $h = ${h}$，它给出竖直渐近线 $x = ${h}$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the limits far out", "求远处的极限"],
                t("$\\coth u \\to \\pm 1$ as $u \\to \\pm\\infty$.", "当 $u \\to \\pm\\infty$ 时，$\\coth u \\to \\pm 1$。"),
              ],
              [
                ["Scale and shift", "伸缩并平移"],
                t(
                  `So the horizontal asymptotes are $y = ${k} \\pm ${Math.abs(a)}$: $y = ${k - Math.abs(a)}$ and $y = ${k + Math.abs(a)}$. The ${word.en} one is $y = ${answer}$.`,
                  `所以水平渐近线为 $y = ${k} \\pm ${Math.abs(a)}$：$y = ${k - Math.abs(a)}$ 和 $y = ${k + Math.abs(a)}$。${word["zh-CN"]}一条是 $y = ${answer}$。`,
                ),
              ],
            ],
            t(
              `At $x = ${h + 3}$, $y \\approx ${fmt(right)}$, and at $x = ${h - 3}$, $y \\approx ${fmt(left)}$: the values level off at $${k - Math.abs(a)}$ and $${k + Math.abs(a)}$.`,
              `在 $x = ${h + 3}$ 处 $y \\approx ${fmt(right)}$，在 $x = ${h - 3}$ 处 $y \\approx ${fmt(left)}$：函数值趋于 $${k - Math.abs(a)}$ 和 $${k + Math.abs(a)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theInverseHyperbolicFunctions evaluates arsinh, arcosh and artanh with their logarithmic forms. */
export const theInverseHyperbolicFunctions: TopicDef = {
  id: "the-inverse-hyperbolic-functions",
  title: t("The Inverse Hyperbolic Functions", "反双曲函数"),
  summary: t(
    "Evaluate the inverse hyperbolic sine, cosine and tangent, using their logarithmic forms.",
    "利用对数形式计算反双曲正弦、反双曲余弦和反双曲正切。",
  ),
  intro: t(
    "Since $\\sinh(\\ln 2) = \\frac{3}{4}$, the input that gives the output $\\frac{3}{4}$ is $\\ln 2$: $\\operatorname{arsinh} \\frac{3}{4} = \\ln 2$. Solving $\\sinh x = c$ for $x$ in general gives the formula $\\operatorname{arsinh} c = \\ln\\left(c + \\sqrt{c^{2} + 1}\\right)$.\n\nCheck: $\\ln\\left(\\frac{3}{4} + \\sqrt{\\frac{9}{16} + 1}\\right) = \\ln\\left(\\frac{3}{4} + \\frac{5}{4}\\right) = \\ln 2$.\n\nIn this lesson we evaluate $\\operatorname{arsinh}$, $\\operatorname{arcosh}$ and $\\operatorname{artanh}$ and write them with logarithms.",
    "因为 $\\sinh(\\ln 2) = \\frac{3}{4}$，给出输出 $\\frac{3}{4}$ 的输入是 $\\ln 2$：$\\operatorname{arsinh} \\frac{3}{4} = \\ln 2$。一般地由 $\\sinh x = c$ 解出 $x$，得公式 $\\operatorname{arsinh} c = \\ln\\left(c + \\sqrt{c^{2} + 1}\\right)$。\n\n检验：$\\ln\\left(\\frac{3}{4} + \\sqrt{\\frac{9}{16} + 1}\\right) = \\ln\\left(\\frac{3}{4} + \\frac{5}{4}\\right) = \\ln 2$。\n\n本课我们计算 $\\operatorname{arsinh}$、$\\operatorname{arcosh}$ 和 $\\operatorname{artanh}$，并用对数表示它们。",
  ),
  prerequisites: ["solving-equations-containing-hyperbolic-functions"],
  encompasses: [{ topic: "solving-equations-containing-hyperbolic-functions", weight: 0.3 }],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-inverse-hyperbolic-functions",
      title: t("Evaluating inverse hyperbolic functions", "计算反双曲函数"),
      explanation: t(
        "An inverse hyperbolic function answers the question of which input gives a stated output, so work backwards from the definition of the original function. $\\operatorname{arsinh} c$ is the $x$ with $\\sinh x = c$; $\\operatorname{arcosh} c$ (for $c \\ge 1$) is the $x \\ge 0$ with $\\cosh x = c$; $\\operatorname{artanh} c$ (for $|c| < 1$) is the $x$ with $\\tanh x = c$.\n\nSince $\\cosh(\\ln 2) = \\frac{5}{4}$, $\\operatorname{arcosh} \\frac{5}{4} = \\ln 2$.\n\nCheck: by the logarithmic form, $\\operatorname{arcosh} \\frac{5}{4} = \\ln\\left(\\frac{5}{4} + \\sqrt{\\frac{25}{16} - 1}\\right) = \\ln\\left(\\frac{5}{4} + \\frac{3}{4}\\right) = \\ln 2$.\n\n> **Watch out.** $\\cosh x = \\frac{5}{4}$ also holds at $x = -\\ln 2$, but $\\operatorname{arcosh}$ gives the value that is not negative. $\\operatorname{arsinh}$ and $\\operatorname{artanh}$ are odd, so a negative input gives a negative answer.",
        "反双曲函数回答的是哪个输入会给出指定的输出，所以要从原函数的定义倒推。$\\operatorname{arsinh} c$ 是满足 $\\sinh x = c$ 的 $x$；$\\operatorname{arcosh} c$（$c \\ge 1$）是满足 $\\cosh x = c$ 的 $x \\ge 0$；$\\operatorname{artanh} c$（$|c| < 1$）是满足 $\\tanh x = c$ 的 $x$。\n\n因为 $\\cosh(\\ln 2) = \\frac{5}{4}$，所以 $\\operatorname{arcosh} \\frac{5}{4} = \\ln 2$。\n\n检验：由对数形式，$\\operatorname{arcosh} \\frac{5}{4} = \\ln\\left(\\frac{5}{4} + \\sqrt{\\frac{25}{16} - 1}\\right) = \\ln\\left(\\frac{5}{4} + \\frac{3}{4}\\right) = \\ln 2$。\n\n> **注意。** $x = -\\ln 2$ 也满足 $\\cosh x = \\frac{5}{4}$，但 $\\operatorname{arcosh}$ 取不为负的那个值。$\\operatorname{arsinh}$ 和 $\\operatorname{artanh}$ 是奇函数，所以负的输入给出负的结果。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const which = rng.int(0, 2);
        const s = which === 1 ? 1 : rng.sign();
        const kq = Q.of(k);
        const v = [sinhLn(kq), coshLn(kq), tanhLn(kq)][which]!.mul(Q.of(s));
        const names = ["\\operatorname{arsinh}", "\\operatorname{arcosh}", "\\operatorname{artanh}"];
        const answer = `${s < 0 ? "-" : ""}\\ln ${k}`;
        const R = s > 0 ? kq : Q.one.div(kq);
        const name = names[which]!;
        const vL = `\\left(${L(v)}\\right)`;
        const formula = [
          `${name}${vL} = \\ln\\left(${L(v)} + \\sqrt{${L(v.mul(v))} + 1}\\right)`,
          `${name}${vL} = \\ln\\left(${L(v)} + \\sqrt{${L(v.mul(v))} - 1}\\right)`,
          `${name}${vL} = \\frac{1}{2}\\ln\\frac{1 + ${P(v)}}{1 - ${P(v)}}`,
        ][which]!;
        const simplify =
          which === 2
            ? `\\frac{1 + ${P(v)}}{1 - ${P(v)}} = ${L(R.mul(R))}`
            : `\\sqrt{${L(which === 0 ? v.mul(v).add(Q.one) : v.mul(v).sub(Q.one))}} = ${L(Q.of(which === 0 ? k * k + 1 : k * k - 1, 2 * k))}, \\quad ${L(v)} + ${L(Q.of(which === 0 ? k * k + 1 : k * k - 1, 2 * k))} = ${L(R)}`;
        const conclude = which === 2 ? `\\frac{1}{2}\\ln ${L(R.mul(R))} = \\ln ${L(R)} = ${answer}` : `\\ln ${L(R)} = ${answer}`;
        const back = [
          `\\sinh(${answer}) = \\frac{${L(R)} - ${L(Q.one.div(R))}}{2} = ${L(v)}`,
          `\\cosh(${answer}) = \\frac{${L(R)} + ${L(Q.one.div(R))}}{2} = ${L(v)}`,
          `\\tanh(${answer}) = \\frac{${L(R.mul(R))} - 1}{${L(R.mul(R))} + 1} = ${L(v)}`,
        ][which]!;
        return functionWith(
          {
            prompt: t(`Find the exact value of $${name}${vL}$.`, `求 $${name}${vL}$ 的精确值。`),
            answer,
            solution: walked(
              [
                [["Use the logarithmic form", "使用对数形式"], t("", ""), [formula]],
                [
                  [which === 2 ? "Simplify the fraction" : "Simplify the root", which === 2 ? "化简分数" : "化简根式"],
                  t("", ""),
                  [simplify],
                ],
                [["Take the logarithm", "取对数"], t("", ""), [conclude]],
              ],
              t(`Going back through the definition: $${back}$.`, `按定义反过来验证：$${back}$。`),
            ),
          },
          [
            which === 1
              ? say(
                  `-\\ln ${k}`,
                  "$\\operatorname{arcosh}$ gives the solution that is not negative.",
                  "$\\operatorname{arcosh}$ 取不为负的那个解。",
                )
              : say(
                  `${s < 0 ? "" : "-"}\\ln ${k}`,
                  `This has the wrong sign: $${name}$ is odd, and $${L(v)}$ is ${s < 0 ? "negative" : "positive"}.`,
                  `符号错了：$${name}$ 是奇函数，而 $${L(v)}$ 是${s < 0 ? "负" : "正"}的。`,
                ),
            which === 2
              ? say(
                  `\\ln ${k * k}`,
                  `This leaves out the factor $\\frac{1}{2}$: the fraction is $${L(R.mul(R))}$ and half its logarithm is $${answer}$.`,
                  `这漏掉了因子 $\\frac{1}{2}$：分数是 $${L(R.mul(R))}$，它的对数的一半才是 $${answer}$。`,
                )
              : say(
                  `\\ln ${k * k}`,
                  `This takes $e^{x} = ${k * k}$, but $${L(v)} + \\sqrt{\\ldots} = ${L(R)}$, so $e^{x} = ${L(R)}$.`,
                  `这取了 $e^{x} = ${k * k}$，但 $${L(v)} + \\sqrt{\\ldots} = ${L(R)}$，所以 $e^{x} = ${L(R)}$。`,
                ),
            ...(which !== 2 && s > 0
              ? [
                  say(
                    `\\ln ${L(v.mul(Q.of(2)))}`,
                    `This replaces the square root by $${L(v)}$ itself; the root is $${L(Q.of(which === 0 ? k * k + 1 : k * k - 1, 2 * k))}$.`,
                    `这把根式当成了 $${L(v)}$ 本身；根式等于 $${L(Q.of(which === 0 ? k * k + 1 : k * k - 1, 2 * k))}$。`,
                  ),
                ]
              : []),
          ],
        );
      },
    },
    {
      id: "logarithmic-forms-of-inverse-hyperbolic-functions",
      title: t("Logarithmic forms", "对数形式"),
      explanation: t(
        "Because hyperbolic functions are made of exponentials, solving for the input leads to a quadratic in the exponential, whose solution is a logarithm. Solving $\\sinh x = c$, $\\cosh x = c$ and $\\tanh x = c$ for $x$ gives\n\n$$\\operatorname{arsinh} c = \\ln\\left(c + \\sqrt{c^{2} + 1}\\right), \\quad \\operatorname{arcosh} c = \\ln\\left(c + \\sqrt{c^{2} - 1}\\right), \\quad \\operatorname{artanh} c = \\frac{1}{2}\\ln\\frac{1 + c}{1 - c}.$$\n\nFor example $\\operatorname{arsinh} 2 = \\ln\\left(2 + \\sqrt{5}\\right)$.\n\nCheck: $\\ln\\left(2 + \\sqrt{5}\\right) \\approx 1.4436$, and $\\sinh 1.4436 \\approx 2.0000$.\n\n> **Watch out.** $\\operatorname{arsinh}$ has $c^{2} + 1$ under the root and $\\operatorname{arcosh}$ has $c^{2} - 1$. $\\operatorname{artanh}$ has the factor $\\frac{1}{2}$ and the fraction $\\frac{1 + c}{1 - c}$, in that order.",
        "由于双曲函数由指数函数构成，求自变量时会得到关于指数式的二次方程，它的解是一个对数。由 $\\sinh x = c$、$\\cosh x = c$、$\\tanh x = c$ 解出 $x$，得\n\n$$\\operatorname{arsinh} c = \\ln\\left(c + \\sqrt{c^{2} + 1}\\right), \\quad \\operatorname{arcosh} c = \\ln\\left(c + \\sqrt{c^{2} - 1}\\right), \\quad \\operatorname{artanh} c = \\frac{1}{2}\\ln\\frac{1 + c}{1 - c}.$$\n\n例如 $\\operatorname{arsinh} 2 = \\ln\\left(2 + \\sqrt{5}\\right)$。\n\n检验：$\\ln\\left(2 + \\sqrt{5}\\right) \\approx 1.4436$，而 $\\sinh 1.4436 \\approx 2.0000$。\n\n> **注意。** $\\operatorname{arsinh}$ 根号下是 $c^{2} + 1$，$\\operatorname{arcosh}$ 根号下是 $c^{2} - 1$。$\\operatorname{artanh}$ 有因子 $\\frac{1}{2}$，分数是 $\\frac{1 + c}{1 - c}$，次序不能颠倒。",
      ),
      generate(rng) {
        const which = rng.int(0, 2);
        if (which === 2) {
          const [p, q] = rng.pick(
            range(2, 9).flatMap((d) =>
              range(1, d - 1)
                .filter((n) => Q.of(n, d).d === BigInt(d) && Q.of(d + n, d - n).d !== 1n)
                .map((n) => [n, d] as const),
            ),
          );
          const s = rng.sign();
          const c = Q.of(s * p, q);
          const ratio = Q.one.add(c).div(Q.one.sub(c));
          const x = Math.round((Math.log(ratio.toNumber()) / 2) * 10000) / 10000;
          return functionWith(
            {
              prompt: t(
                `Write $\\operatorname{artanh}\\left(${L(c)}\\right)$ exactly, using a logarithm.`,
                `用对数写出 $\\operatorname{artanh}\\left(${L(c)}\\right)$ 的精确值。`,
              ),
              answer: `\\frac{1}{2}\\ln ${L(ratio)}`,
              solution: walked(
                [
                  [
                    ["Use the logarithmic form", "使用对数形式"],
                    t("", ""),
                    [`\\operatorname{artanh} c = \\frac{1}{2}\\ln\\frac{1 + c}{1 - c}`],
                  ],
                  [
                    ["Substitute", "代入"],
                    t("", ""),
                    [
                      `\\operatorname{artanh}\\left(${L(c)}\\right) = \\frac{1}{2}\\ln\\frac{${poly([1, ""], [c, ""])}}{${poly([1, ""], [c.neg(), ""])}} = \\frac{1}{2}\\ln ${L(ratio)}`,
                    ],
                  ],
                ],
                t(
                  `$\\frac{1}{2}\\ln ${L(ratio)} \\approx ${fmt(x)}$, and $\\tanh ${fmt(x)} \\approx ${fmt(Math.tanh(x))}$, which is $${L(c)} = ${fmt(c.toNumber())}$ to four decimal places.`,
                  `$\\frac{1}{2}\\ln ${L(ratio)} \\approx ${fmt(x)}$，而 $\\tanh ${fmt(x)} \\approx ${fmt(Math.tanh(x))}$，在四位小数内等于 $${L(c)} = ${fmt(c.toNumber())}$。`,
                ),
              ),
            },
            [
              say(`\\ln ${L(ratio)}`, "This leaves out the factor $\\frac{1}{2}$.", "这漏掉了因子 $\\frac{1}{2}$。"),
              say(
                `\\frac{1}{2}\\ln ${L(Q.one.div(ratio))}`,
                "This turns the fraction upside down: it is $\\frac{1 + c}{1 - c}$.",
                "这把分数颠倒了：应是 $\\frac{1 + c}{1 - c}$。",
              ),
              say(`2\\ln ${L(ratio)}`, "This multiplies by $2$ instead of $\\frac{1}{2}$.", "这乘了 $2$，而不是 $\\frac{1}{2}$。"),
            ],
          );
        }
        const n = which === 0 ? rng.int(1, 12) : rng.int(2, 12);
        const under = which === 0 ? n * n + 1 : n * n - 1;
        const name = which === 0 ? "\\operatorname{arsinh}" : "\\operatorname{arcosh}";
        const base = which === 0 ? "\\sinh" : "\\cosh";
        const answer = `\\ln\\left(${n} + ${sqrtLatex(under)}\\right)`;
        const other = which === 0 ? n * n - 1 : n * n + 1;
        const x = Math.round(Math.log(n + Math.sqrt(under)) * 10000) / 10000;
        const back = which === 0 ? Math.sinh(x) : Math.cosh(x);
        return functionWith(
          {
            prompt: t(`Write $${name} ${n}$ exactly, using a logarithm.`, `用对数写出 $${name} ${n}$ 的精确值。`),
            answer,
            solution: walked(
              [
                [
                  ["Use the logarithmic form", "使用对数形式"],
                  t("", ""),
                  [`${name} c = \\ln\\left(c + \\sqrt{c^{2} ${which === 0 ? "+" : "-"} 1}\\right)`],
                ],
                [
                  ["Substitute", "代入"],
                  t("", ""),
                  [`${name} ${n} = \\ln\\left(${n} + \\sqrt{${n}^{2} ${which === 0 ? "+" : "-"} 1}\\right) = ${answer}`],
                ],
              ],
              t(
                `$${answer} \\approx ${fmt(x)}$, and $${base} ${fmt(x)} \\approx ${fmt(back)}$, which is $${n}$ to the accuracy of the rounding.`,
                `$${answer} \\approx ${fmt(x)}$，而 $${base} ${fmt(x)} \\approx ${fmt(back)}$，在舍入精度内等于 $${n}$。`,
              ),
            ),
          },
          [
            ...(other > 0
              ? [
                  say(
                    `\\ln\\left(${n} + ${sqrtLatex(other)}\\right)`,
                    which === 0
                      ? "This uses $c^{2} - 1$, which belongs to $\\operatorname{arcosh}$; $\\operatorname{arsinh}$ has $c^{2} + 1$."
                      : "This uses $c^{2} + 1$, which belongs to $\\operatorname{arsinh}$; $\\operatorname{arcosh}$ has $c^{2} - 1$.",
                    which === 0
                      ? "这用了 $c^{2} - 1$，那是 $\\operatorname{arcosh}$ 的；$\\operatorname{arsinh}$ 用 $c^{2} + 1$。"
                      : "这用了 $c^{2} + 1$，那是 $\\operatorname{arsinh}$ 的；$\\operatorname{arcosh}$ 用 $c^{2} - 1$。",
                  ),
                ]
              : []),
            say(
              `\\ln\\left(${n} - ${sqrtLatex(under)}\\right)`,
              which === 0
                ? `This takes the minus sign: $${n} - ${sqrtLatex(under)}$ is negative and has no logarithm.`
                : `This takes the minus sign, which gives the negative solution $-${name} ${n}$; $${name}$ takes the plus sign.`,
              which === 0
                ? `这取了减号：$${n} - ${sqrtLatex(under)}$ 是负数，没有对数。`
                : `这取了减号，得到的是负解 $-${name} ${n}$；$${name}$ 取加号。`,
            ),
            say(`\\ln ${n}`, "This leaves out the square root term.", "这漏掉了根式项。"),
          ],
        );
      },
    },
  ],
};

/** calculusIHyperbolicTopics are the topics of Calculus I module 1.1. */
export const calculusIHyperbolicTopics: readonly TopicDef[] = [
  theHyperbolicFunctions,
  theReciprocalHyperbolicFunctions,
  solvingEquationsContainingHyperbolicFunctions,
  graphsOfTheHyperbolicFunctions,
  graphsOfTheReciprocalHyperbolicFunctions,
  theInverseHyperbolicFunctions,
];
