// The rest of a first course in Complex Analysis: the Riemann sphere, path independence, the mean value and
// maximum modulus properties, consequences of Cauchy's theorems, more residue techniques, continuation, and
// conformal maps applied to the Dirichlet problem.

import type { TopicDef } from "@ga/content";
import { Q } from "@ga/subject-math";

import { ask, choose, point, same, topic } from "../university-kit.ts";

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

/** gauss writes a + bi for b > 0, and with sign -1 its conjugate. */
const gauss = (a: number, b: number, sign = 1): string => {
  const part = b === 1 ? "i" : `${b}i`;
  if (a === 0) return sign < 0 ? `-${part}` : part;
  return `${a} ${sign < 0 ? "-" : "+"} ${part}`;
};

const riemannSphere = topic(
  "the-riemann-sphere",
  ["The Riemann Sphere", "黎曼球面"],
  ["Add a point at infinity, and picture the plane on a sphere by stereographic projection.", "加上无穷远点，用球极投影把平面画到球面上。"],
  ["the-complex-plane"],
  [],
  [
    point(
      "the-height-of-a-projected-point",
      ["The height of a projected point", "投影点的高度"],
      [
        "Stereographic projection joins a plane point to the north pole of the unit sphere. The line meets the sphere at height $\\frac{|z|^{2} - 1}{|z|^{2} + 1}$, so the height depends only on the distance from the origin.",
        "球极投影把平面上的点与单位球的北极相连。这条线与球面交于高度 $\\frac{|z|^{2} - 1}{|z|^{2} + 1}$ 处，所以高度只取决于到原点的距离。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const b = rng.int(1, 9);
        const m = a * a + b * b;
        return ask(
          [
            `At what height does $z = ${gauss(a, b)}$ land on the unit Riemann sphere?`,
            `$z = ${gauss(a, b)}$ 落在单位黎曼球面的什么高度？`,
          ],
          Q.of(m - 1, m + 1),
          [Q.of(m + 1, m - 1 === 0 ? 3 : m - 1), Q.of(2, m + 1), Q.of(m, m + 1)],
          [
            `Here $|z|^{2} = ${m}$, and the height is $\\frac{|z|^{2} - 1}{|z|^{2} + 1} = \\frac{${m - 1}}{${m + 1}}$.`,
            `这里 $|z|^{2} = ${m}$，高度是 $\\frac{|z|^{2} - 1}{|z|^{2} + 1} = \\frac{${m - 1}}{${m + 1}}$。`,
          ],
        );
      },
    ),
    point(
      "from-the-sphere-back-to-the-plane",
      ["From the sphere back to the plane", "从球面回到平面"],
      [
        "The inverse map sends a sphere point $(X, Y, Z)$ to $\\frac{X + iY}{1 - Z}$. Points near the north pole have a small denominator, so they land far out, which is why the pole stands for infinity.",
        "逆映射把球面上的点 $(X, Y, Z)$ 映到 $\\frac{X + iY}{1 - Z}$。北极附近的点分母很小，所以落得很远，这就是北极代表无穷的原因。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const b = rng.int(1, 9);
        const m = a * a + b * b + 1;
        const x = Q.of(2 * a, m);
        const y = Q.of(2 * b, m);
        const z = Q.of(m - 2, m);
        return ask(
          [
            `The sphere point $\\left(${x.toLatex()}, ${y.toLatex()}, ${z.toLatex()}\\right)$ projects to $u + vi$ in the plane. What is $v$?`,
            `球面上的点 $\\left(${x.toLatex()}, ${y.toLatex()}, ${z.toLatex()}\\right)$ 投影到平面上的 $u + vi$。$v$ 是多少？`,
          ],
          b,
          [a === b ? b + 1 : a, Q.of(2 * b, m), 2 * b],
          [
            `Here $1 - Z = \\frac{2}{${m}}$, so $v = Y \\div (1 - Z) = ${b}$.`,
            `这里 $1 - Z = \\frac{2}{${m}}$，所以 $v = Y \\div (1 - Z) = ${b}$。`,
          ],
        );
      },
    ),
    point(
      "which-hemisphere",
      ["Which hemisphere", "哪个半球"],
      [
        "The unit circle lands on the equator, because height zero means $|z| = 1$. Points inside the circle land on the lower hemisphere, and points outside it land on the upper hemisphere near the pole.",
        "单位圆落在赤道上，因为高度为零意味着 $|z| = 1$。圆内的点落在下半球，圆外的点落在靠近北极的上半球。",
      ],
      (rng) => {
        const n = rng.int(2, 30);
        const a = rng.int(1, 30);
        const b = rng.int(1, 30);
        const kind = rng.int(0, 2);
        const lower: [string, string] = ["The lower hemisphere", "下半球"];
        const upper: [string, string] = ["The upper hemisphere", "上半球"];
        const equator: [string, string] = ["The equator", "赤道"];
        const pole: [string, string] = ["The north pole", "北极"];
        const z =
          kind === 0
            ? `\\frac{${a} + ${b}i}{${a + b + n}}`
            : kind === 1
              ? `${a} + ${b}i`
              : `\\frac{${n * n - 1} + ${2 * n}i}{${n * n + 1}}`;
        const right = kind === 0 ? lower : kind === 1 ? upper : equator;
        const others = [lower, upper, equator, pole].filter((o) => o !== right);
        return choose(rng, [`Where on the Riemann sphere does $z = ${z}$ land?`, `$z = ${z}$ 落在黎曼球面的什么位置？`], right, others, [
          kind === 0
            ? `Here $|z| < 1$, because $|${a} + ${b}i| \\le ${a + b} < ${a + b + n}$. Points inside the unit circle land on the lower hemisphere.`
            : kind === 1
              ? `Here $|z|^{2} = ${a * a + b * b} > 1$. Points outside the unit circle land on the upper hemisphere.`
              : `Here $|z| = 1$, because $${n * n - 1}^{2} + ${2 * n}^{2} = ${n * n + 1}^{2}$. The unit circle lands on the equator.`,
          kind === 0
            ? `这里 $|z| < 1$，因为 $|${a} + ${b}i| \\le ${a + b} < ${a + b + n}$。单位圆内的点落在下半球。`
            : kind === 1
              ? `这里 $|z|^{2} = ${a * a + b * b} > 1$。单位圆外的点落在上半球。`
              : `这里 $|z| = 1$，因为 $${n * n - 1}^{2} + ${2 * n}^{2} = ${n * n + 1}^{2}$。单位圆落在赤道上。`,
        ]);
      },
    ),
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
        "If $F' = f$ on a domain, then the integral of $f$ along any path equals $F$ at the end minus $F$ at the start. So the path can be ignored, and the work reduces to arithmetic with complex numbers.",
        "如果在区域上 $F' = f$，那么 $f$ 沿任何路径的积分都等于 $F$ 在终点的值减去在起点的值。所以可以不管路径，工作就化成复数运算。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const p = rng.int(-9, 9);
        const q = rng.int(1, 9);
        const part = rng.bool();
        return ask(
          part
            ? [
                `Along any path from ${a} to $${p} + ${q}i$, what is the real part of $\\int 2z\\, dz$?`,
                `沿从 ${a} 到 $${p} + ${q}i$ 的任何路径，$\\int 2z\\, dz$ 的实部是多少？`,
              ]
            : [
                `Along any path from ${a} to $${p} + ${q}i$, what is the imaginary part of $\\int 2z\\, dz$?`,
                `沿从 ${a} 到 $${p} + ${q}i$ 的任何路径，$\\int 2z\\, dz$ 的虚部是多少？`,
              ],
          part ? p * p - q * q - a * a : 2 * p * q,
          part ? [p * p + q * q - a * a, p * p - q * q, 2 * p * q - 1] : [p * q, q * q, 2 * p * q + a],
          [
            `The antiderivative is $z^{2}$, so the value is $(${p} + ${q}i)^{2} - (${a})^{2}$.`,
            `原函数是 $z^{2}$，所以值是 $(${p} + ${q}i)^{2} - (${a})^{2}$。`,
          ],
        );
      },
    ),
    point(
      "a-closed-contour-and-a-missing-antiderivative",
      ["A closed contour and a missing antiderivative", "闭围道与不存在的原函数"],
      [
        "Around a closed contour the two end points agree, so any term with an antiderivative integrates to zero. The term $\\frac{1}{z}$ has none on a punctured plane, and this is the only term here that survives.",
        "沿闭围道两个端点相同，所以有原函数的项积分为零。$\\frac{1}{z}$ 在去心平面上没有原函数，它是这里唯一留下的项。",
      ],
      (rng) => {
        const a = rng.int(1, 12);
        const b = rng.int(1, 12);
        const c = rng.int(1, 15);
        const r = rng.int(1, 9);
        return ask(
          [
            `Around $|z| = ${r}$ once counterclockwise, $\\oint \\left(${a}z^{2} + \\frac{${b}}{z^{2}} + \\frac{${c}}{z}\\right) dz = k\\pi i$. What is $k$?`,
            `沿 $|z| = ${r}$ 逆时针一周，$\\oint \\left(${a}z^{2} + \\frac{${b}}{z^{2}} + \\frac{${c}}{z}\\right) dz = k\\pi i$。$k$ 是多少？`,
          ],
          2 * c,
          [c, 2 * (b + c), 0],
          [
            `Only the $\\frac{${c}}{z}$ term survives, and it gives $2\\pi i \\cdot ${c}$.`,
            `只有 $\\frac{${c}}{z}$ 项留下，它给出 $2\\pi i \\cdot ${c}$。`,
          ],
        );
      },
    ),
    point(
      "an-integral-of-a-reciprocal-square",
      ["An integral of a reciprocal square", "倒数平方的积分"],
      [
        "On a domain that avoids the origin, $-\\frac{1}{z}$ is an antiderivative of $\\frac{1}{z^{2}}$. So its integral between two points is the same along every path that avoids the origin, even a long winding one.",
        "在避开原点的区域上，$-\\frac{1}{z}$ 是 $\\frac{1}{z^{2}}$ 的原函数。所以它在两点之间的积分沿每条避开原点的路径都相同，哪怕路径又长又弯。",
      ],
      (rng) => {
        const a = rng.int(2, 20);
        const b = a + rng.int(1, 20);
        const k = rng.int(1, 5);
        return ask(
          [
            `A path goes from ${a} to ${b} in the right half plane. What is $\\int \\frac{${k}}{z^{2}}\\, dz$ along it?`,
            `一条路径在右半平面内从 ${a} 走到 ${b}。沿它的 $\\int \\frac{${k}}{z^{2}}\\, dz$ 是多少？`,
          ],
          Q.of(k * (b - a), a * b),
          [Q.of(-k * (b - a), a * b), Q.of(k, b - a), Q.of(k * (a + b), a * b)],
          [
            `Use $-\\frac{${k}}{z}$ at the two ends, which gives $\\frac{${k}}{${a}} - \\frac{${k}}{${b}}$.`,
            `用 $-\\frac{${k}}{z}$ 在两端的值，得 $\\frac{${k}}{${a}} - \\frac{${k}}{${b}}$。`,
          ],
        );
      },
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
    point(
      "the-average-of-an-analytic-function",
      ["The average of an analytic function", "解析函数的平均"],
      [
        "Cauchy's integral formula on a circle says that an analytic function at the center equals its average around the circle. So the average does not depend on the radius, and only the center value is needed.",
        "圆上的柯西积分公式说明，解析函数在圆心的值等于它沿圆周的平均。所以平均值与半径无关，只需要圆心的值。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const b = rng.int(-9, 9);
        const c = rng.int(-20, 20);
        const r = rng.int(1, 9);
        const f = (x: number) => x * x + b * x + c;
        return ask(
          [
            `What is the average of $f(z) = z^{2}${plusTerm(b, "z")}${plus(c)}$ around the circle $|${minus(a)}| = ${r}$?`,
            `$f(z) = z^{2}${plusTerm(b, "z")}${plus(c)}$ 沿圆周 $|${minus(a)}| = ${r}$ 的平均值是多少？`,
          ],
          f(a),
          [f(a + r), f(a) + r * r, 0],
          [`The average equals the value at the center, which is $f(${a}) = ${f(a)}$.`, `平均值等于圆心处的值，即 $f(${a}) = ${f(a)}$。`],
        );
      },
    ),
    point(
      "the-average-of-a-harmonic-function",
      ["The average of a harmonic function", "调和函数的平均"],
      [
        "Real parts of analytic functions inherit the property, so a harmonic function at a point equals its average around any circle centered there. This holds for every harmonic function on a region containing the disc.",
        "解析函数的实部继承这一性质，所以调和函数在一点的值等于它沿以该点为圆心的任何圆周的平均。这对包含圆盘的区域上的每个调和函数都成立。",
      ],
      (rng) => {
        const p = rng.int(-9, 9);
        const q = rng.int(-9, 9);
        const k = rng.int(2, 9);
        const r = rng.int(1, 9);
        const u = p * p - q * q + k * p;
        return ask(
          [
            `What is the average of $u = x^{2} - y^{2} + ${k}x$ around the circle of radius ${r} centered at $(${p}, ${q})$?`,
            `$u = x^{2} - y^{2} + ${k}x$ 沿以 $(${p}, ${q})$ 为圆心、半径为 ${r} 的圆周的平均值是多少？`,
          ],
          u,
          [p * p + q * q + k * p, u + r * r, k * p],
          [
            `This $u$ is harmonic, so the average is its value at $(${p}, ${q})$.`,
            `这个 $u$ 是调和函数，所以平均值是它在 $(${p}, ${q})$ 处的值。`,
          ],
        );
      },
    ),
    point(
      "using-moreras-theorem",
      ["Using Morera's theorem", "使用莫雷拉定理"],
      [
        "Morera's theorem is a converse of Cauchy's theorem. A continuous function whose integral around every triangle in a disc vanishes must be analytic there, so uniform limits of analytic functions are analytic too.",
        "莫雷拉定理是柯西定理的逆定理。沿圆盘内每个三角形积分都为零的连续函数在那里一定解析，所以解析函数的一致极限也解析。",
      ],
      (rng) => {
        const r = rng.int(1, 40);
        return choose(
          rng,
          [
            `$f$ is continuous on $|z| < ${r}$, and its integral around every triangle in the disc is 0. What must be true?`,
            `$f$ 在 $|z| < ${r}$ 上连续，沿圆盘内每个三角形的积分都是 0。一定成立什么？`,
          ],
          [`$f$ is analytic on $|z| < ${r}$`, `$f$ 在 $|z| < ${r}$ 上解析`],
          [
            [`$f$ is constant on $|z| < ${r}$`, `$f$ 在 $|z| < ${r}$ 上是常数`],
            [`$f$ is a polynomial of degree below ${r + 1}`, `$f$ 是次数低于 ${r + 1} 的多项式`],
            [`$f$ is zero on $|z| = ${r}$`, `$f$ 在 $|z| = ${r}$ 上为零`],
          ],
          [
            `These hypotheses are exactly those of Morera's theorem, whose conclusion is analyticity.`,
            `这些条件正是莫雷拉定理的条件，它的结论是解析。`,
          ],
        );
      },
    ),
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
        "A nonconstant analytic function has no interior maximum of its modulus, so on a closed disc the maximum sits on the boundary. For $z - c$, this is the boundary point farthest from $c$.",
        "非常数解析函数的模没有内部最大值，所以在闭圆盘上最大值在边界上。对 $z - c$，就是离 $c$ 最远的边界点。",
      ],
      (rng) => {
        const r = rng.int(1, 20);
        const a = rng.pick([3, 5, 6, 8, 12, 15]);
        const b = ({ 3: 4, 5: 12, 6: 8, 8: 15, 12: 5, 15: 8 } as Record<number, number>)[a] as number;
        const c = Math.hypot(a, b);
        return ask(
          [
            `What is the maximum of $|z - (${a} + ${b}i)|$ on $|z| \\le ${r}$?`,
            `$|z - (${a} + ${b}i)|$ 在 $|z| \\le ${r}$ 上的最大值是多少？`,
          ],
          r + c,
          [c, Math.abs(r - c) + 2 * r + 1, a + b + r],
          [
            `The farthest boundary point is opposite $c$, at distance $${r} + |c| = ${r} + ${c}$.`,
            `最远的边界点在 $c$ 的对面，距离是 $${r} + |c| = ${r} + ${c}$。`,
          ],
        );
      },
    ),
    point(
      "the-smallest-size-without-zeros",
      ["The smallest size without zeros", "没有零点时的最小模"],
      [
        "If an analytic function has no zeros in the disc, then its reciprocal is analytic too, so the minimum of the modulus also sits on the boundary. A zero inside the disc makes the minimum zero instead.",
        "如果解析函数在圆盘内没有零点，它的倒数也解析，所以模的最小值也在边界上。如果圆盘内有零点，最小值就是零。",
      ],
      (rng) => {
        const r = rng.int(1, 15);
        const a = rng.pick([3, 5, 6, 8, 12, 15]);
        const b = ({ 3: 4, 5: 12, 6: 8, 8: 15, 12: 5, 15: 8 } as Record<number, number>)[a] as number;
        const c = Math.hypot(a, b);
        const value = r < c ? c - r : 0;
        return ask(
          [
            `What is the minimum of $|z - (${a} + ${b}i)|$ on $|z| \\le ${r}$?`,
            `$|z - (${a} + ${b}i)|$ 在 $|z| \\le ${r}$ 上的最小值是多少？`,
          ],
          value,
          [c + r, value + 1, value === r ? r + 2 : r],
          value === 0
            ? [`The zero of the function lies in the disc, because $${c} \\le ${r}$.`, `函数的零点在圆盘内，因为 $${c} \\le ${r}$。`]
            : [
                `There is no zero in the disc, and the nearest boundary point is at distance $${c} - ${r}$.`,
                `圆盘内没有零点，最近的边界点距离是 $${c} - ${r}$。`,
              ],
        );
      },
    ),
    point(
      "bounding-a-polynomial-on-a-circle",
      ["Bounding a polynomial on a circle", "圆周上多项式的界"],
      [
        "The triangle inequality gives an upper bound on the boundary, and that bound holds throughout the disc by the principle. For $z^{n} + a$ with positive $a$, the bound is attained where $z^{n}$ is a positive number.",
        "三角不等式给出边界上的上界，由最大模原理这个界在整个圆盘内都成立。对 $a$ 为正的 $z^{n} + a$，这个界在 $z^{n}$ 为正数时取到。",
      ],
      (rng) => {
        const r = rng.int(1, 6);
        const n = rng.int(2, 4);
        const a = rng.int(1, 40);
        return ask(
          [`What is the maximum of $|z^{${n}} + ${a}|$ on $|z| \\le ${r}$?`, `$|z^{${n}} + ${a}|$ 在 $|z| \\le ${r}$ 上的最大值是多少？`],
          r ** n + a,
          [a, Math.abs(r ** n - a), r ** n],
          [`It is attained at $z = ${r}$, where the value is $${r}^{${n}} + ${a}$.`, `它在 $z = ${r}$ 处取到，值是 $${r}^{${n}} + ${a}$。`],
        );
      },
    ),
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
        "If a polynomial had no root, its reciprocal would be bounded and analytic everywhere, so constant by Liouville's theorem. Dividing out roots one at a time then shows that a polynomial of degree $n$ has $n$ roots with multiplicity.",
        "如果多项式没有根，它的倒数就处处解析且有界，由刘维尔定理是常数。再逐个除去根，就说明 $n$ 次多项式按重数有 $n$ 个根。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const b = rng.int(1, 30);
        const m = rng.int(2, 7);
        const n = rng.int(2, 6);
        return ask(
          [
            `How many complex roots, counted with multiplicity, does $${factor(a)}^{${m}} (z^{2} + ${b})^{${n}}$ have?`,
            `$${factor(a)}^{${m}} (z^{2} + ${b})^{${n}}$ 按重数有多少个复根？`,
          ],
          m + 2 * n,
          [m + n, m, 2 * m + n],
          [
            `The degree is $${m} + 2 \\cdot ${n}$, and every root counts with its multiplicity.`,
            `次数是 $${m} + 2 \\cdot ${n}$，每个根按重数计算。`,
          ],
        );
      },
    ),
    point(
      "a-disc-holding-every-root",
      ["A disc holding every root", "包含所有根的圆盘"],
      [
        "For a monic polynomial, Cauchy's bound says every root has size below one plus the largest coefficient size. Outside that radius, the leading term is larger than all the other terms together, so no root is possible.",
        "对首一多项式，柯西界说明每个根的模都小于一加最大系数模。超过这个半径，首项比其他所有项之和还大，所以不可能有根。",
      ],
      (rng) => {
        const a = rng.int(-20, 20);
        const b = rng.int(-20, 20);
        const c = rng.int(1, 20);
        const n = rng.int(4, 7);
        const m = Math.max(Math.abs(a), Math.abs(b), c);
        return ask(
          [
            `What radius does Cauchy's bound give for all roots of $z^{${n}}${plusTerm(a, "z^{2}")}${plusTerm(b, "z")} + ${c}$?`,
            `对 $z^{${n}}${plusTerm(a, "z^{2}")}${plusTerm(b, "z")} + ${c}$ 的所有根，柯西界给出的半径是多少？`,
          ],
          1 + m,
          [m, 1 + Math.abs(a) + Math.abs(b) + c + 1, n + m],
          [`The largest coefficient size is ${m}, and the bound adds 1 to it.`, `最大系数模是 ${m}，这个界再加 1。`],
        );
      },
    ),
    point(
      "roots-of-a-real-polynomial",
      ["Roots of a real polynomial", "实多项式的根"],
      [
        "Conjugating a real polynomial leaves it unchanged, so its nonreal roots come in conjugate pairs. Together with the relation between roots and coefficients, this recovers coefficients from one complex root and one real root.",
        "取共轭不改变实多项式，所以它的非实根成共轭对出现。结合根与系数的关系，就能由一个复根和一个实根求出系数。",
      ],
      (rng) => {
        const p = rng.int(-9, 9);
        const q = rng.int(1, 9);
        const r = rng.int(-9, 9);
        return ask(
          [
            `A real monic cubic has the roots $${gauss(p, q)}$ and ${r}. What is its coefficient of $z^{2}$?`,
            `实系数首一三次多项式有根 $${gauss(p, q)}$ 和 ${r}。它的 $z^{2}$ 系数是多少？`,
          ],
          -(2 * p + r),
          [2 * p + r, -(p + r), -(2 * p + r) + 2 * q],
          [
            `The third root is the conjugate, so the sum of the roots is $${2 * p}${plus(r)}$, and the coefficient is minus this sum.`,
            `第三个根是共轭，所以根的和是 $${2 * p}${plus(r)}$，系数是这个和的相反数。`,
          ],
        );
      },
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
        "If $f$ maps the unit disc to itself with $f(0) = 0$, then $|f(z)| \\le |z|$ everywhere. The proof applies the maximum modulus principle to $\\frac{f(z)}{z}$, whose singularity at the origin is removable.",
        "如果 $f$ 把单位圆盘映到自身且 $f(0) = 0$，那么处处有 $|f(z)| \\le |z|$。证明是对 $\\frac{f(z)}{z}$ 用最大模原理，它在原点的奇点可去。",
      ],
      (rng) => {
        const [p, q] = fraction(rng, 30);
        return ask(
          [
            `$f$ is analytic with $|f(z)| < 1$ on the unit disc and $f(0) = 0$. What is the largest possible value of $\\left|f\\left(${Q.of(p, q).toLatex()}\\right)\\right|$?`,
            `$f$ 在单位圆盘上解析，$|f(z)| < 1$，$f(0) = 0$。$\\left|f\\left(${Q.of(p, q).toLatex()}\\right)\\right|$ 的最大可能值是多少？`,
          ],
          Q.of(p, q),
          [1, Q.of(p * p, q * q), Q.of(q - p, q)],
          [
            `The lemma gives $|f(z)| \\le |z|$, and $f(z) = z$ reaches this bound.`,
            `引理给出 $|f(z)| \\le |z|$，而 $f(z) = z$ 达到这个界。`,
          ],
        );
      },
    ),
    point(
      "the-bound-after-rescaling",
      ["The bound after rescaling", "缩放后的界"],
      [
        "On a disc of radius $R$ with bound $M$, rescale both variables to reach the unit disc. The lemma then says $|f(z)| \\le \\frac{M|z|}{R}$, so the bound grows in proportion to the distance from the origin.",
        "在半径为 $R$、界为 $M$ 的圆盘上，缩放两个变量得到单位圆盘。引理就给出 $|f(z)| \\le \\frac{M|z|}{R}$，所以界与到原点的距离成正比。",
      ],
      (rng) => {
        const big = rng.int(2, 25);
        const m = rng.int(2, 25);
        const z = rng.int(1, big - 1);
        return ask(
          [
            `$f$ is analytic on $|z| < ${big}$, with $|f(z)| < ${m}$ and $f(0) = 0$. What is the sharp upper bound of $|f(${z})|$?`,
            `$f$ 在 $|z| < ${big}$ 上解析，$|f(z)| < ${m}$，$f(0) = 0$。$|f(${z})|$ 的最佳上界是多少？`,
          ],
          Q.of(m * z, big),
          [m, Q.of(z, big), Q.of(m, big)],
          [`The rescaled lemma gives $\\frac{${m} \\cdot ${z}}{${big}}$.`, `缩放后的引理给出 $\\frac{${m} \\cdot ${z}}{${big}}$。`],
        );
      },
    ),
    point(
      "the-derivative-at-the-origin",
      ["The derivative at the origin", "原点处的导数"],
      [
        "The lemma also bounds the derivative at the origin by $\\frac{M}{R}$, with equality only for a rotation times the scaling. This gives a rigidity result: a map reaching the bound is linear.",
        "引理也给出原点处导数的界 $\\frac{M}{R}$，只有旋转乘缩放才能取等号。这是一个刚性结果：达到这个界的映射是线性的。",
      ],
      (rng) => {
        const big = rng.int(2, 25);
        const m = rng.int(2, 25);
        const asked = rng.bool();
        return asked
          ? ask(
              [
                `$f$ is analytic on $|z| < ${big}$, with $|f(z)| < ${m}$ and $f(0) = 0$. What is the sharp upper bound of $|f'(0)|$?`,
                `$f$ 在 $|z| < ${big}$ 上解析，$|f(z)| < ${m}$，$f(0) = 0$。$|f'(0)|$ 的最佳上界是多少？`,
              ],
              Q.of(m, big),
              [Q.of(big, m), m, Q.of(1, big)],
              [`The bound is $\\frac{M}{R}$ with $M = ${m}$ and $R = ${big}$.`, `界是 $\\frac{M}{R}$，其中 $M = ${m}$，$R = ${big}$。`],
            )
          : ask(
              [
                `$f$ is analytic on $|z| < ${big}$, with $|f(z)| < ${m}$, $f(0) = 0$ and $f'(0) = ${Q.of(m, big).toLatex()}$. What is $f(1)$?`,
                `$f$ 在 $|z| < ${big}$ 上解析，$|f(z)| < ${m}$，$f(0) = 0$，$f'(0) = ${Q.of(m, big).toLatex()}$。$f(1)$ 是多少？`,
              ],
              Q.of(m, big),
              [1, m, Q.of(big, m)],
              [
                `Equality forces the linear map $f(z) = ${Q.of(m, big).toLatex()} z$, and the input is 1.`,
                `取等号迫使 $f(z) = ${Q.of(m, big).toLatex()} z$ 是线性映射，输入是 1。`,
              ],
            );
      },
    ),
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
        "If $f(z) - c$ has a zero of order $m$ at $a$, then each value near $c$ has exactly $m$ preimages near $a$. So $f$ wraps a small disc around $c$ exactly $m$ times.",
        "如果 $f(z) - c$ 在 $a$ 处有 $m$ 阶零点，那么 $c$ 附近的每个值在 $a$ 附近恰有 $m$ 个原像。所以 $f$ 把小圆盘绕 $c$ 恰好包裹 $m$ 次。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const c = rng.int(-20, 20);
        const k = rng.int(2, 9);
        const m = rng.int(2, 9);
        return ask(
          [
            `Let $f(z) = ${c === 0 ? "" : `${c} + `}${k}${factor(a)}^{${m}}$. How many preimages near ${a} does a value very near ${c}, but not equal to it, have?`,
            `设 $f(z) = ${c === 0 ? "" : `${c} + `}${k}${factor(a)}^{${m}}$。一个非常接近 ${c} 但不等于它的值，在 ${a} 附近有多少个原像？`,
          ],
          m,
          [1, k, m - 1],
          [
            `The zero of $f${plus(-c)}$ at ${a} has order ${m}, and it splits into ${m} simple preimages.`,
            `$f${plus(-c)}$ 在 ${a} 处的零点是 ${m} 阶的，它分裂成 ${m} 个单原像。`,
          ],
        );
      },
    ),
    point(
      "how-a-critical-point-changes-angles",
      ["How a critical point changes angles", "临界点如何改变角度"],
      [
        "Analytic maps preserve angles where the derivative is not zero. At a point where $f - f(a)$ has a zero of order $m$, angles between curves are instead multiplied by $m$.",
        "解析映射在导数不为零的地方保持角度。在 $f - f(a)$ 有 $m$ 阶零点的地方，曲线之间的夹角改为乘 $m$。",
      ],
      (rng) => {
        const m = rng.int(2, 9);
        const q = rng.int(m + 1, 24);
        const p = rng.int(1, 3);
        return ask(
          [
            `Two curves meet at the origin at the angle $${piFraction(p, q)}$. Under $f(z) = z^{${m}}$, their images meet at $k\\pi$. What is $k$?`,
            `两条曲线在原点相交，夹角为 $${piFraction(p, q)}$。在 $f(z) = z^{${m}}$ 下，它们的像的夹角是 $k\\pi$。$k$ 是多少？`,
          ],
          Q.of(p * m, q),
          [Q.of(p, q), Q.of(p, q * m), Q.of(p * m, q + 1)],
          [`The zero at the origin has order ${m}, so the angle is multiplied by ${m}.`, `原点处的零点是 ${m} 阶的，所以角度乘 ${m}。`],
        );
      },
    ),
    point(
      "the-open-mapping-theorem",
      ["The open mapping theorem", "开映射定理"],
      [
        "A nonconstant analytic function sends open sets to open sets. So its image on a disc cannot be a segment, a curve or a single closed disc, and this also gives another proof of the maximum modulus principle.",
        "非常数解析函数把开集映成开集。所以它在圆盘上的像不可能是线段、曲线或闭圆盘，这也给出最大模原理的另一个证明。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const b = a + rng.int(1, 30);
        return choose(
          rng,
          [
            `Which set can be the image of the open unit disc under a nonconstant analytic function?`,
            `哪个集合可以是开单位圆盘在非常数解析函数下的像？`,
          ],
          same(`\\{z : ${a} < |z| < ${b}\\}`),
          [same(`[${a}, ${b}]`), same(`\\{z : |z| \\le ${b}\\}`), same(`\\{z : |z| = ${a}\\}`)],
          [`Only the open annulus is an open set, and the theorem requires an open image.`, `只有开圆环是开集，而定理要求像是开集。`],
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
        "If two analytic functions agree on a sequence with a limit in the domain, their difference has a nonisolated zero, so it is identically zero. So a formula known along the sequence holds everywhere.",
        "如果两个解析函数在极限属于区域的数列上相等，它们的差有不孤立的零点，所以恒为零。于是沿数列已知的公式处处成立。",
      ],
      (rng) => {
        const k = rng.int(2, 12);
        const m = rng.int(2, 9);
        const p = rng.int(2, 3);
        return ask(
          [
            `$f$ is entire, and $f\\left(\\frac{1}{n}\\right) = \\frac{${k}}{n^{${p}}}$ for every $n \\ge 1$. What is $f(${m})$?`,
            `$f$ 是整函数，对每个 $n \\ge 1$ 有 $f\\left(\\frac{1}{n}\\right) = \\frac{${k}}{n^{${p}}}$。$f(${m})$ 是多少？`,
          ],
          k * m ** p,
          [k, Q.of(k, m ** p), k * m],
          [
            `The theorem forces $f(z) = ${k}z^{${p}}$, because the points tend to 0 in the domain.`,
            `定理迫使 $f(z) = ${k}z^{${p}}$，因为这些点在区域内趋于 0。`,
          ],
        );
      },
    ),
    point(
      "where-the-zeros-accumulate",
      ["Where the zeros accumulate", "零点在哪里聚集"],
      [
        "The limit point must lie inside the domain. Zeros that pile up only on the boundary are allowed, so the condition must be checked for where the sequence tends, and finitely many zeros never force anything.",
        "极限点必须在区域内部。只在边界上聚集的零点是允许的，所以要检查数列趋于哪里，而有限个零点不能迫使任何结论。",
      ],
      (rng) => {
        const k = rng.int(2, 30);
        return choose(
          rng,
          [
            `$f$ is analytic on the open unit disc. Which condition forces $f$ to be identically 0?`,
            `$f$ 在开单位圆盘上解析。哪个条件迫使 $f$ 恒为 0？`,
          ],
          same(`f\\left(\\frac{1}{n + ${k}}\\right) = 0 \\text{ for all } n \\ge 1`),
          [
            same(`f\\left(1 - \\frac{1}{(n + ${k})^{2}}\\right) \\ne 0 \\text{ for all } n \\ge 1`),
            same(`f\\left(\\frac{j}{${k + 1}}\\right) = 0 \\text{ for } j = 0, \\dots, ${k}`),
            same(`f(0) = f'(0) = \\dots = f^{(${k})}(0) = 0`),
          ],
          [`The points $\\frac{1}{n + ${k}}$ tend to 0, which lies inside the disc.`, `点 $\\frac{1}{n + ${k}}$ 趋于 0，它在圆盘内部。`],
        );
      },
    ),
    point(
      "extending-from-the-real-line",
      ["Extending from the real line", "从实轴延拓"],
      [
        "Real identities extend to the complex plane, because the real line has limit points. So a function given by a formula for real $x$ takes the same formula at every complex number where it stays analytic.",
        "实恒等式可以延拓到复平面，因为实轴有极限点。所以对实数 $x$ 由公式给出的函数，在保持解析的每个复数上都取同一公式。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(-20, 20);
        const m = rng.int(1, 9);
        return ask(
          [
            `$f$ is entire, and $f(x) = ${a}x^{2}${plus(b)}$ for all real $x$. What is $f(${m}i)$?`,
            `$f$ 是整函数，对所有实数 $x$ 有 $f(x) = ${a}x^{2}${plus(b)}$。$f(${m}i)$ 是多少？`,
          ],
          -a * m * m + b,
          [a * m * m + b, -a * m * m, a * m + b],
          [
            `The same formula holds at $${m}i$, and $(${m}i)^{2} = ${-m * m}$.`,
            `同一公式在 $${m}i$ 处成立，而 $(${m}i)^{2} = ${-m * m}$。`,
          ],
        );
      },
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
        "If $f$ is analytic and real on a real interval, then $f(\\overline{z}) = \\overline{f(z)}$. So the value at the mirror point across the real axis is the conjugate of the value at the original point.",
        "如果 $f$ 解析且在实区间上取实值，那么 $f(\\overline{z}) = \\overline{f(z)}$。所以关于实轴的镜像点的值是原来值的共轭。",
      ],
      (rng) => {
        const [a, b, c, d] = [rng.int(-9, 9), rng.int(1, 9), rng.int(-20, 20), rng.int(2, 20)];
        const real = rng.bool();
        return ask(
          [
            `$f$ is entire and real on the real axis, and $f(${gauss(a, b)}) = ${gauss(c, d)}$. What is the ${real ? "real" : "imaginary"} part of $f(${gauss(a, b, -1)})$?`,
            `$f$ 是整函数且在实轴上取实值，$f(${gauss(a, b)}) = ${gauss(c, d)}$。$f(${gauss(a, b, -1)})$ 的${real ? "实" : "虚"}部是多少？`,
          ],
          real ? c : -d,
          real ? [-c === c ? c + 1 : -c, d, -d] : [d, c, -c === -d ? -c + 1 : -c],
          [`The mirror value is the conjugate, namely $${gauss(c, d, -1)}$.`, `镜像点的值是共轭，即 $${gauss(c, d, -1)}$。`],
        );
      },
    ),
    point(
      "which-function-reflects",
      ["Which function reflects", "哪个函数可以反射"],
      [
        "The principle needs real values on the real axis, which for a power series means real coefficients around a real center. A single nonreal coefficient breaks the symmetry between a point and its mirror image.",
        "这个原理要求在实轴上取实值，对幂级数来说就是以实点为中心的系数都是实数。只要有一个非实系数，就破坏了点与镜像点之间的对称。",
      ],
      (rng) => {
        const a = rng.int(2, 30);
        const b = rng.int(2, 30);
        return choose(
          rng,
          [
            `Which function satisfies $f(\\overline{z}) = \\overline{f(z)}$ for all $z$?`,
            `哪个函数对所有 $z$ 满足 $f(\\overline{z}) = \\overline{f(z)}$？`,
          ],
          same(`f(z) = z^{2} + ${a}z + ${b}`),
          [same(`f(z) = z^{2} + ${a}iz + ${b}`), same(`f(z) = ${a}z + ${b}i`), same(`f(z) = e^{${a}iz}`)],
          [
            `All the coefficients of the correct polynomial are real, so it is real on the real axis.`,
            `正确的多项式所有系数都是实数，所以它在实轴上取实值。`,
          ],
        );
      },
    ),
    point(
      "the-reflected-function",
      ["The reflected function", "反射得到的函数"],
      [
        "For any analytic $f$, the function $g(z) = \\overline{f(\\overline{z})}$ is analytic too, and its power series has the conjugate coefficients. Then $f$ reflects exactly when $g$ equals $f$.",
        "对任何解析的 $f$，函数 $g(z) = \\overline{f(\\overline{z})}$ 也解析，它的幂级数系数是共轭。而 $f$ 可以反射当且仅当 $g$ 等于 $f$。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(-9, 9), rng.int(1, 12), rng.int(-9, 9)];
        const m = rng.int(1, 9);
        return ask(
          [
            `Let $f(z) = (${gauss(a, b)})z${plus(c)}$ and $g(z) = \\overline{f(\\overline{z})}$. What is the imaginary part of $g(${m})$?`,
            `设 $f(z) = (${gauss(a, b)})z${plus(c)}$，$g(z) = \\overline{f(\\overline{z})}$。$g(${m})$ 的虚部是多少？`,
          ],
          -b * m,
          [b * m, -b, a * m + c],
          [
            `Here $g(z) = (${gauss(a, b, -1)})z${plus(c)}$, whose coefficients are the conjugates. At $z = ${m}$, the imaginary part is $${-b} \\cdot ${m} = ${-b * m}$.`,
            `这里 $g(z) = (${gauss(a, b, -1)})z${plus(c)}$，系数都取共轭。在 $z = ${m}$ 处，虚部是 $${-b} \\cdot ${m} = ${-b * m}$。`,
          ],
        );
      },
    ),
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
        "The series $\\sum z^{n}$ converges only inside the unit disc, but the function $\\frac{1}{1 - z}$ agrees with it there and is analytic everywhere else except at 1. By the identity theorem this continuation is unique.",
        "级数 $\\sum z^{n}$ 只在单位圆盘内收敛，但函数 $\\frac{1}{1 - z}$ 在那里与它相同，并且除 1 外处处解析。由恒等定理，这个延拓是唯一的。",
      ],
      (rng) => {
        const m = rng.int(2, 30);
        const k = rng.int(1, 12);
        return ask(
          [
            `Let $f(z) = ${k}\\sum_{n \\ge 0} z^{n}$ on the unit disc. What is the analytic continuation of $f$ at $z = ${m}$?`,
            `在单位圆盘上设 $f(z) = ${k}\\sum_{n \\ge 0} z^{n}$。$f$ 的解析延拓在 $z = ${m}$ 处的值是多少？`,
          ],
          Q.of(-k, m - 1),
          [Q.of(k, m - 1), Q.of(k, m + 1), Q.of(-k, m)],
          [
            `The continuation is $\\frac{${k}}{1 - z}$, which is defined at ${m} although the series diverges there.`,
            `延拓是 $\\frac{${k}}{1 - z}$，它在 ${m} 处有定义，尽管级数在那里发散。`,
          ],
        );
      },
    ),
    point(
      "the-radius-from-the-nearest-singularity",
      ["The radius from the nearest singularity", "由最近奇点得到的半径"],
      [
        "A Taylor series at a point converges up to the nearest singularity of the function. So moving the center gives a different disc, and it can reach beyond the first one, which is how continuation is built.",
        "一点处的泰勒级数收敛到函数最近的奇点。所以移动中心就得到不同的圆盘，它可以超出第一个圆盘，延拓正是这样构造的。",
      ],
      (rng) => {
        const a = rng.int(-20, 20);
        const b = a + rng.int(1, 20);
        const c = rng.int(-25, 25);
        const clean = c === a || c === b ? c + 1 : c;
        const center = clean === a || clean === b ? clean + 1 : clean;
        const r = Math.min(Math.abs(center - a), Math.abs(center - b));
        return ask(
          [
            `What is the radius of convergence of the Taylor series of $\\frac{1}{${factor(a)}${factor(b)}}$ at $z = ${center}$?`,
            `$\\frac{1}{${factor(a)}${factor(b)}}$ 在 $z = ${center}$ 处的泰勒级数的收敛半径是多少？`,
          ],
          r,
          [Math.max(Math.abs(center - a), Math.abs(center - b)), Math.abs(center), b - a],
          [`The poles are at ${a} and ${b}, and the nearer one is at distance ${r}.`, `极点在 ${a} 和 ${b}，较近的一个距离是 ${r}。`],
        );
      },
    ),
    point(
      "continuing-a-logarithm-around-a-loop",
      ["Continuing a logarithm around a loop", "沿回路延拓对数"],
      [
        "Continuing the logarithm around the origin raises its imaginary part by $2\\pi$ each counterclockwise turn. So a function can return to the same point with a different value, and a branch is one consistent choice.",
        "沿原点延拓对数时，每逆时针一周它的虚部增加 $2\\pi$。所以函数回到同一点可以有不同的值，分支就是一种一致的选择。",
      ],
      (rng) => {
        const k = rng.int(1, 15);
        const c = rng.int(2, 9);
        const r = rng.int(2, 30);
        const clockwise = rng.bool();
        const s = clockwise ? -1 : 1;
        return ask(
          [
            `Start with $${c} \\log z$ at $z = ${r}$, and continue it ${k} ${k === 1 ? "time" : "times"} ${clockwise ? "clockwise" : "counterclockwise"} around the origin. The value changes by $m\\pi i$. What is $m$?`,
            `从 $z = ${r}$ 处的 $${c} \\log z$ 开始，沿原点${clockwise ? "顺时针" : "逆时针"}延拓 ${k} 周。值变化了 $m\\pi i$。$m$ 是多少？`,
          ],
          s * 2 * c * k,
          [-s * 2 * c * k, s * c * k, s * 2 * k],
          [
            `Each turn adds $${clockwise ? "-" : ""}2\\pi i$ to $\\log z$, and the factor ${c} multiplies it.`,
            `每一周给 $\\log z$ 增加 $${clockwise ? "-" : ""}2\\pi i$，再乘系数 ${c}。`,
          ],
        );
      },
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
        "The integral for Gamma converges only for positive real part, but $\\Gamma(z + 1) = z\\Gamma(z)$ continues it. Rewriting as $\\Gamma(z) = \\frac{\\Gamma(z + 1)}{z}$ steps to the left one unit at a time.",
        "伽马函数的积分只在实部为正时收敛，但 $\\Gamma(z + 1) = z\\Gamma(z)$ 可以延拓它。改写成 $\\Gamma(z) = \\frac{\\Gamma(z + 1)}{z}$，就能每次向左走一步。",
      ],
      (rng) => {
        const m = rng.int(1, 5);
        const k = rng.int(1, 12);
        let top = 1;
        let bottom = 1;
        for (let i = 0; i < m; i++) {
          top *= 2;
          bottom *= -(2 * i + 1);
        }
        const left = rng.bool();
        let up = 1;
        for (let i = 0; i < m; i++) up *= 2 * i + 1;
        return left
          ? ask(
              [
                `Evaluate $${k} \\cdot \\frac{\\Gamma\\left(\\frac{1}{2} - ${m}\\right)}{\\Gamma\\left(\\frac{1}{2}\\right)}$.`,
                `计算 $${k} \\cdot \\frac{\\Gamma\\left(\\frac{1}{2} - ${m}\\right)}{\\Gamma\\left(\\frac{1}{2}\\right)}$。`,
              ],
              Q.of(k * top, bottom),
              [Q.of(-k * top, bottom), Q.of(k * bottom, top), Q.of(k, bottom)],
              [
                `Step left ${m} times, dividing by $-\\frac{1}{2}, -\\frac{3}{2}, \\dots$ in turn.`,
                `向左走 ${m} 步，依次除以 $-\\frac{1}{2}, -\\frac{3}{2}, \\dots$。`,
              ],
            )
          : ask(
              [
                `Evaluate $${k} \\cdot \\frac{\\Gamma\\left(\\frac{1}{2} + ${m}\\right)}{\\Gamma\\left(\\frac{1}{2}\\right)}$.`,
                `计算 $${k} \\cdot \\frac{\\Gamma\\left(\\frac{1}{2} + ${m}\\right)}{\\Gamma\\left(\\frac{1}{2}\\right)}$。`,
              ],
              Q.of(k * up, top),
              [Q.of(k * top, up), Q.of(k * up, 2 * top), Q.of(k, top)],
              [
                `Step right ${m} times, multiplying by $\\frac{1}{2}, \\frac{3}{2}, \\dots$ in turn.`,
                `向右走 ${m} 步，依次乘 $\\frac{1}{2}, \\frac{3}{2}, \\dots$。`,
              ],
            );
      },
    ),
    point(
      "residues-at-the-poles",
      ["Residues at the poles", "极点处的留数"],
      [
        "The Gamma function has simple poles at 0 and the negative integers. Stepping from the pole at 0 gives the residue at $-n$ as $\\frac{(-1)^{n}}{n!}$, which shrinks quickly and alternates in sign.",
        "伽马函数在 0 和负整数处有单极点。从 0 处的极点走步，得到 $-n$ 处的留数是 $\\frac{(-1)^{n}}{n!}$，它很快变小并交替变号。",
      ],
      (rng) => {
        const n = rng.int(0, 8);
        const k = rng.int(1, 6);
        let fact = 1;
        for (let i = 2; i <= n; i++) fact *= i;
        const sign = n % 2 === 0 ? 1 : -1;
        return ask(
          [
            `What is the residue of $${k}\\Gamma(z)$ at $z = ${n === 0 ? "0" : -n}$?`,
            `$${k}\\Gamma(z)$ 在 $z = ${n === 0 ? "0" : -n}$ 处的留数是多少？`,
          ],
          Q.of(sign * k, fact),
          [Q.of(-sign * k, fact), Q.of(sign * k, fact * (n + 1)), 0],
          [
            `The residue of $\\Gamma$ is $\\frac{(-1)^{${n}}}{${n}!}$, times ${k}.`,
            `$\\Gamma$ 的留数是 $\\frac{(-1)^{${n}}}{${n}!}$，再乘 ${k}。`,
          ],
        );
      },
    ),
    point(
      "the-reflection-formula",
      ["The reflection formula", "反射公式"],
      [
        "The product $\\Gamma(z)\\Gamma(1 - z)$ equals $\\frac{\\pi}{\\sin(\\pi z)}$. Both sides have simple poles at all the integers, and at $z = \\frac{1}{2}$ this gives the value $\\sqrt{\\pi}$ for $\\Gamma\\left(\\frac{1}{2}\\right)$.",
        "乘积 $\\Gamma(z)\\Gamma(1 - z)$ 等于 $\\frac{\\pi}{\\sin(\\pi z)}$。两边在所有整数处都有单极点，在 $z = \\frac{1}{2}$ 处这给出 $\\Gamma\\left(\\frac{1}{2}\\right)$ 的值 $\\sqrt{\\pi}$。",
      ],
      (rng) => {
        const k = rng.int(1, 15);
        const [z, w, s] = rng.pick([
          ["\\frac{1}{2}", "\\frac{1}{2}", 1],
          ["\\frac{1}{6}", "\\frac{5}{6}", 2],
          ["\\frac{5}{6}", "\\frac{1}{6}", 2],
        ] as [string, string, number][]);
        return ask(
          [
            `$${k}\\Gamma\\left(${z}\\right)\\Gamma\\left(${w}\\right) = m\\pi$. What is $m$?`,
            `$${k}\\Gamma\\left(${z}\\right)\\Gamma\\left(${w}\\right) = m\\pi$。$m$ 是多少？`,
          ],
          k * s,
          [k, Q.of(k, s === 1 ? 2 : s), k * s + 1],
          [
            `The reflection formula gives $\\frac{\\pi}{\\sin(\\pi z)}$, with $\\sin(\\pi z) = ${s === 1 ? "1" : "\\frac{1}{2}"}$.`,
            `反射公式给出 $\\frac{\\pi}{\\sin(\\pi z)}$，其中 $\\sin(\\pi z) = ${s === 1 ? "1" : "\\frac{1}{2}"}$。`,
          ],
        );
      },
    ),
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
        "Euler's formula is $\\sin(\\pi z) = \\pi z \\prod_{n \\ge 1} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$. Each factor removes a pair of zeros at $\\pm n$, and partial products at simple fractions are ordinary rational arithmetic.",
        "欧拉公式是 $\\sin(\\pi z) = \\pi z \\prod_{n \\ge 1} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$。每个因子给出一对零点 $\\pm n$，在简单分数处的部分积就是普通的有理数运算。",
      ],
      (rng) => {
        const m = rng.int(2, 15);
        const big = rng.int(2, 3);
        let top = 1;
        let bottom = 1;
        for (let n = 1; n <= big; n++) {
          top *= m * m * n * n - 1;
          bottom *= m * m * n * n;
        }
        return ask(
          [
            `Evaluate the partial product $\\prod_{n=1}^{${big}} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ at $z = \\frac{1}{${m}}$.`,
            `计算部分积 $\\prod_{n=1}^{${big}} \\left(1 - \\frac{z^{2}}{n^{2}}\\right)$ 在 $z = \\frac{1}{${m}}$ 处的值。`,
          ],
          Q.of(top, bottom),
          [Q.of(top, bottom * 2), Q.of(m * m - 1, m * m), Q.of(bottom, top)],
          [
            `Multiply the ${big} factors $1 - \\frac{1}{${m * m} n^{2}}$ together.`,
            `把 ${big} 个因子 $1 - \\frac{1}{${m * m} n^{2}}$ 乘起来。`,
          ],
        );
      },
    ),
    point(
      "counting-the-zeros-in-a-disc",
      ["Counting the zeros in a disc", "数圆盘内的零点"],
      [
        "The zeros of $\\sin(\\pi z)$ are exactly the integers, with no others in the complex plane. So the number of zeros in a disc around the origin is found by counting the integers inside it.",
        "$\\sin(\\pi z)$ 的零点恰好是整数，在复平面上没有其他零点。所以以原点为圆心的圆盘内的零点数，就是数其中的整数。",
      ],
      (rng) => {
        const m = rng.int(2, 60);
        const r = Q.of(2 * m + 1, 2);
        return ask(
          [
            `How many zeros does $\\sin(\\pi z)$ have in $|z| < ${r.toLatex()}$?`,
            `$\\sin(\\pi z)$ 在 $|z| < ${r.toLatex()}$ 内有多少个零点？`,
          ],
          2 * m + 1,
          [m, 2 * m, 2 * m + 2],
          [
            `The integers from $-${m}$ to ${m} lie inside, which is ${2 * m + 1} in all.`,
            `从 $-${m}$ 到 ${m} 的整数在内部，共 ${2 * m + 1} 个。`,
          ],
        );
      },
    ),
    point(
      "comparing-coefficients",
      ["Comparing coefficients", "比较系数"],
      [
        "Expanding the product shows that the coefficient of $z^{2}$ in $\\frac{\\sin(\\pi z)}{\\pi z}$ is minus the sum of $\\frac{1}{n^{2}}$. The Taylor series says it is $-\\frac{\\pi^{2}}{6}$, which is Euler's famous solution to the Basel problem.",
        "展开乘积可知 $\\frac{\\sin(\\pi z)}{\\pi z}$ 中 $z^{2}$ 的系数是 $\\frac{1}{n^{2}}$ 之和的相反数。泰勒级数说它是 $-\\frac{\\pi^{2}}{6}$，这就是欧拉对巴塞尔问题的著名解答。",
      ],
      (rng) => {
        const k = rng.int(1, 40);
        return ask(
          [
            `The coefficient of $z^{2}$ in $\\frac{${k} \\sin(\\pi z)}{\\pi z}$ is $m\\pi^{2}$. What is $m$?`,
            `$\\frac{${k} \\sin(\\pi z)}{\\pi z}$ 中 $z^{2}$ 的系数是 $m\\pi^{2}$。$m$ 是多少？`,
          ],
          Q.of(-k, 6),
          [Q.of(k, 6), Q.of(-k, 3), Q.of(-k, 2)],
          [
            `The sine series gives $1 - \\frac{(\\pi z)^{2}}{6} + \\dots$, and we multiply by ${k}.`,
            `正弦级数给出 $1 - \\frac{(\\pi z)^{2}}{6} + \\dots$，再乘 ${k}。`,
          ],
        );
      },
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
    point(
      "from-the-coefficient-of-one-over-z",
      ["From the coefficient of one over z", "由 z 分之一的系数"],
      [
        "The residue at infinity is minus the coefficient of $\\frac{1}{z}$ in the expansion valid for large $|z|$. The minus sign reflects that a large circle runs clockwise when viewed from infinity.",
        "无穷远点的留数是 $|z|$ 很大时展开式中 $\\frac{1}{z}$ 系数的相反数。负号反映了从无穷远看，大圆是顺时针的。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(1, 15), rng.int(1, 15), rng.int(1, 15)];
        return ask(
          [
            `What is the residue at infinity of $${b}z + ${c} + \\frac{${a}}{z} + \\frac{${b}}{z^{2}}$?`,
            `$${b}z + ${c} + \\frac{${a}}{z} + \\frac{${b}}{z^{2}}$ 在无穷远点的留数是多少？`,
          ],
          -a,
          [a, -b, -c],
          [
            `The coefficient of $\\frac{1}{z}$ is ${a}, and the residue at infinity is its negative.`,
            `$\\frac{1}{z}$ 的系数是 ${a}，无穷远点的留数是它的相反数。`,
          ],
        );
      },
    ),
    point(
      "all-the-residues-add-to-zero",
      ["All the residues add to zero", "所有留数之和为零"],
      [
        "On the Riemann sphere, the residues of a rational function at all its poles and at infinity add up to zero. So the residue at infinity is minus the sum of the finite residues, and any one can be recovered.",
        "在黎曼球面上，有理函数在所有极点和无穷远点的留数之和为零。所以无穷远点的留数是有限留数之和的相反数，任何一个都可以求回。",
      ],
      (rng) => {
        const [a, b, c] = [rng.int(-15, 15), rng.int(-15, 15), rng.int(-15, 15)];
        return ask(
          [
            `A rational function has finite poles with residues ${a}, ${b} and ${c}, and no others. What is its residue at infinity?`,
            `一个有理函数的有限极点的留数是 ${a}、${b} 和 ${c}，没有其他极点。它在无穷远点的留数是多少？`,
          ],
          -(a + b + c),
          [a + b + c + 1, -(a + b), a + b + c === 0 ? 1 : a + b + c],
          [`All the residues add to zero, so this one is $-(${a + b + c})$.`, `所有留数之和为零，所以这个留数是 $-(${a + b + c})$。`],
        );
      },
    ),
    point(
      "a-large-circle-in-one-step",
      ["A large circle in one step", "一步算大圆"],
      [
        "If all the poles lie inside a circle, the integral comes from infinity alone. For a rational function whose denominator is one degree higher than its numerator, the value is $2\\pi i$ times the ratio of the leading coefficients.",
        "如果所有极点都在圆内，积分只取决于无穷远点。对分母比分子高一次的有理函数，值是 $2\\pi i$ 乘首项系数之比。",
      ],
      (rng) => {
        const a = rng.int(2, 20);
        const b = rng.int(2, 9);
        const n = rng.int(2, 8);
        const c = rng.int(1, 9);
        return ask(
          [
            `$\\oint_{|z| = ${c + 2}} \\frac{${a}z^{${n}} + ${c}}{${b}z^{${n + 1}} + ${c}}\\, dz = m\\pi i$ counterclockwise, with all poles inside the circle. What is $m$?`,
            `逆时针方向 $\\oint_{|z| = ${c + 2}} \\frac{${a}z^{${n}} + ${c}}{${b}z^{${n + 1}} + ${c}}\\, dz = m\\pi i$，所有极点都在圆内。$m$ 是多少？`,
          ],
          Q.of(2 * a, b),
          [Q.of(a, b), Q.of(2 * b, a), 2 * a],
          [
            `For large $|z|$ the integrand is about $\\frac{${a}}{${b}z}$, which gives $2\\pi i \\cdot ${Q.of(a, b).toLatex()}$.`,
            `$|z|$ 很大时被积函数约为 $\\frac{${a}}{${b}z}$，给出 $2\\pi i \\cdot ${Q.of(a, b).toLatex()}$。`,
          ],
        );
      },
    ),
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
        "To integrate $\\frac{\\cos(ax)}{x^{2} + b^{2}}$, replace the cosine by $e^{iaz}$ and close in the upper half plane. The pole at $ib$ gives the value $\\frac{\\pi e^{-ab}}{b}$, and the real part is the answer.",
        "要积分 $\\frac{\\cos(ax)}{x^{2} + b^{2}}$，把余弦换成 $e^{iaz}$ 并在上半平面闭合。$ib$ 处的极点给出值 $\\frac{\\pi e^{-ab}}{b}$，实部就是答案。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        return choose(
          rng,
          [
            `Evaluate $\\int_{-\\infty}^{\\infty} \\frac{\\cos(${a}x)}{x^{2} + ${b * b}}\\, dx$.`,
            `计算 $\\int_{-\\infty}^{\\infty} \\frac{\\cos(${a}x)}{x^{2} + ${b * b}}\\, dx$。`,
          ],
          same(`\\frac{\\pi e^{-${a * b}}}{${b}}`),
          [same(`\\frac{\\pi e^{-${a}}}{${b}}`), same(`\\frac{\\pi}{${b}}`), same(`\\frac{2\\pi e^{-${a * b}}}{${b}}`)],
          [
            `The residue at $${b}i$ gives $\\frac{\\pi e^{-${a} \\cdot ${b}}}{${b}}$.`,
            `$${b}i$ 处的留数给出 $\\frac{\\pi e^{-${a} \\cdot ${b}}}{${b}}$。`,
          ],
        );
      },
    ),
    point(
      "the-ml-bound-on-the-arc",
      ["The ML bound on the arc", "圆弧上的 ML 界"],
      [
        "On the upper semicircle of radius $R$, the factor $e^{iaz}$ has size at most 1 and the arc has length $\\pi R$. So the ML bound for a denominator of degree 2 tends to zero as $R$ grows.",
        "在半径为 $R$ 的上半圆上，因子 $e^{iaz}$ 的模不超过 1，圆弧长度是 $\\pi R$。所以分母为 2 次时，ML 界随 $R$ 增大趋于零。",
      ],
      (rng) => {
        const b = rng.int(1, 8);
        const r = b + rng.int(1, 20);
        return ask(
          [
            `On the upper arc of $|z| = ${r}$, the ML bound for $\\frac{e^{iz}}{z^{2} + ${b * b}}$ is $m\\pi$. What is $m$?`,
            `在 $|z| = ${r}$ 的上半圆弧上，$\\frac{e^{iz}}{z^{2} + ${b * b}}$ 的 ML 界是 $m\\pi$。$m$ 是多少？`,
          ],
          Q.of(r, r * r - b * b),
          [Q.of(r, r * r + b * b), Q.of(1, r * r - b * b), Q.of(2 * r, r * r - b * b)],
          [
            `The integrand is at most $\\frac{1}{${r}^{2} - ${b * b}}$, and the length is $${r}\\pi$.`,
            `被积函数不超过 $\\frac{1}{${r}^{2} - ${b * b}}$，长度是 $${r}\\pi$。`,
          ],
        );
      },
    ),
    point(
      "which-half-plane-to-close",
      ["Which half plane to close", "在哪个半平面闭合"],
      [
        "The factor $e^{iaz}$ has size $e^{-a \\operatorname{Im} z}$. So for positive $a$ it decays in the upper half plane, and for negative $a$ it decays in the lower half plane, where the contour runs clockwise.",
        "因子 $e^{iaz}$ 的模是 $e^{-a \\operatorname{Im} z}$。所以 $a$ 为正时它在上半平面衰减，$a$ 为负时在下半平面衰减，那里的围道是顺时针的。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const negative = rng.bool();
        const up: [string, string] = ["The upper half plane", "上半平面"];
        const down: [string, string] = ["The lower half plane", "下半平面"];
        return choose(
          rng,
          [
            `To evaluate $\\int_{-\\infty}^{\\infty} \\frac{e^{${negative ? "-" : ""}${a}ix}}{x^{2} + 1}\\, dx$, where should the contour be closed?`,
            `要计算 $\\int_{-\\infty}^{\\infty} \\frac{e^{${negative ? "-" : ""}${a}ix}}{x^{2} + 1}\\, dx$，围道应该在哪里闭合？`,
          ],
          negative ? down : up,
          [
            negative ? up : down,
            ["Either half plane gives the same arc bound", "两个半平面的圆弧界相同"],
            ["Neither, because the integrand has no poles", "都不行，因为被积函数没有极点"],
          ],
          [
            `The factor must decay on the arc, which fixes the sign of the imaginary part.`,
            `这个因子在圆弧上必须衰减，这决定了虚部的符号。`,
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
        "A small semicircle around a simple pole contributes half of a full turn in the limit. So going over the pole clockwise gives $-\\pi i$ times the residue, and counterclockwise gives $\\pi i$ times the residue.",
        "绕单极点的小半圆在极限下贡献整圈的一半。所以顺时针跨过极点给出 $-\\pi i$ 乘留数，逆时针给出 $\\pi i$ 乘留数。",
      ],
      (rng) => {
        const c = rng.int(2, 30);
        const a = rng.int(-9, 9);
        const clockwise = rng.bool();
        return ask(
          [
            `A semicircle of small radius around $z = ${a}$ runs ${clockwise ? "clockwise" : "counterclockwise"}. In the limit, $\\int \\frac{${c}}{${minus(a)}}\\, dz$ along it is $m\\pi i$. What is $m$?`,
            `绕 $z = ${a}$ 的小半圆沿${clockwise ? "顺时针" : "逆时针"}方向。在极限下，沿它的 $\\int \\frac{${c}}{${minus(a)}}\\, dz$ 是 $m\\pi i$。$m$ 是多少？`,
          ],
          clockwise ? -c : c,
          [clockwise ? c : -c, clockwise ? -2 * c : 2 * c, 0],
          [
            `A half turn gives half of $2\\pi i \\cdot ${c}$, with the sign set by the direction.`,
            `半圈给出 $2\\pi i \\cdot ${c}$ 的一半，符号由方向决定。`,
          ],
        );
      },
    ),
    point(
      "the-sine-over-x-integral",
      ["The sine over x integral", "正弦除以 x 的积分"],
      [
        "Indenting around 0 and using $e^{iaz}$ for positive $a$ shows that the integral of $\\frac{\\sin(ax)}{x}$ over the line is $\\pi$. The value does not depend on $a$, since rescaling $x$ cancels it.",
        "绕 0 凹陷并对正的 $a$ 使用 $e^{iaz}$，可知 $\\frac{\\sin(ax)}{x}$ 在直线上的积分是 $\\pi$。值与 $a$ 无关，因为缩放 $x$ 把它抵消了。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const k = rng.int(2, 15);
        return ask(
          [
            `$\\int_{-\\infty}^{\\infty} \\frac{${k} \\sin(${a}x)}{x}\\, dx = m\\pi$. What is $m$?`,
            `$\\int_{-\\infty}^{\\infty} \\frac{${k} \\sin(${a}x)}{x}\\, dx = m\\pi$。$m$ 是多少？`,
          ],
          k,
          [k * a, Q.of(k, a), 2 * k],
          [`Rescaling cancels the ${a}, so the integral is ${k} times $\\pi$.`, `缩放抵消了 ${a}，所以积分是 ${k} 乘 $\\pi$。`],
        );
      },
    ),
    point(
      "a-principal-value-by-symmetry",
      ["A principal value by symmetry", "由对称性求主值"],
      [
        "The principal value removes a symmetric gap around the singularity and takes the limit. The two sides of $\\frac{1}{x - a}$ then cancel exactly, even though each side diverges on its own.",
        "主值去掉奇点周围的对称间隙，再取极限。这时 $\\frac{1}{x - a}$ 的两边恰好抵消，尽管每一边单独都发散。",
      ],
      (rng) => {
        const a = rng.int(-9, 9);
        const r = rng.int(1, 15);
        const c = rng.int(2, 15);
        const d = rng.int(1, 12);
        const x = a === 0 ? "x" : a < 0 ? `x + ${-a}` : `x - ${a}`;
        return ask(
          [
            `What is the principal value of $\\int_{${a - r}}^{${a + r}} \\left(\\frac{${c}}{${x}} + ${d}\\right) dx$?`,
            `$\\int_{${a - r}}^{${a + r}} \\left(\\frac{${c}}{${x}} + ${d}\\right) dx$ 的主值是多少？`,
          ],
          2 * r * d,
          [2 * r * (c + d), r * d, 2 * r * d + c],
          [
            `The $\\frac{1}{x - a}$ part cancels by symmetry, leaving $${d} \\cdot ${2 * r}$.`,
            `$\\frac{1}{x - a}$ 部分因对称抵消，剩下 $${d} \\cdot ${2 * r}$。`,
          ],
        );
      },
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
        "A keyhole contour runs along both sides of a cut on the positive real axis. Below the cut, the argument of $z$ has grown by $2\\pi$, so a fractional power picks up a constant factor there.",
        "钥匙孔围道沿正实轴切割的两侧走。在切割下方，$z$ 的辐角增加了 $2\\pi$，所以分数幂在那里多一个常数因子。",
      ],
      (rng) => {
        const [p, q] = fraction(rng, 30);
        const r = Q.of(p, q).toLatex();
        return choose(
          rng,
          [
            `With $0 < \\arg z < 2\\pi$, the value of $z^{${r}}$ below the cut is the value above it times which factor?`,
            `当 $0 < \\arg z < 2\\pi$ 时，切割下方 $z^{${r}}$ 的值是上方的值乘哪个因子？`,
          ],
          same(`e^{2\\pi i \\cdot ${r}}`),
          [same(`e^{\\pi i \\cdot ${r}}`), same(`e^{-2\\pi i \\cdot ${r}}`), same(`e^{2\\pi i}`)],
          [
            `The argument grows by $2\\pi$, and the power multiplies it by ${r === "" ? "" : `$${r}$`}.`,
            `辐角增加 $2\\pi$，幂再把它乘 $${r}$。`,
          ],
        );
      },
    ),
    point(
      "a-fractional-power-integral",
      ["A fractional power integral", "分数幂积分"],
      [
        "The keyhole method gives $\\int_{0}^{\\infty} \\frac{x^{a-1}}{1 + x}\\, dx = \\frac{\\pi}{\\sin(\\pi a)}$ for $0 < a < 1$. The pole at $-1$ supplies the residue, and the jump across the cut supplies the sine.",
        "钥匙孔方法给出，当 $0 < a < 1$ 时 $\\int_{0}^{\\infty} \\frac{x^{a-1}}{1 + x}\\, dx = \\frac{\\pi}{\\sin(\\pi a)}$。$-1$ 处的极点提供留数，切割两侧的跃变提供正弦。",
      ],
      (rng) => {
        const k = rng.int(1, 15);
        const [e, s, a] = rng.pick([
          ["-\\frac{1}{2}", 1, "\\frac{1}{2}"],
          ["-\\frac{5}{6}", 2, "\\frac{1}{6}"],
          ["-\\frac{1}{6}", 2, "\\frac{5}{6}"],
        ] as [string, number, string][]);
        return ask(
          [
            `$\\int_{0}^{\\infty} \\frac{${k} x^{${e}}}{1 + x}\\, dx = m\\pi$. What is $m$?`,
            `$\\int_{0}^{\\infty} \\frac{${k} x^{${e}}}{1 + x}\\, dx = m\\pi$。$m$ 是多少？`,
          ],
          k * s,
          [k, Q.of(k, 2 * s), k * s + 1],
          [
            `Here $a = ${a}$, so $\\frac{1}{\\sin(\\pi a)} = ${s}$, and we multiply by ${k}.`,
            `这里 $a = ${a}$，所以 $\\frac{1}{\\sin(\\pi a)} = ${s}$，再乘 ${k}。`,
          ],
        );
      },
    ),
    point(
      "an-integral-with-a-logarithm",
      ["An integral with a logarithm", "带对数的积分"],
      [
        "A semicircle with an indentation at the origin handles a logarithm, because $\\log z$ is analytic in the upper half plane. It gives $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + b^{2}}\\, dx = \\frac{\\pi \\ln b}{2b}$.",
        "在原点凹陷的半圆可以处理对数，因为 $\\log z$ 在上半平面解析。它给出 $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + b^{2}}\\, dx = \\frac{\\pi \\ln b}{2b}$。",
      ],
      (rng) => {
        const b = rng.int(2, 40);
        return choose(
          rng,
          [
            `Evaluate $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + ${b * b}}\\, dx$.`,
            `计算 $\\int_{0}^{\\infty} \\frac{\\ln x}{x^{2} + ${b * b}}\\, dx$。`,
          ],
          same(`\\frac{\\pi \\ln ${b}}{${2 * b}}`),
          [same(`\\frac{\\pi \\ln ${b}}{${b}}`), same(`\\frac{\\pi}{${2 * b}}`), same(`0`)],
          [
            `The formula applies with $b = ${b}$, and the integral is positive because $b > 1$.`,
            `公式取 $b = ${b}$，积分为正，因为 $b > 1$。`,
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
        "The function $\\pi \\cot(\\pi z)$ has a simple pole at every integer, always with residue 1. So multiplying by $f(z)$ places $f(n)$ as the residue at $n$, and a large contour adds them up.",
        "函数 $\\pi \\cot(\\pi z)$ 在每个整数处都有单极点，留数总是 1。所以乘 $f(z)$ 就使 $f(n)$ 成为 $n$ 处的留数，大围道把它们加起来。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(-20, 20);
        const n = rng.int(-9, 9);
        return ask(
          [
            `What is the residue of $\\pi \\cot(\\pi z) \\cdot (${a}z^{2}${plus(b)})$ at $z = ${n}$?`,
            `$\\pi \\cot(\\pi z) \\cdot (${a}z^{2}${plus(b)})$ 在 $z = ${n}$ 处的留数是多少？`,
          ],
          a * n * n + b,
          [a * n * n, a * n + b, b],
          [
            `The cotangent factor has residue 1, so this is the polynomial's value at ${n}.`,
            `余切因子的留数是 1，所以这是多项式在 ${n} 处的值。`,
          ],
        );
      },
    ),
    point(
      "the-residue-at-the-origin",
      ["The residue at the origin", "原点处的留数"],
      [
        "For $f(z) = \\frac{1}{z^{2}}$, the pole at 0 has order three, and the expansion $\\pi \\cot(\\pi z) = \\frac{1}{z} - \\frac{\\pi^{2} z}{3} - \\dots$ gives a residue of $-\\frac{\\pi^{2}}{3}$ there. This is what balances the sum.",
        "对 $f(z) = \\frac{1}{z^{2}}$，0 处的极点是三阶的，展开式 $\\pi \\cot(\\pi z) = \\frac{1}{z} - \\frac{\\pi^{2} z}{3} - \\dots$ 给出那里的留数 $-\\frac{\\pi^{2}}{3}$。正是它平衡了求和。",
      ],
      (rng) => {
        const k = rng.int(1, 40);
        return ask(
          [
            `The residue of $\\frac{${k}\\pi \\cot(\\pi z)}{z^{2}}$ at 0 is $m\\pi^{2}$. What is $m$?`,
            `$\\frac{${k}\\pi \\cot(\\pi z)}{z^{2}}$ 在 0 处的留数是 $m\\pi^{2}$。$m$ 是多少？`,
          ],
          Q.of(-k, 3),
          [Q.of(k, 3), Q.of(-k, 6), Q.of(-k, 2)],
          [
            `Only the term $-\\frac{\\pi^{2} z}{3}$ gives a $\\frac{1}{z}$ after dividing by $z^{2}$.`,
            `除以 $z^{2}$ 后，只有 $-\\frac{\\pi^{2} z}{3}$ 这一项给出 $\\frac{1}{z}$。`,
          ],
        );
      },
    ),
    point(
      "summing-the-reciprocal-powers",
      ["Summing the reciprocal powers", "对倒数幂求和"],
      [
        "All the residues on the big contour add to zero, so twice the sum over positive $n$ balances the residue at 0. For squares this gives $\\frac{\\pi^{2}}{6}$, and the same method gives $\\frac{\\pi^{4}}{90}$ for fourth powers.",
        "大围道内所有留数之和为零，所以对正整数 $n$ 的和的两倍与 0 处的留数平衡。对平方这给出 $\\frac{\\pi^{2}}{6}$，同样的方法对四次方给出 $\\frac{\\pi^{4}}{90}$。",
      ],
      (rng) => {
        const k = rng.int(1, 40);
        const four = rng.bool();
        return ask(
          [
            `$\\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${four ? 4 : 2}}} = m\\pi^{${four ? 4 : 2}}$. What is $m$?`,
            `$\\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${four ? 4 : 2}}} = m\\pi^{${four ? 4 : 2}}$。$m$ 是多少？`,
          ],
          Q.of(k, four ? 90 : 6),
          [Q.of(k, four ? 45 : 3), Q.of(k, four ? 180 : 12), Q.of(k, four ? 96 : 8)],
          [
            `The basic sum is $\\frac{\\pi^{${four ? 4 : 2}}}{${four ? 90 : 6}}$, and we multiply by ${k}.`,
            `基本的和是 $\\frac{\\pi^{${four ? 4 : 2}}}{${four ? 90 : 6}}$，再乘 ${k}。`,
          ],
        );
      },
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
        "Substituting $\\frac{a}{z}$ into the exponential series gives infinitely many negative powers. The coefficient of $z^{-n}$ in $e^{a/z}$ is $\\frac{a^{n}}{n!}$, and this infinite tail is the mark of an essential singularity.",
        "把 $\\frac{a}{z}$ 代入指数级数，得到无穷多个负幂。$e^{a/z}$ 中 $z^{-n}$ 的系数是 $\\frac{a^{n}}{n!}$，这个无穷的尾部就是本性奇点的标志。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const n = rng.int(1, 5);
        let fact = 1;
        for (let i = 2; i <= n; i++) fact *= i;
        return ask(
          [
            `What is the coefficient of $z^{-${n}}$ in the Laurent series of $e^{${a}/z}$ at 0?`,
            `$e^{${a}/z}$ 在 0 处的洛朗级数中 $z^{-${n}}$ 的系数是多少？`,
          ],
          Q.of(a ** n, fact),
          [Q.of(a, fact), Q.of(a ** n, fact * (n + 1)), a ** n + 1],
          [`The exponential series gives $\\frac{(${a}/z)^{${n}}}{${n}!}$.`, `指数级数给出 $\\frac{(${a}/z)^{${n}}}{${n}!}$。`],
        );
      },
    ),
    point(
      "naming-the-singularity",
      ["Naming the singularity", "说出奇点的类型"],
      [
        "A removable singularity has no negative powers, a pole has finitely many, and an essential singularity has infinitely many. Casorati and Weierstrass show that near the last kind, values come close to every complex number.",
        "可去奇点没有负幂，极点有有限个，本性奇点有无穷多个。卡索拉蒂和魏尔斯特拉斯证明，在最后一种奇点附近，函数值可以接近每个复数。",
      ],
      (rng) => {
        const k = rng.int(2, 30);
        const kind = rng.int(0, 2);
        const names: [string, string][] = [
          ["Essential", "本性奇点"],
          ["A pole", "极点"],
          ["Removable", "可去奇点"],
        ];
        const f = kind === 0 ? `e^{${k}/z}` : kind === 1 ? `\\frac{e^{z}}{z^{${k}}}` : `\\frac{e^{${k}z} - 1}{z}`;
        return choose(
          rng,
          [`What kind of singularity does $${f}$ have at 0?`, `$${f}$ 在 0 处是什么类型的奇点？`],
          names[kind] as [string, string],
          names.filter((_, i) => i !== kind).concat([[`No singularity at all`, `根本没有奇点`]]),
          [
            kind === 0
              ? `Its Laurent series $\\sum_{n \\ge 0} \\frac{${k}^{n}}{n!\\, z^{n}}$ has infinitely many negative powers, so the singularity is essential.`
              : kind === 1
                ? `Its Laurent series starts with $z^{-${k}}$, so it has finitely many negative powers, and the singularity is a pole.`
                : `The series of $e^{${k}z} - 1$ starts with $${k}z$, so the quotient has no negative powers, and the singularity is removable.`,
            kind === 0
              ? `它的洛朗级数 $\\sum_{n \\ge 0} \\frac{${k}^{n}}{n!\\, z^{n}}$ 有无穷多个负幂，所以是本性奇点。`
              : kind === 1
                ? `它的洛朗级数从 $z^{-${k}}$ 开始，负幂只有有限个，所以是极点。`
                : `$e^{${k}z} - 1$ 的级数从 $${k}z$ 开始，所以商没有负幂，是可去奇点。`,
          ],
        );
      },
    ),
    point(
      "the-value-that-is-missed",
      ["The value that is missed", "取不到的值"],
      [
        "Picard's great theorem strengthens the result: near an essential singularity, a function takes every value infinitely often, with at most one exception. For $e^{1/z}$ the exception is 0, because an exponential never vanishes.",
        "皮卡大定理加强了这个结果：在本性奇点附近，函数取到每个值无穷多次，至多有一个例外。对 $e^{1/z}$，例外是 0，因为指数函数永不为零。",
      ],
      (rng) => {
        const c = rng.nonZero(-30, 30);
        const k = rng.int(2, 15);
        return ask(
          [
            `Near 0, the function $e^{${k}/z}${plus(c)}$ takes every complex value infinitely often except one. What is that value?`,
            `在 0 附近，函数 $e^{${k}/z}${plus(c)}$ 取到每个复数值无穷多次，只有一个例外。这个值是多少？`,
          ],
          c,
          [c + 1, k + c, 0 === c ? k : 0],
          [`The exponential misses only 0, so the sum misses $${c}$.`, `指数函数只取不到 0，所以和取不到 $${c}$。`],
        );
      },
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
        "The map $\\frac{z - i}{z + i}$ sends the upper half plane onto the unit disc, with $i$ going to the center. It is the standard way to move a problem between these two regions.",
        "映射 $\\frac{z - i}{z + i}$ 把上半平面映到单位圆盘，$i$ 映到圆心。这是在这两个区域之间转移问题的标准方法。",
      ],
      (rng) => {
        const a = rng.int(2, 40);
        const k = rng.bool();
        return ask(
          k
            ? [
                `Where does the Cayley transform $\\frac{z - i}{z + i}$ send $z = ${a}i$?`,
                `凯莱变换 $\\frac{z - i}{z + i}$ 把 $z = ${a}i$ 映到哪里？`,
              ]
            : [
                `Where does the Cayley transform $\\frac{z - i}{z + i}$ send $z = \\frac{i}{${a}}$?`,
                `凯莱变换 $\\frac{z - i}{z + i}$ 把 $z = \\frac{i}{${a}}$ 映到哪里？`,
              ],
          k ? Q.of(a - 1, a + 1) : Q.of(1 - a, a + 1),
          k ? [Q.of(a + 1, a - 1), Q.of(1, a + 1), Q.of(a, a + 1)] : [Q.of(a - 1, a + 1), Q.of(1, a + 1), Q.of(a + 1, a - 1)],
          [`Cancel $i$ from the numerator and denominator, leaving a real fraction.`, `分子分母约去 $i$，留下一个实分数。`],
        );
      },
    ),
    point(
      "which-region-qualifies",
      ["Which region qualifies", "哪个区域符合条件"],
      [
        "Every simply connected region other than the whole plane can be mapped conformally onto the unit disc. The whole plane cannot, because Liouville's theorem would force such a bounded map to be constant.",
        "除整个平面外，每个单连通区域都能共形映到单位圆盘。整个平面不行，因为刘维尔定理会迫使这样的有界映射成为常数。",
      ],
      (rng) => {
        const a = rng.int(1, 30);
        const b = a + rng.int(1, 30);
        return choose(
          rng,
          [`Which region cannot be mapped conformally onto the unit disc?`, `哪个区域不能共形映到单位圆盘？`],
          same(`\\{z : ${a} < |z| < ${b}\\}`),
          [
            same(`\\{z : ${a} < \\operatorname{Im} z < ${b}\\}`),
            same(`\\{z : \\operatorname{Re} z > ${b}\\}`),
            same(`\\{z : |z - ${a}| < ${b}\\}`),
          ],
          [`An annulus has a hole, so it is not simply connected, unlike the other regions.`, `圆环有洞，所以不是单连通的，其他区域都是。`],
        );
      },
    ),
    point(
      "opening-a-sector",
      ["Opening a sector", "打开扇形"],
      [
        "A power map multiplies angles at the origin, so it opens a sector of angle $\\alpha$ into the upper half plane when the power is $\\frac{\\pi}{\\alpha}$. Combining this with the Cayley transform maps sectors onto the disc.",
        "幂映射使原点处的角度成倍，所以幂为 $\\frac{\\pi}{\\alpha}$ 时，它把角度为 $\\alpha$ 的扇形打开成上半平面。再结合凯莱变换，就把扇形映到圆盘。",
      ],
      (rng) => {
        const q = rng.int(2, 30);
        const p = rng.int(1, 9);
        return ask(
          [
            `Which power $z^{m}$ opens the sector $0 < \\arg z < ${piFraction(p, q)}$ onto the upper half plane? Give $m$.`,
            `哪个幂 $z^{m}$ 把扇形 $0 < \\arg z < ${piFraction(p, q)}$ 打开成上半平面？给出 $m$。`,
          ],
          Q.of(q, p),
          [Q.of(p, q), Q.of(2 * q, p), Q.of(q, 2 * p)],
          [
            `The angle must grow to $\\pi$, so $m = \\pi \\div ${piFraction(p, q)}$.`,
            `角度要增大到 $\\pi$，所以 $m = \\pi \\div ${piFraction(p, q)}$。`,
          ],
        );
      },
    ),
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
        "The Joukowski map sends $z$ to $z + \\frac{1}{z}$. It treats $z$ and $\\frac{1}{z}$ alike, so the outside of the unit disc is mapped one to one and the inside gives the same picture.",
        "儒科夫斯基映射把 $z$ 映到 $z + \\frac{1}{z}$。它对 $z$ 和 $\\frac{1}{z}$ 一视同仁，所以单位圆外部是一一映射，内部给出相同的图像。",
      ],
      (rng) => {
        const a = rng.int(2, 25);
        const k = rng.int(1, 9);
        const inverse = rng.bool();
        return ask(
          [
            `Let $J(z) = ${k === 1 ? "" : k}\\left(z + \\frac{1}{z}\\right)$. What is $J\\left(${inverse ? `\\frac{1}{${a}}` : `${a}`}\\right)$?`,
            `设 $J(z) = ${k === 1 ? "" : k}\\left(z + \\frac{1}{z}\\right)$。$J\\left(${inverse ? `\\frac{1}{${a}}` : `${a}`}\\right)$ 是多少？`,
          ],
          Q.of(k * (a * a + 1), a),
          [Q.of(k * (a * a - 1), a), Q.of(k, a), k * a],
          [`Add $${a}$ and $\\frac{1}{${a}}$, then multiply by ${k}.`, `把 $${a}$ 和 $\\frac{1}{${a}}$ 相加，再乘 ${k}。`],
        );
      },
    ),
    point(
      "the-ellipse-from-a-circle",
      ["The ellipse from a circle", "由圆得到椭圆"],
      [
        "The circle $|z| = R$ with $R > 1$ goes to an ellipse with semi axes $R + \\frac{1}{R}$ and $R - \\frac{1}{R}$. Larger circles become rounder, since the term $\\frac{1}{R}$ then matters less.",
        "$R > 1$ 时，圆 $|z| = R$ 映到半轴为 $R + \\frac{1}{R}$ 和 $R - \\frac{1}{R}$ 的椭圆。圆越大越接近圆形，因为 $\\frac{1}{R}$ 这一项的作用越小。",
      ],
      (rng) => {
        const q = rng.int(1, 9);
        const p = q + rng.int(1, 9);
        const major = rng.bool();
        const r = Q.of(p, q);
        return ask(
          [
            `What is the ${major ? "major" : "minor"} semi axis of the image of $|z| = ${r.toLatex()}$ under $z + \\frac{1}{z}$?`,
            `$|z| = ${r.toLatex()}$ 在 $z + \\frac{1}{z}$ 下的像的半${major ? "长" : "短"}轴是多少？`,
          ],
          major ? Q.of(p * p + q * q, p * q) : Q.of(p * p - q * q, p * q),
          major ? [Q.of(p * p - q * q, p * q), Q.of(p, q), Q.of(2 * p, q)] : [Q.of(p * p + q * q, p * q), Q.of(p, q), Q.of(q, p)],
          [
            `The semi axis is $R ${major ? "+" : "-"} \\frac{1}{R}$ with $R = ${r.toLatex()}$.`,
            `半轴是 $R ${major ? "+" : "-"} \\frac{1}{R}$，其中 $R = ${r.toLatex()}$。`,
          ],
        );
      },
    ),
    point(
      "the-unit-circle-collapses",
      ["The unit circle collapses", "单位圆塌缩"],
      [
        "On the unit circle $\\frac{1}{z}$ is the conjugate of $z$, so $z + \\frac{1}{z}$ is twice the real part. The whole circle therefore collapses onto a real segment, traversed back and forth.",
        "在单位圆上，$\\frac{1}{z}$ 是 $z$ 的共轭，所以 $z + \\frac{1}{z}$ 是实部的两倍。因此整个圆塌缩到一条实线段上，并被来回走过。",
      ],
      (rng) => {
        const k = rng.int(2, 40);
        return ask(
          [
            `What is the length of the image of $|z| = 1$ under $${k}\\left(z + \\frac{1}{z}\\right)$?`,
            `$|z| = 1$ 在 $${k}\\left(z + \\frac{1}{z}\\right)$ 下的像的长度是多少？`,
          ],
          4 * k,
          [2 * k, k, 8 * k],
          [
            `The image is the segment from $-${2 * k}$ to ${2 * k}, whose length is ${4 * k}.`,
            `像是从 $-${2 * k}$ 到 ${2 * k} 的线段，长度是 ${4 * k}。`,
          ],
        );
      },
    ),
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
        "The function $r^{n} \\cos(n\\theta)$ is the real part of $z^{n}$, so it is harmonic. To match the boundary value $A \\cos(n\\theta)$ on radius $R$, scale it to $A \\left(\\frac{r}{R}\\right)^{n} \\cos(n\\theta)$.",
        "函数 $r^{n} \\cos(n\\theta)$ 是 $z^{n}$ 的实部，所以是调和函数。要在半径 $R$ 上匹配边界值 $A \\cos(n\\theta)$，把它缩放成 $A \\left(\\frac{r}{R}\\right)^{n} \\cos(n\\theta)$。",
      ],
      (rng) => {
        const big = rng.int(2, 12);
        const r = rng.int(1, big - 1);
        const n = rng.int(2, 5);
        const a = rng.int(2, 30);
        return ask(
          [
            `$u$ is harmonic on $r < ${big}$, with $u = ${a}\\cos(${n}\\theta)$ on the boundary. What is $u$ at $r = ${r}$, $\\theta = 0$?`,
            `$u$ 在 $r < ${big}$ 上调和，边界上 $u = ${a}\\cos(${n}\\theta)$。$u$ 在 $r = ${r}$、$\\theta = 0$ 处的值是多少？`,
          ],
          Q.of(a * r ** n, big ** n),
          [a, Q.of(a * r, big), Q.of(a * r ** n, big ** (n + 1))],
          [
            `The solution is $${a}\\left(\\frac{r}{${big}}\\right)^{${n}}\\cos(${n}\\theta)$.`,
            `解是 $${a}\\left(\\frac{r}{${big}}\\right)^{${n}}\\cos(${n}\\theta)$。`,
          ],
        );
      },
    ),
    point(
      "the-center-value",
      ["The center value", "圆心的值"],
      [
        "The mean value property gives the value at the center directly, as the average of the boundary data. Over a full circle, all the sines and cosines of positive multiples of $\\theta$ average to zero.",
        "平均值性质直接给出圆心的值，即边界数据的平均。在整个圆周上，$\\theta$ 的正整数倍的正弦和余弦的平均都是零。",
      ],
      (rng) => {
        const [a, b, c] = [rng.nonZero(-30, 30), rng.int(2, 15), rng.int(2, 15)];
        const big = rng.int(1, 12);
        return ask(
          [
            `$u$ is harmonic on $r < ${big}$, and on the boundary $u = ${a} + ${b}\\cos\\theta + ${c}\\sin(2\\theta)$. What is $u$ at the center?`,
            `$u$ 在 $r < ${big}$ 上调和，边界上 $u = ${a} + ${b}\\cos\\theta + ${c}\\sin(2\\theta)$。$u$ 在圆心的值是多少？`,
          ],
          a,
          [a + b, a + b + c, b + c],
          [`The oscillating terms average to zero, which leaves the constant ${a}.`, `振荡项的平均为零，只留下常数 ${a}。`],
        );
      },
    ),
    point(
      "a-half-plane-with-two-values",
      ["A half plane with two values", "取两个值的半平面"],
      [
        "The argument $\\theta$ is harmonic, being the imaginary part of $\\log z$. So in the upper half plane, the function $c + (d - c)\\frac{\\theta}{\\pi}$ equals $c$ on the positive axis and $d$ on the negative axis.",
        "辐角 $\\theta$ 是调和函数，因为它是 $\\log z$ 的虚部。所以在上半平面，函数 $c + (d - c)\\frac{\\theta}{\\pi}$ 在正半轴上等于 $c$，在负半轴上等于 $d$。",
      ],
      (rng) => {
        const c = rng.int(-20, 20);
        const d = c + rng.int(1, 40);
        const [p, q] = fraction(rng, 12);
        return ask(
          [
            `$u$ is bounded and harmonic in the upper half plane, equal to ${c} on the positive real axis and ${d} on the negative real axis. What is $u$ where $\\theta = ${piFraction(p, q)}$?`,
            `$u$ 在上半平面有界且调和，在正实轴上等于 ${c}，在负实轴上等于 ${d}。$u$ 在 $\\theta = ${piFraction(p, q)}$ 处的值是多少？`,
          ],
          Q.of(c * q + (d - c) * p, q),
          [Q.of(d * q - (d - c) * p + 1, q), Q.of(c + d, 2), Q.of((d - c) * p, q)],
          [
            `The value goes from ${c} to ${d} in proportion to $\\frac{\\theta}{\\pi} = \\frac{${p}}{${q}}$.`,
            `值按 $\\frac{\\theta}{\\pi} = \\frac{${p}}{${q}}$ 的比例从 ${c} 变到 ${d}。`,
          ],
        );
      },
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
        "The Poisson kernel on the unit disc is $\\frac{1 - r^{2}}{1 - 2r\\cos\\theta + r^{2}}$, the weight given to boundary data. At $\\theta = 0$ it simplifies to $\\frac{1 + r}{1 - r}$, which is large when $r$ is near 1.",
        "单位圆盘上的泊松核是 $\\frac{1 - r^{2}}{1 - 2r\\cos\\theta + r^{2}}$，它是边界数据的权。在 $\\theta = 0$ 处化简为 $\\frac{1 + r}{1 - r}$，当 $r$ 接近 1 时很大。",
      ],
      (rng) => {
        const [p, q] = fraction(rng, 30);
        return ask(
          [
            `What is the Poisson kernel at $r = ${Q.of(p, q).toLatex()}$, $\\theta = 0$?`,
            `泊松核在 $r = ${Q.of(p, q).toLatex()}$、$\\theta = 0$ 处的值是多少？`,
          ],
          Q.of(q + p, q - p),
          [Q.of(q - p, q + p), Q.of(q * q - p * p, q * q), Q.of(q + p, q)],
          [
            `Near the boundary point the kernel equals $\\frac{1 + r}{1 - r}$, after canceling a factor $1 - r$.`,
            `在这个边界点附近，约去因子 $1 - r$ 后核等于 $\\frac{1 + r}{1 - r}$。`,
          ],
        );
      },
    ),
    point(
      "the-kernel-at-the-opposite-point",
      ["The kernel at the opposite point", "对面的核值"],
      [
        "At $\\theta = \\pi$ the kernel simplifies to $\\frac{1 - r}{1 + r}$, which is small. So a point near the boundary is influenced mostly by the nearby boundary data and very little by data on the far side.",
        "在 $\\theta = \\pi$ 处，核化简为 $\\frac{1 - r}{1 + r}$，它很小。所以靠近边界的点主要受附近边界数据影响，受对面数据的影响很小。",
      ],
      (rng) => {
        const [p, q] = fraction(rng, 30);
        return ask(
          [
            `What is the Poisson kernel at $r = ${Q.of(p, q).toLatex()}$, $\\theta = \\pi$?`,
            `泊松核在 $r = ${Q.of(p, q).toLatex()}$、$\\theta = \\pi$ 处的值是多少？`,
          ],
          Q.of(q - p, q + p),
          [Q.of(q + p, q - p), Q.of(q * q - p * p, q * q), Q.of(q - p, q)],
          [
            `With $\\cos\\pi = -1$, the denominator is $(1 + r)^{2}$, and a factor $1 + r$ cancels.`,
            `由 $\\cos\\pi = -1$，分母是 $(1 + r)^{2}$，约去一个因子 $1 + r$。`,
          ],
        );
      },
    ),
    point(
      "harnacks-inequality",
      ["Harnack's inequality", "哈纳克不等式"],
      [
        "A positive harmonic function is controlled by its value at the center, since the kernel lies between $\\frac{1 - r}{1 + r}$ and $\\frac{1 + r}{1 - r}$. This is Harnack's inequality, and it bounds the function at every interior point.",
        "正调和函数受圆心值控制，因为核介于 $\\frac{1 - r}{1 + r}$ 和 $\\frac{1 + r}{1 - r}$ 之间。这就是哈纳克不等式，它在每个内点给出函数的界。",
      ],
      (rng) => {
        const [p, q] = fraction(rng, 15);
        const c = rng.int(1, 30);
        const upper = rng.bool();
        return ask(
          [
            `$u$ is positive and harmonic on the unit disc, with $u(0) = ${c}$. What is Harnack's ${upper ? "upper" : "lower"} bound for $u$ at $r = ${Q.of(p, q).toLatex()}$?`,
            `$u$ 在单位圆盘上为正且调和，$u(0) = ${c}$。在 $r = ${Q.of(p, q).toLatex()}$ 处，$u$ 的哈纳克${upper ? "上" : "下"}界是多少？`,
          ],
          upper ? Q.of(c * (q + p), q - p) : Q.of(c * (q - p), q + p),
          upper ? [Q.of(c * (q - p), q + p), Q.of(q + p, q - p), c] : [Q.of(c * (q + p), q - p), Q.of(q - p, q + p), c],
          [
            `The kernel's ${upper ? "largest" : "smallest"} value at this radius is $${upper ? `\\frac{1 + r}{1 - r} = ${Q.of(q + p, q - p).toLatex()}` : `\\frac{1 - r}{1 + r} = ${Q.of(q - p, q + p).toLatex()}`}$, and we multiply it by ${c}.`,
            `这个半径上核的${upper ? "最大" : "最小"}值是 $${upper ? `\\frac{1 + r}{1 - r} = ${Q.of(q + p, q - p).toLatex()}` : `\\frac{1 - r}{1 + r} = ${Q.of(q - p, q + p).toLatex()}`}$，再乘 ${c}。`,
          ],
        );
      },
    ),
  ],
);

/** complexAnalysisExtraTopics holds the topics that complete the Complex Analysis course. */
export const complexAnalysisExtraTopics: readonly TopicDef[] = [
  riemannSphere,
  antiderivatives,
  meanValue,
  maximumModulus,
  algebra,
  schwarzLemma,
  localMapping,
  identity,
  reflection,
  continuation,
  gamma,
  sineProduct,
  infinityResidue,
  jordan,
  indented,
  keyhole,
  summing,
  casorati,
  riemannMapping,
  joukowski,
  dirichlet,
  poisson,
];
