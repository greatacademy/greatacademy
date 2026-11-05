// More of Complex Analysis: power series on discs, complex trigonometric functions and powers,
// integral bounds, winding numbers, zeros, Laurent series on annuli, the argument principle,
// real integrals by residues, cross ratios and conformal maps of regions.

import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { Point } from "@ga/subject-math";
import { plane, Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same, topic } from "../university-kit.ts";

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
        "A complex power series $\\sum c_n (z - a)^n$ converges on a disc about its center $a$ and diverges outside it. When the ratio $|c_{n+1} / c_n|$ tends to a limit $L$, the radius is $R = 1 / L$. A growing coefficient makes the disc small, and a shrinking coefficient makes it large.",
        "复幂级数 $\\sum c_n (z - a)^n$ 在以 $a$ 为圆心的圆盘内收敛，在圆盘外发散。当 $|c_{n+1} / c_n|$ 趋于极限 $L$ 时，半径 $R = 1 / L$。系数增长会使圆盘变小，系数缩小会使圆盘变大。",
      ],
      (rng) => {
        const p = rng.int(2, 9);
        const q = rng.int(1, 9);
        const grow = rng.bool();
        const coefficient = grow ? `${p}^n` : `\\frac{1}{${p}^n}`;
        const answer = grow ? Q.of(1, p) : Q.of(p, 1);
        return ask(
          [
            `What is the radius of convergence of $\\sum_{n \\ge 0} ${coefficient} (z - ${q})^n$?`,
            `$\\sum_{n \\ge 0} ${coefficient} (z - ${q})^n$ 的收敛半径是多少？`,
          ],
          answer,
          [grow ? p : Q.of(1, p), q, 1],
          [
            `The ratio of consecutive coefficients is ${grow ? `$${p}$` : `$\\frac{1}{${p}}$`}, so the radius is its reciprocal, $${answer.toLatex()}$. The center does not affect the radius.`,
            `相邻系数之比是${grow ? `$${p}$` : `$\\frac{1}{${p}}$`}，所以半径是它的倒数 $${answer.toLatex()}$。圆心不影响半径。`,
          ],
        );
      },
    ),
    point(
      "a-point-against-the-disc",
      ["A point against the disc", "判断点与圆盘的关系"],
      [
        "To decide whether a series with center $a$ and radius $R$ converges at a point, compare the distance from the point to $a$ with $R$. A smaller distance means convergence and a larger one means divergence. On the circle itself the radius alone decides nothing, and each point needs its own test.",
        "要判断圆心为 $a$、半径为 $R$ 的级数在某点是否收敛，就比较这一点到 $a$ 的距离和 $R$。距离较小则收敛，较大则发散。在圆周上，只看半径无法判断，每个点要单独检验。",
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
        const correct = d < r ? inside : d > r ? outside : edge;
        const name = complexName(ax, ay);
        const target = complexName(x, y);
        return choose(
          rng,
          [
            `A power series has center $${name}$ and radius of convergence ${r}. What can be said at $z = ${target}$?`,
            `一个幂级数的圆心是 $${name}$，收敛半径是 ${r}。在 $z = ${target}$ 处可以得出什么结论？`,
          ],
          correct,
          [inside, outside, edge, ["It converges everywhere", "处处收敛"]],
          [
            `The distance from the center is $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$, compared with the radius ${r}.`,
            `到圆心的距离是 $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$，再与半径 ${r} 比较。`,
          ],
        );
      },
    ),
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
        "The formula $\\cos z = \\frac{1}{2} (e^{iz} + e^{-iz})$ defines cosine for every complex $z$. On the imaginary axis it gives $\\cos(iy) = \\cosh y$, a real number that can be as large as you like. So the bound $|\\cos z| \\le 1$ from real trigonometry fails in the complex plane.",
        "公式 $\\cos z = \\frac{1}{2} (e^{iz} + e^{-iz})$ 对每个复数 $z$ 定义了余弦。在虚轴上它给出 $\\cos(iy) = \\cosh y$，这是可以任意大的实数。所以实三角函数的界 $|\\cos z| \\le 1$ 在复平面上不再成立。",
      ],
      (rng) => {
        const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
        const m = rng.int(1, 5);
        const lead = m === 1 ? "" : `${m} `;
        const answer = Q.of(m * (k * k + 1), 2 * k);
        return ask(
          [`What is $${lead}\\cos(i \\ln ${k})$?`, `$${lead}\\cos(i \\ln ${k})$ 是多少？`],
          answer,
          [Q.of(m * (k * k - 1), 2 * k), Q.of(m * (k + 1), 2), Q.of(m, k), m * k],
          [
            `$e^{i \\cdot i \\ln ${k}} = e^{-\\ln ${k}} = \\frac{1}{${k}}$ and the other term is ${k}. Their average is $\\frac{1}{2} \\left( ${k} + \\frac{1}{${k}} \\right) = ${Q.of(k * k + 1, 2 * k).toLatex()}$${m === 1 ? "" : `, and the coefficient ${m} makes it $${answer.toLatex()}$`}.`,
            `$e^{i \\cdot i \\ln ${k}} = e^{-\\ln ${k}} = \\frac{1}{${k}}$，另一项是 ${k}。它们的平均值是 $\\frac{1}{2} \\left( ${k} + \\frac{1}{${k}} \\right) = ${Q.of(k * k + 1, 2 * k).toLatex()}$${m === 1 ? "" : `，乘上系数 ${m} 得 $${answer.toLatex()}$`}。`,
          ],
        );
      },
    ),
    point(
      "sine-of-an-imaginary-number",
      ["Sine of an imaginary number", "纯虚数的正弦"],
      [
        "From $\\sin z = \\frac{1}{2i} (e^{iz} - e^{-iz})$ we get $\\sin(iy) = i \\sinh y$, which is purely imaginary. Its modulus is $|\\sinh y|$, and it grows without limit as $y$ moves away from zero. Combined with the addition formula this gives the size of sine at any complex point.",
        "由 $\\sin z = \\frac{1}{2i} (e^{iz} - e^{-iz})$ 得 $\\sin(iy) = i \\sinh y$，它是纯虚数。它的模是 $|\\sinh y|$，当 $y$ 远离零时无限增大。再结合和角公式，就能得到正弦在任意复数点的大小。",
      ],
      (rng) => {
        const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
        const m = rng.int(1, 5);
        const lead = m === 1 ? "" : `${m} `;
        const answer = Q.of(m * (k * k - 1), 2 * k);
        return ask(
          [`What is $${lead}|\\sin(i \\ln ${k})|$?`, `$${lead}|\\sin(i \\ln ${k})|$ 是多少？`],
          answer,
          [Q.of(m * (k * k + 1), 2 * k), Q.of(m * (k - 1), 2), m, m * k],
          [
            `$\\sin(iy) = i \\sinh y$ with $y = \\ln ${k}$, and $\\sinh(\\ln ${k}) = \\frac{1}{2} \\left( ${k} - \\frac{1}{${k}} \\right) = ${Q.of(k * k - 1, 2 * k).toLatex()}$. The factor $i$ has modulus 1${m === 1 ? "" : `, and the coefficient ${m} makes it $${answer.toLatex()}$`}.`,
            `$\\sin(iy) = i \\sinh y$，其中 $y = \\ln ${k}$，而 $\\sinh(\\ln ${k}) = \\frac{1}{2} \\left( ${k} - \\frac{1}{${k}} \\right) = ${Q.of(k * k - 1, 2 * k).toLatex()}$。因子 $i$ 的模是 1${m === 1 ? "" : `，乘上系数 ${m} 得 $${answer.toLatex()}$`}。`,
          ],
        );
      },
    ),
    point(
      "zeros-of-sine-and-cosine",
      ["Zeros of sine and cosine", "正弦和余弦的零点"],
      [
        "Although complex sine and cosine are unbounded, they gain no new zeros. Solving $\\sin z = 0$ gives $e^{2iz} = 1$, and so $z = n \\pi$ with $n$ an integer, exactly the real zeros. The zeros of cosine are likewise only the points $\\frac{\\pi}{2} + n \\pi$ on the real axis.",
        "复正弦和复余弦虽然无界，却没有新的零点。解 $\\sin z = 0$ 得 $e^{2iz} = 1$，所以 $z = n \\pi$（$n$ 为整数），恰好是实零点。余弦的零点同样只有实轴上的 $\\frac{\\pi}{2} + n \\pi$。",
      ],
      (rng) => {
        const useSine = rng.bool();
        const [lo, hi] = [rng.int(2, 4), rng.int(5, 9)];
        const count = useSine ? hi - lo + 1 : hi - lo;
        const name = useSine ? "\\sin z" : "\\cos z";
        return ask(
          [
            `How many zeros does $${name}$ have in the rectangle $${lo} \\pi - \\frac{\\pi}{4} < \\operatorname{Re} z < ${hi} \\pi + \\frac{\\pi}{4}$, $|\\operatorname{Im} z| < 100$?`,
            `$${name}$ 在矩形 $${lo} \\pi - \\frac{\\pi}{4} < \\operatorname{Re} z < ${hi} \\pi + \\frac{\\pi}{4}$，$|\\operatorname{Im} z| < 100$ 内有多少个零点？`,
          ],
          count,
          [count + 1, count - 1, 2 * count, hi - lo + 2],
          [
            `All zeros of $${name}$ are real, so the size of the imaginary range does not matter. The zeros in this range are ${useSine ? `$n \\pi$ for $n$ from ${lo} to ${hi}` : `$\\frac{\\pi}{2} + n \\pi$ for $n$ from ${lo} to ${hi - 1}`}, which makes ${count}.`,
            `$${name}$ 的零点都是实数，所以虚部的范围多大都没有关系。这个范围内的零点是${useSine ? `$n \\pi$（$n$ 从 ${lo} 到 ${hi}）` : `$\\frac{\\pi}{2} + n \\pi$（$n$ 从 ${lo} 到 ${hi - 1}）`}，共 ${count} 个。`,
          ],
        );
      },
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
        "A complex power is defined by $z^c = e^{c \\log z}$. The principal value uses the principal logarithm, with the argument in $(-\\pi, \\pi]$. Since the logarithm has many values, so does the power in general, and even $i^i$ turns out to be a real number: its principal value is $e^{-\\pi / 2}$.",
        "复数幂定义为 $z^c = e^{c \\log z}$。主值使用主对数，辐角取在 $(-\\pi, \\pi]$ 内。由于对数有多个值，幂一般也有多个值，甚至 $i^i$ 也是实数：它的主值是 $e^{-\\pi / 2}$。",
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
        return choose(
          rng,
          [`What is the principal value of $${base.show}^{${exponentName}}$?`, `$${base.show}^{${exponentName}}$ 的主值是多少？`],
          same(write(exponent)),
          [same(write(exponent.neg())), same(write(exponent.mul(Q.of(2, 1)))), same(write(exponent.add(Q.of(2, 1))))],
          [
            `The principal logarithm of $${base.en}$ is $${piTimes(base.arg)} i$. Multiplying by $${exponentName}$ gives $${piTimes(exponent)}$, the exponent of $e$.`,
            `$${base.en}$ 的主对数是 $${piTimes(base.arg)} i$。乘 $${exponentName}$ 得 $${piTimes(exponent)}$，这就是 $e$ 的指数。`,
          ],
        );
      },
    ),
    point(
      "how-many-values-a-power-has",
      ["How many values a power has", "幂有多少个值"],
      [
        "Different arguments of $z$ differ by multiples of $2 \\pi$, which changes $c \\log z$ by multiples of $2 \\pi i c$. If $c$ is an integer, every value is the same. If $c = p / q$ in lowest terms, there are exactly $q$ values. If $c$ is irrational or not real, there are infinitely many.",
        "$z$ 的不同辐角相差 $2 \\pi$ 的倍数，这使 $c \\log z$ 相差 $2 \\pi i c$ 的倍数。若 $c$ 是整数，所有值都相同。若 $c = p / q$ 是最简分数，恰有 $q$ 个值。若 $c$ 是无理数或非实数，则有无穷多个值。",
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
        const correct: Pair = kind === 0 ? same("1") : kind === 1 ? same(String(q)) : many;
        return choose(
          rng,
          [
            `How many distinct values does $${z}^{${c}}$ have as a multivalued complex power?`,
            `作为多值复数幂，$${z}^{${c}}$ 有多少个不同的值？`,
          ],
          correct,
          [same("1"), same(String(q)), same(String(p + q)), many],
          [
            kind === 0
              ? "The exponent is an integer, so changing the argument by $2 \\pi$ changes the exponent of $e$ by a multiple of $2 \\pi i$, which changes nothing."
              : kind === 1
                ? `In lowest terms the denominator is ${q}, and the values repeat after ${q} turns around the origin.`
                : "The exponent is not real, so each extra turn multiplies the value by a real number other than 1, and the values never repeat.",
            kind === 0
              ? "指数是整数，所以辐角改变 $2 \\pi$ 时，$e$ 的指数改变 $2 \\pi i$ 的倍数，值不变。"
              : kind === 1
                ? `最简分数的分母是 ${q}，绕原点 ${q} 圈后值开始重复。`
                : "指数不是实数，所以每多绕一圈，值就乘一个不等于 1 的实数，这些值永不重复。",
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
        "If $|f(z)| \\le M$ everywhere on a path of length $L$, then the integral of $f$ along it has modulus at most $ML$. The estimate needs no antiderivative, and it is the main tool for showing that integrals over large arcs vanish as the radius grows.",
        "如果在长度为 $L$ 的路径上处处有 $|f(z)| \\le M$，那么 $f$ 沿路径的积分的模不超过 $ML$。这个估计不需要原函数，是证明大圆弧上的积分随半径增大而趋于零的主要工具。",
      ],
      (rng) => {
        const [dx, dy, d] = rng.pick([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
          [8, 15, 17],
        ] as const);
        const m = rng.int(2, 9);
        return ask(
          [
            `On the straight segment from 0 to $${dx} + ${dy}i$, a function satisfies $|f(z)| \\le ${m}$. What upper bound does the ML inequality give for the modulus of its integral along the segment?`,
            `在从 0 到 $${dx} + ${dy}i$ 的线段上，函数满足 $|f(z)| \\le ${m}$。ML 不等式给出的这段积分的模的上界是多少？`,
          ],
          m * d,
          [m * (dx + dy), m, d, m + d],
          [
            `The segment has length $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$, so the bound is $${m} \\cdot ${d} = ${m * d}$.`,
            `线段长度是 $\\sqrt{${dx}^2 + ${dy}^2} = ${d}$，所以上界是 $${m} \\cdot ${d} = ${m * d}$。`,
          ],
        );
      },
    ),
    point(
      "a-bound-on-a-circle",
      ["A bound on a circle", "圆周上的界"],
      [
        "On the circle $|z| = R$ a fraction can be bounded using the triangle inequality: the numerator has size at most the sum of the sizes of its terms, and the denominator $|z^2 - a|$ has size at least $R^2 - |a|$. Then multiply by the circumference $2 \\pi R$ to bound the integral.",
        "在圆周 $|z| = R$ 上可以用三角不等式估计分式：分子不超过各项模之和，分母 $|z^2 - a|$ 至少是 $R^2 - |a|$。再乘周长 $2 \\pi R$，就得到积分的上界。",
      ],
      (rng) => {
        const r = rng.int(2, 6);
        const a = rng.int(1, r * r - 1);
        const b = rng.int(1, 9);
        const low = r * r - a;
        const answer = Q.of(b * 2 * r, low);
        const size = Q.of(b, low).toLatex();
        return ask(
          [
            `For the integral of $\\frac{${b}}{z^2 + ${a}}$ around $|z| = ${r}$, the ML inequality gives a bound of the form $k \\pi$. What is $k$, using $|z^2 + ${a}| \\ge ${r}^2 - ${a}$?`,
            `对 $\\frac{${b}}{z^2 + ${a}}$ 沿 $|z| = ${r}$ 的积分，ML 不等式给出 $k \\pi$ 形式的上界。利用 $|z^2 + ${a}| \\ge ${r}^2 - ${a}$，$k$ 是多少？`,
          ],
          answer,
          [Q.of(b * r, low), Q.of(b * 2 * r, r * r + a), Q.of(b, low), 2 * r],
          [
            `On the circle the size is at most $M = ${size}$, and the length is $L = ${2 * r} \\pi$. So $k = ${size} \\cdot ${2 * r} = ${answer.toLatex()}$.`,
            `圆周上函数的模不超过 $M = ${size}$，长度是 $L = ${2 * r} \\pi$。所以 $k = ${size} \\cdot ${2 * r} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

/** windingCase draws a curve with an inner loop, and marks a point around which it winds a known number of times. */
function windingCase(rng: Rng): { readonly winding: number; readonly figure: Figure; readonly name: string } {
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
  return { winding: clockwise ? -spot.turns : spot.turns, figure, name: `(${spot.at[0] + h}, ${spot.at[1] + k})` };
}

const windingNumbers = topic(
  "winding-numbers",
  ["Winding Numbers", "环绕数"],
  ["Count how many times a closed path turns around a point.", "数闭路径绕一点转了几圈。"],
  ["cauchys-integral-theorem"],
  [],
  [
    point(
      "reading-a-winding-number",
      ["Reading a winding number", "读环绕数"],
      [
        "The winding number of a closed path about a point counts its net turns around that point, positive for counterclockwise and negative for clockwise. To read it, draw a ray from the point to far away and add one for each crossing going counterclockwise, and subtract one for each going clockwise. It is zero far from the curve.",
        "闭路径绕一点的环绕数是它绕该点的净圈数，逆时针为正，顺时针为负。读法是：从这一点向远处画一条射线，每次逆时针穿过加一，顺时针穿过减一。远离曲线的点环绕数为零。",
      ],
      (rng) => {
        const { winding, figure } = windingCase(rng);
        return ask(
          [
            "What is the winding number of the curve about the point $P$, in the direction shown?",
            "按图中方向，曲线绕点 $P$ 的环绕数是多少？",
          ],
          winding,
          [-winding, winding + 1, winding - 1, 3],
          [
            `A ray from $P$ crosses the curve with net count $${winding}$: the inner loop is wound twice, the outer region once, and the outside not at all, with the sign set by the arrow.`,
            `从 $P$ 出发的射线穿过曲线的净次数是 $${winding}$：内环区域绕两圈，外环区域绕一圈，外部不绕，符号由箭头决定。`,
          ],
          figure,
        );
      },
    ),
    point(
      "the-integral-of-a-simple-pole",
      ["The integral of a simple pole", "单极点的积分"],
      [
        "The integral of $\\frac{1}{z - a}$ around a closed path that avoids $a$ equals $2 \\pi i$ times the winding number of the path about $a$. A path may therefore pass around the pole several times, or not at all, and the integral records this count exactly.",
        "$\\frac{1}{z - a}$ 沿不经过 $a$ 的闭路径的积分，等于 $2 \\pi i$ 乘路径绕 $a$ 的环绕数。路径可以绕极点多圈，也可以不绕，积分准确地记下这个次数。",
      ],
      (rng) => {
        const { winding, figure, name } = windingCase(rng);
        return ask(
          [
            `The integral of $\\frac{1}{z - a}$ along the curve, where $a$ is the point $P$, equals $k \\pi i$. What is $k$?`,
            `$\\frac{1}{z - a}$ 沿曲线的积分等于 $k \\pi i$，其中 $a$ 是点 $P$。$k$ 是多少？`,
          ],
          2 * winding,
          [winding, -2 * winding, 2 * winding + 2, 2 * winding - 2],
          [
            `The point ${name} has winding number ${winding}, and the integral is $2 \\pi i$ times that, so $k = ${2 * winding}$.`,
            `点 ${name} 的环绕数是 ${winding}，积分是它的 $2 \\pi i$ 倍，所以 $k = ${2 * winding}$。`,
          ],
          figure,
        );
      },
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
        "A zero of an analytic function has order $m$ if the first $m$ Taylor coefficients at that point vanish and the next does not. Equivalently, the function is $(z - a)^m$ times an analytic function that is not zero at $a$. Products add orders, so factor where you can.",
        "解析函数的零点阶数为 $m$，是指该点处前 $m$ 个泰勒系数为零，下一个不为零。等价地说，函数是 $(z - a)^m$ 乘一个在 $a$ 处不为零的解析函数。乘积的阶数相加，所以能分解时先分解。",
      ],
      (rng) => {
        const j = rng.int(1, 9);
        const [factor, extra] = rng.pick([
          ["\\sin z", 1],
          ["(1 - \\cos z)", 2],
          ["(e^z - 1)", 1],
          ["(z - \\sin z)", 3],
          ["(e^z - 1 - z)", 2],
        ] as const);
        const body = `${power("z", j)} ${factor}`;
        const answer = j + extra;
        return ask(
          [`What is the order of the zero of $${body}$ at $z = 0$?`, `$${body}$ 在 $z = 0$ 处零点的阶是多少？`],
          answer,
          [j, extra, answer + 1, j * extra + 2],
          [
            `$${power("z", j)}$ has a zero of order ${j}, and the Taylor series of the other factor starts with a term of degree ${extra}. Orders add in a product, so the order is ${answer}.`,
            `$${power("z", j)}$ 有 ${j} 阶零点，另一个因子的泰勒级数首项次数是 ${extra}。乘积的阶数相加，所以阶是 ${answer}。`,
          ],
        );
      },
    ),
    point(
      "applying-the-identity-theorem",
      ["Applying the identity theorem", "应用唯一性定理"],
      [
        "The zeros of a nonzero analytic function are isolated. So if two analytic functions on a connected region agree on a set with a limit point inside the region, they agree everywhere there. Agreement on a segment or a convergent sequence decides the whole function, which is why real identities extend to the plane.",
        "非零解析函数的零点是孤立的。所以如果两个解析函数在连通区域内，在一个以区域内点为极限点的集合上相等，它们就处处相等。在一条线段或一个收敛序列上相等就决定了整个函数，所以实恒等式能推广到复平面。",
      ],
      (rng) => {
        const n = rng.int(2, 9);
        const c = rng.int(2, 9);
        const rule = rng.pick(["\\frac{1}{n}", "\\frac{1}{n^2}"]);
        return ask(
          [
            `An entire function satisfies $f(${rule}) = ${c} \\cdot ${rule}$ for every positive integer $n$. What is $f(${n})$?`,
            `一个整函数对每个正整数 $n$ 都满足 $f(${rule}) = ${c} \\cdot ${rule}$。$f(${n})$ 是多少？`,
          ],
          c * n,
          [c, n, c + n, Q.of(c, n)],
          [
            `The points $${rule}$ tend to 0, which lies inside the plane. So $f(z)$ and $${c}z$ agree on a set with a limit point, and they are the same function. Hence $f(${n}) = ${c * n}$.`,
            `点 $${rule}$ 趋于 0，而 0 在复平面内。所以 $f(z)$ 和 $${c}z$ 在有极限点的集合上相等，它们是同一个函数。因此 $f(${n}) = ${c * n}$。`,
          ],
        );
      },
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
    point(
      "counting-the-regions-of-expansion",
      ["Counting the regions of expansion", "数展开的区域"],
      [
        "A rational function has a different Laurent series about a center on each annulus bounded by its poles. If the poles lie at several distinct distances from the center, these circles split the plane into one disc, some annuli, and one outer region. The same function has one expansion on each.",
        "有理函数在以极点为界的每个圆环上，都有一个不同的洛朗级数。如果极点到中心有若干个不同的距离，这些圆周就把平面分成一个圆盘、一些圆环和一个外部区域。同一个函数在每个区域上各有一个展开式。",
      ],
      (rng) => {
        const a = rng.int(1, 3);
        const b = a + rng.int(1, 3);
        const c = b + rng.int(1, 3);
        const three = rng.bool();
        const body = three ? `(z - ${a})(z + ${b})(z - ${c})` : `(z - ${a})(z + ${b})`;
        const count = three ? 4 : 3;
        return ask(
          [
            `How many different Laurent series about $z = 0$ does $\\frac{1}{${body}}$ have, one for each region of convergence?`,
            `$\\frac{1}{${body}}$ 在 $z = 0$ 处有多少个不同的洛朗级数（每个收敛区域一个）？`,
          ],
          count,
          [count - 1, count + 1, 2],
          [
            `The poles lie at ${three ? `${count - 1} different distances` : "two different distances"} from 0. Those circles split the plane into ${count} regions, each with its own series.`,
            `极点到 0 有 ${count - 1} 个不同的距离。这些圆周把平面分成 ${count} 个区域，每个区域有自己的级数。`,
          ],
        );
      },
    ),
    point(
      "a-coefficient-outside-the-pole",
      ["A coefficient outside the pole", "极点外部的系数"],
      [
        "For $|z| > |a|$ expand in powers of $a / z$: $\\frac{1}{z - a} = \\frac{1}{z} \\cdot \\frac{1}{1 - a / z} = \\sum_{n \\ge 0} \\frac{a^n}{z^{n+1}}$. Outside the pole all the powers are negative. The geometric series about $z = 0$ that works inside would diverge in this region.",
        "当 $|z| > |a|$ 时，按 $a / z$ 的幂展开：$\\frac{1}{z - a} = \\frac{1}{z} \\cdot \\frac{1}{1 - a / z} = \\sum_{n \\ge 0} \\frac{a^n}{z^{n+1}}$。在极点外部，幂次全是负的。在内部适用的几何级数在这个区域会发散。",
      ],
      (rng) => {
        const a = rng.int(2, 5);
        const k = rng.int(2, 5);
        const sign = rng.pick([1, -1]);
        const center = sign > 0 ? `z - ${a}` : `z + ${a}`;
        const answer = (sign * a) ** (k - 1);
        const base = sign > 0 ? String(a) : `(-${a})`;
        return ask(
          [
            `In the Laurent series of $\\frac{1}{${center}}$ valid for $|z| > ${a}$, what is the coefficient of $\\frac{1}{z^{${k}}}$?`,
            `$\\frac{1}{${center}}$ 在 $|z| > ${a}$ 上的洛朗级数中，$\\frac{1}{z^{${k}}}$ 的系数是多少？`,
          ],
          answer,
          [(sign * a) ** k, Q.of(1, a ** k), -answer, a * (k - 1)],
          [
            `Each term of the series has the form $\\frac{${base}^n}{z^{n+1}}$. For $z^{-${k}}$ take $n = ${k - 1}$, which gives ${k === 2 ? `$${answer}$` : `$${power(base, k - 1)} = ${answer}$`}.`,
            `级数的每一项形如 $\\frac{${base}^n}{z^{n+1}}$。对 $z^{-${k}}$ 取 $n = ${k - 1}$，得 ${k === 2 ? `$${answer}$` : `$${power(base, k - 1)} = ${answer}$`}。`,
          ],
        );
      },
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
        "The integral of $f' / f$ around a closed contour, divided by $2 \\pi i$, equals the number of zeros inside minus the number of poles inside, each counted with multiplicity. Equivalently, the image of the contour under $f$ winds around the origin exactly that number of times.",
        "$f' / f$ 沿闭围道的积分除以 $2 \\pi i$，等于围道内的零点数减极点数，都按重数计算。等价地说，围道在 $f$ 下的像绕原点恰好转这么多圈。",
      ],
      (rng) => {
        const [m, n] = [rng.int(1, 5), rng.int(1, 5)];
        const a = rng.int(1, 3);
        const b = rng.int(5, 8);
        const r = rng.int(a + 1, 4);
        const outsideOrder = rng.int(1, 3);
        const answer = m - n;
        const f = `\\frac{${power(`(z - ${a})`, m)} ${power(`(z - ${b})`, outsideOrder)}}{${power("z", n)}}`;
        return ask(
          [
            `Let $f(z) = ${f}$. What is $\\frac{1}{2 \\pi i} \\oint_{|z| = ${r}} \\frac{f'(z)}{f(z)} \\, dz$?`,
            `设 $f(z) = ${f}$。$\\frac{1}{2 \\pi i} \\oint_{|z| = ${r}} \\frac{f'(z)}{f(z)} \\, dz$ 是多少？`,
          ],
          answer,
          [m + n, m + outsideOrder - n, n - m, m],
          [
            `Inside the circle, $f$ has a zero of order ${m} at ${a} and a pole of order ${n} at 0. The zero at ${b} is outside. So the integral counts $${m} - ${n} = ${answer}$.`,
            `圆内 $f$ 在 ${a} 处有 ${m} 阶零点，在 0 处有 ${n} 阶极点。${b} 处的零点在圆外。所以积分等于 $${m} - ${n} = ${answer}$。`,
          ],
        );
      },
    ),
    point(
      "counting-with-rouches-theorem",
      ["Counting with Rouché's theorem", "用儒歇定理计数"],
      [
        "Rouché's theorem says that if $|g| < |f|$ everywhere on a contour, then $f$ and $f + g$ have the same number of zeros inside. To use it, pick the term of a polynomial that dominates on the circle and count the zeros of that term alone, which is usually very easy.",
        "儒歇定理说：如果在围道上处处有 $|g| < |f|$，那么 $f$ 和 $f + g$ 在围道内的零点数相同。使用时，选出多项式中在圆周上占优的那一项，只数它的零点，这通常很容易。",
      ],
      (rng) => {
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
        const others = a === 1 ? `2^{${low}} + 1` : `2 \\cdot 2^{${low}} + 1`;
        return ask(
          [
            `How many zeros, counted with multiplicity, does $${poly}$ have in the disc $|z| < ${r}$?`,
            `$${poly}$ 在圆盘 $|z| < ${r}$ 内有多少个零点（按重数计）？`,
          ],
          dominant,
          [high, low, 0, high + low].filter((v) => v !== dominant),
          [
            big
              ? `On $|z| = 2$, the term $${highTerm}$ has size $2^{${high}}$, which exceeds $${others}$, the most the other terms can reach. So there are as many zeros as $${highTerm}$ has inside: ${high}.`
              : `On $|z| = 1$, the term $${coefficient} ${lowTerm}$ has size ${coefficient}, which exceeds 2, the most the other terms can reach. So there are as many zeros as $${lowTerm}$ has inside: ${low}.`,
            big
              ? `在 $|z| = 2$ 上，$${highTerm}$ 的模是 $2^{${high}}$，大于其他项模之和的最大值 $${others}$。所以零点个数与 $${highTerm}$ 在圆内的零点数相同，是 ${high}。`
              : `在 $|z| = 1$ 上，$${coefficient} ${lowTerm}$ 的模是 ${coefficient}，大于其他项模之和的最大值 2。所以零点个数与 $${lowTerm}$ 在圆内的零点数相同，是 ${low}。`,
          ],
        );
      },
    ),
  ],
);

const trigIntegrals = topic(
  "trigonometric-integrals-by-residues",
  ["Trigonometric Integrals by Residues", "用留数求三角积分"],
  ["Turn an integral over a period into a contour integral around the unit circle.", "把一个周期上的积分变为单位圆上的围道积分。"],
  ["the-residue-theorem"],
  [],
  [
    point(
      "substituting-on-the-unit-circle",
      ["Substituting on the unit circle", "在单位圆上代换"],
      [
        "Put $z = e^{i \\theta}$. Then $d\\theta = \\frac{dz}{iz}$, $\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$ and $\\sin \\theta = \\frac{1}{2i} (z - \\frac{1}{z})$, and an integral from 0 to $2 \\pi$ becomes an integral around $|z| = 1$. A rational function of cosine and sine thus becomes a rational function of $z$.",
        "令 $z = e^{i \\theta}$。于是 $d\\theta = \\frac{dz}{iz}$，$\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$，$\\sin \\theta = \\frac{1}{2i} (z - \\frac{1}{z})$，从 0 到 $2 \\pi$ 的积分就变成沿 $|z| = 1$ 的积分。余弦和正弦的有理函数于是变成 $z$ 的有理函数。",
      ],
      (rng) => {
        const a = rng.int(2, 12);
        const b = rng.int(1, 9) * 2;
        const half = b / 2;
        const bHalf = half === 1 ? "" : `${half} `;
        return choose(
          rng,
          [
            `With $z = e^{i \\theta}$, what does $${a} + ${b} \\cos \\theta$ become?`,
            `令 $z = e^{i \\theta}$，$${a} + ${b} \\cos \\theta$ 变成什么？`,
          ],
          same(`${a} + ${bHalf}z + \\frac{${half}}{z}`),
          [same(`${a} + ${b} z + \\frac{${b}}{z}`), same(`${a} + ${bHalf}z - \\frac{${half}}{z}`), same(`${a} + ${b} z`)],
          [
            `Since $\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$, the term $${b} \\cos \\theta$ becomes $${half === 1 ? "" : `${half} `}\\left( z + \\frac{1}{z} \\right)$.`,
            `因为 $\\cos \\theta = \\frac{1}{2} (z + \\frac{1}{z})$，所以 $${b} \\cos \\theta$ 变成 $${half === 1 ? "" : `${half} `}\\left( z + \\frac{1}{z} \\right)$。`,
          ],
        );
      },
    ),
    point(
      "the-classic-period-integral",
      ["The classic period integral", "经典的周期积分"],
      [
        "For $a > |b|$, the substitution and one residue give $\\int_0^{2\\pi} \\frac{d\\theta}{a + b \\cos \\theta} = \\frac{2\\pi}{\\sqrt{a^2 - b^2}}$. Only the pole inside the unit circle counts. The result has a simple check: when $b = 0$ the integrand is the constant $1 / a$, and the formula gives $2 \\pi / a$.",
        "当 $a > |b|$ 时，代换加一个留数给出 $\\int_0^{2\\pi} \\frac{d\\theta}{a + b \\cos \\theta} = \\frac{2\\pi}{\\sqrt{a^2 - b^2}}$。只有单位圆内的极点起作用。结果可以简单检验：$b = 0$ 时被积函数是常数 $1 / a$，公式给出 $2 \\pi / a$。",
      ],
      (rng) => {
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
        return ask(
          [
            `The integral $\\int_0^{2\\pi} \\frac{${top}}{${p} + ${q} \\cos \\theta}$ equals $k \\pi$. What is $k$?`,
            `积分 $\\int_0^{2\\pi} \\frac{${top}}{${p} + ${q} \\cos \\theta}$ 等于 $k \\pi$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(m, r), Q.of(2 * m, p), Q.of(2 * m, p + q), Q.of(4 * m, r)],
          [
            `Here $\\sqrt{${p}^2 - ${q}^2} = ${r}$, so the integral is $${m === 1 ? "" : `${m} \\cdot `}\\frac{2 \\pi}{${r}}$, and $k = ${answer.toLatex()}$.`,
            `这里 $\\sqrt{${p}^2 - ${q}^2} = ${r}$，所以积分是 $${m === 1 ? "" : `${m} \\cdot `}\\frac{2 \\pi}{${r}}$，$k = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

const improper = topic(
  "improper-integrals-by-residues",
  ["Improper Integrals by Residues", "用留数求反常积分"],
  ["Close the contour in the half-plane where the integrand dies away.", "在被积函数衰减的半平面内闭合围道。"],
  ["the-residue-theorem", "the-ml-inequality"],
  [],
  [
    point(
      "poles-in-the-upper-half-plane",
      ["Poles in the upper half-plane", "上半平面的极点"],
      [
        "To integrate a rational function over the real line, close the path with a large semicircle above the axis. The arc contributes nothing when the denominator has degree at least two more than the numerator, and so the integral is $2 \\pi i$ times the residues at the poles in the upper half-plane only.",
        "要在实轴上积分有理函数，就用上方的大半圆闭合路径。分母次数比分子至少高二时，圆弧的贡献为零，所以积分等于 $2 \\pi i$ 乘上半平面内极点的留数之和，只算这些极点。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const m = rng.int(1, 9);
        const answer = Q.of(m, a);
        return ask(
          [
            `The integral $\\int_{-\\infty}^{\\infty} \\frac{${m}}{x^2 + ${a * a}} \\, dx$ equals $k \\pi$. What is $k$?`,
            `积分 $\\int_{-\\infty}^{\\infty} \\frac{${m}}{x^2 + ${a * a}} \\, dx$ 等于 $k \\pi$。$k$ 是多少？`,
          ],
          answer,
          [Q.of(2 * m, a), Q.of(m, a * a), Q.of(m, 2 * a), m],
          [
            `The only pole above the axis is $${imaginaryName(a)}$, with residue $\\frac{${m}}{${2 * a}i}$. Multiplying by $2 \\pi i$ gives $${piTimes(answer)}$, so $k = ${answer.toLatex()}$.`,
            `实轴上方唯一的极点是 $${imaginaryName(a)}$，留数是 $\\frac{${m}}{${2 * a}i}$。乘 $2 \\pi i$ 得 $${piTimes(answer)}$，所以 $k = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "an-integral-with-a-cosine",
      ["An integral with a cosine", "含余弦的积分"],
      [
        "For an integrand with $\\cos kx$, use $e^{ikz}$ instead and take the real part at the end, because cosine itself grows off the real axis. With $k > 0$, $e^{ikz}$ decays in the upper half-plane, so by Jordan's lemma the arc vanishes and the upper half-plane is the right place to close.",
        "被积函数含 $\\cos kx$ 时，要改用 $e^{ikz}$，最后取实部，因为余弦本身离开实轴后会增长。当 $k > 0$ 时，$e^{ikz}$ 在上半平面衰减，由若尔当引理圆弧的贡献为零，所以应在上半平面闭合。",
      ],
      (rng) => {
        const a = rng.int(1, 6);
        const k = rng.int(1, 6);
        const decay = power("e", -k * a);
        const correct = `${piOver(a)} ${decay}`;
        const frequency = k === 1 ? "x" : `${k}x`;
        const pole = imaginaryName(a);
        return choose(
          rng,
          [
            `What is $\\int_{-\\infty}^{\\infty} \\frac{\\cos ${frequency}}{x^2 + ${a * a}} \\, dx$?`,
            `$\\int_{-\\infty}^{\\infty} \\frac{\\cos ${frequency}}{x^2 + ${a * a}} \\, dx$ 是多少？`,
          ],
          same(correct),
          [
            same(`${piOver(a)} ${power("e", k * a)}`),
            same(piOver(a)),
            same(`${a === 1 ? "2 \\pi" : `\\frac{2 \\pi}{${a}}`} ${decay}`),
            same(`\\frac{\\pi}{${2 * a}} ${decay}`),
          ],
          [
            `At the pole $${pole}$, the function $\\frac{e^{${frequency === "x" ? "i" : `${k}i`} z}}{z^2 + ${a * a}}$ has residue $\\frac{${decay}}{${2 * a}i}$. Multiplying by $2 \\pi i$ gives $${correct}$. This is real, so it is the value of the cosine integral.`,
            `在极点 $${pole}$ 处，函数 $\\frac{e^{${frequency === "x" ? "i" : `${k}i`} z}}{z^2 + ${a * a}}$ 的留数是 $\\frac{${decay}}{${2 * a}i}$。乘 $2 \\pi i$ 得 $${correct}$。它是实数，所以就是余弦积分的值。`,
          ],
        );
      },
    ),
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
        "The cross ratio of four points is $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$. Every Möbius transformation keeps it unchanged, even though it moves all four points. So three points and their images determine the transformation completely, and any fourth point follows.",
        "四个点的交比是 $(z_1, z_2; z_3, z_4) = \\frac{(z_1 - z_3)(z_2 - z_4)}{(z_1 - z_4)(z_2 - z_3)}$。每个默比乌斯变换都使它不变，尽管四个点都移动了。所以三个点及其像完全决定了变换，第四点也就确定了。",
      ],
      (rng) => {
        const points = rng.sample([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7], 4) as [number, number, number, number];
        const [a, b, c, d] = points;
        const answer = Q.of((a - c) * (b - d), (a - d) * (b - c));
        return ask(
          [`What is the cross ratio $(${a}, ${b}; ${c}, ${d})$?`, `交比 $(${a}, ${b}; ${c}, ${d})$ 是多少？`],
          answer,
          [Q.of((a - d) * (b - c), (a - c) * (b - d)), Q.of((a - b) * (c - d), (a - d) * (b - c)), answer.neg()],
          [
            `$\\frac{(${a} - ${shift(c)})(${b} - ${shift(d)})}{(${a} - ${shift(d)})(${b} - ${shift(c)})} = ${answer.toLatex()}$.`,
            `$\\frac{(${a} - ${shift(c)})(${b} - ${shift(d)})}{(${a} - ${shift(d)})(${b} - ${shift(c)})} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "what-a-mobius-map-does-to-circles",
      ["What a Möbius map does to circles", "默比乌斯变换如何作用于圆"],
      [
        "A Möbius transformation sends every line or circle to a line or circle. The image is a line exactly when the original passes through the pole of the transformation, because that point goes to infinity. For $w = 1 / z$, circles through the origin become lines and all other circles stay circles.",
        "默比乌斯变换把直线或圆映成直线或圆。当原来的直线或圆经过变换的极点时，像才是直线，因为那一点被映到无穷远。对 $w = 1 / z$，经过原点的圆变成直线，其他圆仍是圆。",
      ],
      (rng) => {
        const r = rng.int(1, 9);
        const through = rng.bool();
        const center = through ? r : r + rng.int(1, 5);
        const line: Pair = ["A line", "一条直线"];
        const circle: Pair = ["A circle", "一个圆"];
        return choose(
          rng,
          [
            `Under $w = \\frac{1}{z}$, what is the image of the circle $|z - ${center}| = ${r}$?`,
            `在 $w = \\frac{1}{z}$ 下，圆 $|z - ${center}| = ${r}$ 的像是什么？`,
          ],
          through ? line : circle,
          [through ? circle : line, ["A pair of lines", "两条直线"], ["A parabola", "一条抛物线"]],
          [
            through
              ? `The circle passes through 0, since $|0 - ${center}| = ${r}$. That point goes to infinity, so the image is a line.`
              : `The distance from 0 to the center is ${center}, which is not the radius ${r}. So the circle misses 0, and its image is a circle.`,
            through
              ? `因为 $|0 - ${center}| = ${r}$，圆经过 0。这一点被映到无穷远，所以像是直线。`
              : `0 到圆心的距离是 ${center}，不等于半径 ${r}。所以圆不经过 0，像是圆。`,
          ],
        );
      },
    ),
  ],
);

const regionMaps = topic(
  "conformal-maps-of-regions",
  ["Conformal Maps of Regions", "区域的共形映射"],
  ["Open up wedges and strips with powers and exponentials.", "用幂函数和指数函数把楔形和带形展开。"],
  ["conformal-maps", "the-complex-exponential-function"],
  [],
  [
    point(
      "opening-a-wedge",
      ["Opening a wedge", "展开楔形"],
      [
        "The map $w = z^k$ multiplies every argument by $k$, so it opens a wedge with angle $\\theta$ at the origin into a wedge with angle $k \\theta$. To send a wedge onto the upper half-plane, whose angle is $\\pi$, choose $k = \\pi / \\theta$. Conformality fails only at the corner, where the derivative vanishes.",
        "映射 $w = z^k$ 把每个辐角乘 $k$，所以它把顶点在原点、角度为 $\\theta$ 的楔形展开成角度为 $k \\theta$ 的楔形。要把楔形映到角度为 $\\pi$ 的上半平面，取 $k = \\pi / \\theta$。共形性只在角点失效，那里导数为零。",
      ],
      (rng) => {
        const denominator = rng.int(2, 12);
        const numerator = rng.pick(
          Array.from({ length: denominator - 1 }, (_, i) => i + 1).filter(
            (v) => Q.of(v, denominator).toLatex() === `\\frac{${v}}{${denominator}}`,
          ),
        );
        const answer = Q.of(denominator, numerator);
        const theta = numerator === 1 ? `\\frac{\\pi}{${denominator}}` : `\\frac{${numerator} \\pi}{${denominator}}`;
        return ask(
          [
            `The map $w = z^k$ sends the wedge $0 < \\arg z < ${theta}$ onto the upper half-plane. What is $k$?`,
            `映射 $w = z^k$ 把楔形 $0 < \\arg z < ${theta}$ 映到上半平面。$k$ 是多少？`,
          ],
          answer,
          [Q.of(numerator, denominator), 2 * denominator, denominator, Q.of(2 * denominator, numerator)],
          [
            `The angle must grow from $${theta}$ to $\\pi$, and the map multiplies angles by $k$. So $k = \\pi \\div ${theta} = ${answer.toLatex()}$.`,
            `角度要从 $${theta}$ 增大到 $\\pi$，而映射把角度乘 $k$。所以 $k = \\pi \\div ${theta} = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "opening-a-strip",
      ["Opening a strip", "展开带形"],
      [
        "The map $w = e^z$ sends the horizontal line at height $y$ to the ray at angle $y$. So a horizontal strip of height $\\pi$ goes onto a half-plane, and a taller or shorter strip goes onto a wedge. Rescaling first by $w = e^{cz}$ lets you match a strip of any height.",
        "映射 $w = e^z$ 把高度为 $y$ 的水平线映成角度为 $y$ 的射线。所以高度为 $\\pi$ 的水平带被映到半平面，更高或更矮的带被映到楔形。先用 $w = e^{cz}$ 缩放，就能匹配任意高度的带形。",
      ],
      (rng) => {
        const h = rng.int(2, 9);
        const [q, enRegion, zhRegion] = rng.pick([
          [1, "the upper half-plane", "上半平面"],
          [2, "the first quadrant $0 < \\arg w < \\frac{\\pi}{2}$", "第一象限 $0 < \\arg w < \\frac{\\pi}{2}$"],
          [3, "the wedge $0 < \\arg w < \\frac{\\pi}{3}$", "楔形 $0 < \\arg w < \\frac{\\pi}{3}$"],
          [4, "the wedge $0 < \\arg w < \\frac{\\pi}{4}$", "楔形 $0 < \\arg w < \\frac{\\pi}{4}$"],
        ] as const);
        const answer = Q.of(1, h * q);
        const angle = piOver(q);
        return ask(
          [
            `The map $w = e^{cz}$, with $c > 0$, sends the strip $0 < \\operatorname{Im} z < ${h} \\pi$ onto ${enRegion}. What is $c$?`,
            `映射 $w = e^{cz}$（$c > 0$）把带形 $0 < \\operatorname{Im} z < ${h} \\pi$ 映到${zhRegion}。$c$ 是多少？`,
          ],
          answer,
          [h, Q.of(2, h * q), Q.of(1, 2 * h * q), Q.of(q, h), 1],
          [
            `The top of the strip must map to the ray at angle $${angle}$, so $c \\cdot ${h} \\pi = ${angle}$, and $c = ${answer.toLatex()}$.`,
            `带的上边界必须映到角度为 $${angle}$ 的射线，所以 $c \\cdot ${h} \\pi = ${angle}$，$c = ${answer.toLatex()}$。`,
          ],
        );
      },
    ),
  ],
);

/** complexAnalysisMoreTopics holds the later topics of the Complex Analysis course. */
export const complexAnalysisMoreTopics: readonly TopicDef[] = [
  powerSeriesDiscs,
  complexTrig,
  complexPowers,
  mlInequality,
  windingNumbers,
  zeros,
  annuli,
  argumentPrinciple,
  trigIntegrals,
  improper,
  crossRatio,
  regionMaps,
];
