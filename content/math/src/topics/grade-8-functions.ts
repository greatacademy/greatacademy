import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { linear, num, type PlaneMark, plane, Q } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { article, pointLatex, steps } from "../problems.ts";
import type { Pair, Wrong } from "./early-grades-more-kit.ts";
import { chosen, decided, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { tableFigure } from "./grade-8-kit.ts";
import { lineFigure } from "./upper-grades-kit.ts";

// 8th Grade Math, functions: describing a relationship from its graph, telling linear functions from nonlinear ones,
// interpreting the rate of change and initial value, and comparing functions given in different ways.

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

// ---------------------------------------------------------------------------
// Describing a relationship from a graph

/** Story is a context for a graph made of line segments: what is measured, against hours. */
interface Story {
  readonly quantity: Text;
  readonly unit: Text;
}

/** stories are the contexts for piecewise graphs. */
const stories: readonly Story[] = [
  { quantity: t("a cyclist's distance from home", "一位骑车人离家的距离"), unit: t("kilometers", "千米") },
  { quantity: t("the depth of the water in a pool", "游泳池中水的深度"), unit: t("feet", "英尺") },
];

/** Behavior is how a quantity changes on one piece of a graph. */
type Behavior = "up-fast" | "up-slow" | "level" | "down-fast" | "down-slow";

/** slopeOf is the slope of a piece with the given behavior. */
const slopeOf: Record<Behavior, number> = { "up-fast": 3, "up-slow": 1, level: 0, "down-fast": -3, "down-slow": -1 };

/** behaviorWords describes a behavior. */
const behaviorWords: Record<Behavior, Text> = {
  "up-fast": t("increases quickly", "迅速增加"),
  "up-slow": t("increases slowly", "缓慢增加"),
  level: t("stays the same", "保持不变"),
  "down-fast": t("decreases quickly", "迅速减少"),
  "down-slow": t("decreases slowly", "缓慢减少"),
};

/** Piece is one segment of a graph from (x0, y0) to (x1, y1). */
interface Piece {
  readonly behavior: Behavior;
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

/** pieces joins segments with the given behaviors, each one or two hours long, staying between 0 and 9;
 * it returns undefined when the graph would leave that range. */
function pieces(rng: Rng, behaviors: readonly Behavior[]): Piece[] | undefined {
  const out: Piece[] = [];
  let [x, y] = [0, rng.int(0, 6)];
  for (const behavior of behaviors) {
    const length = slopeOf[behavior] === 3 || slopeOf[behavior] === -3 ? 1 : rng.int(1, 2);
    const next = y + slopeOf[behavior] * length;
    if (next < 0 || next > 9) return undefined;
    out.push({ behavior, x0: x, y0: y, x1: x + length, y1: next });
    [x, y] = [x + length, next];
  }
  return out;
}

/** pieceGraph draws the segments as a figure. */
function pieceGraph(ps: readonly Piece[], story: Story): Figure {
  const end = ps[ps.length - 1]!.x1;
  const marks: PlaneMark[] = ps.flatMap((p): PlaneMark[] => [
    { kind: "segment", a: [p.x0, p.y0], b: [p.x1, p.y1], accent: true },
    { kind: "point", at: [p.x0, p.y0], accent: true },
  ]);
  marks.push({ kind: "point", at: [end, ps[ps.length - 1]!.y1], accent: true });
  const corners = [...ps.map((p) => pointLatex([p.x0, p.y0])), pointLatex([end, ps[ps.length - 1]!.y1])];
  return {
    svg: plane({ xMin: 0, xMax: Math.max(end, 6), yMin: 0, yMax: 9 }, marks),
    alt: t(
      `A graph of ${story.quantity.en}, in ${story.unit.en}, against time in hours: line segments joining ${corners.join(", ")}.`,
      `${story.quantity["zh-CN"]}（${story.unit["zh-CN"]}）随时间（小时）变化的图像：依次连接 ${corners.join("、")} 的线段。`,
    ),
  };
}

/** interval names the time between two whole hours. */
const interval = (a: number, b: number) => t(`From $t = ${a}$ to $t = ${b}$`, `从 $t = ${a}$ 到 $t = ${b}$`);

/** describing writes the behaviors in order as one sentence. */
function describing(bs: readonly Behavior[]): Text {
  const en = bs.map((b) => behaviorWords[b].en);
  const zh = bs.map((b) => behaviorWords[b]["zh-CN"]);
  return t(
    `It ${en.slice(0, -1).join(", then ")}, and then ${en[en.length - 1]}.`,
    `先${zh[0]}，${zh
      .slice(1)
      .map((z, i) => (i === zh.length - 2 ? `最后${z}` : `然后${z}`))
      .join("，")}。`,
  );
}

/** Question is a property of exactly one piece of a graph that a problem asks about. */
interface Question {
  readonly ask: Text;
  readonly has: (b: Behavior) => boolean;
  readonly why: Text;
}

/** questions are the properties asked about; the last asks for the fastest increase. */
const questions: readonly Question[] = [
  {
    ask: t("stay the same", "保持不变"),
    has: (b) => b === "level",
    why: t("the graph is horizontal", "图像是水平的"),
  },
  {
    ask: t("decrease", "减少"),
    has: (b) => b === "down-fast" || b === "down-slow",
    why: t("the graph falls from left to right", "图像从左到右下降"),
  },
  {
    ask: t("increase most quickly", "增加得最快"),
    has: (b) => b === "up-fast",
    why: t("the graph rises most steeply", "图像上升得最陡"),
  },
];

/** perHour writes the change per hour on each piece of a graph, as lines such as "t = 0 \to 2: (6 - 0) \div 2 = 3". */
const perHour = (ps: readonly Piece[]) =>
  ps.map((p) => `t = ${p.x0} \\to ${p.x1}: \\; (${p.y1} - ${p.y0}) \\div ${p.x1 - p.x0} = ${(p.y1 - p.y0) / (p.x1 - p.x0)}`);

/** pieceWhy says what one piece of a graph does, as the reason an interval is the wrong choice. */
const pieceWhy = (p: Piece): Wrong => {
  const name = interval(p.x0, p.x1);
  return [
    [name.en, name["zh-CN"]],
    `There it ${behaviorWords[p.behavior].en}: the value goes from $${p.y0}$ to $${p.y1}$.`,
    `这段时间里它${behaviorWords[p.behavior]["zh-CN"]}：值从 $${p.y0}$ 变为 $${p.y1}$。`,
  ];
};

/** steady checks that a linear function changes by the same amount at x = 0, 1 and 2. */
function steady(f: (x: number) => Q): Pair {
  const ys = [0, 1, 2].map(f);
  const d = ys[1]!.sub(ys[0]!);
  const shown = ys.map((y) => num(y)).join(", ");
  return [
    `Test equal steps: at $x = 0, 1, 2$ it gives $y = ${shown}$. Each step changes $y$ by $${num(d)}$, as a line must.`,
    `用相等的步长检验：$x = 0, 1, 2$ 时 $y = ${shown}$。每一步 $y$ 都变化 $${num(d)}$，正是直线的样子。`,
  ];
}

/** uneven checks that a nonlinear function changes by different amounts at x = 1, 2 and 3. */
function uneven(f: (x: number) => Q): Pair {
  const ys = [1, 2, 3].map(f);
  const [d1, d2] = [ys[1]!.sub(ys[0]!), ys[2]!.sub(ys[1]!)];
  const shown = ys.map((y) => num(y)).join(", ");
  return [
    `Test equal steps: at $x = 1, 2, 3$ it gives $y = ${shown}$. The changes are $${num(d1)}$ and then $${num(d2)}$, which differ, so it is not a line.`,
    `用相等的步长检验：$x = 1, 2, 3$ 时 $y = ${shown}$。变化量先是 $${num(d1)}$，再是 $${num(d2)}$，并不相同，所以不是直线。`,
  ];
}

/** TestedForm is an equation in x and y with the reason it is or is not linear, and a check by values. */
type TestedForm = readonly [string, Text, Pair];

/** testedLinear are linear functions written in ways that hide the form y = mx + b, each with that form and a check by values. */
const testedLinear = (rng: Rng): TestedForm[] => {
  const [m, b, c] = [rng.int(2, 6), rng.nonZero(-7, 7), rng.int(2, 5)];
  const k = Math.abs(b) + 3;
  const as = (e: string): Text => same(`$${e}$`);
  return [
    [`y = ${m}(${linear(1, b)})`, as(`y = ${linear(m, m * b)}`), steady((x) => Q.of(m * (x + b)))],
    [`y = \\frac{${linear(1, b)}}{${c}}`, as(`y = ${linear(Q.of(1, c), Q.of(b, c))}`), steady((x) => Q.of(x + b, c))],
    [`${m}x + y = ${k}`, as(`y = ${linear(-m, k)}`), steady((x) => Q.of(k - m * x))],
    [`y = ${k} - \\frac{x}{${c}}`, as(`y = ${linear(Q.of(-1, c), k)}`), steady((x) => Q.of(k * c - x, c))],
  ];
};

/** testedNonlinear are nonlinear functions, some of which look linear at first sight, each with the reason and a check by values. */
const testedNonlinear = (rng: Rng): TestedForm[] => {
  const [m, b, c] = [rng.int(2, 6), rng.int(1, 7), rng.int(2, 5)];
  return [
    [`y = ${m}x^{2} + ${b}`, t("$x$ is squared", "$x$ 被平方"), uneven((x) => Q.of(m * x * x + b))],
    [`y = \\frac{${c}}{x}`, t("$x$ is in the denominator", "$x$ 在分母中"), uneven((x) => Q.of(c, x))],
    [
      `y = x(x + ${b})`,
      t(`it is $y = x^{2} + ${b}x$, with $x$ squared`, `它就是 $y = x^{2} + ${b}x$，$x$ 被平方`),
      uneven((x) => Q.of(x * (x + b))),
    ],
    [`y = ${c}^{x}`, t("$x$ is in the exponent", "$x$ 在指数上"), uneven((x) => Q.of(c ** x))],
    [
      `y = ${m}\\sqrt{x}`,
      t("$x$ is under a square root", "$x$ 在根号下"),
      [
        `Test values: at $x = 1, 4, 9$ it gives $y = ${m}, ${2 * m}, ${3 * m}$. $x$ rises by $3$ and then by $5$, while $y$ rises by $${m}$ each time, so the rate is not constant.`,
        `代入检验：$x = 1, 4, 9$ 时 $y = ${m}, ${2 * m}, ${3 * m}$。$x$ 先增加 $3$，再增加 $5$，而 $y$ 每次都增加 $${m}$，所以变化率不是常数。`,
      ],
    ],
    [`y = \\frac{${b}}{x} + ${m}`, t("$x$ is in the denominator", "$x$ 在分母中"), uneven((x) => Q.of(b + m * x, x))],
  ];
};

/** capital starts a sentence with a capital letter. */
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** describingTheFunctionalRelationshipBetweenTwoQuantitiesFromAGraph describes a relationship qualitatively from its graph. */
export const describingTheFunctionalRelationshipBetweenTwoQuantitiesFromAGraph = withIntro(
  topic(
    "describing-the-functional-relationship-between-two-quantities-from-a-graph",
    t("Describing the Functional Relationship Between Two Quantities From a Graph", "根据图像描述两个量之间的函数关系"),
    t(
      "A graph shows how one quantity changes as another does. Where the graph rises the quantity increases, where it is horizontal the quantity stays the same, and where it falls the quantity decreases; the steeper the graph, the faster the change.",
      "图像显示一个量如何随另一个量变化。图像上升的部分表示这个量在增加，水平的部分表示保持不变，下降的部分表示在减少；图像越陡，变化越快。",
    ),
    ["graphs-of-functions", "slope-of-a-line"],
    ["8.F.B.5"],
    [
      lesson(
        "reading-the-intervals",
        ["Finding when the quantity changes in a given way", "找出量以某种方式变化的时段"],
        [
          [
            "Read the graph piece by piece from left to right. A piece that rises means the quantity increases during that time, a horizontal piece means it stays the same, and a piece that falls means it decreases. Of two rising pieces, the steeper one is the faster increase, even if the other one ends higher.",
            "从左到右逐段读图。上升的线段表示这段时间里量在增加，水平的线段表示量保持不变，下降的线段表示量在减少。两段上升的线段中，更陡的那段增加得更快，即使另一段结束时的位置更高。",
          ],
          [
            "Use the numbers: a rise of $4$ in $2$ hours is $2$ per hour, faster than a rise of $2$ in $4$ hours, which is $0.5$ per hour.",
            "用数来算：$2$ 小时上升 $4$ 是每小时 $2$，比 $4$ 小时上升 $2$（每小时 $0.5$）快。",
          ],
          ["Do not pick the piece that ends highest; the steepest piece is the fastest.", "不要选结束时最高的那段；最陡的那段才最快。"],
        ],
        (rng) => {
          for (;;) {
            const q = rng.pick(questions);
            const story = rng.pick(stories);
            // Four pieces, exactly one of which has the property asked about.
            const pool: Behavior[] = ["up-fast", "up-slow", "level", "down-fast", "down-slow"];
            const bs = rng.shuffle(pool).slice(0, 4);
            if (bs.filter(q.has).length !== 1) continue;
            const ps = pieces(rng, bs);
            if (!ps) continue;
            const hit = ps.find((p) => q.has(p.behavior))!;
            const rate = (hit.y1 - hit.y0) / (hit.x1 - hit.x0);
            const name = interval(hit.x0, hit.x1);
            return chosen(
              rng,
              [
                `The graph shows ${story.quantity.en}, in ${story.unit.en}, $t$ hours after noon. During which time does it ${q.ask.en}?`,
                `图像表示中午 $t$ 小时后${story.quantity["zh-CN"]}（${story.unit["zh-CN"]}）。在哪段时间里它${q.ask["zh-CN"]}？`,
              ],
              [name.en, name["zh-CN"]],
              ps.filter((p) => p !== hit).map(pieceWhy),
              [
                [
                  ["Read the pieces", "逐段读图"],
                  [`Go from left to right and look for the piece where ${q.why.en}.`, `从左到右，找出${q.why["zh-CN"]}的那一段。`],
                ],
                [
                  ["Name the time", "说出时段"],
                  [
                    `From $t = ${hit.x0}$ to $t = ${hit.x1}$ ${q.why.en}: the value goes from $${hit.y0}$ to $${hit.y1}$.`,
                    `从 $t = ${hit.x0}$ 到 $t = ${hit.x1}$，${q.why["zh-CN"]}：值从 $${hit.y0}$ 变为 $${hit.y1}$。`,
                  ],
                ],
              ],
              [
                `Work out the change per hour on every piece:${steps(...perHour(ps))}Only the piece from $t = ${hit.x0}$ to $t = ${hit.x1}$, with $${rate}$ per hour, fits.`,
                `算出每一段每小时的变化：${steps(...perHour(ps))}只有从 $t = ${hit.x0}$ 到 $t = ${hit.x1}$ 的那段（每小时 $${rate}$）符合。`,
              ],
              pieceGraph(ps, story),
            );
          }
        },
        drawn(gradeDrawings5["describing-the-functional-relationship-between-two-quantities-from-a-graph#reading-the-intervals"]),
      ),
      lesson(
        "describing-the-whole-graph",
        ["Describing the whole graph", "描述整个图像"],
        [
          [
            "A graph that rises steeply, then is horizontal, then falls gently describes a quantity that increases quickly, then stays the same, and then decreases slowly. The order matters, and so does the steepness: a gentle fall is a slow decrease.",
            "图像先陡峭上升，再保持水平，然后缓缓下降，描述的是一个量先迅速增加，然后保持不变，最后缓慢减少。顺序很重要，陡峭程度也很重要：缓缓下降表示缓慢减少。",
          ],
          [
            "Use the numbers: a rise of $5$ in $1$ hour, no change for $3$ hours, then a fall of $5$ over $5$ hours is $+5$, $0$ and $-1$ per hour.",
            "用数来算：$1$ 小时上升 $5$，$3$ 小时不变，再用 $5$ 小时下降 $5$，就是每小时 $+5$、$0$ 和 $-1$。",
          ],
          [
            "Read from left to right, the way time runs; read backward, the story is reversed.",
            "要按时间的方向从左往右读；倒着读，故事就反了。",
          ],
        ],
        (rng) => {
          for (;;) {
            const story = rng.pick(stories);
            const pool: Behavior[] = ["up-fast", "up-slow", "level", "down-fast", "down-slow"];
            const bs = rng.shuffle(pool).slice(0, 3);
            const ps = pieces(rng, bs);
            if (!ps) continue;
            // The pieces in reverse order, one speed swapped, and one direction swapped.
            const speed: Record<Behavior, Behavior> = {
              "up-fast": "up-slow",
              "up-slow": "up-fast",
              level: "level",
              "down-fast": "down-slow",
              "down-slow": "down-fast",
            };
            const flip: Record<Behavior, Behavior> = {
              "up-fast": "down-fast",
              "up-slow": "down-slow",
              level: "up-slow",
              "down-fast": "up-fast",
              "down-slow": "up-slow",
            };
            const i = bs.findIndex((b) => b !== "level");
            const j = rng.int(0, 2);
            const right = describing(bs);
            const options: Wrong[] = [
              [
                [...bs].reverse(),
                "That reads the pieces from right to left, against the flow of time.",
                "这是从右往左读的，与时间的方向相反。",
              ] as const,
              [
                bs.map((b, k) => (k === i ? speed[b] : b)),
                "That gets the steepness of one piece wrong.",
                "这是把其中一段的陡峭程度弄错了。",
              ] as const,
              [
                bs.map((b, k) => (k === j ? flip[b] : b)),
                "That gets the direction of one piece wrong.",
                "这是把其中一段的方向弄错了。",
              ] as const,
            ]
              .map(([w, en, zh]) => [describing(w), en, zh] as const)
              .filter(([w], k, all) => w.en !== right.en && all.findIndex(([v]) => v.en === w.en) === k)
              .map(([w, en, zh]) => [[w.en, w["zh-CN"]], en, zh] as const);
            return chosen(
              rng,
              [
                `The graph shows ${story.quantity.en}, in ${story.unit.en}, $t$ hours after noon. Which description matches the graph?`,
                `图像表示中午 $t$ 小时后${story.quantity["zh-CN"]}（${story.unit["zh-CN"]}）。哪个描述与图像相符？`,
              ],
              [right.en, right["zh-CN"]],
              options,
              [
                [
                  ["Read the pieces in order", "按顺序读各段"],
                  [
                    `From left to right: ${ps.map((p) => `from $t = ${p.x0}$ to $t = ${p.x1}$ it ${behaviorWords[p.behavior].en}`).join("; ")}.`,
                    `从左到右：${ps.map((p) => `从 $t = ${p.x0}$ 到 $t = ${p.x1}$，${behaviorWords[p.behavior]["zh-CN"]}`).join("；")}。`,
                  ],
                ],
                [
                  ["Match the description", "对照描述"],
                  [
                    "The description must name the same changes, at the same speeds, in the same order.",
                    "描述必须按同样的顺序，说出同样的变化和同样的快慢。",
                  ],
                ],
              ],
              [
                `Work out the change per hour on each piece:${steps(...perHour(ps))}A change of $3$ or $-3$ per hour is quick, $1$ or $-1$ slow, and $0$ none, which matches the description piece by piece.`,
                `算出每一段每小时的变化：${steps(...perHour(ps))}每小时变化 $3$ 或 $-3$ 是快，$1$ 或 $-1$ 是慢，$0$ 是不变，与描述逐段相符。`,
              ],
              pieceGraph(ps, story),
            );
          }
        },
        drawn(gradeDrawings5["describing-the-functional-relationship-between-two-quantities-from-a-graph#describing-the-whole-graph"]),
      ),
    ],
  ),
  [
    "A cyclist rides out quickly, stops for lunch, then rides slowly home. A graph of her distance from home against time tells this story without words.",
    "一位骑车人快速骑出去，停下来吃午饭，再慢慢骑回家。她离家的距离随时间变化的图像，不用文字就能讲出这个故事。",
  ],
  [
    "The graph rises steeply, is flat during lunch, then falls gently back to $0$.",
    "图像先陡峭上升，午饭时保持水平，然后缓缓下降回到 $0$。",
  ],
  [
    "read where a graph rises, stays level or falls, and how fast, and describe the whole story.",
    "读出图像在哪里上升、保持水平或下降，以及变化的快慢，并描述整个过程。",
  ],
);

// ---------------------------------------------------------------------------
// Linear and nonlinear functions

/** linearFunctionsVersusNonlinearFunctions tells linear functions from nonlinear ones by their equations and tables. */
export const linearFunctionsVersusNonlinearFunctions = withIntro(
  topic(
    "linear-functions-versus-nonlinear-functions",
    t("Linear Functions Versus Nonlinear Functions", "一次函数与非线性函数"),
    t(
      "A linear function can be written as y = mx + b: its graph is a straight line, and equal steps in x always change y by the same amount. A function whose equation has x squared, x in a denominator, under a root or in an exponent is nonlinear.",
      "一次函数可以写成 y = mx + b 的形式：它的图像是直线，x 每增加相同的量，y 的变化量总是相同的。方程中含有 x 的平方、分母含 x、根号下含 x 或指数含 x 的函数是非线性函数。",
    ),
    ["graphs-of-functions", "slope-intercept-form"],
    ["8.F.A.3"],
    [
      lesson(
        "linear-from-the-equation",
        ["Deciding from the equation", "由方程判断"],
        [
          [
            "$y = 3(x - 2)$ is linear: it is $y = 3x - 6$. So are $y = \\frac{x + 1}{2} = \\frac{1}{2}x + \\frac{1}{2}$ and $4x + y = 9$, which is $y = -4x + 9$. But $y = x(x + 1) = x^{2} + x$ is not, and neither is $y = \\frac{2}{x}$.",
            "$y = 3(x - 2)$ 是一次函数：它就是 $y = 3x - 6$。$y = \\frac{x + 1}{2} = \\frac{1}{2}x + \\frac{1}{2}$ 和 $4x + y = 9$（即 $y = -4x + 9$）也是。但 $y = x(x + 1) = x^{2} + x$ 不是，$y = \\frac{2}{x}$ 也不是。",
          ],
          [
            "Test equal steps: $y = x(x + 1)$ gives $2, 6, 12$ at $x = 1, 2, 3$. The changes $4$ and $6$ differ, so it is not a line.",
            "用相等的步长检验：$y = x(x + 1)$ 在 $x = 1, 2, 3$ 时得 $2, 6, 12$。变化量 $4$ 和 $6$ 不同，所以不是直线。",
          ],
          [
            "Rewrite before deciding: $y = x(x + 1)$ looks simple but hides $x^{2}$.",
            "先变形再判断：$y = x(x + 1)$ 看起来简单，却藏着 $x^{2}$。",
          ],
        ],
        (rng) => {
          const askLinear = rng.bool();
          const lin = rng.shuffle(testedLinear(rng));
          const non = rng.shuffle(testedNonlinear(rng));
          const [correct, others] = askLinear ? [lin[0]!, non.slice(0, 3)] : [non[0]!, lin.slice(0, 3)];
          const [eq, why, check] = correct;
          return chosen(
            rng,
            askLinear
              ? ["Which equation defines a linear function?", "哪个方程定义的是一次函数？"]
              : ["Which equation does not define a linear function?", "哪个方程定义的不是一次函数？"],
            [`$${eq}$`, `$${eq}$`],
            others.map(([e, w]) =>
              askLinear
                ? ([[`$${e}$`, `$${e}$`], `${capital(w.en)}, so it is not linear.`, `${w["zh-CN"]}，所以不是一次函数。`] as const)
                : ([
                    [`$${e}$`, `$${e}$`],
                    `It is linear. It can be rewritten as ${w.en}.`,
                    `它是一次函数，可以化成 ${w["zh-CN"]}。`,
                  ] as const),
            ),
            [
              [
                ["Rewrite each equation", "把每个方程变形"],
                [
                  "Solve for $y$ and multiply out, to see whether $x$ appears only to the first power and not in a denominator, root or exponent.",
                  "解出 $y$ 并去括号，看 $x$ 是否只以一次方出现，而不在分母、根号或指数中。",
                ],
              ],
              [
                ["Decide", "判断"],
                askLinear
                  ? [
                      `It has the form $y = mx + b$ once rewritten: $${eq}$ becomes ${why.en}.`,
                      `变形后具有 $y = mx + b$ 的形式：$${eq}$ 化成 ${why["zh-CN"]}。`,
                    ]
                  : [`In $${eq}$, ${why.en}, so it is not linear.`, `在 $${eq}$ 中，${why["zh-CN"]}，所以它不是一次函数。`],
              ],
            ],
            check,
          );
        },
        tableFigure(
          ["y = 3(x − 2)", "y = x(x + 1)"],
          ["x = 1", "x = 2", "x = 3"],
          [
            ["−3", "0", "3"],
            ["2", "6", "12"],
          ],
          [
            "A table: y = 3(x − 2) gives −3, 0, 3, changing by 3 each step; y = x(x + 1) gives 2, 6, 12, changing by 4 then 6.",
            "一张表：y = 3(x − 2) 得 −3、0、3，每步变化 3；y = x(x + 1) 得 2、6、12，先变化 4，再变化 6。",
          ],
        ),
      ),
      lesson(
        "linear-from-a-table",
        ["Deciding from a table", "由表格判断"],
        [
          [
            "When $x$ goes up in equal steps, a linear function changes $y$ by the same amount every time. For $x = 0, 1, 2, 3$ and $y = 5, 8, 11, 14$ the differences are all $3$: linear. For $y = 1, 2, 4, 8$ the differences are $1, 2, 4$: nonlinear.",
            "当 $x$ 以相等的步长增加时，一次函数的 $y$ 每次变化的量都相同。对于 $x = 0, 1, 2, 3$ 和 $y = 5, 8, 11, 14$，差都是 $3$：是一次函数。对于 $y = 1, 2, 4, 8$，差是 $1, 2, 4$：不是一次函数。",
          ],
          [
            "Fit a line through the first two points: $y = 3x + 5$. It gives $11$ and $14$ at $x = 2$ and $3$, as the table does.",
            "过前两个点作直线：$y = 3x + 5$。它在 $x = 2$ 和 $3$ 时得 $11$ 和 $14$，与表格一致。",
          ],
          ["Check every difference: a table can start like a line and then bend.", "要检查每一个差：表格可能开头像直线，后面却弯曲了。"],
        ],
        (rng) => {
          for (;;) {
            const step = rng.pick([1, 2, 3]);
            const x0 = rng.int(-2, 3);
            const xs = [0, 1, 2, 3].map((i) => x0 + i * step);
            const m = rng.nonZero(-5, 5);
            const b = rng.int(-6, 9);
            const kind = rng.pick(["linear", "linear", "square", "bend"] as const);
            const ys =
              kind === "linear"
                ? xs.map((x) => m * x + b)
                : kind === "square"
                  ? xs.map((x) => x * x + b)
                  : xs.map((x, i) => m * x + b + (i === 3 ? rng.sign() * rng.int(1, 3) : 0));
            const diffs = ys.slice(1).map((y, i) => y - ys[i]!);
            if (kind === "square" && new Set(diffs).size === 1) continue;
            const isLinear = new Set(diffs).size === 1;
            const row = (name: string, vs: number[]) => `${name} & ${vs.map((v) => num(v)).join(" & ")}`;
            const table = `\\begin{array}{c|cccc} ${row("x", xs)} \\\\ \\hline ${row("y", ys)} \\end{array}`;
            // The line through the first two points, and where it puts the other two.
            const rate = Q.of(diffs[0]!, step);
            const start = Q.of(ys[0]!).sub(rate.mul(Q.of(xs[0]!)));
            const at = (x: number) => rate.mul(Q.of(x)).add(start);
            const [p2, p3] = [at(xs[2]!), at(xs[3]!)];
            const misses = [2, 3].filter((i) => !at(xs[i]!).eq(Q.of(ys[i]!)));
            const firstMiss = misses[0] ?? 3;
            return decided(
              rng,
              [`Could this table come from a linear function?${steps(table)}`, `这个表格可能来自一次函数吗？${steps(table)}`],
              isLinear,
              [
                [
                  ["Check the steps in x", "看 x 的步长"],
                  [`The $x$-values go up by $${step}$ each time.`, `$x$ 每次增加 $${step}$。`],
                ],
                [
                  ["Compare the changes in y", "比较 y 的变化量"],
                  isLinear
                    ? [
                        `The $y$-values change by $${diffs[0]}$ every time, so the table fits a linear function.`,
                        `$y$ 每次都变化 $${diffs[0]}$，所以表格符合一次函数。`,
                      ]
                    : [
                        `The changes in $y$ are $${diffs.join(", ")}$, which are not all equal, so the function is not linear.`,
                        `$y$ 的变化量是 $${diffs.join(", ")}$，并不都相等，所以不是一次函数。`,
                      ],
                ],
              ],
              isLinear
                ? [
                    `Fit a line through the first two points: $y = ${linear(rate, start)}$. It gives $${num(p2)}$ and $${num(p3)}$ at $x = ${xs[2]}$ and $${xs[3]}$, as the table does.`,
                    `过前两个点作直线：$y = ${linear(rate, start)}$。它在 $x = ${xs[2]}$ 和 $${xs[3]}$ 时得 $${num(p2)}$ 和 $${num(p3)}$，与表格一致。`,
                  ]
                : [
                    `Fit a line through the first two points: $y = ${linear(rate, start)}$. At $x = ${xs[firstMiss]}$ it gives $${num(at(xs[firstMiss]!))}$, but the table has $${ys[firstMiss]}$.`,
                    `过前两个点作直线：$y = ${linear(rate, start)}$。它在 $x = ${xs[firstMiss]}$ 时得 $${num(at(xs[firstMiss]!))}$，而表格中是 $${ys[firstMiss]}$。`,
                  ],
              isLinear
                ? [
                    "$y$ changes by the same amount at every equal step in $x$, and that is all a linear function needs; $y$ need not be a multiple of $x$.",
                    "$x$ 每增加相同的量，$y$ 都变化相同的量，这正是一次函数所需要的；$y$ 不必是 $x$ 的倍数。",
                  ]
                : [
                    `Equal steps in $x$ are not enough: the changes in $y$, $${diffs.join(", ")}$, must all be equal too.`,
                    `$x$ 的步长相等还不够：$y$ 的变化量 $${diffs.join(", ")}$ 也必须都相等。`,
                  ],
            );
          }
        },
        tableFigure(
          ["y", "Δy"],
          ["x = 0", "x = 1", "x = 2", "x = 3"],
          [
            ["5", "8", "11", "14"],
            ["", "+3", "+3", "+3"],
          ],
          [
            "A table with x = 0, 1, 2, 3 and y = 5, 8, 11, 14: y changes by +3 at every step, so the table fits a line.",
            "一张表：x = 0、1、2、3，y = 5、8、11、14：y 每一步都变化 +3，所以符合直线。",
          ],
        ),
      ),
    ],
  ),
  [
    "A phone plan charges $5$ dollars plus $3$ dollars a gigabyte. Another plan doubles its price with every gigabyte. Only one of these grows along a straight line.",
    "一种手机套餐收 $5$ 美元，再加每 GB $3$ 美元；另一种套餐每多用 1 GB 价格就翻一倍。只有一种是沿着直线增长的。",
  ],
  [
    "The first gives $5, 8, 11, 14$ for $0$ to $3$ gigabytes, always $3$ more. The second at $1, 2, 4, 8$ does not change evenly.",
    "第一种在 $0$ 到 $3$ GB 时是 $5, 8, 11, 14$，每次多 $3$。第二种 $1, 2, 4, 8$ 的变化并不均匀。",
  ],
  ["tell linear functions from nonlinear ones by their equations and their tables.", "根据方程和表格区分一次函数与非线性函数。"],
);

// ---------------------------------------------------------------------------
// Rate of change and initial value

/** Situation is a context for a linear function of time with a starting value and a constant rate. */
interface Situation {
  readonly setup: Text;
  readonly at: (x: number, y: number) => Text;
  readonly start: Text;
  readonly rate: Text;
  readonly input: Text;
  readonly sign: 1 | -1;
  readonly rates: readonly [number, number];
  readonly starts: readonly [number, number];
}

/** situations are the contexts for rates of change and initial values. */
const situations: readonly Situation[] = [
  {
    setup: t("A candle burns down at a constant rate.", "一支蜡烛匀速燃烧。"),
    at: (x, y) => t(`After $${x}$ hours it is $${y}$ centimeters tall`, `点燃 $${x}$ 小时后，它高 $${y}$ 厘米`),
    start: t("How tall was the candle when it was lit, in centimeters?", "蜡烛刚点燃时有多高（厘米）？"),
    input: t("time", "时间"),
    rate: t("centimeters per hour", "厘米每小时"),
    sign: -1,
    rates: [1, 3],
    starts: [18, 30],
  },
  {
    setup: t("A savings account grows by the same amount every week.", "一个储蓄账户每周增加相同的金额。"),
    at: (x, y) => t(`After $${x}$ weeks it holds $${y}$ dollars`, `$${x}$ 周后，账户里有 $${y}$ 美元`),
    start: t("How many dollars were in the account at the start?", "账户开始时有多少美元？"),
    input: t("time", "时间"),
    rate: t("dollars per week", "美元每周"),
    sign: 1,
    rates: [5, 25],
    starts: [20, 150],
  },
  {
    setup: t("A tank drains at a constant rate.", "一个水箱匀速放水。"),
    at: (x, y) => t(`After $${x}$ minutes it holds $${y}$ liters`, `$${x}$ 分钟后，水箱里有 $${y}$ 升水`),
    start: t("How many liters were in the tank at the start?", "水箱开始时有多少升水？"),
    input: t("time", "时间"),
    rate: t("liters per minute", "升每分钟"),
    sign: -1,
    rates: [4, 15],
    starts: [200, 400],
  },
  {
    setup: t("A taxi charges a fixed fee plus the same amount for every mile.", "一辆出租车收取固定费用，另外每英里收取相同的费用。"),
    at: (x, y) => t(`${article(x, true)} $${x}$-mile ride costs $${y}$ dollars`, `乘坐 $${x}$ 英里需要 $${y}$ 美元`),
    start: t("What is the fixed fee, in dollars?", "固定费用是多少美元？"),
    input: t("distance", "路程"),
    rate: t("dollars per mile", "美元每英里"),
    sign: 1,
    rates: [2, 4],
    starts: [3, 8],
  },
];

/** lowerAt writes a second reading so that it can follow the first in one sentence. */
const lowerAt = (s: Situation, x: number, y: number): Text => {
  const r = s.at(x, y);
  return t(r.en.replace(/^After/, "after").replace(/^A /, "a "), r["zh-CN"]);
};

/** twoReadings draws a situation, a rate, a starting value and two readings that stay positive. */
function twoReadings(rng: Rng) {
  const s = rng.pick(situations);
  const rate = s.sign * rng.int(...s.rates);
  const start = rng.int(...s.starts);
  const [x1, x2] = rng.sample([1, 2, 3, 4, 5, 6, 8, 10], 2).sort((a, b) => a - b) as [number, number];
  const [y1, y2] = [start + rate * x1, start + rate * x2];
  if (y2 <= 0) return twoReadings(rng);
  const given = t(
    `${s.setup.en} ${s.at(x1, y1).en}, and ${lowerAt(s, x2, y2).en}.`,
    `${s.setup["zh-CN"]}${s.at(x1, y1)["zh-CN"]}，${s.at(x2, y2)["zh-CN"]}。`,
  );
  return { s, rate, start, x1, x2, y1, y2, given };
}

/** paren writes a number in parentheses when it is negative, for use after an operation sign. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** candleLine draws the candle's two readings on a time line, with the step between them or back to the start. */
const candleLine = (back: boolean) =>
  lineFigure(
    {
      lo: 0,
      hi: 6,
      step: 1,
      labels: [0, 2, 5, 6],
      marks: [...(back ? [{ at: 0, text: "?", result: true }] : []), { at: 2, text: "21 cm" }, { at: 5, text: "15 cm" }],
      jumps: [back ? [2, 0] : [2, 5]],
    },
    back
      ? [
          "A time line in hours with 21 cm at 2 and 15 cm at 5, and a jump back from 2 to an unknown height at 0.",
          "以小时为单位的时间线，2 处标 21 厘米，5 处标 15 厘米，从 2 跳回 0，0 处高度未知。",
        ]
      : [
          "A time line in hours with 21 cm at 2 and 15 cm at 5, and a jump from 2 to 5.",
          "以小时为单位的时间线，2 处标 21 厘米，5 处标 15 厘米，从 2 跳到 5。",
        ],
  );

/** interpretingRateOfChangeAndInitialValueInContext finds the rate and the starting value of a linear situation. */
export const interpretingRateOfChangeAndInitialValueInContext = withIntro(
  topic(
    "interpreting-rate-of-change-and-initial-value-in-context",
    t("Interpreting Rate of Change and Initial Value in Context", "在情境中理解变化率和初始值"),
    t(
      "For a quantity that changes at a constant rate, the rate of change is the change in the quantity divided by the change in time, with units such as dollars per week; it is negative when the quantity decreases. The initial value is the quantity at time 0.",
      "对于以恒定速率变化的量，变化率等于这个量的变化量除以时间的变化量，单位如“美元每周”；量减少时变化率为负。初始值是时间为 0 时这个量的值。",
    ),
    ["modeling-with-linear-functions"],
    ["8.F.B.4"],
    [
      lesson(
        "the-rate-of-change-from-two-readings",
        ["The rate of change from two readings", "由两次读数求变化率"],
        [
          [
            "The rate of change is the change in the quantity divided by the change in time. A candle is $21$ cm tall after $2$ hours and $15$ cm tall after $5$ hours. Its rate is $\\frac{15 - 21}{5 - 2} = \\frac{-6}{3} = -2$ centimeters per hour.",
            "变化率等于量的变化量除以时间的变化量。一支蜡烛点燃 $2$ 小时后高 $21$ 厘米，$5$ 小时后高 $15$ 厘米。它的变化率是 $\\frac{15 - 21}{5 - 2} = \\frac{-6}{3} = -2$ 厘米每小时。",
          ],
          [
            "Going on from $21$ cm for $3$ hours at $-2$ cm per hour gives $21 - 6 = 15$ cm, the second reading.",
            "从 $21$ 厘米出发，以每小时 $-2$ 厘米变化 $3$ 小时，得 $21 - 6 = 15$ 厘米，正是第二次读数。",
          ],
          ["Keep the sign. The candle gets shorter, so its rate is negative.", "要保留符号。蜡烛越来越短，所以变化率是负数。"],
        ],
        (rng) => {
          const { s, rate, x1, x2, y1, y2, given } = twoReadings(rng);
          return valued(
            [`${given.en} What is the rate of change, in ${s.rate.en}?`, `${given["zh-CN"]}变化率是多少（单位：${s.rate["zh-CN"]}）？`],
            rate,
            [
              [
                ["Find the changes", "求变化量"],
                [
                  `The quantity changes by $${y2} - ${y1} = ${y2 - y1}$ while the ${s.input.en} changes by $${x2} - ${x1} = ${x2 - x1}$.`,
                  `量变化了 $${y2} - ${y1} = ${y2 - y1}$，同时${s.input["zh-CN"]}变化了 $${x2} - ${x1} = ${x2 - x1}$。`,
                ],
              ],
              [
                ["Divide", "相除"],
                [`Divide the change in the quantity by the change in ${s.input.en}:`, `用量的变化量除以${s.input["zh-CN"]}的变化量：`],
                [`\\frac{${y2 - y1}}{${x2 - x1}} = ${rate}`],
              ],
            ],
            [
              `Going on from the first reading: $${y1} + ${x2 - x1} \\cdot ${paren(rate)} = ${y2}$, the second reading.`,
              `从第一次读数往后推：$${y1} + ${x2 - x1} \\cdot ${paren(rate)} = ${y2}$，正是第二次读数。`,
            ],
            [
              s.sign < 0
                ? [
                    -rate,
                    "That drops the minus sign, but the quantity falls, so the rate is negative.",
                    "这是丢了负号，但量在减少，所以变化率是负数。",
                  ]
                : [
                    -rate,
                    "That adds a minus sign, but the quantity grows, so the rate is positive.",
                    "这是多了负号，但量在增加，所以变化率是正数。",
                  ],
              [
                y2 - y1,
                `That is the change in the quantity; divide it by the change in ${s.input.en}.`,
                `这是量的变化量；还要除以${s.input["zh-CN"]}的变化量。`,
              ],
              [
                Q.of(x2 - x1, y2 - y1),
                `That divides the other way, ${s.input.en} over the quantity.`,
                `这是除反了，用${s.input["zh-CN"]}除以量。`,
              ],
            ],
          );
        },
        candleLine(false),
      ),
      lesson(
        "the-initial-value-from-two-readings",
        ["The initial value from two readings", "由两次读数求初始值"],
        [
          [
            "The initial value is the quantity at time $0$. Work back to it from a reading, using the rate. The candle loses $2$ cm per hour, so $2$ hours before the first reading it was $2 \\cdot 2 = 4$ cm taller. It was $21 + 4 = 25$ cm when it was lit.",
            "初始值是时间为 $0$ 时的量。用变化率从某次读数倒推回去。蜡烛每小时变短 $2$ 厘米，所以在第一次读数前 $2$ 小时，它高出 $2 \\cdot 2 = 4$ 厘米。刚点燃时高 $21 + 4 = 25$ 厘米。",
          ],
          [
            "Going forward from $25$ cm for $5$ hours gives $25 - 5 \\cdot 2 = 15$ cm, the second reading.",
            "从 $25$ 厘米往后推 $5$ 小时，得 $25 - 5 \\cdot 2 = 15$ 厘米，正是第二次读数。",
          ],
          [
            "Go back all the way to time $0$. One hour back gives $23$ cm, which is not the starting height.",
            "要一直倒推到时间 $0$。只往回推一小时得 $23$ 厘米，那不是起始高度。",
          ],
        ],
        (rng) => {
          const { s, rate, start, x1, x2, y1, y2, given } = twoReadings(rng);
          return valued(
            [`${given.en} ${s.start.en}`, `${given["zh-CN"]}${s.start["zh-CN"]}`],
            start,
            [
              [
                ["Find the rate", "求变化率"],
                [`The rate of change is ${s.rate.en}:`, `变化率（${s.rate["zh-CN"]}）是：`],
                [`\\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${rate}`],
              ],
              [
                ["Work back to zero", "倒推到零"],
                [`Undo $${x1}$ steps of the rate from the first reading:`, `从第一次读数撤回 $${x1}$ 步变化：`],
                [`${y1} - ${x1} \\cdot ${paren(rate)} = ${start}`],
              ],
            ],
            [
              `Going forward from $${start}$: $${start} + ${x2} \\cdot ${paren(rate)} = ${y2}$, the second reading.`,
              `从 $${start}$ 往后推：$${start} + ${x2} \\cdot ${paren(rate)} = ${y2}$，正是第二次读数。`,
            ],
            [
              [
                y1 - rate,
                `That goes back one step only, not all the way to ${s.input.en} $0$.`,
                `这是只往回推了一步，没有推到${s.input["zh-CN"]}为 $0$。`,
              ],
              [
                y1 + rate * x1,
                "That applies the rate the wrong way; going back undoes the change.",
                "这是把变化率用反了；倒推要撤回变化。",
              ],
              [rate, "That is the rate of change, not the starting value.", "这是变化率，不是起始值。"],
              [
                y1,
                `That is the first reading, taken at ${s.input.en} $${x1}$, not $0$.`,
                `这是第一次读数，是${s.input["zh-CN"]}为 $${x1}$ 时的，不是 $0$ 时的。`,
              ],
            ],
          );
        },
        candleLine(true),
      ),
      lesson(
        "when-a-linear-model-reaches-zero",
        ["When a linear model reaches zero", "线性模型何时变为零"],
        [
          [
            "Two readings fix the whole linear model. To find when the quantity runs out, divide the amount left at a reading by the rate. Then add the time of that reading. A tank holds $60$ liters at $4$ minutes and $40$ liters at $9$ minutes. It loses $4$ liters per minute, so the $40$ liters last $10$ more minutes: it is empty at $9 + 10 = 19$ minutes.",
            "两次读数就确定了整个线性模型。要知道这个量何时用完，用某次读数时剩下的量除以变化率，再加上那次读数的时间。一个水箱 $4$ 分钟时有 $60$ 升，$9$ 分钟时有 $40$ 升。它每分钟少 $4$ 升，所以这 $40$ 升还能放 $10$ 分钟：在 $9 + 10 = 19$ 分钟时放空。",
          ],
          ["At $19$ minutes the tank holds $40 - 10 \\cdot 4 = 0$ liters.", "在 $19$ 分钟时，水箱里有 $40 - 10 \\cdot 4 = 0$ 升。"],
          [
            "Add the time of the reading. The $10$ minutes are counted from the reading, not from the start.",
            "要加上读数的时间。这 $10$ 分钟是从那次读数算起的，不是从开始算起的。",
          ],
        ],
        (rng) => {
          const rate = rng.int(2, 12);
          const answer = rng.int(15, 60);
          const t1 = rng.int(2, 6);
          const t2 = t1 + rng.int(2, 8);
          const v1 = rate * (answer - t1);
          const v2 = rate * (answer - t2);
          return valued(
            [
              `A tank drains at a steady rate. After $${t1}$ minutes it holds $${v1}$ liters, and after $${t2}$ minutes it holds $${v2}$ liters. How many minutes after the start is it empty?`,
              `一个水箱匀速放水。$${t1}$ 分钟后还有 $${v1}$ 升，$${t2}$ 分钟后还有 $${v2}$ 升。开始后多少分钟水箱放空？`,
            ],
            answer,
            [
              [
                ["Find the rate", "求变化率"],
                ["The tank loses this many liters per minute:", "水箱每分钟减少的升数："],
                [`(${v1} - ${v2}) \\div ${t2 - t1} = ${rate}`],
              ],
              [
                ["Time left after the reading", "读数之后还能放多久"],
                [`The $${v2}$ liters left at $${t2}$ minutes last:`, `$${t2}$ 分钟时剩下的 $${v2}$ 升还能放：`],
                [`${v2} \\div ${rate} = ${answer - t2}`],
              ],
              [
                ["Add the time of the reading", "加上读数的时间"],
                ["Count from the start:", "从开始算起："],
                [`${t2} + ${answer - t2} = ${answer}`],
              ],
            ],
            [
              `At $${answer}$ minutes the tank holds $${v2} - ${answer - t2} \\cdot ${rate} = 0$ liters.`,
              `在 $${answer}$ 分钟时，水箱里有 $${v2} - ${answer - t2} \\cdot ${rate} = 0$ 升。`,
            ],
            [
              [
                answer - t2,
                `That is the time after the $${t2}$-minute reading, not since the start.`,
                `这是从 $${t2}$ 分钟那次读数算起的时间，不是从开始算起的。`,
              ],
              [
                answer - t1,
                `That is the time after the $${t1}$-minute reading, not since the start.`,
                `这是从 $${t1}$ 分钟那次读数算起的时间，不是从开始算起的。`,
              ],
              [rate, "That is the rate in liters per minute, not a time.", "这是每分钟的升数，不是时间。"],
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 20,
            step: 1,
            labels: [0, 4, 9, 19],
            marks: [
              { at: 4, text: "60 L" },
              { at: 9, text: "40 L" },
              { at: 19, text: "0 L", result: true },
            ],
            jumps: [[9, 19]],
          },
          [
            "A time line in minutes with 60 liters at 4, 40 liters at 9, and a jump from 9 to 0 liters at 19.",
            "以分钟为单位的时间线，4 处标 60 升，9 处标 40 升，从 9 跳到 19，19 处为 0 升。",
          ],
        ),
      ),
    ],
  ),
  [
    "A candle is $21$ cm tall after $2$ hours and $15$ cm tall after $5$ hours. How fast does it burn, and how tall was it when it was lit?",
    "一支蜡烛点燃 $2$ 小时后高 $21$ 厘米，$5$ 小时后高 $15$ 厘米。它烧得多快？刚点燃时有多高？",
  ],
  [
    "It loses $6$ cm in $3$ hours, $2$ cm per hour, so it started at $21 + 2 \\cdot 2 = 25$ cm.",
    "它 $3$ 小时变短 $6$ 厘米，每小时 $2$ 厘米，所以起始高度是 $21 + 2 \\cdot 2 = 25$ 厘米。",
  ],
  [
    "find the rate of change and the initial value from two readings, and tell when a quantity runs out.",
    "由两次读数求变化率和初始值，并判断一个量何时用完。",
  ],
);

// ---------------------------------------------------------------------------
// Comparing functions

/** tableOf writes a table of values of y = mx + b at the given inputs. */
const tableOf = (m: number, b: number, xs: readonly number[]) =>
  `\\begin{array}{c|ccc} x & ${xs.join(" & ")} \\\\ \\hline y & ${xs.map((x) => num(m * x + b)).join(" & ")} \\end{array}`;

/** comparingPropertiesOfTwoFunctionsRepresentedDifferently compares rates of change and initial values across representations. */
export const comparingPropertiesOfTwoFunctionsRepresentedDifferently = withIntro(
  topic(
    "comparing-properties-of-two-functions-represented-differently",
    t("Comparing Properties of Two Functions Represented Differently", "比较以不同方式表示的两个函数的性质"),
    t(
      "To compare two linear functions given in different ways, such as an equation and a table, find the same property of each: the rate of change from the coefficient or from the differences, and the initial value from the constant term or by working back to x = 0.",
      "比较以不同方式（如方程和表格）给出的两个一次函数时，先分别求出各自的同一性质：变化率可由系数或差求得，初始值可由常数项或倒推到 x = 0 求得。",
    ),
    ["interpreting-rate-of-change-and-initial-value-in-context", "representations-of-functions"],
    ["8.F.A.2"],
    [
      lesson(
        "comparing-rates-of-change",
        ["Comparing rates of change", "比较变化率"],
        [
          [
            "To compare two functions given in different ways, find the same property of each. An equation gives its rate as the coefficient of $x$. A table gives it as the change in $y$ over the change in $x$. Function A is $y = -2x + 7$. Function B has $y = 4, -8, -20$ at $x = 1, 3, 5$, so its rate is $\\frac{-8 - 4}{3 - 1} = -6$. Since $-2 > -6$, A has the greater rate of change.",
            "比较以不同方式给出的两个函数时，要求出各自的同一性质。方程的变化率是 $x$ 的系数。表格的变化率是 $y$ 的变化量除以 $x$ 的变化量。函数 A 是 $y = -2x + 7$。函数 B 在 $x = 1, 3, 5$ 时 $y = 4, -8, -20$，所以变化率是 $\\frac{-8 - 4}{3 - 1} = -6$。因为 $-2 > -6$，所以 A 的变化率更大。",
          ],
          [
            "From $x = 3$ to $x = 5$, B goes from $-8$ to $-20$, again $-12$ over $2$, or $-6$.",
            "从 $x = 3$ 到 $x = 5$，B 从 $-8$ 变到 $-20$，同样是 $2$ 步变化 $-12$，即 $-6$。",
          ],
          [
            "Compare the rates as signed numbers. A rate of $-6$ is less than $-2$, though it is larger in size: B falls faster.",
            "要按带符号的数比较变化率。$-6$ 小于 $-2$，尽管它的绝对值更大：B 减少得更快。",
          ],
        ],
        (rng) => {
          // Half the time both rates are negative, so that comparing their sizes gives the wrong answer.
          const negative = rng.bool();
          const [ma, picked] = rng.sample([1, 2, 3, 4, 5, 6], 2).map((m) => (negative || rng.bool() ? -m : m)) as [number, number];
          const mb = rng.bool(0.2) ? ma : picked;
          const [ba, bb] = [rng.int(-9, 9), rng.int(-9, 9)];
          const step = rng.int(1, 3);
          const x0 = rng.int(-1, 2);
          const xs = [x0, x0 + step, x0 + 2 * step];
          const tableFirst = rng.bool();
          const [eqName, tableName] = tableFirst ? ["B", "A"] : ["A", "B"];
          const [mEq, mTable] = tableFirst ? [mb, ma] : [ma, mb];
          const [bEq, bTable] = tableFirst ? [bb, ba] : [ba, bb];
          const [y0, y1, y2] = xs.map((x) => mTable * x + bTable) as [number, number, number];
          const fA: Pair = ["Function A", "函数 A"];
          const fB: Pair = ["Function B", "函数 B"];
          const equal: Pair = ["The two rates of change are equal", "两个变化率相等"];
          const unknown: Pair = ["It cannot be determined from an equation and a table", "只凭一个方程和一个表格无法判断"];
          const cannot = [
            unknown,
            "The coefficient and the differences each give a rate, so the two can be compared.",
            "系数和差各给出一个变化率，所以可以比较。",
          ] as const;
          const [hi, lo] = ma > mb ? ["A", "B"] : ["B", "A"];
          const [mHi, mLo] = [Math.max(ma, mb), Math.min(ma, mb)];
          const lesser: [Pair, string, string] = [
            hi === "A" ? fB : fA,
            `Function ${lo}'s rate is $${mLo}$, which is less than $${mHi}$${mLo < 0 && -mLo > Math.abs(mHi) ? "; it is only larger in size" : ""}.`,
            `函数 ${lo} 的变化率是 $${mLo}$，小于 $${mHi}$${mLo < 0 && -mLo > Math.abs(mHi) ? "；只是它的绝对值更大" : ""}。`,
          ];
          const [correct, wrong]: [Pair, [Pair, string, string][]] =
            ma === mb
              ? [
                  equal,
                  [
                    [fA, `Both rates are $${ma}$, so A's is not greater.`, `两个变化率都是 $${ma}$，A 的并不更大。`],
                    [fB, `Both rates are $${ma}$, so B's is not greater.`, `两个变化率都是 $${ma}$，B 的并不更大。`],
                    [...cannot],
                  ],
                ]
              : [
                  hi === "A" ? fA : fB,
                  [
                    lesser,
                    [equal, `The rates are $${ma}$ and $${mb}$, which differ.`, `两个变化率是 $${ma}$ 和 $${mb}$，并不相等。`],
                    [...cannot],
                  ],
                ];
          return chosen(
            rng,
            [
              `Function ${eqName} is $y = ${linear(mEq, bEq)}$. Function ${tableName} is linear, with this table of values:${steps(tableOf(mTable, bTable, xs))}Which function has the greater rate of change?`,
              `函数 ${eqName} 是 $y = ${linear(mEq, bEq)}$。函数 ${tableName} 是一次函数，其数值表如下：${steps(tableOf(mTable, bTable, xs))}哪个函数的变化率更大？`,
            ],
            correct,
            wrong,
            [
              [
                ["Read the equation", "读方程"],
                [`The rate of function ${eqName} is the coefficient of $x$, $${mEq}$.`, `函数 ${eqName} 的变化率是 $x$ 的系数 $${mEq}$。`],
              ],
              [
                ["Read the table", "读表格"],
                [
                  `For function ${tableName}, divide the change in $y$ by the change in $x$:`,
                  `函数 ${tableName} 的变化率等于 $y$ 的变化量除以 $x$ 的变化量：`,
                ],
                [`\\frac{${num(y1)} - ${paren(y0)}}{${step}} = ${mTable}`],
              ],
              [
                ["Compare", "比较"],
                ma === mb
                  ? ["The two rates are equal.", "两个变化率相等。"]
                  : [
                      `Since $${mHi} > ${mLo}$, function ${hi} has the greater rate of change.`,
                      `因为 $${mHi} > ${mLo}$，所以函数 ${hi} 的变化率更大。`,
                    ],
              ],
            ],
            [
              `The next value in the table also fits: $${num(y1)} + ${step} \\cdot ${paren(mTable)} = ${num(y2)}$.`,
              `表格里的下一个值也相符：$${num(y1)} + ${step} \\cdot ${paren(mTable)} = ${num(y2)}$。`,
            ],
          );
        },
        tableFigure(
          ["y"],
          ["x = 1", "x = 3", "x = 5"],
          [["4", "−8", "−20"]],
          [
            "A table of function B: y is 4 at x = 1, −8 at x = 3 and −20 at x = 5.",
            "函数 B 的数值表：x = 1 时 y = 4，x = 3 时 y = −8，x = 5 时 y = −20。",
          ],
        ),
      ),
      lesson(
        "comparing-initial-values",
        ["Comparing initial values", "比较初始值"],
        [
          [
            "The initial value is the value at $x = 0$. An equation shows it as the constant term. From two points, find the rate and work back to $x = 0$. Function A is $y = 3x - 4$, so its initial value is $-4$. Function B passes through $(2, 9)$ and $(5, 15)$. Its rate is $\\frac{15 - 9}{5 - 2} = 2$, so at $x = 0$ it is $9 - 2 \\cdot 2 = 5$.",
            "初始值是 $x = 0$ 时的值。方程的初始值就是常数项。已知两个点时，先求变化率，再倒推到 $x = 0$。函数 A 是 $y = 3x - 4$，所以它的初始值是 $-4$。函数 B 经过 $(2, 9)$ 和 $(5, 15)$。它的变化率是 $\\frac{15 - 9}{5 - 2} = 2$，所以当 $x = 0$ 时，$y = 9 - 2 \\cdot 2 = 5$。",
          ],
          [
            "B's initial value is greater by $5 - (-4) = 9$, and B gives $5 + 5 \\cdot 2 = 15$ at $x = 5$, as it should.",
            "B 的初始值大 $5 - (-4) = 9$，而且 B 在 $x = 5$ 时得 $5 + 5 \\cdot 2 = 15$，与已知相符。",
          ],
          [
            "The first given point is at $x = 2$, not $x = 0$. So its $y$-value $9$ is not B's initial value.",
            "第一个已知点在 $x = 2$，不在 $x = 0$。所以它的纵坐标 $9$ 不是 B 的初始值。",
          ],
        ],
        (rng) => {
          const ma = rng.nonZero(-5, 5);
          const mb = rng.nonZero(-5, 5);
          const ba = rng.int(-9, 6);
          const bb = ba + rng.int(1, 9);
          const [x1, x2] = rng.sample([1, 2, 3, 4, 5], 2).sort((a, b) => a - b) as [number, number];
          const [y1, y2] = [mb * x1 + bb, mb * x2 + bb];
          return valued(
            [
              `Function A is $y = ${linear(ma, ba)}$. Function B is linear, and its graph passes through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$. The initial value of B is greater than that of A. By how much?`,
              `函数 A 是 $y = ${linear(ma, ba)}$。函数 B 是一次函数，图像经过 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$。B 的初始值比 A 的大。大多少？`,
            ],
            bb - ba,
            [
              [
                ["Read A's initial value", "读出 A 的初始值"],
                [`The constant term of A is $${ba}$.`, `A 的常数项是 $${ba}$。`],
              ],
              [
                ["Find B's rate", "求 B 的变化率"],
                ["Divide the change in $y$ by the change in $x$:", "用 $y$ 的变化量除以 $x$ 的变化量："],
                [`\\frac{${num(y2)} - ${paren(y1)}}{${x2} - ${x1}} = ${mb}`],
              ],
              [
                ["Work back and subtract", "倒推再相减"],
                ["Go back to $x = 0$, then compare:", "倒推到 $x = 0$，再比较："],
                [`${num(y1)} - ${x1} \\cdot ${paren(mb)} = ${bb}`, `${bb} - ${paren(ba)} = ${bb - ba}`],
              ],
            ],
            [
              `Adding $${bb - ba}$ to A's initial value $${ba}$ gives $${bb}$, and B is $${bb} + ${x1} \\cdot ${paren(mb)} = ${y1}$ at $x = ${x1}$.`,
              `A 的初始值 $${ba}$ 加上 $${bb - ba}$ 得 $${bb}$，而 B 在 $x = ${x1}$ 时是 $${bb} + ${x1} \\cdot ${paren(mb)} = ${y1}$。`,
            ],
            [
              [y1 - ba, `That uses B's $y$-value at $x = ${x1}$ as its initial value.`, `这是把 B 在 $x = ${x1}$ 时的值当成了初始值。`],
              [bb + ba, "That adds A's initial value instead of subtracting it.", "这是加上了 A 的初始值，而不是减去它。"],
              [bb, "That is B's initial value alone; subtract A's.", "这只是 B 的初始值；还要减去 A 的。"],
            ],
          );
        },
        drawn(gradeDrawings5["comparing-properties-of-two-functions-represented-differently#comparing-initial-values"]),
      ),
      lesson(
        "when-two-plans-cost-the-same",
        ["When two plans cost the same", "两种方案花费相同的时刻"],
        [
          [
            "Put both functions in the same form, a starting value plus a rate times the input. Then set them equal. Plan A costs $20$ dollars to join and $9$ dollars per month. Plan B's total is $33$ after $1$ month and $48$ after $4$. B rises $15 \\div 3 = 5$ per month, so its fee is $33 - 5 = 28$. Then $20 + 9m = 28 + 5m$ gives $4m = 8$ and $m = 2$.",
            "把两个函数写成同样的形式：起始值加上变化率乘以输入。再令它们相等。方案 A 入会费 $20$ 美元，每月 $9$ 美元。方案 B $1$ 个月后总额 $33$ 美元，$4$ 个月后 $48$ 美元。B 每月增加 $15 \\div 3 = 5$ 美元，所以入会费是 $33 - 5 = 28$ 美元。于是 $20 + 9m = 28 + 5m$，得 $4m = 8$，$m = 2$。",
          ],
          [
            "After $2$ months A costs $20 + 18 = 38$ dollars and B costs $28 + 10 = 38$ dollars.",
            "$2$ 个月后，A 花费 $20 + 18 = 38$ 美元，B 花费 $28 + 10 = 38$ 美元。",
          ],
          [
            "Find B's joining fee first. Its total after $1$ month, $33$, is not the fee.",
            "先求出 B 的入会费。它 $1$ 个月后的总额 $33$ 不是入会费。",
          ],
        ],
        (rng) => {
          const q = rng.int(3, 15);
          const r = q + rng.int(1, 12);
          const answer = rng.int(3, 24);
          const a = rng.int(5, 40);
          const b = a + (r - q) * answer;
          const t1 = rng.int(1, 3);
          const t2 = t1 + rng.int(2, 6);
          const y1 = b + q * t1;
          const y2 = b + q * t2;
          const gap = r - q;
          return valued(
            [
              `Plan A costs $${a}$ dollars to join and $${r}$ dollars per month. Plan B also has a joining fee and a fixed monthly price: its total is $${y1}$ dollars after $${t1}$ ${t1 === 1 ? "month" : "months"} and $${y2}$ dollars after $${t2}$ months. After how many months do the two plans have the same total?`,
              `方案 A 入会费 $${a}$ 美元，每月 $${r}$ 美元。方案 B 也有入会费和固定月费：$${t1}$ 个月后总额是 $${y1}$ 美元，$${t2}$ 个月后总额是 $${y2}$ 美元。多少个月后两种方案的总额相同？`,
            ],
            answer,
            [
              [
                ["Find B's monthly price", "求 B 的月费"],
                ["B rises this much per month:", "B 每月增加："],
                [`(${y2} - ${y1}) \\div ${t2 - t1} = ${q}`],
              ],
              [
                ["Find B's joining fee", "求 B 的入会费"],
                [`Take $${t1}$ ${t1 === 1 ? "month" : "months"} off the first total:`, `从第一个总额中去掉 $${t1}$ 个月的费用：`],
                [`${y1} - ${t1} \\cdot ${q} = ${b}`],
              ],
              [
                ["Set the totals equal", "令总额相等"],
                ["Solve for the number of months $m$:", "解出月数 $m$："],
                [`${a} + ${r}m = ${b} + ${q}m`, ...(gap === 1 ? [] : [`${gap}m = ${b - a}`]), `m = ${answer}`],
              ],
            ],
            [
              `After $${answer}$ months, A costs $${a} + ${r} \\cdot ${answer} = ${a + r * answer}$ and B costs $${b} + ${q} \\cdot ${answer} = ${b + q * answer}$.`,
              `$${answer}$ 个月后，A 花费 $${a} + ${r} \\cdot ${answer} = ${a + r * answer}$ 美元，B 花费 $${b} + ${q} \\cdot ${answer} = ${b + q * answer}$ 美元。`,
            ],
            [
              [
                b - a,
                "That is the difference of the joining fees; divide it by the difference of the monthly prices.",
                "这是入会费之差；还要除以月费之差。",
              ],
              [
                Q.of(y1 - a, gap),
                `That takes B's total after $${t1}$ ${t1 === 1 ? "month" : "months"} as its joining fee.`,
                `这是把 B $${t1}$ 个月后的总额当成了入会费。`,
              ],
              [Q.of(b - a, r + q), "That adds the monthly prices instead of subtracting them.", "这是把两个月费相加了，而不是相减。"],
            ],
          );
        },
        tableFigure(
          ["A", "B"],
          ["m = 0", "1", "2", "3", "4"],
          [
            ["20", "29", "38", "47", "56"],
            ["28", "33", "38", "43", "48"],
          ],
          [
            "A table of the two plans' totals in dollars for 0 to 4 months: A is 20, 29, 38, 47, 56 and B is 28, 33, 38, 43, 48, equal at 2 months.",
            "两种方案 0 到 4 个月的总额（美元）：A 是 20、29、38、47、56，B 是 28、33、38、43、48，在 2 个月时相等。",
          ],
        ),
      ),
    ],
  ),
  [
    "Plan A costs $y = 3x + 10$ dollars for $x$ months. Plan B's table shows $16$ dollars after $1$ month and $28$ dollars after $3$. Which plan's cost rises faster?",
    "方案 A 用 $x$ 个月花费 $y = 3x + 10$ 美元。方案 B 的表格显示 $1$ 个月后 $16$ 美元，$3$ 个月后 $28$ 美元。哪种方案的花费增加得更快？",
  ],
  [
    "Plan B rises $\\frac{28 - 16}{3 - 1} = 6$ dollars a month, faster than A's $3$.",
    "方案 B 每月增加 $\\frac{28 - 16}{3 - 1} = 6$ 美元，比 A 的 $3$ 美元快。",
  ],
  [
    "compare rates of change and initial values of functions given in different ways, and find when two of them are equal.",
    "比较以不同方式给出的函数的变化率和初始值，并求出两个函数何时相等。",
  ],
);

/** grade8FunctionTopics lists the 8th grade topics on functions. */
export const grade8FunctionTopics: readonly TopicDef[] = [
  describingTheFunctionalRelationshipBetweenTwoQuantitiesFromAGraph,
  linearFunctionsVersusNonlinearFunctions,
  interpretingRateOfChangeAndInitialValueInContext,
  comparingPropertiesOfTwoFunctionsRepresentedDifferently,
];

/** theFastestPartOfATrip finds the hour with the largest change in a table of distances; it is the third point of describing-the-functional-relationship-between-two-quantities-from-a-graph, to take the place of the one in the deeper files. */
export const theFastestPartOfATrip = lesson(
  "the-fastest-part-of-a-trip",
  ["The fastest part of a trip", "行程中最快的一段"],
  [
    [
      "On a graph of distance against time, a steeper part means more distance in the same time. In a table with equal time steps, the largest change between neighbors is the fastest part.",
      "在路程与时间的图像上，越陡表示相同时间走得越远。在时间间隔相同的表中，相邻变化最大的一段最快。",
    ],
    [
      "The changes add back to the whole trip: for distances $0, 2, 6, 8$ they are $2, 4, 2$, and $2 + 4 + 2 = 8$.",
      "各段变化加起来就是整个行程：对于距离 $0, 2, 6, 8$，变化是 $2, 4, 2$，$2 + 4 + 2 = 8$。",
    ],
    [
      "Do not pick the hour that ends farthest from home; pick the largest change.",
      "不要选结束时离家最远的那一小时；要选变化最大的一小时。",
    ],
  ],
  (rng) => {
    const steps4 = rng.sample([2, 4, 6, 9, 11, 13, 15, 18], 4) as number[];
    let run = rng.int(0, 9);
    const start = run;
    const totals = [run, ...steps4.map((s) => (run += s))];
    const best = steps4.indexOf(Math.max(...steps4));
    const hour = (i: number): Pair => [`Hour ${i + 1}`, `第 ${i + 1} 小时`];
    return chosen(
      rng,
      [
        `A cyclist's distance from home, in km, at the start of each hour and at the end was ${totals.join(", ")}. In which hour was the cyclist fastest?`,
        `骑车人每小时开始时和最后离家的距离（千米）依次是 ${totals.join("、")}。哪一小时骑得最快？`,
      ],
      hour(best),
      [0, 1, 2, 3]
        .filter((i) => i !== best)
        .map(
          (i) =>
            [
              hour(i),
              `In that hour the cyclist went $${steps4[i]}$ km, less than the $${steps4[best]}$ km of hour ${best + 1}.`,
              `那一小时骑了 $${steps4[i]}$ 千米，少于第 ${best + 1} 小时的 $${steps4[best]}$ 千米。`,
            ] as const,
        ),
      [
        [
          ["Find each hour's change", "求每小时的变化"],
          ["Subtract each distance from the next:", "用后一个距离减去前一个："],
          steps4.map((s, i) => `${totals[i + 1]} - ${totals[i]} = ${s}`),
        ],
        [
          ["Pick the largest", "选出最大的"],
          [
            `The largest change is $${steps4[best]}$ km, in hour ${best + 1}.`,
            `最大的变化是 $${steps4[best]}$ 千米，在第 ${best + 1} 小时。`,
          ],
        ],
      ],
      [
        `The changes add back to the whole trip: $${steps4.join(" + ")} = ${run - start}$, which is $${run} - ${start}$. So they were read correctly, and $${steps4[best]}$ is the largest of them.`,
        `各段变化加起来就是整个行程：$${steps4.join(" + ")} = ${run - start}$，正是 $${run} - ${start}$。所以变化都读对了，其中最大的是 $${steps4[best]}$。`,
      ],
    );
  },
  drawn(gradeDrawings5["describing-the-functional-relationship-between-two-quantities-from-a-graph#the-fastest-part-of-a-trip"]),
);

/** theMissingValueInALinearTable fills in a missing output of a linear function from a table with uneven input steps; it is the third point of linear-functions-versus-nonlinear-functions, to take the place of the one in the deeper files. */
export const theMissingValueInALinearTable = lesson(
  "the-missing-value-in-a-linear-table",
  ["The missing value in a linear table", "线性表中缺失的值"],
  [
    [
      "A linear function changes by the same amount for each step of $1$. A table may skip inputs, so divide the output change by the input change first, and then step to the missing value. For $x = 1, 3, 4$ and $y = 5, 11, \\square$: $(11 - 5) \\div 2 = 3$ per step, so the box is $11 + 3 = 14$.",
      "线性函数每增加 $1$，变化量相同。表格可能跳过输入，所以先用输出变化除以输入变化，再走到缺失的值。对于 $x = 1, 3, 4$ 和 $y = 5, 11, \\square$：每步 $(11 - 5) \\div 2 = 3$，所以方框里是 $11 + 3 = 14$。",
    ],
    [
      "Write the rule: $y = 3x + 2$ gives $5$ at $x = 1$, $11$ at $x = 3$ and $14$ at $x = 4$.",
      "写出规律：$y = 3x + 2$ 在 $x = 1$ 时得 $5$，$x = 3$ 时得 $11$，$x = 4$ 时得 $14$。",
    ],
    [
      "The inputs may not go up by $1$: adding the whole change $6$ again gives the wrong $17$.",
      "输入不一定每次增加 $1$：再加一次整个变化量 $6$ 会得到错误的 $17$。",
    ],
  ],
  (rng) => {
    const m = rng.int(-9, 9) || 3;
    const b = rng.int(-9, 12);
    const x0 = rng.int(0, 3);
    const x1 = x0 + rng.int(2, 3);
    const x2 = x1 + rng.int(1, 3);
    const f = (x: number) => m * x + b;
    const table = `\\begin{array}{|c|c|c|c|}\\hline x & ${x0} & ${x1} & ${x2} \\\\ \\hline y & ${f(x0)} & ${f(x1)} & \\square \\\\ \\hline\\end{array}`;
    return valued(
      [
        `The table comes from a linear function. What value goes in the box? $$${table}$$`,
        `表格来自一个线性函数。方框里是什么值？$$${table}$$`,
      ],
      f(x2),
      [
        [
          ["Find the change per step", "求每步的变化"],
          [`$x$ goes up by $${x1 - x0}$ while $y$ changes by $${f(x1) - f(x0)}$:`, `$x$ 增加 $${x1 - x0}$，$y$ 变化 $${f(x1) - f(x0)}$：`],
          [`${f(x1) - f(x0)} \\div ${x1 - x0} = ${m}`],
        ],
        [
          ["Step to the missing value", "走到缺失的值"],
          [
            `From $x = ${x1}$ to $x = ${x2}$ is $${x2 - x1}$ step${x2 - x1 === 1 ? "" : "s"}:`,
            `从 $x = ${x1}$ 到 $x = ${x2}$ 是 $${x2 - x1}$ 步：`,
          ],
          [`${f(x1)} + ${x2 - x1} \\cdot ${paren(m)} = ${f(x2)}`],
        ],
      ],
      [
        `Write the rule instead: $y = ${linear(m, b)}$ gives $${f(x0)}$ at $x = ${x0}$ and $${f(x1)}$ at $x = ${x1}$, and at $x = ${x2}$ it gives $${f(x2)}$.`,
        `改为写出规律：$y = ${linear(m, b)}$ 在 $x = ${x0}$ 时得 $${f(x0)}$，在 $x = ${x1}$ 时得 $${f(x1)}$，在 $x = ${x2}$ 时得 $${f(x2)}$。`,
      ],
      [
        [
          f(x1) + (f(x1) - f(x0)),
          "That adds the whole change again, as if the inputs went up by the same amount.",
          "这是又加了一次整个变化量，好像输入增加的量相同。",
        ],
        [f(x1) + x2 - x1, "That adds the change in $x$, not the change in $y$.", "这是加了 $x$ 的变化量，而不是 $y$ 的变化量。"],
        [f(x2) + m, "That takes one step too many.", "这是多走了一步。"],
      ],
    );
  },
  tableFigure(
    ["y"],
    ["x = 1", "x = 3", "x = 4"],
    [["5", "11", "14"]],
    [
      "A table with x = 1, 3, 4 and y = 5, 11, 14: the 6 from x = 1 to 3 is 3 per step, so one more step adds 3.",
      "一张表：x = 1、3、4，y = 5、11、14：从 x = 1 到 3 变化 6，每步 3，所以再走一步加 3。",
    ],
  ),
);
