// The topics a standard syllabus of Number Theory, Real Analysis, Complex Analysis, Linear Programming or Partial
// Differential Equations includes beyond the rest of these courses: p-adic numbers and elliptic curves, measurable
// functions and the convergence theorems, Stone-Weierstrass, normal families, partial fraction expansions, the
// Schwarz-Christoffel formula, the ellipsoid and barrier methods, transforms on unbounded regions, fundamental
// solutions, weak solutions and finite elements.

import type { Rng, TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, powMod, primesUpTo, same, topic } from "../university-kit.ts";

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
const curveLatex = (a: number, b: number) => `y^{2} = x^{3} + ${a}x + ${b}`;

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
        "Write a nonzero rational as $p^{k} \\cdot \\frac{m}{n}$ with $m$ and $n$ not divisible by $p$. Its $p$-adic absolute value is $|x|_{p} = p^{-k}$. High powers of $p$ make a number small, and powers of $p$ in the denominator make it large.",
        "把非零有理数写成 $p^{k} \\cdot \\frac{m}{n}$，其中 $m$ 和 $n$ 不被 $p$ 整除。它的 $p$ 进绝对值是 $|x|_{p} = p^{-k}$。$p$ 的高次幂让数变小，分母中的 $p$ 让数变大。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7]);
        const m = rng.pick([1, 2, 3, 5, 7, 11, 13].filter((v) => v % p !== 0));
        const n = rng.pick([1, 2, 3, 5, 7, 11, 13].filter((v) => v % p !== 0 && v !== m));
        const k = rng.int(1, 3);
        const below = rng.bool();
        const latex = below ? `\\frac{${m}}{${p ** k * n}}` : `\\frac{${p ** k * m}}{${n}}`;
        const shown = n === 1 && !below ? `${p ** k * m}` : latex;
        const answer = below ? Q.of(p ** k, 1) : Q.of(1, p ** k);
        const wrong = below ? Q.of(1, p ** k) : Q.of(p ** k, 1);
        const v = below ? `-${k}` : `${k}`;
        return ask(
          [`What is $|${shown}|_{${p}}$?`, `$|${shown}|_{${p}}$ 是多少？`],
          answer,
          [wrong, Q.of(1, p), Q.of(p ** k * m, n)],
          [
            `The power of ${p} in the number is ${v}, so the absolute value is $${p}^{${below ? k : `-${k}`}}$.`,
            `这个数中 ${p} 的幂次是 ${v}，所以绝对值是 $${p}^{${below ? k : `-${k}`}}$。`,
          ],
        );
      },
    ),
    point(
      "the-strong-triangle-inequality",
      ["The strong triangle inequality", "强三角不等式"],
      [
        "The $p$-adic absolute value satisfies $|x + y|_{p} \\le \\max(|x|_{p}, |y|_{p})$, and equality holds when the two sizes differ. Adding a smaller number cannot change the size of a larger one.",
        "$p$ 进绝对值满足 $|x + y|_{p} \\le \\max(|x|_{p}, |y|_{p})$，两个大小不同时等号成立。加上一个较小的数不会改变较大数的大小。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7]);
        const i = rng.int(0, 2);
        const j = i + rng.int(1, 3);
        return ask(
          [
            `If $|x|_{${p}} = ${Q.of(1, p ** i).toLatex()}$ and $|y|_{${p}} = \\frac{1}{${p ** j}}$, what is $|x + y|_{${p}}$?`,
            `如果 $|x|_{${p}} = ${Q.of(1, p ** i).toLatex()}$ 且 $|y|_{${p}} = \\frac{1}{${p ** j}}$，那么 $|x + y|_{${p}}$ 是多少？`,
          ],
          Q.of(1, p ** i),
          [Q.of(1, p ** j), Q.of(1, p ** i).add(Q.of(1, p ** j)), Q.of(1, p ** (i + j))],
          [
            `The sizes differ, so the sum has the larger size, $${Q.of(1, p ** i).toLatex()}$.`,
            `两个大小不同，所以和的大小等于较大者 $${Q.of(1, p ** i).toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "a-series-that-converges-p-adically",
      ["A series that converges p-adically", "p 进收敛的级数"],
      [
        "Powers of $p$ tend to $0$ in the $p$-adic absolute value, so $1 + p + p^{2} + \\dots$ converges in the $p$-adic numbers. The geometric series formula still gives its sum, $\\frac{1}{1 - p}$.",
        "在 $p$ 进绝对值下，$p$ 的幂趋于 $0$，所以 $1 + p + p^{2} + \\dots$ 在 $p$ 进数中收敛。几何级数公式仍然给出它的和 $\\frac{1}{1 - p}$。",
      ],
      (rng) => {
        const p = rng.pick([2, 3, 5, 7, 11]);
        const c = rng.int(2, 9);
        return ask(
          [
            `What is the sum of $${c} + ${c} \\cdot ${p} + ${c} \\cdot ${p}^{2} + \\dots$ in the ${p}-adic numbers?`,
            `$${c} + ${c} \\cdot ${p} + ${c} \\cdot ${p}^{2} + \\dots$ 在 ${p} 进数中的和是多少？`,
          ],
          Q.of(c, 1 - p),
          [Q.of(c, p - 1), Q.of(c * p, 1 - p), Q.of(1, 1 - p)],
          [`The ratio is ${p}, so the sum is $\\frac{${c}}{1 - ${p}}$.`, `公比是 ${p}，所以和是 $\\frac{${c}}{1 - ${p}}$。`],
        );
      },
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
        "An elliptic curve modulo $p$ is the set of solutions of $y^{2} = x^{3} + ax + b$ modulo $p$, together with one extra point at infinity, where $4a^{3} + 27b^{2}$ is not $0$ modulo $p$. To test a point, compute both sides modulo $p$.",
        "模 $p$ 的椭圆曲线是 $y^{2} = x^{3} + ax + b$ 模 $p$ 的解集，再加上一个无穷远点，其中 $4a^{3} + 27b^{2}$ 模 $p$ 不为 $0$。要检验一个点，就在模 $p$ 下计算等式两边。",
      ],
      (rng) => {
        const { p, a, b, points } = pickCurve(rng, 2);
        const [x, y] = rng.pick(points);
        const off: Pair[] = [];
        for (const dy of [1, 2, 3, 4, 5]) {
          const yy = mod(y + dy, p);
          if (!points.some(([u, v]) => u === x && v === yy)) off.push(same(`(${x}, ${yy})`));
        }
        return choose(
          rng,
          [`Which point lies on $${curveLatex(a, b)}$ modulo ${p}?`, `哪个点在模 ${p} 的曲线 $${curveLatex(a, b)}$ 上？`],
          same(`(${x}, ${y})`),
          off.slice(0, 3),
          [
            `At $x = ${x}$ the right side is ${mod(x * x * x + a * x + b, p)} modulo ${p}, and $${y}^{2}$ gives the same residue.`,
            `当 $x = ${x}$ 时，右边模 ${p} 等于 ${mod(x * x * x + a * x + b, p)}，$${y}^{2}$ 也给出相同的余数。`,
          ],
        );
      },
    ),
    point(
      "counting-the-points",
      ["Counting the points", "数点的个数"],
      [
        "For each $x$, the right side is a residue, $0$ or a nonresidue. These give two values of $y$, one value and no value. Add up the counts and then add $1$ for the point at infinity.",
        "对每个 $x$，右边是二次剩余、$0$ 或非剩余，分别给出 $y$ 的两个值、一个值和没有值。把个数相加，再为无穷远点加 $1$。",
      ],
      (rng) => {
        const p = rng.pick([5, 7, 11]);
        let a = rng.int(1, p - 1);
        let b = rng.int(1, p - 1);
        while ((4 * a * a * a + 27 * b * b) % p === 0) {
          a = rng.int(1, p - 1);
          b = rng.int(1, p - 1);
        }
        const affine = curvePoints(a, b, p).length;
        return ask(
          [
            `How many points, including the point at infinity, does $${curveLatex(a, b)}$ have modulo ${p}?`,
            `模 ${p} 时，$${curveLatex(a, b)}$ 有多少个点（包括无穷远点）？`,
          ],
          affine + 1,
          [affine, p + 1 === affine + 1 ? p + 2 : p + 1, affine + 2],
          [
            `Going through $x = 0, \\dots, ${p - 1}$ gives ${affine} points, and infinity makes ${affine + 1}.`,
            `依次取 $x = 0, \\dots, ${p - 1}$，得 ${affine} 个点，加上无穷远点共 ${affine + 1} 个。`,
          ],
        );
      },
    ),
    point(
      "the-size-of-the-group",
      ["The size of the group", "群的大小"],
      [
        "Hasse's theorem says that the number $N$ of points satisfies $|N - (p + 1)| \\le 2\\sqrt{p}$. About half the values of $x$ give two points, so $N$ stays close to $p + 1$.",
        "哈塞定理说，点的个数 $N$ 满足 $|N - (p + 1)| \\le 2\\sqrt{p}$。大约一半的 $x$ 给出两个点，所以 $N$ 接近 $p + 1$。",
      ],
      (rng) => {
        const p = rng.pick(primesUpTo(1000).filter((v) => v > 100));
        const widest = Math.floor(2 * Math.sqrt(p));
        return ask(
          [
            `Hasse's theorem bounds the number of points of an elliptic curve modulo ${p}. What is the largest whole number it allows?`,
            `哈塞定理限制了模 ${p} 的椭圆曲线的点数。它允许的最大整数是多少？`,
          ],
          p + 1 + widest,
          [p + widest, p + 1 - widest, p + 1 + 2 * widest],
          [
            `Since $2\\sqrt{${p}}$ lies between ${widest} and ${widest + 1}, the bound is $${p} + 1 + ${widest}$.`,
            `因为 $2\\sqrt{${p}}$ 在 ${widest} 和 ${widest + 1} 之间，所以上界是 $${p} + 1 + ${widest}$。`,
          ],
        );
      },
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
        "The line through $P = (x_{1}, y_{1})$ and $Q = (x_{2}, y_{2})$ with $x_{1} \\ne x_{2}$ has slope $m = (y_{2} - y_{1})(x_{2} - x_{1})^{-1}$ modulo $p$. Division is not available modulo a prime, so dividing means multiplying by a modular inverse. Find that inverse first, and then multiply it by the difference of the second coordinates.",
        "过 $P = (x_{1}, y_{1})$ 和 $Q = (x_{2}, y_{2})$（$x_{1} \\ne x_{2}$）的直线斜率是模 $p$ 下的 $m = (y_{2} - y_{1})(x_{2} - x_{1})^{-1}$。模素数时没有普通的除法，除以一个数就是乘以它的模逆元。先求出逆元，再乘以第二个坐标的差。",
      ],
      (rng) => {
        const p = rng.pick([11, 13, 17, 19, 23]);
        const x1 = rng.int(0, p - 2);
        const x2 = rng.int(x1 + 1, p - 1);
        const y1 = rng.int(0, p - 1);
        const y2 = rng.int(0, p - 1);
        const m = mod((y2 - y1) * inverse(x2 - x1, p), p);
        return ask(
          [
            `Modulo ${p}, what is the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$? Give a residue from 0 to ${p - 1}.`,
            `模 ${p} 时，过 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$ 的直线斜率是多少？给出 0 到 ${p - 1} 之间的余数。`,
          ],
          m,
          [mod(y2 - y1, p), inverse(x2 - x1, p), mod((y1 - y2) * inverse(x2 - x1, p), p)],
          [
            `The inverse of ${mod(x2 - x1, p)} is ${inverse(x2 - x1, p)}, and ${mod(y2 - y1, p)} times it is ${m} modulo ${p}.`,
            `${mod(x2 - x1, p)} 的逆元是 ${inverse(x2 - x1, p)}，${mod(y2 - y1, p)} 乘以它模 ${p} 等于 ${m}。`,
          ],
        );
      },
    ),
    point(
      "adding-two-different-points",
      ["Adding two different points", "两个不同点相加"],
      [
        "With slope $m$ through $P$ and $Q$, the sum has first coordinate $x_{3} = m^{2} - x_{1} - x_{2}$. The line meets the curve at a third point, and reflecting that point gives the sum, so $y_{3} = m(x_{1} - x_{3}) - y_{1}$.",
        "设过 $P$ 和 $Q$ 的斜率为 $m$，和的第一个坐标是 $x_{3} = m^{2} - x_{1} - x_{2}$。直线与曲线交于第三点，把它反射就得到和，所以 $y_{3} = m(x_{1} - x_{3}) - y_{1}$。",
      ],
      (rng) => {
        for (;;) {
          const { p, a, b, points } = pickCurve(rng, 2);
          const [x1, y1] = rng.pick(points);
          const others = points.filter(([x]) => x !== x1);
          if (others.length === 0) continue;
          const [x2, y2] = rng.pick(others);
          const m = mod((y2 - y1) * inverse(x2 - x1, p), p);
          const x3 = mod(m * m - x1 - x2, p);
          return ask(
            [
              `On $${curveLatex(a, b)}$ modulo ${p}, what is the first coordinate of $(${x1}, ${y1}) + (${x2}, ${y2})$?`,
              `在模 ${p} 的 $${curveLatex(a, b)}$ 上，$(${x1}, ${y1}) + (${x2}, ${y2})$ 的第一个坐标是多少？`,
            ],
            x3,
            [mod(x1 + x2, p), mod(m * m, p), mod(m - x1 - x2, p)],
            [
              `The slope is ${m}, so $x_{3} = ${m}^{2} - ${x1} - ${x2}$, which is ${x3} modulo ${p}.`,
              `斜率是 ${m}，所以 $x_{3} = ${m}^{2} - ${x1} - ${x2}$，模 ${p} 等于 ${x3}。`,
            ],
          );
        }
      },
    ),
    point(
      "doubling-a-point",
      ["Doubling a point", "点的倍乘"],
      [
        "To add $P$ to itself, use the tangent line. Implicit differentiation gives the slope $m = (3x_{1}^{2} + a)(2y_{1})^{-1}$ modulo $p$, and then $x_{3} = m^{2} - 2x_{1}$.",
        "要把 $P$ 与自身相加，就用切线。隐函数求导给出斜率 $m = (3x_{1}^{2} + a)(2y_{1})^{-1}$（模 $p$），然后 $x_{3} = m^{2} - 2x_{1}$。",
      ],
      (rng) => {
        const { p, a, b, points } = pickCurve(rng, 1);
        const [x, y] = rng.pick(points.filter(([, v]) => v !== 0));
        const m = mod((3 * x * x + a) * inverse(2 * y, p), p);
        const x3 = mod(m * m - 2 * x, p);
        return ask(
          [
            `On $${curveLatex(a, b)}$ modulo ${p}, what is the first coordinate of $2 \\cdot (${x}, ${y})$?`,
            `在模 ${p} 的 $${curveLatex(a, b)}$ 上，$2 \\cdot (${x}, ${y})$ 的第一个坐标是多少？`,
          ],
          x3,
          [mod(2 * x, p), mod(m * m, p), mod(m * m - x, p)],
          [
            `The tangent has slope ${m}, so $x_{3} = ${m}^{2} - 2 \\cdot ${x}$, which is ${x3} modulo ${p}.`,
            `切线斜率是 ${m}，所以 $x_{3} = ${m}^{2} - 2 \\cdot ${x}$，模 ${p} 等于 ${x3}。`,
          ],
        );
      },
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
    point(
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
            `The exponent is $\\alpha - 1$ with $\\alpha = ${alpha.toLatex()}$.`,
            `指数是 $\\alpha - 1$，其中 $\\alpha = ${alpha.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
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
    point(
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
          [`The bound is $2(${n} + 1) \\cdot ${k}$.`, `上界是 $2(${n} + 1) \\cdot ${k}$。`],
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
    point(
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
          [`Multiply by $\\frac{${r1}}{${r2}}$.`, `乘以 $\\frac{${r1}}{${r2}}$。`],
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
export const numberTheoryOutlineTopics: readonly TopicDef[] = [pAdicNumbers, ellipticCurves, curveAddition];

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
