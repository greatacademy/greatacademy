import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, linear, num, type PlaneMark, type PlaneView, paren, plane, poly, Q, relSymbol } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";
import { guides, plain, riseRun } from "../graph-figures.ts";
import {
  choiceProblem,
  equationProblem,
  expressionProblem,
  type InequalityOp,
  numberProblem,
  pointLatex,
  pointProblem,
  reasonChoice,
  steps,
  yesNo,
} from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

function gcd(a: number, b: number): number {
  let [m, n] = [Math.abs(a), Math.abs(b)];
  while (n !== 0) [m, n] = [n, m % n];
  return m;
}

/** Range is [min, max, step]: the multiples of step from min to max. */
type Range = readonly [number, number, number];

/** pickStep picks a value of a range. */
const pickStep = (rng: Rng, [min, max, step]: Range) => min + step * rng.int(0, Math.floor((max - min) / step));

/** dollars writes an amount of dollars in English prompts. */
const dollars = (n: Coefficient) => `$\\$${num(n)}$`;

// ─── Graphs of real situations ────────────────────────────────────────────────

/** Scale maps a graph of a situation onto a grid of nx by ny cells, each x units wide and y units tall, with named axes. */
interface Scale {
  readonly x: number;
  readonly y: number;
  readonly nx: number;
  readonly ny: number;
  readonly xName: string;
  readonly yName: string;
}

/**
 * scaledGraph draws marks given in grid cells on a grid whose axes are
 * numbered in the units of the situation and named after its variables.
 * plane uses one unit length on both axes, so the numbers are drawn as labels.
 */
function scaledGraph(sc: Scale, marks: readonly PlaneMark[], en: string, zh: string): Figure {
  const every = (n: number, unit: number) => (String(n * unit).length >= 3 ? 2 : 1);
  const [ex, ey] = [every(sc.nx, sc.x), every(sc.ny, sc.y)];
  const labels: PlaneMark[] = [{ kind: "label", at: [0, 0], text: "0", dir: "sw" }];
  for (let i = ex; i < sc.nx; i += ex) labels.push({ kind: "label", at: [i, 0], text: String(i * sc.x), dir: "s" });
  for (let j = ey; j <= sc.ny; j += ey) labels.push({ kind: "label", at: [0, j], text: String(j * sc.y), dir: "w" });
  const svg = plane({ xMin: -0.8, xMax: sc.nx, yMin: 0, yMax: sc.ny, labelEvery: 1000 }, [...marks, ...labels])
    .replace('font-style="italic">x</text>', `font-style="italic">${sc.xName}</text>`)
    .replace('font-style="italic">y</text>', `font-style="italic">${sc.yName}</text>`);
  return { svg, alt: t(en, zh) };
}

/** polylineMarks draws consecutive points, in grid cells, joined by segments. */
function polylineMarks(pts: readonly (readonly [number, number])[]): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (let i = 0; i + 1 < pts.length; i++) marks.push({ kind: "segment", a: pts[i]!, b: pts[i + 1]!, accent: true });
  for (const p of pts) marks.push({ kind: "point", at: p });
  return marks;
}

/** legFigure draws a graph of consecutive segments again with one of its legs in the result color and more marks. */
function legFigure(
  sc: Scale,
  pts: readonly (readonly [number, number])[],
  leg: Leg | undefined,
  more: readonly PlaneMark[],
  en: string,
  zh: string,
): Figure {
  return scaledGraph(
    sc,
    [...polylineMarks(pts), ...(leg ? [{ kind: "segment", a: leg.from, b: leg.to, tone: "result" } as const] : []), ...more],
    en,
    zh,
  );
}

/** areaUnder shades the part of a graph's area that a leg covers, down to the horizontal axis. */
const areaUnder = (l: Leg): PlaneMark => ({ kind: "polygon", points: [l.from, l.to, [l.to[0], 0], [l.from[0], 0]], tone: "result" });

/** niceUnit is the smallest of 1, 2, 5, 10, 20, 50, … that is at least x, for one grid cell of a graph. */
function niceUnit(x: number): number {
  for (let p = 1; ; p *= 10) for (const n of [1, 2, 5]) if (n * p >= x) return n * p;
}

/** plansFigure draws the lines of two plans to a scale that shows where they cross, with more marks from at(x, y), which places a point of the plan in grid cells. */
function plansFigure(
  r1: number,
  f1: number,
  r2: number,
  f2: number,
  reach: number,
  more: (at: (x: number, y: number) => readonly [number, number]) => readonly PlaneMark[],
  en: string,
  zh: string,
): Figure {
  const sx = niceUnit(reach / 9);
  const sy = niceUnit(Math.max(f1 + r1 * 10 * sx, f2 + r2 * 10 * sx) / 7.5);
  const sc: Scale = { x: sx, y: sy, nx: 10, ny: 8, xName: "x", yName: "y" };
  const lines: PlaneMark[] = [
    { kind: "curve", f: (x) => (f1 + r1 * x * sx) / sy, from: 0, to: 10, accent: true },
    { kind: "curve", f: (x) => (f2 + r2 * x * sx) / sy },
  ];
  return scaledGraph(sc, [...lines, ...more((x, y) => [x / sx, y / sy])], en, zh);
}

// ─── Linear models ────────────────────────────────────────────────────────────

/** ModelContext is a situation in which a quantity y starts at an amount and changes at a constant rate with x. */
interface ModelContext {
  readonly x: string;
  readonly y: string;
  readonly start: Range;
  readonly rate: Range;
  readonly grows: boolean;
  /** maxX is the largest input that makes sense for a start and a rate. */
  readonly maxX: (f: number, r: number) => number;
  /** gx and gy are the possible units per grid cell of a graph. */
  readonly gx: readonly number[];
  readonly gy: readonly number[];
  readonly describe: (f: number, r: number) => Text;
  readonly vars: Text;
  readonly startMeaning: Text;
  readonly rateMeaning: Text;
  readonly yMeaning: Text;
  readonly xMeaning: Text;
  readonly askY: (x: number) => Text;
  readonly askX: (y: number) => Text;
  /** point says that input x gives output y, in the middle of a sentence. */
  readonly point: (x: number, y: number) => Text;
  readonly graphOf: Text;
  readonly rateUnit: Text;
}

const modelContexts: readonly ModelContext[] = [
  {
    x: "h",
    y: "C",
    start: [40, 90, 5],
    rate: [30, 75, 5],
    grows: true,
    maxX: () => 8,
    gx: [1],
    gy: [20, 50],
    describe: (f, r) =>
      t(
        `A plumber charges a call-out fee of ${dollars(f)} plus ${dollars(r)} for each hour of work.`,
        `水管工上门收费 $${f}$ 元，每工作一小时另收 $${r}$ 元。`,
      ),
    vars: t("Let $C$ be the charge in dollars for a job of $h$ hours.", "设工作 $h$ 小时的费用为 $C$ 元。"),
    startMeaning: t("The call-out fee", "上门费"),
    rateMeaning: t("The charge for each hour of work", "每小时的工钱"),
    yMeaning: t("The total charge for a job", "一次工作的总费用"),
    xMeaning: t("The number of hours worked", "工作的小时数"),
    askY: (x) => t(`How much does a job of $${x}$ hours cost, in dollars?`, `工作 $${x}$ 小时的费用是多少元？`),
    askX: (y) => t(`A job costs ${dollars(y)}. How many hours did it take?`, `一次工作的费用是 $${y}$ 元。工作了多少小时？`),
    point: (x, y) => t(`a job of $${x}$ hours costs ${dollars(y)}`, `工作 $${x}$ 小时收费 $${y}$ 元`),
    graphOf: t("The graph shows the charge $C$, in dollars, for a job of $h$ hours.", "图像表示工作 $h$ 小时的费用 $C$（元）。"),
    rateUnit: t("dollars per hour", "元/时"),
  },
  {
    x: "g",
    y: "C",
    start: [10, 30, 5],
    rate: [2, 8, 1],
    grows: true,
    maxX: () => 15,
    gx: [1, 2],
    gy: [5, 10],
    describe: (f, r) =>
      t(
        `A phone plan costs ${dollars(f)} per month plus ${dollars(r)} for each gigabyte of data used.`,
        `某手机套餐每月基本费 $${f}$ 元，每使用 $1$ GB 流量另收 $${r}$ 元。`,
      ),
    vars: t("Let $C$ be the monthly bill in dollars when $g$ gigabytes are used.", "设使用 $g$ GB 流量时的月费为 $C$ 元。"),
    startMeaning: t("The basic monthly fee", "每月的基本费"),
    rateMeaning: t("The charge for each gigabyte", "每 GB 流量的费用"),
    yMeaning: t("The monthly bill", "每月的话费"),
    xMeaning: t("The number of gigabytes used", "使用的流量 GB 数"),
    askY: (x) => t(`What is the bill for a month with $${x}$ GB of data, in dollars?`, `某月使用 $${x}$ GB 流量，话费是多少元？`),
    askX: (y) => t(`One month's bill is ${dollars(y)}. How many gigabytes were used?`, `某月话费是 $${y}$ 元。使用了多少 GB 流量？`),
    point: (x, y) => t(`a month with $${x}$ GB costs ${dollars(y)}`, `使用 $${x}$ GB 的月份话费 $${y}$ 元`),
    graphOf: t(
      "The graph shows the monthly bill $C$, in dollars, for $g$ gigabytes of data.",
      "图像表示使用 $g$ GB 流量时的月费 $C$（元）。",
    ),
    rateUnit: t("dollars per gigabyte", "元/GB"),
  },
  {
    x: "t",
    y: "V",
    start: [200, 600, 50],
    rate: [5, 25, 5],
    grows: false,
    maxX: (f, r) => Math.floor(f / r),
    gx: [2, 5, 10],
    gy: [50, 100],
    describe: (f, r) =>
      t(
        `A tank holds $${f}$ liters of water and drains at $${r}$ liters per minute.`,
        `水箱里有 $${f}$ 升水，以每分钟 $${r}$ 升的速度放水。`,
      ),
    vars: t("Let $V$ be the volume of water in liters after $t$ minutes.", "设 $t$ 分钟后水箱里有 $V$ 升水。"),
    startMeaning: t("The amount of water at the start", "开始时的水量"),
    rateMeaning: t("The amount of water drained each minute", "每分钟放出的水量"),
    yMeaning: t("The amount of water left", "剩下的水量"),
    xMeaning: t("The number of minutes since draining began", "放水经过的分钟数"),
    askY: (x) => t(`How many liters are left after $${x}$ minutes?`, `$${x}$ 分钟后还剩多少升水？`),
    askX: (y) => t(`After how many minutes are $${y}$ liters left?`, `多少分钟后还剩 $${y}$ 升水？`),
    point: (x, y) => t(`after $${x}$ minutes, $${y}$ liters are left`, `$${x}$ 分钟后还剩 $${y}$ 升`),
    graphOf: t(
      "The graph shows the volume $V$ of water in a tank, in liters, $t$ minutes after it starts draining.",
      "图像表示水箱开始放水 $t$ 分钟后的水量 $V$（升）。",
    ),
    rateUnit: t("liters per minute", "升/分"),
  },
  {
    x: "t",
    y: "h",
    start: [20, 36, 2],
    rate: [1, 4, 1],
    grows: false,
    maxX: (f, r) => Math.floor(f / r),
    gx: [1, 2],
    gy: [2, 4],
    describe: (f, r) =>
      t(`A candle is $${f}$ cm tall and burns down $${r}$ cm per hour.`, `一支蜡烛高 $${f}$ 厘米，每小时燃烧 $${r}$ 厘米。`),
    vars: t("Let $h$ be the height of the candle in centimeters after $t$ hours.", "设燃烧 $t$ 小时后蜡烛高 $h$ 厘米。"),
    startMeaning: t("The height of the candle before it is lit", "点燃前蜡烛的高度"),
    rateMeaning: t("The height that burns away each hour", "每小时燃烧的高度"),
    yMeaning: t("The height of the candle", "蜡烛的高度"),
    xMeaning: t("The number of hours it has burned", "燃烧的小时数"),
    askY: (x) => t(`How tall is the candle after $${x}$ hours, in centimeters?`, `燃烧 $${x}$ 小时后蜡烛高多少厘米？`),
    askX: (y) => t(`After how many hours is the candle $${y}$ cm tall?`, `燃烧多少小时后蜡烛高 $${y}$ 厘米？`),
    point: (x, y) => t(`after $${x}$ hours, the candle is $${y}$ cm tall`, `燃烧 $${x}$ 小时后蜡烛高 $${y}$ 厘米`),
    graphOf: t(
      "The graph shows the height $h$ of a candle, in centimeters, $t$ hours after it is lit.",
      "图像表示蜡烛点燃 $t$ 小时后的高度 $h$（厘米）。",
    ),
    rateUnit: t("centimeters per hour", "厘米/时"),
  },
  {
    x: "w",
    y: "S",
    start: [50, 300, 10],
    rate: [10, 40, 5],
    grows: true,
    maxX: () => 20,
    gx: [1, 2],
    gy: [20, 50],
    describe: (f, r) => t(`Sam has ${dollars(f)} saved and adds ${dollars(r)} every week.`, `小山已存了 $${f}$ 元，每周再存 $${r}$ 元。`),
    vars: t("Let $S$ be Sam's savings in dollars after $w$ weeks.", "设 $w$ 周后小山的存款为 $S$ 元。"),
    startMeaning: t("The amount saved at the start", "开始时的存款"),
    rateMeaning: t("The amount added each week", "每周存入的钱数"),
    yMeaning: t("Sam's total savings", "小山的存款总额"),
    xMeaning: t("The number of weeks", "经过的周数"),
    askY: (x) => t(`How much has Sam saved after $${x}$ weeks, in dollars?`, `$${x}$ 周后小山存了多少元？`),
    askX: (y) => t(`After how many weeks will Sam have ${dollars(y)}?`, `多少周后小山的存款达到 $${y}$ 元？`),
    point: (x, y) => t(`after $${x}$ weeks Sam has ${dollars(y)}`, `$${x}$ 周后小山有 $${y}$ 元`),
    graphOf: t("The graph shows Sam's savings $S$, in dollars, after $w$ weeks.", "图像表示 $w$ 周后小山的存款 $S$（元）。"),
    rateUnit: t("dollars per week", "元/周"),
  },
  {
    x: "t",
    y: "B",
    start: [70, 100, 5],
    rate: [5, 15, 5],
    grows: false,
    maxX: (f, r) => Math.floor(f / r),
    gx: [1],
    gy: [10],
    describe: (f, r) =>
      t(
        `A phone battery is at $${f}\\%$ and loses $${r}\\%$ of its charge each hour.`,
        `手机电量为 $${f}\\%$，每小时消耗 $${r}\\%$ 的电量。`,
      ),
    vars: t("Let $B$ be the charge, in percent, after $t$ hours.", "设 $t$ 小时后电量为 $B\\%$。"),
    startMeaning: t("The charge at the start", "开始时的电量"),
    rateMeaning: t("The charge used each hour", "每小时消耗的电量"),
    yMeaning: t("The charge left", "剩余的电量"),
    xMeaning: t("The number of hours of use", "使用的小时数"),
    askY: (x) => t(`What is the charge after $${x}$ hours, in percent?`, `$${x}$ 小时后电量是百分之多少？`),
    askX: (y) => t(`After how many hours is the charge at $${y}\\%$?`, `多少小时后电量降到 $${y}\\%$？`),
    point: (x, y) => t(`after $${x}$ hours the charge is $${y}\\%$`, `$${x}$ 小时后电量为 $${y}\\%$`),
    graphOf: t(
      "The graph shows the charge $B$ of a phone battery, in percent, after $t$ hours.",
      "图像表示 $t$ 小时后手机的电量 $B$（%）。",
    ),
    rateUnit: t("percent per hour", "百分点/时"),
  },
];

/** modelRhs writes the right side of y = f + rx or y = f − rx, rate first. */
const modelRhs = (c: ModelContext, f: number, r: number) => poly([c.grows ? r : -r, c.x], [f, ""]);

/** modelAt is the output of a model at x. */
const modelAt = (c: ModelContext, f: number, r: number, x: number) => (c.grows ? f + r * x : f - r * x);

/** linearModelIntro draws the plumber's charge C = 30h + 40 for 0 to 5 hours, with the rise of 30 for one more hour. */
const linearModelIntro: Figure = scaledGraph(
  { x: 1, y: 20, nx: 6, ny: 10, xName: "h", yName: "C" },
  [
    { kind: "segment", a: [0, 2], b: [5, 9.5], accent: true },
    ...[0, 1, 2, 3, 4, 5].map((h): PlaneMark => ({ kind: "point", at: [h, 2 + 1.5 * h] })),
    ...riseRun([2, 5], [3, 6.5], ["1", "30"]),
    { kind: "point", at: [0, 2], label: "40", dir: "e", tone: "result" },
  ],
  "The charge C = 30h + 40 for 0 to 5 hours: it starts at 40 and rises 30 for each hour.",
  "费用 C = 30h + 40（0 到 5 小时）：从 40 开始，每小时上升 30。",
);

/** modelCheck checks a model at one unit: the start changed once by the rate. */
function modelCheck(c: ModelContext, f: number, r: number): Text {
  const s = c.grows ? 1 : -1;
  const one = modelAt(c, f, r, 1);
  return t(
    `**Check.** After one unit of $${c.x}$, $${c.y}$ should be the start ${c.grows ? "plus" : "minus"} one step: $${f} ${c.grows ? "+" : "-"} ${r} = ${one}$. The equation gives $${num(s * r)} \\cdot 1 + ${f} = ${one}$.`,
    `**检验。** $${c.x}$ 增加一个单位后，$${c.y}$ 应该是起始量${c.grows ? "加上" : "减去"}一步：$${f} ${c.grows ? "+" : "-"} ${r} = ${one}$。方程给出 $${num(s * r)} \\cdot 1 + ${f} = ${one}$。`,
  );
}

export const modelingWithTwoVariableLinearEquations: TopicDef = {
  id: "modeling-with-two-variable-linear-equations",
  title: t("Modeling With Linear Equations in Two Variables", "用二元一次方程建模"),
  summary: t(
    "Write an equation $y = mx + b$ for a quantity that changes at a constant rate, use it, and explain its slope and intercept.",
    "为以恒定速率变化的量写出方程 $y = mx + b$，使用它，并解释其斜率和截距的含义。",
  ),
  prerequisites: ["slope-intercept-form", "modeling-with-linear-equations"],
  encompasses: [
    { topic: "slope-intercept-form", weight: 0.3 },
    { topic: "interpreting-linear-expressions", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.8.F.B.4"],
  intro: t(
    `The line $y = mx + b$ starts at height $b$ on the $y$-axis and rises $m$ for every step of $1$ to the right. Many real quantities grow or shrink in exactly this way, so their whole story fits in one equation in two variables.

A plumber charges a call-out fee of $\\$40$ plus $\\$30$ for each hour of work. List the charge $C$ for a job of $h$ hours:

| $h$ | $0$ | $1$ | $2$ | $3$ |
| :-: | :-: | :-: | :-: | :-: |
| $C$ | $40$ | $70$ | $100$ | $130$ |

Each extra hour adds the same $30$, so after $h$ hours the fee has had $30$ added $h$ times:

$$C = 30h + 40.$$

On a graph the points lie on a line that starts at $40$ and climbs $30$ per hour:

{{figure 0}}

The rate, $30$, is the slope, and the starting amount, $40$, is the intercept. In this lesson we write such equations, use them to answer questions in both directions, and say what their two numbers mean.`,
    `直线 $y = mx + b$ 从 $y$ 轴上高度 $b$ 处出发，每向右走 $1$ 就上升 $m$。许多实际的量正是这样增加或减少的，所以它们的变化规律可以用一个二元方程完整地表示出来。

水管工上门收费 $40$ 元，每工作一小时另收 $30$ 元。列出工作 $h$ 小时的费用 $C$：

| $h$ | $0$ | $1$ | $2$ | $3$ |
| :-: | :-: | :-: | :-: | :-: |
| $C$ | $40$ | $70$ | $100$ | $130$ |

每多一小时都加上同样的 $30$ 元，所以 $h$ 小时后，上门费上已经加了 $h$ 次 $30$：

$$C = 30h + 40.$$

在图上，这些点落在一条直线上，它从 $40$ 出发，每小时上升 $30$：

{{figure 0}}

变化率 $30$ 是斜率，起始量 $40$ 是截距。这节课我们写出这样的方程，用它从两个方向回答问题，并说明其中两个数的含义。`,
  ),
  introFigures: [linearModelIntro],
  knowledgePoints: [
    {
      id: "writing-a-linear-model",
      title: t("Writing a linear model", "写出一次模型"),
      explanation: t(
        `A quantity $y$ that starts at an amount $b$ and changes by the same amount $m$ for each unit of $x$ has had $m$ added $x$ times after $x$ units. So

$$y = mx + b.$$

The rate $m$ is positive when $y$ grows and negative when it shrinks.

A pool holds $900$ liters and loses $30$ liters each minute. It starts at $b = 900$; each minute changes it by $m = -30$, negative because water leaves. After $t$ minutes it holds

$$V = -30t + 900 \\text{ liters}.$$

After $2$ minutes this gives $-60 + 900 = 840$, which is $900$ minus two lots of $30$, as it should be.

> **Watch out.** The rate multiplies the variable and the starting amount stands alone: $V = -30t + 900$, not $V = 900t - 30$. And a quantity that decreases has a **negative** rate; writing $+30t$ would make the pool fill up.`,
        `一个量 $y$ 从数量 $b$ 开始，$x$ 每增加一个单位就变化相同的数量 $m$，那么经过 $x$ 个单位，它就加了 $x$ 次 $m$。所以

$$y = mx + b.$$

$y$ 增加时变化率 $m$ 为正，减少时为负。

水池有 $900$ 升水，每分钟流失 $30$ 升。它从 $b = 900$ 开始；每分钟变化 $m = -30$，因为水在流出，所以是负的。$t$ 分钟后水池里有

$$V = -30t + 900 \\text{ 升}.$$

$2$ 分钟后得 $-60 + 900 = 840$，正是 $900$ 减去两个 $30$，符合实际。

> **注意。** 变化率乘以变量，起始量单独作常数项：是 $V = -30t + 900$，不是 $V = 900t - 30$。减少的量变化率是**负**的；写成 $+30t$，水池就变成在加水了。`,
      ),
      generate(rng) {
        const c = rng.pick(modelContexts);
        const f = pickStep(rng, c.start);
        const r = pickStep(rng, c.rate);
        const answer = modelRhs(c, f, r);
        const s = c.grows ? 1 : -1;
        const check = modelCheck(c, f, r);
        return expressionProblem({
          prompt: t(
            `${c.describe(f, r).en} ${c.vars.en} Write $${c.y}$ in terms of $${c.x}$.`,
            `${c.describe(f, r)["zh-CN"]}${c.vars["zh-CN"]}用 $${c.x}$ 表示 $${c.y}$。`,
          ),
          answer,
          prefix: `${c.y} =`,
          wrong: [poly([s * f, c.x], [r, ""]), poly([-s * r, c.x], [f, ""]), poly([s * r + f, c.x])],
          solution: t(
            `**Step 1: the starting amount.** When $${c.x} = 0$, $${c.y}$ is still the starting amount, $${f}$. This is the constant term $b = ${f}$.

**Step 2: the rate.** Each unit of $${c.x}$ ${c.grows ? "adds" : "takes away"} $${r}$, so the rate is $m = ${s * r}$${c.grows ? "" : ", negative because the quantity goes down"}.

**Step 3: the equation.** Put $m$ and $b$ into $${c.y} = m${c.x} + b$:${steps(`${c.y} = ${answer}`)}${check.en}`,
            `**第一步：起始量。** $${c.x} = 0$ 时，$${c.y}$ 还是起始量 $${f}$。它就是常数项 $b = ${f}$。

**第二步：变化率。** $${c.x}$ 每增加一个单位，$${c.y}$ 就${c.grows ? "增加" : "减少"} $${r}$，所以变化率 $m = ${s * r}$${c.grows ? "" : "，因为这个量在减少，所以是负的"}。

**第三步：写方程。** 把 $m$ 和 $b$ 代入 $${c.y} = m${c.x} + b$：${steps(`${c.y} = ${answer}`)}${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "using-a-linear-model",
      title: t("Using a model", "使用模型"),
      explanation: t(
        `A model links every input to its output, so it answers questions in both directions.

- **Given $x$, find $y$:** substitute the value of $x$ and compute, multiplying before adding.
- **Given $y$, find $x$:** substitute the value of $y$, which leaves an equation in $x$; undo the adding, then the multiplying.

With the taxi fare $C = 2k + 4$ dollars for $k$ kilometers: a $10$ km ride costs $2 \\cdot 10 + 4 = 24$ dollars. A fare of $\\$30$ means $2k + 4 = 30$; subtract $4$ to get $2k = 26$, then divide by $2$ to get $k = 13$ km.

> **Watch out.** Only the rate is multiplied by the input: $2 \\cdot 10 + 4$, not $(2 + 4) \\cdot 10$. When solving for $x$, subtract the starting amount **before** dividing: $30 \\div 2 = 15$ km would count the $\\$4$ as if it were kilometers.`,
        `模型把每个输入和它的输出联系起来，所以能从两个方向回答问题。

- **已知 $x$ 求 $y$：** 代入 $x$ 的值计算，先乘后加。
- **已知 $y$ 求 $x$：** 代入 $y$ 的值，得到关于 $x$ 的方程；先撤销加法，再撤销乘法。

出租车费 $C = 2k + 4$（元），$k$ 为千米数：行驶 $10$ 千米的费用是 $2 \\cdot 10 + 4 = 24$ 元。车费 $30$ 元意味着 $2k + 4 = 30$；两边减去 $4$ 得 $2k = 26$，再除以 $2$ 得 $k = 13$ 千米。

> **注意。** 只有变化率乘以输入：是 $2 \\cdot 10 + 4$，不是 $(2 + 4) \\cdot 10$。求 $x$ 时要**先**减去起始量再除：$30 \\div 2 = 15$ 千米，就把那 $4$ 元当成了千米数。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const c = rng.pick(modelContexts);
        const f = pickStep(rng, c.start);
        const r = pickStep(rng, c.rate);
        const x = rng.int(1, c.maxX(f, r));
        const y = modelAt(c, f, r, x);
        const model = `${c.y} = ${modelRhs(c, f, r)}`;
        const s = c.grows ? 1 : -1;
        if (rng.bool()) {
          return numberProblem({
            prompt: t(
              `${c.vars.en} The model is $${model}$. ${c.askY(x).en}`,
              `${c.vars["zh-CN"]}模型是 $${model}$。${c.askY(x)["zh-CN"]}`,
            ),
            answer: y,
            wrong: [r * x, f * x + s * r, f - s * r * x, (f + s * r) * x],
            solution: t(
              `**Step 1: substitute.** The input is given, so put $${c.x} = ${x}$ into the model.

**Step 2: compute.** Multiply first, then add the starting amount:${steps(`${c.y} = ${num(s * r)} \\cdot ${x} + ${f} = ${s * r * x} + ${f} = ${y}`)}**Check.** In $${x}$ units of $${c.x}$ the quantity changes by $${num(s * r)} \\cdot ${x} = ${s * r * x}$, and the change from the start is $${y} - ${f} = ${y - f}$. They agree.`,
              `**第一步：代入。** 已知输入，把 $${c.x} = ${x}$ 代入模型。

**第二步：计算。** 先乘，再加上起始量：${steps(`${c.y} = ${num(s * r)} \\cdot ${x} + ${f} = ${s * r * x} + ${f} = ${y}`)}**检验。** $${c.x}$ 增加 $${x}$ 个单位，这个量变化 $${num(s * r)} \\cdot ${x} = ${s * r * x}$；而相对起始量的变化是 $${y} - ${f} = ${y - f}$。两者一致。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`${c.vars.en} The model is $${model}$. ${c.askX(y).en}`, `${c.vars["zh-CN"]}模型是 $${model}$。${c.askX(y)["zh-CN"]}`),
          answer: x,
          wrong: [Q.of(y, r), Q.of(y + f, r), Q.of(Math.abs(y - f), f), s * r * y + f],
          solution: t(
            `**Step 1: substitute.** The output is given, so put $${c.y} = ${y}$ into the model. This leaves an equation in $${c.x}$:${steps(`${y} = ${modelRhs(c, f, r)}`)}**Step 2: solve.** Subtract the starting amount $${f}$ from both sides, then divide by the rate $${s * r}$:${steps(`${poly([s * r, c.x])} = ${y - f}`, `${c.x} = ${x}`)}**Check.** Put $${c.x} = ${x}$ back: $${num(s * r)} \\cdot ${x} + ${f} = ${y}$, the value we were given.`,
            `**第一步：代入。** 已知输出，把 $${c.y} = ${y}$ 代入模型，得到关于 $${c.x}$ 的方程：${steps(`${y} = ${modelRhs(c, f, r)}`)}**第二步：求解。** 两边减去起始量 $${f}$，再除以变化率 $${s * r}$：${steps(`${poly([s * r, c.x])} = ${y - f}`, `${c.x} = ${x}`)}**检验。** 把 $${c.x} = ${x}$ 代回：$${num(s * r)} \\cdot ${x} + ${f} = ${y}$，正是已知的值。`,
          ),
        });
      },
    },
    {
      id: "slope-and-intercept-in-context",
      figure: gradeDrawings5["modeling-with-two-variable-linear-equations#slope-and-intercept-in-context"],
      title: t("The meaning of the slope and the intercept", "斜率与截距的含义"),
      explanation: t(
        `Each number of a model $y = mx + b$ answers a different question.

- The **slope** $m$ answers "how much does $y$ change for each extra unit of $x$?" Going from $x$ to $x + 1$ adds exactly $m$ to $y$, so $m$ is a **rate**, in units of $y$ per unit of $x$.
- The **$y$-intercept** $b$ answers "what is $y$ when $x = 0$?" Then $mx$ is $0$ and only $b$ is left, so $b$ is usually the **starting amount**.

In $V = -30t + 900$ for a pool, from $t = 3$ to $t = 4$ the volume goes from $810$ to $780$: the slope $-30$ says the pool loses $30$ liters each minute. At $t = 0$, $V = 900$: the intercept is the water at the start.

> **Watch out.** The slope is a change per unit, never an amount at one moment; the intercept is an amount at one moment, $x = 0$, never a change. And neither number is "the total" or "the time": those are the variables $y$ and $x$ themselves.`,
        `模型 $y = mx + b$ 中的每个数回答的是不同的问题。

- **斜率** $m$ 回答“$x$ 每多一个单位，$y$ 变化多少？”从 $x$ 到 $x + 1$，$y$ 恰好增加 $m$，所以 $m$ 是**变化率**，单位是“$y$ 的单位每 $x$ 的单位”。
- **$y$ 轴截距** $b$ 回答“$x = 0$ 时 $y$ 是多少？”这时 $mx$ 为 $0$，只剩下 $b$，所以 $b$ 通常是**起始量**。

在水池模型 $V = -30t + 900$ 中，从 $t = 3$ 到 $t = 4$，水量从 $810$ 变为 $780$：斜率 $-30$ 表示水池每分钟流失 $30$ 升。$t = 0$ 时 $V = 900$：截距是开始时的水量。

> **注意。** 斜率是每单位的变化量，绝不是某一时刻的数量；截距是某一时刻（$x = 0$）的数量，绝不是变化量。这两个数也都不是“总量”或“时间”：那是变量 $y$ 和 $x$ 本身。`,
      ),
      generate(rng) {
        const c = rng.pick(modelContexts);
        const f = pickStep(rng, c.start);
        const r = pickStep(rng, c.rate);
        const model = `${c.y} = ${modelRhs(c, f, r)}`;
        const askSlope = rng.bool();
        const meanings = [askSlope ? c.rateMeaning : c.startMeaning, askSlope ? c.startMeaning : c.rateMeaning, c.yMeaning, c.xMeaning];
        const order = rng.shuffle([0, 1, 2, 3]);
        const s = c.grows ? 1 : -1;
        const [y1, y2] = [modelAt(c, f, r, 1), modelAt(c, f, r, 2)];
        return choiceProblem({
          prompt: askSlope
            ? t(
                `${c.vars.en} The model is $${model}$. What does the slope of its graph represent?`,
                `${c.vars["zh-CN"]}模型是 $${model}$。它的图像的斜率表示什么？`,
              )
            : t(
                `${c.vars.en} The model is $${model}$. What does the ${c.y}-intercept of its graph, $${f}$, represent?`,
                `${c.vars["zh-CN"]}模型是 $${model}$。它的图像在 $${c.y}$ 轴上的截距 $${f}$ 表示什么？`,
              ),
          options: order.map((i) => meanings[i]!),
          correct: order.indexOf(0),
          solution: askSlope
            ? t(
                `The slope is the coefficient of $${c.x}$, $${s * r}$. It is the change in $${c.y}$ for each increase of $1$ in $${c.x}$, a rate in ${c.rateUnit.en}.

So it means ${c.rateMeaning.en.toLowerCase()}.${c.grows ? "" : ` It is negative because $${c.y}$ goes down.`}

**Check.** From $${c.x} = 1$ to $${c.x} = 2$, the model gives $${y1}$ and then $${y2}$: a change of $${y2 - y1}$, the slope.`,
                `斜率是 $${c.x}$ 的系数 $${s * r}$。它是 $${c.x}$ 每增加 $1$ 时 $${c.y}$ 的变化量，单位是${c.rateUnit["zh-CN"]}。

所以它表示${c.rateMeaning["zh-CN"]}。${c.grows ? "" : `它是负的，因为 $${c.y}$ 在减少。`}

**检验。** 从 $${c.x} = 1$ 到 $${c.x} = 2$，模型先给出 $${y1}$，再给出 $${y2}$：变化了 $${y2 - y1}$，正是斜率。`,
              )
            : t(
                `The intercept is the constant term, $${f}$. It is the value of $${c.y}$ when $${c.x} = 0$, before any change has happened.

So it means ${c.startMeaning.en.toLowerCase()}.

**Check.** At $${c.x} = 0$ the term with $${c.x}$ is $${num(s * r)} \\cdot 0 = 0$, which leaves $${c.y} = ${f}$.`,
                `截距是常数项 $${f}$。它是 $${c.x} = 0$ 时 $${c.y}$ 的值，那时还没有发生任何变化。

所以它表示${c.startMeaning["zh-CN"]}。

**检验。** $${c.x} = 0$ 时，含 $${c.x}$ 的项是 $${num(s * r)} \\cdot 0 = 0$，剩下 $${c.y} = ${f}$。`,
              ),
        });
      },
    },
  ],
};

// ─── Totals ───────────────────────────────────────────────────────────────────

/** TotalContext is a total made of two kinds of items with different values: ax + by = T. */
interface TotalContext {
  readonly a: Range;
  readonly b: Range;
  readonly describe: (a: number, b: number, total: number) => Text;
  readonly vars: Text;
  /** askY asks for the number of the second kind when there are x of the first. */
  readonly askY: (x: number) => Text;
  /** askOnly asks how many of one kind there would be with none of the other. */
  readonly askOnly: (kind: 0 | 1) => Text;
  readonly names: readonly [Text, Text];
}

const totalContexts: readonly TotalContext[] = [
  {
    a: [8, 15, 1],
    b: [3, 7, 1],
    describe: (a, b, T) =>
      t(
        `A theater sells adult tickets for ${dollars(a)} each and child tickets for ${dollars(b)} each. One evening it took in ${dollars(T)}.`,
        `剧院成人票每张 $${a}$ 元，儿童票每张 $${b}$ 元。某天晚上剧院票房收入 $${T}$ 元。`,
      ),
    vars: t("Let $x$ be the number of adult tickets and $y$ the number of child tickets sold.", "设卖出成人票 $x$ 张，儿童票 $y$ 张。"),
    askY: (x) =>
      t(`If $${x}$ adult tickets were sold, how many child tickets were sold?`, `如果卖出了 $${x}$ 张成人票，那么卖出了多少张儿童票？`),
    askOnly: (k) =>
      k === 0
        ? t("If no child tickets were sold, how many adult tickets were sold?", "如果没有卖出儿童票，那么卖出了多少张成人票？")
        : t("If no adult tickets were sold, how many child tickets were sold?", "如果没有卖出成人票，那么卖出了多少张儿童票？"),
    names: [t("adult tickets", "成人票"), t("child tickets", "儿童票")],
  },
  {
    a: [3, 3, 1],
    b: [2, 2, 1],
    describe: (_a, _b, T) =>
      t(
        `A basketball team scored $${T}$ points in a season, all from $3$-point and $2$-point shots.`,
        `一支篮球队一个赛季得了 $${T}$ 分，全部来自三分球和两分球。`,
      ),
    vars: t("Let $x$ be the number of 3-point shots and $y$ the number of 2-point shots.", "设投中三分球 $x$ 个，两分球 $y$ 个。"),
    askY: (x) =>
      t(
        `If the team made $${x}$ $3$-point shots, how many $2$-point shots did it make?`,
        `如果球队投中了 $${x}$ 个三分球，那么投中了多少个两分球？`,
      ),
    askOnly: (k) =>
      k === 0
        ? t("If the team made no 2-point shots, how many 3-point shots did it make?", "如果球队没有投中两分球，那么投中了多少个三分球？")
        : t("If the team made no 3-point shots, how many 2-point shots did it make?", "如果球队没有投中三分球，那么投中了多少个两分球？"),
    names: [t("3-point shots", "三分球"), t("2-point shots", "两分球")],
  },
  {
    a: [4, 9, 1],
    b: [2, 5, 1],
    describe: (a, b, T) =>
      t(
        `A bakery sells loaves of bread for ${dollars(a)} and muffins for ${dollars(b)}. One day its sales came to ${dollars(T)}.`,
        `面包店的面包每个 $${a}$ 元，松饼每个 $${b}$ 元。某天的销售额是 $${T}$ 元。`,
      ),
    vars: t("Let $x$ be the number of loaves and $y$ the number of muffins sold.", "设卖出面包 $x$ 个，松饼 $y$ 个。"),
    askY: (x) => t(`If $${x}$ loaves were sold, how many muffins were sold?`, `如果卖出了 $${x}$ 个面包，那么卖出了多少个松饼？`),
    askOnly: (k) =>
      k === 0
        ? t("If no muffins were sold, how many loaves were sold?", "如果没有卖出松饼，那么卖出了多少个面包？")
        : t("If no loaves were sold, how many muffins were sold?", "如果没有卖出面包，那么卖出了多少个松饼？"),
    names: [t("loaves", "面包"), t("muffins", "松饼")],
  },
  {
    a: [9, 14, 1],
    b: [5, 8, 1],
    describe: (a, b, T) =>
      t(
        `Running burns $${a}$ calories per minute and swimming burns $${b}$ calories per minute. Mia burned $${T}$ calories in a week of running and swimming.`,
        `跑步每分钟消耗 $${a}$ 千卡，游泳每分钟消耗 $${b}$ 千卡。米娅一周跑步和游泳共消耗了 $${T}$ 千卡。`,
      ),
    vars: t("Let $x$ be the number of minutes she ran and $y$ the number of minutes she swam.", "设她跑步 $x$ 分钟，游泳 $y$ 分钟。"),
    askY: (x) => t(`If she ran for $${x}$ minutes, how many minutes did she swim?`, `如果她跑步 $${x}$ 分钟，那么她游泳多少分钟？`),
    askOnly: (k) =>
      k === 0
        ? t("If she did not swim at all, how many minutes did she run?", "如果她完全没有游泳，那么她跑步多少分钟？")
        : t("If she did not run at all, how many minutes did she swim?", "如果她完全没有跑步，那么她游泳多少分钟？"),
    names: [t("minutes of running", "跑步分钟数"), t("minutes of swimming", "游泳分钟数")],
  },
];

/** totalPrices draws the two values of a total context, different and without a common factor. */
function totalPrices(rng: Rng, c: TotalContext): [number, number] {
  let a: number;
  let b: number;
  do {
    [a, b] = [pickStep(rng, c.a), pickStep(rng, c.b)];
  } while (a === b || gcd(a, b) !== 1);
  return [a, b];
}

/** totalsIntro draws 9x + 5y = 720 from (0, 144) to (80, 0), with the combination (40, 72) on it. */
const totalsIntro: Figure = scaledGraph(
  { x: 10, y: 20, nx: 10, ny: 8, xName: "x", yName: "y" },
  [
    { kind: "segment", a: [0, 7.2], b: [8, 0], accent: true },
    { kind: "point", at: [0, 7.2], label: "(0, 144)", dir: "ne" },
    { kind: "point", at: [8, 0], label: "(80, 0)", dir: "n" },
    { kind: "point", at: [4, 3.6], label: "(40, 72)", dir: "ne", tone: "result" },
  ],
  "The line 9x + 5y = 720 from (0, 144) to (80, 0), through the combination (40, 72).",
  "直线 9x + 5y = 720，从 (0, 144) 到 (80, 0)，经过组合 (40, 72)。",
);

/** totalFigure draws the line ax + by = T between its intercepts, with the intercept asked for in the result color. */
function totalFigure(a: number, b: number, T: number, kind: 0 | 1): Figure {
  const [sx, sy] = [niceUnit(T / a / 9), niceUnit(T / b / 7.5)];
  const [xi, yi] = [T / a / sx, T / b / sy];
  return scaledGraph(
    { x: sx, y: sy, nx: 10, ny: 8, xName: "x", yName: "y" },
    [
      { kind: "segment", a: [0, yi], b: [xi, 0], accent: true },
      { kind: "point", at: [0, yi], label: `(0, ${T / b})`, dir: "ne", ...(kind === 1 ? { tone: "result" as const } : {}) },
      { kind: "point", at: [xi, 0], label: `(${T / a}, 0)`, dir: "n", ...(kind === 0 ? { tone: "result" as const } : {}) },
    ],
    `The line ${a}x + ${b}y = ${T} meets the axes at (${T / a}, 0) and (0, ${T / b}).`,
    `直线 ${a}x + ${b}y = ${T} 与两坐标轴交于 (${T / a}, 0) 和 (0, ${T / b})。`,
  );
}

export const modelingTotalsWithTwoVariableEquations: TopicDef = {
  id: "modeling-totals-with-two-variable-equations",
  title: t("Modeling Totals Using Two-Variable Linear Equations", "用二元一次方程表示总量"),
  summary: t(
    "Model a total made of two kinds of items with $ax + by = T$, and find one quantity from the other or from an intercept.",
    "用 $ax + by = T$ 表示由两类物品组成的总量，并由一个量或截距求另一个量。",
  ),
  prerequisites: ["modeling-with-two-variable-linear-equations", "standard-form"],
  encompasses: [{ topic: "two-step-equations", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.2"],
  intro: t(
    `So far one quantity grew from a start at a steady rate. Another common situation has a **fixed total** made of two kinds of things, where both counts are unknown. Then the model is not "$y$ in terms of $x$" but a balance: what the two kinds contribute must add up to the total.

A theater sells adult tickets at $\\$9$ and child tickets at $\\$5$, and one evening it takes in $\\$720$. With $x$ adult and $y$ child tickets, the adults pay $9x$ dollars and the children $5y$, so

$$9x + 5y = 720.$$

This is a line in standard form. Many combinations fit it: $40$ adults and $72$ children ($360 + 360 = 720$), $80$ adults and no children, or no adults and $144$ children. Each is a point of the line:

{{figure 0}}

In this lesson we write such equations, find one count from the other, and read the extreme cases from the intercepts.`,
    `前面的模型中，一个量从起始量出发以固定速率变化。另一种常见情境是：一个**固定的总量**由两类东西组成，两类的数量都未知。这时模型不是“用 $x$ 表示 $y$”，而是一种平衡：两类各自贡献的部分加起来必须等于总量。

剧院成人票每张 $9$ 元，儿童票每张 $5$ 元，某天晚上票房收入 $720$ 元。设成人票 $x$ 张、儿童票 $y$ 张，成人付 $9x$ 元，儿童付 $5y$ 元，所以

$$9x + 5y = 720.$$

这是一条标准式的直线。有许多组合符合它：$40$ 张成人票和 $72$ 张儿童票（$360 + 360 = 720$），$80$ 张成人票而没有儿童票，或者没有成人票而有 $144$ 张儿童票。每一种组合都是直线上的一个点：

{{figure 0}}

这节课我们写出这样的方程，由一个数量求另一个数量，并从截距读出两种极端情况。`,
  ),
  introFigures: [totalsIntro],
  knowledgePoints: [
    {
      id: "writing-a-total-equation",
      title: t("Writing the equation of a total", "写出总量方程"),
      explanation: t(
        `When each item of the first kind is worth $a$, then $x$ of them are worth $a$ added $x$ times, $ax$. In the same way $y$ items of the second kind, worth $b$ each, are worth $by$. Together they make the total $T$:

$$ax + by = T.$$

Adult tickets at $\\$9$ and child tickets at $\\$5$ that bring in $\\$720$: the adult tickets bring in $9x$, the child tickets $5y$, so $9x + 5y = 720$. For instance $40$ adult and $72$ child tickets give $9 \\cdot 40 + 5 \\cdot 72 = 360 + 360 = 720$.

> **Watch out.** Each value belongs to the variable that counts **its own** kind: $9$ goes with $x$, the adult tickets, so $5x + 9y$ is wrong. And $x + y = 720$ counts tickets, not dollars: the number of items is not the total value.`,
        `第一类物品每件价值 $a$，那么 $x$ 件就是 $x$ 个 $a$，即 $ax$。同样，第二类每件价值 $b$，$y$ 件价值 $by$。合起来是总量 $T$：

$$ax + by = T.$$

成人票 $9$ 元、儿童票 $5$ 元，共收入 $720$ 元：成人票收入 $9x$，儿童票收入 $5y$，所以 $9x + 5y = 720$。例如 $40$ 张成人票和 $72$ 张儿童票：$9 \\cdot 40 + 5 \\cdot 72 = 360 + 360 = 720$。

> **注意。** 每个单价要乘以表示**它那一类**物品件数的变量：$9$ 配 $x$（成人票），所以 $5x + 9y$ 是错的。$x + y = 720$ 数的是票的张数，而不是钱数：物品的件数不等于总价值。`,
      ),
      generate(rng) {
        const c = rng.pick(totalContexts);
        const [a, b] = totalPrices(rng, c);
        const [p, q] = [rng.int(2, 30), rng.int(2, 30)];
        const T = a * p + b * q;
        const answer = `${poly([a, "x"], [b, "y"])} = ${T}`;
        return equationProblem({
          prompt: t(
            `${c.describe(a, b, T).en} ${c.vars.en} Write an equation relating $x$ and $y$, in standard form.`,
            `${c.describe(a, b, T)["zh-CN"]}${c.vars["zh-CN"]}写出 $x$ 与 $y$ 的关系式（标准式）。`,
          ),
          answer,
          form: "standard",
          wrong: [`${poly([b, "x"], [a, "y"])} = ${T}`, `x + y = ${T}`, `${poly([a, "x"], [-b, "y"])} = ${T}`],
          solution: t(
            `**Step 1: each kind's part.** Each of the $x$ ${c.names[0].en} is worth $${a}$, so together they contribute $${poly([a, "x"])}$. Each of the $y$ ${c.names[1].en} is worth $${b}$, so they contribute $${poly([b, "y"])}$.

**Step 2: the total.** The two parts add up to $${T}$:${steps(answer)}**Check.** One combination that gives this total is $x = ${p}$, $y = ${q}$: $${a} \\cdot ${p} + ${b} \\cdot ${q} = ${a * p} + ${b * q} = ${T}$, so it lies on the equation, as it should.`,
            `**第一步：每一类的部分。** $x$ 份${c.names[0]["zh-CN"]}每份是 $${a}$，合起来贡献 $${poly([a, "x"])}$；$y$ 份${c.names[1]["zh-CN"]}每份是 $${b}$，合起来贡献 $${poly([b, "y"])}$。

**第二步：总量。** 两部分加起来是 $${T}$：${steps(answer)}**检验。** 能得到这个总量的一种组合是 $x = ${p}$，$y = ${q}$：$${a} \\cdot ${p} + ${b} \\cdot ${q} = ${a * p} + ${b * q} = ${T}$，它满足这个方程，符合预期。`,
          ),
        });
      },
    },
    {
      id: "finding-the-other-quantity",
      title: t("Finding one quantity from the other", "由一个量求另一个量"),
      explanation: t(
        `One equation in two unknowns has many solutions, but once one quantity is known only one value of the other fits. Substitute the known value, and the equation becomes an ordinary two-step equation in the other variable: subtract the known part from the total, then divide by the value of each item.

With $9x + 5y = 720$ and $x = 40$ adult tickets, the adults paid $9 \\cdot 40 = 360$:

$$360 + 5y = 720 \\;\\Rightarrow\\; 5y = 360 \\;\\Rightarrow\\; y = 72.$$

So $72$ child tickets were sold, and $360 + 360 = 720$ confirms it.

> **Watch out.** Subtract the **value** of the known items, $9 \\cdot 40 = 360$, not their count $40$: $720 - 40$ mixes tickets with dollars. And divide by the value of the other kind, $5$, not by the value of the known kind.`,
        `一个二元方程有许多解，但一旦知道一个量，另一个量就只有一个值符合。代入已知的值，方程就变成另一个变量的普通两步方程：先从总量中减去已知部分，再除以每件的单价。

对 $9x + 5y = 720$，若成人票 $x = 40$ 张，成人付了 $9 \\cdot 40 = 360$ 元：

$$360 + 5y = 720 \\;\\Rightarrow\\; 5y = 360 \\;\\Rightarrow\\; y = 72.$$

所以卖出了 $72$ 张儿童票，$360 + 360 = 720$ 验证了这一点。

> **注意。** 要减去已知物品的**价值** $9 \\cdot 40 = 360$，而不是它们的件数 $40$：$720 - 40$ 把张数和钱数混在了一起。还要除以另一类的单价 $5$，而不是已知那一类的单价。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const c = rng.pick(totalContexts);
        const [a, b] = totalPrices(rng, c);
        const [x, y] = [rng.int(2, 30), rng.int(2, 30)];
        const T = a * x + b * y;
        const eq = `${poly([a, "x"], [b, "y"])} = ${T}`;
        return numberProblem({
          prompt: t(
            `${c.describe(a, b, T).en} ${c.vars.en} So $${eq}$. ${c.askY(x).en}`,
            `${c.describe(a, b, T)["zh-CN"]}${c.vars["zh-CN"]}于是 $${eq}$。${c.askY(x)["zh-CN"]}`,
          ),
          answer: y,
          wrong: [Q.of(T - x, b), Q.of(T - b * x, a), T - a * x, Q.of(T, b).sub(Q.of(x))],
          solution: t(
            `**Step 1: substitute.** Put $x = ${x}$ into the equation; the ${c.names[0].en} contribute $${a} \\cdot ${x} = ${a * x}$:${steps(`${a * x} + ${poly([b, "y"])} = ${T}`)}**Step 2: solve.** Subtract $${a * x}$ from both sides, then divide by $${b}$:${steps(`${poly([b, "y"])} = ${T - a * x}`, `y = ${y}`)}**Check.** $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${T}$, the total in the question.`,
            `**第一步：代入。** 把 $x = ${x}$ 代入方程；${c.names[0]["zh-CN"]}贡献 $${a} \\cdot ${x} = ${a * x}$：${steps(`${a * x} + ${poly([b, "y"])} = ${T}`)}**第二步：求解。** 两边减去 $${a * x}$，再除以 $${b}$：${steps(`${poly([b, "y"])} = ${T - a * x}`, `y = ${y}`)}**检验。** $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${T}$，正是题中的总量。`,
          ),
        });
      },
    },
    {
      id: "intercepts-of-a-total",
      figure: gradeDrawings5["modeling-totals-with-two-variable-equations#intercepts-of-a-total"],
      title: t("The intercepts of a total", "总量方程的截距"),
      explanation: t(
        `The graph of $ax + by = T$ is a line, and its two ends in the first quadrant are the extreme cases. On the $x$-axis $y = 0$: there are none of the second kind, so the first kind makes up the whole total. On the $y$-axis $x = 0$, the other way round. Setting one variable to $0$ leaves a one-step equation for the other.

For $9x + 5y = 720$: with $y = 0$, $9x = 720$ and $x = 80$, so the $x$-intercept is $(80, 0)$: $80$ adult tickets alone bring in $\\$720$. With $x = 0$, $5y = 720$ and $y = 144$: the $y$-intercept is $(0, 144)$.

> **Watch out.** The $x$-intercept has $y = 0$, so it is written $(80, 0)$, with the number first; $(0, 80)$ is a point on the $y$-axis. And divide the total by the value of the kind that is **left**: with no child tickets, $720 \\div 9$, not $720 \\div 5$.`,
        `$ax + by = T$ 的图像是一条直线，它在第一象限的两端就是两种极端情况。在 $x$ 轴上 $y = 0$：没有第二类物品，总量全部由第一类组成。在 $y$ 轴上 $x = 0$，情况相反。令一个变量为 $0$，另一个变量就只剩一步方程。

对 $9x + 5y = 720$：令 $y = 0$，$9x = 720$，$x = 80$，所以与 $x$ 轴交于 $(80, 0)$：只卖 $80$ 张成人票收入 $720$ 元。令 $x = 0$，$5y = 720$，$y = 144$：与 $y$ 轴交于 $(0, 144)$。

> **注意。** $x$ 轴上的交点 $y = 0$，所以写成 $(80, 0)$，数在前；$(0, 80)$ 是 $y$ 轴上的点。总量要除以**剩下**那一类的单价：没有儿童票时是 $720 \\div 9$，不是 $720 \\div 5$。`,
      ),
      generate(rng) {
        const c = rng.pick(totalContexts);
        const [a, b] = totalPrices(rng, c);
        const T = a * b * rng.int(2, 12);
        const eq = `${poly([a, "x"], [b, "y"])} = ${T}`;
        const kind: 0 | 1 = rng.bool() ? 0 : 1;
        const n = kind === 0 ? T / a : T / b;
        const other = kind === 0 ? T / b : T / a;
        const pt: [number, number] = kind === 0 ? [n, 0] : [0, n];
        const meaning = t(
          `With no ${c.names[1 - kind]!.en}, there are $${n}$ ${c.names[kind]!.en}.`,
          `没有${c.names[1 - kind]!["zh-CN"]}时，${c.names[kind]!["zh-CN"]}有 $${n}$ 份。`,
        );
        const work = kind === 0 ? `${poly([a, "x"])} = ${T}, \\quad x = ${n}` : `${poly([b, "y"])} = ${T}, \\quad y = ${n}`;
        const intro = t(
          `${c.describe(a, b, T).en} ${c.vars.en} So $${eq}$.`,
          `${c.describe(a, b, T)["zh-CN"]}${c.vars["zh-CN"]}于是 $${eq}$。`,
        );
        const zero = kind === 0 ? "y" : "x";
        const check = t(
          `**Check.** ${kind === 0 ? `$${a} \\cdot ${n} + ${b} \\cdot 0 = ${T}$` : `$${a} \\cdot 0 + ${b} \\cdot ${n} = ${T}$`}, the whole total.`,
          `**检验。** ${kind === 0 ? `$${a} \\cdot ${n} + ${b} \\cdot 0 = ${T}$` : `$${a} \\cdot 0 + ${b} \\cdot ${n} = ${T}$`}，正是全部总量。`,
        );
        const first = t(
          `**Step 1: set $${zero} = 0$.** ${kind === 0 ? "On the $x$-axis" : "On the $y$-axis"} there are no ${c.names[1 - kind]!.en}, so put $${zero} = 0$; their term drops out.

**Step 2: solve.** Divide the total by the value of each of the ${c.names[kind]!.en}:${steps(work)}`,
          `**第一步：令 $${zero} = 0$。** 在${kind === 0 ? " $x$ 轴" : " $y$ 轴"}上没有${c.names[1 - kind]!["zh-CN"]}，所以令 $${zero} = 0$，这一项就没有了。

**第二步：求解。** 用总量除以${c.names[kind]!["zh-CN"]}每份的值：${steps(work)}`,
        );
        if (rng.bool()) {
          return {
            ...pointProblem({
              prompt: t(
                `${intro.en} Find the ${kind === 0 ? "$x$" : "$y$"}-intercept of the graph of this equation, as an ordered pair.`,
                `${intro["zh-CN"]}求这个方程的图像与 ${kind === 0 ? "$x$" : "$y$"} 轴的交点，写成有序数对。`,
              ),
              answer: pt,
              wrong: [kind === 0 ? [0, n] : [n, 0], kind === 0 ? [other, 0] : [0, other], kind === 0 ? [0, other] : [other, 0]],
              solution: t(
                `${first.en}The intercept is $${pointLatex(pt)}$. ${meaning.en}

{{figure 0}}

${check.en}`,
                `${first["zh-CN"]}交点是 $${pointLatex(pt)}$。${meaning["zh-CN"]}

{{figure 0}}

${check["zh-CN"]}`,
              ),
            }),
            solutionFigures: [totalFigure(a, b, T, kind)],
          };
        }
        return {
          ...numberProblem({
            prompt: t(`${intro.en} ${c.askOnly(kind).en}`, `${intro["zh-CN"]}${c.askOnly(kind)["zh-CN"]}`),
            answer: n,
            wrong: [other, T - (kind === 0 ? b : a), Q.of(T, a + b)],
            solution: t(
              `This is the ${kind === 0 ? "$x$" : "$y$"}-intercept of the graph.

${first.en}{{figure 0}}

${check.en}`,
              `这就是图像与 ${kind === 0 ? "$x$" : "$y$"} 轴的交点。

${first["zh-CN"]}{{figure 0}}

${check["zh-CN"]}`,
            ),
          }),
          solutionFigures: [totalFigure(a, b, T, kind)],
        };
      },
    },
  ],
};

// ─── Graphs of linear models ──────────────────────────────────────────────────

/** ModelGraph is a linear model drawn on a grid: it starts k0 cells up and changes by rise cells every run cells. */
interface ModelGraph {
  readonly c: ModelContext;
  readonly sc: Scale;
  readonly k0: number;
  readonly rise: number;
  readonly run: number;
  /** f and r are the start and the rate (the absolute value of the slope) in the units of the situation. */
  readonly f: number;
  readonly r: Q;
  /** j is how many steps of run cells the second marked point is from the start. */
  readonly j: number;
  readonly figure: Figure;
  /** marks are the line and the marked points of figure, to draw on again in a solution. */
  readonly marks: readonly PlaneMark[];
  /** second is the second marked point, in grid cells. */
  readonly second: readonly [number, number];
}

/** modelGraph draws a linear model whose marked points lie on grid points. */
function modelGraph(rng: Rng): ModelGraph {
  const c = rng.pick(modelContexts);
  const [nx, ny] = [10, 8];
  let sx: number;
  let sy: number;
  let k0: number;
  let rise: number;
  let run: number;
  do {
    [sx, sy, rise, run] = [rng.pick(c.gx), rng.pick(c.gy), rng.int(1, 3), rng.int(1, 2)];
    k0 = c.grows ? rng.int(1, 3) : rng.int(4, 8);
  } while (gcd(rise, run) !== 1 || (!c.grows && ((k0 * run) % rise !== 0 || (k0 * run) / rise > nx)));
  const sc: Scale = { x: sx, y: sy, nx, ny, xName: c.x, yName: c.y };
  const f = k0 * sy;
  const r = Q.of(rise * sy, run * sx);
  let j = 1;
  if (c.grows) while (run * (j + 1) <= nx && k0 + rise * (j + 1) <= ny) j++;
  else j = (k0 * run) / rise / run;
  const end: [number, number] = c.grows ? [nx, k0 + (rise * nx) / run] : [(k0 * run) / rise, 0];
  const s = c.grows ? 1 : -1;
  const second: [number, number] = [run * j, k0 + s * rise * j];
  const marks: PlaneMark[] = [
    { kind: "segment", a: [0, k0], b: end, accent: true },
    { kind: "point", at: [0, k0] },
    { kind: "point", at: second },
  ];
  const figure = scaledGraph(
    sc,
    marks,
    `A line starting at (0, ${f}) and passing through (${second[0] * sx}, ${second[1] * sy}).`,
    `一条从 (0, ${f}) 开始、经过 (${second[0] * sx}, ${second[1] * sy}) 的直线。`,
  );
  return { c, sc, k0, rise, run, f, r, j, figure, marks, second };
}

/** tankIntro draws a tank that drains from 400 liters to empty in 80 minutes, with the rise and run from (0, 400) to (40, 200). */
const tankIntro: Figure = scaledGraph(
  { x: 10, y: 50, nx: 10, ny: 8, xName: "t", yName: "V" },
  [
    { kind: "segment", a: [0, 8], b: [8, 0], accent: true },
    ...riseRun([0, 8], [4, 4], ["40", "-200"]),
    { kind: "point", at: [0, 8], label: "(0, 400)", dir: "ne" },
    { kind: "point", at: [4, 4], label: "(40, 200)", dir: "ne" },
    { kind: "point", at: [8, 0], label: "(80, 0)", dir: "ne", tone: "result" },
  ],
  "A line from (0, 400) to (80, 0); from (0, 400) to (40, 200) the run is 40 and the rise is -200.",
  "一条从 (0, 400) 到 (80, 0) 的直线；从 (0, 400) 到 (40, 200)，水平变化 40，竖直变化 -200。",
);

/** signed writes "+ n" or "- n" after a value, for a change of s times n. */
function signed(s: number, n: string): string {
  return `${s > 0 ? "+" : "-"} ${n}`;
}

export const analyzingGraphsOfLinearModels: TopicDef = {
  id: "analyzing-graphs-of-linear-models",
  title: t("Analyzing and Interpreting Graphs of Linear Equations", "分析和解释一次方程的图像"),
  summary: t(
    "Read the rate, the starting value and other values of a situation from the graph of its linear model, and write the model.",
    "从一次模型的图像中读出变化率、起始值和其他数值，并写出模型。",
  ),
  prerequisites: ["modeling-with-two-variable-linear-equations", "properties-of-lines-in-slope-intercept-form"],
  encompasses: [
    { topic: "modeling-with-two-variable-linear-equations", weight: 0.4 },
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.8.F.B.4", "CCSS.HSF.IF.B.4", "CCSS.HSS.ID.C.7"],
  intro: t(
    `We have written linear models $y = mx + b$ from a description, and we know that on the graph $b$ is where the line meets the vertical axis and $m$ is the slope. Often a situation comes as a **graph** instead, and we read the model off the picture: the start from the intercept, the rate from the slope, and any single value from a point.

A tank is drained, and the graph shows the volume $V$ in liters after $t$ minutes:

{{figure 0}}

Each square across is $10$ minutes and each square up is $50$ liters, so we must read the numbers on the axes, not count squares. The line starts at $(0, 400)$: the tank holds $400$ liters at first. From $(0, 400)$ to $(40, 200)$ the volume changes by $-200$ in $40$ minutes, so the slope is $\\frac{-200}{40} = -5$: it loses $5$ liters a minute. The line meets the horizontal axis at $(80, 0)$: the tank is empty after $80$ minutes. All of it together is the model $V = -5t + 400$.`,
    `我们已经能由文字描述写出一次模型 $y = mx + b$，也知道在图像上 $b$ 是直线与纵轴的交点，$m$ 是斜率。很多时候情境是以**图像**给出的，我们要从图中读出模型：由截距读出起始值，由斜率读出变化率，由一个点读出一对对应的值。

给水箱放水，图像表示 $t$ 分钟后水箱里的水量 $V$（升）：

{{figure 0}}

横向每格是 $10$ 分钟，纵向每格是 $50$ 升，所以要读坐标轴上的数，而不是数格子。直线从 $(0, 400)$ 开始：水箱一开始有 $400$ 升水。从 $(0, 400)$ 到 $(40, 200)$，水量在 $40$ 分钟里变化了 $-200$ 升，所以斜率是 $\\frac{-200}{40} = -5$：每分钟减少 $5$ 升。直线与横轴交于 $(80, 0)$：$80$ 分钟后水箱放空。把这些合起来，模型就是 $V = -5t + 400$。`,
  ),
  introFigures: [tankIntro],
  knowledgePoints: [
    {
      id: "rate-from-a-graph",
      figure: gradeDrawings5["analyzing-graphs-of-linear-models#rate-from-a-graph"],
      title: t("The rate of change from a graph", "由图像求变化率"),
      explanation: t(
        `The rate of a linear model is how much the vertical quantity changes for each unit of the horizontal one, and on the graph that is the slope. Between any two points of the line the ratio is the same, so pick two points whose coordinates can be read exactly, such as the start and a point where the line crosses grid lines, and divide:

$$\\text{rate} = \\frac{\\text{change in the vertical quantity}}{\\text{change in the horizontal quantity}}.$$

The tank holds $400$ liters at $t = 0$ and $300$ liters at $t = 20$ minutes, so the slope is $\\frac{300 - 400}{20 - 0} = \\frac{-100}{20} = -5$ liters per minute: the tank loses $5$ liters each minute. The unit of the rate is the unit of the vertical axis per unit of the horizontal one.

> **Watch out.** Use the **numbers on the axes**, not the number of squares: when a square up is worth $50$ liters, a rise of $2$ squares is $100$ liters. Put the vertical change on top; the horizontal change over the vertical gives the reciprocal. Subtract the starting value: $\\frac{300}{20}$ is not the rate. And a line that goes down has a negative slope.`,
        `一次模型的变化率是横向量每增加一个单位时纵向量的变化量，在图像上就是斜率。直线上任意两点算出的比值都相同，所以选两个坐标能准确读出的点，比如起点和直线恰好穿过网格交点的点，再相除：

$$\\text{变化率} = \\frac{\\text{纵向量的变化}}{\\text{横向量的变化}}.$$

水箱在 $t = 0$ 时有 $400$ 升水，$t = 20$ 分钟时有 $300$ 升，所以斜率是 $\\frac{300 - 400}{20 - 0} = \\frac{-100}{20} = -5$ 升/分：水箱每分钟减少 $5$ 升水。变化率的单位是“纵轴单位每横轴单位”。

> **注意。** 要用**坐标轴上的数**，而不是格子数：纵向每格是 $50$ 升时，上升 $2$ 格就是 $100$ 升。纵向变化放在分子上；横向变化除以纵向变化得到的是倒数。要减去起始值：$\\frac{300}{20}$ 不是变化率。直线向下时斜率是负的。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const g = modelGraph(rng);
        const { c, sc, k0, rise, run, j, f } = g;
        const s = c.grows ? 1 : -1;
        const slope = g.r.mul(Q.of(s));
        const [x2, y2] = [run * j * sc.x, (k0 + s * rise * j) * sc.y];
        return {
          ...numberProblem({
            prompt: t(
              `${c.graphOf.en} What is the slope of the line, in ${c.rateUnit.en}?`,
              `${c.graphOf["zh-CN"]}这条直线的斜率是多少（单位：${c.rateUnit["zh-CN"]}）？`,
            ),
            answer: slope,
            wrong: [slope.neg(), Q.of(s * rise, run), Q.one.div(slope), Q.of(y2, x2)],
            solution: t(
              `**Step 1: two points.** Reading the numbers on the axes, the line passes through $(0, ${f})$ and $${pointLatex([x2, y2])}$.

**Step 2: the slope.** Divide the change in $${c.y}$ by the change in $${c.x}$:${steps(`\\frac{${y2} - ${f}}{${x2} - 0} = \\frac{${y2 - f}}{${x2}} = ${num(slope)}`)}{{figure 0}}

${c.grows ? "It is positive" : "It is negative"} because $${c.y}$ ${c.grows ? "goes up" : "goes down"}: ${c.rateMeaning.en.toLowerCase()} is $${num(g.r)}$.

**Check.** Starting at $${f}$ and changing by $${num(slope)}$ for each of the $${x2}$ units gives $${f} ${signed(s, `${num(g.r)} \\cdot ${x2}`)} = ${y2}$, the second point.`,
              `**第一步：取两点。** 读坐标轴上的数，直线经过 $(0, ${f})$ 和 $${pointLatex([x2, y2])}$。

**第二步：求斜率。** 用 $${c.y}$ 的变化除以 $${c.x}$ 的变化：${steps(`\\frac{${y2} - ${f}}{${x2} - 0} = \\frac{${y2 - f}}{${x2}} = ${num(slope)}`)}{{figure 0}}

斜率为${c.grows ? "正" : "负"}，因为 $${c.y}$ 在${c.grows ? "增加" : "减少"}：${c.rateMeaning["zh-CN"]}是 $${num(g.r)}$。

**检验。** 从 $${f}$ 开始，$${x2}$ 个单位中每个单位变化 $${num(slope)}$：$${f} ${signed(s, `${num(g.r)} \\cdot ${x2}`)} = ${y2}$，正是第二个点。`,
            ),
          }),
          figure: g.figure,
          solutionFigures: [
            scaledGraph(
              sc,
              [...g.marks, ...riseRun([0, k0], g.second, [String(x2), String(y2 - f)]), { kind: "point", at: g.second, tone: "result" }],
              `From (0, ${f}) to (${x2}, ${y2}) the run is ${x2} and the rise is ${y2 - f}, so the slope is ${plain(slope)}.`,
              `从 (0, ${f}) 到 (${x2}, ${y2})，水平变化 ${x2}，竖直变化 ${y2 - f}，所以斜率是 ${plain(slope)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "values-from-a-graph",
      figure: gradeDrawings5["analyzing-graphs-of-linear-models#values-from-a-graph"],
      title: t("Reading values and intercepts", "读出数值和截距"),
      explanation: t(
        `Each point $(x, y)$ of the graph pairs an input with its output, so a value of the situation is read by finding the point and reading **both** of its coordinates on the axes. Two points are special. The intercept on the vertical axis has $x = 0$: it is the value at the start. When a quantity decreases, the intercept on the horizontal axis has $y = 0$: it is the input at which the quantity runs out.

The tank line passes through $(0, 400)$, $(20, 300)$ and $(80, 0)$. So the tank holds $400$ liters at the start, $300$ liters after $20$ minutes, and it is empty after $80$ minutes. To answer "when does it hold $300$ liters?", find $300$ on the vertical axis, go across to the line, and read down: $20$ minutes.

> **Watch out.** Read the value from the numbers on the axis, not by counting squares. Keep the coordinates apart: a question about $y$ is answered by the second number of the point, a question about $x$ by the first. And read the point that lies on the line; one square too far gives a value one step off.`,
        `图像上每个点 $(x, y)$ 把一个输入和它的输出配成一对，所以要读情境中的一个值，就找到这个点，在坐标轴上读出它的**两个**坐标。有两个特殊的点。纵轴上的截距处 $x = 0$：它是开始时的值。当量减少时，横轴上的截距处 $y = 0$：它是这个量用完时的输入。

水箱的直线经过 $(0, 400)$、$(20, 300)$ 和 $(80, 0)$。所以水箱开始时有 $400$ 升水，$20$ 分钟后有 $300$ 升，$80$ 分钟后放空。要回答“什么时候有 $300$ 升？”，就在纵轴上找到 $300$，水平走到直线，再向下读：$20$ 分钟。

> **注意。** 要按坐标轴上的数读值，而不是数格子。两个坐标不要弄混：问 $y$ 时答点的第二个数，问 $x$ 时答第一个数。还要读直线上的点；多数一格，答案就差一步。`,
      ),
      generate(rng) {
        const g = modelGraph(rng);
        const { c, sc, k0, rise, run, j, f } = g;
        const s = c.grows ? 1 : -1;
        const kind = rng.int(0, 2);
        if (kind === 0) {
          return {
            ...numberProblem({
              prompt: t(
                `${c.graphOf.en} What is the value of $${c.y}$ at the start, when $${c.x} = 0$?`,
                `${c.graphOf["zh-CN"]}开始时（$${c.x} = 0$）$${c.y}$ 的值是多少？`,
              ),
              answer: f,
              wrong: [k0, (k0 + s * rise * j) * sc.y, run * j * sc.x],
              solution: t(
                `**Step 1: where $${c.x} = 0$.** The start is on the vertical axis, so look where the line meets it.

**Step 2: read the axis.** The line meets the vertical axis at $(0, ${f})$, so $${c.y} = ${f}$ at the start.

{{figure 0}}

**Check.** The point is $${k0}$ squares up and each square is worth $${sc.y}$: $${k0} \\cdot ${sc.y} = ${f}$.`,
                `**第一步：找 $${c.x} = 0$ 处。** 开始时的点在纵轴上，所以看直线与纵轴的交点。

**第二步：读坐标轴。** 直线与纵轴交于 $(0, ${f})$，所以开始时 $${c.y} = ${f}$。

{{figure 0}}

**检验。** 这个点在第 $${k0}$ 格，每格是 $${sc.y}$：$${k0} \\cdot ${sc.y} = ${f}$。`,
              ),
            }),
            figure: g.figure,
            solutionFigures: [
              scaledGraph(
                sc,
                [...g.marks, { kind: "point", at: [0, k0], label: String(f), dir: "ne", tone: "result" }],
                `The line meets the vertical axis at ${f}.`,
                `直线与纵轴交于 ${f}。`,
              ),
            ],
          };
        }
        if (!c.grows && kind === 1) {
          const empty = ((k0 * run) / rise) * sc.x;
          return {
            ...numberProblem({
              prompt: t(
                `${c.graphOf.en} For which value of $${c.x}$ does $${c.y}$ reach $0$?`,
                `${c.graphOf["zh-CN"]}$${c.x}$ 为何值时 $${c.y}$ 减少到 $0$？`,
              ),
              answer: empty,
              wrong: [f, (k0 * run) / rise, Q.of(f, empty)],
              solution: t(
                `**Step 1: where $${c.y} = 0$.** The value $0$ is on the horizontal axis, so look where the line meets it.

**Step 2: read the axis.** The line meets the horizontal axis at $(${empty}, 0)$, so $${c.y} = 0$ when $${c.x} = ${empty}$.

{{figure 0}}

**Check.** The line starts at $${f}$ and falls by $${num(g.r)}$ per unit, and $${f} - ${num(g.r)} \\cdot ${empty} = 0$.`,
                `**第一步：找 $${c.y} = 0$ 处。** 值为 $0$ 的点在横轴上，所以看直线与横轴的交点。

**第二步：读坐标轴。** 直线与横轴交于 $(${empty}, 0)$，所以 $${c.x} = ${empty}$ 时 $${c.y} = 0$。

{{figure 0}}

**检验。** 直线从 $${f}$ 开始，每个单位减少 $${num(g.r)}$，而 $${f} - ${num(g.r)} \\cdot ${empty} = 0$。`,
              ),
            }),
            figure: g.figure,
            solutionFigures: [
              scaledGraph(
                sc,
                [...g.marks, { kind: "point", at: [(k0 * run) / rise, 0], label: String(empty), dir: "ne", tone: "result" }],
                `The line meets the horizontal axis at ${empty}.`,
                `直线与横轴交于 ${empty}。`,
              ),
            ],
          };
        }
        const i = rng.int(1, j);
        const [xi, yi] = [run * i * sc.x, (k0 + s * rise * i) * sc.y];
        const findY = rng.bool();
        const ri = rise * i * sc.y;
        return {
          ...numberProblem({
            prompt: findY
              ? t(`${c.graphOf.en} What is $${c.y}$ when $${c.x} = ${xi}$?`, `${c.graphOf["zh-CN"]}$${c.x} = ${xi}$ 时 $${c.y}$ 是多少？`)
              : t(
                  `${c.graphOf.en} For which value of $${c.x}$ is $${c.y} = ${yi}$?`,
                  `${c.graphOf["zh-CN"]}$${c.x}$ 为何值时 $${c.y} = ${yi}$？`,
                ),
            answer: findY ? yi : xi,
            wrong: findY ? [xi, k0 + s * rise * i, yi + s * sc.y] : [yi, run * i, xi + sc.x],
            solution: findY
              ? t(
                  `**Step 1: find the point.** Find $${xi}$ on the horizontal axis and go up to the line.

**Step 2: read across.** From the line go across to the vertical axis: it reads $${yi}$. The point is $${pointLatex([xi, yi])}$, so $${c.y} = ${yi}$.

{{figure 0}}

**Check.** From the start $(0, ${f})$ the rate is $${num(g.r)}$ per unit, and $${f} ${signed(s, `${num(g.r)} \\cdot ${xi}`)} = ${yi}$.`,
                  `**第一步：找到点。** 在横轴上找到 $${xi}$，竖直走到直线。

**第二步：横着读。** 从直线水平走到纵轴，读数是 $${yi}$。这个点是 $${pointLatex([xi, yi])}$，所以 $${c.y} = ${yi}$。

{{figure 0}}

**检验。** 从起点 $(0, ${f})$ 开始，每个单位变化 $${num(g.r)}$，而 $${f} ${signed(s, `${num(g.r)} \\cdot ${xi}`)} = ${yi}$。`,
                )
              : t(
                  `**Step 1: find the point.** Find $${yi}$ on the vertical axis and go across to the line.

**Step 2: read down.** From the line go down to the horizontal axis: it reads $${xi}$. The point is $${pointLatex([xi, yi])}$, so $${c.x} = ${xi}$.

{{figure 0}}

**Check.** From the start $(0, ${f})$, $${c.y}$ has changed by $${yi - f}$, and $${num(g.r)} \\cdot ${xi} = ${ri}$ is the size of that change.`,
                  `**第一步：找到点。** 在纵轴上找到 $${yi}$，水平走到直线。

**第二步：向下读。** 从直线竖直走到横轴，读数是 $${xi}$。这个点是 $${pointLatex([xi, yi])}$，所以 $${c.x} = ${xi}$。

{{figure 0}}

**检验。** 从起点 $(0, ${f})$ 开始，$${c.y}$ 变化了 $${yi - f}$，而 $${num(g.r)} \\cdot ${xi} = ${ri}$ 正是这个变化的大小。`,
                ),
          }),
          figure: g.figure,
          solutionFigures: [
            scaledGraph(
              sc,
              [...g.marks, ...guides([run * i, k0 + s * rise * i], `(${xi}, ${yi})`)],
              `The graph passes through (${xi}, ${yi}).`,
              `图像经过 (${xi}, ${yi})。`,
            ),
          ],
        };
      },
    },
    {
      id: "model-from-a-graph",
      title: t("The model of a graphed situation", "由图像写出模型"),
      explanation: t(
        `A linear model $y = mx + b$ needs two numbers, and the graph shows both. The starting value $b$ is where the line meets the vertical axis. The rate $m$ is the slope, found from two points with the numbers on the axes. Then write the model with the letters of the situation.

The tank line passes through $(0, 400)$ and $(20, 300)$. The start is $b = 400$, and the rate is $m = \\frac{300 - 400}{20} = -5$. So $V = -5t + 400$. At $t = 20$ it gives $-100 + 400 = 300$, the second point.

> **Watch out.** The intercept is the number on the axis, not the number of squares. The rate is the vertical change over the horizontal change in the units of the axes; its reciprocal, or the slope counted in squares, is wrong. And a decreasing quantity needs a negative rate: $V = 5t + 400$ would fill the tank.`,
        `一次模型 $y = mx + b$ 需要两个数，图像把两个都给出了。起始值 $b$ 是直线与纵轴的交点。变化率 $m$ 是斜率，用坐标轴上的数由两点求出。然后用情境中的字母写出模型。

水箱的直线经过 $(0, 400)$ 和 $(20, 300)$。起始值 $b = 400$，变化率 $m = \\frac{300 - 400}{20} = -5$。所以 $V = -5t + 400$。$t = 20$ 时它给出 $-100 + 400 = 300$，正是第二个点。

> **注意。** 截距是坐标轴上的数，而不是格子数。变化率是按坐标轴单位算出的纵向变化除以横向变化；它的倒数，或者按格子数出的斜率，都是错的。减少的量要用负的变化率：$V = 5t + 400$ 表示的是在往水箱里加水。`,
      ),
      generate(rng) {
        const g = modelGraph(rng);
        const { c, sc, k0, rise, run, j, f } = g;
        const s = c.grows ? 1 : -1;
        const slope = g.r.mul(Q.of(s));
        const answer = poly([slope, c.x], [f, ""]);
        const [x2, y2] = [run * j * sc.x, (k0 + s * rise * j) * sc.y];
        return {
          ...expressionProblem({
            prompt: t(`${c.graphOf.en} Write $${c.y}$ in terms of $${c.x}$.`, `${c.graphOf["zh-CN"]}用 $${c.x}$ 表示 $${c.y}$。`),
            answer,
            prefix: `${c.y} =`,
            wrong: [
              poly([slope.neg(), c.x], [f, ""]),
              poly([Q.of(s * rise, run), c.x], [f, ""]),
              poly([slope, c.x], [k0, ""]),
              poly([Q.one.div(slope), c.x], [f, ""]),
            ],
            solution: t(
              `**Step 1: the start.** The line meets the vertical axis at $(0, ${f})$, so the starting value is $${f}$.

**Step 2: the rate.** The line also passes through $${pointLatex([x2, y2])}$, so the rate is${steps(`\\frac{${y2} - ${f}}{${x2} - 0} = ${num(slope)}`)}{{figure 0}}

**Step 3: the model.** Rate times $${c.x}$, plus the start:${steps(`${c.y} = ${answer}`)}**Check.** At $${c.x} = ${x2}$ the model gives $${f} ${signed(s, `${num(g.r)} \\cdot ${x2}`)} = ${y2}$, the second point of the graph.`,
              `**第一步：起始值。** 直线与纵轴交于 $(0, ${f})$，所以起始值是 $${f}$。

**第二步：变化率。** 直线还经过 $${pointLatex([x2, y2])}$，所以变化率是${steps(`\\frac{${y2} - ${f}}{${x2} - 0} = ${num(slope)}`)}{{figure 0}}

**第三步：写出模型。** 变化率乘以 $${c.x}$，再加上起始值：${steps(`${c.y} = ${answer}`)}**检验。** $${c.x} = ${x2}$ 时模型给出 $${f} ${signed(s, `${num(g.r)} \\cdot ${x2}`)} = ${y2}$，正是图像上的第二个点。`,
            ),
          }),
          figure: g.figure,
          solutionFigures: [
            scaledGraph(
              sc,
              [...g.marks, ...riseRun([0, k0], g.second, [String(x2), String(y2 - f)]), { kind: "point", at: [0, k0], tone: "result" }],
              `The line starts at ${f} and has slope ${plain(slope)}.`,
              `直线从 ${f} 开始，斜率是 ${plain(slope)}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ─── Further modeling ─────────────────────────────────────────────────────────

/** PlanContext compares two pricing plans, each a fee plus a rate per unit. */
interface PlanContext {
  readonly fee: Range;
  readonly rate: Range;
  readonly diff: readonly [number, number];
  readonly cross: readonly [number, number];
  readonly describe: (f1: number, r1: number, f2: number, r2: number) => Text;
  readonly askEqual: Text;
  readonly askCheaper: (u: number) => Text;
  readonly names: readonly [Text, Text];
  readonly units: Text;
}

const planContexts: readonly PlanContext[] = [
  {
    fee: [0, 40, 5],
    rate: [2, 6, 1],
    diff: [1, 5],
    cross: [4, 20],
    describe: (f1, r1, f2, r2) =>
      t(
        `Gym A charges a joining fee of ${dollars(f1)} plus ${dollars(r1)} per visit. Gym B charges a joining fee of ${dollars(f2)} plus ${dollars(r2)} per visit.`,
        `A 健身房收入会费 $${f1}$ 元，每次另收 $${r1}$ 元；B 健身房收入会费 $${f2}$ 元，每次另收 $${r2}$ 元。`,
      ),
    askEqual: t("For how many visits do the two gyms cost the same?", "去多少次时两家健身房的费用相同？"),
    askCheaper: (u) => t(`Which gym is cheaper for $${u}$ visits?`, `去 $${u}$ 次时，哪家健身房更便宜？`),
    names: [t("Gym A", "A 健身房"), t("Gym B", "B 健身房")],
    units: t("visits", "次"),
  },
  {
    fee: [10, 50, 5],
    rate: [20, 40, 5],
    diff: [5, 15],
    cross: [2, 9],
    describe: (f1, r1, f2, r2) =>
      t(
        `Company A rents cars for ${dollars(f1)} plus ${dollars(r1)} per day. Company B rents them for ${dollars(f2)} plus ${dollars(r2)} per day.`,
        `A 公司租车收费 $${f1}$ 元，每天另收 $${r1}$ 元；B 公司收费 $${f2}$ 元，每天另收 $${r2}$ 元。`,
      ),
    askEqual: t("For how many days do the two companies charge the same?", "租多少天时两家公司的收费相同？"),
    askCheaper: (u) => t(`Which company is cheaper for $${u}$ days?`, `租 $${u}$ 天时，哪家公司更便宜？`),
    names: [t("Company A", "A 公司"), t("Company B", "B 公司")],
    units: t("days", "天"),
  },
  {
    fee: [20, 60, 5],
    rate: [30, 60, 5],
    diff: [5, 20],
    cross: [2, 8],
    describe: (f1, r1, f2, r2) =>
      t(
        `Electrician A charges a call-out fee of ${dollars(f1)} plus ${dollars(r1)} per hour. Electrician B charges ${dollars(f2)} plus ${dollars(r2)} per hour.`,
        `电工 A 上门收费 $${f1}$ 元，每小时另收 $${r1}$ 元；电工 B 上门收费 $${f2}$ 元，每小时另收 $${r2}$ 元。`,
      ),
    askEqual: t("For how many hours of work do the two electricians charge the same?", "工作多少小时时两位电工的收费相同？"),
    askCheaper: (u) => t(`Which electrician is cheaper for $${u}$ hours of work?`, `工作 $${u}$ 小时时，哪位电工更便宜？`),
    names: [t("Electrician A", "电工 A"), t("Electrician B", "电工 B")],
    units: t("hours", "小时"),
  },
];

/** plans draws two plans whose costs are equal at a whole number of units: plan A has the higher fee and the lower rate. */
function plans(rng: Rng, c: PlanContext) {
  const r1 = pickStep(rng, c.rate);
  const d = rng.int(c.diff[0], c.diff[1]);
  const r2 = r1 + d;
  const cross = rng.int(c.cross[0], c.cross[1]);
  const f2 = pickStep(rng, c.fee);
  const f1 = f2 + d * cross;
  return { r1, r2, f1, f2, d, cross };
}

/** plansIntro draws the plans 30 + 4x and 12 + 7x, which cross at (6, 54). */
const plansIntro: Figure = plansFigure(
  4,
  30,
  7,
  12,
  9,
  (at) => [
    { kind: "label", at: at(8.6, 30 + 4 * 8.6), text: "A", dir: "nw" },
    { kind: "label", at: at(8.6, 12 + 7 * 8.6), text: "B", dir: "nw" },
    ...guides(at(6, 54), "(6, 54)"),
  ],
  "Plan A, y = 4x + 30, starts higher; plan B, y = 7x + 12, rises faster; they cross at (6, 54).",
  "方案 A，y = 4x + 30，起点更高；方案 B，y = 7x + 12，上升更快；两者交于 (6, 54)。",
);

export const furtherModelingWithTwoVariableEquations: TopicDef = {
  id: "further-modeling-with-two-variable-equations",
  title: t("Further Modeling With Linear Equations in Two Variables", "二元一次方程建模进阶"),
  summary: t(
    "Build a linear model from two data points or a table, and compare two linear models.",
    "由两组数据或表格建立一次模型，并比较两个一次模型。",
  ),
  prerequisites: ["analyzing-graphs-of-linear-models", "point-slope-form"],
  encompasses: [
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.HSF.LE.A.2"],
  intro: t(
    `We can write a linear model when we are told the start and the rate, and read one off a graph. Two more situations come up all the time. Sometimes we only have **two measurements**, and must find the start and the rate from them, just as two points determine a line. And sometimes there are **two models** of the same thing, and the question is which one is better.

Two gyms charge differently: gym A takes a fee of $\\$30$ and $\\$4$ a visit, so $y = 4x + 30$ for $x$ visits; gym B takes $\\$12$ and $\\$7$ a visit, $y = 7x + 12$. Gym B is cheaper at first, but its cost grows faster:

{{figure 0}}

The lines cross where $4x + 30 = 7x + 12$, that is at $x = 6$ visits, when both cost $\\$54$. For fewer visits gym B is cheaper; for more, gym A. In this lesson we build models from data and compare models like these.`,
    `已知起始值和变化率时，我们能写出一次模型，也能从图像中读出模型。还有两种情况经常出现。有时我们只有**两次测量的结果**，要由它们求出起始值和变化率，就像两点确定一条直线。有时同一件事有**两个模型**，问题是哪一个更好。

两家健身房收费方式不同：A 健身房收会费 $30$ 元，每次 $4$ 元，去 $x$ 次的费用是 $y = 4x + 30$；B 健身房收 $12$ 元，每次 $7$ 元，$y = 7x + 12$。一开始 B 更便宜，但它的费用增长得更快：

{{figure 0}}

两条直线在 $4x + 30 = 7x + 12$ 处相交，即 $x = 6$ 次时，两者都是 $54$ 元。去的次数更少时 B 更便宜，更多时 A 更便宜。这节课我们由数据建立模型，并比较这样的模型。`,
  ),
  introFigures: [plansIntro],
  knowledgePoints: [
    {
      id: "model-from-two-data-points",
      title: t("A model from two data points", "由两组数据建立模型"),
      explanation: t(
        `A linear quantity changes by the same amount for each unit, so two data points are enough to find the model. The rate is the change in $y$ divided by the change in $x$ between them. The start $b$ is then whatever makes one of the points fit $y = mx + b$.

A job of $2$ hours costs $\\$150$ and a job of $5$ hours costs $\\$285$. In $3$ more hours the cost rose by $135$, so $m = \\frac{285 - 150}{5 - 2} = 45$ dollars an hour. Then $150 = 45 \\cdot 2 + b$ gives $b = 150 - 90 = 60$, and $C = 45h + 60$. The other point agrees: $45 \\cdot 5 + 60 = 285$.

> **Watch out.** Divide the change in $y$ by the change in $x$: when the two inputs are $3$ apart, $135$ is the change over three units, not the rate. The start is the value at $x = 0$, not the first value given: $150$ is the cost of $2$ hours. And when $y$ falls as $x$ grows, the rate is negative.`,
        `线性变化的量每增加一个单位都变化相同的量，所以两组数据就足以求出模型。变化率等于两组数据之间 $y$ 的变化除以 $x$ 的变化。然后起始值 $b$ 就是使其中一个点满足 $y = mx + b$ 的那个数。

工作 $2$ 小时收费 $150$ 元，工作 $5$ 小时收费 $285$ 元。多工作 $3$ 小时，费用增加了 $135$ 元，所以 $m = \\frac{285 - 150}{5 - 2} = 45$ 元/时。再由 $150 = 45 \\cdot 2 + b$ 得 $b = 150 - 90 = 60$，所以 $C = 45h + 60$。另一个点也符合：$45 \\cdot 5 + 60 = 285$。

> **注意。** 要用 $y$ 的变化除以 $x$ 的变化：两个输入相差 $3$ 时，$135$ 是三个单位的变化，而不是变化率。起始值是 $x = 0$ 时的值，不是给出的第一个值：$150$ 是工作 $2$ 小时的费用。当 $x$ 增大而 $y$ 减小时，变化率是负的。`,
      ),
      keyPrerequisites: ["point-slope-form"],
      generate(rng) {
        const c = rng.pick(modelContexts);
        const f = pickStep(rng, c.start);
        const r = pickStep(rng, c.rate);
        const max = c.maxX(f, r);
        const x1 = rng.int(1, max - 2);
        const dx = rng.int(1, Math.min(4, max - x1));
        const x2 = x1 + dx;
        const [y1, y2] = [modelAt(c, f, r, x1), modelAt(c, f, r, x2)];
        const s = c.grows ? 1 : -1;
        const answer = modelRhs(c, f, r);
        const x3 = x2 + dx;
        const table = x3 <= max && rng.bool();
        const prompt = table
          ? t(
              `${c.vars.en} $${c.y}$ changes linearly with $${c.x}$, as in the table. Write $${c.y}$ in terms of $${c.x}$.\n\n| $${c.x}$ | $${c.y}$ |\n| :--- | :--- |\n| $${x1}$ | $${y1}$ |\n| $${x2}$ | $${y2}$ |\n| $${x3}$ | ${modelAt(c, f, r, x3)} |`,
              `${c.vars["zh-CN"]}$${c.y}$ 随 $${c.x}$ 线性变化，如下表。用 $${c.x}$ 表示 $${c.y}$。\n\n| $${c.x}$ | $${c.y}$ |\n| :--- | :--- |\n| $${x1}$ | $${y1}$ |\n| $${x2}$ | $${y2}$ |\n| $${x3}$ | ${modelAt(c, f, r, x3)} |`,
            )
          : t(
              `${c.vars.en} $${c.y}$ changes linearly with $${c.x}$: ${c.point(x1, y1).en}, and ${c.point(x2, y2).en}. Write $${c.y}$ in terms of $${c.x}$.`,
              `${c.vars["zh-CN"]}$${c.y}$ 随 $${c.x}$ 线性变化：${c.point(x1, y1)["zh-CN"]}，${c.point(x2, y2)["zh-CN"]}。用 $${c.x}$ 表示 $${c.y}$。`,
            );
        const bWork = `b = ${y1} ${s > 0 ? "-" : "+"} ${r * x1} = ${f}`;
        const [xc, yc] = table ? [x3, modelAt(c, f, r, x3)] : [x2, y2];
        const rx = r * xc;
        const check = `${num(s * r)} \\cdot ${xc} + ${f} = ${s > 0 ? rx : -rx} + ${f} = ${yc}`;
        return expressionProblem({
          prompt,
          answer,
          prefix: `${c.y} =`,
          wrong: [
            poly([s * r, c.x], [y1, ""]),
            poly([-s * r, c.x], [f, ""]),
            poly([y2 - y1, c.x], [y1 - (y2 - y1) * x1, ""]),
            poly([Q.of(dx, y2 - y1), c.x], [f, ""]),
          ],
          solution: t(
            `**Step 1: the rate.** From $${c.x} = ${x1}$ to $${c.x} = ${x2}$, $${c.y}$ changes by $${y2 - y1}$ in $${dx}$ ${dx === 1 ? "unit" : "units"}:${steps(`m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${dx}} = ${num(s * r)}`)}**Step 2: the start.** Substitute $${pointLatex([x1, y1])}$ into $${c.y} = ${num(s * r)}${c.x} + b$:${steps(`${y1} = ${s * r * x1} + b`, bWork)}**Step 3: the model.**${steps(`${c.y} = ${answer}`)}**Check.** ${table ? "The last row of the table" : "The other data point"}: $${check}$.`,
            `**第一步：变化率。** 从 $${c.x} = ${x1}$ 到 $${c.x} = ${x2}$，$${c.y}$ 在 $${dx}$ 个单位里变化了 $${y2 - y1}$：${steps(`m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{${dx}} = ${num(s * r)}`)}**第二步：起始值。** 把 $${pointLatex([x1, y1])}$ 代入 $${c.y} = ${num(s * r)}${c.x} + b$：${steps(`${y1} = ${s * r * x1} + b`, bWork)}**第三步：写出模型。**${steps(`${c.y} = ${answer}`)}**检验。** ${table ? "表格的最后一行" : "另一组数据"}：$${check}$。`,
          ),
        });
      },
    },
    {
      id: "when-two-models-are-equal",
      figure: algebraDrawings["further-modeling-with-two-variable-equations#when-two-models-are-equal"],
      title: t("When two models are equal", "两个模型何时相等"),
      explanation: t(
        `Two plans cost the same exactly when their models give the same output for the same input. So write a model for each, set the two expressions equal, and solve the equation; it has the variable on both sides. On a graph, the answer is where the two lines intersect.

Plan A costs $4x + 30$ and plan B costs $7x + 12$ for $x$ units:

$$4x + 30 = 7x + 12 \\;\\Rightarrow\\; 18 = 3x \\;\\Rightarrow\\; x = 6.$$

The difference in fees, $30 - 12 = 18$, is made up by the difference in rates, $7 - 4 = 3$ a unit, after $6$ units. Both plans then cost $54$.

> **Watch out.** Subtract to compare: the fees differ by $30 - 12$ and the rates by $7 - 4$, so adding them, $\\frac{30 + 12}{4 + 7}$, means nothing. After $18 = 3x$ remember to divide; $18$ is the difference in fees, not the number of units. And divide by the difference of the rates, not by one rate.`,
        `两种方案的费用相同，恰好就是它们的模型对同一个输入给出相同的输出。所以为每种方案写出模型，令两个式子相等，再解这个两边都有未知数的方程。在图像上，答案就是两条直线的交点。

方案 A 的费用是 $4x + 30$，方案 B 是 $7x + 12$（$x$ 为单位数）：

$$4x + 30 = 7x + 12 \\;\\Rightarrow\\; 18 = 3x \\;\\Rightarrow\\; x = 6.$$

固定费用的差 $30 - 12 = 18$，由单价的差（每单位 $7 - 4 = 3$）在 $6$ 个单位后补上。这时两种方案都是 $54$。

> **注意。** 比较要用减法：固定费用相差 $30 - 12$，单价相差 $7 - 4$，把它们相加得到的 $\\frac{30 + 12}{4 + 7}$ 没有意义。得到 $18 = 3x$ 后别忘了相除；$18$ 是固定费用的差，不是单位数。还要除以单价的差，而不是其中一个单价。`,
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const c = rng.pick(planContexts);
        const { r1, r2, f1, f2, d, cross } = plans(rng, c);
        const both = f1 + r1 * cross;
        return {
          ...numberProblem({
            prompt: t(`${c.describe(f1, r1, f2, r2).en} ${c.askEqual.en}`, `${c.describe(f1, r1, f2, r2)["zh-CN"]}${c.askEqual["zh-CN"]}`),
            answer: cross,
            wrong: [Q.of(f1 + f2, r1 + r2), Q.of(f1, r2), f1 - f2, Q.of(f1 - f2, r1)],
            solution: t(
              `**Step 1: the two models.** For $x$ ${c.units.en}, ${c.names[0].en} costs $${linear(r1, f1)}$ and ${c.names[1].en} costs $${linear(r2, f2)}$.

**Step 2: set them equal and solve.** Subtract $${poly([r1, "x"])}$${f2 === 0 ? "" : ` and $${f2}$`} from both sides, then divide by $${d}$:${steps(`${linear(r1, f1)} = ${linear(r2, f2)}`, `${f1 - f2} = ${poly([d, "x"])}`, `x = ${cross}`)}{{figure 0}}

**Check.** ${c.names[0].en}: $${r1} \\cdot ${cross} + ${f1} = ${both}$; ${c.names[1].en}: $${r2} \\cdot ${cross} + ${f2} = ${f2 + r2 * cross}$. The costs are equal.`,
              `**第一步：两个模型。** 设为 $x$ ${c.units["zh-CN"]}，${c.names[0]["zh-CN"]}的费用是 $${linear(r1, f1)}$，${c.names[1]["zh-CN"]}的费用是 $${linear(r2, f2)}$。

**第二步：令两者相等并求解。** 两边减去 $${poly([r1, "x"])}$${f2 === 0 ? "" : ` 和 $${f2}$`}，再除以 $${d}$：${steps(`${linear(r1, f1)} = ${linear(r2, f2)}`, `${f1 - f2} = ${poly([d, "x"])}`, `x = ${cross}`)}{{figure 0}}

**检验。** ${c.names[0]["zh-CN"]}：$${r1} \\cdot ${cross} + ${f1} = ${both}$；${c.names[1]["zh-CN"]}：$${r2} \\cdot ${cross} + ${f2} = ${f2 + r2 * cross}$。两者费用相等。`,
            ),
          }),
          solutionFigures: [
            plansFigure(
              r1,
              f1,
              r2,
              f2,
              cross * 1.5,
              (at) => guides(at(cross, both), `(${cross}, ${both})`),
              `The two lines cross at x = ${cross}, where both are ${both}.`,
              `两条直线在 x = ${cross} 处相交，此时两者都是 ${both}。`,
            ),
          ],
        };
      },
    },
    {
      id: "choosing-the-better-plan",
      title: t("Choosing the cheaper plan", "选择更便宜的方案"),
      explanation: t(
        `For a given number of units, the cheaper plan is simply the one whose model gives the smaller value there, so evaluate both. It also helps to know the shape of the answer. The plan with the lower fee starts cheaper, but if its rate is higher the other plan catches up, and after the point where they are equal the plan with the lower rate stays cheaper, because its cost grows more slowly.

With $4x + 30$ and $7x + 12$, which are equal at $x = 6$: at $x = 10$ plan A costs $4 \\cdot 10 + 30 = 70$ and plan B costs $7 \\cdot 10 + 12 = 82$, so plan A is cheaper, as expected beyond $x = 6$. At $x = 2$ it is the other way round: $38$ against $26$.

> **Watch out.** Do not decide from the fees alone or from the rates alone: the lower fee wins only for few units and the lower rate only for many. Compute both totals at the number of units in the question; when they are equal, neither plan is cheaper.`,
        `对给定的单位数，更便宜的方案就是在这里模型值更小的那个，所以把两个都算出来。了解答案的规律也有帮助。固定费用低的方案开始时更便宜，但如果它的单价更高，另一方案就会追上来；在两者相等的点之后，单价低的方案一直更便宜，因为它的费用增长得更慢。

对 $4x + 30$ 和 $7x + 12$（它们在 $x = 6$ 处相等）：$x = 10$ 时方案 A 是 $4 \\cdot 10 + 30 = 70$，方案 B 是 $7 \\cdot 10 + 12 = 82$，所以方案 A 更便宜，这和 $x = 6$ 之后的规律一致。$x = 2$ 时正好相反：$38$ 对 $26$。

> **注意。** 不要只看固定费用，也不要只看单价：固定费用低的方案只在单位数少时更便宜，单价低的方案只在单位数多时更便宜。要算出题中单位数下两者的总费用；两者相等时，哪个都不更便宜。`,
      ),
      generate(rng) {
        const c = rng.pick(planContexts);
        const { r1, r2, f1, f2, cross } = plans(rng, c);
        const u = Math.max(1, cross + rng.int(-3, 3));
        const [ca, cb] = [f1 + r1 * u, f2 + r2 * u];
        const correct = ca < cb ? 0 : cb < ca ? 1 : 2;
        const verdict = [
          t(`so ${c.names[0].en} is cheaper.`, `所以${c.names[0]["zh-CN"]}更便宜。`),
          t(`so ${c.names[1].en} is cheaper.`, `所以${c.names[1]["zh-CN"]}更便宜。`),
          t("so they cost the same.", "所以两者费用相同。"),
        ][correct]!;
        const side =
          u < cross
            ? t(
                `$${u} < ${cross}$, before the crossing, so the lower fee of ${c.names[1].en} still wins`,
                `$${u} < ${cross}$，还没到交点，所以固定费用较低的${c.names[1]["zh-CN"]}仍然更便宜`,
              )
            : u > cross
              ? t(
                  `$${u} > ${cross}$, past the crossing, so the lower rate of ${c.names[0].en} wins`,
                  `$${u} > ${cross}$，已经过了交点，所以单价较低的${c.names[0]["zh-CN"]}更便宜`,
                )
              : t(`$${u}$ is exactly the crossing, so the costs are equal`, `$${u}$ 恰好是交点，所以两者费用相等`);
        return {
          ...choiceProblem({
            prompt: t(
              `${c.describe(f1, r1, f2, r2).en} ${c.askCheaper(u).en}`,
              `${c.describe(f1, r1, f2, r2)["zh-CN"]}${c.askCheaper(u)["zh-CN"]}`,
            ),
            options: [c.names[0], c.names[1], t("They cost the same", "两者费用相同")],
            correct,
            solution: t(
              `**Step 1: both costs.** Evaluate each plan at $${u}$ ${c.units.en}. ${c.names[0].en}: $${f1} + ${r1} \\cdot ${u} = ${ca}$. ${c.names[1].en}: $${f2} + ${r2} \\cdot ${u} = ${cb}$.

**Step 2: compare.** ${ca === cb ? `Both are $${ca}$,` : `$${Math.min(ca, cb)} < ${Math.max(ca, cb)}$,`} ${verdict.en}

{{figure 0}}

**Check.** The costs are equal when $${linear(r1, f1)} = ${linear(r2, f2)}$, at $x = ${cross}$. Here ${side.en}, which agrees.`,
              `**第一步：两种费用。** 分别算出 $${u}$ ${c.units["zh-CN"]}时的费用。${c.names[0]["zh-CN"]}：$${f1} + ${r1} \\cdot ${u} = ${ca}$。${c.names[1]["zh-CN"]}：$${f2} + ${r2} \\cdot ${u} = ${cb}$。

**第二步：比较。** ${ca === cb ? `两者都是 $${ca}$，` : `$${Math.min(ca, cb)} < ${Math.max(ca, cb)}$，`}${verdict["zh-CN"]}

{{figure 0}}

**检验。** 当 $${linear(r1, f1)} = ${linear(r2, f2)}$，即 $x = ${cross}$ 时两者费用相等。这里${side["zh-CN"]}，结论一致。`,
            ),
          }),
          solutionFigures: [
            plansFigure(
              r1,
              f1,
              r2,
              f2,
              Math.max(cross, u) * 1.5,
              (at) => [
                { kind: "segment", a: at(u, 0), b: at(u, Math.max(ca, cb)), dashed: true, tone: "action" },
                { kind: "point", at: at(u, Math.max(ca, cb)) },
                { kind: "point", at: at(u, Math.min(ca, cb)), label: String(Math.min(ca, cb)), dir: "e", tone: "result" },
              ],
              `At x = ${u} the costs are ${ca} and ${cb}.`,
              `当 x = ${u} 时，费用分别是 ${ca} 和 ${cb}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ─── Distance–time graphs ─────────────────────────────────────────────────────

/** Mover is someone whose journey is graphed, with the kilometers per grid cell that suit their speed. */
interface Mover {
  readonly a: Text;
  readonly the: Text;
  readonly km: readonly number[];
}

const movers: readonly Mover[] = [
  { a: t("a hiker", "一名徒步者"), the: t("the hiker", "徒步者"), km: [1, 2] },
  { a: t("a cyclist", "一名骑行者"), the: t("the cyclist", "骑行者"), km: [5] },
  { a: t("a driver", "一名司机"), the: t("the driver", "司机"), km: [10, 20] },
];

/** Leg is one part of a journey, between two vertices of its graph, in grid cells. */
interface Leg {
  readonly from: readonly [number, number];
  readonly to: readonly [number, number];
}

/** journey draws a trip from home and back: out, a stop, possibly further out, and home; one cell is one hour across. */
function journey(rng: Rng) {
  const m = rng.pick(movers);
  const km = rng.pick(m.km);
  const [t1, d1, t2] = [rng.int(1, 3), rng.int(2, 5), rng.int(1, 2)];
  const pts: [number, number][] = [
    [0, 0],
    [t1, d1],
    [t1 + t2, d1],
  ];
  if (rng.bool()) pts.push([t1 + t2 + rng.int(1, 2), d1 + rng.int(1, 3)]);
  const last = pts[pts.length - 1]!;
  pts.push([last[0] + rng.int(1, 3), 0]);
  const legs: Leg[] = pts.slice(1).map((to, i) => ({ from: pts[i]!, to }));
  const sc: Scale = { x: 1, y: km, nx: 10, ny: 8, xName: "t", yName: "d" };
  const real = pts.map(([x, y]) => `(${x}, ${y * km})`).join(", ");
  const figure = scaledGraph(sc, polylineMarks(pts), `A distance-time graph through ${real}.`, `一个经过 ${real} 的距离—时间图。`);
  const intro = t(
    `The graph shows the distance $d$, in kilometers, of ${m.a.en} from home $t$ hours after setting out.`,
    `图像表示${m.a["zh-CN"]}出发 $t$ 小时后离家的距离 $d$（千米）。`,
  );
  return { m, km, pts, legs, figure, intro, sc };
}

/** legSpeed is the speed of a leg in kilometers per hour. */
const legSpeed = (l: Leg, km: number) => Q.of(Math.abs(l.to[1] - l.from[1]) * km, l.to[0] - l.from[0]);

/** walkIntro draws a walk 12 km out in 2 hours, an hour's stop, and 12 km home in 2 hours. */
const walkIntro: Figure = scaledGraph(
  { x: 1, y: 2, nx: 6, ny: 8, xName: "t", yName: "d" },
  [
    ...polylineMarks([
      [0, 0],
      [2, 6],
      [3, 6],
      [5, 0],
    ]),
  ],
  "A distance-time graph through (0, 0), (2, 12), (3, 12) and (5, 0): out, a stop, and back.",
  "一个经过 (0, 0)、(2, 12)、(3, 12) 和 (5, 0) 的距离—时间图：去程、停留、返程。",
);

/** sumOfLegs writes the distance covered in each leg of a journey, added up. */
function sumOfLegs(legs: readonly Leg[], km: number): string {
  const moving = legs.filter((l) => l.to[1] !== l.from[1]).map((l) => Math.abs(l.to[1] - l.from[1]) * km);
  return `${moving.join(" + ")} = ${moving.reduce((a, b) => a + b, 0)}`;
}

export const distanceTimeGraphs: TopicDef = {
  id: "distance-time-graphs",
  title: t("Distance-Time Graphs", "距离—时间图"),
  summary: t(
    "Read distances, stops and speeds from the graph of a journey, and describe what each part of it shows.",
    "从行程图像中读出距离、停留时间和速度，并描述每一段所表示的运动。",
  ),
  prerequisites: ["analyzing-graphs-of-linear-models", "speed-distance-time"],
  encompasses: [{ topic: "speed-distance-time", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.8.F.B.5", "CCSS.HSF.IF.B.4"],
  intro: t(
    `We know that speed is distance divided by time, and that the slope of a line is a rate of change. A **distance-time graph** puts the two together: it shows a journey as distance from the start against time, so the shape of the graph tells the story of the trip and the slopes are the speeds.

A hiker walks out from home, rests, and walks back:

{{figure 0}}

In the first $2$ hours the distance rises to $12$ km, so the hiker moves away at $\\frac{12}{2} = 6$ km/h. From $t = 2$ to $t = 3$ the graph is flat: the distance does not change, so the hiker is resting. Then the distance falls back to $0$ in $2$ hours: the hiker walks home, again at $6$ km/h. In all the hiker covers $12 + 12 = 24$ km, though the trip ends where it began.`,
    `我们知道速度等于路程除以时间，也知道直线的斜率是变化率。**距离—时间图**把两者结合起来：它用离出发点的距离随时间的变化来表示一次行程，所以图像的形状讲述了行程的经过，而斜率就是速度。

一名徒步者从家出发，休息一会儿，再走回来：

{{figure 0}}

前 $2$ 小时距离增加到 $12$ 千米，所以徒步者以 $\\frac{12}{2} = 6$ 千米/时的速度远离家。从 $t = 2$ 到 $t = 3$ 图像是水平的：距离不变，徒步者在休息。然后距离在 $2$ 小时内减少到 $0$：徒步者走回家，速度仍是 $6$ 千米/时。他一共走了 $12 + 12 = 24$ 千米，尽管最后回到了出发点。`,
  ),
  introFigures: [walkIntro],
  knowledgePoints: [
    {
      id: "reading-a-distance-time-graph",
      figure: algebraDrawings["distance-time-graphs#reading-a-distance-time-graph"],
      title: t("Reading a distance-time graph", "读距离—时间图"),
      explanation: t(
        `A **distance-time graph** shows how far something is from a starting point, $d$, against time, $t$. Each point answers "where was it at that moment?", and the direction of each part tells what was happening. A part going up means moving away, because the distance grows. A **horizontal** part means the distance does not change, so the traveler is stopped. A part going down means coming back.

The **total distance traveled** adds up every part of the trip, because walking back is walking too. Going $12$ km out and $12$ km back is $12 + 12 = 24$ km, even though the trip ends at distance $0$.

> **Watch out.** Read times on the horizontal axis and distances on the vertical axis, and use the numbers on the axes, not the number of squares. A horizontal part is a stop, not a steady walk. And the total distance is not the final distance from home, nor the farthest distance: count the way back as well.`,
        `**距离—时间图**表示物体离出发点的距离 $d$ 随时间 $t$ 的变化。每个点回答“那一刻它在哪里？”，每一段的方向说明当时在做什么。上升的一段表示远离出发点，因为距离在增大。**水平**的一段表示距离不变，即停留不动。下降的一段表示返回。

**总路程**要把行程的每一段都加起来，因为走回来也是在走路。去程 $12$ 千米、返程 $12$ 千米，总路程是 $12 + 12 = 24$ 千米，尽管最后的距离是 $0$。

> **注意。** 时间在横轴上读，距离在纵轴上读，并且要用坐标轴上的数，而不是格子数。水平的一段是停留，不是匀速前进。总路程既不是最后离家的距离，也不是最远的距离：返程也要算上。`,
      ),
      generate(rng) {
        const drawn = journey(rng);
        const { m, km, pts, legs, figure, intro } = drawn;
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const i = rng.int(1, pts.length - 2);
          const [tx, dy] = pts[i]!;
          return {
            ...numberProblem({
              prompt: t(
                `${intro.en} How far from home, in kilometers, is ${m.the.en} after $${tx}$ hours?`,
                `${intro["zh-CN"]}出发 $${tx}$ 小时后，${m.the["zh-CN"]}离家多少千米？`,
              ),
              answer: dy * km,
              wrong: [dy, tx * km, tx],
              solution: t(
                `**Step 1: find the time.** Find $t = ${tx}$ on the horizontal axis and go up to the graph.

**Step 2: read the distance.** Go across to the vertical axis: the graph is at $d = ${dy * km}$, so ${m.the.en} is $${dy * km}$ km from home.

{{figure 0}}

**Check.** The point is $${dy}$ squares up and each square is $${km}$ km: $${dy} \\cdot ${km} = ${dy * km}$.`,
                `**第一步：找到时间。** 在横轴上找到 $t = ${tx}$，竖直走到图像。

**第二步：读出距离。** 水平走到纵轴：图像在 $d = ${dy * km}$ 处，所以${m.the["zh-CN"]}离家 $${dy * km}$ 千米。

{{figure 0}}

**检验。** 这个点在第 $${dy}$ 格，每格是 $${km}$ 千米：$${dy} \\cdot ${km} = ${dy * km}$。`,
              ),
            }),
            figure,
            solutionFigures: [
              legFigure(
                drawn.sc,
                pts,
                undefined,
                guides([tx, dy], `(${tx}, ${dy * km})`),
                `At t = ${tx} the distance is ${dy * km}.`,
                `当 t = ${tx} 时，距离是 ${dy * km}。`,
              ),
            ],
          };
        }
        if (kind === 1) {
          const stop = legs[1]!;
          const len = stop.to[0] - stop.from[0];
          return {
            ...numberProblem({
              prompt: t(`${intro.en} For how many hours does ${m.the.en} stop?`, `${intro["zh-CN"]}${m.the["zh-CN"]}停留了多少小时？`),
              answer: len,
              wrong: [stop.to[0], stop.from[1] * km, stop.from[0]],
              solution: t(
                `**Step 1: find the stop.** A stop is where the distance does not change, a horizontal part of the graph. It runs from $t = ${stop.from[0]}$ to $t = ${stop.to[0]}$.

**Step 2: its length.** Subtract the times:${steps(`${stop.to[0]} - ${stop.from[0]} = ${len}`)}{{figure 0}}

**Check.** At both ends of this part ${m.the.en} is $${stop.from[1] * km}$ km from home, so there was no movement for these $${len}$ hours.`,
                `**第一步：找到停留的一段。** 停留时距离不变，即图像中水平的一段。它从 $t = ${stop.from[0]}$ 到 $t = ${stop.to[0]}$。

**第二步：它的长度。** 两个时间相减：${steps(`${stop.to[0]} - ${stop.from[0]} = ${len}`)}{{figure 0}}

**检验。** 在这一段的两端，${m.the["zh-CN"]}都离家 $${stop.from[1] * km}$ 千米，所以这 $${len}$ 小时内没有移动。`,
              ),
            }),
            figure,
            solutionFigures: [legFigure(drawn.sc, pts, stop, [], `The flat part lasts ${len} hours.`, `水平的一段持续 ${len} 小时。`)],
          };
        }
        const far = Math.max(...pts.map((p) => p[1])) * km;
        const The = `${m.the.en[0]!.toUpperCase()}${m.the.en.slice(1)}`;
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What total distance, in kilometers, does ${m.the.en} travel?`,
              `${intro["zh-CN"]}${m.the["zh-CN"]}一共走了多少千米？`,
            ),
            answer: 2 * far,
            wrong: [far, 0, pts[pts.length - 1]![0] * km],
            solution: t(
              `**Step 1: the way out.** ${The} only moves away until the farthest point of the graph, $${far}$ km from home, so the way out is $${far}$ km.

**Step 2: the way back.** The graph ends at $d = 0$, so ${m.the.en} comes all the way home: another $${far}$ km. The total is${steps(`2 \\cdot ${far} = ${2 * far}`)}**Check.** Add the distance covered in each moving part of the graph: $${sumOfLegs(legs, km)}$ km.`,
              `**第一步：去程。** ${m.the["zh-CN"]}一直远离家，直到图像的最高点，离家 $${far}$ 千米，所以去程是 $${far}$ 千米。

**第二步：返程。** 图像最后到 $d = 0$，所以${m.the["zh-CN"]}一路回到家：又是 $${far}$ 千米。总路程是${steps(`2 \\cdot ${far} = ${2 * far}`)}**检验。** 把图像中每个运动段走过的距离加起来：$${sumOfLegs(legs, km)}$ 千米。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "speed-from-a-distance-time-graph",
      figure: algebraDrawings["distance-time-graphs#speed-from-a-distance-time-graph"],
      title: t("Speed from the slope", "由斜率求速度"),
      explanation: t(
        `Speed is distance covered divided by time taken. On a distance-time graph, the distance covered during a part of the trip is the change in $d$ and the time is the change in $t$, so the speed is the slope of that segment. A steeper segment means more kilometers each hour, a higher speed. A segment going down has a negative slope, because the distance from home shrinks; the speed is the size of the slope.

From $(1, 12)$ to $(3, 30)$, the traveler covers $30 - 12 = 18$ km in $3 - 1 = 2$ hours, so the speed is $\\frac{18}{2} = 9$ km/h. Check: $9$ km/h for $2$ hours is $18$ km.

> **Watch out.** Divide by the time the part takes: $18$ km is the distance, not the speed. Put the distance on top; $\\frac{2}{18}$ is hours per kilometer. Use the change in distance, not the distance from home at the end, $\\frac{30}{3}$. And a speed is never negative, even on the way back.`,
        `速度等于走过的路程除以所用的时间。在距离—时间图中，一段行程走过的路程是 $d$ 的变化，所用时间是 $t$ 的变化，所以速度就是这一段线段的斜率。线段越陡，每小时走的千米数越多，速度越大。下降的线段斜率为负，因为离家的距离在缩小；速度是斜率的绝对值。

从 $(1, 12)$ 到 $(3, 30)$，在 $3 - 1 = 2$ 小时内走了 $30 - 12 = 18$ 千米，所以速度是 $\\frac{18}{2} = 9$ 千米/时。检验：以 $9$ 千米/时走 $2$ 小时是 $18$ 千米。

> **注意。** 要除以这一段所用的时间：$18$ 千米是路程，不是速度。路程放在分子上；$\\frac{2}{18}$ 是每千米用的小时数。要用距离的变化，而不是终点离家的距离 $\\frac{30}{3}$。速度不会是负的，返程时也一样。`,
      ),
      keyPrerequisites: ["speed-distance-time"],
      generate(rng) {
        const drawn = journey(rng);
        const { m, km, legs, figure, intro } = drawn;
        const moving = legs.filter((l) => l.to[1] !== l.from[1]);
        const l = rng.pick(moving);
        const v = legSpeed(l, km);
        const [d1, d2] = [l.from[1] * km, l.to[1] * km];
        const dt = l.to[0] - l.from[0];
        const dd = Math.abs(d2 - d1);
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What is the speed of ${m.the.en}, in kilometers per hour, between $t = ${l.from[0]}$ and $t = ${l.to[0]}$?`,
              `${intro["zh-CN"]}从 $t = ${l.from[0]}$ 到 $t = ${l.to[0]}$，${m.the["zh-CN"]}的速度是每小时多少千米？`,
            ),
            answer: v,
            wrong: [dd, Q.of(dt, dd), Q.of(d2, l.to[0]), v.neg()],
            solution: t(
              `**Step 1: the distance and the time.** The distance from home goes from $${d1}$ km to $${d2}$ km, so ${m.the.en} covers $${dd}$ km. This takes $${l.to[0]} - ${l.from[0]} = ${dt}$ ${dt === 1 ? "hour" : "hours"}.

**Step 2: the speed.** Divide the distance by the time:${steps(`\\frac{|${d2} - ${d1}|}{${l.to[0]} - ${l.from[0]}} = \\frac{${dd}}{${dt}} = ${num(v)}`)}So the speed is $${num(v)}$ km/h${d2 < d1 ? ", on the way back" : ""}.

{{figure 0}}

**Check.** At $${num(v)}$ km/h for $${dt}$ ${dt === 1 ? "hour" : "hours"}: $${num(v)} \\cdot ${dt} = ${dd}$ km.`,
              `**第一步：路程和时间。** 离家的距离从 $${d1}$ 千米变为 $${d2}$ 千米，所以${m.the["zh-CN"]}走了 $${dd}$ 千米，用了 $${l.to[0]} - ${l.from[0]} = ${dt}$ 小时。

**第二步：速度。** 路程除以时间：${steps(`\\frac{|${d2} - ${d1}|}{${l.to[0]} - ${l.from[0]}} = \\frac{${dd}}{${dt}} = ${num(v)}`)}所以速度是 $${num(v)}$ 千米/时${d2 < d1 ? "（返程）" : ""}。

{{figure 0}}

**检验。** 以 $${num(v)}$ 千米/时走 $${dt}$ 小时：$${num(v)} \\cdot ${dt} = ${dd}$ 千米。`,
            ),
          }),
          figure,
          solutionFigures: [
            legFigure(
              drawn.sc,
              drawn.pts,
              l,
              riseRun(l.from, l.to, [String(dt), String(d2 - d1)]),
              `In this part the distance changes by ${dd} in ${dt} hours, a speed of ${plain(v)}.`,
              `这一段 ${dt} 小时内距离变化 ${dd}，速度是 ${plain(v)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "interpreting-a-distance-time-graph",
      title: t("Describing a journey", "描述行程"),
      explanation: t(
        `To describe a part of a journey, compare the distance from home at its two ends. If it grows, the segment goes up and the traveler is moving away from home. If it stays the same, the segment is horizontal and the traveler is stopped. If it shrinks, the segment goes down and the traveler is returning.

To compare speeds, compare steepness, or better, compute each speed: the part with the largest change in distance per hour is the fastest. A walk of $12$ km in $2$ hours ($6$ km/h) is slower than a ride back of $12$ km in $1$ hour ($12$ km/h), so the steeper way back is faster.

> **Watch out.** Going down does not mean slowing down: it means getting closer to home, and it can be the fastest part of the trip. A horizontal segment means not moving at all, not moving at a steady speed. And steepness is about distance per hour, so compare speeds, not the lengths of the segments.`,
        `描述行程的某一段时，比较它两端离家的距离。如果距离增大，线段上升，表示在远离家。如果距离不变，线段水平，表示停留不动。如果距离减小，线段下降，表示在返回。

比较速度时比较陡峭程度，更好的办法是算出每一段的速度：每小时距离变化最大的一段最快。$2$ 小时走 $12$ 千米（$6$ 千米/时）比 $1$ 小时骑回 $12$ 千米（$12$ 千米/时）慢，所以更陡的返程更快。

> **注意。** 线段下降并不表示变慢：它表示离家越来越近，而且可能是整个行程中最快的一段。水平线段表示完全不动，而不是匀速运动。陡峭程度说的是每小时的距离变化，所以要比较速度，而不是线段的长短。`,
      ),
      generate(rng) {
        const drawn = journey(rng);
        const { m, km, legs, figure, intro } = drawn;
        const moving = legs.filter((l) => l.to[1] !== l.from[1]);
        const speeds = moving.map((l) => legSpeed(l, km));
        const best = speeds.reduce((b, v, i) => (v.cmp(speeds[b]!) > 0 ? i : b), 0);
        const unique = speeds.filter((v) => v.eq(speeds[best]!)).length === 1;
        const span = (l: Leg) => t(`From $t = ${l.from[0]}$ to $t = ${l.to[0]}$`, `从 $t = ${l.from[0]}$ 到 $t = ${l.to[0]}$`);
        if (unique && rng.bool()) {
          const work = moving.map((l, i) => `${l.from[0]} \\text{ to } ${l.to[0]}: \\; ${num(speeds[i]!)}`).join(", \\quad ");
          const workZh = moving.map((l, i) => `${l.from[0]} \\text{ 到 } ${l.to[0]}: \\; ${num(speeds[i]!)}`).join(", \\quad ");
          const b = moving[best]!;
          const bd = Math.abs(b.to[1] - b.from[1]) * km;
          const bt = b.to[0] - b.from[0];
          const next = speeds.filter((_, i) => i !== best).reduce((a, v) => (v.cmp(a) > 0 ? v : a), Q.zero);
          const nextKm = num(next.mul(Q.of(bt)));
          return {
            ...choiceProblem({
              prompt: t(
                `${intro.en} During which part of the trip is ${m.the.en} fastest?`,
                `${intro["zh-CN"]}${m.the["zh-CN"]}在哪一段行程中最快？`,
              ),
              options: moving.map(span),
              correct: best,
              solution: t(
                `**Step 1: the speed of each moving part.** Divide the change in distance by the time of each part; the stop has speed $0$. In km/h:${steps(work)}**Step 2: the fastest.** The largest speed is $${num(speeds[best]!)}$ km/h, from $t = ${b.from[0]}$ to $t = ${b.to[0]}$, the steepest segment.

{{figure 0}}

**Check.** In that part ${m.the.en} covers $${bd}$ km in $${bt}$ ${bt === 1 ? "hour" : "hours"}. At the next highest speed, $${num(next)}$ km/h, the same time would cover only $${num(next)} \\cdot ${bt} = ${nextKm}$ km.`,
                `**第一步：每个运动段的速度。** 用每一段的距离变化除以所用时间；停留段的速度是 $0$。单位千米/时：${steps(workZh)}**第二步：最快的一段。** 最大的速度是 $${num(speeds[best]!)}$ 千米/时，从 $t = ${b.from[0]}$ 到 $t = ${b.to[0]}$，也就是最陡的一段。

{{figure 0}}

**检验。** 这一段${m.the["zh-CN"]}在 $${bt}$ 小时内走了 $${bd}$ 千米。按第二快的速度 $${num(next)}$ 千米/时，同样的时间只能走 $${num(next)} \\cdot ${bt} = ${nextKm}$ 千米。`,
              ),
            }),
            figure,
            solutionFigures: [
              legFigure(
                drawn.sc,
                drawn.pts,
                moving[best],
                [],
                `The steepest part is the fastest, at ${plain(speeds[best]!)}.`,
                `最陡的一段最快，速度是 ${plain(speeds[best]!)}。`,
              ),
            ],
          };
        }
        const l = rng.pick(legs);
        const correct = l.to[1] > l.from[1] ? 0 : l.to[1] === l.from[1] ? 1 : 2;
        const [da, db] = [l.from[1] * km, l.to[1] * km];
        const why = [
          t("The segment goes up: the distance from home increases.", "线段上升：离家的距离在增加。"),
          t("The segment is horizontal: the distance from home does not change.", "线段水平：离家的距离不变。"),
          t("The segment goes down: the distance from home decreases.", "线段下降：离家的距离在减少。"),
        ][correct]!;
        const doing = [t("moving away from home", "在远离家"), t("stopped", "停留不动"), t("returning home", "在返回家")][correct]!;
        return {
          ...choiceProblem({
            prompt: t(
              `${intro.en} What is ${m.the.en} doing between $t = ${l.from[0]}$ and $t = ${l.to[0]}$?`,
              `${intro["zh-CN"]}从 $t = ${l.from[0]}$ 到 $t = ${l.to[0]}$，${m.the["zh-CN"]}在做什么？`,
            ),
            options: [t("Moving away from home", "远离家"), t("Stopped", "停留不动"), t("Returning home", "返回家")],
            correct,
            solution: t(
              `**Step 1: the distance at both ends.** At $t = ${l.from[0]}$ the distance from home is $${da}$ km, and at $t = ${l.to[0]}$ it is $${db}$ km.

{{figure 0}}

**Step 2: what it means.** ${why.en} So ${m.the.en} is ${doing.en}.`,
              `**第一步：两端的距离。** $t = ${l.from[0]}$ 时离家 $${da}$ 千米，$t = ${l.to[0]}$ 时离家 $${db}$ 千米。

{{figure 0}}

**第二步：它的含义。** ${why["zh-CN"]}所以${m.the["zh-CN"]}${doing["zh-CN"]}。`,
            ),
          }),
          figure,
          solutionFigures: [
            legFigure(
              drawn.sc,
              drawn.pts,
              l,
              [],
              `The part in question from t = ${l.from[0]} to t = ${l.to[0]}.`,
              `所问的一段：从 t = ${l.from[0]} 到 t = ${l.to[0]}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ─── Speed–time graphs ────────────────────────────────────────────────────────

/** Vehicle is something whose speed is graphed, with the meters per second per grid cell that suit it. */
interface Vehicle {
  readonly a: Text;
  readonly the: Text;
  readonly ms: readonly number[];
}

const vehicles: readonly Vehicle[] = [
  { a: t("a runner", "一名跑步者"), the: t("the runner", "跑步者"), ms: [1] },
  { a: t("a cyclist", "一名骑行者"), the: t("the cyclist", "骑行者"), ms: [1, 2] },
  { a: t("a car", "一辆汽车"), the: t("the car", "汽车"), ms: [2, 5] },
  { a: t("a train", "一列火车"), the: t("the train", "火车"), ms: [5] },
];

/** motion draws a trip that starts and ends at rest, in grid cells: speeding up, steady, perhaps changing speed, and slowing down. */
function motion(rng: Rng) {
  const v = rng.pick(vehicles);
  const [sx, sy] = [rng.pick([1, 2, 5]), rng.pick(v.ms)];
  let pts: [number, number][];
  let end: number;
  let ok: boolean;
  do {
    pts = [[0, 0]];
    let x = 0;
    if (rng.bool(0.25)) {
      x += 1;
      pts.push([x, 0]);
    }
    let y = rng.int(2, 6);
    x += rng.int(1, 3);
    pts.push([x, y]);
    x += rng.int(1, 3);
    pts.push([x, y]);
    ok = true;
    if (rng.bool()) {
      y += rng.nonZero(-2, 2);
      x += rng.int(1, 2);
      pts.push([x, y]);
      if (rng.bool()) {
        x += rng.int(1, 2);
        pts.push([x, y]);
      }
      ok = y >= 1 && y <= 8;
    }
    x += rng.int(1, 3);
    pts.push([x, 0]);
    end = x;
  } while (!ok || end > 10);
  const legs: Leg[] = pts.slice(1).map((to, i) => ({ from: pts[i]!, to }));
  const sc: Scale = { x: sx, y: sy, nx: 10, ny: 8, xName: "t", yName: "v" };
  const real = pts.map(([px, py]) => `(${px * sx}, ${py * sy})`).join(", ");
  const figure = scaledGraph(sc, polylineMarks(pts), `A speed-time graph through ${real}.`, `一个经过 ${real} 的速度—时间图。`);
  const intro = t(
    `The graph shows the speed $v$ of ${v.a.en}, in meters per second, $t$ seconds after it starts.`,
    `图像表示${v.a["zh-CN"]}出发 $t$ 秒后的速度 $v$（米/秒）。`,
  );
  return { v, sx, sy, pts, legs, figure, intro, sc };
}

/** carTrip is the trip of the introductions in grid cells of 2 s by 2 m/s: from rest to 12 m/s in 4 s, steady for 6 s, and to rest in 6 s. */
const carTrip: [number, number][] = [
  [0, 0],
  [2, 6],
  [5, 6],
  [8, 0],
];

/** carIntro draws the car's trip with each part named. */
const carIntro: Figure = scaledGraph(
  { x: 2, y: 2, nx: 10, ny: 8, xName: "t", yName: "v" },
  [...polylineMarks(carTrip)],
  "A speed-time graph through (0, 0), (4, 12), (10, 12) and (16, 0): speeding up, steady, slowing down.",
  "一个经过 (0, 0)、(4, 12)、(10, 12) 和 (16, 0) 的速度—时间图：加速、匀速、减速。",
);

export const speedTimeGraphs: TopicDef = {
  id: "speed-time-graphs",
  title: t("Speed-Time Graphs", "速度—时间图"),
  summary: t(
    "Read speeds from a speed-time graph, describe the motion, and find the acceleration from the slope.",
    "从速度—时间图中读出速度，描述运动，并由斜率求加速度。",
  ),
  prerequisites: ["distance-time-graphs"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.8.F.B.5", "CCSS.HSF.IF.B.6"],
  intro: t(
    `A distance-time graph shows where something is, and its slope is the speed. A **speed-time graph** goes one step further: it plots the speed itself against time. It looks similar but says something different, so each shape must be read again: a flat part now means a steady speed, and the slope is how fast the speed changes, the **acceleration**.

A car pulls away from traffic lights, drives steadily, and stops at the next lights:

{{figure 0}}

In the first $4$ seconds the speed rises from $0$ to $12$ m/s, so the car gains $\\frac{12}{4} = 3$ m/s every second. From $t = 4$ to $t = 10$ the graph is flat at $12$: the car is moving at a constant $12$ m/s, not standing still. Then the speed falls to $0$ in $6$ seconds, losing $2$ m/s each second, and the car stops.`,
    `距离—时间图表示物体在哪里，它的斜率是速度。**速度—时间图**更进一步：它画出速度本身随时间的变化。两种图看起来相似，含义却不同，所以每种形状都要重新理解：现在水平的一段表示匀速，斜率表示速度变化的快慢，即**加速度**。

一辆汽车在红绿灯前起步，匀速行驶，再在下一个红绿灯前停下：

{{figure 0}}

前 $4$ 秒速度从 $0$ 增加到 $12$ 米/秒，所以汽车每秒增加 $\\frac{12}{4} = 3$ 米/秒。从 $t = 4$ 到 $t = 10$，图像在 $12$ 处水平：汽车以 $12$ 米/秒匀速行驶，而不是停着不动。然后速度在 $6$ 秒内减到 $0$，每秒减少 $2$ 米/秒，汽车停下。`,
  ),
  introFigures: [carIntro],
  knowledgePoints: [
    {
      id: "reading-a-speed-time-graph",
      figure: algebraDrawings["speed-time-graphs#reading-a-speed-time-graph"],
      title: t("Reading a speed-time graph", "读速度—时间图"),
      explanation: t(
        `A **speed-time graph** shows speed, $v$, against time, $t$, so each point says how fast the object is going at that moment. What a segment means depends on how the speed changes along it. A segment going up means speeding up; one going down means slowing down. A **horizontal** segment above the axis means the speed stays the same, a **constant speed**. The object is stopped only where the speed is $0$, on the time axis itself.

On a graph through $(0, 0)$, $(4, 12)$, $(10, 12)$ and $(16, 0)$, the object speeds up for $4$ s, moves at a constant $12$ m/s from $t = 4$ to $t = 10$, and slows to a stop at $t = 16$.

> **Watch out.** This is not a distance-time graph: a horizontal segment means a steady speed, not standing still, and a segment going down means slowing down, not coming back. Read speeds on the vertical axis with its numbers, not by counting squares.`,
        `**速度—时间图**表示速度 $v$ 随时间 $t$ 的变化，所以每个点说明那一刻物体有多快。一段线段的含义取决于速度沿它怎样变化。线段上升表示加速，下降表示减速。在横轴上方的**水平**线段表示速度不变，即**匀速**运动。只有速度为 $0$，也就是图像在时间轴上时，物体才停止。

对经过 $(0, 0)$、$(4, 12)$、$(10, 12)$ 和 $(16, 0)$ 的图像，物体先加速 $4$ 秒，从 $t = 4$ 到 $t = 10$ 以 $12$ 米/秒匀速运动，然后减速，在 $t = 16$ 时停下。

> **注意。** 这不是距离—时间图：水平线段表示匀速，而不是静止；线段下降表示减速，而不是返回。速度要按纵轴上的数来读，而不是数格子。`,
      ),
      generate(rng) {
        const drawn = motion(rng);
        const { v, sx, sy, pts, legs, figure, intro } = drawn;
        if (rng.bool()) {
          const l = rng.pick(legs);
          const correct = l.to[1] > l.from[1] ? 0 : l.to[1] < l.from[1] ? 2 : l.from[1] > 0 ? 1 : 3;
          const [va, vb] = [l.from[1] * sy, l.to[1] * sy];
          const why = [
            t("The segment goes up: the speed increases.", "线段上升：速度在增加。"),
            t(
              `The segment is horizontal at $v = ${l.from[1] * sy}$: the speed does not change.`,
              `线段在 $v = ${l.from[1] * sy}$ 处水平：速度不变。`,
            ),
            t("The segment goes down: the speed decreases.", "线段下降：速度在减小。"),
            t("The speed is $0$ throughout.", "速度一直是 $0$。"),
          ][correct]!;
          const doing = [
            t("speeding up", "在加速"),
            t("moving at a constant speed", "在匀速运动"),
            t("slowing down", "在减速"),
            t("stopped", "静止不动"),
          ][correct]!;
          return {
            ...choiceProblem({
              prompt: t(
                `${intro.en} What is ${v.the.en} doing between $t = ${l.from[0] * sx}$ and $t = ${l.to[0] * sx}$?`,
                `${intro["zh-CN"]}从 $t = ${l.from[0] * sx}$ 到 $t = ${l.to[0] * sx}$，${v.the["zh-CN"]}在做什么？`,
              ),
              options: [
                t("Speeding up", "加速"),
                t("Moving at a constant speed", "匀速运动"),
                t("Slowing down", "减速"),
                t("Stopped", "静止"),
              ],
              correct,
              solution: t(
                `**Step 1: the speed at both ends.** At $t = ${l.from[0] * sx}$ the speed is $${va}$ m/s, and at $t = ${l.to[0] * sx}$ it is $${vb}$ m/s.

{{figure 0}}

**Step 2: what it means.** ${why.en} So ${v.the.en} is ${doing.en}.`,
                `**第一步：两端的速度。** $t = ${l.from[0] * sx}$ 时速度是 $${va}$ 米/秒，$t = ${l.to[0] * sx}$ 时是 $${vb}$ 米/秒。

{{figure 0}}

**第二步：它的含义。** ${why["zh-CN"]}所以${v.the["zh-CN"]}${doing["zh-CN"]}。`,
              ),
            }),
            figure,
            solutionFigures: [
              legFigure(
                drawn.sc,
                pts,
                l,
                [],
                `The part from ${l.from[0] * sx} to ${l.to[0] * sx}.`,
                `从 ${l.from[0] * sx} 到 ${l.to[0] * sx} 的一段。`,
              ),
            ],
          };
        }
        const i = rng.int(1, pts.length - 2);
        const [px, py] = pts[i]!;
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What is the speed of ${v.the.en}, in meters per second, at $t = ${px * sx}$?`,
              `${intro["zh-CN"]}$t = ${px * sx}$ 时，${v.the["zh-CN"]}的速度是每秒多少米？`,
            ),
            answer: py * sy,
            wrong: [py, px * sx, px],
            solution: t(
              `**Step 1: find the time.** Find $t = ${px * sx}$ on the horizontal axis and go up to the graph.

**Step 2: read the speed.** Go across to the vertical axis: the graph is at $v = ${py * sy}$, so the speed is $${py * sy}$ m/s.

{{figure 0}}

**Check.** The point is $${py}$ squares up and each square is $${sy}$ m/s: $${py} \\cdot ${sy} = ${py * sy}$.`,
              `**第一步：找到时间。** 在横轴上找到 $t = ${px * sx}$，竖直走到图像。

**第二步：读出速度。** 水平走到纵轴：图像在 $v = ${py * sy}$ 处，所以速度是 $${py * sy}$ 米/秒。

{{figure 0}}

**检验。** 这个点在第 $${py}$ 格，每格是 $${sy}$ 米/秒：$${py} \\cdot ${sy} = ${py * sy}$。`,
            ),
          }),
          figure,
          solutionFigures: [
            legFigure(
              drawn.sc,
              pts,
              undefined,
              guides([px, py], `(${px * sx}, ${py * sy})`),
              `At time ${px * sx} the speed is ${py * sy}.`,
              `时刻 ${px * sx} 的速度是 ${py * sy}。`,
            ),
          ],
        };
      },
    },
    {
      id: "acceleration-from-a-speed-time-graph",
      figure: algebraDrawings["speed-time-graphs#acceleration-from-a-speed-time-graph"],
      title: t("Acceleration from the slope", "由斜率求加速度"),
      explanation: t(
        `The **acceleration** is how much the speed changes each second, so it is the change in speed divided by the time taken: the slope of the speed-time graph. Its unit is meters per second per second, $\\text{m/s}^2$. Speeding up gives a positive acceleration, slowing down a negative one, and a constant speed an acceleration of $0$.

From $(4, 12)$ to $(10, 0)$ the speed changes by $0 - 12 = -12$ m/s in $10 - 4 = 6$ s, so the acceleration is $\\frac{-12}{6} = -2\\ \\text{m/s}^2$: the object loses $2$ m/s every second. Check: $12 - 2 \\cdot 6 = 0$.

> **Watch out.** Divide by the time: $-12$ m/s is the change in speed, not the acceleration. Use the changes, not the values at the end: $\\frac{0}{10}$ is not the slope. Keep the sign: slowing down is negative. And on a horizontal segment the acceleration is $0$, whatever the speed is.`,
        `**加速度**表示速度每秒变化多少，所以它等于速度的变化除以所用时间，即速度—时间图的斜率。单位是米每二次方秒，$\\text{m/s}^2$。加速时加速度为正，减速时为负，匀速时为 $0$。

从 $(4, 12)$ 到 $(10, 0)$，速度在 $10 - 4 = 6$ 秒内变化了 $0 - 12 = -12$ 米/秒，所以加速度是 $\\frac{-12}{6} = -2\\ \\text{m/s}^2$：物体每秒减少 $2$ 米/秒。检验：$12 - 2 \\cdot 6 = 0$。

> **注意。** 要除以时间：$-12$ 米/秒是速度的变化，不是加速度。要用变化量，而不是终点的值：$\\frac{0}{10}$ 不是斜率。符号不能丢：减速时为负。在水平线段上，无论速度多大，加速度都是 $0$。`,
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const drawn = motion(rng);
        const { v, sx, sy, legs, figure, intro } = drawn;
        const changing = legs.filter((l) => l.to[1] !== l.from[1]);
        const l = rng.bool(0.85) ? rng.pick(changing) : rng.pick(legs);
        const [t1, t2, v1, v2] = [l.from[0] * sx, l.to[0] * sx, l.from[1] * sy, l.to[1] * sy];
        const a = Q.of(v2 - v1, t2 - t1);
        const dt = t2 - t1;
        const check = `${v1} ${v2 >= v1 ? "+" : "-"} ${num(a.abs())} \\cdot ${dt} = ${v2}`;
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What is the acceleration of ${v.the.en}, in $\\text{m/s}^2$, between $t = ${t1}$ and $t = ${t2}$?`,
              `${intro["zh-CN"]}从 $t = ${t1}$ 到 $t = ${t2}$，${v.the["zh-CN"]}的加速度是多少 $\\text{m/s}^2$？`,
            ),
            answer: a,
            wrong: [a.neg(), v2 - v1, Q.of(v2, t2), ...(v2 === v1 ? [v1] : [Q.of(t2 - t1, v2 - v1)])],
            solution: t(
              `**Step 1: the changes.** The speed goes from $${v1}$ to $${v2}$ m/s, a change of $${v2 - v1}$ m/s, in $${t2} - ${t1} = ${dt}$ s.

**Step 2: divide.** The acceleration is the change in speed per second:${steps(`a = \\frac{${v2} - ${v1}}{${t2} - ${t1}} = ${num(a)}`)}${v2 > v1 ? "It is positive: the speed increases." : v2 < v1 ? "It is negative: the speed decreases." : "The speed does not change, so the acceleration is $0$."}

{{figure 0}}

**Check.** Starting at $${v1}$ m/s and changing by $${num(a)}$ m/s for each of $${dt}$ seconds: $${check}$ m/s.`,
              `**第一步：变化量。** 速度从 $${v1}$ 米/秒变为 $${v2}$ 米/秒，变化了 $${v2 - v1}$ 米/秒，用时 $${t2} - ${t1} = ${dt}$ 秒。

**第二步：相除。** 加速度是每秒速度的变化：${steps(`a = \\frac{${v2} - ${v1}}{${t2} - ${t1}} = ${num(a)}`)}${v2 > v1 ? "它是正的：速度在增加。" : v2 < v1 ? "它是负的：速度在减小。" : "速度不变，所以加速度是 $0$。"}

{{figure 0}}

**检验。** 从 $${v1}$ 米/秒开始，$${dt}$ 秒中每秒变化 $${num(a)}$ 米/秒：$${check}$ 米/秒。`,
            ),
          }),
          figure,
          solutionFigures: [
            legFigure(
              drawn.sc,
              drawn.pts,
              l,
              riseRun(l.from, l.to, [String(t2 - t1), String(v2 - v1)]),
              `The speed changes by ${v2 - v1} in ${t2 - t1}, an acceleration of ${plain(a)}.`,
              `速度在 ${t2 - t1} 内变化 ${v2 - v1}，加速度是 ${plain(a)}。`,
            ),
          ],
        };
      },
    },
  ],
};

/** legArea is the distance covered during a leg of a speed-time graph: the area under it, a rectangle, a triangle or a trapezoid. */
const legArea = (l: Leg, sx: number, sy: number) => Q.of((l.from[1] + l.to[1]) * sy * (l.to[0] - l.from[0]) * sx, 2);

/** areaWork writes the area under a leg. */
function areaWork(l: Leg, sx: number, sy: number): string {
  const [v1, v2, dt] = [l.from[1] * sy, l.to[1] * sy, (l.to[0] - l.from[0]) * sx];
  const area = num(legArea(l, sx, sy));
  if (v1 === v2) return `${v1} \\cdot ${dt} = ${area}`;
  if (v1 === 0 || v2 === 0) return `\\tfrac{1}{2} \\cdot ${dt} \\cdot ${v1 + v2} = ${area}`;
  return `\\tfrac{1}{2} (${v1} + ${v2}) \\cdot ${dt} = ${area}`;
}

/** carAreaIntro draws the car's trip with the region under it shaded in three parts. */
const carAreaIntro: Figure = scaledGraph(
  { x: 2, y: 2, nx: 10, ny: 8, xName: "t", yName: "v" },
  [
    ...carTrip.slice(1).map((to, i) => areaUnder({ from: carTrip[i]!, to })),
    ...polylineMarks(carTrip),
    { kind: "label", at: [1.3, 2], text: "24", dir: "n" },
    { kind: "label", at: [3.5, 3], text: "72", dir: "n" },
    { kind: "label", at: [5.7, 2], text: "36", dir: "n" },
  ],
  "The region under the speed-time graph through (0, 0), (4, 12), (10, 12) and (16, 0), split into a triangle of 24, a rectangle of 72 and a triangle of 36.",
  "经过 (0, 0)、(4, 12)、(10, 12) 和 (16, 0) 的速度—时间图下方的区域，分成面积 24 的三角形、72 的矩形和 36 的三角形。",
);

/** areaSum writes the areas under some legs added up, with their total. */
function areaSum(parts: readonly Leg[], sx: number, sy: number, total: Q): string {
  return parts.length === 1 ? num(total) : `${parts.map((l) => num(legArea(l, sx, sy))).join(" + ")} = ${num(total)}`;
}

export const distanceFromSpeedTimeGraphs: TopicDef = {
  id: "distance-from-speed-time-graphs",
  title: t("Calculating Distance From a Speed-Time Graph", "由速度—时间图计算路程"),
  summary: t(
    "Find the distance traveled as the area under a speed-time graph, made of rectangles, triangles and trapezoids.",
    "把路程看作速度—时间图下方由矩形、三角形和梯形组成的面积来计算。",
  ),
  prerequisites: ["speed-time-graphs", "area-of-trapezoids"],
  encompasses: [
    { topic: "speed-time-graphs", weight: 0.3 },
    { topic: "area-of-trapezoids", weight: 0.5 },
    { topic: "area-of-triangles", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSN.Q.A.1", "CCSS.7.G.B.6"],
  intro: t(
    `A speed-time graph shows how fast something goes, but not directly how far. The distance is hidden in the **area under the graph**. At a steady speed, distance is speed times time, and that product is exactly the area of a rectangle whose height is the speed and whose width is the time. When the speed changes steadily, the same holds, and the region becomes a triangle or a trapezoid, shapes whose areas we already know.

The car from the traffic lights speeds up to $12$ m/s in $4$ s, drives at $12$ m/s for $6$ s, and slows to a stop in $6$ s:

{{figure 0}}

The speed-up is a triangle of $\\frac{1}{2} \\cdot 4 \\cdot 12 = 24$ m, the steady part a rectangle of $12 \\cdot 6 = 72$ m, and the slowing a triangle of $\\frac{1}{2} \\cdot 6 \\cdot 12 = 36$ m. So the car travels $24 + 72 + 36 = 132$ m between the two lights, an average of $\\frac{132}{16} = 8.25$ m/s.`,
    `速度—时间图表示物体有多快，却不直接表示走了多远。路程藏在**图像下方的面积**里。匀速运动时，路程等于速度乘时间，这个乘积恰好就是高为速度、宽为时间的矩形的面积。速度均匀变化时，这一点仍然成立，区域变成三角形或梯形，它们的面积我们已经会算。

从红绿灯起步的汽车在 $4$ 秒内加速到 $12$ 米/秒，以 $12$ 米/秒行驶 $6$ 秒，再在 $6$ 秒内减速停下：

{{figure 0}}

加速阶段是面积 $\\frac{1}{2} \\cdot 4 \\cdot 12 = 24$ 米的三角形，匀速阶段是面积 $12 \\cdot 6 = 72$ 米的矩形，减速阶段是面积 $\\frac{1}{2} \\cdot 6 \\cdot 12 = 36$ 米的三角形。所以汽车在两个红绿灯之间行驶了 $24 + 72 + 36 = 132$ 米，平均速度是 $\\frac{132}{16} = 8.25$ 米/秒。`,
  ),
  introFigures: [carAreaIntro],
  knowledgePoints: [
    {
      id: "distance-at-constant-speed",
      figure: algebraDrawings["distance-from-speed-time-graphs#distance-at-constant-speed"],
      title: t("Distance at a constant speed", "匀速运动的路程"),
      explanation: t(
        `At a constant speed the object covers the same distance every second, so the distance is speed times time. On a speed-time graph a constant speed is a horizontal segment, and the region under it is a **rectangle**: its height is the speed and its width is the time, so its area is the same product. The units agree too: meters per second times seconds is meters.

At $12$ m/s from $t = 5$ to $t = 15$, the rectangle is $15 - 5 = 10$ s wide and $12$ m/s high, so the distance is $12 \\cdot 10 = 120$ m.

> **Watch out.** The width is the length of the time interval, $15 - 5$, not the time at its end, $15$. Multiply the speed by the time; adding them gives nothing meaningful. And the region under a horizontal segment is a whole rectangle, so do not halve it as for a triangle.`,
        `匀速运动时物体每秒走相同的路程，所以路程等于速度乘时间。在速度—时间图上，匀速是一段水平线段，它下方的区域是**矩形**：高是速度，宽是时间，所以面积就是同一个乘积。单位也一致：米/秒乘秒等于米。

以 $12$ 米/秒从 $t = 5$ 运动到 $t = 15$，矩形宽 $15 - 5 = 10$ 秒，高 $12$ 米/秒，所以路程是 $12 \\cdot 10 = 120$ 米。

> **注意。** 宽是时间段的长度 $15 - 5$，不是结束的时刻 $15$。速度要乘以时间，相加没有意义。水平线段下方是完整的矩形，不要像三角形那样减半。`,
      ),
      generate(rng) {
        const drawn = motion(rng);
        const { v, sx, sy, legs, figure, intro } = drawn;
        const l = rng.pick(legs.filter((g) => g.from[1] === g.to[1] && g.from[1] > 0));
        const [t1, t2, sp] = [l.from[0] * sx, l.to[0] * sx, l.from[1] * sy];
        const dist = sp * (t2 - t1);
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} How many meters does ${v.the.en} travel between $t = ${t1}$ and $t = ${t2}$?`,
              `${intro["zh-CN"]}从 $t = ${t1}$ 到 $t = ${t2}$，${v.the["zh-CN"]}行进了多少米？`,
            ),
            answer: dist,
            wrong: [sp * t2, sp + t2 - t1, Q.of(dist, 2)],
            solution: t(
              `**Step 1: the rectangle.** Between $t = ${t1}$ and $t = ${t2}$ the graph is horizontal at $${sp}$ m/s, so the region under it is a rectangle $${sp}$ high and $${t2} - ${t1} = ${t2 - t1}$ wide.

**Step 2: its area.** Speed times time:${steps(`${sp} \\cdot ${t2 - t1} = ${dist}`)}So the distance is $${dist}$ m.

{{figure 0}}

**Check.** Covering $${dist}$ m in $${t2 - t1}$ s is $\\frac{${dist}}{${t2 - t1}} = ${sp}$ m/s, the speed on the graph.`,
              `**第一步：矩形。** 从 $t = ${t1}$ 到 $t = ${t2}$，图像在 $${sp}$ 米/秒处水平，所以下方的区域是高 $${sp}$、宽 $${t2} - ${t1} = ${t2 - t1}$ 的矩形。

**第二步：它的面积。** 速度乘时间：${steps(`${sp} \\cdot ${t2 - t1} = ${dist}`)}所以路程是 $${dist}$ 米。

{{figure 0}}

**检验。** $${t2 - t1}$ 秒走 $${dist}$ 米，速度是 $\\frac{${dist}}{${t2 - t1}} = ${sp}$ 米/秒，正是图像上的速度。`,
            ),
          }),
          figure,
          solutionFigures: [
            legFigure(
              drawn.sc,
              drawn.pts,
              l,
              [areaUnder(l)],
              `The distance is the area of the shaded rectangle, ${dist}.`,
              `距离是涂色长方形的面积 ${dist}。`,
            ),
          ],
        };
      },
    },
    {
      id: "distance-while-changing-speed",
      figure: algebraDrawings["distance-from-speed-time-graphs#distance-while-changing-speed"],
      title: t("Distance while the speed changes", "变速运动的路程"),
      explanation: t(
        `When the speed changes steadily the distance is still the **area under** the graph. While speeding up from rest or slowing to a stop the region is a **triangle**, $\\frac{1}{2} \\cdot \\text{base} \\cdot \\text{height}$. Between two nonzero speeds it is a **trapezoid**, $\\frac{1}{2}(v_1 + v_2) \\cdot t$. Either way it is the average of the starting and the final speed times the time, which makes sense: the speed spends as long above its average as below it.

From $0$ to $10$ m/s in $4$ s covers $\\frac{1}{2} \\cdot 4 \\cdot 10 = 20$ m. From $6$ to $10$ m/s in $4$ s covers $\\frac{1}{2}(6 + 10) \\cdot 4 = 32$ m: more than $6 \\cdot 4 = 24$ and less than $10 \\cdot 4 = 40$.

> **Watch out.** The region is not the whole rectangle under the higher speed: that would count the full speed for the whole time. A trapezoid is not just the triangle on top: the rectangle under the lower speed counts too. And the width is the length of the interval, not the time at its end.`,
        `速度均匀变化时，路程仍然是图像**下方的面积**。从静止加速或减速到停止时，区域是**三角形**，面积是 $\\frac{1}{2} \\cdot \\text{底} \\cdot \\text{高}$。在两个非零速度之间，它是**梯形**，面积是 $\\frac{1}{2}(v_1 + v_2) \\cdot t$。无论哪种，都等于初速度和末速度的平均值乘以时间，这是合理的：速度在平均值上方和下方停留的时间一样长。

$4$ 秒内从 $0$ 加速到 $10$ 米/秒，行进 $\\frac{1}{2} \\cdot 4 \\cdot 10 = 20$ 米。$4$ 秒内从 $6$ 米/秒变为 $10$ 米/秒，行进 $\\frac{1}{2}(6 + 10) \\cdot 4 = 32$ 米：比 $6 \\cdot 4 = 24$ 多，比 $10 \\cdot 4 = 40$ 少。

> **注意。** 这个区域不是较高速度下方的整个矩形：那相当于一直以最高速度运动。梯形也不只是上面的三角形：较低速度下方的矩形也要算上。宽是时间段的长度，不是结束的时刻。`,
      ),
      keyPrerequisites: ["area-of-trapezoids"],
      generate(rng) {
        const drawn = motion(rng);
        const { v, sx, sy, legs, figure, intro } = drawn;
        const l = rng.pick(legs.filter((g) => g.from[1] !== g.to[1]));
        const [t1, t2, v1, v2] = [l.from[0] * sx, l.to[0] * sx, l.from[1] * sy, l.to[1] * sy];
        const d = legArea(l, sx, sy);
        const dt = t2 - t1;
        const [lo, hi] = [Math.min(v1, v2), Math.max(v1, v2)];
        const tri = lo === 0;
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} How many meters does ${v.the.en} travel between $t = ${t1}$ and $t = ${t2}$?`,
              `${intro["zh-CN"]}从 $t = ${t1}$ 到 $t = ${t2}$，${v.the["zh-CN"]}行进了多少米？`,
            ),
            answer: d,
            wrong: [hi * dt, Q.of(Math.abs(v2 - v1) * dt, 2), hi * t2],
            solution: t(
              `**Step 1: the shape.** The speed goes from $${v1}$ to $${v2}$ m/s in $${t2} - ${t1} = ${dt}$ s, so the region under the segment is a ${tri ? `triangle with base $${dt}$ and height $${hi}$` : `trapezoid with parallel sides $${v1}$ and $${v2}$ and width $${dt}$`}.

**Step 2: its area.**${steps(areaWork(l, sx, sy))}So the distance is $${num(d)}$ m.

{{figure 0}}

**Check.** The distance must lie between the rectangles under the lower and the higher speed, $${lo} \\cdot ${dt} = ${lo * dt}$ and $${hi} \\cdot ${dt} = ${hi * dt}$, and exactly halfway: $\\frac{${lo * dt} + ${hi * dt}}{2} = ${num(d)}$.`,
              `**第一步：形状。** 速度在 $${t2} - ${t1} = ${dt}$ 秒内从 $${v1}$ 米/秒变为 $${v2}$ 米/秒，所以线段下方的区域是${tri ? `底为 $${dt}$、高为 $${hi}$ 的三角形` : `两底为 $${v1}$ 和 $${v2}$、高为 $${dt}$ 的梯形`}。

**第二步：它的面积。**${steps(areaWork(l, sx, sy))}所以路程是 $${num(d)}$ 米。

{{figure 0}}

**检验。** 路程应在较低速度和较高速度下方的两个矩形之间，即 $${lo} \\cdot ${dt} = ${lo * dt}$ 和 $${hi} \\cdot ${dt} = ${hi * dt}$ 之间，而且恰好在正中间：$\\frac{${lo * dt} + ${hi * dt}}{2} = ${num(d)}$。`,
            ),
          }),
          figure,
          solutionFigures: [
            legFigure(
              drawn.sc,
              drawn.pts,
              l,
              [areaUnder(l)],
              `The distance is the shaded area, ${plain(d)}.`,
              `距离是涂色部分的面积 ${plain(d)}。`,
            ),
          ],
        };
      },
    },
    {
      id: "total-distance-and-average-speed",
      figure: algebraDrawings["distance-from-speed-time-graphs#total-distance-and-average-speed"],
      title: t("Total distance and average speed", "总路程与平均速度"),
      explanation: t(
        `For a whole trip, split the region under the graph at its corners into rectangles, triangles and trapezoids, find each area, and add them: each part is the distance covered in that stretch of time. The **average speed** is then the total distance divided by the total time, the steady speed that would cover the same distance in the same time.

A trip that speeds up to $10$ m/s in $4$ s, holds it for $10$ s and stops in $6$ s covers $20 + 100 + 30 = 150$ m in $20$ s, an average speed of $\\frac{150}{20} = 7.5$ m/s.

> **Watch out.** Halve the triangles and trapezoids; taking the full rectangle above each part counts too much. Include every part where the speed is not $0$. The average speed is not half the top speed: it is the total distance over the total time, and it is always below the top speed.`,
        `对于整个行程，在图像的拐点处把下方的区域分成矩形、三角形和梯形，求出每部分的面积再相加：每部分都是那段时间里走的路程。**平均速度**就是总路程除以总时间，即在同样的时间内走同样路程所需的匀速速度。

在 $4$ 秒内加速到 $10$ 米/秒，保持 $10$ 秒，再用 $6$ 秒停下，行程是 $20 + 100 + 30 = 150$ 米，用时 $20$ 秒，平均速度是 $\\frac{150}{20} = 7.5$ 米/秒。

> **注意。** 三角形和梯形要乘以 $\\frac{1}{2}$；把每一段都当成完整的矩形会算多。速度不为 $0$ 的每一段都要算上。平均速度不是最高速度的一半：它等于总路程除以总时间，而且总是小于最高速度。`,
      ),
      generate(rng) {
        const drawn = motion(rng);
        const { v, sx, sy, legs, figure, intro } = drawn;
        const parts = legs.filter((l) => l.from[1] + l.to[1] > 0);
        const total = parts.reduce((s, l) => s.add(legArea(l, sx, sy)), Q.zero);
        const T = legs[legs.length - 1]!.to[0] * sx;
        const top = Math.max(...legs.map((l) => l.to[1])) * sy;
        const noHalves = parts.reduce((s, l) => s + Math.max(l.from[1], l.to[1]) * sy * (l.to[0] - l.from[0]) * sx, 0);
        const work = steps(...parts.map((l) => areaWork(l, sx, sy)));
        const sum = areaSum(parts, sx, sy, total);
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `${intro.en} How many meters does ${v.the.en} travel in all?`,
                `${intro["zh-CN"]}${v.the["zh-CN"]}一共行进了多少米？`,
              ),
              answer: total,
              wrong: [top * T, noHalves, total.sub(legArea(parts[0]!, sx, sy))],
              solution: t(
                `**Step 1: split the region.** Cut the region under the graph at its corners into $${parts.length}$ parts and find the area of each:${work}**Step 2: add.** $${sum}$, so the total distance is $${num(total)}$ m.

{{figure 0}}

**Check.** The whole trip fits inside the rectangle of the top speed and the whole time, $${top} \\cdot ${T} = ${top * T}$, and $${num(total)} < ${top * T}$, as it must be.`,
                `**第一步：分割区域。** 在拐点处把图像下方的区域分成 $${parts.length}$ 部分，分别求面积：${work}**第二步：相加。** $${sum}$，所以总路程是 $${num(total)}$ 米。

{{figure 0}}

**检验。** 整个行程在最高速度乘总时间的矩形之内，$${top} \\cdot ${T} = ${top * T}$，而 $${num(total)} < ${top * T}$，符合要求。`,
              ),
            }),
            figure,
            solutionFigures: [
              legFigure(
                drawn.sc,
                drawn.pts,
                undefined,
                parts.map(areaUnder),
                `The total distance is the shaded area, ${plain(total)}.`,
                `总路程是涂色部分的面积 ${plain(total)}。`,
              ),
            ],
          };
        }
        const avg = total.div(Q.of(T));
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What is the average speed of ${v.the.en} over the whole trip, in meters per second?`,
              `${intro["zh-CN"]}${v.the["zh-CN"]}全程的平均速度是每秒多少米？`,
            ),
            answer: avg,
            wrong: [Q.of(top, 2), total, Q.of(noHalves, T)],
            solution: t(
              `**Step 1: the total distance.** The distance is the area under the graph. Split it into parts:${work}In all $${sum}$ m.

**Step 2: divide by the total time.** The trip lasts $${T}$ s:${steps(`\\frac{${num(total)}}{${T}} = ${num(avg)}`)}So the average speed is $${num(avg)}$ m/s.

{{figure 0}}

**Check.** At a steady $${num(avg)}$ m/s for $${T}$ s the distance would be $${num(avg)} \\cdot ${T} = ${num(total)}$ m, the same, and $${num(avg)}$ is below the top speed $${top}$ m/s.`,
              `**第一步：总路程。** 路程是图像下方的面积。把它分成几部分：${work}一共 $${sum}$ 米。

**第二步：除以总时间。** 行程用时 $${T}$ 秒：${steps(`\\frac{${num(total)}}{${T}} = ${num(avg)}`)}所以平均速度是 $${num(avg)}$ 米/秒。

{{figure 0}}

**检验。** 以 $${num(avg)}$ 米/秒匀速运动 $${T}$ 秒，路程是 $${num(avg)} \\cdot ${T} = ${num(total)}$ 米，结果相同，而且 $${num(avg)}$ 小于最高速度 $${top}$ 米/秒。`,
            ),
          }),
          figure,
          solutionFigures: [
            legFigure(
              drawn.sc,
              drawn.pts,
              undefined,
              parts.map(areaUnder),
              `The shaded area is ${plain(total)}; over ${T} that averages ${plain(avg)}.`,
              `涂色面积是 ${plain(total)}，除以 ${T}，平均是 ${plain(avg)}。`,
            ),
          ],
        };
      },
    },
  ],
};

// ─── Two-variable linear inequalities ─────────────────────────────────────────

const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
const toggle: Record<InequalityOp, InequalityOp> = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const strictOps: readonly InequalityOp[] = ["<", ">"];
const allOps: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const isStrict = (op: InequalityOp) => op.length === 1;
const isAbove = (op: InequalityOp) => op[0] === ">";

/** holds tells whether lhs op rhs is true. */
function holds(lhs: Coefficient, op: InequalityOp, rhs: Coefficient): boolean {
  const c = toQ(lhs).cmp(toQ(rhs));
  return { "<": c < 0, "<=": c <= 0, ">": c > 0, ">=": c >= 0 }[op];
}

/** slopes are the slopes of boundary lines: small integers and simple fractions. */
const slopes: readonly Q[] = [1, 2, 3, -1, -2, -3]
  .map((n) => Q.of(n))
  .concat([Q.of(1, 2), Q.of(-1, 2), Q.of(3, 2), Q.of(-3, 2), Q.of(1, 3), Q.of(-1, 3), Q.of(2, 3), Q.of(-2, 3)]);

/** Ineq is y op mx + b. */
interface Ineq {
  readonly m: Q;
  readonly b: number;
  readonly op: InequalityOp;
}

/** ineqLatex writes y op mx + b. */
const ineqLatex = ({ m, b, op }: Ineq) => `y ${relSymbol(op)} ${linear(m, b)}`;

/** reversedLatex writes the same inequality with y on the right: mx + b op' y. */
const reversedLatex = ({ m, b, op }: Ineq) => `${linear(m, b)} ${relSymbol(flip[op])} y`;

/** plain writes LaTeX as plain text for figure descriptions. */
const _plain = (s: string) =>
  s
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥");

/** boundaryMark draws the boundary line y = mx + b, dashed when the inequality is strict. */
const boundaryMark = ({ m, b, op }: Ineq): PlaneMark => ({
  kind: "line",
  a: [0, b],
  b: [1, b + m.toNumber()],
  accent: true,
  dashed: isStrict(op),
});

/** halfPlaneOf is the half-plane of y op mx + b. */
const halfPlaneOf = ({ m, b, op }: Ineq): readonly [number, number, number] =>
  isAbove(op) ? [-m.toNumber(), 1, -b] : [m.toNumber(), -1, b];

const inequalityView: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

/** inequalityGraph draws the solutions of one or more inequalities y op mx + b. */
function inequalityGraph(ineqs: readonly Ineq[]): Figure {
  return {
    svg: plane(inequalityView, [{ kind: "region", halfPlanes: ineqs.map(halfPlaneOf) }, ...ineqs.map(boundaryMark)]),
    alt: t(
      `A shaded region on a coordinate grid, bounded by ${ineqs.length === 1 ? "a line" : "two lines"}.`,
      `坐标网格上的一个涂色区域，边界是${ineqs.length === 1 ? "一条直线" : "两条直线"}。`,
    ),
  };
}

/** randomIneq draws an inequality whose boundary crosses the view. */
function randomIneq(rng: Rng, ops: readonly InequalityOp[]): Ineq {
  return { m: rng.pick(slopes), b: rng.int(-4, 4), op: rng.pick(ops) };
}

/** evalAt writes m · x + b, leaving out a zero b. */
function evalAt(m: Coefficient, x: Coefficient, b: Coefficient): string {
  const B = toQ(b);
  const M = toQ(m);
  const head = M.eq(Q.of(1)) ? paren(x) : M.eq(Q.of(-1)) ? `-${paren(x)}` : `${num(m)} \\cdot ${paren(x)}`;
  return B.isZero() ? head : `${head} ${B.sign() < 0 ? "-" : "+"} ${num(B.abs())}`;
}

/** testPoint draws a point with an integer x where mx + b is an integer, at most 3 above or below the boundary. */
function testPoint(rng: Rng, q: Ineq, onLine: number): [number, Q] {
  const x = Number(q.m.d) * rng.int(-3, 3);
  const y = q.m.mul(Q.of(x)).add(Q.of(q.b));
  return [x, rng.bool(onLine) ? y : y.add(Q.of(rng.nonZero(-3, 3)))];
}

/** checkPoint explains whether (x, y) satisfies y op mx + b. */
function checkPoint(q: Ineq, x: number, y: Q): Text {
  const v = q.m.mul(Q.of(x)).add(Q.of(q.b));
  const ok = holds(y, q.op, v);
  const stmt = `${num(y)} ${relSymbol(q.op)} ${num(v)}`;
  return t(
    `Substitute $x = ${x}$: $${evalAt(q.m, x, q.b)} = ${num(v)}$. The statement $${stmt}$ is ${ok ? "true" : "false"}.`,
    `代入 $x = ${x}$：$${evalAt(q.m, x, q.b)} = ${num(v)}$。$${stmt}$ ${ok ? "成立" : "不成立"}。`,
  );
}

/** descriptions are the four ways to draw the graph of an inequality: dashed or solid boundary, shaded above or below. */
const descriptions: readonly Text[] = [
  t("A dashed boundary line, shaded above", "边界线为虚线，阴影在上方"),
  t("A dashed boundary line, shaded below", "边界线为虚线，阴影在下方"),
  t("A solid boundary line, shaded above", "边界线为实线，阴影在上方"),
  t("A solid boundary line, shaded below", "边界线为实线，阴影在下方"),
];

/** descriptionOf is the index in descriptions of the graph of y op mx + b. */
const descriptionOf = (op: InequalityOp) => (isStrict(op) ? 0 : 2) + (isAbove(op) ? 0 : 1);

/** descriptionReasons says what is wrong with each description of the graph of y op mx + b that does not fit. */
const descriptionReasons = (op: InequalityOp): Reason[] =>
  descriptions.map((d, i) => {
    const line = i < 2 !== isStrict(op);
    const side = (i % 2 === 0) !== isAbove(op);
    const [en, zh] = [
      line
        ? isStrict(op)
          ? "A solid line would count the points on the boundary, and a strict inequality leaves them out."
          : "A dashed line would leave out the points on the boundary, and this inequality includes them."
        : "",
      line ? (isStrict(op) ? "实线会把边界上的点算进去，而严格不等式不包含它们。" : "虚线会漏掉边界上的点，而这个不等式包含它们。") : "",
    ];
    const [sideEn, sideZh] = side
      ? [
          "With $y$ alone on the left, the sign says which side to shade, and this is the other side.",
          "把 $y$ 单独写在左边，不等号决定阴影在哪一侧，而这是另一侧。",
        ]
      : ["", ""];
    return [d.en, [en, sideEn].filter(Boolean).join(" "), `${zh}${sideZh}`];
  });

/** describeGraph explains the boundary and the side of y op mx + b. */
function describeGraph(q: Ineq): Text {
  const line = `y = ${linear(q.m, q.b)}`;
  return t(
    `The boundary is $${line}$, drawn ${isStrict(q.op) ? `dashed because $${relSymbol(q.op)}$ leaves out the points on it` : `solid because $${relSymbol(q.op)}$ includes the points on it`}. The solutions have $y$ ${isAbove(q.op) ? "greater" : "less"} than on the line, so the region ${isAbove(q.op) ? "above" : "below"} it is shaded.`,
    `边界线是 $${line}$，${isStrict(q.op) ? `画成虚线，因为 $${relSymbol(q.op)}$ 不包含线上的点` : `画成实线，因为 $${relSymbol(q.op)}$ 包含线上的点`}。解的 $y$ 值${isAbove(q.op) ? "大于" : "小于"}直线上的值，所以涂${isAbove(q.op) ? "上方" : "下方"}的区域。`,
  );
}

/** inView tells whether a point fits the view of inequality graphs. */
const inView = (x: number, y: number) => Math.abs(x) <= 6 && Math.abs(y) <= 6;

/** ineqPicture draws the boundaries of inequalities y op mx + b, the overlap of their half-planes when shade is true, and more marks. */
function ineqPicture(qs: readonly Ineq[], shade: boolean, more: readonly PlaneMark[], en: string, zh: string): Figure {
  const region: PlaneMark[] = shade ? [{ kind: "region", halfPlanes: qs.map(halfPlaneOf) }] : [];
  return { svg: plane(inequalityView, [...region, ...qs.map(boundaryMark), ...more]), alt: t(en, zh) };
}

/** sideTest is the test point of y op mx + b: the origin, or (0, 1) when the boundary passes through the origin. */
const sideTest = (q: Ineq): [number, number] => (q.b === 0 ? [0, 1] : [0, 0]);

/** sideCheck checks the shaded side of y op mx + b with its test point. */
function sideCheck(q: Ineq): Text {
  const [px, py] = sideTest(q);
  const ok = holds(py, q.op, q.b);
  const above = py > q.b;
  const stmt = `${py} ${relSymbol(q.op)} ${evalAt(q.m, px, q.b)}`;
  return t(
    `**Check.** Test $${pointLatex([px, py])}$, which is not on the boundary: $${stmt}$ is ${ok ? "true" : "false"}. The point lies ${above ? "above" : "below"} the line, so the ${ok ? "side it is on" : "other side"} is the solution side: ${isAbove(q.op) ? "above" : "below"}, as found.`,
    `**检验。** 取不在边界上的点 $${pointLatex([px, py])}$：$${stmt}$ ${ok ? "成立" : "不成立"}。这个点在直线${above ? "上方" : "下方"}，所以${ok ? "它所在的一侧" : "另一侧"}是解所在的一侧：${isAbove(q.op) ? "上方" : "下方"}，与上面一致。`,
  );
}

/** testMark draws the test point of y op mx + b. */
const testMark = (q: Ineq): PlaneMark => ({ kind: "point", at: sideTest(q), tone: "action" });

/** pointSolution checks step by step whether (x, y) solves y op mx + b, shown as shown. It draws no figure, so that oneOfFour can still combine the yes-or-no questions it solves. */
function pointSolution(q: Ineq, x: number, y: Q, shown: string): { solution: Text } {
  const v = q.m.mul(Q.of(x)).add(Q.of(q.b));
  const ok = holds(y, q.op, v);
  const stmt = `${num(y)} ${relSymbol(q.op)} ${num(v)}`;
  const c = y.cmp(v);
  const reversed = shown !== ineqLatex(q);
  const equal =
    c !== 0
      ? t("", "")
      : isStrict(q.op)
        ? t(": the two sides are equal, and a strict inequality does not allow equality", "：两边相等，而严格不等式不允许相等")
        : t(`: the two sides are equal, and $${relSymbol(q.op)}$ allows equality`, `：两边相等，而 $${relSymbol(q.op)}$ 允许相等`);
  const where = [t("below the boundary", "边界下方"), t("on the boundary", "边界上"), t("above the boundary", "边界上方")][c + 1]!;
  const sides = isAbove(q.op) ? t("above", "上方") : t("below", "下方");
  return {
    solution: t(
      `**Step 1: substitute.**${reversed ? ` First write $${shown}$ with $y$ on the left: $${ineqLatex(q)}$.` : ""} Put $x = ${x}$ into the right side: $${evalAt(q.m, x, q.b)} = ${num(v)}$.

**Step 2: compare.** With $y = ${num(y)}$ the inequality reads $${stmt}$, which is ${ok ? "true" : "false"}${equal.en}. So the point ${ok ? "is" : "is not"} a solution.

**Check.** At $x = ${x}$ the boundary is at $y = ${num(v)}$, so the point lies ${where.en}. The solutions lie ${sides.en} the line${isStrict(q.op) ? "" : " or on it"}, which agrees.`,
      `**第一步：代入。**${reversed ? `先把 $${shown}$ 写成 $y$ 在左边的形式：$${ineqLatex(q)}$。` : ""}把 $x = ${x}$ 代入右边：$${evalAt(q.m, x, q.b)} = ${num(v)}$。

**第二步：比较。** $y = ${num(y)}$ 时不等式成为 $${stmt}$，它${ok ? "成立" : "不成立"}${equal["zh-CN"]}。所以这个点${ok ? "是" : "不是"}解。

**检验。** $x = ${x}$ 时边界在 $y = ${num(v)}$ 处，所以这个点在${where["zh-CN"]}。解在直线${sides["zh-CN"]}${isStrict(q.op) ? "" : "或直线上"}，结论一致。`,
    ),
  };
}

/** graphSolution explains step by step the boundary and the side of y op mx + b, shown as shown, with the boundary and then the shaded half-plane. */
function graphSolution(q: Ineq, shown: string): { solution: Text; solutionFigures: Figure[] } {
  const line = `y = ${linear(q.m, q.b)}`;
  const reversed = shown !== ineqLatex(q);
  const above = isAbove(q.op);
  const check = sideCheck(q);
  return {
    solution: t(
      `**Step 1: the boundary.**${reversed ? ` Read the inequality from $y$: $${shown}$ means $${ineqLatex(q)}$.` : ""} The boundary is the line $${line}$. ${isStrict(q.op) ? `It is drawn dashed, because $${relSymbol(q.op)}$ does not allow equality, so the points on it are not solutions.` : `It is drawn solid, because $${relSymbol(q.op)}$ allows equality, so the points on it are solutions.`}

{{figure 0}}

**Step 2: the side.** The solutions have $y$ ${above ? "greater" : "less"} than on the line, so the region ${above ? "above" : "below"} it is shaded.

{{figure 1}}

${check.en}`,
      `**第一步：边界。**${reversed ? `从 $y$ 的角度读：$${shown}$ 就是 $${ineqLatex(q)}$。` : ""}边界是直线 $${line}$。${isStrict(q.op) ? `它画成虚线，因为 $${relSymbol(q.op)}$ 不允许相等，线上的点不是解。` : `它画成实线，因为 $${relSymbol(q.op)}$ 允许相等，线上的点是解。`}

{{figure 0}}

**第二步：哪一侧。** 解的 $y$ 值${above ? "大于" : "小于"}直线上的值，所以涂直线${above ? "上方" : "下方"}的区域。

{{figure 1}}

${check["zh-CN"]}`,
    ),
    solutionFigures: [
      ineqPicture(
        [q],
        false,
        [],
        `The ${isStrict(q.op) ? "dashed" : "solid"} boundary ${_plain(line)}.`,
        `${isStrict(q.op) ? "虚线" : "实线"}边界 ${_plain(line)}。`,
      ),
      ineqPicture(
        [q],
        true,
        [testMark(q)],
        `The region ${above ? "above" : "below"} ${_plain(line)} is shaded; the test point is marked.`,
        `${_plain(line)} ${above ? "上方" : "下方"}的区域涂色，并标出测试点。`,
      ),
    ],
  };
}

/** readSolution reads y op mx + b step by step from its graph, with the slope triangle from the y-intercept. */
function readSolution(q: Ineq): { solution: Text; solutionFigures: Figure[] } {
  const [d, n] = [Number(q.m.d), Number(q.m.n)];
  const forward = Math.abs(q.b + n) <= 6 && d <= 6;
  const to: [number, number] = forward ? [d, q.b + n] : [-d, q.b - n];
  const line = `y = ${linear(q.m, q.b)}`;
  const above = isAbove(q.op);
  const check = sideCheck(q);
  return {
    solution: t(
      `**Step 1: the boundary.** The line crosses the $y$-axis at $(0, ${q.b})$. From there it passes through $${pointLatex(to)}$, a run of $${to[0]}$ and a rise of $${to[1] - q.b}$, so its slope is $${num(q.m)}$ and its equation is $${line}$.

{{figure 0}}

**Step 2: the sign.** The line is ${isStrict(q.op) ? "dashed, so the points on it are not solutions: the sign is $<$ or $>$" : "solid, so the points on it are solutions: the sign is $\\le$ or $\\ge$"}. The shading is ${above ? "above" : "below"} the line, where $y$ is ${above ? "greater" : "less"}, so the inequality is $${ineqLatex(q)}$.

${check.en}`,
      `**第一步：边界。** 直线与 $y$ 轴交于 $(0, ${q.b})$。从这里它经过 $${pointLatex(to)}$，水平变化 $${to[0]}$，竖直变化 $${to[1] - q.b}$，所以斜率是 $${num(q.m)}$，方程是 $${line}$。

{{figure 0}}

**第二步：不等号。** 直线是${isStrict(q.op) ? "虚线，所以线上的点不是解：不等号是 $<$ 或 $>$" : "实线，所以线上的点是解：不等号是 $\\le$ 或 $\\ge$"}。阴影在直线${above ? "上方" : "下方"}，那里 $y$ 值${above ? "更大" : "更小"}，所以不等式是 $${ineqLatex(q)}$。

${check["zh-CN"]}`,
    ),
    solutionFigures: [
      ineqPicture(
        [q],
        true,
        [...riseRun([0, q.b], to), { kind: "point", at: [0, q.b] }, { kind: "point", at: to }, testMark(q)],
        `The boundary through (0, ${q.b}) and (${to[0]}, ${to[1]}), slope ${plain(q.m)}, with the test point.`,
        `边界经过 (0, ${q.b}) 和 (${to[0]}, ${to[1]})，斜率 ${plain(q.m)}，并标出测试点。`,
      ),
    ],
  };
}

/** strictIntro draws y > 2x - 1 with the solution (1, 4) and the point (2, 1) that is not one. */
const strictIntro: Figure = ineqPicture(
  [{ m: Q.of(2), b: -1, op: ">" }],
  true,
  [
    { kind: "point", at: [1, 4], label: "(1, 4)", dir: "nw", tone: "result" },
    { kind: "point", at: [2, 1], label: "(2, 1)", dir: "se", tone: "action" },
    { kind: "point", at: [1, 1], label: "(1, 1)", dir: "se" },
  ],
  "The region above the dashed line y = 2x - 1, with (1, 4) inside it, (2, 1) outside it and (1, 1) on the line.",
  "虚线 y = 2x - 1 上方的区域，(1, 4) 在区域内，(2, 1) 在区域外，(1, 1) 在直线上。",
);

export const graphingStrictLinearInequalities: TopicDef = {
  id: "graphing-strict-linear-inequalities",
  title: t("Graphing Strict Two-Variable Linear Inequalities", "二元一次严格不等式的图像"),
  summary: t(
    "Check solutions of inequalities such as $y < 2x + 1$ and graph them as half-planes with a dashed boundary.",
    "检验 $y < 2x + 1$ 这类不等式的解，并把它们画成以虚线为边界的半平面。",
  ),
  prerequisites: ["slope-intercept-form", "inequalities-and-solutions"],
  encompasses: [{ topic: "inequalities-and-solutions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSA.REI.D.12"],
  intro: t(
    `An inequality in one variable, such as $x > 3$, has a whole ray of solutions on the number line, and we draw an open circle at $3$ because $3$ itself is left out. An equation in two variables, such as $y = 2x - 1$, has a whole line of solutions in the plane. An **inequality in two variables** combines the two ideas: its solutions fill a whole region of the plane, bounded by a line.

Take $y > 2x - 1$. At $x = 1$ the line is at $y = 1$, and the inequality asks for $y > 1$: so $(1, 4)$ is a solution, $(1, 1)$ on the line is not, and neither is $(2, 1)$, below the line at $x = 2$. At every $x$ the solutions are the points above the line:

{{figure 0}}

The solutions form a **half-plane**. The boundary is dashed, like the open circle, because its points make the two sides equal and a strict inequality leaves them out.`,
    `一元不等式（如 $x > 3$）的解在数轴上是一整条射线，我们在 $3$ 处画空心圆，因为 $3$ 本身不是解。二元方程（如 $y = 2x - 1$）的解在平面上是一整条直线。**二元不等式**把两者结合起来：它的解充满平面上以一条直线为边界的整个区域。

看 $y > 2x - 1$。$x = 1$ 时直线在 $y = 1$ 处，不等式要求 $y > 1$：所以 $(1, 4)$ 是解，直线上的 $(1, 1)$ 不是解，$(2, 1)$ 也不是，它在 $x = 2$ 处直线的下方。对每一个 $x$，解都是直线上方的点：

{{figure 0}}

这些解组成一个**半平面**。边界画成虚线，就像空心圆一样，因为线上的点使两边相等，而严格不等式不包含它们。`,
  ),
  introFigures: [strictIntro],
  knowledgePoints: [
    {
      id: "solutions-of-a-two-variable-inequality",
      title: t("Solutions of an inequality in two variables", "二元不等式的解"),
      explanation: t(
        `A **solution** of an inequality in $x$ and $y$, such as $y > 2x - 1$, is an ordered pair that makes it true. To check a point, substitute its $x$ into the right side to find where the boundary is at that $x$, then compare with its $y$.

For $(3, 7)$: $2 \\cdot 3 - 1 = 5$, and $7 > 5$ is true, so $(3, 7)$ is a solution; it lies $2$ above the line. For $(3, 5)$: $5 > 5$ is false, because the two sides are equal and the inequality is **strict**; the point lies on the line.

> **Watch out.** Substitute both coordinates in the right places: $x$ into $2x - 1$, and $y$ on the left. A point on the boundary is not a solution of a strict inequality, since $5 > 5$ is false. When the inequality is written as $2x - 1 < y$, it still means $y > 2x - 1$. And put negative $x$ in parentheses: $2 \\cdot (-3) - 1 = -7$.`,
        `关于 $x$ 和 $y$ 的不等式（如 $y > 2x - 1$）的**解**是使它成立的有序数对。检验一个点时，把它的 $x$ 代入右边，求出边界在这个 $x$ 处的位置，再和它的 $y$ 比较。

对 $(3, 7)$：$2 \\cdot 3 - 1 = 5$，$7 > 5$ 成立，所以 $(3, 7)$ 是解；它在直线上方 $2$ 个单位。对 $(3, 5)$：$5 > 5$ 不成立，因为两边相等，而这个不等式是**严格**不等式；这个点在直线上。

> **注意。** 两个坐标要代入正确的位置：$x$ 代入 $2x - 1$，$y$ 放在左边。边界上的点不是严格不等式的解，因为 $5 > 5$ 不成立。写成 $2x - 1 < y$ 的不等式仍然表示 $y > 2x - 1$。负的 $x$ 要加括号：$2 \\cdot (-3) - 1 = -7$。`,
      ),
      keyPrerequisites: ["inequalities-and-solutions"],
      generate(rng) {
        const q = randomIneq(rng, strictOps);
        const [x, y] = testPoint(rng, q, 0.3);
        const ok = holds(y, q.op, q.m.mul(Q.of(x)).add(Q.of(q.b)));
        const shown = rng.bool(0.3) ? reversedLatex(q) : ineqLatex(q);
        return {
          ...choiceProblem({
            prompt: t(`Is $${pointLatex([x, y])}$ a solution of $${shown}$?`, `$${pointLatex([x, y])}$ 是 $${shown}$ 的解吗？`),
            options: yesNo,
            correct: ok ? 0 : 1,
            solution: t("", ""),
          }),
          ...pointSolution(q, x, y, shown),
        };
      },
    },
    {
      id: "dashed-boundary-and-side",
      figure: algebraDrawings["graphing-strict-linear-inequalities#dashed-boundary-and-side"],
      title: t("The graph of a strict inequality", "严格不等式的图像"),
      explanation: t(
        `At each $x$, the points with $y > mx + b$ are exactly those above the line $y = mx + b$, and those with $y < mx + b$ are below it. So the solutions of a strict inequality form a **half-plane**. To graph it, draw the boundary line $y = mx + b$ **dashed**, because its points make the two sides equal and are not solutions, and shade the side of the solutions.

For $y < -x + 3$: draw $y = -x + 3$ dashed, and shade below it. The origin, $0 < 3$, is on the shaded side, as it should be.

> **Watch out.** A strict inequality has a dashed boundary; a solid line would count the points on it. Read the side with $y$ alone on the left: $2x - 1 < y$ means $y > 2x - 1$, shaded **above**, although the sign looks like "less than".`,
        `在每个 $x$ 处，满足 $y > mx + b$ 的点恰好在直线 $y = mx + b$ 的上方，满足 $y < mx + b$ 的点在它的下方。所以严格不等式的解组成一个**半平面**。作图时，把边界线 $y = mx + b$ 画成**虚线**，因为线上的点使两边相等，不是解，再涂出解所在的一侧。

对 $y < -x + 3$：把 $y = -x + 3$ 画成虚线，涂它的下方。原点满足 $0 < 3$，在涂色的一侧，符合预期。

> **注意。** 严格不等式的边界是虚线；实线会把线上的点算进去。要在 $y$ 单独写在左边时判断哪一侧：$2x - 1 < y$ 就是 $y > 2x - 1$，涂**上方**，尽管不等号看起来像“小于”。`,
      ),
      generate(rng) {
        const q = randomIneq(rng, strictOps);
        const reversed = rng.bool(0.4);
        const shown = reversed ? reversedLatex(q) : ineqLatex(q);
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(`Which describes the graph of $${shown}$?`, `哪一项描述了 $${shown}$ 的图像？`),
              options: descriptions,
              correct: descriptionOf(q.op),
              solution: t("", ""),
            }),
            ...graphSolution(q, shown),
          },
          [...descriptionReasons(q.op)],
        );
      },
    },
    {
      id: "strict-inequality-from-a-graph",
      figure: algebraDrawings["graphing-strict-linear-inequalities#strict-inequality-from-a-graph"],
      title: t("The inequality of a graph", "由图像写不等式"),
      explanation: t(
        `Reading an inequality from its graph undoes graphing it. First find the equation $y = mx + b$ of the boundary: $b$ is where it crosses the $y$-axis, and $m$ is its slope, rise over run between two grid points. A dashed line means a strict inequality. Then the shading picks the sign: above means $y >$, below means $y <$.

A dashed line through $(0, 2)$ and $(1, 4)$ has slope $2$, so it is $y = 2x + 2$. If the region below it is shaded, the graph shows $y < 2x + 2$. The origin is shaded, and indeed $0 < 2$.

> **Watch out.** Shading above means $y >$, not $y <$. A dashed line is strict; $\\le$ or $\\ge$ would need a solid line. A line falling to the right has a negative slope. And read the $y$-intercept with its sign: a line crossing below the origin has a negative $b$.`,
        `由图像读不等式就是作图的逆过程。先求边界线的方程 $y = mx + b$：$b$ 是它与 $y$ 轴的交点，$m$ 是斜率，即两个网格点之间竖直变化与水平变化之比。虚线表示严格不等式。然后由阴影确定不等号：涂上方表示 $y >$，涂下方表示 $y <$。

经过 $(0, 2)$ 和 $(1, 4)$ 的虚线斜率是 $2$，所以它是 $y = 2x + 2$。如果涂的是它下方的区域，图像表示 $y < 2x + 2$。原点在阴影中，确实 $0 < 2$。

> **注意。** 涂上方表示 $y >$，不是 $y <$。虚线表示严格不等式；$\\le$ 或 $\\ge$ 需要实线。向右下降的直线斜率为负。读 $y$ 轴截距时要带上符号：在原点下方穿过 $y$ 轴的直线，$b$ 是负的。`,
      ),
      generate(rng) {
        let q: Ineq;
        do q = randomIneq(rng, strictOps);
        while (q.b === 0);
        const candidates = [q, { ...q, op: flip[q.op] }, { ...q, op: toggle[q.op] }, { ...q, m: q.m.neg() }, { ...q, b: -q.b }];
        const order = [0, ...rng.sample([1, 2, 3, 4], 3)];
        const shuffled = rng.shuffle(order);
        return reasoned(
          {
            ...choiceProblem({
              prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
              options: shuffled.map((i) => same(`$${ineqLatex(candidates[i]!)}$`)),
              correct: shuffled.indexOf(0),
              solution: t("", ""),
            }),
            ...readSolution(q),
            figure: inequalityGraph([q]),
          },
          [
            [
              `$${ineqLatex(candidates[1]!)}$`,
              "The side is reversed: this inequality describes the region on the other side of the line.",
              "方向反了：这个不等式表示的是直线另一侧的区域。",
            ],
            [
              `$${ineqLatex(candidates[2]!)}$`,
              "Solid and dashed are swapped: a strict inequality has a dashed boundary and a non-strict one a solid boundary.",
              "实线和虚线弄反了：严格不等式的边界是虚线，非严格不等式的边界是实线。",
            ],
            [
              `$${ineqLatex(candidates[3]!)}$`,
              "The slope has the wrong sign: this line would tilt the other way.",
              "斜率的符号错了：这条直线的倾斜方向相反。",
            ],
            [
              `$${ineqLatex(candidates[4]!)}$`,
              "The $y$-intercept has the wrong sign: read where the line crosses the $y$-axis.",
              "$y$ 轴截距的符号错了：看直线与 $y$ 轴的交点。",
            ],
          ],
        );
      },
    },
  ],
};

/** nonStrictIntro draws y ≤ -x + 4 with the boundary point (1, 3) and the solution (-1, 2). */
const nonStrictIntro: Figure = ineqPicture(
  [{ m: Q.of(-1), b: 4, op: "<=" }],
  true,
  [
    { kind: "point", at: [1, 3], label: "(1, 3)", dir: "ne", tone: "result" },
    { kind: "point", at: [-1, 2], label: "(-1, 2)", dir: "sw", tone: "result" },
  ],
  "The region on and below the solid line y = -x + 4, with (1, 3) on the line and (-1, 2) below it.",
  "实线 y = -x + 4 上及其下方的区域，(1, 3) 在直线上，(-1, 2) 在直线下方。",
);

export const graphingNonStrictLinearInequalities: TopicDef = {
  id: "graphing-non-strict-linear-inequalities",
  title: t("Graphing Non-Strict Two-Variable Linear Inequalities", "二元一次非严格不等式的图像"),
  summary: t(
    "Graph inequalities with $\\le$ and $\\ge$ using a solid boundary, and tell strict and non-strict inequalities apart on a graph.",
    "用实线边界画出含 $\\le$ 和 $\\ge$ 的不等式，并在图像上区分严格与非严格不等式。",
  ),
  prerequisites: ["graphing-strict-linear-inequalities"],
  encompasses: [{ topic: "graphing-strict-linear-inequalities", weight: 0.7 }],
  xp: 12,
  standards: ["CCSS.HSA.REI.D.12"],
  intro: t(
    `A strict inequality such as $y < -x + 4$ is graphed as a half-plane with a dashed boundary, because the points on the line make the two sides equal and are left out. With $\\le$ or $\\ge$ equality is allowed, just as $x \\le 3$ on a number line gets a filled circle at $3$. So the points of the line are solutions too, and the boundary is drawn **solid**.

For $y \\le -x + 4$, the point $(1, 3)$ gives $3 \\le 3$, which is true, so it is a solution on the boundary; $(-1, 2)$ gives $2 \\le 5$ and is a solution below it:

{{figure 0}}

The side is chosen exactly as before; only the boundary changes.`,
    `严格不等式（如 $y < -x + 4$）的图像是以虚线为边界的半平面，因为线上的点使两边相等，不算在内。用 $\\le$ 或 $\\ge$ 时允许相等，就像数轴上 $x \\le 3$ 在 $3$ 处画实心圆一样。所以直线上的点也是解，边界画成**实线**。

对 $y \\le -x + 4$，点 $(1, 3)$ 给出 $3 \\le 3$，成立，所以它是边界上的解；$(-1, 2)$ 给出 $2 \\le 5$，是边界下方的解：

{{figure 0}}

选哪一侧与之前完全相同，变的只是边界。`,
  ),
  introFigures: [nonStrictIntro],
  knowledgePoints: [
    {
      id: "points-on-the-boundary",
      title: t("Points on the boundary", "边界上的点"),
      explanation: t(
        `A point on the boundary line $y = mx + b$ makes the two sides equal. So whether it is a solution depends only on whether the sign allows equality: it is a solution of $y \\le mx + b$ and of $y \\ge mx + b$, but not of $y < mx + b$ or $y > mx + b$. Points off the line are checked as before.

For $y \\le -x + 4$, the point $(1, 3)$ gives $-1 + 4 = 3$ and $3 \\le 3$, which is true. For $y < -x + 4$ the same point gives $3 < 3$, which is false.

> **Watch out.** Equal sides satisfy $\\le$ and $\\ge$; do not reject a boundary point of a non-strict inequality. But they do not satisfy $<$ or $>$. Read a reversed inequality from $y$: $-x + 4 \\ge y$ means $y \\le -x + 4$.`,
        `边界线 $y = mx + b$ 上的点使两边相等。所以它是不是解只取决于不等号是否允许相等：它是 $y \\le mx + b$ 和 $y \\ge mx + b$ 的解，但不是 $y < mx + b$ 或 $y > mx + b$ 的解。不在直线上的点照常检验。

对 $y \\le -x + 4$，点 $(1, 3)$ 给出 $-1 + 4 = 3$，$3 \\le 3$ 成立。对 $y < -x + 4$，同一个点给出 $3 < 3$，不成立。

> **注意。** 两边相等时满足 $\\le$ 和 $\\ge$；不要把非严格不等式边界上的点排除掉。但两边相等不满足 $<$ 或 $>$。反向书写的不等式要从 $y$ 的角度读：$-x + 4 \\ge y$ 就是 $y \\le -x + 4$。`,
      ),
      generate(rng) {
        const q = randomIneq(rng, allOps);
        const [x, y] = testPoint(rng, q, 0.5);
        const ok = holds(y, q.op, q.m.mul(Q.of(x)).add(Q.of(q.b)));
        const shown = rng.bool(0.3) ? reversedLatex(q) : ineqLatex(q);
        return {
          ...choiceProblem({
            prompt: t(`Is $${pointLatex([x, y])}$ a solution of $${shown}$?`, `$${pointLatex([x, y])}$ 是 $${shown}$ 的解吗？`),
            options: yesNo,
            correct: ok ? 0 : 1,
            solution: t("", ""),
          }),
          ...pointSolution(q, x, y, shown),
        };
      },
    },
    {
      id: "solid-or-dashed",
      title: t("Solid or dashed", "实线还是虚线"),
      explanation: t(
        `Two choices make the graph of an inequality. The boundary is **solid** for $\\le$ and $\\ge$, whose solutions include the points of the line, and **dashed** for $<$ and $>$, whose solutions do not. The side is shaded as before: above for $y >$ or $y \\ge$, below for $y <$ or $y \\le$.

So $y \\ge \\frac{1}{2}x - 3$ has a solid boundary $y = \\frac{1}{2}x - 3$ and is shaded above, while $y < \\frac{1}{2}x - 3$ has a dashed one and is shaded below.

> **Watch out.** The kind of line and the side are separate: $\\le$ is solid **and** below. Do not let the equality part change the side. And with $y$ on the right, first rewrite: $\\frac{1}{2}x - 3 \\le y$ means $y \\ge \\frac{1}{2}x - 3$, shaded above.`,
        `不等式的图像由两个选择决定。对 $\\le$ 和 $\\ge$，解包含直线上的点，边界画成**实线**；对 $<$ 和 $>$，解不包含它们，边界画成**虚线**。涂哪一侧与之前相同：$y >$ 或 $y \\ge$ 涂上方，$y <$ 或 $y \\le$ 涂下方。

所以 $y \\ge \\frac{1}{2}x - 3$ 的边界 $y = \\frac{1}{2}x - 3$ 是实线，涂上方；而 $y < \\frac{1}{2}x - 3$ 的边界是虚线，涂下方。

> **注意。** 线的虚实和涂哪一侧是两回事：$\\le$ 是实线**并且**涂下方。不要因为包含等号就改变涂色的一侧。$y$ 在右边时先改写：$\\frac{1}{2}x - 3 \\le y$ 就是 $y \\ge \\frac{1}{2}x - 3$，涂上方。`,
      ),
      generate(rng) {
        const q = randomIneq(rng, allOps);
        const reversed = rng.bool(0.4);
        const shown = reversed ? reversedLatex(q) : ineqLatex(q);
        return reasoned(
          {
            ...choiceProblem({
              prompt: t(`Which describes the graph of $${shown}$?`, `哪一项描述了 $${shown}$ 的图像？`),
              options: descriptions,
              correct: descriptionOf(q.op),
              solution: t("", ""),
            }),
            ...graphSolution(q, shown),
          },
          [...descriptionReasons(q.op)],
        );
      },
    },
    {
      id: "inequality-from-a-graph",
      figure: algebraDrawings["graphing-non-strict-linear-inequalities#inequality-from-a-graph"],
      title: t("Reading any inequality from a graph", "由图像读出不等式"),
      explanation: t(
        `An inequality is read from its graph by combining three observations, one for each part of $y \\;\\square\\; mx + b$. The boundary gives $mx + b$: its $y$-intercept and its slope. Whether it is solid or dashed says whether equality is allowed. And whether the shading is above or below says whether $y$ is greater or less.

A solid line through $(0, -1)$ and $(2, 0)$ has slope $\\frac{1}{2}$, so it is $y = \\frac{1}{2}x - 1$; with the shading above, the graph shows $y \\ge \\frac{1}{2}x - 1$.

> **Watch out.** Each observation decides one thing, so check all three: the side alone does not tell $>$ from $\\ge$, and the line alone does not tell $\\ge$ from $\\le$. Getting both wrong swaps $\\ge$ for $<$. And find the slope from grid points, keeping its sign.`,
        `由图像读不等式要综合三点观察，分别对应 $y \\;\\square\\; mx + b$ 的三个部分。边界给出 $mx + b$：它的 $y$ 轴截距和斜率。实线还是虚线说明是否允许相等。阴影在上方还是下方说明 $y$ 更大还是更小。

经过 $(0, -1)$ 和 $(2, 0)$ 的实线斜率是 $\\frac{1}{2}$，所以它是 $y = \\frac{1}{2}x - 1$；阴影在上方，图像表示 $y \\ge \\frac{1}{2}x - 1$。

> **注意。** 每一点观察只决定一件事，所以三点都要检查：只看阴影分不清 $>$ 和 $\\ge$，只看线分不清 $\\ge$ 和 $\\le$。两点都弄错会把 $\\ge$ 写成 $<$。斜率要用网格点求，并保留符号。`,
      ),
      generate(rng) {
        let q: Ineq;
        do q = randomIneq(rng, allOps);
        while (q.b === 0);
        const candidates = [
          q,
          { ...q, op: flip[q.op] },
          { ...q, op: toggle[q.op] },
          { ...q, op: flip[toggle[q.op]] },
          { ...q, m: q.m.neg() },
        ];
        const order = rng.shuffle([0, 1, 2, 3, 4]);
        return reasoned(
          {
            ...choiceProblem({
              prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
              options: order.map((i) => same(`$${ineqLatex(candidates[i]!)}$`)),
              correct: order.indexOf(0),
              solution: t("", ""),
            }),
            ...readSolution(q),
            figure: inequalityGraph([q]),
          },
          [
            [
              `$${ineqLatex(candidates[1]!)}$`,
              "The side is reversed: this inequality describes the region on the other side of the line.",
              "方向反了：这个不等式表示的是直线另一侧的区域。",
            ],
            [
              `$${ineqLatex(candidates[2]!)}$`,
              "Solid and dashed are swapped: a strict inequality has a dashed boundary and a non-strict one a solid boundary.",
              "实线和虚线弄反了：严格不等式的边界是虚线，非严格不等式的边界是实线。",
            ],
            [`$${ineqLatex(candidates[3]!)}$`, "Both the side and the kind of boundary are swapped.", "阴影的一侧和边界线的虚实都弄反了。"],
            [
              `$${ineqLatex(candidates[4]!)}$`,
              "The slope has the wrong sign: this line would tilt the other way.",
              "斜率的符号错了：这条直线的倾斜方向相反。",
            ],
          ],
        );
      },
    },
  ],
};

/** standardIntro draws 2x - 3y < 6, which is y > (2/3)x - 2, with the origin as a test point. */
const standardIntro: Figure = ineqPicture(
  [{ m: Q.of(2, 3), b: -2, op: ">" }],
  true,
  [
    { kind: "point", at: [3, 0], label: "(3, 0)", dir: "se" },
    { kind: "point", at: [0, -2], label: "(0, -2)", dir: "se" },
    { kind: "point", at: [0, 0], tone: "action" },
  ],
  "The region above the dashed line 2x - 3y = 6 through (3, 0) and (0, -2), containing the origin.",
  "经过 (3, 0) 和 (0, -2) 的虚线 2x - 3y = 6 上方的区域，原点在其中。",
);

export const furtherGraphingLinearInequalities: TopicDef = {
  id: "further-graphing-linear-inequalities",
  title: t("Further Graphing of Two-Variable Linear Inequalities", "二元一次不等式图像进阶"),
  summary: t(
    "Graph inequalities in standard form and with horizontal or vertical boundaries, using a test point or by solving for $y$.",
    "通过解出 $y$ 或代入测试点，画出标准式不等式和边界为水平线或竖直线的不等式。",
  ),
  prerequisites: ["graphing-non-strict-linear-inequalities", "properties-of-lines-in-standard-form", "solving-multi-step-inequalities"],
  encompasses: [
    { topic: "graphing-non-strict-linear-inequalities", weight: 0.5 },
    { topic: "solving-multi-step-inequalities", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.D.12"],
  intro: t(
    `When an inequality is written as $y > mx + b$, the sign tells at once which side to shade. Inequalities often come in other forms, though, such as $2x - 3y < 6$, and there the sign alone can mislead: here "less than" turns out to mean shading **above**. There are two reliable ways to decide. Solve for $y$, remembering that dividing by a negative number reverses the sign. Or try a **test point** that is not on the boundary.

For $2x - 3y < 6$, subtracting $2x$ and dividing by $-3$ gives $y > \\frac{2}{3}x - 2$, so the region above the dashed line is shaded. The origin agrees: $2 \\cdot 0 - 3 \\cdot 0 = 0 < 6$ is true, and the origin lies above the line:

{{figure 0}}

The same ideas also handle boundaries that are horizontal or vertical, such as $x \\ge 2$.`,
    `不等式写成 $y > mx + b$ 时，不等号立刻告诉我们涂哪一侧。但不等式常常以别的形式出现，例如 $2x - 3y < 6$，这时只看不等号可能会误导：这里的“小于”其实表示涂**上方**。有两种可靠的方法来判断。解出 $y$，记住除以负数时不等号要反向。或者取一个不在边界上的**测试点**。

对 $2x - 3y < 6$，两边减去 $2x$ 再除以 $-3$，得到 $y > \\frac{2}{3}x - 2$，所以涂虚线上方的区域。原点也说明了这一点：$2 \\cdot 0 - 3 \\cdot 0 = 0 < 6$ 成立，而原点在直线上方：

{{figure 0}}

同样的思路也能处理水平或竖直的边界，例如 $x \\ge 2$。`,
  ),
  introFigures: [standardIntro],
  knowledgePoints: [
    {
      id: "solving-for-y-first",
      figure: algebraDrawings["further-graphing-linear-inequalities#solving-for-y-first"],
      title: t("Inequalities in standard form", "标准式不等式"),
      explanation: t(
        `To see which side of the boundary to shade for $ax + by < c$, solve for $y$, as for an equation, until it has the form $y > mx + k$ or $y < mx + k$. Moving terms keeps the sign. Dividing by a **positive** coefficient of $y$ keeps it too, but dividing by a **negative** one reverses it, because multiplying by a negative number reverses the order of numbers.

$$2x - 3y < 6 \\;\\Rightarrow\\; -3y < -2x + 6 \\;\\Rightarrow\\; y > \\tfrac{2}{3}x - 2,$$

so the graph has a dashed boundary and is shaded above. The origin agrees: $0 < 6$.

> **Watch out.** Reverse the sign only when dividing or multiplying by a negative number, not when subtracting: $3y \\ge -2x + 6$ divided by $3$ stays $\\ge$. Do not read the side from the sign of $ax + by < c$ directly. And dividing never changes solid to dashed: $\\le$ becomes $\\ge$, still solid.`,
        `要判断 $ax + by < c$ 涂边界的哪一侧，就像解方程一样解出 $y$，直到化成 $y > mx + k$ 或 $y < mx + k$ 的形式。移项时不等号不变。除以 $y$ 的**正**系数时不等号也不变，但除以**负**系数时要反向，因为乘以负数会颠倒数的大小顺序。

$$2x - 3y < 6 \\;\\Rightarrow\\; -3y < -2x + 6 \\;\\Rightarrow\\; y > \\tfrac{2}{3}x - 2,$$

所以图像的边界线是虚线，涂上方。原点也符合：$0 < 6$。

> **注意。** 只有除以或乘以负数时才把不等号反向，移项时不反向：$3y \\ge -2x + 6$ 除以 $3$ 后仍是 $\\ge$。不要直接由 $ax + by < c$ 的不等号判断涂哪一侧。除法也不会把实线变成虚线：$\\le$ 变成 $\\ge$，仍是实线。`,
      ),
      keyPrerequisites: ["solving-multi-step-inequalities"],
      generate(rng) {
        const [a, b] = [rng.nonZero(-6, 6), rng.pick([-5, -4, -3, -2, 2, 3, 4, 5])];
        const c = rng.int(-12, 12);
        const op = rng.pick(allOps);
        const solved: Ineq = { m: Q.of(-a, b), b: 0, op: b < 0 ? flip[op] : op };
        const rhs = linear(Q.of(-a, b), Q.of(c, b));
        const shown = `${poly([a, "x"], [b, "y"])} ${relSymbol(op)} ${c}`;
        const final = `y ${relSymbol(solved.op)} ${rhs}`;
        const k = c / b;
        const m = -a / b;
        const above = isAbove(solved.op);
        const [px, py] = c === 0 ? [0, 1] : [0, 0];
        const lhsAt = b * py;
        const okTest = holds(lhsAt, op, c);
        const testAbove = py > k;
        const testStmt = `${a} \\cdot ${px} ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${py} = ${lhsAt}`;
        const hp: readonly [number, number, number] = above ? [-m, 1, -k] : [m, -1, k];
        return {
          ...choiceProblem({
            prompt: t(`Which describes the graph of $${shown}$?`, `哪一项描述了 $${shown}$ 的图像？`),
            options: descriptions,
            correct: descriptionOf(solved.op),
            solution: t(
              `**Step 1: solve for $y$.** Move the term $${poly([a, "x"])}$ to the right side; moving a term does not change the sign:${steps(`${poly([b, "y"])} ${relSymbol(op)} ${linear(-a, c)}`)}**Step 2: divide by $${b}$.** ${b < 0 ? `$${b}$ is negative, so the sign reverses:` : `$${b}$ is positive, so the sign stays:`}${steps(final)}**Step 3: the graph.** The boundary $y = ${rhs}$ is ${isStrict(op) ? "dashed" : "solid"}, and the region ${above ? "above" : "below"} it is shaded.

{{figure 0}}

**Check.** Test $${pointLatex([px, py])}$ in the original inequality: $${testStmt}$, and $${lhsAt} ${relSymbol(op)} ${c}$ is ${okTest ? "true" : "false"}. The point lies ${testAbove ? "above" : "below"} the boundary, so the ${okTest ? "side it is on" : "other side"} is shaded: ${above ? "above" : "below"}, as found.`,
              `**第一步：解出 $y$。** 把 $${poly([a, "x"])}$ 这一项移到右边；移项不改变不等号：${steps(`${poly([b, "y"])} ${relSymbol(op)} ${linear(-a, c)}`)}**第二步：除以 $${b}$。** ${b < 0 ? `$${b}$ 是负数，所以不等号反向：` : `$${b}$ 是正数，所以不等号不变：`}${steps(final)}**第三步：图像。** 边界 $y = ${rhs}$ 是${isStrict(op) ? "虚线" : "实线"}，涂它${above ? "上方" : "下方"}的区域。

{{figure 0}}

**检验。** 把 $${pointLatex([px, py])}$ 代入原不等式：$${testStmt}$，而 $${lhsAt} ${relSymbol(op)} ${c}$ ${okTest ? "成立" : "不成立"}。这个点在边界${testAbove ? "上方" : "下方"}，所以涂${okTest ? "它所在的一侧" : "另一侧"}：${above ? "上方" : "下方"}，与上面一致。`,
            ),
          }),
          solutionFigures: [
            {
              svg: plane(inequalityView, [
                { kind: "region", halfPlanes: [hp] },
                { kind: "line", a: [0, k], b: [1, k + m], accent: true, dashed: isStrict(op) },
                { kind: "point", at: [px, py], tone: "action" },
              ]),
              alt: t(
                `The region ${above ? "above" : "below"} the ${isStrict(op) ? "dashed" : "solid"} line ${_plain(`y = ${rhs}`)}, with the test point.`,
                `${isStrict(op) ? "虚" : "实"}线 ${_plain(`y = ${rhs}`)} ${above ? "上方" : "下方"}的区域，并标出测试点。`,
              ),
            },
          ],
        };
      },
    },
    {
      id: "horizontal-and-vertical-boundaries",
      figure: algebraDrawings["further-graphing-linear-inequalities#horizontal-and-vertical-boundaries"],
      title: t("Horizontal and vertical boundaries", "水平和竖直的边界"),
      explanation: t(
        `An inequality in one variable can be graphed in the plane too: it limits one coordinate and leaves the other free. The solutions of $x > 2$ are all points whose $x$-coordinate is greater than $2$, whatever their $y$: the region to the **right** of the vertical line $x = 2$, drawn dashed. The solutions of $y \\le -1$ are the points on or **below** the horizontal line $y = -1$, drawn solid.

To read such a graph, name the line ($x = k$ if vertical, $y = k$ if horizontal), decide solid or dashed, and see which side is shaded: right or above means greater, left or below means less.

> **Watch out.** $x = 2$ is a vertical line, not a horizontal one, and $x > 2$ is to its right, not above it. Do not swap the variables: a horizontal boundary belongs to $y$. And solid or dashed follows the sign as always.`,
        `一元不等式也可以在平面上作图：它限制一个坐标，另一个坐标任意。$x > 2$ 的解是所有横坐标大于 $2$ 的点，无论 $y$ 是多少：即竖直线 $x = 2$ **右侧**的区域，边界画成虚线。$y \\le -1$ 的解是水平线 $y = -1$ 上及其**下方**的点，边界画成实线。

读这样的图时，先说出这条线（竖直线是 $x = k$，水平线是 $y = k$），再判断实线还是虚线，最后看涂的是哪一侧：右侧或上方表示大于，左侧或下方表示小于。

> **注意。** $x = 2$ 是竖直线而不是水平线，$x > 2$ 在它的右侧，而不是上方。不要把变量弄混：水平的边界属于 $y$。实线或虚线照常由不等号决定。`,
      ),
      generate(rng) {
        const v = rng.bool() ? "x" : "y";
        const k = rng.nonZero(-5, 5);
        const op = rng.pick(allOps);
        const sign = isAbove(op) ? 1 : -1;
        const hp: readonly [number, number, number] = v === "x" ? [sign, 0, -sign * k] : [0, sign, -sign * k];
        const line: PlaneMark = {
          kind: "line",
          a: v === "x" ? [k, 0] : [0, k],
          b: v === "x" ? [k, 1] : [1, k],
          accent: true,
          dashed: isStrict(op),
        };
        const other = v === "x" ? "y" : "x";
        const candidates = [
          `${v} ${relSymbol(op)} ${k}`,
          `${v} ${relSymbol(flip[op])} ${k}`,
          `${v} ${relSymbol(toggle[op])} ${k}`,
          `${other} ${relSymbol(op)} ${k}`,
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const side = v === "x" ? (sign > 0 ? ["right", "右侧"] : ["left", "左侧"]) : sign > 0 ? ["above", "上方"] : ["below", "下方"];
        const where = side[0] === "above" || side[0] === "below" ? side[0] : `to the ${side[0]} of`;
        const originOk = holds(0, op, k);
        return {
          ...choiceProblem({
            prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
            options: order.map((i) => same(`$${candidates[i]!}$`)),
            correct: order.indexOf(0),
            solution: t(
              `**Step 1: the boundary.** The boundary is the ${v === "x" ? "vertical" : "horizontal"} line $${v} = ${k}$, where every point has ${v === "x" ? "$x$-coordinate" : "$y$-coordinate"} $${k}$. It is ${isStrict(op) ? "dashed, so the sign is strict" : "solid, so the sign allows equality"}.

**Step 2: the side.** The region ${where} it is shaded, where $${v}$ is ${sign > 0 ? "greater" : "less"} than $${k}$: the graph shows $${candidates[0]}$.

**Check.** The origin has $${v} = 0$, and $0 ${relSymbol(op)} ${k}$ is ${originOk ? "true" : "false"}; in the graph the origin is ${originOk ? "inside" : "outside"} the shaded region, which agrees.`,
              `**第一步：边界。** 边界是${v === "x" ? "竖直" : "水平"}线 $${v} = ${k}$，线上每个点的${v === "x" ? "横" : "纵"}坐标都是 $${k}$。它是${isStrict(op) ? "虚线，所以是严格不等号" : "实线，所以不等号允许相等"}。

**第二步：哪一侧。** 涂的是它${side[1]}的区域，那里 $${v}$ ${sign > 0 ? "大于" : "小于"} $${k}$：图像表示 $${candidates[0]}$。

**检验。** 原点的 $${v} = 0$，而 $0 ${relSymbol(op)} ${k}$ ${originOk ? "成立" : "不成立"}；图中原点${originOk ? "在" : "不在"}阴影区域内，结论一致。`,
            ),
          }),
          figure: {
            svg: plane(inequalityView, [{ kind: "region", halfPlanes: [hp] }, line]),
            alt: t(
              `A shaded region on a coordinate grid, ${side[0]} the ${isStrict(op) ? "dashed" : "solid"} line ${v} = ${k}.`,
              `坐标网格上的一个涂色区域，在${isStrict(op) ? "虚" : "实"}线 ${v} = ${k} 的${side[1]}。`,
            ),
          },
        };
      },
    },
    {
      id: "standard-form-from-a-graph-with-a-test-point",
      title: t("Using a test point", "用测试点判断"),
      explanation: t(
        `All the points on one side of the boundary behave alike: either all of them are solutions or none is. So one **test point** not on the boundary decides the side. If it satisfies the inequality, its whole side is shaded; otherwise the other side is. The origin $(0, 0)$ is the easiest test point when the boundary does not pass through it, because every term with $x$ or $y$ becomes $0$.

For $3x + 2y \\ge 6$, the origin gives $0 \\ge 6$, false, so the side **away** from the origin is shaded. The point $(2, 3)$, on that side, gives $12 \\ge 6$, true.

> **Watch out.** A false result means shade the **other** side, not that there is no shading. Never test a point on the boundary; it cannot tell the sides apart. And the test point decides only the side: solid or dashed still comes from the sign.`,
        `边界同一侧的点表现相同：要么都是解，要么都不是。所以取一个不在边界上的**测试点**就能决定涂哪一侧。如果它满足不等式，就涂它所在的一侧；否则涂另一侧。边界不经过原点时，原点 $(0, 0)$ 是最方便的测试点，因为含 $x$ 或 $y$ 的项都变成 $0$。

对 $3x + 2y \\ge 6$，原点给出 $0 \\ge 6$，不成立，所以涂**不含**原点的一侧。在那一侧的点 $(2, 3)$ 给出 $12 \\ge 6$，成立。

> **注意。** 结果不成立表示涂**另一侧**，而不是不涂。不要用边界上的点做测试点，它分不出两侧。测试点只决定涂哪一侧：实线还是虚线仍由不等号决定。`,
      ),
      generate(rng) {
        const [p, q] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        let [A, B, C] = [q, p, p * q];
        const g = gcd(gcd(A, B), C);
        [A, B, C] = [A / g, B / g, C / g];
        if (A < 0) [A, B, C] = [-A, -B, -C];
        const side = rng.sign();
        const strict = rng.bool();
        const op: InequalityOp = side > 0 ? (strict ? ">" : ">=") : strict ? "<" : "<=";
        const lhs = poly([A, "x"], [B, "y"]);
        const hp: readonly [number, number, number] = [side * A, side * B, -side * C];
        const originOk = holds(0, op, C);
        const order = rng.shuffle([0, 1, 2, 3]);
        const opsByIndex: InequalityOp[] = [op, flip[op], toggle[op], flip[toggle[op]]];
        const far = A * p + B * q;
        const farOk = holds(far, op, C);
        return {
          ...choiceProblem({
            prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
            options: order.map((i) => same(`$${lhs} ${relSymbol(opsByIndex[i]!)} ${C}$`)),
            correct: order.indexOf(0),
            solution: t(
              `**Step 1: the boundary.** The line passes through $${pointLatex([p, 0])}$ and $${pointLatex([0, q])}$, and both satisfy $${lhs} = ${C}$: $${A} \\cdot ${paren(p)} = ${A * p}$ and $${B} \\cdot ${paren(q)} = ${B * q}$. It is drawn ${strict ? "dashed, so the sign is $<$ or $>$" : "solid, so the sign is $\\le$ or $\\ge$"}.

**Step 2: the test point.** The origin is not on the line and is ${originOk ? "inside" : "outside"} the shaded region. At the origin $${lhs}$ is $0$, and $0 ${relSymbol(op)} ${C}$ is ${originOk ? "true" : "false"}, so the inequality is $${lhs} ${relSymbol(op)} ${C}$.

**Check.** The point $${pointLatex([p, q])}$ lies on the other side of the line from the origin: there $${lhs}$ is $${far}$, and $${far} ${relSymbol(op)} ${C}$ is ${farOk ? "true" : "false"}, the opposite result, as it should be.`,
              `**第一步：边界。** 直线经过 $${pointLatex([p, 0])}$ 和 $${pointLatex([0, q])}$，两点都满足 $${lhs} = ${C}$：$${A} \\cdot ${paren(p)} = ${A * p}$，$${B} \\cdot ${paren(q)} = ${B * q}$。它画成${strict ? "虚线，所以不等号是 $<$ 或 $>$" : "实线，所以不等号是 $\\le$ 或 $\\ge$"}。

**第二步：测试点。** 原点不在直线上，并且${originOk ? "在" : "不在"}阴影区域内。在原点处 $${lhs}$ 等于 $0$，而 $0 ${relSymbol(op)} ${C}$ ${originOk ? "成立" : "不成立"}，所以不等式是 $${lhs} ${relSymbol(op)} ${C}$。

**检验。** 点 $${pointLatex([p, q])}$ 与原点在直线的两侧：在这里 $${lhs}$ 等于 $${far}$，而 $${far} ${relSymbol(op)} ${C}$ ${farOk ? "成立" : "不成立"}，结果相反，符合预期。`,
            ),
          }),
          figure: {
            svg: plane(inequalityView, [
              { kind: "region", halfPlanes: [hp] },
              { kind: "line", a: [p, 0], b: [0, q], accent: true, dashed: strict },
              { kind: "point", at: [p, 0] },
              { kind: "point", at: [0, q] },
            ]),
            alt: t(
              `A shaded region on a coordinate grid, bounded by a line through (${p}, 0) and (0, ${q}).`,
              `坐标网格上的一个涂色区域，边界是经过 (${p}, 0) 和 (0, ${q}) 的直线。`,
            ),
          },
        };
      },
    },
  ],
};

/** systemLatex writes inequalities as a system. */
const systemLatex = (lines: readonly string[]) => `\\begin{cases} ${lines.join(" \\\\ ")} \\end{cases}`;

/** crossingPair draws two inequalities whose boundaries have integer intercepts and cross at a grid point near the origin. */
function crossingPair(rng: Rng, ops: readonly InequalityOp[]): [Ineq, Ineq] {
  let x0: number;
  let y0: number;
  let m1: Q;
  let m2: Q;
  let b1: Q;
  let b2: Q;
  do {
    [x0, y0] = [rng.int(-3, 3), rng.int(-3, 3)];
    [m1, m2] = rng.sample(slopes, 2) as [Q, Q];
    b1 = Q.of(y0).sub(m1.mul(Q.of(x0)));
    b2 = Q.of(y0).sub(m2.mul(Q.of(x0)));
  } while (!b1.isInteger() || !b2.isInteger() || Math.abs(b1.toNumber()) > 5 || Math.abs(b2.toNumber()) > 5);
  return [
    { m: m1, b: b1.toNumber(), op: rng.pick(ops) },
    { m: m2, b: b2.toNumber(), op: rng.pick(ops) },
  ];
}

/** satisfies tells whether (x, y) satisfies y op mx + b. */
const satisfies = (q: Ineq, x: number, y: Coefficient) => holds(y, q.op, q.m.mul(Q.of(x)).add(Q.of(q.b)));

/** overlapPoint is the first grid point, scanning from the origin outward, that solves both inequalities strictly off their boundaries. */
function overlapPoint(q1: Ineq, q2: Ineq): [number, number] | undefined {
  for (let r = 0; r <= 5; r++)
    for (let x = -r; x <= r; x++)
      for (let y = -r; y <= r; y++) {
        if (Math.max(Math.abs(x), Math.abs(y)) !== r) continue;
        const off = [q1, q2].every((q) => !q.m.mul(Q.of(x)).add(Q.of(q.b)).eq(Q.of(y)));
        if (off && satisfies(q1, x, y) && satisfies(q2, x, y)) return [x, y];
      }
  return undefined;
}

/** systemIntro draws y > x - 1 and y ≤ -x + 3, whose overlap contains the origin. */
const systemIntro: Figure = ineqPicture(
  [
    { m: Q.of(1), b: -1, op: ">" },
    { m: Q.of(-1), b: 3, op: "<=" },
  ],
  true,
  [
    { kind: "point", at: [2, 1], label: "(2, 1)", dir: "e" },
    { kind: "point", at: [0, 0], label: "(0, 0)", dir: "sw", tone: "result" },
    { kind: "point", at: [4, 1], label: "(4, 1)", dir: "e", tone: "action" },
  ],
  "The overlap of the region above the dashed line y = x - 1 and the region on and below the solid line y = -x + 3: a wedge to the left of (2, 1), containing the origin; (4, 1) is outside it.",
  "虚线 y = x - 1 上方的区域与实线 y = -x + 3 上及其下方的区域的公共部分：(2, 1) 左边的一个楔形区域，包含原点；(4, 1) 在它外面。",
);

export const systemsOfLinearInequalities: TopicDef = {
  id: "systems-of-linear-inequalities",
  title: t("Systems of Linear Inequalities", "二元一次不等式组"),
  summary: t(
    "Check solutions of a system of linear inequalities and recognize its graph as the overlap of half-planes.",
    "检验二元一次不等式组的解，并把它的图像看作几个半平面的公共部分。",
  ),
  prerequisites: ["further-graphing-linear-inequalities", "systems-of-linear-equations"],
  encompasses: [{ topic: "graphing-non-strict-linear-inequalities", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.D.12"],
  intro: t(
    `A system of linear equations asks for the points on **both** lines, and a graph shows them where the lines cross. A **system of linear inequalities** asks for the points that satisfy every inequality at once. Each inequality is a half-plane, so the solutions are the points in all of them: the **overlap** of the half-planes.

Take $y > x - 1$ and $y \\le -x + 3$. The first is the region above a dashed line, the second the region on and below a solid line, and the two lines cross at $(2, 1)$. The overlap is a wedge:

{{figure 0}}

The origin is a solution: $0 > -1$ and $0 \\le 3$ are both true. The point $(4, 1)$ is not: $1 > 3$ is false, so it fails the first inequality, and failing one is already enough. (It fails the second too, $1 \\le -1$ being false.)`,
    `一次方程组要求同时在**两条**直线上的点，在图像上就是两条直线的交点。**一次不等式组**要求同时满足每一个不等式的点。每个不等式是一个半平面，所以解就是同时在所有半平面中的点：这些半平面的**公共部分**。

看 $y > x - 1$ 和 $y \\le -x + 3$。第一个是虚线上方的区域，第二个是实线上及其下方的区域，两条直线交于 $(2, 1)$。公共部分是一个楔形区域：

{{figure 0}}

原点是解：$0 > -1$ 和 $0 \\le 3$ 都成立。点 $(4, 1)$ 不是解：$1 > 3$ 不成立，它不满足第一个不等式，而只要有一个不满足就够了。（它也不满足第二个，$1 \\le -1$ 不成立。）`,
  ),
  introFigures: [systemIntro],
  knowledgePoints: [
    {
      id: "checking-a-solution-of-a-system",
      title: t("Solutions of a system of inequalities", "不等式组的解"),
      explanation: t(
        `A **solution** of a system of inequalities satisfies **every** inequality of the system, so it lies in every one of their regions at once, in the overlap. To check a point, substitute it into each inequality in turn.

$(1, 4)$ solves $\\begin{cases} y > x \\\\ y \\le 5 - x \\end{cases}$ because $4 > 1$ and $4 \\le 4$ are both true; the second holds with equality, which $\\le$ allows. $(1, 6)$ does not: $6 > 1$ is true, but $6 \\le 4$ is false.

> **Watch out.** Passing one inequality is not enough; a point that fails any one of them is not a solution. A point can fail both. And watch equality: it satisfies $\\le$ and $\\ge$, not $<$ or $>$.`,
        `不等式组的**解**要满足组中的**每一个**不等式，所以它同时在每个不等式的区域中，即在公共部分中。检验一个点时，把它依次代入每个不等式。

$(1, 4)$ 是 $\\begin{cases} y > x \\\\ y \\le 5 - x \\end{cases}$ 的解，因为 $4 > 1$ 和 $4 \\le 4$ 都成立；第二个是等号成立，$\\le$ 允许这样。$(1, 6)$ 不是解：$6 > 1$ 成立，但 $6 \\le 4$ 不成立。

> **注意。** 只满足一个不等式是不够的；只要有一个不满足，这个点就不是解。一个点也可能两个都不满足。还要注意等号：相等满足 $\\le$ 和 $\\ge$，不满足 $<$ 或 $>$。`,
      ),
      generate(rng) {
        const [q1, q2] = crossingPair(rng, allOps);
        const want = rng.bool();
        let x: number;
        let y: Q;
        let tries = 0;
        do {
          x = rng.int(-4, 4);
          const v1 = q1.m.mul(Q.of(x)).add(Q.of(q1.b));
          const v2 = q2.m.mul(Q.of(x)).add(Q.of(q2.b));
          const base = rng.pick([v1, v2]);
          y = base.isInteger() ? base.add(Q.of(rng.int(-2, 2))) : Q.of(Math.round(base.toNumber()) + rng.int(-1, 1));
        } while ((satisfies(q1, x, y) && satisfies(q2, x, y)) !== want && ++tries < 40);
        const [ok1, ok2] = [satisfies(q1, x, y), satisfies(q2, x, y)];
        const [c1, c2] = [checkPoint(q1, x, y), checkPoint(q2, x, y)];
        const ok = ok1 && ok2;
        const both = t("Yes, because it satisfies both inequalities.", "是，因为它满足两个不等式。");
        const failsFirst = t("No, because it fails only the first inequality.", "否，因为它只不满足第一个不等式。");
        const failsSecond = t("No, because it fails only the second inequality.", "否，因为它只不满足第二个不等式。");
        const failsBoth = t("No, because it fails both inequalities.", "否，因为它两个不等式都不满足。");
        const fig = inView(x, y.toNumber());
        const label = `(${x}, ${plain(y)})`;
        const verdict = ok
          ? t("Both hold, so the point is a solution.", "两个都成立，所以这个点是解。")
          : ok1
            ? t(
                "Only the second fails, and one failure is enough: the point is not a solution.",
                "只有第二个不成立，而一个不成立就足够了：这个点不是解。",
              )
            : ok2
              ? t(
                  "Only the first fails, and one failure is enough: the point is not a solution.",
                  "只有第一个不成立，而一个不成立就足够了：这个点不是解。",
                )
              : t("Both fail, so the point is not a solution.", "两个都不成立，所以这个点不是解。");
        const problem = reasonChoice(rng, {
          prompt: t(
            `Is $${pointLatex([x, y])}$ a solution of the system $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$`,
            `$${pointLatex([x, y])}$ 是不等式组 $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$ 的解吗？`,
          ),
          correct: ok ? both : ok1 ? failsSecond : ok2 ? failsFirst : failsBoth,
          wrong: [both, failsFirst, failsSecond, failsBoth],
          solution: t(
            `**Step 1: the first inequality.** ${c1.en}

**Step 2: the second inequality.** ${c2.en}

**Step 3: both together.** ${verdict.en}

${fig ? "{{figure 0}}\n\n" : ""}**Check.** A solution must lie in the overlap of the two regions. The point is ${ok1 ? "on the solution side" : "on the wrong side"} of the first boundary and ${ok2 ? "on the solution side" : "on the wrong side"} of the second, so it is ${ok ? "inside" : "outside"} the overlap, which agrees.`,
            `**第一步：第一个不等式。** ${c1["zh-CN"]}

**第二步：第二个不等式。** ${c2["zh-CN"]}

**第三步：合起来。** ${verdict["zh-CN"]}

${fig ? "{{figure 0}}\n\n" : ""}**检验。** 解必须在两个区域的公共部分中。这个点在第一条边界的${ok1 ? "解所在的一侧" : "另一侧"}，在第二条边界的${ok2 ? "解所在的一侧" : "另一侧"}，所以它${ok ? "在" : "不在"}公共部分中，结论一致。`,
          ),
        });
        if (!fig) return problem;
        return {
          ...problem,
          solutionFigures: [
            ineqPicture(
              [q1, q2],
              true,
              [{ kind: "point", at: [x, y.toNumber()], label, dir: "ne", tone: ok ? "result" : "action" }],
              `The overlap of the two regions, with the point ${label} ${ok ? "inside" : "outside"} it.`,
              `两个区域的公共部分，点 ${label} ${ok ? "在其中" : "不在其中"}。`,
            ),
          ],
        };
      },
    },
    {
      id: "system-from-a-graph",
      figure: algebraDrawings["systems-of-linear-inequalities#system-from-a-graph"],
      title: t("The graph of a system", "不等式组的图像"),
      explanation: t(
        `The solutions of a system of inequalities are the points in the **overlap** of the regions of its inequalities. So the graph of a system has one boundary line for each inequality, and the shaded part lies on one side of each. To read a system from its graph, take the lines one at a time and write one inequality for each: its equation, solid or dashed, and the side of that line on which the overlap lies.

If the overlap lies above the dashed line $y = x - 1$ and on or below the solid line $y = -x + 3$, the system is $y > x - 1$ and $y \\le -x + 3$. The origin is in the overlap, and indeed $0 > -1$ and $0 \\le 3$.

> **Watch out.** Judge each line by the side **the overlap** is on, not by which part of the picture looks largest. Reversing one inequality gives the wedge on the other side of that line; reversing both gives the opposite wedge. Check a point of the overlap in both inequalities.`,
        `不等式组的解是各个不等式的区域的**公共部分**中的点。所以不等式组的图像中每个不等式都有一条边界线，阴影部分在每条线的某一侧。由图像读不等式组时，逐条看边界线，为每条线写一个不等式：它的方程、实线或虚线，以及公共部分在这条线的哪一侧。

如果公共部分在虚线 $y = x - 1$ 的上方，并且在实线 $y = -x + 3$ 上或其下方，不等式组就是 $y > x - 1$ 和 $y \\le -x + 3$。原点在公共部分中，确实 $0 > -1$ 且 $0 \\le 3$。

> **注意。** 每条线都要看**公共部分**在它的哪一侧，而不是看图中哪一块看起来更大。把一个不等式反向，得到的是这条线另一侧的楔形区域；两个都反向，得到的是相对的楔形区域。要用公共部分中的一个点代入两个不等式检验。`,
      ),
      generate(rng) {
        const [q1, q2] = crossingPair(rng, allOps);
        const f1 = { ...q1, op: flip[q1.op] };
        const f2 = { ...q2, op: flip[q2.op] };
        const candidates = [
          [q1, q2],
          [f1, q2],
          [q1, f2],
          [f1, f2],
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const d1 = describeGraph(q1);
        const d2 = describeGraph(q2);
        const inside = overlapPoint(q1, q2);
        const check = inside
          ? (() => {
              const [px, py] = inside;
              const [k1, k2] = [checkPoint(q1, px, Q.of(py)), checkPoint(q2, px, Q.of(py))];
              return t(
                `\n\n**Check.** The point $${pointLatex(inside)}$ is in the overlap. First inequality: ${k1.en} Second: ${k2.en}`,
                `\n\n**检验。** 点 $${pointLatex(inside)}$ 在公共部分中。第一个不等式：${k1["zh-CN"]}第二个：${k2["zh-CN"]}`,
              );
            })()
          : t("", "");
        return reasoned(
          {
            ...choiceProblem({
              prompt: t("Which system of inequalities does the graph show?", "图像表示的是哪个不等式组？"),
              options: order.map((i) => same(`$${systemLatex(candidates[i]!.map(ineqLatex))}$`)),
              correct: order.indexOf(0),
              solution: t(
                `**Step 1: the first line.** ${d1.en}

{{figure 0}}

**Step 2: the second line.** ${d2.en}

{{figure 1}}

**Step 3: the system.** The shaded part of the graph is the overlap of the two regions, so the system is $${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$.${check.en}`,
                `**第一步：第一条线。** ${d1["zh-CN"]}

{{figure 0}}

**第二步：第二条线。** ${d2["zh-CN"]}

{{figure 1}}

**第三步：不等式组。** 图中的阴影部分是两个区域的公共部分，所以不等式组是 $${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$。${check["zh-CN"]}`,
              ),
            }),
            figure: inequalityGraph([q1, q2]),
            solutionFigures: [
              ineqPicture([q1], true, [], `The region of ${_plain(ineqLatex(q1))} alone.`, `只画 ${_plain(ineqLatex(q1))} 的区域。`),
              ineqPicture(
                [q2],
                true,
                inside ? [{ kind: "point", at: inside, label: `(${inside[0]}, ${inside[1]})`, dir: "ne", tone: "result" }] : [],
                `The region of ${_plain(ineqLatex(q2))} alone.`,
                `只画 ${_plain(ineqLatex(q2))} 的区域。`,
              ),
            ],
          },
          [
            [
              `$${systemLatex(candidates[1]!.map(ineqLatex))}$`,
              "The first inequality has its side reversed: the overlap would lie on the other side of its line.",
              "第一个不等式方向反了：公共部分会落在它的直线的另一侧。",
            ],
            [
              `$${systemLatex(candidates[2]!.map(ineqLatex))}$`,
              "The second inequality has its side reversed: the overlap would lie on the other side of its line.",
              "第二个不等式方向反了：公共部分会落在它的直线的另一侧。",
            ],
            [
              `$${systemLatex(candidates[3]!.map(ineqLatex))}$`,
              "Both inequalities have their sides reversed: that describes the opposite wedge.",
              "两个不等式方向都反了：那表示的是相对的另一块区域。",
            ],
          ],
        );
      },
    },
    {
      id: "finding-a-solution-of-a-system",
      title: t("Finding a solution", "找出一个解"),
      explanation: t(
        `To decide which of several points solves a system, test each point in every inequality and keep only the point that passes all of them. As soon as one inequality fails, the point can be rejected without testing the rest, since a solution must pass every one.

For $y > x$ and $y \\le 5 - x$: $(3, 1)$ fails the first, $1 > 3$ being false, so it is out at once. $(0, 2)$ passes both, $2 > 0$ and $2 \\le 5$, so it is a solution, and on a graph it lies in the overlap.

> **Watch out.** A point that passes the first inequality may still fail the second; test both before choosing it. Substitute $x$ and $y$ into the right places. And a point on a dashed boundary fails that inequality.`,
        `要判断几个点中哪一个是不等式组的解，把每个点代入每个不等式检验，只保留全部通过的点。只要有一个不等式不成立，这个点就可以排除，不必再检验其余的，因为解必须通过每一个。

对 $y > x$ 和 $y \\le 5 - x$：$(3, 1)$ 不满足第一个，$1 > 3$ 不成立，所以直接排除。$(0, 2)$ 两个都满足，$2 > 0$ 且 $2 \\le 5$，所以它是解，在图像上它位于公共部分中。

> **注意。** 满足第一个不等式的点仍可能不满足第二个；两个都检验后再选。$x$ 和 $y$ 要代入正确的位置。虚线边界上的点不满足那个不等式。`,
      ),
      generate(rng) {
        let q1: Ineq;
        let q2: Ineq;
        let good: [number, number][];
        let bad: [number, number][];
        do {
          [q1, q2] = crossingPair(rng, allOps);
          good = [];
          bad = [];
          for (let x = -4; x <= 4; x++)
            for (let y = -4; y <= 4; y++) {
              const onLine = [q1, q2].some((q) => q.m.mul(Q.of(x)).add(Q.of(q.b)).eq(Q.of(y)));
              if (onLine) continue;
              (satisfies(q1, x, y) && satisfies(q2, x, y) ? good : bad).push([x, y]);
            }
        } while (good.length === 0 || bad.length < 3);
        const answer = rng.pick(good);
        const others = rng.sample(bad, 3);
        const pts = rng.shuffle([answer, ...others]);
        const failing = others.map((p) => {
          const which = satisfies(q1, p[0], p[1]) ? 2 : 1;
          return t(`$${pointLatex(p)}$ fails inequality ${which}`, `$${pointLatex(p)}$ 不满足第 ${which} 个不等式`);
        });
        const c1 = checkPoint(q1, answer[0], Q.of(answer[1]));
        const c2 = checkPoint(q2, answer[0], Q.of(answer[1]));
        return {
          ...choiceProblem({
            prompt: t(
              `Which point is a solution of the system $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$`,
              `哪个点是不等式组 $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$ 的解？`,
            ),
            options: pts.map((p) => same(`$${pointLatex(p)}$`)),
            correct: pts.indexOf(answer),
            solution: t(
              `**Step 1: reject the points that fail.** ${failing.map((f) => f.en).join("; ")}.

**Step 2: the remaining point.** For $${pointLatex(answer)}$, first inequality: ${c1.en} Second: ${c2.en} It passes both, so it is the solution.

{{figure 0}}

**Check.** In the graph, $${pointLatex(answer)}$ lies in the overlap of the two regions, and the other three lie outside it.`,
              `**第一步：排除不满足的点。** ${failing.map((f) => f["zh-CN"]).join("；")}。

**第二步：剩下的点。** 对 $${pointLatex(answer)}$，第一个不等式：${c1["zh-CN"]}第二个：${c2["zh-CN"]}两个都满足，所以它是解。

{{figure 0}}

**检验。** 在图中，$${pointLatex(answer)}$ 在两个区域的公共部分中，其他三个点都在外面。`,
            ),
          }),
          solutionFigures: [
            ineqPicture(
              [q1, q2],
              true,
              [
                ...others.map((p): PlaneMark => ({ kind: "point", at: p, tone: "action" })),
                { kind: "point", at: answer, label: `(${answer[0]}, ${answer[1]})`, dir: "ne", tone: "result" },
              ],
              `The overlap of the two regions, with (${answer[0]}, ${answer[1]}) inside it and the other points outside.`,
              `两个区域的公共部分，(${answer[0]}, ${answer[1]}) 在其中，其他点在外面。`,
            ),
          ],
        };
      },
    },
  ],
};

// ─── Modeling with inequalities ───────────────────────────────────────────────

/** LimitContext is a limit on a total of two kinds of items: ax + by ≤ L or ax + by ≥ L. */
interface LimitContext {
  readonly a: Range;
  readonly b: Range;
  readonly limit: Range;
  readonly op: "<=" | ">=";
  readonly describe: (a: number, b: number, limit: number) => Text;
  readonly vars: Text;
  /** askY asks for the most (≤) or least (≥) of the second kind with x of the first. */
  readonly askY: (x: number) => Text;
  readonly askPair: (x: number, y: number) => Text;
}

const limitContexts: readonly LimitContext[] = [
  {
    a: [8, 15, 1],
    b: [3, 7, 1],
    limit: [100, 300, 10],
    op: "<=",
    describe: (a, b, L) =>
      t(
        `Adult tickets to a museum cost ${dollars(a)} and child tickets cost ${dollars(b)}. A club can spend at most ${dollars(L)}.`,
        `博物馆成人票每张 $${a}$ 元，儿童票每张 $${b}$ 元。一个俱乐部最多能花 $${L}$ 元。`,
      ),
    vars: t("Let $x$ be the number of adult tickets and $y$ the number of child tickets.", "设买成人票 $x$ 张，儿童票 $y$ 张。"),
    askY: (x) =>
      t(
        `If the club buys $${x}$ adult tickets, what is the greatest number of child tickets it can buy?`,
        `如果俱乐部买 $${x}$ 张成人票，最多还能买多少张儿童票？`,
      ),
    askPair: (x, y) =>
      t(`Can the club buy $${x}$ adult tickets and $${y}$ child tickets?`, `俱乐部能买 $${x}$ 张成人票和 $${y}$ 张儿童票吗？`),
  },
  {
    a: [12, 20, 1],
    b: [8, 15, 1],
    limit: [200, 500, 20],
    op: ">=",
    describe: (a, b, L) =>
      t(
        `Mia earns ${dollars(a)} per hour tutoring and ${dollars(b)} per hour babysitting. She wants to earn at least ${dollars(L)} this month.`,
        `米娅做家教每小时挣 $${a}$ 元，照看小孩每小时挣 $${b}$ 元。她这个月想至少挣 $${L}$ 元。`,
      ),
    vars: t("Let $x$ be her hours of tutoring and $y$ her hours of babysitting.", "设她做家教 $x$ 小时，照看小孩 $y$ 小时。"),
    askY: (x) =>
      t(
        `If she tutors for $${x}$ hours, what is the least number of whole hours she must babysit?`,
        `如果她做家教 $${x}$ 小时，她至少还要照看小孩多少个整小时？`,
      ),
    askPair: (x, y) =>
      t(
        `Does she reach her goal with $${x}$ hours of tutoring and $${y}$ hours of babysitting?`,
        `做家教 $${x}$ 小时、照看小孩 $${y}$ 小时，她能达到目标吗？`,
      ),
  },
  {
    a: [15, 30, 1],
    b: [4, 12, 1],
    limit: [200, 600, 25],
    op: "<=",
    describe: (a, b, L) =>
      t(
        `A van can carry at most $${L}$ kg. Large boxes weigh $${a}$ kg and small boxes weigh $${b}$ kg.`,
        `一辆货车最多能载 $${L}$ 千克。大箱子每个重 $${a}$ 千克，小箱子每个重 $${b}$ 千克。`,
      ),
    vars: t("Let $x$ be the number of large boxes and $y$ the number of small boxes.", "设装大箱子 $x$ 个，小箱子 $y$ 个。"),
    askY: (x) =>
      t(
        `If the van carries $${x}$ large boxes, what is the greatest number of small boxes it can also carry?`,
        `如果货车装了 $${x}$ 个大箱子，最多还能装多少个小箱子？`,
      ),
    askPair: (x, y) => t(`Can the van carry $${x}$ large boxes and $${y}$ small boxes?`, `货车能装 $${x}$ 个大箱子和 $${y}$ 个小箱子吗？`),
  },
  {
    a: [3, 3, 1],
    b: [1, 1, 1],
    limit: [30, 70, 1],
    op: ">=",
    describe: (_a, _b, L) =>
      t(
        `A soccer team gets $3$ points for a win and $1$ point for a draw. It needs at least $${L}$ points to qualify.`,
        `一支足球队赢一场得 $3$ 分，平一场得 $1$ 分。它至少需要 $${L}$ 分才能晋级。`,
      ),
    vars: t("Let $x$ be the number of wins and $y$ the number of draws.", "设赢 $x$ 场，平 $y$ 场。"),
    askY: (x) =>
      t(`If the team wins $${x}$ games, what is the least number of draws it needs?`, `如果球队赢了 $${x}$ 场，它至少还需要平多少场？`),
    askPair: (x, y) =>
      t(
        `Does the team qualify with $${x}$ ${x === 1 ? "win" : "wins"} and $${y}$ ${y === 1 ? "draw" : "draws"}?`,
        `球队赢 $${x}$ 场、平 $${y}$ 场能晋级吗？`,
      ),
  },
];

/** limitValues draws the values and the limit of a limit context, with different values. */
function limitValues(rng: Rng, c: LimitContext): [number, number, number] {
  let a: number;
  let b: number;
  do [a, b] = [pickStep(rng, c.a), pickStep(rng, c.b)];
  while (a === b);
  return [a, b, pickStep(rng, c.limit)];
}

/** budgetIntro shades the whole-number plans of 2x + 5y ≤ 40 (grid x in steps of 2), with (5, 6) on the boundary and (6, 6) outside. */
const budgetIntro: Figure = scaledGraph(
  { x: 2, y: 1, nx: 10, ny: 8, xName: "x", yName: "y" },
  [
    {
      kind: "region",
      halfPlanes: [
        [-4, -5, 40],
        [1, 0, 0],
        [0, 1, 0],
      ],
    },
    { kind: "segment", a: [0, 8], b: [10, 0], accent: true },
    { kind: "point", at: [2.5, 6], label: "(5, 6)", dir: "sw", tone: "result" },
    { kind: "point", at: [3, 6], label: "(6, 6)", dir: "ne" },
  ],
  "The line 2x + 5y = 40 from (0, 8) to (20, 0), with the triangle below it shaded; (5, 6) lies on the line and (6, 6) just outside.",
  "直线 2x + 5y = 40，从 (0, 8) 到 (20, 0)，它下方的三角形涂了阴影；(5, 6) 在直线上，(6, 6) 刚好在外面。",
);

/** limitCheck compares a total with its limit and says by how much it is inside or outside. */
function limitCheck(value: number, op: "<=" | ">=", L: number): Text {
  const gap = Math.abs(value - L);
  if (op === "<=") {
    return value <= L
      ? t(
          `**Check.** The limit leaves $${L} - ${value} = ${gap}$ to spare, which is not negative, so the combination fits.`,
          `**检验。** 离限额还剩 $${L} - ${value} = ${gap}$，不是负数，所以这个组合可行。`,
        )
      : t(
          `**Check.** The combination goes over the limit by $${value} - ${L} = ${gap}$, so it does not fit.`,
          `**检验。** 这个组合超出限额 $${value} - ${L} = ${gap}$，所以不可行。`,
        );
  }
  return value >= L
    ? t(
        `**Check.** The total passes the goal by $${value} - ${L} = ${gap}$, which is not negative, so the goal is reached.`,
        `**检验。** 总量比目标多 $${value} - ${L} = ${gap}$，不是负数，所以达到了目标。`,
      )
    : t(
        `**Check.** The total falls short of the goal by $${L} - ${value} = ${gap}$, so the goal is not reached.`,
        `**检验。** 总量比目标少 $${L} - ${value} = ${gap}$，所以没有达到目标。`,
      );
}

export const modelingWithTwoVariableInequalities: TopicDef = {
  id: "modeling-with-two-variable-inequalities",
  title: t("Modeling With Two-Variable Linear Inequalities", "用二元一次不等式建模"),
  summary: t(
    "Write an inequality $ax + by \\le L$ or $ax + by \\ge L$ for a budget, a capacity or a goal, and use it to answer questions.",
    "为预算、容量或目标写出不等式 $ax + by \\le L$ 或 $ax + by \\ge L$，并用它回答问题。",
  ),
  prerequisites: [
    "graphing-non-strict-linear-inequalities",
    "modeling-totals-with-two-variable-equations",
    "modeling-with-two-step-inequalities",
  ],
  encompasses: [
    { topic: "modeling-totals-with-two-variable-equations", weight: 0.4 },
    { topic: "modeling-with-two-step-inequalities", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.3"],
  intro: t(
    `A total made of two kinds of items is written $ax + by$, and when the total is fixed it gives the equation $ax + by = T$. Real limits are seldom that exact: a budget says "at most", a goal says "at least". Then the total is compared with the limit instead of set equal to it, and the model is an **inequality in two variables**.

Pens cost $\\$2$ and notebooks $\\$5$, and there is at most $\\$40$ to spend. With $x$ pens and $y$ notebooks the cost is $2x + 5y$, so the plans that fit are those with

$$2x + 5y \\le 40.$$

Graphed, they fill the triangle under the line $2x + 5y = 40$. Five pens and six notebooks cost exactly $\\$40$, a point on the line; six of each cost $\\$42$, just outside:

{{figure 0}}

In this lesson we write such inequalities from the words, check whether a combination fits, and find the most or least of one item when the other is known.`,
    `由两类物品组成的总量写成 $ax + by$，总量固定时得到方程 $ax + by = T$。现实中的限制很少这么精确：预算说的是“最多”，目标说的是“至少”。这时总量是与限额比较，而不是等于它，模型就成了**二元不等式**。

钢笔每支 $2$ 元，笔记本每本 $5$ 元，最多能花 $40$ 元。设买 $x$ 支钢笔、$y$ 本笔记本，花费是 $2x + 5y$，所以可行的方案满足

$$2x + 5y \\le 40.$$

画出来，它们填满直线 $2x + 5y = 40$ 下方的三角形。$5$ 支钢笔和 $6$ 本笔记本正好花 $40$ 元，是直线上的一点；两样各买 $6$ 个要花 $42$ 元，刚好在外面：

{{figure 0}}

这节课我们根据文字写出这样的不等式，检验某个组合是否可行，并在知道一种物品的数量时求另一种最多或最少是多少。`,
  ),
  introFigures: [budgetIntro],
  knowledgePoints: [
    {
      id: "writing-a-two-variable-inequality",
      title: t("Writing the inequality", "写出不等式"),
      explanation: t(
        `A limit on a total of two kinds of items gives an inequality in two variables. The total is built as for an equation: $x$ items worth $a$ each contribute $ax$, $y$ items worth $b$ each contribute $by$, together $ax + by$. The words then choose the symbol. "At most" and "no more than" let the total reach the limit but not pass it, so they give $\\le$; "at least" and "no less than" give $\\ge$.

Pens at $\\$2$ and notebooks at $\\$5$, with at most $\\$40$ to spend: the cost $2x + 5y$ may equal $40$ but not exceed it, so $2x + 5y \\le 40$.

> **Watch out.** "At most" is $\\le$, not $\\ge$, and it includes the limit itself, so $<$ is wrong. Each value multiplies the variable of **its own** kind ($2x$, not $5x$), and $x + y$ counts items, not their total value.`,
        `对两类物品总量的限制给出一个二元不等式。总量的写法和列方程一样：每件价值 $a$ 的 $x$ 件物品贡献 $ax$，每件价值 $b$ 的 $y$ 件贡献 $by$，合起来是 $ax + by$。再由文字选择符号：“至多”“不超过”表示总量可以达到限额但不能超过，用 $\\le$；“至少”“不少于”用 $\\ge$。

钢笔每支 $2$ 元，笔记本每本 $5$ 元，最多花 $40$ 元：花费 $2x + 5y$ 可以等于 $40$，但不能超过，所以 $2x + 5y \\le 40$。

> **注意。** “至多”是 $\\le$，不是 $\\ge$，而且包括限额本身，所以 $<$ 是错的。每个单价乘以表示**它那一类**物品的变量（是 $2x$ 而不是 $5x$），$x + y$ 数的是件数，不是总价值。`,
      ),
      generate(rng) {
        const c = rng.pick(limitContexts);
        const [a, b, L] = limitValues(rng, c);
        const total = poly([a, "x"], [b, "y"]);
        const op = c.op;
        const candidates = [
          `${total} ${relSymbol(op)} ${L}`,
          `${total} ${relSymbol(flip[op])} ${L}`,
          `${poly([b, "x"], [a, "y"])} ${relSymbol(op)} ${L}`,
          `${total} ${relSymbol(toggle[op])} ${L}`,
          `x + y ${relSymbol(op)} ${L}`,
        ];
        const order = rng.shuffle([0, ...rng.sample([1, 2, 3, 4], 3)]);
        const upper = op === "<=";
        const one = a + b;
        return choiceProblem({
          prompt: t(
            `${c.describe(a, b, L).en} ${c.vars.en} Which inequality models the situation?`,
            `${c.describe(a, b, L)["zh-CN"]}${c.vars["zh-CN"]}哪个不等式符合题意？`,
          ),
          options: order.map((i) => same(`$${candidates[i]!}$`)),
          correct: order.indexOf(0),
          solution: t(
            `**Step 1: Write the total.** Each item of the first kind is worth $${a}$, so $x$ of them contribute $${poly([a, "x"])}$; each of the second kind is worth $${b}$, so $y$ of them contribute $${poly([b, "y"])}$. The total is $${total}$.

**Step 2: Choose the symbol.** "${upper ? "At most" : "At least"}" means the total may equal $${L}$ or be ${upper ? "less" : "more"}, so the symbol is $${relSymbol(op)}$:${steps(candidates[0]!)}**Check.** With one item of each kind, $x = 1$ and $y = 1$, the total is $${a} + ${b} = ${one}$, far ${upper ? "below" : "short of"} $${L}$. The inequality gives $${one} ${relSymbol(op)} ${L}$, which is ${upper ? "true: such a small combination fits" : "false: so little does not reach the goal"}, as it should be.`,
            `**第一步：写出总量。** 第一类每件价值 $${a}$，$x$ 件贡献 $${poly([a, "x"])}$；第二类每件价值 $${b}$，$y$ 件贡献 $${poly([b, "y"])}$。总量是 $${total}$。

**第二步：选择符号。** “${upper ? "最多" : "至少"}”表示总量可以等于 $${L}$，也可以${upper ? "更少" : "更多"}，所以符号是 $${relSymbol(op)}$：${steps(candidates[0]!)}**检验。** 两类各取一件，即 $x = 1$，$y = 1$，总量是 $${a} + ${b} = ${one}$，远${upper ? "低于" : "不到"} $${L}$。不等式给出 $${one} ${relSymbol(op)} ${L}$，${upper ? "成立：这么小的组合当然可行" : "不成立：这么少当然达不到目标"}，符合实际。`,
          ),
        });
      },
    },
    {
      id: "checking-a-combination",
      title: t("Checking a combination", "检验一种组合"),
      explanation: t(
        `A combination fits the limit exactly when its numbers make the inequality true, so to check one, substitute it: compute the total, then compare it with the limit.

With $2x + 5y \\le 40$, buying $5$ pens and $6$ notebooks costs $2 \\cdot 5 + 5 \\cdot 6 = 10 + 30 = 40$, and $40 \\le 40$ is true, so it is allowed. Six pens and six notebooks cost $12 + 30 = 42$, and $42 \\le 40$ is false.

> **Watch out.** A total equal to the limit satisfies $\\le$ and $\\ge$, so "exactly $40$" fits "at most $40$". Multiply each count by the value of its own kind, and compare in the direction of the symbol: for "at least", the total must be the larger side.`,
        `组合满足限制，正是指它的数代入后使不等式成立。所以检验时把它代入：先算出总量，再与限额比较。

对 $2x + 5y \\le 40$，买 $5$ 支钢笔和 $6$ 本笔记本花 $2 \\cdot 5 + 5 \\cdot 6 = 10 + 30 = 40$ 元，$40 \\le 40$ 成立，所以可以。买 $6$ 支钢笔和 $6$ 本笔记本要 $12 + 30 = 42$ 元，$42 \\le 40$ 不成立。

> **注意。** 总量等于限额时 $\\le$ 和 $\\ge$ 都成立，所以“正好 $40$”符合“最多 $40$”。每个数量要乘以它那一类的单价；比较时按不等号的方向：对于“至少”，总量必须是较大的一边。`,
      ),
      generate(rng) {
        const c = rng.pick(limitContexts);
        const [a, b, L] = limitValues(rng, c);
        const x = rng.int(1, Math.max(1, Math.floor(L / a) - 1));
        const yEdge = Math.floor((L - a * x) / b);
        const y = Math.max(0, yEdge + rng.int(-2, 2) + (c.op === ">=" && (L - a * x) % b !== 0 ? 1 : 0));
        const value = a * x + b * y;
        const ok = holds(value, c.op, L);
        const check = limitCheck(value, c.op, L);
        return choiceProblem({
          prompt: t(`${c.describe(a, b, L).en} ${c.askPair(x, y).en}`, `${c.describe(a, b, L)["zh-CN"]}${c.askPair(x, y)["zh-CN"]}`),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `**Step 1: Write the inequality.** ${c.vars.en} The limit is $${poly([a, "x"], [b, "y"])} ${relSymbol(c.op)} ${L}$.

**Step 2: Substitute.** With $x = ${x}$ and $y = ${y}$ the total is $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${value}$.

**Step 3: Compare.** $${value} ${relSymbol(c.op)} ${L}$ is ${ok ? "true, so the answer is yes" : "false, so the answer is no"}.

${check.en}`,
            `**第一步：写出不等式。** ${c.vars["zh-CN"]}限制是 $${poly([a, "x"], [b, "y"])} ${relSymbol(c.op)} ${L}$。

**第二步：代入。** 当 $x = ${x}$，$y = ${y}$ 时，总量是 $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${value}$。

**第三步：比较。** $${value} ${relSymbol(c.op)} ${L}$ ${ok ? "成立，所以答案是“是”" : "不成立，所以答案是“否”"}。

${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "the-greatest-or-least-amount",
      title: t("The greatest or least whole amount", "最大或最小的整数量"),
      explanation: t(
        `When one quantity is known, the inequality in two variables becomes an inequality in one, which is solved as usual: substitute, subtract the known part, divide by the value of each item. Items come in whole numbers, so the bound is then rounded in the direction the inequality allows. Under "at most", $y \\le 5.2$ allows $5$ but not $6$, so round **down**; under "at least", $y \\ge 5.2$ needs $6$, since $5$ is too few, so round **up**.

With $2x + 5y \\le 40$ and $x = 7$ pens: $14 + 5y \\le 40$, so $5y \\le 26$ and $y \\le 5.2$. At most $5$ notebooks: they cost $14 + 25 = 39$, while $6$ would cost $44$.

> **Watch out.** Round down for "at most" and up for "at least"; rounding to the nearest whole number can break the limit. Subtract the known part before dividing: $40 \\div 5 = 8$ ignores the pens. And substitute the known value into **its own** variable.`,
        `知道一个量后，二元不等式就变成一元不等式，按常规方法解：代入，减去已知部分，再除以每件的单价。物品的个数是整数，所以还要按不等式允许的方向取整。在“最多”之下，$y \\le 5.2$ 允许 $5$ 而不允许 $6$，所以**向下**取整；在“至少”之下，$y \\ge 5.2$ 需要 $6$，因为 $5$ 不够，所以**向上**取整。

对 $2x + 5y \\le 40$，买 $x = 7$ 支钢笔：$14 + 5y \\le 40$，所以 $5y \\le 26$，$y \\le 5.2$。最多买 $5$ 本笔记本：共花 $14 + 25 = 39$ 元，而买 $6$ 本要 $44$ 元。

> **注意。** “最多”向下取整，“至少”向上取整；四舍五入可能违反限制。先减去已知部分再除：$40 \\div 5 = 8$ 忽略了钢笔。还要把已知的值代入**它自己**的变量。`,
      ),
      generate(rng) {
        const c = rng.pick(limitContexts);
        const [a, b, L] = limitValues(rng, c);
        const x = rng.int(1, Math.max(1, Math.floor(L / a) - 1));
        const rest = L - a * x;
        const bound = Q.of(rest, b);
        const answer = c.op === "<=" ? Math.floor(rest / b) : Math.ceil(rest / b);
        const other = c.op === "<=" ? Math.ceil(rest / b) : Math.floor(rest / b);
        const upper = c.op === "<=";
        const next = upper ? answer + 1 : answer - 1;
        const [at, atNext] = [a * x + b * answer, a * x + b * next];
        const round = bound.isInteger()
          ? t(
              `**Step 3: Read the answer.** The bound $${rest / b}$ is already a whole number, so the answer is $${answer}$.`,
              `**第三步：读出答案。** 界限 $${rest / b}$ 已经是整数，所以答案是 $${answer}$。`,
            )
          : t(
              `**Step 3: Round.** $y$ is a whole number, and under "${upper ? "at most" : "at least"}" the bound is rounded ${upper ? "down" : "up"}: the answer is $${answer}$.`,
              `**第三步：取整。** $y$ 是整数，在“${upper ? "最多" : "至少"}”之下要${upper ? "向下" : "向上"}取整：答案是 $${answer}$。`,
            );
        return numberProblem({
          prompt: t(`${c.describe(a, b, L).en} ${c.askY(x).en}`, `${c.describe(a, b, L)["zh-CN"]}${c.askY(x)["zh-CN"]}`),
          answer,
          wrong: [other === answer ? answer + (c.op === "<=" ? 1 : -1) : other, Math.floor(L / b), Math.floor((L - b * x) / a)],
          solution: t(
            `**Step 1: Substitute.** ${c.vars.en} The limit is $${poly([a, "x"], [b, "y"])} ${relSymbol(c.op)} ${L}$; put in $x = ${x}$:${steps(`${a} \\cdot ${x} + ${poly([b, "y"])} ${relSymbol(c.op)} ${L}`)}**Step 2: Solve for $y$.** Subtract $${a * x}$, then divide by $${b}$:${steps(`${poly([b, "y"])} ${relSymbol(c.op)} ${rest}`, `y ${relSymbol(c.op)} ${num(bound)}`)}${round.en}

**Check.** With $y = ${answer}$ the total is $${a * x} + ${b * answer} = ${at}$, and $${at} ${relSymbol(c.op)} ${L}$ holds; with $y = ${next}$ it would be $${atNext}$, which ${upper ? "goes over" : "falls short of"} $${L}$.`,
            `**第一步：代入。** ${c.vars["zh-CN"]}限制是 $${poly([a, "x"], [b, "y"])} ${relSymbol(c.op)} ${L}$；代入 $x = ${x}$：${steps(`${a} \\cdot ${x} + ${poly([b, "y"])} ${relSymbol(c.op)} ${L}`)}**第二步：解出 $y$。** 减去 $${a * x}$，再除以 $${b}$：${steps(`${poly([b, "y"])} ${relSymbol(c.op)} ${rest}`, `y ${relSymbol(c.op)} ${num(bound)}`)}${round["zh-CN"]}

**检验。** 当 $y = ${answer}$ 时，总量是 $${a * x} + ${b * answer} = ${at}$，$${at} ${relSymbol(c.op)} ${L}$ 成立；若 $y = ${next}$，总量是 $${atNext}$，${upper ? "超过了" : "不到"} $${L}$。`,
          ),
        });
      },
    },
  ],
};

/** PlanningContext limits two quantities x and y by a count, x + y op1 N, and a total, ax + by op2 R. */
interface PlanningContext {
  readonly a: Range;
  readonly b: Range;
  readonly n: Range;
  readonly ops: readonly ["<=" | ">=", "<=" | ">="];
  readonly describe: (a: number, b: number, n: number, r: number) => Text;
  readonly vars: Text;
  readonly askPair: (x: number, y: number) => Text;
  /** askY asks for the most (both ≤) or least (both ≥) y with a given x; absent when the limits point different ways. */
  readonly askY?: (x: number) => Text;
}

const planningContexts: readonly PlanningContext[] = [
  {
    a: [100, 200, 10],
    b: [60, 150, 10],
    n: [20, 60, 5],
    ops: ["<=", "<="],
    describe: (a, b, n, r) =>
      t(
        `A farmer has at most $${n}$ acres to plant with corn and wheat. Corn costs ${dollars(a)} per acre and wheat costs ${dollars(b)} per acre, and the budget is at most ${dollars(r)}.`,
        `农场主最多有 $${n}$ 英亩地种玉米和小麦。玉米每英亩成本 $${a}$ 元，小麦每英亩成本 $${b}$ 元，预算最多 $${r}$ 元。`,
      ),
    vars: t("Let $x$ be the acres of corn and $y$ the acres of wheat.", "设种玉米 $x$ 英亩，小麦 $y$ 英亩。"),
    askPair: (x, y) =>
      t(`Can the farmer plant $${x}$ acres of corn and $${y}$ acres of wheat?`, `农场主能种 $${x}$ 英亩玉米和 $${y}$ 英亩小麦吗？`),
    askY: (x) =>
      t(
        `If the farmer plants $${x}$ acres of corn, what is the greatest whole number of acres of wheat possible?`,
        `如果农场主种 $${x}$ 英亩玉米，最多还能种多少整英亩小麦？`,
      ),
  },
  {
    a: [20, 45, 5],
    b: [10, 30, 5],
    n: [12, 30, 1],
    ops: ["<=", "<="],
    describe: (a, b, n, r) =>
      t(
        `A bakery's oven bakes at most $${n}$ cakes and pies a day. A cake takes $${a}$ minutes of decorating and a pie $${b}$ minutes, and there are at most $${r}$ minutes of decorating time.`,
        `面包店的烤箱每天最多烤 $${n}$ 个蛋糕和馅饼。每个蛋糕要装饰 $${a}$ 分钟，每个馅饼要 $${b}$ 分钟，装饰时间最多 $${r}$ 分钟。`,
      ),
    vars: t("Let $x$ be the number of cakes and $y$ the number of pies.", "设烤蛋糕 $x$ 个，馅饼 $y$ 个。"),
    askPair: (x, y) =>
      t(
        `Can the bakery make $${x}$ ${x === 1 ? "cake" : "cakes"} and $${y}$ ${y === 1 ? "pie" : "pies"} in a day?`,
        `面包店一天能做 $${x}$ 个蛋糕和 $${y}$ 个馅饼吗？`,
      ),
    askY: (x) =>
      t(
        `If the bakery makes $${x}$ cakes, what is the greatest number of pies it can make?`,
        `如果面包店做 $${x}$ 个蛋糕，最多还能做多少个馅饼？`,
      ),
  },
  {
    a: [3, 8, 1],
    b: [10, 20, 1],
    n: [40, 100, 5],
    ops: [">=", ">="],
    describe: (a, b, n, r) =>
      t(
        `A school club sells small candles for ${dollars(a)} and large candles for ${dollars(b)}. It must sell at least ${n} candles and raise at least ${dollars(r)}.`,
        `学校社团卖小蜡烛每支 ${a} 元，大蜡烛每支 ${b} 元。它至少要卖出 ${n} 支蜡烛，并且至少筹到 ${r} 元。`,
      ),
    vars: t("Let $x$ be the number of small candles and $y$ the number of large candles.", "设卖出小蜡烛 $x$ 支，大蜡烛 $y$ 支。"),
    askPair: (x, y) =>
      t(`Does selling ${x} small and ${y} large candles meet both goals?`, `卖出 ${x} 支小蜡烛和 ${y} 支大蜡烛能同时达到两个目标吗？`),
    askY: (x) =>
      t(
        `If the club sells ${x} small candles, what is the least number of large candles it must sell?`,
        `如果社团卖出 ${x} 支小蜡烛，它至少还要卖出多少支大蜡烛？`,
      ),
  },
  {
    a: [12, 20, 1],
    b: [8, 15, 1],
    n: [10, 25, 1],
    ops: ["<=", ">="],
    describe: (a, b, n, r) =>
      t(
        `Leo works at most ${n} hours a week at two jobs, paying ${dollars(a)} and ${dollars(b)} per hour. He wants to earn at least ${dollars(r)} a week.`,
        `小李每周在两份工作上最多工作 ${n} 小时，时薪分别是 ${a} 元和 ${b} 元。他每周想至少挣 ${r} 元。`,
      ),
    vars: t("Let $x$ be his hours at the first job and $y$ his hours at the second.", "设他第一份工作做 $x$ 小时，第二份工作做 $y$ 小时。"),
    askPair: (x, y) =>
      t(
        `Does working ${x} hours at the first job and ${y} hours at the second meet both conditions?`,
        `第一份工作做 ${x} 小时、第二份做 ${y} 小时，能同时满足两个条件吗？`,
      ),
  },
];

/** planningValues draws the values of a planning context so that both limits matter: R is between b·N and a·N. */
function planningValues(rng: Rng, c: PlanningContext): [number, number, number, number] {
  let a: number;
  let b: number;
  do [a, b] = [pickStep(rng, c.a), pickStep(rng, c.b)];
  while (a === b);
  const n = pickStep(rng, c.n);
  const [lo, hi] = [Math.min(a, b) * n, Math.max(a, b) * n];
  const step = Math.min(a, b) % 5 === 0 ? 10 : 1;
  const r = lo + step * rng.int(1, Math.max(1, Math.floor((hi - lo) / step) - 1));
  return [a, b, n, r];
}

/** farmIntro shades the plans of x + y ≤ 50 and 120x + 80y ≤ 5000 (grid in steps of 10), with the corner (25, 25). */
const farmIntro: Figure = scaledGraph(
  { x: 10, y: 10, nx: 8, ny: 7, xName: "x", yName: "y" },
  [
    {
      kind: "region",
      halfPlanes: [
        [-1, -1, 5],
        [-12, -8, 50],
        [1, 0, 0],
        [0, 1, 0],
      ],
    },
    { kind: "segment", a: [0, 5], b: [5, 0] },
    { kind: "segment", a: [0, 6.25], b: [50 / 12, 0], accent: true },
    { kind: "point", at: [2.5, 2.5], label: "(25, 25)", dir: "ne", tone: "result" },
    { kind: "point", at: [3, 1.5], label: "(30, 15)", dir: "e" },
  ],
  "The lines x + y = 50 and 120x + 80y = 5000, with the region under both shaded; they cross at (25, 25), and the plan (30, 15) lies inside.",
  "直线 x + y = 50 和 120x + 80y = 5000，两条线下方的公共区域涂了阴影；它们交于 (25, 25)，方案 (30, 15) 在区域内。",
);

export const modelingWithSystemsOfInequalities: TopicDef = {
  id: "modeling-with-systems-of-inequalities",
  title: t("Modeling With Systems of Linear Inequalities", "用二元一次不等式组建模"),
  summary: t(
    "Write a system of inequalities for a situation with several limits, and decide which plans satisfy all of them.",
    "为有多个限制的情境写出不等式组，并判断哪些方案满足所有限制。",
  ),
  prerequisites: ["systems-of-linear-inequalities", "modeling-with-two-variable-inequalities"],
  encompasses: [
    { topic: "systems-of-linear-inequalities", weight: 0.4 },
    { topic: "modeling-with-two-variable-inequalities", weight: 0.5 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.3", "CCSS.HSA.REI.D.12"],
  intro: t(
    `One limit on a total gives one inequality $ax + by \\le L$, and a system of inequalities is solved by the points in every half-plane at once. Real plans usually face several limits together, such as space and money, or a number of sales and an amount raised, and a plan is possible only if it meets all of them. So the model is a **system of inequalities**, and the possible plans are the overlap of its half-planes.

A farmer has at most $50$ acres for corn and wheat. Corn costs $\\$120$ an acre and wheat $\\$80$, and the budget is at most $\\$5000$. With $x$ acres of corn and $y$ of wheat:

$$\\begin{cases} x + y \\le 50 \\\\ 120x + 80y \\le 5000 \\end{cases}$$

Planting $30$ acres of corn and $15$ of wheat uses $45$ acres and costs $\\$4800$, so it meets both limits and lies in the shaded region:

{{figure 0}}

In this lesson we write such systems, check plans against every limit, and find the most or least of one quantity when both limits apply.`,
    `对总量的一个限制给出一个不等式 $ax + by \\le L$，而不等式组的解是同时落在每个半平面里的点。现实中的方案往往同时受多个限制，比如土地和资金，或者销售数量和筹款金额，方案只有满足全部限制才可行。所以模型是一个**不等式组**，可行的方案就是各个半平面的公共部分。

农场主最多有 $50$ 英亩地种玉米和小麦。玉米每英亩成本 $120$ 元，小麦 $80$ 元，预算最多 $5000$ 元。设种玉米 $x$ 英亩，小麦 $y$ 英亩：

$$\\begin{cases} x + y \\le 50 \\\\ 120x + 80y \\le 5000 \\end{cases}$$

种 $30$ 英亩玉米和 $15$ 英亩小麦，用地 $45$ 英亩，成本 $4800$ 元，两个限制都满足，它落在阴影区域里：

{{figure 0}}

这节课我们写出这样的不等式组，用每一个限制检验方案，并在两个限制同时起作用时求一个量的最大或最小值。`,
  ),
  introFigures: [farmIntro],
  knowledgePoints: [
    {
      id: "writing-a-system-of-inequalities",
      title: t("Writing the system", "写出不等式组"),
      explanation: t(
        `When a situation has several limits, each one is a separate condition, so each gets its own inequality, and together they form a system. A limit on how many items there are counts them, $x + y$; a limit on cost, time or money weighs them, $ax + by$. The words "at most" or "at least" of each limit choose its symbol.

A farmer with at most $50$ acres, corn at $\\$120$ and wheat at $\\$80$ per acre, and a budget of at most $\\$5000$:

$$\\begin{cases} x + y \\le 50 \\\\ 120x + 80y \\le 5000 \\end{cases}$$

Numbers of items or acres cannot be negative, so $x \\ge 0$ and $y \\ge 0$ hold as well.

> **Watch out.** Keep each number with its own limit: the count $50$ goes with $x + y$ and the budget $5000$ with $120x + 80y$, not the other way round. Each value multiplies the variable of its own kind ($120x$, not $120y$), and each symbol follows the words of its own limit.`,
        `当情境中有多个限制时，每个限制都是一个单独的条件，各写一个不等式，合起来组成不等式组。对物品个数的限制是数个数，$x + y$；对成本、时间或钱的限制是按单价加权，$ax + by$。每个限制中的“最多”或“至少”决定它的符号。

农场主最多有 $50$ 英亩地，玉米每英亩 $120$ 元，小麦每英亩 $80$ 元，预算最多 $5000$ 元：

$$\\begin{cases} x + y \\le 50 \\\\ 120x + 80y \\le 5000 \\end{cases}$$

物品个数或面积不能为负，所以还有 $x \\ge 0$，$y \\ge 0$。

> **注意。** 每个数要配它自己的限制：数量 $50$ 配 $x + y$，预算 $5000$ 配 $120x + 80y$，不能对调。每个单价乘以它那一类的变量（是 $120x$ 而不是 $120y$），每个符号按它自己那个限制的文字来定。`,
      ),
      generate(rng) {
        const c = rng.pick(planningContexts);
        const [a, b, n, r] = planningValues(rng, c);
        const [o1, o2] = c.ops;
        const count = (op: InequalityOp, v: number) => `x + y ${relSymbol(op)} ${v}`;
        const total = (p: number, q: number, op: InequalityOp, v: number) => `${poly([p, "x"], [q, "y"])} ${relSymbol(op)} ${v}`;
        const candidates = [
          [count(o1, n), total(a, b, o2, r)],
          [count(o1, n), total(b, a, o2, r)],
          [count(o1, r), total(a, b, o2, n)],
          [count(flip[o1], n), total(a, b, o2, r)],
          [count(o1, n), total(a, b, flip[o2], r)],
        ];
        const order = rng.shuffle([0, ...rng.sample([1, 2, 3, 4], 3)]);
        const word = (op: "<=" | ">=") => (op === "<=" ? t("at most", "最多") : t("at least", "至少"));
        return choiceProblem({
          prompt: t(
            `${c.describe(a, b, n, r).en} ${c.vars.en} Which system models the situation?`,
            `${c.describe(a, b, n, r)["zh-CN"]}${c.vars["zh-CN"]}哪个不等式组符合题意？`,
          ),
          options: order.map((i) => same(`$${systemLatex(candidates[i]!)}$`)),
          correct: order.indexOf(0),
          solution: t(
            `**Step 1: The limit on the count.** Together there are $x + y$, and the limit is "${word(o1).en}" $${n}$: $${candidates[0]![0]}$.

**Step 2: The limit on the total.** Each item of the first kind adds $${a}$ and each of the second $${b}$, so the total is $${poly([a, "x"], [b, "y"])}$, and the limit is "${word(o2).en}" $${r}$: $${candidates[0]![1]}$.

**Step 3: Combine.** Both limits must hold at once:${steps(systemLatex(candidates[0]!))}**Check.** One item of the first kind and none of the second, $x = 1$ and $y = 0$, should count $1$ and be worth $${a}$: the system gives $1 + 0 = 1$ and $${a} \\cdot 1 + ${b} \\cdot 0 = ${a}$.`,
            `**第一步：数量的限制。** 合起来共有 $x + y$，限制是“${word(o1)["zh-CN"]}” $${n}$：$${candidates[0]![0]}$。

**第二步：总量的限制。** 第一类每件加 $${a}$，第二类每件加 $${b}$，所以总量是 $${poly([a, "x"], [b, "y"])}$，限制是“${word(o2)["zh-CN"]}” $${r}$：$${candidates[0]![1]}$。

**第三步：合起来。** 两个限制必须同时成立：${steps(systemLatex(candidates[0]!))}**检验。** 第一类一件、第二类没有，即 $x = 1$，$y = 0$，数量应是 $1$，总量应是 $${a}$：不等式组给出 $1 + 0 = 1$ 和 $${a} \\cdot 1 + ${b} \\cdot 0 = ${a}$。`,
          ),
        });
      },
    },
    {
      id: "checking-a-plan",
      title: t("Checking a plan", "检验方案"),
      explanation: t(
        `A plan $(x, y)$ is possible only if it satisfies **every** inequality of the system, because each inequality is a limit the plan must respect. So substitute it into each one in turn; one false inequality is enough to rule the plan out.

For the farmer, $30$ acres of corn and $15$ of wheat use $30 + 15 = 45 \\le 50$ acres and cost $120 \\cdot 30 + 80 \\cdot 15 = 4800 \\le 5000$ dollars, so the plan works. $35$ and $15$ acres use $50 \\le 50$ acres, which is fine, but cost $4200 + 1200 = 5400$, over budget, so that plan fails.

> **Watch out.** Check both limits: a plan that meets one can still break the other. A value equal to the limit satisfies $\\le$ and $\\ge$, and each count is multiplied by the value of its own kind.`,
        `方案 $(x, y)$ 只有满足不等式组中的**每一个**不等式才可行，因为每个不等式都是方案必须遵守的一个限制。所以把它依次代入每个不等式；只要有一个不成立，方案就不行。

对农场主，种玉米 $30$ 英亩、小麦 $15$ 英亩，用地 $30 + 15 = 45 \\le 50$，成本 $120 \\cdot 30 + 80 \\cdot 15 = 4800 \\le 5000$，可行。种 $35$ 和 $15$ 英亩，用地 $50 \\le 50$，没问题，但成本 $4200 + 1200 = 5400$，超出预算，所以不行。

> **注意。** 两个限制都要检验：满足一个的方案仍可能违反另一个。等于限额的值满足 $\\le$ 和 $\\ge$；每个数量要乘以它那一类的单价。`,
      ),
      generate(rng) {
        const c = rng.pick(planningContexts);
        const [a, b, n, r] = planningValues(rng, c);
        const [o1, o2] = c.ops;
        const x = rng.int(1, n - 1);
        const y = Math.max(0, n - x + rng.int(-4, 4));
        const [cnt, tot] = [x + y, a * x + b * y];
        const [ok1, ok2] = [holds(cnt, o1, n), holds(tot, o2, r)];
        const ok = ok1 && ok2;
        const failed =
          !ok1 && !ok2
            ? t("Both limits fail", "两个限制都不满足")
            : !ok1
              ? t("The count fails", "数量的限制不满足")
              : t("The total fails", "总量的限制不满足");
        return choiceProblem({
          prompt: t(`${c.describe(a, b, n, r).en} ${c.askPair(x, y).en}`, `${c.describe(a, b, n, r)["zh-CN"]}${c.askPair(x, y)["zh-CN"]}`),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `${c.vars.en} The plan must satisfy $${systemLatex([`x + y ${relSymbol(o1)} ${n}`, `${poly([a, "x"], [b, "y"])} ${relSymbol(o2)} ${r}`])}$.

**Step 1: The count.** $${x} + ${y} = ${cnt}$, and $${cnt} ${relSymbol(o1)} ${n}$ is ${ok1 ? "true" : "false"}.

**Step 2: The total.** $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${tot}$, and $${tot} ${relSymbol(o2)} ${r}$ is ${ok2 ? "true" : "false"}.

**Step 3: Decide.** ${ok ? "Both limits are met, so the answer is yes." : `${failed.en}, so the answer is no.`}`,
            `${c.vars["zh-CN"]}方案必须满足 $${systemLatex([`x + y ${relSymbol(o1)} ${n}`, `${poly([a, "x"], [b, "y"])} ${relSymbol(o2)} ${r}`])}$。

**第一步：数量。** $${x} + ${y} = ${cnt}$，$${cnt} ${relSymbol(o1)} ${n}$ ${ok1 ? "成立" : "不成立"}。

**第二步：总量。** $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${a * x} + ${b * y} = ${tot}$，$${tot} ${relSymbol(o2)} ${r}$ ${ok2 ? "成立" : "不成立"}。

**第三步：判断。** ${ok ? "两个限制都满足，所以答案是“是”。" : `${failed["zh-CN"]}，所以答案是“否”。`}`,
          ),
        });
      },
    },
    {
      id: "the-best-whole-amount-under-two-limits",
      title: t("The most or least under two limits", "两个限制下的最大或最小值"),
      explanation: t(
        `With one quantity known, each inequality gives its own bound on the other, and the answer must satisfy both. When both limits are upper bounds, a value under the smaller bound is under the larger one too, so the answer is the **smaller** bound; when both are lower bounds, the answer is the **larger** one.

For the farmer with $x = 30$ acres of corn: the acres give $30 + y \\le 50$, so $y \\le 20$; the budget gives $3600 + 80y \\le 5000$, so $80y \\le 1400$ and $y \\le 17.5$. Both must hold, so $y \\le 17.5$, and in whole acres at most $17$.

> **Watch out.** One bound alone is not the answer: $20$ acres meet the land limit but cost $\\$5200$. Take the smaller of two upper bounds and the larger of two lower bounds, round in the allowed direction, and subtract the known part of the total before dividing.`,
        `知道一个量后，每个不等式都给出另一个量的一个界限，答案必须同时满足两者。两个限制都是上界时，不超过较小上界的值也不超过较大的上界，所以答案取**较小**的上界；都是下界时，答案取**较大**的下界。

对种 $x = 30$ 英亩玉米的农场主：由面积得 $30 + y \\le 50$，即 $y \\le 20$；由预算得 $3600 + 80y \\le 5000$，即 $80y \\le 1400$，$y \\le 17.5$。两者必须同时成立，所以 $y \\le 17.5$，按整英亩计最多 $17$ 英亩。

> **注意。** 只看一个界限是不够的：$20$ 英亩满足土地的限制，但成本是 $5200$ 元。两个上界取较小的，两个下界取较大的，按允许的方向取整，并且先减去总量中已知的部分再除。`,
      ),
      generate(rng) {
        const c = rng.pick(planningContexts.filter((p) => p.askY));
        const [a, b, n, r] = planningValues(rng, c);
        const upper = c.ops[0] === "<=";
        // Under upper bounds, a·x must not pass r by itself, or no plan with this x is possible.
        const x = rng.int(1, upper ? Math.max(1, Math.min(n - 1, Math.floor(r / a))) : n - 1);
        const fromCount = n - x;
        const rest = r - a * x;
        const fromTotal = upper ? Math.floor(rest / b) : Math.ceil(rest / b);
        const answer = upper ? Math.max(0, Math.min(fromCount, fromTotal)) : Math.max(0, fromCount, fromTotal);
        const op = c.ops[0];
        const bound = Q.of(rest, b);
        const countBinds = upper ? fromCount <= fromTotal : fromCount >= fromTotal;
        const next = upper ? answer + 1 : answer - 1;
        const [cnt, tot] = [x + answer, a * x + b * answer];
        const breaks = countBinds
          ? t(
              `the count would be $${x} + ${next} = ${x + next}$, which breaks $x + y ${relSymbol(op)} ${n}$`,
              `数量是 $${x} + ${next} = ${x + next}$，违反 $x + y ${relSymbol(op)} ${n}$`,
            )
          : t(
              `the total would be $${a * x} + ${b * next} = ${a * x + b * next}$, which breaks the limit $${r}$`,
              `总量是 $${a * x} + ${b * next} = ${a * x + b * next}$，违反限额 $${r}$`,
            );
        return numberProblem({
          prompt: t(`${c.describe(a, b, n, r).en} ${c.askY!(x).en}`, `${c.describe(a, b, n, r)["zh-CN"]}${c.askY!(x)["zh-CN"]}`),
          answer,
          wrong: [fromCount, fromTotal, upper ? Math.max(fromCount, fromTotal) : Math.min(fromCount, fromTotal), Math.floor(r / b)],
          solution: t(
            `${c.vars.en} Put $x = ${x}$ into each limit.

**Step 1: The bound from the count.** $${x} + y ${relSymbol(op)} ${n}$, so $y ${relSymbol(op)} ${fromCount}$.

**Step 2: The bound from the total.** $${a * x} + ${poly([b, "y"])} ${relSymbol(op)} ${r}$, so $${poly([b, "y"])} ${relSymbol(op)} ${rest}$ and $y ${relSymbol(op)} ${num(bound)}$${bound.isInteger() ? "" : `; in whole numbers, rounding ${upper ? "down" : "up"}, $y ${relSymbol(op)} ${fromTotal}$`}.

**Step 3: Combine.** Both bounds must hold, and they are ${upper ? "upper" : "lower"} bounds, so the answer is the ${upper ? "smaller" : "larger"} one: $${answer}$.

**Check.** With $y = ${answer}$ the count is $${cnt}$ and the total is $${a * x} + ${b * answer} = ${tot}$; both $${cnt} ${relSymbol(op)} ${n}$ and $${tot} ${relSymbol(op)} ${r}$ hold. With $y = ${next}$, ${breaks.en}.`,
            `${c.vars["zh-CN"]}把 $x = ${x}$ 代入每个限制。

**第一步：由数量得到的界限。** $${x} + y ${relSymbol(op)} ${n}$，所以 $y ${relSymbol(op)} ${fromCount}$。

**第二步：由总量得到的界限。** $${a * x} + ${poly([b, "y"])} ${relSymbol(op)} ${r}$，所以 $${poly([b, "y"])} ${relSymbol(op)} ${rest}$，$y ${relSymbol(op)} ${num(bound)}$${bound.isInteger() ? "" : `；取整数，${upper ? "向下" : "向上"}取整得 $y ${relSymbol(op)} ${fromTotal}$`}。

**第三步：合起来。** 两个界限必须同时满足，它们都是${upper ? "上界" : "下界"}，所以答案取${upper ? "较小" : "较大"}的一个：$${answer}$。

**检验。** 当 $y = ${answer}$ 时，数量是 $${cnt}$，总量是 $${a * x} + ${b * answer} = ${tot}$；$${cnt} ${relSymbol(op)} ${n}$ 和 $${tot} ${relSymbol(op)} ${r}$ 都成立。若 $y = ${next}$，${breaks["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

/** twoVariableTopics are the topics on modeling with two-variable linear equations and on two-variable linear inequalities, in teaching order. */
export const twoVariableTopics: readonly TopicDef[] = [
  modelingWithTwoVariableLinearEquations,
  modelingTotalsWithTwoVariableEquations,
  analyzingGraphsOfLinearModels,
  furtherModelingWithTwoVariableEquations,
  distanceTimeGraphs,
  speedTimeGraphs,
  distanceFromSpeedTimeGraphs,
  graphingStrictLinearInequalities,
  graphingNonStrictLinearInequalities,
  furtherGraphingLinearInequalities,
  systemsOfLinearInequalities,
  modelingWithTwoVariableInequalities,
  modelingWithSystemsOfInequalities,
];
