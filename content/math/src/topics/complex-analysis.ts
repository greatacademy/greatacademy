// Complex Analysis: analytic functions, contour integrals, Cauchy's theorems, series,
// residues and conformal maps, building on complex numbers and multivariable calculus.

import type { Rng, TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { complexDrawings1 } from "../explanation-drawings-complex-analysis-1.ts";

import { type Pair, point, same, topic } from "../university-kit.ts";
import { chosen, lesson, type Miss, pw, type Slip, until, worked } from "./number-theory-course.ts";

/** complex writes a Gaussian integer in LaTeX. */
function complex(a: number, b: number): string {
  if (b === 0) return `${a}`;
  const unit = Math.abs(b) === 1 ? "i" : `${Math.abs(b)}i`;
  if (a === 0) return b < 0 ? `-${unit}` : unit;
  return `${a} ${b < 0 ? "-" : "+"} ${unit}`;
}

/** minus writes a variable minus a number, adjusting the sign. */
const minus = (v: string, a: number) => (a === 0 ? v : a < 0 ? `${v} + ${-a}` : `${v} - ${a}`);

/** factor writes a power of z minus a number, as it stands in a product. */
const factor = (a: number, n = 1) => {
  const base = a === 0 ? "z" : `(${minus("z", a)})`;
  return n === 1 ? base : `${base}^{${n}}`;
};

/** bracket wraps a negative number in parentheses. */
const bracket = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** coefficient writes a coefficient before a term, leaving out a coefficient of one. */
const coefficient = (c: number, term: string) => (c === 1 ? term : c === -1 ? `-${term}` : `${c}${term}`);

/** addend writes a constant added after a term, leaving it out when it is zero. */
const addend = (c: number) => (c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`);

/** plus writes a sum of a term and a signed term, as in z^2 + 3z or z^2 - 3z. */
const plus = (c: number, term: string) => (c === 0 ? "" : c > 0 ? ` + ${coefficient(c, term)}` : ` - ${coefficient(-c, term)}`);

/** part names the real or the imaginary part, in English and Chinese. */
const part = (real: boolean): Pair => (real ? ["real", "实部"] : ["imaginary", "虚部"]);

/** triples are Pythagorean triples, so that moduli come out whole. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
  [6, 8, 10],
  [8, 6, 10],
];

/** signedTriple draws a Gaussian integer with a whole modulus. */
const signedTriple = (rng: Rng) => {
  const [a, b, r] = rng.pick(triples) as readonly [number, number, number];
  return { a: rng.bool() ? a : -a, b: rng.bool() ? b : -b, r };
};

/** nonzero lists the small nonzero whole numbers used for parts of complex numbers. */
const nonzero = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];

const complexFunctions = topic(
  "functions-of-a-complex-variable",
  ["Functions of a Complex Variable", "复变函数"],
  ["Evaluate functions of a complex variable, and split them into real and imaginary parts.", "计算复变函数的值，并把它们分成实部和虚部。"],
  ["multiplying-complex-numbers", "dividing-complex-numbers"],
  [["multiplying-complex-numbers", 0.3]],
  [
    point(
      "the-real-and-imaginary-parts-of-a-square",
      ["Parts of a quadratic function", "二次函数的实部和虚部"],
      [
        "A complex function sends each complex number to another, so it can be written as $u + iv$, with $u$ and $v$ real functions of $x$ and $y$. For $z^2$, expanding $(x + iy)^2$ gives $u = x^2 - y^2$ and $v = 2xy$. So $f(z) = z^2 + 1$ at $2 + 3i$ has $u = 4 - 9 + 1 = -4$ and $v = 2 \\cdot 2 \\cdot 3 = 12$, and $f(2 + 3i) = -4 + 12i$.\n\nCheck: multiplying out directly, $(2 + 3i)(2 + 3i) = 4 + 6i + 6i + 9i^2 = -5 + 12i$, and adding 1 gives $-4 + 12i$.\n\n> **Watch out.** Because $i^2 = -1$, the term $y^2$ enters the real part with a minus sign. A constant added to the function changes only the real part.",
        "复变函数把每个复数送到另一个复数，所以可以写成 $u + iv$，其中 $u$ 和 $v$ 是 $x$ 和 $y$ 的实函数。对 $z^2$，展开 $(x + iy)^2$ 得 $u = x^2 - y^2$，$v = 2xy$。所以 $f(z) = z^2 + 1$ 在 $2 + 3i$ 处有 $u = 4 - 9 + 1 = -4$，$v = 2 \\cdot 2 \\cdot 3 = 12$，即 $f(2 + 3i) = -4 + 12i$。\n\n检验：直接相乘，$(2 + 3i)(2 + 3i) = 4 + 6i + 6i + 9i^2 = -5 + 12i$，再加 1 得 $-4 + 12i$。\n\n> **注意。** 因为 $i^2 = -1$，$y^2$ 这一项以负号进入实部。给函数加上的常数只改变实部。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-6, 6);
          const b = rng.pick(nonzero);
          const c = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
          const real = rng.bool();
          const [u, v] = [a * a - b * b + c, 2 * a * b];
          const [en, zh] = part(real);
          const misses: Miss[] = real
            ? [
                [
                  a * a + b * b + c,
                  "That adds $y^2$; since $i^2 = -1$, it is subtracted.",
                  "那加上了 $y^2$；因为 $i^2 = -1$，它应该减去。",
                ],
                [a * a - b * b, "That leaves out the constant, which adds to the real part.", "那漏掉了常数，它要加到实部上。"],
                [v, "That is the imaginary part.", "那是虚部。"],
              ]
            : [
                [u, "That is the real part.", "那是实部。"],
                [
                  v + c,
                  "That adds the constant to the imaginary part; a real constant changes only the real part.",
                  "那把常数加到了虚部上；实常数只改变实部。",
                ],
                [a * b, "That forgets the 2 in the cross term $2xy$.", "那漏掉了交叉项 $2xy$ 中的 2。"],
              ];
          return worked(
            [
              `Let $f(z) = z^2${addend(c)}$. What is the ${en} part of $f(${complex(a, b)})$?`,
              `设 $f(z) = z^2${addend(c)}$。$f(${complex(a, b)})$ 的${zh}是多少？`,
            ],
            real ? u : v,
            misses,
            [
              [
                ["Split the function", "把函数分开"],
                [
                  `With $z = x + iy$, $u = x^2 - y^2${addend(c)}$ and $v = 2xy$.`,
                  `取 $z = x + iy$，则 $u = x^2 - y^2${addend(c)}$，$v = 2xy$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `At $x = ${a}$, $y = ${b}$: $u = ${a * a} - ${b * b}${addend(c)} = ${u}$ and $v = 2 \\cdot ${bracket(a)} \\cdot ${bracket(b)} = ${v}$.`,
                  `在 $x = ${a}$，$y = ${b}$ 处：$u = ${a * a} - ${b * b}${addend(c)} = ${u}$，$v = 2 \\cdot ${bracket(a)} \\cdot ${bracket(b)} = ${v}$。`,
                ],
              ],
              [
                ["Read the part", "读出所求部分"],
                [
                  `$f(${complex(a, b)}) = ${complex(u, v)}$, so the ${en} part is ${real ? u : v}.`,
                  `$f(${complex(a, b)}) = ${complex(u, v)}$，所以${zh}是 ${real ? u : v}。`,
                ],
              ],
            ],
            [
              `The square must have modulus $|z|^2 = ${a * a + b * b}$, and indeed $(${a * a - b * b})^2 + (${v})^2 = ${(a * a - b * b) ** 2 + v * v} = ${a * a + b * b}^2$.`,
              `平方的模必须是 $|z|^2 = ${a * a + b * b}$，而确实 $(${a * a - b * b})^2 + (${v})^2 = ${(a * a - b * b) ** 2 + v * v} = ${a * a + b * b}^2$。`,
            ],
          );
        }),
    ),
    point(
      "the-reciprocal-function",
      ["The reciprocal function", "倒数函数"],
      [
        "The reciprocal of a complex number comes from multiplying above and below by its conjugate, which makes the denominator the real number $x^2 + y^2$. So $\\frac{1}{z} = \\frac{x}{x^2 + y^2} - \\frac{y}{x^2 + y^2} i$. For $z = 3 + 4i$: $\\frac{1}{3 + 4i} = \\frac{3 - 4i}{25}$, with real part $\\frac{3}{25}$ and imaginary part $-\\frac{4}{25}$.\n\nCheck: $(3 + 4i) \\cdot \\frac{3 - 4i}{25} = \\frac{9 + 16}{25} = 1$.\n\n> **Watch out.** The imaginary part changes sign. The denominator is the square of the modulus, $x^2 + y^2 = 25$, not the modulus 5.",
        "复数的倒数可以通过分子分母同乘共轭得到，这样分母变成实数 $x^2 + y^2$。所以 $\\frac{1}{z} = \\frac{x}{x^2 + y^2} - \\frac{y}{x^2 + y^2} i$。对 $z = 3 + 4i$：$\\frac{1}{3 + 4i} = \\frac{3 - 4i}{25}$，实部是 $\\frac{3}{25}$，虚部是 $-\\frac{4}{25}$。\n\n检验：$(3 + 4i) \\cdot \\frac{3 - 4i}{25} = \\frac{9 + 16}{25} = 1$。\n\n> **注意。** 虚部要变号。分母是模的平方 $x^2 + y^2 = 25$，而不是模 5。",
      ],
      (rng) =>
        until(() => {
          const { a, b, r } = signedTriple(rng);
          const real = rng.bool();
          const [en, zh] = part(real);
          const answer = real ? Q.of(a, r * r) : Q.of(-b, r * r);
          const misses: Miss[] = real
            ? [
                [Q.of(a, r), "That divides by the modulus; the denominator is its square.", "那除以了模；分母应该是模的平方。"],
                [
                  Q.of(-a, r * r),
                  "That changes the sign of the real part; only the imaginary part changes sign.",
                  "那改变了实部的符号；只有虚部变号。",
                ],
                [Q.of(-b, r * r), "That is the imaginary part.", "那是虚部。"],
              ]
            : [
                [
                  Q.of(b, r * r),
                  "That keeps the sign of the imaginary part; the conjugate flips it.",
                  "那保留了虚部的符号；共轭会把它变号。",
                ],
                [Q.of(-b, r), "That divides by the modulus; the denominator is its square.", "那除以了模；分母应该是模的平方。"],
                [Q.of(a, r * r), "That is the real part.", "那是实部。"],
              ];
          return worked(
            [`What is the ${en} part of $\\frac{1}{${complex(a, b)}}$?`, `$\\frac{1}{${complex(a, b)}}$ 的${zh}是多少？`],
            answer,
            misses,
            [
              [
                ["Multiply by the conjugate", "乘以共轭"],
                [
                  `$\\frac{1}{${complex(a, b)}} = \\frac{${complex(a, -b)}}{(${complex(a, b)})(${complex(a, -b)})}$.`,
                  `$\\frac{1}{${complex(a, b)}} = \\frac{${complex(a, -b)}}{(${complex(a, b)})(${complex(a, -b)})}$。`,
                ],
              ],
              [
                ["Simplify the denominator", "化简分母"],
                [
                  `It is $${a * a} + ${b * b} = ${r * r}$, so the reciprocal is $\\frac{${complex(a, -b)}}{${r * r}}$.`,
                  `它是 $${a * a} + ${b * b} = ${r * r}$，所以倒数是 $\\frac{${complex(a, -b)}}{${r * r}}$。`,
                ],
              ],
              [
                ["Read the part", "读出所求部分"],
                [`The ${en} part is $${answer.toLatex()}$.`, `${zh}是 $${answer.toLatex()}$。`],
              ],
            ],
            [
              `Multiplying back, $(${complex(a, b)}) \\cdot \\frac{${complex(a, -b)}}{${r * r}} = \\frac{${a * a} + ${b * b}}{${r * r}} = 1$.`,
              `乘回去，$(${complex(a, b)}) \\cdot \\frac{${complex(a, -b)}}{${r * r}} = \\frac{${a * a} + ${b * b}}{${r * r}} = 1$。`,
            ],
          );
        }),
    ),
  ],
);

const complexLimits = topic(
  "limits-of-complex-functions",
  ["Limits of Complex Functions", "复变函数的极限"],
  ["Evaluate limits, and detect failure by approaching along different lines.", "求极限，并通过沿不同直线趋近来发现极限不存在。"],
  ["functions-of-a-complex-variable"],
  [],
  [
    point(
      "a-limit-along-a-line",
      ["A limit along a line", "沿直线的极限"],
      [
        "In the plane, $z$ can approach a point along infinitely many paths, and a limit must give the same value on all of them. The quotient $\\frac{\\bar{z}}{z}$ depends only on direction. Along $y = 2x$, $z = x(1 + 2i)$, so $\\frac{\\bar{z}}{z} = \\frac{1 - 2i}{1 + 2i} = \\frac{(1 - 2i)^2}{5} = -\\frac{3}{5} - \\frac{4}{5}i$, while along the real axis it is 1. The values differ, so the limit at zero does not exist.\n\nCheck: $|\\bar{z}| = |z|$, so the quotient has modulus 1, and indeed $\\frac{9}{25} + \\frac{16}{25} = 1$.\n\n> **Watch out.** The factor $x$ cancels, so the value does not depend on how close $z$ is to zero, only on the direction. Multiply above and below by $1 - mi$; the numerator becomes $(1 - mi)^2$, not $1 - m^2$.",
        "在平面上，$z$ 可以沿无穷多条路径趋近一点，极限必须在所有路径上给出相同的值。商 $\\frac{\\bar{z}}{z}$ 只取决于方向。沿 $y = 2x$，$z = x(1 + 2i)$，所以 $\\frac{\\bar{z}}{z} = \\frac{1 - 2i}{1 + 2i} = \\frac{(1 - 2i)^2}{5} = -\\frac{3}{5} - \\frac{4}{5}i$，而沿实轴它是 1。两个值不同，所以在零处极限不存在。\n\n检验：$|\\bar{z}| = |z|$，所以这个商的模是 1，确实 $\\frac{9}{25} + \\frac{16}{25} = 1$。\n\n> **注意。** 因子 $x$ 约掉了，所以值与 $z$ 离零多近无关，只与方向有关。分子分母同乘 $1 - mi$；分子变成 $(1 - mi)^2$，而不是 $1 - m^2$。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(2, 20);
          const real = rng.bool();
          const [en, zh] = part(real);
          const n = 1 + m * m;
          const answer = real ? Q.of(1 - m * m, n) : Q.of(-2 * m, n);
          const misses: Miss[] = real
            ? [
                [
                  Q.of(1),
                  "That treats $\\bar{z}$ as $z$; along this line they differ.",
                  "那把 $\\bar{z}$ 当成了 $z$；沿这条直线两者不同。",
                ],
                [Q.of(1 - m * m), "That forgets to divide by $(1 + mi)(1 - mi) = 1 + m^2$.", "那忘了除以 $(1 + mi)(1 - mi) = 1 + m^2$。"],
                [Q.of(-2 * m, n), "That is the imaginary part.", "那是虚部。"],
              ]
            : [
                [
                  Q.of(2 * m, n),
                  "That squares $1 + mi$; the conjugate $1 - mi$ is on top.",
                  "那平方了 $1 + mi$；在分子上的是共轭 $1 - mi$。",
                ],
                [Q.of(-2 * m), "That forgets to divide by $(1 + mi)(1 - mi) = 1 + m^2$.", "那忘了除以 $(1 + mi)(1 - mi) = 1 + m^2$。"],
                [Q.of(1 - m * m, n), "That is the real part.", "那是实部。"],
              ];
          return worked(
            [
              `Along the line $y = ${m}x$, the quotient $\\frac{\\bar{z}}{z}$ is constant. What is its ${en} part?`,
              `沿直线 $y = ${m}x$，商 $\\frac{\\bar{z}}{z}$ 是常数。它的${zh}是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Write z on the line", "写出直线上的 z"],
                [
                  `$z = x(1 + ${m}i)$ and $\\bar{z} = x(1 - ${m}i)$, so $x$ cancels: $\\frac{\\bar{z}}{z} = \\frac{1 - ${m}i}{1 + ${m}i}$.`,
                  `$z = x(1 + ${m}i)$，$\\bar{z} = x(1 - ${m}i)$，所以 $x$ 约掉：$\\frac{\\bar{z}}{z} = \\frac{1 - ${m}i}{1 + ${m}i}$。`,
                ],
              ],
              [
                ["Multiply by the conjugate", "乘以共轭"],
                [
                  `$\\frac{(1 - ${m}i)^2}{1 + ${m * m}} = \\frac{${1 - m * m} - ${2 * m}i}{${n}}$.`,
                  `$\\frac{(1 - ${m}i)^2}{1 + ${m * m}} = \\frac{${1 - m * m} - ${2 * m}i}{${n}}$。`,
                ],
              ],
              [
                ["Read the part", "读出所求部分"],
                [`The ${en} part is $${answer.toLatex()}$.`, `${zh}是 $${answer.toLatex()}$。`],
              ],
            ],
            [
              `The quotient has modulus 1, and $(${1 - m * m})^2 + ${2 * m}^2 = ${(1 - m * m) ** 2 + 4 * m * m} = ${n}^2$. Along the real axis the quotient is 1 instead, so the limit at 0 fails.`,
              `这个商的模是 1，而 $(${1 - m * m})^2 + ${2 * m}^2 = ${(1 - m * m) ** 2 + 4 * m * m} = ${n}^2$。沿实轴这个商却是 1，所以在 0 处极限不存在。`,
            ],
          );
        }),
    ),
    point(
      "a-limit-of-a-polynomial",
      ["A limit of a quotient", "商的极限"],
      [
        "Polynomials are continuous on the whole plane, so their limits come from substitution, just as for real functions. A quotient that is zero over zero at a point usually has a common factor to cancel. For $\\lim_{z \\to 1 + 2i} \\frac{z^2 - (1 + 2i)^2}{z - (1 + 2i)}$, the numerator factors as $(z - (1 + 2i))(z + (1 + 2i))$, and after cancelling the limit is $2(1 + 2i) = 2 + 4i$, from every direction.\n\nCheck: the quotient is the difference quotient of $z^2$ at $1 + 2i$, so the limit is the derivative $2z = 2 + 4i$.\n\n> **Watch out.** Substituting first gives $\\frac{0}{0}$, which says nothing about the limit; it is not 0. After cancelling, $z + (1 + 2i)$ tends to twice the point, not to the point itself.",
        "多项式在整个平面上连续，所以它们的极限可以直接代入，就像实函数一样。在一点处为零比零的商通常有可约去的公因式。对 $\\lim_{z \\to 1 + 2i} \\frac{z^2 - (1 + 2i)^2}{z - (1 + 2i)}$，分子分解为 $(z - (1 + 2i))(z + (1 + 2i))$，约分后极限是 $2(1 + 2i) = 2 + 4i$，不论从哪个方向趋近。\n\n检验：这个商是 $z^2$ 在 $1 + 2i$ 处的差商，所以极限是导数 $2z = 2 + 4i$。\n\n> **注意。** 先代入得到 $\\frac{0}{0}$，它对极限什么也没说明；极限不是 0。约分后，$z + (1 + 2i)$ 趋向这一点的两倍，而不是这一点本身。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick(nonzero);
          const b = rng.pick(nonzero);
          const real = rng.bool();
          const [en, zh] = part(real);
          const z0 = complex(a, b);
          const answer = real ? 2 * a : 2 * b;
          return worked(
            [
              `What is the ${en} part of $\\lim_{z \\to ${z0}} \\frac{z^2 - (${z0})^2}{z - (${z0})}$?`,
              `$\\lim_{z \\to ${z0}} \\frac{z^2 - (${z0})^2}{z - (${z0})}$ 的${zh}是多少？`,
            ],
            answer,
            [
              [
                real ? a : b,
                "That stops at the point itself; the limit of $z + z_0$ is twice the point.",
                "那停在了这一点本身；$z + z_0$ 的极限是这一点的两倍。",
              ],
              [
                0,
                "That substitutes first and reads $\\frac{0}{0}$ as 0; the factor must be cancelled.",
                "那先代入，把 $\\frac{0}{0}$ 读成了 0；应先约去公因式。",
              ],
              [real ? 2 * b : 2 * a, `That is the ${real ? "imaginary" : "real"} part.`, `那是${real ? "虚部" : "实部"}。`],
            ],
            [
              [
                ["Factor the numerator", "分解分子"],
                [`$z^2 - (${z0})^2 = (z - (${z0}))(z + (${z0}))$.`, `$z^2 - (${z0})^2 = (z - (${z0}))(z + (${z0}))$。`],
              ],
              [
                ["Cancel and substitute", "约分后代入"],
                [
                  `The quotient is $z + (${z0})$ away from the point, which tends to $2(${z0}) = ${complex(2 * a, 2 * b)}$.`,
                  `在这一点以外商等于 $z + (${z0})$，它趋向 $2(${z0}) = ${complex(2 * a, 2 * b)}$。`,
                ],
              ],
              [
                ["Read the part", "读出所求部分"],
                [`The ${en} part is ${answer}.`, `${zh}是 ${answer}。`],
              ],
            ],
            [
              `The quotient is the difference quotient of $z^2$, so the limit is its derivative $2z$ at $${z0}$, which is $${complex(2 * a, 2 * b)}$.`,
              `这个商是 $z^2$ 的差商，所以极限是导数 $2z$ 在 $${z0}$ 处的值，即 $${complex(2 * a, 2 * b)}$。`,
            ],
          );
        }),
    ),
  ],
);

const complexDerivative = topic(
  "the-complex-derivative",
  ["The Complex Derivative", "复导数"],
  ["Differentiate by the familiar rules, and see why the conjugate has no derivative.", "用熟悉的法则求导，并了解共轭为什么没有导数。"],
  ["limits-of-complex-functions"],
  [["limits-of-complex-functions", 0.5]],
  [
    point(
      "differentiating-a-power",
      ["Differentiating a polynomial", "多项式求导"],
      [
        "The complex derivative is defined by the same quotient as the real one, but with $h$ complex and approaching zero from every direction. Where it exists, the power, sum, product and chain rules all carry over. For $f(z) = z^3 + 2z$, $f'(z) = 3z^2 + 2$, and at $1 + i$ we have $(1 + i)^2 = 2i$, so $f'(1 + i) = 6i + 2 = 2 + 6i$.\n\nCheck: with $u = x^3 - 3xy^2 + 2x$ and $v = 3x^2y - y^3 + 2y$, $u_x + iv_x = (3x^2 - 3y^2 + 2) + 6xyi$, which is $2 + 6i$ at $x = y = 1$.\n\n> **Watch out.** Square the complex point first and keep $i^2 = -1$; then multiply by 3. The constant from $2z$ adds only to the real part.",
        "复导数由与实导数相同的商定义，只是 $h$ 是复数，从各个方向趋于零。导数存在时，幂、和、积、链式法则都适用。对 $f(z) = z^3 + 2z$，$f'(z) = 3z^2 + 2$，在 $1 + i$ 处 $(1 + i)^2 = 2i$，所以 $f'(1 + i) = 6i + 2 = 2 + 6i$。\n\n检验：取 $u = x^3 - 3xy^2 + 2x$，$v = 3x^2y - y^3 + 2y$，则 $u_x + iv_x = (3x^2 - 3y^2 + 2) + 6xyi$，在 $x = y = 1$ 处是 $2 + 6i$。\n\n> **注意。** 先把复数点平方并记住 $i^2 = -1$，再乘以 3。$2z$ 带来的常数只加到实部上。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-4, 5);
          const b = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
          const c = rng.int(2, 7);
          const real = rng.bool();
          const [en, zh] = part(real);
          const [s, t] = [a * a - b * b, 2 * a * b];
          const [u, v] = [3 * s + c, 3 * t];
          const misses: Miss[] = real
            ? [
                [
                  3 * (a * a + b * b) + c,
                  "That adds $y^2$ when squaring; since $i^2 = -1$ it is subtracted.",
                  "平方时那加上了 $y^2$；因为 $i^2 = -1$，它应该减去。",
                ],
                [3 * s, `That leaves out the constant ${c} from differentiating $${c}z$.`, `那漏掉了由 $${c}z$ 求导得到的常数 ${c}。`],
                [s + c, "That forgets the factor 3 from the power rule.", "那漏掉了幂法则中的因子 3。"],
              ]
            : [
                [3 * a * b, "That forgets the 2 in the cross term of the square.", "那漏掉了平方中交叉项的 2。"],
                [t, "That forgets the factor 3 from the power rule.", "那漏掉了幂法则中的因子 3。"],
                [u, "That is the real part.", "那是实部。"],
              ];
          return worked(
            [
              `Let $f(z) = z^3 + ${c}z$. What is the ${en} part of $f'(${complex(a, b)})$?`,
              `设 $f(z) = z^3 + ${c}z$。$f'(${complex(a, b)})$ 的${zh}是多少？`,
            ],
            real ? u : v,
            misses,
            [
              [
                ["Differentiate", "求导"],
                [`$f'(z) = 3z^2 + ${c}$.`, `$f'(z) = 3z^2 + ${c}$。`],
              ],
              [
                ["Square the point", "把点平方"],
                [
                  `$(${complex(a, b)})^2 = ${a * a} - ${b * b} + 2 \\cdot ${bracket(a)} \\cdot ${bracket(b)} \\cdot i = ${complex(s, t)}$.`,
                  `$(${complex(a, b)})^2 = ${a * a} - ${b * b} + 2 \\cdot ${bracket(a)} \\cdot ${bracket(b)} \\cdot i = ${complex(s, t)}$。`,
                ],
              ],
              [
                ["Finish", "算完"],
                [
                  `$f' = 3(${complex(s, t)}) + ${c} = ${complex(u, v)}$, so the ${en} part is ${real ? u : v}.`,
                  `$f' = 3(${complex(s, t)}) + ${c} = ${complex(u, v)}$，所以${zh}是 ${real ? u : v}。`,
                ],
              ],
            ],
            [
              `With $u = x^3 - 3xy^2 + ${c}x$ and $v = 3x^2y - y^3 + ${c}y$, $u_x = 3x^2 - 3y^2 + ${c} = ${u}$ and $v_x = 6xy = ${v}$ at this point, so $f' = u_x + iv_x$ agrees.`,
              `取 $u = x^3 - 3xy^2 + ${c}x$，$v = 3x^2y - y^3 + ${c}y$，在这一点 $u_x = 3x^2 - 3y^2 + ${c} = ${u}$，$v_x = 6xy = ${v}$，所以 $f' = u_x + iv_x$ 与之一致。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "the-conjugate-has-no-derivative",
        ["The conjugate has no derivative", "共轭没有导数"],
        [
          "The conjugate function is continuous everywhere, yet it has no derivative at any point. Its difference quotient is $\\frac{\\overline{z + h} - \\bar{z}}{h} = \\frac{\\bar{h}}{h}$. For a real $h$ the conjugate equals $h$, so the quotient is 1; for an imaginary $h$ the conjugate is $-h$, so the quotient is $-1$. The two values differ, so the limit fails. For $3\\bar{z}$ the two quotients are $3$ and $-3$.\n\nCheck: $\\frac{\\bar{h}}{h}$ always has modulus 1, and writing $h = |h|e^{i\\theta}$ gives $e^{-2i\\theta}$, which changes with the direction $\\theta$, so no single limit exists.\n\n> **Watch out.** Continuity is not enough for a complex derivative. The quotient does not involve $z$ at all, so the failure happens at every point, not only at 0.",
          "共轭函数处处连续，却在任何一点都没有导数。它的差商是 $\\frac{\\overline{z + h} - \\bar{z}}{h} = \\frac{\\bar{h}}{h}$。$h$ 为实数时，共轭等于 $h$，商是 1；$h$ 为纯虚数时，共轭是 $-h$，商是 $-1$。两个值不同，所以极限不存在。对 $3\\bar{z}$，两个商是 $3$ 和 $-3$。\n\n检验：$\\frac{\\bar{h}}{h}$ 的模总是 1，写成 $h = |h|e^{i\\theta}$ 得 $e^{-2i\\theta}$，它随方向 $\\theta$ 改变，所以不存在唯一的极限。\n\n> **注意。** 连续不足以保证复导数存在。这个商根本不含 $z$，所以在每一点都不可导，而不只是在 0 处。",
        ],
        (rng) =>
          until(() => {
            const c = rng.int(2, 19);
            const real = rng.bool();
            const answer = real ? c : -c;
            const h = real ? "t" : "it";
            return worked(
              [
                `Let $f(z) = ${c}\\bar{z}$. For real $t \\ne 0$, what is the difference quotient $\\frac{f(z + ${h}) - f(z)}{${h}}$?`,
                `设 $f(z) = ${c}\\bar{z}$。对实数 $t \\ne 0$，差商 $\\frac{f(z + ${h}) - f(z)}{${h}}$ 是多少？`,
              ],
              answer,
              [
                [
                  -answer,
                  real
                    ? "That conjugates $t$ to $-t$; a real number is its own conjugate."
                    : "That keeps $it$ unchanged; its conjugate is $-it$.",
                  real ? "那把 $t$ 的共轭写成了 $-t$；实数的共轭是它本身。" : "那让 $it$ 保持不变；它的共轭是 $-it$。",
                ],
                [real ? 1 : -1, `That drops the factor ${c} in front of the conjugate.`, `那丢掉了共轭前面的因子 ${c}。`],
                [
                  0,
                  `That takes the difference as 0; it is ${c} times the conjugate of the step.`,
                  `那把差当成了 0；它是 ${c} 乘步长的共轭。`,
                ],
              ],
              [
                [
                  ["Take the difference", "求差"],
                  [
                    `$f(z + ${h}) - f(z) = ${c}\\overline{z + ${h}} - ${c}\\bar{z} = ${c}\\overline{${h}}$.`,
                    `$f(z + ${h}) - f(z) = ${c}\\overline{z + ${h}} - ${c}\\bar{z} = ${c}\\overline{${h}}$。`,
                  ],
                ],
                [
                  ["Conjugate the step", "求步长的共轭"],
                  real
                    ? ["$\\bar{t} = t$, since $t$ is real.", "$\\bar{t} = t$，因为 $t$ 是实数。"]
                    : ["$\\overline{it} = -it$.", "$\\overline{it} = -it$。"],
                ],
                [
                  ["Divide", "相除"],
                  [
                    `The quotient is $\\frac{${real ? `${c}t` : `-${c}it`}}{${h}} = ${answer}$.`,
                    `商是 $\\frac{${real ? `${c}t` : `-${c}it`}}{${h}} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `The quotient is $${c}\\frac{\\bar{h}}{h}$ for any step $h$, and $\\frac{\\bar{h}}{h}$ is $1$ along the real axis and $-1$ along the imaginary axis, giving $${c}$ and $-${c}$; so this step gives $${answer}$, and the two directions disagree.`,
                `对任意步长 $h$，商都是 $${c}\\frac{\\bar{h}}{h}$，而 $\\frac{\\bar{h}}{h}$ 沿实轴是 $1$，沿虚轴是 $-1$，分别给出 $${c}$ 和 $-${c}$；所以这个步长给出 $${answer}$，两个方向不一致。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["the-complex-derivative#the-conjugate-has-no-derivative"],
    },
  ],
);

const cauchyRiemann = topic(
  "the-cauchy-riemann-equations",
  ["The Cauchy–Riemann Equations", "柯西–黎曼方程"],
  ["Test analyticity through partial derivatives, and compute derivatives from them.", "用偏导数检验解析性，并由它们计算导数。"],
  ["the-complex-derivative", "computing-partial-derivatives-using-the-rules-of-differentiation"],
  [["the-complex-derivative", 0.4]],
  [
    point(
      "choosing-a-constant-for-the-equations",
      ["Choosing a constant", "选择常数"],
      [
        "Approaching along the real and imaginary directions and comparing gives the Cauchy–Riemann equations: $u_x = v_y$ and $u_y = -v_x$. With continuous partial derivatives, these are exactly the conditions for complex differentiability. For $f = 3(x^2 - y^2) + ikxy$: $u_x = 6x$ and $v_y = kx$, so $k = 6$; then $u_y = -6y$ and $-v_x = -6y$ agree as well.\n\nCheck: $3z^2 = 3(x^2 - y^2) + 6xyi$, so with $k = 6$ the function is $3z^2$, which is analytic.\n\n> **Watch out.** The imaginary part of $z^2$ is $2xy$, so $k$ is twice the coefficient of $x^2 - y^2$. The second equation carries a minus sign, $u_y = -v_x$, and it must be checked too.",
        "沿实方向和虚方向趋近并比较，就得到柯西–黎曼方程：$u_x = v_y$，$u_y = -v_x$。在偏导数连续时，这些正是复可导的条件。对 $f = 3(x^2 - y^2) + ikxy$：$u_x = 6x$，$v_y = kx$，所以 $k = 6$；此时 $u_y = -6y$ 与 $-v_x = -6y$ 也一致。\n\n检验：$3z^2 = 3(x^2 - y^2) + 6xyi$，所以 $k = 6$ 时函数就是 $3z^2$，它是解析的。\n\n> **注意。** $z^2$ 的虚部是 $2xy$，所以 $k$ 是 $x^2 - y^2$ 系数的两倍。第二个方程带有负号 $u_y = -v_x$，也必须检验。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(2, 20);
          const q = rng.int(1, 9);
          return worked(
            [
              `For which $k$ is $f = ${p}(x^2 - y^2) + ${q} + ikxy$ analytic?`,
              `当 $k$ 为何值时，$f = ${p}(x^2 - y^2) + ${q} + ikxy$ 解析？`,
            ],
            2 * p,
            [
              [p, "That forgets that $z^2$ has imaginary part $2xy$, not $xy$.", "那忘了 $z^2$ 的虚部是 $2xy$，而不是 $xy$。"],
              [-2 * p, "That uses $u_y = v_x$; the second equation is $u_y = -v_x$.", "那用了 $u_y = v_x$；第二个方程是 $u_y = -v_x$。"],
              [2, `That drops the factor ${p}.`, `那丢掉了因子 ${p}。`],
            ],
            [
              [
                ["First equation", "第一个方程"],
                [`$u_x = ${2 * p}x$ and $v_y = kx$, so $k = ${2 * p}$.`, `$u_x = ${2 * p}x$，$v_y = kx$，所以 $k = ${2 * p}$。`],
              ],
              [
                ["Second equation", "第二个方程"],
                [
                  `$u_y = -${2 * p}y$ and $-v_x = -ky = -${2 * p}y$, which agree.`,
                  `$u_y = -${2 * p}y$，$-v_x = -ky = -${2 * p}y$，两者一致。`,
                ],
              ],
            ],
            [
              `With $k = ${2 * p}$, $f = ${p}(x^2 - y^2 + 2ixy) + ${q} = ${p}z^2 + ${q}$, a polynomial in $z$, which is analytic.`,
              `取 $k = ${2 * p}$，$f = ${p}(x^2 - y^2 + 2ixy) + ${q} = ${p}z^2 + ${q}$，这是 $z$ 的多项式，是解析的。`,
            ],
          );
        }),
    ),
    point(
      "a-derivative-from-partials",
      ["A derivative from partial derivatives", "由偏导数求导数"],
      [
        "When a function is analytic, its derivative can be read from the partial derivatives: $f' = u_x + iv_x$. For $u = x^2 - y^2$ and $v = 2xy$, $u_x = 2x$ and $v_x = 2y$, so at $1 + 2i$ the derivative is $2 + 4i$.\n\nCheck: by the equations $v_x = -u_y$, so $f' = u_x - iu_y = 2x + 2yi$ as well; and $f = z^2$ has $f' = 2z = 2 + 4i$.\n\n> **Watch out.** Both partial derivatives are taken in $x$. Using $u_x + iu_y$ gets the sign of the imaginary part wrong: the correct form is $u_x - iu_y$.",
        "函数解析时，它的导数可以从偏导数读出：$f' = u_x + iv_x$。对 $u = x^2 - y^2$，$v = 2xy$，$u_x = 2x$，$v_x = 2y$，所以在 $1 + 2i$ 处导数是 $2 + 4i$。\n\n检验：由方程 $v_x = -u_y$，所以也有 $f' = u_x - iu_y = 2x + 2yi$；而 $f = z^2$ 有 $f' = 2z = 2 + 4i$。\n\n> **注意。** 两个偏导数都是对 $x$ 求的。用 $u_x + iu_y$ 会把虚部的符号弄错：正确的形式是 $u_x - iu_y$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(1, 6);
          const a = rng.int(-6, 6);
          const b = rng.pick(nonzero);
          const real = rng.bool();
          const [en, zh] = part(real);
          const u = coefficient(p, "(x^2 - y^2)");
          const v = `${2 * p}xy`;
          const [re, im] = [2 * p * a, 2 * p * b];
          const misses: Miss[] = real
            ? [
                [im, "That is the imaginary part.", "那是虚部。"],
                [p * a, "That differentiates $x^2$ to $x$; its derivative is $2x$.", "那把 $x^2$ 的导数算成了 $x$；它的导数是 $2x$。"],
                [
                  p * a * a - p * b * b,
                  "That evaluates $u$ itself instead of its derivative $u_x$.",
                  "那算的是 $u$ 本身，而不是它的导数 $u_x$。",
                ],
              ]
            : [
                [re, "That is the real part.", "那是实部。"],
                [
                  -im,
                  "That uses $u_x + iu_y$; the derivative is $u_x - iu_y$, or $u_x + iv_x$.",
                  "那用了 $u_x + iu_y$；导数是 $u_x - iu_y$，即 $u_x + iv_x$。",
                ],
                [2 * p * a * b, "That evaluates $v$ itself instead of its derivative $v_x$.", "那算的是 $v$ 本身，而不是它的导数 $v_x$。"],
              ];
          return worked(
            [
              `Let $u = ${u}$ and $v = ${v}$. What is the ${en} part of $f'$ at $${complex(a, b)}$?`,
              `设 $u = ${u}$，$v = ${v}$。$f'$ 在 $${complex(a, b)}$ 处的${zh}是多少？`,
            ],
            real ? re : im,
            misses,
            [
              [
                ["Take the x derivatives", "对 x 求偏导"],
                [`$u_x = ${2 * p}x$ and $v_x = ${2 * p}y$.`, `$u_x = ${2 * p}x$，$v_x = ${2 * p}y$。`],
              ],
              [
                ["Evaluate", "代入"],
                [
                  `$f' = u_x + iv_x = ${complex(re, im)}$ at $x = ${a}$, $y = ${b}$, so the ${en} part is ${real ? re : im}.`,
                  `在 $x = ${a}$，$y = ${b}$ 处 $f' = u_x + iv_x = ${complex(re, im)}$，所以${zh}是 ${real ? re : im}。`,
                ],
              ],
            ],
            [
              `$u + iv = ${coefficient(p, "z^2")}$, so $f' = ${2 * p}z = ${2 * p}(${complex(a, b)}) = ${complex(re, im)}$.`,
              `$u + iv = ${coefficient(p, "z^2")}$，所以 $f' = ${2 * p}z = ${2 * p}(${complex(a, b)}) = ${complex(re, im)}$。`,
            ],
          );
        }),
    ),
  ],
);

const harmonic = topic(
  "harmonic-functions-and-conjugates",
  ["Harmonic Functions and Conjugates", "调和函数和共轭调和函数"],
  ["Recognize harmonic functions, and recover the imaginary part from the real part.", "识别调和函数，并由实部求虚部。"],
  ["the-cauchy-riemann-equations", "higher-order-partial-derivatives"],
  [["the-cauchy-riemann-equations", 0.4]],
  [
    point(
      "making-a-function-harmonic",
      ["Making a function harmonic", "使函数调和"],
      [
        "A function $u$ is harmonic when $u_{xx} + u_{yy} = 0$. The real and imaginary parts of an analytic function are always harmonic, by differentiating the Cauchy–Riemann equations once more. For $u = 3x^2 + ky^2 + 5xy$: $u_{xx} = 6$ and $u_{yy} = 2k$, so $k = -3$.\n\nCheck: then $u = 3(x^2 - y^2) + 5xy$, the real part of $3z^2 - \\frac{5}{2}iz^2$, which is analytic.\n\n> **Watch out.** Differentiating $ky^2$ twice gives $2k$, not $k$. Terms like $xy$ and $x$ have zero second derivatives $u_{xx}$ and $u_{yy}$, so they do not affect $k$.",
        "如果 $u_{xx} + u_{yy} = 0$，函数 $u$ 就是调和的。把柯西–黎曼方程再求一次导，可知解析函数的实部和虚部总是调和的。对 $u = 3x^2 + ky^2 + 5xy$：$u_{xx} = 6$，$u_{yy} = 2k$，所以 $k = -3$。\n\n检验：这时 $u = 3(x^2 - y^2) + 5xy$，它是 $3z^2 - \\frac{5}{2}iz^2$ 的实部，而后者是解析的。\n\n> **注意。** $ky^2$ 求两次导得 $2k$，不是 $k$。$xy$ 和 $x$ 这样的项的二阶偏导 $u_{xx}$ 和 $u_{yy}$ 都是零，不影响 $k$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(1, 9);
          const q = rng.int(1, 9);
          const r = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 7, 9]);
          const answer = -p;
          return worked(
            [
              `For which $k$ is $u = ${coefficient(p, "x^2")} + ky^2${plus(r, "xy")} + ${coefficient(q, "x")}$ harmonic?`,
              `当 $k$ 为何值时，$u = ${coefficient(p, "x^2")} + ky^2${plus(r, "xy")} + ${coefficient(q, "x")}$ 是调和函数？`,
            ],
            answer,
            [
              [p, "That makes $u_{xx}$ and $u_{yy}$ equal; they must add to zero.", "那让 $u_{xx}$ 和 $u_{yy}$ 相等；它们的和必须为零。"],
              [
                -2 * p,
                "That takes $u_{yy}$ as $k$; differentiating $ky^2$ twice gives $2k$.",
                "那把 $u_{yy}$ 当成了 $k$；$ky^2$ 求两次导得 $2k$。",
              ],
              [
                -r,
                "That uses the $xy$ term, whose second derivatives in $x$ and in $y$ are zero.",
                "那用了 $xy$ 项，而它对 $x$ 和对 $y$ 的二阶偏导都是零。",
              ],
            ],
            [
              [
                ["Second derivative in x", "对 x 的二阶偏导"],
                [`$u_{xx} = ${2 * p}$.`, `$u_{xx} = ${2 * p}$。`],
              ],
              [
                ["Second derivative in y", "对 y 的二阶偏导"],
                [`$u_{yy} = 2k$; the terms in $xy$ and $x$ give nothing here.`, `$u_{yy} = 2k$；$xy$ 和 $x$ 的项在这里没有贡献。`],
              ],
              [
                ["Set the sum to zero", "令和为零"],
                [`$${2 * p} + 2k = 0$, so $k = ${answer}$.`, `$${2 * p} + 2k = 0$，所以 $k = ${answer}$。`],
              ],
            ],
            [
              `With $k = ${answer}$, $${coefficient(p, "(x^2 - y^2)")}$ is the real part of $${coefficient(p, "z^2")}$, $xy$ is the real part of $-\\frac{i}{2}z^2$ and $x$ is the real part of $z$, so $u$ is the real part of an analytic function.`,
              `取 $k = ${answer}$，$${coefficient(p, "(x^2 - y^2)")}$ 是 $${coefficient(p, "z^2")}$ 的实部，$xy$ 是 $-\\frac{i}{2}z^2$ 的实部，$x$ 是 $z$ 的实部，所以 $u$ 是解析函数的实部。`,
            ],
          );
        }),
    ),
    point(
      "finding-a-harmonic-conjugate",
      ["Finding a harmonic conjugate", "求共轭调和函数"],
      [
        "A harmonic conjugate of $u$ is a function $v$ that makes $u + iv$ analytic. It comes from integrating the Cauchy–Riemann equations, and it is unique up to an added constant. For $u = 2x + 5y$: $v_y = u_x = 2$ and $v_x = -u_y = -5$, so $v = 2y - 5x$, and with $v(0, 0) = 0$ we get $v(1, 1) = -3$.\n\nCheck: $(2 - 5i)(x + iy) = 2x + 5y + i(2y - 5x)$, so $u + iv = (2 - 5i)z$, which is analytic.\n\n> **Watch out.** The second equation has a minus sign: $v_x = -u_y$. Leaving it out gives $-v$, the conjugate of $-u$ instead.",
        "$u$ 的共轭调和函数是使 $u + iv$ 解析的函数 $v$。它通过积分柯西–黎曼方程得到，除了相差一个常数外是唯一的。对 $u = 2x + 5y$：$v_y = u_x = 2$，$v_x = -u_y = -5$，所以 $v = 2y - 5x$；由 $v(0, 0) = 0$ 得 $v(1, 1) = -3$。\n\n检验：$(2 - 5i)(x + iy) = 2x + 5y + i(2y - 5x)$，所以 $u + iv = (2 - 5i)z$，它是解析的。\n\n> **注意。** 第二个方程带负号：$v_x = -u_y$。漏掉它得到的是 $-v$，那是 $-u$ 的共轭。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 9);
          const b = rng.int(2, 9);
          const x0 = rng.pick(nonzero);
          const y0 = rng.pick(nonzero);
          const answer = a * y0 - b * x0;
          return worked(
            [
              `Let $u = ${a}x + ${b}y$, with harmonic conjugate $v$ and $v(0, 0) = 0$. What is $v(${x0}, ${y0})$?`,
              `设 $u = ${a}x + ${b}y$，它的共轭调和函数 $v$ 满足 $v(0, 0) = 0$。$v(${x0}, ${y0})$ 是多少？`,
            ],
            answer,
            [
              [a * x0 + b * y0, "That evaluates $u$ instead of its conjugate.", "那算的是 $u$，而不是它的共轭。"],
              [
                a * y0 + b * x0,
                "That uses $v_x = u_y$; the second equation is $v_x = -u_y$.",
                "那用了 $v_x = u_y$；第二个方程是 $v_x = -u_y$。",
              ],
              [
                -answer,
                "That gives $-v$: it swaps the roles of $x$ and $y$ in the equations.",
                "那得到的是 $-v$：它在方程中把 $x$ 和 $y$ 的角色弄反了。",
              ],
            ],
            [
              [
                ["Use the equations", "用方程"],
                [`$v_y = u_x = ${a}$ and $v_x = -u_y = -${b}$.`, `$v_y = u_x = ${a}$，$v_x = -u_y = -${b}$。`],
              ],
              [
                ["Integrate", "积分"],
                [`$v = ${a}y - ${b}x$, with no constant since $v(0, 0) = 0$.`, `$v = ${a}y - ${b}x$，因为 $v(0, 0) = 0$，没有常数项。`],
              ],
              [
                ["Evaluate", "代入"],
                [
                  `$v(${x0}, ${y0}) = ${a} \\cdot ${bracket(y0)} - ${b} \\cdot ${bracket(x0)} = ${answer}$.`,
                  `$v(${x0}, ${y0}) = ${a} \\cdot ${bracket(y0)} - ${b} \\cdot ${bracket(x0)} = ${answer}$。`,
                ],
              ],
            ],
            [
              `$u + iv = (${a} - ${b}i)z$, and at $z = ${complex(x0, y0)}$ this is $(${a} - ${b}i)(${complex(x0, y0)}) = ${complex(a * x0 + b * y0, answer)}$, whose imaginary part is ${answer}.`,
              `$u + iv = (${a} - ${b}i)z$，在 $z = ${complex(x0, y0)}$ 处为 $(${a} - ${b}i)(${complex(x0, y0)}) = ${complex(a * x0 + b * y0, answer)}$，其虚部是 ${answer}。`,
            ],
          );
        }),
    ),
  ],
);

const complexExponential = topic(
  "the-complex-exponential-function",
  ["The Complex Exponential Function", "复指数函数"],
  ["Evaluate the exponential at complex points, and use its period.", "在复数点计算指数函数，并利用它的周期。"],
  ["eulers-formula", "the-complex-derivative"],
  [["eulers-formula", 0.5]],
  [
    {
      ...point(
        "evaluating-the-exponential",
        ["Evaluating the exponential", "计算指数函数"],
        [
          "The exponential of $x + iy$ is $e^x(\\cos y + i\\sin y)$. Its modulus $e^x$ is set by the real part and its argument $y$ by the imaginary part. So the vertical line $x = 1$ goes to the circle $|w| = e$, and the horizontal line $y = \\frac{\\pi}{4}$ goes to the ray at angle $\\frac{\\pi}{4}$. For example, $e^{\\ln 3 + \\pi i} = 3(\\cos \\pi + i \\sin \\pi) = -3$.\n\nCheck: $e^{\\ln 3} \\cdot e^{\\pi i} = 3 \\cdot (-1) = -3$, using $e^{\\pi i} = -1$.\n\n> **Watch out.** The sign comes from the parity of the multiple of $\\pi$: odd multiples give $-1$ and even ones give $1$, whatever their sign. The modulus is $e^{\\ln 3} = 3$, not $\\ln 3$.",
          "$x + iy$ 的指数函数是 $e^x(\\cos y + i\\sin y)$。它的模 $e^x$ 由实部决定，辐角 $y$ 由虚部决定。所以竖直线 $x = 1$ 映到圆 $|w| = e$，水平线 $y = \\frac{\\pi}{4}$ 映到角为 $\\frac{\\pi}{4}$ 的射线。例如 $e^{\\ln 3 + \\pi i} = 3(\\cos \\pi + i \\sin \\pi) = -3$。\n\n检验：$e^{\\ln 3} \\cdot e^{\\pi i} = 3 \\cdot (-1) = -3$，用到 $e^{\\pi i} = -1$。\n\n> **注意。** 符号由 $\\pi$ 的倍数的奇偶决定：奇数倍给出 $-1$，偶数倍给出 $1$，与倍数的正负无关。模是 $e^{\\ln 3} = 3$，不是 $\\ln 3$。",
        ],
        (rng) =>
          until(() => {
            const r = rng.int(2, 15);
            const odd = rng.bool();
            const multiple = odd ? rng.pick([-5, -3, -1, 1, 3, 5]) : rng.pick([-6, -4, -2, 2, 4, 6]);
            const size = Math.abs(multiple) === 1 ? "" : `${Math.abs(multiple)}`;
            const exponent = `\\ln ${r} ${multiple < 0 ? "-" : "+"} ${size}\\pi i`;
            const answer = odd ? -r : r;
            const mpi = multiple === 1 ? "\\pi" : multiple === -1 ? "-\\pi" : `${multiple}\\pi`;
            return worked(
              [`What is the value of $e^{${exponent}}$?`, `$e^{${exponent}}$ 的值是多少？`],
              answer,
              [
                [
                  -answer,
                  `That uses the wrong parity: ${Math.abs(multiple)} is ${odd ? "odd" : "even"}, so $e^{${mpi} i} = ${odd ? -1 : 1}$.`,
                  `那用错了奇偶：${Math.abs(multiple)} 是${odd ? "奇数" : "偶数"}，所以 $e^{${mpi} i} = ${odd ? -1 : 1}$。`,
                ],
                [odd ? -1 : 1, `That drops the modulus $e^{\\ln ${r}} = ${r}$.`, `那丢掉了模 $e^{\\ln ${r}} = ${r}$。`],
              ],
              [
                [
                  ["Split the exponent", "拆开指数"],
                  [`$e^{${exponent}} = e^{\\ln ${r}} \\cdot e^{${mpi} i}$.`, `$e^{${exponent}} = e^{\\ln ${r}} \\cdot e^{${mpi} i}$。`],
                ],
                [
                  ["Find the modulus", "求模"],
                  [`$e^{\\ln ${r}} = ${r}$.`, `$e^{\\ln ${r}} = ${r}$。`],
                ],
                [
                  ["Find the direction", "求方向"],
                  [
                    `$\\cos(${mpi}) + i\\sin(${mpi}) = ${odd ? -1 : 1}$, so the value is $${answer}$.`,
                    `$\\cos(${mpi}) + i\\sin(${mpi}) = ${odd ? -1 : 1}$，所以值是 $${answer}$。`,
                  ],
                ],
              ],
              [
                `$e^{${mpi} i} = ${pw("(e^{\\pi i})", multiple)} = ${pw("(-1)", multiple)} = ${odd ? -1 : 1}$, and $${r} \\cdot ${bracket(odd ? -1 : 1)} = ${answer}$.`,
                `$e^{${mpi} i} = ${pw("(e^{\\pi i})", multiple)} = ${pw("(-1)", multiple)} = ${odd ? -1 : 1}$，而 $${r} \\cdot ${bracket(odd ? -1 : 1)} = ${answer}$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["the-complex-exponential-function#evaluating-the-exponential"],
    },
    point(
      "the-period-of-the-exponential",
      ["The period of the exponential", "指数函数的周期"],
      [
        "Unlike its real counterpart, the complex exponential is periodic, with period $2\\pi i$: $e^{z + 2\\pi i} = e^z e^{2\\pi i} = e^z$. So $e^{1 + 2i}$, $e^{1 + 2i + 2\\pi i}$ and $e^{1 + 2i - 4\\pi i}$ are all equal, and the solutions of $e^z = w$ are spaced along a vertical line.\n\nCheck: all three have real part 1, so modulus $e$, and their imaginary parts differ by whole turns of $2\\pi$, so the same argument.\n\n> **Watch out.** Adding an odd multiple of $\\pi i$ turns the value by half a turn and changes its sign. Adding a real number, even $2\\pi$, changes the modulus.",
        "与实指数函数不同，复指数函数是周期函数，周期是 $2\\pi i$：$e^{z + 2\\pi i} = e^z e^{2\\pi i} = e^z$。所以 $e^{1 + 2i}$、$e^{1 + 2i + 2\\pi i}$ 和 $e^{1 + 2i - 4\\pi i}$ 都相等，而 $e^z = w$ 的解沿一条竖直线排列。\n\n检验：三者的实部都是 1，所以模都是 $e$；它们的虚部相差 $2\\pi$ 的整数倍，所以辐角相同。\n\n> **注意。** 加上 $\\pi i$ 的奇数倍会把值转半圈，使它变号。加上实数，即使是 $2\\pi$，也会改变模。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(2, 9);
        const k = rng.pick([2, 3, 4, 5, 6]);
        const slips: Slip[] = [
          [
            same(`${a} + ${b}i + ${2 * k - 1}\\pi i`),
            `That adds an odd multiple of $\\pi i$, which multiplies the exponential by $e^{${2 * k - 1}\\pi i} = -1$.`,
            `那加上了 $\\pi i$ 的奇数倍，使指数函数乘以 $e^{${2 * k - 1}\\pi i} = -1$。`,
          ],
          [
            same(`${a} + ${2 * k}\\pi + ${b}i`),
            `That adds the real number $${2 * k}\\pi$, which multiplies the exponential by $e^{${2 * k}\\pi}$; the period is imaginary.`,
            `那加上了实数 $${2 * k}\\pi$，使指数函数乘以 $e^{${2 * k}\\pi}$；周期是纯虚数。`,
          ],
          [
            same(`${a} + ${b + 2 * k}i`),
            `That adds $${2 * k}i$ without the factor $\\pi$, which turns the value by ${2 * k} radians, not by whole turns.`,
            `那加上了 $${2 * k}i$ 而没有因子 $\\pi$，这会把值转 ${2 * k} 弧度，而不是整圈。`,
          ],
        ];
        return chosen(
          rng,
          [`Which of these has the same exponential as $${a} + ${b}i$?`, `下列哪个数的指数函数值与 $${a} + ${b}i$ 相同？`],
          same(`${a} + ${b}i + ${2 * k}\\pi i`),
          slips,
          [
            [
              ["Split the exponential", "拆开指数函数"],
              [`$e^{z + w} = e^z e^w$, so only $e^w$ for the added $w$ matters.`, `$e^{z + w} = e^z e^w$，所以只需看加上的 $w$ 的 $e^w$。`],
            ],
            [
              ["Use the period", "利用周期"],
              [
                `$e^{${2 * k}\\pi i} = \\cos(${2 * k}\\pi) + i\\sin(${2 * k}\\pi) = 1$, so adding $${2 * k}\\pi i$ changes nothing.`,
                `$e^{${2 * k}\\pi i} = \\cos(${2 * k}\\pi) + i\\sin(${2 * k}\\pi) = 1$，所以加上 $${2 * k}\\pi i$ 不改变任何东西。`,
              ],
            ],
          ],
          [
            `The chosen number has real part ${a}, so modulus $${pw("e", a)}$, and imaginary part $${b} + ${2 * k}\\pi$, which differs from ${b} by ${k} full turns, so the argument agrees too.`,
            `所选的数实部是 ${a}，所以模是 $${pw("e", a)}$；虚部是 $${b} + ${2 * k}\\pi$，与 ${b} 相差 ${k} 整圈，所以辐角也相同。`,
          ],
        );
      },
    ),
  ],
);

/** principalCases lists points on rays from the origin, with their principal argument as a multiple of pi. */
const principalCases: readonly {
  sx: number;
  sy: number;
  k: Q;
  unit: string;
  where: Pair;
}[] = [
  { sx: 1, sy: 1, k: Q.of(1, 4), unit: "\\left(\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)", where: ["first quadrant", "第一象限"] },
  {
    sx: -1,
    sy: 1,
    k: Q.of(3, 4),
    unit: "\\left(-\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2}\\right)",
    where: ["second quadrant", "第二象限"],
  },
  {
    sx: -1,
    sy: -1,
    k: Q.of(-3, 4),
    unit: "\\left(-\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)",
    where: ["third quadrant", "第三象限"],
  },
  {
    sx: 1,
    sy: -1,
    k: Q.of(-1, 4),
    unit: "\\left(\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2}\\right)",
    where: ["fourth quadrant", "第四象限"],
  },
  { sx: 0, sy: 1, k: Q.of(1, 2), unit: "(0, 1)", where: ["positive imaginary axis", "正虚轴"] },
  { sx: 0, sy: -1, k: Q.of(-1, 2), unit: "(0, -1)", where: ["negative imaginary axis", "负虚轴"] },
  { sx: -1, sy: 0, k: Q.of(1), unit: "(-1, 0)", where: ["negative real axis", "负实轴"] },
];

const complexLog = topic(
  "the-complex-logarithm",
  ["The Complex Logarithm", "复对数"],
  ["Find the principal logarithm, and see why it needs a branch.", "求主值对数，并了解为什么需要分支。"],
  ["the-complex-exponential-function"],
  [],
  [
    point(
      "the-principal-argument-in-a-logarithm",
      ["The imaginary part of the logarithm", "对数的虚部"],
      [
        "The logarithm of $z$ is $\\log z = \\ln|z| + i\\arg z$. The argument has many values, so a choice is made: the principal logarithm takes the argument in $(-\\pi, \\pi]$. For $-2 - 2i$, in the third quadrant, the reference angle is $\\frac{\\pi}{4}$, and the principal argument is $-\\frac{3\\pi}{4}$, so the imaginary part of $\\operatorname{Log}(-2 - 2i)$ is $-\\frac{3\\pi}{4}$.\n\nCheck: $\\cos(-\\frac{3\\pi}{4})$ and $\\sin(-\\frac{3\\pi}{4})$ are both $-\\frac{\\sqrt{2}}{2}$, negative like both parts of $-2 - 2i$.\n\n> **Watch out.** $\\arctan\\frac{y}{x}$ gives $\\frac{\\pi}{4}$ here, the angle of $2 + 2i$, since it cannot see the quadrant. The value $\\frac{5\\pi}{4}$ is also an argument, but it lies outside $(-\\pi, \\pi]$.",
        "$z$ 的对数是 $\\log z = \\ln|z| + i\\arg z$。辐角有多个值，所以要作出选择：主值对数取 $(-\\pi, \\pi]$ 中的辐角。对第三象限的 $-2 - 2i$，参考角是 $\\frac{\\pi}{4}$，主辐角是 $-\\frac{3\\pi}{4}$，所以 $\\operatorname{Log}(-2 - 2i)$ 的虚部是 $-\\frac{3\\pi}{4}$。\n\n检验：$\\cos(-\\frac{3\\pi}{4})$ 和 $\\sin(-\\frac{3\\pi}{4})$ 都是 $-\\frac{\\sqrt{2}}{2}$，与 $-2 - 2i$ 的两个部分一样都是负的。\n\n> **注意。** $\\arctan\\frac{y}{x}$ 在这里给出 $\\frac{\\pi}{4}$，那是 $2 + 2i$ 的角，因为它看不出象限。$\\frac{5\\pi}{4}$ 也是一个辐角，但它不在 $(-\\pi, \\pi]$ 内。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 30);
          const { sx, sy, k, unit, where } = rng.pick(principalCases) as (typeof principalCases)[number];
          const value = complex(sx * a, sy * a);
          const misses: Miss[] = [
            [
              k.add(Q.of(k.sign() < 0 ? 2 : -2)),
              "That is another argument of the point, but it lies outside the principal range $(-\\pi, \\pi]$.",
              "那是这个点的另一个辐角，但它不在主值范围 $(-\\pi, \\pi]$ 内。",
            ],
            [
              k.mul(Q.of(-1)),
              "That is the argument of the conjugate; check the sign of the imaginary part.",
              "那是共轭的辐角；要看虚部的符号。",
            ],
          ];
          if (sx === -1 && sy !== 0)
            misses.push([
              k.add(Q.of(k.sign() < 0 ? 1 : -1)),
              "That is $\\arctan\\frac{y}{x}$, which cannot tell this quadrant from the opposite one.",
              "那是 $\\arctan\\frac{y}{x}$，它分不清这个象限和相对的象限。",
            ]);
          return worked(
            [
              `The imaginary part of the principal logarithm of $${value}$ is $k\\pi$. What is $k$?`,
              `$${value}$ 的主值对数的虚部是 $k\\pi$。$k$ 是多少？`,
            ],
            k,
            misses,
            [
              [
                ["Locate the point", "确定位置"],
                [`$${value}$ lies ${sx !== 0 && sy !== 0 ? "in" : "on"} the ${where[0]}.`, `$${value}$ 位于${where[1]}。`],
              ],
              [
                ["Take the principal angle", "取主值角"],
                [
                  `The angle in $(-\\pi, \\pi]$ pointing there is $${k.toLatex()}\\pi$; the distance ${a} from the origin does not change it.`,
                  `在 $(-\\pi, \\pi]$ 中指向那里的角是 $${k.toLatex()}\\pi$；到原点的距离 ${a} 不影响它。`,
                ],
              ],
            ],
            [
              `The unit vector at angle $${k.toLatex()}\\pi$ is $${unit}$, whose signs match those of $${value}$.`,
              `角为 $${k.toLatex()}\\pi$ 的单位向量是 $${unit}$，它的符号与 $${value}$ 的相同。`,
            ],
          );
        }),
    ),
    point(
      "the-real-part-of-the-logarithm",
      ["The real part of the logarithm", "对数的实部"],
      [
        "The real part of $\\log z$ is $\\ln |z|$, and it is the same for every branch, since branches differ only by multiples of $2\\pi i$. For $6 + 8i$, $|z| = \\sqrt{36 + 64} = 10$, so the real part of the logarithm is $\\ln 10$.\n\nCheck: $6 + 8i = 2(3 + 4i)$ and $|3 + 4i| = 5$, so $|z| = 2 \\cdot 5 = 10$.\n\n> **Watch out.** The modulus needs the square root of the sum of squares: adding the parts gives 14, and forgetting the root gives 100, the square of the modulus.",
        "$\\log z$ 的实部是 $\\ln |z|$，它对每个分支都相同，因为不同分支只相差 $2\\pi i$ 的倍数。对 $6 + 8i$，$|z| = \\sqrt{36 + 64} = 10$，所以对数的实部是 $\\ln 10$。\n\n检验：$6 + 8i = 2(3 + 4i)$，而 $|3 + 4i| = 5$，所以 $|z| = 2 \\cdot 5 = 10$。\n\n> **注意。** 模要对平方和开平方根：把两个部分相加得 14，忘了开方得 100，那是模的平方。",
      ],
      (rng) =>
        until(() => {
          const s = rng.int(1, 4);
          const { a, b, r } = signedTriple(rng);
          const answer = s * r;
          const z = complex(s * a, s * b);
          return worked(
            [`The real part of the logarithm of $${z}$ equals $\\ln m$. What is $m$?`, `$${z}$ 的对数的实部等于 $\\ln m$。$m$ 是多少？`],
            answer,
            [
              [
                s * (Math.abs(a) + Math.abs(b)),
                "That adds the sizes of the parts; the modulus is the square root of the sum of their squares.",
                "那把两个部分的大小相加了；模是它们平方和的平方根。",
              ],
              [answer * answer, "That forgets the square root, giving the square of the modulus.", "那忘了开平方根，得到的是模的平方。"],
              [s * Math.abs(a), "That uses only the real part.", "那只用了实部。"],
            ],
            [
              [
                ["Find the modulus", "求模"],
                [
                  `$|${z}| = \\sqrt{${s * s * a * a} + ${s * s * b * b}} = \\sqrt{${answer * answer}} = ${answer}$.`,
                  `$|${z}| = \\sqrt{${s * s * a * a} + ${s * s * b * b}} = \\sqrt{${answer * answer}} = ${answer}$。`,
                ],
              ],
              [
                ["Take the logarithm", "取对数"],
                [`The real part is $\\ln ${answer}$, so $m = ${answer}$.`, `实部是 $\\ln ${answer}$，所以 $m = ${answer}$。`],
              ],
            ],
            s === 1
              ? [
                  `$${bracket(a)}^2 + ${bracket(b)}^2 = ${r * r}$, and $\\sqrt{${r * r}} = ${r}$ since $${r} \\cdot ${r} = ${r * r}$.`,
                  `$${bracket(a)}^2 + ${bracket(b)}^2 = ${r * r}$，而 $${r} \\cdot ${r} = ${r * r}$，所以 $\\sqrt{${r * r}} = ${r}$。`,
                ]
              : [
                  `$${z} = ${s}(${complex(a, b)})$ and $|${complex(a, b)}| = ${r}$, so $|z| = ${s} \\cdot ${r} = ${answer}$.`,
                  `$${z} = ${s}(${complex(a, b)})$，而 $|${complex(a, b)}| = ${r}$，所以 $|z| = ${s} \\cdot ${r} = ${answer}$。`,
                ],
          );
        }),
    ),
  ],
);

const contourIntegrals = topic(
  "contour-integrals",
  ["Contour Integrals", "围道积分"],
  ["Integrate along a path by parametrizing it.", "把路径参数化后沿路径积分。"],
  ["the-complex-derivative", "line-integrals-of-scalar-functions"],
  [],
  [
    {
      ...point(
        "the-conjugate-around-a-circle",
        ["The conjugate around a circle", "共轭沿圆周积分"],
        [
          "A contour integral is computed by parametrizing the path, writing $z$ and $dz$ in terms of a real variable, and integrating over its range. Take $r = 2$: on $z = 2e^{it}$, $\\bar{z} = 2e^{-it}$ turns the opposite way and $dz = 2ie^{it}\\,dt$, so $\\bar{z}\\,dz = 4i\\,dt$, a constant. Over $0 \\le t \\le 2\\pi$ the integral is $2\\pi i \\cdot 2^2 = 8\\pi i$.\n\nCheck: on the circle $\\bar{z} = \\frac{r^2}{z} = \\frac{4}{z}$, and $\\oint \\frac{dz}{z} = 2\\pi i$, so the integral is $4 \\cdot 2\\pi i = 8\\pi i$.\n\n> **Watch out.** The conjugate is not analytic, so Cauchy's theorem does not make the integral 0. The result grows with the square of the radius, not with the radius.",
          "围道积分通过把路径参数化来计算：把 $z$ 和 $dz$ 用实变量表示，再在其范围内积分。取 $r = 2$：在 $z = 2e^{it}$ 上，$\\bar{z} = 2e^{-it}$ 反方向转动，$dz = 2ie^{it}\\,dt$，所以 $\\bar{z}\\,dz = 4i\\,dt$ 是常数。在 $0 \\le t \\le 2\\pi$ 上积分得 $2\\pi i \\cdot 2^2 = 8\\pi i$。\n\n检验：在圆周上 $\\bar{z} = \\frac{r^2}{z} = \\frac{4}{z}$，而 $\\oint \\frac{dz}{z} = 2\\pi i$，所以积分是 $4 \\cdot 2\\pi i = 8\\pi i$。\n\n> **注意。** 共轭不是解析函数，所以柯西定理不能使积分为 0。结果随半径的平方增长，而不是随半径增长。",
        ],
        (rng) =>
          until(() => {
            const r = rng.int(2, 13);
            const c = rng.int(2, 10);
            const answer = 2 * c * r * r;
            return worked(
              [
                `The integral of $${c}\\bar{z}$ once counterclockwise around $|z| = ${r}$ is $k\\pi i$. What is $k$?`,
                `$${c}\\bar{z}$ 沿 $|z| = ${r}$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
              ],
              answer,
              [
                [0, "That applies Cauchy's theorem, but the conjugate is not analytic.", "那用了柯西定理，但共轭不是解析函数。"],
                [
                  2 * c * r,
                  "That uses the radius once; $\\bar{z}$ and $dz$ each bring a factor $r$.",
                  "那只用了一次半径；$\\bar{z}$ 和 $dz$ 各带来一个因子 $r$。",
                ],
                [
                  c * r * r,
                  "That integrates over half a turn; a full turn has length $2\\pi$ in $t$.",
                  "那只积了半圈；一整圈的 $t$ 长度是 $2\\pi$。",
                ],
              ],
              [
                [
                  ["Parametrize", "参数化"],
                  [
                    `$z = ${r}e^{it}$, $\\bar{z} = ${r}e^{-it}$ and $dz = ${r}ie^{it}\\,dt$ for $0 \\le t \\le 2\\pi$.`,
                    `$z = ${r}e^{it}$，$\\bar{z} = ${r}e^{-it}$，$dz = ${r}ie^{it}\\,dt$，$0 \\le t \\le 2\\pi$。`,
                  ],
                ],
                [
                  ["Multiply", "相乘"],
                  [
                    `$${c}\\bar{z}\\,dz = ${c} \\cdot ${r * r}i\\,dt = ${c * r * r}i\\,dt$, a constant.`,
                    `$${c}\\bar{z}\\,dz = ${c} \\cdot ${r * r}i\\,dt = ${c * r * r}i\\,dt$，是常数。`,
                  ],
                ],
                [
                  ["Integrate", "积分"],
                  [
                    `$${c * r * r}i \\cdot 2\\pi = ${answer}\\pi i$, so $k = ${answer}$.`,
                    `$${c * r * r}i \\cdot 2\\pi = ${answer}\\pi i$，所以 $k = ${answer}$。`,
                  ],
                ],
              ],
              [
                `On the circle $\\bar{z} = \\frac{${r * r}}{z}$, so the integral is $${c} \\cdot ${r * r} \\oint \\frac{dz}{z} = ${c * r * r} \\cdot 2\\pi i = ${answer}\\pi i$.`,
                `在圆周上 $\\bar{z} = \\frac{${r * r}}{z}$，所以积分是 $${c} \\cdot ${r * r} \\oint \\frac{dz}{z} = ${c * r * r} \\cdot 2\\pi i = ${answer}\\pi i$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["contour-integrals#the-conjugate-around-a-circle"],
    },
    point(
      "integrating-along-a-segment",
      ["Integrating along a segment", "沿线段积分"],
      [
        "For a segment from 0 to a point $w$, a parametrization is $z = tw$ with $0 \\le t \\le 1$, so $dz = w\\,dt$. Then $\\int z\\,dz = \\int_0^1 tw \\cdot w\\,dt = \\frac{w^2}{2}$. For $w = 1 + 2i$, $w^2 = -3 + 4i$, so the integral is $-\\frac{3}{2} + 2i$.\n\nCheck: $\\frac{z^2}{2}$ is an antiderivative of $z$, and $\\frac{w^2}{2} - 0 = -\\frac{3}{2} + 2i$.\n\n> **Watch out.** The answer is half the square of the end point, not the square. And $w^2$ is a complex square: its real part is $a^2 - b^2$, not $a^2 + b^2$, which belongs to $\\bar{z}$.",
        "对从 0 到点 $w$ 的线段，参数化为 $z = tw$，$0 \\le t \\le 1$，所以 $dz = w\\,dt$。于是 $\\int z\\,dz = \\int_0^1 tw \\cdot w\\,dt = \\frac{w^2}{2}$。对 $w = 1 + 2i$，$w^2 = -3 + 4i$，所以积分是 $-\\frac{3}{2} + 2i$。\n\n检验：$\\frac{z^2}{2}$ 是 $z$ 的原函数，而 $\\frac{w^2}{2} - 0 = -\\frac{3}{2} + 2i$。\n\n> **注意。** 答案是终点平方的一半，不是平方本身。$w^2$ 是复数的平方：它的实部是 $a^2 - b^2$，不是 $a^2 + b^2$，后者属于 $\\bar{z}$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => Math.abs(v) !== Math.abs(a)));
          const real = rng.bool();
          const [en, zh] = part(real);
          const [u, v] = [a * a - b * b, 2 * a * b];
          const answer = real ? Q.of(u, 2) : Q.of(v, 2);
          const misses: Miss[] = real
            ? [
                [Q.of(u), "That forgets the factor $\\frac{1}{2}$ from integrating $t$.", "那漏掉了积分 $t$ 得到的因子 $\\frac{1}{2}$。"],
                [
                  Q.of(a * a + b * b, 2),
                  "That is the integral of $\\bar{z}$, which gives $\\frac{|w|^2}{2}$.",
                  "那是 $\\bar{z}$ 的积分，给出 $\\frac{|w|^2}{2}$。",
                ],
                [Q.of(v, 2), "That is the imaginary part.", "那是虚部。"],
              ]
            : [
                [Q.of(v), "That forgets the factor $\\frac{1}{2}$ from integrating $t$.", "那漏掉了积分 $t$ 得到的因子 $\\frac{1}{2}$。"],
                [Q.of(a * b, 2), "That forgets the 2 in the cross term $2ab$ of the square.", "那漏掉了平方中交叉项 $2ab$ 的 2。"],
                [Q.of(u, 2), "That is the real part.", "那是实部。"],
              ];
          return worked(
            [
              `What is the ${en} part of the integral of $z$ along the segment from 0 to $${complex(a, b)}$?`,
              `$z$ 沿从 0 到 $${complex(a, b)}$ 的线段积分，结果的${zh}是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Parametrize", "参数化"],
                [
                  `$z = t(${complex(a, b)})$ and $dz = (${complex(a, b)})\\,dt$ for $0 \\le t \\le 1$.`,
                  `$z = t(${complex(a, b)})$，$dz = (${complex(a, b)})\\,dt$，$0 \\le t \\le 1$。`,
                ],
              ],
              [
                ["Integrate", "积分"],
                [
                  `$\\int_0^1 t(${complex(a, b)})^2\\,dt = \\frac{(${complex(a, b)})^2}{2} = \\frac{${complex(u, v)}}{2}$.`,
                  `$\\int_0^1 t(${complex(a, b)})^2\\,dt = \\frac{(${complex(a, b)})^2}{2} = \\frac{${complex(u, v)}}{2}$。`,
                ],
              ],
              [
                ["Read the part", "读出所求部分"],
                [`The ${en} part is $${answer.toLatex()}$.`, `${zh}是 $${answer.toLatex()}$。`],
              ],
            ],
            [
              `$\\frac{z^2}{2}$ is an antiderivative of $z$, so the integral is $\\frac{(${complex(a, b)})^2}{2} - \\frac{0^2}{2}$, the same value.`,
              `$\\frac{z^2}{2}$ 是 $z$ 的原函数，所以积分是 $\\frac{(${complex(a, b)})^2}{2} - \\frac{0^2}{2}$，结果相同。`,
            ],
          );
        }),
    ),
  ],
);

const cauchyTheorem = topic(
  "cauchys-integral-theorem",
  ["Cauchy's Integral Theorem", "柯西积分定理"],
  ["Decide whether a closed contour integral vanishes, and use antiderivatives.", "判断闭围道积分是否为零，并使用原函数。"],
  ["contour-integrals"],
  [["contour-integrals", 0.3]],
  [
    {
      ...point(
        "whether-a-pole-is-enclosed",
        ["Whether a pole is enclosed", "极点是否被包围"],
        [
          "Cauchy's theorem says that the integral around a closed path vanishes when the function is analytic on and inside the path. For $\\frac{c}{z - a}$ around a circle, everything depends on where $a$ lies. If $a$ is inside, the integral is $2\\pi ic$; if $a$ is outside, the function is analytic inside and the integral is 0. So $\\frac{3}{z - 1}$ around $|z| = 2$ gives $6\\pi i$, and around $|z| = \\frac{1}{2}$ gives 0.\n\nCheck: shrinking the circle to $z = 1 + \\varepsilon e^{it}$ gives $\\int_0^{2\\pi} \\frac{3}{\\varepsilon e^{it}} \\cdot i\\varepsilon e^{it}\\,dt = 6\\pi i$.\n\n> **Watch out.** Compare the distance $|a|$ with the radius: a pole at $-3$ lies outside $|z| = 2$ even though $-3 < 2$. Inside, the result is $2\\pi i$ times $c$, not $c$ alone.",
          "柯西定理说，如果函数在闭路径上及其内部解析，那么沿这条路径的积分为零。对 $\\frac{c}{z - a}$ 沿圆周的积分，一切取决于 $a$ 的位置。$a$ 在里面时，积分是 $2\\pi ic$；$a$ 在外面时，函数在内部解析，积分为 0。所以 $\\frac{3}{z - 1}$ 沿 $|z| = 2$ 得 $6\\pi i$，沿 $|z| = \\frac{1}{2}$ 得 0。\n\n检验：把圆缩到 $z = 1 + \\varepsilon e^{it}$，得 $\\int_0^{2\\pi} \\frac{3}{\\varepsilon e^{it}} \\cdot i\\varepsilon e^{it}\\,dt = 6\\pi i$。\n\n> **注意。** 要比较距离 $|a|$ 和半径：$-3$ 处的极点在 $|z| = 2$ 外面，尽管 $-3 < 2$。在里面时，结果是 $2\\pi i$ 乘 $c$，不是 $c$ 本身。",
        ],
        (rng) =>
          until(() => {
            const c = rng.int(1, 12);
            const r = rng.int(2, 9);
            const inside = rng.bool();
            const a = inside ? rng.int(-(r - 1), r - 1) : rng.pick([r + rng.int(1, 5), -r - rng.int(1, 5)]);
            const answer = inside ? 2 * c : 0;
            const misses: Miss[] = inside
              ? [
                  [0, "That applies Cauchy's theorem, but the pole lies inside the circle.", "那用了柯西定理，但极点在圆内。"],
                  [c, "That forgets the 2 of $2\\pi i$.", "那漏掉了 $2\\pi i$ 中的 2。"],
                ]
              : [
                  [
                    2 * c,
                    `That counts the pole, but $|${a}| = ${Math.abs(a)} > ${r}$ puts it outside.`,
                    `那算上了极点，但 $|${a}| = ${Math.abs(a)} > ${r}$，它在圆外。`,
                  ],
                  [
                    -2 * c,
                    "That counts the pole and reverses the orientation; the pole is outside, so nothing counts.",
                    "那算上了极点并把方向弄反了；极点在圆外，什么都不算。",
                  ],
                ];
            return worked(
              [
                `The integral of $\\frac{${c}}{${minus("z", a)}}$ once counterclockwise around $|z| = ${r}$ is $k\\pi i$. What is $k$?`,
                `$\\frac{${c}}{${minus("z", a)}}$ 沿 $|z| = ${r}$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
              ],
              answer,
              misses,
              [
                [
                  ["Locate the pole", "确定极点位置"],
                  [
                    `The pole is at $${a}$, with $|${a}| = ${Math.abs(a)} ${inside ? "<" : ">"} ${r}$, so it is ${inside ? "inside" : "outside"} the circle.`,
                    `极点在 $${a}$，$|${a}| = ${Math.abs(a)} ${inside ? "<" : ">"} ${r}$，所以它在圆${inside ? "内" : "外"}。`,
                  ],
                ],
                inside
                  ? [
                      ["Use the basic integral", "用基本积分"],
                      [
                        `$\\oint \\frac{dz}{${minus("z", a)}} = 2\\pi i$, so the integral is $${c} \\cdot 2\\pi i = ${answer}\\pi i$.`,
                        `$\\oint \\frac{dz}{${minus("z", a)}} = 2\\pi i$，所以积分是 $${c} \\cdot 2\\pi i = ${answer}\\pi i$。`,
                      ],
                    ]
                  : [
                      ["Apply Cauchy's theorem", "用柯西定理"],
                      [
                        "The function is analytic on and inside the circle, so the integral is 0.",
                        "函数在圆周上及其内部解析，所以积分为 0。",
                      ],
                    ],
              ],
              inside
                ? [
                    `Shrinking the circle to $z = ${a} + \\varepsilon e^{it}$ leaves $\\int_0^{2\\pi} ${c}i\\,dt = ${answer}\\pi i$.`,
                    `把圆缩到 $z = ${a} + \\varepsilon e^{it}$，剩下 $\\int_0^{2\\pi} ${c}i\\,dt = ${answer}\\pi i$。`,
                  ]
                : [
                    `On the disc $|z| < ${Math.abs(a)}$, $${c}\\log(${minus("z", a)})$ has a single-valued branch and is an antiderivative, so the closed integral is 0.`,
                    `在圆盘 $|z| < ${Math.abs(a)}$ 上，$${c}\\log(${minus("z", a)})$ 有单值分支，是原函数，所以闭路积分为 0。`,
                  ],
            );
          }),
      ),
      figure: complexDrawings1["cauchys-integral-theorem#whether-a-pole-is-enclosed"],
    },
    point(
      "using-an-antiderivative",
      ["Using an antiderivative", "使用原函数"],
      [
        "When an analytic function has an antiderivative $F$ on a region, the integral along any path in it depends only on the end points: it is $F(\\text{end}) - F(\\text{start})$. For $2z + 3$ from $1$ to $2$, $F(z) = z^2 + 3z$ gives $F(2) - F(1) = 10 - 4 = 6$, whatever path is taken.\n\nCheck: along the real segment, $\\int_1^2 (2x + 3)\\,dx = [x^2 + 3x]_1^2 = 6$.\n\n> **Watch out.** Subtract in the order end minus start. And the constant term integrates to $3z$; it does not disappear. The rule fails for $\\frac{1}{z}$ around the origin, which has no single-valued antiderivative there.",
        "解析函数在区域上有原函数 $F$ 时，沿区域内任何路径的积分只取决于端点：它等于 $F(\\text{终点}) - F(\\text{起点})$。对 $2z + 3$ 从 $1$ 到 $2$，$F(z) = z^2 + 3z$ 给出 $F(2) - F(1) = 10 - 4 = 6$，与路径无关。\n\n检验：沿实轴线段，$\\int_1^2 (2x + 3)\\,dx = [x^2 + 3x]_1^2 = 6$。\n\n> **注意。** 要按终点减起点的顺序相减。常数项积分得 $3z$，不会消失。对原点周围的 $\\frac{1}{z}$，这个法则不成立，因为那里没有单值的原函数。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(1, 5);
          const c = rng.int(1, 9);
          const a = rng.int(-5, 4);
          const b = a + rng.int(1, 6);
          const F = (z: number) => p * z * z + c * z;
          const answer = F(b) - F(a);
          const Ftex = `${coefficient(p, "z^2")} + ${coefficient(c, "z")}`;
          return worked(
            [
              `The integral of $${2 * p}z + ${c}$ along any path from $${a}$ to $${b}$ has what value?`,
              `$${2 * p}z + ${c}$ 沿从 $${a}$ 到 $${b}$ 的任何路径积分，结果是多少？`,
            ],
            answer,
            [
              [
                p * (b * b - a * a),
                `That drops the constant ${c}, whose antiderivative is $${coefficient(c, "z")}$.`,
                `那丢掉了常数 ${c}，它的原函数是 $${coefficient(c, "z")}$。`,
              ],
              [
                2 * p * (b * b - a * a) + c * (b - a),
                `That forgets to halve when integrating $${2 * p}z$.`,
                `积分 $${2 * p}z$ 时那忘了除以 2。`,
              ],
              [-answer, "That subtracts in the wrong order, start minus end.", "那把相减的顺序弄反了，用了起点减终点。"],
            ],
            [
              [
                ["Find an antiderivative", "求原函数"],
                [`$F(z) = ${Ftex}$.`, `$F(z) = ${Ftex}$。`],
              ],
              [
                ["Evaluate at the ends", "代入端点"],
                [`$F(${b}) = ${F(b)}$ and $F(${a}) = ${F(a)}$.`, `$F(${b}) = ${F(b)}$，$F(${a}) = ${F(a)}$。`],
              ],
              [
                ["Subtract", "相减"],
                [`$${F(b)} - ${bracket(F(a))} = ${answer}$.`, `$${F(b)} - ${bracket(F(a))} = ${answer}$。`],
              ],
            ],
            [
              `Along the real segment, $\\int_{x = ${a}}^{x = ${b}} (${2 * p}x + ${c})\\,dx = ${p} \\cdot (${b * b} - ${a * a}) + ${c} \\cdot ${b - a} = ${answer}$.`,
              `沿实轴线段，$\\int_{x = ${a}}^{x = ${b}} (${2 * p}x + ${c})\\,dx = ${p} \\cdot (${b * b} - ${a * a}) + ${c} \\cdot ${b - a} = ${answer}$。`,
            ],
          );
        }),
    ),
  ],
);

const cauchyFormula = topic(
  "cauchys-integral-formula",
  ["Cauchy's Integral Formula", "柯西积分公式"],
  ["Recover values and derivatives of an analytic function from a contour integral.", "由围道积分求解析函数的值和导数。"],
  ["cauchys-integral-theorem"],
  [["cauchys-integral-theorem", 0.6]],
  [
    point(
      "the-value-from-the-formula",
      ["The value from the formula", "由公式得到函数值"],
      [
        "Cauchy's integral formula says that for $f$ analytic on and inside a contour around $a$, $\\oint \\frac{f(z)}{z - a}\\,dz = 2\\pi i f(a)$. So the values inside are fixed by the values on the contour. For $\\frac{z^2 + 1}{z - 2}$ around $|z| = 5$, $f(2) = 5$, so the integral is $10\\pi i$.\n\nCheck: $z^2 + 1 = (z - 2)^2 + 4(z - 2) + 5$, so the integrand is $(z - 2) + 4 + \\frac{5}{z - 2}$; the polynomial part integrates to 0 and the last term gives $5 \\cdot 2\\pi i$.\n\n> **Watch out.** Evaluate $f$ at the point $a$ where the denominator vanishes, not at the centre of the circle. The integrand has a pole inside, so Cauchy's theorem alone does not give 0.",
        "柯西积分公式说，若 $f$ 在包围 $a$ 的围道上及其内部解析，则 $\\oint \\frac{f(z)}{z - a}\\,dz = 2\\pi i f(a)$。所以内部的值由围道上的值决定。对 $\\frac{z^2 + 1}{z - 2}$ 沿 $|z| = 5$，$f(2) = 5$，所以积分是 $10\\pi i$。\n\n检验：$z^2 + 1 = (z - 2)^2 + 4(z - 2) + 5$，所以被积函数是 $(z - 2) + 4 + \\frac{5}{z - 2}$；多项式部分积分为 0，最后一项给出 $5 \\cdot 2\\pi i$。\n\n> **注意。** 要在分母为零的点 $a$ 处计算 $f$，而不是在圆心处。被积函数在内部有极点，所以单用柯西定理得不到 0。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([-3, -2, -1, 1, 2, 3]);
          const p = rng.int(1, 5);
          const q = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const value = p * a * a + q;
          const f = `${coefficient(p, "z^2")}${addend(q)}`;
          return worked(
            [
              `The integral of $\\frac{${f}}{${minus("z", a)}}$ once counterclockwise around $|z| = 5$ is $k\\pi i$. What is $k$?`,
              `$\\frac{${f}}{${minus("z", a)}}$ 沿 $|z| = 5$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
            ],
            2 * value,
            [
              [value, "That forgets the 2 of $2\\pi i$.", "那漏掉了 $2\\pi i$ 中的 2。"],
              [2 * q, "That evaluates $f$ at the centre 0 instead of at the pole.", "那在圆心 0 处计算 $f$，而不是在极点处。"],
              [0, "That applies Cauchy's theorem, but the integrand has a pole inside.", "那用了柯西定理，但被积函数在内部有极点。"],
            ],
            [
              [
                ["Identify f and a", "确定 f 和 a"],
                [`$f(z) = ${f}$ is analytic, and $a = ${a}$ lies inside $|z| = 5$.`, `$f(z) = ${f}$ 解析，$a = ${a}$ 在 $|z| = 5$ 内。`],
              ],
              [
                ["Evaluate", "求值"],
                [`$f(${a}) = ${p} \\cdot ${a * a}${addend(q)} = ${value}$.`, `$f(${a}) = ${p} \\cdot ${a * a}${addend(q)} = ${value}$。`],
              ],
              [
                ["Apply the formula", "用公式"],
                [
                  `The integral is $2\\pi i \\cdot ${bracket(value)}$, so $k = ${2 * value}$.`,
                  `积分是 $2\\pi i \\cdot ${bracket(value)}$，所以 $k = ${2 * value}$。`,
                ],
              ],
            ],
            [
              `Dividing, $\\frac{${f}}{${minus("z", a)}} = ${coefficient(p, "z")}${addend(p * a)} + \\frac{${value}}{${minus("z", a)}}$; the polynomial part integrates to 0, and the last term gives $${value} \\cdot 2\\pi i$.`,
              `作除法，$\\frac{${f}}{${minus("z", a)}} = ${coefficient(p, "z")}${addend(p * a)} + \\frac{${value}}{${minus("z", a)}}$；多项式部分积分为 0，最后一项给出 $${value} \\cdot 2\\pi i$。`,
            ],
          );
        }),
    ),
    point(
      "a-derivative-from-the-formula",
      ["A derivative from the formula", "由公式得到导数"],
      [
        "Differentiating under the integral sign extends the formula: $\\oint \\frac{f(z)}{(z - a)^{n + 1}}\\,dz = \\frac{2\\pi i}{n!} f^{(n)}(a)$. For the square, $n = 1$, so $\\oint \\frac{f(z)}{(z - a)^2}\\,dz = 2\\pi i f'(a)$. For $\\frac{z^3}{(z - 1)^2}$ around $|z| = 5$, $f'(z) = 3z^2$, $f'(1) = 3$, and the integral is $6\\pi i$.\n\nCheck: $z^3 = 1 + 3(z - 1) + 3(z - 1)^2 + (z - 1)^3$, so the coefficient of $\\frac{1}{z - 1}$ in $\\frac{z^3}{(z - 1)^2}$ is 3, and the integral is $3 \\cdot 2\\pi i$.\n\n> **Watch out.** The square in the denominator calls for the first derivative, with $1! = 1$, not the value $f(a)$ and not a factor $2!$.",
        "在积分号下求导，把公式推广为：$\\oint \\frac{f(z)}{(z - a)^{n + 1}}\\,dz = \\frac{2\\pi i}{n!} f^{(n)}(a)$。对平方，$n = 1$，所以 $\\oint \\frac{f(z)}{(z - a)^2}\\,dz = 2\\pi i f'(a)$。对 $\\frac{z^3}{(z - 1)^2}$ 沿 $|z| = 5$，$f'(z) = 3z^2$，$f'(1) = 3$，积分是 $6\\pi i$。\n\n检验：$z^3 = 1 + 3(z - 1) + 3(z - 1)^2 + (z - 1)^3$，所以 $\\frac{z^3}{(z - 1)^2}$ 中 $\\frac{1}{z - 1}$ 的系数是 3，积分是 $3 \\cdot 2\\pi i$。\n\n> **注意。** 分母是平方，对应一阶导数，$1! = 1$；既不是函数值 $f(a)$，也没有因子 $2!$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([-3, -2, -1, 1, 2, 3]);
          const p = rng.int(1, 4);
          const q = rng.int(1, 9);
          const derivative = 3 * p * a * a + q;
          const top = `${coefficient(p, "z^3")} + ${coefficient(q, "z")}`;
          return worked(
            [
              `The integral of $\\frac{${top}}{(${minus("z", a)})^2}$ once counterclockwise around $|z| = 5$ is $k\\pi i$. What is $k$?`,
              `$\\frac{${top}}{(${minus("z", a)})^2}$ 沿 $|z| = 5$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
            ],
            2 * derivative,
            [
              [derivative, "That forgets the 2 of $2\\pi i$.", "那漏掉了 $2\\pi i$ 中的 2。"],
              [
                2 * (p * a ** 3 + q * a),
                "That uses the value $f(a)$; the squared denominator calls for $f'(a)$.",
                "那用了函数值 $f(a)$；分母是平方，要用 $f'(a)$。",
              ],
              [
                4 * derivative,
                "That multiplies by $2!$; the first derivative comes with $1! = 1$.",
                "那乘了 $2!$；一阶导数对应的是 $1! = 1$。",
              ],
            ],
            [
              [
                ["Differentiate", "求导"],
                [`$f(z) = ${top}$, so $f'(z) = ${3 * p}z^2 + ${q}$.`, `$f(z) = ${top}$，所以 $f'(z) = ${3 * p}z^2 + ${q}$。`],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `$f'(${a}) = ${3 * p} \\cdot ${a * a} + ${q} = ${derivative}$.`,
                  `$f'(${a}) = ${3 * p} \\cdot ${a * a} + ${q} = ${derivative}$。`,
                ],
              ],
              [
                ["Apply the formula", "用公式"],
                [
                  `The integral is $2\\pi i \\cdot ${derivative}$, so $k = ${2 * derivative}$.`,
                  `积分是 $2\\pi i \\cdot ${derivative}$，所以 $k = ${2 * derivative}$。`,
                ],
              ],
            ],
            [
              `Expanding $f$ about $${a}$ gives $f(${a}) + f'(${a})(${minus("z", a)}) + \\dots$, and dividing by $(${minus("z", a)})^2$ makes $f'(${a}) = ${derivative}$ the coefficient of $\\frac{1}{${minus("z", a)}}$, the only term that survives integration.`,
              `把 $f$ 在 $${a}$ 处展开得 $f(${a}) + f'(${a})(${minus("z", a)}) + \\dots$，除以 $(${minus("z", a)})^2$ 后，$f'(${a}) = ${derivative}$ 是 $\\frac{1}{${minus("z", a)}}$ 的系数，也是积分后唯一留下的项。`,
            ],
          );
        }),
    ),
  ],
);

const estimates = topic(
  "cauchys-estimates-and-liouvilles-theorem",
  ["Cauchy's Estimates and Liouville's Theorem", "柯西估计和刘维尔定理"],
  ["Bound derivatives from a bound on a circle, and find a maximum modulus.", "由圆周上的界估计导数，并求最大模。"],
  ["cauchys-integral-formula"],
  [],
  [
    {
      ...point(
        "a-cauchy-estimate",
        ["A Cauchy estimate", "柯西估计"],
        [
          "If an analytic function is bounded by $M$ on a circle of radius $r$ about $a$, then $|f^{(n)}(a)| \\le \\frac{n!\\,M}{r^n}$. With $M = 10$, $r = 2$ and $n = 2$, the bound on $|f''(a)|$ is $\\frac{2 \\cdot 10}{4} = 5$. For an entire bounded function, $r$ can grow without limit, so $f' = 0$ everywhere and $f$ is constant: Liouville's theorem.\n\nCheck: $f(z) = \\frac{10(z - a)^2}{4}$ has $|f| = 10$ on the circle and $f'' = 5$, so the bound is reached.\n\n> **Watch out.** The radius is raised to the power $n$, and the factorial $n!$ stays in the numerator. A larger circle gives a better bound, provided $M$ still bounds $f$ on it.",
          "如果解析函数在以 $a$ 为中心、半径为 $r$ 的圆周上不超过 $M$，那么 $|f^{(n)}(a)| \\le \\frac{n!\\,M}{r^n}$。取 $M = 10$，$r = 2$，$n = 2$，$|f''(a)|$ 的界是 $\\frac{2 \\cdot 10}{4} = 5$。对有界整函数，$r$ 可以无限增大，所以处处 $f' = 0$，$f$ 是常数：这就是刘维尔定理。\n\n检验：$f(z) = \\frac{10(z - a)^2}{4}$ 在圆周上 $|f| = 10$，而 $f'' = 5$，所以这个界能达到。\n\n> **注意。** 半径要取 $n$ 次幂，阶乘 $n!$ 留在分子上。圆越大，界越好，只要 $M$ 在大圆上仍是 $f$ 的界。",
        ],
        (rng) =>
          until(() => {
            const M = rng.int(2, 30);
            const r = rng.int(2, 6);
            const n = rng.int(1, 3);
            const fact = [1, 1, 2, 6][n] as number;
            const answer = Q.of(fact * M, r ** n);
            const primes = "'".repeat(n);
            return worked(
              [
                `Suppose $|f(z)| \\le ${M}$ on the circle of radius ${r} about $a$, with $f$ analytic on and inside it. What bound does Cauchy's estimate give for $|f${primes}(a)|$?`,
                `设在以 $a$ 为中心、半径为 ${r} 的圆周上 $|f(z)| \\le ${M}$，且 $f$ 在圆周上及其内部解析。柯西估计给出的 $|f${primes}(a)|$ 的界是多少？`,
              ],
              answer,
              [
                [Q.of(M, r ** n), `That leaves out the factor $${n}! = ${fact}$.`, `那漏掉了因子 $${n}! = ${fact}$。`],
                [
                  Q.of(fact * M, r),
                  `That divides by $r$ once; it must be raised to the power ${n}.`,
                  `那只除了一次 $r$；它要取 ${n} 次幂。`,
                ],
                [Q.of(fact * M * r ** n), "That multiplies by the power of $r$ instead of dividing.", "那乘了 $r$ 的幂，而不是除以它。"],
              ],
              [
                [
                  ["State the estimate", "写出估计式"],
                  [`$|f^{(${n})}(a)| \\le \\frac{${n}!\\,M}{${pw("r", n)}}$.`, `$|f^{(${n})}(a)| \\le \\frac{${n}!\\,M}{${pw("r", n)}}$。`],
                ],
                [
                  ["Substitute", "代入"],
                  [
                    `$\\frac{${fact} \\cdot ${M}}{${pw(r, n)}} = \\frac{${fact * M}}{${r ** n}} = ${answer.toLatex()}$.`,
                    `$\\frac{${fact} \\cdot ${M}}{${pw(r, n)}} = \\frac{${fact * M}}{${r ** n}} = ${answer.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The function $\\frac{${M}${pw("(z - a)", n)}}{${r ** n}}$ has modulus ${M} on the circle, and its ${n === 1 ? "first" : n === 2 ? "second" : "third"} derivative at $a$ is $\\frac{${n}! \\cdot ${M}}{${r ** n}} = ${answer.toLatex()}$, so the bound is reached.`,
                `函数 $\\frac{${M}${pw("(z - a)", n)}}{${r ** n}}$ 在圆周上的模是 ${M}，它在 $a$ 处的 ${n} 阶导数是 $\\frac{${n}! \\cdot ${M}}{${r ** n}} = ${answer.toLatex()}$，所以这个界能达到。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["cauchys-estimates-and-liouvilles-theorem#a-cauchy-estimate"],
    },
    {
      ...point(
        "the-maximum-modulus",
        ["The maximum modulus", "最大模"],
        [
          "The maximum modulus principle says that a nonconstant analytic function on a bounded region reaches its largest modulus only on the boundary. For $z^2 + 3$ on the disc $|z| \\le 2$, the triangle inequality gives $|z^2 + 3| \\le 4 + 3 = 7$ on the boundary circle, and $z = 2$ attains it, so the maximum is 7. At the centre the modulus is only 3.\n\nCheck: on $z = 2e^{it}$, $|4e^{2it} + 3|^2 = 16 + 24\\cos 2t + 9$, which is largest, 49, when $\\cos 2t = 1$, and $\\sqrt{49} = 7$.\n\n> **Watch out.** The centre gives the smallest values here, not the largest. On the circle $|z^2| = r^2$, not $r$; and at $z = 2i$, $z^2 = -4$ partly cancels the 3, giving the minimum 1 on the circle.",
          "最大模原理说，有界区域上非常数的解析函数只在边界上达到最大模。对圆盘 $|z| \\le 2$ 上的 $z^2 + 3$，三角不等式在边界圆周上给出 $|z^2 + 3| \\le 4 + 3 = 7$，而 $z = 2$ 能达到它，所以最大值是 7。在圆心处模只有 3。\n\n检验：在 $z = 2e^{it}$ 上，$|4e^{2it} + 3|^2 = 16 + 24\\cos 2t + 9$，当 $\\cos 2t = 1$ 时最大，为 49，而 $\\sqrt{49} = 7$。\n\n> **注意。** 这里圆心给出的是较小的值，不是最大值。在圆周上 $|z^2| = r^2$，不是 $r$；在 $z = 2i$ 处 $z^2 = -4$ 与 3 部分抵消，给出圆周上的最小值 1。",
        ],
        (rng) =>
          until(() => {
            const r = rng.int(2, 12);
            const c = rng.int(1, 30);
            const answer = r * r + c;
            return worked(
              [
                `What is the maximum of $|z^2 + ${c}|$ on the disc $|z| \\le ${r}$?`,
                `$|z^2 + ${c}|$ 在圆盘 $|z| \\le ${r}$ 上的最大值是多少？`,
              ],
              answer,
              [
                [c, "That is the value at the centre; the maximum is on the boundary.", "那是圆心处的值；最大值在边界上。"],
                [
                  r + c,
                  `That uses $|z| = ${r}$ for $|z^2|$; on the circle $|z^2| = ${r * r}$.`,
                  `那把 $|z^2|$ 当成了 $|z| = ${r}$；在圆周上 $|z^2| = ${r * r}$。`,
                ],
                [
                  Math.abs(r * r - c),
                  `That is the value at $z = ${r}i$, where $z^2 = -${r * r}$; it is the smallest on the circle.`,
                  `那是 $z = ${r}i$ 处的值，那里 $z^2 = -${r * r}$；它是圆周上最小的。`,
                ],
              ],
              [
                [
                  ["Go to the boundary", "看边界"],
                  [`The maximum is on $|z| = ${r}$, where $|z^2| = ${r * r}$.`, `最大值在 $|z| = ${r}$ 上，那里 $|z^2| = ${r * r}$。`],
                ],
                [
                  ["Bound and attain", "估计并达到"],
                  [
                    `$|z^2 + ${c}| \\le ${r * r} + ${c} = ${answer}$, with equality at $z = ${r}$.`,
                    `$|z^2 + ${c}| \\le ${r * r} + ${c} = ${answer}$，在 $z = ${r}$ 处取等号。`,
                  ],
                ],
              ],
              [
                `On $z = ${r}e^{it}$, $|${r * r}e^{2it} + ${c}|^2 = ${r ** 4} + ${2 * r * r * c}\\cos 2t + ${c * c}$, largest when $\\cos 2t = 1$, giving $${answer * answer} = ${answer}^2$.`,
                `在 $z = ${r}e^{it}$ 上，$|${r * r}e^{2it} + ${c}|^2 = ${r ** 4} + ${2 * r * r * c}\\cos 2t + ${c * c}$，当 $\\cos 2t = 1$ 时最大，为 $${answer * answer} = ${answer}^2$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["cauchys-estimates-and-liouvilles-theorem#the-maximum-modulus"],
    },
  ],
);

const taylorComplex = topic(
  "taylor-series-of-analytic-functions",
  ["Taylor Series of Analytic Functions", "解析函数的泰勒级数"],
  ["Find the radius of convergence from the nearest singularity, and read off coefficients.", "由最近的奇点求收敛半径，并读出系数。"],
  ["cauchys-integral-formula", "taylor-series"],
  [["taylor-series", 0.3]],
  [
    point(
      "the-radius-from-the-nearest-singularity",
      ["The radius from the nearest singularity", "由最近奇点得半径"],
      [
        "An analytic function equals its Taylor series on the largest disc about the centre that avoids its singularities, so the radius of convergence is the distance to the nearest singularity. For $\\frac{1}{z - (4 + 4i)}$ about $1$, the pole is at distance $|3 + 4i| = \\sqrt{9 + 16} = 5$, so the radius is 5. This also explains why $\\frac{1}{1 + x^2}$ has radius 1 about 0: its poles are at $\\pm i$.\n\nCheck: $\\frac{1}{z - p} = -\\frac{1}{p - c} \\sum \\left(\\frac{z - c}{p - c}\\right)^k$, a geometric series that converges exactly when $|z - c| < |p - c|$.\n\n> **Watch out.** Measure from the centre of the series, not from the origin, and use the straight-line distance $\\sqrt{a^2 + b^2}$, not $|a| + |b|$.",
        "解析函数在以中心为圆心、避开奇点的最大圆盘上等于它的泰勒级数，所以收敛半径是到最近奇点的距离。对 $\\frac{1}{z - (4 + 4i)}$ 在 $1$ 处展开，极点的距离是 $|3 + 4i| = \\sqrt{9 + 16} = 5$，所以半径是 5。这也解释了 $\\frac{1}{1 + x^2}$ 在 0 处的半径为什么是 1：它的极点在 $\\pm i$。\n\n检验：$\\frac{1}{z - p} = -\\frac{1}{p - c} \\sum \\left(\\frac{z - c}{p - c}\\right)^k$，这个几何级数恰好在 $|z - c| < |p - c|$ 时收敛。\n\n> **注意。** 要从级数的中心量起，而不是从原点；要用直线距离 $\\sqrt{a^2 + b^2}$，而不是 $|a| + |b|$。",
      ],
      (rng) =>
        until(() => {
          const { a, b, r } = signedTriple(rng);
          const x = rng.int(-6, 6);
          const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const pole = complex(x + a, y + b);
          const below = y + b === 0 ? minus("z", x + a) : `z - (${pole})`;
          const fromOrigin = Math.hypot(x + a, y + b);
          const misses: Miss[] = [
            [
              Math.abs(a) + Math.abs(b),
              "That adds the horizontal and vertical distances; use the straight-line distance.",
              "那把水平距离和竖直距离相加了；要用直线距离。",
            ],
            [r * r, "That forgets the square root in the distance.", "那忘了距离中的平方根。"],
          ];
          if (Number.isInteger(fromOrigin))
            misses.push([
              fromOrigin,
              "That measures from the origin, not from the centre of the series.",
              "那是从原点量的，而不是从级数的中心。",
            ]);
          return worked(
            [
              `What is the radius of convergence of the Taylor series of $\\frac{1}{${below}}$ about $${complex(x, y)}$?`,
              `$\\frac{1}{${below}}$ 在 $${complex(x, y)}$ 处的泰勒级数的收敛半径是多少？`,
            ],
            r,
            misses,
            [
              [
                ["Find the singularity", "找奇点"],
                [`The only singularity is the pole at $${pole}$.`, `唯一的奇点是 $${pole}$ 处的极点。`],
              ],
              [
                ["Measure from the centre", "从中心量起"],
                [
                  `$${pole} - (${complex(x, y)}) = ${complex(a, b)}$, with modulus $\\sqrt{${a * a} + ${b * b}} = ${r}$.`,
                  `$${pole} - (${complex(x, y)}) = ${complex(a, b)}$，模是 $\\sqrt{${a * a} + ${b * b}} = ${r}$。`,
                ],
              ],
            ],
            [
              `Writing $\\frac{1}{z - p}$ as a geometric series in $\\frac{z - c}{p - c}$ shows convergence exactly for $|z - c| < |p - c| = ${r}$.`,
              `把 $\\frac{1}{z - p}$ 写成关于 $\\frac{z - c}{p - c}$ 的几何级数，可见它恰好在 $|z - c| < |p - c| = ${r}$ 时收敛。`,
            ],
          );
        }),
    ),
    point(
      "a-coefficient-from-a-geometric-series",
      ["A coefficient from a geometric series", "由几何级数得系数"],
      [
        "Many Taylor series come from the geometric series without computing derivatives. For $|z| < |a|$, $\\frac{1}{a - z} = \\frac{1}{a} \\cdot \\frac{1}{1 - \\frac{z}{a}} = \\sum_k \\frac{z^k}{a^{k + 1}}$. So in $\\frac{5}{2 - z}$ the coefficient of $z^3$ is $\\frac{5}{2^{4}} = \\frac{5}{16}$.\n\nCheck: the coefficient is $\\frac{f'''(0)}{3!}$, and $f'''(z) = \\frac{5 \\cdot 3!}{(2 - z)^4}$, so it is $\\frac{5}{16}$.\n\n> **Watch out.** The power of $a$ is one more than the power of $z$, because of the factor $\\frac{1}{a}$ in front. The series is in powers of $\\frac{z}{a}$, so $a$ goes into the denominator.",
        "很多泰勒级数来自几何级数，不必计算导数。当 $|z| < |a|$ 时，$\\frac{1}{a - z} = \\frac{1}{a} \\cdot \\frac{1}{1 - \\frac{z}{a}} = \\sum_k \\frac{z^k}{a^{k + 1}}$。所以在 $\\frac{5}{2 - z}$ 中 $z^3$ 的系数是 $\\frac{5}{2^{4}} = \\frac{5}{16}$。\n\n检验：系数是 $\\frac{f'''(0)}{3!}$，而 $f'''(z) = \\frac{5 \\cdot 3!}{(2 - z)^4}$，所以它是 $\\frac{5}{16}$。\n\n> **注意。** $a$ 的幂比 $z$ 的幂多一，因为前面有因子 $\\frac{1}{a}$。级数是关于 $\\frac{z}{a}$ 的幂，所以 $a$ 在分母上。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(2, 7);
          const n = rng.int(2, 4);
          const c = rng.int(1, 9);
          const answer = Q.of(c, a ** (n + 1));
          return worked(
            [
              `What is the coefficient of $z^{${n}}$ in the Taylor series of $\\frac{${c}}{${a} - z}$ about 0?`,
              `$\\frac{${c}}{${a} - z}$ 在 0 处的泰勒级数中，$z^{${n}}$ 的系数是多少？`,
            ],
            answer,
            [
              [
                Q.of(c, a ** n),
                "That forgets the factor $\\frac{1}{a}$ in front of the series.",
                "那漏掉了级数前面的因子 $\\frac{1}{a}$。",
              ],
              [
                Q.of(c * a ** n),
                "That expands in powers of $az$; the series is in powers of $\\frac{z}{a}$.",
                "那按 $az$ 的幂展开了；级数是关于 $\\frac{z}{a}$ 的幂。",
              ],
              [Q.of(1, a ** (n + 1)), `That drops the factor ${c} in the numerator.`, `那丢掉了分子上的因子 ${c}。`],
            ],
            [
              [
                ["Write the geometric series", "写出几何级数"],
                [
                  `$\\frac{${c}}{${a} - z} = \\frac{${c}}{${a}} \\sum_k \\left(\\frac{z}{${a}}\\right)^k = \\sum_k \\frac{${c}z^k}{${a}^{k + 1}}$.`,
                  `$\\frac{${c}}{${a} - z} = \\frac{${c}}{${a}} \\sum_k \\left(\\frac{z}{${a}}\\right)^k = \\sum_k \\frac{${c}z^k}{${a}^{k + 1}}$。`,
                ],
              ],
              [
                ["Read the coefficient", "读出系数"],
                [
                  `For $k = ${n}$: $\\frac{${c}}{${a}^{${n + 1}}} = ${answer.toLatex()}$.`,
                  `取 $k = ${n}$：$\\frac{${c}}{${a}^{${n + 1}}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The ${n}th derivative is $\\frac{${c} \\cdot ${n}!}{(${a} - z)^{${n + 1}}}$, and dividing its value at 0 by $${n}!$ gives $\\frac{${c}}{${a ** (n + 1)}}$ again.`,
              `${n} 阶导数是 $\\frac{${c} \\cdot ${n}!}{(${a} - z)^{${n + 1}}}$，它在 0 处的值除以 $${n}!$ 同样得 $\\frac{${c}}{${a ** (n + 1)}}$。`,
            ],
          );
        }),
    ),
  ],
);

const laurent = topic(
  "laurent-series",
  ["Laurent Series", "洛朗级数"],
  ["Expand around a singularity, and read the coefficient of the reciprocal term.", "在奇点处展开，并读出倒数项的系数。"],
  ["taylor-series-of-analytic-functions"],
  [["taylor-series-of-analytic-functions", 0.4]],
  [
    point(
      "a-coefficient-of-an-exponential-quotient",
      ["The exponential over a power", "指数除以幂"],
      [
        "A Laurent series extends a Taylor series by allowing negative powers, and it represents a function on an annulus around a singularity. The easiest way to find one is to divide a known series. For $\\frac{e^{2z}}{z^3}$, the exponential series $\\sum \\frac{(2z)^k}{k!}$ divided by $z^3$ has the term in $\\frac{1}{z}$ from $k = 2$: $\\frac{2^2}{2!} = 2$.\n\nCheck: the coefficient of $\\frac{1}{z}$ is the residue at a pole of order 3, $\\frac{1}{2!} \\frac{d^2}{dz^2} e^{2z}$ at 0, which is $\\frac{4}{2} = 2$.\n\n> **Watch out.** Dividing by $z^n$ lowers every power by $n$, so the term in $\\frac{1}{z}$ comes from the power $n - 1$, not $n$. Keep both the power of $k$ and the factorial.",
        "洛朗级数通过允许负幂来推广泰勒级数，它在奇点周围的圆环上表示函数。求它最简单的方法是用已知级数相除。对 $\\frac{e^{2z}}{z^3}$，把指数级数 $\\sum \\frac{(2z)^k}{k!}$ 除以 $z^3$，$\\frac{1}{z}$ 项来自 $k = 2$：$\\frac{2^2}{2!} = 2$。\n\n检验：$\\frac{1}{z}$ 的系数是 3 阶极点的留数，即 $\\frac{1}{2!} \\frac{d^2}{dz^2} e^{2z}$ 在 0 处的值，等于 $\\frac{4}{2} = 2$。\n\n> **注意。** 除以 $z^n$ 使每个幂降低 $n$，所以 $\\frac{1}{z}$ 项来自 $n - 1$ 次幂，而不是 $n$ 次。$k$ 的幂和阶乘都要保留。",
      ],
      (rng) =>
        until(() => {
          const k = rng.int(2, 6);
          const n = rng.int(3, 6);
          const facts = [1, 1, 2, 6, 24, 120, 720];
          const fact = facts[n - 1] as number;
          const c = rng.int(2, 7);
          const answer = Q.of(c * k ** (n - 1), fact);
          return worked(
            [
              `What is the coefficient of $\\frac{1}{z}$ in the Laurent series of $\\frac{${c}e^{${k}z}}{z^{${n}}}$ about 0?`,
              `$\\frac{${c}e^{${k}z}}{z^{${n}}}$ 在 0 处的洛朗级数中，$\\frac{1}{z}$ 的系数是多少？`,
            ],
            answer,
            [
              [
                Q.of(c * k ** n, fact * n),
                `That takes the power ${n} term, which becomes the constant term after dividing by $z^{${n}}$.`,
                `那取了 ${n} 次幂的项，除以 $z^{${n}}$ 后它成了常数项。`,
              ],
              [
                Q.of(c * k ** (n - 1)),
                `That forgets the factorial $${n - 1}!$ of the exponential series.`,
                `那漏掉了指数级数中的阶乘 $${n - 1}!$。`,
              ],
              [
                Q.of(c, fact),
                `That forgets the power $${k}^{${n - 1}}$ from $(${k}z)^{${n - 1}}$.`,
                `那漏掉了 $(${k}z)^{${n - 1}}$ 中的 $${k}^{${n - 1}}$。`,
              ],
            ],
            [
              [
                ["Expand the exponential", "展开指数函数"],
                [
                  `$e^{${k}z} = \\sum_j \\frac{(${k}z)^j}{j!}$, so the quotient is $\\sum_j \\frac{${c} \\cdot ${k}^j}{j!} z^{j - ${n}}$.`,
                  `$e^{${k}z} = \\sum_j \\frac{(${k}z)^j}{j!}$，所以商是 $\\sum_j \\frac{${c} \\cdot ${k}^j}{j!} z^{j - ${n}}$。`,
                ],
              ],
              [
                ["Pick the power", "选出所需的幂"],
                [`$j - ${n} = -1$ gives $j = ${n - 1}$.`, `$j - ${n} = -1$ 给出 $j = ${n - 1}$。`],
              ],
              [
                ["Compute", "计算"],
                [
                  `$\\frac{${c} \\cdot ${k}^{${n - 1}}}{${n - 1}!} = \\frac{${c * k ** (n - 1)}}{${fact}} = ${answer.toLatex()}$.`,
                  `$\\frac{${c} \\cdot ${k}^{${n - 1}}}{${n - 1}!} = \\frac{${c * k ** (n - 1)}}{${fact}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The pole has order ${n}, so the residue is $\\frac{1}{${n - 1}!} \\frac{d^{${n - 1}}}{dz^{${n - 1}}} ${c}e^{${k}z}$ at 0, which is $\\frac{${c} \\cdot ${k ** (n - 1)}}{${fact}} = ${answer.toLatex()}$.`,
              `极点是 ${n} 阶的，所以留数是 $\\frac{1}{${n - 1}!} \\frac{d^{${n - 1}}}{dz^{${n - 1}}} ${c}e^{${k}z}$ 在 0 处的值，即 $\\frac{${c} \\cdot ${k ** (n - 1)}}{${fact}} = ${answer.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "a-coefficient-of-a-rational-function",
      ["A rational function near a pole", "极点附近的有理函数"],
      [
        "The same function has different Laurent series on different annuli, so the region must be stated. For $\\frac{6}{z(z - 3)}$ on $0 < |z| < 3$, the factor $\\frac{6}{z - 3}$ is analytic there, with value $-2$ at 0, and dividing its Taylor series by $z$ gives a single negative power: the coefficient of $\\frac{1}{z}$ is $-2$.\n\nCheck: partial fractions give $\\frac{6}{z(z - 3)} = \\frac{2}{z - 3} - \\frac{2}{z}$, and $\\frac{2}{z - 3}$ has no negative powers on the disc, so the coefficient is $-2$.\n\n> **Watch out.** At $z = 0$ the factor $\\frac{1}{z - a}$ equals $-\\frac{1}{a}$, so the sign flips. On the outer region $|z| > |a|$ the expansion and the answer change.",
        "同一个函数在不同的圆环上有不同的洛朗级数，所以必须说明区域。对 $0 < |z| < 3$ 上的 $\\frac{6}{z(z - 3)}$，因子 $\\frac{6}{z - 3}$ 在那里解析，在 0 处的值是 $-2$；把它的泰勒级数除以 $z$，只有一个负幂项：$\\frac{1}{z}$ 的系数是 $-2$。\n\n检验：部分分式给出 $\\frac{6}{z(z - 3)} = \\frac{2}{z - 3} - \\frac{2}{z}$，而 $\\frac{2}{z - 3}$ 在圆盘上没有负幂，所以系数是 $-2$。\n\n> **注意。** 在 $z = 0$ 处，因子 $\\frac{1}{z - a}$ 等于 $-\\frac{1}{a}$，符号要变。在外部区域 $|z| > |a|$ 上，展开式和答案都会改变。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([-9, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
          const c = rng.int(1, 12);
          const answer = Q.of(-c, a);
          return worked(
            [
              `For $0 < |z| < ${Math.abs(a)}$, what is the coefficient of $\\frac{1}{z}$ in the Laurent series of $\\frac{${c}}{z(${minus("z", a)})}$?`,
              `当 $0 < |z| < ${Math.abs(a)}$ 时，$\\frac{${c}}{z(${minus("z", a)})}$ 的洛朗级数中 $\\frac{1}{z}$ 的系数是多少？`,
            ],
            answer,
            [
              [
                Q.of(c, a),
                `That loses the sign: at $z = 0$, $${minus("z", a)}$ equals $${-a}$.`,
                `那丢了符号：在 $z = 0$ 处，$${minus("z", a)}$ 等于 $${-a}$。`,
              ],
              [
                Q.of(c),
                `That drops the factor $\\frac{1}{${minus("z", a)}}$, which is not 1 at 0.`,
                `那丢掉了因子 $\\frac{1}{${minus("z", a)}}$，它在 0 处不是 1。`,
              ],
              [Q.of(-a, c), "That inverts the coefficient.", "那把系数颠倒了。"],
            ],
            [
              [
                ["Separate the factor", "分出因子"],
                [
                  `$\\frac{${c}}{z(${minus("z", a)})} = \\frac{1}{z} \\cdot g(z)$ with $g(z) = \\frac{${c}}{${minus("z", a)}}$ analytic on $|z| < ${Math.abs(a)}$.`,
                  `$\\frac{${c}}{z(${minus("z", a)})} = \\frac{1}{z} \\cdot g(z)$，其中 $g(z) = \\frac{${c}}{${minus("z", a)}}$ 在 $|z| < ${Math.abs(a)}$ 上解析。`,
                ],
              ],
              [
                ["Read the coefficient", "读出系数"],
                [
                  `The only negative power comes from $g(0) = \\frac{${c}}{${-a}} = ${answer.toLatex()}$.`,
                  `唯一的负幂项来自 $g(0) = \\frac{${c}}{${-a}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Partial fractions: $\\frac{${c}}{z(${minus("z", a)})} = \\frac{${Q.of(c, a).toLatex()}}{${minus("z", a)}} + \\frac{${answer.toLatex()}}{z}$, and the first term has no negative powers on the disc.`,
              `部分分式：$\\frac{${c}}{z(${minus("z", a)})} = \\frac{${Q.of(c, a).toLatex()}}{${minus("z", a)}} + \\frac{${answer.toLatex()}}{z}$，第一项在圆盘上没有负幂。`,
            ],
          );
        }),
    ),
  ],
);

const singularities = topic(
  "classifying-isolated-singularities",
  ["Classifying Isolated Singularities", "孤立奇点的分类"],
  ["Tell removable singularities, poles and essential singularities apart, and find orders.", "区分可去奇点、极点和本性奇点，并求阶数。"],
  ["laurent-series"],
  [["laurent-series", 0.3]],
  [
    point(
      "the-order-of-a-pole",
      ["The order of a pole", "极点的阶"],
      [
        "A pole of order $n$ at $a$ means that the function behaves like a nonzero constant over $(z - a)^n$. To read the order from a quotient, count the power of $z - a$ below and subtract its power above. For $\\frac{(z - 1)^2}{(z - 1)^5(z + 2)}$, the order at 1 is $5 - 2 = 3$.\n\nCheck: $(z - 1)^3$ times the function is $\\frac{1}{z + 2}$, which tends to $\\frac{1}{3} \\ne 0$ at $z = 1$, so the order is exactly 3.\n\n> **Watch out.** The factor $z + 2$ does not vanish at 1, so its power does not count. Powers of $z - 1$ in the numerator cancel ones below; they are subtracted, not added.",
        "在 $a$ 处的 $n$ 阶极点，意味着函数的行为像一个非零常数除以 $(z - a)^n$。要从商中读出阶数，就数分母中 $z - a$ 的次数，再减去分子中它的次数。对 $\\frac{(z - 1)^2}{(z - 1)^5(z + 2)}$，在 1 处的阶是 $5 - 2 = 3$。\n\n检验：$(z - 1)^3$ 乘这个函数得 $\\frac{1}{z + 2}$，它在 $z = 1$ 处趋向 $\\frac{1}{3} \\ne 0$，所以阶恰好是 3。\n\n> **注意。** 因子 $z + 2$ 在 1 处不为零，所以它的次数不算。分子中 $z - 1$ 的次数抵消分母中的，要减去，而不是加上。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-5, 5);
          const b = a + rng.pick([-4, -3, -2, 2, 3, 4]);
          const n = rng.int(2, 7);
          const m = rng.int(1, 7);
          const k = rng.int(1, n - 1);
          const numerator = factor(a, k);
          const answer = n - k;
          return worked(
            [
              `What is the order of the pole of $\\frac{${numerator}}{${factor(a, n)}${factor(b, m)}}$ at $z = ${a}$?`,
              `$\\frac{${numerator}}{${factor(a, n)}${factor(b, m)}}$ 在 $z = ${a}$ 处极点的阶是多少？`,
            ],
            answer,
            [
              [n, "That ignores the cancellation by the numerator.", "那忽略了分子的约分。"],
              [
                n - k + m,
                `That also counts the other factor, which is not zero at $${a}$.`,
                `那把另一个因子也算进去了，而它在 $${a}$ 处不为零。`,
              ],
              [
                n + k,
                "That adds the power in the numerator; it cancels and must be subtracted.",
                "那加上了分子中的次数；它会约掉，应该减去。",
              ],
            ],
            [
              [
                ["Count below", "数分母"],
                [`$${minus("z", a)}$ appears to the power ${n} below.`, `$${minus("z", a)}$ 在分母中是 ${n} 次。`],
              ],
              [
                ["Cancel", "约分"],
                [
                  `It appears to the power ${k} above, leaving $${n} - ${k} = ${answer}$.`,
                  `它在分子中是 ${k} 次，剩下 $${n} - ${k} = ${answer}$。`,
                ],
              ],
            ],
            [
              `$${factor(a, answer)}$ times the function is $\\frac{1}{${factor(b, m)}}$, which at $z = ${a}$ is $\\frac{1}{${pw(bracket(a - b), m)}} \\ne 0$, so the order is exactly ${answer}.`,
              `$${factor(a, answer)}$ 乘这个函数得 $\\frac{1}{${factor(b, m)}}$，它在 $z = ${a}$ 处等于 $\\frac{1}{${pw(bracket(a - b), m)}} \\ne 0$，所以阶恰好是 ${answer}。`,
            ],
          );
        }),
    ),
    point(
      "classifying-a-singularity",
      ["Classifying a singularity", "判断奇点类型"],
      [
        "An isolated singularity falls into one of three types, seen in the Laurent series. It is removable when there are no negative powers, a pole when there are finitely many, and essential when there are infinitely many. For example $\\frac{\\sin z}{z} = 1 - \\frac{z^2}{6} + \\dots$ has none, so 0 is removable; $\\frac{1}{z^2}$ has one, a pole of order 2; and $e^{1/z} = 1 + \\frac{1}{z} + \\frac{1}{2z^2} + \\dots$ has infinitely many, so 0 is essential.\n\nCheck: near a removable point the function stays bounded, near a pole $|f| \\to \\infty$, and near an essential point neither happens: along positive reals $e^{1/z} \\to \\infty$, along negative reals it tends to 0.\n\n> **Watch out.** A formula with no value at a point may still have a removable singularity there. And an exponential of $\\frac{1}{z}$ is not a pole, however large it grows along some directions.",
        "孤立奇点分为三种，可以从洛朗级数看出。没有负幂时是可去奇点，负幂有有限多个时是极点，有无穷多个时是本性奇点。例如 $\\frac{\\sin z}{z} = 1 - \\frac{z^2}{6} + \\dots$ 没有负幂，所以 0 是可去奇点；$\\frac{1}{z^2}$ 有一个，是 2 阶极点；$e^{1/z} = 1 + \\frac{1}{z} + \\frac{1}{2z^2} + \\dots$ 有无穷多个，所以 0 是本性奇点。\n\n检验：在可去奇点附近函数有界，在极点附近 $|f| \\to \\infty$，在本性奇点附近两者都不成立：沿正实轴 $e^{1/z} \\to \\infty$，沿负实轴它趋于 0。\n\n> **注意。** 在一点没有定义的式子，在那里仍可能是可去奇点。$\\frac{1}{z}$ 的指数函数不是极点，无论它在某些方向上增长得多大。",
      ],
      (rng) => {
        const k = rng.int(2, 19);
        const words: Record<string, Pair> = {
          removable: ["A removable singularity", "可去奇点"],
          pole: ["A pole", "极点"],
          essential: ["An essential singularity", "本性奇点"],
          none: ["No singularity of any kind", "不是奇点"],
        };
        const cases: { tex: string; kind: string; why: Record<string, Pair>; steps: Pair; check: Pair }[] = [
          {
            tex: `\\frac{\\sin(${k}z)}{z}`,
            kind: "removable",
            why: {
              pole: [
                "The zero of $z$ below is cancelled by the zero of the sine above, so nothing blows up.",
                "分母中 $z$ 的零点被分子中正弦的零点抵消，所以不会趋于无穷。",
              ],
              essential: ["The series has no negative powers at all, let alone infinitely many.", "级数根本没有负幂，更谈不上无穷多个。"],
              none: [
                "The formula has no value at 0, so 0 is a singularity, though a removable one.",
                "这个式子在 0 处没有定义，所以 0 是奇点，尽管是可去的。",
              ],
            },
            steps: [
              `$\\sin(${k}z) = ${k}z - \\frac{(${k}z)^3}{6} + \\dots$, so the quotient is $${k} - \\frac{${k ** 3}z^2}{6} + \\dots$, with no negative powers.`,
              `$\\sin(${k}z) = ${k}z - \\frac{(${k}z)^3}{6} + \\dots$，所以商是 $${k} - \\frac{${k ** 3}z^2}{6} + \\dots$，没有负幂。`,
            ],
            check: [
              `The quotient tends to ${k} as $z \\to 0$, so defining its value as ${k} makes it analytic there.`,
              `当 $z \\to 0$ 时商趋向 ${k}，所以令它在那里的值为 ${k}，它就解析了。`,
            ],
          },
          {
            tex: `\\frac{${k}}{z^{3}}`,
            kind: "pole",
            why: {
              removable: ["The function grows without bound near 0, so it cannot be extended.", "函数在 0 附近无界增长，所以不能延拓。"],
              essential: ["There is only one negative power, so finitely many.", "只有一个负幂，也就是有限多个。"],
              none: ["The function has no value at 0 and is unbounded near it.", "函数在 0 处没有定义且无界。"],
            },
            steps: [
              `The function is its own Laurent series, with the single negative power $\\frac{${k}}{z^{3}}$, so 0 is a pole of order 3.`,
              `函数本身就是它的洛朗级数，只有一个负幂 $\\frac{${k}}{z^{3}}$，所以 0 是 3 阶极点。`,
            ],
            check: [
              `$|f(z)| = \\frac{${k}}{|z|^{3}} \\to \\infty$ as $z \\to 0$, as at a pole.`,
              `当 $z \\to 0$ 时 $|f(z)| = \\frac{${k}}{|z|^{3}} \\to \\infty$，这正是极点的特征。`,
            ],
          },
          {
            tex: `e^{${k}/z}`,
            kind: "essential",
            why: {
              removable: [
                "The function is unbounded along the positive reals, so it cannot be extended.",
                "函数沿正实轴无界，所以不能延拓。",
              ],
              pole: [
                `Along the negative reals $e^{${k}/z} \\to 0$, so $|f|$ does not tend to infinity as at a pole.`,
                `沿负实轴 $e^{${k}/z} \\to 0$，所以 $|f|$ 不像在极点那样趋于无穷。`,
              ],
              none: ["The formula has no value at 0, so 0 is a singularity.", "这个式子在 0 处没有定义，所以 0 是奇点。"],
            },
            steps: [
              `$e^{${k}/z} = \\sum_j \\frac{${k}^j}{j!\\,z^j}$ has a term for every negative power.`,
              `$e^{${k}/z} = \\sum_j \\frac{${k}^j}{j!\\,z^j}$ 对每个负幂都有一项。`,
            ],
            check: [
              `Along positive reals the function tends to infinity and along negative reals to 0, which neither a pole nor a removable point allows.`,
              `沿正实轴函数趋于无穷，沿负实轴趋于 0，这是极点和可去奇点都不允许的。`,
            ],
          },
        ];
        const one = rng.pick(cases) as (typeof cases)[number];
        const slips: Slip[] = Object.entries(one.why).map(([w, [en, zh]]) => [words[w] as Pair, en, zh]);
        return chosen(
          rng,
          [`What does $${one.tex}$ have at $z = 0$?`, `$${one.tex}$ 在 $z = 0$ 处是什么奇点？`],
          words[one.kind] as Pair,
          slips,
          [
            [["Expand about 0", "在 0 处展开"], one.steps],
            [
              ["Count the negative powers", "数负幂"],
              [
                "None means removable, finitely many means a pole, and infinitely many means essential.",
                "没有负幂是可去奇点，有限多个是极点，无穷多个是本性奇点。",
              ],
            ],
          ],
          one.check,
        );
      },
    ),
  ],
);

const residues = topic(
  "computing-residues",
  ["Computing Residues", "计算留数"],
  ["Find residues at simple and double poles without a full series.", "不写出完整级数，求单极点和二阶极点的留数。"],
  ["classifying-isolated-singularities"],
  [["laurent-series", 0.4]],
  [
    point(
      "the-residue-at-a-simple-pole",
      ["The residue at a simple pole", "单极点的留数"],
      [
        "The residue at a point is the coefficient of $\\frac{1}{z - a}$ in the Laurent series there. At a simple pole, multiply by $z - a$ and take the limit, which amounts to covering up that factor and substituting $a$ in what is left. For $\\frac{6}{(z - 1)(z + 2)}$ at 1, covering $z - 1$ leaves $\\frac{6}{1 + 2} = 2$.\n\nCheck: partial fractions give $\\frac{6}{(z - 1)(z + 2)} = \\frac{2}{z - 1} - \\frac{2}{z + 2}$, and the coefficient of $\\frac{1}{z - 1}$ is 2.\n\n> **Watch out.** Substitute into the factor that is left, in the order $a - b$: the residue at $b$ would be $\\frac{6}{b - a}$, with the opposite sign. The cover-up rule needs a simple pole.",
        "在一点的留数是那里洛朗级数中 $\\frac{1}{z - a}$ 的系数。在单极点，乘以 $z - a$ 再取极限，也就是盖住这个因子，把 $a$ 代入剩下的部分。对 $\\frac{6}{(z - 1)(z + 2)}$ 在 1 处，盖住 $z - 1$ 剩下 $\\frac{6}{1 + 2} = 2$。\n\n检验：部分分式给出 $\\frac{6}{(z - 1)(z + 2)} = \\frac{2}{z - 1} - \\frac{2}{z + 2}$，$\\frac{1}{z - 1}$ 的系数是 2。\n\n> **注意。** 要代入剩下的因子，顺序是 $a - b$：在 $b$ 处的留数是 $\\frac{6}{b - a}$，符号相反。盖住法只适用于单极点。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-6, 6);
          const b = a + rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const c = rng.int(1, 12);
          const answer = Q.of(c, a - b);
          return worked(
            [
              `What is the residue of $\\frac{${c}}{${factor(a)}${factor(b)}}$ at $z = ${a}$?`,
              `$\\frac{${c}}{${factor(a)}${factor(b)}}$ 在 $z = ${a}$ 处的留数是多少？`,
            ],
            answer,
            [
              [Q.of(c, b - a), `That is the residue at the other pole, $z = ${b}$.`, `那是另一个极点 $z = ${b}$ 处的留数。`],
              [
                Q.of(c),
                `That covers both factors; only $${minus("z", a)}$ is covered.`,
                `那把两个因子都盖住了；只盖住 $${minus("z", a)}$。`,
              ],
              [Q.of(a - b, c), "That inverts the residue.", "那把留数颠倒了。"],
            ],
            [
              [
                ["Cover the factor", "盖住因子"],
                [
                  `Removing $${minus("z", a)}$ leaves $\\frac{${c}}{${minus("z", b)}}$.`,
                  `去掉 $${minus("z", a)}$ 剩下 $\\frac{${c}}{${minus("z", b)}}$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `At $z = ${a}$: $\\frac{${c}}{${bracket(a)} - ${bracket(b)}} = ${answer.toLatex()}$.`,
                  `在 $z = ${a}$ 处：$\\frac{${c}}{${bracket(a)} - ${bracket(b)}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Partial fractions: $\\frac{${c}}{${factor(a)}${factor(b)}} = \\frac{${answer.toLatex()}}{${minus("z", a)}} + \\frac{${answer.neg().toLatex()}}{${minus("z", b)}}$, and the two sides agree, since $${answer.toLatex()} \\cdot (${a} - ${bracket(b)}) = ${c}$.`,
              `部分分式：$\\frac{${c}}{${factor(a)}${factor(b)}} = \\frac{${answer.toLatex()}}{${minus("z", a)}} + \\frac{${answer.neg().toLatex()}}{${minus("z", b)}}$，两边一致，因为 $${answer.toLatex()} \\cdot (${a} - ${bracket(b)}) = ${c}$。`,
            ],
          );
        }),
    ),
    point(
      "the-residue-at-a-double-pole",
      ["The residue at a double pole", "二阶极点的留数"],
      [
        "At a double pole, the residue of $\\frac{g(z)}{(z - a)^2}$ is $g'(a)$, because expanding $g$ about $a$ gives a term $g'(a)(z - a)$, which becomes $\\frac{g'(a)}{z - a}$. For $\\frac{z^2 + 3z}{(z - 1)^2}$ at 1, $g'(z) = 2z + 3$, so the residue is 5.\n\nCheck: $z^2 + 3z = (z - 1)^2 + 5(z - 1) + 4$, so the function is $1 + \\frac{5}{z - 1} + \\frac{4}{(z - 1)^2}$, with 5 in front of $\\frac{1}{z - 1}$.\n\n> **Watch out.** Substituting $a$ into $g$ gives $g(a) = 4$, the coefficient of $\\frac{1}{(z - a)^2}$, not the residue. For order $n$ the rule takes the derivative of order $n - 1$ and divides by $(n - 1)!$.",
        "在二阶极点，$\\frac{g(z)}{(z - a)^2}$ 的留数是 $g'(a)$，因为把 $g$ 在 $a$ 处展开有一项 $g'(a)(z - a)$，它变成 $\\frac{g'(a)}{z - a}$。对 $\\frac{z^2 + 3z}{(z - 1)^2}$ 在 1 处，$g'(z) = 2z + 3$，所以留数是 5。\n\n检验：$z^2 + 3z = (z - 1)^2 + 5(z - 1) + 4$，所以函数是 $1 + \\frac{5}{z - 1} + \\frac{4}{(z - 1)^2}$，$\\frac{1}{z - 1}$ 前面是 5。\n\n> **注意。** 把 $a$ 代入 $g$ 得 $g(a) = 4$，那是 $\\frac{1}{(z - a)^2}$ 的系数，不是留数。对 $n$ 阶极点，法则是求 $n - 1$ 阶导数再除以 $(n - 1)!$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
          const p = rng.int(1, 5);
          const q = rng.int(1, 9);
          const answer = 2 * p * a + q;
          const g = `${coefficient(p, "z^2")} + ${coefficient(q, "z")}`;
          const value = p * a * a + q * a;
          return worked(
            [
              `What is the residue of $\\frac{${g}}{(${minus("z", a)})^2}$ at $z = ${a}$?`,
              `$\\frac{${g}}{(${minus("z", a)})^2}$ 在 $z = ${a}$ 处的留数是多少？`,
            ],
            answer,
            [
              [
                value,
                "That substitutes into the numerator, which gives the coefficient of $\\frac{1}{(z - a)^2}$.",
                "那把点代入了分子，得到的是 $\\frac{1}{(z - a)^2}$ 的系数。",
              ],
              [2 * p, "That differentiates twice; a double pole needs one derivative.", "那求了两次导；二阶极点只需一阶导数。"],
              [
                Q.of(answer, 2),
                "That divides by $2!$; for a double pole the divisor is $1! = 1$.",
                "那除以了 $2!$；对二阶极点，除数是 $1! = 1$。",
              ],
            ],
            [
              [
                ["Take g", "取出 g"],
                [`$g(z) = ${g}$, so $g'(z) = ${2 * p}z + ${q}$.`, `$g(z) = ${g}$，所以 $g'(z) = ${2 * p}z + ${q}$。`],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `$g'(${a}) = ${2 * p} \\cdot ${bracket(a)} + ${q} = ${answer}$.`,
                  `$g'(${a}) = ${2 * p} \\cdot ${bracket(a)} + ${q} = ${answer}$。`,
                ],
              ],
            ],
            [
              `$${g} = ${coefficient(p, `(${minus("z", a)})^2`)}${plus(answer, `(${minus("z", a)})`)}${addend(value)}$, so the coefficient of $\\frac{1}{${minus("z", a)}}$ is ${answer}.`,
              `$${g} = ${coefficient(p, `(${minus("z", a)})^2`)}${plus(answer, `(${minus("z", a)})`)}${addend(value)}$，所以 $\\frac{1}{${minus("z", a)}}$ 的系数是 ${answer}。`,
            ],
          );
        }),
    ),
  ],
);

const residueTheorem = topic(
  "the-residue-theorem",
  ["The Residue Theorem", "留数定理"],
  ["Compute contour integrals and real integrals from residues.", "由留数计算围道积分和实积分。"],
  ["computing-residues"],
  [["computing-residues", 0.6]],
  [
    point(
      "adding-the-enclosed-residues",
      ["Adding the enclosed residues", "把被包围的留数相加"],
      [
        "The residue theorem says that a closed contour integral equals $2\\pi i$ times the sum of the residues at the poles it encloses. Poles outside do not count, so check them first. For $\\frac{6}{(z - 1)(z - 4)}$ around $|z| = 2$, only the pole at 1 is inside; its residue is $\\frac{6}{1 - 4} = -2$, so the integral is $-4\\pi i$.\n\nCheck: the residue at 4 is $2$, and the residues of this function, including the one at infinity, which is 0 here, sum to zero; so the residue at 1 is $-2$.\n\n> **Watch out.** When both poles lie inside, these two residues cancel and the integral is 0; here one lies outside, so only one counts.",
        "留数定理说，闭围道积分等于 $2\\pi i$ 乘它所包围的极点处留数之和。围道外的极点不算，所以先检查它们。对 $\\frac{6}{(z - 1)(z - 4)}$ 沿 $|z| = 2$，只有 1 处的极点在里面；它的留数是 $\\frac{6}{1 - 4} = -2$，所以积分是 $-4\\pi i$。\n\n检验：4 处的留数是 $2$，而这个函数的所有留数，包括无穷远点的留数（这里是 0），之和为零；所以 1 处的留数是 $-2$。\n\n> **注意。** 两个极点都在里面时，这两个留数相消，积分为 0；这里有一个在外面，所以只算一个。",
      ],
      (rng) =>
        until(() => {
          const r = rng.int(2, 7);
          const a = rng.int(-(r - 1), r - 1);
          const b = r + rng.int(1, 6);
          const m = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
          const c = (a - b) * m;
          const answer = 2 * m;
          return worked(
            [
              `The integral of $\\frac{${c}}{${factor(a)}${factor(b)}}$ once counterclockwise around $|z| = ${r}$ is $k\\pi i$. What is $k$?`,
              `$\\frac{${c}}{${factor(a)}${factor(b)}}$ 沿 $|z| = ${r}$ 逆时针积分一周的结果是 $k\\pi i$。$k$ 是多少？`,
            ],
            answer,
            [
              [
                0,
                `That counts both poles, whose residues cancel; but $${b}$ is outside the circle.`,
                `那把两个极点都算了，它们的留数相消；但 $${b}$ 在圆外。`,
              ],
              [m, "That forgets the 2 of $2\\pi i$.", "那漏掉了 $2\\pi i$ 中的 2。"],
              [-answer, `That uses the residue at $${b}$, which is outside.`, `那用了 $${b}$ 处的留数，而它在圆外。`],
            ],
            [
              [
                ["Locate the poles", "确定极点位置"],
                [`$|${a}| < ${r}$ is inside and $${b} > ${r}$ is outside.`, `$|${a}| < ${r}$ 在圆内，$${b} > ${r}$ 在圆外。`],
              ],
              [
                ["Find the residue inside", "求内部的留数"],
                [`At $${a}$: $\\frac{${c}}{${bracket(a)} - ${b}} = ${m}$.`, `在 $${a}$ 处：$\\frac{${c}}{${bracket(a)} - ${b}} = ${m}$。`],
              ],
              [
                ["Multiply by 2πi", "乘以 2πi"],
                [
                  `$2\\pi i \\cdot ${bracket(m)} = ${answer}\\pi i$, so $k = ${answer}$.`,
                  `$2\\pi i \\cdot ${bracket(m)} = ${answer}\\pi i$，所以 $k = ${answer}$。`,
                ],
              ],
            ],
            [
              `The residue at $${b}$ is $\\frac{${c}}{${b} - ${bracket(a)}} = ${-m}$, and since the degrees differ by 2 the residue at infinity is 0, so the residue at $${a}$ is $${m}$, as found.`,
              `$${b}$ 处的留数是 $\\frac{${c}}{${b} - ${bracket(a)}} = ${-m}$，而分母次数比分子高 2，无穷远点的留数是 0，所以 $${a}$ 处的留数是 $${m}$，与所求一致。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "a-real-integral-from-residues",
        ["A real integral from residues", "由留数求实积分"],
        [
          "Real integrals over the whole line can often be found by closing the interval with a large semicircle in the upper half plane. When the integrand falls like $\\frac{1}{x^2}$ or faster, the arc contributes nothing in the limit, so the real integral is $2\\pi i$ times the residues in the upper half plane. For $\\int \\frac{dx}{1 + x^2}$, only the pole $i$ is enclosed, with residue $\\frac{1}{2i}$, so the integral is $2\\pi i \\cdot \\frac{1}{2i} = \\pi$.\n\nCheck: $\\int_{-\\infty}^{\\infty} \\frac{dx}{1 + x^2} = [\\arctan x]_{-\\infty}^{\\infty} = \\frac{\\pi}{2} - (-\\frac{\\pi}{2}) = \\pi$.\n\n> **Watch out.** Count only the poles in the upper half plane; $-i$ stays outside. Every pole there counts, not only the nearest.",
          "整条实轴上的积分，常常可以用上半平面的大半圆把区间封闭起来求得。被积函数像 $\\frac{1}{x^2}$ 或更快地下降时，圆弧的贡献在极限中为零，所以实积分等于 $2\\pi i$ 乘上半平面内的留数。对 $\\int \\frac{dx}{1 + x^2}$，只有极点 $i$ 被包围，留数是 $\\frac{1}{2i}$，所以积分是 $2\\pi i \\cdot \\frac{1}{2i} = \\pi$。\n\n检验：$\\int_{-\\infty}^{\\infty} \\frac{dx}{1 + x^2} = [\\arctan x]_{-\\infty}^{\\infty} = \\frac{\\pi}{2} - (-\\frac{\\pi}{2}) = \\pi$。\n\n> **注意。** 只算上半平面的极点；$-i$ 在外面。那里的每个极点都要算，不只是最近的一个。",
        ],
        (rng) =>
          until(() => {
            const [a, b] = (rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 2) as [number, number]).sort((x, y) => x - y) as [number, number];
            const answer = Q.of(1, a * b * (a + b));
            const [ai, bi] = [coefficient(a, "i"), coefficient(b, "i")];
            return worked(
              [
                `The integral $\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})}$ equals $k\\pi$. What is $k$?`,
                `积分 $\\int_{-\\infty}^{\\infty} \\frac{dx}{(x^2 + ${a * a})(x^2 + ${b * b})}$ 等于 $k\\pi$。$k$ 是多少？`,
              ],
              answer,
              [
                [
                  Q.of(1, a * (b * b - a * a)),
                  `That uses only the pole $${ai}$; $${bi}$ is in the upper half plane too.`,
                  `那只用了极点 $${ai}$；$${bi}$ 也在上半平面。`,
                ],
                [
                  Q.of(b - a, a * b),
                  "That drops the factor $\\frac{1}{b^2 - a^2}$ from the partial fractions.",
                  "那丢掉了部分分式中的因子 $\\frac{1}{b^2 - a^2}$。",
                ],
                [
                  answer.neg(),
                  "That closes in the lower half plane but keeps the counterclockwise sign; that path runs clockwise.",
                  "那在下半平面封闭，却保留了逆时针的符号；那条路径是顺时针的。",
                ],
              ],
              [
                [
                  ["Find the poles above", "找上半平面的极点"],
                  [`The poles in the upper half plane are $${ai}$ and $${bi}$.`, `上半平面的极点是 $${ai}$ 和 $${bi}$。`],
                ],
                [
                  ["Compute the residues", "计算留数"],
                  [
                    `At $${ai}$: $\\frac{1}{${2 * a}i \\cdot ${b * b - a * a}}$; at $${bi}$: $\\frac{1}{${2 * b}i \\cdot (${a * a - b * b})}$.`,
                    `在 $${ai}$ 处：$\\frac{1}{${2 * a}i \\cdot ${b * b - a * a}}$；在 $${bi}$ 处：$\\frac{1}{${2 * b}i \\cdot (${a * a - b * b})}$。`,
                  ],
                ],
                [
                  ["Multiply by 2πi", "乘以 2πi"],
                  [
                    `$\\pi\\left(\\frac{1}{${a * (b * b - a * a)}} - \\frac{1}{${b * (b * b - a * a)}}\\right) = \\frac{\\pi}{${a} \\cdot ${b} \\cdot ${a + b}} = ${answer.toLatex()}\\pi$.`,
                    `$\\pi\\left(\\frac{1}{${a * (b * b - a * a)}} - \\frac{1}{${b * (b * b - a * a)}}\\right) = \\frac{\\pi}{${a} \\cdot ${b} \\cdot ${a + b}} = ${answer.toLatex()}\\pi$。`,
                  ],
                ],
              ],
              [
                `Partial fractions give $\\frac{1}{${b * b - a * a}}\\left(\\frac{1}{x^2 + ${a * a}} - \\frac{1}{x^2 + ${b * b}}\\right)$, and $\\int \\frac{dx}{x^2 + c^2} = \\frac{\\pi}{c}$, so the integral is $\\frac{\\pi}{${b * b - a * a}}\\left(${a === 1 ? "1" : `\\frac{1}{${a}}`} - \\frac{1}{${b}}\\right) = ${answer.toLatex()}\\pi$.`,
                `部分分式给出 $\\frac{1}{${b * b - a * a}}\\left(\\frac{1}{x^2 + ${a * a}} - \\frac{1}{x^2 + ${b * b}}\\right)$，而 $\\int \\frac{dx}{x^2 + c^2} = \\frac{\\pi}{c}$，所以积分是 $\\frac{\\pi}{${b * b - a * a}}\\left(${a === 1 ? "1" : `\\frac{1}{${a}}`} - \\frac{1}{${b}}\\right) = ${answer.toLatex()}\\pi$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["the-residue-theorem#a-real-integral-from-residues"],
    },
  ],
);

/** linear writes az + b, leaving out zero terms and coefficients of one. */
const linear = (a: number, b: number) => (a === 0 ? `${b}` : `${coefficient(a, "z")}${addend(b)}`);

const mobiusMaps = topic(
  "mobius-transformations",
  ["Möbius Transformations", "默比乌斯变换"],
  ["Evaluate fractional linear maps, and find their poles and images of infinity.", "计算分式线性映射，并求它们的极点和无穷远点的像。"],
  ["the-complex-derivative"],
  [],
  [
    point(
      "the-image-of-infinity-and-the-pole",
      ["The image of infinity and the pole", "无穷远点的像和极点"],
      [
        "A Möbius transformation is $\\frac{az + b}{cz + d}$ with $ad - bc \\ne 0$, best treated as a map of the extended plane with a point at infinity added. The zero of the denominator goes to infinity, and infinity goes to the ratio of the leading coefficients. For $\\frac{2z + 1}{3z + 6}$, the pole is $-2$ and the image of infinity is $\\frac{2}{3}$.\n\nCheck: dividing above and below by $z$ gives $\\frac{2 + \\frac{1}{z}}{3 + \\frac{6}{z}}$, which tends to $\\frac{2}{3}$; and the inverse map $\\frac{6w - 1}{-3w + 2}$ has its pole at $\\frac{2}{3}$, so it sends $\\frac{2}{3}$ back to infinity.\n\n> **Watch out.** The pole is $-\\frac{d}{c}$, with a minus sign. The zero of the numerator, $-\\frac{1}{2}$ here, is where the map gives 0, not infinity. The value at 0, $\\frac{b}{d}$, is not the image of infinity.",
        "默比乌斯变换是 $\\frac{az + b}{cz + d}$，其中 $ad - bc \\ne 0$，最好看成添加了无穷远点的扩充平面上的映射。分母的零点被送到无穷远，无穷远被送到首项系数之比。对 $\\frac{2z + 1}{3z + 6}$，极点是 $-2$，无穷远点的像是 $\\frac{2}{3}$。\n\n检验：分子分母同除以 $z$ 得 $\\frac{2 + \\frac{1}{z}}{3 + \\frac{6}{z}}$，它趋向 $\\frac{2}{3}$；而逆映射 $\\frac{6w - 1}{-3w + 2}$ 的极点在 $\\frac{2}{3}$，它把 $\\frac{2}{3}$ 送回无穷远。\n\n> **注意。** 极点是 $-\\frac{d}{c}$，带负号。分子的零点（这里是 $-\\frac{1}{2}$）是映射取 0 的地方，不是无穷远。在 0 处的值 $\\frac{b}{d}$ 不是无穷远点的像。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 9);
          const b = rng.int(1, 9);
          const c = rng.int(2, 9);
          const d = rng.int(1, 9);
          if (a * d === b * c) return undefined;
          const pole = rng.bool();
          const answer = pole ? Q.of(-d, c) : Q.of(a, c);
          const misses: Miss[] = pole
            ? [
                [
                  Q.of(d, c),
                  "That loses the minus sign: $cz + d = 0$ gives $z = -\\frac{d}{c}$.",
                  "那丢了负号：$cz + d = 0$ 给出 $z = -\\frac{d}{c}$。",
                ],
                [Q.of(-b, a), "That is the zero of the numerator, which goes to 0.", "那是分子的零点，它被送到 0。"],
                [Q.of(-c, d), "That inverts the ratio.", "那把比颠倒了。"],
              ]
            : [
                [Q.of(b, d), "That is the value at 0, not at infinity.", "那是在 0 处的值，不是无穷远处的。"],
                [Q.of(c, a), "That inverts the ratio of the leading coefficients.", "那把首项系数之比颠倒了。"],
                [Q.of(-d, c), "That is the pole, the point sent to infinity.", "那是极点，即被送到无穷远的点。"],
              ];
          const f = `\\frac{${coefficient(a, "z")} + ${b}}{${c}z + ${d}}`;
          return worked(
            [
              `Let $f(z) = ${f}$. ${pole ? "Which point does $f$ send to infinity?" : "What is the image of infinity under $f$?"}`,
              `设 $f(z) = ${f}$。${pole ? "$f$ 把哪个点送到无穷远？" : "无穷远点在 $f$ 下的像是什么？"}`,
            ],
            answer,
            misses,
            pole
              ? [
                  [
                    ["Set the denominator to zero", "令分母为零"],
                    [`$${c}z + ${d} = 0$ gives $z = ${answer.toLatex()}$.`, `$${c}z + ${d} = 0$ 给出 $z = ${answer.toLatex()}$。`],
                  ],
                  [
                    ["Check the numerator", "检查分子"],
                    [
                      `Since $ad - bc = ${a * d - b * c} \\ne 0$, the numerator is not zero there, so the value is infinite.`,
                      `因为 $ad - bc = ${a * d - b * c} \\ne 0$，分子在那里不为零，所以值是无穷。`,
                    ],
                  ],
                ]
              : [
                  [
                    ["Divide by z", "同除以 z"],
                    [
                      `$f(z) = \\frac{${a} + \\frac{${b}}{z}}{${c} + \\frac{${d}}{z}}$.`,
                      `$f(z) = \\frac{${a} + \\frac{${b}}{z}}{${c} + \\frac{${d}}{z}}$。`,
                    ],
                  ],
                  [
                    ["Let z grow", "让 z 趋于无穷"],
                    [
                      `The fractions in $z$ vanish, leaving $\\frac{${a}}{${c}} = ${answer.toLatex()}$.`,
                      `含 $z$ 的分式趋于零，剩下 $\\frac{${a}}{${c}} = ${answer.toLatex()}$。`,
                    ],
                  ],
                ],
            [
              `The inverse map is $w \\mapsto \\frac{${d}w - ${b}}{-${c}w + ${a}}$. ${pole ? `Its image of infinity is $\\frac{${d}}{-${c}} = ${answer.toLatex()}$, so $f$ sends this point to infinity.` : `Its pole is at $w = \\frac{${a}}{${c}}$, so $f$ sends infinity to $${answer.toLatex()}$.`}`,
              `逆映射是 $w \\mapsto \\frac{${d}w - ${b}}{-${c}w + ${a}}$。${pole ? `它把无穷远送到 $\\frac{${d}}{-${c}} = ${answer.toLatex()}$，所以 $f$ 把这一点送到无穷远。` : `它的极点在 $w = \\frac{${a}}{${c}}$，所以 $f$ 把无穷远送到 $${answer.toLatex()}$。`}`,
            ],
          );
        }),
    ),
    point(
      "fixed-points-of-a-transformation",
      ["Fixed points of a transformation", "变换的不动点"],
      [
        "A fixed point of a Möbius transformation solves $z = f(z)$, and clearing the denominator gives a quadratic, so a map other than the identity has at most two fixed points. For $f(z) = \\frac{6z - 6}{z + 1}$: $z(z + 1) = 6z - 6$ gives $z^2 - 5z + 6 = 0$, so the fixed points are 2 and 3.\n\nCheck: $f(2) = \\frac{6}{3} = 2$ and $f(3) = \\frac{12}{4} = 3$.\n\n> **Watch out.** Move every term to one side before factoring. The sum of the fixed points, 5 here, is a coefficient of the quadratic, not a fixed point.",
        "默比乌斯变换的不动点满足 $z = f(z)$，去分母后得到二次方程，所以恒等映射以外的映射至多有两个不动点。对 $f(z) = \\frac{6z - 6}{z + 1}$：$z(z + 1) = 6z - 6$ 给出 $z^2 - 5z + 6 = 0$，所以不动点是 2 和 3。\n\n检验：$f(2) = \\frac{6}{3} = 2$，$f(3) = \\frac{12}{4} = 3$。\n\n> **注意。** 分解之前要把所有项移到一边。不动点之和（这里是 5）是二次方程的系数，不是不动点。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(-6, 6);
          const q = p + rng.int(1, 9);
          // z = (az + b) / (z + d) has z² + (d - a)z - b = 0, with roots p and q.
          const d = rng.pick([1, 2, 3, 4, 5, 6, 7, 8].filter((v) => v !== -p && v !== -q));
          const a = d + p + q;
          const b = -p * q;
          if (a === 0 && b === 0) return undefined;
          const top = linear(a, b);
          return worked(
            [
              `What is the larger fixed point of $f(z) = \\frac{${top}}{z + ${d}}$?`,
              `$f(z) = \\frac{${top}}{z + ${d}}$ 较大的不动点是多少？`,
            ],
            q,
            [
              [p, "That is the smaller fixed point.", "那是较小的不动点。"],
              [p + q, "That is the sum of the fixed points, a coefficient of the quadratic.", "那是不动点之和，是二次方程的系数。"],
              [-q, "That reads the root from the factor with the wrong sign.", "那从因式读根时符号弄反了。"],
            ],
            [
              [
                ["Clear the denominator", "去分母"],
                [`$z(z + ${d}) = ${top}$.`, `$z(z + ${d}) = ${top}$。`],
              ],
              [
                ["Collect and factor", "整理并分解"],
                [
                  `$z^2${plus(d - a, "z")}${addend(-b)} = ${factor(p)}${factor(q)} = 0$, so the fixed points are $${p}$ and $${q}$.`,
                  `$z^2${plus(d - a, "z")}${addend(-b)} = ${factor(p)}${factor(q)} = 0$，所以不动点是 $${p}$ 和 $${q}$。`,
                ],
              ],
              [
                ["Pick the larger", "取较大者"],
                [`The larger is $${q}$.`, `较大的是 $${q}$。`],
              ],
            ],
            [
              `At $z = ${q}$ the numerator is $${a * q + b}$ and the denominator is $${q + d}$, and $${bracket(q)} \\cdot ${bracket(q + d)} = ${q * (q + d)}$, so $f(${q}) = ${q}$.`,
              `在 $z = ${q}$ 处分子是 $${a * q + b}$，分母是 $${q + d}$，而 $${bracket(q)} \\cdot ${bracket(q + d)} = ${q * (q + d)}$，所以 $f(${q}) = ${q}$。`,
            ],
          );
        }),
    ),
  ],
);

const conformal = topic(
  "conformal-maps",
  ["Conformal Maps", "共形映射"],
  ["Find how much a map stretches near a point, and where conformality fails.", "求映射在一点附近的伸缩倍数，以及共形性在哪里失效。"],
  ["mobius-transformations"],
  [],
  [
    {
      ...point(
        "the-local-scale-factor",
        ["The local scale factor", "局部伸缩倍数"],
        [
          "Near a point where the derivative is not zero, an analytic map acts like multiplication by that derivative: a rotation by its argument and a scaling by its modulus. All directions turn and stretch by the same amounts, so angles are preserved. For example, where $f'(z) = 2i$, a small square turns by $\\arg 2i = \\frac{\\pi}{2}$ and a side of length 1 grows to $|2i| = 2$. For $f(z) = z^2$ at $z = i$, $f' = 2i$, so the scale factor is 2.\n\nCheck: $f(i + h) - f(i) = 2ih + h^2$, and for small $h$ this is close to $2ih$, of length $2|h|$.\n\n> **Watch out.** The scale factor is $|f'(z)|$, not $|f(z)|$. The modulus of $a + bi$ is $\\sqrt{a^2 + b^2}$, not $|a| + |b|$.",
          "在导数不为零的点附近，解析映射的作用就像乘以这个导数：旋转它的辐角，并按它的模伸缩。所有方向都旋转和伸缩相同的量，所以角度保持不变。例如在 $f'(z) = 2i$ 的地方，小正方形旋转 $\\arg 2i = \\frac{\\pi}{2}$，长为 1 的边变成 $|2i| = 2$。对 $f(z) = z^2$ 在 $z = i$ 处，$f' = 2i$，所以伸缩倍数是 2。\n\n检验：$f(i + h) - f(i) = 2ih + h^2$，$h$ 很小时它接近 $2ih$，长度是 $2|h|$。\n\n> **注意。** 伸缩倍数是 $|f'(z)|$，不是 $|f(z)|$。$a + bi$ 的模是 $\\sqrt{a^2 + b^2}$，不是 $|a| + |b|$。",
        ],
        (rng) =>
          until(() => {
            const k = rng.int(1, 4);
            const { a, b, r } = signedTriple(rng);
            const answer = 2 * k * r;
            const f = coefficient(k, "z^2");
            return worked(
              [
                `By what factor does $f(z) = ${f}$ scale small lengths near $z = ${complex(a, b)}$?`,
                `$f(z) = ${f}$ 在 $z = ${complex(a, b)}$ 附近把小长度放大多少倍？`,
              ],
              answer,
              [
                [k * r * r, "That is $|f(z)|$; the scale factor is $|f'(z)|$.", "那是 $|f(z)|$；伸缩倍数是 $|f'(z)|$。"],
                [
                  2 * k * (Math.abs(a) + Math.abs(b)),
                  "That adds the parts instead of taking the modulus.",
                  "那把两个部分相加了，而不是取模。",
                ],
                [r, `That drops the factor ${2 * k} in $f'(z) = ${2 * k}z$.`, `那丢掉了 $f'(z) = ${2 * k}z$ 中的因子 ${2 * k}。`],
              ],
              [
                [
                  ["Differentiate", "求导"],
                  [`$f'(z) = ${2 * k}z$.`, `$f'(z) = ${2 * k}z$。`],
                ],
                [
                  ["Take the modulus", "取模"],
                  [
                    `$|f'(z)| = ${2 * k}|${complex(a, b)}| = ${2 * k} \\cdot ${r} = ${answer}$.`,
                    `$|f'(z)| = ${2 * k}|${complex(a, b)}| = ${2 * k} \\cdot ${r} = ${answer}$。`,
                  ],
                ],
              ],
              [
                `$f'(${complex(a, b)}) = ${complex(2 * k * a, 2 * k * b)}$, and $\\sqrt{${4 * k * k * a * a} + ${4 * k * k * b * b}} = \\sqrt{${answer * answer}} = ${answer}$.`,
                `$f'(${complex(a, b)}) = ${complex(2 * k * a, 2 * k * b)}$，而 $\\sqrt{${4 * k * k * a * a} + ${4 * k * k * b * b}} = \\sqrt{${answer * answer}} = ${answer}$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["conformal-maps#the-local-scale-factor"],
    },
    {
      ...point(
        "where-conformality-fails",
        ["Where conformality fails", "共形性在哪里失效"],
        [
          "A map fails to be conformal at a critical point, where the derivative vanishes. There it behaves like a higher power and multiplies angles: $w = z^2$ has derivative $2z$, which vanishes at 0, and there a wedge of opening $\\frac{\\pi}{4}$ becomes one of opening $\\frac{\\pi}{2}$. For $f(z) = 2z^2 - 8z + 1$, $f'(z) = 4z - 8$ vanishes at $z = 2$.\n\nCheck: completing the square, $f(z) = 2(z - 2)^2 - 7$, a square centred at 2, which doubles angles there.\n\n> **Watch out.** Solve $f'(z) = 0$, not $f(z) = 0$. The derivative of $az^2$ is $2az$, so the critical point is $-\\frac{b}{2a}$, with the 2 and the minus sign.",
          "在导数为零的临界点，映射不再共形。在那里它的行为像更高次的幂，会把角度成倍放大：$w = z^2$ 的导数是 $2z$，在 0 处为零，那里张角为 $\\frac{\\pi}{4}$ 的楔形变成张角为 $\\frac{\\pi}{2}$ 的楔形。对 $f(z) = 2z^2 - 8z + 1$，$f'(z) = 4z - 8$ 在 $z = 2$ 处为零。\n\n检验：配方得 $f(z) = 2(z - 2)^2 - 7$，这是以 2 为中心的平方，在那里把角度加倍。\n\n> **注意。** 要解 $f'(z) = 0$，而不是 $f(z) = 0$。$az^2$ 的导数是 $2az$，所以临界点是 $-\\frac{b}{2a}$，有 2 也有负号。",
        ],
        (rng) =>
          until(() => {
            const a = rng.int(1, 5);
            const b = rng.pick([-18, -14, -12, -10, -8, -6, -4, -2, 2, 4, 6, 8, 10, 12, 14, 18]);
            const c = rng.int(-9, 9);
            const answer = Q.of(-b, 2 * a);
            const f = `${coefficient(a, "z^2")}${plus(b, "z")}${addend(c)}`;
            return worked(
              [`At which point is $f(z) = ${f}$ not conformal?`, `$f(z) = ${f}$ 在哪一点不共形？`],
              answer,
              [
                [Q.of(b, 2 * a), "That loses the minus sign in solving $2az + b = 0$.", "解 $2az + b = 0$ 时那丢了负号。"],
                [
                  Q.of(-b, a),
                  "That differentiates $az^2$ to $az$; its derivative is $2az$.",
                  "那把 $az^2$ 的导数算成了 $az$；它的导数是 $2az$。",
                ],
                [Q.of(-b, 2), `That leaves out the leading coefficient ${a}.`, `那漏掉了首项系数 ${a}。`],
              ],
              [
                [
                  ["Differentiate", "求导"],
                  [`$f'(z) = ${coefficient(2 * a, "z")}${addend(b)}$.`, `$f'(z) = ${coefficient(2 * a, "z")}${addend(b)}$。`],
                ],
                [
                  ["Solve f′ = 0", "解 f′ = 0"],
                  [`$z = \\frac{${-b}}{${2 * a}} = ${answer.toLatex()}$.`, `$z = \\frac{${-b}}{${2 * a}} = ${answer.toLatex()}$。`],
                ],
              ],
              [
                `Completing the square, $f(z) = ${a === 1 ? "" : a}\\left(z ${answer.sign() < 0 ? "+" : "-"} ${answer.abs().toLatex()}\\right)^2 + \\text{const}$, a square centred at $${answer.toLatex()}$, which doubles angles there.`,
                `配方得 $f(z) = ${a === 1 ? "" : a}\\left(z ${answer.sign() < 0 ? "+" : "-"} ${answer.abs().toLatex()}\\right)^2 + \\text{常数}$，这是以 $${answer.toLatex()}$ 为中心的平方，在那里把角度加倍。`,
              ],
            );
          }),
      ),
      figure: complexDrawings1["conformal-maps#where-conformality-fails"],
    },
  ],
);

/** complexAnalysisTopics holds the topics written for the Complex Analysis course. */
export const complexAnalysisTopics: readonly TopicDef[] = [
  lesson(
    complexFunctions,
    [
      "What is $f(z) = z^2 - 2z$ at $z = 3 + i$? With $z = x + iy$, $z^2 - 2z = (x^2 - y^2 - 2x) + i(2xy - 2y)$, so at $x = 3$, $y = 1$ the value is $(9 - 1 - 6) + i(6 - 2) = 2 + 4i$.",
      "$f(z) = z^2 - 2z$ 在 $z = 3 + i$ 处的值是多少？取 $z = x + iy$，$z^2 - 2z = (x^2 - y^2 - 2x) + i(2xy - 2y)$，所以在 $x = 3$，$y = 1$ 处值为 $(9 - 1 - 6) + i(6 - 2) = 2 + 4i$。",
    ],
    [
      "Directly, $(3 + i)^2 = 8 + 6i$ and $2(3 + i) = 6 + 2i$, and $8 + 6i - (6 + 2i) = 2 + 4i$.",
      "直接计算，$(3 + i)^2 = 8 + 6i$，$2(3 + i) = 6 + 2i$，而 $8 + 6i - (6 + 2i) = 2 + 4i$。",
    ],
    [
      "write a complex function as two real functions $u$ and $v$, and evaluate squares and reciprocals of complex numbers.",
      "把复变函数写成两个实函数 $u$ 和 $v$，并计算复数的平方和倒数。",
    ],
  ),
  lesson(
    complexLimits,
    [
      "Does $\\frac{z}{\\bar{z}}$ have a limit at 0? Along the real axis $z = x$, so the quotient is 1. Along the imaginary axis $z = iy$ and $\\bar{z} = -iy$, so the quotient is $-1$. Two directions give two values, so there is no limit.",
      "$\\frac{z}{\\bar{z}}$ 在 0 处有极限吗？沿实轴 $z = x$，商是 1。沿虚轴 $z = iy$，$\\bar{z} = -iy$，商是 $-1$。两个方向给出两个值，所以没有极限。",
    ],
    [
      "Along $y = x$, $\\frac{1 + i}{1 - i} = i$, a third value, which confirms that the quotient depends on the direction.",
      "沿 $y = x$，$\\frac{1 + i}{1 - i} = i$，又是一个不同的值，证实了这个商取决于方向。",
    ],
    [
      "test limits along lines through a point, and find limits of quotients by cancelling a common factor.",
      "沿过一点的直线检验极限，并通过约去公因式求商的极限。",
    ],
  ),
  lesson(
    complexDerivative,
    [
      "What is the derivative of $f(z) = z^2 + 4z$ at $z = 2i$? The power rule carries over, so $f'(z) = 2z + 4$, and $f'(2i) = 4 + 4i$.",
      "$f(z) = z^2 + 4z$ 在 $z = 2i$ 处的导数是多少？幂法则照样适用，所以 $f'(z) = 2z + 4$，$f'(2i) = 4 + 4i$。",
    ],
    [
      "The difference quotient is $\\frac{(2i + h)^2 + 4(2i + h) - (-4 + 8i)}{h} = 4i + h + 4$, which tends to $4 + 4i$ from every direction.",
      "差商是 $\\frac{(2i + h)^2 + 4(2i + h) - (-4 + 8i)}{h} = 4i + h + 4$，它从各个方向都趋向 $4 + 4i$。",
    ],
    [
      "differentiate polynomials by the familiar rules, and see why the conjugate, though continuous, has no derivative.",
      "用熟悉的法则对多项式求导，并了解共轭虽然连续，为什么没有导数。",
    ],
  ),
  lesson(
    cauchyRiemann,
    [
      "Is $f = x^2 + y^2 + 2ixy$ analytic? Here $u = x^2 + y^2$ and $v = 2xy$, so $u_x = 2x$ and $v_y = 2x$ agree, but $u_y = 2y$ while $-v_x = -2y$. The second equation holds only where $y = 0$, so $f$ is not analytic on any open set.",
      "$f = x^2 + y^2 + 2ixy$ 解析吗？这里 $u = x^2 + y^2$，$v = 2xy$，所以 $u_x = 2x$ 与 $v_y = 2x$ 一致，但 $u_y = 2y$，而 $-v_x = -2y$。第二个方程只在 $y = 0$ 处成立，所以 $f$ 在任何开集上都不解析。",
    ],
    [
      "$f = z^2 + 2y^2$, and $2y^2$ is a real function that is not constant, so adding it to the analytic $z^2$ breaks analyticity.",
      "$f = z^2 + 2y^2$，而 $2y^2$ 是不为常数的实函数，把它加到解析的 $z^2$ 上就破坏了解析性。",
    ],
    [
      "use the Cauchy–Riemann equations to test analyticity and to compute derivatives from partial derivatives.",
      "用柯西–黎曼方程检验解析性，并由偏导数计算导数。",
    ],
  ),
  lesson(
    harmonic,
    [
      "Is $u = x^3 - 3xy^2$ harmonic? $u_{xx} = 6x$ and $u_{yy} = -6x$, which add to 0, so it is. Its conjugate comes from $v_y = u_x = 3x^2 - 3y^2$ and $v_x = -u_y = 6xy$, giving $v = 3x^2y - y^3$.",
      "$u = x^3 - 3xy^2$ 是调和函数吗？$u_{xx} = 6x$，$u_{yy} = -6x$，和为 0，所以是。它的共轭由 $v_y = u_x = 3x^2 - 3y^2$ 和 $v_x = -u_y = 6xy$ 得到，即 $v = 3x^2y - y^3$。",
    ],
    [
      "$(x + iy)^3 = x^3 - 3xy^2 + i(3x^2y - y^3)$, so $u + iv = z^3$, which is analytic.",
      "$(x + iy)^3 = x^3 - 3xy^2 + i(3x^2y - y^3)$，所以 $u + iv = z^3$，它是解析的。",
    ],
    [
      "test functions for being harmonic, and find a harmonic conjugate from the Cauchy–Riemann equations.",
      "检验函数是否调和，并由柯西–黎曼方程求共轭调和函数。",
    ],
  ),
  lesson(
    complexExponential,
    [
      "What is $e^{2 + \\frac{\\pi}{2}i}$? Its modulus is $e^2$ and its argument is $\\frac{\\pi}{2}$, so it is $e^2(\\cos \\frac{\\pi}{2} + i\\sin \\frac{\\pi}{2}) = e^2 i$.",
      "$e^{2 + \\frac{\\pi}{2}i}$ 是多少？它的模是 $e^2$，辐角是 $\\frac{\\pi}{2}$，所以它是 $e^2(\\cos \\frac{\\pi}{2} + i\\sin \\frac{\\pi}{2}) = e^2 i$。",
    ],
    [
      "$e^{2} \\cdot e^{\\frac{\\pi}{2}i} = e^2 \\cdot i$, since $e^{\\frac{\\pi}{2}i}$ is a quarter turn of the unit circle.",
      "$e^{2} \\cdot e^{\\frac{\\pi}{2}i} = e^2 \\cdot i$，因为 $e^{\\frac{\\pi}{2}i}$ 是单位圆上的四分之一圈。",
    ],
    [
      "evaluate the exponential from its modulus and argument, and use its period $2\\pi i$.",
      "由模和辐角计算指数函数，并利用它的周期 $2\\pi i$。",
    ],
  ),
  lesson(
    complexLog,
    [
      "What is the principal logarithm of $-4$? Its modulus is 4 and its principal argument is $\\pi$, so $\\operatorname{Log}(-4) = \\ln 4 + \\pi i$.",
      "$-4$ 的主值对数是多少？它的模是 4，主辐角是 $\\pi$，所以 $\\operatorname{Log}(-4) = \\ln 4 + \\pi i$。",
    ],
    [
      "$e^{\\ln 4 + \\pi i} = 4e^{\\pi i} = -4$, and $\\pi$ lies in the principal range $(-\\pi, \\pi]$.",
      "$e^{\\ln 4 + \\pi i} = 4e^{\\pi i} = -4$，而 $\\pi$ 在主值范围 $(-\\pi, \\pi]$ 内。",
    ],
    [
      "find the real and imaginary parts of the principal logarithm, and see why the argument forces a choice of branch.",
      "求主值对数的实部和虚部，并了解辐角为什么迫使我们选择分支。",
    ],
  ),
  lesson(
    contourIntegrals,
    [
      "What is the integral of $z^2$ along the segment from 0 to $1 + i$? With $z = t(1 + i)$, $dz = (1 + i)\\,dt$, so the integral is $(1 + i)^3 \\int_0^1 t^2\\,dt = \\frac{(1 + i)^3}{3} = \\frac{-2 + 2i}{3}$.",
      "$z^2$ 沿从 0 到 $1 + i$ 的线段积分是多少？取 $z = t(1 + i)$，$dz = (1 + i)\\,dt$，所以积分是 $(1 + i)^3 \\int_0^1 t^2\\,dt = \\frac{(1 + i)^3}{3} = \\frac{-2 + 2i}{3}$。",
    ],
    [
      "$\\frac{z^3}{3}$ is an antiderivative, and $\\frac{(1 + i)^3}{3} = \\frac{-2 + 2i}{3}$ again.",
      "$\\frac{z^3}{3}$ 是原函数，而 $\\frac{(1 + i)^3}{3} = \\frac{-2 + 2i}{3}$，结果相同。",
    ],
    ["compute contour integrals by parametrizing circles and segments.", "通过把圆周和线段参数化来计算围道积分。"],
  ),
  lesson(
    cauchyTheorem,
    [
      "What is $\\oint \\frac{dz}{z - 3}$ around $|z| = 2$? The only singularity, 3, lies outside the circle, so the integrand is analytic on and inside it, and Cauchy's theorem gives 0.",
      "$\\oint \\frac{dz}{z - 3}$ 沿 $|z| = 2$ 是多少？唯一的奇点 3 在圆外，所以被积函数在圆周上及其内部解析，柯西定理给出 0。",
    ],
    [
      "On the disc $|z| < 3$, $\\log(z - 3)$ has a single-valued branch, an antiderivative, so the closed integral is 0.",
      "在圆盘 $|z| < 3$ 上，$\\log(z - 3)$ 有单值分支，它是原函数，所以闭路积分为 0。",
    ],
    [
      "decide whether a closed integral vanishes by locating the singularities, and integrate with antiderivatives.",
      "通过确定奇点的位置判断闭路积分是否为零，并用原函数积分。",
    ],
  ),
  lesson(
    cauchyFormula,
    [
      "What is $\\oint \\frac{e^z}{z - 1}\\,dz$ around $|z| = 2$? The point 1 is inside and $e^z$ is analytic, so Cauchy's formula gives $2\\pi i e^1 = 2\\pi e i$.",
      "$\\oint \\frac{e^z}{z - 1}\\,dz$ 沿 $|z| = 2$ 是多少？点 1 在里面，$e^z$ 解析，所以柯西公式给出 $2\\pi i e^1 = 2\\pi e i$。",
    ],
    [
      "The residue of $\\frac{e^z}{z - 1}$ at the simple pole 1 is $e^1$, and $2\\pi i \\cdot e$ is the same value.",
      "$\\frac{e^z}{z - 1}$ 在单极点 1 处的留数是 $e^1$，而 $2\\pi i \\cdot e$ 是同一个值。",
    ],
    ["recover values and derivatives of an analytic function from contour integrals.", "由围道积分求解析函数的值和导数。"],
  ),
  lesson(
    estimates,
    [
      "If $|f| \\le 6$ on the circle of radius 3 about $a$, how large can $|f'(a)|$ be? Cauchy's estimate gives $\\frac{1! \\cdot 6}{3} = 2$.",
      "如果在以 $a$ 为中心、半径为 3 的圆周上 $|f| \\le 6$，$|f'(a)|$ 最大能是多少？柯西估计给出 $\\frac{1! \\cdot 6}{3} = 2$。",
    ],
    [
      "$f(z) = 2(z - a)$ has $|f| = 6$ on the circle and $f'(a) = 2$, so the bound is reached.",
      "$f(z) = 2(z - a)$ 在圆周上 $|f| = 6$，而 $f'(a) = 2$，所以这个界能达到。",
    ],
    [
      "bound derivatives from a bound on a circle, see why bounded entire functions are constant, and find maxima on discs.",
      "由圆周上的界估计导数，了解有界整函数为什么是常数，并求圆盘上的最大值。",
    ],
  ),
  lesson(
    taylorComplex,
    [
      "What is the radius of convergence of the Taylor series of $\\frac{1}{1 + z^2}$ about 0? The singularities are $\\pm i$, both at distance 1, so the radius is 1, even though the function is smooth on the real line.",
      "$\\frac{1}{1 + z^2}$ 在 0 处的泰勒级数的收敛半径是多少？奇点是 $\\pm i$，距离都是 1，所以半径是 1，尽管函数在实数线上是光滑的。",
    ],
    [
      "The series is $1 - z^2 + z^4 - \\dots$, a geometric series in $-z^2$, which converges exactly when $|z| < 1$.",
      "级数是 $1 - z^2 + z^4 - \\dots$，它是关于 $-z^2$ 的几何级数，恰好在 $|z| < 1$ 时收敛。",
    ],
    ["find radii of convergence from singularities, and coefficients from known series.", "由奇点求收敛半径，并由已知级数求系数。"],
  ),
  lesson(
    laurent,
    [
      "What is the Laurent series of $\\frac{e^z}{z^2}$ about 0? Dividing $1 + z + \\frac{z^2}{2} + \\dots$ by $z^2$ gives $\\frac{1}{z^2} + \\frac{1}{z} + \\frac{1}{2} + \\frac{z}{6} + \\dots$, so the coefficient of $\\frac{1}{z}$ is 1.",
      "$\\frac{e^z}{z^2}$ 在 0 处的洛朗级数是什么？把 $1 + z + \\frac{z^2}{2} + \\dots$ 除以 $z^2$ 得 $\\frac{1}{z^2} + \\frac{1}{z} + \\frac{1}{2} + \\frac{z}{6} + \\dots$，所以 $\\frac{1}{z}$ 的系数是 1。",
    ],
    ["The residue at the double pole is the derivative of $e^z$ at 0, which is 1.", "二阶极点处的留数是 $e^z$ 在 0 处的导数，等于 1。"],
    [
      "find Laurent series by dividing known series and by geometric series, and read off the coefficient of $\\frac{1}{z}$.",
      "通过已知级数相除和几何级数求洛朗级数，并读出 $\\frac{1}{z}$ 的系数。",
    ],
  ),
  lesson(
    singularities,
    [
      "What kind of singularity does $\\frac{1 - \\cos z}{z^4}$ have at 0? Since $1 - \\cos z = \\frac{z^2}{2} - \\frac{z^4}{24} + \\dots$, the quotient is $\\frac{1}{2z^2} - \\frac{1}{24} + \\dots$, with finitely many negative powers: a pole of order 2.",
      "$\\frac{1 - \\cos z}{z^4}$ 在 0 处是什么奇点？因为 $1 - \\cos z = \\frac{z^2}{2} - \\frac{z^4}{24} + \\dots$，商是 $\\frac{1}{2z^2} - \\frac{1}{24} + \\dots$，负幂只有有限多个：是 2 阶极点。",
    ],
    [
      "The numerator has a zero of order 2 and the denominator one of order 4, and $4 - 2 = 2$.",
      "分子有 2 阶零点，分母有 4 阶零点，而 $4 - 2 = 2$。",
    ],
    [
      "classify isolated singularities from their Laurent series, and read the order of a pole.",
      "由洛朗级数对孤立奇点分类，并读出极点的阶。",
    ],
  ),
  lesson(
    residues,
    [
      "What is the residue of $\\frac{z}{(z - 2)(z + 1)}$ at 2? Covering $z - 2$ leaves $\\frac{z}{z + 1}$, which is $\\frac{2}{3}$ at $z = 2$.",
      "$\\frac{z}{(z - 2)(z + 1)}$ 在 2 处的留数是多少？盖住 $z - 2$ 剩下 $\\frac{z}{z + 1}$，在 $z = 2$ 处它是 $\\frac{2}{3}$。",
    ],
    [
      "Partial fractions give $\\frac{z}{(z - 2)(z + 1)} = \\frac{2/3}{z - 2} + \\frac{1/3}{z + 1}$, with $\\frac{2}{3}$ in front of $\\frac{1}{z - 2}$.",
      "部分分式给出 $\\frac{z}{(z - 2)(z + 1)} = \\frac{2/3}{z - 2} + \\frac{1/3}{z + 1}$，$\\frac{1}{z - 2}$ 前面是 $\\frac{2}{3}$。",
    ],
    [
      "compute residues at simple poles by covering up and at double poles by a derivative.",
      "用盖住法求单极点的留数，用导数求二阶极点的留数。",
    ],
  ),
  lesson(
    residueTheorem,
    [
      "What is $\\oint \\frac{z}{z^2 - 1}\\,dz$ around $|z| = 2$? Both poles $\\pm 1$ are inside, each with residue $\\frac{1}{2}$, so the integral is $2\\pi i \\cdot 1 = 2\\pi i$.",
      "$\\oint \\frac{z}{z^2 - 1}\\,dz$ 沿 $|z| = 2$ 是多少？两个极点 $\\pm 1$ 都在里面，留数各为 $\\frac{1}{2}$，所以积分是 $2\\pi i \\cdot 1 = 2\\pi i$。",
    ],
    [
      "For large $|z|$, $\\frac{z}{z^2 - 1} \\approx \\frac{1}{z}$, and the integral of $\\frac{1}{z}$ around a large circle is $2\\pi i$.",
      "当 $|z|$ 很大时，$\\frac{z}{z^2 - 1} \\approx \\frac{1}{z}$，而 $\\frac{1}{z}$ 沿大圆的积分是 $2\\pi i$。",
    ],
    ["add the residues inside a contour, and use a large semicircle to find real integrals.", "把围道内的留数相加，并用大半圆求实积分。"],
  ),
  lesson(
    mobiusMaps,
    [
      "Where does $f(z) = \\frac{z - i}{z + i}$ send $0$, $-i$ and infinity? $f(0) = -1$, the denominator vanishes at $-i$, so $f(-i) = \\infty$, and the ratio of leading coefficients gives $f(\\infty) = 1$.",
      "$f(z) = \\frac{z - i}{z + i}$ 把 $0$、$-i$ 和无穷远送到哪里？$f(0) = -1$；分母在 $-i$ 处为零，所以 $f(-i) = \\infty$；首项系数之比给出 $f(\\infty) = 1$。",
    ],
    [
      "For large $z$, $\\frac{1 - i/z}{1 + i/z} \\to 1$; and $ad - bc = i + i = 2i \\ne 0$, so the map is a genuine Möbius transformation.",
      "当 $z$ 很大时，$\\frac{1 - i/z}{1 + i/z} \\to 1$；而 $ad - bc = i + i = 2i \\ne 0$，所以这是真正的默比乌斯变换。",
    ],
    ["find poles, images of infinity and fixed points of Möbius transformations.", "求默比乌斯变换的极点、无穷远点的像和不动点。"],
  ),
  lesson(
    conformal,
    [
      "How does $f(z) = z^3$ act near $z = 1$? $f'(1) = 3$, so small figures are stretched by 3 and not turned. Near 0, $f'(0) = 0$, and there angles are tripled.",
      "$f(z) = z^3$ 在 $z = 1$ 附近怎样作用？$f'(1) = 3$，所以小图形被放大 3 倍且不旋转。在 0 附近 $f'(0) = 0$，那里角度变为三倍。",
    ],
    [
      "$(1 + h)^3 = 1 + 3h + 3h^2 + h^3$, so for small $h$ the change is close to $3h$.",
      "$(1 + h)^3 = 1 + 3h + 3h^2 + h^3$，所以 $h$ 很小时变化接近 $3h$。",
    ],
    [
      "find the local stretching and turning of an analytic map, and the critical points where angles are not preserved.",
      "求解析映射的局部伸缩和旋转，以及角度不被保持的临界点。",
    ],
  ),
];
