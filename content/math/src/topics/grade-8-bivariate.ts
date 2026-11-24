import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, type PlaneMark, Q } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { lineMark, near, type Pair, type Pt, pearson, plainLine, scatterFigure, xsOf } from "./bivariate-statistics.ts";
import type { Walk, Wrong } from "./early-grades-more-kit.ts";
import { chosen, drawn, lesson, located, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { jointTable, m, mdTable, sum, twoWays } from "./grade-7-statistics.ts";
import { tableFigure } from "./grade-8-kit.ts";

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

/** pairOf turns a text into an English and Chinese pair. */
const pairOf = (x: Text): Pair => [x.en, x["zh-CN"]];

/** halves is the average height of the leftmost and of the rightmost half of the points, which are sorted by x. */
function halves(pts: readonly Pt[]): readonly [number, number, number] {
  const h = Math.floor(pts.length / 2);
  const mean = (ps: readonly Pt[]) => sum(ps.map((p) => p[1])) / ps.length;
  return [h, mean(pts.slice(0, h)), mean(pts.slice(pts.length - h))];
}

/** percentWalk finds the percent of each row of a study who do its act, as a labelled step. */
function percentWalk(st: Study, s: Survey): Walk {
  return [
    ["Find the row percents", "求行百分比"],
    [
      `Find the percent of each group who ${st.act[0]}: divide the count in the first column by the row total.`,
      `求每一组中${st.act[1]}的百分比：用第一列中的频数除以行合计。`,
    ],
    [0, 1].map((k) => `\\frac{${yesCount(s, k)}}{${s.totals[k]}} = ${s.pcts[k]}\\%`),
  ];
}

/** multiplyBack checks the row percents of a study against its counts. */
const multiplyBack = (s: Survey): Pair => [
  `Multiply back: $${s.pcts[0]}\\%$ of $${s.totals[0]}$ is $${yesCount(s, 0)}$, and $${s.pcts[1]}\\%$ of $${s.totals[1]}$ is $${yesCount(s, 1)}$, the counts in the table.`,
  `乘回去：$${s.totals[0]}$ 的 $${s.pcts[0]}\\%$ 是 $${yesCount(s, 0)}$，$${s.totals[1]}$ 的 $${s.pcts[1]}\\%$ 是 $${yesCount(s, 1)}$，正是表中的频数。`,
];

/** because writes a verdict with its reason. */
const because = (yes: boolean, reason: Text): Pair => [
  `${yes ? "Yes" : "No"}, because ${reason.en}.`,
  `${yes ? "是" : "否"}，因为${reason["zh-CN"].startsWith("$") ? " " : ""}${reason["zh-CN"]}。`,
];

/** closeEn says in English that two row percents d points apart are about the same. */
const closeEn = (d: number) => (d === 0 ? "The percents are equal" : `The percents differ by only $${d}$ points, about the same`);

/** closeZh says in Chinese that two row percents d points apart are about the same. */
const closeZh = (d: number) => (d === 0 ? "两个百分比相等" : `两个百分比只相差 $${d}$ 个百分点，大致相同`);

/** countTable is a two-way table of counts for two groups A and B, answering yes or no. */
const countTable = (cells: readonly (readonly number[])[], alt: Pair) =>
  tableFigure(
    ["A", "B"],
    ["✓", "✗", "Σ"],
    cells.map((r) => [...r.map(String), String(sum(r))]),
    alt,
  );

export const describingPatternsOfAssociation = withIntro(
  topic(
    "describing-patterns-of-association-in-scatter-plots",
    t("Describing Patterns of Association in Scatter Plots", "描述散点图中的关联模式"),
    t(
      "Describe the association in a scatter plot in words, tell linear from nonlinear association, and pick out outliers and clusters.",
      "用文字描述散点图中的关联，区分线性关联与非线性关联，并找出离群点和点群。",
    ),
    ["scatter-plots"],
    ["8.SP.A.1"],
    [
      lesson(
        "describing-an-association-in-context",
        ["Describing an association in context", "结合情境描述关联"],
        [
          [
            "Two variables are **associated** when knowing one tells you something about the other. In a scatter plot, a **positive association** rises from left to right: items with greater $x$-values tend to have greater $y$-values. A **negative association** falls: items with greater $x$-values tend to have smaller $y$-values. With **no association**, the points show no upward or downward trend. State an association in the words of the data, with “tend to”: “Students who study longer tend to score higher.”",
            "如果知道一个变量就能推知另一个变量的一些情况，就说这两个变量**有关联**。在散点图中，**正关联**从左到右上升：$x$ 值较大的对象，$y$ 值往往也较大。**负关联**从左到右下降：$x$ 值较大的对象，$y$ 值往往较小。**没有关联**时，点没有上升或下降的趋势。要用数据本身的语言、带上“往往”来描述关联：“学习时间更长的学生往往得分更高。”",
          ],
          [
            "Compare halves: when the right half of the points sits higher on average than the left half, the association is positive.",
            "比较左右两半：如果右半部分的点平均比左半部分高，就是正关联。",
          ],
          [
            "An association is a tendency, not a rule: a student who studied longer than another may still have scored lower, so “always” is wrong.",
            "关联只是一种倾向，而不是规律：一名学生学习的时间比另一名长，得分仍可能更低，所以说“总是”是错的。",
          ],
        ],
        (rng) => {
          const c = rng.pick(contexts);
          const n = rng.int(7, 9);
          const kind = rng.int(0, 2);
          for (;;) {
            const pts = kind === 0 ? trending(rng, 1, n) : kind === 1 ? trending(rng, -1, n) : scattered(rng, n);
            const [h, left, right] = halves(pts);
            if (kind < 2 && (kind === 0 ? 1 : -1) * (right - left) < 1) continue;
            const up = tendency(c, c.up, false);
            const down = tendency(c, c.down, false);
            const none = noAssociation(c);
            const always = tendency(c, kind === 1 ? c.down : c.up, true);
            const statements = [up, down, none];
            const correct = statements[kind]!;
            const dir: Pair = kind === 0 ? ["rise", "上升"] : ["fall", "下降"];
            const wrong: Wrong[] =
              kind === 2
                ? [
                    [
                      pairOf(up),
                      "The points do not rise from left to right; there is no upward trend.",
                      "点从左到右并不上升，没有上升的趋势。",
                    ],
                    [
                      pairOf(down),
                      "The points do not fall from left to right; there is no downward trend.",
                      "点从左到右并不下降，没有下降的趋势。",
                    ],
                    [
                      pairOf(always),
                      "The points show no upward trend at all, let alone one with no exceptions.",
                      "点根本没有上升的趋势，更谈不上毫无例外。",
                    ],
                  ]
                : [
                    [
                      pairOf(statements[1 - kind]!),
                      `The points ${dir[0]} from left to right, so the association goes the other way.`,
                      `点从左到右${dir[1]}，关联的方向正好相反。`,
                    ],
                    [
                      pairOf(none),
                      `The points ${dir[0]} from left to right; a trend like that is an association.`,
                      `点从左到右${dir[1]}，这样的趋势就是关联。`,
                    ],
                    [
                      pairOf(always),
                      `Some points are ${kind === 0 ? "lower" : "higher"} than points to their left, so it does not always happen; it is a tendency.`,
                      `有些点比它左边的点更${kind === 0 ? "低" : "高"}，所以并非总是如此，这只是一种倾向。`,
                    ],
                  ];
            return chosen(
              rng,
              [`${c.intro(n).en} Which statement describes the data?`, `${c.intro(n)["zh-CN"]}哪一句话描述了这组数据？`],
              pairOf(correct),
              wrong,
              [
                [
                  ["Read the trend", "看趋势"],
                  kind === 2
                    ? [
                        "From left to right the points neither rise nor fall on the whole: there is no association.",
                        "从左到右，点总体上既不上升也不下降：没有关联。",
                      ]
                    : [
                        `From left to right the points ${dir[0]} on the whole, so the association is ${kind === 0 ? "positive" : "negative"}.`,
                        `从左到右，点总体上${dir[1]}，所以是${kind === 0 ? "正" : "负"}关联。`,
                      ],
                ],
                [
                  ["Say it in context", "结合情境表述"],
                  kind === 2
                    ? [`There is no trend to describe. ${none.en}`, `没有可描述的趋势。${none["zh-CN"]}`]
                    : [
                        `Put it in the words of the data, with “tend to”. ${correct.en}`,
                        `用数据的语言、带上“往往”来表述。${correct["zh-CN"]}`,
                      ],
                ],
              ],
              kind === 2
                ? [
                    "A line through the middle of the points would be nearly flat, with points far above and below it all along.",
                    "穿过这些点中间的直线几乎是平的，沿途上下都有离它很远的点。",
                  ]
                : [
                    `Compare halves: the ${h} leftmost points have an average height of $${one(left)}$, and the ${h} rightmost points $${one(right)}$.`,
                    `比较左右两半：最左边 ${h} 个点的平均高度是 $${one(left)}$，最右边 ${h} 个点是 $${one(right)}$。`,
                  ],
              scatterFigure(pts),
            );
          }
        },
        drawn(gradeDrawings5["describing-patterns-of-association-in-scatter-plots#describing-an-association-in-context"]),
      ),
      lesson(
        "linear-and-nonlinear-association",
        ["Linear and nonlinear association", "线性关联与非线性关联"],
        [
          [
            "An association is **linear** when the points lie roughly along a straight line, and **nonlinear** when they follow a curve: they may rise and then fall, or rise more and more steeply. A nonlinear association is still an association: knowing $x$ tells you about $y$, but no straight line describes it well. When the points are spread over the plot with no pattern at all, there is **no association**.",
            "当点大致沿一条直线分布时，关联是**线性**的；当点沿一条曲线分布时，关联是**非线性**的：点可能先上升后下降，也可能上升得越来越陡。非线性关联仍然是关联：知道 $x$ 能推知 $y$ 的情况，只是没有一条直线能很好地描述它。如果点散布在整个图中，看不出任何模式，就**没有关联**。",
          ],
          [
            "Lay a ruler along the points shown: they rise and then fall, so the ends lie below the ruler and the middle above it. No straight line follows them.",
            "沿图中的点放一把直尺：点先上升后下降，两端在直尺下方，中间在直尺上方。没有直线能贴合它们。",
          ],
          [
            "A curve is not the same as no association: points on a clear curve tell you a lot about $y$ from $x$.",
            "沿曲线分布不等于没有关联：点沿着清楚的曲线分布时，由 $x$ 能推知很多关于 $y$ 的情况。",
          ],
        ],
        (rng) => {
          const kind = rng.int(0, 2);
          let pts: Pt[] | undefined;
          let curve: Pair = ["", ""];
          if (kind === 1) ({ pts, curve } = curved(rng));
          else if (kind === 0)
            while (!pts || Math.abs(pearson(pts)) < 0.9) {
              const slope = Q.of(rng.sign() * rng.int(2, 4), 4);
              pts = near(rng, xsOf(rng, 8), slope, Q.of(rng.int(4, 6)).sub(slope.mul(Q.of(5))), 1);
            }
          else pts = scattered(rng, 8);
          const option = (i: number) => pairOf(shapeOptions[i]!);
          const reasons: readonly (readonly Wrong[])[] = [
            [
              [
                option(1),
                "The points do not bend: a straight line passes close to all of them.",
                "点没有弯曲：一条直线从它们所有点的附近经过。",
              ],
              [
                option(2),
                "The points move steadily in one direction from left to right; that is an association.",
                "点从左到右稳定地朝一个方向变化，这就是关联。",
              ],
            ],
            [
              [option(0), `No straight line follows the points: they ${curve[0]}.`, `没有直线能贴合这些点：它们${curve[1]}。`],
              [
                option(2),
                "The points follow a clear curve, so knowing $x$ tells you about $y$: that is an association.",
                "点沿一条清楚的曲线分布，知道 $x$ 就能推知 $y$：这就是关联。",
              ],
            ],
            [
              [
                option(0),
                "No straight line passes close to the points: they are spread all over the plot.",
                "没有直线从这些点附近经过：它们散布在整个图中。",
              ],
              [option(1), "The points do not follow a curve either; they show no pattern at all.", "这些点也不沿曲线分布，根本没有模式。"],
            ],
          ];
          const look: readonly Pair[] = [
            ["The points move steadily from left to right.", "点从左到右稳定地变化。"],
            [`The points have a clear pattern: they ${curve[0]}.`, `点有清楚的模式：它们${curve[1]}。`],
            ["The points are spread over the plot, with no trend and no curve.", "点散布在整个图中，既没有趋势，也不沿曲线分布。"],
          ];
          const decide: readonly Pair[] = [
            ["They lie close to a straight line, so the association is linear.", "它们紧靠一条直线，所以是线性关联。"],
            ["A curve, not a line, follows them, so the association is nonlinear.", "贴合它们的是曲线而不是直线，所以是非线性关联。"],
            ["With no pattern of either kind, there is no association.", "两种模式都没有，所以没有关联。"],
          ];
          const ruler: readonly Pair[] = [
            [
              "Lay a ruler along the points: they stay close to it from one end to the other.",
              "沿这些点放一把直尺：从一端到另一端，点都紧靠着它。",
            ],
            [
              "Lay a ruler along the points: the points at the ends and the points in the middle fall on opposite sides of it.",
              "沿这些点放一把直尺：两端的点和中间的点落在直尺的两侧。",
            ],
            ["Any ruler laid across the plot leaves points far above and far below it.", "无论怎样放直尺，都有点远在它的上方和下方。"],
          ];
          return chosen(
            rng,
            ["What kind of association does the scatter plot show?", "这个散点图显示的是哪种关联？"],
            option(kind),
            reasons[kind]!,
            [
              [["Look for a pattern", "找模式"], look[kind]!],
              [["Line or curve", "直线还是曲线"], decide[kind]!],
            ],
            ruler[kind]!,
            scatterFigure(pts),
          );
        },
        scatterFigure([
          [1, 2],
          [2, 5],
          [3, 7],
          [4, 8],
          [5, 8],
          [6, 7],
          [7, 5],
          [8, 2],
        ]),
      ),
      lesson(
        "outliers-in-scatter-plots",
        ["Outliers", "离群点"],
        [
          [
            "An **outlier** is a point that lies far from the pattern of the other points. It need not have the greatest or the smallest coordinates: a point in the middle of the plot is an outlier when the others run along a line well above or below it. To find an outlier, first see the pattern, such as a line the points follow, and then look for the point far off it. In the plot shown, the points lie on $y = x + 1$, except $(5, 2)$.",
            "**离群点**是远离其他点的分布模式的点。它不一定有最大或最小的坐标：如果其他点沿一条直线分布，而某个点远在这条直线的上方或下方，那么即使它位于图的中部，也是离群点。找离群点时，先看出点的分布模式，比如点所沿的直线，再找远离这个模式的点。图中的点都在 $y = x + 1$ 上，只有 $(5, 2)$ 除外。",
          ],
          [
            "At $x = 5$ the line is at $6$, and $(5, 2)$ is $4$ units below it.",
            "在 $x = 5$ 处直线的高度是 $6$，而 $(5, 2)$ 比它低 $4$ 个单位。",
          ],
          [
            "The outlier is not simply the lowest point: $(1, 2)$ is just as low, but it lies on the line.",
            "离群点不只是最低的点：$(1, 2)$ 一样低，但它在直线上。",
          ],
        ],
        (rng) => {
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
            const [side, sideZh] = shift > 0 ? ["above", "高"] : ["below", "低"];
            return located(
              ["One point of the scatter plot is an outlier. What are its coordinates?", "散点图中有一个点是离群点。它的坐标是什么？"],
              out,
              [
                [
                  ["See the pattern", "看出模式"],
                  [
                    `The other points lie close to a ${slope.sign() > 0 ? "rising" : "falling"} line.`,
                    `其他点紧靠一条${slope.sign() > 0 ? "上升" : "下降"}的直线分布。`,
                  ],
                ],
                [
                  ["Find the point off it", "找出偏离的点"],
                  [
                    `At $x = ${x}$ the line passes through $${y}$, but the point $(${out[0]}, ${out[1]})$ is $${Math.abs(shift)}$ units ${side} it: it is the outlier.`,
                    `在 $x = ${x}$ 处直线经过 $${y}$，而点 $(${out[0]}, ${out[1]})$ 比它${sideZh} $${Math.abs(shift)}$ 个单位：它就是离群点。`,
                  ],
                ],
              ],
              [
                `Every other point lies on or next to the line, while $(${out[0]}, ${out[1]})$ is $${Math.abs(shift)}$ units away from it.`,
                `其他每个点都在直线上或紧挨着直线，而 $(${out[0]}, ${out[1]})$ 离直线 $${Math.abs(shift)}$ 个单位。`,
              ],
              [
                [
                  top,
                  "That is the highest point, but it fits the pattern; an outlier is far from the pattern, not just high.",
                  "这是最高的点，但它符合模式；离群点是远离模式的点，而不只是高。",
                ],
                [
                  bottom,
                  "That is the lowest point, but it fits the pattern; an outlier is far from the pattern, not just low.",
                  "这是最低的点，但它符合模式；离群点是远离模式的点，而不只是低。",
                ],
                [[out[1], out[0]], "That swaps the coordinates; write the $x$-coordinate first.", "这是把坐标写反了；应先写 $x$ 坐标。"],
              ],
              scatterFigure(data),
            );
          }
        },
        scatterFigure([
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 2],
          [6, 7],
          [7, 8],
          [8, 9],
        ]),
      ),
      lesson(
        "clusters-in-scatter-plots",
        ["Clusters", "点群"],
        [
          [
            "A **cluster** is a group of points close together, with empty space between it and the other points. Clusters show that the data fall into groups: a plot of the weights and lengths of cats and dogs might show one cluster for each kind of animal. Count the clusters by looking for the gaps: points within a group are close to one another, and the groups are far apart. The plot shown has $2$ clusters, of $4$ and $5$ points.",
            "**点群**是聚在一起的一组点，它和其他点之间隔着空白。点群说明数据分成了几组：猫和狗的体重与体长的散点图，可能每种动物各形成一个点群。数点群时要找空隙：同一组里的点彼此靠近，各组之间相距较远。图中有 $2$ 个点群，分别有 $4$ 个和 $5$ 个点。",
          ],
          [
            "The clusters account for every point: $4 + 5 = 9$, the number of points in the plot.",
            "各点群合起来正好是所有的点：$4 + 5 = 9$，正是图中点的个数。",
          ],
          [
            "Count groups, not points: the $9$ points form only $2$ clusters, because there is no gap within each group.",
            "数的是组，不是点：这 $9$ 个点只形成 $2$ 个点群，因为每组内部没有空隙。",
          ],
        ],
        (rng) => {
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
            return valued(
              askSize
                ? [
                    "The points of the scatter plot form clusters. How many points are in the largest cluster?",
                    "散点图中的点形成了几个点群。最大的点群里有多少个点？",
                  ]
                : ["How many clusters do the points of the scatter plot form?", "散点图中的点形成了几个点群？"],
              askSize ? largest : k,
              [
                [
                  ["Find the gaps", "找空隙"],
                  [`Empty space separates the points into $${k}$ groups.`, `空白把这些点分成了 $${k}$ 组。`],
                ],
                [
                  ["Count", "数一数"],
                  askSize
                    ? [
                        `The groups have $${sizes.join("$, $")}$ points, so the largest cluster has $${largest}$.`,
                        `各组分别有 $${sizes.join("$、$")}$ 个点，所以最大的点群有 $${largest}$ 个点。`,
                      ]
                    : [`Each group is one cluster, so there are $${k}$ clusters.`, `每组是一个点群，所以共有 $${k}$ 个点群。`],
                ],
              ],
              [
                `The groups account for every point: $${sizes.join(" + ")} = ${total}$, the number of points in the plot.`,
                `各组合起来正好是所有的点：$${sizes.join(" + ")} = ${total}$，正是图中点的个数。`,
              ],
              askSize
                ? [
                    [
                      total,
                      "That counts every point; count only the points of the largest cluster.",
                      "这是数了所有的点；只数最大点群里的点。",
                    ],
                    [k, "That is the number of clusters, not the points in the largest one.", "这是点群的个数，不是最大点群里的点数。"],
                    [Math.min(...sizes), "That is the smallest cluster.", "这是最小的点群。"],
                  ]
                : [
                    [total, "That counts the points, not the groups.", "这是数了点，而不是组。"],
                    [
                      k + 1,
                      "That splits a cluster in two; points with no gap between them belong together.",
                      "这是把一个点群拆成了两个；中间没有空隙的点属于同一组。",
                    ],
                    [k - 1, "That joins two clusters; there is empty space between them.", "这是把两个点群并成了一个；它们之间有空白。"],
                  ],
              { figure: scatterFigure(pts.sort((a, b) => a[0] - b[0] || a[1] - b[1])) },
            );
          }
        },
        scatterFigure([
          [2, 2],
          [2, 3],
          [2.5, 2.5],
          [3, 2],
          [7, 7],
          [7, 8],
          [7.5, 7.5],
          [8, 7],
          [8, 8],
        ]),
      ),
    ],
  ),
  [
    "A coach plots the weekly training hours and the race times of her runners. The points fall from left to right. What does that say about the runners?",
    "一位教练把队员每周的训练时长和比赛用时画成散点图，点从左到右下降。这说明了队员的什么情况？",
  ],
  [
    "Runners who train more tend to have shorter race times: a negative association, a tendency rather than a rule.",
    "训练更多的跑者往往比赛用时更短：这是负关联，是一种倾向而不是规律。",
  ],
  [
    "describe associations in scatter plots in the words of the data, tell linear from nonlinear association, and pick out outliers and clusters.",
    "用数据的语言描述散点图中的关联，区分线性关联与非线性关联，并找出离群点和点群。",
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

export const assessingTheFitOfATrendLine = withIntro(
  topic(
    "informally-assessing-the-fit-of-a-trend-line-to-a-scatter-plot",
    t("Informally Assessing the Fit of a Trend Line to a Scatter Plot", "直观评估趋势线对散点图的拟合"),
    t(
      "Judge how well a trend line fits the data by how close the points lie to it: compare two lines, decide whether any line fits, and add up the vertical distances.",
      "根据点离趋势线的远近，判断趋势线拟合数据的好坏：比较两条直线，判断是否有直线能拟合，并把竖直距离加起来。",
    ),
    ["trend-lines", "describing-patterns-of-association-in-scatter-plots"],
    ["8.SP.A.2"],
    [
      lesson(
        "which-line-fits-better",
        ["Which line fits better", "哪条直线拟合得更好"],
        [
          [
            "A trend line fits well when the points lie close to it, with about as many above it as below it. To compare two lines, look at the **vertical distances** from the points to each line: the line whose distances are smaller overall fits better. In the plot shown, the solid line passes through the points, while the dashed line has the same direction but runs above all of them.",
            "当点紧靠趋势线、上下两侧的点大致一样多时，趋势线拟合得好。比较两条直线时，看各点到每条直线的**竖直距离**：总体上距离更小的直线拟合得更好。图中实线从点中间穿过，而虚线方向相同，却从所有点的上方经过。",
          ],
          [
            "Each point is at most about half a unit from the solid line, but $2$ units or so below the dashed line.",
            "每个点离实线最多约半个单位，而在虚线下方约 $2$ 个单位。",
          ],
          [
            "A line can have the right direction and still fit worse than another, by passing too high, too low, or too steeply.",
            "一条直线即使方向正确，也可能因为太高、太低或太陡而不如另一条拟合得好。",
          ],
        ],
        (rng) => {
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
            const [sl, dl] = solidGood
              ? [plainLine(slope, b), plainLine(badSlope, badB)]
              : [plainLine(badSlope, badB), plainLine(slope, b)];
            const why: Pair = shifted
              ? [
                  `That line has the same direction as the other but passes ${badB.sub(b).sign() > 0 ? "above" : "below"} most of the points.`,
                  `这条直线与另一条方向相同，但从大多数点的${badB.sub(b).sign() > 0 ? "上方" : "下方"}经过。`,
                ]
              : ["That line is too steep: it is far from the points at both ends.", "这条直线太陡了：在两端离点很远。"];
            const up = pts.filter(([x, y]) => y > slope.toNumber() * x + b.toNumber()).length;
            const down = pts.filter(([x, y]) => y < slope.toNumber() * x + b.toNumber()).length;
            if (up < 2 || down < 2) continue;
            const [better, worse]: [Pair, Pair] = solidGood
              ? [
                  ["The solid line", "实线"],
                  ["The dashed line", "虚线"],
                ]
              : [
                  ["The dashed line", "虚线"],
                  ["The solid line", "实线"],
                ];
            return chosen(
              rng,
              ["Which line fits the data better?", "哪条直线对数据拟合得更好？"],
              better,
              [
                [worse, `${why[0]} Its distances to the points add up to more.`, `${why[1]}它到各点的距离之和更大。`],
                [
                  ["They fit equally well, since each has points on both sides", "拟合得一样好，因为每条直线两侧都有点"],
                  "Points on both sides are not enough: the distances to one line are much larger than to the other.",
                  "两侧都有点还不够：到其中一条直线的距离比到另一条大得多。",
                ],
                [
                  ["It cannot be told, since neither passes through every point", "无法判断，因为没有一条直线经过所有的点"],
                  "A trend line need not pass through every point; compare how close the points are to each line.",
                  "趋势线不必经过所有的点；要比较点离每条直线有多近。",
                ],
              ],
              [
                [
                  ["Measure the distances", "量距离"],
                  [
                    `Add up the vertical distances from the points to each line: about $${one(solid)}$ for the solid line and about $${one(dashed)}$ for the dashed line.`,
                    `把各点到每条直线的竖直距离加起来：实线约为 $${one(solid)}$，虚线约为 $${one(dashed)}$。`,
                  ],
                ],
                [
                  ["Compare", "比较"],
                  [
                    `${better[0]} has the smaller total, with points on both sides of it, so it fits better.`,
                    `${better[1]}的总和更小，两侧都有点，所以拟合得更好。`,
                  ],
                ],
              ],
              [
                `Check the sides: ${better[0].toLowerCase()} has $${up}$ points above it and $${down}$ below it, mixed along its length.`,
                `检查两侧：${better[1]}上方有 $${up}$ 个点，下方有 $${down}$ 个点，沿线交错分布。`,
              ],
              scatterFigure(pts, lines, [`the solid line ${sl} and the dashed line ${dl}`, `实线 ${sl} 和虚线 ${dl}`]),
            );
          }
        },
        scatterFigure(
          [
            [1, 3],
            [2, 3.5],
            [3, 4],
            [4, 4.5],
            [5, 5],
            [6, 5.5],
            [7, 6],
            [8, 6.5],
          ].map(([x, y]): Pt => [x!, y! + (x! % 2 === 0 ? 0.5 : -0.5)]),
          [lineMark(Q.of(1, 2), Q.of(5, 2)), lineMark(Q.of(1, 2), Q.of(9, 2), true)],
          ["the solid line y = x/2 + 5/2 and the dashed line y = x/2 + 9/2", "实线 y = x/2 + 5/2 和虚线 y = x/2 + 9/2"],
        ),
      ),
      lesson(
        "does-a-line-fit-the-data",
        ["Whether a line fits the data", "直线是否拟合数据"],
        [
          [
            "Every scatter plot has a line that fits it best, but that line is a good model only when the data have a **linear** pattern. If the points lie close to the line, on both sides of it, the line fits well. If they follow a curve, above the line in some places and below it in others, no line fits, whichever line is drawn. If they are scattered far from the line with no pattern, a line does not fit either, and predictions from it would be little better than guesses.",
            "每个散点图都有一条拟合得最好的直线，但只有当数据呈**线性**模式时，这条直线才是好的模型。点紧靠直线、分布在它的两侧时，直线拟合得好。点沿一条曲线分布，有的地方在直线上方，有的地方在下方时，无论画哪条直线都不能很好地拟合。点远离直线、散乱分布、没有模式时，直线也不能拟合，用它预测和瞎猜差不多。",
          ],
          [
            "Look at where the points fall: along a good line, points above and below it are mixed from one end to the other.",
            "看点落在哪里：沿着拟合得好的直线，从一端到另一端，上方和下方的点都交错出现。",
          ],
          [
            "Points on both sides of a line do not prove a good fit: a curve also has points on both sides, but in runs, the ends on one side and the middle on the other.",
            "直线两侧都有点并不能说明拟合得好：曲线也会两侧都有点，只是成段出现，两端在一侧，中间在另一侧。",
          ],
        ],
        (rng) => {
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
          const avg = offBy(pts, mm, bb) / pts.length;
          const ys = pts.map((p) => p[1]);
          const option = (i: number) => pairOf(fitOptions[i]!);
          const reasons: readonly (readonly Wrong[])[] = [
            [
              [
                option(1),
                "The points do not bend away from the line; they stay close to it from end to end.",
                "点没有弯离直线；从一端到另一端都紧靠着它。",
              ],
              [option(2), "The points are close to the line, not far from it.", "点紧靠直线，而不是远离它。"],
            ],
            [
              [
                option(0),
                "The sides are not mixed: the points at the ends lie on one side of the line and those in the middle on the other.",
                "两侧的点并不交错：两端的点在直线的一侧，中间的点在另一侧。",
              ],
              [
                option(2),
                "The points follow a clear curve; they are not scattered without a pattern.",
                "点沿一条清楚的曲线分布，并不是毫无模式地散布。",
              ],
            ],
            [
              [option(0), "Many points are far from the line; it does not fit them closely.", "许多点离直线很远；直线没有紧贴它们。"],
              [option(1), "The points do not follow a curve; they show no pattern at all.", "点并不沿曲线分布，根本没有模式。"],
            ],
          ];
          const walk: readonly (readonly [Pair, Pair])[] = [
            [
              ["The points stay close to the line all along its length.", "沿着整条直线，点都紧靠着它。"],
              [
                "Some are above it and some below it, at the ends and in the middle alike, so the line fits well.",
                "无论在两端还是中间，都有的在上方、有的在下方，所以这条直线拟合得好。",
              ],
            ],
            [
              ["The points bend: they follow a curve.", "点是弯曲的：它们沿一条曲线分布。"],
              [
                "They lie on one side of the line at the ends and on the other side in the middle. No straight line can follow a curve, so the line does not fit well.",
                "两端在直线的一侧，中间在另一侧。直线无法贴合曲线，所以这条直线拟合得不好。",
              ],
            ],
            [
              ["Many points are far from the line.", "许多点离直线很远。"],
              [
                "They show no linear pattern for any line to follow, so the line does not fit well.",
                "它们没有任何直线可以贴合的线性模式，所以这条直线拟合得不好。",
              ],
            ],
          ];
          const check: Pair =
            kind === 0
              ? [
                  `The average vertical distance from a point to the line is only about $${one(avg)}$.`,
                  `各点到直线的平均竖直距离只有约 $${one(avg)}$。`,
                ]
              : kind === 1
                ? [
                    "Follow the points from left to right: they cross the line only where the curve bends across it, not back and forth.",
                    "从左到右看这些点：它们只在曲线弯过直线的地方穿过它，而不是来回交错。",
                  ]
                : [
                    `The average vertical distance from a point to the line is about $${one(avg)}$, large for points whose heights run from $${Math.min(...ys)}$ to $${Math.max(...ys)}$.`,
                    `各点到直线的平均竖直距离约为 $${one(avg)}$，对于高度在 $${Math.min(...ys)}$ 到 $${Math.max(...ys)}$ 之间的点来说很大。`,
                  ];
          return chosen(
            rng,
            ["A trend line is drawn on the scatter plot. Does it fit the data well?", "散点图上画出了一条趋势线。它对数据拟合得好吗？"],
            option(kind),
            reasons[kind]!,
            [
              [["Look at the distances", "看距离"], walk[kind]![0]],
              [["Look at the sides", "看两侧"], walk[kind]![1]],
            ],
            check,
            scatterFigure(pts, [line], [`the line ${plain}`, `直线 ${plain}`]),
          );
        },
        drawn(gradeDrawings5["informally-assessing-the-fit-of-a-trend-line-to-a-scatter-plot#does-a-line-fit-the-data"]),
      ),
      lesson(
        "total-distance-to-a-trend-line",
        ["Adding up the distances to a trend line", "求各点到趋势线的距离之和"],
        [
          [
            "One way to measure how well a line fits is to add up the **vertical distances** from the points to the line. For each point, find the $y$-value of the line at the point’s $x$-value and take the distance between the two $y$-values, which is never negative. The smaller the total, the better the fit. For the line $y = x + 1$ and the point $(3, 6)$: the line passes through $(3, 4)$, so the distance is $6 - 4 = 2$. For the point $(5, 4)$, the line is at $6$ and the distance is $6 - 4 = 2$ as well.",
            "衡量直线拟合好坏的一种方法，是把各点到直线的**竖直距离**加起来。对每个点，求出直线在该点 $x$ 值处的 $y$ 值，再求这两个 $y$ 值之间的距离，距离永远不是负数。总和越小，拟合得越好。对直线 $y = x + 1$ 和点 $(3, 6)$：直线经过 $(3, 4)$，所以距离是 $6 - 4 = 2$。对点 $(5, 4)$，直线在 $6$ 处，距离也是 $6 - 4 = 2$。",
          ],
          [
            "Count by sides: the point above the line is $2$ away and the point below it $2$, so the total is $2 + 2 = 4$.",
            "按两侧数：直线上方的点距离 $2$，下方的点距离 $2$，所以总和是 $2 + 2 = 4$。",
          ],
          [
            "A distance below the line is not negative: $4 - 6 = -2$ would cancel the $2$ above and give a total of $0$, as if the line passed through both points.",
            "直线下方的距离不是负数：若算成 $4 - 6 = -2$，就会抵消上方的 $2$，总和为 $0$，好像直线经过了两个点。",
          ],
        ],
        (rng) => {
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
            const [above, below] = [sum(ds.filter((d) => d > 0)), -sum(ds.filter((d) => d < 0))];
            const line = `y = ${linear(slope, b)}`;
            const list = pts.map(([x, y]) => `$(${x}, ${y})$`);
            return valued(
              [
                `The scatter plot shows the points ${list.join(", ")} and the trend line $${line}$. What is the total of the vertical distances from the points to the line?`,
                `散点图显示了点 ${list.join("、")} 和趋势线 $${line}$。各点到这条直线的竖直距离之和是多少？`,
              ],
              answer,
              [
                [
                  ["Find each distance", "求每个距离"],
                  [
                    "For each point, compare its $y$-value with the line’s $y$-value at the same $x$:",
                    "对每个点，把它的 $y$ 值与直线在同一 $x$ 处的 $y$ 值比较：",
                  ],
                  pts.map(([x, y]) => `|${y} - ${at(x)}| = ${Math.abs(y - at(x))}`),
                ],
                [["Add", "相加"], ["Add the distances:", "把距离相加："], [`${ds.map(Math.abs).join(" + ")} = ${answer}`]],
              ],
              [
                `Count by sides: the points above the line are $${above}$ away in all, those below it $${below}$, and $${above} + ${below} = ${answer}$.`,
                `按两侧数：直线上方的点共距离 $${above}$，下方的点共距离 $${below}$，而 $${above} + ${below} = ${answer}$。`,
              ],
              [
                [
                  sum(ds),
                  "That adds the signed differences; a distance below the line is not negative.",
                  "这是把带符号的差相加了；直线下方的距离不是负数。",
                ],
                [
                  ds.filter((d) => d !== 0).length,
                  "That counts the points off the line; add how far each one is.",
                  "这是数了不在直线上的点；应该把每个点的距离加起来。",
                ],
                [
                  Math.max(...ds.map(Math.abs)),
                  "That is only the largest distance; add them all.",
                  "这只是最大的那个距离；要把所有距离加起来。",
                ],
              ],
              { figure: scatterFigure(pts, [lineMark(slope, b)], [`the line ${plainLine(slope, b)}`, `直线 ${plainLine(slope, b)}`]) },
            );
          }
        },
        scatterFigure(
          [
            [3, 6],
            [5, 4],
          ],
          [lineMark(Q.of(1), Q.of(1))],
          ["the line y = x + 1", "直线 y = x + 1"],
        ),
      ),
    ],
  ),
  [
    "Two classmates draw different trend lines through the same scatter plot. How can they settle whose line fits better?",
    "两名同学在同一个散点图上画了不同的趋势线。怎样判断谁的直线拟合得更好？",
  ],
  [
    "Add up the vertical distances from the points to each line: the smaller total belongs to the better fit.",
    "把各点到每条直线的竖直距离加起来：总和较小的那条拟合得更好。",
  ],
  [
    "judge the fit of a trend line by how close the points lie to it: compare two lines, decide whether any line fits, and add up the vertical distances.",
    "根据点离趋势线的远近判断拟合的好坏：比较两条直线，判断是否有直线能拟合，并把竖直距离加起来。",
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

export const calculatingRelativeFrequencies = withIntro(
  topic(
    "calculating-relative-frequencies-from-two-way-tables",
    t("Calculating Relative Frequencies From Two-Way Tables", "由双向表计算相对频率"),
    t(
      "Turn the counts of a two-way table into relative frequencies of a row or a column, and read counts back from a table of relative frequencies.",
      "把双向表中的频数化为某一行或某一列中的相对频率，并由相对频率表求出频数。",
    ),
    ["joint-frequency-tables"],
    ["8.SP.A.4"],
    [
      lesson(
        "row-relative-frequencies",
        ["Relative frequencies within a row", "行内的相对频率"],
        [
          [
            "A **row relative frequency** describes one group: it divides a cell by the total of its row. “What percent of the 7th graders prefer dogs?” is about the 7th graders only, so divide the number of 7th graders who prefer dogs by the number of 7th graders. In the table shown, $18$ of the $45$ people in row A answered yes: $18 \\div 45 = 0.4 = 40\\%$.",
            "**行相对频率**描述一个组：用单元格中的数除以它所在行的合计。“七年级学生中喜欢狗的占百分之几？”只涉及七年级学生，所以用喜欢狗的七年级学生人数除以七年级学生人数。在图中的表里，A 行的 $45$ 人中有 $18$ 人回答“是”：$18 \\div 45 = 0.4 = 40\\%$。",
          ],
          [
            "The relative frequencies of a row add up to $100\\%$: the other $27$ of row A make $27 \\div 45 = 60\\%$, and $40\\% + 60\\% = 100\\%$.",
            "一行的相对频率加起来等于 $100\\%$：A 行其余 $27$ 人占 $27 \\div 45 = 60\\%$，而 $40\\% + 60\\% = 100\\%$。",
          ],
          [
            "Do not divide by the grand total or the column total: the question names one group, and that group's row total is the whole.",
            "不要除以总计或列合计：问题指明了一个组，这个组所在行的合计才是整体。",
          ],
        ],
        (rng) => {
          const w = rng.pick(twoWays);
          for (;;) {
            const c = counts(rng);
            const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
            const v = c[i]![j]!;
            const rowTotal = sum(c[i]!);
            const pct = percentOf(v, rowTotal);
            if (!pct.isInteger()) continue;
            const colTotal = c[0]![j]! + c[1]![j]!;
            const grand = sum(c.flat());
            const r = w.rows[i]!;
            return valued(
              [
                `${w.intro.en}${jointTable(w, c, [], "", 0)}${w.ofRow(r, w.cols[j]!).en}`,
                `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.ofRow(r, w.cols[j]!)["zh-CN"]}`,
              ],
              pct,
              [
                [
                  ["Find the whole", "找整体"],
                  [
                    `The question is about the ${r[0]} only, so the whole is their row total:`,
                    `问题只涉及${r[1]}，所以整体是他们那一行的合计：`,
                  ],
                  [`${c[i]!.join(" + ")} = ${rowTotal}`],
                ],
                [["Divide", "相除"], ["Divide the cell by the row total:", "用单元格中的数除以行合计："], [percentLine(v, rowTotal)]],
              ],
              [
                `Multiply back: $${pct.toLatex()}\\%$ of $${rowTotal}$ is $${dec(pct.div(Q.of(100)))} \\times ${rowTotal} = ${v}$, the count in the cell.`,
                `乘回去：$${rowTotal}$ 的 $${pct.toLatex()}\\%$ 是 $${dec(pct.div(Q.of(100)))} \\times ${rowTotal} = ${v}$，正是单元格中的数。`,
              ],
              [
                [
                  rounded(v, colTotal),
                  "That divides by the column total; the question is about one row.",
                  "这是除以了列合计；问题涉及的是一行。",
                ],
                [
                  rounded(v, grand),
                  "That divides by the grand total; the question is about one group.",
                  "这是除以了总计；问题涉及的是一个组。",
                ],
                [v, "That is the count, not the percent; divide it by the row total.", "这是频数，不是百分比；还要除以行合计。"],
              ],
              { percent: true },
            );
          }
        },
        countTable(
          [
            [18, 27],
            [12, 18],
          ],
          [
            "A two-way table: in row A, 18 answer yes and 27 no, 45 in all; in row B, 12 yes and 18 no, 30 in all.",
            "一张双向表：A 行 18 人回答“是”、27 人回答“否”，共 45 人；B 行 12 人回答“是”、18 人回答“否”，共 30 人。",
          ],
        ),
      ),
      lesson(
        "column-relative-frequencies",
        ["Relative frequencies within a column", "列内的相对频率"],
        [
          [
            "A **column relative frequency** divides a cell by the total of its column. “Of the students who prefer dogs, what percent are 7th graders?” is about the students who prefer dogs, so divide by the number of students who prefer dogs. The group named after “of the” gives the denominator. In the table shown, the yes column has $18 + 12 = 30$ people, and $18$ of them are in row A: $18 \\div 30 = 0.6 = 60\\%$.",
            "**列相对频率**用单元格中的数除以它所在列的合计。“喜欢狗的学生中，七年级学生占百分之几？”涉及的是喜欢狗的学生，所以除以喜欢狗的学生人数。“……中”前面说的那一组决定分母。在图中的表里，“是”这一列有 $18 + 12 = 30$ 人，其中 $18$ 人在 A 行：$18 \\div 30 = 0.6 = 60\\%$。",
          ],
          [
            "The column's two shares add up to $100\\%$: row B has $12 \\div 30 = 40\\%$ of it, and $60\\% + 40\\% = 100\\%$.",
            "这一列的两部分加起来等于 $100\\%$：B 行占 $12 \\div 30 = 40\\%$，而 $60\\% + 40\\% = 100\\%$。",
          ],
          [
            "The two questions sound alike but have different answers: $40\\%$ of row A answered yes, while $60\\%$ of the yes answers came from row A.",
            "两个问题听起来相似，答案却不同：A 行中 $40\\%$ 回答“是”，而回答“是”的人中 $60\\%$ 来自 A 行。",
          ],
        ],
        (rng) => {
          const w = rng.pick(twoWays);
          for (;;) {
            const c = counts(rng);
            const [i, j] = [rng.int(0, 1), rng.int(0, 2)];
            const v = c[i]![j]!;
            const colTotal = c[0]![j]! + c[1]![j]!;
            const pct = percentOf(v, colTotal);
            if (!pct.isInteger()) continue;
            const rowTotal = sum(c[i]!);
            const grand = sum(c.flat());
            const [r, col] = [w.rows[i]!, w.cols[j]!];
            return valued(
              [
                `${w.intro.en}${jointTable(w, c, [], "", 0)}${w.ofCol(r, col).en}`,
                `${w.intro["zh-CN"]}${jointTable(w, c, [], "", 1)}${w.ofCol(r, col)["zh-CN"]}`,
              ],
              pct,
              [
                [
                  ["Find the whole", "找整体"],
                  [
                    `The question is about the people in the column “${col[0]}”, so the whole is that column's total:`,
                    `问题涉及的是“${col[1]}”这一列的人，所以整体是这一列的合计：`,
                  ],
                  [`${c[0]![j]!} + ${c[1]![j]!} = ${colTotal}`],
                ],
                [["Divide", "相除"], ["Divide the cell by the column total:", "用单元格中的数除以列合计："], [percentLine(v, colTotal)]],
              ],
              [
                `Multiply back: $${pct.toLatex()}\\%$ of $${colTotal}$ is $${dec(pct.div(Q.of(100)))} \\times ${colTotal} = ${v}$, the count in the cell.`,
                `乘回去：$${colTotal}$ 的 $${pct.toLatex()}\\%$ 是 $${dec(pct.div(Q.of(100)))} \\times ${colTotal} = ${v}$，正是单元格中的数。`,
              ],
              [
                [
                  rounded(v, rowTotal),
                  "That divides by the row total; the question is about the people in one column.",
                  "这是除以了行合计；问题涉及的是一列中的人。",
                ],
                [
                  rounded(v, grand),
                  "That divides by the grand total; the question is about one column.",
                  "这是除以了总计；问题涉及的是一列。",
                ],
                [rounded(colTotal - v, colTotal), "That is the other row's share of the column.", "这是另一行在这一列中所占的比例。"],
              ],
              { percent: true },
            );
          }
        },
        countTable(
          [
            [18, 27],
            [12, 18],
          ],
          [
            "A two-way table: the yes column has 18 people in row A and 12 in row B, 30 in all; the no column has 27 and 18.",
            "一张双向表：“是”这一列 A 行 18 人、B 行 12 人，共 30 人；“否”这一列分别是 27 人和 18 人。",
          ],
        ),
      ),
      lesson(
        "reading-a-relative-frequency-table",
        ["Reading a table of row relative frequencies", "读行相对频率表"],
        [
          [
            "A table of row relative frequencies shows each row as percents of its own total, so every row adds up to $100\\%$. To turn a percent back into a count, multiply it by the row's total. In the table shown, if row A stands for $60$ adults, then $35\\%$ of them is $0.35 \\times 60 = 21$ adults.",
            "行相对频率表把每一行表示为该行合计的百分比，所以每一行加起来都是 $100\\%$。要把百分比还原为频数，就用它乘这一行的合计。在图中的表里，如果 A 行代表 $60$ 名成人，那么其中的 $35\\%$ 是 $0.35 \\times 60 = 21$ 名。",
          ],
          ["Divide back: $21 \\div 60 = 0.35$, which is $35\\%$.", "除回去：$21 \\div 60 = 0.35$，正是 $35\\%$。"],
          [
            "Use the total of that row, not the grand total: the percents of different rows are parts of different wholes.",
            "要用这一行的合计，而不是总计：不同行的百分比是不同整体的一部分。",
          ],
        ],
        (rng) => {
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
            const offs: Off[] = [
              [p, "That is the percent itself; multiply it by the row total to get a count.", "这是百分比本身；要乘行合计才得到频数。"],
              [
                (p * grand) / 100,
                `That takes the percent of everyone; it is a percent of the ${r[0]} only.`,
                `这是取了所有人的百分比；它只是${r[1]}的百分比。`,
              ],
              [(p * totals[1 - i]!) / 100, "That uses the other group's total.", "这是用了另一组的合计。"],
            ];
            return valued(
              [
                `${w.intro.en} The table shows the answers of each group as percents of that group.${table(0)}${sizes.en} ${w.cell(r, col).en}`,
                `${w.intro["zh-CN"]}下表用各组人数的百分比表示了每一组的回答。${table(1)}${sizes["zh-CN"]}${w.cell(r, col)["zh-CN"]}`,
              ],
              answer,
              [
                [
                  ["Find the whole", "找整体"],
                  [
                    `The percents in the row of the ${r[0]} are parts of the $${n}$ ${r[0]}.`,
                    `${r[1]}那一行的百分比是这 $${n}$ 名${r[1]}的一部分。`,
                  ],
                ],
                [
                  ["Multiply", "相乘"],
                  [`Take $${p}\\%$ of $${n}$:`, `求 $${n}$ 的 $${p}\\%$：`],
                  [`${dec(Q.of(p, 100))} \\times ${n} = ${answer}`],
                ],
              ],
              [
                `Divide back: $${answer} \\div ${n} = ${dec(Q.of(answer, n))}$, which is $${p}\\%$.`,
                `除回去：$${answer} \\div ${n} = ${dec(Q.of(answer, n))}$，正是 $${p}\\%$。`,
              ],
              offs.filter(([v]) => Number.isInteger(v)),
            );
          }
        },
        tableFigure(
          ["A", "B"],
          ["✓", "✗", "Σ"],
          [
            ["35%", "65%", "100%"],
            ["50%", "50%", "100%"],
          ],
          [
            "A table of row relative frequencies: row A is 35% yes and 65% no, row B is 50% yes and 50% no, and each row adds up to 100%.",
            "一张行相对频率表：A 行“是”占 35%、“否”占 65%，B 行“是”和“否”各占 50%，每一行加起来都是 100%。",
          ],
        ),
      ),
    ],
  ),
  [
    "In a survey, $18$ of $45$ seventh graders and $12$ of $30$ eighth graders prefer dogs. Which grade likes dogs more?",
    "一项调查中，$45$ 名七年级学生里有 $18$ 名、$30$ 名八年级学生里有 $12$ 名喜欢狗。哪个年级更喜欢狗？",
  ],
  [
    "Neither: $18 \\div 45 = 40\\%$ and $12 \\div 30 = 40\\%$, the same share, although the counts differ.",
    "一样：$18 \\div 45 = 40\\%$，$12 \\div 30 = 40\\%$，比例相同，尽管人数不同。",
  ],
  [
    "turn the counts of a two-way table into relative frequencies of a row or a column, and read counts back from a table of relative frequencies.",
    "把双向表中的频数化为某一行或某一列中的相对频率，并由相对频率表求出频数。",
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

/** likelier states that the people of row k are more likely than the others to do the act. */
const likelier = (st: Study, k: number) =>
  t(
    `${cap(st.groups[k]![0])} are more likely than ${st.groups[1 - k]![0]} to ${st.act[0]}.`,
    `${st.groups[k]![1]}比${st.groups[1 - k]![1]}更可能${st.act[1]}。`,
  );

export const identifyingAssociationInTwoWayTables = withIntro(
  topic(
    "identifying-patterns-of-association-from-two-way-tables",
    t("Identifying Patterns of Association From Two-Way Tables", "由双向表识别关联模式"),
    t(
      "Compare the row relative frequencies of a two-way table to decide whether two categorical variables are associated, and describe the association.",
      "比较双向表的行相对频率，判断两个分类变量是否有关联，并描述这种关联。",
    ),
    ["calculating-relative-frequencies-from-two-way-tables"],
    ["8.SP.A.4"],
    [
      lesson(
        "is-there-an-association",
        ["Whether two categorical variables are associated", "两个分类变量是否有关联"],
        [
          [
            "Two categorical variables are **associated** when the groups of one variable answer the other differently. To check, compare row relative frequencies: find the percent of each row that gives the same answer. If the percents are about the same, the answer does not depend on the group: there is no association. If they are clearly different, there is an association. In the table shown, $24$ of $40$ in row A answered yes, $60\\%$, but only $10$ of $40$ in row B, $25\\%$: the variables are associated.",
            "如果一个变量的各组对另一个变量的回答不同，就说两个分类变量**有关联**。检验时比较行相对频率：求出每一行中给出同一回答的百分比。如果这些百分比大致相同，回答与所在的组无关：没有关联。如果它们明显不同，就有关联。在图中的表里，A 行 $40$ 人中有 $24$ 人回答“是”，占 $60\\%$，而 B 行 $40$ 人中只有 $10$ 人，占 $25\\%$：两个变量有关联。",
          ],
          [
            "Multiply back: $60\\%$ of $40$ is $24$, and $25\\%$ of $40$ is $10$, the counts in the table.",
            "乘回去：$40$ 的 $60\\%$ 是 $24$，$40$ 的 $25\\%$ 是 $10$，正是表中的频数。",
          ],
          [
            "Compare percents, not counts: when the groups have different sizes, the counts differ even if the percents are the same.",
            "要比较百分比，而不是频数：两组人数不同时，即使百分比相同，频数也会不同。",
          ],
        ],
        (rng) => {
          const st = rng.pick(studies);
          const yes = rng.int(0, 1) === 0;
          const s = survey(rng, yes ? 20 : 0);
          const [p0, p1] = s.pcts;
          const d = Math.abs(p0 - p1);
          // Each right-test option quotes percents, and only the one that goes with the answer quotes the true ones.
          const shown = yes ? [p0, p1] : [p0, p0 > 50 ? p0 - 30 : p0 + 30];
          const about = yes ? Math.round((p0 + p1) / 2) : p0;
          const differ = because(
            true,
            t(
              `$${shown[0]}\\%$ of ${st.groups[0][0]} and $${shown[1]}\\%$ of ${st.groups[1][0]} ${st.act[0]}`,
              `${st.groups[0][1]}中有 $${shown[0]}\\%$、${st.groups[1][1]}中有 $${shown[1]}\\%$ ${st.act[1]}`,
            ),
          );
          const same = because(false, t(`about $${about}\\%$ of each group ${st.act[0]}`, `两组中都约有 $${about}\\%$ ${st.act[1]}`));
          const counted = because(true, t("the counts in the first column differ", "第一列中的频数不同"));
          const sized = because(false, t("the two groups have different sizes", "两组的人数不同"));
          const percents = `$${p0}\\%$ and $${p1}\\%$`;
          const percentsZh = `$${p0}\\%$ 和 $${p1}\\%$`;
          return chosen(
            rng,
            [
              `${st.intro.en}${surveyTable(st, s, 0)}Is there an association between ${st.vars[0]}?`,
              `${st.intro["zh-CN"]}${surveyTable(st, s, 1)}${st.vars[1]}之间有关联吗？`,
            ],
            yes ? differ : same,
            yes
              ? [
                  [
                    same,
                    `The percents are not about the same: ${percents} differ by $${d}$ points.`,
                    `两个百分比并不相近：${percentsZh}相差 $${d}$ 个百分点。`,
                  ],
                  [
                    counted,
                    "Right verdict, but counts can mislead when groups differ in size; the reason is that the percents differ.",
                    "结论对，但组的人数不同时频数会误导；真正的理由是百分比不同。",
                  ],
                  [
                    sized,
                    `Different group sizes settle nothing; the percents differ by $${d}$ points, so there is an association.`,
                    `两组人数不同说明不了什么；百分比相差 $${d}$ 个百分点，所以有关联。`,
                  ],
                ]
              : [
                  [
                    differ,
                    `Those are not the percents in the table: they are ${percents}, about the same.`,
                    `这不是表中的百分比：实际是 ${percentsZh}，大致相同。`,
                  ],
                  [
                    counted,
                    "The counts differ only because the groups have different sizes; the percents are about the same.",
                    "频数不同只是因为两组人数不同；百分比大致相同。",
                  ],
                  [
                    sized,
                    "Right verdict, but different group sizes do not settle it; the percents being about the same does.",
                    "结论对，但两组人数不同并不能说明问题；百分比大致相同才是理由。",
                  ],
                ],
            [
              percentWalk(st, s),
              [
                ["Compare", "比较"],
                yes
                  ? [
                      `The percents differ by $${d}$ points, so whether people ${st.act[0]} depends on their group: there is an association.`,
                      `两个百分比相差 $${d}$ 个百分点，是否${st.act[1]}与所在的组有关：有关联。`,
                    ]
                  : [
                      `${closeEn(d)}, so whether people ${st.act[0]} does not depend on their group: there is no association.`,
                      `${closeZh(d)}，是否${st.act[1]}与所在的组无关：没有关联。`,
                    ],
              ],
            ],
            multiplyBack(s),
          );
        },
        countTable(
          [
            [24, 16],
            [10, 30],
          ],
          [
            "A two-way table: in row A, 24 answer yes and 16 no, 40 in all; in row B, 10 yes and 30 no, 40 in all.",
            "一张双向表：A 行 24 人回答“是”、16 人回答“否”，共 40 人；B 行 10 人回答“是”、30 人回答“否”，共 40 人。",
          ],
        ),
      ),
      lesson(
        "describing-an-association-in-a-two-way-table",
        ["Describing an association in a two-way table", "描述双向表中的关联"],
        [
          [
            "To describe an association, say which group is more likely to give an answer, judging by row relative frequencies: “Students with a curfew are more likely than students without a curfew to do chores.” In the table shown, $60\\%$ of row A answered yes against $25\\%$ of row B, so the people in row A are more likely to answer yes. If the row percents are about the same, say that there is no association.",
            "描述关联时，根据行相对频率说出哪一组更可能给出某个回答：“有门禁时间的学生比没有门禁时间的学生更可能做家务。”在图中的表里，A 行 $60\\%$ 回答“是”，B 行只有 $25\\%$，所以 A 行的人更可能回答“是”。如果各行的百分比大致相同，就说没有关联。",
          ],
          [
            "Read the other column too: $40\\%$ of row A and $75\\%$ of row B answered no, so row B is more likely to answer no, the same association seen from the other side.",
            "再看另一列：A 行 $40\\%$、B 行 $75\\%$ 回答“否”，所以 B 行更可能回答“否”，这是从另一面看同一个关联。",
          ],
          [
            "“More likely” compares shares, not numbers of people: a larger group can have more yes answers and still be less likely to say yes.",
            "“更可能”比较的是比例，不是人数：一个较大的组回答“是”的人可能更多，却仍然更不可能回答“是”。",
          ],
        ],
        (rng) => {
          const st = rng.pick(studies);
          const kind = rng.int(0, 2);
          const s = survey(rng, kind === 2 ? 0 : 20);
          const none = t(`There is no association between ${st.vars[0]}.`, `${st.vars[1]}之间没有关联。`);
          const higher = s.pcts[0] > s.pcts[1] ? 0 : 1;
          const [hp, lp] = [s.pcts[higher], s.pcts[1 - higher]];
          const d = Math.abs(s.pcts[0] - s.pcts[1]);
          const wrong: Wrong[] =
            kind === 2
              ? [0, 1].map(
                  (k): Wrong => [
                    pairOf(likelier(st, k)),
                    `The percents, $${s.pcts[0]}\\%$ and $${s.pcts[1]}\\%$, are about the same; neither group is more likely.`,
                    `两个百分比 $${s.pcts[0]}\\%$ 和 $${s.pcts[1]}\\%$ 大致相同；哪一组都不是更可能。`,
                  ],
                )
              : [
                  [
                    pairOf(likelier(st, 1 - higher)),
                    `It is the other way round: $${hp}\\%$ of ${st.groups[higher]![0]} ${st.act[0]}, against $${lp}\\%$ of ${st.groups[1 - higher]![0]}.`,
                    `正好相反：${st.groups[higher]![1]}中有 $${hp}\\%$ ${st.act[1]}，而${st.groups[1 - higher]![1]}中只有 $${lp}\\%$。`,
                  ],
                  [
                    pairOf(none),
                    `The percents differ by $${d}$ points; that is an association.`,
                    `两个百分比相差 $${d}$ 个百分点，这就是关联。`,
                  ],
                ];
          return chosen(
            rng,
            [
              `${st.intro.en}${surveyTable(st, s, 0)}Which statement do the data support?`,
              `${st.intro["zh-CN"]}${surveyTable(st, s, 1)}数据支持哪一种说法？`,
            ],
            pairOf(kind === 2 ? none : likelier(st, higher)),
            wrong,
            [
              percentWalk(st, s),
              [
                ["Compare", "比较"],
                kind === 2
                  ? [`${closeEn(d)}: there is no association.`, `${closeZh(d)}：没有关联。`]
                  : [
                      `$${hp}\\%$ is clearly more than $${lp}\\%$. ${likelier(st, higher).en}`,
                      `$${hp}\\%$ 明显大于 $${lp}\\%$。${likelier(st, higher)["zh-CN"]}`,
                    ],
              ],
            ],
            multiplyBack(s),
          );
        },
        tableFigure(
          ["A", "B"],
          ["✓", "✗", "Σ"],
          [
            ["60%", "40%", "100%"],
            ["25%", "75%", "100%"],
          ],
          [
            "A table of row relative frequencies: row A is 60% yes and 40% no, row B is 25% yes and 75% no.",
            "一张行相对频率表：A 行“是”占 60%、“否”占 40%，B 行“是”占 25%、“否”占 75%。",
          ],
        ),
      ),
      lesson(
        "comparing-groups-of-different-sizes",
        ["Comparing groups of different sizes", "比较人数不同的组"],
        [
          [
            "When the groups have different sizes, comparing counts can mislead: a large group can have more people who give an answer even though a smaller share of it does. Compare relative frequencies instead. In the table shown, $30$ of the $100$ people in row A answered yes and $15$ of the $25$ in row B: more yes answers came from row A, but only $30\\%$ of row A said yes, against $60\\%$ of row B.",
            "当各组人数不同时，比较频数可能产生误导：一个大组里给出某个回答的人可能更多，但所占的比例却更小。应该比较相对频率。在图中的表里，A 行 $100$ 人中有 $30$ 人回答“是”，B 行 $25$ 人中有 $15$ 人：回答“是”的人更多来自 A 行，但 A 行只有 $30\\%$ 回答“是”，而 B 行有 $60\\%$。",
          ],
          [
            "Multiply back: $30\\%$ of $100$ is $30$, and $60\\%$ of $25$ is $15$.",
            "乘回去：$100$ 的 $30\\%$ 是 $30$，$25$ 的 $60\\%$ 是 $15$。",
          ],
          [
            "Different sizes are no reason to give up: percents put both groups on the same scale of $100$.",
            "人数不同并不是无法比较的理由：百分比把两组都放到了以 $100$ 为准的同一尺度上。",
          ],
        ],
        (rng) => {
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
            const other = 1 - higher;
            const [hp, lp] = [s.pcts[higher], s.pcts[other]];
            const group = (k: number): Pair => [cap(st.groups[k]![0]), st.groups[k]![1]];
            return chosen(
              rng,
              [
                `${st.intro.en}${surveyTable(st, s, 0)}Which group is more likely to ${st.act[0]}?`,
                `${st.intro["zh-CN"]}${surveyTable(st, s, 1)}哪一组更可能${st.act[1]}？`,
              ],
              group(higher),
              [
                [
                  group(other),
                  misleading
                    ? `More of them do, but their group is larger: only $${lp}\\%$ of them do, against $${hp}\\%$ of the others.`
                    : `Only $${lp}\\%$ of them do, against $${hp}\\%$ of the others.`,
                  misleading
                    ? `这样做的人数更多，但这一组人也更多：只有 $${lp}\\%$，而另一组有 $${hp}\\%$。`
                    : `只有 $${lp}\\%$，而另一组有 $${hp}\\%$。`,
                ],
                [
                  [`The two groups are equally likely to ${st.act[0]}`, `两组${st.act[1]}的可能性相同`],
                  `The percents differ: $${hp}\\%$ against $${lp}\\%$.`,
                  `两个百分比不同：$${hp}\\%$ 对 $${lp}\\%$。`,
                ],
                [
                  ["It cannot be determined, because the groups have different sizes", "无法判断，因为两组的人数不同"],
                  "Different sizes are why we compare percents, and percents can always be compared.",
                  "正因为人数不同才要比较百分比，而百分比总是可以比较的。",
                ],
              ],
              [
                percentWalk(st, s),
                [
                  ["Compare", "比较"],
                  misleading
                    ? [
                        `$${hp}\\%$ is more than $${lp}\\%$, so ${st.groups[higher]![0]} are more likely to ${st.act[0]}, even though fewer of them do.`,
                        `$${hp}\\%$ 大于 $${lp}\\%$，所以${st.groups[higher]![1]}更可能${st.act[1]}，尽管这样做的人数更少。`,
                      ]
                    : [
                        `$${hp}\\%$ is more than $${lp}\\%$, so ${st.groups[higher]![0]} are more likely to ${st.act[0]}.`,
                        `$${hp}\\%$ 大于 $${lp}\\%$，所以${st.groups[higher]![1]}更可能${st.act[1]}。`,
                      ],
                ],
              ],
              multiplyBack(s),
            );
          }
        },
        countTable(
          [
            [30, 70],
            [15, 10],
          ],
          [
            "A two-way table: in row A, 30 answer yes and 70 no, 100 in all; in row B, 15 yes and 10 no, 25 in all.",
            "一张双向表：A 行 30 人回答“是”、70 人回答“否”，共 100 人；B 行 15 人回答“是”、10 人回答“否”，共 25 人。",
          ],
        ),
      ),
    ],
  ),
  [
    "A store finds that $30$ customers with a coupon and $15$ without one bought something. Did the coupons work?",
    "一家商店发现，收到优惠券的顾客中有 $30$ 人购买，没收到的有 $15$ 人购买。优惠券起作用了吗？",
  ],
  [
    "It depends on the group sizes: $30$ of $100$ is $30\\%$, but $15$ of $25$ is $60\\%$, so the customers without coupons were more likely to buy.",
    "要看两组的人数：$100$ 人中的 $30$ 人是 $30\\%$，而 $25$ 人中的 $15$ 人是 $60\\%$，所以没收到优惠券的顾客反而更可能购买。",
  ],
  [
    "compare the row relative frequencies of a two-way table to decide whether two categorical variables are associated, and describe the association.",
    "比较双向表的行相对频率，判断两个分类变量是否有关联，并描述这种关联。",
  ],
);

/** grade8BivariateTopics are the topics of 8th Grade Math, Unit 9, that other courses do not already have. */
export const grade8BivariateTopics: readonly TopicDef[] = [
  describingPatternsOfAssociation,
  assessingTheFitOfATrendLine,
  calculatingRelativeFrequencies,
  identifyingAssociationInTwoWayTables,
];
