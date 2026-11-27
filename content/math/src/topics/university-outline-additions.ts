// The topics a standard syllabus of Number Theory, Real Analysis, Complex Analysis, Linear Programming or Partial
// Differential Equations includes beyond the rest of these courses: p-adic numbers and elliptic curves, measurable
// functions and the convergence theorems, Stone-Weierstrass, normal families, partial fraction expansions, the
// Schwarz-Christoffel formula, the ellipsoid and barrier methods, transforms on unbounded regions, fundamental
// solutions, weak solutions and finite elements.

import type { Rng, TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { complexDrawings2 } from "../explanation-drawings-complex-analysis-2.ts";
import { numberTheoryDrawings1 } from "../explanation-drawings-number-theory-1.ts";
import { pdeDrawings1 } from "../explanation-drawings-partial-differential-equations-1.ts";

import { type Pair, point, powMod, primesUpTo, same, topic } from "../university-kit.ts";
import { solved } from "./linear-programming.ts";
import { chosen, lesson, type Miss, pw, type Slip, until, worked } from "./number-theory-course.ts";

/** curvePoints lists the affine points of y^2 = x^3 + ax + b modulo a prime. */
function curvePoints(a: number, b: number, p: number): [number, number][] {
  const points: [number, number][] = [];
  for (let x = 0; x < p; x++) {
    for (let y = 0; y < p; y++) {
      if ((y * y - x * x * x - a * x - b) % p === 0) points.push([x, y]);
    }
  }
  return points;
}

/** pickCurve picks a nonsingular curve modulo a small prime that has enough points with distinct x and nonzero y. */
function pickCurve(rng: Rng, minPoints: number) {
  const p = rng.pick([11, 13, 17, 19, 23]);
  for (;;) {
    const a = rng.int(1, p - 1);
    const b = rng.int(1, p - 1);
    if ((4 * a * a * a + 27 * b * b) % p === 0) continue;
    const points = curvePoints(a, b, p);
    if (points.filter(([, y]) => y !== 0).length >= minPoints) return { p, a, b, points };
  }
}

/** mod reduces a whole number to its residue modulo a positive number. */
const mod = (v: number, p: number) => ((v % p) + p) % p;

/** inverse computes the inverse of a nonzero residue modulo a prime. */
const inverse = (v: number, p: number) => powMod(mod(v, p), p - 2, p);

/** curveLatex writes the equation of a curve modulo a prime. */
const curveLatex = (a: number, b: number) => `y^{2} = x^{3} + ${a === 1 ? "" : a}x + ${b}`;

const pAdicNumbers = topic(
  "p-adic-numbers",
  ["The p-adic Numbers", "p 进数"],
  ["Measure numbers by how divisible they are by a prime.", "用被一个素数整除的程度来度量数的大小。"],
  ["prime-valuations"],
  [],
  [
    point(
      "the-p-adic-absolute-value",
      ["The p-adic absolute value", "p 进绝对值"],
      [
        "Write a nonzero rational as $p^{k} \\cdot \\frac{m}{n}$ with $m$ and $n$ not divisible by $p$. Its $p$-adic absolute value is $|x|_{p} = p^{-k}$. High powers of $p$ make a number small, and powers of $p$ in the denominator make it large. For $\\frac{7}{12}$ and $p = 2$: $12 = 2^{2} \\cdot 3$, so $\\frac{7}{12} = 2^{-2} \\cdot \\frac{7}{3}$ and $\\left|\\frac{7}{12}\\right|_{2} = 2^{2} = 4$.\n\nCheck: the reciprocal $\\frac{12}{7} = 2^{2} \\cdot \\frac{3}{7}$ has $\\left|\\frac{12}{7}\\right|_{2} = \\frac{1}{4}$, and $4 \\cdot \\frac{1}{4} = 1$, as for any number and its reciprocal.\n\n> **Watch out.** A factor of $p$ in the denominator makes $k$ negative and the absolute value large; a factor of $p$ in the numerator makes it small.",
        "把非零有理数写成 $p^{k} \\cdot \\frac{m}{n}$，其中 $m$ 和 $n$ 不被 $p$ 整除。它的 $p$ 进绝对值是 $|x|_{p} = p^{-k}$。$p$ 的高次幂让数变小，分母中的 $p$ 让数变大。对 $\\frac{7}{12}$ 和 $p = 2$：$12 = 2^{2} \\cdot 3$，所以 $\\frac{7}{12} = 2^{-2} \\cdot \\frac{7}{3}$，$\\left|\\frac{7}{12}\\right|_{2} = 2^{2} = 4$。\n\n检验：倒数 $\\frac{12}{7} = 2^{2} \\cdot \\frac{3}{7}$ 的 $\\left|\\frac{12}{7}\\right|_{2} = \\frac{1}{4}$，而 $4 \\cdot \\frac{1}{4} = 1$，任何数与其倒数都是如此。\n\n> **注意。** 分母中的 $p$ 使 $k$ 为负，绝对值变大；分子中的 $p$ 使它变小。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5, 7]);
          const m = rng.pick([1, 2, 3, 5, 7, 11, 13].filter((v) => v % p !== 0));
          const n = rng.pick([1, 2, 3, 5, 7, 11, 13].filter((v) => v % p !== 0 && v !== m));
          const k = rng.int(1, 3);
          const below = rng.bool();
          const latex = below ? `\\frac{${m}}{${p ** k * n}}` : `\\frac{${p ** k * m}}{${n}}`;
          const shown = n === 1 && !below ? `${p ** k * m}` : latex;
          const answer = below ? Q.of(p ** k, 1) : Q.of(1, p ** k);
          const wrong = below ? Q.of(1, p ** k) : Q.of(p ** k, 1);
          const itself = below ? Q.of(m, p ** k * n) : Q.of(p ** k * m, n);
          const rest = Q.of(m, n);
          const power = below ? pw(p, k) : `${p}^{-${k}}`;
          const value = power === answer.toLatex() ? power : `${power} = ${answer.toLatex()}`;
          const misses: Miss[] = [
            [
              wrong,
              `That takes the sign of the exponent the wrong way round: ${below ? "a factor of $p$ in the denominator makes the number large" : "a factor of $p$ in the numerator makes the number small"}.`,
              `那把指数的符号弄反了：${below ? "分母中的 $p$ 使数变大" : "分子中的 $p$ 使数变小"}。`,
            ],
            [
              Q.of(1, p),
              `That uses only one factor of $${p}$; the number has $${p}$ to the power $${k}$.`,
              `那只用了一个因子 $${p}$；这个数含 $${p}$ 的 $${k}$ 次幂。`,
            ],
            [
              itself,
              "That is the ordinary size of the number, not its $p$-adic absolute value.",
              "那是这个数的普通大小，不是它的 $p$ 进绝对值。",
            ],
          ];
          return worked(
            [`What is $|${shown}|_{${p}}$?`, `$|${shown}|_{${p}}$ 是多少？`],
            answer,
            misses,
            [
              [
                ["Take out the powers of p", "提出 p 的幂"],
                [
                  `$${shown} = ${below ? `${p}^{-${k}}` : pw(p, k)} \\cdot ${rest.toLatex()}$, and $${p}$ divides neither $${m}$ nor $${n}$.`,
                  `$${shown} = ${below ? `${p}^{-${k}}` : pw(p, k)} \\cdot ${rest.toLatex()}$，而 $${p}$ 既不整除 $${m}$ 也不整除 $${n}$。`,
                ],
              ],
              [
                ["Flip the exponent", "指数变号"],
                [
                  `So $k = ${below ? `-${k}` : k}$ and $|x|_{${p}} = ${value}$.`,
                  `所以 $k = ${below ? `-${k}` : k}$，$|x|_{${p}} = ${value}$。`,
                ],
              ],
            ],
            [
              `The reciprocal has the opposite power of $${p}$, so its absolute value is $${wrong.toLatex()}$, and $${answer.toLatex()} \\cdot ${wrong.toLatex()} = 1$.`,
              `倒数中 $${p}$ 的幂次相反，所以它的绝对值是 $${wrong.toLatex()}$，而 $${answer.toLatex()} \\cdot ${wrong.toLatex()} = 1$。`,
            ],
          );
        }),
    ),
    point(
      "the-strong-triangle-inequality",
      ["The strong triangle inequality", "强三角不等式"],
      [
        "The $p$-adic absolute value satisfies $|x + y|_{p} \\le \\max(|x|_{p}, |y|_{p})$, and equality holds when the two sizes differ. Adding a smaller number cannot change the size of a larger one. For $p = 3$, $x = 3$ and $y = 27$: $|x|_{3} = \\frac{1}{3}$ and $|y|_{3} = \\frac{1}{27}$, and $x + y = 30 = 3 \\cdot 10$ with $3$ not dividing $10$, so $|x + y|_{3} = \\frac{1}{3}$, the larger of the two.\n\nCheck: $30 = 3 \\cdot (1 + 9)$, and $1 + 9$ leaves remainder $1$ on division by $3$, so only one factor of $3$ survives.\n\n> **Watch out.** When the two sizes are equal the sum can be smaller: $|1|_{3} = |2|_{3} = 1$ but $|1 + 2|_{3} = \\frac{1}{3}$.",
        "$p$ 进绝对值满足 $|x + y|_{p} \\le \\max(|x|_{p}, |y|_{p})$，两个大小不同时等号成立。加上一个较小的数不会改变较大数的大小。对 $p = 3$、$x = 3$、$y = 27$：$|x|_{3} = \\frac{1}{3}$，$|y|_{3} = \\frac{1}{27}$，而 $x + y = 30 = 3 \\cdot 10$，$3$ 不整除 $10$，所以 $|x + y|_{3} = \\frac{1}{3}$，即两者中较大的那个。\n\n检验：$30 = 3 \\cdot (1 + 9)$，而 $1 + 9$ 除以 $3$ 余 $1$，所以只剩一个因子 $3$。\n\n> **注意。** 两个大小相等时，和可能更小：$|1|_{3} = |2|_{3} = 1$，但 $|1 + 2|_{3} = \\frac{1}{3}$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5, 7]);
          const i = rng.int(0, 2);
          const j = i + rng.int(1, 3);
          const big = Q.of(1, p ** i);
          const small = Q.of(1, p ** j);
          const x = p ** i;
          const y = p ** j;
          const split = i === 0 ? `${x + y}` : `${x + y} = ${x} \\cdot ${1 + y / x}`;
          const misses: Miss[] = [
            [small, "That is the smaller of the two sizes; the sum keeps the larger one.", "那是两个大小中较小的那个；和保留较大的那个。"],
            [
              big.add(small),
              "That adds the sizes as in the ordinary triangle inequality; the $p$-adic size of a sum is at most the larger size.",
              "那像普通三角不等式一样把大小相加了；和的 $p$ 进大小至多是较大的那个。",
            ],
            [
              Q.of(1, p ** (i + j)),
              "That multiplies the sizes, which is the rule for a product, not a sum.",
              "那把大小相乘了，这是乘积的规则，不是和的规则。",
            ],
          ];
          return worked(
            [
              `If $|x|_{${p}} = ${big.toLatex()}$ and $|y|_{${p}} = ${small.toLatex()}$, what is $|x + y|_{${p}}$?`,
              `如果 $|x|_{${p}} = ${big.toLatex()}$ 且 $|y|_{${p}} = ${small.toLatex()}$，那么 $|x + y|_{${p}}$ 是多少？`,
            ],
            big,
            misses,
            [
              [
                ["Compare the sizes", "比较大小"],
                [
                  `$${big.toLatex()} > ${small.toLatex()}$, so the sizes differ and $|x|_{${p}}$ is the larger.`,
                  `$${big.toLatex()} > ${small.toLatex()}$，两个大小不同，$|x|_{${p}}$ 较大。`,
                ],
              ],
              [
                ["Apply the strong triangle inequality", "用强三角不等式"],
                [
                  `With different sizes equality holds, so $|x + y|_{${p}} = ${big.toLatex()}$.`,
                  `大小不同时等号成立，所以 $|x + y|_{${p}} = ${big.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Take $x = ${x}$ and $y = ${y}$: $x + y = ${split}$, and $${p}$ does not divide $${1 + y / x}$, so $|x + y|_{${p}} = ${big.toLatex()}$.`,
              `取 $x = ${x}$、$y = ${y}$：$x + y = ${split}$，而 $${p}$ 不整除 $${1 + y / x}$，所以 $|x + y|_{${p}} = ${big.toLatex()}$。`,
            ],
          );
        }),
    ),
    point(
      "a-series-that-converges-p-adically",
      ["A series that converges p-adically", "p 进收敛的级数"],
      [
        "Powers of $p$ tend to $0$ in the $p$-adic absolute value, so $1 + p + p^{2} + \\dots$ converges in the $p$-adic numbers. The geometric series formula still gives its sum, $\\frac{1}{1 - p}$. For $2 + 2 \\cdot 3 + 2 \\cdot 3^{2} + \\dots$ in the $3$-adic numbers the first term is $2$ and the ratio is $3$, so the sum is $\\frac{2}{1 - 3} = -1$.\n\nCheck: the partial sums are $2, 8, 26, 80$, and adding $1$ gives $3, 9, 27, 81$, powers of $3$ that tend to $0$ $3$-adically, so the partial sums tend to $-1$.\n\n> **Watch out.** The sum is negative even though every term is positive: the formula is $\\frac{a}{1 - r}$, not $\\frac{a}{r - 1}$.",
        "在 $p$ 进绝对值下，$p$ 的幂趋于 $0$，所以 $1 + p + p^{2} + \\dots$ 在 $p$ 进数中收敛。几何级数公式仍然给出它的和 $\\frac{1}{1 - p}$。对 $3$ 进数中的 $2 + 2 \\cdot 3 + 2 \\cdot 3^{2} + \\dots$，首项是 $2$，公比是 $3$，所以和是 $\\frac{2}{1 - 3} = -1$。\n\n检验：部分和是 $2, 8, 26, 80$，各加 $1$ 得 $3, 9, 27, 81$，这些 $3$ 的幂在 $3$ 进意义下趋于 $0$，所以部分和趋于 $-1$。\n\n> **注意。** 虽然每一项都是正的，和却是负的：公式是 $\\frac{a}{1 - r}$，不是 $\\frac{a}{r - 1}$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([2, 3, 5, 7, 11]);
          const c = rng.int(2, 9);
          const sum = Q.of(c, 1 - p);
          const misses: Miss[] = [
            [
              Q.of(c, p - 1),
              "That uses $\\frac{a}{r - 1}$; the geometric series formula is $\\frac{a}{1 - r}$, which is negative here.",
              "那用了 $\\frac{a}{r - 1}$；几何级数公式是 $\\frac{a}{1 - r}$，这里是负数。",
            ],
            [
              Q.of(c * p, 1 - p),
              `That starts the series at $${c} \\cdot ${p}$; the first term is $${c}$.`,
              `那把级数从 $${c} \\cdot ${p}$ 开始了；首项是 $${c}$。`,
            ],
            [
              Q.of(1, 1 - p),
              `That drops the first term $${c}$ and sums $1 + ${p} + ${p}^{2} + \\dots$ instead.`,
              `那丢掉了首项 $${c}$，求的是 $1 + ${p} + ${p}^{2} + \\dots$。`,
            ],
          ];
          const second = c + c * p;
          return worked(
            [
              `What is the sum of $${c} + ${c} \\cdot ${p} + ${c} \\cdot ${p}^{2} + \\dots$ in the ${p}-adic numbers?`,
              `$${c} + ${c} \\cdot ${p} + ${c} \\cdot ${p}^{2} + \\dots$ 在 ${p} 进数中的和是多少？`,
            ],
            sum,
            misses,
            [
              [
                ["Check convergence", "检验收敛"],
                [
                  `The terms $${c} \\cdot ${p}^{n}$ have size $${p}^{-n}$, which tends to $0$, so the series converges ${p}-adically.`,
                  `各项 $${c} \\cdot ${p}^{n}$ 的大小是 $${p}^{-n}$，趋于 $0$，所以级数 ${p} 进收敛。`,
                ],
              ],
              [
                ["Use the formula", "用公式"],
                [
                  `First term $${c}$, ratio $${p}$: the sum is $\\frac{${c}}{1 - ${p}} = ${sum.toLatex()}$.`,
                  `首项 $${c}$，公比 $${p}$：和是 $\\frac{${c}}{1 - ${p}} = ${sum.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The partial sum $${c} + ${c * p} = ${second}$ differs from $${sum.toLatex()}$ by $${Q.of(second, 1).sub(sum).toLatex()}$, whose numerator is divisible by $${p}^{2}$, and later partial sums come closer still.`,
              `部分和 $${c} + ${c * p} = ${second}$ 与 $${sum.toLatex()}$ 相差 $${Q.of(second, 1).sub(sum).toLatex()}$，其分子被 $${p}^{2}$ 整除，后面的部分和更接近。`,
            ],
          );
        }),
    ),
  ],
);

const ellipticCurves = topic(
  "elliptic-curves-modulo-a-prime",
  ["Elliptic Curves Modulo a Prime", "模素数的椭圆曲线"],
  ["Find the points of a cubic curve over a finite field.", "求有限域上三次曲线的点。"],
  ["quadratic-residues"],
  [],
  [
    point(
      "points-on-the-curve",
      ["Points on the curve", "曲线上的点"],
      [
        "An elliptic curve modulo $p$ is the set of solutions of $y^{2} = x^{3} + ax + b$ modulo $p$, together with one extra point at infinity, where $4a^{3} + 27b^{2}$ is not $0$ modulo $p$. To test a point, compute both sides modulo $p$. On $y^{2} = x^{3} + x + 1$ modulo $5$, test $(2, 1)$: the right side is $8 + 2 + 1 = 11$, which is $1$ modulo $5$, and $1^{2} = 1$, so the point lies on the curve. For $(1, 2)$ the right side is $3$ but $2^{2} = 4$, so it does not.\n\nCheck: $4 \\cdot 1^{3} + 27 \\cdot 1^{2} = 31$, which is $1$ modulo $5$, so the curve is nonsingular; and $(2, 4)$ lies on it too, since $4^{2} = 16$ is also $1$ modulo $5$.\n\n> **Watch out.** Reduce both sides modulo $p$ before comparing; $11$ and $1$ are different integers but the same residue.",
        "模 $p$ 的椭圆曲线是 $y^{2} = x^{3} + ax + b$ 模 $p$ 的解集，再加上一个无穷远点，其中 $4a^{3} + 27b^{2}$ 模 $p$ 不为 $0$。要检验一个点，就在模 $p$ 下计算等式两边。在模 $5$ 的 $y^{2} = x^{3} + x + 1$ 上检验 $(2, 1)$：右边是 $8 + 2 + 1 = 11$，模 $5$ 为 $1$，而 $1^{2} = 1$，所以这个点在曲线上。对 $(1, 2)$，右边是 $3$，但 $2^{2} = 4$，所以不在。\n\n检验：$4 \\cdot 1^{3} + 27 \\cdot 1^{2} = 31$，模 $5$ 为 $1$，所以曲线非奇异；$(2, 4)$ 也在曲线上，因为 $4^{2} = 16$ 模 $5$ 也是 $1$。\n\n> **注意。** 比较之前要把两边都模 $p$ 约化；$11$ 和 $1$ 是不同的整数，却是相同的余数。",
      ],
      (rng) => {
        const { p, a, b, points } = pickCurve(rng, 2);
        const [x, y] = rng.pick(points);
        const right = mod(x * x * x + a * x + b, p);
        const off: Slip[] = [];
        for (const dy of [1, 2, 3, 4, 5]) {
          const yy = mod(y + dy, p);
          if (!points.some(([u, v]) => u === x && v === yy))
            off.push([
              same(`(${x}, ${yy})`),
              `There $${yy}^{2}$ is ${mod(yy * yy, p)} modulo ${p}, but the right side at $x = ${x}$ is ${right}.`,
              `这里 $${yy}^{2}$ 模 ${p} 是 ${mod(yy * yy, p)}，但 $x = ${x}$ 时右边是 ${right}。`,
            ]);
        }
        return chosen(
          rng,
          [`Which point lies on $${curveLatex(a, b)}$ modulo ${p}?`, `哪个点在模 ${p} 的曲线 $${curveLatex(a, b)}$ 上？`],
          same(`(${x}, ${y})`),
          off.slice(0, 3),
          [
            [
              ["Compute the right side", "计算右边"],
              [
                `At $x = ${x}$: $${x}^{3} + ${a} \\cdot ${x} + ${b} = ${x * x * x + a * x + b}$, which is ${right} modulo ${p}.`,
                `当 $x = ${x}$：$${x}^{3} + ${a} \\cdot ${x} + ${b} = ${x * x * x + a * x + b}$，模 ${p} 为 ${right}。`,
              ],
            ],
            [
              ["Square each y", "平方每个 y"],
              [
                `$${y}^{2} = ${y * y}$, which is ${mod(y * y, p)} modulo ${p}, the same residue, so $(${x}, ${y})$ is on the curve; the other choices square to other residues.`,
                `$${y}^{2} = ${y * y}$，模 ${p} 为 ${mod(y * y, p)}，余数相同，所以 $(${x}, ${y})$ 在曲线上；其他选项平方后余数不同。`,
              ],
            ],
          ],
          y === 0
            ? [
                `Here the right side is $0$, and $y = 0$ is its only square root modulo ${p}, so $(${x}, 0)$ is the one point with $x = ${x}$.`,
                `这里右边是 $0$，模 ${p} 时它唯一的平方根是 $y = 0$，所以 $(${x}, 0)$ 是 $x = ${x}$ 时唯一的点。`,
              ]
            : [
                `The point $(${x}, ${mod(-y, p)})$ lies on the curve as well, because $${mod(-y, p)}^{2} = ${mod(-y, p) ** 2}$ is also ${right} modulo ${p}.`,
                `点 $(${x}, ${mod(-y, p)})$ 也在曲线上，因为 $${mod(-y, p)}^{2} = ${mod(-y, p) ** 2}$ 模 ${p} 也是 ${right}。`,
              ],
        );
      },
    ),
    point(
      "counting-the-points",
      ["Counting the points", "数点的个数"],
      [
        "For each $x$, the right side is a residue, $0$ or a nonresidue. These give two values of $y$, one value and no value. Add up the counts and then add $1$ for the point at infinity. On $y^{2} = x^{3} + x + 1$ modulo $5$ the squares are $0, 1, 4$. For $x = 0, 1, 2, 3, 4$ the right side is $1, 3, 1, 1, 4$: four residues and one nonresidue, so there are $2 + 0 + 2 + 2 + 2 = 8$ affine points and $9$ points in all.\n\nCheck: Hasse's bound allows $|N - 6| \\le 2\\sqrt{5} \\approx 4.47$, and $|9 - 6| = 3$ fits.\n\n> **Watch out.** Do not forget the point at infinity, and count an $x$ whose right side is $0$ only once.",
        "对每个 $x$，右边是二次剩余、$0$ 或非剩余，分别给出 $y$ 的两个值、一个值和没有值。把个数相加，再为无穷远点加 $1$。在模 $5$ 的 $y^{2} = x^{3} + x + 1$ 上，平方数是 $0, 1, 4$。对 $x = 0, 1, 2, 3, 4$，右边是 $1, 3, 1, 1, 4$：四个剩余、一个非剩余，所以有 $2 + 0 + 2 + 2 + 2 = 8$ 个仿射点，共 $9$ 个点。\n\n检验：哈塞界允许 $|N - 6| \\le 2\\sqrt{5} \\approx 4.47$，而 $|9 - 6| = 3$ 符合。\n\n> **注意。** 不要忘记无穷远点；右边为 $0$ 的 $x$ 只算一个点。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([5, 7, 11]);
          let a = rng.int(1, p - 1);
          let b = rng.int(1, p - 1);
          while ((4 * a * a * a + 27 * b * b) % p === 0) {
            a = rng.int(1, p - 1);
            b = rng.int(1, p - 1);
          }
          const points = curvePoints(a, b, p);
          const affine = points.length;
          const xs = Array.from({ length: p }, (_, x) => x);
          const counts = xs.map((x) => points.filter(([u]) => u === x).length);
          const rights = xs.map((x) => mod(x * x * x + a * x + b, p));
          const hit = counts.filter((v) => v > 0).length;
          const zeros = counts.filter((v, x) => v === 1 && rights[x] === 0).length;
          const misses: Miss[] = [
            [affine, "That leaves out the point at infinity.", "那漏掉了无穷远点。"],
            [
              hit + 1,
              "That counts each $x$ that gives a point once, but a nonzero residue has two square roots $y$ and $-y$.",
              "那把每个有点的 $x$ 只算了一次，但非零剩余有两个平方根 $y$ 和 $-y$。",
            ],
            [
              affine + 1 + zeros,
              "That counts $y = 0$ twice where the right side is $0$; there $y$ and $-y$ are the same.",
              "那在右边为 $0$ 处把 $y = 0$ 算了两次；那里 $y$ 与 $-y$ 相同。",
            ],
            [
              p + 1,
              `That is only the average $p + 1 = ${p + 1}$; the true count must be found by going through the values of $x$.`,
              `那只是平均值 $p + 1 = ${p + 1}$；真正的个数要逐个检查 $x$ 才能得到。`,
            ],
          ];
          const N = affine + 1;
          return worked(
            [
              `How many points, including the point at infinity, does $${curveLatex(a, b)}$ have modulo ${p}?`,
              `模 ${p} 时，$${curveLatex(a, b)}$ 有多少个点（包括无穷远点）？`,
            ],
            N,
            misses,
            [
              [
                ["Evaluate the right side", "计算右边"],
                [
                  `For $x = 0, \\dots, ${p - 1}$ the right side is $${rights.join(", ")}$ modulo ${p}.`,
                  `对 $x = 0, \\dots, ${p - 1}$，右边模 ${p} 依次是 $${rights.join(", ")}$。`,
                ],
              ],
              [
                ["Count the square roots", "数平方根"],
                [
                  `These give $${counts.join(" + ")} = ${affine}$ values of $y$, so there are ${affine} affine points.`,
                  `这些给出 $${counts.join(" + ")} = ${affine}$ 个 $y$ 值，所以有 ${affine} 个仿射点。`,
                ],
              ],
              [
                ["Add infinity", "加上无穷远点"],
                [`With the point at infinity, $N = ${affine} + 1 = ${N}$.`, `加上无穷远点，$N = ${affine} + 1 = ${N}$。`],
              ],
            ],
            [
              `Hasse's bound allows $|N - ${p + 1}| \\le 2\\sqrt{${p}}$, about ${(2 * Math.sqrt(p)).toFixed(2)}, and $|${N} - ${p + 1}| = ${Math.abs(N - p - 1)}$ fits.`,
              `哈塞界允许 $|N - ${p + 1}| \\le 2\\sqrt{${p}}$，约为 ${(2 * Math.sqrt(p)).toFixed(2)}，而 $|${N} - ${p + 1}| = ${Math.abs(N - p - 1)}$ 符合。`,
            ],
          );
        }),
    ),
    point(
      "the-size-of-the-group",
      ["The size of the group", "群的大小"],
      [
        "Hasse's theorem says that the number $N$ of points satisfies $|N - (p + 1)| \\le 2\\sqrt{p}$. About half the values of $x$ give two points, so $N$ stays close to $p + 1$. For $p = 101$: $2\\sqrt{101} = \\sqrt{404}$, and $20^{2} = 400 \\le 404 < 441 = 21^{2}$, so $N$ lies between $102 - 20 = 82$ and $102 + 20 = 122$.\n\nCheck: the curve modulo $5$ with $9$ points has $|9 - 6| = 3$, inside the bound $2\\sqrt{5} \\approx 4.47$.\n\n> **Watch out.** The centre is $p + 1$, not $p$, and the bound is $2\\sqrt{p}$ rounded down, since $N$ is a whole number.",
        "哈塞定理说，点的个数 $N$ 满足 $|N - (p + 1)| \\le 2\\sqrt{p}$。大约一半的 $x$ 给出两个点，所以 $N$ 接近 $p + 1$。对 $p = 101$：$2\\sqrt{101} = \\sqrt{404}$，而 $20^{2} = 400 \\le 404 < 441 = 21^{2}$，所以 $N$ 介于 $102 - 20 = 82$ 与 $102 + 20 = 122$ 之间。\n\n检验：模 $5$ 时有 $9$ 个点的曲线满足 $|9 - 6| = 3$，在界 $2\\sqrt{5} \\approx 4.47$ 之内。\n\n> **注意。** 中心是 $p + 1$，不是 $p$；界 $2\\sqrt{p}$ 要向下取整，因为 $N$ 是整数。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick(primesUpTo(1000).filter((v) => v > 100));
          const widest = Math.floor(2 * Math.sqrt(p));
          const top = p + 1 + widest;
          const misses: Miss[] = [
            [p + widest, "That centres the bound at $p$; the centre is $p + 1$.", "那把中心放在 $p$；中心是 $p + 1$。"],
            [p + 1 - widest, "That is the smallest count allowed, not the largest.", "那是允许的最小点数，不是最大点数。"],
            [
              p + 1 + 2 * widest,
              "That doubles the bound twice; the allowed distance is $2\\sqrt{p}$, not $4\\sqrt{p}$.",
              "那把界加倍了两次；允许的距离是 $2\\sqrt{p}$，不是 $4\\sqrt{p}$。",
            ],
            [
              top + 1,
              `That rounds $2\\sqrt{${p}}$ up; since $N$ is whole the distance can be at most ${widest}.`,
              `那把 $2\\sqrt{${p}}$ 向上取整了；因为 $N$ 是整数，距离至多是 ${widest}。`,
            ],
          ];
          return worked(
            [
              `Hasse's theorem bounds the number of points of an elliptic curve modulo ${p}. What is the largest whole number it allows?`,
              `哈塞定理限制了模 ${p} 的椭圆曲线的点数。它允许的最大整数是多少？`,
            ],
            top,
            misses,
            [
              [
                ["Size up the bound", "估计界"],
                [
                  `$2\\sqrt{${p}} = \\sqrt{${4 * p}}$, and $${widest}^{2} = ${widest * widest} \\le ${4 * p} < ${(widest + 1) ** 2} = ${widest + 1}^{2}$, so the distance from $p + 1$ is at most ${widest}.`,
                  `$2\\sqrt{${p}} = \\sqrt{${4 * p}}$，而 $${widest}^{2} = ${widest * widest} \\le ${4 * p} < ${(widest + 1) ** 2} = ${widest + 1}^{2}$，所以与 $p + 1$ 的距离至多是 ${widest}。`,
                ],
              ],
              [
                ["Add it to the centre", "加到中心上"],
                [`$N \\le ${p} + 1 + ${widest} = ${top}$.`, `$N \\le ${p} + 1 + ${widest} = ${top}$。`],
              ],
            ],
            [
              `The other end is $${p + 1} - ${widest} = ${p + 1 - widest}$, and the window from ${p + 1 - widest} to ${top} is centred on $${p + 1}$.`,
              `另一端是 $${p + 1} - ${widest} = ${p + 1 - widest}$，从 ${p + 1 - widest} 到 ${top} 的区间以 $${p + 1}$ 为中心。`,
            ],
          );
        }),
    ),
  ],
);

const curveAddition = topic(
  "adding-points-on-an-elliptic-curve",
  ["Adding Points on an Elliptic Curve", "椭圆曲线上的点加法"],
  ["Use the chord and tangent rule to make the points into a group.", "用弦切法则让这些点构成一个群。"],
  ["elliptic-curves-modulo-a-prime"],
  [],
  [
    point(
      "the-slope-of-a-chord",
      ["The slope of a chord", "弦的斜率"],
      [
        "The line through $P = (x_{1}, y_{1})$ and $Q = (x_{2}, y_{2})$ with $x_{1} \\ne x_{2}$ has slope $m = (y_{2} - y_{1})(x_{2} - x_{1})^{-1}$ modulo $p$. Division is not available modulo a prime, so dividing means multiplying by a modular inverse. Find that inverse first, and then multiply it by the difference of the second coordinates. Modulo $11$, through $(2, 3)$ and $(5, 9)$: the differences are $3$ and $6$, the inverse of $3$ is $4$ because $3 \\cdot 4 = 12$ is $1$ modulo $11$, and $6 \\cdot 4 = 24$ is $2$ modulo $11$, so $m = 2$.\n\nCheck: $m \\cdot 3 = 6$, the difference of the second coordinates, as a slope must satisfy.\n\n> **Watch out.** Subtract in the same order on top and bottom; mixing $y_{2} - y_{1}$ with $x_{1} - x_{2}$ gives $-m$.",
        "过 $P = (x_{1}, y_{1})$ 和 $Q = (x_{2}, y_{2})$（$x_{1} \\ne x_{2}$）的直线斜率是模 $p$ 下的 $m = (y_{2} - y_{1})(x_{2} - x_{1})^{-1}$。模素数时没有普通的除法，除以一个数就是乘以它的模逆元。先求出逆元，再乘以第二个坐标的差。模 $11$ 时过 $(2, 3)$ 和 $(5, 9)$：两个差是 $3$ 和 $6$，$3$ 的逆元是 $4$，因为 $3 \\cdot 4 = 12$ 模 $11$ 为 $1$，而 $6 \\cdot 4 = 24$ 模 $11$ 为 $2$，所以 $m = 2$。\n\n检验：$m \\cdot 3 = 6$，正是第二个坐标的差，斜率本应满足这一点。\n\n> **注意。** 分子分母要按同样的顺序相减；把 $y_{2} - y_{1}$ 与 $x_{1} - x_{2}$ 混用会得到 $-m$。",
      ],
      (rng) =>
        until(() => {
          const p = rng.pick([11, 13, 17, 19, 23]);
          const x1 = rng.int(0, p - 2);
          const x2 = rng.int(x1 + 1, p - 1);
          const y1 = rng.int(0, p - 1);
          const y2 = rng.int(0, p - 1);
          const dx = mod(x2 - x1, p);
          const dy = mod(y2 - y1, p);
          const inv = inverse(dx, p);
          const m = mod(dy * inv, p);
          const misses: Miss[] = [
            [
              dy,
              "That is only the rise; it still has to be multiplied by the inverse of the run.",
              "那只是纵向的差；还要乘以横向差的逆元。",
            ],
            [
              inv,
              "That is only the inverse of the run; it still has to be multiplied by the rise.",
              "那只是横向差的逆元；还要乘以纵向的差。",
            ],
            [
              mod(-dy * inv, p),
              "That subtracts in opposite orders on top and bottom, which gives $-m$.",
              "那在分子分母中按相反顺序相减，得到 $-m$。",
            ],
            [mod(dy * dx, p), "That multiplies by the run instead of by its inverse.", "那乘以横向差本身，而不是它的逆元。"],
          ];
          return worked(
            [
              `Modulo ${p}, what is the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$? Give a residue from 0 to ${p - 1}.`,
              `模 ${p} 时，过 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$ 的直线斜率是多少？给出 0 到 ${p - 1} 之间的余数。`,
            ],
            m,
            misses,
            [
              [
                ["Take the differences", "求差"],
                [
                  `$x_{2} - x_{1} = ${dx}$ and $y_{2} - y_{1}$ is ${dy} modulo ${p}.`,
                  `$x_{2} - x_{1} = ${dx}$，$y_{2} - y_{1}$ 模 ${p} 为 ${dy}。`,
                ],
              ],
              [
                ["Invert the run", "求逆元"],
                [
                  `$${dx} \\cdot ${inv} = ${dx * inv}$, which is $1$ modulo ${p}, so the inverse of ${dx} is ${inv}.`,
                  `$${dx} \\cdot ${inv} = ${dx * inv}$，模 ${p} 为 $1$，所以 ${dx} 的逆元是 ${inv}。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  `$${dy} \\cdot ${inv} = ${dy * inv}$, which is ${m} modulo ${p}.`,
                  `$${dy} \\cdot ${inv} = ${dy * inv}$，模 ${p} 为 ${m}。`,
                ],
              ],
            ],
            [
              `$${m} \\cdot ${dx} = ${m * dx}$, which is ${dy} modulo ${p}, the rise, as it should be.`,
              `$${m} \\cdot ${dx} = ${m * dx}$，模 ${p} 为 ${dy}，正是纵向的差。`,
            ],
          );
        }),
    ),
    {
      ...point(
        "adding-two-different-points",
        ["Adding two different points", "两个不同点相加"],
        [
          "With slope $m$ through $P$ and $Q$, the sum has first coordinate $x_{3} = m^{2} - x_{1} - x_{2}$. The line meets the curve at a third point, and reflecting that point gives the sum, so $y_{3} = m(x_{1} - x_{3}) - y_{1}$. On $y^{2} = x^{3} - x + 1$ take $P = (0, 1)$ and $Q = (1, 1)$: the slope is $m = \\frac{1 - 1}{1 - 0} = 0$, so $x_{3} = 0 - 0 - 1 = -1$. The line $y = 1$ meets the curve again at $(-1, 1)$, and reflecting gives $P + Q = (-1, -1)$, since $y_{3} = 0 \\cdot (0 + 1) - 1 = -1$.\n\nCheck: $(-1)^{3} - (-1) + 1 = 1 = (-1)^{2}$, so $(-1, -1)$ lies on the curve.\n\n> **Watch out.** The third point on the line is not the sum; the sum is its reflection, with the sign of $y$ changed.",
          "设过 $P$ 和 $Q$ 的斜率为 $m$，和的第一个坐标是 $x_{3} = m^{2} - x_{1} - x_{2}$。直线与曲线交于第三点，把它反射就得到和，所以 $y_{3} = m(x_{1} - x_{3}) - y_{1}$。在 $y^{2} = x^{3} - x + 1$ 上取 $P = (0, 1)$、$Q = (1, 1)$：斜率 $m = \\frac{1 - 1}{1 - 0} = 0$，所以 $x_{3} = 0 - 0 - 1 = -1$。直线 $y = 1$ 与曲线再交于 $(-1, 1)$，反射得 $P + Q = (-1, -1)$，因为 $y_{3} = 0 \\cdot (0 + 1) - 1 = -1$。\n\n检验：$(-1)^{3} - (-1) + 1 = 1 = (-1)^{2}$，所以 $(-1, -1)$ 在曲线上。\n\n> **注意。** 直线上的第三个交点不是和；和是它的反射，$y$ 要变号。",
        ],
        (rng) =>
          until(() => {
            const { p, a, b, points } = pickCurve(rng, 2);
            const [x1, y1] = rng.pick(points);
            const others = points.filter(([x]) => x !== x1);
            if (others.length === 0) return undefined;
            const [x2, y2] = rng.pick(others);
            const dx = mod(x2 - x1, p);
            const dy = mod(y2 - y1, p);
            const m = mod(dy * inverse(dx, p), p);
            const x3 = mod(m * m - x1 - x2, p);
            const y3 = mod(m * (x1 - x3) - y1, p);
            const misses: Miss[] = [
              [
                mod(x1 + x2, p),
                "That adds the first coordinates; points on a curve do not add coordinate by coordinate.",
                "那把第一个坐标相加了；曲线上的点不是逐坐标相加的。",
              ],
              [
                mod(m * m, p),
                "That stops at $m^{2}$ and forgets to subtract $x_{1}$ and $x_{2}$.",
                "那停在 $m^{2}$，忘了减去 $x_{1}$ 和 $x_{2}$。",
              ],
              [mod(m - x1 - x2, p), "That uses $m$ instead of $m^{2}$.", "那用了 $m$ 而不是 $m^{2}$。"],
              [
                mod(m * m + x1 + x2, p),
                "That adds $x_{1}$ and $x_{2}$ to $m^{2}$ instead of subtracting them.",
                "那把 $x_{1}$ 和 $x_{2}$ 加到 $m^{2}$ 上，而不是减去。",
              ],
            ];
            return worked(
              [
                `On $${curveLatex(a, b)}$ modulo ${p}, what is the first coordinate of $(${x1}, ${y1}) + (${x2}, ${y2})$?`,
                `在模 ${p} 的 $${curveLatex(a, b)}$ 上，$(${x1}, ${y1}) + (${x2}, ${y2})$ 的第一个坐标是多少？`,
              ],
              x3,
              misses,
              [
                [
                  ["Find the slope", "求斜率"],
                  [
                    `The differences are ${dx} and ${dy}, the inverse of ${dx} is ${inverse(dx, p)}, and $m = ${dy} \\cdot ${inverse(dx, p)}$, which is ${m} modulo ${p}.`,
                    `两个差是 ${dx} 和 ${dy}，${dx} 的逆元是 ${inverse(dx, p)}，$m = ${dy} \\cdot ${inverse(dx, p)}$，模 ${p} 为 ${m}。`,
                  ],
                ],
                [
                  ["Apply the formula", "代入公式"],
                  [
                    `$x_{3} = ${m}^{2} - ${x1} - ${x2} = ${m * m - x1 - x2}$, which is ${x3} modulo ${p}.`,
                    `$x_{3} = ${m}^{2} - ${x1} - ${x2} = ${m * m - x1 - x2}$，模 ${p} 为 ${x3}。`,
                  ],
                ],
              ],
              [
                `Then $y_{3} = ${m} \\cdot (${x1} - ${x3}) - ${y1}$, which is ${y3} modulo ${p}, and $${y3}^{2}$ and $${x3}^{3} + ${a} \\cdot ${x3} + ${b}$ are both ${mod(y3 * y3, p)} modulo ${p}, so the sum lies on the curve.`,
                `于是 $y_{3} = ${m} \\cdot (${x1} - ${x3}) - ${y1}$，模 ${p} 为 ${y3}；$${y3}^{2}$ 与 $${x3}^{3} + ${a} \\cdot ${x3} + ${b}$ 模 ${p} 都是 ${mod(y3 * y3, p)}，所以和在曲线上。`,
              ],
            );
          }),
      ),
      figure: numberTheoryDrawings1["adding-points-on-an-elliptic-curve#adding-two-different-points"],
    },
    point(
      "doubling-a-point",
      ["Doubling a point", "点的倍乘"],
      [
        "To add $P$ to itself, use the tangent line. Implicit differentiation gives the slope $m = (3x_{1}^{2} + a)(2y_{1})^{-1}$ modulo $p$, and then $x_{3} = m^{2} - 2x_{1}$. On $y^{2} = x^{3} + x + 1$ modulo $5$ with $P = (0, 1)$: $3 \\cdot 0^{2} + 1 = 1$ and $2 \\cdot 1 = 2$, whose inverse is $3$, so $m = 3$ and $x_{3} = 9 - 0 = 9$, which is $4$ modulo $5$. Then $y_{3} = 3 \\cdot (0 - 4) - 1 = -13$, which is $2$ modulo $5$, so $2P = (4, 2)$.\n\nCheck: $4^{3} + 4 + 1 = 69$ is $4$ modulo $5$, and $2^{2} = 4$, so $(4, 2)$ lies on the curve.\n\n> **Watch out.** Include the $a$ in $3x_{1}^{2} + a$, and subtract $2x_{1}$, not $x_{1}$; a point with $y_{1} = 0$ has a vertical tangent and doubles to the point at infinity.",
        "要把 $P$ 与自身相加，就用切线。隐函数求导给出斜率 $m = (3x_{1}^{2} + a)(2y_{1})^{-1}$（模 $p$），然后 $x_{3} = m^{2} - 2x_{1}$。在模 $5$ 的 $y^{2} = x^{3} + x + 1$ 上取 $P = (0, 1)$：$3 \\cdot 0^{2} + 1 = 1$，$2 \\cdot 1 = 2$，它的逆元是 $3$，所以 $m = 3$，$x_{3} = 9 - 0 = 9$，模 $5$ 为 $4$。于是 $y_{3} = 3 \\cdot (0 - 4) - 1 = -13$，模 $5$ 为 $2$，所以 $2P = (4, 2)$。\n\n检验：$4^{3} + 4 + 1 = 69$ 模 $5$ 为 $4$，而 $2^{2} = 4$，所以 $(4, 2)$ 在曲线上。\n\n> **注意。** $3x_{1}^{2} + a$ 中不要漏掉 $a$，要减去 $2x_{1}$ 而不是 $x_{1}$；$y_{1} = 0$ 的点切线竖直，倍乘得到无穷远点。",
      ],
      (rng) =>
        until(() => {
          const { p, a, b, points } = pickCurve(rng, 1);
          const [x, y] = rng.pick(points.filter(([, v]) => v !== 0));
          const top = mod(3 * x * x + a, p);
          const inv = inverse(2 * y, p);
          const m = mod(top * inv, p);
          const x3 = mod(m * m - 2 * x, p);
          const y3 = mod(m * (x - x3) - y, p);
          const bare = mod(3 * x * x * inv, p);
          const misses: Miss[] = [
            [
              mod(2 * x, p),
              "That doubles the first coordinate; doubling a point is not doubling its coordinates.",
              "那把第一个坐标加倍了；点的倍乘不是坐标加倍。",
            ],
            [mod(m * m, p), "That stops at $m^{2}$ and forgets to subtract $2x_{1}$.", "那停在 $m^{2}$，忘了减去 $2x_{1}$。"],
            [
              mod(m * m - x, p),
              "That subtracts $x_{1}$ once; the tangent touches at $P$ twice, so subtract $2x_{1}$.",
              "那只减了一次 $x_{1}$；切线在 $P$ 处相切算两次，所以要减 $2x_{1}$。",
            ],
            [
              mod(bare * bare - 2 * x, p),
              "That leaves the $a$ out of the slope $(3x_{1}^{2} + a)(2y_{1})^{-1}$.",
              "那在斜率 $(3x_{1}^{2} + a)(2y_{1})^{-1}$ 中漏掉了 $a$。",
            ],
          ];
          return worked(
            [
              `On $${curveLatex(a, b)}$ modulo ${p}, what is the first coordinate of $2 \\cdot (${x}, ${y})$?`,
              `在模 ${p} 的 $${curveLatex(a, b)}$ 上，$2 \\cdot (${x}, ${y})$ 的第一个坐标是多少？`,
            ],
            x3,
            misses,
            [
              [
                ["Find the tangent slope", "求切线斜率"],
                [
                  `$3 \\cdot ${x}^{2} + ${a} = ${3 * x * x + a}$, which is ${top} modulo ${p}, and $2 \\cdot ${y} = ${2 * y}$ has inverse ${inv}, so $m = ${top} \\cdot ${inv}$, which is ${m} modulo ${p}.`,
                  `$3 \\cdot ${x}^{2} + ${a} = ${3 * x * x + a}$，模 ${p} 为 ${top}；$2 \\cdot ${y} = ${2 * y}$ 的逆元是 ${inv}，所以 $m = ${top} \\cdot ${inv}$，模 ${p} 为 ${m}。`,
                ],
              ],
              [
                ["Apply the formula", "代入公式"],
                [
                  `$x_{3} = ${m}^{2} - 2 \\cdot ${x} = ${m * m - 2 * x}$, which is ${x3} modulo ${p}.`,
                  `$x_{3} = ${m}^{2} - 2 \\cdot ${x} = ${m * m - 2 * x}$，模 ${p} 为 ${x3}。`,
                ],
              ],
            ],
            [
              `Then $y_{3} = ${m} \\cdot (${x} - ${x3}) - ${y}$, which is ${y3} modulo ${p}, and $${y3}^{2}$ and $${x3}^{3} + ${a} \\cdot ${x3} + ${b}$ are both ${mod(y3 * y3, p)} modulo ${p}, so $2P$ lies on the curve.`,
              `于是 $y_{3} = ${m} \\cdot (${x} - ${x3}) - ${y}$，模 ${p} 为 ${y3}；$${y3}^{2}$ 与 $${x3}^{3} + ${a} \\cdot ${x3} + ${b}$ 模 ${p} 都是 ${mod(y3 * y3, p)}，所以 $2P$ 在曲线上。`,
            ],
          );
        }),
    ),
  ],
);

const measurableFunctions = topic(
  "measurable-sets-and-functions",
  ["Measurable Sets and Functions", "可测集与可测函数"],
  ["Know which sets have a measure and which functions can be integrated.", "了解哪些集合有测度，哪些函数可以积分。"],
  ["the-lebesgue-integral-of-simple-functions"],
  [],
  [
    point(
      "adding-countably-many-measures",
      ["Adding countably many measures", "可数个测度相加"],
      [
        "Lebesgue measure is countably additive: the measure of a countable union of disjoint measurable sets is the sum of their measures. Countable sets have measure $0$, so adding one changes nothing.\n\nDisjoint intervals of lengths $1, \\frac{1}{2}, \\frac{1}{4}, \\dots$ have a union of measure $\\frac{1}{1 - 1/2} = 2$, and adding the rationals outside them keeps the measure $2$.\n\nCheck: the first three intervals already give $1 + \\frac{1}{2} + \\frac{1}{4} = \\frac{7}{4}$, and the rest add the remaining $\\frac{1}{4}$.\n\n> **Watch out.** Countable additivity needs the sets to be disjoint, and a countable set adds $0$, however densely it is spread.",
        "勒贝格测度具有可数可加性：互不相交的可数个可测集的并的测度等于它们测度的和。可数集的测度为 $0$，所以加入它不改变结果。\n\n长度为 $1, \\frac{1}{2}, \\frac{1}{4}, \\dots$ 的互不相交区间，它们的并的测度是 $\\frac{1}{1 - 1/2} = 2$；再加入区间外的有理数，测度仍是 $2$。\n\n检验：前三个区间已给出 $1 + \\frac{1}{2} + \\frac{1}{4} = \\frac{7}{4}$，其余区间补上剩下的 $\\frac{1}{4}$。\n\n> **注意。** 可数可加性要求集合互不相交；可数集无论分布多稠密，增加的测度都是 $0$。",
      ],
      (rng) => {
        const r = rng.pick([2, 3, 5]);
        const a = (r - 1) * rng.int(1, 12);
        const total = (a * r) / (r - 1);
        return until(() =>
          worked(
            [
              `Disjoint intervals have lengths $${a}, \\frac{${a}}{${r}}, \\frac{${a}}{${r * r}}, \\dots$ Their union is joined with the set of all rationals outside them. What is the measure of the result?`,
              `互不相交的区间长度为 $${a}, \\frac{${a}}{${r}}, \\frac{${a}}{${r * r}}, \\dots$ 把它们的并与区间外的全体有理数合并。结果的测度是多少？`,
            ],
            total,
            [
              [a, "That is only the first interval; the others add to it.", "这只是第一个区间；其余区间还要加上。"],
              [
                total + 1,
                "That gives the rationals measure 1, but a countable set has measure 0.",
                "这给有理数算了测度 1，但可数集的测度是 0。",
              ],
              [
                a * r,
                `That multiplies by ${r}; the sum $\\frac{${a}}{1 - 1/${r}}$ also divides by ${r - 1}.`,
                `这乘了 ${r}；和 $\\frac{${a}}{1 - 1/${r}}$ 还要除以 ${r - 1}。`,
              ],
            ],
            [
              [
                ["Sum the lengths", "求长度之和"],
                [
                  `The lengths form a geometric series with ratio $\\frac{1}{${r}}$, so they add to $\\frac{${a}}{1 - 1/${r}} = \\frac{${a * r}}{${r - 1}} = ${total}$.`,
                  `这些长度构成公比为 $\\frac{1}{${r}}$ 的几何级数，和为 $\\frac{${a}}{1 - 1/${r}} = \\frac{${a * r}}{${r - 1}} = ${total}$。`,
                ],
              ],
              [
                ["Add the rationals", "加入有理数"],
                [
                  `The rationals outside are countable, so they have measure 0, and the measure stays ${total}.`,
                  `区间外的有理数可数，测度为 0，所以测度仍是 ${total}。`,
                ],
              ],
            ],
            [
              `Without the first interval the lengths add to $${total} - ${a} = ${total - a}$, which is $\\frac{1}{${r}}$ of ${total}, as it must be, since the rest is the same series scaled by $\\frac{1}{${r}}$.`,
              `去掉第一个区间后长度之和是 $${total} - ${a} = ${total - a}$，正是 ${total} 的 $\\frac{1}{${r}}$，因为其余部分就是同一个级数乘以 $\\frac{1}{${r}}$。`,
            ],
          ),
        );
      },
    ),
    point(
      "the-measure-of-a-level-set",
      ["The measure of a level set", "水平集的测度"],
      [
        "A function $f$ is measurable when every set $\\{x : f(x) > t\\}$ is measurable. The measures of these sets, taken for all $t$, are what the Lebesgue integral adds up.\n\nFor $f(x) = x^{2}$ on $[0, 5]$, the set $\\{x : f(x) > 9\\}$ is $(3, 5]$, because $x^{2} > 9$ means $x > 3$ when $x \\ge 0$. Its measure is $2$.\n\nCheck: the rest of the interval, $[0, 3]$, has measure $3$, and $2 + 3 = 5$, the length of $[0, 5]$.\n\n> **Watch out.** The level set is a set of inputs $x$, so measure its length on the $x$-axis, not the range of values $f$ takes there.",
        "如果每个集合 $\\{x : f(x) > t\\}$ 都可测，函数 $f$ 就是可测的。对所有 $t$ 取这些集合的测度，勒贝格积分加起来的正是它们。\n\n对 $[0, 5]$ 上的 $f(x) = x^{2}$，集合 $\\{x : f(x) > 9\\}$ 是 $(3, 5]$，因为当 $x \\ge 0$ 时 $x^{2} > 9$ 即 $x > 3$。它的测度是 $2$。\n\n检验：区间的其余部分 $[0, 3]$ 的测度是 $3$，而 $2 + 3 = 5$，正是 $[0, 5]$ 的长度。\n\n> **注意。** 水平集是自变量 $x$ 的集合，所以要量它在 $x$ 轴上的长度，而不是 $f$ 在那里取值的范围。",
      ],
      (rng) => {
        const s = rng.int(1, 8);
        const b = s + rng.int(1, 9);
        return until(() =>
          worked(
            [
              `For $f(x) = x^{2}$ on $[0, ${b}]$, what is the measure of $\\{x : f(x) > ${s * s}\\}$?`,
              `对 $[0, ${b}]$ 上的 $f(x) = x^{2}$，$\\{x : f(x) > ${s * s}\\}$ 的测度是多少？`,
            ],
            b - s,
            [
              [
                s,
                `That is the measure of the rest, $[0, ${s}]$, where $f$ is not above ${s * s}.`,
                `这是其余部分 $[0, ${s}]$ 的测度，那里 $f$ 不大于 ${s * s}。`,
              ],
              [b, `That is the whole interval $[0, ${b}]$.`, `这是整个区间 $[0, ${b}]$。`],
              [
                b * b - s * s,
                `That measures the values of $f$ from ${s * s} to ${b * b}, not the set of inputs.`,
                `这量的是 $f$ 从 ${s * s} 到 ${b * b} 的取值范围，而不是自变量的集合。`,
              ],
            ],
            [
              [
                ["Solve the inequality", "解不等式"],
                [
                  `For $x \\ge 0$, $x^{2} > ${s * s}$ means $x > ${s}$, so the set is $(${s}, ${b}]$.`,
                  `当 $x \\ge 0$ 时，$x^{2} > ${s * s}$ 即 $x > ${s}$，所以这个集合是 $(${s}, ${b}]$。`,
                ],
              ],
              [
                ["Take the length", "取长度"],
                [`$(${s}, ${b}]$ has length $${b} - ${s} = ${b - s}$.`, `$(${s}, ${b}]$ 的长度是 $${b} - ${s} = ${b - s}$。`],
              ],
            ],
            [
              `The rest of the interval, $[0, ${s}]$, has measure ${s}, and $${b - s} + ${s} = ${b}$, the length of $[0, ${b}]$.`,
              `区间的其余部分 $[0, ${s}]$ 的测度是 ${s}，而 $${b - s} + ${s} = ${b}$，正是 $[0, ${b}]$ 的长度。`,
            ],
          ),
        );
      },
    ),
    point(
      "a-step-function-above-a-level",
      ["A step function above a level", "阶梯函数高于某水平的部分"],
      [
        "For a step function, $\\{x : f(x) > t\\}$ is the union of the pieces whose value exceeds $t$. Its measure is the total length of those pieces, whichever order they come in.\n\nIf $f = 5$ on a set of measure $2$, $f = 1$ on a set of measure $4$ and $f = 7$ on a set of measure $3$, then $\\{x : f(x) > 3\\}$ is made of the first and third sets, of measure $2 + 3 = 5$.\n\nCheck: the set where $f \\le 3$ is the second set, of measure $4$, and $5 + 4 = 9$ is the total measure.\n\n> **Watch out.** The inequality is strict, so a piece whose value equals $t$ is left out.",
        "对阶梯函数，$\\{x : f(x) > t\\}$ 是取值超过 $t$ 的那些段的并。它的测度是这些段的总长度，与顺序无关。\n\n若 $f$ 在测度为 $2$ 的集合上等于 $5$，在测度为 $4$ 的集合上等于 $1$，在测度为 $3$ 的集合上等于 $7$，那么 $\\{x : f(x) > 3\\}$ 由第一个和第三个集合组成，测度为 $2 + 3 = 5$。\n\n检验：$f \\le 3$ 的集合是第二个集合，测度为 $4$，而 $5 + 4 = 9$ 是总测度。\n\n> **注意。** 不等号是严格的，所以取值恰好等于 $t$ 的段不计入。",
      ],
      (rng) => {
        const t = rng.int(1, 9);
        const low = t - rng.int(0, 2);
        const high = t + rng.int(1, 5);
        const higher = high + rng.int(1, 5);
        const [l1, l2, l3] = [rng.int(1, 7), rng.int(1, 7), rng.int(1, 7)];
        return until(() =>
          worked(
            [
              `A step function equals ${high} on a set of measure ${l1}, ${low} on a disjoint set of measure ${l2}, and ${higher} on a third disjoint set of measure ${l3}. What is the measure of the set where $f > ${t}$?`,
              `阶梯函数在测度为 ${l1} 的集合上等于 ${high}，在与之不交、测度为 ${l2} 的集合上等于 ${low}，在第三个不交、测度为 ${l3} 的集合上等于 ${higher}。$f > ${t}$ 的集合的测度是多少？`,
            ],
            l1 + l3,
            [
              [
                l1 + l2 + l3,
                `That counts all three sets, but the value ${low} is not above ${t}.`,
                `这把三个集合都算上了，但值 ${low} 并不大于 ${t}。`,
              ],
              [l2, `That is the measure of the set where $f \\le ${t}$.`, `这是 $f \\le ${t}$ 的集合的测度。`],
              [
                l1 + l2,
                `That takes the first two sets, but the value ${low} is not above ${t} and the value ${higher} is.`,
                `这取了前两个集合，但值 ${low} 不大于 ${t}，而值 ${higher} 大于 ${t}。`,
              ],
            ],
            [
              [
                ["Compare each value with the level", "把每个值与水平比较"],
                [`${high} and ${higher} are above ${t}, while ${low} is not.`, `${high} 和 ${higher} 大于 ${t}，而 ${low} 不大于 ${t}。`],
              ],
              [
                ["Add the measures", "把测度相加"],
                [
                  `The set where $f > ${t}$ is the first and third sets together, of measure $${l1} + ${l3} = ${l1 + l3}$.`,
                  `$f > ${t}$ 的集合由第一个和第三个集合组成，测度为 $${l1} + ${l3} = ${l1 + l3}$。`,
                ],
              ],
            ],
            [
              `The set where $f \\le ${t}$ has measure ${l2}, and $${l1 + l3} + ${l2} = ${l1 + l2 + l3}$ is the total measure.`,
              `$f \\le ${t}$ 的集合测度为 ${l2}，而 $${l1 + l3} + ${l2} = ${l1 + l2 + l3}$ 是总测度。`,
            ],
          ),
        );
      },
    ),
  ],
);

const convergenceTheorems = topic(
  "the-monotone-and-dominated-convergence-theorems",
  ["The Monotone and Dominated Convergence Theorems", "单调收敛定理与控制收敛定理"],
  ["Exchange limits and Lebesgue integrals under simple conditions.", "在简单的条件下交换极限与勒贝格积分。"],
  ["measurable-sets-and-functions", "pointwise-and-uniform-convergence"],
  [],
  [
    point(
      "monotone-convergence",
      ["Monotone convergence", "单调收敛"],
      [
        "If $0 \\le f_{1} \\le f_{2} \\le \\dots$ are measurable and tend to $f$, then $\\int f_{n} \\to \\int f$, even when $f$ is unbounded. Truncating an unbounded function at height $n$ gives such a sequence.\n\nFor $f_{n}(x) = \\min(n, x^{-1/2})$ on $(0, 1]$, the $f_{n}$ increase to $x^{-1/2}$, so $\\int_{0}^{1} f_{n} \\to \\int_{0}^{1} x^{-1/2}\\, dx = 2$.\n\nCheck: $f_{n}$ equals $n$ on $\\left(0, \\frac{1}{n^{2}}\\right]$ and $x^{-1/2}$ after that, so $\\int_{0}^{1} f_{n} = \\frac{1}{n} + 2 - \\frac{2}{n} = 2 - \\frac{1}{n}$, which tends to $2$.\n\n> **Watch out.** The integral of $x^{-r}$ over $(0, 1]$ is $\\frac{1}{1 - r}$: divide by $1 - r$, not by $r$.",
        "如果可测函数满足 $0 \\le f_{1} \\le f_{2} \\le \\dots$ 且趋于 $f$，那么 $\\int f_{n} \\to \\int f$，即使 $f$ 无界也成立。把无界函数在高度 $n$ 处截断就得到这样的序列。\n\n对 $(0, 1]$ 上的 $f_{n}(x) = \\min(n, x^{-1/2})$，$f_{n}$ 递增趋于 $x^{-1/2}$，所以 $\\int_{0}^{1} f_{n} \\to \\int_{0}^{1} x^{-1/2}\\, dx = 2$。\n\n检验：$f_{n}$ 在 $\\left(0, \\frac{1}{n^{2}}\\right]$ 上等于 $n$，之后等于 $x^{-1/2}$，所以 $\\int_{0}^{1} f_{n} = \\frac{1}{n} + 2 - \\frac{2}{n} = 2 - \\frac{1}{n}$，它趋于 $2$。\n\n> **注意。** $x^{-r}$ 在 $(0, 1]$ 上的积分是 $\\frac{1}{1 - r}$：要除以 $1 - r$，而不是除以 $r$。",
      ],
      (rng) => {
        const q = rng.pick([2, 3, 4, 5]);
        const p = rng.int(1, q - 1);
        const c = rng.int(1, 9);
        const f = `${c === 1 ? "" : c}x^{-${Q.of(p, q).toLatex()}}`;
        const r = Q.of(p, q).toLatex();
        const answer = Q.of(c * q, q - p);
        const front = c === 1 ? "" : `${c} \\times `;
        return until(() =>
          worked(
            [
              `Let $f_{n}(x) = \\min(n, ${f})$ on $(0, 1]$. What is the limit of $\\int_{0}^{1} f_{n}$?`,
              `设 $(0, 1]$ 上 $f_{n}(x) = \\min(n, ${f})$。$\\int_{0}^{1} f_{n}$ 的极限是多少？`,
            ],
            answer,
            [
              [
                Q.of(c * p, q),
                `That multiplies by the exponent $${r}$ instead of dividing by $1 - ${r}$.`,
                `这是乘以指数 $${r}$，而不是除以 $1 - ${r}$。`,
              ],
              [
                Q.of(c, 1),
                "That is the value at $x = 1$, not the integral over $(0, 1]$.",
                "这是 $x = 1$ 处的值，不是在 $(0, 1]$ 上的积分。",
              ],
              [
                Q.of(c * q, p),
                `That divides by the exponent $${r}$ instead of by $1 - ${r}$.`,
                `这是除以指数 $${r}$，而不是除以 $1 - ${r}$。`,
              ],
            ],
            [
              [
                ["Check the hypotheses", "检验条件"],
                [
                  `The $f_{n}$ are at least $0$, increase with $n$ and tend to $${f}$ at every $x$ in $(0, 1]$, so monotone convergence applies.`,
                  `$f_{n}$ 都不小于 $0$，随 $n$ 递增，并在 $(0, 1]$ 的每个 $x$ 处趋于 $${f}$，所以单调收敛定理适用。`,
                ],
              ],
              [
                ["Integrate the limit", "对极限积分"],
                [
                  `$\\int_{0}^{1} ${f}\\, dx = ${front}\\frac{1}{1 - ${r}} = ${answer.toLatex()}$.`,
                  `$\\int_{0}^{1} ${f}\\, dx = ${front}\\frac{1}{1 - ${r}} = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `An antiderivative of $${f}$ is $${answer.toLatex()} x^{${Q.of(q - p, q).toLatex()}}$, which is $0$ at $x = 0$ and $${answer.toLatex()}$ at $x = 1$.`,
              `$${f}$ 的一个原函数是 $${answer.toLatex()} x^{${Q.of(q - p, q).toLatex()}}$，它在 $x = 0$ 处为 $0$，在 $x = 1$ 处为 $${answer.toLatex()}$。`,
            ],
          ),
        );
      },
    ),
    point(
      "dominated-convergence",
      ["Dominated convergence", "控制收敛"],
      [
        "If $f_{n} \\to f$ almost everywhere and $|f_{n}| \\le g$ for one integrable $g$, then $\\int f_{n} \\to \\int f$. The convergence need not be uniform, and points where it fails may form a set of measure zero.\n\nFor $\\int_{0}^{1} (4x^{n} + 3)\\, dx$, the integrand tends to $3$ at every $x < 1$ and stays below $7$, so the limit of the integrals is $\\int_{0}^{1} 3\\, dx = 3$.\n\nCheck: directly, $\\int_{0}^{1} (4x^{n} + 3)\\, dx = \\frac{4}{n + 1} + 3$, which tends to $3$.\n\n> **Watch out.** The single point $x = 1$, where $x^{n}$ stays $1$, has measure zero and does not affect the integral.",
        "如果 $f_{n} \\to f$ 几乎处处成立，且对一个可积函数 $g$ 有 $|f_{n}| \\le g$，那么 $\\int f_{n} \\to \\int f$。收敛不必一致，不收敛的点可以构成零测集。\n\n对 $\\int_{0}^{1} (4x^{n} + 3)\\, dx$，被积函数在每个 $x < 1$ 处趋于 $3$，且始终小于 $7$，所以积分的极限是 $\\int_{0}^{1} 3\\, dx = 3$。\n\n检验：直接计算，$\\int_{0}^{1} (4x^{n} + 3)\\, dx = \\frac{4}{n + 1} + 3$，它趋于 $3$。\n\n> **注意。** 单独一点 $x = 1$ 处 $x^{n}$ 始终为 $1$，但它的测度为零，不影响积分。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const d = rng.int(1, 9);
        const b = rng.int(2, 9);
        return rng.bool()
          ? until(() =>
              worked(
                [
                  `What is $\\lim_{n \\to \\infty} \\int_{0}^{1} (${c}x^{n} + ${d}) \\, dx$?`,
                  `$\\lim_{n \\to \\infty} \\int_{0}^{1} (${c}x^{n} + ${d}) \\, dx$ 是多少？`,
                ],
                d,
                [
                  [
                    c + d,
                    "That uses the value at $x = 1$, a single point of measure zero.",
                    "这用了 $x = 1$ 处的值，而那只是一个零测度的点。",
                  ],
                  [
                    c,
                    `That keeps the term $${c}x^{n}$, which tends to $0$, and drops the constant ${d}.`,
                    `这保留了趋于 $0$ 的项 $${c}x^{n}$，却丢掉了常数 ${d}。`,
                  ],
                  [0, `That sends the constant ${d} to $0$ as well.`, `这把常数 ${d} 也变成了 $0$。`],
                ],
                [
                  [
                    ["Find the limit at each point", "求每一点的极限"],
                    [
                      `For $0 \\le x < 1$, $${c}x^{n} \\to 0$, so the integrand tends to ${d} everywhere except at the single point $x = 1$.`,
                      `当 $0 \\le x < 1$ 时 $${c}x^{n} \\to 0$，所以被积函数除单点 $x = 1$ 外都趋于 ${d}。`,
                    ],
                  ],
                  [
                    ["Apply dominated convergence", "应用控制收敛定理"],
                    [
                      `The integrand stays below the constant ${c + d}, which is integrable on $[0, 1]$, so the limit is $\\int_{0}^{1} ${d}\\, dx = ${d}$.`,
                      `被积函数始终小于常数 ${c + d}，而它在 $[0, 1]$ 上可积，所以极限是 $\\int_{0}^{1} ${d}\\, dx = ${d}$。`,
                    ],
                  ],
                ],
                [
                  `Directly, the integral is $\\frac{${c}}{n + 1} + ${d}$, which tends to ${d}.`,
                  `直接计算，积分是 $\\frac{${c}}{n + 1} + ${d}$，它趋于 ${d}。`,
                ],
              ),
            )
          : until(() =>
              worked(
                [
                  `What is $\\lim_{n \\to \\infty} \\int_{0}^{${b}} ${c}e^{-x/n} \\, dx$?`,
                  `$\\lim_{n \\to \\infty} \\int_{0}^{${b}} ${c}e^{-x/n} \\, dx$ 是多少？`,
                ],
                b * c,
                [
                  [
                    0,
                    "That lets $e^{-x/n}$ tend to $0$, but $-x/n$ tends to $0$, so $e^{-x/n}$ tends to $1$.",
                    "这让 $e^{-x/n}$ 趋于 $0$，但 $-x/n$ 趋于 $0$，所以 $e^{-x/n}$ 趋于 $1$。",
                  ],
                  [c, `That forgets the length ${b} of the interval.`, `这忘了区间的长度 ${b}。`],
                  [b, `That drops the constant ${c}.`, `这丢掉了常数 ${c}。`],
                ],
                [
                  [
                    ["Find the limit at each point", "求每一点的极限"],
                    [
                      `For each $x$, $-\\frac{x}{n} \\to 0$, so $${c}e^{-x/n} \\to ${c}$.`,
                      `对每个 $x$，$-\\frac{x}{n} \\to 0$，所以 $${c}e^{-x/n} \\to ${c}$。`,
                    ],
                  ],
                  [
                    ["Apply dominated convergence", "应用控制收敛定理"],
                    [
                      `For $x \\ge 0$ the integrand is at most ${c}, which is integrable on $[0, ${b}]$, so the limit is $${c} \\times ${b} = ${b * c}$.`,
                      `当 $x \\ge 0$ 时被积函数至多是 ${c}，它在 $[0, ${b}]$ 上可积，所以极限是 $${c} \\times ${b} = ${b * c}$。`,
                    ],
                  ],
                ],
                [
                  `Directly, the integral is $${c}n\\left(1 - e^{-${b}/n}\\right)$, and $n\\left(1 - e^{-${b}/n}\\right) \\to ${b}$, so it tends to $${b * c}$.`,
                  `直接计算，积分是 $${c}n\\left(1 - e^{-${b}/n}\\right)$，而 $n\\left(1 - e^{-${b}/n}\\right) \\to ${b}$，所以它趋于 $${b * c}$。`,
                ],
              ),
            );
      },
    ),
    point(
      "when-domination-fails",
      ["When domination fails", "控制条件不成立时"],
      [
        "A taller and thinner spike keeps its area while it tends to $0$ at every point. No integrable function lies above all these spikes, so the theorem does not apply and the integral of the limit differs from the limit of the integrals.\n\nFor $f_{n} = n$ on $\\left(0, \\frac{1}{n}\\right)$ and $0$ elsewhere, each $\\int f_{n} = n \\times \\frac{1}{n} = 1$, while $f_{n}(x) \\to 0$ at every $x$. So $\\lim \\int f_{n} = 1$ but $\\int \\lim f_{n} = 0$.\n\nCheck: any $g$ above every $f_{n}$ satisfies $g(x) \\ge \\frac{1}{x} - 1$ on $(0, 1)$, and $\\int_{0}^{1} \\left(\\frac{1}{x} - 1\\right) dx$ diverges, so no integrable $g$ exists.\n\n> **Watch out.** The difference is the area each spike keeps; the length of the whole interval plays no part.",
        "越来越高、越来越窄的尖峰保持面积不变，同时在每一点趋于 $0$。没有可积函数能位于所有这些尖峰之上，所以定理不适用，极限的积分不等于积分的极限。\n\n对在 $\\left(0, \\frac{1}{n}\\right)$ 上等于 $n$、其余处为 $0$ 的 $f_{n}$，每个 $\\int f_{n} = n \\times \\frac{1}{n} = 1$，而 $f_{n}(x)$ 在每个 $x$ 处都趋于 $0$。所以 $\\lim \\int f_{n} = 1$，但 $\\int \\lim f_{n} = 0$。\n\n检验：位于每个 $f_{n}$ 之上的 $g$ 在 $(0, 1)$ 上满足 $g(x) \\ge \\frac{1}{x} - 1$，而 $\\int_{0}^{1} \\left(\\frac{1}{x} - 1\\right) dx$ 发散，所以不存在可积的 $g$。\n\n> **注意。** 这个差是每个尖峰保持的面积；整个区间的长度不起作用。",
      ],
      (rng) => {
        const c = rng.int(2, 15);
        const b = rng.int(2, 9);
        return until(() =>
          worked(
            [
              `Let $f_{n} = ${c}n$ on $(0, \\frac{1}{n})$ and $0$ elsewhere on $[0, ${b}]$. What is $\\lim \\int f_{n} - \\int \\lim f_{n}$?`,
              `在 $[0, ${b}]$ 上，设 $f_{n}$ 在 $(0, \\frac{1}{n})$ 上等于 $${c}n$，其余处为 $0$。$\\lim \\int f_{n} - \\int \\lim f_{n}$ 是多少？`,
            ],
            c,
            [
              [
                0,
                "That assumes the limit and the integral can be exchanged, but no integrable function dominates the spikes.",
                "这假定极限与积分可以交换，但没有可积函数控制这些尖峰。",
              ],
              [
                b * c,
                `That spreads the height over the whole interval $[0, ${b}]$, but each spike has width $\\frac{1}{n}$.`,
                `这把高度铺满了整个区间 $[0, ${b}]$，但每个尖峰的宽度只有 $\\frac{1}{n}$。`,
              ],
              [1, `That drops the constant ${c} in the height $${c}n$.`, `这丢掉了高度 $${c}n$ 中的常数 ${c}。`],
            ],
            [
              [
                ["Integrate each spike", "对每个尖峰积分"],
                [
                  `$\\int f_{n} = ${c}n \\times \\frac{1}{n} = ${c}$ for every $n$, so $\\lim \\int f_{n} = ${c}$.`,
                  `对每个 $n$，$\\int f_{n} = ${c}n \\times \\frac{1}{n} = ${c}$，所以 $\\lim \\int f_{n} = ${c}$。`,
                ],
              ],
              [
                ["Integrate the limit", "对极限积分"],
                [
                  "Each $x > 0$ lies outside $(0, \\frac{1}{n})$ once $n > \\frac{1}{x}$, and $f_{n}(0) = 0$, so $f_{n} \\to 0$ everywhere and $\\int \\lim f_{n} = 0$.",
                  "每个 $x > 0$ 在 $n > \\frac{1}{x}$ 后都落在 $(0, \\frac{1}{n})$ 之外，且 $f_{n}(0) = 0$，所以 $f_{n}$ 处处趋于 $0$，$\\int \\lim f_{n} = 0$。",
                ],
              ],
            ],
            [
              `The difference is $${c} - 0 = ${c}$, the area each spike keeps; the spikes have no integrable bound, since any bound is at least $${c}\\left(\\frac{1}{x} - 1\\right)$ on $(0, 1)$.`,
              `差是 $${c} - 0 = ${c}$，即每个尖峰保持的面积；这些尖峰没有可积的上界，因为任何上界在 $(0, 1)$ 上都至少是 $${c}\\left(\\frac{1}{x} - 1\\right)$。`,
            ],
          ),
        );
      },
    ),
  ],
);

const stoneWeierstrass = topic(
  "the-stone-weierstrass-theorem",
  ["The Stone-Weierstrass Theorem", "斯通-魏尔斯特拉斯定理"],
  ["Tell when a family of functions can approximate every continuous function.", "判断一族函数何时能逼近每个连续函数。"],
  ["the-weierstrass-approximation-theorem"],
  [],
  [
    point(
      "checking-the-hypotheses",
      ["Checking the hypotheses", "检验条件"],
      [
        "An algebra of real continuous functions on a compact set is dense in all continuous functions if it separates points and vanishes at no point. Being an algebra means closure under addition, multiplication and scalars.\n\nOn $[1, 2]$ the polynomials in $x^{2}$ form an algebra that contains the constants, so it vanishes at no point, and $x^{2}$ takes different values at different points of $[1, 2]$. So these polynomials are dense in the continuous functions on $[1, 2]$.\n\nCheck: the substitution $u = x^{2}$ turns them into all polynomials in $u$ on $[1, 4]$, which are dense by the Weierstrass theorem.\n\n> **Watch out.** On an interval symmetric about $0$, $x^{2}$ takes the same value at $x$ and $-x$, so the same family no longer separates points.",
        "紧集上的实连续函数代数，如果能分离点且不在任何一点同时为零，就在全体连续函数中稠密。代数是指对加法、乘法和数乘封闭。\n\n在 $[1, 2]$ 上，关于 $x^{2}$ 的多项式构成一个包含常数的代数，所以它不在任何一点全为零；而 $x^{2}$ 在 $[1, 2]$ 的不同点取不同的值。所以这些多项式在 $[1, 2]$ 上的连续函数中稠密。\n\n检验：代换 $u = x^{2}$ 把它们变成 $[1, 4]$ 上关于 $u$ 的全体多项式，由魏尔斯特拉斯定理，它们是稠密的。\n\n> **注意。** 在关于 $0$ 对称的区间上，$x^{2}$ 在 $x$ 和 $-x$ 处取相同的值，所以同一族函数就不再能分离点。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const b = a + rng.int(1, 8);
        const d = rng.int(2, 7);
        return chosen(
          rng,
          [`Which family is dense in the continuous functions on the stated interval?`, `哪一族函数在所给区间上的连续函数中稠密？`],
          [`Polynomials in $x^{2}$ on $[${a}, ${b}]$`, `$[${a}, ${b}]$ 上关于 $x^{2}$ 的多项式`],
          [
            [
              [`Polynomials in $x^{2}$ on $[${-b}, ${b}]$`, `$[${-b}, ${b}]$ 上关于 $x^{2}$ 的多项式`],
              `$x^{2}$ takes the same value at $${b}$ and $${-b}$, so these polynomials cannot separate those points.`,
              `$x^{2}$ 在 $${b}$ 和 $${-b}$ 处取相同的值，所以这些多项式不能分离这两点。`,
            ],
            [
              [`Polynomials $p$ with $p(${a}) = 0$ on $[${a}, ${b}]$`, `$[${a}, ${b}]$ 上满足 $p(${a}) = 0$ 的多项式`],
              `Every member vanishes at ${a}, so their uniform limits do too, and they cannot approach a function that is not $0$ there.`,
              `每个成员都在 ${a} 处为零，它们的一致极限也是如此，所以无法逼近在那里不为 $0$ 的函数。`,
            ],
            [
              [`Polynomials of degree at most ${d} on $[${a}, ${b}]$`, `$[${a}, ${b}]$ 上次数不超过 ${d} 的多项式`],
              `A product of two members can have degree $${2 * d}$, so the family is not an algebra; it is a closed space of finite dimension and cannot be dense.`,
              `两个成员的乘积次数可以是 $${2 * d}$，所以这一族不是代数；它是有限维的闭空间，不可能稠密。`,
            ],
          ],
          [
            [
              ["Check that it is an algebra", "检验它是代数"],
              [
                "Sums, products and multiples of polynomials in $x^{2}$ are again polynomials in $x^{2}$, and the constants belong, so the family vanishes at no point.",
                "关于 $x^{2}$ 的多项式的和、积与数乘仍是关于 $x^{2}$ 的多项式，而且包含常数，所以这一族不在任何一点全为零。",
              ],
            ],
            [
              ["Check that it separates points", "检验它能分离点"],
              [
                `On $[${a}, ${b}]$ every $x$ is positive, so $x^{2}$ is strictly increasing and takes different values at different points; the Stone-Weierstrass theorem applies.`,
                `在 $[${a}, ${b}]$ 上每个 $x$ 都是正数，所以 $x^{2}$ 严格递增，在不同的点取不同的值；斯通-魏尔斯特拉斯定理适用。`,
              ],
            ],
          ],
          [
            `The substitution $u = x^{2}$ turns the family into all polynomials in $u$ on $[${a * a}, ${b * b}]$, which are dense by the Weierstrass approximation theorem.`,
            `代换 $u = x^{2}$ 把这一族变成 $[${a * a}, ${b * b}]$ 上关于 $u$ 的全体多项式，由魏尔斯特拉斯逼近定理，它们是稠密的。`,
          ],
        );
      },
    ),
    point(
      "a-family-that-cannot-separate",
      ["A family that cannot separate", "不能分离点的函数族"],
      [
        "An even function takes the same value at $x$ and $-x$, so even functions cannot separate them. If $f$ differs at those two points, the distance from $f$ to any even function is at least half the difference.\n\nOn $[-1, 1]$, $f(x) = x$ has $f(1) - f(-1) = 2$, so every even $g$ is at distance at least $1$ from it, and $g = 0$ is at distance exactly $1$.\n\nCheck: an even $g$ with $g(1) = g(-1) = v$ is at distance at least $|1 - v|$ at $1$ and $|1 + v|$ at $-1$, and these add to at least $2$.\n\n> **Watch out.** The lower bound is half the difference of the two values, not the whole difference.",
        "偶函数在 $x$ 和 $-x$ 取相同的值，所以偶函数分离不了它们。如果 $f$ 在这两点的值不同，$f$ 到任何偶函数的距离至少是差的一半。\n\n在 $[-1, 1]$ 上，$f(x) = x$ 满足 $f(1) - f(-1) = 2$，所以每个偶函数 $g$ 到它的距离至少是 $1$，而 $g = 0$ 的距离恰好是 $1$。\n\n检验：满足 $g(1) = g(-1) = v$ 的偶函数在 $1$ 处的距离至少是 $|1 - v|$，在 $-1$ 处至少是 $|1 + v|$，两者之和至少是 $2$。\n\n> **注意。** 下界是两个值之差的一半，而不是整个差。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const c = rng.int(2, 9);
        return until(() =>
          worked(
            [
              `On $[${-a}, ${a}]$, what is the smallest possible value of $\\sup |${c}x - g(x)|$ over all even continuous functions $g$?`,
              `在 $[${-a}, ${a}]$ 上，对所有连续偶函数 $g$，$\\sup |${c}x - g(x)|$ 的最小可能值是多少？`,
            ],
            a * c,
            [
              [
                0,
                `That would need an even $g$ equal to $${c}x$, but $${c}x$ is odd.`,
                `这需要一个等于 $${c}x$ 的偶函数 $g$，但 $${c}x$ 是奇函数。`,
              ],
              [
                2 * a * c,
                `That is the whole difference of the values at $\\pm ${a}$; the bound is half of it.`,
                `这是 $\\pm ${a}$ 处两值之差的全部；下界是它的一半。`,
              ],
              [c, `That is the slope ${c}, not the value at the end point ${a}.`, `这是斜率 ${c}，不是端点 ${a} 处的值。`],
            ],
            [
              [
                ["Find a lower bound", "求下界"],
                [
                  `An even $g$ has $g(${a}) = g(${-a})$, while $${c}x$ takes the values $${a * c}$ and $${-a * c}$ there, which differ by $${2 * a * c}$. So at one of the two ends the gap is at least $${a * c}$.`,
                  `偶函数 $g$ 满足 $g(${a}) = g(${-a})$，而 $${c}x$ 在那两点取 $${a * c}$ 和 $${-a * c}$，相差 $${2 * a * c}$。所以在两个端点之一处差距至少是 $${a * c}$。`,
                ],
              ],
              [
                ["Reach the bound", "取到下界"],
                [
                  `With $g = 0$, the gap is $|${c}x|$, whose largest value on $[${-a}, ${a}]$ is $${a * c}$.`,
                  `取 $g = 0$，差距是 $|${c}x|$，它在 $[${-a}, ${a}]$ 上的最大值是 $${a * c}$。`,
                ],
              ],
            ],
            [
              `If $g(${a}) = v$, the gaps at $${a}$ and $${-a}$ are $|${a * c} - v|$ and $|${a * c} + v|$, which add to at least $${2 * a * c}$, so the larger is at least $${a * c}$.`,
              `若 $g(${a}) = v$，则在 $${a}$ 和 $${-a}$ 处的差距是 $|${a * c} - v|$ 和 $|${a * c} + v|$，两者之和至少是 $${2 * a * c}$，所以较大者至少是 $${a * c}$。`,
            ],
          ),
        );
      },
    ),
    point(
      "a-family-that-vanishes-at-a-point",
      ["A family that vanishes at a point", "在一点全为零的函数族"],
      [
        "If every function in the family vanishes at $x_{0}$, then any uniform limit also vanishes there. So the distance from $f$ to the family is at least $|f(x_{0})|$, and in fact it equals that.\n\nFor $f(x) = x^{2} + 1$ on $[0, 3]$ and the polynomials that vanish at $2$, the distance is at least $f(2) = 5$, and $p(x) = x^{2} - 4$ reaches it, since $f - p = 5$ everywhere.\n\nCheck: $p(2) = 4 - 4 = 0$, so $p$ belongs to the family.\n\n> **Watch out.** The distance is the value of $f$ at the point where the family vanishes, not $f(0)$ and not the point itself.",
        "如果函数族中每个函数都在 $x_{0}$ 处为零，那么任何一致极限在那里也为零。所以 $f$ 到这一族的距离至少是 $|f(x_{0})|$，实际上正好等于它。\n\n对 $[0, 3]$ 上的 $f(x) = x^{2} + 1$ 和在 $2$ 处为零的多项式，距离至少是 $f(2) = 5$，而 $p(x) = x^{2} - 4$ 能取到它，因为 $f - p$ 处处等于 $5$。\n\n检验：$p(2) = 4 - 4 = 0$，所以 $p$ 属于这一族。\n\n> **注意。** 距离是 $f$ 在这一族全为零的那一点的值，不是 $f(0)$，也不是那个点本身。",
      ],
      (rng) => {
        const x0 = rng.int(1, 6);
        const c = rng.int(1, 12);
        const b = x0 + rng.int(1, 5);
        const value = x0 * x0 + c;
        return until(() =>
          worked(
            [
              `On $[0, ${b}]$, what is the distance in the supremum norm from $f(x) = x^{2} + ${c}$ to the polynomials that vanish at ${x0}?`,
              `在 $[0, ${b}]$ 上，$f(x) = x^{2} + ${c}$ 到在 ${x0} 处为零的多项式的上确界范数距离是多少？`,
            ],
            value,
            [
              [
                0,
                `$f$ does not vanish at ${x0}, so no uniform limit of the family can equal it.`,
                `$f$ 在 ${x0} 处不为零，所以这一族的一致极限都不可能等于它。`,
              ],
              [
                c,
                `That is $f(0)$, but the family vanishes at ${x0}, not at $0$.`,
                `这是 $f(0)$，但这一族在 ${x0} 处为零，而不是在 $0$ 处。`,
              ],
              [x0, `That is the point ${x0} itself, not the value of $f$ there.`, `这是点 ${x0} 本身，而不是 $f$ 在那里的值。`],
            ],
            [
              [
                ["Find a lower bound", "求下界"],
                [
                  `Every polynomial $p$ in the family has $p(${x0}) = 0$, so $|f(${x0}) - p(${x0})| = ${x0}^{2} + ${c} = ${value}$, and the distance is at least ${value}.`,
                  `这一族中每个多项式 $p$ 都满足 $p(${x0}) = 0$，所以 $|f(${x0}) - p(${x0})| = ${x0}^{2} + ${c} = ${value}$，距离至少是 ${value}。`,
                ],
              ],
              [
                ["Reach the bound", "取到下界"],
                [
                  `$p(x) = x^{2} - ${x0 * x0}$ vanishes at ${x0}, and $f - p = ${value}$ everywhere, so the distance is exactly ${value}.`,
                  `$p(x) = x^{2} - ${x0 * x0}$ 在 ${x0} 处为零，而 $f - p$ 处处等于 ${value}，所以距离恰好是 ${value}。`,
                ],
              ],
            ],
            [
              `$p(${x0}) = ${x0 * x0} - ${x0 * x0} = 0$, so this $p$ is in the family, and no member can do better because of the lower bound at ${x0}.`,
              `$p(${x0}) = ${x0 * x0} - ${x0 * x0} = 0$，所以这个 $p$ 属于这一族；由于 ${x0} 处的下界，没有成员能做得更好。`,
            ],
          ),
        );
      },
    ),
  ],
);

const normalFamilies = topic(
  "normal-families-and-montels-theorem",
  ["Normal Families and Montel's Theorem", "正规族与蒙特尔定理"],
  ["See why uniformly bounded analytic functions have convergent subsequences.", "理解一致有界的解析函数为什么有收敛子列。"],
  ["cauchys-estimates-and-liouvilles-theorem"],
  [],
  [
    point(
      "bounds-give-equicontinuity",
      ["Bounds give equicontinuity", "有界推出等度连续"],
      [
        "Cauchy's estimate bounds a derivative by a bound on the function: if $|f| \\le M$ on $|z| < R$, then $|f'(z_{0})| \\le \\frac{M}{R - |z_{0}|}$. A uniform bound on $f$ therefore makes the family equicontinuous on smaller discs. For example, if every $f$ satisfies $|f| \\le 6$ on $|z| < 4$, then at $|z_{0}| = 1$ the disc about $z_{0}$ of radius $4 - 1 = 3$ fits inside, and $|f'(z_{0})| \\le \\frac{6}{3} = 2$ for the whole family at once.\n\nCheck: the disc fits, because $|z - z_{0}| < 3$ gives $|z| \\le |z_{0}| + |z - z_{0}| < 1 + 3 = 4$; a radius larger than $3$ would reach past $|z| = 4$ in the direction of $z_{0}$.\n\n> **Watch out.** The radius is the distance from $z_{0}$ to the edge, $R - |z_{0}|$, not $R$ itself; the bound grows as $z_{0}$ nears the boundary.",
        "柯西估计用函数的界来界定导数：如果在 $|z| < R$ 上 $|f| \\le M$，那么 $|f'(z_{0})| \\le \\frac{M}{R - |z_{0}|}$。所以 $f$ 的一致界使函数族在较小的圆盘上等度连续。例如，如果每个 $f$ 在 $|z| < 4$ 上满足 $|f| \\le 6$，那么在 $|z_{0}| = 1$ 处，以 $z_{0}$ 为心、半径 $4 - 1 = 3$ 的圆盘在区域内，于是对整个函数族同时有 $|f'(z_{0})| \\le \\frac{6}{3} = 2$。\n\n检验：这个圆盘确实在区域内，因为 $|z - z_{0}| < 3$ 推出 $|z| \\le |z_{0}| + |z - z_{0}| < 1 + 3 = 4$；半径若大于 $3$，在 $z_{0}$ 的方向上就会越过 $|z| = 4$。\n\n> **注意。** 半径是 $z_{0}$ 到边界的距离 $R - |z_{0}|$，不是 $R$ 本身；$z_{0}$ 越靠近边界，界越大。",
      ],
      (rng) =>
        until(() => {
          const m = rng.int(2, 30);
          const r0 = rng.int(1, 6);
          const R = r0 + rng.int(1, 6);
          const d = R - r0;
          const bound = Q.of(m, d);
          const misses: Miss[] = [
            [
              Q.of(m, R),
              `That uses the radius $${R}$ of the whole disc; the disc about $z_{0}$ only has room for radius $${R} - ${r0}$.`,
              `那用了整个圆盘的半径 $${R}$；以 $z_{0}$ 为心的圆盘只容得下半径 $${R} - ${r0}$。`,
            ],
            [
              Q.of(m, r0),
              `That divides by $|z_{0}| = ${r0}$, the distance to the centre, not to the edge.`,
              `那除以 $|z_{0}| = ${r0}$，这是到圆心的距离，不是到边界的距离。`,
            ],
            [
              Q.of(m, R + r0),
              `That adds $|z_{0}|$ to $${R}$; the room left about $z_{0}$ is $${R} - ${r0}$.`,
              `那把 $|z_{0}|$ 加到了 $${R}$ 上；$z_{0}$ 周围剩下的空间是 $${R} - ${r0}$。`,
            ],
          ];
          return worked(
            [
              `Every $f$ in a family satisfies $|f| \\le ${m}$ on $|z| < ${R}$. What bound does Cauchy's estimate give for $|f'(z_{0})|$ when $|z_{0}| = ${r0}$?`,
              `函数族中每个 $f$ 在 $|z| < ${R}$ 上满足 $|f| \\le ${m}$。当 $|z_{0}| = ${r0}$ 时，柯西估计给出 $|f'(z_{0})|$ 的什么界？`,
            ],
            bound,
            misses,
            [
              [
                ["Find the radius", "求半径"],
                [
                  `The largest disc about $z_{0}$ inside $|z| < ${R}$ has radius $r = ${R} - ${r0} = ${d}$.`,
                  `以 $z_{0}$ 为心、在 $|z| < ${R}$ 内的最大圆盘半径是 $r = ${R} - ${r0} = ${d}$。`,
                ],
              ],
              [
                ["Apply Cauchy's estimate", "用柯西估计"],
                [
                  `$|f'(z_{0})| \\le \\frac{M}{r}$ with $M = ${m}$ and $r = ${d}$, so the bound is $${bound.toLatex()}$.`,
                  `$|f'(z_{0})| \\le \\frac{M}{r}$，其中 $M = ${m}$，$r = ${d}$，所以界是 $${bound.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The disc fits: $|z - z_{0}| < ${d}$ gives $|z| < ${r0} + ${d} = ${R}$. Multiplying back, $${bound.toLatex()} \\cdot ${d} = ${m}$, the bound on $|f|$.`,
              `这个圆盘在区域内：$|z - z_{0}| < ${d}$ 推出 $|z| < ${r0} + ${d} = ${R}$。反乘回去，$${bound.toLatex()} \\cdot ${d} = ${m}$，正是 $|f|$ 的界。`,
            ],
          );
        }),
    ),
    point(
      "which-family-montel-covers",
      ["Which family Montel covers", "蒙特尔定理适用的函数族"],
      [
        "Montel's theorem says that a family of analytic functions bounded uniformly on each compact subset is normal: every sequence in it has a subsequence converging uniformly on compact subsets. For example, on the unit disc every $z^{n}$ satisfies $|z^{n}| \\le 1$, one bound for the whole family, so $\\{z^{n}\\}$ is normal. The family $\\{nz\\}$ is not covered: at $z = \\frac{1}{2}$ its values $\\frac{n}{2}$ grow without bound.\n\nCheck: $\\{z^{n}\\}$ really has a convergent subsequence, since on $|z| \\le r < 1$ we have $|z^{n}| \\le r^{n} \\to 0$, so the whole sequence tends to $0$ on compact subsets.\n\n> **Watch out.** Each single function $nz$ is bounded on the disc; Montel needs one bound that holds for every member of the family at once.",
        "蒙特尔定理说，在每个紧子集上一致有界的解析函数族是正规族：其中每个序列都有在紧子集上一致收敛的子列。例如，在单位圆盘上每个 $z^{n}$ 都满足 $|z^{n}| \\le 1$，整个函数族共用一个界，所以 $\\{z^{n}\\}$ 是正规族。函数族 $\\{nz\\}$ 不在定理范围内：在 $z = \\frac{1}{2}$ 处它的值 $\\frac{n}{2}$ 无界增长。\n\n检验：$\\{z^{n}\\}$ 确实有收敛子列，因为在 $|z| \\le r < 1$ 上 $|z^{n}| \\le r^{n} \\to 0$，所以整个序列在紧子集上趋于 $0$。\n\n> **注意。** 每个单独的函数 $nz$ 在圆盘上都有界；蒙特尔定理需要的是对函数族所有成员同时成立的一个界。",
      ],
      (rng) => {
        const c = rng.int(2, 60);
        const slips: Slip[] = [
          [
            same(`\\{${c}nz : n \\ge 1\\}`),
            `At $z = \\frac{1}{2}$ its values are $\\frac{${c}n}{2}$, which grow without bound as $n$ grows.`,
            `在 $z = \\frac{1}{2}$ 处它的值是 $\\frac{${c}n}{2}$，随 $n$ 增大而无界增长。`,
          ],
          [
            same(`\\{${c}n + z : n \\ge 1\\}`),
            `At $z = 0$ its values are $${c}n$, which grow without bound as $n$ grows.`,
            `在 $z = 0$ 处它的值是 $${c}n$，随 $n$ 增大而无界增长。`,
          ],
          [
            same(`\\{e^{${c}nz} : n \\ge 1\\}`),
            `At $z = \\frac{1}{2}$ its values are $e^{\\frac{${c}n}{2}}$, which grow without bound as $n$ grows.`,
            `在 $z = \\frac{1}{2}$ 处它的值是 $e^{\\frac{${c}n}{2}}$，随 $n$ 增大而无界增长。`,
          ],
        ];
        return chosen(
          rng,
          [`To which family on the unit disc does Montel's theorem apply?`, `蒙特尔定理适用于单位圆盘上的哪一族函数？`],
          same(`\\{${c}z^{n} : n \\ge 1\\}`),
          slips,
          [
            [
              ["State what Montel needs", "说出蒙特尔定理的条件"],
              [
                "One bound on each compact subset that holds for every member of the family at once.",
                "在每个紧子集上有一个对函数族所有成员同时成立的界。",
              ],
            ],
            [
              ["Bound the powers", "估计幂函数"],
              [
                `For $|z| < 1$, $|${c}z^{n}| = ${c}|z|^{n} \\le ${c}$ for every $n$, so this family qualifies.`,
                `当 $|z| < 1$ 时，对每个 $n$ 都有 $|${c}z^{n}| = ${c}|z|^{n} \\le ${c}$，所以这一族符合条件。`,
              ],
            ],
          ],
          [
            `Each other family has a single point, $z = 0$ or $z = \\frac{1}{2}$, where its values grow with $n$, so no bound holds even on that one-point compact set.`,
            `其余每一族都有一个点（$z = 0$ 或 $z = \\frac{1}{2}$），在那里它的值随 $n$ 增长，所以即使在这个单点紧集上也没有界。`,
          ],
        );
      },
    ),
    point(
      "a-subsequence-limit",
      ["A subsequence limit", "子列的极限"],
      [
        "On a smaller closed disc $|z| \\le r$ with $r < 1$, the supremum of $|z^{n}|$ is $r^{n}$, which tends to $0$. So $z^{n}$ tends to $0$ uniformly on compact subsets of the unit disc, though not on the whole disc. For example, on $|z| \\le \\frac{1}{2}$ the supremum of $|z^{3}|$ is $(\\frac{1}{2})^{3} = \\frac{1}{8}$, taken on the circle $|z| = \\frac{1}{2}$.\n\nCheck: $|z^{3}| = |z|^{3}$ grows with $|z|$, and at $z = -\\frac{1}{2}$ we get $|-\\frac{1}{8}| = \\frac{1}{8}$, the same value.\n\n> **Watch out.** On the whole open disc the supremum of $|z^{n}|$ is $1$ for every $n$, so the convergence to $0$ is not uniform there; only compact subsets give it.",
        "在较小的闭圆盘 $|z| \\le r$（$r < 1$）上，$|z^{n}|$ 的上确界是 $r^{n}$，它趋于 $0$。所以 $z^{n}$ 在单位圆盘的紧子集上一致趋于 $0$，但在整个圆盘上并非如此。例如，在 $|z| \\le \\frac{1}{2}$ 上 $|z^{3}|$ 的上确界是 $(\\frac{1}{2})^{3} = \\frac{1}{8}$，在圆周 $|z| = \\frac{1}{2}$ 上取到。\n\n检验：$|z^{3}| = |z|^{3}$ 随 $|z|$ 增大，而在 $z = -\\frac{1}{2}$ 处得 $|-\\frac{1}{8}| = \\frac{1}{8}$，值相同。\n\n> **注意。** 在整个开圆盘上，对每个 $n$，$|z^{n}|$ 的上确界都是 $1$，所以那里趋于 $0$ 不是一致的；只有紧子集上才是。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(2, 9);
          const q = rng.int(2, 5);
          const n = rng.int(2, 4);
          const sup = Q.of(c, q ** n);
          const raw = `\\frac{${c}}{${q ** n}}`;
          const misses: Miss[] = [
            [
              Q.of(c, q),
              `That forgets the power: $|z|$ is raised to the ${n === 2 ? "second" : n === 3 ? "third" : "fourth"} power.`,
              `那漏掉了幂：$|z|$ 要取 ${n} 次方。`,
            ],
            [Q.of(1, q ** n), `That drops the factor $${c}$ in front.`, `那丢掉了前面的系数 $${c}$。`],
            [
              Q.of(c * n, q),
              `That multiplies by the exponent $${n}$ instead of raising to it.`,
              `那是乘以指数 $${n}$，而不是取 ${n} 次方。`,
            ],
          ];
          return worked(
            [
              `What is the supremum of $|${c}z^{${n}}|$ on $|z| \\le \\frac{1}{${q}}$?`,
              `$|${c}z^{${n}}|$ 在 $|z| \\le \\frac{1}{${q}}$ 上的上确界是多少？`,
            ],
            sup,
            misses,
            [
              [
                ["Locate the maximum", "找最大值的位置"],
                [
                  `$|${c}z^{${n}}| = ${c}|z|^{${n}}$ grows with $|z|$, so the largest value is on the circle $|z| = \\frac{1}{${q}}$.`,
                  `$|${c}z^{${n}}| = ${c}|z|^{${n}}$ 随 $|z|$ 增大，所以最大值在圆周 $|z| = \\frac{1}{${q}}$ 上。`,
                ],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `$${c} \\cdot (\\frac{1}{${q}})^{${n}} = \\frac{${c}}{${q ** n}}${raw === sup.toLatex() ? "" : ` = ${sup.toLatex()}`}$.`,
                  `$${c} \\cdot (\\frac{1}{${q}})^{${n}} = \\frac{${c}}{${q ** n}}${raw === sup.toLatex() ? "" : ` = ${sup.toLatex()}`}$。`,
                ],
              ],
            ],
            [
              `At the point $z = \\frac{1}{${q}}$ itself, $${c}z^{${n}} = \\frac{${c}}{${q ** n}}$, so the value is attained, and every smaller $|z|$ gives less.`,
              `在点 $z = \\frac{1}{${q}}$ 处，$${c}z^{${n}} = \\frac{${c}}{${q ** n}}$，所以这个值能取到，而更小的 $|z|$ 给出的值更小。`,
            ],
          );
        }),
    ),
  ],
);

const mittagLeffler = topic(
  "partial-fractions-and-mittag-lefflers-theorem",
  ["Partial Fractions and Mittag-Leffler's Theorem", "部分分式与米塔格-莱夫勒定理"],
  ["Build a meromorphic function from its poles.", "由极点构造亚纯函数。"],
  ["computing-residues"],
  [],
  [
    point(
      "a-function-from-its-poles",
      ["A function from its poles", "由极点得到函数"],
      [
        "A rational function that vanishes at infinity is determined by its principal parts: if its only poles are simple, then it is the sum of $\\frac{r_{k}}{z - a_{k}}$ over its poles $a_{k}$ with residues $r_{k}$. For example, with a pole at $0$ of residue $2$ and a pole at $1$ of residue $3$, the function is $f(z) = \\frac{2}{z} + \\frac{3}{z - 1}$, and $f(2) = 1 + 3 = 4$.\n\nCheck: over a common denominator $f(z) = \\frac{5z - 2}{z(z - 1)}$, which vanishes at infinity and at $z = 2$ gives $\\frac{8}{2} = 4$.\n\n> **Watch out.** Every pole contributes at every point: the value at $z = 2$ is the sum of both terms, not just the term of the nearest pole.",
        "在无穷远处为零的有理函数由它的主部决定：如果它只有单极点，它就等于各极点 $a_{k}$ 处 $\\frac{r_{k}}{z - a_{k}}$ 的和，其中 $r_{k}$ 是留数。例如，$0$ 处有留数为 $2$ 的极点、$1$ 处有留数为 $3$ 的极点，这个函数就是 $f(z) = \\frac{2}{z} + \\frac{3}{z - 1}$，而 $f(2) = 1 + 3 = 4$。\n\n检验：通分得 $f(z) = \\frac{5z - 2}{z(z - 1)}$，它在无穷远处为零，在 $z = 2$ 处得 $\\frac{8}{2} = 4$。\n\n> **注意。** 每个极点在每一点都有贡献：$z = 2$ 处的值是两项之和，不只是最近那个极点的项。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-6, 2);
          const b = a + rng.int(1, 6);
          const w = b + rng.int(1, 6);
          const r = rng.int(1, 9);
          const s = rng.int(1, 9);
          const first = Q.of(r, w - a);
          const second = Q.of(s, w - b);
          const value = first.add(second);
          const less = (p: number) => (p < 0 ? `z + ${-p}` : p === 0 ? "z" : `z - ${p}`);
          const top = (r + s) * w - r * b - s * a;
          const bottom = (w - a) * (w - b);
          const whole = `\\frac{${top}}{${bottom}}`;
          const misses: Miss[] = [
            [
              first,
              `That keeps only the pole at $${a}$; the pole at $${b}$ adds $${second.toLatex()}$.`,
              `那只保留了 $${a}$ 处的极点；$${b}$ 处的极点还要加上 $${second.toLatex()}$。`,
            ],
            [
              second,
              `That keeps only the pole at $${b}$; the pole at $${a}$ adds $${first.toLatex()}$.`,
              `那只保留了 $${b}$ 处的极点；$${a}$ 处的极点还要加上 $${first.toLatex()}$。`,
            ],
            [
              Q.of(r + s, 2 * w - a - b),
              "That adds the numerators and the denominators separately, which is not how fractions add.",
              "那把分子和分母分别相加，分数不是这样相加的。",
            ],
          ];
          return worked(
            [
              `A rational function vanishes at infinity, and its only poles are simple, at $z = ${a}$ with residue ${r} and at $z = ${b}$ with residue ${s}. What is its value at $z = ${w}$?`,
              `一个有理函数在无穷远处为零，它只有单极点：$z = ${a}$ 处留数为 ${r}，$z = ${b}$ 处留数为 ${s}。它在 $z = ${w}$ 处的值是多少？`,
            ],
            value,
            misses,
            [
              [
                ["Write the principal parts", "写出主部"],
                [
                  `$f(z) = \\frac{${r}}{${less(a)}} + \\frac{${s}}{${less(b)}}$.`,
                  `$f(z) = \\frac{${r}}{${less(a)}} + \\frac{${s}}{${less(b)}}$。`,
                ],
              ],
              [
                ["Substitute", "代入"],
                [
                  `At $z = ${w}$ the terms are $${first.toLatex()}$ and $${second.toLatex()}$, so $f(${w}) = ${value.toLatex()}$.`,
                  `在 $z = ${w}$ 处两项分别是 $${first.toLatex()}$ 和 $${second.toLatex()}$，所以 $f(${w}) = ${value.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Over a common denominator, the numerator at $z = ${w}$ is $${r}(${w - b}) + ${s}(${w - a}) = ${top}$ and the denominator is $${w - a} \\cdot ${w - b} = ${bottom}$, giving $\\frac{${top}}{${bottom}}${whole === value.toLatex() ? "" : ` = ${value.toLatex()}`}$ again.`,
              `通分后，$z = ${w}$ 处分子是 $${r}(${w - b}) + ${s}(${w - a}) = ${top}$，分母是 $${w - a} \\cdot ${w - b} = ${bottom}$，同样得到 $\\frac{${top}}{${bottom}}${whole === value.toLatex() ? "" : ` = ${value.toLatex()}`}$。`,
            ],
          );
        }),
    ),
    point(
      "terms-that-make-it-converge",
      ["Terms that make it converge", "使级数收敛的项"],
      [
        "With infinitely many poles the sum of principal parts may diverge. Mittag-Leffler's theorem subtracts a polynomial from each term to force convergence. For poles at the integers, adding $\\frac{1}{n}$ to $\\frac{1}{z - n}$ leaves a term of size about $\\frac{1}{n^{2}}$. For example, with $z = 1$ and $n = 3$, $\\frac{1}{1 - 3} + \\frac{1}{3} = -\\frac{1}{2} + \\frac{1}{3} = -\\frac{1}{6}$; in general the two combine to $\\frac{z}{n(z - n)}$, which for large $|n|$ is about $-\\frac{z}{n^{2}}$, and $\\sum \\frac{1}{n^{2}}$ converges.\n\nCheck: the combined form at $z = 1$, $n = 3$ is $\\frac{1}{3 \\cdot (-2)} = -\\frac{1}{6}$, the same value.\n\n> **Watch out.** The sign of the added term matters: $\\frac{1}{z - n}$ is about $-\\frac{1}{n}$, so subtracting $\\frac{1}{n}$ makes it about $-\\frac{2}{n}$, and $\\sum \\frac{1}{n}$ diverges.",
        "有无穷多个极点时，主部的和可能发散。米塔格-莱夫勒定理从每一项减去一个多项式来保证收敛。极点在整数处时，给 $\\frac{1}{z - n}$ 加上 $\\frac{1}{n}$，剩下的项大小约为 $\\frac{1}{n^{2}}$。例如，取 $z = 1$、$n = 3$，$\\frac{1}{1 - 3} + \\frac{1}{3} = -\\frac{1}{2} + \\frac{1}{3} = -\\frac{1}{6}$；一般地两项合并为 $\\frac{z}{n(z - n)}$，当 $|n|$ 很大时约为 $-\\frac{z}{n^{2}}$，而 $\\sum \\frac{1}{n^{2}}$ 收敛。\n\n检验：合并后的形式在 $z = 1$、$n = 3$ 处是 $\\frac{1}{3 \\cdot (-2)} = -\\frac{1}{6}$，值相同。\n\n> **注意。** 所加项的符号很重要：$\\frac{1}{z - n}$ 约为 $-\\frac{1}{n}$，所以减去 $\\frac{1}{n}$ 会使它约为 $-\\frac{2}{n}$，而 $\\sum \\frac{1}{n}$ 发散。",
      ],
      (rng) => {
        const a = rng.int(2, 60);
        const slips: Slip[] = [
          [
            same(`\\sum_{n \\ne 0} \\left(\\frac{1}{z - ${a}n} - \\frac{1}{${a}n}\\right)`),
            `Here the terms are about $-\\frac{2}{${a}n}$ for large $|n|$, so the part over positive $n$ diverges like $\\sum \\frac{1}{n}$, and so does the part over negative $n$.`,
            `这里当 $|n|$ 很大时各项约为 $-\\frac{2}{${a}n}$，所以正 $n$ 的部分像 $\\sum \\frac{1}{n}$ 一样发散，负 $n$ 的部分也一样。`,
          ],
          [
            same(`\\sum_{n \\ge 1} \\left(\\frac{1}{z - ${a}n} + \\frac{1}{z}\\right)`),
            "Each term tends to $\\frac{1}{z}$, not to $0$, so the series diverges; it also misses the negative multiples.",
            "每一项趋于 $\\frac{1}{z}$ 而不是 $0$，所以级数发散；它也漏掉了负的倍数。",
          ],
          [
            same(`\\sum_{n \\ge 1} \\frac{1}{z - ${a}n}`),
            `Its terms are about $-\\frac{1}{${a}n}$, so it diverges like the harmonic series; it also misses the negative multiples.`,
            `它的各项约为 $-\\frac{1}{${a}n}$，所以像调和级数一样发散；它也漏掉了负的倍数。`,
          ],
        ];
        return chosen(
          rng,
          [
            `Which series converges to a function with simple poles at the nonzero multiples of ${a}?`,
            `哪个级数收敛到在 ${a} 的非零倍数处有单极点的函数？`,
          ],
          same(`\\sum_{n \\ne 0} \\left(\\frac{1}{z - ${a}n} + \\frac{1}{${a}n}\\right)`),
          slips,
          [
            [
              ["Combine each term", "合并每一项"],
              [
                `$\\frac{1}{z - ${a}n} + \\frac{1}{${a}n} = \\frac{${a}n + z - ${a}n}{${a}n(z - ${a}n)} = \\frac{z}{${a}n(z - ${a}n)}$.`,
                `$\\frac{1}{z - ${a}n} + \\frac{1}{${a}n} = \\frac{${a}n + z - ${a}n}{${a}n(z - ${a}n)} = \\frac{z}{${a}n(z - ${a}n)}$。`,
              ],
            ],
            [
              ["Compare with a convergent series", "与收敛级数比较"],
              [
                `For large $|n|$ the term is about $-\\frac{z}{${a * a}n^{2}}$, and $\\sum \\frac{1}{n^{2}}$ converges, uniformly for $z$ in any bounded set away from the poles.`,
                `当 $|n|$ 很大时这一项约为 $-\\frac{z}{${a * a}n^{2}}$，而 $\\sum \\frac{1}{n^{2}}$ 收敛，对远离极点的任何有界集中的 $z$ 都一致收敛。`,
              ],
            ],
          ],
          [
            `Read off the poles: the $n$-th term blows up only at $z = ${a}n$, with residue $1$, and $n$ runs over every nonzero integer, so the poles are exactly the nonzero multiples of ${a}.`,
            `看极点：第 $n$ 项只在 $z = ${a}n$ 处趋于无穷，留数为 $1$，而 $n$ 取遍所有非零整数，所以极点恰好是 ${a} 的非零倍数。`,
          ],
        );
      },
    ),
    point(
      "the-expansion-of-a-trigonometric-function",
      ["The expansion of a trigonometric function", "三角函数的展开"],
      [
        "Comparing principal parts shows that $\\frac{\\pi^{2}}{\\sin^{2} \\pi z} = \\sum_{n \\in \\mathbb{Z}} \\frac{1}{(z - n)^{2}}$. Evaluating at a rational point turns this into the value of a series. For example, at $z = \\frac{1}{2}$ the left side is $\\frac{\\pi^{2}}{\\sin^{2} \\frac{\\pi}{2}} = \\pi^{2}$, so $\\sum_{n \\in \\mathbb{Z}} \\frac{1}{(\\frac{1}{2} - n)^{2}} = \\pi^{2}$.\n\nCheck: each term is $\\frac{4}{(2n - 1)^{2}}$, and every odd number $2n - 1$ appears twice up to sign, so the sum is $8 \\sum_{m \\text{ odd}} \\frac{1}{m^{2}} = 8 \\cdot \\frac{\\pi^{2}}{8} = \\pi^{2}$.\n\n> **Watch out.** The sine sits in the denominator: at $z = \\frac{1}{6}$, $\\sin^{2} \\frac{\\pi}{6} = \\frac{1}{4}$, so the sum is $4\\pi^{2}$, not $\\frac{\\pi^{2}}{4}$.",
        "比较主部可知 $\\frac{\\pi^{2}}{\\sin^{2} \\pi z} = \\sum_{n \\in \\mathbb{Z}} \\frac{1}{(z - n)^{2}}$。在有理点取值，就得到一个级数的值。例如，在 $z = \\frac{1}{2}$ 处左边是 $\\frac{\\pi^{2}}{\\sin^{2} \\frac{\\pi}{2}} = \\pi^{2}$，所以 $\\sum_{n \\in \\mathbb{Z}} \\frac{1}{(\\frac{1}{2} - n)^{2}} = \\pi^{2}$。\n\n检验：每一项是 $\\frac{4}{(2n - 1)^{2}}$，每个奇数 $2n - 1$ 连同符号出现两次，所以和是 $8 \\sum_{m \\text{ 为奇数}} \\frac{1}{m^{2}} = 8 \\cdot \\frac{\\pi^{2}}{8} = \\pi^{2}$。\n\n> **注意。** 正弦在分母上：在 $z = \\frac{1}{6}$ 处 $\\sin^{2} \\frac{\\pi}{6} = \\frac{1}{4}$，所以和是 $4\\pi^{2}$，不是 $\\frac{\\pi^{2}}{4}$。",
      ],
      (rng) =>
        until(() => {
          const [den, k, sine, square, size] = rng.pick([
            [2, Q.of(1, 1), "1", "1", 1],
            [3, Q.of(4, 3), "\\frac{\\sqrt{3}}{2}", "\\frac{3}{4}", 4 / 3],
            [4, Q.of(2, 1), "\\frac{\\sqrt{2}}{2}", "\\frac{1}{2}", 2],
            [6, Q.of(4, 1), "\\frac{1}{2}", "\\frac{1}{4}", 4],
          ] as const);
          const c = rng.int(1, 9);
          const answer = k.mul(Q.of(c, 1));
          const piTimes = answer.eq(Q.of(1, 1)) ? "\\pi^{2}" : `${answer.toLatex()}\\pi^{2}`;
          const near = Q.of(c * den * den, 1).add(Q.of(c * den * den, (den - 1) ** 2));
          const approx = (size * c * Math.PI ** 2).toFixed(2);
          const misses: Miss[] = [
            [
              Q.of(c, den),
              `That uses $\\frac{1}{${den}}$ in place of $\\frac{1}{\\sin^{2}(\\pi / ${den})}$.`,
              `那用 $\\frac{1}{${den}}$ 代替了 $\\frac{1}{\\sin^{2}(\\pi / ${den})}$。`,
            ],
            [
              Q.of(c, 1),
              `That drops the factor $\\frac{1}{\\sin^{2}(\\pi / ${den})} = ${k.toLatex()}$.`,
              `那丢掉了因子 $\\frac{1}{\\sin^{2}(\\pi / ${den})} = ${k.toLatex()}$。`,
            ],
            [k, `That drops the numerator $${c}$ of every term.`, `那丢掉了每一项的分子 $${c}$。`],
            [
              Q.of(c, 1).div(k),
              `That multiplies by $\\sin^{2}(\\pi / ${den}) = ${square}$ instead of dividing by it.`,
              `那是乘以 $\\sin^{2}(\\pi / ${den}) = ${square}$，而不是除以它。`,
            ],
          ];
          return worked(
            [
              `The series $\\sum_{n \\in \\mathbb{Z}} \\frac{${c}}{(\\frac{1}{${den}} - n)^{2}}$ equals $k\\pi^{2}$. What is $k$?`,
              `级数 $\\sum_{n \\in \\mathbb{Z}} \\frac{${c}}{(\\frac{1}{${den}} - n)^{2}}$ 等于 $k\\pi^{2}$。$k$ 是多少？`,
            ],
            answer,
            misses,
            [
              [
                ["Use the expansion", "用展开式"],
                [
                  `At $z = \\frac{1}{${den}}$ the series is $${c === 1 ? "" : `${c} \\cdot `}\\frac{\\pi^{2}}{\\sin^{2}(\\pi / ${den})}$.`,
                  `在 $z = \\frac{1}{${den}}$ 处级数等于 $${c === 1 ? "" : `${c} \\cdot `}\\frac{\\pi^{2}}{\\sin^{2}(\\pi / ${den})}$。`,
                ],
              ],
              [
                ["Evaluate the sine", "求正弦值"],
                [
                  `$\\sin(\\pi / ${den}) = ${sine}$, so $\\sin^{2}(\\pi / ${den}) = ${square}$ and the series is $${piTimes}$, giving $k = ${answer.toLatex()}$.`,
                  `$\\sin(\\pi / ${den}) = ${sine}$，所以 $\\sin^{2}(\\pi / ${den}) = ${square}$，级数等于 $${piTimes}$，即 $k = ${answer.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The two nearest terms, $n = 0$ and $n = 1$, already give $${near.toLatex()}$, a little under $${piTimes} \\approx ${approx}$, as they must, since every other term is positive and small.`,
              `最近的两项 $n = 0$ 和 $n = 1$ 已经给出 $${near.toLatex()}$，略小于 $${piTimes} \\approx ${approx}$，理应如此，因为其余各项都是正的小量。`,
            ],
          );
        }),
    ),
  ],
);

const schwarzChristoffel = topic(
  "the-schwarz-christoffel-formula",
  ["The Schwarz-Christoffel Formula", "施瓦茨-克里斯托费尔公式"],
  ["Map the upper half plane onto the inside of a polygon.", "把上半平面映到多边形内部。"],
  ["conformal-maps-of-regions"],
  [],
  [
    {
      ...point(
        "the-exponent-at-a-vertex",
        ["The exponent at a vertex", "顶点处的指数"],
        [
          "A map of the upper half plane onto a polygon has $f'(z) = A \\prod (z - x_{k})^{\\alpha_{k} - 1}$, where the polygon's interior angle at the image of $x_{k}$ is $\\alpha_{k}\\pi$. Each factor bends the boundary by the right amount. In the drawing, the right triangle has angles $\\frac{\\pi}{2}$, $\\frac{\\pi}{4}$ and $\\frac{\\pi}{4}$, so $\\alpha = \\frac{1}{2}, \\frac{1}{4}, \\frac{1}{4}$ and the exponents at $x_{1}$, $x_{2}$, $x_{3}$ are $\\frac{1}{2} - 1 = -\\frac{1}{2}$, $\\frac{1}{4} - 1 = -\\frac{3}{4}$ and $-\\frac{3}{4}$.\n\nCheck: as $z$ passes $x_{k}$ along the real axis, the factor's argument jumps by $-(\\alpha_{k} - 1)\\pi$, the turn at that corner: $\\frac{\\pi}{2}$ at the right angle and $\\frac{3\\pi}{4}$ at each other corner, which add to $2\\pi$, one full turn.\n\n> **Watch out.** The exponent is $\\alpha - 1$, not $\\alpha$: a corner with interior angle $\\frac{\\pi}{2}$ has exponent $-\\frac{1}{2}$, and a straight side, $\\alpha = 1$, has exponent $0$ and no factor at all.",
          "把上半平面映到多边形的映射满足 $f'(z) = A \\prod (z - x_{k})^{\\alpha_{k} - 1}$，其中多边形在 $x_{k}$ 的像处的内角是 $\\alpha_{k}\\pi$。每个因子让边界转过恰当的角度。图中直角三角形的三个角是 $\\frac{\\pi}{2}$、$\\frac{\\pi}{4}$ 和 $\\frac{\\pi}{4}$，所以 $\\alpha = \\frac{1}{2}, \\frac{1}{4}, \\frac{1}{4}$，$x_{1}$、$x_{2}$、$x_{3}$ 处的指数是 $\\frac{1}{2} - 1 = -\\frac{1}{2}$、$\\frac{1}{4} - 1 = -\\frac{3}{4}$ 和 $-\\frac{3}{4}$。\n\n检验：$z$ 沿实轴经过 $x_{k}$ 时，该因子的辐角跳变 $-(\\alpha_{k} - 1)\\pi$，即那个角处的转角：直角处 $\\frac{\\pi}{2}$，另两个角处各 $\\frac{3\\pi}{4}$，加起来是 $2\\pi$，恰好转一整圈。\n\n> **注意。** 指数是 $\\alpha - 1$，不是 $\\alpha$：内角 $\\frac{\\pi}{2}$ 的角指数是 $-\\frac{1}{2}$；而平直的边（$\\alpha = 1$）指数为 $0$，根本没有因子。",
        ],
        (rng) =>
          until(() => {
            const q = rng.int(2, 12);
            const start = rng.int(1, 2 * q - 2);
            const p = start === q ? 2 * q - 1 : start;
            const alpha = Q.of(p, q);
            const one = Q.of(1, 1);
            const exponent = alpha.sub(one);
            const turn = one.sub(alpha);
            const misses: Miss[] = [
              [alpha, "That is $\\alpha$ itself; the exponent is $\\alpha - 1$.", "那是 $\\alpha$ 本身；指数是 $\\alpha - 1$。"],
              [
                turn,
                "That is $1 - \\alpha$, the turn at the corner; the exponent has the opposite sign.",
                "那是 $1 - \\alpha$，即该角处的转角；指数的符号与它相反。",
              ],
              [alpha.add(one), "That adds $1$ to $\\alpha$ instead of subtracting it.", "那是给 $\\alpha$ 加 $1$，而不是减 $1$。"],
            ];
            return worked(
              [
                `A polygon has interior angle $${alpha.toLatex()}\\pi$ at a vertex. What is the exponent of the matching factor of $f'(z)$?`,
                `多边形在一个顶点的内角是 $${alpha.toLatex()}\\pi$。$f'(z)$ 中相应因子的指数是多少？`,
              ],
              exponent,
              misses,
              [
                [
                  ["Read off alpha", "读出 alpha"],
                  [
                    `The angle is $\\alpha\\pi$ with $\\alpha = ${alpha.toLatex()}$.`,
                    `内角是 $\\alpha\\pi$，其中 $\\alpha = ${alpha.toLatex()}$。`,
                  ],
                ],
                [
                  ["Subtract one", "减去一"],
                  [
                    `The factor is $(z - x_{k})^{\\alpha - 1}$, so the exponent is $${alpha.toLatex()} - 1 = ${exponent.toLatex()}$.`,
                    `因子是 $(z - x_{k})^{\\alpha - 1}$，所以指数是 $${alpha.toLatex()} - 1 = ${exponent.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `The boundary turns by $(1 - \\alpha)\\pi = ${turn.toLatex()}\\pi$ at this corner, and the exponent is minus that turn: $-(${turn.toLatex()}) = ${exponent.toLatex()}$.`,
                `边界在这个角处转过 $(1 - \\alpha)\\pi = ${turn.toLatex()}\\pi$，指数是这个转角的相反数：$-(${turn.toLatex()}) = ${exponent.toLatex()}$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-schwarz-christoffel-formula#the-exponent-at-a-vertex"],
    },
    {
      ...point(
        "exponents-add-to-minus-two",
        ["Exponents add to minus two", "指数和为负二"],
        [
          "The exterior angles of a polygon add to $2\\pi$, and the exterior angle at a vertex is $(1 - \\alpha_{k})\\pi$. So the exponents $\\alpha_{k} - 1$ always add to $-2$. In the drawing, the right triangle's exterior angles are $\\frac{\\pi}{2}$, $\\frac{3\\pi}{4}$ and $\\frac{3\\pi}{4}$, which add to $2\\pi$, and its exponents $-\\frac{1}{2}$, $-\\frac{3}{4}$ and $-\\frac{3}{4}$ add to $-2$.\n\nCheck: the interior angles $\\frac{\\pi}{2} + \\frac{\\pi}{4} + \\frac{\\pi}{4} = \\pi$ give the triangle's angle sum, so $\\sum \\alpha_{k} = 1$ and $\\sum (\\alpha_{k} - 1) = 1 - 3 = -2$.\n\n> **Watch out.** The total $-2$ holds for every polygon, whatever its number of sides; it is the interior angles whose sum, $(n - 2)\\pi$, depends on $n$.",
          "多边形的外角和是 $2\\pi$，一个顶点的外角是 $(1 - \\alpha_{k})\\pi$。所以指数 $\\alpha_{k} - 1$ 的和总是 $-2$。图中直角三角形的外角是 $\\frac{\\pi}{2}$、$\\frac{3\\pi}{4}$ 和 $\\frac{3\\pi}{4}$，加起来是 $2\\pi$；它的指数 $-\\frac{1}{2}$、$-\\frac{3}{4}$ 和 $-\\frac{3}{4}$ 加起来是 $-2$。\n\n检验：内角 $\\frac{\\pi}{2} + \\frac{\\pi}{4} + \\frac{\\pi}{4} = \\pi$ 正是三角形内角和，所以 $\\sum \\alpha_{k} = 1$，$\\sum (\\alpha_{k} - 1) = 1 - 3 = -2$。\n\n> **注意。** 总和 $-2$ 对每个多边形都成立，不论边数多少；依赖于 $n$ 的是内角和 $(n - 2)\\pi$。",
        ],
        (rng) =>
          until(() => {
            const n = rng.pick([6, 8, 9, 10, 12, 15]);
            const a = rng.int(1, n - 2);
            const b = rng.int(1, n - a - 1);
            const one = Q.of(1, 1);
            const e1 = Q.of(a, n).sub(one);
            const e2 = Q.of(b, n).sub(one);
            const e3 = Q.of(-2, 1).sub(e1).sub(e2);
            const misses: Miss[] = [
              [
                e3.add(one),
                "That takes the total to be $-1$; the exponents of a polygon add to $-2$.",
                "那把总和当成了 $-1$；多边形的指数之和是 $-2$。",
              ],
              [
                e3.sub(one),
                "That takes the total to be $-3$; the exponents add to $-2$, not to minus the number of vertices.",
                "那把总和当成了 $-3$；指数之和是 $-2$，不是顶点数的相反数。",
              ],
              [
                e1.add(e2),
                "That adds the two given exponents instead of taking what is left of $-2$.",
                "那把已知的两个指数相加了，而不是求 $-2$ 剩下的部分。",
              ],
            ];
            return worked(
              [
                `A triangle's map has exponents $${e1.toLatex()}$ and $${e2.toLatex()}$ at two vertices. What is the exponent at the third?`,
                `三角形的映射在两个顶点的指数是 $${e1.toLatex()}$ 和 $${e2.toLatex()}$。第三个顶点的指数是多少？`,
              ],
              e3,
              misses,
              [
                [
                  ["Use the total", "用总和"],
                  [
                    "The exterior angles add to $2\\pi$, so the three exponents add to $-2$.",
                    "外角和是 $2\\pi$，所以三个指数之和是 $-2$。",
                  ],
                ],
                [
                  ["Solve for the third", "求第三个"],
                  [
                    `$-2 - (${e1.toLatex()}) - (${e2.toLatex()}) = ${e3.toLatex()}$.`,
                    `$-2 - (${e1.toLatex()}) - (${e2.toLatex()}) = ${e3.toLatex()}$。`,
                  ],
                ],
              ],
              [
                `Through the angles: $\\alpha = ${Q.of(a, n).toLatex()}$, $${Q.of(b, n).toLatex()}$ and $${e3.add(one).toLatex()}$, which add to $1$, the triangle's angle sum $\\pi$ divided by $\\pi$.`,
                `用内角验证：$\\alpha = ${Q.of(a, n).toLatex()}$、$${Q.of(b, n).toLatex()}$ 和 $${e3.add(one).toLatex()}$，加起来是 $1$，即三角形内角和 $\\pi$ 除以 $\\pi$。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-schwarz-christoffel-formula#exponents-add-to-minus-two"],
    },
    {
      ...point(
        "a-regular-polygon",
        ["A regular polygon", "正多边形"],
        [
          "The interior angle of a regular $n$-gon is $\\frac{n - 2}{n}\\pi$, so each factor has exponent $-\\frac{2}{n}$. The disc maps onto the polygon by $f'(z) = \\left(1 - z^{n}\\right)^{-2/n}$, with vertices at the $n$th roots of unity. In the drawing, $n = 6$: the hexagon's interior angle is $\\frac{4}{6}\\pi = \\frac{2\\pi}{3}$, and the exponent is $\\frac{2}{3} - 1 = -\\frac{1}{3}$, which is $-\\frac{2}{6}$.\n\nCheck: the six equal exponents add to $6 \\cdot (-\\frac{1}{3}) = -2$, as the exponents of every polygon must.\n\n> **Watch out.** The exponent is $-\\frac{2}{n}$, not the angle fraction $\\frac{n - 2}{n}$; for large $n$ the corners flatten and the exponent tends to $0$.",
          "正 $n$ 边形的内角是 $\\frac{n - 2}{n}\\pi$，所以每个因子的指数是 $-\\frac{2}{n}$。圆盘到多边形的映射满足 $f'(z) = \\left(1 - z^{n}\\right)^{-2/n}$，顶点对应 $n$ 次单位根。图中 $n = 6$：正六边形的内角是 $\\frac{4}{6}\\pi = \\frac{2\\pi}{3}$，指数是 $\\frac{2}{3} - 1 = -\\frac{1}{3}$，即 $-\\frac{2}{6}$。\n\n检验：六个相等的指数之和是 $6 \\cdot (-\\frac{1}{3}) = -2$，正符合每个多边形指数之和的要求。\n\n> **注意。** 指数是 $-\\frac{2}{n}$，不是内角的系数 $\\frac{n - 2}{n}$；$n$ 很大时角趋于平直，指数趋于 $0$。",
        ],
        (rng) =>
          until(() => {
            const n = rng.int(3, 60);
            const exponent = Q.of(-2, n);
            const angle = Q.of(n - 2, n);
            const misses: Miss[] = [
              [Q.of(2, n), "That has the wrong sign: a convex corner gives a negative exponent.", "那符号错了：凸角给出的指数是负的。"],
              [
                Q.of(-1, n),
                "That shares a total of $-1$ among the corners; the exponents add to $-2$.",
                "那是把总和 $-1$ 分给各个角；指数之和是 $-2$。",
              ],
              [
                angle,
                `That is the angle fraction $\\alpha = ${angle.toLatex()}$; the exponent is $\\alpha - 1$.`,
                `那是内角的系数 $\\alpha = ${angle.toLatex()}$；指数是 $\\alpha - 1$。`,
              ],
            ];
            return worked(
              [
                `What is the exponent of each factor in the formula for a regular ${n}-gon?`,
                `正 ${n} 边形的公式中，每个因子的指数是多少？`,
              ],
              exponent,
              misses,
              [
                [
                  ["Find the interior angle", "求内角"],
                  [
                    `The interior angles of a ${n}-gon add to $${n - 2}\\pi$, so each is $\\frac{${n - 2}}{${n}}\\pi$.`,
                    `${n} 边形的内角和是 $${n - 2}\\pi$，所以每个内角是 $\\frac{${n - 2}}{${n}}\\pi$。`,
                  ],
                ],
                [
                  ["Subtract one", "减去一"],
                  [
                    `$\\frac{${n - 2}}{${n}} - 1 = -\\frac{2}{${n}}${n % 2 === 0 ? ` = ${exponent.toLatex()}` : ""}$.`,
                    `$\\frac{${n - 2}}{${n}} - 1 = -\\frac{2}{${n}}${n % 2 === 0 ? ` = ${exponent.toLatex()}` : ""}$。`,
                  ],
                ],
              ],
              [
                `The ${n} equal exponents add to $${n} \\cdot (${exponent.toLatex()}) = -2$, as the exponents of every polygon must.`,
                `${n} 个相等的指数之和是 $${n} \\cdot (${exponent.toLatex()}) = -2$，正符合每个多边形指数之和的要求。`,
              ],
            );
          }),
      ),
      figure: complexDrawings2["the-schwarz-christoffel-formula#a-regular-polygon"],
    },
  ],
);

const ellipsoidMethod = topic(
  "the-ellipsoid-method",
  ["The Ellipsoid Method", "椭球法"],
  ["Trap the feasible region in ever smaller ellipsoids.", "用越来越小的椭球把可行域围住。"],
  ["the-complexity-of-linear-programming"],
  [],
  [
    point(
      "halving-in-one-dimension",
      ["Halving in one dimension", "一维情形的减半"],
      [
        "In one dimension an ellipsoid is an interval. Test its midpoint: if the midpoint violates a constraint, the feasible set lies on one side, so half the interval is discarded. This is bisection.\n\nAn interval of length 48 becomes 24, 12, 6 and then 3, so it reaches length 3 after 4 steps, since $\\frac{48}{3} = 16 = 2^{4}$.\n\nCheck: $3(2^{4}) = 48$.\n\n> **Watch out.** Count the halvings, which is the exponent of 2, not the factor $2^{m}$ itself.",
        "一维情形下椭球就是区间。检验它的中点：如果中点违反某个约束，可行集就在一侧，于是丢掉一半区间。这就是二分法。\n\n长度为 48 的区间依次变成 24、12、6、3，所以 4 步之后长度为 3，因为 $\\frac{48}{3} = 16 = 2^{4}$。\n\n检验：$3(2^{4}) = 48$。\n\n> **注意。** 要数减半的次数，即 2 的指数，而不是倍数 $2^{m}$ 本身。",
      ],
      (rng) => {
        const m = rng.int(3, 12);
        const e = rng.int(1, 5);
        return solved(
          [
            `An interval of length ${2 ** m * e} is halved at each step. After how many steps is its length ${e}?`,
            `长度为 ${2 ** m * e} 的区间每一步减半。多少步之后它的长度是 ${e}？`,
          ],
          m,
          [
            [m - 1, `That stops one step early, at length ${2 * e}.`, `这早停了一步，长度还是 ${2 * e}。`],
            [
              m + 1,
              `That halves once too often, down to length $${Q.of(e, 2).toLatex()}$.`,
              `这多减半了一次，长度变成 $${Q.of(e, 2).toLatex()}$。`,
            ],
            [2 ** m, "That is the factor by which the length shrinks, not the number of halvings.", "这是长度缩小的倍数，不是减半的次数。"],
          ],
          [
            [
              ["Find the factor", "求倍数"],
              [
                `The length must shrink by the factor $\\frac{${2 ** m * e}}{${e}} = ${2 ** m} = 2^{${m}}$.`,
                `长度要缩小的倍数是 $\\frac{${2 ** m * e}}{${e}} = ${2 ** m} = 2^{${m}}$。`,
              ],
            ],
            [
              ["Count the halvings", "数减半的次数"],
              [`Each step divides the length by 2, so $2^{${m}}$ takes ${m} steps.`, `每一步把长度除以 2，所以 $2^{${m}}$ 需要 ${m} 步。`],
            ],
          ],
          [
            `Halving ${m} times gives $\\frac{${2 ** m * e}}{2^{${m}}} = ${e}$, while ${m - 1} halvings leave ${2 * e}.`,
            `减半 ${m} 次得 $\\frac{${2 ** m * e}}{2^{${m}}} = ${e}$，而减半 ${m - 1} 次还剩 ${2 * e}。`,
          ],
        );
      },
    ),
    point(
      "finding-a-separating-constraint",
      ["Finding a separating constraint", "找到分离约束"],
      [
        "At each step the method tests the center of the ellipsoid. A violated constraint cuts through or beyond the center, so the feasible region lies in one half of the ellipsoid, and a smaller ellipsoid is drawn around that half.\n\nWith the center $(3, 4)$, the constraint $x + y \\le 9$ holds there, since $3 + 4 = 7$, but $x \\le 2$ fails, since $3 > 2$. So $x \\le 2$ gives the cut, and the next ellipsoid surrounds the half with $x \\le 3$.\n\nCheck: every feasible point has $x \\le 2 < 3$, so none is lost.\n\n> **Watch out.** A constraint that holds at the center does not cut; only a violated one separates the center from the feasible set.",
        "每一步都检验椭球的中心。被违反的约束穿过或越过中心，所以可行域位于椭球的一半之内，然后围绕这一半画一个更小的椭球。\n\n中心为 $(3, 4)$ 时，约束 $x + y \\le 9$ 在该点成立，因为 $3 + 4 = 7$；但 $x \\le 2$ 不成立，因为 $3 > 2$。所以 $x \\le 2$ 给出割，下一个椭球围住 $x \\le 3$ 的那一半。\n\n检验：每个可行点都有 $x \\le 2 < 3$，所以没有丢掉可行点。\n\n> **注意。** 在中心成立的约束不能作割；只有被违反的约束才把中心与可行集分开。",
      ],
      (rng) => {
        const x = rng.int(1, 9);
        const y = rng.int(1, 9);
        const room = rng.int(1, 4);
        const over = rng.int(1, 4);
        const all: Pair[] = [
          same(`x + y \\le ${x + y + room}`),
          same(`x \\le ${x + room}`),
          same(`y \\le ${y + room}`),
          same(`x - y \\le ${x - y + room}`),
        ];
        const cuts: Pair[] = [
          same(`x + y \\le ${x + y - over}`),
          same(`x \\le ${x - over}`),
          same(`y \\le ${y - over}`),
          same(`x - y \\le ${x - y - over}`),
        ];
        const i = rng.int(0, 3);
        const sides = [x + y, x, y, x - y];
        const bounds = [x + y - over, x - over, y - over, x - y - over];
        const wrong: Slip[] = all.flatMap((option, k): Slip[] =>
          k === i
            ? []
            : [
                [
                  option,
                  `At the center the left side is ${sides[k]}, within the bound ${(sides[k] ?? 0) + room}, so the center satisfies it.`,
                  `在中心处左边是 ${sides[k]}，不超过界 ${(sides[k] ?? 0) + room}，所以中心满足它。`,
                ],
              ],
        );
        return chosen(
          rng,
          [`The center of the ellipsoid is $(${x}, ${y})$. Which constraint gives a cut?`, `椭球的中心是 $(${x}, ${y})$。哪个约束给出割？`],
          cuts[i] as Pair,
          wrong,
          [
            [
              ["Substitute the center", "代入中心"],
              [
                `Put $(${x}, ${y})$ into each constraint; the other three hold there, each with room ${room} to spare.`,
                `把 $(${x}, ${y})$ 代入每个约束；其余三个在该点都成立，各有 ${room} 的余量。`,
              ],
            ],
            [
              ["Find the violated one", "找被违反的约束"],
              [
                `In $${cuts[i]?.[0]}$ the left side is ${sides[i]}, more than the bound ${bounds[i]}, so this constraint fails at the center.`,
                `在 $${cuts[i]?.[1]}$ 中左边是 ${sides[i]}，超过界 ${bounds[i]}，所以这个约束在中心不成立。`,
              ],
            ],
          ],
          [
            `The violated constraint separates the center from the feasible set, since ${sides[i]} exceeds ${bounds[i]} by ${over}.`,
            `被违反的约束把中心与可行集分开，因为 ${sides[i]} 比 ${bounds[i]} 大 ${over}。`,
          ],
        );
      },
    ),
    point(
      "counting-the-iterations",
      ["Counting the iterations", "估计迭代次数"],
      [
        "In dimension $n$, each step shrinks the volume by a factor of at most $e^{-1/(2(n + 1))}$. Reducing the volume by a factor of $e^{k}$ thus takes at most $2(n + 1)k$ steps, a polynomial bound.\n\nIn dimension 2, reducing the volume by a factor of $e^{10}$ takes at most $2(2 + 1)(10) = 60$ steps.\n\nCheck: 60 steps multiply the volume by at most $e^{-60/6} = e^{-10}$.\n\n> **Watch out.** The factor is $2(n + 1)$, with $n + 1$ and not $n$, and it multiplies $k$ rather than being added to it.",
        "在 $n$ 维中，每一步把体积至少缩小为原来的 $e^{-1/(2(n + 1))}$ 倍。所以把体积缩小 $e^{k}$ 倍最多需要 $2(n + 1)k$ 步，这是一个多项式上界。\n\n在 2 维中，把体积缩小 $e^{10}$ 倍至多需要 $2(2 + 1)(10) = 60$ 步。\n\n检验：60 步至多把体积乘以 $e^{-60/6} = e^{-10}$。\n\n> **注意。** 因子是 $2(n + 1)$，用 $n + 1$ 而不是 $n$，而且它乘 $k$，而不是加到 $k$ 上。",
      ],
      (rng) => {
        const n = rng.int(2, 30);
        const k = rng.int(5, 40);
        const bound = 2 * (n + 1) * k;
        return solved(
          [
            `In dimension ${n}, what is the bound on the number of steps that reduce the volume by a factor of $e^{${k}}$?`,
            `在 ${n} 维中，把体积缩小 $e^{${k}}$ 倍所需步数的上界是多少？`,
          ],
          bound,
          [
            [(n + 1) * k, "That drops the factor 2 in $2(n + 1)$.", "这漏掉了 $2(n + 1)$ 中的因子 2。"],
            [2 * n * k, "That uses $n$ in place of $n + 1$.", "这用 $n$ 代替了 $n + 1$。"],
            [2 * (n + 1) + k, "That adds $k$ instead of multiplying by it.", "这加上了 $k$，而不是乘以 $k$。"],
          ],
          [
            [
              ["Shrink per step", "每步的缩小"],
              [
                `Each step multiplies the volume by at most $e^{-1/(2(${n} + 1))} = e^{-1/${2 * (n + 1)}}$.`,
                `每一步至多把体积乘以 $e^{-1/(2(${n} + 1))} = e^{-1/${2 * (n + 1)}}$。`,
              ],
            ],
            [
              ["Multiply by the exponent", "乘以指数"],
              [
                `A factor of $e^{${k}}$ then takes at most $2(${n} + 1)(${k}) = ${bound}$ steps.`,
                `于是缩小 $e^{${k}}$ 倍至多需要 $2(${n} + 1)(${k}) = ${bound}$ 步。`,
              ],
            ],
          ],
          [
            `After ${bound} steps the volume is multiplied by at most $e^{-${bound}/${2 * (n + 1)}} = e^{-${k}}$.`,
            `${bound} 步之后体积至多乘以 $e^{-${bound}/${2 * (n + 1)}} = e^{-${k}}$。`,
          ],
        );
      },
    ),
  ],
);

const interiorPoint = topic(
  "barrier-methods-and-the-central-path",
  ["Barrier Methods and the Central Path", "障碍法与中心路径"],
  ["Stay inside the feasible region and follow a path to the optimum.", "留在可行域内部，沿一条路径走向最优解。"],
  ["strong-duality-and-complementary-slackness"],
  [],
  [
    point(
      "the-logarithmic-barrier",
      ["The logarithmic barrier", "对数障碍"],
      [
        "Interior-point methods replace $x \\ge 0$ with a penalty $-\\mu \\ln x$ that grows without bound near the wall. Minimizing $cx - \\mu \\ln x$ for $c > 0$ sets the derivative $c - \\frac{\\mu}{x}$ to zero, which gives $x = \\frac{\\mu}{c}$.\n\nFor $4x - 2 \\ln x$, the derivative $4 - \\frac{2}{x}$ is zero at $x = \\frac{2}{4} = \\frac{1}{2}$.\n\nCheck: $4 - \\frac{2}{1/2} = 4 - 4 = 0$, and the second derivative $\\frac{2}{x^{2}}$ is positive, so this is a minimum.\n\n> **Watch out.** The minimizer is $\\frac{\\mu}{c}$, not $\\frac{c}{\\mu}$: a smaller $\\mu$ moves the point toward the wall $x = 0$.",
        "内点法把 $x \\ge 0$ 换成罚项 $-\\mu \\ln x$，它在靠近边界时无限增大。对 $c > 0$ 最小化 $cx - \\mu \\ln x$，令导数 $c - \\frac{\\mu}{x}$ 为零，得 $x = \\frac{\\mu}{c}$。\n\n对 $4x - 2 \\ln x$，导数 $4 - \\frac{2}{x}$ 在 $x = \\frac{2}{4} = \\frac{1}{2}$ 处为零。\n\n检验：$4 - \\frac{2}{1/2} = 4 - 4 = 0$，二阶导数 $\\frac{2}{x^{2}}$ 为正，所以这是最小值点。\n\n> **注意。** 最小值点是 $\\frac{\\mu}{c}$，不是 $\\frac{c}{\\mu}$：$\\mu$ 越小，点越靠近边界 $x = 0$。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const mu = rng.int(1, 9);
        const q = rng.pick([1, 2, 4, 5, 10]);
        const m = Q.of(mu, q);
        const at = m.div(Q.of(c, 1));
        return solved(
          [
            `For $x > 0$, where is $${c}x - ${m.toLatex()} \\ln x$ smallest?`,
            `当 $x > 0$ 时，$${c}x - ${m.toLatex()} \\ln x$ 在何处最小？`,
          ],
          at,
          [
            [Q.of(c, 1).div(m), "That is $\\frac{c}{\\mu}$, the ratio turned upside down.", "这是 $\\frac{c}{\\mu}$，比值颠倒了。"],
            [m, `That is $\\mu$ itself, without dividing by ${c}.`, `这是 $\\mu$ 本身，没有除以 ${c}。`],
            [m.mul(Q.of(c, 1)), `That multiplies $\\mu$ by ${c} instead of dividing.`, `这把 $\\mu$ 乘以 ${c}，而不是除以 ${c}。`],
          ],
          [
            [
              ["Differentiate", "求导"],
              [
                `With $\\mu = ${m.toLatex()}$, the derivative is $${c} - \\frac{\\mu}{x}$.`,
                `取 $\\mu = ${m.toLatex()}$，导数是 $${c} - \\frac{\\mu}{x}$。`,
              ],
            ],
            [
              ["Set it to zero", "令导数为零"],
              [
                `The derivative is zero at $x = \\frac{\\mu}{${c}} = ${at.toLatex()}$.`,
                `导数在 $x = \\frac{\\mu}{${c}} = ${at.toLatex()}$ 处为零。`,
              ],
            ],
          ],
          [
            `At $x = ${at.toLatex()}$ we have $${c}x = ${m.toLatex()} = \\mu$, so the derivative is 0, and the second derivative $\\frac{\\mu}{x^{2}}$ is positive.`,
            `在 $x = ${at.toLatex()}$ 处 $${c}x = ${m.toLatex()} = \\mu$，所以导数为 0，而二阶导数 $\\frac{\\mu}{x^{2}}$ 为正。`,
          ],
        );
      },
    ),
    point(
      "a-point-on-the-central-path",
      ["A point on the central path", "中心路径上的点"],
      [
        "The central path relaxes complementary slackness: primal and dual slack variables satisfy $x_{i}s_{i} = \\mu$ for every $i$, with the same $\\mu$. As $\\mu \\to 0$, the conditions become the optimality conditions.\n\nWith $\\mu = 6$ and $x_{1} = 4$, the slack is $s_{1} = \\frac{6}{4} = \\frac{3}{2}$.\n\nCheck: $4\\left(\\frac{3}{2}\\right) = 6 = \\mu$.\n\n> **Watch out.** Pair each slack with its own variable: $s_{1}$ comes from $x_{1}$, and the other variables play no part.",
        "中心路径放宽了互补松弛：原始变量与对偶松弛变量对每个 $i$ 都满足 $x_{i}s_{i} = \\mu$，其中 $\\mu$ 相同。当 $\\mu \\to 0$ 时，这些条件变成最优性条件。\n\n当 $\\mu = 6$，$x_{1} = 4$ 时，松弛变量 $s_{1} = \\frac{6}{4} = \\frac{3}{2}$。\n\n检验：$4\\left(\\frac{3}{2}\\right) = 6 = \\mu$。\n\n> **注意。** 每个松弛变量要和自己的变量配对：$s_{1}$ 由 $x_{1}$ 决定，其他变量不起作用。",
      ],
      (rng) => {
        const x = rng.int(2, 12);
        const mu = rng.int(1, 12);
        const other = rng.int(2, 12);
        const s = Q.of(mu, x);
        return solved(
          [
            `At a point on the central path with $\\mu = ${mu}$, $x_{1} = ${x}$ and $x_{2} = ${other}$. What is $s_{1}$?`,
            `在 $\\mu = ${mu}$ 的中心路径点上，$x_{1} = ${x}$，$x_{2} = ${other}$。$s_{1}$ 是多少？`,
          ],
          s,
          [
            [
              Q.of(mu, other),
              "That uses $x_{2}$; the slack $s_{1}$ pairs with $x_{1}$.",
              "这用了 $x_{2}$；松弛变量 $s_{1}$ 与 $x_{1}$ 配对。",
            ],
            [Q.of(x, mu), "That is $\\frac{x_{1}}{\\mu}$, the ratio turned upside down.", "这是 $\\frac{x_{1}}{\\mu}$，比值颠倒了。"],
            [Q.of(mu * x, 1), "That multiplies $\\mu$ by $x_{1}$ instead of dividing.", "这把 $\\mu$ 乘以 $x_{1}$，而不是除以 $x_{1}$。"],
          ],
          [
            [
              ["Write the path condition", "写出路径条件"],
              [`On the central path, $x_{1}s_{1} = \\mu = ${mu}$.`, `在中心路径上，$x_{1}s_{1} = \\mu = ${mu}$。`],
            ],
            [
              ["Divide", "相除"],
              [
                `With $x_{1} = ${x}$, $s_{1} = \\frac{${mu}}{${x}} = ${s.toLatex()}$.`,
                `由 $x_{1} = ${x}$ 得 $s_{1} = \\frac{${mu}}{${x}} = ${s.toLatex()}$。`,
              ],
            ],
          ],
          [
            `Then $x_{1}s_{1} = ${x}\\left(${s.toLatex()}\\right) = ${mu}$, which is $\\mu$.`,
            `于是 $x_{1}s_{1} = ${x}\\left(${s.toLatex()}\\right) = ${mu}$，正是 $\\mu$。`,
          ],
        );
      },
    ),
    point(
      "the-gap-along-the-path",
      ["The gap along the path", "路径上的对偶间隙"],
      [
        "The duality gap is $c^{T}x - b^{T}y = x^{T}s$, so at a point on the central path with $n$ variables the gap is exactly $n\\mu$. Shrinking $\\mu$ by a fixed factor at each step shrinks the gap geometrically.\n\nWith 10 variables, starting at $\\mu = 8$ and halving twice gives $\\mu = \\frac{8}{4} = 2$, so the gap is $10(2) = 20$.\n\nCheck: the starting gap $10(8) = 80$, halved twice, is $\\frac{80}{4} = 20$.\n\n> **Watch out.** After $k$ halvings $\\mu$ is divided by $2^{k}$, not by $2k$.",
        "对偶间隙是 $c^{T}x - b^{T}y = x^{T}s$，所以在有 $n$ 个变量的中心路径点上，间隙恰好是 $n\\mu$。每一步把 $\\mu$ 缩小固定倍数，间隙就按几何级数缩小。\n\n有 10 个变量时，从 $\\mu = 8$ 开始减半两次得 $\\mu = \\frac{8}{4} = 2$，所以间隙是 $10(2) = 20$。\n\n检验：起始间隙 $10(8) = 80$，减半两次得 $\\frac{80}{4} = 20$。\n\n> **注意。** 减半 $k$ 次后 $\\mu$ 被除以 $2^{k}$，而不是 $2k$。",
      ],
      (rng) => {
        const n = rng.int(3, 40);
        const mu = rng.int(1, 16);
        const k = rng.int(1, 5);
        const now = Q.of(mu, 2 ** k);
        const gap = Q.of(n * mu, 2 ** k);
        return solved(
          [
            `A central-path method with ${n} variables starts at $\\mu = ${mu}$ and halves $\\mu$ at each step. What is the duality gap after ${k} steps?`,
            `有 ${n} 个变量的中心路径法从 $\\mu = ${mu}$ 开始，每一步把 $\\mu$ 减半。${k} 步之后对偶间隙是多少？`,
          ],
          gap,
          [
            [now, `That is $\\mu$ itself; the gap is ${n} times $\\mu$.`, `这是 $\\mu$ 本身；间隙是 $\\mu$ 的 ${n} 倍。`],
            [Q.of(n * mu, 2 * k), `That divides by $2(${k})$ instead of ${2 ** k}.`, `这除以了 $2(${k})$，而不是 ${2 ** k}。`],
            [Q.of(n * mu, 1), "That is the gap at the start, before any halving.", "这是开始时的间隙，还没有减半。"],
          ],
          [
            [
              ["Halve the parameter", "把参数减半"],
              [
                `After ${k} halvings, $\\mu = \\frac{${mu}}{${2 ** k}} = ${now.toLatex()}$.`,
                `减半 ${k} 次后，$\\mu = \\frac{${mu}}{${2 ** k}} = ${now.toLatex()}$。`,
              ],
            ],
            [
              ["Multiply by the count", "乘以变量个数"],
              [
                `The gap is $n\\mu$ with $n = ${n}$, which gives ${n} times $${now.toLatex()}$, or $${gap.toLatex()}$.`,
                `间隙是 $n\\mu$，其中 $n = ${n}$，即 $${now.toLatex()}$ 的 ${n} 倍，为 $${gap.toLatex()}$。`,
              ],
            ],
          ],
          [
            `The starting gap is $${n}(${mu}) = ${n * mu}$, and halving it ${k} times, a division by ${2 ** k}, also gives $${gap.toLatex()}$.`,
            `起始间隙是 $${n}(${mu}) = ${n * mu}$，把它减半 ${k} 次，即除以 ${2 ** k}，也得 $${gap.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const transformsOnUnbounded = topic(
  "the-fourier-transform-for-waves-and-half-planes",
  ["The Fourier Transform for Waves and Half-Planes", "波与半平面上的傅里叶变换"],
  [
    "Solve the wave and Laplace equations on unbounded regions by transforming in x.",
    "对 x 作变换，求解无界区域上的波动方程和拉普拉斯方程。",
  ],
  ["the-fourier-transform-for-the-heat-equation", "the-wave-equation", "laplaces-equation"],
  [],
  [
    point(
      "each-frequency-oscillates",
      ["Each frequency oscillates", "每个频率都在振荡"],
      [
        "Transforming $u_{tt} = c^{2}u_{xx}$ in $x$ gives $\\hat{u}_{tt} = -c^{2}k^{2}\\hat{u}$. So the part of the wave with wavenumber $k$ oscillates in time with angular frequency $c|k|$ and period $\\frac{2\\pi}{c|k|}$.\n\nFor $u_{tt} = 4u_{xx}$ the speed is $c = 2$, so the part with $k = 3$ has angular frequency $2 \\cdot 3 = 6$ and period $\\frac{2\\pi}{6} = \\frac{\\pi}{3}$.\n\nCheck: $\\cos 6t$ first returns to $1$ when $6t = 2\\pi$, that is at $t = \\frac{\\pi}{3}$.\n\n> **Watch out.** The coefficient of $u_{xx}$ is $c^{2}$, not $c$: take its square root before multiplying by $|k|$.",
        "对 $u_{tt} = c^{2}u_{xx}$ 关于 $x$ 作变换，得 $\\hat{u}_{tt} = -c^{2}k^{2}\\hat{u}$。所以波数为 $k$ 的部分随时间振荡，角频率是 $c|k|$，周期是 $\\frac{2\\pi}{c|k|}$。\n\n对 $u_{tt} = 4u_{xx}$，波速是 $c = 2$，所以 $k = 3$ 的部分角频率是 $2 \\cdot 3 = 6$，周期是 $\\frac{2\\pi}{6} = \\frac{\\pi}{3}$。\n\n检验：$\\cos 6t$ 在 $6t = 2\\pi$，即 $t = \\frac{\\pi}{3}$ 时第一次回到 $1$。\n\n> **注意。** $u_{xx}$ 的系数是 $c^{2}$，不是 $c$：要先开平方，再乘 $|k|$。",
      ],
      (rng) =>
        until(() => {
          const c = rng.int(1, 9);
          const k = rng.pick([-1, 1]) * rng.int(1, 9);
          const w = c * Math.abs(k);
          const r = Q.of(2, w);
          const period = r.eq(Q.of(1, 1)) ? "\\pi" : `${r.toLatex()}\\pi`;
          const wave = c * c === 1 ? "u_{xx}" : `${c * c}u_{xx}`;
          const wt = w === 1 ? "t" : `${w}t`;
          return worked(
            [
              `For $u_{tt} = ${wave}$, the part with wavenumber $k = ${k}$ has period $r\\pi$. What is $r$?`,
              `对 $u_{tt} = ${wave}$，波数 $k = ${k}$ 的部分周期是 $r\\pi$。$r$ 是多少？`,
            ],
            r,
            [
              [
                Q.of(2, c * c * Math.abs(k)),
                `That uses $c^{2} = ${c * c}$ as the speed; the speed is its square root, ${c}.`,
                `那把 $c^{2} = ${c * c}$ 当成了波速；波速是它的平方根 ${c}。`,
              ],
              [
                Q.of(1, w),
                "That is half the period: one full cycle takes $2\\pi$ divided by the angular frequency.",
                "那是半个周期：一个完整周期是 $2\\pi$ 除以角频率。",
              ],
              [Q.of(2, c * k * k), "That multiplies by $k^{2}$; the angular frequency uses $|k|$.", "那乘了 $k^{2}$；角频率用的是 $|k|$。"],
              [
                Q.of(w, 2),
                "That turns the fraction upside down: the period is $2\\pi$ over the angular frequency.",
                "那把分数颠倒了：周期是 $2\\pi$ 除以角频率。",
              ],
            ],
            [
              [
                ["Find the speed", "求波速"],
                [`The coefficient is $c^{2} = ${c * c}$, so $c = ${c}$.`, `系数是 $c^{2} = ${c * c}$，所以 $c = ${c}$。`],
              ],
              [
                ["Find the period", "求周期"],
                [
                  `The angular frequency is $c|k| = ${c} \\cdot ${Math.abs(k)} = ${w}$, so the period is ${w === 1 ? "$2\\pi$" : `$\\frac{2\\pi}{${w}} = ${period}$`}, and $r = ${r.toLatex()}$.`,
                  `角频率是 $c|k| = ${c} \\cdot ${Math.abs(k)} = ${w}$，所以周期是 ${w === 1 ? "$2\\pi$" : `$\\frac{2\\pi}{${w}} = ${period}$`}，$r = ${r.toLatex()}$。`,
                ],
              ],
            ],
            [
              `$\\cos ${wt}$ first returns to $1$ when $${wt} = 2\\pi$, that is at $t = ${period}$.`,
              `$\\cos ${wt}$ 在 $${wt} = 2\\pi$，即 $t = ${period}$ 时第一次回到 $1$。`,
            ],
          );
        }),
    ),
    point(
      "decay-away-from-the-boundary",
      ["Decay away from the boundary", "离开边界后的衰减"],
      [
        "Transforming Laplace's equation on $y > 0$ gives $\\hat{u}_{yy} = k^{2}\\hat{u}$. The bounded solution is $\\hat{u}(k, y) = \\hat{u}(k, 0)e^{-|k|y}$. Rapid variations on the boundary fade fastest with height.\n\nFor $k = -3$, $|k| = 3$, so at height $y = 2$ that part is multiplied by $e^{-3 \\cdot 2} = e^{-6}$.\n\nCheck: the second derivative of $e^{-3y}$ is $9e^{-3y}$, so it solves $\\hat{u}_{yy} = 9\\hat{u}$, and it stays bounded as $y$ grows.\n\n> **Watch out.** The rate is $|k|$, not $k^{2}$: the equation has $k^{2}$, but the exponential that solves it has its square root.",
        "对 $y > 0$ 上的拉普拉斯方程作变换，得 $\\hat{u}_{yy} = k^{2}\\hat{u}$。有界解是 $\\hat{u}(k, y) = \\hat{u}(k, 0)e^{-|k|y}$。边界上变化快的部分随高度衰减得最快。\n\n对 $k = -3$，$|k| = 3$，所以在高度 $y = 2$ 处这一部分乘以 $e^{-3 \\cdot 2} = e^{-6}$。\n\n检验：$e^{-3y}$ 的二阶导数是 $9e^{-3y}$，所以它满足 $\\hat{u}_{yy} = 9\\hat{u}$，而且 $y$ 增大时保持有界。\n\n> **注意。** 衰减率是 $|k|$，不是 $k^{2}$：方程里是 $k^{2}$，而满足它的指数函数用的是它的平方根。",
      ],
      (rng) =>
        until(() => {
          const k = rng.pick([-1, 1]) * rng.int(1, 12);
          const y = rng.int(1, 9);
          const size = Math.abs(k);
          const v = size * y;
          const rate = size === 1 ? "y" : `${size}y`;
          return worked(
            [
              `Laplace's equation holds on $y > 0$. The part with wavenumber $k = ${k}$ at height $y = ${y}$ is $e^{-r}$ times its boundary value. What is $r$?`,
              `拉普拉斯方程在 $y > 0$ 上成立。波数 $k = ${k}$ 的部分在高度 $y = ${y}$ 处是其边界值的 $e^{-r}$ 倍。$r$ 是多少？`,
            ],
            v,
            [
              [
                k * k * y,
                "That uses $k^{2}$ as the rate; the rate is $|k|$, the square root of $k^{2}$.",
                "那把 $k^{2}$ 当成了衰减率；衰减率是 $|k|$，即 $k^{2}$ 的平方根。",
              ],
              [y, "That leaves out the wavenumber; the rate of decay is $|k|$.", "那漏掉了波数；衰减率是 $|k|$。"],
              [
                k * y,
                "That drops the absolute value; with $k < 0$ it would give a factor that grows with height.",
                "那去掉了绝对值；$k < 0$ 时会得到随高度增长的因子。",
              ],
              [size + y, "That adds $|k|$ and $y$; the exponent is their product.", "那把 $|k|$ 和 $y$ 相加了；指数是它们的积。"],
            ],
            [
              [
                ["Keep the bounded solution", "取有界解"],
                [
                  `$\\hat{u}_{yy} = ${k * k === 1 ? "" : k * k}\\hat{u}$ has the solutions $e^{${rate}}$ and $e^{-${rate}}$, and only $e^{-${rate}}$ stays bounded.`,
                  `$\\hat{u}_{yy} = ${k * k === 1 ? "" : k * k}\\hat{u}$ 的解是 $e^{${rate}}$ 和 $e^{-${rate}}$，只有 $e^{-${rate}}$ 保持有界。`,
                ],
              ],
              [
                ["Put in the height", "代入高度"],
                [
                  `At $y = ${y}$ the exponent is ${size === 1 ? `$-${y}$` : `$-${size} \\cdot ${y} = -${v}$`}, so $r = ${v}$.`,
                  `在 $y = ${y}$ 处指数是 ${size === 1 ? `$-${y}$` : `$-${size} \\cdot ${y} = -${v}$`}，所以 $r = ${v}$。`,
                ],
              ],
            ],
            [
              `The second derivative of $e^{-${rate}}$ is $${k * k === 1 ? "" : k * k}e^{-${rate}}$, as the equation needs, and at $y = ${y}$ it equals $e^{-${v}}$, below 1.`,
              `$e^{-${rate}}$ 的二阶导数是 $${k * k === 1 ? "" : k * k}e^{-${rate}}$，符合方程，而在 $y = ${y}$ 处它等于 $e^{-${v}}$，小于 1。`,
            ],
          );
        }),
    ),
    point(
      "the-poisson-kernel-of-a-half-plane",
      ["The Poisson kernel of a half-plane", "半平面的泊松核"],
      [
        "Inverting the factor $e^{-|k|y}$ gives $u(x, y) = \\frac{1}{\\pi}\\int \\frac{y \\, f(s)}{(x - s)^{2} + y^{2}} \\, ds$. This formula averages the boundary values, and nearby boundary points count the most. For $f = C$ on $[-a, a]$ and $0$ elsewhere, on the axis this is $u(0, y) = \\frac{2C}{\\pi}\\arctan\\frac{a}{y}$.\n\nFor $C = 12$ on $[-2, 2]$, at the point $(0, 2)$ we get $\\arctan\\frac{2}{2} = \\frac{\\pi}{4}$, so $u = \\frac{2 \\cdot 12}{\\pi} \\cdot \\frac{\\pi}{4} = 6$.\n\nCheck: seen from $(0, 2)$, the segment $[-2, 2]$ spans an angle of $\\frac{\\pi}{2}$, half of the straight angle $\\pi$, and half of $12$ is $6$.\n\n> **Watch out.** The $\\arctan$ is of $\\frac{a}{y}$, half-width over height, not $\\frac{y}{a}$: swapping them gives the share of the rest of the boundary instead.",
        "对因子 $e^{-|k|y}$ 作逆变换，得 $u(x, y) = \\frac{1}{\\pi}\\int \\frac{y \\, f(s)}{(x - s)^{2} + y^{2}} \\, ds$。这个公式对边界值取平均，靠近的边界点权重最大。当 $f$ 在 $[-a, a]$ 上等于 $C$、其余处为 $0$ 时，在轴上有 $u(0, y) = \\frac{2C}{\\pi}\\arctan\\frac{a}{y}$。\n\n对 $[-2, 2]$ 上的 $C = 12$，在点 $(0, 2)$ 处 $\\arctan\\frac{2}{2} = \\frac{\\pi}{4}$，所以 $u = \\frac{2 \\cdot 12}{\\pi} \\cdot \\frac{\\pi}{4} = 6$。\n\n检验：从 $(0, 2)$ 看，线段 $[-2, 2]$ 张成的角是 $\\frac{\\pi}{2}$，是平角 $\\pi$ 的一半，而 $12$ 的一半是 $6$。\n\n> **注意。** $\\arctan$ 里是 $\\frac{a}{y}$，即半宽除以高度，不是 $\\frac{y}{a}$：两者对调，得到的是其余边界所占的份额。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 9);
          const c = 6 * rng.int(1, 8);
          const [height, share, ratio, angle, span] = rng.pick([
            [`${a}`, Q.of(1, 2), "1", "\\frac{\\pi}{4}", "\\frac{\\pi}{2}"],
            [`${a === 1 ? "" : a}\\sqrt{3}`, Q.of(1, 3), "\\frac{1}{\\sqrt{3}}", "\\frac{\\pi}{6}", "\\frac{\\pi}{3}"],
            [`\\frac{${a}}{\\sqrt{3}}`, Q.of(2, 3), "\\sqrt{3}", "\\frac{\\pi}{3}", "\\frac{2\\pi}{3}"],
          ] as const);
          const value = share.mul(Q.of(c, 1));
          return worked(
            [
              `The boundary value on $y = 0$ is ${c} on $[${-a}, ${a}]$ and 0 elsewhere. What is the bounded harmonic function's value at $(0, ${height})$?`,
              `$y = 0$ 上的边界值在 $[${-a}, ${a}]$ 上是 ${c}，其余处是 0。有界调和函数在 $(0, ${height})$ 处的值是多少？`,
            ],
            value,
            [
              [
                Q.of(c, 1),
                `$${c}$ is the boundary value on the segment; the rest of the boundary is 0 and pulls the average down.`,
                `$${c}$ 是线段上的边界值；其余边界是 0，会把平均值拉低。`,
              ],
              [
                Q.of(1, 1).sub(share).mul(Q.of(c, 1)),
                "That uses $\\arctan\\frac{y}{a}$; the formula has $\\arctan\\frac{a}{y}$, half-width over height.",
                "那用了 $\\arctan\\frac{y}{a}$；公式里是 $\\arctan\\frac{a}{y}$，即半宽除以高度。",
              ],
              [value.mul(Q.of(1, 2)), "That leaves out the factor 2 in $\\frac{2C}{\\pi}$.", "那漏掉了 $\\frac{2C}{\\pi}$ 中的因子 2。"],
              [
                Q.of(0, 1),
                "The boundary is 0 only outside the segment; the point sees the segment and gets a share of its value.",
                "边界只在线段外是 0；这一点看得见线段，会分到它的一部分值。",
              ],
            ],
            [
              [
                ["Find the angle", "求角"],
                [
                  `Here $\\frac{a}{y} = ${ratio}$, so $\\arctan\\frac{a}{y} = ${angle}$.`,
                  `这里 $\\frac{a}{y} = ${ratio}$，所以 $\\arctan\\frac{a}{y} = ${angle}$。`,
                ],
              ],
              [
                ["Scale the boundary value", "乘边界值"],
                [
                  `$u = \\frac{2 \\cdot ${c}}{\\pi} \\cdot ${angle} = ${share.toLatex()} \\cdot ${c} = ${value.toLatex()}$.`,
                  `$u = \\frac{2 \\cdot ${c}}{\\pi} \\cdot ${angle} = ${share.toLatex()} \\cdot ${c} = ${value.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Seen from $(0, ${height})$, the segment spans an angle $2 \\cdot ${angle} = ${span}$, which is $${share.toLatex()}$ of the straight angle $\\pi$; and $${share.toLatex()} \\cdot ${c} = ${value.toLatex()}$.`,
              `从 $(0, ${height})$ 看，线段张成的角是 $2 \\cdot ${angle} = ${span}$，占平角 $\\pi$ 的 $${share.toLatex()}$；而 $${share.toLatex()} \\cdot ${c} = ${value.toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

const fundamentalSolutions = topic(
  "fundamental-solutions-of-laplaces-equation",
  ["Fundamental Solutions of Laplace's Equation", "拉普拉斯方程的基本解"],
  ["Find the potential of a point source in the plane and in space.", "求平面和空间中点源的势。"],
  ["greens-functions-on-an-interval"],
  [],
  [
    {
      ...point(
        "the-formula-in-each-dimension",
        ["The formula in each dimension", "各维度的公式"],
        [
          "The solution of $-\\Delta u = \\delta$ that depends only on the distance $r$ is $-\\frac{1}{2\\pi}\\ln r$ in the plane and $\\frac{1}{4\\pi r}$ in space. The constant makes the flux through a small circle or sphere equal to $1$.\n\nAs the figure shows, at $r = 1$ the plane solution is $-\\frac{1}{2\\pi}\\ln 1 = 0$ and it is negative beyond, while the space solution is $\\frac{1}{4\\pi}$ there and stays positive.\n\nCheck: in space $|u'| = \\frac{1}{4\\pi r^{2}}$, and times the area $4\\pi r^{2}$ of the sphere that is $1$; in the plane $|u'| = \\frac{1}{2\\pi r}$, and times the length $2\\pi r$ of the circle that is $1$ too.\n\n> **Watch out.** In the plane the solution is a logarithm, not a power of $r$, and it carries a minus sign: $-\\frac{1}{2\\pi}\\ln r$ falls as $r$ grows, as the potential of a positive source must.",
          "$-\\Delta u = \\delta$ 只依赖距离 $r$ 的解，在平面上是 $-\\frac{1}{2\\pi}\\ln r$，在空间中是 $\\frac{1}{4\\pi r}$。常数使穿过小圆或小球面的通量等于 $1$。\n\n如图所示，在 $r = 1$ 处平面解是 $-\\frac{1}{2\\pi}\\ln 1 = 0$，再往外就是负的；而空间解在那里是 $\\frac{1}{4\\pi}$，并且一直为正。\n\n检验：在空间中 $|u'| = \\frac{1}{4\\pi r^{2}}$，乘以球面面积 $4\\pi r^{2}$ 得 $1$；在平面上 $|u'| = \\frac{1}{2\\pi r}$，乘以圆周长 $2\\pi r$ 也得 $1$。\n\n> **注意。** 平面上的解是对数，不是 $r$ 的幂，而且带负号：$-\\frac{1}{2\\pi}\\ln r$ 随 $r$ 增大而减小，正源的势理应如此。",
        ],
        (rng) => {
          const plane = rng.bool();
          const q = rng.int(2, 60);
          const a = `-\\frac{${q}}{2\\pi}\\ln r`;
          const b = `\\frac{${q}}{4\\pi r}`;
          const slips: Slip[] = plane
            ? [
                [
                  same(b),
                  "That is the fundamental solution in space; in the plane it is a logarithm.",
                  "那是空间中的基本解；平面上的基本解是对数。",
                ],
                [
                  same(`\\frac{${q}}{2\\pi}\\ln r`),
                  "That has the wrong sign: it grows with $r$, so its flux points inward.",
                  "符号错了：它随 $r$ 增大，通量指向内侧。",
                ],
                [
                  same(`\\frac{${q}}{2\\pi r}`),
                  "That is the size of the field $|u'|$, not the potential itself.",
                  "那是场的大小 $|u'|$，不是势本身。",
                ],
              ]
            : [
                [
                  same(a),
                  "That is the fundamental solution in the plane; in space it is a multiple of $\\frac{1}{r}$.",
                  "那是平面上的基本解；空间中的基本解是 $\\frac{1}{r}$ 的倍数。",
                ],
                [
                  same(`-\\frac{${q}}{4\\pi r}`),
                  "That has the wrong sign: it rises toward 0 as $r$ grows, so its flux points inward.",
                  "符号错了：它随 $r$ 增大而升向 0，通量指向内侧。",
                ],
                [
                  same(`\\frac{${q}}{4\\pi r^{2}}`),
                  "That is the size of the field $|u'|$, which falls like $\\frac{1}{r^{2}}$, not the potential.",
                  "那是按 $\\frac{1}{r^{2}}$ 衰减的场的大小 $|u'|$，不是势。",
                ],
              ];
          return chosen(
            rng,
            plane
              ? [`Which function solves $-\\Delta u = ${q}\\delta$ in the plane?`, `哪个函数在平面上满足 $-\\Delta u = ${q}\\delta$？`]
              : [`Which function solves $-\\Delta u = ${q}\\delta$ in space?`, `哪个函数在空间中满足 $-\\Delta u = ${q}\\delta$？`],
            same(plane ? a : b),
            slips,
            [
              [
                ["Pick the shape", "选形状"],
                plane
                  ? [
                      "In the plane the radial solutions away from the source are multiples of $\\ln r$.",
                      "在平面上，源外的径向解是 $\\ln r$ 的倍数。",
                    ]
                  : [
                      "In space the radial solutions that vanish far away are multiples of $\\frac{1}{r}$.",
                      "在空间中，远处趋于零的径向解是 $\\frac{1}{r}$ 的倍数。",
                    ],
              ],
              [
                ["Fix the constant", "定常数"],
                plane
                  ? [
                      `The outward flux through a circle of radius $r$ is $2\\pi r \\cdot (-u')$, which must be ${q}, so $u' = -\\frac{${q}}{2\\pi r}$ and $u = ${a}$.`,
                      `向外穿过半径为 $r$ 的圆的通量是 $2\\pi r \\cdot (-u')$，它必须等于 ${q}，所以 $u' = -\\frac{${q}}{2\\pi r}$，$u = ${a}$。`,
                    ]
                  : [
                      `The outward flux through a sphere of radius $r$ is $4\\pi r^{2} \\cdot (-u')$, which must be ${q}, so $u' = -\\frac{${q}}{4\\pi r^{2}}$ and $u = ${b}$.`,
                      `向外穿过半径为 $r$ 的球面的通量是 $4\\pi r^{2} \\cdot (-u')$，它必须等于 ${q}，所以 $u' = -\\frac{${q}}{4\\pi r^{2}}$，$u = ${b}$。`,
                    ],
              ],
            ],
            plane
              ? [
                  `Differentiating, $u' = -\\frac{${q}}{2\\pi r}$, and $2\\pi r \\cdot \\frac{${q}}{2\\pi r} = ${q}$, the strength of the source.`,
                  `求导得 $u' = -\\frac{${q}}{2\\pi r}$，而 $2\\pi r \\cdot \\frac{${q}}{2\\pi r} = ${q}$，正是源的强度。`,
                ]
              : [
                  `Differentiating, $u' = -\\frac{${q}}{4\\pi r^{2}}$, and $4\\pi r^{2} \\cdot \\frac{${q}}{4\\pi r^{2}} = ${q}$, the strength of the source.`,
                  `求导得 $u' = -\\frac{${q}}{4\\pi r^{2}}$，而 $4\\pi r^{2} \\cdot \\frac{${q}}{4\\pi r^{2}} = ${q}$，正是源的强度。`,
                ],
          );
        },
      ),
      figure: pdeDrawings1["fundamental-solutions-of-laplaces-equation#the-formula-in-each-dimension"],
    },
    point(
      "comparing-potentials-in-space",
      ["Comparing potentials in space", "比较空间中的势"],
      [
        "In space, the potential of a point source decays like $\\frac{1}{r}$. Going from distance $r_{1}$ to distance $r_{2}$ multiplies it by $\\frac{r_{1}}{r_{2}}$.\n\nA source with potential $12$ at distance $2$ has potential $12 \\cdot \\frac{2}{6} = 4$ at distance $6$.\n\nCheck: with $\\frac{1}{r}$ decay the product $ur$ stays the same, and $12 \\cdot 2 = 4 \\cdot 6 = 24$.\n\n> **Watch out.** The factor is $\\frac{r_{1}}{r_{2}}$, not $\\frac{r_{2}}{r_{1}}$: farther away the potential is smaller. It is not $\\frac{r_{1}^{2}}{r_{2}^{2}}$ either, which is how the field falls.",
        "在空间中，点源的势按 $\\frac{1}{r}$ 衰减。从距离 $r_{1}$ 到距离 $r_{2}$，势乘以 $\\frac{r_{1}}{r_{2}}$。\n\n在距离 $2$ 处势为 $12$ 的源，在距离 $6$ 处的势是 $12 \\cdot \\frac{2}{6} = 4$。\n\n检验：按 $\\frac{1}{r}$ 衰减时，乘积 $ur$ 不变，而 $12 \\cdot 2 = 4 \\cdot 6 = 24$。\n\n> **注意。** 因子是 $\\frac{r_{1}}{r_{2}}$，不是 $\\frac{r_{2}}{r_{1}}$：越远势越小。它也不是 $\\frac{r_{1}^{2}}{r_{2}^{2}}$，那是场衰减的方式。",
      ],
      (rng) =>
        until(() => {
          const r1 = rng.int(1, 9);
          const r2 = r1 + rng.int(1, 9);
          const u = 12 * r2 * rng.int(1, 3);
          const far = Q.of(u * r1, r2);
          return worked(
            [
              `A point source in space has potential ${u} at distance ${r1}. What is its potential at distance ${r2}?`,
              `空间中的点源在距离 ${r1} 处的势是 ${u}。它在距离 ${r2} 处的势是多少？`,
            ],
            far,
            [
              [
                Q.of(u * r1 * r1, r2 * r2),
                "That uses the square of the ratio, which is how the field falls; the potential falls like $\\frac{1}{r}$.",
                "那用了比值的平方，那是场衰减的方式；势按 $\\frac{1}{r}$ 衰减。",
              ],
              [
                Q.of(u * r2, r1),
                "That turns the ratio upside down, so the potential grows with distance.",
                "那把比值颠倒了，势反而随距离增大。",
              ],
              [
                Q.of(u, r2),
                `That divides by ${r2} alone; the factor is $\\frac{${r1}}{${r2}}$.`,
                `那只除以了 ${r2}；因子是 $\\frac{${r1}}{${r2}}$。`,
              ],
            ],
            [
              [
                ["Find the factor", "求因子"],
                [
                  `Going from distance ${r1} to ${r2} multiplies the potential by $\\frac{${r1}}{${r2}}$.`,
                  `从距离 ${r1} 到 ${r2}，势乘以 $\\frac{${r1}}{${r2}}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [`$${u} \\cdot \\frac{${r1}}{${r2}} = ${far.toLatex()}$.`, `$${u} \\cdot \\frac{${r1}}{${r2}} = ${far.toLatex()}$。`],
              ],
            ],
            [
              `The product $ur$ stays the same: $${u} \\cdot ${r1} = ${u * r1}$ and $${far.toLatex()} \\cdot ${r2} = ${u * r1}$.`,
              `乘积 $ur$ 不变：$${u} \\cdot ${r1} = ${u * r1}$，而 $${far.toLatex()} \\cdot ${r2} = ${u * r1}$。`,
            ],
          );
        }),
    ),
    point(
      "differences-of-potentials-in-the-plane",
      ["Differences of potentials in the plane", "平面上势的差"],
      [
        "In the plane, the potential of a source of strength $q$ is $-\\frac{q}{2\\pi}\\ln r$, which is unbounded at infinity. Only differences have a fixed meaning: $u(r_{1}) - u(r_{2}) = \\frac{q}{2\\pi}\\ln\\frac{r_{2}}{r_{1}}$.\n\nFor $q = 4$, going from $r = 2$ out to $r = 2e^{3}$ the potential falls by $\\frac{4}{2\\pi} \\cdot 3 = \\frac{6}{\\pi}$.\n\nCheck: $u(2) - u(2e^{3}) = -\\frac{4}{2\\pi}\\left(\\ln 2 - \\ln 2 - 3\\right) = \\frac{12}{2\\pi} = \\frac{6}{\\pi}$.\n\n> **Watch out.** Only the ratio $\\frac{r_{2}}{r_{1}}$ matters, and $\\ln e^{m} = m$; keep the $2$ in $\\frac{q}{2\\pi}$, which belongs to the plane.",
        "在平面上，强度为 $q$ 的源的势是 $-\\frac{q}{2\\pi}\\ln r$，它在无穷远处无界。只有差才有确定的意义：$u(r_{1}) - u(r_{2}) = \\frac{q}{2\\pi}\\ln\\frac{r_{2}}{r_{1}}$。\n\n对 $q = 4$，从 $r = 2$ 到 $r = 2e^{3}$，势下降 $\\frac{4}{2\\pi} \\cdot 3 = \\frac{6}{\\pi}$。\n\n检验：$u(2) - u(2e^{3}) = -\\frac{4}{2\\pi}\\left(\\ln 2 - \\ln 2 - 3\\right) = \\frac{12}{2\\pi} = \\frac{6}{\\pi}$。\n\n> **注意。** 只有比值 $\\frac{r_{2}}{r_{1}}$ 起作用，而 $\\ln e^{m} = m$；不要丢掉 $\\frac{q}{2\\pi}$ 中属于平面的 $2$。",
      ],
      (rng) =>
        until(() => {
          const q = rng.int(2, 12);
          const m = rng.int(1, 6);
          const r = rng.int(1, 5);
          const power = m === 1 ? "e" : `e^{${m}}`;
          const outer = `${r === 1 ? "" : r}${power}`;
          const s = Q.of(q * m, 2);
          return worked(
            [
              `A plane source of strength ${q} has potential $u$. If $u(${r}) - u(${outer})$ equals $\\frac{s}{\\pi}$, what is $s$?`,
              `强度为 ${q} 的平面源的势为 $u$。如果 $u(${r}) - u(${outer})$ 等于 $\\frac{s}{\\pi}$，那么 $s$ 是多少？`,
            ],
            s,
            [
              [Q.of(q * m, 1), "That leaves out the 2 in $\\frac{q}{2\\pi}$.", "那漏掉了 $\\frac{q}{2\\pi}$ 中的 2。"],
              [Q.of(q, 2), `That forgets the logarithm of the ratio, $\\ln ${power} = ${m}$.`, `那忘了比值的对数 $\\ln ${power} = ${m}$。`],
              [
                Q.of(q * m, 4),
                "That uses $4\\pi$, the constant of space; in the plane it is $2\\pi$.",
                "那用了空间中的常数 $4\\pi$；平面上是 $2\\pi$。",
              ],
              [
                Q.of(-q * m, 2),
                "That has the wrong sign: the potential falls going outward, so the nearer value is larger.",
                "符号错了：势向外下降，所以近处的值更大。",
              ],
            ],
            [
              [
                ["Find the ratio", "求比值"],
                [
                  `The distances are $${r}$ and $${outer}$, so $\\ln\\frac{r_{2}}{r_{1}} = \\ln ${power} = ${m}$.`,
                  `两个距离是 $${r}$ 和 $${outer}$，所以 $\\ln\\frac{r_{2}}{r_{1}} = \\ln ${power} = ${m}$。`,
                ],
              ],
              [
                ["Apply the formula", "代入公式"],
                [
                  `The difference is $\\frac{${q}}{2\\pi} \\cdot ${m} = \\frac{${q * m}}{2\\pi}$, which is $\\frac{s}{\\pi}$ with $s = ${s.toLatex()}$.`,
                  `差是 $\\frac{${q}}{2\\pi} \\cdot ${m} = \\frac{${q * m}}{2\\pi}$，即 $\\frac{s}{\\pi}$，其中 $s = ${s.toLatex()}$。`,
                ],
              ],
            ],
            [
              `Directly, $-\\frac{${q}}{2\\pi}\\left(\\ln ${r} - \\ln ${outer}\\right) = \\frac{${q}}{2\\pi}\\ln ${power} = \\frac{${q * m}}{2\\pi}$.`,
              `直接计算，$-\\frac{${q}}{2\\pi}\\left(\\ln ${r} - \\ln ${outer}\\right) = \\frac{${q}}{2\\pi}\\ln ${power} = \\frac{${q * m}}{2\\pi}$。`,
            ],
          );
        }),
    ),
  ],
);

const weakSolutions = topic(
  "weak-solutions-and-distributions",
  ["Weak Solutions and Distributions", "弱解与分布"],
  ["Give meaning to derivatives of functions that have corners and jumps.", "为带角点和跳跃的函数的导数赋予意义。"],
  ["nonlinear-transport-and-shocks", "poissons-equation"],
  [],
  [
    point(
      "the-delta-function",
      ["The delta function", "δ 函数"],
      [
        "The delta function $\\delta_{a}$ is defined by what it does to a smooth test function: $\\int \\delta_{a}\\varphi = \\varphi(a)$. It is not a function, but a rule that assigns a number to each test function.\n\nSo $\\int \\delta(x - 2)(x^{2} + 1) \\, dx = 2^{2} + 1 = 5$: the integral reads off the other factor at $x = 2$.\n\nCheck: $\\delta(x - 2)$ is $\\delta_{2}$, and $\\varphi(x) = x^{2} + 1$ has $\\varphi(2) = 4 + 1 = 5$.\n\n> **Watch out.** $\\delta(x + 3)$ sits at $x = -3$, where its argument is zero, not at $x = 3$.",
        "δ 函数 $\\delta_{a}$ 由它对光滑检验函数的作用定义：$\\int \\delta_{a}\\varphi = \\varphi(a)$。它不是函数，而是给每个检验函数指定一个数的规则。\n\n所以 $\\int \\delta(x - 2)(x^{2} + 1) \\, dx = 2^{2} + 1 = 5$：积分读出另一个因子在 $x = 2$ 处的值。\n\n检验：$\\delta(x - 2)$ 就是 $\\delta_{2}$，而 $\\varphi(x) = x^{2} + 1$ 满足 $\\varphi(2) = 4 + 1 = 5$。\n\n> **注意。** $\\delta(x + 3)$ 位于使其自变量为零的 $x = -3$，而不是 $x = 3$。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(-6, 6);
          const b = rng.int(1, 6);
          const c = rng.int(1, 9);
          const v = b * a * a + c;
          const shift = (name: string, by: number) => (by === 0 ? name : by > 0 ? `${name} - ${by}` : `${name} + ${-by}`);
          const square = b === 1 ? "x^{2}" : `${b}x^{2}`;
          const at = `${b === 1 ? "" : `${b} \\cdot `}${a < 0 ? `(${a})` : a}^{2} + ${c}`;
          return worked(
            [
              `What is $\\int_{-\\infty}^{\\infty} \\delta(${shift("x", a)})(${square} + ${c}) \\, dx$?`,
              `$\\int_{-\\infty}^{\\infty} \\delta(${shift("x", a)})(${square} + ${c}) \\, dx$ 是多少？`,
            ],
            v,
            [
              [
                c,
                "That evaluates the other factor at $x = 0$; this delta sits where its own argument is zero.",
                "那是在 $x = 0$ 处取值；这个 δ 位于它自己的自变量为零的地方。",
              ],
              [b * a + c, "That multiplies by the point instead of squaring it.", "那是乘以这个点，而不是把它平方。"],
              [b * a * a, "That leaves out the constant term of the other factor.", "那漏掉了另一个因子的常数项。"],
              [
                2 * b * a,
                "That is the derivative of the other factor at the point; the delta picks the value itself.",
                "那是另一个因子在该点的导数；δ 取的是值本身。",
              ],
            ],
            [
              [
                ["Find where the delta sits", "找出 δ 的位置"],
                [
                  `$\\delta(${shift("x", a)})$ is $\\delta_{${a}}$: its argument is zero at $x = ${a}$.`,
                  `$\\delta(${shift("x", a)})$ 就是 $\\delta_{${a}}$：它的自变量在 $x = ${a}$ 处为零。`,
                ],
              ],
              [
                ["Evaluate there", "在那里取值"],
                [`The integral is $${at} = ${v}$.`, `积分等于 $${at} = ${v}$。`],
              ],
            ],
            [
              `With $s = ${shift("x", a)}$ the integral becomes $\\int \\delta(s) \\, \\varphi(${shift("s", -a)}) \\, ds = \\varphi(${a}) = ${v}$.`,
              `令 $s = ${shift("x", a)}$，积分变为 $\\int \\delta(s) \\, \\varphi(${shift("s", -a)}) \\, ds = \\varphi(${a}) = ${v}$。`,
            ],
          );
        }),
    ),
    point(
      "derivatives-by-integrating-by-parts",
      ["Derivatives by integrating by parts", "分部积分定义导数"],
      [
        "A distribution's derivative moves the derivative onto the test function, with a sign: $\\langle T', \\varphi \\rangle = -\\langle T, \\varphi' \\rangle$. This is integration by parts, where the test function vanishes far away and leaves no boundary term. So $\\langle \\delta_{a}', \\varphi \\rangle = -\\varphi'(a)$.\n\nFor $\\varphi(x) = x^{2}$ near $3$, $\\varphi'(3) = 6$, so $\\langle \\delta_{3}', \\varphi \\rangle = -6$.\n\nCheck: the slope at $3$ is $\\frac{\\varphi(3 + h) - \\varphi(3)}{h} = \\frac{6h + h^{2}}{h} = 6 + h$, which tends to $6$ as $h \\to 0$, and the sign makes it $-6$.\n\n> **Watch out.** Keep the minus sign that moving the derivative brings, and evaluate $\\varphi'$, not $\\varphi$.",
        "分布的导数把求导转移到检验函数上，并带一个负号：$\\langle T', \\varphi \\rangle = -\\langle T, \\varphi' \\rangle$。这就是分部积分，检验函数在远处为零，所以没有边界项。因此 $\\langle \\delta_{a}', \\varphi \\rangle = -\\varphi'(a)$。\n\n对在 $3$ 附近等于 $x^{2}$ 的 $\\varphi$，$\\varphi'(3) = 6$，所以 $\\langle \\delta_{3}', \\varphi \\rangle = -6$。\n\n检验：$3$ 处的斜率是 $\\frac{\\varphi(3 + h) - \\varphi(3)}{h} = \\frac{6h + h^{2}}{h} = 6 + h$，当 $h \\to 0$ 时为 $6$，负号使它变成 $-6$。\n\n> **注意。** 转移导数带来的负号要保留，而且取的是 $\\varphi'$ 的值，不是 $\\varphi$ 的值。",
      ],
      (rng) =>
        until(() => {
          const a = rng.int(1, 6) * rng.pick([-1, 1]);
          const b = rng.int(1, 6);
          const d = rng.int(1, 9);
          const slope = 2 * b * a + d;
          const v = -slope;
          const phi = `${b === 1 ? "" : b}x^{2} + ${d === 1 ? "" : d}x`;
          const value = b * a * a + d * a;
          const neg = (n: number) => (n < 0 ? `(${n})` : `${n}`);
          return worked(
            [
              `What is $\\langle \\delta_{${a}}', \\varphi \\rangle$ for $\\varphi(x) = ${phi}$ near ${a}?`,
              `当 $\\varphi(x)$ 在 ${a} 附近等于 $${phi}$ 时，$\\langle \\delta_{${a}}', \\varphi \\rangle$ 是多少？`,
            ],
            v,
            [
              [
                slope,
                "That leaves out the minus sign that comes from moving the derivative onto $\\varphi$.",
                "那漏掉了把导数转移到 $\\varphi$ 上带来的负号。",
              ],
              [
                value,
                `That is $\\varphi(${a})$ itself; the derivative of the delta reads the slope.`,
                `那是 $\\varphi(${a})$ 本身；δ 的导数读取的是斜率。`,
              ],
              [
                -value,
                `That is $-\\varphi(${a})$; it is $\\varphi'$ that has to be evaluated.`,
                `那是 $-\\varphi(${a})$；要取值的是 $\\varphi'$。`,
              ],
              [
                -(b * a + d),
                `That differentiates $${b === 1 ? "" : b}x^{2}$ as $${b === 1 ? "" : b}x$; its derivative is $${2 * b}x$.`,
                `那把 $${b === 1 ? "" : b}x^{2}$ 的导数算成了 $${b === 1 ? "" : b}x$；它的导数是 $${2 * b}x$。`,
              ],
            ],
            [
              [
                ["Differentiate the test function", "对检验函数求导"],
                [
                  `$\\varphi'(x) = ${2 * b}x + ${d}$, so $\\varphi'(${a}) = ${2 * b} \\cdot ${neg(a)} + ${d} = ${slope}$.`,
                  `$\\varphi'(x) = ${2 * b}x + ${d}$，所以 $\\varphi'(${a}) = ${2 * b} \\cdot ${neg(a)} + ${d} = ${slope}$。`,
                ],
              ],
              [
                ["Move the derivative", "转移导数"],
                [
                  `$\\langle \\delta_{${a}}', \\varphi \\rangle = -\\varphi'(${a}) = ${v}$.`,
                  `$\\langle \\delta_{${a}}', \\varphi \\rangle = -\\varphi'(${a}) = ${v}$。`,
                ],
              ],
            ],
            [
              `$\\varphi(${a} + h) - \\varphi(${a}) = ${slope}h + ${b === 1 ? "" : b}h^{2}$, so the slope at ${a} is ${slope}, and the pairing is its negative, ${v}.`,
              `$\\varphi(${a} + h) - \\varphi(${a}) = ${slope}h + ${b === 1 ? "" : b}h^{2}$，所以 ${a} 处的斜率是 ${slope}，配对的值是它的相反数 ${v}。`,
            ],
          );
        }),
    ),
    point(
      "the-second-derivative-of-a-corner",
      ["The second derivative of a corner", "角点的二阶导数"],
      [
        "A function with a corner has a weak first derivative with a jump, and the derivative of a jump is a delta function. So at a corner $u''$ contains $(s_{+} - s_{-})\\delta$, where $s_{-}$ and $s_{+}$ are the slopes on the left and right.\n\nFor $u(x) = |x|$ the slopes are $-1$ on the left and $1$ on the right, so $u'' = (1 - (-1))\\delta = 2\\delta$.\n\nCheck: $u'$ is the step that jumps from $-1$ to $1$ at $0$, and the derivative of a jump of size $2$ is $2\\delta$.\n\n> **Watch out.** A linear term adds the same slope on both sides, so it does not change the jump and adds no delta.",
        "带角点的函数的弱一阶导数有跳跃，而跳跃的导数是 δ 函数。所以在角点处 $u''$ 含有 $(s_{+} - s_{-})\\delta$，其中 $s_{-}$ 和 $s_{+}$ 是左右两侧的斜率。\n\n对 $u(x) = |x|$，左侧斜率是 $-1$，右侧是 $1$，所以 $u'' = (1 - (-1))\\delta = 2\\delta$。\n\n检验：$u'$ 是在 $0$ 处从 $-1$ 跳到 $1$ 的阶跃，大小为 $2$ 的跳跃的导数是 $2\\delta$。\n\n> **注意。** 线性项给两侧加上相同的斜率，所以它不改变跳跃，也不产生 δ。",
      ],
      (rng) =>
        until(() => {
          const p = rng.int(1, 9);
          const q = rng.int(1, 9);
          const a = rng.int(1, 6);
          const left = q - p;
          const right = q + p;
          return worked(
            [
              `For $u(x) = ${p === 1 ? "" : p}|x - ${a}| + ${q === 1 ? "" : q}x$, the weak second derivative is $r\\delta_{${a}}$. What is $r$?`,
              `对 $u(x) = ${p === 1 ? "" : p}|x - ${a}| + ${q === 1 ? "" : q}x$，弱二阶导数是 $r\\delta_{${a}}$。$r$ 是多少？`,
            ],
            2 * p,
            [
              [
                p,
                `That is the slope that $${p === 1 ? "" : p}|x - ${a}|$ has on one side; the delta measures the jump between the two sides.`,
                `那是 $${p === 1 ? "" : p}|x - ${a}|$ 在一侧的斜率；δ 衡量的是两侧之间的跳跃。`,
              ],
              [right, "That is the slope on the right, not the jump in slope.", "那是右侧的斜率，而不是斜率的跳跃。"],
              [
                2 * q,
                "That doubles the coefficient of the linear term, which has no corner; the jump comes from the absolute value.",
                "那把没有角点的线性项的系数加倍了；跳跃来自绝对值。",
              ],
              [
                0,
                "A corner does leave a delta: only the straight pieces have zero second derivative.",
                "角点确实会留下 δ：只有直线段的二阶导数为零。",
              ],
            ],
            [
              [
                ["Read the slopes", "读出斜率"],
                [
                  `Left of ${a}, $u' = ${q} - ${p} = ${left}$; right of ${a}, $u' = ${q} + ${p} = ${right}$.`,
                  `在 ${a} 左侧，$u' = ${q} - ${p} = ${left}$；在 ${a} 右侧，$u' = ${q} + ${p} = ${right}$。`,
                ],
              ],
              [
                ["Take the jump", "求跳跃"],
                [
                  `The jump is $${right} - ${left < 0 ? `(${left})` : left} = ${2 * p}$, so $u'' = ${2 * p}\\delta_{${a}}$ and $r = ${2 * p}$.`,
                  `跳跃是 $${right} - ${left < 0 ? `(${left})` : left} = ${2 * p}$，所以 $u'' = ${2 * p}\\delta_{${a}}$，$r = ${2 * p}$。`,
                ],
              ],
            ],
            [
              `Only $|x - ${a}|$ has a corner, and its slope jumps from $-1$ to $1$, by 2; times ${p} that is ${2 * p}, while $${q === 1 ? "" : q}x$ adds nothing.`,
              `只有 $|x - ${a}|$ 有角点，它的斜率从 $-1$ 跳到 $1$，跳了 2；乘以 ${p} 得 ${2 * p}，而 $${q === 1 ? "" : q}x$ 不贡献任何东西。`,
            ],
          );
        }),
    ),
  ],
);

const finiteElements = topic(
  "the-finite-element-method",
  ["The Finite Element Method", "有限元方法"],
  ["Turn the weak form of a boundary value problem into a linear system.", "把边值问题的弱形式变成线性方程组。"],
  ["weak-solutions-and-distributions", "finite-differences-for-laplaces-equation"],
  [],
  [
    point(
      "the-stiffness-matrix",
      ["The stiffness matrix", "刚度矩阵"],
      [
        "For $-u'' = f$ with $u = 0$ at both ends, the weak form is $\\int u'v' = \\int fv$. Using hat functions on a mesh of spacing $h$, the matrix entries $\\int \\varphi_{i}'\\varphi_{j}'$ are $\\frac{2}{h}$ on the diagonal and $-\\frac{1}{h}$ next to it.\n\nWith $[0, 1]$ cut into $4$ elements, $h = \\frac{1}{4}$, so the diagonal entries are $\\frac{2}{h} = 8$ and their neighbours are $-\\frac{1}{h} = -4$.\n\nCheck: a hat has slope $4$ on one of its elements and $-4$ on the other, so $\\int (\\varphi_{i}')^{2} = 2 \\cdot 16 \\cdot \\frac{1}{4} = 8$.\n\n> **Watch out.** Divide by $h$, do not multiply: $\\frac{1}{h}$ is the number of elements, so the entries grow as the mesh gets finer.",
        "对两端 $u = 0$ 的 $-u'' = f$，弱形式是 $\\int u'v' = \\int fv$。在间距为 $h$ 的网格上用帽函数，矩阵元素 $\\int \\varphi_{i}'\\varphi_{j}'$ 在对角线上是 $\\frac{2}{h}$，在相邻位置是 $-\\frac{1}{h}$。\n\n把 $[0, 1]$ 分成 $4$ 个单元时 $h = \\frac{1}{4}$，所以对角元素是 $\\frac{2}{h} = 8$，相邻元素是 $-\\frac{1}{h} = -4$。\n\n检验：帽函数在一个单元上斜率是 $4$，在另一个上是 $-4$，所以 $\\int (\\varphi_{i}')^{2} = 2 \\cdot 16 \\cdot \\frac{1}{4} = 8$。\n\n> **注意。** 要除以 $h$，不是乘以 $h$：$\\frac{1}{h}$ 是单元的个数，所以网格越细，元素越大。",
      ],
      (rng) =>
        until(() => {
          const n = rng.int(3, 40);
          const diagonal = rng.bool();
          return worked(
            [
              diagonal
                ? `With hat functions on $[0, 1]$ cut into ${n} equal elements, what is a diagonal entry of the stiffness matrix?`
                : `With hat functions on $[0, 1]$ cut into ${n} equal elements, what is the entry of the stiffness matrix next to the diagonal?`,
              diagonal
                ? `把 $[0, 1]$ 分成 ${n} 个相等单元并使用帽函数，刚度矩阵的对角元素是多少？`
                : `把 $[0, 1]$ 分成 ${n} 个相等单元并使用帽函数，刚度矩阵中与对角线相邻的元素是多少？`,
            ],
            diagonal ? 2 * n : -n,
            diagonal
              ? [
                  [n, "That counts only one of the two elements under the hat.", "那只算了帽函数下两个单元中的一个。"],
                  [
                    -n,
                    "That is the entry next to the diagonal, where two neighbouring hats overlap.",
                    "那是对角线旁的元素，即两个相邻帽函数重叠处的值。",
                  ],
                  [Q.of(2, n), "That multiplies by $h$ instead of dividing by it.", "那是乘以 $h$，而不是除以 $h$。"],
                ]
              : [
                  [
                    n,
                    "That drops the sign: on the shared element one hat rises while the other falls.",
                    "那丢了负号：在共同的单元上，一个帽函数上升，另一个下降。",
                  ],
                  [2 * n, "That is the diagonal entry, a hat paired with itself.", "那是对角元素，即帽函数与自身配对。"],
                  [Q.of(-1, n), "That multiplies by $h$ instead of dividing by it.", "那是乘以 $h$，而不是除以 $h$。"],
                ],
            [
              [
                ["Find the spacing", "求间距"],
                [`$h = \\frac{1}{${n}}$, so a hat has slopes $\\pm ${n}$.`, `$h = \\frac{1}{${n}}$，所以帽函数的斜率是 $\\pm ${n}$。`],
              ],
              diagonal
                ? [
                    ["Integrate over the two elements", "在两个单元上积分"],
                    [
                      `$\\int (\\varphi_{i}')^{2} = 2 \\cdot ${n}^{2} \\cdot \\frac{1}{${n}} = ${2 * n}$.`,
                      `$\\int (\\varphi_{i}')^{2} = 2 \\cdot ${n}^{2} \\cdot \\frac{1}{${n}} = ${2 * n}$。`,
                    ],
                  ]
                : [
                    ["Integrate over the shared element", "在共同单元上积分"],
                    [
                      `Neighbouring hats overlap on one element, with slopes $-${n}$ and $${n}$, so $\\int \\varphi_{i}'\\varphi_{i+1}' = -${n}^{2} \\cdot \\frac{1}{${n}} = -${n}$.`,
                      `相邻帽函数在一个单元上重叠，斜率是 $-${n}$ 和 $${n}$，所以 $\\int \\varphi_{i}'\\varphi_{i+1}' = -${n}^{2} \\cdot \\frac{1}{${n}} = -${n}$。`,
                    ],
                  ],
            ],
            [
              `An interior row reads $-${n}, ${2 * n}, -${n}$, which adds up to 0, as it must: the hats add up to the constant 1, whose derivative is 0.`,
              `内部的一行是 $-${n}, ${2 * n}, -${n}$，加起来是 0，理应如此：帽函数加起来是常数 1，其导数为 0。`,
            ],
          );
        }),
    ),
    point(
      "the-load-vector",
      ["The load vector", "载荷向量"],
      [
        "The right side of the system has entries $\\int f\\varphi_{i}$. A hat function has area $h$, so a constant $f$ gives the entry $fh$.\n\nFor $f = 6$ on $[0, 1]$ cut into $3$ elements, $h = \\frac{1}{3}$ and each entry is $6 \\cdot \\frac{1}{3} = 2$.\n\nCheck: a hat of height $1$ on a base of width $2h = \\frac{2}{3}$ is a triangle of area $\\frac{1}{2} \\cdot \\frac{2}{3} = \\frac{1}{3}$, and $6 \\cdot \\frac{1}{3} = 2$.\n\n> **Watch out.** The base of a hat is $2h$, not $h$, but a triangle's area is half its base times its height, so the area is $h$.",
        "方程组右边的元素是 $\\int f\\varphi_{i}$。帽函数的面积是 $h$，所以常数 $f$ 给出的元素是 $fh$。\n\n对 $[0, 1]$ 上分成 $3$ 个单元的 $f = 6$，$h = \\frac{1}{3}$，每个元素是 $6 \\cdot \\frac{1}{3} = 2$。\n\n检验：高为 $1$、底宽为 $2h = \\frac{2}{3}$ 的帽函数是面积为 $\\frac{1}{2} \\cdot \\frac{2}{3} = \\frac{1}{3}$ 的三角形，而 $6 \\cdot \\frac{1}{3} = 2$。\n\n> **注意。** 帽函数的底是 $2h$，不是 $h$；但三角形面积是底乘高的一半，所以面积是 $h$。",
      ],
      (rng) =>
        until(() => {
          const f = rng.int(2, 30);
          const n = rng.int(3, 40);
          const entry = Q.of(f, n);
          return worked(
            [
              `For $f = ${f}$ on $[0, 1]$ cut into ${n} equal elements, what is an entry of the load vector?`,
              `对 $f = ${f}$，把 $[0, 1]$ 分成 ${n} 个相等单元，载荷向量的元素是多少？`,
            ],
            entry,
            [
              [
                Q.of(f, 2 * n),
                "That takes the base of the hat to be $h$; it spans two elements, $2h$.",
                "那把帽函数的底当成了 $h$；它跨两个单元，是 $2h$。",
              ],
              [Q.of(2 * f, n), "That forgets the half in the area of a triangle.", "那忘了三角形面积中的二分之一。"],
              [Q.of(f * n, 1), "That multiplies by the number of elements instead of by $h$.", "那乘以了单元个数，而不是乘以 $h$。"],
            ],
            [
              [
                ["Find the area of a hat", "求帽函数的面积"],
                [
                  `$h = \\frac{1}{${n}}$, and a hat of base $\\frac{2}{${n}}$ and height 1 has area $\\frac{1}{2} \\cdot \\frac{2}{${n}} = \\frac{1}{${n}}$.`,
                  `$h = \\frac{1}{${n}}$，底为 $\\frac{2}{${n}}$、高为 1 的帽函数面积是 $\\frac{1}{2} \\cdot \\frac{2}{${n}} = \\frac{1}{${n}}$。`,
                ],
              ],
              [
                ["Multiply by f", "乘以 f"],
                [
                  `$\\int ${f}\\varphi_{i} = ${f} \\cdot \\frac{1}{${n}} = ${entry.toLatex()}$.`,
                  `$\\int ${f}\\varphi_{i} = ${f} \\cdot \\frac{1}{${n}} = ${entry.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The ${n - 1} interior hats and the two half hats at the ends add up to the constant 1, so their loads add up to $\\int ${f} = ${f}$; each half hat carries half an entry, and $(${n - 1} + 1) \\cdot ${entry.toLatex()} = ${f}$.`,
              `${n - 1} 个内部帽函数和两端的两个半帽函数加起来是常数 1，所以它们的载荷加起来是 $\\int ${f} = ${f}$；每个半帽函数承担半个元素，而 $(${n - 1} + 1) \\cdot ${entry.toLatex()} = ${f}$。`,
            ],
          );
        }),
    ),
    point(
      "solving-with-one-unknown",
      ["Solving with one unknown", "只有一个未知数时求解"],
      [
        "With two elements on $[0, L]$ there is one interior node, and $h = \\frac{L}{2}$. The system is $\\frac{2}{h}U = fh$, so $U = \\frac{fh^{2}}{2}$. For constant $f$ this equals the exact solution at the midpoint.\n\nFor $-u'' = 8$ on $[0, 2]$, $h = 1$ and the system is $2U = 8$, so $U = 4$.\n\nCheck: the exact solution $u = 4x(2 - x)$ has $-u'' = 8$, vanishes at both ends, and equals $4$ at $x = 1$.\n\n> **Watch out.** Use $h = \\frac{L}{2}$, not $L$: with $h = L$ the answer comes out four times too big.",
        "在 $[0, L]$ 上用两个单元时只有一个内部节点，$h = \\frac{L}{2}$。方程组是 $\\frac{2}{h}U = fh$，所以 $U = \\frac{fh^{2}}{2}$。对常数 $f$，它等于中点处的精确解。\n\n对 $[0, 2]$ 上的 $-u'' = 8$，$h = 1$，方程组是 $2U = 8$，所以 $U = 4$。\n\n检验：精确解 $u = 4x(2 - x)$ 满足 $-u'' = 8$，在两端为零，在 $x = 1$ 处等于 $4$。\n\n> **注意。** 要用 $h = \\frac{L}{2}$，不是 $L$：用 $h = L$ 得到的答案会大四倍。",
      ],
      (rng) =>
        until(() => {
          const f = rng.int(1, 16);
          const L = rng.int(1, 6);
          const h = Q.of(L, 2);
          const U = Q.of(f * L * L, 8);
          return worked(
            [
              `Solve $-u'' = ${f}$ on $[0, ${L}]$ with $u = 0$ at both ends, using two equal elements. What is the value at the midpoint?`,
              `用两个相等单元求解 $[0, ${L}]$ 上两端 $u = 0$ 的 $-u'' = ${f}$。中点处的值是多少？`,
            ],
            U,
            [
              [
                Q.of(f * L * L, 2),
                "That takes $h = L$; with two elements $h = \\frac{L}{2}$.",
                "那取了 $h = L$；两个单元时 $h = \\frac{L}{2}$。",
              ],
              [
                Q.of(f * L * L, 4),
                "That is $fh^{2}$; dividing $fh$ by $\\frac{2}{h}$ also halves it.",
                "那是 $fh^{2}$；用 $fh$ 除以 $\\frac{2}{h}$ 还要再减半。",
              ],
              [
                Q.of(f * L, 4),
                "That is $\\frac{fh}{2}$; dividing by $\\frac{2}{h}$ multiplies by $h$ as well.",
                "那是 $\\frac{fh}{2}$；除以 $\\frac{2}{h}$ 还要再乘以 $h$。",
              ],
            ],
            [
              [
                ["Set up the equation", "列方程"],
                [
                  `$h = ${h.toLatex()}$, and the one equation is $\\frac{2}{h}U = ${f === 1 ? "" : f}h$.`,
                  `$h = ${h.toLatex()}$，唯一的方程是 $\\frac{2}{h}U = ${f === 1 ? "" : f}h$。`,
                ],
              ],
              [
                ["Solve it", "求解"],
                [
                  `$U = \\frac{fh^{2}}{2} = \\frac{${f} \\cdot ${h.mul(h).toLatex()}}{2} = ${U.toLatex()}$.`,
                  `$U = \\frac{fh^{2}}{2} = \\frac{${f} \\cdot ${h.mul(h).toLatex()}}{2} = ${U.toLatex()}$。`,
                ],
              ],
            ],
            [
              `The exact solution $u = \\frac{${f}}{2}x(${L} - x)$ vanishes at both ends, and at $x = ${h.toLatex()}$ it is $\\frac{${f}}{2} \\cdot ${h.toLatex()} \\cdot ${h.toLatex()} = ${U.toLatex()}$.`,
              `精确解 $u = \\frac{${f}}{2}x(${L} - x)$ 在两端为零，在 $x = ${h.toLatex()}$ 处等于 $\\frac{${f}}{2} \\cdot ${h.toLatex()} \\cdot ${h.toLatex()} = ${U.toLatex()}$。`,
            ],
          );
        }),
    ),
  ],
);

/** numberTheoryOutlineTopics holds the Number Theory topics added from the course outline. */
export const numberTheoryOutlineTopics: readonly TopicDef[] = [
  lesson(
    pAdicNumbers,
    [
      "In the $5$-adic absolute value, $|50|_{5} = \\frac{1}{25}$ because $50 = 5^{2} \\cdot 2$, while $\\left|\\frac{1}{5}\\right|_{5} = 5$: divisibility by $5$, not size, makes a number small.",
      "在 $5$ 进绝对值下，$|50|_{5} = \\frac{1}{25}$，因为 $50 = 5^{2} \\cdot 2$；而 $\\left|\\frac{1}{5}\\right|_{5} = 5$：让数变小的是被 $5$ 整除的程度，而不是数的大小。",
    ],
    [
      "$50 \\cdot \\frac{1}{5} = 10 = 5 \\cdot 2$ has $|10|_{5} = \\frac{1}{5}$, and $\\frac{1}{25} \\cdot 5 = \\frac{1}{5}$, so the absolute value of a product is the product of the absolute values.",
      "$50 \\cdot \\frac{1}{5} = 10 = 5 \\cdot 2$，$|10|_{5} = \\frac{1}{5}$，而 $\\frac{1}{25} \\cdot 5 = \\frac{1}{5}$，所以乘积的绝对值等于绝对值的乘积。",
    ],
    [
      "define $|x|_{p}$, use the strong triangle inequality, and sum geometric series that converge $p$-adically.",
      "定义 $|x|_{p}$，使用强三角不等式，并求 $p$ 进收敛的几何级数的和。",
    ],
  ),
  lesson(
    ellipticCurves,
    [
      "Modulo $5$, the curve $y^{2} = x^{3} + x + 1$ has the points $(0, 1), (0, 4), (2, 1), (2, 4), (3, 1), (3, 4), (4, 2), (4, 3)$ and the point at infinity, $9$ in all.",
      "模 $5$ 时，曲线 $y^{2} = x^{3} + x + 1$ 有点 $(0, 1), (0, 4), (2, 1), (2, 4), (3, 1), (3, 4), (4, 2), (4, 3)$ 和无穷远点，共 $9$ 个。",
    ],
    [
      "for $(4, 3)$, $3^{2} = 9$ and $4^{3} + 4 + 1 = 69$ are both $4$ modulo $5$; and $|9 - 6| = 3$ is within Hasse's bound $2\\sqrt{5} \\approx 4.47$.",
      "对 $(4, 3)$，$3^{2} = 9$ 与 $4^{3} + 4 + 1 = 69$ 模 $5$ 都是 $4$；而 $|9 - 6| = 3$ 在哈塞界 $2\\sqrt{5} \\approx 4.47$ 之内。",
    ],
    [
      "test points on a curve modulo a prime, count them, and bound the count with Hasse's theorem.",
      "检验模素数曲线上的点，数出点的个数，并用哈塞定理估计这个个数。",
    ],
  ),
  lesson(
    curveAddition,
    [
      "On $y^{2} = x^{3} + x + 1$ modulo $5$, add $P = (0, 1)$ and $Q = (2, 1)$: the slope is $0$, so $x_{3} = 0 - 0 - 2 = -2$, which is $3$, and $y_{3} = 0 \\cdot (0 - 3) - 1 = -1$, which is $4$, so $P + Q = (3, 4)$.",
      "在模 $5$ 的 $y^{2} = x^{3} + x + 1$ 上，把 $P = (0, 1)$ 与 $Q = (2, 1)$ 相加：斜率是 $0$，所以 $x_{3} = 0 - 0 - 2 = -2$，即 $3$；$y_{3} = 0 \\cdot (0 - 3) - 1 = -1$，即 $4$，所以 $P + Q = (3, 4)$。",
    ],
    [
      "$4^{2} = 16$ and $3^{3} + 3 + 1 = 31$ are both $1$ modulo $5$, so $(3, 4)$ is on the curve.",
      "$4^{2} = 16$ 与 $3^{3} + 3 + 1 = 31$ 模 $5$ 都是 $1$，所以 $(3, 4)$ 在曲线上。",
    ],
    [
      "find slopes with modular inverses, add two different points, and double a point with the tangent line.",
      "用模逆元求斜率，把两个不同的点相加，并用切线把一个点倍乘。",
    ],
  ),
];

/** realAnalysisOutlineTopics holds the Real Analysis topics added from the course outline. */
export const realAnalysisOutlineTopics: readonly TopicDef[] = [
  lesson(
    measurableFunctions,
    [
      "For $f(x) = x^{2}$ on $[0, 5]$, the set where $f(x) > 4$ is $(2, 5]$, of measure $3$. Measurable functions are exactly those whose sets of this kind all have a measure.",
      "对 $[0, 5]$ 上的 $f(x) = x^{2}$，$f(x) > 4$ 的集合是 $(2, 5]$，测度为 $3$。可测函数正是这类集合都有测度的函数。",
    ],
    [
      "the rest of the interval, $[0, 2]$, has measure $2$, and $3 + 2 = 5$, the length of $[0, 5]$.",
      "区间的其余部分 $[0, 2]$ 的测度是 $2$，而 $3 + 2 = 5$，正是 $[0, 5]$ 的长度。",
    ],
    [
      "add countably many measures, measure the set where a function is above a level, and do the same for step functions.",
      "把可数个测度相加，量出函数高于某水平的集合的测度，并对阶梯函数做同样的事。",
    ],
  ),
  lesson(
    convergenceTheorems,
    [
      "On $[0, 1]$ the functions $x^{n}$ tend to $0$ at every $x < 1$ and stay below $1$, so $\\int_{0}^{1} x^{n}\\, dx$ tends to $\\int_{0}^{1} 0\\, dx = 0$.",
      "在 $[0, 1]$ 上，函数 $x^{n}$ 在每个 $x < 1$ 处趋于 $0$，且始终不超过 $1$，所以 $\\int_{0}^{1} x^{n}\\, dx$ 趋于 $\\int_{0}^{1} 0\\, dx = 0$。",
    ],
    [
      "directly, $\\int_{0}^{1} x^{n}\\, dx = \\frac{1}{n + 1}$, which tends to $0$.",
      "直接计算，$\\int_{0}^{1} x^{n}\\, dx = \\frac{1}{n + 1}$，它趋于 $0$。",
    ],
    [
      "use monotone convergence for an unbounded function, use dominated convergence with a bound, and see what goes wrong when no bound exists.",
      "对无界函数使用单调收敛定理，借助一个上界使用控制收敛定理，并看到没有上界时会出什么问题。",
    ],
  ),
  lesson(
    stoneWeierstrass,
    [
      "On $[-1, 1]$ the even polynomials cannot approach $f(x) = x$: every even $g$ has $g(1) = g(-1)$, while $f$ takes the values $1$ and $-1$ there, so the distance is at least $1$.",
      "在 $[-1, 1]$ 上，偶多项式无法逼近 $f(x) = x$：每个偶函数 $g$ 都满足 $g(1) = g(-1)$，而 $f$ 在那两点取 $1$ 和 $-1$，所以距离至少是 $1$。",
    ],
    [
      "$g = 0$ is at distance exactly $1$, the largest value of $|x|$ on $[-1, 1]$.",
      "$g = 0$ 的距离恰好是 $1$，即 $|x|$ 在 $[-1, 1]$ 上的最大值。",
    ],
    [
      "check the hypotheses of the Stone-Weierstrass theorem, and measure how far a family falls short when it cannot separate points or vanishes at a point.",
      "检验斯通-魏尔斯特拉斯定理的条件，并在函数族不能分离点或在一点全为零时，量出它差多远。",
    ],
  ),
];

/** complexAnalysisOutlineTopics holds the Complex Analysis topics added from the course outline. */
export const complexAnalysisOutlineTopics: readonly TopicDef[] = [
  lesson(
    normalFamilies,
    [
      "The functions $z^{n}$ on the unit disc never escape the bound $1$, yet they do not converge on the whole disc: at points near the edge they stay close to size $1$ for a long time. Still, on every smaller disc they shrink to $0$.",
      "单位圆盘上的函数 $z^{n}$ 永远不超过界 $1$，但它们在整个圆盘上并不收敛：在靠近边界的点，它们很久都保持接近 $1$ 的大小。不过在每个较小的圆盘上，它们都缩小到 $0$。",
    ],
    [
      "On $|z| \\le \\frac{1}{2}$, $|z^{n}| \\le (\\frac{1}{2})^{n}$, which is below $\\frac{1}{1000}$ once $n \\ge 10$.",
      "在 $|z| \\le \\frac{1}{2}$ 上，$|z^{n}| \\le (\\frac{1}{2})^{n}$，当 $n \\ge 10$ 时它小于 $\\frac{1}{1000}$。",
    ],
    [
      "turn a uniform bound into a bound on derivatives with Cauchy's estimate, decide which families Montel's theorem covers, and compute the supremum that shows a subsequence converging on a compact set.",
      "用柯西估计把一致界变成导数的界，判断蒙特尔定理适用于哪些函数族，并计算上确界来说明子列在紧集上收敛。",
    ],
  ),
  lesson(
    mittagLeffler,
    [
      "Residues tell us how a function blows up at each pole. With finitely many poles, adding the principal parts rebuilds a rational function; with infinitely many, such as a pole at every integer, the plain sum diverges and needs correcting terms.",
      "留数告诉我们函数在每个极点处怎样趋于无穷。极点有限时，把主部加起来就重建了有理函数；极点无穷多时，比如每个整数处都有极点，直接求和会发散，需要修正项。",
    ],
    [
      "$\\frac{1}{z} + \\frac{1}{z - 1}$ at $z = 2$ is $\\frac{1}{2} + 1 = \\frac{3}{2}$, and over a common denominator $\\frac{2z - 1}{z(z - 1)}$ gives $\\frac{3}{2}$ too.",
      "$\\frac{1}{z} + \\frac{1}{z - 1}$ 在 $z = 2$ 处是 $\\frac{1}{2} + 1 = \\frac{3}{2}$，通分后 $\\frac{2z - 1}{z(z - 1)}$ 也给出 $\\frac{3}{2}$。",
    ],
    [
      "rebuild a rational function from its poles and residues, choose the correcting terms that make an infinite sum of principal parts converge, and sum series from the expansion of $\\frac{\\pi^{2}}{\\sin^{2} \\pi z}$.",
      "由极点和留数重建有理函数，选出使主部的无穷和收敛的修正项，并由 $\\frac{\\pi^{2}}{\\sin^{2} \\pi z}$ 的展开求级数的和。",
    ],
  ),
  lesson(
    schwarzChristoffel,
    [
      "The upper half plane has a straight boundary, and a polygon has corners. A map from one to the other must bend the real axis at a few chosen points by exactly the polygon's turning angles, and the Schwarz-Christoffel formula does this with one power factor per corner.",
      "上半平面的边界是直的，而多边形有角。从前者到后者的映射必须在实轴上几个选定的点处，恰好按多边形的转角把边界折弯；施瓦茨-克里斯托费尔公式用每个角一个幂因子做到这一点。",
    ],
    [
      "A square has four corners of angle $\\frac{\\pi}{2}$, so each exponent is $\\frac{1}{2} - 1 = -\\frac{1}{2}$, and the four add to $-2$.",
      "正方形有四个 $\\frac{\\pi}{2}$ 的角，所以每个指数是 $\\frac{1}{2} - 1 = -\\frac{1}{2}$，四个加起来是 $-2$。",
    ],
    [
      "find the exponent that each interior angle calls for, use the fact that the exponents add to $-2$, and write the exponents for a regular polygon.",
      "求出每个内角所需的指数，利用指数之和为 $-2$ 这一事实，并写出正多边形的指数。",
    ],
  ),
];

/** linearProgrammingOutlineTopics holds the Linear Programming topics added from the course outline. */
export const linearProgrammingOutlineTopics: readonly TopicDef[] = [
  lesson(
    ellipsoidMethod,
    [
      "Bisection is the ellipsoid method in one dimension: an interval of length 16 halved 4 times has length 1. In dimension 2, shrinking the volume by a factor of $e^{10}$ takes at most $2(2 + 1)(10) = 60$ steps.",
      "二分法就是一维的椭球法：长度为 16 的区间减半 4 次后长度为 1。在 2 维中，把体积缩小 $e^{10}$ 倍至多需要 $2(2 + 1)(10) = 60$ 步。",
    ],
    ["$\\frac{16}{2^{4}} = 1$, and $\\frac{60}{2(3)} = 10$.", "$\\frac{16}{2^{4}} = 1$，而 $\\frac{60}{2(3)} = 10$。"],
    [
      "count the halvings of an interval, find the constraint that cuts at the center, and bound the number of iterations.",
      "数区间减半的次数，找出在中心处给出割的约束，并估计迭代次数的上界。",
    ],
  ),
  lesson(
    interiorPoint,
    [
      "Minimizing $4x - 2 \\ln x$ over $x > 0$ gives $x = \\frac{2}{4} = \\frac{1}{2}$. On the central path with $\\mu = 2$, a variable $x_{1} = 4$ has the slack $s_{1} = \\frac{2}{4} = \\frac{1}{2}$, and with 10 variables the gap is $10(2) = 20$.",
      "在 $x > 0$ 上最小化 $4x - 2 \\ln x$ 得 $x = \\frac{2}{4} = \\frac{1}{2}$。在 $\\mu = 2$ 的中心路径上，变量 $x_{1} = 4$ 的松弛变量是 $s_{1} = \\frac{2}{4} = \\frac{1}{2}$，有 10 个变量时间隙是 $10(2) = 20$。",
    ],
    [
      "$4 - \\frac{2}{1/2} = 0$, and $4\\left(\\frac{1}{2}\\right) = 2 = \\mu$.",
      "$4 - \\frac{2}{1/2} = 0$，而 $4\\left(\\frac{1}{2}\\right) = 2 = \\mu$。",
    ],
    [
      "minimize a barrier function, find a slack on the central path, and follow the duality gap as $\\mu$ shrinks.",
      "最小化障碍函数，求中心路径上的松弛变量，并跟踪 $\\mu$ 缩小时的对偶间隙。",
    ],
  ),
];

/** partialDifferentialEquationsOutlineTopics holds the PDE topics added from the course outline. */
export const partialDifferentialEquationsOutlineTopics: readonly TopicDef[] = [
  lesson(
    transformsOnUnbounded,
    [
      "On a bounded interval, separation of variables gives a list of modes; on the whole line, the Fourier transform in $x$ gives a mode $e^{ikx}$ for every real $k$. For the wave equation $u_{tt} = 4u_{xx}$ the mode with $k = 3$ oscillates with angular frequency $6$, and for Laplace's equation above the line it fades like $e^{-3y}$.",
      "在有界区间上，分离变量给出一列模态；在整条直线上，对 $x$ 作傅里叶变换，每个实数 $k$ 都给出一个模态 $e^{ikx}$。对波动方程 $u_{tt} = 4u_{xx}$，$k = 3$ 的模态以角频率 $6$ 振荡；对直线上方的拉普拉斯方程，它按 $e^{-3y}$ 衰减。",
    ],
    [
      "$e^{i(3x - 6t)}$ has $u_{tt} = -36u$ and $u_{xx} = -9u$, and $-36 = 4 \\cdot (-9)$.",
      "$e^{i(3x - 6t)}$ 满足 $u_{tt} = -36u$ 和 $u_{xx} = -9u$，而 $-36 = 4 \\cdot (-9)$。",
    ],
    [
      "find the period of each frequency in a wave, the decay of each frequency above a boundary, and values of the Poisson integral of a half-plane.",
      "求波中每个频率的周期、边界上方每个频率的衰减，以及半平面泊松积分的值。",
    ],
  ),
  lesson(
    fundamentalSolutions,
    [
      "A point charge $q$ in space has potential $\\frac{q}{4\\pi r}$: at distance $2$ from a charge $8\\pi$ it is $\\frac{8\\pi}{8\\pi} = 1$. In the plane the potential of a point source is a logarithm instead, and only its differences have a fixed value.",
      "空间中的点电荷 $q$ 的势是 $\\frac{q}{4\\pi r}$：在距电荷 $8\\pi$ 为 $2$ 的地方，势是 $\\frac{8\\pi}{8\\pi} = 1$。在平面上，点源的势则是对数，只有它的差才有确定的值。",
    ],
    [
      "The field there has size $\\frac{8\\pi}{4\\pi \\cdot 2^{2}} = \\frac{1}{2}$, and times the area $4\\pi \\cdot 2^{2} = 16\\pi$ of the sphere it gives the flux $8\\pi$, the charge.",
      "那里场的大小是 $\\frac{8\\pi}{4\\pi \\cdot 2^{2}} = \\frac{1}{2}$，乘以球面面积 $4\\pi \\cdot 2^{2} = 16\\pi$ 得通量 $8\\pi$，正是电荷。",
    ],
    [
      "choose the fundamental solution in each dimension, compare potentials at two distances in space, and find differences of potentials in the plane.",
      "选出各维度的基本解，比较空间中两个距离处的势，并求平面上势的差。",
    ],
  ),
  lesson(
    weakSolutions,
    [
      "The tent $u(x) = 1 - |x|$ has no derivative at its peak, yet $-u'' = 2\\delta$ describes it exactly: its slope drops from $1$ to $-1$ there. Weak derivatives make this precise by moving every derivative onto a smooth test function.",
      "帐篷函数 $u(x) = 1 - |x|$ 在峰顶处没有导数，但 $-u'' = 2\\delta$ 恰好描述了它：它的斜率在那里从 $1$ 降到 $-1$。弱导数把每个导数都转移到光滑的检验函数上，使这一点变得严格。",
    ],
    [
      "Left of $0$ the slope is $1$ and right of it $-1$, a jump of $-2$, which is the $-2\\delta$ in $u''$.",
      "在 $0$ 左侧斜率是 $1$，右侧是 $-1$，跳跃为 $-2$，这正是 $u''$ 中的 $-2\\delta$。",
    ],
    [
      "evaluate the delta function on a test function, differentiate distributions by moving the derivative, and find the delta in the second derivative of a corner.",
      "计算 δ 函数作用在检验函数上的值，通过转移导数求分布的导数，并求出角点二阶导数中的 δ。",
    ],
  ),
  lesson(
    finiteElements,
    [
      "To solve $-u'' = 8$ on $[0, 2]$ with $u = 0$ at the ends, try $u = U\\varphi$, where $\\varphi$ is the hat that rises from $0$ to $1$ at $x = 1$ and falls back to $0$. Asking the weak form to hold for this one test function gives $2U = 8$, so $U = 4$.",
      "要求解 $[0, 2]$ 上两端 $u = 0$ 的 $-u'' = 8$，试取 $u = U\\varphi$，其中 $\\varphi$ 是在 $x = 1$ 处从 $0$ 升到 $1$ 再降回 $0$ 的帽函数。要求弱形式对这一个检验函数成立，得 $2U = 8$，所以 $U = 4$。",
    ],
    ["The exact solution $4x(2 - x)$ is also $4$ at $x = 1$.", "精确解 $4x(2 - x)$ 在 $x = 1$ 处也等于 $4$。"],
    [
      "find entries of the stiffness matrix and of the load vector, and the value at the node when there is one unknown.",
      "求刚度矩阵和载荷向量的元素，以及只有一个未知数时节点处的值。",
    ],
  ),
];
