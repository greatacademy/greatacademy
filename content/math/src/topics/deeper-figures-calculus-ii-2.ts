// More knowledge points of Calculus II that ask the learner to read a drawing: improper areas, solids over a drawn base,
// velocity graphs, parametric and polar curves, sequences, series compared with areas, error bounds and Euler's method.
// See `deeperFiguresCalculusIi2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { bars, chart, curvePath, intTicks, type Scale, shadeUnder } from "./figure-charts.ts";
import { drawn } from "./figure-reading-more.ts";

/** figureOf pairs a drawing with its description in both languages. */
const figureOf = (svg: string, [en, zh]: Pair) => ({ svg, alt: t(en, zh) });

/** mark draws a dot at a point of a chart. */
const mark = (x: Scale, y: Scale, a: number, b: number) => `<circle cx="${x(a)}" cy="${y(b)}" r="3" fill="currentColor" stroke="none"/>`;

/** arc lists points of a circle between two angles. */
const arc = (cx: number, cy: number, r: number, from: number, to: number): Point[] =>
  Array.from({ length: 73 }, (_, i): Point => {
    const a = from + ((to - from) * i) / 72;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

const improperFirst = point(
  "the-area-of-an-unbounded-tail-from-a-drawing",
  ["The area of an unbounded tail, from a drawing", "由图求无界尾部的面积"],
  [
    "The area under $y = \\frac{c}{x^2}$ from $x = a$ onward is an improper integral. It is the limit of $\\int_a^b \\frac{c}{x^2}\\,dx = \\frac{c}{a} - \\frac{c}{b}$ as $b \\to \\infty$, which is $\\frac{c}{a}$.",
    "$y = \\frac{c}{x^2}$ 在 $x = a$ 右侧的面积是反常积分。它是 $\\int_a^b \\frac{c}{x^2}\\,dx = \\frac{c}{a} - \\frac{c}{b}$ 当 $b \\to \\infty$ 时的极限，即 $\\frac{c}{a}$。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const a = rng.int(2, 5);
    const f = (v: number) => c / (v * v);
    const svg = chart(
      [0, 8],
      [0, c * 1.15],
      intTicks(0, 8),
      [[c, String(c)]],
      (x, y) => shadeUnder(f, a, 8, x, y) + curvePath(f, 1, 8, x, y) + mark(x, y, 1, c),
    );
    return ask(
      [
        "The curve has the form $y = \\frac{c}{x^2}$ and passes through the marked point. The shading continues to the right without end. Find the shaded area.",
        "曲线的形式为 $y = \\frac{c}{x^2}$，并过标记点。阴影向右无限延伸。求阴影面积。",
      ],
      Q.of(c, a),
      [Q.of(c, a * a), c, Q.of(2 * c, a), c * a, Q.of(c, a + 1)],
      [
        `The marked point gives $c = ${c}$, and the shading starts at $a = ${a}$. The area is $\\int_{${a}}^{\\infty} \\frac{${c}}{x^2}\\,dx = \\frac{${c}}{${a}}$.`,
        `由标记点得 $c = ${c}$，阴影从 $a = ${a}$ 开始。面积为 $\\int_{${a}}^{\\infty} \\frac{${c}}{x^2}\\,dx = \\frac{${c}}{${a}}$。`,
      ],
      figureOf(svg, [
        `The curve through (1, ${c}), shaded below it from x = ${a} onward.`,
        `过 (1, ${c}) 的曲线，x = ${a} 右侧的曲线下方有阴影。`,
      ]),
    );
  },
);

const improperSecond = point(
  "the-area-of-an-unbounded-spike-from-a-drawing",
  ["The area of an unbounded spike, from a drawing", "由图求无界尖峰的面积"],
  [
    "The curve $y = \\frac{c}{\\sqrt{x}}$ rises without bound at $x = 0$, yet the area under it is finite: $\\int_0^b \\frac{c}{\\sqrt{x}}\\,dx$ is the limit of $2c\\sqrt{b} - 2c\\sqrt{s}$ as $s \\to 0^+$, which is $2c\\sqrt{b}$.",
    "曲线 $y = \\frac{c}{\\sqrt{x}}$ 在 $x = 0$ 处无界上升，但它下方的面积有限：$\\int_0^b \\frac{c}{\\sqrt{x}}\\,dx$ 是 $2c\\sqrt{b} - 2c\\sqrt{s}$ 当 $s \\to 0^+$ 时的极限，即 $2c\\sqrt{b}$。",
  ],
  (rng) => {
    const c = rng.int(1, 9);
    const root = rng.int(1, 3);
    const b = root * root;
    const top = 3 * c;
    const f = (v: number) => Math.min(top, c / Math.sqrt(Math.max(v, 1e-6)));
    const start = (c / top) ** 2;
    const svg = chart(
      [0, 10],
      [0, top],
      intTicks(0, 10),
      [[c, String(c)]],
      (x, y) => shadeUnder(f, 0, b, x, y) + curvePath(f, start, 10, x, y) + mark(x, y, 1, c),
    );
    return ask(
      [
        "The curve has the form $y = \\frac{c}{\\sqrt{x}}$ and passes through the marked point. It rises without bound at $x = 0$. Find the shaded area.",
        "曲线的形式为 $y = \\frac{c}{\\sqrt{x}}$，并过标记点。它在 $x = 0$ 处无界上升。求阴影面积。",
      ],
      2 * c * root,
      [c * root, 2 * c * b, c * b, 2 * c, 2 * c + root],
      [
        `The marked point gives $c = ${c}$, and the shading ends at $x = ${b}$. The area is $2c\\sqrt{${b}} = 2(${c})(${root}) = ${2 * c * root}$.`,
        `由标记点得 $c = ${c}$，阴影到 $x = ${b}$ 结束。面积为 $2c\\sqrt{${b}} = 2(${c})(${root}) = ${2 * c * root}$。`,
      ],
      figureOf(svg, [
        `The curve through (1, ${c}), shaded below it from x = 0 to x = ${b}.`,
        `过 (1, ${c}) 的曲线，从 x = 0 到 x = ${b} 的曲线下方有阴影。`,
      ]),
    );
  },
);

const arcOfLine = point(
  "arc-length-of-a-drawn-segment-by-the-integral",
  ["Arc length of a drawn segment, by the integral", "用积分求所画线段的弧长"],
  [
    "The arc length of $y = f(x)$ is $\\int_a^b \\sqrt{1 + f'(x)^2}\\,dx$. For a straight segment, $f'$ is the constant slope, so the integral is $\\sqrt{1 + m^2}$ times the horizontal run.",
    "$y = f(x)$ 的弧长为 $\\int_a^b \\sqrt{1 + f'(x)^2}\\,dx$。对直线段，$f'$ 是常数斜率，所以积分等于 $\\sqrt{1 + m^2}$ 乘水平长度。",
  ],
  (rng) => {
    const k = rng.int(1, 2);
    const [run, rise, hyp] = rng.pick<[number, number, number]>([
      [3, 4, 5],
      [4, 3, 5],
    ]);
    const dx = run * k;
    const dy = rise * k * (rng.bool() ? 1 : -1);
    const x0 = rng.int(0, 10 - dx);
    const y0 = dy > 0 ? rng.int(0, 10 - dy) : rng.int(-dy, 10);
    const m = Q.of(dy, dx);
    const end: Point = [x0 + dx, y0 + dy];
    return ask(
      [
        "The graph of $y = f(x)$ is the segment between the two marked points. Evaluate $\\int \\sqrt{1 + f'(x)^2}\\,dx$ over the interval it covers.",
        "$y = f(x)$ 的图像是两个标记点之间的线段。在它覆盖的区间上计算 $\\int \\sqrt{1 + f'(x)^2}\\,dx$。",
      ],
      hyp * k,
      [(run + rise) * k, dx, Math.abs(dy), hyp, hyp * k * k],
      [
        `The slope is $f' = ${m.toLatex()}$, so $\\sqrt{1 + f'^2} = \\frac{${hyp}}{${run}}$, and the run is $${dx}$. The integral is $\\frac{${hyp}}{${run}} \\cdot ${dx} = ${hyp * k}$.`,
        `斜率为 $f' = ${m.toLatex()}$，所以 $\\sqrt{1 + f'^2} = \\frac{${hyp}}{${run}}$，水平长度为 $${dx}$。积分为 $\\frac{${hyp}}{${run}} \\cdot ${dx} = ${hyp * k}$。`,
      ],
      drawn(
        { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
        [
          { kind: "segment", a: [x0, y0], b: end, accent: true },
          { kind: "point", at: [x0, y0] },
          { kind: "point", at: end },
        ],
        t(`A segment from (${x0}, ${y0}) to (${end[0]}, ${end[1]}).`, `从 (${x0}, ${y0}) 到 (${end[0]}, ${end[1]}) 的线段。`),
      ),
    );
  },
);

/** solidBase draws a right triangle in the plane, the base of a solid with cross sections perpendicular to the x-axis. */
function solidBase(a: number, b: number) {
  return drawn(
    { xMin: 0, xMax: 8, yMin: 0, yMax: 8 },
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [a, 0],
          [0, b],
        ],
      },
      { kind: "point", at: [a, 0] },
      { kind: "point", at: [0, b] },
    ],
    t(`A triangle with vertices (0, 0), (${a}, 0) and (0, ${b}).`, `顶点为 (0, 0)、(${a}, 0) 和 (0, ${b}) 的三角形。`),
  );
}

const squareSections = point(
  "square-cross-sections-over-a-drawn-base",
  ["Square cross sections over a drawn base", "所画底面上的正方形截面"],
  [
    "If the cross section at $x$ is a square whose side lies in the base, its area is $s(x)^2$, where $s(x)$ is the width of the base at $x$. The volume is $\\int s(x)^2\\,dx$.",
    "如果 $x$ 处的截面是边在底面上的正方形，它的面积是 $s(x)^2$，其中 $s(x)$ 是底面在 $x$ 处的宽度。体积为 $\\int s(x)^2\\,dx$。",
  ],
  (rng) => {
    const a = rng.int(1, 7);
    const b = rng.int(1, 7);
    return ask(
      [
        "The triangle is the base of a solid. Each cross section perpendicular to the $x$-axis is a square with one side in the base. Find the volume.",
        "三角形是一个立体的底面。垂直于 $x$ 轴的每个截面都是一边在底面上的正方形。求体积。",
      ],
      Q.of(a * b * b, 3),
      [a * b * b, Q.of(a * b * b, 2), Q.of(a * a * b, 3), Q.of(a * b, 2), Q.of(a * b * b, 6)],
      [
        `The width at $x$ is $s(x) = ${b}\\left(1 - \\frac{x}{${a}}\\right)$. Then $\\int_0^{${a}} s(x)^2\\,dx = \\frac{${a} \\cdot ${b}^2}{3} = ${Q.of(a * b * b, 3).toLatex()}$.`,
        `$x$ 处的宽度为 $s(x) = ${b}\\left(1 - \\frac{x}{${a}}\\right)$。于是 $\\int_0^{${a}} s(x)^2\\,dx = \\frac{${a} \\cdot ${b}^2}{3} = ${Q.of(a * b * b, 3).toLatex()}$。`,
      ],
      solidBase(a, b),
    );
  },
);

const triangleSections = point(
  "triangular-cross-sections-over-a-drawn-base",
  ["Triangular cross sections over a drawn base", "所画底面上的三角形截面"],
  [
    "If the cross section at $x$ is an isosceles right triangle with one leg in the base, its area is $\\frac{1}{2}s(x)^2$, where $s(x)$ is the width of the base at $x$. The volume is the integral of that area.",
    "如果 $x$ 处的截面是一条直角边在底面上的等腰直角三角形，它的面积是 $\\frac{1}{2}s(x)^2$，其中 $s(x)$ 是底面在 $x$ 处的宽度。体积是该面积的积分。",
  ],
  (rng) => {
    const a = rng.int(1, 7);
    const b = rng.int(1, 7);
    return ask(
      [
        "The triangle is the base of a solid. Each cross section perpendicular to the $x$-axis is an isosceles right triangle with one leg in the base. Find the volume.",
        "三角形是一个立体的底面。垂直于 $x$ 轴的每个截面都是一条直角边在底面上的等腰直角三角形。求体积。",
      ],
      Q.of(a * b * b, 6),
      [Q.of(a * b * b, 3), Q.of(a * b * b, 2), Q.of(a * a * b, 6), Q.of(a * b, 4), Q.of(a * b * b, 12)],
      [
        `The width at $x$ is $s(x) = ${b}\\left(1 - \\frac{x}{${a}}\\right)$. Then $\\int_0^{${a}} \\frac{1}{2}s(x)^2\\,dx = \\frac{1}{2} \\cdot \\frac{${a} \\cdot ${b}^2}{3} = ${Q.of(a * b * b, 6).toLatex()}$.`,
        `$x$ 处的宽度为 $s(x) = ${b}\\left(1 - \\frac{x}{${a}}\\right)$。于是 $\\int_0^{${a}} \\frac{1}{2}s(x)^2\\,dx = \\frac{1}{2} \\cdot \\frac{${a} \\cdot ${b}^2}{3} = ${Q.of(a * b * b, 6).toLatex()}$。`,
      ],
      solidBase(a, b),
    );
  },
);

const circleSections = point(
  "circular-cross-sections-over-a-drawn-base",
  ["Circular cross sections over a drawn base", "所画底面上的圆形截面"],
  [
    "If the cross section at $x$ is a disc whose diameter is the width $s(x)$ of the base, its area is $\\pi\\left(\\frac{s(x)}{2}\\right)^2 = \\frac{\\pi}{4}s(x)^2$. The volume is the integral of that area.",
    "如果 $x$ 处的截面是直径等于底面宽度 $s(x)$ 的圆，它的面积是 $\\pi\\left(\\frac{s(x)}{2}\\right)^2 = \\frac{\\pi}{4}s(x)^2$。体积是该面积的积分。",
  ],
  (rng) => {
    const a = rng.int(1, 7);
    const b = rng.int(1, 7);
    const answer = Q.of(a * b * b, 12);
    return ask(
      [
        "The triangle is the base of a solid. Each cross section perpendicular to the $x$-axis is a disc whose diameter lies in the base. Find the volume divided by $\\pi$.",
        "三角形是一个立体的底面。垂直于 $x$ 轴的每个截面都是直径在底面上的圆。求体积除以 $\\pi$。",
      ],
      answer,
      [Q.of(a * b * b, 3), Q.of(a * b * b, 6), Q.of(a * a * b, 12), Q.of(a * b * b, 4), Q.of(a * b * b, 24)],
      [
        `The diameter at $x$ is $s(x) = ${b}\\left(1 - \\frac{x}{${a}}\\right)$. Then $\\int_0^{${a}} \\frac{\\pi}{4}s(x)^2\\,dx = \\frac{\\pi}{4} \\cdot \\frac{${a} \\cdot ${b}^2}{3}$, and dividing by $\\pi$ gives $${answer.toLatex()}$.`,
        `$x$ 处的直径为 $s(x) = ${b}\\left(1 - \\frac{x}{${a}}\\right)$。于是 $\\int_0^{${a}} \\frac{\\pi}{4}s(x)^2\\,dx = \\frac{\\pi}{4} \\cdot \\frac{${a} \\cdot ${b}^2}{3}$，除以 $\\pi$ 得 $${answer.toLatex()}$。`,
      ],
      solidBase(a, b),
    );
  },
);

/** velocityGraph chooses a piecewise linear velocity on [0, 6] that changes sign, with its signed and total areas. */
function velocityGraph(rng: Rng) {
  let values: number[] = [];
  for (let tries = 0; tries < 200; tries++) {
    values = [0, 1, 2, 3].map(() => rng.int(-4, 4));
    const signs = values.filter((v) => v !== 0).map(Math.sign);
    const total = values.slice(1).reduce((n, v, i) => n + v + (values[i] as number), 0);
    if (new Set(signs).size === 2 && total !== 0) break;
  }
  let signed = Q.of(0, 1);
  let distance = Q.of(0, 1);
  const pieces: string[] = [];
  values.slice(1).forEach((b, i) => {
    const a = values[i] as number;
    signed = signed.add(Q.of(a + b, 1));
    const piece = a * b >= 0 ? Q.of(Math.abs(a + b), 1) : Q.of(a * a + b * b, Math.abs(a) + Math.abs(b));
    distance = distance.add(piece);
    pieces.push(piece.toLatex());
  });
  const points = values.map((v, i): Point => [2 * i, v]);
  const figure = drawn(
    { xMin: 0, xMax: 8, yMin: -5, yMax: 5, xName: "t", yName: "v" },
    [{ kind: "path", points, accent: true }],
    t(
      `A velocity graph made of straight pieces through ${points.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
      `由直线段组成的速度图，过 ${points.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
    ),
  );
  return { values, signed, distance, pieces, figure };
}

const displacementDrawn = point(
  "displacement-from-a-drawn-velocity-graph",
  ["Displacement from a drawn velocity graph", "由所画速度图求位移"],
  [
    "Displacement is $\\int v\\,dt$, the area between the velocity graph and the $t$-axis, where area below the axis counts as negative.",
    "位移是 $\\int v\\,dt$，即速度图与 $t$ 轴之间的面积，其中轴下方的面积记为负。",
  ],
  (rng) => {
    const { values, signed, distance, figure } = velocityGraph(rng);
    return ask(
      [
        "The graph shows the velocity of a particle. Find its displacement from $t = 0$ to $t = 6$.",
        "图中是质点的速度。求它从 $t = 0$ 到 $t = 6$ 的位移。",
      ],
      signed,
      [distance, signed.neg(), Q.of(values[3] as number, 1).sub(Q.of(values[0] as number, 1)), signed.add(Q.of(2, 1))],
      [
        `Each piece has width $2$, so its signed area is the sum of its end heights. The total is $${signed.toLatex()}$.`,
        `每段宽度为 $2$，所以它的有向面积等于两端高度之和。总和为 $${signed.toLatex()}$。`,
      ],
      figure,
    );
  },
);

const distanceDrawn = point(
  "total-distance-from-a-drawn-velocity-graph",
  ["Total distance from a drawn velocity graph", "由所画速度图求总路程"],
  [
    "Total distance is $\\int |v|\\,dt$: every area between the velocity graph and the $t$-axis counts as positive. A piece that crosses the axis splits into two triangles.",
    "总路程是 $\\int |v|\\,dt$：速度图与 $t$ 轴之间的每块面积都记为正。穿过轴的一段要分成两个三角形。",
  ],
  (rng) => {
    const { signed, distance, pieces, figure } = velocityGraph(rng);
    return ask(
      [
        "The graph shows the velocity of a particle. Find the total distance it travels from $t = 0$ to $t = 6$.",
        "图中是质点的速度。求它从 $t = 0$ 到 $t = 6$ 走过的总路程。",
      ],
      distance,
      [signed, signed.neg(), distance.mul(Q.of(2, 1)), distance.add(Q.of(1, 1))],
      [
        `The areas of the three pieces, all counted as positive, are $${pieces.join("$, $")}$. Their sum is $${distance.toLatex()}$.`,
        `三段的面积（都记为正）为 $${pieces.join("$、$")}$。它们的和为 $${distance.toLatex()}$。`,
      ],
      figure,
    );
  },
);

const positionDrawn = point(
  "a-later-position-from-a-drawn-velocity-graph",
  ["A later position from a drawn velocity graph", "由所画速度图求后来的位置"],
  [
    "Position at a later time is the starting position plus the signed area under the velocity graph up to that time: $s(T) = s(0) + \\int_0^T v\\,dt$.",
    "后来某时刻的位置等于起始位置加上到该时刻为止速度图下的有向面积：$s(T) = s(0) + \\int_0^T v\\,dt$。",
  ],
  (rng) => {
    const { values, figure } = velocityGraph(rng);
    const s0 = rng.int(-6, 6);
    const pieces = rng.int(1, 3);
    const end = 2 * pieces;
    const area = values.slice(1, pieces + 1).reduce((n, v, i) => n + v + (values[i] as number), 0);
    const answer = s0 + area;
    return ask(
      [
        `The graph shows the velocity of a particle with $s(0) = ${s0}$. Find $s(${end})$.`,
        `图中是质点的速度，$s(0) = ${s0}$。求 $s(${end})$。`,
      ],
      answer,
      [area, s0 - area, s0 + (values[pieces] as number), answer + 2, s0 + Math.abs(area) + 1],
      [
        `The signed area from $0$ to $${end}$ is $${area}$, so $s(${end}) = ${s0} + ${area < 0 ? `(${area})` : area} = ${answer}$.`,
        `从 $0$ 到 $${end}$ 的有向面积为 $${area}$，所以 $s(${end}) = ${s0} + ${area < 0 ? `(${area})` : area} = ${answer}$。`,
      ],
      figure,
    );
  },
);

const averageDrawn = point(
  "average-velocity-from-a-drawn-velocity-graph",
  ["Average velocity from a drawn velocity graph", "由所画速度图求平均速度"],
  [
    "The average value of $v$ on an interval is $\\frac{1}{b - a}\\int_a^b v\\,dt$: the signed area divided by the length of the interval. It is not the average of the end heights unless the graph is one straight piece.",
    "$v$ 在区间上的平均值为 $\\frac{1}{b - a}\\int_a^b v\\,dt$：有向面积除以区间长度。除非图像是一条直线段，否则它不等于两端高度的平均。",
  ],
  (rng) => {
    const { values, signed, distance, figure } = velocityGraph(rng);
    const answer = signed.div(Q.of(6, 1));
    return ask(
      [
        "The graph shows the velocity of a particle. Find its average velocity from $t = 0$ to $t = 6$.",
        "图中是质点的速度。求它从 $t = 0$ 到 $t = 6$ 的平均速度。",
      ],
      answer,
      [signed, distance.div(Q.of(6, 1)), Q.of((values[0] as number) + (values[3] as number), 2), signed.div(Q.of(3, 1))],
      [
        `The signed area is $${signed.toLatex()}$ and the interval has length $6$, so the average is $${answer.toLatex()}$.`,
        `有向面积为 $${signed.toLatex()}$，区间长度为 $6$，所以平均值为 $${answer.toLatex()}$。`,
      ],
      figure,
    );
  },
);

const ellipseView = { xMin: -11, xMax: 11, yMin: -11, yMax: 11, step: 1, labelEvery: 5 };

const parametricSlope = point(
  "the-slope-at-a-marked-point-of-a-drawn-parametric-curve",
  ["The slope at a marked point of a drawn parametric curve", "所画参数曲线上标记点处的斜率"],
  [
    "On $x = a\\cos t$, $y = b\\sin t$, the slope is $\\frac{dy}{dx} = \\frac{b\\cos t}{-a\\sin t}$. Read $a$ and $b$ from where the curve meets the axes, then get $\\cos t = \\frac{x}{a}$ and $\\sin t = \\frac{y}{b}$ from the marked point.",
    "在 $x = a\\cos t$，$y = b\\sin t$ 上，斜率为 $\\frac{dy}{dx} = \\frac{b\\cos t}{-a\\sin t}$。由曲线与坐标轴的交点读出 $a$、$b$，再由标记点得 $\\cos t = \\frac{x}{a}$，$\\sin t = \\frac{y}{b}$。",
  ],
  (rng) => {
    const a = rng.pick([5, 10]);
    const b = rng.pick([5, 10]);
    const [c, s] = rng.pick<[number, number]>([
      [3, 4],
      [4, 3],
    ]);
    const cs = c * rng.sign();
    const sn = s * rng.sign();
    const px = (a * cs) / 5;
    const py = (b * sn) / 5;
    const slope = Q.of(-b * cs, a * sn);
    return ask(
      [
        "The curve is traced by $x = a\\cos t$, $y = b\\sin t$ with positive $a$ and $b$. Find $\\frac{dy}{dx}$ at the marked point $P$.",
        "曲线由 $x = a\\cos t$，$y = b\\sin t$ 描出，$a$、$b$ 为正。求标记点 $P$ 处的 $\\frac{dy}{dx}$。",
      ],
      slope,
      [slope.neg(), Q.of(a * sn, b * cs), Q.of(-py, px), Q.of(py, px), Q.of(-a * cs, b * sn)],
      [
        `Here $a = ${a}$, $b = ${b}$, $\\cos t = ${Q.of(cs, 5).toLatex()}$ and $\\sin t = ${Q.of(sn, 5).toLatex()}$. So $\\frac{dy}{dx} = \\frac{b\\cos t}{-a\\sin t} = ${slope.toLatex()}$.`,
        `这里 $a = ${a}$，$b = ${b}$，$\\cos t = ${Q.of(cs, 5).toLatex()}$，$\\sin t = ${Q.of(sn, 5).toLatex()}$。所以 $\\frac{dy}{dx} = \\frac{b\\cos t}{-a\\sin t} = ${slope.toLatex()}$。`,
      ],
      drawn(
        ellipseView,
        [
          { kind: "path", points: arc(0, 0, 1, 0, 2 * Math.PI).map(([u, v]): Point => [a * u, b * v]), accent: true },
          { kind: "point", at: [px, py], label: "P", dir: px > 0 ? "ne" : "nw" },
        ],
        t(
          `An ellipse with semi-axes ${a} and ${b}, and the point P at (${px}, ${py}).`,
          `半轴为 ${a} 和 ${b} 的椭圆，点 P 位于 (${px}, ${py})。`,
        ),
      ),
    );
  },
);

const parametricArea = point(
  "the-area-inside-a-drawn-parametric-ellipse",
  ["The area inside a drawn parametric ellipse", "所画参数椭圆内的面积"],
  [
    "The area inside a closed parametric curve is $\\left|\\int y\\,\\frac{dx}{dt}\\,dt\\right|$ over one loop. For $x = a\\cos t$, $y = b\\sin t$, the integral is $ab\\int_0^{2\\pi}\\sin^2 t\\,dt = \\pi ab$. A circle is the special case $a = b$, which gives the familiar $\\pi r^2$.",
    "闭合参数曲线内的面积是一圈上的 $\\left|\\int y\\,\\frac{dx}{dt}\\,dt\\right|$。对 $x = a\\cos t$，$y = b\\sin t$，积分为 $ab\\int_0^{2\\pi}\\sin^2 t\\,dt = \\pi ab$。圆是 $a = b$ 的特例，得到熟悉的 $\\pi r^2$。",
  ],
  (rng) => {
    const a = rng.int(1, 7);
    const b = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => v !== a));
    return ask(
      [
        "The curve is traced once by $x = a\\cos t$, $y = b\\sin t$, for $0 \\le t \\le 2\\pi$, with positive $a$ and $b$. Find the area inside it divided by $\\pi$.",
        "曲线由 $x = a\\cos t$，$y = b\\sin t$（$0 \\le t \\le 2\\pi$）描出一圈，$a$、$b$ 为正。求它内部的面积除以 $\\pi$。",
      ],
      a * b,
      [a + b, 2 * a * b, 4 * a * b, a * a, b * b, Q.of(a * b, 2)],
      [
        `The curve meets the axes at $a = ${a}$ and $b = ${b}$. The area is $\\pi ab = ${a * b}\\pi$.`,
        `曲线与坐标轴的交点给出 $a = ${a}$，$b = ${b}$。面积为 $\\pi ab = ${a * b}\\pi$。`,
      ],
      drawn(
        { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
        [{ kind: "path", points: arc(0, 0, 1, 0, 2 * Math.PI).map(([u, v]): Point => [a * u, b * v]), accent: true }],
        t(`An ellipse with semi-axes ${a} and ${b}.`, `半轴为 ${a} 和 ${b} 的椭圆。`),
      ),
    );
  },
);

const parametricLength = point(
  "the-length-of-a-drawn-arc-traced-parametrically",
  ["The length of a drawn arc traced parametrically", "参数曲线所画圆弧的长度"],
  [
    "For a curve $x(t)$, $y(t)$, the length is $\\int \\sqrt{x'(t)^2 + y'(t)^2}\\,dt$. On $x = R\\cos t$, $y = R\\sin t$, the integrand is the constant $R$, so the length is $R$ times the range of $t$.",
    "对曲线 $x(t)$、$y(t)$，长度为 $\\int \\sqrt{x'(t)^2 + y'(t)^2}\\,dt$。在 $x = R\\cos t$，$y = R\\sin t$ 上，被积函数是常数 $R$，所以长度等于 $R$ 乘 $t$ 的范围。",
  ],
  (rng) => {
    const R = rng.int(1, 6);
    const start = rng.int(0, 3);
    const quarters = rng.int(1, 3);
    const span = Q.of(quarters, 2);
    const answer = Q.of(R * quarters, 2);
    const a0 = (start * Math.PI) / 2;
    const a1 = a0 + (quarters * Math.PI) / 2;
    return ask(
      [
        "The solid arc is the part traced counterclockwise by $x = R\\cos t$, $y = R\\sin t$ between the two marked points. Find its length divided by $\\pi$.",
        "实线弧是 $x = R\\cos t$，$y = R\\sin t$ 在两个标记点之间逆时针描出的部分。求它的长度除以 $\\pi$。",
      ],
      answer,
      [Q.of(R * quarters, 4), R * quarters, span, 2 * R, Q.of(R * R * quarters, 2)],
      [
        `The radius is $R = ${R}$, and the arc covers ${quarters} quarter${quarters > 1 ? "s" : ""} of a turn, so $t$ has range $${span.toLatex()}\\pi$. The length is $${R} \\cdot ${span.toLatex()}\\pi = ${answer.toLatex()}\\pi$.`,
        `半径 $R = ${R}$，弧占 ${quarters} 个四分之一圈，所以 $t$ 的范围为 $${span.toLatex()}\\pi$。长度为 $${R} \\cdot ${span.toLatex()}\\pi = ${answer.toLatex()}\\pi$。`,
      ],
      drawn(
        { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
        [
          { kind: "circle", center: [0, 0], r: R, dashed: true },
          { kind: "path", points: arc(0, 0, R, a0, a1), accent: true },
          { kind: "point", at: [Math.round(R * Math.cos(a0)), Math.round(R * Math.sin(a0))] },
          { kind: "point", at: [Math.round(R * Math.cos(a1)), Math.round(R * Math.sin(a1))] },
        ],
        t(
          `A circle of radius ${R} about the origin, with a solid arc of ${quarters} quarter turns.`,
          `以原点为圆心、半径为 ${R} 的圆，实线弧占 ${quarters} 个四分之一圈。`,
        ),
      ),
    );
  },
);

const polarLength = point(
  "the-length-of-a-drawn-polar-arc",
  ["The length of a drawn polar arc", "所画极坐标弧的长度"],
  [
    "A polar curve has length $\\int \\sqrt{r^2 + \\left(\\frac{dr}{d\\theta}\\right)^2}\\,d\\theta$. For $r = 2a\\cos\\theta$ or $r = 2a\\sin\\theta$, the integrand is the constant $2a$, so the length is $2a$ times the range of $\\theta$.",
    "极坐标曲线的长度为 $\\int \\sqrt{r^2 + \\left(\\frac{dr}{d\\theta}\\right)^2}\\,d\\theta$。对 $r = 2a\\cos\\theta$ 或 $r = 2a\\sin\\theta$，被积函数是常数 $2a$，所以长度等于 $2a$ 乘 $\\theta$ 的范围。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const cosine = rng.bool();
    const [from, to] = rng.pick<[number, number]>(
      cosine
        ? [
            [-2, 2],
            [0, 2],
            [1, 2],
          ]
        : [
            [0, 4],
            [0, 2],
            [0, 1],
          ],
    );
    const span = Q.of(to - from, 4);
    const answer = Q.of(2 * a * (to - from), 4);
    const angle = (q: number) =>
      q === 0
        ? "0"
        : Q.of(q, 4)
            .toLatex()
            .replace(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/, "$1\\frac{$2\\pi}{$3}")
            .replace("{1\\pi}", "{\\pi}")
            .replace(/^1$/, "\\pi");
    const range = `${angle(from)} \\le \\theta \\le ${angle(to)}`;
    const trace = (th: number): Point => {
      const r = 2 * a * (cosine ? Math.cos(th) : Math.sin(th));
      return [r * Math.cos(th), r * Math.sin(th)];
    };
    const points = Array.from({ length: 61 }, (_, i) => trace(((from + ((to - from) * i) / 60) * Math.PI) / 4));
    const name = cosine ? `r = ${2 * a}\\cos\\theta` : `r = ${2 * a}\\sin\\theta`;
    return ask(
      [
        `The solid part of the drawn circle is $${name}$ for $${range}$. Find its length divided by $\\pi$.`,
        `所画圆的实线部分是 $${name}$，$${range}$。求它的长度除以 $\\pi$。`,
      ],
      answer,
      [span, 2 * a, Q.of(a * (to - from), 8), Q.of(4 * a * (to - from), 4), Q.of(4 * a * a * (to - from), 4)],
      [
        `The integrand is $\\sqrt{r^2 + r'^2} = ${2 * a}$, and $\\theta$ has range $${span.toLatex()}\\pi$. The length is $${2 * a} \\cdot ${span.toLatex()}\\pi = ${answer.toLatex()}\\pi$.`,
        `被积函数为 $\\sqrt{r^2 + r'^2} = ${2 * a}$，$\\theta$ 的范围为 $${span.toLatex()}\\pi$。长度为 $${2 * a} \\cdot ${span.toLatex()}\\pi = ${answer.toLatex()}\\pi$。`,
      ],
      drawn(
        { xMin: -13, xMax: 13, yMin: -13, yMax: 13, step: 1, labelEvery: 2 },
        [
          { kind: "circle", center: cosine ? [a, 0] : [0, a], r: a, dashed: true },
          { kind: "path", points, accent: true },
        ],
        t(
          `A circle through the origin with its center at (${cosine ? a : 0}, ${cosine ? 0 : a}), with a solid arc for the given range.`,
          `过原点、圆心为 (${cosine ? a : 0}, ${cosine ? 0 : a}) 的圆，实线弧对应给定范围。`,
        ),
      ),
    );
  },
);

const roseArea = point(
  "the-area-of-a-drawn-rose",
  ["The area of a drawn rose", "所画玫瑰线的面积"],
  [
    "A polar region has area $\\int \\frac{1}{2}r^2\\,d\\theta$. One petal of $r = a\\cos(n\\theta)$ has area $\\frac{\\pi a^2}{4n}$. An odd $n$ gives $n$ petals, and an even $n$ gives $2n$ petals, so count the petals to find $n$.",
    "极坐标区域的面积为 $\\int \\frac{1}{2}r^2\\,d\\theta$。$r = a\\cos(n\\theta)$ 的一片花瓣面积为 $\\frac{\\pi a^2}{4n}$。$n$ 为奇数时有 $n$ 片花瓣，为偶数时有 $2n$ 片，所以数花瓣可以求 $n$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const n = rng.int(2, 5);
    const cosine = rng.bool();
    const petals = n % 2 === 0 ? 2 * n : n;
    const answer = Q.of(a * a * petals, 4 * n);
    const points = Array.from({ length: 481 }, (_, i): Point => {
      const th = (2 * Math.PI * i) / 480;
      const r = a * (cosine ? Math.cos(n * th) : Math.sin(n * th));
      return [r * Math.cos(th), r * Math.sin(th)];
    });
    return ask(
      [
        `The curve is a rose $r = a\\${cosine ? "cos" : "sin"}(n\\theta)$ with positive $a$ and whole number $n$. Find the area inside all its petals, divided by $\\pi$.`,
        `曲线是玫瑰线 $r = a\\${cosine ? "cos" : "sin"}(n\\theta)$，$a$ 为正，$n$ 为整数。求所有花瓣内的总面积除以 $\\pi$。`,
      ],
      answer,
      [Q.of(a * a, 4), Q.of(a * a, 2), a * a, Q.of(a * a * petals, 2 * n), Q.of(a * petals, 4 * n)],
      [
        `The petals reach distance $a = ${a}$, and there are $${petals}$ of them, so $n = ${n}$. The area is $${petals} \\cdot \\frac{\\pi \\cdot ${a}^2}{4 \\cdot ${n}} = ${answer.toLatex()}\\pi$.`,
        `花瓣长度为 $a = ${a}$，共有 $${petals}$ 片，所以 $n = ${n}$。面积为 $${petals} \\cdot \\frac{\\pi \\cdot ${a}^2}{4 \\cdot ${n}} = ${answer.toLatex()}\\pi$。`,
      ],
      drawn(
        { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
        [{ kind: "path", points, accent: true }],
        t(
          `A rose with ${petals} petals, each reaching distance ${a} from the origin.`,
          `有 ${petals} 片花瓣的玫瑰线，每片到原点的最远距离为 ${a}。`,
        ),
      ),
    );
  },
);

/** plotOf draws terms of a sequence as dots. */
const plotOf = (
  a: (n: number) => number,
  count: number,
  low: number,
  high: number,
  tick: readonly (readonly [number, string])[],
  extra = "",
) =>
  chart(
    [0, count + 1],
    [low, high],
    intTicks(0, count + 1, 2),
    tick,
    (x, y) => Array.from({ length: count }, (_, i) => mark(x, y, i + 1, a(i + 1))).join("") + extra,
  );

const sequenceLimit = point(
  "the-behaviour-of-a-drawn-sequence",
  ["The behaviour of a drawn sequence", "所画数列的行为"],
  [
    "A sequence converges to $L$ when its terms eventually stay as close to $L$ as you like, from one side or from both. Terms that keep jumping between two values, or that grow past every bound, have no limit.",
    "当数列的项最终可以任意接近 $L$（从一侧或两侧）时，数列收敛到 $L$。不断在两个值之间跳动或超过任何界限的项没有极限。",
  ],
  (rng) => {
    const L = rng.int(-3, 6);
    const c = rng.int(2, 6) * rng.sign();
    const kind = rng.pick(["above", "alternating", "jump", "growing"] as const);
    const a = (n: number) => {
      if (kind === "above") return L + c / n;
      if (kind === "alternating") return L + (Math.abs(c) * (-1) ** n) / n;
      if (kind === "jump") return L + (Math.abs(c) / 2) * (-1) ** n;
      return L + (c * n) / 4;
    };
    const values = Array.from({ length: 14 }, (_, i) => a(i + 1));
    const low = Math.min(...values, L) - 1;
    const high = Math.max(...values, L) + 1;
    const svg = plotOf(a, 14, low, high, intTicks(Math.ceil(low), Math.floor(high), Math.max(1, Math.ceil((high - low) / 8))));
    const converges = (v: number): Pair => same(`a_n \\to ${v}`);
    const none: Pair = ["It has no limit: the terms keep jumping", "没有极限：项不断跳动"];
    const grows: Pair = ["It has no limit: the terms grow without bound", "没有极限：项无界增长"];
    const correct = kind === "jump" ? none : kind === "growing" ? grows : converges(L);
    const why: Pair =
      kind === "jump"
        ? ["The terms keep jumping between two separate values, so they never settle.", "项不断在两个不同的值之间跳动，永远不会稳定。"]
        : kind === "growing"
          ? ["The terms move away by the same step each time, so they pass every bound.", "项每次都以相同步长远离，所以超过任何界限。"]
          : [`The gaps between the terms and $${L}$ shrink toward zero.`, `项与 $${L}$ 的差距趋于零。`];
    return choose(
      rng,
      [
        "The dots show the first terms of a sequence $a_n$, which continues in the same pattern. What happens as $n$ grows?",
        "这些点是数列 $a_n$ 的前几项，数列按同样的规律继续。当 $n$ 增大时会怎样？",
      ],
      correct,
      [none, grows, converges(L), converges(L + 2), converges(0), converges(L - 2)].filter((o) => o[0] !== correct[0]).slice(0, 4),
      why,
      figureOf(svg, [
        kind === "jump"
          ? "Dots that keep jumping between a high value and a low value."
          : kind === "growing"
            ? "Dots along a straight line that keeps moving away."
            : `Dots that close in on the height ${L}${kind === "alternating" ? " from both sides" : ""}.`,
        kind === "jump"
          ? "在一个高值和一个低值之间不断跳动的点。"
          : kind === "growing"
            ? "沿直线不断远离的点。"
            : `${kind === "alternating" ? "从两侧" : ""}逼近高度 ${L} 的点。`,
      ]),
    );
  },
);

const sequenceKind = point(
  "monotonic-and-bounded-from-a-drawing",
  ["Monotonic and bounded, from a drawing", "由图判断单调与有界"],
  [
    "A sequence is increasing when every term is at least the one before it, and decreasing when every term is at most the one before it. A monotonic sequence converges exactly when it is bounded.",
    "每一项都不小于前一项的数列是递增的，每一项都不大于前一项的数列是递减的。单调数列收敛当且仅当它有界。",
  ],
  (rng) => {
    const kind = rng.pick(["up-bounded", "down-bounded", "up-unbounded", "not"] as const);
    const L = rng.int(2, 8);
    const c = rng.int(2, 7);
    const a = (n: number) => {
      if (kind === "up-bounded") return L - c / n;
      if (kind === "down-bounded") return L + c / n;
      if (kind === "up-unbounded") return (L * n) / 5 + c / 3;
      return L + (c / 2) * Math.sin((n * 3) / 2 + c);
    };
    const values = Array.from({ length: 14 }, (_, i) => a(i + 1));
    const low = Math.min(...values) - 1;
    const high = Math.max(...values) + 1;
    const svg = plotOf(a, 14, low, high, intTicks(Math.ceil(low), Math.floor(high), Math.max(1, Math.ceil((high - low) / 8))));
    const names: Record<typeof kind, Pair> = {
      "up-bounded": ["Increasing and bounded, so it converges", "递增且有界，所以收敛"],
      "down-bounded": ["Decreasing and bounded, so it converges", "递减且有界，所以收敛"],
      "up-unbounded": ["Increasing and unbounded, so it diverges", "递增且无界，所以发散"],
      not: ["Not monotonic, so this test says nothing", "不单调，所以这个判别法不适用"],
    };
    const why: Record<typeof kind, Pair> = {
      "up-bounded": [
        "Each dot is higher than the last, and they stay below a fixed height.",
        "每个点都比前一个高，并且都低于某个固定高度。",
      ],
      "down-bounded": [
        "Each dot is lower than the last, and they stay above a fixed height.",
        "每个点都比前一个低，并且都高于某个固定高度。",
      ],
      "up-unbounded": [
        "Each dot is higher than the last by the same step, so they pass every height.",
        "每个点都比前一个高出相同步长，所以超过任何高度。",
      ],
      not: ["Some dots are higher than the one before and some are lower.", "有的点比前一个高，有的比前一个低。"],
    };
    const alts: Record<typeof kind, Pair> = {
      "up-bounded": ["Dots that rise more and more slowly and flatten out.", "上升越来越慢并趋平的点。"],
      "down-bounded": ["Dots that fall more and more slowly and flatten out.", "下降越来越慢并趋平的点。"],
      "up-unbounded": ["Dots that rise along a straight line.", "沿直线上升的点。"],
      not: ["Dots that go up and down in waves.", "呈波浪状上下起伏的点。"],
    };
    return choose(
      rng,
      [
        "The dots show the first terms of a sequence, which continues in the same pattern. Which description fits?",
        "这些点是一个数列的前几项，数列按同样的规律继续。哪个描述符合？",
      ],
      names[kind],
      (["up-bounded", "down-bounded", "up-unbounded", "not"] as const).filter((k) => k !== kind).map((k) => names[k]),
      why[kind],
      figureOf(svg, alts[kind]),
    );
  },
);

const geometricCases: readonly (readonly [number, number, number])[] = [
  ...[4, 8, 12, 16, 20, 24, 32, 40, 48, 64].map((a) => [a, 1, 2] as const),
  ...[9, 18, 27, 36, 45, 54, 81].map((a) => [a, 1, 3] as const),
  ...[16, 32, 48, 64, 80].map((a) => [a, 1, 4] as const),
  ...[9, 18, 27, 36, 54, 81].map((a) => [a, 2, 3] as const),
];

const geometricBars = point(
  "the-total-height-of-drawn-geometric-bars",
  ["The total height of drawn geometric bars", "所画等比条形的总高度"],
  [
    "When each bar is the same fraction $r$ of the one before it, the heights form a geometric series. Read the first height $a$ and the ratio $r$ from the first two bars, and the sum of all the bars is $\\frac{a}{1 - r}$.",
    "当每个条形都是前一个的相同比例 $r$ 时，高度构成等比级数。由前两个条形读出首项 $a$ 和公比 $r$，所有条形的和为 $\\frac{a}{1 - r}$。",
  ],
  (rng) => {
    const [a, rn, rd] = rng.pick(geometricCases);
    const r = Q.of(rn, rd);
    const second = (a * rn) / rd;
    const answer = Q.of(a * rd, rd - rn);
    const values = Array.from({ length: 7 }, (_, i) => a * (rn / rd) ** i);
    const svg = chart(
      [0, 7],
      [0, a * 1.1],
      intTicks(0, 7),
      [
        [a, String(a)],
        [second, String(second)],
      ],
      (x, y) => bars([0, 1, 2, 3, 4, 5, 6, 7], values, x, y),
    );
    return ask(
      [
        "Each bar is the same fraction of the bar before it, and the bars continue to the right without end. Find the sum of the heights of all the bars.",
        "每个条形都是前一个的相同比例，条形向右无限延续。求所有条形的高度之和。",
      ],
      answer,
      [a + second, Q.of(a * rd, rn), Q.of(second * rd, rd - rn), 2 * a, answer.mul(Q.of(2, 1))],
      [
        `The first bar is $a = ${a}$, and the next is $${second}$, so $r = ${r.toLatex()}$. The sum is $\\frac{${a}}{1 - ${r.toLatex()}} = ${answer.toLatex()}$.`,
        `第一个条形 $a = ${a}$，下一个为 $${second}$，所以 $r = ${r.toLatex()}$。和为 $\\frac{${a}}{1 - ${r.toLatex()}} = ${answer.toLatex()}$。`,
      ],
      figureOf(svg, [
        `Bars of decreasing height, the first ${a} and the second ${second}.`,
        `高度递减的条形，第一个为 ${a}，第二个为 ${second}。`,
      ]),
    );
  },
);

const integralComparison = point(
  "what-a-drawing-of-the-integral-test-shows",
  ["What a drawing of the integral test shows", "积分判别法的图说明了什么"],
  [
    "Rectangles of width one with heights $f(n)$ have total area equal to the series. If they sit under a curve whose improper integral is finite, the series converges. If they cover a curve whose improper integral is infinite, the series diverges. The other two arrangements prove nothing.",
    "宽度为一、高度为 $f(n)$ 的矩形总面积等于级数。如果它们位于反常积分有限的曲线下方，级数收敛。如果它们盖住反常积分无穷的曲线，级数发散。另外两种情况什么也证明不了。",
  ],
  (rng) => {
    const c = rng.int(1, 8);
    const convergent = rng.bool();
    const p = convergent ? rng.pick([2, 3]) : rng.pick([0.5, 1]);
    const f = (v: number) => c / v ** p;
    const start = convergent ? 2 : 1;
    const cuts = [1, 2, 3, 4, 5, 6, 7, 8];
    const values = cuts.slice(0, -1).map((_, i) => f(i + start));
    const svg = chart(
      [0, 8],
      [0, c * 1.15],
      intTicks(0, 8),
      [[c, String(c)]],
      (x, y) => bars(cuts, values, x, y) + curvePath(f, 1, 8, x, y, 'stroke="currentColor"'),
    );
    const base = p === 0.5 ? "\\sqrt{x}" : p === 1 ? "x" : `x^${p}`;
    const down: Pair = ["It converges: its area is below a finite area", "收敛：它的面积小于一个有限面积"];
    const up: Pair = ["It diverges: its area is above an infinite area", "发散：它的面积大于一个无穷面积"];
    const down2: Pair = ["It diverges: its area is below an infinite area", "发散：它的面积小于一个无穷面积"];
    const up2: Pair = ["It converges: its area is above a finite area", "收敛：它的面积大于一个有限面积"];
    return choose(
      rng,
      [
        `The curve is $y = \\frac{${c}}{${base}}$ for $x \\ge 1$, and the rectangles show the terms of a series with $f(n) = \\frac{${c}}{${base.replace("x", "n")}}$, starting at $n = ${start}$. The rectangles continue to the right. What does the drawing show?`,
        `曲线是 $y = \\frac{${c}}{${base}}$（$x \\ge 1$），矩形表示 $f(n) = \\frac{${c}}{${base.replace("x", "n")}}$ 从 $n = ${start}$ 开始的级数的项。矩形向右延续。这幅图说明了什么？`,
      ],
      convergent ? down : up,
      convergent ? [up, down2, up2] : [down, down2, up2],
      convergent
        ? [
            `The rectangles lie under the curve, and $\\int_1^\\infty y\\,dx$ is finite since the power of $x$ is above $1$.`,
            `矩形位于曲线下方，而 $x$ 的幂次大于 $1$，所以 $\\int_1^\\infty y\\,dx$ 有限。`,
          ]
        : [
            `The rectangles cover the curve, and $\\int_1^\\infty y\\,dx$ is infinite since the power of $x$ is at most $1$.`,
            `矩形盖住曲线，而 $x$ 的幂次不超过 $1$，所以 $\\int_1^\\infty y\\,dx$ 为无穷。`,
          ],
      figureOf(svg, [
        convergent
          ? "A decreasing curve with unit-width rectangles that lie under it."
          : "A decreasing curve with unit-width rectangles that rise above it.",
        convergent ? "递减曲线，宽度为一的矩形位于它下方。" : "递减曲线，宽度为一的矩形高出曲线。",
      ]),
    );
  },
);

const remainderDrawn = point(
  "a-remainder-bound-from-drawn-rectangles",
  ["A remainder bound from drawn rectangles", "由所画矩形得到余项界"],
  [
    "The rectangles for the terms after $n = N$ lie under the curve from $x = N$ onward. So for a decreasing positive $f$, the remainder satisfies $R_N \\le \\int_N^\\infty f(x)\\,dx$.",
    "$n = N$ 之后各项的矩形位于曲线从 $x = N$ 起的部分下方。所以对递减的正函数 $f$，余项满足 $R_N \\le \\int_N^\\infty f(x)\\,dx$。",
  ],
  (rng) => {
    const c = rng.int(1, 12);
    const N = rng.int(1, 5);
    const f = (v: number) => c / (v * v);
    const cuts = Array.from({ length: 9 - N }, (_, i) => N + i);
    const values = cuts.slice(1).map((v) => f(v));
    const top = f(Math.max(N, 1)) * 1.15;
    const svg = chart(
      [0, 9],
      [0, top],
      intTicks(0, 9),
      [],
      (x, y) => bars(cuts, values, x, y) + curvePath(f, N, 9, x, y, 'stroke="currentColor"') + mark(x, y, N, f(N)),
    );
    return ask(
      [
        `The curve is $y = \\frac{${c}}{x^2}$, and the rectangles show the terms $\\frac{${c}}{n^2}$ after the first $${N}$. They continue to the right without end. What upper bound does the drawing give for the sum of those terms?`,
        `曲线是 $y = \\frac{${c}}{x^2}$，矩形表示前 $${N}$ 项之后的各项 $\\frac{${c}}{n^2}$。它们向右无限延续。这幅图给出这些项之和的什么上界？`,
      ],
      Q.of(c, N),
      [Q.of(c, N + 1), Q.of(c, N * N), c * N, Q.of(2 * c, N), c],
      [
        `The rectangles lie under the curve from $x = ${N}$ onward, so the sum is at most $\\int_{${N}}^{\\infty} \\frac{${c}}{x^2}\\,dx = ${Q.of(c, N).toLatex()}$.`,
        `矩形位于曲线从 $x = ${N}$ 起的部分下方，所以和不超过 $\\int_{${N}}^{\\infty} \\frac{${c}}{x^2}\\,dx = ${Q.of(c, N).toLatex()}$。`,
      ],
      figureOf(svg, [
        `A decreasing curve starting from x = ${N}, with unit-width rectangles under it.`,
        `从 x = ${N} 开始的递减曲线，宽度为一的矩形位于它下方。`,
      ]),
    );
  },
);

const lagrangeDrawn = point(
  "a-taylor-error-bound-from-a-drawn-derivative",
  ["A Taylor error bound from a drawn derivative", "由所画导数求泰勒误差界"],
  [
    "The Lagrange bound is $|R_n(x)| \\le \\frac{M|x - a|^{n+1}}{(n+1)!}$, where $M$ is the largest size of $f^{(n+1)}$ between $a$ and $x$. Only that interval counts: bigger values elsewhere on the graph do not matter.",
    "拉格朗日界为 $|R_n(x)| \\le \\frac{M|x - a|^{n+1}}{(n+1)!}$，其中 $M$ 是 $f^{(n+1)}$ 在 $a$ 与 $x$ 之间的最大绝对值。只有这个区间才算：图上其他地方更大的值无关紧要。",
  ],
  (rng) => {
    const order = rng.pick([2, 3]);
    const h = rng.int(1, 4);
    const inner: number[] = Array.from({ length: h + 1 }, () => rng.int(-4, 4));
    if (!inner.some(Boolean)) inner[0] = 2;
    const M = Math.max(...inner.map(Math.abs));
    const outer = Math.min(6, M + rng.int(1, 3));
    const values = [...inner, ...(h < 6 ? [outer] : [])];
    const fact = order === 2 ? 2 : 6;
    const answer = Q.of(M * h ** order, fact);
    const n = order - 1;
    const name = order === 2 ? "f''" : "f'''";
    const points = values.map((v, i): Point => [i, v]);
    return ask(
      [
        `The graph shows $${name}$. Let $T_{${n}}$ be the degree $${n}$ Taylor polynomial of $f$ at $0$. Use the Lagrange bound to give an upper bound for $|f(${h}) - T_{${n}}(${h})|$, using the largest size of $${name}$ on $[0, ${h}]$.`,
        `图中是 $${name}$。设 $T_{${n}}$ 是 $f$ 在 $0$ 处的 $${n}$ 次泰勒多项式。用 $${name}$ 在 $[0, ${h}]$ 上的最大绝对值，由拉格朗日界给出 $|f(${h}) - T_{${n}}(${h})|$ 的上界。`,
      ],
      answer,
      [
        Q.of(outer * h ** order, fact),
        M * h ** order,
        Q.of(M * h ** (order - 1), order - 1),
        Q.of(M * h ** order, fact * 2),
        Q.of(M * h, fact),
      ],
      [
        `On $[0, ${h}]$ the largest size of $${name}$ is $M = ${M}$. The bound is $\\frac{${M} \\cdot ${h}^{${order}}}{${order}!} = ${answer.toLatex()}$.`,
        `在 $[0, ${h}]$ 上 $${name}$ 的最大绝对值为 $M = ${M}$。上界为 $\\frac{${M} \\cdot ${h}^{${order}}}{${order}!} = ${answer.toLatex()}$。`,
      ],
      {
        svg: chart([0, 6], [-5, 7], intTicks(0, 6), intTicks(-5, 7), (x, y) => {
          const line = points.map(([u, v]) => `${x(u)},${y(v)}`).join(" ");
          return `<line stroke="currentColor" stroke-dasharray="5 4" x1="${x(0)}" y1="${y(0)}" x2="${x(6)}" y2="${y(0)}"/><polyline class="accent" stroke="currentColor" fill="none" points="${line}"/>`;
        }),
        alt: t(
          `A graph of straight pieces through ${points.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
          `由直线段组成的图像，过 ${points.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
        ),
      },
    );
  },
);

const eulerField = point(
  "two-euler-steps-on-a-drawn-direction-field",
  ["Two Euler steps on a drawn direction field", "在所画方向场上走两步欧拉法"],
  [
    "Euler's method follows the direction field in straight steps: from $(x_k, y_k)$, the next point is $(x_k + h, y_k + h\\,f(x_k, y_k))$. The slope is read again at every new point.",
    "欧拉法沿方向场走直线步：从 $(x_k, y_k)$ 出发，下一点是 $(x_k + h, y_k + h\\,f(x_k, y_k))$。每到新点都要重新求斜率。",
  ],
  (rng) => {
    const [a, b] = rng.pick<[number, number]>([
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [2, -1],
      [-1, -1],
    ]);
    const x0 = rng.int(-2, 1);
    const y0 = rng.int(-2, 2);
    const h = rng.pick([1, 1, 2]);
    const f = (x: number, y: number) => a * x + b * y;
    const s0 = f(x0, y0);
    const x1 = x0 + h;
    const y1 = y0 + h * s0;
    const s1 = f(x1, y1);
    const answer = y1 + h * s1;
    const marks: PlaneMark[] = [];
    for (let x = -5; x <= 5; x++)
      for (let y = -5; y <= 5; y++) {
        const s = f(x, y);
        const size = 0.32 / Math.sqrt(1 + s * s);
        marks.push({ kind: "segment", a: [x - size, y - s * size], b: [x + size, y + s * size] });
      }
    marks.push({ kind: "point", at: [x0, y0], label: "P", dir: "ne", accent: true });
    const term = (c: number, name: string, first: boolean) =>
      c === 0 ? "" : `${c < 0 ? (first ? "-" : " - ") : first ? "" : " + "}${Math.abs(c) === 1 ? "" : Math.abs(c)}${name}`;
    const rhs = `${term(a, "x", true)}${term(b, "y", a === 0)}`;
    return ask(
      [
        `The drawing shows the direction field of $y' = ${rhs}$. Starting at the marked point $P$, take two Euler steps of size $h = ${h}$. Find the $y$-value you reach.`,
        `图中是 $y' = ${rhs}$ 的方向场。从标记点 $P$ 出发，用步长 $h = ${h}$ 走两步欧拉法。求到达的 $y$ 值。`,
      ],
      answer,
      [y1, y0 + 2 * h * s0, y0 + h * s1, answer + h, answer - 1],
      [
        `From $(${x0}, ${y0})$ the slope is $${s0}$, which leads to $(${x1}, ${y1})$. There the slope is $${s1}$, so the next value is $${y1} + ${h}(${s1}) = ${answer}$.`,
        `从 $(${x0}, ${y0})$ 出发斜率为 $${s0}$，到达 $(${x1}, ${y1})$。那里的斜率为 $${s1}$，所以下一个值为 $${y1} + ${h}(${s1}) = ${answer}$。`,
      ],
      drawn(
        { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
        marks,
        t(`A direction field of short segments and the point P at (${x0}, ${y0}).`, `由短线段组成的方向场，点 P 位于 (${x0}, ${y0})。`),
      ),
    );
  },
);

const coneAboutLine = point(
  "the-disc-method-about-a-drawn-horizontal-line",
  ["The disc method about a drawn horizontal line", "绕所画水平线用圆盘法"],
  [
    "Rotating a region about the line $y = k$ makes discs whose radius is the distance to that line, not the height above the $x$-axis: $V = \\pi\\int (f(x) - k)^2\\,dx$.",
    "把区域绕直线 $y = k$ 旋转，得到的圆盘半径是到这条直线的距离，而不是到 $x$ 轴的高度：$V = \\pi\\int (f(x) - k)^2\\,dx$。",
  ],
  (rng) => {
    const k = rng.int(-3, 3);
    const a = rng.int(1, 6);
    const rise = rng.int(1, 4);
    const answer = Q.of(rise * rise * a, 3);
    const end: Point = [a, k + rise];
    const trap = Q.of(a * ((k + rise) * (k + rise) + (k + rise) * k + k * k), 3);
    return ask(
      [
        "The shaded triangle is rotated about the dashed line. Find the volume of the solid divided by $\\pi$.",
        "阴影三角形绕虚线旋转。求所得立体的体积除以 $\\pi$。",
      ],
      answer,
      [rise * rise * a, trap, Q.of(rise * a, 3), Q.of(rise * rise * a, 2), Q.of(rise * a * a, 3)],
      [
        `The radius at $x$ is the distance to the dashed line, $\\frac{${rise}x}{${a}}$. So $\\int_0^{${a}} \\left(\\frac{${rise}x}{${a}}\\right)^2 dx = \\frac{${rise}^2 \\cdot ${a}}{3} = ${answer.toLatex()}$.`,
        `$x$ 处的半径是到虚线的距离 $\\frac{${rise}x}{${a}}$。所以 $\\int_0^{${a}} \\left(\\frac{${rise}x}{${a}}\\right)^2 dx = \\frac{${rise}^2 \\cdot ${a}}{3} = ${answer.toLatex()}$。`,
      ],
      drawn(
        { xMin: -1, xMax: 7, yMin: -4, yMax: 8 },
        [
          { kind: "polygon", points: [[0, k], [a, k], end] },
          { kind: "line", a: [0, k], b: [1, k], dashed: true },
          { kind: "point", at: end },
        ],
        t(
          `A triangle with vertices (0, ${k}), (${a}, ${k}) and (${a}, ${k + rise}), and the dashed line y = ${k} along its lower side.`,
          `顶点为 (0, ${k})、(${a}, ${k}) 和 (${a}, ${k + rise}) 的三角形，虚线 y = ${k} 沿它的下边。`,
        ),
      ),
    );
  },
);

/** deeperFiguresCalculusIi2Points adds more knowledge points of Calculus II that are answered by reading a drawing. */
export const deeperFiguresCalculusIi2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "improper-integrals": [improperFirst],
  "improper-integrals-of-the-second-kind": [improperSecond],
  "the-arc-length-of-a-planar-curve": [arcOfLine],
  "volumes-of-solids-with-square-cross-sections": [squareSections],
  "volumes-of-solids-with-triangular-cross-sections": [triangleSections],
  "volumes-of-solids-with-circular-cross-sections": [circleSections],
  "calculating-the-displacement-of-a-particle-using-integration": [displacementDrawn],
  "calculating-the-total-distance-traveled-by-a-particle": [distanceDrawn],
  "calculating-the-position-function-of-a-particle-using-integration": [positionDrawn],
  "average-position-velocity-and-acceleration": [averageDrawn],
  "differentiating-parametric-curves": [parametricSlope],
  "calculating-areas-bounded-by-parametric-functions": [parametricArea],
  "the-arc-length-of-a-parametric-curve": [parametricLength],
  "the-arc-length-of-a-polar-curve": [polarLength],
  "finding-the-area-of-a-polar-region": [roseArea],
  "limits-of-sequences": [sequenceLimit],
  "monotonic-sequences": [sequenceKind],
  "finding-the-sum-of-an-infinite-geometric-series": [geometricBars],
  "the-integral-test": [integralComparison],
  "the-remainder-estimate-for-the-integral-test": [remainderDrawn],
  "the-lagrange-error-bound": [lagrangeDrawn],
  "eulers-method-calculating-multiple-steps": [eulerField],
  "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes": [coneAboutLine],
};
