import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, plane, sketch } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";

// ACT Math Fundamentals, figures and units: lines read beyond the part of the graph shown, regular hexagons and
// equilateral triangles inscribed in one circle, parts of durations given in mixed units, and mixes scaled to an
// amount given in another unit.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

// ---------------------------------------------------------------------------
// Incomplete linear graphs

/** GraphedLine is a line through two lattice points of a 0–8 grid, extended past the grid by whole steps. */
interface GraphedLine {
  readonly p: Point;
  readonly q: Point;
  readonly dx: number;
  readonly dy: number;
}

/** graphedLine picks a line with positive slope through two lattice points of the grid. */
function graphedLine(rng: Rng): GraphedLine {
  for (;;) {
    const dx = rng.int(1, 4);
    const dy = rng.int(1, 5);
    if (dx === dy) continue;
    const x = rng.int(0, 8 - dx);
    const y = rng.int(0, 8 - dy);
    // Keep the two points apart so the slope is easy to read.
    if (dx + dy < 4) continue;
    return { p: [x, y], q: [x + dx, y + dy], dx, dy };
  }
}

/** lineFigure shows the grid with the line and its two marked lattice points. */
function lineFigure({ p, q }: GraphedLine): Figure {
  return {
    svg: plane({ xMin: 0, xMax: 8, yMin: 0, yMax: 8, labelEvery: 1 }, [
      { kind: "line", a: p, b: q, accent: true },
      { kind: "point", at: p },
      { kind: "point", at: q },
    ]),
    alt: t(
      `A line drawn on a grid from 0 to 8 on both axes. It passes through the marked points (${p[0]}, ${p[1]}) and (${q[0]}, ${q[1]}).`,
      `在两条坐标轴都从 0 到 8 的网格上画出一条直线，它经过标出的点 (${p[0]}, ${p[1]}) 和 (${q[0]}, ${q[1]})。`,
    ),
  };
}

/** slopeLatex writes dy/dx as a fraction or whole number. */
const slopeLatex = (dy: number, dx: number) => (dy % dx === 0 ? `${dy / dx}` : `\\frac{${dy}}{${dx}}`);

/** reasoningFromIncompleteLinearGraphs reads a line's rate from a graph and extends it past the part shown. */
export const reasoningFromIncompleteLinearGraphs = topic(
  "reasoning-from-incomplete-linear-graphs",
  t("Reasoning From Incomplete Linear Graphs", "由不完整的直线图像推理"),
  t(
    "Read the rise and run between two marked points on a graphed line, and use that constant rate to find values the graph does not show.",
    "读出图像上直线两个标记点之间的纵向变化和横向变化，并用这个不变的变化率求出图像上没有显示的值。",
  ),
  ["properties-of-lines-in-slope-intercept-form"],
  ["8.F.B.4"],
  [
    kp(
      "an-output-past-the-grid",
      t("An output past the grid", "网格之外的函数值"),
      t(
        "A line keeps the same rise for every equal run, so it can be followed past the edge of the graph without its equation. If the line goes from $(1, 2)$ to $(3, 5)$, every run of $2$ adds a rise of $3$. To reach $x = 11$ from $x = 3$ takes $\\frac{11 - 3}{2} = 4$ more runs, so $y = 5 + 4 \\cdot 3 = 17$. Count steps of the run, not single units, unless the slope is a whole number.",
        "直线每走过相同的横向距离，上升的高度都相同，所以不用写出方程，也可以沿着它延伸到图像边缘之外。若直线从 $(1, 2)$ 到 $(3, 5)$，每向右 $2$ 就上升 $3$。从 $x = 3$ 到 $x = 11$ 需要再走 $\\frac{11 - 3}{2} = 4$ 步，所以 $y = 5 + 4 \\cdot 3 = 17$。除非斜率是整数，否则要按横向步长计数，而不是按单个单位计数。",
      ),
      (rng) => {
        const line = graphedLine(rng);
        const { q, dx, dy } = line;
        const k = rng.int(3, 7);
        const x = q[0] + k * dx;
        const y = q[1] + k * dy;
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows part of a line through the marked points. If the line continues, what is its $y$-value at $x = ${x}$?`,
              `图中显示了经过标记点的一条直线的一部分。若这条直线继续延伸，它在 $x = ${x}$ 处的 $y$ 值是多少？`,
            ),
            answer: y,
            solveFor: "y",
            wrong: [q[1] + (x - q[0]) * dy, q[1] + k * dx, x + (q[1] - q[0]), q[1] + (k - 1) * dy],
            solution: t(
              `From $(${line.p[0]}, ${line.p[1]})$ to $(${q[0]}, ${q[1]})$ the line runs $${dx}$ and rises $${dy}$, a slope of $${slopeLatex(dy, dx)}$. From $x = ${q[0]}$ to $x = ${x}$ is $${x - q[0]} = ${k} \\cdot ${dx}$, that is $${k}$ more runs:${steps(`y = ${q[1]} + ${k} \\cdot ${dy} = ${y}`)}`,
              `从 $(${line.p[0]}, ${line.p[1]})$ 到 $(${q[0]}, ${q[1]})$，直线向右 $${dx}$、上升 $${dy}$，斜率为 $${slopeLatex(dy, dx)}$。从 $x = ${q[0]}$ 到 $x = ${x}$ 相差 $${x - q[0]} = ${k} \\cdot ${dx}$，即再走 $${k}$ 步：${steps(`y = ${q[1]} + ${k} \\cdot ${dy} = ${y}`)}`,
            ),
          }),
          figure: lineFigure(line),
        };
      },
    ),
    kp(
      "an-input-for-an-output-past-the-grid",
      t("An input for an output past the grid", "网格之外的函数值对应的自变量"),
      t(
        "To find where the line reaches a height above the graph, count how many rises it takes. If the line goes from $(2, 1)$ to $(5, 3)$, each run of $3$ gives a rise of $2$. To climb from $y = 3$ to $y = 15$ is $\\frac{15 - 3}{2} = 6$ rises, and each comes with a run of $3$, so $x = 5 + 6 \\cdot 3 = 23$.",
        "要求直线在图像上方某个高度处的位置，就数一数需要上升多少次。若直线从 $(2, 1)$ 到 $(5, 3)$，每向右 $3$ 上升 $2$。从 $y = 3$ 升到 $y = 15$ 需要 $\\frac{15 - 3}{2} = 6$ 次上升，每次对应向右 $3$，所以 $x = 5 + 6 \\cdot 3 = 23$。",
      ),
      (rng) => {
        const line = graphedLine(rng);
        const { q, dx, dy } = line;
        const k = rng.int(3, 7);
        const x = q[0] + k * dx;
        const y = q[1] + k * dy;
        return {
          ...numberProblem({
            prompt: t(
              `The graph shows part of a line through the marked points. If the line continues, at what $x$-value does it reach $y = ${y}$?`,
              `图中显示了经过标记点的一条直线的一部分。若这条直线继续延伸，它在 $x$ 为多少时达到 $y = ${y}$？`,
            ),
            answer: x,
            solveFor: "x",
            wrong: [q[0] + (y - q[1]) * dx, q[0] + k * dy, q[0] + (k - 1) * dx, y - (q[1] - q[0])],
            solution: t(
              `The line runs $${dx}$ for every rise of $${dy}$. From $y = ${q[1]}$ to $y = ${y}$ is $${y - q[1]} = ${k} \\cdot ${dy}$, that is $${k}$ rises, each with a run of $${dx}$:${steps(`x = ${q[0]} + ${k} \\cdot ${dx} = ${x}`)}`,
              `直线每上升 $${dy}$ 就向右 $${dx}$。从 $y = ${q[1]}$ 到 $y = ${y}$ 相差 $${y - q[1]} = ${k} \\cdot ${dy}$，即上升 $${k}$ 次，每次向右 $${dx}$：${steps(`x = ${q[0]} + ${k} \\cdot ${dx} = ${x}`)}`,
            ),
          }),
          figure: lineFigure(line),
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Inscribed special polygons

/** hexagonVertices are the vertices of a regular hexagon inscribed in a circle of radius 3 at the origin. */
const hexagonVertices: Point[] = Array.from(
  { length: 6 },
  (_, i): Point => [3 * Math.cos((Math.PI * i) / 3 + Math.PI / 2), 3 * Math.sin((Math.PI * i) / 3 + Math.PI / 2)],
);

/** hexagonFigure draws the circle, the inscribed hexagon and, when triangle is set, the triangle on alternate vertices. */
function hexagonFigure(triangle: boolean): Figure {
  const center: Point = [0, 0];
  const marks: Mark[] = [
    // sketch has no circle mark, so the circle is a fine polygon.
    {
      kind: "polygon",
      points: Array.from({ length: 96 }, (_, i): Point => [3 * Math.cos((Math.PI * i) / 48), 3 * Math.sin((Math.PI * i) / 48)]),
    },
    { kind: "polygon", points: hexagonVertices },
    ...(triangle
      ? [{ kind: "polygon" as const, points: [0, 2, 4].map((i) => hexagonVertices[i]!), accent: true }]
      : [
          { kind: "segment" as const, a: center, b: hexagonVertices[0]!, dashed: true },
          { kind: "segment" as const, a: center, b: hexagonVertices[1]!, dashed: true },
        ]),
    { kind: "dot", at: center },
  ];
  return {
    svg: sketch(marks),
    alt: triangle
      ? t(
          "A regular hexagon inscribed in a circle, with an equilateral triangle joining every other vertex of the hexagon.",
          "一个圆内接正六边形，以及连接正六边形相间顶点所成的正三角形。",
        )
      : t(
          "A regular hexagon inscribed in a circle, with radii drawn from the center to two neighboring vertices.",
          "一个圆内接正六边形，从圆心向相邻两个顶点画出半径。",
        ),
  };
}

/** reasoningFromInscribedSpecialPolygons relates a circle to the regular hexagon and equilateral triangle inscribed in it. */
export const reasoningFromInscribedSpecialPolygons = topic(
  "reasoning-from-inscribed-special-polygons",
  t("Reasoning From Inscribed Special Polygons", "由圆内接特殊多边形推理"),
  t(
    "Use the fact that a regular hexagon inscribed in a circle has sides equal to the radius, and compare it with the equilateral triangle on its alternate vertices.",
    "利用圆内接正六边形的边长等于半径这一事实，并把它与连接其相间顶点所成的正三角形进行比较。",
  ),
  ["areas-of-regular-polygons", "equilateral-triangles-inscribed-in-circles"],
  ["HSG.C.A.3"],
  [
    kp(
      "a-hexagon-and-its-circle",
      t("A hexagon and its circle", "正六边形与它的外接圆"),
      t(
        "Radii to two neighboring vertices of an inscribed regular hexagon make a $60^\\circ$ angle, and the triangle they form is isosceles with a $60^\\circ$ apex, so it is equilateral: each side of the hexagon equals the radius $r$. The perimeter is $6r$. A circle with circumference $10\\pi$ has $r = 5$, so the inscribed hexagon has perimeter $30$. Going back, a hexagon with perimeter $42$ has $r = 7$ and circumference $14\\pi$.",
        "从圆心到内接正六边形相邻两个顶点的半径夹角为 $60^\\circ$，它们构成的三角形是顶角为 $60^\\circ$ 的等腰三角形，因而是正三角形：正六边形的每条边都等于半径 $r$。周长为 $6r$。周长为 $10\\pi$ 的圆的 $r = 5$，所以内接正六边形的周长为 $30$。反过来，周长为 $42$ 的正六边形 $r = 7$，外接圆周长为 $14\\pi$。",
      ),
      (rng) => {
        const r = rng.int(2, 15);
        const given = rng.pick(["circumference", "area", "perimeter"] as const);
        const figure = hexagonFigure(false);
        if (given === "perimeter")
          return {
            ...numberProblem({
              prompt: t(
                `A regular hexagon with perimeter $${6 * r}$ is inscribed in a circle. The circumference of the circle is $k\\pi$. What is $k$?`,
                `一个周长为 $${6 * r}$ 的正六边形内接于一个圆。这个圆的周长为 $k\\pi$。$k$ 是多少？`,
              ),
              answer: 2 * r,
              solveFor: "k",
              wrong: [r, 6 * r, 12 * r, 3 * r],
              solution: t(
                `Each side of an inscribed regular hexagon equals the radius, so $r = \\frac{${6 * r}}{6} = ${r}$ and the circumference is $2\\pi \\cdot ${r} = ${2 * r}\\pi$.`,
                `内接正六边形的每条边都等于半径，所以 $r = \\frac{${6 * r}}{6} = ${r}$，圆的周长为 $2\\pi \\cdot ${r} = ${2 * r}\\pi$。`,
              ),
            }),
            figure,
          };
        const fact =
          given === "circumference"
            ? t(`circumference $${2 * r}\\pi$`, `周长为 $${2 * r}\\pi$`)
            : t(`area $${r * r}\\pi$`, `面积为 $${r * r}\\pi$`);
        const find = given === "circumference" ? `2\\pi r = ${2 * r}\\pi` : `\\pi r^{2} = ${r * r}\\pi`;
        return {
          ...numberProblem({
            prompt: t(
              `A regular hexagon is inscribed in a circle with ${fact.en}. What is the perimeter of the hexagon?`,
              `一个正六边形内接于一个${fact["zh-CN"]}的圆。这个正六边形的周长是多少？`,
            ),
            answer: 6 * r,
            wrong: [12 * r, r, 3 * r, ...(given === "area" ? [6 * r * r] : [])],
            solution: t(
              `From $${find}$, $r = ${r}$. Each side of the inscribed hexagon equals the radius, so the perimeter is $6 \\cdot ${r} = ${6 * r}$.`,
              `由 $${find}$ 得 $r = ${r}$。内接正六边形的每条边都等于半径，所以周长为 $6 \\cdot ${r} = ${6 * r}$。`,
            ),
          }),
          figure,
        };
      },
    ),
    kp(
      "the-hexagon-and-the-triangle-on-alternate-vertices",
      t("The hexagon and the triangle on alternate vertices", "正六边形与相间顶点构成的三角形"),
      t(
        "Joining every other vertex of an inscribed regular hexagon gives an equilateral triangle inscribed in the same circle. With radius $r$, the triangle has area $\\frac{3\\sqrt{3}}{4}r^{2}$ and the hexagon $\\frac{3\\sqrt{3}}{2}r^{2}$, so the hexagon's area is exactly twice the triangle's. A triangle of area $9\\sqrt{3}$ goes with a hexagon of area $18\\sqrt{3}$.",
        "连接内接正六边形的相间顶点，得到内接于同一个圆的正三角形。三角形面积为 $\\frac{3\\sqrt{3}}{4}r^{2}$，正六边形面积为 $\\frac{3\\sqrt{3}}{2}r^{2}$，所以正六边形的面积恰好是三角形面积的两倍。面积为 $9\\sqrt{3}$ 的三角形对应面积为 $18\\sqrt{3}$ 的正六边形。",
      ),
      (rng) => {
        const a = rng.int(2, 40);
        const fromTriangle = rng.bool();
        const [given, asked] = fromTriangle ? [a, 2 * a] : [2 * a, a];
        return {
          ...numberProblem({
            prompt: fromTriangle
              ? t(
                  `A regular hexagon is inscribed in a circle, and an equilateral triangle is drawn on every other vertex of the hexagon. The triangle has area $${given}\\sqrt{3}$. The hexagon has area $k\\sqrt{3}$. What is $k$?`,
                  `一个正六边形内接于一个圆，连接正六边形的相间顶点画出一个正三角形。三角形的面积为 $${given}\\sqrt{3}$，正六边形的面积为 $k\\sqrt{3}$。$k$ 是多少？`,
                )
              : t(
                  `A regular hexagon with area $${given}\\sqrt{3}$ is inscribed in a circle, and an equilateral triangle is drawn on every other vertex of the hexagon. The triangle has area $k\\sqrt{3}$. What is $k$?`,
                  `一个面积为 $${given}\\sqrt{3}$ 的正六边形内接于一个圆，连接正六边形的相间顶点画出一个正三角形。三角形的面积为 $k\\sqrt{3}$。$k$ 是多少？`,
                ),
            answer: asked,
            solveFor: "k",
            wrong: fromTriangle
              ? [3 * a, 6 * a, ...[a + a / 2].filter(Number.isInteger)]
              : [4 * a, ...[a / 2, (2 * a) / 3, (2 * a) / 6].filter(Number.isInteger)],
            solution: t(
              `With radius $r$, the triangle has area $\\frac{3\\sqrt{3}}{4}r^{2}$ and the hexagon $\\frac{3\\sqrt{3}}{2}r^{2}$, so the hexagon is twice the triangle. ${fromTriangle ? `The hexagon's area is $2 \\cdot ${given}\\sqrt{3} = ${asked}\\sqrt{3}$.` : `The triangle's area is $\\frac{${given}\\sqrt{3}}{2} = ${asked}\\sqrt{3}$.`}`,
              `设半径为 $r$，三角形面积为 $\\frac{3\\sqrt{3}}{4}r^{2}$，正六边形面积为 $\\frac{3\\sqrt{3}}{2}r^{2}$，所以正六边形是三角形的两倍。${fromTriangle ? `正六边形面积为 $2 \\cdot ${given}\\sqrt{3} = ${asked}\\sqrt{3}$。` : `三角形面积为 $\\frac{${given}\\sqrt{3}}{2} = ${asked}\\sqrt{3}$。`}`,
            ),
          }),
          figure: hexagonFigure(true),
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Converted durations

/** takingAPartOfAConvertedDuration takes a fraction or percent of a duration given in mixed units. */
export const takingAPartOfAConvertedDuration = topic(
  "taking-a-part-of-a-converted-duration",
  t("Taking a Part of a Converted Duration", "取换算后时长的一部分"),
  t(
    "Convert a duration given in two units, such as hours and minutes, to the smaller unit, then take a fraction or percent of it.",
    "把用两种单位（如小时和分钟）给出的时长换算成较小的单位，再取它的几分之几或百分之几。",
  ),
  ["converting-units-of-time-to-smaller-units", "multiplying-fractions-word-problems"],
  ["5.MD.A.1"],
  [
    kp(
      "a-fraction-of-hours-and-minutes",
      t("A fraction of hours and minutes", "几小时几分钟的几分之几"),
      t(
        "Convert the whole duration to minutes before taking the fraction: $2$ hours $40$ minutes is $2 \\cdot 60 + 40 = 160$ minutes, and $\\frac{3}{4}$ of it is $120$ minutes. Treating it as $2.40$ hours, or taking the fraction of the hours alone, gives the wrong amount because an hour has $60$ minutes, not $100$.",
        "先把整个时长换算成分钟再取几分之几：$2$ 小时 $40$ 分钟是 $2 \\cdot 60 + 40 = 160$ 分钟，它的 $\\frac{3}{4}$ 是 $120$ 分钟。把它当作 $2.40$ 小时，或只对小时取几分之几，都会得到错误的结果，因为一小时是 $60$ 分钟而不是 $100$ 分钟。",
      ),
      (rng) => {
        for (;;) {
          const h = rng.int(1, 5);
          const m = rng.pick([10, 15, 20, 24, 30, 36, 40, 45, 48, 50]);
          const total = 60 * h + m;
          const den = rng.pick([2, 3, 4, 5, 6, 8]);
          const num = rng.int(1, den - 1);
          if (total % den !== 0 || gcd(num, den) !== 1) continue;
          const answer = (num * total) / den;
          return numberProblem({
            prompt: t(
              `A trip takes $${h}$ hour${h === 1 ? "" : "s"} $${m}$ minutes. How many minutes is $\\frac{${num}}{${den}}$ of the trip?`,
              `一段行程用时 $${h}$ 小时 $${m}$ 分钟。这段行程的 $\\frac{${num}}{${den}}$ 是多少分钟？`,
            ),
            answer,
            unit: "min",
            wrong: [(num * (100 * h + m)) / den, (num * 60 * h) / den, total / den, (num * 60 * h) / den + m, total - answer].filter(
              (w) => w !== answer && Number.isInteger(w),
            ),
            solution: t(
              `Convert to minutes, then take the fraction:${steps(`${h} \\cdot 60 + ${m} = ${total}`, `\\frac{${num}}{${den}} \\cdot ${total} = ${answer}`)}`,
              `先换算成分钟，再取几分之几：${steps(`${h} \\cdot 60 + ${m} = ${total}`, `\\frac{${num}}{${den}} \\cdot ${total} = ${answer}`)}`,
            ),
          });
        }
      },
    ),
    kp(
      "a-percent-of-days-and-hours",
      t("A percent of days and hours", "几天几小时的百分之几"),
      t(
        "A day has $24$ hours, so $3$ days $6$ hours is $3 \\cdot 24 + 6 = 78$ hours. $50\\%$ of it is $39$ hours. Convert first and take the percent of the single total; taking the percent of the days and the hours separately works too, but only if both parts end up in hours.",
        "一天有 $24$ 小时，所以 $3$ 天 $6$ 小时是 $3 \\cdot 24 + 6 = 78$ 小时。它的 $50\\%$ 是 $39$ 小时。先换算，再对这一个总数取百分比；把天和小时分别取百分比也可以，但两部分最后都要化成小时。",
      ),
      (rng) => {
        for (;;) {
          const d = rng.int(1, 6);
          const h = rng.int(1, 23);
          const total = 24 * d + h;
          const pct = rng.pick([10, 20, 25, 40, 50, 60, 75, 80]);
          if ((pct * total) % 100 !== 0) continue;
          const answer = (pct * total) / 100;
          return numberProblem({
            prompt: t(
              `A machine runs for $${d}$ day${d === 1 ? "" : "s"} $${h}$ hour${h === 1 ? "" : "s"}. For $${pct}\\%$ of that time it runs at full speed. For how many hours does it run at full speed?`,
              `一台机器运行了 $${d}$ 天 $${h}$ 小时，其中 $${pct}\\%$ 的时间以全速运行。它以全速运行了多少小时？`,
            ),
            answer,
            unit: "h",
            wrong: [
              (pct * (12 * d + h)) / 100,
              (pct * 24 * d) / 100,
              (pct * (10 * d + h)) / 100,
              (pct * 24 * d) / 100 + h,
              total - answer,
            ].filter((w) => w > 0 && w !== answer && Number.isInteger(w)),
            solution: t(
              `Convert to hours, then take the percent:${steps(`${d} \\cdot 24 + ${h} = ${total}`, `${pct / 100} \\cdot ${total} = ${answer}`)}`,
              `先换算成小时，再取百分比：${steps(`${d} \\cdot 24 + ${h} = ${total}`, `${pct / 100} \\cdot ${total} = ${answer}`)}`,
            ),
          });
        }
      },
    ),
  ],
);

/** gcd is the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// ---------------------------------------------------------------------------
// Mixes in converted units

/** concentrates are the ingredients of the customary mix problems. */
const concentrates: readonly { en: string; zh: string }[] = [
  { en: "lemonade concentrate", zh: "柠檬汁浓缩液" },
  { en: "liquid fertilizer", zh: "液体肥料" },
  { en: "cleaning solution", zh: "清洁剂" },
  { en: "plant food", zh: "植物营养液" },
];

/** scalingAMixAfterConvertingUnits scales a mix ratio to an amount given in a different unit. */
export const scalingAMixAfterConvertingUnits = topic(
  "scaling-a-mix-after-converting-units",
  t("Scaling a Mix After Converting Units", "换算单位后按比例调配混合物"),
  t(
    "Scale a mixing ratio to a new amount by first converting that amount to the unit the ratio uses.",
    "先把新的量换算成配比所用的单位，再按配比放大或缩小。",
  ),
  ["reasoning-with-equivalent-ratios"],
  ["6.RP.A.3.D"],
  [
    kp(
      "a-customary-mix",
      t("A customary mix", "英制单位的混合物"),
      t(
        "A mix of $3$ ounces of concentrate for every $2$ quarts of water, made with $3$ gallons of water: a gallon is $4$ quarts, so that is $12$ quarts, which is $6$ batches of $2$ quarts. It needs $6 \\cdot 3 = 18$ ounces. Scaling by the number of gallons without converting gives $\\frac{3}{2} \\cdot 3 = 4.5$ ounces, far too little.",
        "一种混合物每 $2$ 夸脱水配 $3$ 盎司浓缩液，现在用 $3$ 加仑水调配：$1$ 加仑是 $4$ 夸脱，所以共 $12$ 夸脱，相当于 $6$ 份 $2$ 夸脱。需要 $6 \\cdot 3 = 18$ 盎司。不换算就直接按加仑数放大，得到 $\\frac{3}{2} \\cdot 3 = 4.5$ 盎司，少得多。",
      ),
      (rng) => {
        for (;;) {
          const per = rng.int(2, 9);
          const quarts = rng.int(1, 5);
          const gallons = rng.int(2, 9);
          if ((4 * gallons) % quarts !== 0 || per === quarts) continue;
          const answer = (per * 4 * gallons) / quarts;
          const item = rng.pick(concentrates);
          return numberProblem({
            prompt: t(
              `A mix uses $${per}$ ounces of ${item.en} for every $${quarts}$ quart${quarts === 1 ? "" : "s"} of water. How many ounces of ${item.en} are needed for $${gallons}$ gallons of water? ($1$ gallon $= 4$ quarts.)`,
              `一种混合物每 $${quarts}$ 夸脱水配 $${per}$ 盎司${item.zh}。$${gallons}$ 加仑水需要多少盎司${item.zh}？（$1$ 加仑 $= 4$ 夸脱。）`,
            ),
            answer,
            unit: "oz",
            wrong: [
              (per * gallons) / quarts,
              per * 4 * gallons,
              (per * gallons * quarts) / 4,
              (quarts * 4 * gallons) / per,
              per * gallons,
            ].filter((w) => w !== answer && Number.isInteger(w)),
            solution: t(
              `Convert the water to quarts, count the batches, and scale:${steps(`${gallons} \\cdot 4 = ${4 * gallons} \\text{ quarts}`, `\\frac{${4 * gallons}}{${quarts}} = ${(4 * gallons) / quarts} \\text{ batches}`, `${(4 * gallons) / quarts} \\cdot ${per} = ${answer} \\text{ ounces}`)}`,
              `把水换算成夸脱，算出份数，再按比例放大：${steps(`${gallons} \\cdot 4 = ${4 * gallons} \\text{ 夸脱}`, `\\frac{${4 * gallons}}{${quarts}} = ${(4 * gallons) / quarts} \\text{ 份}`, `${(4 * gallons) / quarts} \\cdot ${per} = ${answer} \\text{ 盎司}`)}`,
            ),
          });
        }
      },
    ),
    kp(
      "a-metric-mix",
      t("A metric mix", "公制单位的混合物"),
      t(
        "A solution uses $40$ grams of salt per $2$ liters of water, so $20$ grams per liter. For $750$ milliliters, convert to liters: $750 \\text{ mL} = 0.75 \\text{ L}$, and $0.75 \\cdot 20 = 15$ grams. Using $750$ as if it were liters, or dividing by $100$ instead of $1000$, gives an answer off by a power of ten.",
        "一种溶液每 $2$ 升水配 $40$ 克盐，即每升 $20$ 克。对于 $750$ 毫升，先换算成升：$750 \\text{ mL} = 0.75 \\text{ L}$，$0.75 \\cdot 20 = 15$ 克。把 $750$ 当作升，或者除以 $100$ 而不是 $1000$，得到的结果会差十的若干次幂。",
      ),
      (rng) => {
        for (;;) {
          const liters = rng.pick([1, 2, 4, 5]);
          const grams = rng.int(2, 30) * liters;
          const ml = rng.pick([100, 200, 250, 300, 400, 500, 600, 750, 800, 1500, 2500]);
          const answer = (grams * ml) / (1000 * liters);
          if (!Number.isInteger(answer) || ml === 1000 * liters) continue;
          const solute = rng.pick([
            { en: "salt", zh: "盐" },
            { en: "sugar", zh: "糖" },
            { en: "powdered nutrient", zh: "营养粉" },
          ]);
          return numberProblem({
            prompt: t(
              `A solution is made with $${grams}$ grams of ${solute.en} for every $${liters}$ liter${liters === 1 ? "" : "s"} of water. How many grams of ${solute.en} are needed for $${ml}$ milliliters of water?`,
              `一种溶液每 $${liters}$ 升水配 $${grams}$ 克${solute.zh}。$${ml}$ 毫升水需要多少克${solute.zh}？`,
            ),
            answer,
            unit: "g",
            wrong: [answer * 10, answer * 1000, (grams * ml) / 1000, (grams * ml) / (100 * liters)].filter(
              (w) => w !== answer && Number.isInteger(w),
            ),
            solution: t(
              `Find the amount per liter and convert the water to liters:${steps(`\\frac{${grams}}{${liters}} = ${grams / liters} \\text{ g per L}`, `${ml} \\text{ mL} = ${ml / 1000} \\text{ L}`, `${ml / 1000} \\cdot ${grams / liters} = ${answer} \\text{ g}`)}`,
              `求出每升的量，并把水换算成升：${steps(`\\frac{${grams}}{${liters}} = ${grams / liters} \\text{ 克每升}`, `${ml} \\text{ mL} = ${ml / 1000} \\text{ L}`, `${ml / 1000} \\cdot ${grams / liters} = ${answer} \\text{ 克}`)}`,
            ),
          });
        }
      },
    ),
  ],
);

/** actFundamentalsFigureUnitTopics are the ACT Math Fundamentals topics on graphs, inscribed polygons and units. */
export const actFundamentalsFigureUnitTopics: TopicDef[] = [
  reasoningFromIncompleteLinearGraphs,
  reasoningFromInscribedSpecialPolygons,
  takingAPartOfAConvertedDuration,
  scalingAMixAfterConvertingUnits,
];
