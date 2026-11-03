import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { linear, num, type PlaneMark, plane, Q } from "@ga/subject-math";

import { article, choiceProblem, numberProblem, pointLatex, steps, yesNo } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

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

/** describingTheFunctionalRelationshipBetweenTwoQuantitiesFromAGraph describes a relationship qualitatively from its graph. */
export const describingTheFunctionalRelationshipBetweenTwoQuantitiesFromAGraph = topic(
  "describing-the-functional-relationship-between-two-quantities-from-a-graph",
  t("Describing the Functional Relationship Between Two Quantities From a Graph", "根据图像描述两个量之间的函数关系"),
  t(
    "A graph shows how one quantity changes as another does. Where the graph rises the quantity increases, where it is horizontal the quantity stays the same, and where it falls the quantity decreases; the steeper the graph, the faster the change.",
    "图像显示一个量如何随另一个量变化。图像上升的部分表示这个量在增加，水平的部分表示保持不变，下降的部分表示在减少；图像越陡，变化越快。",
  ),
  ["increasing-and-decreasing"],
  ["8.F.B.5"],
  [
    {
      id: "reading-the-intervals",
      title: t("Finding when the quantity changes in a given way", "找出量以某种方式变化的时段"),
      explanation: t(
        "Read the graph piece by piece from left to right. A piece that rises means the quantity increases during that time, a horizontal piece means it stays the same, and a piece that falls means it decreases. Of two rising pieces, the steeper one is the faster increase, even if the other one ends higher.",
        "从左到右逐段读图。上升的线段表示这段时间里量在增加，水平的线段表示量保持不变，下降的线段表示量在减少。两段上升的线段中，更陡的那段增加得更快，即使另一段结束时的位置更高。",
      ),
      generate(rng) {
        const q = rng.pick(questions);
        const story = rng.pick(stories);
        // Four pieces, exactly one of which has the property asked about.
        const pool: Behavior[] = ["up-fast", "up-slow", "level", "down-fast", "down-slow"];
        const bs = rng.shuffle(pool).slice(0, 4);
        if (bs.filter(q.has).length !== 1) return this.generate(rng);
        const ps = pieces(rng, bs);
        if (!ps) return this.generate(rng);
        const hit = ps.find((p) => q.has(p.behavior))!;
        return pickChoice(
          rng,
          t(
            `The graph shows ${story.quantity.en}, in ${story.unit.en}, $t$ hours after noon. During which time does it ${q.ask.en}?`,
            `图像表示中午 $t$ 小时后${story.quantity["zh-CN"]}（${story.unit["zh-CN"]}）。在哪段时间里它${q.ask["zh-CN"]}？`,
          ),
          interval(hit.x0, hit.x1),
          ps.filter((p) => p !== hit).map((p) => interval(p.x0, p.x1)),
          t(
            `From $t = ${hit.x0}$ to $t = ${hit.x1}$ ${q.why.en}: the value goes from $${hit.y0}$ to $${hit.y1}$.`,
            `从 $t = ${hit.x0}$ 到 $t = ${hit.x1}$，${q.why["zh-CN"]}：值从 $${hit.y0}$ 变为 $${hit.y1}$。`,
          ),
          pieceGraph(ps, story),
        );
      },
    },
    {
      id: "describing-the-whole-graph",
      title: t("Describing the whole graph", "描述整个图像"),
      explanation: t(
        "A graph that rises steeply, then is horizontal, then falls gently describes a quantity that increases quickly, then stays the same, and then decreases slowly. The order matters, and so does the steepness: a gentle fall is a slow decrease.",
        "图像先陡峭上升，再保持水平，然后缓缓下降，描述的是一个量先迅速增加，然后保持不变，最后缓慢减少。顺序很重要，陡峭程度也很重要：缓缓下降表示缓慢减少。",
      ),
      generate(rng) {
        const story = rng.pick(stories);
        const pool: Behavior[] = ["up-fast", "up-slow", "level", "down-fast", "down-slow"];
        const bs = rng.shuffle(pool).slice(0, 3);
        const ps = pieces(rng, bs);
        if (!ps) return this.generate(rng);
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
        const wrong = [[...bs].reverse(), bs.map((b, k) => (k === i ? speed[b] : b)), bs.map((b, k) => (k === j ? flip[b] : b))];
        return pickChoice(
          rng,
          t(
            `The graph shows ${story.quantity.en}, in ${story.unit.en}, $t$ hours after noon. Which description matches the graph?`,
            `图像表示中午 $t$ 小时后${story.quantity["zh-CN"]}（${story.unit["zh-CN"]}）。哪个描述与图像相符？`,
          ),
          describing(bs),
          wrong.map(describing),
          t(
            `Read the pieces from left to right: ${ps.map((p) => `from $t = ${p.x0}$ to $t = ${p.x1}$ it ${behaviorWords[p.behavior].en}`).join("; ")}.`,
            `从左到右读各段：${ps.map((p) => `从 $t = ${p.x0}$ 到 $t = ${p.x1}$，${behaviorWords[p.behavior]["zh-CN"]}`).join("；")}。`,
          ),
          pieceGraph(ps, story),
        );
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Linear and nonlinear functions

/** Form is an equation in x and y with the reason it is or is not linear. */
type Form = readonly [string, Text];

/** linearForms are linear functions written in ways that hide the form y = mx + b, each with that form. */
const linearForms = (rng: Rng): Form[] => {
  const [m, b, c] = [rng.int(2, 6), rng.nonZero(-7, 7), rng.int(2, 5)];
  const k = Math.abs(b) + 3;
  const as = (e: string): Text => same(`$${e}$`);
  return [
    [`y = ${m}(${linear(1, b)})`, as(`y = ${linear(m, m * b)}`)],
    [`y = \\frac{${linear(1, b)}}{${c}}`, as(`y = ${linear(Q.of(1, c), Q.of(b, c))}`)],
    [`${m}x + y = ${k}`, as(`y = ${linear(-m, k)}`)],
    [`y = ${k} - \\frac{x}{${c}}`, as(`y = ${linear(Q.of(-1, c), k)}`)],
  ];
};

/** nonlinearForms are nonlinear functions, some of which look linear at first sight, each with the reason. */
const nonlinearForms = (rng: Rng): Form[] => {
  const [m, b, c] = [rng.int(2, 6), rng.int(1, 7), rng.int(2, 5)];
  return [
    [`y = ${m}x^{2} + ${b}`, t("$x$ is squared", "$x$ 被平方")],
    [`y = \\frac{${c}}{x}`, t("$x$ is in the denominator", "$x$ 在分母中")],
    [`y = x(x + ${b})`, t(`it is $y = x^{2} + ${b}x$, with $x$ squared`, `它就是 $y = x^{2} + ${b}x$，$x$ 被平方`)],
    [`y = ${c}^{x}`, t("$x$ is in the exponent", "$x$ 在指数上")],
    [`y = ${m}\\sqrt{x}`, t("$x$ is under a square root", "$x$ 在根号下")],
    [`y = \\frac{${b}}{x} + ${m}`, t("$x$ is in the denominator", "$x$ 在分母中")],
  ];
};

/** linearFunctionsVersusNonlinearFunctions tells linear functions from nonlinear ones by their equations and tables. */
export const linearFunctionsVersusNonlinearFunctions = topic(
  "linear-functions-versus-nonlinear-functions",
  t("Linear Functions Versus Nonlinear Functions", "一次函数与非线性函数"),
  t(
    "A linear function can be written as y = mx + b: its graph is a straight line, and equal steps in x always change y by the same amount. A function whose equation has x squared, x in a denominator, under a root or in an exponent is nonlinear.",
    "一次函数可以写成 y = mx + b 的形式：它的图像是直线，x 每增加相同的量，y 的变化量总是相同的。方程中含有 x 的平方、分母含 x、根号下含 x 或指数含 x 的函数是非线性函数。",
  ),
  ["graphs-of-functions", "slope-intercept-form"],
  ["8.F.A.3"],
  [
    {
      id: "linear-from-the-equation",
      title: t("Deciding from the equation", "由方程判断"),
      explanation: t(
        "$y = 3(x - 2)$ is linear: it is $y = 3x - 6$. So are $y = \\frac{x + 1}{2} = \\frac{1}{2}x + \\frac{1}{2}$ and $4x + y = 9$, which is $y = -4x + 9$. But $y = x(x + 1) = x^{2} + x$ is not, and neither is $y = \\frac{2}{x}$: rewrite before deciding.",
        "$y = 3(x - 2)$ 是一次函数：它就是 $y = 3x - 6$。$y = \\frac{x + 1}{2} = \\frac{1}{2}x + \\frac{1}{2}$ 和 $4x + y = 9$（即 $y = -4x + 9$）也是。但 $y = x(x + 1) = x^{2} + x$ 不是，$y = \\frac{2}{x}$ 也不是：先变形再判断。",
      ),
      generate(rng) {
        const askLinear = rng.bool();
        const lin = rng.shuffle(linearForms(rng));
        const non = rng.shuffle(nonlinearForms(rng));
        const [correct, others] = askLinear ? [lin[0]!, non.slice(0, 3)] : [non[0]!, lin.slice(0, 3)];
        const listed = rng.shuffle([correct, ...others]).map(([e]) => `$${e}$`);
        const [en, zh] = [`${listed.slice(0, 3).join(", ")} or ${listed[3]}`, `${listed.slice(0, 3).join("、")} 还是 ${listed[3]}`];
        const [eq, why] = correct;
        return pickChoice(
          rng,
          askLinear
            ? t(`Which equation defines a linear function: ${en}?`, `哪个方程定义的是一次函数：${zh}？`)
            : t(`Which equation does not define a linear function: ${en}?`, `哪个方程定义的不是一次函数：${zh}？`),
          mathText(eq),
          others.map(([e]) => mathText(e)),
          askLinear
            ? t(
                `$${eq}$ can be rewritten as ${why.en}, which has the form $y = mx + b$, so it is linear. In the others: ${others.map(([e, w]) => `in $${e}$, ${w.en}`).join("; ")}.`,
                `$${eq}$ 可以化成 ${why["zh-CN"]}，具有 $y = mx + b$ 的形式，所以是一次函数。其他方程中：${others.map(([e, w]) => `在 $${e}$ 中，${w["zh-CN"]}`).join("；")}。`,
              )
            : t(
                `In $${eq}$, ${why.en}, so it is not linear. Each of the others can be rewritten in the form $y = mx + b$.`,
                `在 $${eq}$ 中，${why["zh-CN"]}，所以它不是一次函数。其他方程都可以化成 $y = mx + b$ 的形式。`,
              ),
        );
      },
    },
    {
      id: "linear-from-a-table",
      title: t("Deciding from a table", "由表格判断"),
      explanation: t(
        "When $x$ goes up in equal steps, a linear function changes $y$ by the same amount every time. For $x = 0, 1, 2, 3$ and $y = 5, 8, 11, 14$ the differences are all $3$: linear. For $y = 1, 2, 4, 8$ the differences are $1, 2, 4$: nonlinear. Check every difference: a table can start like a line and then bend.",
        "当 $x$ 以相等的步长增加时，一次函数的 $y$ 每次变化的量都相同。对于 $x = 0, 1, 2, 3$ 和 $y = 5, 8, 11, 14$，差都是 $3$：是一次函数。对于 $y = 1, 2, 4, 8$，差是 $1, 2, 4$：不是一次函数。要检查每一个差：表格可能开头像直线，后面却弯曲了。",
      ),
      generate(rng) {
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
        if (kind === "square" && new Set(diffs).size === 1) return this.generate(rng);
        const isLinear = new Set(diffs).size === 1;
        const row = (name: string, vs: number[]) => `${name} & ${vs.map((v) => num(v)).join(" & ")}`;
        const table = `\\begin{array}{c|cccc} ${row("x", xs)} \\\\ \\hline ${row("y", ys)} \\end{array}`;
        return choiceProblem({
          prompt: t(`Could this table come from a linear function?${steps(table)}`, `这个表格可能来自一次函数吗？${steps(table)}`),
          options: yesNo,
          correct: isLinear ? 0 : 1,
          solution: isLinear
            ? t(
                `The $x$-values go up by $${step}$ each time, and the $y$-values change by $${diffs[0]}$ every time, so the table fits a linear function.`,
                `$x$ 每次增加 $${step}$，$y$ 每次都变化 $${diffs[0]}$，所以表格符合一次函数。`,
              )
            : t(
                `The $x$-values go up by $${step}$ each time, but the changes in $y$ are $${diffs.join(", ")}$, which are not all equal, so the function is not linear.`,
                `$x$ 每次增加 $${step}$，但 $y$ 的变化量是 $${diffs.join(", ")}$，并不都相等，所以不是一次函数。`,
              ),
        });
      },
    },
  ],
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

/** interpretingRateOfChangeAndInitialValueInContext finds the rate and the starting value of a linear situation. */
export const interpretingRateOfChangeAndInitialValueInContext = topic(
  "interpreting-rate-of-change-and-initial-value-in-context",
  t("Interpreting Rate of Change and Initial Value in Context", "在情境中理解变化率和初始值"),
  t(
    "For a quantity that changes at a constant rate, the rate of change is the change in the quantity divided by the change in time, with units such as dollars per week; it is negative when the quantity decreases. The initial value is the quantity at time 0.",
    "对于以恒定速率变化的量，变化率等于这个量的变化量除以时间的变化量，单位如“美元每周”；量减少时变化率为负。初始值是时间为 0 时这个量的值。",
  ),
  ["modeling-with-linear-functions"],
  ["8.F.B.4"],
  [
    {
      id: "the-rate-of-change-from-two-readings",
      title: t("The rate of change from two readings", "由两次读数求变化率"),
      explanation: t(
        "A candle is $21$ cm tall after $2$ hours and $15$ cm tall after $5$ hours. The rate of change is $\\frac{15 - 21}{5 - 2} = \\frac{-6}{3} = -2$ centimeters per hour. The sign matters: the candle gets shorter, so the rate is negative.",
        "一支蜡烛点燃 $2$ 小时后高 $21$ 厘米，$5$ 小时后高 $15$ 厘米。变化率为 $\\frac{15 - 21}{5 - 2} = \\frac{-6}{3} = -2$ 厘米每小时。符号很重要：蜡烛越来越短，所以变化率是负数。",
      ),
      generate(rng) {
        const { s, rate, x1, x2, y1, y2, given } = twoReadings(rng);
        return numberProblem({
          prompt: t(
            `${given.en} What is the rate of change, in ${s.rate.en}?`,
            `${given["zh-CN"]}变化率是多少（单位：${s.rate["zh-CN"]}）？`,
          ),
          answer: rate,
          form: "integer",
          // The sign dropped, the change in the quantity alone, and the quotient upside down.
          wrong: [-rate, y2 - y1, Q.of(x2 - x1, y2 - y1)],
          solution: t(
            `Divide the change in the quantity by the change in ${s.input.en}:${steps(`\\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${x2 - x1 === 1 ? "" : `\\frac{${y2 - y1}}{${x2 - x1}} = `}${rate}`)}The rate of change is $${rate}$ ${s.rate.en}.`,
            `用量的变化量除以${s.input["zh-CN"]}的变化量：${steps(`\\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${x2 - x1 === 1 ? "" : `\\frac{${y2 - y1}}{${x2 - x1}} = `}${rate}`)}变化率是 $${rate}$ ${s.rate["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "the-initial-value-from-two-readings",
      title: t("The initial value from two readings", "由两次读数求初始值"),
      explanation: t(
        "For the same candle, the rate is $-2$ cm per hour, so $2$ hours before the first reading it was $2 \\cdot 2 = 4$ cm taller: $21 + 4 = 25$ cm when it was lit. Going back one hour only, or adding $-4$ instead of subtracting it, are the usual slips.",
        "还是这支蜡烛，变化率是 $-2$ 厘米每小时，所以在第一次读数前 $2$ 小时，它高出 $2 \\cdot 2 = 4$ 厘米：刚点燃时高 $21 + 4 = 25$ 厘米。只往回推一小时，或者加上 $-4$ 而不是减去它，都是常见的错误。",
      ),
      generate(rng) {
        const { s, rate, start, x1, x2, y1, y2, given } = twoReadings(rng);
        if (x1 === 1) return this.generate(rng);
        return numberProblem({
          prompt: t(`${given.en} ${s.start.en}`, `${given["zh-CN"]}${s.start["zh-CN"]}`),
          answer: start,
          form: "integer",
          // Going back one step only, the rate applied the wrong way, and the rate itself.
          wrong: [y1 - rate, y1 + rate * x1, rate],
          solution: t(
            `The rate of change is $\\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${rate}$ ${s.rate.en}. Work back from the first reading to ${s.input.en} $0$:${steps(`${y1} - ${x1} \\cdot ${rate < 0 ? `(${rate})` : rate} = ${start}`)}`,
            `变化率为 $\\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${rate}$ ${s.rate["zh-CN"]}。从第一次读数倒推到${s.input["zh-CN"]}为 $0$：${steps(`${y1} - ${x1} \\cdot ${rate < 0 ? `(${rate})` : rate} = ${start}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Comparing functions

/** tableOf writes a table of values of y = mx + b at the given inputs. */
const tableOf = (m: number, b: number, xs: readonly number[]) =>
  `\\begin{array}{c|ccc} x & ${xs.join(" & ")} \\\\ \\hline y & ${xs.map((x) => num(m * x + b)).join(" & ")} \\end{array}`;

/** comparingPropertiesOfTwoFunctionsRepresentedDifferently compares rates of change and initial values across representations. */
export const comparingPropertiesOfTwoFunctionsRepresentedDifferently = topic(
  "comparing-properties-of-two-functions-represented-differently",
  t("Comparing Properties of Two Functions Represented Differently", "比较以不同方式表示的两个函数的性质"),
  t(
    "To compare two linear functions given in different ways, such as an equation and a table, find the same property of each: the rate of change from the coefficient or from the differences, and the initial value from the constant term or by working back to x = 0.",
    "比较以不同方式（如方程和表格）给出的两个一次函数时，先分别求出各自的同一性质：变化率可由系数或差求得，初始值可由常数项或倒推到 x = 0 求得。",
  ),
  ["interpreting-rate-of-change-and-initial-value-in-context", "representations-of-functions"],
  ["8.F.A.2"],
  [
    {
      id: "comparing-rates-of-change",
      title: t("Comparing rates of change", "比较变化率"),
      explanation: t(
        "Function A is $y = -2x + 7$; function B has the table $x = 1, 3, 5$, $y = 4, -8, -20$. B's rate of change is $\\frac{-8 - 4}{3 - 1} = -6$. Since $-2 > -6$, A has the greater rate of change, although B's rate is larger in size: B decreases faster.",
        "函数 A 是 $y = -2x + 7$；函数 B 的表格为 $x = 1, 3, 5$，$y = 4, -8, -20$。B 的变化率为 $\\frac{-8 - 4}{3 - 1} = -6$。因为 $-2 > -6$，所以 A 的变化率更大，尽管 B 的变化率绝对值更大：B 减少得更快。",
      ),
      generate(rng) {
        // Half the time both rates are negative, so that comparing their sizes gives the wrong answer.
        const negative = rng.bool();
        const [ma, mb] = rng.sample([1, 2, 3, 4, 5, 6], 2).map((m) => (negative || rng.bool() ? -m : m)) as [number, number];
        const [ba, bb] = [rng.int(-9, 9), rng.int(-9, 9)];
        const step = rng.int(1, 3);
        const x0 = rng.int(-1, 2);
        const xs = [x0, x0 + step, x0 + 2 * step];
        const tableFirst = rng.bool();
        const [eqName, tableName] = tableFirst ? ["B", "A"] : ["A", "B"];
        const [mEq, mTable] = tableFirst ? [mb, ma] : [ma, mb];
        const [bEq, bTable] = tableFirst ? [bb, ba] : [ba, bb];
        const options = [t("Function A", "函数 A"), t("Function B", "函数 B")];
        const greaterIsA = ma > mb;
        const [y0, y1] = [mTable * xs[0]! + bTable, mTable * xs[1]! + bTable];
        return choiceProblem({
          prompt: t(
            `Function ${eqName} is $y = ${linear(mEq, bEq)}$. Function ${tableName} is linear, with this table of values:${steps(tableOf(mTable, bTable, xs))}Which function has the greater rate of change?`,
            `函数 ${eqName} 是 $y = ${linear(mEq, bEq)}$。函数 ${tableName} 是一次函数，其数值表如下：${steps(tableOf(mTable, bTable, xs))}哪个函数的变化率更大？`,
          ),
          options,
          correct: greaterIsA ? 0 : 1,
          solution: t(
            `The rate of change of function ${eqName} is the coefficient of $x$, $${mEq}$. For function ${tableName}, $\\frac{${num(y1)} - ${y0 < 0 ? `(${y0})` : y0}}{${step}} = ${mTable}$. Since $${Math.max(ma, mb)} > ${Math.min(ma, mb)}$, function ${greaterIsA ? "A" : "B"} has the greater rate of change.`,
            `函数 ${eqName} 的变化率是 $x$ 的系数 $${mEq}$。函数 ${tableName} 的变化率为 $\\frac{${num(y1)} - ${y0 < 0 ? `(${y0})` : y0}}{${step}} = ${mTable}$。因为 $${Math.max(ma, mb)} > ${Math.min(ma, mb)}$，所以函数 ${greaterIsA ? "A" : "B"} 的变化率更大。`,
          ),
        });
      },
    },
    {
      id: "comparing-initial-values",
      title: t("Comparing initial values", "比较初始值"),
      explanation: t(
        "Function A is $y = 3x - 4$, so its initial value is $-4$. Function B is linear and its graph passes through $(2, 9)$ and $(5, 15)$: its rate of change is $\\frac{15 - 9}{5 - 2} = 2$, so at $x = 0$ it is $9 - 2 \\cdot 2 = 5$. B's initial value is greater by $5 - (-4) = 9$.",
        "函数 A 是 $y = 3x - 4$，所以它的初始值是 $-4$。函数 B 是一次函数，图像经过 $(2, 9)$ 和 $(5, 15)$：它的变化率是 $\\frac{15 - 9}{5 - 2} = 2$，所以当 $x = 0$ 时，$y = 9 - 2 \\cdot 2 = 5$。B 的初始值比 A 的大 $5 - (-4) = 9$。",
      ),
      generate(rng) {
        const ma = rng.nonZero(-5, 5);
        const mb = rng.nonZero(-5, 5);
        const ba = rng.int(-9, 6);
        const bb = ba + rng.int(1, 9);
        const [x1, x2] = rng.sample([1, 2, 3, 4, 5], 2).sort((a, b) => a - b) as [number, number];
        const [y1, y2] = [mb * x1 + bb, mb * x2 + bb];
        return numberProblem({
          prompt: t(
            `Function A is $y = ${linear(ma, ba)}$. Function B is linear, and its graph passes through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$. The initial value of B is greater than that of A. By how much?`,
            `函数 A 是 $y = ${linear(ma, ba)}$。函数 B 是一次函数，图像经过 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$。B 的初始值比 A 的大。大多少？`,
          ),
          answer: bb - ba,
          form: "integer",
          // Using B's first y-value as its initial value, a sign slip, and B's initial value alone.
          wrong: [y1 - ba, bb + ba, bb],
          solution: t(
            `The initial value of A is its constant term, $${ba}$. For B, the rate of change is $\\frac{${num(y2)} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1}} = ${mb}$, so going back to $x = 0$:${steps(`${num(y1)} - ${x1} \\cdot ${mb < 0 ? `(${mb})` : mb} = ${bb}`, `${bb} - ${ba < 0 ? `(${ba})` : ba} = ${bb - ba}`)}`,
            `A 的初始值是常数项 $${ba}$。B 的变化率为 $\\frac{${num(y2)} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1}} = ${mb}$，所以倒推到 $x = 0$：${steps(`${num(y1)} - ${x1} \\cdot ${mb < 0 ? `(${mb})` : mb} = ${bb}`, `${bb} - ${ba < 0 ? `(${ba})` : ba} = ${bb - ba}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade8FunctionTopics lists the 8th grade topics on functions. */
export const grade8FunctionTopics: readonly TopicDef[] = [
  describingTheFunctionalRelationshipBetweenTwoQuantitiesFromAGraph,
  linearFunctionsVersusNonlinearFunctions,
  interpretingRateOfChangeAndInitialValueInContext,
  comparingPropertiesOfTwoFunctionsRepresentedDifferently,
];
