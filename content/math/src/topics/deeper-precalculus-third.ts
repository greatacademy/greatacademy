// A third knowledge point for the Precalculus topics on inequalities, inverse trigonometric functions, identities and trigonometric equations.

import type { KnowledgePointDef } from "@ga/content";
import { Q } from "@ga/subject-math";
import { precalculusDrawings } from "../explanation-drawings-precalculus.ts";
import { reasoned } from "../wrong-reasons.ts";
import { choose, chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";
import { frac, fraction, skill } from "./third-kit.ts";

/** Rng is the random source a generator receives. */
type Rng = Parameters<KnowledgePointDef["generate"]>[0];

/** factor writes a factor such as x - 3 or x + 3. */
const factor = (a: number) => (a === 0 ? "x" : a < 0 ? `(x + ${-a})` : `(x - ${a})`);

/** bare writes the factor x - a without parentheses. */
const bare = (a: number) => (a === 0 ? "x" : a < 0 ? `x + ${-a}` : `x - ${a}`);

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
    {
      ...skill(
        "counting-integers-below-the-axis",
        ["Counting integers below the axis", "数轴下方的整数"],
        [
          "An upward parabola lies below the axis only between its intercepts. The integers strictly between the two intercepts therefore number one fewer than the distance between them.\n\n> **Watch out.** At the intercepts themselves $y = 0$, which is not below the axis. Counting them as well gives one more than the distance instead of one fewer.",
          "开口向上的抛物线只在两个截距之间位于轴下方。所以严格位于两个截距之间的整数，比它们的距离少一个。\n\n> **注意。** 在截距处 $y = 0$，并不在轴下方。把截距也数进去，得到的就比距离多一个，而不是少一个。",
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
              `**Step 1: Find where $y < 0$.** The intercepts are $x = ${a}$ and $x = ${a + w}$. An upward parabola is below the axis between them, so $y < 0$ for $${a} < x < ${a + w}$; at the intercepts $y = 0$, so they do not count.\n\n**Step 2: Count the integers.** They run from $${a + 1}$ to $${a + w - 1}$, which is $${w - 1}$ in all.\n\n**Check.** From $${a}$ to $${a + w}$ there are $${w}$ unit steps, so $${w + 1}$ integers counting both intercepts. Leaving out the two intercepts leaves $${w + 1} - 2 = ${w - 1}$.`,
              `**第一步：找出 $y < 0$ 的范围。**截距是 $x = ${a}$ 和 $x = ${a + w}$。开口向上的抛物线在两者之间位于轴下方，所以 $${a} < x < ${a + w}$ 时 $y < 0$；截距处 $y = 0$，不算在内。\n\n**第二步：数整数。**这些整数从 $${a + 1}$ 到 $${a + w - 1}$，共 $${w - 1}$ 个。\n\n**检验。**从 $${a}$ 到 $${a + w}$ 有 $${w}$ 个单位长度，连同两个截距共有 $${w + 1}$ 个整数。去掉两个截距，剩下 $${w + 1} - 2 = ${w - 1}$ 个。`,
            ],
          );
        },
      ),
      figure: precalculusDrawings["solving-quadratic-inequalities-from-graphs#counting-integers-below-the-axis"],
    },
  ],
  "solving-polynomial-inequalities-using-a-graphical-method": [
    {
      ...skill(
        "a-repeated-root-does-not-change-the-sign",
        ["A repeated root does not change the sign", "重根不改变符号"],
        [
          "A squared factor is never negative, so the graph touches the axis there and turns back. It adds its root to a solution set that includes equality, without flipping the sign beyond it.\n\n> **Watch out.** With $\\le$ or $\\ge$, the root of the squared factor belongs to the solution even when the product has the wrong sign on both sides of it, so the answer can contain a lone point.",
          "平方因子不会是负数，所以图像在那里碰到轴后折回。它把自己的根加入含等号的解集，但不会改变符号。\n\n> **注意。** 对 $\\le$ 或 $\\ge$，即使乘积在平方因子的根两侧符号都不对，这个根仍属于解集，所以答案里可能有一个孤立的点。",
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
                `**Step 1: Look at the squared factor.** $${factor(a)}^{2}$ is positive except at $x = ${a}$, where it is $0$, so the product is $0$ there.\n\n**Step 2: Use the other factor.** Elsewhere the product has the sign of $${bare(b)}$, which is at most $0$ for $x \\le ${b}$. So $x \\le ${b}$ or $x = ${a}$.\n\n**Check.** At $x = ${b - 1}$ the product is $${-((a - b + 1) ** 2)}$, at $x = ${a}$ it is $0$, and at $x = ${a + 1}$ it is $${a + 1 - b}$. The first two satisfy $\\le 0$ and the last does not, as the answer says.`,
                `**第一步：看平方因子。**$${factor(a)}^{2}$ 除 $x = ${a}$ 外都为正，在那里为 $0$，所以乘积在那里为 $0$。\n\n**第二步：看另一个因子。**在其他地方，乘积与 $${bare(b)}$ 同号，而它在 $x \\le ${b}$ 时不大于 $0$。所以 $x \\le ${b}$ 或 $x = ${a}$。\n\n**检验。**$x = ${b - 1}$ 时乘积为 $${-((a - b + 1) ** 2)}$，$x = ${a}$ 时为 $0$，$x = ${a + 1}$ 时为 $${a + 1 - b}$。前两个满足 $\\le 0$，最后一个不满足，与答案一致。`,
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
      figure: precalculusDrawings["solving-polynomial-inequalities-using-a-graphical-method#a-repeated-root-does-not-change-the-sign"],
    },
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
    {
      ...skill(
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
      figure: precalculusDrawings["solving-two-variable-nonlinear-inequalities#reading-the-symbol-for-the-graph"],
    },
  ],
  "graphing-the-inverse-sine-function": [
    {
      ...skill(
        "undoing-sine-outside-the-range",
        ["Undoing sine outside the range", "在值域之外还原正弦"],
        [
          "Arcsine always returns an angle from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$. So for an angle outside this range, the result is the angle in the range with the same sine, not the original.\n\nFor $\\arcsin\\left(\\sin \\frac{5\\pi}{6}\\right)$: the angle $\\frac{5\\pi}{6}$ is past $\\frac{\\pi}{2}$, and $\\sin\\left(\\pi - \\frac{5\\pi}{6}\\right) = \\sin \\frac{\\pi}{6}$, so the result is $\\frac{\\pi}{6}$. Check: $\\sin \\frac{5\\pi}{6} = \\sin \\frac{\\pi}{6} = \\frac{1}{2}$, and $\\arcsin \\frac{1}{2} = \\frac{\\pi}{6}$.\n\n> **Watch out.** $\\arcsin(\\sin x) = x$ only when $x$ is already in the range. Reflect with $\\pi - x$; changing the sign instead gives $-x$, whose sine has the opposite sign.",
          "反正弦总是返回 $-\\frac{\\pi}{2}$ 到 $\\frac{\\pi}{2}$ 之间的角。所以范围外的角，结果是范围内正弦相同的角，而不是原来的角。\n\n对 $\\arcsin\\left(\\sin \\frac{5\\pi}{6}\\right)$：角 $\\frac{5\\pi}{6}$ 超过了 $\\frac{\\pi}{2}$，而 $\\sin\\left(\\pi - \\frac{5\\pi}{6}\\right) = \\sin \\frac{\\pi}{6}$，所以结果是 $\\frac{\\pi}{6}$。检验：$\\sin \\frac{5\\pi}{6} = \\sin \\frac{\\pi}{6} = \\frac{1}{2}$，而 $\\arcsin \\frac{1}{2} = \\frac{\\pi}{6}$。\n\n> **注意。** 只有 $x$ 已在值域内时才有 $\\arcsin(\\sin x) = x$。要用 $\\pi - x$ 来反射；如果只改变符号得到 $-x$，它的正弦符号相反。",
        ],
        (rng) => {
          const d = rng.int(3, 18);
          const inside = rng.int(1, Math.floor((d - 1) / 2));
          const angle = piOver(d - inside, d);
          const ans = piOver(inside, d);
          return reasoned(
            chooseMath(
              rng,
              [`Evaluate $\\arcsin\\left(\\sin ${angle}\\right)$.`, `计算 $\\arcsin\\left(\\sin ${angle}\\right)$。`],
              ans,
              [angle, piOver(-inside, d), piOver(inside + d, d)],
              [
                `**Step 1: Compare with the range.** The angle $${angle}$ is more than $\\frac{\\pi}{2}$, so it is outside the range of arcsine, and arcsine cannot return it.\n\n**Step 2: Reflect.** Since $\\sin(\\pi - x) = \\sin x$,\n\n$$\\sin ${angle} = \\sin\\left(\\pi - ${angle}\\right) = \\sin ${ans}$$\n\n**Check.** $${ans}$ lies between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$, and its sine is $\\sin ${angle}$, so $\\arcsin\\left(\\sin ${angle}\\right) = ${ans}$.`,
                `**第一步：与值域比较。**角 $${angle}$ 大于 $\\frac{\\pi}{2}$，不在反正弦的值域内，反正弦不会返回它。\n\n**第二步：反射。**因为 $\\sin(\\pi - x) = \\sin x$，\n\n$$\\sin ${angle} = \\sin\\left(\\pi - ${angle}\\right) = \\sin ${ans}$$\n\n**检验。**$${ans}$ 在 $-\\frac{\\pi}{2}$ 与 $\\frac{\\pi}{2}$ 之间，它的正弦是 $\\sin ${angle}$，所以 $\\arcsin\\left(\\sin ${angle}\\right) = ${ans}$。`,
              ],
            ),
            [
              [
                `$${angle}$`,
                "This angle is outside the range of arcsine, from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$, so arcsine cannot return it.",
                "这个角不在反正弦的值域 $-\\frac{\\pi}{2}$ 到 $\\frac{\\pi}{2}$ 内，反正弦不会返回它。",
              ],
              [
                `$${piOver(-inside, d)}$`,
                "The sign is wrong: the sine of the angle is positive, so the result is positive too.",
                "符号错了：这个角的正弦是正的，所以结果也是正的。",
              ],
              [
                `$${piOver(inside + d, d)}$`,
                "Adding $\\pi$ changes the sign of the sine, and the angle is outside the range.",
                "加上 $\\pi$ 会改变正弦的符号，而且这个角不在值域内。",
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings["graphing-the-inverse-sine-function#undoing-sine-outside-the-range"],
    },
  ],
  "graphing-the-inverse-cosine-function": [
    {
      ...skill(
        "undoing-cosine-outside-the-range",
        ["Undoing cosine outside the range", "在值域之外还原余弦"],
        [
          "Arccosine always returns an angle from $0$ to $\\pi$. Cosine has the same value at $x$ and at $2\\pi - x$, so an angle past $\\pi$ comes back reflected, not unchanged.\n\nFor $\\arccos\\left(\\cos \\frac{5\\pi}{3}\\right)$: the angle is past $\\pi$, and $\\cos\\left(2\\pi - \\frac{5\\pi}{3}\\right) = \\cos \\frac{\\pi}{3}$, so the result is $\\frac{\\pi}{3}$. Check: $\\cos \\frac{5\\pi}{3} = \\cos \\frac{\\pi}{3} = \\frac{1}{2}$, and $\\arccos \\frac{1}{2} = \\frac{\\pi}{3}$.\n\n> **Watch out.** Reflect with $2\\pi - x$, not $\\pi - x$: $\\cos(\\pi - x) = -\\cos x$ has the opposite sign. And arccosine never returns a negative angle.",
          "反余弦总是返回 0 到 $\\pi$ 之间的角。余弦在 $x$ 和 $2\\pi - x$ 处相等，所以超过 $\\pi$ 的角会反射回来，而不是不变。\n\n对 $\\arccos\\left(\\cos \\frac{5\\pi}{3}\\right)$：这个角超过了 $\\pi$，而 $\\cos\\left(2\\pi - \\frac{5\\pi}{3}\\right) = \\cos \\frac{\\pi}{3}$，所以结果是 $\\frac{\\pi}{3}$。检验：$\\cos \\frac{5\\pi}{3} = \\cos \\frac{\\pi}{3} = \\frac{1}{2}$，而 $\\arccos \\frac{1}{2} = \\frac{\\pi}{3}$。\n\n> **注意。** 要用 $2\\pi - x$ 反射，而不是 $\\pi - x$：$\\cos(\\pi - x) = -\\cos x$ 的符号相反。反余弦也从不返回负角。",
        ],
        (rng) => {
          const d = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
          const n = rng.int(1, d - 1);
          const angle = piOver(2 * d - n, d);
          const ans = piOver(n, d);
          return reasoned(
            chooseMath(
              rng,
              [`Evaluate $\\arccos\\left(\\cos ${angle}\\right)$.`, `计算 $\\arccos\\left(\\cos ${angle}\\right)$。`],
              ans,
              [angle, piOver(-n, d), piOver(d - n, d) === ans ? piOver(n + 2 * d, d) : piOver(d - n, d)],
              [
                `**Step 1: Compare with the range.** The angle $${angle}$ is more than $\\pi$, so it is outside the range of arccosine, from $0$ to $\\pi$.\n\n**Step 2: Reflect.** Since $\\cos(2\\pi - x) = \\cos x$,\n\n$$\\cos ${angle} = \\cos\\left(2\\pi - ${angle}\\right) = \\cos ${ans}$$\n\n**Check.** $${ans}$ lies between $0$ and $\\pi$, and its cosine is $\\cos ${angle}$, so $\\arccos\\left(\\cos ${angle}\\right) = ${ans}$.`,
                `**第一步：与值域比较。**角 $${angle}$ 大于 $\\pi$，不在反余弦的值域 $0$ 到 $\\pi$ 内。\n\n**第二步：反射。**因为 $\\cos(2\\pi - x) = \\cos x$，\n\n$$\\cos ${angle} = \\cos\\left(2\\pi - ${angle}\\right) = \\cos ${ans}$$\n\n**检验。**$${ans}$ 在 $0$ 与 $\\pi$ 之间，它的余弦是 $\\cos ${angle}$，所以 $\\arccos\\left(\\cos ${angle}\\right) = ${ans}$。`,
              ],
            ),
            [
              [
                `$${angle}$`,
                "This angle is outside the range of arccosine, from $0$ to $\\pi$, so arccosine cannot return it.",
                "这个角不在反余弦的值域 $0$ 到 $\\pi$ 内，反余弦不会返回它。",
              ],
              [
                `$${piOver(-n, d)}$`,
                "Arccosine never returns a negative angle: its range is from $0$ to $\\pi$.",
                "反余弦从不返回负角：它的值域是 $0$ 到 $\\pi$。",
              ],
              [
                `$${piOver(d - n, d)}$`,
                "This reflects with $\\pi - x$, but $\\cos(\\pi - x) = -\\cos x$ has the opposite sign.",
                "这是用 $\\pi - x$ 反射的，但 $\\cos(\\pi - x) = -\\cos x$ 的符号相反。",
              ],
              [
                `$${piOver(n + 2 * d, d)}$`,
                "Adding $2\\pi$ keeps the cosine, but the angle is outside the range.",
                "加上 $2\\pi$ 不改变余弦，但这个角不在值域内。",
              ],
            ],
          );
        },
      ),
      figure: precalculusDrawings["graphing-the-inverse-cosine-function#undoing-cosine-outside-the-range"],
    },
  ],
  "graphing-the-inverse-tangent-function": [
    {
      ...skill(
        "undoing-tangent-outside-the-range",
        ["Undoing tangent outside the range", "在值域之外还原正切"],
        [
          "Arctangent returns an angle strictly between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$. Tangent repeats every $\\pi$, so subtract $\\pi$ as many times as it takes to land in that range.\n\nFor $\\arctan\\left(\\tan \\frac{7\\pi}{6}\\right)$: subtracting $\\pi$ gives $\\frac{\\pi}{6}$, which lies in the range, so the result is $\\frac{\\pi}{6}$. Check: $\\tan \\frac{7\\pi}{6} = \\tan \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{3}$.\n\n> **Watch out.** Tangent repeats every $\\pi$, so shift by whole multiples of $\\pi$; do not reflect as for sine, since $\\tan(\\pi - x) = -\\tan x$. Subtract, rather than add, to move toward the range.",
          "反正切返回严格在 $-\\frac{\\pi}{2}$ 和 $\\frac{\\pi}{2}$ 之间的角。正切的周期是 $\\pi$，所以减去若干个 $\\pi$，直到落在这个范围内。\n\n对 $\\arctan\\left(\\tan \\frac{7\\pi}{6}\\right)$：减去 $\\pi$ 得 $\\frac{\\pi}{6}$，它在值域内，所以结果是 $\\frac{\\pi}{6}$。检验：$\\tan \\frac{7\\pi}{6} = \\tan \\frac{\\pi}{6} = \\frac{\\sqrt{3}}{3}$。\n\n> **注意。** 正切的周期是 $\\pi$，所以要平移 $\\pi$ 的整数倍；不要像正弦那样反射，因为 $\\tan(\\pi - x) = -\\tan x$。要减去而不是加上，才能靠近值域。",
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
                `**Step 1: Use the period.** Tangent repeats every $\\pi$, so subtracting a whole number of $\\pi$ keeps the tangent.\n\n**Step 2: Subtract.** Take away ${turns === 1 ? "$\\pi$" : `$${turns}\\pi$`}:\n\n$$${piOver(small + turns * d, d)} - ${turns === 1 ? "" : turns}\\pi = ${piOver(small, d)}$$\n\n**Check.** $${piOver(small, d)}$ lies strictly between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$, and its tangent is $\\tan ${piOver(small + turns * d, d)}$, so it is the result.`,
                `**第一步：利用周期。**正切的周期是 $\\pi$，所以减去 $\\pi$ 的整数倍不改变正切。\n\n**第二步：减去。**减去 ${turns === 1 ? "$\\pi$" : `$${turns}\\pi$`}：\n\n$$${piOver(small + turns * d, d)} - ${turns === 1 ? "" : turns}\\pi = ${piOver(small, d)}$$\n\n**检验。**$${piOver(small, d)}$ 严格在 $-\\frac{\\pi}{2}$ 与 $\\frac{\\pi}{2}$ 之间，它的正切是 $\\tan ${piOver(small + turns * d, d)}$，所以它就是结果。`,
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
      figure: precalculusDrawings["graphing-the-inverse-tangent-function#undoing-tangent-outside-the-range"],
    },
  ],
  "evaluating-expressions-containing-inverse-trigonometric-functions": [
    skill(
      "a-ratio-of-an-inverse-ratio",
      ["A ratio of an inverse ratio", "反三角函数的三角比"],
      [
        "An inverse function names an angle, and a right triangle holds its ratio. So draw the triangle, use the Pythagorean theorem for the missing side, and read off the other ratio.\n\nFor $\\sin\\left(\\arccos \\frac{3}{5}\\right)$: the angle has adjacent side $3$ and hypotenuse $5$, so the opposite side is $\\sqrt{5^{2} - 3^{2}} = 4$, and the sine is $\\frac{4}{5}$. Check: $\\left(\\frac{3}{5}\\right)^{2} + \\left(\\frac{4}{5}\\right)^{2} = \\frac{9}{25} + \\frac{16}{25} = 1$.\n\n> **Watch out.** Read which sides the inner ratio names: arccosine gives adjacent over hypotenuse, arcsine opposite over hypotenuse. The answer is another ratio of the same triangle, not the one inside, and here the angle is acute, so it is positive.",
        "反函数表示一个角，它的比可以放在直角三角形中。所以画三角形，用勾股定理求缺失的边，再读出另一个比。\n\n对 $\\sin\\left(\\arccos \\frac{3}{5}\\right)$：这个角的邻边是 $3$，斜边是 $5$，所以对边是 $\\sqrt{5^{2} - 3^{2}} = 4$，正弦是 $\\frac{4}{5}$。检验：$\\left(\\frac{3}{5}\\right)^{2} + \\left(\\frac{4}{5}\\right)^{2} = \\frac{9}{25} + \\frac{16}{25} = 1$。\n\n> **注意。** 要看清里面的比指的是哪两条边：反余弦给出邻边比斜边，反正弦给出对边比斜边。答案是同一个三角形的另一个比，不是里面那个；这里的角是锐角，所以答案是正的。",
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
            `**Step 1: Draw the triangle.** The inner angle has ${form === 1 ? "opposite" : "adjacent"} side $${a}$ and hypotenuse $${c}$, since $${form === 1 ? "\\sin" : "\\cos"}$ is ${form === 1 ? "opposite" : "adjacent"} over hypotenuse.\n\n**Step 2: Find the missing side.** By the Pythagorean theorem the ${form === 1 ? "adjacent" : "opposite"} side is $\\sqrt{${c}^{2} - ${a}^{2}} = \\sqrt{${c * c - a * a}} = ${b}$.\n\n**Step 3: Read off the ratio.** ${form === 2 ? `The tangent is opposite over adjacent, $${frac(b, a)}$.` : `The ${form === 0 ? "sine is opposite" : "cosine is adjacent"} over hypotenuse, $${frac(b, c)}$.`}\n\n**Check.** $${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${c * c} = ${c}^{2}$, so the sides do make a right triangle.`,
            `**第一步：画三角形。**里面的角的${form === 1 ? "对边" : "邻边"}是 $${a}$，斜边是 $${c}$，因为 $${form === 1 ? "\\sin" : "\\cos"}$ 是${form === 1 ? "对边" : "邻边"}比斜边。\n\n**第二步：求缺失的边。**由勾股定理，${form === 1 ? "邻边" : "对边"}是 $\\sqrt{${c}^{2} - ${a}^{2}} = \\sqrt{${c * c - a * a}} = ${b}$。\n\n**第三步：读出比。**${form === 2 ? `正切是对边比邻边，即 $${frac(b, a)}$。` : `${form === 0 ? "正弦是对边" : "余弦是邻边"}比斜边，即 $${frac(b, c)}$。`}\n\n**检验。**$${a}^{2} + ${b}^{2} = ${a * a} + ${b * b} = ${c * c} = ${c}^{2}$，所以这三条边确实构成直角三角形。`,
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
        "When an expression mixes several functions, writing each in terms of sine and cosine shows what cancels. A common denominator then finishes the job.\n\nFor $\\sec\\theta - \\sin\\theta\\tan\\theta$:\n\n$$\\frac{1}{\\cos\\theta} - \\frac{\\sin^{2}\\theta}{\\cos\\theta} = \\frac{1 - \\sin^{2}\\theta}{\\cos\\theta} = \\frac{\\cos^{2}\\theta}{\\cos\\theta} = \\cos\\theta$$\n\nCheck: at $\\theta = 60^{\\circ}$, $2 - \\frac{\\sqrt{3}}{2} \\cdot \\sqrt{3} = 2 - \\frac{3}{2} = \\frac{1}{2} = \\cos 60^{\\circ}$.\n\n> **Watch out.** Put the terms over a common denominator before using $\\sin^{2} + \\cos^{2} = 1$; the identity only acts on the combined numerator. Keep the coefficient in front through every step.",
        "式子中有几种函数时，把它们都写成正弦和余弦，就能看出什么可以约去。再通分就完成了。\n\n对 $\\sec\\theta - \\sin\\theta\\tan\\theta$：\n\n$$\\frac{1}{\\cos\\theta} - \\frac{\\sin^{2}\\theta}{\\cos\\theta} = \\frac{1 - \\sin^{2}\\theta}{\\cos\\theta} = \\frac{\\cos^{2}\\theta}{\\cos\\theta} = \\cos\\theta$$\n\n检验：当 $\\theta = 60^{\\circ}$ 时，$2 - \\frac{\\sqrt{3}}{2} \\cdot \\sqrt{3} = 2 - \\frac{3}{2} = \\frac{1}{2} = \\cos 60^{\\circ}$。\n\n> **注意。** 要先通分，再用 $\\sin^{2} + \\cos^{2} = 1$；恒等式只作用于合并后的分子。前面的系数要在每一步都保留。",
      ],
      (rng) => {
        const k = rng.int(2, 15);
        const v = rng.pick(["\\theta", "x", "t", "u"]);
        const form = rng.int(0, 2);
        const expr = [`\\sec ${v} - \\sin ${v} \\tan ${v}`, `\\csc ${v} - \\cos ${v} \\cot ${v}`, `\\tan ${v} + \\cot ${v}`][form]!;
        const correct = [`${k}\\cos ${v}`, `${k}\\sin ${v}`, `${k}\\sec ${v} \\csc ${v}`][form]!;
        const s = `\\sin ${v}`;
        const c = `\\cos ${v}`;
        const written = [
          `\\frac{1}{${c}} - \\frac{\\sin^{2} ${v}}{${c}}`,
          `\\frac{1}{${s}} - \\frac{\\cos^{2} ${v}}{${s}}`,
          `\\frac{${s}}{${c}} + \\frac{${c}}{${s}}`,
        ][form]!;
        const combined = [
          `\\frac{1 - \\sin^{2} ${v}}{${c}} = \\frac{\\cos^{2} ${v}}{${c}} = ${c}`,
          `\\frac{1 - \\cos^{2} ${v}}{${s}} = \\frac{\\sin^{2} ${v}}{${s}} = ${s}`,
          `\\frac{\\sin^{2} ${v} + \\cos^{2} ${v}}{${s} ${c}} = \\frac{1}{${s} ${c}} = \\sec ${v} \\csc ${v}`,
        ][form]!;
        const check = [
          [`${v} = 60^{\\circ}`, "2 - \\frac{\\sqrt{3}}{2} \\cdot \\sqrt{3} = \\frac{1}{2}", "\\cos 60^{\\circ} = \\frac{1}{2}"],
          [`${v} = 30^{\\circ}`, "2 - \\frac{\\sqrt{3}}{2} \\cdot \\sqrt{3} = \\frac{1}{2}", "\\sin 30^{\\circ} = \\frac{1}{2}"],
          [`${v} = 45^{\\circ}`, "1 + 1 = 2", "\\sec 45^{\\circ} \\csc 45^{\\circ} = \\sqrt{2} \\cdot \\sqrt{2} = 2"],
        ][form]!;
        return reasoned(
          chooseMath(
            rng,
            [`Simplify $${k}(${expr})$.`, `化简 $${k}(${expr})$。`],
            correct,
            [`${k}\\tan ${v}`, `${k}`, `${k}\\cot ${v}`, `${k}\\sin ${v} \\cos ${v}`],
            [
              `**Step 1: Write everything in sine and cosine.** The bracket is\n\n$$${expr} = ${written}$$\n\n**Step 2: Combine and use the identity.** Over the common denominator, with $\\sin^{2} + \\cos^{2} = 1$:\n\n$$${written} = ${combined}$$\n\nSo $${k}(${expr}) = ${correct}$.\n\n**Check.** At $${check[0]}$ the bracket is $${check[1]}$, and $${check[2]}$, which agree.`,
              `**第一步：全部写成正弦和余弦。**括号内是\n\n$$${expr} = ${written}$$\n\n**第二步：通分并用恒等式。**通分，并利用 $\\sin^{2} + \\cos^{2} = 1$：\n\n$$${written} = ${combined}$$\n\n所以 $${k}(${expr}) = ${correct}$。\n\n**检验。**当 $${check[0]}$ 时，括号内是 $${check[1]}$，而 $${check[2]}$，两者相等。`,
            ],
          ),
          [
            [
              `$${k}\\tan ${v}$`,
              "Every tangent becomes sine over cosine, and after combining over the common denominator no tangent is left.",
              "每个正切都化成正弦比余弦，通分合并后不会剩下正切。",
            ],
            [
              `$${k}$`,
              "The identity simplifies the numerator, but a function of the angle is left over the denominator, so the result is not a constant.",
              "恒等式化简了分子，但分母上的三角函数还在，所以结果不是常数。",
            ],
            [
              `$${k}\\cot ${v}$`,
              "Every cotangent becomes cosine over sine, and after combining over the common denominator no cotangent is left.",
              "每个余切都化成余弦比正弦，通分合并后不会剩下余切。",
            ],
            form === 2
              ? [
                  `$${k}\\sin ${v} \\cos ${v}$`,
                  `This is upside down: the sum is $\\frac{1}{\\sin ${v} \\cos ${v}}$, not $\\sin ${v} \\cos ${v}$.`,
                  `上下颠倒了：和是 $\\frac{1}{\\sin ${v} \\cos ${v}}$，不是 $\\sin ${v} \\cos ${v}$。`,
                ]
              : [
                  `$${k}\\sin ${v} \\cos ${v}$`,
                  "After cancelling, a single function is left, not a product of sine and cosine.",
                  "约分后只剩下一个函数，而不是正弦与余弦的积。",
                ],
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
        "The identity gives $\\cos^{2}\\theta$, which has two square roots. The quadrant decides between them, as cosine is positive on the right of the circle and negative on the left.\n\nFor $\\sin\\theta = \\frac{3}{5}$ in quadrant II: $\\cos^{2}\\theta = 1 - \\frac{9}{25} = \\frac{16}{25}$, and cosine is negative there, so $\\cos\\theta = -\\frac{4}{5}$. Check: $\\left(\\frac{3}{5}\\right)^{2} + \\left(-\\frac{4}{5}\\right)^{2} = \\frac{9}{25} + \\frac{16}{25} = 1$.\n\n> **Watch out.** The identity gives only $\\cos^{2}\\theta$, and both signs square to it. Decide the sign from the quadrant: in quadrant II the sine is positive but the cosine is negative.",
        "恒等式给出 $\\cos^{2}\\theta$，它有两个平方根。象限决定取哪一个：余弦在圆的右侧为正，左侧为负。\n\n对第二象限中 $\\sin\\theta = \\frac{3}{5}$：$\\cos^{2}\\theta = 1 - \\frac{9}{25} = \\frac{16}{25}$，而余弦在那里为负，所以 $\\cos\\theta = -\\frac{4}{5}$。检验：$\\left(\\frac{3}{5}\\right)^{2} + \\left(-\\frac{4}{5}\\right)^{2} = \\frac{9}{25} + \\frac{16}{25} = 1$。\n\n> **注意。** 恒等式只给出 $\\cos^{2}\\theta$，两个符号平方后都是它。要由象限决定符号：在第二象限正弦为正，而余弦为负。",
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
            `**Step 1: Use the identity.** From $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$,\n\n$$\\cos^{2}\\theta = 1 - ${frac(a * a, c * c)} = ${frac(b * b, c * c)}$$\n\n**Step 2: Choose the sign.** So $\\cos\\theta = \\pm ${frac(b, c)}$. Cosine is ${q2 ? "negative" : "positive"} in quadrant ${q2 ? "II" : "I"}, so $\\cos\\theta = ${q2 ? "-" : ""}${frac(b, c)}$.\n\n**Check.** $\\left(${frac(a, c)}\\right)^{2} + \\left(${q2 ? "-" : ""}${frac(b, c)}\\right)^{2} = ${frac(a * a + b * b, c * c)} = 1$.`,
            `**第一步：用恒等式。**由 $\\sin^{2}\\theta + \\cos^{2}\\theta = 1$，\n\n$$\\cos^{2}\\theta = 1 - ${frac(a * a, c * c)} = ${frac(b * b, c * c)}$$\n\n**第二步：确定符号。**所以 $\\cos\\theta = \\pm ${frac(b, c)}$。余弦在第${q2 ? "二" : "一"}象限为${q2 ? "负" : "正"}，所以 $\\cos\\theta = ${q2 ? "-" : ""}${frac(b, c)}$。\n\n**检验。**$\\left(${frac(a, c)}\\right)^{2} + \\left(${q2 ? "-" : ""}${frac(b, c)}\\right)^{2} = ${frac(a * a + b * b, c * c)} = 1$。`,
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
        "The identity $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$ turns a known tangent into a secant. Then the sign of the square root comes from the quadrant, as with any other square root.\n\nFor $\\tan\\theta = \\frac{3}{4}$ in quadrant III: $\\sec^{2}\\theta = 1 + \\frac{9}{16} = \\frac{25}{16}$, and cosine is negative there, so $\\sec\\theta = -\\frac{5}{4}$. Check: $1 + \\left(\\frac{3}{4}\\right)^{2} = \\frac{25}{16} = \\left(-\\frac{5}{4}\\right)^{2}$.\n\n> **Watch out.** Secant has the sign of cosine, not of tangent: in quadrant III the tangent is positive but the secant is negative.",
        "恒等式 $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$ 把已知的正切化成正割。平方根的符号由象限决定，和其他平方根一样。\n\n对第三象限中 $\\tan\\theta = \\frac{3}{4}$：$\\sec^{2}\\theta = 1 + \\frac{9}{16} = \\frac{25}{16}$，而余弦在那里为负，所以 $\\sec\\theta = -\\frac{5}{4}$。检验：$1 + \\left(\\frac{3}{4}\\right)^{2} = \\frac{25}{16} = \\left(-\\frac{5}{4}\\right)^{2}$。\n\n> **注意。** 正割与余弦同号，而不是与正切同号：在第三象限正切为正，正割却为负。",
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
            `**Step 1: Use the identity.** From $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$,\n\n$$\\sec^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$$\n\n**Step 2: Choose the sign.** So $\\sec\\theta = \\pm ${frac(c, b)}$. Secant has the sign of cosine, which is ${q3 ? "negative" : "positive"} in quadrant ${q3 ? "III" : "I"}, so $\\sec\\theta = ${q3 ? "-" : ""}${frac(c, b)}$.\n\n**Check.** $1 + \\left(${frac(a, b)}\\right)^{2} = ${frac(c * c, b * b)} = \\left(${q3 ? "-" : ""}${frac(c, b)}\\right)^{2}$.`,
            `**第一步：用恒等式。**由 $1 + \\tan^{2}\\theta = \\sec^{2}\\theta$，\n\n$$\\sec^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$$\n\n**第二步：确定符号。**所以 $\\sec\\theta = \\pm ${frac(c, b)}$。正割与余弦同号，余弦在第${q3 ? "三" : "一"}象限为${q3 ? "负" : "正"}，所以 $\\sec\\theta = ${q3 ? "-" : ""}${frac(c, b)}$。\n\n**检验。**$1 + \\left(${frac(a, b)}\\right)^{2} = ${frac(c * c, b * b)} = \\left(${q3 ? "-" : ""}${frac(c, b)}\\right)^{2}$。`,
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
        "Since $(\\sec x + \\tan x)(\\sec x - \\tan x) = 1$, the two factors are reciprocals. So knowing one gives the other at once, with no need to find $x$.\n\nIf $\\sec x + \\tan x = 3$, then $\\sec x - \\tan x = \\frac{1}{3}$. Check: $3 \\cdot \\frac{1}{3} = 1 = \\sec^{2} x - \\tan^{2} x$.\n\n> **Watch out.** The other factor is the reciprocal, not the negative: the sign between the terms changes, but the value is turned upside down.",
        "由 $(\\sec x + \\tan x)(\\sec x - \\tan x) = 1$，两个因式互为倒数。所以知道一个就立刻得到另一个，不必求 $x$。\n\n若 $\\sec x + \\tan x = 3$，则 $\\sec x - \\tan x = \\frac{1}{3}$。检验：$3 \\cdot \\frac{1}{3} = 1 = \\sec^{2} x - \\tan^{2} x$。\n\n> **注意。** 另一个因式是倒数，而不是相反数：两项之间的符号变了，但值是上下颠倒，而不是变号。",
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
            `**Step 1: Multiply the factors.** The two factors multiply to the secant and tangent identity:\n\n$$(\\sec x + \\tan x)(\\sec x - \\tan x) = \\sec^{2} x - \\tan^{2} x = 1$$\n\n**Step 2: Divide.** So the factor asked for is the reciprocal of $${shown}$:\n\n$$\\sec x ${plusFirst ? "-" : "+"} \\tan x = \\frac{1}{${shown}} = ${Q.of(d, n).toLatex()}$$\n\n**Check.** $${shown} \\cdot ${Q.of(d, n).toLatex()} = 1$, as the identity requires.`,
            `**第一步：两个因式相乘。**两个因式的积就是正割与正切的恒等式：\n\n$$(\\sec x + \\tan x)(\\sec x - \\tan x) = \\sec^{2} x - \\tan^{2} x = 1$$\n\n**第二步：相除。**所以所求的因式是 $${shown}$ 的倒数：\n\n$$\\sec x ${plusFirst ? "-" : "+"} \\tan x = \\frac{1}{${shown}} = ${Q.of(d, n).toLatex()}$$\n\n**检验。**$${shown} \\cdot ${Q.of(d, n).toLatex()} = 1$，符合恒等式。`,
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
        "The identity $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$ turns a known cotangent into a cosecant. Cosecant has the sign of sine, so it is positive above the axis and negative below.\n\nFor $\\cot\\theta = \\frac{4}{3}$ in quadrant III: $\\csc^{2}\\theta = 1 + \\frac{16}{9} = \\frac{25}{9}$, and sine is negative there, so $\\csc\\theta = -\\frac{5}{3}$. Check: $1 + \\left(\\frac{4}{3}\\right)^{2} = \\frac{25}{9} = \\left(-\\frac{5}{3}\\right)^{2}$.\n\n> **Watch out.** Cosecant has the sign of sine, not of cotangent: in quadrant III the cotangent is positive but the cosecant is negative.",
        "恒等式 $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$ 把已知的余切化成余割。余割与正弦同号，在轴上方为正，在轴下方为负。\n\n对第三象限中 $\\cot\\theta = \\frac{4}{3}$：$\\csc^{2}\\theta = 1 + \\frac{16}{9} = \\frac{25}{9}$，而正弦在那里为负，所以 $\\csc\\theta = -\\frac{5}{3}$。检验：$1 + \\left(\\frac{4}{3}\\right)^{2} = \\frac{25}{9} = \\left(-\\frac{5}{3}\\right)^{2}$。\n\n> **注意。** 余割与正弦同号，而不是与余切同号：在第三象限余切为正，余割却为负。",
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
            `**Step 1: Use the identity.** From $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$,\n\n$$\\csc^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$$\n\n**Step 2: Choose the sign.** So $\\csc\\theta = \\pm ${frac(c, b)}$. Cosecant has the sign of sine, which is ${q3 ? "negative" : "positive"} in quadrant ${q3 ? "III" : "I"}, so $\\csc\\theta = ${q3 ? "-" : ""}${frac(c, b)}$.\n\n**Check.** $1 + \\left(${frac(a, b)}\\right)^{2} = ${frac(c * c, b * b)} = \\left(${q3 ? "-" : ""}${frac(c, b)}\\right)^{2}$.`,
            `**第一步：用恒等式。**由 $1 + \\cot^{2}\\theta = \\csc^{2}\\theta$，\n\n$$\\csc^{2}\\theta = 1 + ${frac(a * a, b * b)} = ${frac(c * c, b * b)}$$\n\n**第二步：确定符号。**所以 $\\csc\\theta = \\pm ${frac(c, b)}$。余割与正弦同号，正弦在第${q3 ? "三" : "一"}象限为${q3 ? "负" : "正"}，所以 $\\csc\\theta = ${q3 ? "-" : ""}${frac(c, b)}$。\n\n**检验。**$1 + \\left(${frac(a, b)}\\right)^{2} = ${frac(c * c, b * b)} = \\left(${q3 ? "-" : ""}${frac(c, b)}\\right)^{2}$。`,
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
        "Sine of one acute angle equals cosine of the other exactly when the angles add up to $90^{\\circ}$. This turns an equation between the functions into a linear equation in $x$.\n\nFor $\\sin((2x + 10)^{\\circ}) = \\cos((x + 20)^{\\circ})$: the angles add up to $90^{\\circ}$, so $3x + 30 = 90$ and $x = 20$. Check: the angles are $50^{\\circ}$ and $40^{\\circ}$, which add up to $90^{\\circ}$, so $\\sin 50^{\\circ} = \\cos 40^{\\circ}$.\n\n> **Watch out.** Set the sum of the angles to $90^{\\circ}$; do not set the angles equal, since $\\sin A = \\cos B$ does not mean $A = B$.",
        "一个锐角的正弦等于另一个锐角的余弦，当且仅当两角之和是 $90^{\\circ}$。这把函数之间的等式变成 $x$ 的一次方程。\n\n对 $\\sin((2x + 10)^{\\circ}) = \\cos((x + 20)^{\\circ})$：两角之和是 $90^{\\circ}$，所以 $3x + 30 = 90$，$x = 20$。检验：两个角是 $50^{\\circ}$ 和 $40^{\\circ}$，和是 $90^{\\circ}$，所以 $\\sin 50^{\\circ} = \\cos 40^{\\circ}$。\n\n> **注意。** 要令两角之和等于 $90^{\\circ}$；不要令两角相等，因为 $\\sin A = \\cos B$ 并不意味着 $A = B$。",
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
            `**Step 1: Add the angles.** A sine equals a cosine of acute angles exactly when the angles are complementary:\n\n$$(${first} + ${b}) + (${second} + ${d}) = 90$$\n\n**Step 2: Solve.** This is $${a + c}x + ${b + d} = 90$, so $${a + c}x = ${sum}$ and $x = ${x}$.\n\n**Check.** The angles are $${a * x + b}^{\\circ}$ and $${c * x + d}^{\\circ}$, both acute, and $${a * x + b} + ${c * x + d} = 90$.`,
            `**第一步：两角相加。**锐角的正弦等于余弦，当且仅当两角互余：\n\n$$(${first} + ${b}) + (${second} + ${d}) = 90$$\n\n**第二步：求解。**即 $${a + c}x + ${b + d} = 90$，所以 $${a + c}x = ${sum}$，$x = ${x}$。\n\n**检验。**两个角是 $${a * x + b}^{\\circ}$ 和 $${c * x + d}^{\\circ}$，都是锐角，且 $${a * x + b} + ${c * x + d} = 90$。`,
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
        "Knowing the sine of two acute angles gives their cosines through the Pythagorean identity. The sum formula then combines all four numbers, whatever the angles themselves are.\n\nFor $\\sin\\alpha = \\frac{3}{5}$ and $\\sin\\beta = \\frac{5}{13}$: $\\cos\\alpha = \\frac{4}{5}$ and $\\cos\\beta = \\frac{12}{13}$, so $\\sin(\\alpha + \\beta) = \\frac{3}{5} \\cdot \\frac{12}{13} + \\frac{4}{5} \\cdot \\frac{5}{13} = \\frac{56}{65}$. Check: $\\cos(\\alpha + \\beta) = \\frac{4}{5} \\cdot \\frac{12}{13} - \\frac{3}{5} \\cdot \\frac{5}{13} = \\frac{33}{65}$, and $56^{2} + 33^{2} = 3136 + 1089 = 4225 = 65^{2}$.\n\n> **Watch out.** $\\sin(\\alpha + \\beta)$ is not $\\sin\\alpha + \\sin\\beta$. And the angles are acute, so take the positive square roots for the cosines.",
        "知道两个锐角的正弦，由勾股恒等式得到余弦。和角公式再把这四个数合起来，不管这两个角本身是多少。\n\n对 $\\sin\\alpha = \\frac{3}{5}$，$\\sin\\beta = \\frac{5}{13}$：$\\cos\\alpha = \\frac{4}{5}$，$\\cos\\beta = \\frac{12}{13}$，所以 $\\sin(\\alpha + \\beta) = \\frac{3}{5} \\cdot \\frac{12}{13} + \\frac{4}{5} \\cdot \\frac{5}{13} = \\frac{56}{65}$。检验：$\\cos(\\alpha + \\beta) = \\frac{4}{5} \\cdot \\frac{12}{13} - \\frac{3}{5} \\cdot \\frac{5}{13} = \\frac{33}{65}$，而 $56^{2} + 33^{2} = 3136 + 1089 = 4225 = 65^{2}$。\n\n> **注意。** $\\sin(\\alpha + \\beta)$ 不等于 $\\sin\\alpha + \\sin\\beta$。两个角是锐角，所以余弦取正的平方根。",
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
          (() => {
            const op = minus ? "-" : "+";
            const other = minus ? b * q + a * p : b * q - a * p;
            const sq = (n: number) => (n < 0 ? `(${n})^{2}` : `${n}^{2}`);
            const value = Q.of(top, c * r).toLatex();
            const lines = `$$\\sin(\\alpha ${op} \\beta) = \\sin\\alpha\\cos\\beta ${op} \\cos\\alpha\\sin\\beta = ${frac(a, c)} \\cdot ${frac(q, r)} ${op} ${frac(b, c)} \\cdot ${frac(p, r)} = ${frac(`${a * q} ${op} ${b * p}`, c * r)} = ${value}$$`;
            const cosines = `$$\\cos\\alpha = \\sqrt{1 - ${frac(a * a, c * c)}} = ${frac(b, c)}, \\quad \\cos\\beta = \\sqrt{1 - ${frac(p * p, r * r)}} = ${frac(q, r)}$$`;
            const square = `${sq(top)} + ${sq(other)} = ${top * top} + ${other * other} = ${c * r * c * r} = ${c * r}^{2}`;
            return [
              `**Step 1: Find the cosines.** Both angles are acute, so their cosines are positive:\n\n${cosines}\n\n**Step 2: Use the ${minus ? "difference" : "sum"} formula.**\n\n${lines}\n\n**Check.** The same numbers give $\\cos(\\alpha ${op} \\beta) = ${Q.of(other, c * r).toLatex()}$, and $${square}$, so the sine and cosine of $\\alpha ${op} \\beta$ satisfy $\\sin^{2} + \\cos^{2} = 1$.`,
              `**第一步：求余弦。**两个角都是锐角，所以余弦为正：\n\n${cosines}\n\n**第二步：用${minus ? "差角" : "和角"}公式。**\n\n${lines}\n\n**检验。**用同样的数得 $\\cos(\\alpha ${op} \\beta) = ${Q.of(other, c * r).toLatex()}$，而 $${square}$，所以 $\\alpha ${op} \\beta$ 的正弦和余弦满足 $\\sin^{2} + \\cos^{2} = 1$。`,
            ] as const;
          })(),
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
