import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dec, type Interval, type PlaneMark, plane, poly, Q, union } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { explainedChoice, intervalProblem, numberProblem, pointProblem, solutionsProblem, steps, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { bare, fac, graphAltOf, lim, range, sqrtLatex, table } from "./calculus-common.ts";

// Calculus I unit 3: Continuity, modules 3.7 (Continuity) and 3.8 (Removing
// Discontinuities).

const view = { xMin: -6, xMax: 6, yMin: -7, yMax: 7 };

/** Step is one labelled step of a solution: its title in both languages, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** fmt writes a value rounded to three decimal places, without trailing zeros. */
const fmt = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** paren writes a number in parentheses when it is negative, for use after an operation sign. */
const paren = (n: number) => (n < 0 ? `(${n})` : String(n));

/** nearX are the x-values a − 0.1, a − 0.01, a + 0.01 and a + 0.1. */
const nearX = (a: number) => [-0.1, -0.01, 0.01, 0.1].map((d) => Math.round((a + d) * 1000) / 1000);

/** valuesTable tabulates f at the given x-values to three decimal places; labels name the x-values when they are not written as decimals. */
function valuesTable(xs: readonly number[], f: (x: number) => number, name = "f(x)", labels: readonly string[] = xs.map(String)): string {
  return table(["$x$", ...labels.map((x) => `$${x}$`)], [`$${name}$`, ...xs.map((x) => `$${fmt(f(x))}$`)]);
}

/** nearTable tabulates f just left of a (with left) and just right of a (with right), to three decimal places. */
function nearTable(a: number, left: (x: number) => number, right: (x: number) => number = left, name = "f(x)"): string {
  return valuesTable(nearX(a), (x) => (x < a ? left(x) : right(x)), name);
}

/** yes and no are the two answers of a yes-or-no question. */
const [yes, no] = yesNo as readonly [Text, Text];

/** yesNoProblem asks a yes-or-no question and says what is wrong with the other answer. */
const yesNoProblem = (rng: Rng, prompt: Text, holds: boolean, solution: Text, whyNot: Text): Problem =>
  explainedChoice(rng, { prompt, correct: holds ? yes : no, wrong: [{ option: holds ? no : yes, why: whyNot }], solution });

/** Piece is one formula of a piecewise function. */
interface Piece {
  readonly latex: string;
  readonly at: (x: number) => number;
}

/** linearPiece is a line mx + b with small coefficients. */
function linearPiece(rng: Rng): Piece {
  const m = rng.nonZero(-4, 4);
  const b = rng.int(-6, 6);
  return { latex: poly([m, "x"], [b, ""]), at: (x) => m * x + b };
}

/** quadraticPiece is ±x² + bx + c with small coefficients. */
function quadraticPiece(rng: Rng): Piece {
  const s = rng.sign();
  const b = rng.int(-4, 4);
  const c = rng.int(-6, 6);
  return { latex: poly([s, "x^{2}"], [b, "x"], [c, ""]), at: (x) => s * x * x + b * x + c };
}

/** anyPiece is a line or a parabola. */
const anyPiece = (rng: Rng) => (rng.bool() ? linearPiece(rng) : quadraticPiece(rng));

/** shifted is a line through (a, target), so that it meets another piece there. */
function shifted(rng: Rng, target: number, a: number): Piece {
  const m = rng.nonZero(-4, 4);
  const b = target - m * a;
  return { latex: poly([m, "x"], [b, ""]), at: (x) => m * x + b };
}

/** casesLatex writes a piecewise definition of f. */
const casesLatex = (pieces: readonly (readonly [string, string])[]) =>
  `f(x) = \\begin{cases} ${pieces.map(([e, c]) => `${e} & ${c}`).join(" \\\\ ")} \\end{cases}`;

/** atLatex writes a piece with x replaced by a value, as in "2(3) + 1". */
const atLatex = (p: Piece, a: number) => p.latex.replace(/x/g, `(${a})`);

/** Break describes f near x = a: left limit L, right limit R and value (undefined when f(a) is not defined). */
interface Break {
  readonly a: number;
  readonly L: number;
  readonly R: number;
  readonly value: number | undefined;
}

/** breakMarks draws the open and filled points of a break. */
function breakMarks(b: Break): PlaneMark[] {
  const marks: PlaneMark[] = [];
  if (b.value !== b.L) marks.push({ kind: "point", at: [b.a, b.L], open: true, accent: true });
  if (b.R !== b.L && b.value !== b.R) marks.push({ kind: "point", at: [b.a, b.R], open: true, accent: true });
  if (b.value !== undefined) marks.push({ kind: "point", at: [b.a, b.value], accent: true });
  return marks;
}

/** BreakKind is how f behaves at a: continuous, a hole, a hole with the point elsewhere, or a jump. */
type BreakKind = "continuous" | "hole" | "moved" | "jump";

/** makeBreak chooses limits and a value at a for the kind of break. */
function makeBreak(rng: Rng, a: number, kind: BreakKind): Break {
  const L = rng.int(-4, 4);
  const other = (not: readonly number[]) => rng.pick(range(-5, 5).filter((v) => !not.includes(v)));
  if (kind === "continuous") return { a, L, R: L, value: L };
  if (kind === "hole") return { a, L, R: L, value: undefined };
  if (kind === "moved") return { a, L, R: L, value: other([L]) };
  const R = other([L]);
  return { a, L, R, value: rng.pick([L, R, other([L, R]), undefined]) };
}

/** BreakDrawing is the graph of a break together with the two drawn pieces, so that heights can be read off them. */
interface BreakDrawing {
  readonly figure: Figure;
  readonly left: (x: number) => number;
  readonly right: (x: number) => number;
}

/** breakGraph draws f with a single break at x = a. */
function breakGraph(rng: Rng, b: Break): BreakDrawing {
  const slope = () => rng.pick([-1.5, -1, -0.5, 0.5, 1, 1.5]);
  const bend = () => rng.pick([0, 0, 0.2, -0.2]);
  const [m1, c1, m2, c2] = [slope(), bend(), slope(), bend()];
  const left = (x: number) => b.L + m1 * (x - b.a) + c1 * (x - b.a) ** 2;
  const right = (x: number) => b.R + m2 * (x - b.a) + c2 * (x - b.a) ** 2;
  const marks: PlaneMark[] = [
    { kind: "curve", f: left, to: b.a, accent: true },
    { kind: "curve", f: right, from: b.a, accent: true },
    ...breakMarks(b),
  ];
  return { figure: { svg: plane(view, marks), alt: graphAltOf(view, marks) }, left, right };
}

/** valueText says what f(a) is, or that it is not defined. */
const valueText = (b: Break) =>
  b.value === undefined
    ? t(`$f(${b.a})$ is not defined`, `$f(${b.a})$ 没有定义`)
    : t(`$f(${b.a}) = ${b.value}$`, `$f(${b.a}) = ${b.value}$`);

/** breakReason explains why f is or is not continuous at the break. */
function breakReason(b: Break): Text {
  const v = valueText(b);
  if (b.L !== b.R)
    return t(
      `The one-sided limits $${b.L}$ and $${b.R}$ differ, so the limit does not exist and $f$ is not continuous at $x = ${b.a}$.`,
      `单侧极限 $${b.L}$ 与 $${b.R}$ 不相等，所以极限不存在，$f$ 在 $x = ${b.a}$ 处不连续。`,
    );
  if (b.value === undefined)
    return t(
      `The limit is $${b.L}$, but ${v.en}, so $f$ is not continuous at $x = ${b.a}$.`,
      `极限是 $${b.L}$，但${v["zh-CN"]}，所以 $f$ 在 $x = ${b.a}$ 处不连续。`,
    );
  if (b.value !== b.L)
    return t(
      `The limit is $${b.L}$ but ${v.en}. The limit and the value differ, so $f$ is not continuous at $x = ${b.a}$.`,
      `极限是 $${b.L}$，而${v["zh-CN"]}。极限与函数值不相等，所以 $f$ 在 $x = ${b.a}$ 处不连续。`,
    );
  return t(
    `The limit $${b.L}$ equals $f(${b.a})$, so $f$ is continuous at $x = ${b.a}$.`,
    `极限 $${b.L}$ 等于 $f(${b.a})$，所以 $f$ 在 $x = ${b.a}$ 处连续。`,
  );
}

/** breakLook says what the values beside a break do, after a table of them. */
function breakLook(b: Break): Text {
  if (b.L !== b.R)
    return t(
      `The values on the left stay near $${b.L}$ and those on the right near $${b.R}$, so the pen must lift at $x = ${b.a}$.`,
      `左侧的值保持在 $${b.L}$ 附近，右侧的值保持在 $${b.R}$ 附近，所以画到 $x = ${b.a}$ 时必须提笔。`,
    );
  if (b.value === undefined)
    return t(
      `Both sides close in on $${b.L}$, but there is no point at $x = ${b.a}$ for them to land on.`,
      `两侧都逼近 $${b.L}$，但 $x = ${b.a}$ 处没有点可以落上去。`,
    );
  if (b.value !== b.L)
    return t(
      `Both sides close in on $${b.L}$, but the point sits at height $${b.value}$ instead.`,
      `两侧都逼近 $${b.L}$，但该点却在高度 $${b.value}$ 处。`,
    );
  return t(`Both sides close in on $${b.L}$, which is exactly $f(${b.a})$.`, `两侧都逼近 $${b.L}$，恰好就是 $f(${b.a})$。`);
}

/** breakWalk explains continuity at a drawn break in steps: the two sides, the point, then a table of heights read off the curve. */
function breakWalk(b: Break, d: BreakDrawing): Text {
  return walked(
    [
      [
        ["Read the two sides", "读出两侧"],
        t(
          `From the left the curve heads to height $${b.L}$, and from the right to height $${b.R}$:`,
          `从左侧看曲线趋向高度 $${b.L}$，从右侧看趋向高度 $${b.R}$：`,
        ),
        [`${lim(b.a, -1)} f(x) = ${b.L}`, `${lim(b.a, 1)} f(x) = ${b.R}`],
      ],
      [["Read the point", "读出该点"], t(`At $x = ${b.a}$, ${valueText(b).en}.`, `在 $x = ${b.a}$ 处，${valueText(b)["zh-CN"]}。`)],
      [["Compare", "比较"], breakReason(b)],
    ],
    t(
      `Read the heights of the drawn curve just beside $x = ${b.a}$:\n\n${nearTable(b.a, d.left, d.right)}\n\n${breakLook(b).en}`,
      `读出所画曲线在 $x = ${b.a}$ 两旁的高度：\n\n${nearTable(b.a, d.left, d.right)}\n\n${breakLook(b)["zh-CN"]}`,
    ),
  );
}

/** determiningContinuityFromGraphs reads continuity at a point from a graph. */
export const determiningContinuityFromGraphs: TopicDef = {
  id: "determining-continuity-from-graphs",
  title: t("Determining Continuity from Graphs", "由图像判断连续性"),
  summary: t(
    "Decide from a graph whether a function is continuous at a point, and find the points where it is not.",
    "由图像判断函数在一点处是否连续，并找出不连续的点。",
  ),
  prerequisites: ["finding-the-existence-of-a-limit-using-one-sided-limits"],
  encompasses: [{ topic: "finding-the-existence-of-a-limit-using-one-sided-limits", weight: 0.4 }],
  xp: 10,
  standards: [],
  intro: t(
    `A limit exists at $a$ when the two one-sided limits agree. For example, let $f(x) = x + 1$ for $x < 2$ and $f(x) = 5 - x$ for $x > 2$. From both sides the values head to $3$, so $\\lim_{x \\to 2} f(x) = 3$. Whether the graph is unbroken at $x = 2$ depends on one thing more: the point at $x = 2$ must sit at that height.

Check: $f(1.99) = 2.99$ and $f(2.01) = 2.99$, both close to $3$. If $f(2) = 3$, the pen passes through $(2, 3)$ without lifting; if $f(2) = 1$, it must lift.

In this lesson we read from a graph whether a function is continuous at a point, and find the points where it is not.`,
    `当两个单侧极限相等时，$a$ 处的极限存在。例如，设 $x < 2$ 时 $f(x) = x + 1$，$x > 2$ 时 $f(x) = 5 - x$。从两侧看函数值都趋向 $3$，所以 $\\lim_{x \\to 2} f(x) = 3$。图像在 $x = 2$ 处是否断开，还取决于另一件事：$x = 2$ 处的点必须正好在这个高度上。

检验：$f(1.99) = 2.99$，$f(2.01) = 2.99$，都接近 $3$。若 $f(2) = 3$，笔不用提起就能穿过 $(2, 3)$；若 $f(2) = 1$，就必须提笔。

这节课我们由图像判断函数在一点处是否连续，并找出不连续的点。`,
  ),
  knowledgePoints: [
    {
      id: "continuity-at-a-point-from-a-graph",
      figure: calculusDrawings1["determining-continuity-from-graphs#continuity-at-a-point-from-a-graph"],
      title: t("Continuity at a point from a graph", "由图像判断在一点处的连续性"),
      explanation: t(
        "A function is **continuous** at $x = a$ when its graph passes through $x = a$ without a break: it can be drawn there without lifting the pen.\n\nOn a graph, a hole, a filled point away from the curve, or a jump each mean that $f$ is **not** continuous at $a$. For example, if the curve heads to height $2$ from both sides of $x = 1$ and the filled point is $(1, 2)$, $f$ is continuous at $1$; if the filled point is $(1, 4)$ instead, it is not.\n\nCheck: in both cases the values just beside $x = 1$ are close to $2$. In the first case that is $f(1)$; in the second $f(1) = 4$, so the pen must jump to the point.\n\n> **Watch out.** A filled point does not by itself make $f$ continuous. It must sit at the height that the curve approaches from both sides.",
        "若函数图像在 $x = a$ 处没有断开，即画到这里时不用提笔，就说函数在 $x = a$ 处**连续**。\n\n在图像上，空心点、偏离曲线的实心点或跳跃，都表示 $f$ 在 $a$ 处**不**连续。例如，若曲线从 $x = 1$ 的两侧都趋向高度 $2$，且实心点是 $(1, 2)$，则 $f$ 在 $1$ 处连续；若实心点是 $(1, 4)$，则不连续。\n\n检验：两种情况下，紧靠 $x = 1$ 两旁的值都接近 $2$。第一种情况这正是 $f(1)$；第二种情况 $f(1) = 4$，笔必须跳到那个点上。\n\n> **注意。** 有实心点并不等于连续。实心点必须在曲线从两侧趋近的那个高度上。",
      ),
      generate(rng) {
        const kind = rng.pick<BreakKind>(["continuous", "continuous", "hole", "moved", "jump"]);
        const b = makeBreak(rng, rng.int(-3, 3), kind);
        const d = breakGraph(rng, b);
        const unbroken = t(`Yes, because the graph passes through $x = ${b.a}$ without a break`, `是，因为图像在 $x = ${b.a}$ 处没有断开`);
        const hole = t(
          `No, because the graph has a hole at $x = ${b.a}$ and no point there`,
          `否，因为图像在 $x = ${b.a}$ 处有一个空心点，且该处没有点`,
        );
        const moved = t(
          `No, because the filled point at $x = ${b.a}$ is away from the curve`,
          `否，因为 $x = ${b.a}$ 处的实心点偏离了曲线`,
        );
        const jump = t(`No, because the graph jumps to a new height at $x = ${b.a}$`, `否，因为图像在 $x = ${b.a}$ 处跳到另一个高度`);
        const what =
          kind === "hole"
            ? t("there is a hole and no point", "那里有一个空心点，没有实心点")
            : kind === "moved"
              ? t("the filled point is off the curve", "实心点偏离了曲线")
              : t("the two sides end at different heights", "两侧在不同的高度结束");
        const wrong = [
          {
            option: unbroken,
            why: t(`The graph does break at $x = ${b.a}$: ${what.en}.`, `图像在 $x = ${b.a}$ 处确实断开了：${what["zh-CN"]}。`),
          },
          {
            option: hole,
            why:
              b.value !== undefined
                ? t(
                    `There is a filled point at $x = ${b.a}$, at height $${b.value}$, so $f(${b.a})$ is defined.`,
                    `$x = ${b.a}$ 处有一个高度为 $${b.value}$ 的实心点，所以 $f(${b.a})$ 有定义。`,
                  )
                : t(
                    `The two sides end at different heights, $${b.L}$ and $${b.R}$, so this is more than one missing point.`,
                    `两侧在不同的高度 $${b.L}$ 和 $${b.R}$ 结束，所以这不只是缺了一个点。`,
                  ),
          },
          {
            option: moved,
            why:
              kind === "continuous"
                ? t(
                    `The filled point is at height $${b.L}$, exactly where the curve arrives from both sides.`,
                    `实心点在高度 $${b.L}$ 处，正是曲线从两侧到达的地方。`,
                  )
                : kind === "hole"
                  ? t(`There is no filled point at $x = ${b.a}$ at all, only a hole.`, `$x = ${b.a}$ 处根本没有实心点，只有一个空心点。`)
                  : t(
                      `The two sides themselves end at different heights, $${b.L}$ and $${b.R}$; moving one point would not join them.`,
                      `两侧本身就在不同的高度 $${b.L}$ 和 $${b.R}$ 结束；移动一个点也接不上。`,
                    ),
          },
          {
            option: jump,
            why: t(`Both sides arrive at the same height, $${b.L}$, so there is no jump.`, `两侧到达同一高度 $${b.L}$，所以没有跳跃。`),
          },
        ];
        return explainedChoice(rng, {
          prompt: t(
            `The graph of $y = f(x)$ is shown. Is $f$ continuous at $x = ${b.a}$?`,
            `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${b.a}$ 处连续吗？`,
          ),
          correct: kind === "continuous" ? unbroken : kind === "hole" ? hole : kind === "moved" ? moved : jump,
          wrong,
          solution: breakWalk(b, d),
          figure: d.figure,
        });
      },
    },
    {
      id: "locating-discontinuities-on-a-graph",
      figure: calculusDrawings1["determining-continuity-from-graphs#locating-discontinuities-on-a-graph"],
      title: t("Locating discontinuities on a graph", "在图像上找出间断点"),
      explanation: t(
        "To find where a function is not continuous, scan its graph for breaks. At each marked point ask: does the curve arrive at the same height from both sides, and is the filled point at that height?\n\nFor example, if at $x = -2$ both sides arrive at height $1$ and the point is $(-2, 1)$, while at $x = 3$ the left side arrives at $2$ and the right side starts at $-1$, then $f$ is not continuous at $x = 3$ only.\n\nCheck: just beside $x = 3$ the values are near $2$ on the left and near $-1$ on the right, but just beside $x = -2$ they are all near $1$.\n\n> **Watch out.** A corner, where the curve changes direction, is not a break. Only a hole, a stray point or a jump in height makes $f$ discontinuous.",
        "要找出函数不连续的位置，就在图像上寻找断开处。对每个标出的点问：曲线从两侧是否到达同一高度？实心点是否就在这个高度上？\n\n例如，若在 $x = -2$ 处两侧都到达高度 $1$，且点是 $(-2, 1)$，而在 $x = 3$ 处左侧到达 $2$、右侧从 $-1$ 开始，则 $f$ 只在 $x = 3$ 处不连续。\n\n检验：紧靠 $x = 3$ 两旁，左侧的值接近 $2$，右侧的值接近 $-1$；而紧靠 $x = -2$ 两旁的值都接近 $1$。\n\n> **注意。** 曲线改变方向的拐角不是断开。只有空心点、偏离的点或高度的跳跃才使 $f$ 不连续。",
      ),
      generate(rng) {
        const b0 = rng.int(-4, -3);
        const b1 = b0 + rng.int(2, 3);
        const b2 = b1 + rng.int(2, 3);
        const xs = [b0, b1, b2];
        const bad = rng.bool(0.25) ? -1 : rng.int(0, 2);
        const breaks = xs.map((a, i) => makeBreak(rng, a, i === bad ? rng.pick<BreakKind>(["hole", "moved", "jump"]) : "continuous"));
        const slope = () => rng.pick([-1, -0.5, 0.5, 1]);
        const [m0, m3] = [slope(), slope()];
        const first = breaks[0]!;
        const last = breaks[2]!;
        const marks: PlaneMark[] = [
          { kind: "curve", f: (x) => first.L + m0 * (x - first.a), to: first.a, accent: true },
          { kind: "curve", f: (x) => last.R + m3 * (x - last.a), from: last.a, accent: true },
        ];
        for (let i = 0; i < 2; i++) {
          const p = breaks[i]!;
          const q = breaks[i + 1]!;
          marks.push({ kind: "segment", a: [p.a, p.R], b: [q.a, q.L], accent: true });
        }
        for (const b of breaks) marks.push(...breakMarks(b));
        const g = (x: number) => {
          if (x < b0) return first.L + m0 * (x - b0);
          if (x > b2) return last.R + m3 * (x - b2);
          const p = breaks[x < b1 ? 0 : 1]!;
          const q = breaks[x < b1 ? 1 : 2]!;
          return p.R + ((q.L - p.R) * (x - p.a)) / (q.a - p.a);
        };
        const allCont = t(`$f$ is continuous at all three`, `$f$ 在这三处都连续`);
        const at = (a: number) => same(`$x = ${a}$`);
        const fine = (b: Break) =>
          t(
            `At $x = ${b.a}$ both sides arrive at height $${b.L}$ and the filled point is at that height, so $f$ is continuous there.`,
            `在 $x = ${b.a}$ 处两侧都到达高度 $${b.L}$，实心点也在这个高度上，所以 $f$ 在该处连续。`,
          );
        const broken = bad < 0 ? undefined : breaks[bad]!;
        const wrong = [
          ...breaks.filter((_, i) => i !== bad).map((b) => ({ option: at(b.a), why: fine(b) })),
          ...(broken
            ? [
                {
                  option: allCont,
                  why: t(
                    `The graph breaks at $x = ${broken.a}$: ${breakReason(broken).en}`,
                    `图像在 $x = ${broken.a}$ 处断开：${breakReason(broken)["zh-CN"]}`,
                  ),
                },
              ]
            : []),
        ];
        const tableXs = xs.flatMap((a) => [Math.round((a - 0.1) * 10) / 10, Math.round((a + 0.1) * 10) / 10]);
        const look = broken
          ? broken.L !== broken.R
            ? t(
                `Only around $x = ${broken.a}$ do the two values differ, from about $${broken.L}$ to about $${broken.R}$: that is the jump.`,
                `只有在 $x = ${broken.a}$ 两旁，两个值相差明显，从约 $${broken.L}$ 变到约 $${broken.R}$：这就是跳跃。`,
              )
            : t(
                `The two values beside each point are close together, so the break at $x = ${broken.a}$ is in the point itself: ${valueText(broken).en}, not $${broken.L}$.`,
                `每个点两旁的两个值都很接近，所以 $x = ${broken.a}$ 处的断开在于这个点本身：${valueText(broken)["zh-CN"]}，而不是 $${broken.L}$。`,
              )
          : t(
              "The two values beside each point are close together, and each filled point sits at that height.",
              "每个点两旁的两个值都很接近，且每个实心点都在这个高度上。",
            );
        return explainedChoice(rng, {
          prompt: t(
            `The graph of $y = f(x)$ is shown. At which of $x = ${b0}$, $x = ${b1}$ and $x = ${b2}$ is $f$ not continuous?`,
            `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${b0}$、$x = ${b1}$ 和 $x = ${b2}$ 中的哪一处不连续？`,
          ),
          correct: broken ? at(broken.a) : allCont,
          wrong,
          solution: walked(
            [
              [
                ["Check each marked point", "逐个检查标出的点"],
                t(
                  `At each of $x = ${b0}$, $${b1}$ and $${b2}$, compare the heights the two sides arrive at with the filled point.`,
                  `在 $x = ${b0}$、$${b1}$、$${b2}$ 处，分别比较两侧到达的高度与实心点。`,
                ),
              ],
              [
                ["Name the break", "指出断开处"],
                broken
                  ? breakReason(broken)
                  : t(
                      "At each of the three points the curve passes through the filled point without a break, so $f$ is continuous at all three.",
                      "在这三点处，曲线都不间断地穿过实心点，所以 $f$ 在这三处都连续。",
                    ),
              ],
            ],
            t(
              `Read the curve a little to each side of the three points:\n\n${valuesTable(tableXs, g)}\n\n${look.en}`,
              `读出曲线在这三点两侧附近的高度：\n\n${valuesTable(tableXs, g)}\n\n${look["zh-CN"]}`,
            ),
          ),
          figure: { svg: plane(view, marks), alt: graphAltOf(view, marks) },
        });
      },
    },
  ],
};

/** Condition is the first condition of continuity that fails, or "none". */
type Condition = "none" | "undefined" | "dne" | "differ";

/** conditionText names the outcome of checking the three conditions at a. */
function conditionText(c: Condition, a: number): Text {
  if (c === "none") return t(`$f$ is continuous at $x = ${a}$`, `$f$ 在 $x = ${a}$ 处连续`);
  if (c === "undefined")
    return t(
      `$f$ is not continuous at $x = ${a}$, because $f(${a})$ is not defined`,
      `$f$ 在 $x = ${a}$ 处不连续，因为 $f(${a})$ 没有定义`,
    );
  if (c === "dne")
    return t(
      `$f$ is not continuous at $x = ${a}$, because $${lim(a)} f(x)$ does not exist`,
      `$f$ 在 $x = ${a}$ 处不连续，因为 $${lim(a)} f(x)$ 不存在`,
    );
  return t(
    `$f$ is not continuous at $x = ${a}$, because $${lim(a)} f(x) \\ne f(${a})$`,
    `$f$ 在 $x = ${a}$ 处不连续，因为 $${lim(a)} f(x) \\ne f(${a})$`,
  );
}

/** definingContinuityAtAPoint applies the limit definition of continuity. */
export const definingContinuityAtAPoint: TopicDef = {
  id: "defining-continuity-at-a-point",
  title: t("Defining Continuity at a Point", "一点处连续的定义"),
  summary: t(
    "Use the three conditions of the limit definition to decide whether a function is continuous at a point.",
    "用极限定义的三个条件判断函数在一点处是否连续。",
  ),
  prerequisites: ["determining-continuity-from-graphs", "limits-of-piecewise-functions"],
  encompasses: [
    { topic: "determining-continuity-from-graphs", weight: 0.5 },
    { topic: "limits-of-piecewise-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `The limit of a piecewise function at a break point comes from its two one-sided limits. For example, let $f(x) = x^{2}$ for $x < 2$ and $f(x) = x + 2$ for $x \\ge 2$. From the left $x^{2}$ heads to $4$ and from the right $x + 2$ heads to $4$, so $\\lim_{x \\to 2} f(x) = 4$. The value $f(2) = 2 + 2 = 4$ is the same number.

Check: $f(1.99) = 3.9601$ and $f(2.01) = 4.01$, both close to $f(2) = 4$, so the graph has no break at $x = 2$.

In this lesson we state continuity at a point as three conditions on the value and the limit, and test them on given limits and on piecewise functions.`,
    `分段函数在分段点处的极限由两个单侧极限决定。例如，设 $x < 2$ 时 $f(x) = x^{2}$，$x \\ge 2$ 时 $f(x) = x + 2$。从左侧 $x^{2}$ 趋向 $4$，从右侧 $x + 2$ 趋向 $4$，所以 $\\lim_{x \\to 2} f(x) = 4$。函数值 $f(2) = 2 + 2 = 4$ 也是这个数。

检验：$f(1.99) = 3.9601$，$f(2.01) = 4.01$，都接近 $f(2) = 4$，所以图像在 $x = 2$ 处没有断开。

这节课我们把一点处的连续写成关于函数值与极限的三个条件，并用已知的极限和分段函数来检验它们。`,
  ),
  knowledgePoints: [
    {
      id: "the-three-conditions-for-continuity",
      title: t("The three conditions for continuity", "连续的三个条件"),
      explanation: t(
        "$f$ is continuous at $x = a$ when all three conditions hold:\n\n1. $f(a)$ is defined;\n2. $\\lim_{x \\to a} f(x)$ exists, that is, the one-sided limits are equal;\n3. $\\lim_{x \\to a} f(x) = f(a)$.\n\nIf any one of them fails, $f$ is not continuous at $a$. For example, if both one-sided limits at $1$ are $3$ and $f(1) = 5$, the first two conditions hold but the third fails.\n\nCheck: the limit is $3$ and the value is $5$, and $3 \\ne 5$, so the graph has a hole at height $3$ with the point moved up to $5$.\n\n> **Watch out.** A defined value is not enough, and neither is a limit that exists. The two must also be equal.",
        "当以下三个条件都成立时，$f$ 在 $x = a$ 处连续：\n\n1. $f(a)$ 有定义；\n2. $\\lim_{x \\to a} f(x)$ 存在，即两个单侧极限相等；\n3. $\\lim_{x \\to a} f(x) = f(a)$。\n\n只要有一个条件不成立，$f$ 在 $a$ 处就不连续。例如，若在 $1$ 处两个单侧极限都是 $3$，而 $f(1) = 5$，则前两个条件成立，第三个不成立。\n\n检验：极限是 $3$，函数值是 $5$，$3 \\ne 5$，所以图像在高度 $3$ 处有一个空心点，而那个点被移到了 $5$。\n\n> **注意。** 函数值有定义还不够，极限存在也不够。二者还必须相等。",
      ),
      generate(rng) {
        const a = rng.int(-6, 6);
        const c = rng.pick<Condition>(["none", "undefined", "dne", "differ"]);
        const L = rng.int(-9, 9);
        const R = c === "dne" ? rng.pick(range(-9, 9).filter((r) => r !== L)) : L;
        const v = c === "none" ? L : c === "differ" ? rng.pick(range(-9, 9).filter((r) => r !== L)) : rng.int(-9, 9);
        const valueFact = c === "undefined" ? t(`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`) : same(`$f(${a}) = ${v}$`);
        const facts = `$${lim(a, -1)} f(x) = ${L}$, $${lim(a, 1)} f(x) = ${R}$`;
        const all: Condition[] = ["none", "undefined", "dne", "differ"];
        const why = (o: Condition): Text => {
          if (o === "none")
            return c === "undefined"
              ? t(
                  `$f(${a})$ is not defined, so there is no value for the limit to equal.`,
                  `$f(${a})$ 没有定义，极限没有可以相等的函数值。`,
                )
              : c === "dne"
                ? t(
                    `The one-sided limits $${L}$ and $${R}$ differ, so the limit does not exist.`,
                    `单侧极限 $${L}$ 与 $${R}$ 不相等，所以极限不存在。`,
                  )
                : t(
                    `The limit is $${L}$ but $f(${a}) = ${v}$; the two must be equal.`,
                    `极限是 $${L}$，但 $f(${a}) = ${v}$；二者必须相等。`,
                  );
          if (o === "undefined")
            return t(`$f(${a}) = ${v}$ is given, so the value is defined.`, `已知 $f(${a}) = ${v}$，所以函数值有定义。`);
          if (o === "dne")
            return t(
              `Both one-sided limits are $${L}$, so the limit exists and equals $${L}$.`,
              `两个单侧极限都是 $${L}$，所以极限存在且等于 $${L}$。`,
            );
          return c === "none"
            ? t(`The limit $${L}$ is equal to $f(${a}) = ${v}$.`, `极限 $${L}$ 等于 $f(${a}) = ${v}$。`)
            : c === "undefined"
              ? t(
                  `There is no value $f(${a})$ to compare with; the condition that fails is that $f(${a})$ is not defined.`,
                  `没有函数值 $f(${a})$ 可以比较；不成立的条件是 $f(${a})$ 没有定义。`,
                )
              : t(
                  `The limit does not exist, so it cannot be compared with $f(${a})$; the second condition already fails.`,
                  `极限不存在，无法与 $f(${a})$ 比较；第二个条件就已经不成立。`,
                );
        };
        const picture =
          c === "none"
            ? t(
                `Both sides arrive at height $${L}$ and the filled point is $(${a}, ${L})$, so the pen passes through without lifting.`,
                `两侧都到达高度 $${L}$，实心点是 $(${a}, ${L})$，所以笔不用提起就能穿过。`,
              )
            : c === "undefined"
              ? t(
                  `Both sides arrive at height $${L}$, but there is no point at $x = ${a}$: a hole.`,
                  `两侧都到达高度 $${L}$，但 $x = ${a}$ 处没有点：一个空心点。`,
                )
              : c === "dne"
                ? t(
                    `The left side arrives at height $${L}$ and the right side at $${R}$: a jump.`,
                    `左侧到达高度 $${L}$，右侧到达 $${R}$：一个跳跃。`,
                  )
                : t(
                    `Both sides arrive at height $${L}$, but the filled point is $(${a}, ${v})$, off the curve.`,
                    `两侧都到达高度 $${L}$，但实心点是 $(${a}, ${v})$，偏离了曲线。`,
                  );
        return explainedChoice(rng, {
          prompt: t(
            `A function $f$ has ${facts}, and ${valueFact.en}. Which statement is true?`,
            `函数 $f$ 满足 ${facts}，且${valueFact["zh-CN"]}。下列哪个说法正确？`,
          ),
          correct: conditionText(c, a),
          wrong: all.filter((o) => o !== c).map((o) => ({ option: conditionText(o, a), why: why(o) })),
          solution: walked(
            [
              [
                ["Check the value", "检查函数值"],
                c === "undefined"
                  ? t(`$f(${a})$ is not defined, so the first condition fails.`, `$f(${a})$ 没有定义，所以第一个条件不成立。`)
                  : t(`$f(${a}) = ${v}$ is defined, so the first condition holds.`, `$f(${a}) = ${v}$ 有定义，所以第一个条件成立。`),
              ],
              [
                ["Check the limit", "检查极限"],
                L === R
                  ? t(`Both one-sided limits are $${L}$, so the limit exists:`, `两个单侧极限都是 $${L}$，所以极限存在：`)
                  : t(
                      `The one-sided limits $${L}$ and $${R}$ differ, so the limit does not exist.`,
                      `单侧极限 $${L}$ 与 $${R}$ 不相等，所以极限不存在。`,
                    ),
                L === R ? [`${lim(a)} f(x) = ${L}`] : [],
              ],
              [
                ["Compare", "比较"],
                c === "none"
                  ? t(
                      `The limit $${L}$ equals $f(${a}) = ${v}$, so all three conditions hold and $f$ is continuous at $x = ${a}$.`,
                      `极限 $${L}$ 等于 $f(${a}) = ${v}$，三个条件都成立，所以 $f$ 在 $x = ${a}$ 处连续。`,
                    )
                  : c === "undefined"
                    ? t(
                        "With no value, the limit has nothing to equal. The first condition is the one that fails.",
                        "没有函数值，极限就没有可以相等的对象。不成立的是第一个条件。",
                      )
                    : c === "dne"
                      ? t(
                          "With no limit, there is nothing to compare with the value. The second condition is the one that fails.",
                          "极限不存在，就没有可与函数值比较的对象。不成立的是第二个条件。",
                        )
                      : t(
                          `The limit $${L}$ is not $f(${a}) = ${v}$, so the third condition fails.`,
                          `极限 $${L}$ 不等于 $f(${a}) = ${v}$，所以第三个条件不成立。`,
                        ),
              ],
            ],
            t(
              `Picture the graph near $x = ${a}$. ${picture.en}\n\n${c === "none" ? "An unbroken graph is continuous, as the three conditions say." : "The pen must lift there, so $f$ is not continuous, as the three conditions say."}`,
              `想象 $x = ${a}$ 附近的图像。${picture["zh-CN"]}\n\n${c === "none" ? "图像不断开就是连续，与三个条件的结论一致。" : "画到这里必须提笔，所以 $f$ 不连续，与三个条件的结论一致。"}`,
            ),
          ),
        });
      },
    },
    {
      id: "continuity-of-a-piecewise-function-at-a-point",
      title: t("Continuity of a piecewise function at a point", "分段函数在一点处的连续性"),
      explanation: t(
        "At a break point $a$ of a piecewise function, find the left-sided limit from the formula for $x < a$, the right-sided limit from the formula for $x > a$, and $f(a)$ from the formula that includes $a$. $f$ is continuous at $a$ exactly when the three numbers are equal.\n\nFor example, if $f(x) = 3x - 1$ for $x < 2$, $f(2) = 5$ and $f(x) = x^{2} + 1$ for $x > 2$, the three numbers are $5$, $5$ and $5$, so $f$ is continuous at $2$.\n\nCheck: $f(1.99) = 4.97$ and $f(2.01) = 5.0401$, both close to $f(2) = 5$.\n\n> **Watch out.** Substitute $a$ into both formulas, even into the one whose inequality is strict: it gives a one-sided limit there, though not the value.",
        "在分段函数的分段点 $a$ 处，用 $x < a$ 的表达式求左极限，用 $x > a$ 的表达式求右极限，用包含 $a$ 的表达式求 $f(a)$。当且仅当这三个数相等时，$f$ 在 $a$ 处连续。\n\n例如，若 $x < 2$ 时 $f(x) = 3x - 1$，$f(2) = 5$，$x > 2$ 时 $f(x) = x^{2} + 1$，三个数分别是 $5$、$5$、$5$，所以 $f$ 在 $2$ 处连续。\n\n检验：$f(1.99) = 4.97$，$f(2.01) = 5.0401$，都接近 $f(2) = 5$。\n\n> **注意。** 要把 $a$ 代入两个表达式，包括不等号为严格不等号的那个：它在该点给出单侧极限，只是不给出函数值。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = anyPiece(rng);
        const meet = rng.bool(0.6);
        const right = meet ? shifted(rng, left.at(a), a) : linearPiece(rng);
        const L = left.at(a);
        const R = right.at(a);
        const v = rng.bool(0.6) ? L : rng.pick(range(-9, 9).filter((x) => x !== L));
        const cont = L === R && v === L;
        const f = casesLatex([
          [left.latex, `x < ${a}`],
          [String(v), `x = ${a}`],
          [right.latex, `x > ${a}`],
        ]);
        const allEqual = t(
          "Yes, because both one-sided limits and the value there are all equal",
          "是，因为两个单侧极限与该点的函数值都相等",
        );
        const sidesDiffer = t("No, because the left-sided and right-sided limits differ", "否，因为左极限与右极限不相等");
        const valueDiffers = t("No, because the limits agree but the value there is different", "否，因为两个极限相等，但该点的函数值不同");
        const defined = t(`Yes, because $f(${a})$ is defined`, `是，因为 $f(${a})$ 有定义`);
        const wrong = [
          {
            option: allEqual,
            why:
              L !== R
                ? t(
                    `The left-sided limit is $${L}$ and the right-sided limit is $${R}$; they are not equal.`,
                    `左极限是 $${L}$，右极限是 $${R}$；二者不相等。`,
                  )
                : t(`The limits are both $${L}$, but $f(${a}) = ${v}$.`, `两个极限都是 $${L}$，但 $f(${a}) = ${v}$。`),
          },
          { option: sidesDiffer, why: t(`Both one-sided limits are $${L}$.`, `两个单侧极限都是 $${L}$。`) },
          {
            option: valueDiffers,
            why:
              L !== R
                ? t(
                    `The limits do not agree: the left one is $${L}$ and the right one is $${R}$.`,
                    `两个极限并不相等：左极限是 $${L}$，右极限是 $${R}$。`,
                  )
                : t(`$f(${a}) = ${v}$ is the same as the common limit $${L}$.`, `$f(${a}) = ${v}$ 与共同的极限 $${L}$ 相同。`),
          },
          {
            option: defined,
            why: t(
              "A defined value is only the first condition; the limit must also exist and equal it.",
              "有定义只是第一个条件；极限还必须存在并等于它。",
            ),
          },
        ];
        return explainedChoice(rng, {
          prompt: t(`Let $$${f}$$ Is $f$ continuous at $x = ${a}$?`, `设 $$${f}$$ $f$ 在 $x = ${a}$ 处连续吗？`),
          correct: cont ? allEqual : L !== R ? sidesDiffer : valueDiffers,
          wrong,
          solution: walked(
            [
              [
                ["Find the left-sided limit", "求左极限"],
                t(`Substitute $x = ${a}$ into the formula for $x < ${a}$:`, `把 $x = ${a}$ 代入 $x < ${a}$ 的表达式：`),
                [`${lim(a, -1)} f(x) = ${atLatex(left, a)} = ${L}`],
              ],
              [
                ["Find the right-sided limit", "求右极限"],
                t(`Substitute $x = ${a}$ into the formula for $x > ${a}$:`, `把 $x = ${a}$ 代入 $x > ${a}$ 的表达式：`),
                [`${lim(a, 1)} f(x) = ${atLatex(right, a)} = ${R}`],
              ],
              [
                ["Compare with the value", "与函数值比较"],
                cont
                  ? t(
                      `$f(${a}) = ${v}$ as well. All three are equal, so $f$ is continuous at $x = ${a}$.`,
                      `$f(${a})$ 也等于 $${v}$。三者相等，所以 $f$ 在 $x = ${a}$ 处连续。`,
                    )
                  : t(
                      `$f(${a}) = ${v}$. The three numbers are not all equal, so $f$ is not continuous at $x = ${a}$.`,
                      `$f(${a}) = ${v}$。三个数不全相等，所以 $f$ 在 $x = ${a}$ 处不连续。`,
                    ),
              ],
            ],
            t(
              `Evaluate $f$ just beside $x = ${a}$:\n\n${nearTable(a, left.at, right.at)}\n\n${L === R ? `Both sides close in on $${L}$, ${v === L ? "which is" : "but the value is"} $f(${a}) = ${v}$.` : `The left values stay near $${L}$ and the right values near $${R}$, so no single height is approached.`}`,
              `计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, left.at, right.at)}\n\n${L === R ? `两侧都逼近 $${L}$，${v === L ? "正是" : "而函数值是"} $f(${a}) = ${v}$。` : `左侧的值保持在 $${L}$ 附近，右侧的值保持在 $${R}$ 附近，没有一个共同趋近的高度。`}`,
            ),
          ),
        });
      },
    },
  ],
};

/** Sidedness is the kind of one-sided continuity f has at a point. */
type Sidedness = "both" | "left" | "right" | "neither";

/** sidedness classifies one-sided continuity from the limits and the value. */
function sidedness(L: number, R: number, v: number | undefined): Sidedness {
  const l = v === L;
  const r = v === R;
  return l && r ? "both" : l ? "left" : r ? "right" : "neither";
}

/** sidednessText names a kind of one-sided continuity. */
function sidednessText(s: Sidedness, a: number): Text {
  if (s === "both") return t(`$f$ is continuous at $x = ${a}$`, `$f$ 在 $x = ${a}$ 处连续`);
  if (s === "left") return t(`$f$ is continuous from the left only`, `$f$ 仅左连续`);
  if (s === "right") return t(`$f$ is continuous from the right only`, `$f$ 仅右连续`);
  return t(`$f$ is continuous from neither side`, `$f$ 既不左连续也不右连续`);
}

/** sideValue says what f(a) is, or that it is not defined. */
const sideValue = (a: number, v: number | undefined) =>
  v === undefined ? t(`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`) : same(`$f(${a}) = ${v}$`);

/** sideReason says what is wrong with choosing the kind o of one-sided continuity at a. */
function sideReason(o: Sidedness, a: number, L: number, R: number, v: number | undefined): Text {
  const val = sideValue(a, v);
  if (o === "both")
    return L !== R
      ? t(
          `The two sides head to different heights, $${L}$ and $${R}$, so they cannot both equal $f(${a})$.`,
          `两侧趋向不同的高度 $${L}$ 和 $${R}$，不可能都等于 $f(${a})$。`,
        )
      : t(`Both sides head to $${L}$, but ${val.en}.`, `两侧都趋向 $${L}$，但${val["zh-CN"]}。`);
  if (o === "left")
    return v === L
      ? t(
          `The left side does reach $f(${a}) = ${v}$, but so does the right side, so $f$ is continuous from both sides.`,
          `左侧确实到达 $f(${a}) = ${v}$，但右侧也到达，所以 $f$ 两侧都连续。`,
        )
      : t(`The left side heads to $${L}$, but ${val.en}.`, `左侧趋向 $${L}$，但${val["zh-CN"]}。`);
  if (o === "right")
    return v === R
      ? t(
          `The right side does reach $f(${a}) = ${v}$, but so does the left side, so $f$ is continuous from both sides.`,
          `右侧确实到达 $f(${a}) = ${v}$，但左侧也到达，所以 $f$ 两侧都连续。`,
        )
      : t(`The right side heads to $${R}$, but ${val.en}.`, `右侧趋向 $${R}$，但${val["zh-CN"]}。`);
  return v === L
    ? t(`The left side heads to $${L}$, which equals $f(${a})$.`, `左侧趋向 $${L}$，等于 $f(${a})$。`)
    : t(`The right side heads to $${R}$, which equals $f(${a})$.`, `右侧趋向 $${R}$，等于 $f(${a})$。`);
}

/** sideLook says which sides of the table close in on f(a). */
function sideLook(a: number, L: number, R: number, v: number | undefined): Text {
  const s = sidedness(L, R, v);
  const head = t(`The left values close in on $${L}$ and the right values on $${R}$`, `左侧的值逼近 $${L}$，右侧的值逼近 $${R}$`);
  const tail =
    v === undefined
      ? t(`there is no value $f(${a})$ for either side to match`, `没有函数值 $f(${a})$ 可供任何一侧相等`)
      : s === "both"
        ? t(`both match $f(${a}) = ${v}$`, `两侧都等于 $f(${a}) = ${v}$`)
        : s === "left"
          ? t(`only the left matches $f(${a}) = ${v}$`, `只有左侧等于 $f(${a}) = ${v}$`)
          : s === "right"
            ? t(`only the right matches $f(${a}) = ${v}$`, `只有右侧等于 $f(${a}) = ${v}$`)
            : t(`neither matches $f(${a}) = ${v}$`, `两侧都不等于 $f(${a}) = ${v}$`);
  return t(`${head.en}, and ${tail.en}.`, `${head["zh-CN"]}，${tail["zh-CN"]}。`);
}

/** sideSteps are the steps that compare each one-sided limit with f(a). */
function sideSteps(a: number, L: number, R: number, v: number | undefined): Step[] {
  const s = sidedness(L, R, v);
  const verdict = sidednessText(s, a);
  return [
    [
      ["Read the one-sided limits", "读出单侧极限"],
      t(`From the left $f$ heads to $${L}$, and from the right to $${R}$:`, `从左侧看 $f$ 趋向 $${L}$，从右侧看趋向 $${R}$：`),
      [`${lim(a, -1)} f(x) = ${L}`, `${lim(a, 1)} f(x) = ${R}`],
    ],
    [
      ["Compare each side with the value", "把每一侧与函数值比较"],
      t(
        `${sideValue(a, v).en}. A side is continuous when its limit equals $f(${a})$, so ${verdict.en}.`,
        `${sideValue(a, v)["zh-CN"]}。某一侧的极限等于 $f(${a})$ 时该侧连续，所以${verdict["zh-CN"]}。`,
      ),
    ],
  ];
}

const sides: readonly Sidedness[] = ["both", "left", "right", "neither"];

/** leftAndRightContinuity decides continuity from the left and from the right. */
export const leftAndRightContinuity: TopicDef = {
  id: "left-and-right-continuity",
  title: t("Left and Right Continuity", "左连续与右连续"),
  summary: t("Decide whether a function is continuous from the left or from the right at a point.", "判断函数在一点处是否左连续或右连续。"),
  prerequisites: ["defining-continuity-at-a-point"],
  encompasses: [{ topic: "defining-continuity-at-a-point", weight: 0.5 }],
  xp: 10,
  standards: [],
  intro: t(
    `Continuity at $a$ asks that $\\lim_{x \\to a} f(x) = f(a)$. For example, let $f(x) = x + 1$ for $x \\le 2$ and $f(x) = x^{2}$ for $x > 2$. Then $f(2) = 3$, the left side heads to $3$ and the right side heads to $4$, so the limit does not exist and $f$ is not continuous at $2$. Still, the left side does land on the point $(2, 3)$.

Check: $f(1.99) = 2.99$ is close to $f(2) = 3$, while $f(2.01) = 4.0401$ is not.

In this lesson we compare each one-sided limit with the value on its own, to decide continuity from the left and from the right, on graphs and on piecewise functions.`,
    `在 $a$ 处连续要求 $\\lim_{x \\to a} f(x) = f(a)$。例如，设 $x \\le 2$ 时 $f(x) = x + 1$，$x > 2$ 时 $f(x) = x^{2}$。则 $f(2) = 3$，左侧趋向 $3$，右侧趋向 $4$，所以极限不存在，$f$ 在 $2$ 处不连续。不过，左侧确实落在点 $(2, 3)$ 上。

检验：$f(1.99) = 2.99$ 接近 $f(2) = 3$，而 $f(2.01) = 4.0401$ 不接近。

这节课我们把每个单侧极限分别与函数值比较，在图像上和分段函数中判断左连续与右连续。`,
  ),
  knowledgePoints: [
    {
      id: "one-sided-continuity-from-a-graph",
      figure: calculusDrawings1["left-and-right-continuity#one-sided-continuity-from-a-graph"],
      title: t("One-sided continuity from a graph", "由图像判断单侧连续"),
      explanation: t(
        "$f$ is **continuous from the left** at $a$ when $\\lim_{x \\to a^{-}} f(x) = f(a)$, and **continuous from the right** when $\\lim_{x \\to a^{+}} f(x) = f(a)$.\n\nAt a jump, the filled point sits at the end of one piece: $f$ is continuous from that side only. For example, if the curve ends at height $1$ on the left of $x = 3$, starts at height $4$ on the right, and the filled point is $(3, 1)$, then $f$ is continuous from the left only.\n\nCheck: the left-sided limit $1$ equals $f(3) = 1$, while the right-sided limit $4$ does not.\n\n> **Watch out.** Look at where the filled point sits, not at which piece looks longer. With no filled point, or one that sits at neither end, $f$ is continuous from neither side.",
        "若 $\\lim_{x \\to a^{-}} f(x) = f(a)$，则称 $f$ 在 $a$ 处**左连续**；若 $\\lim_{x \\to a^{+}} f(x) = f(a)$，则称**右连续**。\n\n在跳跃处，实心点位于某一段的端点上：$f$ 只在那一侧连续。例如，若曲线在 $x = 3$ 左侧结束于高度 $1$，右侧从高度 $4$ 开始，实心点是 $(3, 1)$，则 $f$ 仅左连续。\n\n检验：左极限 $1$ 等于 $f(3) = 1$，而右极限 $4$ 不等于它。\n\n> **注意。** 要看实心点在哪里，而不是看哪一段画得长。没有实心点，或实心点不在任何一端时，$f$ 两侧都不连续。",
      ),
      generate(rng) {
        const b = makeBreak(rng, rng.int(-3, 3), rng.pick<BreakKind>(["jump", "jump", "jump", "continuous", "moved"]));
        const d = breakGraph(rng, b);
        const s = sidedness(b.L, b.R, b.value);
        return explainedChoice(rng, {
          prompt: t(
            `The graph of $y = f(x)$ is shown. Which describes $f$ at $x = ${b.a}$?`,
            `图中是 $y = f(x)$ 的图像。下列哪一项描述了 $f$ 在 $x = ${b.a}$ 处的情况？`,
          ),
          correct: sidednessText(s, b.a),
          wrong: sides.filter((o) => o !== s).map((o) => ({ option: sidednessText(o, b.a), why: sideReason(o, b.a, b.L, b.R, b.value) })),
          solution: walked(
            sideSteps(b.a, b.L, b.R, b.value),
            t(
              `Read the heights of the drawn curve just beside $x = ${b.a}$:\n\n${nearTable(b.a, d.left, d.right)}\n\n${sideLook(b.a, b.L, b.R, b.value).en}`,
              `读出所画曲线在 $x = ${b.a}$ 两旁的高度：\n\n${nearTable(b.a, d.left, d.right)}\n\n${sideLook(b.a, b.L, b.R, b.value)["zh-CN"]}`,
            ),
          ),
          figure: d.figure,
        });
      },
    },
    {
      id: "one-sided-continuity-of-piecewise-functions",
      title: t("One-sided continuity of piecewise functions", "分段函数的单侧连续"),
      explanation: t(
        "The inequality signs of a piecewise function decide which formula gives $f(a)$. In\n\n$$f(x) = \\begin{cases} x + 1 & x \\le 2 \\\\ x^{2} & x > 2 \\end{cases}$$\n\n$f(2) = 3$ comes from the left formula, which also gives the left-sided limit $3$, so $f$ is continuous from the left at $2$. The right-sided limit is $4 \\ne 3$, so it is not continuous from the right.\n\nCheck: $f(1.99) = 2.99$ is close to $3$, while $f(2.01) = 4.0401$ is close to $4$.\n\n> **Watch out.** The sign $\\le$ or $\\ge$ decides which piece supplies $f(a)$; a strict sign $<$ or $>$ never does. Moving the equality to the other piece switches the side that is continuous.",
        "分段函数中的不等号决定由哪个表达式给出 $f(a)$。在\n\n$$f(x) = \\begin{cases} x + 1 & x \\le 2 \\\\ x^{2} & x > 2 \\end{cases}$$\n\n中，$f(2) = 3$ 来自左边的表达式，它给出的左极限也是 $3$，所以 $f$ 在 $2$ 处左连续。右极限是 $4 \\ne 3$，所以不右连续。\n\n检验：$f(1.99) = 2.99$ 接近 $3$，而 $f(2.01) = 4.0401$ 接近 $4$。\n\n> **注意。** 由 $\\le$ 或 $\\ge$ 决定哪一段给出 $f(a)$；严格不等号 $<$ 或 $>$ 从不给出。把等号移到另一段，连续的一侧也随之改变。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = anyPiece(rng);
        const right = rng.bool(0.25) ? shifted(rng, left.at(a), a) : anyPiece(rng);
        const L = left.at(a);
        const R = right.at(a);
        const where = rng.int(0, 2);
        const middle = rng.pick(range(-9, 9).filter((x) => x !== L && x !== R));
        const v = where === 0 ? L : where === 1 ? R : middle;
        const f =
          where === 2
            ? casesLatex([
                [left.latex, `x < ${a}`],
                [String(middle), `x = ${a}`],
                [right.latex, `x > ${a}`],
              ])
            : casesLatex([
                [left.latex, `x ${where === 0 ? "\\le" : "<"} ${a}`],
                [right.latex, `x ${where === 0 ? ">" : "\\ge"} ${a}`],
              ]);
        const s = sidedness(L, R, v);
        const valueStep: Step =
          where === 2
            ? [["Find the value", "求函数值"], t(`The middle line gives $f(${a}) = ${v}$ directly.`, `中间一行直接给出 $f(${a}) = ${v}$。`)]
            : [
                ["Find the value", "求函数值"],
                t(
                  `The sign ${where === 0 ? "$\\le$" : "$\\ge$"} puts $x = ${a}$ in the ${where === 0 ? "left" : "right"} formula:`,
                  `不等号 ${where === 0 ? "$\\le$" : "$\\ge$"} 把 $x = ${a}$ 归入${where === 0 ? "左" : "右"}边的表达式：`,
                ),
                [`f(${a}) = ${atLatex(where === 0 ? left : right, a)} = ${v}`],
              ];
        return explainedChoice(rng, {
          prompt: t(`Let $$${f}$$ Which describes $f$ at $x = ${a}$?`, `设 $$${f}$$ 下列哪一项描述了 $f$ 在 $x = ${a}$ 处的情况？`),
          correct: sidednessText(s, a),
          wrong: sides.filter((o) => o !== s).map((o) => ({ option: sidednessText(o, a), why: sideReason(o, a, L, R, v) })),
          solution: walked(
            [valueStep, ...sideSteps(a, L, R, v)],
            t(
              `Evaluate $f$ just beside $x = ${a}$:\n\n${nearTable(a, left.at, right.at)}\n\n${sideLook(a, L, R, v).en}`,
              `计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, left.at, right.at)}\n\n${sideLook(a, L, R, v)["zh-CN"]}`,
            ),
          ),
        });
      },
    },
  ],
};

/** furtherContinuityOfPiecewiseFunctions finds constants that make piecewise functions continuous. */
export const furtherContinuityOfPiecewiseFunctions: TopicDef = {
  id: "further-continuity-of-piecewise-functions",
  title: t("Further Continuity of Piecewise Functions", "分段函数连续性的进一步问题"),
  summary: t(
    "Find the value of a constant that makes a piecewise function continuous at its break point.",
    "求使分段函数在分段点处连续的常数的值。",
  ),
  prerequisites: ["left-and-right-continuity"],
  encompasses: [{ topic: "left-and-right-continuity", weight: 0.4 }],
  xp: 12,
  standards: [],
  intro: t(
    `A piecewise function is continuous at its break point when it is continuous from both sides there. For example, let $f(x) = 2x + 1$ for $x < 3$ and $f(x) = x^{2} - 2$ for $x \\ge 3$. Then $f(3) = 9 - 2 = 7$, the right side starts at $7$, and the left side heads to $2(3) + 1 = 7$ as well, so $f$ is continuous at $3$.

Check: $f(2.99) = 6.98$ and $f(3.01) = 7.0601$, both close to $7$.

In this lesson we choose an unknown constant in one piece so that the two pieces meet and the function is continuous at the break point.`,
    `分段函数在分段点处两侧都连续时，就在该点连续。例如，设 $x < 3$ 时 $f(x) = 2x + 1$，$x \\ge 3$ 时 $f(x) = x^{2} - 2$。则 $f(3) = 9 - 2 = 7$，右侧从 $7$ 开始，左侧也趋向 $2(3) + 1 = 7$，所以 $f$ 在 $3$ 处连续。

检验：$f(2.99) = 6.98$，$f(3.01) = 7.0601$，都接近 $7$。

这节课我们选取某一段中的未知常数，使两段相接，函数在分段点处连续。`,
  ),
  knowledgePoints: [
    {
      id: "a-constant-term-that-makes-a-function-continuous",
      title: t("A constant term that makes a function continuous", "使函数连续的常数项"),
      explanation: t(
        "To make a piecewise function continuous at its break point $a$, set the two formulas equal at $x = a$ and solve for the constant:\n\n$$f(x) = \\begin{cases} 2x + 1 & x < 3 \\\\ x^{2} + k & x \\ge 3 \\end{cases}: \\quad 2(3) + 1 = 3^{2} + k \\implies k = -2.$$\n\nCheck: with $k = -2$, $f(2.99) = 6.98$ and $f(3.01) = 7.0601$, both close to $f(3) = 7$.\n\n> **Watch out.** Substitute the break point into both formulas, including the one with the strict inequality. Its value there is a one-sided limit, even though it does not give $f(a)$.",
        "要使分段函数在分段点 $a$ 处连续，令两个表达式在 $x = a$ 处的值相等，解出常数：\n\n$$f(x) = \\begin{cases} 2x + 1 & x < 3 \\\\ x^{2} + k & x \\ge 3 \\end{cases}: \\quad 2(3) + 1 = 3^{2} + k \\implies k = -2.$$\n\n检验：取 $k = -2$，$f(2.99) = 6.98$，$f(3.01) = 7.0601$，都接近 $f(3) = 7$。\n\n> **注意。** 要把分段点代入两个表达式，包括带严格不等号的那个。它在该点的值是单侧极限，尽管不给出 $f(a)$。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const known = anyPiece(rng);
        const s = rng.sign();
        const b = rng.nonZero(-4, 4);
        const q = (x: number) => s * x * x + b * x;
        const k = known.at(a) - q(a);
        const withK = `${poly([s, "x^{2}"], [b, "x"])} + k`;
        const kFirst = rng.bool();
        const f = casesLatex(
          kFirst
            ? [
                [withK, `x < ${a}`],
                [known.latex, `x \\ge ${a}`],
              ]
            : [
                [known.latex, `x < ${a}`],
                [withK, `x \\ge ${a}`],
              ],
        );
        const withKAt = (x: number) => q(x) + k;
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ Find the value of $k$ that makes $f$ continuous at $x = ${a}$.`,
            `设 $$${f}$$ 求使 $f$ 在 $x = ${a}$ 处连续的 $k$ 的值。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [known.at(a) + q(a), q(a) - known.at(a), known.at(a)],
          solution: walked(
            [
              [
                ["Evaluate the known piece", "计算已知的一段"],
                t(`At $x = ${a}$ the formula without $k$ gives`, `在 $x = ${a}$ 处，不含 $k$ 的表达式给出`),
                [`${atLatex(known, a)} = ${known.at(a)}`],
              ],
              [
                ["Evaluate the piece with k", "计算含 k 的一段"],
                t(`At $x = ${a}$ the other formula gives`, `在 $x = ${a}$ 处，另一个表达式给出`),
                [`${atLatex({ latex: poly([s, "x^{2}"], [b, "x"]), at: q }, a)} + k = ${q(a)} + k`],
              ],
              [["Solve", "求解"], t("The two must be equal:", "二者必须相等："), [`${q(a)} + k = ${known.at(a)}`, `k = ${k}`]],
            ],
            t(
              `With $k = ${k}$, evaluate $f$ just beside $x = ${a}$:\n\n${nearTable(a, kFirst ? withKAt : known.at, kFirst ? known.at : withKAt)}\n\nBoth sides close in on $${known.at(a)}$, so the pieces meet.`,
              `取 $k = ${k}$，计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, kFirst ? withKAt : known.at, kFirst ? known.at : withKAt)}\n\n两侧都逼近 $${known.at(a)}$，所以两段相接。`,
            ),
          ),
        });
      },
    },
    {
      id: "a-coefficient-that-makes-a-function-continuous",
      title: t("A coefficient that makes a function continuous", "使函数连续的系数"),
      explanation: t(
        "When the constant multiplies $x$, the equation at the break point is still linear in it:\n\n$$f(x) = \\begin{cases} kx - 1 & x < 2 \\\\ x^{2} + 3 & x \\ge 2 \\end{cases}: \\quad 2k - 1 = 7 \\implies k = 4.$$\n\nCheck: with $k = 4$, $f(1.99) = 6.96$ and $f(2.01) = 7.0401$, both close to $f(2) = 7$.\n\n> **Watch out.** After moving the constant term across, divide by the break point $a$, not by the target value. A negative $a$ flips the sign of $k$.",
        "当常数乘以 $x$ 时，分段点处的方程仍是关于它的一次方程：\n\n$$f(x) = \\begin{cases} kx - 1 & x < 2 \\\\ x^{2} + 3 & x \\ge 2 \\end{cases}: \\quad 2k - 1 = 7 \\implies k = 4.$$\n\n检验：取 $k = 4$，$f(1.99) = 6.96$，$f(2.01) = 7.0401$，都接近 $f(2) = 7$。\n\n> **注意。** 把常数项移到另一边后，要除以分段点 $a$，而不是除以目标值。$a$ 为负时 $k$ 的符号也随之改变。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const c = rng.nonZero(-6, 6);
        const other = anyPiece(rng);
        const target = other.at(a);
        const k = Q.of(target - c, a);
        const kx = `kx ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
        const kLeft = rng.bool();
        const f = casesLatex(
          kLeft
            ? [
                [kx, `x < ${a}`],
                [other.latex, `x \\ge ${a}`],
              ]
            : [
                [other.latex, `x < ${a}`],
                [kx, `x \\ge ${a}`],
              ],
        );
        const ak = `${a === 1 ? "" : a === -1 ? "-" : a}k`;
        const kAt = (x: number) => k.toNumber() * x + c;
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ Find the value of $k$ that makes $f$ continuous at $x = ${a}$.`,
            `设 $$${f}$$ 求使 $f$ 在 $x = ${a}$ 处连续的 $k$ 的值。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [Q.of(target + c, a), Q.of(target, a), Q.of(target - c)],
          solution: walked(
            [
              [
                ["Evaluate the known piece", "计算已知的一段"],
                t(`At $x = ${a}$ the formula without $k$ gives`, `在 $x = ${a}$ 处，不含 $k$ 的表达式给出`),
                [`${atLatex(other, a)} = ${target}`],
              ],
              [
                ["Set the pieces equal", "令两段相等"],
                t(
                  `At $x = ${a}$ the formula with $k$ gives $${ak} ${c < 0 ? "-" : "+"} ${Math.abs(c)}$, and the two must agree:`,
                  `在 $x = ${a}$ 处含 $k$ 的表达式给出 $${ak} ${c < 0 ? "-" : "+"} ${Math.abs(c)}$，二者必须相等：`,
                ),
                [`${ak} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${target}`, `${ak} = ${target - c}`, `k = ${k.toLatex()}`],
              ],
            ],
            t(
              `With $k = ${k.toLatex()}$, evaluate $f$ just beside $x = ${a}$:\n\n${nearTable(a, kLeft ? kAt : other.at, kLeft ? other.at : kAt)}\n\nBoth sides close in on $${target}$, so the pieces meet.`,
              `取 $k = ${k.toLatex()}$，计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, kLeft ? kAt : other.at, kLeft ? other.at : kAt)}\n\n两侧都逼近 $${target}$，所以两段相接。`,
            ),
          ),
        });
      },
    },
  ],
};

/** quadraticFrom writes (x − a)(x − b) expanded, times m. */
const quadraticFrom = (m: number, a: number, b: number) => poly([m, "x^{2}"], [-m * (a + b), "x"], [m * a * b, ""]);

/** times writes a factor m in front of a product: nothing for 1 and a minus sign for −1. */
const times = (m: number) => (m === 1 ? "" : m === -1 ? "-" : String(m));

/** pointDiscontinuities studies holes and displaced points. */
export const pointDiscontinuities: TopicDef = {
  id: "point-discontinuities",
  title: t("Point Discontinuities", "可去间断点"),
  summary: t(
    "Recognize point (removable) discontinuities, where the limit exists but differs from the value or the value is missing.",
    "识别可去间断点：极限存在，但函数值与之不等或没有定义。",
  ),
  prerequisites: ["defining-continuity-at-a-point", "calculating-limits-of-rational-functions-by-factoring"],
  encompasses: [
    { topic: "defining-continuity-at-a-point", weight: 0.3 },
    { topic: "calculating-limits-of-rational-functions-by-factoring", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `Factoring finds a limit that substitution cannot:

$$\\lim_{x \\to 3} \\frac{x^{2} - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6.$$

Yet the quotient itself is not defined at $x = 3$. Its graph is the line $y = x + 3$ with the single point $(3, 6)$ missing.

Check: at $x = 2.99$ the quotient is $5.99$ and at $x = 3.01$ it is $6.01$, both close to $6$.

In this lesson we recognize point discontinuities, where the limit exists but the value is missing or elsewhere, on graphs and in rational functions.`,
    `因式分解能求出代入法求不出的极限：

$$\\lim_{x \\to 3} \\frac{x^{2} - 9}{x - 3} = \\lim_{x \\to 3} (x + 3) = 6.$$

但这个商本身在 $x = 3$ 处没有定义。它的图像是直线 $y = x + 3$，只缺了一个点 $(3, 6)$。

检验：$x = 2.99$ 时商为 $5.99$，$x = 3.01$ 时为 $6.01$，都接近 $6$。

这节课我们在图像上和有理函数中识别可去间断点：极限存在，但函数值缺失或在别处。`,
  ),
  knowledgePoints: [
    {
      id: "point-discontinuities-from-a-graph",
      figure: calculusDrawings1["point-discontinuities#point-discontinuities-from-a-graph"],
      title: t("Point discontinuities from a graph", "由图像认识可去间断点"),
      explanation: t(
        "A **point discontinuity** at $x = a$ is a single missing or misplaced point: $\\lim_{x \\to a} f(x)$ exists, but $f(a)$ is not defined or is different from it. Moving the point to the height of the hole would make $f$ continuous.\n\nFor example, if the curve heads to height $2$ from both sides of $x = 1$ but the filled point is $(1, -3)$, setting $f(1) = 2$ makes $f$ continuous.\n\nCheck: the values just beside $x = 1$ are close to $2$, which is where the new point sits.\n\n> **Watch out.** The answer is the height of the hole, not the height of the stray filled point and not the $x$-value $a$.",
        "$x = a$ 处的**可去间断点**是单独一个缺失或错位的点：$\\lim_{x \\to a} f(x)$ 存在，但 $f(a)$ 没有定义或与它不相等。把这个点移到空心点的高度，$f$ 就连续了。\n\n例如，若曲线从 $x = 1$ 两侧都趋向高度 $2$，但实心点是 $(1, -3)$，则令 $f(1) = 2$ 就使 $f$ 连续。\n\n检验：紧靠 $x = 1$ 两旁的值都接近 $2$，新的点正好在这个高度。\n\n> **注意。** 答案是空心点的高度，不是偏离的实心点的高度，也不是 $x$ 值 $a$。",
      ),
      generate(rng) {
        const b = makeBreak(rng, rng.int(-3, 3), rng.pick<BreakKind>(["hole", "moved"]));
        const d = breakGraph(rng, b);
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ has a point discontinuity at $x = ${b.a}$. What value of $f(${b.a})$ would make $f$ continuous there?`,
              `$y = f(x)$ 的图像在 $x = ${b.a}$ 处有可去间断点。$f(${b.a})$ 取何值时，$f$ 在该点连续？`,
            ),
            answer: b.L,
            wrong: [...(b.value === undefined ? [] : [b.value]), b.a, b.L + 1],
            solution: walked(
              [
                [
                  ["Read the limit", "读出极限"],
                  t(`The curve approaches height $${b.L}$ from both sides, so`, `曲线从两侧都趋近高度 $${b.L}$，所以`),
                  [`${lim(b.a)} f(x) = ${b.L}`],
                ],
                [
                  ["Move the point", "移动该点"],
                  t(
                    `Now ${valueText(b).en}. Continuity needs the value to equal the limit, so set $f(${b.a}) = ${b.L}$.`,
                    `现在${valueText(b)["zh-CN"]}。连续要求函数值等于极限，所以令 $f(${b.a}) = ${b.L}$。`,
                  ),
                ],
              ],
              t(
                `Read the heights of the drawn curve just beside $x = ${b.a}$:\n\n${nearTable(b.a, d.left, d.right)}\n\nBoth sides close in on $${b.L}$, so a point at $(${b.a}, ${b.L})$ fills the gap.`,
                `读出所画曲线在 $x = ${b.a}$ 两旁的高度：\n\n${nearTable(b.a, d.left, d.right)}\n\n两侧都逼近 $${b.L}$，所以点 $(${b.a}, ${b.L})$ 正好填上空缺。`,
              ),
            ),
          }),
          figure: d.figure,
        };
      },
    },
    {
      id: "the-hole-of-a-rational-function",
      figure: calculusDrawings1["point-discontinuities#the-hole-of-a-rational-function"],
      title: t("The hole of a rational function", "有理函数图像上的空心点"),
      explanation: t(
        "When numerator and denominator share a factor $(x - a)$, the graph has a hole at $x = a$. Cancel the factor and substitute $a$ to find its height:\n\n$$f(x) = \\frac{x^{2} - x - 6}{x - 3} = \\frac{(x - 3)(x + 2)}{x - 3} = x + 2 \\; (x \\ne 3).$$\n\nSo the hole is at $(3, 5)$.\n\nCheck: $f(2.99) = 4.99$ and $f(3.01) = 5.01$, both close to $5$.\n\n> **Watch out.** Cancel before substituting. Substituting $x = a$ into the original quotient gives $\\frac{0}{0}$, which is not the height.",
        "当分子分母有公因式 $(x - a)$ 时，图像在 $x = a$ 处有一个空心点。约去公因式再代入 $a$，就得到它的高度：\n\n$$f(x) = \\frac{x^{2} - x - 6}{x - 3} = \\frac{(x - 3)(x + 2)}{x - 3} = x + 2 \\; (x \\ne 3).$$\n\n所以空心点是 $(3, 5)$。\n\n检验：$f(2.99) = 4.99$，$f(3.01) = 5.01$，都接近 $5$。\n\n> **注意。** 先约分再代入。把 $x = a$ 直接代入原来的商得到 $\\frac{0}{0}$，那不是高度。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.pick(range(-6, 6).filter((x) => x !== a));
        const m = rng.pick([1, 1, 2, 3, -1]);
        const k = rng.pick([1, 1, 2, -1]);
        const y = Q.of(m * (a - b), k);
        const den = poly([k, "x"], [-k * a, ""]);
        const simple = k === 1 ? poly([m, "x"], [-m * b, ""]) : `\\frac{${poly([m, "x"], [-m * b, ""])}}{${k}}`;
        const f = (x: number) => (m * (x - a) * (x - b)) / (k * (x - a));
        return numberProblem({
          prompt: t(
            `The graph of $f(x) = \\frac{${quadraticFrom(m, a, b)}}{${den}}$ has a hole at $x = ${a}$. Find the $y$-coordinate of the hole.`,
            `$f(x) = \\frac{${quadraticFrom(m, a, b)}}{${den}}$ 的图像在 $x = ${a}$ 处有一个空心点。求空心点的纵坐标。`,
          ),
          answer: y,
          wrong: [Q.of(m * (a + b), k), Q.of(m * (b - a), k), Q.of(b), Q.zero],
          solution: walked(
            [
              [
                ["Factor and cancel", "因式分解并约分"],
                t(`The factor $${fac(a)}$ is common to both:`, `分子分母都有因式 $${fac(a)}$：`),
                [
                  `f(x) = \\frac{${times(m)}${fac(a)}${fac(b)}}{${k === 1 ? bare(a) : `${times(k)}${fac(a)}`}} = ${simple} \\quad (x \\ne ${a})`,
                ],
              ],
              [
                ["Substitute", "代入"],
                t(`The height of the hole is the simplified formula at $x = ${a}$:`, `空心点的高度就是化简后的式子在 $x = ${a}$ 处的值：`),
                [`y = ${y.toLatex()}`],
              ],
            ],
            t(
              `Evaluate the original quotient just beside $x = ${a}$:\n\n${nearTable(a, f)}\n\nThe values close in on $${y.toLatex()}${y.isInteger() ? "" : ` \\approx ${fmt(y.toNumber())}`}$ from both sides.`,
              `计算原来的商在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, f)}\n\n这些值从两侧逼近 $${y.toLatex()}${y.isInteger() ? "" : ` \\approx ${fmt(y.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** absJumpLatex writes k|x − a|/(x − a) + c. */
const absJumpLatex = (k: number, a: number, c: number) =>
  `\\frac{${times(k)}|${bare(a)}|}{${bare(a)}}${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`}`;

/** jumpDiscontinuities measures jumps between one-sided limits. */
export const jumpDiscontinuities: TopicDef = {
  id: "jump-discontinuities",
  title: t("Jump Discontinuities", "跳跃间断点"),
  summary: t(
    "Recognize jump discontinuities, where both one-sided limits exist but differ, and find the size of the jump.",
    "识别跳跃间断点：两个单侧极限都存在但不相等，并求跳跃的大小。",
  ),
  prerequisites: ["defining-continuity-at-a-point", "limits-of-absolute-value-functions"],
  encompasses: [
    { topic: "defining-continuity-at-a-point", weight: 0.3 },
    { topic: "limits-of-absolute-value-functions", weight: 0.3 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `$\\frac{|x|}{x}$ equals $-1$ for every $x < 0$ and $1$ for every $x > 0$, so its left-sided limit at $0$ is $-1$ and its right-sided limit is $1$. Its graph steps up by $2$ at $x = 0$, and no value at $0$ could join the two sides.

Check: at $x = -0.01$ the value is $\\frac{0.01}{-0.01} = -1$, and at $x = 0.01$ it is $1$.

In this lesson we recognize jump discontinuities, where both one-sided limits are finite but differ, and measure the size of the jump.`,
    `$\\frac{|x|}{x}$ 对每个 $x < 0$ 都等于 $-1$，对每个 $x > 0$ 都等于 $1$，所以它在 $0$ 处的左极限是 $-1$，右极限是 $1$。它的图像在 $x = 0$ 处向上跳了 $2$，$0$ 处取什么值都接不上两侧。

检验：$x = -0.01$ 时值为 $\\frac{0.01}{-0.01} = -1$，$x = 0.01$ 时为 $1$。

这节课我们识别跳跃间断点：两个单侧极限都有限但不相等，并求跳跃的大小。`,
  ),
  knowledgePoints: [
    {
      id: "the-size-of-a-jump",
      figure: calculusDrawings1["jump-discontinuities#the-size-of-a-jump"],
      title: t("The size of a jump", "跳跃的大小"),
      explanation: t(
        "A **jump discontinuity** at $x = a$ has finite one-sided limits that differ. The jump is the change from the left to the right:\n\n$$\\lim_{x \\to a^{+}} f(x) - \\lim_{x \\to a^{-}} f(x).$$\n\nIt is positive when the graph jumps up and negative when it jumps down. For example, if $f(x) = x + 1$ for $x < 2$ and $f(x) = 7 - x$ for $x \\ge 2$, the left-sided limit is $3$, the right-sided limit is $5$, and the jump is $5 - 3 = 2$.\n\nCheck: $f(1.99) = 2.99$ and $f(2.01) = 4.99$ differ by about $2$.\n\n> **Watch out.** Subtract in the order right minus left. Reversing the order flips the sign, and the jump is not the sum of the two limits.",
        "$x = a$ 处的**跳跃间断点**的两个单侧极限都有限但不相等。跳跃量是从左到右的变化：\n\n$$\\lim_{x \\to a^{+}} f(x) - \\lim_{x \\to a^{-}} f(x).$$\n\n图像向上跳时它为正，向下跳时为负。例如，若 $x < 2$ 时 $f(x) = x + 1$，$x \\ge 2$ 时 $f(x) = 7 - x$，则左极限是 $3$，右极限是 $5$，跳跃量为 $5 - 3 = 2$。\n\n检验：$f(1.99) = 2.99$ 与 $f(2.01) = 4.99$ 相差约 $2$。\n\n> **注意。** 要按右减左的顺序相减。顺序颠倒会使符号相反，跳跃量也不是两个极限之和。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = anyPiece(rng);
        const drawn = anyPiece(rng);
        const right = drawn.at(a) === left.at(a) ? shifted(rng, left.at(a) + rng.nonZero(-5, 5), a) : drawn;
        const L = left.at(a);
        const R = right.at(a);
        const f = casesLatex([
          [left.latex, `x < ${a}`],
          [right.latex, `x \\ge ${a}`],
        ]);
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ Find the jump $${lim(a, 1)} f(x) - ${lim(a, -1)} f(x)$.`,
            `设 $$${f}$$ 求跳跃量 $${lim(a, 1)} f(x) - ${lim(a, -1)} f(x)$。`,
          ),
          answer: R - L,
          wrong: [L - R, L + R, Math.abs(R - L)],
          solution: walked(
            [
              [
                ["Find the left-sided limit", "求左极限"],
                t(`Substitute $x = ${a}$ into the formula for $x < ${a}$:`, `把 $x = ${a}$ 代入 $x < ${a}$ 的表达式：`),
                [`${lim(a, -1)} f(x) = ${atLatex(left, a)} = ${L}`],
              ],
              [
                ["Find the right-sided limit", "求右极限"],
                t(`Substitute $x = ${a}$ into the formula for $x \\ge ${a}$:`, `把 $x = ${a}$ 代入 $x \\ge ${a}$ 的表达式：`),
                [`${lim(a, 1)} f(x) = ${atLatex(right, a)} = ${R}`],
              ],
              [["Subtract", "相减"], t("Right minus left:", "右减左："), [`${R} - ${paren(L)} = ${R - L}`]],
            ],
            t(
              `Evaluate $f$ just beside $x = ${a}$:\n\n${nearTable(a, left.at, right.at)}\n\nThe values change from about $${L}$ to about $${R}$ across $x = ${a}$, a change of $${R - L}$.`,
              `计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, left.at, right.at)}\n\n越过 $x = ${a}$ 时，值从约 $${L}$ 变到约 $${R}$，变化了 $${R - L}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "jumps-of-absolute-value-quotients",
      title: t("Jumps of absolute value quotients", "含绝对值的商的跳跃"),
      explanation: t(
        "$\\frac{|x - a|}{x - a}$ is $-1$ for $x < a$ and $1$ for $x > a$, so $f(x) = k\\frac{|x - a|}{x - a} + c$ has a jump at $a$: its left-sided limit is $c - k$ and its right-sided limit is $c + k$.\n\nFor example, $3\\frac{|x - 1|}{x - 1} + 2$ has left-sided limit $2 - 3 = -1$ and right-sided limit $2 + 3 = 5$ at $x = 1$.\n\nCheck: at $x = 0.9$ the quotient is $\\frac{0.1}{-0.1} = -1$, so $f(0.9) = -1$; at $x = 1.1$ it is $1$, so $f(1.1) = 5$.\n\n> **Watch out.** For $x < a$, $|x - a| = -(x - a)$, so the quotient is $-1$, not $1$. A negative $k$ makes the graph step down instead of up.",
        "$\\frac{|x - a|}{x - a}$ 在 $x < a$ 时为 $-1$，在 $x > a$ 时为 $1$，所以 $f(x) = k\\frac{|x - a|}{x - a} + c$ 在 $a$ 处有跳跃：左极限为 $c - k$，右极限为 $c + k$。\n\n例如，$3\\frac{|x - 1|}{x - 1} + 2$ 在 $x = 1$ 处的左极限是 $2 - 3 = -1$，右极限是 $2 + 3 = 5$。\n\n检验：$x = 0.9$ 时这个商是 $\\frac{0.1}{-0.1} = -1$，所以 $f(0.9) = -1$；$x = 1.1$ 时它是 $1$，所以 $f(1.1) = 5$。\n\n> **注意。** 当 $x < a$ 时 $|x - a| = -(x - a)$，所以这个商是 $-1$，不是 $1$。$k$ 为负时图像向下跳而不是向上跳。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const k = rng.nonZero(-5, 5);
        const c = rng.int(-6, 6);
        const ask = rng.int(0, 2);
        const L = c - k;
        const R = c + k;
        const target = ask === 0 ? `${lim(a, -1)} f(x)` : ask === 1 ? `${lim(a, 1)} f(x)` : `${lim(a, 1)} f(x) - ${lim(a, -1)} f(x)`;
        const answer = ask === 0 ? L : ask === 1 ? R : R - L;
        const f = (x: number) => (k * Math.abs(x - a)) / (x - a) + c;
        return numberProblem({
          prompt: t(`Let $f(x) = ${absJumpLatex(k, a, c)}$. Find $${target}$.`, `设 $f(x) = ${absJumpLatex(k, a, c)}$。求 $${target}$。`),
          answer,
          wrong: ask === 2 ? [L - R, k, 0] : [ask === 0 ? R : L, c, k],
          solution: walked(
            [
              [
                ["Simplify on the left", "化简左侧"],
                t(`For $x < ${a}$, $${bare(a)} < 0$, so the quotient is $-1$:`, `当 $x < ${a}$ 时 $${bare(a)} < 0$，所以这个商是 $-1$：`),
                [`f(x) = ${k}(-1)${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`} = ${L}`],
              ],
              [
                ["Simplify on the right", "化简右侧"],
                t(`For $x > ${a}$, $${bare(a)} > 0$, so the quotient is $1$:`, `当 $x > ${a}$ 时 $${bare(a)} > 0$，所以这个商是 $1$：`),
                [`f(x) = ${k}(1)${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`} = ${R}`],
              ],
              [
                ["Read off the answer", "得出答案"],
                ask === 2
                  ? t(`The jump is right minus left: $${R} - ${paren(L)} = ${R - L}$.`, `跳跃量是右减左：$${R} - ${paren(L)} = ${R - L}$。`)
                  : t(
                      `$f$ is constant on each side, so the ${ask === 0 ? "left" : "right"}-sided limit is $${answer}$.`,
                      `$f$ 在每一侧都是常数，所以${ask === 0 ? "左" : "右"}极限是 $${answer}$。`,
                    ),
              ],
            ],
            t(
              `Evaluate $f$ on both sides of $x = ${a}$:\n\n${nearTable(a, f)}\n\nEvery value on the left is $${L}$ and every value on the right is $${R}$.`,
              `计算 $f$ 在 $x = ${a}$ 两侧的值：\n\n${nearTable(a, f)}\n\n左侧每个值都是 $${L}$，右侧每个值都是 $${R}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Discontinuity is a kind of discontinuity, or "none" for a point of continuity. */
type Discontinuity = "point" | "jump" | "infinite" | "none";

/** discontinuityText names a kind of discontinuity at a. */
function discontinuityText(d: Discontinuity, a: number): Text {
  if (d === "point") return t(`A point (removable) discontinuity at $x = ${a}$`, `$x = ${a}$ 处为可去间断点`);
  if (d === "jump") return t(`A jump discontinuity at $x = ${a}$`, `$x = ${a}$ 处为跳跃间断点`);
  if (d === "infinite") return t(`An infinite discontinuity (vertical asymptote) at $x = ${a}$`, `$x = ${a}$ 处为无穷间断点（竖直渐近线）`);
  return t(`$f$ is continuous at $x = ${a}$`, `$f$ 在 $x = ${a}$ 处连续`);
}

const discontinuities: readonly Discontinuity[] = ["point", "jump", "infinite", "none"];

/** discontinuitiesDueToVerticalAsymptotes classifies discontinuities, including infinite ones. */
export const discontinuitiesDueToVerticalAsymptotes: TopicDef = {
  id: "discontinuities-due-to-vertical-asymptotes",
  title: t("Discontinuities Due to Vertical Asymptotes", "由竖直渐近线引起的间断"),
  summary: t(
    "Recognize infinite discontinuities at vertical asymptotes and tell them apart from point and jump discontinuities.",
    "识别竖直渐近线处的无穷间断点，并把它与可去间断点、跳跃间断点区分开。",
  ),
  prerequisites: [
    "point-discontinuities",
    "jump-discontinuities",
    "infinite-limits-from-graphs",
    "vertical-asymptotes-of-rational-functions",
  ],
  encompasses: [
    { topic: "point-discontinuities", weight: 0.3 },
    { topic: "jump-discontinuities", weight: 0.3 },
    { topic: "vertical-asymptotes-of-rational-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `$\\frac{1}{x - 2}$ has a vertical asymptote at $x = 2$: as $x \\to 2^{+}$ the values grow without bound, and as $x \\to 2^{-}$ they fall without bound. Neither one-sided limit is a number, so no value of $f(2)$ could join the two sides.

Check: at $x = 2.01$ the value is $100$, and at $x = 1.99$ it is $-100$.

In this lesson we recognize infinite discontinuities at vertical asymptotes and tell them apart from point and jump discontinuities, on graphs and in rational functions.`,
    `$\\frac{1}{x - 2}$ 在 $x = 2$ 处有竖直渐近线：当 $x \\to 2^{+}$ 时函数值无限增大，当 $x \\to 2^{-}$ 时无限减小。两个单侧极限都不是数，所以 $f(2)$ 取什么值都接不上两侧。

检验：$x = 2.01$ 时值为 $100$，$x = 1.99$ 时为 $-100$。

这节课我们在图像上和有理函数中识别竖直渐近线处的无穷间断点，并把它与可去间断点、跳跃间断点区分开。`,
  ),
  knowledgePoints: [
    {
      id: "classifying-discontinuities-from-graphs",
      figure: calculusDrawings1["discontinuities-due-to-vertical-asymptotes#classifying-discontinuities-from-graphs"],
      title: t("Classifying discontinuities from graphs", "由图像判断间断点的类型"),
      explanation: t(
        "There are three kinds of discontinuity:\n\n- **point**: the limit exists, but the value is missing or elsewhere (a hole);\n- **jump**: both one-sided limits are finite but differ;\n- **infinite**: a one-sided limit is $\\infty$ or $-\\infty$, at a vertical asymptote.\n\nFor example, $\\frac{x^{2} - 1}{x - 1}$ has a point discontinuity at $1$, $\\frac{|x|}{x}$ has a jump at $0$, and $\\frac{1}{x^{2}}$ has an infinite discontinuity at $0$.\n\nCheck: $\\frac{1}{(0.1)^{2}} = 100$, and the values keep growing as $x$ nears $0$, while $\\frac{|x|}{x}$ stays at $-1$ and $1$.\n\n> **Watch out.** A graph that shoots off on one side only is still an infinite discontinuity: one infinite one-sided limit is enough.",
        "间断点有三类：\n\n- **可去间断点**：极限存在，但函数值缺失或在别处（空心点）；\n- **跳跃间断点**：两个单侧极限都有限但不相等；\n- **无穷间断点**：某个单侧极限为 $\\infty$ 或 $-\\infty$，出现在竖直渐近线处。\n\n例如，$\\frac{x^{2} - 1}{x - 1}$ 在 $1$ 处有可去间断点，$\\frac{|x|}{x}$ 在 $0$ 处有跳跃，$\\frac{1}{x^{2}}$ 在 $0$ 处有无穷间断点。\n\n检验：$\\frac{1}{(0.1)^{2}} = 100$，$x$ 越接近 $0$ 值越大；而 $\\frac{|x|}{x}$ 始终是 $-1$ 和 $1$。\n\n> **注意。** 只在一侧无限上升或下降的图像也是无穷间断点：有一个单侧极限为无穷就够了。",
      ),
      generate(rng) {
        const kind = rng.pick<Discontinuity>(["point", "jump", "infinite", "infinite"]);
        const a = rng.int(-3, 3);
        let figure: Figure;
        let left: (x: number) => number;
        let right: (x: number) => number;
        let b: Break | undefined;
        if (kind === "infinite") {
          const k = rng.pick([-3, -2, -1, 1, 2, 3]);
          const d = rng.int(-3, 3);
          const square = rng.bool();
          const g = (x: number) => (square ? k / (x - a) ** 2 : k / (x - a)) + d;
          left = g;
          right = g;
          figure = {
            svg: plane(view, [
              { kind: "line", a: [a, 0], b: [a, 1], dashed: true },
              { kind: "curve", f: g, to: a - 0.01, accent: true },
              { kind: "curve", f: g, from: a + 0.01, accent: true },
            ]),
            alt: t(
              `The graph of y = f(x), with a dashed vertical line at x = ${a} that the curve climbs or falls along on each side.`,
              `y = f(x) 的图像，在 x = ${a} 处有一条竖直虚线，曲线在两侧沿它上升或下降。`,
            ),
          };
        } else {
          b = makeBreak(rng, a, kind === "point" ? rng.pick<BreakKind>(["hole", "moved"]) : "jump");
          const drawn = breakGraph(rng, b);
          figure = drawn.figure;
          left = drawn.left;
          right = drawn.right;
        }
        const why = (o: Discontinuity): Text => {
          if (o === "point")
            return kind === "jump"
              ? t(
                  "The two sides end at different heights, so this is more than one missing point.",
                  "两侧在不同的高度结束，所以这不只是缺了一个点。",
                )
              : t(
                  "The graph does not approach a finite height; it runs along the dashed asymptote.",
                  "图像并不趋近一个有限的高度，而是沿着竖直虚线延伸。",
                );
          if (o === "jump")
            return kind === "point"
              ? t("Both sides approach the same height; only the point is missing or moved.", "两侧趋近同一高度，只是那个点缺失或错位。")
              : t(
                  "A jump has finite heights on both sides, but here the graph grows without bound.",
                  "跳跃的两侧都是有限的高度，而这里图像无界。",
                );
          return t(
            `The graph stays at finite heights near $x = ${a}$; there is no asymptote.`,
            `图像在 $x = ${a}$ 附近保持在有限的高度，没有渐近线。`,
          );
        };
        const sideSay =
          kind === "infinite"
            ? t(`Next to the dashed line $x = ${a}$, the curve rises or falls without bound.`, `在虚线 $x = ${a}$ 旁，曲线无限上升或下降。`)
            : t(
                `From the left the curve heads to height $${b!.L}$ and from the right to height $${b!.R}$.`,
                `从左侧看曲线趋向高度 $${b!.L}$，从右侧看趋向高度 $${b!.R}$。`,
              );
        const verdict =
          kind === "infinite"
            ? t("An infinite one-sided limit makes the discontinuity infinite.", "单侧极限为无穷，所以是无穷间断点。")
            : kind === "jump"
              ? t(
                  "Both one-sided limits are finite but differ, so the discontinuity is a jump.",
                  "两个单侧极限都有限但不相等，所以是跳跃间断点。",
                )
              : t(
                  `The limit is $${b!.L}$, but ${valueText(b!).en}, so the discontinuity is a point discontinuity.`,
                  `极限是 $${b!.L}$，但${valueText(b!)["zh-CN"]}，所以是可去间断点。`,
                );
        const look =
          kind === "infinite"
            ? t(
                "The values grow in size as $x$ nears the line, without settling on any height.",
                "$x$ 越接近这条线，值的绝对值越大，不会稳定在任何高度上。",
              )
            : breakLook(b!);
        return explainedChoice(rng, {
          prompt: t(
            `The graph of $y = f(x)$ is shown. What kind of discontinuity does $f$ have at $x = ${a}$?`,
            `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${a}$ 处是哪一类间断点？`,
          ),
          correct: discontinuityText(kind, a),
          wrong: discontinuities.filter((d) => d !== kind && d !== "none").map((d) => ({ option: discontinuityText(d, a), why: why(d) })),
          solution: walked(
            [
              [["Look at the two sides", "观察两侧"], sideSay],
              [["Classify", "分类"], verdict],
            ],
            t(
              `Read the heights of the drawn curve just beside $x = ${a}$:\n\n${nearTable(a, left, right)}\n\n${look.en}`,
              `读出所画曲线在 $x = ${a}$ 两旁的高度：\n\n${nearTable(a, left, right)}\n\n${look["zh-CN"]}`,
            ),
          ),
          figure,
        });
      },
    },
    {
      id: "classifying-discontinuities-of-rational-functions",
      figure: calculusDrawings1["discontinuities-due-to-vertical-asymptotes#classifying-discontinuities-of-rational-functions"],
      title: t("Classifying discontinuities of rational functions", "判断有理函数间断点的类型"),
      explanation: t(
        "Factor numerator and denominator. At a zero $a$ of the denominator:\n\n- if $(x - a)$ cancels completely, $f$ has a **point** discontinuity (a hole);\n- otherwise the denominator still vanishes, and $f$ has an **infinite** discontinuity (a vertical asymptote).\n\nA rational function is continuous wherever its denominator is not $0$. For example, $\\frac{(x - 1)(x + 2)}{(x - 1)(x - 3)}$ has a hole at $x = 1$ and a vertical asymptote at $x = 3$.\n\nCheck: near $x = 1$ the quotient is close to $-1.5$, the value of $\\frac{x + 2}{x - 3}$ at $1$, while at $x = 3.01$ it is about $501$.\n\n> **Watch out.** Cancel before deciding. A zero of the original denominator whose factor cancels is a hole, not an asymptote.",
        "把分子分母因式分解。在分母的零点 $a$ 处：\n\n- 若 $(x - a)$ 能完全约去，$f$ 有**可去**间断点（空心点）；\n- 否则分母仍为零，$f$ 有**无穷**间断点（竖直渐近线）。\n\n有理函数在分母不为 $0$ 的地方都连续。例如，$\\frac{(x - 1)(x + 2)}{(x - 1)(x - 3)}$ 在 $x = 1$ 处有空心点，在 $x = 3$ 处有竖直渐近线。\n\n检验：在 $x = 1$ 附近这个商接近 $-1.5$，即 $\\frac{x + 2}{x - 3}$ 在 $1$ 处的值；而 $x = 3.01$ 时它约为 $501$。\n\n> **注意。** 先约分再判断。原分母的零点若其因式被约去，就是空心点，不是渐近线。",
      ),
      generate(rng) {
        const [a, b, c] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const ask = rng.pick([a, c, b]);
        const kind: Discontinuity = ask === a ? "point" : ask === c ? "infinite" : "none";
        const f = `\\frac{${quadraticFrom(1, a, b)}}{${quadraticFrom(1, a, c)}}`;
        const g = (x: number) => ((x - a) * (x - b)) / ((x - a) * (x - c));
        const holeHeight = Q.of(a - b, a - c);
        const why = (o: Discontinuity): Text => {
          if (o === "point")
            return kind === "infinite"
              ? t(
                  "The factor that vanishes here stays in the denominator, so this is not a removable hole.",
                  "在这里为零的因式留在分母中，所以这不是可去的空心点。",
                )
              : t("The denominator is not zero here, so there is nothing to remove.", "分母在这里不为零，所以没有什么可去的。");
          if (o === "infinite")
            return kind === "point"
              ? t(
                  "The factor that vanishes here cancels, so the values do not blow up.",
                  "在这里为零的因式被约去了，所以函数值不会趋于无穷。",
                )
              : t("The denominator is not zero here, so the values do not blow up.", "分母在这里不为零，所以函数值不会趋于无穷。");
          if (o === "none")
            return t(
              "The denominator is zero here, so the function is not defined and cannot be continuous.",
              "分母在这里为零，函数没有定义，所以不可能连续。",
            );
          return t(
            "A jump needs two different finite one-sided limits, and a rational function does not have that.",
            "跳跃间断要求两个不同的有限单侧极限，而有理函数不会这样。",
          );
        };
        const look =
          kind === "point"
            ? t(
                `The values close in on $${holeHeight.toLatex()}$ from both sides, a finite height: a hole.`,
                `这些值从两侧逼近有限的高度 $${holeHeight.toLatex()}$：一个空心点。`,
              )
            : kind === "infinite"
              ? t(
                  "The values grow in size on both sides, so the graph runs along a vertical asymptote.",
                  "两侧的值绝对值都越来越大，所以图像沿竖直渐近线延伸。",
                )
              : t(`The values pass smoothly through $0 = f(${b})$.`, `这些值平稳地穿过 $0 = f(${b})$。`);
        return explainedChoice(rng, {
          prompt: t(`Let $f(x) = ${f}$. What happens at $x = ${ask}$?`, `设 $f(x) = ${f}$。$f$ 在 $x = ${ask}$ 处是什么情况？`),
          correct: discontinuityText(kind, ask),
          wrong: discontinuities.filter((d) => d !== kind).map((d) => ({ option: discontinuityText(d, ask), why: why(d) })),
          solution: walked(
            [
              [
                ["Factor and cancel", "因式分解并约分"],
                t(`The factor $${fac(a)}$ is common to both:`, `分子分母都有因式 $${fac(a)}$：`),
                [`f(x) = \\frac{${fac(a)}${fac(b)}}{${fac(a)}${fac(c)}} = \\frac{${bare(b)}}{${bare(c)}} \\quad (x \\ne ${a})`],
              ],
              [
                [`Look at x = ${ask}`, `观察 x = ${ask}`],
                kind === "point"
                  ? t(
                      `The factor $${fac(a)}$ cancels, so $x = ${a}$ is a hole: a point discontinuity.`,
                      `因式 $${fac(a)}$ 被约去，所以 $x = ${a}$ 处是空心点：可去间断点。`,
                    )
                  : kind === "infinite"
                    ? t(
                        `The factor $${fac(c)}$ stays in the denominator, so $x = ${c}$ is a vertical asymptote: an infinite discontinuity.`,
                        `因式 $${fac(c)}$ 仍留在分母中，所以 $x = ${c}$ 是竖直渐近线：无穷间断点。`,
                      )
                    : t(
                        `The denominator is not zero at $x = ${b}$, so $f$ is continuous there; it has a zero there.`,
                        `分母在 $x = ${b}$ 处不为零，所以 $f$ 在该点连续；那里是函数的零点。`,
                      ),
              ],
            ],
            t(
              `Evaluate the original quotient just beside $x = ${ask}$:\n\n${nearTable(ask, g)}\n\n${look.en}`,
              `计算原来的商在 $x = ${ask}$ 两旁的值：\n\n${nearTable(ask, g)}\n\n${look["zh-CN"]}`,
            ),
          ),
        });
      },
    },
  ],
};

/** open is the open interval (lo, hi); an undefined end is infinite. */
const open = (lo?: number, hi?: number): Interval => ({
  ...(lo === undefined ? {} : { lo: Q.of(lo) }),
  ...(hi === undefined ? {} : { hi: Q.of(hi) }),
  loClosed: false,
  hiClosed: false,
});

/** between is the interval from lo to hi with the chosen closed ends; an undefined end is infinite. */
const between = (lo: number | undefined, loClosed: boolean, hi: number | undefined, hiClosed: boolean): Interval => ({
  ...(lo === undefined ? {} : { lo: Q.of(lo) }),
  ...(hi === undefined ? {} : { hi: Q.of(hi) }),
  loClosed: lo !== undefined && loClosed,
  hiClosed: hi !== undefined && hiClosed,
});

/** continuityOverAnInterval decides continuity on intervals. */
export const continuityOverAnInterval: TopicDef = {
  id: "continuity-over-an-interval",
  title: t("Continuity Over an Interval", "区间上的连续性"),
  summary: t(
    "Decide whether a function is continuous on an interval, and find the intervals on which a rational function is continuous.",
    "判断函数在区间上是否连续，并求有理函数的连续区间。",
  ),
  prerequisites: ["discontinuities-due-to-vertical-asymptotes", "left-and-right-continuity"],
  encompasses: [
    { topic: "discontinuities-due-to-vertical-asymptotes", weight: 0.4 },
    { topic: "left-and-right-continuity", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `$\\sqrt{x}$ is continuous at every $a > 0$, but at $0$ it has only a right side. There $\\lim_{x \\to 0^{+}} \\sqrt{x} = 0 = \\sqrt{0}$, so it is continuous from the right, and that is all an endpoint of an interval can ask for.

Check: $\\sqrt{0.01} = 0.1$ and $\\sqrt{0.0001} = 0.01$, closing in on $\\sqrt{0} = 0$ from the right.

In this lesson we decide whether a function is continuous on an interval, using one-sided continuity at the endpoints, and find the intervals on which a rational function is continuous.`,
    `$\\sqrt{x}$ 在每个 $a > 0$ 处都连续，但在 $0$ 处只有右侧。在那里 $\\lim_{x \\to 0^{+}} \\sqrt{x} = 0 = \\sqrt{0}$，所以它右连续，而这正是区间端点所能要求的全部。

检验：$\\sqrt{0.01} = 0.1$，$\\sqrt{0.0001} = 0.01$，从右侧逼近 $\\sqrt{0} = 0$。

这节课我们利用端点处的单侧连续判断函数在区间上是否连续，并求有理函数的连续区间。`,
  ),
  knowledgePoints: [
    {
      id: "continuity-on-a-closed-interval",
      title: t("Continuity on a closed interval", "闭区间上的连续性"),
      explanation: t(
        "$f$ is continuous on $[p, q]$ when it is continuous at every point of $(p, q)$, continuous from the right at $p$ and continuous from the left at $q$.\n\nA rational function fails this exactly when a zero of its denominator lies in $[p, q]$, endpoints included, because $f$ is not even defined there. For example, $\\frac{1}{x - 3}$ is continuous on $[0, 2]$, but not on $[0, 3]$.\n\nCheck: on $[0, 2]$ the denominator $x - 3$ runs from $-3$ to $-1$ and is never $0$; on $[0, 3]$ it reaches $0$ at the endpoint $3$.\n\n> **Watch out.** A zero of the denominator at an endpoint still spoils continuity on the closed interval, though not on the open one.",
        "若 $f$ 在 $(p, q)$ 内每一点都连续，在 $p$ 处右连续，在 $q$ 处左连续，则称 $f$ 在 $[p, q]$ 上连续。\n\n有理函数恰好在分母的某个零点落在 $[p, q]$ 中（包括端点）时不满足这一点，因为 $f$ 在那里没有定义。例如，$\\frac{1}{x - 3}$ 在 $[0, 2]$ 上连续，但在 $[0, 3]$ 上不连续。\n\n检验：在 $[0, 2]$ 上分母 $x - 3$ 从 $-3$ 变到 $-1$，从不为 $0$；在 $[0, 3]$ 上它在端点 $3$ 处为 $0$。\n\n> **注意。** 分母的零点落在端点上，同样会破坏闭区间上的连续性，只是不影响开区间。",
      ),
      generate(rng) {
        const [r1, r2] = rng.sample(range(-6, 6), 2).sort((x, y) => x - y) as [number, number];
        const k = rng.nonZero(-5, 5);
        const den = quadraticFrom(1, r1, r2);
        const f = `\\frac{${k}}{${den}}`;
        const mode = rng.int(0, 3);
        let p: number;
        let q: number;
        if (mode === 0) {
          // An interval that misses both zeros.
          p = r2 + rng.int(1, 2);
          q = p + rng.int(1, 4);
        } else if (mode === 1) {
          p = r1 - rng.int(2, 5);
          q = r1 - 1;
        } else if (mode === 2) {
          // A zero at an endpoint.
          const r = rng.pick([r1, r2]);
          [p, q] = rng.bool() ? [r, r + rng.int(1, 3)] : [r - rng.int(1, 3), r];
        } else {
          const r = rng.pick([r1, r2]);
          p = r - rng.int(1, 3);
          q = r + rng.int(1, 3);
        }
        const bad = [r1, r2].filter((r) => r >= p && r <= q);
        const holds = bad.length === 0;
        const xs = range(p, q);
        return yesNoProblem(
          rng,
          t(`Is $f(x) = ${f}$ continuous on the interval $[${p}, ${q}]$?`, `$f(x) = ${f}$ 在区间 $[${p}, ${q}]$ 上连续吗？`),
          holds,
          walked(
            [
              [
                ["Find where f is not defined", "找出 f 没有定义的点"],
                t(
                  `Factor the denominator; it is $0$ at $x = ${r1}$ and $x = ${r2}$:`,
                  `把分母因式分解；它在 $x = ${r1}$ 和 $x = ${r2}$ 处为 $0$：`,
                ),
                [`${den} = ${fac(r1)}${fac(r2)}`],
              ],
              [
                ["Compare with the interval", "与区间比较"],
                holds
                  ? t(
                      `Neither $${r1}$ nor $${r2}$ lies in $[${p}, ${q}]$, so $f$ is continuous on it.`,
                      `$${r1}$ 和 $${r2}$ 都不在 $[${p}, ${q}]$ 中，所以 $f$ 在该区间上连续。`,
                    )
                  : t(
                      `$x = ${bad[0]}$ lies in $[${p}, ${q}]$, where $f$ is not defined, so $f$ is not continuous on it.`,
                      `$x = ${bad[0]}$ 在 $[${p}, ${q}]$ 中，$f$ 在该点没有定义，所以 $f$ 在该区间上不连续。`,
                    ),
              ],
            ],
            t(
              `The zeros are whole numbers, so it is enough to evaluate the denominator at the whole numbers of the interval:\n\n${valuesTable(xs, (x) => (x - r1) * (x - r2), den)}\n\n${holds ? "No entry is $0$, so the denominator never vanishes on the interval." : `The entry at $x = ${bad[0]}$ is $0$.`}`,
              `零点都是整数，所以只需计算分母在区间内各整数处的值：\n\n${valuesTable(xs, (x) => (x - r1) * (x - r2), den)}\n\n${holds ? "没有一项为 $0$，所以分母在区间上从不为零。" : `$x = ${bad[0]}$ 处的值为 $0$。`}`,
            ),
          ),
          holds
            ? t(
                `Neither zero of the denominator, $${r1}$ or $${r2}$, lies in $[${p}, ${q}]$, so nothing breaks there.`,
                `分母的零点 $${r1}$ 和 $${r2}$ 都不在 $[${p}, ${q}]$ 中，所以那里没有断开。`,
              )
            : t(
                `$x = ${bad[0]}$ lies in $[${p}, ${q}]$, endpoints included, and $f$ is not defined there.`,
                `$x = ${bad[0]}$ 在 $[${p}, ${q}]$ 中（端点也算），$f$ 在那里没有定义。`,
              ),
        );
      },
    },
    {
      id: "intervals-of-continuity-of-a-rational-function",
      title: t("Intervals of continuity of a rational function", "有理函数的连续区间"),
      explanation: t(
        "A rational function is continuous on its domain: every real number except the zeros of the denominator. Write that set as a union of open intervals:\n\n$$f(x) = \\frac{x}{x^{2} - 4} \\text{ is continuous on } (-\\infty, -2) \\cup (-2, 2) \\cup (2, \\infty).$$\n\nCheck: $x^{2} - 4 = 0$ only at $x = \\pm 2$, while at $x = 0$, for instance, $f(0) = 0$ is defined.\n\n> **Watch out.** Use parentheses at the zeros of the denominator. $f$ has no value there, so no bracket may include them.",
        "有理函数在其定义域上连续：除分母零点以外的所有实数。把这个集合写成开区间的并集：\n\n$$f(x) = \\frac{x}{x^{2} - 4} \\text{ 在 } (-\\infty, -2) \\cup (-2, 2) \\cup (2, \\infty) \\text{ 上连续}.$$\n\n检验：$x^{2} - 4 = 0$ 只在 $x = \\pm 2$ 处成立，而例如 $x = 0$ 时 $f(0) = 0$ 有定义。\n\n> **注意。** 在分母的零点处要用圆括号。$f$ 在那里没有值，所以不能用方括号把它们包括进来。",
      ),
      generate(rng) {
        const two = rng.bool(0.7);
        const [r1, r2] = rng.sample(range(-7, 7), 2).sort((x, y) => x - y) as [number, number];
        const num = rng.bool() ? poly([rng.nonZero(-3, 3), "x"], [rng.int(-6, 6), ""]) : String(rng.nonZero(-9, 9));
        const den = two ? quadraticFrom(1, r1, r2) : poly([1, "x"], [-r1, ""]);
        const denAt = (x: number) => (two ? (x - r1) * (x - r2) : x - r1);
        const set = two ? union(open(undefined, r1), open(r1, r2), open(r2)) : union(open(undefined, r1), open(r1));
        const xs = two ? [r1 - 1, r1, r2, r2 + 1] : [r1 - 1, r1, r1 + 1];
        const setLatex = two ? `(-\\infty, ${r1}) \\cup (${r1}, ${r2}) \\cup (${r2}, \\infty)` : `(-\\infty, ${r1}) \\cup (${r1}, \\infty)`;
        return intervalProblem({
          prompt: t(
            `On what set is $f(x) = \\frac{${num}}{${den}}$ continuous? Answer in interval notation.`,
            `$f(x) = \\frac{${num}}{${den}}$ 在什么集合上连续？用区间表示。`,
          ),
          set,
          wrong: two
            ? [union(open(r1, r2)), union(open(undefined, r1), open(r2)), union(open(undefined, -r1), open(-r1, -r2), open(-r2))]
            : [union(open(r1)), union(open(undefined, -r1), open(-r1))],
          solution: walked(
            [
              [
                ["Find the zeros of the denominator", "求分母的零点"],
                two
                  ? t(`Factor: it is $0$ at $x = ${r1}$ and $x = ${r2}$.`, `因式分解：它在 $x = ${r1}$ 和 $x = ${r2}$ 处为 $0$。`)
                  : t(`It is $0$ at $x = ${r1}$.`, `它在 $x = ${r1}$ 处为 $0$。`),
                two ? [`${den} = ${fac(r1)}${fac(r2)}`] : [],
              ],
              [
                ["Write the rest of the line", "写出其余部分"],
                t("$f$ is continuous at every other real number:", "$f$ 在其余每个实数处都连续："),
                [setLatex],
              ],
            ],
            t(
              `Evaluate the denominator at the excluded points and beside them:\n\n${valuesTable(xs, denAt, den)}\n\nIt is $0$ only at the excluded points, so every other $x$ gives $f$ a value.`,
              `计算分母在被去掉的点及其旁边的值：\n\n${valuesTable(xs, denAt, den)}\n\n它只在被去掉的点处为 $0$，所以其余每个 $x$ 都使 $f$ 有值。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Domain describes the part of f(x) that limits its domain: the inside expression, whether 0 is allowed, and on which side of a it must be. */
interface Domain {
  readonly inside: string;
  readonly at: (x: number) => number;
  readonly zeroAllowed: boolean;
}

/** continuityOfFunctions finds where common functions and their combinations are continuous. */
export const continuityOfFunctions: TopicDef = {
  id: "continuity-of-functions",
  title: t("Continuity of Functions", "函数的连续性"),
  summary: t(
    "Use the continuity of polynomial, rational, radical, exponential, logarithmic and trigonometric functions on their domains.",
    "利用多项式、有理、根式、指数、对数和三角函数在其定义域上的连续性。",
  ),
  prerequisites: ["continuity-over-an-interval", "limits-of-logarithmic-functions", "limits-of-radical-functions"],
  encompasses: [{ topic: "continuity-over-an-interval", weight: 0.4 }],
  xp: 12,
  standards: [],
  intro: t(
    `For a root, the limit at a point inside the domain is found by substituting: $\\lim_{x \\to 4} \\sqrt{x} = \\sqrt{4} = 2$. That is exactly continuity, because the limit equals the value. The same holds for logarithms, exponentials, sines and cosines wherever they are defined.

Check: $\\sqrt{3.99} \\approx 1.9975$ and $\\sqrt{4.01} \\approx 2.0025$, both close to $2$.

In this lesson we use the continuity of polynomial, rational, radical, exponential, logarithmic and trigonometric functions on their domains to find where combinations of them are continuous.`,
    `对于根式，定义域内一点处的极限可以直接代入求得：$\\lim_{x \\to 4} \\sqrt{x} = \\sqrt{4} = 2$。这正是连续，因为极限等于函数值。对数、指数、正弦和余弦函数在有定义的地方也都如此。

检验：$\\sqrt{3.99} \\approx 1.9975$，$\\sqrt{4.01} \\approx 2.0025$，都接近 $2$。

这节课我们利用多项式、有理、根式、指数、对数和三角函数在其定义域上的连续性，求它们的组合在哪里连续。`,
  ),
  knowledgePoints: [
    {
      id: "where-a-function-is-continuous",
      title: t("Where a function is continuous", "函数在何处连续"),
      explanation: t(
        "Polynomials, $e^{x}$, $\\sin x$ and $\\cos x$ are continuous everywhere; $\\sqrt{x}$ is continuous on $[0, \\infty)$ and $\\ln x$ on $(0, \\infty)$. Sums, products, quotients and compositions of continuous functions are continuous wherever they are defined. So a function built from these is continuous exactly on its domain:\n\n$$\\frac{\\sqrt{x - 1}}{x - 4} \\text{ is continuous on } [1, 4) \\cup (4, \\infty).$$\n\nCheck: at $x = 1$ the root is $\\sqrt{0} = 0$, so $f(1) = 0$ is defined, and continuity from the right is all that endpoint needs; at $x = 4$ the denominator is $0$.\n\n> **Watch out.** A square root allows $0$, so its endpoint is included with a bracket. A logarithm does not, and neither does a root in a denominator, so their endpoints are left out.",
        "多项式、$e^{x}$、$\\sin x$ 和 $\\cos x$ 处处连续；$\\sqrt{x}$ 在 $[0, \\infty)$ 上连续，$\\ln x$ 在 $(0, \\infty)$ 上连续。连续函数的和、积、商与复合在有定义的地方都连续。所以由它们构成的函数恰好在其定义域上连续：\n\n$$\\frac{\\sqrt{x - 1}}{x - 4} \\text{ 在 } [1, 4) \\cup (4, \\infty) \\text{ 上连续}.$$\n\n检验：$x = 1$ 时根式为 $\\sqrt{0} = 0$，所以 $f(1) = 0$ 有定义，而这个端点只需右连续；$x = 4$ 时分母为 $0$。\n\n> **注意。** 平方根允许取 $0$，所以它的端点用方括号包括进来。对数不允许，分母中的根式也不允许，所以它们的端点要去掉。",
      ),
      generate(rng) {
        const a = rng.int(-6, 6);
        const form = rng.int(0, 5);
        const b = form >= 4 ? rng.pick(range(-7, 7).filter((x) => x !== a)) : 0;
        const lnOf = `\\ln${fac(a) === "x" ? " x" : fac(a)}`;
        let f: string;
        let set: ReturnType<typeof union>;
        let setLatex: string;
        let why: Text;
        let dom: Domain;
        const right: Domain = { inside: bare(a), at: (x) => x - a, zeroAllowed: true };
        if (form === 0) {
          f = `\\sqrt{${bare(a)}}`;
          set = union(between(a, true, undefined, false));
          setLatex = `[${a}, \\infty)`;
          dom = right;
          why = t(`The root needs $${bare(a)} \\ge 0$, that is, $x \\ge ${a}$.`, `根式要求 $${bare(a)} \\ge 0$，即 $x \\ge ${a}$。`);
        } else if (form === 1) {
          const inside = poly([a, ""], [-1, "x"]);
          f = `\\sqrt{${inside}}`;
          set = union(between(undefined, false, a, true));
          setLatex = `(-\\infty, ${a}]`;
          dom = { inside, at: (x) => a - x, zeroAllowed: true };
          why = t(`The root needs $${inside} \\ge 0$, that is, $x \\le ${a}$.`, `根式要求 $${inside} \\ge 0$，即 $x \\le ${a}$。`);
        } else if (form === 2) {
          f = lnOf;
          set = union(open(a));
          setLatex = `(${a}, \\infty)`;
          dom = { ...right, zeroAllowed: false };
          why = t(`The logarithm needs $${bare(a)} > 0$, that is, $x > ${a}$.`, `对数要求 $${bare(a)} > 0$，即 $x > ${a}$。`);
        } else if (form === 3) {
          f = `\\frac{1}{\\sqrt{${bare(a)}}}`;
          set = union(open(a));
          setLatex = `(${a}, \\infty)`;
          dom = { ...right, zeroAllowed: false };
          why = t(
            `The root needs $${bare(a)} \\ge 0$ and the denominator must not be $0$, so $x > ${a}$.`,
            `根式要求 $${bare(a)} \\ge 0$，且分母不能为 $0$，所以 $x > ${a}$。`,
          );
        } else {
          const closed = form === 4;
          f = closed ? `\\frac{\\sqrt{${bare(a)}}}{${bare(b)}}` : `\\frac{${lnOf}}{${bare(b)}}`;
          set = b > a ? union(between(a, closed, b, false), open(b)) : union(between(a, closed, undefined, false));
          setLatex = b > a ? `${closed ? "[" : "("}${a}, ${b}) \\cup (${b}, \\infty)` : `${closed ? "[" : "("}${a}, \\infty)`;
          dom = { ...right, zeroAllowed: closed };
          why = t(
            `${closed ? `The root needs $x \\ge ${a}$` : `The logarithm needs $x > ${a}$`}, and the denominator is $0$ at $x = ${b}$${b > a ? ", which must be removed" : ", which is already outside"}.`,
            `${closed ? `根式要求 $x \\ge ${a}$` : `对数要求 $x > ${a}$`}，分母在 $x = ${b}$ 处为 $0$${b > a ? "，必须去掉这一点" : "，它已经不在范围内"}。`,
          );
        }
        const xs = [a - 1, a, a + 1];
        const outside = form === 1 ? a + 1 : a - 1;
        const zeroText = dom.zeroAllowed
          ? t(`which the root allows, so $x = ${a}$ is included`, `根式允许取 $0$，所以包括 $x = ${a}$`)
          : t(`which is not allowed here, so $x = ${a}$ is left out`, `这里不允许取 $0$，所以去掉 $x = ${a}$`);
        const extra =
          form >= 4
            ? t(
                ` The denominator $${bare(b)}$ is $0$ at $x = ${b}$${b > a ? ", which is removed as well" : ", already outside"}.`,
                `分母 $${bare(b)}$ 在 $x = ${b}$ 处为 $0$${b > a ? "，也要去掉" : "，它已在范围之外"}。`,
              )
            : t("", "");
        return intervalProblem({
          prompt: t(
            `On what set is $f(x) = ${f}$ continuous? Answer in interval notation.`,
            `$f(x) = ${f}$ 在什么集合上连续？用区间表示。`,
          ),
          set,
          wrong: [union(open(a)), union(between(a, true, undefined, false)), union(open(undefined, a)), union(open(undefined, a), open(a))],
          solution: walked(
            [
              [["Find the domain", "求定义域"], why],
              [
                ["Use continuity on the domain", "利用定义域上的连续性"],
                t(
                  "$f$ is built from continuous functions, so it is continuous exactly on its domain:",
                  "$f$ 由连续函数构成，所以恰好在其定义域上连续：",
                ),
                [setLatex],
              ],
            ],
            t(
              `Test the expression that limits the domain at $x = ${a}$ and on either side:\n\n${valuesTable(xs, dom.at, dom.inside)}\n\nAt $x = ${outside}$ it is negative, so $f$ has no value there. At $x = ${a}$ it is $0$, ${zeroText.en}.${extra.en}`,
              `在 $x = ${a}$ 及其两侧检验限制定义域的式子：\n\n${valuesTable(xs, dom.at, dom.inside)}\n\n$x = ${outside}$ 时它为负，$f$ 在那里没有值。$x = ${a}$ 时它为 $0$，${zeroText["zh-CN"]}。${extra["zh-CN"]}`,
            ),
          ),
        });
      },
    },
    {
      id: "continuity-on-the-real-line",
      title: t("Continuity on the whole real line", "在整个实数轴上的连续性"),
      explanation: t(
        "A function built from continuous pieces is continuous for every real $x$ when nothing in it ever fails: no denominator becomes $0$, no square root gets a negative input and no logarithm a non-positive one. Look for those dangers, not for how complicated the formula is. For example, $\\frac{1}{x^{2} + 1}$ is continuous everywhere, but $\\frac{1}{x^{2} - 1}$ is not.\n\nCheck: $x^{2} + 1 \\ge 1$ for every $x$, while $x^{2} - 1 = 0$ at $x = 1$.\n\n> **Watch out.** A denominator that only looks dangerous may never vanish, as with $\\cos x - 3$, and a harmless-looking one may vanish, as with $e^{x} - 1$ at $x = 0$. Test it.",
        "由连续函数构成的函数，只要处处都不出问题，就对所有实数 $x$ 连续：分母永不为 $0$，平方根里永不为负，对数里永远为正。要找的是这些危险，而不是看公式有多复杂。例如，$\\frac{1}{x^{2} + 1}$ 处处连续，而 $\\frac{1}{x^{2} - 1}$ 则不然。\n\n检验：对每个 $x$ 都有 $x^{2} + 1 \\ge 1$，而 $x^{2} - 1$ 在 $x = 1$ 处为 $0$。\n\n> **注意。** 看起来危险的分母可能永不为零，比如 $\\cos x - 3$；看起来无害的分母也可能为零，比如 $e^{x} - 1$ 在 $x = 0$ 处。要实际检验。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const c = rng.nonZero(-4, 4);
        const all = [-3, -2, -1, 0, 1, 2, 3];
        const unit = [-1, 0, 1];
        // Each form: f, whether it is continuous everywhere, why, the expression to test, its values, where to test it, and what the test shows.
        const forms: readonly (readonly [string, boolean, Text, string, (x: number) => number, readonly number[], Text])[] = [
          [
            `\\frac{${c}}{x^{2} + ${k}}`,
            true,
            t(`$x^{2} + ${k} \\ge ${k} > 0$, so the denominator is never $0$.`, `$x^{2} + ${k} \\ge ${k} > 0$，所以分母永不为 $0$。`),
            `x^{2} + ${k}`,
            (x) => x * x + k,
            all,
            t(`Every entry is at least $${k}$, the value at $x = 0$.`, `每一项都至少是 $x = 0$ 处的值 $${k}$。`),
          ],
          [
            `\\frac{${c}}{x^{2} - ${k}}`,
            false,
            t(`The denominator is $0$ at $x = \\pm ${sqrtLatex(k)}$.`, `分母在 $x = \\pm ${sqrtLatex(k)}$ 处为 $0$。`),
            `x^{2} - ${k}`,
            (x) => x * x - k,
            all,
            t(
              `The entry is negative at $x = 0$ and not negative at $x = 3$, so it passes through $0$ in between.`,
              `$x = 0$ 处的值为负，$x = 3$ 处不为负，所以它在两者之间经过 $0$。`,
            ),
          ],
          [
            `\\sqrt{x^{2} + ${k}}`,
            true,
            t(`$x^{2} + ${k} > 0$ for every $x$, so the root always has a value.`, `对每个 $x$ 都有 $x^{2} + ${k} > 0$，所以根式总有值。`),
            `x^{2} + ${k}`,
            (x) => x * x + k,
            all,
            t(`Every entry is positive, and the smallest is $${k}$ at $x = 0$.`, `每一项都为正，最小的是 $x = 0$ 处的 $${k}$。`),
          ],
          [
            `\\sqrt{x^{2} - ${k}}`,
            false,
            t(`$x^{2} - ${k} < 0$ for $x$ near $0$, where the root has no value.`, `当 $x$ 在 $0$ 附近时 $x^{2} - ${k} < 0$，根式没有值。`),
            `x^{2} - ${k}`,
            (x) => x * x - k,
            unit,
            t(
              `The entry at $x = 0$ is $-${k}$, negative, so the root has no value there.`,
              `$x = 0$ 处的值是 $-${k}$，为负，所以根式在那里没有值。`,
            ),
          ],
          [
            `\\ln(x^{2} + ${k})`,
            true,
            t(
              `$x^{2} + ${k} > 0$ for every $x$, so the logarithm always has a value.`,
              `对每个 $x$ 都有 $x^{2} + ${k} > 0$，所以对数总有值。`,
            ),
            `x^{2} + ${k}`,
            (x) => x * x + k,
            all,
            t(`Every entry is positive, and the smallest is $${k}$ at $x = 0$.`, `每一项都为正，最小的是 $x = 0$ 处的 $${k}$。`),
          ],
          [
            `\\ln|${poly([1, "x"], [c, ""])}|`,
            false,
            t(`The logarithm has no value at $x = ${-c}$, where the absolute value is $0$.`, `在 $x = ${-c}$ 处绝对值为 $0$，对数没有值。`),
            poly([1, "x"], [c, ""]),
            (x) => x + c,
            [-c - 1, -c, -c + 1],
            t(
              `The entry at $x = ${-c}$ is $0$, and the logarithm of $0$ does not exist.`,
              `$x = ${-c}$ 处的值为 $0$，而 $0$ 的对数不存在。`,
            ),
          ],
          [
            `e^{${c === 1 ? "" : c === -1 ? "-" : c}x} + \\sin ${k}x`,
            true,
            t(
              "Exponential and sine functions are continuous everywhere, and so is their sum.",
              "指数函数和正弦函数处处连续，它们的和也处处连续。",
            ),
            "f(x)",
            (x) => Math.exp(c * x) + Math.sin(k * x),
            unit,
            t(
              "There is no denominator, root or logarithm to test, and every input gives a value, as these do.",
              "没有分母、根式或对数需要检验，每个输入都像这几个一样有值。",
            ),
          ],
          [
            `\\frac{e^{x}}{\\cos x - ${k + 1}}`,
            true,
            t(`$\\cos x \\le 1 < ${k + 1}$, so the denominator is never $0$.`, `$\\cos x \\le 1 < ${k + 1}$，所以分母永不为 $0$。`),
            `\\cos x - ${k + 1}`,
            (x) => Math.cos(x) - (k + 1),
            [0, 1, 2, 3],
            t(
              `Every entry is negative, and since $\\cos x \\le 1$ it stays at most $-${k}$.`,
              `每一项都为负；因为 $\\cos x \\le 1$，它始终不超过 $-${k}$。`,
            ),
          ],
          [
            `\\frac{${c}}{\\sin x}`,
            false,
            t("The denominator is $0$ at $x = 0$.", "分母在 $x = 0$ 处为 $0$。"),
            "\\sin x",
            Math.sin,
            unit,
            t("The entry at $x = 0$ is $0$, so $f(0)$ does not exist.", "$x = 0$ 处的值为 $0$，所以 $f(0)$ 不存在。"),
          ],
          [
            `\\frac{x^{2} - ${k}}{e^{x} - 1}`,
            false,
            t("The denominator is $0$ at $x = 0$.", "分母在 $x = 0$ 处为 $0$。"),
            "e^{x} - 1",
            (x) => Math.exp(x) - 1,
            unit,
            t("The entry at $x = 0$ is $0$, so $f(0)$ does not exist.", "$x = 0$ 处的值为 $0$，所以 $f(0)$ 不存在。"),
          ],
          [
            `|x - ${k}| ${c < 0 ? "-" : "+"} ${poly([Math.abs(c), "x^{3}"])}`,
            true,
            t("Absolute values and polynomials are continuous everywhere.", "绝对值函数与多项式处处连续。"),
            "f(x)",
            (x) => Math.abs(x - k) + c * x ** 3,
            unit,
            t(
              "There is no denominator, root or logarithm to test, and every input gives a value, as these do.",
              "没有分母、根式或对数需要检验，每个输入都像这几个一样有值。",
            ),
          ],
          [
            `\\tan ${k}x`,
            false,
            t(`$\\tan ${k}x$ has no value where $\\cos ${k}x = 0$.`, `$\\tan ${k}x$ 在 $\\cos ${k}x = 0$ 处没有值。`),
            `\\cos ${k}x`,
            (x) => Math.cos(k * x),
            [0, Math.PI / (2 * k)],
            t(
              `At $x = \\frac{\\pi}{${2 * k}}$ the entry is $0$, so the tangent has no value there.`,
              `在 $x = \\frac{\\pi}{${2 * k}}$ 处值为 $0$，所以正切在那里没有值。`,
            ),
          ],
        ];
        const [f, holds, why, row, at, xs, shows] = rng.pick(forms);
        const labels = xs.map((x) => (x > 0 && !Number.isInteger(x) ? `\\frac{\\pi}{${2 * k}}` : String(x)));
        const testTable = valuesTable(xs, at, row, labels);
        return yesNoProblem(
          rng,
          t(`Is $f(x) = ${f}$ continuous for every real number $x$?`, `$f(x) = ${f}$ 对每个实数 $x$ 都连续吗？`),
          holds,
          walked(
            [
              [
                ["Look for the dangers", "寻找危险之处"],
                t(
                  "Each building block is continuous on its domain, so look only for a denominator that can be $0$, a root of a negative number or a logarithm of a non-positive one.",
                  "每个组成部分在其定义域上都连续，所以只需寻找可能为 $0$ 的分母、负数的平方根或非正数的对数。",
                ),
              ],
              [
                ["Decide", "判断"],
                t(
                  `${why.en} ${holds ? "So $f$ is continuous for every real $x$." : "So $f$ is not continuous for every real $x$."}`,
                  `${why["zh-CN"]}${holds ? "所以 $f$ 对每个实数 $x$ 都连续。" : "所以 $f$ 并非对每个实数 $x$ 都连续。"}`,
                ),
              ],
            ],
            t(`Test a few values:\n\n${testTable}\n\n${shows.en}`, `检验几个值：\n\n${testTable}\n\n${shows["zh-CN"]}`),
          ),
          holds
            ? t(`${why.en} Nothing in the formula ever fails.`, `${why["zh-CN"]}公式中没有任何地方出问题。`)
            : t(
                `${why.en} At that point $f$ has no value, so it cannot be continuous there.`,
                `${why["zh-CN"]}$f$ 在那一点没有值，所以不可能在那里连续。`,
              ),
        );
      },
    },
  ],
};

/** theIntermediateValueTheorem applies the IVT. */
export const theIntermediateValueTheorem: TopicDef = {
  id: "the-intermediate-value-theorem",
  title: t("The Intermediate Value Theorem", "介值定理"),
  summary: t(
    "Use the Intermediate Value Theorem to guarantee values and roots of continuous functions, and recognize when it does not apply.",
    "用介值定理保证连续函数取到某些值或有根，并识别它不适用的情形。",
  ),
  prerequisites: ["continuity-over-an-interval"],
  encompasses: [{ topic: "continuity-over-an-interval", weight: 0.3 }],
  xp: 12,
  standards: [],
  intro: t(
    `$f(x) = x^{2}$ is continuous on $[1, 2]$, with $f(1) = 1$ and $f(2) = 4$. Its graph is unbroken, so on the way from height $1$ to height $4$ it must pass height $2$; it does so at $x = \\sqrt{2}$.

Check: $1.41^{2} = 1.9881$ and $1.42^{2} = 2.0164$, so the graph crosses height $2$ between $1.41$ and $1.42$.

In this lesson we use the Intermediate Value Theorem to guarantee values and roots of continuous functions, and recognize when it does not apply.`,
    `$f(x) = x^{2}$ 在 $[1, 2]$ 上连续，$f(1) = 1$，$f(2) = 4$。它的图像不断开，所以从高度 $1$ 到高度 $4$ 的途中必然经过高度 $2$；它在 $x = \\sqrt{2}$ 处经过。

检验：$1.41^{2} = 1.9881$，$1.42^{2} = 2.0164$，所以图像在 $1.41$ 与 $1.42$ 之间穿过高度 $2$。

这节课我们用介值定理保证连续函数取到某些值或有根，并识别它不适用的情形。`,
  ),
  knowledgePoints: [
    {
      id: "values-guaranteed-by-the-ivt",
      title: t("Values guaranteed by the IVT", "介值定理保证的值"),
      explanation: t(
        "**Intermediate Value Theorem.** If $f$ is continuous on $[a, b]$ and $N$ is any number between $f(a)$ and $f(b)$, then $f(c) = N$ for at least one $c$ in $(a, b)$.\n\nThe theorem guarantees only the values between $f(a)$ and $f(b)$; $f$ may or may not reach others. For example, if $f(0) = -2$ and $f(3) = 5$, $f$ must take the value $1$ somewhere in $(0, 3)$, but it need not take $7$.\n\nCheck: $1$ lies between $-2$ and $5$, and $7$ does not.\n\n> **Watch out.** The theorem guarantees values; it does not rule others out. A value outside the range from $f(a)$ to $f(b)$ may still be taken, but nothing forces it.",
        "**介值定理** 若 $f$ 在 $[a, b]$ 上连续，$N$ 是介于 $f(a)$ 与 $f(b)$ 之间的任意数，则 $(a, b)$ 中至少有一个 $c$ 使 $f(c) = N$。\n\n定理只保证 $f(a)$ 与 $f(b)$ 之间的值；其他值 $f$ 可能取到，也可能取不到。例如，若 $f(0) = -2$，$f(3) = 5$，则 $f$ 一定在 $(0, 3)$ 中某处取到 $1$，但不一定取到 $7$。\n\n检验：$1$ 介于 $-2$ 与 $5$ 之间，$7$ 不在。\n\n> **注意。** 定理保证某些值，但不排除其他值。$f(a)$ 到 $f(b)$ 范围之外的值仍可能取到，只是没有什么能保证。",
      ),
      generate(rng) {
        const a = rng.int(-5, 3);
        const b = a + rng.int(2, 5);
        const p = rng.int(-9, 9);
        const q = rng.pick(range(-9, 9).filter((x) => Math.abs(x - p) >= 4));
        const [lo, hi] = [Math.min(p, q), Math.max(p, q)];
        const inside = rng.int(lo + 1, hi - 1);
        const outside = [lo - rng.int(1, 4), hi + rng.int(1, 4), rng.bool() ? hi + rng.int(5, 8) : lo - rng.int(5, 8)];
        const where = a + ((inside - p) * (b - a)) / (q - p);
        const whereText = Number.isInteger(where) ? `${where}` : `\\approx ${fmt(where)}`;
        return explainedChoice(rng, {
          prompt: t(
            `$f$ is continuous on $[${a}, ${b}]$, with $f(${a}) = ${p}$ and $f(${b}) = ${q}$. Which value must $f$ take somewhere in $(${a}, ${b})$?`,
            `$f$ 在 $[${a}, ${b}]$ 上连续，$f(${a}) = ${p}$，$f(${b}) = ${q}$。$f$ 在 $(${a}, ${b})$ 中一定能取到下列哪个值？`,
          ),
          correct: same(`$${inside}$`),
          wrong: outside.map((v) => ({
            option: same(`$${v}$`),
            why:
              v < lo
                ? t(
                    `$${v}$ is below both $${p}$ and $${q}$, so the theorem says nothing about it; $f$ may or may not reach it.`,
                    `$${v}$ 比 $${p}$ 和 $${q}$ 都小，定理对它什么也没说；$f$ 可能取到，也可能取不到。`,
                  )
                : t(
                    `$${v}$ is above both $${p}$ and $${q}$, so the theorem says nothing about it; $f$ may or may not reach it.`,
                    `$${v}$ 比 $${p}$ 和 $${q}$ 都大，定理对它什么也没说；$f$ 可能取到，也可能取不到。`,
                  ),
          })),
          solution: walked(
            [
              [
                ["Find the range between the ends", "找出两端之间的范围"],
                t(
                  `The values at the ends are $${p}$ and $${q}$, so the theorem guarantees every value from $${lo}$ to $${hi}$.`,
                  `两端的值是 $${p}$ 和 $${q}$，所以定理保证从 $${lo}$ 到 $${hi}$ 的每个值。`,
                ),
              ],
              [
                ["Pick the value inside", "选出范围内的值"],
                t(
                  `Only $${inside}$ lies strictly between $${lo}$ and $${hi}$, so $f(c) = ${inside}$ for some $c$ in $(${a}, ${b})$.`,
                  `只有 $${inside}$ 严格介于 $${lo}$ 与 $${hi}$ 之间，所以 $(${a}, ${b})$ 中有某个 $c$ 使 $f(c) = ${inside}$。`,
                ),
              ],
            ],
            t(
              `The straight line from $(${a}, ${p})$ to $(${b}, ${q})$ is one such continuous function, and it reaches height $${inside}$ at $x ${Number.isInteger(where) ? "=" : ""} ${whereText}$, inside $(${a}, ${b})$.\n\nThat same line never reaches the other options, which shows the theorem cannot promise them.`,
              `从 $(${a}, ${p})$ 到 $(${b}, ${q})$ 的直线就是这样一个连续函数，它在 $x ${Number.isInteger(where) ? "=" : ""} ${whereText}$ 处到达高度 $${inside}$，位于 $(${a}, ${b})$ 内。\n\n这条直线取不到其他选项，说明定理不能保证它们。`,
            ),
          ),
        });
      },
    },
    {
      id: "locating-a-root-with-the-ivt",
      title: t("Locating a root with the IVT", "用介值定理确定根的位置"),
      explanation: t(
        "If $f$ is continuous and $f(a)$ and $f(b)$ have opposite signs, then $0$ lies between them, so $f$ has a root in $(a, b)$. In a table of values, look for consecutive entries where the sign changes.\n\nFor example, if $f(1) = 3$ and $f(2) = -4$, $f$ has a root in $(1, 2)$.\n\nCheck: $0$ lies between $-4$ and $3$, so the theorem with $N = 0$ applies.\n\n> **Watch out.** No sign change does not mean no root: $f$ could dip below $0$ and come back. The theorem only guarantees roots where the sign changes.",
        "若 $f$ 连续，且 $f(a)$ 与 $f(b)$ 异号，则 $0$ 介于二者之间，所以 $f$ 在 $(a, b)$ 内有根。在数值表中，找出符号发生变化的相邻两项。\n\n例如，若 $f(1) = 3$，$f(2) = -4$，则 $f$ 在 $(1, 2)$ 内有根。\n\n检验：$0$ 介于 $-4$ 与 $3$ 之间，所以可以对 $N = 0$ 用定理。\n\n> **注意。** 符号不变并不说明没有根：$f$ 可能降到 $0$ 以下又回来。定理只在符号改变处保证有根。",
      ),
      generate(rng) {
        const start = rng.int(-4, 1);
        const xs = range(start, start + 4);
        const change = rng.int(0, 3);
        const s = rng.sign();
        const ys = xs.map((_, i) => (i <= change ? s : -s) * rng.int(1, 12));
        const at = (i: number) => same(`$(${xs[i]}, ${xs[i + 1]})$`);
        const values = table(["$x$", ...xs.map((x) => `$${x}$`)], ["$f(x)$", ...ys.map((y) => `$${y}$`)]);
        const y0 = ys[change]!;
        const y1 = ys[change + 1]!;
        const x0 = xs[change]!;
        const cross = x0 + y0 / (y0 - y1);
        return explainedChoice(rng, {
          prompt: t(
            `$f$ is continuous, and some of its values are shown.\n\n${values}\n\nOn which interval does the Intermediate Value Theorem guarantee a root of $f$?`,
            `$f$ 连续，它的一些值如下表。\n\n${values}\n\n介值定理保证 $f$ 在哪个区间内有根？`,
          ),
          correct: at(change),
          wrong: [0, 1, 2, 3]
            .filter((i) => i !== change)
            .map((i) => ({
              option: at(i),
              why: t(
                `$f(${xs[i]}) = ${ys[i]}$ and $f(${xs[i + 1]}) = ${ys[i + 1]}$ have the same sign, so the theorem does not force a root there.`,
                `$f(${xs[i]}) = ${ys[i]}$ 与 $f(${xs[i + 1]}) = ${ys[i + 1]}$ 同号，所以定理不能保证那里有根。`,
              ),
            })),
          solution: walked(
            [
              [
                ["Mark the signs", "标出符号"],
                t(
                  `The values are ${s > 0 ? "positive" : "negative"} up to $x = ${x0}$ and ${s > 0 ? "negative" : "positive"} from $x = ${xs[change + 1]}$ on.`,
                  `直到 $x = ${x0}$ 函数值都为${s > 0 ? "正" : "负"}，从 $x = ${xs[change + 1]}$ 起为${s > 0 ? "负" : "正"}。`,
                ),
              ],
              [
                ["Find the change", "找出变号处"],
                t(
                  `$f(${x0}) = ${y0}$ and $f(${xs[change + 1]}) = ${y1}$ have opposite signs, so $0$ lies between them and $f$ has a root in $(${x0}, ${xs[change + 1]})$.`,
                  `$f(${x0}) = ${y0}$ 与 $f(${xs[change + 1]}) = ${y1}$ 异号，$0$ 介于二者之间，所以 $f$ 在 $(${x0}, ${xs[change + 1]})$ 内有根。`,
                ),
              ],
            ],
            t(
              `The straight line joining $(${x0}, ${y0})$ and $(${xs[change + 1]}, ${y1})$ crosses $0$ at $x \\approx ${fmt(cross)}$, which lies in $(${x0}, ${xs[change + 1]})$.\n\nAny continuous $f$ through those two points must cross $0$ in the same interval, though not necessarily at the same place.`,
              `连接 $(${x0}, ${y0})$ 与 $(${xs[change + 1]}, ${y1})$ 的直线在 $x \\approx ${fmt(cross)}$ 处穿过 $0$，位于 $(${x0}, ${xs[change + 1]})$ 内。\n\n任何经过这两点的连续函数 $f$ 都必须在同一区间内穿过 $0$，只是位置不一定相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "when-the-ivt-applies",
      title: t("When the IVT applies", "介值定理何时适用"),
      explanation: t(
        "The theorem needs $f$ to be continuous on the **whole** interval $[a, b]$. For example, $f(x) = \\frac{1}{x}$ has $f(-1) = -1 < 0 < 1 = f(1)$, yet it has no root in $(-1, 1)$: it is not continuous at $0$, so the theorem says nothing.\n\nCheck: $\\frac{1}{-0.01} = -100$ and $\\frac{1}{0.01} = 100$; the values jump across $0$ without ever equalling it.\n\n> **Watch out.** Check continuity on the whole closed interval before using the theorem. A sign change across a vertical asymptote is not a root.",
        "定理要求 $f$ 在**整个**区间 $[a, b]$ 上连续。例如，$f(x) = \\frac{1}{x}$ 满足 $f(-1) = -1 < 0 < 1 = f(1)$，但它在 $(-1, 1)$ 内没有根：它在 $0$ 处不连续，所以定理不能用。\n\n检验：$\\frac{1}{-0.01} = -100$，$\\frac{1}{0.01} = 100$；函数值跨过 $0$，却从不等于 $0$。\n\n> **注意。** 用定理之前，先检查函数在整个闭区间上是否连续。跨过竖直渐近线的变号不是根。",
      ),
      generate(rng) {
        const c = rng.int(-4, 4);
        const a = c - rng.int(1, 3);
        const b = c + rng.int(1, 3);
        const k = rng.int(1, 6);
        const broken = rng.bool();
        // Both functions are negative at a and positive at b.
        const f = broken ? `\\frac{${k}}{${bare(c)}}` : poly([k, "x"], [-k * c, ""]);
        const g = (x: number) => (broken ? k / (x - c) : k * (x - c));
        const fa = broken ? Q.of(k, a - c) : Q.of(k * (a - c));
        const fb = broken ? Q.of(k, b - c) : Q.of(k * (b - c));
        const xs = [a, c - 0.01, c + 0.01, b];
        return yesNoProblem(
          rng,
          t(
            `Let $f(x) = ${f}$. Does the Intermediate Value Theorem guarantee that $f$ has a root in $(${a}, ${b})$?`,
            `设 $f(x) = ${f}$。介值定理能否保证 $f$ 在 $(${a}, ${b})$ 内有根？`,
          ),
          !broken,
          walked(
            [
              [
                ["Check the signs", "检查符号"],
                t(
                  `$f(${a}) = ${fa.toLatex()}$ is negative and $f(${b}) = ${fb.toLatex()}$ is positive.`,
                  `$f(${a}) = ${fa.toLatex()}$ 为负，$f(${b}) = ${fb.toLatex()}$ 为正。`,
                ),
              ],
              [
                ["Check continuity", "检查连续性"],
                broken
                  ? t(
                      `$f$ is not defined at $x = ${c}$, which lies in $[${a}, ${b}]$, so $f$ is not continuous there and the theorem does not apply.`,
                      `$f$ 在 $[${a}, ${b}]$ 中的 $x = ${c}$ 处没有定义，所以在那里不连续，定理不适用。`,
                    )
                  : t(
                      `$f$ is a polynomial, so it is continuous on $[${a}, ${b}]$, and the theorem guarantees a root.`,
                      `$f$ 是多项式，在 $[${a}, ${b}]$ 上连续，所以定理保证有根。`,
                    ),
              ],
            ],
            t(
              `Evaluate $f$ at the ends and just beside $x = ${c}$:\n\n${valuesTable(xs, g)}\n\n${broken ? `The values leap from far below $0$ to far above it across $x = ${c}$, and $f$ is never $0$.` : `The values rise steadily through $0$, and indeed $f(${c}) = 0$.`}`,
              `计算 $f$ 在两端及 $x = ${c}$ 两旁的值：\n\n${valuesTable(xs, g)}\n\n${broken ? `越过 $x = ${c}$ 时，值从远低于 $0$ 跳到远高于 $0$，而 $f$ 从不为 $0$。` : `这些值平稳地穿过 $0$，事实上 $f(${c}) = 0$。`}`,
            ),
          ),
          broken
            ? t(
                `The signs do differ, but $f$ is not continuous at $x = ${c}$ inside $[${a}, ${b}]$, so the theorem does not apply.`,
                `两端确实异号，但 $f$ 在 $[${a}, ${b}]$ 内的 $x = ${c}$ 处不连续，所以定理不适用。`,
              )
            : t(
                `$f$ is a polynomial, so it is continuous on $[${a}, ${b}]$, and the ends have opposite signs.`,
                `$f$ 是多项式，在 $[${a}, ${b}]$ 上连续，且两端异号。`,
              ),
        );
      },
    },
  ],
};

/** removingPointDiscontinuities redefines a function at a hole. */
export const removingPointDiscontinuities: TopicDef = {
  id: "removing-point-discontinuities",
  title: t("Removing Point Discontinuities", "消除可去间断点"),
  summary: t(
    "Redefine a function at a point discontinuity, using its limit there, to make it continuous.",
    "用函数在可去间断点处的极限重新定义该点的值，使函数连续。",
  ),
  prerequisites: ["point-discontinuities", "calculating-limits-of-radical-functions-using-conjugate-multiplication"],
  encompasses: [
    { topic: "point-discontinuities", weight: 0.4 },
    { topic: "calculating-limits-of-radical-functions-using-conjugate-multiplication", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `$\\frac{\\sqrt{x} - 2}{x - 4}$ is $\\frac{0}{0}$ at $x = 4$. Multiplying top and bottom by the conjugate $\\sqrt{x} + 2$ turns it into $\\frac{1}{\\sqrt{x} + 2}$ for $x \\ne 4$, so its limit at $4$ is $\\frac{1}{4}$. The graph has a hole at $\\left(4, \\frac{1}{4}\\right)$, waiting to be filled.

Check: at $x = 4.01$ the quotient is about $0.2498$, close to $0.25$.

In this lesson we remove a point discontinuity by defining or redefining the function at that point as its limit there.`,
    `$\\frac{\\sqrt{x} - 2}{x - 4}$ 在 $x = 4$ 处为 $\\frac{0}{0}$。分子分母同乘共轭式 $\\sqrt{x} + 2$，当 $x \\ne 4$ 时它变成 $\\frac{1}{\\sqrt{x} + 2}$，所以它在 $4$ 处的极限是 $\\frac{1}{4}$。图像在 $\\left(4, \\frac{1}{4}\\right)$ 处有一个空心点，等着被填上。

检验：$x = 4.01$ 时商约为 $0.2498$，接近 $0.25$。

这节课我们把函数在可去间断点处的值定义（或重新定义）为它在该点的极限，从而消除这个间断点。`,
  ),
  knowledgePoints: [
    {
      id: "redefining-a-function-at-a-hole",
      title: t("Redefining a function at a hole", "在空心点处重新定义函数"),
      explanation: t(
        "A point discontinuity is removed by defining $f(a)$ to be $\\lim_{x \\to a} f(x)$. For a quotient that is $\\frac{0}{0}$ at $a$, factor, cancel and substitute:\n\n$$\\frac{x^{3} - 8}{x - 2} = x^{2} + 2x + 4 \\; (x \\ne 2), \\text{ so define } f(2) = 12.$$\n\nCheck: at $x = 2.01$ the quotient is $12.0601$, close to $12$.\n\n> **Watch out.** The given value of $f(a)$ plays no part. The new value is the limit, found from the formula for $x \\ne a$.",
        "把 $f(a)$ 定义为 $\\lim_{x \\to a} f(x)$，就能消除可去间断点。对于在 $a$ 处为 $\\frac{0}{0}$ 的商，先因式分解、约分再代入：\n\n$$\\frac{x^{3} - 8}{x - 2} = x^{2} + 2x + 4 \\; (x \\ne 2), \\text{ 所以定义 } f(2) = 12.$$\n\n检验：$x = 2.01$ 时商为 $12.0601$，接近 $12$。\n\n> **注意。** 原来给定的 $f(a)$ 不起作用。新的值是极限，由 $x \\ne a$ 时的表达式求得。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const cubic = rng.bool(0.4);
        let top: string;
        let answer: number;
        let simple: string;
        let at: string;
        let quotient: (x: number) => number;
        if (cubic) {
          top = poly([1, "x^{3}"], [-(a ** 3), ""]);
          answer = 3 * a * a;
          simple = poly([1, "x^{2}"], [a, "x"], [a * a, ""]);
          at = `(${a})^{2} + ${paren(a)}(${a}) + ${a * a}`;
          quotient = (x) => (x ** 3 - a ** 3) / (x - a);
        } else {
          const m = rng.pick([1, 2, 3, -1, -2]);
          const b = rng.pick(range(-6, 6).filter((x) => x !== a));
          top = quadraticFrom(m, a, b);
          answer = m * (a - b);
          simple = poly([m, "x"], [-m * b, ""]);
          at = `${m === 1 ? "" : m === -1 ? "-" : m}(${a})${-m * b === 0 ? "" : ` ${-m * b < 0 ? "-" : "+"} ${Math.abs(m * b)}`}`;
          quotient = (x) => (m * (x - a) * (x - b)) / (x - a);
        }
        const v = rng.pick(range(-9, 9).filter((x) => x !== answer));
        const f = casesLatex([
          [`\\frac{${top}}{${bare(a)}}`, `x \\ne ${a}`],
          [String(v), `x = ${a}`],
        ]);
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ To what value should $f(${a})$ be changed to make $f$ continuous at $x = ${a}$?`,
            `设 $$${f}$$ 应把 $f(${a})$ 改为多少，才能使 $f$ 在 $x = ${a}$ 处连续？`,
          ),
          answer,
          wrong: [v, 0, -answer, a],
          solution: walked(
            [
              [
                ["Simplify for x ≠ a", "化简 x ≠ a 时的式子"],
                t(`Factor the top and cancel $${fac(a)}$:`, `把分子因式分解并约去 $${fac(a)}$：`),
                [`\\frac{${top}}{${bare(a)}} = ${simple}`],
              ],
              [
                ["Find the limit", "求极限"],
                t(`Substitute $x = ${a}$ into the simplified formula:`, `把 $x = ${a}$ 代入化简后的式子：`),
                [`${at} = ${answer}`],
              ],
              [
                ["Redefine", "重新定义"],
                t(
                  `The limit is $${answer}$ but $f(${a}) = ${v}$, so change it to $f(${a}) = ${answer}$.`,
                  `极限是 $${answer}$，而 $f(${a}) = ${v}$，所以改为 $f(${a}) = ${answer}$。`,
                ),
              ],
            ],
            t(
              `Evaluate the quotient just beside $x = ${a}$:\n\n${nearTable(a, quotient)}\n\nThe values close in on $${answer}$ from both sides, not on $${v}$.`,
              `计算商在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, quotient)}\n\n这些值从两侧逼近 $${answer}$，而不是 $${v}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "removing-a-discontinuity-of-a-radical-quotient",
      title: t("Removing a discontinuity of a radical quotient", "消除根式商的间断点"),
      explanation: t(
        "For a quotient with a square root, find the limit by multiplying by the conjugate:\n\n$$\\frac{\\sqrt{x + 5} - 3}{x - 4} = \\frac{x + 5 - 9}{(x - 4)(\\sqrt{x + 5} + 3)} = \\frac{1}{\\sqrt{x + 5} + 3} \\to \\frac{1}{6}.$$\n\nSo defining $f(4) = \\frac{1}{6}$ removes the discontinuity.\n\nCheck: at $x = 4.01$ the quotient is about $0.1666$, close to $\\frac{1}{6} \\approx 0.1667$.\n\n> **Watch out.** Multiply both top and bottom by the conjugate $\\sqrt{x + 5} + 3$. Multiplying only the top changes the function.",
        "对含平方根的商，乘以共轭式求极限：\n\n$$\\frac{\\sqrt{x + 5} - 3}{x - 4} = \\frac{x + 5 - 9}{(x - 4)(\\sqrt{x + 5} + 3)} = \\frac{1}{\\sqrt{x + 5} + 3} \\to \\frac{1}{6}.$$\n\n所以定义 $f(4) = \\frac{1}{6}$ 就消除了间断点。\n\n检验：$x = 4.01$ 时商约为 $0.1666$，接近 $\\frac{1}{6} \\approx 0.1667$。\n\n> **注意。** 分子和分母都要乘以共轭式 $\\sqrt{x + 5} + 3$。只乘分子会改变函数。",
      ),
      generate(rng) {
        const d = rng.int(1, 6);
        const e = rng.int(-6, 8);
        const c = d * d - e;
        const k = rng.pick([1, 1, 2, 3]);
        const answer = Q.of(k, 2 * d);
        const inner = poly([1, "x"], [c, ""]);
        const top = k === 1 ? `\\sqrt{${inner}} - ${d}` : `${k}\\left(\\sqrt{${inner}} - ${d}\\right)`;
        const last = answer.toLatex() === `\\frac{${k}}{${2 * d}}` ? "" : ` = ${answer.toLatex()}`;
        const quotient = (x: number) => (k * (Math.sqrt(x + c) - d)) / (x - e);
        return numberProblem({
          prompt: t(
            `$f(x) = \\frac{${top}}{${bare(e)}}$ has a point discontinuity at $x = ${e}$. What value of $f(${e})$ removes it?`,
            `$f(x) = \\frac{${top}}{${bare(e)}}$ 在 $x = ${e}$ 处有可去间断点。$f(${e})$ 取何值能消除它？`,
          ),
          answer,
          wrong: [Q.of(k, d), Q.of(k * 2 * d), Q.zero, Q.of(k, d * d)],
          solution: walked(
            [
              [
                ["Multiply by the conjugate", "乘以共轭式"],
                t(
                  `Multiply top and bottom by $\\sqrt{${inner}} + ${d}$. The top becomes $${k === 1 ? "" : k}(${inner} - ${d * d})$, which has the factor $${bare(e)}$:`,
                  `分子分母同乘 $\\sqrt{${inner}} + ${d}$。分子变为 $${k === 1 ? "" : k}(${inner} - ${d * d})$，含有因式 $${bare(e)}$：`,
                ),
                [
                  `\\frac{${top}}{${bare(e)}} = \\frac{${k === 1 ? bare(e) : `${k}\\left(${bare(e)}\\right)`}}{${fac(e)}\\left(\\sqrt{${inner}} + ${d}\\right)} = \\frac{${k}}{\\sqrt{${inner}} + ${d}}`,
                ],
              ],
              [
                ["Substitute", "代入"],
                t(
                  `At $x = ${e}$ the root is $\\sqrt{${d * d}} = ${d}$, so the limit is`,
                  `在 $x = ${e}$ 处根式为 $\\sqrt{${d * d}} = ${d}$，所以极限是`,
                ),
                [`\\frac{${k}}{${d} + ${d}} = \\frac{${k}}{${2 * d}}${last}`],
              ],
            ],
            t(
              `Evaluate the original quotient just beside $x = ${e}$:\n\n${nearTable(e, quotient)}\n\nThe values close in on $${answer.toLatex()} \\approx ${fmt(answer.toNumber())}$, so that is the value of $f(${e})$ that fills the hole.`,
              `计算原来的商在 $x = ${e}$ 两旁的值：\n\n${nearTable(e, quotient)}\n\n这些值逼近 $${answer.toLatex()} \\approx ${fmt(answer.toNumber())}$，所以 $f(${e})$ 取这个值就填上了空心点。`,
            ),
          ),
        });
      },
    },
  ],
};

/** removingJumpDiscontinuities chooses constants that close jumps. */
export const removingJumpDiscontinuities: TopicDef = {
  id: "removing-jump-discontinuities",
  title: t("Removing Jump Discontinuities", "消除跳跃间断点"),
  summary: t(
    "Choose the constants of a piecewise function so that its jumps close and it is continuous everywhere.",
    "选取分段函数中的常数，使跳跃闭合、函数处处连续。",
  ),
  prerequisites: ["jump-discontinuities", "further-continuity-of-piecewise-functions"],
  encompasses: [
    { topic: "jump-discontinuities", weight: 0.3 },
    { topic: "further-continuity-of-piecewise-functions", weight: 0.5 },
  ],
  xp: 14,
  standards: [],
  intro: t(
    `A constant in one piece moves that whole piece up or down. For example, to make $f(x) = 2x + k$ for $x < 1$ and $f(x) = x^{2} + 4$ for $x \\ge 1$ continuous, the left piece must arrive at $f(1) = 5$: $2 + k = 5$, so $k = 3$.

Check: with $k = 3$, $f(0.99) = 4.98$ and $f(1.01) = 5.0201$, both close to $f(1) = 5$.

In this lesson we choose constants that close jumps, when a constant appears in both pieces and when there are two break points.`,
    `某一段中的常数会使这一整段上下平移。例如，要使 $x < 1$ 时 $f(x) = 2x + k$、$x \\ge 1$ 时 $f(x) = x^{2} + 4$ 连续，左段必须到达 $f(1) = 5$：$2 + k = 5$，所以 $k = 3$。

检验：取 $k = 3$，$f(0.99) = 4.98$，$f(1.01) = 5.0201$，都接近 $f(1) = 5$。

这节课我们选取常数使跳跃闭合，包括常数同时出现在两段中的情形，以及有两个分段点的情形。`,
  ),
  knowledgePoints: [
    {
      id: "a-constant-in-both-pieces",
      title: t("A constant in both pieces", "两段中都含有常数"),
      explanation: t(
        "A jump cannot be removed by changing one value: the two pieces themselves must meet. When the constant appears in both pieces, set them equal at the break point and collect the constant on one side:\n\n$$f(x) = \\begin{cases} kx^{2} + 1 & x < 2 \\\\ kx + 7 & x \\ge 2 \\end{cases}: \\quad 4k + 1 = 2k + 7 \\implies k = 3.$$\n\nCheck: with $k = 3$, $f(1.99) \\approx 12.88$ and $f(2.01) = 13.03$, both close to $f(2) = 13$.\n\n> **Watch out.** Collect the $k$ terms on one side before dividing. Dividing by $a^{2} + a$ instead of $a^{2} - a$ is a sign slip.",
        "跳跃不能靠改变一个函数值来消除：两段本身必须接上。当常数出现在两段中时，令它们在分段点处相等，并把常数移到同一边：\n\n$$f(x) = \\begin{cases} kx^{2} + 1 & x < 2 \\\\ kx + 7 & x \\ge 2 \\end{cases}: \\quad 4k + 1 = 2k + 7 \\implies k = 3.$$\n\n检验：取 $k = 3$，$f(1.99) \\approx 12.88$，$f(2.01) = 13.03$，都接近 $f(2) = 13$。\n\n> **注意。** 先把含 $k$ 的项移到同一边再相除。除以 $a^{2} + a$ 而不是 $a^{2} - a$ 是符号错误。",
      ),
      generate(rng) {
        const a = rng.pick([-3, -2, 2, 3, 4]);
        const c1 = rng.int(-6, 6);
        const c2 = rng.pick(range(-9, 9).filter((x) => x !== c1));
        const k = Q.of(c2 - c1, a * a - a);
        const tail = (c: number) => (c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`);
        const f = casesLatex([
          [`kx^{2}${tail(c1)}`, `x < ${a}`],
          [`kx${tail(c2)}`, `x \\ge ${a}`],
        ]);
        const kv = k.toNumber();
        const meet = a * kv + c2;
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ Find the value of $k$ that makes $f$ continuous everywhere.`,
            `设 $$${f}$$ 求使 $f$ 处处连续的 $k$ 的值。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [Q.of(c2 - c1, a * a + a), Q.of(c1 - c2, a * a - a), Q.of(c2 - c1, a * a)],
          solution: walked(
            [
              [
                ["Set the pieces equal", "令两段相等"],
                t(
                  `Each piece is continuous, so only $x = ${a}$ matters. Substitute it into both pieces and set them equal:`,
                  `每一段都连续，所以只需考虑 $x = ${a}$。把它代入两段并令其相等：`,
                ),
                [`${a * a}k${tail(c1)} = ${a}k${tail(c2)}`],
              ],
              [
                ["Solve", "求解"],
                t("Collect the $k$ terms on the left:", "把含 $k$ 的项移到左边："),
                [`${a * a - a}k = ${c2 - c1}`, `k = ${k.toLatex()}`],
              ],
            ],
            t(
              `With $k = ${k.toLatex()}$, evaluate $f$ just beside $x = ${a}$:\n\n${nearTable(
                a,
                (x) => kv * x * x + c1,
                (x) => kv * x + c2,
              )}\n\nBoth sides close in on $${fmt(meet)}$, so the jump is closed.`,
              `取 $k = ${k.toLatex()}$，计算 $f$ 在 $x = ${a}$ 两旁的值：\n\n${nearTable(
                a,
                (x) => kv * x * x + c1,
                (x) => kv * x + c2,
              )}\n\n两侧都逼近 $${fmt(meet)}$，所以跳跃闭合了。`,
            ),
          ),
        });
      },
    },
    {
      id: "two-constants-and-two-break-points",
      title: t("Two constants and two break points", "两个常数与两个分段点"),
      explanation: t(
        "With two break points there are two conditions, one at each, which give two equations for two constants. For a middle piece $ax + b$ between $x = p$ and $x = q$, the line must pass through the end of the left piece at $p$ and the start of the right piece at $q$.\n\nFor example, with $x^{2}$ for $x < 0$, $ax + b$ for $0 \\le x \\le 1$ and $3$ for $x > 1$: at $0$, $b = 0$; at $1$, $a + b = 3$; so $a = 3$ and $b = 0$.\n\nCheck: the middle line $3x$ passes through $(0, 0)$, where $x^{2}$ ends, and through $(1, 3)$, where the constant piece starts.\n\n> **Watch out.** Match each break point with the outer piece on its own side: the left piece at $p$ and the right piece at $q$. Mixing them up gives the wrong pair.",
        "有两个分段点就有两个条件，每个分段点一个，得到关于两个常数的两个方程。若中间一段 $ax + b$ 位于 $x = p$ 与 $x = q$ 之间，这条直线必须经过左段在 $p$ 处的端点，以及右段在 $q$ 处的起点。\n\n例如，$x < 0$ 时为 $x^{2}$，$0 \\le x \\le 1$ 时为 $ax + b$，$x > 1$ 时为 $3$：在 $0$ 处 $b = 0$；在 $1$ 处 $a + b = 3$；所以 $a = 3$，$b = 0$。\n\n检验：中间的直线 $3x$ 经过 $x^{2}$ 结束处的 $(0, 0)$，也经过常数段开始处的 $(1, 3)$。\n\n> **注意。** 每个分段点都要与它那一侧的外段匹配：在 $p$ 处用左段，在 $q$ 处用右段。弄混了就会得到错误的一对数。",
      ),
      generate(rng) {
        const p = rng.int(-3, 0);
        const q = p + rng.int(1, 3);
        const a = rng.nonZero(-4, 4);
        const b = rng.int(-6, 6);
        const line = (x: number) => a * x + b;
        // Left piece ±x² + c through (p, line(p)); right piece mx + d through (q, line(q)).
        const s = rng.sign();
        const c = line(p) - s * p * p;
        const m = rng.pick(range(-3, 3).filter((x) => x !== a));
        const d = line(q) - m * q;
        const left = poly([s, "x^{2}"], [c, ""]);
        const right = poly([m, "x"], [d, ""]);
        const f = casesLatex([
          [left, `x < ${p}`],
          ["ax + b", `${p} \\le x \\le ${q}`],
          [right, `x > ${q}`],
        ]);
        const lp = line(p);
        const lq = line(q);
        const atP = p === 0 ? "b" : `${poly([p, "a"])} + b`;
        const atQ = `${poly([q, "a"])} + b`;
        const g = (x: number) => (x < p ? s * x * x + c : x > q ? m * x + d : line(x));
        const xs = [p - 0.01, p + 0.01, q - 0.01, q + 0.01].map((x) => Math.round(x * 100) / 100);
        return pointProblem({
          prompt: t(
            `Let $$${f}$$ Find $a$ and $b$ so that $f$ is continuous everywhere. Answer as $(a, b)$.`,
            `设 $$${f}$$ 求使 $f$ 处处连续的 $a$ 和 $b$。以 $(a, b)$ 的形式作答。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [
            [b, a],
            [-a, b],
          ],
          solution: walked(
            [
              [
                [`Match at x = ${p}`, `在 x = ${p} 处相接`],
                t(
                  `The left piece ends at height $${lp}$ there, so the middle line must too:`,
                  `左段在那里结束于高度 $${lp}$，所以中间的直线也必须如此：`,
                ),
                [`${atP} = ${lp}`],
              ],
              [
                [`Match at x = ${q}`, `在 x = ${q} 处相接`],
                t(`The right piece starts at height $${lq}$ there:`, `右段在那里从高度 $${lq}$ 开始：`),
                [`${atQ} = ${lq}`],
              ],
              [
                ["Solve", "求解"],
                t(`Subtract the first equation from the second:`, `用第二个方程减去第一个方程：`),
                [`${q - p}a = ${lq - lp}`, `a = ${a}, \\quad b = ${b}`],
              ],
            ],
            t(
              `With $a = ${a}$ and $b = ${b}$, evaluate $f$ just beside both break points:\n\n${valuesTable(xs, g)}\n\nThe two values beside $x = ${p}$ are close to $${lp}$, and the two beside $x = ${q}$ are close to $${lq}$, so neither break point jumps.`,
              `取 $a = ${a}$，$b = ${b}$，计算 $f$ 在两个分段点两旁的值：\n\n${valuesTable(xs, g)}\n\n$x = ${p}$ 两旁的两个值都接近 $${lp}$，$x = ${q}$ 两旁的两个值都接近 $${lq}$，所以两个分段点都没有跳跃。`,
            ),
          ),
        });
      },
    },
  ],
};

/** removingDiscontinuitiesFromRationalFunctions removes holes of rational functions. */
export const removingDiscontinuitiesFromRationalFunctions: TopicDef = {
  id: "removing-discontinuities-from-rational-functions",
  title: t("Removing Discontinuities From Rational Functions", "消除有理函数的间断点"),
  summary: t(
    "Find which discontinuities of a rational function can be removed, and the values that remove them.",
    "找出有理函数中哪些间断点可以消除，以及消除它们所需的值。",
  ),
  prerequisites: ["removing-point-discontinuities", "discontinuities-due-to-vertical-asymptotes"],
  encompasses: [
    { topic: "removing-point-discontinuities", weight: 0.4 },
    { topic: "discontinuities-due-to-vertical-asymptotes", weight: 0.4 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `$\\frac{x - 1}{(x - 1)(x + 2)}$ has two zeros of the denominator. The factor $x - 1$ cancels, leaving $\\frac{1}{x + 2}$, so $x = 1$ is a hole; the factor $x + 2$ stays, so $x = -2$ is a vertical asymptote.

Check: at $x = 1.01$ the quotient is about $0.332$, close to $\\frac{1}{3}$, while at $x = -1.99$ it is $100$.

In this lesson we find which discontinuities of a rational function can be removed, and the values that remove them.`,
    `$\\frac{x - 1}{(x - 1)(x + 2)}$ 的分母有两个零点。因式 $x - 1$ 能约去，剩下 $\\frac{1}{x + 2}$，所以 $x = 1$ 处是空心点；因式 $x + 2$ 保留，所以 $x = -2$ 是竖直渐近线。

检验：$x = 1.01$ 时商约为 $0.332$，接近 $\\frac{1}{3}$；而 $x = -1.99$ 时它是 $100$。

这节课我们找出有理函数中哪些间断点可以消除，以及消除它们所需的值。`,
  ),
  knowledgePoints: [
    {
      id: "the-value-that-removes-a-hole",
      title: t("The value that removes a hole", "消除空心点所需的值"),
      explanation: t(
        "Factor the rational function. A factor that cancels marks a removable discontinuity; define $f$ there as the value of the simplified function:\n\n$$\\frac{x^{2} - 1}{x^{2} + 2x - 3} = \\frac{(x - 1)(x + 1)}{(x - 1)(x + 3)} = \\frac{x + 1}{x + 3}.$$\n\nSo defining $f(1) = \\frac{1}{2}$ removes the discontinuity at $x = 1$. The one at $x = -3$ cannot be removed.\n\nCheck: at $x = 1.01$ the quotient is $\\frac{2.01}{4.01} \\approx 0.501$, close to $\\frac{1}{2}$.\n\n> **Watch out.** Substitute into the simplified quotient, not the original one, and only at the zero whose factor cancels.",
        "把有理函数因式分解。能约去的因式对应可去间断点；把 $f$ 在该点的值定义为化简后函数的值：\n\n$$\\frac{x^{2} - 1}{x^{2} + 2x - 3} = \\frac{(x - 1)(x + 1)}{(x - 1)(x + 3)} = \\frac{x + 1}{x + 3}.$$\n\n所以定义 $f(1) = \\frac{1}{2}$ 就消除了 $x = 1$ 处的间断点。$x = -3$ 处的间断点无法消除。\n\n检验：$x = 1.01$ 时商为 $\\frac{2.01}{4.01} \\approx 0.501$，接近 $\\frac{1}{2}$。\n\n> **注意。** 要代入化简后的商，而不是原来的商，并且只在因式被约去的那个零点处代入。",
      ),
      generate(rng) {
        const [a, b, c] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const m = rng.pick([1, 1, 2, -1, 3]);
        const answer = Q.of(m * (a - b), a - c);
        const g = (x: number) => (m * (x - a) * (x - b)) / ((x - a) * (x - c));
        return numberProblem({
          prompt: t(
            `$f(x) = \\frac{${quadraticFrom(m, a, b)}}{${quadraticFrom(1, a, c)}}$ has one removable discontinuity. What value of $f$ at that point removes it?`,
            `$f(x) = \\frac{${quadraticFrom(m, a, b)}}{${quadraticFrom(1, a, c)}}$ 有一个可去间断点。$f$ 在该点取何值能消除它？`,
          ),
          answer,
          wrong: [Q.of(m * (c - b), c - a), Q.of(m * (a - b)), Q.of(a), Q.of(m)],
          solution: walked(
            [
              [
                ["Factor and cancel", "因式分解并约分"],
                t(
                  `The factor $${fac(a)}$ is common to both, so the discontinuity at $x = ${a}$ is removable:`,
                  `分子分母都有因式 $${fac(a)}$，所以 $x = ${a}$ 处的间断点可去：`,
                ),
                [
                  `f(x) = \\frac{${times(m)}${fac(a)}${fac(b)}}{${fac(a)}${fac(c)}} = \\frac{${poly([m, "x"], [-m * b, ""])}}{${bare(c)}} \\quad (x \\ne ${a})`,
                ],
              ],
              [
                ["Substitute", "代入"],
                t(`Put $x = ${a}$ into the simplified quotient:`, `把 $x = ${a}$ 代入化简后的商：`),
                [`\\frac{${m * (a - b)}}{${a - c}} = ${answer.toLatex()}`],
              ],
            ],
            t(
              `Evaluate the original quotient just beside $x = ${a}$:\n\n${nearTable(a, g)}\n\nThe values close in on $${answer.toLatex()}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$ from both sides.`,
              `计算原来的商在 $x = ${a}$ 两旁的值：\n\n${nearTable(a, g)}\n\n这些值从两侧逼近 $${answer.toLatex()}${answer.isInteger() ? "" : ` \\approx ${fmt(answer.toNumber())}`}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "which-discontinuities-are-removable",
      figure: calculusDrawings1["removing-discontinuities-from-rational-functions#which-discontinuities-are-removable"],
      title: t("Which discontinuities are removable", "哪些间断点可去"),
      explanation: t(
        "Factor numerator and denominator completely. Each zero of the denominator whose factor cancels is removable; each whose factor remains is a vertical asymptote and cannot be removed. There may be none, one or several removable ones.\n\nFor example, $\\frac{(x - 2)(x + 1)}{(x - 2)(x - 5)}$ has a removable discontinuity at $x = 2$ only.\n\nCheck: near $x = 2$ the values approach $\\frac{3}{-3} = -1$, while near $x = 5$ they grow without bound.\n\n> **Watch out.** Count only zeros of the denominator. A zero of the numerator that does not cancel is just a zero of $f$, not a discontinuity.",
        "把分子分母完全因式分解。分母的零点中，因式能约去的是可去间断点；因式保留下来的是竖直渐近线，不能消除。可去间断点可能没有，也可能有一个或多个。\n\n例如，$\\frac{(x - 2)(x + 1)}{(x - 2)(x - 5)}$ 只在 $x = 2$ 处有可去间断点。\n\n检验：在 $x = 2$ 附近函数值趋近 $\\frac{3}{-3} = -1$，而在 $x = 5$ 附近它们无界增大。\n\n> **注意。** 只考虑分母的零点。分子的零点若没有被约去，只是 $f$ 的零点，不是间断点。",
      ),
      generate(rng) {
        const [r1, r2, n1, n2] = rng.sample(range(-6, 6), 4) as [number, number, number, number];
        const shared = rng.int(0, 2);
        const tops = shared === 0 ? [n1, n2] : shared === 1 ? [r1, n2] : [r1, r2];
        const m = rng.pick([1, 2, -1, 3]);
        const values = shared === 0 ? [] : shared === 1 ? [r1] : [r1, r2];
        const [t0, t1] = [tops[0]!, tops[1]!];
        const g = (x: number) => (m * (x - t0) * (x - t1)) / ((x - r1) * (x - r2));
        const xs = [r1 - 0.01, r1 + 0.01, r2 - 0.01, r2 + 0.01].map((x) => Math.round(x * 100) / 100);
        const beside = (r: number, removable: boolean) =>
          removable
            ? t(`the values beside $x = ${r}$ stay close together`, `$x = ${r}$ 两旁的值彼此接近`)
            : t(`the values beside $x = ${r}$ are large and of opposite signs`, `$x = ${r}$ 两旁的值很大且异号`);
        const one = beside(r1, shared >= 1);
        const two = beside(r2, shared === 2);
        return solutionsProblem({
          prompt: t(
            `Find every $x$ at which $f(x) = \\frac{${quadraticFrom(m, t0, t1)}}{${quadraticFrom(1, r1, r2)}}$ has a removable discontinuity. If there is none, type none.`,
            `求 $f(x) = \\frac{${quadraticFrom(m, t0, t1)}}{${quadraticFrom(1, r1, r2)}}$ 的所有可去间断点的 $x$ 值。若没有，回答 $\\varnothing$。`,
          ),
          values: values.map(String),
          wrong: [[String(r1), String(r2)], tops.map(String), [], [String(r2)]],
          solution: walked(
            [
              [
                ["Factor", "因式分解"],
                t(`The denominator is $0$ at $x = ${r1}$ and $x = ${r2}$:`, `分母在 $x = ${r1}$ 和 $x = ${r2}$ 处为 $0$：`),
                [`f(x) = \\frac{${times(m)}${fac(t0)}${fac(t1)}}{${fac(r1)}${fac(r2)}}`],
              ],
              [
                ["Decide which cancel", "判断哪些能约去"],
                shared === 0
                  ? t(
                      "No factor cancels, so both discontinuities are vertical asymptotes and none is removable.",
                      "没有因式能约去，所以两个间断点都是竖直渐近线，都不可去。",
                    )
                  : shared === 1
                    ? t(
                        `Only $${fac(r1)}$ cancels, so only $x = ${r1}$ is removable; $x = ${r2}$ is a vertical asymptote.`,
                        `只有 $${fac(r1)}$ 能约去，所以只有 $x = ${r1}$ 可去；$x = ${r2}$ 是竖直渐近线。`,
                      )
                    : t(
                        `Both factors cancel, leaving $f(x) = ${m}$ with two holes, so both $x = ${r1}$ and $x = ${r2}$ are removable.`,
                        `两个因式都能约去，剩下 $f(x) = ${m}$ 和两个空心点，所以 $x = ${r1}$ 和 $x = ${r2}$ 都可去。`,
                      ),
              ],
            ],
            t(
              `Evaluate $f$ just beside both zeros of the denominator:\n\n${valuesTable(xs, g)}\n\nIn the table, ${one.en}, and ${two.en}. Values that stay close together mean a hole; large values of opposite signs mean an asymptote.`,
              `计算 $f$ 在分母两个零点两旁的值：\n\n${valuesTable(xs, g)}\n\n表中${one["zh-CN"]}，${two["zh-CN"]}。值彼此接近表示空心点；值很大且异号表示渐近线。`,
            ),
          ),
        });
      },
    },
  ],
};

/** calculusIContinuityTopics are the topics of Calculus I modules 3.7 and 3.8. */
export const calculusIContinuityTopics: readonly TopicDef[] = [
  determiningContinuityFromGraphs,
  definingContinuityAtAPoint,
  leftAndRightContinuity,
  furtherContinuityOfPiecewiseFunctions,
  pointDiscontinuities,
  jumpDiscontinuities,
  discontinuitiesDueToVerticalAsymptotes,
  continuityOverAnInterval,
  continuityOfFunctions,
  theIntermediateValueTheorem,
  removingPointDiscontinuities,
  removingJumpDiscontinuities,
  removingDiscontinuitiesFromRationalFunctions,
];
