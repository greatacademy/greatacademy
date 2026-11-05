// A third knowledge point for the Precalculus topics on inequalities, inverse trigonometric functions, identities and trigonometric equations.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { reasoned } from "../wrong-reasons.ts";
import { choose, chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";
import { frac, fraction, skill } from "./third-kit.ts";

/** Rng is the random source a generator receives. */
type Rng = Parameters<KnowledgePointDef["generate"]>[0];

/** factor writes a factor such as x - 3 or x + 3. */
const factor = (a: number) => (a === 0 ? "x" : a < 0 ? `(x + ${-a})` : `(x - ${a})`);

/** triple picks a Pythagorean triple. */
const triple = (rng: Rng) =>
  rng.pick<[number, number, number]>([
    [3, 4, 5],
    [4, 3, 5],
    [5, 12, 13],
    [12, 5, 13],
    [8, 15, 17],
    [15, 8, 17],
    [7, 24, 25],
    [24, 7, 25],
    [20, 21, 29],
    [21, 20, 29],
    [9, 40, 41],
    [40, 9, 41],
    [12, 35, 37],
    [35, 12, 37],
  ]);

/** piOver writes a multiple of pi as a reduced fraction in LaTeX. */
const piOver = (n: number, d: number): string => {
  if (n === 0) return "0";
  const g = ((a: number, b: number): number => {
    let x = a;
    let y = b;
    while (y !== 0) [x, y] = [y, x % y];
    return x;
  })(Math.abs(n), d);
  const top = n / g;
  const bottom = d / g;
  const sign = top < 0 ? "-" : "";
  const size = Math.abs(top);
  const head = size === 1 ? "\\pi" : `${size}\\pi`;
  return bottom === 1 ? `${sign}${head}` : `${sign}${frac(head, bottom)}`;
};

/** Value is a value of sine or cosine with the angles in degrees where it occurs. */
type Value = { readonly latex: string; readonly angles: readonly number[] };

/** sineValues lists exact sine values with their angles in a full turn. */
const sineValues: readonly Value[] = [
  { latex: frac(1, 2), angles: [30, 150] },
  { latex: `-${frac(1, 2)}`, angles: [210, 330] },
  { latex: frac("\\sqrt{2}", 2), angles: [45, 135] },
  { latex: `-${frac("\\sqrt{2}", 2)}`, angles: [225, 315] },
  { latex: frac("\\sqrt{3}", 2), angles: [60, 120] },
  { latex: `-${frac("\\sqrt{3}", 2)}`, angles: [240, 300] },
  { latex: "0", angles: [0, 180] },
  { latex: "1", angles: [90] },
  { latex: "-1", angles: [270] },
];

/** cosineValues lists exact cosine values with their angles in a full turn. */
const cosineValues: readonly Value[] = [
  { latex: frac(1, 2), angles: [60, 300] },
  { latex: `-${frac(1, 2)}`, angles: [120, 240] },
  { latex: frac("\\sqrt{2}", 2), angles: [45, 315] },
  { latex: `-${frac("\\sqrt{2}", 2)}`, angles: [135, 225] },
  { latex: frac("\\sqrt{3}", 2), angles: [30, 330] },
  { latex: `-${frac("\\sqrt{3}", 2)}`, angles: [150, 210] },
  { latex: "0", angles: [90, 270] },
  { latex: "1", angles: [0] },
  { latex: "-1", angles: [180] },
];

/** fullTurnCount builds a problem counting the solutions of a function that repeats each full turn over several turns. */
const fullTurnCount = (rng: Rng, name: string, values: readonly Value[]) => {
  const v = rng.pick(values);
  const k = rng.int(2, 9);
  const one = v.angles.length;
  return whole(
    [
      `How many solutions does $\\${name} \\theta = ${v.latex}$ have on $[0, ${2 * k}\\pi)$?`,
      `$\\${name} \\theta = ${v.latex}$ 在 $[0, ${2 * k}\\pi)$ 上有多少个解？`,
    ],
    one * k,
    [one, one * 2 * k, one === 1 ? 2 * k : k],
    [
      `There ${one === 1 ? "is $1$ solution" : `are $${one}$ solutions`} per full turn, and the interval holds $${k}$ full turns.`,
      `每一整圈有 $${one}$ 个解，这个区间含 $${k}$ 整圈。`,
    ],
  );
};

/** reciprocalOf writes the reciprocal of an exact nonzero value of sine or cosine. */
const reciprocalOf = (latex: string): string => {
  const sign = latex.startsWith("-") ? "-" : "";
  const size = latex.replace("-", "");
  if (size === frac(1, 2)) return `${sign}2`;
  if (size === frac("\\sqrt{2}", 2)) return `${sign}\\sqrt{2}`;
  if (size === frac("\\sqrt{3}", 2)) return `${sign}${frac("2\\sqrt{3}", 3)}`;
  return latex;
};

/** reciprocalCount builds a problem on a reciprocal function, whose values never lie strictly between -1 and 1. */
const reciprocalCount = (rng: Rng, name: string, base: string, values: readonly Value[]) => {
  const inside = rng.bool();
  const k = rng.int(2, 9);
  if (inside) {
    const n = rng.int(2, 9);
    const d = n + rng.int(1, 9);
    const sign = rng.bool() ? "-" : "";
    return whole(
      [
        `How many solutions does $\\${name} \\theta = ${sign}${frac(n, d)}$ have on $[0, ${2 * k}\\pi)$?`,
        `$\\${name} \\theta = ${sign}${frac(n, d)}$ 在 $[0, ${2 * k}\\pi)$ 上有多少个解？`,
      ],
      0,
      [2 * k, k, 1],
      [
        `$\\${name} \\theta$ is the reciprocal of $\\${base} \\theta$, so its size is never below 1, and there are no solutions.`,
        `$\\${name} \\theta$ 是 $\\${base} \\theta$ 的倒数，大小不会小于 1，所以没有解。`,
      ],
    );
  }
  const v = rng.pick(values.filter((value) => value.latex !== "0"));
  const one = v.angles.length;
  const shown = reciprocalOf(v.latex);
  return whole(
    [
      `How many solutions does $\\${name} \\theta = ${shown}$ have on $[0, ${2 * k}\\pi)$?`,
      `$\\${name} \\theta = ${shown}$ 在 $[0, ${2 * k}\\pi)$ 上有多少个解？`,
    ],
    one * k,
    [one, one * 2 * k, one === 1 ? 2 * k : k],
    [
      `It is the same as $\\${base} \\theta = ${v.latex}$, with $${one}$ ${one === 1 ? "solution" : "solutions"} per full turn over $${k}$ full turns.`,
      `它等同于 $\\${base} \\theta = ${v.latex}$，每整圈 $${one}$ 个解，共 $${k}$ 整圈。`,
    ],
  );
};

/** halfTurnCount builds a problem counting the solutions of a function that repeats each half turn. */
const halfTurnCount = (rng: Rng, name: string) => {
  const value = rng.pick(["1", "-1", "\\sqrt{3}", "-\\sqrt{3}", frac("\\sqrt{3}", 3), `-${frac("\\sqrt{3}", 3)}`, "0"]);
  const k = rng.int(2, 9);
  const usable = name === "cot" && value === "0" ? "1" : value;
  return whole(
    [
      `How many solutions does $\\${name} \\theta = ${usable}$ have on $[0, ${k}\\pi)$?`,
      `$\\${name} \\theta = ${usable}$ 在 $[0, ${k}\\pi)$ 上有多少个解？`,
    ],
    k,
    [2 * k, Math.ceil(k / 2), k + 1],
    [
      `$\\${name}$ repeats every $\\pi$ with one solution each time, and the interval holds $${k}$ such stretches.`,
      `$\\${name}$ 的周期是 $\\pi$，每个周期一个解，这个区间含 $${k}$ 个周期。`,
    ],
  );
};

/** scaledCount builds a problem counting the solutions of a sine or cosine of a multiple angle in one full turn. */
const scaledCount = (rng: Rng, name: string, values: readonly Value[]) => {
  const v = rng.pick(values);
  const k = rng.int(2, 9);
  const one = v.angles.length;
  return whole(
    [
      `How many solutions does $\\${name}(${k}\\theta) = ${v.latex}$ have on $[0, 2\\pi)$?`,
      `$\\${name}(${k}\\theta) = ${v.latex}$ 在 $[0, 2\\pi)$ 上有多少个解？`,
    ],
    one * k,
    [one, k, one * k + 1],
    [
      `As $\\theta$ runs over one turn, $${k}\\theta$ runs over ${k} turns, each with ${one} ${one === 1 ? "solution" : "solutions"}.`,
      `$\\theta$ 走一圈时，$${k}\\theta$ 走 ${k} 圈，每圈 ${one} 个解。`,
    ],
  );
};

/** deeperPrecalculusThirdPoints holds these third knowledge points, by topic. */
export const deeperPrecalculusThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "solving-quadratic-inequalities-from-graphs": [
    skill(
      "counting-integers-below-the-axis",
      ["Counting integers below the axis", "数轴下方的整数"],
      [
        "An upward parabola lies below the axis only between its intercepts. The integers strictly between the two intercepts therefore number one fewer than the distance between them.",
        "开口向上的抛物线只在两个截距之间位于轴下方。所以严格位于两个截距之间的整数，比它们的距离少一个。",
      ],
      (rng) => {
        const a = rng.int(-12, 6);
        const w = rng.int(2, 15);
        return whole(
          [
            `A parabola $y = ${factor(a)}${factor(a + w)}$ opens upward. For how many integers $x$ is $y < 0$?`,
            `抛物线 $y = ${factor(a)}${factor(a + w)}$ 开口向上。有多少个整数 $x$ 使 $y < 0$？`,
          ],
          w - 1,
          [w, w + 1, w - 2 < 0 ? 3 : w - 2],
          [
            `The intercepts are $x = ${a}$ and $x = ${a + w}$, so $y < 0$ for $${a} < x < ${a + w}$. These are the integers from $${a + 1}$ to $${a + w - 1}$, which is $${w - 1}$ in all.`,
            `截距是 $x = ${a}$ 和 $x = ${a + w}$，所以 $${a} < x < ${a + w}$ 时 $y < 0$。这些整数从 $${a + 1}$ 到 $${a + w - 1}$，共 $${w - 1}$ 个。`,
          ],
        );
      },
    ),
  ],
  "solving-polynomial-inequalities-using-a-graphical-method": [
    skill(
      "a-repeated-root-does-not-change-the-sign",
      ["A repeated root does not change the sign", "重根不改变符号"],
      [
        "A squared factor is never negative, so the graph touches the axis there and turns back. It adds its root to a solution set that includes equality, without flipping the sign beyond it.",
        "平方因子不会是负数，所以图像在那里碰到轴后折回。它把自己的根加入含等号的解集，但不会改变符号。",
      ],
      (rng) => {
        const b = rng.int(-9, 6);
        const a = b + rng.int(1, 8);
        return reasoned(
          chooseMath(
            rng,
            [`Solve $${factor(a)}^{2}${factor(b)} \\le 0$.`, `解 $${factor(a)}^{2}${factor(b)} \\le 0$。`],
            `(-\\infty, ${b}] \\cup \\{${a}\\}`,
            [`(-\\infty, ${b}]`, `[${b}, ${a}]`, `(-\\infty, ${b}] \\cup [${a}, \\infty)`],
            [
              `The squared factor is positive except at $x = ${a}$, where the product is $0$, so $x \\le ${b}$ or $x = ${a}$.`,
              `平方因子除 $x = ${a}$ 外都为正，那里积为 $0$，所以 $x \\le ${b}$ 或 $x = ${a}$。`,
            ],
          ),
          [
            [
              `$(-\\infty, ${b}]$`,
              `This leaves out $x = ${a}$, where the product is $0$ and the inequality allows equality.`,
              `这里漏掉了 $x = ${a}$，那里积为 $0$，而不等式包含等号。`,
            ],
            [
              `$[${b}, ${a}]$`,
              "Between the two roots the product is positive, so those values do not solve it.",
              "在两根之间积是正的，所以那些值不是解。",
            ],
            [
              `$(-\\infty, ${b}] \\cup [${a}, \\infty)$`,
              `To the right of $x = ${a}$ the product is positive, so those values do not solve it.`,
              `在 $x = ${a}$ 右边，积是正的，所以那些值不是解。`,
            ],
          ],
        );
      },
    ),
  ],
  "solving-inequalities-involving-exponential-functions-and-polynomials": [
    skill(
      "dividing-out-an-exponential",
      ["Dividing out an exponential", "约去指数函数"],
      [
        "An exponential is positive for every input, so dividing both sides by it keeps the direction of the inequality. What remains is an ordinary polynomial inequality.",
        "指数函数对每个输入都是正数，所以两边同除以它不改变不等号方向。剩下的是普通的多项式不等式。",
      ],
      (rng) => {
        const r = rng.int(2, 15);
        const base = rng.pick(["2", "3", "5", "e"]);
        return chooseMath(
          rng,
          [
            `Solve $x^{2} \\cdot ${base}^{x} < ${r * r} \\cdot ${base}^{x}$.`,
            `解 $x^{2} \\cdot ${base}^{x} < ${r * r} \\cdot ${base}^{x}$。`,
          ],
          `(-${r}, ${r})`,
          [`(-\\infty, ${r})`, `(${r}, \\infty)`, `(-\\infty, -${r}) \\cup (${r}, \\infty)`],
          [
            `Dividing by $${base}^{x} > 0$ keeps the direction and leaves $x^{2} < ${r * r}$, that is $|x| < ${r}$.`,
            `除以 $${base}^{x} > 0$，不等号方向不变，得 $x^{2} < ${r * r}$，即 $|x| < ${r}$。`,
          ],
        );
      },
    ),
  ],
  "solving-inequalities-involving-positive-and-negative-factors": [
    skill(
      "an-always-positive-denominator",
      ["An always positive denominator", "恒正的分母"],
      [
        "A denominator that is always positive cannot change the sign of a fraction. So the fraction has the sign of its numerator, and the denominator can be ignored.",
        "恒为正的分母不会改变分数的符号。所以分数的符号与分子相同，可以不管分母。",
      ],
      (rng) => {
        const a = rng.int(-15, 15);
        const k = rng.int(1, 15);
        const up = rng.bool();
        const top = a === 0 ? "x" : `x ${a < 0 ? `+ ${-a}` : `- ${a}`}`;
        return chooseMath(
          rng,
          [`Solve $${frac(top, `x^{2} + ${k}`)} ${up ? ">" : "<"} 0$.`, `解 $${frac(top, `x^{2} + ${k}`)} ${up ? ">" : "<"} 0$。`],
          up ? `(${a}, \\infty)` : `(-\\infty, ${a})`,
          [up ? `(-\\infty, ${a})` : `(${a}, \\infty)`, `(${-a - 1}, ${-a + 1})`, `(-\\infty, \\infty)`],
          [
            `$x^{2} + ${k}$ is always positive, so only the sign of the numerator matters: $${top} ${up ? ">" : "<"} 0$, that is $x ${up ? ">" : "<"} ${a}$.`,
            `$x^{2} + ${k}$ 恒为正，所以只看分子的符号：$${top} ${up ? ">" : "<"} 0$，即 $x ${up ? ">" : "<"} ${a}$。`,
          ],
        );
      },
    ),
  ],
  "solving-two-variable-nonlinear-inequalities": [
    skill(
      "reading-the-symbol-for-the-graph",
      ["Reading the symbol for the graph", "由符号读图像"],
      [
        "A strict symbol leaves the curve out, so it is drawn dashed, while a symbol with equality includes it, so it is drawn solid. A greater-than for $y$ shades above, and a less-than shades below.",
        "严格不等号不含曲线，所以画虚线；含等号时包含曲线，画实线。$y$ 大于时阴影在上方，小于时在下方。",
      ],
      (rng) => {
        const a = rng.int(1, 5);
        const k = rng.int(-12, 12);
        const sym = rng.pick([">", "<", "\\ge", "\\le"]);
        const options: Pair[] = [
          ["Dashed curve, shaded above", "虚线，阴影在上方"],
          ["Dashed curve, shaded below", "虚线，阴影在下方"],
          ["Solid curve, shaded above", "实线，阴影在上方"],
          ["Solid curve, shaded below", "实线，阴影在下方"],
        ];
        const i = { ">": 0, "<": 1, "\\ge": 2, "\\le": 3 }[sym] as number;
        return choose(
          rng,
          [
            `How is the graph of $y ${sym} ${a === 1 ? "" : a}x^{2}${k < 0 ? ` - ${-k}` : ` + ${k}`}$ drawn?`,
            `$y ${sym} ${a === 1 ? "" : a}x^{2}${k < 0 ? ` - ${-k}` : ` + ${k}`}$ 的图像怎样画？`,
          ],
          options[i]!,
          options.filter((_, n) => n !== i),
          [
            `The symbol $${sym}$ ${i < 2 ? "leaves the curve out, so it is dashed" : "includes the curve, so it is solid"}, and points with $y$ ${i % 2 === 0 ? "greater" : "less"} than the curve lie ${i % 2 === 0 ? "above" : "below"} it.`,
            `符号 $${sym}$ ${i < 2 ? "不含曲线本身，所以画虚线" : "包含曲线本身，所以画实线"}；$y$ ${i % 2 === 0 ? "大于" : "小于"}曲线上的值的点在曲线${i % 2 === 0 ? "上方" : "下方"}。`,
          ],
        );
      },
    ),
  ],
  "graphing-the-inverse-sine-function": [
    skill(
      "undoing-sine-outside-the-range",
      ["Undoing sine outside the range", "在值域之外还原正弦"],
      [
        "Arcsine always returns an angle from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$. So for an angle outside this range, the result is the angle in the range with the same sine, not the original.",
        "反正弦总是返回 $-\\frac{\\pi}{2}$ 到 $\\frac{\\pi}{2}$ 之间的角。所以范围外的角，结果是范围内正弦相同的角，而不是原来的角。",
      ],
      (rng) => {
        const d = rng.int(3, 18);
        const inside = rng.int(1, Math.floor((d - 1) / 2));
        return chooseMath(
          rng,
          [
            `Evaluate $\\arcsin\\left(\\sin ${piOver(d - inside, d)}\\right)$.`,
            `计算 $\\arcsin\\left(\\sin ${piOver(d - inside, d)}\\right)$。`,
          ],
          piOver(inside, d),
          [piOver(d - inside, d), piOver(-inside, d), piOver(inside + d, d)],
          [
            `$\\sin(\\pi - x) = \\sin x$, and $${piOver(inside, d)}$ lies in the range of arcsine.`,
            `$\\sin(\\pi - x) = \\sin x$，而 $${piOver(inside, d)}$ 在反正弦的值域内。`,
          ],
        );
      },
    ),
  ],
  "graphing-the-inverse-cosine-function": [
    skill(
      "undoing-cosine-outside-the-range",
      ["Undoing cosine outside the range", "在值域之外还原余弦"],
      [
        "Arccosine always returns an angle from $0$ to $\\pi$. Cosine has the same value at $x$ and at $2\\pi - x$, so an angle past $\\pi$ comes back reflected, not unchanged.",
        "反余弦总是返回 0 到 $\\pi$ 之间的角。余弦在 $x$ 和 $2\\pi - x$ 处相等，所以超过 $\\pi$ 的角会反射回来，而不是不变。",
      ],
      (rng) => {
        const d = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const n = rng.int(1, d - 1);
        return chooseMath(
          rng,
          [
            `Evaluate $\\arccos\\left(\\cos ${piOver(2 * d - n, d)}\\right)$.`,
            `计算 $\\arccos\\left(\\cos ${piOver(2 * d - n, d)}\\right)$。`,
          ],
          piOver(n, d),
          [piOver(2 * d - n, d), piOver(-n, d), piOver(d - n, d) === piOver(n, d) ? piOver(n + 2 * d, d) : piOver(d - n, d)],
          [
            `$\\cos(2\\pi - x) = \\cos x$, and $${piOver(n, d)}$ lies in the range of arccosine.`,
            `$\\cos(2\\pi - x) = \\cos x$，而 $${piOver(n, d)}$ 在反余弦的值域内。`,
          ],
        );
      },
    ),
  ],
  "graphing-the-inverse-tangent-function": [
    skill(
      "undoing-tangent-outside-the-range",
      ["Undoing tangent outside the range", "在值域之外还原正切"],
      [
        "Arctangent returns an angle strictly between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$. Tangent repeats every $\\pi$, so subtract $\\pi$ as many times as it takes to land in that range.",
        "反正切返回严格在 $-\\frac{\\pi}{2}$ 和 $\\frac{\\pi}{2}$ 之间的角。正切的周期是 $\\pi$，所以减去若干个 $\\pi$，直到落在这个范围内。",
      ],
      (rng) => {
        const d = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const n = rng.int(1, Math.max(1, Math.ceil(d / 2) - 1));
        const turns = rng.int(1, 3);
        const small = n * 2 < d ? n : 1;
        return reasoned(
          chooseMath(
            rng,
            [
              `Evaluate $\\arctan\\left(\\tan ${piOver(small + turns * d, d)}\\right)$.`,
              `计算 $\\arctan\\left(\\tan ${piOver(small + turns * d, d)}\\right)$。`,
            ],
            piOver(small, d),
            [piOver(small + turns * d, d), piOver(-small, d), piOver(small + d + turns * d, d)],
            [
              `Subtracting ${turns === 1 ? "$\\pi$" : `$${turns}\\pi$`} keeps the tangent and lands in the range.`,
              `减去 ${turns === 1 ? "$\\pi$" : `$${turns}\\pi$`} 不改变正切，并落在值域内。`,
            ],
          ),
          [
            [
              `$${piOver(small + turns * d, d)}$`,
              "Arctangent does not simply undo tangent here: this angle is outside its range, between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$.",
              "这里反正切不能直接抵消正切：这个角不在它的值域内，值域在 $-\\frac{\\pi}{2}$ 和 $\\frac{\\pi}{2}$ 之间。",
            ],
            [
              `$${piOver(-small, d)}$`,
              "The sign is wrong: subtracting multiples of $\\pi$ keeps the tangent, and the tangent here is positive.",
              "符号错了：减去 $\\pi$ 的整数倍不改变正切，而这里的正切是正的。",
            ],
            [
              `$${piOver(small + d + turns * d, d)}$`,
              "This adds $\\pi$, going further from the range: subtract instead.",
              "这里加上了 $\\pi$，离值域更远了：应该减去。",
            ],
          ],
        );
      },
    ),
  ],
  "evaluating-expressions-containing-inverse-trigonometric-functions": [
    skill(
      "a-ratio-of-an-inverse-ratio",
      ["A ratio of an inverse ratio", "反三角函数的三角比"],
      [
        "An inverse function names an angle, and a right triangle holds its ratio. So draw the triangle, use the Pythagorean theorem for the missing side, and read off the other ratio.",
        "反函数表示一个角，它的比可以放在直角三角形中。所以画三角形，用勾股定理求缺失的边，再读出另一个比。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const form = rng.int(0, 2);
        const prompt =
          form === 0
            ? `\\sin\\left(\\arccos ${frac(a, c)}\\right)`
            : form === 1
              ? `\\cos\\left(\\arcsin ${frac(a, c)}\\right)`
              : `\\tan\\left(\\arccos ${frac(a, c)}\\right)`;
        const answer = form === 2 ? Q.of(b, a) : Q.of(b, c);
        return fraction(
          [`Evaluate $${prompt}$.`, `计算 $${prompt}$。`],
          answer,
          [Q.of(a, c), Q.of(c, b), Q.of(a, b)],
          [
            `The inner angle lies in a right triangle with hypotenuse $${c}$ and one leg $${a}$, so the other leg is $\\sqrt{${c}^{2} - ${a}^{2}} = ${b}$. ${form === 2 ? `Its tangent is $\\frac{${b}}{${a}}$, opposite over adjacent.` : `The ratio asked for is the other leg over the hypotenuse, $\\frac{${b}}{${c}}$.`}`,
            `里面的角在斜边为 $${c}$、一条直角边为 $${a}$ 的直角三角形中，所以另一条直角边是 $\\sqrt{${c}^{2} - ${a}^{2}} = ${b}$。${form === 2 ? `它的正切是对边比邻边，即 $\\frac{${b}}{${a}}$。` : `所求的比是另一条直角边比斜边，即 $\\frac{${b}}{${c}}$。`}`,
          ],
        );
      },
    ),
  ],
  "simplifying-expressions-using-basic-trigonometric-identities": [
    skill(
      "writing-everything-in-sine-and-cosine",
      ["Writing everything in sine and cosine", "全部写成正弦和余弦"],
      [
        "When an expression mixes several functions, writing each in terms of sine and cosine shows what cancels. A common denominator then finishes the job.",
        "式子中有几种函数时，把它们都写成正弦和余弦，就能看出什么可以约去。再通分就完成了。",
      ],
      (rng) => {
        const k = rng.int(2, 15);
        const v = rng.pick(["\\theta", "x", "t", "u"]);
        const form = rng.int(0, 2);
        const expr = [`\\sec ${v} - \\sin ${v} \\tan ${v}`, `\\csc ${v} - \\cos ${v} \\cot ${v}`, `\\tan ${v} + \\cot ${v}`][form]!;
        const correct = [`${k}\\cos ${v}`, `${k}\\sin ${v}`, `${k}\\sec ${v} \\csc ${v}`][form]!;
        return chooseMath(
          rng,
          [`Simplify $${k}(${expr})$.`, `化简 $${k}(${expr})$。`],
          correct,
          [`${k}\\tan ${v}`, `${k}`, `${k}\\cot ${v}`, `${k}\\sin ${v} \\cos ${v}`],
          [
            `Write it over $\\sin ${v} \\cos ${v}$ or one of its factors, and $\\sin^{2} + \\cos^{2} = 1$ gives $${correct}$.`,
            `写成以 $\\sin ${v} \\cos ${v}$ 或它的因式为分母的式子，由 $\\sin^{2} + \\cos^{2} = 1$ 得 $${correct}$。`,
          ],
        );
      },
    ),
  ],
  "simplifying-expressions-using-the-pythagorean-identity": [
    skill(
      "the-sign-from-the-quadrant",
      ["The sign from the quadrant", "由象限定符号"],
      [
        "The identity gives $\\cos^{2}\\theta$, which has two square roots. The quadrant decides between them, as cosine is positive on the right of the circle and negative on the left.",
        "恒等式给出 $\\cos^{2}\\theta$，它有两个平方根。象限决定取哪一个：余弦在圆的右侧为正，左侧为负。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const q2 = rng.bool();
        return fraction(
          [
            `If $\\sin\\theta = ${frac(a, c)}$ and $\\theta$ is in quadrant ${q2 ? "II" : "I"}, find $\\cos\\theta$.`,
            `若 $\\sin\\theta = ${frac(a, c)}$，且 $\\theta$ 在第${q2 ? "二" : "一"}象限，求 $\\cos\\theta$。`,
          ],
          Q.of(q2 ? -b : b, c),
          [Q.of(q2 ? b : -b, c), Q.of(a, c), Q.of(b, a)],
          [
            `$\\cos^{2}\\theta = 1 - ${frac(a * a, c * c)} = ${frac(b * b, c * c)}$, and cosine is ${q2 ? "negative" : "positive"} in that quadrant.`,
            `$\\cos^{2}\\theta = 1 - ${frac(a * a, c * c)} = ${frac(b * b, c * c)}$，余弦在该象限为${q2 ? "负" : "正"}。`,
          ],
        );
      },
    ),
  ],
  "simplifying-expressions-using-the-secant-tangent-identity": [
    skill(
      "secant-from-tangent",
      ["Secant from tangent", "由正切求正割"],
      [
        "The identity $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$ turns a known tangent into a secant. Then the sign of the square root comes from the quadrant, as with any other square root.",
        "恒等式 $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$ 把已知的正切化成正割。平方根的符号由象限决定，和其他平方根一样。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const q3 = rng.bool();
        return fraction(
          [
            `If $\\tan\\theta = ${frac(a, b)}$ and $\\theta$ is in quadrant ${q3 ? "III" : "I"}, find $\\sec\\theta$.`,
            `若 $\\tan\\theta = ${frac(a, b)}$，且 $\\theta$ 在第${q3 ? "三" : "一"}象限，求 $\\sec\\theta$。`,
          ],
          Q.of(q3 ? -c : c, b),
          [Q.of(q3 ? c : -c, b), Q.of(c, a), Q.of(b, c)],
          [
            `$\\sec^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$, and secant has the sign of cosine.`,
            `$\\sec^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$，正割与余弦同号。`,
          ],
        );
      },
    ),
  ],
  "alternate-forms-of-the-secant-tangent-identity": [
    skill(
      "the-other-factor-from-one",
      ["The other factor from one", "由一个因式求另一个"],
      [
        "Since $(\\sec x + \\tan x)(\\sec x - \\tan x) = 1$, the two factors are reciprocals. So knowing one gives the other at once, with no need to find $x$.",
        "由 $(\\sec x + \\tan x)(\\sec x - \\tan x) = 1$，两个因式互为倒数。所以知道一个就立刻得到另一个，不必求 $x$。",
      ],
      (rng) => {
        const n = rng.int(3, 17);
        const d = rng.int(2, n - 1);
        const shown = Q.of(n, d).toLatex();
        const plusFirst = rng.bool();
        return fraction(
          [
            `If $\\sec x ${plusFirst ? "+" : "-"} \\tan x = ${shown}$, find $\\sec x ${plusFirst ? "-" : "+"} \\tan x$.`,
            `若 $\\sec x ${plusFirst ? "+" : "-"} \\tan x = ${shown}$，求 $\\sec x ${plusFirst ? "-" : "+"} \\tan x$。`,
          ],
          Q.of(d, n),
          [Q.of(n, d), Q.of(-n, d), Q.of(-d, n)],
          [
            `The product of the two factors is 1, so the answer is the reciprocal of $${shown}$.`,
            `两个因式的积是 1，所以答案是 $${shown}$ 的倒数。`,
          ],
        );
      },
    ),
  ],
  "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity": [
    skill(
      "cosecant-from-cotangent",
      ["Cosecant from cotangent", "由余切求余割"],
      [
        "The identity $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$ turns a known cotangent into a cosecant. Cosecant has the sign of sine, so it is positive above the axis and negative below.",
        "恒等式 $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$ 把已知的余切化成余割。余割与正弦同号，在轴上方为正，在轴下方为负。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const q3 = rng.bool();
        return fraction(
          [
            `If $\\cot\\theta = ${frac(a, b)}$ and $\\theta$ is in quadrant ${q3 ? "III" : "I"}, find $\\csc\\theta$.`,
            `若 $\\cot\\theta = ${frac(a, b)}$，且 $\\theta$ 在第${q3 ? "三" : "一"}象限，求 $\\csc\\theta$。`,
          ],
          Q.of(q3 ? -c : c, b),
          [Q.of(q3 ? c : -c, b), Q.of(c, a), Q.of(b, c)],
          [
            `$\\csc^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$, and sine is ${q3 ? "negative" : "positive"} there.`,
            `$\\csc^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$，那里正弦为${q3 ? "负" : "正"}。`,
          ],
        );
      },
    ),
  ],
  "simplifying-trigonometric-expressions-using-cofunction-identities": [
    skill(
      "an-equation-from-cofunctions",
      ["An equation from cofunctions", "由余函数得到方程"],
      [
        "Sine of one acute angle equals cosine of the other exactly when the angles add up to $90^{\\circ}$. This turns an equation between the functions into a linear equation in $x$.",
        "一个锐角的正弦等于另一个锐角的余弦，当且仅当两角之和是 $90^{\\circ}$。这把函数之间的等式变成 $x$ 的一次方程。",
      ],
      (rng) => {
        const x = rng.int(3, 12);
        const a = rng.int(1, 3);
        const c = rng.int(1, 3);
        const sum = (a + c) * x;
        const b = rng.int(1, Math.max(1, 89 - sum - 1));
        const d = 90 - sum - b;
        const first = a === 1 ? "x" : `${a}x`;
        const second = c === 1 ? "x" : `${c}x`;
        return whole(
          [
            `The angles are acute and $\\sin((${first} + ${b})^{\\circ}) = \\cos((${second} + ${d})^{\\circ})$. What is $x$?`,
            `两个角都是锐角，且 $\\sin((${first} + ${b})^{\\circ}) = \\cos((${second} + ${d})^{\\circ})$。$x$ 是多少？`,
          ],
          x,
          [sum, x + 1, a + c],
          [
            `The angles add up to $90^{\\circ}$: $${a + c}x + ${b + d} = 90$, so $x = ${x}$.`,
            `两角之和是 90：$${a + c}x + ${b + d} = 90$，所以 $x = ${x}$。`,
          ],
        );
      },
    ),
  ],
  "the-sum-and-difference-formulas-for-sine": [
    skill(
      "sine-of-a-sum-from-two-triangles",
      ["Sine of a sum from two triangles", "由两个三角形求和角正弦"],
      [
        "Knowing the sine of two acute angles gives their cosines through the Pythagorean identity. The sum formula then combines all four numbers, whatever the angles themselves are.",
        "知道两个锐角的正弦，由勾股恒等式得到余弦。和角公式再把这四个数合起来，不管这两个角本身是多少。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const [p, q, r] = triple(rng);
        const minus = rng.bool();
        const top = minus ? a * q - b * p : a * q + b * p;
        return fraction(
          [
            `$\\alpha$ and $\\beta$ are acute, with $\\sin\\alpha = ${frac(a, c)}$ and $\\sin\\beta = ${frac(p, r)}$. Find $\\sin(\\alpha ${minus ? "-" : "+"} \\beta)$.`,
            `$\\alpha$ 和 $\\beta$ 是锐角，$\\sin\\alpha = ${frac(a, c)}$，$\\sin\\beta = ${frac(p, r)}$。求 $\\sin(\\alpha ${minus ? "-" : "+"} \\beta)$。`,
          ],
          Q.of(top, c * r),
          [Q.of(minus ? a * q + b * p : a * q - b * p, c * r), Q.of(a * p + b * q + 1, c * r), Q.of(a * q, c * r)],
          [
            `$\\cos\\alpha = ${frac(b, c)}$ and $\\cos\\beta = ${frac(q, r)}$, so it is $${frac(a, c)} \\cdot ${frac(q, r)} ${minus ? "-" : "+"} ${frac(b, c)} \\cdot ${frac(p, r)}$.`,
            `$\\cos\\alpha = ${frac(b, c)}$，$\\cos\\beta = ${frac(q, r)}$，所以是 $${frac(a, c)} \\cdot ${frac(q, r)} ${minus ? "-" : "+"} ${frac(b, c)} \\cdot ${frac(p, r)}$。`,
          ],
        );
      },
    ),
  ],
  "the-sum-and-difference-formulas-for-cosine": [
    skill(
      "cosine-of-a-sum-from-two-triangles",
      ["Cosine of a sum from two triangles", "由两个三角形求和角余弦"],
      [
        "The cosine formula has the opposite sign to the angle sign: a sum subtracts the product of the sines. Finding the missing cosines or sines from the triangles gives all four numbers.",
        "余弦公式的符号与角的符号相反：和角要减去两个正弦的积。由三角形求出缺失的正弦或余弦，就有了全部四个数。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const [p, q, r] = triple(rng);
        const minus = rng.bool();
        const top = minus ? b * q + a * p : b * q - a * p;
        return fraction(
          [
            `$\\alpha$ and $\\beta$ are acute, with $\\sin\\alpha = ${frac(a, c)}$ and $\\sin\\beta = ${frac(p, r)}$. Find $\\cos(\\alpha ${minus ? "-" : "+"} \\beta)$.`,
            `$\\alpha$ 和 $\\beta$ 是锐角，$\\sin\\alpha = ${frac(a, c)}$，$\\sin\\beta = ${frac(p, r)}$。求 $\\cos(\\alpha ${minus ? "-" : "+"} \\beta)$。`,
          ],
          Q.of(top, c * r),
          [Q.of(minus ? b * q - a * p : b * q + a * p, c * r), Q.of(a * q + b * p + 1, c * r), Q.of(b * q, c * r)],
          [
            `The cosines are $${frac(b, c)}$ and $${frac(q, r)}$, and the formula ${minus ? "adds" : "subtracts"} the product of the sines.`,
            `余弦是 $${frac(b, c)}$ 和 $${frac(q, r)}$，公式要${minus ? "加上" : "减去"}两个正弦的积。`,
          ],
        );
      },
    ),
  ],
  "calculating-trigonometric-ratios-using-the-sum-formula-for-sine": [
    skill(
      "sine-after-a-quarter-or-half-turn",
      ["Sine after a quarter or half turn", "转过四分之一或半圈后的正弦"],
      [
        "Adding $90^{\\circ}$ or $180^{\\circ}$ makes the sum formula very short, because one of its two terms vanishes and the other keeps a simple factor. So $\\sin(\\theta + 90^{\\circ}) = \\cos\\theta$ and $\\sin(\\theta + 180^{\\circ}) = -\\sin\\theta$.",
        "加 $90^{\\circ}$ 或 $180^{\\circ}$ 时和角公式很短，因为 $\\sin 90^{\\circ} = 1$，$\\cos 90^{\\circ} = 0$。所以 $\\sin(\\theta + 90^{\\circ}) = \\cos\\theta$，$\\sin(\\theta + 180^{\\circ}) = -\\sin\\theta$。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const half = rng.bool();
        return fraction(
          [
            `$\\theta$ is acute with $\\sin\\theta = ${frac(a, c)}$. Find $\\sin(\\theta + ${half ? 180 : 90}^{\\circ})$.`,
            `$\\theta$ 是锐角，$\\sin\\theta = ${frac(a, c)}$。求 $\\sin(\\theta + ${half ? 180 : 90}^{\\circ})$。`,
          ],
          half ? Q.of(-a, c) : Q.of(b, c),
          [half ? Q.of(a, c) : Q.of(a, c), half ? Q.of(-b, c) : Q.of(-b, c), Q.of(c, a)],
          [
            half ? `$\\sin(\\theta + 180^{\\circ}) = -\\sin\\theta$.` : `$\\sin(\\theta + 90^{\\circ}) = \\cos\\theta = ${frac(b, c)}$.`,
            half ? `$\\sin(\\theta + 180^{\\circ}) = -\\sin\\theta$。` : `$\\sin(\\theta + 90^{\\circ}) = \\cos\\theta = ${frac(b, c)}$。`,
          ],
        );
      },
    ),
  ],
  "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine": [
    skill(
      "cosine-after-a-quarter-or-half-turn",
      ["Cosine after a quarter or half turn", "转过四分之一或半圈后的余弦"],
      [
        "Adding $90^{\\circ}$ or $180^{\\circ}$ also shortens the cosine formula, because the sine and cosine of these angles are only $0$, $1$ or $-1$, so one of the two products drops out. A quarter turn gives $\\cos(\\theta + 90^{\\circ}) = -\\sin\\theta$, and a half turn gives $\\cos(\\theta + 180^{\\circ}) = -\\cos\\theta$.",
        "加 $90^{\\circ}$ 或 $180^{\\circ}$ 也使余弦公式变短，因为这些角的正弦和余弦只是 $0$、$1$ 或 $-1$，两个乘积中有一个消失。转四分之一圈得 $\\cos(\\theta + 90^{\\circ}) = -\\sin\\theta$，转半圈得 $\\cos(\\theta + 180^{\\circ}) = -\\cos\\theta$。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const half = rng.bool();
        return fraction(
          [
            `$\\theta$ is acute with $\\sin\\theta = ${frac(a, c)}$. Find $\\cos(\\theta + ${half ? 180 : 90}^{\\circ})$.`,
            `$\\theta$ 是锐角，$\\sin\\theta = ${frac(a, c)}$。求 $\\cos(\\theta + ${half ? 180 : 90}^{\\circ})$。`,
          ],
          half ? Q.of(-b, c) : Q.of(-a, c),
          [half ? Q.of(b, c) : Q.of(a, c), half ? Q.of(-a, c) : Q.of(b, c), Q.of(c, b)],
          [
            half ? `$\\cos\\theta = ${frac(b, c)}$, and a half turn changes the sign.` : `$\\cos(\\theta + 90^{\\circ}) = -\\sin\\theta$.`,
            half ? `$\\cos\\theta = ${frac(b, c)}$，转半圈改变符号。` : `$\\cos(\\theta + 90^{\\circ}) = -\\sin\\theta$。`,
          ],
        );
      },
    ),
  ],
  "calculating-trigonometric-ratios-using-the-sum-formula-for-tangent": [
    skill(
      "tangent-of-a-sum-from-two-tangents",
      ["Tangent of a sum from two tangents", "由两个正切求和角正切"],
      [
        "The tangent sum formula needs only the two tangents: their sum over one minus their product. A product close to $1$ makes the result large, and a product of exactly $1$ means no tangent exists.",
        "正切和角公式只需要两个正切：它们的和除以 $1$ 减它们的积。积接近 $1$ 时结果很大，积恰好是 $1$ 时正切不存在。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        return fraction(
          [
            `If $\\tan\\alpha = ${frac(1, a)}$ and $\\tan\\beta = ${frac(1, b)}$, find $\\tan(\\alpha + \\beta)$.`,
            `若 $\\tan\\alpha = ${frac(1, a)}$，$\\tan\\beta = ${frac(1, b)}$，求 $\\tan(\\alpha + \\beta)$。`,
          ],
          Q.of(a + b, a * b - 1),
          [Q.of(a + b, a * b), Q.of(a + b, a * b + 1), Q.of(1, a + b)],
          [
            `$${frac(`${frac(1, a)} + ${frac(1, b)}`, `1 - ${frac(1, a * b)}`)} = ${frac(a + b, a * b - 1)}$.`,
            `$${frac(`${frac(1, a)} + ${frac(1, b)}`, `1 - ${frac(1, a * b)}`)} = ${frac(a + b, a * b - 1)}$。`,
          ],
        );
      },
    ),
  ],
  "verifying-trigonometric-identities-using-the-double-angle-formula-for-sine": [
    skill(
      "a-product-from-the-double-angle",
      ["A product from the double angle", "由二倍角求积"],
      [
        "Reading the formula backward, $\\sin\\theta\\cos\\theta$ is half of $\\sin 2\\theta$. So a value for the double angle gives the product, even though neither factor is known.",
        "反过来读公式，$\\sin\\theta\\cos\\theta$ 是 $\\sin 2\\theta$ 的一半。所以知道二倍角的值就得到积，尽管两个因数都不知道。",
      ],
      (rng) => {
        const n = rng.int(1, 12);
        const d = n + rng.int(1, 9);
        const k = rng.int(1, 6);
        return fraction(
          [
            `If $\\sin 2\\theta = ${frac(n, d)}$, find $${k === 1 ? "" : k}\\sin\\theta\\cos\\theta$.`,
            `若 $\\sin 2\\theta = ${frac(n, d)}$，求 $${k === 1 ? "" : k}\\sin\\theta\\cos\\theta$。`,
          ],
          Q.of(n * k, 2 * d),
          [Q.of(2 * n * k, d), Q.of(n * k, d), Q.of(n, 2 * d * k)],
          [
            `$\\sin\\theta\\cos\\theta = ${frac(1, 2)}\\sin 2\\theta$, so multiply $${frac(n, d)}$ by $${frac(k, 2)}$.`,
            `$\\sin\\theta\\cos\\theta = ${frac(1, 2)}\\sin 2\\theta$，所以 $${frac(n, d)}$ 乘 $${frac(k, 2)}$。`,
          ],
        );
      },
    ),
  ],
  "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem": [
    skill(
      "double-angle-sine-from-tangent",
      ["Double angle sine from tangent", "由正切求二倍角正弦"],
      [
        "A tangent gives two sides of a right triangle, and the Pythagorean theorem gives the third. Then $\\sin 2x = 2\\sin x\\cos x$ uses both ratios from that triangle.",
        "正切给出直角三角形的两条边，勾股定理给出第三条。然后 $\\sin 2x = 2\\sin x\\cos x$ 用到这个三角形的两个比。",
      ],
      (rng) => {
        const [a, b, c] = triple(rng);
        const k = rng.int(1, 4);
        const scale = k === 1 ? "" : `${k}`;
        return fraction(
          [
            `$x$ is acute with $\\tan x = ${frac(a, b)}$. Find $${scale}\\sin 2x$.`,
            `$x$ 是锐角，$\\tan x = ${frac(a, b)}$。求 $${scale}\\sin 2x$。`,
          ],
          Q.of(2 * k * a * b, c * c),
          [Q.of(k * a * b, c * c), Q.of(2 * a, b), Q.of(2 * a, c)],
          [
            `Take legs $${a}$ and $${b}$, so the hypotenuse is $${c}$. Then $\\sin 2x = 2 \\cdot ${frac(a, c)} \\cdot ${frac(b, c)} = ${Q.of(2 * a * b, c * c).toLatex()}$${k === 1 ? "" : `, and multiplying by $${k}$ gives $${Q.of(2 * k * a * b, c * c).toLatex()}$`}.`,
            `取两条直角边为 $${a}$ 和 $${b}$，斜边就是 $${c}$。于是 $\\sin 2x = 2 \\cdot ${frac(a, c)} \\cdot ${frac(b, c)} = ${Q.of(2 * a * b, c * c).toLatex()}$${k === 1 ? "" : `，乘以 $${k}$ 得 $${Q.of(2 * k * a * b, c * c).toLatex()}$`}。`,
          ],
        );
      },
    ),
  ],
  "verifying-trigonometric-identities-using-the-double-angle-formulas-for-cosine": [
    skill(
      "power-reduction",
      ["Power reduction", "降幂"],
      [
        "Solving the cosine double angle formulas for the squares gives $\\cos^{2}x = \\frac{1 + \\cos 2x}{2}$ and $\\sin^{2}x = \\frac{1 - \\cos 2x}{2}$. These trade a square for a double angle.",
        "由余弦二倍角公式解出平方，得 $\\cos^{2}x = \\frac{1 + \\cos 2x}{2}$，$\\sin^{2}x = \\frac{1 - \\cos 2x}{2}$。它们把平方换成二倍角。",
      ],
      (rng) => {
        const m = rng.int(1, 15);
        const sine = rng.bool();
        const inside = m === 1 ? "\\theta" : `${m}\\theta`;
        const fn = sine ? "\\sin" : "\\cos";
        const dbl = `\\cos ${2 * m}\\theta`;
        return chooseMath(
          rng,
          [`Which expression equals $${fn}^{2}(${inside})$?`, `哪个式子等于 $${fn}^{2}(${inside})$？`],
          frac(`1 ${sine ? "-" : "+"} ${dbl}`, 2),
          [frac(`1 ${sine ? "+" : "-"} ${dbl}`, 2), `1 ${sine ? "-" : "+"} ${dbl}`, frac(`1 ${sine ? "-" : "+"} \\cos ${3 * m}\\theta`, 2)],
          [
            `The angle doubles to $${2 * m}\\theta$, and sine takes the minus sign while cosine takes the plus.`,
            `角翻倍成 $${2 * m}\\theta$，正弦取减号，余弦取加号。`,
          ],
        );
      },
    ),
  ],
  "finding-exact-values-of-trigonometric-expressions-using-the-double-angle-formulas-for-cosine": [
    skill(
      "cos-double-angle-from-sine",
      ["The double angle from a sine", "由正弦求二倍角余弦"],
      [
        "Choosing the form with sine alone means no cosine is needed: $\\cos 2\\theta = 1 - 2\\sin^{2}\\theta$. The quadrant does not matter either, as the square removes the sign.",
        "选只含正弦的形式，就不需要余弦：$\\cos 2\\theta = 1 - 2\\sin^{2}\\theta$。象限也不重要，因为平方去掉了符号。",
      ],
      (rng) => {
        const [a, , c] = triple(rng);
        const neg = rng.bool();
        return fraction(
          [
            `If $\\sin\\theta = ${neg ? "-" : ""}${frac(a, c)}$, find $\\cos 2\\theta$.`,
            `若 $\\sin\\theta = ${neg ? "-" : ""}${frac(a, c)}$，求 $\\cos 2\\theta$。`,
          ],
          Q.of(c * c - 2 * a * a, c * c),
          [Q.of(2 * a * a - c * c, c * c), Q.of(c * c - a * a, c * c), Q.of(2 * a, c)],
          [
            `$1 - 2 \\cdot ${frac(a * a, c * c)} = ${Q.of(c * c - 2 * a * a, c * c).toLatex()}$.`,
            `$1 - 2 \\cdot ${frac(a * a, c * c)} = ${Q.of(c * c - 2 * a * a, c * c).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "verifying-trigonometric-identities-using-the-double-angle-formula-for-tangent": [
    skill(
      "double-angle-tangent-from-a-value",
      ["The double angle tangent from a value", "由值求二倍角正切"],
      [
        "With a known tangent, the formula gives the tangent of twice the angle without finding the angle. Work out the denominator first, as subtracting the square is where errors usually occur.",
        "已知正切时，公式不用求角就能得到二倍角的正切。先算分母，因为错误通常出在减去平方这一步。",
      ],
      (rng) => {
        const n = rng.int(1, 9);
        const d = n + rng.int(1, 9);
        return fraction(
          [`If $\\tan\\theta = ${frac(n, d)}$, find $\\tan 2\\theta$.`, `若 $\\tan\\theta = ${frac(n, d)}$，求 $\\tan 2\\theta$。`],
          Q.of(2 * n * d, d * d - n * n),
          [Q.of(2 * n, d), Q.of(2 * n * d, d * d + n * n), Q.of(n * d, d * d - n * n)],
          [
            `$${frac(`2 \\cdot ${frac(n, d)}`, `1 - ${frac(n * n, d * d)}`)} = ${Q.of(2 * n * d, d * d - n * n).toLatex()}$.`,
            `$${frac(`2 \\cdot ${frac(n, d)}`, `1 - ${frac(n * n, d * d)}`)} = ${Q.of(2 * n * d, d * d - n * n).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "elementary-trigonometric-equations-containing-cosine": [
    skill(
      "counting-cosine-solutions",
      ["Counting cosine solutions", "数余弦方程的解"],
      [
        "Cosine repeats every full turn, so each turn holds the same solutions. Most values occur twice per turn, while 1 and $-1$ occur only once, at the top and the bottom.",
        "余弦每一整圈重复，所以每圈的解相同。多数值每圈出现两次，而 1 和 $-1$ 只出现一次，在最高点和最低点。",
      ],
      (rng) => fullTurnCount(rng, "cos", cosineValues),
    ),
  ],
  "elementary-trigonometric-equations-containing-tangent": [
    skill(
      "counting-tangent-solutions",
      ["Counting tangent solutions", "数正切方程的解"],
      [
        "Tangent takes each real value exactly once in every half turn. So the number of solutions is the number of half turns the interval holds, for any value at all.",
        "正切在每半圈恰好取每个实数值一次。所以解的个数就是区间内半圈的个数，不管这个值是多少。",
      ],
      (rng) => halfTurnCount(rng, "tan"),
    ),
  ],
  "elementary-trigonometric-equations-containing-secant": [
    skill(
      "counting-secant-solutions",
      ["Counting secant solutions", "数正割方程的解"],
      [
        "Secant is the reciprocal of cosine, so its values never lie strictly between $-1$ and $1$. Such an equation has no solutions, and any other one matches an equation in cosine.",
        "正割是余弦的倒数，所以它的值不会严格落在 $-1$ 和 $1$ 之间。这样的方程无解，其他方程都对应一个余弦方程。",
      ],
      (rng) =>
        reciprocalCount(
          rng,
          "sec",
          "cos",
          cosineValues.filter((v) => v.latex !== "0"),
        ),
    ),
  ],
  "elementary-trigonometric-equations-containing-cosecant": [
    skill(
      "counting-cosecant-solutions",
      ["Counting cosecant solutions", "数余割方程的解"],
      [
        "Cosecant is the reciprocal of sine, so its values never lie strictly between $-1$ and $1$. Such an equation has no solutions, and any other one matches an equation in sine.",
        "余割是正弦的倒数，所以它的值不会严格落在 $-1$ 和 $1$ 之间。这样的方程无解，其他方程都对应一个正弦方程。",
      ],
      (rng) =>
        reciprocalCount(
          rng,
          "csc",
          "sin",
          sineValues.filter((v) => v.latex !== "0"),
        ),
    ),
  ],
  "elementary-trigonometric-equations-containing-cotangent": [
    skill(
      "counting-cotangent-solutions",
      ["Counting cotangent solutions", "数余切方程的解"],
      [
        "Like tangent, cotangent takes each real value exactly once in every half turn. So the number of solutions matches the number of half turns in the interval.",
        "和正切一样，余切在每半圈恰好取每个实数值一次。所以解的个数等于区间内半圈的个数。",
      ],
      (rng) => halfTurnCount(rng, "cot"),
    ),
  ],
  "general-solutions-of-elementary-trigonometric-equations": [
    skill(
      "the-first-solution-past-a-bound",
      ["The first solution past a bound", "超过某界的第一个解"],
      [
        "The general solution lists every angle, one family for each base angle. To find the first past a bound, take the smallest member over it in each family and compare the two.",
        "通解列出所有的角，每个基本角一族。要求超过某界的第一个解，就取每族中超过它的最小值，再比较这两个。",
      ],
      (rng) => {
        const v = rng.pick(cosineValues.slice(0, 6));
        const bound = rng.int(10, 100) * 10 + rng.int(1, 9);
        const next = (a: number) => a + 360 * Math.ceil((bound - a + 1) / 360);
        const [p, q] = v.angles as [number, number];
        const answer = Math.min(next(p), next(q));
        return whole(
          [
            `What is the smallest solution of $\\cos(x^{\\circ}) = ${v.latex}$ with $x > ${bound}$?`,
            `$\\cos(x^{\\circ}) = ${v.latex}$ 满足 $x > ${bound}$ 的最小解是多少？`,
          ],
          answer,
          [Math.max(next(p), next(q)), answer + 360, answer - 360 > 0 ? answer - 360 : answer + 720],
          [
            `The families are $${p} + 360k$ and $${q} + 360k$, whose first values past $${bound}$ are $${next(p)}$ and $${next(q)}$.`,
            `两族是 $${p} + 360k$ 和 $${q} + 360k$，超过 $${bound}$ 的第一个值是 $${next(p)}$ 和 $${next(q)}$。`,
          ],
        );
      },
    ),
  ],
  "trigonometric-equations-containing-transformed-sine-functions": [
    skill(
      "counting-solutions-of-a-multiple-angle-sine",
      ["Counting solutions of a multiple angle sine", "数多倍角正弦方程的解"],
      [
        "Multiplying the angle by $k$ fits $k$ full cycles of sine into one turn. Each cycle repeats the solutions, so the count for one cycle is multiplied by $k$.",
        "把角乘 $k$，就在一圈内放进 $k$ 个完整的正弦周期。每个周期的解重复出现，所以一周期的解数要乘 $k$。",
      ],
      (rng) => scaledCount(rng, "sin", sineValues),
    ),
  ],
  "trigonometric-equations-containing-transformed-cosine-functions": [
    skill(
      "counting-solutions-of-a-multiple-angle-cosine",
      ["Counting solutions of a multiple angle cosine", "数多倍角余弦方程的解"],
      [
        "Multiplying the angle by $k$ fits $k$ full cycles of cosine into one turn. The count for one cycle is multiplied by $k$, which is two per cycle for most values.",
        "把角乘 $k$，就在一圈内放进 $k$ 个完整的余弦周期。一周期的解数乘 $k$，多数值每周期有两个解。",
      ],
      (rng) => scaledCount(rng, "cos", cosineValues),
    ),
  ],
  "trigonometric-equations-containing-transformed-tangent-functions": [
    skill(
      "counting-solutions-of-a-multiple-angle-tangent",
      ["Counting solutions of a multiple angle tangent", "数多倍角正切方程的解"],
      [
        "Tangent has one solution per half turn. With the angle multiplied by $k$ there are $k$ solutions in every half turn of $\\theta$, and so $2k$ in one full turn.",
        "正切每半圈一个解。角乘 $k$ 后，$\\theta$ 每半圈有 $k$ 个解，所以一整圈有 $2k$ 个解。",
      ],
      (rng) => {
        const k = rng.int(2, 15);
        const v = rng.pick(["1", "-1", "\\sqrt{3}", "-\\sqrt{3}", "0"]);
        return whole(
          [
            `How many solutions does $\\tan(${k}\\theta) = ${v}$ have on $[0, 2\\pi)$?`,
            `$\\tan(${k}\\theta) = ${v}$ 在 $[0, 2\\pi)$ 上有多少个解？`,
          ],
          2 * k,
          [k, 4 * k, 2 * k + 1],
          [
            `As $\\theta$ runs over $[0, 2\\pi)$, $${k}\\theta$ runs over $[0, ${2 * k}\\pi)$. Tangent has period $\\pi$ and takes each value once per period, and this interval holds $${2 * k}$ periods, so there are $${2 * k}$ solutions.`,
            `当 $\\theta$ 走遍 $[0, 2\\pi)$ 时，$${k}\\theta$ 走遍 $[0, ${2 * k}\\pi)$。正切的周期是 $\\pi$，每个周期内每个值恰好取到一次；这个区间含 $${2 * k}$ 个周期，所以有 $${2 * k}$ 个解。`,
          ],
        );
      },
    ),
  ],
  "solving-trigonometric-equations-using-the-sin-cos-tan-identity": [
    skill(
      "the-tangent-from-a-balance",
      ["The tangent from a balance", "由等式求正切"],
      [
        "An equation between a multiple of sine and a multiple of cosine sets their ratio. Dividing by cosine, which cannot be zero here, gives the tangent as a single number.",
        "正弦的倍数与余弦的倍数相等，就确定了它们的比。除以余弦（这里不可能为零），正切就是一个确定的数。",
      ],
      (rng) => {
        const a = rng.int(2, 15);
        const b = rng.int(1, 15) * (rng.bool() ? 1 : -1);
        return fraction(
          [
            `If $${a}\\sin\\theta = ${b}\\cos\\theta$, what is $\\tan\\theta$?`,
            `若 $${a}\\sin\\theta = ${b}\\cos\\theta$，$\\tan\\theta$ 是多少？`,
          ],
          Q.of(b, a),
          [Q.of(a, b), Q.of(-b, a), Q.of(a * b, 1)],
          [
            `Dividing both sides by $${a}\\cos\\theta$ gives $\\tan\\theta = ${Q.of(b, a).toLatex()}$.`,
            `两边除以 $${a}\\cos\\theta$，得 $\\tan\\theta = ${Q.of(b, a).toLatex()}$。`,
          ],
        );
      },
    ),
  ],
  "solving-trigonometric-equations-using-the-zero-product-property": [
    skill(
      "counting-distinct-solutions-of-a-product",
      ["Counting distinct solutions of a product", "数乘积方程的不同解"],
      [
        "A product is zero when either factor is. But the factors can share an angle, and a shared angle counts once, so list each factor's solutions and then merge the lists.",
        "任一因式为零时积为零。但两个因式可能有相同的角，相同的角只算一次，所以分别列出解，再合并。",
      ],
      (rng) => {
        const s = rng.pick(sineValues);
        const c = rng.pick(cosineValues);
        const count = new Set([...s.angles, ...c.angles]).size;
        const fac = (name: string, v: string) =>
          v === "0" ? `\\${name}\\theta` : v.startsWith("-") ? `(\\${name}\\theta + ${v.slice(1)})` : `(\\${name}\\theta - ${v})`;
        const all = [...new Set([...s.angles, ...c.angles])]
          .sort((a, b) => a - b)
          .map((a) => `${a}^{\\circ}`)
          .join(", ");
        return whole(
          [
            `How many solutions does $${fac("sin", s.latex)}${fac("cos", c.latex)} = 0$ have on $[0^{\\circ}, 360^{\\circ})$?`,
            `$${fac("sin", s.latex)}${fac("cos", c.latex)} = 0$ 在 $[0^{\\circ}, 360^{\\circ})$ 上有多少个解？`,
          ],
          count,
          [s.angles.length + c.angles.length === count ? count + 1 : s.angles.length + c.angles.length, count - 1, 2],
          [
            `A product is zero when a factor is zero. The sine factor gives $${s.angles.map((a) => `${a}^{\\circ}`).join(", ")}$ and the cosine factor gives $${c.angles.map((a) => `${a}^{\\circ}`).join(", ")}$. Without repeats, the solutions are $${all}$.`,
            `积为零时，必有一个因式为零。正弦因式给出 $${s.angles.map((a) => `${a}^{\\circ}`).join(", ")}$，余弦因式给出 $${c.angles.map((a) => `${a}^{\\circ}`).join(", ")}$。去掉重复后，解是 $${all}$。`,
          ],
        );
      },
    ),
  ],
  "quadratic-trigonometric-equations-containing-tangent-or-cotangent": [
    skill(
      "tangent-and-cotangent-together",
      ["Tangent and cotangent together", "正切和余切同时出现"],
      [
        "Replacing $\\cot\\theta$ with $\\frac{1}{\\tan\\theta}$ and multiplying through by $\\tan\\theta$ gives a quadratic in the tangent. Its roots are the possible values of the tangent.",
        "把 $\\cot\\theta$ 换成 $\\frac{1}{\\tan\\theta}$，两边乘 $\\tan\\theta$，得到关于正切的二次方程。它的根就是正切可能的值。",
      ],
      (rng) => {
        const a = rng.int(1, 9);
        const b = a + rng.int(1, 9);
        return chooseMath(
          rng,
          [
            `What are the possible values of $\\tan\\theta$ if $\\tan\\theta + ${a * b}\\cot\\theta = ${a + b}$?`,
            `若 $\\tan\\theta + ${a * b}\\cot\\theta = ${a + b}$，$\\tan\\theta$ 可能取哪些值？`,
          ],
          `${a} \\text{ and } ${b}`,
          [`-${a} \\text{ and } -${b}`, `${a + b} \\text{ and } ${a * b}`, `${a} \\text{ and } -${b}`],
          [
            `$t^{2} - ${a + b}t + ${a * b} = 0$ factors as $(t - ${a})(t - ${b}) = 0$.`,
            `$t^{2} - ${a + b}t + ${a * b} = 0$ 分解为 $(t - ${a})(t - ${b}) = 0$。`,
          ],
        );
      },
    ),
  ],
};
