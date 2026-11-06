import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Interval, type PlaneMark, plane, poly, Q, union } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { choiceProblem, intervalProblem, numberProblem, pointProblem, reasonChoice, solutionsProblem, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { bare, fac, graphAltOf, lim, oneOf, range, sqrtLatex, table } from "./calculus-common.ts";

// Calculus I unit 3: Continuity, modules 3.7 (Continuity) and 3.8 (Removing
// Discontinuities).

const view = { xMin: -6, xMax: 6, yMin: -7, yMax: 7 };

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

/** breakGraph draws f with a single break at x = a. */
function breakGraph(rng: Rng, b: Break): Figure {
  const slope = () => rng.pick([-1.5, -1, -0.5, 0.5, 1, 1.5]);
  const bend = () => rng.pick([0, 0, 0.2, -0.2]);
  const [m1, c1, m2, c2] = [slope(), bend(), slope(), bend()];
  const marks: PlaneMark[] = [
    { kind: "curve", f: (x) => b.L + m1 * (x - b.a) + c1 * (x - b.a) ** 2, to: b.a, accent: true },
    { kind: "curve", f: (x) => b.R + m2 * (x - b.a) + c2 * (x - b.a) ** 2, from: b.a, accent: true },
    ...breakMarks(b),
  ];
  return { svg: plane(view, marks), alt: graphAltOf(view, marks) };
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
      `$${lim(b.a, -1)} f(x) = ${b.L}$ but $${lim(b.a, 1)} f(x) = ${b.R}$, so the limit does not exist and $f$ is not continuous at $x = ${b.a}$.`,
      `$${lim(b.a, -1)} f(x) = ${b.L}$，而 $${lim(b.a, 1)} f(x) = ${b.R}$，所以极限不存在，$f$ 在 $x = ${b.a}$ 处不连续。`,
    );
  if (b.value === undefined)
    return t(
      `$${lim(b.a)} f(x) = ${b.L}$, but ${v.en}, so $f$ is not continuous at $x = ${b.a}$.`,
      `$${lim(b.a)} f(x) = ${b.L}$，但${v["zh-CN"]}，所以 $f$ 在 $x = ${b.a}$ 处不连续。`,
    );
  if (b.value !== b.L)
    return t(
      `$${lim(b.a)} f(x) = ${b.L}$ but ${v.en}. The limit and the value differ, so $f$ is not continuous at $x = ${b.a}$.`,
      `$${lim(b.a)} f(x) = ${b.L}$，而${v["zh-CN"]}。极限与函数值不相等，所以 $f$ 在 $x = ${b.a}$ 处不连续。`,
    );
  return t(
    `$${lim(b.a)} f(x) = ${b.L} = f(${b.a})$, so $f$ is continuous at $x = ${b.a}$.`,
    `$${lim(b.a)} f(x) = ${b.L} = f(${b.a})$，所以 $f$ 在 $x = ${b.a}$ 处连续。`,
  );
}

/** yesNoProblem asks a yes-or-no question. */
const yesNoProblem = (prompt: Text, yes: boolean, solution: Text) =>
  choiceProblem({ prompt, options: yesNo, correct: yes ? 0 : 1, solution });

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
  knowledgePoints: [
    {
      id: "continuity-at-a-point-from-a-graph",
      figure: calculusDrawings1["determining-continuity-from-graphs#continuity-at-a-point-from-a-graph"],
      title: t("Continuity at a point from a graph", "由图像判断在一点处的连续性"),
      explanation: t(
        "A function is **continuous** at $x = a$ when its graph passes through $x = a$ without a break: it can be drawn there without lifting the pen.\n\nOn a graph, a hole, a filled point away from the curve, or a jump each mean that $f$ is **not** continuous at $a$.",
        "若函数图像在 $x = a$ 处没有断开，即画到这里时不用提笔，就说函数在 $x = a$ 处**连续**。\n\n在图像上，空心点、偏离曲线的实心点或跳跃，都表示 $f$ 在 $a$ 处**不**连续。",
      ),
      generate(rng) {
        const kind = rng.pick<BreakKind>(["continuous", "continuous", "hole", "moved", "jump"]);
        const b = makeBreak(rng, rng.int(-3, 3), kind);
        const unbroken = t(
          `Yes, because the graph passes through $x = ${b.a}$ without a break.`,
          `是，因为图像在 $x = ${b.a}$ 处没有断开。`,
        );
        const hole = t(
          `No, because the graph has a hole at $x = ${b.a}$ and no point there.`,
          `否，因为图像在 $x = ${b.a}$ 处有一个空心点，且该处没有点。`,
        );
        const moved = t(
          `No, because the filled point at $x = ${b.a}$ is away from the curve.`,
          `否，因为 $x = ${b.a}$ 处的实心点偏离了曲线。`,
        );
        const jump = t(`No, because the graph jumps to a new height at $x = ${b.a}$.`, `否，因为图像在 $x = ${b.a}$ 处跳到另一个高度。`);
        return reasoned(
          {
            ...reasonChoice(rng, {
              prompt: t(
                `The graph of $y = f(x)$ is shown. Is $f$ continuous at $x = ${b.a}$?`,
                `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${b.a}$ 处连续吗？`,
              ),
              correct: kind === "continuous" ? unbroken : kind === "hole" ? hole : kind === "moved" ? moved : jump,
              wrong: [unbroken, hole, moved, jump],
              solution: breakReason(b),
            }),
            figure: breakGraph(rng, b),
          },
          [
            [unbroken.en, `The graph does have a break at $x = ${b.a}$.`, `图像在 $x = ${b.a}$ 处确实有断开。`],
            [
              hole.en,
              "A hole is one missing point in an otherwise unbroken curve, and that is not what this graph shows.",
              "洞是一条本来不断的曲线上缺了一个点，而这个图像不是这样。",
            ],
            [
              moved.en,
              "A point away from the curve goes with a curve that has no other break, and that is not what this graph shows.",
              "偏离曲线的点对应的是除此之外没有断开的曲线，而这个图像不是这样。",
            ],
            [
              jump.en,
              `The two sides of the graph meet at the same height at $x = ${b.a}$, so there is no jump.`,
              `在 $x = ${b.a}$ 处图像两侧高度相同，所以没有跳跃。`,
            ],
          ],
        );
      },
    },
    {
      id: "locating-discontinuities-on-a-graph",
      figure: calculusDrawings1["determining-continuity-from-graphs#locating-discontinuities-on-a-graph"],
      title: t("Locating discontinuities on a graph", "在图像上找出间断点"),
      explanation: t(
        "To find where a function is not continuous, scan its graph for breaks. At each marked point ask: does the curve arrive at the same height from both sides, and is the filled point at that height?",
        "要找出函数不连续的位置，就在图像上寻找断开处。对每个标出的点问：曲线从两侧是否到达同一高度？实心点是否就在这个高度上？",
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
        const allCont = t(`$f$ is continuous at all three`, `$f$ 在这三处都连续`);
        const at = (a: number) => same(`$x = ${a}$`);
        const right = bad < 0 ? allCont : at(xs[bad]!);
        const wrong = [...xs.filter((_, i) => i !== bad).map(at), ...(bad < 0 ? [] : [allCont])];
        return oneOf(
          rng,
          t(
            `The graph of $y = f(x)$ is shown. At which of $x = ${b0}$, $x = ${b1}$ and $x = ${b2}$ is $f$ not continuous?`,
            `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${b0}$、$x = ${b1}$ 和 $x = ${b2}$ 中的哪一处不连续？`,
          ),
          right,
          wrong,
          bad < 0
            ? t(
                "At each of the three points the curve passes through the filled point without a break, so $f$ is continuous at all three.",
                "在这三点处，曲线都不间断地穿过实心点，所以 $f$ 在这三处都连续。",
              )
            : breakReason(breaks[bad]!),
          { svg: plane(view, marks), alt: graphAltOf(view, marks) },
        );
      },
    },
  ],
};

/** Condition is the first condition of continuity that fails, or "none". */
type Condition = "none" | "undefined" | "dne" | "differ";

/** conditionText names the outcome of checking the three conditions at a. */
function conditionText(c: Condition, a: number): Text {
  if (c === "none") return t(`$f$ is continuous at $x = ${a}$.`, `$f$ 在 $x = ${a}$ 处连续。`);
  if (c === "undefined")
    return t(
      `$f$ is not continuous at $x = ${a}$, because $f(${a})$ is not defined.`,
      `$f$ 在 $x = ${a}$ 处不连续，因为 $f(${a})$ 没有定义。`,
    );
  if (c === "dne")
    return t(
      `$f$ is not continuous at $x = ${a}$, because $${lim(a)} f(x)$ does not exist.`,
      `$f$ 在 $x = ${a}$ 处不连续，因为 $${lim(a)} f(x)$ 不存在。`,
    );
  return t(
    `$f$ is not continuous at $x = ${a}$, because $${lim(a)} f(x) \\ne f(${a})$.`,
    `$f$ 在 $x = ${a}$ 处不连续，因为 $${lim(a)} f(x) \\ne f(${a})$。`,
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
  knowledgePoints: [
    {
      id: "the-three-conditions-for-continuity",
      title: t("The three conditions for continuity", "连续的三个条件"),
      explanation: t(
        "$f$ is continuous at $x = a$ when all three conditions hold:\n\n1. $f(a)$ is defined;\n2. $\\lim_{x \\to a} f(x)$ exists, that is, the one-sided limits are equal;\n3. $\\lim_{x \\to a} f(x) = f(a)$.\n\nIf any one of them fails, $f$ is not continuous at $a$.",
        "当以下三个条件都成立时，$f$ 在 $x = a$ 处连续：\n\n1. $f(a)$ 有定义；\n2. $\\lim_{x \\to a} f(x)$ 存在，即两个单侧极限相等；\n3. $\\lim_{x \\to a} f(x) = f(a)$。\n\n只要有一个条件不成立，$f$ 在 $a$ 处就不连续。",
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
        return oneOf(
          rng,
          t(
            `A function $f$ has ${facts}, and ${valueFact.en}. Which statement is true?`,
            `函数 $f$ 满足 ${facts}，且${valueFact["zh-CN"]}。下列哪个说法正确？`,
          ),
          conditionText(c, a),
          all.filter((o) => o !== c).map((o) => conditionText(o, a)),
          c === "none"
            ? t(
                `$f(${a}) = ${v}$ is defined, the one-sided limits agree so $${lim(a)} f(x) = ${L}$, and the limit equals the value. All three conditions hold.`,
                `$f(${a}) = ${v}$ 有定义，两个单侧极限相等，所以 $${lim(a)} f(x) = ${L}$，且极限等于函数值。三个条件都成立。`,
              )
            : c === "undefined"
              ? t(`The first condition fails: $f(${a})$ is not defined.`, `第一个条件不成立：$f(${a})$ 没有定义。`)
              : c === "dne"
                ? t(
                    `The one-sided limits $${L}$ and $${R}$ differ, so the limit does not exist and the second condition fails.`,
                    `单侧极限 $${L}$ 与 $${R}$ 不相等，所以极限不存在，第二个条件不成立。`,
                  )
                : t(
                    `The limit exists and equals $${L}$, but $f(${a}) = ${v}$, so the third condition fails.`,
                    `极限存在且等于 $${L}$，但 $f(${a}) = ${v}$，所以第三个条件不成立。`,
                  ),
        );
      },
    },
    {
      id: "continuity-of-a-piecewise-function-at-a-point",
      title: t("Continuity of a piecewise function at a point", "分段函数在一点处的连续性"),
      explanation: t(
        "At a break point $a$ of a piecewise function, find the left-sided limit from the formula for $x < a$, the right-sided limit from the formula for $x > a$, and $f(a)$ from the formula that includes $a$. $f$ is continuous at $a$ exactly when the three numbers are equal.",
        "在分段函数的分段点 $a$ 处，用 $x < a$ 的表达式求左极限，用 $x > a$ 的表达式求右极限，用包含 $a$ 的表达式求 $f(a)$。当且仅当这三个数相等时，$f$ 在 $a$ 处连续。",
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
          "Yes, because both one-sided limits and the value there are all equal.",
          "是，因为两个单侧极限与该点的函数值都相等。",
        );
        const sidesDiffer = t("No, because the left-sided and right-sided limits differ.", "否，因为左极限与右极限不相等。");
        const valueDiffers = t(
          "No, because the limits agree but the value there is different.",
          "否，因为两个极限相等，但该点的函数值不同。",
        );
        const defined = t(`Yes, because $f(${a})$ is defined.`, `是，因为 $f(${a})$ 有定义。`);
        return reasonChoice(rng, {
          prompt: t(`Let $$${f}$$ Is $f$ continuous at $x = ${a}$?`, `设 $$${f}$$ $f$ 在 $x = ${a}$ 处连续吗？`),
          correct: cont ? allEqual : L !== R ? sidesDiffer : valueDiffers,
          wrong: [allEqual, sidesDiffer, valueDiffers, defined],
          solution: t(
            `$${lim(a, -1)} f(x) = ${L}$, $${lim(a, 1)} f(x) = ${R}$ and $f(${a}) = ${v}$. ${cont ? "All three are equal, so $f$ is continuous there." : "They are not all equal, so $f$ is not continuous there."}`,
            `$${lim(a, -1)} f(x) = ${L}$，$${lim(a, 1)} f(x) = ${R}$，$f(${a}) = ${v}$。${cont ? "三者相等，所以 $f$ 在该点连续。" : "三者不全相等，所以 $f$ 在该点不连续。"}`,
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

/** sidednessSolution explains one-sided continuity at a. */
function sidednessSolution(a: number, L: number, R: number, v: number | undefined): Text {
  const value = v === undefined ? t(`$f(${a})$ is not defined`, `$f(${a})$ 没有定义`) : same(`$f(${a}) = ${v}$`);
  const s = sidedness(L, R, v);
  const verdict = sidednessText(s, a);
  return t(
    `$${lim(a, -1)} f(x) = ${L}$, $${lim(a, 1)} f(x) = ${R}$ and ${value.en}. $f$ is continuous from a side when the limit from that side equals $f(${a})$, so ${verdict.en}.`,
    `$${lim(a, -1)} f(x) = ${L}$，$${lim(a, 1)} f(x) = ${R}$，${value["zh-CN"]}。某一侧的极限等于 $f(${a})$ 时，$f$ 在该侧连续，所以${verdict["zh-CN"]}。`,
  );
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
  knowledgePoints: [
    {
      id: "one-sided-continuity-from-a-graph",
      figure: calculusDrawings1["left-and-right-continuity#one-sided-continuity-from-a-graph"],
      title: t("One-sided continuity from a graph", "由图像判断单侧连续"),
      explanation: t(
        "$f$ is **continuous from the left** at $a$ when $\\lim_{x \\to a^{-}} f(x) = f(a)$, and **continuous from the right** when $\\lim_{x \\to a^{+}} f(x) = f(a)$.\n\nAt a jump, the filled point sits at the end of one piece: $f$ is continuous from that side only.",
        "若 $\\lim_{x \\to a^{-}} f(x) = f(a)$，则称 $f$ 在 $a$ 处**左连续**；若 $\\lim_{x \\to a^{+}} f(x) = f(a)$，则称**右连续**。\n\n在跳跃处，实心点位于某一段的端点上：$f$ 只在那一侧连续。",
      ),
      generate(rng) {
        const b = makeBreak(rng, rng.int(-3, 3), rng.pick<BreakKind>(["jump", "jump", "jump", "continuous", "moved"]));
        const s = sidedness(b.L, b.R, b.value);
        return {
          ...oneOf(
            rng,
            t(
              `The graph of $y = f(x)$ is shown. Which describes $f$ at $x = ${b.a}$?`,
              `图中是 $y = f(x)$ 的图像。下列哪一项描述了 $f$ 在 $x = ${b.a}$ 处的情况？`,
            ),
            sidednessText(s, b.a),
            sides.filter((o) => o !== s).map((o) => sidednessText(o, b.a)),
            sidednessSolution(b.a, b.L, b.R, b.value),
          ),
          figure: breakGraph(rng, b),
        };
      },
    },
    {
      id: "one-sided-continuity-of-piecewise-functions",
      title: t("One-sided continuity of piecewise functions", "分段函数的单侧连续"),
      explanation: t(
        "The inequality signs of a piecewise function decide which formula gives $f(a)$. In\n\n$$f(x) = \\begin{cases} x + 1 & x \\le 2 \\\\ x^{2} & x > 2 \\end{cases}$$\n\n$f(2) = 3$ comes from the left formula, which also gives the left-sided limit $3$, so $f$ is continuous from the left at $2$. The right-sided limit is $4 \\ne 3$, so it is not continuous from the right.",
        "分段函数中的不等号决定由哪个表达式给出 $f(a)$。在\n\n$$f(x) = \\begin{cases} x + 1 & x \\le 2 \\\\ x^{2} & x > 2 \\end{cases}$$\n\n中，$f(2) = 3$ 来自左边的表达式，它给出的左极限也是 $3$，所以 $f$ 在 $2$ 处左连续。右极限是 $4 \\ne 3$，所以不右连续。",
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
        return oneOf(
          rng,
          t(`Let $$${f}$$ Which describes $f$ at $x = ${a}$?`, `设 $$${f}$$ 下列哪一项描述了 $f$ 在 $x = ${a}$ 处的情况？`),
          sidednessText(s, a),
          sides.filter((o) => o !== s).map((o) => sidednessText(o, a)),
          sidednessSolution(a, L, R, v),
        );
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
  knowledgePoints: [
    {
      id: "a-constant-term-that-makes-a-function-continuous",
      title: t("A constant term that makes a function continuous", "使函数连续的常数项"),
      explanation: t(
        "To make a piecewise function continuous at its break point $a$, set the two formulas equal at $x = a$ and solve for the constant:\n\n$$f(x) = \\begin{cases} 2x + 1 & x < 3 \\\\ x^{2} + k & x \\ge 3 \\end{cases}: \\quad 2(3) + 1 = 3^{2} + k \\implies k = -2.$$",
        "要使分段函数在分段点 $a$ 处连续，令两个表达式在 $x = a$ 处的值相等，解出常数：\n\n$$f(x) = \\begin{cases} 2x + 1 & x < 3 \\\\ x^{2} + k & x \\ge 3 \\end{cases}: \\quad 2(3) + 1 = 3^{2} + k \\implies k = -2.$$",
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
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ Find the value of $k$ that makes $f$ continuous at $x = ${a}$.`,
            `设 $$${f}$$ 求使 $f$ 在 $x = ${a}$ 处连续的 $k$ 的值。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [known.at(a) + q(a), q(a) - known.at(a), known.at(a)],
          solution: t(
            `Both formulas must give the same value at $x = ${a}$:${`$$${q(a)} + k = ${known.at(a)} \\implies k = ${k}.$$`}`,
            `两个表达式在 $x = ${a}$ 处的值必须相等：${`$$${q(a)} + k = ${known.at(a)} \\implies k = ${k}.$$`}`,
          ),
        });
      },
    },
    {
      id: "a-coefficient-that-makes-a-function-continuous",
      title: t("A coefficient that makes a function continuous", "使函数连续的系数"),
      explanation: t(
        "When the constant multiplies $x$, the equation at the break point is still linear in it:\n\n$$f(x) = \\begin{cases} kx - 1 & x < 2 \\\\ x^{2} + 3 & x \\ge 2 \\end{cases}: \\quad 2k - 1 = 7 \\implies k = 4.$$",
        "当常数乘以 $x$ 时，分段点处的方程仍是关于它的一次方程：\n\n$$f(x) = \\begin{cases} kx - 1 & x < 2 \\\\ x^{2} + 3 & x \\ge 2 \\end{cases}: \\quad 2k - 1 = 7 \\implies k = 4.$$",
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
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ Find the value of $k$ that makes $f$ continuous at $x = ${a}$.`,
            `设 $$${f}$$ 求使 $f$ 在 $x = ${a}$ 处连续的 $k$ 的值。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [Q.of(target + c, a), Q.of(target, a), Q.of(target - c)],
          solution: t(
            `Set the formulas equal at $x = ${a}$:$$${a === 1 ? "" : a === -1 ? "-" : a}k ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${target} \\implies k = ${k.toLatex()}.$$`,
            `令两个表达式在 $x = ${a}$ 处相等：$$${a === 1 ? "" : a === -1 ? "-" : a}k ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${target} \\implies k = ${k.toLatex()}.$$`,
          ),
        });
      },
    },
  ],
};

/** quadraticFrom writes (x − a)(x − b) expanded, times m. */
const quadraticFrom = (m: number, a: number, b: number) => poly([m, "x^{2}"], [-m * (a + b), "x"], [m * a * b, ""]);

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
  knowledgePoints: [
    {
      id: "point-discontinuities-from-a-graph",
      figure: calculusDrawings1["point-discontinuities#point-discontinuities-from-a-graph"],
      title: t("Point discontinuities from a graph", "由图像认识可去间断点"),
      explanation: t(
        "A **point discontinuity** at $x = a$ is a single missing or misplaced point: $\\lim_{x \\to a} f(x)$ exists, but $f(a)$ is not defined or is different from it. Moving the point to the height of the hole would make $f$ continuous.",
        "$x = a$ 处的**可去间断点**是单独一个缺失或错位的点：$\\lim_{x \\to a} f(x)$ 存在，但 $f(a)$ 没有定义或与它不相等。把这个点移到空心点的高度，$f$ 就连续了。",
      ),
      generate(rng) {
        const b = makeBreak(rng, rng.int(-3, 3), rng.pick<BreakKind>(["hole", "moved"]));
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ has a point discontinuity at $x = ${b.a}$. What value of $f(${b.a})$ would make $f$ continuous there?`,
              `$y = f(x)$ 的图像在 $x = ${b.a}$ 处有可去间断点。$f(${b.a})$ 取何值时，$f$ 在该点连续？`,
            ),
            answer: b.L,
            wrong: [...(b.value === undefined ? [] : [b.value]), b.a, b.L + 1],
            solution: t(
              `The curve approaches height $${b.L}$ from both sides, so $${lim(b.a)} f(x) = ${b.L}$. Setting $f(${b.a}) = ${b.L}$ fills the hole.`,
              `曲线从两侧都趋近高度 $${b.L}$，所以 $${lim(b.a)} f(x) = ${b.L}$。令 $f(${b.a}) = ${b.L}$ 即可填上空缺。`,
            ),
          }),
          figure: breakGraph(rng, b),
        };
      },
    },
    {
      id: "the-hole-of-a-rational-function",
      figure: calculusDrawings1["point-discontinuities#the-hole-of-a-rational-function"],
      title: t("The hole of a rational function", "有理函数图像上的空心点"),
      explanation: t(
        "When numerator and denominator share a factor $(x - a)$, the graph has a hole at $x = a$. Cancel the factor and substitute $a$ to find its height:\n\n$$f(x) = \\frac{x^{2} - x - 6}{x - 3} = \\frac{(x - 3)(x + 2)}{x - 3} = x + 2 \\; (x \\ne 3),$$\n\nso the hole is at $(3, 5)$.",
        "当分子分母有公因式 $(x - a)$ 时，图像在 $x = a$ 处有一个空心点。约去公因式再代入 $a$，就得到它的高度：\n\n$$f(x) = \\frac{x^{2} - x - 6}{x - 3} = \\frac{(x - 3)(x + 2)}{x - 3} = x + 2 \\; (x \\ne 3),$$\n\n所以空心点是 $(3, 5)$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.pick(range(-6, 6).filter((x) => x !== a));
        const m = rng.pick([1, 1, 2, 3, -1]);
        const k = rng.pick([1, 1, 2, -1]);
        const y = Q.of(m * (a - b), k);
        const den = poly([k, "x"], [-k * a, ""]);
        return numberProblem({
          prompt: t(
            `The graph of $f(x) = \\frac{${quadraticFrom(m, a, b)}}{${den}}$ has a hole at $x = ${a}$. Find the $y$-coordinate of the hole.`,
            `$f(x) = \\frac{${quadraticFrom(m, a, b)}}{${den}}$ 的图像在 $x = ${a}$ 处有一个空心点。求空心点的纵坐标。`,
          ),
          answer: y,
          wrong: [Q.of(m * (a + b), k), Q.of(m * (b - a), k), Q.of(b), Q.zero],
          solution: t(
            `Factor and cancel:$$f(x) = \\frac{${m === 1 ? "" : m === -1 ? "-" : m}${fac(a)}${fac(b)}}{${k === 1 ? bare(a) : `${k === -1 ? "-" : k}${fac(a)}`}} = ${k === 1 ? poly([m, "x"], [-m * b, ""]) : `\\frac{${poly([m, "x"], [-m * b, ""])}}{${k}}`} \\quad (x \\ne ${a}).$$Substituting $x = ${a}$ gives $${y.toLatex()}$.`,
            `因式分解后约分：$$f(x) = \\frac{${m === 1 ? "" : m === -1 ? "-" : m}${fac(a)}${fac(b)}}{${k === 1 ? bare(a) : `${k === -1 ? "-" : k}${fac(a)}`}} = ${k === 1 ? poly([m, "x"], [-m * b, ""]) : `\\frac{${poly([m, "x"], [-m * b, ""])}}{${k}}`} \\quad (x \\ne ${a}).$$代入 $x = ${a}$ 得 $${y.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** absJumpLatex writes k|x − a|/(x − a) + c. */
const absJumpLatex = (k: number, a: number, c: number) =>
  `\\frac{${k === 1 ? "" : k === -1 ? "-" : k}|${bare(a)}|}{${bare(a)}}${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`}`;

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
  knowledgePoints: [
    {
      id: "the-size-of-a-jump",
      figure: calculusDrawings1["jump-discontinuities#the-size-of-a-jump"],
      title: t("The size of a jump", "跳跃的大小"),
      explanation: t(
        "A **jump discontinuity** at $x = a$ has finite one-sided limits that differ. The jump is the change from the left to the right:\n\n$$\\lim_{x \\to a^{+}} f(x) - \\lim_{x \\to a^{-}} f(x),$$\n\npositive when the graph jumps up and negative when it jumps down.",
        "$x = a$ 处的**跳跃间断点**的两个单侧极限都有限但不相等。跳跃量是从左到右的变化：\n\n$$\\lim_{x \\to a^{+}} f(x) - \\lim_{x \\to a^{-}} f(x),$$\n\n图像向上跳时为正，向下跳时为负。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const left = anyPiece(rng);
        let right = anyPiece(rng);
        while (right.at(a) === left.at(a)) right = linearPiece(rng);
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
          solution: t(
            `$${lim(a, -1)} f(x) = ${L}$ and $${lim(a, 1)} f(x) = ${R}$, so the jump is $${R} - ${L < 0 ? `(${L})` : L} = ${R - L}$.`,
            `$${lim(a, -1)} f(x) = ${L}$，$${lim(a, 1)} f(x) = ${R}$，所以跳跃量为 $${R} - ${L < 0 ? `(${L})` : L} = ${R - L}$。`,
          ),
        });
      },
    },
    {
      id: "jumps-of-absolute-value-quotients",
      title: t("Jumps of absolute value quotients", "含绝对值的商的跳跃"),
      explanation: t(
        "$\\frac{|x - a|}{x - a}$ is $-1$ for $x < a$ and $1$ for $x > a$, so $f(x) = k\\frac{|x - a|}{x - a} + c$ has a jump at $a$: its left-sided limit is $c - k$ and its right-sided limit is $c + k$.",
        "$\\frac{|x - a|}{x - a}$ 在 $x < a$ 时为 $-1$，在 $x > a$ 时为 $1$，所以 $f(x) = k\\frac{|x - a|}{x - a} + c$ 在 $a$ 处有跳跃：左极限为 $c - k$，右极限为 $c + k$。",
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
        return numberProblem({
          prompt: t(`Let $f(x) = ${absJumpLatex(k, a, c)}$. Find $${target}$.`, `设 $f(x) = ${absJumpLatex(k, a, c)}$。求 $${target}$。`),
          answer,
          wrong: ask === 2 ? [L - R, k, 0] : [ask === 0 ? R : L, c, k],
          solution: t(
            `For $x < ${a}$, $|${bare(a)}| = -${fac(a)}$, so $f(x) = ${L}$; for $x > ${a}$, $f(x) = ${R}$. So $${lim(a, -1)} f(x) = ${L}$ and $${lim(a, 1)} f(x) = ${R}$${ask === 2 ? `, and the jump is $${R - L}$` : ""}.`,
            `当 $x < ${a}$ 时 $|${bare(a)}| = -${fac(a)}$，所以 $f(x) = ${L}$；当 $x > ${a}$ 时 $f(x) = ${R}$。所以 $${lim(a, -1)} f(x) = ${L}$，$${lim(a, 1)} f(x) = ${R}$${ask === 2 ? `，跳跃量为 $${R - L}$` : ""}。`,
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
  knowledgePoints: [
    {
      id: "classifying-discontinuities-from-graphs",
      figure: calculusDrawings1["discontinuities-due-to-vertical-asymptotes#classifying-discontinuities-from-graphs"],
      title: t("Classifying discontinuities from graphs", "由图像判断间断点的类型"),
      explanation: t(
        "There are three kinds of discontinuity:\n\n- **point**: the limit exists, but the value is missing or elsewhere (a hole);\n- **jump**: both one-sided limits are finite but differ;\n- **infinite**: a one-sided limit is $\\infty$ or $-\\infty$, at a vertical asymptote.",
        "间断点有三类：\n\n- **可去间断点**：极限存在，但函数值缺失或在别处（空心点）；\n- **跳跃间断点**：两个单侧极限都有限但不相等；\n- **无穷间断点**：某个单侧极限为 $\\infty$ 或 $-\\infty$，出现在竖直渐近线处。",
      ),
      generate(rng) {
        const kind = rng.pick<Discontinuity>(["point", "jump", "infinite", "infinite"]);
        const a = rng.int(-3, 3);
        let figure: Figure;
        if (kind === "infinite") {
          const k = rng.pick([-3, -2, -1, 1, 2, 3]);
          const d = rng.int(-3, 3);
          const square = rng.bool();
          const g = (x: number) => (square ? k / (x - a) ** 2 : k / (x - a)) + d;
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
          figure = breakGraph(rng, makeBreak(rng, a, kind === "point" ? rng.pick<BreakKind>(["hole", "moved"]) : "jump"));
        }
        return oneOf(
          rng,
          t(
            `The graph of $y = f(x)$ is shown. What kind of discontinuity does $f$ have at $x = ${a}$?`,
            `图中是 $y = f(x)$ 的图像。$f$ 在 $x = ${a}$ 处是哪一类间断点？`,
          ),
          discontinuityText(kind, a),
          discontinuities.filter((d) => d !== kind && d !== "none").map((d) => discontinuityText(d, a)),
          kind === "infinite"
            ? t(
                `The graph rises or falls without bound next to the asymptote $x = ${a}$, so the discontinuity is infinite.`,
                `图像在渐近线 $x = ${a}$ 旁无限上升或下降，所以是无穷间断点。`,
              )
            : kind === "jump"
              ? t(
                  `The two pieces end at different finite heights, so the discontinuity is a jump.`,
                  `两段在不同的有限高度结束，所以是跳跃间断点。`,
                )
              : t(
                  `Both sides approach the same height, but the point there is missing or moved, so the discontinuity is a point discontinuity.`,
                  `两侧趋近同一高度，但该处的点缺失或错位，所以是可去间断点。`,
                ),
          figure,
        );
      },
    },
    {
      id: "classifying-discontinuities-of-rational-functions",
      figure: calculusDrawings1["discontinuities-due-to-vertical-asymptotes#classifying-discontinuities-of-rational-functions"],
      title: t("Classifying discontinuities of rational functions", "判断有理函数间断点的类型"),
      explanation: t(
        "Factor numerator and denominator. At a zero $a$ of the denominator:\n\n- if $(x - a)$ cancels completely, $f$ has a **point** discontinuity (a hole);\n- otherwise the denominator still vanishes, and $f$ has an **infinite** discontinuity (a vertical asymptote).\n\nA rational function is continuous wherever its denominator is not $0$.",
        "把分子分母因式分解。在分母的零点 $a$ 处：\n\n- 若 $(x - a)$ 能完全约去，$f$ 有**可去**间断点（空心点）；\n- 否则分母仍为零，$f$ 有**无穷**间断点（竖直渐近线）。\n\n有理函数在分母不为 $0$ 的地方都连续。",
      ),
      generate(rng) {
        const [a, b, c] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const ask = rng.pick([a, c, b]);
        const kind: Discontinuity = ask === a ? "point" : ask === c ? "infinite" : "none";
        const f = `\\frac{${quadraticFrom(1, a, b)}}{${quadraticFrom(1, a, c)}}`;
        return reasoned(
          oneOf(
            rng,
            t(`Let $f(x) = ${f}$. What happens at $x = ${ask}$?`, `设 $f(x) = ${f}$。$f$ 在 $x = ${ask}$ 处是什么情况？`),
            discontinuityText(kind, ask),
            discontinuities.filter((d) => d !== kind).map((d) => discontinuityText(d, ask)),
            t(
              `$f(x) = \\frac{${fac(a)}${fac(b)}}{${fac(a)}${fac(c)}} = \\frac{${bare(b)}}{${bare(c)}}$ for $x \\ne ${a}$. ${
                kind === "point"
                  ? `The factor $${fac(a)}$ cancels, so $x = ${a}$ is a hole: a point discontinuity.`
                  : kind === "infinite"
                    ? `The factor $${fac(c)}$ stays in the denominator, so $x = ${c}$ is a vertical asymptote: an infinite discontinuity.`
                    : `The denominator is not zero at $x = ${b}$, so $f$ is continuous there (it has a zero there).`
              }`,
              `当 $x \\ne ${a}$ 时 $f(x) = \\frac{${fac(a)}${fac(b)}}{${fac(a)}${fac(c)}} = \\frac{${bare(b)}}{${bare(c)}}$。${
                kind === "point"
                  ? `因式 $${fac(a)}$ 被约去，所以 $x = ${a}$ 处是空心点：可去间断点。`
                  : kind === "infinite"
                    ? `因式 $${fac(c)}$ 仍留在分母中，所以 $x = ${c}$ 是竖直渐近线：无穷间断点。`
                    : `分母在 $x = ${b}$ 处不为零，所以 $f$ 在该点连续（那里是函数的零点）。`
              }`,
            ),
          ),
          [
            [
              discontinuityText("point", ask).en,
              kind === "infinite"
                ? "The factor that vanishes here stays in the denominator, so this is not a removable hole."
                : "The denominator is not zero here, so there is nothing to remove.",
              kind === "infinite" ? "在这里为零的因子留在分母中，所以这不是可去的洞。" : "分母在这里不为零，所以没有什么可去的。",
            ],
            [
              discontinuityText("infinite", ask).en,
              kind === "point"
                ? "The factor that vanishes here cancels, so the values do not blow up."
                : "The denominator is not zero here, so the values do not blow up.",
              kind === "point" ? "在这里为零的因子被约去了，所以函数值不会趋于无穷。" : "分母在这里不为零，所以函数值不会趋于无穷。",
            ],
            [
              discontinuityText("none", ask).en,
              "The denominator is zero here, so the function is not defined and cannot be continuous.",
              "分母在这里为零，函数没有定义，所以不可能连续。",
            ],
            [
              discontinuityText("jump", ask).en,
              "A jump needs two different finite one-sided limits, and a rational function does not have that.",
              "跳跃间断要求两个不同的有限单侧极限，而有理函数不会这样。",
            ],
          ],
        );
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
  knowledgePoints: [
    {
      id: "continuity-on-a-closed-interval",
      title: t("Continuity on a closed interval", "闭区间上的连续性"),
      explanation: t(
        "$f$ is continuous on $[p, q]$ when it is continuous at every point of $(p, q)$, continuous from the right at $p$ and continuous from the left at $q$.\n\nA rational function fails this exactly when a zero of its denominator lies in $[p, q]$, endpoints included, because $f$ is not even defined there.",
        "若 $f$ 在 $(p, q)$ 内每一点都连续，在 $p$ 处右连续，在 $q$ 处左连续，则称 $f$ 在 $[p, q]$ 上连续。\n\n有理函数恰好在分母的某个零点落在 $[p, q]$ 中（包括端点）时不满足这一点，因为 $f$ 在那里没有定义。",
      ),
      generate(rng) {
        const [r1, r2] = rng.sample(range(-6, 6), 2).sort((x, y) => x - y) as [number, number];
        const k = rng.nonZero(-5, 5);
        const f = `\\frac{${k}}{${quadraticFrom(1, r1, r2)}}`;
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
        return yesNoProblem(
          t(`Is $f(x) = ${f}$ continuous on the interval $[${p}, ${q}]$?`, `$f(x) = ${f}$ 在区间 $[${p}, ${q}]$ 上连续吗？`),
          bad.length === 0,
          t(
            `The denominator is $${fac(r1)}${fac(r2)}$, which is $0$ at $x = ${r1}$ and $x = ${r2}$. ${
              bad.length === 0
                ? `Neither lies in $[${p}, ${q}]$, so $f$ is continuous on it.`
                : `$x = ${bad[0]}$ lies in $[${p}, ${q}]$, where $f$ is not defined, so $f$ is not continuous on it.`
            }`,
            `分母为 $${fac(r1)}${fac(r2)}$，在 $x = ${r1}$ 和 $x = ${r2}$ 处为 $0$。${
              bad.length === 0
                ? `两者都不在 $[${p}, ${q}]$ 中，所以 $f$ 在该区间上连续。`
                : `$x = ${bad[0]}$ 在 $[${p}, ${q}]$ 中，$f$ 在该点没有定义，所以 $f$ 在该区间上不连续。`
            }`,
          ),
        );
      },
    },
    {
      id: "intervals-of-continuity-of-a-rational-function",
      title: t("Intervals of continuity of a rational function", "有理函数的连续区间"),
      explanation: t(
        "A rational function is continuous on its domain: every real number except the zeros of the denominator. Write that set as a union of open intervals:\n\n$$f(x) = \\frac{x}{x^{2} - 4} \\text{ is continuous on } (-\\infty, -2) \\cup (-2, 2) \\cup (2, \\infty).$$",
        "有理函数在其定义域上连续：除分母零点以外的所有实数。把这个集合写成开区间的并集：\n\n$$f(x) = \\frac{x}{x^{2} - 4} \\text{ 在 } (-\\infty, -2) \\cup (-2, 2) \\cup (2, \\infty) \\text{ 上连续}.$$",
      ),
      generate(rng) {
        const two = rng.bool(0.7);
        const [r1, r2] = rng.sample(range(-7, 7), 2).sort((x, y) => x - y) as [number, number];
        const num = rng.bool() ? poly([rng.nonZero(-3, 3), "x"], [rng.int(-6, 6), ""]) : String(rng.nonZero(-9, 9));
        const den = two ? quadraticFrom(1, r1, r2) : poly([1, "x"], [-r1, ""]);
        const set = two ? union(open(undefined, r1), open(r1, r2), open(r2)) : union(open(undefined, r1), open(r1));
        return intervalProblem({
          prompt: t(
            `On what set is $f(x) = \\frac{${num}}{${den}}$ continuous? Answer in interval notation.`,
            `$f(x) = \\frac{${num}}{${den}}$ 在什么集合上连续？用区间表示。`,
          ),
          set,
          wrong: two
            ? [union(open(r1, r2)), union(open(undefined, r1), open(r2)), union(open(undefined, -r1), open(-r1, -r2), open(-r2))]
            : [union(open(r1)), union(open(undefined, -r1), open(-r1))],
          solution: t(
            `$f$ is continuous wherever the denominator is not $0$. ${
              two ? `$${den} = ${fac(r1)}${fac(r2)}$ is $0$ at $x = ${r1}$ and $x = ${r2}$` : `$${den}$ is $0$ at $x = ${r1}$`
            }, so $f$ is continuous on all other real numbers.`,
            `$f$ 在分母不为 $0$ 的地方都连续。${
              two ? `$${den} = ${fac(r1)}${fac(r2)}$ 在 $x = ${r1}$ 和 $x = ${r2}$ 处为 $0$` : `$${den}$ 在 $x = ${r1}$ 处为 $0$`
            }，所以 $f$ 在其余所有实数上连续。`,
          ),
        });
      },
    },
  ],
};

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
  knowledgePoints: [
    {
      id: "where-a-function-is-continuous",
      title: t("Where a function is continuous", "函数在何处连续"),
      explanation: t(
        "Polynomials, $e^{x}$, $\\sin x$ and $\\cos x$ are continuous everywhere; $\\sqrt{x}$ is continuous on $[0, \\infty)$ and $\\ln x$ on $(0, \\infty)$. Sums, products, quotients and compositions of continuous functions are continuous wherever they are defined. So a function built from these is continuous exactly on its domain:\n\n$$\\frac{\\sqrt{x - 1}}{x - 4} \\text{ is continuous on } [1, 4) \\cup (4, \\infty).$$",
        "多项式、$e^{x}$、$\\sin x$ 和 $\\cos x$ 处处连续；$\\sqrt{x}$ 在 $[0, \\infty)$ 上连续，$\\ln x$ 在 $(0, \\infty)$ 上连续。连续函数的和、积、商与复合在有定义的地方都连续。所以由它们构成的函数恰好在其定义域上连续：\n\n$$\\frac{\\sqrt{x - 1}}{x - 4} \\text{ 在 } [1, 4) \\cup (4, \\infty) \\text{ 上连续}.$$",
      ),
      generate(rng) {
        const a = rng.int(-6, 6);
        const form = rng.int(0, 5);
        const b = form >= 4 ? rng.pick(range(-7, 7).filter((x) => x !== a)) : 0;
        let f: string;
        let set: ReturnType<typeof union>;
        let why: Text;
        if (form === 0) {
          f = `\\sqrt{${bare(a)}}`;
          set = union(between(a, true, undefined, false));
          why =
            a === 0
              ? t("The root needs $x \\ge 0$.", "根式要求 $x \\ge 0$。")
              : t(`$${bare(a)} \\ge 0$ means $x \\ge ${a}$.`, `$${bare(a)} \\ge 0$ 即 $x \\ge ${a}$。`);
        } else if (form === 1) {
          f = `\\sqrt{${poly([a, ""], [-1, "x"])}}`;
          set = union(between(undefined, false, a, true));
          why =
            a === 0
              ? t("The root needs $-x \\ge 0$, that is, $x \\le 0$.", "根式要求 $-x \\ge 0$，即 $x \\le 0$。")
              : t(`$${poly([a, ""], [-1, "x"])} \\ge 0$ means $x \\le ${a}$.`, `$${poly([a, ""], [-1, "x"])} \\ge 0$ 即 $x \\le ${a}$。`);
        } else if (form === 2) {
          f = `\\ln${fac(a) === "x" ? " x" : fac(a)}`;
          set = union(open(a));
          why =
            a === 0
              ? t("The logarithm needs $x > 0$.", "对数要求 $x > 0$。")
              : t(`The logarithm needs $${bare(a)} > 0$, that is, $x > ${a}$.`, `对数要求 $${bare(a)} > 0$，即 $x > ${a}$。`);
        } else if (form === 3) {
          f = `\\frac{1}{\\sqrt{${bare(a)}}}`;
          set = union(open(a));
          why = t(
            `The root needs $${bare(a)} \\ge 0$ and the denominator must not be $0$, so $x > ${a}$.`,
            `根式要求 $${bare(a)} \\ge 0$，且分母不能为 $0$，所以 $x > ${a}$。`,
          );
        } else {
          f = form === 4 ? `\\frac{\\sqrt{${bare(a)}}}{${bare(b)}}` : `\\frac{\\ln${fac(a) === "x" ? " x" : fac(a)}}{${bare(b)}}`;
          const closed = form === 4;
          set = b > a ? union(between(a, closed, b, false), open(b)) : union(between(a, closed, undefined, false));
          why = t(
            `${closed ? `The root needs $x \\ge ${a}$` : `The logarithm needs $x > ${a}$`}, and the denominator is $0$ at $x = ${b}$${b > a ? ", which must be removed" : ", which is already outside"}.`,
            `${closed ? `根式要求 $x \\ge ${a}$` : `对数要求 $x > ${a}$`}，分母在 $x = ${b}$ 处为 $0$${b > a ? "，必须去掉这一点" : "，它已经不在范围内"}。`,
          );
        }
        return intervalProblem({
          prompt: t(
            `On what set is $f(x) = ${f}$ continuous? Answer in interval notation.`,
            `$f(x) = ${f}$ 在什么集合上连续？用区间表示。`,
          ),
          set,
          wrong: [union(open(a)), union(between(a, true, undefined, false)), union(open(undefined, a)), union(open(undefined, a), open(a))],
          solution: t(`$f$ is continuous on its domain. ${why.en}`, `$f$ 在其定义域上连续。${why["zh-CN"]}`),
        });
      },
    },
    {
      id: "continuity-on-the-real-line",
      title: t("Continuity on the whole real line", "在整个实数轴上的连续性"),
      explanation: t(
        "A function built from continuous pieces is continuous for every real $x$ when nothing in it is ever undefined: no denominator becomes $0$, no square root gets a negative input and no logarithm a non-positive one. Look for those dangers, not for how complicated the formula is: $\\frac{1}{x^{2} + 1}$ is continuous everywhere, but $\\frac{1}{x^{2} - 1}$ is not.",
        "由连续函数构成的函数，只要处处都有定义，就对所有实数 $x$ 连续：分母永不为 $0$，平方根里永不为负，对数里永远为正。要找的是这些危险，而不是看公式有多复杂：$\\frac{1}{x^{2} + 1}$ 处处连续，而 $\\frac{1}{x^{2} - 1}$ 则不然。",
      ),
      generate(rng) {
        const k = rng.int(1, 9);
        const c = rng.nonZero(-4, 4);
        const forms: readonly [string, boolean, Text][] = [
          [
            `\\frac{${c}}{x^{2} + ${k}}`,
            true,
            t(`$x^{2} + ${k} \\ge ${k} > 0$, so the denominator is never $0$.`, `$x^{2} + ${k} \\ge ${k} > 0$，所以分母永不为 $0$。`),
          ],
          [
            `\\frac{${c}}{x^{2} - ${k}}`,
            false,
            t(`The denominator is $0$ at $x = \\pm ${sqrtLatex(k)}$.`, `分母在 $x = \\pm ${sqrtLatex(k)}$ 处为 $0$。`),
          ],
          [
            `\\sqrt{x^{2} + ${k}}`,
            true,
            t(`$x^{2} + ${k} > 0$ for every $x$, so the root is always defined.`, `对每个 $x$ 都有 $x^{2} + ${k} > 0$，所以根式总有定义。`),
          ],
          [
            `\\sqrt{x^{2} - ${k}}`,
            false,
            t(
              `$x^{2} - ${k} < 0$ for $x$ near $0$, where the root is not defined.`,
              `当 $x$ 在 $0$ 附近时 $x^{2} - ${k} < 0$，根式没有定义。`,
            ),
          ],
          [
            `\\ln(x^{2} + ${k})`,
            true,
            t(
              `$x^{2} + ${k} > 0$ for every $x$, so the logarithm is always defined.`,
              `对每个 $x$ 都有 $x^{2} + ${k} > 0$，所以对数总有定义。`,
            ),
          ],
          [
            `\\ln|${poly([1, "x"], [c, ""])}|`,
            false,
            t(
              `The logarithm is not defined at $x = ${-c}$, where $|${poly([1, "x"], [c, ""])}| = 0$.`,
              `在 $x = ${-c}$ 处 $|${poly([1, "x"], [c, ""])}| = 0$，对数没有定义。`,
            ),
          ],
          [
            `e^{${c === 1 ? "" : c === -1 ? "-" : c}x} + \\sin ${k}x`,
            true,
            t(
              `Exponential and sine functions are continuous everywhere, and so is their sum.`,
              `指数函数和正弦函数处处连续，它们的和也处处连续。`,
            ),
          ],
          [
            `\\frac{e^{x}}{\\cos x - ${k + 1}}`,
            true,
            t(`$\\cos x \\le 1 < ${k + 1}$, so the denominator is never $0$.`, `$\\cos x \\le 1 < ${k + 1}$，所以分母永不为 $0$。`),
          ],
          [`\\frac{${c}}{\\sin x}`, false, t(`The denominator is $0$ at $x = 0$.`, `分母在 $x = 0$ 处为 $0$。`)],
          [`\\frac{x^{2} - ${k}}{e^{x} - 1}`, false, t(`The denominator is $0$ at $x = 0$.`, `分母在 $x = 0$ 处为 $0$。`)],
          [
            `|x - ${k}| ${c < 0 ? "-" : "+"} ${poly([Math.abs(c), "x^{3}"])}`,
            true,
            t(`Absolute values and polynomials are continuous everywhere.`, `绝对值函数与多项式处处连续。`),
          ],
          [
            `\\tan ${k}x`,
            false,
            t(`$\\tan ${k}x$ is not defined where $\\cos ${k}x = 0$.`, `$\\tan ${k}x$ 在 $\\cos ${k}x = 0$ 处没有定义。`),
          ],
        ];
        const [f, yes, why] = rng.pick(forms);
        return yesNoProblem(
          t(`Is $f(x) = ${f}$ continuous for every real number $x$?`, `$f(x) = ${f}$ 对每个实数 $x$ 都连续吗？`),
          yes,
          why,
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
  knowledgePoints: [
    {
      id: "values-guaranteed-by-the-ivt",
      title: t("Values guaranteed by the IVT", "介值定理保证的值"),
      explanation: t(
        "**Intermediate Value Theorem.** If $f$ is continuous on $[a, b]$ and $N$ is any number between $f(a)$ and $f(b)$, then $f(c) = N$ for at least one $c$ in $(a, b)$.\n\nThe theorem guarantees only the values between $f(a)$ and $f(b)$; $f$ may or may not reach others.",
        "**介值定理** 若 $f$ 在 $[a, b]$ 上连续，$N$ 是介于 $f(a)$ 与 $f(b)$ 之间的任意数，则 $(a, b)$ 中至少有一个 $c$ 使 $f(c) = N$。\n\n定理只保证 $f(a)$ 与 $f(b)$ 之间的值；其他值 $f$ 可能取到，也可能取不到。",
      ),
      generate(rng) {
        const a = rng.int(-5, 3);
        const b = a + rng.int(2, 5);
        const p = rng.int(-9, 9);
        const q = rng.pick(range(-9, 9).filter((x) => Math.abs(x - p) >= 4));
        const [lo, hi] = [Math.min(p, q), Math.max(p, q)];
        const inside = rng.int(lo + 1, hi - 1);
        const outside = [lo - rng.int(1, 4), hi + rng.int(1, 4), hi + rng.int(5, 8), lo - rng.int(5, 8)];
        return oneOf(
          rng,
          t(
            `$f$ is continuous on $[${a}, ${b}]$, with $f(${a}) = ${p}$ and $f(${b}) = ${q}$. Which value must $f$ take somewhere in $(${a}, ${b})$?`,
            `$f$ 在 $[${a}, ${b}]$ 上连续，$f(${a}) = ${p}$，$f(${b}) = ${q}$。$f$ 在 $(${a}, ${b})$ 中一定能取到下列哪个值？`,
          ),
          same(`$${inside}$`),
          outside.map((v) => same(`$${v}$`)),
          t(
            `By the Intermediate Value Theorem, $f$ takes every value between $${lo}$ and $${hi}$ on $(${a}, ${b})$. Only $${inside}$ lies between them; the others may or may not be reached.`,
            `由介值定理，$f$ 在 $(${a}, ${b})$ 上取到 $${lo}$ 与 $${hi}$ 之间的每个值。只有 $${inside}$ 在它们之间；其他值可能取到，也可能取不到。`,
          ),
        );
      },
    },
    {
      id: "locating-a-root-with-the-ivt",
      title: t("Locating a root with the IVT", "用介值定理确定根的位置"),
      explanation: t(
        "If $f$ is continuous and $f(a)$ and $f(b)$ have opposite signs, then $0$ lies between them, so $f$ has a root in $(a, b)$. In a table of values, look for consecutive entries where the sign changes.",
        "若 $f$ 连续，且 $f(a)$ 与 $f(b)$ 异号，则 $0$ 介于二者之间，所以 $f$ 在 $(a, b)$ 内有根。在数值表中，找出符号发生变化的相邻两项。",
      ),
      generate(rng) {
        const start = rng.int(-4, 1);
        const xs = range(start, start + 4);
        const change = rng.int(0, 3);
        const s = rng.sign();
        const ys = xs.map((_, i) => (i <= change ? s : -s) * rng.int(1, 12));
        const at = (i: number) => same(`$(${xs[i]}, ${xs[i + 1]})$`);
        return oneOf(
          rng,
          t(
            `$f$ is continuous, and some of its values are shown.\n\n${table(
              ["$x$", ...xs.map((x) => `$${x}$`)],
              ["$f(x)$", ...ys.map((y) => `$${y}$`)],
            )}\n\nOn which interval does the Intermediate Value Theorem guarantee a root of $f$?`,
            `$f$ 连续，它的一些值如下表。\n\n${table(
              ["$x$", ...xs.map((x) => `$${x}$`)],
              ["$f(x)$", ...ys.map((y) => `$${y}$`)],
            )}\n\n介值定理保证 $f$ 在哪个区间内有根？`,
          ),
          at(change),
          [0, 1, 2, 3].filter((i) => i !== change).map(at),
          t(
            `$f(${xs[change]}) = ${ys[change]}$ and $f(${xs[change + 1]}) = ${ys[change + 1]}$ have opposite signs, so $f$ has a root in $(${xs[change]}, ${xs[change + 1]})$. Elsewhere the sign does not change.`,
            `$f(${xs[change]}) = ${ys[change]}$ 与 $f(${xs[change + 1]}) = ${ys[change + 1]}$ 异号，所以 $f$ 在 $(${xs[change]}, ${xs[change + 1]})$ 内有根。其他相邻两项符号不变。`,
          ),
        );
      },
    },
    {
      id: "when-the-ivt-applies",
      title: t("When the IVT applies", "介值定理何时适用"),
      explanation: t(
        "The theorem needs $f$ to be continuous on the **whole** interval $[a, b]$. $f(x) = \\frac{1}{x}$ has $f(-1) = -1 < 0 < 1 = f(1)$, yet it has no root in $(-1, 1)$: it is not continuous at $0$, so the theorem says nothing.",
        "定理要求 $f$ 在**整个**区间 $[a, b]$ 上连续。$f(x) = \\frac{1}{x}$ 满足 $f(-1) = -1 < 0 < 1 = f(1)$，但它在 $(-1, 1)$ 内没有根：它在 $0$ 处不连续，所以定理不能用。",
      ),
      generate(rng) {
        const c = rng.int(-4, 4);
        const a = c - rng.int(1, 3);
        const b = c + rng.int(1, 3);
        const k = rng.int(1, 6);
        const broken = rng.bool();
        // Both functions are negative at a and positive at b.
        const f = broken ? `\\frac{${k}}{${bare(c)}}` : poly([k, "x"], [-k * c, ""]);
        const fa = broken ? Q.of(k, a - c) : Q.of(k * (a - c));
        const fb = broken ? Q.of(k, b - c) : Q.of(k * (b - c));
        return yesNoProblem(
          t(
            `Let $f(x) = ${f}$. Does the Intermediate Value Theorem guarantee that $f$ has a root in $(${a}, ${b})$?`,
            `设 $f(x) = ${f}$。介值定理能否保证 $f$ 在 $(${a}, ${b})$ 内有根？`,
          ),
          !broken,
          broken
            ? t(
                `$f(${a}) = ${fa.toLatex()}$ and $f(${b}) = ${fb.toLatex()}$ have opposite signs, but $f$ is not continuous at $x = ${c}$, which lies in $[${a}, ${b}]$. The theorem does not apply, and indeed $f$ is never $0$.`,
                `$f(${a}) = ${fa.toLatex()}$ 与 $f(${b}) = ${fb.toLatex()}$ 异号，但 $f$ 在 $[${a}, ${b}]$ 中的 $x = ${c}$ 处不连续。定理不适用，而且 $f$ 确实永不为 $0$。`,
              )
            : t(
                `$f$ is a polynomial, so it is continuous on $[${a}, ${b}]$, and $f(${a}) = ${fa.toLatex()} < 0 < ${fb.toLatex()} = f(${b})$. The theorem guarantees a root.`,
                `$f$ 是多项式，在 $[${a}, ${b}]$ 上连续，且 $f(${a}) = ${fa.toLatex()} < 0 < ${fb.toLatex()} = f(${b})$。定理保证有根。`,
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
  knowledgePoints: [
    {
      id: "redefining-a-function-at-a-hole",
      title: t("Redefining a function at a hole", "在空心点处重新定义函数"),
      explanation: t(
        "A point discontinuity is removed by defining $f(a)$ to be $\\lim_{x \\to a} f(x)$. For a quotient that is $\\frac{0}{0}$ at $a$, factor, cancel and substitute:\n\n$$\\frac{x^{3} - 8}{x - 2} = x^{2} + 2x + 4 \\; (x \\ne 2), \\text{ so define } f(2) = 12.$$",
        "把 $f(a)$ 定义为 $\\lim_{x \\to a} f(x)$，就能消除可去间断点。对于在 $a$ 处为 $\\frac{0}{0}$ 的商，先因式分解、约分再代入：\n\n$$\\frac{x^{3} - 8}{x - 2} = x^{2} + 2x + 4 \\; (x \\ne 2), \\text{ 所以定义 } f(2) = 12.$$",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const cubic = rng.bool(0.4);
        const v = rng.int(-9, 9);
        let top: string;
        let answer: number;
        let work: string;
        if (cubic) {
          top = poly([1, "x^{3}"], [-(a ** 3), ""]);
          answer = 3 * a * a;
          work = `\\frac{${top}}{${bare(a)}} = ${poly([1, "x^{2}"], [a, "x"], [a * a, ""])} \\to 3(${a})^{2} = ${answer}`;
        } else {
          const m = rng.pick([1, 2, 3, -1, -2]);
          const b = rng.pick(range(-6, 6).filter((x) => x !== a));
          top = quadraticFrom(m, a, b);
          answer = m * (a - b);
          work = `\\frac{${top}}{${bare(a)}} = ${poly([m, "x"], [-m * b, ""])} \\to ${answer}`;
        }
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
          solution: t(
            `Find the limit as $x \\to ${a}$:$$${work}.$$${answer === v ? "" : `So redefine $f(${a}) = ${answer}$.`}`,
            `求 $x \\to ${a}$ 时的极限：$$${work}.$$${answer === v ? "" : `所以重新定义 $f(${a}) = ${answer}$。`}`,
          ),
        });
      },
    },
    {
      id: "removing-a-discontinuity-of-a-radical-quotient",
      title: t("Removing a discontinuity of a radical quotient", "消除根式商的间断点"),
      explanation: t(
        "For a quotient with a square root, find the limit by multiplying by the conjugate:\n\n$$\\frac{\\sqrt{x + 5} - 3}{x - 4} = \\frac{x + 5 - 9}{(x - 4)(\\sqrt{x + 5} + 3)} = \\frac{1}{\\sqrt{x + 5} + 3} \\to \\frac{1}{6},$$\n\nso defining $f(4) = \\frac{1}{6}$ removes the discontinuity.",
        "对含平方根的商，乘以共轭式求极限：\n\n$$\\frac{\\sqrt{x + 5} - 3}{x - 4} = \\frac{x + 5 - 9}{(x - 4)(\\sqrt{x + 5} + 3)} = \\frac{1}{\\sqrt{x + 5} + 3} \\to \\frac{1}{6},$$\n\n所以定义 $f(4) = \\frac{1}{6}$ 就消除了间断点。",
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
        return numberProblem({
          prompt: t(
            `$f(x) = \\frac{${top}}{${bare(e)}}$ has a point discontinuity at $x = ${e}$. What value of $f(${e})$ removes it?`,
            `$f(x) = \\frac{${top}}{${bare(e)}}$ 在 $x = ${e}$ 处有可去间断点。$f(${e})$ 取何值能消除它？`,
          ),
          answer,
          wrong: [Q.of(k, d), Q.of(k * 2 * d), Q.zero, Q.of(k, d * d)],
          solution: t(
            `Multiply by the conjugate:$$\\frac{${top}}{${bare(e)}} \\cdot \\frac{\\sqrt{${inner}} + ${d}}{\\sqrt{${inner}} + ${d}} = \\frac{${k === 1 ? bare(e) : `${k}\\left(${bare(e)}\\right)`}}{${fac(e)}\\left(\\sqrt{${inner}} + ${d}\\right)} = \\frac{${k}}{\\sqrt{${inner}} + ${d}} \\to \\frac{${k}}{${2 * d}}${last}.$$`,
            `乘以共轭式：$$\\frac{${top}}{${bare(e)}} \\cdot \\frac{\\sqrt{${inner}} + ${d}}{\\sqrt{${inner}} + ${d}} = \\frac{${k === 1 ? bare(e) : `${k}\\left(${bare(e)}\\right)`}}{${fac(e)}\\left(\\sqrt{${inner}} + ${d}\\right)} = \\frac{${k}}{\\sqrt{${inner}} + ${d}} \\to \\frac{${k}}{${2 * d}}${last}.$$`,
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
  knowledgePoints: [
    {
      id: "a-constant-in-both-pieces",
      title: t("A constant in both pieces", "两段中都含有常数"),
      explanation: t(
        "A jump cannot be removed by changing one value: the two pieces themselves must meet. When the constant appears in both pieces, set them equal at the break point and collect the constant on one side:\n\n$$f(x) = \\begin{cases} kx^{2} + 1 & x < 2 \\\\ kx + 7 & x \\ge 2 \\end{cases}: \\quad 4k + 1 = 2k + 7 \\implies k = 3.$$",
        "跳跃不能靠改变一个函数值来消除：两段本身必须接上。当常数出现在两段中时，令它们在分段点处相等，并把常数移到同一边：\n\n$$f(x) = \\begin{cases} kx^{2} + 1 & x < 2 \\\\ kx + 7 & x \\ge 2 \\end{cases}: \\quad 4k + 1 = 2k + 7 \\implies k = 3.$$",
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
        return numberProblem({
          prompt: t(
            `Let $$${f}$$ Find the value of $k$ that makes $f$ continuous everywhere.`,
            `设 $$${f}$$ 求使 $f$ 处处连续的 $k$ 的值。`,
          ),
          answer: k,
          solveFor: "k",
          wrong: [Q.of(c2 - c1, a * a + a), Q.of(c1 - c2, a * a - a), Q.of(c2 - c1, a * a)],
          solution: t(
            `Each piece is continuous, so only $x = ${a}$ matters. Set the pieces equal there:$$${a * a}k${tail(c1)} = ${a}k${tail(c2)} \\implies ${a * a - a}k = ${c2 - c1} \\implies k = ${k.toLatex()}.$$`,
            `每一段都连续，所以只需考虑 $x = ${a}$。令两段在该处相等：$$${a * a}k${tail(c1)} = ${a}k${tail(c2)} \\implies ${a * a - a}k = ${c2 - c1} \\implies k = ${k.toLatex()}.$$`,
          ),
        });
      },
    },
    {
      id: "two-constants-and-two-break-points",
      title: t("Two constants and two break points", "两个常数与两个分段点"),
      explanation: t(
        "With two break points there are two conditions, one at each, which give two equations for two constants. For a middle piece $ax + b$ between $x = p$ and $x = q$, the line must pass through the end of the left piece at $p$ and the start of the right piece at $q$.",
        "有两个分段点就有两个条件，每个分段点一个，得到关于两个常数的两个方程。若中间一段 $ax + b$ 位于 $x = p$ 与 $x = q$ 之间，这条直线必须经过左段在 $p$ 处的端点，以及右段在 $q$ 处的起点。",
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
          solution: t(
            `At $x = ${p}$ the left piece gives $${lp}$; at $x = ${q}$ the right piece gives $${lq}$. So$$${poly([p, "a"])} + b = ${lp}, \\quad ${poly([q, "a"])} + b = ${lq}.$$Subtracting, $${q - p}a = ${lq - lp}$, so $a = ${a}$ and $b = ${b}$.`,
            `在 $x = ${p}$ 处左段的值为 $${lp}$；在 $x = ${q}$ 处右段的值为 $${lq}$。所以$$${poly([p, "a"])} + b = ${lp}, \\quad ${poly([q, "a"])} + b = ${lq}.$$两式相减得 $${q - p}a = ${lq - lp}$，所以 $a = ${a}$，$b = ${b}$。`,
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
  knowledgePoints: [
    {
      id: "the-value-that-removes-a-hole",
      title: t("The value that removes a hole", "消除空心点所需的值"),
      explanation: t(
        "Factor the rational function. A factor that cancels marks a removable discontinuity; define $f$ there as the value of the simplified function:\n\n$$\\frac{x^{2} - 1}{x^{2} + 2x - 3} = \\frac{(x - 1)(x + 1)}{(x - 1)(x + 3)} = \\frac{x + 1}{x + 3},$$\n\nso defining $f(1) = \\frac{1}{2}$ removes the discontinuity at $x = 1$. The one at $x = -3$ cannot be removed.",
        "把有理函数因式分解。能约去的因式对应可去间断点；把 $f$ 在该点的值定义为化简后函数的值：\n\n$$\\frac{x^{2} - 1}{x^{2} + 2x - 3} = \\frac{(x - 1)(x + 1)}{(x - 1)(x + 3)} = \\frac{x + 1}{x + 3},$$\n\n所以定义 $f(1) = \\frac{1}{2}$ 就消除了 $x = 1$ 处的间断点。$x = -3$ 处的间断点无法消除。",
      ),
      generate(rng) {
        const [a, b, c] = rng.sample(range(-6, 6), 3) as [number, number, number];
        const m = rng.pick([1, 1, 2, -1, 3]);
        const answer = Q.of(m * (a - b), a - c);
        return numberProblem({
          prompt: t(
            `$f(x) = \\frac{${quadraticFrom(m, a, b)}}{${quadraticFrom(1, a, c)}}$ has one removable discontinuity. What value of $f$ at that point removes it?`,
            `$f(x) = \\frac{${quadraticFrom(m, a, b)}}{${quadraticFrom(1, a, c)}}$ 有一个可去间断点。$f$ 在该点取何值能消除它？`,
          ),
          answer,
          wrong: [Q.of(m * (c - b), c - a), Q.of(m * (a - b)), Q.of(a), Q.of(m)],
          solution: t(
            `Factor:$$f(x) = \\frac{${m === 1 ? "" : m === -1 ? "-" : m}${fac(a)}${fac(b)}}{${fac(a)}${fac(c)}} = \\frac{${poly([m, "x"], [-m * b, ""])}}{${bare(c)}} \\quad (x \\ne ${a}).$$The factor $${fac(a)}$ cancels, so the discontinuity at $x = ${a}$ is removable. Substituting $x = ${a}$ gives $${answer.toLatex()}$.`,
            `因式分解：$$f(x) = \\frac{${m === 1 ? "" : m === -1 ? "-" : m}${fac(a)}${fac(b)}}{${fac(a)}${fac(c)}} = \\frac{${poly([m, "x"], [-m * b, ""])}}{${bare(c)}} \\quad (x \\ne ${a}).$$因式 $${fac(a)}$ 被约去，所以 $x = ${a}$ 处的间断点可去。代入 $x = ${a}$ 得 $${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "which-discontinuities-are-removable",
      figure: calculusDrawings1["removing-discontinuities-from-rational-functions#which-discontinuities-are-removable"],
      title: t("Which discontinuities are removable", "哪些间断点可去"),
      explanation: t(
        "Factor numerator and denominator completely. Each zero of the denominator whose factor cancels is removable; each whose factor remains is a vertical asymptote and cannot be removed. There may be none, one or several removable ones.",
        "把分子分母完全因式分解。分母的零点中，因式能约去的是可去间断点；因式保留下来的是竖直渐近线，不能消除。可去间断点可能没有，也可能有一个或多个。",
      ),
      generate(rng) {
        const [r1, r2, n1, n2] = rng.sample(range(-6, 6), 4) as [number, number, number, number];
        const shared = rng.int(0, 2);
        const tops = shared === 0 ? [n1, n2] : shared === 1 ? [r1, n2] : [r1, r2];
        const m = rng.pick([1, 2, -1, 3]);
        const values = shared === 0 ? [] : shared === 1 ? [r1] : [r1, r2];
        return solutionsProblem({
          prompt: t(
            `Find every $x$ at which $f(x) = \\frac{${quadraticFrom(m, tops[0]!, tops[1]!)}}{${quadraticFrom(1, r1, r2)}}$ has a removable discontinuity. If there is none, type none.`,
            `求 $f(x) = \\frac{${quadraticFrom(m, tops[0]!, tops[1]!)}}{${quadraticFrom(1, r1, r2)}}$ 的所有可去间断点的 $x$ 值。若没有，回答 $\\varnothing$。`,
          ),
          values: values.map(String),
          wrong: [[String(r1), String(r2)], tops.map(String), [], [String(r2)]],
          solution: t(
            `$$f(x) = \\frac{${m === 1 ? "" : m === -1 ? "-" : m}${fac(tops[0]!)}${fac(tops[1]!)}}{${fac(r1)}${fac(r2)}}.$$${
              shared === 0
                ? "No factor cancels, so both discontinuities are vertical asymptotes and none is removable."
                : shared === 1
                  ? `Only $${fac(r1)}$ cancels, so only $x = ${r1}$ is removable; $x = ${r2}$ is a vertical asymptote.`
                  : `Both factors cancel, leaving $f(x) = ${m}$ with two holes, so both $x = ${r1}$ and $x = ${r2}$ are removable.`
            }`,
            `$$f(x) = \\frac{${m === 1 ? "" : m === -1 ? "-" : m}${fac(tops[0]!)}${fac(tops[1]!)}}{${fac(r1)}${fac(r2)}}.$$${
              shared === 0
                ? "没有因式能约去，所以两个间断点都是竖直渐近线，都不可去。"
                : shared === 1
                  ? `只有 $${fac(r1)}$ 能约去，所以只有 $x = ${r1}$ 可去；$x = ${r2}$ 是竖直渐近线。`
                  : `两个因式都能约去，剩下 $f(x) = ${m}$ 和两个空心点，所以 $x = ${r1}$ 和 $x = ${r2}$ 都可去。`
            }`,
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
