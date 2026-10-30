import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, linear, num, type PlaneMark, type PlaneView, paren, plane, poly, Q, relSymbol } from "@ga/subject-math";

import {
  choiceProblem,
  equationProblem,
  expressionProblem,
  type InequalityOp,
  numberProblem,
  pointLatex,
  pointProblem,
  steps,
  yesNo,
} from "../problems.ts";

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
        `水管工上门收费 ${f} 元，每工作一小时另收 ${r} 元。`,
      ),
    vars: t("Let $C$ be the charge in dollars for a job of $h$ hours.", "设工作 $h$ 小时的费用为 $C$ 元。"),
    startMeaning: t("The call-out fee", "上门费"),
    rateMeaning: t("The charge for each hour of work", "每小时的工钱"),
    yMeaning: t("The total charge for a job", "一次工作的总费用"),
    xMeaning: t("The number of hours worked", "工作的小时数"),
    askY: (x) => t(`How much does a job of ${x} hours cost, in dollars?`, `工作 ${x} 小时的费用是多少元？`),
    askX: (y) => t(`A job costs ${dollars(y)}. How many hours did it take?`, `一次工作的费用是 ${y} 元。工作了多少小时？`),
    point: (x, y) => t(`a job of ${x} hours costs ${dollars(y)}`, `工作 ${x} 小时收费 ${y} 元`),
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
        `某手机套餐每月基本费 ${f} 元，每使用 1 GB 流量另收 ${r} 元。`,
      ),
    vars: t("Let $C$ be the monthly bill in dollars when $g$ gigabytes are used.", "设使用 $g$ GB 流量时的月费为 $C$ 元。"),
    startMeaning: t("The basic monthly fee", "每月的基本费"),
    rateMeaning: t("The charge for each gigabyte", "每 GB 流量的费用"),
    yMeaning: t("The monthly bill", "每月的话费"),
    xMeaning: t("The number of gigabytes used", "使用的流量 GB 数"),
    askY: (x) => t(`What is the bill for a month with ${x} GB of data, in dollars?`, `某月使用 ${x} GB 流量，话费是多少元？`),
    askX: (y) => t(`One month's bill is ${dollars(y)}. How many gigabytes were used?`, `某月话费是 ${y} 元。使用了多少 GB 流量？`),
    point: (x, y) => t(`a month with ${x} GB costs ${dollars(y)}`, `使用 ${x} GB 的月份话费 ${y} 元`),
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
      t(`A tank holds ${f} liters of water and drains at ${r} liters per minute.`, `水箱里有 ${f} 升水，以每分钟 ${r} 升的速度放水。`),
    vars: t("Let $V$ be the volume of water in liters after $t$ minutes.", "设 $t$ 分钟后水箱里有 $V$ 升水。"),
    startMeaning: t("The amount of water at the start", "开始时的水量"),
    rateMeaning: t("The amount of water drained each minute", "每分钟放出的水量"),
    yMeaning: t("The amount of water left", "剩下的水量"),
    xMeaning: t("The number of minutes since draining began", "放水经过的分钟数"),
    askY: (x) => t(`How many liters are left after ${x} minutes?`, `${x} 分钟后还剩多少升水？`),
    askX: (y) => t(`After how many minutes are ${y} liters left?`, `多少分钟后还剩 ${y} 升水？`),
    point: (x, y) => t(`after ${x} minutes, ${y} liters are left`, `${x} 分钟后还剩 ${y} 升`),
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
    describe: (f, r) => t(`A candle is ${f} cm tall and burns down ${r} cm per hour.`, `一支蜡烛高 ${f} 厘米，每小时燃烧 ${r} 厘米。`),
    vars: t("Let $h$ be the height of the candle in centimeters after $t$ hours.", "设燃烧 $t$ 小时后蜡烛高 $h$ 厘米。"),
    startMeaning: t("The height of the candle before it is lit", "点燃前蜡烛的高度"),
    rateMeaning: t("The height that burns away each hour", "每小时燃烧的高度"),
    yMeaning: t("The height of the candle", "蜡烛的高度"),
    xMeaning: t("The number of hours it has burned", "燃烧的小时数"),
    askY: (x) => t(`How tall is the candle after ${x} hours, in centimeters?`, `燃烧 ${x} 小时后蜡烛高多少厘米？`),
    askX: (y) => t(`After how many hours is the candle ${y} cm tall?`, `燃烧多少小时后蜡烛高 ${y} 厘米？`),
    point: (x, y) => t(`after ${x} hours, the candle is ${y} cm tall`, `燃烧 ${x} 小时后蜡烛高 ${y} 厘米`),
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
    describe: (f, r) => t(`Sam has ${dollars(f)} saved and adds ${dollars(r)} every week.`, `小山已存了 ${f} 元，每周再存 ${r} 元。`),
    vars: t("Let $S$ be Sam's savings in dollars after $w$ weeks.", "设 $w$ 周后小山的存款为 $S$ 元。"),
    startMeaning: t("The amount saved at the start", "开始时的存款"),
    rateMeaning: t("The amount added each week", "每周存入的钱数"),
    yMeaning: t("Sam's total savings", "小山的存款总额"),
    xMeaning: t("The number of weeks", "经过的周数"),
    askY: (x) => t(`How much has Sam saved after ${x} weeks, in dollars?`, `${x} 周后小山存了多少元？`),
    askX: (y) => t(`After how many weeks will Sam have ${dollars(y)}?`, `多少周后小山的存款达到 ${y} 元？`),
    point: (x, y) => t(`after ${x} weeks Sam has ${dollars(y)}`, `${x} 周后小山有 ${y} 元`),
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
    askY: (x) => t(`What is the charge after ${x} hours, in percent?`, `${x} 小时后电量是百分之多少？`),
    askX: (y) => t(`After how many hours is the charge at $${y}\\%$?`, `多少小时后电量降到 $${y}\\%$？`),
    point: (x, y) => t(`after ${x} hours the charge is $${y}\\%$`, `${x} 小时后电量为 $${y}\\%$`),
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
    { topic: "modeling-with-linear-equations", weight: 0.3 },
    { topic: "interpreting-linear-expressions", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.8.F.B.4"],
  knowledgePoints: [
    {
      id: "writing-a-linear-model",
      title: t("Writing a linear model", "写出一次模型"),
      explanation: t(
        "When a quantity $y$ starts at an amount $b$ and changes by the same amount $m$ for each unit of $x$, it is modeled by the linear equation\n\n$$y = mx + b.$$\n\nThe rate $m$ is positive when $y$ grows and negative when it shrinks. A taxi that charges $\\$4$ plus $\\$2$ per kilometer costs $C = 2k + 4$ dollars for $k$ kilometers; a pool that holds $900$ liters and loses $30$ liters per minute holds $V = -30t + 900$ liters after $t$ minutes.",
        "当量 $y$ 从数量 $b$ 开始，且 $x$ 每增加一个单位就变化相同的数量 $m$ 时，可以用一次方程\n\n$$y = mx + b$$\n\n为它建模。$y$ 增加时变化率 $m$ 为正，减少时为负。出租车起步价 $4$ 元、每千米 $2$ 元，行驶 $k$ 千米的费用是 $C = 2k + 4$ 元；水池有 $900$ 升水，每分钟流失 $30$ 升，$t$ 分钟后的水量是 $V = -30t + 900$ 升。",
      ),
      generate(rng) {
        const c = rng.pick(modelContexts);
        const f = pickStep(rng, c.start);
        const r = pickStep(rng, c.rate);
        const answer = modelRhs(c, f, r);
        const s = c.grows ? 1 : -1;
        return expressionProblem({
          prompt: t(
            `${c.describe(f, r).en} ${c.vars.en} Write $${c.y}$ in terms of $${c.x}$.`,
            `${c.describe(f, r)["zh-CN"]}${c.vars["zh-CN"]}用 $${c.x}$ 表示 $${c.y}$。`,
          ),
          answer,
          prefix: `${c.y} =`,
          wrong: [poly([s * f, c.x], [r, ""]), poly([-s * r, c.x], [f, ""]), poly([s * r + f, c.x])],
          solution: t(
            `$${c.y}$ starts at $${f}$ and ${c.grows ? "increases" : "decreases"} by $${r}$ for each unit of $${c.x}$, so the rate is $${s * r}$: ${steps(`${c.y} = ${answer}`)}`,
            `$${c.y}$ 从 $${f}$ 开始，$${c.x}$ 每增加 $1$，它就${c.grows ? "增加" : "减少"} $${r}$，所以变化率是 $${s * r}$：${steps(`${c.y} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "using-a-linear-model",
      title: t("Using a model", "使用模型"),
      explanation: t(
        "A model answers two kinds of questions. To find $y$ for a given $x$, substitute $x$. To find $x$ for a given $y$, substitute $y$ and solve the equation. With $C = 2k + 4$: $10$ km cost $2 \\cdot 10 + 4 = 24$ dollars, and a fare of $\\$30$ means $2k + 4 = 30$, so $k = 13$ km.",
        "模型可以回答两类问题。已知 $x$ 求 $y$：代入 $x$。已知 $y$ 求 $x$：代入 $y$ 再解方程。对 $C = 2k + 4$：行驶 $10$ 千米的费用是 $2 \\cdot 10 + 4 = 24$ 元；车费 $30$ 元意味着 $2k + 4 = 30$，所以 $k = 13$ 千米。",
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
              `Substitute $${c.x} = ${x}$: ${steps(`${c.y} = ${num(s * r)} \\cdot ${x} + ${f} = ${y}`)}`,
              `代入 $${c.x} = ${x}$：${steps(`${c.y} = ${num(s * r)} \\cdot ${x} + ${f} = ${y}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`${c.vars.en} The model is $${model}$. ${c.askX(y).en}`, `${c.vars["zh-CN"]}模型是 $${model}$。${c.askX(y)["zh-CN"]}`),
          answer: x,
          wrong: [Q.of(y, r), Q.of(y + f, r), Q.of(Math.abs(y - f), f), s * r * y + f],
          solution: t(
            `Substitute $${c.y} = ${y}$ and solve: ${steps(`${y} = ${modelRhs(c, f, r)}`, `${poly([s * r, c.x])} = ${y - f}`, `${c.x} = ${x}`)}`,
            `代入 $${c.y} = ${y}$ 并求解：${steps(`${y} = ${modelRhs(c, f, r)}`, `${poly([s * r, c.x])} = ${y - f}`, `${c.x} = ${x}`)}`,
          ),
        });
      },
    },
    {
      id: "slope-and-intercept-in-context",
      title: t("The meaning of the slope and the intercept", "斜率与截距的含义"),
      explanation: t(
        "In a model $y = mx + b$, the graph's **slope** $m$ is the rate: the change in $y$ for each increase of $1$ in $x$. Its **$y$-intercept** $b$ is the value of $y$ when $x = 0$, usually the starting amount. In $V = -30t + 900$ for a pool, the slope $-30$ says the pool loses $30$ liters each minute, and the intercept $900$ is the amount of water at the start.",
        "在模型 $y = mx + b$ 中，图像的**斜率** $m$ 是变化率：$x$ 每增加 $1$ 时 $y$ 的变化量。**$y$ 轴截距** $b$ 是 $x = 0$ 时 $y$ 的值，通常是起始量。在水池模型 $V = -30t + 900$ 中，斜率 $-30$ 表示水池每分钟流失 $30$ 升水，截距 $900$ 是开始时的水量。",
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
                `The slope $${s * r}$ is the change in $${c.y}$ for each increase of $1$ in $${c.x}$: ${c.rateMeaning.en.toLowerCase()}.`,
                `斜率 $${s * r}$ 是 $${c.x}$ 每增加 $1$ 时 $${c.y}$ 的变化量：${c.rateMeaning["zh-CN"]}。`,
              )
            : t(
                `The intercept is the value of $${c.y}$ when $${c.x} = 0$: ${c.startMeaning.en.toLowerCase()}.`,
                `截距是 $${c.x} = 0$ 时 $${c.y}$ 的值：${c.startMeaning["zh-CN"]}。`,
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
        `剧院成人票每张 ${a} 元，儿童票每张 ${b} 元。某天晚上剧院票房收入 ${T} 元。`,
      ),
    vars: t("Let $x$ be the number of adult tickets and $y$ the number of child tickets sold.", "设卖出成人票 $x$ 张，儿童票 $y$ 张。"),
    askY: (x) =>
      t(`If ${x} adult tickets were sold, how many child tickets were sold?`, `如果卖出了 ${x} 张成人票，那么卖出了多少张儿童票？`),
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
        `A basketball team scored ${T} points in a season, all from 3-point and 2-point shots.`,
        `一支篮球队一个赛季得了 ${T} 分，全部来自三分球和两分球。`,
      ),
    vars: t("Let $x$ be the number of 3-point shots and $y$ the number of 2-point shots.", "设投中三分球 $x$ 个，两分球 $y$ 个。"),
    askY: (x) =>
      t(
        `If the team made ${x} 3-point shots, how many 2-point shots did it make?`,
        `如果球队投中了 ${x} 个三分球，那么投中了多少个两分球？`,
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
        `面包店的面包每个 ${a} 元，松饼每个 ${b} 元。某天的销售额是 ${T} 元。`,
      ),
    vars: t("Let $x$ be the number of loaves and $y$ the number of muffins sold.", "设卖出面包 $x$ 个，松饼 $y$ 个。"),
    askY: (x) => t(`If ${x} loaves were sold, how many muffins were sold?`, `如果卖出了 ${x} 个面包，那么卖出了多少个松饼？`),
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
        `Running burns ${a} calories per minute and swimming burns ${b} calories per minute. Mia burned ${T} calories in a week of running and swimming.`,
        `跑步每分钟消耗 ${a} 千卡，游泳每分钟消耗 ${b} 千卡。米娅一周跑步和游泳共消耗了 ${T} 千卡。`,
      ),
    vars: t("Let $x$ be the number of minutes she ran and $y$ the number of minutes she swam.", "设她跑步 $x$ 分钟，游泳 $y$ 分钟。"),
    askY: (x) => t(`If she ran for ${x} minutes, how many minutes did she swim?`, `如果她跑步 ${x} 分钟，那么她游泳多少分钟？`),
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

export const modelingTotalsWithTwoVariableEquations: TopicDef = {
  id: "modeling-totals-with-two-variable-equations",
  title: t("Modeling Totals Using Two-Variable Linear Equations", "用二元一次方程表示总量"),
  summary: t(
    "Model a total made of two kinds of items with $ax + by = T$, and find one quantity from the other or from an intercept.",
    "用 $ax + by = T$ 表示由两类物品组成的总量，并由一个量或截距求另一个量。",
  ),
  prerequisites: ["modeling-with-two-variable-linear-equations", "standard-form"],
  encompasses: [
    { topic: "standard-form", weight: 0.3 },
    { topic: "modeling-with-two-variable-linear-equations", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.2"],
  knowledgePoints: [
    {
      id: "writing-a-total-equation",
      title: t("Writing the equation of a total", "写出总量方程"),
      explanation: t(
        "When items of two kinds have values $a$ and $b$ each, $x$ items of the first kind and $y$ of the second are worth $ax + by$ in all. A known total $T$ gives a linear equation in standard form:\n\n$$ax + by = T.$$\n\nAdult tickets at $\\$9$ and child tickets at $\\$5$ that bring in $\\$720$: $9x + 5y = 720$. Each coefficient belongs to the variable that counts **its** kind of item.",
        "两类物品每件的价值分别是 $a$ 和 $b$ 时，第一类 $x$ 件、第二类 $y$ 件的总价值是 $ax + by$。已知总量 $T$，得到标准式的一次方程\n\n$$ax + by = T.$$\n\n成人票 $9$ 元、儿童票 $5$ 元，共收入 $720$ 元：$9x + 5y = 720$。每个系数要与表示**它那一类**物品件数的变量相乘。",
      ),
      generate(rng) {
        const c = rng.pick(totalContexts);
        const [a, b] = totalPrices(rng, c);
        const T = a * rng.int(2, 30) + b * rng.int(2, 30);
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
            `The $x$ ${c.names[0].en} contribute $${a}x$ and the $y$ ${c.names[1].en} contribute $${b}y$, which add up to $${T}$: ${steps(answer)}`,
            `$x$ 份${c.names[0]["zh-CN"]}贡献 $${a}x$，$y$ 份${c.names[1]["zh-CN"]}贡献 $${b}y$，合计 $${T}$：${steps(answer)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-other-quantity",
      title: t("Finding one quantity from the other", "由一个量求另一个量"),
      explanation: t(
        "Once one of the two quantities is known, substitute it into $ax + by = T$ and solve for the other. With $9x + 5y = 720$ and $x = 40$ adult tickets:\n\n$$360 + 5y = 720 \\;\\Rightarrow\\; 5y = 360 \\;\\Rightarrow\\; y = 72.$$",
        "知道两个量中的一个后，把它代入 $ax + by = T$ 解出另一个。对 $9x + 5y = 720$，若成人票 $x = 40$ 张：\n\n$$360 + 5y = 720 \\;\\Rightarrow\\; 5y = 360 \\;\\Rightarrow\\; y = 72.$$",
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
            `Substitute $x = ${x}$: ${steps(`${a} \\cdot ${x} + ${b}y = ${T}`, `${b}y = ${T - a * x}`, `y = ${y}`)}`,
            `代入 $x = ${x}$：${steps(`${a} \\cdot ${x} + ${b}y = ${T}`, `${b}y = ${T - a * x}`, `y = ${y}`)}`,
          ),
        });
      },
    },
    {
      id: "intercepts-of-a-total",
      title: t("The intercepts of a total", "总量方程的截距"),
      explanation: t(
        "The intercepts of the graph of $ax + by = T$ describe the extreme cases. The $x$-intercept, where $y = 0$, is the number of items of the first kind when there are none of the second; the $y$-intercept, where $x = 0$, the other way round. For $9x + 5y = 720$: the $x$-intercept is $(80, 0)$, so $80$ adult tickets alone bring in $\\$720$; the $y$-intercept is $(0, 144)$.",
        "$ax + by = T$ 的图像的截距描述两种极端情况。$x$ 轴截距处 $y = 0$，表示没有第二类物品时第一类物品的件数；$y$ 轴截距处 $x = 0$，情况相反。对 $9x + 5y = 720$：与 $x$ 轴交于 $(80, 0)$，即只卖 $80$ 张成人票收入 $720$ 元；与 $y$ 轴交于 $(0, 144)$。",
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
          `With no ${c.names[1 - kind]!.en}, there are ${n} ${c.names[kind]!.en}.`,
          `没有${c.names[1 - kind]!["zh-CN"]}时，${c.names[kind]!["zh-CN"]}有 ${n} 份。`,
        );
        const work = kind === 0 ? `${a}x = ${T}, \\quad x = ${n}` : `${b}y = ${T}, \\quad y = ${n}`;
        const intro = t(
          `${c.describe(a, b, T).en} ${c.vars.en} So $${eq}$.`,
          `${c.describe(a, b, T)["zh-CN"]}${c.vars["zh-CN"]}于是 $${eq}$。`,
        );
        if (rng.bool()) {
          return pointProblem({
            prompt: t(
              `${intro.en} Find the ${kind === 0 ? "$x$" : "$y$"}-intercept of the graph of this equation, as an ordered pair.`,
              `${intro["zh-CN"]}求这个方程的图像与 ${kind === 0 ? "$x$" : "$y$"} 轴的交点，写成有序数对。`,
            ),
            answer: pt,
            wrong: [kind === 0 ? [0, n] : [n, 0], kind === 0 ? [other, 0] : [0, other], kind === 0 ? [0, other] : [other, 0]],
            solution: t(
              `Set ${kind === 0 ? "$y = 0$" : "$x = 0$"}: $${work}$. The intercept is $${pointLatex(pt)}$. ${meaning.en}`,
              `令 ${kind === 0 ? "$y = 0$" : "$x = 0$"}：$${work}$。交点是 $${pointLatex(pt)}$。${meaning["zh-CN"]}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(`${intro.en} ${c.askOnly(kind).en}`, `${intro["zh-CN"]}${c.askOnly(kind)["zh-CN"]}`),
          answer: n,
          wrong: [other, T - (kind === 0 ? b : a), Q.of(T, a + b)],
          solution: t(
            `This is the ${kind === 0 ? "$x$" : "$y$"}-intercept: set ${kind === 0 ? "$y = 0$" : "$x = 0$"}, so $${work}$.`,
            `这就是图像与 ${kind === 0 ? "$x$" : "$y$"} 轴的交点：令 ${kind === 0 ? "$y = 0$" : "$x = 0$"}，得 $${work}$。`,
          ),
        });
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
  const figure = scaledGraph(
    sc,
    [
      { kind: "segment", a: [0, k0], b: end, accent: true },
      { kind: "point", at: [0, k0] },
      { kind: "point", at: second },
    ],
    `A line starting at (0, ${f}) and passing through (${second[0] * sx}, ${second[1] * sy}).`,
    `一条从 (0, ${f}) 开始、经过 (${second[0] * sx}, ${second[1] * sy}) 的直线。`,
  );
  return { c, sc, k0, rise, run, f, r, j, figure };
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
    { topic: "properties-of-lines-in-slope-intercept-form", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.8.F.B.4", "CCSS.HSF.IF.B.4", "CCSS.HSS.ID.C.7"],
  knowledgePoints: [
    {
      id: "rate-from-a-graph",
      title: t("The rate of change from a graph", "由图像求变化率"),
      explanation: t(
        "The axes of a graph of a situation often count in steps larger than $1$, so read the **numbers on the axes**, not the grid squares. Pick two points on the line and divide the change in the vertical quantity by the change in the horizontal one: this slope is the rate, in units of the vertical quantity per unit of the horizontal one.\n\nIf a tank holds $400$ liters at $t = 0$ and $100$ liters at $t = 20$ minutes, the slope is $\\frac{100 - 400}{20 - 0} = -15$ liters per minute: the tank loses $15$ liters each minute.",
        "实际情境的图像中，坐标轴上每格往往大于 $1$，所以要读**坐标轴上的数**，而不是数格子。在直线上取两点，用纵向量的变化除以横向量的变化：这个斜率就是变化率，单位是“纵轴单位每横轴单位”。\n\n若水箱在 $t = 0$ 时有 $400$ 升水，$t = 20$ 分钟时有 $100$ 升，斜率是 $\\frac{100 - 400}{20 - 0} = -15$ 升/分：水箱每分钟减少 $15$ 升水。",
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
              `The line passes through $(0, ${f})$ and $${pointLatex([x2, y2])}$, so the slope is ${steps(`\\frac{${y2} - ${f}}{${x2} - 0} = ${num(slope)}`)}${c.grows ? "It is positive" : "It is negative"}: ${c.rateMeaning.en.toLowerCase()} is $${num(g.r)}$.`,
              `直线经过 $(0, ${f})$ 和 $${pointLatex([x2, y2])}$，所以斜率是${steps(`\\frac{${y2} - ${f}}{${x2} - 0} = ${num(slope)}`)}${c.grows ? "斜率为正" : "斜率为负"}：${c.rateMeaning["zh-CN"]}是 $${num(g.r)}$。`,
            ),
          }),
          figure: g.figure,
        };
      },
    },
    {
      id: "values-from-a-graph",
      title: t("Reading values and intercepts", "读出数值和截距"),
      explanation: t(
        "Each point $(x, y)$ of the graph pairs an input with its output. The intercept on the vertical axis is the value at the start, $x = 0$. When a quantity decreases, the intercept on the horizontal axis is the input at which it reaches $0$: a tank that drains along a line through $(0, 400)$ and $(80, 0)$ is empty after $80$ minutes.",
        "图像上每个点 $(x, y)$ 把一个输入和它的输出配成一对。纵轴上的截距是开始时（$x = 0$）的值。当量减少时，横轴上的截距是它减少到 $0$ 时的输入：沿经过 $(0, 400)$ 和 $(80, 0)$ 的直线放水的水箱，$80$ 分钟后放空。",
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
                `The line meets the vertical axis at $(0, ${f})$, so $${c.y} = ${f}$ at the start.`,
                `直线与纵轴交于 $(0, ${f})$，所以开始时 $${c.y} = ${f}$。`,
              ),
            }),
            figure: g.figure,
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
                `The line meets the horizontal axis at $(${empty}, 0)$, so $${c.y} = 0$ when $${c.x} = ${empty}$.`,
                `直线与横轴交于 $(${empty}, 0)$，所以 $${c.x} = ${empty}$ 时 $${c.y} = 0$。`,
              ),
            }),
            figure: g.figure,
          };
        }
        const i = rng.int(1, j);
        const [xi, yi] = [run * i * sc.x, (k0 + s * rise * i) * sc.y];
        const findY = rng.bool();
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
            solution: t(
              `The line passes through $${pointLatex([xi, yi])}$: when $${c.x} = ${xi}$, $${c.y} = ${yi}$.`,
              `直线经过 $${pointLatex([xi, yi])}$：$${c.x} = ${xi}$ 时 $${c.y} = ${yi}$。`,
            ),
          }),
          figure: g.figure,
        };
      },
    },
    {
      id: "model-from-a-graph",
      title: t("The model of a graphed situation", "由图像写出模型"),
      explanation: t(
        "To write the model of a graphed situation, read the starting value $b$ where the line meets the vertical axis and find the rate $m$ from two points, using the numbers on the axes. Then the model is $y = mx + b$, written with the letters of the situation: a tank line through $(0, 400)$ and $(20, 100)$ gives $V = -15t + 400$.",
        "要写出图像所表示情境的模型，先在直线与纵轴的交点读出起始值 $b$，再用坐标轴上的数由两点求出变化率 $m$。模型就是 $y = mx + b$，用情境中的字母写出：经过 $(0, 400)$ 和 $(20, 100)$ 的水箱直线给出 $V = -15t + 400$。",
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
              `The line starts at $(0, ${f})$ and passes through $${pointLatex([x2, y2])}$, so the rate is $\\frac{${y2} - ${f}}{${x2}} = ${num(slope)}$: ${steps(`${c.y} = ${answer}`)}`,
              `直线从 $(0, ${f})$ 开始，经过 $${pointLatex([x2, y2])}$，所以变化率是 $\\frac{${y2} - ${f}}{${x2}} = ${num(slope)}$：${steps(`${c.y} = ${answer}`)}`,
            ),
          }),
          figure: g.figure,
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
        `A 健身房收入会费 ${f1} 元，每次另收 ${r1} 元；B 健身房收入会费 ${f2} 元，每次另收 ${r2} 元。`,
      ),
    askEqual: t("For how many visits do the two gyms cost the same?", "去多少次时两家健身房的费用相同？"),
    askCheaper: (u) => t(`Which gym is cheaper for ${u} visits?`, `去 ${u} 次时，哪家健身房更便宜？`),
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
        `A 公司租车收费 ${f1} 元，每天另收 ${r1} 元；B 公司收费 ${f2} 元，每天另收 ${r2} 元。`,
      ),
    askEqual: t("For how many days do the two companies charge the same?", "租多少天时两家公司的收费相同？"),
    askCheaper: (u) => t(`Which company is cheaper for ${u} days?`, `租 ${u} 天时，哪家公司更便宜？`),
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
        `电工 A 上门收费 ${f1} 元，每小时另收 ${r1} 元；电工 B 上门收费 ${f2} 元，每小时另收 ${r2} 元。`,
      ),
    askEqual: t("For how many hours of work do the two electricians charge the same?", "工作多少小时时两位电工的收费相同？"),
    askCheaper: (u) => t(`Which electrician is cheaper for ${u} hours of work?`, `工作 ${u} 小时时，哪位电工更便宜？`),
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

export const furtherModelingWithTwoVariableEquations: TopicDef = {
  id: "further-modeling-with-two-variable-equations",
  title: t("Further Modeling With Linear Equations in Two Variables", "二元一次方程建模进阶"),
  summary: t(
    "Build a linear model from two data points or a table, and compare two linear models.",
    "由两组数据或表格建立一次模型，并比较两个一次模型。",
  ),
  prerequisites: ["analyzing-graphs-of-linear-models", "point-slope-form"],
  encompasses: [
    { topic: "analyzing-graphs-of-linear-models", weight: 0.3 },
    { topic: "point-slope-form", weight: 0.3 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.2", "CCSS.HSF.LE.A.2"],
  knowledgePoints: [
    {
      id: "model-from-two-data-points",
      title: t("A model from two data points", "由两组数据建立模型"),
      explanation: t(
        "If a quantity changes linearly, two data points determine the model. The rate is the change in $y$ divided by the change in $x$; then substitute one point into $y = mx + b$ to find $b$.\n\nA job of $2$ hours costs $\\$150$ and a job of $5$ hours costs $\\$285$: $m = \\frac{285 - 150}{5 - 2} = 45$, and $150 = 45 \\cdot 2 + b$ gives $b = 60$, so $C = 45h + 60$.",
        "如果一个量线性变化，两组数据就确定了模型。变化率等于 $y$ 的变化除以 $x$ 的变化；再把其中一个点代入 $y = mx + b$ 求出 $b$。\n\n工作 $2$ 小时收费 $150$ 元，工作 $5$ 小时收费 $285$ 元：$m = \\frac{285 - 150}{5 - 2} = 45$，由 $150 = 45 \\cdot 2 + b$ 得 $b = 60$，所以 $C = 45h + 60$。",
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
              `${c.vars.en} $${c.y}$ changes linearly with $${c.x}$, as in the table. Write $${c.y}$ in terms of $${c.x}$.\n\n| $${c.x}$ | $${c.y}$ |\n| :--- | :--- |\n| ${x1} | ${y1} |\n| ${x2} | ${y2} |\n| ${x3} | ${modelAt(c, f, r, x3)} |`,
              `${c.vars["zh-CN"]}$${c.y}$ 随 $${c.x}$ 线性变化，如下表。用 $${c.x}$ 表示 $${c.y}$。\n\n| $${c.x}$ | $${c.y}$ |\n| :--- | :--- |\n| ${x1} | ${y1} |\n| ${x2} | ${y2} |\n| ${x3} | ${modelAt(c, f, r, x3)} |`,
            )
          : t(
              `${c.vars.en} $${c.y}$ changes linearly with $${c.x}$: ${c.point(x1, y1).en}, and ${c.point(x2, y2).en}. Write $${c.y}$ in terms of $${c.x}$.`,
              `${c.vars["zh-CN"]}$${c.y}$ 随 $${c.x}$ 线性变化：${c.point(x1, y1)["zh-CN"]}，${c.point(x2, y2)["zh-CN"]}。用 $${c.x}$ 表示 $${c.y}$。`,
            );
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
            `The rate is $m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${s * r}$. Substitute $${pointLatex([x1, y1])}$ into $${c.y} = m${c.x} + b$: $${y1} = ${num(s * r)} \\cdot ${x1} + b$, so $b = ${f}$: ${steps(`${c.y} = ${answer}`)}`,
            `变化率 $m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${s * r}$。把 $${pointLatex([x1, y1])}$ 代入 $${c.y} = m${c.x} + b$：$${y1} = ${num(s * r)} \\cdot ${x1} + b$，所以 $b = ${f}$：${steps(`${c.y} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "when-two-models-are-equal",
      title: t("When two models are equal", "两个模型何时相等"),
      explanation: t(
        "To compare two plans, write a model for each and set them equal. Plan A costs $30 + 4x$ and plan B costs $12 + 7x$ for $x$ units:\n\n$$30 + 4x = 12 + 7x \\;\\Rightarrow\\; 18 = 3x \\;\\Rightarrow\\; x = 6.$$\n\nAt $6$ units the plans cost the same; on a graph, this is where the two lines intersect.",
        "比较两种方案时，为每种方案写出模型，再令它们相等。方案 A 的费用是 $30 + 4x$，方案 B 是 $12 + 7x$（$x$ 为单位数）：\n\n$$30 + 4x = 12 + 7x \\;\\Rightarrow\\; 18 = 3x \\;\\Rightarrow\\; x = 6.$$\n\n$6$ 个单位时两种方案费用相同；在图像上，这就是两条直线的交点。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const c = rng.pick(planContexts);
        const { r1, r2, f1, f2, d, cross } = plans(rng, c);
        return numberProblem({
          prompt: t(`${c.describe(f1, r1, f2, r2).en} ${c.askEqual.en}`, `${c.describe(f1, r1, f2, r2)["zh-CN"]}${c.askEqual["zh-CN"]}`),
          answer: cross,
          wrong: [Q.of(f1 + f2, r1 + r2), Q.of(f1, r2), f1 - f2, Q.of(f1 - f2, r1)],
          solution: t(
            `For $x$ ${c.units.en}, set the costs equal: ${steps(`${linear(r1, f1)} = ${linear(r2, f2)}`, `${f1 - f2} = ${d}x`, `x = ${cross}`)}`,
            `设为 $x$ ${c.units["zh-CN"]}，令两者费用相等：${steps(`${linear(r1, f1)} = ${linear(r2, f2)}`, `${f1 - f2} = ${d}x`, `x = ${cross}`)}`,
          ),
        });
      },
    },
    {
      id: "choosing-the-better-plan",
      title: t("Choosing the cheaper plan", "选择更便宜的方案"),
      explanation: t(
        "Below the point where two linear costs are equal, the plan with the lower fee is cheaper; above it, the plan with the lower rate is cheaper, because its cost grows more slowly. To decide for a given number of units, you can also evaluate both models: with $30 + 4x$ and $12 + 7x$, at $x = 10$ plan A costs $70$ and plan B costs $82$.",
        "在两条一次费用线相等的点之前，固定费用低的方案更便宜；之后，单价低的方案更便宜，因为它的费用增长得更慢。对给定的单位数，也可以直接计算两个模型的值：对 $30 + 4x$ 和 $12 + 7x$，$x = 10$ 时方案 A 是 $70$，方案 B 是 $82$。",
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
        return choiceProblem({
          prompt: t(
            `${c.describe(f1, r1, f2, r2).en} ${c.askCheaper(u).en}`,
            `${c.describe(f1, r1, f2, r2)["zh-CN"]}${c.askCheaper(u)["zh-CN"]}`,
          ),
          options: [c.names[0], c.names[1], t("They cost the same", "两者费用相同")],
          correct,
          solution: t(
            `${c.names[0].en}: $${f1} + ${r1} \\cdot ${u} = ${ca}$. ${c.names[1].en}: $${f2} + ${r2} \\cdot ${u} = ${cb}$, ${verdict.en}`,
            `${c.names[0]["zh-CN"]}：$${f1} + ${r1} \\cdot ${u} = ${ca}$。${c.names[1]["zh-CN"]}：$${f2} + ${r2} \\cdot ${u} = ${cb}$，${verdict["zh-CN"]}`,
          ),
        });
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
  return { m, km, pts, legs, figure, intro };
}

/** legSpeed is the speed of a leg in kilometers per hour. */
const legSpeed = (l: Leg, km: number) => Q.of(Math.abs(l.to[1] - l.from[1]) * km, l.to[0] - l.from[0]);

export const distanceTimeGraphs: TopicDef = {
  id: "distance-time-graphs",
  title: t("Distance-Time Graphs", "距离—时间图"),
  summary: t(
    "Read distances, stops and speeds from the graph of a journey, and describe what each part of it shows.",
    "从行程图像中读出距离、停留时间和速度，并描述每一段所表示的运动。",
  ),
  prerequisites: ["analyzing-graphs-of-linear-models", "speed-distance-time"],
  encompasses: [
    { topic: "speed-distance-time", weight: 0.4 },
    { topic: "analyzing-graphs-of-linear-models", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.8.F.B.5", "CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "reading-a-distance-time-graph",
      title: t("Reading a distance-time graph", "读距离—时间图"),
      explanation: t(
        "A **distance-time graph** shows how far something is from a starting point, $d$, against time, $t$. A line going up means moving away; a **horizontal** line means the distance does not change, so the traveler is stopped; a line going down means coming back.\n\nThe **total distance traveled** adds up every part of the trip: going $12$ km out and $12$ km back is $24$ km, even though the trip ends where it started.",
        "**距离—时间图**表示物体离出发点的距离 $d$ 随时间 $t$ 的变化。线段上升表示远离出发点；**水平**线段表示距离不变，即停留不动；线段下降表示返回。\n\n**总路程**要把行程的每一段都加起来：去程 $12$ 千米、返程 $12$ 千米，总路程是 $24$ 千米，尽管最后回到了出发点。",
      ),
      generate(rng) {
        const { m, km, pts, legs, figure, intro } = journey(rng);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const i = rng.int(1, pts.length - 2);
          const [tx, dy] = pts[i]!;
          return {
            ...numberProblem({
              prompt: t(
                `${intro.en} How far from home, in kilometers, is ${m.the.en} after ${tx} hours?`,
                `${intro["zh-CN"]}出发 ${tx} 小时后，${m.the["zh-CN"]}离家多少千米？`,
              ),
              answer: dy * km,
              wrong: [dy, tx * km, tx],
              solution: t(
                `At $t = ${tx}$ the graph is at $d = ${dy * km}$, so ${m.the.en} is ${dy * km} km from home.`,
                `$t = ${tx}$ 时图像在 $d = ${dy * km}$ 处，所以${m.the["zh-CN"]}离家 ${dy * km} 千米。`,
              ),
            }),
            figure,
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
                `The graph is horizontal from $t = ${stop.from[0]}$ to $t = ${stop.to[0]}$: the distance does not change for $${len}$ hours.`,
                `图像从 $t = ${stop.from[0]}$ 到 $t = ${stop.to[0]}$ 是水平的：距离在 $${len}$ 小时内没有变化。`,
              ),
            }),
            figure,
          };
        }
        const far = Math.max(...pts.map((p) => p[1])) * km;
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What total distance, in kilometers, does ${m.the.en} travel?`,
              `${intro["zh-CN"]}${m.the["zh-CN"]}一共走了多少千米？`,
            ),
            answer: 2 * far,
            wrong: [far, 0, pts[pts.length - 1]![0] * km],
            solution: t(
              `${m.the.en[0]!.toUpperCase()}${m.the.en.slice(1)} goes out to $${far}$ km from home and comes back, so the total distance is $2 \\cdot ${far} = ${2 * far}$ km.`,
              `${m.the["zh-CN"]}最远到离家 $${far}$ 千米处，然后返回，所以总路程是 $2 \\cdot ${far} = ${2 * far}$ 千米。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "speed-from-a-distance-time-graph",
      title: t("Speed from the slope", "由斜率求速度"),
      explanation: t(
        "On a distance-time graph, the slope of a segment is the change in distance divided by the change in time: the **speed** during that part of the trip. A steeper segment means a higher speed. A segment going down has a negative slope; its speed is the size of the slope.\n\nFrom $(1, 12)$ to $(3, 30)$, the speed is $\\frac{30 - 12}{3 - 1} = 9$ km/h.",
        "在距离—时间图中，一段线段的斜率等于距离的变化除以时间的变化：就是这段行程的**速度**。线段越陡，速度越大。下降的线段斜率为负，速度是斜率的绝对值。\n\n从 $(1, 12)$ 到 $(3, 30)$，速度是 $\\frac{30 - 12}{3 - 1} = 9$ 千米/时。",
      ),
      keyPrerequisites: ["speed-distance-time"],
      generate(rng) {
        const { m, km, legs, figure, intro } = journey(rng);
        const moving = legs.filter((l) => l.to[1] !== l.from[1]);
        const l = rng.pick(moving);
        const v = legSpeed(l, km);
        const [d1, d2] = [l.from[1] * km, l.to[1] * km];
        const dt = l.to[0] - l.from[0];
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What is the speed of ${m.the.en}, in kilometers per hour, between $t = ${l.from[0]}$ and $t = ${l.to[0]}$?`,
              `${intro["zh-CN"]}从 $t = ${l.from[0]}$ 到 $t = ${l.to[0]}$，${m.the["zh-CN"]}的速度是每小时多少千米？`,
            ),
            answer: v,
            wrong: [Math.abs(d2 - d1), Q.of(dt, Math.abs(d2 - d1)), Q.of(d2, l.to[0]), v.neg()],
            solution: t(
              `The distance changes from $${d1}$ km to $${d2}$ km in $${dt}$ hours: ${steps(`\\frac{|${d2} - ${d1}|}{${l.to[0]} - ${l.from[0]}} = ${num(v)}`)}so the speed is $${num(v)}$ km/h.`,
              `距离在 $${dt}$ 小时内从 $${d1}$ 千米变为 $${d2}$ 千米：${steps(`\\frac{|${d2} - ${d1}|}{${l.to[0]} - ${l.from[0]}} = ${num(v)}`)}所以速度是 $${num(v)}$ 千米/时。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "interpreting-a-distance-time-graph",
      title: t("Describing a journey", "描述行程"),
      explanation: t(
        "To describe a part of a journey, look at the direction of its segment: up means moving away from home, horizontal means stopped, down means returning. To compare speeds, compare steepness: the segment with the largest change in distance per hour is the fastest.",
        "描述行程的某一段时，看线段的方向：上升表示远离家，水平表示停留，下降表示返回。比较速度时比较陡峭程度：每小时距离变化最大的线段速度最快。",
      ),
      generate(rng) {
        const { m, km, legs, figure, intro } = journey(rng);
        const moving = legs.filter((l) => l.to[1] !== l.from[1]);
        const speeds = moving.map((l) => legSpeed(l, km));
        const best = speeds.reduce((b, v, i) => (v.cmp(speeds[b]!) > 0 ? i : b), 0);
        const unique = speeds.filter((v) => v.eq(speeds[best]!)).length === 1;
        const span = (l: Leg) => t(`From $t = ${l.from[0]}$ to $t = ${l.to[0]}$`, `从 $t = ${l.from[0]}$ 到 $t = ${l.to[0]}$`);
        if (unique && rng.bool()) {
          const work = moving.map((l, i) => `${l.from[0]} \\text{ to } ${l.to[0]}: \\; ${num(speeds[i]!)}`).join(", \\quad ");
          return {
            ...choiceProblem({
              prompt: t(
                `${intro.en} During which part of the trip is ${m.the.en} fastest?`,
                `${intro["zh-CN"]}${m.the["zh-CN"]}在哪一段行程中最快？`,
              ),
              options: moving.map(span),
              correct: best,
              solution: t(
                `The speeds of the moving parts, in km/h, are ${steps(work)}The steepest segment is the fastest.`,
                `各运动段的速度（千米/时）是${steps(work)}最陡的线段速度最快。`,
              ),
            }),
            figure,
          };
        }
        const l = rng.pick(legs);
        const correct = l.to[1] > l.from[1] ? 0 : l.to[1] === l.from[1] ? 1 : 2;
        const why = [
          t("The segment goes up: the distance from home increases.", "线段上升：离家的距离在增加。"),
          t("The segment is horizontal: the distance from home does not change.", "线段水平：离家的距离不变。"),
          t("The segment goes down: the distance from home decreases.", "线段下降：离家的距离在减少。"),
        ][correct]!;
        return {
          ...choiceProblem({
            prompt: t(
              `${intro.en} What is ${m.the.en} doing between $t = ${l.from[0]}$ and $t = ${l.to[0]}$?`,
              `${intro["zh-CN"]}从 $t = ${l.from[0]}$ 到 $t = ${l.to[0]}$，${m.the["zh-CN"]}在做什么？`,
            ),
            options: [t("Moving away from home", "远离家"), t("Stopped", "停留不动"), t("Returning home", "返回家")],
            correct,
            solution: why,
          }),
          figure,
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
  return { v, sx, sy, pts, legs, figure, intro };
}

export const speedTimeGraphs: TopicDef = {
  id: "speed-time-graphs",
  title: t("Speed-Time Graphs", "速度—时间图"),
  summary: t(
    "Read speeds from a speed-time graph, describe the motion, and find the acceleration from the slope.",
    "从速度—时间图中读出速度，描述运动，并由斜率求加速度。",
  ),
  prerequisites: ["distance-time-graphs"],
  encompasses: [
    { topic: "distance-time-graphs", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.8.F.B.5", "CCSS.HSF.IF.B.6"],
  knowledgePoints: [
    {
      id: "reading-a-speed-time-graph",
      title: t("Reading a speed-time graph", "读速度—时间图"),
      explanation: t(
        "A **speed-time graph** shows speed, $v$, against time, $t$. Unlike a distance-time graph, a **horizontal** segment above the axis means moving at a **constant speed**, not standing still; the object is stopped only where the speed is $0$. A segment going up means speeding up, and one going down means slowing down.",
        "**速度—时间图**表示速度 $v$ 随时间 $t$ 的变化。与距离—时间图不同，在横轴上方的**水平**线段表示**匀速**运动，而不是静止；只有速度为 $0$ 时物体才停止。线段上升表示加速，下降表示减速。",
      ),
      generate(rng) {
        const { v, sx, sy, pts, legs, figure, intro } = motion(rng);
        if (rng.bool()) {
          const l = rng.pick(legs);
          const correct = l.to[1] > l.from[1] ? 0 : l.to[1] < l.from[1] ? 2 : l.from[1] > 0 ? 1 : 3;
          const why = [
            t("The segment goes up: the speed increases.", "线段上升：速度在增加。"),
            t(
              `The segment is horizontal at $v = ${l.from[1] * sy}$: the speed does not change.`,
              `线段在 $v = ${l.from[1] * sy}$ 处水平：速度不变。`,
            ),
            t("The segment goes down: the speed decreases.", "线段下降：速度在减小。"),
            t("The speed is $0$ throughout.", "速度一直是 $0$。"),
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
              solution: why,
            }),
            figure,
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
            solution: t(`At $t = ${px * sx}$ the graph is at $v = ${py * sy}$.`, `$t = ${px * sx}$ 时图像在 $v = ${py * sy}$ 处。`),
          }),
          figure,
        };
      },
    },
    {
      id: "acceleration-from-a-speed-time-graph",
      title: t("Acceleration from the slope", "由斜率求加速度"),
      explanation: t(
        "The slope of a speed-time graph is the change in speed per second: the **acceleration**, in meters per second per second ($\\text{m/s}^2$). Speeding up gives a positive acceleration, slowing down a negative one, and a constant speed an acceleration of $0$.\n\nFrom $(4, 12)$ to $(10, 0)$, the acceleration is $\\frac{0 - 12}{10 - 4} = -2\\ \\text{m/s}^2$.",
        "速度—时间图的斜率是每秒速度的变化量，即**加速度**，单位是米每二次方秒（$\\text{m/s}^2$）。加速时加速度为正，减速时为负，匀速时为 $0$。\n\n从 $(4, 12)$ 到 $(10, 0)$，加速度是 $\\frac{0 - 12}{10 - 4} = -2\\ \\text{m/s}^2$。",
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const { v, sx, sy, legs, figure, intro } = motion(rng);
        const changing = legs.filter((l) => l.to[1] !== l.from[1]);
        const l = rng.bool(0.85) ? rng.pick(changing) : rng.pick(legs);
        const [t1, t2, v1, v2] = [l.from[0] * sx, l.to[0] * sx, l.from[1] * sy, l.to[1] * sy];
        const a = Q.of(v2 - v1, t2 - t1);
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} What is the acceleration of ${v.the.en}, in $\\text{m/s}^2$, between $t = ${t1}$ and $t = ${t2}$?`,
              `${intro["zh-CN"]}从 $t = ${t1}$ 到 $t = ${t2}$，${v.the["zh-CN"]}的加速度是多少 $\\text{m/s}^2$？`,
            ),
            answer: a,
            wrong: [a.neg(), v2 - v1, Q.of(v2, t2), ...(v2 === v1 ? [v1] : [Q.of(t2 - t1, v2 - v1)])],
            solution: t(
              `The speed changes from $${v1}$ to $${v2}$ m/s in $${t2 - t1}$ s: ${steps(`a = \\frac{${v2} - ${v1}}{${t2} - ${t1}} = ${num(a)}`)}`,
              `速度在 $${t2 - t1}$ 秒内从 $${v1}$ 米/秒变为 $${v2}$ 米/秒：${steps(`a = \\frac{${v2} - ${v1}}{${t2} - ${t1}} = ${num(a)}`)}`,
            ),
          }),
          figure,
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
  knowledgePoints: [
    {
      id: "distance-at-constant-speed",
      title: t("Distance at a constant speed", "匀速运动的路程"),
      explanation: t(
        "At a constant speed, distance is speed times time. On a speed-time graph this product is the **area of the rectangle** under the horizontal segment: its height is the speed and its width is the time. At $12$ m/s from $t = 5$ to $t = 15$, the distance is $12 \\cdot 10 = 120$ m.",
        "匀速运动时，路程等于速度乘以时间。在速度—时间图上，这个乘积就是水平线段下方**矩形的面积**：高是速度，宽是时间。以 $12$ 米/秒从 $t = 5$ 运动到 $t = 15$，路程是 $12 \\cdot 10 = 120$ 米。",
      ),
      generate(rng) {
        const { v, sx, sy, legs, figure, intro } = motion(rng);
        const l = rng.pick(legs.filter((g) => g.from[1] === g.to[1] && g.from[1] > 0));
        const [t1, t2, sp] = [l.from[0] * sx, l.to[0] * sx, l.from[1] * sy];
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} How many meters does ${v.the.en} travel between $t = ${t1}$ and $t = ${t2}$?`,
              `${intro["zh-CN"]}从 $t = ${t1}$ 到 $t = ${t2}$，${v.the["zh-CN"]}行进了多少米？`,
            ),
            answer: sp * (t2 - t1),
            wrong: [sp * t2, sp + t2 - t1, Q.of(sp * (t2 - t1), 2)],
            solution: t(
              `The speed is a constant $${sp}$ m/s for $${t2 - t1}$ s. The area of the rectangle under the segment is ${steps(`${sp} \\cdot ${t2 - t1} = ${sp * (t2 - t1)}`)}so the distance is $${sp * (t2 - t1)}$ m.`,
              `速度在 $${t2 - t1}$ 秒内保持 $${sp}$ 米/秒。线段下方矩形的面积是${steps(`${sp} \\cdot ${t2 - t1} = ${sp * (t2 - t1)}`)}所以路程是 $${sp * (t2 - t1)}$ 米。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "distance-while-changing-speed",
      title: t("Distance while the speed changes", "变速运动的路程"),
      explanation: t(
        "The distance traveled is the **area under** the speed-time graph in every case. While speeding up from rest, the region is a triangle: from $0$ to $10$ m/s in $4$ s covers $\\frac{1}{2} \\cdot 4 \\cdot 10 = 20$ m. Between two nonzero speeds it is a trapezoid: from $6$ to $10$ m/s in $4$ s covers $\\frac{1}{2}(6 + 10) \\cdot 4 = 32$ m.",
        "无论哪种情况，路程都是速度—时间图**下方的面积**。从静止加速时，这个区域是三角形：$4$ 秒内从 $0$ 加速到 $10$ 米/秒，行进 $\\frac{1}{2} \\cdot 4 \\cdot 10 = 20$ 米。在两个非零速度之间，它是梯形：$4$ 秒内从 $6$ 米/秒变为 $10$ 米/秒，行进 $\\frac{1}{2}(6 + 10) \\cdot 4 = 32$ 米。",
      ),
      keyPrerequisites: ["area-of-trapezoids"],
      generate(rng) {
        const { v, sx, sy, legs, figure, intro } = motion(rng);
        const l = rng.pick(legs.filter((g) => g.from[1] !== g.to[1]));
        const [t1, t2, v1, v2] = [l.from[0] * sx, l.to[0] * sx, l.from[1] * sy, l.to[1] * sy];
        const d = legArea(l, sx, sy);
        return {
          ...numberProblem({
            prompt: t(
              `${intro.en} How many meters does ${v.the.en} travel between $t = ${t1}$ and $t = ${t2}$?`,
              `${intro["zh-CN"]}从 $t = ${t1}$ 到 $t = ${t2}$，${v.the["zh-CN"]}行进了多少米？`,
            ),
            answer: d,
            wrong: [Math.max(v1, v2) * (t2 - t1), Q.of(Math.abs(v2 - v1) * (t2 - t1), 2), Math.max(v1, v2) * t2],
            solution: t(
              `The region under the segment is a ${v1 === 0 || v2 === 0 ? "triangle" : "trapezoid"}: ${steps(areaWork(l, sx, sy))}so the distance is $${num(d)}$ m.`,
              `线段下方的区域是${v1 === 0 || v2 === 0 ? "三角形" : "梯形"}：${steps(areaWork(l, sx, sy))}所以路程是 $${num(d)}$ 米。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "total-distance-and-average-speed",
      title: t("Total distance and average speed", "总路程与平均速度"),
      explanation: t(
        "For a whole trip, split the region under the graph into rectangles, triangles and trapezoids and add their areas. The **average speed** is the total distance divided by the total time: a trip of $150$ m in $20$ s has an average speed of $7.5$ m/s.",
        "对于整个行程，把图像下方的区域分成矩形、三角形和梯形，再把面积相加。**平均速度**等于总路程除以总时间：$20$ 秒内行进 $150$ 米，平均速度是 $7.5$ 米/秒。",
      ),
      generate(rng) {
        const { v, sx, sy, legs, figure, intro } = motion(rng);
        const parts = legs.filter((l) => l.from[1] + l.to[1] > 0);
        const total = parts.reduce((s, l) => s.add(legArea(l, sx, sy)), Q.zero);
        const T = legs[legs.length - 1]!.to[0] * sx;
        const top = Math.max(...legs.map((l) => l.to[1])) * sy;
        const noHalves = parts.reduce((s, l) => s + Math.max(l.from[1], l.to[1]) * sy * (l.to[0] - l.from[0]) * sx, 0);
        const work = steps(...parts.map((l) => areaWork(l, sx, sy)));
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
                `Add the areas of the parts of the region under the graph: ${work}The total distance is $${num(total)}$ m.`,
                `把图像下方各部分的面积相加：${work}总路程是 $${num(total)}$ 米。`,
              ),
            }),
            figure,
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
              `The distance is the area under the graph: ${work}In all $${num(total)}$ m in $${T}$ s, so the average speed is $\\frac{${num(total)}}{${T}} = ${num(avg)}$ m/s.`,
              `路程是图像下方的面积：${work}共 $${num(total)}$ 米，用时 $${T}$ 秒，所以平均速度是 $\\frac{${num(total)}}{${T}} = ${num(avg)}$ 米/秒。`,
            ),
          }),
          figure,
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
const plain = (s: string) =>
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
  const text = ineqs.map((i) => plain(ineqLatex(i))).join(", ");
  return {
    svg: plane(inequalityView, [{ kind: "region", halfPlanes: ineqs.map(halfPlaneOf) }, ...ineqs.map(boundaryMark)]),
    alt: t(
      `The region where ${text}, with ${ineqs.length === 1 ? "its boundary line" : "the boundary lines"} drawn ${ineqs.map((i) => (isStrict(i.op) ? "dashed" : "solid")).join(" and ")}.`,
      `${text} 的区域，边界线分别画成${ineqs.map((i) => (isStrict(i.op) ? "虚线" : "实线")).join("和")}。`,
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
  const head = `${num(m)} \\cdot ${paren(x)}`;
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

/** describeGraph explains the boundary and the side of y op mx + b. */
function describeGraph(q: Ineq): Text {
  const line = `y = ${linear(q.m, q.b)}`;
  return t(
    `The boundary is $${line}$, drawn ${isStrict(q.op) ? `dashed because $${relSymbol(q.op)}$ leaves out the points on it` : `solid because $${relSymbol(q.op)}$ includes the points on it`}. The solutions have $y$ ${isAbove(q.op) ? "greater" : "less"} than on the line, so the region ${isAbove(q.op) ? "above" : "below"} it is shaded.`,
    `边界线是 $${line}$，${isStrict(q.op) ? `画成虚线，因为 $${relSymbol(q.op)}$ 不包含线上的点` : `画成实线，因为 $${relSymbol(q.op)}$ 包含线上的点`}。解的 $y$ 值${isAbove(q.op) ? "大于" : "小于"}直线上的值，所以涂${isAbove(q.op) ? "上方" : "下方"}的区域。`,
  );
}

export const graphingStrictLinearInequalities: TopicDef = {
  id: "graphing-strict-linear-inequalities",
  title: t("Graphing Strict Two-Variable Linear Inequalities", "二元一次严格不等式的图像"),
  summary: t(
    "Check solutions of inequalities such as $y < 2x + 1$ and graph them as half-planes with a dashed boundary.",
    "检验 $y < 2x + 1$ 这类不等式的解，并把它们画成以虚线为边界的半平面。",
  ),
  prerequisites: ["slope-intercept-form", "inequalities-and-solutions"],
  encompasses: [
    { topic: "slope-intercept-form", weight: 0.3 },
    { topic: "inequalities-and-solutions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.REI.D.12"],
  knowledgePoints: [
    {
      id: "solutions-of-a-two-variable-inequality",
      title: t("Solutions of an inequality in two variables", "二元不等式的解"),
      explanation: t(
        "A **solution** of an inequality in $x$ and $y$, such as $y > 2x - 1$, is an ordered pair that makes it true. To check $(3, 7)$, substitute $x = 3$: $2 \\cdot 3 - 1 = 5$, and $7 > 5$ is true, so $(3, 7)$ is a solution. $(3, 5)$ is not: $5 > 5$ is false, because the inequality is **strict**.",
        "关于 $x$ 和 $y$ 的不等式（如 $y > 2x - 1$）的**解**是使它成立的有序数对。检验 $(3, 7)$：代入 $x = 3$，$2 \\cdot 3 - 1 = 5$，$7 > 5$ 成立，所以 $(3, 7)$ 是解。$(3, 5)$ 不是解：$5 > 5$ 不成立，因为这个不等式是**严格**不等式。",
      ),
      keyPrerequisites: ["inequalities-and-solutions"],
      generate(rng) {
        const q = randomIneq(rng, strictOps);
        const [x, y] = testPoint(rng, q, 0.3);
        const ok = holds(y, q.op, q.m.mul(Q.of(x)).add(Q.of(q.b)));
        const shown = rng.bool(0.3) ? reversedLatex(q) : ineqLatex(q);
        const check = checkPoint(q, x, y);
        return choiceProblem({
          prompt: t(`Is $${pointLatex([x, y])}$ a solution of $${shown}$?`, `$${pointLatex([x, y])}$ 是 $${shown}$ 的解吗？`),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `${check.en} So the point ${ok ? "is" : "is not"} a solution.`,
            `${check["zh-CN"]}所以这个点${ok ? "是" : "不是"}解。`,
          ),
        });
      },
    },
    {
      id: "dashed-boundary-and-side",
      title: t("The graph of a strict inequality", "严格不等式的图像"),
      explanation: t(
        "The solutions of $y > mx + b$ are the points **above** the line $y = mx + b$, and those of $y < mx + b$ the points **below** it: a **half-plane**. To graph it, draw the boundary line $y = mx + b$ **dashed**, because its points are not solutions of a strict inequality, and shade the side of the solutions.\n\nIf the inequality is written the other way round, read it from $y$: $2x - 1 < y$ means $y > 2x - 1$, shaded above.",
        "$y > mx + b$ 的解是直线 $y = mx + b$ **上方**的点，$y < mx + b$ 的解是它**下方**的点：一个**半平面**。作图时，把边界线 $y = mx + b$ 画成**虚线**，因为线上的点不是严格不等式的解，再涂出解所在的一侧。\n\n如果不等式写成另一个方向，就从 $y$ 的角度读：$2x - 1 < y$ 就是 $y > 2x - 1$，涂上方。",
      ),
      generate(rng) {
        const q = randomIneq(rng, strictOps);
        const reversed = rng.bool(0.4);
        const shown = reversed ? reversedLatex(q) : ineqLatex(q);
        const graph = describeGraph(q);
        return choiceProblem({
          prompt: t(`Which describes the graph of $${shown}$?`, `哪一项描述了 $${shown}$ 的图像？`),
          options: descriptions,
          correct: descriptionOf(q.op),
          solution: reversed
            ? t(`$${shown}$ means $${ineqLatex(q)}$. ${graph.en}`, `$${shown}$ 就是 $${ineqLatex(q)}$。${graph["zh-CN"]}`)
            : graph,
        });
      },
    },
    {
      id: "strict-inequality-from-a-graph",
      title: t("The inequality of a graph", "由图像写不等式"),
      explanation: t(
        "To read an inequality from its graph, find the equation $y = mx + b$ of the boundary from its $y$-intercept and slope. A dashed line means a strict inequality; shading above means $y >$, shading below means $y <$.",
        "由图像读不等式时，先由边界线的 $y$ 轴截距和斜率写出它的方程 $y = mx + b$。虚线表示严格不等式；涂上方表示 $y >$，涂下方表示 $y <$。",
      ),
      generate(rng) {
        let q: Ineq;
        do q = randomIneq(rng, strictOps);
        while (q.b === 0);
        const candidates = [q, { ...q, op: flip[q.op] }, { ...q, op: toggle[q.op] }, { ...q, m: q.m.neg() }, { ...q, b: -q.b }];
        const order = [0, ...rng.sample([1, 2, 3, 4], 3)];
        const shuffled = rng.shuffle(order);
        return {
          ...choiceProblem({
            prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
            options: shuffled.map((i) => same(`$${ineqLatex(candidates[i]!)}$`)),
            correct: shuffled.indexOf(0),
            solution: describeGraph(q),
          }),
          figure: inequalityGraph([q]),
        };
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "points-on-the-boundary",
      title: t("Points on the boundary", "边界上的点"),
      explanation: t(
        "A point on the boundary line $y = mx + b$ makes both sides equal. It is a solution of $y \\le mx + b$ and $y \\ge mx + b$, but not of $y < mx + b$ or $y > mx + b$. For $y \\le -x + 4$, the point $(1, 3)$ gives $3 \\le 3$, which is true.",
        "边界线 $y = mx + b$ 上的点使两边相等。它是 $y \\le mx + b$ 和 $y \\ge mx + b$ 的解，但不是 $y < mx + b$ 或 $y > mx + b$ 的解。对 $y \\le -x + 4$，点 $(1, 3)$ 给出 $3 \\le 3$，成立。",
      ),
      generate(rng) {
        const q = randomIneq(rng, allOps);
        const [x, y] = testPoint(rng, q, 0.5);
        const ok = holds(y, q.op, q.m.mul(Q.of(x)).add(Q.of(q.b)));
        const shown = rng.bool(0.3) ? reversedLatex(q) : ineqLatex(q);
        const check = checkPoint(q, x, y);
        return choiceProblem({
          prompt: t(`Is $${pointLatex([x, y])}$ a solution of $${shown}$?`, `$${pointLatex([x, y])}$ 是 $${shown}$ 的解吗？`),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `${check.en} So the point ${ok ? "is" : "is not"} a solution.`,
            `${check["zh-CN"]}所以这个点${ok ? "是" : "不是"}解。`,
          ),
        });
      },
    },
    {
      id: "solid-or-dashed",
      title: t("Solid or dashed", "实线还是虚线"),
      explanation: t(
        "For $y \\le mx + b$ or $y \\ge mx + b$, the points of the boundary line are solutions, so the line is drawn **solid**; for $<$ and $>$ it is **dashed**. The side is shaded as before: above for $y >$ or $y \\ge$, below for $y <$ or $y \\le$.",
        "对 $y \\le mx + b$ 或 $y \\ge mx + b$，边界线上的点是解，所以边界线画成**实线**；对 $<$ 和 $>$ 画成**虚线**。涂哪一侧与之前相同：$y >$ 或 $y \\ge$ 涂上方，$y <$ 或 $y \\le$ 涂下方。",
      ),
      generate(rng) {
        const q = randomIneq(rng, allOps);
        const reversed = rng.bool(0.4);
        const shown = reversed ? reversedLatex(q) : ineqLatex(q);
        const graph = describeGraph(q);
        return choiceProblem({
          prompt: t(`Which describes the graph of $${shown}$?`, `哪一项描述了 $${shown}$ 的图像？`),
          options: descriptions,
          correct: descriptionOf(q.op),
          solution: reversed
            ? t(`$${shown}$ means $${ineqLatex(q)}$. ${graph.en}`, `$${shown}$ 就是 $${ineqLatex(q)}$。${graph["zh-CN"]}`)
            : graph,
        });
      },
    },
    {
      id: "inequality-from-a-graph",
      title: t("Reading any inequality from a graph", "由图像读出不等式"),
      explanation: t(
        "To read an inequality from a graph, combine three observations: the equation of the boundary line, whether it is solid ($\\le$, $\\ge$) or dashed ($<$, $>$), and whether the shading is above ($y >$, $y \\ge$) or below ($y <$, $y \\le$).",
        "由图像读不等式要综合三点：边界线的方程，边界线是实线（$\\le$、$\\ge$）还是虚线（$<$、$>$），以及阴影在上方（$y >$、$y \\ge$）还是下方（$y <$、$y \\le$）。",
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
        return {
          ...choiceProblem({
            prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
            options: order.map((i) => same(`$${ineqLatex(candidates[i]!)}$`)),
            correct: order.indexOf(0),
            solution: describeGraph(q),
          }),
          figure: inequalityGraph([q]),
        };
      },
    },
  ],
};

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
    { topic: "properties-of-lines-in-standard-form", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.D.12"],
  knowledgePoints: [
    {
      id: "solving-for-y-first",
      title: t("Inequalities in standard form", "标准式不等式"),
      explanation: t(
        "To see which side of the boundary to shade for $ax + by < c$, solve for $y$. Dividing by a **negative** coefficient of $y$ reverses the inequality:\n\n$$2x - 3y < 6 \\;\\Rightarrow\\; -3y < -2x + 6 \\;\\Rightarrow\\; y > \\tfrac{2}{3}x - 2,$$\n\nso the graph has a dashed boundary and is shaded above.",
        "要判断 $ax + by < c$ 应涂边界的哪一侧，先解出 $y$。除以 $y$ 的**负**系数时，不等号要反向：\n\n$$2x - 3y < 6 \\;\\Rightarrow\\; -3y < -2x + 6 \\;\\Rightarrow\\; y > \\tfrac{2}{3}x - 2,$$\n\n所以图像的边界线是虚线，涂上方。",
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
        return choiceProblem({
          prompt: t(`Which describes the graph of $${shown}$?`, `哪一项描述了 $${shown}$ 的图像？`),
          options: descriptions,
          correct: descriptionOf(solved.op),
          solution: t(
            `Solve for $y$${b < 0 ? `, reversing the inequality when dividing by $${b}$` : ""}: ${steps(`${b}y ${relSymbol(op)} ${linear(-a, c)}`, final)}The boundary is ${isStrict(op) ? "dashed" : "solid"}, and the region ${isAbove(solved.op) ? "above" : "below"} it is shaded.`,
            `解出 $y$${b < 0 ? `，除以 $${b}$ 时不等号反向` : ""}：${steps(`${b}y ${relSymbol(op)} ${linear(-a, c)}`, final)}边界线是${isStrict(op) ? "虚线" : "实线"}，涂${isAbove(solved.op) ? "上方" : "下方"}的区域。`,
          ),
        });
      },
    },
    {
      id: "horizontal-and-vertical-boundaries",
      title: t("Horizontal and vertical boundaries", "水平和竖直的边界"),
      explanation: t(
        "An inequality in one variable can be graphed in the plane too. The solutions of $x > 2$ are all points with $x$-coordinate greater than $2$: the region to the **right** of the vertical line $x = 2$, drawn dashed. The solutions of $y \\le -1$ are the points on or **below** the horizontal line $y = -1$, drawn solid.",
        "一元不等式也可以在平面上作图。$x > 2$ 的解是所有横坐标大于 $2$ 的点：竖直线 $x = 2$ **右侧**的区域，边界画成虚线。$y \\le -1$ 的解是水平线 $y = -1$ 上及其**下方**的点，边界画成实线。",
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
        return {
          ...choiceProblem({
            prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
            options: order.map((i) => same(`$${candidates[i]!}$`)),
            correct: order.indexOf(0),
            solution: t(
              `The boundary is the ${v === "x" ? "vertical" : "horizontal"} line $${v} = ${k}$, drawn ${isStrict(op) ? "dashed" : "solid"}, and the region ${side[0]} of it is shaded: $${candidates[0]}$.`,
              `边界是${v === "x" ? "竖直" : "水平"}线 $${v} = ${k}$，画成${isStrict(op) ? "虚线" : "实线"}，涂它${side[1]}的区域：$${candidates[0]}$。`,
            ),
          }),
          figure: {
            svg: plane(inequalityView, [{ kind: "region", halfPlanes: [hp] }, line]),
            alt: t(
              `The region where ${plain(candidates[0]!)}, with its boundary line drawn ${isStrict(op) ? "dashed" : "solid"}.`,
              `${plain(candidates[0]!)} 的区域，边界线画成${isStrict(op) ? "虚线" : "实线"}。`,
            ),
          },
        };
      },
    },
    {
      id: "standard-form-from-a-graph-with-a-test-point",
      title: t("Using a test point", "用测试点判断"),
      explanation: t(
        "A **test point** not on the boundary tells which side is shaded: if it satisfies the inequality, its whole side is shaded; otherwise the other side is. The origin $(0, 0)$ is the easiest test point when the boundary does not pass through it.\n\nFor $3x + 2y \\ge 6$, the origin gives $0 \\ge 6$, false, so the side **away** from the origin is shaded.",
        "取一个不在边界上的**测试点**就能判断涂哪一侧：如果它满足不等式，就涂它所在的一侧；否则涂另一侧。边界线不经过原点时，原点 $(0, 0)$ 是最方便的测试点。\n\n对 $3x + 2y \\ge 6$，原点给出 $0 \\ge 6$，不成立，所以涂**不含**原点的一侧。",
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
        return {
          ...choiceProblem({
            prompt: t("Which inequality does the graph show?", "图像表示的是哪个不等式？"),
            options: order.map((i) => same(`$${lhs} ${relSymbol(opsByIndex[i]!)} ${C}$`)),
            correct: order.indexOf(0),
            solution: t(
              `The boundary through $${pointLatex([p, 0])}$ and $${pointLatex([0, q])}$ is $${lhs} = ${C}$, drawn ${strict ? "dashed" : "solid"}. The origin is ${originOk ? "inside" : "outside"} the shaded region, and $0 ${relSymbol(op)} ${C}$ is ${originOk ? "true" : "false"}: $${lhs} ${relSymbol(op)} ${C}$.`,
              `经过 $${pointLatex([p, 0])}$ 和 $${pointLatex([0, q])}$ 的边界线是 $${lhs} = ${C}$，画成${strict ? "虚线" : "实线"}。原点${originOk ? "在" : "不在"}阴影区域内，而 $0 ${relSymbol(op)} ${C}$ ${originOk ? "成立" : "不成立"}：$${lhs} ${relSymbol(op)} ${C}$。`,
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
              `The region where ${plain(`${lhs} ${relSymbol(op)} ${C}`)}, with its boundary through (${p}, 0) and (0, ${q}) drawn ${strict ? "dashed" : "solid"}.`,
              `${plain(`${lhs} ${relSymbol(op)} ${C}`)} 的区域，边界线经过 (${p}, 0) 和 (0, ${q})，画成${strict ? "虚线" : "实线"}。`,
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

export const systemsOfLinearInequalities: TopicDef = {
  id: "systems-of-linear-inequalities",
  title: t("Systems of Linear Inequalities", "二元一次不等式组"),
  summary: t(
    "Check solutions of a system of linear inequalities and recognize its graph as the overlap of half-planes.",
    "检验二元一次不等式组的解，并把它的图像看作几个半平面的公共部分。",
  ),
  prerequisites: ["further-graphing-linear-inequalities", "systems-of-linear-equations"],
  encompasses: [
    { topic: "graphing-non-strict-linear-inequalities", weight: 0.5 },
    { topic: "further-graphing-linear-inequalities", weight: 0.2 },
    { topic: "systems-of-linear-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.D.12"],
  knowledgePoints: [
    {
      id: "checking-a-solution-of-a-system",
      title: t("Solutions of a system of inequalities", "不等式组的解"),
      explanation: t(
        "A **solution** of a system of inequalities satisfies **every** inequality of the system. Check a point in each one: $(1, 4)$ solves $\\begin{cases} y > x \\\\ y \\le 5 - x \\end{cases}$ because $4 > 1$ and $4 \\le 4$. A point that fails one inequality is not a solution.",
        "不等式组的**解**要满足组中的**每一个**不等式。把点逐一代入检验：$(1, 4)$ 是 $\\begin{cases} y > x \\\\ y \\le 5 - x \\end{cases}$ 的解，因为 $4 > 1$ 且 $4 \\le 4$。不满足其中一个不等式的点就不是解。",
      ),
      generate(rng) {
        const [q1, q2] = crossingPair(rng, allOps);
        const x = rng.int(-4, 4);
        const v1 = q1.m.mul(Q.of(x)).add(Q.of(q1.b));
        const v2 = q2.m.mul(Q.of(x)).add(Q.of(q2.b));
        const base = rng.pick([v1, v2]);
        const y = base.isInteger() ? base.add(Q.of(rng.int(-2, 2))) : Q.of(Math.round(base.toNumber()) + rng.int(-1, 1));
        const [ok1, ok2] = [satisfies(q1, x, y), satisfies(q2, x, y)];
        const [c1, c2] = [checkPoint(q1, x, y), checkPoint(q2, x, y)];
        const ok = ok1 && ok2;
        return choiceProblem({
          prompt: t(
            `Is $${pointLatex([x, y])}$ a solution of the system $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$`,
            `$${pointLatex([x, y])}$ 是不等式组 $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$ 的解吗？`,
          ),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `First inequality: ${c1.en} Second inequality: ${c2.en} ${ok ? "Both hold, so the point is a solution." : "The point fails at least one inequality, so it is not a solution."}`,
            `第一个不等式：${c1["zh-CN"]}第二个不等式：${c2["zh-CN"]}${ok ? "两个都成立，所以是解。" : "至少一个不成立，所以不是解。"}`,
          ),
        });
      },
    },
    {
      id: "system-from-a-graph",
      title: t("The graph of a system", "不等式组的图像"),
      explanation: t(
        "The solutions of a system of inequalities are the points in the **overlap** of the regions of its inequalities. To read a system from its graph, write one inequality for each boundary line: its equation, solid or dashed, and the side on which the overlap lies.",
        "不等式组的解是各个不等式的区域的**公共部分**中的点。由图像读不等式组时，为每条边界线写一个不等式：它的方程、实线或虚线，以及公共部分在它的哪一侧。",
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
        return {
          ...choiceProblem({
            prompt: t("Which system of inequalities does the graph show?", "图像表示的是哪个不等式组？"),
            options: order.map((i) => same(`$${systemLatex(candidates[i]!.map(ineqLatex))}$`)),
            correct: order.indexOf(0),
            solution: t(
              `${d1.en} ${d2.en} The overlap of the two regions is the shaded part.`,
              `${d1["zh-CN"]}${d2["zh-CN"]}两个区域的公共部分就是阴影部分。`,
            ),
          }),
          figure: inequalityGraph([q1, q2]),
        };
      },
    },
    {
      id: "finding-a-solution-of-a-system",
      title: t("Finding a solution", "找出一个解"),
      explanation: t(
        "To decide which of several points solves a system, test each point in every inequality and keep only the point that passes all of them. As soon as one inequality fails, the point can be rejected.",
        "要判断几个点中哪一个是不等式组的解，把每个点代入每个不等式检验，只保留全部通过的点。只要有一个不等式不成立，这个点就可以排除。",
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
        return choiceProblem({
          prompt: t(
            `Which point is a solution of the system $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$`,
            `哪个点是不等式组 $$${systemLatex([ineqLatex(q1), ineqLatex(q2)])}$$ 的解？`,
          ),
          options: pts.map((p) => same(`$${pointLatex(p)}$`)),
          correct: pts.indexOf(answer),
          solution: t(
            `For $${pointLatex(answer)}$: ${c1.en} ${c2.en} The others fail: ${failing.map((f) => f.en).join("; ")}.`,
            `对 $${pointLatex(answer)}$：${c1["zh-CN"]}${c2["zh-CN"]}其他点不满足：${failing.map((f) => f["zh-CN"]).join("；")}。`,
          ),
        });
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
        `博物馆成人票每张 ${a} 元，儿童票每张 ${b} 元。一个俱乐部最多能花 ${L} 元。`,
      ),
    vars: t("Let $x$ be the number of adult tickets and $y$ the number of child tickets.", "设买成人票 $x$ 张，儿童票 $y$ 张。"),
    askY: (x) =>
      t(
        `If the club buys ${x} adult tickets, what is the greatest number of child tickets it can buy?`,
        `如果俱乐部买 ${x} 张成人票，最多还能买多少张儿童票？`,
      ),
    askPair: (x, y) => t(`Can the club buy ${x} adult tickets and ${y} child tickets?`, `俱乐部能买 ${x} 张成人票和 ${y} 张儿童票吗？`),
  },
  {
    a: [12, 20, 1],
    b: [8, 15, 1],
    limit: [200, 500, 20],
    op: ">=",
    describe: (a, b, L) =>
      t(
        `Mia earns ${dollars(a)} per hour tutoring and ${dollars(b)} per hour babysitting. She wants to earn at least ${dollars(L)} this month.`,
        `米娅做家教每小时挣 ${a} 元，照看小孩每小时挣 ${b} 元。她这个月想至少挣 ${L} 元。`,
      ),
    vars: t("Let $x$ be her hours of tutoring and $y$ her hours of babysitting.", "设她做家教 $x$ 小时，照看小孩 $y$ 小时。"),
    askY: (x) =>
      t(
        `If she tutors for ${x} hours, what is the least number of whole hours she must babysit?`,
        `如果她做家教 ${x} 小时，她至少还要照看小孩多少个整小时？`,
      ),
    askPair: (x, y) =>
      t(
        `Does she reach her goal with ${x} hours of tutoring and ${y} hours of babysitting?`,
        `做家教 ${x} 小时、照看小孩 ${y} 小时，她能达到目标吗？`,
      ),
  },
  {
    a: [15, 30, 1],
    b: [4, 12, 1],
    limit: [200, 600, 25],
    op: "<=",
    describe: (a, b, L) =>
      t(
        `A van can carry at most ${L} kg. Large boxes weigh ${a} kg and small boxes weigh ${b} kg.`,
        `一辆货车最多能载 ${L} 千克。大箱子每个重 ${a} 千克，小箱子每个重 ${b} 千克。`,
      ),
    vars: t("Let $x$ be the number of large boxes and $y$ the number of small boxes.", "设装大箱子 $x$ 个，小箱子 $y$ 个。"),
    askY: (x) =>
      t(
        `If the van carries ${x} large boxes, what is the greatest number of small boxes it can also carry?`,
        `如果货车装了 ${x} 个大箱子，最多还能装多少个小箱子？`,
      ),
    askPair: (x, y) => t(`Can the van carry ${x} large boxes and ${y} small boxes?`, `货车能装 ${x} 个大箱子和 ${y} 个小箱子吗？`),
  },
  {
    a: [3, 3, 1],
    b: [1, 1, 1],
    limit: [30, 70, 1],
    op: ">=",
    describe: (_a, _b, L) =>
      t(
        `A soccer team gets 3 points for a win and 1 point for a draw. It needs at least ${L} points to qualify.`,
        `一支足球队赢一场得 3 分，平一场得 1 分。它至少需要 ${L} 分才能晋级。`,
      ),
    vars: t("Let $x$ be the number of wins and $y$ the number of draws.", "设赢 $x$ 场，平 $y$ 场。"),
    askY: (x) =>
      t(`If the team wins ${x} games, what is the least number of draws it needs?`, `如果球队赢了 ${x} 场，它至少还需要平多少场？`),
    askPair: (x, y) => t(`Does the team qualify with ${x} wins and ${y} draws?`, `球队赢 ${x} 场、平 ${y} 场能晋级吗？`),
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
    { topic: "graphing-non-strict-linear-inequalities", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.3"],
  knowledgePoints: [
    {
      id: "writing-a-two-variable-inequality",
      title: t("Writing the inequality", "写出不等式"),
      explanation: t(
        "A limit on a total of two kinds of items gives an inequality in two variables. Write the total as $ax + by$, as for an equation, then choose the symbol from the words: “at most” and “no more than” give $\\le$; “at least” and “no less than” give $\\ge$.\n\nPens at $\\$2$ and notebooks at $\\$5$, with at most $\\$40$ to spend: $2x + 5y \\le 40$.",
        "对两类物品总量的限制给出一个二元不等式。像列方程一样把总量写成 $ax + by$，再根据文字选择符号：“至多”“不超过”用 $\\le$；“至少”“不少于”用 $\\ge$。\n\n钢笔每支 $2$ 元，笔记本每本 $5$ 元，最多花 $40$ 元：$2x + 5y \\le 40$。",
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
        return choiceProblem({
          prompt: t(
            `${c.describe(a, b, L).en} ${c.vars.en} Which inequality models the situation?`,
            `${c.describe(a, b, L)["zh-CN"]}${c.vars["zh-CN"]}哪个不等式符合题意？`,
          ),
          options: order.map((i) => same(`$${candidates[i]!}$`)),
          correct: order.indexOf(0),
          solution: t(
            `The total is $${total}$, and “${op === "<=" ? "at most" : "at least"}” allows the total to equal $${L}$: $${candidates[0]}$.`,
            `总量是 $${total}$，“${op === "<=" ? "最多" : "至少"}”允许总量等于 $${L}$：$${candidates[0]}$。`,
          ),
        });
      },
    },
    {
      id: "checking-a-combination",
      title: t("Checking a combination", "检验一种组合"),
      explanation: t(
        "To check whether a combination works, substitute it into the inequality. With $2x + 5y \\le 40$, buying $5$ pens and $6$ notebooks costs $2 \\cdot 5 + 5 \\cdot 6 = 40$, and $40 \\le 40$ is true, so it is allowed; $6$ pens and $6$ notebooks cost $42$, which is too much.",
        "要检验某种组合是否可行，把它代入不等式。对 $2x + 5y \\le 40$，买 $5$ 支钢笔和 $6$ 本笔记本花 $2 \\cdot 5 + 5 \\cdot 6 = 40$ 元，$40 \\le 40$ 成立，所以可以；买 $6$ 支钢笔和 $6$ 本笔记本要 $42$ 元，超出预算。",
      ),
      generate(rng) {
        const c = rng.pick(limitContexts);
        const [a, b, L] = limitValues(rng, c);
        const x = rng.int(1, Math.max(1, Math.floor(L / a) - 1));
        const yEdge = Math.floor((L - a * x) / b);
        const y = Math.max(0, yEdge + rng.int(-2, 2) + (c.op === ">=" && (L - a * x) % b !== 0 ? 1 : 0));
        const value = a * x + b * y;
        const ok = holds(value, c.op, L);
        return choiceProblem({
          prompt: t(`${c.describe(a, b, L).en} ${c.askPair(x, y).en}`, `${c.describe(a, b, L)["zh-CN"]}${c.askPair(x, y)["zh-CN"]}`),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `${c.vars.en} The total is $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${value}$, and $${value} ${relSymbol(c.op)} ${L}$ is ${ok ? "true" : "false"}.`,
            `${c.vars["zh-CN"]}总量是 $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${value}$，$${value} ${relSymbol(c.op)} ${L}$ ${ok ? "成立" : "不成立"}。`,
          ),
        });
      },
    },
    {
      id: "the-greatest-or-least-amount",
      title: t("The greatest or least whole amount", "最大或最小的整数量"),
      explanation: t(
        "When one quantity is known, substitute it and solve the inequality for the other. Items come in whole numbers, so round in the direction the inequality allows: with $2x + 5y \\le 40$ and $x = 7$, $5y \\le 26$ gives $y \\le 5.2$, so at most $5$ notebooks. For “at least”, round **up**: $y \\ge 5.2$ means at least $6$.",
        "知道一个量后，把它代入不等式，解出另一个量。物品的个数是整数，所以要按不等式允许的方向取整：对 $2x + 5y \\le 40$ 和 $x = 7$，$5y \\le 26$ 得 $y \\le 5.2$，所以最多买 $5$ 本笔记本。对于“至少”，要**向上**取整：$y \\ge 5.2$ 表示至少 $6$。",
      ),
      generate(rng) {
        const c = rng.pick(limitContexts);
        const [a, b, L] = limitValues(rng, c);
        const x = rng.int(1, Math.max(1, Math.floor(L / a) - 1));
        const rest = L - a * x;
        const bound = Q.of(rest, b);
        const answer = c.op === "<=" ? Math.floor(rest / b) : Math.ceil(rest / b);
        const other = c.op === "<=" ? Math.ceil(rest / b) : Math.floor(rest / b);
        return numberProblem({
          prompt: t(`${c.describe(a, b, L).en} ${c.askY(x).en}`, `${c.describe(a, b, L)["zh-CN"]}${c.askY(x)["zh-CN"]}`),
          answer,
          wrong: [other === answer ? answer + (c.op === "<=" ? 1 : -1) : other, Math.floor(L / b), Math.floor((L - b * x) / a)],
          solution: t(
            `${c.vars.en} Substitute $x = ${x}$: ${steps(`${a} \\cdot ${x} + ${b}y ${relSymbol(c.op)} ${L}`, `${b}y ${relSymbol(c.op)} ${rest}`, `y ${relSymbol(c.op)} ${num(bound)}`)}${bound.isInteger() ? "" : `$y$ is a whole number, so round ${c.op === "<=" ? "down" : "up"}. `}The answer is $${answer}$.`,
            `${c.vars["zh-CN"]}代入 $x = ${x}$：${steps(`${a} \\cdot ${x} + ${b}y ${relSymbol(c.op)} ${L}`, `${b}y ${relSymbol(c.op)} ${rest}`, `y ${relSymbol(c.op)} ${num(bound)}`)}${bound.isInteger() ? "" : `$y$ 是整数，所以${c.op === "<=" ? "向下" : "向上"}取整。`}答案是 $${answer}$。`,
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
        `A farmer has at most ${n} acres to plant with corn and wheat. Corn costs ${dollars(a)} per acre and wheat costs ${dollars(b)} per acre, and the budget is at most ${dollars(r)}.`,
        `农场主最多有 ${n} 英亩地种玉米和小麦。玉米每英亩成本 ${a} 元，小麦每英亩成本 ${b} 元，预算最多 ${r} 元。`,
      ),
    vars: t("Let $x$ be the acres of corn and $y$ the acres of wheat.", "设种玉米 $x$ 英亩，小麦 $y$ 英亩。"),
    askPair: (x, y) =>
      t(`Can the farmer plant ${x} acres of corn and ${y} acres of wheat?`, `农场主能种 ${x} 英亩玉米和 ${y} 英亩小麦吗？`),
    askY: (x) =>
      t(
        `If the farmer plants ${x} acres of corn, what is the greatest whole number of acres of wheat possible?`,
        `如果农场主种 ${x} 英亩玉米，最多还能种多少整英亩小麦？`,
      ),
  },
  {
    a: [20, 45, 5],
    b: [10, 30, 5],
    n: [12, 30, 1],
    ops: ["<=", "<="],
    describe: (a, b, n, r) =>
      t(
        `A bakery's oven bakes at most ${n} cakes and pies a day. A cake takes ${a} minutes of decorating and a pie ${b} minutes, and there are at most ${r} minutes of decorating time.`,
        `面包店的烤箱每天最多烤 ${n} 个蛋糕和馅饼。每个蛋糕要装饰 ${a} 分钟，每个馅饼要 ${b} 分钟，装饰时间最多 ${r} 分钟。`,
      ),
    vars: t("Let $x$ be the number of cakes and $y$ the number of pies.", "设烤蛋糕 $x$ 个，馅饼 $y$ 个。"),
    askPair: (x, y) => t(`Can the bakery make ${x} cakes and ${y} pies in a day?`, `面包店一天能做 ${x} 个蛋糕和 ${y} 个馅饼吗？`),
    askY: (x) =>
      t(
        `If the bakery makes ${x} cakes, what is the greatest number of pies it can make?`,
        `如果面包店做 ${x} 个蛋糕，最多还能做多少个馅饼？`,
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
  knowledgePoints: [
    {
      id: "writing-a-system-of-inequalities",
      title: t("Writing the system", "写出不等式组"),
      explanation: t(
        "When a situation has several limits, write one inequality for each and combine them into a system. A farmer with at most $50$ acres, corn at $\\$120$ and wheat at $\\$80$ per acre, and a budget of at most $\\$5000$:\n\n$$\\begin{cases} x + y \\le 50 \\\\ 120x + 80y \\le 5000 \\end{cases}$$\n\nNumbers of items or acres cannot be negative, so $x \\ge 0$ and $y \\ge 0$ hold as well.",
        "当情境中有多个限制时，为每个限制写一个不等式，组成不等式组。农场主最多有 $50$ 英亩地，玉米每英亩 $120$ 元，小麦每英亩 $80$ 元，预算最多 $5000$ 元：\n\n$$\\begin{cases} x + y \\le 50 \\\\ 120x + 80y \\le 5000 \\end{cases}$$\n\n物品个数或面积不能为负，所以还有 $x \\ge 0$，$y \\ge 0$。",
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
        return choiceProblem({
          prompt: t(
            `${c.describe(a, b, n, r).en} ${c.vars.en} Which system models the situation?`,
            `${c.describe(a, b, n, r)["zh-CN"]}${c.vars["zh-CN"]}哪个不等式组符合题意？`,
          ),
          options: order.map((i) => same(`$${systemLatex(candidates[i]!)}$`)),
          correct: order.indexOf(0),
          solution: t(
            `The count limit is $${candidates[0]![0]}$ and the limit on the total is $${candidates[0]![1]}$, each coefficient multiplying the variable of its own kind.`,
            `数量的限制是 $${candidates[0]![0]}$，总量的限制是 $${candidates[0]![1]}$，每个系数乘以表示它那一类的变量。`,
          ),
        });
      },
    },
    {
      id: "checking-a-plan",
      title: t("Checking a plan", "检验方案"),
      explanation: t(
        "A plan $(x, y)$ is possible only if it satisfies **every** inequality of the system. For the farmer, $30$ acres of corn and $15$ of wheat use $45 \\le 50$ acres but cost $120 \\cdot 30 + 80 \\cdot 15 = 4800 \\le 5000$ dollars, so the plan works; $20$ and $30$ acres use $50$ acres but cost $4800$, which also works, while $35$ and $15$ cost $5400$, over budget.",
        "方案 $(x, y)$ 只有满足不等式组中的**每一个**不等式才可行。对农场主，种玉米 $30$ 英亩、小麦 $15$ 英亩，用地 $45 \\le 50$，成本 $120 \\cdot 30 + 80 \\cdot 15 = 4800 \\le 5000$，可行；种 $20$ 和 $30$ 英亩，用地 $50$，成本 $4800$，也可行；而种 $35$ 和 $15$ 英亩成本 $5400$，超出预算。",
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
        return choiceProblem({
          prompt: t(`${c.describe(a, b, n, r).en} ${c.askPair(x, y).en}`, `${c.describe(a, b, n, r)["zh-CN"]}${c.askPair(x, y)["zh-CN"]}`),
          options: yesNo,
          correct: ok ? 0 : 1,
          solution: t(
            `${c.vars.en} Count: $${x} + ${y} = ${cnt}$, and $${cnt} ${relSymbol(o1)} ${n}$ is ${ok1 ? "true" : "false"}. Total: $${a} \\cdot ${x} + ${b} \\cdot ${y} = ${tot}$, and $${tot} ${relSymbol(o2)} ${r}$ is ${ok2 ? "true" : "false"}. ${ok ? "Both limits are met." : "Not every limit is met."}`,
            `${c.vars["zh-CN"]}数量：$${x} + ${y} = ${cnt}$，$${cnt} ${relSymbol(o1)} ${n}$ ${ok1 ? "成立" : "不成立"}。总量：$${a} \\cdot ${x} + ${b} \\cdot ${y} = ${tot}$，$${tot} ${relSymbol(o2)} ${r}$ ${ok2 ? "成立" : "不成立"}。${ok ? "两个限制都满足。" : "并非所有限制都满足。"}`,
          ),
        });
      },
    },
    {
      id: "the-best-whole-amount-under-two-limits",
      title: t("The most or least under two limits", "两个限制下的最大或最小值"),
      explanation: t(
        "With one quantity known, each inequality gives its own bound on the other, and both must hold. When both limits are upper bounds, the answer is the **smaller** of the two bounds; when both are lower bounds, the **larger**. For the farmer with $x = 30$: $y \\le 20$ from the acres and $80y \\le 1400$, so $y \\le 17.5$, from the budget: at most $17$ acres of wheat.",
        "知道一个量后，每个不等式都给出另一个量的一个界限，而且必须同时满足。两个限制都是上界时，答案取两个上界中**较小**的一个；都是下界时取**较大**的一个。对 $x = 30$ 的农场主：由面积得 $y \\le 20$，由预算得 $80y \\le 1400$，即 $y \\le 17.5$：最多种 $17$ 英亩小麦。",
      ),
      generate(rng) {
        const c = rng.pick(planningContexts.filter((p) => p.askY));
        const [a, b, n, r] = planningValues(rng, c);
        const upper = c.ops[0] === "<=";
        const x = rng.int(1, n - 1);
        const fromCount = n - x;
        const rest = r - a * x;
        const fromTotal = upper ? Math.floor(rest / b) : Math.ceil(rest / b);
        const answer = upper ? Math.max(0, Math.min(fromCount, fromTotal)) : Math.max(0, fromCount, fromTotal);
        const op = c.ops[0];
        return numberProblem({
          prompt: t(`${c.describe(a, b, n, r).en} ${c.askY!(x).en}`, `${c.describe(a, b, n, r)["zh-CN"]}${c.askY!(x)["zh-CN"]}`),
          answer,
          wrong: [fromCount, fromTotal, upper ? Math.max(fromCount, fromTotal) : Math.min(fromCount, fromTotal), Math.floor(r / b)],
          solution: t(
            `${c.vars.en} With $x = ${x}$, the count gives $y ${relSymbol(op)} ${fromCount}$ and the total gives $${b}y ${relSymbol(op)} ${rest}$, so $y ${relSymbol(op)} ${num(Q.of(rest, b))}$${Q.of(rest, b).isInteger() ? "" : `, that is $y ${relSymbol(op)} ${fromTotal}$ in whole numbers`}. Both must hold, so the answer is the ${upper ? "smaller" : "larger"} bound: $${answer}$.`,
            `${c.vars["zh-CN"]}当 $x = ${x}$ 时，由数量得 $y ${relSymbol(op)} ${fromCount}$，由总量得 $${b}y ${relSymbol(op)} ${rest}$，即 $y ${relSymbol(op)} ${num(Q.of(rest, b))}$${Q.of(rest, b).isInteger() ? "" : `，取整数即 $y ${relSymbol(op)} ${fromTotal}$`}。两者必须同时满足，所以答案取${upper ? "较小" : "较大"}的界限：$${answer}$。`,
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
