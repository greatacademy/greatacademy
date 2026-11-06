// Third knowledge points for thin topics of Probability and Statistics, from random variables
// to joint distributions: the reverse question, a harder case or a common trap.
// See `deeperProbabilityAndStatisticsThirdPoints`.

import { type KnowledgePointDef, type Problem, type Rng, t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";
import { probabilityDrawings1 } from "../explanation-drawings-probability-and-statistics-1.ts";

import { numberProblem } from "../problems.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";

/** nz picks a nonzero integer from -r to r. */
export const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));

/** askDecimal builds a numeric problem whose answer is shown and accepted as a terminating decimal. */
export function askDecimal(prompt: Pair, answer: Q, wrong: readonly Q[], solution: Pair): Problem {
  const distinct: Q[] = [];
  for (const w of wrong) if (!w.eq(answer) && !distinct.some((d) => d.eq(w))) distinct.push(w);
  return numberProblem({ prompt: t(...prompt), answer, form: "decimal", wrong: distinct, solution: t(...solution) });
}

/** PHI lists values of the standard normal distribution function, ten thousandths keyed by hundredths of z. */
const PHI: Readonly<Record<number, number>> = {
  0: 5000,
  10: 5398,
  20: 5793,
  25: 5987,
  30: 6179,
  40: 6554,
  50: 6915,
  60: 7257,
  70: 7580,
  75: 7734,
  80: 7881,
  90: 8159,
  100: 8413,
  110: 8643,
  120: 8849,
  125: 8944,
  130: 9032,
  140: 9192,
  150: 9332,
  160: 9452,
  170: 9554,
  175: 9599,
  180: 9641,
  190: 9713,
  200: 9772,
  210: 9821,
  220: 9861,
  225: 9878,
  240: 9918,
  250: 9938,
};

/** phi gives the standard normal distribution function at z hundredths, as an exact four-digit decimal. */
export const phi = (z100: number) => Q.of(PHI[z100] as number, 10000);
/** zText writes z hundredths as a decimal. */
export const zText = (z100: number) => dec(Q.of(z100, 100));
/** given writes the table value of the distribution function at z hundredths. */
export const given = (z100: number) => `\\Phi(${zText(z100)}) = ${dec(phi(z100))}`;
/** givenAmong writes the table value at z hundredths with its neighbors in the table, so that the learner must work out which one applies. */
export const givenAmong = (z100: number) => {
  const keys = Object.keys(PHI)
    .map(Number)
    .sort((a, b) => a - b);
  const at = keys.indexOf(z100);
  return keys
    .slice(Math.max(0, at - 1), at + 2)
    .map(given)
    .join(", \\quad ");
};
/** oneMinus gives one minus a probability. */
export const oneMinus = (p: Q) => Q.of(1, 1).sub(p);

/** pow writes a power of a variable, leaving out the exponent 1. */
const pow = (v: string, n: number) => (n === 1 ? v : `${v}^{${n}}`);

const continuityWidth = point(
  "the-width-of-a-corrected-interval",
  ["The width of a corrected interval", "校正后区间的宽度"],
  [
    "A continuity correction replaces each integer by a unit interval around it. Included endpoints therefore extend the interval by a half, and excluded endpoints pull it in by a half, so strict and weak inequalities give corrected intervals of different widths.",
    "连续性校正把每个整数换成以它为中心的单位区间。所以包含端点时区间向外扩展一半，不包含端点时向内收缩一半，于是严格不等式与非严格不等式给出的校正区间宽度不同。",
  ],
  (rng) => {
    const a = rng.int(1, 40);
    const b = a + rng.int(2, 30);
    const lowIn = rng.bool();
    const highIn = rng.bool();
    const low = Q.of(2 * a + (lowIn ? -1 : 1), 2);
    const high = Q.of(2 * b + (highIn ? 1 : -1), 2);
    const answer = b - a + (lowIn ? 1 : 0) + (highIn ? 0 : -1);
    const event = `${a} ${lowIn ? "\\le" : "<"} X ${highIn ? "\\le" : "<"} ${b}`;
    return ask(
      [
        `An integer variable $X$ is approximated by a continuous variable with a continuity correction. Find the width of the interval that replaces the event $${event}$.`,
        `整数变量 $X$ 用连续变量近似，并做连续性校正。求代替事件 $${event}$ 的区间的宽度。`,
      ],
      answer,
      [b - a, b - a + 1, b - a - 1, b - a + 2],
      [
        `With the correction, the event becomes the interval $[${dec(low)}, ${dec(high)}]$, whose width is $${dec(high)} - ${dec(low)} = ${answer}$.`,
        `校正后，事件变为区间 $[${dec(low)}, ${dec(high)}]$，其宽度是 $${dec(high)} - ${dec(low)} = ${answer}$。`,
      ],
    );
  },
);

const simulateDiscrete = point(
  "simulating-a-discrete-variable-from-a-uniform-draw",
  ["Simulating a discrete variable from a uniform draw", "用均匀随机数模拟离散变量"],
  [
    "To simulate a discrete variable, divide $[0, 1]$ into pieces with lengths equal to the probabilities. A uniform draw $u$ returns the smallest value whose cumulative probability reaches $u$, so each value appears with the right probability.",
    "模拟离散变量时，把 $[0, 1]$ 分成长度等于各概率的小段。均匀随机数 $u$ 返回累积概率达到 $u$ 的最小值，所以每个值都以正确的概率出现。",
  ],
  (rng) => {
    const p1 = rng.int(1, 4);
    const p2 = rng.int(1, 3);
    const p3 = rng.int(1, 2);
    const ps = [p1, p2, p3, 10 - p1 - p2 - p3];
    const vs = rng
      .sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4)
      .slice()
      .sort((x, y) => x - y);
    const u = rng.pick([...Array(99).keys()].map((i) => i + 1).filter((i) => i % 10 !== 0));
    let cumulative = 0;
    let index = 0;
    for (let i = 0; i < 4; i++) {
      cumulative += 10 * (ps[i] as number);
      if (u < cumulative) {
        index = i;
        break;
      }
    }
    const answer = vs[index] as number;
    const table = vs.map((v, i) => `P(X = ${v}) = ${dec(Q.of(ps[i] as number, 10))}`).join(",\\ ");
    const others = vs.filter((_, i) => i !== index);
    return ask(
      [
        `$X$ has $${table}$. Using the inverse transform in the order listed, find the value simulated from the uniform draw $u = ${dec(Q.of(u, 100))}$.`,
        `$X$ 满足 $${table}$。按所列顺序使用逆变换法，求由均匀随机数 $u = ${dec(Q.of(u, 100))}$ 模拟出的值。`,
      ],
      answer,
      others,
      [
        `The cumulative probabilities first reach $u$ at $${dec(Q.of(cumulative, 100))}$, which belongs to the value $${answer}$. So the draw returns $${answer}$.`,
        `累积概率首次达到 $u$ 是在 $${dec(Q.of(cumulative, 100))}$，它对应值 $${answer}$。所以这个随机数返回 $${answer}$。`,
      ],
    );
  },
);

const notOneToOne = point(
  "when-a-transformation-is-not-one-to-one",
  ["When a transformation is not one to one", "变换不是一一对应时"],
  [
    "A one-to-one transformation just relabels the values and keeps their probabilities. A transformation such as $Y = X^{2}$ sends two values to the same result, so the probabilities of all the preimages must be added to find the probability of that result.",
    "一一对应的变换只是给各值换了标签，概率不变。像 $Y = X^{2}$ 这样的变换把两个值送到同一个结果，所以求这个结果的概率时，必须把所有原像的概率相加。",
  ],
  (rng) => {
    const cs = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];
    const total = cs.reduce((a, b) => a + b, 0);
    const k = rng.int(1, 2);
    const s = rng.int(-5, 5);
    const top = (cs[2 + k] as number) + (cs[2 - k] as number);
    const answer = Q.of(top, total);
    const table = cs.map((c, i) => `P(X = ${i - 2}) = ${Q.of(c, total).toLatex()}`).join(",\\ ");
    const y = k * k + s;
    return ask(
      [
        `$${table}$, and $Y = ${poly([1, "X^{2}"], [s, ""])}$. Find $P(Y = ${y})$.`,
        `$${table}$，$Y = ${poly([1, "X^{2}"], [s, ""])}$。求 $P(Y = ${y})$。`,
      ],
      answer,
      [Q.of(cs[2 + k] as number, total), Q.of(cs[2 - k] as number, total), Q.of(top, 2 * total)],
      [
        `$Y = ${y}$ exactly when $X = ${k}$ or $X = ${-k}$. Adding the two probabilities gives $${answer.toLatex()}$.`,
        `$Y = ${y}$ 当且仅当 $X = ${k}$ 或 $X = ${-k}$。把两个概率相加，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const squareDensity = point(
  "the-density-of-the-square-of-a-uniform-variable",
  ["The density of the square of a uniform variable", "均匀变量平方的密度"],
  [
    "Squaring a uniform variable does not give a uniform variable. The change-of-variables formula multiplies by the derivative of the inverse function, $\\frac{1}{2\\sqrt{y}}$, so the density of $Y = X^{2}$ is large near zero, where values of $X$ are squeezed together.",
    "均匀变量的平方不是均匀变量。变量替换公式要乘以反函数的导数 $\\frac{1}{2\\sqrt{y}}$，所以 $Y = X^{2}$ 的密度在零附近很大，因为那里 $X$ 的值被压缩到一起。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const s = rng.int(1, a - 1);
    const y = s * s;
    const answer = Q.of(1, 2 * a * s);
    return ask(
      [
        `$X$ is uniform on $(0, ${a})$ and $Y = X^{2}$. Find the density $f_{Y}(${y})$.`,
        `$X$ 在 $(0, ${a})$ 上服从均匀分布，$Y = X^{2}$。求密度 $f_{Y}(${y})$。`,
      ],
      answer,
      [Q.of(1, a), Q.of(1, a * s), Q.of(1, a * a)],
      [
        `The inverse is $x = \\sqrt{y}$, with derivative $\\frac{1}{2\\sqrt{y}}$, so $f_{Y}(y) = \\frac{1}{${a}} \\cdot \\frac{1}{2\\sqrt{y}}$. At $y = ${y}$ this is $${answer.toLatex()}$.`,
        `反函数是 $x = \\sqrt{y}$，导数为 $\\frac{1}{2\\sqrt{y}}$，所以 $f_{Y}(y) = \\frac{1}{${a}} \\cdot \\frac{1}{2\\sqrt{y}}$。在 $y = ${y}$ 处，它等于 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const varianceLinear = point(
  "the-variance-of-a-linear-function",
  ["The variance of a linear function", "线性函数的方差"],
  [
    "Adding a constant shifts every value but changes no distance from the mean, so it leaves the variance alone. Multiplying by a constant scales distances, and since variance uses squared distances, the factor is squared and a negative sign disappears.",
    "加常数使每个值平移，但不改变到均值的距离，所以方差不变。乘常数使距离按比例变化，而方差用的是距离的平方，所以因子要平方，负号也随之消失。",
  ],
  (rng) => {
    const v = rng.int(1, 20);
    const a = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    const b = nz(rng, 20);
    const answer = a * a * v;
    const y = rng.bool() ? poly([a, "X"], [b, ""]) : poly([b, ""], [a, "X"]);
    return ask(
      [
        `$\\operatorname{Var}(X) = ${v}$. Find $\\operatorname{Var}(${y})$.`,
        `$\\operatorname{Var}(X) = ${v}$。求 $\\operatorname{Var}(${y})$。`,
      ],
      answer,
      [a * v, answer + b, Math.abs(a) * v],
      [
        `The constant $${b}$ has no effect, and the factor $${a}$ is squared. So the variance is $${a * a} \\cdot ${v} = ${answer}$.`,
        `常数 $${b}$ 没有影响，因子 $${a}$ 要平方。所以方差是 $${a * a} \\cdot ${v} = ${answer}$。`,
      ],
    );
  },
);

const absoluteDeviation = point(
  "the-expected-distance-from-a-point",
  ["The expected distance from a point", "到一点的期望距离"],
  [
    "The rule of the lazy statistician integrates $g(x)$ against the density, and in general $E[g(X)]$ is not $g(E[X])$. An absolute value must be split at the point where its inside changes sign, which gives two simple integrals on either side.",
    "懒惰统计学家法则把 $g(x)$ 对密度积分，一般来说 $E[g(X)]$ 不等于 $g(E[X])$。绝对值要在内部变号的点处分开，这样得到两边两个简单的积分。",
  ],
  (rng) => {
    const L = rng.int(3, 12);
    const c = rng.int(1, L - 1);
    const left = c * c;
    const right = (L - c) ** 2;
    const answer = Q.of(left + right, 2 * L);
    return ask(
      [`$X$ is uniform on $[0, ${L}]$. Find $E[\\,|X - ${c}|\\,]$.`, `$X$ 在 $[0, ${L}]$ 上服从均匀分布。求 $E[\\,|X - ${c}|\\,]$。`],
      answer,
      [Q.of(Math.abs(L - 2 * c), 2), Q.of(L, 2), Q.of(left + right, L)],
      [
        `Split the integral at $${c}$. The two parts give $\\frac{1}{${L}}\\left(\\frac{${left}}{2} + \\frac{${right}}{2}\\right) = ${answer.toLatex()}$.`,
        `在 $${c}$ 处分开积分。两部分给出 $\\frac{1}{${L}}\\left(\\frac{${left}}{2} + \\frac{${right}}{2}\\right) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const shiftedMgf = point(
  "the-mgf-of-a-shifted-exponential-density",
  ["The MGF of a shifted exponential density", "平移指数密度的矩母函数"],
  [
    "If a density is moved to the right by $c$, the substitution $u = x - c$ in the defining integral pulls out a factor of $e^{ct}$. The remaining integral is the usual exponential one, which converges only for $t$ below the rate.",
    "如果密度向右平移 $c$，在定义积分中代换 $u = x - c$ 就能提出因子 $e^{ct}$。剩下的积分就是通常的指数积分，只有当 $t$ 小于速率时才收敛。",
  ],
  (rng) => {
    const l = rng.int(2, 12);
    const c = rng.int(1, 9);
    const e = poly([c, "t"]);
    const minus = poly([-c, "t"]);
    return choose(
      rng,
      [
        `$X$ has density $f(x) = ${l}e^{-${l}(x - ${c})}$ for $x > ${c}$. Find its moment-generating function for $t < ${l}$.`,
        `$X$ 的密度是 $f(x) = ${l}e^{-${l}(x - ${c})}$，$x > ${c}$。求它在 $t < ${l}$ 时的矩母函数。`,
      ],
      same(`\\frac{${l}e^{${e}}}{${l} - t}`),
      [same(`\\frac{${l}}{${l} - t}`), same(`\\frac{${l}e^{${minus}}}{${l} - t}`), same(`\\frac{${l}e^{${e}}}{${l} + t}`)],
      [
        `Substituting $u = x - ${c}$ pulls out $e^{${e}}$, and the remaining integral of $${l}e^{-${l}u}e^{tu}$ is $\\frac{${l}}{${l} - t}$. Their product is the MGF.`,
        `代换 $u = x - ${c}$ 提出 $e^{${e}}$，剩下 $${l}e^{-${l}u}e^{tu}$ 的积分是 $\\frac{${l}}{${l} - t}$。两者之积就是矩母函数。`,
      ],
    );
  },
);

const mgfMoments = point(
  "mean-and-variance-from-the-derivatives-of-an-mgf",
  ["Mean and variance from the derivatives of an MGF", "由矩母函数的导数求均值和方差"],
  [
    "The derivatives of an MGF at $t = 0$ give the moments: $M'(0) = E[X]$ and $M''(0) = E[X^{2}]$. The variance is then $M''(0) - M'(0)^{2}$. The second derivative alone is not the variance unless the mean is zero.",
    "矩母函数在 $t = 0$ 处的导数给出各阶矩：$M'(0) = E[X]$，$M''(0) = E[X^{2}]$。于是方差是 $M''(0) - M'(0)^{2}$。除非均值为零，否则二阶导数本身不是方差。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = rng.int(1, 12);
    const exponent = poly([a, "t"], [b, "t^{2}"]);
    const second = 2 * b + a * a;
    if (rng.bool()) {
      return ask(
        [
          `$X$ has the MGF $M(t) = e^{${exponent}}$. Find $\\operatorname{Var}(X)$.`,
          `$X$ 的矩母函数是 $M(t) = e^{${exponent}}$。求 $\\operatorname{Var}(X)$。`,
        ],
        2 * b,
        [second, b, a * a],
        [
          `$M'(0) = ${a}$ and $M''(0) = ${2 * b} + ${a * a} = ${second}$. So the variance is $${second} - ${a * a} = ${2 * b}$.`,
          `$M'(0) = ${a}$，$M''(0) = ${2 * b} + ${a * a} = ${second}$。所以方差是 $${second} - ${a * a} = ${2 * b}$。`,
        ],
      );
    }
    return ask(
      [`$X$ has the MGF $M(t) = e^{${exponent}}$. Find $E[X^{2}]$.`, `$X$ 的矩母函数是 $M(t) = e^{${exponent}}$。求 $E[X^{2}]$。`],
      second,
      [2 * b, b + a * a, a * a],
      [
        `$M'(t) = (${poly([a, ""], [2 * b, "t"])})M(t)$, and differentiating again at $t = 0$ gives $M''(0) = ${2 * b} + ${a * a} = ${second}$.`,
        `$M'(t) = (${poly([a, ""], [2 * b, "t"])})M(t)$，再求导并令 $t = 0$，得 $M''(0) = ${2 * b} + ${a * a} = ${second}$。`,
      ],
    );
  },
);

const missingSummand = point(
  "identifying-the-other-summand-from-mgfs",
  ["Identifying the other summand from MGFs", "由矩母函数识别另一个加数"],
  [
    "For independent variables, the MGF of the sum is the product of the MGFs. So dividing the MGF of the sum by that of one summand gives the MGF of the other, and the uniqueness property then identifies its distribution and so its mean.",
    "对独立变量，和的矩母函数等于各矩母函数之积。所以用和的矩母函数除以一个加数的矩母函数，就得到另一个加数的矩母函数，再由唯一性确定它的分布和均值。",
  ],
  (rng) => {
    if (rng.bool()) {
      const p = rng.pick([10, 20, 25, 30, 40, 50, 60, 75, 80]);
      const n = rng.int(2, 9);
      const m = rng.int(2, 9);
      const base = `${dec(Q.of(100 - p, 100))} + ${dec(Q.of(p, 100))}e^{t}`;
      return askDecimal(
        [
          `$X$ and $Y$ are independent, $M_{X}(t) = (${base})^{${n}}$ and $M_{X + Y}(t) = (${base})^{${n + m}}$. Find $E[Y]$.`,
          `$X$ 与 $Y$ 独立，$M_{X}(t) = (${base})^{${n}}$，$M_{X + Y}(t) = (${base})^{${n + m}}$。求 $E[Y]$。`,
        ],
        Q.of(m * p, 100),
        [Q.of((n + m) * p, 100), Q.of(m, 1), Q.of(n * p, 100), Q.of(p, 100)],
        [
          `Dividing gives $M_{Y}(t) = (${base})^{${m}}$, so $Y$ is binomial with $n = ${m}$ and $p = ${dec(Q.of(p, 100))}$. Its mean is $${dec(Q.of(m * p, 100))}$.`,
          `相除得 $M_{Y}(t) = (${base})^{${m}}$，所以 $Y$ 服从二项分布，$n = ${m}$，$p = ${dec(Q.of(p, 100))}$。它的均值是 $${dec(Q.of(m * p, 100))}$。`,
        ],
      );
    }
    const a = rng.int(2, 15);
    const b = rng.int(2, 15);
    return ask(
      [
        `$X$ and $Y$ are independent, $M_{X}(t) = e^{${a}(e^{t} - 1)}$ and $M_{X + Y}(t) = e^{${a + b}(e^{t} - 1)}$. Find $E[Y]$.`,
        `$X$ 与 $Y$ 独立，$M_{X}(t) = e^{${a}(e^{t} - 1)}$，$M_{X + Y}(t) = e^{${a + b}(e^{t} - 1)}$。求 $E[Y]$。`,
      ],
      b,
      [a + b, a, Q.of(a + b, a)],
      [
        `Dividing subtracts the exponents, so $M_{Y}(t) = e^{${b}(e^{t} - 1)}$. So $Y$ is Poisson with mean $${b}$.`,
        `相除时指数相减，所以 $M_{Y}(t) = e^{${b}(e^{t} - 1)}$。所以 $Y$ 服从均值为 $${b}$ 的泊松分布。`,
      ],
    );
  },
);

const twoPoint = point(
  "the-variance-of-a-two-valued-variable",
  ["The variance of a two-valued variable", "两值变量的方差"],
  [
    "Any variable with two values $u$ and $v$ is a linear function of a Bernoulli variable, so it can be written as $v + (u - v)X$. Therefore its variance is $(u - v)^{2}p(1 - p)$, and the gap between the values enters squared.",
    "任何只取两个值 $u$ 和 $v$ 的变量都是伯努利变量的线性函数，可以写成 $v + (u - v)X$。所以它的方差是 $(u - v)^{2}p(1 - p)$，两值之差以平方的形式出现。",
  ],
  (rng) => {
    const u = rng.int(-9, 9);
    const v = u + nz(rng, 8);
    const [pn, pd] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
    ] as const);
    const pq = Q.of(pn * (pd - pn), pd * pd);
    const gap = (u - v) ** 2;
    const answer = pq.mul(Q.of(gap, 1));
    const p = Q.of(pn, pd);
    return ask(
      [
        `$Y = ${u}$ with probability $${p.toLatex()}$ and $Y = ${v}$ otherwise. Find $\\operatorname{Var}(Y)$.`,
        `$Y$ 以概率 $${p.toLatex()}$ 取 $${u}$，否则取 $${v}$。求 $\\operatorname{Var}(Y)$。`,
      ],
      answer,
      [pq, pq.mul(Q.of(Math.abs(u - v), 1)), p.mul(Q.of(gap, 1))],
      [
        `$Y$ is a linear function of a Bernoulli variable with slope $${u - v}$. So the variance is $${gap} \\cdot ${pq.toLatex()} = ${answer.toLatex()}$.`,
        `$Y$ 是伯努利变量的线性函数，斜率为 $${u - v}$。所以方差是 $${gap} \\cdot ${pq.toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const whenPoissonWorks = point(
  "when-the-poisson-approximation-is-reliable",
  ["When the Poisson approximation is reliable", "泊松近似何时可靠"],
  [
    "Matching the mean is not enough for a Poisson approximation. It works when $n$ is large and $p$ is small, since then the variance $np(1 - p)$ is close to the mean. With a large $p$, the two differ and the approximation fails.",
    "泊松近似仅使均值相同是不够的。只有 $n$ 大且 $p$ 小时才有效，因为这时方差 $np(1 - p)$ 接近均值。当 $p$ 较大时两者相差很大，近似就失效了。",
  ],
  (rng) => {
    const l = rng.int(1, 30);
    const n = rng.pick([1000, 2000, 5000, 10000]);
    const bin = (size: number, p: Q) => same(`B(${size}, ${dec(p)})`);
    return choose(
      rng,
      [
        `Each binomial below has mean $${l}$. Which is best approximated by $\\operatorname{Po}(${l})$?`,
        `下面的二项分布均值都是 $${l}$。哪一个最适合用 $\\operatorname{Po}(${l})$ 近似？`,
      ],
      bin(n, Q.of(l, n)),
      [bin(2 * l, Q.of(1, 2)), bin(4 * l, Q.of(1, 4)), bin(5 * l, Q.of(1, 5))],
      [
        `The approximation needs large $n$ and small $p$. Only $n = ${n}$ has $p = ${dec(Q.of(l, n))}$ so small that the variance is nearly the mean $${l}$.`,
        `这种近似要求 $n$ 大而 $p$ 小。只有 $n = ${n}$ 时 $p = ${dec(Q.of(l, n))}$ 足够小，方差才接近均值 $${l}$。`,
      ],
    );
  },
);

const failures = point(
  "counting-failures-instead-of-trials",
  ["Counting failures instead of trials", "数失败次数而不是试验次数"],
  [
    "The negative binomial can count trials or failures, and the two differ by the constant $r$. So the mean of the failures is $\\frac{r(1 - p)}{p}$, which is $r$ less than the mean of the trials, while the variance is the same for both versions.",
    "负二项分布可以数试验次数，也可以数失败次数，两者相差常数 $r$。所以失败次数的均值是 $\\frac{r(1 - p)}{p}$，比试验次数的均值少 $r$，而两种形式的方差相同。",
  ],
  (rng) => {
    const r = rng.int(2, 9);
    const k = rng.int(2, 6);
    const p = Q.of(1, k);
    if (rng.bool()) {
      const answer = r * (k - 1);
      return ask(
        [
          `Trials with success probability $${p.toLatex()}$ continue until $${r}$ successes. Find the expected number of failures.`,
          `成功概率为 $${p.toLatex()}$ 的试验一直进行到 $${r}$ 次成功。求失败次数的期望。`,
        ],
        answer,
        [r * k, Q.of(r, k), k - 1],
        [
          `The expected number of trials is $${r} \\cdot ${k} = ${r * k}$, and $${r}$ of them are successes. So the expected number of failures is $${answer}$.`,
          `试验次数的期望是 $${r} \\cdot ${k} = ${r * k}$，其中 $${r}$ 次是成功。所以失败次数的期望是 $${answer}$。`,
        ],
      );
    }
    const answer = r * (k - 1) * k;
    return ask(
      [
        `Trials with success probability $${p.toLatex()}$ continue until $${r}$ successes. Find the variance of the number of failures.`,
        `成功概率为 $${p.toLatex()}$ 的试验一直进行到 $${r}$ 次成功。求失败次数的方差。`,
      ],
      answer,
      [r * (k - 1), r * k * k, answer - r],
      [
        `Failures equal trials minus the constant $${r}$, so the variance is that of the trials: $\\frac{r(1 - p)}{p^{2}} = ${r} \\cdot ${k - 1} \\cdot ${k} = ${answer}$.`,
        `失败次数等于试验次数减去常数 $${r}$，所以方差与试验次数相同：$\\frac{r(1 - p)}{p^{2}} = ${r} \\cdot ${k - 1} \\cdot ${k} = ${answer}$。`,
      ],
    );
  },
);

const binomialProbability = point(
  "a-binomial-probability-from-the-normal-table",
  ["A binomial probability from the normal table", "由正态分布表求二项概率"],
  [
    "To use the normal table for a binomial probability, correct for continuity first and then standardize. The direction of the correction depends on whether the endpoint is included, and an upper tail is one minus the table value.",
    "用正态分布表求二项概率时，要先做连续性校正，再标准化。校正的方向取决于端点是否包含在内，上尾概率等于一减去表中的值。",
  ],
  (rng) => {
    const z = 10 * rng.pick([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
    const kind = rng.int(0, 3);
    const boundaryTwice = 100 + z / 10;
    const k = kind === 0 || kind === 3 ? (boundaryTwice - 1) / 2 : (boundaryTwice + 1) / 2;
    const lower = kind < 2;
    const event = `X ${["\\le", "<", "\\ge", ">"][kind] as string} ${k}`;
    const raw = (k - 50) * 20;
    const answer = lower ? phi(z) : oneMinus(phi(z));
    const trap = lower ? phi(raw) : oneMinus(phi(raw));
    return askDecimal(
      [
        `$X \\sim B(100, 0.5)$. Use a normal approximation with continuity correction to find $P(${event})$. Use $${given(z)}$ and $${given(raw)}$.`,
        `$X \\sim B(100, 0.5)$。用带连续性校正的正态近似求 $P(${event})$。利用 $${given(z)}$ 和 $${given(raw)}$。`,
      ],
      answer,
      [trap, oneMinus(answer), oneMinus(trap)],
      [
        `The mean is $50$ and the standard deviation is $5$. The corrected boundary is $${dec(Q.of(boundaryTwice, 2))}$, which gives $z = ${zText(z)}$, so the probability is $${dec(answer)}$.`,
        `均值是 $50$，标准差是 $5$。校正后的边界是 $${dec(Q.of(boundaryTwice, 2))}$，于是 $z = ${zText(z)}$，所以概率是 $${dec(answer)}$。`,
      ],
    );
  },
);

const poissonProbability = point(
  "a-poisson-tail-from-the-normal-table",
  ["A Poisson tail from the normal table", "由正态分布表求泊松尾概率"],
  [
    "A Poisson variable with a large mean is close to normal, with variance equal to its mean. The standard deviation is therefore the square root of $\\lambda$, and because the variable counts, the boundary needs a continuity correction before it is standardized.",
    "均值较大的泊松变量接近正态分布，方差等于均值。所以标准差是 $\\lambda$ 的平方根，而且由于变量是计数的，边界在标准化之前要做连续性校正。",
  ],
  (rng) => {
    const large = rng.bool();
    const l = large ? 100 : 25;
    const z = large ? rng.pick([25, 75, 125, 175, 225]) : 10 * rng.pick([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
    const s = large ? 10 : 5;
    const boundary = Q.of(100 * l + s * z, 100);
    const m = (2 * (100 * l + s * z) + 100) / 200;
    const upper = rng.bool();
    const event = upper ? `X \\ge ${m}` : `X < ${m}`;
    const answer = upper ? oneMinus(phi(z)) : phi(z);
    return askDecimal(
      [
        `$X \\sim \\operatorname{Po}(${l})$. Use a normal approximation with continuity correction to find $P(${event})$. Use $${givenAmong(z)}$.`,
        `$X \\sim \\operatorname{Po}(${l})$。用带连续性校正的正态近似求 $P(${event})$。利用 $${givenAmong(z)}$。`,
      ],
      answer,
      [oneMinus(answer), phi(z).sub(Q.of(1, 2)), Q.of(1, 1).sub(phi(z).sub(Q.of(1, 2)))],
      [
        `The mean is $${l}$ and the standard deviation is $${s}$. The corrected boundary is $${dec(boundary)}$, which gives $z = ${zText(z)}$, so the probability is $${dec(answer)}$.`,
        `均值是 $${l}$，标准差是 $${s}$。校正后的边界是 $${dec(boundary)}$，于是 $z = ${zText(z)}$，所以概率是 $${dec(answer)}$。`,
      ],
    );
  },
);

const rectangle = {
  ...point(
    "a-rectangle-probability-from-the-joint-cdf",
    ["A rectangle probability from the joint CDF", "由联合分布函数求矩形概率"],
    [
      "The joint CDF gives the probability of a corner region. To isolate a rectangle, subtract the two regions on its left and below, and then add back the lower left corner, which has been subtracted twice. This is inclusion and exclusion applied to the CDF.",
      "联合分布函数给出角形区域的概率。要分离出一个矩形，先减去它左边和下边的两个区域，再加回被减了两次的左下角。这就是容斥原理在分布函数上的应用。",
    ],
    (rng) => {
      const a = rng.int(0, 3);
      const b = a + rng.int(1, 3);
      const c = rng.int(0, 3);
      const d = c + rng.int(1, 3);
      const A = rng.int(5, 30);
      const r = rng.int(5, 20);
      const s = rng.int(5, 20);
      const q = rng.int(5, 20);
      const x = (n: number) => dec(Q.of(n, 100));
      const data = `F(${a}, ${c}) = ${x(A)},\\ F(${b}, ${c}) = ${x(A + r)},\\ F(${a}, ${d}) = ${x(A + s)},\\ F(${b}, ${d}) = ${x(A + r + s + q)}`;
      const event = `${a} < X \\le ${b},\\ ${c} < Y \\le ${d}`;
      return askDecimal(
        [`A joint CDF has $${data}$. Find $P(${event})$.`, `联合分布函数满足 $${data}$。求 $P(${event})$。`],
        Q.of(q, 100),
        [Q.of(r + s + q, 100), Q.of(q + A, 100), Q.of(A + r + s + q, 100)],
        [
          `$P = F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c}) = ${x(A + r + s + q)} - ${x(A + s)} - ${x(A + r)} + ${x(A)} = ${x(q)}$.`,
          `$P = F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c}) = ${x(A + r + s + q)} - ${x(A + s)} - ${x(A + r)} + ${x(A)} = ${x(q)}$。`,
        ],
      );
    },
  ),
  figure: probabilityDrawings1["the-joint-cdf-of-two-discrete-random-variables#a-rectangle-probability-from-the-joint-cdf"],
};

const marginalMean = point(
  "a-mean-through-the-marginal-distribution",
  ["A mean through the marginal distribution", "通过边缘分布求均值"],
  [
    "The mean of one variable in a two-way table needs its marginal distribution: add across the other variable first, and then weight each value by its total. Using only one row would give a conditional mean rather than the overall mean.",
    "求两向表中一个变量的均值，需要它的边缘分布：先对另一个变量求和，再用各自的总和给每个值加权。只用一行得到的是条件均值，而不是总体均值。",
  ],
  (rng) => {
    const row0 = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)] as const;
    const row1 = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)] as const;
    const total = row0[0] + row0[1] + row0[2] + row1[0] + row1[1] + row1[2];
    const m1 = row0[0] + row1[0];
    const m2 = row0[1] + row1[1];
    const m3 = row0[2] + row1[2];
    const top = m1 + 2 * m2 + 3 * m3;
    const answer = Q.of(top, total);
    const cell = (x: number, y: number, c: number) => `P(${x}, ${y}) = ${Q.of(c, total).toLatex()}`;
    const data = [...row0.map((c, i) => cell(0, i + 1, c)), ...row1.map((c, i) => cell(1, i + 1, c))].join(",\\ ");
    const rowTotal = row0[0] + row0[1] + row0[2];
    return ask(
      [
        `$X \\in \\{0, 1\\}$ and $Y \\in \\{1, 2, 3\\}$ have the joint probabilities $${data}$, where the arguments are $(x, y)$. Find $E[Y]$.`,
        `$X \\in \\{0, 1\\}$ 与 $Y \\in \\{1, 2, 3\\}$ 的联合概率为 $${data}$，其中自变量是 $(x, y)$。求 $E[Y]$。`,
      ],
      answer,
      [Q.of(row0[0] + 2 * row0[1] + 3 * row0[2], rowTotal), 2, Q.of(top, 6)],
      [
        `The marginal probabilities of $Y$ have numerators $${m1}$, $${m2}$, $${m3}$ over $${total}$. So $E[Y] = \\frac{${m1} + 2 \\cdot ${m2} + 3 \\cdot ${m3}}{${total}} = ${answer.toLatex()}$.`,
        `$Y$ 的边缘概率分子是 $${m1}$、$${m2}$、$${m3}$，分母是 $${total}$。所以 $E[Y] = \\frac{${m1} + 2 \\cdot ${m2} + 3 \\cdot ${m3}}{${total}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const triangleMarginal = {
  ...point(
    "marginals-of-a-non-constant-density-on-a-triangle",
    ["Marginals of a non-constant density on a triangle", "三角形上非常数密度的边缘分布"],
    [
      "On a triangle, the limits of the integral for a marginal depend on the fixed variable. On $0 \\le y \\le x \\le 1$, integrating out $y$ runs from $0$ to $x$, while integrating out $x$ runs from $y$ to $1$, so the two marginals have different forms.",
      "在三角形上，求边缘密度的积分限依赖于固定的变量。在 $0 \\le y \\le x \\le 1$ 上，对 $y$ 积分时从 $0$ 到 $x$，对 $x$ 积分时从 $y$ 到 $1$，所以两个边缘密度形式不同。",
    ],
    (rng) => {
      const [p, q] = rng.pick([
        [1, 2],
        [1, 3],
        [2, 3],
        [1, 4],
        [3, 4],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
        [1, 6],
        [5, 6],
        [1, 10],
        [3, 10],
        [7, 10],
        [9, 10],
      ] as const);
      const v = Q.of(p, q);
      const square = v.mul(v);
      const forX = Q.of(4, 1).mul(square).mul(v);
      const forY = Q.of(4, 1).mul(v).mul(Q.of(1, 1).sub(square));
      const four = Q.of(4, 1).mul(v);
      const density = "f(x, y) = 8xy";
      const region = "0 \\le y \\le x \\le 1";
      if (rng.bool()) {
        return ask(
          [
            `$(X, Y)$ has density $${density}$ on $${region}$. Find $f_{X}(${v.toLatex()})$.`,
            `$(X, Y)$ 在 $${region}$ 上的密度是 $${density}$。求 $f_{X}(${v.toLatex()})$。`,
          ],
          forX,
          [forY, four, Q.of(8, 1).mul(square)],
          [
            `$f_{X}(x) = \\int_{0}^{x} 8xy\\,dy = 4x^{3}$, since $y$ runs from $0$ to $x$. At this point the value is $${forX.toLatex()}$.`,
            `$f_{X}(x) = \\int_{0}^{x} 8xy\\,dy = 4x^{3}$，因为 $y$ 从 $0$ 到 $x$。在这一点的值是 $${forX.toLatex()}$。`,
          ],
        );
      }
      return ask(
        [
          `$(X, Y)$ has density $${density}$ on $${region}$. Find $f_{Y}(${v.toLatex()})$.`,
          `$(X, Y)$ 在 $${region}$ 上的密度是 $${density}$。求 $f_{Y}(${v.toLatex()})$。`,
        ],
        forY,
        [forX, four, Q.of(8, 1).mul(square)],
        [
          `$f_{Y}(y) = \\int_{y}^{1} 8xy\\,dx = 4y(1 - y^{2})$, since $x$ runs from $y$ to $1$. At this point the value is $${forY.toLatex()}$.`,
          `$f_{Y}(y) = \\int_{y}^{1} 8xy\\,dx = 4y(1 - y^{2})$，因为 $x$ 从 $y$ 到 $1$。在这一点的值是 $${forY.toLatex()}$。`,
        ],
      );
    },
  ),
  figure: probabilityDrawings1["marginal-distributions-for-continuous-random-variables#marginals-of-a-non-constant-density-on-a-triangle"],
};

const independenceTests = {
  ...point(
    "both-the-formula-and-the-support-must-factor",
    ["Both the formula and the support must factor", "公式和支撑集都必须能分解"],
    [
      "Two continuous variables are independent only if the joint density factors into a function of $x$ times a function of $y$ and the support is a rectangle. A triangle fails even when the formula looks like a product, since the range of one variable depends on the other.",
      "两个连续变量独立，要求联合密度能分解为 $x$ 的函数与 $y$ 的函数之积，且支撑集是矩形。三角形不满足这一条，即使公式看起来是乘积，因为一个变量的范围依赖于另一个变量。",
    ],
    (rng) => {
      const m = rng.int(1, 5);
      const n = rng.int(1, 5);
      const a = rng.int(2, 6);
      const kind = rng.int(0, 2);
      const product = `${pow("x", m)}${pow("y", n)}`;
      const density = [
        `f(x, y) = ${(m + 1) * (n + 1)}${product}`,
        `f(x, y) = ${(n + 1) * (m + n + 2)}${product}`,
        `f(x, y) = \\frac{x + y}{${a ** 3}}`,
      ][kind] as string;
      const region = ["0 \\le x \\le 1,\\ 0 \\le y \\le 1", "0 \\le y \\le x \\le 1", `0 \\le x \\le ${a},\\ 0 \\le y \\le ${a}`][
        kind
      ] as string;
      const yes: Pair = ["Independent: the density factors and the support is a rectangle", "独立：密度能分解且支撑集是矩形"];
      const support: Pair = ["Not independent: the support is not a rectangle", "不独立：支撑集不是矩形"];
      const formula: Pair = ["Not independent: the density does not factor", "不独立：密度不能分解"];
      const option = [yes, support, formula][kind] as Pair;
      const others = [yes, support, formula].filter((o) => o !== option);
      const whys: Pair[] = [
        [
          "The formula is a function of $x$ times a function of $y$, and the region is a rectangle, so the density is the product of its marginals.",
          "公式是 $x$ 的函数乘以 $y$ 的函数，区域是矩形，所以密度等于边缘密度之积。",
        ],
        [
          "The formula looks like a product, but the range of $y$ depends on $x$, so knowing $X$ changes what $Y$ can be.",
          "公式看起来是乘积，但 $y$ 的范围依赖于 $x$，所以知道 $X$ 会改变 $Y$ 的可能取值。",
        ],
        [
          "The support is a rectangle, but a sum in $x$ and $y$ cannot be written as a function of $x$ times a function of $y$.",
          "支撑集是矩形，但 $x$ 与 $y$ 的和不能写成 $x$ 的函数乘以 $y$ 的函数。",
        ],
      ];
      return choose(
        rng,
        [`Are $X$ and $Y$ independent if $${density}$ on $${region}$?`, `如果在 $${region}$ 上 $${density}$，$X$ 与 $Y$ 是否独立？`],
        option,
        [...others, ["Independent: the density is nonnegative and integrates to one", "独立：密度非负且积分为一"]],
        whys[kind] as Pair,
      );
    },
  ),
  figure: probabilityDrawings1["independence-of-continuous-random-variables#both-the-formula-and-the-support-must-factor"],
};

const scaledComparison = point(
  "comparing-multiples-of-two-normal-variables",
  ["Comparing multiples of two normal variables", "比较两个正态变量的倍数"],
  [
    "To compare multiples of two independent normal variables, study their difference, which is normal as well. Its variance adds the two variances, each multiplied by the square of its coefficient, even though the variables are being subtracted.",
    "比较两个独立正态变量的倍数时，要研究它们的差，这个差也服从正态分布。它的方差是两个方差之和，每个都乘以系数的平方，尽管变量之间是相减的。",
  ],
  (rng) => {
    const p = rng.int(1, 3);
    let q = rng.int(1, 3);
    if (q === p) q = p === 3 ? 2 : p + 1;
    const w = rng.int(5, 20);
    const tenth = 2 * rng.int(1, 10);
    const z = 10 * tenth;
    const sd = 5 * p * q;
    const m2 = p * w;
    const m1 = q * (tenth / 2 + w);
    const s1 = 3 * q;
    const s2 = 4 * p;
    const left = poly([p, "X"]);
    const right = poly([q, "Y"]);
    return askDecimal(
      [
        `$X \\sim N(${m1}, ${s1 * s1})$ and $Y \\sim N(${m2}, ${s2 * s2})$ are independent. Find $P(${left} > ${right})$. Use $${givenAmong(z)}$.`,
        `$X \\sim N(${m1}, ${s1 * s1})$ 与 $Y \\sim N(${m2}, ${s2 * s2})$ 独立。求 $P(${left} > ${right})$。利用 $${givenAmong(z)}$。`,
      ],
      phi(z),
      [oneMinus(phi(z)), phi(z).sub(Q.of(1, 2)), Q.of(1, 2)],
      [
        `$${left} - ${right}$ has mean $${p * m1 - q * m2}$ and variance $${(p * s1) ** 2} + ${(q * s2) ** 2} = ${sd * sd}$, so its standard deviation is $${sd}$. This gives $z = ${zText(z)}$ and the probability $${dec(phi(z))}$.`,
        `$${left} - ${right}$ 的均值是 $${p * m1 - q * m2}$，方差是 $${(p * s1) ** 2} + ${(q * s2) ** 2} = ${sd * sd}$，所以标准差是 $${sd}$。于是 $z = ${zText(z)}$，概率是 $${dec(phi(z))}$。`,
      ],
    );
  },
);

const threeNormals = point(
  "a-probability-for-a-sum-of-three-normals",
  ["A probability for a sum of three normals", "三个正态变量之和的概率"],
  [
    "A sum of independent normal variables is normal, with the means added and the variances added. The standard deviations do not add. So the sum must be standardized with the square root of the total variance before the table can be used.",
    "独立正态变量之和仍服从正态分布，均值相加，方差相加。标准差不能相加。所以使用分布表之前，要用总方差的平方根把和标准化。",
  ],
  (rng) => {
    const [a, b, c, sd] = rng.pick([
      [4, 9, 12, 5],
      [1, 8, 16, 5],
      [5, 4, 16, 5],
      [36, 48, 16, 10],
      [25, 50, 25, 10],
      [64, 20, 16, 10],
    ] as const);
    const m1 = rng.int(5, 30);
    const m2 = rng.int(5, 30);
    const m3 = rng.int(5, 30);
    const tenth = 2 * rng.int(1, 10);
    const z = 10 * tenth;
    const mean = m1 + m2 + m3;
    const bound = mean + (sd * tenth) / 10;
    const lower = rng.bool();
    const answer = lower ? phi(z) : oneMinus(phi(z));
    const sum = "X_{1} + X_{2} + X_{3}";
    const event = `${sum} ${lower ? "\\le" : ">"} ${bound}`;
    const data = `X_{1} \\sim N(${m1}, ${a})$, $X_{2} \\sim N(${m2}, ${b})$, $X_{3} \\sim N(${m3}, ${c})`;
    return askDecimal(
      [
        `$${data}$ are independent. Find $P(${event})$. Use $${givenAmong(z)}$.`,
        `$${data}$ 相互独立。求 $P(${event})$。利用 $${givenAmong(z)}$。`,
      ],
      answer,
      [oneMinus(answer), phi(z).sub(Q.of(1, 2)), Q.of(1, 2)],
      [
        `The sum has mean $${mean}$ and variance $${a} + ${b} + ${c} = ${sd * sd}$, so its standard deviation is $${sd}$. Then $z = ${zText(z)}$, and the probability is $${dec(answer)}$.`,
        `和的均值是 $${mean}$，方差是 $${a} + ${b} + ${c} = ${sd * sd}$，所以标准差是 $${sd}$。于是 $z = ${zText(z)}$，概率是 $${dec(answer)}$。`,
      ],
    );
  },
);

const meanMinusOne = point(
  "the-variance-of-the-sample-mean-minus-one-observation",
  ["The variance of the sample mean minus one observation", "样本均值减一个观测的方差"],
  [
    "The sample mean contains each observation, so $\\bar{X}$ and $X_{1}$ are dependent and their variances cannot simply be added. Writing $\\bar{X} - X_{1}$ as a combination of the independent $X_{i}$ collects the coefficients and gives the right variance.",
    "样本均值包含每个观测，所以 $\\bar{X}$ 与 $X_{1}$ 相依，它们的方差不能简单相加。把 $\\bar{X} - X_{1}$ 写成独立的 $X_{i}$ 的组合，合并系数后才能得到正确的方差。",
  ],
  (rng) => {
    const n = rng.int(2, 12);
    const v = rng.int(1, 24);
    const answer = Q.of(v * (n - 1), n);
    return ask(
      [
        `$X_{1}, \\dots, X_{${n}}$ are i.i.d. $N(\\mu, ${v})$ with sample mean $\\bar{X}$. Find $\\operatorname{Var}(\\bar{X} - X_{1})$.`,
        `$X_{1}, \\dots, X_{${n}}$ 独立同分布于 $N(\\mu, ${v})$，样本均值为 $\\bar{X}$。求 $\\operatorname{Var}(\\bar{X} - X_{1})$。`,
      ],
      answer,
      [Q.of(v * (n + 1), n), Q.of(v, n), 0],
      [
        `$X_{1}$ has coefficient $\\frac{1}{${n}} - 1$ and the others have $\\frac{1}{${n}}$. Squaring and adding gives $${v}\\left(\\frac{${(n - 1) ** 2}}{${n * n}} + \\frac{${n - 1}}{${n * n}}\\right) = ${answer.toLatex()}$.`,
        `$X_{1}$ 的系数是 $\\frac{1}{${n}} - 1$，其余的系数是 $\\frac{1}{${n}}$。平方后相加，得 $${v}\\left(\\frac{${(n - 1) ** 2}}{${n * n}} + \\frac{${n - 1}}{${n * n}}\\right) = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const covarianceTable = point(
  "covariance-from-a-joint-table",
  ["Covariance from a joint table", "由联合表求协方差"],
  [
    "The covariance needs three expectations from the same table: $E[XY]$ from the joint probabilities and $E[X]$ and $E[Y]$ from the marginals. Then $\\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$, which is zero when the product rule holds.",
    "协方差需要从同一张表得到三个期望：由联合概率得 $E[XY]$，由边缘概率得 $E[X]$ 和 $E[Y]$。于是 $\\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$，当乘积法则成立时它为零。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const c = rng.int(1, 6);
    const d = rng.int(1, 6);
    const total = a + b + c + d;
    const ex = Q.of(c + d, total);
    const ey = Q.of(b + d, total);
    const exy = Q.of(d, total);
    const answer = exy.sub(ex.mul(ey));
    const f = (n: number) => Q.of(n, total).toLatex();
    const data = `P(0, 0) = ${f(a)},\\ P(0, 1) = ${f(b)},\\ P(1, 0) = ${f(c)},\\ P(1, 1) = ${f(d)}`;
    return ask(
      [
        `$X$ and $Y$ take values in $\\{0, 1\\}$ with $${data}$, where the arguments are $(x, y)$. Find $\\operatorname{Cov}(X, Y)$.`,
        `$X$ 与 $Y$ 取值于 $\\{0, 1\\}$，$${data}$，其中自变量是 $(x, y)$。求 $\\operatorname{Cov}(X, Y)$。`,
      ],
      answer,
      [exy, exy.add(ex.mul(ey)), answer.neg()],
      [
        `$E[XY] = ${exy.toLatex()}$, $E[X] = ${ex.toLatex()}$ and $E[Y] = ${ey.toLatex()}$. So the covariance is $${exy.toLatex()} - ${ex.toLatex()} \\cdot ${ey.toLatex()} = ${answer.toLatex()}$.`,
        `$E[XY] = ${exy.toLatex()}$，$E[X] = ${ex.toLatex()}$，$E[Y] = ${ey.toLatex()}$。所以协方差是 $${exy.toLatex()} - ${ex.toLatex()} \\cdot ${ey.toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const extremes = {
  ...point(
    "expected-maximum-minimum-and-distance-of-two-uniforms",
    ["Expected maximum, minimum and distance of two uniforms", "两个均匀变量的最大值、最小值与距离的期望"],
    [
      "Applying the two-variable rule to $\\max(X, Y)$ or $|X - Y|$ means splitting the square along the diagonal and integrating on each triangle. The two independent uniform points on $[0, a]$ then cut the interval into three parts of equal expected length.",
      "对 $\\max(X, Y)$ 或 $|X - Y|$ 应用二元法则，要沿对角线把正方形分开，在每个三角形上积分。于是 $[0, a]$ 上两个独立的均匀点把区间分成期望长度相等的三段。",
    ],
    (rng) => {
      const a = rng.int(1, 12);
      const kind = rng.int(0, 2);
      const item = ["\\max(X, Y)", "\\min(X, Y)", "|X - Y|"][kind] as string;
      const third = Q.of(a, 3);
      const answer = kind === 0 ? Q.of(2 * a, 3) : third;
      const whys: Pair[] = [
        [
          `The two points cut $[0, ${a}]$ into three parts of expected length $${third.toLatex()}$, and the maximum lies past two of them.`,
          `两点把 $[0, ${a}]$ 分成三段，期望长度都是 $${third.toLatex()}$，最大值位于其中两段之后。`,
        ],
        [
          `The two points cut $[0, ${a}]$ into three parts of expected length $${third.toLatex()}$, and the minimum lies past the first one.`,
          `两点把 $[0, ${a}]$ 分成三段，期望长度都是 $${third.toLatex()}$，最小值位于第一段之后。`,
        ],
        [
          `The two points cut $[0, ${a}]$ into three parts of expected length $${third.toLatex()}$, and the distance between them is the middle part.`,
          `两点把 $[0, ${a}]$ 分成三段，期望长度都是 $${third.toLatex()}$，两点之间的距离就是中间一段。`,
        ],
      ];
      return ask(
        [
          `$X$ and $Y$ are independent and uniform on $[0, ${a}]$. Find $E[${item}]$.`,
          `$X$ 与 $Y$ 独立，都在 $[0, ${a}]$ 上服从均匀分布。求 $E[${item}]$。`,
        ],
        answer,
        [Q.of(a, 2), a, kind === 0 ? third : Q.of(2 * a, 3)],
        whys[kind] as Pair,
      );
    },
  ),
  figure:
    probabilityDrawings1[
      "the-rule-of-the-lazy-statistician-for-two-random-variables#expected-maximum-minimum-and-distance-of-two-uniforms"
    ],
};

/** deeperProbabilityAndStatisticsThirdPoints maps topics of Probability and Statistics, from random variables to joint distributions, to a third knowledge point. */
export const deeperProbabilityAndStatisticsThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "approximating-discrete-random-variables-as-continuous": [continuityWidth],
  "simulating-random-observations": [simulateDiscrete],
  "one-to-one-transformations-of-discrete-random-variables": [notOneToOne],
  "the-change-of-variables-method-for-continuous-random-variables": [squareDensity],
  "variance-of-discrete-random-variables": [varianceLinear],
  "the-rule-of-the-lazy-statistician": [absoluteDeviation],
  "constructing-moment-generating-functions-for-continuous-probability-distributions": [shiftedMgf],
  "properties-of-moment-generating-functions": [mgfMoments],
  "the-uniqueness-property-of-mgfs": [missingSummand],
  "mean-and-variance-of-the-bernoulli-distribution": [twoPoint],
  "the-poisson-approximation-of-the-binomial-distribution": [whenPoissonWorks],
  "mean-and-variance-of-the-negative-binomial-distribution": [failures],
  "normal-approximations-of-binomial-distributions": [binomialProbability],
  "the-normal-approximation-of-the-poisson-distribution": [poissonProbability],
  "the-joint-cdf-of-two-discrete-random-variables": [rectangle],
  "marginal-distributions-for-discrete-random-variables": [marginalMean],
  "marginal-distributions-for-continuous-random-variables": [triangleMarginal],
  "independence-of-continuous-random-variables": [independenceTests],
  "combining-two-normally-distributed-random-variables": [scaledComparison],
  "combining-multiple-normally-distributed-random-variables": [threeNormals],
  "iid-normal-random-variables": [meanMinusOne],
  "computing-expected-values-from-joint-distributions": [covarianceTable],
  "the-rule-of-the-lazy-statistician-for-two-random-variables": [extremes],
};
