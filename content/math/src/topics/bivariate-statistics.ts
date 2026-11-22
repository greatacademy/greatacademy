import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dec, linear, num, type PlaneMark, type PlaneView, paren, plane, Q } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { choiceProblem, equationProblem, numberProblem, pointLatex, reasonChoice, steps } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

/** Pt is a data point (x, y). */
export type Pt = readonly [number, number];

/** Pair is a phrase in English and Chinese. */
export type Pair = readonly [string, string];

/** view is the first-quadrant window of the scatter plots. */
const view: PlaneView = { xMin: 0, xMax: 10, yMin: 0, yMax: 10, labelEvery: 2 };

/** plain writes a coordinate for alt text, to one decimal place. */
const plain = (v: number) => String(Math.round(v * 10) / 10);

/** scatterFigure draws data points, and any extra marks such as a trend line, in the first quadrant. */
export function scatterFigure(points: readonly Pt[], extra: readonly PlaneMark[] = [], line?: Pair): Figure {
  const marks: PlaneMark[] = [...extra, ...points.map((p): PlaneMark => ({ kind: "point", at: p }))];
  const list = points.map(([x, y]) => `(${plain(x)}, ${plain(y)})`);
  return {
    svg: plane(view, marks),
    alt: t(
      `Scatter plot of the points ${list.join(", ")}${line ? `, with ${line[0]}` : ""}.`,
      `散点图，各点为 ${list.join("、")}${line ? `，并画有${line[1]}` : ""}。`,
    ),
  };
}

/** si writes y = mx + b with fractions. */
const si = (m: Q, b: Q) => `y = ${linear(m, b)}`;

/** decLinear writes mx + b with decimal coefficients, as trend lines from data usually are. */
function decLinear(m: Q, b: Q): string {
  const head = m.eq(Q.one) ? "x" : m.eq(Q.of(-1)) ? "-x" : `${dec(m)}x`;
  if (b.isZero()) return head;
  return `${head} ${b.sign() < 0 ? "-" : "+"} ${dec(b.abs())}`;
}

/** plainLine writes y = mx + b for alt text. */
export const plainLine = (m: Q, b: Q) => `y = ${linear(m, b).replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2")}`;

/** lineMark draws the line y = mx + b. */
export const lineMark = (m: Q, b: Q, dashed = false): PlaneMark => ({
  kind: "line",
  a: [0, b.toNumber()],
  b: [1, b.add(m).toNumber()],
  accent: true,
  dashed,
});

/** near places points at the given x near the line y = mx + b, with integer y and noise up to ±noise, or returns undefined when one leaves 1…9. */
export function near(rng: Rng, xs: readonly number[], m: Q, b: Q, noise: number): Pt[] | undefined {
  const pts = xs.map((x): Pt => [x, Math.round(m.mul(Q.of(x)).add(b).toNumber()) + rng.int(-noise, noise)]);
  return pts.every(([, y]) => y >= 1 && y <= 9) ? pts : undefined;
}

/** xsOf draws n distinct x-values from 1 to 9, sorted. */
export const xsOf = (rng: Rng, n: number) => rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], n).sort((a, b) => a - b);

/** pearson is the correlation coefficient of the points, used only to classify generated data. */
export function pearson(pts: readonly Pt[]): number {
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let [sxy, sxx, syy] = [0, 0, 0];
  for (const [x, y] of pts) {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
  }
  return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
}

/** cloud draws 12 distinct points around the line through (5, 5) with the given slope, or scattered at random when slope is 0 and noise is 0. */
function cloud(rng: Rng, slope: number, noise: number): Pt[] | undefined {
  const pts: Pt[] = [];
  for (let i = 0; i < 40 && pts.length < 12; i++) {
    const x = rng.int(1, 9);
    const y = noise === 0 ? rng.int(1, 9) : Math.round(5 + slope * (x - 5)) + rng.int(-noise, noise);
    if (y < 1 || y > 9) return undefined;
    if (!pts.some((p) => p[0] === x && p[1] === y)) pts.push([x, y]);
  }
  return pts.length === 12 ? pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]) : undefined;
}

/** Strength is the kind of linear relationship shown by a scatter plot. */
type Strength = "strong+" | "weak+" | "none" | "weak-" | "strong-";

/** correlated draws a scatter plot whose correlation coefficient lies in [lo, hi]. */
function correlated(rng: Rng, lo: number, hi: number): Pt[] {
  for (;;) {
    const target = (lo + hi) / 2;
    const sign = target < 0 ? -1 : 1;
    const strong = Math.abs(target) >= 0.8;
    const zero = Math.abs(target) < 0.2;
    const slope = zero ? 0 : sign * rng.pick(strong ? [0.75, 1] : [0.5, 0.75]);
    const pts = cloud(rng, slope, zero ? 0 : strong ? 1 : rng.int(2, 3));
    if (!pts) continue;
    const r = pearson(pts);
    if (r >= lo && r <= hi) return pts;
  }
}

/** strengthRange is the range of r used to draw data of each strength. */
const strengthRange: Record<Strength, readonly [number, number]> = {
  "strong+": [0.9, 1],
  "weak+": [0.3, 0.6],
  none: [-0.12, 0.12],
  "weak-": [-0.6, -0.3],
  "strong-": [-1, -0.9],
};

/** shuffledChoice builds a choice problem from the correct option and the wrong ones, in random order. */
export function shuffledChoice(rng: Rng, p: { prompt: Text; correct: Text; wrong: readonly Text[]; solution: Text }) {
  const options = rng.shuffle([p.correct, ...p.wrong]);
  return choiceProblem({ prompt: p.prompt, options, correct: options.indexOf(p.correct), solution: p.solution });
}

/** decimalForm asks for a decimal answer when the answer is not an integer. */
const decimalForm = (v: Q) => (v.isInteger() ? {} : { form: "decimal" as const });

/** Scene is a small data set drawn on a scatter plot. */
export interface Scene {
  /** items counts the items with their measure word: "students" / "名学生". */
  readonly items: Pair;
  readonly item: Pair;
  readonly x: Pair;
  readonly y: Pair;
  readonly dir: 1 | -1;
}

/** scenes are the stories of the scatter plots: what the items and the two variables are. */
export const scenes: readonly Scene[] = [
  {
    items: ["students", "名学生"],
    item: ["student", "名学生"],
    x: ["hours studied", "学习时长（小时）"],
    y: ["quiz score", "测验分数"],
    dir: 1,
  },
  {
    items: ["cars", "辆汽车"],
    item: ["car", "辆汽车"],
    x: ["age in years", "车龄（年）"],
    y: ["value in thousands of dollars", "价值（千美元）"],
    dir: -1,
  },
  {
    items: ["days", "天"],
    item: ["day", "天"],
    x: ["hours of sunshine", "日照时长（小时）"],
    y: ["number of park visitors (in hundreds)", "公园游客数（百人）"],
    dir: 1,
  },
  {
    items: ["plants", "株植物"],
    item: ["plant", "株植物"],
    x: ["age in weeks", "生长周数"],
    y: ["height in decimeters", "高度（分米）"],
    dir: 1,
  },
  {
    items: ["shoppers", "位顾客"],
    item: ["shopper", "位顾客"],
    x: ["distance from home to the store in kilometers", "家到商店的距离（千米）"],
    y: ["number of visits to the store last month", "上个月光顾商店的次数"],
    dir: -1,
  },
];

/** sceneIntro says what the points of a scatter plot stand for. */
export const sceneIntro = (s: Scene, n: number) =>
  t(
    `The scatter plot shows data for ${n} ${s.items[0]}: $x$ is the ${s.x[0]} and $y$ is the ${s.y[0]}.`,
    `散点图显示了 ${n} ${s.items[1]}的数据：$x$ 表示${s.x[1]}，$y$ 表示${s.y[1]}。`,
  );

/** sceneData draws n points with distinct x-values following the direction of a scene. */
function sceneData(rng: Rng, s: Scene, n: number): Pt[] {
  for (;;) {
    const m = Q.of(s.dir * rng.int(2, 4), 4);
    const pts = near(rng, xsOf(rng, n), m, Q.of(5).sub(m.mul(Q.of(5))), 2);
    if (pts) return pts;
  }
}

/** studyIntro is a scatter plot of hours studied and quiz scores, with the student (4, 7) marked. */
const studyIntro: Figure = scatterFigure(
  [
    [1, 3],
    [2, 4],
    [3, 4],
    [5, 6],
    [6, 8],
    [7, 7],
    [8, 9],
  ],
  [{ kind: "point", at: [4, 7], accent: true, label: "(4, 7)", dir: "nw" }],
  ["the point (4, 7) marked", "标出的点 (4, 7)"],
);

/** readMarks draws the guides from the axes to a data point and marks the point. */
const readMarks = ([x, y]: Pt): PlaneMark[] => [
  { kind: "segment", a: [x, 0], b: [x, y], dashed: true },
  { kind: "segment", a: [0, y], b: [x, y], dashed: true },
  { kind: "point", at: [x, y], accent: true, label: `(${x}, ${y})`, dir: "ne" },
];

export const scatterPlots: TopicDef = {
  id: "scatter-plots",
  title: t("Scatter Plots", "散点图"),
  summary: t(
    "Show paired data as points in the coordinate plane, and read data from a scatter plot.",
    "把成对的数据表示为坐标平面上的点，并从散点图中读取数据。",
  ),
  prerequisites: ["the-coordinate-plane"],
  encompasses: [{ topic: "the-coordinate-plane", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.8.SP.A.1"],
  intro: t(
    `A point $(x, y)$ of the coordinate plane is a pair of numbers: go right $x$, then up $y$. Data often come in exactly such pairs. For each student of a class we may know two things, the hours the student studied and the score the student got, and the interesting question is how the two go together.

A **scatter plot** answers it at a glance: each student becomes one point, with the hours on the $x$-axis and the score on the $y$-axis. The student who studied $4$ hours and scored $7$ is the point $(4, 7)$:

{{figure 0}}

Seen together, the points show a pattern no table shows as quickly: students who studied longer tended to score higher. In this lesson we read single items from a scatter plot, count the points that meet a condition, and plot data from a table.`,
    `坐标平面上的点 $(x, y)$ 就是一对数：先向右走 $x$，再向上走 $y$。数据常常正好成对出现。对班上每名学生，我们可能知道两件事：学习时长和得分，而值得关心的是这两者之间有什么联系。

**散点图**让人一眼看出答案：每名学生画成一个点，学习时长对应 $x$ 轴，得分对应 $y$ 轴。学习 $4$ 小时、得 $7$ 分的学生就是点 $(4, 7)$：

{{figure 0}}

把所有点放在一起，就能看出表格难以迅速显示的规律：学得越久的学生，得分往往越高。这节课我们从散点图中读出单个对象的数据，数出满足条件的点，并由表格画出散点图。`,
  ),
  introFigures: [studyIntro],
  knowledgePoints: [
    {
      id: "reading-a-scatter-plot",
      figure: gradeDrawings5["scatter-plots#reading-a-scatter-plot"],
      title: t("Reading a scatter plot", "读散点图"),
      explanation: t(
        `**Bivariate data** pair two measurements of each item, such as the hours a student studied and the score the student got. A **scatter plot** shows each pair as one point $(x, y)$: the first variable on the $x$-axis, the second on the $y$-axis. So reading the data of one item means finding its point and reading both coordinates, the first across and the second up.

If the student who studied $4$ hours is the point $(4, 7)$, go up from $4$ on the $x$-axis to the point, then across to the $y$-axis: that student scored $7$.

> **Watch out.** Read the coordinate that was asked for: the $x$-value is read on the horizontal axis, the $y$-value on the vertical one, so do not answer with the other coordinate. And use the point exactly above (or level with) the given value, not a neighboring point.`,
        `**双变量数据**对每个对象记录两项测量，例如学生的学习时长和他的得分。**散点图**把每一对数据画成一个点 $(x, y)$：第一个变量对应 $x$ 轴，第二个变量对应 $y$ 轴。所以读出某个对象的数据，就是找到它的点，读出两个坐标：第一个看横向，第二个看纵向。

如果学习 $4$ 小时的学生对应点 $(4, 7)$，就从 $x$ 轴上的 $4$ 向上找到这个点，再水平看向 $y$ 轴：这名学生得了 $7$ 分。

> **注意。** 要读题目问的那个坐标：$x$ 值在横轴上读，$y$ 值在纵轴上读，不要答成另一个坐标。还要用正好在给定值上方（或与它等高）的那个点，而不是旁边的点。`,
      ),
      keyPrerequisites: ["the-coordinate-plane"],
      generate(rng) {
        const s = rng.pick(scenes);
        const n = rng.int(6, 8);
        const pts = sceneData(rng, s, n);
        const i = rng.int(0, n - 1);
        const [x0, y0] = pts[i]!;
        const neighbor = pts[i === 0 ? 1 : i - 1]!;
        const intro = sceneIntro(s, n);
        const figure = scatterFigure(pts);
        const solutionFigure = scatterFigure(pts, readMarks([x0, y0]), [
          `guides from the axes to the point (${x0}, ${y0})`,
          `从坐标轴到点 (${x0}, ${y0}) 的辅助线`,
        ]);
        const uniqueY = pts.filter((p) => p[1] === y0).length === 1;
        if (uniqueY && rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(`${intro.en} Which value of $x$ goes with $y = ${y0}$?`, `${intro["zh-CN"]}与 $y = ${y0}$ 对应的 $x$ 是多少？`),
              answer: x0,
              form: "integer",
              solveFor: "x",
              wrong: [y0, neighbor[0]],
              solution: t(
                `**Step 1: Find the point.** Go up the $y$-axis to $${y0}$ and look across: the only point at height $${y0}$ is $${pointLatex([x0, y0])}$.

**Step 2: Read its $x$-value.** Go straight down from that point to the $x$-axis, which it meets at $${x0}$. So $x = ${x0}$.

**Check.** Going $${x0}$ right and $${y0}$ up from the origin lands on that point, so the pair $x = ${x0}$, $y = ${y0}$ belongs to one ${s.item[0]}.`,
                `**第一步：找到这个点。** 沿 $y$ 轴向上到 $${y0}$，再水平看过去：高度为 $${y0}$ 的点只有 $${pointLatex([x0, y0])}$。

**第二步：读出它的 $x$ 值。** 从这个点竖直向下到 $x$ 轴，交点是 $${x0}$。所以 $x = ${x0}$。

**检验。** 从原点向右走 $${x0}$、向上走 $${y0}$，正好落在这个点上，所以 $x = ${x0}$、$y = ${y0}$ 是同一${s.item[1]}的数据。`,
              ),
            }),
            figure,
            solutionFigure,
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What is the ${s.y[0]} of the ${s.item[0]} with $x = ${x0}$?`,
              `${intro["zh-CN"]}$x = ${x0}$ 的那${s.item[1]}，${s.y[1]}是多少？`,
            ),
            answer: y0,
            form: "integer",
            wrong: [x0, neighbor[1]],
            solution: t(
              `**Step 1: Find the point.** Go along the $x$-axis to $${x0}$ and look straight up: the point above it is $${pointLatex([x0, y0])}$.

**Step 2: Read its $y$-value.** Look across from that point to the $y$-axis, which it meets at $${y0}$. So the ${s.y[0]} is $${y0}$.

**Check.** Going $${x0}$ right and $${y0}$ up from the origin lands on that point, so this ${s.item[0]} has ${s.x[0]} $${x0}$ and ${s.y[0]} $${y0}$.`,
              `**第一步：找到这个点。** 沿 $x$ 轴到 $${x0}$，再竖直向上看：它上方的点是 $${pointLatex([x0, y0])}$。

**第二步：读出它的 $y$ 值。** 从这个点水平看向 $y$ 轴，交点是 $${y0}$。所以${s.y[1]}是 $${y0}$。

**检验。** 从原点向右走 $${x0}$、向上走 $${y0}$，正好落在这个点上，所以这${s.item[1]}的${s.x[1]}是 $${x0}$，${s.y[1]}是 $${y0}$。`,
            ),
          }),
          figure,
          solutionFigure,
        };
      },
    },
    {
      id: "counting-points",
      figure: gradeDrawings5["scatter-plots#counting-points"],
      title: t("Counting points that meet a condition", "数出满足条件的点"),
      explanation: t(
        `A scatter plot answers questions about the whole data set, because a condition on one variable picks out a part of the plane. All points with $x = 5$ lie on the vertical line $x = 5$, so the items with $x > 5$ are the points strictly to the right of that line; for $x \\ge 5$, the points on the line count too. Likewise, $y < 3$ means the points strictly below the horizontal line $y = 3$.

If $4$ points lie to the right of $x = 5$ and $2$ lie on it, then $4$ items have $x > 5$ and $6$ have $x \\ge 5$.

> **Watch out.** Decide first whether the points on the line count: they do for $\\ge$ and $\\le$, not for $>$ and $<$. Count the side the symbol asks for, not the other side.`,
        `散点图可以回答关于整组数据的问题，因为对一个变量的条件对应平面的一部分。所有 $x = 5$ 的点都在竖直线 $x = 5$ 上，所以 $x > 5$ 的对象就是严格位于这条线右侧的点；若是 $x \\ge 5$，线上的点也要算。同样，$y < 3$ 指严格位于水平线 $y = 3$ 下方的点。

如果直线 $x = 5$ 右侧有 $4$ 个点，线上有 $2$ 个点，那么 $x > 5$ 的对象有 $4$ 个，$x \\ge 5$ 的有 $6$ 个。

> **注意。** 先确定线上的点算不算：$\\ge$ 和 $\\le$ 要算，$>$ 和 $<$ 不算。要数不等号所指的那一侧，而不是另一侧。`,
      ),
      generate(rng) {
        const s = rng.pick(scenes);
        const n = rng.int(7, 9);
        const pts = sceneData(rng, s, n);
        const axis = rng.pick([0, 1] as const);
        const op = rng.pick([">", "<", ">=", "<="] as const);
        const k = pts[rng.int(1, n - 2)]![axis];
        const v = axis === 0 ? "x" : "y";
        const symbol = { ">": ">", "<": "<", ">=": "\\ge", "<=": "\\le" }[op];
        const test = (c: number, o: typeof op) => (o === ">" ? c > k : o === "<" ? c < k : o === ">=" ? c >= k : c <= k);
        const flip = { ">": ">=", ">=": ">", "<": "<=", "<=": "<" } as const;
        const count = pts.filter((p) => test(p[axis], op)).length;
        const onLine = pts.filter((p) => p[axis] === k).length;
        const intro = sceneIntro(s, n);
        const where = axis === 0 ? t("to the right of", "右侧") : t("above", "上方");
        const whereLow = axis === 0 ? t("to the left of", "左侧") : t("below", "下方");
        const side = op === ">" || op === ">=" ? where : whereLow;
        const inclusive = op === ">=" || op === "<=";
        const strictly = count - (inclusive ? onLine : 0);
        const others = n - strictly - onLine;
        const boundary: PlaneMark =
          axis === 0 ? { kind: "segment", a: [k, 0], b: [k, 10], dashed: true } : { kind: "segment", a: [0, k], b: [10, k], dashed: true };
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} How many ${s.items[0]} have $${v} ${symbol} ${k}$?`,
              `${intro["zh-CN"]}有多少${s.items[1]}满足 $${v} ${symbol} ${k}$？`,
            ),
            answer: count,
            form: "integer",
            wrong: [pts.filter((p) => test(p[axis], flip[op])).length, n - count],
            solution: t(
              `**Step 1: Draw the boundary.** The points with $${v} = ${k}$ lie on the ${axis === 0 ? "vertical" : "horizontal"} line $${v} = ${k}$, and $${v} ${symbol} ${k}$ asks for the points ${side.en} it${inclusive ? ", together with the points on it" : ", leaving out the points on it"}.

**Step 2: Count.** ${strictly === 0 ? "No point lies" : strictly === 1 ? "One point lies" : `$${strictly}$ points lie`} ${side.en} the line and ${onLine === 1 ? "one lies" : `$${onLine}$ lie`} on it, so the answer is ${inclusive ? `$${strictly} + ${onLine} = ${count}$` : `$${count}$`}.

**Check.** Every point is counted once: $${strictly}$ ${side.en} the line, $${onLine}$ on it and $${others}$ on the other side make $${n}$, the number of ${s.items[0]}.`,
              `**第一步：画出边界。** $${v} = ${k}$ 的点都在${axis === 0 ? "竖直" : "水平"}线 $${v} = ${k}$ 上，$${v} ${symbol} ${k}$ 要的是这条线${side["zh-CN"]}的点${inclusive ? "，线上的点也要算" : "，线上的点不算"}。

**第二步：数点。** 直线${side["zh-CN"]}有 $${strictly}$ 个点，线上有 $${onLine}$ 个点，所以答案是 ${inclusive ? `$${strictly} + ${onLine} = ${count}$` : `$${count}$`}。

**检验。** 每个点都只数一次：直线${side["zh-CN"]}的 $${strictly}$ 个、线上的 $${onLine}$ 个和另一侧的 $${others}$ 个，合起来是 $${n}$ 个，正是全部数据点的个数。`,
            ),
          }),
          figure: scatterFigure(pts),
          solutionFigure: scatterFigure(pts, [boundary], [`the dashed line ${v} = ${k}`, `虚线 ${v} = ${k}`]),
        };
      },
    },
    {
      id: "making-a-scatter-plot",
      figure: gradeDrawings3["scatter-plots#making-a-scatter-plot"],
      title: t("Plotting the data", "描点画散点图"),
      explanation: t(
        `Each column of a table is one item, and its two values become one point. The $x$-value is the first coordinate, so from the origin go right $x$ units, then up $y$ units, and plot the point there.

The column $x = 2$, $y = 7$ is the point $(2, 7)$: $2$ to the right and $7$ up. To check a plot against a table, go through the columns one by one and look for each point.

> **Watch out.** Do not swap the coordinates: the pair $x = 2$, $y = 7$ is the point $(2, 7)$, not $(7, 2)$. A swapped point lies at the mirror position across the line $y = x$, so it can look perfectly reasonable.`,
        `表格的每一列是一个对象，它的两个值对应一个点。$x$ 值是第一个坐标，所以从原点先向右走 $x$ 个单位，再向上走 $y$ 个单位，在那里描点。

$x = 2$、$y = 7$ 这一列是点 $(2, 7)$：向右 $2$，向上 $7$。要把散点图与表格核对，就逐列检查，找到每一列对应的点。

> **注意。** 不要把坐标弄反：$x = 2$、$y = 7$ 这一对数据是点 $(2, 7)$，不是 $(7, 2)$。弄反的点位于关于直线 $y = x$ 对称的位置，看起来可能毫无异样。`,
      ),
      generate(rng) {
        for (;;) {
          const xs = xsOf(rng, 5);
          const pts = xs.map((x): Pt => [x, rng.int(1, 9)]);
          const bad = rng.int(0, 4);
          const [bx, by] = pts[bad]!;
          const swapped: Pt = [by, bx];
          if (bx === by || pts.some((p) => p[0] === by && p[1] === bx)) continue;
          const shown = pts.map((p, i) => (i === bad ? swapped : p));
          const table = `| $x$ | ${pts.map((p) => `$${p[0]}$`).join(" | ")} |\n| :-: | ${pts.map(() => ":-:").join(" | ")} |\n| $y$ | ${pts.map((p) => `$${p[1]}$`).join(" | ")} |`;
          return {
            ...choiceProblem({
              prompt: t(
                `The scatter plot should show the data in the table, but one data point was plotted incorrectly. Which one?\n\n${table}`,
                `散点图本应表示表中的数据，但有一个数据点画错了。是哪一个？\n\n${table}`,
              ),
              options: pts.map((p) => same(`$${pointLatex(p)}$`)),
              correct: bad,
              solution: t(
                `**Step 1: Look for each column.** Going through the table, the points ${pts
                  .filter((_, i) => i !== bad)
                  .map((p) => `$${pointLatex(p)}$`)
                  .join(", ")} are all in the plot.

**Step 2: Find the misplaced one.** The column $x = ${bx}$, $y = ${by}$ should be the point $${pointLatex([bx, by])}$, $${bx}$ right and $${by}$ up. There is no point there; instead there is a point at $${pointLatex(swapped)}$, with the coordinates swapped. So $${pointLatex([bx, by])}$ was plotted incorrectly.

**Check.** The table has no column with $x = ${by}$ and $y = ${bx}$, so the point at $${pointLatex(swapped)}$ belongs to no item: it can only be the misplaced one.`,
                `**第一步：逐列寻找。** 按表格逐列检查，点 ${pts
                  .filter((_, i) => i !== bad)
                  .map((p) => `$${pointLatex(p)}$`)
                  .join("、")} 都在图中。

**第二步：找出画错的点。** $x = ${bx}$、$y = ${by}$ 这一列应是点 $${pointLatex([bx, by])}$，即向右 $${bx}$、向上 $${by}$。那里没有点；倒是 $${pointLatex(swapped)}$ 处有一个点，坐标弄反了。所以 $${pointLatex([bx, by])}$ 画错了。

**检验。** 表中没有 $x = ${by}$、$y = ${bx}$ 的列，所以 $${pointLatex(swapped)}$ 处的点不属于任何对象：它只能是画错的那个。`,
              ),
            }),
            figure: scatterFigure(shown),
          };
        }
      },
    },
  ],
};

/** fitOptions are the verdicts on a line drawn through a scatter plot. */
const fitOptions: readonly Text[] = [
  t(
    "Yes: it follows the direction of the points, with about as many points above it as below it",
    "是：它与点的走向一致，上下两侧的点大致一样多",
  ),
  t("No: it is too high, and most of the points lie below it", "不是：它太高了，大多数点在它下方"),
  t("No: it is too low, and most of the points lie above it", "不是：它太低了，大多数点在它上方"),
  t("No: it does not follow the direction of the points", "不是：它与点的走向不一致"),
];

/** trendSlopes are the slopes of the generated trend lines. */
const trendSlopes: readonly Q[] = [Q.of(1, 2), Q.of(2, 3), Q.of(3, 4), Q.of(1), Q.of(4, 5), Q.of(3, 5)];

/** trendIntro is a scatter plot with the trend line y = 3/4 x + 2 through the grid points (0, 2) and (4, 5). */
const trendIntro: Figure = scatterFigure(
  [
    [1, 3],
    [2, 3],
    [3, 5],
    [5, 5],
    [6, 7],
    [7, 7],
    [8, 8],
    [9, 9],
  ],
  [
    lineMark(Q.of(3, 4), Q.of(2), true),
    { kind: "point", at: [0, 2], open: true, accent: true },
    { kind: "point", at: [4, 5], open: true, accent: true },
  ],
  ["a dashed trend line through (0, 2) and (4, 5)", "经过 (0, 2) 和 (4, 5) 的虚线趋势线"],
);

export const trendLines: TopicDef = {
  id: "trend-lines",
  title: t("Trend Lines", "趋势线"),
  summary: t(
    "Judge whether a line fits a scatter plot, and write the equation of a trend line.",
    "判断一条直线是否拟合散点图，并写出趋势线的方程。",
  ),
  prerequisites: ["scatter-plots", "slope-intercept-form"],
  encompasses: [
    { topic: "slope-intercept-form", weight: 0.4 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.8.SP.A.2", "CCSS.8.SP.A.3"],
  intro: t(
    `A scatter plot shows paired data as points, and often the points rise or fall roughly along a line. A line $y = mx + b$, on the other hand, is something we can describe exactly, by its slope and its intercept. Drawing a line through the middle of the points, a **trend line**, joins the two: it replaces a cloud of points by one equation that summarizes them.

Here the points rise steadily. The dashed line through the grid points $(0, 2)$ and $(4, 5)$ runs through their middle, with points on both sides:

{{figure 0}}

It rises $3$ for every $4$ to the right and starts at $2$, so its equation is $y = \\frac{3}{4}x + 2$. In this lesson we judge whether a line is a good trend line and write the equation of one, from a graph or from two points.`,
    `散点图把成对的数据画成点，而这些点常常大致沿一条直线上升或下降。另一方面，直线 $y = mx + b$ 可以用斜率和截距精确地描述。从点的中间画一条直线，即**趋势线**，就把二者联系了起来：它用一个方程概括了一团点。

这里的点稳步上升。经过网格点 $(0, 2)$ 和 $(4, 5)$ 的虚线从点的中间穿过，两侧都有点：

{{figure 0}}

它每向右 $4$ 上升 $3$，起点是 $2$，所以方程是 $y = \\frac{3}{4}x + 2$。这节课我们判断一条直线是不是好的趋势线，并由图像或两个点写出趋势线的方程。`,
  ),
  introFigures: [trendIntro],
  knowledgePoints: [
    {
      id: "judging-a-trend-line",
      figure: gradeDrawings5["trend-lines#judging-a-trend-line"],
      title: t("A good trend line", "好的趋势线"),
      explanation: t(
        `A trend line is meant to stand for the points, so it must go where they go. A good trend line:

- follows the direction of the points: rising when they rise, falling when they fall;
- runs through the middle of the points, with about as many above it as below it;
- need not pass through any of the points.

So judge a line in two steps: compare its direction with the points', then count the points on each side.

> **Watch out.** A line can have the right direction and still be too high (most points below it) or too low (most points above it). And a line through the middle of the points can still lean the wrong way: check both features.`,
        `趋势线要代表这些点，所以它必须与点的走向一致。好的趋势线：

- 与点的走向一致：点上升它就上升，点下降它就下降；
- 从点的中间穿过，上下两侧的点大致一样多；
- 不一定要经过任何一个点。

所以判断一条直线分两步：先比较它与点的方向，再数两侧的点。

> **注意。** 一条直线方向对了，仍可能太高（大多数点在它下方）或太低（大多数点在它上方）。而从点中间穿过的直线也可能倾斜方向错了：两方面都要检查。`,
      ),
      generate(rng) {
        for (;;) {
          const m = rng.pick(trendSlopes).mul(Q.of(rng.sign()));
          const b = Q.of(rng.int(4, 6)).sub(m.mul(Q.of(5)));
          const pts = near(rng, xsOf(rng, 8), m, b, 1);
          if (!pts) continue;
          const kind = rng.int(0, 3);
          const shown = kind === 3 ? ([m.neg(), b.add(m.mul(Q.of(10)))] as const) : ([m, b.add(Q.of([0, 3, -3][kind]!))] as const);
          const at = (x: number) => shown[0].mul(Q.of(x)).add(shown[1]).toNumber();
          const above = pts.filter(([x, y]) => y > at(x)).length;
          const below = pts.filter(([x, y]) => y < at(x)).length;
          if (kind === 0 && Math.abs(above - below) > 2) continue;
          const rise = m.sign() > 0;
          const lineRises = shown[0].sign() > 0;
          const direction = t(
            `**Step 1: Compare the directions.** The points ${rise ? "rise" : "fall"} from left to right, and the line ${lineRises ? "rises" : "falls"}${kind === 3 ? ": the line goes the other way." : ", the same way."}`,
            `**第一步：比较方向。** 点从左到右${rise ? "上升" : "下降"}，直线${lineRises ? "上升" : "下降"}${kind === 3 ? "：直线的方向相反。" : "，方向一致。"}`,
          );
          const verdict = [
            t(
              `**Step 2: Count the points on each side.** $${above}$ points lie above the line and $${below}$ below it, about as many on each side, so it runs through the middle of the data: it is a good trend line.`,
              `**第二步：数两侧的点。** 直线上方有 $${above}$ 个点，下方有 $${below}$ 个点，两侧大致一样多，所以它从数据中间穿过：这是一条好的趋势线。`,
            ),
            t(
              "**Step 2: Count the points on each side.** Every point lies below the line and none above it, so the line is too high.",
              "**第二步：数两侧的点。** 所有点都在直线下方，上方一个也没有，所以直线太高了。",
            ),
            t(
              "**Step 2: Count the points on each side.** Every point lies above the line and none below it, so the line is too low.",
              "**第二步：数两侧的点。** 所有点都在直线上方，下方一个也没有，所以直线太低了。",
            ),
            t(
              "**Step 2: Decide.** A trend line must follow the direction of the data, so this line is not a good trend line, wherever it crosses the points.",
              "**第二步：判断。** 趋势线必须与数据的走向一致，所以无论它在哪里穿过这些点，都不是好的趋势线。",
            ),
          ][kind]!;
          return {
            ...choiceProblem({
              prompt: t("Is the line drawn a good trend line for the data?", "图中画出的直线是这组数据的好的趋势线吗？"),
              options: fitOptions,
              correct: kind,
              solution: t(`${direction.en}\n\n${verdict.en}`, `${direction["zh-CN"]}\n\n${verdict["zh-CN"]}`),
            }),
            figure: scatterFigure(
              pts,
              [lineMark(shown[0], shown[1])],
              [`the line ${plainLine(shown[0], shown[1])}`, `直线 ${plainLine(shown[0], shown[1])}`],
            ),
          };
        }
      },
    },
    {
      id: "trend-line-from-a-graph",
      title: t("The equation of a drawn trend line", "由图写出趋势线方程"),
      explanation: t(
        `A trend line is a line, so its equation can be written in slope-intercept form $y = mx + b$: $b$ is where it crosses the $y$-axis, and $m$ is its rise divided by its run. Read both from points of the **line** that sit exactly on grid corners; the data points themselves usually are not on it, so they would give a wrong slope.

A trend line through $(0, 2)$ and $(4, 5)$ crosses the $y$-axis at $2$, so $b = 2$, and rises $3$ over a run of $4$, so $m = \\frac{3}{4}$: $y = \\frac{3}{4}x + 2$.

> **Watch out.** The slope is rise over run, $\\frac{3}{4}$, not run over rise. A line falling to the right has a negative slope. And $b$ is the height where the line meets the $y$-axis, not the height of the second marked point.`,
        `趋势线是一条直线，所以可以写成斜截式 $y = mx + b$：$b$ 是它与 $y$ 轴的交点，$m$ 是纵向变化除以横向变化。要用**直线**上正好落在网格交点上的点来读这两个数；数据点本身通常不在直线上，用它们会得出错误的斜率。

经过 $(0, 2)$ 和 $(4, 5)$ 的趋势线与 $y$ 轴交于 $2$，所以 $b = 2$；横向走 $4$ 时上升 $3$，所以 $m = \\frac{3}{4}$：$y = \\frac{3}{4}x + 2$。

> **注意。** 斜率是纵向变化比横向变化，$\\frac{3}{4}$，不是横向比纵向。向右下降的直线斜率为负。$b$ 是直线与 $y$ 轴交点的高度，不是第二个标出点的高度。`,
      ),
      keyPrerequisites: ["slope-intercept-form"],
      generate(rng) {
        for (;;) {
          const b = rng.int(1, 9);
          const run = rng.int(2, 5);
          const rise = rng.nonZero(-4, 4);
          if (b + rise < 1 || b + rise > 9 || Math.abs(rise) === run) continue;
          const m = Q.of(rise, run);
          const B = Q.of(b);
          const pts = near(rng, xsOf(rng, 7), m, B, 1);
          if (!pts) continue;
          const answer = si(m, B);
          return {
            ...equationProblem({
              prompt: t(
                "The scatter plot shows a trend line through two marked grid points. Write the equation of the trend line in slope-intercept form.",
                "散点图中画出了一条经过两个标出的网格点的趋势线。写出这条趋势线的斜截式方程。",
              ),
              answer,
              form: "slope-intercept",
              wrong: [si(Q.of(run, rise), B), si(m.neg(), B), si(m, Q.of(b + rise))],
              solution: t(
                `**Step 1: Read the intercept.** The line crosses the $y$-axis at the marked point $(0, ${b})$, so $b = ${b}$.

**Step 2: Read the slope.** From $(0, ${b})$ to the other marked point $${pointLatex([run, b + rise])}$ the run is $${run}$ and the rise is $${rise}$${rise < 0 ? ", negative because the line falls" : ""}, so $m = \\frac{${rise}}{${run}} = ${num(m)}$.

**Step 3: Write the equation.**${steps(answer)}**Check.** At $x = ${run}$ the equation gives $${num(m)} \\cdot ${run} + ${b} = ${rise} + ${b} = ${b + rise}$, the height of the second marked point.`,
                `**第一步：读出截距。** 直线与 $y$ 轴交于标出的点 $(0, ${b})$，所以 $b = ${b}$。

**第二步：读出斜率。** 从 $(0, ${b})$ 到另一个标出的点 $${pointLatex([run, b + rise])}$，横向变化是 $${run}$，纵向变化是 $${rise}$${rise < 0 ? "，因为直线下降所以是负数" : ""}，所以 $m = \\frac{${rise}}{${run}} = ${num(m)}$。

**第三步：写出方程。**${steps(answer)}**检验。** 当 $x = ${run}$ 时，方程给出 $${num(m)} \\cdot ${run} + ${b} = ${rise} + ${b} = ${b + rise}$，正是第二个标出点的高度。`,
              ),
            }),
            figure: scatterFigure(
              pts,
              [
                lineMark(m, B, true),
                { kind: "point", at: [0, b], open: true, accent: true },
                { kind: "point", at: [run, b + rise], open: true, accent: true },
              ],
              [
                `a dashed trend line through the marked grid points (0, ${b}) and (${run}, ${b + rise})`,
                `经过标出的网格点 (0, ${b}) 和 (${run}, ${b + rise}) 的虚线趋势线`,
              ],
            ),
          };
        }
      },
    },
    {
      id: "trend-line-through-two-points",
      title: t("A trend line through two data points", "经过两个数据点的趋势线"),
      explanation: t(
        `A simple way to draw a trend line is to choose two data points, far apart, that the line should pass through so that it runs through the middle of the data. A line is fixed by two of its points, so its equation follows from them:

1. the slope is $m = \\frac{y_2 - y_1}{x_2 - x_1}$, the rise over the run between them;
2. the line passes through $(x_1, y_1)$, so $y_1 = m x_1 + b$, which gives the $y$-intercept $b = y_1 - m x_1$.

Through $(2, 3)$ and $(8, 6)$: $m = \\frac{6 - 3}{8 - 2} = \\frac{1}{2}$ and $b = 3 - \\frac{1}{2} \\cdot 2 = 2$, so $y = \\frac{1}{2}x + 2$.

> **Watch out.** Put the $y$-difference on top: $\\frac{x_2 - x_1}{y_2 - y_1}$ is upside down. Subtract in the same order in both differences, or the sign of the slope flips. And $b$ is not $y_1$: the point $(x_1, y_1)$ is not on the $y$-axis, so subtract $m x_1$.`,
        `画趋势线的一个简单方法是选取两个相距较远的数据点，让直线经过它们，并从数据中间穿过。两点确定一条直线，所以由这两点就能写出方程：

1. 斜率 $m = \\frac{y_2 - y_1}{x_2 - x_1}$，即两点间的纵向变化比横向变化；
2. 直线经过 $(x_1, y_1)$，所以 $y_1 = m x_1 + b$，由此得 $y$ 轴截距 $b = y_1 - m x_1$。

经过 $(2, 3)$ 和 $(8, 6)$：$m = \\frac{6 - 3}{8 - 2} = \\frac{1}{2}$，$b = 3 - \\frac{1}{2} \\cdot 2 = 2$，所以 $y = \\frac{1}{2}x + 2$。

> **注意。** $y$ 的差放在分子上：$\\frac{x_2 - x_1}{y_2 - y_1}$ 是颠倒的。两个差要按相同的顺序相减，否则斜率的符号会反。$b$ 也不是 $y_1$：点 $(x_1, y_1)$ 不在 $y$ 轴上，所以要减去 $m x_1$。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        for (;;) {
          const [x1, x2] = [rng.int(1, 3), rng.int(6, 9)];
          const [y1, y2] = [rng.int(1, 9), rng.int(1, 9)];
          if (Math.abs(y2 - y1) < 2) continue;
          const m = Q.of(y2 - y1, x2 - x1);
          const b = Q.of(y1).sub(m.mul(Q.of(x1)));
          const others = near(
            rng,
            xsOf(rng, 9)
              .filter((x) => x !== x1 && x !== x2)
              .slice(0, 5),
            m,
            b,
            1,
          );
          if (!others) continue;
          const pts = [...others, [x1, y1] as Pt, [x2, y2] as Pt].sort((p, q) => p[0] - q[0]);
          const answer = si(m, b);
          const mx2 = m.mul(Q.of(x2));
          return {
            ...equationProblem({
              prompt: t(
                `A trend line for the scatter plot passes through the data points $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$. Write its equation in slope-intercept form.`,
                `散点图的一条趋势线经过数据点 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$。写出它的斜截式方程。`,
              ),
              answer,
              form: "slope-intercept",
              wrong: [si(Q.of(x2 - x1, y2 - y1), b), si(m.neg(), b), si(m, Q.of(y1)), si(m, b.neg())],
              solution: t(
                `**Step 1: The slope.** Divide the rise by the run between the two points:${steps(`m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${num(m)}`)}**Step 2: The intercept.** The line passes through $${pointLatex([x1, y1])}$, so $${y1} = ${num(m)} \\cdot ${x1} + b$:${steps(`b = ${y1} - ${paren(m)} \\cdot ${x1} = ${num(b)}`)}**Step 3: Write the equation.**${steps(answer)}**Check.** The line should pass through the other point too: at $x = ${x2}$ it gives $${num(mx2)} ${b.sign() < 0 ? "-" : "+"} ${num(b.abs())} = ${y2}$.`,
                `**第一步：斜率。** 用两点间的纵向变化除以横向变化：${steps(`m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${num(m)}`)}**第二步：截距。** 直线经过 $${pointLatex([x1, y1])}$，所以 $${y1} = ${num(m)} \\cdot ${x1} + b$：${steps(`b = ${y1} - ${paren(m)} \\cdot ${x1} = ${num(b)}`)}**第三步：写出方程。**${steps(answer)}**检验。** 直线也应经过另一个点：当 $x = ${x2}$ 时，得 $${num(mx2)} ${b.sign() < 0 ? "-" : "+"} ${num(b.abs())} = ${y2}$。`,
              ),
            }),
            figure: scatterFigure(
              pts,
              [lineMark(m, b, true), { kind: "point", at: [x1, y1], accent: true }, { kind: "point", at: [x2, y2], accent: true }],
              [`a dashed trend line through (${x1}, ${y1}) and (${x2}, ${y2})`, `经过 (${x1}, ${y1}) 和 (${x2}, ${y2}) 的虚线趋势线`],
            ),
          };
        }
      },
    },
  ],
};

/** Context is a real situation modeled by a trend line y = mx + b. */
interface Context {
  /** model is what the trend line models: "the test scores of a class". */
  readonly model: Pair;
  /** x and y say what the variables stand for, with their units. */
  readonly x: Pair;
  readonly y: Pair;
  readonly yName: Pair;
  readonly yUnit: Pair;
  readonly xName: Pair;
  readonly xUnit: Pair;
  /** at names the item with a given x: "a student who studies $6$ hours". */
  readonly at: (x: number) => Pair;
  /** each is the start of the meaning of the slope: "each additional hour of studying". */
  readonly each: Pair;
  /** zero is the condition x = 0: "a student does not study at all". */
  readonly zero: Pair;
  readonly slopes: readonly string[];
  /** b is the range and step of the intercepts. */
  readonly b: readonly [number, number, number];
  /** xs is the range of x-values of the data. */
  readonly xs: readonly [number, number];
  /** resid is the step of residuals. */
  readonly resid: string;
}

const celsius = (x: number) => `$${x}^{\\circ}\\text{C}$`;

const contexts: readonly Context[] = [
  {
    model: ["the test scores of a class", "某班学生的考试成绩"],
    x: ["the number of hours a student studied", "学生的学习时长（小时）"],
    y: ["the test score in points", "考试分数（分）"],
    yName: ["test score", "考试分数"],
    yUnit: ["points", "分"],
    xName: ["the time spent studying", "学习时长"],
    xUnit: ["hours", "小时"],
    at: (x) => [`a student who studies $${x}$ hours`, `学习 $${x}$ 小时的学生`],
    each: ["each additional hour of studying", "学习时长每增加 1 小时"],
    zero: ["a student does not study at all", "学生完全不学习时"],
    slopes: ["2.5", "3", "3.5", "4", "4.5", "5"],
    b: [40, 55, 1],
    xs: [1, 8],
    resid: "1",
  },
  {
    model: ["the values of used cars of one model", "某款二手车的价值"],
    x: ["the age of the car in years", "车龄（年）"],
    y: ["its value in thousands of dollars", "价值（千美元）"],
    yName: ["value", "价值"],
    yUnit: ["thousand dollars", "千美元"],
    xName: ["the age of the car", "车龄"],
    xUnit: ["years", "年"],
    at: (x) => [`a car that is $${x}$ years old`, `车龄 $${x}$ 年的汽车`],
    each: ["each additional year of age", "车龄每增加 1 年"],
    zero: ["a car is new", "汽车是新车时"],
    slopes: ["-1.5", "-2", "-2.5", "-3"],
    b: [28, 40, 1],
    xs: [1, 8],
    resid: "0.5",
  },
  {
    model: ["the daily sales of hot chocolate at a café", "某咖啡馆每天的热巧克力销量"],
    x: ["the day's high temperature in degrees Celsius", "当天的最高气温（摄氏度）"],
    y: ["the number of cups sold", "售出的杯数"],
    yName: ["number of cups sold", "销量"],
    yUnit: ["cups", "杯"],
    xName: ["the high temperature", "最高气温"],
    xUnit: ["degrees", "摄氏度"],
    at: (x) => [`a day with a high of ${celsius(x)}`, `最高气温为 ${celsius(x)} 的一天`],
    each: ["each additional degree of temperature", "气温每升高 1 摄氏度"],
    zero: [`the high temperature is ${celsius(0)}`, `最高气温为 ${celsius(0)} 时`],
    slopes: ["-2", "-3", "-4", "-5"],
    b: [140, 200, 5],
    xs: [2, 24],
    resid: "2",
  },
  {
    model: ["the daily ice cream sales at a beach stand", "海滩冰淇淋摊每天的销量"],
    x: ["the day's high temperature in degrees Celsius", "当天的最高气温（摄氏度）"],
    y: ["the number of cones sold", "售出的冰淇淋个数"],
    yName: ["number of cones sold", "销量"],
    yUnit: ["cones", "个"],
    xName: ["the high temperature", "最高气温"],
    xUnit: ["degrees", "摄氏度"],
    at: (x) => [`a day with a high of ${celsius(x)}`, `最高气温为 ${celsius(x)} 的一天`],
    each: ["each additional degree of temperature", "气温每升高 1 摄氏度"],
    zero: [`the high temperature is ${celsius(0)}`, `最高气温为 ${celsius(0)} 时`],
    slopes: ["4", "5", "6", "7", "8"],
    b: [10, 40, 2],
    xs: [12, 35],
    resid: "3",
  },
  {
    model: ["the hourly wages of the workers of a company", "某公司员工的时薪"],
    x: ["the number of years of experience", "工作年限（年）"],
    y: ["the hourly wage in dollars", "时薪（美元）"],
    yName: ["hourly wage", "时薪"],
    yUnit: ["dollars", "美元"],
    xName: ["the experience", "工作年限"],
    xUnit: ["years", "年"],
    at: (x) => [`a worker with $${x}$ years of experience`, `工作 $${x}$ 年的员工`],
    each: ["each additional year of experience", "工作年限每增加 1 年"],
    zero: ["a worker has no experience", "员工没有工作经验时"],
    slopes: ["0.5", "0.75", "1.25", "1.5"],
    b: [12, 20, 1],
    xs: [1, 20],
    resid: "0.25",
  },
  {
    model: ["measurements of the height of a burning candle", "对一支燃烧的蜡烛高度的测量"],
    x: ["the number of hours it has burned", "燃烧的时间（小时）"],
    y: ["its height in centimeters", "高度（厘米）"],
    yName: ["height", "高度"],
    yUnit: ["centimeters", "厘米"],
    xName: ["the burning time", "燃烧时间"],
    xUnit: ["hours", "小时"],
    at: (x) => [`the candle after $${x}$ hours of burning`, `燃烧 $${x}$ 小时后的蜡烛`],
    each: ["each additional hour of burning", "燃烧时间每增加 1 小时"],
    zero: ["the candle is first lit", "蜡烛刚点燃时"],
    slopes: ["-0.5", "-1.5", "-2", "-2.5"],
    b: [18, 30, 1],
    xs: [1, 6],
    resid: "0.5",
  },
  {
    model: ["the monthly rents of apartments in a city", "某城市公寓的月租金"],
    x: ["the distance from the city center in kilometers", "到市中心的距离（千米）"],
    y: ["the monthly rent in dollars", "月租金（美元）"],
    yName: ["monthly rent", "月租金"],
    yUnit: ["dollars", "美元"],
    xName: ["the distance from the center", "到市中心的距离"],
    xUnit: ["kilometers", "千米"],
    at: (x) => [`an apartment $${x}$ km from the center`, `距市中心 $${x}$ 千米的公寓`],
    each: ["each additional kilometer from the center", "到市中心的距离每增加 1 千米"],
    zero: ["an apartment is in the city center", "公寓位于市中心时"],
    slopes: ["-25", "-30", "-40", "-50"],
    b: [1400, 2000, 50],
    xs: [1, 15],
    resid: "25",
  },
  {
    model: ["the monthly revenue of a store", "某商店的月销售额"],
    x: ["the advertising spending in thousands of dollars", "广告投入（千美元）"],
    y: ["the revenue in thousands of dollars", "销售额（千美元）"],
    yName: ["revenue", "销售额"],
    yUnit: ["thousand dollars", "千美元"],
    xName: ["the advertising spending", "广告投入"],
    xUnit: ["thousand dollars", "千美元"],
    at: (x) => [`a month with $${x}$ thousand dollars of advertising`, `广告投入为 $${x}$ 千美元的月份`],
    each: ["each additional thousand dollars of advertising", "广告投入每增加 1 千美元"],
    zero: ["nothing is spent on advertising", "不投入广告时"],
    slopes: ["3", "4", "5", "6", "7.5"],
    b: [20, 60, 2],
    xs: [1, 12],
    resid: "1",
  },
  {
    model: ["the growth of a sunflower", "一株向日葵的生长"],
    x: ["the number of weeks since planting", "种下后的周数"],
    y: ["its height in centimeters", "高度（厘米）"],
    yName: ["height", "高度"],
    yUnit: ["centimeters", "厘米"],
    xName: ["the time since planting", "种下后的时间"],
    xUnit: ["weeks", "周"],
    at: (x) => [`the sunflower $${x}$ weeks after planting`, `种下 $${x}$ 周后的向日葵`],
    each: ["each additional week", "时间每增加 1 周"],
    zero: ["the seedling is planted", "幼苗刚种下时"],
    slopes: ["1.5", "2", "2.5", "3"],
    b: [4, 9, 1],
    xs: [1, 10],
    resid: "0.5",
  },
];

/** Model is a context with a drawn trend line y = mx + b. */
interface Model {
  readonly c: Context;
  readonly m: Q;
  readonly b: Q;
  /** eq is the trend line in LaTeX, with decimals. */
  readonly eq: string;
  /** intro introduces the trend line and its variables. */
  readonly intro: Text;
}

/** drawModel picks a context and a trend line for it. */
function drawModel(rng: Rng): Model {
  const c = rng.pick(contexts);
  const m = Q.parse(rng.pick(c.slopes));
  const [lo, hi, step] = c.b;
  const b = Q.of(lo + step * rng.int(0, (hi - lo) / step));
  const eq = `y = ${decLinear(m, b)}`;
  return {
    c,
    m,
    b,
    eq,
    intro: t(
      `The trend line $${eq}$ models ${c.model[0]}, where $x$ is ${c.x[0]} and $y$ is ${c.y[0]}.`,
      `趋势线 $${eq}$ 描述${c.model[1]}，其中 $x$ 表示${c.x[1]}，$y$ 表示${c.y[1]}。`,
    ),
  };
}

/** predict is the value of the trend line at x. */
const predict = (md: Model, x: number) => md.m.mul(Q.of(x)).add(md.b);

/** substitution writes m · x + b = y with decimals. */
const substitution = (md: Model, x: number) =>
  `y = ${dec(md.m)} \\cdot ${paren(x)} ${md.b.sign() < 0 ? "-" : "+"} ${dec(md.b.abs())} = ${dec(predict(md, x))}`;

/** slopeMeaning states the meaning of a slope in a context: amount, direction up when rising. */
const slopeMeaning = (c: Context, amount: Q, up: boolean) =>
  t(
    `For ${c.each[0]}, the predicted ${c.yName[0]} ${up ? "increases" : "decreases"} by $${dec(amount)}$ ${c.yUnit[0]}.`,
    `${c.each[1]}，预测的${c.yName[1]}${up ? "增加" : "减少"} $${dec(amount)}$ ${c.yUnit[1]}。`,
  );

/** interceptMeaning states the meaning of an intercept in a context. */
const interceptMeaning = (c: Context, amount: Q) =>
  t(
    `When ${c.zero[0]}, the predicted ${c.yName[0]} is $${dec(amount)}$ ${c.yUnit[0]}.`,
    `${c.zero[1]}，预测的${c.yName[1]}是 $${dec(amount)}$ ${c.yUnit[1]}。`,
  );

/** pd writes a decimal for LaTeX, in parentheses when it is negative. */
const pd = (q: Q) => (q.sign() < 0 ? `(${dec(q)})` : dec(q));

export const predictionsWithTrendLines: TopicDef = {
  id: "predictions-with-trend-lines",
  title: t("Making Predictions Using Trend Lines", "用趋势线进行预测"),
  summary: t(
    "Use the equation of a trend line to predict values, tell interpolation from extrapolation, and find residuals.",
    "用趋势线方程预测数值，区分内插与外推，并求残差。",
  ),
  prerequisites: ["trend-lines", "two-step-equations"],
  encompasses: [
    { topic: "evaluating-expressions", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.8.SP.A.3", "CCSS.HSS.ID.B.6"],
  intro: t(
    `A trend line $y = mx + b$ summarizes a scatter plot by an equation. An equation can do something a cloud of points cannot: it gives a value of $y$ for **any** $x$, including values of $x$ that no item in the data has. That is what makes trend lines useful: they turn past data into predictions.

Suppose $y = 2.5x + 40$ models the test scores of a class, where $x$ is the hours a student studied. No student in the data studied exactly $6$ hours, but the line predicts that such a student scores

$$y = 2.5 \\cdot 6 + 40 = 55 \\text{ points}.$$

Going the other way, the line predicts a score of $60$ for $8$ hours, since $2.5 \\cdot 8 + 40 = 60$. In this lesson we predict $y$ from $x$ and $x$ from $y$, judge how far a prediction can be trusted, and measure how far a real data point lies from the line.`,
    `趋势线 $y = mx + b$ 用一个方程概括了散点图。方程能做到一团点做不到的事：对**任意**的 $x$ 都给出一个 $y$ 值，包括数据中没有任何对象取到的 $x$。这正是趋势线有用的地方：它把过去的数据变成了预测。

设 $y = 2.5x + 40$ 描述某班学生的考试分数，$x$ 是学生的学习时长（小时）。数据中没有学生恰好学了 $6$ 小时，但这条直线预测这样的学生得分为

$$y = 2.5 \\cdot 6 + 40 = 55 \\text{ 分}.$$

反过来，因为 $2.5 \\cdot 8 + 40 = 60$，直线预测学习 $8$ 小时得 $60$ 分。这节课我们由 $x$ 预测 $y$、由 $y$ 求 $x$，判断预测在多大程度上可信，并衡量真实的数据点离直线有多远。`,
  ),
  knowledgePoints: [
    {
      id: "predicting-a-value",
      figure: gradeDrawings5["predictions-with-trend-lines#predicting-a-value"],
      title: t("Predicting $y$ from $x$", "由 $x$ 预测 $y$"),
      explanation: t(
        `A trend line $y = mx + b$ gives, for each value of $x$, the value of $y$ on the line above it. So a prediction is an evaluation: substitute the value of $x$, multiply by the slope, then add the intercept.

If $y = 2.5x + 40$ models test scores, where $x$ is hours studied, a student who studies $6$ hours is predicted to score $y = 2.5 \\cdot 6 + 40 = 15 + 40 = 55$ points. The prediction is an estimate: actual students score above or below the line.

> **Watch out.** Do not forget the intercept: $2.5 \\cdot 6 = 15$ alone is not the prediction. Multiply the **slope** by $x$, not the intercept, and add $b$ rather than subtract it.`,
        `趋势线 $y = mx + b$ 对每个 $x$ 值给出直线上对应的 $y$ 值。所以预测就是求值：代入 $x$ 的值，乘以斜率，再加上截距。

如果 $y = 2.5x + 40$ 描述考试分数，$x$ 是学习时长（小时），那么学习 $6$ 小时的学生的预测分数是 $y = 2.5 \\cdot 6 + 40 = 15 + 40 = 55$ 分。预测只是估计：实际的学生会高于或低于这条线。

> **注意。** 别忘了截距：只算 $2.5 \\cdot 6 = 15$ 不是预测值。要用**斜率**乘以 $x$，而不是截距；再加上 $b$，而不是减去它。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const md = drawModel(rng);
        const x0 = rng.int(md.c.xs[0], md.c.xs[1]);
        const y = predict(md, x0);
        const back = y.sub(md.b);
        return numberProblem({
          prompt: t(
            `${md.intro.en} Use it to predict the ${md.c.yName[0]} for ${md.c.at(x0)[0]}.`,
            `${md.intro["zh-CN"]}用它预测${md.c.at(x0)[1]}的${md.c.yName[1]}。`,
          ),
          answer: y,
          ...decimalForm(y),
          wrong: [md.m.mul(Q.of(x0)), md.b.mul(Q.of(x0)).add(md.m), md.m.mul(Q.of(x0)).sub(md.b), md.m.add(md.b)],
          solution: t(
            `**Step 1: Find $x$.** ${md.c.at(x0)[0][0]!.toUpperCase()}${md.c.at(x0)[0].slice(1)} has $x = ${x0}$.

**Step 2: Substitute into the trend line.** Multiply by the slope, then add the intercept:${steps(substitution(md, x0))}The predicted ${md.c.yName[0]} is $${dec(y)}$ ${md.c.yUnit[0]}.

**Check.** Working back from the prediction: $${dec(y)} - ${dec(md.b)} = ${dec(back)}$, and $${dec(back)} \\div ${pd(md.m)} = ${x0}$, the value of $x$ we started from.`,
            `**第一步：确定 $x$。** ${md.c.at(x0)[1]}对应 $x = ${x0}$。

**第二步：代入趋势线。** 先乘以斜率，再加上截距：${steps(substitution(md, x0))}预测的${md.c.yName[1]}是 $${dec(y)}$ ${md.c.yUnit[1]}。

**检验。** 由预测值倒推：$${dec(y)} - ${dec(md.b)} = ${dec(back)}$，$${dec(back)} \\div ${pd(md.m)} = ${x0}$，正是开始时的 $x$ 值。`,
          ),
        });
      },
    },
    {
      id: "predicting-x-from-y",
      title: t("Finding $x$ for a predicted $y$", "由预测值求 $x$"),
      explanation: t(
        `To find which $x$ gives a predicted value of $y$, run the prediction backwards. The prediction multiplied $x$ by $m$ and then added $b$, so undo the steps in reverse order: substitute the value for $y$, subtract $b$, then divide by $m$.

With $y = 2.5x + 40$, the predicted score is $60$ when $60 = 2.5x + 40$: subtract $40$ to get $20 = 2.5x$, and divide by $2.5$ to get $x = 8$ hours. Indeed $2.5 \\cdot 8 + 40 = 60$.

> **Watch out.** Subtract the intercept before dividing, and subtract it rather than add it: $(60 + 40) \\div 2.5$ and $60 \\div 2.5$ are both wrong. Do not substitute the given value for $x$: it is a value of $y$.`,
        `要求出哪个 $x$ 对应给定的预测值 $y$，就把预测的过程倒过来。预测是先把 $x$ 乘以 $m$，再加上 $b$，所以要按相反的顺序撤销：代入 $y$ 的值，减去 $b$，再除以 $m$。

对 $y = 2.5x + 40$，预测分数为 $60$ 时，$60 = 2.5x + 40$：两边减去 $40$ 得 $20 = 2.5x$，再除以 $2.5$ 得 $x = 8$ 小时。确实 $2.5 \\cdot 8 + 40 = 60$。

> **注意。** 先减去截距再除，而且是减去，不是加上：$(60 + 40) \\div 2.5$ 和 $60 \\div 2.5$ 都是错的。不要把给出的值代入 $x$：它是 $y$ 的值。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const md = drawModel(rng);
        const x0 = rng.int(md.c.xs[0], md.c.xs[1]);
        const Y = predict(md, x0);
        const diff = Y.sub(md.b);
        return numberProblem({
          prompt: t(
            `${md.intro.en} For what value of $x$ does the trend line predict the ${md.c.yName[0]} to be $${dec(Y)}$ ${md.c.yUnit[0]}?`,
            `${md.intro["zh-CN"]}当 $x$ 为多少时，趋势线预测的${md.c.yName[1]}是 $${dec(Y)}$ ${md.c.yUnit[1]}？`,
          ),
          answer: x0,
          solveFor: "x",
          wrong: [Y.add(md.b).div(md.m), Y.div(md.m), Y.mul(md.m).add(md.b)],
          solution: t(
            `**Step 1: Substitute the value of $y$.**${steps(`${dec(Y)} = ${decLinear(md.m, md.b)}`)}**Step 2: Subtract the intercept.** Subtract $${dec(md.b)}$ from both sides:${steps(`${dec(diff)} = ${dec(md.m)}x`)}**Step 3: Divide by the slope.**${steps(`x = ${dec(diff)} \\div ${pd(md.m)} = ${x0}`)}**Check.** Predict at $x = ${x0}$:${steps(substitution(md, x0))}which is the given value.`,
            `**第一步：代入 $y$ 的值。**${steps(`${dec(Y)} = ${decLinear(md.m, md.b)}`)}**第二步：减去截距。** 两边减去 $${dec(md.b)}$：${steps(`${dec(diff)} = ${dec(md.m)}x`)}**第三步：除以斜率。**${steps(`x = ${dec(diff)} \\div ${pd(md.m)} = ${x0}`)}**检验。** 在 $x = ${x0}$ 处预测：${steps(substitution(md, x0))}正是给出的值。`,
          ),
        });
      },
    },
    {
      id: "interpolation-and-extrapolation",
      title: t("Interpolation and extrapolation", "内插与外推"),
      explanation: t(
        `A trend line is drawn from data, so it is trustworthy only where there are data. A prediction for an $x$-value **within** the range of the data is an **interpolation**; one **outside** that range is an **extrapolation**. Extrapolations are less reliable: nothing in the data shows that the trend continues beyond it.

If the data have $x$-values from $2$ to $10$, predicting at $x = 7$ is an interpolation, even if no data point has $x = 7$, and predicting at $x = 15$ is an extrapolation.

> **Watch out.** The only question is whether $x$ lies inside the range of the data. Every prediction comes from the trend line, so that does not make it an interpolation, and a missing data point at that exact $x$ does not make it an extrapolation.`,
        `趋势线是由数据画出来的，所以只在有数据的地方才可信。对数据范围**以内**的 $x$ 值进行预测叫做**内插**；对范围**以外**的 $x$ 值进行预测叫做**外推**。外推不太可靠：数据并不能说明这个趋势在范围之外仍然成立。

如果数据的 $x$ 值从 $2$ 到 $10$，那么在 $x = 7$ 处预测是内插，即使没有 $x = 7$ 的数据点；在 $x = 15$ 处预测是外推。

> **注意。** 唯一要看的是 $x$ 是否在数据范围以内。所有预测都来自趋势线，这不能说明它是内插；恰好在这个 $x$ 处没有数据点，也不能说明它是外推。`,
      ),
      generate(rng) {
        const md = drawModel(rng);
        const [lo0, hi0] = md.c.xs;
        const quarter = Math.max(1, Math.floor((hi0 - lo0) / 4));
        const lo = rng.int(lo0, lo0 + quarter);
        const hi = rng.int(hi0 - quarter, hi0);
        const inside = rng.bool();
        const x0 = inside ? rng.int(lo + 1, hi - 1) : lo > 1 && rng.bool() ? rng.int(Math.max(1, lo - 5), lo - 1) : hi + rng.int(1, 6);
        const interpolates = t(
          `An interpolation, because $x = ${x0}$ is within the range of the data`,
          `内插，因为 $x = ${x0}$ 在数据范围以内`,
        );
        const extrapolates = t(
          `An extrapolation, because $x = ${x0}$ is outside the range of the data`,
          `外推，因为 $x = ${x0}$ 在数据范围以外`,
        );
        const where = inside
          ? t(`$${lo} < ${x0} < ${hi}$`, `$${lo} < ${x0} < ${hi}$`)
          : x0 < lo
            ? t(`$${x0} < ${lo}$, below the smallest $x$-value of the data`, `$${x0} < ${lo}$，比数据中最小的 $x$ 值还小`)
            : t(`$${x0} > ${hi}$, beyond the largest $x$-value of the data`, `$${x0} > ${hi}$，比数据中最大的 $x$ 值还大`);
        return reasonChoice(rng, {
          prompt: t(
            `${md.intro.en} The data used to draw it have $x$-values from $${lo}$ to $${hi}$. Is predicting the ${md.c.yName[0]} for ${md.c.at(x0)[0]} an interpolation or an extrapolation?`,
            `${md.intro["zh-CN"]}画这条趋势线所用的数据，$x$ 值从 $${lo}$ 到 $${hi}$。预测${md.c.at(x0)[1]}的${md.c.yName[1]}是内插还是外推？`,
          ),
          correct: inside ? interpolates : extrapolates,
          wrong: [
            inside ? extrapolates : interpolates,
            t("An interpolation, because the prediction comes from the trend line", "内插，因为预测值来自趋势线"),
            t(`An extrapolation, because no data point is known to have $x = ${x0}$`, `外推，因为不知道是否有 $x = ${x0}$ 的数据点`),
          ],
          solution: t(
            `**Step 1: The range of the data.** The data cover the $x$-values from $${lo}$ to $${hi}$, and the prediction is made at $x = ${x0}$.

**Step 2: Compare.** ${where.en}, so $x = ${x0}$ lies ${inside ? "within" : "outside"} the range, and the prediction is an ${inside ? "interpolation" : "extrapolation"}.`,
            `**第一步：数据的范围。** 数据覆盖的 $x$ 值从 $${lo}$ 到 $${hi}$，预测是在 $x = ${x0}$ 处做的。

**第二步：比较。** ${where["zh-CN"]}，所以 $x = ${x0}$ 在范围${inside ? "以内" : "以外"}，这个预测是${inside ? "内插" : "外推"}。`,
          ),
        });
      },
    },
    {
      id: "residuals",
      title: t("Residuals", "残差"),
      explanation: t(
        `A trend line predicts a value for each data point, and the real value is usually a little different. The **residual** of a data point measures that difference, how far the point lies above or below the line:

$$\\text{residual} = \\text{actual } y - \\text{predicted } y.$$

A positive residual means the point lies above the line (the line underestimates it); a negative one, below the line.

With $y = 2.5x + 40$, the data point $(6, 58)$ has predicted value $2.5 \\cdot 6 + 40 = 55$, so its residual is $58 - 55 = 3$: the student scored $3$ points more than predicted.

> **Watch out.** Subtract in the order actual minus predicted; predicted minus actual gives the opposite sign. The residual is the difference, not the predicted value itself, and the prediction needs the whole equation, intercept included.`,
        `趋势线对每个数据点都给出一个预测值，而真实值通常与它略有不同。数据点的**残差**衡量这个差，即点在趋势线上方或下方多远：

$$\\text{残差} = \\text{实际的 } y - \\text{预测的 } y$$

残差为正表示点在直线上方（直线低估了它）；残差为负表示点在直线下方。

对 $y = 2.5x + 40$，数据点 $(6, 58)$ 的预测值是 $2.5 \\cdot 6 + 40 = 55$，所以残差是 $58 - 55 = 3$：这名学生比预测多得了 $3$ 分。

> **注意。** 要按“实际值减预测值”的顺序相减；用预测值减实际值，符号就反了。残差是差，不是预测值本身；而且算预测值要用完整的方程，包括截距。`,
      ),
      generate(rng) {
        const md = drawModel(rng);
        const x0 = rng.int(md.c.xs[0], md.c.xs[1]);
        const pred = predict(md, x0);
        const r = Q.parse(md.c.resid).mul(Q.of(rng.nonZero(-6, 6)));
        const actual = pred.add(r);
        const above = r.sign() > 0;
        return numberProblem({
          prompt: t(
            `${md.intro.en} One data point is $(${x0}, ${dec(actual)})$. Find its residual.`,
            `${md.intro["zh-CN"]}有一个数据点是 $(${x0}, ${dec(actual)})$。求它的残差。`,
          ),
          answer: r,
          ...decimalForm(r),
          wrong: [r.neg(), pred, actual.sub(md.m.mul(Q.of(x0)))],
          solution: t(
            `**Step 1: The predicted value.** Substitute $x = ${x0}$ into the trend line:${steps(substitution(md, x0))}**Step 2: The residual.** Subtract the predicted value from the actual one:${steps(`${dec(actual)} - ${dec(pred)} = ${dec(r)}`)}**Check.** The residual is ${above ? "positive" : "negative"}, so the point should lie ${above ? "above" : "below"} the line, and it does: its $y$-value $${dec(actual)}$ is ${above ? "greater" : "less"} than the predicted $${dec(pred)}$.`,
            `**第一步：预测值。** 把 $x = ${x0}$ 代入趋势线：${steps(substitution(md, x0))}**第二步：残差。** 用实际值减去预测值：${steps(`${dec(actual)} - ${dec(pred)} = ${dec(r)}`)}**检验。** 残差为${above ? "正" : "负"}，所以点应在直线${above ? "上方" : "下方"}，事实正是如此：它的 $y$ 值 $${dec(actual)}$ ${above ? "大于" : "小于"}预测值 $${dec(pred)}$。`,
          ),
        });
      },
    },
  ],
};

export const interpretingTrendLineCoefficients: TopicDef = {
  id: "interpreting-trend-line-coefficients",
  title: t("Interpreting Trend Line Coefficients", "理解趋势线系数的含义"),
  summary: t(
    "Explain what the slope and the $y$-intercept of a trend line mean in a real situation.",
    "说明趋势线的斜率和 $y$ 轴截距在实际情境中的含义。",
  ),
  prerequisites: ["trend-lines", "interpreting-linear-expressions"],
  encompasses: [{ topic: "interpreting-linear-expressions", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.8.SP.A.3", "CCSS.HSS.ID.C.7"],
  intro: t(
    `In $y = mx + b$ the slope $m$ is the change in $y$ for each step of $1$ in $x$, and $b$ is the value of $y$ at $x = 0$. When the line is a trend line of real data, $x$ and $y$ are real quantities with units, so these two numbers say something about the situation itself, and reading them is often the reason the line was drawn.

Suppose $y = -2.5x + 30$ models the values of used cars of one model, in thousands of dollars, where $x$ is the age in years. A car aged $2$ years is predicted to be worth $25$ thousand dollars and one aged $3$ years $22.5$ thousand: each extra year takes off $2.5$ thousand dollars, which is the slope. At $x = 0$, a new car, the prediction is $30$ thousand dollars, the intercept.

In this lesson we put the slope and the intercept of a trend line into words, use the slope for changes over several units, and write a trend line from such a description.`,
    `在 $y = mx + b$ 中，斜率 $m$ 是 $x$ 每增加 $1$ 时 $y$ 的变化量，$b$ 是 $x = 0$ 时 $y$ 的值。当这条直线是真实数据的趋势线时，$x$ 和 $y$ 是带单位的真实的量，所以这两个数说的就是情境本身，而读懂它们往往正是画这条线的目的。

设 $y = -2.5x + 30$ 描述某款二手车的价值（千美元），$x$ 是车龄（年）。车龄 $2$ 年的汽车预测价值 $25$ 千美元，车龄 $3$ 年的预测价值 $22.5$ 千美元：每多一年少 $2.5$ 千美元，这就是斜率。在 $x = 0$，即新车时，预测值是 $30$ 千美元，这就是截距。

这节课我们用文字说出趋势线的斜率和截距的含义，用斜率求多个单位上的变化，并由这样的描述写出趋势线。`,
  ),
  knowledgePoints: [
    {
      id: "meaning-of-the-slope",
      title: t("The meaning of the slope", "斜率的含义"),
      explanation: t(
        `The slope $m$ of a trend line $y = mx + b$ is the predicted change in $y$ when $x$ increases by $1$, in the units of $y$ per unit of $x$. The reason: raising $x$ by $1$ adds $m$ to $mx$ and leaves $b$ alone. A positive slope is an increase, a negative one a decrease.

If $y = -2.5x + 30$ models the value of a car in thousands of dollars, where $x$ is its age in years, then for each additional year of age the predicted value decreases by $2.5$ thousand dollars.

> **Watch out.** The sign decides the direction: $-2.5$ means a decrease. The rate is the slope, not the intercept, and the slope is a change per unit, not a value at $x = 0$.`,
        `趋势线 $y = mx + b$ 的斜率 $m$ 表示 $x$ 每增加 $1$ 时 $y$ 的预测变化量，单位是“$y$ 的单位每 $x$ 的单位”。原因是：$x$ 增加 $1$，$mx$ 就增加 $m$，而 $b$ 不变。斜率为正表示增加，为负表示减少。

如果 $y = -2.5x + 30$ 描述汽车的价值（千美元），$x$ 是车龄（年），那么车龄每增加 1 年，预测的价值减少 $2.5$ 千美元。

> **注意。** 符号决定方向：$-2.5$ 表示减少。变化率是斜率，不是截距；斜率是每单位的变化量，不是 $x = 0$ 时的值。`,
      ),
      keyPrerequisites: ["interpreting-linear-expressions"],
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        const [p1, p2] = [predict(md, 1), predict(md, 2)];
        return reasoned(
          shuffledChoice(rng, {
            prompt: t(`${md.intro.en} What does the slope of the trend line mean?`, `${md.intro["zh-CN"]}趋势线的斜率表示什么？`),
            correct: slopeMeaning(md.c, a, up),
            wrong: [slopeMeaning(md.c, a, !up), slopeMeaning(md.c, md.b, up), interceptMeaning(md.c, a)],
            solution: t(
              `**Step 1: Find the slope.** The slope is the coefficient of $x$, $${dec(md.m)}$: the change in $y$ for each increase of $1$ in $x$.

**Step 2: Put it into words.** It is ${up ? "positive, an increase" : "negative, a decrease"}: for ${md.c.each[0]}, the predicted ${md.c.yName[0]} ${up ? "increases" : "decreases"} by $${dec(a)}$ ${md.c.yUnit[0]}.

**Check.** The predictions at $x = 1$ and $x = 2$ are $${dec(p1)}$ and $${dec(p2)}$, and $${dec(p2)} - ${pd(p1)} = ${dec(md.m)}$: one more unit of $x$ changes the prediction by the slope.`,
              `**第一步：找出斜率。** 斜率是 $x$ 的系数 $${dec(md.m)}$，即 $x$ 每增加 $1$ 时 $y$ 的变化量。

**第二步：用文字表达。** 它是${up ? "正数，表示增加" : "负数，表示减少"}：${md.c.each[1]}，预测的${md.c.yName[1]}${up ? "增加" : "减少"} $${dec(a)}$ ${md.c.yUnit[1]}。

**检验。** $x = 1$ 和 $x = 2$ 处的预测值是 $${dec(p1)}$ 和 $${dec(p2)}$，$${dec(p2)} - ${pd(p1)} = ${dec(md.m)}$：$x$ 多一个单位，预测值就变化一个斜率。`,
            ),
          }),
          [
            [
              slopeMeaning(md.c, a, !up).en,
              "The direction is reversed: the sign of the slope says whether the prediction rises or falls.",
              "方向反了：斜率的符号决定预测值是增加还是减少。",
            ],
            [
              slopeMeaning(md.c, md.b, up).en,
              "This uses the $y$-intercept as the rate: the change per unit is the slope.",
              "这里把 $y$ 轴截距当成了变化率：每单位的变化量是斜率。",
            ],
            [
              interceptMeaning(md.c, a).en,
              "This reads the slope as a starting value: the slope is a change per unit, not a value at $x = 0$.",
              "这里把斜率当成了起始值：斜率是每单位的变化量，不是 $x = 0$ 时的值。",
            ],
          ],
        );
      },
    },
    {
      id: "meaning-of-the-intercept",
      title: t("The meaning of the $y$-intercept", "$y$ 轴截距的含义"),
      explanation: t(
        `The $y$-intercept $b$ of a trend line $y = mx + b$ is the predicted value of $y$ when $x = 0$, because then $mx = 0$ and only $b$ is left. In words, it is the prediction for the item whose $x$-quantity is zero.

If $y = 1.5x + 14$ models hourly wages in dollars, where $x$ is years of experience, then a worker with no experience is predicted to earn $14$ dollars an hour. Ask whether $x = 0$ makes sense in the situation: when it lies far outside the data, the intercept is an extrapolation.

> **Watch out.** The intercept is the constant term, not the slope's number. And it is one value, at $x = 0$, not a change per unit: do not describe it as an increase or decrease "for each" unit.`,
        `趋势线 $y = mx + b$ 的 $y$ 轴截距 $b$ 是 $x = 0$ 时 $y$ 的预测值，因为这时 $mx = 0$，只剩下 $b$。用文字说，它是 $x$ 所代表的量为零的那个对象的预测值。

如果 $y = 1.5x + 14$ 描述时薪（美元），$x$ 是工作年限，那么没有工作经验的员工预测时薪是 $14$ 美元。要想一想 $x = 0$ 在情境中是否有意义：如果它远在数据范围之外，截距就是一种外推。

> **注意。** 截距是常数项，不是斜率的数值。而且它是 $x = 0$ 时的一个值，不是每单位的变化量：不要把它说成“每”一个单位增加或减少多少。`,
      ),
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        return reasoned(
          shuffledChoice(rng, {
            prompt: t(
              `${md.intro.en} What does the $y$-intercept of the trend line mean?`,
              `${md.intro["zh-CN"]}趋势线的 $y$ 轴截距表示什么？`,
            ),
            correct: interceptMeaning(md.c, md.b),
            wrong: [interceptMeaning(md.c, a), slopeMeaning(md.c, md.b, up), slopeMeaning(md.c, md.b, !up)],
            solution: t(
              `**Step 1: Find the intercept.** The $y$-intercept is the constant term, $${dec(md.b)}$.

**Step 2: Put it into words.** It is the predicted value of $y$ when $x = 0$, that is, when ${md.c.zero[0]}: the predicted ${md.c.yName[0]} is then $${dec(md.b)}$ ${md.c.yUnit[0]}.

**Check.** Substituting $x = 0$ gives $y = ${dec(md.m)} \\cdot 0 + ${dec(md.b)} = ${dec(md.b)}$: the slope drops out, and only the intercept is left.`,
              `**第一步：找出截距。** $y$ 轴截距是常数项 $${dec(md.b)}$。

**第二步：用文字表达。** 它是 $x = 0$ 时 $y$ 的预测值，也就是${md.c.zero[1]}，预测的${md.c.yName[1]}是 $${dec(md.b)}$ ${md.c.yUnit[1]}。

**检验。** 代入 $x = 0$ 得 $y = ${dec(md.m)} \\cdot 0 + ${dec(md.b)} = ${dec(md.b)}$：斜率不起作用，只剩下截距。`,
            ),
          }),
          [
            [
              interceptMeaning(md.c, a).en,
              "This uses the slope's number: the value at $x = 0$ is the $y$-intercept.",
              "这里用的是斜率的数值：$x = 0$ 时的值是 $y$ 轴截距。",
            ],
            [
              slopeMeaning(md.c, md.b, up).en,
              "This reads the intercept as a rate: it is a single value at $x = 0$, not a change per unit.",
              "这里把截距当成了变化率：它是 $x = 0$ 时的一个值，不是每单位的变化量。",
            ],
            [
              slopeMeaning(md.c, md.b, !up).en,
              "This reads the intercept as a rate: it is a single value at $x = 0$, not a change per unit.",
              "这里把截距当成了变化率：它是 $x = 0$ 时的一个值，不是每单位的变化量。",
            ],
          ],
        );
      },
    },
    {
      id: "change-over-an-interval",
      title: t("Predicted change over several units", "多个单位上的预测变化"),
      explanation: t(
        `Since the slope is the predicted change for each unit of $x$, and each unit adds the same change, $k$ more units change the predicted $y$ by $k$ times the slope. The intercept plays no part: it is the same at both ends, so it cancels.

With $y = -2.5x + 30$ for the value of a car, $4$ more years of age lower the predicted value by $4 \\cdot 2.5 = 10$ thousand dollars. From age $1$ to age $5$, for example, the prediction goes from $27.5$ to $17.5$.

> **Watch out.** Multiply the slope by the number of units: the slope alone is the change for one unit only. Do not add the intercept to the change, and do not answer with the number of units.`,
        `斜率是 $x$ 每增加一个单位时的预测变化量，而每个单位带来的变化都相同，所以 $x$ 再增加 $k$ 个单位，预测的 $y$ 变化斜率的 $k$ 倍。截距不起作用：两端的截距相同，相减就抵消了。

对描述汽车价值的 $y = -2.5x + 30$，车龄再增加 $4$ 年，预测价值减少 $4 \\cdot 2.5 = 10$ 千美元。例如从车龄 $1$ 年到 $5$ 年，预测值从 $27.5$ 降到 $17.5$。

> **注意。** 要用斜率乘以单位数：斜率本身只是一个单位的变化量。不要把截距加到变化量上，也不要把单位数当成答案。`,
      ),
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        const k = rng.int(2, 6);
        const change = a.mul(Q.of(k));
        const x1 = md.c.xs[0];
        const [p1, p2] = [predict(md, x1), predict(md, x1 + k)];
        return numberProblem({
          prompt: t(
            `${md.intro.en} By how many ${md.c.yUnit[0]} does the predicted ${md.c.yName[0]} ${up ? "increase" : "decrease"} when ${md.c.xName[0]} increases by $${k}$ ${md.c.xUnit[0]}?`,
            `${md.intro["zh-CN"]}${md.c.xName[1]}增加 $${k}$ ${md.c.xUnit[1]}时，预测的${md.c.yName[1]}${up ? "增加" : "减少"}多少${md.c.yUnit[1]}？`,
          ),
          answer: change,
          ...decimalForm(change),
          wrong: [a, change.add(md.b), Q.of(k), a.add(Q.of(k))],
          solution: t(
            `**Step 1: The change for one unit.** The slope is $${dec(md.m)}$, so each unit of $x$ ${up ? "raises" : "lowers"} the prediction by $${dec(a)}$ ${md.c.yUnit[0]}.

**Step 2: The change for $${k}$ units.** Each of the $${k}$ units brings the same change:${steps(`${k} \\cdot ${dec(a)} = ${dec(change)}`)}**Check.** Compare two predictions $${k}$ units apart: at $x = ${x1}$ the line gives $${dec(p1)}$ and at $x = ${x1 + k}$ it gives $${dec(p2)}$, which is ${up ? `$${dec(p2)} - ${dec(p1)} = ${dec(change)}$ more` : `$${dec(p1)} - ${dec(p2)} = ${dec(change)}$ less`}.`,
            `**第一步：一个单位的变化。** 斜率是 $${dec(md.m)}$，所以 $x$ 每增加一个单位，预测值${up ? "增加" : "减少"} $${dec(a)}$ ${md.c.yUnit[1]}。

**第二步：$${k}$ 个单位的变化。** 这 $${k}$ 个单位每个带来的变化都相同：${steps(`${k} \\cdot ${dec(a)} = ${dec(change)}`)}**检验。** 比较相隔 $${k}$ 个单位的两个预测值：$x = ${x1}$ 时直线给出 $${dec(p1)}$，$x = ${x1 + k}$ 时给出 $${dec(p2)}$，${up ? `多了 $${dec(p2)} - ${dec(p1)} = ${dec(change)}$` : `少了 $${dec(p1)} - ${dec(p2)} = ${dec(change)}$`}。`,
          ),
        });
      },
    },
    {
      id: "trend-line-from-its-meaning",
      title: t("Writing a trend line from its meaning", "由含义写出趋势线"),
      explanation: t(
        `When the meaning of a trend line is given in words, its equation follows, because each sentence names one coefficient. The predicted value at $x = 0$ is the intercept $b$, and the change for each unit of $x$ is the slope $m$, negative for a decrease.

A car is predicted to be worth $30$ thousand dollars when new and to lose $2.5$ thousand dollars of value for each year of age: $b = 30$, $m = -2.5$, so $y = -2.5x + 30$.

> **Watch out.** The value at $x = 0$ is the constant term and the change per unit multiplies $x$: do not swap them. A decrease makes the slope negative. The starting value stays positive even when the quantity decreases.`,
        `当趋势线的含义用文字给出时，就能写出它的方程，因为每句话说出了一个系数。$x = 0$ 时的预测值是截距 $b$，$x$ 每增加一个单位的变化量是斜率 $m$，减少时 $m$ 为负。

一辆汽车新车时预测价值 $30$ 千美元，车龄每增加 1 年预测价值减少 $2.5$ 千美元：$b = 30$，$m = -2.5$，所以 $y = -2.5x + 30$。

> **注意。** $x = 0$ 时的值是常数项，每单位的变化量乘以 $x$：不要把二者对调。减少使斜率为负；即使量在减少，起始值仍是正的。`,
      ),
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        const answer = md.eq;
        const s = slopeMeaning(md.c, a, up);
        const i = interceptMeaning(md.c, md.b);
        const p1 = predict(md, 1);
        return equationProblem({
          prompt: t(
            `A trend line models ${md.c.model[0]}, where $x$ is ${md.c.x[0]} and $y$ is ${md.c.y[0]}. ${i.en} ${s.en} Write the equation of the trend line in slope-intercept form.`,
            `一条趋势线描述${md.c.model[1]}，其中 $x$ 表示${md.c.x[1]}，$y$ 表示${md.c.y[1]}。${i["zh-CN"]}${s["zh-CN"]}写出这条趋势线的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [`y = ${decLinear(md.b, md.m)}`, `y = ${decLinear(md.m.neg(), md.b)}`, `y = ${decLinear(md.m, md.b.neg())}`],
          solution: t(
            `**Step 1: The intercept.** The predicted value at $x = 0$ is $${dec(md.b)}$, so $b = ${dec(md.b)}$.

**Step 2: The slope.** The change for each unit of $x$ is ${up ? "an increase" : "a decrease"} of $${dec(a)}$, so $m = ${dec(md.m)}$.

**Step 3: Write the equation.**${steps(answer)}**Check.** One unit after $x = 0$, the equation gives $y = ${dec(md.m)} \\cdot 1 + ${dec(md.b)} = ${dec(p1)}$, which is $${dec(md.b)}$ ${up ? "plus" : "minus"} $${dec(a)}$, as described.`,
            `**第一步：截距。** $x = 0$ 时的预测值是 $${dec(md.b)}$，所以 $b = ${dec(md.b)}$。

**第二步：斜率。** $x$ 每增加一个单位，变化量是${up ? "增加" : "减少"} $${dec(a)}$，所以 $m = ${dec(md.m)}$。

**第三步：写出方程。**${steps(answer)}**检验。** 从 $x = 0$ 再增加一个单位，方程给出 $y = ${dec(md.m)} \\cdot 1 + ${dec(md.b)} = ${dec(p1)}$，即 $${dec(md.b)}$ ${up ? "加上" : "减去"} $${dec(a)}$，与描述相符。`,
          ),
        });
      },
    },
  ],
};

/** directionOptions name the direction of a correlation. */
const directionOptions: readonly Text[] = [
  t("Positive correlation", "正相关"),
  t("Negative correlation", "负相关"),
  t("No correlation", "不相关"),
];

/** strengthOptions name the direction and strength of a correlation. */
const strengthOptions: readonly Text[] = [
  t("Strong positive correlation", "强正相关"),
  t("Weak positive correlation", "弱正相关"),
  t("No correlation", "不相关"),
  t("Weak negative correlation", "弱负相关"),
  t("Strong negative correlation", "强负相关"),
];

const strengths: readonly Strength[] = ["strong+", "weak+", "none", "weak-", "strong-"];

/** correlationIntro shows points that rise from left to right close to a line, a strong positive correlation. */
const correlationIntro: Figure = scatterFigure([
  [1, 2],
  [2, 2],
  [2, 3],
  [3, 4],
  [4, 4],
  [5, 5],
  [5, 6],
  [6, 6],
  [7, 7],
  [8, 7],
  [8, 8],
  [9, 9],
]);

/** strengthSteps explains the direction and then the strength of a correlation, step by step. */
function strengthSteps(s: Strength): Text {
  const direction =
    s === "none"
      ? t(
          "**Step 1: The direction.** Moving from left to right, the points neither rise nor fall: the points on the right are about as high, on average, as those on the left.",
          "**第一步：方向。** 从左往右看，点既不上升也不下降：右边的点平均来说与左边的点差不多高。",
        )
      : s.endsWith("+")
        ? t(
            "**Step 1: The direction.** Moving from left to right, the points tend to rise: the correlation is positive.",
            "**第一步：方向。** 从左往右看，点总体上升：相关是正的。",
          )
        : t(
            "**Step 1: The direction.** Moving from left to right, the points tend to fall: the correlation is negative.",
            "**第一步：方向。** 从左往右看，点总体下降：相关是负的。",
          );
  const closeness =
    s === "none"
      ? t(
          "**Step 2: The strength.** With no upward or downward trend, no line fits the points better than a flat one: there is no correlation.",
          "**第二步：强弱。** 没有上升或下降的趋势，任何直线都不比水平线拟合得更好：不相关。",
        )
      : s.startsWith("strong")
        ? t(
            `**Step 2: The strength.** The points lie close to a line, in a narrow band: a strong ${s.endsWith("+") ? "positive" : "negative"} correlation.`,
            `**第二步：强弱。** 点紧靠一条直线，形成一条窄带：强${s.endsWith("+") ? "正" : "负"}相关。`,
          )
        : t(
            `**Step 2: The strength.** The trend is visible, but the points are widely scattered around a line, in a wide band: a weak ${s.endsWith("+") ? "positive" : "negative"} correlation.`,
            `**第二步：强弱。** 趋势看得出来，但点在直线周围分散得很开，形成一条宽带：弱${s.endsWith("+") ? "正" : "负"}相关。`,
          );
  return t(`${direction.en}\n\n${closeness.en}`, `${direction["zh-CN"]}\n\n${closeness["zh-CN"]}`);
}

/** rTargets are the correlation coefficients offered when estimating r from a scatter plot. */
const rTargets: readonly number[] = [-0.9, -0.5, 0, 0.5, 0.9];

export const linearCorrelation: TopicDef = {
  id: "linear-correlation",
  title: t("Linear Correlation", "线性相关"),
  summary: t(
    "Describe the direction and strength of a linear relationship, and relate them to the correlation coefficient $r$.",
    "描述线性关系的方向与强弱，并把它们与相关系数 $r$ 联系起来。",
  ),
  prerequisites: ["scatter-plots"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.8.SP.A.1", "CCSS.HSS.ID.C.8"],
  intro: t(
    `A scatter plot shows one point for each item of paired data. Looking at all the points together, the eye sees more than single items: a **pattern**. Often the points drift upward or downward, roughly along a line, and how clearly they do so tells how closely the two variables are tied together.

Here, for example, items with a larger $x$ almost always have a larger $y$, and the points stay close to a rising line:

{{figure 0}}

Such a relationship is called a **linear correlation**. In this lesson we describe its direction (positive, negative or none) and its strength (strong or weak), and measure both with one number, the correlation coefficient $r$.`,
    `散点图对成对数据的每个对象画一个点。把所有点放在一起看，看到的就不只是单个对象，而是一种**规律**。点常常大致沿一条直线向上或向下延伸，而它们延伸得有多清楚，说明两个变量联系得有多紧密。

例如在这里，$x$ 较大的对象几乎总是 $y$ 也较大，而且点紧靠一条上升的直线：

{{figure 0}}

这样的关系叫做**线性相关**。这节课我们描述它的方向（正、负或不相关）和强弱（强或弱），并用一个数，即相关系数 $r$，同时衡量二者。`,
  ),
  introFigures: [correlationIntro],
  knowledgePoints: [
    {
      id: "direction-of-a-correlation",
      title: t("Positive, negative or no correlation", "正相关、负相关或不相关"),
      explanation: t(
        `Two variables are **correlated** when one tends to change with the other. Reading a scatter plot from left to right means letting $x$ increase, so the direction in which the points drift shows how $y$ responds:

- **positive correlation**: as $x$ increases, $y$ tends to increase, and the points rise from left to right;
- **negative correlation**: as $x$ increases, $y$ tends to decrease, and the points fall;
- **no correlation**: the points show no upward or downward trend.

Hours studied and test scores are positively correlated; the age and the value of a car, negatively.

> **Watch out.** Always read from left to right: points that fall as you move right show a negative correlation, even though they start high. "No correlation" means no trend at all, not a trend with some scatter.`,
        `如果一个变量倾向于随另一个变量变化，就说两个变量**相关**。从左往右读散点图，就是让 $x$ 增大，所以点延伸的方向显示了 $y$ 如何随之变化：

- **正相关**：$x$ 增大时 $y$ 倾向于增大，点从左到右上升；
- **负相关**：$x$ 增大时 $y$ 倾向于减小，点从左到右下降；
- **不相关**：点没有上升或下降的趋势。

学习时长与考试分数正相关；汽车的车龄与价值负相关。

> **注意。** 一定要从左往右读：向右走时下降的点表示负相关，即使它们一开始很高。“不相关”指完全没有趋势，而不是有趋势但点比较分散。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const pts = kind === 0 ? correlated(rng, 0.6, 1) : kind === 1 ? correlated(rng, -1, -0.6) : correlated(rng, -0.12, 0.12);
        const steps2 = [
          t(
            "**Step 1: Follow the points from left to right.** The points on the left are low and those on the right are high: as $x$ increases, $y$ tends to increase.\n\n**Step 2: Name the direction.** Rising points show a positive correlation.",
            "**第一步：从左往右看点。** 左边的点低，右边的点高：$x$ 增大时 $y$ 倾向于增大。\n\n**第二步：说出方向。** 上升的点表示正相关。",
          ),
          t(
            "**Step 1: Follow the points from left to right.** The points on the left are high and those on the right are low: as $x$ increases, $y$ tends to decrease.\n\n**Step 2: Name the direction.** Falling points show a negative correlation.",
            "**第一步：从左往右看点。** 左边的点高，右边的点低：$x$ 增大时 $y$ 倾向于减小。\n\n**第二步：说出方向。** 下降的点表示负相关。",
          ),
          t(
            "**Step 1: Follow the points from left to right.** At every part of the $x$-axis the points are spread from low to high, with no drift up or down as $x$ increases.\n\n**Step 2: Name the direction.** With no upward or downward trend, there is no correlation.",
            "**第一步：从左往右看点。** 在 $x$ 轴的每一段，点都从低到高散开，随着 $x$ 增大既不向上也不向下偏移。\n\n**第二步：说出方向。** 没有上升或下降的趋势，所以不相关。",
          ),
        ][kind]!;
        return {
          ...choiceProblem({
            prompt: t("What kind of correlation does the scatter plot show?", "这个散点图显示的是哪种相关关系？"),
            options: directionOptions,
            correct: kind,
            solution: steps2,
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "strength-of-a-correlation",
      figure: algebraDrawings["linear-correlation#strength-of-a-correlation"],
      title: t("Strong and weak correlation", "强相关与弱相关"),
      explanation: t(
        `The **strength** of a linear correlation is how closely the points follow a line, which is how well $x$ predicts $y$. In a **strong** correlation they lie close to a line, in a narrow band; in a **weak** one the trend is visible but the points are widely scattered around it, in a wide band.

So describe a scatter plot in two steps: first the direction, rising or falling, then the strength, narrow or wide band. A narrow falling band is a strong negative correlation.

> **Watch out.** Strength and direction are separate: a correlation can be strong and negative, or weak and positive. Steepness is not strength: a gently rising cloud of points shows a strong correlation if the points hug a line. And a weak trend is still a correlation, not "no correlation".`,
        `线性相关的**强弱**指点与一条直线贴合的程度，也就是 $x$ 能多好地预测 $y$。**强**相关时点紧靠一条直线，形成窄带；**弱**相关时虽能看出趋势，但点在直线周围分散得很开，形成宽带。

所以描述散点图分两步：先看方向，上升还是下降；再看强弱，窄带还是宽带。一条下降的窄带是强负相关。

> **注意。** 强弱与方向是两回事：相关可以是强的负相关，也可以是弱的正相关。陡峭程度不等于强弱：一团缓缓上升的点，只要紧贴一条直线，也是强相关。弱的趋势仍是相关，不是“不相关”。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const s = strengths[kind]!;
        const [lo, hi] = strengthRange[s];
        return {
          ...choiceProblem({
            prompt: t("Describe the correlation shown by the scatter plot.", "描述这个散点图所显示的相关关系。"),
            options: strengthOptions,
            correct: kind,
            solution: strengthSteps(s),
          }),
          figure: scatterFigure(correlated(rng, lo, hi)),
        };
      },
    },
    {
      id: "estimating-r",
      title: t("The correlation coefficient $r$", "相关系数 $r$"),
      explanation: t(
        `The **correlation coefficient** $r$ measures a linear correlation with one number between $-1$ and $1$, built so that both features of the scatter plot can be read from it:

- its **sign** is the direction: $r > 0$ for a positive correlation, $r < 0$ for a negative one;
- its **size** $|r|$ is the strength: near $1$ the points lie close to a line, near $0$ there is little or no linear correlation.

$r = 1$ or $r = -1$ means every point lies exactly on a line. $r = -0.9$ is a strong negative correlation, and $r = 0.5$ a moderate positive one.

> **Watch out.** Read the sign from the direction and the size from the closeness, separately: a falling narrow band is close to $-1$, not to $1$. A value near $0$ means no linear trend, not a weak negative one.`,
        `**相关系数** $r$ 用 $-1$ 到 $1$ 之间的一个数来衡量线性相关，它的设计使散点图的两个特征都能从中读出：

- 它的**符号**表示方向：正相关时 $r > 0$，负相关时 $r < 0$；
- 它的**大小** $|r|$ 表示强弱：接近 $1$ 时点紧靠一条直线，接近 $0$ 时几乎没有线性相关。

$r = 1$ 或 $r = -1$ 表示所有点恰好在一条直线上。$r = -0.9$ 是强负相关，$r = 0.5$ 是中等程度的正相关。

> **注意。** 符号由方向决定，大小由贴合程度决定，要分开读：下降的窄带接近 $-1$，而不是 $1$。接近 $0$ 的值表示没有线性趋势，而不是弱的负相关。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const target = rTargets[kind]!;
        const pts = correlated(rng, target - 0.07, target + 0.07);
        const sign = [
          t("The points fall from left to right, so $r$ is negative.", "点从左到右下降，所以 $r$ 为负。"),
          t("The points tend to fall from left to right, so $r$ is negative.", "点总体从左到右下降，所以 $r$ 为负。"),
          t("The points neither rise nor fall from left to right.", "点从左到右既不上升也不下降。"),
          t("The points tend to rise from left to right, so $r$ is positive.", "点总体从左到右上升，所以 $r$ 为正。"),
          t("The points rise from left to right, so $r$ is positive.", "点从左到右上升，所以 $r$ 为正。"),
        ][kind]!;
        const size = [
          t(
            "They lie close to a line, so $|r|$ is near $1$: $r$ is close to $-1$, about $-0.9$.",
            "它们紧靠一条直线，所以 $|r|$ 接近 $1$：$r$ 接近 $-1$，约为 $-0.9$。",
          ),
          t(
            "They are widely scattered around a line, so $|r|$ is well below $1$: a moderate negative correlation, $r$ about $-0.5$.",
            "它们在直线周围分散得较开，所以 $|r|$ 明显小于 $1$：中等程度的负相关，$r$ 约为 $-0.5$。",
          ),
          t("With no linear trend, $r$ is close to $0$.", "没有线性趋势，$r$ 接近 $0$。"),
          t(
            "They are widely scattered around a line, so $|r|$ is well below $1$: a moderate positive correlation, $r$ about $0.5$.",
            "它们在直线周围分散得较开，所以 $|r|$ 明显小于 $1$：中等程度的正相关，$r$ 约为 $0.5$。",
          ),
          t(
            "They lie close to a line, so $|r|$ is near $1$: $r$ is close to $1$, about $0.9$.",
            "它们紧靠一条直线，所以 $|r|$ 接近 $1$：$r$ 接近 $1$，约为 $0.9$。",
          ),
        ][kind]!;
        return {
          ...choiceProblem({
            prompt: t(
              "Which value is closest to the correlation coefficient $r$ of the data in the scatter plot?",
              "下列哪个值最接近散点图中数据的相关系数 $r$？",
            ),
            options: rTargets.map((r) => same(`$r = ${r}$`)),
            correct: kind,
            solution: t(
              `**Step 1: The sign, from the direction.** ${sign.en}\n\n**Step 2: The size, from the closeness to a line.** ${size.en}`,
              `**第一步：由方向定符号。** ${sign["zh-CN"]}\n\n**第二步：由贴合程度定大小。** ${size["zh-CN"]}`,
            ),
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "comparing-correlation-coefficients",
      title: t("Comparing correlation coefficients", "比较相关系数"),
      explanation: t(
        `The strength of a correlation depends only on the size $|r|$, not on the sign, because the sign only records the direction. $r = -0.92$ shows a stronger linear relationship than $r = 0.85$, since $0.92 > 0.85$; its points hug a falling line more closely than the others hug a rising one.

So to compare strengths, drop the signs and compare the sizes. The weakest linear relationship is the one with $r$ closest to $0$.

> **Watch out.** Do not compare the signed values: $0.3 > -0.8$, but $r = -0.8$ is far stronger. The strongest correlation has the largest $|r|$, whatever its sign, and the weakest has the smallest $|r|$, not the most negative $r$.`,
        `相关的强弱只取决于 $|r|$ 的大小，与符号无关，因为符号只记录方向。$r = -0.92$ 显示的线性关系比 $r = 0.85$ 更强，因为 $0.92 > 0.85$；它的点贴合一条下降直线的程度，比另一组点贴合上升直线的程度更高。

所以比较强弱时，去掉符号比较大小。线性关系最弱的是 $r$ 最接近 $0$ 的那个。

> **注意。** 不要比较带符号的值：$0.3 > -0.8$，但 $r = -0.8$ 强得多。最强的相关 $|r|$ 最大，不论符号；最弱的相关 $|r|$ 最小，而不是 $r$ 最负。`,
      ),
      generate(rng) {
        const pool = Array.from({ length: 39 }, (_, i) => i - 19).filter((k) => k !== 0);
        for (;;) {
          const ks = rng.sample(pool, 4);
          const strongest = rng.bool();
          const abs = ks.map(Math.abs);
          const best = strongest ? Math.max(...abs) : Math.min(...abs);
          if (abs.filter((a) => a === best).length !== 1) continue;
          const i = abs.indexOf(best);
          const r = (k: number) => dec(Q.of(k * 5, 100));
          const ordered = [...abs].sort((a, b) => (strongest ? b - a : a - b));
          const chain = ordered.map((v, j) => (j === 0 ? r(v) : `${v === ordered[j - 1] ? "=" : strongest ? ">" : "<"} ${r(v)}`)).join(" ");
          return choiceProblem({
            prompt: t(
              `Four data sets have the correlation coefficients ${ks.map((k) => `$${r(k)}$`).join(", ")}. Which one shows the ${strongest ? "strongest" : "weakest"} linear relationship?`,
              `四组数据的相关系数分别是 ${ks.map((k) => `$${r(k)}$`).join("、")}。哪一个显示的线性关系${strongest ? "最强" : "最弱"}？`,
            ),
            options: ks.map((k) => same(`$r = ${r(k)}$`)),
            correct: i,
            solution: t(
              `**Step 1: Drop the signs.** The strength is the size $|r|$: ${ks.map((k) => `$${r(Math.abs(k))}$`).join(", ")}.

**Step 2: Pick the ${strongest ? "largest" : "smallest"} size.** It is $${r(best)}$, so $r = ${r(ks[i]!)}$ shows the ${strongest ? "strongest" : "weakest"} linear relationship.

**Check.** In order from ${strongest ? "largest to smallest" : "smallest to largest"}, the sizes are $${chain}$, and $${r(best)}$ comes first.`,
              `**第一步：去掉符号。** 强弱看 $|r|$ 的大小：${ks.map((k) => `$${r(Math.abs(k))}$`).join("，")}。

**第二步：选出${strongest ? "最大" : "最小"}的。** 它是 $${r(best)}$，所以 $r = ${r(ks[i]!)}$ 显示的线性关系${strongest ? "最强" : "最弱"}。

**检验。** 按从${strongest ? "大到小" : "小到大"}的顺序排列，大小依次是 $${chain}$，$${r(best)}$ 排在第一位。`,
            ),
          });
        }
      },
    },
  ],
};

/** Lurking is a correlation between two variables explained by a third. */
interface Lurking {
  readonly setting: Pair;
  readonly a: Pair;
  readonly b: Pair;
  readonly z: Pair;
}

const lurkings: readonly Lurking[] = [
  {
    setting: ["In the daily data of a seaside town over one year", "在一个海滨小镇一年中每天的数据里"],
    a: ["ice cream sales", "冰淇淋销量"],
    b: ["the number of swimmers rescued by lifeguards", "救生员救起的游泳者人数"],
    z: ["hot weather", "炎热的天气"],
  },
  {
    setting: ["Among the fires in a city last year", "在一个城市去年发生的火灾中"],
    a: ["the number of firefighters sent", "出动的消防员人数"],
    b: ["the damage caused", "造成的损失"],
    z: ["the size of the fire", "火势的大小"],
  },
  {
    setting: ["Among the children of an elementary school", "在一所小学的孩子们中"],
    a: ["shoe size", "鞋码"],
    b: ["reading score", "阅读成绩"],
    z: ["age", "年龄"],
  },
  {
    setting: ["In the weekly data of a town over one year", "在一个小镇一年中每周的数据里"],
    a: ["heating bills", "取暖费"],
    b: ["hot chocolate sales", "热巧克力销量"],
    z: ["cold weather", "寒冷的天气"],
  },
  {
    setting: ["Across many countries", "在许多国家中"],
    a: ["the number of televisions per household", "每户的电视机数量"],
    b: ["life expectancy", "预期寿命"],
    z: ["the wealth of the country", "国家的富裕程度"],
  },
  {
    setting: ["In the daily data of a city over one summer", "在一个城市一个夏天每天的数据里"],
    a: ["sunglasses sales", "太阳镜销量"],
    b: ["the number of sunburns treated", "就诊的晒伤人数"],
    z: ["sunny weather", "晴朗的天气"],
  },
  {
    setting: ["Across the cities of a country", "在一个国家的各个城市中"],
    a: ["the number of libraries", "图书馆的数量"],
    b: ["the number of traffic accidents", "交通事故的数量"],
    z: ["the population of the city", "城市的人口"],
  },
  {
    setting: ["In the weekly data of a city over one year", "在一个城市一年中每周的数据里"],
    a: ["coat sales", "大衣销量"],
    b: ["flu cases", "流感病例数"],
    z: ["the winter season", "冬季"],
  },
  {
    setting: ["Among students aged 6 to 16", "在 6 到 16 岁的学生中"],
    a: ["height", "身高"],
    b: ["the number of words they know", "掌握的词汇量"],
    z: ["age", "年龄"],
  },
  {
    setting: ["Across the stores of a chain", "在一家连锁店的各个门店中"],
    a: ["the number of employees", "员工人数"],
    b: ["the amount of electricity used", "用电量"],
    z: ["the size of the store", "门店的面积"],
  },
];

/** Study is a study of whether a treatment affects an outcome. */
interface Study {
  readonly units: Pair;
  /** unit is the bare noun of a unit: "students" / "学生". */
  readonly unit: Pair;
  /** treat is what the treated group did: "used the reading app". */
  readonly treat: Pair;
  /** outcome is the observed difference: "scored higher on a reading test". */
  readonly outcome: Pair;
  /** cause and effect name the claim: "using the app", "higher reading scores". */
  readonly cause: Pair;
  readonly effect: Pair;
}

const studies: readonly Study[] = [
  {
    units: ["students", "名学生"],
    unit: ["students", "学生"],
    treat: ["used a reading app for a month", "使用阅读应用一个月"],
    outcome: ["scored higher on a reading test", "在阅读测验中得分更高"],
    cause: ["using the app", "使用这款应用"],
    effect: ["higher reading scores", "阅读成绩提高"],
  },
  {
    units: ["tomato plants", "株番茄"],
    unit: ["tomato plants", "番茄"],
    treat: ["were given a new fertilizer", "施了一种新肥料"],
    outcome: ["produced more tomatoes", "结的番茄更多"],
    cause: ["the fertilizer", "这种肥料"],
    effect: ["a larger harvest", "产量增加"],
  },
  {
    units: ["adults", "名成年人"],
    unit: ["adults", "成年人"],
    treat: ["walked 30 minutes a day for three months", "三个月里每天步行 30 分钟"],
    outcome: ["had lower blood pressure", "血压更低"],
    cause: ["daily walking", "每天步行"],
    effect: ["lower blood pressure", "血压降低"],
  },
  {
    units: ["office workers", "名办公室职员"],
    unit: ["office workers", "职员"],
    treat: ["took a vitamin supplement all winter", "整个冬天服用一种维生素补充剂"],
    outcome: ["had fewer colds", "感冒次数更少"],
    cause: ["the supplement", "这种补充剂"],
    effect: ["fewer colds", "感冒减少"],
  },
  {
    units: ["students", "名学生"],
    unit: ["students", "学生"],
    treat: ["listened to music while studying", "学习时听音乐"],
    outcome: ["scored lower on a memory test", "在记忆测验中得分更低"],
    cause: ["listening to music", "听音乐"],
    effect: ["lower memory scores", "记忆成绩下降"],
  },
  {
    units: ["teenagers", "名青少年"],
    unit: ["teenagers", "青少年"],
    treat: ["slept at least 9 hours a night", "每晚至少睡 9 小时"],
    outcome: ["had faster reaction times", "反应更快"],
    cause: ["more sleep", "睡眠更多"],
    effect: ["faster reactions", "反应变快"],
  },
];

/** causationOptions are the answers to "can we conclude causation?". */
const causationOptions: readonly Text[] = [
  t("Yes, because the treatment was assigned at random in an experiment", "能，因为这是随机分配处理的实验"),
  t(
    "No, because in an observational study a lurking variable could explain the difference",
    "不能，因为在观察研究中，潜在变量可能解释了这种差异",
  ),
  t("Yes, because the two groups differed", "能，因为两组之间存在差异"),
  t("No, because a correlation can never show cause and effect", "不能，因为相关关系永远无法说明因果关系"),
];

export const correlationAndCausation: TopicDef = {
  id: "correlation-and-causation",
  title: t("Correlation vs. Causation", "相关与因果"),
  summary: t(
    "Recognize that correlation does not imply causation, find lurking variables, and tell when a study can show cause and effect.",
    "认识到相关不等于因果，找出潜在变量，并判断一项研究何时能说明因果关系。",
  ),
  prerequisites: ["linear-correlation"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSS.ID.C.9"],
  intro: t(
    `A correlation coefficient close to $1$ or $-1$ says that two variables move together very reliably. It is tempting to read that as "one makes the other happen", but a correlation only describes the data; it does not say **why** the variables move together.

Over a year in a seaside town, ice cream sales and the number of sunburns are strongly positively correlated. Ice cream does not burn anyone, and sunburns do not make people buy ice cream. Both rise on hot, sunny days, and fall on cold, cloudy ones: the weather drives both, and that alone makes them correlated.

In this lesson we look for such hidden third variables, and we see what kind of study can show that one thing really causes another.`,
    `相关系数接近 $1$ 或 $-1$ 说明两个变量非常稳定地一起变化。人们很容易把它理解为“一个导致了另一个”，但相关只是描述数据，并不说明两个变量**为什么**一起变化。

在一个海滨小镇的一年里，冰淇淋销量与晒伤人数呈很强的正相关。冰淇淋不会晒伤任何人，晒伤也不会让人去买冰淇淋。二者都在炎热晴朗的日子上升，在阴冷的日子下降：天气同时推动了二者，单凭这一点它们就会相关。

这节课我们寻找这种隐藏的第三个变量，并看看什么样的研究才能说明一件事确实导致了另一件事。`,
  ),
  knowledgePoints: [
    {
      id: "lurking-variables",
      title: t("Lurking variables", "潜在变量"),
      explanation: t(
        `A correlation between two variables does not mean that one **causes** the other. Often a third variable, a **lurking variable**, drives both of them: when it goes up, both go up, so they rise and fall together even though neither affects the other.

Over a year, ice cream sales and sunburns are positively correlated, but ice cream does not cause sunburns: hot, sunny weather increases both. So before concluding that $x$ causes $y$, ask whether either could plausibly affect the other, and look for a variable that could affect both.

> **Watch out.** A strong correlation, even $r = 0.95$, does not show that the first variable causes the second, nor that the second causes the first. Nor does a lurking variable make the two unrelated: they really are correlated, just not by cause and effect.`,
        `两个变量相关，并不意味着其中一个**导致**另一个。常常是第三个变量，即**潜在变量**，同时影响了二者：它上升时二者都上升，所以即使谁也不影响谁，它们也会一起升降。

一年中冰淇淋销量与晒伤人数正相关，但冰淇淋并不会导致晒伤：炎热晴朗的天气让二者都增加。所以在断定 $x$ 导致 $y$ 之前，要问一问其中一个是否真的可能影响另一个，并找找是否有能同时影响二者的变量。

> **注意。** 再强的相关，即使 $r = 0.95$，也不能说明第一个变量导致第二个，也不能说明第二个导致第一个。潜在变量也不会让二者变得毫无关系：它们确实相关，只是不是因果关系。`,
      ),
      generate(rng) {
        const s = rng.pick(lurkings);
        const r = dec(Q.of(rng.int(70, 95), 100));
        const swap = rng.bool();
        const [a, b] = swap ? [s.b, s.a] : [s.a, s.b];
        return shuffledChoice(rng, {
          prompt: t(
            `${s.setting[0]}, ${a[0]} and ${b[0]} are positively correlated, with $r = ${r}$. What is the most likely explanation?`,
            `${s.setting[1]}，${a[1]}与${b[1]}正相关，$r = ${r}$。最可能的解释是什么？`,
          ),
          correct: t(`A lurking variable, ${s.z[0]}, increases both`, `潜在变量“${s.z[1]}”使二者都增加`),
          wrong: [
            t(`An increase in ${a[0]} causes an increase in ${b[0]}`, `${a[1]}增加导致${b[1]}增加`),
            t(`An increase in ${b[0]} causes an increase in ${a[0]}`, `${b[1]}增加导致${a[1]}增加`),
            t("The correlation shows that the two variables are unrelated", "这个相关关系说明两个变量毫无关系"),
          ],
          solution: t(
            `**Step 1: Test the direct explanations.** Raising ${a[0]} would not plausibly raise ${b[0]}, and raising ${b[0]} would not plausibly raise ${a[0]}. So neither variable is a likely cause of the other.

**Step 2: Look for a third variable.** ${s.z[0][0]!.toUpperCase()}${s.z[0].slice(1)} pushes up both ${a[0]} and ${b[0]}. It is a lurking variable that increases both, and that is why they are correlated.

**Check.** If ${s.z[0]} were held fixed, comparing only cases alike in it, most of the correlation should disappear; a direct cause would not vanish that way.`,
            `**第一步：检验直接的解释。** 增加${a[1]}不太可能使${b[1]}增加，增加${b[1]}也不太可能使${a[1]}增加。所以两个变量都不太可能是对方的原因。

**第二步：寻找第三个变量。** “${s.z[1]}”同时推高了${a[1]}和${b[1]}。它是使二者都增加的潜在变量，正因为如此二者才相关。

**检验。** 如果只比较“${s.z[1]}”相同的情况，相关关系应当基本消失；如果是直接的因果关系，就不会这样。`,
          ),
        });
      },
    },
    {
      id: "experiments-and-observational-studies",
      title: t("Experiments and observational studies", "实验与观察研究"),
      explanation: t(
        `Whether a study can show cause and effect depends on **who decided** which group each subject was in.

In an **observational study**, researchers only record what people (or things) already do. People who chose the treatment may differ in other ways too, so a difference between the groups may come from a lurking variable: it cannot show cause and effect.

In a **randomized experiment**, researchers assign the treatment at random. Random assignment makes the groups alike in every other way, so a clear difference in the outcome can be attributed to the treatment: an experiment **can** show causation.

> **Watch out.** A difference between two groups is not enough on its own: it matters how the groups were formed. And "correlation never shows causation" goes too far: a randomized experiment is exactly the way to show it.`,
        `一项研究能否说明因果关系，取决于每个对象分在哪一组是**由谁决定的**。

在**观察研究**中，研究者只记录人（或事物）本来的情况。选择了某种处理的人可能在其他方面也不同，所以组间的差异可能来自潜在变量：不能说明因果关系。

在**随机化实验**中，研究者随机分配处理。随机分配使各组在其他方面都相似，因此结果中明显的差异可以归因于处理：实验**能够**说明因果关系。

> **注意。** 仅有两组之间的差异是不够的：关键在于两组是怎样形成的。说“相关永远不能说明因果”也太过了：随机化实验正是说明因果的方法。`,
      ),
      generate(rng) {
        const s = rng.pick(studies);
        const n = 10 * rng.int(4, 30);
        const experiment = rng.bool();
        const design = experiment
          ? t(
              `Researchers randomly assigned ${n} ${s.units[0]} to two equal groups. One group ${s.treat[0]}, the other did not. The first group ${s.outcome[0]}.`,
              `研究者把 ${n} ${s.units[1]}随机分成人数相等的两组。一组${s.treat[1]}，另一组没有。结果第一组${s.outcome[1]}。`,
            )
          : t(
              `Researchers looked at ${n} ${s.units[0]} and found that those who ${s.treat[0]} ${s.outcome[0]} than those who did not.`,
              `研究者考察了 ${n} ${s.units[1]}，发现其中${s.treat[1]}的${s.unit[1]}比没有这样做的${s.outcome[1]}。`,
            );
        return choiceProblem({
          prompt: t(
            `${design.en} Can the researchers conclude that ${s.cause[0]} causes ${s.effect[0]}?`,
            `${design["zh-CN"]}研究者能否断定${s.cause[1]}导致${s.effect[1]}？`,
          ),
          options: causationOptions,
          correct: experiment ? 0 : 1,
          solution: experiment
            ? t(
                `**Step 1: Who formed the groups?** The researchers assigned the ${s.unit[0]} to the groups at random, so this is a randomized experiment.

**Step 2: What follows.** Random assignment makes the two groups alike in everything except the treatment, so no lurking variable can explain the difference: it can be attributed to ${s.cause[0]}. The conclusion is justified.`,
                `**第一步：两组是怎样形成的？** 研究者把${s.unit[1]}随机分到两组，所以这是随机化实验。

**第二步：由此得出。** 随机分配使两组除处理外在各方面都相似，所以潜在变量无法解释这个差异：可以把它归因于${s.cause[1]}。这个结论是成立的。`,
              )
            : t(
                `**Step 1: Who formed the groups?** Nobody assigned the treatment: the researchers only observed which ${s.unit[0]} ${s.treat[0]}. This is an observational study.

**Step 2: What follows.** The ${s.unit[0]} that did so may differ from the others in other ways, and such a lurking variable could explain the difference. So causation cannot be concluded, although a randomized experiment could test it.`,
                `**第一步：两组是怎样形成的？** 没有人分配处理：研究者只是观察了哪些${s.unit[1]}${s.treat[1]}。这是观察研究。

**第二步：由此得出。** 这样做的${s.unit[1]}可能在其他方面也与别人不同，这样的潜在变量可能解释了差异。所以不能断定因果关系，不过随机化实验可以检验它。`,
              ),
        });
      },
    },
  ],
};

/** modelOptions are the types of regression models. */
const modelOptions: readonly Text[] = [t("Linear", "线性模型"), t("Exponential", "指数模型"), t("Quadratic", "二次模型")];

/** diffs are the differences of consecutive values. */
const diffs = (ys: readonly Q[]) => ys.slice(1).map((y, i) => y.sub(ys[i]!));

/** Situation is a description of a relationship and the model that fits it. */
interface Situation {
  readonly kind: 0 | 1 | 2;
  readonly text: (rng: Rng) => Text;
  readonly reason: Text;
}

const situations: readonly Situation[] = [
  {
    kind: 0,
    text: (rng) => {
      const [a, b] = [5 * rng.int(6, 16), 5 * rng.int(8, 20)];
      return t(
        `A plumber charges a call-out fee of $${a}$ dollars plus $${b}$ dollars for each hour of work. The total charge is modeled as a function of the hours worked.`,
        `一位水管工收取 $${a}$ 美元上门费，每工作一小时再收 $${b}$ 美元。总费用被建模为工作时长的函数。`,
      );
    },
    reason: t(
      "Each additional hour adds the same amount to the charge: a constant rate of change, so the model is linear.",
      "每多工作一小时，费用增加相同的数额：变化率不变，所以是线性模型。",
    ),
  },
  {
    kind: 0,
    text: (rng) => {
      const [a, b] = [100 * rng.int(5, 20), 5 * rng.int(4, 20)];
      return t(
        `A tank holds $${a}$ liters of water and is drained at a steady $${b}$ liters per minute. The amount of water left is modeled as a function of time.`,
        `一个水箱装有 $${a}$ 升水，以每分钟 $${b}$ 升的恒定速度放水。剩余水量被建模为时间的函数。`,
      );
    },
    reason: t(
      "The same amount of water leaves every minute: a constant rate of change, so the model is linear.",
      "每分钟流出的水量相同：变化率不变，所以是线性模型。",
    ),
  },
  {
    kind: 0,
    text: (rng) => {
      const [a, b] = [rng.int(2, 6), rng.int(2, 5)];
      return t(
        `A taxi ride costs $${a}$ dollars plus $${b}$ dollars for each kilometer. The fare is modeled as a function of the distance driven.`,
        `乘坐出租车起步价 $${a}$ 美元，每行驶一千米再加 $${b}$ 美元。车费被建模为行驶距离的函数。`,
      );
    },
    reason: t(
      "Each kilometer adds the same amount to the fare: a constant rate of change, so the model is linear.",
      "每多一千米，车费增加相同的数额：变化率不变，所以是线性模型。",
    ),
  },
  {
    kind: 1,
    text: (rng) => {
      const [a, h] = [100 * rng.int(1, 9), rng.int(2, 6)];
      return t(
        `A colony of $${a}$ bacteria doubles in size every $${h}$ hours. The number of bacteria is modeled as a function of time.`,
        `一个有 $${a}$ 个细菌的菌落每 $${h}$ 小时数量翻一番。细菌数量被建模为时间的函数。`,
      );
    },
    reason: t(
      "The number is multiplied by the same factor, $2$, in equal time intervals: an exponential model.",
      "在相等的时间间隔内，数量乘以相同的倍数 $2$：指数模型。",
    ),
  },
  {
    kind: 1,
    text: (rng) => {
      const [a, p] = [1000 * rng.int(15, 40), rng.int(8, 25)];
      return t(
        `A car bought for $${a}$ dollars loses $${p}\\%$ of its value every year. Its value is modeled as a function of its age.`,
        `一辆以 $${a}$ 美元购入的汽车每年贬值 $${p}\\%$。它的价值被建模为车龄的函数。`,
      );
    },
    reason: t(
      "Losing the same percent each year multiplies the value by the same factor every year: an exponential model.",
      "每年损失相同的百分比，相当于每年乘以相同的倍数：指数模型。",
    ),
  },
  {
    kind: 1,
    text: (rng) => {
      const [a, p] = [500 * rng.int(2, 20), rng.int(2, 9)];
      return t(
        `An investment of $${a}$ dollars earns $${p}\\%$ interest, compounded every year. The balance is modeled as a function of the number of years.`,
        `一笔 $${a}$ 美元的投资年利率为 $${p}\\%$，按年复利计算。余额被建模为年数的函数。`,
      );
    },
    reason: t(
      "Compound interest multiplies the balance by the same factor every year: an exponential model.",
      "复利使余额每年乘以相同的倍数：指数模型。",
    ),
  },
  {
    kind: 1,
    text: (rng) => {
      const [a, h] = [50 * rng.int(2, 10), rng.int(3, 8)];
      return t(
        `After a dose of $${a}$ mg of a medicine, the amount left in the body halves every $${h}$ hours. The amount is modeled as a function of time.`,
        `服用 $${a}$ 毫克某种药物后，体内剩余的药量每 $${h}$ 小时减半。药量被建模为时间的函数。`,
      );
    },
    reason: t(
      "Halving multiplies the amount by the same factor, $\\frac{1}{2}$, in equal time intervals: an exponential model.",
      "减半就是在相等的时间间隔内乘以相同的倍数 $\\frac{1}{2}$：指数模型。",
    ),
  },
  {
    kind: 2,
    text: (rng) => {
      const [a, v] = [rng.int(1, 3), 5 * rng.int(2, 6)];
      return t(
        `A ball is thrown straight up at $${v}$ meters per second from a height of $${a}$ meters. Its height is modeled as a function of time until it lands.`,
        `一个球从 $${a}$ 米高处以每秒 $${v}$ 米的速度竖直上抛。它的高度被建模为时间的函数，直到落地。`,
      );
    },
    reason: t(
      "The height rises to a maximum and then falls, and gravity makes it change by a constant second difference: a quadratic model, whose graph is a parabola.",
      "高度先升到最大再下降，重力使它的二阶差恒定：二次模型，图像是抛物线。",
    ),
  },
  {
    kind: 2,
    text: (rng) => {
      const n = rng.int(10, 40);
      return t(
        `The area of a square tile is modeled as a function of its side length, for side lengths from $1$ to $${n}$ cm.`,
        `正方形瓷砖的面积被建模为边长的函数，边长从 $1$ 到 $${n}$ 厘米。`,
      );
    },
    reason: t("The area is the square of the side length, $A = s^2$: a quadratic model.", "面积是边长的平方，$A = s^2$：二次模型。"),
  },
  {
    kind: 2,
    text: (rng) => {
      const p = 20 * rng.int(3, 15);
      return t(
        `A farmer has $${p}$ meters of fence for a rectangular pen. The area of the pen is modeled as a function of its width.`,
        `一位农民有 $${p}$ 米长的围栏，用来围一个长方形围栏区。围栏区的面积被建模为宽的函数。`,
      );
    },
    reason: t(
      "With the perimeter fixed, the length is a constant minus the width, so the area, width times length, has a squared term: a quadratic model that rises and then falls.",
      "周长固定时，长等于一个常数减去宽，所以面积（宽乘长）含有平方项：先增后减的二次模型。",
    ),
  },
];

/** shapePoints draws data of a linear, exponential or quadratic shape in the view, as floats. */
function shapePoints(rng: Rng, kind: 0 | 1 | 2): Pt[] {
  for (;;) {
    const xs = rng.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], rng.int(9, 11)).sort((a, b) => a - b);
    const noise = () => rng.int(-2, 2) / 10;
    let f: (x: number) => number;
    if (kind === 0) {
      const m = (rng.sign() * rng.int(4, 9)) / 10;
      const c = rng.int(4, 6);
      f = (x) => c + m * (x - 5);
    } else if (kind === 1) {
      const g = rng.pick([1.3, 1.35, 1.4, 1.5]);
      const top = rng.int(85, 97) / 10;
      const grow = rng.bool();
      f = (x) => top * g ** ((grow ? x : 10 - x) - 10) + 0.3;
    } else {
      const h = rng.int(3, 7);
      const up = rng.bool();
      const c = up ? rng.int(5, 20) / 10 : rng.int(80, 95) / 10;
      const k = (up ? 9.5 - c : c - 0.5) / Math.max(h * h, (10 - h) * (10 - h));
      f = (x) => c + (up ? k : -k) * (x - h) ** 2;
    }
    const pts = xs.map((x): Pt => [x, Math.round((f(x) + noise()) * 10) / 10]);
    if (pts.every(([, y]) => y >= 0.2 && y <= 9.8)) return pts;
  }
}

/** ruledOut rules out the two models that do not fit, for each kind of model. */
const ruledOut: readonly Text[] = [
  t(
    "**Step 2: Rule out the others.** Nothing is multiplied by a fixed factor and nothing is squared, so neither an exponential nor a quadratic model fits: the model is linear.",
    "**第二步：排除其他模型。** 没有乘以固定的倍数，也没有平方，所以指数模型和二次模型都不合适：这是线性模型。",
  ),
  t(
    "**Step 2: Rule out the others.** The amount added in each step is not fixed: it grows or shrinks with the quantity itself, so the model is not linear, and nothing is squared, so it is not quadratic: the model is exponential.",
    "**第二步：排除其他模型。** 每一步增加的数量不固定：它随这个量本身变大或变小，所以不是线性模型；也没有平方，所以不是二次模型：这是指数模型。",
  ),
  t(
    "**Step 2: Rule out the others.** The change is neither the same amount nor the same factor in each step, so the model is neither linear nor exponential: it is quadratic.",
    "**第二步：排除其他模型。** 每一步的变化既不是相同的数量，也不是相同的倍数，所以既不是线性模型也不是指数模型：这是二次模型。",
  ),
];

/** power4 writes a number raised to the 4th power in LaTeX, in parentheses when needed. */
const power4 = (q: Q) => (q.isInteger() && q.sign() > 0 ? `${num(q)}^4` : `\\left(${num(q)}\\right)^4`);

export const selectingARegressionModel: TopicDef = {
  id: "selecting-a-regression-model",
  title: t("Selecting a Regression Model", "选择回归模型"),
  summary: t(
    "Choose a linear, exponential or quadratic model for data from a table, a scatter plot or a description.",
    "根据表格、散点图或文字描述，为数据选择线性、指数或二次模型。",
  ),
  prerequisites: ["trend-lines", "geometric-sequences", "linear-vs-exponential-growth-and-decay", "graphs-of-general-quadratic-functions"],
  encompasses: [{ topic: "linear-vs-exponential-growth-and-decay", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSS.ID.B.6.A", "CCSS.HSF.LE.A.1"],
  intro: t(
    `A trend line models data that change at a steady rate. But not all data do: some grow by the same **factor** in each step, like a geometric sequence, and some rise and then fall along a parabola. Before fitting a model to data, we must choose its type, and a straight line through curved data predicts badly.

Each type leaves its own fingerprint in data whose $x$-values go up by $1$:

- $y = 3x + 1$ gives $1, 4, 7, 10, 13$: the same **difference**, $3$, each time, so it is linear;
- $y = 2^x$ gives $1, 2, 4, 8, 16$: the same **ratio**, $2$, each time, so it is exponential;
- $y = x^2$ gives $0, 1, 4, 9, 16$: the differences $1, 3, 5, 7$ change, but by the same amount, $2$, each time, so it is quadratic.

In this lesson we choose among the three types from a table, from the shape of a scatter plot and from a description of a situation.`,
    `趋势线适合以稳定速率变化的数据。但并非所有数据都是这样：有的每一步乘以相同的**倍数**，像等比数列；有的沿抛物线先升后降。在为数据拟合模型之前，必须先选定模型的类型，用直线去拟合弯曲的数据，预测就会很差。

当 $x$ 值每次增加 $1$ 时，每种类型在数据中都留下自己的特征：

- $y = 3x + 1$ 给出 $1, 4, 7, 10, 13$：每次的**差**都是 $3$，所以是线性的；
- $y = 2^x$ 给出 $1, 2, 4, 8, 16$：每次的**比**都是 $2$，所以是指数的；
- $y = x^2$ 给出 $0, 1, 4, 9, 16$：差 $1, 3, 5, 7$ 在变，但每次都变 $2$，所以是二次的。

这节课我们根据表格、散点图的形状以及情境描述，在这三种类型中做出选择。`,
  ),
  knowledgePoints: [
    {
      id: "model-from-a-table",
      title: t("Choosing a model from a table", "由表格选择模型"),
      explanation: t(
        `When the $x$-values of a table go up in equal steps, the $y$-values show which model fits, because each model changes in its own way over equal steps:

- **linear**: adding the same amount each step, so the differences of consecutive $y$-values are constant;
- **exponential**: multiplying by the same factor each step, so the ratios of consecutive $y$-values are constant;
- **quadratic**: the differences are not constant, but the differences of the differences (**second differences**) are.

$y$: $3, 7, 13, 21, 31$ has differences $4, 6, 8, 10$ and second differences $2, 2, 2$, so it is quadratic. $5, 10, 20, 40$ has ratios $2, 2, 2$: exponential.

> **Watch out.** Changing differences do not decide the type by themselves: check the ratios for an exponential model and the second differences for a quadratic one. Data that shrink by a constant ratio, such as $\\frac{1}{2}$, are exponential too.`,
        `当表格中的 $x$ 值等距增加时，$y$ 值能说明哪种模型合适，因为每种模型在等距的步长上有自己的变化方式：

- **线性**：每一步加上相同的数量，所以相邻 $y$ 值的差恒定；
- **指数**：每一步乘以相同的倍数，所以相邻 $y$ 值的比恒定；
- **二次**：差不恒定，但差的差（**二阶差**）恒定。

$y$：$3, 7, 13, 21, 31$ 的差是 $4, 6, 8, 10$，二阶差是 $2, 2, 2$，所以是二次的。$5, 10, 20, 40$ 的比是 $2, 2, 2$：指数的。

> **注意。** 差不恒定本身还不能决定类型：要检查比是否恒定（指数）以及二阶差是否恒定（二次）。以恒定的比（比如 $\\frac{1}{2}$）减小的数据也是指数的。`,
      ),
      keyPrerequisites: ["geometric-sequences"],
      generate(rng) {
        for (;;) {
          const kind = rng.int(0, 2) as 0 | 1 | 2;
          const x0 = rng.int(0, 1);
          const xs = [0, 1, 2, 3, 4].map((i) => x0 + i);
          let ys: Q[];
          if (kind === 0) {
            const [a, d] = [rng.int(-10, 20), rng.nonZero(-7, 7)];
            ys = xs.map((x) => Q.of(a + d * x));
          } else if (kind === 1) {
            // a·p^i·q^(4−i) has the constant ratio p/q and stays an integer.
            const [p, q] = rng.pick([
              [2, 1],
              [3, 1],
              [3, 2],
              [1, 2],
              [1, 3],
              [2, 3],
            ] as const);
            const a = rng.int(1, 4);
            ys = [0, 1, 2, 3, 4].map((i) => Q.of(a * p ** i * q ** (4 - i)));
          } else {
            const [p, q, c] = [rng.nonZero(-3, 3), rng.int(-6, 6), rng.int(-10, 10)];
            ys = xs.map((x) => Q.of(p * x * x + q * x + c));
          }
          if (!ys.every((y) => y.isInteger()) || ys.some((y) => y.abs().cmp(Q.of(300)) > 0)) continue;
          const d1 = diffs(ys);
          const d2 = diffs(d1);
          const list = (vs: readonly Q[]) => vs.map((v) => num(v)).join(", ");
          const table = `| $x$ | ${xs.map((x) => `$${x}$`).join(" | ")} |\n| :-: | ${xs.map(() => ":-:").join(" | ")} |\n| $y$ | ${ys.map((y) => `$${num(y)}$`).join(" | ")} |`;
          const ratios = ys.every((y) => !y.isZero()) ? ys.slice(1).map((y, i) => y.div(ys[i]!)) : undefined;
          const [first, last] = [ys[0]!, ys[4]!];
          const first1 = d1[0]!;
          const diffsStep = t(
            `**Step 1: The differences.** Subtract each $y$-value from the next: $${list(d1)}$.`,
            `**第一步：差。** 每个 $y$ 值减去前一个：$${list(d1)}$。`,
          );
          const rest =
            kind === 0
              ? t(
                  `**Step 2: Decide.** The differences are all equal, so the same amount, $${num(first1)}$, is added in each step: the model is linear.

**Check.** Starting from $${num(first)}$ and adding $${num(first1)}$ four times gives $${num(first)} + 4 \\cdot ${paren(first1)} = ${num(last)}$, the last value of the table.`,
                  `**第二步：判断。** 差全部相等，每一步都加上相同的数量 $${num(first1)}$：线性模型。

**检验。** 从 $${num(first)}$ 开始加四次 $${num(first1)}$，得 $${num(first)} + 4 \\cdot ${paren(first1)} = ${num(last)}$，正是表中最后一个值。`,
                )
              : kind === 1
                ? t(
                    `**Step 2: The ratios.** The differences are not constant, so divide each $y$-value by the one before: the ratios are $${list(ratios ?? [])}$, all equal. Multiplying by the same factor in each step means the model is exponential.

**Check.** Starting from $${num(first)}$ and multiplying by $${num(ratios![0]!)}$ four times gives $${num(first)} \\cdot ${power4(ratios![0]!)} = ${num(last)}$, the last value of the table.`,
                    `**第二步：比。** 差不恒定，于是用每个 $y$ 值除以前一个：比是 $${list(ratios ?? [])}$，全部相等。每一步乘以相同的倍数，所以是指数模型。

**检验。** 从 $${num(first)}$ 开始乘四次 $${num(ratios![0]!)}$，得 $${num(first)} \\cdot ${power4(ratios![0]!)} = ${num(last)}$，正是表中最后一个值。`,
                  )
                : t(
                    `**Step 2: The second differences.** The differences are not constant, so take the differences of the differences: $${list(d2)}$, all equal. Constant second differences mean the model is quadratic.

**Check.** The differences should change by $${num(d2[0]!)}$ each time: $${num(first1)} + 3 \\cdot ${paren(d2[0]!)} = ${num(d1[3]!)}$, the last difference.`,
                    `**第二步：二阶差。** 差不恒定，于是求差的差：$${list(d2)}$，全部相等。二阶差恒定，所以是二次模型。

**检验。** 差每次应变化 $${num(d2[0]!)}$：$${num(first1)} + 3 \\cdot ${paren(d2[0]!)} = ${num(d1[3]!)}$，正是最后一个差。`,
                  );
          return choiceProblem({
            prompt: t(`Which type of model fits the data in the table exactly?\n\n${table}`, `哪种模型能精确拟合表中的数据？\n\n${table}`),
            options: modelOptions,
            correct: kind,
            solution: t(`${diffsStep.en}\n\n${rest.en}`, `${diffsStep["zh-CN"]}\n\n${rest["zh-CN"]}`),
          });
        }
      },
    },
    {
      id: "model-from-a-scatter-plot",
      figure: algebraDrawings["selecting-a-regression-model#model-from-a-scatter-plot"],
      title: t("Choosing a model from a scatter plot", "由散点图选择模型"),
      explanation: t(
        `The shape of a scatter plot suggests the model, because each type of function has a graph of its own shape:

- **linear**: the points lie along a straight line, rising or falling at a steady rate;
- **exponential**: the points curve, changing slowly at first and then faster and faster (growth), or quickly at first and then leveling off toward the $x$-axis (decay), without ever turning around;
- **quadratic**: the points form a U shape or an upside-down U: they fall and then rise, or rise and then fall.

So ask two questions: is the pattern straight or curved, and if curved, does it turn around?

> **Watch out.** A curve that keeps rising faster, or keeps falling while it levels off, is exponential, not quadratic: a parabola always turns around. And points that bend are not linear just because they keep rising.`,
        `散点图的形状提示了应选的模型，因为每种函数的图像都有自己的形状：

- **线性**：点沿一条直线分布，以稳定的速度上升或下降；
- **指数**：点呈曲线，开始变化缓慢、然后越来越快（增长），或开始变化很快、然后趋于平缓接近 $x$ 轴（衰减），但不会掉头；
- **二次**：点呈 U 形或倒 U 形：先降后升，或先升后降。

所以问两个问题：规律是直的还是弯的？如果是弯的，它会不会掉头？

> **注意。** 一直越升越快，或者一直下降并趋于平缓的曲线是指数的，不是二次的：抛物线总会掉头。弯曲的点也不会因为一直上升就成为线性的。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2) as 0 | 1 | 2;
        const pts = shapePoints(rng, kind);
        const rising = pts[pts.length - 1]![1] > pts[0]![1];
        return {
          ...choiceProblem({
            prompt: t("Which type of model best fits the data in the scatter plot?", "哪种模型最适合散点图中的数据？"),
            options: modelOptions,
            correct: kind,
            solution: [
              t(
                "**Step 1: Straight or curved?** The points lie close to a straight line, rising or falling by about the same amount for each step to the right.\n\n**Step 2: Decide.** A steady rate of change means a linear model fits best.",
                "**第一步：直的还是弯的？** 点紧靠一条直线，每向右一步，上升或下降的量大致相同。\n\n**第二步：判断。** 变化率稳定，所以线性模型最合适。",
              ),
              rising
                ? t(
                    "**Step 1: Straight or curved?** The points curve: they rise slowly at first and then faster and faster.\n\n**Step 2: Does it turn around?** No, the points keep rising, ever more steeply. A curve that does not turn around is exponential, so an exponential model fits best.",
                    "**第一步：直的还是弯的？** 点呈曲线：开始上升缓慢，然后越来越快。\n\n**第二步：会不会掉头？** 不会，点一直上升，而且越来越陡。不掉头的曲线是指数的，所以指数模型最合适。",
                  )
                : t(
                    "**Step 1: Straight or curved?** The points curve: they fall quickly at first and then level off.\n\n**Step 2: Does it turn around?** No, the points keep falling, ever more slowly, toward the $x$-axis. A curve that does not turn around is exponential, so an exponential model fits best.",
                    "**第一步：直的还是弯的？** 点呈曲线：开始下降很快，然后趋于平缓。\n\n**第二步：会不会掉头？** 不会，点一直下降，越来越慢，接近 $x$ 轴。不掉头的曲线是指数的，所以指数模型最合适。",
                  ),
              t(
                "**Step 1: Straight or curved?** The points curve.\n\n**Step 2: Does it turn around?** Yes: they fall and then rise, or rise and then fall, in a U shape. A curve that turns around is a parabola, so a quadratic model fits best.",
                "**第一步：直的还是弯的？** 点呈曲线。\n\n**第二步：会不会掉头？** 会：点先降后升或先升后降，呈 U 形。会掉头的曲线是抛物线，所以二次模型最合适。",
              ),
            ][kind]!,
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "model-from-a-description",
      title: t("Choosing a model from a situation", "由情境选择模型"),
      explanation: t(
        `A description of how a quantity changes points to a model, because the three types differ in what happens in each step:

- adding or subtracting the **same amount** in each step (a fixed fee plus a rate, a steady flow) is **linear**;
- multiplying by the **same factor** in each step (doubling, halving, a fixed percent of growth or decay) is **exponential**;
- a quantity that depends on the **square** of another (an area from a length, the height of a thrown object) is **quadratic**.

A taxi fare of $3$ dollars plus $2$ dollars per kilometer adds $2$ for each kilometer: linear. A population that doubles every year: exponential.

> **Watch out.** A fixed **percent** each year is a fixed factor, so it is exponential, not linear, even though the percent itself does not change. And a starting fee does not make a model exponential: what matters is how each step changes the quantity.`,
        `描述一个量如何变化，就能判断模型，因为三种类型在每一步发生的事情不同：

- 每一步加上或减去**相同的数量**（固定费用加单价、匀速流动）是**线性**的；
- 每一步乘以**相同的倍数**（翻倍、减半、固定百分比的增长或衰减）是**指数**的；
- 一个量依赖于另一个量的**平方**（由长度求面积、抛出物体的高度）是**二次**的。

出租车起步价 $3$ 美元，每千米 $2$ 美元，每多一千米加 $2$：线性。人口每年翻一番：指数。

> **注意。** 每年固定的**百分比**是固定的倍数，所以是指数的而不是线性的，尽管百分比本身不变。起步费也不会使模型变成指数的：关键看每一步怎样改变这个量。`,
      ),
      generate(rng) {
        const s = rng.pick(situations);
        const text = s.text(rng);
        const rule = ruledOut[s.kind]!;
        return choiceProblem({
          prompt: t(`${text.en} Which type of model fits this situation?`, `${text["zh-CN"]}哪种模型适合这个情境？`),
          options: modelOptions,
          correct: s.kind,
          solution: t(
            `**Step 1: Look at each step.** ${s.reason.en}\n\n${rule.en}`,
            `**第一步：看每一步的变化。** ${s.reason["zh-CN"]}\n\n${rule["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** bivariateStatisticsTopics are the topics of bivariate statistics, in teaching order. */
export const bivariateStatisticsTopics: readonly TopicDef[] = [
  scatterPlots,
  trendLines,
  predictionsWithTrendLines,
  interpretingTrendLineCoefficients,
  linearCorrelation,
  correlationAndCausation,
  selectingARegressionModel,
];
