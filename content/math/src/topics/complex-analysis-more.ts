// More of Complex Analysis: power series on discs, complex trigonometric functions and powers,
// integral bounds, winding numbers, zeros, Laurent series on annuli, the argument principle,
// real integrals by residues, cross ratios and conformal maps of regions.

import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { plane, Q } from "@ga/subject-math";
import { complexDrawings1 } from "../explanation-drawings-complex-analysis-1.ts";
import { complexDrawings2 } from "../explanation-drawings-complex-analysis-2.ts";

import { type Pair, point, same, topic } from "../university-kit.ts";
import { chosen, lesson, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

/** complexName writes x + yi, leaving out a zero part and a coefficient of one. */
const complexName = (x: number, y: number): string => {
  const imaginary = Math.abs(y) === 1 ? "i" : `${Math.abs(y)}i`;
  if (y === 0) return String(x);
  if (x === 0) return y < 0 ? `-${imaginary}` : imaginary;
  return `${x} ${y < 0 ? "-" : "+"} ${imaginary}`;
};

/** imaginaryName writes the imaginary number a i, leaving out a coefficient of one. */
const imaginaryName = (a: number): string => (a === 1 ? "i" : `${a}i`);

/** piTimes writes a rational multiple of pi, leaving out a coefficient of one. */
const piTimes = (v: Q): string => {
  if (v.eq(Q.of(1, 1))) return "\\pi";
  if (v.eq(Q.of(-1, 1))) return "-\\pi";
  return `${v.toLatex()} \\pi`;
};

/** power writes base to the exponent, leaving out an exponent of one. */
const power = (base: string, exponent: number): string => (exponent === 1 ? base : `${base}^{${exponent}}`);

/** piOver writes pi divided by a, leaving out a denominator of one. */
const piOver = (a: number): string => (a === 1 ? "\\pi" : `\\frac{\\pi}{${a}}`);

/** shift writes a number after a minus sign, in brackets when it is negative. */
const shift = (a: number): string => (a < 0 ? `(${a})` : String(a));

/** bracketQ writes a fraction, in brackets when it is negative. */
const bracketQ = (v: Q): string => (v.sign() < 0 ? `\\left( ${v.toLatex()} \\right)` : v.toLatex());

/** lead writes a coefficient in front of a symbol, leaving out a coefficient of one. */
const lead = (v: Q): string => (v.eq(Q.of(1, 1)) ? "" : `${v.toLatex()} `);

const powerSeriesDiscs = topic(
  "power-series-on-discs",
  ["Power Series on Discs", "圆盘上的幂级数"],
  ["Find where a complex power series converges and test points against its disc.", "求复幂级数的收敛范围，判断点是否在收敛圆内。"],
  ["taylor-series-of-analytic-functions"],
  [],
  [
    point(
      "the-radius-by-the-ratio-test",
      ["The radius by the ratio test", "用比值判别法求半径"],
      [
        "A complex power series $\\sum c_n (z - a)^n$ converges on a disc about its center $a$ and diverges outside it. When the ratio $|c_{n+1} / c_n|$ tends to a limit $L$, the radius is $R = 1 / L$. A growing coefficient makes the disc small, and a shrinking coefficient makes it large. For $\\sum 3^n (z - 2)^n$ the ratio is $\\frac{3^{n+1}}{3^n} = 3$, so $R = \\frac{1}{3}$, and the series converges on $|z - 2| < \\frac{1}{3}$.\n\nCheck: by the root test, $\\sqrt[n]{3^n} = 3$, the same limit, so again $R = \\frac{1}{3}$.\n\n> **Watch out.** The radius is $\\frac{1}{L}$, not $L$. The center moves the disc but does not change its size.",
        "复幂级数 $\\sum c_n (z - a)^n$ 在以 $a$ 为圆心的圆盘内收敛，在圆盘外发散。当 $|c_{n+1} / c_n|$ 趋于极限 $L$ 时，半径 $R = 1 / L$。系数增长会使圆盘变小，系数缩小会使圆盘变大。对 $\\sum 3^n (z - 2)^n$，比值是 $\\frac{3^{n+1}}{3^n} = 3$，所以 $R = \\frac{1}{3}$，级数在 $|z - 2| < \\frac{1}{3}$ 上收敛。\n\n检验：用根值判别法，$\\sqrt[n]{3^n} = 3$，极限相同，所以仍有 $R = \\frac{1}{3}$。\n\n> **注意。** 半径是 $\\frac{1}{L}$，不是 $L$。圆心只移动圆盘，不改变它的大小。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(2, 9);
          const q = rng.int(1, 9);
          const grow = rng.bool();
          const coefficient = grow ? `${p}^n` : `\\frac{1}{${p}^n}`;
          const ratio = grow ? `${p}` : `\\frac{1}{${p}}`;
          const quotient = grow ? `\\frac{${p}^{n+1}}{${p}^n}` : `\\frac{${p}^n}{${p}^{n+1}}`;
          const answer = grow ? Q.of(1, p) : Q.of(p, 1);
          const misses: Miss[] = [
            [
              grow ? p : Q.of(1, p),
              `That is the limit $L = ${ratio}$ of the ratio; the radius is its reciprocal $\\frac{1}{L}$.`,
              `那是比值的极限 $L = ${ratio}$；半径是它的倒数 $\\frac{1}{L}$。`,
            ],
            [
              q,
              `That is the distance from 0 to the center ${q}; the center fixes where the disc lies, not its size.`,
              `那是 0 到圆心 ${q} 的距离；圆心决定圆盘的位置，不决定大小。`,
            ],
            [
              1,
              "That takes the radius 1 of the plain geometric series; the coefficients change it.",
              "那用了普通几何级数的半径 1；系数会改变它。",
            ],
          ];
          return worked(
            [
              `What is the radius of convergence of $\\sum_{n \\ge 0} ${coefficient} (z - ${q})^n$?`,
              `$\\sum_{n \\ge 0} ${coefficient} (z - ${q})^n$ 的收敛半径是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Form the ratio", "求比值"],
                [
                  `$\\left| \\frac{c_{n+1}}{c_n} \\right| = ${quotient} = ${ratio}$ for every $n$, so $L = ${ratio}$.`,
                  `对每个 $n$，$\\left| \\frac{c_{n+1}}{c_n} \\right| = ${quotient} = ${ratio}$，所以 $L = ${ratio}$。`,
                ],
              ],
              [
                ["Take the reciprocal", "取倒数"],
                [
                  `$R = \\frac{1}{L} = ${answer.toLatex()}$. The center ${q} only says where the disc lies.`,
                  `$R = \\frac{1}{L} = ${answer.toLatex()}$。圆心 ${q} 只说明圆盘的位置。`,
                ],
              ],
            ],
            [
              `By the root test, $\\sqrt[n]{|c_n|} = ${ratio}$ for every $n$, the same limit, so again $R = ${answer.toLatex()}$.`,
              `用根值判别法，对每个 $n$ 有 $\\sqrt[n]{|c_n|} = ${ratio}$，极限相同，所以仍有 $R = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "a-point-against-the-disc",
        ["A point against the disc", "判断点与圆盘的关系"],
        [
          "To decide whether a series with center $a$ and radius $R$ converges at a point, compare the distance from the point to $a$ with $R$. A smaller distance means convergence and a larger one means divergence. On the circle itself the radius alone decides nothing, and each point needs its own test. For center $1 + i$ and radius 2, the point $2 + i$ is at distance 1, so the series converges there, and $4 + i$ is at distance 3, so it diverges there.\n\nCheck: the series $\\sum \\frac{(z - 1 - i)^n}{2^n}$ has this center and radius. At $2 + i$ its ratio is $\\frac{1}{2}$ and the geometric series converges; at $4 + i$ the ratio is $\\frac{3}{2}$ and the terms grow.\n\n> **Watch out.** On the boundary circle anything can happen: $\\sum \\frac{z^n}{n}$ diverges at $z = 1$ but converges at $z = -1$.",
          "要判断圆心为 $a$、半径为 $R$ 的级数在某点是否收敛，就比较这一点到 $a$ 的距离和 $R$。距离较小则收敛，较大则发散。在圆周上，只看半径无法判断，每个点要单独检验。对圆心 $1 + i$、半径 2，点 $2 + i$ 的距离是 1，所以级数在那里收敛；$4 + i$ 的距离是 3，所以级数在那里发散。\n\n检验：级数 $\\sum \\frac{(z - 1 - i)^n}{2^n}$ 有这样的圆心和半径。在 $2 + i$ 处公比是 $\\frac{1}{2}$，几何级数收敛；在 $4 + i$ 处公比是 $\\frac{3}{2}$，各项越来越大。\n\n> **注意。** 在边界圆上什么都可能发生：$\\sum \\frac{z^n}{n}$ 在 $z = 1$ 处发散，在 $z = -1$ 处却收敛。",
        ],
        (rng) => {
          const [dx, dy, d] = rng.pick([
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
            [8, 6, 10],
            [4, 3, 5],
          ] as const);
          const [ax, ay] = [rng.int(-4, 4), rng.int(-4, 4)];
          const r = d + rng.pick([-2, -1, 0, 1, 2]);
          const [x, y] = [ax + dx, ay + dy];
          const inside: Pair = ["It converges there", "在那里收敛"];
          const outside: Pair = ["It diverges there", "在那里发散"];
          const edge: Pair = ["The radius alone does not decide", "只看半径无法判断"];
          const everywhere: Pair = ["It converges everywhere", "处处收敛"];
          const where = d < r ? "inside" : d > r ? "outside" : "edge";
          const correct = where === "inside" ? inside : where === "outside" ? outside : edge;
          const boundary: readonly [string, string] = [
            "On the boundary circle the radius gives no verdict; some series converge there and some do not.",
            "在边界圆上半径给不出结论；有的级数在那里收敛，有的发散。",
          ];
          const slips: Slip[] = [];
          if (where !== "inside")
            slips.push(
              where === "outside"
                ? [
                    inside,
                    `The distance ${d} is larger than the radius ${r}, so the point is outside the disc, where the series diverges.`,
                    `距离 ${d} 大于半径 ${r}，所以这个点在圆盘外，级数在那里发散。`,
                  ]
                : [inside, ...boundary],
            );
          if (where !== "outside")
            slips.push(
              where === "inside"
                ? [
                    outside,
                    `The distance ${d} is smaller than the radius ${r}, so the point is inside the disc, where the series converges.`,
                    `距离 ${d} 小于半径 ${r}，所以这个点在圆盘内，级数在那里收敛。`,
                  ]
                : [outside, ...boundary],
            );
          if (where !== "edge")
            slips.push([
              edge,
              `The point is not on the boundary circle: its distance ${d} from the center differs from the radius ${r}.`,
              `这个点不在边界圆上：它到圆心的距离 ${d} 不等于半径 ${r}。`,
            ]);
          slips.push([
            everywhere,
            `A finite radius ${r} means the series diverges at every point farther than ${r} from the center.`,
            `有限的半径 ${r} 意味着级数在到圆心距离大于 ${r} 的每个点都发散。`,
          ]);
          const name = complexName(ax, ay);
          const target = complexName(x, y);
          const relation = where === "inside" ? "<" : where === "outside" ? ">" : "=";
          return chosen(
            rng,
            [
              `A power series has center $${name}$ and radius of convergence ${r}. What can be said at $z = ${target}$?`,
              `一个幂级数的圆心是 $${name}$，收敛半径是 ${r}。在 $z = ${target}$ 处可以得出什么结论？`,
            ],
            correct,
            slips,
            [
              [
                ["Subtract the center", "减去圆心"],
                [`The point minus the center is $${complexName(dx, dy)}$.`, `这个点减去圆心得 $${complexName(dx, dy)}$。`],
              ],
              [
                ["Find the distance", "求距离"],
                [`Its modulus is $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$.`, `它的模是 $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$。`],
              ],
              [
                ["Compare with the radius", "和半径比较"],
                [
                  where === "inside"
                    ? `$${d} < ${r}$, so the point is inside the disc and the series converges there.`
                    : where === "outside"
                      ? `$${d} > ${r}$, so the point is outside the disc and the series diverges there.`
                      : `$${d} = ${r}$, so the point is on the boundary circle, where a series may converge or diverge.`,
                  where === "inside"
                    ? `$${d} < ${r}$，所以这个点在圆盘内，级数在那里收敛。`
                    : where === "outside"
                      ? `$${d} > ${r}$，所以这个点在圆盘外，级数在那里发散。`
                      : `$${d} = ${r}$，所以这个点在边界圆上，级数在那里可能收敛也可能发散。`,
                ],
              ],
            ],
            [
              `Comparing squares avoids the root: $${dx}^2 + ${dy}^2 = ${d * d}$ against $${r}^2 = ${r * r}$ gives $${d * d} ${relation} ${r * r}$, the same verdict.`,
              `比较平方可以不开方：$${dx}^2 + ${dy}^2 = ${d * d}$ 与 $${r}^2 = ${r * r}$ 相比，得 $${d * d} ${relation} ${r * r}$，结论相同。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["power-series-on-discs#a-point-against-the-disc"],
    },
  ],
);

const complexTrig = topic(
  "complex-trigonometric-and-hyperbolic-functions",
  ["Complex Trigonometric and Hyperbolic Functions", "复三角函数和双曲函数"],
  ["Extend sine and cosine to the plane, where they are no longer bounded.", "把正弦和余弦推广到复平面，它们在那里不再有界。"],
  ["the-complex-exponential-function"],
  [],
  [
    point(
      "cosine-of-an-imaginary-number",
      ["Cosine of an imaginary number", "纯虚数的余弦"],
      [
        "The formula $\\cos z = \\frac{1}{2} (e^{iz} + e^{-iz})$ defines cosine for every complex $z$. On the imaginary axis it gives $\\cos(iy) = \\cosh y$, a real number that can be as large as you like. So the bound $|\\cos z| \\le 1$ from real trigonometry fails in the complex plane. For $z = i \\ln 2$: $e^{iz} = e^{-\\ln 2} = \\frac{1}{2}$ and $e^{-iz} = 2$, so $\\cos(i \\ln 2) = \\frac{1}{2} \\left( \\frac{1}{2} + 2 \\right) = \\frac{5}{4}$.\n\nCheck: $\\sin(i \\ln 2) = \\frac{3}{4} i$, and $\\cos^2 z + \\sin^2 z = \\frac{25}{16} - \\frac{9}{16} = 1$, as it must be.\n\n> **Watch out.** $e^{i \\cdot iy} = e^{-y}$, because $i \\cdot i = -1$. The two exponentials are added for cosine; subtracting them gives sine.",
        "公式 $\\cos z = \\frac{1}{2} (e^{iz} + e^{-iz})$ 对每个复数 $z$ 定义了余弦。在虚轴上它给出 $\\cos(iy) = \\cosh y$，这是可以任意大的实数。所以实三角函数的界 $|\\cos z| \\le 1$ 在复平面上不再成立。对 $z = i \\ln 2$：$e^{iz} = e^{-\\ln 2} = \\frac{1}{2}$，$e^{-iz} = 2$，所以 $\\cos(i \\ln 2) = \\frac{1}{2} \\left( \\frac{1}{2} + 2 \\right) = \\frac{5}{4}$。\n\n检验：$\\sin(i \\ln 2) = \\frac{3}{4} i$，而 $\\cos^2 z + \\sin^2 z = \\frac{25}{16} - \\frac{9}{16} = 1$，正应如此。\n\n> **注意。** $e^{i \\cdot iy} = e^{-y}$，因为 $i \\cdot i = -1$。余弦是两个指数相加；相减得到的是正弦。",
      ],
      (rng) =>
        until(() => {
          const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
          const m = rng.int(1, 5);
          const coefficient = m === 1 ? "" : `${m} `;
          const cosh = Q.of(k * k + 1, 2 * k);
          const sinh = Q.of(k * k - 1, 2 * k);
          const answer = cosh.mul(Q.of(m, 1));
          const misses: Miss[] = [
            [
              sinh.mul(Q.of(m, 1)),
              "That subtracts the two exponentials, which gives $\\sinh$; cosine adds them.",
              "那把两个指数相减，得到的是 $\\sinh$；余弦是相加。",
            ],
            [
              Q.of(m * (k + 1), 2),
              `That takes $e^{-\\ln ${k}}$ to be 1; it is $\\frac{1}{${k}}$.`,
              `那把 $e^{-\\ln ${k}}$ 当成了 1；它是 $\\frac{1}{${k}}$。`,
            ],
            [
              m * k,
              `That keeps only $e^{\\ln ${k}} = ${k}$, dropping the other exponential and the factor $\\frac{1}{2}$.`,
              `那只保留了 $e^{\\ln ${k}} = ${k}$，漏掉了另一个指数和因子 $\\frac{1}{2}$。`,
            ],
            [
              m,
              "That assumes $|\\cos z| \\le 1$ as for real numbers; off the real axis cosine is unbounded.",
              "那假设了实数情形的 $|\\cos z| \\le 1$；离开实轴后余弦是无界的。",
            ],
          ];
          const steps: [Pair, Pair][] = [
            [
              ["Evaluate the exponentials", "计算指数"],
              [
                `With $z = i \\ln ${k}$, $e^{iz} = e^{-\\ln ${k}} = \\frac{1}{${k}}$ and $e^{-iz} = e^{\\ln ${k}} = ${k}$.`,
                `取 $z = i \\ln ${k}$，则 $e^{iz} = e^{-\\ln ${k}} = \\frac{1}{${k}}$，$e^{-iz} = e^{\\ln ${k}} = ${k}$。`,
              ],
            ],
            [
              ["Average them", "取平均"],
              [
                `$\\cos z = \\frac{1}{2} \\left( \\frac{1}{${k}} + ${k} \\right) = ${cosh.toLatex()}$.`,
                `$\\cos z = \\frac{1}{2} \\left( \\frac{1}{${k}} + ${k} \\right) = ${cosh.toLatex()}$。`,
              ],
            ],
          ];
          if (m !== 1)
            steps.push([
              ["Multiply by the coefficient", "乘系数"],
              [`$${m} \\cdot ${cosh.toLatex()} = ${answer.toLatex()}$.`, `$${m} \\cdot ${cosh.toLatex()} = ${answer.toLatex()}$。`],
            ]);
          return worked(
            [`What is $${coefficient}\\cos(i \\ln ${k})$?`, `$${coefficient}\\cos(i \\ln ${k})$ 是多少？`],
            answer,
            misses,
            steps,
            [
              `With $\\sin(i \\ln ${k}) = ${sinh.toLatex()} i$, $\\cos^2 z + \\sin^2 z = \\left( ${cosh.toLatex()} \\right)^2 - \\left( ${sinh.toLatex()} \\right)^2 = 1$, as it must be.`,
              `由 $\\sin(i \\ln ${k}) = ${sinh.toLatex()} i$，$\\cos^2 z + \\sin^2 z = \\left( ${cosh.toLatex()} \\right)^2 - \\left( ${sinh.toLatex()} \\right)^2 = 1$，正应如此。`,
            ],
          );
        }),
    ),
    point(
      "sine-of-an-imaginary-number",
      ["Sine of an imaginary number", "纯虚数的正弦"],
      [
        "From $\\sin z = \\frac{1}{2i} (e^{iz} - e^{-iz})$ we get $\\sin(iy) = i \\sinh y$, which is purely imaginary. Its modulus is $|\\sinh y|$, and it grows without limit as $y$ moves away from zero. Combined with the addition formula this gives the size of sine at any complex point. For $y = \\ln 3$: $\\sinh(\\ln 3) = \\frac{1}{2} \\left( 3 - \\frac{1}{3} \\right) = \\frac{4}{3}$, so $|\\sin(i \\ln 3)| = \\frac{4}{3}$.\n\nCheck: $\\cosh(\\ln 3) = \\frac{5}{3}$, and $\\sinh^2 = \\cosh^2 - 1 = \\frac{25}{9} - 1 = \\frac{16}{9}$, the square of $\\frac{4}{3}$.\n\n> **Watch out.** $\\sin(iy)$ is imaginary; its modulus drops the factor $i$. The exponentials are subtracted, and adding them gives $\\cosh y$ instead.",
        "由 $\\sin z = \\frac{1}{2i} (e^{iz} - e^{-iz})$ 得 $\\sin(iy) = i \\sinh y$，它是纯虚数。它的模是 $|\\sinh y|$，当 $y$ 远离零时无限增大。再结合和角公式，就能得到正弦在任意复数点的大小。对 $y = \\ln 3$：$\\sinh(\\ln 3) = \\frac{1}{2} \\left( 3 - \\frac{1}{3} \\right) = \\frac{4}{3}$，所以 $|\\sin(i \\ln 3)| = \\frac{4}{3}$。\n\n检验：$\\cosh(\\ln 3) = \\frac{5}{3}$，而 $\\sinh^2 = \\cosh^2 - 1 = \\frac{25}{9} - 1 = \\frac{16}{9}$，正是 $\\frac{4}{3}$ 的平方。\n\n> **注意。** $\\sin(iy)$ 是虚数；取模时去掉因子 $i$。两个指数要相减，相加得到的是 $\\cosh y$。",
      ],
      (rng) =>
        until(() => {
          const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
          const m = rng.int(1, 5);
          const coefficient = m === 1 ? "" : `${m} `;
          const cosh = Q.of(k * k + 1, 2 * k);
          const sinh = Q.of(k * k - 1, 2 * k);
          const answer = sinh.mul(Q.of(m, 1));
          const misses: Miss[] = [
            [
              cosh.mul(Q.of(m, 1)),
              "That adds the two exponentials, which gives $\\cosh$, the value of cosine there; sine subtracts them.",
              "那把两个指数相加，得到的是 $\\cosh$，即那里余弦的值；正弦是相减。",
            ],
            [
              Q.of(m * (k - 1), 2),
              `That takes $e^{-\\ln ${k}}$ to be 1; it is $\\frac{1}{${k}}$.`,
              `那把 $e^{-\\ln ${k}}$ 当成了 1；它是 $\\frac{1}{${k}}$。`,
            ],
            [
              m,
              "That assumes $|\\sin z| \\le 1$ as for real numbers; off the real axis sine is unbounded.",
              "那假设了实数情形的 $|\\sin z| \\le 1$；离开实轴后正弦是无界的。",
            ],
            [
              m * k,
              `That keeps only $e^{\\ln ${k}} = ${k}$, dropping the other exponential and the factor $\\frac{1}{2}$.`,
              `那只保留了 $e^{\\ln ${k}} = ${k}$，漏掉了另一个指数和因子 $\\frac{1}{2}$。`,
            ],
          ];
          const steps: [Pair, Pair][] = [
            [
              ["Use the hyperbolic sine", "用双曲正弦"],
              [
                `$\\sin(iy) = i \\sinh y$ with $y = \\ln ${k}$, so its modulus is $\\sinh(\\ln ${k})$.`,
                `$\\sin(iy) = i \\sinh y$，其中 $y = \\ln ${k}$，所以它的模是 $\\sinh(\\ln ${k})$。`,
              ],
            ],
            [
              ["Evaluate", "计算"],
              [
                `$\\sinh(\\ln ${k}) = \\frac{1}{2} \\left( ${k} - \\frac{1}{${k}} \\right) = ${sinh.toLatex()}$.`,
                `$\\sinh(\\ln ${k}) = \\frac{1}{2} \\left( ${k} - \\frac{1}{${k}} \\right) = ${sinh.toLatex()}$。`,
              ],
            ],
          ];
          if (m !== 1)
            steps.push([
              ["Multiply by the coefficient", "乘系数"],
              [`$${m} \\cdot ${sinh.toLatex()} = ${answer.toLatex()}$.`, `$${m} \\cdot ${sinh.toLatex()} = ${answer.toLatex()}$。`],
            ]);
          return worked(
            [`What is $${coefficient}|\\sin(i \\ln ${k})|$?`, `$${coefficient}|\\sin(i \\ln ${k})|$ 是多少？`],
            answer,
            misses,
            steps,
            [
              `$\\cosh(\\ln ${k}) = ${cosh.toLatex()}$, and $\\cosh^2 - 1 = \\left( ${cosh.toLatex()} \\right)^2 - 1 = \\left( ${sinh.toLatex()} \\right)^2$, which agrees with $\\sinh^2$.`,
              `$\\cosh(\\ln ${k}) = ${cosh.toLatex()}$，而 $\\cosh^2 - 1 = \\left( ${cosh.toLatex()} \\right)^2 - 1 = \\left( ${sinh.toLatex()} \\right)^2$，与 $\\sinh^2$ 一致。`,
            ],
          );
        }),
    ),
    point(
      "zeros-of-sine-and-cosine",
      ["Zeros of sine and cosine", "正弦和余弦的零点"],
      [
        "Although complex sine and cosine are unbounded, they gain no new zeros. Solving $\\sin z = 0$ gives $e^{2iz} = 1$, and so $z = n \\pi$ with $n$ an integer, exactly the real zeros. The zeros of cosine are likewise only the points $\\frac{\\pi}{2} + n \\pi$ on the real axis. So $\\sin z$ has exactly three zeros with $2\\pi - \\frac{\\pi}{4} < \\operatorname{Re} z < 4\\pi + \\frac{\\pi}{4}$, however tall the region: $2\\pi$, $3\\pi$ and $4\\pi$.\n\nCheck: writing $z = x + iy$, $\\sin z = \\sin x \\cosh y + i \\cos x \\sinh y$. Since $\\cosh y \\ge 1$, the real part vanishes only when $\\sin x = 0$; then $\\cos x = \\pm 1$, so $\\sinh y = 0$ and $y = 0$.\n\n> **Watch out.** Count both ends of the list of multiples of $\\pi$. For cosine, check that the last point $\\frac{\\pi}{2} + n\\pi$ is still inside the range.",
        "复正弦和复余弦虽然无界，却没有新的零点。解 $\\sin z = 0$ 得 $e^{2iz} = 1$，所以 $z = n \\pi$（$n$ 为整数），恰好是实零点。余弦的零点同样只有实轴上的 $\\frac{\\pi}{2} + n \\pi$。所以无论区域多高，$\\sin z$ 在 $2\\pi - \\frac{\\pi}{4} < \\operatorname{Re} z < 4\\pi + \\frac{\\pi}{4}$ 内恰有三个零点：$2\\pi$、$3\\pi$ 和 $4\\pi$。\n\n检验：令 $z = x + iy$，$\\sin z = \\sin x \\cosh y + i \\cos x \\sinh y$。因为 $\\cosh y \\ge 1$，实部只在 $\\sin x = 0$ 时为零；这时 $\\cos x = \\pm 1$，所以 $\\sinh y = 0$，$y = 0$。\n\n> **注意。** $\\pi$ 的倍数要两端都数上。对余弦，要检查最后一个点 $\\frac{\\pi}{2} + n\\pi$ 是否还在范围内。",
      ],
      (rng) =>
        until(() => {
          const useSine = rng.bool();
          const [lo, hi] = [rng.int(2, 4), rng.int(5, 9)];
          const count = useSine ? hi - lo + 1 : hi - lo;
          const name = useSine ? "\\sin z" : "\\cos z";
          const offAxis: Miss = [
            2 * count,
            "That expects a second row of zeros off the real axis; every zero of sine and cosine is real.",
            "那以为实轴外还有一排零点；正弦和余弦的零点都是实数。",
          ];
          const misses: Miss[] = useSine
            ? [
                [
                  hi - lo,
                  `That leaves out one end; both $${lo} \\pi$ and $${hi} \\pi$ lie in the range.`,
                  `那漏掉了一端；$${lo} \\pi$ 和 $${hi} \\pi$ 都在范围内。`,
                ],
                [
                  hi - lo + 2,
                  `That adds $${lo - 1} \\pi$ or $${hi + 1} \\pi$, which lie outside the range.`,
                  `那多算了 $${lo - 1} \\pi$ 或 $${hi + 1} \\pi$，它们在范围之外。`,
                ],
                offAxis,
              ]
            : [
                [
                  hi - lo + 1,
                  `That counts $\\frac{\\pi}{2} + ${hi} \\pi$ too, but it lies beyond the edge $${hi} \\pi + \\frac{\\pi}{4}$.`,
                  `那把 $\\frac{\\pi}{2} + ${hi} \\pi$ 也算上了，但它超出了边界 $${hi} \\pi + \\frac{\\pi}{4}$。`,
                ],
                [
                  hi - lo - 1,
                  `That leaves out $\\frac{\\pi}{2} + ${lo} \\pi$, which lies inside the range.`,
                  `那漏掉了 $\\frac{\\pi}{2} + ${lo} \\pi$，它在范围内。`,
                ],
                offAxis,
              ];
          return worked(
            [
              `How many zeros does $${name}$ have in the rectangle $${lo} \\pi - \\frac{\\pi}{4} < \\operatorname{Re} z < ${hi} \\pi + \\frac{\\pi}{4}$, $|\\operatorname{Im} z| < 100$?`,
              `$${name}$ 在矩形 $${lo} \\pi - \\frac{\\pi}{4} < \\operatorname{Re} z < ${hi} \\pi + \\frac{\\pi}{4}$，$|\\operatorname{Im} z| < 100$ 内有多少个零点？`,
            ],
            count,
            misses,
            [
              [
                ["The zeros are real", "零点都是实数"],
                [
                  `Every zero of $${name}$ lies on the real axis, so the height of the rectangle does not matter.`,
                  `$${name}$ 的零点都在实轴上，所以矩形的高度没有关系。`,
                ],
              ],
              [
                ["List those in range", "列出范围内的零点"],
                [
                  useSine
                    ? `They are $n \\pi$ for $n$ from ${lo} to ${hi}.`
                    : `They are $\\frac{\\pi}{2} + n \\pi$ for $n$ from ${lo} to ${hi - 1}; for $n = ${hi}$ the point passes the right edge.`,
                  useSine
                    ? `它们是 $n \\pi$，$n$ 从 ${lo} 到 ${hi}。`
                    : `它们是 $\\frac{\\pi}{2} + n \\pi$，$n$ 从 ${lo} 到 ${hi - 1}；$n = ${hi}$ 时这个点超出了右边界。`,
                ],
              ],
              [
                ["Count", "计数"],
                [`That makes ${count} zeros.`, `共 ${count} 个零点。`],
              ],
            ],
            useSine
              ? [
                  `The zeros are $\\pi$ apart. From $${lo} \\pi$ to $${hi} \\pi$ there are ${hi - lo} gaps, so ${count} zeros, and the neighbours $${lo - 1} \\pi$ and $${hi + 1} \\pi$ lie $\\frac{3 \\pi}{4}$ outside the edges.`,
                  `零点间隔为 $\\pi$。从 $${lo} \\pi$ 到 $${hi} \\pi$ 有 ${hi - lo} 个间隔，所以有 ${count} 个零点，而相邻的 $${lo - 1} \\pi$ 和 $${hi + 1} \\pi$ 都在边界外 $\\frac{3 \\pi}{4}$ 处。`,
                ]
              : [
                  `The first zero is $\\frac{\\pi}{2} + ${lo} \\pi$ and the last is $\\frac{\\pi}{2} + ${hi - 1} \\pi$: ${hi - lo - 1} gaps of $\\pi$, so ${count} zeros.`,
                  `第一个零点是 $\\frac{\\pi}{2} + ${lo} \\pi$，最后一个是 $\\frac{\\pi}{2} + ${hi - 1} \\pi$：有 ${hi - lo - 1} 个长为 $\\pi$ 的间隔，所以有 ${count} 个零点。`,
                ],
          );
        }),
    ),
  ],
);

const complexPowers = topic(
  "complex-powers-and-branches",
  ["Complex Powers and Branches", "复数幂和分支"],
  ["Define powers through the logarithm and keep track of the branch chosen.", "用对数定义幂，并记住所选的分支。"],
  ["the-complex-logarithm"],
  [],
  [
    point(
      "the-principal-value-of-a-power",
      ["The principal value of a power", "幂的主值"],
      [
        "A complex power is defined by $z^c = e^{c \\log z}$. The principal value uses the principal logarithm, with the argument in $(-\\pi, \\pi]$. Since the logarithm has many values, so does the power in general, and even $i^i$ turns out to be a real number: its principal value is $e^{-\\pi / 2}$. For $(-1)^{2i}$: the principal logarithm of $-1$ is $\\pi i$, and $2i \\cdot \\pi i = -2\\pi$, so the principal value is $e^{-2\\pi}$.\n\nCheck: dividing the exponent back, $-2\\pi \\div 2i = \\pi i$, the principal logarithm of $-1$, so the steps undo correctly.\n\n> **Watch out.** The factor $i \\cdot i = -1$ makes the exponent real and flips its sign. The principal argument of $-i$ is $-\\frac{\\pi}{2}$, not $\\frac{3\\pi}{2}$.",
        "复数幂定义为 $z^c = e^{c \\log z}$。主值使用主对数，辐角取在 $(-\\pi, \\pi]$ 内。由于对数有多个值，幂一般也有多个值，甚至 $i^i$ 也是实数：它的主值是 $e^{-\\pi / 2}$。对 $(-1)^{2i}$：$-1$ 的主对数是 $\\pi i$，而 $2i \\cdot \\pi i = -2\\pi$，所以主值是 $e^{-2\\pi}$。\n\n检验：把指数除回去，$-2\\pi \\div 2i = \\pi i$，正是 $-1$ 的主对数，所以各步可以还原。\n\n> **注意。** 因子 $i \\cdot i = -1$ 使指数成为实数并改变符号。$-i$ 的主辐角是 $-\\frac{\\pi}{2}$，不是 $\\frac{3\\pi}{2}$。",
      ],
      (rng) => {
        const k = rng.int(1, 9);
        const base = rng.pick([
          { en: "i", show: "i", arg: Q.of(1, 2) },
          { en: "-i", show: "(-i)", arg: Q.of(-1, 2) },
          { en: "-1", show: "(-1)", arg: Q.of(1, 1) },
        ]);
        const exponent = base.arg.mul(Q.of(-k, 1));
        const write = (v: Q) => `e^{${piTimes(v)}}`;
        const exponentName = imaginaryName(k);
        const logName = `${piTimes(base.arg)} i`;
        const logFactor = base.arg.sign() < 0 ? `\\left( ${logName} \\right)` : logName;
        const slips: Slip[] = [
          [
            same(write(exponent.neg())),
            `That gets the sign wrong: $${exponentName} \\cdot ${logFactor}$ contains $i \\cdot i = -1$, so the exponent is $${piTimes(exponent)}$.`,
            `那弄错了符号：$${exponentName} \\cdot ${logFactor}$ 含有 $i \\cdot i = -1$，所以指数是 $${piTimes(exponent)}$。`,
          ],
          [
            same(write(exponent.sub(Q.of(2 * k, 1)))),
            `That uses the argument $${piTimes(base.arg.add(Q.of(2, 1)))}$, outside $(-\\pi, \\pi]$; it gives a value on another branch, not the principal one.`,
            `那用了辐角 $${piTimes(base.arg.add(Q.of(2, 1)))}$，它不在 $(-\\pi, \\pi]$ 内；得到的是另一个分支上的值，不是主值。`,
          ],
          [
            same(`e^{${piTimes(exponent.neg())} i}`),
            `That leaves out the $i$ of the exponent $${exponentName}$; multiplying it in makes the exponent real.`,
            `那漏掉了指数 $${exponentName}$ 中的 $i$；把它乘进去，指数就成了实数。`,
          ],
        ];
        return chosen(
          rng,
          [`What is the principal value of $${base.show}^{${exponentName}}$?`, `$${base.show}^{${exponentName}}$ 的主值是多少？`],
          same(write(exponent)),
          slips,
          [
            [
              ["Take the principal logarithm", "取主对数"],
              [
                `$|${base.en}| = 1$ and $\\operatorname{Arg}(${base.en}) = ${piTimes(base.arg)}$, so $\\operatorname{Log}(${base.en}) = ${logName}$.`,
                `$|${base.en}| = 1$，$\\operatorname{Arg}(${base.en}) = ${piTimes(base.arg)}$，所以 $\\operatorname{Log}(${base.en}) = ${logName}$。`,
              ],
            ],
            [
              ["Multiply by the exponent", "乘指数"],
              [
                `$${exponentName} \\cdot ${logFactor} = ${piTimes(exponent)}$, since $i \\cdot i = -1$.`,
                `因为 $i \\cdot i = -1$，$${exponentName} \\cdot ${logFactor} = ${piTimes(exponent)}$。`,
              ],
            ],
            [
              ["Exponentiate", "取指数"],
              [`The principal value is $${write(exponent)}$.`, `主值是 $${write(exponent)}$。`],
            ],
          ],
          [
            `Dividing the exponent back, $${piTimes(exponent)} \\div ${exponentName} = ${logName}$, the principal logarithm of $${base.en}$, so the steps undo correctly.`,
            `把指数除回去，$${piTimes(exponent)} \\div ${exponentName} = ${logName}$，正是 $${base.en}$ 的主对数，所以各步可以还原。`,
          ],
        );
      },
    ),
    point(
      "how-many-values-a-power-has",
      ["How many values a power has", "幂有多少个值"],
      [
        "Different arguments of $z$ differ by multiples of $2 \\pi$, which changes $c \\log z$ by multiples of $2 \\pi i c$. If $c$ is an integer, every value is the same. If $c = p / q$ in lowest terms, there are exactly $q$ values. If $c$ is irrational or not real, there are infinitely many. For example, $8^{1/3}$ has three values: $2$, $2 e^{2\\pi i / 3}$ and $2 e^{4\\pi i / 3}$.\n\nCheck: each of them cubed gives $8$, since $\\left( e^{2\\pi i / 3} \\right)^3 = e^{2\\pi i} = 1$, and a cubic equation $w^3 = 8$ has exactly three roots.\n\n> **Watch out.** Reduce the fraction first: $8^{2/6} = 8^{1/3}$ has three values, not six. An imaginary exponent gives infinitely many values, not one.",
        "$z$ 的不同辐角相差 $2 \\pi$ 的倍数，这使 $c \\log z$ 相差 $2 \\pi i c$ 的倍数。若 $c$ 是整数，所有值都相同。若 $c = p / q$ 是最简分数，恰有 $q$ 个值。若 $c$ 是无理数或非实数，则有无穷多个值。例如 $8^{1/3}$ 有三个值：$2$、$2 e^{2\\pi i / 3}$ 和 $2 e^{4\\pi i / 3}$。\n\n检验：它们的立方都是 $8$，因为 $\\left( e^{2\\pi i / 3} \\right)^3 = e^{2\\pi i} = 1$，而三次方程 $w^3 = 8$ 恰有三个根。\n\n> **注意。** 先约分：$8^{2/6} = 8^{1/3}$ 有三个值，不是六个。虚指数给出无穷多个值，不是一个。",
      ],
      (rng) => {
        const kind = rng.int(0, 2);
        const q = rng.int(2, 9);
        const p = rng.pick(
          Array.from({ length: q + 5 }, (_, i) => i + 1).filter((v) => {
            let [a, b] = [v, q];
            while (b) [a, b] = [b, a % b];
            return a === 1;
          }),
        );
        const z = rng.int(2, 9);
        const many: Pair = ["Infinitely many", "无穷多个"];
        const c = kind === 0 ? `${p + q}` : kind === 1 ? `\\frac{${p}}{${q}}` : imaginaryName(p);
        const one = same("1");
        const qValues = same(String(q));
        const sum = same(String(p + q));
        const correct: Pair = kind === 0 ? one : kind === 1 ? qValues : many;
        const slips: Slip[] =
          kind === 0
            ? [
                [
                  qValues,
                  `That counts the values of a root; the exponent ${p + q} is an integer, so every branch gives the same value.`,
                  `那数的是方根的值；指数 ${p + q} 是整数，所以每个分支给出同一个值。`,
                ],
                [
                  sum,
                  `That counts one value for each unit of the exponent; an integer exponent gives a single value.`,
                  `那按指数的每个单位各算一个值；整数指数只给出一个值。`,
                ],
                [
                  many,
                  "Infinitely many values come only from an irrational or non-real exponent; here every factor $e^{2 \\pi i n c}$ is 1.",
                  "只有无理指数或非实指数才有无穷多个值；这里每个因子 $e^{2 \\pi i n c}$ 都是 1。",
                ],
              ]
            : kind === 1
              ? [
                  [
                    one,
                    `That treats the exponent as an integer; a fraction with denominator ${q} in lowest terms gives ${q} values.`,
                    `那把指数当成了整数；最简分母为 ${q} 的分数给出 ${q} 个值。`,
                  ],
                  [
                    sum,
                    `That adds the numerator and the denominator; only the denominator ${q} counts.`,
                    `那把分子和分母相加；只有分母 ${q} 起作用。`,
                  ],
                  [
                    many,
                    `The values repeat after ${q} turns around the origin, because the exponent is a fraction.`,
                    `指数是分数，所以绕原点 ${q} 圈后值开始重复。`,
                  ],
                ]
              : [
                  [
                    one,
                    "That uses only the principal logarithm; the other values of $\\log z$ give other values of the power.",
                    "那只用了主对数；$\\log z$ 的其他值给出幂的其他值。",
                  ],
                  [
                    qValues,
                    "A finite count would need a real rational exponent; an imaginary exponent never repeats.",
                    "有限个值需要实有理指数；虚指数的值永不重复。",
                  ],
                  [
                    sum,
                    "A finite count would need a real rational exponent; an imaginary exponent never repeats.",
                    "有限个值需要实有理指数；虚指数的值永不重复。",
                  ],
                ];
        const factor = kind === 2 ? `e^{-${2 * p} \\pi n}` : `e^{2 \\pi i n \\cdot ${c}}`;
        return chosen(
          rng,
          [
            `How many distinct values does $${z}^{${c}}$ have as a multivalued complex power?`,
            `作为多值复数幂，$${z}^{${c}}$ 有多少个不同的值？`,
          ],
          correct,
          slips,
          [
            [
              ["List the logarithms", "列出对数"],
              [`$\\log ${z} = \\ln ${z} + 2 \\pi i n$ for every integer $n$.`, `对每个整数 $n$，$\\log ${z} = \\ln ${z} + 2 \\pi i n$。`],
            ],
            [
              ["Raise to the power", "求幂"],
              [`The values are $e^{${c} \\ln ${z}}$ times the factors $${factor}$.`, `这些值是 $e^{${c} \\ln ${z}}$ 乘因子 $${factor}$。`],
            ],
            [
              ["Count the factors", "数因子"],
              kind === 0
                ? [`Since ${p + q} is an integer, every factor is 1: one value.`, `因为 ${p + q} 是整数，每个因子都是 1：只有一个值。`]
                : kind === 1
                  ? [
                      `The factors are ${q}th roots of unity, and since ${p} and ${q} are coprime all ${q} of them appear: ${q} values.`,
                      `这些因子是 ${q} 次单位根，因为 ${p} 和 ${q} 互素，${q} 个都会出现：共 ${q} 个值。`,
                    ]
                  : [
                      "The factors are real numbers, all different from each other: infinitely many values.",
                      "这些因子是互不相同的实数：有无穷多个值。",
                    ],
            ],
          ],
          kind === 0
            ? [
                `Directly, $${z}^{${p + q}}$ is a product of ${p + q} factors equal to ${z}, a single number.`,
                `直接看，$${z}^{${p + q}}$ 是 ${p + q} 个 ${z} 的乘积，只是一个数。`,
              ]
            : kind === 1
              ? [
                  `The values are exactly the solutions of $w^{${q}} = ${power(String(z), p)}$, an equation of degree ${q} with ${q} distinct roots.`,
                  `这些值恰好是 $w^{${q}} = ${power(String(z), p)}$ 的解，这个 ${q} 次方程有 ${q} 个不同的根。`,
                ]
              : [
                  `The value for $n$ has modulus $e^{-${2 * p} \\pi n}$, different for each $n$, so no two values coincide.`,
                  `第 $n$ 个值的模是 $e^{-${2 * p} \\pi n}$，对不同的 $n$ 各不相同，所以没有两个值重合。`,
                ],
        );
      },
    ),
  ],
);

const mlInequality = topic(
  "the-ml-inequality",
  ["The ML Inequality", "ML 不等式"],
  ["Bound a contour integral by the longest value times the length of the path.", "用最大模乘路径长度来估计围道积分。"],
  ["contour-integrals"],
  [],
  [
    point(
      "a-bound-from-length-and-size",
      ["A bound from length and size", "由长度和大小得到的界"],
      [
        "If $|f(z)| \\le M$ everywhere on a path of length $L$, then the integral of $f$ along it has modulus at most $ML$. The estimate needs no antiderivative, and it is the main tool for showing that integrals over large arcs vanish as the radius grows. On the segment from 0 to $3 + 4i$ with $|f| \\le 2$: $L = \\sqrt{3^2 + 4^2} = 5$, and the bound is $2 \\cdot 5 = 10$.\n\nCheck: with $z = (3 + 4i) t$ for $0 \\le t \\le 1$, $|dz| = 5 \\, dt$, so the integral is at most $\\int_0^1 2 \\cdot 5 \\, dt = 10$.\n\n> **Watch out.** The length of the segment is $\\sqrt{3^2 + 4^2} = 5$, not $3 + 4 = 7$. The bound limits the size of the integral; it is not its value.",
        "如果在长度为 $L$ 的路径上处处有 $|f(z)| \\le M$，那么 $f$ 沿路径的积分的模不超过 $ML$。这个估计不需要原函数，是证明大圆弧上的积分随半径增大而趋于零的主要工具。在从 0 到 $3 + 4i$ 的线段上，若 $|f| \\le 2$：$L = \\sqrt{3^2 + 4^2} = 5$，上界是 $2 \\cdot 5 = 10$。\n\n检验：取 $z = (3 + 4i) t$，$0 \\le t \\le 1$，则 $|dz| = 5 \\, dt$，所以积分至多为 $\\int_0^1 2 \\cdot 5 \\, dt = 10$。\n\n> **注意。** 线段长度是 $\\sqrt{3^2 + 4^2} = 5$，不是 $3 + 4 = 7$。这个界限制积分的大小，不是积分的值。",
      ],
      (rng) =>
        until(() => {
          const [dx, dy, d] = rng.pick([
            [3, 4, 5],
            [6, 8, 10],
            [5, 12, 13],
            [8, 15, 17],
          ] as const);
          const m = rng.int(2, 9);
          const misses: Miss[] = [
            [
              m * (dx + dy),
              `That takes the length as ${dx} + ${dy}; the segment has length $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$.`,
              `那把长度当成了 ${dx} + ${dy}；线段长度是 $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$。`,
            ],
            [m, "That leaves out the length $L$; the bound is $M$ times $L$.", "那漏掉了长度 $L$；上界是 $M$ 乘 $L$。"],
            [d, "That leaves out $M$; the bound is $M$ times $L$.", "那漏掉了 $M$；上界是 $M$ 乘 $L$。"],
            [m + d, "That adds $M$ and $L$; the inequality multiplies them.", "那把 $M$ 和 $L$ 相加；不等式是把它们相乘。"],
          ];
          return worked(
            [
              `On the straight segment from 0 to $${dx} + ${dy}i$, a function satisfies $|f(z)| \\le ${m}$. What upper bound does the ML inequality give for the modulus of its integral along the segment?`,
              `在从 0 到 $${dx} + ${dy}i$ 的线段上，函数满足 $|f(z)| \\le ${m}$。ML 不等式给出的这段积分的模的上界是多少？`,
            ],
            m * d,
            misses,
            [
              [
                ["Find the length", "求长度"],
                [`$L = \\sqrt{${dx}^2 + ${dy}^2} = ${d}$.`, `$L = \\sqrt{${dx}^2 + ${dy}^2} = ${d}$。`],
              ],
              [
                ["Multiply", "相乘"],
                [`$ML = ${m} \\cdot ${d} = ${m * d}$.`, `$ML = ${m} \\cdot ${d} = ${m * d}$。`],
              ],
            ],
            [
              `With $z = (${dx} + ${dy}i) t$ for $0 \\le t \\le 1$, $|dz| = ${d} \\, dt$, so the integral is at most $\\int_0^1 ${m} \\cdot ${d} \\, dt = ${m * d}$.`,
              `取 $z = (${dx} + ${dy}i) t$，$0 \\le t \\le 1$，则 $|dz| = ${d} \\, dt$，所以积分至多为 $\\int_0^1 ${m} \\cdot ${d} \\, dt = ${m * d}$。`,
            ],
          );
        }),
    ),
    point(
      "a-bound-on-a-circle",
      ["A bound on a circle", "圆周上的界"],
      [
        "On the circle $|z| = R$ a fraction can be bounded using the triangle inequality: the numerator has size at most the sum of the sizes of its terms, and the denominator $|z^2 - a|$ has size at least $R^2 - |a|$. Then multiply by the circumference $2 \\pi R$ to bound the integral. For $\\frac{3}{z^2 + 5}$ on $|z| = 3$: $|z^2 + 5| \\ge 9 - 5 = 4$, so $M = \\frac{3}{4}$; with $L = 6\\pi$ the bound is $\\frac{9\\pi}{2}$.\n\nCheck: at $z = 3i$, $z^2 + 5 = -4$, so $|f| = \\frac{3}{4}$ is reached there and $M$ is the true maximum.\n\n> **Watch out.** $R^2 - |a|$ is the smallest the denominator can be; $R^2 + |a|$ is its largest, and dividing by it gives no bound. Use the whole circumference $2\\pi R$.",
        "在圆周 $|z| = R$ 上可以用三角不等式估计分式：分子不超过各项模之和，分母 $|z^2 - a|$ 至少是 $R^2 - |a|$。再乘周长 $2 \\pi R$，就得到积分的上界。对 $|z| = 3$ 上的 $\\frac{3}{z^2 + 5}$：$|z^2 + 5| \\ge 9 - 5 = 4$，所以 $M = \\frac{3}{4}$；$L = 6\\pi$，上界是 $\\frac{9\\pi}{2}$。\n\n检验：在 $z = 3i$ 处，$z^2 + 5 = -4$，所以那里 $|f| = \\frac{3}{4}$，$M$ 正是真正的最大值。\n\n> **注意。** $R^2 - |a|$ 是分母可能的最小值；$R^2 + |a|$ 是它的最大值，除以它得不到上界。要用整个周长 $2\\pi R$。",
      ],
      (rng) =>
        until(() => {
          const r = rng.int(2, 6);
          const a = rng.int(1, r * r - 1);
          const b = rng.int(1, 9);
          const low = r * r - a;
          const answer = Q.of(b * 2 * r, low);
          const size = Q.of(b, low).toLatex();
          const misses: Miss[] = [
            [
              Q.of(b * r, low),
              "That uses $\\pi R$ for the length; a full circle has length $2 \\pi R$.",
              "那把长度当成了 $\\pi R$；整个圆周长 $2 \\pi R$。",
            ],
            [
              Q.of(b * 2 * r, r * r + a),
              `That divides by $${r}^2 + ${a}$, the largest value of the denominator, not the smallest.`,
              `那除以了 $${r}^2 + ${a}$，这是分母的最大值，不是最小值。`,
            ],
            [Q.of(b, low), "That gives only $M$ and leaves out the length $2 \\pi R$.", "那只给出了 $M$，漏掉了长度 $2 \\pi R$。"],
            [2 * r, "That gives only the length and leaves out $M$.", "那只给出了长度，漏掉了 $M$。"],
          ];
          return worked(
            [
              `For the integral of $\\frac{${b}}{z^2 + ${a}}$ around $|z| = ${r}$, the ML inequality gives a bound of the form $k \\pi$. What is $k$, using $|z^2 + ${a}| \\ge ${r}^2 - ${a}$?`,
              `对 $\\frac{${b}}{z^2 + ${a}}$ 沿 $|z| = ${r}$ 的积分，ML 不等式给出 $k \\pi$ 形式的上界。利用 $|z^2 + ${a}| \\ge ${r}^2 - ${a}$，$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Bound the function", "估计函数"],
                [
                  `On the circle $|z^2 + ${a}| \\ge ${r * r} - ${a} = ${low}$, so $|f| \\le M = ${size}$.`,
                  `在圆周上 $|z^2 + ${a}| \\ge ${r * r} - ${a} = ${low}$，所以 $|f| \\le M = ${size}$。`,
                ],
              ],
              [
                ["Find the length", "求长度"],
                [`$L = 2 \\pi \\cdot ${r} = ${2 * r} \\pi$.`, `$L = 2 \\pi \\cdot ${r} = ${2 * r} \\pi$。`],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$ML = ${size} \\cdot ${2 * r} \\pi = ${piTimes(answer)}$, so $k = ${answer.toLatex()}$.`,
                  `$ML = ${size} \\cdot ${2 * r} \\pi = ${piTimes(answer)}$，所以 $k = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `At $z = ${imaginaryName(r)}$ on the circle, $z^2 + ${a} = ${a - r * r}$, so $|f| = ${size}$ is reached there and $M$ cannot be taken smaller.`,
              `在圆周上的 $z = ${imaginaryName(r)}$ 处，$z^2 + ${a} = ${a - r * r}$，所以那里 $|f| = ${size}$，$M$ 不能取得更小。`,
            ],
          );
        }),
    ),
  ],
);

/** windingCase draws a curve with an inner loop, and marks a point around which it winds a known number of times. */
function windingCase(rng: Rng): {
  readonly winding: number;
  readonly turns: number;
  readonly sign: number;
  readonly figure: Figure;
  readonly name: string;
} {
  const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
  const clockwise = rng.bool();
  const spot = rng.pick([
    { at: [1, 0] as Point, turns: 2 },
    { at: [4, 0] as Point, turns: 1 },
    { at: [4, 2] as Point, turns: 1 },
    { at: [-2, 3] as Point, turns: 0 },
    { at: [6, 3] as Point, turns: 0 },
  ]);
  const path: Point[] = Array.from({ length: 145 }, (_, i) => {
    const a = (2 * Math.PI * i) / 144;
    const r = 2 + 4 * Math.cos(a);
    return [Math.round((h + r * Math.cos(a)) * 100) / 100, Math.round((k + r * Math.sin(a)) * 100) / 100];
  });
  const [p, q] = [path[30] as Point, path[33] as Point];
  const figure: Figure = {
    svg: plane({ xMin: -4, xMax: 8, yMin: -6, yMax: 6, labelEvery: 2 }, [
      { kind: "path", points: path, accent: true },
      { kind: "arrow", from: clockwise ? q : p, to: clockwise ? p : q, accent: true },
      { kind: "point", at: [spot.at[0] + h, spot.at[1] + k], label: "P", dir: "ne" },
    ]),
    alt: t(
      "A closed curve with an inner loop, an arrow showing its direction, and a marked point $P$.",
      "带内环的闭曲线，箭头表示方向，并标出点 $P$。",
    ),
  };
  const sign = clockwise ? -1 : 1;
  return {
    winding: sign * spot.turns,
    turns: spot.turns,
    sign,
    figure,
    name: `(${spot.at[0] + h}, ${spot.at[1] + k})`,
  };
}

/** regionOf names where a point lies on the looped curve, by how often the curve goes around it. */
const regionOf = (turns: number): Pair =>
  turns === 2
    ? ["inside the inner loop", "在内环里"]
    : turns === 1
      ? ["between the two loops", "在两个环之间"]
      : ["outside the curve", "在曲线外"];

/** windingMisses lists the counts a learner reads from the wrong region of the looped curve, scaled by factor. */
const windingMisses = (turns: number, sign: number, factor: number): Miss[] => {
  const [hereEn, hereZh] = regionOf(turns);
  return [0, 1, 2]
    .filter((other) => other !== turns)
    .map((other): Miss => {
      const [thereEn, thereZh] = regionOf(other);
      return [
        factor * sign * other,
        `That places $P$ ${thereEn}, which the curve goes around ${other} time${other === 1 ? "" : "s"}; $P$ is ${hereEn}.`,
        `那把 $P$ 当成${thereZh}，曲线绕那里 ${other} 圈；而 $P$ ${hereZh}。`,
      ];
    });
};

const windingNumbers = topic(
  "winding-numbers",
  ["Winding Numbers", "环绕数"],
  ["Count how many times a closed path turns around a point.", "数闭路径绕一点转了几圈。"],
  ["cauchys-integral-theorem"],
  [],
  [
    {
      ...point(
        "reading-a-winding-number",
        ["Reading a winding number", "读环绕数"],
        [
          "The winding number of a closed path about a point counts its net turns around that point, positive for counterclockwise and negative for clockwise. To read it, draw a ray from the point to far away and add one for each crossing going counterclockwise, and subtract one for each going clockwise. It is zero far from the curve. In the drawing the path runs counterclockwise with an inner loop: a ray from the point inside the inner loop crosses the path twice, so its winding number is 2; the point between the loops has 1, and the far point has 0.\n\nCheck: a ray from the point between the loops crosses the path only once, on the outer loop, which gives 1; the inner loop is passed by and adds nothing.\n\n> **Watch out.** Reversing the direction of the path changes the sign of every winding number. Count crossings with their direction, not just how many there are.",
          "闭路径绕一点的环绕数是它绕该点的净圈数，逆时针为正，顺时针为负。读法是：从这一点向远处画一条射线，每次逆时针穿过加一，顺时针穿过减一。远离曲线的点环绕数为零。图中路径逆时针运行，带一个内环：从内环里的点出发的射线穿过路径两次，所以环绕数是 2；两环之间的点是 1，远处的点是 0。\n\n检验：从两环之间的点出发的射线只穿过外环一次，得 1；内环被绕开，不起作用。\n\n> **注意。** 路径方向反过来，每个环绕数都变号。数穿越次数时要带上方向，不能只数次数。",
        ],
        (rng) =>
          until(() => {
            const { winding, turns, sign, figure, name } = windingCase(rng);
            const [hereEn, hereZh] = regionOf(turns);
            const dirEn = sign > 0 ? "counterclockwise" : "clockwise";
            const dirZh = sign > 0 ? "逆时针" : "顺时针";
            const misses: Miss[] = [
              [
                -winding,
                `That ignores the arrow: the curve runs ${dirEn}, so each turn counts as $${sign > 0 ? "+1" : "-1"}$.`,
                `那忽略了箭头：曲线${dirZh}运行，所以每圈记作 $${sign > 0 ? "+1" : "-1"}$。`,
              ],
              ...windingMisses(turns, sign, 1),
            ];
            return worked(
              [
                "What is the winding number of the curve about the point $P$, in the direction shown?",
                "按图中方向，曲线绕点 $P$ 的环绕数是多少？",
              ],
              winding,
              misses,
              [
                [
                  ["Read the direction", "看方向"],
                  [
                    `The arrow shows the curve running ${dirEn}, so each turn counts as $${sign > 0 ? "+1" : "-1"}$.`,
                    `箭头表明曲线${dirZh}运行，所以每圈记作 $${sign > 0 ? "+1" : "-1"}$。`,
                  ],
                ],
                [
                  ["Locate the point", "确定点的位置"],
                  [`$P = ${name}$ lies ${hereEn}.`, `$P = ${name}$ ${hereZh}。`],
                ],
                [
                  ["Count the turns", "数圈数"],
                  [
                    `The curve goes around that region ${turns} time${turns === 1 ? "" : "s"}, so the winding number is $${winding}$.`,
                    `曲线绕这个区域 ${turns} 圈，所以环绕数是 $${winding}$。`,
                  ],
                ],
              ],
              turns === 0
                ? [
                    "A ray from $P$ pointing away from the curve meets it nowhere, so the net count of crossings is 0.",
                    "从 $P$ 出发、背离曲线的射线与曲线不相交，所以穿越的净次数是 0。",
                  ]
                : [
                    `A ray from $P$ to the right crosses the curve ${turns} time${turns === 1 ? "" : "s"}, each in the direction of the arrow, for a net count of $${winding}$.`,
                    `从 $P$ 向右的射线穿过曲线 ${turns} 次，每次都沿箭头方向，净次数是 $${winding}$。`,
                  ],
              figure,
            );
          }),
      ),
      figure: complexDrawings1["winding-numbers#reading-a-winding-number"],
    },
    point(
      "the-integral-of-a-simple-pole",
      ["The integral of a simple pole", "单极点的积分"],
      [
        "The integral of $\\frac{1}{z - a}$ around a closed path that avoids $a$ equals $2 \\pi i$ times the winding number of the path about $a$. A path may therefore pass around the pole several times, or not at all, and the integral records this count exactly. The path $z = 1 + 2e^{it}$, $0 \\le t \\le 4\\pi$, goes twice around $a = 1$, so $\\oint \\frac{dz}{z - 1} = 2 \\cdot 2\\pi i = 4\\pi i$.\n\nCheck: on this path $\\frac{dz}{z - 1} = \\frac{2i e^{it} \\, dt}{2e^{it}} = i \\, dt$, and $\\int_0^{4\\pi} i \\, dt = 4\\pi i$.\n\n> **Watch out.** The integral is $2\\pi i$ times the winding number, so $k$ in $k \\pi i$ is twice the winding number. If the path does not go around $a$, the integral is 0.",
        "$\\frac{1}{z - a}$ 沿不经过 $a$ 的闭路径的积分，等于 $2 \\pi i$ 乘路径绕 $a$ 的环绕数。路径可以绕极点多圈，也可以不绕，积分准确地记下这个次数。路径 $z = 1 + 2e^{it}$，$0 \\le t \\le 4\\pi$，绕 $a = 1$ 两圈，所以 $\\oint \\frac{dz}{z - 1} = 2 \\cdot 2\\pi i = 4\\pi i$。\n\n检验：在这条路径上 $\\frac{dz}{z - 1} = \\frac{2i e^{it} \\, dt}{2e^{it}} = i \\, dt$，而 $\\int_0^{4\\pi} i \\, dt = 4\\pi i$。\n\n> **注意。** 积分是 $2\\pi i$ 乘环绕数，所以 $k \\pi i$ 中的 $k$ 是环绕数的两倍。如果路径不绕 $a$，积分为 0。",
      ],
      (rng) =>
        until(() => {
          const { winding, turns, sign, figure, name } = windingCase(rng);
          const [hereEn, hereZh] = regionOf(turns);
          const dirEn = sign > 0 ? "counterclockwise" : "clockwise";
          const dirZh = sign > 0 ? "逆时针" : "顺时针";
          const misses: Miss[] = [
            [
              winding,
              "That is the winding number itself; the integral is $2 \\pi i$ times it, so $k$ is twice it.",
              "那是环绕数本身；积分是它的 $2 \\pi i$ 倍，所以 $k$ 是它的两倍。",
            ],
            [
              -2 * winding,
              `That ignores the arrow: the curve runs ${dirEn}, which sets the sign.`,
              `那忽略了箭头：曲线${dirZh}运行，这决定了符号。`,
            ],
            ...windingMisses(turns, sign, 2),
          ];
          return worked(
            [
              "The integral of $\\frac{1}{z - a}$ along the curve, where $a$ is the point $P$, equals $k \\pi i$. What is $k$?",
              "$\\frac{1}{z - a}$ 沿曲线的积分等于 $k \\pi i$，其中 $a$ 是点 $P$。$k$ 是多少？",
            ],
            2 * winding,
            misses,
            [
              [
                ["Find the winding number", "求环绕数"],
                [
                  `$P = ${name}$ lies ${hereEn}, and the curve runs ${dirEn}, so the winding number is $${winding}$.`,
                  `$P = ${name}$ ${hereZh}，曲线${dirZh}运行，所以环绕数是 $${winding}$。`,
                ],
              ],
              [
                ["Multiply by 2πi", "乘 2πi"],
                [
                  `The integral is $2 \\pi i \\cdot ${shift(winding)} = ${2 * winding} \\pi i$, so $k = ${2 * winding}$.`,
                  `积分是 $2 \\pi i \\cdot ${shift(winding)} = ${2 * winding} \\pi i$，所以 $k = ${2 * winding}$。`,
                ],
              ],
            ],
            turns === 0
              ? [
                  "The function $\\frac{1}{z - a}$ is analytic on and inside the curve, since $P$ lies outside it, so Cauchy's theorem gives 0 directly.",
                  "$P$ 在曲线外，所以 $\\frac{1}{z - a}$ 在曲线上及其内部解析，由柯西定理直接得 0。",
                ]
              : [
                  `Each turn around $a$ gives the same as a small circle $a + \\varepsilon e^{it}$, on which $\\frac{dz}{z - a} = i \\, dt$ integrates to $2 \\pi i$; ${turns} ${dirEn} turn${turns === 1 ? "" : "s"} give $${2 * winding} \\pi i$.`,
                  `每绕 $a$ 一圈，都与小圆 $a + \\varepsilon e^{it}$ 相同，在小圆上 $\\frac{dz}{z - a} = i \\, dt$ 积分得 $2 \\pi i$；${dirZh}绕 ${turns} 圈得 $${2 * winding} \\pi i$。`,
                ],
            figure,
          );
        }),
    ),
  ],
);

const zeros = topic(
  "zeros-of-analytic-functions",
  ["Zeros of Analytic Functions", "解析函数的零点"],
  ["Find the order of a zero and use the isolation of zeros.", "求零点的阶，并利用零点的孤立性。"],
  ["taylor-series-of-analytic-functions"],
  [],
  [
    point(
      "the-order-of-a-zero",
      ["The order of a zero", "零点的阶"],
      [
        "A zero of an analytic function has order $m$ if the first $m$ Taylor coefficients at that point vanish and the next does not. Equivalently, the function is $(z - a)^m$ times an analytic function that is not zero at $a$. Products add orders, so factor where you can. For $z^2 (1 - \\cos z)$: $1 - \\cos z = \\frac{z^2}{2} - \\frac{z^4}{24} + \\dots$ has a zero of order 2, so the product has order $2 + 2 = 4$.\n\nCheck: $z^2 (1 - \\cos z) = \\frac{z^4}{2} - \\dots$, so its first three derivatives vanish at 0 and the fourth is $\\frac{4!}{2} = 12 \\ne 0$.\n\n> **Watch out.** Read the first nonzero term of each factor: $e^z - 1 - z$ starts with $\\frac{z^2}{2}$, and $z - \\sin z$ with $\\frac{z^3}{6}$. Orders add in a product; they do not multiply.",
        "解析函数的零点阶数为 $m$，是指该点处前 $m$ 个泰勒系数为零，下一个不为零。等价地说，函数是 $(z - a)^m$ 乘一个在 $a$ 处不为零的解析函数。乘积的阶数相加，所以能分解时先分解。对 $z^2 (1 - \\cos z)$：$1 - \\cos z = \\frac{z^2}{2} - \\frac{z^4}{24} + \\dots$ 有 2 阶零点，所以乘积的阶是 $2 + 2 = 4$。\n\n检验：$z^2 (1 - \\cos z) = \\frac{z^4}{2} - \\dots$，所以它的前三阶导数在 0 处为零，四阶导数是 $\\frac{4!}{2} = 12 \\ne 0$。\n\n> **注意。** 要看每个因子的第一个非零项：$e^z - 1 - z$ 从 $\\frac{z^2}{2}$ 开始，$z - \\sin z$ 从 $\\frac{z^3}{6}$ 开始。乘积的阶数相加，不是相乘。",
      ],
      (rng) =>
        until(() => {
          const j = rng.int(1, 9);
          const [factor, extra, first, coefficient] = rng.pick([
            ["\\sin z", 1, "z", "1"],
            ["(1 - \\cos z)", 2, "\\frac{z^2}{2}", "\\frac{1}{2}"],
            ["(e^z - 1)", 1, "z", "1"],
            ["(z - \\sin z)", 3, "\\frac{z^3}{6}", "\\frac{1}{6}"],
            ["(e^z - 1 - z)", 2, "\\frac{z^2}{2}", "\\frac{1}{2}"],
          ] as const);
          const body = `${power("z", j)} ${factor}`;
          const answer = j + extra;
          const misses: Miss[] = [
            [
              j,
              `That counts only the power of $z$; the factor $${factor}$ also vanishes at 0.`,
              `那只算了 $z$ 的幂；因子 $${factor}$ 在 0 处也为零。`,
            ],
            [
              extra,
              `That counts only the factor $${factor}$ and leaves out $${power("z", j)}$.`,
              `那只算了因子 $${factor}$，漏掉了 $${power("z", j)}$。`,
            ],
            [j * extra, "That multiplies the orders; in a product they add.", "那把阶数相乘；乘积的阶数是相加的。"],
            [
              answer + 1,
              `That puts the first nonzero term of $${factor}$ one degree too high; it starts with $${first}$.`,
              `那把 $${factor}$ 的第一个非零项的次数算高了一次；它从 $${first}$ 开始。`,
            ],
          ];
          return worked(
            [`What is the order of the zero of $${body}$ at $z = 0$?`, `$${body}$ 在 $z = 0$ 处零点的阶是多少？`],
            answer,
            misses,
            [
              [
                ["The power of z", "z 的幂"],
                [`$${power("z", j)}$ has a zero of order ${j} at 0.`, `$${power("z", j)}$ 在 0 处有 ${j} 阶零点。`],
              ],
              [
                ["The other factor", "另一个因子"],
                [
                  `The Taylor series of $${factor}$ starts with $${first}$, so its zero has order ${extra}.`,
                  `$${factor}$ 的泰勒级数从 $${first}$ 开始，所以它的零点是 ${extra} 阶。`,
                ],
              ],
              [
                ["Add the orders", "阶数相加"],
                [`$${j} + ${extra} = ${answer}$.`, `$${j} + ${extra} = ${answer}$。`],
              ],
            ],
            [
              `$${body} = ${power("z", answer)} \\left( ${coefficient} + O(z) \\right)$, and the bracket equals $${coefficient}$ at 0, so it is not zero there.`,
              `$${body} = ${power("z", answer)} \\left( ${coefficient} + O(z) \\right)$，括号在 0 处等于 $${coefficient}$，不为零。`,
            ],
          );
        }),
    ),
    point(
      "applying-the-identity-theorem",
      ["Applying the identity theorem", "应用唯一性定理"],
      [
        "The zeros of a nonzero analytic function are isolated. So if two analytic functions on a connected region agree on a set with a limit point inside the region, they agree everywhere there. Agreement on a segment or a convergent sequence decides the whole function, which is why real identities extend to the plane. If an entire $f$ has $f(\\frac{1}{n}) = \\frac{3}{n}$ for every $n \\ge 1$, then $f$ agrees with $3z$ on points that tend to 0, so $f(z) = 3z$ and $f(5) = 15$.\n\nCheck: $3z$ itself takes the value $\\frac{3}{n}$ at $\\frac{1}{n}$, so it is one such function, and the theorem says it is the only one.\n\n> **Watch out.** The limit point must lie inside the region. Values at $1, 2, 3, \\dots$, which run off to infinity, decide nothing: $\\sin \\pi z$ vanishes at all of them without being zero.",
        "非零解析函数的零点是孤立的。所以如果两个解析函数在连通区域内，在一个以区域内点为极限点的集合上相等，它们就处处相等。在一条线段或一个收敛序列上相等就决定了整个函数，所以实恒等式能推广到复平面。如果整函数 $f$ 对每个 $n \\ge 1$ 满足 $f(\\frac{1}{n}) = \\frac{3}{n}$，那么 $f$ 与 $3z$ 在趋于 0 的点上相等，所以 $f(z) = 3z$，$f(5) = 15$。\n\n检验：$3z$ 本身在 $\\frac{1}{n}$ 处取值 $\\frac{3}{n}$，所以它是一个这样的函数，而定理说它是唯一的。\n\n> **注意。** 极限点必须在区域内。在 $1, 2, 3, \\dots$ 处的值趋于无穷远，决定不了什么：$\\sin \\pi z$ 在这些点都为零，自己却不恒为零。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(2, 9);
          const c = rng.int(2, 9);
          const squared = rng.bool();
          const rule = squared ? "\\frac{1}{n^2}" : "\\frac{1}{n}";
          const misses: Miss[] = [
            [
              c,
              `That takes $f$ to be the constant ${c}; the values $${c} \\cdot ${rule}$ change with $n$.`,
              `那把 $f$ 当成了常数 ${c}；值 $${c} \\cdot ${rule}$ 随 $n$ 变化。`,
            ],
            [n, `That forgets the factor ${c}: $f(z) = ${c}z$.`, `那漏掉了因子 ${c}：$f(z) = ${c}z$。`],
            [c + n, `That adds ${c} and ${n}; $f(z) = ${c}z$ multiplies.`, `那把 ${c} 和 ${n} 相加；$f(z) = ${c}z$ 是相乘。`],
            [
              Q.of(c, squared ? n * n : n),
              `That puts ${n} into the rule $${rule}$ instead of into $f(z) = ${c}z$.`,
              `那把 ${n} 代入了 $${rule}$，而不是代入 $f(z) = ${c}z$。`,
            ],
          ];
          if (squared)
            misses.push([
              c * n * n,
              `That reads $f(z) = ${c}z^2$ from the square; at each point $w = \\frac{1}{n^2}$ the value is $${c}w$.`,
              `那从平方读出了 $f(z) = ${c}z^2$；在每个点 $w = \\frac{1}{n^2}$ 处值是 $${c}w$。`,
            ]);
          return worked(
            [
              `An entire function satisfies $f(${rule}) = ${c} \\cdot ${rule}$ for every positive integer $n$. What is $f(${n})$?`,
              `一个整函数对每个正整数 $n$ 都满足 $f(${rule}) = ${c} \\cdot ${rule}$。$f(${n})$ 是多少？`,
            ],
            c * n,
            misses,
            [
              [
                ["Find a matching function", "找出相符的函数"],
                [
                  `$g(z) = ${c}z$ is entire and $g(${rule}) = ${c} \\cdot ${rule}$, so $f$ and $g$ agree at every point $${rule}$.`,
                  `$g(z) = ${c}z$ 是整函数，且 $g(${rule}) = ${c} \\cdot ${rule}$，所以 $f$ 与 $g$ 在每个点 $${rule}$ 处相等。`,
                ],
              ],
              [
                ["Use the limit point", "用极限点"],
                [
                  `The points $${rule}$ tend to 0, inside the plane, so the identity theorem gives $f = g$ everywhere.`,
                  `点 $${rule}$ 趋于 0，而 0 在复平面内，所以由唯一性定理处处有 $f = g$。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [`$f(${n}) = ${c} \\cdot ${n} = ${c * n}$.`, `$f(${n}) = ${c} \\cdot ${n} = ${c * n}$。`],
              ],
            ],
            [
              `$f(z) - ${c}z$ vanishes at every point $${rule}$, and these zeros crowd into 0. A nonzero entire function has only isolated zeros, so $f(z) - ${c}z = 0$, and indeed $f(${n}) - ${c * n} = 0$.`,
              `$f(z) - ${c}z$ 在每个点 $${rule}$ 处为零，这些零点向 0 聚集。非零整函数的零点都是孤立的，所以 $f(z) - ${c}z = 0$，于是 $f(${n}) - ${c * n} = 0$。`,
            ],
          );
        }),
    ),
  ],
);

const annuli = topic(
  "laurent-series-on-annuli",
  ["Laurent Series on Annuli", "圆环上的洛朗级数"],
  ["Choose the expansion that matches the region where a series is wanted.", "选择与所需区域相符的展开式。"],
  ["laurent-series"],
  [],
  [
    {
      ...point(
        "counting-the-regions-of-expansion",
        ["Counting the regions of expansion", "数展开的区域"],
        [
          "A rational function has a different Laurent series about a center on each annulus bounded by its poles. If the poles lie at several distinct distances from the center, these circles split the plane into one disc, some annuli, and one outer region. The same function has one expansion on each. For $\\frac{1}{(z - 1)(z - 2i)(z - 3)}$ about 0, the poles lie at distances 1, 2 and 3, so there are four regions: $|z| < 1$, $1 < |z| < 2$, $2 < |z| < 3$ and $|z| > 3$.\n\nCheck: each new circle splits one region into two, so three circles give $1 + 3 = 4$ regions.\n\n> **Watch out.** Poles at the same distance, such as 2 and $-2$, share one circle. Count distinct distances, not poles.",
          "有理函数在以极点为界的每个圆环上，都有一个不同的洛朗级数。如果极点到中心有若干个不同的距离，这些圆周就把平面分成一个圆盘、一些圆环和一个外部区域。同一个函数在每个区域上各有一个展开式。对 $\\frac{1}{(z - 1)(z - 2i)(z - 3)}$ 在 0 处展开，极点的距离是 1、2 和 3，所以有四个区域：$|z| < 1$、$1 < |z| < 2$、$2 < |z| < 3$ 和 $|z| > 3$。\n\n检验：每多一个圆周就把一个区域分成两个，所以三个圆周给出 $1 + 3 = 4$ 个区域。\n\n> **注意。** 到中心距离相同的极点，例如 2 和 $-2$，共用一个圆周。要数不同的距离，而不是极点个数。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(1, 3);
            const b = a + rng.int(1, 3);
            const c = b + rng.int(1, 3);
            const kind = rng.int(0, 2);
            const body =
              kind === 0 ? `(z - ${a})(z + ${b})` : kind === 1 ? `(z - ${a})(z + ${b})(z - ${c})` : `(z - ${a})(z + ${a})(z - ${c})`;
            const poles = kind === 0 ? `$${a}$ and $-${b}$` : kind === 1 ? `$${a}$, $-${b}$ and $${c}$` : `$${a}$, $-${a}$ and $${c}$`;
            const polesZh = kind === 0 ? `$${a}$ 和 $-${b}$` : kind === 1 ? `$${a}$、$-${b}$ 和 $${c}$` : `$${a}$、$-${a}$ 和 $${c}$`;
            const radii = kind === 0 ? [a, b] : kind === 1 ? [a, b, c] : [a, c];
            const count = radii.length + 1;
            const regions = [
              `|z| < ${radii[0]}`,
              ...radii.slice(1).map((r, i) => `${radii[i]} < |z| < ${r}`),
              `|z| > ${radii[radii.length - 1]}`,
            ];
            const misses: Miss[] = [
              [
                radii.length,
                `That counts the circles; ${radii.length} circles split the plane into ${count} regions.`,
                `那数的是圆周；${radii.length} 个圆周把平面分成 ${count} 个区域。`,
              ],
            ];
            if (kind === 2)
              misses.push([
                4,
                `That gives each pole its own circle; $${a}$ and $-${a}$ lie on the same circle $|z| = ${a}$.`,
                `那给每个极点各算了一个圆周；$${a}$ 和 $-${a}$ 在同一个圆周 $|z| = ${a}$ 上。`,
              ]);
            misses.push(
              [
                count + 1,
                "That counts the center 0 as a boundary too; the function is analytic at 0, so the disc around it is one region.",
                "那把中心 0 也当成了边界；函数在 0 处解析，所以它周围的圆盘是一个区域。",
              ],
              [
                2,
                "That counts only the inner disc and the outer region, leaving out the annuli between the circles.",
                "那只数了内部圆盘和外部区域，漏掉了圆周之间的圆环。",
              ],
            );
            return worked(
              [
                `How many different Laurent series about $z = 0$ does $\\frac{1}{${body}}$ have, one for each region of convergence?`,
                `$\\frac{1}{${body}}$ 在 $z = 0$ 处有多少个不同的洛朗级数（每个收敛区域一个）？`,
              ],
              count,
              misses,
              [
                [
                  ["Distances of the poles", "极点的距离"],
                  [
                    `The poles ${poles} lie at distances ${radii.join(", ")} from 0.`,
                    `极点 ${polesZh} 到 0 的不同距离是 ${radii.join("、")}。`,
                  ],
                ],
                [
                  ["Circles", "圆周"],
                  [`That makes ${radii.length} circles about 0.`, `这给出以 0 为中心的 ${radii.length} 个圆周。`],
                ],
                [
                  ["Regions", "区域"],
                  [`They split the plane into ${count} regions.`, `它们把平面分成 ${count} 个区域。`],
                ],
              ],
              [
                `Listing them: ${regions.map((r) => `$${r}$`).join(", ")}, which makes ${count}, each with its own series.`,
                `逐个列出：${regions.map((r) => `$${r}$`).join("、")}，共 ${count} 个，每个有自己的级数。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["laurent-series-on-annuli#counting-the-regions-of-expansion"],
    },
    point(
      "a-coefficient-outside-the-pole",
      ["A coefficient outside the pole", "极点外部的系数"],
      [
        "For $|z| > |a|$ expand in powers of $a / z$: $\\frac{1}{z - a} = \\frac{1}{z} \\cdot \\frac{1}{1 - a / z} = \\sum_{n \\ge 0} \\frac{a^n}{z^{n+1}}$. Outside the pole all the powers are negative. The geometric series about $z = 0$ that works inside would diverge in this region. For $\\frac{1}{z - 3}$ on $|z| > 3$ the series is $\\sum \\frac{3^n}{z^{n+1}}$, so the coefficient of $\\frac{1}{z^3}$ is $3^2 = 9$.\n\nCheck: multiplying $(z - 3) \\left( \\frac{1}{z} + \\frac{3}{z^2} + \\frac{9}{z^3} + \\dots \\right)$, every negative power cancels and the product is 1.\n\n> **Watch out.** The term $\\frac{1}{z^k}$ has $n = k - 1$, not $k$. For $z + a$ the base is $-a$, so the signs alternate.",
        "当 $|z| > |a|$ 时，按 $a / z$ 的幂展开：$\\frac{1}{z - a} = \\frac{1}{z} \\cdot \\frac{1}{1 - a / z} = \\sum_{n \\ge 0} \\frac{a^n}{z^{n+1}}$。在极点外部，幂次全是负的。在内部适用的几何级数在这个区域会发散。对 $|z| > 3$ 上的 $\\frac{1}{z - 3}$，级数是 $\\sum \\frac{3^n}{z^{n+1}}$，所以 $\\frac{1}{z^3}$ 的系数是 $3^2 = 9$。\n\n检验：把 $(z - 3) \\left( \\frac{1}{z} + \\frac{3}{z^2} + \\frac{9}{z^3} + \\dots \\right)$ 乘开，所有负幂项都抵消，乘积是 1。\n\n> **注意。** $\\frac{1}{z^k}$ 这一项对应 $n = k - 1$，不是 $k$。对 $z + a$，底数是 $-a$，所以符号交替。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 5);
          const k = rng.int(2, 5);
          const sign = rng.pick([1, -1]);
          const s = sign * a;
          const center = sign > 0 ? `z - ${a}` : `z + ${a}`;
          const answer = s ** (k - 1);
          const previous = s ** (k - 2);
          const base = sign > 0 ? String(a) : `(-${a})`;
          const misses: Miss[] = [
            [
              s ** k,
              `That uses $n = ${k}$; the term in $z^{-${k}}$ has $n = ${k - 1}$.`,
              `那用了 $n = ${k}$；$z^{-${k}}$ 这一项对应 $n = ${k - 1}$。`,
            ],
            [
              Q.of(1, a ** k),
              `That inverts the power, as in the series for $|z| < ${a}$, where powers of $\\frac{1}{${a}}$ appear.`,
              `那把幂取了倒数，就像 $|z| < ${a}$ 上的级数那样，那里出现的是 $\\frac{1}{${a}}$ 的幂。`,
            ],
            sign > 0
              ? [
                  -answer,
                  `That puts in a minus sign; for $z - ${a}$ every coefficient is positive.`,
                  `那多了一个负号；对 $z - ${a}$，每个系数都是正的。`,
                ]
              : [
                  -answer,
                  `That drops the sign of the base; for $z + ${a}$ the base is $-${a}$.`,
                  `那丢了底数的符号；对 $z + ${a}$，底数是 $-${a}$。`,
                ],
            [
              a * (k - 1),
              `That multiplies ${a} by $n$ instead of raising it to the power $n$.`,
              `那用 ${a} 乘 $n$，而不是求它的 $n$ 次幂。`,
            ],
          ];
          return worked(
            [
              `In the Laurent series of $\\frac{1}{${center}}$ valid for $|z| > ${a}$, what is the coefficient of $\\frac{1}{z^{${k}}}$?`,
              `$\\frac{1}{${center}}$ 在 $|z| > ${a}$ 上的洛朗级数中，$\\frac{1}{z^{${k}}}$ 的系数是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Factor out z", "提出 z"],
                [
                  `$\\frac{1}{${center}} = \\frac{1}{z} \\cdot \\frac{1}{1 - \\frac{${s}}{z}}$, and $\\left| \\frac{${s}}{z} \\right| < 1$ for $|z| > ${a}$.`,
                  `$\\frac{1}{${center}} = \\frac{1}{z} \\cdot \\frac{1}{1 - \\frac{${s}}{z}}$，而当 $|z| > ${a}$ 时 $\\left| \\frac{${s}}{z} \\right| < 1$。`,
                ],
              ],
              [
                ["Expand", "展开"],
                [
                  `The geometric series gives $\\sum_{n \\ge 0} \\frac{${base}^n}{z^{n+1}}$.`,
                  `几何级数给出 $\\sum_{n \\ge 0} \\frac{${base}^n}{z^{n+1}}$。`,
                ],
              ],
              [
                ["Pick the term", "取出对应项"],
                [
                  `For $z^{-${k}}$ take $n = ${k - 1}$: the coefficient is ${k === 2 ? `$${answer}$` : `$${power(base, k - 1)} = ${answer}$`}.`,
                  `对 $z^{-${k}}$ 取 $n = ${k - 1}$：系数是 ${k === 2 ? `$${answer}$` : `$${power(base, k - 1)} = ${answer}$`}。`,
                ],
              ],
            ],
            [
              `Multiplying the series by $${center}$, the terms in $z^{-${k - 1}}$ are $${answer}$ from $z$ times the term found and $${shift(-s)} \\cdot ${shift(previous)}$ from the term before; $${answer} + ${shift(-s * previous)} = 0$, so they cancel, as they must for the product to be 1.`,
              `把级数乘以 $${center}$，$z^{-${k - 1}}$ 的项有：$z$ 乘所求项得 $${answer}$，前一项得 $${shift(-s)} \\cdot ${shift(previous)}$；$${answer} + ${shift(-s * previous)} = 0$，它们抵消，乘积才会是 1。`,
            ],
          );
        }),
    ),
  ],
);

const argumentPrinciple = topic(
  "the-argument-principle-and-rouches-theorem",
  ["The Argument Principle and Rouché's Theorem", "辐角原理和儒歇定理"],
  ["Count zeros and poles inside a contour without finding them.", "不求出零点和极点，就数出围道内它们的个数。"],
  ["the-residue-theorem", "winding-numbers", "zeros-of-analytic-functions"],
  [],
  [
    point(
      "counting-with-the-argument-principle",
      ["Counting with the argument principle", "用辐角原理计数"],
      [
        "The integral of $f' / f$ around a closed contour, divided by $2 \\pi i$, equals the number of zeros inside minus the number of poles inside, each counted with multiplicity. Equivalently, the image of the contour under $f$ winds around the origin exactly that number of times. For $f(z) = \\frac{(z - 1)^3 (z - 6)}{z^2}$ on $|z| = 3$: the zero at 1 counts 3, the pole at 0 counts 2, and the zero at 6 is outside, so the value is $3 - 2 = 1$.\n\nCheck: termwise, $\\frac{f'}{f} = \\frac{3}{z - 1} + \\frac{1}{z - 6} - \\frac{2}{z}$, and around the circle these give $3 + 0 - 2 = 1$.\n\n> **Watch out.** Count each zero and pole with its multiplicity, and leave out those outside the contour. Poles are subtracted, not added.",
        "$f' / f$ 沿闭围道的积分除以 $2 \\pi i$，等于围道内的零点数减极点数，都按重数计算。等价地说，围道在 $f$ 下的像绕原点恰好转这么多圈。对 $|z| = 3$ 上的 $f(z) = \\frac{(z - 1)^3 (z - 6)}{z^2}$：1 处的零点计 3，0 处的极点计 2，6 处的零点在圆外，所以值是 $3 - 2 = 1$。\n\n检验：逐项看，$\\frac{f'}{f} = \\frac{3}{z - 1} + \\frac{1}{z - 6} - \\frac{2}{z}$，沿圆周它们分别给出 $3 + 0 - 2 = 1$。\n\n> **注意。** 每个零点和极点都按重数计，圆外的不算。极点要减去，不是加上。",
      ],
      (rng) =>
        until(() => {
          const [m, n] = [rng.int(1, 5), rng.int(1, 5)];
          const a = rng.int(1, 3);
          const b = rng.int(5, 8);
          const r = rng.int(a + 1, 4);
          const outsideOrder = rng.int(1, 3);
          const answer = m - n;
          const f = `\\frac{${power(`(z - ${a})`, m)} ${power(`(z - ${b})`, outsideOrder)}}{${power("z", n)}}`;
          const misses: Miss[] = [
            [m + n, "That adds the poles; they count with a minus sign.", "那把极点加上了；极点要带负号计算。"],
            [
              m + outsideOrder - n,
              `That counts the zero at ${b} too, which lies outside $|z| = ${r}$.`,
              `那把 ${b} 处的零点也算上了，它在 $|z| = ${r}$ 之外。`,
            ],
            [n - m, "That subtracts the wrong way: zeros minus poles.", "那减反了：应该是零点数减极点数。"],
            [m, "That leaves out the pole at 0.", "那漏掉了 0 处的极点。"],
          ];
          return worked(
            [
              `Let $f(z) = ${f}$. What is $\\frac{1}{2 \\pi i} \\oint_{|z| = ${r}} \\frac{f'(z)}{f(z)} \\, dz$?`,
              `设 $f(z) = ${f}$。$\\frac{1}{2 \\pi i} \\oint_{|z| = ${r}} \\frac{f'(z)}{f(z)} \\, dz$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Zeros inside", "圆内的零点"],
                [
                  `Inside $|z| = ${r}$, $f$ has a zero of order ${m} at ${a}; the zero at ${b} is outside.`,
                  `在 $|z| = ${r}$ 内，$f$ 在 ${a} 处有 ${m} 阶零点；${b} 处的零点在圆外。`,
                ],
              ],
              [
                ["Poles inside", "圆内的极点"],
                [`$f$ has a pole of order ${n} at 0.`, `$f$ 在 0 处有 ${n} 阶极点。`],
              ],
              [
                ["Subtract", "相减"],
                [`$${m} - ${n} = ${answer}$.`, `$${m} - ${n} = ${answer}$。`],
              ],
            ],
            [
              `Termwise, $\\frac{f'}{f} = \\frac{${m}}{z - ${a}} + \\frac{${outsideOrder}}{z - ${b}} - \\frac{${n}}{z}$; around the circle the three terms give ${m}, 0 and $-${n}$, which add to $${answer}$.`,
              `逐项看，$\\frac{f'}{f} = \\frac{${m}}{z - ${a}} + \\frac{${outsideOrder}}{z - ${b}} - \\frac{${n}}{z}$；沿圆周三项分别给出 ${m}、0 和 $-${n}$，和为 $${answer}$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "counting-with-rouches-theorem",
        ["Counting with Rouché's theorem", "用儒歇定理计数"],
        [
          "Rouché's theorem says that if $|g| < |f|$ everywhere on a contour, then $f$ and $f + g$ have the same number of zeros inside. To use it, pick the term of a polynomial that dominates on the circle and count the zeros of that term alone, which is usually very easy. For $z^5 + 4z^2 + 1$ on $|z| = 1$: $|4z^2| = 4$, while $|z^5 + 1| \\le 2$, so there are as many zeros in $|z| < 1$ as $4z^2$ has, namely 2.\n\nCheck: $z^5 + 4z^2 + 1 = 4z^2 (1 + h)$ with $|h| \\le \\frac{1}{2}$ on the circle, so the bracket never winds around 0 and the polynomial winds twice, like $4z^2$.\n\n> **Watch out.** The dominant term must be strictly larger at every point of the circle, and which term dominates depends on the radius: on $|z| = 2$ the term $z^5$ wins instead.",
          "儒歇定理说：如果在围道上处处有 $|g| < |f|$，那么 $f$ 和 $f + g$ 在围道内的零点数相同。使用时，选出多项式中在圆周上占优的那一项，只数它的零点，这通常很容易。对 $|z| = 1$ 上的 $z^5 + 4z^2 + 1$：$|4z^2| = 4$，而 $|z^5 + 1| \\le 2$，所以它在 $|z| < 1$ 内的零点数与 $4z^2$ 相同，是 2 个。\n\n检验：$z^5 + 4z^2 + 1 = 4z^2 (1 + h)$，在圆周上 $|h| \\le \\frac{1}{2}$，所以括号不绕 0，多项式像 $4z^2$ 一样绕两圈。\n\n> **注意。** 占优项必须在圆周上每一点都严格更大，而哪一项占优取决于半径：在 $|z| = 2$ 上占优的是 $z^5$。",
        ],
        (rng) =>
          until(() => {
            const low = rng.pick([1, 2, 3]);
            const high = low + rng.int(2, 5);
            const big = rng.bool();
            const a = rng.int(1, 2);
            const coefficient = 3 * rng.int(5, 9);
            const r = big ? 2 : 1;
            const dominant = big ? high : low;
            const lowTerm = power("z", low);
            const highTerm = power("z", high);
            const poly = big ? `${highTerm} + ${a === 1 ? "" : `${a} `}${lowTerm} + 1` : `${highTerm} + ${coefficient} ${lowTerm} + 1`;
            const others = a === 1 ? `${power("2", low)} + 1` : `2 \\cdot ${power("2", low)} + 1`;
            const rest = a * 2 ** low + 1;
            const top = 2 ** high;
            const misses: Miss[] = big
              ? [
                  [
                    low,
                    `That picks the term $${lowTerm}$, but on $|z| = 2$ the top power $${highTerm}$ is the largest.`,
                    `那选了 $${lowTerm}$ 这一项，但在 $|z| = 2$ 上最大的是最高次项 $${highTerm}$。`,
                  ],
                  [
                    0,
                    "That compares with the constant 1, which is not the largest term on the circle.",
                    "那拿常数 1 作比较，而它不是圆周上最大的项。",
                  ],
                  [
                    high + low,
                    "That adds the degrees of two terms; only the dominant term's zeros count.",
                    "那把两项的次数相加；只有占优项的零点个数才算数。",
                  ],
                ]
              : [
                  [
                    high,
                    `That counts every zero of the polynomial; on $|z| = 1$ the term $${coefficient} ${lowTerm}$ dominates, so only ${low} ${low === 1 ? "lies" : "lie"} inside.`,
                    `那数了多项式的全部零点；在 $|z| = 1$ 上占优的是 $${coefficient} ${lowTerm}$，所以圆内只有 ${low} 个。`,
                  ],
                  [
                    0,
                    "That compares with the constant 1, which is not the largest term on the circle.",
                    "那拿常数 1 作比较，而它不是圆周上最大的项。",
                  ],
                  [
                    high + low,
                    "That adds the degrees of two terms; only the dominant term's zeros count.",
                    "那把两项的次数相加；只有占优项的零点个数才算数。",
                  ],
                ];
            return worked(
              [
                `How many zeros, counted with multiplicity, does $${poly}$ have in the disc $|z| < ${r}$?`,
                `$${poly}$ 在圆盘 $|z| < ${r}$ 内有多少个零点（按重数计）？`,
              ],
              dominant,
              misses,
              big
                ? [
                    [
                      ["Sizes on the circle", "圆周上的大小"],
                      [
                        `On $|z| = 2$, $|${highTerm}| = 2^{${high}} = ${top}$, while the other terms have size at most $${others} = ${rest}$.`,
                        `在 $|z| = 2$ 上，$|${highTerm}| = 2^{${high}} = ${top}$，而其他项的模之和至多为 $${others} = ${rest}$。`,
                      ],
                    ],
                    [
                      ["Compare", "比较"],
                      [`$${top} > ${rest}$, so $${highTerm}$ dominates.`, `$${top} > ${rest}$，所以 $${highTerm}$ 占优。`],
                    ],
                    [
                      ["Count", "计数"],
                      [
                        `$${highTerm}$ has ${high} zeros in the disc, all at 0, so the polynomial has ${high}.`,
                        `$${highTerm}$ 在圆盘内有 ${high} 个零点，都在 0 处，所以多项式有 ${high} 个。`,
                      ],
                    ],
                  ]
                : [
                    [
                      ["Sizes on the circle", "圆周上的大小"],
                      [
                        `On $|z| = 1$, $|${coefficient} ${lowTerm}| = ${coefficient}$, while the other terms have size at most $1 + 1 = 2$.`,
                        `在 $|z| = 1$ 上，$|${coefficient} ${lowTerm}| = ${coefficient}$，而其他项的模之和至多为 $1 + 1 = 2$。`,
                      ],
                    ],
                    [
                      ["Compare", "比较"],
                      [
                        `$${coefficient} > 2$, so $${coefficient} ${lowTerm}$ dominates.`,
                        `$${coefficient} > 2$，所以 $${coefficient} ${lowTerm}$ 占优。`,
                      ],
                    ],
                    [
                      ["Count", "计数"],
                      [
                        `$${coefficient} ${lowTerm}$ has ${low} zero${low === 1 ? "" : "s"} in the disc, all at 0, so the polynomial has ${low}.`,
                        `$${coefficient} ${lowTerm}$ 在圆盘内有 ${low} 个零点，都在 0 处，所以多项式有 ${low} 个。`,
                      ],
                    ],
                  ],
              big
                ? [
                    `Write the polynomial as $${highTerm} (1 + h)$ with $|h| \\le ${Q.of(rest, top).toLatex()} < 1$ on the circle. The bracket never winds around 0, so the polynomial winds ${high} times, like $${highTerm}$.`,
                    `把多项式写成 $${highTerm} (1 + h)$，在圆周上 $|h| \\le ${Q.of(rest, top).toLatex()} < 1$。括号不绕 0，所以多项式像 $${highTerm}$ 一样绕 ${high} 圈。`,
                  ]
                : [
                    `Write the polynomial as $${coefficient} ${lowTerm} (1 + h)$ with $|h| \\le ${Q.of(2, coefficient).toLatex()} < 1$ on the circle. The bracket never winds around 0, so the polynomial winds ${low} time${low === 1 ? "" : "s"}, like $${lowTerm}$.`,
                    `把多项式写成 $${coefficient} ${lowTerm} (1 + h)$，在圆周上 $|h| \\le ${Q.of(2, coefficient).toLatex()} < 1$。括号不绕 0，所以多项式像 $${lowTerm}$ 一样绕 ${low} 圈。`,
                  ],
            );
          }),
      ),
      figure: complexDrawings1["the-argument-principle-and-rouches-theorem#counting-with-rouches-theorem"],
    },
  ],
);

const trigIntegrals = topic(
  "trigonometric-integrals-by-residues",
  ["Trigonometric Integrals by Residues", "用留数求三角积分"],
  ["Turn an integral over a period into a contour integral around the unit circle.", "把一个周期上的积分变为单位圆上的围道积分。"],
  ["the-residue-theorem"],
  [],
  [
    {
      ...point(
        "substituting-on-the-unit-circle",
        ["Substituting on the unit circle", "在单位圆上代换"],
        [
          "Put $z = e^{i \\theta}$. Then $d\\theta = \\frac{dz}{iz}$, $\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$ and $\\sin \\theta = \\frac{1}{2i} (z - \\frac{1}{z})$, and an integral from 0 to $2 \\pi$ becomes an integral around $|z| = 1$. A rational function of cosine and sine thus becomes a rational function of $z$. In the drawing, $z$ and $\\frac{1}{z}$ are mirror images in the real axis, and their average is the point $\\cos \\theta$ on it. So $5 + 4 \\cos \\theta$ becomes $5 + 2z + \\frac{2}{z}$.\n\nCheck: at $\\theta = \\pi$, $z = -1$: the original is $5 - 4 = 1$, and the new form gives $5 - 2 - 2 = 1$.\n\n> **Watch out.** Sine has a minus sign and a factor $\\frac{1}{2i}$: $\\sin \\theta = \\frac{1}{2i} (z - \\frac{1}{z})$. Do not forget $d\\theta = \\frac{dz}{iz}$.",
          "令 $z = e^{i \\theta}$。于是 $d\\theta = \\frac{dz}{iz}$，$\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$，$\\sin \\theta = \\frac{1}{2i} (z - \\frac{1}{z})$，从 0 到 $2 \\pi$ 的积分就变成沿 $|z| = 1$ 的积分。余弦和正弦的有理函数于是变成 $z$ 的有理函数。图中 $z$ 和 $\\frac{1}{z}$ 关于实轴对称，它们的平均值就是实轴上的点 $\\cos \\theta$。所以 $5 + 4 \\cos \\theta$ 变成 $5 + 2z + \\frac{2}{z}$。\n\n检验：在 $\\theta = \\pi$ 处 $z = -1$：原式是 $5 - 4 = 1$，新式给出 $5 - 2 - 2 = 1$。\n\n> **注意。** 正弦带负号和因子 $\\frac{1}{2i}$：$\\sin \\theta = \\frac{1}{2i} (z - \\frac{1}{z})$。别忘了 $d\\theta = \\frac{dz}{iz}$。",
        ],
        (rng) => {
          const a = rng.int(2, 12);
          const b = rng.int(1, 9) * 2;
          const half = b / 2;
          const bHalf = half === 1 ? "" : `${half} `;
          const correct = `${a} + ${bHalf}z + \\frac{${half}}{z}`;
          return chosen(
            rng,
            [
              `With $z = e^{i \\theta}$, what does $${a} + ${b} \\cos \\theta$ become?`,
              `令 $z = e^{i \\theta}$，$${a} + ${b} \\cos \\theta$ 变成什么？`,
            ],
            same(correct),
            [
              [
                same(`${a} + ${b} z + \\frac{${b}}{z}`),
                "That leaves out the factor $\\frac{1}{2}$ in $\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$.",
                "那漏掉了 $\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$ 中的因子 $\\frac{1}{2}$。",
              ],
              [
                same(`${a} + ${bHalf}z - \\frac{${half}}{z}`),
                "That uses the minus sign that belongs to sine; for cosine the two terms add.",
                "那用了属于正弦的负号；余弦的两项是相加的。",
              ],
              [
                same(`${a} + ${b} z`),
                "That drops the $\\frac{1}{z}$ part; $\\cos \\theta$ is the average of $z$ and $\\frac{1}{z}$, not $z$ itself.",
                "那漏掉了 $\\frac{1}{z}$ 部分；$\\cos \\theta$ 是 $z$ 和 $\\frac{1}{z}$ 的平均值，不是 $z$ 本身。",
              ],
            ],
            [
              [
                ["Replace the cosine", "代换余弦"],
                [
                  `$\\cos \\theta = \\frac{1}{2} \\left( z + \\frac{1}{z} \\right)$, so $${b} \\cos \\theta = ${bHalf}\\left( z + \\frac{1}{z} \\right)$.`,
                  `$\\cos \\theta = \\frac{1}{2} \\left( z + \\frac{1}{z} \\right)$，所以 $${b} \\cos \\theta = ${bHalf}\\left( z + \\frac{1}{z} \\right)$。`,
                ],
              ],
              [
                ["Expand", "展开"],
                [`$${a} + ${b} \\cos \\theta = ${correct}$.`, `$${a} + ${b} \\cos \\theta = ${correct}$。`],
              ],
            ],
            [
              `At $\\theta = 0$, $z = 1$: the original is $${a} + ${b} = ${a + b}$, and the new form gives $${a} + ${half} + ${half} = ${a + b}$.`,
              `在 $\\theta = 0$ 处 $z = 1$：原式是 $${a} + ${b} = ${a + b}$，新式给出 $${a} + ${half} + ${half} = ${a + b}$。`,
            ],
          );
        },
      ),
      figure: complexDrawings1["trigonometric-integrals-by-residues#substituting-on-the-unit-circle"],
    },
    {
      ...point(
        "the-classic-period-integral",
        ["The classic period integral", "经典的周期积分"],
        [
          "For $a > |b|$, the substitution and one residue give $\\int_0^{2\\pi} \\frac{d\\theta}{a + b \\cos \\theta} = \\frac{2\\pi}{\\sqrt{a^2 - b^2}}$. Only the pole inside the unit circle counts. The result has a simple check: when $b = 0$ the integrand is the constant $1 / a$, and the formula gives $2 \\pi / a$. For $a = 5$, $b = 4$: $\\frac{2\\pi}{\\sqrt{25 - 16}} = \\frac{2\\pi}{3}$.\n\nCheck: with $z = e^{i\\theta}$ the integral becomes $\\oint \\frac{dz}{i(2z + 1)(z + 2)}$. Only $-\\frac{1}{2}$ is inside, with residue $\\frac{1}{3i}$, and $2\\pi i \\cdot \\frac{1}{3i} = \\frac{2\\pi}{3}$.\n\n> **Watch out.** The other root of the quadratic, here $-2$, lies outside the unit circle and does not count. The denominator is $\\sqrt{a^2 - b^2}$, not $a - b$.",
          "当 $a > |b|$ 时，代换加一个留数给出 $\\int_0^{2\\pi} \\frac{d\\theta}{a + b \\cos \\theta} = \\frac{2\\pi}{\\sqrt{a^2 - b^2}}$。只有单位圆内的极点起作用。结果可以简单检验：$b = 0$ 时被积函数是常数 $1 / a$，公式给出 $2 \\pi / a$。对 $a = 5$，$b = 4$：$\\frac{2\\pi}{\\sqrt{25 - 16}} = \\frac{2\\pi}{3}$。\n\n检验：令 $z = e^{i\\theta}$，积分变成 $\\oint \\frac{dz}{i(2z + 1)(z + 2)}$。只有 $-\\frac{1}{2}$ 在圆内，留数是 $\\frac{1}{3i}$，而 $2\\pi i \\cdot \\frac{1}{3i} = \\frac{2\\pi}{3}$。\n\n> **注意。** 二次式的另一个根（这里是 $-2$）在单位圆外，不算。分母是 $\\sqrt{a^2 - b^2}$，不是 $a - b$。",
        ],
        (rng) =>
          until(() => {
            const [p, q, r] = rng.pick([
              [5, 3, 4],
              [5, 4, 3],
              [13, 5, 12],
              [13, 12, 5],
              [17, 8, 15],
              [17, 15, 8],
              [10, 6, 8],
              [10, 8, 6],
              [25, 7, 24],
              [25, 24, 7],
            ] as const);
            const m = rng.int(1, 9);
            const answer = Q.of(2 * m, r);
            const top = m === 1 ? "d\\theta" : `${m} \\, d\\theta`;
            const inner = Q.of(r - p, q);
            const outer = Q.of(-p - r, q);
            const misses: Miss[] = [
              [Q.of(m, r), "That forgets the 2 of $2 \\pi$.", "那漏掉了 $2 \\pi$ 中的 2。"],
              [Q.of(2 * m, p), "That drops the cosine term, as if $b$ were 0.", "那丢掉了余弦项，好像 $b$ 是 0。"],
              [
                Q.of(2 * m, p + q),
                `That uses $a + b = ${p + q}$ in place of $\\sqrt{a^2 - b^2}$.`,
                `那用 $a + b = ${p + q}$ 代替了 $\\sqrt{a^2 - b^2}$。`,
              ],
              [
                Q.of(2 * m, p - q),
                `That uses $a - b = ${p - q}$ in place of $\\sqrt{a^2 - b^2}$.`,
                `那用 $a - b = ${p - q}$ 代替了 $\\sqrt{a^2 - b^2}$。`,
              ],
            ];
            return worked(
              [
                `The integral $\\int_0^{2\\pi} \\frac{${top}}{${p} + ${q} \\cos \\theta}$ equals $k \\pi$. What is $k$?`,
                `积分 $\\int_0^{2\\pi} \\frac{${top}}{${p} + ${q} \\cos \\theta}$ 等于 $k \\pi$。$k$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Check the condition", "检查条件"],
                  [`$a = ${p} > ${q} = b$, so the formula applies.`, `$a = ${p} > ${q} = b$，所以公式适用。`],
                ],
                [
                  ["Take the root", "开方"],
                  [
                    `$\\sqrt{${p}^2 - ${q}^2} = \\sqrt{${p * p - q * q}} = ${r}$.`,
                    `$\\sqrt{${p}^2 - ${q}^2} = \\sqrt{${p * p - q * q}} = ${r}$。`,
                  ],
                ],
                [
                  ["Apply the formula", "代入公式"],
                  [
                    `The integral is $${m === 1 ? "" : `${m} \\cdot `}\\frac{2 \\pi}{${r}} = ${piTimes(answer)}$, so $k = ${answer.toLatex()}$.`,
                    `积分是 $${m === 1 ? "" : `${m} \\cdot `}\\frac{2 \\pi}{${r}} = ${piTimes(answer)}$，所以 $k = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `By residues: with $z = e^{i \\theta}$, $\\int_0^{2\\pi} \\frac{d\\theta}{${p} + ${q} \\cos \\theta} = \\oint \\frac{2 \\, dz}{i(${q} z^2 + ${2 * p} z + ${q})}$. The roots are $${inner.toLatex()}$, inside, and $${outer.toLatex()}$, outside. At the inner root the residue is $\\frac{2}{i(${2 * q} z + ${2 * p})} = \\frac{2}{${2 * r} i} = \\frac{1}{${r}i}$, so $2 \\pi i \\cdot \\frac{1}{${r}i} = \\frac{2 \\pi}{${r}}$, as the formula says.`,
                `用留数：令 $z = e^{i \\theta}$，$\\int_0^{2\\pi} \\frac{d\\theta}{${p} + ${q} \\cos \\theta} = \\oint \\frac{2 \\, dz}{i(${q} z^2 + ${2 * p} z + ${q})}$。根是圆内的 $${inner.toLatex()}$ 和圆外的 $${outer.toLatex()}$。在圆内的根处留数是 $\\frac{2}{i(${2 * q} z + ${2 * p})} = \\frac{2}{${2 * r} i} = \\frac{1}{${r}i}$，所以 $2 \\pi i \\cdot \\frac{1}{${r}i} = \\frac{2 \\pi}{${r}}$，与公式一致。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["trigonometric-integrals-by-residues#the-classic-period-integral"],
    },
  ],
);

const improper = topic(
  "improper-integrals-by-residues",
  ["Improper Integrals by Residues", "用留数求反常积分"],
  ["Close the contour in the half-plane where the integrand dies away.", "在被积函数衰减的半平面内闭合围道。"],
  ["the-residue-theorem", "the-ml-inequality"],
  [],
  [
    {
      ...point(
        "poles-in-the-upper-half-plane",
        ["Poles in the upper half-plane", "上半平面的极点"],
        [
          "To integrate a rational function over the real line, close the path with a large semicircle above the axis. The arc contributes nothing when the denominator has degree at least two more than the numerator, and so the integral is $2 \\pi i$ times the residues at the poles in the upper half-plane only. For $\\int_{-\\infty}^{\\infty} \\frac{dx}{x^4 + 1}$ the poles above the axis are $e^{i\\pi/4}$ and $e^{3i\\pi/4}$. The residue of $\\frac{1}{z^4 + 1}$ at a pole $z_0$ is $\\frac{1}{4z_0^3} = -\\frac{z_0}{4}$, and the two add to $-\\frac{i \\sqrt{2}}{4}$, so the integral is $2\\pi i \\cdot \\left( -\\frac{i\\sqrt{2}}{4} \\right) = \\frac{\\pi \\sqrt{2}}{2}$.\n\nCheck: the integrand is at most 1, and at most $\\frac{1}{x^4}$ for $|x| > 1$, so the integral is less than $2 \\left( 1 + \\frac{1}{3} \\right) = \\frac{8}{3} \\approx 2.67$; and $\\frac{\\pi\\sqrt{2}}{2} \\approx 2.22$ fits.\n\n> **Watch out.** Leave out the poles below the axis. The arc vanishes only when the denominator's degree exceeds the numerator's by at least two.",
          "要在实轴上积分有理函数，就用上方的大半圆闭合路径。分母次数比分子至少高二时，圆弧的贡献为零，所以积分等于 $2 \\pi i$ 乘上半平面内极点的留数之和，只算这些极点。对 $\\int_{-\\infty}^{\\infty} \\frac{dx}{x^4 + 1}$，实轴上方的极点是 $e^{i\\pi/4}$ 和 $e^{3i\\pi/4}$。$\\frac{1}{z^4 + 1}$ 在极点 $z_0$ 处的留数是 $\\frac{1}{4z_0^3} = -\\frac{z_0}{4}$，两者之和是 $-\\frac{i \\sqrt{2}}{4}$，所以积分是 $2\\pi i \\cdot \\left( -\\frac{i\\sqrt{2}}{4} \\right) = \\frac{\\pi \\sqrt{2}}{2}$。\n\n检验：被积函数至多为 1，在 $|x| > 1$ 时至多为 $\\frac{1}{x^4}$，所以积分小于 $2 \\left( 1 + \\frac{1}{3} \\right) = \\frac{8}{3} \\approx 2.67$；而 $\\frac{\\pi\\sqrt{2}}{2} \\approx 2.22$ 符合。\n\n> **注意。** 实轴下方的极点不算。只有分母次数比分子至少高二时，圆弧的贡献才趋于零。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(1, 9);
            const m = rng.int(1, 9);
            const answer = Q.of(m, a);
            const pole = imaginaryName(a);
            const misses: Miss[] = [
              [
                Q.of(2 * m, a),
                `That takes the residue as $\\frac{${m}}{${pole}}$, forgetting the 2 from the derivative $2z$.`,
                `那把留数当成了 $\\frac{${m}}{${pole}}$，漏掉了导数 $2z$ 中的 2。`,
              ],
              [
                Q.of(m, a * a),
                `That uses $${a * a}$ in place of ${a}; the pole is at $\\sqrt{${a * a}} \\, i = ${pole}$.`,
                `那用 $${a * a}$ 代替了 ${a}；极点在 $\\sqrt{${a * a}} \\, i = ${pole}$。`,
              ],
              [Q.of(m, 2 * a), "That leaves out the factor 2 of $2 \\pi i$.", "那漏掉了 $2 \\pi i$ 中的 2。"],
            ];
            const arctan = a === 1 ? "\\arctan x" : `\\arctan \\frac{x}{${a}}`;
            return worked(
              [
                `The integral $\\int_{-\\infty}^{\\infty} \\frac{${m}}{x^2 + ${a * a}} \\, dx$ equals $k \\pi$. What is $k$?`,
                `积分 $\\int_{-\\infty}^{\\infty} \\frac{${m}}{x^2 + ${a * a}} \\, dx$ 等于 $k \\pi$。$k$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Find the poles above the axis", "找上半平面的极点"],
                  [
                    `$z^2 + ${a * a} = 0$ at $\\pm ${pole}$; only $${pole}$ is above the axis.`,
                    `$z^2 + ${a * a} = 0$ 的根是 $\\pm ${pole}$；只有 $${pole}$ 在实轴上方。`,
                  ],
                ],
                [
                  ["Find the residue", "求留数"],
                  [
                    `At $${pole}$ the residue is $\\frac{${m}}{2 \\cdot ${pole}} = \\frac{${m}}{${2 * a}i}$.`,
                    `在 $${pole}$ 处留数是 $\\frac{${m}}{2 \\cdot ${pole}} = \\frac{${m}}{${2 * a}i}$。`,
                  ],
                ],
                [
                  ["Multiply by 2πi", "乘 2πi"],
                  [
                    `$2 \\pi i \\cdot \\frac{${m}}{${2 * a}i} = ${piTimes(answer)}$, so $k = ${answer.toLatex()}$.`,
                    `$2 \\pi i \\cdot \\frac{${m}}{${2 * a}i} = ${piTimes(answer)}$，所以 $k = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `An antiderivative is $${lead(answer)}${arctan}$, which rises by $${lead(answer)}\\left( \\frac{\\pi}{2} + \\frac{\\pi}{2} \\right) = ${piTimes(answer)}$ from $-\\infty$ to $\\infty$.`,
                `一个原函数是 $${lead(answer)}${arctan}$，它从 $-\\infty$ 到 $\\infty$ 增加 $${lead(answer)}\\left( \\frac{\\pi}{2} + \\frac{\\pi}{2} \\right) = ${piTimes(answer)}$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["improper-integrals-by-residues#poles-in-the-upper-half-plane"],
    },
    {
      ...point(
        "an-integral-with-a-cosine",
        ["An integral with a cosine", "含余弦的积分"],
        [
          "For an integrand with $\\cos kx$, use $e^{ikz}$ instead and take the real part at the end, because cosine itself grows off the real axis. With $k > 0$, $e^{ikz}$ decays in the upper half-plane, so by Jordan's lemma the arc vanishes and the upper half-plane is the right place to close. As the drawing shows, $|e^{ikz}| = e^{-ky}$ is small above the axis. For $\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{x^2 + 1} \\, dx$: the residue of $\\frac{e^{iz}}{z^2 + 1}$ at $i$ is $\\frac{e^{-1}}{2i}$, so the integral is $2\\pi i \\cdot \\frac{e^{-1}}{2i} = \\frac{\\pi}{e}$.\n\nCheck: the sine part is 0 because $\\frac{\\sin x}{x^2 + 1}$ is odd, so a real answer is right; and $\\frac{\\pi}{e}$ is below $\\pi$, the integral of $\\frac{1}{x^2 + 1}$, as $|\\cos x| \\le 1$ requires.\n\n> **Watch out.** At the pole $ai$, $e^{ikz} = e^{-ka}$, a small number, not $e^{ka}$. Using $\\cos z$ directly fails, since it grows like $e^{|y|}$ on both sides.",
          "被积函数含 $\\cos kx$ 时，要改用 $e^{ikz}$，最后取实部，因为余弦本身离开实轴后会增长。当 $k > 0$ 时，$e^{ikz}$ 在上半平面衰减，由若尔当引理圆弧的贡献为零，所以应在上半平面闭合。如图所示，$|e^{ikz}| = e^{-ky}$ 在实轴上方很小。对 $\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{x^2 + 1} \\, dx$：$\\frac{e^{iz}}{z^2 + 1}$ 在 $i$ 处的留数是 $\\frac{e^{-1}}{2i}$，所以积分是 $2\\pi i \\cdot \\frac{e^{-1}}{2i} = \\frac{\\pi}{e}$。\n\n检验：$\\frac{\\sin x}{x^2 + 1}$ 是奇函数，正弦部分为 0，所以答案是实数是对的；而 $\\frac{\\pi}{e}$ 小于 $\\frac{1}{x^2 + 1}$ 的积分 $\\pi$，符合 $|\\cos x| \\le 1$。\n\n> **注意。** 在极点 $ai$ 处，$e^{ikz} = e^{-ka}$，是个小数，不是 $e^{ka}$。直接用 $\\cos z$ 行不通，因为它在实轴两侧都像 $e^{|y|}$ 那样增长。",
        ],
        (rng) => {
          const a = rng.int(1, 6);
          const k = rng.int(1, 6);
          const decay = power("e", -k * a);
          const correct = `${piOver(a)} ${decay}`;
          const frequency = k === 1 ? "x" : `${k}x`;
          const ki = k === 1 ? "i" : `${k}i`;
          const pole = imaginaryName(a);
          const size = k === 1 ? "e^{-y}" : `e^{-${k}y}`;
          return chosen(
            rng,
            [
              `What is $\\int_{-\\infty}^{\\infty} \\frac{\\cos ${frequency}}{x^2 + ${a * a}} \\, dx$?`,
              `$\\int_{-\\infty}^{\\infty} \\frac{\\cos ${frequency}}{x^2 + ${a * a}} \\, dx$ 是多少？`,
            ],
            same(correct),
            [
              [
                same(`${piOver(a)} ${power("e", k * a)}`),
                `That gets the sign of the exponent wrong: at $z = ${pole}$, $e^{${ki} z} = ${decay}$, which is small.`,
                `那弄错了指数的符号：在 $z = ${pole}$ 处，$e^{${ki} z} = ${decay}$，这是个小数。`,
              ],
              [
                same(piOver(a)),
                "That leaves out the value of the exponential at the pole, as if the frequency were 0.",
                "那漏掉了指数函数在极点处的值，好像频率是 0。",
              ],
              [
                same(`${a === 1 ? "2 \\pi" : `\\frac{2 \\pi}{${a}}`} ${decay}`),
                "That forgets the 2 from the derivative $2z$ in the residue.",
                "那漏掉了留数中导数 $2z$ 带来的 2。",
              ],
              [same(`\\frac{\\pi}{${2 * a}} ${decay}`), "That leaves out the factor 2 of $2 \\pi i$.", "那漏掉了 $2 \\pi i$ 中的 2。"],
            ],
            [
              [
                ["Use the exponential", "改用指数"],
                [
                  `Integrate $\\frac{e^{${ki} z}}{z^2 + ${a * a}}$ and take the real part. Since $|e^{${ki} z}| = ${size}$, close in the upper half-plane.`,
                  `积分 $\\frac{e^{${ki} z}}{z^2 + ${a * a}}$ 再取实部。因为 $|e^{${ki} z}| = ${size}$，在上半平面闭合。`,
                ],
              ],
              [
                ["Find the residue", "求留数"],
                [
                  `The only pole above the axis is $${pole}$, where the residue is $\\frac{${decay}}{${2 * a}i}$.`,
                  `实轴上方唯一的极点是 $${pole}$，那里的留数是 $\\frac{${decay}}{${2 * a}i}$。`,
                ],
              ],
              [
                ["Multiply by 2πi", "乘 2πi"],
                [
                  `$2 \\pi i \\cdot \\frac{${decay}}{${2 * a}i} = ${correct}$. This is real, so it is the value of the cosine integral.`,
                  `$2 \\pi i \\cdot \\frac{${decay}}{${2 * a}i} = ${correct}$。它是实数，所以就是余弦积分的值。`,
                ],
              ],
            ],
            [
              `The sine part $\\int \\frac{\\sin ${frequency}}{x^2 + ${a * a}} \\, dx$ is 0 because its integrand is odd, so a real answer is right; and the value is below $${piOver(a)}$, the integral of $\\frac{1}{x^2 + ${a * a}}$, as $|\\cos| \\le 1$ requires.`,
              `正弦部分 $\\int \\frac{\\sin ${frequency}}{x^2 + ${a * a}} \\, dx$ 的被积函数是奇函数，积分为 0，所以答案是实数是对的；而这个值小于 $\\frac{1}{x^2 + ${a * a}}$ 的积分 $${piOver(a)}$，符合 $|\\cos| \\le 1$。`,
            ],
          );
        },
      ),
      figure: complexDrawings2["improper-integrals-by-residues#an-integral-with-a-cosine"],
    },
  ],
);

const crossRatio = topic(
  "the-cross-ratio",
  ["The Cross Ratio", "交比"],
  ["Use the one quantity that every Möbius transformation preserves.", "利用每个默比乌斯变换都保持不变的量。"],
  ["mobius-transformations"],
  [],
  [
    point(
      "computing-a-cross-ratio",
      ["Computing a cross ratio", "计算交比"],
      [
        "The cross ratio of four points is $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$. Every Möbius transformation keeps it unchanged, even though it moves all four points. So three points and their images determine the transformation completely, and any fourth point follows. For example, $(0, 1; 2, 3) = \\frac{(0 - 2)(1 - 3)}{(0 - 3)(1 - 2)} = \\frac{4}{3}$.\n\nCheck: swapping the middle two points gives $(0, 2; 1, 3) = \\frac{(0 - 1)(2 - 3)}{(0 - 3)(2 - 1)} = -\\frac{1}{3}$, and the two must add to 1: $\\frac{4}{3} - \\frac{1}{3} = 1$.\n\n> **Watch out.** The order matters: swapping $z_3$ and $z_4$ turns the cross ratio into its reciprocal. Take care with differences involving negative points.",
        "四个点的交比是 $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$。每个默比乌斯变换都使它不变，尽管四个点都移动了。所以三个点及其像完全决定了变换，第四点也就确定了。例如 $(0, 1; 2, 3) = \\frac{(0 - 2)(1 - 3)}{(0 - 3)(1 - 2)} = \\frac{4}{3}$。\n\n检验：交换中间两点得 $(0, 2; 1, 3) = \\frac{(0 - 1)(2 - 3)}{(0 - 3)(2 - 1)} = -\\frac{1}{3}$，两者之和必须是 1：$\\frac{4}{3} - \\frac{1}{3} = 1$。\n\n> **注意。** 顺序很重要：交换 $z_3$ 和 $z_4$ 会把交比变成它的倒数。涉及负数点的差要小心。",
      ],
      (rng) =>
        until(() => {
          const points = rng.sample([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7], 4) as [number, number, number, number];
          const [a, b, c, d] = points;
          const answer = Q.of((a - c) * (b - d), (a - d) * (b - c));
          const swapped = Q.of((a - b) * (c - d), (a - d) * (c - b));
          const misses: Miss[] = [
            [
              Q.of((a - d) * (b - c), (a - c) * (b - d)),
              "That swaps $z_3$ and $z_4$, which gives the reciprocal.",
              "那交换了 $z_3$ 和 $z_4$，得到的是倒数。",
            ],
            [
              Q.of((a - b) * (c - d), (a - d) * (b - c)),
              "That pairs $z_1$ with $z_2$ on top instead of with $z_3$.",
              "那在分子上把 $z_1$ 和 $z_2$ 配对，而不是和 $z_3$ 配对。",
            ],
            [answer.neg(), "That gets the sign of one difference wrong.", "那弄错了某个差的符号。"],
          ];
          return worked(
            [`What is the cross ratio $(${a}, ${b}; ${c}, ${d})$?`, `交比 $(${a}, ${b}; ${c}, ${d})$ 是多少？`],
            answer,
            misses,
            [
              [
                ["The numerator", "分子"],
                [
                  `$(${a} - ${shift(c)})(${b} - ${shift(d)}) = ${(a - c) * (b - d)}$.`,
                  `$(${a} - ${shift(c)})(${b} - ${shift(d)}) = ${(a - c) * (b - d)}$。`,
                ],
              ],
              [
                ["The denominator", "分母"],
                [
                  `$(${a} - ${shift(d)})(${b} - ${shift(c)}) = ${(a - d) * (b - c)}$.`,
                  `$(${a} - ${shift(d)})(${b} - ${shift(c)}) = ${(a - d) * (b - c)}$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [
                  `$${(a - c) * (b - d)} \\div ${shift((a - d) * (b - c))} = ${answer.toLatex()}$.`,
                  `$${(a - c) * (b - d)} \\div ${shift((a - d) * (b - c))} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Swapping the middle two points gives $(${a}, ${c}; ${b}, ${d}) = ${swapped.toLatex()}$, and the two cross ratios must add to 1: $${answer.toLatex()} + ${bracketQ(swapped)} = 1$.`,
              `交换中间两点得 $(${a}, ${c}; ${b}, ${d}) = ${swapped.toLatex()}$，两个交比之和必须是 1：$${answer.toLatex()} + ${bracketQ(swapped)} = 1$。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "what-a-mobius-map-does-to-circles",
        ["What a Möbius map does to circles", "默比乌斯变换如何作用于圆"],
        [
          "A Möbius transformation sends every line or circle to a line or circle. The image is a line exactly when the original passes through the pole of the transformation, because that point goes to infinity. For $w = 1 / z$, circles through the origin become lines and all other circles stay circles. In the drawing, $|z - 1| = 1$ passes through 0 and goes to the line $\\operatorname{Re} w = \\frac{1}{2}$, while $|z + 2| = 1$ misses 0 and goes to a circle through $\\frac{1}{-1} = -1$ and $\\frac{1}{-3} = -\\frac{1}{3}$.\n\nCheck: on $|z - 1| = 1$ the point 2 goes to $\\frac{1}{2}$, and $1 + i$ goes to $\\frac{1 - i}{2}$; both have real part $\\frac{1}{2}$.\n\n> **Watch out.** A line that misses 0 goes to a circle through 0. The image is never an ellipse or a parabola.",
          "默比乌斯变换把直线或圆映成直线或圆。当原来的直线或圆经过变换的极点时，像才是直线，因为那一点被映到无穷远。对 $w = 1 / z$，经过原点的圆变成直线，其他圆仍是圆。图中 $|z - 1| = 1$ 经过 0，被映成直线 $\\operatorname{Re} w = \\frac{1}{2}$；而 $|z + 2| = 1$ 不经过 0，被映成过 $\\frac{1}{-1} = -1$ 和 $\\frac{1}{-3} = -\\frac{1}{3}$ 的圆。\n\n检验：在 $|z - 1| = 1$ 上，点 2 映到 $\\frac{1}{2}$，$1 + i$ 映到 $\\frac{1 - i}{2}$；两者实部都是 $\\frac{1}{2}$。\n\n> **注意。** 不经过 0 的直线被映成经过 0 的圆。像永远不会是椭圆或抛物线。",
        ],
        (rng) => {
          const r = rng.int(1, 9);
          const through = rng.bool();
          const center = through ? r : r + rng.int(1, 5);
          const line: Pair = ["A line", "一条直线"];
          const circle: Pair = ["A circle", "一个圆"];
          const lines: Pair = ["A pair of lines", "两条直线"];
          const parabola: Pair = ["A parabola", "一条抛物线"];
          const near = through ? "" : Q.of(1, center - r).toLatex();
          const far = Q.of(1, center + r).toLatex();
          const half = Q.of(1, 2 * r).toLatex();
          return chosen(
            rng,
            [
              `Under $w = \\frac{1}{z}$, what is the image of the circle $|z - ${center}| = ${r}$?`,
              `在 $w = \\frac{1}{z}$ 下，圆 $|z - ${center}| = ${r}$ 的像是什么？`,
            ],
            through ? line : circle,
            [
              through
                ? [
                    circle,
                    "The circle passes through 0, which goes to infinity, so the image is unbounded: a line.",
                    "这个圆经过 0，而 0 被映到无穷远，所以像是无界的：一条直线。",
                  ]
                : [
                    line,
                    `That would need the circle to pass through 0; the distance from 0 to the center is ${center}, not the radius ${r}.`,
                    `那需要圆经过 0；0 到圆心的距离是 ${center}，不等于半径 ${r}。`,
                  ],
              [
                lines,
                "A Möbius map is one to one and sends one curve to one curve, a single line or circle.",
                "默比乌斯变换是一一的，把一条曲线映成一条曲线，即一条直线或一个圆。",
              ],
              [
                parabola,
                "Möbius maps send lines and circles only to lines and circles; a parabola never appears.",
                "默比乌斯变换只把直线和圆映成直线和圆；不会出现抛物线。",
              ],
            ],
            [
              [
                ["Test the pole", "检查极点"],
                [
                  through
                    ? `$|0 - ${center}| = ${r}$, so the circle passes through 0, the pole of $\\frac{1}{z}$.`
                    : `$|0 - ${center}| = ${center} \\ne ${r}$, so the circle misses 0, the pole of $\\frac{1}{z}$.`,
                  through
                    ? `$|0 - ${center}| = ${r}$，所以圆经过 $\\frac{1}{z}$ 的极点 0。`
                    : `$|0 - ${center}| = ${center} \\ne ${r}$，所以圆不经过 $\\frac{1}{z}$ 的极点 0。`,
                ],
              ],
              [
                ["Conclude", "得出结论"],
                [
                  through
                    ? "That point goes to infinity, so the image is a line."
                    : "No point goes to infinity, so the image is a bounded circle.",
                  through ? "这一点被映到无穷远，所以像是直线。" : "没有点被映到无穷远，所以像是有界的圆。",
                ],
              ],
            ],
            through
              ? [
                  `The points $${2 * r}$ and $${complexName(r, r)}$ lie on the circle; their images $${half}$ and $\\frac{1 - i}{${2 * r}}$ both have real part $${half}$, so the image is the line $\\operatorname{Re} w = ${half}$.`,
                  `点 $${2 * r}$ 和 $${complexName(r, r)}$ 在圆上；它们的像 $${half}$ 和 $\\frac{1 - i}{${2 * r}}$ 的实部都是 $${half}$，所以像是直线 $\\operatorname{Re} w = ${half}$。`,
                ]
              : [
                  `The points $${center - r}$ and $${center + r}$ on the circle go to $${near}$ and $${far}$, two finite points at the ends of a diameter of the image circle.`,
                  `圆上的点 $${center - r}$ 和 $${center + r}$ 映到 $${near}$ 和 $${far}$，这两个有限点是像圆一条直径的两端。`,
                ],
          );
        },
      ),
      figure: complexDrawings2["the-cross-ratio#what-a-mobius-map-does-to-circles"],
    },
  ],
);

const regionMaps = topic(
  "conformal-maps-of-regions",
  ["Conformal Maps of Regions", "区域的共形映射"],
  ["Open up wedges and strips with powers and exponentials.", "用幂函数和指数函数把楔形和带形展开。"],
  ["conformal-maps", "the-complex-exponential-function"],
  [],
  [
    {
      ...point(
        "opening-a-wedge",
        ["Opening a wedge", "展开楔形"],
        [
          "The map $w = z^k$ multiplies every argument by $k$, so it opens a wedge with angle $\\theta$ at the origin into a wedge with angle $k \\theta$. To send a wedge onto the upper half-plane, whose angle is $\\pi$, choose $k = \\pi / \\theta$. Conformality fails only at the corner, where the derivative vanishes. In the drawing the wedge $0 < \\arg z < \\frac{\\pi}{3}$ is opened by $w = z^3$, since $3 \\cdot \\frac{\\pi}{3} = \\pi$.\n\nCheck: the edge point $z = e^{i\\pi/3}$ goes to $e^{i\\pi} = -1$, on the negative real axis, while $z = 1$ stays at 1, so the two edges land on the two halves of the real axis.\n\n> **Watch out.** Divide $\\pi$ by the angle, not the angle by $\\pi$. A wedge of angle $\\frac{2\\pi}{3}$ needs $k = \\frac{3}{2}$, which is not a whole number.",
          "映射 $w = z^k$ 把每个辐角乘 $k$，所以它把顶点在原点、角度为 $\\theta$ 的楔形展开成角度为 $k \\theta$ 的楔形。要把楔形映到角度为 $\\pi$ 的上半平面，取 $k = \\pi / \\theta$。共形性只在角点失效，那里导数为零。图中楔形 $0 < \\arg z < \\frac{\\pi}{3}$ 由 $w = z^3$ 展开，因为 $3 \\cdot \\frac{\\pi}{3} = \\pi$。\n\n检验：边上的点 $z = e^{i\\pi/3}$ 映到 $e^{i\\pi} = -1$，在负实轴上，而 $z = 1$ 仍在 1，所以两条边落在实轴的两半上。\n\n> **注意。** 是用 $\\pi$ 除以角度，不是角度除以 $\\pi$。角度为 $\\frac{2\\pi}{3}$ 的楔形需要 $k = \\frac{3}{2}$，它不是整数。",
        ],
        (rng) =>
          until(() => {
            const denominator = rng.int(2, 12);
            const numerator = rng.pick(
              Array.from({ length: denominator - 1 }, (_, i) => i + 1).filter(
                (v) => Q.of(v, denominator).toLatex() === `\\frac{${v}}{${denominator}}`,
              ),
            );
            const answer = Q.of(denominator, numerator);
            const theta = numerator === 1 ? `\\frac{\\pi}{${denominator}}` : `\\frac{${numerator} \\pi}{${denominator}}`;
            const misses: Miss[] = [
              [
                Q.of(numerator, denominator),
                "That divides the angle by $\\pi$; the map must multiply the angle up to $\\pi$, so $k = \\pi / \\theta$.",
                "那用角度除以了 $\\pi$；映射要把角度乘到 $\\pi$，所以 $k = \\pi / \\theta$。",
              ],
              [
                Q.of(2 * denominator, numerator),
                "That opens the wedge to the angle $2 \\pi$, the whole plane, instead of $\\pi$.",
                "那把楔形展开到角度 $2 \\pi$，即整个平面，而不是 $\\pi$。",
              ],
              [denominator, `That ignores the numerator ${numerator} of the angle.`, `那忽略了角度的分子 ${numerator}。`],
            ];
            return worked(
              [
                `The map $w = z^k$ sends the wedge $0 < \\arg z < ${theta}$ onto the upper half-plane. What is $k$?`,
                `映射 $w = z^k$ 把楔形 $0 < \\arg z < ${theta}$ 映到上半平面。$k$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["The angle of the wedge", "楔形的角"],
                  [
                    `The wedge has angle $${theta}$, and $w = z^k$ multiplies it by $k$.`,
                    `楔形的角是 $${theta}$，而 $w = z^k$ 把它乘 $k$。`,
                  ],
                ],
                [
                  ["Match π", "使之等于 π"],
                  [
                    `$k \\cdot ${theta} = \\pi$, so $k = \\pi \\div ${theta} = ${answer.toLatex()}$.`,
                    `$k \\cdot ${theta} = \\pi$，所以 $k = \\pi \\div ${theta} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The edge point $z = e^{i \\cdot ${theta}}$ goes to $e^{i \\cdot ${answer.toLatex()} \\cdot ${theta}} = e^{i \\pi} = -1$, on the negative real axis, while $z = 1$ stays at 1.`,
                `边上的点 $z = e^{i \\cdot ${theta}}$ 映到 $e^{i \\cdot ${answer.toLatex()} \\cdot ${theta}} = e^{i \\pi} = -1$，在负实轴上，而 $z = 1$ 仍在 1。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["conformal-maps-of-regions#opening-a-wedge"],
    },
    {
      ...point(
        "opening-a-strip",
        ["Opening a strip", "展开带形"],
        [
          "The map $w = e^z$ sends the horizontal line at height $y$ to the ray at angle $y$. So a horizontal strip of height $\\pi$ goes onto a half-plane, and a taller or shorter strip goes onto a wedge. Rescaling first by $w = e^{cz}$ lets you match a strip of any height. In the drawing the strip $0 < \\operatorname{Im} z < \\pi$ goes onto the upper half-plane: the bottom edge to the positive real axis and the top edge to the negative one. For height $3\\pi$, $w = e^{z/3}$ does the same.\n\nCheck: the midline $y = \\frac{\\pi}{2}$ goes to the ray at angle $\\frac{\\pi}{2}$, the positive imaginary axis, which lies inside the upper half-plane.\n\n> **Watch out.** The image angle is $c$ times the height, so $c$ is the angle divided by the height. Without rescaling, $e^z$ wraps a strip taller than $2\\pi$ around the origin more than once.",
          "映射 $w = e^z$ 把高度为 $y$ 的水平线映成角度为 $y$ 的射线。所以高度为 $\\pi$ 的水平带被映到半平面，更高或更矮的带被映到楔形。先用 $w = e^{cz}$ 缩放，就能匹配任意高度的带形。图中带形 $0 < \\operatorname{Im} z < \\pi$ 被映到上半平面：下边界映到正实轴，上边界映到负实轴。对高度 $3\\pi$，$w = e^{z/3}$ 起同样的作用。\n\n检验：中线 $y = \\frac{\\pi}{2}$ 映到角度为 $\\frac{\\pi}{2}$ 的射线，即正虚轴，它在上半平面内。\n\n> **注意。** 像的角度是 $c$ 乘高度，所以 $c$ 是角度除以高度。不缩放的话，$e^z$ 会把高于 $2\\pi$ 的带形绕原点不止一圈。",
        ],
        (rng) =>
          until(() => {
            const h = rng.int(2, 9);
            const [q, enRegion, zhRegion] = rng.pick([
              [1, "the upper half-plane", "上半平面"],
              [2, "the first quadrant $0 < \\arg w < \\frac{\\pi}{2}$", "第一象限 $0 < \\arg w < \\frac{\\pi}{2}$"],
              [3, "the wedge $0 < \\arg w < \\frac{\\pi}{3}$", "楔形 $0 < \\arg w < \\frac{\\pi}{3}$"],
              [4, "the wedge $0 < \\arg w < \\frac{\\pi}{4}$", "楔形 $0 < \\arg w < \\frac{\\pi}{4}$"],
            ] as const);
            const answer = Q.of(1, h * q);
            const angle = piOver(q);
            const misses: Miss[] = [
              [
                h * q,
                "That divides the height by the angle; $c$ is the angle divided by the height.",
                "那用高度除以了角度；$c$ 是角度除以高度。",
              ],
              [
                1,
                `That leaves the strip unscaled; $e^z$ sends the top edge to angle $${h} \\pi$, wrapping around the origin.`,
                `那没有缩放；$e^z$ 把上边界映到角度 $${h} \\pi$，绕原点转了圈。`,
              ],
              [
                Q.of(1, h),
                `That aims for the upper half-plane, angle $\\pi$, instead of angle $${angle}$.`,
                `那以上半平面（角度 $\\pi$）为目标，而不是角度 $${angle}$。`,
              ],
              [Q.of(q, h), `That multiplies by ${q} instead of dividing by it.`, `那乘了 ${q}，而不是除以 ${q}。`],
            ];
            return worked(
              [
                `The map $w = e^{cz}$, with $c > 0$, sends the strip $0 < \\operatorname{Im} z < ${h} \\pi$ onto ${enRegion}. What is $c$?`,
                `映射 $w = e^{cz}$（$c > 0$）把带形 $0 < \\operatorname{Im} z < ${h} \\pi$ 映到${zhRegion}。$c$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Where the edges go", "边界映到哪里"],
                  [
                    `$e^{cz}$ sends the line at height $y$ to the ray at angle $cy$; the bottom edge goes to the positive real axis.`,
                    `$e^{cz}$ 把高度为 $y$ 的直线映成角度为 $cy$ 的射线；下边界映到正实轴。`,
                  ],
                ],
                [
                  ["Match the top edge", "匹配上边界"],
                  [
                    `The top edge must go to the ray at angle $${angle}$, so $c \\cdot ${h} \\pi = ${angle}$, and $c = ${answer.toLatex()}$.`,
                    `上边界必须映到角度为 $${angle}$ 的射线，所以 $c \\cdot ${h} \\pi = ${angle}$，$c = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `With $c = ${answer.toLatex()}$, the top edge $\\operatorname{Im} z = ${h} \\pi$ goes to points with argument $${answer.toLatex()} \\cdot ${h} \\pi = ${angle}$, the upper edge of the target region, and the strip in between fills the angle from 0 to $${angle}$.`,
                `取 $c = ${answer.toLatex()}$，上边界 $\\operatorname{Im} z = ${h} \\pi$ 映到辐角为 $${answer.toLatex()} \\cdot ${h} \\pi = ${angle}$ 的点，即目标区域的上边界，中间的带形填满从 0 到 $${angle}$ 的角。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["conformal-maps-of-regions#opening-a-strip"],
    },
  ],
);

/** complexAnalysisMoreTopics holds the later topics of the Complex Analysis course. */
export const complexAnalysisMoreTopics: readonly TopicDef[] = [
  lesson(
    powerSeriesDiscs,
    [
      "Where does $\\sum_{n \\ge 0} \\frac{(z - i)^n}{2^n}$ converge? The ratio of consecutive coefficients is $\\frac{1}{2}$, so the radius is 2 and the disc is $|z - i| < 2$. The point $1 + 2i$ is at distance $\\sqrt{2}$ from $i$, so the series converges there.",
      "$\\sum_{n \\ge 0} \\frac{(z - i)^n}{2^n}$ 在哪里收敛？相邻系数之比是 $\\frac{1}{2}$，所以半径是 2，圆盘是 $|z - i| < 2$。点 $1 + 2i$ 到 $i$ 的距离是 $\\sqrt{2}$，所以级数在那里收敛。",
    ],
    [
      "The series is geometric with ratio $\\frac{z - i}{2}$, which converges exactly when $|z - i| < 2$; at $1 + 2i$ the ratio has modulus $\\frac{\\sqrt{2}}{2} < 1$.",
      "这是公比为 $\\frac{z - i}{2}$ 的几何级数，恰在 $|z - i| < 2$ 时收敛；在 $1 + 2i$ 处公比的模是 $\\frac{\\sqrt{2}}{2} < 1$。",
    ],
    [
      "find the radius of convergence by the ratio test, and decide whether a series converges at a given point.",
      "用比值判别法求收敛半径，并判断级数在给定点是否收敛。",
    ],
  ),
  lesson(
    complexTrig,
    [
      "What is $\\cos(i \\ln 2)$? From $\\cos z = \\frac{1}{2} (e^{iz} + e^{-iz})$ with $iz = -\\ln 2$, it is $\\frac{1}{2} \\left( \\frac{1}{2} + 2 \\right) = \\frac{5}{4}$, larger than 1.",
      "$\\cos(i \\ln 2)$ 是多少？由 $\\cos z = \\frac{1}{2} (e^{iz} + e^{-iz})$，其中 $iz = -\\ln 2$，得 $\\frac{1}{2} \\left( \\frac{1}{2} + 2 \\right) = \\frac{5}{4}$，大于 1。",
    ],
    [
      "$\\cos(iy) = \\cosh y$, and $\\cosh(\\ln 2) = \\frac{1}{2} \\left( 2 + \\frac{1}{2} \\right) = \\frac{5}{4}$ as well.",
      "$\\cos(iy) = \\cosh y$，而 $\\cosh(\\ln 2) = \\frac{1}{2} \\left( 2 + \\frac{1}{2} \\right) = \\frac{5}{4}$，结果相同。",
    ],
    [
      "evaluate sine and cosine at imaginary points, and find all their zeros in the plane.",
      "计算正弦和余弦在纯虚数点的值，并求出它们在复平面上的全部零点。",
    ],
  ),
  lesson(
    complexPowers,
    [
      "What is the principal value of $i^{2i}$? The principal logarithm of $i$ is $\\frac{\\pi}{2} i$, so $i^{2i} = e^{2i \\cdot \\frac{\\pi}{2} i} = e^{-\\pi}$.",
      "$i^{2i}$ 的主值是多少？$i$ 的主对数是 $\\frac{\\pi}{2} i$，所以 $i^{2i} = e^{2i \\cdot \\frac{\\pi}{2} i} = e^{-\\pi}$。",
    ],
    [
      "The principal value of $i^i$ is $e^{-\\pi / 2}$, and squaring it gives $e^{-\\pi}$, the same number.",
      "$i^i$ 的主值是 $e^{-\\pi / 2}$，平方后得 $e^{-\\pi}$，是同一个数。",
    ],
    ["compute principal values of complex powers, and count how many values a power has.", "计算复数幂的主值，并数出一个幂有多少个值。"],
  ),
  lesson(
    mlInequality,
    [
      "Bound $\\int \\frac{dz}{z^2 + 1}$ over the upper half of $|z| = 3$. There $|z^2 + 1| \\ge 9 - 1 = 8$, so $M = \\frac{1}{8}$, and the arc has length $L = 3\\pi$. The bound is $\\frac{3\\pi}{8}$.",
      "估计 $\\int \\frac{dz}{z^2 + 1}$ 沿 $|z| = 3$ 上半圆的积分。那里 $|z^2 + 1| \\ge 9 - 1 = 8$，所以 $M = \\frac{1}{8}$，圆弧长 $L = 3\\pi$。上界是 $\\frac{3\\pi}{8}$。",
    ],
    [
      "At $z = 3i$, on the arc, $|z^2 + 1| = |-9 + 1| = 8$, so $M = \\frac{1}{8}$ is reached and cannot be lowered.",
      "在圆弧上的 $z = 3i$ 处，$|z^2 + 1| = |-9 + 1| = 8$，所以 $M = \\frac{1}{8}$ 能取到，不能再小。",
    ],
    ["bound contour integrals by $ML$ along segments and circles.", "沿线段和圆周用 $ML$ 估计围道积分。"],
  ),
  lesson(
    windingNumbers,
    [
      "The path $z = 2e^{it}$, $0 \\le t \\le 4\\pi$, goes around the circle $|z| = 2$ twice counterclockwise. Its winding number about 1 is 2, and about 3 it is 0, since 3 lies outside the circle.",
      "路径 $z = 2e^{it}$，$0 \\le t \\le 4\\pi$，沿圆 $|z| = 2$ 逆时针绕两圈。它绕 1 的环绕数是 2，绕 3 的环绕数是 0，因为 3 在圆外。",
    ],
    [
      "$\\oint \\frac{dz}{z} = \\int_0^{4\\pi} i \\, dt = 4\\pi i = 2 \\cdot 2\\pi i$ gives 2 about the origin, and 1 lies in the same region as the origin.",
      "$\\oint \\frac{dz}{z} = \\int_0^{4\\pi} i \\, dt = 4\\pi i = 2 \\cdot 2\\pi i$，绕原点的环绕数是 2，而 1 与原点在同一区域。",
    ],
    [
      "read winding numbers from drawings, and use them to integrate $\\frac{1}{z - a}$.",
      "从图中读出环绕数，并用它求 $\\frac{1}{z - a}$ 的积分。",
    ],
  ),
  lesson(
    zeros,
    [
      "What is the order of the zero of $z \\sin z$ at 0? $\\sin z = z - \\frac{z^3}{6} + \\dots$, so $z \\sin z = z^2 - \\frac{z^4}{6} + \\dots$, and the order is 2.",
      "$z \\sin z$ 在 0 处零点的阶是多少？$\\sin z = z - \\frac{z^3}{6} + \\dots$，所以 $z \\sin z = z^2 - \\frac{z^4}{6} + \\dots$，阶是 2。",
    ],
    [
      "$(z \\sin z)' = \\sin z + z \\cos z$ is 0 at 0, and $(z \\sin z)'' = 2 \\cos z - z \\sin z$ is 2 there, so the second derivative is the first that does not vanish.",
      "$(z \\sin z)' = \\sin z + z \\cos z$ 在 0 处为 0，$(z \\sin z)'' = 2 \\cos z - z \\sin z$ 在那里是 2，所以二阶导数是第一个不为零的导数。",
    ],
    [
      "find the orders of zeros, and use the identity theorem to recover a function from its values on a sequence.",
      "求零点的阶，并用唯一性定理由函数在一个序列上的值确定函数。",
    ],
  ),
  lesson(
    annuli,
    [
      "$\\frac{1}{z - 2}$ has two expansions about 0. For $|z| < 2$ it is $-\\frac{1}{2} \\sum \\frac{z^n}{2^n}$, and for $|z| > 2$ it is $\\sum \\frac{2^n}{z^{n+1}}$, with only negative powers.",
      "$\\frac{1}{z - 2}$ 在 0 处有两个展开式。在 $|z| < 2$ 上是 $-\\frac{1}{2} \\sum \\frac{z^n}{2^n}$，在 $|z| > 2$ 上是 $\\sum \\frac{2^n}{z^{n+1}}$，只含负幂。",
    ],
    [
      "At $z = 4$, outside the pole, the second series gives $\\frac{1}{4} \\left( 1 + \\frac{1}{2} + \\frac{1}{4} + \\dots \\right) = \\frac{1}{4} \\cdot 2 = \\frac{1}{2}$, and indeed $\\frac{1}{4 - 2} = \\frac{1}{2}$.",
      "在极点外的 $z = 4$ 处，第二个级数给出 $\\frac{1}{4} \\left( 1 + \\frac{1}{2} + \\frac{1}{4} + \\dots \\right) = \\frac{1}{4} \\cdot 2 = \\frac{1}{2}$，而确实 $\\frac{1}{4 - 2} = \\frac{1}{2}$。",
    ],
    [
      "count the regions where a rational function has a Laurent series, and find coefficients of the series outside a pole.",
      "数出有理函数有洛朗级数的区域，并求极点外部级数的系数。",
    ],
  ),
  lesson(
    argumentPrinciple,
    [
      "How many zeros does $z^4 + 6z + 1$ have in $|z| < 1$? On $|z| = 1$, $|6z| = 6$, while $|z^4 + 1| \\le 2$. So by Rouché's theorem it has as many zeros as $6z$: one.",
      "$z^4 + 6z + 1$ 在 $|z| < 1$ 内有多少个零点？在 $|z| = 1$ 上 $|6z| = 6$，而 $|z^4 + 1| \\le 2$。所以由儒歇定理，它的零点数与 $6z$ 相同：一个。",
    ],
    [
      "The real polynomial $x^4 + 6x + 1$ is 1 at 0 and $-4$ at $-1$, so it has a real zero between $-1$ and 0, which is the one zero found.",
      "实多项式 $x^4 + 6x + 1$ 在 0 处是 1，在 $-1$ 处是 $-4$，所以它在 $-1$ 和 0 之间有一个实零点，正是找到的那一个。",
    ],
    [
      "count zeros minus poles with the argument principle, and count zeros of polynomials with Rouché's theorem.",
      "用辐角原理求零点数减极点数，并用儒歇定理数多项式的零点。",
    ],
  ),
  lesson(
    trigIntegrals,
    [
      "Find $\\int_0^{2\\pi} \\frac{d\\theta}{2 + \\cos \\theta}$. With $z = e^{i\\theta}$ it becomes $\\oint \\frac{2 \\, dz}{i(z^2 + 4z + 1)}$. The root inside the unit circle is $-2 + \\sqrt{3}$, the residue there is $\\frac{2}{i \\cdot 2\\sqrt{3}}$, and the integral is $\\frac{2\\pi}{\\sqrt{3}}$.",
      "求 $\\int_0^{2\\pi} \\frac{d\\theta}{2 + \\cos \\theta}$。令 $z = e^{i\\theta}$，它变成 $\\oint \\frac{2 \\, dz}{i(z^2 + 4z + 1)}$。单位圆内的根是 $-2 + \\sqrt{3}$，那里的留数是 $\\frac{2}{i \\cdot 2\\sqrt{3}}$，积分是 $\\frac{2\\pi}{\\sqrt{3}}$。",
    ],
    [
      "The formula $\\frac{2\\pi}{\\sqrt{a^2 - b^2}}$ with $a = 2$, $b = 1$ gives $\\frac{2\\pi}{\\sqrt{3}}$ too, and the value lies between $\\frac{2\\pi}{3}$ and $2\\pi$, the integrals of $\\frac{1}{3}$ and 1.",
      "公式 $\\frac{2\\pi}{\\sqrt{a^2 - b^2}}$ 取 $a = 2$，$b = 1$ 也给出 $\\frac{2\\pi}{\\sqrt{3}}$，而且这个值在 $\\frac{1}{3}$ 和 1 的积分 $\\frac{2\\pi}{3}$ 与 $2\\pi$ 之间。",
    ],
    [
      "turn period integrals into contour integrals on the unit circle, and evaluate them by residues.",
      "把周期积分变成单位圆上的围道积分，并用留数计算。",
    ],
  ),
  lesson(
    improper,
    [
      "Find $\\int_{-\\infty}^{\\infty} \\frac{dx}{x^2 + 4}$. The only pole above the axis is $2i$, with residue $\\frac{1}{4i}$, so the integral is $2\\pi i \\cdot \\frac{1}{4i} = \\frac{\\pi}{2}$.",
      "求 $\\int_{-\\infty}^{\\infty} \\frac{dx}{x^2 + 4}$。实轴上方唯一的极点是 $2i$，留数是 $\\frac{1}{4i}$，所以积分是 $2\\pi i \\cdot \\frac{1}{4i} = \\frac{\\pi}{2}$。",
    ],
    [
      "An antiderivative is $\\frac{1}{2} \\arctan \\frac{x}{2}$, which rises by $\\frac{1}{2} \\pi$ from $-\\infty$ to $\\infty$.",
      "一个原函数是 $\\frac{1}{2} \\arctan \\frac{x}{2}$，它从 $-\\infty$ 到 $\\infty$ 增加 $\\frac{1}{2} \\pi$。",
    ],
    [
      "evaluate integrals over the real line by closing the contour in the upper half-plane, with and without a cosine.",
      "通过在上半平面闭合围道，计算实轴上的积分，包括含余弦的积分。",
    ],
  ),
  lesson(
    crossRatio,
    [
      "What is $(1, 3; 0, 2)$? It is $\\frac{(1 - 0)(3 - 2)}{(1 - 2)(3 - 0)} = \\frac{1}{-3} = -\\frac{1}{3}$.",
      "$(1, 3; 0, 2)$ 是多少？它是 $\\frac{(1 - 0)(3 - 2)}{(1 - 2)(3 - 0)} = \\frac{1}{-3} = -\\frac{1}{3}$。",
    ],
    [
      "Under $w = 2z$ the points become 2, 6, 0 and 4, and $\\frac{(2 - 0)(6 - 4)}{(2 - 4)(6 - 0)} = \\frac{4}{-12} = -\\frac{1}{3}$ again, as invariance requires.",
      "在 $w = 2z$ 下这些点变成 2、6、0 和 4，而 $\\frac{(2 - 0)(6 - 4)}{(2 - 4)(6 - 0)} = \\frac{4}{-12} = -\\frac{1}{3}$，正如不变性所要求的。",
    ],
    [
      "compute cross ratios, and decide whether a Möbius map sends a circle to a line or to a circle.",
      "计算交比，并判断默比乌斯变换把圆映成直线还是圆。",
    ],
  ),
  lesson(
    regionMaps,
    [
      "Which power sends the quarter plane $0 < \\arg z < \\frac{\\pi}{2}$ onto the upper half-plane? Squaring doubles every argument, so $w = z^2$ does it.",
      "哪个幂把四分之一平面 $0 < \\arg z < \\frac{\\pi}{2}$ 映到上半平面？平方使每个辐角加倍，所以 $w = z^2$ 可以做到。",
    ],
    [
      "The edge point $z = i$ goes to $i^2 = -1$, on the negative real axis, and $z = 1$ stays at 1, so the two edges go to the two halves of the real axis.",
      "边上的点 $z = i$ 映到 $i^2 = -1$，在负实轴上，而 $z = 1$ 仍在 1，所以两条边映到实轴的两半。",
    ],
    [
      "open wedges with powers and strips with exponentials onto half-planes and wedges.",
      "用幂函数展开楔形，用指数函数展开带形，把它们映到半平面和楔形。",
    ],
  ),
];
