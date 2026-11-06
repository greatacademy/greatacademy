// Drawings of the explanations of Number Theory: staircases, lattice points, triples, tilings and curves.

import type { Figure } from "@ga/content";
import type { Mark, Point } from "@ga/subject-math";
import { pane } from "./explanation-drawings-calculus-kit.ts";
import { drawing, note, seg } from "./explanation-drawings-kit.ts";
import { tiling } from "./explanation-drawings-structures-kit.ts";

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

// The staircase of the prime counting function up to x, as points.
const stairs = (x: number): Point[] => {
  const out: Point[] = [[0, 0]];
  let n = 0;
  for (const p of PRIMES.filter((q) => q <= x)) {
    out.push([p, n]);
    n++;
    out.push([p, n]);
  }
  out.push([x, n]);
  return out;
};

const circle = (r: number): Point[] =>
  Array.from({ length: 145 }, (_, i): Point => [r * Math.cos((i * Math.PI) / 72), r * Math.sin((i * Math.PI) / 72)]);

const binomial = (n: number, k: number): number => (k === 0 ? 1 : (binomial(n, k - 1) * (n - k + 1)) / k);

// The real root of x³ − x + 1, where the curve y² = x³ − x + 1 meets the x-axis.
const ROOT = -1.3247179572;
const curve = (t: number): number => Math.sqrt(Math.max(0, t * t * t - t + 1));
const branch = Array.from({ length: 61 }, (_, i): Point => {
  const t = ROOT + (2 - ROOT) * (i / 60) * (i / 60);
  return [t, curve(t)];
});

/** numberTheoryDrawings1 draws the explanations of Number Theory, by knowledge point. */
export const numberTheoryDrawings1: Readonly<Record<string, Figure>> = {
  "the-distribution-of-primes#the-prime-counting-function": (() => {
    const p = pane(0, [0, 12, 1], [0, 6, 1], 7.2, 4, "x", "π").path(stairs(12), "result");
    for (const [i, q] of [2, 3, 5, 7, 11].entries()) p.dot(q, i + 1, undefined, "n", "result");
    return drawing(
      p.say(11.4, 5.2, "π(12) = 5", "n").marks(),
      "For example, the staircase up to x = 12. It rises by one at each of the primes 2, 3, 5, 7 and 11, and stays level between them. There is no step at 1, which is not prime, and the first step is at 2. So π(12) = 5.",
      "例如，到 x = 12 为止的阶梯。它在素数 2、3、5、7、11 处各上升一，在它们之间保持水平。1 不是素数，所以那里没有台阶，第一个台阶在 2。所以 π(12) = 5。",
    );
  })(),
  "the-distribution-of-primes#primes-in-a-range-from-the-graph-of-the-counting-function": drawing(
    pane(0, [0, 30, 5], [0, 12, 2], 7.2, 4.4, "x", "π")
      .path(stairs(30), "result")
      .path(
        [
          [10, 4],
          [30, 4],
        ],
        undefined,
        true,
      )
      .path(
        [
          [30, 4],
          [30, 10],
        ],
        "action",
        true,
      )
      .dot(10, 4, "(10, 4)", "nw")
      .dot(30, 10, "(30, 10)", "n")
      .say(27, 6.2, "10 − 4 = 6", "w")
      .marks(),
    "For example, a = 10 and b = 30. The graph has heights π(10) = 4 and π(30) = 10, so there are 10 − 4 = 6 primes with 10 < p ≤ 30. They are the 6 steps between the two marked points: 11, 13, 17, 19, 23 and 29.",
    "例如，a = 10，b = 30。图像的高度为 π(10) = 4，π(30) = 10，所以满足 10 < p ≤ 30 的素数有 10 − 4 = 6 个。它们就是两个标出的点之间的 6 个台阶：11、13、17、19、23、29。",
  ),
  "sums-of-two-squares#the-sum-of-two-squares-on-a-circle": (() => {
    const p = pane(0, [-4, 4, 1], [-4, 4, 1], 5.4, 5.4).path(circle(Math.sqrt(13)));
    for (const [a, b] of [
      [3, 2],
      [-2, 3],
      [-3, 2],
      [-3, -2],
      [-2, -3],
      [2, -3],
      [3, -2],
    ] as const)
      p.dot(a, b, undefined, "n", "action");
    return drawing(
      p.dot(2, 3, "(2, 3)", "ne", "result").say(0, -4.6, "2² + 3² = 13", "s").marks(),
      "For example, the circle of radius √13 around the origin passes through the lattice point (2, 3), since 2² + 3² = 13. So the circle stands for 13. Changing signs and swapping the coordinates gives the 8 points marked, all with the same sum.",
      "例如，以原点为心、半径 √13 的圆经过格点 (2, 3)，因为 2² + 3² = 13。所以这个圆代表 13。改变符号和交换坐标得到图中标出的 8 个点，它们的和都相同。",
    );
  })(),
  "pythagorean-triples#the-area-of-a-pythagorean-triangle": drawing(
    [
      {
        kind: "shade",
        points: [
          [0, 0],
          [3, 0],
          [3, 4],
        ],
        tone: "result",
      },
      {
        kind: "polygon",
        points: [
          [0, 0],
          [3, 0],
          [3, 4],
        ],
      },
      seg([2.7, 0], [2.7, 0.3]),
      seg([2.7, 0.3], [3, 0.3]),
      note([1.5, 0], "m² − n² = 3", "s"),
      note([3, 2], "2mn = 4", "e"),
      note([1.4, 2.1], "m² + n² = 5", "nw"),
      note([1.5, -0.8], "(3 · 4)/2 = 2 · 1 · (4 − 1) = 6", "s"),
    ],
    "For example, m = 2 and n = 1 give the right triangle with sides 3, 4 and 5. Its area is (3 · 4)/2 = 6, and the formula mn(m² − n²) = 2 · 1 · (4 − 1) gives the same 6 without computing the sides.",
    "例如，m = 2，n = 1 给出边长为 3、4、5 的直角三角形。它的面积是 (3 · 4)/2 = 6，公式 mn(m² − n²) = 2 · 1 · (4 − 1) 不用先算边长就得到同样的 6。",
  ),
  "pythagorean-triples#a-pythagorean-triple-from-a-line-through-the-circle": drawing(
    pane(0, [-2, 2, 1], [-2, 2, 1], 5.6, 5.6)
      .path(circle(1))
      .path(
        [
          [-1.6, -0.3],
          [1.6, 1.3],
        ],
        "action",
      )
      .dot(-1, 0, "(−1, 0)", "nw", "action")
      .dot(0.6, 0.8, undefined, "n", "result")
      .say(1.05, 0.5, "(3/5, 4/5)", "e")
      .say(1.3, 1.25, "t = 1/2", "n")
      .say(0, -2.2, "3² + 4² = 5²", "s")
      .marks(),
    "For example, the line through (−1, 0) with slope t = 1/2, so p = 1 and q = 2. It meets the unit circle again at ((4 − 1)/(4 + 1), 2 · 1 · 2/(4 + 1)) = (3/5, 4/5). Clearing denominators gives the triple 3, 4, 5.",
    "例如，过 (−1, 0)、斜率 t = 1/2 的直线，所以 p = 1，q = 2。它再次与单位圆相交于 ((4 − 1)/(4 + 1), 2 · 1 · 2/(4 + 1)) = (3/5, 4/5)。去分母得到勾股数 3、4、5。",
  ),
  "continued-fractions#a-continued-fraction-from-squares": drawing(
    [...tiling(30, 13, 0.27, 4), note([4.05, -0.1], "30/13 = [2; 3, 4]", "s")],
    "For example, a 30 by 13 rectangle. It holds 2 squares of side 13, then 3 of side 4, then 4 of side 1, the smallest ones, too small to number. So 30/13 = [2; 3, 4], and the first entry 2 is the whole part of 30/13.",
    "例如，30 乘 13 的矩形。它放下 2 个边长 13 的正方形，然后 3 个边长 4 的，再然后 4 个边长 1 的，最后这些太小，没有标数。所以 30/13 = [2; 3, 4]，第一项 2 是 30/13 的整数部分。",
  ),
  "lucas-theorem#odd-entries-of-a-row": (() => {
    const out: Mark[] = [];
    for (let n = 0; n <= 7; n++) {
      for (let k = 0; k <= n; k++) {
        const value = binomial(n, k);
        const [x, y] = [(k - n / 2) * 0.85, -n * 0.72];
        if (value % 2 === 1) {
          out.push({
            kind: "shade",
            points: [
              [x - 0.3, y - 0.26],
              [x + 0.3, y - 0.26],
              [x + 0.3, y + 0.26],
              [x - 0.3, y + 0.26],
            ],
            tone: n === 5 ? "result" : "action",
          });
        }
        out.push(note([x, y - 0.17], String(value), "n"));
      }
    }
    out.push(note([2.2, -0.7], "5 = 101₂", "e"), note([2.2, -1.5], "s = 2,  2² = 4", "e"));
    return drawing(
      out,
      "Rows 0 to 7 of Pascal's triangle with the odd entries shaded. For example, row 5 has the entries 1, 5, 10, 10, 5, 1. Since 5 = 101₂ has s = 2 ones, it has 2² = 4 odd entries, the highlighted 1, 5, 5 and 1.",
      "帕斯卡三角形的第 0 到 7 行，奇数项有阴影。例如，第 5 行的项为 1、5、10、10、5、1。因为 5 = 101₂ 有 s = 2 个一，所以它有 2² = 4 个奇数项，即突出显示的 1、5、5、1。",
    );
  })(),
  "the-sum-of-squares-function#lattice-points-on-a-drawn-circle": (() => {
    const p = pane(0, [-6, 6, 2], [-6, 6, 2], 5.6, 5.6).path(circle(5));
    for (const [a, b] of [
      [5, 0],
      [-5, 0],
      [0, 5],
      [0, -5],
    ] as const)
      p.dot(a, b, undefined, "n", "action");
    for (const [a, b] of [
      [3, 4],
      [-3, 4],
      [3, -4],
      [-3, -4],
      [4, 3],
      [-4, 3],
      [4, -3],
      [-4, -3],
    ] as const)
      p.dot(a, b, undefined, "n", "result");
    return drawing(
      p.say(3, 4.6, "(3, 4)", "ne").say(0, -6.8, "r₂(25) = 4 + 8 = 12", "s").marks(),
      "For example, n = 25, the circle of radius 5. It passes through the 4 points (±5, 0) and (0, ±5), and through the 8 points (±3, ±4) and (±4, ±3), all marked. So r₂(25) = 4 + 8 = 12.",
      "例如，n = 25，半径为 5 的圆。它经过 (±5, 0) 和 (0, ±5) 这 4 个点，还经过 (±3, ±4) 和 (±4, ±3) 这 8 个点，都已标出。所以 r₂(25) = 4 + 8 = 12。",
    );
  })(),
  "adding-points-on-an-elliptic-curve#adding-two-different-points": drawing(
    pane(0, [-2, 2, 1], [-3, 3, 1], 5.6, 6)
      .path(branch, "result")
      .path(
        branch.map(([x, y]): Point => [x, -y]),
        "result",
      )
      .path(
        [
          [-2, 1],
          [2, 1],
        ],
        "action",
      )
      .path(
        [
          [-1, 1],
          [-1, -1],
        ],
        undefined,
        true,
      )
      .dot(0, 1, "P", "ne")
      .dot(1, 1, "Q", "n")
      .dot(-1, 1, "(−1, 1)", "nw")
      .dot(-1, -1, "(−1, −1)", "sw", "result")
      .say(0.1, -3.3, "x₃ = 0² − 0 − 1 = −1", "s")
      .say(0.1, -4, "y₃ = 0 · (0 + 1) − 1 = −1", "s")
      .marks(),
    "For example, y² = x³ − x + 1 with P = (0, 1) and Q = (1, 1), so the line through them has slope m = 0. It meets the curve at a third point, (−1, 1). Reflecting that point, along the dashed line, gives the sum (−1, −1), the same as x₃ = 0² − 0 − 1 = −1 and y₃ = 0 · (0 + 1) − 1 = −1.",
    "例如，y² = x³ − x + 1，P = (0, 1)，Q = (1, 1)，所以过它们的直线斜率 m = 0。它与曲线交于第三点 (−1, 1)。沿虚线反射这个点得到和 (−1, −1)，与 x₃ = 0² − 0 − 1 = −1 和 y₃ = 0 · (0 + 1) − 1 = −1 一致。",
  ),
};
