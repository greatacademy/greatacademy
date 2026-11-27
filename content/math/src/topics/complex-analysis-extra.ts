// The rest of a first course in Complex Analysis: the Riemann sphere, path independence, the mean value and
// maximum modulus properties, consequences of Cauchy's theorems, more residue techniques, continuation, and
// conformal maps applied to the Dirichlet problem.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { complexDrawings2 } from "../explanation-drawings-complex-analysis-2.ts";
import { type Pair, point, same, topic } from "../university-kit.ts";
import { chosen, lesson, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

/** fraction draws a proper fraction p over q in lowest terms from denominators up to `top`. */
const fraction = (rng: { int: (a: number, b: number) => number }, top: number): [number, number] => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const q = rng.int(2, top);
  let p = rng.int(1, q - 1);
  while (gcd(p, q) !== 1) p -= 1;
  return [p, q];
};

/** piFraction writes p times pi over q in lowest terms. */
const piFraction = (p: number, q: number): string => {
  const r = Q.of(p, q).toLatex();
  const m = /^\\frac\{(\d+)\}\{(\d+)\}$/.exec(r);
  if (!m) return r === "1" ? "\\pi" : `${r}\\pi`;
  return `\\frac{${m[1] === "1" ? "" : m[1]}\\pi}{${m[2]}}`;
};

/** minus writes z minus a without a double sign. */
const minus = (a: number): string => (a === 0 ? "z" : a < 0 ? `z + ${-a}` : `z - ${a}`);

/** factor writes the factor with a root at a, in parentheses unless it is just z. */
const factor = (a: number): string => (a === 0 ? "z" : `(${minus(a)})`);

/** plus writes a constant term after another term, with its sign, and nothing for zero. */
const plus = (v: number): string => (v === 0 ? "" : v > 0 ? ` + ${v}` : ` - ${-v}`);

/** plusTerm writes c times symbol after another term, with its sign, and nothing for zero. */
const plusTerm = (c: number, symbol: string): string =>
  c === 0 ? "" : `${c < 0 ? " - " : " + "}${Math.abs(c) === 1 ? "" : Math.abs(c)}${symbol}`;

/** co writes c times symbol, leaving out a coefficient of one. */
const co = (c: number, symbol: string): string => (c === 1 ? symbol : c === -1 ? `-${symbol}` : `${c}${symbol}`);

/** gauss writes a + bi for b > 0, and with sign -1 its conjugate. */
const gauss = (a: number, b: number, sign = 1): string => {
  const part = b === 1 ? "i" : `${b}i`;
  if (a === 0) return sign < 0 ? `-${part}` : part;
  return `${a} ${sign < 0 ? "-" : "+"} ${part}`;
};

/** complexName writes x + yi, leaving out a zero part and a coefficient of one. */
const complexName = (x: number, y: number): string => {
  const imaginary = Math.abs(y) === 1 ? "i" : `${Math.abs(y)}i`;
  if (y === 0) return String(x);
  if (x === 0) return y < 0 ? `-${imaginary}` : imaginary;
  return `${x} ${y < 0 ? "-" : "+"} ${imaginary}`;
};

/** paren writes a number, in brackets when it is negative. */
const paren = (a: number): string => (a < 0 ? `(${a})` : String(a));

/** factorial gives n! for a small whole number n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** sizePairs lists whole numbers a and b with a whole modulus for a + bi. */
const sizePairs: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [12, 5, 13],
  [15, 8, 17],
];

const riemannSphere = topic(
  "the-riemann-sphere",
  ["The Riemann Sphere", "黎曼球面"],
  ["Add a point at infinity, and picture the plane on a sphere by stereographic projection.", "加上无穷远点，用球极投影把平面画到球面上。"],
  ["the-complex-plane"],
  [],
  [
    {
      ...point(
        "the-height-of-a-projected-point",
        ["The height of a projected point", "投影点的高度"],
        [
          "Stereographic projection joins a plane point to the north pole of the unit sphere. The line meets the sphere at height $\\frac{|z|^{2} - 1}{|z|^{2} + 1}$, so the height depends only on the distance from the origin. For a point with $|z| = 2$, as in the drawing, $|z|^{2} = 4$ and the height is $Z = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}$.\n\nCheck: the sphere point is $\\left(\\frac{2x}{|z|^{2} + 1}, \\frac{2y}{|z|^{2} + 1}, Z\\right)$, and with $x^{2} + y^{2} = 4$ its squared length is $\\frac{16}{25} + \\frac{9}{25} = 1$, so it does lie on the unit sphere.\n\n> **Watch out.** Square the modulus first: the formula uses $|z|^{2}$, not $|z|$. And the sign matters: points outside the unit circle land above the equator.",
          "球极投影把平面上的点与单位球的北极相连。这条线与球面交于高度 $\\frac{|z|^{2} - 1}{|z|^{2} + 1}$ 处，所以高度只取决于到原点的距离。对图中 $|z| = 2$ 的点，$|z|^{2} = 4$，高度是 $Z = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}$。\n\n检验：球面上的点是 $\\left(\\frac{2x}{|z|^{2} + 1}, \\frac{2y}{|z|^{2} + 1}, Z\\right)$，由 $x^{2} + y^{2} = 4$，它的长度平方是 $\\frac{16}{25} + \\frac{9}{25} = 1$，确实在单位球面上。\n\n> **注意。** 先把模平方：公式用的是 $|z|^{2}$，不是 $|z|$。符号也重要：单位圆外的点落在赤道上方。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(-9, 9);
            const b = rng.int(1, 9);
            const m = a * a + b * b;
            if (m === 1) return undefined;
            const answer = Q.of(m - 1, m + 1);
            const misses: Miss[] = [
              [
                Q.of(m + 1, m - 1),
                "That turns the fraction upside down; a height on the unit sphere lies between -1 and 1.",
                "那把分数颠倒了；单位球面上的高度在 -1 和 1 之间。",
              ],
              [
                Q.of(2, m + 1),
                "That is $1 - Z$, the drop from the north pole, not the height $Z$ itself.",
                "那是 $1 - Z$，即从北极往下的距离，不是高度 $Z$ 本身。",
              ],
              [
                Q.of(1 - m, m + 1),
                "That has the sign reversed: a point outside the unit circle lands above the equator.",
                "那把符号弄反了：单位圆外的点落在赤道上方。",
              ],
            ];
            return worked(
              [
                `At what height does $z = ${gauss(a, b)}$ land on the unit Riemann sphere?`,
                `$z = ${gauss(a, b)}$ 落在单位黎曼球面的什么高度？`,
              ],
              answer,
              misses,
              [
                [
                  ["Square the modulus", "求模的平方"],
                  [`$|z|^{2} = ${paren(a)}^{2} + ${b}^{2} = ${m}$.`, `$|z|^{2} = ${paren(a)}^{2} + ${b}^{2} = ${m}$。`],
                ],
                [
                  ["Use the height formula", "代入高度公式"],
                  [
                    `$Z = \\frac{|z|^{2} - 1}{|z|^{2} + 1} = \\frac{${m - 1}}{${m + 1}} = ${answer.toLatex()}$.`,
                    `$Z = \\frac{|z|^{2} - 1}{|z|^{2} + 1} = \\frac{${m - 1}}{${m + 1}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The sphere point has $X^{2} + Y^{2} = \\frac{4 \\cdot ${m}}{${m + 1}^{2}}$, and $\\frac{${4 * m} + ${(m - 1) ** 2}}{${(m + 1) ** 2}} = 1$, so with this height it lies on the unit sphere.`,
                `球面上的点满足 $X^{2} + Y^{2} = \\frac{4 \\cdot ${m}}{${m + 1}^{2}}$，而 $\\frac{${4 * m} + ${(m - 1) ** 2}}{${(m + 1) ** 2}} = 1$，所以取这个高度时它在单位球面上。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-riemann-sphere#the-height-of-a-projected-point"],
    },
    {
      ...point(
        "from-the-sphere-back-to-the-plane",
        ["From the sphere back to the plane", "从球面回到平面"],
        [
          "The inverse map sends a sphere point $(X, Y, Z)$ to $\\frac{X + iY}{1 - Z}$. Points near the north pole have a small denominator, so they land far out, which is why the pole stands for infinity. For the point $(0.6, 0, 0.8)$ in the drawing, $1 - Z = 0.2$, so it goes to $\\frac{0.6}{0.2} = 3$.\n\nCheck: the plane point 3 has $|z|^{2} = 9$, and the height formula gives $\\frac{9 - 1}{9 + 1} = 0.8$, the height we started from.\n\n> **Watch out.** Divide by $1 - Z$, not by $1 + Z$: dividing by $1 + Z$ projects from the south pole instead.",
          "逆映射把球面上的点 $(X, Y, Z)$ 映到 $\\frac{X + iY}{1 - Z}$。北极附近的点分母很小，所以落得很远，这就是北极代表无穷的原因。对图中的点 $(0.6, 0, 0.8)$，$1 - Z = 0.2$，所以它映到 $\\frac{0.6}{0.2} = 3$。\n\n检验：平面上的点 3 满足 $|z|^{2} = 9$，高度公式给出 $\\frac{9 - 1}{9 + 1} = 0.8$，正是开始时的高度。\n\n> **注意。** 除以 $1 - Z$，不是 $1 + Z$：除以 $1 + Z$ 是从南极投影。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(-9, 9);
            const b = rng.int(1, 9);
            const m = a * a + b * b + 1;
            const x = Q.of(2 * a, m);
            const y = Q.of(2 * b, m);
            const z = Q.of(m - 2, m);
            const misses: Miss[] = [
              [
                a,
                "That is $u$, which comes from $X$; the imaginary part $v$ comes from $Y$.",
                "那是由 $X$ 得到的 $u$；虚部 $v$ 来自 $Y$。",
              ],
              [y, "That is $Y$ itself; it still has to be divided by $1 - Z$.", "那是 $Y$ 本身；它还要除以 $1 - Z$。"],
              [Q.of(b, m - 1), "That divides by $1 + Z$, which projects from the south pole.", "那除以了 $1 + Z$，那是从南极投影。"],
            ];
            return worked(
              [
                `The sphere point $\\left(${x.toLatex()}, ${y.toLatex()}, ${z.toLatex()}\\right)$ projects to $u + vi$ in the plane. What is $v$?`,
                `球面上的点 $\\left(${x.toLatex()}, ${y.toLatex()}, ${z.toLatex()}\\right)$ 投影到平面上的 $u + vi$。$v$ 是多少？`,
              ],
              b,
              misses,
              [
                [
                  ["Find the denominator", "求分母"],
                  [`$1 - Z = 1 - ${z.toLatex()} = \\frac{2}{${m}}$.`, `$1 - Z = 1 - ${z.toLatex()} = \\frac{2}{${m}}$。`],
                ],
                [
                  ["Divide", "相除"],
                  [
                    `$v = Y \\div (1 - Z) = ${y.toLatex()} \\div \\frac{2}{${m}} = ${b}$.`,
                    `$v = Y \\div (1 - Z) = ${y.toLatex()} \\div \\frac{2}{${m}} = ${b}$。`,
                  ],
                ],
              ],
              [
                `In the same way $u = ${x.toLatex()} \\div \\frac{2}{${m}} = ${a}$, so the plane point is $${gauss(a, b)}$ with $|z|^{2} = ${m - 1}$, and its height is $\\frac{${m - 2}}{${m}} = ${z.toLatex()}$, the $Z$ we started from.`,
                `同样 $u = ${x.toLatex()} \\div \\frac{2}{${m}} = ${a}$，所以平面上的点是 $${gauss(a, b)}$，$|z|^{2} = ${m - 1}$，它的高度是 $\\frac{${m - 2}}{${m}} = ${z.toLatex()}$，正是开始时的 $Z$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-riemann-sphere#from-the-sphere-back-to-the-plane"],
    },
    {
      ...point(
        "which-hemisphere",
        ["Which hemisphere", "哪个半球"],
        [
          "The unit circle lands on the equator, because height zero means $|z| = 1$. Points inside the circle land on the lower hemisphere, and points outside it land on the upper hemisphere near the pole. In the drawing, $|z| = \\frac{1}{2}$ gives $Z = \\frac{\\frac{1}{4} - 1}{\\frac{1}{4} + 1} = -\\frac{3}{5}$, below; $|z| = 1$ gives $Z = 0$; and $|z| = 2$ gives $Z = \\frac{3}{5}$, above.\n\nCheck: the numerator $|z|^{2} - 1$ alone fixes the sign of $Z$, since the denominator is always positive: $\\frac{1}{4} - 1 < 0$ and $4 - 1 > 0$.\n\n> **Watch out.** Only the point at infinity goes to the north pole itself; every finite point, however large, lands below it.",
          "单位圆落在赤道上，因为高度为零意味着 $|z| = 1$。圆内的点落在下半球，圆外的点落在靠近北极的上半球。图中 $|z| = \\frac{1}{2}$ 给出 $Z = \\frac{\\frac{1}{4} - 1}{\\frac{1}{4} + 1} = -\\frac{3}{5}$，在下方；$|z| = 1$ 给出 $Z = 0$；$|z| = 2$ 给出 $Z = \\frac{3}{5}$，在上方。\n\n检验：分母总是正的，所以只看分子 $|z|^{2} - 1$ 就能定出 $Z$ 的符号：$\\frac{1}{4} - 1 < 0$，$4 - 1 > 0$。\n\n> **注意。** 只有无穷远点映到北极本身；每个有限的点，无论多大，都落在北极下方。",
        ],
        (rng) => {
          const n = rng.int(2, 30);
          const a = rng.int(1, 30);
          const b = rng.int(1, 30);
          const kind = rng.int(0, 2);
          const lower: Pair = ["The lower hemisphere", "下半球"];
          const upper: Pair = ["The upper hemisphere", "上半球"];
          const equator: Pair = ["The equator", "赤道"];
          const pole: Pair = ["The north pole", "北极"];
          const d = a + b + n;
          const z =
            kind === 0 ? `\\frac{${a} + ${b}i}{${d}}` : kind === 1 ? `${a} + ${b}i` : `\\frac{${n * n - 1} + ${2 * n}i}{${n * n + 1}}`;
          const right = kind === 0 ? lower : kind === 1 ? upper : equator;
          const here = kind === 0 ? ["|z| < 1", "|z| < 1"] : kind === 1 ? ["|z| > 1", "|z| > 1"] : ["|z| = 1", "|z| = 1"];
          const need = (o: Pair): Pair =>
            o === lower ? ["|z| < 1", "|z| < 1"] : o === upper ? ["|z| > 1", "|z| > 1"] : ["|z| = 1", "|z| = 1"];
          const slips: Slip[] = [lower, upper, equator]
            .filter((o) => o !== right)
            .map(
              (o) => [o, `That needs $${need(o)[0]}$, but here $${here[0]}$.`, `那需要 $${need(o)[1]}$，而这里 $${here[1]}$。`] as const,
            );
          slips.push([
            pole,
            "Only the point at infinity goes to the north pole; every finite point lands below it.",
            "只有无穷远点映到北极；每个有限的点都落在它下方。",
          ]);
          const s = a * a + b * b;
          const height = kind === 0 ? Q.of(s - d * d, s + d * d) : kind === 1 ? Q.of(s - 1, s + 1) : Q.of(0);
          const size: Pair =
            kind === 0
              ? [
                  `$|${a} + ${b}i| \\le ${a} + ${b} = ${a + b} < ${d}$, so $|z| < 1$.`,
                  `$|${a} + ${b}i| \\le ${a} + ${b} = ${a + b} < ${d}$，所以 $|z| < 1$。`,
                ]
              : kind === 1
                ? [`$|z|^{2} = ${a}^{2} + ${b}^{2} = ${s} > 1$.`, `$|z|^{2} = ${a}^{2} + ${b}^{2} = ${s} > 1$。`]
                : [
                    `$${n * n - 1}^{2} + ${2 * n}^{2} = ${(n * n + 1) ** 2} = ${n * n + 1}^{2}$, so $|z| = 1$.`,
                    `$${n * n - 1}^{2} + ${2 * n}^{2} = ${(n * n + 1) ** 2} = ${n * n + 1}^{2}$，所以 $|z| = 1$。`,
                  ];
          return chosen(
            rng,
            [`Where on the Riemann sphere does $z = ${z}$ land?`, `$z = ${z}$ 落在黎曼球面的什么位置？`],
            right,
            slips,
            [
              [["Find the size", "求模"], size],
              [
                ["Read the hemisphere", "判断半球"],
                [
                  "Inside the unit circle means the lower hemisphere, on it the equator, and outside it the upper hemisphere.",
                  "单位圆内对应下半球，圆上对应赤道，圆外对应上半球。",
                ],
              ],
            ],
            [
              `The height formula gives $Z = \\frac{|z|^{2} - 1}{|z|^{2} + 1} = ${height.toLatex()}$, which is ${height.sign() < 0 ? "negative" : height.sign() > 0 ? "positive" : "zero"}, in agreement.`,
              `高度公式给出 $Z = \\frac{|z|^{2} - 1}{|z|^{2} + 1} = ${height.toLatex()}$，它是${height.sign() < 0 ? "负的" : height.sign() > 0 ? "正的" : "零"}，结论一致。`,
            ],
          );
        },
      ),
      figure: complexDrawings2["the-riemann-sphere#which-hemisphere"],
    },
  ],
);

const antiderivatives = topic(
  "complex-antiderivatives-and-path-independence",
  ["Complex Antiderivatives and Path Independence", "复原函数与路径无关"],
  ["Evaluate contour integrals from the end points when an antiderivative exists.", "存在原函数时，由端点计算围道积分。"],
  ["contour-integrals"],
  [],
  [
    point(
      "evaluating-from-the-end-points",
      ["Evaluating from the end points", "由端点求值"],
      [
        "If $F' = f$ on a domain, then the integral of $f$ along any path equals $F$ at the end minus $F$ at the start. So the path can be ignored, and the work reduces to arithmetic with complex numbers. For example, along any path from 1 to $2 + i$, $\\int 2z\\, dz = (2 + i)^{2} - 1^{2} = (3 + 4i) - 1 = 2 + 4i$.\n\nCheck: go from 1 to 2 along the real axis, which gives $\\int_{1}^{2} 2x\\, dx = 3$, and then up from 2 to $2 + i$ with $z = 2 + it$, which gives $\\int_{0}^{1} 2(2 + it)\\, i\\, dt = 4i - 1$. The total is $2 + 4i$ again.\n\n> **Watch out.** $(qi)^{2} = -q^{2}$, so squaring $p + qi$ gives the real part $p^{2} - q^{2}$, not $p^{2} + q^{2}$.",
        "如果在区域上 $F' = f$，那么 $f$ 沿任何路径的积分都等于 $F$ 在终点的值减去在起点的值。所以可以不管路径，工作就化成复数运算。例如，沿从 1 到 $2 + i$ 的任何路径，$\\int 2z\\, dz = (2 + i)^{2} - 1^{2} = (3 + 4i) - 1 = 2 + 4i$。\n\n检验：先沿实轴从 1 走到 2，得 $\\int_{1}^{2} 2x\\, dx = 3$；再令 $z = 2 + it$ 从 2 向上走到 $2 + i$，得 $\\int_{0}^{1} 2(2 + it)\\, i\\, dt = 4i - 1$。总和仍是 $2 + 4i$。\n\n> **注意。** $(qi)^{2} = -q^{2}$，所以 $p + qi$ 的平方的实部是 $p^{2} - q^{2}$，不是 $p^{2} + q^{2}$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-9, 9);
          const p = rng.int(-9, 9);
          const q = rng.int(1, 9);
          const part = rng.bool();
          const re = p * p - q * q - a * a;
          const im = 2 * p * q;
          const misses: Miss[] = part
            ? [
                [
                  p * p + q * q - a * a,
                  "That treats $(qi)^{2}$ as $+q^{2}$; it is $-q^{2}$.",
                  "那把 $(qi)^{2}$ 当成 $+q^{2}$；它是 $-q^{2}$。",
                ],
                [p * p - q * q, "That leaves out the value of $z^{2}$ at the start point.", "那漏掉了 $z^{2}$ 在起点的值。"],
                [a * a - p * p + q * q, "That subtracts the end value from the start value.", "那用起点的值减去终点的值。"],
              ]
            : [
                [p * q, "That drops the factor 2 in the cross term $2pq\\,i$.", "那漏掉了交叉项 $2pq\\,i$ 中的因子 2。"],
                [-im, "That subtracts the end value from the start value.", "那用起点的值减去终点的值。"],
                [
                  q * q,
                  "That takes $q^{2}$ for the imaginary part, but $(qi)^{2} = -q^{2}$ is real.",
                  "那把 $q^{2}$ 当成虚部，但 $(qi)^{2} = -q^{2}$ 是实数。",
                ],
              ];
          return worked(
            [
              `Along any path from ${a} to $${gauss(p, q)}$, what is the ${part ? "real" : "imaginary"} part of $\\int 2z\\, dz$?`,
              `沿从 ${a} 到 $${gauss(p, q)}$ 的任何路径，$\\int 2z\\, dz$ 的${part ? "实" : "虚"}部是多少？`,
            ],
            part ? re : im,
            misses,
            [
              [
                ["Find an antiderivative", "找原函数"],
                [
                  "$z^{2}$ has derivative $2z$ everywhere, so only the end points matter.",
                  "$z^{2}$ 处处以 $2z$ 为导数，所以只有端点有关。",
                ],
              ],
              [
                ["Evaluate at the ends", "代入端点"],
                [
                  `$(${gauss(p, q)})^{2} = ${complexName(p * p - q * q, im)}$ and $${paren(a)}^{2} = ${a * a}$.`,
                  `$(${gauss(p, q)})^{2} = ${complexName(p * p - q * q, im)}$，$${paren(a)}^{2} = ${a * a}$。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                [
                  `The integral is $${complexName(re, im)}$, whose ${part ? "real" : "imaginary"} part is ${part ? re : im}.`,
                  `积分是 $${complexName(re, im)}$，它的${part ? "实" : "虚"}部是 ${part ? re : im}。`,
                ],
              ],
            ],
            [
              `Go along the real axis from ${a} to ${p}, which gives $${p * p} - ${a * a} = ${p * p - a * a}$, and then up to $${gauss(p, q)}$ with $z = ${p} + it$, which gives $\\int_{0}^{${q}} ${p === 0 ? "2it" : `2(${p} + it)`}\\, i\\, dt = ${complexName(-q * q, im)}$. The sum is $${complexName(re, im)}$ again.`,
              `先沿实轴从 ${a} 走到 ${p}，得 $${p * p} - ${a * a} = ${p * p - a * a}$；再令 $z = ${p} + it$ 向上走到 $${gauss(p, q)}$，得 $\\int_{0}^{${q}} ${p === 0 ? "2it" : `2(${p} + it)`}\\, i\\, dt = ${complexName(-q * q, im)}$。和仍是 $${complexName(re, im)}$。`,
            ],
          );
        }),
    ),
    point(
      "a-closed-contour-and-a-missing-antiderivative",
      ["A closed contour and a missing antiderivative", "闭围道与不存在的原函数"],
      [
        "Around a closed contour the two end points agree, so any term with an antiderivative integrates to zero. The term $\\frac{1}{z}$ has none on a punctured plane, and it is the only term that survives. For example, around $|z| = 1$ once counterclockwise, $\\oint \\left(3z^{2} + \\frac{2}{z^{2}} + \\frac{5}{z}\\right) dz = 5 \\cdot 2\\pi i = 10\\pi i$.\n\nCheck: with $z = e^{i\\theta}$, $\\oint z^{n}\\, dz = \\int_{0}^{2\\pi} i e^{i(n + 1)\\theta}\\, d\\theta$, which is 0 unless $n = -1$, where it is $2\\pi i$. So only the $\\frac{5}{z}$ term counts.\n\n> **Watch out.** $\\frac{1}{z^{2}}$ blows up at 0 too, but it has the antiderivative $-\\frac{1}{z}$, so its integral around the circle is 0.",
        "沿闭围道两个端点相同，所以有原函数的项积分为零。$\\frac{1}{z}$ 在去心平面上没有原函数，它是唯一留下的项。例如，沿 $|z| = 1$ 逆时针一周，$\\oint \\left(3z^{2} + \\frac{2}{z^{2}} + \\frac{5}{z}\\right) dz = 5 \\cdot 2\\pi i = 10\\pi i$。\n\n检验：令 $z = e^{i\\theta}$，$\\oint z^{n}\\, dz = \\int_{0}^{2\\pi} i e^{i(n + 1)\\theta}\\, d\\theta$，除 $n = -1$ 时为 $2\\pi i$ 外都是 0。所以只有 $\\frac{5}{z}$ 项有贡献。\n\n> **注意。** $\\frac{1}{z^{2}}$ 在 0 处也趋于无穷，但它有原函数 $-\\frac{1}{z}$，所以沿圆周的积分是 0。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 12);
          const b = rng.int(1, 12);
          const c = rng.int(1, 15);
          const r = rng.int(1, 9);
          const misses: Miss[] = [
            [c, "That leaves out the factor 2 in $2\\pi i$.", "那漏掉了 $2\\pi i$ 中的因子 2。"],
            [
              2 * (b + c),
              "That counts the $\\frac{1}{z^{2}}$ term as well, but it has the antiderivative $-\\frac{1}{z}$.",
              "那把 $\\frac{1}{z^{2}}$ 项也算进去了，但它有原函数 $-\\frac{1}{z}$。",
            ],
            [
              0,
              "That assumes every term has an antiderivative; $\\frac{1}{z}$ has none around the origin.",
              "那以为每一项都有原函数；$\\frac{1}{z}$ 在原点周围没有。",
            ],
          ];
          return worked(
            [
              `Around $|z| = ${r}$ once counterclockwise, $\\oint \\left(${co(a, "z^{2}")} + \\frac{${b}}{z^{2}} + \\frac{${c}}{z}\\right) dz = k\\pi i$. What is $k$?`,
              `沿 $|z| = ${r}$ 逆时针一周，$\\oint \\left(${co(a, "z^{2}")} + \\frac{${b}}{z^{2}} + \\frac{${c}}{z}\\right) dz = k\\pi i$。$k$ 是多少？`,
            ],
            2 * c,
            misses,
            [
              [
                ["Drop the terms with antiderivatives", "去掉有原函数的项"],
                [
                  `$${co(a, "z^{2}")}$ has the antiderivative $\\frac{${a}z^{3}}{3}$ and $\\frac{${b}}{z^{2}}$ has $-\\frac{${b}}{z}$, so both give 0 on a closed path.`,
                  `$${co(a, "z^{2}")}$ 有原函数 $\\frac{${a}z^{3}}{3}$，$\\frac{${b}}{z^{2}}$ 有 $-\\frac{${b}}{z}$，所以在闭路径上都给出 0。`,
                ],
              ],
              [
                ["Keep the reciprocal term", "保留倒数项"],
                [
                  `$\\oint \\frac{${c}}{z}\\, dz = ${c} \\cdot 2\\pi i = ${2 * c}\\pi i$, so $k = ${2 * c}$.`,
                  `$\\oint \\frac{${c}}{z}\\, dz = ${c} \\cdot 2\\pi i = ${2 * c}\\pi i$，所以 $k = ${2 * c}$。`,
                ],
              ],
            ],
            [
              `The residue at 0 is the coefficient of $\\frac{1}{z}$, which is ${c}, and the residue theorem gives $2\\pi i \\cdot ${c} = ${2 * c}\\pi i$; the radius ${r} does not matter.`,
              `0 处的留数是 $\\frac{1}{z}$ 的系数 ${c}，留数定理给出 $2\\pi i \\cdot ${c} = ${2 * c}\\pi i$；半径 ${r} 不影响结果。`,
            ],
          );
        }),
    ),
    point(
      "an-integral-of-a-reciprocal-square",
      ["An integral of a reciprocal square", "倒数平方的积分"],
      [
        "On a domain that avoids the origin, $-\\frac{1}{z}$ is an antiderivative of $\\frac{1}{z^{2}}$. So its integral between two points is the same along every path that avoids the origin, even a long winding one. For example, along any path from 1 to 3 in the right half plane, $\\int \\frac{dz}{z^{2}} = -\\frac{1}{3} - (-1) = \\frac{2}{3}$.\n\nCheck: on the real segment from 1 to 3 the integrand lies between $\\frac{1}{9}$ and 1, so the integral lies between $\\frac{2}{9}$ and 2, and $\\frac{2}{3}$ does.\n\n> **Watch out.** The antiderivative is $-\\frac{1}{z}$, with a minus sign; dropping it gives $-\\frac{2}{3}$, a negative value for a positive integrand.",
        "在避开原点的区域上，$-\\frac{1}{z}$ 是 $\\frac{1}{z^{2}}$ 的原函数。所以它在两点之间的积分沿每条避开原点的路径都相同，哪怕路径又长又弯。例如，在右半平面内沿从 1 到 3 的任何路径，$\\int \\frac{dz}{z^{2}} = -\\frac{1}{3} - (-1) = \\frac{2}{3}$。\n\n检验：在从 1 到 3 的实线段上，被积函数介于 $\\frac{1}{9}$ 和 1 之间，所以积分介于 $\\frac{2}{9}$ 和 2 之间，$\\frac{2}{3}$ 正是如此。\n\n> **注意。** 原函数是 $-\\frac{1}{z}$，带负号；丢掉它会得到 $-\\frac{2}{3}$，被积函数为正却得到负值。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 20);
          const b = a + rng.int(1, 20);
          const k = rng.int(1, 5);
          const answer = Q.of(k * (b - a), a * b);
          const misses: Miss[] = [
            [
              answer.neg(),
              "That uses $\\frac{1}{z}$ as the antiderivative; it is $-\\frac{1}{z}$.",
              "那把 $\\frac{1}{z}$ 当作原函数；应是 $-\\frac{1}{z}$。",
            ],
            [Q.of(k * (a + b), a * b), "That adds the two end values instead of subtracting them.", "那把两端的值相加了，而不是相减。"],
            [
              Q.of(2 * k * (b ** 3 - a ** 3), a ** 3 * b ** 3),
              `That uses the derivative $-\\frac{${2 * k}}{z^{3}}$ in place of an antiderivative.`,
              `那用了导数 $-\\frac{${2 * k}}{z^{3}}$，而不是原函数。`,
            ],
          ];
          return worked(
            [
              `A path goes from ${a} to ${b} in the right half plane. What is $\\int \\frac{${k}}{z^{2}}\\, dz$ along it?`,
              `一条路径在右半平面内从 ${a} 走到 ${b}。沿它的 $\\int \\frac{${k}}{z^{2}}\\, dz$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Find an antiderivative", "找原函数"],
                [
                  `$-\\frac{${k}}{z}$ has derivative $\\frac{${k}}{z^{2}}$ away from 0, and the path avoids 0.`,
                  `在 0 以外 $-\\frac{${k}}{z}$ 的导数是 $\\frac{${k}}{z^{2}}$，而路径避开 0。`,
                ],
              ],
              [
                ["Subtract the end values", "端点值相减"],
                [
                  `$-\\frac{${k}}{${b}} + \\frac{${k}}{${a}} = \\frac{${k} \\cdot ${b - a}}{${a * b}} = ${answer.toLatex()}$.`,
                  `$-\\frac{${k}}{${b}} + \\frac{${k}}{${a}} = \\frac{${k} \\cdot ${b - a}}{${a * b}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `On the real segment the integrand lies between $\\frac{${k}}{${b * b}}$ and $\\frac{${k}}{${a * a}}$ over a length ${b - a}, so the value lies between $${Q.of(k * (b - a), b * b).toLatex()}$ and $${Q.of(k * (b - a), a * a).toLatex()}$, and $${answer.toLatex()}$ does.`,
              `在实线段上，被积函数介于 $\\frac{${k}}{${b * b}}$ 和 $\\frac{${k}}{${a * a}}$ 之间，长度是 ${b - a}，所以值介于 $${Q.of(k * (b - a), b * b).toLatex()}$ 和 $${Q.of(k * (b - a), a * a).toLatex()}$ 之间，$${answer.toLatex()}$ 正是如此。`,
            ],
          );
        }),
    ),
  ],
);

const meanValue = topic(
  "the-mean-value-property-and-moreras-theorem",
  ["The Mean Value Property and Morera's Theorem", "平均值性质和莫雷拉定理"],
  ["Read a center value as a circle average, and detect analyticity from integrals.", "把圆心的值看成圆周平均，并由积分判断解析性。"],
  ["cauchys-integral-formula", "harmonic-functions-and-conjugates"],
  [],
  [
    {
      ...point(
        "the-average-of-an-analytic-function",
        ["The average of an analytic function", "解析函数的平均"],
        [
          "Cauchy's integral formula on a circle says that an analytic function at the center equals its average around the circle. So the average does not depend on the radius, and only the center value is needed, as the two circles of radii $r_1$ and $r_2$ in the drawing show. For example, the average of $f(z) = z^{2} + 1$ around $|z - 2| = 3$ is $f(2) = 5$.\n\nCheck: with $z = 2 + 3e^{i\\theta}$, $z^{2} + 1 = 5 + 12e^{i\\theta} + 9e^{2i\\theta}$, and $e^{i\\theta}$ and $e^{2i\\theta}$ average to 0 over a full turn, which leaves 5.\n\n> **Watch out.** The average is the value at the center, not at a point of the circle, and not the contour integral $\\oint f\\, dz$, which is 0.",
          "圆上的柯西积分公式说明，解析函数在圆心的值等于它沿圆周的平均。所以平均值与半径无关，只需要圆心的值，正如图中半径为 $r_1$ 和 $r_2$ 的两个圆所示。例如，$f(z) = z^{2} + 1$ 沿 $|z - 2| = 3$ 的平均值是 $f(2) = 5$。\n\n检验：令 $z = 2 + 3e^{i\\theta}$，$z^{2} + 1 = 5 + 12e^{i\\theta} + 9e^{2i\\theta}$，而 $e^{i\\theta}$ 和 $e^{2i\\theta}$ 在一整圈上的平均是 0，剩下 5。\n\n> **注意。** 平均值是圆心处的值，不是圆上某一点的值，也不是围道积分 $\\oint f\\, dz$，后者是 0。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(-9, 9);
            const b = rng.int(-9, 9);
            const c = rng.int(-20, 20);
            const r = rng.int(1, 9);
            const f = (x: number) => x * x + b * x + c;
            const misses: Miss[] = [
              [
                f(a + r),
                `That is the value at the point $${a + r}$ of the circle, not the average.`,
                `那是圆上一点 $${a + r}$ 处的值，不是平均值。`,
              ],
              [f(0), "That is the value at the origin; the circle is centered elsewhere.", "那是原点处的值；圆心不在原点。"],
              [
                0,
                "That is the contour integral $\\oint f\\, dz$; the average divides by the length after integrating in $\\theta$.",
                "那是围道积分 $\\oint f\\, dz$；平均值是对 $\\theta$ 积分后再除以长度。",
              ],
            ];
            const name = `z^{2}${plusTerm(b, "z")}${plus(c)}`;
            return worked(
              [
                `What is the average of $f(z) = ${name}$ around the circle $|${minus(a)}| = ${r}$?`,
                `$f(z) = ${name}$ 沿圆周 $|${minus(a)}| = ${r}$ 的平均值是多少？`,
              ],
              f(a),
              misses,
              [
                [
                  ["Find the center", "找圆心"],
                  [
                    `The circle $|${minus(a)}| = ${r}$ has center ${a}, and $f$ is a polynomial, so it is analytic.`,
                    `圆 $|${minus(a)}| = ${r}$ 的圆心是 ${a}，$f$ 是多项式，所以解析。`,
                  ],
                ],
                [
                  ["Take the center value", "取圆心的值"],
                  [
                    `$f(${a}) = ${paren(a)}^{2}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${paren(a)}`}${plus(c)} = ${f(a)}$.`,
                    `$f(${a}) = ${paren(a)}^{2}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${paren(a)}`}${plus(c)} = ${f(a)}$。`,
                  ],
                ],
              ],
              [
                `Around the center, $f(z) = ${factor(a)}^{2}${plusTerm(2 * a + b, factor(a))}${plus(f(a))}$, and the powers of $${minus(a)}$ average to 0 around the circle, which leaves ${f(a)}.`,
                `以圆心展开，$f(z) = ${factor(a)}^{2}${plusTerm(2 * a + b, factor(a))}${plus(f(a))}$，而 $${minus(a)}$ 的各次幂沿圆周的平均是 0，剩下 ${f(a)}。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-mean-value-property-and-moreras-theorem#the-average-of-an-analytic-function"],
    },
    {
      ...point(
        "the-average-of-a-harmonic-function",
        ["The average of a harmonic function", "调和函数的平均"],
        [
          "Real parts of analytic functions inherit the property, so a harmonic function at a point equals its average around any circle centered there. This holds for every harmonic function on a region containing the disc. In the drawing, $u = x^{2} - y^{2}$ on the unit circle takes the values $1, -1, 1, -1$ at the four marked points, and its average is 0, which is $u(0, 0)$.\n\nCheck: $u$ is the real part of $z^{2}$, whose average around the circle is $0^{2} = 0$, so the average of $u$ is 0 as well.\n\n> **Watch out.** The property needs $u$ to be harmonic; $x^{2} + y^{2}$ is not, and its average around the unit circle is 1, not its center value 0.",
          "解析函数的实部继承这一性质，所以调和函数在一点的值等于它沿以该点为圆心的任何圆周的平均。这对包含圆盘的区域上的每个调和函数都成立。图中 $u = x^{2} - y^{2}$ 在单位圆上四个标出的点取值 $1, -1, 1, -1$，平均值是 0，即 $u(0, 0)$。\n\n检验：$u$ 是 $z^{2}$ 的实部，$z^{2}$ 沿圆周的平均是 $0^{2} = 0$，所以 $u$ 的平均也是 0。\n\n> **注意。** 这个性质要求 $u$ 是调和的；$x^{2} + y^{2}$ 不是，它沿单位圆的平均是 1，不是圆心的值 0。",
        ],
        (rng) =>
          until(() => {
            const p = rng.int(-9, 9);
            const q = rng.int(-9, 9);
            const k = rng.int(2, 9);
            const r = rng.int(1, 9);
            const u = (x: number, y: number) => x * x - y * y + k * x;
            const misses: Miss[] = [
              [p * p + q * q + k * p, "That reads $-y^{2}$ as $+y^{2}$.", "那把 $-y^{2}$ 看成了 $+y^{2}$。"],
              [
                u(p + r, q),
                `That is the value at the point $(${p + r}, ${q})$ of the circle, not the average.`,
                `那是圆上一点 $(${p + r}, ${q})$ 处的值，不是平均值。`,
              ],
              [
                u(p, q) + r * r,
                `That adds $r^{2} = ${r * r}$, but the $x^{2} - y^{2}$ part contributes $r^{2}\\cos 2\\theta$ terms that average to 0.`,
                `那加上了 $r^{2} = ${r * r}$，但 $x^{2} - y^{2}$ 部分给出的是平均为 0 的 $r^{2}\\cos 2\\theta$ 项。`,
              ],
            ];
            return worked(
              [
                `What is the average of $u = x^{2} - y^{2} + ${k}x$ around the circle of radius ${r} centered at $(${p}, ${q})$?`,
                `$u = x^{2} - y^{2} + ${k}x$ 沿以 $(${p}, ${q})$ 为圆心、半径为 ${r} 的圆周的平均值是多少？`,
              ],
              u(p, q),
              misses,
              [
                [
                  ["Check that u is harmonic", "验证 u 调和"],
                  [`$u_{xx} + u_{yy} = 2 - 2 = 0$.`, `$u_{xx} + u_{yy} = 2 - 2 = 0$。`],
                ],
                [
                  ["Take the center value", "取圆心的值"],
                  [
                    `$u(${p}, ${q}) = ${paren(p)}^{2} - ${paren(q)}^{2} + ${k} \\cdot ${paren(p)} = ${u(p, q)}$.`,
                    `$u(${p}, ${q}) = ${paren(p)}^{2} - ${paren(q)}^{2} + ${k} \\cdot ${paren(p)} = ${u(p, q)}$。`,
                  ],
                ],
              ],
              [
                `$u$ is the real part of $z^{2} + ${k}z$, whose average is its value at $${complexName(p, q)}$; that value has real part ${u(p, q)}.`,
                `$u$ 是 $z^{2} + ${k}z$ 的实部，后者的平均是它在 $${complexName(p, q)}$ 处的值；这个值的实部是 ${u(p, q)}。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-mean-value-property-and-moreras-theorem#the-average-of-a-harmonic-function"],
    },
    {
      ...point(
        "using-moreras-theorem",
        ["Using Morera's theorem", "使用莫雷拉定理"],
        [
          "Morera's theorem is a converse of Cauchy's theorem. A continuous function whose integral around every triangle in a disc vanishes must be analytic there, so uniform limits of analytic functions are analytic too. The drawing shows two of the triangles. For example, $\\sum \\frac{z^{n}}{n^{2}}$ converges uniformly on $|z| \\le 1$; each partial sum has integral 0 around every triangle, so the limit does too, and Morera makes the limit analytic inside the disc.\n\nCheck: the proof builds $F(z) = \\int_{0}^{z} f$ along segments. Vanishing triangle integrals make $F' = f$, so $F$ is analytic, and then so is its derivative $f$.\n\n> **Watch out.** Morera gives analyticity and nothing stronger: $f(z) = z$ satisfies it without being constant, and $e^{z}$ without being a polynomial.",
          "莫雷拉定理是柯西定理的逆定理。沿圆盘内每个三角形积分都为零的连续函数在那里一定解析，所以解析函数的一致极限也解析。图中画出了其中两个三角形。例如，$\\sum \\frac{z^{n}}{n^{2}}$ 在 $|z| \\le 1$ 上一致收敛；每个部分和沿每个三角形的积分都是 0，所以极限也是，由莫雷拉定理极限在圆盘内解析。\n\n检验：证明中沿线段构造 $F(z) = \\int_{0}^{z} f$。三角形积分为零使 $F' = f$，所以 $F$ 解析，于是它的导数 $f$ 也解析。\n\n> **注意。** 莫雷拉定理只给出解析，不给出更强的结论：$f(z) = z$ 满足条件但不是常数，$e^{z}$ 满足条件但不是多项式。",
        ],
        (rng) => {
          const r = rng.int(1, 40);
          const slips: Slip[] = [
            [
              [`$f$ is constant on $|z| < ${r}$`, `$f$ 在 $|z| < ${r}$ 上是常数`],
              "$f(z) = z$ meets the hypothesis, because it is analytic, and it is not constant.",
              "$f(z) = z$ 解析，满足条件，但不是常数。",
            ],
            [
              [`$f$ is a polynomial of degree below ${r + 1}`, `$f$ 是次数低于 ${r + 1} 的多项式`],
              "$e^{z}$ is analytic, so its triangle integrals vanish, yet it is no polynomial.",
              "$e^{z}$ 解析，所以三角形积分为零，但它不是多项式。",
            ],
            [
              [`$f$ is zero on $|z| = ${r}$`, `$f$ 在 $|z| = ${r}$ 上为零`],
              "$f = 1$ meets the hypothesis and is zero nowhere; the theorem says nothing about the boundary.",
              "$f = 1$ 满足条件，却处处不为零；定理对边界没有任何结论。",
            ],
          ];
          return chosen(
            rng,
            [
              `$f$ is continuous on $|z| < ${r}$, and its integral around every triangle in the disc is 0. What must be true?`,
              `$f$ 在 $|z| < ${r}$ 上连续，沿圆盘内每个三角形的积分都是 0。一定成立什么？`,
            ],
            [`$f$ is analytic on $|z| < ${r}$`, `$f$ 在 $|z| < ${r}$ 上解析`],
            slips,
            [
              [
                ["Build a primitive", "构造原函数"],
                [
                  "$F(z) = \\int_{0}^{z} f$ along the segment is well defined, and vanishing triangle integrals give $F' = f$.",
                  "沿线段的 $F(z) = \\int_{0}^{z} f$ 有定义，三角形积分为零给出 $F' = f$。",
                ],
              ],
              [
                ["Differentiate again", "再求导"],
                [
                  "$F$ is analytic, and the derivative of an analytic function is analytic, so $f$ is analytic.",
                  "$F$ 解析，而解析函数的导数也解析，所以 $f$ 解析。",
                ],
              ],
            ],
            [
              "Conversely, Goursat's theorem says every analytic function has zero triangle integrals, so the hypothesis holds for exactly the analytic functions, such as $z$ and $e^{z}$, and promises nothing more.",
              "反过来，古尔萨定理说每个解析函数的三角形积分都为零，所以满足条件的恰好是解析函数，例如 $z$ 和 $e^{z}$，不能保证更多。",
            ],
          );
        },
      ),
      figure: complexDrawings2["the-mean-value-property-and-moreras-theorem#using-moreras-theorem"],
    },
  ],
);

const maximumModulus = topic(
  "the-maximum-modulus-principle",
  ["The Maximum Modulus Principle", "最大模原理"],
  ["Locate the largest and smallest sizes of analytic functions on the boundary.", "在边界上找解析函数的最大模和最小模。"],
  ["the-mean-value-property-and-moreras-theorem"],
  [],
  [
    point(
      "the-largest-size-of-a-linear-function",
      ["The largest size of a linear function", "线性函数的最大模"],
      [
        "A nonconstant analytic function has no interior maximum of its modulus, so on a closed disc the maximum sits on the boundary. For $z - c$, this is the boundary point farthest from $c$. For example, on $|z| \\le 2$ the maximum of $|z - (3 + 4i)|$ is $2 + |3 + 4i| = 2 + 5 = 7$, at $z = -\\frac{2}{5}(3 + 4i)$.\n\nCheck: the triangle inequality gives $|z - c| \\le |z| + |c| \\le 2 + 5 = 7$, and at $z = -\\frac{2}{5}(3 + 4i)$ the value is $\\left|-\\frac{7}{5}(3 + 4i)\\right| = 7$.\n\n> **Watch out.** Use $|c| = \\sqrt{a^{2} + b^{2}}$, not $a + b$; and $|c| - r$ is the minimum, the nearest boundary point.",
        "非常数解析函数的模没有内部最大值，所以在闭圆盘上最大值在边界上。对 $z - c$，就是离 $c$ 最远的边界点。例如，在 $|z| \\le 2$ 上 $|z - (3 + 4i)|$ 的最大值是 $2 + |3 + 4i| = 2 + 5 = 7$，在 $z = -\\frac{2}{5}(3 + 4i)$ 处取到。\n\n检验：三角不等式给出 $|z - c| \\le |z| + |c| \\le 2 + 5 = 7$，而在 $z = -\\frac{2}{5}(3 + 4i)$ 处值为 $\\left|-\\frac{7}{5}(3 + 4i)\\right| = 7$。\n\n> **注意。** 用 $|c| = \\sqrt{a^{2} + b^{2}}$，不是 $a + b$；$|c| - r$ 是最小值，对应最近的边界点。",
      ],
      (rng) =>
        until(() => {
          const r = rng.int(1, 20);
          const [a, b, h] = rng.pick(sizePairs);
          const misses: Miss[] = [
            [h, "That is the value at the center 0; the maximum is on the boundary.", "那是圆心 0 处的值；最大值在边界上。"],
            [
              Math.abs(h - r),
              "That is the distance to the nearest boundary point, which gives the minimum.",
              "那是到最近边界点的距离，给出的是最小值。",
            ],
            [
              a + b + r,
              `That uses $${a} + ${b}$ for $|c|$; the modulus is $\\sqrt{${a}^{2} + ${b}^{2}} = ${h}$.`,
              `那用 $${a} + ${b}$ 作 $|c|$；模是 $\\sqrt{${a}^{2} + ${b}^{2}} = ${h}$。`,
            ],
          ];
          return worked(
            [
              `What is the maximum of $|z - (${a} + ${b}i)|$ on $|z| \\le ${r}$?`,
              `$|z - (${a} + ${b}i)|$ 在 $|z| \\le ${r}$ 上的最大值是多少？`,
            ],
            r + h,
            misses,
            [
              [
                ["Go to the boundary", "转到边界"],
                [
                  "$z - c$ is analytic and not constant, so its largest modulus is on $|z| = r$.",
                  "$z - c$ 解析且不是常数，所以最大模在 $|z| = r$ 上。",
                ],
              ],
              [
                ["Take the farthest point", "取最远点"],
                [
                  `$|c| = \\sqrt{${a}^{2} + ${b}^{2}} = ${h}$, and the point $-\\frac{${r}}{${h}}c$ opposite $c$ is at distance $${r} + ${h} = ${r + h}$.`,
                  `$|c| = \\sqrt{${a}^{2} + ${b}^{2}} = ${h}$，与 $c$ 相对的点 $-\\frac{${r}}{${h}}c$ 到它的距离是 $${r} + ${h} = ${r + h}$。`,
                ],
              ],
            ],
            [
              `The triangle inequality gives $|z - c| \\le |z| + |c| \\le ${r} + ${h}$ for every $z$ in the disc, so ${r + h} cannot be beaten.`,
              `三角不等式对圆盘内每个 $z$ 给出 $|z - c| \\le |z| + |c| \\le ${r} + ${h}$，所以 ${r + h} 不能被超过。`,
            ],
          );
        }),
    ),
    point(
      "the-smallest-size-without-zeros",
      ["The smallest size without zeros", "没有零点时的最小模"],
      [
        "If an analytic function has no zeros in the disc, then its reciprocal is analytic too, so the minimum of the modulus also sits on the boundary. A zero inside the disc makes the minimum zero instead. For example, on $|z| \\le 2$ the function $z - (3 + 4i)$ has its zero outside, and the minimum is $5 - 2 = 3$ at $z = \\frac{2}{5}(3 + 4i)$; on $|z| \\le 6$ the zero is inside and the minimum is 0.\n\nCheck: the reverse triangle inequality gives $|z - c| \\ge |c| - |z| \\ge 5 - 2 = 3$ on $|z| \\le 2$.\n\n> **Watch out.** Look for zeros first: if $|c| \\le r$, then $|c| - r$ is not the answer, since a modulus is never negative and the zero gives 0.",
        "如果解析函数在圆盘内没有零点，它的倒数也解析，所以模的最小值也在边界上。如果圆盘内有零点，最小值就是零。例如，在 $|z| \\le 2$ 上，$z - (3 + 4i)$ 的零点在外面，最小值是 $5 - 2 = 3$，在 $z = \\frac{2}{5}(3 + 4i)$ 处取到；在 $|z| \\le 6$ 上零点在里面，最小值是 0。\n\n检验：反向三角不等式在 $|z| \\le 2$ 上给出 $|z - c| \\ge |c| - |z| \\ge 5 - 2 = 3$。\n\n> **注意。** 先找零点：如果 $|c| \\le r$，答案就不是 $|c| - r$，因为模不会是负数，而零点给出 0。",
      ],
      (rng) =>
        until(() => {
          const r = rng.int(1, 15);
          const [a, b, h] = rng.pick(sizePairs);
          const value = r < h ? h - r : 0;
          const misses: Miss[] = [
            [h + r, "That is the distance to the farthest boundary point, the maximum.", "那是到最远边界点的距离，即最大值。"],
            [h, "That is the value at the center 0, which is not the smallest.", "那是圆心 0 处的值，不是最小值。"],
            value === 0
              ? [
                  h - r,
                  `That is $|c| - r$, which is not a size; the zero $c$ lies in the disc and gives 0.`,
                  `那是 $|c| - r$，不是模；零点 $c$ 在圆盘内，给出 0。`,
                ]
              : [
                  r,
                  `That is the radius; the gap between $c$ and the circle is $${h} - ${r}$.`,
                  `那是半径；$c$ 与圆之间的距离是 $${h} - ${r}$。`,
                ],
          ];
          return worked(
            [
              `What is the minimum of $|z - (${a} + ${b}i)|$ on $|z| \\le ${r}$?`,
              `$|z - (${a} + ${b}i)|$ 在 $|z| \\le ${r}$ 上的最小值是多少？`,
            ],
            value,
            misses,
            [
              [
                ["Locate the zero", "找零点"],
                [
                  `The only zero is $c = ${a} + ${b}i$, with $|c| = ${h}$, which is ${value === 0 ? `at most ${r}, so it lies in the disc` : `more than ${r}, so it lies outside`}.`,
                  `唯一的零点是 $c = ${a} + ${b}i$，$|c| = ${h}$，它${value === 0 ? `不超过 ${r}，所以在圆盘内` : `大于 ${r}，所以在圆盘外`}。`,
                ],
              ],
              [
                ["Find the minimum", "求最小值"],
                value === 0
                  ? [`The function vanishes at $c$, so the minimum is 0.`, `函数在 $c$ 处为零，所以最小值是 0。`]
                  : [
                      `With no zero inside, the minimum is on the boundary, at the point $\\frac{${r}}{${h}}c$ nearest $c$: $${h} - ${r} = ${value}$.`,
                      `圆盘内没有零点，最小值在边界上，在离 $c$ 最近的点 $\\frac{${r}}{${h}}c$ 处：$${h} - ${r} = ${value}$。`,
                    ],
              ],
            ],
            value === 0
              ? [`The value at $z = c$ is $|c - c| = 0$, and no modulus is smaller.`, `在 $z = c$ 处值为 $|c - c| = 0$，没有比它更小的模。`]
              : [
                  `The reverse triangle inequality gives $|z - c| \\ge |c| - |z| \\ge ${h} - ${r} = ${value}$ throughout the disc.`,
                  `反向三角不等式在整个圆盘上给出 $|z - c| \\ge |c| - |z| \\ge ${h} - ${r} = ${value}$。`,
                ],
          );
        }),
    ),
    {
      ...point(
        "bounding-a-polynomial-on-a-circle",
        ["Bounding a polynomial on a circle", "圆周上多项式的界"],
        [
          "The triangle inequality gives an upper bound on the boundary, and that bound holds throughout the disc by the principle. For $z^{n} + a$ with positive $a$, the bound is attained where $z^{n}$ is a positive number. In the drawing, $z^{3} + 2$ on $|z| \\le 1$ has the bound $1 + 2 = 3$, attained at the three marked points where $z^{3} = 1$.\n\nCheck: at $z = 1$ the value is $1 + 2 = 3$ exactly, while at the center it is only 2, below the boundary maximum as the principle requires.\n\n> **Watch out.** On $|z| = r$, $|z^{n}| = r^{n}$, not $r$; and $|r^{n} - a|$ is the smallest size on the circle, where $z^{n}$ is negative.",
          "三角不等式给出边界上的上界，由最大模原理这个界在整个圆盘内都成立。对 $a$ 为正的 $z^{n} + a$，这个界在 $z^{n}$ 为正数时取到。图中 $z^{3} + 2$ 在 $|z| \\le 1$ 上的界是 $1 + 2 = 3$，在 $z^{3} = 1$ 的三个标出的点取到。\n\n检验：在 $z = 1$ 处值恰为 $1 + 2 = 3$，而圆心处只有 2，正如原理所说低于边界上的最大值。\n\n> **注意。** 在 $|z| = r$ 上 $|z^{n}| = r^{n}$，不是 $r$；$|r^{n} - a|$ 是圆上的最小模，在 $z^{n}$ 为负处取到。",
        ],
        (rng) =>
          until(() => {
            const r = rng.int(1, 6);
            const n = rng.int(2, 4);
            const a = rng.int(1, 40);
            const misses: Miss[] = [
              [a, "That is the value at the center, which the boundary beats.", "那是圆心处的值，边界上的值更大。"],
              [
                Math.abs(r ** n - a),
                "That is the smallest size on the circle, where $z^{n}$ is negative.",
                "那是圆上的最小模，在 $z^{n}$ 为负处。",
              ],
              [
                r + a,
                `That uses $|z^{${n}}| = ${r}$; on the circle it is $${r}^{${n}} = ${r ** n}$.`,
                `那用了 $|z^{${n}}| = ${r}$；在圆上它是 $${r}^{${n}} = ${r ** n}$。`,
              ],
            ];
            return worked(
              [
                `What is the maximum of $|z^{${n}} + ${a}|$ on $|z| \\le ${r}$?`,
                `$|z^{${n}} + ${a}|$ 在 $|z| \\le ${r}$ 上的最大值是多少？`,
              ],
              r ** n + a,
              misses,
              [
                [
                  ["Bound on the circle", "在圆上估计"],
                  [
                    `On $|z| = ${r}$, $|z^{${n}} + ${a}| \\le ${r}^{${n}} + ${a} = ${r ** n + a}$, and by the principle this bound holds inside too.`,
                    `在 $|z| = ${r}$ 上，$|z^{${n}} + ${a}| \\le ${r}^{${n}} + ${a} = ${r ** n + a}$，由最大模原理这个界在内部也成立。`,
                  ],
                ],
                [
                  ["Attain it", "取到界"],
                  [
                    `At $z = ${r}$, $z^{${n}} = ${r ** n}$ is positive, so the value is ${r ** n + a}.`,
                    `在 $z = ${r}$ 处 $z^{${n}} = ${r ** n}$ 为正，所以值是 ${r ** n + a}。`,
                  ],
                ],
              ],
              [
                `At the center the value is ${a} and at $z = ${r}$ it is ${r ** n + a}, larger, as the principle predicts for a maximum on the boundary.`,
                `圆心处的值是 ${a}，在 $z = ${r}$ 处是 ${r ** n + a}，更大，符合最大值在边界上的结论。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-maximum-modulus-principle#bounding-a-polynomial-on-a-circle"],
    },
  ],
);

const algebra = topic(
  "the-fundamental-theorem-of-algebra-from-liouville",
  ["The Fundamental Theorem of Algebra From Liouville", "由刘维尔定理证明代数基本定理"],
  [
    "Deduce from boundedness that every polynomial has a root, and bound where its roots lie.",
    "由有界性推出每个多项式都有根，并估计根的位置。",
  ],
  ["cauchys-estimates-and-liouvilles-theorem"],
  [],
  [
    point(
      "counting-roots-with-multiplicity",
      ["Counting roots with multiplicity", "按重数数根"],
      [
        "If a polynomial had no root, its reciprocal would be bounded and analytic everywhere, so constant by Liouville's theorem. Dividing out roots one at a time then shows that a polynomial of degree $n$ has $n$ roots with multiplicity. For example, $(z - 1)^{2}(z^{2} + 4)^{3}$ has degree $2 + 2 \\cdot 3 = 8$, so it has 8 roots counted with multiplicity.\n\nCheck: the roots are 1 twice, $2i$ three times and $-2i$ three times, and $2 + 3 + 3 = 8$.\n\n> **Watch out.** Each factor $z^{2} + b$ contributes two roots per power, and repeated roots count each time; the distinct roots here are only three.",
        "如果多项式没有根，它的倒数就处处解析且有界，由刘维尔定理是常数。再逐个除去根，就说明 $n$ 次多项式按重数有 $n$ 个根。例如，$(z - 1)^{2}(z^{2} + 4)^{3}$ 的次数是 $2 + 2 \\cdot 3 = 8$，所以按重数有 8 个根。\n\n检验：根是 1（两次）、$2i$（三次）和 $-2i$（三次），$2 + 3 + 3 = 8$。\n\n> **注意。** 每个 $z^{2} + b$ 因子每次方贡献两个根，重根每次都要计数；这里不同的根只有三个。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-9, 9);
          const b = rng.int(1, 30);
          const m = rng.int(2, 7);
          const n = rng.int(2, 6);
          const misses: Miss[] = [
            [m + n, `That counts $z^{2} + ${b}$ as one root per power; it has two.`, `那把 $z^{2} + ${b}$ 每次方算作一个根；它有两个。`],
            [3, "That counts only the distinct roots, without multiplicity.", "那只数了不同的根，没有按重数计算。"],
            [
              2 * m + n,
              "That doubles the wrong factor: the quadratic factor has two roots, the linear one has one.",
              "那把错误的因子加倍了：二次因子有两个根，一次因子只有一个。",
            ],
          ];
          return worked(
            [
              `How many complex roots, counted with multiplicity, does $${factor(a)}^{${m}} (z^{2} + ${b})^{${n}}$ have?`,
              `$${factor(a)}^{${m}} (z^{2} + ${b})^{${n}}$ 按重数有多少个复根？`,
            ],
            m + 2 * n,
            misses,
            [
              [
                ["Add the degrees", "把次数相加"],
                [`The degree is $${m} + 2 \\cdot ${n} = ${m + 2 * n}$.`, `次数是 $${m} + 2 \\cdot ${n} = ${m + 2 * n}$。`],
              ],
              [
                ["Apply the theorem", "应用定理"],
                [
                  `A polynomial of degree ${m + 2 * n} has ${m + 2 * n} roots counted with multiplicity.`,
                  `${m + 2 * n} 次多项式按重数有 ${m + 2 * n} 个根。`,
                ],
              ],
            ],
            [
              `The roots are ${a} with multiplicity ${m}, and $\\pm i\\sqrt{${b}}$ with multiplicity ${n} each, and $${m} + ${n} + ${n} = ${m + 2 * n}$.`,
              `根是 ${a}（重数 ${m}）和 $\\pm i\\sqrt{${b}}$（各重数 ${n}），$${m} + ${n} + ${n} = ${m + 2 * n}$。`,
            ],
          );
        }),
    ),
    point(
      "a-disc-holding-every-root",
      ["A disc holding every root", "包含所有根的圆盘"],
      [
        "For a monic polynomial, Cauchy's bound says every root has size below one plus the largest coefficient size. Outside that radius, the leading term is larger than all the other terms together, so no root is possible. For example, every root of $z^{4} + 3z^{2} - 5z + 2$ has size below $1 + 5 = 6$.\n\nCheck: at $|z| = 6$, $|z^{4}| = 1296$, while $|3z^{2}| + |5z| + 2 = 108 + 30 + 2 = 140$, far smaller, so the polynomial cannot vanish there.\n\n> **Watch out.** Take the largest coefficient size after the leading 1, and remember to add 1; the bound needs the polynomial to be monic.",
        "对首一多项式，柯西界说明每个根的模都小于一加最大系数模。超过这个半径，首项比其他所有项之和还大，所以不可能有根。例如，$z^{4} + 3z^{2} - 5z + 2$ 的每个根的模都小于 $1 + 5 = 6$。\n\n检验：在 $|z| = 6$ 处，$|z^{4}| = 1296$，而 $|3z^{2}| + |5z| + 2 = 108 + 30 + 2 = 140$，小得多，所以多项式在那里不可能为零。\n\n> **注意。** 取首项 1 以外的最大系数模，别忘了加 1；这个界要求多项式是首一的。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-20, 20);
          const b = rng.int(-20, 20);
          const c = rng.int(1, 20);
          const n = rng.int(4, 7);
          const m = Math.max(Math.abs(a), Math.abs(b), c);
          const big = 1 + m;
          const others = Math.abs(a) * big ** 2 + Math.abs(b) * big + c;
          const misses: Miss[] = [
            [m, "That forgets to add 1 to the largest coefficient size.", "那忘了给最大系数模加 1。"],
            [
              1 + Math.abs(a) + Math.abs(b) + c,
              "That adds all the coefficient sizes; Cauchy's bound uses only the largest one.",
              "那把所有系数模相加；柯西界只用最大的一个。",
            ],
            [
              n + m,
              "That adds the degree; the degree counts the roots but does not bound their size.",
              "那加上了次数；次数决定根的个数，不决定根的大小。",
            ],
          ];
          const name = `z^{${n}}${plusTerm(a, "z^{2}")}${plusTerm(b, "z")} + ${c}`;
          return worked(
            [`What radius does Cauchy's bound give for all roots of $${name}$?`, `对 $${name}$ 的所有根，柯西界给出的半径是多少？`],
            big,
            misses,
            [
              [
                ["Read the coefficients", "读出系数"],
                [
                  `After the leading 1, the coefficient sizes are ${Math.abs(a)}, ${Math.abs(b)} and ${c}, and the largest is ${m}.`,
                  `除首项 1 外，系数模是 ${Math.abs(a)}、${Math.abs(b)} 和 ${c}，最大是 ${m}。`,
                ],
              ],
              [
                ["Add one", "加一"],
                [`The bound is $1 + ${m} = ${big}$.`, `界是 $1 + ${m} = ${big}$。`],
              ],
            ],
            [
              `At $|z| = ${big}$, $|z^{${n}}| = ${big ** n}$, while the other terms have size at most ${others}, so the leading term wins and there is no root there or beyond.`,
              `在 $|z| = ${big}$ 处，$|z^{${n}}| = ${big ** n}$，而其他项的模至多是 ${others}，首项占优，所以那里及更远处没有根。`,
            ],
          );
        }),
    ),
    point(
      "roots-of-a-real-polynomial",
      ["Roots of a real polynomial", "实多项式的根"],
      [
        "Conjugating a real polynomial leaves it unchanged, so its nonreal roots come in conjugate pairs. Together with the relation between roots and coefficients, this recovers coefficients from one complex root and one real root. For example, a real monic cubic with roots $1 + 2i$ and 3 also has the root $1 - 2i$, so the sum of the roots is 5 and the coefficient of $z^{2}$ is $-5$.\n\nCheck: $(z^{2} - 2z + 5)(z - 3) = z^{3} - 5z^{2} + 11z - 15$, whose $z^{2}$ coefficient is $-5$.\n\n> **Watch out.** Include the conjugate root, and take minus the sum: the coefficient of $z^{2}$ in a monic cubic is the negative of the sum of its roots.",
        "取共轭不改变实多项式，所以它的非实根成共轭对出现。结合根与系数的关系，就能由一个复根和一个实根求出系数。例如，根为 $1 + 2i$ 和 3 的实系数首一三次多项式还有根 $1 - 2i$，所以根的和是 5，$z^{2}$ 的系数是 $-5$。\n\n检验：$(z^{2} - 2z + 5)(z - 3) = z^{3} - 5z^{2} + 11z - 15$，它的 $z^{2}$ 系数是 $-5$。\n\n> **注意。** 要包括共轭根，并取和的相反数：首一三次多项式中 $z^{2}$ 的系数是根之和的相反数。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(-9, 9);
          const q = rng.int(1, 9);
          const r = rng.int(-9, 9);
          const answer = -(2 * p + r);
          const misses: Miss[] = [
            [2 * p + r, "That is the sum of the roots; the coefficient is minus the sum.", "那是根的和；系数是和的相反数。"],
            [-(p + r), "That leaves out the conjugate root.", "那漏掉了共轭根。"],
            [-2 * p, "That leaves out the real root.", "那漏掉了实根。"],
          ];
          const quad = `z^{2}${plusTerm(-2 * p, "z")} + ${p * p + q * q}`;
          return worked(
            [
              `A real monic cubic has the roots $${gauss(p, q)}$ and ${r}. What is its coefficient of $z^{2}$?`,
              `实系数首一三次多项式有根 $${gauss(p, q)}$ 和 ${r}。它的 $z^{2}$ 系数是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Add the conjugate", "补上共轭根"],
                [`The coefficients are real, so $${gauss(p, q, -1)}$ is a root too.`, `系数是实数，所以 $${gauss(p, q, -1)}$ 也是根。`],
              ],
              [
                ["Sum the roots", "求根的和"],
                [
                  `The sum is $${2 * p}${plus(r)} = ${2 * p + r}$, and the coefficient of $z^{2}$ is minus it, ${answer}.`,
                  `和是 $${2 * p}${plus(r)} = ${2 * p + r}$，$z^{2}$ 的系数是它的相反数 ${answer}。`,
                ],
              ],
            ],
            [
              `The conjugate pair gives the factor $${quad}$, and in $(${quad})(${minus(r)})$ the coefficient of $z^{2}$ is $${paren(-r)} + ${paren(-2 * p)} = ${answer}$.`,
              `共轭对给出因子 $${quad}$，在 $(${quad})(${minus(r)})$ 中 $z^{2}$ 的系数是 $${paren(-r)} + ${paren(-2 * p)} = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const schwarzLemma = topic(
  "the-schwarz-lemma",
  ["The Schwarz Lemma", "施瓦茨引理"],
  ["Bound a disc map fixing the origin, and identify the maps that reach the bound.", "估计固定原点的圆盘映射，并找出达到界的映射。"],
  ["the-maximum-modulus-principle"],
  [],
  [
    point(
      "the-bound-on-the-unit-disc",
      ["The bound on the unit disc", "单位圆盘上的界"],
      [
        "If $f$ maps the unit disc to itself with $f(0) = 0$, then $|f(z)| \\le |z|$ everywhere. The proof applies the maximum modulus principle to $\\frac{f(z)}{z}$, whose singularity at the origin is removable. For example, such an $f$ has $\\left|f\\left(\\frac{1}{2}\\right)\\right| \\le \\frac{1}{2}$, and $f(z) = z$ reaches it.\n\nCheck: other maps of this kind stay below, as the lemma says: $f(z) = z^{2}$ gives $\\frac{1}{4}$ and $f(z) = \\frac{z}{2}$ gives $\\frac{1}{4}$, both less than $\\frac{1}{2}$.\n\n> **Watch out.** Without $f(0) = 0$ the bound fails: $f(z) = \\frac{z + 1}{2}$ maps the disc into itself and gives $\\frac{3}{4}$ at $\\frac{1}{2}$.",
        "如果 $f$ 把单位圆盘映到自身且 $f(0) = 0$，那么处处有 $|f(z)| \\le |z|$。证明是对 $\\frac{f(z)}{z}$ 用最大模原理，它在原点的奇点可去。例如，这样的 $f$ 满足 $\\left|f\\left(\\frac{1}{2}\\right)\\right| \\le \\frac{1}{2}$，而 $f(z) = z$ 达到它。\n\n检验：其他这类映射都在下面，正如引理所说：$f(z) = z^{2}$ 给出 $\\frac{1}{4}$，$f(z) = \\frac{z}{2}$ 给出 $\\frac{1}{4}$，都小于 $\\frac{1}{2}$。\n\n> **注意。** 没有 $f(0) = 0$ 这个界就不成立：$f(z) = \\frac{z + 1}{2}$ 把圆盘映到自身内，在 $\\frac{1}{2}$ 处给出 $\\frac{3}{4}$。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = fraction(rng, 30);
          const z = Q.of(p, q);
          const misses: Miss[] = [
            [
              1,
              "That uses only $|f| < 1$ and ignores $f(0) = 0$, which forces a smaller bound.",
              "那只用了 $|f| < 1$，忽略了 $f(0) = 0$，后者给出更小的界。",
            ],
            [
              Q.of(p * p, q * q),
              "That is the value of $z^{2}$, one map of this kind, not the largest possible value.",
              "那是 $z^{2}$ 的值，只是这类映射中的一个，不是最大可能值。",
            ],
            [Q.of(q - p, q), "That is the distance from the point to the boundary circle.", "那是这个点到边界圆的距离。"],
          ];
          return worked(
            [
              `$f$ is analytic with $|f(z)| < 1$ on the unit disc and $f(0) = 0$. What is the largest possible value of $\\left|f\\left(${z.toLatex()}\\right)\\right|$?`,
              `$f$ 在单位圆盘上解析，$|f(z)| < 1$，$f(0) = 0$。$\\left|f\\left(${z.toLatex()}\\right)\\right|$ 的最大可能值是多少？`,
            ],
            z,
            misses,
            [
              [
                ["Apply the lemma", "应用引理"],
                [
                  `$|f(z)| \\le |z|$, so $\\left|f\\left(${z.toLatex()}\\right)\\right| \\le ${z.toLatex()}$.`,
                  `$|f(z)| \\le |z|$，所以 $\\left|f\\left(${z.toLatex()}\\right)\\right| \\le ${z.toLatex()}$。`,
                ],
              ],
              [
                ["Reach the bound", "达到界"],
                [`$f(z) = z$ meets the conditions and gives exactly $${z.toLatex()}$.`, `$f(z) = z$ 满足条件，恰好给出 $${z.toLatex()}$。`],
              ],
            ],
            [
              `Another admissible map, $f(z) = z^{2}$, gives $${Q.of(p * p, q * q).toLatex()}$, below $${z.toLatex()}$, as the lemma requires.`,
              `另一个满足条件的映射 $f(z) = z^{2}$ 给出 $${Q.of(p * p, q * q).toLatex()}$，低于 $${z.toLatex()}$，符合引理。`,
            ],
          );
        }),
    ),
    point(
      "the-bound-after-rescaling",
      ["The bound after rescaling", "缩放后的界"],
      [
        "On a disc of radius $R$ with bound $M$, rescale both variables to reach the unit disc. The lemma then says $|f(z)| \\le \\frac{M|z|}{R}$, so the bound grows in proportion to the distance from the origin. For example, with $R = 4$ and $M = 6$, $|f(2)| \\le \\frac{6 \\cdot 2}{4} = 3$.\n\nCheck: $f(z) = \\frac{6}{4}z$ maps $|z| < 4$ into $|w| < 6$, fixes 0 and gives $f(2) = 3$, so the bound is reached.\n\n> **Watch out.** Divide by $R$ and multiply by $M$; the rescaled map is $g(w) = \\frac{f(Rw)}{M}$, not $\\frac{f(w)}{M}$.",
        "在半径为 $R$、界为 $M$ 的圆盘上，缩放两个变量得到单位圆盘。引理就给出 $|f(z)| \\le \\frac{M|z|}{R}$，所以界与到原点的距离成正比。例如，$R = 4$，$M = 6$ 时，$|f(2)| \\le \\frac{6 \\cdot 2}{4} = 3$。\n\n检验：$f(z) = \\frac{6}{4}z$ 把 $|z| < 4$ 映到 $|w| < 6$ 内，固定 0，并给出 $f(2) = 3$，所以界可以达到。\n\n> **注意。** 除以 $R$ 并乘以 $M$；缩放后的映射是 $g(w) = \\frac{f(Rw)}{M}$，不是 $\\frac{f(w)}{M}$。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(2, 25);
          const m = rng.int(2, 25);
          const z = rng.int(1, big - 1);
          const answer = Q.of(m * z, big);
          const misses: Miss[] = [
            [
              m,
              "That is the bound $M$ on the whole disc; $f(0) = 0$ gives a smaller bound near the center.",
              "那是整个圆盘上的界 $M$；$f(0) = 0$ 在圆心附近给出更小的界。",
            ],
            [Q.of(z, big), "That forgets to multiply by $M$.", "那忘了乘以 $M$。"],
            [Q.of(m, big), "That is the bound on $|f'(0)|$, not on $|f(z)|$.", "那是 $|f'(0)|$ 的界，不是 $|f(z)|$ 的界。"],
          ];
          return worked(
            [
              `$f$ is analytic on $|z| < ${big}$, with $|f(z)| < ${m}$ and $f(0) = 0$. What is the sharp upper bound of $|f(${z})|$?`,
              `$f$ 在 $|z| < ${big}$ 上解析，$|f(z)| < ${m}$，$f(0) = 0$。$|f(${z})|$ 的最佳上界是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Rescale", "缩放"],
                [
                  `$g(w) = \\frac{f(${big}w)}{${m}}$ maps the unit disc into itself and fixes 0, so $|g(w)| \\le |w|$.`,
                  `$g(w) = \\frac{f(${big}w)}{${m}}$ 把单位圆盘映到自身内且固定 0，所以 $|g(w)| \\le |w|$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `With $w = \\frac{${z}}{${big}}$, $|f(${z})| \\le \\frac{${m} \\cdot ${z}}{${big}} = ${answer.toLatex()}$.`,
                  `取 $w = \\frac{${z}}{${big}}$，$|f(${z})| \\le \\frac{${m} \\cdot ${z}}{${big}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The linear map $f(z) = ${m === big ? "" : `${Q.of(m, big).toLatex()} `}z$ fits the conditions and gives $f(${z}) = ${answer.toLatex()}$, so the bound is reached.`,
              `线性映射 $f(z) = ${m === big ? "" : `${Q.of(m, big).toLatex()} `}z$ 满足条件，给出 $f(${z}) = ${answer.toLatex()}$，所以界可以达到。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "the-derivative-at-the-origin",
        ["The derivative at the origin", "原点处的导数"],
        [
          "The lemma also bounds the derivative at the origin by $\\frac{M}{R}$, with equality only for a rotation times the scaling. This gives a rigidity result: a map reaching the bound is linear. In the drawing, $R = 2$ and $M = 1$ give $|f'(0)| \\le \\frac{1}{2}$, and $w = \\frac{z}{2}$ reaches it, sending the disc of radius 2 onto the disc of radius 1.\n\nCheck: Cauchy's estimate on circles of radius just below 2 gives the same bound, $|f'(0)| \\le \\frac{M}{R} = \\frac{1}{2}$.\n\n> **Watch out.** The bound is $\\frac{M}{R}$, not $\\frac{R}{M}$; and equality forces $f(z) = \\frac{M}{R}e^{i\\theta}z$ exactly, not merely somewhere.",
          "引理也给出原点处导数的界 $\\frac{M}{R}$，只有旋转乘缩放才能取等号。这是一个刚性结果：达到这个界的映射是线性的。图中 $R = 2$，$M = 1$，给出 $|f'(0)| \\le \\frac{1}{2}$，而 $w = \\frac{z}{2}$ 达到它，把半径 2 的圆盘映到半径 1 的圆盘。\n\n检验：在半径略小于 2 的圆上用柯西估计，得到同样的界 $|f'(0)| \\le \\frac{M}{R} = \\frac{1}{2}$。\n\n> **注意。** 界是 $\\frac{M}{R}$，不是 $\\frac{R}{M}$；取等号迫使 $f(z) = \\frac{M}{R}e^{i\\theta}z$ 处处成立，而不只是在某处。",
        ],
        (rng) =>
          until(() => {
            const big = rng.int(2, 25);
            const m = rng.int(2, 25);
            const asked = rng.bool();
            const ratio = Q.of(m, big);
            const lineCoeff = m === big ? "" : `${ratio.toLatex()} `;
            if (asked) {
              const misses: Miss[] = [
                [Q.of(big, m), "That turns the ratio upside down; the bound is $\\frac{M}{R}$.", "那把比值颠倒了；界是 $\\frac{M}{R}$。"],
                [m, "That is the bound on $|f|$, not on the derivative.", "那是 $|f|$ 的界，不是导数的界。"],
                [Q.of(1, big), "That forgets to multiply by $M$.", "那忘了乘以 $M$。"],
              ];
              return worked(
                [
                  `$f$ is analytic on $|z| < ${big}$, with $|f(z)| < ${m}$ and $f(0) = 0$. What is the sharp upper bound of $|f'(0)|$?`,
                  `$f$ 在 $|z| < ${big}$ 上解析，$|f(z)| < ${m}$，$f(0) = 0$。$|f'(0)|$ 的最佳上界是多少？`,
                ],
                ratio,
                misses,
                [
                  [
                    ["Rescale", "缩放"],
                    [
                      `$g(w) = \\frac{f(${big}w)}{${m}}$ satisfies the lemma, so $|g'(0)| \\le 1$.`,
                      `$g(w) = \\frac{f(${big}w)}{${m}}$ 满足引理，所以 $|g'(0)| \\le 1$。`,
                    ],
                  ],
                  [
                    ["Undo the scaling", "还原缩放"],
                    [
                      `$g'(0) = \\frac{${big}}{${m}} f'(0)$, so $|f'(0)| \\le \\frac{${m}}{${big}} = ${ratio.toLatex()}$.`,
                      `$g'(0) = \\frac{${big}}{${m}} f'(0)$，所以 $|f'(0)| \\le \\frac{${m}}{${big}} = ${ratio.toLatex()}$。`,
                    ],
                  ],
                ],
                [
                  `Cauchy's estimate on $|z| = r < ${big}$ gives $|f'(0)| \\le \\frac{${m}}{r}$, which tends to $${ratio.toLatex()}$ as $r$ approaches ${big}, and $f(z) = ${lineCoeff}z$ reaches it.`,
                  `在 $|z| = r < ${big}$ 上用柯西估计得 $|f'(0)| \\le \\frac{${m}}{r}$，当 $r$ 趋于 ${big} 时它趋于 $${ratio.toLatex()}$，而 $f(z) = ${lineCoeff}z$ 达到它。`,
                ],
              );
            }
            const misses: Miss[] = [
              [
                1,
                "That assumes $f(z) = z$; equality forces the slope $\\frac{M}{R}$.",
                "那假设 $f(z) = z$；取等号迫使斜率为 $\\frac{M}{R}$。",
              ],
              [m, "That is the bound on $|f|$, not the value at 1.", "那是 $|f|$ 的界，不是在 1 处的值。"],
              [Q.of(big, m), "That uses the reciprocal slope $\\frac{R}{M}$.", "那用了倒数斜率 $\\frac{R}{M}$。"],
            ];
            return worked(
              [
                `$f$ is analytic on $|z| < ${big}$, with $|f(z)| < ${m}$, $f(0) = 0$ and $f'(0) = ${ratio.toLatex()}$. What is $f(1)$?`,
                `$f$ 在 $|z| < ${big}$ 上解析，$|f(z)| < ${m}$，$f(0) = 0$，$f'(0) = ${ratio.toLatex()}$。$f(1)$ 是多少？`,
              ],
              ratio,
              misses,
              [
                [
                  ["Recognize equality", "识别取等号"],
                  [
                    `The bound on $|f'(0)|$ is $\\frac{${m}}{${big}}$, and here it is reached.`,
                    `$|f'(0)|$ 的界是 $\\frac{${m}}{${big}}$，这里恰好达到。`,
                  ],
                ],
                [
                  ["Use rigidity", "利用刚性"],
                  [
                    `Equality forces $f(z) = ${lineCoeff}z$, so $f(1) = ${ratio.toLatex()}$.`,
                    `取等号迫使 $f(z) = ${lineCoeff}z$，所以 $f(1) = ${ratio.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The bound $|f(z)| \\le \\frac{${m}|z|}{${big}}$ at $z = 1$ gives $|f(1)| \\le ${ratio.toLatex()}$, and this linear map meets it exactly.`,
                `界 $|f(z)| \\le \\frac{${m}|z|}{${big}}$ 在 $z = 1$ 处给出 $|f(1)| \\le ${ratio.toLatex()}$，这个线性映射恰好达到它。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-schwarz-lemma#the-derivative-at-the-origin"],
    },
  ],
);

const localMapping = topic(
  "the-local-behavior-of-analytic-maps",
  ["The Local Behavior of Analytic Maps", "解析映射的局部行为"],
  [
    "See how an analytic map wraps a neighborhood of a point, and why its images are open.",
    "看解析映射如何包裹一点的邻域，以及为什么它的像是开集。",
  ],
  ["zeros-of-analytic-functions"],
  [],
  [
    point(
      "counting-nearby-preimages",
      ["Counting nearby preimages", "数附近的原像"],
      [
        "If $f(z) - c$ has a zero of order $m$ at $a$, then each value near $c$ has exactly $m$ preimages near $a$. So $f$ wraps a small disc around $c$ exactly $m$ times. For example, $f(z) = 2 + 3(z - 1)^{4}$ has $f - 2 = 3(z - 1)^{4}$, a zero of order 4 at 1, so a value $w$ near 2 has 4 preimages near 1.\n\nCheck: solving $3(z - 1)^{4} = w - 2$ gives $z - 1$ as the four fourth roots of $\\frac{w - 2}{3}$, which are distinct when $w \\ne 2$.\n\n> **Watch out.** The order of the zero counts, not the coefficient in front; and the value $c$ itself has only the one preimage $a$, with multiplicity $m$.",
        "如果 $f(z) - c$ 在 $a$ 处有 $m$ 阶零点，那么 $c$ 附近的每个值在 $a$ 附近恰有 $m$ 个原像。所以 $f$ 把小圆盘绕 $c$ 恰好包裹 $m$ 次。例如，$f(z) = 2 + 3(z - 1)^{4}$ 满足 $f - 2 = 3(z - 1)^{4}$，在 1 处有 4 阶零点，所以 2 附近的值 $w$ 在 1 附近有 4 个原像。\n\n检验：解 $3(z - 1)^{4} = w - 2$，$z - 1$ 是 $\\frac{w - 2}{3}$ 的四个四次方根，当 $w \\ne 2$ 时它们互不相同。\n\n> **注意。** 起作用的是零点的阶，不是前面的系数；而值 $c$ 本身只有一个原像 $a$，重数为 $m$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-9, 9);
          const c = rng.int(-20, 20);
          const k = rng.int(2, 9);
          const m = rng.int(2, 9);
          const misses: Miss[] = [
            [
              1,
              "That is the count for the value $c$ itself, or for a point where $f' \\ne 0$.",
              "那是值 $c$ 本身的原像数，或 $f' \\ne 0$ 的点的原像数。",
            ],
            [k, "That counts the coefficient in front; the order of the zero decides.", "那数的是前面的系数；决定的是零点的阶。"],
            [
              m - 1,
              `That is the order of the zero of $f'$ at ${a}; the zero of $f${plus(-c)}$ has order one more.`,
              `那是 $f'$ 在 ${a} 处零点的阶；$f${plus(-c)}$ 的零点阶数多一。`,
            ],
          ];
          const f = `${c === 0 ? "" : `${c} + `}${k}${factor(a)}^{${m}}`;
          return worked(
            [
              `Let $f(z) = ${f}$. How many preimages near ${a} does a value very near ${c}, but not equal to it, have?`,
              `设 $f(z) = ${f}$。一个非常接近 ${c} 但不等于它的值，在 ${a} 附近有多少个原像？`,
            ],
            m,
            misses,
            [
              [
                ["Find the order", "求阶"],
                [
                  `$f(z)${plus(-c)} = ${k}${factor(a)}^{${m}}$ has a zero of order ${m} at ${a}.`,
                  `$f(z)${plus(-c)} = ${k}${factor(a)}^{${m}}$ 在 ${a} 处有 ${m} 阶零点。`,
                ],
              ],
              [
                ["Solve near the point", "在点附近求解"],
                [
                  `For $w$ near ${c}, $${factor(a)}^{${m}} = \\frac{w${plus(-c)}}{${k}}$ has ${m} distinct roots, one for each ${m}th root.`,
                  `对 ${c} 附近的 $w$，$${factor(a)}^{${m}} = \\frac{w${plus(-c)}}{${k}}$ 有 ${m} 个不同的根，每个 ${m} 次方根对应一个。`,
                ],
              ],
            ],
            [
              `The derivative $f'(z) = ${k * m}${factor(a)}${m === 2 ? "" : `^{${m - 1}}`}$ vanishes to order ${m - 1} at ${a}, so $f${plus(-c)}$ vanishes to order $${m - 1} + 1 = ${m}$.`,
              `导数 $f'(z) = ${k * m}${factor(a)}${m === 2 ? "" : `^{${m - 1}}`}$ 在 ${a} 处是 ${m - 1} 阶零点，所以 $f${plus(-c)}$ 的零点阶数是 $${m - 1} + 1 = ${m}$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "how-a-critical-point-changes-angles",
        ["How a critical point changes angles", "临界点如何改变角度"],
        [
          "Analytic maps preserve angles where the derivative is not zero. At a point where $f - f(a)$ has a zero of order $m$, angles between curves are instead multiplied by $m$. In the drawing, $m = 3$: two curves meeting at $a$ at the angle $\\frac{\\pi}{6}$ have images meeting at $f(a)$ at the angle $3 \\cdot \\frac{\\pi}{6} = \\frac{\\pi}{2}$.\n\nCheck: for $f(z) = z^{3}$, the point $re^{i\\theta}$ goes to $r^{3}e^{3i\\theta}$, so the rays at angles 0 and $\\frac{\\pi}{6}$ go to the rays at angles 0 and $\\frac{\\pi}{2}$.\n\n> **Watch out.** Multiply by the order of the zero of $f - f(a)$, which is one more than the order of the zero of $f'$.",
          "解析映射在导数不为零的地方保持角度。在 $f - f(a)$ 有 $m$ 阶零点的地方，曲线之间的夹角改为乘 $m$。图中 $m = 3$：在 $a$ 处以角 $\\frac{\\pi}{6}$ 相交的两条曲线，其像在 $f(a)$ 处以角 $3 \\cdot \\frac{\\pi}{6} = \\frac{\\pi}{2}$ 相交。\n\n检验：对 $f(z) = z^{3}$，点 $re^{i\\theta}$ 映到 $r^{3}e^{3i\\theta}$，所以辐角为 0 和 $\\frac{\\pi}{6}$ 的射线映到辐角为 0 和 $\\frac{\\pi}{2}$ 的射线。\n\n> **注意。** 乘的是 $f - f(a)$ 零点的阶，它比 $f'$ 零点的阶多一。",
        ],
        (rng) =>
          until(() => {
            const m = rng.int(2, 9);
            const q = rng.int(m + 1, 24);
            const p = rng.int(1, 3);
            const answer = Q.of(p * m, q);
            const misses: Miss[] = [
              [
                Q.of(p, q),
                "That keeps the angle, which happens only where $f' \\ne 0$; here $f'(0) = 0$.",
                "那保持了角度，这只在 $f' \\ne 0$ 处成立；这里 $f'(0) = 0$。",
              ],
              [Q.of(p, q * m), `That divides the angle by ${m} instead of multiplying.`, `那把角度除以 ${m}，而不是乘。`],
              [Q.of(p * (m - 1), q), `That multiplies by ${m - 1}, the order of the zero of $f'$.`, `那乘了 ${m - 1}，即 $f'$ 零点的阶。`],
            ];
            return worked(
              [
                `Two curves meet at the origin at the angle $${piFraction(p, q)}$. Under $f(z) = z^{${m}}$, their images meet at $k\\pi$. What is $k$?`,
                `两条曲线在原点相交，夹角为 $${piFraction(p, q)}$。在 $f(z) = z^{${m}}$ 下，它们的像的夹角是 $k\\pi$。$k$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Find the order", "求阶"],
                  [`$f(z) - f(0) = z^{${m}}$ has a zero of order ${m} at the origin.`, `$f(z) - f(0) = z^{${m}}$ 在原点有 ${m} 阶零点。`],
                ],
                [
                  ["Multiply the angle", "角度相乘"],
                  [
                    `$${m} \\cdot ${piFraction(p, q)} = ${piFraction(p * m, q)}$, so $k = ${answer.toLatex()}$.`,
                    `$${m} \\cdot ${piFraction(p, q)} = ${piFraction(p * m, q)}$，所以 $k = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `In polar form $re^{i\\theta}$ goes to $r^{${m}}e^{${m}i\\theta}$, so the rays at angles 0 and $${piFraction(p, q)}$ go to the rays at angles 0 and $${piFraction(p * m, q)}$.`,
                `用极坐标，$re^{i\\theta}$ 映到 $r^{${m}}e^{${m}i\\theta}$，所以辐角为 0 和 $${piFraction(p, q)}$ 的射线映到辐角为 0 和 $${piFraction(p * m, q)}$ 的射线。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-local-behavior-of-analytic-maps#how-a-critical-point-changes-angles"],
    },
    point(
      "the-open-mapping-theorem",
      ["The open mapping theorem", "开映射定理"],
      [
        "A nonconstant analytic function sends open sets to open sets. So its image on a disc cannot be a segment, a curve or a closed disc, and this also gives another proof of the maximum modulus principle. For example, $e^{z}$ sends the open strip $0 < \\operatorname{Re} z < 1$ onto the open annulus $1 < |w| < e$, an open set.\n\nCheck: a point $w$ of the closed disc $|w| \\le 2$ with $|w| = 2$ has points of size above 2 arbitrarily close to it, so no small disc around it stays inside, and the closed disc is not open.\n\n> **Watch out.** Open means every point has a small disc around it inside the set; segments, circles and closed discs all fail at some point.",
        "非常数解析函数把开集映成开集。所以它在圆盘上的像不可能是线段、曲线或闭圆盘，这也给出最大模原理的另一个证明。例如，$e^{z}$ 把开带形 $0 < \\operatorname{Re} z < 1$ 映到开圆环 $1 < |w| < e$，这是开集。\n\n检验：闭圆盘 $|w| \\le 2$ 中满足 $|w| = 2$ 的点 $w$，任意靠近处都有模大于 2 的点，所以它周围没有小圆盘留在集合内，闭圆盘不是开集。\n\n> **注意。** 开集是说每个点周围都有一个小圆盘在集合内；线段、圆和闭圆盘都在某些点不满足。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const b = a + rng.int(1, 30);
        const slips: Slip[] = [
          [
            same(`[${a}, ${b}]`),
            "A segment has no interior: no small disc around its points stays inside it.",
            "线段没有内点：它的点周围没有小圆盘留在线段内。",
          ],
          [
            same(`\\{z : |z| \\le ${b}\\}`),
            `The points with $|z| = ${b}$ have no small disc around them inside this set, so it is not open.`,
            `满足 $|z| = ${b}$ 的点周围没有小圆盘在这个集合内，所以它不是开集。`,
          ],
          [same(`\\{z : |z| = ${a}\\}`), "A circle is a curve with no interior, so it is not open.", "圆是没有内点的曲线，所以不是开集。"],
        ];
        return chosen(
          rng,
          [
            `Which set can be the image of the open unit disc under a nonconstant analytic function?`,
            `哪个集合可以是开单位圆盘在非常数解析函数下的像？`,
          ],
          same(`\\{z : ${a} < |z| < ${b}\\}`),
          slips,
          [
            [
              ["Apply the theorem", "应用定理"],
              [
                "The disc is open, so its image under a nonconstant analytic map must be open.",
                "圆盘是开集，所以它在非常数解析映射下的像必须是开集。",
              ],
            ],
            [
              ["Test each set", "逐个检验"],
              ["Only the open annulus has a small disc around each of its points.", "只有开圆环的每个点周围都有小圆盘在集合内。"],
            ],
          ],
          [
            `It really occurs: the disc maps conformally onto the strip $\\ln ${a} < \\operatorname{Re} w < \\ln ${b}$, and $e^{w}$ maps that strip onto the annulus $${a} < |z| < ${b}$.`,
            `这确实可以发生：圆盘可以共形映到带形 $\\ln ${a} < \\operatorname{Re} w < \\ln ${b}$，而 $e^{w}$ 把这个带形映到圆环 $${a} < |z| < ${b}$。`,
          ],
        );
      },
    ),
  ],
);

const identity = topic(
  "the-identity-theorem",
  ["The Identity Theorem", "恒等定理"],
  [
    "Use that an analytic function is determined by its values on any set with a limit point.",
    "利用解析函数由任何有极限点的集合上的值决定。",
  ],
  ["zeros-of-analytic-functions"],
  [],
  [
    point(
      "a-function-pinned-by-a-sequence",
      ["A function pinned by a sequence", "被数列确定的函数"],
      [
        "If two analytic functions agree on a sequence with a limit in the domain, their difference has a nonisolated zero, so it is identically zero. So a formula known along the sequence holds everywhere. For example, an entire $f$ with $f\\left(\\frac{1}{n}\\right) = \\frac{3}{n^{2}}$ agrees with $3z^{2}$ at the points $\\frac{1}{n}$, which tend to 0, so $f(z) = 3z^{2}$ and $f(2) = 12$.\n\nCheck: $g(z) = f(z) - 3z^{2}$ is entire and vanishes at every $\\frac{1}{n}$; by continuity $g(0) = 0$ too, and that zero is not isolated, so $g \\equiv 0$.\n\n> **Watch out.** Read off the formula in terms of $z = \\frac{1}{n}$: $\\frac{3}{n^{2}} = 3\\left(\\frac{1}{n}\\right)^{2}$, so the formula is $3z^{2}$, not $\\frac{3}{z^{2}}$.",
        "如果两个解析函数在极限属于区域的数列上相等，它们的差有不孤立的零点，所以恒为零。于是沿数列已知的公式处处成立。例如，整函数 $f$ 满足 $f\\left(\\frac{1}{n}\\right) = \\frac{3}{n^{2}}$，它在趋于 0 的点 $\\frac{1}{n}$ 上与 $3z^{2}$ 相等，所以 $f(z) = 3z^{2}$，$f(2) = 12$。\n\n检验：$g(z) = f(z) - 3z^{2}$ 是整函数，在每个 $\\frac{1}{n}$ 处为零；由连续性 $g(0) = 0$，而这个零点不孤立，所以 $g \\equiv 0$。\n\n> **注意。** 用 $z = \\frac{1}{n}$ 读出公式：$\\frac{3}{n^{2}} = 3\\left(\\frac{1}{n}\\right)^{2}$，所以公式是 $3z^{2}$，不是 $\\frac{3}{z^{2}}$。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(2, 12);
          const m = rng.int(2, 9);
          const p = rng.int(2, 3);
          const misses: Miss[] = [
            [k, "That is $f(1)$, the value at $n = 1$, not at the asked point.", "那是 $f(1)$，即 $n = 1$ 时的值，不是所问的点。"],
            [
              Q.of(k, m ** p),
              `That uses the formula $\\frac{${k}}{z^{${p}}}$, reading $n$ as $z$.`,
              `那用了公式 $\\frac{${k}}{z^{${p}}}$，把 $n$ 当成了 $z$。`,
            ],
            [k * m, `That drops the power ${p}.`, `那漏掉了 ${p} 次方。`],
          ];
          return worked(
            [
              `$f$ is entire, and $f\\left(\\frac{1}{n}\\right) = \\frac{${k}}{n^{${p}}}$ for every $n \\ge 1$. What is $f(${m})$?`,
              `$f$ 是整函数，对每个 $n \\ge 1$ 有 $f\\left(\\frac{1}{n}\\right) = \\frac{${k}}{n^{${p}}}$。$f(${m})$ 是多少？`,
            ],
            k * m ** p,
            misses,
            [
              [
                ["Guess the formula", "猜出公式"],
                [
                  `$\\frac{${k}}{n^{${p}}} = ${k}\\left(\\frac{1}{n}\\right)^{${p}}$, so $f$ agrees with $${k}z^{${p}}$ at the points $\\frac{1}{n}$.`,
                  `$\\frac{${k}}{n^{${p}}} = ${k}\\left(\\frac{1}{n}\\right)^{${p}}$，所以 $f$ 在点 $\\frac{1}{n}$ 上与 $${k}z^{${p}}$ 相等。`,
                ],
              ],
              [
                ["Apply the theorem", "应用定理"],
                [
                  `The points tend to 0, inside the plane, so $f(z) = ${k}z^{${p}}$ and $f(${m}) = ${k} \\cdot ${m}^{${p}} = ${k * m ** p}$.`,
                  `这些点趋于平面内的 0，所以 $f(z) = ${k}z^{${p}}$，$f(${m}) = ${k} \\cdot ${m}^{${p}} = ${k * m ** p}$。`,
                ],
              ],
            ],
            [
              `$g(z) = f(z) - ${k}z^{${p}}$ vanishes at every $\\frac{1}{n}$ and so at their limit 0, a zero that is not isolated, hence $g \\equiv 0$; at $n = 1$ both sides give ${k}, as they should.`,
              `$g(z) = f(z) - ${k}z^{${p}}$ 在每个 $\\frac{1}{n}$ 处为零，因而在极限 0 处也为零，这个零点不孤立，所以 $g \\equiv 0$；在 $n = 1$ 时两边都给出 ${k}，正应如此。`,
            ],
          );
        }),
    ),
    point(
      "where-the-zeros-accumulate",
      ["Where the zeros accumulate", "零点在哪里聚集"],
      [
        "The limit point must lie inside the domain. Zeros that pile up only on the boundary are allowed, so the condition must be checked for where the sequence tends, and finitely many zeros never force anything. For example, on the unit disc $\\sin\\left(\\frac{\\pi}{1 - z}\\right)$ vanishes at $1 - \\frac{1}{n}$ for every $n \\ge 2$, points that tend to 1 on the boundary, and it is not identically zero.\n\nCheck: at $z = 0$ it equals $\\sin \\pi = 0$, but at $z = \\frac{1}{3}$ it equals $\\sin \\frac{3\\pi}{2} = -1$, so it is indeed not zero everywhere.\n\n> **Watch out.** Zeros at $\\frac{1}{n}$ force $f \\equiv 0$ because 0 is inside the disc; zeros tending to a boundary point force nothing.",
        "极限点必须在区域内部。只在边界上聚集的零点是允许的，所以要检查数列趋于哪里，而有限个零点不能迫使任何结论。例如，在单位圆盘上，$\\sin\\left(\\frac{\\pi}{1 - z}\\right)$ 对每个 $n \\ge 2$ 在 $1 - \\frac{1}{n}$ 处为零，这些点趋于边界上的 1，而它并不恒为零。\n\n检验：在 $z = 0$ 处它等于 $\\sin \\pi = 0$，但在 $z = \\frac{1}{3}$ 处等于 $\\sin \\frac{3\\pi}{2} = -1$，所以确实不处处为零。\n\n> **注意。** 零点在 $\\frac{1}{n}$ 处迫使 $f \\equiv 0$，因为 0 在圆盘内部；趋于边界点的零点什么也迫使不了。",
      ],
      (rng) => {
        const k = rng.int(2, 30);
        const slips: Slip[] = [
          [
            same(`f\\left(1 - \\frac{1}{(n + ${k})^{2}}\\right) \\ne 0 \\text{ for all } n \\ge 1`),
            "Nonzero values never force $f$ to vanish; $f = 1$ satisfies this.",
            "非零的值不能迫使 $f$ 为零；$f = 1$ 就满足这个条件。",
          ],
          [
            same(`f\\left(\\frac{j}{${k + 1}}\\right) = 0 \\text{ for } j = 0, \\dots, ${k}`),
            "Finitely many zeros force nothing: the polynomial with exactly these roots is not identically 0.",
            "有限个零点什么也迫使不了：恰以这些点为根的多项式不恒为 0。",
          ],
          [
            same(`f(0) = f'(0) = \\dots = f^{(${k})}(0) = 0`),
            `Finitely many vanishing derivatives allow $f(z) = z^{${k + 1}}$.`,
            `有限个导数为零仍允许 $f(z) = z^{${k + 1}}$。`,
          ],
        ];
        return chosen(
          rng,
          [
            `$f$ is analytic on the open unit disc. Which condition forces $f$ to be identically 0?`,
            `$f$ 在开单位圆盘上解析。哪个条件迫使 $f$ 恒为 0？`,
          ],
          same(`f\\left(\\frac{1}{n + ${k}}\\right) = 0 \\text{ for all } n \\ge 1`),
          slips,
          [
            [
              ["Find the limit", "找极限"],
              [
                `The points $\\frac{1}{n + ${k}}$ are distinct and tend to 0, which lies inside the disc.`,
                `点 $\\frac{1}{n + ${k}}$ 互不相同且趋于 0，0 在圆盘内部。`,
              ],
            ],
            [
              ["Apply the theorem", "应用定理"],
              [
                "$f$ and the zero function agree on a set with a limit point in the domain, so $f \\equiv 0$.",
                "$f$ 与零函数在一个极限点属于区域的集合上相等，所以 $f \\equiv 0$。",
              ],
            ],
          ],
          [
            `Each other condition has a nonzero solution, $1$, $\\prod_{j=0}^{${k}} \\left(z - \\frac{j}{${k + 1}}\\right)$ or $z^{${k + 1}}$, while the zeros at $\\frac{1}{n + ${k}}$ also give $f(0) = 0$ with a zero that is not isolated.`,
            `其他每个条件都有非零的解：$1$、$\\prod_{j=0}^{${k}} \\left(z - \\frac{j}{${k + 1}}\\right)$ 或 $z^{${k + 1}}$；而 $\\frac{1}{n + ${k}}$ 处的零点还给出 $f(0) = 0$，且这个零点不孤立。`,
          ],
        );
      },
    ),
    point(
      "extending-from-the-real-line",
      ["Extending from the real line", "从实轴延拓"],
      [
        "Real identities extend to the complex plane, because the real line has limit points. So a function given by a formula for real $x$ takes the same formula at every complex number where it stays analytic. For example, an entire $f$ with $f(x) = 2x^{2} + 1$ for real $x$ has $f(3i) = 2(3i)^{2} + 1 = -18 + 1 = -17$.\n\nCheck: $g(z) = f(z) - (2z^{2} + 1)$ is entire and zero on the whole real axis, so $g \\equiv 0$; and $(3i)^{2} = 9i^{2} = -9$ confirms $2 \\cdot (-9) + 1 = -17$.\n\n> **Watch out.** $i^{2} = -1$, so the square of $mi$ is $-m^{2}$, and the sign of that term flips.",
        "实恒等式可以延拓到复平面，因为实轴有极限点。所以对实数 $x$ 由公式给出的函数，在保持解析的每个复数上都取同一公式。例如，整函数 $f$ 对实数 $x$ 满足 $f(x) = 2x^{2} + 1$，则 $f(3i) = 2(3i)^{2} + 1 = -18 + 1 = -17$。\n\n检验：$g(z) = f(z) - (2z^{2} + 1)$ 是整函数，在整条实轴上为零，所以 $g \\equiv 0$；而 $(3i)^{2} = 9i^{2} = -9$，确认 $2 \\cdot (-9) + 1 = -17$。\n\n> **注意。** $i^{2} = -1$，所以 $mi$ 的平方是 $-m^{2}$，这一项的符号翻转。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 9);
          const b = rng.int(-20, 20);
          const m = rng.int(1, 9);
          const answer = -a * m * m + b;
          const misses: Miss[] = [
            [
              a * m * m + b,
              `That takes $(${co(m, "i")})^{2} = ${m * m}$; it is $${-m * m}$.`,
              `那取 $(${co(m, "i")})^{2} = ${m * m}$；它是 $${-m * m}$。`,
            ],
            [-a * m * m, "That leaves out the constant term.", "那漏掉了常数项。"],
            [a * m + b, "That forgets to square.", "那忘了平方。"],
          ];
          return worked(
            [
              `$f$ is entire, and $f(x) = ${a}x^{2}${plus(b)}$ for all real $x$. What is $f(${co(m, "i")})$?`,
              `$f$ 是整函数，对所有实数 $x$ 有 $f(x) = ${a}x^{2}${plus(b)}$。$f(${co(m, "i")})$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Extend the formula", "延拓公式"],
                [
                  `$f(z) - (${a}z^{2}${plus(b)})$ is entire and vanishes on the real axis, so $f(z) = ${a}z^{2}${plus(b)}$ everywhere.`,
                  `$f(z) - (${a}z^{2}${plus(b)})$ 是整函数，在实轴上为零，所以处处有 $f(z) = ${a}z^{2}${plus(b)}$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `$(${co(m, "i")})^{2} = ${-m * m}$, so $f(${co(m, "i")}) = ${a} \\cdot (${-m * m})${plus(b)} = ${answer}$.`,
                  `$(${co(m, "i")})^{2} = ${-m * m}$，所以 $f(${co(m, "i")}) = ${a} \\cdot (${-m * m})${plus(b)} = ${answer}$。`,
                ],
              ],
            ],
            [
              `$f$ is real on the real axis, so $f(\\overline{z}) = \\overline{f(z)}$; here $f(${co(-m, "i")}) = ${answer}$ as well, a real number equal to its own conjugate, as it must be.`,
              `$f$ 在实轴上取实值，所以 $f(\\overline{z}) = \\overline{f(z)}$；这里 $f(${co(-m, "i")})$ 也是 ${answer}，是等于自身共轭的实数，正应如此。`,
            ],
          );
        }),
    ),
  ],
);

const reflection = topic(
  "the-schwarz-reflection-principle",
  ["The Schwarz Reflection Principle", "施瓦茨反射原理"],
  ["Extend a function across the real axis using its real boundary values.", "利用实边界值把函数延拓过实轴。"],
  ["the-identity-theorem"],
  [],
  [
    point(
      "the-value-at-the-mirror-point",
      ["The value at the mirror point", "镜像点的值"],
      [
        "If $f$ is analytic and real on a real interval, then $f(\\overline{z}) = \\overline{f(z)}$. So the value at the mirror point across the real axis is the conjugate of the value at the original point. For example, if such an $f$ has $f(1 + 2i) = 3 + 4i$, then $f(1 - 2i) = 3 - 4i$.\n\nCheck: $f(z) = z^{2} + 6$ is real on the real axis, and indeed $f(1 + 2i) = -3 + 4i + 6 = 3 + 4i$ while $f(1 - 2i) = -3 - 4i + 6 = 3 - 4i$.\n\n> **Watch out.** Conjugating keeps the real part and flips only the sign of the imaginary part.",
        "如果 $f$ 解析且在实区间上取实值，那么 $f(\\overline{z}) = \\overline{f(z)}$。所以关于实轴的镜像点的值是原来值的共轭。例如，若这样的 $f$ 满足 $f(1 + 2i) = 3 + 4i$，则 $f(1 - 2i) = 3 - 4i$。\n\n检验：$f(z) = z^{2} + 6$ 在实轴上取实值，确实 $f(1 + 2i) = -3 + 4i + 6 = 3 + 4i$，而 $f(1 - 2i) = -3 - 4i + 6 = 3 - 4i$。\n\n> **注意。** 取共轭保留实部，只翻转虚部的符号。",
      ],
      (rng) =>
        until(() => {
          const [a, b, c, d] = [rng.int(-9, 9), rng.int(1, 9), rng.int(-20, 20), rng.int(2, 20)];
          const real = rng.bool();
          const misses: Miss[] = real
            ? [
                [-c, "That negates the real part as well; conjugation keeps it.", "那把实部也取了相反数；取共轭保留实部。"],
                [d, "That gives the imaginary part of the original value.", "那给出的是原来值的虚部。"],
                [-d, "That gives the imaginary part of the mirror value, not the real part.", "那给出的是镜像值的虚部，不是实部。"],
              ]
            : [
                [d, "That forgets to conjugate: the imaginary part changes sign.", "那忘了取共轭：虚部要变号。"],
                [c, "That gives the real part, not the imaginary part.", "那给出的是实部，不是虚部。"],
                [-c, "That negates the real part and reports it as the imaginary part.", "那把实部取了相反数，当成了虚部。"],
              ];
          return worked(
            [
              `$f$ is entire and real on the real axis, and $f(${gauss(a, b)}) = ${gauss(c, d)}$. What is the ${real ? "real" : "imaginary"} part of $f(${gauss(a, b, -1)})$?`,
              `$f$ 是整函数且在实轴上取实值，$f(${gauss(a, b)}) = ${gauss(c, d)}$。$f(${gauss(a, b, -1)})$ 的${real ? "实" : "虚"}部是多少？`,
            ],
            real ? c : -d,
            misses,
            [
              [
                ["Recognize the mirror point", "认出镜像点"],
                [`$${gauss(a, b, -1)}$ is the conjugate of $${gauss(a, b)}$.`, `$${gauss(a, b, -1)}$ 是 $${gauss(a, b)}$ 的共轭。`],
              ],
              [
                ["Conjugate the value", "对值取共轭"],
                [
                  `$f(${gauss(a, b, -1)}) = \\overline{${gauss(c, d)}} = ${gauss(c, d, -1)}$, whose ${real ? "real" : "imaginary"} part is ${real ? c : -d}.`,
                  `$f(${gauss(a, b, -1)}) = \\overline{${gauss(c, d)}} = ${gauss(c, d, -1)}$，它的${real ? "实" : "虚"}部是 ${real ? c : -d}。`,
                ],
              ],
            ],
            [
              `The two values add to $${2 * c}$, a real number, and differ by $${co(2 * d, "i")}$, a purely imaginary one, as a number and its conjugate must.`,
              `两个值之和是实数 $${2 * c}$，之差是纯虚数 $${co(2 * d, "i")}$，正是一个数与其共轭应有的关系。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "which-function-reflects",
        ["Which function reflects", "哪个函数可以反射"],
        [
          "The principle needs real values on the real axis, which for a power series means real coefficients around a real center. A single nonreal coefficient breaks the symmetry between a point and its mirror image. In the drawing, $f(z) = z^{2} + 1$ sends $1 + i$ to $1 + 2i$ and the mirror point $1 - i$ to the mirror value $1 - 2i$.\n\nCheck: $(1 - i)^{2} + 1 = -2i + 1 = 1 - 2i$, the conjugate of $(1 + i)^{2} + 1 = 1 + 2i$.\n\n> **Watch out.** A function like $z + i$ is analytic but not real on the real axis, so it does not reflect: it sends 0 to $i$, not to a real number.",
          "这个原理要求在实轴上取实值，对幂级数来说就是以实点为中心的系数都是实数。只要有一个非实系数，就破坏了点与镜像点之间的对称。图中 $f(z) = z^{2} + 1$ 把 $1 + i$ 映到 $1 + 2i$，把镜像点 $1 - i$ 映到镜像值 $1 - 2i$。\n\n检验：$(1 - i)^{2} + 1 = -2i + 1 = 1 - 2i$，是 $(1 + i)^{2} + 1 = 1 + 2i$ 的共轭。\n\n> **注意。** 像 $z + i$ 这样的函数解析，但在实轴上不取实值，所以不能反射：它把 0 映到 $i$，不是实数。",
        ],
        (rng) => {
          const a = rng.int(2, 30);
          const b = rng.int(2, 30);
          const slips: Slip[] = [
            [
              same(`f(z) = z^{2} + ${a}iz + ${b}`),
              `The coefficient $${a}i$ is not real: $f(1) = ${1 + b} + ${a}i$.`,
              `系数 $${a}i$ 不是实数：$f(1) = ${1 + b} + ${a}i$。`,
            ],
            [same(`f(z) = ${a}z + ${b}i`), `$f(0) = ${b}i$ is not real.`, `$f(0) = ${b}i$ 不是实数。`],
            [same(`f(z) = e^{${a}iz}`), `$f(1) = \\cos ${a} + i\\sin ${a}$ is not real.`, `$f(1) = \\cos ${a} + i\\sin ${a}$ 不是实数。`],
          ];
          return chosen(
            rng,
            [
              `Which function satisfies $f(\\overline{z}) = \\overline{f(z)}$ for all $z$?`,
              `哪个函数对所有 $z$ 满足 $f(\\overline{z}) = \\overline{f(z)}$？`,
            ],
            same(`f(z) = z^{2} + ${a}z + ${b}`),
            slips,
            [
              [
                ["Look at the coefficients", "看系数"],
                [
                  `$z^{2} + ${a}z + ${b}$ has only real coefficients, so it is real on the real axis.`,
                  `$z^{2} + ${a}z + ${b}$ 只有实系数，所以在实轴上取实值。`,
                ],
              ],
              [
                ["Conjugate", "取共轭"],
                [
                  `$\\overline{f(z)} = \\overline{z}^{2} + ${a}\\overline{z} + ${b} = f(\\overline{z})$, because conjugation leaves real coefficients alone.`,
                  `$\\overline{f(z)} = \\overline{z}^{2} + ${a}\\overline{z} + ${b} = f(\\overline{z})$，因为取共轭不改变实系数。`,
                ],
              ],
            ],
            [
              `At $1 + i$ it gives $${a + b} + ${a + 2}i$ and at $1 - i$ it gives $${a + b} - ${a + 2}i$, a conjugate pair.`,
              `它在 $1 + i$ 处给出 $${a + b} + ${a + 2}i$，在 $1 - i$ 处给出 $${a + b} - ${a + 2}i$，是一对共轭。`,
            ],
          );
        },
      ),
      figure: complexDrawings2["the-schwarz-reflection-principle#which-function-reflects"],
    },
    {
      ...point(
        "the-reflected-function",
        ["The reflected function", "反射得到的函数"],
        [
          "For any analytic $f$, the function $g(z) = \\overline{f(\\overline{z})}$ is analytic too, and its power series has the conjugate coefficients. Then $f$ reflects exactly when $g$ equals $f$. In the drawing, $f(z) = iz$ at $z = 2 + i$: reflect to $2 - i$, apply $f$ to get $1 + 2i$, and reflect again to get $g(2 + i) = 1 - 2i$.\n\nCheck: the conjugate coefficient gives $g(z) = -iz$, and $-i(2 + i) = -2i + 1 = 1 - 2i$, the same value; since $g \\ne f$, this $f$ does not reflect.\n\n> **Watch out.** Conjugate the coefficients, not the variable: $g(z) = -iz$, not $i\\overline{z}$, which is not analytic.",
          "对任何解析的 $f$，函数 $g(z) = \\overline{f(\\overline{z})}$ 也解析，它的幂级数系数是共轭。而 $f$ 可以反射当且仅当 $g$ 等于 $f$。图中 $f(z) = iz$，$z = 2 + i$：反射到 $2 - i$，用 $f$ 得 $1 + 2i$，再反射得 $g(2 + i) = 1 - 2i$。\n\n检验：共轭系数给出 $g(z) = -iz$，而 $-i(2 + i) = -2i + 1 = 1 - 2i$，值相同；因为 $g \\ne f$，这个 $f$ 不能反射。\n\n> **注意。** 取共轭的是系数，不是变量：$g(z) = -iz$，不是 $i\\overline{z}$，后者不解析。",
        ],
        (rng) =>
          until(() => {
            const [a, b, c] = [rng.int(-9, 9), rng.int(1, 12), rng.int(-9, 9)];
            const m = rng.int(1, 9);
            const misses: Miss[] = [
              [b * m, "That forgets to conjugate the coefficient.", "那忘了对系数取共轭。"],
              [-b, `That forgets to multiply by $z = ${m}$.`, `那忘了乘以 $z = ${m}$。`],
              [a * m + c, "That is the real part, not the imaginary part.", "那是实部，不是虚部。"],
            ];
            return worked(
              [
                `Let $f(z) = (${gauss(a, b)})z${plus(c)}$ and $g(z) = \\overline{f(\\overline{z})}$. What is the imaginary part of $g(${m})$?`,
                `设 $f(z) = (${gauss(a, b)})z${plus(c)}$，$g(z) = \\overline{f(\\overline{z})}$。$g(${m})$ 的虚部是多少？`,
              ],
              -b * m,
              misses,
              [
                [
                  ["Conjugate the coefficients", "系数取共轭"],
                  [`$g(z) = (${gauss(a, b, -1)})z${plus(c)}$.`, `$g(z) = (${gauss(a, b, -1)})z${plus(c)}$。`],
                ],
                [
                  ["Evaluate", "求值"],
                  [
                    `$g(${m}) = ${complexName(a * m + c, -b * m)}$, whose imaginary part is ${-b * m}.`,
                    `$g(${m}) = ${complexName(a * m + c, -b * m)}$，它的虚部是 ${-b * m}。`,
                  ],
                ],
              ],
              [
                `By the definition, ${m} is its own mirror point, $f(${m}) = ${complexName(a * m + c, b * m)}$, and conjugating gives $${complexName(a * m + c, -b * m)}$ again.`,
                `按定义，${m} 是自己的镜像点，$f(${m}) = ${complexName(a * m + c, b * m)}$，取共轭仍得 $${complexName(a * m + c, -b * m)}$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-schwarz-reflection-principle#the-reflected-function"],
    },
  ],
);

const continuation = topic(
  "analytic-continuation",
  ["Analytic Continuation", "解析延拓"],
  [
    "Extend a function beyond the disc where its series converges, and meet branches that depend on the path.",
    "把函数延拓到级数收敛的圆盘之外，并认识依赖路径的分支。",
  ],
  ["the-identity-theorem"],
  [],
  [
    point(
      "continuing-a-geometric-series",
      ["Continuing a geometric series", "延拓几何级数"],
      [
        "The series $\\sum z^{n}$ converges only inside the unit disc, but the function $\\frac{1}{1 - z}$ agrees with it there and is analytic everywhere else except at 1. By the identity theorem this continuation is unique. For example, $2\\sum z^{n}$ continues to $\\frac{2}{1 - z}$, whose value at $z = 3$ is $\\frac{2}{1 - 3} = -1$, although the series diverges there.\n\nCheck: on the disc $(1 - z) \\cdot 2\\sum z^{n} = 2$, so the continuation $g$ satisfies $g(z)(1 - z) = 2$ everywhere, and $(-1)(1 - 3) = 2$.\n\n> **Watch out.** The denominator is $1 - z$, which is negative for $z > 1$; the continued value is negative even though every term of the series is positive.",
        "级数 $\\sum z^{n}$ 只在单位圆盘内收敛，但函数 $\\frac{1}{1 - z}$ 在那里与它相同，并且除 1 外处处解析。由恒等定理，这个延拓是唯一的。例如，$2\\sum z^{n}$ 延拓为 $\\frac{2}{1 - z}$，它在 $z = 3$ 处的值是 $\\frac{2}{1 - 3} = -1$，尽管级数在那里发散。\n\n检验：在圆盘上 $(1 - z) \\cdot 2\\sum z^{n} = 2$，所以延拓 $g$ 处处满足 $g(z)(1 - z) = 2$，而 $(-1)(1 - 3) = 2$。\n\n> **注意。** 分母是 $1 - z$，当 $z > 1$ 时为负；延拓的值是负的，尽管级数的每一项都是正的。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(2, 30);
          const k = rng.int(1, 12);
          const answer = Q.of(-k, m - 1);
          const misses: Miss[] = [
            [answer.neg(), "That uses $z - 1$ in the denominator; it is $1 - z$.", "那分母用了 $z - 1$；应是 $1 - z$。"],
            [Q.of(k, m + 1), "That uses $1 + z$ in the denominator.", "那分母用了 $1 + z$。"],
            [Q.of(-k, m), "That divides by $-z$ instead of $1 - z$.", "那除以 $-z$，而不是 $1 - z$。"],
          ];
          return worked(
            [
              `Let $f(z) = ${k === 1 ? "" : k}\\sum_{n \\ge 0} z^{n}$ on the unit disc. What is the analytic continuation of $f$ at $z = ${m}$?`,
              `在单位圆盘上设 $f(z) = ${k === 1 ? "" : k}\\sum_{n \\ge 0} z^{n}$。$f$ 的解析延拓在 $z = ${m}$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Sum the series", "求级数的和"],
                [
                  `On the disc, $f(z) = \\frac{${k}}{1 - z}$, which is analytic away from 1.`,
                  `在圆盘上 $f(z) = \\frac{${k}}{1 - z}$，它在 1 以外解析。`,
                ],
              ],
              [
                ["Evaluate the continuation", "计算延拓的值"],
                [`$\\frac{${k}}{1 - ${m}} = ${answer.toLatex()}$.`, `$\\frac{${k}}{1 - ${m}} = ${answer.toLatex()}$。`],
              ],
            ],
            [
              `The continuation $g$ satisfies $g(z)(1 - z) = ${k}$, because this holds on the disc; and $${answer.toLatex()} \\cdot (1 - ${m}) = ${k}$.`,
              `延拓 $g$ 满足 $g(z)(1 - z) = ${k}$，因为它在圆盘上成立；而 $${answer.toLatex()} \\cdot (1 - ${m}) = ${k}$。`,
            ],
          );
        }),
    ),
    point(
      "the-radius-from-the-nearest-singularity",
      ["The radius from the nearest singularity", "由最近奇点得到的半径"],
      [
        "A Taylor series at a point converges up to the nearest singularity of the function. So moving the center gives a different disc, and it can reach beyond the first one, which is how continuation is built. For example, $\\frac{1}{(z - 1)(z + 3)}$ about $z = 2$ has poles at distances 1 and 5, so its Taylor series there has radius 1.\n\nCheck: partial fractions write it as $\\frac{1}{4}\\left(\\frac{1}{z - 1} - \\frac{1}{z + 3}\\right)$, and the geometric series about 2 converge for $|z - 2| < 1$ and $|z - 2| < 5$; both hold only for $|z - 2| < 1$.\n\n> **Watch out.** Measure from the center of the series, not from the origin, and take the nearer pole, not the farther one.",
        "一点处的泰勒级数收敛到函数最近的奇点。所以移动中心就得到不同的圆盘，它可以超出第一个圆盘，延拓正是这样构造的。例如，$\\frac{1}{(z - 1)(z + 3)}$ 在 $z = 2$ 处展开，两个极点的距离是 1 和 5，所以那里的泰勒级数半径是 1。\n\n检验：部分分式写成 $\\frac{1}{4}\\left(\\frac{1}{z - 1} - \\frac{1}{z + 3}\\right)$，以 2 为中心的几何级数分别在 $|z - 2| < 1$ 和 $|z - 2| < 5$ 时收敛；两者同时成立只在 $|z - 2| < 1$ 时。\n\n> **注意。** 从级数的中心量距离，不是从原点；取较近的极点，不是较远的。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-20, 20);
          const b = a + rng.int(1, 20);
          const c = rng.int(-25, 25);
          if (c === a || c === b) return undefined;
          const near = Math.abs(c - a);
          const far = Math.abs(c - b);
          const r = Math.min(near, far);
          const misses: Miss[] = [
            [
              Math.max(near, far),
              "That is the distance to the farther pole; the nearer pole stops convergence first.",
              "那是到较远极点的距离；较近的极点先阻止收敛。",
            ],
            [Math.abs(c), "That measures from the origin, not from the center of the series.", "那是从原点量的，不是从级数的中心。"],
            [b - a, "That is the distance between the two poles.", "那是两个极点之间的距离。"],
          ];
          return worked(
            [
              `What is the radius of convergence of the Taylor series of $\\frac{1}{${factor(a)}${factor(b)}}$ at $z = ${c}$?`,
              `$\\frac{1}{${factor(a)}${factor(b)}}$ 在 $z = ${c}$ 处的泰勒级数的收敛半径是多少？`,
            ],
            r,
            misses,
            [
              [
                ["Locate the poles", "找极点"],
                [
                  `The poles are at ${a} and ${b}, at distances $|${c} - ${paren(a)}| = ${near}$ and $|${c} - ${paren(b)}| = ${far}$ from the center.`,
                  `极点在 ${a} 和 ${b}，到中心的距离是 $|${c} - ${paren(a)}| = ${near}$ 和 $|${c} - ${paren(b)}| = ${far}$。`,
                ],
              ],
              [
                ["Take the nearer", "取较近的"],
                [`The radius is the smaller distance, ${r}.`, `半径是较小的距离 ${r}。`],
              ],
            ],
            [
              `By partial fractions the function is $${b - a === 1 ? "" : `\\frac{1}{${b - a}}`}\\left(\\frac{1}{${minus(b)}} - \\frac{1}{${minus(a)}}\\right)$, and each piece expands about ${c} for distances below ${far} and ${near}; both hold up to ${r}.`,
              `由部分分式，函数是 $${b - a === 1 ? "" : `\\frac{1}{${b - a}}`}\\left(\\frac{1}{${minus(b)}} - \\frac{1}{${minus(a)}}\\right)$，每一项在距 ${c} 小于 ${far} 和 ${near} 时可以展开；两者同时成立到 ${r} 为止。`,
            ],
          );
        }),
    ),
    point(
      "continuing-a-logarithm-around-a-loop",
      ["Continuing a logarithm around a loop", "沿回路延拓对数"],
      [
        "Continuing the logarithm around the origin raises its imaginary part by $2\\pi$ each counterclockwise turn. So a function can return to the same point with a different value, and a branch is one consistent choice. For example, $3\\log z$ continued twice counterclockwise around the origin changes by $3 \\cdot 2 \\cdot 2\\pi i = 12\\pi i$.\n\nCheck: along $z = re^{i\\theta}$, $3\\log z = 3\\ln r + 3i\\theta$, and two turns raise $\\theta$ by $4\\pi$, which raises the value by $12\\pi i$.\n\n> **Watch out.** A clockwise turn lowers the argument, so the change is negative; and the factor in front multiplies the $2\\pi i$.",
        "沿原点延拓对数时，每逆时针一周它的虚部增加 $2\\pi$。所以函数回到同一点可以有不同的值，分支就是一种一致的选择。例如，$3\\log z$ 沿原点逆时针延拓两周，变化 $3 \\cdot 2 \\cdot 2\\pi i = 12\\pi i$。\n\n检验：沿 $z = re^{i\\theta}$，$3\\log z = 3\\ln r + 3i\\theta$，两周使 $\\theta$ 增加 $4\\pi$，值增加 $12\\pi i$。\n\n> **注意。** 顺时针一周使辐角减小，所以变化是负的；前面的系数要乘 $2\\pi i$。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(1, 15);
          const c = rng.int(2, 9);
          const r = rng.int(2, 30);
          const clockwise = rng.bool();
          const s = clockwise ? -1 : 1;
          const answer = s * 2 * c * k;
          const misses: Miss[] = [
            [-answer, "That has the direction reversed.", "那把方向弄反了。"],
            [s * c * k, "That uses $\\pi i$ per turn; each turn adds $2\\pi i$.", "那每周用了 $\\pi i$；每周增加 $2\\pi i$。"],
            [s * 2 * k, `That leaves out the factor ${c}.`, `那漏掉了系数 ${c}。`],
          ];
          return worked(
            [
              `Start with $${c} \\log z$ at $z = ${r}$, and continue it ${k} ${k === 1 ? "time" : "times"} ${clockwise ? "clockwise" : "counterclockwise"} around the origin. The value changes by $m\\pi i$. What is $m$?`,
              `从 $z = ${r}$ 处的 $${c} \\log z$ 开始，沿原点${clockwise ? "顺时针" : "逆时针"}延拓 ${k} 周。值变化了 $m\\pi i$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Change per turn", "每周的变化"],
                [
                  `Each ${clockwise ? "clockwise" : "counterclockwise"} turn changes $\\log z$ by $${clockwise ? "-" : ""}2\\pi i$.`,
                  `每${clockwise ? "顺时针" : "逆时针"}一周，$\\log z$ 变化 $${clockwise ? "-" : ""}2\\pi i$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${c} \\cdot ${k} \\cdot (${s * 2}\\pi i) = ${answer}\\pi i$, so $m = ${answer}$.`,
                  `$${c} \\cdot ${k} \\cdot (${s * 2}\\pi i) = ${answer}\\pi i$，所以 $m = ${answer}$。`,
                ],
              ],
            ],
            [
              `Along $z = ${r}e^{i\\theta}$, $${c}\\log z = ${c}\\ln ${r} + ${c}i\\theta$, and $\\theta$ changes by $${s * 2 * k}\\pi$, so the value changes by $${c} \\cdot (${s * 2 * k}\\pi i) = ${answer}\\pi i$.`,
              `沿 $z = ${r}e^{i\\theta}$，$${c}\\log z = ${c}\\ln ${r} + ${c}i\\theta$，$\\theta$ 变化 $${s * 2 * k}\\pi$，所以值变化 $${c} \\cdot (${s * 2 * k}\\pi i) = ${answer}\\pi i$。`,
            ],
          );
        }),
    ),
  ],
);

const gamma = topic(
  "the-gamma-function-in-the-complex-plane",
  ["The Gamma Function in the Complex Plane", "复平面上的伽马函数"],
  ["Continue the Gamma function to the left, and read its poles and reflection formula.", "把伽马函数向左延拓，并读出它的极点和反射公式。"],
  ["the-gamma-function", "analytic-continuation", "computing-residues"],
  [],
  [
    point(
      "stepping-with-the-recurrence",
      ["Stepping with the recurrence", "用递推走步"],
      [
        "The integral for Gamma converges only for positive real part, but $\\Gamma(z + 1) = z\\Gamma(z)$ continues it. Rewriting as $\\Gamma(z) = \\frac{\\Gamma(z + 1)}{z}$ steps to the left one unit at a time. For example, $\\Gamma\\left(-\\frac{1}{2}\\right) = \\frac{\\Gamma\\left(\\frac{1}{2}\\right)}{-\\frac{1}{2}} = -2\\Gamma\\left(\\frac{1}{2}\\right)$ and $\\Gamma\\left(-\\frac{3}{2}\\right) = \\frac{-2\\Gamma\\left(\\frac{1}{2}\\right)}{-\\frac{3}{2}} = \\frac{4}{3}\\Gamma\\left(\\frac{1}{2}\\right)$.\n\nCheck: step back to the right by multiplying: $-\\frac{3}{2} \\cdot \\frac{4}{3} = -2$ and $-\\frac{1}{2} \\cdot (-2) = 1$, which returns to $\\Gamma\\left(\\frac{1}{2}\\right)$.\n\n> **Watch out.** Stepping left divides by the new argument $z$, which is negative; stepping right multiplies by the old one.",
        "伽马函数的积分只在实部为正时收敛，但 $\\Gamma(z + 1) = z\\Gamma(z)$ 可以延拓它。改写成 $\\Gamma(z) = \\frac{\\Gamma(z + 1)}{z}$，就能每次向左走一步。例如，$\\Gamma\\left(-\\frac{1}{2}\\right) = \\frac{\\Gamma\\left(\\frac{1}{2}\\right)}{-\\frac{1}{2}} = -2\\Gamma\\left(\\frac{1}{2}\\right)$，$\\Gamma\\left(-\\frac{3}{2}\\right) = \\frac{-2\\Gamma\\left(\\frac{1}{2}\\right)}{-\\frac{3}{2}} = \\frac{4}{3}\\Gamma\\left(\\frac{1}{2}\\right)$。\n\n检验：向右走回去，用乘法：$-\\frac{3}{2} \\cdot \\frac{4}{3} = -2$，$-\\frac{1}{2} \\cdot (-2) = 1$，回到 $\\Gamma\\left(\\frac{1}{2}\\right)$。\n\n> **注意。** 向左走要除以新的自变量 $z$，它是负的；向右走要乘以原来的自变量。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(1, 5);
          const k = rng.int(1, 12);
          const left = rng.bool();
          const factors = Array.from({ length: m }, (_, i) => Q.of(left ? -(2 * i + 1) : 2 * i + 1, 2));
          const product = factors.reduce((p, f) => p.mul(f), Q.of(1));
          const answer = left ? Q.of(k).div(product) : Q.of(k).mul(product);
          const shorter = factors.slice(0, m - 1).reduce((p, f) => p.mul(f), Q.of(1));
          const list = factors.map((f) => f.toLatex()).join(", ");
          const misses: Miss[] = left
            ? [
                [answer.neg(), "That loses the signs: each step divides by a negative number.", "那丢了符号：每一步都除以一个负数。"],
                [Q.of(k).mul(product), "That multiplies by the arguments instead of dividing.", "那乘了自变量，而不是除。"],
                [
                  Q.of(k).div(shorter),
                  `That takes ${m - 1} steps; reaching $\\frac{1}{2} - ${m}$ takes ${m}.`,
                  `那只走了 ${m - 1} 步；到达 $\\frac{1}{2} - ${m}$ 要走 ${m} 步。`,
                ],
              ]
            : [
                [Q.of(k).div(product), "That divides by the arguments instead of multiplying.", "那除以了自变量，而不是乘。"],
                [
                  Q.of(k).mul(shorter),
                  `That takes ${m - 1} steps; reaching $\\frac{1}{2} + ${m}$ takes ${m}.`,
                  `那只走了 ${m - 1} 步；到达 $\\frac{1}{2} + ${m}$ 要走 ${m} 步。`,
                ],
                [
                  Q.of(k)
                    .mul(product)
                    .mul(Q.of(2 * m + 1, 1)),
                  `That multiplies by $\\frac{1}{2} + ${m}$ as well; the last factor is $${factors[m - 1]?.toLatex()}$.`,
                  `那还乘了 $\\frac{1}{2} + ${m}$；最后一个因子是 $${factors[m - 1]?.toLatex()}$。`,
                ],
              ];
          const kk = k === 1 ? "" : `${k} \\cdot `;
          return worked(
            [
              `Evaluate $${kk}\\frac{\\Gamma\\left(\\frac{1}{2} ${left ? "-" : "+"} ${m}\\right)}{\\Gamma\\left(\\frac{1}{2}\\right)}$.`,
              `计算 $${kk}\\frac{\\Gamma\\left(\\frac{1}{2} ${left ? "-" : "+"} ${m}\\right)}{\\Gamma\\left(\\frac{1}{2}\\right)}$。`,
            ],
            answer,
            misses,
            [
              [
                ["List the steps", "列出各步"],
                [
                  left
                    ? `Going left from $\\frac{1}{2}$, divide in turn by the new arguments $${list}$.`
                    : `Going right from $\\frac{1}{2}$, multiply in turn by the arguments $${list}$.`,
                  left
                    ? `从 $\\frac{1}{2}$ 向左走，依次除以新的自变量 $${list}$。`
                    : `从 $\\frac{1}{2}$ 向右走，依次乘以自变量 $${list}$。`,
                ],
              ],
              [
                ["Combine", "合并"],
                [
                  `Their product is $${product.toLatex()}$, so the value is $${k} ${left ? "\\div" : "\\cdot"} ${left && product.sign() < 0 ? `\\left(${product.toLatex()}\\right)` : product.toLatex()} = ${answer.toLatex()}$.`,
                  `它们的积是 $${product.toLatex()}$，所以值是 $${k} ${left ? "\\div" : "\\cdot"} ${left && product.sign() < 0 ? `\\left(${product.toLatex()}\\right)` : product.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            left
              ? [
                  `Stepping back to the right multiplies by the same arguments: $${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} \\cdot ${product.sign() < 0 ? `\\left(${product.toLatex()}\\right)` : product.toLatex()} = ${k}$, the starting value.`,
                  `向右走回去要乘同样的自变量：$${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} \\cdot ${product.sign() < 0 ? `\\left(${product.toLatex()}\\right)` : product.toLatex()} = ${k}$，即起始值。`,
                ]
              : [
                  `Stepping back to the left divides by the same arguments: $${answer.toLatex()} \\div ${product.toLatex()} = ${k}$, the starting value.`,
                  `向左走回去要除以同样的自变量：$${answer.toLatex()} \\div ${product.toLatex()} = ${k}$，即起始值。`,
                ],
          );
        }),
    ),
    point(
      "residues-at-the-poles",
      ["Residues at the poles", "极点处的留数"],
      [
        "The Gamma function has simple poles at 0 and the negative integers. Stepping from the pole at 0 gives the residue at $-n$ as $\\frac{(-1)^{n}}{n!}$, which shrinks quickly and alternates in sign. For example, the residue at $-3$ is $\\frac{(-1)^{3}}{3!} = -\\frac{1}{6}$.\n\nCheck: $\\Gamma(z) = \\frac{\\Gamma(z + 4)}{z(z + 1)(z + 2)(z + 3)}$, and near $-3$ the numerator tends to $\\Gamma(1) = 1$ while $z(z + 1)(z + 2)$ tends to $(-3)(-2)(-1) = -6$, so the residue is $-\\frac{1}{6}$.\n\n> **Watch out.** The factorial is $n!$, not $(n + 1)!$, and the sign alternates: odd $n$ gives a negative residue.",
        "伽马函数在 0 和负整数处有单极点。从 0 处的极点走步，得到 $-n$ 处的留数是 $\\frac{(-1)^{n}}{n!}$，它很快变小并交替变号。例如，$-3$ 处的留数是 $\\frac{(-1)^{3}}{3!} = -\\frac{1}{6}$。\n\n检验：$\\Gamma(z) = \\frac{\\Gamma(z + 4)}{z(z + 1)(z + 2)(z + 3)}$，在 $-3$ 附近分子趋于 $\\Gamma(1) = 1$，而 $z(z + 1)(z + 2)$ 趋于 $(-3)(-2)(-1) = -6$，所以留数是 $-\\frac{1}{6}$。\n\n> **注意。** 阶乘是 $n!$，不是 $(n + 1)!$；符号交替：$n$ 为奇数时留数为负。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(0, 8);
          const k = rng.int(1, 6);
          const fact = factorial(n);
          const sign = n % 2 === 0 ? 1 : -1;
          const answer = Q.of(sign * k, fact);
          const misses: Miss[] = [
            [answer.neg(), "That loses the sign $(-1)^{n}$.", "那丢了符号 $(-1)^{n}$。"],
            [Q.of(sign * k, fact * (n + 1)), "That uses $(n + 1)!$ in place of $n!$.", "那用了 $(n + 1)!$ 代替 $n!$。"],
            [0, "That treats the point as removable; Gamma has a simple pole there.", "那把这个点当成可去奇点；伽马函数在那里有单极点。"],
          ];
          const pole = n === 0 ? "0" : String(-n);
          const near = Array.from({ length: n }, (_, i) => `(${i - n})`).join("");
          return worked(
            [
              `What is the residue of $${k === 1 ? "" : k}\\Gamma(z)$ at $z = ${pole}$?`,
              `$${k === 1 ? "" : k}\\Gamma(z)$ 在 $z = ${pole}$ 处的留数是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Use the formula", "用公式"],
                [
                  `The residue of $\\Gamma$ at $-n$ is $\\frac{(-1)^{n}}{n!}$, here $${n >= 2 ? `\\frac{(-1)^{${n}}}{${n}!}` : n === 1 ? "\\frac{-1}{1!}" : "\\frac{1}{0!}"} = ${Q.of(sign, fact).toLatex()}$.`,
                  `$\\Gamma$ 在 $-n$ 处的留数是 $\\frac{(-1)^{n}}{n!}$，这里是 $${n >= 2 ? `\\frac{(-1)^{${n}}}{${n}!}` : n === 1 ? "\\frac{-1}{1!}" : "\\frac{1}{0!}"} = ${Q.of(sign, fact).toLatex()}$。`,
                ],
              ],
              [
                ["Carry the constant", "乘上常数"],
                [
                  `A constant factor carries through: $${k} \\cdot ${Q.of(sign, fact).sign() < 0 ? `\\left(${Q.of(sign, fact).toLatex()}\\right)` : Q.of(sign, fact).toLatex()} = ${answer.toLatex()}$.`,
                  `常数因子照乘：$${k} \\cdot ${Q.of(sign, fact).sign() < 0 ? `\\left(${Q.of(sign, fact).toLatex()}\\right)` : Q.of(sign, fact).toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            n === 0
              ? [
                  "Near 0, $\\Gamma(z) = \\frac{\\Gamma(z + 1)}{z}$ and $\\Gamma(z + 1) \\to 1$, so the residue of $\\Gamma$ is 1.",
                  "在 0 附近，$\\Gamma(z) = \\frac{\\Gamma(z + 1)}{z}$，而 $\\Gamma(z + 1) \\to 1$，所以 $\\Gamma$ 的留数是 1。",
                ]
              : [
                  `$\\Gamma(z) = \\frac{\\Gamma(z + ${n + 1})}{z(z + 1)\\cdots(z + ${n})}$; near $${-n}$ the numerator tends to 1 and the other factors tend to $${near} = ${sign * fact}$, so the residue of $\\Gamma$ is $${Q.of(sign, fact).toLatex()}$.`,
                  `$\\Gamma(z) = \\frac{\\Gamma(z + ${n + 1})}{z(z + 1)\\cdots(z + ${n})}$；在 $${-n}$ 附近分子趋于 1，其余因子趋于 $${near} = ${sign * fact}$，所以 $\\Gamma$ 的留数是 $${Q.of(sign, fact).toLatex()}$。`,
                ],
          );
        }),
    ),
    {
      ...point(
        "the-reflection-formula",
        ["The reflection formula", "反射公式"],
        [
          "The product $\\Gamma(z)\\Gamma(1 - z)$ equals $\\frac{\\pi}{\\sin(\\pi z)}$. Both sides have simple poles at all the integers, and at $z = \\frac{1}{2}$ this gives the value $\\sqrt{\\pi}$ for $\\Gamma\\left(\\frac{1}{2}\\right)$. The drawing graphs $\\frac{\\pi}{\\sin(\\pi x)}$: at $x = \\frac{1}{2}$ its height is $\\pi$, so $\\Gamma\\left(\\frac{1}{2}\\right)^{2} = \\pi$.\n\nCheck: the Gaussian integral gives $\\Gamma\\left(\\frac{1}{2}\\right) = \\int_{0}^{\\infty} t^{-1/2} e^{-t}\\, dt = \\sqrt{\\pi}$ directly, and $\\sqrt{\\pi} \\cdot \\sqrt{\\pi} = \\pi$.\n\n> **Watch out.** Divide $\\pi$ by $\\sin(\\pi z)$; with $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$ the product is $2\\pi$, larger than $\\pi$, not smaller.",
          "乘积 $\\Gamma(z)\\Gamma(1 - z)$ 等于 $\\frac{\\pi}{\\sin(\\pi z)}$。两边在所有整数处都有单极点，在 $z = \\frac{1}{2}$ 处这给出 $\\Gamma\\left(\\frac{1}{2}\\right)$ 的值 $\\sqrt{\\pi}$。图中画出 $\\frac{\\pi}{\\sin(\\pi x)}$：在 $x = \\frac{1}{2}$ 处高度为 $\\pi$，所以 $\\Gamma\\left(\\frac{1}{2}\\right)^{2} = \\pi$。\n\n检验：高斯积分直接给出 $\\Gamma\\left(\\frac{1}{2}\\right) = \\int_{0}^{\\infty} t^{-1/2} e^{-t}\\, dt = \\sqrt{\\pi}$，而 $\\sqrt{\\pi} \\cdot \\sqrt{\\pi} = \\pi$。\n\n> **注意。** 用 $\\pi$ 除以 $\\sin(\\pi z)$；由 $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$，乘积是 $2\\pi$，比 $\\pi$ 大，不是小。",
        ],
        (rng) =>
          until(() => {
            const k = rng.int(1, 15);
            const [z, w, s] = rng.pick([
              ["\\frac{1}{2}", "\\frac{1}{2}", 1],
              ["\\frac{1}{6}", "\\frac{5}{6}", 2],
              ["\\frac{5}{6}", "\\frac{1}{6}", 2],
            ] as [string, string, number][]);
            const sine = s === 1 ? "1" : "\\frac{1}{2}";
            const misses: Miss[] =
              s === 1
                ? [
                    [
                      2 * k,
                      "That uses $\\frac{2\\pi}{\\sin(\\pi z)}$; the formula has $\\pi$ alone on top.",
                      "那用了 $\\frac{2\\pi}{\\sin(\\pi z)}$；公式分子只有 $\\pi$。",
                    ],
                    [
                      Q.of(k, 2),
                      "That multiplies by the $\\frac{1}{2}$ in the argument instead of using $\\sin\\frac{\\pi}{2} = 1$.",
                      "那乘了自变量里的 $\\frac{1}{2}$，而不是用 $\\sin\\frac{\\pi}{2} = 1$。",
                    ],
                  ]
                : [
                    [
                      k,
                      "That takes $\\sin\\frac{\\pi}{6}$ to be 1; it is $\\frac{1}{2}$.",
                      "那把 $\\sin\\frac{\\pi}{6}$ 当成 1；它是 $\\frac{1}{2}$。",
                    ],
                    [
                      Q.of(k, 2),
                      "That multiplies by $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$ instead of dividing.",
                      "那乘了 $\\sin\\frac{\\pi}{6} = \\frac{1}{2}$，而不是除。",
                    ],
                    [
                      4 * k,
                      "That uses $\\frac{2\\pi}{\\sin(\\pi z)}$; the formula has $\\pi$ alone on top.",
                      "那用了 $\\frac{2\\pi}{\\sin(\\pi z)}$；公式分子只有 $\\pi$。",
                    ],
                  ];
            return worked(
              [
                `$${k === 1 ? "" : k}\\Gamma\\left(${z}\\right)\\Gamma\\left(${w}\\right) = m\\pi$. What is $m$?`,
                `$${k === 1 ? "" : k}\\Gamma\\left(${z}\\right)\\Gamma\\left(${w}\\right) = m\\pi$。$m$ 是多少？`,
              ],
              k * s,
              misses,
              [
                [
                  ["Match the formula", "对应公式"],
                  [
                    `$${w} = 1 - ${z}$, so the product is $\\frac{\\pi}{\\sin\\left(${z}\\pi\\right)}$.`,
                    `$${w} = 1 - ${z}$，所以乘积是 $\\frac{\\pi}{\\sin\\left(${z}\\pi\\right)}$。`,
                  ],
                ],
                [
                  ["Evaluate the sine", "求正弦"],
                  [
                    `$\\sin\\left(${z}\\pi\\right) = ${sine}$, so the product is $${s === 1 ? "\\pi" : "2\\pi"}$ and $m = ${k} \\cdot ${s} = ${k * s}$.`,
                    `$\\sin\\left(${z}\\pi\\right) = ${sine}$，所以乘积是 $${s === 1 ? "\\pi" : "2\\pi"}$，$m = ${k} \\cdot ${s} = ${k * s}$。`,
                  ],
                ],
              ],
              s === 1
                ? [
                    `$\\Gamma\\left(\\frac{1}{2}\\right) = \\sqrt{\\pi}$ from the Gaussian integral, so $${k} \\cdot \\sqrt{\\pi} \\cdot \\sqrt{\\pi} = ${k}\\pi$.`,
                    `由高斯积分 $\\Gamma\\left(\\frac{1}{2}\\right) = \\sqrt{\\pi}$，所以 $${k} \\cdot \\sqrt{\\pi} \\cdot \\sqrt{\\pi} = ${k}\\pi$。`,
                  ]
                : [
                    `Taking $z = ${w}$ instead gives the same product, and $\\sin\\left(${w}\\pi\\right) = \\frac{1}{2}$ as well, so again $m = ${k * s}$.`,
                    `改取 $z = ${w}$ 得到同一个乘积，而 $\\sin\\left(${w}\\pi\\right)$ 也是 $\\frac{1}{2}$，所以仍有 $m = ${k * s}$。`,
                  ],
            );
          }),
      ),
      figure: complexDrawings2["the-gamma-function-in-the-complex-plane#the-reflection-formula"],
    },
  ],
);

const sineProduct = topic(
  "the-product-formula-for-sine",
  ["The Product Formula for Sine", "正弦的乘积公式"],
  ["Write an entire function as a product over its zeros, as a polynomial is.", "像多项式那样，把整函数写成对其零点的乘积。"],
  ["zeros-of-analytic-functions"],
  [],
  [
    point(
      "a-partial-product",
      ["A partial product", "部分积"],
      [
        "Euler's formula is $\\sin(\\pi z) = \\pi z \\prod_{n \\ge 1} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$. Each factor removes a pair of zeros at $\\pm n$, and partial products at simple fractions are ordinary rational arithmetic. For example, at $z = \\frac{1}{2}$ the first two factors are $1 - \\frac{1}{4} = \\frac{3}{4}$ and $1 - \\frac{1}{16} = \\frac{15}{16}$, with product $\\frac{45}{64}$.\n\nCheck: split each factor as $\\left(1 - \\frac{z}{n}\\right)\\left(1 + \\frac{z}{n}\\right)$: $\\frac{1}{2} \\cdot \\frac{3}{2} = \\frac{3}{4}$ and $\\frac{3}{4} \\cdot \\frac{5}{4} = \\frac{15}{16}$, the same factors.\n\n> **Watch out.** The factor has $\\frac{z^{2}}{n^{2}}$, so at $z = \\frac{1}{m}$ it is $1 - \\frac{1}{m^{2}n^{2}}$, not $1 - \\frac{1}{mn}$.",
        "欧拉公式是 $\\sin(\\pi z) = \\pi z \\prod_{n \\ge 1} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$。每个因子给出一对零点 $\\pm n$，在简单分数处的部分积就是普通的有理数运算。例如，在 $z = \\frac{1}{2}$ 处前两个因子是 $1 - \\frac{1}{4} = \\frac{3}{4}$ 和 $1 - \\frac{1}{16} = \\frac{15}{16}$，乘积是 $\\frac{45}{64}$。\n\n检验：把每个因子拆成 $\\left(1 - \\frac{z}{n}\\right)\\left(1 + \\frac{z}{n}\\right)$：$\\frac{1}{2} \\cdot \\frac{3}{2} = \\frac{3}{4}$，$\\frac{3}{4} \\cdot \\frac{5}{4} = \\frac{15}{16}$，因子相同。\n\n> **注意。** 因子里是 $\\frac{z^{2}}{n^{2}}$，所以在 $z = \\frac{1}{m}$ 处它是 $1 - \\frac{1}{m^{2}n^{2}}$，不是 $1 - \\frac{1}{mn}$。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(2, 15);
          const big = rng.int(2, 3);
          const ns = Array.from({ length: big }, (_, i) => i + 1);
          const answer = ns.reduce((p, n) => p.mul(Q.of(m * m * n * n - 1, m * m * n * n)), Q.of(1));
          const linear = ns.reduce((p, n) => p.mul(Q.of(m * n - 1, m * n)), Q.of(1));
          const misses: Miss[] = [
            [Q.of(m * m - 1, m * m), "That stops after the first factor.", "那只用了第一个因子。"],
            [Q.of(1).div(answer), "That turns the product upside down.", "那把乘积颠倒了。"],
            [
              linear,
              "That uses $\\frac{z}{n}$ in place of $\\frac{z^{2}}{n^{2}}$.",
              "那用了 $\\frac{z}{n}$，而不是 $\\frac{z^{2}}{n^{2}}$。",
            ],
          ];
          const shown = ns.map((n) => `\\frac{${m * m * n * n - 1}}{${m * m * n * n}}`).join(" \\cdot ");
          const split = ns.map((n) => `\\frac{${m * n - 1}}{${m * n}} \\cdot \\frac{${m * n + 1}}{${m * n}}`).join(" \\cdot ");
          return worked(
            [
              `Evaluate the partial product $\\prod_{n=1}^{${big}} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ at $z = \\frac{1}{${m}}$.`,
              `计算部分积 $\\prod_{n=1}^{${big}} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ 在 $z = \\frac{1}{${m}}$ 处的值。`,
            ],
            answer,
            misses,
            [
              [
                ["Write the factors", "写出因子"],
                [
                  `At $z = \\frac{1}{${m}}$ each factor is $1 - \\frac{1}{${m * m} n^{2}}$, which gives $${shown}$.`,
                  `在 $z = \\frac{1}{${m}}$ 处每个因子是 $1 - \\frac{1}{${m * m} n^{2}}$，得到 $${shown}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [`The product is $${answer.toLatex()}$.`, `乘积是 $${answer.toLatex()}$。`],
              ],
            ],
            [
              `Splitting each factor as $\\left(1 - \\frac{z}{n}\\right)\\left(1 + \\frac{z}{n}\\right)$ gives $${split} = ${answer.toLatex()}$ again.`,
              `把每个因子拆成 $\\left(1 - \\frac{z}{n}\\right)\\left(1 + \\frac{z}{n}\\right)$，得 $${split} = ${answer.toLatex()}$，结果相同。`,
            ],
          );
        }),
    ),
    point(
      "counting-the-zeros-in-a-disc",
      ["Counting the zeros in a disc", "数圆盘内的零点"],
      [
        "The zeros of $\\sin(\\pi z)$ are exactly the integers, with no others in the complex plane. So the number of zeros in a disc around the origin is found by counting the integers inside it. For example, $|z| < \\frac{5}{2}$ holds the integers $-2, -1, 0, 1, 2$, so $\\sin(\\pi z)$ has 5 zeros there.\n\nCheck: in the product $\\pi z \\prod \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$, the factor $z$ gives the zero 0 and the factors with $n = 1, 2$ give $\\pm 1$ and $\\pm 2$; the factor with $n = 3$ gives $\\pm 3$, outside. That is $1 + 2 \\cdot 2 = 5$.\n\n> **Watch out.** Count the negative integers and 0 as well as the positive ones.",
        "$\\sin(\\pi z)$ 的零点恰好是整数，在复平面上没有其他零点。所以以原点为圆心的圆盘内的零点数，就是数其中的整数。例如，$|z| < \\frac{5}{2}$ 内有整数 $-2, -1, 0, 1, 2$，所以 $\\sin(\\pi z)$ 在那里有 5 个零点。\n\n检验：在乘积 $\\pi z \\prod \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ 中，因子 $z$ 给出零点 0，$n = 1, 2$ 的因子给出 $\\pm 1$ 和 $\\pm 2$；$n = 3$ 的因子给出 $\\pm 3$，在外面。共 $1 + 2 \\cdot 2 = 5$ 个。\n\n> **注意。** 负整数和 0 也要数，不只是正整数。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(2, 60);
          const r = Q.of(2 * m + 1, 2);
          const misses: Miss[] = [
            [m, "That counts only the positive integers.", "那只数了正整数。"],
            [2 * m, "That leaves out the zero at 0.", "那漏掉了 0 处的零点。"],
            [
              2 * m + 3,
              `That counts $\\pm ${m + 1}$ too, but they lie outside the disc.`,
              `那把 $\\pm ${m + 1}$ 也算进去了，但它们在圆盘外。`,
            ],
          ];
          return worked(
            [
              `How many zeros does $\\sin(\\pi z)$ have in $|z| < ${r.toLatex()}$?`,
              `$\\sin(\\pi z)$ 在 $|z| < ${r.toLatex()}$ 内有多少个零点？`,
            ],
            2 * m + 1,
            misses,
            [
              [
                ["Locate the zeros", "找零点"],
                ["The zeros of $\\sin(\\pi z)$ are exactly the integers.", "$\\sin(\\pi z)$ 的零点恰好是整数。"],
              ],
              [
                ["Count those inside", "数内部的"],
                [
                  `The integers with $|n| < ${r.toLatex()}$ run from $-${m}$ to ${m}, which is $2 \\cdot ${m} + 1 = ${2 * m + 1}$.`,
                  `满足 $|n| < ${r.toLatex()}$ 的整数从 $-${m}$ 到 ${m}，共 $2 \\cdot ${m} + 1 = ${2 * m + 1}$ 个。`,
                ],
              ],
            ],
            [
              `In the product, the factor $z$ gives 0 and the ${m} factors with $n \\le ${m}$ give two zeros each, $1 + 2 \\cdot ${m} = ${2 * m + 1}$.`,
              `在乘积中，因子 $z$ 给出 0，$n \\le ${m}$ 的 ${m} 个因子各给出两个零点，$1 + 2 \\cdot ${m} = ${2 * m + 1}$。`,
            ],
          );
        }),
    ),
    point(
      "comparing-coefficients",
      ["Comparing coefficients", "比较系数"],
      [
        "Expanding the product shows that the coefficient of $z^{2}$ in $\\frac{\\sin(\\pi z)}{\\pi z}$ is minus the sum of $\\frac{1}{n^{2}}$. The Taylor series says it is $-\\frac{\\pi^{2}}{6}$, which is Euler's famous solution to the Basel problem. For example, the coefficient of $z^{2}$ in $\\frac{3\\sin(\\pi z)}{\\pi z}$ is $3 \\cdot \\left(-\\frac{\\pi^{2}}{6}\\right) = -\\frac{\\pi^{2}}{2}$.\n\nCheck: from the product, $3\\prod \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ has $z^{2}$ coefficient $-3\\sum \\frac{1}{n^{2}} = -3 \\cdot \\frac{\\pi^{2}}{6} = -\\frac{\\pi^{2}}{2}$.\n\n> **Watch out.** The sine series is $x - \\frac{x^{3}}{3!} + \\dots$, so dividing by $x = \\pi z$ leaves $-\\frac{\\pi^{2}z^{2}}{6}$, with $3! = 6$, not 3 or 2.",
        "展开乘积可知 $\\frac{\\sin(\\pi z)}{\\pi z}$ 中 $z^{2}$ 的系数是 $\\frac{1}{n^{2}}$ 之和的相反数。泰勒级数说它是 $-\\frac{\\pi^{2}}{6}$，这就是欧拉对巴塞尔问题的著名解答。例如，$\\frac{3\\sin(\\pi z)}{\\pi z}$ 中 $z^{2}$ 的系数是 $3 \\cdot \\left(-\\frac{\\pi^{2}}{6}\\right) = -\\frac{\\pi^{2}}{2}$。\n\n检验：由乘积，$3\\prod \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ 的 $z^{2}$ 系数是 $-3\\sum \\frac{1}{n^{2}} = -3 \\cdot \\frac{\\pi^{2}}{6} = -\\frac{\\pi^{2}}{2}$。\n\n> **注意。** 正弦级数是 $x - \\frac{x^{3}}{3!} + \\dots$，所以除以 $x = \\pi z$ 后剩下 $-\\frac{\\pi^{2}z^{2}}{6}$，其中 $3! = 6$，不是 3 或 2。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(1, 40);
          const answer = Q.of(-k, 6);
          const misses: Miss[] = [
            [Q.of(k, 6), "That loses the minus sign of the cubic term.", "那丢了三次项的负号。"],
            [Q.of(-k, 3), "That divides by 3 instead of $3! = 6$.", "那除以 3，而不是 $3! = 6$。"],
            [Q.of(-k, 2), "That uses the cosine coefficient $\\frac{1}{2!}$.", "那用了余弦的系数 $\\frac{1}{2!}$。"],
          ];
          return worked(
            [
              `The coefficient of $z^{2}$ in $\\frac{${k === 1 ? "" : `${k} `}\\sin(\\pi z)}{\\pi z}$ is $m\\pi^{2}$. What is $m$?`,
              `$\\frac{${k === 1 ? "" : `${k} `}\\sin(\\pi z)}{\\pi z}$ 中 $z^{2}$ 的系数是 $m\\pi^{2}$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Expand the sine", "展开正弦"],
                [
                  "$\\sin(\\pi z) = \\pi z - \\frac{(\\pi z)^{3}}{6} + \\dots$, so $\\frac{\\sin(\\pi z)}{\\pi z} = 1 - \\frac{\\pi^{2}z^{2}}{6} + \\dots$.",
                  "$\\sin(\\pi z) = \\pi z - \\frac{(\\pi z)^{3}}{6} + \\dots$，所以 $\\frac{\\sin(\\pi z)}{\\pi z} = 1 - \\frac{\\pi^{2}z^{2}}{6} + \\dots$。",
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${k} \\cdot \\left(-\\frac{1}{6}\\right) = ${answer.toLatex()}$, so $m = ${answer.toLatex()}$.`,
                  `$${k} \\cdot \\left(-\\frac{1}{6}\\right) = ${answer.toLatex()}$，所以 $m = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `From the product, the $z^{2}$ coefficient is $-${k}\\sum \\frac{1}{n^{2}} = -${k} \\cdot \\frac{\\pi^{2}}{6}$, the same.`,
              `由乘积，$z^{2}$ 的系数是 $-${k}\\sum \\frac{1}{n^{2}} = -${k} \\cdot \\frac{\\pi^{2}}{6}$，结果相同。`,
            ],
          );
        }),
    ),
  ],
);

const infinityResidue = topic(
  "the-residue-at-infinity",
  ["The Residue at Infinity", "无穷远点的留数"],
  ["Trade all the finite poles for one calculation at infinity.", "用无穷远点的一次计算代替所有有限极点。"],
  ["the-residue-theorem", "the-riemann-sphere"],
  [],
  [
    {
      ...point(
        "from-the-coefficient-of-one-over-z",
        ["From the coefficient of one over z", "由 z 分之一的系数"],
        [
          "The residue at infinity is minus the coefficient of $\\frac{1}{z}$ in the expansion valid for large $|z|$. The minus sign reflects that a large circle runs clockwise when viewed from infinity, as the drawing shows. For example, $2z + 5 + \\frac{3}{z} + \\frac{1}{z^{2}}$ has residue $-3$ at infinity.\n\nCheck: its only finite pole is 0, with residue 3, the coefficient of $\\frac{1}{z}$; all the residues add to zero, so the one at infinity is $-3$.\n\n> **Watch out.** Read the coefficient of $\\frac{1}{z}$, not of $z$ or the constant, and put the minus sign in front.",
          "无穷远点的留数是 $|z|$ 很大时展开式中 $\\frac{1}{z}$ 系数的相反数。负号反映了从无穷远看，大圆是顺时针的，如图所示。例如，$2z + 5 + \\frac{3}{z} + \\frac{1}{z^{2}}$ 在无穷远点的留数是 $-3$。\n\n检验：它唯一的有限极点是 0，留数是 $\\frac{1}{z}$ 的系数 3；所有留数之和为零，所以无穷远点的留数是 $-3$。\n\n> **注意。** 读的是 $\\frac{1}{z}$ 的系数，不是 $z$ 的系数或常数项，并在前面加负号。",
        ],
        (rng) =>
          until(() => {
            const [a, b, c] = [rng.int(1, 15), rng.int(1, 15), rng.int(1, 15)];
            const misses: Miss[] = [
              [a, "That forgets the minus sign.", "那忘了负号。"],
              [-b, "That uses the coefficient of $z$.", "那用了 $z$ 的系数。"],
              [-c, "That uses the constant term.", "那用了常数项。"],
            ];
            const f = `${co(b, "z")} + ${c} + \\frac{${a}}{z} + \\frac{${b}}{z^{2}}`;
            return worked(
              [`What is the residue at infinity of $${f}$?`, `$${f}$ 在无穷远点的留数是多少？`],
              -a,
              misses,
              [
                [
                  ["Read the coefficient", "读出系数"],
                  [
                    `The expansion is already in powers of $z$; the coefficient of $\\frac{1}{z}$ is ${a}.`,
                    `展开式已经是 $z$ 的幂；$\\frac{1}{z}$ 的系数是 ${a}。`,
                  ],
                ],
                [
                  ["Change the sign", "改变符号"],
                  [`The residue at infinity is $-${a}$.`, `无穷远点的留数是 $-${a}$。`],
                ],
              ],
              [
                `The only finite pole is 0, with residue ${a}; the residues add to zero, so the one at infinity is $-${a}$.`,
                `唯一的有限极点是 0，留数为 ${a}；所有留数之和为零，所以无穷远点的留数是 $-${a}$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-residue-at-infinity#from-the-coefficient-of-one-over-z"],
    },
    {
      ...point(
        "all-the-residues-add-to-zero",
        ["All the residues add to zero", "所有留数之和为零"],
        [
          "On the Riemann sphere, the residues of a rational function at all its poles and at infinity add up to zero. So the residue at infinity is minus the sum of the finite residues, and any one can be recovered. In the drawing, $\\frac{1}{z} + \\frac{2}{z - 1}$ has residues 1 and 2, and the residue at infinity is $-3$.\n\nCheck: for large $|z|$, $\\frac{1}{z} + \\frac{2}{z - 1} = \\frac{3}{z} + \\frac{2}{z^{2}} + \\dots$, whose $\\frac{1}{z}$ coefficient 3 gives the residue $-3$ at infinity directly.\n\n> **Watch out.** Take minus the sum, and include every finite residue.",
          "在黎曼球面上，有理函数在所有极点和无穷远点的留数之和为零。所以无穷远点的留数是有限留数之和的相反数，任何一个都可以求回。图中 $\\frac{1}{z} + \\frac{2}{z - 1}$ 的留数是 1 和 2，无穷远点的留数是 $-3$。\n\n检验：$|z|$ 很大时，$\\frac{1}{z} + \\frac{2}{z - 1} = \\frac{3}{z} + \\frac{2}{z^{2}} + \\dots$，它的 $\\frac{1}{z}$ 系数 3 直接给出无穷远点的留数 $-3$。\n\n> **注意。** 取和的相反数，并且包括每个有限留数。",
        ],
        (rng) =>
          until(() => {
            const [a, b, c] = [rng.int(-15, 15), rng.int(-15, 15), rng.int(-15, 15)];
            const sum = a + b + c;
            const misses: Miss[] = [
              [sum, "That forgets the minus sign.", "那忘了负号。"],
              [-(a + b), `That leaves out the residue ${c}.`, `那漏掉了留数 ${c}。`],
              [0, "That assumes infinity contributes nothing.", "那以为无穷远点没有贡献。"],
            ];
            return worked(
              [
                `A rational function has finite poles with residues ${a}, ${b} and ${c}, and no others. What is its residue at infinity?`,
                `一个有理函数的有限极点的留数是 ${a}、${b} 和 ${c}，没有其他极点。它在无穷远点的留数是多少？`,
              ],
              -sum,
              misses,
              [
                [
                  ["Add the finite residues", "把有限留数相加"],
                  [`$${a}${plus(b)}${plus(c)} = ${sum}$.`, `$${a}${plus(b)}${plus(c)} = ${sum}$。`],
                ],
                [
                  ["Balance to zero", "使总和为零"],
                  [`The residue at infinity is $-(${sum}) = ${-sum}$.`, `无穷远点的留数是 $-(${sum}) = ${-sum}$。`],
                ],
              ],
              [
                `For instance $\\frac{${a}}{z - 1} + \\frac{${b}}{z - 2} + \\frac{${c}}{z - 3}$ has these residues, and for large $|z|$ it is $\\frac{${sum}}{z} + \\dots$, so its residue at infinity is ${-sum}.`,
                `例如 $\\frac{${a}}{z - 1} + \\frac{${b}}{z - 2} + \\frac{${c}}{z - 3}$ 有这些留数，$|z|$ 很大时它是 $\\frac{${sum}}{z} + \\dots$，所以它在无穷远点的留数是 ${-sum}。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-residue-at-infinity#all-the-residues-add-to-zero"],
    },
    {
      ...point(
        "a-large-circle-in-one-step",
        ["A large circle in one step", "一步算大圆"],
        [
          "If all the poles lie inside a circle, the integral comes from infinity alone. For a rational function whose denominator is one degree higher than its numerator, the value is $2\\pi i$ times the ratio of the leading coefficients. In the drawing, $\\frac{2z}{z^{2} + 1}$ has both poles $\\pm i$ inside the circle, the ratio of the leading coefficients is 2, and the integral is $2\\pi i \\cdot 2 = 4\\pi i$.\n\nCheck: the residues at $\\pm i$ are $\\frac{2i}{2i} = 1$ and $\\frac{-2i}{-2i} = 1$, and $2\\pi i (1 + 1) = 4\\pi i$.\n\n> **Watch out.** The ratio is the numerator's leading coefficient over the denominator's, and the factor is $2\\pi i$, not $\\pi i$.",
          "如果所有极点都在圆内，积分只取决于无穷远点。对分母比分子高一次的有理函数，值是 $2\\pi i$ 乘首项系数之比。图中 $\\frac{2z}{z^{2} + 1}$ 的两个极点 $\\pm i$ 都在圆内，首项系数之比是 2，积分是 $2\\pi i \\cdot 2 = 4\\pi i$。\n\n检验：$\\pm i$ 处的留数是 $\\frac{2i}{2i} = 1$ 和 $\\frac{-2i}{-2i} = 1$，$2\\pi i (1 + 1) = 4\\pi i$。\n\n> **注意。** 比值是分子首项系数除以分母首项系数，因子是 $2\\pi i$，不是 $\\pi i$。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(2, 20);
            const b = rng.int(2, 9);
            const n = rng.int(2, 8);
            const c = rng.int(1, 9);
            const answer = Q.of(2 * a, b);
            const misses: Miss[] = [
              [Q.of(a, b), "That leaves out the factor 2 in $2\\pi i$.", "那漏掉了 $2\\pi i$ 中的因子 2。"],
              [Q.of(2 * b, a), "That turns the ratio of leading coefficients upside down.", "那把首项系数之比颠倒了。"],
              [2 * a, `That ignores the leading coefficient ${b} of the denominator.`, `那忽略了分母的首项系数 ${b}。`],
            ];
            return worked(
              [
                `$\\oint_{|z| = ${c + 2}} \\frac{${a}z^{${n}} + ${c}}{${b}z^{${n + 1}} + ${c}}\\, dz = m\\pi i$ counterclockwise, with all poles inside the circle. What is $m$?`,
                `逆时针方向 $\\oint_{|z| = ${c + 2}} \\frac{${a}z^{${n}} + ${c}}{${b}z^{${n + 1}} + ${c}}\\, dz = m\\pi i$，所有极点都在圆内。$m$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Expand at infinity", "在无穷远展开"],
                  [
                    `For large $|z|$ the integrand is $\\frac{${a}}{${b}z} + \\dots$, so the residue at infinity is $-${Q.of(a, b).toLatex()}$.`,
                    `$|z|$ 很大时被积函数是 $\\frac{${a}}{${b}z} + \\dots$，所以无穷远点的留数是 $-${Q.of(a, b).toLatex()}$。`,
                  ],
                ],
                [
                  ["Use the balance", "利用平衡"],
                  [
                    `The finite residues add to $${Q.of(a, b).toLatex()}$, so the integral is $2\\pi i \\cdot ${Q.of(a, b).toLatex()} = ${answer.toLatex()}\\pi i$.`,
                    `有限留数之和是 $${Q.of(a, b).toLatex()}$，所以积分是 $2\\pi i \\cdot ${Q.of(a, b).toLatex()} = ${answer.toLatex()}\\pi i$。`,
                  ],
                ],
              ],
              [
                `The integrand differs from $\\frac{${a}}{${b}z}$ by a term of size about $\\frac{C}{R^{2}}$, whose integral is at most $2\\pi R \\cdot \\frac{C}{R^{2}} \\to 0$; the integral does not depend on $R$, so it equals $\\oint \\frac{${a}}{${b}z}\\, dz = ${answer.toLatex()}\\pi i$.`,
                `被积函数与 $\\frac{${a}}{${b}z}$ 相差一个大小约为 $\\frac{C}{R^{2}}$ 的项，它的积分至多是 $2\\pi R \\cdot \\frac{C}{R^{2}} \\to 0$；积分与 $R$ 无关，所以等于 $\\oint \\frac{${a}}{${b}z}\\, dz = ${answer.toLatex()}\\pi i$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-residue-at-infinity#a-large-circle-in-one-step"],
    },
  ],
);

const jordan = topic(
  "jordans-lemma-and-fourier-integrals",
  ["Jordan's Lemma and Fourier Integrals", "若尔当引理和傅里叶积分"],
  ["Close contours for integrals with oscillating factors.", "对带振荡因子的积分闭合围道。"],
  ["improper-integrals-by-residues"],
  [],
  [
    point(
      "evaluating-a-cosine-integral",
      ["Evaluating a cosine integral", "计算余弦积分"],
      [
        "To integrate $\\frac{\\cos(ax)}{x^{2} + b^{2}}$, replace the cosine by $e^{iaz}$ and close in the upper half plane. The pole at $ib$ gives the value $\\frac{\\pi e^{-ab}}{b}$, and the real part is the answer. For example, $\\int_{-\\infty}^{\\infty} \\frac{\\cos(2x)}{x^{2} + 1}\\, dx$: the residue of $\\frac{e^{2iz}}{z^{2} + 1}$ at $i$ is $\\frac{e^{-2}}{2i}$, and $2\\pi i \\cdot \\frac{e^{-2}}{2i} = \\pi e^{-2}$.\n\nCheck: as $a \\to 0$ the formula gives $\\frac{\\pi}{b}$, which is $\\int \\frac{dx}{x^{2} + b^{2}}$, the integral without the oscillation.\n\n> **Watch out.** Use $e^{iaz}$, not $\\cos(az)$ itself: the cosine grows in both half planes, so its arc integral does not vanish.",
        "要积分 $\\frac{\\cos(ax)}{x^{2} + b^{2}}$，把余弦换成 $e^{iaz}$ 并在上半平面闭合。$ib$ 处的极点给出值 $\\frac{\\pi e^{-ab}}{b}$，实部就是答案。例如 $\\int_{-\\infty}^{\\infty} \\frac{\\cos(2x)}{x^{2} + 1}\\, dx$：$\\frac{e^{2iz}}{z^{2} + 1}$ 在 $i$ 处的留数是 $\\frac{e^{-2}}{2i}$，$2\\pi i \\cdot \\frac{e^{-2}}{2i} = \\pi e^{-2}$。\n\n检验：当 $a \\to 0$ 时公式给出 $\\frac{\\pi}{b}$，即 $\\int \\frac{dx}{x^{2} + b^{2}}$，没有振荡时的积分。\n\n> **注意。** 用 $e^{iaz}$，不要直接用 $\\cos(az)$：余弦在两个半平面都增长，它的圆弧积分不趋于零。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const slips: Slip[] = [
          [
            same(`\\frac{\\pi e^{-${a}}}{${b}}`),
            `That drops ${b} from the exponent: at $z = ${b}i$, $e^{${a}iz} = e^{-${a * b}}$.`,
            `那从指数中丢了 ${b}：在 $z = ${b}i$ 处 $e^{${a}iz} = e^{-${a * b}}$。`,
          ],
          [
            same(`\\frac{\\pi}{${b}}`),
            "That ignores the cosine; it is the integral without oscillation.",
            "那忽略了余弦；这是没有振荡时的积分。",
          ],
          [
            same(`\\frac{2\\pi e^{-${a * b}}}{${b}}`),
            `That forgets the $2 \\cdot ${b}i$ in the residue's denominator.`,
            `那忘了留数分母中的 $2 \\cdot ${b}i$。`,
          ],
        ];
        return chosen(
          rng,
          [
            `Evaluate $\\int_{-\\infty}^{\\infty} \\frac{\\cos(${a}x)}{x^{2} + ${b * b}}\\, dx$.`,
            `计算 $\\int_{-\\infty}^{\\infty} \\frac{\\cos(${a}x)}{x^{2} + ${b * b}}\\, dx$。`,
          ],
          same(`\\frac{\\pi e^{-${a * b}}}{${b}}`),
          slips,
          [
            [
              ["Close above", "在上方闭合"],
              [
                `Write the cosine as the real part of $e^{${a}ix}$ and close in the upper half plane; Jordan's lemma makes the arc vanish.`,
                `把余弦写成 $e^{${a}ix}$ 的实部，在上半平面闭合；由若尔当引理，圆弧上的积分趋于零。`,
              ],
            ],
            [
              ["Take the residue", "求留数"],
              [
                `The only pole inside is $${b}i$, with residue $\\frac{e^{${a}i(${b}i)}}{2 \\cdot ${b}i} = \\frac{e^{-${a * b}}}{${2 * b}i}$.`,
                `围道内唯一的极点是 $${b}i$，留数为 $\\frac{e^{${a}i(${b}i)}}{2 \\cdot ${b}i} = \\frac{e^{-${a * b}}}{${2 * b}i}$。`,
              ],
            ],
            [
              ["Multiply", "相乘"],
              [
                `$2\\pi i \\cdot \\frac{e^{-${a * b}}}{${2 * b}i} = \\frac{\\pi e^{-${a * b}}}{${b}}$, which is real, so it is the integral.`,
                `$2\\pi i \\cdot \\frac{e^{-${a * b}}}{${2 * b}i} = \\frac{\\pi e^{-${a * b}}}{${b}}$，它是实数，就是所求积分。`,
              ],
            ],
          ],
          [
            `The value is below $\\frac{\\pi}{${b}} = \\int \\frac{dx}{x^{2} + ${b * b}}$, as it must be, since $|\\cos(${a}x)| \\le 1$ and the cosine also cancels part of the area.`,
            `这个值小于 $\\frac{\\pi}{${b}} = \\int \\frac{dx}{x^{2} + ${b * b}}$，正应如此，因为 $|\\cos(${a}x)| \\le 1$，余弦还抵消了一部分面积。`,
          ],
        );
      },
    ),
    {
      ...point(
        "the-ml-bound-on-the-arc",
        ["The ML bound on the arc", "圆弧上的 ML 界"],
        [
          "On the upper semicircle of radius $R$, the factor $e^{iaz}$ has size at most 1 and the arc has length $\\pi R$. So the ML bound for a denominator of degree 2 tends to zero as $R$ grows. In the drawing the denominator is $z^{2} + 1$, and the bound $\\frac{\\pi R}{R^{2} - 1}$ is graphed; at $R = 3$ it is $\\frac{3\\pi}{8}$.\n\nCheck: on $|z| = 3$, $|z^{2} + 1| \\ge 9 - 1 = 8$ by the reverse triangle inequality, so the integrand is at most $\\frac{1}{8}$, and the length $3\\pi$ gives $\\frac{3\\pi}{8}$.\n\n> **Watch out.** Bound the denominator from below by $R^{2} - b^{2}$, not $R^{2} + b^{2}$, and use the half circle's length $\\pi R$.",
          "在半径为 $R$ 的上半圆上，因子 $e^{iaz}$ 的模不超过 1，圆弧长度是 $\\pi R$。所以分母为 2 次时，ML 界随 $R$ 增大趋于零。图中分母是 $z^{2} + 1$，画出了界 $\\frac{\\pi R}{R^{2} - 1}$；在 $R = 3$ 时它是 $\\frac{3\\pi}{8}$。\n\n检验：在 $|z| = 3$ 上，由反向三角不等式 $|z^{2} + 1| \\ge 9 - 1 = 8$，所以被积函数至多是 $\\frac{1}{8}$，长度 $3\\pi$ 给出 $\\frac{3\\pi}{8}$。\n\n> **注意。** 分母要用 $R^{2} - b^{2}$ 从下方估计，不是 $R^{2} + b^{2}$；长度用半圆的 $\\pi R$。",
        ],
        (rng) =>
          until(() => {
            const b = rng.int(1, 8);
            const r = b + rng.int(1, 20);
            const answer = Q.of(r, r * r - b * b);
            const misses: Miss[] = [
              [
                Q.of(r, r * r + b * b),
                "That bounds the denominator by $R^{2} + b^{2}$, which is too large to give an upper bound.",
                "那用 $R^{2} + b^{2}$ 估计分母，太大，给不出上界。",
              ],
              [Q.of(1, r * r - b * b), "That leaves out the length of the arc.", "那漏掉了圆弧的长度。"],
              [Q.of(2 * r, r * r - b * b), "That uses the full circle's length $2\\pi R$.", "那用了整个圆的长度 $2\\pi R$。"],
            ];
            return worked(
              [
                `On the upper arc of $|z| = ${r}$, the ML bound for $\\frac{e^{iz}}{z^{2} + ${b * b}}$ is $m\\pi$. What is $m$?`,
                `在 $|z| = ${r}$ 的上半圆弧上，$\\frac{e^{iz}}{z^{2} + ${b * b}}$ 的 ML 界是 $m\\pi$。$m$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Bound the integrand", "估计被积函数"],
                  [
                    `$|e^{iz}| = e^{-\\operatorname{Im} z} \\le 1$ and $|z^{2} + ${b * b}| \\ge ${r * r} - ${b * b} = ${r * r - b * b}$, so $M = \\frac{1}{${r * r - b * b}}$.`,
                    `$|e^{iz}| = e^{-\\operatorname{Im} z} \\le 1$，$|z^{2} + ${b * b}| \\ge ${r * r} - ${b * b} = ${r * r - b * b}$，所以 $M = \\frac{1}{${r * r - b * b}}$。`,
                  ],
                ],
                [
                  ["Multiply by the length", "乘以长度"],
                  [
                    `$L = ${r}\\pi$, so $ML = \\frac{${r}\\pi}{${r * r - b * b}}$ and $m = ${answer.toLatex()}$.`,
                    `$L = ${r}\\pi$，所以 $ML = \\frac{${r}\\pi}{${r * r - b * b}}$，$m = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The formula $\\frac{\\pi R}{R^{2} - b^{2}}$ with $R = ${r}$ and $b = ${b}$ gives $\\frac{${r}\\pi}{${r * r - b * b}}$, and it shrinks like $\\frac{\\pi}{R}$ as $R$ grows.`,
                `公式 $\\frac{\\pi R}{R^{2} - b^{2}}$ 取 $R = ${r}$，$b = ${b}$，给出 $\\frac{${r}\\pi}{${r * r - b * b}}$，而且随 $R$ 增大像 $\\frac{\\pi}{R}$ 那样变小。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["jordans-lemma-and-fourier-integrals#the-ml-bound-on-the-arc"],
    },
    point(
      "which-half-plane-to-close",
      ["Which half plane to close", "在哪个半平面闭合"],
      [
        "The factor $e^{iaz}$ has size $e^{-a \\operatorname{Im} z}$. So for positive $a$ it decays in the upper half plane, and for negative $a$ it decays in the lower half plane, where the contour runs clockwise. For example, $e^{-3iz}$ at $z = -Ri$ has size $e^{-3R}$, tiny, but at $z = Ri$ it has size $e^{3R}$, huge; so close below.\n\nCheck: $|e^{-3iz}| = e^{\\operatorname{Re}(-3iz)} = e^{3\\operatorname{Im} z}$, which is below 1 exactly where $\\operatorname{Im} z < 0$.\n\n> **Watch out.** Closing below runs clockwise, so the residue sum gets a factor $-2\\pi i$.",
        "因子 $e^{iaz}$ 的模是 $e^{-a \\operatorname{Im} z}$。所以 $a$ 为正时它在上半平面衰减，$a$ 为负时在下半平面衰减，那里的围道是顺时针的。例如，$e^{-3iz}$ 在 $z = -Ri$ 处的模是 $e^{-3R}$，很小；在 $z = Ri$ 处是 $e^{3R}$，很大；所以在下方闭合。\n\n检验：$|e^{-3iz}| = e^{\\operatorname{Re}(-3iz)} = e^{3\\operatorname{Im} z}$，它恰好在 $\\operatorname{Im} z < 0$ 时小于 1。\n\n> **注意。** 在下方闭合时围道是顺时针的，所以留数和要乘 $-2\\pi i$。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const negative = rng.bool();
        const up: Pair = ["The upper half plane", "上半平面"];
        const down: Pair = ["The lower half plane", "下半平面"];
        const exponent = `${negative ? "-" : ""}${a === 1 ? "" : a}ix`;
        const slips: Slip[] = [
          [
            negative ? up : down,
            `There $|e^{${negative ? "-" : ""}${a === 1 ? "" : a}iz}| = e^{${negative ? "" : "-"}${a === 1 ? "" : a}\\operatorname{Im} z}$ grows, so the arc does not vanish.`,
            `在那里 $|e^{${negative ? "-" : ""}${a === 1 ? "" : a}iz}| = e^{${negative ? "" : "-"}${a === 1 ? "" : a}\\operatorname{Im} z}$ 增长，圆弧上的积分不趋于零。`,
          ],
          [
            ["Either half plane gives the same arc bound", "两个半平面的圆弧界相同"],
            "The exponential decays in one half plane and grows in the other.",
            "指数在一个半平面衰减，在另一个增长。",
          ],
          [
            ["Neither, because the integrand has no poles", "都不行，因为被积函数没有极点"],
            "The integrand has poles at $\\pm i$.",
            "被积函数在 $\\pm i$ 处有极点。",
          ],
        ];
        return chosen(
          rng,
          [
            `To evaluate $\\int_{-\\infty}^{\\infty} \\frac{e^{${exponent}}}{x^{2} + 1}\\, dx$, where should the contour be closed?`,
            `要计算 $\\int_{-\\infty}^{\\infty} \\frac{e^{${exponent}}}{x^{2} + 1}\\, dx$，围道应该在哪里闭合？`,
          ],
          negative ? down : up,
          slips,
          [
            [
              ["Find the size", "求模"],
              [
                `$|e^{${negative ? "-" : ""}${a === 1 ? "" : a}iz}| = e^{${negative ? "" : "-"}${a === 1 ? "" : a}\\operatorname{Im} z}$.`,
                `$|e^{${negative ? "-" : ""}${a === 1 ? "" : a}iz}| = e^{${negative ? "" : "-"}${a === 1 ? "" : a}\\operatorname{Im} z}$。`,
              ],
            ],
            [
              ["Pick the decaying side", "选衰减的一侧"],
              [
                `It is below 1 where $\\operatorname{Im} z ${negative ? "<" : ">"} 0$, so close in the ${negative ? "lower" : "upper"} half plane.`,
                `它在 $\\operatorname{Im} z ${negative ? "<" : ">"} 0$ 处小于 1，所以在${negative ? "下" : "上"}半平面闭合。`,
              ],
            ],
          ],
          [
            `At $z = ${negative ? "-" : ""}Ri$ the factor has size $e^{-${a === 1 ? "" : a}R}$, which tends to 0, while at $z = ${negative ? "" : "-"}Ri$ it is $e^{${a === 1 ? "" : a}R}$, which blows up.`,
            `在 $z = ${negative ? "-" : ""}Ri$ 处因子的模是 $e^{-${a === 1 ? "" : a}R}$，趋于 0；而在 $z = ${negative ? "" : "-"}Ri$ 处是 $e^{${a === 1 ? "" : a}R}$，趋于无穷。`,
          ],
        );
      },
    ),
  ],
);

const indented = topic(
  "indented-contours-and-principal-values",
  ["Indented Contours and Principal Values", "凹陷围道与主值"],
  ["Step around a pole on the real axis, and evaluate principal value integrals.", "绕过实轴上的极点，计算主值积分。"],
  ["jordans-lemma-and-fourier-integrals"],
  [],
  [
    point(
      "the-small-semicircle",
      ["The small semicircle", "小半圆"],
      [
        "A small semicircle around a simple pole contributes half of a full turn in the limit. So going over the pole clockwise gives $-\\pi i$ times the residue, and counterclockwise gives $\\pi i$ times the residue. For example, a clockwise semicircle around $z = 2$ for $\\frac{3}{z - 2}$ gives $-3\\pi i$ in the limit.\n\nCheck: on the semicircle $z = 2 + \\varepsilon e^{it}$ with $t$ running from $\\pi$ down to 0, $\\frac{3}{z - 2}\\, dz = 3i\\, dt$, and $\\int_{\\pi}^{0} 3i\\, dt = -3\\pi i$.\n\n> **Watch out.** A semicircle gives half of $2\\pi i$ times the residue, not all of it, and clockwise reverses the sign.",
        "绕单极点的小半圆在极限下贡献整圈的一半。所以顺时针跨过极点给出 $-\\pi i$ 乘留数，逆时针给出 $\\pi i$ 乘留数。例如，对 $\\frac{3}{z - 2}$，绕 $z = 2$ 的顺时针小半圆在极限下给出 $-3\\pi i$。\n\n检验：在半圆 $z = 2 + \\varepsilon e^{it}$ 上，$t$ 从 $\\pi$ 减到 0，$\\frac{3}{z - 2}\\, dz = 3i\\, dt$，而 $\\int_{\\pi}^{0} 3i\\, dt = -3\\pi i$。\n\n> **注意。** 半圆给出 $2\\pi i$ 乘留数的一半，不是全部；顺时针时符号相反。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 30);
          const a = rng.int(-9, 9);
          const clockwise = rng.bool();
          const answer = clockwise ? -c : c;
          const misses: Miss[] = [
            [-answer, "That has the wrong sign for the direction.", "那方向的符号错了。"],
            [2 * answer, "That counts a full turn; a semicircle is half of one.", "那算了整圈；半圆只是半圈。"],
            [0, "That treats the small arc as negligible; near a simple pole it is not.", "那以为小圆弧可以忽略；在单极点附近不能忽略。"],
          ];
          return worked(
            [
              `A semicircle of small radius around $z = ${a}$ runs ${clockwise ? "clockwise" : "counterclockwise"}. In the limit, $\\int \\frac{${c}}{${minus(a)}}\\, dz$ along it is $m\\pi i$. What is $m$?`,
              `绕 $z = ${a}$ 的小半圆沿${clockwise ? "顺时针" : "逆时针"}方向。在极限下，沿它的 $\\int \\frac{${c}}{${minus(a)}}\\, dz$ 是 $m\\pi i$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Read the residue", "读出留数"],
                [`The pole at ${a} is simple, with residue ${c}.`, `${a} 处是单极点，留数为 ${c}。`],
              ],
              [
                ["Take half a turn", "取半圈"],
                [
                  `A half turn gives $${clockwise ? "-" : ""}\\pi i \\cdot ${c}$, so $m = ${answer}$.`,
                  `半圈给出 $${clockwise ? "-" : ""}\\pi i \\cdot ${c}$，所以 $m = ${answer}$。`,
                ],
              ],
            ],
            [
              `Parametrize $z = ${a} + \\varepsilon e^{it}$: then $\\frac{${c}}{${minus(a)}}\\, dz = ${c}i\\, dt$, and $t$ sweeps an angle $\\pi$ ${clockwise ? "downward" : "upward"}, giving $${answer}\\pi i$.`,
              `设 $z = ${a} + \\varepsilon e^{it}$：则 $\\frac{${c}}{${minus(a)}}\\, dz = ${c}i\\, dt$，$t$ ${clockwise ? "减少" : "增加"} $\\pi$，得到 $${answer}\\pi i$。`,
            ],
          );
        }),
    ),
    point(
      "the-sine-over-x-integral",
      ["The sine over x integral", "正弦除以 x 的积分"],
      [
        "Indenting around 0 and using $e^{iaz}$ for positive $a$ shows that the integral of $\\frac{\\sin(ax)}{x}$ over the line is $\\pi$. The value does not depend on $a$, since rescaling $x$ cancels it. For example, with $u = 3x$ we get $\\frac{dx}{x} = \\frac{du}{u}$, so $\\int_{-\\infty}^{\\infty} \\frac{\\sin(3x)}{x}\\, dx = \\int_{-\\infty}^{\\infty} \\frac{\\sin u}{u}\\, du = \\pi$.\n\nCheck: the closed contour around the indentation holds no pole, so the principal value of $\\int \\frac{e^{3ix}}{x}\\, dx$ cancels the small clockwise semicircle's $-\\pi i$ and equals $\\pi i$; its imaginary part is $\\pi$.\n\n> **Watch out.** The factor $a$ does not survive: the answer is $\\pi$, not $a\\pi$ or $\\frac{\\pi}{a}$.",
        "绕 0 凹陷并对正的 $a$ 使用 $e^{iaz}$，可知 $\\frac{\\sin(ax)}{x}$ 在直线上的积分是 $\\pi$。值与 $a$ 无关，因为缩放 $x$ 把它抵消了。例如，令 $u = 3x$，则 $\\frac{dx}{x} = \\frac{du}{u}$，所以 $\\int_{-\\infty}^{\\infty} \\frac{\\sin(3x)}{x}\\, dx = \\int_{-\\infty}^{\\infty} \\frac{\\sin u}{u}\\, du = \\pi$。\n\n检验：绕过凹陷的闭围道内没有极点，所以 $\\int \\frac{e^{3ix}}{x}\\, dx$ 的主值与顺时针小半圆的 $-\\pi i$ 抵消，等于 $\\pi i$；其虚部是 $\\pi$。\n\n> **注意。** 因子 $a$ 不会留下：答案是 $\\pi$，不是 $a\\pi$ 或 $\\frac{\\pi}{a}$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 9);
          const k = rng.int(2, 15);
          const misses: Miss[] = [
            [k * a, `That keeps the factor ${a}; rescaling cancels it.`, `那保留了因子 ${a}；缩放把它抵消了。`],
            [Q.of(k, a), `That divides by ${a}; rescaling cancels it.`, `那除以了 ${a}；缩放把它抵消了。`],
            [
              2 * k,
              "That doubles the value; the whole line gives $\\pi$, the half line $\\frac{\\pi}{2}$.",
              "那把值加倍了；整条直线给出 $\\pi$，半条直线给出 $\\frac{\\pi}{2}$。",
            ],
          ];
          return worked(
            [
              `$\\int_{-\\infty}^{\\infty} \\frac{${k} \\sin(${a}x)}{x}\\, dx = m\\pi$. What is $m$?`,
              `$\\int_{-\\infty}^{\\infty} \\frac{${k} \\sin(${a}x)}{x}\\, dx = m\\pi$。$m$ 是多少？`,
            ],
            k,
            misses,
            [
              [
                ["Rescale", "缩放"],
                [
                  `Put $u = ${a}x$; then $\\frac{dx}{x} = \\frac{du}{u}$ and the limits stay $\\pm\\infty$.`,
                  `令 $u = ${a}x$；则 $\\frac{dx}{x} = \\frac{du}{u}$，积分限仍是 $\\pm\\infty$。`,
                ],
              ],
              [
                ["Use the basic value", "用基本值"],
                [
                  `$${k}\\int_{-\\infty}^{\\infty} \\frac{\\sin u}{u}\\, du = ${k}\\pi$, so $m = ${k}$.`,
                  `$${k}\\int_{-\\infty}^{\\infty} \\frac{\\sin u}{u}\\, du = ${k}\\pi$，所以 $m = ${k}$。`,
                ],
              ],
            ],
            [
              `The principal value of $\\int \\frac{e^{${a}ix}}{x}\\, dx$ is $\\pi i$ by the indented contour, since the small clockwise semicircle gives $-\\pi i$ and the big arc vanishes; the imaginary part times ${k} is $${k}\\pi$.`,
              `由凹陷围道，$\\int \\frac{e^{${a}ix}}{x}\\, dx$ 的主值是 $\\pi i$，因为顺时针小半圆给出 $-\\pi i$，大圆弧趋于零；虚部乘 ${k} 得 $${k}\\pi$。`,
            ],
          );
        }),
    ),
    point(
      "a-principal-value-by-symmetry",
      ["A principal value by symmetry", "由对称性求主值"],
      [
        "The principal value removes a symmetric gap around the singularity and takes the limit. The two sides of $\\frac{1}{x - a}$ then cancel exactly, even though each side diverges on its own. For example, the principal value of $\\int_{-1}^{5} \\left(\\frac{4}{x - 2} + 3\\right) dx$ is $3 \\cdot 6 = 18$, because the interval is symmetric about 2.\n\nCheck: with the gap $(2 - \\varepsilon, 2 + \\varepsilon)$ removed, the pole part gives $4\\ln\\frac{\\varepsilon}{3} + 4\\ln\\frac{3}{\\varepsilon} = 0$, and the constant gives $3 \\cdot 6 = 18$.\n\n> **Watch out.** The cancellation needs the interval to be symmetric about the pole; the constant part still contributes its full length.",
        "主值去掉奇点周围的对称间隙，再取极限。这时 $\\frac{1}{x - a}$ 的两边恰好抵消，尽管每一边单独都发散。例如，$\\int_{-1}^{5} \\left(\\frac{4}{x - 2} + 3\\right) dx$ 的主值是 $3 \\cdot 6 = 18$，因为区间关于 2 对称。\n\n检验：去掉间隙 $(2 - \\varepsilon, 2 + \\varepsilon)$ 后，极点部分给出 $4\\ln\\frac{\\varepsilon}{3} + 4\\ln\\frac{3}{\\varepsilon} = 0$，常数部分给出 $3 \\cdot 6 = 18$。\n\n> **注意。** 抵消要求区间关于极点对称；常数部分仍贡献整段长度。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-9, 9);
          const r = rng.int(1, 15);
          const c = rng.int(2, 15);
          const d = rng.int(1, 12);
          const x = a === 0 ? "x" : a < 0 ? `x + ${-a}` : `x - ${a}`;
          const misses: Miss[] = [
            [
              2 * r * (c + d),
              `That gives the pole part the weight of a constant ${c}; it cancels instead.`,
              `那把极点部分当作常数 ${c}；它其实相互抵消。`,
            ],
            [r * d, "That integrates the constant over only one side of the pole.", "那只在极点的一侧积分了常数。"],
            [
              2 * r * d + c,
              `That adds the coefficient ${c} of the pole part; that part contributes nothing.`,
              `那加上了极点部分的系数 ${c}；这部分没有贡献。`,
            ],
          ];
          return worked(
            [
              `What is the principal value of $\\int_{${a - r}}^{${a + r}} \\left(\\frac{${c}}{${x}} + ${d}\\right) dx$?`,
              `$\\int_{${a - r}}^{${a + r}} \\left(\\frac{${c}}{${x}} + ${d}\\right) dx$ 的主值是多少？`,
            ],
            2 * r * d,
            misses,
            [
              [
                ["Cancel the pole part", "抵消极点部分"],
                [
                  `The interval runs ${r} on each side of ${a}, so the two sides give $${c}\\ln\\frac{\\varepsilon}{${r}}$ and $${c}\\ln\\frac{${r}}{\\varepsilon}$, which add to 0.`,
                  `区间在 ${a} 两侧各长 ${r}，所以两边给出 $${c}\\ln\\frac{\\varepsilon}{${r}}$ 和 $${c}\\ln\\frac{${r}}{\\varepsilon}$，相加为 0。`,
                ],
              ],
              [
                ["Integrate the constant", "积分常数"],
                [`The constant gives $${d} \\cdot ${2 * r} = ${2 * r * d}$.`, `常数给出 $${d} \\cdot ${2 * r} = ${2 * r * d}$。`],
              ],
            ],
            [
              `The antiderivative $${c}\\ln|${x}| + ${d}x$ takes the values $${c}\\ln ${r} + ${d} \\cdot ${paren(a + r)}$ and $${c}\\ln ${r} + ${d} \\cdot ${paren(a - r)}$ at the ends; the difference is $${d} \\cdot ${2 * r} = ${2 * r * d}$.`,
              `原函数 $${c}\\ln|${x}| + ${d}x$ 在两端的值是 $${c}\\ln ${r} + ${d} \\cdot ${paren(a + r)}$ 和 $${c}\\ln ${r} + ${d} \\cdot ${paren(a - r)}$；差是 $${d} \\cdot ${2 * r} = ${2 * r * d}$。`,
            ],
          );
        }),
    ),
  ],
);

const keyhole = topic(
  "keyhole-contours-and-branch-cuts",
  ["Keyhole Contours and Branch Cuts", "钥匙孔围道和分支切割"],
  ["Use the jump across a branch cut to evaluate integrals with fractional powers.", "利用分支切割两侧的跃变计算带分数幂的积分。"],
  ["indented-contours-and-principal-values", "complex-powers-and-branches"],
  [],
  [
    point(
      "the-jump-across-the-cut",
      ["The jump across the cut", "切割两侧的跃变"],
      [
        "A keyhole contour runs along both sides of a cut on the positive real axis. Below the cut, the argument of $z$ has grown by $2\\pi$, so a fractional power picks up a constant factor there. For example, at $x = 4$ the power $z^{1/2}$ is 2 just above the cut and $2e^{2\\pi i \\cdot \\frac{1}{2}} = 2e^{\\pi i} = -2$ just below it.\n\nCheck: $(-2)^{2} = 4$, so the value below the cut is still a square root of 4, the other one.\n\n> **Watch out.** The factor is $e^{2\\pi i a}$, not $e^{\\pi i a}$; and for a whole number $a$ it is 1, so there is no jump.",
        "钥匙孔围道沿正实轴切割的两侧走。在切割下方，$z$ 的辐角增加了 $2\\pi$，所以分数幂在那里多一个常数因子。例如，在 $x = 4$ 处，$z^{1/2}$ 在切割正上方是 2，在正下方是 $2e^{2\\pi i \\cdot \\frac{1}{2}} = 2e^{\\pi i} = -2$。\n\n检验：$(-2)^{2} = 4$，所以切割下方的值仍是 4 的平方根，只是另一个。\n\n> **注意。** 因子是 $e^{2\\pi i a}$，不是 $e^{\\pi i a}$；当 $a$ 是整数时它等于 1，没有跃变。",
      ],
      (rng) => {
        const [p, q] = fraction(rng, 30);
        const r = Q.of(p, q).toLatex();
        const slips: Slip[] = [
          [
            same(`e^{\\pi i \\cdot ${r}}`),
            "That adds only $\\pi$ to the argument; going once around the origin adds $2\\pi$.",
            "那只给辐角加了 $\\pi$；绕原点一圈要加 $2\\pi$。",
          ],
          [
            same(`e^{-2\\pi i \\cdot ${r}}`),
            "That has the wrong sign: below the cut the argument is near $2\\pi$, larger than above.",
            "那符号错了：切割下方的辐角接近 $2\\pi$，比上方大。",
          ],
          [
            same("e^{2\\pi i}"),
            `That forgets to multiply the $2\\pi$ by the exponent $${r}$; $e^{2\\pi i}$ is just 1.`,
            `那忘了把 $2\\pi$ 乘以指数 $${r}$；$e^{2\\pi i}$ 就是 1。`,
          ],
        ];
        return chosen(
          rng,
          [
            `With $0 < \\arg z < 2\\pi$, the value of $z^{${r}}$ below the cut is the value above it times which factor?`,
            `当 $0 < \\arg z < 2\\pi$ 时，切割下方 $z^{${r}}$ 的值是上方的值乘哪个因子？`,
          ],
          same(`e^{2\\pi i \\cdot ${r}}`),
          slips,
          [
            [
              ["Compare the arguments", "比较辐角"],
              [
                "Just above the cut $\\arg z$ is near 0, and just below it is near $2\\pi$.",
                "在切割正上方 $\\arg z$ 接近 0，在正下方接近 $2\\pi$。",
              ],
            ],
            [
              ["Raise to the power", "取幂"],
              [
                `$z^{${r}} = |z|^{${r}} e^{i \\cdot ${r} \\arg z}$, so the argument gains $2\\pi \\cdot ${r}$, and the factor is $e^{2\\pi i \\cdot ${r}}$.`,
                `$z^{${r}} = |z|^{${r}} e^{i \\cdot ${r} \\arg z}$，所以辐角增加 $2\\pi \\cdot ${r}$，因子是 $e^{2\\pi i \\cdot ${r}}$。`,
              ],
            ],
          ],
          [
            `Raising the factor to the power ${q} gives $e^{2\\pi i \\cdot ${p}} = 1$, as it must, because $\\left(z^{${r}}\\right)^{${q}} = z^{${p}}$ has no jump.`,
            `把因子取 ${q} 次幂得 $e^{2\\pi i \\cdot ${p}} = 1$，正应如此，因为 $\\left(z^{${r}}\\right)^{${q}} = z^{${p}}$ 没有跃变。`,
          ],
        );
      },
    ),
    point(
      "a-fractional-power-integral",
      ["A fractional power integral", "分数幂积分"],
      [
        "The keyhole method gives $\\int_{0}^{\\infty} \\frac{x^{a-1}}{1 + x}\\, dx = \\frac{\\pi}{\\sin(\\pi a)}$ for $0 < a < 1$. The pole at $-1$ supplies the residue, and the jump across the cut supplies the sine. For example, $\\int_{0}^{\\infty} \\frac{x^{-1/2}}{1 + x}\\, dx$ has $a - 1 = -\\frac{1}{2}$, so $a = \\frac{1}{2}$ and the value is $\\frac{\\pi}{\\sin\\frac{\\pi}{2}} = \\pi$.\n\nCheck: substitute $x = t^{2}$, so $x^{-1/2}\\, dx = 2\\, dt$, and the integral becomes $\\int_{0}^{\\infty} \\frac{2\\, dt}{1 + t^{2}} = 2 \\cdot \\frac{\\pi}{2} = \\pi$.\n\n> **Watch out.** The exponent is $a - 1$, so $a$ is one more than it: $x^{-5/6}$ means $a = \\frac{1}{6}$.",
        "钥匙孔方法给出，当 $0 < a < 1$ 时 $\\int_{0}^{\\infty} \\frac{x^{a-1}}{1 + x}\\, dx = \\frac{\\pi}{\\sin(\\pi a)}$。$-1$ 处的极点提供留数，切割两侧的跃变提供正弦。例如，$\\int_{0}^{\\infty} \\frac{x^{-1/2}}{1 + x}\\, dx$ 中 $a - 1 = -\\frac{1}{2}$，所以 $a = \\frac{1}{2}$，值是 $\\frac{\\pi}{\\sin\\frac{\\pi}{2}} = \\pi$。\n\n检验：令 $x = t^{2}$，则 $x^{-1/2}\\, dx = 2\\, dt$，积分变成 $\\int_{0}^{\\infty} \\frac{2\\, dt}{1 + t^{2}} = 2 \\cdot \\frac{\\pi}{2} = \\pi$。\n\n> **注意。** 指数是 $a - 1$，所以 $a$ 比它大 1：$x^{-5/6}$ 表示 $a = \\frac{1}{6}$。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(1, 15);
          const [e, s, a] = rng.pick([
            ["-\\frac{1}{2}", 1, "\\frac{1}{2}"],
            ["-\\frac{5}{6}", 2, "\\frac{1}{6}"],
            ["-\\frac{1}{6}", 2, "\\frac{5}{6}"],
          ] as [string, number, string][]);
          const misses: Miss[] =
            s === 1
              ? [
                  [
                    2 * k,
                    "That uses $\\frac{2\\pi}{\\sin(\\pi a)}$; the formula has $\\pi$ alone on top.",
                    "那用了 $\\frac{2\\pi}{\\sin(\\pi a)}$；公式分子只有 $\\pi$。",
                  ],
                  [
                    -k,
                    "That takes $a$ to be the exponent $-\\frac{1}{2}$; $a$ is one more than the exponent.",
                    "那把 $a$ 当成指数 $-\\frac{1}{2}$；$a$ 比指数大 1。",
                  ],
                ]
              : [
                  [k, "That takes the sine to be 1; it is $\\frac{1}{2}$.", "那把正弦当成 1；它是 $\\frac{1}{2}$。"],
                  [
                    Q.of(k, 2),
                    "That multiplies by $\\sin(\\pi a) = \\frac{1}{2}$ instead of dividing.",
                    "那乘了 $\\sin(\\pi a) = \\frac{1}{2}$，而不是除。",
                  ],
                  [
                    -2 * k,
                    `That takes $a$ to be the exponent $${e}$; $a$ is one more than the exponent.`,
                    `那把 $a$ 当成指数 $${e}$；$a$ 比指数大 1。`,
                  ],
                ];
          const kk = k === 1 ? "" : `${k} `;
          return worked(
            [
              `$\\int_{0}^{\\infty} \\frac{${kk}x^{${e}}}{1 + x}\\, dx = m\\pi$. What is $m$?`,
              `$\\int_{0}^{\\infty} \\frac{${kk}x^{${e}}}{1 + x}\\, dx = m\\pi$。$m$ 是多少？`,
            ],
            k * s,
            misses,
            [
              [
                ["Find a", "求 a"],
                [`$a - 1 = ${e}$, so $a = ${a}$.`, `$a - 1 = ${e}$，所以 $a = ${a}$。`],
              ],
              [
                ["Use the formula", "用公式"],
                [
                  `$\\sin\\left(${a}\\pi\\right) = ${s === 1 ? "1" : "\\frac{1}{2}"}$, so the integral is $${k} \\cdot ${s === 1 ? "\\pi" : "2\\pi"}$ and $m = ${k * s}$.`,
                  `$\\sin\\left(${a}\\pi\\right) = ${s === 1 ? "1" : "\\frac{1}{2}"}$，所以积分是 $${k} \\cdot ${s === 1 ? "\\pi" : "2\\pi"}$，$m = ${k * s}$。`,
                ],
              ],
            ],
            s === 1
              ? [
                  `Substitute $x = t^{2}$: the integral becomes $${k}\\int_{0}^{\\infty} \\frac{2\\, dt}{1 + t^{2}} = ${k} \\cdot 2 \\cdot \\frac{\\pi}{2} = ${k}\\pi$.`,
                  `令 $x = t^{2}$：积分变成 $${k}\\int_{0}^{\\infty} \\frac{2\\, dt}{1 + t^{2}} = ${k} \\cdot 2 \\cdot \\frac{\\pi}{2} = ${k}\\pi$。`,
                ]
              : [
                  `Substituting $x = \\frac{1}{t}$ turns $\\frac{x^{a-1}}{1 + x}\\, dx$ into $\\frac{t^{-a}}{1 + t}\\, dt$, which trades $a$ for $1 - a$; $\\frac{1}{6}$ and $\\frac{5}{6}$ have the same sine $\\frac{1}{2}$, so both give $${k * s}\\pi$.`,
                  `代换 $x = \\frac{1}{t}$ 把 $\\frac{x^{a-1}}{1 + x}\\, dx$ 变成 $\\frac{t^{-a}}{1 + t}\\, dt$，即把 $a$ 换成 $1 - a$；$\\frac{1}{6}$ 和 $\\frac{5}{6}$ 的正弦都是 $\\frac{1}{2}$，所以都得 $${k * s}\\pi$。`,
                ],
          );
        }),
    ),
    point(
      "an-integral-with-a-logarithm",
      ["An integral with a logarithm", "带对数的积分"],
      [
        "A semicircle with an indentation at the origin handles a logarithm, because $\\log z$ is analytic in the upper half plane. It gives $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + b^{2}}\\, dx = \\frac{\\pi \\ln b}{2b}$. For example, with $b = 2$ the integral is $\\frac{\\pi \\ln 2}{4}$.\n\nCheck: substitute $x = 2t$: the integral becomes $\\frac{1}{2}\\int_{0}^{\\infty} \\frac{\\ln 2 + \\ln t}{t^{2} + 1}\\, dt$. The $\\ln t$ part is 0, because $t \\to \\frac{1}{t}$ turns it into its own negative, and the rest is $\\frac{1}{2} \\cdot \\ln 2 \\cdot \\frac{\\pi}{2} = \\frac{\\pi \\ln 2}{4}$.\n\n> **Watch out.** The denominator is $2b$: the factor $\\frac{1}{2}$ comes from $\\int_{0}^{\\infty} \\frac{dt}{1 + t^{2}} = \\frac{\\pi}{2}$.",
        "在原点凹陷的半圆可以处理对数，因为 $\\log z$ 在上半平面解析。它给出 $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + b^{2}}\\, dx = \\frac{\\pi \\ln b}{2b}$。例如，$b = 2$ 时积分是 $\\frac{\\pi \\ln 2}{4}$。\n\n检验：令 $x = 2t$，积分变成 $\\frac{1}{2}\\int_{0}^{\\infty} \\frac{\\ln 2 + \\ln t}{t^{2} + 1}\\, dt$。$\\ln t$ 部分为 0，因为 $t \\to \\frac{1}{t}$ 把它变成自身的相反数；其余部分是 $\\frac{1}{2} \\cdot \\ln 2 \\cdot \\frac{\\pi}{2} = \\frac{\\pi \\ln 2}{4}$。\n\n> **注意。** 分母是 $2b$：因子 $\\frac{1}{2}$ 来自 $\\int_{0}^{\\infty} \\frac{dt}{1 + t^{2}} = \\frac{\\pi}{2}$。",
      ],
      (rng) => {
        const b = rng.int(2, 40);
        const slips: Slip[] = [
          [
            same(`\\frac{\\pi \\ln ${b}}{${b}}`),
            "That loses the $\\frac{1}{2}$ from $\\int_{0}^{\\infty} \\frac{dt}{1 + t^{2}} = \\frac{\\pi}{2}$.",
            "那丢了 $\\int_{0}^{\\infty} \\frac{dt}{1 + t^{2}} = \\frac{\\pi}{2}$ 中的 $\\frac{1}{2}$。",
          ],
          [
            same(`\\frac{\\pi}{${2 * b}}`),
            `That drops the logarithm; it is $\\int_{0}^{\\infty} \\frac{dx}{x^{2} + ${b * b}}$.`,
            `那丢了对数；这是 $\\int_{0}^{\\infty} \\frac{dx}{x^{2} + ${b * b}}$。`,
          ],
          [same("0"), "That is the value only for $b = 1$; here $\\ln b \\ne 0$.", "那只是 $b = 1$ 时的值；这里 $\\ln b \\ne 0$。"],
        ];
        return chosen(
          rng,
          [
            `Evaluate $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + ${b * b}}\\, dx$.`,
            `计算 $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + ${b * b}}\\, dx$。`,
          ],
          same(`\\frac{\\pi \\ln ${b}}{${2 * b}}`),
          slips,
          [
            [
              ["Rescale", "缩放"],
              [
                `Put $x = ${b}t$: the integral becomes $\\frac{1}{${b}}\\int_{0}^{\\infty} \\frac{\\ln ${b} + \\ln t}{t^{2} + 1}\\, dt$.`,
                `令 $x = ${b}t$：积分变成 $\\frac{1}{${b}}\\int_{0}^{\\infty} \\frac{\\ln ${b} + \\ln t}{t^{2} + 1}\\, dt$。`,
              ],
            ],
            [
              ["Split", "拆开"],
              [
                `The $\\ln t$ part is 0 by $t \\to \\frac{1}{t}$, and the rest is $\\frac{1}{${b}} \\cdot \\ln ${b} \\cdot \\frac{\\pi}{2} = \\frac{\\pi \\ln ${b}}{${2 * b}}$.`,
                `由 $t \\to \\frac{1}{t}$，$\\ln t$ 部分为 0，其余部分是 $\\frac{1}{${b}} \\cdot \\ln ${b} \\cdot \\frac{\\pi}{2} = \\frac{\\pi \\ln ${b}}{${2 * b}}$。`,
              ],
            ],
          ],
          [
            `By residues: the pole $${b}i$ of $\\frac{\\log z}{z^{2} + ${b * b}}$ gives $2\\pi i \\cdot \\frac{\\ln ${b} + \\frac{\\pi i}{2}}{${2 * b}i}$, whose real part $\\frac{\\pi \\ln ${b}}{${b}}$ equals twice the integral, since the negative axis adds the same $\\ln|x|$ part.`,
            `用留数：$\\frac{\\log z}{z^{2} + ${b * b}}$ 的极点 $${b}i$ 给出 $2\\pi i \\cdot \\frac{\\ln ${b} + \\frac{\\pi i}{2}}{${2 * b}i}$，其实部 $\\frac{\\pi \\ln ${b}}{${b}}$ 等于积分的两倍，因为负半轴贡献同样的 $\\ln|x|$ 部分。`,
          ],
        );
      },
    ),
  ],
);

const summing = topic(
  "summing-series-by-residues",
  ["Summing Series by Residues", "用留数求级数的和"],
  ["Turn a sum over the integers into a contour integral with cotangent.", "用余切把对整数的求和变成围道积分。"],
  ["the-residue-theorem"],
  [],
  [
    point(
      "the-residues-of-pi-cot",
      ["The residues of pi cot", "π cot 的留数"],
      [
        "The function $\\pi \\cot(\\pi z)$ has a simple pole at every integer, always with residue 1. So multiplying by $f(z)$ places $f(n)$ as the residue at $n$, and a large contour adds them up. For example, $\\pi \\cot(\\pi z) \\cdot (z^{2} + 1)$ has residue $2^{2} + 1 = 5$ at $z = 2$.\n\nCheck: near 2, $\\sin(\\pi z) \\approx \\pi(z - 2)$ and $\\cos(\\pi z) \\approx 1$, so $\\pi \\cot(\\pi z) \\approx \\frac{1}{z - 2}$, and the product is about $\\frac{5}{z - 2}$.\n\n> **Watch out.** The residue is the value $f(n)$, not its derivative, and a negative $n$ is squared to a positive number.",
        "函数 $\\pi \\cot(\\pi z)$ 在每个整数处都有单极点，留数总是 1。所以乘 $f(z)$ 就使 $f(n)$ 成为 $n$ 处的留数，大围道把它们加起来。例如，$\\pi \\cot(\\pi z) \\cdot (z^{2} + 1)$ 在 $z = 2$ 处的留数是 $2^{2} + 1 = 5$。\n\n检验：在 2 附近，$\\sin(\\pi z) \\approx \\pi(z - 2)$，$\\cos(\\pi z) \\approx 1$，所以 $\\pi \\cot(\\pi z) \\approx \\frac{1}{z - 2}$，乘积约为 $\\frac{5}{z - 2}$。\n\n> **注意。** 留数是值 $f(n)$，不是导数；负的 $n$ 平方后为正。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 9);
          const b = rng.int(-20, 20);
          const n = rng.nonZero(-9, 9);
          const answer = a * n * n + b;
          const misses: Miss[] = [
            [a * n * n, `That leaves out the constant ${b}.`, `那漏掉了常数 ${b}。`],
            [a * n + b, `That does not square ${n}.`, `那没有把 ${n} 平方。`],
            [2 * a * n, "That takes the derivative of the polynomial.", "那求了多项式的导数。"],
          ];
          return worked(
            [
              `What is the residue of $\\pi \\cot(\\pi z) \\cdot (${a}z^{2}${plus(b)})$ at $z = ${n}$?`,
              `$\\pi \\cot(\\pi z) \\cdot (${a}z^{2}${plus(b)})$ 在 $z = ${n}$ 处的留数是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Use residue 1", "用留数 1"],
                [
                  `$\\pi \\cot(\\pi z)$ has residue 1 at ${n}, and the polynomial is analytic there.`,
                  `$\\pi \\cot(\\pi z)$ 在 ${n} 处的留数是 1，而多项式在那里解析。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `The residue is $${a} \\cdot ${paren(n)}^{2}${plus(b)} = ${answer}$.`,
                  `留数是 $${a} \\cdot ${paren(n)}^{2}${plus(b)} = ${answer}$。`,
                ],
              ],
            ],
            [
              `Near ${n}, $\\pi \\cot(\\pi z) = \\frac{1}{${minus(n)}} + \\dots$ and the polynomial is $${answer} + c(${minus(n)}) + \\dots$, so the coefficient of $\\frac{1}{${minus(n)}}$ in the product is ${answer}.`,
              `在 ${n} 附近，$\\pi \\cot(\\pi z) = \\frac{1}{${minus(n)}} + \\dots$，多项式是 $${answer} + c(${minus(n)}) + \\dots$，所以乘积中 $\\frac{1}{${minus(n)}}$ 的系数是 ${answer}。`,
            ],
          );
        }),
    ),
    point(
      "the-residue-at-the-origin",
      ["The residue at the origin", "原点处的留数"],
      [
        "For $f(z) = \\frac{1}{z^{2}}$, the pole at 0 has order three, and the expansion $\\pi \\cot(\\pi z) = \\frac{1}{z} - \\frac{\\pi^{2} z}{3} - \\dots$ gives a residue of $-\\frac{\\pi^{2}}{3}$ there. This is what balances the sum. For example, $\\frac{2\\pi \\cot(\\pi z)}{z^{2}} = \\frac{2}{z^{3}} - \\frac{2\\pi^{2}}{3z} - \\dots$, so its residue at 0 is $-\\frac{2\\pi^{2}}{3}$.\n\nCheck: the residues at the other integers are $\\frac{2}{n^{2}}$, and over all nonzero $n$ they add to $2 \\cdot 2 \\cdot \\frac{\\pi^{2}}{6} = \\frac{2\\pi^{2}}{3}$; all residues add to zero, so the one at 0 is $-\\frac{2\\pi^{2}}{3}$.\n\n> **Watch out.** The coefficient is $\\frac{1}{3}$: $\\cot x = \\frac{1 - \\frac{x^{2}}{2}}{x\\left(1 - \\frac{x^{2}}{6}\\right)} = \\frac{1}{x} - \\frac{x}{3} - \\dots$, not $\\frac{1}{6}$ or $\\frac{1}{2}$.",
        "对 $f(z) = \\frac{1}{z^{2}}$，0 处的极点是三阶的，展开式 $\\pi \\cot(\\pi z) = \\frac{1}{z} - \\frac{\\pi^{2} z}{3} - \\dots$ 给出那里的留数 $-\\frac{\\pi^{2}}{3}$。正是它平衡了求和。例如，$\\frac{2\\pi \\cot(\\pi z)}{z^{2}} = \\frac{2}{z^{3}} - \\frac{2\\pi^{2}}{3z} - \\dots$，所以它在 0 处的留数是 $-\\frac{2\\pi^{2}}{3}$。\n\n检验：其他整数处的留数是 $\\frac{2}{n^{2}}$，对所有非零 $n$ 求和得 $2 \\cdot 2 \\cdot \\frac{\\pi^{2}}{6} = \\frac{2\\pi^{2}}{3}$；所有留数之和为零，所以 0 处的留数是 $-\\frac{2\\pi^{2}}{3}$。\n\n> **注意。** 系数是 $\\frac{1}{3}$：$\\cot x = \\frac{1 - \\frac{x^{2}}{2}}{x\\left(1 - \\frac{x^{2}}{6}\\right)} = \\frac{1}{x} - \\frac{x}{3} - \\dots$，不是 $\\frac{1}{6}$ 或 $\\frac{1}{2}$。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(1, 40);
          const answer = Q.of(-k, 3);
          const misses: Miss[] = [
            [Q.of(k, 3), "That loses the minus sign in the expansion of the cotangent.", "那丢了余切展开式中的负号。"],
            [
              Q.of(-k, 6),
              "That uses the sine's $\\frac{1}{6}$ in place of the cotangent's $\\frac{1}{3}$.",
              "那用了正弦的 $\\frac{1}{6}$，而不是余切的 $\\frac{1}{3}$。",
            ],
            [
              Q.of(-k, 2),
              "That uses the cosine's $\\frac{1}{2}$ in place of the cotangent's $\\frac{1}{3}$.",
              "那用了余弦的 $\\frac{1}{2}$，而不是余切的 $\\frac{1}{3}$。",
            ],
          ];
          const kk = k === 1 ? "" : k;
          return worked(
            [
              `The residue of $\\frac{${kk}\\pi \\cot(\\pi z)}{z^{2}}$ at 0 is $m\\pi^{2}$. What is $m$?`,
              `$\\frac{${kk}\\pi \\cot(\\pi z)}{z^{2}}$ 在 0 处的留数是 $m\\pi^{2}$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Expand", "展开"],
                [
                  "$\\pi \\cot(\\pi z) = \\frac{1}{z} - \\frac{\\pi^{2} z}{3} - \\dots$",
                  "$\\pi \\cot(\\pi z) = \\frac{1}{z} - \\frac{\\pi^{2} z}{3} - \\dots$",
                ],
              ],
              [
                ["Divide and read", "相除并读出"],
                [
                  `Dividing by $z^{2}$, only $-\\frac{\\pi^{2} z}{3}$ gives a $\\frac{1}{z}$ term; times ${k} the residue is $${answer.toLatex()}\\pi^{2}$, so $m = ${answer.toLatex()}$.`,
                  `除以 $z^{2}$ 后，只有 $-\\frac{\\pi^{2} z}{3}$ 给出 $\\frac{1}{z}$ 项；乘 ${k} 后留数是 $${answer.toLatex()}\\pi^{2}$，所以 $m = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The residues at the nonzero integers are $\\frac{${k}}{n^{2}}$, adding to $2 \\cdot ${k} \\cdot \\frac{\\pi^{2}}{6} = ${Q.of(k, 3).toLatex()}\\pi^{2}$; all residues add to zero, so the one at 0 is $${answer.toLatex()}\\pi^{2}$.`,
              `非零整数处的留数是 $\\frac{${k}}{n^{2}}$，相加得 $2 \\cdot ${k} \\cdot \\frac{\\pi^{2}}{6} = ${Q.of(k, 3).toLatex()}\\pi^{2}$；所有留数之和为零，所以 0 处的留数是 $${answer.toLatex()}\\pi^{2}$。`,
            ],
          );
        }),
    ),
    point(
      "summing-the-reciprocal-powers",
      ["Summing the reciprocal powers", "对倒数幂求和"],
      [
        "All the residues on the big contour add to zero, so twice the sum over positive $n$ balances the residue at 0. For squares this gives $\\frac{\\pi^{2}}{6}$, and the same method gives $\\frac{\\pi^{4}}{90}$ for fourth powers. For example, $\\sum_{n \\ge 1} \\frac{3}{n^{2}} = 3 \\cdot \\frac{\\pi^{2}}{6} = \\frac{\\pi^{2}}{2}$.\n\nCheck: the partial sum $1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} \\approx 1.42$ and the tail beyond $n = 4$ is about $\\frac{1}{4}$, giving about $1.67$, close to $\\frac{\\pi^{2}}{6} \\approx 1.64$.\n\n> **Watch out.** The residues at $n$ and $-n$ are equal, so the sum over the nonzero integers is twice the sum over $n \\ge 1$; halve it.",
        "大围道内所有留数之和为零，所以对正整数 $n$ 的和的两倍与 0 处的留数平衡。对平方这给出 $\\frac{\\pi^{2}}{6}$，同样的方法对四次方给出 $\\frac{\\pi^{4}}{90}$。例如，$\\sum_{n \\ge 1} \\frac{3}{n^{2}} = 3 \\cdot \\frac{\\pi^{2}}{6} = \\frac{\\pi^{2}}{2}$。\n\n检验：部分和 $1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} \\approx 1.42$，$n = 4$ 以后的尾部约为 $\\frac{1}{4}$，合计约 $1.67$，接近 $\\frac{\\pi^{2}}{6} \\approx 1.64$。\n\n> **注意。** $n$ 和 $-n$ 处的留数相等，所以对非零整数的和是对 $n \\ge 1$ 的和的两倍；要减半。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(1, 40);
          const four = rng.bool();
          const p = four ? 4 : 2;
          const base = four ? 90 : 6;
          const zero = four ? 45 : 3;
          const answer = Q.of(k, base);
          const misses: Miss[] = [
            [
              Q.of(k, zero),
              "That forgets to halve: the residue at 0 balances the sum over all nonzero integers.",
              "那忘了减半：0 处的留数平衡的是对所有非零整数的和。",
            ],
            [Q.of(k, 2 * base), "That halves twice.", "那减半了两次。"],
            [
              Q.of(k, four ? 6 : 90),
              `That uses the value for ${four ? "squares" : "fourth powers"}.`,
              `那用了${four ? "平方" : "四次方"}的值。`,
            ],
          ];
          return worked(
            [
              `$\\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${p}}} = m\\pi^{${p}}$. What is $m$?`,
              `$\\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${p}}} = m\\pi^{${p}}$。$m$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["The residue at 0", "0 处的留数"],
                [
                  `$\\frac{\\pi \\cot(\\pi z)}{z^{${p}}}$ has residue $-\\frac{\\pi^{${p}}}{${zero}}$ at 0, from the term $-\\frac{${four ? "\\pi^{4}z^{3}}{45" : "\\pi^{2}z}{3"}}$ of the cotangent.`,
                  `$\\frac{\\pi \\cot(\\pi z)}{z^{${p}}}$ 在 0 处的留数是 $-\\frac{\\pi^{${p}}}{${zero}}$，来自余切的 $-\\frac{${four ? "\\pi^{4}z^{3}}{45" : "\\pi^{2}z}{3"}}$ 项。`,
                ],
              ],
              [
                ["Balance and halve", "平衡并减半"],
                [
                  `The residues at $\\pm n$ are $\\frac{1}{n^{${p}}}$, so $2\\sum_{n \\ge 1} \\frac{1}{n^{${p}}} = \\frac{\\pi^{${p}}}{${zero}}$ and the sum is $\\frac{\\pi^{${p}}}{${base}}$; times ${k}, $m = ${answer.toLatex()}$.`,
                  `$\\pm n$ 处的留数是 $\\frac{1}{n^{${p}}}$，所以 $2\\sum_{n \\ge 1} \\frac{1}{n^{${p}}} = \\frac{\\pi^{${p}}}{${zero}}$，和为 $\\frac{\\pi^{${p}}}{${base}}$；乘 ${k}，$m = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            four
              ? [
                  "Numerically $1 + \\frac{1}{16} + \\frac{1}{81} + \\frac{1}{256} \\approx 1.080$, and $\\frac{\\pi^{4}}{90} \\approx 1.082$, which matches.",
                  "数值上 $1 + \\frac{1}{16} + \\frac{1}{81} + \\frac{1}{256} \\approx 1.080$，而 $\\frac{\\pi^{4}}{90} \\approx 1.082$，二者相符。",
                ]
              : [
                  "Numerically $1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} \\approx 1.42$ plus a tail of about $\\frac{1}{4}$ is near 1.64, and $\\frac{\\pi^{2}}{6} \\approx 1.645$, which matches.",
                  "数值上 $1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} \\approx 1.42$，加上约 $\\frac{1}{4}$ 的尾部接近 1.64，而 $\\frac{\\pi^{2}}{6} \\approx 1.645$，二者相符。",
                ],
          );
        }),
    ),
  ],
);

const casorati = topic(
  "the-casorati-weierstrass-theorem",
  ["The Casorati-Weierstrass Theorem", "卡索拉蒂-魏尔斯特拉斯定理"],
  ["See how wildly a function behaves near an essential singularity.", "看函数在本性奇点附近如何剧烈变化。"],
  ["classifying-isolated-singularities"],
  [],
  [
    point(
      "laurent-coefficients-of-an-exponential",
      ["Laurent coefficients of an exponential", "指数函数的洛朗系数"],
      [
        "Substituting $\\frac{a}{z}$ into the exponential series gives infinitely many negative powers. The coefficient of $z^{-n}$ in $e^{a/z}$ is $\\frac{a^{n}}{n!}$, and this infinite tail is the mark of an essential singularity. For example, in $e^{2/z}$ the coefficient of $z^{-3}$ is $\\frac{2^{3}}{3!} = \\frac{8}{6} = \\frac{4}{3}$.\n\nCheck: successive coefficients satisfy $c_{n} = c_{n-1} \\cdot \\frac{a}{n}$, so $c_{1} = 2$, $c_{2} = 2 \\cdot \\frac{2}{2} = 2$ and $c_{3} = 2 \\cdot \\frac{2}{3} = \\frac{4}{3}$.\n\n> **Watch out.** Both the power $a^{n}$ and the factorial $n!$ appear; neither is $a$ alone or $(n + 1)!$.",
        "把 $\\frac{a}{z}$ 代入指数级数，得到无穷多个负幂。$e^{a/z}$ 中 $z^{-n}$ 的系数是 $\\frac{a^{n}}{n!}$，这个无穷的尾部就是本性奇点的标志。例如，$e^{2/z}$ 中 $z^{-3}$ 的系数是 $\\frac{2^{3}}{3!} = \\frac{8}{6} = \\frac{4}{3}$。\n\n检验：相邻系数满足 $c_{n} = c_{n-1} \\cdot \\frac{a}{n}$，所以 $c_{1} = 2$，$c_{2} = 2 \\cdot \\frac{2}{2} = 2$，$c_{3} = 2 \\cdot \\frac{2}{3} = \\frac{4}{3}$。\n\n> **注意。** 幂 $a^{n}$ 和阶乘 $n!$ 都要出现；不是只有 $a$，也不是 $(n + 1)!$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 9);
          const n = rng.int(2, 5);
          const fact = factorial(n);
          const answer = Q.of(a ** n, fact);
          const misses: Miss[] = [
            [Q.of(a, fact), `That uses $${a}$ in place of $${a}^{${n}}$.`, `那用了 $${a}$，而不是 $${a}^{${n}}$。`],
            [Q.of(a ** n, fact * (n + 1)), `That uses $${n + 1}!$ in place of $${n}!$.`, `那用了 $${n + 1}!$，而不是 $${n}!$。`],
            [a ** n, "That leaves out the factorial.", "那漏掉了阶乘。"],
          ];
          const chain = Array.from({ length: n }, (_, i) => i + 1).reduce<{ c: Q; parts: string[] }>(
            (acc, i) => {
              const c = acc.c.mul(Q.of(a, i));
              return { c, parts: [...acc.parts, `c_{${i}} = ${c.toLatex()}`] };
            },
            { c: Q.of(1), parts: [] },
          );
          return worked(
            [
              `What is the coefficient of $z^{-${n}}$ in the Laurent series of $e^{${a}/z}$ at 0?`,
              `$e^{${a}/z}$ 在 0 处的洛朗级数中 $z^{-${n}}$ 的系数是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Substitute", "代入"],
                [
                  `Put $w = \\frac{${a}}{z}$ in $e^{w} = \\sum \\frac{w^{n}}{n!}$; the term with $z^{-${n}}$ is $\\frac{${a}^{${n}}}{${n}!\\, z^{${n}}}$.`,
                  `在 $e^{w} = \\sum \\frac{w^{n}}{n!}$ 中令 $w = \\frac{${a}}{z}$；含 $z^{-${n}}$ 的项是 $\\frac{${a}^{${n}}}{${n}!\\, z^{${n}}}$。`,
                ],
              ],
              [
                ["Compute", "计算"],
                [`$\\frac{${a ** n}}{${fact}} = ${answer.toLatex()}$.`, `$\\frac{${a ** n}}{${fact}} = ${answer.toLatex()}$。`],
              ],
            ],
            [
              `Each coefficient is the one before times $\\frac{${a}}{n}$: $${chain.parts.join(", ")}$.`,
              `每个系数是前一个乘 $\\frac{${a}}{n}$：$${chain.parts.join(", ")}$。`,
            ],
          );
        }),
    ),
    point(
      "naming-the-singularity",
      ["Naming the singularity", "说出奇点的类型"],
      [
        "A removable singularity has no negative powers, a pole has finitely many, and an essential singularity has infinitely many. Casorati and Weierstrass show that near the last kind, values come close to every complex number. For example, $\\frac{e^{2z} - 1}{z} = \\frac{2z + 2z^{2} + \\dots}{z} = 2 + 2z + \\dots$ has no negative powers, so its singularity at 0 is removable, with value 2.\n\nCheck: by l'Hôpital's rule, $\\lim_{z \\to 0} \\frac{e^{2z} - 1}{z} = \\lim_{z \\to 0} 2e^{2z} = 2$, a finite limit, as a removable singularity requires.\n\n> **Watch out.** $\\frac{e^{z}}{z^{3}}$ has a pole, not an essential singularity: the series of $e^{z}$ is infinite, but its negative powers stop at $z^{-3}$.",
        "可去奇点没有负幂，极点有有限个，本性奇点有无穷多个。卡索拉蒂和魏尔斯特拉斯证明，在最后一种奇点附近，函数值可以接近每个复数。例如，$\\frac{e^{2z} - 1}{z} = \\frac{2z + 2z^{2} + \\dots}{z} = 2 + 2z + \\dots$ 没有负幂，所以它在 0 处是可去奇点，值为 2。\n\n检验：由洛必达法则，$\\lim_{z \\to 0} \\frac{e^{2z} - 1}{z} = \\lim_{z \\to 0} 2e^{2z} = 2$，极限有限，正如可去奇点所要求的。\n\n> **注意。** $\\frac{e^{z}}{z^{3}}$ 是极点，不是本性奇点：$e^{z}$ 的级数是无穷的，但负幂只到 $z^{-3}$ 为止。",
      ],
      (rng) => {
        const k = rng.int(2, 30);
        const kind = rng.int(0, 2);
        const names: Pair[] = [
          ["Essential", "本性奇点"],
          ["A pole", "极点"],
          ["Removable", "可去奇点"],
          ["No singularity at all", "根本没有奇点"],
        ];
        const reasons: [string, string][][] = [
          [
            ["", ""],
            ["A pole has only finitely many negative powers; here they never stop.", "极点只有有限个负幂；这里的负幂无穷无尽。"],
            ["A removable singularity has no negative powers; here there are infinitely many.", "可去奇点没有负幂；这里有无穷多个。"],
            ["The function is not defined at 0 and has no limit there.", "函数在 0 处没有定义，在那里也没有极限。"],
          ],
          [
            [`The negative powers stop at $z^{-${k}}$, so there are only finitely many.`, `负幂到 $z^{-${k}}$ 为止，只有有限个。`],
            ["", ""],
            [`The term $z^{-${k}}$ is present, so the function blows up at 0.`, `有 $z^{-${k}}$ 这一项，所以函数在 0 处趋于无穷。`],
            ["The function is not defined at 0 and blows up there.", "函数在 0 处没有定义，并在那里趋于无穷。"],
          ],
          [
            ["There are no negative powers at all.", "根本没有负幂。"],
            [
              `The limit at 0 is ${k}, which is finite, so the function does not blow up.`,
              `在 0 处的极限是 ${k}，是有限的，所以函数不会趋于无穷。`,
            ],
            ["", ""],
            [
              "The formula is not defined at 0 itself, so 0 is a singularity, though a removable one.",
              "这个公式在 0 处本身没有定义，所以 0 是奇点，只是可去的。",
            ],
          ],
        ];
        const slips: Slip[] = names
          .map((name, i) => [name, reasons[kind]?.[i]?.[0] ?? "", reasons[kind]?.[i]?.[1] ?? ""] as const)
          .filter((_, i) => i !== kind);
        const f = kind === 0 ? `e^{${k}/z}` : kind === 1 ? `\\frac{e^{z}}{z^{${k}}}` : `\\frac{e^{${k}z} - 1}{z}`;
        return chosen(
          rng,
          [`What kind of singularity does $${f}$ have at 0?`, `$${f}$ 在 0 处是什么类型的奇点？`],
          names[kind] as Pair,
          slips,
          [
            [
              ["Expand", "展开"],
              kind === 0
                ? [
                    `$e^{${k}/z} = \\sum_{n \\ge 0} \\frac{${k}^{n}}{n!\\, z^{n}}$.`,
                    `$e^{${k}/z} = \\sum_{n \\ge 0} \\frac{${k}^{n}}{n!\\, z^{n}}$。`,
                  ]
                : kind === 1
                  ? [
                      `$\\frac{e^{z}}{z^{${k}}} = \\frac{1}{z^{${k}}} + \\frac{1}{z^{${k - 1}}} + \\dots$`,
                      `$\\frac{e^{z}}{z^{${k}}} = \\frac{1}{z^{${k}}} + \\frac{1}{z^{${k - 1}}} + \\dots$`,
                    ]
                  : [
                      `$\\frac{e^{${k}z} - 1}{z} = ${k} + \\frac{${k * k}}{2}z + \\dots$`,
                      `$\\frac{e^{${k}z} - 1}{z} = ${k} + \\frac{${k * k}}{2}z + \\dots$`,
                    ],
            ],
            [
              ["Count the negative powers", "数负幂"],
              kind === 0
                ? ["Infinitely many negative powers appear, so the singularity is essential.", "出现无穷多个负幂，所以是本性奇点。"]
                : kind === 1
                  ? [
                      `The negative powers stop at $z^{-${k}}$, so it is a pole of order ${k}.`,
                      `负幂到 $z^{-${k}}$ 为止，所以是 ${k} 阶极点。`,
                    ]
                  : ["No negative powers appear, so the singularity is removable.", "没有负幂，所以是可去奇点。"],
            ],
          ],
          kind === 0
            ? [
                `Along the positive reals $e^{${k}/z} \\to \\infty$, while along the negative reals it tends to 0; there is no limit, finite or infinite, so it is neither removable nor a pole.`,
                `沿正实轴 $e^{${k}/z} \\to \\infty$，沿负实轴它趋于 0；既没有有限极限，也不趋于无穷，所以既不是可去奇点也不是极点。`,
              ]
            : kind === 1
              ? [
                  `$|z^{${k}}f(z)| = |e^{z}| \\to 1$, so $|f|$ grows like $\\frac{1}{|z|^{${k}}}$, which is the behavior of a pole of order ${k}.`,
                  `$|z^{${k}}f(z)| = |e^{z}| \\to 1$，所以 $|f|$ 像 $\\frac{1}{|z|^{${k}}}$ 那样增长，这正是 ${k} 阶极点的表现。`,
                ]
              : [
                  `By l'Hôpital's rule the limit at 0 is $${k}e^{0} = ${k}$, which is finite, so the singularity is removable.`,
                  `由洛必达法则，在 0 处的极限是 $${k}e^{0} = ${k}$，是有限的，所以是可去奇点。`,
                ],
        );
      },
    ),
    point(
      "the-value-that-is-missed",
      ["The value that is missed", "取不到的值"],
      [
        "Picard's great theorem strengthens the result: near an essential singularity, a function takes every value infinitely often, with at most one exception. For $e^{1/z}$ the exception is 0, because an exponential never vanishes. For example, $e^{1/z} + 2$ misses only the value 2.\n\nCheck: to reach $w \\ne 2$, solve $e^{1/z} = w - 2$: $\\frac{1}{z} = \\log(w - 2) + 2\\pi i n$, so $z = \\frac{1}{\\log(w - 2) + 2\\pi i n}$, which tends to 0 as $n$ grows; for $w = 2$ we would need $e^{1/z} = 0$, which never happens.\n\n> **Watch out.** Adding a constant shifts the missed value: it is that constant, not 0.",
        "皮卡大定理加强了这个结果：在本性奇点附近，函数取到每个值无穷多次，至多有一个例外。对 $e^{1/z}$，例外是 0，因为指数函数永不为零。例如，$e^{1/z} + 2$ 只取不到值 2。\n\n检验：要取到 $w \\ne 2$，解 $e^{1/z} = w - 2$：$\\frac{1}{z} = \\log(w - 2) + 2\\pi i n$，所以 $z = \\frac{1}{\\log(w - 2) + 2\\pi i n}$，当 $n$ 增大时趋于 0；而 $w = 2$ 需要 $e^{1/z} = 0$，这永远不会发生。\n\n> **注意。** 加上常数会移动取不到的值：它就是那个常数，不是 0。",
      ],
      (rng) =>
        until(() => {
          const c = rng.nonZero(-30, 30);
          const k = rng.int(2, 15);
          const misses: Miss[] = [
            [0, "That is the value the exponential alone misses, before adding the constant.", "那是加常数之前指数函数本身取不到的值。"],
            [
              c + 1,
              `That is $e^{0}${plus(c)}$, but $e^{${k}/z} = 1$ at $z = \\frac{${k}}{2\\pi i n}$, infinitely often near 0.`,
              `那是 $e^{0}${plus(c)}$，但 $e^{${k}/z} = 1$ 在 $z = \\frac{${k}}{2\\pi i n}$ 处成立，在 0 附近无穷多次。`,
            ],
            [-c, "That has the wrong sign.", "那符号错了。"],
          ];
          return worked(
            [
              `Near 0, the function $e^{${k}/z}${plus(c)}$ takes every complex value infinitely often except one. What is that value?`,
              `在 0 附近，函数 $e^{${k}/z}${plus(c)}$ 取到每个复数值无穷多次，只有一个例外。这个值是多少？`,
            ],
            c,
            misses,
            [
              [
                ["The exponential's exception", "指数函数的例外"],
                [
                  `$e^{${k}/z}$ is never 0, and it takes every other value infinitely often near 0.`,
                  `$e^{${k}/z}$ 永不为 0，并且在 0 附近取到其他每个值无穷多次。`,
                ],
              ],
              [
                ["Shift by the constant", "按常数平移"],
                [
                  `Adding $${c}$ shifts every value by $${c}$, so the missed value is $0${plus(c)} = ${c}$.`,
                  `加上 $${c}$ 把每个值平移 $${c}$，所以取不到的值是 $0${plus(c)} = ${c}$。`,
                ],
              ],
            ],
            [
              `For $w \\ne ${c}$, the points $z = \\frac{${k}}{\\log(w${plus(-c)}) + 2\\pi i n}$ give the value $w$ and tend to 0; the value $${c}$ would need $e^{${k}/z} = 0$.`,
              `对 $w \\ne ${c}$，点 $z = \\frac{${k}}{\\log(w${plus(-c)}) + 2\\pi i n}$ 给出值 $w$，且趋于 0；值 $${c}$ 需要 $e^{${k}/z} = 0$。`,
            ],
          );
        }),
    ),
  ],
);

const riemannMapping = topic(
  "the-riemann-mapping-theorem",
  ["The Riemann Mapping Theorem", "黎曼映射定理"],
  [
    "Know which regions can be mapped conformally to the disc, and build some such maps.",
    "知道哪些区域可以共形映到圆盘，并构造一些这样的映射。",
  ],
  ["conformal-maps-of-regions"],
  [],
  [
    point(
      "the-cayley-transform",
      ["The Cayley transform", "凯莱变换"],
      [
        "The map $\\frac{z - i}{z + i}$ sends the upper half plane onto the unit disc, with $i$ going to the center. It is the standard way to move a problem between these two regions. For example, $z = 3i$ goes to $\\frac{3i - i}{3i + i} = \\frac{2i}{4i} = \\frac{1}{2}$.\n\nCheck: the inverse map is $z = i\\frac{1 + w}{1 - w}$, and at $w = \\frac{1}{2}$ it gives $i \\cdot \\frac{3/2}{1/2} = 3i$ back.\n\n> **Watch out.** Points $ai$ with $a > 1$ land on the positive real diameter, and points $\\frac{i}{a}$ below $i$ land on the negative one.",
        "映射 $\\frac{z - i}{z + i}$ 把上半平面映到单位圆盘，$i$ 映到圆心。这是在这两个区域之间转移问题的标准方法。例如，$z = 3i$ 映到 $\\frac{3i - i}{3i + i} = \\frac{2i}{4i} = \\frac{1}{2}$。\n\n检验：逆映射是 $z = i\\frac{1 + w}{1 - w}$，在 $w = \\frac{1}{2}$ 处给出 $i \\cdot \\frac{3/2}{1/2} = 3i$，回到原处。\n\n> **注意。** $a > 1$ 时点 $ai$ 落在正实直径上，而 $i$ 下方的点 $\\frac{i}{a}$ 落在负实直径上。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 40);
          const above = rng.bool();
          const answer = above ? Q.of(a - 1, a + 1) : Q.of(1 - a, a + 1);
          const misses: Miss[] = [
            [
              Q.of(1).div(answer),
              "That turns the fraction upside down, using $\\frac{z + i}{z - i}$.",
              "那把分数颠倒了，用了 $\\frac{z + i}{z - i}$。",
            ],
            [answer.neg(), "That has the wrong sign.", "那符号错了。"],
            [Q.of(1, a + 1), "That drops the $z$ from the numerator.", "那从分子中丢了 $z$。"],
          ];
          const z = above ? `${a}i` : `\\frac{i}{${a}}`;
          return worked(
            [
              `Where does the Cayley transform $\\frac{z - i}{z + i}$ send $z = ${z}$?`,
              `凯莱变换 $\\frac{z - i}{z + i}$ 把 $z = ${z}$ 映到哪里？`,
            ],
            answer,
            misses,
            [
              [
                ["Substitute", "代入"],
                [
                  above
                    ? `$\\frac{${a}i - i}{${a}i + i} = \\frac{${a - 1}i}{${a + 1}i}$.`
                    : `$\\frac{\\frac{i}{${a}} - i}{\\frac{i}{${a}} + i}$; multiply top and bottom by ${a} to get $\\frac{i - ${a}i}{i + ${a}i}$.`,
                  above
                    ? `$\\frac{${a}i - i}{${a}i + i} = \\frac{${a - 1}i}{${a + 1}i}$。`
                    : `$\\frac{\\frac{i}{${a}} - i}{\\frac{i}{${a}} + i}$；分子分母同乘 ${a}，得 $\\frac{i - ${a}i}{i + ${a}i}$。`,
                ],
              ],
              [
                ["Cancel i", "约去 i"],
                [`This leaves $${answer.toLatex()}$.`, `剩下 $${answer.toLatex()}$。`],
              ],
            ],
            [
              `The inverse $z = i\\frac{1 + w}{1 - w}$ at $w = ${answer.toLatex()}$ gives $i \\cdot \\frac{${above ? a : 1}}{${above ? 1 : a}}$, which is $${z}$ again.`,
              `逆映射 $z = i\\frac{1 + w}{1 - w}$ 在 $w = ${answer.toLatex()}$ 处给出 $i \\cdot \\frac{${above ? a : 1}}{${above ? 1 : a}}$，即又回到 $${z}$。`,
            ],
          );
        }),
    ),
    point(
      "which-region-qualifies",
      ["Which region qualifies", "哪个区域符合条件"],
      [
        "Every simply connected region other than the whole plane can be mapped conformally onto the unit disc. The whole plane cannot, because Liouville's theorem would force such a bounded map to be constant. For example, the strip $0 < \\operatorname{Im} z < 1$ qualifies, but the annulus $1 < |z| < 2$ does not, because it has a hole.\n\nCheck: for the strip there is an explicit map: $e^{\\pi z}$ sends it onto the upper half plane, and the Cayley transform then sends that onto the disc.\n\n> **Watch out.** Being unbounded does not matter; what matters is having no holes and not being the whole plane.",
        "除整个平面外，每个单连通区域都能共形映到单位圆盘。整个平面不行，因为刘维尔定理会迫使这样的有界映射成为常数。例如，带形 $0 < \\operatorname{Im} z < 1$ 符合条件，但圆环 $1 < |z| < 2$ 不符合，因为它有洞。\n\n检验：对带形有明确的映射：$e^{\\pi z}$ 把它映到上半平面，凯莱变换再把上半平面映到圆盘。\n\n> **注意。** 无界与否无关紧要；要紧的是没有洞，并且不是整个平面。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const b = a + rng.int(1, 30);
        const slips: Slip[] = [
          [
            same(`\\{z : ${a} < \\operatorname{Im} z < ${b}\\}`),
            `This strip is simply connected: $e^{\\pi (z - ${a}i)/${b - a}}$ opens it onto the upper half plane.`,
            `这个带形是单连通的：$e^{\\pi (z - ${a}i)/${b - a}}$ 把它打开成上半平面。`,
          ],
          [
            same(`\\{z : \\operatorname{Re} z > ${b}\\}`),
            `This half plane is simply connected: $i(z - ${b})$ turns it into the upper half plane.`,
            `这个半平面是单连通的：$i(z - ${b})$ 把它变成上半平面。`,
          ],
          [
            same(`\\{z : |z - ${a}| < ${b}\\}`),
            `This disc maps onto the unit disc by $\\frac{z - ${a}}{${b}}$.`,
            `这个圆盘通过 $\\frac{z - ${a}}{${b}}$ 映到单位圆盘。`,
          ],
        ];
        return chosen(
          rng,
          ["Which region cannot be mapped conformally onto the unit disc?", "哪个区域不能共形映到单位圆盘？"],
          same(`\\{z : ${a} < |z| < ${b}\\}`),
          slips,
          [
            [
              ["Check for holes", "检查有没有洞"],
              [
                `The annulus surrounds the disc $|z| \\le ${a}$, which it leaves out, so the circle $|z| = ${a + b}/2$ inside it cannot shrink to a point.`,
                `圆环围住了它不包含的圆盘 $|z| \\le ${a}$，所以其中的圆 $|z| = ${a + b}/2$ 不能收缩成一点。`,
              ],
            ],
            [
              ["Apply the theorem", "应用定理"],
              [
                "The annulus is not simply connected, so the theorem does not apply, while the other three regions are simply connected and not the whole plane.",
                "圆环不是单连通的，定理不适用；其他三个区域都是单连通的，也不是整个平面。",
              ],
            ],
          ],
          [
            "A conformal map onto the disc would carry loops to loops and shrinkings to shrinkings; every loop in the disc shrinks, so every loop in the region would have to shrink, which fails for the annulus.",
            "到圆盘的共形映射把闭路映成闭路，把收缩映成收缩；圆盘中每个闭路都能收缩，所以区域中每个闭路也必须能收缩，而圆环做不到。",
          ],
        );
      },
    ),
    {
      ...point(
        "opening-a-sector",
        ["Opening a sector", "打开扇形"],
        [
          "A power map multiplies angles at the origin, so it opens a sector of angle $\\alpha$ into the upper half plane when the power is $\\frac{\\pi}{\\alpha}$. Combining this with the Cayley transform maps sectors onto the disc. In the drawing the sector $0 < \\arg z < \\frac{\\pi}{4}$ is opened by $z^{4}$, since $4 \\cdot \\frac{\\pi}{4} = \\pi$, and then the Cayley transform sends the half plane onto the disc.\n\nCheck: the middle ray $\\arg z = \\frac{\\pi}{8}$ goes to $\\arg z = \\frac{\\pi}{2}$, the middle of the half plane; the point $e^{i\\pi/8}$ goes to $i$, which the Cayley transform sends to the center 0.\n\n> **Watch out.** The power is $\\frac{\\pi}{\\alpha}$, not $\\frac{\\alpha}{\\pi}$, and the target angle is $\\pi$, not $2\\pi$.",
          "幂映射使原点处的角度成倍，所以幂为 $\\frac{\\pi}{\\alpha}$ 时，它把角度为 $\\alpha$ 的扇形打开成上半平面。再结合凯莱变换，就把扇形映到圆盘。图中扇形 $0 < \\arg z < \\frac{\\pi}{4}$ 由 $z^{4}$ 打开，因为 $4 \\cdot \\frac{\\pi}{4} = \\pi$，然后凯莱变换把半平面映到圆盘。\n\n检验：中间的射线 $\\arg z = \\frac{\\pi}{8}$ 映到 $\\arg z = \\frac{\\pi}{2}$，即半平面的正中；点 $e^{i\\pi/8}$ 映到 $i$，凯莱变换再把它送到圆心 0。\n\n> **注意。** 幂是 $\\frac{\\pi}{\\alpha}$，不是 $\\frac{\\alpha}{\\pi}$；目标角度是 $\\pi$，不是 $2\\pi$。",
        ],
        (rng) =>
          until(() => {
            const q = rng.int(2, 30);
            const p = rng.int(1, 9);
            if (p >= 2 * q || Q.of(p, q).eq(Q.of(1))) return undefined;
            const answer = Q.of(q, p);
            const misses: Miss[] = [
              [
                Q.of(p, q),
                "That divides the angle by $\\pi$ instead of $\\pi$ by the angle.",
                "那用角度除以 $\\pi$，而不是用 $\\pi$ 除以角度。",
              ],
              [Q.of(2 * q, p), "That opens the sector to the full angle $2\\pi$.", "那把扇形打开到整个角 $2\\pi$。"],
              [
                Q.of(q, 2 * p),
                "That opens the sector only to a quarter plane, angle $\\frac{\\pi}{2}$.",
                "那只把扇形打开到四分之一平面，角度 $\\frac{\\pi}{2}$。",
              ],
            ];
            const angle = piFraction(p, q);
            return worked(
              [
                `Which power $z^{m}$ opens the sector $0 < \\arg z < ${angle}$ onto the upper half plane? Give $m$.`,
                `哪个幂 $z^{m}$ 把扇形 $0 < \\arg z < ${angle}$ 打开成上半平面？给出 $m$。`,
              ],
              answer,
              misses,
              [
                [
                  ["Multiply the angle", "角度相乘"],
                  [
                    `$z^{m}$ sends $0 < \\arg z < ${angle}$ to $0 < \\arg z < m \\cdot ${angle}$.`,
                    `$z^{m}$ 把 $0 < \\arg z < ${angle}$ 映到 $0 < \\arg z < m \\cdot ${angle}$。`,
                  ],
                ],
                [
                  ["Reach pi", "达到 π"],
                  [
                    `The half plane needs $m \\cdot ${angle} = \\pi$, so $m = ${answer.toLatex()}$.`,
                    `上半平面要求 $m \\cdot ${angle} = \\pi$，所以 $m = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The middle ray $\\arg z = ${piFraction(p, 2 * q)}$ goes to $\\arg z = ${answer.toLatex()} \\cdot ${piFraction(p, 2 * q)} = \\frac{\\pi}{2}$, the middle of the upper half plane.`,
                `中间的射线 $\\arg z = ${piFraction(p, 2 * q)}$ 映到 $\\arg z = ${answer.toLatex()} \\cdot ${piFraction(p, 2 * q)} = \\frac{\\pi}{2}$，即上半平面的正中。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-riemann-mapping-theorem#opening-a-sector"],
    },
  ],
);

const joukowski = topic(
  "the-joukowski-map",
  ["The Joukowski Map", "儒科夫斯基映射"],
  ["Turn circles into ellipses and a segment, as in the classical study of airfoils.", "把圆变成椭圆和线段，就像经典的机翼研究那样。"],
  ["conformal-maps"],
  [],
  [
    point(
      "evaluating-the-map",
      ["Evaluating the map", "计算映射"],
      [
        "The Joukowski map sends $z$ to $z + \\frac{1}{z}$. It treats $z$ and $\\frac{1}{z}$ alike, so the outside of the unit disc is mapped one to one and the inside gives the same picture. For example, $J(2) = 2 + \\frac{1}{2} = \\frac{5}{2}$, and $J\\left(\\frac{1}{2}\\right) = \\frac{1}{2} + 2 = \\frac{5}{2}$ as well.\n\nCheck: $J(z) = \\frac{z^{2} + 1}{z}$, and at $z = 2$ this is $\\frac{4 + 1}{2} = \\frac{5}{2}$.\n\n> **Watch out.** $J\\left(\\frac{1}{a}\\right)$ equals $J(a)$, not $\\frac{1}{J(a)}$; and the map adds $\\frac{1}{z}$, it does not subtract it.",
        "儒科夫斯基映射把 $z$ 映到 $z + \\frac{1}{z}$。它对 $z$ 和 $\\frac{1}{z}$ 一视同仁，所以单位圆外部是一一映射，内部给出相同的图像。例如，$J(2) = 2 + \\frac{1}{2} = \\frac{5}{2}$，而 $J\\left(\\frac{1}{2}\\right) = \\frac{1}{2} + 2 = \\frac{5}{2}$ 也一样。\n\n检验：$J(z) = \\frac{z^{2} + 1}{z}$，在 $z = 2$ 处是 $\\frac{4 + 1}{2} = \\frac{5}{2}$。\n\n> **注意。** $J\\left(\\frac{1}{a}\\right)$ 等于 $J(a)$，不是 $\\frac{1}{J(a)}$；映射是加上 $\\frac{1}{z}$，不是减去。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 25);
          const k = rng.int(1, 9);
          const inverse = rng.bool();
          const answer = Q.of(k * (a * a + 1), a);
          const misses: Miss[] = [
            [Q.of(k * (a * a - 1), a), "That subtracts $\\frac{1}{z}$ instead of adding it.", "那减去了 $\\frac{1}{z}$，而不是加上。"],
            [
              Q.of(a, k * (a * a + 1)),
              "That turns the answer upside down; $J\\left(\\frac{1}{a}\\right)$ equals $J(a)$.",
              "那把答案颠倒了；$J\\left(\\frac{1}{a}\\right)$ 等于 $J(a)$。",
            ],
            [k * a, "That leaves out the $\\frac{1}{z}$ term.", "那漏掉了 $\\frac{1}{z}$ 项。"],
          ];
          const kk = k === 1 ? "" : k;
          const z = inverse ? `\\frac{1}{${a}}` : `${a}`;
          return worked(
            [
              `Let $J(z) = ${kk}\\left(z + \\frac{1}{z}\\right)$. What is $J\\left(${z}\\right)$?`,
              `设 $J(z) = ${kk}\\left(z + \\frac{1}{z}\\right)$。$J\\left(${z}\\right)$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Add the reciprocal", "加上倒数"],
                [
                  `$${z} + ${inverse ? a : `\\frac{1}{${a}}`} = \\frac{${a * a + 1}}{${a}}$.`,
                  `$${z} + ${inverse ? a : `\\frac{1}{${a}}`} = \\frac{${a * a + 1}}{${a}}$。`,
                ],
              ],
              [
                ["Scale", "乘系数"],
                [
                  `$${k} \\cdot \\frac{${a * a + 1}}{${a}} = ${answer.toLatex()}$.`,
                  `$${k} \\cdot \\frac{${a * a + 1}}{${a}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Write $J(z) = ${kk}\\frac{z^{2} + 1}{z}$: at $z = ${z}$ this is $${k} \\cdot ${inverse ? `\\frac{1/${a * a} + 1}{1/${a}}` : `\\frac{${a * a} + 1}{${a}}`} = ${answer.toLatex()}$.`,
              `写成 $J(z) = ${kk}\\frac{z^{2} + 1}{z}$：在 $z = ${z}$ 处是 $${k} \\cdot ${inverse ? `\\frac{1/${a * a} + 1}{1/${a}}` : `\\frac{${a * a} + 1}{${a}}`} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "the-ellipse-from-a-circle",
        ["The ellipse from a circle", "由圆得到椭圆"],
        [
          "The circle $|z| = R$ with $R > 1$ goes to an ellipse with semi axes $R + \\frac{1}{R}$ and $R - \\frac{1}{R}$. Larger circles become rounder, since the term $\\frac{1}{R}$ then matters less. In the drawing $R = 2$: writing $z = 2e^{i\\theta}$ gives $z + \\frac{1}{z} = \\frac{5}{2}\\cos\\theta + \\frac{3}{2}i\\sin\\theta$, an ellipse with semi axes $\\frac{5}{2}$ and $\\frac{3}{2}$.\n\nCheck: the point $z = 2$ goes to $\\frac{5}{2}$ on the real axis, and $z = 2i$ goes to $2i + \\frac{1}{2i} = 2i - \\frac{i}{2} = \\frac{3}{2}i$ on the imaginary axis.\n\n> **Watch out.** The minor semi axis subtracts: it is $R - \\frac{1}{R}$, which shrinks to 0 as $R$ approaches 1.",
          "$R > 1$ 时，圆 $|z| = R$ 映到半轴为 $R + \\frac{1}{R}$ 和 $R - \\frac{1}{R}$ 的椭圆。圆越大越接近圆形，因为 $\\frac{1}{R}$ 这一项的作用越小。图中 $R = 2$：写 $z = 2e^{i\\theta}$，得 $z + \\frac{1}{z} = \\frac{5}{2}\\cos\\theta + \\frac{3}{2}i\\sin\\theta$，是半轴为 $\\frac{5}{2}$ 和 $\\frac{3}{2}$ 的椭圆。\n\n检验：点 $z = 2$ 映到实轴上的 $\\frac{5}{2}$，$z = 2i$ 映到 $2i + \\frac{1}{2i} = 2i - \\frac{i}{2} = \\frac{3}{2}i$，在虚轴上。\n\n> **注意。** 短半轴是减法：$R - \\frac{1}{R}$，当 $R$ 接近 1 时它缩到 0。",
        ],
        (rng) =>
          until(() => {
            const q = rng.int(1, 9);
            const p = q + rng.int(1, 9);
            const major = rng.bool();
            const r = Q.of(p, q);
            const inv = Q.of(q, p);
            const answer = major ? r.add(inv) : r.sub(inv);
            const misses: Miss[] = major
              ? [
                  [r.sub(inv), "That is the minor semi axis, $R - \\frac{1}{R}$.", "那是短半轴 $R - \\frac{1}{R}$。"],
                  [r, "That is the radius itself; the map adds $\\frac{1}{R}$.", "那是半径本身；映射还要加上 $\\frac{1}{R}$。"],
                  [r.mul(Q.of(2)), "That doubles $R$ instead of adding $\\frac{1}{R}$.", "那把 $R$ 加倍了，而不是加上 $\\frac{1}{R}$。"],
                ]
              : [
                  [r.add(inv), "That is the major semi axis, $R + \\frac{1}{R}$.", "那是长半轴 $R + \\frac{1}{R}$。"],
                  [r, "That is the radius itself; the map changes it.", "那是半径本身；映射改变了它。"],
                  [inv, "That keeps only $\\frac{1}{R}$.", "那只保留了 $\\frac{1}{R}$。"],
                ];
            const sign = major ? "+" : "-";
            return worked(
              [
                `What is the ${major ? "major" : "minor"} semi axis of the image of $|z| = ${r.toLatex()}$ under $z + \\frac{1}{z}$?`,
                `$|z| = ${r.toLatex()}$ 在 $z + \\frac{1}{z}$ 下的像的半${major ? "长" : "短"}轴是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Parametrize", "参数化"],
                  [
                    "With $z = Re^{i\\theta}$, $z + \\frac{1}{z} = \\left(R + \\frac{1}{R}\\right)\\cos\\theta + i\\left(R - \\frac{1}{R}\\right)\\sin\\theta$.",
                    "取 $z = Re^{i\\theta}$，$z + \\frac{1}{z} = \\left(R + \\frac{1}{R}\\right)\\cos\\theta + i\\left(R - \\frac{1}{R}\\right)\\sin\\theta$。",
                  ],
                ],
                [
                  ["Compute", "计算"],
                  [
                    `$R ${sign} \\frac{1}{R} = ${r.toLatex()} ${sign} ${inv.toLatex()} = ${answer.toLatex()}$.`,
                    `$R ${sign} \\frac{1}{R} = ${r.toLatex()} ${sign} ${inv.toLatex()} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              major
                ? [
                    `The point $z = ${r.toLatex()}$ on the real axis goes to $${r.toLatex()} + ${inv.toLatex()} = ${answer.toLatex()}$, the end of the major axis.`,
                    `实轴上的点 $z = ${r.toLatex()}$ 映到 $${r.toLatex()} + ${inv.toLatex()} = ${answer.toLatex()}$，即长轴的端点。`,
                  ]
                : [
                    `The point $z = ${r.toLatex()}i$ goes to $${r.toLatex()}i + \\frac{1}{${r.toLatex()}i} = ${r.toLatex()}i - ${inv.toLatex()}i = ${answer.toLatex()}i$, the end of the minor axis.`,
                    `点 $z = ${r.toLatex()}i$ 映到 $${r.toLatex()}i + \\frac{1}{${r.toLatex()}i} = ${r.toLatex()}i - ${inv.toLatex()}i = ${answer.toLatex()}i$，即短轴的端点。`,
                  ],
            );
          }),
      ),
      figure: complexDrawings2["the-joukowski-map#the-ellipse-from-a-circle"],
    },
    {
      ...point(
        "the-unit-circle-collapses",
        ["The unit circle collapses", "单位圆塌缩"],
        [
          "On the unit circle $\\frac{1}{z}$ is the conjugate of $z$, so $z + \\frac{1}{z}$ is twice the real part. The whole circle therefore collapses onto a real segment, traversed back and forth. In the drawing, $z = e^{i\\theta}$ goes to $2\\cos\\theta$: the upper half circle runs from 2 down to $-2$, and the lower half runs back, covering the segment from $-2$ to 2 twice.\n\nCheck: $z = i$ goes to $i + \\frac{1}{i} = i - i = 0$, the midpoint, and $2\\cos\\frac{\\pi}{2} = 0$ agrees.\n\n> **Watch out.** The segment has length 4, even though the path covers it twice, for a total of 8.",
          "在单位圆上，$\\frac{1}{z}$ 是 $z$ 的共轭，所以 $z + \\frac{1}{z}$ 是实部的两倍。因此整个圆塌缩到一条实线段上，并被来回走过。图中 $z = e^{i\\theta}$ 映到 $2\\cos\\theta$：上半圆从 2 走到 $-2$，下半圆再走回来，把从 $-2$ 到 2 的线段走了两遍。\n\n检验：$z = i$ 映到 $i + \\frac{1}{i} = i - i = 0$，即中点，与 $2\\cos\\frac{\\pi}{2} = 0$ 一致。\n\n> **注意。** 线段的长度是 4，尽管路径把它走了两遍，总共走了 8。",
        ],
        (rng) =>
          until(() => {
            const k = rng.int(2, 40);
            const misses: Miss[] = [
              [2 * k, `That stops at 0; the segment runs from $-${2 * k}$ to ${2 * k}.`, `那只到 0 为止；线段从 $-${2 * k}$ 到 ${2 * k}。`],
              [8 * k, "That counts the segment twice, once for each half circle.", "那把线段算了两次，每个半圆一次。"],
              [
                k,
                `That forgets that $z + \\frac{1}{z} = 2\\cos\\theta$ reaches 2, not 1.`,
                `那忘了 $z + \\frac{1}{z} = 2\\cos\\theta$ 能达到 2，而不是 1。`,
              ],
            ];
            return worked(
              [
                `What is the length of the image of $|z| = 1$ under $${k}\\left(z + \\frac{1}{z}\\right)$?`,
                `$|z| = 1$ 在 $${k}\\left(z + \\frac{1}{z}\\right)$ 下的像的长度是多少？`,
              ],
              4 * k,
              misses,
              [
                [
                  ["Use the conjugate", "利用共轭"],
                  [
                    `On $|z| = 1$, $\\frac{1}{z} = \\bar{z}$, so $${k}\\left(z + \\frac{1}{z}\\right) = ${2 * k}\\cos\\theta$.`,
                    `在 $|z| = 1$ 上，$\\frac{1}{z} = \\bar{z}$，所以 $${k}\\left(z + \\frac{1}{z}\\right) = ${2 * k}\\cos\\theta$。`,
                  ],
                ],
                [
                  ["Measure the segment", "量线段"],
                  [
                    `The values fill $[-${2 * k}, ${2 * k}]$, whose length is ${4 * k}.`,
                    `值充满 $[-${2 * k}, ${2 * k}]$，长度是 ${4 * k}。`,
                  ],
                ],
              ],
              [
                `The ends come from $z = 1$ and $z = -1$, giving ${2 * k} and $-${2 * k}$, and $\\left|${k}\\left(z + \\frac{1}{z}\\right)\\right| \\le ${k}(1 + 1) = ${2 * k}$ shows nothing goes further.`,
                `端点来自 $z = 1$ 和 $z = -1$，给出 ${2 * k} 和 $-${2 * k}$；而 $\\left|${k}\\left(z + \\frac{1}{z}\\right)\\right| \\le ${k}(1 + 1) = ${2 * k}$ 说明没有点更远。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-joukowski-map#the-unit-circle-collapses"],
    },
  ],
);

const dirichlet = topic(
  "the-dirichlet-problem-on-simple-regions",
  ["The Dirichlet Problem on Simple Regions", "简单区域上的狄利克雷问题"],
  ["Find a harmonic function with given boundary values on a disc or half plane.", "在圆盘或半平面上求具有给定边界值的调和函数。"],
  ["the-mean-value-property-and-moreras-theorem"],
  [],
  [
    point(
      "a-boundary-cosine-on-a-disc",
      ["A boundary cosine on a disc", "圆盘边界上的余弦"],
      [
        "The function $r^{n} \\cos(n\\theta)$ is the real part of $z^{n}$, so it is harmonic. To match the boundary value $A \\cos(n\\theta)$ on radius $R$, scale it to $A \\left(\\frac{r}{R}\\right)^{n} \\cos(n\\theta)$. For example, with $R = 2$ and boundary value $3\\cos(2\\theta)$, the value at $r = 1$, $\\theta = 0$ is $3 \\cdot \\left(\\frac{1}{2}\\right)^{2} = \\frac{3}{4}$.\n\nCheck: the solution is $\\frac{3}{4}\\operatorname{Re}(z^{2}) = \\frac{3}{4}(x^{2} - y^{2})$, which is harmonic and equals $\\frac{3}{4}$ at $(1, 0)$.\n\n> **Watch out.** The power on $\\frac{r}{R}$ is the frequency $n$ of the cosine, not 1.",
        "函数 $r^{n} \\cos(n\\theta)$ 是 $z^{n}$ 的实部，所以是调和函数。要在半径 $R$ 上匹配边界值 $A \\cos(n\\theta)$，把它缩放成 $A \\left(\\frac{r}{R}\\right)^{n} \\cos(n\\theta)$。例如，$R = 2$，边界值为 $3\\cos(2\\theta)$ 时，在 $r = 1$、$\\theta = 0$ 处的值是 $3 \\cdot \\left(\\frac{1}{2}\\right)^{2} = \\frac{3}{4}$。\n\n检验：解是 $\\frac{3}{4}\\operatorname{Re}(z^{2}) = \\frac{3}{4}(x^{2} - y^{2})$，它是调和的，在 $(1, 0)$ 处等于 $\\frac{3}{4}$。\n\n> **注意。** $\\frac{r}{R}$ 的幂是余弦的频率 $n$，不是 1。",
      ],
      (rng) =>
        until(() => {
          const big = rng.int(2, 12);
          const r = rng.int(1, big - 1);
          const n = rng.int(2, 5);
          const a = rng.int(2, 30);
          const answer = Q.of(a * r ** n, big ** n);
          const misses: Miss[] = [
            [a, "That uses the boundary value; inside the disc the cosine term shrinks.", "那用了边界值；在圆盘内部余弦项会缩小。"],
            [Q.of(a * r, big), `That uses the power 1 in place of ${n}.`, `那用了幂 1，而不是 ${n}。`],
            [Q.of(a * r ** n, big ** (n + 1)), `That divides by one extra factor of ${big}.`, `那多除了一个因子 ${big}。`],
          ];
          return worked(
            [
              `$u$ is harmonic on $r < ${big}$, with $u = ${a}\\cos(${n}\\theta)$ on the boundary. What is $u$ at $r = ${r}$, $\\theta = 0$?`,
              `$u$ 在 $r < ${big}$ 上调和，边界上 $u = ${a}\\cos(${n}\\theta)$。$u$ 在 $r = ${r}$、$\\theta = 0$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Write the solution", "写出解"],
                [
                  `$u = ${a}\\left(\\frac{r}{${big}}\\right)^{${n}}\\cos(${n}\\theta)$, which is harmonic and matches on $r = ${big}$.`,
                  `$u = ${a}\\left(\\frac{r}{${big}}\\right)^{${n}}\\cos(${n}\\theta)$，它是调和的，并在 $r = ${big}$ 上吻合。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `At $r = ${r}$, $\\theta = 0$: $${a} \\cdot \\left(${Q.of(r, big).toLatex()}\\right)^{${n}} = ${answer.toLatex()}$.`,
                  `在 $r = ${r}$、$\\theta = 0$ 处：$${a} \\cdot \\left(${Q.of(r, big).toLatex()}\\right)^{${n}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$u = \\frac{${a}}{${big ** n}}\\operatorname{Re}(z^{${n}})$, and at $z = ${r}$ this is $\\frac{${a} \\cdot ${r ** n}}{${big ** n}} = ${answer.toLatex()}$, below the boundary maximum ${a} as the maximum principle requires.`,
              `$u = \\frac{${a}}{${big ** n}}\\operatorname{Re}(z^{${n}})$，在 $z = ${r}$ 处是 $\\frac{${a} \\cdot ${r ** n}}{${big ** n}} = ${answer.toLatex()}$，小于边界最大值 ${a}，符合最大值原理。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "the-center-value",
        ["The center value", "圆心的值"],
        [
          "The mean value property gives the value at the center directly, as the average of the boundary data. Over a full circle, all the sines and cosines of positive multiples of $\\theta$ average to zero. In the drawing the boundary data $3 + 2\\cos\\theta + \\sin(2\\theta)$ swings above and below the level 3, and its average, the center value, is 3.\n\nCheck: building the solution term by term gives $u = 3 + 2\\frac{r}{R}\\cos\\theta + \\left(\\frac{r}{R}\\right)^{2}\\sin(2\\theta)$, and at $r = 0$ this is 3.\n\n> **Watch out.** The center value is the average, not the boundary value at $\\theta = 0$, which here is $3 + 2 = 5$.",
          "平均值性质直接给出圆心的值，即边界数据的平均。在整个圆周上，$\\theta$ 的正整数倍的正弦和余弦的平均都是零。图中边界数据 $3 + 2\\cos\\theta + \\sin(2\\theta)$ 在水平线 3 上下摆动，它的平均即圆心的值是 3。\n\n检验：逐项构造解，得 $u = 3 + 2\\frac{r}{R}\\cos\\theta + \\left(\\frac{r}{R}\\right)^{2}\\sin(2\\theta)$，在 $r = 0$ 处是 3。\n\n> **注意。** 圆心的值是平均值，不是 $\\theta = 0$ 处的边界值，那里是 $3 + 2 = 5$。",
        ],
        (rng) =>
          until(() => {
            const [a, b, c] = [rng.nonZero(-30, 30), rng.int(2, 15), rng.int(2, 15)];
            const big = rng.int(2, 12);
            const misses: Miss[] = [
              [a + b, "That is the boundary value at $\\theta = 0$, not the average.", "那是 $\\theta = 0$ 处的边界值，不是平均值。"],
              [a + b + c, "That adds the amplitudes; the oscillating terms average to zero.", "那把振幅加起来了；振荡项的平均为零。"],
              [b + c, "That drops the constant and keeps the oscillating terms.", "那丢了常数，留下了振荡项。"],
            ];
            return worked(
              [
                `$u$ is harmonic on $r < ${big}$, and on the boundary $u = ${a} + ${b}\\cos\\theta + ${c}\\sin(2\\theta)$. What is $u$ at the center?`,
                `$u$ 在 $r < ${big}$ 上调和，边界上 $u = ${a} + ${b}\\cos\\theta + ${c}\\sin(2\\theta)$。$u$ 在圆心的值是多少？`,
              ],
              a,
              misses,
              [
                [
                  ["Use the mean value property", "用平均值性质"],
                  [
                    `$u(0) = \\frac{1}{2\\pi}\\int_{0}^{2\\pi} u(${big}e^{i\\theta})\\, d\\theta$.`,
                    `$u(0) = \\frac{1}{2\\pi}\\int_{0}^{2\\pi} u(${big}e^{i\\theta})\\, d\\theta$。`,
                  ],
                ],
                [
                  ["Average each term", "逐项求平均"],
                  [
                    `$\\cos\\theta$ and $\\sin(2\\theta)$ average to 0 over a full turn, which leaves $${a}$.`,
                    `$\\cos\\theta$ 和 $\\sin(2\\theta)$ 在一整圈上的平均为 0，剩下 $${a}$。`,
                  ],
                ],
              ],
              [
                `Term by term the solution is $u = ${a} + ${b}\\frac{r}{${big}}\\cos\\theta + ${c}\\left(\\frac{r}{${big}}\\right)^{2}\\sin(2\\theta)$, and at $r = 0$ it is $${a}$.`,
                `逐项得解 $u = ${a} + ${b}\\frac{r}{${big}}\\cos\\theta + ${c}\\left(\\frac{r}{${big}}\\right)^{2}\\sin(2\\theta)$，在 $r = 0$ 处是 $${a}$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-dirichlet-problem-on-simple-regions#the-center-value"],
    },
    point(
      "a-half-plane-with-two-values",
      ["A half plane with two values", "取两个值的半平面"],
      [
        "The argument $\\theta$ is harmonic, being the imaginary part of $\\log z$. So in the upper half plane, the function $c + (d - c)\\frac{\\theta}{\\pi}$ equals $c$ on the positive axis and $d$ on the negative axis. For example, with 1 on the positive axis and 5 on the negative axis, the value where $\\theta = \\frac{\\pi}{4}$ is $1 + 4 \\cdot \\frac{1}{4} = 2$.\n\nCheck: on the imaginary axis, $\\theta = \\frac{\\pi}{2}$, the value is the average $\\frac{1 + 5}{2} = 3$; the ray $\\theta = \\frac{\\pi}{4}$ is halfway between 0 and $\\frac{\\pi}{2}$, and 2 is halfway between 1 and 3.\n\n> **Watch out.** Divide $\\theta$ by $\\pi$, the angle of the half plane, not by $2\\pi$.",
        "辐角 $\\theta$ 是调和函数，因为它是 $\\log z$ 的虚部。所以在上半平面，函数 $c + (d - c)\\frac{\\theta}{\\pi}$ 在正半轴上等于 $c$，在负半轴上等于 $d$。例如，正半轴上为 1、负半轴上为 5 时，在 $\\theta = \\frac{\\pi}{4}$ 处的值是 $1 + 4 \\cdot \\frac{1}{4} = 2$。\n\n检验：在虚轴上 $\\theta = \\frac{\\pi}{2}$，值是平均 $\\frac{1 + 5}{2} = 3$；射线 $\\theta = \\frac{\\pi}{4}$ 在 0 和 $\\frac{\\pi}{2}$ 正中间，而 2 在 1 和 3 正中间。\n\n> **注意。** 用 $\\theta$ 除以半平面的角 $\\pi$，不是 $2\\pi$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(-20, 20);
          const d = c + rng.int(1, 40);
          const [p, q] = fraction(rng, 12);
          const ratio = Q.of(p, q);
          const answer = Q.of(c).add(Q.of(d - c).mul(ratio));
          const misses: Miss[] = [
            [Q.of(d).sub(Q.of(d - c).mul(ratio)), "That measures the angle from the negative axis.", "那从负半轴量角度。"],
            [Q.of(c + d, 2), "That takes the average, which holds only on the imaginary axis.", "那取了平均值，它只在虚轴上成立。"],
            [
              Q.of(c).add(
                Q.of(d - c)
                  .mul(ratio)
                  .div(Q.of(2)),
              ),
              "That divides $\\theta$ by $2\\pi$ instead of $\\pi$.",
              "那用 $\\theta$ 除以 $2\\pi$，而不是 $\\pi$。",
            ],
          ];
          const rest = Q.of(q - p, q);
          return worked(
            [
              `$u$ is bounded and harmonic in the upper half plane, equal to $${c}$ on the positive real axis and $${d}$ on the negative real axis. What is $u$ where $\\theta = ${piFraction(p, q)}$?`,
              `$u$ 在上半平面有界且调和，在正实轴上等于 $${c}$，在负实轴上等于 $${d}$。$u$ 在 $\\theta = ${piFraction(p, q)}$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Write the solution", "写出解"],
                [
                  `$u = ${c} + ${d - c}\\frac{\\theta}{\\pi}$, which is harmonic and takes the two boundary values.`,
                  `$u = ${c} + ${d - c}\\frac{\\theta}{\\pi}$，它是调和的，并取到两个边界值。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `$\\frac{\\theta}{\\pi} = ${ratio.toLatex()}$, so $u = ${c} + ${d - c} \\cdot ${ratio.toLatex()} = ${answer.toLatex()}$.`,
                  `$\\frac{\\theta}{\\pi} = ${ratio.toLatex()}$，所以 $u = ${c} + ${d - c} \\cdot ${ratio.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `From the negative axis the angle is $\\pi - \\theta$, a fraction $${rest.toLatex()}$ of $\\pi$, so $u = ${d} - ${d - c} \\cdot ${rest.toLatex()} = ${answer.toLatex()}$ again.`,
              `从负半轴量，角度是 $\\pi - \\theta$，占 $\\pi$ 的 $${rest.toLatex()}$，所以 $u = ${d} - ${d - c} \\cdot ${rest.toLatex()} = ${answer.toLatex()}$，结果相同。`,
            ],
          );
        }),
    ),
  ],
);

const poisson = topic(
  "the-poisson-integral-formula",
  ["The Poisson Integral Formula", "泊松积分公式"],
  ["Recover a harmonic function from its boundary values, using the Poisson kernel.", "用泊松核由边界值恢复调和函数。"],
  ["the-dirichlet-problem-on-simple-regions"],
  [],
  [
    point(
      "the-kernel-at-its-peak",
      ["The kernel at its peak", "核的峰值"],
      [
        "The Poisson kernel on the unit disc is $\\frac{1 - r^{2}}{1 - 2r\\cos\\theta + r^{2}}$, the weight given to boundary data. At $\\theta = 0$ it simplifies to $\\frac{1 + r}{1 - r}$, which is large when $r$ is near 1. For example, at $r = \\frac{1}{2}$ it is $\\frac{1 - \\frac{1}{4}}{1 - 1 + \\frac{1}{4}} = \\frac{3/4}{1/4} = 3$.\n\nCheck: $\\frac{1 + r}{1 - r} = \\frac{3/2}{1/2} = 3$, the same, because $1 - r^{2} = (1 - r)(1 + r)$ and $1 - 2r + r^{2} = (1 - r)^{2}$.\n\n> **Watch out.** At $\\theta = 0$ the denominator is $(1 - r)^{2}$, not $1 - r^{2}$.",
        "单位圆盘上的泊松核是 $\\frac{1 - r^{2}}{1 - 2r\\cos\\theta + r^{2}}$，它是边界数据的权。在 $\\theta = 0$ 处化简为 $\\frac{1 + r}{1 - r}$，当 $r$ 接近 1 时很大。例如，在 $r = \\frac{1}{2}$ 处它是 $\\frac{1 - \\frac{1}{4}}{1 - 1 + \\frac{1}{4}} = \\frac{3/4}{1/4} = 3$。\n\n检验：$\\frac{1 + r}{1 - r} = \\frac{3/2}{1/2} = 3$，结果相同，因为 $1 - r^{2} = (1 - r)(1 + r)$，$1 - 2r + r^{2} = (1 - r)^{2}$。\n\n> **注意。** 在 $\\theta = 0$ 处分母是 $(1 - r)^{2}$，不是 $1 - r^{2}$。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = fraction(rng, 30);
          const r = Q.of(p, q);
          const answer = Q.of(q + p, q - p);
          const misses: Miss[] = [
            [Q.of(q - p, q + p), "That is the value at the opposite point, $\\theta = \\pi$.", "那是对面 $\\theta = \\pi$ 处的值。"],
            [Q.of(q * q - p * p, q * q), "That keeps only the numerator $1 - r^{2}$.", "那只保留了分子 $1 - r^{2}$。"],
            [Q.of(q + p, q), "That keeps only $1 + r$ and forgets to divide by $1 - r$.", "那只保留了 $1 + r$，忘了除以 $1 - r$。"],
          ];
          const num = Q.of(1).sub(r.mul(r));
          const den = Q.of(1).sub(r).mul(Q.of(1).sub(r));
          return worked(
            [
              `What is the Poisson kernel at $r = ${r.toLatex()}$, $\\theta = 0$?`,
              `泊松核在 $r = ${r.toLatex()}$、$\\theta = 0$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Factor", "因式分解"],
                [
                  "At $\\theta = 0$: $\\frac{1 - r^{2}}{(1 - r)^{2}} = \\frac{(1 - r)(1 + r)}{(1 - r)^{2}} = \\frac{1 + r}{1 - r}$.",
                  "在 $\\theta = 0$ 处：$\\frac{1 - r^{2}}{(1 - r)^{2}} = \\frac{(1 - r)(1 + r)}{(1 - r)^{2}} = \\frac{1 + r}{1 - r}$。",
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `$\\frac{1 + ${r.toLatex()}}{1 - ${r.toLatex()}} = ${answer.toLatex()}$.`,
                  `$\\frac{1 + ${r.toLatex()}}{1 - ${r.toLatex()}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Directly: $1 - r^{2} = ${num.toLatex()}$ and $(1 - r)^{2} = ${den.toLatex()}$, and $${num.toLatex()} \\div ${den.toLatex()} = ${answer.toLatex()}$.`,
              `直接算：$1 - r^{2} = ${num.toLatex()}$，$(1 - r)^{2} = ${den.toLatex()}$，$${num.toLatex()} \\div ${den.toLatex()} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "the-kernel-at-the-opposite-point",
      ["The kernel at the opposite point", "对面的核值"],
      [
        "At $\\theta = \\pi$ the kernel simplifies to $\\frac{1 - r}{1 + r}$, which is small. So a point near the boundary is influenced mostly by the nearby boundary data and very little by data on the far side. For example, at $r = \\frac{1}{2}$ it is $\\frac{3/4}{1 + 1 + \\frac{1}{4}} = \\frac{3/4}{9/4} = \\frac{1}{3}$.\n\nCheck: the peak value at the same radius is $\\frac{1 + r}{1 - r} = 3$, and the two values are reciprocals: $3 \\cdot \\frac{1}{3} = 1$.\n\n> **Watch out.** $\\cos\\pi = -1$, so $-2r\\cos\\theta$ becomes $+2r$ and the denominator is $(1 + r)^{2}$.",
        "在 $\\theta = \\pi$ 处，核化简为 $\\frac{1 - r}{1 + r}$，它很小。所以靠近边界的点主要受附近边界数据影响，受对面数据的影响很小。例如，在 $r = \\frac{1}{2}$ 处它是 $\\frac{3/4}{1 + 1 + \\frac{1}{4}} = \\frac{3/4}{9/4} = \\frac{1}{3}$。\n\n检验：同一半径上的峰值是 $\\frac{1 + r}{1 - r} = 3$，两个值互为倒数：$3 \\cdot \\frac{1}{3} = 1$。\n\n> **注意。** $\\cos\\pi = -1$，所以 $-2r\\cos\\theta$ 变成 $+2r$，分母是 $(1 + r)^{2}$。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = fraction(rng, 30);
          const r = Q.of(p, q);
          const answer = Q.of(q - p, q + p);
          const misses: Miss[] = [
            [Q.of(q + p, q - p), "That is the peak value at $\\theta = 0$.", "那是 $\\theta = 0$ 处的峰值。"],
            [Q.of(q * q - p * p, q * q), "That keeps only the numerator $1 - r^{2}$.", "那只保留了分子 $1 - r^{2}$。"],
            [Q.of(q - p, q), "That keeps only $1 - r$ and forgets to divide by $1 + r$.", "那只保留了 $1 - r$，忘了除以 $1 + r$。"],
          ];
          return worked(
            [
              `What is the Poisson kernel at $r = ${r.toLatex()}$, $\\theta = \\pi$?`,
              `泊松核在 $r = ${r.toLatex()}$、$\\theta = \\pi$ 处的值是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Factor", "因式分解"],
                [
                  "With $\\cos\\pi = -1$: $\\frac{1 - r^{2}}{(1 + r)^{2}} = \\frac{(1 - r)(1 + r)}{(1 + r)^{2}} = \\frac{1 - r}{1 + r}$.",
                  "由 $\\cos\\pi = -1$：$\\frac{1 - r^{2}}{(1 + r)^{2}} = \\frac{(1 - r)(1 + r)}{(1 + r)^{2}} = \\frac{1 - r}{1 + r}$。",
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `$\\frac{1 - ${r.toLatex()}}{1 + ${r.toLatex()}} = ${answer.toLatex()}$.`,
                  `$\\frac{1 - ${r.toLatex()}}{1 + ${r.toLatex()}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The peak value at this radius is $\\frac{1 + r}{1 - r} = ${Q.of(q + p, q - p).toLatex()}$, and its reciprocal is $${answer.toLatex()}$, as the two formulas are reciprocal.`,
              `这个半径上的峰值是 $\\frac{1 + r}{1 - r} = ${Q.of(q + p, q - p).toLatex()}$，它的倒数是 $${answer.toLatex()}$，因为两个公式互为倒数。`,
            ],
          );
        }),
    ),
    point(
      "harnacks-inequality",
      ["Harnack's inequality", "哈纳克不等式"],
      [
        "A positive harmonic function is controlled by its value at the center, since the kernel lies between $\\frac{1 - r}{1 + r}$ and $\\frac{1 + r}{1 - r}$. This is Harnack's inequality, and it bounds the function at every interior point. For example, if $u(0) = 4$, then at $r = \\frac{1}{3}$ we have $4 \\cdot \\frac{2/3}{4/3} = 2 \\le u \\le 4 \\cdot \\frac{4/3}{2/3} = 8$.\n\nCheck: the two kernel bounds are reciprocals, so the lower and upper bounds multiply to $u(0)^{2}$: $2 \\cdot 8 = 16 = 4^{2}$.\n\n> **Watch out.** The bounds use $1 \\pm r$, not $1 \\pm r^{2}$, and they need $u$ to be positive.",
        "正调和函数受圆心值控制，因为核介于 $\\frac{1 - r}{1 + r}$ 和 $\\frac{1 + r}{1 - r}$ 之间。这就是哈纳克不等式，它在每个内点给出函数的界。例如，若 $u(0) = 4$，则在 $r = \\frac{1}{3}$ 处有 $4 \\cdot \\frac{2/3}{4/3} = 2 \\le u \\le 4 \\cdot \\frac{4/3}{2/3} = 8$。\n\n检验：两个核的界互为倒数，所以上下界之积是 $u(0)^{2}$：$2 \\cdot 8 = 16 = 4^{2}$。\n\n> **注意。** 界用的是 $1 \\pm r$，不是 $1 \\pm r^{2}$；而且要求 $u$ 为正。",
      ],
      (rng) =>
        until(() => {
          const [p, q] = fraction(rng, 15);
          const c = rng.int(1, 30);
          const upper = rng.bool();
          const r = Q.of(p, q);
          const high = Q.of(c * (q + p), q - p);
          const low = Q.of(c * (q - p), q + p);
          const answer = upper ? high : low;
          const misses: Miss[] = [
            [upper ? low : high, `That is the ${upper ? "lower" : "upper"} bound.`, `那是${upper ? "下" : "上"}界。`],
            [upper ? Q.of(q + p, q - p) : Q.of(q - p, q + p), `That forgets to multiply by $u(0) = ${c}$.`, `那忘了乘 $u(0) = ${c}$。`],
            [c, "That is the value at the center, not a bound at this radius.", "那是圆心的值，不是这个半径上的界。"],
            [
              upper ? Q.of(c * (q * q + p * p), q * q - p * p) : Q.of(c * (q * q - p * p), q * q + p * p),
              "That uses $1 \\pm r^{2}$ in place of $1 \\pm r$.",
              "那用了 $1 \\pm r^{2}$，而不是 $1 \\pm r$。",
            ],
          ];
          const kernel = upper ? Q.of(q + p, q - p) : Q.of(q - p, q + p);
          return worked(
            [
              `$u$ is positive and harmonic on the unit disc, with $u(0) = ${c}$. What is Harnack's ${upper ? "upper" : "lower"} bound for $u$ at $r = ${r.toLatex()}$?`,
              `$u$ 在单位圆盘上为正且调和，$u(0) = ${c}$。在 $r = ${r.toLatex()}$ 处，$u$ 的哈纳克${upper ? "上" : "下"}界是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Bound the kernel", "估计核"],
                [
                  `At $r = ${r.toLatex()}$ the kernel is at most $\\frac{1 + r}{1 - r} = ${Q.of(q + p, q - p).toLatex()}$ and at least $\\frac{1 - r}{1 + r} = ${Q.of(q - p, q + p).toLatex()}$.`,
                  `在 $r = ${r.toLatex()}$ 处，核至多是 $\\frac{1 + r}{1 - r} = ${Q.of(q + p, q - p).toLatex()}$，至少是 $\\frac{1 - r}{1 + r} = ${Q.of(q - p, q + p).toLatex()}$。`,
                ],
              ],
              [
                ["Multiply by the center value", "乘以圆心值"],
                [
                  `The Poisson integral averages $u$ on the circle, which is $u(0)$, so the ${upper ? "upper" : "lower"} bound is $${c} \\cdot ${kernel.toLatex()} = ${answer.toLatex()}$.`,
                  `泊松积分对圆周上的 $u$ 求平均，平均值是 $u(0)$，所以${upper ? "上" : "下"}界是 $${c} \\cdot ${kernel.toLatex()} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The lower and upper bounds $${low.toLatex()}$ and $${high.toLatex()}$ multiply to $${low.mul(high).toLatex()} = ${c}^{2}$, as reciprocal kernel bounds require.`,
              `下界 $${low.toLatex()}$ 与上界 $${high.toLatex()}$ 之积是 $${low.mul(high).toLatex()} = ${c}^{2}$，正如互为倒数的核界所要求的。`,
            ],
          );
        }),
    ),
  ],
);

/** complexAnalysisExtraTopics holds the topics that complete the Complex Analysis course. */
export const complexAnalysisExtraTopics: readonly TopicDef[] = [
  lesson(
    riemannSphere,
    [
      "Where does $z = 1$ land on the Riemann sphere? Its height is $\\frac{|z|^{2} - 1}{|z|^{2} + 1} = \\frac{1 - 1}{1 + 1} = 0$, so it lies on the equator, at the point $(1, 0, 0)$.",
      "$z = 1$ 落在黎曼球面的哪里？它的高度是 $\\frac{|z|^{2} - 1}{|z|^{2} + 1} = \\frac{1 - 1}{1 + 1} = 0$，所以它在赤道上，即点 $(1, 0, 0)$。",
    ],
    [
      "the equator of the unit sphere is the unit circle of the plane itself, so every point with $|z| = 1$ stays where it is, and $(1, 0, 0)$ is the plane point 1.",
      "单位球的赤道就是平面上的单位圆本身，所以每个满足 $|z| = 1$ 的点都不动，$(1, 0, 0)$ 就是平面上的点 1。",
    ],
    [
      "find the height of a projected point, project back to the plane, and decide which hemisphere a point lands in.",
      "求投影点的高度，从球面投影回平面，并判断一个点落在哪个半球。",
    ],
  ),
  lesson(
    antiderivatives,
    [
      "Evaluate $\\int 2z\\, dz$ from 0 to $1 + i$. Since $z^{2}$ is an antiderivative, the integral along any path is $(1 + i)^{2} - 0^{2} = 2i$.",
      "计算从 0 到 $1 + i$ 的 $\\int 2z\\, dz$。因为 $z^{2}$ 是原函数，沿任何路径的积分都是 $(1 + i)^{2} - 0^{2} = 2i$。",
    ],
    [
      "along the straight path $z = (1 + i)t$, $dz = (1 + i)\\, dt$, and $\\int_{0}^{1} 2(1 + i)^{2} t\\, dt = (1 + i)^{2} = 2i$.",
      "沿直线路径 $z = (1 + i)t$，$dz = (1 + i)\\, dt$，而 $\\int_{0}^{1} 2(1 + i)^{2} t\\, dt = (1 + i)^{2} = 2i$。",
    ],
    [
      "evaluate integrals from the end points, see why $\\frac{1}{z}$ has no antiderivative around 0, and integrate a reciprocal square.",
      "由端点计算积分，理解为什么 $\\frac{1}{z}$ 在绕 0 的区域上没有原函数，并积分倒数的平方。",
    ],
  ),
  lesson(
    meanValue,
    [
      "What is the average of $z^{2} + 3$ over the circle $|z - 1| = 2$? By the mean value property it is the value at the center, $1^{2} + 3 = 4$.",
      "$z^{2} + 3$ 在圆 $|z - 1| = 2$ 上的平均是多少？由平均值性质，它是圆心处的值 $1^{2} + 3 = 4$。",
    ],
    [
      "with $z = 1 + 2e^{it}$, $z^{2} = 1 + 4e^{it} + 4e^{2it}$, and the exponentials average to 0 over a full turn, which leaves $1 + 3 = 4$.",
      "取 $z = 1 + 2e^{it}$，$z^{2} = 1 + 4e^{it} + 4e^{2it}$，指数项在一整圈上的平均为 0，剩下 $1 + 3 = 4$。",
    ],
    [
      "average analytic and harmonic functions over circles, and use Morera's theorem to show that a function is analytic.",
      "对解析函数和调和函数在圆上求平均，并用莫雷拉定理证明函数解析。",
    ],
  ),
  lesson(
    maximumModulus,
    [
      "Where is $|z + 3|$ largest on the disc $|z| \\le 2$? The maximum modulus principle puts it on the boundary, and the point of the circle farthest from $-3$ is $z = 2$, where $|z + 3| = 5$.",
      "$|z + 3|$ 在圆盘 $|z| \\le 2$ 上哪里最大？最大模原理说它在边界上，圆上离 $-3$ 最远的点是 $z = 2$，那里 $|z + 3| = 5$。",
    ],
    [
      "by the triangle inequality $|z + 3| \\le |z| + 3 \\le 5$ on the disc, with equality at $z = 2$.",
      "由三角不等式，在圆盘上 $|z + 3| \\le |z| + 3 \\le 5$，在 $z = 2$ 处取等号。",
    ],
    [
      "find the largest size of a linear function, the smallest size of a function without zeros, and bound a polynomial on a circle.",
      "求线性函数的最大模、无零点函数的最小模，并估计多项式在圆上的界。",
    ],
  ),
  lesson(
    algebra,
    [
      "How many roots does $z^{3} - 1$ have? Its degree is 3, so it has 3 roots counted with multiplicity: $1$ and $\\frac{-1 \\pm \\sqrt{3}i}{2}$.",
      "$z^{3} - 1$ 有多少个根？它的次数是 3，所以按重数计有 3 个根：$1$ 和 $\\frac{-1 \\pm \\sqrt{3}i}{2}$。",
    ],
    [
      "the product of the roots should be 1, the negative of the constant term, and indeed $1 \\cdot \\frac{(-1)^{2} + 3}{4} = 1$.",
      "根之积应为常数项的相反数 1，确实 $1 \\cdot \\frac{(-1)^{2} + 3}{4} = 1$。",
    ],
    [
      "count roots with multiplicity, find a disc that holds every root, and pair the complex roots of a real polynomial.",
      "按重数数根，找出包含所有根的圆盘，并把实系数多项式的复根配对。",
    ],
  ),
  lesson(
    schwarzLemma,
    [
      "If $f$ maps the unit disc into itself with $f(0) = 0$, how large can $\\left|f\\left(\\frac{1}{2}\\right)\\right|$ be? The Schwarz lemma gives at most $\\frac{1}{2}$, and the rotation $f(z) = iz$ reaches it.",
      "若 $f$ 把单位圆盘映入自身且 $f(0) = 0$，$\\left|f\\left(\\frac{1}{2}\\right)\\right|$ 最大是多少？施瓦茨引理给出至多 $\\frac{1}{2}$，旋转 $f(z) = iz$ 能达到它。",
    ],
    [
      "$iz$ maps the disc into itself and fixes 0, and $\\left|i \\cdot \\frac{1}{2}\\right| = \\frac{1}{2}$, so the bound cannot be improved.",
      "$iz$ 把圆盘映入自身并保持 0 不动，而 $\\left|i \\cdot \\frac{1}{2}\\right| = \\frac{1}{2}$，所以这个界不能再改进。",
    ],
    [
      "apply the bound on the unit disc, rescale it to other discs, and bound the derivative at the origin.",
      "在单位圆盘上应用这个界，把它缩放到其他圆盘，并估计原点处的导数。",
    ],
  ),
  lesson(
    localMapping,
    [
      "Near 0, how many times does $z^{3}$ take a small nonzero value? Three times, because its derivative $3z^{2}$ has a zero of order 2 there, so the map is three to one near 0.",
      "在 0 附近，$z^{3}$ 取一个小的非零值几次？三次，因为它的导数 $3z^{2}$ 在那里有二阶零点，所以映射在 0 附近是三对一的。",
    ],
    [
      "$z^{3} = \\varepsilon$ has the three roots $\\varepsilon^{1/3}$, $\\varepsilon^{1/3}\\omega$ and $\\varepsilon^{1/3}\\omega^{2}$, where $\\omega$ is a cube root of unity, and all of them are near 0.",
      "$z^{3} = \\varepsilon$ 有三个根 $\\varepsilon^{1/3}$、$\\varepsilon^{1/3}\\omega$ 和 $\\varepsilon^{1/3}\\omega^{2}$，其中 $\\omega$ 是三次单位根，它们都在 0 附近。",
    ],
    [
      "count nearby preimages, see how a critical point multiplies angles, and use the open mapping theorem.",
      "数附近的原像，看临界点如何使角度成倍，并使用开映射定理。",
    ],
  ),
  lesson(
    identity,
    [
      "If $f$ is analytic on the plane and $f\\left(\\frac{1}{n}\\right) = \\frac{1}{n^{2}}$ for every $n$, what is $f$? The function $f(z) - z^{2}$ vanishes at the points $\\frac{1}{n}$, which accumulate at 0, so it is zero everywhere and $f(z) = z^{2}$.",
      "若 $f$ 在平面上解析，且对每个 $n$ 有 $f\\left(\\frac{1}{n}\\right) = \\frac{1}{n^{2}}$，$f$ 是什么？函数 $f(z) - z^{2}$ 在点 $\\frac{1}{n}$ 处为零，这些点聚集于 0，所以它处处为零，$f(z) = z^{2}$。",
    ],
    [
      "$z^{2}$ does take the value $\\frac{1}{n^{2}}$ at $\\frac{1}{n}$, and its Taylor coefficients at 0 are fixed by these values through $f(0) = \\lim f\\left(\\frac{1}{n}\\right) = 0$ and the following limits.",
      "$z^{2}$ 在 $\\frac{1}{n}$ 处确实取值 $\\frac{1}{n^{2}}$，而且它在 0 处的泰勒系数由这些值通过 $f(0) = \\lim f\\left(\\frac{1}{n}\\right) = 0$ 及其后的极限逐个确定。",
    ],
    [
      "pin a function down by a sequence, find where zeros may accumulate, and extend identities from the real line.",
      "用一个序列确定函数，判断零点可以在哪里聚集，并把恒等式从实轴推广出去。",
    ],
  ),
  lesson(
    reflection,
    [
      "The function $f(z) = z^{2} + 1$ is real on the real axis, so $f(\\bar{z}) = \\overline{f(z)}$. From $f(1 + i) = 1 + 2i$ we read off $f(1 - i) = 1 - 2i$ without computing.",
      "函数 $f(z) = z^{2} + 1$ 在实轴上取实值，所以 $f(\\bar{z}) = \\overline{f(z)}$。由 $f(1 + i) = 1 + 2i$ 不用计算就得到 $f(1 - i) = 1 - 2i$。",
    ],
    ["directly, $(1 - i)^{2} + 1 = -2i + 1 = 1 - 2i$.", "直接计算，$(1 - i)^{2} + 1 = -2i + 1 = 1 - 2i$。"],
    [
      "find the value at a mirror point, decide which functions reflect, and build the reflected function.",
      "求镜像点处的值，判断哪些函数满足反射，并构造反射后的函数。",
    ],
  ),
  lesson(
    continuation,
    [
      "The series $\\sum z^{n}$ converges only on $|z| < 1$, but there it equals $\\frac{1}{1 - z}$, which is analytic at every $z \\ne 1$. So the continuation of the series to $z = 3$ has the value $\\frac{1}{1 - 3} = -\\frac{1}{2}$.",
      "级数 $\\sum z^{n}$ 只在 $|z| < 1$ 上收敛，但在那里它等于 $\\frac{1}{1 - z}$，后者在每个 $z \\ne 1$ 处解析。所以级数延拓到 $z = 3$ 的值是 $\\frac{1}{1 - 3} = -\\frac{1}{2}$。",
    ],
    [
      "by the identity theorem any continuation agrees with $\\frac{1}{1 - z}$, since both agree with the series on the disc; and $1 - 3 = -2$.",
      "由恒等定理，任何延拓都与 $\\frac{1}{1 - z}$ 一致，因为二者在圆盘上都与级数相同；而 $1 - 3 = -2$。",
    ],
    [
      "continue a geometric series, read a radius from the nearest singularity, and continue a logarithm around a loop.",
      "延拓几何级数，由最近的奇点读出收敛半径，并把对数沿闭路延拓。",
    ],
  ),
  lesson(
    gamma,
    [
      "What is $\\Gamma\\left(-\\frac{1}{2}\\right)$? The recurrence steps left: $\\Gamma\\left(-\\frac{1}{2}\\right) = \\frac{\\Gamma\\left(\\frac{1}{2}\\right)}{-\\frac{1}{2}} = -2\\sqrt{\\pi}$.",
      "$\\Gamma\\left(-\\frac{1}{2}\\right)$ 是多少？递推向左走一步：$\\Gamma\\left(-\\frac{1}{2}\\right) = \\frac{\\Gamma\\left(\\frac{1}{2}\\right)}{-\\frac{1}{2}} = -2\\sqrt{\\pi}$。",
    ],
    [
      "stepping back to the right multiplies by $-\\frac{1}{2}$: $-\\frac{1}{2} \\cdot \\left(-2\\sqrt{\\pi}\\right) = \\sqrt{\\pi} = \\Gamma\\left(\\frac{1}{2}\\right)$.",
      "向右走回去要乘 $-\\frac{1}{2}$：$-\\frac{1}{2} \\cdot \\left(-2\\sqrt{\\pi}\\right) = \\sqrt{\\pi} = \\Gamma\\left(\\frac{1}{2}\\right)$。",
    ],
    [
      "step with the recurrence, find the residues at the poles, and use the reflection formula.",
      "用递推走步，求极点处的留数，并使用反射公式。",
    ],
  ),
  lesson(
    sineProduct,
    [
      "Euler's product $\\sin(\\pi z) = \\pi z\\prod_{n \\ge 1}\\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ vanishes exactly at the integers. At $z = \\frac{1}{2}$ the left side is 1, so the infinite product $\\prod\\left(1 - \\frac{1}{4n^{2}}\\right)$ equals $\\frac{2}{\\pi}$.",
      "欧拉乘积 $\\sin(\\pi z) = \\pi z\\prod_{n \\ge 1}\\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ 恰在整数处为零。在 $z = \\frac{1}{2}$ 处左边是 1，所以无穷乘积 $\\prod\\left(1 - \\frac{1}{4n^{2}}\\right)$ 等于 $\\frac{2}{\\pi}$。",
    ],
    [
      "the first three factors give $\\frac{3}{4} \\cdot \\frac{15}{16} \\cdot \\frac{35}{36} \\approx 0.68$, which is slowly approaching $\\frac{2}{\\pi} \\approx 0.64$ from above.",
      "前三个因子给出 $\\frac{3}{4} \\cdot \\frac{15}{16} \\cdot \\frac{35}{36} \\approx 0.68$，正从上方缓慢地接近 $\\frac{2}{\\pi} \\approx 0.64$。",
    ],
    [
      "evaluate partial products, count the zeros in a disc, and compare coefficients to sum $\\frac{1}{n^{2}}$.",
      "计算部分积，数圆盘内的零点，并比较系数求出 $\\frac{1}{n^{2}}$ 之和。",
    ],
  ),
  lesson(
    infinityResidue,
    [
      "The function $\\frac{1}{z} + \\frac{2}{z - 1}$ has residues 1 and 2 at its poles. All the residues on the sphere add to zero, so its residue at infinity is $-3$.",
      "函数 $\\frac{1}{z} + \\frac{2}{z - 1}$ 在极点处的留数是 1 和 2。球面上所有留数之和为零，所以它在无穷远点的留数是 $-3$。",
    ],
    [
      "for large $|z|$ the function is $\\frac{3}{z} + \\frac{2}{z^{2}} + \\dots$, and minus the coefficient of $\\frac{1}{z}$ is $-3$.",
      "$|z|$ 很大时函数是 $\\frac{3}{z} + \\frac{2}{z^{2}} + \\dots$，$\\frac{1}{z}$ 系数的相反数是 $-3$。",
    ],
    [
      "read the residue at infinity from a coefficient, use the fact that all residues add to zero, and compute a large circle in one step.",
      "由系数读出无穷远点的留数，利用所有留数之和为零，并一步算出大圆上的积分。",
    ],
  ),
  lesson(
    jordan,
    [
      "Evaluate $\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{x^{2} + 1}\\, dx$. Close $\\frac{e^{iz}}{z^{2} + 1}$ in the upper half plane; the residue at $i$ is $\\frac{e^{-1}}{2i}$, so the integral is $2\\pi i \\cdot \\frac{e^{-1}}{2i} = \\frac{\\pi}{e}$.",
      "计算 $\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{x^{2} + 1}\\, dx$。在上半平面闭合 $\\frac{e^{iz}}{z^{2} + 1}$；$i$ 处的留数是 $\\frac{e^{-1}}{2i}$，所以积分是 $2\\pi i \\cdot \\frac{e^{-1}}{2i} = \\frac{\\pi}{e}$。",
    ],
    [
      "the value $\\frac{\\pi}{e} \\approx 1.16$ is below $\\int_{-\\infty}^{\\infty} \\frac{dx}{x^{2} + 1} = \\pi$, as it must be, since $|\\cos x| \\le 1$.",
      "值 $\\frac{\\pi}{e} \\approx 1.16$ 小于 $\\int_{-\\infty}^{\\infty} \\frac{dx}{x^{2} + 1} = \\pi$，正应如此，因为 $|\\cos x| \\le 1$。",
    ],
    [
      "evaluate cosine integrals, bound the arc by the ML inequality, and choose which half plane to close in.",
      "计算余弦积分，用 ML 不等式估计圆弧，并选择在哪个半平面闭合。",
    ],
  ),
  lesson(
    indented,
    [
      "Why is $\\int_{-\\infty}^{\\infty} \\frac{\\sin x}{x}\\, dx = \\pi$? Indent the contour around 0: for $\\frac{e^{iz}}{z}$ the small clockwise semicircle gives $-\\pi i$, the big arc vanishes, and no pole is enclosed, so the line gives $\\pi i$, whose imaginary part is $\\pi$.",
      "为什么 $\\int_{-\\infty}^{\\infty} \\frac{\\sin x}{x}\\, dx = \\pi$？让围道绕 0 凹陷：对 $\\frac{e^{iz}}{z}$，顺时针小半圆给出 $-\\pi i$，大圆弧趋于零，围道内没有极点，所以直线给出 $\\pi i$，其虚部是 $\\pi$。",
    ],
    [
      "the integrand $\\frac{\\sin x}{x}$ is even and the half line integral is the known value $\\frac{\\pi}{2}$, and $2 \\cdot \\frac{\\pi}{2} = \\pi$.",
      "被积函数 $\\frac{\\sin x}{x}$ 是偶函数，半直线上的积分是已知值 $\\frac{\\pi}{2}$，而 $2 \\cdot \\frac{\\pi}{2} = \\pi$。",
    ],
    [
      "measure a small semicircle around a pole, evaluate the sine over x integral, and find principal values by symmetry.",
      "计算绕极点的小半圆，求正弦除以 x 的积分，并由对称性求主值。",
    ],
  ),
  lesson(
    keyhole,
    [
      "Evaluate $\\int_{0}^{\\infty} \\frac{x^{-1/2}}{1 + x}\\, dx$. A keyhole around the cut on the positive axis gives $\\frac{\\pi}{\\sin(\\pi a)}$ with $a = \\frac{1}{2}$, which is $\\pi$.",
      "计算 $\\int_{0}^{\\infty} \\frac{x^{-1/2}}{1 + x}\\, dx$。绕正实轴切割的钥匙孔围道给出 $\\frac{\\pi}{\\sin(\\pi a)}$，其中 $a = \\frac{1}{2}$，值为 $\\pi$。",
    ],
    [
      "substituting $x = t^{2}$ turns the integral into $\\int_{0}^{\\infty} \\frac{2\\, dt}{1 + t^{2}} = 2 \\cdot \\frac{\\pi}{2} = \\pi$.",
      "代换 $x = t^{2}$ 把积分变成 $\\int_{0}^{\\infty} \\frac{2\\, dt}{1 + t^{2}} = 2 \\cdot \\frac{\\pi}{2} = \\pi$。",
    ],
    [
      "find the jump of a power across the cut, evaluate fractional power integrals, and handle an integral with a logarithm.",
      "求幂在切割两侧的跃变，计算分数幂积分，并处理带对数的积分。",
    ],
  ),
  lesson(
    summing,
    [
      "The function $\\frac{\\pi \\cot(\\pi z)}{z^{2}}$ has residue $\\frac{1}{n^{2}}$ at each nonzero integer and $-\\frac{\\pi^{2}}{3}$ at 0. The residues add to zero, so $2\\sum_{n \\ge 1} \\frac{1}{n^{2}} = \\frac{\\pi^{2}}{3}$ and the sum is $\\frac{\\pi^{2}}{6}$.",
      "函数 $\\frac{\\pi \\cot(\\pi z)}{z^{2}}$ 在每个非零整数处的留数是 $\\frac{1}{n^{2}}$，在 0 处是 $-\\frac{\\pi^{2}}{3}$。留数之和为零，所以 $2\\sum_{n \\ge 1} \\frac{1}{n^{2}} = \\frac{\\pi^{2}}{3}$，和为 $\\frac{\\pi^{2}}{6}$。",
    ],
    [
      "numerically $1 + \\frac{1}{4} + \\frac{1}{9} + \\dots$ is about 1.64, and $\\frac{\\pi^{2}}{6} \\approx 1.645$.",
      "数值上 $1 + \\frac{1}{4} + \\frac{1}{9} + \\dots$ 约为 1.64，而 $\\frac{\\pi^{2}}{6} \\approx 1.645$。",
    ],
    [
      "read the residues of $\\pi \\cot(\\pi z)$, find the residue at the origin, and sum the reciprocal powers.",
      "读出 $\\pi \\cot(\\pi z)$ 的留数，求原点处的留数，并对倒数幂求和。",
    ],
  ),
  lesson(
    casorati,
    [
      "The Laurent series of $e^{1/z}$ is $\\sum_{n \\ge 0} \\frac{1}{n!\\, z^{n}}$, with infinitely many negative powers, so 0 is an essential singularity. Near 0 it takes the value 1 at every point $z = \\frac{1}{2\\pi i n}$.",
      "$e^{1/z}$ 的洛朗级数是 $\\sum_{n \\ge 0} \\frac{1}{n!\\, z^{n}}$，有无穷多个负幂，所以 0 是本性奇点。在 0 附近，它在每个点 $z = \\frac{1}{2\\pi i n}$ 处取值 1。",
    ],
    [
      "at those points $\\frac{1}{z} = 2\\pi i n$ and $e^{2\\pi i n} = 1$, and the points tend to 0 as $n$ grows.",
      "在这些点处 $\\frac{1}{z} = 2\\pi i n$，$e^{2\\pi i n} = 1$，而这些点随 $n$ 增大趋于 0。",
    ],
    [
      "compute the Laurent coefficients of an exponential, name a singularity from its series, and find the one value a function may miss.",
      "计算指数函数的洛朗系数，由级数说出奇点类型，并找出函数可能取不到的那个值。",
    ],
  ),
  lesson(
    riemannMapping,
    [
      "How can the quarter plane $0 < \\arg z < \\frac{\\pi}{2}$ be mapped onto the disc? Squaring opens it onto the upper half plane, and the Cayley transform then sends that onto the disc, so $\\frac{z^{2} - i}{z^{2} + i}$ does it.",
      "怎样把四分之一平面 $0 < \\arg z < \\frac{\\pi}{2}$ 映到圆盘？平方把它打开成上半平面，凯莱变换再把上半平面映到圆盘，所以 $\\frac{z^{2} - i}{z^{2} + i}$ 就可以。",
    ],
    [
      "the middle point $e^{i\\pi/4}$ goes to $z^{2} = i$ and then to $\\frac{i - i}{i + i} = 0$, the center of the disc.",
      "中间的点 $e^{i\\pi/4}$ 映到 $z^{2} = i$，再映到 $\\frac{i - i}{i + i} = 0$，即圆盘的中心。",
    ],
    [
      "use the Cayley transform, decide which regions qualify for the theorem, and open sectors with powers.",
      "使用凯莱变换，判断哪些区域满足定理，并用幂打开扇形。",
    ],
  ),
  lesson(
    joukowski,
    [
      "Where does $z + \\frac{1}{z}$ send the circle $|z| = 2$? Writing $z = 2e^{i\\theta}$ gives $\\frac{5}{2}\\cos\\theta + \\frac{3}{2}i\\sin\\theta$, an ellipse with semi axes $\\frac{5}{2}$ and $\\frac{3}{2}$.",
      "$z + \\frac{1}{z}$ 把圆 $|z| = 2$ 映到哪里？写 $z = 2e^{i\\theta}$，得 $\\frac{5}{2}\\cos\\theta + \\frac{3}{2}i\\sin\\theta$，是半轴为 $\\frac{5}{2}$ 和 $\\frac{3}{2}$ 的椭圆。",
    ],
    [
      "the point $z = 2$ goes to $2 + \\frac{1}{2} = \\frac{5}{2}$, and $z = 2i$ goes to $2i - \\frac{i}{2} = \\frac{3}{2}i$, the ends of the two axes.",
      "点 $z = 2$ 映到 $2 + \\frac{1}{2} = \\frac{5}{2}$，$z = 2i$ 映到 $2i - \\frac{i}{2} = \\frac{3}{2}i$，正是两条轴的端点。",
    ],
    [
      "evaluate the map, find the ellipse that comes from a circle, and watch the unit circle collapse onto a segment.",
      "计算映射，求由圆得到的椭圆，并看单位圆塌缩成线段。",
    ],
  ),
  lesson(
    dirichlet,
    [
      "Find the harmonic function on $r < 2$ with boundary values $5\\cos\\theta$. It is $\\frac{5}{2}r\\cos\\theta = \\frac{5}{2}x$, the real part of $\\frac{5}{2}z$, and its value at the center is 0.",
      "求在 $r < 2$ 上调和、边界值为 $5\\cos\\theta$ 的函数。它是 $\\frac{5}{2}r\\cos\\theta = \\frac{5}{2}x$，即 $\\frac{5}{2}z$ 的实部，在圆心的值是 0。",
    ],
    [
      "at $r = 2$ the formula gives $5\\cos\\theta$, and the boundary data averages to 0 over a full circle, matching the center value by the mean value property.",
      "在 $r = 2$ 处公式给出 $5\\cos\\theta$；边界数据在整个圆周上的平均为 0，由平均值性质与圆心的值吻合。",
    ],
    [
      "solve the problem for a boundary cosine on a disc, find the center value, and match two boundary values on a half plane.",
      "对圆盘边界上的余弦求解，求圆心的值，并在半平面上匹配两个边界值。",
    ],
  ),
  lesson(
    poisson,
    [
      "How much weight does the Poisson kernel give at $r = \\frac{1}{3}$? It ranges from $\\frac{1 - 1/3}{1 + 1/3} = \\frac{1}{2}$ at the far point $\\theta = \\pi$ to $\\frac{1 + 1/3}{1 - 1/3} = 2$ at the near point $\\theta = 0$.",
      "泊松核在 $r = \\frac{1}{3}$ 处给出多大的权？它从远处 $\\theta = \\pi$ 的 $\\frac{1 - 1/3}{1 + 1/3} = \\frac{1}{2}$ 变到近处 $\\theta = 0$ 的 $\\frac{1 + 1/3}{1 - 1/3} = 2$。",
    ],
    [
      "the two extremes are reciprocals, $\\frac{1}{2} \\cdot 2 = 1$, as the formulas $\\frac{1 - r}{1 + r}$ and $\\frac{1 + r}{1 - r}$ require.",
      "两个极值互为倒数，$\\frac{1}{2} \\cdot 2 = 1$，正如公式 $\\frac{1 - r}{1 + r}$ 和 $\\frac{1 + r}{1 - r}$ 所要求的。",
    ],
    [
      "evaluate the kernel at its peak and at the opposite point, and bound positive harmonic functions by Harnack's inequality.",
      "计算核的峰值和对面的核值，并用哈纳克不等式估计正调和函数。",
    ],
  ),
];
