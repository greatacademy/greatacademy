// Knowledge points of Multivariable Calculus that ask the learner to read a drawing: level curves, gradient
// directions, vector fields and regions of integration. See `deeperFiguresMultivariableCalculusPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd, paren, poly, Q } from "@ga/subject-math";
import { multivariableDrawings1 } from "../explanation-drawings-multivariable-1.ts";
import { multivariableDrawings2 } from "../explanation-drawings-multivariable-2.ts";
import { multivariableDrawings4 } from "../explanation-drawings-multivariable-4.ts";
import { multivariableDrawings6 } from "../explanation-drawings-multivariable-6.ts";
import { multivariableDrawings8 } from "../explanation-drawings-multivariable-8.ts";
import { explainedChoice, numberProblem, why } from "../problems.ts";
import { ask, choose, observed, type Pair, point, same } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { drawn } from "./figure-reading-more.ts";

/** square is the view from -r to r on both axes. */
const square = (r: number): PlaneView => ({ xMin: -r, xMax: r, yMin: -r, yMax: r });

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** piTimes writes the angle num/den times pi in lowest terms. */
function piTimes(num: number, den: number): string {
  if (num === 0) return "0";
  const g = gcd(Math.abs(num), den);
  const [n, d] = [Math.abs(num) / g, den / g];
  const sign = num < 0 ? "-" : "";
  const top = n === 1 ? "\\pi" : `${n}\\pi`;
  return d === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${d}}`;
}

/** word writes a level for a label in a drawing. */
const word = (v: number) => String(v).replace("-", "−");

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly ReturnType<typeof why>[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

/** field draws arrows of a vector field at the grid points from -2 to 2. */
function field(f: (x: number, y: number) => readonly [number, number], scale: number): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (let x = -2; x <= 2; x++)
    for (let y = -2; y <= 2; y++) {
      const [u, v] = f(x, y);
      marks.push({ kind: "arrow", from: [x, y], to: [x + scale * u, y + scale * v], accent: true, thin: true });
    }
  return marks;
}

interface Family {
  readonly kind: string;
  readonly tex: string;
  readonly f: (x: number, y: number) => number;
  readonly levels: readonly number[];
  readonly clue: Pair;
}

const curveFamilies: readonly Family[] = [
  {
    kind: "circle",
    tex: "x^2 + y^2",
    f: (x, y) => x * x + y * y,
    levels: [1, 4, 9],
    clue: ["circles about the origin", "以原点为圆心的圆"],
  },
  {
    kind: "circle",
    tex: "x^2 + y^2",
    f: (x, y) => x * x + y * y,
    levels: [2, 6, 12],
    clue: ["circles about the origin", "以原点为圆心的圆"],
  },
  ...[2, 4].map(
    (k): Family => ({
      kind: "ellipse",
      tex: `x^2 + ${k}y^2`,
      f: (x, y) => x * x + k * y * y,
      levels: [1, 4, 9],
      clue: ["ellipses that are longer along the $x$-axis", "沿 $x$ 轴更长的椭圆"],
    }),
  ),
  ...[2, 4].map(
    (k): Family => ({
      kind: "ellipse",
      tex: `${k}x^2 + y^2`,
      f: (x, y) => k * x * x + y * y,
      levels: [1, 4, 9],
      clue: ["ellipses that are longer along the $y$-axis", "沿 $y$ 轴更长的椭圆"],
    }),
  ),
  ...(
    [
      ["x + y", 1, 1],
      ["x - y", 1, -1],
      ["2x + y", 2, 1],
      ["x + 2y", 1, 2],
      ["2x - y", 2, -1],
      ["x - 2y", 1, -2],
    ] as const
  ).map(
    ([tex, a, b]): Family => ({
      kind: "line",
      tex,
      f: (x, y) => a * x + b * y,
      levels: [-2, 0, 2, 4],
      clue: ["parallel lines, so the function changes at a constant rate", "平行直线，所以函数以恒定的变化率变化"],
    }),
  ),
  ...[1, 2].map(
    (k): Family => ({
      kind: "parabola",
      tex: k === 1 ? "y - x^2" : `y - ${k}x^2`,
      f: (x, y) => y - k * x * x,
      levels: [-2, 0, 2],
      clue: ["parabolas that are translates of one another along the $y$-axis", "沿 $y$ 轴彼此平移的抛物线"],
    }),
  ),
  ...[1, -1].map(
    (s): Family => ({
      kind: "hyperbola",
      tex: s === 1 ? "xy" : "-xy",
      f: (x, y) => s * x * y,
      levels: [1, 4],
      clue: ["hyperbolas in one pair of opposite quadrants, with the axes as asymptotes", "位于一对相对象限的双曲线，以坐标轴为渐近线"],
    }),
  ),
];

const formulaFromLevelCurves = {
  ...point(
    "the-function-from-its-level-curves",
    ["The function from its level curves", "由等值线认函数"],
    [
      "Level curves show the shape of a function without any height. Circles about the origin belong to a sum of squares with equal coefficients, unequal coefficients stretch them into ellipses, parallel lines belong to a linear function, translated parabolas to $y$ minus a quadratic, and hyperbolas to a product of the variables.\n\nFor $f(x, y) = x^{2} - y^{2}$ the level $0$ is the pair of lines $y = \\pm x$, and the other levels are hyperbolas that open left and right or up and down, with those lines as asymptotes.\n\n> **Watch out.** Read the direction as well as the shape. For $x^{2} + 4y^{2} = c$ the variable with the larger coefficient must stay smaller, so the ellipses are longer along the $x$-axis, not the $y$-axis.",
      "等值线不用高度也能表现函数的形状。以原点为圆心的圆对应系数相等的平方和，系数不等时拉伸成椭圆，平行直线对应线性函数，平移的抛物线对应 $y$ 减二次式，双曲线对应变量之积。\n\n对 $f(x, y) = x^{2} - y^{2}$，等值 $0$ 是一对直线 $y = \\pm x$，其他等值线是向左右或上下张开的双曲线，以这两条直线为渐近线。\n\n> **注意。** 既要看形状，也要看方向。对 $x^{2} + 4y^{2} = c$，系数较大的变量必须取较小的值，所以椭圆沿 $x$ 轴更长，而不是沿 $y$ 轴。",
    ],
    (rng) => {
      const right = rng.pick(curveFamilies);
      const others = rng.shuffle(curveFamilies.filter((f) => f.kind !== right.kind));
      const kinds = new Set<string>();
      const wrong = others
        .filter((f) => !kinds.has(f.kind) && Boolean(kinds.add(f.kind)))
        .map((f) => ({
          option: t(`$${f.tex}$`, `$${f.tex}$`),
          why: t(
            `The level curves of $${f.tex}$ are ${f.clue[0]}, but the drawing shows ${right.clue[0]}.`,
            `$${f.tex}$ 的等值线是${f.clue[1]}，而图中是${right.clue[1]}。`,
          ),
        }));
      const grid = [-2, -1, 0, 1, 2, 3].flatMap((x) => [-2, -1, 0, 1, 2, 3].map((y) => [x, y] as const));
      const onCurve = [...right.levels]
        .reverse()
        .flatMap((c) => grid.filter(([x, y]) => right.f(x, y) === c && (x !== 0 || y !== 0)).map(([x, y]) => [x, y, c] as const));
      const [px, py, level] = onCurve[0] ?? [1, 1, right.f(1, 1)];
      return explainedChoice(rng, {
        prompt: t(
          "The curves drawn are level curves of a function $f(x, y)$. Which function is it?",
          "图中的曲线是函数 $f(x, y)$ 的等值线。这个函数是哪一个？",
        ),
        correct: t(`$${right.tex}$`, `$${right.tex}$`),
        wrong,
        solution: walked(
          [
            [["Read the shape", "读形状"], t(`The level curves drawn are ${right.clue[0]}.`, `图中的等值线是${right.clue[1]}。`)],
            [
              ["Match the formula", "对应公式"],
              t(
                `Setting $${right.tex} = c$ gives exactly such curves, and none of the other formulas does.`,
                `令 $${right.tex} = c$ 恰好得到这样的曲线，其他公式都不是。`,
              ),
            ],
          ],
          t(
            `The point $(${px}, ${py})$ gives $f = ${level}$, so it lies on the level curve $${right.tex} = ${level}$, one of those drawn.`,
            `点 $(${px}, ${py})$ 给出 $f = ${level}$，所以它在等值线 $${right.tex} = ${level}$ 上，这是图中的一条。`,
          ),
        ),
        figure: fig(
          square(4),
          right.levels.map((level): PlaneMark => ({ kind: "contour", f: right.f, level, accent: true })),
          [
            `Level curves in the plane: ${observed(right.clue)[0].replaceAll("$", "")}.`,
            `平面上的等值线：${observed(right.clue)[1].replaceAll("$", "")}。`,
          ],
        ),
      });
    },
  ),
  figure: multivariableDrawings2["level-curves#the-function-from-its-level-curves"],
};

const rateFromLevelCurves = point(
  "a-partial-derivative-from-level-curves",
  ["A partial derivative from level curves", "由等值线读偏导数"],
  [
    "Evenly spaced straight level curves belong to a function that changes at a constant rate. The partial derivative across them is the change in level divided by the distance between neighbouring curves. Levels that fall in the direction of the axis make it negative, and closer curves make it larger in size. If vertical lines $3$ apart carry the levels $10, 7, 4$ from left to right, then $f_{x} = \\frac{-3}{3} = -1$ and $f_{y} = 0$.\n\n> **Watch out.** Read the levels in the direction the axis increases, and divide by the spacing between neighbouring curves. A point between two curves still has the same rate: the function changes evenly between them.",
    "等距的直线等值线对应以恒定变化率变化的函数。横穿它们的偏导数等于相邻曲线的值之差除以它们之间的距离。沿坐标轴方向值下降时偏导数为负，曲线越密，其绝对值越大。若相距 $3$ 的竖直线从左到右标有 $10, 7, 4$，则 $f_{x} = \\frac{-3}{3} = -1$，$f_{y} = 0$。\n\n> **注意。** 要沿坐标轴增大的方向读值，并除以相邻曲线之间的距离。位于两条曲线之间的点变化率不变：函数在它们之间均匀变化。",
  ],
  (rng) => {
    const across = rng.bool();
    const spacing = rng.int(1, 2);
    const step = rng.nonZero(-6, 6);
    const base = rng.int(-4, 4);
    const positions = [-2, -1, 0, 1, 2].map((j) => j * spacing);
    const slope = Q.of(step, spacing);
    const name = across ? "x" : "y";
    const marks: PlaneMark[] = positions.flatMap((c, j): PlaneMark[] => {
      const level = base + j * step;
      const a: Point = across ? [c, -5] : [-5, c];
      const b: Point = across ? [c, 5] : [5, c];
      const at: Point = across ? [c, 4.4] : [4, c];
      return [
        { kind: "segment", a, b, accent: true },
        { kind: "label", at, text: word(level), dir: across ? "e" : "n" },
      ];
    });
    const pAt: Point = [spacing === 1 ? 0.5 : 1, -1.5];
    const mid = base + 2 * step;
    return {
      ...numberProblem({
        prompt: t(
          `The lines are evenly spaced level curves of $f$, each labelled with its value. What is $\\frac{\\partial f}{\\partial ${name}}$ at $P$?`,
          `这些直线是 $f$ 的等距等值线，都标有函数值。$\\frac{\\partial f}{\\partial ${name}}$ 在 $P$ 处是多少？`,
        ),
        answer: slope,
        mistakes: apart(slope, [
          why(
            slope.neg(),
            `Read the levels in the direction of increasing $${name}$: they ${step > 0 ? "rise" : "fall"} by $${Math.abs(step)}$ per curve.`,
            `要沿 $${name}$ 增大的方向读值：每过一条曲线值${step > 0 ? "增加" : "减少"} $${Math.abs(step)}$。`,
          ),
          why(
            step,
            `$${step}$ is the change between neighbouring curves; divide it by their spacing $${spacing}$.`,
            `$${step}$ 是相邻曲线的值之差；还要除以它们的间距 $${spacing}$。`,
          ),
          why(
            Q.of(spacing, step),
            "That is distance over change; the rate divides the change in value by the distance.",
            "那是距离除以变化量；变化率是函数值的变化除以距离。",
          ),
          why(
            0,
            `$P$ need not lie on a curve: the value of $f$ changes evenly across the $${name}$-direction everywhere.`,
            `$P$ 不必在曲线上：$f$ 的值在 $${name}$ 方向上处处均匀变化。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Read the spacing and the step", "读出间距和值之差"],
              t(
                `Neighbouring curves are $${spacing}$ apart along the $${name}$-axis, and the value changes by $${step}$ from one to the next as $${name}$ increases.`,
                `相邻曲线沿 $${name}$ 轴相距 $${spacing}$，随 $${name}$ 增大，每过一条值变化 $${step}$。`,
              ),
            ],
            [
              ["Divide", "相除"],
              t(
                `$\\frac{\\partial f}{\\partial ${name}} = \\frac{${step}}{${spacing}} = ${slope.toLatex()}$, the same at every point, $P$ included.`,
                `$\\frac{\\partial f}{\\partial ${name}} = \\frac{${step}}{${spacing}} = ${slope.toLatex()}$，处处相同，$P$ 处也是。`,
              ),
            ],
          ],
          t(
            `Over two spacings, from $${name} = 0$ to $${name} = ${2 * spacing}$, the level goes from $${mid}$ to $${mid + 2 * step}$, and $\\frac{${2 * step}}{${2 * spacing}} = ${slope.toLatex()}$ again.`,
            `跨两个间距，从 $${name} = 0$ 到 $${name} = ${2 * spacing}$，值从 $${mid}$ 变到 $${mid + 2 * step}$，而 $\\frac{${2 * step}}{${2 * spacing}} = ${slope.toLatex()}$，结果一致。`,
          ),
        ),
      }),
      figure: fig(
        square(5),
        [...marks, { kind: "point", at: across ? pAt : [pAt[1], pAt[0]], label: "P", dir: "s" }],
        [
          `Parallel ${across ? "vertical" : "horizontal"} level curves ${spacing} apart with levels rising by ${step}, and a point P.`,
          `相距 ${spacing} 的平行${across ? "竖直" : "水平"}等值线，值每次增加 ${step}，以及点 P。`,
        ],
      ),
    };
  },
);

const gradientArrow = {
  ...point(
    "the-gradient-arrow-among-four",
    ["The gradient arrow among four", "四个箭头中的梯度"],
    [
      "The gradient at a point is perpendicular to the level curve through that point and points toward higher values of the function. So two conditions decide it: the arrow must cross the level curve at a right angle, and it must point to the side where the level labels increase. Arrows along the curve show no change at all. If the level curves are the parallel lines $x + y = 1$, $x + y = 2$ and $x + y = 3$, the gradient at every point points along $\\langle 1, 1 \\rangle$, across the lines toward the larger labels.\n\n> **Watch out.** Being perpendicular is not enough: of the two perpendicular arrows, only the one toward larger labels is the gradient; the other is $-\\nabla f$.",
      "一点处的梯度垂直于过该点的等值线，并指向函数值增大的方向。所以由两个条件决定：箭头必须与等值线成直角相交，并指向等值标记增大的一侧。沿曲线的箭头表示函数值没有变化。如果等值线是平行直线 $x + y = 1$、$x + y = 2$、$x + y = 3$，那么每一点的梯度都沿 $\\langle 1, 1 \\rangle$ 方向，穿过这些直线指向标记更大的一侧。\n\n> **注意。** 仅仅垂直是不够的：两个垂直的箭头中，只有指向标记更大一侧的才是梯度；另一个是 $-\\nabla f$。",
    ],
    (rng) => {
      const [x, y] = rng.pick<Point>([
        [3, 4],
        [4, 3],
        [-3, 4],
        [-4, 3],
        [3, -4],
        [4, -3],
        [-3, -4],
        [-4, -3],
      ]);
      const rising = rng.bool();
      const low = rng.int(1, 9);
      const step = rng.int(1, 5);
      const levels = (rising ? [0, 1, 2] : [2, 1, 0]).map((j) => low + j * step);
      const out: Point = [x / 5, y / 5];
      const along: Point = [-y / 5, x / 5];
      const tips: Point[] = [
        [out[0] * 1.8, out[1] * 1.8],
        [-out[0] * 1.8, -out[1] * 1.8],
        [along[0] * 1.8, along[1] * 1.8],
        [-along[0] * 1.8, -along[1] * 1.8],
      ];
      const letters = rng.shuffle(["A", "B", "C", "D"]);
      const correct = letters[rising ? 0 : 1] as string;
      const compass = ([u, v]: Point) => (Math.abs(u) > Math.abs(v) ? (u > 0 ? "e" : "w") : v > 0 ? "n" : "s") as "e" | "w" | "n" | "s";
      const marks: PlaneMark[] = [3, 5, 7].flatMap((r, j): PlaneMark[] => [
        { kind: "circle", center: [0, 0], r },
        { kind: "label", at: [0, r], text: word(levels[j] as number), dir: "ne" },
      ]);
      for (const [i, tip] of tips.entries()) {
        const to: Point = [x + tip[0], y + tip[1]];
        marks.push(
          { kind: "arrow", from: [x, y], to, accent: true },
          { kind: "label", at: to, text: letters[i] as string, dir: compass(tip) },
        );
      }
      const opposite = letters[rising ? 1 : 0] as string;
      const next = levels[rising ? 2 : 0] as number;
      const arrow = (l: string) => t(`Arrow ${l}`, `箭头 ${l}`);
      const tangentWhy = t(
        "This arrow runs along the circle, where $f$ does not change; the gradient crosses the level curve at a right angle.",
        "这个箭头沿着圆，$f$ 在该方向上不变；梯度与等值线成直角相交。",
      );
      return explainedChoice(rng, {
        prompt: t(
          "The circles are level curves of $f$, each labelled with its value. Which arrow at the marked point shows the direction of the gradient of $f$?",
          "这些圆是 $f$ 的等值线，都标有函数值。标记点处哪个箭头表示 $f$ 的梯度方向？",
        ),
        correct: arrow(correct),
        wrong: [
          {
            option: arrow(opposite),
            why: t(
              `This arrow is perpendicular to the circle but points ${rising ? "inward" : "outward"}, toward smaller values of $f$.`,
              `这个箭头垂直于圆，但指向${rising ? "内" : "外"}侧，即 $f$ 减小的方向。`,
            ),
          },
          { option: arrow(letters[2] as string), why: tangentWhy },
          { option: arrow(letters[3] as string), why: tangentWhy },
        ],
        solution: walked(
          [
            [
              ["Keep the perpendicular arrows", "保留垂直的箭头"],
              t(
                `The gradient is perpendicular to the circle through the point, so it is arrow ${correct} or arrow ${opposite}, along the radius.`,
                `梯度垂直于过该点的圆，所以是沿半径的箭头 ${correct} 或箭头 ${opposite}。`,
              ),
            ],
            [
              ["Pick the rising side", "选择增大的一侧"],
              t(
                `The labels ${rising ? "rise away from the origin" : "rise toward the origin"}, so the gradient points ${rising ? "outward" : "inward"}: arrow ${correct}.`,
                `标记的值${rising ? "向远离原点的方向增大" : "向靠近原点的方向增大"}，所以梯度指向${rising ? "外" : "内"}：箭头 ${correct}。`,
              ),
            ],
          ],
          t(
            `Following arrow ${correct} leads toward the circle labelled $${next}$, larger than the value $${levels[1]}$ at the point.`,
            `沿箭头 ${correct} 前进会走向标有 $${next}$ 的圆，比该点的值 $${levels[1]}$ 大。`,
          ),
        ),
        figure: fig(
          square(8),
          [...marks, { kind: "point", at: [x, y] }],
          [
            `Three circles about the origin labelled ${levels.join(", ")} from the inside out, and four arrows at (${x}, ${y}).`,
            `三个以原点为圆心的圆，由内向外标有 ${levels.join("，")}，以及位于 (${x}, ${y}) 的四个箭头。`,
          ],
        ),
      });
    },
  ),
  figure: multivariableDrawings2["the-gradient-as-a-normal-vector#the-gradient-arrow-among-four"],
};

const tangentSlope = {
  ...point(
    "the-tangent-to-a-drawn-level-curve",
    ["The tangent to a drawn level curve", "图中等值线的切线"],
    [
      "A tangent line to a level curve is perpendicular to the gradient there. For a circular level curve the gradient runs along the radius, so the tangent has the negative reciprocal of the slope of the radius. Reading the center and the point from the drawing gives the slope of the radius at once. For a circle centered at $(2, 1)$ through $(7, 13)$, the radius has slope $\\frac{12}{5}$, so the tangent there has slope $-\\frac{5}{12}$.\n\n> **Watch out.** The negative reciprocal both flips the fraction and changes its sign; doing only one of the two gives a wrong slope. Measure the radius from the center $C$, not from the origin.",
      "等值线的切线垂直于该点的梯度。对于圆形等值线，梯度沿半径方向，所以切线斜率是半径斜率的负倒数。从图中读出圆心和点，立刻得到半径的斜率。对圆心为 $(2, 1)$、经过 $(7, 13)$ 的圆，半径的斜率是 $\\frac{12}{5}$，所以该处切线的斜率是 $-\\frac{5}{12}$。\n\n> **注意。** 负倒数既要把分数倒过来，又要改变符号；只做其中一步都会得到错误的斜率。半径要从圆心 $C$ 量起，而不是从原点。",
    ],
    (rng) => {
      const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
      const [dx, dy] = rng.pick<Point>([
        [3, 4],
        [4, 3],
        [-3, 4],
        [-4, 3],
        [3, -4],
        [4, -3],
        [-3, -4],
        [-4, -3],
      ]);
      const answer = Q.of(-dx, dy);
      const radius = Q.of(dy, dx);
      return {
        ...numberProblem({
          prompt: t(
            "The circle is a level curve of $f$, with its center $C$ and a point $P$ marked. What is the slope of the tangent line to the level curve at $P$?",
            "这个圆是 $f$ 的等值线，标出了圆心 $C$ 和点 $P$。等值线在 $P$ 处的切线斜率是多少？",
          ),
          answer,
          mistakes: apart(answer, [
            why(
              radius,
              "That is the slope of the radius, the direction of the gradient; the tangent is perpendicular to it.",
              "那是半径的斜率，即梯度的方向；切线与它垂直。",
            ),
            why(
              Q.of(dx, dy),
              "The reciprocal is right, but a perpendicular slope also changes sign.",
              "倒数对了，但垂直的斜率还要改变符号。",
            ),
            why(
              Q.of(-dy, dx),
              "The sign is changed, but a perpendicular slope also flips the fraction.",
              "符号改了，但垂直的斜率还要把分数倒过来。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the radius", "读出半径"],
                t(
                  `From $C(${h}, ${k})$ to $P(${h + dx}, ${k + dy})$ the radius goes $${dx}$ across and $${dy}$ up, so its slope is $${radius.toLatex()}$.`,
                  `从 $C(${h}, ${k})$ 到 $P(${h + dx}, ${k + dy})$，半径横向 $${dx}$，纵向 $${dy}$，斜率是 $${radius.toLatex()}$。`,
                ),
              ],
              [
                ["Take the negative reciprocal", "取负倒数"],
                t(
                  `The tangent is perpendicular to the radius, so its slope is $${answer.toLatex()}$.`,
                  `切线垂直于半径，所以斜率是 $${answer.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Perpendicular slopes multiply to $-1$: $${paren(radius)} \\cdot ${paren(answer)} = -1$.`,
              `互相垂直的斜率之积为 $-1$：$${paren(radius)} \\cdot ${paren(answer)} = -1$。`,
            ),
          ),
        }),
        figure: fig(
          square(7),
          [
            { kind: "circle", center: [h, k], r: 5, accent: true },
            { kind: "point", at: [h, k], label: "C", dir: "n" },
            { kind: "point", at: [h + dx, k + dy], label: "P", dir: dy > 0 ? "n" : "s" },
          ],
          [
            `A circle with center C at (${h}, ${k}) through P at (${h + dx}, ${k + dy}).`,
            `圆心 C 位于 (${h}, ${k})、经过位于 (${h + dx}, ${k + dy}) 的 P 的圆。`,
          ],
        ),
      };
    },
  ),
  figure: multivariableDrawings2["tangent-lines-to-level-curves#the-tangent-to-a-drawn-level-curve"],
};

const fieldList: readonly { tex: string; f: (x: number, y: number) => readonly [number, number]; clue: Pair }[] = [
  { tex: "\\langle -y, x \\rangle", f: (x, y) => [-y, x], clue: ["arrows circle the origin counterclockwise", "箭头绕原点逆时针旋转"] },
  { tex: "\\langle y, -x \\rangle", f: (x, y) => [y, -x], clue: ["arrows circle the origin clockwise", "箭头绕原点顺时针旋转"] },
  { tex: "\\langle x, y \\rangle", f: (x, y) => [x, y], clue: ["arrows point straight away from the origin", "箭头背离原点"] },
  { tex: "\\langle -x, -y \\rangle", f: (x, y) => [-x, -y], clue: ["arrows point straight toward the origin", "箭头指向原点"] },
  {
    tex: "\\langle y, 0 \\rangle",
    f: (_x, y) => [y, 0],
    clue: ["arrows are horizontal and point right above the $x$-axis", "箭头水平，在 $x$ 轴上方向右"],
  },
  {
    tex: "\\langle 0, x \\rangle",
    f: (x) => [0, x],
    clue: ["arrows are vertical and point up to the right of the $y$-axis", "箭头竖直，在 $y$ 轴右侧向上"],
  },
  {
    tex: "\\langle x, 0 \\rangle",
    f: (x) => [x, 0],
    clue: ["arrows are horizontal and point away from the $y$-axis", "箭头水平，背离 $y$ 轴"],
  },
  {
    tex: "\\langle 0, y \\rangle",
    f: (_x, y) => [0, y],
    clue: ["arrows are vertical and point away from the $x$-axis", "箭头竖直，背离 $x$ 轴"],
  },
  {
    tex: "\\langle y, x \\rangle",
    f: (x, y) => [y, x],
    clue: ["arrows at $(1, 0)$ point up and arrows at $(0, 1)$ point right", "$(1, 0)$ 处的箭头向上，$(0, 1)$ 处的箭头向右"],
  },
  {
    tex: "\\langle -y, -x \\rangle",
    f: (x, y) => [-y, -x],
    clue: ["arrows at $(1, 0)$ point down and arrows at $(0, 1)$ point left", "$(1, 0)$ 处的箭头向下，$(0, 1)$ 处的箭头向左"],
  },
  {
    tex: "\\langle 1, x \\rangle",
    f: (x) => [1, x],
    clue: ["every arrow has horizontal part one, and the arrows steepen with $x$", "每个箭头的水平分量都是一，并随 $x$ 变陡"],
  },
  {
    tex: "\\langle y, 1 \\rangle",
    f: (_x, y) => [y, 1],
    clue: ["every arrow has vertical part one, and the arrows lean with $y$", "每个箭头的竖直分量都是一，并随 $y$ 倾斜"],
  },
];

const fieldFormula = point(
  "the-formula-of-a-drawn-vector-field",
  ["The formula of a drawn vector field", "图中向量场的公式"],
  [
    "A vector field attaches an arrow to each point, and a few test points identify a formula. On the positive $x$-axis, only the $x$ dependence shows, and on the positive $y$-axis only the $y$ dependence shows. Compare the arrow at $(1, 0)$ and the arrow at $(0, 1)$ with what each formula predicts there. For $\\langle x, -y \\rangle$ the arrow at $(1, 0)$ is $\\langle 1, 0 \\rangle$, pointing right, and the arrow at $(0, 1)$ is $\\langle 0, -1 \\rangle$, pointing down: the flow comes in along the $y$-axis and leaves along the $x$-axis.\n\n> **Watch out.** Read the direction of each arrow, not only whether it is horizontal or vertical: $\\langle y, 0 \\rangle$ and $\\langle x, 0 \\rangle$ both give horizontal arrows. One test point can fit several formulas, so use a point on each axis.",
    "向量场给每个点附上一个箭头，用几个测试点就能认出公式。在正 $x$ 轴上只看到对 $x$ 的依赖，在正 $y$ 轴上只看到对 $y$ 的依赖。把 $(1, 0)$ 和 $(0, 1)$ 处的箭头与各个公式的预测对照。对 $\\langle x, -y \\rangle$，$(1, 0)$ 处的箭头是 $\\langle 1, 0 \\rangle$，向右；$(0, 1)$ 处的箭头是 $\\langle 0, -1 \\rangle$，向下：流沿 $y$ 轴流入，沿 $x$ 轴流出。\n\n> **注意。** 要读出每个箭头的方向，而不只是看它水平还是竖直：$\\langle y, 0 \\rangle$ 和 $\\langle x, 0 \\rangle$ 给出的都是水平箭头。一个测试点可能符合好几个公式，所以要在两条轴上各取一点。",
  ],
  (rng) => {
    const right = rng.pick(fieldList);
    const vec = (v: readonly [number, number]) => `\\langle ${v[0]}, ${v[1]} \\rangle`;
    const points: [number, number][] = [
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const differs = (other: (typeof fieldList)[number]) => {
      const at = points.find(([x, y]) => vec(other.f(x, y)) !== vec(right.f(x, y))) ?? [1, 0];
      return t(
        `At $(${at[0]}, ${at[1]})$ this gives $${vec(other.f(at[0], at[1]))}$, but the arrow drawn there is $${vec(right.f(at[0], at[1]))}$.`,
        `在 $(${at[0]}, ${at[1]})$ 处它给出 $${vec(other.f(at[0], at[1]))}$，但图中该处的箭头是 $${vec(right.f(at[0], at[1]))}$。`,
      );
    };
    return explainedChoice(rng, {
      prompt: t("Which formula gives the vector field drawn?", "哪个公式给出图中的向量场？"),
      correct: t(`$\\mathbf{F}(x, y) = ${right.tex}$`, `$\\mathbf{F}(x, y) = ${right.tex}$`),
      wrong: rng
        .sample(
          fieldList.filter((f) => f !== right),
          3,
        )
        .map((f) => ({ option: t(`$\\mathbf{F}(x, y) = ${f.tex}$`, `$\\mathbf{F}(x, y) = ${f.tex}$`), why: differs(f) })),
      solution: walked(
        [
          [
            ["Read the drawing", "读图"],
            t(
              `In the drawing, ${right.clue[0]}: the arrows at $(1, 0)$ and $(0, 1)$ are $${vec(right.f(1, 0))}$ and $${vec(right.f(0, 1))}$, up to scale.`,
              `图中${right.clue[1]}：$(1, 0)$ 与 $(0, 1)$ 处的箭头在比例意义下为 $${vec(right.f(1, 0))}$ 和 $${vec(right.f(0, 1))}$。`,
            ),
          ],
          [
            ["Match the formula", "对应公式"],
            t(
              `Among the formulas, only $${right.tex}$ gives both of these arrows.`,
              `在这些公式中，只有 $${right.tex}$ 同时给出这两个箭头。`,
            ),
          ],
        ],
        t(
          `At a third point, $(1, 1)$, the formula gives $${vec(right.f(1, 1))}$, the arrow drawn there.`,
          `在第三个点 $(1, 1)$ 处，公式给出 $${vec(right.f(1, 1))}$，正是图中该处的箭头。`,
        ),
      ),
      figure: fig(square(3), field(right.f, 0.3), [
        `A vector field: ${right.clue[0].replaceAll("$", "")}.`,
        `一个向量场：${right.clue[1].replaceAll("$", "")}。`,
      ]),
    });
  },
);

const signs: Record<"positive" | "zero" | "negative", Pair> = {
  positive: ["positive", "正"],
  zero: ["zero", "零"],
  negative: ["negative", "负"],
};
/** signOptions asks for the sign of the divergence or curl of a drawn linear field, with a reason for each wrong option. */
const signOptions = (
  rng: Rng,
  value: number,
  prompt: Pair,
  reason: Pair,
  figure: ReturnType<typeof fig>,
  what: "divergence" | "curl",
  f: (x: number, y: number) => readonly [number, number],
) => {
  const correct = value > 0 ? signs.positive : value < 0 ? signs.negative : signs.zero;
  const [p, r] = f(1, 0);
  const [q, s] = f(0, 1);
  const name: Pair = what === "divergence" ? ["divergence", "散度"] : ["curl", "旋度"];
  const because = t(`${reason[0]}, so the ${name[0]} is ${correct[0]}.`, `${reason[1]}，所以${name[1]}为${correct[1]}。`);
  const unknown: Pair = ["It cannot be told from a drawing", "无法从图中判断"];
  const formula =
    what === "divergence"
      ? t(`$P_x + Q_y = ${p} + ${s < 0 ? `(${s})` : s} = ${p + s}$`, `$P_x + Q_y = ${p} + ${s < 0 ? `(${s})` : s} = ${p + s}$`)
      : t(`$Q_x - P_y = ${r} - ${q < 0 ? `(${q})` : q} = ${r - q}$`, `$Q_x - P_y = ${r} - ${q < 0 ? `(${q})` : q} = ${r - q}$`);
  return explainedChoice(rng, {
    prompt: t(prompt[0], prompt[1]),
    correct: t(correct[0], correct[1]),
    wrong: [signs.positive, signs.negative, signs.zero, unknown]
      .filter((o) => o !== correct)
      .map((o) => ({
        option: t(o[0], o[1]),
        why:
          o === unknown
            ? t(
                `A linear field has constant ${name[0]}, and the arrows at two test points fix it.`,
                `线性场的${name[1]}是常数，两个测试点处的箭头就能确定它。`,
              )
            : because,
      })),
    solution: walked(
      [
        [
          ["Read two arrows", "读出两个箭头"],
          t(
            `The arrow at $(1, 0)$ is $(${p}, ${r})$ and the arrow at $(0, 1)$ is $(${q}, ${s})$.`,
            `$(1, 0)$ 处的箭头是 $(${p}, ${r})$，$(0, 1)$ 处的箭头是 $(${q}, ${s})$。`,
          ),
        ],
        [["Interpret them", "解读"], because],
      ],
      t(
        `The field is $(${poly([p, "x"], [q, "y"])},\\ ${poly([r, "x"], [s, "y"])})$, so ${formula.en}.`,
        `该场为 $(${poly([p, "x"], [q, "y"])},\\ ${poly([r, "x"], [s, "y"])})$，所以 ${formula["zh-CN"]}。`,
      ),
    ),
    figure,
  });
};

const divergenceSign = {
  ...point(
    "the-sign-of-divergence-from-a-drawing",
    ["The sign of divergence from a drawing", "由图判断散度的符号"],
    [
      "Divergence measures net outflow near a point. Arrows spreading away from the point give positive divergence, arrows converging on it give negative divergence, and a field in which as much flows in as out has zero divergence. A pure rotation has zero divergence because its arrows run around circles and neither gather nor spread. For $\\langle 4x, -4y \\rangle$ the arrows come in along the $y$-axis and leave along the $x$-axis equally fast, so the divergence is $4 - 4 = 0$.\n\n> **Watch out.** A busy swirl still has zero divergence, since nothing gathers or spreads. A saddle has arrows going both in and out, and they balance only when the two rates are equal.",
      "散度度量一点附近的净流出。箭头从该点散开时散度为正，向该点汇聚时散度为负，流入与流出相等时散度为零。纯旋转的散度为零，因为箭头沿圆周运行，既不聚集也不散开。对 $\\langle 4x, -4y \\rangle$，箭头沿 $y$ 轴流入、沿 $x$ 轴流出，速率相同，所以散度为 $4 - 4 = 0$。\n\n> **注意。** 旋转得再厉害，散度仍为零，因为既不聚集也不散开。鞍形场的箭头有进有出，只有两个速率相等时才平衡。",
    ],
    (rng) => {
      const kind = rng.pick(["spread", "spread", "saddle", "turn"] as const);
      let f: (x: number, y: number) => readonly [number, number];
      let value = 0;
      let reason: Pair;
      if (kind === "spread") {
        const s = rng.sign();
        const [a, b] = [s * rng.int(1, 3), s * rng.int(1, 3)];
        f = (x, y) => [a * x, b * y];
        value = a + b;
        reason =
          s > 0
            ? ["All the arrows point away from the origin, so more flows out than in", "所有箭头都背离原点，所以流出多于流入"]
            : ["All the arrows point toward the origin, so more flows in than out", "所有箭头都指向原点，所以流入多于流出"];
      } else if (kind === "saddle") {
        const a = rng.nonZero(-3, 3);
        f = (x, y) => [a * x, -a * y];
        reason = [
          "The arrows come in along one axis and leave along the other at the same rate, so inflow and outflow balance",
          "箭头沿一条轴流入，沿另一条轴以相同速率流出，所以流入和流出平衡",
        ];
      } else {
        const k = rng.nonZero(-3, 3);
        f = (x, y) => [-k * y, k * x];
        reason = [
          "The arrows run around circles about the origin, so nothing gathers or spreads",
          "箭头绕原点沿圆周运行，所以既不聚集也不散开",
        ];
      }
      return signOptions(
        rng,
        value,
        ["The linear vector field drawn has constant divergence. What is its sign?", "图中的线性向量场散度为常数。它的符号是什么？"],
        reason,
        fig(square(3), field(f, 0.15), [
          `A linear vector field. The arrow at (1, 0) is (${f(1, 0).join(", ")}) and the arrow at (0, 1) is (${f(0, 1).join(", ")}).`,
          `一个线性向量场。(1, 0) 处的箭头是 (${f(1, 0).join(", ")})，(0, 1) 处的箭头是 (${f(0, 1).join(", ")})。`,
        ]),
        "divergence",
        f,
      );
    },
  ),
  figure: multivariableDrawings1["the-divergence-of-a-vector-field#the-sign-of-divergence-from-a-drawing"],
};

const curlSign = point(
  "the-sign-of-curl-from-a-drawing",
  ["The sign of curl from a drawing", "由图判断旋度的符号"],
  [
    "The curl of a plane field tells how a small paddle wheel would spin. It is positive when the wheel turns counterclockwise and negative when it turns clockwise. A field that only spreads or gathers does not turn the wheel at all. A shear does: arrows that grow as you move across them push one side of the wheel harder than the other. For $\\langle 0, 4x \\rangle$ the arrows point up to the right of the $y$-axis and down to its left, so a wheel at the origin turns counterclockwise and the curl $4$ is positive.\n\n> **Watch out.** A field need not circle the origin to have curl: parallel shearing arrows still spin a wheel. And a field that only spreads, even at different rates along the two axes, has zero curl.",
    "平面向量场的旋度说明小叶轮怎样转动。叶轮逆时针转时旋度为正，顺时针转时旋度为负。只散开或聚集的场完全不使叶轮转动。剪切则会：箭头沿横向变长，推动叶轮一侧比另一侧更用力。对 $\\langle 0, 4x \\rangle$，$y$ 轴右侧箭头向上、左侧向下，所以原点处的叶轮逆时针转，旋度 $4$ 为正。\n\n> **注意。** 场不必绕原点旋转才有旋度：平行的剪切箭头同样使叶轮转动。而只散开的场，即使沿两轴的速率不同，旋度也为零。",
  ],
  (rng) => {
    const kind = rng.pick(["turn", "turn", "radial", "shear"] as const);
    let f: (x: number, y: number) => readonly [number, number];
    let value = 0;
    let reason: Pair;
    if (kind === "turn") {
      const k = rng.nonZero(-3, 3);
      f = (x, y) => [-k * y, k * x];
      value = k;
      reason =
        k > 0
          ? ["The arrows circle the origin counterclockwise, which spins a wheel counterclockwise", "箭头绕原点逆时针转，使叶轮逆时针转动"]
          : ["The arrows circle the origin clockwise, which spins a wheel clockwise", "箭头绕原点顺时针转，使叶轮顺时针转动"];
    } else if (kind === "radial") {
      const [a, b] = rng.pick([
        [1, 1],
        [2, 2],
        [3, 3],
        [-1, -1],
        [-2, -2],
        [-3, -3],
        [1, 2],
        [2, 1],
        [-1, -2],
        [-2, -1],
      ] as const);
      f = (x, y) => [a * x, b * y];
      reason = [
        "Each arrow part depends only on its own variable, so the arrows spread or gather without turning a wheel",
        "每个分量只取决于自己的变量，所以箭头散开或聚集，不使叶轮转动",
      ];
    } else {
      const k = rng.nonZero(-3, 3);
      const horizontal = rng.bool();
      f = horizontal ? (_x, y) => [k * y, 0] : (x) => [0, k * x];
      value = horizontal ? -k : k;
      reason =
        value > 0
          ? ["The shearing arrows push a wheel counterclockwise", "剪切的箭头推动叶轮逆时针转动"]
          : ["The shearing arrows push a wheel clockwise", "剪切的箭头推动叶轮顺时针转动"];
    }
    return signOptions(
      rng,
      value,
      ["The linear vector field drawn has constant scalar curl. What is its sign?", "图中的线性向量场标量旋度为常数。它的符号是什么？"],
      reason,
      fig(square(3), field(f, 0.15), [
        `A linear vector field. The arrow at (1, 0) is (${f(1, 0).join(", ")}) and the arrow at (0, 1) is (${f(0, 1).join(", ")}).`,
        `一个线性向量场。(1, 0) 处的箭头是 (${f(1, 0).join(", ")})，(0, 1) 处的箭头是 (${f(0, 1).join(", ")})。`,
      ]),
      "curl",
      f,
    );
  },
);

const typeOneRegion = point(
  "the-limits-of-a-drawn-type-i-region",
  ["The limits of a drawn type I region", "图中第一型区域的积分限"],
  [
    "A type I region lies between a bottom curve and a top curve over an interval of $x$. The outer limits are the left and right ends of the region, and the inner limits are the bottom and top curves. The drawing shows which curve is on top and where the two curves meet. For the region between $y = (x - 2)^2$ and the line $y = 4$, the curves meet at $x = 0$ and $x = 4$, and the integral is $\\int_0^4 \\int_{(x - 2)^2}^{4} f(x, y)\\,dy\\,dx$.\n\n> **Watch out.** The inner integral runs from the bottom curve up to the top one, and the outer limits are where the curves meet, not the edges of the drawing.",
    "第一型区域位于 $x$ 的一个区间上的下曲线和上曲线之间。外层积分限是区域的左右端点，内层积分限是下曲线和上曲线。图显示哪条曲线在上面，以及两条曲线在哪里相交。对 $y = (x - 2)^2$ 与直线 $y = 4$ 之间的区域，两者交于 $x = 0$ 和 $x = 4$，积分为 $\\int_0^4 \\int_{(x - 2)^2}^{4} f(x, y)\\,dy\\,dx$。\n\n> **注意。** 内层积分从下曲线到上曲线，外层积分限是两曲线的交点，而不是图的边缘。",
  ],
  (rng) => {
    const c = rng.int(1, 3);
    const h = rng.int(-1, 1);
    const d = rng.int(0, 2);
    const shifted = h === 0 ? "x" : `(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})`;
    const curve = `${shifted}^2${d === 0 ? "" : ` + ${d}`}`;
    const top = c * c + d;
    const [lo, hi] = [h - c, h + c];
    const form = (x0: number, x1: number, y0: string, y1: string) => `\\int_{${x0}}^{${x1}} \\int_{${y0}}^{${y1}} f(x, y)\\,dy\\,dx`;
    const f = (x: number) => (x - h) * (x - h) + d;
    const pts = Array.from({ length: 41 }, (_, i): Point => {
      const x = lo + ((hi - lo) * i) / 40;
      return [x, f(x)];
    });
    const opt = (latex: string) => t(...same(latex));
    return explainedChoice(rng, {
      prompt: t(
        `The shaded region $R$ is bounded by the parabola $y = ${curve}$ and a horizontal line. Which iterated integral equals $\\iint_R f\\,dA$?`,
        `阴影区域 $R$ 由抛物线 $y = ${curve}$ 和一条水平线围成。哪个累次积分等于 $\\iint_R f\\,dA$？`,
      ),
      correct: opt(form(lo, hi, curve, `${top}`)),
      wrong: [
        {
          option: opt(form(lo, hi, `${top}`, curve)),
          why: t(
            `The limits are upside down: the parabola is the bottom curve and $y = ${top}$ is above it.`,
            `上下限颠倒了：抛物线是下曲线，$y = ${top}$ 在它上方。`,
          ),
        },
        {
          option: opt(form(h, hi, curve, `${top}`)),
          why: t(
            `That starts at the vertex $x = ${h}$ and covers only the right half; the region begins at $x = ${lo}$.`,
            `那从顶点 $x = ${h}$ 开始，只覆盖右半边；区域从 $x = ${lo}$ 开始。`,
          ),
        },
        {
          option: opt(form(lo, hi, "0", curve)),
          why: t(
            `That is the region under the parabola, down to $y = 0$; $R$ lies above the parabola and below $y = ${top}$.`,
            `那是抛物线下方直到 $y = 0$ 的区域；$R$ 在抛物线上方、$y = ${top}$ 下方。`,
          ),
        },
        {
          option: opt(form(lo - 1, hi + 1, curve, `${top}`)),
          why: t(
            `The line meets the parabola at $x = ${lo}$ and $x = ${hi}$; outside them the parabola is above the line.`,
            `直线与抛物线交于 $x = ${lo}$ 和 $x = ${hi}$；在它们之外抛物线在直线上方。`,
          ),
        },
      ],
      solution: walked(
        [
          [
            ["Find where the curves meet", "求交点"],
            t(
              `The horizontal line is $y = ${top}$, which meets the parabola where $${shifted}^2 = ${c * c}$, at $x = ${lo}$ and $x = ${hi}$.`,
              `水平线是 $y = ${top}$，它与抛物线相交于 $${shifted}^2 = ${c * c}$ 处，即 $x = ${lo}$ 和 $x = ${hi}$。`,
            ),
          ],
          [
            ["Order the curves", "确定上下曲线"],
            t(
              "The parabola is the bottom curve and the line is the top, which gives the inner limits.",
              "抛物线是下曲线，直线是上曲线，由此得到内层积分限。",
            ),
          ],
        ],
        t(
          `With $f = 1$ the integral is the area $\\int_{${lo}}^{${hi}} \\left(${c * c} - ${shifted}^2\\right) dx = ${Q.of(4 * c ** 3, 3).toLatex()} > 0$, so the curves are in the right order.`,
          `取 $f = 1$，积分为面积 $\\int_{${lo}}^{${hi}} \\left(${c * c} - ${shifted}^2\\right) dx = ${Q.of(4 * c ** 3, 3).toLatex()} > 0$，所以上下曲线顺序正确。`,
        ),
      ),
      figure: fig(
        { xMin: -4, xMax: 4, yMin: -1, yMax: 12 },
        [
          { kind: "polygon", points: pts },
          { kind: "curve", f, accent: true },
          { kind: "segment", a: [-4, top], b: [4, top], accent: true },
        ],
        [
          `The region between the parabola with vertex (${h}, ${d}) and the horizontal line at height ${top}.`,
          `顶点为 (${h}, ${d}) 的抛物线与高度为 ${top} 的水平线之间的区域。`,
        ],
      ),
    });
  },
);

const changeOrder = {
  ...point(
    "integrating-a-drawn-triangle-the-other-way",
    ["Integrating a drawn triangle the other way", "换一个方向积分图中的三角形"],
    [
      "To integrate with $x$ first, slice the region by horizontal lines. The outer limits are the lowest and highest values of $y$, and the inner limits say where a horizontal slice enters and leaves the region, written as functions of $y$. A line $y = mx$ must first be solved for $x$, which gives $x = y/m$. For the triangle with vertices $(0, 0)$, $(4, 0)$ and $(4, 12)$, the slanted edge $y = 3x$ becomes $x = \\frac{y}{3}$, so the integral is $\\int_0^{12} \\int_{y/3}^{4} f(x, y)\\,dx\\,dy$.\n\n> **Watch out.** The outer limit is the height of the top corner, not its $x$-coordinate, and solving $y = mx$ gives $x = \\frac{y}{m}$, not $my$.",
      "要先对 $x$ 积分，就用水平线切割区域。外层积分限是 $y$ 的最小值和最大值，内层积分限说明水平切片在哪里进入和离开区域，写成 $y$ 的函数。直线 $y = mx$ 要先解出 $x$，得 $x = y/m$。对顶点为 $(0, 0)$、$(4, 0)$、$(4, 12)$ 的三角形，斜边 $y = 3x$ 变为 $x = \\frac{y}{3}$，所以积分为 $\\int_0^{12} \\int_{y/3}^{4} f(x, y)\\,dx\\,dy$。\n\n> **注意。** 外层上限是顶角的高度，而不是它的 $x$ 坐标；由 $y = mx$ 解出的是 $x = \\frac{y}{m}$，不是 $my$。",
    ],
    (rng) => {
      const [mTop, mBottom, a] = rng.pick([
        ...[1, 2, 3, 4, 5, 6].map((v) => [1, 1, v] as const),
        ...[1, 2, 3, 4].map((v) => [2, 1, v] as const),
        ...[1, 2, 3].map((v) => [3, 1, v] as const),
        ...[2, 4, 6, 8].map((v) => [1, 2, v] as const),
      ]);
      const b = (mTop * a) / mBottom;
      const below = rng.bool();
      const inverse = mTop === 1 ? (mBottom === 1 ? "y" : `${mBottom}y`) : `\\frac{y}{${mTop}}`;
      const form = (y1: number, x0: string, x1: string) => `\\int_{0}^{${y1}} \\int_{${x0}}^{${x1}} f(x, y)\\,dx\\,dy`;
      const right = below ? form(b, inverse, `${a}`) : form(b, "0", inverse);
      const other = below ? form(b, "0", inverse) : form(b, inverse, `${a}`);
      const size = Math.max(a, b) + 1;
      const wrongSlope = mTop === 1 && mBottom === 1 ? "2y" : mTop === 1 ? "\\frac{y}{2}" : `${mTop}y`;
      const opt = (latex: string) => t(...same(latex));
      const areaCheck = below ? `\\int_0^{${b}} \\left(${a} - ${inverse}\\right) dy` : `\\int_0^{${b}} ${inverse}\\,dy`;
      return explainedChoice(rng, {
        prompt: t(
          "Which iterated integral, with $x$ integrated first, covers the shaded triangle?",
          "哪个先对 $x$ 积分的累次积分覆盖阴影三角形？",
        ),
        correct: opt(right),
        wrong: [
          {
            option: opt(other),
            why: t(
              `That is the other triangle, ${below ? "above" : "below"} the slanted edge; the shaded one lies ${below ? `between the edge and $x = ${a}$` : "between $x = 0$ and the edge"}.`,
              `那是斜边${below ? "上方" : "下方"}的另一个三角形；阴影部分在${below ? `斜边与 $x = ${a}$ 之间` : "$x = 0$ 与斜边之间"}。`,
            ),
          },
          {
            option: opt(below ? form(a, inverse, `${b}`) : form(a, "0", inverse)),
            why: t(
              `$y$ runs up to the height $${b}$ of the corner $(${a}, ${b})$, not its $x$-coordinate $${a}$.`,
              `$y$ 一直到角点 $(${a}, ${b})$ 的高度 $${b}$，而不是它的 $x$ 坐标 $${a}$。`,
            ),
          },
          {
            option: opt(below ? form(b, wrongSlope, `${a}`) : form(b, "0", wrongSlope)),
            why: t(
              `On the slanted edge through $(${a}, ${b})$, $x = ${inverse}$, not $${wrongSlope}$.`,
              `在过 $(${a}, ${b})$ 的斜边上 $x = ${inverse}$，不是 $${wrongSlope}$。`,
            ),
          },
          {
            option: opt(form(b, "0", `${a}`)),
            why: t(
              `That covers the whole rectangle $[0, ${a}] \\times [0, ${b}]$; the slanted edge cuts it in half.`,
              `那覆盖了整个矩形 $[0, ${a}] \\times [0, ${b}]$；斜边把它分成两半。`,
            ),
          },
        ],
        solution: walked(
          [
            [
              ["Solve the edge for x", "把斜边解成 x"],
              t(
                `The slanted edge runs through the origin and $(${a}, ${b})$, so on it $x = ${inverse}$.`,
                `斜边经过原点和 $(${a}, ${b})$，所以在斜边上 $x = ${inverse}$。`,
              ),
            ],
            [
              ["Read a horizontal slice", "读水平切片"],
              t(
                `A horizontal slice ${below ? `starts on that edge and ends at $x = ${a}$` : `starts at $x = 0$ and ends on that edge`}, and $y$ runs from $0$ to $${b}$.`,
                `水平切片${below ? `从斜边开始，到 $x = ${a}$ 结束` : `从 $x = 0$ 开始，到斜边结束`}，$y$ 从 $0$ 到 $${b}$。`,
              ),
            ],
          ],
          t(
            `With $f = 1$ the integral is $${areaCheck} = ${Q.of(a * b, 2).toLatex()}$, the area $\\frac{${a} \\cdot ${b}}{2}$ of the triangle.`,
            `取 $f = 1$，积分为 $${areaCheck} = ${Q.of(a * b, 2).toLatex()}$，正是三角形的面积 $\\frac{${a} \\cdot ${b}}{2}$。`,
          ),
        ),
        figure: fig(
          { xMin: -1, xMax: size, yMin: -1, yMax: size },
          [
            {
              kind: "polygon",
              points: below
                ? [
                    [0, 0],
                    [a, 0],
                    [a, b],
                  ]
                : [
                    [0, 0],
                    [0, b],
                    [a, b],
                  ],
            },
            { kind: "segment", a: [0, 0], b: [a, b], accent: true },
            { kind: "segment", a: below ? [a, 0] : [0, b], b: [a, b], accent: true },
          ],
          [
            `A shaded right triangle with vertices at the origin, (${a}, ${b}) and ${below ? `(${a}, 0)` : `(0, ${b})`}.`,
            `阴影直角三角形，顶点为原点、(${a}, ${b}) 和 ${below ? `(${a}, 0)` : `(0, ${b})`}。`,
          ],
        ),
      });
    },
  ),
  figure: multivariableDrawings4["changing-the-order-of-integration-in-double-integrals#integrating-a-drawn-triangle-the-other-way"],
};

const polarLimits = {
  ...point(
    "polar-limits-of-a-drawn-sector",
    ["Polar limits of a drawn sector", "图中扇形的极坐标积分限"],
    [
      "A sector of a ring is a rectangle in polar coordinates: the radius runs between two constants and the angle between two constants. So its limits can be read straight from the drawing. The area element in polar coordinates is $r\\,dr\\,d\\theta$, and leaving out the factor $r$ is the most common mistake.",
      "圆环的扇形在极坐标下是矩形：半径在两个常数之间，角度也在两个常数之间。所以它的积分限可以直接从图中读出。极坐标的面积元是 $r\\,dr\\,d\\theta$，漏掉因子 $r$ 是最常见的错误。",
    ],
    (rng) => {
      const k = rng.int(0, 6);
      const span = rng.int(1, Math.min(3, 8 - k));
      const r1 = rng.int(0, 2);
      const r2 = r1 + rng.int(1, 3);
      const form = (a: number, b: number, lo: number, hi: number, jac = "\\,r") =>
        `\\int_{${piTimes(a, 4)}}^{${piTimes(b, 4)}} \\int_{${lo}}^{${hi}} f${jac}\\,dr\\,d\\theta`;
      const ray = (r: number, q: number): Point => [r * Math.cos((q * Math.PI) / 4), r * Math.sin((q * Math.PI) / 4)];
      const n = 24 * span;
      const arc = (r: number) => Array.from({ length: n + 1 }, (_, i) => ray(r, k + (span * i) / n));
      const outer = arc(r2);
      const inner = r1 === 0 ? [[0, 0] as Point] : arc(r1).reverse();
      return choose(
        rng,
        ["Which integral equals $\\iint_R f\\,dA$ over the shaded region $R$?", "哪个积分等于阴影区域 $R$ 上的 $\\iint_R f\\,dA$？"],
        same(form(k, k + span, r1, r2)),
        [
          same(form(k, k + span, r1, r2, "")),
          same(form(k, k + span + 1, r1, r2)),
          same(form(k + span, k, r1, r2)),
          same(form(k, k + span, r1, r2 + 1)),
        ],
        [
          `The region runs from radius $${r1}$ to radius $${r2}$, and from angle $${piTimes(k, 4)}$ to angle $${piTimes(k + span, 4)}$. With the area element $r\\,dr\\,d\\theta$ this gives the integral.`,
          `区域从半径 $${r1}$ 到半径 $${r2}$，从角 $${piTimes(k, 4)}$ 到角 $${piTimes(k + span, 4)}$。用面积元 $r\\,dr\\,d\\theta$ 得到这个积分。`,
        ],
        fig(
          square(6),
          [
            { kind: "polygon", points: [...outer, ...inner] },
            { kind: "path", points: outer, accent: true },
            ...(r1 > 0 ? [{ kind: "path", points: arc(r1), accent: true } as PlaneMark] : []),
            { kind: "segment", a: ray(r1, k), b: ray(r2, k), accent: true },
            { kind: "segment", a: ray(r1, k + span), b: ray(r2, k + span), accent: true },
          ],
          [
            `A shaded sector from radius ${r1} to ${r2}, from ${k * 45} to ${(k + span) * 45} degrees.`,
            `阴影扇形，半径从 ${r1} 到 ${r2}，角度从 ${k * 45} 度到 ${(k + span) * 45} 度。`,
          ],
        ),
      );
    },
  ),
  figure: multivariableDrawings4["double-integrals-in-plane-polar-coordinates#polar-limits-of-a-drawn-sector"],
};

const connectedness = point(
  "connected-regions-from-a-drawing",
  ["Connected regions from a drawing", "由图判断连通区域"],
  [
    'A region is connected when any two of its points can be joined by a path inside it. It is simply connected when, in addition, every closed loop inside it can be shrunk to a point without leaving the region, which means that it has no holes. A ring is connected but not simply connected. A square with a smaller square cut from its middle is likewise connected but not simply connected, while a C-shaped strip is simply connected: the gap in the C opens to the outside, so there is no hole for a loop to go around.\n\n> **Watch out.** Simply connected includes connected, so "simply connected but not connected" never happens. A region that is not convex, such as an L or a C, can still be simply connected.',
    "区域连通，是指其中任意两点都能用区域内的路径连接。若还满足区域内每个闭回路都能在不离开区域的情况下缩成一点，也就是没有洞，则称单连通。圆环连通但不单连通。从正方形中间挖去一个小正方形，同样连通但不单连通；而 C 形带状区域是单连通的：C 的缺口通向外部，没有可供回路绕行的洞。\n\n> **注意。** 单连通本身包含连通，所以“单连通但不连通”不会出现。不是凸的区域，比如 L 形或 C 形，也可以是单连通的。",
  ],
  (rng) => {
    const kind = rng.pick(["disk", "ell", "ring", "twoHoles", "apart"] as const);
    const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
    const circle = (cx: number, cy: number, r: number, from: number, to: number) =>
      Array.from({ length: 73 }, (_, i): Point => {
        const a = from + ((to - from) * i) / 72;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      });
    const answers = {
      simple: ["connected and simply connected", "连通且单连通"] as Pair,
      holes: ["connected but not simply connected", "连通但不单连通"] as Pair,
      apart: ["not connected", "不连通"] as Pair,
      odd: ["simply connected but not connected", "单连通但不连通"] as Pair,
    };
    let marks: PlaneMark[];
    let right: Pair;
    let reason: Pair;
    if (kind === "disk") {
      const r = rng.int(2, 3);
      marks = [
        { kind: "region", halfPlanes: [], disk: { center: [h, k], r } },
        { kind: "circle", center: [h, k], r, accent: true },
      ];
      right = answers.simple;
      reason = ["The region is one piece with no holes", "区域是一整块，没有洞"];
    } else if (kind === "ell") {
      const [a, b] = [rng.int(3, 4), rng.int(3, 4)];
      const c: Point[] = [
        [h - 2, k - 2],
        [h - 2 + a, k - 2],
        [h - 2 + a, k - 1],
        [h - 1, k - 1],
        [h - 1, k - 2 + b],
        [h - 2, k - 2 + b],
        [h - 2, k - 2],
      ];
      marks = [
        { kind: "polygon", points: c },
        { kind: "path", points: c, accent: true },
      ];
      right = answers.simple;
      reason = ["The region is one piece with no holes, even though it is not convex", "区域是一整块，没有洞，尽管它不是凸的"];
    } else if (kind === "ring") {
      const R = rng.int(3, 4);
      const r = rng.int(1, 2);
      marks = [
        { kind: "polygon", points: [...circle(h, k, R, 0, 2 * Math.PI), ...circle(h, k, r, 0, -2 * Math.PI)] },
        { kind: "circle", center: [h, k], r: R, accent: true },
        { kind: "circle", center: [h, k], r, accent: true },
      ];
      right = answers.holes;
      reason = ["The region is one piece, but a loop around the hole cannot shrink to a point", "区域是一整块，但绕洞的回路不能缩成一点"];
    } else if (kind === "twoHoles") {
      const R = 4;
      const left: Point = [h - 2, k];
      const near: Point = [h + 2, k];
      marks = [
        {
          kind: "polygon",
          points: [
            ...circle(h, k, R, 0, 2 * Math.PI),
            ...circle(near[0], near[1], 1, 0, -2 * Math.PI),
            [h + 3, k],
            ...circle(left[0], left[1], 1, 0, -2 * Math.PI),
            [h + 3, k],
          ],
        },
        { kind: "circle", center: [h, k], r: R, accent: true },
        { kind: "circle", center: left, r: 1, accent: true },
        { kind: "circle", center: near, r: 1, accent: true },
      ];
      right = answers.holes;
      reason = [
        "The region is one piece, but a loop around either hole cannot shrink to a point",
        "区域是一整块，但绕任一个洞的回路都不能缩成一点",
      ];
    } else {
      const r = rng.int(1, 2);
      const [a, b]: [Point, Point] = rng.bool()
        ? [
            [-3, k],
            [3, -k],
          ]
        : [
            [h, -3],
            [-h, 3],
          ];
      marks = [
        { kind: "region", halfPlanes: [], disk: { center: a, r } },
        { kind: "region", halfPlanes: [], disk: { center: b, r } },
        { kind: "circle", center: a, r, accent: true },
        { kind: "circle", center: b, r, accent: true },
      ];
      right = answers.apart;
      reason = ["The region has two pieces that no path inside it can join", "区域有两块，区域内的路径无法把它们连接起来"];
    }
    const altText: Pair = {
      disk: ["A shaded disk.", "一个阴影圆盘。"] as Pair,
      ell: ["A shaded L-shaped region.", "一个 L 形阴影区域。"] as Pair,
      ring: [
        "A large shaded disk with a smaller unshaded disk removed from its middle.",
        "一个大的阴影圆盘，中间挖去一个较小的圆盘。",
      ] as Pair,
      twoHoles: ["A large shaded disk with two small unshaded disks removed from it.", "一个大的阴影圆盘，其中挖去两个小圆盘。"] as Pair,
      apart: ["Two shaded disks with a gap between them.", "两个阴影圆盘，中间隔开。"] as Pair,
    }[kind];
    const onePiece: Pair = [
      "It is one piece: any two of its points can be joined by a path inside it",
      "它是一整块：其中任意两点都能用区域内的路径连接",
    ];
    const whyNot = (option: Pair): Pair => {
      if (option === answers.odd)
        return ["Simply connected includes connected, so this never happens", "单连通本身包含连通，所以这种情况不会出现"];
      if (option === answers.apart) return onePiece;
      if (right === answers.apart)
        return ["It is not one piece: no path inside it joins the two disks", "它不是一整块：区域内没有路径能连接两个圆盘"];
      if (option === answers.simple)
        return ["A loop around a hole cannot be shrunk to a point inside the region", "绕洞的回路不能在区域内缩成一点"];
      return ["There is no hole: every loop inside it can be shrunk to a point", "没有洞：其中每个回路都能缩成一点"];
    };
    const holeCount = { disk: 0, ell: 0, ring: 1, twoHoles: 2, apart: 0 }[kind];
    return explainedChoice(rng, {
      prompt: t("Which description fits the shaded region?", "哪个描述符合阴影区域？"),
      correct: t(right[0], right[1]),
      wrong: [answers.simple, answers.holes, answers.apart, answers.odd]
        .filter((o) => o !== right)
        .map((o) => {
          const [en, zh] = whyNot(o);
          return { option: t(o[0], o[1]), why: t(`${en}.`, `${zh}。`) };
        }),
      solution: walked(
        [
          [
            ["Count the pieces", "数块数"],
            kind === "apart"
              ? t("The shaded region has two separate pieces, so it is not connected.", "阴影区域有两块分开的部分，所以不连通。")
              : t("The shaded region is one piece, so it is connected.", "阴影区域是一整块，所以连通。"),
          ],
          [
            ["Look for holes", "寻找洞"],
            kind === "apart"
              ? t("A region that is not connected is not simply connected either.", "不连通的区域也不是单连通的。")
              : holeCount === 0
                ? t("It has no holes, so it is simply connected.", "它没有洞，所以是单连通的。")
                : t(
                    `It has ${holeCount === 1 ? "one hole" : "two holes"}, so it is not simply connected.`,
                    `它有${holeCount === 1 ? "一个洞" : "两个洞"}，所以不是单连通的。`,
                  ),
          ],
        ],
        t(`${reason[0]}. So the region is ${right[0]}.`, `${reason[1]}。所以这个区域${right[1]}。`),
      ),
      figure: fig(square(6), marks, altText),
    });
  },
);

const openOrClosed = point(
  "open-or-closed-from-a-drawing",
  ["Open or closed from a drawing", "由图判断开集或闭集"],
  [
    "In a drawing, a dashed boundary is left out of the set and a solid boundary belongs to it. A set is open when it contains none of its boundary and closed when it contains all of its boundary. A set that contains only part of its boundary is neither open nor closed, which is a common case.\n\nA shaded half-disk with a dashed arc and a solid diameter contains the diameter but not the arc, so it is neither open nor closed.\n\n> **Watch out.** Look at every piece of the boundary before deciding: one solid edge stops a set from being open, and one dashed edge stops it from being closed. A shaded bounded region is never both open and closed.",
    "在图中，虚线边界不属于集合，实线边界属于集合。集合不含任何边界点时是开集，含全部边界点时是闭集。只含部分边界的集合既不开也不闭，这是常见情形。\n\n一个阴影半圆盘，弧是虚线、直径是实线，它含直径而不含弧，所以既不开也不闭。\n\n> **注意。** 下结论前要看边界的每一段：一条实线边就使集合不是开集，一条虚线边就使它不是闭集。有界的阴影区域绝不会既开又闭。",
  ],
  (rng) => {
    const useDisk = rng.bool(0.3);
    const [x, y] = [rng.int(-4, 0), rng.int(-4, 0)];
    const [w, h] = [rng.int(2, 4), rng.int(2, 4)];
    const r = rng.int(1, 3);
    const flags = useDisk
      ? [rng.bool()]
      : rng.pick([
          [true, true, true, true],
          [false, false, false, false],
          [true, false, true, false],
          [false, true, true, true],
          [true, true, false, true],
          [false, false, true, false],
        ]);
    const closed = flags.every(Boolean);
    const open = flags.every((f) => !f);
    const right: Pair = closed
      ? ["closed but not open", "闭但不开"]
      : open
        ? ["open but not closed", "开但不闭"]
        : ["neither open nor closed", "既不开也不闭"];
    const edges: [Point, Point][] = [
      [
        [x, y],
        [x + w, y],
      ],
      [
        [x + w, y],
        [x + w, y + h],
      ],
      [
        [x + w, y + h],
        [x, y + h],
      ],
      [
        [x, y + h],
        [x, y],
      ],
    ];
    const marks: PlaneMark[] = useDisk
      ? [
          { kind: "region", halfPlanes: [], disk: { center: [x + 1, y + 1], r } },
          { kind: "circle", center: [x + 1, y + 1], r, accent: true, dashed: open },
        ]
      : [
          {
            kind: "polygon",
            points: [
              [x, y],
              [x + w, y],
              [x + w, y + h],
              [x, y + h],
            ],
          },
          ...edges.map(([a, b], i): PlaneMark => ({ kind: "segment", a, b, accent: true, dashed: !flags[i] })),
        ];
    const options: Pair[] = [
      ["closed but not open", "闭但不开"],
      ["open but not closed", "开但不闭"],
      ["neither open nor closed", "既不开也不闭"],
      ["both open and closed", "既开又闭"],
    ];
    const solid = flags.filter(Boolean).length;
    const read: Pair = useDisk
      ? closed
        ? ["The circle around the disk is solid, so the whole boundary belongs to the set.", "圆盘周围的圆是实线，所以整个边界属于集合。"]
        : [
            "The circle around the disk is dashed, so none of the boundary belongs to the set.",
            "圆盘周围的圆是虚线，所以边界都不属于集合。",
          ]
      : [
          `Of the four edges of the rectangle, ${solid} ${solid === 1 ? "is" : "are"} solid and ${4 - solid} ${4 - solid === 1 ? "is" : "are"} dashed.`,
          `矩形的四条边中，有 ${solid} 条实线、${4 - solid} 条虚线。`,
        ];
    const verdict: Pair = closed
      ? [
          "The set contains all its boundary points, so it is closed. It is not open, because a disk around a boundary point leaves the set.",
          "集合含全部边界点，所以是闭集。它不是开集，因为边界点周围的圆盘会伸出集合。",
        ]
      : open
        ? [
            "The set contains none of its boundary points, so it is open. It is not closed, because it misses its boundary.",
            "集合不含任何边界点，所以是开集。它不是闭集，因为缺少边界。",
          ]
        : [
            "The set contains some boundary points and misses others, so it is neither open nor closed.",
            "集合含一些边界点而缺少另一些，所以既不开也不闭。",
          ];
    const whyFor = (o: Pair): Pair => {
      if (o === options[3])
        return [
          "Only the whole plane and the empty set are both open and closed; a shaded bounded region is neither of them.",
          "只有整个平面和空集既开又闭；有界的阴影区域两者都不是。",
        ];
      if (o === options[0])
        return [
          "Part of the boundary is dashed, so the set misses those boundary points, and a closed set must contain them all.",
          "边界有一部分是虚线，集合缺少这些边界点，而闭集必须含全部边界点。",
        ];
      if (o === options[1])
        return [
          "Part of the boundary is solid; a point there belongs to the set, yet every disk around it leaves the set.",
          "边界有一部分是实线；那里的点属于集合，但它周围的每个圆盘都会伸出集合。",
        ];
      return closed
        ? ["The boundary is solid all the way round, so nothing of it is missing.", "边界一圈都是实线，没有缺少任何部分。"]
        : ["The boundary is dashed all the way round, so none of it is included.", "边界一圈都是虚线，没有包含任何部分。"];
    };
    return explainedChoice(rng, {
      prompt: t(
        "The set is shaded, with dashed boundary left out and solid boundary included. Which description fits it?",
        "集合用阴影表示，虚线边界不包含，实线边界包含。哪个描述符合它？",
      ),
      correct: t(...right),
      wrong: options.filter((o) => o[0] !== right[0]).map((o) => ({ option: t(...o), why: t(...whyFor(o)) })),
      solution: walked(
        [
          [["Read the boundary", "读边界"], t(...read)],
          [["Classify the set", "判断集合"], t(...verdict)],
        ],
        t(
          closed
            ? "The complement contains none of the boundary, so it is open, as the complement of a closed set must be."
            : open
              ? "The complement contains the whole boundary, so it is closed, as the complement of an open set must be."
              : "The complement also contains part of the boundary and misses the rest, so it is neither as well, as it must be.",
          closed
            ? "补集不含任何边界点，所以是开集，闭集的补集正应如此。"
            : open
              ? "补集含全部边界，所以是闭集，开集的补集正应如此。"
              : "补集同样含一部分边界而缺少其余部分，所以也既不开也不闭，正应如此。",
        ),
      ),
      figure: fig(square(6), marks, [
        `A shaded ${useDisk ? "disk" : "rectangle"} with ${closed ? "solid" : open ? "dashed" : "partly solid, partly dashed"} boundary.`,
        `阴影${useDisk ? "圆盘" : "矩形"}，边界${closed ? "是实线" : open ? "是虚线" : "部分实线、部分虚线"}。`,
      ]),
    });
  },
);

const workInConstantField = point(
  "work-along-a-drawn-path",
  ["Work along a drawn path", "沿图中路径的功"],
  [
    "A constant vector field is conservative, so its line integral depends only on the ends of the path. The value is the field dotted with the displacement from start to finish, however the path wanders between them. Going around a closed path gives zero, and reversing the direction changes the sign.",
    "常向量场是保守场，所以它的线积分只取决于路径的两端。积分值等于向量场与从起点到终点的位移的点积，不管路径中间怎样绕行。沿闭路径积分为零，反向则变号。",
  ],
  (rng) => {
    const [p, q] = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
    const A: Point = [rng.int(-4, -1), rng.int(-4, 4)];
    const B: Point = [rng.int(1, 4), rng.int(-4, 4)];
    const mid: Point[] = [
      [rng.int(-4, 0), rng.int(-4, 4)],
      [rng.int(0, 4), rng.int(-4, 4)],
    ];
    const [dx, dy] = [B[0] - A[0], B[1] - A[1]];
    const answer = p * dx + q * dy;
    const last = mid[1] as Point;
    const length = Math.hypot(B[0] - last[0], B[1] - last[1]) || 1;
    const tail: Point = [B[0] - (0.8 * (B[0] - last[0])) / length, B[1] - (0.8 * (B[1] - last[1])) / length];
    return ask(
      [
        `The path $C$ runs from $A$ to $B$. What is $\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ for the constant field $\\mathbf{F} = \\langle ${p}, ${q} \\rangle$?`,
        `路径 $C$ 从 $A$ 到 $B$。对常向量场 $\\mathbf{F} = \\langle ${p}, ${q} \\rangle$，$\\int_C \\mathbf{F} \\cdot d\\mathbf{r}$ 是多少？`,
      ],
      answer,
      [-answer, p * B[0] + q * B[1], p * dy + q * dx, dx + dy],
      [
        `The field is conservative, so only the ends matter. The displacement from $A$ to $B$ is $(${dx}, ${dy})$, and its dot product with the field is $(${p})(${dx}) + (${q})(${dy}) = ${answer}$.`,
        `这个场是保守场，所以只有两端有关。从 $A$ 到 $B$ 的位移是 $(${dx}, ${dy})$，它与场的点积是 $(${p})(${dx}) + (${q})(${dy}) = ${answer}$。`,
      ],
      fig(
        square(5),
        [
          { kind: "path", points: [A, ...mid, B], accent: true },
          { kind: "arrow", from: tail, to: B, accent: true },
          { kind: "point", at: A, label: "A", dir: "w" },
          { kind: "point", at: B, label: "B", dir: "e" },
        ],
        [
          `A broken path from A at (${A[0]}, ${A[1]}) to B at (${B[0]}, ${B[1]}).`,
          `从位于 (${A[0]}, ${A[1]}) 的 A 到位于 (${B[0]}, ${B[1]}) 的 B 的折线路径。`,
        ],
      ),
    );
  },
);

const greenArea = {
  ...point(
    "an-area-from-greens-theorem-and-a-drawing",
    ["An area from Green's theorem and a drawing", "由格林定理和图求面积"],
    [
      "By Green's theorem, the integral $\\oint_C x\\,dy$ around a counterclockwise closed curve equals the area enclosed. So the line integral around a polygon can be found by computing the area from a drawing. When the curve runs clockwise the sign changes, so the arrows matter as much as the shape.",
      "由格林定理，沿逆时针闭曲线的积分 $\\oint_C x\\,dy$ 等于所围面积。所以沿多边形的线积分可以由图算出面积得到。曲线顺时针走时符号改变，所以箭头和形状同样重要。",
    ],
    (rng) => {
      const triangle = rng.bool();
      const [x, y] = [rng.int(-5, -1), rng.int(-5, -1)];
      const [w, h] = [rng.int(2, 5), rng.int(2, 5)];
      const ccw = rng.bool();
      const base: Point[] = triangle
        ? [
            [x, y],
            [x + w, y],
            [x, y + h],
          ]
        : [
            [x, y],
            [x + w, y],
            [x + w, y + h],
            [x, y + h],
          ];
      const order = ccw ? base : [...base].reverse();
      const area = triangle ? Q.of(w * h, 2) : Q.of(w * h);
      const answer = ccw ? area : area.neg();
      const marks: PlaneMark[] = [
        { kind: "polygon", points: base },
        { kind: "path", points: [...base, base[0] as Point], accent: true },
      ];
      order.forEach((p, i) => {
        const q = order[(i + 1) % order.length] as Point;
        const [mx, my] = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
        const length = Math.hypot(q[0] - p[0], q[1] - p[1]);
        const [ux, uy] = [(q[0] - p[0]) / length, (q[1] - p[1]) / length];
        marks.push({ kind: "arrow", from: [mx - 0.4 * ux, my - 0.4 * uy], to: [mx + 0.4 * ux, my + 0.4 * uy], accent: true });
      });
      return ask(
        [
          "The closed curve $C$ is traced along its arrows. What is $\\oint_C x\\,dy$?",
          "闭曲线 $C$ 沿箭头方向走。$\\oint_C x\\,dy$ 是多少？",
        ],
        answer,
        [answer.neg(), area.mul(Q.of(2)), Q.of(2 * (w + h))],
        [
          `The ${triangle ? "triangle" : "rectangle"} has sides $${w}$ and $${h}$, so it encloses area $${area.toLatex()}$. The curve runs ${ccw ? "counterclockwise, so the integral equals the area" : "clockwise, so the integral is minus the area"}, which is $${answer.toLatex()}$.`,
          `这个${triangle ? "三角形" : "矩形"}的两边是 $${w}$ 和 $${h}$，所以面积是 $${area.toLatex()}$。曲线是${ccw ? "逆时针，所以积分等于面积" : "顺时针，所以积分等于面积的相反数"}，即 $${answer.toLatex()}$。`,
        ],
        fig(square(6), marks, [
          `A ${triangle ? "right triangle" : "rectangle"} with sides ${w} and ${h}, traced ${ccw ? "counterclockwise" : "clockwise"}.`,
          `两边为 ${w} 和 ${h} 的${triangle ? "直角三角形" : "矩形"}，按${ccw ? "逆时针" : "顺时针"}方向走。`,
        ]),
      );
    },
  ),
  figure: multivariableDrawings6["calculating-areas-using-greens-theorem#an-area-from-greens-theorem-and-a-drawing"],
};

const centroidOfEll = {
  ...point(
    "the-center-of-mass-of-a-drawn-l-shape",
    ["The center of mass of a drawn L-shape", "图中 L 形的质心"],
    [
      "A lamina of constant density made of two rectangles has its center of mass at the average of the two rectangle centers, weighted by their areas. The larger piece pulls the result toward itself. Taking the plain average of the two centers, or the middle of the overall width, ignores the weights and gives the wrong point.",
      "由两个矩形组成的等密度薄片，其质心是两个矩形中心按面积加权的平均。较大的部分把结果拉向自己。直接平均两个中心，或取总宽度的中点，都忽略了权重，得到错误的点。",
    ],
    (rng) => {
      const a = rng.int(1, 3);
      const b = rng.int(3, 6);
      const c = rng.int(1, 4);
      const d = rng.int(1, b - 1);
      const [A1, A2] = [a * b, c * d];
      const asksX = rng.bool();
      const xBar = Q.of(A1 * a + A2 * (2 * a + c), 2 * (A1 + A2));
      const yBar = Q.of(A1 * b + A2 * d, 2 * (A1 + A2));
      const answer = asksX ? xBar : yBar;
      const plain = asksX ? Q.of(a + 2 * a + c, 4) : Q.of(b + d, 4);
      return ask(
        asksX
          ? [
              "The L-shaped lamina has constant density. What is the $x$-coordinate of its center of mass?",
              "L 形薄片密度为常数。它的质心的 $x$ 坐标是多少？",
            ]
          : [
              "The L-shaped lamina has constant density. What is the $y$-coordinate of its center of mass?",
              "L 形薄片密度为常数。它的质心的 $y$ 坐标是多少？",
            ],
        answer,
        [plain, asksX ? yBar : xBar, asksX ? Q.of(a + c, 2) : Q.of(b, 2)],
        [
          `Split the shape into rectangles of areas $${A1}$ and $${A2}$, whose centers have ${asksX ? "$x$" : "$y$"}-coordinates $${(asksX ? Q.of(a, 2) : Q.of(b, 2)).toLatex()}$ and $${(asksX ? Q.of(2 * a + c, 2) : Q.of(d, 2)).toLatex()}$. Their average weighted by area is $${answer.toLatex()}$.`,
          `把图形分成面积为 $${A1}$ 和 $${A2}$ 的两个矩形，它们中心的 ${asksX ? "$x$" : "$y$"} 坐标是 $${(asksX ? Q.of(a, 2) : Q.of(b, 2)).toLatex()}$ 和 $${(asksX ? Q.of(2 * a + c, 2) : Q.of(d, 2)).toLatex()}$。按面积加权的平均是 $${answer.toLatex()}$。`,
        ],
        fig(
          { xMin: -1, xMax: 8, yMin: -1, yMax: 8 },
          [
            {
              kind: "polygon",
              points: [
                [0, 0],
                [a + c, 0],
                [a + c, d],
                [a, d],
                [a, b],
                [0, b],
              ],
            },
            {
              kind: "path",
              points: [
                [0, 0],
                [a + c, 0],
                [a + c, d],
                [a, d],
                [a, b],
                [0, b],
                [0, 0],
              ],
              accent: true,
            },
          ],
          [
            `An L-shape: a rectangle ${a} wide and ${b} tall at the origin, with a rectangle ${c} wide and ${d} tall to its right.`,
            `L 形：原点处宽 ${a}、高 ${b} 的矩形，其右侧连着宽 ${c}、高 ${d} 的矩形。`,
          ],
        ),
      );
    },
  ),
  figure: multivariableDrawings8["moments-and-centers-of-mass-of-plane-laminas#the-center-of-mass-of-a-drawn-l-shape"],
};

/** deeperFiguresMultivariableCalculusPoints adds knowledge points of Multivariable Calculus that are answered by reading a drawing. */
export const deeperFiguresMultivariableCalculusPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "level-curves": [formulaFromLevelCurves],
  "partial-differentiability-of-multivariable-functions": [rateFromLevelCurves],
  "the-gradient-as-a-normal-vector": [gradientArrow],
  "tangent-lines-to-level-curves": [tangentSlope],
  "visualizing-vector-fields": [fieldFormula],
  "the-divergence-of-a-vector-field": [divergenceSign],
  "the-curl-of-a-vector-field": [curlSign],
  "double-integrals-over-type-i-regions": [typeOneRegion],
  "changing-the-order-of-integration-in-double-integrals": [changeOrder],
  "double-integrals-in-plane-polar-coordinates": [polarLimits],
  "connected-and-simply-connected-regions": [connectedness],
  "open-and-closed-sets": [openOrClosed],
  "conservative-vector-fields-and-closed-paths": [workInConstantField],
  "calculating-areas-using-greens-theorem": [greenArea],
  "moments-and-centers-of-mass-of-plane-laminas": [centroidOfEll],
};
