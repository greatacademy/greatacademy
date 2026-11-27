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

import { ask, choose, type Pair, point, powMod, primesUpTo, same, topic } from "../university-kit.ts";
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
        "Lebesgue measure is countably additive: the measure of a countable union of disjoint measurable sets is the sum of their measures. Countable sets have measure $0$, so adding one changes nothing.",
        "勒贝格测度具有可数可加性：互不相交的可数个可测集的并的测度等于它们测度的和。可数集的测度为 $0$，所以加入它不改变结果。",
      ],
      (rng) => {
        const r = rng.pick([2, 3, 5]);
        const a = (r - 1) * rng.int(1, 12);
        const total = (a * r) / (r - 1);
        return ask(
          [
            `Disjoint intervals have lengths $${a}, \\frac{${a}}{${r}}, \\frac{${a}}{${r * r}}, \\dots$ Their union is joined with the set of all rationals outside them. What is the measure of the result?`,
            `互不相交的区间长度为 $${a}, \\frac{${a}}{${r}}, \\frac{${a}}{${r * r}}, \\dots$ 把它们的并与区间外的全体有理数合并。结果的测度是多少？`,
          ],
          total,
          [a, total + 1, a * r],
          [
            `The lengths form a geometric series with sum ${total}, and the rationals add measure 0.`,
            `这些长度构成和为 ${total} 的几何级数，有理数增加的测度为 0。`,
          ],
        );
      },
    ),
    point(
      "the-measure-of-a-level-set",
      ["The measure of a level set", "水平集的测度"],
      [
        "A function $f$ is measurable when every set $\\{x : f(x) > t\\}$ is measurable. The measures of these sets, taken for all $t$, are what the Lebesgue integral adds up.",
        "如果每个集合 $\\{x : f(x) > t\\}$ 都可测，函数 $f$ 就是可测的。对所有 $t$ 取这些集合的测度，勒贝格积分加起来的正是它们。",
      ],
      (rng) => {
        const s = rng.int(1, 8);
        const b = s + rng.int(1, 9);
        return ask(
          [
            `For $f(x) = x^{2}$ on $[0, ${b}]$, what is the measure of $\\{x : f(x) > ${s * s}\\}$?`,
            `对 $[0, ${b}]$ 上的 $f(x) = x^{2}$，$\\{x : f(x) > ${s * s}\\}$ 的测度是多少？`,
          ],
          b - s,
          [s, b, b * b - s * s],
          [`The set is $(${s}, ${b}]$, which has length ${b - s}.`, `这个集合是 $(${s}, ${b}]$，长度为 ${b - s}。`],
        );
      },
    ),
    point(
      "a-step-function-above-a-level",
      ["A step function above a level", "阶梯函数高于某水平的部分"],
      [
        "For a step function, $\\{x : f(x) > t\\}$ is the union of the pieces whose value exceeds $t$. Its measure is the total length of those pieces, whichever order they come in.",
        "对阶梯函数，$\\{x : f(x) > t\\}$ 是取值超过 $t$ 的那些段的并。它的测度是这些段的总长度，与顺序无关。",
      ],
      (rng) => {
        const t = rng.int(1, 9);
        const low = t - rng.int(0, 2);
        const high = t + rng.int(1, 5);
        const higher = high + rng.int(1, 5);
        const [l1, l2, l3] = [rng.int(1, 7), rng.int(1, 7), rng.int(1, 7)];
        return ask(
          [
            `A step function equals ${high} on a set of measure ${l1}, ${low} on a disjoint set of measure ${l2}, and ${higher} on a third disjoint set of measure ${l3}. What is the measure of the set where $f > ${t}$?`,
            `阶梯函数在测度为 ${l1} 的集合上等于 ${high}，在与之不交、测度为 ${l2} 的集合上等于 ${low}，在第三个不交、测度为 ${l3} 的集合上等于 ${higher}。$f > ${t}$ 的集合的测度是多少？`,
          ],
          l1 + l3,
          [l1 + l2 + l3, l2, l1 + l2],
          [
            `Only the values ${high} and ${higher} exceed ${t}, so the measure is $${l1} + ${l3}$.`,
            `只有值 ${high} 和 ${higher} 超过 ${t}，所以测度是 $${l1} + ${l3}$。`,
          ],
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
        "If $0 \\le f_{1} \\le f_{2} \\le \\dots$ are measurable and tend to $f$, then $\\int f_{n} \\to \\int f$, even when $f$ is unbounded. Truncating an unbounded function at height $n$ gives such a sequence.",
        "如果可测函数满足 $0 \\le f_{1} \\le f_{2} \\le \\dots$ 且趋于 $f$，那么 $\\int f_{n} \\to \\int f$，即使 $f$ 无界也成立。把无界函数在高度 $n$ 处截断就得到这样的序列。",
      ],
      (rng) => {
        const q = rng.pick([2, 3, 4, 5]);
        const p = rng.int(1, q - 1);
        const c = rng.int(1, 9);
        const f = `${c === 1 ? "" : c}x^{-${Q.of(p, q).toLatex()}}`;
        return ask(
          [
            `Let $f_{n}(x) = \\min(n, ${f})$ on $(0, 1]$. What is the limit of $\\int_{0}^{1} f_{n}$?`,
            `设 $(0, 1]$ 上 $f_{n}(x) = \\min(n, ${f})$。$\\int_{0}^{1} f_{n}$ 的极限是多少？`,
          ],
          Q.of(c * q, q - p),
          [Q.of(c * p, q), Q.of(c, 1), Q.of(c * q, p)],
          [
            `The $f_{n}$ increase to $${f}$, so the limit is its integral, $${c} \\cdot \\frac{1}{1 - ${Q.of(p, q).toLatex()}}$.`,
            `$f_{n}$ 递增趋于 $${f}$，所以极限就是它的积分 $${c} \\cdot \\frac{1}{1 - ${Q.of(p, q).toLatex()}}$。`,
          ],
        );
      },
    ),
    point(
      "dominated-convergence",
      ["Dominated convergence", "控制收敛"],
      [
        "If $f_{n} \\to f$ almost everywhere and $|f_{n}| \\le g$ for one integrable $g$, then $\\int f_{n} \\to \\int f$. The convergence need not be uniform, and points where it fails may form a set of measure zero.",
        "如果 $f_{n} \\to f$ 几乎处处成立，且对一个可积函数 $g$ 有 $|f_{n}| \\le g$，那么 $\\int f_{n} \\to \\int f$。收敛不必一致，不收敛的点可以构成零测集。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const d = rng.int(1, 9);
        const b = rng.int(2, 9);
        return rng.bool()
          ? ask(
              [
                `What is $\\lim_{n \\to \\infty} \\int_{0}^{1} (${c}x^{n} + ${d}) \\, dx$?`,
                `$\\lim_{n \\to \\infty} \\int_{0}^{1} (${c}x^{n} + ${d}) \\, dx$ 是多少？`,
              ],
              d,
              [c + d, c, 0],
              [
                `The integrand tends to ${d} except at $x = 1$ and is bounded by ${c + d}, so the limit is ${d}.`,
                `被积函数除 $x = 1$ 外都趋于 ${d}，并且以 ${c + d} 为界，所以极限是 ${d}。`,
              ],
            )
          : ask(
              [
                `What is $\\lim_{n \\to \\infty} \\int_{0}^{${b}} ${c}e^{-x/n} \\, dx$?`,
                `$\\lim_{n \\to \\infty} \\int_{0}^{${b}} ${c}e^{-x/n} \\, dx$ 是多少？`,
              ],
              b * c,
              [0, c, b],
              [
                `The integrand tends to ${c} and is bounded by ${c}, so the limit is $${c} \\cdot ${b}$.`,
                `被积函数趋于 ${c} 且以 ${c} 为界，所以极限是 $${c} \\cdot ${b}$。`,
              ],
            );
      },
    ),
    point(
      "when-domination-fails",
      ["When domination fails", "控制条件不成立时"],
      [
        "A taller and thinner spike keeps its area while it tends to $0$ at every point. No integrable function lies above all these spikes, so the theorem does not apply and the integral of the limit differs from the limit of the integrals.",
        "越来越高、越来越窄的尖峰保持面积不变，同时在每一点趋于 $0$。没有可积函数能位于所有这些尖峰之上，所以定理不适用，极限的积分不等于积分的极限。",
      ],
      (rng) => {
        const c = rng.int(2, 15);
        const b = rng.int(2, 9);
        return ask(
          [
            `Let $f_{n} = ${c}n$ on $(0, \\frac{1}{n})$ and $0$ elsewhere on $[0, ${b}]$. What is $\\lim \\int f_{n} - \\int \\lim f_{n}$?`,
            `在 $[0, ${b}]$ 上，设 $f_{n}$ 在 $(0, \\frac{1}{n})$ 上等于 $${c}n$，其余处为 $0$。$\\lim \\int f_{n} - \\int \\lim f_{n}$ 是多少？`,
          ],
          c,
          [0, b * c, 1],
          [
            `Each $\\int f_{n}$ equals ${c}, while $f_{n} \\to 0$ at every point, so the difference is ${c}.`,
            `每个 $\\int f_{n}$ 都等于 ${c}，而 $f_{n}$ 在每一点都趋于 0，所以差是 ${c}。`,
          ],
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
        "An algebra of real continuous functions on a compact set is dense in all continuous functions if it separates points and vanishes at no point. Being an algebra means closure under addition, multiplication and scalars.",
        "紧集上的实连续函数代数，如果能分离点且不在任何一点同时为零，就在全体连续函数中稠密。代数是指对加法、乘法和数乘封闭。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const b = a + rng.int(1, 8);
        const d = rng.int(2, 7);
        return choose(
          rng,
          [`Which family is dense in the continuous functions on the stated interval?`, `哪一族函数在所给区间上的连续函数中稠密？`],
          [`Polynomials in $x^{2}$ on $[${a}, ${b}]$`, `$[${a}, ${b}]$ 上关于 $x^{2}$ 的多项式`],
          [
            [`Polynomials in $x^{2}$ on $[${-b}, ${b}]$`, `$[${-b}, ${b}]$ 上关于 $x^{2}$ 的多项式`],
            [`Polynomials $p$ with $p(${a}) = 0$ on $[${a}, ${b}]$`, `$[${a}, ${b}]$ 上满足 $p(${a}) = 0$ 的多项式`],
            [`Polynomials of degree at most ${d} on $[${a}, ${b}]$`, `$[${a}, ${b}]$ 上次数不超过 ${d} 的多项式`],
          ],
          [
            `On a positive interval $x^{2}$ separates points and the constants are included. The others fail to separate $\\pm x$, vanish at ${a}, or are not closed under multiplication.`,
            `在正区间上，$x^{2}$ 能分离点，而且包含常数。其余几族分别不能分离 $\\pm x$、在 ${a} 处全为零或对乘法不封闭。`,
          ],
        );
      },
    ),
    point(
      "a-family-that-cannot-separate",
      ["A family that cannot separate", "不能分离点的函数族"],
      [
        "An even function takes the same value at $x$ and $-x$, so even functions cannot separate them. If $f$ differs at those two points, the distance from $f$ to any even function is at least half the difference.",
        "偶函数在 $x$ 和 $-x$ 取相同的值，所以偶函数分离不了它们。如果 $f$ 在这两点的值不同，$f$ 到任何偶函数的距离至少是差的一半。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const c = rng.int(2, 9);
        return ask(
          [
            `On $[${-a}, ${a}]$, what is the smallest possible value of $\\sup |${c}x - g(x)|$ over all even continuous functions $g$?`,
            `在 $[${-a}, ${a}]$ 上，对所有连续偶函数 $g$，$\\sup |${c}x - g(x)|$ 的最小可能值是多少？`,
          ],
          a * c,
          [0, 2 * a * c, c],
          [
            `The values at $\\pm ${a}$ differ by $${2 * a * c}$, so half of that is a lower bound, and $g = 0$ reaches it.`,
            `在 $\\pm ${a}$ 处的值相差 $${2 * a * c}$，所以它的一半是下界，而 $g = 0$ 能达到。`,
          ],
        );
      },
    ),
    point(
      "a-family-that-vanishes-at-a-point",
      ["A family that vanishes at a point", "在一点全为零的函数族"],
      [
        "If every function in the family vanishes at $x_{0}$, then any uniform limit also vanishes there. So the distance from $f$ to the family is at least $|f(x_{0})|$, and in fact it equals that.",
        "如果函数族中每个函数都在 $x_{0}$ 处为零，那么任何一致极限在那里也为零。所以 $f$ 到这一族的距离至少是 $|f(x_{0})|$，实际上正好等于它。",
      ],
      (rng) => {
        const x0 = rng.int(1, 6);
        const c = rng.int(1, 12);
        const b = x0 + rng.int(1, 5);
        return ask(
          [
            `On $[0, ${b}]$, what is the distance in the supremum norm from $f(x) = x^{2} + ${c}$ to the polynomials that vanish at ${x0}?`,
            `在 $[0, ${b}]$ 上，$f(x) = x^{2} + ${c}$ 到在 ${x0} 处为零的多项式的上确界范数距离是多少？`,
          ],
          x0 * x0 + c,
          [0, c, x0],
          [
            `The distance is $|f(${x0})| = ${x0}^{2} + ${c}$, which is ${x0 * x0 + c}.`,
            `距离是 $|f(${x0})| = ${x0}^{2} + ${c}$，即 ${x0 * x0 + c}。`,
          ],
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
        "Cauchy's estimate bounds a derivative by a bound on the function: if $|f| \\le M$ on $|z| < R$, then $|f'(z_{0})| \\le \\frac{M}{R - |z_{0}|}$. A uniform bound on $f$ therefore makes the family equicontinuous on smaller discs.",
        "柯西估计用函数的界来界定导数：如果在 $|z| < R$ 上 $|f| \\le M$，那么 $|f'(z_{0})| \\le \\frac{M}{R - |z_{0}|}$。所以 $f$ 的一致界使函数族在较小的圆盘上等度连续。",
      ],
      (rng) => {
        const m = rng.int(2, 30);
        const r0 = rng.int(1, 6);
        const R = r0 + rng.int(1, 6);
        return ask(
          [
            `Every $f$ in a family satisfies $|f| \\le ${m}$ on $|z| < ${R}$. What bound does Cauchy's estimate give for $|f'(z_{0})|$ when $|z_{0}| = ${r0}$?`,
            `函数族中每个 $f$ 在 $|z| < ${R}$ 上满足 $|f| \\le ${m}$。当 $|z_{0}| = ${r0}$ 时，柯西估计给出 $|f'(z_{0})|$ 的什么界？`,
          ],
          Q.of(m, R - r0),
          [Q.of(m, R), Q.of(m, r0), Q.of(m, R + r0)],
          [
            `The largest disc about $z_{0}$ inside has radius $${R} - ${r0}$, so the bound is $\\frac{${m}}{${R - r0}}$.`,
            `以 $z_{0}$ 为心、在区域内的最大圆盘半径是 $${R} - ${r0}$，所以界是 $\\frac{${m}}{${R - r0}}$。`,
          ],
        );
      },
    ),
    point(
      "which-family-montel-covers",
      ["Which family Montel covers", "蒙特尔定理适用的函数族"],
      [
        "Montel's theorem says that a family of analytic functions bounded uniformly on each compact subset is normal: every sequence in it has a subsequence converging uniformly on compact subsets.",
        "蒙特尔定理说，在每个紧子集上一致有界的解析函数族是正规族：其中每个序列都有在紧子集上一致收敛的子列。",
      ],
      (rng) => {
        const c = rng.int(2, 60);
        return choose(
          rng,
          [`To which family on the unit disc does Montel's theorem apply?`, `蒙特尔定理适用于单位圆盘上的哪一族函数？`],
          same(`\\{${c}z^{n} : n \\ge 1\\}`),
          [same(`\\{${c}nz : n \\ge 1\\}`), same(`\\{${c}n + z : n \\ge 1\\}`), same(`\\{e^{${c}nz} : n \\ge 1\\}`)],
          [
            `On the unit disc $|${c}z^{n}| \\le ${c}$. The others grow without bound on compact subsets.`,
            `在单位圆盘上 $|${c}z^{n}| \\le ${c}$。其余几族在紧子集上无界增长。`,
          ],
        );
      },
    ),
    point(
      "a-subsequence-limit",
      ["A subsequence limit", "子列的极限"],
      [
        "On a smaller closed disc $|z| \\le r$ with $r < 1$, the supremum of $|z^{n}|$ is $r^{n}$, which tends to $0$. So $z^{n}$ tends to $0$ uniformly on compact subsets of the unit disc, though not on the whole disc.",
        "在较小的闭圆盘 $|z| \\le r$（$r < 1$）上，$|z^{n}|$ 的上确界是 $r^{n}$，它趋于 $0$。所以 $z^{n}$ 在单位圆盘的紧子集上一致趋于 $0$，但在整个圆盘上并非如此。",
      ],
      (rng) => {
        const c = rng.int(2, 9);
        const q = rng.int(2, 5);
        const n = rng.int(2, 4);
        return ask(
          [
            `What is the supremum of $|${c}z^{${n}}|$ on $|z| \\le \\frac{1}{${q}}$?`,
            `$|${c}z^{${n}}|$ 在 $|z| \\le \\frac{1}{${q}}$ 上的上确界是多少？`,
          ],
          Q.of(c, q ** n),
          [Q.of(c, q), Q.of(1, q ** n), Q.of(c * n, q)],
          [
            `The maximum is on the boundary, so it is $${c} \\cdot (\\frac{1}{${q}})^{${n}}$.`,
            `最大值在边界上取到，所以是 $${c} \\cdot (\\frac{1}{${q}})^{${n}}$。`,
          ],
        );
      },
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
        "A rational function that vanishes at infinity is determined by its principal parts: if its only poles are simple, then it is the sum of $\\frac{r_{k}}{z - a_{k}}$ over its poles $a_{k}$ with residues $r_{k}$.",
        "在无穷远处为零的有理函数由它的主部决定：如果它只有单极点，它就等于各极点 $a_{k}$ 处 $\\frac{r_{k}}{z - a_{k}}$ 的和，其中 $r_{k}$ 是留数。",
      ],
      (rng) => {
        const a = rng.int(-6, 2);
        const b = a + rng.int(1, 6);
        const w = b + rng.int(1, 6);
        const r = rng.int(1, 9);
        const s = rng.int(1, 9);
        const value = Q.of(r, w - a).add(Q.of(s, w - b));
        return ask(
          [
            `A rational function vanishes at infinity, and its only poles are simple, at $z = ${a}$ with residue ${r} and at $z = ${b}$ with residue ${s}. What is its value at $z = ${w}$?`,
            `一个有理函数在无穷远处为零，它只有单极点：$z = ${a}$ 处留数为 ${r}，$z = ${b}$ 处留数为 ${s}。它在 $z = ${w}$ 处的值是多少？`,
          ],
          value,
          [Q.of(r, w - a), Q.of(s, w - b), Q.of(r + s, 2 * w - a - b)],
          [
            `It equals $\\frac{${r}}{z - ${a < 0 ? `(${a})` : a}} + \\frac{${s}}{z - ${b < 0 ? `(${b})` : b}}$, and substituting gives the value.`,
            `它等于 $\\frac{${r}}{z - ${a < 0 ? `(${a})` : a}} + \\frac{${s}}{z - ${b < 0 ? `(${b})` : b}}$，代入即得。`,
          ],
        );
      },
    ),
    point(
      "terms-that-make-it-converge",
      ["Terms that make it converge", "使级数收敛的项"],
      [
        "With infinitely many poles the sum of principal parts may diverge. Mittag-Leffler's theorem subtracts a polynomial from each term to force convergence. For poles at the integers, adding $\\frac{1}{n}$ to $\\frac{1}{z - n}$ leaves a term of size about $\\frac{1}{n^{2}}$.",
        "有无穷多个极点时，主部的和可能发散。米塔格-莱夫勒定理从每一项减去一个多项式来保证收敛。极点在整数处时，给 $\\frac{1}{z - n}$ 加上 $\\frac{1}{n}$，剩下的项大小约为 $\\frac{1}{n^{2}}$。",
      ],
      (rng) => {
        const a = rng.int(2, 60);
        return choose(
          rng,
          [
            `Which series converges to a function with simple poles at the nonzero multiples of ${a}?`,
            `哪个级数收敛到在 ${a} 的非零倍数处有单极点的函数？`,
          ],
          same(`\\sum_{n \\ne 0} \\left(\\frac{1}{z - ${a}n} + \\frac{1}{${a}n}\\right)`),
          [
            same(`\\sum_{n \\ne 0} \\left(\\frac{1}{z - ${a}n} - \\frac{1}{${a}n}\\right)`),
            same(`\\sum_{n \\ge 1} \\left(\\frac{1}{z - ${a}n} + \\frac{1}{z}\\right)`),
            same(`\\sum_{n \\ge 1} \\frac{1}{z - ${a}n}`),
          ],
          [
            `Combining gives $\\frac{z}{${a}n(z - ${a}n)}$, which is of size $\\frac{1}{n^{2}}$, and the series converges.`,
            `合并得 $\\frac{z}{${a}n(z - ${a}n)}$，大小为 $\\frac{1}{n^{2}}$，所以级数收敛。`,
          ],
        );
      },
    ),
    point(
      "the-expansion-of-a-trigonometric-function",
      ["The expansion of a trigonometric function", "三角函数的展开"],
      [
        "Comparing principal parts shows that $\\frac{\\pi^{2}}{\\sin^{2} \\pi z} = \\sum_{n \\in \\mathbb{Z}} \\frac{1}{(z - n)^{2}}$. Evaluating at a rational point turns this into the value of a series.",
        "比较主部可知 $\\frac{\\pi^{2}}{\\sin^{2} \\pi z} = \\sum_{n \\in \\mathbb{Z}} \\frac{1}{(z - n)^{2}}$。在有理点取值，就得到一个级数的值。",
      ],
      (rng) => {
        const [den, k] = rng.pick([
          [2, Q.of(1, 1)],
          [3, Q.of(4, 3)],
          [4, Q.of(2, 1)],
          [6, Q.of(4, 1)],
        ] as const);
        const c = rng.int(1, 9);
        return ask(
          [
            `The series $\\sum_{n \\in \\mathbb{Z}} \\frac{${c}}{(\\frac{1}{${den}} - n)^{2}}$ equals $k\\pi^{2}$. What is $k$?`,
            `级数 $\\sum_{n \\in \\mathbb{Z}} \\frac{${c}}{(\\frac{1}{${den}} - n)^{2}}$ 等于 $k\\pi^{2}$。$k$ 是多少？`,
          ],
          k.mul(Q.of(c, 1)),
          [Q.of(c, den), Q.of(c, 1), k],
          [
            `It equals $\\frac{${c}\\pi^{2}}{\\sin^{2}(\\pi / ${den})}$, and $\\frac{1}{\\sin^{2}(\\pi / ${den})} = ${k.toLatex()}$.`,
            `它等于 $\\frac{${c}\\pi^{2}}{\\sin^{2}(\\pi / ${den})}$，而 $\\frac{1}{\\sin^{2}(\\pi / ${den})} = ${k.toLatex()}$。`,
          ],
        );
      },
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
          "A map of the upper half plane onto a polygon has $f'(z) = A \\prod (z - x_{k})^{\\alpha_{k} - 1}$, where the polygon's interior angle at the image of $x_{k}$ is $\\alpha_{k}\\pi$. Each factor bends the boundary by the right amount.",
          "把上半平面映到多边形的映射满足 $f'(z) = A \\prod (z - x_{k})^{\\alpha_{k} - 1}$，其中多边形在 $x_{k}$ 的像处的内角是 $\\alpha_{k}\\pi$。每个因子让边界转过恰当的角度。",
        ],
        (rng) => {
          const q = rng.int(2, 12);
          const start = rng.int(1, 2 * q - 2);
          const p = start === q ? 2 * q - 1 : start;
          const alpha = Q.of(p, q);
          return ask(
            [
              `A polygon has interior angle $${alpha.toLatex()}\\pi$ at a vertex. What is the exponent of the matching factor of $f'(z)$?`,
              `多边形在一个顶点的内角是 $${alpha.toLatex()}\\pi$。$f'(z)$ 中相应因子的指数是多少？`,
            ],
            alpha.sub(Q.of(1, 1)),
            [alpha, Q.of(1, 1).sub(alpha), alpha.add(Q.of(1, 1))],
            [
              `An interior angle $\\alpha\\pi$ matches the factor $(z - x_k)^{\\alpha - 1}$, so the exponent is $${alpha.toLatex()} - 1 = ${alpha.sub(Q.of(1, 1)).toLatex()}$.`,
              `内角 $\\alpha\\pi$ 对应因子 $(z - x_k)^{\\alpha - 1}$，所以指数是 $${alpha.toLatex()} - 1 = ${alpha.sub(Q.of(1, 1)).toLatex()}$。`,
            ],
          );
        },
      ),
      figure: complexDrawings2["the-schwarz-christoffel-formula#the-exponent-at-a-vertex"],
    },
    {
      ...point(
        "exponents-add-to-minus-two",
        ["Exponents add to minus two", "指数和为负二"],
        [
          "The exterior angles of a polygon add to $2\\pi$, and the exterior angle at a vertex is $(1 - \\alpha_{k})\\pi$. So the exponents $\\alpha_{k} - 1$ always add to $-2$.",
          "多边形的外角和是 $2\\pi$，一个顶点的外角是 $(1 - \\alpha_{k})\\pi$。所以指数 $\\alpha_{k} - 1$ 的和总是 $-2$。",
        ],
        (rng) => {
          const n = rng.pick([6, 8, 9, 10, 12, 15]);
          const a = rng.int(1, n - 2);
          const b = rng.int(1, n - a - 1);
          const e1 = Q.of(a, n).sub(Q.of(1, 1));
          const e2 = Q.of(b, n).sub(Q.of(1, 1));
          const e3 = Q.of(-2, 1).sub(e1).sub(e2);
          return ask(
            [
              `A triangle's map has exponents $${e1.toLatex()}$ and $${e2.toLatex()}$ at two vertices. What is the exponent at the third?`,
              `三角形的映射在两个顶点的指数是 $${e1.toLatex()}$ 和 $${e2.toLatex()}$。第三个顶点的指数是多少？`,
            ],
            e3,
            [e3.add(Q.of(1, 1)), e3.sub(Q.of(1, 1)), e1.add(e2)],
            [
              `The three exponents add to $-2$, so the third is $-2 - (${e1.toLatex()}) - (${e2.toLatex()})$.`,
              `三个指数的和是 $-2$，所以第三个是 $-2 - (${e1.toLatex()}) - (${e2.toLatex()})$。`,
            ],
          );
        },
      ),
      figure: complexDrawings2["the-schwarz-christoffel-formula#exponents-add-to-minus-two"],
    },
    {
      ...point(
        "a-regular-polygon",
        ["A regular polygon", "正多边形"],
        [
          "The interior angle of a regular $n$-gon is $\\frac{n - 2}{n}\\pi$, so each factor has exponent $-\\frac{2}{n}$. The disc maps onto the polygon by $f'(z) = \\left(1 - z^{n}\\right)^{-2/n}$, with vertices at the $n$th roots of unity.",
          "正 $n$ 边形的内角是 $\\frac{n - 2}{n}\\pi$，所以每个因子的指数是 $-\\frac{2}{n}$。圆盘到多边形的映射满足 $f'(z) = \\left(1 - z^{n}\\right)^{-2/n}$，顶点对应 $n$ 次单位根。",
        ],
        (rng) => {
          const n = rng.int(3, 60);
          return ask(
            [`What is the exponent of each factor in the formula for a regular ${n}-gon?`, `正 ${n} 边形的公式中，每个因子的指数是多少？`],
            Q.of(-2, n),
            [Q.of(2, n), Q.of(-1, n), Q.of(n - 2, n)],
            [
              `The interior angle is $\\frac{${n - 2}}{${n}}\\pi$, and $\\frac{${n - 2}}{${n}} - 1 = -\\frac{2}{${n}}$.`,
              `内角是 $\\frac{${n - 2}}{${n}}\\pi$，而 $\\frac{${n - 2}}{${n}} - 1 = -\\frac{2}{${n}}$。`,
            ],
          );
        },
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
        "In one dimension an ellipsoid is an interval. Test its midpoint: if the midpoint violates a constraint, the feasible set lies on one side, so half the interval is discarded. This is bisection.",
        "一维情形下椭球就是区间。检验它的中点：如果中点违反某个约束，可行集就在一侧，于是丢掉一半区间。这就是二分法。",
      ],
      (rng) => {
        const m = rng.int(3, 12);
        const e = rng.int(1, 5);
        return ask(
          [
            `An interval of length ${2 ** m * e} is halved at each step. After how many steps is its length ${e}?`,
            `长度为 ${2 ** m * e} 的区间每一步减半。多少步之后它的长度是 ${e}？`,
          ],
          m,
          [m - 1, m + 1, 2 ** m],
          [`The length is divided by $2^{${m}}$, so ${m} steps are needed.`, `长度要除以 $2^{${m}}$，所以需要 ${m} 步。`],
        );
      },
    ),
    point(
      "finding-a-separating-constraint",
      ["Finding a separating constraint", "找到分离约束"],
      [
        "At each step the method tests the center of the ellipsoid. A violated constraint cuts through or beyond the center, so the feasible region lies in one half of the ellipsoid, and a smaller ellipsoid is drawn around that half.",
        "每一步都检验椭球的中心。被违反的约束穿过或越过中心，所以可行域位于椭球的一半之内，然后围绕这一半画一个更小的椭球。",
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
        const wrong = all.filter((_, k) => k !== i);
        return choose(
          rng,
          [`The center of the ellipsoid is $(${x}, ${y})$. Which constraint gives a cut?`, `椭球的中心是 $(${x}, ${y})$。哪个约束给出割？`],
          cuts[i] as Pair,
          wrong,
          [
            `Substitute the center into each constraint. Only this constraint fails there, so it separates the center from the feasible set.`,
            `把中心代入每个约束。只有这个约束在该点不成立，所以它把中心与可行集分开。`,
          ],
        );
      },
    ),
    point(
      "counting-the-iterations",
      ["Counting the iterations", "估计迭代次数"],
      [
        "In dimension $n$, each step shrinks the volume by a factor of at most $e^{-1/(2(n + 1))}$. Reducing the volume by a factor of $e^{k}$ thus takes at most $2(n + 1)k$ steps, a polynomial bound.",
        "在 $n$ 维中，每一步把体积至少缩小为原来的 $e^{-1/(2(n + 1))}$ 倍。所以把体积缩小 $e^{k}$ 倍最多需要 $2(n + 1)k$ 步，这是一个多项式上界。",
      ],
      (rng) => {
        const n = rng.int(2, 30);
        const k = rng.int(5, 40);
        return ask(
          [
            `In dimension ${n}, what is the bound on the number of steps that reduce the volume by a factor of $e^{${k}}$?`,
            `在 ${n} 维中，把体积缩小 $e^{${k}}$ 倍所需步数的上界是多少？`,
          ],
          2 * (n + 1) * k,
          [(n + 1) * k, 2 * n * k, 2 * (n + 1) + k],
          [
            `Each step multiplies the volume by at most $e^{-1/(2(n + 1))}$, so a factor of $e^{${k}}$ takes at most $2(n + 1) \\cdot ${k}$ steps: $2(${n} + 1) \\cdot ${k} = ${2 * (n + 1) * k}$.`,
            `每一步至多把体积乘以 $e^{-1/(2(n + 1))}$，所以缩小 $e^{${k}}$ 倍至多需要 $2(n + 1) \\cdot ${k}$ 步：$2(${n} + 1) \\cdot ${k} = ${2 * (n + 1) * k}$。`,
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
        "Interior-point methods replace $x \\ge 0$ with a penalty $-\\mu \\ln x$ that grows without bound near the wall. Minimizing $cx - \\mu \\ln x$ for $c > 0$ sets the derivative $c - \\frac{\\mu}{x}$ to zero, which gives $x = \\frac{\\mu}{c}$.",
        "内点法把 $x \\ge 0$ 换成罚项 $-\\mu \\ln x$，它在靠近边界时无限增大。对 $c > 0$ 最小化 $cx - \\mu \\ln x$，令导数 $c - \\frac{\\mu}{x}$ 为零，得 $x = \\frac{\\mu}{c}$。",
      ],
      (rng) => {
        const c = rng.int(2, 12);
        const mu = rng.int(1, 9);
        const q = rng.pick([1, 2, 4, 5, 10]);
        const m = Q.of(mu, q);
        return ask(
          [
            `For $x > 0$, where is $${c}x - ${m.toLatex()} \\ln x$ smallest?`,
            `当 $x > 0$ 时，$${c}x - ${m.toLatex()} \\ln x$ 在何处最小？`,
          ],
          m.div(Q.of(c, 1)),
          [Q.of(c, 1).div(m), m, m.mul(Q.of(c, 1))],
          [
            `Set $${c} - \\frac{\\mu}{x} = 0$ with $\\mu = ${m.toLatex()}$.`,
            `令 $${c} - \\frac{\\mu}{x} = 0$，其中 $\\mu = ${m.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "a-point-on-the-central-path",
      ["A point on the central path", "中心路径上的点"],
      [
        "The central path relaxes complementary slackness: primal and dual slack variables satisfy $x_{i}s_{i} = \\mu$ for every $i$, with the same $\\mu$. As $\\mu \\to 0$, the conditions become the optimality conditions.",
        "中心路径放宽了互补松弛：原始变量与对偶松弛变量对每个 $i$ 都满足 $x_{i}s_{i} = \\mu$，其中 $\\mu$ 相同。当 $\\mu \\to 0$ 时，这些条件变成最优性条件。",
      ],
      (rng) => {
        const x = rng.int(2, 12);
        const mu = rng.int(1, 12);
        const other = rng.int(2, 12);
        return ask(
          [
            `At a point on the central path with $\\mu = ${mu}$, $x_{1} = ${x}$ and $x_{2} = ${other}$. What is $s_{1}$?`,
            `在 $\\mu = ${mu}$ 的中心路径点上，$x_{1} = ${x}$，$x_{2} = ${other}$。$s_{1}$ 是多少？`,
          ],
          Q.of(mu, x),
          [Q.of(mu, other), Q.of(x, mu), Q.of(mu * x, 1)],
          [
            `Since $x_{1}s_{1} = ${mu}$, we get $s_{1} = \\frac{${mu}}{${x}}$.`,
            `因为 $x_{1}s_{1} = ${mu}$，所以 $s_{1} = \\frac{${mu}}{${x}}$。`,
          ],
        );
      },
    ),
    point(
      "the-gap-along-the-path",
      ["The gap along the path", "路径上的对偶间隙"],
      [
        "The duality gap is $c^{T}x - b^{T}y = x^{T}s$, so at a point on the central path with $n$ variables the gap is exactly $n\\mu$. Shrinking $\\mu$ by a fixed factor at each step shrinks the gap geometrically.",
        "对偶间隙是 $c^{T}x - b^{T}y = x^{T}s$，所以在有 $n$ 个变量的中心路径点上，间隙恰好是 $n\\mu$。每一步把 $\\mu$ 缩小固定倍数，间隙就按几何级数缩小。",
      ],
      (rng) => {
        const n = rng.int(3, 40);
        const mu = rng.int(1, 16);
        const k = rng.int(1, 5);
        return ask(
          [
            `A central-path method with ${n} variables starts at $\\mu = ${mu}$ and halves $\\mu$ at each step. What is the duality gap after ${k} steps?`,
            `有 ${n} 个变量的中心路径法从 $\\mu = ${mu}$ 开始，每一步把 $\\mu$ 减半。${k} 步之后对偶间隙是多少？`,
          ],
          Q.of(n * mu, 2 ** k),
          [Q.of(mu, 2 ** k), Q.of(n * mu, 2 * k), Q.of(n * mu, 1)],
          [
            `After ${k} steps $\\mu = \\frac{${mu}}{${2 ** k}}$, and the gap is ${n} times that.`,
            `${k} 步之后 $\\mu = \\frac{${mu}}{${2 ** k}}$，间隙是它的 ${n} 倍。`,
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
        "Transforming $u_{tt} = c^{2}u_{xx}$ in $x$ gives $\\hat{u}_{tt} = -c^{2}k^{2}\\hat{u}$. So the part of the wave with wavenumber $k$ oscillates in time with angular frequency $c|k|$ and period $\\frac{2\\pi}{c|k|}$.",
        "对 $u_{tt} = c^{2}u_{xx}$ 关于 $x$ 作变换，得 $\\hat{u}_{tt} = -c^{2}k^{2}\\hat{u}$。所以波数为 $k$ 的部分随时间振荡，角频率是 $c|k|$，周期是 $\\frac{2\\pi}{c|k|}$。",
      ],
      (rng) => {
        const c = rng.int(1, 9);
        const k = rng.pick([-1, 1]) * rng.int(1, 9);
        return ask(
          [
            `For $u_{tt} = ${c * c}u_{xx}$, the part with wavenumber $k = ${k}$ has period $r\\pi$. What is $r$?`,
            `对 $u_{tt} = ${c * c}u_{xx}$，波数 $k = ${k}$ 的部分周期是 $r\\pi$。$r$ 是多少？`,
          ],
          Q.of(2, c * Math.abs(k)),
          [Q.of(2, c * c * Math.abs(k)), Q.of(1, c * Math.abs(k)), Q.of(2, c * k * k)],
          [
            `The speed is ${c}, so the angular frequency is ${c * Math.abs(k)} and the period is $\\frac{2\\pi}{${c * Math.abs(k)}}$.`,
            `波速是 ${c}，所以角频率是 ${c * Math.abs(k)}，周期是 $\\frac{2\\pi}{${c * Math.abs(k)}}$。`,
          ],
        );
      },
    ),
    point(
      "decay-away-from-the-boundary",
      ["Decay away from the boundary", "离开边界后的衰减"],
      [
        "Transforming Laplace's equation on $y > 0$ gives $\\hat{u}_{yy} = k^{2}\\hat{u}$. The bounded solution is $\\hat{u}(k, y) = \\hat{u}(k, 0)e^{-|k|y}$. Rapid variations on the boundary fade fastest with height.",
        "对 $y > 0$ 上的拉普拉斯方程作变换，得 $\\hat{u}_{yy} = k^{2}\\hat{u}$。有界解是 $\\hat{u}(k, y) = \\hat{u}(k, 0)e^{-|k|y}$。边界上变化快的部分随高度衰减得最快。",
      ],
      (rng) => {
        const k = rng.pick([-1, 1]) * rng.int(1, 12);
        const y = rng.int(1, 9);
        const v = Math.abs(k) * y;
        return ask(
          [
            `Laplace's equation holds on $y > 0$. The part with wavenumber $k = ${k}$ at height $y = ${y}$ is $e^{-r}$ times its boundary value. What is $r$?`,
            `拉普拉斯方程在 $y > 0$ 上成立。波数 $k = ${k}$ 的部分在高度 $y = ${y}$ 处是其边界值的 $e^{-r}$ 倍。$r$ 是多少？`,
          ],
          v,
          [k * k * y, y, k * y === v ? v + y : k * y],
          [`The factor is $e^{-|k|y}$, and $|${k}| \\cdot ${y} = ${v}$.`, `因子是 $e^{-|k|y}$，而 $|${k}| \\cdot ${y} = ${v}$。`],
        );
      },
    ),
    point(
      "the-poisson-kernel-of-a-half-plane",
      ["The Poisson kernel of a half-plane", "半平面的泊松核"],
      [
        "Inverting the factor $e^{-|k|y}$ gives $u(x, y) = \\frac{1}{\\pi}\\int \\frac{y \\, f(s)}{(x - s)^{2} + y^{2}} \\, ds$. This formula averages the boundary values, and nearby boundary points count the most. For $f = C$ on $[-a, a]$ and $0$ elsewhere, on the axis this is $u(0, y) = \\frac{2C}{\\pi}\\arctan\\frac{a}{y}$.",
        "对因子 $e^{-|k|y}$ 作逆变换，得 $u(x, y) = \\frac{1}{\\pi}\\int \\frac{y \\, f(s)}{(x - s)^{2} + y^{2}} \\, ds$。这个公式对边界值取平均，靠近的边界点权重最大。当 $f$ 在 $[-a, a]$ 上等于 $C$、其余处为 $0$ 时，在轴上有 $u(0, y) = \\frac{2C}{\\pi}\\arctan\\frac{a}{y}$。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const c = 6 * rng.int(1, 8);
        const [height, share] = rng.pick([
          [`${a}`, Q.of(1, 2)],
          [`${a}\\sqrt{3}`, Q.of(1, 3)],
          [`\\frac{${a}}{\\sqrt{3}}`, Q.of(2, 3)],
        ] as const);
        return ask(
          [
            `The boundary value on $y = 0$ is ${c} on $[${-a}, ${a}]$ and 0 elsewhere. What is the bounded harmonic function's value at $(0, ${height})$?`,
            `$y = 0$ 上的边界值在 $[${-a}, ${a}]$ 上是 ${c}，其余处是 0。有界调和函数在 $(0, ${height})$ 处的值是多少？`,
          ],
          share.mul(Q.of(c, 1)),
          [
            Q.of(c, 1),
            Q.of(0, 1),
            Q.of(1, 1)
              .sub(share)
              .mul(Q.of(c, 1))
              .eq(share.mul(Q.of(c, 1)))
              ? Q.of(c, 4)
              : Q.of(1, 1).sub(share).mul(Q.of(c, 1)),
          ],
          [
            `Here $\\frac{2}{\\pi}\\arctan\\frac{a}{y} = ${share.toLatex()}$, so the value is $${share.toLatex()} \\cdot ${c}$.`,
            `这里 $\\frac{2}{\\pi}\\arctan\\frac{a}{y} = ${share.toLatex()}$，所以值是 $${share.toLatex()} \\cdot ${c}$。`,
          ],
        );
      },
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
          "The solution of $-\\Delta u = \\delta$ that depends only on the distance $r$ is $-\\frac{1}{2\\pi}\\ln r$ in the plane and $\\frac{1}{4\\pi r}$ in space. The constant makes the flux through a small circle or sphere equal to $1$.",
          "$-\\Delta u = \\delta$ 只依赖距离 $r$ 的解，在平面上是 $-\\frac{1}{2\\pi}\\ln r$，在空间中是 $\\frac{1}{4\\pi r}$。常数使穿过小圆或小球面的通量等于 $1$。",
        ],
        (rng) => {
          const plane = rng.bool();
          const q = rng.int(2, 60);
          const a = `-\\frac{${q}}{2\\pi}\\ln r`;
          const b = `\\frac{${q}}{4\\pi r}`;
          return choose(
            rng,
            plane
              ? [`Which function solves $-\\Delta u = ${q}\\delta$ in the plane?`, `哪个函数在平面上满足 $-\\Delta u = ${q}\\delta$？`]
              : [`Which function solves $-\\Delta u = ${q}\\delta$ in space?`, `哪个函数在空间中满足 $-\\Delta u = ${q}\\delta$？`],
            same(plane ? a : b),
            [
              same(plane ? b : a),
              same(plane ? `\\frac{${q}}{2\\pi}\\ln r` : `-\\frac{${q}}{4\\pi r}`),
              same(plane ? `\\frac{${q}}{2\\pi r}` : `\\frac{${q}}{4\\pi r^{2}}`),
            ],
            [
              `The flux outward through a circle or sphere of radius $r$ must equal ${q}, which fixes the sign and the constant.`,
              `向外穿过半径为 $r$ 的圆或球面的通量必须等于 ${q}，这决定了符号和常数。`,
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
        "In space, the potential of a point source decays like $\\frac{1}{r}$. Going from distance $r_{1}$ to distance $r_{2}$ multiplies it by $\\frac{r_{1}}{r_{2}}$.",
        "在空间中，点源的势按 $\\frac{1}{r}$ 衰减。从距离 $r_{1}$ 到距离 $r_{2}$，势乘以 $\\frac{r_{1}}{r_{2}}$。",
      ],
      (rng) => {
        const r1 = rng.int(1, 9);
        const r2 = r1 + rng.int(1, 9);
        const u = 12 * r2 * rng.int(1, 3);
        return ask(
          [
            `A point source in space has potential ${u} at distance ${r1}. What is its potential at distance ${r2}?`,
            `空间中的点源在距离 ${r1} 处的势是 ${u}。它在距离 ${r2} 处的势是多少？`,
          ],
          Q.of(u * r1, r2),
          [Q.of(u * r1 * r1, r2 * r2), Q.of(u * r2, r1), Q.of(u, r2)],
          [
            `In space the potential of a point source is proportional to $\\frac{1}{r}$, so $u(${r2}) = ${u} \\cdot \\frac{${r1}}{${r2}} = ${Q.of(u * r1, r2).toLatex()}$.`,
            `空间中点源的势与 $\\frac{1}{r}$ 成正比，所以 $u(${r2}) = ${u} \\cdot \\frac{${r1}}{${r2}} = ${Q.of(u * r1, r2).toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "differences-of-potentials-in-the-plane",
      ["Differences of potentials in the plane", "平面上势的差"],
      [
        "In the plane, the potential of a source of strength $q$ is $-\\frac{q}{2\\pi}\\ln r$, which is unbounded at infinity. Only differences have a fixed meaning: $u(r_{1}) - u(r_{2}) = \\frac{q}{2\\pi}\\ln\\frac{r_{2}}{r_{1}}$.",
        "在平面上，强度为 $q$ 的源的势是 $-\\frac{q}{2\\pi}\\ln r$，它在无穷远处无界。只有差才有确定的意义：$u(r_{1}) - u(r_{2}) = \\frac{q}{2\\pi}\\ln\\frac{r_{2}}{r_{1}}$。",
      ],
      (rng) => {
        const q = rng.int(2, 12);
        const m = rng.int(1, 6);
        const r = rng.int(1, 5);
        return ask(
          [
            `A plane source of strength ${q} has potential $u$. If $u(${r}) - u(${r}e^{${m}})$ equals $\\frac{s}{\\pi}$, what is $s$?`,
            `强度为 ${q} 的平面源的势为 $u$。如果 $u(${r}) - u(${r}e^{${m}})$ 等于 $\\frac{s}{\\pi}$，那么 $s$ 是多少？`,
          ],
          Q.of(q * m, 2),
          [Q.of(q * m, 1), Q.of(q, 2), Q.of(q * m, 4)],
          [
            `The ratio of the distances is $e^{${m}}$, so the difference is $\\frac{${q}}{2\\pi} \\cdot ${m}$.`,
            `距离之比是 $e^{${m}}$，所以差是 $\\frac{${q}}{2\\pi} \\cdot ${m}$。`,
          ],
        );
      },
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
        "The delta function $\\delta_{a}$ is defined by what it does to a smooth test function: $\\int \\delta_{a}\\varphi = \\varphi(a)$. It is not a function, but a rule that assigns a number to each test function.",
        "δ 函数 $\\delta_{a}$ 由它对光滑检验函数的作用定义：$\\int \\delta_{a}\\varphi = \\varphi(a)$。它不是函数，而是给每个检验函数指定一个数的规则。",
      ],
      (rng) => {
        const a = rng.int(-6, 6);
        const b = rng.int(1, 6);
        const c = rng.int(1, 9);
        const v = b * a * a + c;
        return ask(
          [
            `What is $\\int_{-\\infty}^{\\infty} \\delta(x - ${a < 0 ? `(${a})` : a})(${b}x^{2} + ${c}) \\, dx$?`,
            `$\\int_{-\\infty}^{\\infty} \\delta(x - ${a < 0 ? `(${a})` : a})(${b}x^{2} + ${c}) \\, dx$ 是多少？`,
          ],
          v,
          [c, b * a + c, v + b],
          [`Evaluate the other factor at $x = ${a}$, which gives ${v}.`, `把另一个因子在 $x = ${a}$ 处取值，得 ${v}。`],
        );
      },
    ),
    point(
      "derivatives-by-integrating-by-parts",
      ["Derivatives by integrating by parts", "分部积分定义导数"],
      [
        "A distribution's derivative moves the derivative onto the test function, with a sign: $\\langle T', \\varphi \\rangle = -\\langle T, \\varphi' \\rangle$. This is integration by parts, where the test function vanishes far away and leaves no boundary term. So $\\langle \\delta_{a}', \\varphi \\rangle = -\\varphi'(a)$.",
        "分布的导数把求导转移到检验函数上，并带一个负号：$\\langle T', \\varphi \\rangle = -\\langle T, \\varphi' \\rangle$。这就是分部积分，检验函数在远处为零，所以没有边界项。因此 $\\langle \\delta_{a}', \\varphi \\rangle = -\\varphi'(a)$。",
      ],
      (rng) => {
        const a = rng.int(1, 6) * rng.pick([-1, 1]);
        const b = rng.int(1, 6);
        const d = rng.int(1, 9);
        const v = -(2 * b * a + d);
        return ask(
          [
            `What is $\\langle \\delta_{${a}}', \\varphi \\rangle$ for $\\varphi(x) = ${b}x^{2} + ${d}x$ near ${a}?`,
            `当 $\\varphi(x)$ 在 ${a} 附近等于 $${b}x^{2} + ${d}x$ 时，$\\langle \\delta_{${a}}', \\varphi \\rangle$ 是多少？`,
          ],
          v,
          [-v, b * a * a + d * a, -(b * a * a + d * a)],
          [`Since $\\varphi'(${a}) = ${-v}$, the value is ${v}.`, `因为 $\\varphi'(${a}) = ${-v}$，所以值是 ${v}。`],
        );
      },
    ),
    point(
      "the-second-derivative-of-a-corner",
      ["The second derivative of a corner", "角点的二阶导数"],
      [
        "A function with a corner has a weak first derivative with a jump, and the derivative of a jump is a delta function. So at a corner $u''$ contains $(s_{+} - s_{-})\\delta$, where $s_{-}$ and $s_{+}$ are the slopes on the left and right.",
        "带角点的函数的弱一阶导数有跳跃，而跳跃的导数是 δ 函数。所以在角点处 $u''$ 含有 $(s_{+} - s_{-})\\delta$，其中 $s_{-}$ 和 $s_{+}$ 是左右两侧的斜率。",
      ],
      (rng) => {
        const p = rng.int(1, 9);
        const q = rng.int(1, 9);
        const a = rng.int(1, 6);
        return ask(
          [
            `For $u(x) = ${p}|x - ${a}| + ${q}x$, the weak second derivative is $r\\delta_{${a}}$. What is $r$?`,
            `对 $u(x) = ${p}|x - ${a}| + ${q}x$，弱二阶导数是 $r\\delta_{${a}}$。$r$ 是多少？`,
          ],
          2 * p,
          [p, p + q, 2 * q === 2 * p ? 0 : 2 * q],
          [
            `The slopes are $${q - p}$ on the left and $${q + p}$ on the right, and their difference is ${2 * p}.`,
            `左侧斜率是 $${q - p}$，右侧斜率是 $${q + p}$，它们的差是 ${2 * p}。`,
          ],
        );
      },
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
        "For $-u'' = f$ with $u = 0$ at both ends, the weak form is $\\int u'v' = \\int fv$. Using hat functions on a mesh of spacing $h$, the matrix entries $\\int \\varphi_{i}'\\varphi_{j}'$ are $\\frac{2}{h}$ on the diagonal and $-\\frac{1}{h}$ next to it.",
        "对两端 $u = 0$ 的 $-u'' = f$，弱形式是 $\\int u'v' = \\int fv$。在间距为 $h$ 的网格上用帽函数，矩阵元素 $\\int \\varphi_{i}'\\varphi_{j}'$ 在对角线上是 $\\frac{2}{h}$，在相邻位置是 $-\\frac{1}{h}$。",
      ],
      (rng) => {
        const n = rng.int(3, 40);
        const diagonal = rng.bool();
        return ask(
          [
            diagonal
              ? `With hat functions on $[0, 1]$ cut into ${n} equal elements, what is a diagonal entry of the stiffness matrix?`
              : `With hat functions on $[0, 1]$ cut into ${n} equal elements, what is the entry of the stiffness matrix next to the diagonal?`,
            diagonal
              ? `把 $[0, 1]$ 分成 ${n} 个相等单元并使用帽函数，刚度矩阵的对角元素是多少？`
              : `把 $[0, 1]$ 分成 ${n} 个相等单元并使用帽函数，刚度矩阵中与对角线相邻的元素是多少？`,
          ],
          diagonal ? 2 * n : -n,
          diagonal ? [n, -n, Q.of(2, n)] : [n, 2 * n, Q.of(-1, n)],
          [`Here $h = \\frac{1}{${n}}$, so $\\frac{1}{h} = ${n}$.`, `这里 $h = \\frac{1}{${n}}$，所以 $\\frac{1}{h} = ${n}$。`],
        );
      },
    ),
    point(
      "the-load-vector",
      ["The load vector", "载荷向量"],
      [
        "The right side of the system has entries $\\int f\\varphi_{i}$. A hat function has area $h$, so a constant $f$ gives the entry $fh$.",
        "方程组右边的元素是 $\\int f\\varphi_{i}$。帽函数的面积是 $h$，所以常数 $f$ 给出的元素是 $fh$。",
      ],
      (rng) => {
        const f = rng.int(2, 30);
        const n = rng.int(3, 40);
        return ask(
          [
            `For $f = ${f}$ on $[0, 1]$ cut into ${n} equal elements, what is an entry of the load vector?`,
            `对 $f = ${f}$，把 $[0, 1]$ 分成 ${n} 个相等单元，载荷向量的元素是多少？`,
          ],
          Q.of(f, n),
          [Q.of(f, 2 * n), Q.of(2 * f, n), Q.of(f * n, 1)],
          [
            `A hat of width $\\frac{2}{${n}}$ and height 1 has area $\\frac{1}{${n}}$.`,
            `宽为 $\\frac{2}{${n}}$、高为 1 的帽函数面积是 $\\frac{1}{${n}}$。`,
          ],
        );
      },
    ),
    point(
      "solving-with-one-unknown",
      ["Solving with one unknown", "只有一个未知数时求解"],
      [
        "With two elements on $[0, L]$ there is one interior node, and $h = \\frac{L}{2}$. The system is $\\frac{2}{h}U = fh$, so $U = \\frac{fh^{2}}{2}$. For constant $f$ this equals the exact solution at the midpoint.",
        "在 $[0, L]$ 上用两个单元时只有一个内部节点，$h = \\frac{L}{2}$。方程组是 $\\frac{2}{h}U = fh$，所以 $U = \\frac{fh^{2}}{2}$。对常数 $f$，它等于中点处的精确解。",
      ],
      (rng) => {
        const f = rng.int(1, 16);
        const L = rng.int(1, 6);
        return ask(
          [
            `Solve $-u'' = ${f}$ on $[0, ${L}]$ with $u = 0$ at both ends, using two equal elements. What is the value at the midpoint?`,
            `用两个相等单元求解 $[0, ${L}]$ 上两端 $u = 0$ 的 $-u'' = ${f}$。中点处的值是多少？`,
          ],
          Q.of(f * L * L, 8),
          [Q.of(f * L * L, 4), Q.of(f * L, 4), Q.of(f * L * L, 2)],
          [
            `With $h = \\frac{${L}}{2}$, we get $U = \\frac{${f}h^{2}}{2} = \\frac{${f} \\cdot ${L * L}}{8}$.`,
            `当 $h = \\frac{${L}}{2}$ 时，$U = \\frac{${f}h^{2}}{2} = \\frac{${f} \\cdot ${L * L}}{8}$。`,
          ],
        );
      },
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
export const realAnalysisOutlineTopics: readonly TopicDef[] = [measurableFunctions, convergenceTheorems, stoneWeierstrass];

/** complexAnalysisOutlineTopics holds the Complex Analysis topics added from the course outline. */
export const complexAnalysisOutlineTopics: readonly TopicDef[] = [normalFamilies, mittagLeffler, schwarzChristoffel];

/** linearProgrammingOutlineTopics holds the Linear Programming topics added from the course outline. */
export const linearProgrammingOutlineTopics: readonly TopicDef[] = [ellipsoidMethod, interiorPoint];

/** partialDifferentialEquationsOutlineTopics holds the PDE topics added from the course outline. */
export const partialDifferentialEquationsOutlineTopics: readonly TopicDef[] = [
  transformsOnUnbounded,
  fundamentalSolutions,
  weakSolutions,
  finiteElements,
];
