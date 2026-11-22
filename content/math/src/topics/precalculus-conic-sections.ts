import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, Q } from "@ga/subject-math";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { remainingDrawings7 } from "../explanation-drawings-remaining-7.ts";
import { choiceProblem, equationProblem, numberProblem, pointProblem, radicalProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// ---------------------------------------------------------------------------
// Helpers for Conic Sections
// ---------------------------------------------------------------------------

/** co writes a coefficient in front of a variable, dropping a 1: "", "\\frac{3}{4}". */
const co = (c: string) => (c === "1" ? "" : c);

/** Pythagorean triples [b, c, a] for ellipses (a^2 = b^2 + c^2) or [a, b, c] for hyperbolas (c^2 = a^2 + b^2). */
const pythTriples = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [9, 12, 15],
  [12, 9, 15],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
  [10, 24, 26],
  [24, 10, 26],
  [12, 16, 20],
  [16, 12, 20],
  [15, 20, 25],
  [20, 15, 25],
] as const;

/** sqTerm writes (v - h)^2 or v^2 if h is 0. */
function sqTerm(v: string, h: number): string {
  if (h === 0) return `${v}^{2}`;
  return h > 0 ? `(${v} - ${h})^{2}` : `(${v} + ${-h})^{2}`;
}

/** linTerm writes (v - h) or v if h is 0. */
function linTerm(v: string, h: number): string {
  if (h === 0) return v;
  return h > 0 ? `(${v} - ${h})` : `(${v} + ${-h})`;
}

/** ellipseEq writes standard form of an ellipse. */
function ellipseEq(h: number, k: number, a2: number, b2: number, horizontal: boolean): string {
  const xDen = horizontal ? a2 : b2;
  const yDen = horizontal ? b2 : a2;
  return `\\frac{${sqTerm("x", h)}}{${xDen}} + \\frac{${sqTerm("y", k)}}{${yDen}} = 1`;
}

/** hyperbolaEq writes standard form of a hyperbola. */
function hyperbolaEq(h: number, k: number, a2: number, b2: number, horizontal: boolean): string {
  if (horizontal) {
    return `\\frac{${sqTerm("x", h)}}{${a2}} - \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
  }
  return `\\frac{${sqTerm("y", k)}}{${a2}} - \\frac{${sqTerm("x", h)}}{${b2}} = 1`;
}

/** pmFrac writes \pm p/q in reduced LaTeX form. */
function pmFrac(p: number, q: number): string {
  const frac = Q.of(p, q);
  if (frac.isInteger()) return `\\pm ${frac.abs().toLatex()}`;
  return `\\pm ${frac.abs().toLatex()}`;
}

/** makeChoice builds a 4-option multiple-choice problem from LaTeX string options. */
function makeChoice(
  rng: Rng,
  prompt: Text,
  correct: string,
  distractors: readonly string[],
  solution: Text,
  reasons: readonly Reason[] = [],
): Problem {
  const cleanCorrect = correct.trim();
  const seen = new Set<string>([cleanCorrect]);
  const validDistractors: string[] = [];
  for (const d of distractors) {
    const s = d.trim();
    if (!seen.has(s) && s.length > 0) {
      seen.add(s);
      validDistractors.push(s);
    }
  }
  let fallbackCount = 1;
  while (validDistractors.length < 3) {
    const fallback = `${cleanCorrect} + ${fallbackCount}`;
    if (!seen.has(fallback)) {
      seen.add(fallback);
      validDistractors.push(fallback);
    }
    fallbackCount++;
  }
  const chosenDistractors = rng.shuffle(validDistractors).slice(0, 3);
  const rawOptions = rng.shuffle([cleanCorrect, ...chosenDistractors]);
  const options = rawOptions.map((s) => t(`$${s}$`, `$${s}$`));
  const correctIdx = options.findIndex((o) => o.en === `$${cleanCorrect}$`);
  const problem = choiceProblem({
    prompt,
    options,
    correct: correctIdx,
    solution,
  });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** makeChoiceTexts builds a 4-option multiple-choice problem from bilingual Text options. */
function makeChoiceTexts(
  rng: Rng,
  prompt: Text,
  correct: Text,
  distractors: readonly Text[],
  solution: Text,
  reasons: readonly Reason[] = [],
): Problem {
  const seen = new Set<string>([correct.en]);
  const valid: Text[] = [];
  for (const d of distractors) {
    if (!seen.has(d.en) && d.en.length > 0) {
      seen.add(d.en);
      valid.push(d);
    }
  }
  let fallbackCount = 1;
  while (valid.length < 3) {
    const fallback = t(`${correct.en} (${fallbackCount})`, `${correct["zh-CN"]} (${fallbackCount})`);
    if (!seen.has(fallback.en)) {
      seen.add(fallback.en);
      valid.push(fallback);
    }
    fallbackCount++;
  }
  const chosen = rng.shuffle(valid).slice(0, 3);
  const options = rng.shuffle([correct, ...chosen]);
  const correctIdx = options.findIndex((o) => o.en === correct.en);
  const problem = choiceProblem({
    prompt,
    options,
    correct: correctIdx,
    solution,
  });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check, in each locale. */
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

/** why pairs a wrong option, written in LaTeX, with what is wrong with it in English and Chinese. */
const why = (tex: string, en: string, zh: string): Reason => [`$${tex}$`, en, zh];

/** signedTerm writes a term with its sign in front, as " + 4x" or " - 2y". */
const signedTerm = (n: number, v: string) => (n < 0 ? ` - ${-n}${v}` : ` + ${n}${v}`);

/**
 * squaresCompleted writes the two lines that group Ax^2 + By^2 + Cx + Dy + E = 0, for an ellipse with center (h, k), and complete
 * both squares, ending with K on the right.
 */
function squaresCompleted(A: number, B: number, h: number, k: number, K: number): [string, string] {
  const E = A * h * h + B * k * k - K;
  const a = co(String(A));
  const b = co(String(B));
  return [
    `${a}\\left(x^{2}${signedTerm(-2 * h, "x")}\\right) + ${b}\\left(y^{2}${signedTerm(-2 * k, "y")}\\right) = ${-E}`,
    `${a}${sqTerm("x", h)} + ${b}${sqTerm("y", k)} = ${-E} + ${A * h * h} + ${B * k * k} = ${K}`,
  ];
}

// ===========================================================================
// Module 7.26. Ellipses as Conic Sections (Topics 1 - 10)
// ===========================================================================

export const introductionToEllipses: TopicDef = {
  id: "introduction-to-ellipses",
  title: t("Introduction to Ellipses", "椭圆的概念与几何定义"),
  summary: t(
    "Explore the geometric definition of an ellipse as the locus of points where the sum of distances to two foci is constant, and identify its center and axes.",
    "理解椭圆的几何定义（到两焦点的距离之和为定值 2a），并识别椭圆的中心、长轴和短轴。",
  ),
  prerequisites: ["equations-of-circles"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `Pin the two ends of a string of length $10$ at two points $F_{1}$ and $F_{2}$ that are $6$ apart, pull the string tight with a pencil and trace all the way round. Every point $P$ the pencil reaches has $PF_{1} + PF_{2} = 10$, and the curve it draws is an ellipse. Where the pencil crosses the line through the pins beyond $F_{2}$, the two pieces of string are $8$ and $2$, so that point is $\\frac{8 + 2}{2} = 5$ from the midpoint of the pins: the semi-major axis is $a = 5$.

Check: $8 + 2 = 10 = 2a$, and the distance from that point back to $F_{1}$, $8$, is $5$ from the midpoint plus $3$ from the midpoint to $F_{1}$.

In this lesson we use the constant sum of distances to find a missing distance, find the lengths of the major and minor axes, and find the center as a midpoint.`,
    `把一根长 $10$ 的线的两端钉在相距 $6$ 的两点 $F_{1}$ 和 $F_{2}$ 上，用铅笔把线拉紧绕一圈。铅笔到达的每一点 $P$ 都满足 $PF_{1} + PF_{2} = 10$，画出的曲线就是椭圆。铅笔在 $F_{2}$ 外侧穿过两钉连线时，两段线长 $8$ 和 $2$，所以这一点到两钉中点的距离是 $\\frac{8 + 2}{2} = 5$：半长轴 $a = 5$。

检验：$8 + 2 = 10 = 2a$，这一点到 $F_{1}$ 的距离 $8$ 正是它到中点的 $5$ 加上中点到 $F_{1}$ 的 $3$。

这节课我们用距离之和为定值求未知距离，求长轴和短轴的长，并把中心作为中点求出来。`,
  ),
  knowledgePoints: [
    {
      id: "geometric-definition-of-an-ellipse",
      title: t("The geometric definition of an ellipse", "椭圆的几何定义"),
      explanation: t(
        "An ellipse is the set of all points $P$ in a plane such that the sum of the distances from $P$ to two fixed points $F_{1}$ and $F_{2}$ (the foci) is a constant $2a$, where $2a > F_{1}F_{2}$:\n\n$$PF_{1} + PF_{2} = 2a$$\n\nIf the distance to one focus is $d_{1}$, the distance to the other focus is $d_{2} = 2a - d_{1}$.\n\nThe sum is the same for every point, so one distance fixes the other. If the sum is $20$ and $PF_{1} = 7$, then $PF_{2} = 20 - 7 = 13$. Check: $7 + 13 = 20$.\n\n> **Watch out.** The constant is $2a$, the whole major axis. The other distance is $2a - d_{1}$, not $a - d_{1}$, and it is not $d_{1}$ again unless $P$ is equally far from both foci.",
        "椭圆是平面内到两个定点 $F_{1}$ 和 $F_{2}$（焦点）的距离之和为常数 $2a$ 的点的集合，其中 $2a > F_{1}F_{2}$：\n\n$$PF_{1} + PF_{2} = 2a$$\n\n如果点 $P$ 到一个焦点的距离是 $d_{1}$，那么到另一个焦点的距离就是 $d_{2} = 2a - d_{1}$。\n\n每一点的距离之和都相同，所以知道一个距离就能求出另一个。若和是 $20$，$PF_{1} = 7$，则 $PF_{2} = 20 - 7 = 13$。检验：$7 + 13 = 20$。\n\n> **注意。** 定值是 $2a$，即整条长轴。另一个距离是 $2a - d_{1}$，不是 $a - d_{1}$；除非 $P$ 到两焦点一样远，它也不等于 $d_{1}$。",
      ),
      generate(rng) {
        const a = rng.int(6, 18);
        const sumDist = 2 * a;
        const d1 = rng.int(2, sumDist - 2);
        const d2 = sumDist - d1;
        return numberProblem({
          prompt: t(
            `An ellipse is defined such that the sum of the distances from any point on it to the two foci $F_{1}$ and $F_{2}$ is $${sumDist}$. If a point $P$ lies on this ellipse and $PF_{1} = ${d1}$, what is the distance $PF_{2}$?`,
            `已知椭圆上任意一点到两个焦点 $F_{1}$ 和 $F_{2}$ 的距离之和为 $${sumDist}$。如果点 $P$ 在该椭圆上且 $PF_{1} = ${d1}$，那么距离 $PF_{2}$ 是多少？`,
          ),
          answer: d2,
          wrong: [d1, sumDist + d1, Math.abs(a - d1) || a + 1, sumDist, d2 + 2],
          solution: walked(
            [
              [
                ["Write the definition", "写出定义"],
                t(`Every point on the ellipse has the same sum of distances to the foci:`, `椭圆上每一点到两焦点的距离之和都相同：`),
                [`PF_{1} + PF_{2} = ${sumDist}`],
              ],
              [
                ["Subtract the known distance", "减去已知距离"],
                t(`Put in $PF_{1} = ${d1}$:`, `代入 $PF_{1} = ${d1}$：`),
                [`PF_{2} = ${sumDist} - ${d1} = ${d2}`],
              ],
            ],
            t(`$${d1} + ${d2} = ${sumDist}$, the given sum.`, `$${d1} + ${d2} = ${sumDist}$，正是给定的和。`),
          ),
        });
      },
    },
    {
      id: "major-and-minor-axes",
      figure: precalculusDrawings3["introduction-to-ellipses#major-and-minor-axes"],
      title: t("Major and minor axes of an ellipse", "椭圆的长轴与短轴"),
      explanation: t(
        "The major axis of an ellipse passes through the foci and vertices; its length is $2a$, where $a$ is the semi-major axis.\n\nThe minor axis is perpendicular to the major axis at the center; its length is $2b$, where $b$ is the semi-minor axis ($a > b > 0$).\n\nThe semi-axis $a$ runs from the center to a vertex, and the major axis runs from one vertex through the center to the other, so it is twice as long. With $a = 7$ and $b = 4$, the major axis is $2 \\times 7 = 14$ and the minor axis is $2 \\times 4 = 8$. Check: half of $14$ is $7 = a$, and $14 > 8$ because $a > b$.\n\n> **Watch out.** $a$ and $b$ are halves: the axes are $2a$ and $2b$. The major axis goes with $a$, the larger one, and the minor axis with $b$.",
        "椭圆的长轴穿过焦点和顶点，其长度为 $2a$，其中 $a$ 是半长轴。\n\n椭圆的短轴在中心处垂直于长轴，其长度为 $2b$，其中 $b$ 是半短轴（$a > b > 0$）。\n\n半轴 $a$ 从中心到一个顶点，长轴从一个顶点经过中心到另一个顶点，所以长度是它的两倍。若 $a = 7$，$b = 4$，长轴长 $2 \\times 7 = 14$，短轴长 $2 \\times 4 = 8$。检验：$14$ 的一半是 $7 = a$，且因为 $a > b$，$14 > 8$。\n\n> **注意。** $a$ 和 $b$ 是一半：两条轴长是 $2a$ 和 $2b$。长轴对应较大的 $a$，短轴对应 $b$。",
      ),
      generate(rng) {
        const a = rng.int(5, 16);
        const b = rng.int(2, a - 1);
        const askMajor = rng.bool();
        const prompt = askMajor
          ? t(
              `An ellipse has a semi-major axis of length $a = ${a}$ and a semi-minor axis of length $b = ${b}$. What is the length of its major axis?`,
              `一个椭圆的半长轴长为 $a = ${a}$，半短轴长为 $b = ${b}$。该椭圆的长轴长是多少？`,
            )
          : t(
              `An ellipse has a semi-major axis of length $a = ${a}$ and a semi-minor axis of length $b = ${b}$. What is the length of its minor axis?`,
              `一个椭圆的半长轴长为 $a = ${a}$，半短轴长为 $b = ${b}$。该椭圆的短轴长是多少？`,
            );
        const correctVal = askMajor ? 2 * a : 2 * b;
        const [half, v] = askMajor ? [a, "a"] : [b, "b"];
        const solution = walked(
          [
            [
              ["Pick the semi-axis", "选半轴"],
              askMajor
                ? t(`The major axis goes with the semi-major axis, $a = ${a}$.`, `长轴对应半长轴 $a = ${a}$。`)
                : t(`The minor axis goes with the semi-minor axis, $b = ${b}$.`, `短轴对应半短轴 $b = ${b}$。`),
            ],
            [
              ["Double it", "乘以 2"],
              t(
                `The axis runs from the center to the curve on both sides, so it is twice the semi-axis:`,
                `这条轴从中心向两边各伸到曲线，所以是半轴的两倍：`,
              ),
              [`2${v} = 2 \\times ${half} = ${2 * half}`],
            ],
          ],
          t(
            `Half of $${2 * half}$ is $${half} = ${v}$, and the major axis $${2 * a}$ is longer than the minor axis $${2 * b}$.`,
            `$${2 * half}$ 的一半是 $${half} = ${v}$，而且长轴 $${2 * a}$ 比短轴 $${2 * b}$ 长。`,
          ),
        );
        return numberProblem({
          prompt,
          answer: correctVal,
          wrong: [askMajor ? a : b, askMajor ? 2 * b : 2 * a, a + b, 2 * (a + b), Math.abs(2 * a - 2 * b) || 1],
          solution,
        });
      },
    },
    {
      id: "center-of-an-ellipse",
      title: t("The center of an ellipse", "椭圆的中心"),
      explanation: t(
        "The center $(h, k)$ of an ellipse is the midpoint of the major axis connecting its two vertices, and also the midpoint of the segment connecting its two foci:\n\n$$(h, k) = \\left(\\frac{x_{1} + x_{2}}{2}, \\frac{y_{1} + y_{2}}{2}\\right)$$\n\nAn ellipse is symmetric about both of its axes, so the center is halfway between the two vertices. For endpoints $(-3, 2)$ and $(7, 2)$, the center is $\\left(\\frac{-3 + 7}{2}, \\frac{2 + 2}{2}\\right) = (2, 2)$. Check: both endpoints are $5$ from $(2, 2)$.\n\n> **Watch out.** Add the coordinates and halve them. Subtracting them gives the length of the axis, $7 - (-3) = 10$, not the center.",
        "椭圆的中心 $(h, k)$ 是连接两顶点的长轴线段的中点，也是连接两焦点的线段的中点：\n\n$$(h, k) = \\left(\\frac{x_{1} + x_{2}}{2}, \\frac{y_{1} + y_{2}}{2}\\right)$$\n\n椭圆关于两条轴都对称，所以中心在两个顶点的正中间。端点为 $(-3, 2)$ 和 $(7, 2)$ 时，中心是 $\\left(\\frac{-3 + 7}{2}, \\frac{2 + 2}{2}\\right) = (2, 2)$。检验：两个端点到 $(2, 2)$ 的距离都是 $5$。\n\n> **注意。** 坐标要相加再除以 2。相减得到的是轴的长度 $7 - (-3) = 10$，不是中心。",
      ),
      generate(rng) {
        const h = rng.int(-7, 7);
        const k = rng.int(-7, 7);
        const d = rng.int(2, 9);
        const horizontal = rng.bool();
        const v1x = horizontal ? h - d : h;
        const v1y = horizontal ? k : k - d;
        const v2x = horizontal ? h + d : h;
        const v2y = horizontal ? k : k + d;
        return pointProblem({
          prompt: t(
            `The endpoints of the major axis of an ellipse are $(${v1x}, ${v1y})$ and $(${v2x}, ${v2y})$. What are the coordinates of the center of the ellipse?`,
            `某椭圆长轴的两端点坐标分别为 $(${v1x}, ${v1y})$ 和 $(${v2x}, ${v2y})$。该椭圆的中心坐标是什么？`,
          ),
          answer: [h, k],
          wrong: [
            [h + 1, k],
            [h, k + 1],
            [k, h],
            [h - 1, k - 1],
            [h + d, k],
          ],
          solution: walked(
            [
              [
                ["Average the x-coordinates", "求横坐标的平均"],
                t(`The center is the midpoint of the endpoints:`, `中心是两端点的中点：`),
                [`h = \\frac{${v1x} + ${paren(v2x)}}{2} = ${h}`],
              ],
              [
                ["Average the y-coordinates", "求纵坐标的平均"],
                t(`In the same way:`, `同样地：`),
                [`k = \\frac{${v1y} + ${paren(v2y)}}{2} = ${k}`],
              ],
            ],
            t(
              `Both endpoints are $${d}$ from $(${h}, ${k})$, along the ${horizontal ? "horizontal" : "vertical"} line through it, so $(${h}, ${k})$ is halfway between them.`,
              `两个端点沿过 $(${h}, ${k})$ 的${horizontal ? "水平" : "竖直"}直线到它的距离都是 $${d}$，所以 $(${h}, ${k})$ 在它们的正中间。`,
            ),
          ),
        });
      },
    },
  ],
};

export const equationsOfEllipsesCenteredAtTheOrigin: TopicDef = {
  id: "equations-of-ellipses-centered-at-the-origin",
  title: t("Equations of Ellipses Centered at the Origin", "中心在原点的椭圆标准方程"),
  summary: t(
    "Identify and write standard equations of ellipses centered at the origin, distinguishing horizontal and vertical orientations.",
    "识别并写出中心在原点的椭圆标准方程，区分焦点在 x 轴或 y 轴上的情况。",
  ),
  prerequisites: ["introduction-to-ellipses"],
  encompasses: [{ topic: "introduction-to-ellipses", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `An ellipse centered at the origin with vertices $(\\pm 5, 0)$ and co-vertices $(0, \\pm 3)$ is the unit circle $x^{2} + y^{2} = 1$ stretched by $5$ across and by $3$ up and down. Replacing $x$ with $\\frac{x}{5}$ and $y$ with $\\frac{y}{3}$ gives its equation, $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$.

Check: the vertex $(5, 0)$ gives $\\frac{25}{25} + 0 = 1$, and the co-vertex $(0, 3)$ gives $0 + \\frac{9}{9} = 1$.

In this lesson we write the equation of an ellipse centered at the origin when its major axis is horizontal and when it is vertical, and read $a$, $b$ and the direction of the major axis from an equation.`,
    `中心在原点、顶点为 $(\\pm 5, 0)$、短轴端点为 $(0, \\pm 3)$ 的椭圆，就是把单位圆 $x^{2} + y^{2} = 1$ 横向拉长到 $5$ 倍、纵向拉长到 $3$ 倍。把 $x$ 换成 $\\frac{x}{5}$、$y$ 换成 $\\frac{y}{3}$ 就得到它的方程 $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$。

检验：顶点 $(5, 0)$ 给出 $\\frac{25}{25} + 0 = 1$，短轴端点 $(0, 3)$ 给出 $0 + \\frac{9}{9} = 1$。

这节课我们写出长轴水平和长轴竖直时中心在原点的椭圆方程，并从方程读出 $a$、$b$ 和长轴的方向。`,
  ),
  knowledgePoints: [
    {
      id: "horizontal-ellipse-centered-at-origin",
      title: t("Horizontal ellipse centered at the origin", "焦点在 x 轴上的椭圆标准方程"),
      explanation: t(
        "When the major axis lies along the $x$-axis, the standard equation of an ellipse centered at $(0, 0)$ is:\n\n$$\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1 \\quad (a > b > 0)$$\n\nThe vertices are $(\\pm a, 0)$ and the co-vertices are $(0, \\pm b)$.\n\nThe vertex $(a, 0)$ must satisfy the equation, and with $y = 0$ that needs $x^{2}$ divided by $a^{2}$. With vertices $(\\pm 6, 0)$ and co-vertices $(0, \\pm 2)$, the equation is $\\frac{x^{2}}{36} + \\frac{y^{2}}{4} = 1$. Check: $(6, 0)$ gives $\\frac{36}{36} + 0 = 1$.\n\n> **Watch out.** The denominators are the squares $a^{2}$ and $b^{2}$, not $a$ and $b$. And the sign between the terms is plus: a minus sign gives a hyperbola.",
        "当长轴位于 $x$ 轴上时，中心在 $(0, 0)$ 的椭圆标准方程为：\n\n$$\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1 \\quad (a > b > 0)$$\n\n其长轴顶点为 $(\\pm a, 0)$，短轴端点为 $(0, \\pm b)$。\n\n顶点 $(a, 0)$ 必须满足方程，而 $y = 0$ 时这要求 $x^{2}$ 除以 $a^{2}$。顶点为 $(\\pm 6, 0)$、短轴端点为 $(0, \\pm 2)$ 时，方程是 $\\frac{x^{2}}{36} + \\frac{y^{2}}{4} = 1$。检验：$(6, 0)$ 给出 $\\frac{36}{36} + 0 = 1$。\n\n> **注意。** 分母是平方 $a^{2}$ 和 $b^{2}$，不是 $a$ 和 $b$。两项之间是加号：减号得到的是双曲线。",
      ),
      generate(rng) {
        const a = rng.int(4, 14);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const correct = `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`;
        return equationProblem({
          prompt: t(
            `An ellipse centered at $(0, 0)$ has vertices at $(\\pm ${a}, 0)$ and co-vertices at $(0, \\pm ${b})$. What is the standard equation of this ellipse?`,
            `一个中心在 $(0, 0)$ 的椭圆顶点为 $(\\pm ${a}, 0)$，短轴端点为 $(0, \\pm ${b})$。该椭圆的标准方程是什么？`,
          ),
          answer: correct,
          wrong: [
            `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`,
            `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1`,
            `\\frac{x^{2}}{${a}} + \\frac{y^{2}}{${b}} = 1`,
            `\\frac{x^{2}}{${2 * a}} + \\frac{y^{2}}{${2 * b}} = 1`,
          ],
          solution: walked(
            [
              [
                ["Read a and b", "读出 a 和 b"],
                t(
                  `The vertices are on the $x$-axis, so the major axis is horizontal, with $a = ${a}$ and $b = ${b}$.`,
                  `顶点在 $x$ 轴上，所以长轴水平，$a = ${a}$，$b = ${b}$。`,
                ),
              ],
              [
                ["Square and place them", "平方后放好位置"],
                t(
                  `Put $a^{2} = ${a2}$ under $x^{2}$ and $b^{2} = ${b2}$ under $y^{2}$:`,
                  `把 $a^{2} = ${a2}$ 放在 $x^{2}$ 下，$b^{2} = ${b2}$ 放在 $y^{2}$ 下：`,
                ),
                [correct],
              ],
            ],
            t(
              `The vertex $(${a}, 0)$ gives $\\frac{${a2}}{${a2}} + 0 = 1$, and the co-vertex $(0, ${b})$ gives $0 + \\frac{${b2}}{${b2}} = 1$.`,
              `顶点 $(${a}, 0)$ 给出 $\\frac{${a2}}{${a2}} + 0 = 1$，短轴端点 $(0, ${b})$ 给出 $0 + \\frac{${b2}}{${b2}} = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "vertical-ellipse-centered-at-origin",
      title: t("Vertical ellipse centered at the origin", "焦点在 y 轴上的椭圆标准方程"),
      explanation: t(
        "When the major axis lies along the $y$-axis, the standard equation of an ellipse centered at $(0, 0)$ is:\n\n$$\\frac{x^{2}}{b^{2}} + \\frac{y^{2}}{a^{2}} = 1 \\quad (a > b > 0)$$\n\nThe larger denominator is under $y^{2}$. The vertices are $(0, \\pm a)$ and the co-vertices are $(\\pm b, 0)$.\n\nNow the vertex $(0, a)$ must satisfy the equation, and with $x = 0$ that needs $y^{2}$ divided by $a^{2}$. With vertices $(0, \\pm 5)$ and co-vertices $(\\pm 2, 0)$, the equation is $\\frac{x^{2}}{4} + \\frac{y^{2}}{25} = 1$. Check: $(0, 5)$ gives $0 + \\frac{25}{25} = 1$.\n\n> **Watch out.** Here the larger denominator goes under $y^{2}$. Putting $a^{2}$ under $x^{2}$ gives a horizontal ellipse, whose vertices are on the $x$-axis.",
        "当长轴位于 $y$ 轴上时，中心在 $(0, 0)$ 的椭圆标准方程为：\n\n$$\\frac{x^{2}}{b^{2}} + \\frac{y^{2}}{a^{2}} = 1 \\quad (a > b > 0)$$\n\n较大的分母在 $y^{2}$ 下方。其顶点为 $(0, \\pm a)$，短轴端点为 $(\\pm b, 0)$。\n\n这时顶点 $(0, a)$ 必须满足方程，而 $x = 0$ 时这要求 $y^{2}$ 除以 $a^{2}$。顶点为 $(0, \\pm 5)$、短轴端点为 $(\\pm 2, 0)$ 时，方程是 $\\frac{x^{2}}{4} + \\frac{y^{2}}{25} = 1$。检验：$(0, 5)$ 给出 $0 + \\frac{25}{25} = 1$。\n\n> **注意。** 这里较大的分母在 $y^{2}$ 下。把 $a^{2}$ 放在 $x^{2}$ 下得到的是水平的椭圆，它的顶点在 $x$ 轴上。",
      ),
      generate(rng) {
        const a = rng.int(4, 14);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const correct = `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        return equationProblem({
          prompt: t(
            `An ellipse centered at $(0, 0)$ has vertices at $(0, \\pm ${a})$ and co-vertices at $(\\pm ${b}, 0)$. What is the standard equation of this ellipse?`,
            `一个中心在 $(0, 0)$ 的椭圆顶点为 $(0, \\pm ${a})$，短轴端点为 $(\\pm ${b}, 0)$。该椭圆的标准方程是什么？`,
          ),
          answer: correct,
          wrong: [
            `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`,
            `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`,
            `\\frac{x^{2}}{${b}} + \\frac{y^{2}}{${a}} = 1`,
            `\\frac{x^{2}}{${b2}} - \\frac{y^{2}}{${a2}} = 1`,
          ],
          solution: walked(
            [
              [
                ["Read a and b", "读出 a 和 b"],
                t(
                  `The vertices are on the $y$-axis, so the major axis is vertical, with $a = ${a}$ and $b = ${b}$.`,
                  `顶点在 $y$ 轴上，所以长轴竖直，$a = ${a}$，$b = ${b}$。`,
                ),
              ],
              [
                ["Square and place them", "平方后放好位置"],
                t(
                  `Put $a^{2} = ${a2}$ under $y^{2}$ and $b^{2} = ${b2}$ under $x^{2}$:`,
                  `把 $a^{2} = ${a2}$ 放在 $y^{2}$ 下，$b^{2} = ${b2}$ 放在 $x^{2}$ 下：`,
                ),
                [correct],
              ],
            ],
            t(
              `The vertex $(0, ${a})$ gives $0 + \\frac{${a2}}{${a2}} = 1$, and the co-vertex $(${b}, 0)$ gives $\\frac{${b2}}{${b2}} + 0 = 1$.`,
              `顶点 $(0, ${a})$ 给出 $0 + \\frac{${a2}}{${a2}} = 1$，短轴端点 $(${b}, 0)$ 给出 $\\frac{${b2}}{${b2}} + 0 = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "identifying-semi-axes-and-orientation",
      title: t("Identifying semi-axes and orientation", "由方程识别半轴长与长轴方向"),
      explanation: t(
        "In $\\frac{x^{2}}{M} + \\frac{y^{2}}{N} = 1$, the larger denominator is $a^{2}$ and the smaller denominator is $b^{2}$.\n\n- If $M > N$, the major axis is horizontal with $a = \\sqrt{M}$ and $b = \\sqrt{N}$.\n- If $N > M$, the major axis is vertical with $a = \\sqrt{N}$ and $b = \\sqrt{M}$.\n\nSetting $y = 0$ leaves $x^{2} = M$, so the curve reaches $\\sqrt{M}$ along the $x$-axis; setting $x = 0$ shows it reaches $\\sqrt{N}$ along the $y$-axis. The longer reach is the major axis. In $\\frac{x^{2}}{16} + \\frac{y^{2}}{49} = 1$, $49 > 16$, so the major axis is vertical with $a = 7$ and $b = 4$. Check: $(0, 7)$ gives $0 + \\frac{49}{49} = 1$.\n\n> **Watch out.** $a$ and $b$ are the square roots of the denominators, not the denominators. The direction comes from which variable has the larger denominator, not from which term is written first.",
        "在方程 $\\frac{x^{2}}{M} + \\frac{y^{2}}{N} = 1$ 中，较大的分母是 $a^{2}$，较小的分母是 $b^{2}$。\n\n- 若 $M > N$，长轴为水平方向，半轴长为 $a = \\sqrt{M}, b = \\sqrt{N}$。\n- 若 $N > M$，长轴为竖直方向，半轴长为 $a = \\sqrt{N}, b = \\sqrt{M}$。\n\n令 $y = 0$ 得 $x^{2} = M$，所以曲线沿 $x$ 轴伸到 $\\sqrt{M}$；令 $x = 0$ 可知它沿 $y$ 轴伸到 $\\sqrt{N}$。伸得较远的方向就是长轴。在 $\\frac{x^{2}}{16} + \\frac{y^{2}}{49} = 1$ 中 $49 > 16$，所以长轴竖直，$a = 7$，$b = 4$。检验：$(0, 7)$ 给出 $0 + \\frac{49}{49} = 1$。\n\n> **注意。** $a$ 和 $b$ 是分母的平方根，不是分母本身。方向看哪个变量的分母较大，而不是看哪一项写在前面。",
      ),
      generate(rng) {
        const a = rng.int(5, 15);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const prompt = t(
          `For the ellipse $${eqStr}$, determine the orientation of its major axis and the values of $a$ and $b$.`,
          `对于椭圆 $${eqStr}$，确定其长轴方向以及半轴长 $a$ 和 $b$ 的值。`,
        );
        const correct = horizontal
          ? t(`Horizontal; $a = ${a}, b = ${b}$`, `水平方向；$a = ${a}, b = ${b}$`)
          : t(`Vertical; $a = ${a}, b = ${b}$`, `竖直方向；$a = ${a}, b = ${b}$`);
        const distractors = [
          horizontal
            ? t(`Vertical; $a = ${a}, b = ${b}$`, `竖直方向；$a = ${a}, b = ${b}$`)
            : t(`Horizontal; $a = ${a}, b = ${b}$`, `水平方向；$a = ${a}, b = ${b}$`),
          horizontal
            ? t(`Horizontal; $a = ${a2}, b = ${b2}$`, `水平方向；$a = ${a2}, b = ${b2}$`)
            : t(`Vertical; $a = ${a2}, b = ${b2}$`, `竖直方向；$a = ${a2}, b = ${b2}$`),
          horizontal
            ? t(`Vertical; $a = ${b}, b = ${a}$`, `竖直方向；$a = ${b}, b = ${a}$`)
            : t(`Horizontal; $a = ${b}, b = ${a}$`, `水平方向；$a = ${b}, b = ${a}$`),
        ];
        const solution = walked(
          [
            [
              ["Compare the denominators", "比较分母"],
              t(
                `The larger denominator, $${a2}$, is under $${horizontal ? "x^{2}" : "y^{2}"}$, so the major axis is ${horizontal ? "horizontal" : "vertical"}.`,
                `较大的分母 $${a2}$ 在 $${horizontal ? "x^{2}" : "y^{2}"}$ 下，所以长轴是${horizontal ? "水平方向" : "竖直方向"}。`,
              ),
            ],
            [
              ["Take square roots", "开平方"],
              t(`The semi-axes are the square roots of the denominators:`, `半轴是分母的平方根：`),
              [`a = \\sqrt{${a2}} = ${a}, \\quad b = \\sqrt{${b2}} = ${b}`],
            ],
          ],
          t(
            `$${a}^{2} = ${a2}$ and $${b}^{2} = ${b2}$, and $a = ${a}$ is the larger, as the semi-major axis must be.`,
            `$${a}^{2} = ${a2}$，$${b}^{2} = ${b2}$，且 $a = ${a}$ 较大，正符合半长轴的要求。`,
          ),
        );
        return makeChoiceTexts(rng, prompt, correct, distractors, solution, [
          [
            distractors[0]!.en,
            `The larger denominator, $${a2}$, is under $${horizontal ? "x^{2}" : "y^{2}"}$, so the major axis is ${horizontal ? "horizontal" : "vertical"}.`,
            `较大的分母 $${a2}$ 在 $${horizontal ? "x^{2}" : "y^{2}"}$ 下，所以长轴是${horizontal ? "水平方向" : "竖直方向"}。`,
          ],
          [
            distractors[1]!.en,
            `These are the denominators themselves: $a$ and $b$ are their square roots, $${a}$ and $${b}$.`,
            `这是分母本身：$a$ 和 $b$ 是它们的平方根 $${a}$ 和 $${b}$。`,
          ],
          [
            distractors[2]!.en,
            `This swaps $a$ and $b$: $a$ is always the larger semi-axis, and it lies along the axis with the larger denominator.`,
            `这把 $a$ 和 $b$ 对调了：$a$ 总是较大的半轴，它在分母较大的那条轴上。`,
          ],
        ]);
      },
    },
  ],
};

export const equationsOfEllipsesCenteredAtAGeneralPoint: TopicDef = {
  id: "equations-of-ellipses-centered-at-a-general-point",
  title: t("Equations of Ellipses Centered at a General Point", "中心在任意点 (h, k) 的椭圆标准方程"),
  summary: t(
    "Write and analyze equations of translated ellipses with center $(h, k)$, finding their centers and vertices.",
    "写出并分析中心在 $(h, k)$ 的平移椭圆方程，求解其中心坐标与顶点坐标。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `Slide the ellipse $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$ right by $2$ and down by $1$. A point $(x, y)$ is on the moved ellipse when $(x - 2, y + 1)$ is on the old one, so the equation becomes $\\frac{(x - 2)^{2}}{25} + \\frac{(y + 1)^{2}}{9} = 1$, with center $(2, -1)$.

Check: the right vertex moves from $(5, 0)$ to $(7, -1)$, and $\\frac{(7 - 2)^{2}}{25} + \\frac{(-1 + 1)^{2}}{9} = 1 + 0 = 1$.

In this lesson we write the equation of an ellipse whose center is $(h, k)$, and read its center, vertices and foci from that equation.`,
    `把椭圆 $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$ 向右平移 $2$、向下平移 $1$。当 $(x - 2, y + 1)$ 在原椭圆上时，点 $(x, y)$ 就在新椭圆上，所以方程变成 $\\frac{(x - 2)^{2}}{25} + \\frac{(y + 1)^{2}}{9} = 1$，中心是 $(2, -1)$。

检验：右顶点从 $(5, 0)$ 移到 $(7, -1)$，而 $\\frac{(7 - 2)^{2}}{25} + \\frac{(-1 + 1)^{2}}{9} = 1 + 0 = 1$。

这节课我们写出中心为 $(h, k)$ 的椭圆方程，并从方程读出它的中心、顶点和焦点。`,
  ),
  knowledgePoints: [
    {
      id: "standard-form-with-center-h-k",
      figure: precalculusDrawings3["equations-of-ellipses-centered-at-a-general-point#standard-form-with-center-h-k"],
      title: t("Standard equation with center (h, k)", "中心在 (h, k) 的标准方程"),
      explanation: t(
        "When an ellipse is translated so that its center is $(h, k)$:\n\n- Horizontal major axis: $\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$\n- Vertical major axis: $\\frac{(x-h)^{2}}{b^{2}} + \\frac{(y-k)^{2}}{a^{2}} = 1$\n\nMoving the center to $(h, k)$ replaces $x$ with $x - h$ and $y$ with $y - k$, so $(h, k)$ plays the part the origin played. For center $(-3, 4)$, vertical major axis with $a = 5$ and $b = 2$: $\\frac{(x + 3)^{2}}{4} + \\frac{(y - 4)^{2}}{25} = 1$. Check: the top vertex $(-3, 9)$ gives $0 + \\frac{25}{25} = 1$.\n\n> **Watch out.** The signs flip inside the brackets: the center $(-3, 4)$ gives $x + 3$ and $y - 4$. Writing $x - 3$ would put the center at $x = 3$.",
        "当椭圆平移至中心为 $(h, k)$ 时：\n\n- 长轴水平：$\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$\n- 长轴竖直：$\\frac{(x-h)^{2}}{b^{2}} + \\frac{(y-k)^{2}}{a^{2}} = 1$\n\n把中心移到 $(h, k)$，就是把 $x$ 换成 $x - h$、$y$ 换成 $y - k$，于是 $(h, k)$ 起到原点的作用。中心 $(-3, 4)$、长轴竖直、$a = 5$、$b = 2$ 时：$\\frac{(x + 3)^{2}}{4} + \\frac{(y - 4)^{2}}{25} = 1$。检验：上顶点 $(-3, 9)$ 给出 $0 + \\frac{25}{25} = 1$。\n\n> **注意。** 括号里的符号相反：中心 $(-3, 4)$ 给出 $x + 3$ 和 $y - 4$。写成 $x - 3$ 会把中心放到 $x = 3$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(4, 12);
        const b = rng.int(2, a - 1);
        const horizontal = rng.bool();
        const a2 = a * a;
        const b2 = b * b;
        const correct = ellipseEq(h, k, a2, b2, horizontal);
        return equationProblem({
          prompt: t(
            `Write the standard equation of the ellipse with center $(${h}, ${k})$, semi-major axis $a = ${a}$ (${horizontal ? "horizontal" : "vertical"}), and semi-minor axis $b = ${b}$.`,
            `写出中心在 $(${h}, ${k})$，半长轴长 $a = ${a}$（${horizontal ? "水平方向" : "竖直方向"}），半短轴长 $b = ${b}$ 的椭圆标准方程。`,
          ),
          answer: correct,
          wrong: [
            ellipseEq(-h, -k, a2, b2, horizontal),
            ellipseEq(h, k, b2, a2, horizontal),
            ellipseEq(k, h, a2, b2, horizontal),
            ellipseEq(h, k, a, b, horizontal),
          ],
          solution: walked(
            [
              [
                ["Write the numerators", "写出分子"],
                t(
                  `The center $(${h}, ${k})$ gives the numerators $${sqTerm("x", h)}$ and $${sqTerm("y", k)}$.`,
                  `中心 $(${h}, ${k})$ 给出分子 $${sqTerm("x", h)}$ 和 $${sqTerm("y", k)}$。`,
                ),
              ],
              [
                ["Place the squares", "放好平方"],
                t(
                  `The major axis is ${horizontal ? "horizontal" : "vertical"}, so $a^{2} = ${a2}$ goes under the ${horizontal ? "$x$" : "$y$"} term and $b^{2} = ${b2}$ under the other:`,
                  `长轴${horizontal ? "水平" : "竖直"}，所以 $a^{2} = ${a2}$ 放在 ${horizontal ? "$x$" : "$y$"} 项下，$b^{2} = ${b2}$ 放在另一项下：`,
                ),
                [correct],
              ],
            ],
            t(
              `The vertex $${horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`}$, $${a}$ from the center, gives $\\frac{${a}^{2}}{${a2}} + 0 = 1$.`,
              `距中心 $${a}$ 的顶点 $${horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`}$ 给出 $\\frac{${a}^{2}}{${a2}} + 0 = 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "identifying-center-and-vertices",
      title: t("Identifying center and vertices from the equation", "由方程识别中心与顶点"),
      explanation: t(
        "For $\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$ ($a > b$), the center is $(h, k)$ and the major axis vertices are $(h \\pm a, k)$.\n\nIf the larger denominator is under $y$, the vertices are $(h, k \\pm a)$.\n\nFrom the center the ellipse reaches $a$ along its major axis, so the vertices are $a$ from $(h, k)$ in that direction. In $\\frac{(x - 1)^{2}}{9} + \\frac{(y + 2)^{2}}{25} = 1$, the center is $(1, -2)$ and $25$ is under $y$, so $a = 5$ vertically: the vertices are $(1, -7)$ and $(1, 3)$. Check: $(1, 3)$ gives $0 + \\frac{25}{25} = 1$.\n\n> **Watch out.** Move from the center, not from the origin, and move $a = \\sqrt{\\text{larger denominator}}$, not $b$: moving $b$ gives the co-vertices.",
        "对于 $\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$（$a > b$），中心为 $(h, k)$，长轴顶点为 $(h \\pm a, k)$。\n\n若较大的分母在 $y$ 下方，则顶点为 $(h, k \\pm a)$。\n\n椭圆从中心沿长轴伸出 $a$，所以顶点在这个方向上距 $(h, k)$ 为 $a$。在 $\\frac{(x - 1)^{2}}{9} + \\frac{(y + 2)^{2}}{25} = 1$ 中，中心是 $(1, -2)$，$25$ 在 $y$ 下，所以竖直方向 $a = 5$：顶点是 $(1, -7)$ 和 $(1, 3)$。检验：$(1, 3)$ 给出 $0 + \\frac{25}{25} = 1$。\n\n> **注意。** 从中心出发，不是从原点出发；移动的是 $a = \\sqrt{\\text{较大的分母}}$，不是 $b$：移动 $b$ 得到的是短轴端点。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(4, 10);
        const b = rng.int(2, a - 1);
        const horizontal = rng.bool();
        const a2 = a * a;
        const b2 = b * b;
        const eqStr = ellipseEq(h, k, a2, b2, horizontal);
        const prompt = t(
          `Find the coordinates of the vertices of the ellipse given by the equation $${eqStr}$.`,
          `求椭圆方程 $${eqStr}$ 的长轴两顶点坐标。`,
        );
        const v1 = horizontal ? `(${h - a}, ${k})` : `(${h}, ${k - a})`;
        const v2 = horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`;
        const correct = `${v1} \\text{ and } ${v2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})` : `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})`,
          horizontal ? `(${h - b}, ${k}) \\text{ and } (${h + b}, ${k})` : `(${h}, ${k - b}) \\text{ and } (${h}, ${k + b})`,
          horizontal ? `(${-h - a}, ${-k}) \\text{ and } (${-h + a}, ${-k})` : `(${-h}, ${-k - a}) \\text{ and } (${-h}, ${-k + a})`,
          `(${h}, ${k})`,
        ];
        const solution = walked(
          [
            [
              ["Read the center", "读出中心"],
              t(`The numerators give the center $(h, k) = (${h}, ${k})$.`, `分子给出中心 $(h, k) = (${h}, ${k})$。`),
            ],
            [
              ["Find a", "求 a"],
              t(
                `The larger denominator, $${a2}$, is under $${horizontal ? "x" : "y"}$, so the major axis is ${horizontal ? "horizontal" : "vertical"} and $a = \\sqrt{${a2}} = ${a}$.`,
                `较大的分母 $${a2}$ 在 $${horizontal ? "x" : "y"}$ 下，所以长轴${horizontal ? "水平" : "竖直"}，$a = \\sqrt{${a2}} = ${a}$。`,
              ),
            ],
            [
              ["Move a from the center", "从中心移动 a"],
              t(`Move $${a}$ both ways along the major axis:`, `沿长轴向两边各移 $${a}$：`),
              [correct],
            ],
          ],
          t(
            `The vertex $${v2}$ gives $\\frac{${a}^{2}}{${a2}} + 0 = 1$, and the midpoint of the two vertices is the center $(${h}, ${k})$.`,
            `顶点 $${v2}$ 给出 $\\frac{${a}^{2}}{${a2}} + 0 = 1$，两顶点的中点正是中心 $(${h}, ${k})$。`,
          ),
        );
        return makeChoice(rng, prompt, correct, distractors, solution, [
          why(
            distractors[0]!,
            `These move along the ${horizontal ? "vertical" : "horizontal"} line, but the larger denominator is under $${horizontal ? "x" : "y"}$, so the major axis is ${horizontal ? "horizontal" : "vertical"}.`,
            `这是沿${horizontal ? "竖直" : "水平"}方向移动，但较大的分母在 $${horizontal ? "x" : "y"}$ 下，所以长轴是${horizontal ? "水平" : "竖直"}的。`,
          ),
          why(
            distractors[1]!,
            `These are $b = ${b}$ from the center: the vertices are $a = ${a}$ from it.`,
            `这些点距中心 $b = ${b}$：顶点距中心 $a = ${a}$。`,
          ),
          why(
            distractors[2]!,
            `These start from $(${-h}, ${-k})$: the signs in the brackets were not flipped, and the center is $(${h}, ${k})$.`,
            `这是从 $(${-h}, ${-k})$ 出发：括号里的符号没有反过来，中心是 $(${h}, ${k})$。`,
          ),
          why(distractors[3]!, "That is the center, not a vertex.", "这是中心，不是顶点。"),
        ]);
      },
    },
  ],
};

export const findingTheCenterAndAxesOfEllipsesByCompletingTheSquare: TopicDef = {
  id: "finding-the-center-and-axes-of-ellipses-by-completing-the-square",
  title: t("Finding the Center and Axes of Ellipses by Completing the Square", "配方法求椭圆的中心与半轴长"),
  summary: t(
    "Convert the general quadratic form $Ax^2 + By^2 + Cx + Dy + E = 0$ of an ellipse into standard form by completing the square.",
    "用配方法将椭圆的一般方程 $Ax^2 + By^2 + Cx + Dy + E = 0$ 化为标准方程，确定中心和半轴长。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-a-general-point", "determining-circle-properties-by-completing-the-square"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-a-general-point", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `Take $x^{2} + 4y^{2} - 2x + 16y + 1 = 0$. Group the $x$ terms and the $y$ terms and take the $4$ out of the $y$ group: $(x^{2} - 2x) + 4(y^{2} + 4y) = -1$. Completing the squares adds $1$ and $4 \\cdot 4 = 16$ to the left, so add them to the right too: $(x - 1)^{2} + 4(y + 2)^{2} = 16$. Dividing by $16$ gives $\\frac{(x - 1)^{2}}{16} + \\frac{(y + 2)^{2}}{4} = 1$: the center is $(1, -2)$, $a = 4$ and $b = 2$.

Check: the vertex $(5, -2)$ in the original equation gives $25 + 16 - 10 - 32 + 1 = 0$.

In this lesson we turn the general form of an ellipse into standard form by completing the square, and read its center and semi-axes.`,
    `看 $x^{2} + 4y^{2} - 2x + 16y + 1 = 0$。把 $x$ 项和 $y$ 项分组，并从 $y$ 组提出 $4$：$(x^{2} - 2x) + 4(y^{2} + 4y) = -1$。配方在左边加了 $1$ 和 $4 \\cdot 4 = 16$，所以右边也要加上：$(x - 1)^{2} + 4(y + 2)^{2} = 16$。两边除以 $16$ 得 $\\frac{(x - 1)^{2}}{16} + \\frac{(y + 2)^{2}}{4} = 1$：中心是 $(1, -2)$，$a = 4$，$b = 2$。

检验：把顶点 $(5, -2)$ 代入原方程得 $25 + 16 - 10 - 32 + 1 = 0$。

这节课我们用配方法把椭圆的一般方程化为标准方程，并读出它的中心和半轴。`,
  ),
  knowledgePoints: [
    {
      id: "completing-the-square-to-standard-form",
      title: t("Converting general form to standard form", "一般方程化为标准方程"),
      explanation: t(
        "To convert $Ax^{2} + By^{2} + Cx + Dy + E = 0$ to standard form:\n\n1. Group $x$-terms and $y$-terms: $A(x^{2} + \\dots) + B(y^{2} + \\dots) = -E$\n2. Complete the square inside each set of parentheses.\n3. Add the corresponding terms to both sides.\n4. Divide by the constant on the right side to get $1$.\n\nThe coefficient must come out of each group first, because the square is completed inside the bracket and what is added there is multiplied by that coefficient. For $4x^{2} + y^{2} + 16x - 6y + 9 = 0$: $4(x^{2} + 4x) + (y^{2} - 6y) = -9$, then $4(x + 2)^{2} + (y - 3)^{2} = -9 + 16 + 9 = 16$, and dividing by $16$ gives $\\frac{(x + 2)^{2}}{4} + \\frac{(y - 3)^{2}}{16} = 1$. Check: expanding $4(x + 2)^{2}$ gives back $4x^{2} + 16x + 16$.\n\n> **Watch out.** Completing $4(x^{2} + 4x)$ adds $4 \\cdot 4 = 16$ to the left, not $4$, so $16$ goes on the right. And divide by the right side at the end so that it is $1$.",
        "将一般方程 $Ax^{2} + By^{2} + Cx + Dy + E = 0$ 化为标准方程：\n\n1. 分组整理 $x$ 和 $y$ 项：$A(x^{2} + \\dots) + B(y^{2} + \\dots) = -E$\n2. 对括号内分别配方。\n3. 在等式两边加上相应的常数。\n4. 两边同除以右边的常数使右边为 $1$。\n\n每组都要先提出系数，因为配方是在括号里做的，括号里加的数要乘以这个系数。对 $4x^{2} + y^{2} + 16x - 6y + 9 = 0$：$4(x^{2} + 4x) + (y^{2} - 6y) = -9$，于是 $4(x + 2)^{2} + (y - 3)^{2} = -9 + 16 + 9 = 16$，除以 $16$ 得 $\\frac{(x + 2)^{2}}{4} + \\frac{(y - 3)^{2}}{16} = 1$。检验：展开 $4(x + 2)^{2}$ 又得到 $4x^{2} + 16x + 16$。\n\n> **注意。** 给 $4(x^{2} + 4x)$ 配方，左边加的是 $4 \\cdot 4 = 16$，不是 $4$，所以右边要加 $16$。最后要除以右边的数，使右边为 $1$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-4, 4);
        const pairs = [
          [1, 4, 16],
          [4, 1, 16],
          [1, 9, 36],
          [9, 1, 36],
          [4, 9, 36],
          [9, 4, 36],
          [1, 4, 36],
          [4, 1, 36],
          [2, 3, 24],
          [3, 2, 24],
          [1, 16, 64],
          [16, 1, 64],
        ] as const;
        const [A, B, K] = rng.pick(pairs);
        const C = -2 * A * h;
        const D = -2 * B * k;
        const E = A * h * h + B * k * k - K;
        const a2 = K / A;
        const b2 = K / B;

        let generalStr = `${A === 1 ? "" : A}x^{2} + ${B === 1 ? "" : B}y^{2}`;
        generalStr += C < 0 ? ` - ${-C}x` : ` + ${C}x`;
        generalStr += D < 0 ? ` - ${-D}y` : ` + ${D}y`;
        generalStr += E < 0 ? ` - ${-E}` : E > 0 ? ` + ${E}` : "";
        generalStr += " = 0";

        const correct = `\\frac{${sqTerm("x", h)}}{${a2}} + \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
        return equationProblem({
          prompt: t(`Convert the ellipse equation $${generalStr}$ into standard form.`, `将椭圆方程 $${generalStr}$ 化为标准方程。`),
          answer: correct,
          wrong: [
            `\\frac{${sqTerm("x", -h)}}{${a2}} + \\frac{${sqTerm("y", -k)}}{${b2}} = 1`,
            `\\frac{${sqTerm("x", h)}}{${b2}} + \\frac{${sqTerm("y", k)}}{${a2}} = 1`,
            `\\frac{${sqTerm("x", h)}}{${a2}} - \\frac{${sqTerm("y", k)}}{${b2}} = 1`,
            `\\frac{${sqTerm("x", h)}}{${A}} + \\frac{${sqTerm("y", k)}}{${B}} = 1`,
          ],
          solution: (() => {
            const [grouped, completed] = squaresCompleted(A, B, h, k, K);
            return walked(
              [
                [
                  ["Group and factor", "分组并提系数"],
                  t(
                    `Collect the $x$ terms and the $y$ terms and take out their coefficients:`,
                    `把 $x$ 项和 $y$ 项分别归在一起，并提出系数：`,
                  ),
                  [grouped],
                ],
                [
                  ["Complete the squares", "配方"],
                  t(
                    `Inside the brackets add $${h * h}$ and $${k * k}$, which adds $${A * h * h}$ and $${B * k * k}$ to the left, so add them on the right:`,
                    `在括号里加上 $${h * h}$ 和 $${k * k}$，左边就加了 $${A * h * h}$ 和 $${B * k * k}$，所以右边也加上：`,
                  ),
                  [completed],
                ],
                [
                  ["Divide by the right side", "除以右边"],
                  t(`Divide by $${K}$ so that the right side is $1$:`, `除以 $${K}$，使右边为 $1$：`),
                  [correct],
                ],
              ],
              t(
                `Multiplying back by $${K}$ and expanding gives the constant $${A * h * h} + ${B * k * k} - ${K} = ${E}$, the constant of the given equation, and the terms $${C}x$ and $${D}y$.`,
                `乘回 $${K}$ 并展开，常数项是 $${A * h * h} + ${B * k * k} - ${K} = ${E}$，正是原方程的常数项，一次项是 $${C}x$ 和 $${D}y$。`,
              ),
            );
          })(),
        });
      },
    },
    {
      id: "finding-center-and-semi-axes-from-general-form",
      title: t("Finding center and semi-axes from general form", "由一般方程求中心与半轴长"),
      explanation: t(
        "After completing the square, write the equation in standard form $\\frac{(x-h)^{2}}{M} + \\frac{(y-k)^{2}}{N} = 1$. The center is $(h, k)$, the semi-major axis is $\\sqrt{\\max(M, N)}$, and the semi-minor axis is $\\sqrt{\\min(M, N)}$.\n\nBoth squares are zero at $x = h$, $y = k$, and that point is the center. For $x^{2} + 4y^{2} + 6x - 8y - 3 = 0$: $(x^{2} + 6x) + 4(y^{2} - 2y) = 3$, so $(x + 3)^{2} + 4(y - 1)^{2} = 3 + 9 + 4 = 16$, and the center is $(-3, 1)$. Check: $-2 \\cdot 1 \\cdot (-3) = 6$, the coefficient of $x$.\n\n> **Watch out.** The center has the opposite signs of the numbers in the brackets: $(x + 3)$ gives $h = -3$. A shortcut is $h = -\\frac{C}{2A}$ and $k = -\\frac{D}{2B}$.",
        "配方化为标准方程 $\\frac{(x-h)^{2}}{M} + \\frac{(y-k)^{2}}{N} = 1$ 后，中心为 $(h, k)$，半长轴长为 $\\sqrt{\\max(M, N)}$，半短轴长为 $\\sqrt{\\min(M, N)}$。\n\n两个平方在 $x = h$、$y = k$ 时都为零，这一点就是中心。对 $x^{2} + 4y^{2} + 6x - 8y - 3 = 0$：$(x^{2} + 6x) + 4(y^{2} - 2y) = 3$，所以 $(x + 3)^{2} + 4(y - 1)^{2} = 3 + 9 + 4 = 16$，中心是 $(-3, 1)$。检验：$-2 \\cdot 1 \\cdot (-3) = 6$，正是 $x$ 的系数。\n\n> **注意。** 中心坐标与括号里的数符号相反：$(x + 3)$ 给出 $h = -3$。也可以直接用 $h = -\\frac{C}{2A}$，$k = -\\frac{D}{2B}$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-4, 4);
        const pairs = [
          [1, 4, 16],
          [4, 1, 16],
          [1, 9, 36],
          [9, 1, 36],
          [4, 9, 36],
          [9, 4, 36],
          [1, 4, 36],
          [4, 1, 36],
          [1, 16, 64],
          [16, 1, 64],
        ] as const;
        const [A, B, K] = rng.pick(pairs);
        const C = -2 * A * h;
        const D = -2 * B * k;
        const E = A * h * h + B * k * k - K;
        const M = K / A;
        const N = K / B;

        let generalStr = `${A === 1 ? "" : A}x^{2} + ${B === 1 ? "" : B}y^{2}`;
        generalStr += C < 0 ? ` - ${-C}x` : ` + ${C}x`;
        generalStr += D < 0 ? ` - ${-D}y` : ` + ${D}y`;
        generalStr += E < 0 ? ` - ${-E}` : E > 0 ? ` + ${E}` : "";
        generalStr += " = 0";

        return pointProblem({
          prompt: t(
            `Find the coordinates of the center $(h, k)$ of the ellipse $${generalStr}$.`,
            `求椭圆 $${generalStr}$ 的中心坐标 $(h, k)$。`,
          ),
          answer: [h, k],
          wrong: [
            [-h, -k],
            [k, h],
            [-h, k],
            [h, -k],
          ],
          solution: (() => {
            const [grouped, completed] = squaresCompleted(A, B, h, k, K);
            return walked(
              [
                [
                  ["Group and factor", "分组并提系数"],
                  t(
                    `Collect the $x$ terms and the $y$ terms and take out their coefficients:`,
                    `把 $x$ 项和 $y$ 项分别归在一起，并提出系数：`,
                  ),
                  [grouped],
                ],
                [
                  ["Complete the squares", "配方"],
                  t(`Complete both squares and divide by $${K}$:`, `两组都配方，再除以 $${K}$：`),
                  [completed, `\\frac{${sqTerm("x", h)}}{${M}} + \\frac{${sqTerm("y", k)}}{${N}} = 1`],
                ],
                [
                  ["Read the center", "读出中心"],
                  t(
                    `Both squares are zero when $x = ${h}$ and $y = ${k}$, so the center is $(${h}, ${k})$.`,
                    `$x = ${h}$、$y = ${k}$ 时两个平方都为零，所以中心是 $(${h}, ${k})$。`,
                  ),
                ],
              ],
              t(
                `$-2 \\cdot ${A} \\cdot ${paren(h)} = ${C}$ and $-2 \\cdot ${B} \\cdot ${paren(k)} = ${D}$, the coefficients of $x$ and $y$ in the given equation.`,
                `$-2 \\cdot ${A} \\cdot ${paren(h)} = ${C}$，$-2 \\cdot ${B} \\cdot ${paren(k)} = ${D}$，正是原方程中 $x$ 和 $y$ 的系数。`,
              ),
            );
          })(),
        });
      },
    },
  ],
};

export const findingInterceptsOfEllipses: TopicDef = {
  id: "finding-intercepts-of-ellipses",
  title: t("Finding Intercepts of Ellipses", "求椭圆的坐标轴截距"),
  summary: t(
    "Find the x-intercepts and y-intercepts of an ellipse by substituting $y = 0$ and $x = 0$.",
    "通过令 $y = 0$ 和 $x = 0$ 求解椭圆在坐标轴上的截距。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-a-general-point"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `Every point on the $x$-axis has $y = 0$, and every point on the $y$-axis has $x = 0$. For $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$, putting $y = 0$ leaves $x^{2} = 25$, so $x = \\pm 5$ and the $x$-intercepts are $(\\pm 5, 0)$; putting $x = 0$ leaves $y^{2} = 9$, so the $y$-intercepts are $(0, \\pm 3)$.

Check: $(5, 0)$ gives $\\frac{25}{25} + 0 = 1$, and $(0, -3)$ gives $0 + \\frac{9}{9} = 1$.

In this lesson we find where an ellipse crosses each axis, also when its center is shifted, and count how many times it meets the $x$-axis.`,
    `$x$ 轴上每一点都有 $y = 0$，$y$ 轴上每一点都有 $x = 0$。对 $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$，令 $y = 0$ 得 $x^{2} = 25$，所以 $x = \\pm 5$，$x$ 轴截点是 $(\\pm 5, 0)$；令 $x = 0$ 得 $y^{2} = 9$，$y$ 轴截点是 $(0, \\pm 3)$。

检验：$(5, 0)$ 给出 $\\frac{25}{25} + 0 = 1$，$(0, -3)$ 给出 $0 + \\frac{9}{9} = 1$。

这节课我们求椭圆与两条坐标轴的交点，包括中心平移后的情形，并数出它与 $x$ 轴有几个公共点。`,
  ),
  knowledgePoints: [
    {
      id: "finding-x-intercepts-of-an-ellipse",
      title: t("Finding x-intercepts of an ellipse", "求椭圆的 x 轴截距"),
      explanation: t(
        "To find the $x$-intercepts of an ellipse, set $y = 0$ and solve for $x$.\n\nFor $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$, setting $y = 0$ yields $x^{2} = a^{2} \\implies x = \\pm a$, giving points $(\\pm a, 0)$.\n\nWhen the center is shifted, the same step works. For $\\frac{(x - 2)^{2}}{9} + \\frac{y^{2}}{4} = 1$, $y = 0$ gives $(x - 2)^{2} = 9$, so $x - 2 = \\pm 3$ and $x = -1$ or $x = 5$. Check: $(5, 0)$ gives $\\frac{9}{9} + 0 = 1$.\n\n> **Watch out.** Take both square roots, then add $h$. An $x$-intercept has the form $(x, 0)$: points $(0, y)$ are $y$-intercepts.",
        "求椭圆的 $x$ 轴截距，令 $y = 0$ 并求解 $x$。\n\n对于 $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$，令 $y = 0$ 得到 $x^{2} = a^{2} \\implies x = \\pm a$，即截距点为 $(\\pm a, 0)$。\n\n中心平移后，方法不变。对 $\\frac{(x - 2)^{2}}{9} + \\frac{y^{2}}{4} = 1$，$y = 0$ 给出 $(x - 2)^{2} = 9$，所以 $x - 2 = \\pm 3$，$x = -1$ 或 $x = 5$。检验：$(5, 0)$ 给出 $\\frac{9}{9} + 0 = 1$。\n\n> **注意。** 两个平方根都要取，再加上 $h$。$x$ 轴截点的形式是 $(x, 0)$：$(0, y)$ 形式的点是 $y$ 轴截点。",
      ),
      generate(rng) {
        const a = rng.int(3, 15);
        const b = rng.int(2, a + 4);
        const a2 = a * a;
        const b2 = b * b;
        const h = rng.pick([0, 0, rng.int(-4, 4)]);
        const eqStr =
          h === 0 ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{${sqTerm("x", h)}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`;
        const prompt = t(`Find the $x$-intercepts of the ellipse given by $${eqStr}$.`, `求椭圆 $${eqStr}$ 的 $x$ 轴截距点坐标。`);
        const x1 = h - a;
        const x2 = h + a;
        const correct = h === 0 ? `(\\pm ${a}, 0)` : `(${x1}, 0) \\text{ and } (${x2}, 0)`;
        const distractors = [
          h === 0 ? `(0, \\pm ${b})` : `(0, ${x1}) \\text{ and } (0, ${x2})`,
          h === 0 ? `(\\pm ${b}, 0)` : `(${x1 + 1}, 0) \\text{ and } (${x2 + 1}, 0)`,
          h === 0 ? `(\\pm ${a2}, 0)` : `(${h - b}, 0) \\text{ and } (${h + b}, 0)`,
          `(0, 0)`,
        ];
        const solution = walked(
          [
            [
              ["Set y = 0", "令 y = 0"],
              t(`On the $x$-axis $y = 0$, so the $y$ term drops out:`, `在 $x$ 轴上 $y = 0$，$y$ 项消失：`),
              [`\\frac{${sqTerm("x", h)}}{${a2}} = 1`],
            ],
            [
              ["Solve for x", "解出 x"],
              t(`Multiply by $${a2}$ and take both square roots:`, `乘以 $${a2}$，取两个平方根：`),
              [`${sqTerm("x", h)} = ${a2} \\implies ${linTerm("x", h)} = \\pm ${a}`, correct],
            ],
          ],
          t(
            `At $(${x2}, 0)$: $\\frac{${a}^{2}}{${a2}} + \\frac{0^{2}}{${b2}} = 1$, and $(${x1}, 0)$ works the same way, being $${a}$ on the other side of $x = ${h}$.`,
            `在 $(${x2}, 0)$：$\\frac{${a}^{2}}{${a2}} + \\frac{0^{2}}{${b2}} = 1$；$(${x1}, 0)$ 在 $x = ${h}$ 另一侧距离 $${a}$，同样成立。`,
          ),
        );
        return makeChoice(
          rng,
          prompt,
          correct,
          distractors,
          solution,
          h === 0
            ? [
                why(distractors[0]!, "These are the $y$-intercepts: they come from $x = 0$.", "这是 $y$ 轴截点：它们来自 $x = 0$。"),
                why(
                  distractors[1]!,
                  `This uses $b = ${b}$ from the $y^{2}$ denominator, but with $y = 0$ only $x^{2} = ${a2}$ is left.`,
                  `这用了 $y^{2}$ 分母给出的 $b = ${b}$，但 $y = 0$ 时只剩 $x^{2} = ${a2}$。`,
                ),
                why(
                  distractors[2]!,
                  `This skips the square root: $x^{2} = ${a2}$ gives $x = \\pm ${a}$.`,
                  `这里没有开平方：$x^{2} = ${a2}$ 给出 $x = \\pm ${a}$。`,
                ),
                why(
                  distractors[3]!,
                  "The origin is the center: it gives $0 + 0 = 0$, not $1$.",
                  "原点是中心：它给出 $0 + 0 = 0$，不是 $1$。",
                ),
              ]
            : [
                why(
                  distractors[0]!,
                  "These swap the coordinates: an $x$-intercept has $y = 0$, so it is $(x, 0)$.",
                  "这把坐标对调了：$x$ 轴截点的 $y = 0$，形式是 $(x, 0)$。",
                ),
                why(
                  distractors[1]!,
                  `These are $1$ too far right: $${linTerm("x", h)} = \\pm ${a}$ gives $x = ${x1}$ or $x = ${x2}$.`,
                  `这些点向右多移了 $1$：$${linTerm("x", h)} = \\pm ${a}$ 给出 $x = ${x1}$ 或 $x = ${x2}$。`,
                ),
                why(
                  distractors[2]!,
                  `This uses $b = ${b}$ from the $y^{2}$ denominator, but with $y = 0$ only the $x$ term is left, so $${linTerm("x", h)} = \\pm ${a}$.`,
                  `这用了 $y^{2}$ 分母给出的 $b = ${b}$，但 $y = 0$ 时只剩 $x$ 项，所以 $${linTerm("x", h)} = \\pm ${a}$。`,
                ),
                why(
                  distractors[3]!,
                  `Setting $y = 0$ gives two $x$-intercepts, $(${x1}, 0)$ and $(${x2}, 0)$.`,
                  `令 $y = 0$ 得到两个 $x$ 轴截点 $(${x1}, 0)$ 和 $(${x2}, 0)$。`,
                ),
              ],
        );
      },
    },
    {
      id: "finding-y-intercepts-of-an-ellipse",
      title: t("Finding y-intercepts of an ellipse", "求椭圆的 y 轴截距"),
      explanation: t(
        "To find the $y$-intercepts of an ellipse, set $x = 0$ and solve for $y$.\n\nFor $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$, setting $x = 0$ yields $y^{2} = b^{2} \\implies y = \\pm b$, giving points $(0, \\pm b)$.\n\nWhen the center is shifted, the same step works. For $\\frac{x^{2}}{16} + \\frac{(y + 1)^{2}}{4} = 1$, $x = 0$ gives $(y + 1)^{2} = 4$, so $y + 1 = \\pm 2$ and $y = -3$ or $y = 1$. Check: $(0, 1)$ gives $0 + \\frac{4}{4} = 1$.\n\n> **Watch out.** Take both square roots, then add $k$. A $y$-intercept has the form $(0, y)$: points $(x, 0)$ are $x$-intercepts.",
        "求椭圆的 $y$ 轴截距，令 $x = 0$ 并求解 $y$。\n\n对于 $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$，令 $x = 0$ 得到 $y^{2} = b^{2} \\implies y = \\pm b$，即截距点为 $(0, \\pm b)$。\n\n中心平移后，方法不变。对 $\\frac{x^{2}}{16} + \\frac{(y + 1)^{2}}{4} = 1$，$x = 0$ 给出 $(y + 1)^{2} = 4$，所以 $y + 1 = \\pm 2$，$y = -3$ 或 $y = 1$。检验：$(0, 1)$ 给出 $0 + \\frac{4}{4} = 1$。\n\n> **注意。** 两个平方根都要取，再加上 $k$。$y$ 轴截点的形式是 $(0, y)$：$(x, 0)$ 形式的点是 $x$ 轴截点。",
      ),
      generate(rng) {
        const a = rng.int(3, 15);
        const b = rng.int(2, a + 4);
        const a2 = a * a;
        const b2 = b * b;
        const k = rng.pick([0, 0, rng.int(-4, 4)]);
        const eqStr =
          k === 0 ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${a2}} + \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
        const prompt = t(`Find the $y$-intercepts of the ellipse given by $${eqStr}$.`, `求椭圆 $${eqStr}$ 的 $y$ 轴截距点坐标。`);
        const y1 = k - b;
        const y2 = k + b;
        const correct = k === 0 ? `(0, \\pm ${b})` : `(0, ${y1}) \\text{ and } (0, ${y2})`;
        const distractors = [
          k === 0 ? `(\\pm ${a}, 0)` : `(${y1}, 0) \\text{ and } (${y2}, 0)`,
          k === 0 ? `(0, \\pm ${a})` : `(0, ${y1 + 1}) \\text{ and } (0, ${y2 + 1})`,
          k === 0 ? `(0, \\pm ${b2})` : `(0, ${k - a}) \\text{ and } (0, ${k + a})`,
          `(0, 0)`,
        ];
        const solution = walked(
          [
            [
              ["Set x = 0", "令 x = 0"],
              t(`On the $y$-axis $x = 0$, so the $x$ term drops out:`, `在 $y$ 轴上 $x = 0$，$x$ 项消失：`),
              [`\\frac{${sqTerm("y", k)}}{${b2}} = 1`],
            ],
            [
              ["Solve for y", "解出 y"],
              t(`Multiply by $${b2}$ and take both square roots:`, `乘以 $${b2}$，取两个平方根：`),
              [`${sqTerm("y", k)} = ${b2} \\implies ${linTerm("y", k)} = \\pm ${b}`, correct],
            ],
          ],
          t(
            `At $(0, ${y2})$: $\\frac{0^{2}}{${a2}} + \\frac{${b}^{2}}{${b2}} = 1$, and $(0, ${y1})$ works the same way, being $${b}$ on the other side of $y = ${k}$.`,
            `在 $(0, ${y2})$：$\\frac{0^{2}}{${a2}} + \\frac{${b}^{2}}{${b2}} = 1$；$(0, ${y1})$ 在 $y = ${k}$ 另一侧距离 $${b}$，同样成立。`,
          ),
        );
        return makeChoice(
          rng,
          prompt,
          correct,
          distractors,
          solution,
          k === 0
            ? [
                why(distractors[0]!, "These are the $x$-intercepts: they come from $y = 0$.", "这是 $x$ 轴截点：它们来自 $y = 0$。"),
                why(
                  distractors[1]!,
                  `This uses $a = ${a}$ from the $x^{2}$ denominator, but with $x = 0$ only $y^{2} = ${b2}$ is left.`,
                  `这用了 $x^{2}$ 分母给出的 $a = ${a}$，但 $x = 0$ 时只剩 $y^{2} = ${b2}$。`,
                ),
                why(
                  distractors[2]!,
                  `This skips the square root: $y^{2} = ${b2}$ gives $y = \\pm ${b}$.`,
                  `这里没有开平方：$y^{2} = ${b2}$ 给出 $y = \\pm ${b}$。`,
                ),
                why(
                  distractors[3]!,
                  "The origin is the center: it gives $0 + 0 = 0$, not $1$.",
                  "原点是中心：它给出 $0 + 0 = 0$，不是 $1$。",
                ),
              ]
            : [
                why(
                  distractors[0]!,
                  "These swap the coordinates: a $y$-intercept has $x = 0$, so it is $(0, y)$.",
                  "这把坐标对调了：$y$ 轴截点的 $x = 0$，形式是 $(0, y)$。",
                ),
                why(
                  distractors[1]!,
                  `These are $1$ too high: $${linTerm("y", k)} = \\pm ${b}$ gives $y = ${y1}$ or $y = ${y2}$.`,
                  `这些点向上多移了 $1$：$${linTerm("y", k)} = \\pm ${b}$ 给出 $y = ${y1}$ 或 $y = ${y2}$。`,
                ),
                why(
                  distractors[2]!,
                  `This uses $a = ${a}$ from the $x^{2}$ denominator, but with $x = 0$ only the $y$ term is left, so $${linTerm("y", k)} = \\pm ${b}$.`,
                  `这用了 $x^{2}$ 分母给出的 $a = ${a}$，但 $x = 0$ 时只剩 $y$ 项，所以 $${linTerm("y", k)} = \\pm ${b}$。`,
                ),
                why(
                  distractors[3]!,
                  `Setting $x = 0$ gives two $y$-intercepts, $(0, ${y1})$ and $(0, ${y2})$.`,
                  `令 $x = 0$ 得到两个 $y$ 轴截点 $(0, ${y1})$ 和 $(0, ${y2})$。`,
                ),
              ],
        );
      },
    },
  ],
};

export const findingIntersectionsOfEllipsesAndLines: TopicDef = {
  id: "finding-intersections-of-ellipses-and-lines",
  title: t("Finding Intersections of Ellipses and Lines", "椭圆与直线的交点"),
  summary: t(
    "Determine the points of intersection between an ellipse and a line by solving a system of equations, and use the discriminant to determine tangency or intersection.",
    "通过联立方程组求解椭圆与直线的交点坐标，并利用判别式判断相交、相切或相离。",
  ),
  prerequisites: ["finding-intercepts-of-ellipses"],
  encompasses: [{ topic: "finding-intercepts-of-ellipses", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `Where does the line $x = 3$ meet $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$? A common point satisfies both equations, so put $x = 3$ into the ellipse: $\\frac{9}{25} + \\frac{y^{2}}{9} = 1$, so $\\frac{y^{2}}{9} = \\frac{16}{25}$, $y^{2} = \\frac{144}{25}$ and $y = \\pm\\frac{12}{5}$. The line meets the ellipse at $\\left(3, \\frac{12}{5}\\right)$ and $\\left(3, -\\frac{12}{5}\\right)$.

Check: $\\frac{9}{25} + \\frac{144}{225} = \\frac{81}{225} + \\frac{144}{225} = 1$.

In this lesson we count the points where a line meets an ellipse, find their coordinates, and find when a slanted line just touches an ellipse.`,
    `直线 $x = 3$ 与 $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$ 交于哪里？公共点同时满足两个方程，所以把 $x = 3$ 代入椭圆：$\\frac{9}{25} + \\frac{y^{2}}{9} = 1$，于是 $\\frac{y^{2}}{9} = \\frac{16}{25}$，$y^{2} = \\frac{144}{25}$，$y = \\pm\\frac{12}{5}$。直线与椭圆交于 $\\left(3, \\frac{12}{5}\\right)$ 和 $\\left(3, -\\frac{12}{5}\\right)$。

检验：$\\frac{9}{25} + \\frac{144}{225} = \\frac{81}{225} + \\frac{144}{225} = 1$。

这节课我们数出直线与椭圆有几个交点，求出交点坐标，并求斜线恰好与椭圆相切的条件。`,
  ),
  knowledgePoints: [
    {
      id: "number-of-intersection-points",
      title: t("Number of intersections of an ellipse and a line", "椭圆与直线交点的个数"),
      explanation: t(
        "Substituting the linear equation $y = mx + d$ or $x = c$ into the ellipse equation produces a quadratic equation $Ax^{2} + Bx + C = 0$.\n\nThe discriminant $\\Delta = B^{2} - 4AC$ reveals:\n- $\\Delta > 0$: $2$ intersection points (secant line)\n- $\\Delta = 0$: $1$ intersection point (tangent line)\n- $\\Delta < 0$: $0$ intersection points\n\nFor a horizontal line $y = c$ this is quick: $\\frac{x^{2}}{a^{2}}$ must equal $1 - \\frac{c^{2}}{b^{2}}$, and a square cannot be negative. With $\\frac{x^{2}}{16} + \\frac{y^{2}}{9} = 1$ and $y = 2$, $\\frac{x^{2}}{16} = 1 - \\frac{4}{9} = \\frac{5}{9} > 0$, so there are $2$ points. Check: the ellipse reaches up to $y = 3$, and the line $y = 2$ is below that.\n\n> **Watch out.** Compare $c$ with $b$, the semi-axis along $y$, not with $a$. The line $y = b$ touches the ellipse at one point, $(0, b)$; it does not cross it twice.",
        "将直线方程 $y = mx + d$ 或 $x = c$ 代入椭圆方程，得到一元二次方程 $Ax^{2} + Bx + C = 0$。\n\n判别式 $\\Delta = B^{2} - 4AC$ 决定交点个数：\n- $\\Delta > 0$：$2$ 个交点（割线）\n- $\\Delta = 0$：$1$ 个交点（切线）\n- $\\Delta < 0$：$0$ 个交点（相离）\n\n对水平直线 $y = c$ 很快：$\\frac{x^{2}}{a^{2}}$ 必须等于 $1 - \\frac{c^{2}}{b^{2}}$，而平方不能是负数。对 $\\frac{x^{2}}{16} + \\frac{y^{2}}{9} = 1$ 和 $y = 2$，$\\frac{x^{2}}{16} = 1 - \\frac{4}{9} = \\frac{5}{9} > 0$，所以有 $2$ 个交点。检验：椭圆最高到 $y = 3$，直线 $y = 2$ 在它下面。\n\n> **注意。** 要把 $c$ 和沿 $y$ 方向的半轴 $b$ 比较，不是和 $a$ 比较。直线 $y = b$ 只在一点 $(0, b)$ 与椭圆相切，不会穿过两次。",
      ),
      generate(rng) {
        const a = rng.int(4, 12);
        const b = rng.int(3, 10);
        const a2 = a * a;
        const b2 = b * b;
        const kind = rng.pick(["secant", "tangent", "exterior"]);
        let cVal = 0;
        let expectedCount = 2;
        if (kind === "secant") {
          cVal = rng.int(1, b - 1);
          expectedCount = 2;
        } else if (kind === "tangent") {
          cVal = b;
          expectedCount = 1;
        } else {
          cVal = b + rng.int(1, 5);
          expectedCount = 0;
        }
        return numberProblem({
          prompt: t(
            `How many points of intersection exist between the ellipse $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ and the horizontal line $y = ${cVal}$?`,
            `椭圆 $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ 与水平直线 $y = ${cVal}$ 有几个交点？`,
          ),
          answer: expectedCount,
          wrong: [0, 1, 2, 3].filter((n) => n !== expectedCount),
          solution: walked(
            [
              [
                ["Substitute the line", "代入直线"],
                t(`Put $y = ${cVal}$ into the ellipse:`, `把 $y = ${cVal}$ 代入椭圆：`),
                [`\\frac{x^{2}}{${a2}} + \\frac{${cVal * cVal}}{${b2}} = 1`],
              ],
              [
                ["Look at the sign", "看符号"],
                t(`Move the number to the right:`, `把数移到右边：`),
                [`\\frac{x^{2}}{${a2}} = 1 - \\frac{${cVal * cVal}}{${b2}} = ${Q.of(b2 - cVal * cVal, b2).toLatex()}`],
              ],
              [
                ["Count the solutions", "数解的个数"],
                expectedCount === 2
                  ? t(
                      `The right side is positive, so $x$ has two values, one of each sign: $2$ points.`,
                      `右边为正，所以 $x$ 有一正一负两个值：$2$ 个交点。`,
                    )
                  : expectedCount === 1
                    ? t(`The right side is zero, so $x = 0$ is the only value: $1$ point.`, `右边为零，所以只有 $x = 0$：$1$ 个交点。`)
                    : t(
                        `The right side is negative, and a square cannot be negative: $0$ points.`,
                        `右边为负，而平方不能是负数：$0$ 个交点。`,
                      ),
              ],
            ],
            t(
              `The ellipse reaches up to $y = ${b}$, and the line $y = ${cVal}$ is ${expectedCount === 2 ? "below that, so it cuts across the ellipse" : expectedCount === 1 ? "exactly that high, so it touches the top" : "above that, so it misses the ellipse"}.`,
              `椭圆最高到 $y = ${b}$，直线 $y = ${cVal}$ ${expectedCount === 2 ? "在它下面，所以横穿椭圆" : expectedCount === 1 ? "恰好在这个高度，所以与顶部相切" : "在它上面，所以与椭圆不相交"}。`,
            ),
          ),
        });
      },
    },
    {
      id: "coordinates-of-intersection-points",
      title: t("Finding coordinates of intersection points", "求椭圆与直线的交点坐标"),
      explanation: t(
        "To find the intersection points, substitute the line's variable into the ellipse equation, solve for the remaining variable, and substitute back to obtain both coordinates $(x, y)$.\n\nA vertical line $x = x_{0}$ fixes $x$, so only $y$ is left to find, and $y^{2}$ gives two values of opposite sign. With $\\frac{x^{2}}{25} + \\frac{y^{2}}{4} = 1$ and $x = 4$: $\\frac{y^{2}}{4} = 1 - \\frac{16}{25} = \\frac{9}{25}$, so $y = \\pm\\frac{6}{5}$ and the points are $\\left(4, \\pm\\frac{6}{5}\\right)$. Check: $\\frac{16}{25} + \\frac{36}{100} = \\frac{64}{100} + \\frac{36}{100} = 1$.\n\n> **Watch out.** The $\\pm$ belongs to $y$: both points have $x = x_{0}$, so writing $\\pm x_{0}$ puts one of them on a different line. And keep both signs of $y$.",
        "求交点坐标时，将直线方程代入椭圆方程，求解剩余未知数，再回代得到所有交点坐标 $(x, y)$。\n\n竖直直线 $x = x_{0}$ 固定了 $x$，只需求 $y$，而 $y^{2}$ 给出一正一负两个值。对 $\\frac{x^{2}}{25} + \\frac{y^{2}}{4} = 1$ 和 $x = 4$：$\\frac{y^{2}}{4} = 1 - \\frac{16}{25} = \\frac{9}{25}$，所以 $y = \\pm\\frac{6}{5}$，交点是 $\\left(4, \\pm\\frac{6}{5}\\right)$。检验：$\\frac{16}{25} + \\frac{36}{100} = \\frac{64}{100} + \\frac{36}{100} = 1$。\n\n> **注意。** $\\pm$ 属于 $y$：两个点都有 $x = x_{0}$，写成 $\\pm x_{0}$ 会把其中一点放到另一条直线上。$y$ 的两个符号都要保留。",
      ),
      generate(rng) {
        // Choose Pythagorean ratio for clean values: e.g. x/a = 3/5 => y/b = 4/5
        const triple = rng.pick(pythTriples);
        const [k1, k2, m] = triple;
        const mult = rng.int(1, 3);
        const a = m * mult;
        const b = rng.int(2, 8);
        const xVal = k1 * mult;
        const yVal = Q.of(k2 * b, m);
        const a2 = a * a;
        const b2 = b * b;
        const prompt = t(
          `Find the intersection points of the ellipse $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ and the vertical line $x = ${xVal}$.`,
          `求椭圆 $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ 与竖直直线 $x = ${xVal}$ 的交点坐标。`,
        );
        const yTex = yVal.isInteger() ? `${yVal.abs().toLatex()}` : `${yVal.abs().toLatex()}`;
        const correct = `(${xVal}, \\pm ${yTex})`;
        const distractors = [`(\\pm ${xVal}, ${yTex})`, `(${xVal}, \\pm ${b})`, `(${xVal}, 0)`, `(\\pm ${a}, 0)`];
        const solution = walked(
          [
            [
              ["Substitute the line", "代入直线"],
              t(`Put $x = ${xVal}$ into the ellipse:`, `把 $x = ${xVal}$ 代入椭圆：`),
              [`\\frac{${xVal * xVal}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`],
            ],
            [
              ["Solve for y", "解出 y"],
              t(
                `Reduce the first term, move it to the right, multiply by $${b2}$ and take both roots:`,
                `把第一项约分后移到右边，乘以 $${b2}$，再取两个平方根：`,
              ),
              [
                `\\frac{${xVal * xVal}}{${a2}} = \\frac{${k1 * k1}}{${m * m}}`,
                `\\frac{y^{2}}{${b2}} = 1 - \\frac{${k1 * k1}}{${m * m}} = \\frac{${k2 * k2}}{${m * m}}`,
                `y = \\pm ${yTex}`,
                correct,
              ],
            ],
          ],
          t(
            `$\\frac{${k1 * k1}}{${m * m}} + \\frac{${k2 * k2}}{${m * m}} = \\frac{${m * m}}{${m * m}} = 1$, so both points lie on the ellipse, and both have $x = ${xVal}$.`,
            `$\\frac{${k1 * k1}}{${m * m}} + \\frac{${k2 * k2}}{${m * m}} = \\frac{${m * m}}{${m * m}} = 1$，所以两点都在椭圆上，且都有 $x = ${xVal}$。`,
          ),
        );
        return makeChoice(rng, prompt, correct, distractors, solution, [
          why(
            distractors[0]!,
            `The line is $x = ${xVal}$, so $x$ cannot be $-${xVal}$: the $\\pm$ belongs to $y$.`,
            `直线是 $x = ${xVal}$，所以 $x$ 不能是 $-${xVal}$：$\\pm$ 属于 $y$。`,
          ),
          why(
            distractors[1]!,
            `$y = \\pm ${b}$ is where the ellipse meets the $y$-axis, at $x = 0$; at $x = ${xVal}$ the ellipse is lower.`,
            `$y = \\pm ${b}$ 是椭圆与 $y$ 轴的交点，在 $x = 0$ 处；在 $x = ${xVal}$ 处椭圆更低。`,
          ),
          why(
            distractors[2]!,
            `With $y = 0$ the left side is $\\frac{${k1 * k1}}{${m * m}}$, not $1$, so this point is inside the ellipse.`,
            `$y = 0$ 时左边是 $\\frac{${k1 * k1}}{${m * m}}$，不是 $1$，所以这一点在椭圆内部。`,
          ),
          why(
            distractors[3]!,
            `These are the $x$-intercepts; they are not on the line $x = ${xVal}$.`,
            `这是 $x$ 轴截点，不在直线 $x = ${xVal}$ 上。`,
          ),
        ]);
      },
    },
  ],
};

export const fociOfEllipses: TopicDef = {
  id: "foci-of-ellipses",
  title: t("Foci of Ellipses", "椭圆的焦点坐标与焦距"),
  summary: t(
    "Calculate the focal distance using $c^2 = a^2 - b^2$ and find the coordinates of the foci for both origin-centered and shifted ellipses.",
    "利用焦半径关系 $c^2 = a^2 - b^2$ 计算焦距，并确定中心在原点及平移后椭圆的焦点坐标。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `For $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$, the co-vertex $(0, 3)$ is equally far from both foci, and the two distances add to $2a = 10$, so each is $5$. That distance is the hypotenuse of a right triangle with legs $3$ (up to the co-vertex) and $c$ (out to a focus), so $c^{2} = 5^{2} - 3^{2} = 16$, $c = 4$, and the foci are $(\\pm 4, 0)$.

Check: the vertex $(5, 0)$ is $1$ from $(4, 0)$ and $9$ from $(-4, 0)$, and $1 + 9 = 10 = 2a$.

In this lesson we use $c^{2} = a^{2} - b^{2}$ to find the foci of an ellipse centered at the origin and of one centered elsewhere, and use them in triangles and with the eccentricity.`,
    `对 $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$，短轴端点 $(0, 3)$ 到两焦点一样远，两段距离之和是 $2a = 10$，所以各是 $5$。这段距离是一个直角三角形的斜边，两条直角边是 $3$（到短轴端点）和 $c$（到焦点），所以 $c^{2} = 5^{2} - 3^{2} = 16$，$c = 4$，焦点是 $(\\pm 4, 0)$。

检验：顶点 $(5, 0)$ 到 $(4, 0)$ 的距离是 $1$，到 $(-4, 0)$ 的距离是 $9$，而 $1 + 9 = 10 = 2a$。

这节课我们用 $c^{2} = a^{2} - b^{2}$ 求中心在原点和中心在别处的椭圆的焦点，并在三角形和离心率问题中用到它们。`,
  ),
  knowledgePoints: [
    {
      id: "foci-of-ellipses-at-the-origin",
      title: t("Foci of ellipses centered at the origin", "中心在原点的椭圆焦点"),
      explanation: t(
        "The focal distance $c$ from the center to each focus satisfies:\n\n$$c^{2} = a^{2} - b^{2} \\implies c = \\sqrt{a^{2} - b^{2}}$$\n\n- Horizontal major axis: foci at $(\\pm c, 0)$\n- Vertical major axis: foci at $(0, \\pm c)$\n\nThe relation comes from the co-vertex $(0, b)$: it is $a$ from each focus, since the two distances are equal and add to $2a$, so $b$, $c$ and $a$ form a right triangle with hypotenuse $a$. For $\\frac{x^{2}}{25} + \\frac{y^{2}}{169} = 1$: $c^{2} = 169 - 25 = 144$, $c = 12$, and the larger denominator is under $y^{2}$, so the foci are $(0, \\pm 12)$. Check: $12^{2} + 5^{2} = 169$.\n\n> **Watch out.** Subtract the squares: $c^{2} = a^{2} - b^{2}$. Adding them is the rule for a hyperbola and puts the foci outside the ellipse. The foci lie on the major axis, the one with the larger denominator.",
        "中心到焦点的焦距 $c$ 满足关系：\n\n$$c^{2} = a^{2} - b^{2} \\implies c = \\sqrt{a^{2} - b^{2}}$$\n\n- 长轴水平：焦点为 $(\\pm c, 0)$\n- 长轴竖直：焦点为 $(0, \\pm c)$\n\n这个关系来自短轴端点 $(0, b)$：两段距离相等且和为 $2a$，所以它到每个焦点的距离都是 $a$，于是 $b$、$c$、$a$ 构成以 $a$ 为斜边的直角三角形。对 $\\frac{x^{2}}{25} + \\frac{y^{2}}{169} = 1$：$c^{2} = 169 - 25 = 144$，$c = 12$，较大的分母在 $y^{2}$ 下，所以焦点是 $(0, \\pm 12)$。检验：$12^{2} + 5^{2} = 169$。\n\n> **注意。** 平方要相减：$c^{2} = a^{2} - b^{2}$。相加是双曲线的规则，会把焦点放到椭圆外面。焦点在长轴上，即分母较大的那条轴上。",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const prompt = t(`Find the coordinates of the foci of the ellipse $${eqStr}$.`, `求椭圆 $${eqStr}$ 的焦点坐标。`);
        const correct = horizontal ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`;
        const distractors = [
          horizontal ? `(0, \\pm ${c})` : `(\\pm ${c}, 0)`,
          horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`,
          horizontal ? `(0, \\pm ${b})` : `(\\pm ${b}, 0)`,
          `(\\pm ${a + b}, 0)`,
        ];
        const solution = walked(
          [
            [
              ["Find c", "求 c"],
              t(`Here $a^{2} = ${a2}$ and $b^{2} = ${b2}$:`, `这里 $a^{2} = ${a2}$，$b^{2} = ${b2}$：`),
              [`c^{2} = a^{2} - b^{2} = ${a2} - ${b2} = ${c * c} \\implies c = ${c}`],
            ],
            [
              ["Place the foci on the major axis", "把焦点放在长轴上"],
              t(
                `The larger denominator is under $${horizontal ? "x^{2}" : "y^{2}"}$, so the major axis is ${horizontal ? "horizontal" : "vertical"} and the foci are $${correct}$.`,
                `较大的分母在 $${horizontal ? "x^{2}" : "y^{2}"}$ 下，所以长轴${horizontal ? "水平" : "竖直"}，焦点是 $${correct}$。`,
              ),
            ],
          ],
          t(
            `$c^{2} + b^{2} = ${c * c} + ${b2} = ${a2} = a^{2}$, and $c = ${c}$ is less than $a = ${a}$, so the foci are inside the ellipse.`,
            `$c^{2} + b^{2} = ${c * c} + ${b2} = ${a2} = a^{2}$，且 $c = ${c}$ 小于 $a = ${a}$，所以焦点在椭圆内部。`,
          ),
        );
        return reasoned(makeChoice(rng, prompt, correct, distractors, solution), [
          [
            `$${distractors[0]!}$`,
            "The foci lie on the major axis, the axis with the larger denominator, and this is the other axis.",
            "焦点在长轴上，即分母较大的那条轴上，而这是另一条轴。",
          ],
          [
            `$${distractors[1]!}$`,
            "Those are the vertices, at distance $a$ from the center: the foci are at distance $c$.",
            "这是顶点，到中心的距离是 $a$：焦点到中心的距离是 $c$。",
          ],
          [
            `$${distractors[2]!}$`,
            "Those are the ends of the minor axis, at distance $b$ from the center.",
            "这是短轴的端点，到中心的距离是 $b$。",
          ],
          [
            `$${distractors[3]!}$`,
            "For an ellipse $c^{2} = a^{2} - b^{2}$, so $c$ is not $a + b$.",
            "椭圆中 $c^{2} = a^{2} - b^{2}$，所以 $c$ 不是 $a + b$。",
          ],
        ]);
      },
    },
    {
      id: "foci-of-shifted-ellipses",
      figure: precalculusDrawings3["foci-of-ellipses#foci-of-shifted-ellipses"],
      title: t("Foci of translated ellipses", "平移椭圆的焦点坐标"),
      explanation: t(
        "For an ellipse with center $(h, k)$ and focal distance $c = \\sqrt{a^{2} - b^{2}}$:\n\n- Horizontal major axis: foci at $(h \\pm c, k)$\n- Vertical major axis: foci at $(h, k \\pm c)$\n\nShifting the ellipse carries its foci along, so measure $c$ from the center. For $\\frac{(x - 1)^{2}}{25} + \\frac{(y + 2)^{2}}{16} = 1$: the center is $(1, -2)$, $c = \\sqrt{25 - 16} = 3$, and the major axis is horizontal, so the foci are $(-2, -2)$ and $(4, -2)$. Check: their midpoint is $(1, -2)$, the center.\n\n> **Watch out.** Add $\\pm c$ to the center, not to the origin: $(\\pm 3, 0)$ are the foci before the shift. And move only along the major axis.",
        "对于中心在 $(h, k)$、半焦距为 $c = \\sqrt{a^{2} - b^{2}}$ 的平移椭圆：\n\n- 长轴水平：焦点为 $(h \\pm c, k)$\n- 长轴竖直：焦点为 $(h, k \\pm c)$\n\n椭圆平移时焦点一起移动，所以从中心量 $c$。对 $\\frac{(x - 1)^{2}}{25} + \\frac{(y + 2)^{2}}{16} = 1$：中心是 $(1, -2)$，$c = \\sqrt{25 - 16} = 3$，长轴水平，所以焦点是 $(-2, -2)$ 和 $(4, -2)$。检验：它们的中点是 $(1, -2)$，正是中心。\n\n> **注意。** 要在中心上加 $\\pm c$，不是在原点上加：$(\\pm 3, 0)$ 是平移前的焦点。而且只沿长轴移动。",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const horizontal = rng.bool();
        const eqStr = ellipseEq(h, k, a2, b2, horizontal);
        const prompt = t(`Find the coordinates of the foci of the ellipse $${eqStr}$.`, `求椭圆 $${eqStr}$ 的焦点坐标。`);
        const f1 = horizontal ? `(${h - c}, ${k})` : `(${h}, ${k - c})`;
        const f2 = horizontal ? `(${h + c}, ${k})` : `(${h}, ${k + c})`;
        const correct = `${f1} \\text{ and } ${f2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - c}) \\text{ and } (${h}, ${k + c})` : `(${h - c}, ${k}) \\text{ and } (${h + c}, ${k})`,
          horizontal ? `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})` : `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})`,
          horizontal ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`,
          `(${h}, ${k})`,
        ];
        const solution = walked(
          [
            [
              ["Read the center and the major axis", "读出中心和长轴"],
              t(
                `The center is $(${h}, ${k})$, and the larger denominator, $${a2}$, is under the ${horizontal ? "$x$" : "$y$"} term, so the major axis is ${horizontal ? "horizontal" : "vertical"}.`,
                `中心是 $(${h}, ${k})$，较大的分母 $${a2}$ 在 ${horizontal ? "$x$" : "$y$"} 项下，所以长轴${horizontal ? "水平" : "竖直"}。`,
              ),
            ],
            [["Find c", "求 c"], t(`Subtract the denominators:`, `分母相减：`), [`c = \\sqrt{${a2} - ${b2}} = \\sqrt{${c * c}} = ${c}`]],
            [
              ["Move c from the center", "从中心移动 c"],
              t(`Move $${c}$ both ways along the major axis:`, `沿长轴向两边各移 $${c}$：`),
              [correct],
            ],
          ],
          t(
            `The midpoint of the foci is $(${h}, ${k})$, the center, and they are $${2 * c} = 2c$ apart.`,
            `两焦点的中点是 $(${h}, ${k})$，正是中心，它们相距 $${2 * c} = 2c$。`,
          ),
        );
        return makeChoice(rng, prompt, correct, distractors, solution, [
          why(
            distractors[0]!,
            `These move along the ${horizontal ? "vertical" : "horizontal"} line, but the major axis, with the larger denominator, is ${horizontal ? "horizontal" : "vertical"}.`,
            `这是沿${horizontal ? "竖直" : "水平"}方向移动，但分母较大的长轴是${horizontal ? "水平" : "竖直"}的。`,
          ),
          why(
            distractors[1]!,
            `These are the vertices, $a = ${a}$ from the center: the foci are $c = ${c}$ from it.`,
            `这是顶点，距中心 $a = ${a}$：焦点距中心 $c = ${c}$。`,
          ),
          why(
            distractors[2]!,
            `These are the foci before the shift: add the center $(${h}, ${k})$.`,
            `这是平移前的焦点：要加上中心 $(${h}, ${k})$。`,
          ),
          why(distractors[3]!, "That is the center: the foci are $c$ away from it on either side.", "这是中心：焦点在它两侧，各距 $c$。"),
        ]);
      },
    },
  ],
};

export const verticesAndEccentricityOfEllipses: TopicDef = {
  id: "vertices-and-eccentricity-of-ellipses",
  title: t("Vertices and Eccentricity of Ellipses", "椭圆的顶点与离心率"),
  summary: t(
    "Define the eccentricity of an ellipse as $e = c/a$ ($0 < e < 1$) and relate it to the elongation of the ellipse.",
    "理解椭圆离心率的定义 $e = c/a$ ($0 < e < 1$) 及其对椭圆扁平程度的描述。",
  ),
  prerequisites: ["foci-of-ellipses"],
  encompasses: [{ topic: "foci-of-ellipses", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `Two ellipses can both have $a = 5$ and still look very different. For $\\frac{x^{2}}{25} + \\frac{y^{2}}{16} = 1$, $c = \\sqrt{25 - 16} = 3$, and the foci sit $\\frac{3}{5}$ of the way out to the vertices; for $\\frac{x^{2}}{25} + \\frac{y^{2}}{24} = 1$, $c = 1$, only $\\frac{1}{5}$ of the way. That fraction, $e = \\frac{c}{a}$, is the eccentricity, and the second ellipse, with the smaller $e$, is the rounder one: its $b = \\sqrt{24} \\approx 4.9$ is almost $a$.

Check: $0 < \\frac{1}{5} < \\frac{3}{5} < 1$, and $b = 4$ for the first ellipse is further from $a = 5$.

In this lesson we compute the eccentricity $e = \\frac{c}{a}$ from an equation and read what it says about the shape.`,
    `两个椭圆都有 $a = 5$，样子却可以很不一样。对 $\\frac{x^{2}}{25} + \\frac{y^{2}}{16} = 1$，$c = \\sqrt{25 - 16} = 3$，焦点在从中心到顶点的 $\\frac{3}{5}$ 处；对 $\\frac{x^{2}}{25} + \\frac{y^{2}}{24} = 1$，$c = 1$，只在 $\\frac{1}{5}$ 处。这个比 $e = \\frac{c}{a}$ 就是离心率，$e$ 较小的第二个椭圆更圆：它的 $b = \\sqrt{24} \\approx 4.9$ 几乎等于 $a$。

检验：$0 < \\frac{1}{5} < \\frac{3}{5} < 1$，第一个椭圆的 $b = 4$ 离 $a = 5$ 更远。

这节课我们从方程算出离心率 $e = \\frac{c}{a}$，并读出它对形状的描述。`,
  ),
  knowledgePoints: [
    {
      id: "calculating-eccentricity",
      title: t("Calculating the eccentricity of an ellipse", "计算椭圆的离心率"),
      explanation: t(
        "The eccentricity $e$ of an ellipse is the ratio of focal distance $c$ to semi-major axis $a$:\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} - b^{2}}}{a}$$\n\nFor any ellipse, $0 < e < 1$.\n\nSince $c < a$, the ratio is always between $0$ and $1$, and it does not change when the whole ellipse is scaled. For $\\frac{x^{2}}{100} + \\frac{y^{2}}{36} = 1$: $a = 10$, $c = \\sqrt{100 - 36} = 8$, and $e = \\frac{8}{10} = \\frac{4}{5}$. Check: $e \\cdot a = \\frac{4}{5} \\cdot 10 = 8 = c$.\n\n> **Watch out.** Divide by $a$, the semi-major axis, and use $c$, not $b$: $\\frac{b}{a}$ and $\\frac{a}{c}$ are other ratios. An answer of $1$ or more cannot be the eccentricity of an ellipse.",
        "椭圆的离心率 $e$ 是半焦距 $c$ 与半长轴 $a$ 的比值：\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} - b^{2}}}{a}$$\n\n对任意椭圆，恒有 $0 < e < 1$。\n\n因为 $c < a$，这个比总在 $0$ 与 $1$ 之间，而且整个椭圆放大或缩小时它不变。对 $\\frac{x^{2}}{100} + \\frac{y^{2}}{36} = 1$：$a = 10$，$c = \\sqrt{100 - 36} = 8$，$e = \\frac{8}{10} = \\frac{4}{5}$。检验：$e \\cdot a = \\frac{4}{5} \\cdot 10 = 8 = c$。\n\n> **注意。** 要除以半长轴 $a$，用的是 $c$ 而不是 $b$：$\\frac{b}{a}$ 和 $\\frac{a}{c}$ 是别的比。大于或等于 $1$ 的结果不可能是椭圆的离心率。",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const mult = rng.int(1, 3);
        const A = a * mult;
        const B = b * mult;
        const C = c * mult;
        const a2 = A * A;
        const b2 = B * B;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const eFrac = Q.of(C, A);
        return numberProblem({
          prompt: t(`Calculate the eccentricity of the ellipse $${eqStr}$.`, `计算椭圆 $${eqStr}$ 的离心率。`),
          answer: eFrac,
          wrong: [Q.of(B, A), Q.of(A, C), Q.of(C, B), Q.of(B, C)],
          solution: walked(
            [
              [
                ["Read a and b", "读出 a 和 b"],
                t(
                  `The larger denominator is $a^{2} = ${a2}$ and the smaller is $b^{2} = ${b2}$, so $a = ${A}$ and $b = ${B}$.`,
                  `较大的分母是 $a^{2} = ${a2}$，较小的是 $b^{2} = ${b2}$，所以 $a = ${A}$，$b = ${B}$。`,
                ),
              ],
              [["Find c", "求 c"], t(`Subtract the squares:`, `平方相减：`), [`c = \\sqrt{${a2} - ${b2}} = \\sqrt{${C * C}} = ${C}`]],
              [
                ["Divide by a", "除以 a"],
                t(`The eccentricity is $c$ over $a$:`, `离心率是 $c$ 除以 $a$：`),
                [`e = \\frac{c}{a} = \\frac{${C}}{${A}} = ${eFrac.toLatex()}`],
              ],
            ],
            t(
              `$0 < ${eFrac.toLatex()} < 1$, and $e \\cdot a = ${eFrac.toLatex()} \\cdot ${A} = ${C} = c$.`,
              `$0 < ${eFrac.toLatex()} < 1$，且 $e \\cdot a = ${eFrac.toLatex()} \\cdot ${A} = ${C} = c$。`,
            ),
          ),
        });
      },
    },
    {
      id: "geometric-meaning-of-eccentricity",
      figure: precalculusDrawings3["vertices-and-eccentricity-of-ellipses#geometric-meaning-of-eccentricity"],
      title: t("Geometric meaning of eccentricity", "离心率的几何意义"),
      explanation: t(
        "Eccentricity describes the roundness or elongation of an ellipse:\n\n- As $e \\to 0$, $c \\to 0$ and $b \\to a$, so the ellipse is nearly a circle.\n- As $e \\to 1$, $c \\to a$ and $b \\to 0$, so the ellipse is very long and narrow (highly elongated).\n\nThe reason is $b^{2} = a^{2} - c^{2}$: dividing by $a^{2}$ gives $\\frac{b}{a} = \\sqrt{1 - e^{2}}$, the height of the ellipse as a share of its width. With $e = 0.6$, $\\frac{b}{a} = \\sqrt{1 - 0.36} = 0.8$, a fairly round ellipse; with $e = 0.95$, $\\frac{b}{a} = \\sqrt{0.0975} \\approx 0.31$, a long thin one. Check: $0.6^{2} + 0.8^{2} = 1$.\n\n> **Watch out.** A larger eccentricity means a flatter ellipse, not a rounder one. An eccentricity near $0$ is close to a circle.",
        "离心率描述了椭圆的圆润或扁平程度：\n\n- 当 $e \\to 0$ 时，$c \\to 0$ 且 $b \\to a$，椭圆接近圆。\n- 当 $e \\to 1$ 时，$c \\to a$ 且 $b \\to 0$，椭圆变得非常狭长（扁平）。\n\n原因是 $b^{2} = a^{2} - c^{2}$：两边除以 $a^{2}$ 得 $\\frac{b}{a} = \\sqrt{1 - e^{2}}$，即椭圆的高占宽的比例。$e = 0.6$ 时 $\\frac{b}{a} = \\sqrt{1 - 0.36} = 0.8$，椭圆比较圆；$e = 0.95$ 时 $\\frac{b}{a} = \\sqrt{0.0975} \\approx 0.31$，椭圆又长又窄。检验：$0.6^{2} + 0.8^{2} = 1$。\n\n> **注意。** 离心率越大，椭圆越扁，而不是越圆。离心率接近 $0$ 时接近圆。",
      ),
      generate(rng) {
        const num1 = rng.int(10, 45);
        const num2 = rng.int(55, 95);
        const aIsHigher = rng.bool();
        const valA = aIsHigher ? num2 : num1;
        const valB = aIsHigher ? num1 : num2;
        const eA = (valA / 100).toFixed(2);
        const eB = (valB / 100).toFixed(2);
        const prompt = t(
          `Ellipse $A$ has eccentricity $e = ${eA}$ and Ellipse $B$ has eccentricity $e = ${eB}$. Which statement correctly compares their shapes?`,
          `椭圆 $A$ 的离心率为 $e = ${eA}$，椭圆 $B$ 的离心率为 $e = ${eB}$。下列哪个选项正确比较了它们的形状？`,
        );
        const correct = aIsHigher
          ? t(
              "Ellipse $A$ is more elongated (flatter), while Ellipse $B$ is closer to a circle.",
              "椭圆 $A$ 更加狭长（扁平），而椭圆 $B$ 更接近圆。",
            )
          : t(
              "Ellipse $B$ is more elongated (flatter), while Ellipse $A$ is closer to a circle.",
              "椭圆 $B$ 更加狭长（扁平），而椭圆 $A$ 更接近圆。",
            );
        const distractors = [
          aIsHigher
            ? t(
                "Ellipse $B$ is more elongated (flatter), while Ellipse $A$ is closer to a circle.",
                "椭圆 $B$ 更加狭长（扁平），而椭圆 $A$ 更接近圆。",
              )
            : t(
                "Ellipse $A$ is more elongated (flatter), while Ellipse $B$ is closer to a circle.",
                "椭圆 $A$ 更加狭长（扁平），而椭圆 $B$ 更接近圆。",
              ),
          t("Both ellipses have the exact same shape.", "两椭圆的形状完全相同。"),
          t("The ellipse with lower eccentricity is more elongated.", "离心率较低的椭圆更加扁长。"),
        ];
        const solution = (() => {
          const ratio = (e: number) => Math.sqrt(1 - (e / 100) ** 2).toFixed(2);
          const [hi, lo] = aIsHigher ? ["A", "B"] : ["B", "A"];
          const [eHi, eLo] = aIsHigher ? [eA, eB] : [eB, eA];
          return walked(
            [
              [
                ["Compare the eccentricities", "比较离心率"],
                t(
                  `$${eHi} > ${eLo}$, so Ellipse $${hi}$ has the larger eccentricity.`,
                  `$${eHi} > ${eLo}$，所以椭圆 $${hi}$ 的离心率较大。`,
                ),
              ],
              [
                ["Relate it to the shape", "联系形状"],
                t(
                  `From $b^{2} = a^{2} - c^{2}$, $\\frac{b}{a} = \\sqrt{1 - e^{2}}$: the larger $e$, the smaller the height compared with the width.`,
                  `由 $b^{2} = a^{2} - c^{2}$ 得 $\\frac{b}{a} = \\sqrt{1 - e^{2}}$：$e$ 越大，高相对于宽越小。`,
                ),
                [
                  `\\frac{b}{a} = \\sqrt{1 - ${eA}^{2}} \\approx ${ratio(valA)} \\text{ for } A, \\quad \\sqrt{1 - ${eB}^{2}} \\approx ${ratio(valB)} \\text{ for } B`,
                ],
              ],
            ],
            t(
              `Ellipse $${hi}$ has the smaller ratio $\\frac{b}{a}$, so it is the flatter one, and Ellipse $${lo}$, with $\\frac{b}{a}$ nearer $1$, is closer to a circle.`,
              `椭圆 $${hi}$ 的 $\\frac{b}{a}$ 较小，所以更扁；椭圆 $${lo}$ 的 $\\frac{b}{a}$ 更接近 $1$，所以更接近圆。`,
            ),
          );
        })();
        return makeChoiceTexts(rng, prompt, correct, distractors, solution, [
          [
            distractors[0]!.en,
            `This reverses the rule: the larger eccentricity, $${aIsHigher ? eA : eB}$, belongs to the flatter ellipse.`,
            `这把规则弄反了：离心率较大的 $${aIsHigher ? eA : eB}$ 对应更扁的椭圆。`,
          ],
          [
            distractors[1]!.en,
            "The eccentricities differ, so the ratios $\\frac{b}{a} = \\sqrt{1 - e^{2}}$ differ, and so do the shapes.",
            "两个离心率不同，所以 $\\frac{b}{a} = \\sqrt{1 - e^{2}}$ 不同，形状也不同。",
          ],
          [
            distractors[2]!.en,
            "A lower eccentricity means $c$ is small next to $a$, so $b$ is close to $a$: that ellipse is rounder.",
            "离心率较低说明 $c$ 比 $a$ 小得多，所以 $b$ 接近 $a$：这个椭圆更圆。",
          ],
        ]);
      },
    },
  ],
};

export const directricesOfEllipses: TopicDef = {
  id: "directrices-of-ellipses",
  title: t("Directrices of Ellipses", "椭圆的准线方程"),
  summary: t(
    "Find the equations of the directrices of an ellipse ($x = \\pm a^2/c$ or $y = \\pm a^2/c$) and understand the focus-directrix definition.",
    "求椭圆的准线方程（x = ±a²/c 或 y = ±a²/c），理解椭圆的焦点-准线定义。",
  ),
  prerequisites: ["vertices-and-eccentricity-of-ellipses"],
  encompasses: [{ topic: "vertices-and-eccentricity-of-ellipses", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `For $\\frac{x^{2}}{25} + \\frac{y^{2}}{16} = 1$, $c = 3$ and $e = \\frac{3}{5}$. The lines $x = \\pm\\frac{a^{2}}{c} = \\pm\\frac{25}{3}$ are its directrices, and every point of the ellipse is $e$ times as far from the focus $(3, 0)$ as from the line $x = \\frac{25}{3}$. Take the vertex $(5, 0)$: it is $2$ from the focus and $\\frac{25}{3} - 5 = \\frac{10}{3}$ from the line.

Check: $\\frac{2}{10/3} = \\frac{6}{10} = \\frac{3}{5} = e$.

In this lesson we find the directrices of an ellipse, use the focus-directrix property $PF = e \\cdot d$, and find the distance from a focus to its directrix.`,
    `对 $\\frac{x^{2}}{25} + \\frac{y^{2}}{16} = 1$，$c = 3$，$e = \\frac{3}{5}$。直线 $x = \\pm\\frac{a^{2}}{c} = \\pm\\frac{25}{3}$ 是它的准线，椭圆上每一点到焦点 $(3, 0)$ 的距离都是它到直线 $x = \\frac{25}{3}$ 的距离的 $e$ 倍。看顶点 $(5, 0)$：它到焦点的距离是 $2$，到这条直线的距离是 $\\frac{25}{3} - 5 = \\frac{10}{3}$。

检验：$\\frac{2}{10/3} = \\frac{6}{10} = \\frac{3}{5} = e$。

这节课我们求椭圆的准线，用焦点-准线性质 $PF = e \\cdot d$，并求焦点到准线的距离。`,
  ),
  knowledgePoints: [
    {
      id: "equations-of-directrices-at-origin",
      figure: precalculusDrawings3["directrices-of-ellipses#equations-of-directrices-at-origin"],
      title: t("Equations of directrices for an ellipse centered at the origin", "中心在原点的椭圆准线方程"),
      explanation: t(
        "An ellipse has two directrix lines perpendicular to the major axis:\n\n- Horizontal major axis: $x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- Vertical major axis: $y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n\nSince $e < 1$, the distance $\\frac{a}{e}$ is more than $a$, so the directrices lie outside the ellipse, beyond the vertices. For $\\frac{x^{2}}{169} + \\frac{y^{2}}{144} = 1$: $c = \\sqrt{169 - 144} = 5$, so the directrices are $x = \\pm\\frac{169}{5}$. Check: $\\frac{169}{5} = 33.8 > 13 = a$.\n\n> **Watch out.** The distance is $\\frac{a^{2}}{c}$, not $\\frac{b^{2}}{c}$ or $\\frac{c^{2}}{a}$. The directrices are perpendicular to the major axis, so a horizontal ellipse has directrices $x = \\dots$.",
        "椭圆有两条垂直于长轴的准线：\n\n- 长轴水平：$x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- 长轴竖直：$y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n\n因为 $e < 1$，距离 $\\frac{a}{e}$ 大于 $a$，所以准线在椭圆外，在顶点的外侧。对 $\\frac{x^{2}}{169} + \\frac{y^{2}}{144} = 1$：$c = \\sqrt{169 - 144} = 5$，所以准线是 $x = \\pm\\frac{169}{5}$。检验：$\\frac{169}{5} = 33.8 > 13 = a$。\n\n> **注意。** 距离是 $\\frac{a^{2}}{c}$，不是 $\\frac{b^{2}}{c}$ 或 $\\frac{c^{2}}{a}$。准线垂直于长轴，所以长轴水平的椭圆，准线是 $x = \\dots$。",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const prompt = t(`Find the equations of the directrices of the ellipse $${eqStr}$.`, `求椭圆 $${eqStr}$ 的准线方程。`);
        const valStr = pmFrac(a2, c);
        const wrongVal1 = pmFrac(b2, c);
        const wrongVal2 = pmFrac(c * c, a);
        const correct = `${horizontal ? "x" : "y"} = ${valStr}`;
        const distractors = [
          `${horizontal ? "y" : "x"} = ${valStr}`,
          `${horizontal ? "x" : "y"} = ${wrongVal1}`,
          `${horizontal ? "x" : "y"} = ${wrongVal2}`,
        ];
        const solution = walked(
          [
            [
              ["Find c", "求 c"],
              t(
                `The larger denominator, $a^{2} = ${a2}$, is under $${horizontal ? "x^{2}" : "y^{2}"}$, so $a = ${a}$ and the major axis is ${horizontal ? "horizontal" : "vertical"}:`,
                `较大的分母 $a^{2} = ${a2}$ 在 $${horizontal ? "x^{2}" : "y^{2}"}$ 下，所以 $a = ${a}$，长轴${horizontal ? "水平" : "竖直"}：`,
              ),
              [`c = \\sqrt{${a2} - ${b2}} = \\sqrt{${c * c}} = ${c}`],
            ],
            [
              ["Divide a squared by c", "用 a 的平方除以 c"],
              t(
                `The directrices are perpendicular to the major axis, at $\\frac{a^{2}}{c}$ from the center:`,
                `准线垂直于长轴，到中心的距离是 $\\frac{a^{2}}{c}$：`,
              ),
              [
                `${horizontal ? "x" : "y"} = \\pm \\frac{a^{2}}{c} = \\pm \\frac{${a2}}{${c}}${valStr === `\\pm \\frac{${a2}}{${c}}` ? "" : ` = ${valStr}`}`,
              ],
            ],
          ],
          t(
            `The distance is $\\frac{a}{e}$: $\\frac{${a2}}{${c}} \\times \\frac{${c}}{${a}} = ${a} = a$, and $\\frac{${a2}}{${c}} > ${a}$, so the lines are outside the ellipse.`,
            `这个距离是 $\\frac{a}{e}$：$\\frac{${a2}}{${c}} \\times \\frac{${c}}{${a}} = ${a} = a$，且 $\\frac{${a2}}{${c}} > ${a}$，所以准线在椭圆外。`,
          ),
        );
        return makeChoice(rng, prompt, correct, distractors, solution, [
          why(
            distractors[0]!,
            `These lines are parallel to the major axis; the directrices are perpendicular to it, so they are $${horizontal ? "x" : "y"} = \\dots$.`,
            `这两条线平行于长轴；准线垂直于长轴，所以是 $${horizontal ? "x" : "y"} = \\dots$。`,
          ),
          why(
            distractors[1]!,
            `This divides $b^{2} = ${b2}$ by $c$; the directrices are at $\\frac{a^{2}}{c}$.`,
            `这是用 $b^{2} = ${b2}$ 除以 $c$；准线在 $\\frac{a^{2}}{c}$ 处。`,
          ),
          why(
            distractors[2]!,
            `$\\frac{c^{2}}{a}$ is less than $a$, inside the ellipse; the directrices are at $\\frac{a^{2}}{c}$, beyond the vertices.`,
            `$\\frac{c^{2}}{a}$ 小于 $a$，在椭圆内；准线在 $\\frac{a^{2}}{c}$ 处，在顶点外侧。`,
          ),
        ]);
      },
    },
    {
      id: "focus-directrix-ratio",
      title: t("The focus-directrix property of an ellipse", "椭圆的第二定义（焦点-准线性质）"),
      explanation: t(
        "By the focus-directrix definition, an ellipse is the locus of points $P$ such that the ratio of the distance to a focus $F$ to the distance to the corresponding directrix $\\ell$ is constant and equals the eccentricity $e$:\n\n$$\\frac{PF}{d(P, \\ell)} = e < 1 \\implies PF = e \\cdot d(P, \\ell)$$\n\nBecause $e < 1$, every point of an ellipse is nearer its focus than its directrix. With $e = \\frac{2}{3}$ and a distance of $12$ to the directrix, $PF = \\frac{2}{3} \\times 12 = 8$. Check: $\\frac{8}{12} = \\frac{2}{3}$.\n\n> **Watch out.** Multiply the distance to the directrix by $e$; dividing by $e$ gives a distance larger than it, which is impossible for an ellipse.",
        "根据椭圆的第二定义，椭圆是到焦点 $F$ 的距离与到对应准线 $\\ell$ 的距离之比等于离心率 $e$ 的点的轨迹：\n\n$$\\frac{PF}{d(P, \\ell)} = e < 1 \\implies PF = e \\cdot d(P, \\ell)$$\n\n因为 $e < 1$，椭圆上每一点到焦点都比到准线近。$e = \\frac{2}{3}$、到准线的距离为 $12$ 时，$PF = \\frac{2}{3} \\times 12 = 8$。检验：$\\frac{8}{12} = \\frac{2}{3}$。\n\n> **注意。** 要用到准线的距离乘以 $e$；除以 $e$ 会得到比它还大的距离，这对椭圆是不可能的。",
      ),
      generate(rng) {
        const eNumerator = rng.pick([1, 2, 3, 4]);
        const eDenominator = eNumerator + rng.int(1, 3);
        const e = Q.of(eNumerator, eDenominator);
        const mult = rng.int(2, 6);
        const distDirectrix = eDenominator * mult;
        const distFocus = eNumerator * mult;
        return numberProblem({
          prompt: t(
            `A point $P$ lies on an ellipse with eccentricity $e = ${e.toLatex()}$. If the distance from $P$ to the directrix is $${distDirectrix}$, what is the distance from $P$ to the corresponding focus?`,
            `点 $P$ 位于离心率 $e = ${e.toLatex()}$ 的椭圆上。如果点 $P$ 到准线的距离为 $${distDirectrix}$，那么点 $P$ 到对应焦点的距离是多少？`,
          ),
          answer: distFocus,
          wrong: [distDirectrix, distDirectrix - distFocus, Math.round((distDirectrix * eDenominator) / eNumerator), distFocus + 2],
          solution: walked(
            [
              [
                ["Write the property", "写出性质"],
                t(`The distance to the focus is $e$ times the distance to the directrix:`, `到焦点的距离是到准线距离的 $e$ 倍：`),
                [`PF = e \\cdot d(P, \\ell)`],
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `Put in $e = ${e.toLatex()}$ and $d(P, \\ell) = ${distDirectrix}$:`,
                  `代入 $e = ${e.toLatex()}$ 和 $d(P, \\ell) = ${distDirectrix}$：`,
                ),
                [`PF = ${e.toLatex()} \\times ${distDirectrix} = ${distFocus}`],
              ],
            ],
            t(
              `$\\frac{${distFocus}}{${distDirectrix}} = ${e.toLatex()} = e$, and $${distFocus} < ${distDirectrix}$, as it must be for an ellipse.`,
              `$\\frac{${distFocus}}{${distDirectrix}} = ${e.toLatex()} = e$，且 $${distFocus} < ${distDirectrix}$，符合椭圆的要求。`,
            ),
          ),
        });
      },
    },
  ],
};

export const theAreaOfAnEllipse: TopicDef = {
  id: "the-area-of-an-ellipse",
  title: t("The Area of an Ellipse", "椭圆的面积"),
  summary: t(
    "Calculate the area of an ellipse using the formula $A = \\pi a b$ and compare it to the area of a circle.",
    "利用公式 A = πab 计算椭圆面积，并与圆的面积公式进行对比。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-the-origin", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.3"],
  intro: t(
    `The unit circle has area $\\pi$. Stretching it by $5$ across multiplies every area by $5$, and stretching by $3$ up and down multiplies it by $3$ more, which turns the circle into $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$. So that ellipse has area $\\pi \\cdot 5 \\cdot 3 = 15\\pi$.

Check: $15\\pi$ lies between the area of the circle of radius $3$, $9\\pi$, and that of the circle of radius $5$, $25\\pi$, which the ellipse fits between.

In this lesson we find the area $\\pi ab$ of an ellipse from its equation, also when it is not in standard form, and find a missing semi-axis from the area.`,
    `单位圆的面积是 $\\pi$。横向拉长到 $5$ 倍使每块面积乘以 $5$，纵向拉长到 $3$ 倍再乘以 $3$，圆就变成 $\\frac{x^{2}}{25} + \\frac{y^{2}}{9} = 1$。所以这个椭圆的面积是 $\\pi \\cdot 5 \\cdot 3 = 15\\pi$。

检验：$15\\pi$ 介于半径为 $3$ 的圆的面积 $9\\pi$ 和半径为 $5$ 的圆的面积 $25\\pi$ 之间，而椭圆正夹在这两个圆之间。

这节课我们由方程求椭圆的面积 $\\pi ab$，包括方程不是标准形式的情形，并由面积求未知的半轴。`,
  ),
  knowledgePoints: [
    {
      id: "calculating-the-area-of-an-ellipse",
      figure: precalculusDrawings3["the-area-of-an-ellipse#calculating-the-area-of-an-ellipse"],
      title: t("Calculating the area of an ellipse", "计算椭圆的面积"),
      explanation: t(
        "The area $A$ of an ellipse with semi-major axis $a$ and semi-minor axis $b$ is given by:\n\n$$A = \\pi a b$$\n\nWhen $a = b = r$, this simplifies to the area of a circle, $A = \\pi r^{2}$.\n\nThe formula comes from stretching the unit circle, of area $\\pi$, by $a$ in one direction and by $b$ in the other. For $\\frac{x^{2}}{49} + \\frac{y^{2}}{4} = 1$: $a = 7$, $b = 2$, and the area is $14\\pi$. Check: $4\\pi < 14\\pi < 49\\pi$, between the circles of radius $2$ and $7$.\n\n> **Watch out.** Use $a$ and $b$, the square roots of the denominators, not the denominators themselves. And there is no factor $2$: the formula uses the semi-axes.",
        "半长轴为 $a$、半短轴为 $b$ 的椭圆面积 $A$ 计算公式为：\n\n$$A = \\pi a b$$\n\n当 $a = b = r$ 时，该公式退化为圆的面积公式 $A = \\pi r^{2}$。\n\n这个公式来自把面积为 $\\pi$ 的单位圆在一个方向拉长 $a$ 倍、另一个方向拉长 $b$ 倍。对 $\\frac{x^{2}}{49} + \\frac{y^{2}}{4} = 1$：$a = 7$，$b = 2$，面积是 $14\\pi$。检验：$4\\pi < 14\\pi < 49\\pi$，介于半径 $2$ 和 $7$ 的圆之间。\n\n> **注意。** 用的是分母的平方根 $a$ 和 $b$，不是分母本身。而且没有因子 $2$：公式用的是半轴。",
      ),
      generate(rng) {
        const a = rng.int(3, 14);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const areaCoef = a * b;
        const prompt = t(
          `Find the exact area enclosed by the ellipse $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$.`,
          `求椭圆 $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ 所围成的精确面积。`,
        );
        const correct = `${areaCoef}\\pi`;
        const distractors = [`${2 * areaCoef}\\pi`, `${a + b}\\pi`, `${a2 * b2}\\pi`, `${a2 + b2}\\pi`];
        const solution = walked(
          [
            [
              ["Take square roots", "开平方"],
              t(`The semi-axes are the square roots of the denominators:`, `半轴是分母的平方根：`),
              [`a = \\sqrt{${a2}} = ${a}, \\quad b = \\sqrt{${b2}} = ${b}`],
            ],
            [
              ["Multiply", "相乘"],
              t(`Put them into $A = \\pi a b$:`, `代入 $A = \\pi a b$：`),
              [`A = \\pi (${a})(${b}) = ${areaCoef}\\pi`],
            ],
          ],
          t(
            `The ellipse lies between the circles of radius $${b}$ and $${a}$, and $${b2}\\pi < ${areaCoef}\\pi < ${a2}\\pi$.`,
            `椭圆夹在半径 $${b}$ 和 $${a}$ 的两个圆之间，而 $${b2}\\pi < ${areaCoef}\\pi < ${a2}\\pi$。`,
          ),
        );
        return makeChoice(rng, prompt, correct, distractors, solution, [
          why(
            distractors[0]!,
            "The area is $\\pi a b$, with no factor $2$: $a$ and $b$ are already the semi-axes.",
            "面积是 $\\pi a b$，没有因子 $2$：$a$ 和 $b$ 已经是半轴。",
          ),
          why(distractors[1]!, "This adds the semi-axes; the area multiplies them.", "这是把两条半轴相加；面积要把它们相乘。"),
          why(
            distractors[2]!,
            `This multiplies the denominators $${a2}$ and $${b2}$; use their square roots $${a}$ and $${b}$.`,
            `这是把分母 $${a2}$ 和 $${b2}$ 相乘；要用它们的平方根 $${a}$ 和 $${b}$。`,
          ),
          why(
            distractors[3]!,
            `This adds the denominators; the area is $\\pi \\cdot ${a} \\cdot ${b}$.`,
            `这是把分母相加；面积是 $\\pi \\cdot ${a} \\cdot ${b}$。`,
          ),
        ]);
      },
    },
    {
      id: "scaling-relation-and-missing-semi-axis",
      title: t("Scaling relation and finding a missing semi-axis", "面积伸缩关系与求未知半轴长"),
      figure: remainingDrawings7["the-area-of-an-ellipse#scaling-relation-and-missing-semi-axis"],
      explanation: t(
        "Because an ellipse is obtained by scaling a unit circle horizontally by $a$ and vertically by $b$, its area is $\\pi \\cdot a \\cdot b$.\n\nIf the area $A$ and one semi-axis $a$ are known, the other semi-axis is $b = \\frac{A}{\\pi a}$.\n\nIf the area is $24\\pi$ and $a = 6$, then $\\pi \\cdot 6 \\cdot b = 24\\pi$, so $b = \\frac{24}{6} = 4$. Check: $\\pi \\cdot 6 \\cdot 4 = 24\\pi$.\n\n> **Watch out.** Divide by both $\\pi$ and $a$: dividing by $\\pi$ alone leaves $ab = 24$, not $b$. The semi-minor axis must come out smaller than $a$.",
        "因为椭圆可以看作单位圆沿水平方向伸缩 $a$ 倍、竖直方向伸缩 $b$ 倍得到，所以其面积为 $\\pi \\cdot a \\cdot b$。\n\n已知面积 $A$ 和一个半轴长 $a$，可求得另一个半轴长 $b = \\frac{A}{\\pi a}$。\n\n若面积是 $24\\pi$，$a = 6$，则 $\\pi \\cdot 6 \\cdot b = 24\\pi$，所以 $b = \\frac{24}{6} = 4$。检验：$\\pi \\cdot 6 \\cdot 4 = 24\\pi$。\n\n> **注意。** 要同时除以 $\\pi$ 和 $a$：只除以 $\\pi$ 得到的是 $ab = 24$，不是 $b$。求出的半短轴必须小于 $a$。",
      ),
      generate(rng) {
        const a = rng.int(3, 12);
        const b = rng.int(2, a - 1);
        const areaCoef = a * b;
        return numberProblem({
          prompt: t(
            `The area of an ellipse is $${areaCoef}\\pi$. If the length of its semi-major axis is $a = ${a}$, what is the length of its semi-minor axis $b$?`,
            `已知一个椭圆的面积为 $${areaCoef}\\pi$。如果其半长轴长为 $a = ${a}$，那么半短轴长 $b$ 是多少？`,
          ),
          answer: b,
          wrong: [a, areaCoef, b + 1, Math.abs(a - b) || 1],
          solution: walked(
            [
              [
                ["Use the area formula", "用面积公式"],
                t(`Put the area and $a = ${a}$ into $A = \\pi a b$:`, `把面积和 $a = ${a}$ 代入 $A = \\pi a b$：`),
                [`${areaCoef}\\pi = \\pi (${a}) b`],
              ],
              [
                ["Divide by π and a", "除以 π 和 a"],
                t(`Divide both sides by $${a}\\pi$:`, `两边除以 $${a}\\pi$：`),
                [`b = \\frac{${areaCoef}}{${a}} = ${b}`],
              ],
            ],
            t(
              `$\\pi \\cdot ${a} \\cdot ${b} = ${areaCoef}\\pi$, the given area, and $b = ${b}$ is less than $a = ${a}$.`,
              `$\\pi \\cdot ${a} \\cdot ${b} = ${areaCoef}\\pi$，正是给定的面积，且 $b = ${b}$ 小于 $a = ${a}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ===========================================================================
// Module 7.27. Hyperbolas as Conic Sections (Topics 11 - 20)
// ===========================================================================

export const equationsOfHyperbolasCenteredAtTheOrigin: TopicDef = {
  id: "equations-of-hyperbolas-centered-at-the-origin",
  title: t("Equations of Hyperbolas Centered at the Origin", "中心在原点的双曲线标准方程"),
  summary: t(
    "Identify and write standard equations of hyperbolas centered at the origin, distinguishing horizontal and vertical orientations and applying the focal property $|d_1 - d_2| = 2a$.",
    "识别并写出中心在原点的双曲线标准方程，区分焦点在 x 轴或 y 轴上的情况，应用定义 |d1 - d2| = 2a。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "geometric-definition-of-a-hyperbola",
      title: t("Geometric definition of a hyperbola", "双曲线的几何定义"),
      explanation: t(
        "A hyperbola is the set of all points $P$ in a plane such that the absolute difference of the distances from $P$ to two fixed foci $F_{1}$ and $F_{2}$ is constant and equal to $2a$:\n\n$$|PF_{1} - PF_{2}| = 2a \\quad (0 < 2a < F_{1}F_{2})$$\n\nIf $PF_{1} = d_{1}$, then $PF_{2} = d_{1} + 2a$ or $PF_{2} = d_{1} - 2a$, and the second is possible only when it is positive.",
        "双曲线是平面内到两定点（焦点 $F_{1}, F_{2}$）的距离差的绝对值为定值 $2a$ 的点的集合：\n\n$$|PF_{1} - PF_{2}| = 2a \\quad (0 < 2a < F_{1}F_{2})$$\n\n若点 $P$ 到一个焦点的距离为 $d_{1}$，则到另一个焦点的距离为 $d_{1} + 2a$ 或 $d_{1} - 2a$，后者只有为正时才可能。",
      ),
      generate(rng) {
        const a = rng.int(3, 10);
        const twoA = 2 * a;
        const d1 = rng.int(1, twoA);
        const d2 = d1 + twoA;
        return numberProblem({
          prompt: t(
            `A hyperbola is defined such that the absolute difference of the distances from any point on it to the foci $F_{1}$ and $F_{2}$ is $${twoA}$. If a point $P$ on the hyperbola has $PF_{1} = ${d1}$, what is the distance $PF_{2} > 0$?`,
            `已知双曲线上任意一点到两焦点 $F_{1}, F_{2}$ 的距离之差的绝对值为 $${twoA}$。如果双曲线上某点 $P$ 到焦点 $F_{1}$ 的距离为 $PF_{1} = ${d1}$，求距离 $PF_{2} > 0$。`,
          ),
          answer: d2,
          wrong: [d1, Math.abs(d1 - a) || d1 + a + 1, twoA, d1 + a],
          solution: t(
            `By the definition $|PF_{1} - PF_{2}| = ${twoA}$ and $PF_{2} > 0$ (since $PF_{1} - ${twoA} = ${d1 - twoA} \\le 0$), we have $PF_{2} = PF_{1} + ${twoA} = ${d1} + ${twoA} = ${d2}$.`,
            `根据定义 $|PF_{1} - PF_{2}| = ${twoA}$ 且 $PF_{2} > 0$（因为 $PF_{1} - ${twoA} = ${d1 - twoA} \\le 0$），可知 $PF_{2} = PF_{1} + ${twoA} = ${d1} + ${twoA} = ${d2}$。`,
          ),
        });
      },
    },
    {
      id: "standard-equations-of-hyperbolas-at-origin",
      title: t("Standard equations of hyperbolas centered at the origin", "中心在原点的双曲线标准方程"),
      explanation: t(
        "For a hyperbola centered at the origin:\n\n- Horizontal (opens left/right, vertices at $(\\pm a, 0)$):\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$$\n\n- Vertical (opens up/down, vertices at $(0, \\pm a)$):\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$$\n\nThe positive term indicates the axis containing the vertices.",
        "中心在原点的双曲线标准方程：\n\n- 水平方向（开口朝左右，顶点为 $(\\pm a, 0)$）：\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$$\n\n- 竖直方向（开口朝上下，顶点为 $(0, \\pm a)$）：\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$$\n\n符号为正的项决定了顶点所在的坐标轴。",
      ),
      generate(rng) {
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const prompt = horizontal
          ? t(
              `Write the standard equation of the hyperbola centered at $(0, 0)$ with vertices at $(\\pm ${a}, 0)$ and $b = ${b}$.`,
              `写出中心在 $(0, 0)$、顶点为 $(\\pm ${a}, 0)$ 且 $b = ${b}$ 的双曲线标准方程。`,
            )
          : t(
              `Write the standard equation of the hyperbola centered at $(0, 0)$ with vertices at $(0, \\pm ${a})$ and $b = ${b}$.`,
              `写出中心在 $(0, 0)$、顶点为 $(0, \\pm ${a})$ 且 $b = ${b}$ 的双曲线标准方程。`,
            );
        const correct = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        return equationProblem({
          prompt,
          answer: correct,
          wrong: [
            horizontal ? `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1`,
            `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`,
            horizontal ? `\\frac{x^{2}}{${b2}} - \\frac{y^{2}}{${a2}} = 1` : `\\frac{y^{2}}{${b2}} - \\frac{x^{2}}{${a2}} = 1`,
          ],
          solution: t(
            `Since the vertices are on the $${horizontal ? "x" : "y"}$-axis, the positive term is $${horizontal ? "x^{2}" : "y^{2}"}$ with denominator $a^{2} = ${a2}$:${steps(
              correct,
            )}`,
            `因为顶点在 $${horizontal ? "x" : "y"}$ 轴上，所以正项是 $${horizontal ? "x^{2}" : "y^{2}"}$，分母为 $a^{2} = ${a2}$：${steps(
              correct,
            )}`,
          ),
        });
      },
    },
  ],
};

export const equationsOfHyperbolasCenteredAtAGeneralPoint: TopicDef = {
  id: "equations-of-hyperbolas-centered-at-a-general-point",
  title: t("Equations of Hyperbolas Centered at a General Point", "中心在任意点 (h, k) 的双曲线标准方程"),
  summary: t(
    "Write and analyze equations of translated hyperbolas with center $(h, k)$, identifying their centers and vertices.",
    "写出并分析中心在 $(h, k)$ 的平移双曲线标准方程，识别其中心和顶点坐标。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-hyperbolas-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "standard-form-with-center-h-k-hyperbola",
      figure: precalculusDrawings4["equations-of-hyperbolas-centered-at-a-general-point#standard-form-with-center-h-k-hyperbola"],
      title: t("Standard form of a translated hyperbola", "平移双曲线的标准方程"),
      explanation: t(
        "Moving the center from the origin to $(h, k)$ replaces $x$ by $x - h$ and $y$ by $y - k$. The positive term tells which way the hyperbola opens, and $a$ always goes with it.\n\nFor a hyperbola centered at $(h, k)$:\n\n- Horizontal transverse axis:\n$$\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$$\n\n- Vertical transverse axis:\n$$\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$$",
        "把中心从原点移到 $(h, k)$，就是把 $x$ 换成 $x - h$，把 $y$ 换成 $y - k$。正的那一项决定双曲线的开口方向，$a$ 总是与它对应。\n\n中心在 $(h, k)$ 的双曲线标准方程：\n\n- 实轴水平：\n$$\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$$\n\n- 实轴竖直：\n$$\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const correct = hyperbolaEq(h, k, a2, b2, horizontal);
        return equationProblem({
          prompt: t(
            `Write the equation of the hyperbola with center $(${h}, ${k})$, vertices at $(${horizontal ? `${h} \\pm ${a}, ${k}` : `${h}, ${k} \\pm ${a}`})$, and $b = ${b}$.`,
            `写出中心在 $(${h}, ${k})$，顶点为 $(${horizontal ? `${h} \\pm ${a}, ${k}` : `${h}, ${k} \\pm ${a}`})$ 且 $b = ${b}$ 的双曲线标准方程。`,
          ),
          answer: correct,
          wrong: [
            hyperbolaEq(-h, -k, a2, b2, horizontal),
            hyperbolaEq(h, k, a2, b2, !horizontal),
            ellipseEq(h, k, a2, b2, horizontal),
            hyperbolaEq(k, h, a2, b2, horizontal),
          ],
          solution: t(
            `Center is $(${h}, ${k})$, $a = ${a}$ ($a^{2} = ${a2}$), and $b = ${b}$ ($b^{2} = ${b2}$). Transverse axis is ${horizontal ? "horizontal" : "vertical"}:${steps(
              correct,
            )}`,
            `中心为 $(${h}, ${k})$，$a = ${a}$（$a^{2} = ${a2}$），$b = ${b}$（$b^{2} = ${b2}$）。实轴为${horizontal ? "水平" : "竖直"}方向：${steps(
              correct,
            )}`,
          ),
        });
      },
    },
    {
      id: "identifying-center-and-vertices-of-hyperbola",
      title: t("Identifying center and vertices of a hyperbola", "识别双曲线的中心与顶点"),
      explanation: t(
        "From the standard form of a hyperbola:\n\n- The center is $(h, k)$.\n- For a horizontal hyperbola, vertices are $(h \\pm a, k)$.\n- For a vertical hyperbola, vertices are $(h, k \\pm a)$.",
        "由双曲线的标准方程：\n\n- 中心为 $(h, k)$。\n- 水平双曲线的顶点为 $(h \\pm a, k)$。\n- 竖直双曲线的顶点为 $(h, k \\pm a)$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = hyperbolaEq(h, k, a2, b2, horizontal);
        const prompt = t(`Find the center and vertices of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的中心与顶点坐标。`);
        const v1 = horizontal ? `(${h - a}, ${k})` : `(${h}, ${k - a})`;
        const v2 = horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`;
        const correct = `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } ${v1}, ${v2}`;
        const distractors = [
          `\\text{Center: } (${-h}, ${-k}), \\; \\text{Vertices: } ${v1}, ${v2}`,
          horizontal
            ? `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } (${h}, ${k - a}), (${h}, ${k + a})`
            : `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } (${h - a}, ${k}), (${h + a}, ${k})`,
          `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } (${h - b}, ${k}), (${h + b}, ${k})`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$. The positive term has denominator $a^{2} = ${a2} \\implies a = ${a}$. Moving $a$ units along the ${horizontal ? "horizontal" : "vertical"} axis gives vertices $${v1}$ and $${v2}$.`,
          `中心为 $(${h}, ${k})$。正项的分母为 $a^{2} = ${a2} \\implies a = ${a}$。沿${horizontal ? "水平" : "竖直"}轴方向移动 $a$ 个单位得到顶点 $${v1}$ 和 $${v2}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const asymptotesOfHyperbolasCenteredAtTheOrigin: TopicDef = {
  id: "asymptotes-of-hyperbolas-centered-at-the-origin",
  title: t("Asymptotes of Hyperbolas Centered at the Origin", "中心在原点的双曲线渐近线方程"),
  summary: t(
    "Find the equations of the asymptotes of a hyperbola centered at the origin ($y = \\pm \\frac{b}{a} x$ or $y = \\pm \\frac{a}{b} x$).",
    "求中心在原点的双曲线渐近线方程（y = ±b/a x 或 y = ±a/b x）。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-hyperbolas-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "asymptotes-of-horizontal-hyperbolas",
      figure: precalculusDrawings3["asymptotes-of-hyperbolas-centered-at-the-origin#asymptotes-of-horizontal-hyperbolas"],
      title: t("Asymptotes of horizontal hyperbolas", "水平双曲线的渐近线方程"),
      explanation: t(
        "Far from the center, a hyperbola gets closer and closer to two lines through its center, and these asymptotes come from replacing the constant one by zero. For the horizontal hyperbola $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$, setting the right side to $0$ gives:\n\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{b}{a}x$$",
        "离中心越远，双曲线越接近两条过中心的直线；把方程中的常数 1 换成 0 就得到这两条渐近线。对于水平双曲线 $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$，将等式右边置为 $0$：\n\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{b}{a}x$$",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(b, a);
        const prompt = t(
          `Find the equations of the asymptotes of the hyperbola $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$.`,
          `求双曲线 $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ 的渐近线方程。`,
        );
        const slopeLatex = slope.isInteger() ? `${slope.abs().toLatex()}` : slope.abs().toLatex();
        const correct = `y = \\pm ${co(slopeLatex)}x`;
        const distractors = [
          `y = \\pm ${co(Q.of(a, b).toLatex())}x`,
          `y = \\pm ${co(Q.of(b2, a2).toLatex())}x`,
          `y = \\pm ${co(Q.of(a2, b2).toLatex())}x`,
          `x = \\pm ${co(slopeLatex)}y`,
        ];
        const solution = t(
          `For a horizontal hyperbola, the asymptotes are $y = \\pm \\frac{b}{a}x$. Here $a = ${a}$ and $b = ${b}$:${steps(
            `y = \\pm \\frac{${b}}{${a}}x = \\pm ${co(slopeLatex)}x`,
          )}`,
          `对于水平双曲线，渐近线为 $y = \\pm \\frac{b}{a}x$。此处 $a = ${a}, b = ${b}$：${steps(
            `y = \\pm \\frac{${b}}{${a}}x = \\pm ${co(slopeLatex)}x`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "asymptotes-of-vertical-hyperbolas",
      figure: precalculusDrawings3["asymptotes-of-hyperbolas-centered-at-the-origin#asymptotes-of-vertical-hyperbolas"],
      title: t("Asymptotes of vertical hyperbolas", "竖直双曲线的渐近线方程"),
      explanation: t(
        "When the term with the vertical variable is positive, the hyperbola opens up and down, and its asymptotes still come from replacing the constant one by zero. For the vertical hyperbola $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$, setting the right side to $0$ gives:\n\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{a}{b}x$$",
        "当含纵坐标变量的项为正时，双曲线向上下开口，它的渐近线仍由把常数 1 换成 0 得到。对于竖直双曲线 $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$，将等式右边置为 $0$：\n\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{a}{b}x$$",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(a, b);
        const prompt = t(
          `Find the equations of the asymptotes of the hyperbola $\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1$.`,
          `求双曲线 $\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1$ 的渐近线方程。`,
        );
        const slopeLatex = slope.isInteger() ? `${slope.abs().toLatex()}` : slope.abs().toLatex();
        const correct = `y = \\pm ${co(slopeLatex)}x`;
        const distractors = [
          `y = \\pm ${co(Q.of(b, a).toLatex())}x`,
          `y = \\pm ${co(Q.of(a2, b2).toLatex())}x`,
          `y = \\pm ${co(Q.of(b2, a2).toLatex())}x`,
          `x = \\pm ${co(slopeLatex)}y`,
        ];
        const solution = t(
          `For a vertical hyperbola, the asymptotes are $y = \\pm \\frac{a}{b}x$. Here $a = ${a}$ and $b = ${b}$:${steps(
            `y = \\pm \\frac{${a}}{${b}}x = \\pm ${co(slopeLatex)}x`,
          )}`,
          `对于竖直双曲线，渐近线为 $y = \\pm \\frac{a}{b}x$。此处 $a = ${a}, b = ${b}$：${steps(
            `y = \\pm \\frac{${a}}{${b}}x = \\pm ${co(slopeLatex)}x`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const asymptotesOfHyperbolasCenteredAtAGeneralPoint: TopicDef = {
  id: "asymptotes-of-hyperbolas-centered-at-a-general-point",
  title: t("Asymptotes of Hyperbolas Centered at a General Point", "中心在任意点的双曲线渐近线方程"),
  summary: t(
    "Find the equations of the asymptotes of a translated hyperbola using the point-slope form $y - k = \\pm \\frac{b}{a} (x - h)$ or $y - k = \\pm \\frac{a}{b} (x - h)$.",
    "利用点斜式 y - k = ±b/a (x - h) 或 y - k = ±a/b (x - h) 求中心在任意点的双曲线渐近线方程。",
  ),
  prerequisites: ["asymptotes-of-hyperbolas-centered-at-the-origin", "equations-of-hyperbolas-centered-at-a-general-point"],
  encompasses: [{ topic: "asymptotes-of-hyperbolas-centered-at-the-origin", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "asymptotes-of-translated-horizontal-hyperbolas",
      figure: precalculusDrawings3["asymptotes-of-hyperbolas-centered-at-a-general-point#asymptotes-of-translated-horizontal-hyperbolas"],
      title: t("Asymptotes of translated horizontal hyperbolas", "平移水平双曲线的渐近线"),
      explanation: t(
        "Translating a hyperbola moves its asymptotes with it, so they become lines through the new center with the same slopes as before. For $\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$, the asymptotes pass through the center $(h, k)$ with slopes $\\pm \\frac{b}{a}$:\n\n$$y - k = \\pm \\frac{b}{a}(x - h)$$",
        "平移双曲线时，它的渐近线也随之移动，变成经过新中心、斜率不变的直线。对于 $\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$，渐近线穿过中心 $(h, k)$，斜率为 $\\pm \\frac{b}{a}$：\n\n$$y - k = \\pm \\frac{b}{a}(x - h)$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(b, a).toLatex();
        const eqStr = `\\frac{${sqTerm("x", h)}}{${a2}} - \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
        const prompt = t(`Find the equations of the asymptotes of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的渐近线方程。`);
        const yPart = linTerm("y", k);
        const xPart = linTerm("x", h);
        const correct = `${yPart} = \\pm ${slope}${xPart}`;
        const distractors = [
          `${linTerm("y", -k)} = \\pm ${slope}${linTerm("x", -h)}`,
          `${yPart} = \\pm ${Q.of(a, b).toLatex()}${xPart}`,
          `${xPart} = \\pm ${slope}${yPart}`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$. For a horizontal hyperbola, the asymptotes have slope $\\pm \\frac{b}{a} = \\pm \\frac{${b}}{${a}} = \\pm ${slope}$:${steps(
            correct,
          )}`,
          `中心为 $(${h}, ${k})$。水平双曲线的渐近线斜率为 $\\pm \\frac{b}{a} = \\pm \\frac{${b}}{${a}} = \\pm ${slope}$：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "asymptotes-of-translated-vertical-hyperbolas",
      figure: precalculusDrawings4["asymptotes-of-hyperbolas-centered-at-a-general-point#asymptotes-of-translated-vertical-hyperbolas"],
      title: t("Asymptotes of translated vertical hyperbolas", "平移竖直双曲线的渐近线"),
      explanation: t(
        "For a hyperbola that opens up and down, the slopes of the asymptotes are the square root under the positive term divided by the other one. For $\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$, the asymptotes pass through the center $(h, k)$ with slopes $\\pm \\frac{a}{b}$:\n\n$$y - k = \\pm \\frac{a}{b}(x - h)$$",
        "对于开口向上下的双曲线，渐近线的斜率等于正项下的平方根除以另一项下的平方根。对于 $\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$，渐近线穿过中心 $(h, k)$，斜率为 $\\pm \\frac{a}{b}$：\n\n$$y - k = \\pm \\frac{a}{b}(x - h)$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(a, b).toLatex();
        const eqStr = `\\frac{${sqTerm("y", k)}}{${a2}} - \\frac{${sqTerm("x", h)}}{${b2}} = 1`;
        const prompt = t(`Find the equations of the asymptotes of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的渐近线方程。`);
        const yPart = linTerm("y", k);
        const xPart = linTerm("x", h);
        const correct = `${yPart} = \\pm ${slope}${xPart}`;
        const distractors = [
          `${linTerm("y", -k)} = \\pm ${slope}${linTerm("x", -h)}`,
          `${yPart} = \\pm ${Q.of(b, a).toLatex()}${xPart}`,
          `${xPart} = \\pm ${slope}${yPart}`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$. For a vertical hyperbola, the asymptotes have slope $\\pm \\frac{a}{b} = \\pm \\frac{${a}}{${b}} = \\pm ${slope}$:${steps(
            correct,
          )}`,
          `中心为 $(${h}, ${k})$。竖直双曲线的渐近线斜率为 $\\pm \\frac{a}{b} = \\pm \\frac{${a}}{${b}} = \\pm ${slope}$：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const findingInterceptsAndIntersectionsOfHyperbolas: TopicDef = {
  id: "finding-intercepts-and-intersections-of-hyperbolas",
  title: t("Finding Intercepts and Intersections of Hyperbolas", "双曲线的截距与直线交点"),
  summary: t(
    "Find coordinate intercepts of hyperbolas and determine points of intersection with lines.",
    "求解双曲线在坐标轴上的截距，并确定双曲线与直线的交点坐标。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-a-general-point"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "intercepts-of-a-hyperbola",
      title: t("Intercepts of a hyperbola with the coordinate axes", "双曲线与坐标轴的截距"),
      explanation: t(
        "For $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$:\n- Setting $y = 0$ gives $x^{2} = a^{2} \\implies x = \\pm a$ ($x$-intercepts at $(\\pm a, 0)$).\n- Setting $x = 0$ gives $-\\frac{y^{2}}{b^{2}} = 1$, which has no real solutions (no $y$-intercepts).\n\nSimilarly, a vertical hyperbola $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$ has $y$-intercepts at $(0, \\pm a)$ and no $x$-intercepts.",
        "对于水平双曲线 $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$：\n- 令 $y = 0$ 得 $x^{2} = a^{2} \\implies x = \\pm a$（$x$ 轴截距为 $(\\pm a, 0)$）。\n- 令 $x = 0$ 得 $-\\frac{y^{2}}{b^{2}} = 1$，无实数解（无 $y$ 轴截距）。\n\n同理，竖直双曲线有 $y$ 轴截距 $(0, \\pm a)$，无 $x$ 轴截距。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(
          `Determine all $x$-intercepts and $y$-intercepts of the hyperbola $${eqStr}$.`,
          `确定双曲线 $${eqStr}$ 的所有坐标轴截距点。`,
        );
        const correct = horizontal
          ? t(`$x$-intercepts at $(pm ${a}, 0)$; no $y$-intercepts`, `$x$ 轴截距为 $(pm ${a}, 0)$；无 $y$ 轴截距`)
          : t(`$y$-intercepts at $(0, pm ${a})$; no $x$-intercepts`, `$y$ 轴截距为 $(0, pm ${a})$；无 $x$ 轴截距`);
        const distractors = [
          horizontal
            ? t(`$y$-intercepts at $(0, pm ${b})$; no $x$-intercepts`, `$y$ 轴截距为 $(0, pm ${b})$；无 $x$ 轴截距`)
            : t(`$x$-intercepts at $(pm ${b}, 0)$; no $y$-intercepts`, `$x$ 轴截距为 $(pm ${b}, 0)$；无 $y$ 轴截距`),
          horizontal
            ? t(
                `$x$-intercepts at $(pm ${a}, 0)$ and $y$-intercepts at $(0, pm ${b})$`,
                `$x$ 轴截距为 $(pm ${a}, 0)$，$y$ 轴截距为 $(0, pm ${b})$`,
              )
            : t(
                `$y$-intercepts at $(0, pm ${a})$ and $x$-intercepts at $(pm ${b}, 0)$`,
                `$y$ 轴截距为 $(0, pm ${a})$，$x$ 轴截距为 $(pm ${b}, 0)$`,
              ),
          t("No intercepts on either axis", "与两条坐标轴均无交点"),
        ];
        const solution = t(
          `For $${eqStr}$, the positive term yields real intercepts on the $${horizontal ? "x" : "y"}$-axis at $${horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`}$. Setting the other variable to $0$ gives no real solutions.`,
          `对于 $${eqStr}$，正项变量在 $${horizontal ? "x" : "y"}$ 轴上产生实数截距 $${horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`}$，而令另一变量为 $0$ 时无实数解。`,
        );
        return makeChoiceTexts(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "intersections-with-lines",
      title: t("Intersections of a hyperbola with lines", "双曲线与直线的交点"),
      explanation: t(
        "To find the intersection points of a hyperbola with a line, substitute the linear relationship into the hyperbola equation and solve the resulting quadratic equation.",
        "求解双曲线与直线的交点，将直线的代数式代入双曲线方程，解所得的一元二次方程。",
      ),
      generate(rng) {
        // Horizontal hyperbola x^2/a^2 - y^2/b^2 = 1 with line y = d
        // 1 + d^2/b^2 = (m/n)^2 using Pythagorean triple [b, d, m] => m^2 = b^2 + d^2
        const triple = rng.pick(pythTriples);
        const [b, d, m] = triple;
        const aMult = rng.int(1, 3);
        const a = aMult * b;
        const xVal = aMult * m;
        const a2 = a * a;
        const b2 = b * b;
        const prompt = t(
          `Find the coordinates of the intersection points of the hyperbola $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ and the horizontal line $y = ${d}$.`,
          `求双曲线 $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ 与水平直线 $y = ${d}$ 的交点坐标。`,
        );
        const correct = `(\\pm ${xVal}, ${d})`;
        const distractors = [`(${d}, \\pm ${xVal})`, `(\\pm ${a}, ${d})`, `(\\pm ${xVal}, 0)`, `(\\pm ${m}, ${d})`];
        const solution = t(
          `Substitute $y = ${d}$ into the hyperbola equation:${steps(
            `\\frac{x^{2}}{${a2}} - \\frac{${d * d}}{${b2}} = 1 \\implies \\frac{x^{2}}{${a2}} = 1 + \\frac{${d * d}}{${b2}} = \\frac{${m * m}}{${b2}}`,
            `x^{2} = ${a2} \\times \\frac{${m * m}}{${b2}} = ${xVal * xVal} \\implies x = \\pm ${xVal}`,
            `\\text{Points: } (\\pm ${xVal}, ${d})`,
          )}`,
          `将 $y = ${d}$ 代入双曲线方程：${steps(
            `\\frac{x^{2}}{${a2}} - \\frac{${d * d}}{${b2}} = 1 \\implies \\frac{x^{2}}{${a2}} = 1 + \\frac{${d * d}}{${b2}} = \\frac{${m * m}}{${b2}}`,
            `x^{2} = ${a2} \\times \\frac{${m * m}}{${b2}} = ${xVal * xVal} \\implies x = \\pm ${xVal}`,
            `\\text{交点坐标：} (\\pm ${xVal}, ${d})`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const transverseAxesOfHyperbolas: TopicDef = {
  id: "transverse-axes-of-hyperbolas",
  title: t("Transverse Axes of Hyperbolas", "双曲线的实轴"),
  summary: t(
    "Determine the orientation and length $2a$ of the transverse axis connecting the vertices of a hyperbola.",
    "确定连接双曲线两顶点的实轴方向与实轴长 2a。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-hyperbolas-centered-at-the-origin", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "length-of-the-transverse-axis",
      title: t("Length of the transverse axis", "实轴的长度"),
      explanation: t(
        "The segment joining the two vertices is the transverse axis of the hyperbola. Its length is $2a$, where $a$ is the semi-transverse axis:\n\n$$\\text{Transverse axis length} = 2a$$",
        "连接双曲线两个顶点的线段称为实轴。其实轴长度为 $2a$，其中 $a$ 为半实轴长：\n\n$$\\text{实轴长} = 2a$$",
      ),
      generate(rng) {
        const a = rng.int(2, 14);
        const b = rng.int(2, 14);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        return numberProblem({
          prompt: t(`What is the length of the transverse axis of the hyperbola $${eqStr}$?`, `双曲线 $${eqStr}$ 的实轴长度是多少？`),
          answer: 2 * a,
          wrong: [a, 2 * b, b, a2],
          solution: t(
            `The positive term denominator is $a^{2} = ${a2} \\implies a = ${a}$. The length of the transverse axis is $2a = 2(${a}) = ${2 * a}$.`,
            `正项的分母为 $a^{2} = ${a2} \\implies a = ${a}$。实轴长度为 $2a = 2(${a}) = ${2 * a}$。`,
          ),
        });
      },
    },
    {
      id: "endpoints-of-the-transverse-axis",
      title: t("Endpoints of the transverse axis", "实轴的端点坐标"),
      explanation: t(
        "The endpoints of the transverse axis are the vertices of the hyperbola:\n\n- Horizontal hyperbola centered at $(h, k)$: $(h \\pm a, k)$\n- Vertical hyperbola centered at $(h, k)$: $(h, k \\pm a)$",
        "实轴的端点即为双曲线的顶点：\n\n- 中心在 $(h, k)$ 的水平双曲线：$(h \\pm a, k)$\n- 中心在 $(h, k)$ 的竖直双曲线：$(h, k \\pm a)$",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(3, 10);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = hyperbolaEq(h, k, a2, b2, horizontal);
        const prompt = t(
          `Find the endpoints of the transverse axis for the hyperbola $${eqStr}$.`,
          `求双曲线 $${eqStr}$ 实轴的两端点坐标。`,
        );
        const v1 = horizontal ? `(${h - a}, ${k})` : `(${h}, ${k - a})`;
        const v2 = horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`;
        const correct = `${v1} \\text{ and } ${v2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})` : `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})`,
          horizontal ? `(${h - b}, ${k}) \\text{ and } (${h + b}, ${k})` : `(${h}, ${k - b}) \\text{ and } (${h}, ${k + b})`,
          `(${h}, ${k})`,
        ];
        const solution = t(
          `The transverse axis connects the vertices. Center is $(${h}, ${k})$ and $a = \\sqrt{${a2}} = ${a}$. Along the ${horizontal ? "horizontal" : "vertical"} axis:${steps(
            correct,
          )}`,
          `实轴连接两顶点。中心为 $(${h}, ${k})$，半实轴长 $a = \\sqrt{${a2}} = ${a}$。沿${horizontal ? "水平" : "竖直"}方向移动得：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const conjugateAxesOfHyperbolas: TopicDef = {
  id: "conjugate-axes-of-hyperbolas",
  title: t("Conjugate Axes of Hyperbolas", "双曲线的虚轴"),
  summary: t(
    "Identify the conjugate axis of length $2b$ and the central fundamental rectangle of dimensions $2a \\times 2b$.",
    "识别双曲线长为 2b 的虚轴以及尺寸为 2a × 2b 的中心基本矩形。",
  ),
  prerequisites: ["transverse-axes-of-hyperbolas"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "length-of-the-conjugate-axis",
      figure: precalculusDrawings4["conjugate-axes-of-hyperbolas#length-of-the-conjugate-axis"],
      title: t("Length of the conjugate axis", "虚轴的长度"),
      explanation: t(
        "The segment perpendicular to the transverse axis at the center of length $2b$ is called the conjugate axis of the hyperbola:\n\n$$\\text{Conjugate axis length} = 2b$$",
        "在中心处垂直于实轴、长度为 $2b$ 的线段称为双曲线的虚轴：\n\n$$\\text{虚轴长} = 2b$$",
      ),
      generate(rng) {
        const a = rng.int(2, 14);
        const b = rng.int(2, 14);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        return numberProblem({
          prompt: t(`What is the length of the conjugate axis of the hyperbola $${eqStr}$?`, `双曲线 $${eqStr}$ 的虚轴长度是多少？`),
          answer: 2 * b,
          wrong: [b, 2 * a, a, b2],
          solution: t(
            `The negative term denominator is $b^{2} = ${b2} \\implies b = ${b}$. The length of the conjugate axis is $2b = 2(${b}) = ${2 * b}$.`,
            `负项的分母为 $b^{2} = ${b2} \\implies b = ${b}$。虚轴长为 $2b = 2(${b}) = ${2 * b}$。`,
          ),
        });
      },
    },
    {
      id: "central-fundamental-rectangle",
      figure: precalculusDrawings3["conjugate-axes-of-hyperbolas#central-fundamental-rectangle"],
      title: t("The central fundamental rectangle", "双曲线的中心基本矩形"),
      explanation: t(
        "The central rectangle of a hyperbola has side lengths $2a$ (along the transverse axis) and $2b$ (along the conjugate axis). Its diagonals extended are the asymptotes of the hyperbola, and its area is $(2a)(2b) = 4ab$.",
        "双曲线的中心基本矩形边长分别为 $2a$（沿实轴方向）和 $2b$（沿虚轴方向）。其对角线延伸即为双曲线的渐近线，其面积为 $(2a)(2b) = 4ab$。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const areaRect = 4 * a * b;
        return numberProblem({
          prompt: t(
            `Find the area of the central fundamental rectangle for the hyperbola $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$.`,
            `求双曲线 $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ 的中心基本矩形的面积。`,
          ),
          answer: areaRect,
          wrong: [a * b, 2 * a * b, 2 * (a + b), 4 * (a + b)],
          solution: t(
            `The dimensions of the central rectangle are $2a = 2(${a}) = ${2 * a}$ and $2b = 2(${b}) = ${2 * b}$. Its area is:${steps(
              `\\text{Area} = (2a)(2b) = (${2 * a})(${2 * b}) = ${areaRect}`,
            )}`,
            `中心矩形的两边长分别为 $2a = 2(${a}) = ${2 * a}$ 和 $2b = 2(${b}) = ${2 * b}$。其面积为：${steps(
              `\\text{面积} = (2a)(2b) = (${2 * a})(${2 * b}) = ${areaRect}`,
            )}`,
          ),
        });
      },
    },
  ],
};

export const fociOfHyperbolas: TopicDef = {
  id: "foci-of-hyperbolas",
  title: t("Foci of Hyperbolas", "双曲线的焦点坐标与焦距"),
  summary: t(
    "Use $c^2 = a^2 + b^2$ to find the focal distance and coordinates of the foci of a hyperbola.",
    "利用 c² = a² + b² 计算双曲线的焦距和焦点坐标。",
  ),
  prerequisites: ["transverse-axes-of-hyperbolas"],
  encompasses: [{ topic: "transverse-axes-of-hyperbolas", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "foci-of-hyperbolas-at-origin",
      title: t("Foci of a hyperbola centered at the origin", "中心在原点的双曲线焦点"),
      explanation: t(
        "For any hyperbola, the focal distance $c$ from the center to each focus satisfies:\n\n$$c^{2} = a^{2} + b^{2} \\implies c = \\sqrt{a^{2} + b^{2}}$$\n\n- Horizontal hyperbola: foci at $(\\pm c, 0)$\n- Vertical hyperbola: foci at $(0, \\pm c)$",
        "对任意双曲线，中心到各焦点的半焦距 $c$ 满足：\n\n$$c^{2} = a^{2} + b^{2} \\implies c = \\sqrt{a^{2} + b^{2}}$$\n\n- 水平双曲线：焦点为 $(\\pm c, 0)$\n- 竖直双曲线：焦点为 $(0, \\pm c)$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(`Find the coordinates of the foci of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的焦点坐标。`);
        const correct = horizontal ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`;
        const distractors = [
          horizontal ? `(0, \\pm ${c})` : `(\\pm ${c}, 0)`,
          horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`,
          horizontal ? `(0, \\pm ${b})` : `(\\pm ${b}, 0)`,
          `(\\pm ${a + b}, 0)`,
        ];
        const solution = t(
          `Using $c^{2} = a^{2} + b^{2} = ${a2} + ${b2} = ${c * c} \\implies c = ${c}$. Since the hyperbola is ${horizontal ? "horizontal" : "vertical"}, the foci are $${correct}$.`,
          `根据 $c^{2} = a^{2} + b^{2} = ${a2} + ${b2} = ${c * c} \\implies c = ${c}$。因为双曲线为${horizontal ? "水平" : "竖直"}方向，所以焦点坐标为 $${correct}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "foci-of-translated-hyperbolas",
      figure: precalculusDrawings4["foci-of-hyperbolas#foci-of-translated-hyperbolas"],
      title: t("Foci of a translated hyperbola", "平移双曲线的焦点坐标"),
      explanation: t(
        "For a hyperbola with center $(h, k)$ and focal distance $c = \\sqrt{a^{2} + b^{2}}$:\n\n- Horizontal hyperbola: foci at $(h \\pm c, k)$\n- Vertical hyperbola: foci at $(h, k \\pm c)$",
        "对于中心在 $(h, k)$、半焦距为 $c = \\sqrt{a^{2} + b^{2}}$ 的双曲线：\n\n- 水平双曲线：焦点为 $(h \\pm c, k)$\n- 竖直双曲线：焦点为 $(h, k \\pm c)$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const horizontal = rng.bool();
        const eqStr = hyperbolaEq(h, k, a2, b2, horizontal);
        const prompt = t(`Find the coordinates of the foci of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的焦点坐标。`);
        const f1 = horizontal ? `(${h - c}, ${k})` : `(${h}, ${k - c})`;
        const f2 = horizontal ? `(${h + c}, ${k})` : `(${h}, ${k + c})`;
        const correct = `${f1} \\text{ and } ${f2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - c}) \\text{ and } (${h}, ${k + c})` : `(${h - c}, ${k}) \\text{ and } (${h + c}, ${k})`,
          horizontal ? `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})` : `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})`,
          `(${h}, ${k})`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$ and $c = \\sqrt{${a2} + ${b2}} = ${c}$. Adding $\\pm ${c}$ along the ${horizontal ? "x" : "y"}-coordinate gives:${steps(
            correct,
          )}`,
          `中心为 $(${h}, ${k})$，半焦距 $c = \\sqrt{${a2} + ${b2}} = ${c}$。沿 ${horizontal ? "x" : "y"} 轴方向偏移 $\\pm ${c}$ 得：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const eccentricityAndVerticesOfHyperbolas: TopicDef = {
  id: "eccentricity-and-vertices-of-hyperbolas",
  title: t("Eccentricity and Vertices of Hyperbolas", "双曲线的离心率与顶点"),
  summary: t(
    "Calculate the eccentricity $e = c/a > 1$ of a hyperbola, and explore the properties of equilateral (rectangular) hyperbolas.",
    "计算双曲线的离心率 e = c/a > 1，并探讨等轴双曲线（a = b ⇒ e = √2）的性质。",
  ),
  prerequisites: ["foci-of-hyperbolas"],
  encompasses: [{ topic: "foci-of-hyperbolas", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "calculating-hyperbola-eccentricity",
      title: t("Calculating the eccentricity of a hyperbola", "计算双曲线的离心率"),
      explanation: t(
        "The eccentricity $e$ of a hyperbola is defined as:\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} + b^{2}}}{a}$$\n\nBecause $c > a > 0$, the eccentricity of every hyperbola is strictly greater than $1$ ($e > 1$).",
        "双曲线的离心率 $e$ 定义为：\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} + b^{2}}}{a}$$\n\n因为 $c > a > 0$，所以任意双曲线的离心率恒严格大于 $1$（$e > 1$）。",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const mult = rng.int(1, 3);
        const A = a * mult;
        const B = b * mult;
        const C = c * mult;
        const a2 = A * A;
        const b2 = B * B;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const eFrac = Q.of(C, A);
        return numberProblem({
          prompt: t(`Calculate the eccentricity of the hyperbola $${eqStr}$.`, `计算双曲线 $${eqStr}$ 的离心率。`),
          answer: eFrac,
          wrong: [Q.of(A, C), Q.of(B, A), Q.of(C, B), 1],
          solution: t(
            `Here $a = ${A}, b = ${B}$. First find $c = \\sqrt{${a2} + ${b2}} = ${C}$. Then:${steps(
              `e = \\frac{c}{a} = \\frac{${C}}{${A}} = ${eFrac.toLatex()}`,
            )}`,
            `此处 $a = ${A}, b = ${B}$。先求半焦距 $c = \\sqrt{${a2} + ${b2}} = ${C}$。然后求离心率：${steps(
              `e = \\frac{c}{a} = \\frac{${C}}{${A}} = ${eFrac.toLatex()}`,
            )}`,
          ),
        });
      },
    },
    {
      id: "equilateral-rectangular-hyperbolas",
      figure: precalculusDrawings3["eccentricity-and-vertices-of-hyperbolas#equilateral-rectangular-hyperbolas"],
      title: t("Rectangular (equilateral) hyperbolas", "等轴双曲线"),
      explanation: t(
        "When $a = b$, the hyperbola is called rectangular (or equilateral):\n\n- The asymptotes $y = \\pm \\frac{a}{a}x = \\pm x$ are perpendicular ($90^{\\circ}$ angle).\n- The eccentricity is constant for all rectangular hyperbolas:\n$$e = \\frac{\\sqrt{a^{2} + a^{2}}}{a} = \\frac{a\\sqrt{2}}{a} = \\sqrt{2}$$",
        "当 $a = b$ 时，双曲线被称为等轴双曲线（或直角双曲线）：\n\n- 渐近线 $y = \\pm \\frac{a}{a}x = \\pm x$ 互相垂直（夹角为 $90^{\\circ}$）。\n- 所有等轴双曲线的离心率均为常数：\n$$e = \\frac{\\sqrt{a^{2} + a^{2}}}{a} = \\frac{a\\sqrt{2}}{a} = \\sqrt{2}$$",
      ),
      generate(rng) {
        const a = rng.int(2, 25);
        const a2 = a * a;
        const form = rng.pick(["standard-x", "standard-y", "cleared-x", "cleared-y"]);
        let eqStr = "";
        if (form === "standard-x") eqStr = `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${a2}} = 1`;
        else if (form === "standard-y") eqStr = `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${a2}} = 1`;
        else if (form === "cleared-x") eqStr = `x^{2} - y^{2} = ${a2}`;
        else eqStr = `y^{2} - x^{2} = ${a2}`;

        return radicalProblem({
          prompt: t(`What is the eccentricity of the equilateral hyperbola $${eqStr}$?`, `等轴双曲线 $${eqStr}$ 的离心率是多少？`),
          answer: [1, 2],
          wrong: ["2", "\\frac{\\sqrt{2}}{2}", "1", "\\sqrt{3}"],
          solution: t(
            `For an equilateral hyperbola, $a = b = ${a}$. The focal distance is $c = \\sqrt{${a2} + ${a2}} = ${a}\\sqrt{2}$. The eccentricity is always:${steps(
              `e = \\frac{c}{a} = \\frac{${a}\\sqrt{2}}{${a}} = \\sqrt{2}`,
            )}`,
            `对于等轴双曲线，$a = b = ${a}$。焦距 $c = \\sqrt{${a2} + ${a2}} = ${a}\\sqrt{2}$。离心率恒为：${steps(
              `e = \\frac{c}{a} = \\frac{${a}\\sqrt{2}}{${a}} = \\sqrt{2}`,
            )}`,
          ),
        });
      },
    },
  ],
};

export const directricesOfHyperbolas: TopicDef = {
  id: "directrices-of-hyperbolas",
  title: t("Directrices of Hyperbolas", "双曲线的准线方程"),
  summary: t(
    "Find the equations of the directrices of a hyperbola ($x = \\pm a^2/c$ or $y = \\pm a^2/c$) and apply the focus-directrix property.",
    "求解双曲线的准线方程（x = ±a²/c 或 y = ±a²/c），应用焦点-准线性质。",
  ),
  prerequisites: ["eccentricity-and-vertices-of-hyperbolas"],
  encompasses: [{ topic: "eccentricity-and-vertices-of-hyperbolas", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "equations-of-hyperbola-directrices",
      title: t("Equations of hyperbola directrices", "双曲线的准线方程"),
      explanation: t(
        "A hyperbola centered at the origin has two directrices between the center and the vertices:\n\n- Horizontal hyperbola: $x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- Vertical hyperbola: $y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$",
        "中心在原点的双曲线有两条位于中心与顶点之间的准线：\n\n- 水平双曲线：$x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- 竖直双曲线：$y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(`Find the equations of the directrices of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的准线方程。`);
        const valStr = pmFrac(a2, c);
        const correct = `${horizontal ? "x" : "y"} = ${valStr}`;
        const distractors = [
          `${horizontal ? "y" : "x"} = ${valStr}`,
          `${horizontal ? "x" : "y"} = ${pmFrac(b2, c)}`,
          `${horizontal ? "x" : "y"} = ${pmFrac(c * c, a)}`,
        ];
        const solution = t(
          `Here $a = ${a}, a^{2} = ${a2}, c = \\sqrt{${a2} + ${b2}} = ${c}$. The directrices are:${steps(
            `${horizontal ? "x" : "y"} = \\pm \\frac{a^{2}}{c} = ${valStr}`,
          )}`,
          `此处 $a = ${a}, a^{2} = ${a2}, c = \\sqrt{${a2} + ${b2}} = ${c}$。准线方程为：${steps(
            `${horizontal ? "x" : "y"} = \\pm \\frac{a^{2}}{c} = ${valStr}`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "focus-directrix-ratio-hyperbola",
      title: t("The focus-directrix property of a hyperbola", "双曲线的焦点-准线性质"),
      explanation: t(
        "For any point $P$ on a hyperbola, the ratio of its distance to a focus $F$ to its distance to the corresponding directrix $\\ell$ is constant and equals the eccentricity $e > 1$:\n\n$$\\frac{PF}{d(P, \\ell)} = e > 1 \\implies PF = e \\cdot d(P, \\ell)$$",
        "对于双曲线上任意一点 $P$，其到焦点 $F$ 的距离与到对应准线 $\\ell$ 的距离之比为常数，且等于离心率 $e > 1$：\n\n$$\\frac{PF}{d(P, \\ell)} = e > 1 \\implies PF = e \\cdot d(P, \\ell)$$",
      ),
      generate(rng) {
        const eNumerator = rng.pick([5, 13, 17, 25]);
        const eDenominator =
          eNumerator === 5
            ? rng.pick([3, 4])
            : eNumerator === 13
              ? rng.pick([5, 12])
              : eNumerator === 17
                ? rng.pick([8, 15])
                : rng.pick([7, 24]);
        const e = Q.of(eNumerator, eDenominator);
        const mult = rng.int(2, 5);
        const distDirectrix = eDenominator * mult;
        const distFocus = eNumerator * mult;
        return numberProblem({
          prompt: t(
            `A point $P$ lies on a hyperbola with eccentricity $e = ${e.toLatex()}$. If the distance from $P$ to the directrix is $${distDirectrix}$, what is the distance from $P$ to the corresponding focus?`,
            `点 $P$ 位于离心率 $e = ${e.toLatex()}$ 的双曲线上。如果点 $P$ 到准线的距离为 $${distDirectrix}$，那么点 $P$ 到对应焦点的距离是多少？`,
          ),
          answer: distFocus,
          wrong: [distDirectrix, Math.round((distDirectrix * eDenominator) / eNumerator), distFocus + 2, distFocus - 2],
          solution: t(
            `Using the focus-directrix property $PF = e \\cdot d(P, \\ell)$:${steps(
              `PF = ${e.toLatex()} \\times ${distDirectrix} = ${distFocus}`,
            )}`,
            `利用焦点-准线性质 $PF = e \\cdot d(P, \\ell)$：${steps(`PF = ${e.toLatex()} \\times ${distDirectrix} = ${distFocus}`)}`,
          ),
        });
      },
    },
  ],
};

// ===========================================================================
// All 20 Precalculus Conic Section Topics
// ===========================================================================

export const precalculusConicSectionTopics: readonly TopicDef[] = [
  introductionToEllipses,
  equationsOfEllipsesCenteredAtTheOrigin,
  equationsOfEllipsesCenteredAtAGeneralPoint,
  findingTheCenterAndAxesOfEllipsesByCompletingTheSquare,
  findingInterceptsOfEllipses,
  findingIntersectionsOfEllipsesAndLines,
  fociOfEllipses,
  verticesAndEccentricityOfEllipses,
  directricesOfEllipses,
  theAreaOfAnEllipse,
  equationsOfHyperbolasCenteredAtTheOrigin,
  equationsOfHyperbolasCenteredAtAGeneralPoint,
  asymptotesOfHyperbolasCenteredAtTheOrigin,
  asymptotesOfHyperbolasCenteredAtAGeneralPoint,
  findingInterceptsAndIntersectionsOfHyperbolas,
  transverseAxesOfHyperbolas,
  conjugateAxesOfHyperbolas,
  fociOfHyperbolas,
  eccentricityAndVerticesOfHyperbolas,
  directricesOfHyperbolas,
];
