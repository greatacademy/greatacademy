// Third knowledge points for thin topics of Probability and Statistics, from random variables
// to joint distributions: the reverse question, a harder case or a common trap.
// See `deeperProbabilityAndStatisticsThirdPoints`.

import { type KnowledgePointDef, type Problem, type Rng, t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";
import { probabilityDrawings1 } from "../explanation-drawings-probability-and-statistics-1.ts";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { choose, type Pair, point, same } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** distinctFrom keeps the explained mistakes that differ from the answer and from each other. */
const distinctFrom = <T extends { readonly value: number | Q }>(answer: number | Q, list: readonly T[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return list.filter((m, i) => key(m.value) !== key(answer) && list.findIndex((x) => key(x.value) === key(m.value)) === i);
};

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
    "A continuity correction replaces each integer by a unit interval around it. Included endpoints therefore extend the interval by a half, and excluded endpoints pull it in by a half, so strict and weak inequalities give corrected intervals of different widths. The event $100 \\le X < 150$ becomes $[99.5, 149.5]$, of width $50$.\n\n> **Watch out.** An included endpoint moves out by a half and an excluded one moves in by a half. The width is the number of integers in the event, not always $b - a$.",
    "连续性校正把每个整数换成以它为中心的单位区间。所以包含端点时区间向外扩展一半，不包含端点时向内收缩一半，于是严格不等式与非严格不等式给出的校正区间宽度不同。事件 $100 \\le X < 150$ 变为 $[99.5, 149.5]$，宽度为 $50$。\n\n> **注意。** 包含的端点向外移一半，不包含的端点向内移一半。宽度等于事件中整数的个数，不总是 $b - a$。",
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
    const [first, last] = [lowIn ? a : a + 1, highIn ? b : b - 1];
    return numberProblem({
      prompt: t(
        `An integer variable $X$ is approximated by a continuous variable with a continuity correction. Find the width of the interval that replaces the event $${event}$.`,
        `整数变量 $X$ 用连续变量近似，并做连续性校正。求代替事件 $${event}$ 的区间的宽度。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(b - a, "That is the distance between the endpoints, without the correction.", "那是两个端点之间的距离，没有做校正。"),
        why(
          b - a + 1,
          "That widens the interval at both ends, as if both endpoints were included.",
          "那是在两端都向外扩展，就像两个端点都包含在内。",
        ),
        why(
          b - a - 1,
          "That narrows the interval at both ends, as if both endpoints were excluded.",
          "那是在两端都向内收缩，就像两个端点都不包含。",
        ),
        why(b - a + 2, "That moves each end out by a whole unit instead of a half.", "那是把每一端向外移了一整个单位，而不是一半。"),
      ]),
      solution: walked(
        [
          [
            ["Correct each end", "校正每一端"],
            t(
              `$${a}$ is ${lowIn ? "included, so the interval starts half a unit below it" : "excluded, so the interval starts half a unit above it"}, at $${dec(low)}$; $${b}$ is ${highIn ? "included, so it ends half a unit above it" : "excluded, so it ends half a unit below it"}, at $${dec(high)}$.`,
              `$${a}$ ${lowIn ? "包含在内，所以区间从它下方半个单位开始" : "不包含，所以区间从它上方半个单位开始"}，即 $${dec(low)}$；$${b}$ ${highIn ? "包含在内，所以区间在它上方半个单位结束" : "不包含，所以区间在它下方半个单位结束"}，即 $${dec(high)}$。`,
            ),
          ],
          [
            ["Subtract", "相减"],
            t(`The width is $${dec(high)} - ${dec(low)} = ${answer}$.`, `宽度是 $${dec(high)} - ${dec(low)} = ${answer}$。`),
          ],
        ],
        t(
          `The event contains the integers from $${first}$ to $${last}$, which are $${answer}$ integers, each given a unit of width.`,
          `事件包含从 $${first}$ 到 $${last}$ 的整数，共 $${answer}$ 个，每个占一个单位宽度。`,
        ),
      ),
    });
  },
);

const simulateDiscrete = point(
  "simulating-a-discrete-variable-from-a-uniform-draw",
  ["Simulating a discrete variable from a uniform draw", "用均匀随机数模拟离散变量"],
  [
    "To simulate a discrete variable, divide $[0, 1]$ into pieces with lengths equal to the probabilities. A uniform draw $u$ returns the smallest value whose cumulative probability reaches $u$, so each value appears with the right probability. With $P(X = 10) = 0.5$, $P(X = 20) = 0.3$, $P(X = 30) = 0.2$, the cumulative probabilities are $0.5, 0.8, 1$, so $u = 0.85$ returns $30$.\n\n> **Watch out.** Compare $u$ with the running totals, not with the single probabilities: $0.85$ exceeds every single probability above, yet it lands in the last piece.",
    "模拟离散变量时，把 $[0, 1]$ 分成长度等于各概率的小段。均匀随机数 $u$ 返回累积概率达到 $u$ 的最小值，所以每个值都以正确的概率出现。若 $P(X = 10) = 0.5$，$P(X = 20) = 0.3$，$P(X = 30) = 0.2$，累积概率为 $0.5, 0.8, 1$，所以 $u = 0.85$ 返回 $30$。\n\n> **注意。** 要把 $u$ 与累积概率比较，而不是与单个概率比较：$0.85$ 大于上面每个单个概率，但它落在最后一段。",
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
    const uText = dec(Q.of(u, 100));
    const totals = ps.map((_, i) =>
      dec(
        Q.of(
          ps.slice(0, i + 1).reduce((s, p) => s + p, 0),
          10,
        ),
      ),
    );
    const before = index === 0 ? "0" : (totals[index - 1] as string);
    return numberProblem({
      prompt: t(
        `$X$ has $${table}$. Using the inverse transform in the order listed, find the value simulated from the uniform draw $u = ${uText}$.`,
        `$X$ 满足 $${table}$。按所列顺序使用逆变换法，求由均匀随机数 $u = ${uText}$ 模拟出的值。`,
      ),
      answer,
      mistakes: distinctFrom(
        answer,
        vs.flatMap((v, i) =>
          i === index
            ? []
            : [
                i < index
                  ? why(
                      v,
                      `The running total for $${v}$ is $${totals[i]}$, still below $u$, so the draw has passed its piece.`,
                      `$${v}$ 处的累积概率是 $${totals[i]}$，仍小于 $u$，所以随机数已越过它那一段。`,
                    )
                  : why(
                      v,
                      `The draw stops at the first running total that reaches $u$; the piece of $${v}$ comes later.`,
                      `随机数在第一个达到 $u$ 的累积概率处停下；$${v}$ 那一段在更后面。`,
                    ),
              ],
        ),
      ),
      solution: walked(
        [
          [
            ["Add up the probabilities", "累加概率"],
            t(`In the order listed, the running totals are $${totals.join(", ")}$.`, `按所列顺序，累积概率依次为 $${totals.join(", ")}$。`),
          ],
          [
            ["Find the piece", "找到所在的段"],
            t(
              `The first total that reaches $u = ${uText}$ is $${dec(Q.of(cumulative, 100))}$, which belongs to the value $${answer}$. So the draw returns $${answer}$.`,
              `第一个达到 $u = ${uText}$ 的累积概率是 $${dec(Q.of(cumulative, 100))}$，它对应值 $${answer}$。所以这个随机数返回 $${answer}$。`,
            ),
          ],
        ],
        t(
          `$${before} < ${uText} < ${dec(Q.of(cumulative, 100))}$, so $u$ lies in the piece of $${answer}$.`,
          `$${before} < ${uText} < ${dec(Q.of(cumulative, 100))}$，所以 $u$ 落在 $${answer}$ 那一段。`,
        ),
      ),
    });
  },
);

const notOneToOne = point(
  "when-a-transformation-is-not-one-to-one",
  ["When a transformation is not one to one", "变换不是一一对应时"],
  [
    "A one-to-one transformation just relabels the values and keeps their probabilities. A transformation such as $Y = X^{2}$ sends two values to the same result, so the probabilities of all the preimages must be added to find the probability of that result.\n\n> **Watch out.** Look for every preimage, including the negative one. If $P(X = 1) = 0.2$ and $P(X = -1) = 0.3$, then $Y = X^{2}$ has $P(Y = 1) = 0.2 + 0.3 = 0.5$, not $0.2$.",
    "一一对应的变换只是给各值换了标签，概率不变。像 $Y = X^{2}$ 这样的变换把两个值送到同一个结果，所以求这个结果的概率时，必须把所有原像的概率相加。\n\n> **注意。** 要找出每一个原像，包括负的那个。若 $P(X = 1) = 0.2$，$P(X = -1) = 0.3$，则 $Y = X^{2}$ 满足 $P(Y = 1) = 0.2 + 0.3 = 0.5$，而不是 $0.2$。",
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
    const pOf = (x: number) => Q.of(cs[x + 2] as number, total);
    const classes = [Q.of(cs[2] as number, total), pOf(1).add(pOf(-1)), pOf(2).add(pOf(-2))];
    return numberProblem({
      prompt: t(
        `$${table}$, and $Y = ${poly([1, "X^{2}"], [s, ""])}$. Find $P(Y = ${y})$.`,
        `$${table}$，$Y = ${poly([1, "X^{2}"], [s, ""])}$。求 $P(Y = ${y})$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(pOf(k), `That counts only $X = ${k}$; $X = ${-k}$ gives the same $Y$.`, `那只算了 $X = ${k}$；$X = ${-k}$ 给出同一个 $Y$。`),
        why(pOf(-k), `That counts only $X = ${-k}$; $X = ${k}$ gives the same $Y$.`, `那只算了 $X = ${-k}$；$X = ${k}$ 给出同一个 $Y$。`),
        why(
          answer.add(pOf(0)),
          `That also adds $P(X = 0)$, but $X = 0$ gives $Y = ${s}$.`,
          `那还加上了 $P(X = 0)$，但 $X = 0$ 给出 $Y = ${s}$。`,
        ),
        why(Q.of(top, 2 * total), "That averages the two probabilities; they must be added.", "那是把两个概率取平均；应该相加。"),
      ]),
      solution: walked(
        [
          [
            ["Find the preimages", "找出原像"],
            t(
              `$Y = ${y}$ exactly when $X^{2} = ${k * k}$, that is, when $X = ${k}$ or $X = ${-k}$.`,
              `$Y = ${y}$ 当且仅当 $X^{2} = ${k * k}$，即 $X = ${k}$ 或 $X = ${-k}$。`,
            ),
          ],
          [
            ["Add their probabilities", "把它们的概率相加"],
            t(
              `$P(Y = ${y}) = ${pOf(k).toLatex()} + ${pOf(-k).toLatex()} = ${answer.toLatex()}$.`,
              `$P(Y = ${y}) = ${pOf(k).toLatex()} + ${pOf(-k).toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `$Y$ takes the values $${s}$, $${1 + s}$ and $${4 + s}$ with probabilities $${classes.map((c) => c.toLatex()).join(" + ")} = 1$, so the whole distribution is accounted for.`,
          `$Y$ 取值 $${s}$、$${1 + s}$、$${4 + s}$，概率之和 $${classes.map((c) => c.toLatex()).join(" + ")} = 1$，整个分布都已计入。`,
        ),
      ),
    });
  },
);

const squareDensity = point(
  "the-density-of-the-square-of-a-uniform-variable",
  ["The density of the square of a uniform variable", "均匀变量平方的密度"],
  [
    "Squaring a uniform variable does not give a uniform variable. The change-of-variables formula multiplies by the derivative of the inverse function, $\\frac{1}{2\\sqrt{y}}$, so the density of $Y = X^{2}$ is large near zero, where values of $X$ are squeezed together. If $X$ is uniform on $(0, 20)$, then $f_{Y}(25) = \\frac{1}{20} \\cdot \\frac{1}{2 \\cdot 5} = \\frac{1}{200}$.\n\n> **Watch out.** The density of $Y$ is not the density of $X$ read at $\\sqrt{y}$: the factor $\\frac{1}{2\\sqrt{y}}$, with its $2$, is what keeps the total probability equal to $1$.",
    "均匀变量的平方不是均匀变量。变量替换公式要乘以反函数的导数 $\\frac{1}{2\\sqrt{y}}$，所以 $Y = X^{2}$ 的密度在零附近很大，因为那里 $X$ 的值被压缩到一起。若 $X$ 在 $(0, 20)$ 上服从均匀分布，则 $f_{Y}(25) = \\frac{1}{20} \\cdot \\frac{1}{2 \\cdot 5} = \\frac{1}{200}$。\n\n> **注意。** $Y$ 的密度不是在 $\\sqrt{y}$ 处读出的 $X$ 的密度：因子 $\\frac{1}{2\\sqrt{y}}$（连同其中的 $2$）保证总概率仍为 $1$。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const s = rng.int(1, a - 1);
    const y = s * s;
    const answer = Q.of(1, 2 * a * s);
    return numberProblem({
      prompt: t(
        `$X$ is uniform on $(0, ${a})$ and $Y = X^{2}$. Find the density $f_{Y}(${y})$.`,
        `$X$ 在 $(0, ${a})$ 上服从均匀分布，$Y = X^{2}$。求密度 $f_{Y}(${y})$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(
          Q.of(1, a),
          "That is the density of $X$, without the factor from the derivative of the inverse.",
          "那是 $X$ 的密度，没有乘反函数导数的因子。",
        ),
        why(Q.of(1, a * s), "That drops the $2$ in the derivative of $\\sqrt{y}$.", "那漏掉了 $\\sqrt{y}$ 导数中的 $2$。"),
        why(Q.of(1, a * a), "That squares the density of $X$ instead of changing variables.", "那是把 $X$ 的密度平方，而不是做变量替换。"),
      ]),
      solution: walked(
        [
          [
            ["Find the distribution function", "求分布函数"],
            t(
              `For $0 < y < ${a * a}$, $F_{Y}(y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{${a}}$.`,
              `当 $0 < y < ${a * a}$ 时，$F_{Y}(y) = P(X \\le \\sqrt{y}) = \\frac{\\sqrt{y}}{${a}}$。`,
            ),
          ],
          [
            ["Differentiate", "求导"],
            t(
              `$f_{Y}(y) = \\frac{1}{${a}} \\cdot \\frac{1}{2\\sqrt{y}}$, and at $y = ${y}$, where $\\sqrt{y} = ${s}$, this is $${answer.toLatex()}$.`,
              `$f_{Y}(y) = \\frac{1}{${a}} \\cdot \\frac{1}{2\\sqrt{y}}$，在 $y = ${y}$ 处，$\\sqrt{y} = ${s}$，它等于 $${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `The density integrates to $F_{Y}(${a * a}) = \\frac{${a}}{${a}} = 1$ over $(0, ${a * a})$, as it must.`,
          `该密度在 $(0, ${a * a})$ 上的积分是 $F_{Y}(${a * a}) = \\frac{${a}}{${a}} = 1$，符合要求。`,
        ),
      ),
    });
  },
);

const varianceLinear = point(
  "the-variance-of-a-linear-function",
  ["The variance of a linear function", "线性函数的方差"],
  [
    "Adding a constant shifts every value but changes no distance from the mean, so it leaves the variance alone. Multiplying by a constant scales distances, and since variance uses squared distances, the factor is squared and a negative sign disappears.\n\n> **Watch out.** Neither the sign of the factor nor the constant survives. If $\\operatorname{Var}(X) = 2$, then $\\operatorname{Var}(-3X + 7) = 9 \\cdot 2 = 18$, not $-6$ and not $18 + 7 = 25$.",
    "加常数使每个值平移，但不改变到均值的距离，所以方差不变。乘常数使距离按比例变化，而方差用的是距离的平方，所以因子要平方，负号也随之消失。\n\n> **注意。** 因子的符号和常数都不会保留下来。若 $\\operatorname{Var}(X) = 2$，则 $\\operatorname{Var}(-3X + 7) = 9 \\cdot 2 = 18$，既不是 $-6$，也不是 $18 + 7 = 25$。",
  ],
  (rng) => {
    const v = rng.int(1, 20);
    const a = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
    const b = nz(rng, 20);
    const answer = a * a * v;
    const y = rng.bool() ? poly([a, "X"], [b, ""]) : poly([b, ""], [a, "X"]);
    const factor = a < 0 ? `(${a})` : `${a}`;
    return numberProblem({
      prompt: t(
        `$\\operatorname{Var}(X) = ${v}$. Find $\\operatorname{Var}(${y})$.`,
        `$\\operatorname{Var}(X) = ${v}$。求 $\\operatorname{Var}(${y})$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(
          a * v,
          `That multiplies by $${a}$ without squaring it; variance scales by $${factor}^{2} = ${a * a}$.`,
          `那是乘以 $${a}$ 而没有平方；方差按 $${factor}^{2} = ${a * a}$ 倍变化。`,
        ),
        why(
          answer + b,
          `That adds the constant $${b}$, but a shift changes no distance from the mean.`,
          `那是加上了常数 $${b}$，但平移不改变到均值的距离。`,
        ),
        why(answer * v, "That squares the variance as well as the factor.", "那是把方差也平方了，而只应平方因子。"),
      ]),
      solution: walked(
        [
          [
            ["Drop the constant", "去掉常数"],
            t(
              `Adding $${b}$ shifts every value, so $\\operatorname{Var}(${y}) = \\operatorname{Var}(${poly([a, "X"])})$.`,
              `加 $${b}$ 只是平移每个值，所以 $\\operatorname{Var}(${y}) = \\operatorname{Var}(${poly([a, "X"])})$。`,
            ),
          ],
          [
            ["Square the factor", "把因子平方"],
            t(
              `$\\operatorname{Var}(${poly([a, "X"])}) = ${factor}^{2} \\cdot ${v} = ${a * a} \\cdot ${v} = ${answer}$.`,
              `$\\operatorname{Var}(${poly([a, "X"])}) = ${factor}^{2} \\cdot ${v} = ${a * a} \\cdot ${v} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `From the definition: the deviation of $${y}$ from its mean is $${a}(X - \\mu)$, its square is $${a * a}(X - \\mu)^{2}$, and the mean of that is $${a * a} \\cdot ${v} = ${answer}$.`,
          `由定义：$${y}$ 与其均值之差是 $${a}(X - \\mu)$，平方为 $${a * a}(X - \\mu)^{2}$，其均值为 $${a * a} \\cdot ${v} = ${answer}$。`,
        ),
      ),
    });
  },
);

const absoluteDeviation = point(
  "the-expected-distance-from-a-point",
  ["The expected distance from a point", "到一点的期望距离"],
  [
    "The rule of the lazy statistician integrates $g(x)$ against the density, and in general $E[g(X)]$ is not $g(E[X])$. An absolute value must be split at the point where its inside changes sign, which gives two simple integrals on either side. For $X$ uniform on $[0, 40]$, $E[\\,|X - 10|\\,] = \\frac{1}{40}\\left(\\frac{100}{2} + \\frac{900}{2}\\right) = \\frac{25}{2}$.\n\n> **Watch out.** $|E[X] - 10| = 10$ here, which is smaller than $\\frac{25}{2}$: the distance is averaged over every value of $X$, not taken from the mean.",
    "懒惰统计学家法则把 $g(x)$ 对密度积分，一般来说 $E[g(X)]$ 不等于 $g(E[X])$。绝对值要在内部变号的点处分开，这样得到两边两个简单的积分。若 $X$ 在 $[0, 40]$ 上服从均匀分布，则 $E[\\,|X - 10|\\,] = \\frac{1}{40}\\left(\\frac{100}{2} + \\frac{900}{2}\\right) = \\frac{25}{2}$。\n\n> **注意。** 这里 $|E[X] - 10| = 10$，小于 $\\frac{25}{2}$：距离要对 $X$ 的每个值取平均，而不是从均值算出。",
  ],
  (rng) => {
    const L = rng.int(3, 12);
    const c = rng.int(1, L - 1);
    const left = c * c;
    const right = (L - c) ** 2;
    const answer = Q.of(left + right, 2 * L);
    const atMean = Q.of(Math.abs(L - 2 * c), 2);
    return numberProblem({
      prompt: t(
        `$X$ is uniform on $[0, ${L}]$. Find $E[\\,|X - ${c}|\\,]$.`,
        `$X$ 在 $[0, ${L}]$ 上服从均匀分布。求 $E[\\,|X - ${c}|\\,]$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(
          atMean,
          `That is $|E[X] - ${c}|$, the distance from the mean, not the mean distance.`,
          `那是 $|E[X] - ${c}|$，即均值到该点的距离，不是平均距离。`,
        ),
        why(Q.of(L, 2), "That is $E[X]$ itself.", "那是 $E[X]$ 本身。"),
        why(
          Q.of(left + right, L),
          "That forgets the factor $\\frac{1}{2}$ from integrating a linear function.",
          "那忘了积分一次函数时产生的因子 $\\frac{1}{2}$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Split at the point", "在该点处分开"],
            t(
              `$E[\\,|X - ${c}|\\,] = \\frac{1}{${L}}\\left(\\int_0^${c < 10 ? c : `{${c}}`} (${c} - x)\\,dx + \\int_{${c}}^{${L}} (x - ${c})\\,dx\\right)$.`,
              `$E[\\,|X - ${c}|\\,] = \\frac{1}{${L}}\\left(\\int_0^${c < 10 ? c : `{${c}}`} (${c} - x)\\,dx + \\int_{${c}}^{${L}} (x - ${c})\\,dx\\right)$。`,
            ),
          ],
          [
            ["Integrate each part", "分别积分"],
            t(
              `The parts are $\\frac{${left}}{2}$ and $\\frac{${right}}{2}$, so the mean is $\\frac{1}{${L}}\\left(\\frac{${left}}{2} + \\frac{${right}}{2}\\right) = ${answer.toLatex()}$.`,
              `两部分分别是 $\\frac{${left}}{2}$ 和 $\\frac{${right}}{2}$，所以均值是 $\\frac{1}{${L}}\\left(\\frac{${left}}{2} + \\frac{${right}}{2}\\right) = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Each part is the area of a triangle under $|x - ${c}|$, and the result is at least $|E[X] - ${c}| = ${atMean.toLatex()}$, as the average of a convex function must be.`,
          `每部分都是 $|x - ${c}|$ 下方三角形的面积，结果不小于 $|E[X] - ${c}| = ${atMean.toLatex()}$，这正是凸函数的平均值应满足的。`,
        ),
      ),
    });
  },
);

const shiftedMgf = point(
  "the-mgf-of-a-shifted-exponential-density",
  ["The MGF of a shifted exponential density", "平移指数密度的矩母函数"],
  [
    "If a density is moved to the right by $c$, the substitution $u = x - c$ in the defining integral pulls out a factor of $e^{ct}$. The remaining integral is the usual exponential one, which converges only for $t$ below the rate. The density $20e^{-20(x - 30)}$ for $x > 30$ has the MGF $\\frac{20e^{30t}}{20 - t}$ for $t < 20$.\n\n> **Watch out.** A shift to the right by $c$ multiplies the MGF by $e^{ct}$, with a plus sign, and leaves the denominator $\\lambda - t$ of the unshifted exponential unchanged.",
    "如果密度向右平移 $c$，在定义积分中代换 $u = x - c$ 就能提出因子 $e^{ct}$。剩下的积分就是通常的指数积分，只有当 $t$ 小于速率时才收敛。密度 $20e^{-20(x - 30)}$（$x > 30$）的矩母函数是 $\\frac{20e^{30t}}{20 - t}$，$t < 20$。\n\n> **注意。** 向右平移 $c$ 使矩母函数乘以 $e^{ct}$，指数取正号，而未平移指数分布的分母 $\\lambda - t$ 不变。",
  ],
  (rng) => {
    const l = rng.int(2, 12);
    const c = rng.int(1, 9);
    const e = poly([c, "t"]);
    const minus = poly([-c, "t"]);
    return reasoned(
      choose(
        rng,
        [
          `$X$ has density $f(x) = ${l}e^{-${l}(x - ${c})}$ for $x > ${c}$. Find its moment-generating function for $t < ${l}$.`,
          `$X$ 的密度是 $f(x) = ${l}e^{-${l}(x - ${c})}$，$x > ${c}$。求它在 $t < ${l}$ 时的矩母函数。`,
        ],
        same(`\\frac{${l}e^{${e}}}{${l} - t}`),
        [same(`\\frac{${l}}{${l} - t}`), same(`\\frac{${l}e^{${minus}}}{${l} - t}`), same(`\\frac{${l}e^{${e}}}{${l} + t}`)],
        [
          `**Step 1: Substitute.** With $u = x - ${c}$, $E[e^{tX}] = e^{${e}} \\int_0^\\infty ${l}e^{-${l}u}e^{tu}\\,du$.\n\n**Step 2: Integrate.** For $t < ${l}$ the integral is $\\frac{${l}}{${l} - t}$, so $M(t) = \\frac{${l}e^{${e}}}{${l} - t}$.\n\n**Check.** $M(0) = \\frac{${l}}{${l}} = 1$, as every MGF must give.`,
          `**第 1 步：代换。** 令 $u = x - ${c}$，则 $E[e^{tX}] = e^{${e}} \\int_0^\\infty ${l}e^{-${l}u}e^{tu}\\,du$。\n\n**第 2 步：积分。** 当 $t < ${l}$ 时积分等于 $\\frac{${l}}{${l} - t}$，所以 $M(t) = \\frac{${l}e^{${e}}}{${l} - t}$。\n\n**检验。** $M(0) = \\frac{${l}}{${l}} = 1$，任何矩母函数都应如此。`,
        ],
      ),
      [
        [
          `$\\frac{${l}}{${l} - t}$`,
          "That is the MGF of the unshifted exponential; the shift adds a factor.",
          "那是未平移指数分布的矩母函数；平移会多出一个因子。",
        ],
        [
          `$\\frac{${l}e^{${minus}}}{${l} - t}$`,
          "A shift to the right gives the factor $e^{ct}$ with a plus sign.",
          "向右平移给出的因子 $e^{ct}$ 指数为正。",
        ],
        [
          `$\\frac{${l}e^{${e}}}{${l} + t}$`,
          "The integral of $e^{-(\\lambda - t)u}$ gives $\\lambda - t$ in the denominator.",
          "$e^{-(\\lambda - t)u}$ 的积分使分母为 $\\lambda - t$。",
        ],
      ],
    );
  },
);

const mgfMoments = point(
  "mean-and-variance-from-the-derivatives-of-an-mgf",
  ["Mean and variance from the derivatives of an MGF", "由矩母函数的导数求均值和方差"],
  [
    "The derivatives of an MGF at $t = 0$ give the moments: $M'(0) = E[X]$ and $M''(0) = E[X^{2}]$. The variance is then $M''(0) - M'(0)^{2}$. The second derivative alone is not the variance unless the mean is zero. For $M(t) = e^{20t + 50t^{2}}$, $M'(0) = 20$ and $M''(0) = 100 + 400 = 500$, so the variance is $500 - 400 = 100$.\n\n> **Watch out.** The coefficient of $t^{2}$ is half the variance, not the variance itself, and $E[X^{2}]$ adds the square of the mean to it.",
    "矩母函数在 $t = 0$ 处的导数给出各阶矩：$M'(0) = E[X]$，$M''(0) = E[X^{2}]$。于是方差是 $M''(0) - M'(0)^{2}$。除非均值为零，否则二阶导数本身不是方差。对 $M(t) = e^{20t + 50t^{2}}$，$M'(0) = 20$，$M''(0) = 100 + 400 = 500$，方差是 $500 - 400 = 100$。\n\n> **注意。** $t^{2}$ 的系数是方差的一半，不是方差本身；$E[X^{2}]$ 还要加上均值的平方。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = rng.int(1, 12);
    const exponent = poly([a, "t"], [b, "t^{2}"]);
    const second = 2 * b + a * a;
    const derivative = t(
      `$M'(t) = (${poly([a, ""], [2 * b, "t"])})M(t)$, so $M'(0) = ${a}$, and differentiating again, $M''(t) = ${2 * b}M(t) + (${poly([a, ""], [2 * b, "t"])})^{2}M(t)$.`,
      `$M'(t) = (${poly([a, ""], [2 * b, "t"])})M(t)$，所以 $M'(0) = ${a}$；再求导，$M''(t) = ${2 * b}M(t) + (${poly([a, ""], [2 * b, "t"])})^{2}M(t)$。`,
    );
    if (rng.bool()) {
      return numberProblem({
        prompt: t(
          `$X$ has the MGF $M(t) = e^{${exponent}}$. Find $\\operatorname{Var}(X)$.`,
          `$X$ 的矩母函数是 $M(t) = e^{${exponent}}$。求 $\\operatorname{Var}(X)$。`,
        ),
        answer: 2 * b,
        mistakes: distinctFrom(2 * b, [
          why(
            second,
            "That is $M''(0) = E[X^{2}]$; the square of the mean must still be subtracted.",
            "那是 $M''(0) = E[X^{2}]$，还要减去均值的平方。",
          ),
          why(b, "That is the coefficient of $t^{2}$, which is half the variance.", "那是 $t^{2}$ 的系数，它是方差的一半。"),
          why(a * a, "That is the square of the mean, not the variance.", "那是均值的平方，不是方差。"),
        ]),
        solution: walked(
          [
            [["Differentiate", "求导"], derivative],
            [
              ["Subtract the squared mean", "减去均值的平方"],
              t(
                `$M''(0) = ${2 * b} + ${a * a} = ${second}$, so the variance is $${second} - ${a * a} = ${2 * b}$.`,
                `$M''(0) = ${2 * b} + ${a * a} = ${second}$，所以方差是 $${second} - ${a * a} = ${2 * b}$。`,
              ),
            ],
          ],
          t(
            `$e^{\\mu t + \\sigma^{2}t^{2}/2}$ is the MGF of a normal variable, and here $\\frac{\\sigma^{2}}{2} = ${b}$ gives $\\sigma^{2} = ${2 * b}$.`,
            `$e^{\\mu t + \\sigma^{2}t^{2}/2}$ 是正态变量的矩母函数，这里 $\\frac{\\sigma^{2}}{2} = ${b}$，得 $\\sigma^{2} = ${2 * b}$。`,
          ),
        ),
      });
    }
    return numberProblem({
      prompt: t(`$X$ has the MGF $M(t) = e^{${exponent}}$. Find $E[X^{2}]$.`, `$X$ 的矩母函数是 $M(t) = e^{${exponent}}$。求 $E[X^{2}]$。`),
      answer: second,
      mistakes: distinctFrom(second, [
        why(2 * b, "That is the variance; $E[X^{2}]$ adds the square of the mean.", "那是方差；$E[X^{2}]$ 还要加上均值的平方。"),
        why(
          b + a * a,
          "That takes the coefficient of $t^{2}$ as the variance, but it is half the variance.",
          "那把 $t^{2}$ 的系数当作方差，但它只是方差的一半。",
        ),
        why(a * a, "That is the square of the mean alone.", "那只是均值的平方。"),
      ]),
      solution: walked(
        [
          [["Differentiate", "求导"], derivative],
          [["Set $t = 0$", "令 $t = 0$"], t(`$M''(0) = ${2 * b} + ${a * a} = ${second}$.`, `$M''(0) = ${2 * b} + ${a * a} = ${second}$。`)],
        ],
        t(
          `$E[X^{2}] = \\operatorname{Var}(X) + E[X]^{2} = ${2 * b} + ${a * a} = ${second}$, with variance $${2 * b}$ from the normal MGF $e^{\\mu t + \\sigma^{2}t^{2}/2}$.`,
          `$E[X^{2}] = \\operatorname{Var}(X) + E[X]^{2} = ${2 * b} + ${a * a} = ${second}$，其中方差 $${2 * b}$ 由正态矩母函数 $e^{\\mu t + \\sigma^{2}t^{2}/2}$ 得出。`,
        ),
      ),
    });
  },
);

const missingSummand = point(
  "identifying-the-other-summand-from-mgfs",
  ["Identifying the other summand from MGFs", "由矩母函数识别另一个加数"],
  [
    "For independent variables, the MGF of the sum is the product of the MGFs. So dividing the MGF of the sum by that of one summand gives the MGF of the other, and the uniqueness property then identifies its distribution and so its mean. If $M_{X}(t) = e^{20(e^{t} - 1)}$ and $M_{X + Y}(t) = e^{50(e^{t} - 1)}$, then $M_{Y}(t) = e^{30(e^{t} - 1)}$ and $E[Y] = 30$.\n\n> **Watch out.** Dividing MGFs subtracts exponents or powers; it does not divide the parameters, and the mean of the sum is not the mean of $Y$.",
    "对独立变量，和的矩母函数等于各矩母函数之积。所以用和的矩母函数除以一个加数的矩母函数，就得到另一个加数的矩母函数，再由唯一性确定它的分布和均值。若 $M_{X}(t) = e^{20(e^{t} - 1)}$，$M_{X + Y}(t) = e^{50(e^{t} - 1)}$，则 $M_{Y}(t) = e^{30(e^{t} - 1)}$，$E[Y] = 30$。\n\n> **注意。** 矩母函数相除是指数或幂次相减，不是参数相除；和的均值也不是 $Y$ 的均值。",
  ],
  (rng) => {
    if (rng.bool()) {
      const p = rng.pick([10, 20, 25, 30, 40, 50, 60, 75, 80]);
      const n = rng.int(2, 9);
      const m = rng.int(2, 9);
      const base = `${dec(Q.of(100 - p, 100))} + ${dec(Q.of(p, 100))}e^{t}`;
      const answer = Q.of(m * p, 100);
      const shown = (v: Q) => (v.isInteger() ? dec(v) : `${dec(v)} = ${v.toLatex()}`);
      return numberProblem({
        prompt: t(
          `$X$ and $Y$ are independent, $M_{X}(t) = (${base})^{${n}}$ and $M_{X + Y}(t) = (${base})^{${n + m}}$. Find $E[Y]$.`,
          `$X$ 与 $Y$ 独立，$M_{X}(t) = (${base})^{${n}}$，$M_{X + Y}(t) = (${base})^{${n + m}}$。求 $E[Y]$。`,
        ),
        answer,
        form: "decimal",
        mistakes: distinctFrom(answer, [
          why(Q.of((n + m) * p, 100), "That is the mean of the sum $X + Y$.", "那是和 $X + Y$ 的均值。"),
          why(Q.of(m, 1), "That is the number of trials of $Y$, not its mean.", "那是 $Y$ 的试验次数，不是它的均值。"),
          why(Q.of(n * p, 100), "That is the mean of $X$.", "那是 $X$ 的均值。"),
          why(Q.of(p, 100), "That is the success probability of a single trial.", "那是单次试验的成功概率。"),
        ]),
        solution: walked(
          [
            [
              ["Divide the MGFs", "矩母函数相除"],
              t(
                `$M_{Y}(t) = \\frac{M_{X + Y}(t)}{M_{X}(t)} = (${base})^{${m}}$, so $Y$ is binomial with $n = ${m}$ and $p = ${dec(Q.of(p, 100))}$.`,
                `$M_{Y}(t) = \\frac{M_{X + Y}(t)}{M_{X}(t)} = (${base})^{${m}}$，所以 $Y$ 服从二项分布，$n = ${m}$，$p = ${dec(Q.of(p, 100))}$。`,
              ),
            ],
            [
              ["Take the mean", "求均值"],
              t(
                `$E[Y] = np = ${m} \\cdot ${dec(Q.of(p, 100))} = ${shown(answer)}$.`,
                `$E[Y] = np = ${m} \\cdot ${dec(Q.of(p, 100))} = ${shown(answer)}$。`,
              ),
            ],
          ],
          t(
            `$E[X] + E[Y] = ${shown(Q.of(n * p, 100))} + ${dec(answer)} = ${shown(Q.of((n + m) * p, 100))}$, the mean of the binomial sum with $${n + m}$ trials.`,
            `$E[X] + E[Y] = ${shown(Q.of(n * p, 100))} + ${dec(answer)} = ${shown(Q.of((n + m) * p, 100))}$，正是 $${n + m}$ 次试验的二项和的均值。`,
          ),
        ),
      });
    }
    const a = rng.int(2, 15);
    const b = rng.int(2, 15);
    return numberProblem({
      prompt: t(
        `$X$ and $Y$ are independent, $M_{X}(t) = e^{${a}(e^{t} - 1)}$ and $M_{X + Y}(t) = e^{${a + b}(e^{t} - 1)}$. Find $E[Y]$.`,
        `$X$ 与 $Y$ 独立，$M_{X}(t) = e^{${a}(e^{t} - 1)}$，$M_{X + Y}(t) = e^{${a + b}(e^{t} - 1)}$。求 $E[Y]$。`,
      ),
      answer: b,
      mistakes: distinctFrom(b, [
        why(a + b, "That is the mean of the sum $X + Y$.", "那是和 $X + Y$ 的均值。"),
        why(a, "That is the mean of $X$.", "那是 $X$ 的均值。"),
        why(
          Q.of(a + b, a),
          "That divides the parameters; dividing the MGFs subtracts the exponents.",
          "那是参数相除；矩母函数相除是指数相减。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Divide the MGFs", "矩母函数相除"],
            t(
              `Dividing subtracts the exponents, so $M_{Y}(t) = e^{(${a + b} - ${a})(e^{t} - 1)} = e^{${b}(e^{t} - 1)}$.`,
              `相除时指数相减，所以 $M_{Y}(t) = e^{(${a + b} - ${a})(e^{t} - 1)} = e^{${b}(e^{t} - 1)}$。`,
            ),
          ],
          [["Identify the distribution", "识别分布"], t(`So $Y$ is Poisson with mean $${b}$.`, `所以 $Y$ 服从均值为 $${b}$ 的泊松分布。`)],
        ],
        t(
          `Means of independent Poisson variables add: $${a} + ${b} = ${a + b}$, the mean of the sum.`,
          `独立泊松变量的均值相加：$${a} + ${b} = ${a + b}$，正是和的均值。`,
        ),
      ),
    });
  },
);

const twoPoint = point(
  "the-variance-of-a-two-valued-variable",
  ["The variance of a two-valued variable", "两值变量的方差"],
  [
    "Any variable with two values $u$ and $v$ is a linear function of a Bernoulli variable, so it can be written as $v + (u - v)X$. Therefore its variance is $(u - v)^{2}p(1 - p)$, and the gap between the values enters squared.\n\n> **Watch out.** Square the gap and keep both $p$ and $1 - p$. If $Y = 10$ with probability $\\frac{1}{2}$ and $Y = 4$ otherwise, the gap is $6$ and $\\operatorname{Var}(Y) = 36 \\cdot \\frac{1}{4} = 9$, not $6 \\cdot \\frac{1}{4} = \\frac{3}{2}$.",
    "任何只取两个值 $u$ 和 $v$ 的变量都是伯努利变量的线性函数，可以写成 $v + (u - v)X$。所以它的方差是 $(u - v)^{2}p(1 - p)$，两值之差以平方的形式出现。\n\n> **注意。** 差要平方，$p$ 和 $1 - p$ 都要保留。若 $Y$ 以概率 $\\frac{1}{2}$ 取 $10$，否则取 $4$，则差为 $6$，$\\operatorname{Var}(Y) = 36 \\cdot \\frac{1}{4} = 9$，而不是 $6 \\cdot \\frac{1}{4} = \\frac{3}{2}$。",
  ],
  (rng) => {
    const u = rng.int(-9, 9);
    const v = u + rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
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
    const answer = pq.mul(Q.of(gap));
    const p = Q.of(pn, pd);
    const q = Q.of(1).sub(p);
    const slope = u - v < 0 ? `(${u - v})` : `${u - v}`;
    const mean = p.mul(Q.of(u)).add(q.mul(Q.of(v)));
    const square = p.mul(Q.of(u * u)).add(q.mul(Q.of(v * v)));
    const meanTex = mean.isInteger() && mean.sign() >= 0 ? mean.toLatex() : `\\left(${mean.toLatex()}\\right)`;
    return numberProblem({
      prompt: t(
        `$Y = ${u}$ with probability $${p.toLatex()}$ and $Y = ${v}$ otherwise. Find $\\operatorname{Var}(Y)$.`,
        `$Y$ 以概率 $${p.toLatex()}$ 取 $${u}$，否则取 $${v}$。求 $\\operatorname{Var}(Y)$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(
          pq,
          "That is the variance of the Bernoulli variable alone; the gap between the values multiplies it.",
          "那只是伯努利变量的方差；还要乘以两值之差的平方。",
        ),
        why(
          pq.mul(Q.of(Math.abs(u - v))),
          `That multiplies by the gap $${Math.abs(u - v)}$ without squaring it.`,
          `那是乘以差 $${Math.abs(u - v)}$ 而没有平方。`,
        ),
        why(
          p.mul(Q.of(gap)),
          `That uses $p$ instead of $p(1 - p) = ${pq.toLatex()}$.`,
          `那是用了 $p$，而不是 $p(1 - p) = ${pq.toLatex()}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Write Y through a Bernoulli variable", "用伯努利变量表示 Y"],
            t(
              `With $X$ Bernoulli with $p = ${p.toLatex()}$, $Y = ${v} + ${slope}X$.`,
              `设 $X$ 服从 $p = ${p.toLatex()}$ 的伯努利分布，则 $Y = ${v} + ${slope}X$。`,
            ),
          ],
          [
            ["Scale the Bernoulli variance", "按比例放大伯努利方差"],
            t(
              `$\\operatorname{Var}(X) = ${p.toLatex()} \\cdot ${q.toLatex()} = ${pq.toLatex()}$, so $\\operatorname{Var}(Y) = ${slope}^{2} \\cdot ${pq.toLatex()} = ${gap} \\cdot ${pq.toLatex()} = ${answer.toLatex()}$.`,
              `$\\operatorname{Var}(X) = ${p.toLatex()} \\cdot ${q.toLatex()} = ${pq.toLatex()}$，所以 $\\operatorname{Var}(Y) = ${slope}^{2} \\cdot ${pq.toLatex()} = ${gap} \\cdot ${pq.toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `Directly, $E(Y) = ${mean.toLatex()}$ and $E(Y^{2}) = ${square.toLatex()}$, so $\\operatorname{Var}(Y) = ${square.toLatex()} - ${meanTex}^{2} = ${answer.toLatex()}$.`,
          `直接计算：$E(Y) = ${mean.toLatex()}$，$E(Y^{2}) = ${square.toLatex()}$，所以 $\\operatorname{Var}(Y) = ${square.toLatex()} - ${meanTex}^{2} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const whenPoissonWorks = point(
  "when-the-poisson-approximation-is-reliable",
  ["When the Poisson approximation is reliable", "泊松近似何时可靠"],
  [
    "Matching the mean is not enough for a Poisson approximation. It works when $n$ is large and $p$ is small, since then the variance $np(1 - p)$ is close to the mean. With a large $p$, the two differ and the approximation fails.\n\n> **Watch out.** A shared mean does not make two distributions close. $B(20, 0.5)$ and $\\operatorname{Po}(10)$ both have mean $10$, but the binomial has variance $20 \\cdot 0.5 \\cdot 0.5 = 5$ while the Poisson has variance $10$.",
    "泊松近似仅使均值相同是不够的。只有 $n$ 大且 $p$ 小时才有效，因为这时方差 $np(1 - p)$ 接近均值。当 $p$ 较大时两者相差很大，近似就失效了。\n\n> **注意。** 均值相同并不说明两个分布接近。$B(20, 0.5)$ 与 $\\operatorname{Po}(10)$ 的均值都是 $10$，但二项分布的方差是 $20 \\cdot 0.5 \\cdot 0.5 = 5$，而泊松分布的方差是 $10$。",
  ],
  (rng) => {
    const l = rng.int(1, 30);
    const n = rng.pick([1000, 2000, 5000, 10000]);
    const bin = (size: number, p: Q) => t(`$B(${size}, ${dec(p)})$`, `$B(${size}, ${dec(p)})$`);
    const small = Q.of(l, n);
    const spread = (k: number) => {
      const variance = Q.of(l * (k - 1), k);
      return t(
        `Here $p = ${dec(Q.of(1, k))}$ is large, so the variance $${k * l} \\cdot ${dec(Q.of(1, k))} \\cdot ${dec(Q.of(k - 1, k))} = ${dec(variance)}$ is smaller than the Poisson variance $${l}$.`,
        `这里 $p = ${dec(Q.of(1, k))}$ 较大，方差 $${k * l} \\cdot ${dec(Q.of(1, k))} \\cdot ${dec(Q.of(k - 1, k))} = ${dec(variance)}$ 小于泊松分布的方差 $${l}$。`,
      );
    };
    return explainedChoice(rng, {
      prompt: t(
        `Each binomial below has mean $${l}$. Which is best approximated by $\\operatorname{Po}(${l})$?`,
        `下面的二项分布均值都是 $${l}$。哪一个最适合用 $\\operatorname{Po}(${l})$ 近似？`,
      ),
      correct: bin(n, small),
      wrong: [2, 4, 5].map((k) => ({ option: bin(k * l, Q.of(1, k)), why: spread(k) })),
      solution: t(
        `The approximation needs large $n$ and small $p$, so that the variance $np(1 - p)$ is close to the mean. Only $B(${n}, ${dec(small)})$ qualifies: its variance is $${l} \\cdot ${dec(Q.of(1).sub(small))} = ${dec(Q.of(l * (n - l), n))}$, almost exactly $${l}$.`,
        `这种近似要求 $n$ 大而 $p$ 小，使方差 $np(1 - p)$ 接近均值。只有 $B(${n}, ${dec(small)})$ 符合：它的方差是 $${l} \\cdot ${dec(Q.of(1).sub(small))} = ${dec(Q.of(l * (n - l), n))}$，几乎正好是 $${l}$。`,
      ),
    });
  },
);

const failures = point(
  "counting-failures-instead-of-trials",
  ["Counting failures instead of trials", "数失败次数而不是试验次数"],
  [
    "The negative binomial can count trials or failures, and the two differ by the constant $r$. So the mean of the failures is $\\frac{r(1 - p)}{p}$, which is $r$ less than the mean of the trials, while the variance is the same for both versions. With $p = \\frac{1}{10}$ and $r = 20$, the failures have mean $200 - 20 = 180$ and variance $\\frac{20 \\cdot 0.9}{0.01} = 1800$.\n\n> **Watch out.** Subtracting the constant $r$ lowers the mean by $r$ but leaves the variance unchanged; only the mean changes between the two versions.",
    "负二项分布可以数试验次数，也可以数失败次数，两者相差常数 $r$。所以失败次数的均值是 $\\frac{r(1 - p)}{p}$，比试验次数的均值少 $r$，而两种形式的方差相同。若 $p = \\frac{1}{10}$，$r = 20$，失败次数的均值是 $200 - 20 = 180$，方差是 $\\frac{20 \\cdot 0.9}{0.01} = 1800$。\n\n> **注意。** 减去常数 $r$ 使均值减少 $r$，但方差不变；两种形式之间只有均值不同。",
  ],
  (rng) => {
    const r = rng.int(2, 9);
    const k = rng.int(2, 6);
    const p = Q.of(1, k);
    const q = Q.of(k - 1, k);
    if (rng.bool()) {
      const answer = r * (k - 1);
      return numberProblem({
        prompt: t(
          `Trials with success probability $${p.toLatex()}$ continue until $${r}$ successes. Find the expected number of failures.`,
          `成功概率为 $${p.toLatex()}$ 的试验一直进行到 $${r}$ 次成功。求失败次数的期望。`,
        ),
        answer,
        mistakes: distinctFrom(answer, [
          why(r * k, "That is the expected number of trials, which includes the successes.", "那是试验次数的期望，其中包括成功的次数。"),
          why(Q.of(r, k), "That multiplies by $p$ instead of dividing by it.", "那是乘以 $p$，而不是除以 $p$。"),
          why(k - 1, "That is the expected number of failures before a single success.", "那只是一次成功之前失败次数的期望。"),
        ]),
        solution: walked(
          [
            [
              ["Count the trials", "计算试验次数"],
              t(
                `The expected number of trials is $\\frac{r}{p} = ${r} \\cdot ${k} = ${r * k}$.`,
                `试验次数的期望是 $\\frac{r}{p} = ${r} \\cdot ${k} = ${r * k}$。`,
              ),
            ],
            [
              ["Remove the successes", "去掉成功次数"],
              t(
                `$${r}$ of the trials are successes, so the expected number of failures is $${r * k} - ${r} = ${answer}$.`,
                `其中 $${r}$ 次是成功，所以失败次数的期望是 $${r * k} - ${r} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `$\\frac{r(1 - p)}{p} = \\frac{${r} \\cdot ${q.toLatex()}}{${p.toLatex()}} = ${answer}$.`,
            `$\\frac{r(1 - p)}{p} = \\frac{${r} \\cdot ${q.toLatex()}}{${p.toLatex()}} = ${answer}$。`,
          ),
        ),
      });
    }
    const answer = r * (k - 1) * k;
    return numberProblem({
      prompt: t(
        `Trials with success probability $${p.toLatex()}$ continue until $${r}$ successes. Find the variance of the number of failures.`,
        `成功概率为 $${p.toLatex()}$ 的试验一直进行到 $${r}$ 次成功。求失败次数的方差。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(r * (k - 1), "That is the mean of the failures, not the variance.", "那是失败次数的均值，不是方差。"),
        why(r * k * k, "That is $\\frac{r}{p^{2}}$, which leaves out the factor $1 - p$.", "那是 $\\frac{r}{p^{2}}$，漏掉了因子 $1 - p$。"),
        why(answer - r, "Subtracting the constant $r$ changes the mean, not the variance.", "减去常数 $r$ 改变的是均值，不是方差。"),
      ]),
      solution: walked(
        [
          [
            ["Relate the two counts", "联系两种计数"],
            t(
              `Failures equal trials minus the constant $${r}$, so they have the same variance as the trials.`,
              `失败次数等于试验次数减去常数 $${r}$，所以它们与试验次数的方差相同。`,
            ),
          ],
          [
            ["Use the variance formula", "使用方差公式"],
            t(
              `$\\frac{r(1 - p)}{p^{2}} = \\frac{${r} \\cdot ${q.toLatex()}}{${Q.of(1, k * k).toLatex()}} = ${answer}$.`,
              `$\\frac{r(1 - p)}{p^{2}} = \\frac{${r} \\cdot ${q.toLatex()}}{${Q.of(1, k * k).toLatex()}} = ${answer}$。`,
            ),
          ],
        ],
        t(
          `Each failure count before a success is geometric with variance $\\frac{1 - p}{p^{2}} = ${(k - 1) * k}$, and $${r}$ independent ones give $${r} \\cdot ${(k - 1) * k} = ${answer}$.`,
          `每次成功之前的失败次数服从几何分布，方差为 $\\frac{1 - p}{p^{2}} = ${(k - 1) * k}$，$${r}$ 个独立的相加得 $${r} \\cdot ${(k - 1) * k} = ${answer}$。`,
        ),
      ),
    });
  },
);

const binomialProbability = point(
  "a-binomial-probability-from-the-normal-table",
  ["A binomial probability from the normal table", "由正态分布表求二项概率"],
  [
    "To use the normal table for a binomial probability, correct for continuity first and then standardize. The direction of the correction depends on whether the endpoint is included, and an upper tail is one minus the table value. For $X \\sim B(400, 0.5)$ the mean is $200$ and the standard deviation is $\\sqrt{400 \\cdot 0.5 \\cdot 0.5} = 10$, so $P(X \\ge 210)$ becomes $P(X > 209.5)$, with $z = \\frac{209.5 - 200}{10} = 0.95$, and the probability is $1 - \\Phi(0.95)$.\n\n> **Watch out.** Move the boundary half a unit so that the bar at an included endpoint stays in: $X \\ge k$ and $X < k$ both correct to $k - 0.5$, while $X \\le k$ and $X > k$ correct to $k + 0.5$. An upper tail is $1 - \\Phi(z)$, not $\\Phi(z)$.",
    "用正态分布表求二项概率时，要先做连续性校正，再标准化。校正的方向取决于端点是否包含在内，上尾概率等于一减去表中的值。对 $X \\sim B(400, 0.5)$，均值为 $200$，标准差为 $\\sqrt{400 \\cdot 0.5 \\cdot 0.5} = 10$，所以 $P(X \\ge 210)$ 变为 $P(X > 209.5)$，$z = \\frac{209.5 - 200}{10} = 0.95$，概率为 $1 - \\Phi(0.95)$。\n\n> **注意。** 边界要移动半个单位，使包含在内的端点处的条形留在事件中：$X \\ge k$ 和 $X < k$ 都校正为 $k - 0.5$，而 $X \\le k$ 和 $X > k$ 校正为 $k + 0.5$。上尾概率是 $1 - \\Phi(z)$，而不是 $\\Phi(z)$。",
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
    const boundary = dec(Q.of(boundaryTwice, 2));
    return numberProblem({
      prompt: t(
        `$X \\sim B(100, 0.5)$. Use a normal approximation with continuity correction to find $P(${event})$. Use $${given(z)}$ and $${given(raw)}$.`,
        `$X \\sim B(100, 0.5)$。用带连续性校正的正态近似求 $P(${event})$。利用 $${given(z)}$ 和 $${given(raw)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: distinctFrom(answer, [
        why(
          trap,
          `That standardizes $${k}$ itself; the continuity correction moves the boundary to $${boundary}$ first.`,
          `那是直接把 $${k}$ 标准化；连续性校正要先把边界移到 $${boundary}$。`,
        ),
        lower
          ? why(oneMinus(answer), "That is the upper tail; this event lies below the boundary.", "那是上尾概率；这个事件在边界以下。")
          : why(
              oneMinus(answer),
              "That is the table value, the lower tail; an upper tail is one minus it.",
              "那是表中的值，即下尾概率；上尾概率要用一减去它。",
            ),
        why(
          oneMinus(trap),
          "That skips the continuity correction and takes the wrong tail as well.",
          "那既没有做连续性校正，又取错了尾部。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the mean and spread", "求均值与标准差"],
            t(
              "$\\mu = 100 \\cdot 0.5 = 50$ and $\\sigma = \\sqrt{100 \\cdot 0.5 \\cdot 0.5} = 5$.",
              "$\\mu = 100 \\cdot 0.5 = 50$，$\\sigma = \\sqrt{100 \\cdot 0.5 \\cdot 0.5} = 5$。",
            ),
          ],
          [
            ["Correct for continuity", "做连续性校正"],
            t(
              `$P(${event})$ becomes $P(X ${lower ? "<" : ">"} ${boundary})$, keeping the bar at $${kind === 0 || kind === 2 ? k : lower ? k - 1 : k + 1}$ in the event.`,
              `$P(${event})$ 变为 $P(X ${lower ? "<" : ">"} ${boundary})$，把 $${kind === 0 || kind === 2 ? k : lower ? k - 1 : k + 1}$ 处的条形留在事件中。`,
            ),
          ],
          [
            ["Standardize", "标准化"],
            t(
              `$z = \\frac{${boundary} - 50}{5} = ${zText(z)}$, so the probability is $${lower ? "" : "1 - "}\\Phi(${zText(z)}) = ${dec(answer)}$.`,
              `$z = \\frac{${boundary} - 50}{5} = ${zText(z)}$，所以概率为 $${lower ? "" : "1 - "}\\Phi(${zText(z)}) = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `The boundary $${boundary}$ lies above the mean $50$, so the ${lower ? "lower tail must exceed" : "upper tail must fall below"} $0.5$, and $${dec(answer)}$ does.`,
          `边界 $${boundary}$ 在均值 $50$ 之上，所以${lower ? "下尾概率应大于" : "上尾概率应小于"} $0.5$，而 $${dec(answer)}$ 正是如此。`,
        ),
      ),
    });
  },
);

const poissonProbability = point(
  "a-poisson-tail-from-the-normal-table",
  ["A Poisson tail from the normal table", "由正态分布表求泊松尾概率"],
  [
    "A Poisson variable with a large mean is close to normal, with variance equal to its mean. The standard deviation is therefore the square root of $\\lambda$, and because the variable counts, the boundary needs a continuity correction before it is standardized. For $X \\sim \\operatorname{Po}(400)$ the standard deviation is $\\sqrt{400} = 20$, so $P(X \\ge 431)$ becomes $P(X > 430.5)$, with $z = \\frac{430.5 - 400}{20} = 1.525$.\n\n> **Watch out.** Standardize with $\\sqrt{\\lambda}$, not with $\\lambda$ itself. And $X \\ge m$ and $X < m$ both correct to $m - 0.5$, since $X < m$ means $X \\le m - 1$.",
    "均值较大的泊松变量接近正态分布，方差等于均值。所以标准差是 $\\lambda$ 的平方根，而且由于变量是计数的，边界在标准化之前要做连续性校正。对 $X \\sim \\operatorname{Po}(400)$，标准差是 $\\sqrt{400} = 20$，所以 $P(X \\ge 431)$ 变为 $P(X > 430.5)$，$z = \\frac{430.5 - 400}{20} = 1.525$。\n\n> **注意。** 标准化时除以 $\\sqrt{\\lambda}$，而不是 $\\lambda$ 本身。$X \\ge m$ 和 $X < m$ 都校正为 $m - 0.5$，因为 $X < m$ 就是 $X \\le m - 1$。",
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
    return numberProblem({
      prompt: t(
        `$X \\sim \\operatorname{Po}(${l})$. Use a normal approximation with continuity correction to find $P(${event})$. Use $${givenAmong(z)}$.`,
        `$X \\sim \\operatorname{Po}(${l})$。用带连续性校正的正态近似求 $P(${event})$。利用 $${givenAmong(z)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: distinctFrom(answer, [
        upper
          ? why(
              oneMinus(answer),
              "That is the table value, the lower tail; an upper tail is one minus it.",
              "那是表中的值，即下尾概率；上尾概率要用一减去它。",
            )
          : why(oneMinus(answer), "That is the upper tail; this event lies below the boundary.", "那是上尾概率；这个事件在边界以下。"),
        why(phi(z).sub(Q.of(1, 2)), "That is only the area between the mean and the boundary.", "那只是均值与边界之间的面积。"),
        why(
          Q.of(1, 1).sub(phi(z).sub(Q.of(1, 2))),
          "That subtracts only the area between the mean and the boundary from $1$.",
          "那只是用 $1$ 减去均值与边界之间的面积。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the mean and spread", "求均值与标准差"],
            t(
              `For a Poisson variable the variance equals the mean, $${l}$, so $\\sigma = \\sqrt{${l}} = ${s}$.`,
              `泊松变量的方差等于均值 $${l}$，所以 $\\sigma = \\sqrt{${l}} = ${s}$。`,
            ),
          ],
          [
            ["Correct for continuity", "做连续性校正"],
            t(
              `$P(${event})$ becomes $P(X ${upper ? ">" : "<"} ${dec(boundary)})$.`,
              `$P(${event})$ 变为 $P(X ${upper ? ">" : "<"} ${dec(boundary)})$。`,
            ),
          ],
          [
            ["Standardize", "标准化"],
            t(
              `$z = \\frac{${dec(boundary)} - ${l}}{${s}} = ${zText(z)}$, so the probability is $${upper ? "1 - " : ""}\\Phi(${zText(z)}) = ${dec(answer)}$.`,
              `$z = \\frac{${dec(boundary)} - ${l}}{${s}} = ${zText(z)}$，所以概率为 $${upper ? "1 - " : ""}\\Phi(${zText(z)}) = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `The boundary $${dec(boundary)}$ lies above the mean $${l}$, so the ${upper ? "upper tail must fall below" : "lower tail must exceed"} $0.5$, and $${dec(answer)}$ does.`,
          `边界 $${dec(boundary)}$ 在均值 $${l}$ 之上，所以${upper ? "上尾概率应小于" : "下尾概率应大于"} $0.5$，而 $${dec(answer)}$ 正是如此。`,
        ),
      ),
    });
  },
);

const rectangle = {
  ...point(
    "a-rectangle-probability-from-the-joint-cdf",
    ["A rectangle probability from the joint CDF", "由联合分布函数求矩形概率"],
    [
      "The joint CDF gives the probability of a corner region. To isolate a rectangle, subtract the two regions on its left and below, and then add back the lower left corner, which has been subtracted twice. This is inclusion and exclusion applied to the CDF. In the drawing the shaded cell $X = 2$, $Y = 2$ gets $F(2, 2) - F(1, 2) - F(2, 1) + F(1, 1) = \\frac{12}{12} - \\frac{8}{12} - \\frac{8}{12} + \\frac{6}{12} = \\frac{2}{12}$. The same rule works for any rectangle: if $F(10, 20) = 0.3$, $F(40, 20) = 0.5$, $F(10, 50) = 0.45$ and $F(40, 50) = 0.9$, then $P(10 < X \\le 40,\\ 20 < Y \\le 50) = 0.9 - 0.45 - 0.5 + 0.3 = 0.25$.\n\n> **Watch out.** Add the lower left corner back once. Without it the answer is too small, because that corner lies inside both regions that were subtracted.",
      "联合分布函数给出角形区域的概率。要分离出一个矩形，先减去它左边和下边的两个区域，再加回被减了两次的左下角。这就是容斥原理在分布函数上的应用。图中阴影单元格 $X = 2$，$Y = 2$ 的概率为 $F(2, 2) - F(1, 2) - F(2, 1) + F(1, 1) = \\frac{12}{12} - \\frac{8}{12} - \\frac{8}{12} + \\frac{6}{12} = \\frac{2}{12}$。同样的法则适用于任何矩形：若 $F(10, 20) = 0.3$，$F(40, 20) = 0.5$，$F(10, 50) = 0.45$，$F(40, 50) = 0.9$，则 $P(10 < X \\le 40,\\ 20 < Y \\le 50) = 0.9 - 0.45 - 0.5 + 0.3 = 0.25$。\n\n> **注意。** 左下角要加回一次。不加回，答案就偏小，因为这个角同时落在被减去的两个区域里。",
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
      const answer = Q.of(q, 100);
      return numberProblem({
        prompt: t(`A joint CDF has $${data}$. Find $P(${event})$.`, `联合分布函数满足 $${data}$。求 $P(${event})$。`),
        answer,
        form: "decimal",
        mistakes: distinctFrom(answer, [
          why(
            Q.of(r + s + q, 100),
            `That subtracts only the lower left corner $F(${a}, ${c})$, not the two regions beside the rectangle.`,
            `那只减去了左下角 $F(${a}, ${c})$，没有减去矩形旁边的两个区域。`,
          ),
          why(
            Q.of(q + A, 100),
            `That adds $F(${a}, ${c})$ back twice; it was subtracted twice, so it comes back once.`,
            `那把 $F(${a}, ${c})$ 加回了两次；它被减了两次，只需加回一次。`,
          ),
          why(
            Q.of(A + r + s + q, 100),
            `That is $F(${b}, ${d})$ alone, the whole corner region below and to the left of $(${b}, ${d})$.`,
            `那只是 $F(${b}, ${d})$，即 $(${b}, ${d})$ 左下方的整个角形区域。`,
          ),
          why(
            Q.of(q - A, 100),
            `That forgets to add back the corner $F(${a}, ${c})$, which was subtracted twice.`,
            `那忘了加回被减了两次的角 $F(${a}, ${c})$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Set up inclusion and exclusion", "写出容斥式"],
              t(
                `$P = F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c})$.`,
                `$P = F(${b}, ${d}) - F(${a}, ${d}) - F(${b}, ${c}) + F(${a}, ${c})$。`,
              ),
            ],
            [
              ["Substitute", "代入"],
              t(
                `$P = ${x(A + r + s + q)} - ${x(A + s)} - ${x(A + r)} + ${x(A)} = ${x(q)}$.`,
                `$P = ${x(A + r + s + q)} - ${x(A + s)} - ${x(A + r)} + ${x(A)} = ${x(q)}$。`,
              ),
            ],
          ],
          t(
            `The four pieces, the corner $F(${a}, ${c}) = ${x(A)}$, the strip below the rectangle $${x(r)}$, the strip to its left $${x(s)}$ and the rectangle $${x(q)}$, add up to $${x(A + r + s + q)} = F(${b}, ${d})$.`,
            `四块，即角 $F(${a}, ${c}) = ${x(A)}$、矩形下方的条 $${x(r)}$、矩形左侧的条 $${x(s)}$ 与矩形 $${x(q)}$，之和为 $${x(A + r + s + q)} = F(${b}, ${d})$。`,
          ),
        ),
      });
    },
  ),
  figure: probabilityDrawings1["the-joint-cdf-of-two-discrete-random-variables#a-rectangle-probability-from-the-joint-cdf"],
};

const marginalMean = point(
  "a-mean-through-the-marginal-distribution",
  ["A mean through the marginal distribution", "通过边缘分布求均值"],
  [
    "The mean of one variable in a two-way table needs its marginal distribution: add across the other variable first, and then weight each value by its total. Using only one row would give a conditional mean rather than the overall mean. If $P(0, 1) = 0.1$, $P(0, 5) = 0.3$, $P(1, 1) = 0.2$ and $P(1, 5) = 0.4$, the marginals are $P(Y = 1) = 0.3$ and $P(Y = 5) = 0.7$, so $E[Y] = 0.3 + 5 \\cdot 0.7 = 3.8$.\n\n> **Watch out.** Add each column over both values of $X$ before weighting. The row $X = 0$ alone, rescaled, gives $E[Y \\mid X = 0] = \\frac{0.1 + 5 \\cdot 0.3}{0.4} = 4$, a conditional mean.",
    "求两向表中一个变量的均值，需要它的边缘分布：先对另一个变量求和，再用各自的总和给每个值加权。只用一行得到的是条件均值，而不是总体均值。若 $P(0, 1) = 0.1$，$P(0, 5) = 0.3$，$P(1, 1) = 0.2$，$P(1, 5) = 0.4$，则边缘概率为 $P(Y = 1) = 0.3$，$P(Y = 5) = 0.7$，所以 $E[Y] = 0.3 + 5 \\cdot 0.7 = 3.8$。\n\n> **注意。** 加权之前要先把每一列对 $X$ 的两个值求和。只用 $X = 0$ 这一行并重新缩放，得到的是条件均值 $E[Y \\mid X = 0] = \\frac{0.1 + 5 \\cdot 0.3}{0.4} = 4$。",
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
    const reduced = answer.toLatex() === `\\frac{${top}}{${total}}` ? answer.toLatex() : `\\frac{${top}}{${total}} = ${answer.toLatex()}`;
    const column = (i: 0 | 1 | 2) => `P(Y = ${i + 1}) = \\frac{${row0[i]} + ${row1[i]}}{${total}} = \\frac{${row0[i] + row1[i]}}{${total}}`;
    return numberProblem({
      prompt: t(
        `$X \\in \\{0, 1\\}$ and $Y \\in \\{1, 2, 3\\}$ have the joint probabilities $${data}$, where the arguments are $(x, y)$. Find $E[Y]$.`,
        `$X \\in \\{0, 1\\}$ 与 $Y \\in \\{1, 2, 3\\}$ 的联合概率为 $${data}$，其中自变量是 $(x, y)$。求 $E[Y]$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(
          Q.of(row0[0] + 2 * row0[1] + 3 * row0[2], rowTotal),
          "That uses only the row $X = 0$, which gives the conditional mean $E[Y \\mid X = 0]$.",
          "那只用了 $X = 0$ 这一行，得到的是条件均值 $E[Y \\mid X = 0]$。",
        ),
        why(2, "That averages the values $1, 2, 3$ and ignores their probabilities.", "那直接平均了取值 $1, 2, 3$，忽略了它们的概率。"),
        why(
          Q.of(top, 6),
          `That divides by the six cells instead of the common denominator $${total}$.`,
          `那是除以六个格子，而不是公分母 $${total}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Add down each column", "按列求和"],
            t(`$${column(0)}$, $${column(1)}$ and $${column(2)}$.`, `$${column(0)}$，$${column(1)}$，$${column(2)}$。`),
          ],
          [
            ["Weight the values", "按概率加权"],
            t(
              `$E[Y] = \\frac{${m1} + 2 \\cdot ${m2} + 3 \\cdot ${m3}}{${total}} = ${reduced}$.`,
              `$E[Y] = \\frac{${m1} + 2 \\cdot ${m2} + 3 \\cdot ${m3}}{${total}} = ${reduced}$。`,
            ),
          ],
        ],
        t(
          `The marginal numerators add to $${m1} + ${m2} + ${m3} = ${total}$, so the marginal is a distribution, and $${answer.toLatex()}$ lies between $1$ and $3$.`,
          `边缘概率的分子之和为 $${m1} + ${m2} + ${m3} = ${total}$，所以边缘分布是一个分布，且 $${answer.toLatex()}$ 在 $1$ 与 $3$ 之间。`,
        ),
      ),
    });
  },
);

const triangleMarginal = {
  ...point(
    "marginals-of-a-non-constant-density-on-a-triangle",
    ["Marginals of a non-constant density on a triangle", "三角形上非常数密度的边缘分布"],
    [
      "On a triangle, the limits of the integral for a marginal depend on the fixed variable. On $0 \\le y \\le x \\le 1$, integrating out $y$ runs from $0$ to $x$, while integrating out $x$ runs from $y$ to $1$, so the two marginals have different forms. In the drawing the vertical slice at $x = 0.4$ runs from $y = 0$ up to $0.4$, and the horizontal slice at $y = 0.2$ runs from $x = 0.2$ across to $1$. Even the constant density $f = 2$ on this triangle gives two different marginals, $f_{X}(x) = 2x$ and $f_{Y}(y) = 2(1 - y)$.\n\n> **Watch out.** Integrating from $0$ to $1$ in both directions ignores the triangle. Read the limits from a slice through the region at the fixed value.",
      "在三角形上，求边缘密度的积分限依赖于固定的变量。在 $0 \\le y \\le x \\le 1$ 上，对 $y$ 积分时从 $0$ 到 $x$，对 $x$ 积分时从 $y$ 到 $1$，所以两个边缘密度形式不同。图中 $x = 0.4$ 处的竖直切片从 $y = 0$ 向上到 $0.4$，$y = 0.2$ 处的水平切片从 $x = 0.2$ 横向到 $1$。即使是这个三角形上的常数密度 $f = 2$，两个边缘密度也不同：$f_{X}(x) = 2x$，$f_{Y}(y) = 2(1 - y)$。\n\n> **注意。** 两个方向都从 $0$ 积分到 $1$，就忽略了三角形。积分限要从固定值处穿过区域的切片读出。",
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
      const at = v.toLatex();
      const diagonal = Q.of(8, 1).mul(square);
      if (rng.bool()) {
        return numberProblem({
          prompt: t(
            `$(X, Y)$ has density $${density}$ on $${region}$. Find $f_{X}(${at})$.`,
            `$(X, Y)$ 在 $${region}$ 上的密度是 $${density}$。求 $f_{X}(${at})$。`,
          ),
          answer: forX,
          mistakes: distinctFrom(forX, [
            why(
              forY,
              "That integrates $x$ from $y$ to $1$, which gives the other marginal $f_{Y}$.",
              "那是对 $x$ 从 $y$ 积分到 $1$，得到的是另一个边缘密度 $f_{Y}$。",
            ),
            why(
              four,
              "That integrates $y$ from $0$ to $1$, giving $4x$; on the triangle $y$ stops at $x$.",
              "那是对 $y$ 从 $0$ 积分到 $1$，得到 $4x$；在三角形上 $y$ 只到 $x$。",
            ),
            why(
              diagonal,
              "That sets $y = x$ in the density instead of integrating over $y$.",
              "那是在密度中令 $y = x$，而没有对 $y$ 积分。",
            ),
          ]),
          solution: walked(
            [
              [["Read the limits", "读积分限"], t("For a fixed $x$, $y$ runs from $0$ up to $x$.", "固定 $x$ 时，$y$ 从 $0$ 到 $x$。")],
              [
                ["Integrate out y", "对 y 积分"],
                t(
                  "$f_{X}(x) = \\int_{0}^{x} 8xy\\,dy = 4x \\cdot x^{2} = 4x^{3}$.",
                  "$f_{X}(x) = \\int_{0}^{x} 8xy\\,dy = 4x \\cdot x^{2} = 4x^{3}$。",
                ),
              ],
              [
                ["Evaluate", "代值"],
                t(
                  `$f_{X}(${at}) = 4\\left(${at}\\right)^{3} = ${forX.toLatex()}$.`,
                  `$f_{X}(${at}) = 4\\left(${at}\\right)^{3} = ${forX.toLatex()}$。`,
                ),
              ],
            ],
            t(
              "$\\int_0^1 4x^{3}\\,dx = 1$, so $4x^{3}$ is a density on $[0, 1]$, as a marginal must be.",
              "$\\int_0^1 4x^{3}\\,dx = 1$，所以 $4x^{3}$ 是 $[0, 1]$ 上的密度，边缘密度理应如此。",
            ),
          ),
        });
      }
      return numberProblem({
        prompt: t(
          `$(X, Y)$ has density $${density}$ on $${region}$. Find $f_{Y}(${at})$.`,
          `$(X, Y)$ 在 $${region}$ 上的密度是 $${density}$。求 $f_{Y}(${at})$。`,
        ),
        answer: forY,
        mistakes: distinctFrom(forY, [
          why(
            forX,
            "That integrates $y$ from $0$ to $x$, which gives the other marginal $f_{X}$.",
            "那是对 $y$ 从 $0$ 积分到 $x$，得到的是另一个边缘密度 $f_{X}$。",
          ),
          why(
            four,
            "That integrates $x$ from $0$ to $1$, giving $4y$; on the triangle $x$ starts at $y$.",
            "那是对 $x$ 从 $0$ 积分到 $1$，得到 $4y$；在三角形上 $x$ 从 $y$ 开始。",
          ),
          why(diagonal, "That sets $x = y$ in the density instead of integrating over $x$.", "那是在密度中令 $x = y$，而没有对 $x$ 积分。"),
        ]),
        solution: walked(
          [
            [["Read the limits", "读积分限"], t("For a fixed $y$, $x$ runs from $y$ across to $1$.", "固定 $y$ 时，$x$ 从 $y$ 到 $1$。")],
            [
              ["Integrate out x", "对 x 积分"],
              t("$f_{Y}(y) = \\int_y^1 8xy\\,dx = 4y(1 - y^{2})$.", "$f_{Y}(y) = \\int_y^1 8xy\\,dx = 4y(1 - y^{2})$。"),
            ],
            [
              ["Evaluate", "代值"],
              t(
                `$f_{Y}(${at}) = 4 \\cdot ${at}\\left(1 - ${square.toLatex()}\\right) = ${forY.toLatex()}$.`,
                `$f_{Y}(${at}) = 4 \\cdot ${at}\\left(1 - ${square.toLatex()}\\right) = ${forY.toLatex()}$。`,
              ),
            ],
          ],
          t(
            "$\\int_0^1 4y(1 - y^{2})\\,dy = 2 - 1 = 1$, so $4y(1 - y^{2})$ is a density on $[0, 1]$, as a marginal must be.",
            "$\\int_0^1 4y(1 - y^{2})\\,dy = 2 - 1 = 1$，所以 $4y(1 - y^{2})$ 是 $[0, 1]$ 上的密度，边缘密度理应如此。",
          ),
        ),
      });
    },
  ),
  figure: probabilityDrawings1["marginal-distributions-for-continuous-random-variables#marginals-of-a-non-constant-density-on-a-triangle"],
};

const independenceTests = {
  ...point(
    "both-the-formula-and-the-support-must-factor",
    ["Both the formula and the support must factor", "公式和支撑集都必须能分解"],
    [
      "Two continuous variables are independent only if the joint density factors into a function of $x$ times a function of $y$ and the support is a rectangle. A triangle fails even when the formula looks like a product, since the range of one variable depends on the other. In the drawing, $4xy$ on the unit square passes both tests, while $8xy$ on the triangle $0 \\le y \\le x \\le 1$ fails the second: its slices show that the range of $y$ depends on $x$. A support may also be unbounded: $6e^{-2x - 3y}$ on $x \\ge 0,\\ y \\ge 0$ is $2e^{-2x} \\cdot 3e^{-3y}$ on a product of two intervals, so $X$ and $Y$ are independent.\n\n> **Watch out.** Check both conditions. A product formula on a triangle is not independent, and a rectangle does not help a formula such as $x + y$ that cannot be split.",
      "两个连续变量独立，要求联合密度能分解为 $x$ 的函数与 $y$ 的函数之积，且支撑集是矩形。三角形不满足这一条，即使公式看起来是乘积，因为一个变量的范围依赖于另一个变量。图中单位正方形上的 $4xy$ 两项检验都通过；而三角形 $0 \\le y \\le x \\le 1$ 上的 $8xy$ 未通过第二项：切片表明 $y$ 的范围依赖于 $x$。支撑集也可以无界：$x \\ge 0,\\ y \\ge 0$ 上的 $6e^{-2x - 3y}$ 等于 $2e^{-2x} \\cdot 3e^{-3y}$，支撑集是两个区间的乘积，所以 $X$ 与 $Y$ 独立。\n\n> **注意。** 两个条件都要检查。三角形上的乘积公式并不独立；而像 $x + y$ 这样不能拆开的公式，即使在矩形上也不独立。",
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
      const integrates: Pair = ["Independent: the density is nonnegative and integrates to one", "独立：密度非负且积分为一"];
      const steps: [Pair, Pair, Pair][] = [
        [
          [
            "The formula is a constant times a power of $x$ times a power of $y$, so it factors.",
            "公式是常数乘以 $x$ 的幂再乘以 $y$ 的幂，所以能分解。",
          ],
          ["The region is the unit square, a rectangle.", "区域是单位正方形，是矩形。"],
          [
            "Each factor, scaled to integrate to $1$ on $[0, 1]$, is a marginal, and the product of the two marginals gives back the density.",
            "每个因子缩放到在 $[0, 1]$ 上积分为 $1$ 后就是边缘密度，两个边缘密度之积还原出联合密度。",
          ],
        ],
        [
          [
            "The formula is a constant times a power of $x$ times a power of $y$, so it looks like a product.",
            "公式是常数乘以 $x$ 的幂再乘以 $y$ 的幂，看起来是乘积。",
          ],
          ["The region is a triangle: for each $x$, $y$ only runs up to $x$.", "区域是三角形：对每个 $x$，$y$ 只能到 $x$。"],
          [
            "At $x = \\frac{1}{2}$ the variable $Y$ cannot exceed $\\frac{1}{2}$, while at $x = 1$ it can reach $1$, so knowing $X$ changes what $Y$ can be.",
            "当 $x = \\frac{1}{2}$ 时 $Y$ 不能超过 $\\frac{1}{2}$，而当 $x = 1$ 时它可以到 $1$，所以知道 $X$ 会改变 $Y$ 的可能取值。",
          ],
        ],
        [
          [
            "The formula is a sum, $x + y$ over a constant, which cannot be split into a function of $x$ times a function of $y$.",
            "公式是和 $x + y$ 除以常数，不能拆成 $x$ 的函数乘以 $y$ 的函数。",
          ],
          [
            `The region is the square $[0, ${a}]^{2}$, a rectangle, so only the formula fails.`,
            `区域是正方形 $[0, ${a}]^{2}$，是矩形，所以只是公式不满足。`,
          ],
          [
            `At the corner $(0, 0)$ the density is $0$, but each marginal there is $\\frac{1}{${2 * a}}$, so the product of the marginals is $\\frac{1}{${4 * a * a}}$, not $0$.`,
            `在角 $(0, 0)$ 处密度为 $0$，但那里每个边缘密度都是 $\\frac{1}{${2 * a}}$，边缘密度之积为 $\\frac{1}{${4 * a * a}}$，不是 $0$。`,
          ],
        ],
      ];
      const [formulaStep, supportStep, checkStep] = steps[kind] as [Pair, Pair, Pair];
      const reasonFor = (o: Pair): Pair => {
        if (o === integrates)
          return [
            "Every density is nonnegative and integrates to one; that says nothing about independence.",
            "每个密度都非负且积分为一；这与是否独立无关。",
          ];
        if (o === yes)
          return kind === 1
            ? ["The formula factors, but the support is a triangle, not a rectangle.", "公式能分解，但支撑集是三角形，不是矩形。"]
            : ["The support is a square, but $x + y$ does not factor.", "支撑集是正方形，但 $x + y$ 不能分解。"];
        if (o === support)
          return kind === 0
            ? ["The support is the unit square, which is a rectangle.", "支撑集是单位正方形，是矩形。"]
            : ["The support is a square, which is a rectangle; it is the formula that fails.", "支撑集是正方形，是矩形；不满足的是公式。"];
        return kind === 0
          ? [
              "The formula is a constant times a power of $x$ times a power of $y$, so it factors.",
              "公式是常数乘以 $x$ 的幂再乘以 $y$ 的幂，所以能分解。",
            ]
          : ["The formula does factor; it is the support that fails.", "公式能分解；不满足的是支撑集。"];
      };
      return reasoned(
        choose(
          rng,
          [`Are $X$ and $Y$ independent if $${density}$ on $${region}$?`, `如果在 $${region}$ 上 $${density}$，$X$ 与 $Y$ 是否独立？`],
          option,
          [...others, integrates],
          [
            `**Step 1: Test the formula.** ${formulaStep[0]}\n\n**Step 2: Test the support.** ${supportStep[0]} ${(whys[kind] as Pair)[0]}\n\n**Check.** ${checkStep[0]}`,
            `**第一步：检验公式。**${formulaStep[1]}\n\n**第二步：检验支撑集。**${supportStep[1]}${(whys[kind] as Pair)[1]}\n\n**检验。**${checkStep[1]}`,
          ],
        ),
        [...others, integrates].map((o): Reason => [o[0], ...reasonFor(o)]),
      );
    },
  ),
  figure: probabilityDrawings1["independence-of-continuous-random-variables#both-the-formula-and-the-support-must-factor"],
};

const scaledComparison = point(
  "comparing-multiples-of-two-normal-variables",
  ["Comparing multiples of two normal variables", "比较两个正态变量的倍数"],
  [
    "To compare multiples of two independent normal variables, study their difference, which is normal as well. Its variance adds the two variances, each multiplied by the square of its coefficient, even though the variables are being subtracted. For independent $X \\sim N(100, 64)$ and $Y \\sim N(30, 4)$, the difference $X - 3Y$ has mean $100 - 90 = 10$ and variance $64 + 9 \\cdot 4 = 100$, so $P(X > 3Y) = P(X - 3Y > 0) = \\Phi\\left(\\frac{10}{10}\\right) = \\Phi(1)$.\n\n> **Watch out.** The variances add even for a difference, $64 + 9 \\cdot 4$, never $64 - 9 \\cdot 4$. And the coefficient is squared, $9$, not $3$.",
    "比较两个独立正态变量的倍数时，要研究它们的差，这个差也服从正态分布。它的方差是两个方差之和，每个都乘以系数的平方，尽管变量之间是相减的。对独立的 $X \\sim N(100, 64)$ 与 $Y \\sim N(30, 4)$，差 $X - 3Y$ 的均值为 $100 - 90 = 10$，方差为 $64 + 9 \\cdot 4 = 100$，所以 $P(X > 3Y) = P(X - 3Y > 0) = \\Phi\\left(\\frac{10}{10}\\right) = \\Phi(1)$。\n\n> **注意。** 即使是差，方差也要相加：$64 + 9 \\cdot 4$，而不是 $64 - 9 \\cdot 4$。系数要平方，是 $9$ 而不是 $3$。",
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
    const answer = phi(z);
    const mean = p * m1 - q * m2;
    const times = (x: number, y: number) => (x === 1 ? `${y}` : `${x} \\cdot ${y}`);
    return numberProblem({
      prompt: t(
        `$X \\sim N(${m1}, ${s1 * s1})$ and $Y \\sim N(${m2}, ${s2 * s2})$ are independent. Find $P(${left} > ${right})$. Use $${givenAmong(z)}$.`,
        `$X \\sim N(${m1}, ${s1 * s1})$ 与 $Y \\sim N(${m2}, ${s2 * s2})$ 独立。求 $P(${left} > ${right})$。利用 $${givenAmong(z)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: distinctFrom(answer, [
        why(
          oneMinus(answer),
          `That is $P(${left} < ${right})$, the other tail of the difference.`,
          `那是 $P(${left} < ${right})$，即差的另一侧尾部。`,
        ),
        why(
          answer.sub(Q.of(1, 2)),
          "That is only the area between $0$ and the mean of the difference.",
          "那只是 $0$ 与差的均值之间的面积。",
        ),
        why(
          Q.of(1, 2),
          "That treats the difference as centered at $0$; its mean is not $0$.",
          "那是把差当作以 $0$ 为中心；它的均值不是 $0$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the mean of the difference", "求差的均值"],
            t(
              `$E(${left} - ${right}) = ${times(p, m1)} - ${times(q, m2)} = ${mean}$.`,
              `$E(${left} - ${right}) = ${times(p, m1)} - ${times(q, m2)} = ${mean}$。`,
            ),
          ],
          [
            ["Add the scaled variances", "把缩放后的方差相加"],
            t(
              `$\\operatorname{Var}(${left} - ${right}) = ${times(p * p, s1 * s1)} + ${times(q * q, s2 * s2)} = ${sd * sd}$, so the standard deviation is $${sd}$.`,
              `$\\operatorname{Var}(${left} - ${right}) = ${times(p * p, s1 * s1)} + ${times(q * q, s2 * s2)} = ${sd * sd}$，所以标准差是 $${sd}$。`,
            ),
          ],
          [
            ["Standardize", "标准化"],
            t(
              `$P(${left} - ${right} > 0) = P\\left(Z > -\\frac{${mean}}{${sd}}\\right) = \\Phi(${zText(z)}) = ${dec(answer)}$.`,
              `$P(${left} - ${right} > 0) = P\\left(Z > -\\frac{${mean}}{${sd}}\\right) = \\Phi(${zText(z)}) = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `The difference has a positive mean, so $${left} > ${right}$ more often than not: the probability must exceed $0.5$, and $${dec(answer)}$ does.`,
          `差的均值为正，所以 $${left} > ${right}$ 的情形多于一半：概率应大于 $0.5$，而 $${dec(answer)}$ 正是如此。`,
        ),
      ),
    });
  },
);

const threeNormals = point(
  "a-probability-for-a-sum-of-three-normals",
  ["A probability for a sum of three normals", "三个正态变量之和的概率"],
  [
    "A sum of independent normal variables is normal, with the means added and the variances added. The standard deviations do not add. So the sum must be standardized with the square root of the total variance before the table can be used. For independent $X_{1} \\sim N(10, 9)$, $X_{2} \\sim N(20, 16)$ and $X_{3} \\sim N(30, 144)$, the sum has mean $60$ and variance $9 + 16 + 144 = 169$, so its standard deviation is $13$ and $P(X_{1} + X_{2} + X_{3} \\le 73) = \\Phi(1)$.\n\n> **Watch out.** Add the variances, then take the square root. Adding the standard deviations gives $3 + 4 + 12 = 19$, not $13$.",
    "独立正态变量之和仍服从正态分布，均值相加，方差相加。标准差不能相加。所以使用分布表之前，要用总方差的平方根把和标准化。对独立的 $X_{1} \\sim N(10, 9)$、$X_{2} \\sim N(20, 16)$、$X_{3} \\sim N(30, 144)$，和的均值为 $60$，方差为 $9 + 16 + 144 = 169$，所以标准差为 $13$，$P(X_{1} + X_{2} + X_{3} \\le 73) = \\Phi(1)$。\n\n> **注意。** 先把方差相加，再开平方。把标准差相加得 $3 + 4 + 12 = 19$，而不是 $13$。",
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
    return numberProblem({
      prompt: t(
        `$${data}$ are independent. Find $P(${event})$. Use $${givenAmong(z)}$.`,
        `$${data}$ 相互独立。求 $P(${event})$。利用 $${givenAmong(z)}$。`,
      ),
      answer,
      form: "decimal",
      mistakes: distinctFrom(answer, [
        lower
          ? why(oneMinus(answer), "That is the upper tail; this event lies below the bound.", "那是上尾概率；这个事件在界限以下。")
          : why(
              oneMinus(answer),
              "That is the table value, the lower tail; an upper tail is one minus it.",
              "那是表中的值，即下尾概率；上尾概率要用一减去它。",
            ),
        why(phi(z).sub(Q.of(1, 2)), "That is only the area between the mean and the bound.", "那只是均值与界限之间的面积。"),
        why(
          Q.of(1, 2),
          `That treats $${bound}$ as the mean; the mean of the sum is $${mean}$.`,
          `那是把 $${bound}$ 当作均值；和的均值是 $${mean}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Add the means", "均值相加"],
            t(`$E(${sum}) = ${m1} + ${m2} + ${m3} = ${mean}$.`, `$E(${sum}) = ${m1} + ${m2} + ${m3} = ${mean}$。`),
          ],
          [
            ["Add the variances", "方差相加"],
            t(
              `$\\operatorname{Var}(${sum}) = ${a} + ${b} + ${c} = ${sd * sd}$, so the standard deviation is $\\sqrt{${sd * sd}} = ${sd}$.`,
              `$\\operatorname{Var}(${sum}) = ${a} + ${b} + ${c} = ${sd * sd}$，所以标准差为 $\\sqrt{${sd * sd}} = ${sd}$。`,
            ),
          ],
          [
            ["Standardize", "标准化"],
            t(
              `$z = \\frac{${bound} - ${mean}}{${sd}} = ${zText(z)}$, so the probability is $${lower ? "" : "1 - "}\\Phi(${zText(z)}) = ${dec(answer)}$.`,
              `$z = \\frac{${bound} - ${mean}}{${sd}} = ${zText(z)}$，所以概率为 $${lower ? "" : "1 - "}\\Phi(${zText(z)}) = ${dec(answer)}$。`,
            ),
          ],
        ],
        t(
          `The bound $${bound}$ lies above the mean $${mean}$, so the ${lower ? "lower tail must exceed" : "upper tail must fall below"} $0.5$, and $${dec(answer)}$ does.`,
          `界限 $${bound}$ 在均值 $${mean}$ 之上，所以${lower ? "下尾概率应大于" : "上尾概率应小于"} $0.5$，而 $${dec(answer)}$ 正是如此。`,
        ),
      ),
    });
  },
);

const meanMinusOne = point(
  "the-variance-of-the-sample-mean-minus-one-observation",
  ["The variance of the sample mean minus one observation", "样本均值减一个观测的方差"],
  [
    "The sample mean contains each observation, so $\\bar{X}$ and $X_{1}$ are dependent and their variances cannot simply be added. Writing $\\bar{X} - X_{1}$ as a combination of the independent $X_{i}$ collects the coefficients and gives the right variance. With $n = 100$ observations of variance $50$, $X_{1}$ has coefficient $\\frac{1}{100} - 1 = -\\frac{99}{100}$ and the other $99$ have $\\frac{1}{100}$, so $\\operatorname{Var}(\\bar{X} - X_{1}) = 50\\left(\\frac{9801}{10000} + \\frac{99}{10000}\\right) = 49.5 = \\frac{99}{2}$.\n\n> **Watch out.** Adding $\\operatorname{Var}(\\bar{X}) + \\operatorname{Var}(X_{1})$ treats them as independent and gives too much; $X_{1}$ sits inside $\\bar{X}$, so its two appearances partly cancel.",
    "样本均值包含每个观测，所以 $\\bar{X}$ 与 $X_{1}$ 相依，它们的方差不能简单相加。把 $\\bar{X} - X_{1}$ 写成独立的 $X_{i}$ 的组合，合并系数后才能得到正确的方差。对方差为 $50$ 的 $n = 100$ 个观测，$X_{1}$ 的系数是 $\\frac{1}{100} - 1 = -\\frac{99}{100}$，其余 $99$ 个的系数是 $\\frac{1}{100}$，所以 $\\operatorname{Var}(\\bar{X} - X_{1}) = 50\\left(\\frac{9801}{10000} + \\frac{99}{10000}\\right) = 49.5 = \\frac{99}{2}$。\n\n> **注意。** 把 $\\operatorname{Var}(\\bar{X}) + \\operatorname{Var}(X_{1})$ 相加，是把它们当作独立，结果偏大；$X_{1}$ 包含在 $\\bar{X}$ 中，两次出现会部分抵消。",
  ],
  (rng) => {
    const n = rng.int(2, 12);
    const v = rng.int(1, 24);
    const answer = Q.of(v * (n - 1), n);
    const lead = v === 1 ? "" : `${v}`;
    return numberProblem({
      prompt: t(
        `$X_{1}, \\dots, X_{${n}}$ are i.i.d. $N(\\mu, ${v})$ with sample mean $\\bar{X}$. Find $\\operatorname{Var}(\\bar{X} - X_{1})$.`,
        `$X_{1}, \\dots, X_{${n}}$ 独立同分布于 $N(\\mu, ${v})$，样本均值为 $\\bar{X}$。求 $\\operatorname{Var}(\\bar{X} - X_{1})$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(
          Q.of(v * (n + 1), n),
          "That adds $\\operatorname{Var}(\\bar{X})$ and $\\operatorname{Var}(X_{1})$ as if they were independent; $X_{1}$ is part of $\\bar{X}$.",
          "那是把 $\\operatorname{Var}(\\bar{X})$ 与 $\\operatorname{Var}(X_{1})$ 当作独立而相加；$X_{1}$ 是 $\\bar{X}$ 的一部分。",
        ),
        why(Q.of(v, n), "That is $\\operatorname{Var}(\\bar{X})$ alone.", "那只是 $\\operatorname{Var}(\\bar{X})$。"),
        why(
          Q.of(v * (n - 1) * (n - 1), n * n),
          "That squares only the coefficient of $X_{1}$ and leaves out the other observations.",
          "那只平方了 $X_{1}$ 的系数，漏掉了其他观测。",
        ),
        why(0, "That cancels $X_{1}$ against $\\bar{X}$; they are not equal.", "那是把 $X_{1}$ 与 $\\bar{X}$ 抵消了；它们并不相等。"),
      ]),
      solution: walked(
        [
          [
            ["Collect the coefficients", "合并系数"],
            t(
              `$\\bar{X} - X_{1} = \\left(\\frac{1}{${n}} - 1\\right)X_{1} + \\frac{1}{${n}}(X_{2} + \\dots + X_{${n}})$, so $X_{1}$ has coefficient $-\\frac{${n - 1}}{${n}}$ and the other $${n - 1}$ have $\\frac{1}{${n}}$.`,
              `$\\bar{X} - X_{1} = \\left(\\frac{1}{${n}} - 1\\right)X_{1} + \\frac{1}{${n}}(X_{2} + \\dots + X_{${n}})$，所以 $X_{1}$ 的系数是 $-\\frac{${n - 1}}{${n}}$，其余 $${n - 1}$ 个的系数是 $\\frac{1}{${n}}$。`,
            ),
          ],
          [
            ["Square and add", "平方后相加"],
            t(
              `$\\operatorname{Var} = ${lead}\\left(\\frac{${(n - 1) ** 2}}{${n * n}} + \\frac{${n - 1}}{${n * n}}\\right) = ${answer.toLatex()}$.`,
              `$\\operatorname{Var} = ${lead}\\left(\\frac{${(n - 1) ** 2}}{${n * n}} + \\frac{${n - 1}}{${n * n}}\\right) = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `With $\\operatorname{Cov}(\\bar{X}, X_{1}) = \\frac{${v}}{${n}}$: $\\operatorname{Var}(\\bar{X}) + \\operatorname{Var}(X_{1}) - 2\\operatorname{Cov}(\\bar{X}, X_{1}) = \\frac{${v}}{${n}} + ${v} - \\frac{${2 * v}}{${n}} = ${answer.toLatex()}$.`,
          `由 $\\operatorname{Cov}(\\bar{X}, X_{1}) = \\frac{${v}}{${n}}$：$\\operatorname{Var}(\\bar{X}) + \\operatorname{Var}(X_{1}) - 2\\operatorname{Cov}(\\bar{X}, X_{1}) = \\frac{${v}}{${n}} + ${v} - \\frac{${2 * v}}{${n}} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const covarianceTable = point(
  "covariance-from-a-joint-table",
  ["Covariance from a joint table", "由联合表求协方差"],
  [
    "The covariance needs three expectations from the same table: $E[XY]$ from the joint probabilities and $E[X]$ and $E[Y]$ from the marginals. Then $\\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$, which is zero when the product rule holds. If $X$ and $Y$ take the values $0$ and $10$ with $P(0, 0) = P(10, 10) = 0.4$ and $P(0, 10) = P(10, 0) = 0.1$, then $E[XY] = 100 \\cdot 0.4 = 40$ and $E[X] = E[Y] = 5$, so $\\operatorname{Cov}(X, Y) = 40 - 25 = 15$.\n\n> **Watch out.** $E[XY]$ alone is not the covariance: subtract $E[X]E[Y]$, never add it. With values $0$ and $1$, $E[XY]$ is just $P(1, 1)$, since every other cell has $xy = 0$.",
    "协方差需要从同一张表得到三个期望：由联合概率得 $E[XY]$，由边缘概率得 $E[X]$ 和 $E[Y]$。于是 $\\operatorname{Cov}(X, Y) = E[XY] - E[X]E[Y]$，当乘积法则成立时它为零。若 $X$ 与 $Y$ 取值 $0$ 和 $10$，$P(0, 0) = P(10, 10) = 0.4$，$P(0, 10) = P(10, 0) = 0.1$，则 $E[XY] = 100 \\cdot 0.4 = 40$，$E[X] = E[Y] = 5$，所以 $\\operatorname{Cov}(X, Y) = 40 - 25 = 15$。\n\n> **注意。** 单是 $E[XY]$ 不是协方差：要减去 $E[X]E[Y]$，而不是加上。取值为 $0$ 和 $1$ 时，$E[XY]$ 就是 $P(1, 1)$，因为其他格子都有 $xy = 0$。",
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
    return numberProblem({
      prompt: t(
        `$X$ and $Y$ take values in $\\{0, 1\\}$ with $${data}$, where the arguments are $(x, y)$. Find $\\operatorname{Cov}(X, Y)$.`,
        `$X$ 与 $Y$ 取值于 $\\{0, 1\\}$，$${data}$，其中自变量是 $(x, y)$。求 $\\operatorname{Cov}(X, Y)$。`,
      ),
      answer,
      mistakes: distinctFrom(answer, [
        why(exy, "That is $E[XY]$ alone; $E[X]E[Y]$ must be subtracted.", "那只是 $E[XY]$；还要减去 $E[X]E[Y]$。"),
        why(exy.add(ex.mul(ey)), "That adds $E[X]E[Y]$ instead of subtracting it.", "那是加上了 $E[X]E[Y]$，而不是减去。"),
        why(answer.neg(), "That subtracts in the wrong order, $E[X]E[Y] - E[XY]$.", "那是减反了，算成 $E[X]E[Y] - E[XY]$。"),
      ]),
      solution: walked(
        [
          [
            ["Find the joint expectation", "求乘积的期望"],
            t(
              `Only the cell $(1, 1)$ has $xy \\ne 0$, so $E[XY] = P(1, 1) = ${exy.toLatex()}$.`,
              `只有格子 $(1, 1)$ 的 $xy \\ne 0$，所以 $E[XY] = P(1, 1) = ${exy.toLatex()}$。`,
            ),
          ],
          [
            ["Find the marginal means", "求边缘均值"],
            t(
              `$E[X] = P(X = 1) = ${f(c)} + ${f(d)} = ${ex.toLatex()}$ and $E[Y] = P(Y = 1) = ${f(b)} + ${f(d)} = ${ey.toLatex()}$.`,
              `$E[X] = P(X = 1) = ${f(c)} + ${f(d)} = ${ex.toLatex()}$，$E[Y] = P(Y = 1) = ${f(b)} + ${f(d)} = ${ey.toLatex()}$。`,
            ),
          ],
          [
            ["Subtract", "相减"],
            t(
              `$\\operatorname{Cov}(X, Y) = ${exy.toLatex()} - ${ex.toLatex()} \\cdot ${ey.toLatex()} = ${answer.toLatex()}$.`,
              `$\\operatorname{Cov}(X, Y) = ${exy.toLatex()} - ${ex.toLatex()} \\cdot ${ey.toLatex()} = ${answer.toLatex()}$。`,
            ),
          ],
        ],
        t(
          `For a two-by-two table the covariance is also $P(0, 0)P(1, 1) - P(0, 1)P(1, 0)$, here $\\frac{(${a})(${d}) - (${b})(${c})}{${total * total}} = ${answer.toLatex()}$.`,
          `对二乘二的表，协方差也等于 $P(0, 0)P(1, 1) - P(0, 1)P(1, 0)$，这里为 $\\frac{(${a})(${d}) - (${b})(${c})}{${total * total}} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const extremes = {
  ...point(
    "expected-maximum-minimum-and-distance-of-two-uniforms",
    ["Expected maximum, minimum and distance of two uniforms", "两个均匀变量的最大值、最小值与距离的期望"],
    [
      "Applying the two-variable rule to $\\max(X, Y)$ or $|X - Y|$ means splitting the square along the diagonal and integrating on each triangle. The two independent uniform points on $[0, a]$ then cut the interval into three parts of equal expected length. In the drawing $a = 3$, so $E[\\min(X, Y)] = 1$, $E[\\max(X, Y)] = 2$ and $E|X - Y| = 1$. On $[0, 30]$ the same reasoning gives $E[\\min(X, Y)] = 10$, $E[\\max(X, Y)] = 20$ and $E|X - Y| = 10$.\n\n> **Watch out.** The expected maximum is $\\frac{2a}{3}$, not the right end $a$, and the expected distance is $\\frac{a}{3}$, not $\\frac{a}{2}$, the mean of a single point.",
      "对 $\\max(X, Y)$ 或 $|X - Y|$ 应用二元法则，要沿对角线把正方形分开，在每个三角形上积分。于是 $[0, a]$ 上两个独立的均匀点把区间分成期望长度相等的三段。图中 $a = 3$，所以 $E[\\min(X, Y)] = 1$，$E[\\max(X, Y)] = 2$，$E|X - Y| = 1$。在 $[0, 30]$ 上同样的推理给出 $E[\\min(X, Y)] = 10$，$E[\\max(X, Y)] = 20$，$E|X - Y| = 10$。\n\n> **注意。** 最大值的期望是 $\\frac{2a}{3}$，不是右端点 $a$；距离的期望是 $\\frac{a}{3}$，不是单个点的均值 $\\frac{a}{2}$。",
    ],
    (rng) => {
      const a = rng.int(1, 12);
      const kind = rng.int(0, 2);
      const item = ["\\max(X, Y)", "\\min(X, Y)", "|X - Y|"][kind] as string;
      const third = Q.of(a, 3);
      const answer = kind === 0 ? Q.of(2 * a, 3) : third;
      const twoThirds = Q.of(2 * a, 3);
      const formula = kind === 0 ? "\\frac{2a}{3}" : "\\frac{a}{3}";
      return numberProblem({
        prompt: t(
          `$X$ and $Y$ are independent and uniform on $[0, ${a}]$. Find $E[${item}]$.`,
          `$X$ 与 $Y$ 独立，都在 $[0, ${a}]$ 上服从均匀分布。求 $E[${item}]$。`,
        ),
        answer,
        mistakes: distinctFrom(answer, [
          why(
            Q.of(a, 2),
            `That is the mean of a single uniform point on $[0, ${a}]$, not of $${item}$.`,
            `那是 $[0, ${a}]$ 上单个均匀点的均值，而不是 $${item}$ 的期望。`,
          ),
          why(
            a,
            `That is the right end $${a}$, the largest value possible, not an expected value.`,
            `那是右端点 $${a}$，是可能的最大值，而不是期望。`,
          ),
          kind === 0
            ? why(
                third,
                "That is the expected minimum, the end of the first of the three parts.",
                "那是最小值的期望，即三段中第一段的终点。",
              )
            : why(
                twoThirds,
                "That is the expected maximum, the end of the second of the three parts.",
                "那是最大值的期望，即三段中第二段的终点。",
              ),
        ]),
        solution: walked(
          [
            [
              ["Cut the interval in three", "把区间分成三段"],
              t(
                `The two points cut $[0, ${a}]$ into three parts, each of expected length $\\frac{${a}}{3}${third.toLatex() === `\\frac{${a}}{3}` ? "" : ` = ${third.toLatex()}`}$.`,
                `两点把 $[0, ${a}]$ 分成三段，每段的期望长度都是 $\\frac{${a}}{3}${third.toLatex() === `\\frac{${a}}{3}` ? "" : ` = ${third.toLatex()}`}$。`,
              ),
            ],
            [
              ["Locate the quantity", "定位所求的量"],
              t(
                `${["The maximum lies past two of the parts", "The minimum lies past the first part", "The distance between the points is the middle part"][kind] as string}, so $E[${item}] = ${formula} = ${answer.toLatex()}$.`,
                `${["最大值位于两段之后", "最小值位于第一段之后", "两点之间的距离就是中间一段"][kind] as string}，所以 $E[${item}] = ${formula} = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `$E[\\max(X, Y)] + E[\\min(X, Y)] = E[X] + E[Y] = ${a}$, and indeed $${twoThirds.toLatex()} + ${third.toLatex()} = ${a}$; the distance is their difference, $${twoThirds.toLatex()} - ${third.toLatex()} = ${third.toLatex()}$.`,
            `$E[\\max(X, Y)] + E[\\min(X, Y)] = E[X] + E[Y] = ${a}$，而 $${twoThirds.toLatex()} + ${third.toLatex()} = ${a}$；距离是两者之差 $${twoThirds.toLatex()} - ${third.toLatex()} = ${third.toLatex()}$。`,
          ),
        ),
      });
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
