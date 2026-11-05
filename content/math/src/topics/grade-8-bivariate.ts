import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, type PlaneMark, Q } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { choiceProblem, numberProblem, pointProblem, steps, verdictChoice } from "../problems.ts";
import { lineMark, near, type Pair, type Pt, pearson, plainLine, scatterFigure, shuffledChoice, xsOf } from "./bivariate-statistics.ts";
import { jointTable, m, mdTable, sum, twoWays } from "./grade-7-statistics.ts";

// 8th Grade Math, Unit 9: patterns of association in scatter plots, the fit of a trend line, and relative frequencies and
// association in two-way tables.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** one writes a number to one decimal place. */
const one = (v: number) => String(Math.round(v * 10) / 10);

/** scattered draws n points with distinct x-values and no association. */
function scattered(rng: Rng, n: number): Pt[] {
  for (;;) {
    const pts = xsOf(rng, n).map((x): Pt => [x, rng.int(1, 9)]);
    if (Math.abs(pearson(pts)) < 0.15) return pts;
  }
}

/** trending draws n points with distinct x-values near a line through (5, 5) rising (dir 1) or falling (dir −1), with at least one pair out of order, so that the trend is only a tendency. */
function trending(rng: Rng, dir: 1 | -1, n: number): Pt[] {
  for (;;) {
    const slope = Q.of(dir * rng.int(2, 4), 4);
    const pts = near(rng, xsOf(rng, n), slope, Q.of(5).sub(slope.mul(Q.of(5))), 2);
    if (!pts || Math.abs(pearson(pts)) < 0.7) continue;
    if (pts.some(([, y], i) => pts.slice(i + 1).some(([, y2]) => dir * (y2 - y) < 0))) return pts;
  }
}

// ---------------------------------------------------------------------------
// Describing patterns of association in scatter plots

/** Context is a data set whose association can be stated in words. */
interface Context {
  readonly intro: (n: number) => Text;
  /** whoRel starts an English sentence about the items: "Students who". */
  readonly whoRel: string;
  /** who names the items in Chinese: "学生". */
  readonly who: string;
  /** more says that an item has a greater x: "study longer" / "学习时间更长". */
  readonly more: Pair;
  /** up and down say that an item has a greater or a smaller y. */
  readonly up: Pair;
  readonly down: Pair;
  readonly x: Pair;
  readonly y: Pair;
}

const contexts: readonly Context[] = [
  {
    intro: (n) =>
      t(
        `The scatter plot shows the hours that ${n} students studied for a quiz ($x$) and their quiz scores ($y$).`,
        `散点图显示了 ${n} 名学生为测验学习的时长（$x$，小时）和他们的测验分数（$y$）。`,
      ),
    whoRel: "students who",
    who: "学生",
    more: ["study longer", "学习时间更长"],
    up: ["score higher", "得分更高"],
    down: ["score lower", "得分更低"],
    x: ["study time", "学习时间"],
    y: ["quiz score", "测验分数"],
  },
  {
    intro: (n) =>
      t(
        `The scatter plot shows the ages in years ($x$) of ${n} used cars and their prices in thousands of dollars ($y$).`,
        `散点图显示了 ${n} 辆二手车的车龄（$x$，年）和价格（$y$，千美元）。`,
      ),
    whoRel: "cars that",
    who: "汽车",
    more: ["are older", "车龄更长"],
    up: ["cost more", "价格更高"],
    down: ["cost less", "价格更低"],
    x: ["the age of a car", "车龄"],
    y: ["its price", "价格"],
  },
  {
    intro: (n) =>
      t(
        `The scatter plot shows the hours of sunshine ($x$) and the number of visitors to a park, in hundreds ($y$), on ${n} days.`,
        `散点图显示了 ${n} 天里每天的日照时长（$x$，小时）和公园的游客人数（$y$，百人）。`,
      ),
    whoRel: "days that",
    who: "日子",
    more: ["are sunnier", "日照时间更长"],
    up: ["have more visitors", "游客更多"],
    down: ["have fewer visitors", "游客更少"],
    x: ["sunshine", "日照时长"],
    y: ["the number of visitors", "游客人数"],
  },
  {
    intro: (n) =>
      t(
        `The scatter plot shows the hours that ${n} runners train each week ($x$) and their times in a 5-kilometer race, in minutes above $20$ ($y$).`,
        `散点图显示了 ${n} 名跑者每周的训练时长（$x$，小时）和他们 5 千米比赛的用时比 $20$ 分钟多出的分钟数（$y$）。`,
      ),
    whoRel: "runners who",
    who: "跑者",
    more: ["train more", "训练更多"],
    up: ["have longer race times", "比赛用时更长"],
    down: ["have shorter race times", "比赛用时更短"],
    x: ["training time", "训练时长"],
    y: ["race time", "比赛用时"],
  },
  {
    intro: (n) =>
      t(
        `The scatter plot shows the hours that ${n} teenagers spend on screens each day ($x$) and the hours they sleep each night ($y$).`,
        `散点图显示了 ${n} 名青少年每天使用屏幕的时长（$x$，小时）和每晚的睡眠时长（$y$，小时）。`,
      ),
    whoRel: "teenagers who",
    who: "青少年",
    more: ["spend more time on screens", "使用屏幕时间更长"],
    up: ["sleep more", "睡得更多"],
    down: ["sleep less", "睡得更少"],
    x: ["screen time", "屏幕使用时间"],
    y: ["sleep", "睡眠时间"],
  },
];

/** tendency states that items with a greater x tend to (or always) have a greater or smaller y. */
function tendency(c: Context, side: Pair, always: boolean): Text {
  return t(
    `${cap(c.whoRel)} ${c.more[0]} ${always ? "always" : "tend to"} ${side[0]}.`,
    `${c.more[1]}的${c.who}${always ? "总是" : "往往"}${side[1]}。`,
  );
}

/** noAssociation states that there is no association between the variables of a context. */
const noAssociation = (c: Context) => t(`There is no association between ${c.x[0]} and ${c.y[0]}.`, `${c.x[1]}与${c.y[1]}之间没有关联。`);

/** Shape is the kind of pattern a scatter plot shows. */
type Shape = "linear" | "nonlinear" | "none";

/** shapeOptions name the patterns of association. */
const shapeOptions: readonly Text[] = [
  t("Linear association", "线性关联"),
  t("Nonlinear association", "非线性关联"),
  t("No association", "没有关联"),
];

/** curved draws 8 points with distinct x-values on a curve: an arch, a cup, or a curve that grows or decays faster and faster. */
function curved(rng: Rng): { pts: Pt[]; curve: Pair } {
  const xs = xsOf(rng, 8);
  const kind = rng.int(0, 3);
  if (kind < 2) {
    const h = rng.int(4, 6);
    const reach = Math.max(...xs.map((x) => (x - h) ** 2));
    const c = (6.5 / reach) * (0.85 + 0.15 * rng.int(0, 1));
    const arch = (x: number) => 8.5 - c * (x - h) ** 2;
    return {
      pts: xs.map((x): Pt => [x, Math.round(kind === 0 ? arch(x) : 10 - arch(x))]),
      curve: kind === 0 ? ["rise and then fall", "先上升后下降"] : ["fall and then rise", "先下降后上升"],
    };
  }
  const base = rng.pick([1.35, 1.45, 1.55]);
  const grow = (x: number) => 1 + (8 * (base ** (x - 1) - 1)) / (base ** 8 - 1);
  return {
    pts: xs.map((x): Pt => [x, Math.round(kind === 2 ? grow(x) : grow(10 - x))]),
    curve:
      kind === 2
        ? ["rise more and more steeply", "上升得越来越陡"]
        : ["fall steeply at first and then level off", "先急剧下降，然后趋于平缓"],
  };
}

/** clusterAt draws k points within half a unit of a center. */
function clusterAt(rng: Rng, [cx, cy]: Pt, k: number): Pt[] {
  const cells = [-0.5, 0, 0.5].flatMap((dx) => [-0.5, 0, 0.5].map((dy): Pt => [cx + dx, cy + dy]));
  return rng.sample(cells, k);
}

export const describingPatternsOfAssociation = topic(
  "describing-patterns-of-association-in-scatter-plots",
  t("Describing Patterns of Association in Scatter Plots", "描述散点图中的关联模式"),
  t(
    "Describe the association in a scatter plot in words, tell linear from nonlinear association, and pick out outliers and clusters.",
    "用文字描述散点图中的关联，区分线性关联与非线性关联，并找出离群点和点群。",
  ),
  ["scatter-plots"],
  ["8.SP.A.1"],
  [
    {
      id: "describing-an-association-in-context",
      figure: gradeDrawings5["describing-patterns-of-association-in-scatter-plots#describing-an-association-in-context"],
      title: t("Describing an association in context", "结合情境描述关联"),
      explanation: t(
        "Two variables are **associated** when knowing one tells you something about the other. In a scatter plot:\n\n- a **positive association** rises from left to right: items with greater $x$-values tend to have greater $y$-values;\n- a **negative association** falls: items with greater $x$-values tend to have smaller $y$-values;\n- with **no association**, the points show no upward or downward trend.\n\nState an association in the words of the data, with “tend to”: “Students who study longer tend to score higher.” An association is a tendency, not a rule: a student who studied longer than another may still have scored lower.",
        "如果知道一个变量就能推知另一个变量的一些情况，就说这两个变量**有关联**。在散点图中：\n\n- **正关联**从左到右上升：$x$ 值较大的对象，$y$ 值往往也较大；\n- **负关联**从左到右下降：$x$ 值较大的对象，$y$ 值往往较小；\n- **没有关联**时，点没有上升或下降的趋势。\n\n要用数据本身的语言、带上“往往”来描述关联：“学习时间更长的学生往往得分更高。”关联只是一种倾向，而不是规律：一名学生学习的时间比另一名长，得分仍可能更低。",
      ),
      generate(rng) {
        const c = rng.pick(contexts);
        const n = rng.int(7, 9);
        const kind = rng.int(0, 2);
        const pts = kind === 0 ? trending(rng, 1, n) : kind === 1 ? trending(rng, -1, n) : scattered(rng, n);
        const up = tendency(c, c.up, false);
        const down = tendency(c, c.down, false);
        const none = noAssociation(c);
        const always = tendency(c, kind === 1 ? c.down : c.up, true);
        const correct = [up, down, none][kind]!;
        return {
          ...shuffledChoice(rng, {
            prompt: t(`${c.intro(n).en} Which statement describes the data?`, `${c.intro(n)["zh-CN"]}哪一句话描述了这组数据？`),
            correct,
            wrong: [up, down, none, always].filter((s) => s !== correct),
            solution: [
              t(
                `The points rise from left to right, so the association is positive. ${up.en} It is only a tendency: some of the points are lower than points to their left, so “always” is wrong.`,
                `点从左到右上升，所以是正关联。${up["zh-CN"]}这只是一种倾向：有些点比它左边的点低，所以“总是”不对。`,
              ),
              t(
                `The points fall from left to right, so the association is negative. ${down.en} It is only a tendency: some of the points are higher than points to their left, so “always” is wrong.`,
                `点从左到右下降，所以是负关联。${down["zh-CN"]}这只是一种倾向：有些点比它左边的点高，所以“总是”不对。`,
              ),
              t(
                `The points show no upward or downward trend from left to right. ${none.en}`,
                `点从左到右没有上升或下降的趋势。${none["zh-CN"]}`,
              ),
            ][kind]!,
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "linear-and-nonlinear-association",
      title: t("Linear and nonlinear association", "线性关联与非线性关联"),
      explanation: t(
        "An association is **linear** when the points lie roughly along a straight line, and **nonlinear** when they follow a curve: they may rise and then fall, or rise more and more steeply. A nonlinear association is still an association: knowing $x$ tells you about $y$, but no straight line describes it well.\n\nWhen the points are spread over the plot with no pattern at all, there is **no association**.",
        "当点大致沿一条直线分布时，关联是**线性**的；当点沿一条曲线分布时，关联是**非线性**的：点可能先上升后下降，也可能上升得越来越陡。非线性关联仍然是关联：知道 $x$ 能推知 $y$ 的情况，只是没有一条直线能很好地描述它。\n\n如果点散布在整个图中，看不出任何模式，就**没有关联**。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const shape: Shape = (["linear", "nonlinear", "none"] as const)[kind]!;
        if (shape === "nonlinear") {
          const { pts, curve } = curved(rng);
          return {
            ...choiceProblem({
              prompt: t("What kind of association does the scatter plot show?", "这个散点图显示的是哪种关联？"),
              options: shapeOptions,
              correct: 1,
              solution: t(
                `The points follow a curve: they ${curve[0]}. No straight line follows them, so the association is nonlinear.`,
                `点沿一条曲线分布：它们${curve[1]}。没有一条直线能贴合它们，所以是非线性关联。`,
              ),
            }),
            figure: scatterFigure(pts),
          };
        }
        let pts: Pt[] | undefined;
        if (shape === "linear") {
          while (!pts || Math.abs(pearson(pts)) < 0.9) {
            const slope = Q.of(rng.sign() * rng.int(2, 4), 4);
            pts = near(rng, xsOf(rng, 8), slope, Q.of(rng.int(4, 6)).sub(slope.mul(Q.of(5))), 1);
          }
        } else pts = scattered(rng, 8);
        return {
          ...choiceProblem({
            prompt: t("What kind of association does the scatter plot show?", "这个散点图显示的是哪种关联？"),
            options: shapeOptions,
            correct: kind,
            solution:
              shape === "linear"
                ? t("The points lie close to a straight line, so the association is linear.", "点紧靠一条直线分布，所以是线性关联。")
                : t(
                    "The points are spread over the plot with no upward or downward trend and no curve: there is no association.",
                    "点散布在整个图中，既没有上升或下降的趋势，也不沿曲线分布：没有关联。",
                  ),
          }),
          figure: scatterFigure(pts),
        };
      },
    },
    {
      id: "outliers-in-scatter-plots",
      title: t("Outliers", "离群点"),
      explanation: t(
        "An **outlier** is a point that lies far from the pattern of the other points. It need not have the greatest or the smallest coordinates: a point in the middle of the plot is an outlier when the others run along a line well above or below it.\n\nTo find an outlier, first see the pattern, such as a line the points follow, and then look for the point far off it.",
        "**离群点**是远离其他点的分布模式的点。它不一定有最大或最小的坐标：如果其他点沿一条直线分布，而某个点远在这条直线的上方或下方，那么即使它位于图的中部，也是离群点。\n\n找离群点时，先看出点的分布模式，比如点所沿的直线，再找远离这个模式的点。",
      ),
      generate(rng) {
        for (;;) {
          const slope = Q.of(rng.sign() * rng.int(2, 4), 4);
          const pts = near(rng, xsOf(rng, 8), slope, Q.of(5).sub(slope.mul(Q.of(5))), 0);
          if (!pts) continue;
          const i = rng.int(1, 6);
          const [x, y] = pts[i]!;
          const shift = rng.sign() * rng.int(4, 5);
          if (y + shift < 1 || y + shift > 9) continue;
          const out: Pt = [x, y + shift];
          const data = pts.map((p, k) => (k === i ? out : p));
          const top = data.reduce((a, b) => (b[1] > a[1] ? b : a));
          const bottom = data.reduce((a, b) => (b[1] < a[1] ? b : a));
          return {
            ...pointProblem({
              prompt: t(
                "One point of the scatter plot is an outlier. What are its coordinates?",
                "散点图中有一个点是离群点。它的坐标是什么？",
              ),
              answer: out,
              // The highest or lowest point, or the outlier's coordinates swapped.
              wrong: [top, bottom, [out[1], out[0]]],
              solution: t(
                `The other points lie close to a ${slope.sign() > 0 ? "rising" : "falling"} line. The point $(${out[0]}, ${out[1]})$ is $${Math.abs(shift)}$ units ${shift > 0 ? "above" : "below"} where that line passes at $x = ${x}$, far from the pattern: it is the outlier.`,
                `其他点紧靠一条${slope.sign() > 0 ? "上升" : "下降"}的直线分布。点 $(${out[0]}, ${out[1]})$ 在 $x = ${x}$ 处比这条直线${shift > 0 ? "高" : "低"} $${Math.abs(shift)}$ 个单位，远离这一模式：它就是离群点。`,
              ),
            }),
            figure: scatterFigure(data),
          };
        }
      },
    },
    {
      id: "clusters-in-scatter-plots",
      title: t("Clusters", "点群"),
      explanation: t(
        "A **cluster** is a group of points close together, with empty space between it and the other points. Clusters show that the data fall into groups: a plot of the weights and lengths of cats and dogs might show one cluster for each kind of animal.\n\nCount the clusters by looking for the gaps: points within a group are close to one another, and the groups are far apart.",
        "**点群**是聚在一起的一组点，它和其他点之间隔着空白。点群说明数据分成了几组：猫和狗的体重与体长的散点图，可能每种动物各形成一个点群。\n\n数点群时要找空隙：同一组里的点彼此靠近，各组之间相距较远。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.int(2, 3);
          const centers: Pt[] = [];
          for (let tries = 0; tries < 50 && centers.length < k; tries++) {
            const c: Pt = [rng.int(2, 8), rng.int(2, 8)];
            if (centers.every(([x, y]) => Math.max(Math.abs(x - c[0]), Math.abs(y - c[1])) >= 4)) centers.push(c);
          }
          const sizes = centers.map(() => rng.int(3, 6));
          if (centers.length < k || new Set(sizes).size < k) continue;
          const pts = centers.flatMap((c, j) => clusterAt(rng, c, sizes[j]!));
          const total = pts.length;
          const largest = Math.max(...sizes);
          const askSize = rng.int(0, 1) === 1;
          return {
            ...numberProblem({
              prompt: askSize
                ? t(
                    "The points of the scatter plot form clusters. How many points are in the largest cluster?",
                    "散点图中的点形成了几个点群。最大的点群里有多少个点？",
                  )
                : t("How many clusters do the points of the scatter plot form?", "散点图中的点形成了几个点群？"),
              answer: askSize ? largest : k,
              form: "integer",
              // Counting every point, or the clusters instead of the points; or one cluster too many or too few.
              wrong: askSize ? [total, k, Math.min(...sizes)] : [total, k + 1, k - 1],
              solution: t(
                `Gaps of empty space separate the points into $${k}$ groups, with $${sizes.join("$, $")}$ points.${askSize ? ` The largest cluster has $${largest}$ points.` : ` There are $${k}$ clusters.`}`,
                `空白把这些点分成了 $${k}$ 组，分别有 $${sizes.join("$、$")}$ 个点。${askSize ? `最大的点群有 $${largest}$ 个点。` : `共有 $${k}$ 个点群。`}`,
              ),
            }),
            figure: scatterFigure(pts.sort((a, b) => a[0] - b[0] || a[1] - b[1])),
          };
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Informally assessing the fit of a trend line

/** bestFit is the least-squares line [slope, intercept] of the points, used to draw a line through curved or scattered data. */
function bestFit(pts: readonly Pt[]): readonly [number, number] {
  const n = pts.length;
  const mx = sum(pts.map((p) => p[0])) / n;
  const my = sum(pts.map((p) => p[1])) / n;
  const sxy = sum(pts.map(([x, y]) => (x - mx) * (y - my)));
  const sxx = sum(pts.map(([x]) => (x - mx) ** 2));
  return [sxy / sxx, my - (sxy / sxx) * mx];
}

/** offBy is the total vertical distance from the points to the line y = mx + b. */
const offBy = (pts: readonly Pt[], m: number, b: number) => sum(pts.map(([x, y]) => Math.abs(y - (m * x + b))));

/** fitOptions answer whether a trend line fits a scatter plot well. */
const fitOptions: readonly Text[] = [
  t("Yes: the points lie close to the line, on both sides of it", "是：点紧靠直线，分布在它的两侧"),
  t("No: the points follow a curve, so no line fits them well", "否：点沿曲线分布，没有直线能很好地拟合它们"),
  t("No: the points are scattered far from the line, with no linear pattern", "否：点远离直线、分散分布，没有线性模式"),
];

export const assessingTheFitOfATrendLine = topic(
  "informally-assessing-the-fit-of-a-trend-line-to-a-scatter-plot",
  t("Informally Assessing the Fit of a Trend Line to a Scatter Plot", "直观评估趋势线对散点图的拟合"),
  t(
    "Judge how well a trend line fits the data by how close the points lie to it: compare two lines, decide whether any line fits, and add up the vertical distances.",
    "根据点离趋势线的远近，判断趋势线拟合数据的好坏：比较两条直线，判断是否有直线能拟合，并把竖直距离加起来。",
  ),
  ["trend-lines", "describing-patterns-of-association-in-scatter-plots"],
  ["8.SP.A.2"],
  [
    {
      id: "which-line-fits-better",
      title: t("Which line fits better", "哪条直线拟合得更好"),
      explanation: t(
        "A trend line fits well when the points lie close to it, with about as many above it as below it. To compare two lines, look at the **vertical distances** from the points to each line: the line whose distances are smaller overall fits better.\n\nA line can have the right direction and still fit worse than another, by passing too high, too low, or too steeply.",
        "当点紧靠趋势线、上下两侧的点大致一样多时，趋势线拟合得好。比较两条直线时，看各点到每条直线的**竖直距离**：总体上距离更小的直线拟合得更好。\n\n一条直线即使方向正确，也可能因为太高、太低或太陡而不如另一条拟合得好。",
      ),
      generate(rng) {
        for (;;) {
          const slope = Q.of(rng.sign() * rng.int(2, 4), 4);
          const c = rng.int(4, 6);
          const b = Q.of(c).sub(slope.mul(Q.of(5)));
          const pts = near(rng, xsOf(rng, 8), slope, b, 1);
          if (!pts) continue;
          // The worse line is shifted up or down, or turned about the middle of the data.
          const shifted = rng.int(0, 1) === 0;
          const badSlope = shifted ? slope : slope.add(Q.of(slope.sign() * rng.int(2, 3), 4));
          const badB = shifted ? b.add(Q.of(rng.sign() * 2)) : Q.of(c).sub(badSlope.mul(Q.of(5)));
          const good = offBy(pts, slope.toNumber(), b.toNumber());
          const bad = offBy(pts, badSlope.toNumber(), badB.toNumber());
          if (bad < 1.6 * good) continue;
          const solidGood = rng.int(0, 1) === 0;
          const [solid, dashed] = solidGood ? [good, bad] : [bad, good];
          const lines: PlaneMark[] = solidGood
            ? [lineMark(slope, b), lineMark(badSlope, badB, true)]
            : [lineMark(badSlope, badB), lineMark(slope, b, true)];
          const [sl, dl] = solidGood ? [plainLine(slope, b), plainLine(badSlope, badB)] : [plainLine(badSlope, badB), plainLine(slope, b)];
          const why = shifted
            ? t(
                `The other line has the same direction but passes ${badB.sub(b).sign() > 0 ? "above" : "below"} most of the points.`,
                `另一条直线方向相同，但从大多数点的${badB.sub(b).sign() > 0 ? "上方" : "下方"}经过。`,
              )
            : t("The other line is too steep: it is far from the points at both ends.", "另一条直线太陡了：在两端离点很远。");
          const better = solidGood ? t("solid", "实线") : t("dashed", "虚线");
          return {
            ...choiceProblem({
              prompt: t("Which line fits the data better?", "哪条直线对数据拟合得更好？"),
              options: [
                t("The solid line", "实线"),
                t("The dashed line", "虚线"),
                t("They fit equally well, since each has points on both sides", "拟合得一样好，因为每条直线两侧都有点"),
                t("It cannot be told, since neither passes through every point", "无法判断，因为没有一条直线经过所有的点"),
              ],
              correct: solidGood ? 0 : 1,
              solution: t(
                `Add up the vertical distances from the points to each line: about $${one(solid)}$ for the solid line and about $${one(dashed)}$ for the dashed line. The ${better.en} line passes closer to the points, with points on both sides of it, so it fits better. ${why.en}`,
                `把各点到每条直线的竖直距离加起来：实线约为 $${one(solid)}$，虚线约为 $${one(dashed)}$。${better["zh-CN"]}离点更近，两侧都有点，所以拟合得更好。${why["zh-CN"]}`,
              ),
            }),
            figure: scatterFigure(pts, lines, [`the solid line ${sl} and the dashed line ${dl}`, `实线 ${sl} 和虚线 ${dl}`]),
          };
        }
      },
    },
    {
      id: "does-a-line-fit-the-data",
      figure: gradeDrawings5["informally-assessing-the-fit-of-a-trend-line-to-a-scatter-plot#does-a-line-fit-the-data"],
      title: t("Whether a line fits the data", "直线是否拟合数据"),
      explanation: t(
        "Every scatter plot has a line that fits it best, but that line is a good model only when the data have a **linear** pattern. Before trusting a trend line, check the points:\n\n- they lie close to the line, on both sides of it: the line fits well;\n- they follow a curve, above the line in some places and below it in others: a line does not fit, whichever line is drawn;\n- they are scattered far from the line with no pattern: a line does not fit, and predictions from it would be little better than guesses.",
        "每个散点图都有一条拟合得最好的直线，但只有当数据呈**线性**模式时，这条直线才是好的模型。在信任一条趋势线之前，要先看点：\n\n- 点紧靠直线，分布在它的两侧：直线拟合得好；\n- 点沿一条曲线分布，有的地方在直线上方，有的地方在下方：无论画哪条直线都不能很好地拟合；\n- 点远离直线、散乱分布，没有模式：直线不能拟合，用它预测和瞎猜差不多。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let pts: Pt[];
        if (kind === 0) {
          let p: Pt[] | undefined;
          while (!p || Math.abs(pearson(p)) < 0.9) {
            const slope = Q.of(rng.sign() * rng.int(2, 4), 4);
            p = near(rng, xsOf(rng, 9), slope, Q.of(rng.int(4, 6)).sub(slope.mul(Q.of(5))), 1);
          }
          pts = p;
        } else pts = kind === 1 ? curved(rng).pts : scattered(rng, 9);
        const [mm, bb] = bestFit(pts);
        const line: PlaneMark = { kind: "line", a: [0, bb], b: [10, bb + 10 * mm], accent: true };
        const plain = `y = ${one(mm)}x ${bb < 0 ? "-" : "+"} ${one(Math.abs(bb))}`;
        return {
          ...choiceProblem({
            prompt: t(
              "A trend line is drawn on the scatter plot. Does it fit the data well?",
              "散点图上画出了一条趋势线。它对数据拟合得好吗？",
            ),
            options: fitOptions,
            correct: kind,
            solution: [
              t(
                "The points lie close to the line, some above it and some below it, all along its length: the line fits the data well.",
                "沿着整条直线，点都紧靠着它，有的在上方，有的在下方：这条直线对数据拟合得好。",
              ),
              t(
                "The points follow a curve: they lie on one side of the line at the ends and on the other side in the middle. No straight line can follow a curve, so the line does not fit well.",
                "点沿一条曲线分布：两端在直线的一侧，中间在另一侧。直线无法贴合曲线，所以这条直线拟合得不好。",
              ),
              t(
                "The points are scattered far from the line, with no linear pattern for any line to follow: the line does not fit well.",
                "点远离直线、散乱分布，没有任何直线可以贴合的线性模式：这条直线拟合得不好。",
              ),
            ][kind]!,
          }),
          figure: scatterFigure(pts, [line], [`the line ${plain}`, `直线 ${plain}`]),
        };
      },
    },
    {
      id: "total-distance-to-a-trend-line",
      title: t("Adding up the distances to a trend line", "求各点到趋势线的距离之和"),
      explanation: t(
        "One way to measure how well a line fits is to add up the **vertical distances** from the points to the line. For each point, find the $y$-value of the line at the point’s $x$-value and take the distance between the two $y$-values, which is never negative. The smaller the total, the better the fit.\n\nFor the line $y = x + 1$ and the point $(3, 6)$: the line passes through $(3, 4)$, so the distance is $6 - 4 = 2$. For the point $(5, 4)$, the line is at $6$ and the distance is $6 - 4 = 2$ as well, not $-2$.",
        "衡量直线拟合好坏的一种方法，是把各点到直线的**竖直距离**加起来。对每个点，求出直线在该点 $x$ 值处的 $y$ 值，再求这两个 $y$ 值之间的距离，距离永远不是负数。总和越小，拟合得越好。\n\n对直线 $y = x + 1$ 和点 $(3, 6)$：直线经过 $(3, 4)$，所以距离是 $6 - 4 = 2$。对点 $(5, 4)$，直线在 $6$ 处，距离也是 $6 - 4 = 2$，而不是 $-2$。",
      ),
      generate(rng) {
        for (;;) {
          const half = rng.int(0, 1) === 1;
          const slope = Q.of(rng.sign(), half ? 2 : 1);
          const xs = half ? [2, 4, 6, 8] : xsOf(rng, 5);
          const b = Q.of(rng.int(half ? 2 : 1, half ? 6 : 8));
          const at = (x: number) => slope.mul(Q.of(x)).add(b).toNumber();
          const ds = xs.map(() => rng.int(-2, 2));
          const pts = xs.map((x, i): Pt => [x, at(x) + ds[i]!]);
          if (pts.some(([, y]) => y < 1 || y > 9) || xs.some((x) => at(x) < 1 || at(x) > 9)) continue;
          if (!ds.some((d) => d > 0) || !ds.some((d) => d < 0)) continue;
          const answer = sum(ds.map(Math.abs));
          const line = `y = ${linear(slope, b)}`;
          const list = pts.map(([x, y]) => `$(${x}, ${y})$`);
          const lines = pts.map(([x, y]) => `|${y} - ${at(x)}| = ${Math.abs(y - at(x))}`);
          return {
            ...numberProblem({
              prompt: t(
                `The scatter plot shows the points ${list.join(", ")} and the trend line $${line}$. What is the total of the vertical distances from the points to the line?`,
                `散点图显示了点 ${list.join("、")} 和趋势线 $${line}$。各点到这条直线的竖直距离之和是多少？`,
              ),
              answer,
              form: "integer",
              // Adding the signed differences, counting the points off the line, or taking only the largest distance.
              wrong: [sum(ds), ds.filter((d) => d !== 0).length, Math.max(...ds.map(Math.abs))],
              solution: t(
                `For each point, compare its $y$-value with the line’s $y$-value at the same $x$:${steps(...lines)}Add the distances: $${ds.map(Math.abs).join(" + ")} = ${answer}$.`,
                `对每个点，把它的 $y$ 值与直线在同一 $x$ 处的 $y$ 值比较：${steps(...lines)}把距离相加：$${ds.map(Math.abs).join(" + ")} = ${answer}$。`,
              ),
            }),
            figure: scatterFigure(pts, [lineMark(slope, b)], [`the line ${plainLine(slope, b)}`, `直线 ${plainLine(slope, b)}`]),
          };
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Relative frequencies from two-way tables

/** percentOf is 100·v / total as a rational number. */
const percentOf = (v: number, total: number) => Q.of(100 * v, total);

/** rounded is a percent rounded to the nearest whole number, as a student dividing by the wrong total would write it. */
const rounded = (v: number, total: number) => Math.round((100 * v) / total);

/** counts draws the counts of a 2 by 3 two-way table. */
const counts = (rng: Rng) => [0, 1].map(() => [0, 1, 2].map(() => rng.int(3, 40)));

/** percentLine writes v / total = decimal = percent. */
const percentLine = (v: number, total: number) => `\\frac{${v}}{${total}} = ${dec(Q.of(v, total))} = ${percentOf(v, total).toLatex()}\\%`;

export const calculatingRelativeFrequencies = topic(
  "calculating-relative-frequencies-from-two-way-tables",
  t("Calculating Relative Frequencies From Two-Way Tables", "由双向表计算相对频率"),
  t(
    "Turn the counts of a two-way table into relative frequencies of a row or a column, and read counts back from a table of relative frequencies.",
    "把双向表中的频数化为某一行或某一列中的相对频率，并由相对频率表求出频数。",
  ),
  ["joint-frequency-tables"],
  ["8.SP.A.4"],
  [
    {
      id: "row-relative-frequencies",
      title: t("Relative frequencies within a row", "行内的相对频率"),
      explanation: t(
        "A **row relative frequency** describes one group: it divides a cell by the total of its row. “What percent of the 7th graders prefer dogs?” is about the 7th graders only, so divide the number of 7th graders who prefer dogs by the number of 7th graders. If $18$ of $45$ 7th graders prefer dogs, the row relative frequency is $\\frac{18}{45} = 0.4 = 40\\%$.\n\nThe relative frequencies of a row add up to $100\\%$.",
        "**行相对频率**描述一个组：用单元格中的数除以它所在行的合计。“七年级学生中喜欢狗的占百分之几？”只涉及七年级学生，所以用喜欢狗的七年级学生人数除以七年级学生人数。如果 $45$ 名七年级学生中有 $18$ 名喜欢狗，行相对频率就是 $\\frac{18}{45} = 0.4 = 40\\%$。\n\n一行的相对频率加起来等于 $100\\%$。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        for (;;) {
          const c = counts(rng);
          const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
          const v = c[i]![j]!;
          const rowTotal = sum(c[i]!);
          if (!percentOf(v, rowTotal).isInteger()) continue;
          const colTotal = c[0]![j]! + c[1]![j]!;
          const grand = sum(c.flat());
          const [r, col] = [w.rows[i]!, w.cols[j]!];
          return numberProblem({
            prompt: t(
              `${w.intro.en}${jointTable(w, c, [], "", 0)}${w.ofRow(r, col).en}`,
              `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.ofRow(r, col)["zh-CN"]}`,
            ),
            answer: percentOf(v, rowTotal),
            percent: true,
            // Dividing by the column total or the grand total.
            wrong: [rounded(v, colTotal), rounded(v, grand), v],
            solution: t(
              `The question is about the ${r[0]} only, so divide by the total of their row, $${rowTotal}$:${steps(percentLine(v, rowTotal))}`,
              `问题只涉及${r[1]}，所以除以他们那一行的合计 $${rowTotal}$：${steps(percentLine(v, rowTotal))}`,
            ),
          });
        }
      },
    },
    {
      id: "column-relative-frequencies",
      title: t("Relative frequencies within a column", "列内的相对频率"),
      explanation: t(
        "A **column relative frequency** divides a cell by the total of its column. “Of the students who prefer dogs, what percent are 7th graders?” is about the students who prefer dogs, so divide the number of 7th graders who prefer dogs by the number of students who prefer dogs.\n\nThe group named after “of the” gives the denominator. The two questions sound alike but have different answers: with $18$ of the $45$ 7th graders and $18$ of the $30$ dog lovers, $\\frac{18}{45} = 40\\%$ of the 7th graders prefer dogs, while $\\frac{18}{30} = 60\\%$ of the dog lovers are 7th graders.",
        "**列相对频率**用单元格中的数除以它所在列的合计。“喜欢狗的学生中，七年级学生占百分之几？”涉及的是喜欢狗的学生，所以用喜欢狗的七年级学生人数除以喜欢狗的学生人数。\n\n“……中”前面说的那一组决定分母。两个问题听起来相似，答案却不同：$45$ 名七年级学生中有 $18$ 名喜欢狗，$30$ 名喜欢狗的学生中也是这 $18$ 名，那么七年级学生中 $\\frac{18}{45} = 40\\%$ 喜欢狗，而喜欢狗的学生中 $\\frac{18}{30} = 60\\%$ 是七年级学生。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        for (;;) {
          const c = counts(rng);
          const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
          const v = c[i]![j]!;
          const colTotal = c[0]![j]! + c[1]![j]!;
          if (!percentOf(v, colTotal).isInteger()) continue;
          const rowTotal = sum(c[i]!);
          const grand = sum(c.flat());
          const [r, col] = [w.rows[i]!, w.cols[j]!];
          return numberProblem({
            prompt: t(
              `${w.intro.en}${jointTable(w, c, [], "", 0)}${w.ofCol(r, col).en}`,
              `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.ofCol(r, col)["zh-CN"]}`,
            ),
            answer: percentOf(v, colTotal),
            percent: true,
            // Dividing by the row total or the grand total, or giving the other row's share of the column.
            wrong: [rounded(v, rowTotal), rounded(v, grand), rounded(colTotal - v, colTotal)],
            solution: t(
              `The question is about the people in the column “${col[0]}”, so divide by that column’s total, $${c[0]![j]!} + ${c[1]![j]!} = ${colTotal}$:${steps(percentLine(v, colTotal))}`,
              `问题涉及的是“${col[1]}”这一列的人，所以除以这一列的合计 $${c[0]![j]!} + ${c[1]![j]!} = ${colTotal}$：${steps(percentLine(v, colTotal))}`,
            ),
          });
        }
      },
    },
    {
      id: "reading-a-relative-frequency-table",
      title: t("Reading a table of row relative frequencies", "读行相对频率表"),
      explanation: t(
        "A table of row relative frequencies shows each row as percents of its own total, so every row adds up to $100\\%$. To turn a percent back into a count, multiply it by the row’s total: if $35\\%$ of $60$ adults came by car, then $0.35 \\cdot 60 = 21$ adults came by car.\n\nUse the total of that row, not the grand total: the percents of different rows are parts of different wholes.",
        "行相对频率表把每一行表示为该行合计的百分比，所以每一行加起来都是 $100\\%$。要把百分比还原为频数，用它乘这一行的合计：如果 $60$ 名成人中有 $35\\%$ 开车来，那么开车来的成人有 $0.35 \\cdot 60 = 21$ 名。\n\n要用这一行的合计，而不是总计：不同行的百分比是不同整体的一部分。",
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        for (;;) {
          const totals = rng.sample([40, 60, 80, 100, 120, 140, 160], 2);
          const pcts = [0, 1].map(() => {
            const a = 5 * rng.int(2, 12);
            const b = 5 * rng.int(2, 18 - a / 5);
            return [a, b, 100 - a - b];
          });
          if (pcts.some((r) => r[2]! < 10)) continue;
          const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
          const p = pcts[i]![j]!;
          const n = totals[i]!;
          const answer = (p * n) / 100;
          const grand = totals[0]! + totals[1]!;
          const [r, col] = [w.rows[i]!, w.cols[j]!];
          const table = (lang: 0 | 1) =>
            mdTable(
              ["", ...w.cols.map((x) => x[lang]), lang === 0 ? "Total" : "合计"],
              w.rows.map((row, k) => [row[lang], ...pcts[k]!.map((v) => m(`${v}\\%`)), m("100\\%")]),
            );
          const sizes = t(
            `There were $${totals[0]}$ ${w.rows[0]![0]} and $${totals[1]}$ ${w.rows[1]![0]}.`,
            `其中有${w.rows[0]![1]} $${totals[0]}$ 名，${w.rows[1]![1]} $${totals[1]}$ 名。`,
          );
          return numberProblem({
            prompt: t(
              `${w.intro.en} The table shows the answers of each group as percents of that group.${table(0)}${sizes.en} ${w.cell(r, col).en}`,
              `${w.intro["zh-CN"]}下表用各组人数的百分比表示了每一组的回答。${table(1)}${sizes["zh-CN"]}${w.cell(r, col)["zh-CN"]}`,
            ),
            answer,
            form: "integer",
            // The percent itself, or the percent of the grand total or of the other row.
            wrong: [p, (p * grand) / 100, (p * totals[1 - i]!) / 100].filter((x) => Number.isInteger(x)),
            solution: t(
              `$${p}\\%$ of the $${n}$ ${r[0]}:${steps(`${dec(Q.of(p, 100))} \\cdot ${n} = ${answer}`)}`,
              `${r[1]}共 $${n}$ 名，其中的 $${p}\\%$：${steps(`${dec(Q.of(p, 100))} \\cdot ${n} = ${answer}`)}`,
            ),
          });
        }
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Patterns of association in two-way tables

/** Study is a survey of two yes-or-no questions, shown in a 2 by 2 table. */
interface Study {
  readonly intro: Text;
  /** rows label the rows of the table: "Curfew", "No curfew". */
  readonly rows: readonly [Pair, Pair];
  /** groups name the people of each row in a sentence: "students with a curfew". */
  readonly groups: readonly [Pair, Pair];
  readonly cols: readonly [Pair, Pair];
  /** act is what the people of the first column do: "do chores on school nights". */
  readonly act: Pair;
  /** vars names the two variables: "having a curfew and doing chores on school nights". */
  readonly vars: Pair;
}

const studies: readonly Study[] = [
  {
    intro: t(
      "Students were asked whether they have a curfew and whether they do chores on school nights.",
      "调查了学生是否有门禁时间，以及是否在上学日晚上做家务。",
    ),
    rows: [
      ["Curfew", "有门禁"],
      ["No curfew", "无门禁"],
    ],
    groups: [
      ["students with a curfew", "有门禁时间的学生"],
      ["students without a curfew", "没有门禁时间的学生"],
    ],
    cols: [
      ["Chores", "做家务"],
      ["No chores", "不做家务"],
    ],
    act: ["do chores on school nights", "在上学日晚上做家务"],
    vars: ["having a curfew and doing chores on school nights", "是否有门禁时间与是否在上学日晚上做家务"],
  },
  {
    intro: t(
      "Students were asked whether they play a musical instrument and whether they play on a sports team.",
      "调查了学生是否演奏乐器，以及是否参加运动队。",
    ),
    rows: [
      ["Instrument", "演奏乐器"],
      ["No instrument", "不演奏乐器"],
    ],
    groups: [
      ["students who play an instrument", "演奏乐器的学生"],
      ["students who do not play an instrument", "不演奏乐器的学生"],
    ],
    cols: [
      ["Sports team", "参加运动队"],
      ["No sports team", "不参加运动队"],
    ],
    act: ["play on a sports team", "参加运动队"],
    vars: ["playing an instrument and playing on a sports team", "是否演奏乐器与是否参加运动队"],
  },
  {
    intro: t(
      "Students were asked whether they ate breakfast and whether they felt tired in the afternoon.",
      "调查了学生是否吃了早餐，以及下午是否感到疲倦。",
    ),
    rows: [
      ["Breakfast", "吃早餐"],
      ["No breakfast", "没吃早餐"],
    ],
    groups: [
      ["students who ate breakfast", "吃了早餐的学生"],
      ["students who did not eat breakfast", "没吃早餐的学生"],
    ],
    cols: [
      ["Tired", "疲倦"],
      ["Not tired", "不疲倦"],
    ],
    act: ["feel tired in the afternoon", "下午感到疲倦"],
    vars: ["eating breakfast and feeling tired in the afternoon", "是否吃早餐与下午是否感到疲倦"],
  },
  {
    intro: t(
      "A store mailed coupons to some of its customers and recorded which customers made a purchase that week.",
      "一家商店给部分顾客寄了优惠券，并记录了哪些顾客在那一周购买了商品。",
    ),
    rows: [
      ["Coupon", "收到优惠券"],
      ["No coupon", "没收到优惠券"],
    ],
    groups: [
      ["customers who got a coupon", "收到优惠券的顾客"],
      ["customers who did not get a coupon", "没收到优惠券的顾客"],
    ],
    cols: [
      ["Purchase", "购买"],
      ["No purchase", "未购买"],
    ],
    act: ["make a purchase", "购买商品"],
    vars: ["getting a coupon and making a purchase", "是否收到优惠券与是否购买商品"],
  },
  {
    intro: t(
      "Adults were asked whether they own a dog and whether they walk at least $30$ minutes a day.",
      "调查了成年人是否养狗，以及是否每天步行至少 $30$ 分钟。",
    ),
    rows: [
      ["Dog", "养狗"],
      ["No dog", "不养狗"],
    ],
    groups: [
      ["adults who own a dog", "养狗的成年人"],
      ["adults who do not own a dog", "不养狗的成年人"],
    ],
    cols: [
      ["Walks daily", "每天步行"],
      ["Does not", "不每天步行"],
    ],
    act: ["walk at least $30$ minutes a day", "每天步行至少 $30$ 分钟"],
    vars: ["owning a dog and walking at least $30$ minutes a day", "是否养狗与是否每天步行至少 $30$ 分钟"],
  },
];

/** groupSizes are the row totals of the 2 by 2 tables; each percent drawn for a row must give a whole count. */
const groupSizes = [20, 25, 40, 50, 80, 100];

/** Survey is a 2 by 2 table: the row totals and the percent of each row in the first column. */
interface Survey {
  readonly totals: readonly [number, number];
  readonly pcts: readonly [number, number];
}

/** survey draws a 2 by 2 table whose two row percents differ by at least gap points, or by at most 4 points when gap is 0. */
function survey(rng: Rng, gap: number, sizes: readonly [number, number] = rng.sample(groupSizes, 2) as [number, number]): Survey {
  for (;;) {
    const pcts = sizes.map(() => rng.int(10, 90)) as [number, number];
    if (pcts.some((p, k) => (p * sizes[k]!) % 100 !== 0)) continue;
    const d = Math.abs(pcts[0] - pcts[1]);
    if (gap === 0 ? d <= 4 : d >= gap) return { totals: sizes, pcts };
  }
}

/** yesCount is the number of people of row k in the first column. */
const yesCount = (s: Survey, k: number) => (s.pcts[k]! * s.totals[k]!) / 100;

/** surveyTable writes the counts of a 2 by 2 table with totals. */
function surveyTable(st: Study, s: Survey, lang: 0 | 1): string {
  const total = lang === 0 ? "Total" : "合计";
  const cells = [0, 1].map((k) => [yesCount(s, k), s.totals[k]! - yesCount(s, k)]);
  return mdTable(
    ["", st.cols[0][lang], st.cols[1][lang], total],
    [
      ...[0, 1].map((k) => [st.rows[k]![lang], ...cells[k]!.map(m), m(s.totals[k]!)]),
      [total, m(cells[0]![0]! + cells[1]![0]!), m(cells[0]![1]! + cells[1]![1]!), m(s.totals[0] + s.totals[1])],
    ],
  );
}

/** surveyPrompt writes a study's introduction, its table and a question. */
const surveyPrompt = (st: Study, s: Survey, q: Text) =>
  t(`${st.intro.en}${surveyTable(st, s, 0)}${q.en}`, `${st.intro["zh-CN"]}${surveyTable(st, s, 1)}${q["zh-CN"]}`);

/** percentSteps works out the percent of each row in the first column, one row per line. */
function percentSteps(st: Study, s: Survey, lang: 0 | 1): string {
  const line = (k: number) =>
    `${st.rows[k]![lang]}${lang === 0 ? ": " : "："}$\\frac{${yesCount(s, k)}}{${s.totals[k]}} = ${s.pcts[k]}\\%$`;
  return steps(line(0), line(1));
}

/** rowPercents works out the percent of each row who do the act. */
const rowPercents = (st: Study, s: Survey) =>
  t(
    `Find the percent of each group who ${st.act[0]}:${percentSteps(st, s, 0)}`,
    `求每一组中${st.act[1]}的百分比：${percentSteps(st, s, 1)}`,
  );

/** likelier states that the people of row k are more likely than the others to do the act. */
const likelier = (st: Study, k: number) =>
  t(
    `${cap(st.groups[k]![0])} are more likely than ${st.groups[1 - k]![0]} to ${st.act[0]}.`,
    `${st.groups[k]![1]}比${st.groups[1 - k]![1]}更可能${st.act[1]}。`,
  );

export const identifyingAssociationInTwoWayTables = topic(
  "identifying-patterns-of-association-from-two-way-tables",
  t("Identifying Patterns of Association From Two-Way Tables", "由双向表识别关联模式"),
  t(
    "Compare the row relative frequencies of a two-way table to decide whether two categorical variables are associated, and describe the association.",
    "比较双向表的行相对频率，判断两个分类变量是否有关联，并描述这种关联。",
  ),
  ["calculating-relative-frequencies-from-two-way-tables"],
  ["8.SP.A.4"],
  [
    {
      id: "is-there-an-association",
      title: t("Whether two categorical variables are associated", "两个分类变量是否有关联"),
      explanation: t(
        "Two categorical variables are **associated** when the groups of one variable answer the other differently. To check, compare row relative frequencies: find the percent of each row that gives the same answer.\n\n- If the percents are about the same, the answer does not depend on the group: there is no association.\n- If they are clearly different, there is an association.\n\nIf $60\\%$ of students with a curfew do chores but only $25\\%$ of students without one do, curfews and chores are associated.",
        "如果一个变量的各组对另一个变量的回答不同，就说两个分类变量**有关联**。检验时比较行相对频率：求出每一行中给出同一回答的百分比。\n\n- 如果这些百分比大致相同，回答与所在的组无关：没有关联。\n- 如果它们明显不同，就有关联。\n\n如果有门禁时间的学生中 $60\\%$ 做家务，而没有门禁时间的学生中只有 $25\\%$ 做家务，那么门禁时间与做家务有关联。",
      ),
      generate(rng) {
        const st = rng.pick(studies);
        const yes = rng.int(0, 1) === 0;
        const s = survey(rng, yes ? 20 : 0);
        const work = rowPercents(st, s);
        // Each right-test option quotes percents, and only the one that goes with the answer quotes the true ones.
        const [p0, p1] = s.pcts;
        const shown = yes ? [p0, p1] : [p0, p0 > 50 ? p0 - 30 : p0 + 30];
        const about = yes ? Math.round((p0 + p1) / 2) : p0;
        return verdictChoice(rng, {
          prompt: surveyPrompt(st, s, t(`Is there an association between ${st.vars[0]}?`, `${st.vars[1]}之间有关联吗？`)),
          holds: yes,
          yes: t(
            `$${shown[0]}\\%$ of ${st.groups[0][0]} and $${shown[1]}\\%$ of ${st.groups[1][0]} ${st.act[0]}`,
            `${st.groups[0][1]}中有 $${shown[0]}\\%$、${st.groups[1][1]}中有 $${shown[1]}\\%$ ${st.act[1]}`,
          ),
          no: t(`about $${about}\\%$ of each group ${st.act[0]}`, `两组中都约有 $${about}\\%$ ${st.act[1]}`),
          yesWrong: t("the counts in the first column differ", "第一列中的频数不同"),
          noWrong: t("the two groups have different sizes", "两组的人数不同"),
          solution: yes
            ? t(
                `${work.en}The percents differ by $${Math.abs(s.pcts[0] - s.pcts[1])}$ points, so whether people ${st.act[0]} depends on their group: there is an association.`,
                `${work["zh-CN"]}两个百分比相差 $${Math.abs(s.pcts[0] - s.pcts[1])}$ 个百分点，是否${st.act[1]}与所在的组有关：有关联。`,
              )
            : t(
                `${work.en}The percents are about the same, so whether people ${st.act[0]} does not depend on their group: there is no association. The counts in the table differ only because the groups have different sizes.`,
                `${work["zh-CN"]}两个百分比大致相同，是否${st.act[1]}与所在的组无关：没有关联。表中的频数不同，只是因为两组的人数不同。`,
              ),
        });
      },
    },
    {
      id: "describing-an-association-in-a-two-way-table",
      title: t("Describing an association in a two-way table", "描述双向表中的关联"),
      explanation: t(
        "To describe an association, say which group is more likely to give an answer, judging by row relative frequencies: “Students with a curfew are more likely than students without a curfew to do chores.” If the row percents are about the same, say that there is no association.",
        "描述关联时，根据行相对频率说出哪一组更可能给出某个回答：“有门禁时间的学生比没有门禁时间的学生更可能做家务。”如果各行的百分比大致相同，就说没有关联。",
      ),
      generate(rng) {
        const st = rng.pick(studies);
        const kind = rng.int(0, 2);
        const s = survey(rng, kind === 2 ? 0 : 20);
        const none = t(`There is no association between ${st.vars[0]}.`, `${st.vars[1]}之间没有关联。`);
        const higher = s.pcts[0] > s.pcts[1] ? 0 : 1;
        const options = [likelier(st, 0), likelier(st, 1), none];
        const correct = kind === 2 ? none : options[higher]!;
        const work = rowPercents(st, s);
        return shuffledChoice(rng, {
          prompt: surveyPrompt(st, s, t("Which statement do the data support?", "数据支持哪一种说法？")),
          correct,
          wrong: options.filter((o) => o !== correct),
          solution:
            kind === 2
              ? t(`${work.en}The percents are about the same: there is no association.`, `${work["zh-CN"]}两个百分比大致相同：没有关联。`)
              : t(`${work.en}${correct.en}`, `${work["zh-CN"]}${correct["zh-CN"]}`),
        });
      },
    },
    {
      id: "comparing-groups-of-different-sizes",
      title: t("Comparing groups of different sizes", "比较人数不同的组"),
      explanation: t(
        "When the groups have different sizes, comparing counts can mislead: a large group can have more people who give an answer even though a smaller share of it does. Compare relative frequencies instead.\n\nIf $30$ of $100$ customers with a coupon bought something and $15$ of $25$ without one did, more buyers had coupons, but only $30\\%$ of coupon holders bought, against $60\\%$ of the others.",
        "当各组人数不同时，比较频数可能产生误导：一个大组里给出某个回答的人可能更多，但所占的比例却更小。应该比较相对频率。\n\n如果 $100$ 名收到优惠券的顾客中有 $30$ 名购买，$25$ 名没收到优惠券的顾客中有 $15$ 名购买，那么购买者中收到优惠券的更多，但收到优惠券的顾客只有 $30\\%$ 购买，而另一组有 $60\\%$ 购买。",
      ),
      generate(rng) {
        const st = rng.pick(studies);
        const big = rng.int(0, 1);
        const sizes: [number, number] =
          big === 0 ? [rng.pick([80, 100]), rng.pick([20, 25, 40])] : [rng.pick([20, 25, 40]), rng.pick([80, 100])];
        const misleading = rng.int(0, 2) > 0;
        for (;;) {
          const s = survey(rng, 15, sizes);
          const higher = s.pcts[0] > s.pcts[1] ? 0 : 1;
          const moreCount = yesCount(s, 0) > yesCount(s, 1) ? 0 : yesCount(s, 1) > yesCount(s, 0) ? 1 : -1;
          if (moreCount === -1 || (moreCount !== higher) !== misleading) continue;
          const work = rowPercents(st, s);
          return choiceProblem({
            prompt: surveyPrompt(st, s, t(`Which group is more likely to ${st.act[0]}?`, `哪一组更可能${st.act[1]}？`)),
            options: [
              t(cap(st.groups[0][0]), st.groups[0][1]),
              t(cap(st.groups[1][0]), st.groups[1][1]),
              t(`The two groups are equally likely to ${st.act[0]}`, `两组${st.act[1]}的可能性相同`),
              t("It cannot be determined, because the groups have different sizes", "无法判断，因为两组的人数不同"),
            ],
            correct: higher,
            solution: misleading
              ? t(
                  `The groups have different sizes, so compare percents, not counts:${percentSteps(st, s, 0)}${cap(st.groups[higher]![0])} are more likely to ${st.act[0]}, even though fewer of them do.`,
                  `两组人数不同，所以要比较百分比，而不是频数：${percentSteps(st, s, 1)}${st.groups[higher]![1]}更可能${st.act[1]}，尽管这样做的人数更少。`,
                )
              : t(
                  `${work.en}${cap(st.groups[higher]![0])} are more likely to ${st.act[0]}.`,
                  `${work["zh-CN"]}${st.groups[higher]![1]}更可能${st.act[1]}。`,
                ),
          });
        }
      },
    },
  ],
);

/** grade8BivariateTopics are the topics of 8th Grade Math, Unit 9, that other courses do not already have. */
export const grade8BivariateTopics: readonly TopicDef[] = [
  describingPatternsOfAssociation,
  assessingTheFitOfATrendLine,
  calculatingRelativeFrequencies,
  identifyingAssociationInTwoWayTables,
];
