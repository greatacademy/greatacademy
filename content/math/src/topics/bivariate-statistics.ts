import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dec, linear, num, type PlaneMark, type PlaneView, paren, plane, Q } from "@ga/subject-math";

import { choiceProblem, equationProblem, numberProblem, pointLatex, steps } from "../problems.ts";

/** Pt is a data point (x, y). */
type Pt = readonly [number, number];

/** Pair is a phrase in English and Chinese. */
type Pair = readonly [string, string];

/** view is the first-quadrant window of the scatter plots. */
const view: PlaneView = { xMin: 0, xMax: 10, yMin: 0, yMax: 10, labelEvery: 2 };

/** plain writes a coordinate for alt text, to one decimal place. */
const plain = (v: number) => String(Math.round(v * 10) / 10);

/** scatterFigure draws data points, and any extra marks such as a trend line, in the first quadrant. */
function scatterFigure(points: readonly Pt[], extra: readonly PlaneMark[] = [], line?: Pair): Figure {
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
const plainLine = (m: Q, b: Q) => `y = ${linear(m, b).replace(/\\frac\{(\d+)\}\{(\d+)\}/g, "$1/$2")}`;

/** lineMark draws the line y = mx + b. */
const lineMark = (m: Q, b: Q, dashed = false): PlaneMark => ({
  kind: "line",
  a: [0, b.toNumber()],
  b: [1, b.add(m).toNumber()],
  accent: true,
  dashed,
});

/** near places points at the given x near the line y = mx + b, with integer y and noise up to ±noise, or returns undefined when one leaves 1…9. */
function near(rng: Rng, xs: readonly number[], m: Q, b: Q, noise: number): Pt[] | undefined {
  const pts = xs.map((x): Pt => [x, Math.round(m.mul(Q.of(x)).add(b).toNumber()) + rng.int(-noise, noise)]);
  return pts.every(([, y]) => y >= 1 && y <= 9) ? pts : undefined;
}

/** xsOf draws n distinct x-values from 1 to 9, sorted. */
const xsOf = (rng: Rng, n: number) => rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], n).sort((a, b) => a - b);

/** pearson is the correlation coefficient of the points, used only to classify generated data. */
function pearson(pts: readonly Pt[]): number {
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
function shuffledChoice(rng: Rng, p: { prompt: Text; correct: Text; wrong: readonly Text[]; solution: Text }) {
  const options = rng.shuffle([p.correct, ...p.wrong]);
  return choiceProblem({ prompt: p.prompt, options, correct: options.indexOf(p.correct), solution: p.solution });
}

/** decimalForm asks for a decimal answer when the answer is not an integer. */
const decimalForm = (v: Q) => (v.isInteger() ? {} : { form: "decimal" as const });

/** Scene is a small data set drawn on a scatter plot. */
interface Scene {
  /** items counts the items with their measure word: "students" / "名学生". */
  readonly items: Pair;
  readonly item: Pair;
  readonly x: Pair;
  readonly y: Pair;
  readonly dir: 1 | -1;
}

const scenes: readonly Scene[] = [
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
    y: ["number of park visitors, in hundreds", "公园游客数（百人）"],
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
const sceneIntro = (s: Scene, n: number) =>
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
  knowledgePoints: [
    {
      id: "reading-a-scatter-plot",
      title: t("Reading a scatter plot", "读散点图"),
      explanation: t(
        "**Bivariate data** pair two measurements of each item, such as the hours a student studied and the score the student got. A **scatter plot** shows each pair as one point $(x, y)$: the first variable on the $x$-axis, the second on the $y$-axis.\n\nTo read the data of one item, find its point and read both coordinates. If the student who studied $4$ hours is the point $(4, 7)$, that student scored $7$.",
        "**双变量数据**对每个对象记录两项测量，例如学生的学习时长和他的得分。**散点图**把每一对数据画成一个点 $(x, y)$：第一个变量对应 $x$ 轴，第二个变量对应 $y$ 轴。\n\n要读出某个对象的数据，找到它的点，读出两个坐标。如果学习 $4$ 小时的学生对应点 $(4, 7)$，那么这名学生得了 $7$ 分。",
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
                `The only point at height $${y0}$ is $${pointLatex([x0, y0])}$, so $x = ${x0}$.`,
                `高度为 $${y0}$ 的点只有 $${pointLatex([x0, y0])}$，所以 $x = ${x0}$。`,
              ),
            }),
            figure,
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
              `The point above $x = ${x0}$ is $${pointLatex([x0, y0])}$, so the ${s.y[0]} is $${y0}$.`,
              `$x = ${x0}$ 上方的点是 $${pointLatex([x0, y0])}$，所以${s.y[1]}是 $${y0}$。`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "counting-points",
      title: t("Counting points that meet a condition", "数出满足条件的点"),
      explanation: t(
        "A scatter plot answers questions about the whole data set. To count the items with $x > 5$, count the points strictly to the right of the vertical line $x = 5$; for $x \\ge 5$, count the points on that line too.\n\nLikewise, $y < 3$ means the points strictly below the horizontal line $y = 3$.",
        "散点图可以回答关于整组数据的问题。要数出 $x > 5$ 的对象，就数竖直线 $x = 5$ 右侧（不含线上）的点；若是 $x \\ge 5$，线上的点也要算。\n\n同样，$y < 3$ 指严格位于水平线 $y = 3$ 下方的点。",
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
              `Count the points ${side.en} the line $${v} = ${k}$${inclusive ? ", together with the points on it" : ", leaving out the points on it"}. ${onLine === 1 ? "One point lies" : `${onLine} points lie`} on the line, and the answer is $${count}$.`,
              `数出直线 $${v} = ${k}$ ${side["zh-CN"]}的点${inclusive ? "，线上的点也要算" : "，线上的点不算"}。线上有 ${onLine} 个点，答案是 $${count}$。`,
            ),
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "making-a-scatter-plot",
      title: t("Plotting the data", "描点画散点图"),
      explanation: t(
        "To make a scatter plot from a table, plot one point for each column: the $x$-value is the first coordinate, so go right $x$ units, then up $y$ units.\n\nA common mistake is to swap the coordinates: the pair $x = 2$, $y = 7$ is the point $(2, 7)$, not $(7, 2)$.",
        "由表格画散点图时，每一列画一个点：$x$ 值是第一个坐标，先向右走 $x$ 个单位，再向上走 $y$ 个单位。\n\n常见错误是把坐标弄反：$x = 2$、$y = 7$ 这一对数据是点 $(2, 7)$，不是 $(7, 2)$。",
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
                `The pair $x = ${bx}$, $y = ${by}$ should be the point $${pointLatex([bx, by])}$, but it was plotted at $${pointLatex(swapped)}$, with its coordinates swapped. Every other point is in its place.`,
                `数据 $x = ${bx}$、$y = ${by}$ 应是点 $${pointLatex([bx, by])}$，却画在了 $${pointLatex(swapped)}$，坐标弄反了。其余各点都画对了。`,
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

export const trendLines: TopicDef = {
  id: "trend-lines",
  title: t("Trend Lines", "趋势线"),
  summary: t(
    "Judge whether a line fits a scatter plot, and write the equation of a trend line.",
    "判断一条直线是否拟合散点图，并写出趋势线的方程。",
  ),
  prerequisites: ["scatter-plots", "slope-intercept-form"],
  encompasses: [
    { topic: "scatter-plots", weight: 0.3 },
    { topic: "slope-intercept-form", weight: 0.4 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.8.SP.A.2", "CCSS.8.SP.A.3"],
  knowledgePoints: [
    {
      id: "judging-a-trend-line",
      title: t("A good trend line", "好的趋势线"),
      explanation: t(
        "When the points of a scatter plot lie roughly along a line, a **trend line** (line of best fit) summarizes them. A good trend line:\n\n- follows the direction of the points: rising when they rise, falling when they fall;\n- runs through the middle of the points, with about as many above it as below it;\n- need not pass through any of the points.\n\nA line with all the points on one side of it is too high or too low, even if its direction is right.",
        "当散点图中的点大致沿一条直线分布时，可以用一条**趋势线**（最佳拟合直线）来概括它们。好的趋势线：\n\n- 与点的走向一致：点上升它就上升，点下降它就下降；\n- 从点的中间穿过，上下两侧的点大致一样多；\n- 不一定要经过任何一个点。\n\n如果所有点都在直线的同一侧，即使方向正确，这条直线也太高或太低了。",
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
          const reason = [
            t(
              `The line rises or falls with the points, and ${above} points lie above it and ${below} below it: it is a good trend line.`,
              `直线与点的走向一致，上方有 ${above} 个点，下方有 ${below} 个点：这是一条好的趋势线。`,
            ),
            t("Every point lies below the line, so the line is too high.", "所有点都在直线下方，所以直线太高了。"),
            t("Every point lies above the line, so the line is too low.", "所有点都在直线上方，所以直线太低了。"),
            t(
              `The points ${m.sign() > 0 ? "rise" : "fall"} from left to right, but the line ${m.sign() > 0 ? "falls" : "rises"}: it does not follow the direction of the data.`,
              `点从左到右${m.sign() > 0 ? "上升" : "下降"}，直线却${m.sign() > 0 ? "下降" : "上升"}：它与数据的走向不一致。`,
            ),
          ][kind]!;
          return {
            ...choiceProblem({
              prompt: t("Is the line drawn a good trend line for the data?", "图中画出的直线是这组数据的好的趋势线吗？"),
              options: fitOptions,
              correct: kind,
              solution: reason,
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
        "A trend line is a line, so its equation can be written in slope-intercept form $y = mx + b$. Read the $y$-intercept $b$ where the line crosses the $y$-axis, and the slope $m$ as rise over run between two grid points on the line; the data points themselves usually are not on it.\n\nA trend line through $(0, 2)$ and $(4, 5)$ has $m = \\frac{3}{4}$ and $b = 2$: $y = \\frac{3}{4}x + 2$.",
        "趋势线是一条直线，所以可以写成斜截式 $y = mx + b$。在直线与 $y$ 轴的交点读出 $y$ 轴截距 $b$，再用直线上的两个网格点求斜率 $m$（纵向变化比横向变化）；数据点本身通常不在直线上。\n\n经过 $(0, 2)$ 和 $(4, 5)$ 的趋势线，$m = \\frac{3}{4}$，$b = 2$：$y = \\frac{3}{4}x + 2$。",
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
                `The line crosses the $y$-axis at $(0, ${b})$, so $b = ${b}$. From there to $${pointLatex([run, b + rise])}$ the run is $${run}$ and the rise is $${rise}$, so $m = ${num(m)}$: ${steps(answer)}`,
                `直线与 $y$ 轴交于 $(0, ${b})$，所以 $b = ${b}$。从这一点到 $${pointLatex([run, b + rise])}$，横向变化是 $${run}$，纵向变化是 $${rise}$，所以 $m = ${num(m)}$：${steps(answer)}`,
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
        "A simple way to draw a trend line is to choose two data points, far apart, that the line should pass through so that it runs through the middle of the data. Its equation follows from the two points:\n\n1. the slope is $m = \\frac{y_2 - y_1}{x_2 - x_1}$;\n2. the $y$-intercept is $b = y_1 - m x_1$.\n\nThrough $(2, 3)$ and $(8, 6)$: $m = \\frac{3}{6} = \\frac{1}{2}$ and $b = 3 - \\frac{1}{2} \\cdot 2 = 2$, so $y = \\frac{1}{2}x + 2$.",
        "画趋势线的一个简单方法是选取两个相距较远的数据点，让直线经过它们，并从数据中间穿过。由这两点就能写出方程：\n\n1. 斜率 $m = \\frac{y_2 - y_1}{x_2 - x_1}$；\n2. $y$ 轴截距 $b = y_1 - m x_1$。\n\n经过 $(2, 3)$ 和 $(8, 6)$：$m = \\frac{3}{6} = \\frac{1}{2}$，$b = 3 - \\frac{1}{2} \\cdot 2 = 2$，所以 $y = \\frac{1}{2}x + 2$。",
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
                `The slope is $m = \\frac{${y2} - ${paren(y1)}}{${x2} - ${x1}} = ${num(m)}$, and the $y$-intercept is $b = ${y1} - ${paren(m)} \\cdot ${x1} = ${num(b)}$: ${steps(answer)}`,
                `斜率 $m = \\frac{${y2} - ${paren(y1)}}{${x2} - ${x1}} = ${num(m)}$，$y$ 轴截距 $b = ${y1} - ${paren(m)} \\cdot ${x1} = ${num(b)}$：${steps(answer)}`,
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

export const predictionsWithTrendLines: TopicDef = {
  id: "predictions-with-trend-lines",
  title: t("Making Predictions Using Trend Lines", "用趋势线进行预测"),
  summary: t(
    "Use the equation of a trend line to predict values, tell interpolation from extrapolation, and find residuals.",
    "用趋势线方程预测数值，区分内插与外推，并求残差。",
  ),
  prerequisites: ["trend-lines", "two-step-equations"],
  encompasses: [
    { topic: "trend-lines", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.8.SP.A.3", "CCSS.HSS.ID.B.6"],
  knowledgePoints: [
    {
      id: "predicting-a-value",
      title: t("Predicting $y$ from $x$", "由 $x$ 预测 $y$"),
      explanation: t(
        "A trend line turns a scatter plot into a formula for predictions: substitute the value of $x$ into its equation.\n\nIf $y = 2.5x + 40$ models test scores, where $x$ is hours studied, a student who studies $6$ hours is predicted to score $y = 2.5 \\cdot 6 + 40 = 55$ points. The prediction is an estimate: actual students score above or below the line.",
        "趋势线把散点图变成了可以用来预测的公式：把 $x$ 的值代入方程即可。\n\n如果 $y = 2.5x + 40$ 描述考试分数，$x$ 是学习时长（小时），那么学习 $6$ 小时的学生的预测分数是 $y = 2.5 \\cdot 6 + 40 = 55$ 分。预测只是估计：实际的学生会高于或低于这条线。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const md = drawModel(rng);
        const x0 = rng.int(md.c.xs[0], md.c.xs[1]);
        const y = predict(md, x0);
        return numberProblem({
          prompt: t(
            `${md.intro.en} Use it to predict the ${md.c.yName[0]} for ${md.c.at(x0)[0]}.`,
            `${md.intro["zh-CN"]}用它预测${md.c.at(x0)[1]}的${md.c.yName[1]}。`,
          ),
          answer: y,
          ...decimalForm(y),
          wrong: [md.m.mul(Q.of(x0)), md.b.mul(Q.of(x0)).add(md.m), md.m.mul(Q.of(x0)).sub(md.b), md.m.add(md.b)],
          solution: t(
            `Substitute $x = ${x0}$: ${steps(substitution(md, x0))}The predicted ${md.c.yName[0]} is $${dec(y)}$ ${md.c.yUnit[0]}.`,
            `代入 $x = ${x0}$：${steps(substitution(md, x0))}预测的${md.c.yName[1]}是 $${dec(y)}$ ${md.c.yUnit[1]}。`,
          ),
        });
      },
    },
    {
      id: "predicting-x-from-y",
      title: t("Finding $x$ for a predicted $y$", "由预测值求 $x$"),
      explanation: t(
        "To find which $x$ gives a predicted value of $y$, substitute that value for $y$ and solve for $x$.\n\nWith $y = 2.5x + 40$, the predicted score is $60$ when $60 = 2.5x + 40$: subtract $40$ to get $20 = 2.5x$, and divide by $2.5$ to get $x = 8$ hours.",
        "要求出哪个 $x$ 对应给定的预测值 $y$，就把这个值代入 $y$，再解出 $x$。\n\n对 $y = 2.5x + 40$，预测分数为 $60$ 时，$60 = 2.5x + 40$：两边减去 $40$ 得 $20 = 2.5x$，再除以 $2.5$ 得 $x = 8$ 小时。",
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
            `Substitute $y = ${dec(Y)}$ and solve: ${steps(`${dec(Y)} = ${decLinear(md.m, md.b)}`, `${dec(diff)} = ${dec(md.m)}x`, `x = ${x0}`)}`,
            `代入 $y = ${dec(Y)}$ 并求解：${steps(`${dec(Y)} = ${decLinear(md.m, md.b)}`, `${dec(diff)} = ${dec(md.m)}x`, `x = ${x0}`)}`,
          ),
        });
      },
    },
    {
      id: "interpolation-and-extrapolation",
      title: t("Interpolation and extrapolation", "内插与外推"),
      explanation: t(
        "A prediction for an $x$-value **within** the range of the data is an **interpolation**; one **outside** that range is an **extrapolation**.\n\nIf the data have $x$-values from $2$ to $10$, predicting at $x = 7$ is an interpolation, and at $x = 15$ an extrapolation. Extrapolations are less reliable: nothing in the data shows that the trend continues beyond it.",
        "对数据范围**以内**的 $x$ 值进行预测叫做**内插**；对范围**以外**的 $x$ 值进行预测叫做**外推**。\n\n如果数据的 $x$ 值从 $2$ 到 $10$，在 $x = 7$ 处预测是内插，在 $x = 15$ 处预测是外推。外推不太可靠：数据并不能说明这个趋势在范围之外仍然成立。",
      ),
      generate(rng) {
        const md = drawModel(rng);
        const [lo0, hi0] = md.c.xs;
        const quarter = Math.max(1, Math.floor((hi0 - lo0) / 4));
        const lo = rng.int(lo0, lo0 + quarter);
        const hi = rng.int(hi0 - quarter, hi0);
        const inside = rng.bool();
        const x0 = inside ? rng.int(lo + 1, hi - 1) : lo > 1 && rng.bool() ? rng.int(Math.max(1, lo - 5), lo - 1) : hi + rng.int(1, 6);
        return choiceProblem({
          prompt: t(
            `${md.intro.en} The data used to draw it have $x$-values from $${lo}$ to $${hi}$. Is predicting the ${md.c.yName[0]} for ${md.c.at(x0)[0]} an interpolation or an extrapolation?`,
            `${md.intro["zh-CN"]}画这条趋势线所用的数据，$x$ 值从 $${lo}$ 到 $${hi}$。预测${md.c.at(x0)[1]}的${md.c.yName[1]}是内插还是外推？`,
          ),
          options: [t("An interpolation", "内插"), t("An extrapolation", "外推")],
          correct: inside ? 0 : 1,
          solution: inside
            ? t(
                `$x = ${x0}$ lies between $${lo}$ and $${hi}$, within the range of the data, so the prediction is an interpolation.`,
                `$x = ${x0}$ 在 $${lo}$ 与 $${hi}$ 之间，位于数据范围以内，所以这是内插。`,
              )
            : t(
                `$x = ${x0}$ lies outside the range from $${lo}$ to $${hi}$, so the prediction is an extrapolation.`,
                `$x = ${x0}$ 在 $${lo}$ 到 $${hi}$ 的范围以外，所以这是外推。`,
              ),
        });
      },
    },
    {
      id: "residuals",
      title: t("Residuals", "残差"),
      explanation: t(
        "The **residual** of a data point is how far it lies above or below the trend line:\n\n$$\\text{residual} = \\text{actual } y - \\text{predicted } y.$$\n\nA positive residual means the point lies above the line (the line underestimates it); a negative one, below the line.\n\nWith $y = 2.5x + 40$, the data point $(6, 58)$ has predicted value $2.5 \\cdot 6 + 40 = 55$, so its residual is $58 - 55 = 3$.",
        "数据点的**残差**表示它在趋势线上方或下方多远：\n\n$$\\text{残差} = \\text{实际的 } y - \\text{预测的 } y。$$\n\n残差为正表示点在直线上方（直线低估了它）；残差为负表示点在直线下方。\n\n对 $y = 2.5x + 40$，数据点 $(6, 58)$ 的预测值是 $2.5 \\cdot 6 + 40 = 55$，所以残差是 $58 - 55 = 3$。",
      ),
      generate(rng) {
        const md = drawModel(rng);
        const x0 = rng.int(md.c.xs[0], md.c.xs[1]);
        const pred = predict(md, x0);
        const r = Q.parse(md.c.resid).mul(Q.of(rng.nonZero(-6, 6)));
        const actual = pred.add(r);
        return numberProblem({
          prompt: t(
            `${md.intro.en} One data point is $(${x0}, ${dec(actual)})$. Find its residual.`,
            `${md.intro["zh-CN"]}有一个数据点是 $(${x0}, ${dec(actual)})$。求它的残差。`,
          ),
          answer: r,
          ...decimalForm(r),
          wrong: [r.neg(), pred, actual.sub(md.m.mul(Q.of(x0)))],
          solution: t(
            `The predicted value at $x = ${x0}$ is ${steps(substitution(md, x0))}The residual is the actual value minus the predicted value: $${dec(actual)} - ${dec(pred)} = ${dec(r)}$.`,
            `$x = ${x0}$ 处的预测值是${steps(substitution(md, x0))}残差等于实际值减预测值：$${dec(actual)} - ${dec(pred)} = ${dec(r)}$。`,
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
  encompasses: [
    { topic: "trend-lines", weight: 0.3 },
    { topic: "interpreting-linear-expressions", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.8.SP.A.3", "CCSS.HSS.ID.C.7"],
  knowledgePoints: [
    {
      id: "meaning-of-the-slope",
      title: t("The meaning of the slope", "斜率的含义"),
      explanation: t(
        "The slope $m$ of a trend line $y = mx + b$ is the predicted change in $y$ when $x$ increases by $1$, in the units of $y$ per unit of $x$. A positive slope is an increase, a negative one a decrease.\n\nIf $y = -2.5x + 30$ models the value of a car in thousands of dollars, where $x$ is its age in years, then for each additional year of age the predicted value decreases by $2.5$ thousand dollars.",
        "趋势线 $y = mx + b$ 的斜率 $m$ 表示 $x$ 每增加 $1$ 时 $y$ 的预测变化量，单位是“$y$ 的单位每 $x$ 的单位”。斜率为正表示增加，为负表示减少。\n\n如果 $y = -2.5x + 30$ 描述汽车的价值（千美元），$x$ 是车龄（年），那么车龄每增加 1 年，预测的价值减少 $2.5$ 千美元。",
      ),
      keyPrerequisites: ["interpreting-linear-expressions"],
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        return shuffledChoice(rng, {
          prompt: t(`${md.intro.en} What does the slope of the trend line mean?`, `${md.intro["zh-CN"]}趋势线的斜率表示什么？`),
          correct: slopeMeaning(md.c, a, up),
          wrong: [slopeMeaning(md.c, a, !up), slopeMeaning(md.c, md.b, up), interceptMeaning(md.c, a)],
          solution: t(
            `The slope is $${dec(md.m)}$, the change in $y$ for each increase of $1$ in $x$. It is ${up ? "positive, an increase" : "negative, a decrease"}: for ${md.c.each[0]}, the predicted ${md.c.yName[0]} ${up ? "increases" : "decreases"} by $${dec(a)}$ ${md.c.yUnit[0]}.`,
            `斜率是 $${dec(md.m)}$，即 $x$ 每增加 $1$ 时 $y$ 的变化量。它是${up ? "正数，表示增加" : "负数，表示减少"}：${md.c.each[1]}，预测的${md.c.yName[1]}${up ? "增加" : "减少"} $${dec(a)}$ ${md.c.yUnit[1]}。`,
          ),
        });
      },
    },
    {
      id: "meaning-of-the-intercept",
      title: t("The meaning of the $y$-intercept", "$y$ 轴截距的含义"),
      explanation: t(
        "The $y$-intercept $b$ of a trend line $y = mx + b$ is the predicted value of $y$ when $x = 0$.\n\nIf $y = 1.5x + 14$ models hourly wages in dollars, where $x$ is years of experience, then a worker with no experience is predicted to earn $14$ dollars an hour. Ask whether $x = 0$ makes sense in the situation: when it lies far outside the data, the intercept is an extrapolation.",
        "趋势线 $y = mx + b$ 的 $y$ 轴截距 $b$ 是 $x = 0$ 时 $y$ 的预测值。\n\n如果 $y = 1.5x + 14$ 描述时薪（美元），$x$ 是工作年限，那么没有工作经验的员工预测时薪是 $14$ 美元。要想一想 $x = 0$ 在情境中是否有意义：如果它远在数据范围之外，截距就是一种外推。",
      ),
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        return shuffledChoice(rng, {
          prompt: t(
            `${md.intro.en} What does the $y$-intercept of the trend line mean?`,
            `${md.intro["zh-CN"]}趋势线的 $y$ 轴截距表示什么？`,
          ),
          correct: interceptMeaning(md.c, md.b),
          wrong: [interceptMeaning(md.c, a), slopeMeaning(md.c, md.b, up), slopeMeaning(md.c, md.b, !up)],
          solution: t(
            `The $y$-intercept is $${dec(md.b)}$, the predicted value of $y$ when $x = 0$: when ${md.c.zero[0]}, the predicted ${md.c.yName[0]} is $${dec(md.b)}$ ${md.c.yUnit[0]}.`,
            `$y$ 轴截距是 $${dec(md.b)}$，即 $x = 0$ 时 $y$ 的预测值：${md.c.zero[1]}，预测的${md.c.yName[1]}是 $${dec(md.b)}$ ${md.c.yUnit[1]}。`,
          ),
        });
      },
    },
    {
      id: "change-over-an-interval",
      title: t("Predicted change over several units", "多个单位上的预测变化"),
      explanation: t(
        "Since the slope is the predicted change for each unit of $x$, when $x$ increases by $k$ units the predicted $y$ changes by $k$ times the slope; the intercept plays no part.\n\nWith $y = -2.5x + 30$ for the value of a car, $4$ more years of age lower the predicted value by $4 \\cdot 2.5 = 10$ thousand dollars.",
        "斜率是 $x$ 每增加一个单位时的预测变化量，所以 $x$ 增加 $k$ 个单位时，预测的 $y$ 变化斜率的 $k$ 倍；截距不起作用。\n\n对描述汽车价值的 $y = -2.5x + 30$，车龄再增加 $4$ 年，预测价值减少 $4 \\cdot 2.5 = 10$ 千美元。",
      ),
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        const k = rng.int(2, 6);
        const change = a.mul(Q.of(k));
        return numberProblem({
          prompt: t(
            `${md.intro.en} By how many ${md.c.yUnit[0]} does the predicted ${md.c.yName[0]} ${up ? "increase" : "decrease"} when ${md.c.xName[0]} increases by $${k}$ ${md.c.xUnit[0]}?`,
            `${md.intro["zh-CN"]}${md.c.xName[1]}增加 $${k}$ ${md.c.xUnit[1]}时，预测的${md.c.yName[1]}${up ? "增加" : "减少"}多少${md.c.yUnit[1]}？`,
          ),
          answer: change,
          ...decimalForm(change),
          wrong: [a, change.add(md.b), Q.of(k), a.add(Q.of(k))],
          solution: t(
            `Each unit of $x$ changes the prediction by $${dec(a)}$, so $${k}$ units change it by ${steps(`${k} \\cdot ${dec(a)} = ${dec(change)}`)}`,
            `$x$ 每增加一个单位，预测值变化 $${dec(a)}$，所以增加 $${k}$ 个单位时变化${steps(`${k} \\cdot ${dec(a)} = ${dec(change)}`)}`,
          ),
        });
      },
    },
    {
      id: "trend-line-from-its-meaning",
      title: t("Writing a trend line from its meaning", "由含义写出趋势线"),
      explanation: t(
        "When the meaning of a trend line is given in words, its equation follows: the predicted value at $x = 0$ is $b$, and the change for each unit of $x$ is $m$, negative for a decrease.\n\nA car is predicted to be worth $30$ thousand dollars when new and to lose $2.5$ thousand dollars of value for each year of age: $y = -2.5x + 30$.",
        "当趋势线的含义用文字给出时，就能写出它的方程：$x = 0$ 时的预测值是 $b$，$x$ 每增加一个单位的变化量是 $m$，减少时 $m$ 为负。\n\n一辆汽车新车时预测价值 $30$ 千美元，车龄每增加 1 年预测价值减少 $2.5$ 千美元：$y = -2.5x + 30$。",
      ),
      generate(rng) {
        const md = drawModel(rng);
        const up = md.m.sign() > 0;
        const a = md.m.abs();
        const answer = md.eq;
        const s = slopeMeaning(md.c, a, up);
        const i = interceptMeaning(md.c, md.b);
        return equationProblem({
          prompt: t(
            `A trend line models ${md.c.model[0]}, where $x$ is ${md.c.x[0]} and $y$ is ${md.c.y[0]}. ${i.en} ${s.en} Write the equation of the trend line in slope-intercept form.`,
            `一条趋势线描述${md.c.model[1]}，其中 $x$ 表示${md.c.x[1]}，$y$ 表示${md.c.y[1]}。${i["zh-CN"]}${s["zh-CN"]}写出这条趋势线的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [`y = ${decLinear(md.b, md.m)}`, `y = ${decLinear(md.m.neg(), md.b)}`, `y = ${decLinear(md.m, md.b.neg())}`],
          solution: t(
            `The $y$-intercept is the predicted value at $x = 0$, so $b = ${dec(md.b)}$. The slope is the change for each unit of $x$, ${up ? "an increase" : "a decrease"}, so $m = ${dec(md.m)}$: ${steps(answer)}`,
            `$y$ 轴截距是 $x = 0$ 时的预测值，所以 $b = ${dec(md.b)}$。斜率是 $x$ 每增加一个单位的变化量，这里是${up ? "增加" : "减少"}，所以 $m = ${dec(md.m)}$：${steps(answer)}`,
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

/** strengthReason explains the strength of a correlation from the shape of a scatter plot. */
function strengthReason(s: Strength): Text {
  switch (s) {
    case "strong+":
      return t(
        "The points rise from left to right and lie close to a line: a strong positive correlation.",
        "点从左到右上升，并且紧靠一条直线：强正相关。",
      );
    case "weak+":
      return t(
        "The points tend to rise from left to right, but are widely scattered around a line: a weak positive correlation.",
        "点总体上从左到右上升，但在直线周围分散得很开：弱正相关。",
      );
    case "none":
      return t("The points show no upward or downward trend: no correlation.", "点没有上升或下降的趋势：不相关。");
    case "weak-":
      return t(
        "The points tend to fall from left to right, but are widely scattered around a line: a weak negative correlation.",
        "点总体上从左到右下降，但在直线周围分散得很开：弱负相关。",
      );
    case "strong-":
      return t(
        "The points fall from left to right and lie close to a line: a strong negative correlation.",
        "点从左到右下降，并且紧靠一条直线：强负相关。",
      );
  }
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
  encompasses: [{ topic: "scatter-plots", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.8.SP.A.1", "CCSS.HSS.ID.C.8"],
  knowledgePoints: [
    {
      id: "direction-of-a-correlation",
      title: t("Positive, negative or no correlation", "正相关、负相关或不相关"),
      explanation: t(
        "Two variables are **correlated** when one tends to change with the other:\n\n- **positive correlation**: as $x$ increases, $y$ tends to increase, and the points rise from left to right;\n- **negative correlation**: as $x$ increases, $y$ tends to decrease, and the points fall;\n- **no correlation**: the points show no upward or downward trend.\n\nHours studied and test scores are positively correlated; the age and the value of a car, negatively.",
        "如果一个变量倾向于随另一个变量变化，就说两个变量**相关**：\n\n- **正相关**：$x$ 增大时 $y$ 倾向于增大，点从左到右上升；\n- **负相关**：$x$ 增大时 $y$ 倾向于减小，点从左到右下降；\n- **不相关**：点没有上升或下降的趋势。\n\n学习时长与考试分数正相关；汽车的车龄与价值负相关。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const pts = kind === 0 ? correlated(rng, 0.6, 1) : kind === 1 ? correlated(rng, -1, -0.6) : correlated(rng, -0.12, 0.12);
        return {
          ...choiceProblem({
            prompt: t("What kind of correlation does the scatter plot show?", "这个散点图显示的是哪种相关关系？"),
            options: directionOptions,
            correct: kind,
            solution: [
              t(
                "As $x$ increases, $y$ tends to increase: the points rise from left to right. This is a positive correlation.",
                "$x$ 增大时 $y$ 倾向于增大：点从左到右上升。这是正相关。",
              ),
              t(
                "As $x$ increases, $y$ tends to decrease: the points fall from left to right. This is a negative correlation.",
                "$x$ 增大时 $y$ 倾向于减小：点从左到右下降。这是负相关。",
              ),
              t(
                "The points show no upward or downward trend as $x$ increases: there is no correlation.",
                "随着 $x$ 增大，点没有上升或下降的趋势：不相关。",
              ),
            ][kind]!,
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "strength-of-a-correlation",
      title: t("Strong and weak correlation", "强相关与弱相关"),
      explanation: t(
        "The **strength** of a linear correlation is how closely the points follow a line. In a **strong** correlation they lie close to a line; in a **weak** one the trend is visible but the points are widely scattered around it.\n\nStrength and direction are separate: a correlation can be strong and negative, or weak and positive. Steepness is not strength: a gently rising cloud of points can show a strong correlation if the points hug a line.",
        "线性相关的**强弱**指点与一条直线贴合的程度。**强**相关时点紧靠一条直线；**弱**相关时虽能看出趋势，但点在直线周围分散得很开。\n\n强弱与方向是两回事：相关可以是强的负相关，也可以是弱的正相关。陡峭程度不等于强弱：一团缓缓上升的点，只要紧贴一条直线，也是强相关。",
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
            solution: strengthReason(s),
          }),
          figure: scatterFigure(correlated(rng, lo, hi)),
        };
      },
    },
    {
      id: "estimating-r",
      title: t("The correlation coefficient $r$", "相关系数 $r$"),
      explanation: t(
        "The **correlation coefficient** $r$ measures a linear correlation with one number between $-1$ and $1$:\n\n- its **sign** is the direction: $r > 0$ for a positive correlation, $r < 0$ for a negative one;\n- its **size** $|r|$ is the strength: near $1$ the points lie close to a line, near $0$ there is little or no linear correlation.\n\n$r = 1$ or $r = -1$ means every point lies exactly on a line. $r = -0.9$ is a strong negative correlation, and $r = 0.5$ a moderate positive one.",
        "**相关系数** $r$ 用 $-1$ 到 $1$ 之间的一个数来衡量线性相关：\n\n- 它的**符号**表示方向：正相关时 $r > 0$，负相关时 $r < 0$；\n- 它的**大小** $|r|$ 表示强弱：接近 $1$ 时点紧靠一条直线，接近 $0$ 时几乎没有线性相关。\n\n$r = 1$ 或 $r = -1$ 表示所有点恰好在一条直线上。$r = -0.9$ 是强负相关，$r = 0.5$ 是中等程度的正相关。",
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const target = rTargets[kind]!;
        const pts = correlated(rng, target - 0.07, target + 0.07);
        const reason = [
          t(
            "The points fall from left to right and lie close to a line: a strong negative correlation, $r$ close to $-1$.",
            "点从左到右下降并紧靠一条直线：强负相关，$r$ 接近 $-1$。",
          ),
          t(
            "The points tend to fall, but are widely scattered: a moderate negative correlation, $r$ about $-0.5$.",
            "点总体下降，但分散得较开：中等程度的负相关，$r$ 约为 $-0.5$。",
          ),
          t("The points show no upward or downward trend: $r$ is close to $0$.", "点没有上升或下降的趋势：$r$ 接近 $0$。"),
          t(
            "The points tend to rise, but are widely scattered: a moderate positive correlation, $r$ about $0.5$.",
            "点总体上升，但分散得较开：中等程度的正相关，$r$ 约为 $0.5$。",
          ),
          t(
            "The points rise from left to right and lie close to a line: a strong positive correlation, $r$ close to $1$.",
            "点从左到右上升并紧靠一条直线：强正相关，$r$ 接近 $1$。",
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
            solution: reason,
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "comparing-correlation-coefficients",
      title: t("Comparing correlation coefficients", "比较相关系数"),
      explanation: t(
        "The strength of a correlation depends only on the size $|r|$, not on the sign. $r = -0.92$ shows a stronger linear relationship than $r = 0.85$, because $0.92 > 0.85$; the minus sign only says that the correlation is negative.\n\nThe weakest linear relationship is the one with $r$ closest to $0$.",
        "相关的强弱只取决于 $|r|$ 的大小，与符号无关。$r = -0.92$ 显示的线性关系比 $r = 0.85$ 更强，因为 $0.92 > 0.85$；负号只说明相关是负的。\n\n线性关系最弱的是 $r$ 最接近 $0$ 的那个。",
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
          return choiceProblem({
            prompt: t(
              `Four data sets have the correlation coefficients ${ks.map((k) => `$${r(k)}$`).join(", ")}. Which one shows the ${strongest ? "strongest" : "weakest"} linear relationship?`,
              `四组数据的相关系数分别是 ${ks.map((k) => `$${r(k)}$`).join("、")}。哪一个显示的线性关系${strongest ? "最强" : "最弱"}？`,
            ),
            options: ks.map((k) => same(`$r = ${r(k)}$`)),
            correct: i,
            solution: t(
              `Compare the sizes $|r|$: ${ks.map((k) => `$${r(Math.abs(k))}$`).join(", ")}. The ${strongest ? "largest" : "smallest"} is $${r(best)}$, so $r = ${r(ks[i]!)}$ shows the ${strongest ? "strongest" : "weakest"} linear relationship.`,
              `比较 $|r|$ 的大小：${ks.map((k) => `$${r(Math.abs(k))}$`).join("，")}。${strongest ? "最大" : "最小"}的是 $${r(best)}$，所以 $r = ${r(ks[i]!)}$ 显示的线性关系${strongest ? "最强" : "最弱"}。`,
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
  title: t("Correlation and Causation", "相关与因果"),
  summary: t(
    "Recognize that correlation does not imply causation, find lurking variables, and tell when a study can show cause and effect.",
    "认识到相关不等于因果，找出潜在变量，并判断一项研究何时能说明因果关系。",
  ),
  prerequisites: ["linear-correlation"],
  encompasses: [{ topic: "linear-correlation", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.HSS.ID.C.9"],
  knowledgePoints: [
    {
      id: "lurking-variables",
      title: t("Lurking variables", "潜在变量"),
      explanation: t(
        "A correlation between two variables does not mean that one **causes** the other. Often a third variable, a **lurking variable**, drives both of them.\n\nOver a year, ice cream sales and sunburns are positively correlated, but ice cream does not cause sunburns: hot, sunny weather increases both. Before concluding that $x$ causes $y$, look for a variable that could affect both.",
        "两个变量相关，并不意味着其中一个**导致**另一个。常常是第三个变量，即**潜在变量**，同时影响了二者。\n\n一年中冰淇淋销量与晒伤人数正相关，但冰淇淋并不会导致晒伤：炎热晴朗的天气让二者都增加。在断定 $x$ 导致 $y$ 之前，要先找找是否有能同时影响二者的变量。",
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
            `Neither variable plausibly causes the other. Both go up with ${s.z[0]}, a lurking variable, and that is why they are correlated.`,
            `两个变量都不太可能导致对方。二者都随“${s.z[1]}”而增加，它是潜在变量，正因为如此二者才相关。`,
          ),
        });
      },
    },
    {
      id: "experiments-and-observational-studies",
      title: t("Experiments and observational studies", "实验与观察研究"),
      explanation: t(
        "In an **observational study**, researchers only record what people (or things) already do. A difference between groups may come from a lurking variable, so it cannot show cause and effect.\n\nIn a **randomized experiment**, researchers assign the treatment at random. Random assignment makes the groups alike in every other way, so a clear difference in the outcome can be attributed to the treatment: an experiment **can** show causation.",
        "在**观察研究**中，研究者只记录人（或事物）本来的情况。组间的差异可能来自潜在变量，所以不能说明因果关系。\n\n在**随机化实验**中，研究者随机分配处理。随机分配使各组在其他方面都相似，因此结果中明显的差异可以归因于处理：实验**能够**说明因果关系。",
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
                "The researchers assigned the treatment at random, so this is a randomized experiment. The groups were alike except for the treatment, so the difference can be attributed to it.",
                "研究者随机分配了处理，所以这是随机化实验。两组除处理外都相似，因此差异可以归因于处理。",
              )
            : t(
                `The researchers only observed which ${s.units[0]} ${s.treat[0]}; nobody assigned it. Those ${s.units[0]} may differ in other ways, and a lurking variable could explain the difference, so causation cannot be concluded.`,
                `研究者只是观察了哪些对象${s.treat[1]}，并没有人为分配。这些对象可能在其他方面也不同，潜在变量可能解释了差异，所以不能断定因果关系。`,
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

export const selectingARegressionModel: TopicDef = {
  id: "selecting-a-regression-model",
  title: t("Selecting a Regression Model", "选择回归模型"),
  summary: t(
    "Choose a linear, exponential or quadratic model for data from a table, a scatter plot or a description.",
    "根据表格、散点图或文字描述，为数据选择线性、指数或二次模型。",
  ),
  prerequisites: ["trend-lines", "geometric-sequences", "linear-vs-exponential-growth-and-decay", "graphs-of-general-quadratic-functions"],
  encompasses: [
    { topic: "linear-vs-exponential-growth-and-decay", weight: 0.4 },
    { topic: "geometric-sequences", weight: 0.2 },
    { topic: "arithmetic-sequences", weight: 0.2 },
    { topic: "trend-lines", weight: 0.1 },
  ],
  xp: 15,
  standards: ["CCSS.HSS.ID.B.6.A", "CCSS.HSF.LE.A.1"],
  knowledgePoints: [
    {
      id: "model-from-a-table",
      title: t("Choosing a model from a table", "由表格选择模型"),
      explanation: t(
        "When the $x$-values of a table go up in equal steps, the $y$-values show which model fits:\n\n- **linear**: the differences of consecutive $y$-values are constant;\n- **exponential**: the ratios of consecutive $y$-values are constant;\n- **quadratic**: the differences are not constant, but the differences of the differences (**second differences**) are.\n\n$y$: $3, 7, 13, 21, 31$ has differences $4, 6, 8, 10$ and second differences $2, 2, 2$, so it is quadratic. $5, 10, 20, 40$ has ratios $2, 2, 2$: exponential.",
        "当表格中的 $x$ 值等距增加时，$y$ 值能说明哪种模型合适：\n\n- **线性**：相邻 $y$ 值的差恒定；\n- **指数**：相邻 $y$ 值的比恒定；\n- **二次**：差不恒定，但差的差（**二阶差**）恒定。\n\n$y$：$3, 7, 13, 21, 31$ 的差是 $4, 6, 8, 10$，二阶差是 $2, 2, 2$，所以是二次的。$5, 10, 20, 40$ 的比是 $2, 2, 2$：指数的。",
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
          const solution =
            kind === 0
              ? t(
                  `The differences of the $y$-values are $${list(d1)}$, all equal: the model is linear.`,
                  `$y$ 值的差是 $${list(d1)}$，全部相等：线性模型。`,
                )
              : kind === 1
                ? t(
                    `The differences $${list(d1)}$ are not constant, but the ratios $${list(ratios ?? [])}$ are all equal: the model is exponential.`,
                    `差 $${list(d1)}$ 不恒定，但比 $${list(ratios ?? [])}$ 全部相等：指数模型。`,
                  )
                : t(
                    `The differences $${list(d1)}$ are not constant, but the second differences $${list(d2)}$ are all equal: the model is quadratic.`,
                    `差 $${list(d1)}$ 不恒定，但二阶差 $${list(d2)}$ 全部相等：二次模型。`,
                  );
          return choiceProblem({
            prompt: t(`Which type of model fits the data in the table exactly?\n\n${table}`, `哪种模型能精确拟合表中的数据？\n\n${table}`),
            options: modelOptions,
            correct: kind,
            solution,
          });
        }
      },
    },
    {
      id: "model-from-a-scatter-plot",
      title: t("Choosing a model from a scatter plot", "由散点图选择模型"),
      explanation: t(
        "The shape of a scatter plot suggests the model:\n\n- **linear**: the points lie along a straight line, rising or falling at a steady rate;\n- **exponential**: the points curve, changing slowly at first and then faster and faster (growth), or quickly at first and then leveling off toward the $x$-axis (decay), without ever turning around;\n- **quadratic**: the points form a U shape or an upside-down U: they fall and then rise, or rise and then fall.",
        "散点图的形状提示了应选的模型：\n\n- **线性**：点沿一条直线分布，以稳定的速度上升或下降；\n- **指数**：点呈曲线，开始变化缓慢、然后越来越快（增长），或开始变化很快、然后趋于平缓接近 $x$ 轴（衰减），但不会掉头；\n- **二次**：点呈 U 形或倒 U 形：先降后升，或先升后降。",
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
              t("The points lie close to a straight line: a linear model fits best.", "点紧靠一条直线：线性模型最合适。"),
              rising
                ? t(
                    "The points rise slowly at first and then faster and faster, without turning around: an exponential model fits best.",
                    "点开始上升缓慢，然后越来越快，而且不掉头：指数模型最合适。",
                  )
                : t(
                    "The points fall quickly at first and then level off, without turning around: an exponential model fits best.",
                    "点开始下降很快，然后趋于平缓，而且不掉头：指数模型最合适。",
                  ),
              t(
                "The points fall and then rise, or rise and then fall, in a U shape: a quadratic model fits best.",
                "点先降后升或先升后降，呈 U 形：二次模型最合适。",
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
        "A description of how a quantity changes points to a model:\n\n- adding or subtracting the **same amount** in each step (a fixed fee plus a rate, a steady flow) is **linear**;\n- multiplying by the **same factor** in each step (doubling, halving, a fixed percent of growth or decay) is **exponential**;\n- a quantity that depends on the **square** of another (an area from a length, the height of a thrown object) is **quadratic**.",
        "描述一个量如何变化，就能判断模型：\n\n- 每一步加上或减去**相同的数量**（固定费用加单价、匀速流动）是**线性**的；\n- 每一步乘以**相同的倍数**（翻倍、减半、固定百分比的增长或衰减）是**指数**的；\n- 一个量依赖于另一个量的**平方**（由长度求面积、抛出物体的高度）是**二次**的。",
      ),
      generate(rng) {
        const s = rng.pick(situations);
        const text = s.text(rng);
        return choiceProblem({
          prompt: t(`${text.en} Which type of model fits this situation?`, `${text["zh-CN"]}哪种模型适合这个情境？`),
          options: modelOptions,
          correct: s.kind,
          solution: s.reason,
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
