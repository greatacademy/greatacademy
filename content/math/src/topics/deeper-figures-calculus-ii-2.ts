// More knowledge points of Calculus II that ask the learner to read a drawing: improper areas, solids over a drawn base,
// velocity graphs, parametric and polar curves, sequences, series compared with areas, error bounds and Euler's method.
// See `deeperFiguresCalculusIi2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { numberProblem } from "../problems.ts";
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
    "The area under $y = \\frac{c}{x^2}$ from $x = a$ onward is an improper integral, the limit of the area up to $b$:\n\n$$\\int_a^\\infty \\frac{c}{x^{2}}\\,dx = \\lim_{b \\to \\infty}\\left(\\frac{c}{a} - \\frac{c}{b}\\right) = \\frac{c}{a}$$\n\nIf the curve passes through $(1, c)$, its height at $x = 1$ gives $c$ directly. For example, a curve through $(1, 6)$ shaded from $x = 2$ onward has area $\\frac{6}{2}$, which is $3$.\n\nCheck: the area up to $b = 6$ is $3 - 1$, which is $2$, and the area up to $b = 60$ is $3 - \\frac{1}{10}$; these approach $3$ from below.\n\n> **Watch out.** An antiderivative of $\\frac{c}{x^2}$ is $-\\frac{c}{x}$, so the area is $\\frac{c}{a}$, not $\\frac{c}{a^2}$.",
    "$y = \\frac{c}{x^2}$ 在 $x = a$ 右侧的面积是反常积分，即积到 $b$ 的面积的极限：\n\n$$\\int_a^\\infty \\frac{c}{x^{2}}\\,dx = \\lim_{b \\to \\infty}\\left(\\frac{c}{a} - \\frac{c}{b}\\right) = \\frac{c}{a}$$\n\n曲线过 $(1, c)$ 时，它在 $x = 1$ 处的高度直接给出 $c$。例如，过 $(1, 6)$ 的曲线在 $x = 2$ 右侧有阴影，面积是 $\\frac{6}{2}$，即 $3$。\n\n检验：积到 $b = 6$ 的面积是 $3 - 1$，即 $2$；积到 $b = 60$ 的面积是 $3 - \\frac{1}{10}$；它们从下方趋于 $3$。\n\n> **注意。** $\\frac{c}{x^2}$ 的原函数是 $-\\frac{c}{x}$，所以面积是 $\\frac{c}{a}$，不是 $\\frac{c}{a^2}$。",
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
    const area = Q.of(c, a).toLatex();
    const lead = c === a ? "" : area;
    const limit = `\\int_{${a}}^{\\infty} \\frac{${c}}{x^{2}}\\,dx = \\lim_{b \\to \\infty}\\left(${area} - \\frac{${c}}{b}\\right) = ${area}`;
    const scaled = `\\int_{${a}}^{\\infty} \\frac{${c}}{x^{2}}\\,dx = ${lead}\\int_1^\\infty \\frac{du}{u^{2}}`;
    return ask(
      [
        "The curve has the form $y = \\frac{c}{x^2}$ and passes through the marked point. The shading continues to the right without end. Find the shaded area.",
        "曲线的形式为 $y = \\frac{c}{x^2}$，并过标记点。阴影向右无限延伸。求阴影面积。",
      ],
      Q.of(c, a),
      [Q.of(c, a * a), c, Q.of(2 * c, a), c * a, Q.of(c, a + 1)],
      [
        `**Step 1: Read the drawing.** At the marked point $x = 1$ and $y = ${c}$, so $c = ${c}$. The shading starts at $x = ${a}$.\n\n**Step 2: Take the limit.** The antiderivative $-\\frac{${c}}{x}$ tends to $0$ as $x \\to \\infty$:\n\n$$${limit}$$\n\n**Check.** Substitute $x = ${a}u$, so $dx = ${a}\\,du$ and $u$ runs from $1$ to $\\infty$:\n\n$$${scaled}$$\n\nThe last integral is $1$, so the area is $${area}$.`,
        `**第一步：读图。**标记点处 $x = 1$，$y = ${c}$，所以 $c = ${c}$。阴影从 $x = ${a}$ 开始。\n\n**第二步：取极限。**原函数 $-\\frac{${c}}{x}$ 在 $x \\to \\infty$ 时趋于 $0$：\n\n$$${limit}$$\n\n**检验。**令 $x = ${a}u$，则 $dx = ${a}\\,du$，$u$ 从 $1$ 变到 $\\infty$：\n\n$$${scaled}$$\n\n最后的积分等于 $1$，所以面积为 $${area}$。`,
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
    "The curve $y = \\frac{c}{\\sqrt{x}}$ rises without bound at $x = 0$, yet the area under it is finite. Stop at $s > 0$ and let $s \\to 0^+$:\n\n$$\\int_0^b \\frac{c}{\\sqrt{x}}\\,dx = \\lim_{s \\to 0^{+}}\\left(2c\\sqrt{b} - 2c\\sqrt{s}\\right) = 2c\\sqrt{b}$$\n\nIf the curve passes through $(1, c)$, its height at $x = 1$ gives $c$ directly. For example, a curve through $(1, 3)$ shaded from $x = 0$ to $x = 4$ has area $2 \\cdot 3 \\cdot 2$, which is $12$.\n\nCheck: the derivative of $6\\sqrt{x}$ is $\\frac{3}{\\sqrt{x}}$, and $6\\sqrt{x}$ is $0$ at $x = 0$ and $12$ at $x = 4$.\n\n> **Watch out.** The integrand has no value at $x = 0$, so the integral is a limit. It converges because the antiderivative $2c\\sqrt{x}$ stays finite there, even though the curve does not.",
    "曲线 $y = \\frac{c}{\\sqrt{x}}$ 在 $x = 0$ 处无界上升，但它下方的面积有限。从 $s > 0$ 积起，再令 $s \\to 0^+$：\n\n$$\\int_0^b \\frac{c}{\\sqrt{x}}\\,dx = \\lim_{s \\to 0^{+}}\\left(2c\\sqrt{b} - 2c\\sqrt{s}\\right) = 2c\\sqrt{b}$$\n\n曲线过 $(1, c)$ 时，它在 $x = 1$ 处的高度直接给出 $c$。例如，过 $(1, 3)$ 的曲线从 $x = 0$ 到 $x = 4$ 有阴影，面积是 $2 \\cdot 3 \\cdot 2$，即 $12$。\n\n检验：$6\\sqrt{x}$ 的导数是 $\\frac{3}{\\sqrt{x}}$，而 $6\\sqrt{x}$ 在 $x = 0$ 处为 $0$，在 $x = 4$ 处为 $12$。\n\n> **注意。** 被积函数在 $x = 0$ 处没有值，所以积分是极限。它收敛，是因为原函数 $2c\\sqrt{x}$ 在那里保持有限，尽管曲线并不有限。",
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
    const answer = 2 * c * root;
    const limit = `\\int_0^{${b}} \\frac{${c}}{\\sqrt{x}}\\,dx = \\lim_{s \\to 0^{+}}\\left(${2 * c}\\sqrt{${b}} - ${2 * c}\\sqrt{s}\\right) = ${2 * c}\\sqrt{${b}} = ${answer}`;
    const derivative = `\\frac{d}{dx}\\left[${2 * c}\\sqrt{x}\\right] = \\frac{${c}}{\\sqrt{x}}`;
    return ask(
      [
        "The curve has the form $y = \\frac{c}{\\sqrt{x}}$ and passes through the marked point. It rises without bound at $x = 0$. Find the shaded area.",
        "曲线的形式为 $y = \\frac{c}{\\sqrt{x}}$，并过标记点。它在 $x = 0$ 处无界上升。求阴影面积。",
      ],
      answer,
      [c * root, 2 * c * b, c * b, 2 * c, 2 * c + root],
      [
        `**Step 1: Read the drawing.** At the marked point $x = 1$ and $y = ${c}$, so $c = ${c}$. The shading ends at $x = ${b}$.\n\n**Step 2: Take the limit.** An antiderivative is $${2 * c}\\sqrt{x}$, which tends to $0$ as $x \\to 0^{+}$:\n\n$$${limit}$$\n\n**Check.** Differentiate the antiderivative; it gives back the curve, and it rises from $0$ at $x = 0$ to $${answer}$ at $x = ${b}$:\n\n$$${derivative}$$`,
        `**第一步：读图。**标记点处 $x = 1$，$y = ${c}$，所以 $c = ${c}$。阴影到 $x = ${b}$ 结束。\n\n**第二步：取极限。**原函数是 $${2 * c}\\sqrt{x}$，它在 $x \\to 0^{+}$ 时趋于 $0$：\n\n$$${limit}$$\n\n**检验。**对原函数求导，得到的正是曲线的函数；原函数从 $x = 0$ 处的 $0$ 增加到 $x = ${b}$ 处的 $${answer}$：\n\n$$${derivative}$$`,
      ],
      figureOf(svg, [
        `The curve through (1, ${c}), shaded below it from x = 0 to x = ${b}.`,
        `过 (1, ${c}) 的曲线，从 x = 0 到 x = ${b} 的曲线下方有阴影。`,
      ]),
    );
  },
);

const arcOfLine = {
  ...point(
    "arc-length-of-a-drawn-segment-by-the-integral",
    ["Arc length of a drawn segment, by the integral", "用积分求所画线段的弧长"],
    [
      "The arc length of $y = f(x)$ is $\\int_a^b \\sqrt{1 + f'(x)^2}\\,dx$. For a straight segment, $f'$ is the constant slope, so the integral is $\\sqrt{1 + m^2}$ times the horizontal run. For example, the segment from $(0, 0)$ to $(3, 4)$ has slope $\\frac{4}{3}$, so $\\sqrt{1 + \\frac{16}{9}} = \\frac{5}{3}$ and the length is $\\frac{5}{3} \\cdot 3 = 5$.\n\nCheck: the distance formula gives $\\sqrt{3^2 + 4^2} = 5$.\n\n> **Watch out.** The integral is over $x$, so multiply by the run, the change in $x$, not by the rise.",
      "$y = f(x)$ 的弧长为 $\\int_a^b \\sqrt{1 + f'(x)^2}\\,dx$。对直线段，$f'$ 是常数斜率，所以积分等于 $\\sqrt{1 + m^2}$ 乘水平长度。例如，从 $(0, 0)$ 到 $(3, 4)$ 的线段斜率为 $\\frac{4}{3}$，所以 $\\sqrt{1 + \\frac{16}{9}} = \\frac{5}{3}$，长度为 $\\frac{5}{3} \\cdot 3 = 5$。\n\n检验：由距离公式得 $\\sqrt{3^2 + 4^2} = 5$。\n\n> **注意。** 积分是对 $x$ 的，所以要乘水平长度，即 $x$ 的变化量，而不是竖直高度。",
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
      const answer = hyp * k;
      const all = [
        {
          value: Q.of((run + rise) * k),
          why: t(
            `This adds the run $${dx}$ and the rise $${Math.abs(dy)}$; the segment is the hypotenuse of that right triangle, which is shorter.`,
            `这是把水平长度 $${dx}$ 和竖直高度 $${Math.abs(dy)}$ 相加；线段是这个直角三角形的斜边，比两者之和短。`,
          ),
        },
        {
          value: Q.of(dx),
          why: t(
            `This is the run alone, $\\int 1\\,dx$; the integrand is $\\sqrt{1 + f'(x)^2}$, not $1$.`,
            `这只是水平长度 $\\int 1\\,dx$；被积函数是 $\\sqrt{1 + f'(x)^2}$，不是 $1$。`,
          ),
        },
        {
          value: Q.of(Math.abs(dy)),
          why: t(
            "This is the rise alone; a sloping segment is longer than its change in height.",
            "这只是竖直高度；斜线段比它的高度变化长。",
          ),
        },
        {
          value: Q.of(hyp),
          why: t(
            `This is the hypotenuse of a ${run}-${rise}-${hyp} triangle; this segment has run $${dx}$, twice ${run}, so it is twice as long.`,
            `这是 ${run}-${rise}-${hyp} 三角形的斜边；这条线段的水平长度是 $${dx}$，是 ${run} 的两倍，所以它也长两倍。`,
          ),
        },
        {
          value: Q.of(hyp * hyp * k, run),
          why: t(
            "This leaves out the square root: it is $\\int (1 + f'(x)^2)\\,dx$.",
            "这里漏掉了根号：算的是 $\\int (1 + f'(x)^2)\\,dx$。",
          ),
        },
      ];
      const mistakes = all.filter((x, i) => !x.value.eq(Q.of(answer)) && all.findIndex((y) => y.value.eq(x.value)) === i);
      const work = `\\int_{${x0}}^{${end[0]}} \\sqrt{1 + \\left(${m.toLatex()}\\right)^{2}}\\,dx = \\sqrt{\\frac{${hyp * hyp}}{${run * run}}} \\cdot ${dx} = \\frac{${hyp}}{${run}} \\cdot ${dx} = ${answer}`;
      const distance = `\\sqrt{${dx}^{2} + ${Math.abs(dy)}^{2}} = \\sqrt{${dx * dx + dy * dy}} = ${answer}`;
      return {
        ...numberProblem({
          prompt: t(
            "The graph of $y = f(x)$ is the segment between the two marked points. Evaluate $\\int \\sqrt{1 + f'(x)^2}\\,dx$ over the interval it covers.",
            "$y = f(x)$ 的图像是两个标记点之间的线段。在它覆盖的区间上计算 $\\int \\sqrt{1 + f'(x)^2}\\,dx$。",
          ),
          answer,
          mistakes,
          solution: t(
            `**Step 1: Read the slope.** From $(${x0}, ${y0})$ to $(${end[0]}, ${end[1]})$ the run is $${dx}$ and the rise is $${dy}$, so $f'(x) = ${m.toLatex()}$ on $[${x0}, ${end[0]}]$.\n\n**Step 2: Integrate the constant.** The integrand does not depend on $x$, so the integral is the integrand times the run:\n\n$$${work}$$\n\n**Check.** The integral is the length of the segment, so the distance formula must agree:\n\n$$${distance}$$`,
            `**第一步：读斜率。**从 $(${x0}, ${y0})$ 到 $(${end[0]}, ${end[1]})$，水平长度为 $${dx}$，竖直变化为 $${dy}$，所以在 $[${x0}, ${end[0]}]$ 上 $f'(x) = ${m.toLatex()}$。\n\n**第二步：对常数积分。**被积函数与 $x$ 无关，所以积分等于被积函数乘水平长度：\n\n$$${work}$$\n\n**检验。**这个积分就是线段的长度，所以距离公式应给出相同的结果：\n\n$$${distance}$$`,
          ),
        }),
        figure: drawn(
          { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
          [
            { kind: "segment", a: [x0, y0], b: end, accent: true },
            { kind: "point", at: [x0, y0] },
            { kind: "point", at: end },
          ],
          t(`A segment from (${x0}, ${y0}) to (${end[0]}, ${end[1]}).`, `从 (${x0}, ${y0}) 到 (${end[0]}, ${end[1]}) 的线段。`),
        ),
      };
    },
  ),
  figure: calculusDrawings4["the-arc-length-of-a-planar-curve#arc-length-of-a-drawn-segment-by-the-integral"],
};

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

/** overTriangle reads the width of the drawn triangle base and works the integral of its square. */
function overTriangle(a: number, b: number) {
  const xa = a === 1 ? "x" : `\\frac{x}{${a}}`;
  const width = `${b === 1 ? "" : b}\\left(1 - ${xa}\\right)`;
  const squared = `\\int_0^{${a}} s(x)^2\\,dx = \\int_0^{${a}} ${b * b === 1 ? "" : b * b}\\left(1 - ${xa}\\right)^{2} dx = \\left[-${Q.of(a * b * b, 3).toLatex()}\\left(1 - ${xa}\\right)^{3}\\right]_0^{${a}} = ${Q.of(a * b * b, 3).toLatex()}`;
  const read: Pair = [
    `**Step 1: Read the width.** The base has vertices $(0, 0)$, $(${a}, 0)$ and $(0, ${b})$. At $x$ it runs from the $x$-axis up to the slanted side, so its width is $s(x) = ${width}$, falling from $${b}$ at $x = 0$ to $0$ at $x = ${a}$.`,
    `**第一步：读宽度。**底面的顶点是 $(0, 0)$、$(${a}, 0)$ 和 $(0, ${b})$。在 $x$ 处它从 $x$ 轴延伸到斜边，所以宽度是 $s(x) = ${width}$，从 $x = 0$ 处的 $${b}$ 减小到 $x = ${a}$ 处的 $0$。`,
  ];
  return { read, squared };
}

/** triangleWidthMistakes lists the slips shared by the solids over the drawn triangle: c is the fraction of s(x)^2 that a section's area is. */
function triangleWidthMistakes(a: number, b: number, c: Q, answer: Q) {
  const all = [
    {
      value: Q.of(a * b * b).mul(c),
      why: t(
        `This uses the largest width $${b}$ for every slice, so every slice is the same; the sections shrink to nothing at $x = ${a}$, and the solid is a third of that.`,
        `这里每一片都用了最大宽度 $${b}$，这样每片都一样大；截面在 $x = ${a}$ 处缩为零，立体只是它的三分之一。`,
      ),
    },
    {
      value: Q.of(a * a * b, 3).mul(c),
      why: t(
        `This swaps the legs: the width at $x$ is measured up to $${b}$, and $x$ runs from $0$ to $${a}$.`,
        `这里把两条直角边弄反了：$x$ 处的宽度最大为 $${b}$，而 $x$ 从 $0$ 变到 $${a}$。`,
      ),
    },
    {
      value: Q.of(a * b, 2),
      why: t(
        "This is the area of the base triangle; the volume integrates the area of each section.",
        "这是底面三角形的面积；体积要对每个截面的面积积分。",
      ),
    },
  ];
  return all.filter((x) => !x.value.eq(answer));
}

const squareSections = point(
  "square-cross-sections-over-a-drawn-base",
  ["Square cross sections over a drawn base", "所画底面上的正方形截面"],
  [
    "If the cross section at $x$ is a square whose side lies in the base, its area is $s(x)^2$, where $s(x)$ is the width of the base at $x$. The volume is $\\int s(x)^2\\,dx$. For example, over the triangle with vertices $(0, 0)$, $(3, 0)$ and $(0, 2)$, the width is $s(x) = 2\\left(1 - \\frac{x}{3}\\right)$, and $\\int_0^3 4\\left(1 - \\frac{x}{3}\\right)^2 dx = 4$.\n\nCheck: the squares shrink from side $2$ to a point, so the solid is a pyramid with a $2 \\times 2$ base and height $3$, and $\\frac{1}{3} \\cdot 4 \\cdot 3 = 4$.\n\n> **Watch out.** The side of each square is the width at that $x$, which shrinks; using the largest width for every slice gives a prism three times too large.",
    "如果 $x$ 处的截面是边在底面上的正方形，它的面积是 $s(x)^2$，其中 $s(x)$ 是底面在 $x$ 处的宽度。体积为 $\\int s(x)^2\\,dx$。例如，在顶点为 $(0, 0)$、$(3, 0)$、$(0, 2)$ 的三角形上，宽度为 $s(x) = 2\\left(1 - \\frac{x}{3}\\right)$，而 $\\int_0^3 4\\left(1 - \\frac{x}{3}\\right)^2 dx = 4$。\n\n检验：正方形从边长 $2$ 缩为一点，所以立体是底面为 $2 \\times 2$、高为 $3$ 的棱锥，而 $\\frac{1}{3} \\cdot 4 \\cdot 3 = 4$。\n\n> **注意。** 每个正方形的边长是该 $x$ 处的宽度，它会变小；每片都用最大宽度会得到大三倍的棱柱。",
  ],
  (rng) => {
    const a = rng.int(1, 7);
    const b = rng.int(1, 7);
    const answer = Q.of(a * b * b, 3);
    const { read, squared } = overTriangle(a, b);
    const all = [
      ...triangleWidthMistakes(a, b, Q.of(1), answer),
      {
        value: Q.of(a * b * b, 6),
        why: t(
          "This takes half of each square, the area of an isosceles right triangle; a square section has area $s(x)^2$.",
          "这里取了每个正方形的一半，即等腰直角三角形的面积；正方形截面的面积是 $s(x)^2$。",
        ),
      },
    ];
    const mistakes = all.filter((x, i) => all.findIndex((y) => y.value.eq(x.value)) === i);
    const pyramid = `\\frac{1}{3} \\cdot ${b}^{2} \\cdot ${a} = ${answer.toLatex()}`;
    return {
      ...numberProblem({
        prompt: t(
          "The triangle is the base of a solid. Each cross section perpendicular to the $x$-axis is a square with one side in the base. Find the volume.",
          "三角形是一个立体的底面。垂直于 $x$ 轴的每个截面都是一边在底面上的正方形。求体积。",
        ),
        answer,
        mistakes,
        solution: t(
          `${read[0]}\n\n**Step 2: Integrate the area of a square.** A square of side $s(x)$ has area $s(x)^2$:\n\n$$${squared}$$\n\n**Check.** The squares shrink from side $${b}$ at $x = 0$ to a point at $x = ${a}$, so the solid is a pyramid with a $${b} \\times ${b}$ base and height $${a}$:\n\n$$${pyramid}$$`,
          `${read[1]}\n\n**第二步：对正方形面积积分。**边长为 $s(x)$ 的正方形面积是 $s(x)^2$：\n\n$$${squared}$$\n\n**检验。**正方形从 $x = 0$ 处的边长 $${b}$ 缩为 $x = ${a}$ 处的一点，所以立体是底面为 $${b} \\times ${b}$、高为 $${a}$ 的棱锥：\n\n$$${pyramid}$$`,
        ),
      }),
      figure: solidBase(a, b),
    };
  },
);

const triangleSections = {
  ...point(
    "triangular-cross-sections-over-a-drawn-base",
    ["Triangular cross sections over a drawn base", "所画底面上的三角形截面"],
    [
      "If the cross section at $x$ is an isosceles right triangle with one leg in the base, its area is $\\frac{1}{2}s(x)^2$, where $s(x)$ is the width of the base at $x$. The volume is the integral of that area. For example, over the triangle with vertices $(0, 0)$, $(3, 0)$ and $(0, 2)$, the width is $s(x) = 2\\left(1 - \\frac{x}{3}\\right)$, and $\\int_0^3 \\frac{1}{2} \\cdot 4\\left(1 - \\frac{x}{3}\\right)^2 dx = 2$.\n\nCheck: the solid is a pyramid whose base is the largest section, a triangle of area $\\frac{1}{2} \\cdot 2^2 = 2$, with height $3$, and $\\frac{1}{3} \\cdot 2 \\cdot 3 = 2$.\n\n> **Watch out.** With a leg in the base the area is $\\frac{1}{2}s(x)^2$; with the hypotenuse in the base it would be $\\frac{1}{4}s(x)^2$, so read which side lies in the base.",
      "如果 $x$ 处的截面是一条直角边在底面上的等腰直角三角形，它的面积是 $\\frac{1}{2}s(x)^2$，其中 $s(x)$ 是底面在 $x$ 处的宽度。体积是该面积的积分。例如，在顶点为 $(0, 0)$、$(3, 0)$、$(0, 2)$ 的三角形上，宽度为 $s(x) = 2\\left(1 - \\frac{x}{3}\\right)$，而 $\\int_0^3 \\frac{1}{2} \\cdot 4\\left(1 - \\frac{x}{3}\\right)^2 dx = 2$。\n\n检验：立体是以最大截面为底的棱锥，底是面积为 $\\frac{1}{2} \\cdot 2^2 = 2$ 的三角形，高为 $3$，而 $\\frac{1}{3} \\cdot 2 \\cdot 3 = 2$。\n\n> **注意。** 直角边在底面上时面积是 $\\frac{1}{2}s(x)^2$；斜边在底面上时是 $\\frac{1}{4}s(x)^2$，所以要看清哪条边在底面上。",
    ],
    (rng) => {
      const a = rng.int(1, 7);
      const b = rng.int(1, 7);
      const answer = Q.of(a * b * b, 6);
      const { read, squared } = overTriangle(a, b);
      const all = [
        {
          value: Q.of(a * b * b, 3),
          why: t(
            "This uses the whole square $s(x)^2$; the triangle is half of it, $\\frac{1}{2}s(x)^2$.",
            "这里用了整个正方形 $s(x)^2$；三角形只是它的一半，即 $\\frac{1}{2}s(x)^2$。",
          ),
        },
        ...triangleWidthMistakes(a, b, Q.of(1, 2), answer),
        {
          value: Q.of(a * b * b, 12),
          why: t(
            "This puts the hypotenuse in the base, with area $\\frac{1}{4}s(x)^2$; here a leg lies in the base.",
            "这是把斜边放在底面上，面积为 $\\frac{1}{4}s(x)^2$；这里是一条直角边在底面上。",
          ),
        },
      ];
      const mistakes = all.filter((x, i) => all.findIndex((y) => y.value.eq(x.value)) === i);
      const pyramid = `\\frac{1}{3} \\cdot \\frac{${b}^{2}}{2} \\cdot ${a} = ${answer.toLatex()}`;
      return {
        ...numberProblem({
          prompt: t(
            "The triangle is the base of a solid. Each cross section perpendicular to the $x$-axis is an isosceles right triangle with one leg in the base. Find the volume.",
            "三角形是一个立体的底面。垂直于 $x$ 轴的每个截面都是一条直角边在底面上的等腰直角三角形。求体积。",
          ),
          answer,
          mistakes,
          solution: t(
            `${read[0]}\n\n**Step 2: Integrate the area of a triangle.** An isosceles right triangle with legs $s(x)$ has area $\\frac{1}{2}s(x)^2$, so the volume is half of\n\n$$${squared}$$\n\nthat is, $\\frac{1}{2} \\cdot ${Q.of(a * b * b, 3).toLatex()} = ${answer.toLatex()}$.\n\n**Check.** The sections shrink to a point at $x = ${a}$, so the solid is a pyramid. Its base is the section at $x = 0$, a triangle of area $\\frac{${b}^{2}}{2}$, and its height is $${a}$:\n\n$$${pyramid}$$`,
            `${read[1]}\n\n**第二步：对三角形面积积分。**直角边为 $s(x)$ 的等腰直角三角形面积是 $\\frac{1}{2}s(x)^2$，所以体积是下式的一半：\n\n$$${squared}$$\n\n即 $\\frac{1}{2} \\cdot ${Q.of(a * b * b, 3).toLatex()} = ${answer.toLatex()}$。\n\n**检验。**截面在 $x = ${a}$ 处缩为一点，所以立体是棱锥。它的底是 $x = 0$ 处的截面，面积为 $\\frac{${b}^{2}}{2}$ 的三角形，高为 $${a}$：\n\n$$${pyramid}$$`,
          ),
        }),
        figure: solidBase(a, b),
      };
    },
  ),
  figure: calculusDrawings4["volumes-of-solids-with-triangular-cross-sections#triangular-cross-sections-over-a-drawn-base"],
};

const circleSections = point(
  "circular-cross-sections-over-a-drawn-base",
  ["Circular cross sections over a drawn base", "所画底面上的圆形截面"],
  [
    "If the cross section at $x$ is a disc whose diameter is the width $s(x)$ of the base, its area is $\\pi\\left(\\frac{s(x)}{2}\\right)^2 = \\frac{\\pi}{4}s(x)^2$. The volume is the integral of that area. For example, over the triangle with vertices $(0, 0)$, $(3, 0)$ and $(0, 2)$, the width is $s(x) = 2\\left(1 - \\frac{x}{3}\\right)$, and $\\int_0^3 \\frac{\\pi}{4} \\cdot 4\\left(1 - \\frac{x}{3}\\right)^2 dx = \\pi$.\n\nCheck: the discs shrink from diameter $2$ to a point, so the solid is a cone of radius $1$ and height $3$, and $\\frac{1}{3}\\pi \\cdot 1^2 \\cdot 3 = \\pi$.\n\n> **Watch out.** The width is the diameter, so the radius is $\\frac{s(x)}{2}$; using $s(x)$ as the radius makes every disc four times too large.",
    "如果 $x$ 处的截面是直径等于底面宽度 $s(x)$ 的圆，它的面积是 $\\pi\\left(\\frac{s(x)}{2}\\right)^2 = \\frac{\\pi}{4}s(x)^2$。体积是该面积的积分。例如，在顶点为 $(0, 0)$、$(3, 0)$、$(0, 2)$ 的三角形上，宽度为 $s(x) = 2\\left(1 - \\frac{x}{3}\\right)$，而 $\\int_0^3 \\frac{\\pi}{4} \\cdot 4\\left(1 - \\frac{x}{3}\\right)^2 dx = \\pi$。\n\n检验：圆从直径 $2$ 缩为一点，所以立体是半径为 $1$、高为 $3$ 的圆锥，而 $\\frac{1}{3}\\pi \\cdot 1^2 \\cdot 3 = \\pi$。\n\n> **注意。** 宽度是直径，所以半径是 $\\frac{s(x)}{2}$；把 $s(x)$ 当作半径，每个圆都会大四倍。",
  ],
  (rng) => {
    const a = rng.int(1, 7);
    const b = rng.int(1, 7);
    const answer = Q.of(a * b * b, 12);
    const { read, squared } = overTriangle(a, b);
    const all = [
      {
        value: Q.of(a * b * b, 3),
        why: t(
          "This uses the width $s(x)$ as the radius; it is the diameter, so the radius is $\\frac{s(x)}{2}$.",
          "这里把宽度 $s(x)$ 当作半径；它是直径，半径是 $\\frac{s(x)}{2}$。",
        ),
      },
      ...triangleWidthMistakes(a, b, Q.of(1, 4), answer),
      {
        value: Q.of(a * b * b, 24),
        why: t(
          "This uses semicircles, of area $\\frac{\\pi}{8}s(x)^2$; the sections are whole discs.",
          "这里用了半圆，面积为 $\\frac{\\pi}{8}s(x)^2$；截面是整个圆。",
        ),
      },
    ];
    const mistakes = all.filter((x, i) => all.findIndex((y) => y.value.eq(x.value)) === i);
    const cone = `\\frac{1}{3}\\pi \\left(\\frac{${b}}{2}\\right)^{2} \\cdot ${a} = ${answer.toLatex()}\\pi`;
    return {
      ...numberProblem({
        prompt: t(
          "The triangle is the base of a solid. Each cross section perpendicular to the $x$-axis is a disc whose diameter lies in the base. Find the volume divided by $\\pi$.",
          "三角形是一个立体的底面。垂直于 $x$ 轴的每个截面都是直径在底面上的圆。求体积除以 $\\pi$。",
        ),
        answer,
        mistakes,
        solution: t(
          `${read[0]}\n\n**Step 2: Integrate the area of a disc.** The diameter is $s(x)$, so the radius is $\\frac{s(x)}{2}$ and the area is $\\frac{\\pi}{4}s(x)^2$. The volume is $\\frac{\\pi}{4}$ times\n\n$$${squared}$$\n\nthat is, $\\frac{\\pi}{4} \\cdot ${Q.of(a * b * b, 3).toLatex()} = ${answer.toLatex()}\\pi$, and dividing by $\\pi$ gives $${answer.toLatex()}$.\n\n**Check.** The discs shrink from diameter $${b}$ to a point at $x = ${a}$, so the solid is a cone of radius $\\frac{${b}}{2}$ and height $${a}$:\n\n$$${cone}$$`,
          `${read[1]}\n\n**第二步：对圆的面积积分。**直径是 $s(x)$，所以半径是 $\\frac{s(x)}{2}$，面积是 $\\frac{\\pi}{4}s(x)^2$。体积是 $\\frac{\\pi}{4}$ 乘以\n\n$$${squared}$$\n\n即 $\\frac{\\pi}{4} \\cdot ${Q.of(a * b * b, 3).toLatex()} = ${answer.toLatex()}\\pi$，除以 $\\pi$ 得 $${answer.toLatex()}$。\n\n**检验。**圆从直径 $${b}$ 缩为 $x = ${a}$ 处的一点，所以立体是半径为 $\\frac{${b}}{2}$、高为 $${a}$ 的圆锥：\n\n$$${cone}$$`,
        ),
      }),
      figure: solidBase(a, b),
    };
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

/** VelocityPiece is one straight piece of a drawn velocity graph, two units wide, with its signed area and its parts above and below the axis. */
type VelocityPiece = {
  readonly from: number;
  readonly a: number;
  readonly b: number;
  readonly signed: number;
  readonly above: Q;
  readonly below: Q;
};

/** velocityPieces splits a drawn velocity graph into its pieces; a piece that crosses the axis is cut into two triangles at the crossing. */
function velocityPieces(values: readonly number[]) {
  const pieces: VelocityPiece[] = values.slice(1).map((b, i) => {
    const a = values[i] as number;
    const part = (h: number) => (a * b < 0 ? Q.of(h * h, Math.abs(a) + Math.abs(b)) : Q.of(Math.abs(a + b)));
    const above = a * b < 0 ? part(Math.max(a, b)) : a + b > 0 ? part(a + b) : Q.zero;
    const below = a * b < 0 ? part(Math.min(a, b)) : a + b < 0 ? part(a + b) : Q.zero;
    return { from: 2 * i, a, b, signed: a + b, above, below };
  });
  const above = pieces.reduce((s, p) => s.add(p.above), Q.zero);
  const below = pieces.reduce((s, p) => s.add(p.below), Q.zero);
  return { pieces, above, below };
}

/** signedLines writes the signed area of each piece of a velocity graph, a trapezoid two units wide. */
const signedLines = (pieces: readonly VelocityPiece[]) =>
  pieces.map((p) => `[${p.from}, ${p.from + 2}]: \\quad \\frac{${p.a} + ${p.b < 0 ? `(${p.b})` : p.b}}{2} \\cdot 2 = ${p.signed}`);

/** partsLine writes the areas above and below the axis and their difference. */
const partsLine = (above: Q, below: Q) => `${above.toLatex()} - ${below.toLatex()} = ${above.sub(below).toLatex()}`;

/** display shows each line as its own displayed formula. */
const display = (lines: readonly string[]) => lines.map((l) => `$$${l}$$`).join("\n\n");

/** motionKeep drops wrong values that equal the answer or repeat an earlier one. */
const motionKeep = (answer: Q, all: readonly { value: Q; why: ReturnType<typeof t> }[]) =>
  all.filter((x, i) => !x.value.eq(answer) && all.findIndex((y) => y.value.eq(x.value)) === i);

const displacementDrawn = {
  ...point(
    "displacement-from-a-drawn-velocity-graph",
    ["Displacement from a drawn velocity graph", "由所画速度图求位移"],
    [
      "Displacement is $\\int v\\,dt$, the area between the velocity graph and the $t$-axis, where area below the axis counts as negative. For a graph made of straight pieces, each piece is a trapezoid, and its signed area is its width times the average of its end heights. For example, pieces through $(0, 2)$, $(2, -1)$, $(4, 1)$ have signed areas $2 + (-1) = 1$ and $-1 + 1 = 0$, so the displacement is $1$.\n\nCheck: split at the crossings instead: the area above the axis is $\\frac{4}{3} + \\frac{1}{3} = \\frac{5}{3}$ and below is $\\frac{1}{3} + \\frac{1}{3} = \\frac{2}{3}$, and $\\frac{5}{3} - \\frac{2}{3} = 1$.\n\n> **Watch out.** Area below the axis is subtracted, not added: adding it gives the total distance.",
      "位移是 $\\int v\\,dt$，即速度图与 $t$ 轴之间的面积，其中轴下方的面积记为负。由直线段组成的图像中，每一段都是梯形，它的有向面积等于宽度乘两端高度的平均。例如，过 $(0, 2)$、$(2, -1)$、$(4, 1)$ 的两段有向面积分别为 $2 + (-1) = 1$ 和 $-1 + 1 = 0$，所以位移是 $1$。\n\n检验：改在穿过轴的地方分开：轴上方的面积为 $\\frac{4}{3} + \\frac{1}{3} = \\frac{5}{3}$，下方为 $\\frac{1}{3} + \\frac{1}{3} = \\frac{2}{3}$，而 $\\frac{5}{3} - \\frac{2}{3} = 1$。\n\n> **注意。** 轴下方的面积要减去，而不是加上：加上得到的是总路程。",
    ],
    (rng) => {
      const { values, signed, distance, figure } = velocityGraph(rng);
      const { pieces, above, below } = velocityPieces(values);
      const mistakes = motionKeep(signed, [
        {
          value: distance,
          why: t(
            "This counts the area below the axis as positive; that is the total distance, not the displacement.",
            "这里把轴下方的面积也记为正；那是总路程，不是位移。",
          ),
        },
        {
          value: signed.neg(),
          why: t(
            "This has the sign reversed: area above the axis is positive and area below is negative.",
            "这里符号反了：轴上方的面积为正，下方为负。",
          ),
        },
        {
          value: Q.of((values[3] as number) - (values[0] as number)),
          why: t(
            "This is $v(6) - v(0)$, the change in velocity; the displacement is the area under the graph, not the change in its height.",
            "这是 $v(6) - v(0)$，即速度的变化量；位移是图像下的面积，不是高度的变化。",
          ),
        },
        {
          value: signed.div(Q.of(2)),
          why: t("This uses width $1$ for each piece; the pieces are $2$ units wide.", "这里把每段的宽度当作 $1$；每段宽 $2$ 个单位。"),
        },
      ]);
      const sum = `${pieces.map((p) => (p.signed < 0 ? `(${p.signed})` : `${p.signed}`)).join(" + ")} = ${signed.toLatex()}`;
      return {
        ...numberProblem({
          prompt: t(
            "The graph shows the velocity of a particle. Find its displacement from $t = 0$ to $t = 6$.",
            "图中是质点的速度。求它从 $t = 0$ 到 $t = 6$ 的位移。",
          ),
          answer: signed,
          mistakes,
          solution: t(
            `**Step 1: Find each signed area.** Each piece is a trapezoid of width $2$, so its signed area is $2$ times the average of its end heights:\n\n${display(signedLines(pieces))}\n\n**Step 2: Add them.** The displacement is the total signed area:\n\n$$${sum}$$\n\n**Check.** Split the graph where it crosses the axis and find the area above and the area below separately; the displacement is the first minus the second:\n\n$$${partsLine(above, below)}$$`,
            `**第一步：求每段的有向面积。**每段都是宽 $2$ 的梯形，它的有向面积等于 $2$ 乘两端高度的平均：\n\n${display(signedLines(pieces))}\n\n**第二步：相加。**位移是有向面积的总和：\n\n$$${sum}$$\n\n**检验。**在图像穿过轴的地方分开，分别求轴上方和下方的面积；位移等于前者减后者：\n\n$$${partsLine(above, below)}$$`,
          ),
        }),
        figure,
      };
    },
  ),
  figure: calculusDrawings5["calculating-the-displacement-of-a-particle-using-integration#displacement-from-a-drawn-velocity-graph"],
};

const distanceDrawn = {
  ...point(
    "total-distance-from-a-drawn-velocity-graph",
    ["Total distance from a drawn velocity graph", "由所画速度图求总路程"],
    [
      "Total distance is $\\int |v|\\,dt$: every area between the velocity graph and the $t$-axis counts as positive. A piece that crosses the axis splits into two triangles. For example, the piece from $(0, 2)$ to $(2, -1)$ crosses at $t = \\frac{4}{3}$, giving triangles of areas $\\frac{1}{2} \\cdot \\frac{4}{3} \\cdot 2 = \\frac{4}{3}$ and $\\frac{1}{2} \\cdot \\frac{2}{3} \\cdot 1 = \\frac{1}{3}$, so it adds $\\frac{5}{3}$ to the distance.\n\nCheck: the two triangles' signed areas give $\\frac{4}{3} - \\frac{1}{3} = 1$, the same as the trapezoid rule $2 + (-1) = 1$.\n\n> **Watch out.** Do not take the absolute value of a crossing piece as a whole: $|2 + (-1)| = 1$ undercounts, because the two triangles partly cancel in it.",
      "总路程是 $\\int |v|\\,dt$：速度图与 $t$ 轴之间的每块面积都记为正。穿过轴的一段要分成两个三角形。例如从 $(0, 2)$ 到 $(2, -1)$ 的一段在 $t = \\frac{4}{3}$ 处穿过轴，两个三角形的面积为 $\\frac{1}{2} \\cdot \\frac{4}{3} \\cdot 2 = \\frac{4}{3}$ 和 $\\frac{1}{2} \\cdot \\frac{2}{3} \\cdot 1 = \\frac{1}{3}$，所以这一段为路程贡献 $\\frac{5}{3}$。\n\n检验：两个三角形的有向面积之和为 $\\frac{4}{3} - \\frac{1}{3} = 1$，与梯形算法 $2 + (-1) = 1$ 相同。\n\n> **注意。** 不要对穿过轴的一段整体取绝对值：$|2 + (-1)| = 1$ 算少了，因为两个三角形在其中部分抵消了。",
    ],
    (rng) => {
      const { values, signed, distance, figure } = velocityGraph(rng);
      const { pieces, above, below } = velocityPieces(values);
      const lumped = pieces.reduce((s, p) => s.add(Q.of(Math.abs(p.signed))), Q.zero);
      const mistakes = motionKeep(distance, [
        {
          value: signed,
          why: t(
            "This is the displacement: area below the axis was subtracted. For distance, every area counts as positive.",
            "这是位移：轴下方的面积被减去了。求路程时每块面积都记为正。",
          ),
        },
        {
          value: lumped,
          why: t(
            "This takes the absolute value of each whole piece; a piece that crosses the axis must be cut into two triangles first.",
            "这里对每一整段取绝对值；穿过轴的一段要先分成两个三角形。",
          ),
        },
        {
          value: above,
          why: t("This is only the area above the axis; add the area below it too.", "这只是轴上方的面积；还要加上下方的面积。"),
        },
        {
          value: below,
          why: t("This is only the area below the axis; add the area above it too.", "这只是轴下方的面积；还要加上上方的面积。"),
        },
      ]);
      const crossing = pieces.filter((p) => p.a * p.b < 0);
      const lines = pieces.map((p) =>
        p.a * p.b < 0
          ? `[${p.from}, ${p.from + 2}]: \\quad ${p.above.toLatex()} + ${p.below.toLatex()} = ${p.above.add(p.below).toLatex()}`
          : `[${p.from}, ${p.from + 2}]: \\quad ${p.above.add(p.below).toLatex()}`,
      );
      const crossEn =
        crossing.length > 0
          ? " A piece from height $a$ to height $b$ of opposite sign crosses the axis; its two triangles have areas $\\frac{a^2}{|a| + |b|}$ and $\\frac{b^2}{|a| + |b|}$."
          : "";
      const crossZh =
        crossing.length > 0
          ? "从高度 $a$ 到异号高度 $b$ 的一段穿过轴；它的两个三角形面积为 $\\frac{a^2}{|a| + |b|}$ 和 $\\frac{b^2}{|a| + |b|}$。"
          : "";
      const total = `${pieces.map((p) => p.above.add(p.below).toLatex()).join(" + ")} = ${distance.toLatex()}`;
      const check = `${above.toLatex()} - ${below.toLatex()} = ${signed.toLatex()} = ${pieces.map((p) => (p.signed < 0 ? `(${p.signed})` : `${p.signed}`)).join(" + ")}`;
      return {
        ...numberProblem({
          prompt: t(
            "The graph shows the velocity of a particle. Find the total distance it travels from $t = 0$ to $t = 6$.",
            "图中是质点的速度。求它从 $t = 0$ 到 $t = 6$ 走过的总路程。",
          ),
          answer: distance,
          mistakes,
          solution: t(
            `**Step 1: Find the area of each piece.** Count every area as positive.${crossEn}\n\n${display(lines)}\n\n**Step 2: Add them.**\n\n$$${total}$$\n\n**Check.** The same areas, with those below the axis counted as negative, must give the signed area from the trapezoid rule, $2$ times the average height of each piece: above $${above.toLatex()}$, below $${below.toLatex()}$, and\n\n$$${check}$$`,
            `**第一步：求每段的面积。**每块面积都记为正。${crossZh}\n\n${display(lines)}\n\n**第二步：相加。**\n\n$$${total}$$\n\n**检验。**把同样的面积中轴下方的记为负，结果应等于用梯形算出的有向面积（每段为 $2$ 乘两端高度的平均）：上方 $${above.toLatex()}$，下方 $${below.toLatex()}$，而\n\n$$${check}$$`,
          ),
        }),
        figure,
      };
    },
  ),
  figure: calculusDrawings5["calculating-the-total-distance-traveled-by-a-particle#total-distance-from-a-drawn-velocity-graph"],
};

const positionDrawn = {
  ...point(
    "a-later-position-from-a-drawn-velocity-graph",
    ["A later position from a drawn velocity graph", "由所画速度图求后来的位置"],
    [
      "Position at a later time is the starting position plus the signed area under the velocity graph up to that time: $s(T) = s(0) + \\int_0^T v\\,dt$. For example, if $s(0) = 3$ and the graph runs straight from $(0, 2)$ to $(2, -1)$, then $s(2) = 3 + \\frac{2 + (-1)}{2} \\cdot 2 = 4$.\n\nCheck: the piece crosses at $t = \\frac{4}{3}$; the particle moves $\\frac{4}{3}$ forward and $\\frac{1}{3}$ back, and $3 + \\frac{4}{3} - \\frac{1}{3} = 4$.\n\n> **Watch out.** Read areas, not heights: the height of the graph at $T$ is the velocity there, not the change in position.",
      "后来某时刻的位置等于起始位置加上到该时刻为止速度图下的有向面积：$s(T) = s(0) + \\int_0^T v\\,dt$。例如 $s(0) = 3$，图像从 $(0, 2)$ 直线到 $(2, -1)$，则 $s(2) = 3 + \\frac{2 + (-1)}{2} \\cdot 2 = 4$。\n\n检验：这一段在 $t = \\frac{4}{3}$ 处穿过轴；质点先前进 $\\frac{4}{3}$，再后退 $\\frac{1}{3}$，而 $3 + \\frac{4}{3} - \\frac{1}{3} = 4$。\n\n> **注意。** 要读面积，而不是高度：图像在 $T$ 处的高度是那一刻的速度，不是位置的变化量。",
    ],
    (rng) => {
      const { values, figure } = velocityGraph(rng);
      const s0 = rng.int(-6, 6);
      const count = rng.int(1, 3);
      const end = 2 * count;
      const used = velocityPieces(values.slice(0, count + 1));
      const area = values.slice(1, count + 1).reduce((n, v, i) => n + v + (values[i] as number), 0);
      const answer = s0 + area;
      const inP = (n: number) => (n < 0 ? `(${n})` : `${n}`);
      const mistakes = motionKeep(Q.of(answer), [
        {
          value: Q.of(area),
          why: t(
            `This is only the change in position; add the starting position $s(0) = ${s0}$.`,
            `这只是位置的变化量；还要加上起始位置 $s(0) = ${s0}$。`,
          ),
        },
        {
          value: Q.of(s0 - area),
          why: t(
            "This subtracts the signed area; the change in position is added to $s(0)$.",
            "这里减去了有向面积；位置的变化量应加到 $s(0)$ 上。",
          ),
        },
        {
          value: Q.of(s0 + (values[count] as number)),
          why: t(
            `This adds the height $v(${end}) = ${values[count]}$, the velocity at the end; the change in position is the area under the graph.`,
            `这里加上的是高度 $v(${end}) = ${values[count]}$，即终点的速度；位置的变化量是图像下的面积。`,
          ),
        },
        {
          value: used.above.add(used.below).add(Q.of(s0)),
          why: t(
            "This counts the area below the axis as positive; while the velocity is negative the particle moves back.",
            "这里把轴下方的面积也记为正；速度为负时质点在后退。",
          ),
        },
      ]);
      const positions = [s0, ...used.pieces.map((_, i) => used.pieces.slice(0, i + 1).reduce((n, p) => n + p.signed, s0))];
      const track = used.pieces.map((p, i) => `s(${p.from + 2}) = ${positions[i]} + ${inP(p.signed)} = ${positions[i + 1]}`);
      return {
        ...numberProblem({
          prompt: t(
            `The graph shows the velocity of a particle with $s(0) = ${s0}$. Find $s(${end})$.`,
            `图中是质点的速度，$s(0) = ${s0}$。求 $s(${end})$。`,
          ),
          answer,
          mistakes,
          solution: t(
            `**Step 1: Find the signed area.** From $0$ to $${end}$ each piece is a trapezoid of width $2$, so the signed area is the sum of the end heights of each piece:\n\n$$\\int_0^{${end}} v\\,dt = ${used.pieces.map((p) => `(${p.a} + ${inP(p.b)})`).join(" + ")} = ${area}$$\n\n**Step 2: Add the starting position.**\n\n$$s(${end}) = ${s0} + ${inP(area)} = ${answer}$$\n\n**Check.** Track the position one piece at a time:\n\n${display(track)}`,
            `**第一步：求有向面积。**从 $0$ 到 $${end}$，每段都是宽 $2$ 的梯形，所以有向面积等于各段两端高度之和：\n\n$$\\int_0^{${end}} v\\,dt = ${used.pieces.map((p) => `(${p.a} + ${inP(p.b)})`).join(" + ")} = ${area}$$\n\n**第二步：加上起始位置。**\n\n$$s(${end}) = ${s0} + ${inP(area)} = ${answer}$$\n\n**检验。**逐段追踪位置：\n\n${display(track)}`,
          ),
        }),
        figure,
      };
    },
  ),
  figure:
    calculusDrawings5["calculating-the-position-function-of-a-particle-using-integration#a-later-position-from-a-drawn-velocity-graph"],
};

const averageDrawn = {
  ...point(
    "average-velocity-from-a-drawn-velocity-graph",
    ["Average velocity from a drawn velocity graph", "由所画速度图求平均速度"],
    [
      "The average value of $v$ on an interval is $\\frac{1}{b - a}\\int_a^b v\\,dt$: the signed area divided by the length of the interval. It is not the average of the end heights unless the graph is one straight piece. For example, pieces through $(0, 2)$, $(2, -1)$, $(4, 3)$ have signed area $1 + 2 = 3$ over a length of $4$, so the average velocity is $\\frac{3}{4}$.\n\nCheck: the pieces have equal widths, so the average is also the mean of their own averages, $\\frac{1}{2}\\left(\\frac{1}{2} + 1\\right) = \\frac{3}{4}$.\n\n> **Watch out.** Divide by the length of the interval, $4$, not by the number of pieces; and the end heights give $\\frac{2 + 3}{2} = \\frac{5}{2}$, which is not the average.",
      "$v$ 在区间上的平均值为 $\\frac{1}{b - a}\\int_a^b v\\,dt$：有向面积除以区间长度。除非图像是一条直线段，否则它不等于两端高度的平均。例如过 $(0, 2)$、$(2, -1)$、$(4, 3)$ 的两段，有向面积为 $1 + 2 = 3$，区间长 $4$，所以平均速度为 $\\frac{3}{4}$。\n\n检验：各段宽度相同，所以平均值也等于各段平均值的平均，$\\frac{1}{2}\\left(\\frac{1}{2} + 1\\right) = \\frac{3}{4}$。\n\n> **注意。** 要除以区间长度 $4$，而不是段数；两端高度给出 $\\frac{2 + 3}{2} = \\frac{5}{2}$，那不是平均值。",
    ],
    (rng) => {
      const { values, signed, distance, figure } = velocityGraph(rng);
      const { pieces } = velocityPieces(values);
      const answer = signed.div(Q.of(6, 1));
      const mistakes = motionKeep(answer, [
        {
          value: signed,
          why: t(
            "This is the displacement, the signed area; divide it by the length of the interval, $6$.",
            "这是位移，即有向面积；还要除以区间长度 $6$。",
          ),
        },
        {
          value: distance.div(Q.of(6, 1)),
          why: t("This is the average speed: the area below the axis was counted as positive.", "这是平均速率：轴下方的面积被记为正了。"),
        },
        {
          value: Q.of((values[0] as number) + (values[3] as number), 2),
          why: t(
            "This averages the end heights $v(0)$ and $v(6)$; the graph is not one straight piece, so that is not the average value.",
            "这是两端高度 $v(0)$ 与 $v(6)$ 的平均；图像不是一条直线段，所以这不是平均值。",
          ),
        },
        {
          value: signed.div(Q.of(3, 1)),
          why: t(
            "This divides by the number of pieces, $3$; divide by the length of the interval, $6$.",
            "这里除以了段数 $3$；应除以区间长度 $6$。",
          ),
        },
      ]);
      const means = pieces.map((p) => Q.of(p.signed, 2));
      return {
        ...numberProblem({
          prompt: t(
            "The graph shows the velocity of a particle. Find its average velocity from $t = 0$ to $t = 6$.",
            "图中是质点的速度。求它从 $t = 0$ 到 $t = 6$ 的平均速度。",
          ),
          answer,
          mistakes,
          solution: t(
            `**Step 1: Find the signed area.** Each piece is a trapezoid of width $2$, so its signed area is the sum of its end heights:\n\n$$${pieces.map((p) => (p.signed < 0 ? `(${p.signed})` : `${p.signed}`)).join(" + ")} = ${signed.toLatex()}$$\n\n**Step 2: Divide by the length.** The interval $[0, 6]$ has length $6$:\n\n$$\\frac{${signed.toLatex()}}{6} = ${answer.toLatex()}$$\n\n**Check.** The three pieces have equal widths, so the average is the mean of their own averages, which are $${means.map((m) => m.toLatex()).join("$, $")}$:\n\n$$\\frac{1}{3}\\left(${means.map((m) => (m.sign() < 0 ? `\\left(${m.toLatex()}\\right)` : m.toLatex())).join(" + ")}\\right) = ${answer.toLatex()}$$`,
            `**第一步：求有向面积。**每段都是宽 $2$ 的梯形，它的有向面积等于两端高度之和：\n\n$$${pieces.map((p) => (p.signed < 0 ? `(${p.signed})` : `${p.signed}`)).join(" + ")} = ${signed.toLatex()}$$\n\n**第二步：除以长度。**区间 $[0, 6]$ 的长度为 $6$：\n\n$$\\frac{${signed.toLatex()}}{6} = ${answer.toLatex()}$$\n\n**检验。**三段宽度相同，所以平均值等于各段平均值的平均，各段平均值为 $${means.map((m) => m.toLatex()).join("$、$")}$：\n\n$$\\frac{1}{3}\\left(${means.map((m) => (m.sign() < 0 ? `\\left(${m.toLatex()}\\right)` : m.toLatex())).join(" + ")}\\right) = ${answer.toLatex()}$$`,
          ),
        }),
        figure,
      };
    },
  ),
  figure: calculusDrawings5["average-position-velocity-and-acceleration#average-velocity-from-a-drawn-velocity-graph"],
};

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

const parametricArea = {
  ...point(
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
  ),
  figure: calculusDrawings5["calculating-areas-bounded-by-parametric-functions#the-area-inside-a-drawn-parametric-ellipse"],
};

const parametricLength = {
  ...point(
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
  ),
  figure: calculusDrawings5["the-arc-length-of-a-parametric-curve#the-length-of-a-drawn-arc-traced-parametrically"],
};

const polarLength = {
  ...point(
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
  ),
  figure: calculusDrawings5["the-arc-length-of-a-polar-curve#the-length-of-a-drawn-polar-arc"],
};

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

const integralComparison = {
  ...point(
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
  ),
  figure: calculusDrawings5["the-integral-test#what-a-drawing-of-the-integral-test-shows"],
};

const remainderDrawn = {
  ...point(
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
  ),
  figure: calculusDrawings5["the-remainder-estimate-for-the-integral-test#a-remainder-bound-from-drawn-rectangles"],
};

const lagrangeDrawn = {
  ...point(
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
  ),
  figure: calculusDrawings5["the-lagrange-error-bound#a-taylor-error-bound-from-a-drawn-derivative"],
};

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

const coneAboutLine = {
  ...point(
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
  ),
  figure:
    calculusDrawings4[
      "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes#the-disc-method-about-a-drawn-horizontal-line"
    ],
};

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
