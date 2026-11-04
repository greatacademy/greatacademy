import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { plane, Q } from "@ga/subject-math";

import { type Label, type Pt, rectFigure, ringFigure, sceneFigure, sectorFigure, squareCircleFigure } from "../exam-figures.ts";
import { numberProblem, steps } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// ACT Math Fundamentals, reasoning in geometry: estimating from figures drawn to scale, angles along a line, rigid
// motions, right triangles joined along a side, corresponding parts, measures recovered from other measures, and
// circles with a second condition.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** withFigure attaches a figure to a problem. */
const withFigure = (p: Problem, figure: Figure): Problem => ({ ...p, figure });

/** fr writes a reduced fraction in LaTeX. */
const fr = (n: number, d: number) => Q.of(n, d).toLatex();

/** deg writes a degree measure. */
const deg = (v: number | string) => `${v}^{\\circ}`;

/** rad converts degrees to radians. */
const rad = (d: number) => (d * Math.PI) / 180;

/** polar is the point at a distance and a direction from the origin. */
const polar = (r: number, d: number): Pt => [r * Math.cos(rad(d)), r * Math.sin(rad(d))];

/** lengthOptions lists a measure and three others well apart from it, so that an estimate from the figure decides. */
function lengthOptions(answer: number, unit: number): { readonly correct: Text; readonly wrong: readonly Text[] } {
  const others = [answer + 2 * unit, answer + 4 * unit, answer - 2 * unit, answer - 4 * unit, answer + 6 * unit].filter((v) => v > 0);
  return { correct: same(`$${answer}$`), wrong: others.slice(0, 3).map((v) => same(`$${v}$`)) };
}

// ---------------------------------------------------------------------------
// Estimating lengths

/** segmentFigure draws a segment with named points at the given positions, labeling one part with a length. */
function segmentFigure(xs: readonly number[], from: number, to: number, label: string): Figure {
  const names = ["A", "B", "C", "D", "E"];
  const end = xs[xs.length - 1] as number;
  const top = end * 0.04;
  return sceneFigure({
    shapes: [
      {
        pts: [
          [0, 0],
          [end, 0],
        ],
      },
      ...xs.map((x): { pts: readonly Pt[] } => ({
        pts: [
          [x, -top],
          [x, top],
        ],
      })),
    ],
    labels: [
      ...xs.map((x, i) => ({ at: [x, top] as Pt, text: names[i] as string, from: [x, -end] as Pt, by: 14 })),
      {
        at: [((xs[from] as number) + (xs[to] as number)) / 2, -top],
        text: label,
        from: [(xs[from] as number) / 2 + (xs[to] as number) / 2, end],
        by: 14,
      },
    ],
  });
}

/** estimatingSegmentLengthsFromOtherLengthsInAFigure estimates lengths by comparing them with a labeled length. */
export const estimatingSegmentLengthsFromOtherLengthsInAFigure = topic(
  "estimating-segment-lengths-from-other-lengths-in-a-figure",
  t("Estimating Segment Lengths From Other Lengths in a Figure", "由图中其他长度估计线段长"),
  t(
    "Use a labeled length in a figure drawn to scale as a ruler, to estimate an unlabeled segment or a measure that depends on one.",
    "把按比例绘制的图中已标出的长度当作尺子，估计未标出的线段或依赖它的量。",
  ),
  ["the-segment-addition-postulate"],
  ["7.G.A.1"],
  [
    kp(
      "comparing-a-segment-with-a-labeled-one",
      t("Comparing a segment with a labeled one", "把线段与已标出的线段比较"),
      t(
        "When a figure is drawn to scale, a labeled segment acts as a ruler. Ask how many copies of it would fit along the segment you want, then multiply. If $AB = 10$ and $BC$ looks about two and a half times as long, then $BC$ is about $25$. The answer choices are far enough apart that a careful comparison decides.",
        "图按比例绘制时，已标出的线段就像一把尺子。看所求线段大约能放下几段它，再相乘。若 $AB = 10$，而 $BC$ 看起来约为它的两倍半，则 $BC$ 约为 $25$。选项相差较大，仔细比较就能判断。",
      ),
      (rng) => {
        const unit = rng.pick([4, 6, 8, 10, 12, 14, 16, 18, 20]);
        const k = rng.pick([1, 2, 3, 4]);
        const half = rng.pick([0, 1]);
        const shownHalf = k * 2 + half;
        const answer = (unit * shownHalf) / 2;
        const { correct, wrong } = lengthOptions(answer, unit / 2);
        const asked = rng.bool();
        const xs = asked ? [0, unit, unit + answer] : [0, answer, answer + unit];
        const [givenA, givenB, askA, askB] = asked ? ["A", "B", "B", "C"] : ["B", "C", "A", "B"];
        return withFigure(
          pickChoice(
            rng,
            t(
              `In the figure, drawn to scale, $${givenA}${givenB} = ${unit}$. Which value is closest to the length of $\\overline{${askA}${askB}}$?`,
              `图按比例绘制，$${givenA}${givenB} = ${unit}$。下列哪个值最接近 $\\overline{${askA}${askB}}$ 的长度？`,
            ),
            correct,
            wrong,
            t(
              `Use $\\overline{${givenA}${givenB}}$ as a ruler: $\\overline{${askA}${askB}}$ is about $${fr(shownHalf, 2)}$ times as long, and $${fr(shownHalf, 2)} \\cdot ${unit} = ${answer}$.`,
              `把 $\\overline{${givenA}${givenB}}$ 当作尺子：$\\overline{${askA}${askB}}$ 约为它的 $${fr(shownHalf, 2)}$ 倍，而 $${fr(shownHalf, 2)} \\cdot ${unit} = ${answer}$。`,
            ),
          ),
          asked ? segmentFigure(xs, 0, 1, `${unit}`) : segmentFigure(xs, 1, 2, `${unit}`),
        );
      },
    ),
    kp(
      "estimating-a-measure-that-depends-on-a-length",
      t("Estimating a measure that depends on a length", "估计依赖长度的量"),
      t(
        "Some questions need the estimate as a step. For the area of a rectangle whose width is labeled, first compare the length with the width to estimate the length, and then use the area formula. A rectangle of width $6$ and length about twice that has an area near $6 \\cdot 12 = 72$.",
        "有些题目把估计作为一步。求已标出宽的长方形面积时，先把长与宽比较以估计长，再用面积公式。宽为 $6$、长约为宽两倍的长方形，面积约为 $6 \\cdot 12 = 72$。",
      ),
      (rng) => {
        const w = rng.pick([4, 5, 6, 7, 8, 9, 10, 12]);
        const k = rng.pick([2, 3]);
        const l = w * k;
        const area = rng.bool();
        const answer = area ? l * w : 2 * (l + w);
        const step = area ? w * w : 2 * w;
        const others = [answer + step, answer + 2 * step, answer - step, answer + 3 * step].filter((v) => v > 0);
        return withFigure(
          pickChoice(
            rng,
            t(
              `In the rectangle, drawn to scale, the shorter side is $${w}$. Which value is closest to the ${area ? "area" : "perimeter"} of the rectangle?`,
              `长方形按比例绘制，较短边为 $${w}$。下列哪个值最接近这个长方形的${area ? "面积" : "周长"}？`,
            ),
            same(`$${answer}$`),
            others.slice(0, 3).map((v) => same(`$${v}$`)),
            t(
              `The longer side looks about $${k}$ times the shorter one, so it is about $${l}$. ${area ? `The area is about $${l} \\cdot ${w} = ${answer}$.` : `The perimeter is about $2(${l} + ${w}) = ${answer}$.`}`,
              `较长边看起来约为较短边的 $${k}$ 倍，所以约为 $${l}$。${area ? `面积约为 $${l} \\cdot ${w} = ${answer}$。` : `周长约为 $2(${l} + ${w}) = ${answer}$。`}`,
            ),
          ),
          rectFigure(l, w, null, `${w}`),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Angles along a line

/** rayFigure draws a line with rays from a point on it, labeling the angles in order from the right. */
function rayFigure(directions: readonly number[], labels: readonly string[]): Figure {
  const edges = [0, ...directions, 180];
  return sceneFigure({
    shapes: [{ pts: [polar(1, 0), polar(1, 180)] }, ...directions.map((d): { pts: readonly Pt[] } => ({ pts: [[0, 0], polar(1, d)] }))],
    labels: labels.map((text, i) => ({ at: polar(0.62, ((edges[i] as number) + (edges[i + 1] as number)) / 2), text })),
  });
}

/** findingAnglesFromLinearPairsAndAdjacentAngles finds angles along a line from expressions and relations. */
export const findingAnglesFromLinearPairsAndAdjacentAngles = topic(
  "finding-angles-from-linear-pairs-and-adjacent-angles",
  t("Finding Angles from Linear Pairs and Adjacent Angles", "由邻补角和相邻角求角"),
  t(
    "Use the fact that angles along a straight line add to $180^{\\circ}$ to find angles given by expressions or by a relation between them.",
    "利用直线上的角之和为 $180^{\\circ}$，求由表达式或相互关系给出的角。",
  ),
  ["supplementary-angles", "non-adjacent-complementary-angles"],
  ["7.G.B.5"],
  [
    kp(
      "a-linear-pair-given-by-expressions",
      t("A linear pair given by expressions", "用表达式给出的邻补角"),
      t(
        "Two adjacent angles forming a straight line are a **linear pair**, and they add to $180^{\\circ}$. When they are written with a variable, set their sum equal to $180$ and solve. Then substitute back, because the question usually asks for an angle and not for $x$. Checking that both angles add to $180^{\\circ}$ catches slips.",
        "两个相邻且合成一条直线的角叫**邻补角**，它们的和是 $180^{\\circ}$。如果用变量表示，就令它们的和等于 $180$ 并求解。然后代回去，因为题目通常问的是角，而不是 $x$。验算两角之和是否为 $180^{\\circ}$ 可以发现错误。",
      ),
      (rng) => {
        const u = rng.int(2, 5);
        const v = rng.int(1, 5);
        const x = rng.pick([10, 12, 14, 15, 16, 18, 20, 22, 24]);
        const a = rng.pick([-10, -6, -4, 4, 6, 8, 10, 12, 14]);
        const first = u * x + a;
        const second = 180 - first;
        const b = second - v * x;
        if (second <= 10 || first <= 10) return findingAnglesFallback(rng);
        const bText = b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
        const c = (n: number) => (n === 1 ? "" : `${n}`);
        const ae = `${c(u)}x ${a < 0 ? "-" : "+"} ${Math.abs(a)}`;
        const be = `${c(v)}x${bText}`;
        const askFirst = rng.bool();
        const answer = askFirst ? first : second;
        return withFigure(
          numberProblem({
            prompt: t(
              `The two angles shown form a straight line and measure $(${ae})^{\\circ}$ and $(${be})^{\\circ}$. What is the measure, in degrees, of the angle labeled $(${askFirst ? ae : be})^{\\circ}$?`,
              `图中两个角合成一条直线，分别为 $(${ae})^{\\circ}$ 和 $(${be})^{\\circ}$。标为 $(${askFirst ? ae : be})^{\\circ}$ 的角是多少度？`,
            ),
            answer,
            wrong: [x, askFirst ? second : first, 90 - x, answer + 2 * x],
            unit: "°",
            solution: t(
              `A linear pair adds to $180^{\\circ}$, so solve for $x$ and substitute back.${steps(`(${ae}) + (${be}) = 180`, `${u + v}x = ${180 - a - b}`, `x = ${x}`)}The angle is $${deg(answer)}$.`,
              `邻补角之和为 $180^{\\circ}$，所以先求 $x$，再代回去。${steps(`(${ae}) + (${be}) = 180`, `${u + v}x = ${180 - a - b}`, `x = ${x}`)}这个角是 $${deg(answer)}$。`,
            ),
          }),
          rayFigure([second], [`(${be})°`, `(${ae})°`]),
        );
      },
    ),
    kp(
      "three-adjacent-angles-on-a-line",
      t("Three adjacent angles on a line", "直线上的三个相邻角"),
      t(
        "Angles side by side along a straight line all add to $180^{\\circ}$, however many there are. If one is known and the other two are related, as when one is twice the other, write both with a single variable. With $40^{\\circ}$ known and the others $x$ and $2x$, we get $3x = 140$ after subtracting, and so on.",
        "沿一条直线并排的角，无论有几个，和都是 $180^{\\circ}$。如果已知一个角，另外两个有关系，比如一个是另一个的两倍，就用同一个变量表示它们。已知 $40^{\\circ}$，另外两个是 $x$ 和 $2x$ 时，相减后得 $3x = 140$，依此类推。",
      ),
      (rng) => {
        const k = rng.pick([2, 3, 4, 5]);
        const x = rng.pick([10, 12, 15, 18, 20, 24, 25, 30].filter((v) => v * (k + 1) < 160));
        const known = 180 - x * (k + 1);
        const askBig = rng.bool();
        const answer = askBig ? k * x : x;
        const d1 = known;
        const d2 = known + x;
        return withFigure(
          numberProblem({
            prompt: t(
              `Three adjacent angles lie along a straight line. One measures $${deg(known)}$, and of the other two, one is $${k}$ times the other. What is the measure, in degrees, of the ${askBig ? "larger" : "smaller"} of those two?`,
              `三个相邻角沿一条直线排列。其中一个是 $${deg(known)}$，另外两个中，一个是另一个的 $${k}$ 倍。这两个角中${askBig ? "较大" : "较小"}的是多少度？`,
            ),
            answer,
            wrong: [askBig ? x : k * x, 180 - known, Q.of(180 - known, k), 180 - answer],
            unit: "°",
            solution: t(
              `The three angles add to $180^{\\circ}$. Call the smaller of the two $x$, so that the other is $${k}x$.${steps(`${known} + x + ${k}x = 180`, `${k + 1}x = ${180 - known}`, `x = ${x}`)}So the ${askBig ? "larger" : "smaller"} angle is $${deg(answer)}$.`,
              `三个角的和是 $180^{\\circ}$。设这两个角中较小的为 $x$，则另一个是 $${k}x$。${steps(`${known} + x + ${k}x = 180`, `${k + 1}x = ${180 - known}`, `x = ${x}`)}所以${askBig ? "较大" : "较小"}的角是 $${deg(answer)}$。`,
            ),
          }),
          rayFigure([d1, d2], [`${known}°`, "x°", `${k}x°`]),
        );
      },
    ),
  ],
);

/** findingAnglesFallback is the linear pair with fixed coefficients, used when the drawn numbers leave a degenerate angle. */
function findingAnglesFallback(rng: Rng): Problem {
  const x = rng.pick([20, 25, 30, 35]);
  const first = 2 * x + 10;
  const second = 180 - first;
  const b = second - x;
  return withFigure(
    numberProblem({
      prompt: t(
        `The two angles shown form a straight line and measure $(2x + 10)^{\\circ}$ and $(x + ${b})^{\\circ}$. What is the measure, in degrees, of the angle labeled $(2x + 10)^{\\circ}$?`,
        `图中两个角合成一条直线，分别为 $(2x + 10)^{\\circ}$ 和 $(x + ${b})^{\\circ}$。标为 $(2x + 10)^{\\circ}$ 的角是多少度？`,
      ),
      answer: first,
      wrong: [x, second, 90 - x],
      unit: "°",
      solution: t(
        `A linear pair adds to $180^{\\circ}$, so $3x + ${10 + b} = 180$ and $x = ${x}$. The angle is $${deg(first)}$.`,
        `邻补角之和为 $180^{\\circ}$，所以 $3x + ${10 + b} = 180$，$x = ${x}$。这个角是 $${deg(first)}$。`,
      ),
    }),
    rayFigure([second], [`(x + ${b})°`, "(2x + 10)°"]),
  );
}

// ---------------------------------------------------------------------------
// Rigid motions

/** Motion is a rigid motion of the plane given by its name and its action on points. */
interface Motion {
  readonly en: string;
  readonly zh: string;
  readonly apply: (p: readonly [number, number]) => readonly [number, number];
}

/** motions lists the reflections and rotations used in sequences. */
const motions: readonly Motion[] = [
  { en: "reflect it over the $x$-axis", zh: "关于 $x$ 轴作反射", apply: ([x, y]) => [x, -y] },
  { en: "reflect it over the $y$-axis", zh: "关于 $y$ 轴作反射", apply: ([x, y]) => [-x, y] },
  { en: "reflect it over the line $y = x$", zh: "关于直线 $y = x$ 作反射", apply: ([x, y]) => [y, x] },
  { en: "rotate it $180^{\\circ}$ about the origin", zh: "绕原点旋转 $180^{\\circ}$", apply: ([x, y]) => [-x, -y] },
  { en: "rotate it $90^{\\circ}$ counterclockwise about the origin", zh: "绕原点逆时针旋转 $90^{\\circ}$", apply: ([x, y]) => [-y, x] },
];

/** reasoningFromRigidMotions follows points through rigid motions and uses the measures they preserve. */
export const reasoningFromRigidMotions = topic(
  "reasoning-from-rigid-motions",
  t("Reasoning From Rigid Motions", "由刚体运动推理"),
  t(
    "Follow a point through a sequence of rigid motions, and use the fact that rigid motions preserve lengths and angles to find unknown measures.",
    "跟踪一个点经过一系列刚体运动后的位置，并利用刚体运动保持长度和角度不变来求未知量。",
  ),
  ["applying-sequences-of-rigid-motions"],
  ["8.G.A.1", "HSG.CO.B.6"],
  [
    kp(
      "following-a-point-through-a-sequence",
      t("Following a point through a sequence", "跟踪点经过一系列运动"),
      t(
        "Carry out a sequence of motions in the stated order, using each result as the next input. Order matters: translating and then reflecting generally differs from reflecting and then translating. Over the $x$-axis $(x, y)$ becomes $(x, -y)$; over the $y$-axis it becomes $(-x, y)$; a turn of $90^{\\circ}$ counterclockwise gives $(-y, x)$.",
        "按所给顺序依次进行运动，把每一步的结果作为下一步的输入。顺序很重要：先平移再反射，一般不同于先反射再平移。关于 $x$ 轴，$(x, y)$ 变为 $(x, -y)$；关于 $y$ 轴变为 $(-x, y)$；逆时针旋转 $90^{\\circ}$ 得 $(-y, x)$。",
      ),
      (rng) => {
        const P: readonly [number, number] = [rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), rng.pick([-7, -5, -3, -2, 1, 2, 4, 6, 7])];
        const h = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const k = rng.pick([-6, -3, -2, -1, 1, 2, 3, 6]);
        const m = rng.pick(motions);
        const moved: readonly [number, number] = [P[0] + h, P[1] + k];
        const translateFirst = rng.bool();
        const end: readonly [number, number] = translateFirst ? m.apply(moved) : ((q) => [q[0] + h, q[1] + k] as const)(m.apply(P));
        const other: readonly [number, number] = translateFirst ? ((q) => [q[0] + h, q[1] + k] as const)(m.apply(P)) : m.apply(moved);
        const shift = t(
          `move it ${Math.abs(h)} units ${h > 0 ? "right" : "left"} and ${Math.abs(k)} units ${k > 0 ? "up" : "down"}`,
          `向${h > 0 ? "右" : "左"}平移 ${Math.abs(h)} 个单位，再向${k > 0 ? "上" : "下"}平移 ${Math.abs(k)} 个单位`,
        );
        const askX = rng.bool();
        const answer = end[askX ? 0 : 1];
        const mid: readonly [number, number] = translateFirst ? moved : m.apply(P);
        const a = translateFirst ? shift.en : m.en;
        const b = translateFirst ? m.en : shift.en;
        const az = translateFirst ? shift["zh-CN"] : m.zh;
        const bz = translateFirst ? m.zh : shift["zh-CN"];
        return numberProblem({
          prompt: t(
            `Start with the point $(${P[0]}, ${P[1]})$. First ${a}. Then ${b}. What is the ${askX ? "$x$" : "$y$"}-coordinate of the final point?`,
            `从点 $(${P[0]}, ${P[1]})$ 开始。先${az}。然后${bz}。最后所得点的${askX ? "横" : "纵"}坐标是多少？`,
          ),
          answer,
          wrong: [other[askX ? 0 : 1], end[askX ? 1 : 0], -answer, mid[askX ? 0 : 1]],
          solution: t(
            `Apply the motions in order, using each result for the next step. After the first the point is $(${mid[0]}, ${mid[1]})$, and after the second it is $(${end[0]}, ${end[1]})$. So the ${askX ? "$x$" : "$y$"}-coordinate is $${answer}$.`,
            `按顺序进行运动，每一步都用上一步的结果。第一步后，点是 $(${mid[0]}, ${mid[1]})$；第二步后，点是 $(${end[0]}, ${end[1]})$。所以${askX ? "横" : "纵"}坐标是 $${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "measures-a-rigid-motion-preserves",
      t("Measures a rigid motion preserves", "刚体运动保持的量"),
      t(
        "Translations, reflections and rotations move a figure without changing its size or shape, so each side and angle of the image equals the matching part of the original. Equal parts give an equation. If $\\overline{AB}$ maps to $\\overline{DE}$, with $AB = 2x + 1$ and $DE = 3x - 4$, then $2x + 1 = 3x - 4$ and $x = 5$.",
        "平移、反射和旋转只移动图形，不改变大小和形状，所以像的每条边和每个角都等于原图中对应的部分。相等的部分给出方程。若 $\\overline{AB}$ 映射到 $\\overline{DE}$，$AB = 2x + 1$，$DE = 3x - 4$，则 $2x + 1 = 3x - 4$，$x = 5$。",
      ),
      (rng) => {
        const x = rng.int(2, 12);
        const u = rng.int(2, 4);
        const v = u + rng.int(1, 3);
        const a = rng.int(1, 12);
        const b = (u - v) * x + a;
        const motion = rng.pick([t("reflected", "反射"), t("rotated", "旋转"), t("translated", "平移")]);
        const len = u * x + a;
        const bPart = b < 0 ? `- ${-b}` : b === 0 ? "" : `+ ${b}`;
        const [A, B, C, D, E, F] = rng.pick([
          ["A", "B", "C", "D", "E", "F"],
          ["P", "Q", "R", "S", "T", "U"],
          ["J", "K", "L", "M", "N", "O"],
        ] as const);
        const pair = rng.pick([
          [A, B, D, E],
          [B, C, E, F],
          [A, C, D, F],
        ] as const);
        return numberProblem({
          prompt: t(
            `Triangle $${A}${B}${C}$ is ${motion.en} onto triangle $${D}${E}${F}$, with the vertices in that order. If $${pair[0]}${pair[1]} = ${u}x + ${a}$ and $${pair[2]}${pair[3]} = ${v}x ${bPart}$, what is $${pair[2]}${pair[3]}$?`,
            `三角形 $${A}${B}${C}$ 经${motion["zh-CN"]}与三角形 $${D}${E}${F}$ 重合，顶点按此顺序对应。若 $${pair[0]}${pair[1]} = ${u}x + ${a}$，$${pair[2]}${pair[3]} = ${v}x ${bPart}$，求 $${pair[2]}${pair[3]}$。`,
          ),
          answer: len,
          wrong: [x, len + u, u * x, 2 * len],
          solution: t(
            `A rigid motion preserves lengths, so the matching sides are equal.${steps(`${u}x + ${a} = ${v}x ${bPart}`, `x = ${x}`)}Substituting gives a length of $${len}$.`,
            `刚体运动保持长度不变，所以对应边相等。${steps(`${u}x + ${a} = ${v}x ${bPart}`, `x = ${x}`)}代入得长度为 $${len}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Compound right triangles

/** sharedLegs lists right triangles (leg, shared leg, hypotenuse) grouped by the leg they share. */
const sharedLegs: readonly (readonly (readonly [number, number])[])[] = [
  // shared 12
  [
    [5, 13],
    [9, 15],
    [16, 20],
    [35, 37],
  ],
  // shared 24
  [
    [7, 25],
    [10, 26],
    [18, 30],
    [32, 40],
  ],
  // shared 8
  [
    [6, 10],
    [15, 17],
  ],
  // shared 15
  [
    [8, 17],
    [20, 25],
    [36, 39],
  ],
  // shared 20
  [
    [15, 25],
    [21, 29],
    [48, 52],
  ],
];

const sharedValue = [12, 24, 8, 15, 20];

/** chains lists two right triangles joined along a side: legs a and b with hypotenuse c, then legs c and d with hypotenuse e. */
const chains: readonly (readonly [number, number, number, number, number])[] = [
  [3, 4, 5, 12, 13],
  [6, 8, 10, 24, 26],
  [9, 12, 15, 8, 17],
  [9, 12, 15, 20, 25],
  [9, 12, 15, 36, 39],
  [5, 12, 13, 84, 85],
  [7, 24, 25, 60, 65],
  [15, 20, 25, 60, 65],
  [12, 16, 20, 15, 25],
  [12, 16, 20, 21, 29],
  [8, 15, 17, 144, 145],
  [4, 3, 5, 12, 13],
  [8, 6, 10, 24, 26],
  [12, 9, 15, 8, 17],
  [12, 9, 15, 20, 25],
  [12, 9, 15, 36, 39],
  [12, 5, 13, 84, 85],
  [24, 7, 25, 60, 65],
  [20, 15, 25, 60, 65],
  [16, 12, 20, 15, 25],
  [16, 12, 20, 21, 29],
  [15, 8, 17, 144, 145],
];

/** reasoningFromCompoundRightTriangles finds lengths in figures made of two right triangles. */
export const reasoningFromCompoundRightTriangles = topic(
  "reasoning-from-compound-right-triangles",
  t("Reasoning From Compound Right Triangles", "由复合直角三角形推理"),
  t(
    "Find lengths in figures made of two right triangles that share a leg or that are joined along a hypotenuse, by carrying a length from one triangle to the other.",
    "在由两个直角三角形组成的图形中（共用一条直角边，或沿斜边相接），把一个三角形中的长度带到另一个三角形中求长度。",
  ),
  ["the-pythagorean-theorem"],
  ["8.G.B.7"],
  [
    kp(
      "two-right-triangles-sharing-a-leg",
      t("Two right triangles sharing a leg", "共用一条直角边的两个直角三角形"),
      t(
        "An altitude splits a triangle into two right triangles that share it as a leg. Neither triangle alone usually has enough given, so find the shared leg from the triangle that has two known sides, then use it in the other. Each triangle gets its own use of the Pythagorean theorem.",
        "高把三角形分成两个直角三角形，它们共用这条高作为直角边。通常单独一个三角形的条件不够，所以先由已知两边的三角形求出公共直角边，再用到另一个三角形中。每个三角形各用一次勾股定理。",
      ),
      (rng) => {
        const i = rng.int(0, sharedLegs.length - 1);
        const h = sharedValue[i] as number;
        const [[p, ph], [q, qh]] = rng.sample(sharedLegs[i] as readonly (readonly [number, number])[], 2) as [
          readonly [number, number],
          readonly [number, number],
        ];
        const A: Pt = [-p, 0];
        const C: Pt = [q, 0];
        const B: Pt = [0, h];
        const D: Pt = [0, 0];
        const form = rng.int(0, 2);
        const answer = form === 0 ? qh : form === 1 ? p + q : ((p + q) * h) / 2;
        const asked =
          form === 0
            ? t("the length of $\\overline{BC}$", "$\\overline{BC}$ 的长")
            : form === 1
              ? t("the length of $\\overline{AC}$", "$\\overline{AC}$ 的长")
              : t("the area of triangle $ABC$", "三角形 $ABC$ 的面积");
        const labels: Label[] = [
          { at: A, text: "A", from: [0, h / 3], by: 14 },
          { at: C, text: "C", from: [0, h / 3], by: 14 },
          { at: B, text: "B", from: [0, 0], by: 14 },
          { at: D, text: "D", from: B, by: 14 },
          { at: [-p / 2, h / 2], text: `${ph}`, from: [0, 0], by: 14 },
          { at: [-p / 2, 0], text: `${p}`, from: B, by: 14 },
          form === 1 ? { at: [q / 2, h / 2], text: `${qh}`, from: [0, 0], by: 14 } : { at: [q / 2, 0], text: `${q}`, from: B, by: 14 },
        ];
        const figure = sceneFigure({
          shapes: [{ pts: [A, C, B], closed: true }, { pts: [B, D] }],
          rights: [{ at: D, a: C, b: B }],
          labels,
        });
        return withFigure(
          numberProblem({
            prompt: t(
              `In the figure, $\\overline{BD}$ is perpendicular to $\\overline{AC}$. What is ${asked.en}?`,
              `图中 $\\overline{BD}$ 垂直于 $\\overline{AC}$。求${asked["zh-CN"]}。`,
            ),
            answer,
            wrong: [h, ph + q, form === 0 ? p + q : qh, ph * q, Math.max(1, answer + h)],
            solution: t(
              `Triangle $ABD$ has two known sides, so use it to find the shared leg: $BD = \\sqrt{${ph}^{2} - ${p}^{2}} = ${h}$.${form === 0 ? ` Then in triangle $CBD$, $BC = \\sqrt{${h}^{2} + ${q}^{2}} = ${qh}$.` : form === 1 ? ` Then in triangle $CBD$, $DC = \\sqrt{${qh}^{2} - ${h}^{2}} = ${q}$, so $AC = ${p} + ${q} = ${p + q}$.` : ` The base is $${p} + ${q} = ${p + q}$, and $BD$ is the height, so the area is $\\frac{1}{2}(${p + q})(${h}) = ${answer}$.`}`,
              `三角形 $ABD$ 已知两边，用它求公共直角边：$BD = \\sqrt{${ph}^{2} - ${p}^{2}} = ${h}$。${form === 0 ? `然后在三角形 $CBD$ 中，$BC = \\sqrt{${h}^{2} + ${q}^{2}} = ${qh}$。` : form === 1 ? `然后在三角形 $CBD$ 中，$DC = \\sqrt{${qh}^{2} - ${h}^{2}} = ${q}$，所以 $AC = ${p} + ${q} = ${p + q}$。` : `底是 $${p} + ${q} = ${p + q}$，$BD$ 是高，所以面积是 $\\frac{1}{2}(${p + q})(${h}) = ${answer}$。`}`,
            ),
          }),
          figure,
        );
      },
    ),
    kp(
      "two-right-triangles-joined-along-a-side",
      t("Two right triangles joined along a side", "沿一边相接的两个直角三角形"),
      t(
        "When the hypotenuse of one right triangle is a leg of the next, that side links them. Find it from the first triangle, then treat it as a leg in the second. Keep it as an exact value along the way: rounding the link early spoils the final answer.",
        "一个直角三角形的斜边是另一个的直角边时，这条边把它们联系起来。先由第一个三角形求出它，再在第二个三角形中把它当作直角边。过程中要保留精确值：过早对这条边取近似会使最后的答案不准确。",
      ),
      (rng) => {
        const [a, b, c, d, e] = rng.pick(chains) as readonly [number, number, number, number, number];
        const B: Pt = [0, 0];
        const A: Pt = [0, a];
        const C: Pt = [b, 0];
        const D: Pt = [b + (d * a) / c, (d * b) / c];
        const askD = rng.bool();
        const figure = sceneFigure({
          shapes: [{ pts: [A, B, C, D], closed: true }, { pts: [A, C] }],
          rights: [
            { at: B, a: A, b: C },
            { at: C, a: A, b: D },
          ],
          labels: [
            { at: A, text: "A", from: C, by: 14 },
            { at: B, text: "B", from: D, by: 14 },
            { at: C, text: "C", from: A, by: 14 },
            { at: D, text: "D", from: B, by: 14 },
            { at: [0, a / 2], text: `${a}`, from: C, by: 14 },
            { at: [b / 2, 0], text: `${b}`, from: A, by: 14 },
            askD
              ? { at: [(b + D[0]) / 2, D[1] / 2], text: `${d}`, from: A, by: 14 }
              : { at: [D[0] / 2, (a + D[1]) / 2], text: `${e}`, from: C, by: 14 },
          ],
        });
        return withFigure(
          numberProblem({
            prompt: t(
              `In the figure, angles $B$ and $ACD$ are right angles. What is the length of $\\overline{${askD ? "AD" : "CD"}}$?`,
              `图中 $\\angle B$ 和 $\\angle ACD$ 都是直角。求 $\\overline{${askD ? "AD" : "CD"}}$ 的长。`,
            ),
            answer: askD ? e : d,
            wrong: [a + b + d, c, askD ? a + d : b + d, askD ? b + d : e - c, (askD ? e : d) + 1],
            solution: t(
              `The side $\\overline{AC}$ links the two triangles, so find it first: $AC = \\sqrt{${a}^{2} + ${b}^{2}} = ${c}$. ${askD ? `It is a leg of triangle $ACD$, so $AD = \\sqrt{${c}^{2} + ${d}^{2}} = ${e}$.` : `It is a leg of triangle $ACD$ with hypotenuse $${e}$, so $CD = \\sqrt{${e}^{2} - ${c}^{2}} = ${d}$.`}`,
              `边 $\\overline{AC}$ 把两个三角形联系起来，所以先求它：$AC = \\sqrt{${a}^{2} + ${b}^{2}} = ${c}$。${askD ? `它是三角形 $ACD$ 的直角边，所以 $AD = \\sqrt{${c}^{2} + ${d}^{2}} = ${e}$。` : `它是三角形 $ACD$ 的直角边，斜边为 $${e}$，所以 $CD = \\sqrt{${e}^{2} - ${c}^{2}} = ${d}$。`}`,
            ),
          }),
          figure,
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Corresponding parts

/** vertexSets are pairs of triangle names; the order of the letters states which vertices correspond. */
const vertexSets: readonly (readonly [string, string])[] = [
  ["ABC", "DEF"],
  ["PQR", "STU"],
  ["JKL", "MNO"],
  ["GHI", "XYZ"],
  ["ABC", "XYZ"],
  ["RST", "UVW"],
];

/** matchingPartsAcrossCongruenceAndSimilarity reads corresponding parts from the order of the vertices. */
export const matchingPartsAcrossCongruenceAndSimilarity = topic(
  "matching-parts-across-congruence-and-similarity",
  t("Matching Parts Across Congruence and Similarity", "匹配全等与相似中的对应部分"),
  t(
    "Read which sides and angles correspond from the order of the letters in a congruence or similarity statement, and use the correspondence to find a length.",
    "由全等或相似陈述中字母的顺序读出对应的边和角，并利用对应关系求长度。",
  ),
  ["properties-of-congruence", "similarity-and-similar-polygons"],
  ["HSG.CO.B.7", "HSG.SRT.A.2"],
  [
    kp(
      "reading-parts-from-the-order-of-the-letters",
      t("Reading parts from the order of the letters", "由字母顺序读对应部分"),
      t(
        "A statement such as $\\triangle ABC \\cong \\triangle FDE$ matches letters by position: $A$ with $F$, $B$ with $D$, $C$ with $E$. So side $\\overline{BC}$, the second and third letters, matches $\\overline{DE}$, the second and third letters of the other name. The look of the figure does not matter; the order of the letters decides.",
        "$\\triangle ABC \\cong \\triangle FDE$ 这样的陈述按位置配对字母：$A$ 对 $F$，$B$ 对 $D$，$C$ 对 $E$。所以边 $\\overline{BC}$（第二、三个字母）对应 $\\overline{DE}$（另一个名称的第二、三个字母）。图的样子不起作用，由字母顺序决定。",
      ),
      (rng) => {
        const [one, base] = rng.pick(vertexSets) as readonly [string, string];
        const two = rng.shuffle([...base]).join("");
        const sim = rng.bool();
        const sign = sim ? "\\sim" : "\\cong";
        const word = sim ? t("similar", "相似") : t("congruent", "全等");
        const i = rng.int(0, 2);
        const j = (i + 1) % 3;
        const k = (i + 2) % 3;
        const side = rng.bool();
        const seg = (x: string, y: string) => same(`$\\overline{${x}${y}}$`);
        const ang = (x: string) => same(`$\\angle ${x}$`);
        const prompt = side
          ? t(
              `Given $\\triangle ${one} ${sign} \\triangle ${two}$, which side of the second triangle corresponds to $\\overline{${one[i]}${one[j]}}$?`,
              `已知 $\\triangle ${one} ${sign} \\triangle ${two}$（${word["zh-CN"]}），第二个三角形中哪条边与 $\\overline{${one[i]}${one[j]}}$ 对应？`,
            )
          : t(
              `Given $\\triangle ${one} ${sign} \\triangle ${two}$, which angle of the second triangle corresponds to $\\angle ${one[i]}$?`,
              `已知 $\\triangle ${one} ${sign} \\triangle ${two}$（${word["zh-CN"]}），第二个三角形中哪个角与 $\\angle ${one[i]}$ 对应？`,
            );
        const a = two[i] as string;
        const b = two[j] as string;
        const c = two[k] as string;
        return side
          ? pickChoice(
              rng,
              prompt,
              seg(a, b),
              [seg(b, c), seg(a, c), seg(one[i] as string, one[k] as string)],
              t(
                `The letters match by position, so $${one[i]}$ goes with $${a}$ and $${one[j]}$ goes with $${b}$. The side $\\overline{${one[i]}${one[j]}}$ therefore corresponds to $\\overline{${a}${b}}$.`,
                `字母按位置配对，所以 $${one[i]}$ 对 $${a}$，$${one[j]}$ 对 $${b}$。因此边 $\\overline{${one[i]}${one[j]}}$ 对应 $\\overline{${a}${b}}$。`,
              ),
            )
          : pickChoice(
              rng,
              prompt,
              ang(a),
              [ang(b), ang(c), ang(one[j] as string)],
              t(
                `The letters match by position, and $${one[i]}$ is in the same place as $${a}$, so $\\angle ${one[i]}$ corresponds to $\\angle ${a}$.`,
                `字母按位置配对，$${one[i]}$ 与 $${a}$ 位置相同，所以 $\\angle ${one[i]}$ 对应 $\\angle ${a}$。`,
              ),
            );
      },
    ),
    kp(
      "a-length-from-a-stated-similarity",
      t("A length from a stated similarity", "由相似陈述求长度"),
      t(
        "After matching the parts by the letters, similar triangles have proportional sides. Set up a proportion with each ratio written in the same order, first triangle over second. For $\\triangle ABC \\sim \\triangle EFD$, the sides $\\overline{AB}$ and $\\overline{EF}$ correspond, as do $\\overline{BC}$ and $\\overline{FD}$, so $\\frac{AB}{EF} = \\frac{BC}{FD}$.",
        "按字母配对后，相似三角形的对应边成比例。列比例式时，每个比都按同样的顺序写，第一个三角形比第二个三角形。对 $\\triangle ABC \\sim \\triangle EFD$，$\\overline{AB}$ 与 $\\overline{EF}$ 对应，$\\overline{BC}$ 与 $\\overline{FD}$ 对应，所以 $\\frac{AB}{EF} = \\frac{BC}{FD}$。",
      ),
      (rng) => {
        const [one, base] = rng.pick(vertexSets) as readonly [string, string];
        const two = rng.shuffle([...base]).join("");
        const k = rng.pick([2, 3, 4, 5]);
        const sides = rng.pick([
          [3, 4, 5],
          [4, 5, 6],
          [5, 6, 7],
          [2, 3, 4],
          [5, 5, 8],
          [6, 7, 9],
        ] as const);
        const m = rng.int(1, 3);
        const lens = sides.map((s) => s * m);
        const s = (w: string, i: number) => `${w[i]}${w[(i + 1) % 3]}`;
        const i = rng.int(0, 2);
        const j = (i + 1) % 3;
        const a = lens[i] as number;
        const b = lens[j] as number;
        return numberProblem({
          prompt: t(
            `$\\triangle ${one} \\sim \\triangle ${two}$. If $${s(one, i)} = ${a}$, $${s(one, j)} = ${b}$ and $${s(two, i)} = ${a * k}$, what is $${s(two, j)}$?`,
            `$\\triangle ${one} \\sim \\triangle ${two}$。若 $${s(one, i)} = ${a}$，$${s(one, j)} = ${b}$，$${s(two, i)} = ${a * k}$，求 $${s(two, j)}$。`,
          ),
          answer: b * k,
          wrong: [a * k + (b - a), Q.of(a * a * k, b), b + k, a * k],
          solution: t(
            `The order of the letters shows that $\\overline{${s(one, i)}}$ matches $\\overline{${s(two, i)}}$ and $\\overline{${s(one, j)}}$ matches $\\overline{${s(two, j)}}$. Corresponding sides are proportional:${steps(`\\frac{${a * k}}{${a}} = ${k}`, `${s(two, j)} = ${k} \\cdot ${b} = ${b * k}`)}`,
            `字母顺序表明 $\\overline{${s(one, i)}}$ 对应 $\\overline{${s(two, i)}}$，$\\overline{${s(one, j)}}$ 对应 $\\overline{${s(two, j)}}$。对应边成比例：${steps(`\\frac{${a * k}}{${a}} = ${k}`, `${s(two, j)} = ${k} \\cdot ${b} = ${b * k}`)}`,
          ),
        });
      },
    ),
  ],
);

/** recoveringLengthsFromSimilarityDescriptions finds lengths from similarity described in words or by parallel lines. */
export const recoveringLengthsFromSimilarityDescriptions = topic(
  "recovering-lengths-from-similarity-descriptions",
  t("Recovering Lengths From Similarity Descriptions", "由相似描述还原长度"),
  t(
    "Find lengths and perimeters of a triangle described as similar to another, and lengths cut off by a line parallel to one side.",
    "求被描述为与另一三角形相似的三角形的长度和周长，以及平行于一边的直线截出的长度。",
  ),
  ["the-aa-similarity-criterion"],
  ["HSG.SRT.B.5"],
  [
    kp(
      "a-similar-triangle-described-in-words",
      t("A similar triangle described in words", "用文字描述的相似三角形"),
      t(
        "When a description gives one matching pair, like the longest sides, their quotient is the scale factor, and every other length is scaled by it. The longest side must match the longest side, the shortest the shortest. Perimeters scale by the same factor, so a perimeter can be found without finding each side.",
        "描述中给出一对对应量（比如最长边）时，它们的商就是比例因子，其他长度都按它缩放。最长边对应最长边，最短边对应最短边。周长也按同一比例因子缩放，所以不必求每条边就能求出周长。",
      ),
      (rng) => {
        const sides = rng.pick([
          [3, 4, 6],
          [5, 6, 9],
          [4, 7, 8],
          [5, 7, 10],
          [6, 8, 9],
          [2, 5, 6],
          [7, 8, 12],
        ] as const);
        const [a, b, c] = sides;
        const k = rng.int(2, 6);
        const perimeter = rng.bool();
        const asked = perimeter ? (a + b + c) * k : a * k;
        return numberProblem({
          prompt: t(
            `A triangle has sides of lengths $${a}$, $${b}$ and $${c}$. In a similar triangle, the longest side has length $${c * k}$. What is ${perimeter ? "the perimeter of the similar triangle" : "the length of its shortest side"}?`,
            `一个三角形的三边长为 $${a}$、$${b}$、$${c}$。在一个与它相似的三角形中，最长边长为 $${c * k}$。求${perimeter ? "这个相似三角形的周长" : "它最短边的长"}。`,
          ),
          answer: asked,
          wrong: [
            perimeter ? a + b + c * k : a + (c * k - c),
            perimeter ? a * k : c * k - c,
            asked + k,
            perimeter ? (a + b + c) * (k + 1) : b * k,
          ],
          solution: t(
            `The longest sides correspond, so the scale factor is $\\frac{${c * k}}{${c}} = ${k}$. ${perimeter ? `Perimeters scale by the same factor: $${k}(${a} + ${b} + ${c}) = ${asked}$.` : `The shortest sides correspond too: $${k} \\cdot ${a} = ${asked}$.`}`,
            `最长边相互对应，所以比例因子是 $\\frac{${c * k}}{${c}} = ${k}$。${perimeter ? `周长按同一比例因子缩放：$${k}(${a} + ${b} + ${c}) = ${asked}$。` : `最短边也相互对应：$${k} \\cdot ${a} = ${asked}$。`}`,
          ),
        });
      },
    ),
    kp(
      "a-length-cut-off-by-a-parallel-line",
      t("A length cut off by a parallel line", "平行线截出的长度"),
      t(
        "A line parallel to one side of a triangle cuts off a smaller triangle similar to the whole, because the corresponding angles are equal. Compare whole with whole: if $AD = 4$ and $DB = 6$, the whole side $AB$ is $10$, not $6$, so $\\frac{DE}{BC} = \\frac{4}{10}$. Using $\\frac{4}{6}$ is the common mistake.",
        "平行于三角形一边的直线截出一个与原三角形相似的小三角形，因为同位角相等。要用整条边比较：若 $AD = 4$，$DB = 6$，则整条边 $AB$ 是 $10$，不是 $6$，所以 $\\frac{DE}{BC} = \\frac{4}{10}$。用 $\\frac{4}{6}$ 是常见错误。",
      ),
      (rng) => {
        const [u, v] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 1],
          [3, 2],
          [2, 1],
          [3, 1],
          [2, 5],
          [3, 5],
          [3, 4],
        ] as const);
        const n = u + v;
        const m = rng.int(1, 4);
        const w = rng.int(1, 5);
        const AD = u * m;
        const DB = v * m;
        const BC = n * w;
        const DE = u * w;
        const askBC = rng.bool();
        const A: Pt = [0.45, 1];
        const B: Pt = [0, 0];
        const C: Pt = [1.3, 0];
        const f = u / n;
        const D: Pt = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f];
        const E: Pt = [A[0] + (C[0] - A[0]) * f, A[1] + (C[1] - A[1]) * f];
        const figure = sceneFigure({
          shapes: [{ pts: [A, B, C], closed: true }, { pts: [D, E] }],
          labels: [
            { at: A, text: "A", from: [0.6, 0], by: 14 },
            { at: B, text: "B", from: A, by: 14 },
            { at: C, text: "C", from: A, by: 14 },
            { at: D, text: "D", from: E, by: 14 },
            { at: E, text: "E", from: D, by: 14 },
            { at: [(A[0] + D[0]) / 2, (A[1] + D[1]) / 2], text: `${AD}`, from: C, by: 14 },
            { at: [(B[0] + D[0]) / 2, (B[1] + D[1]) / 2], text: `${DB}`, from: C, by: 14 },
            ...(askBC
              ? [{ at: [(D[0] + E[0]) / 2, D[1]] as Pt, text: `${DE}`, from: A, by: 10 }]
              : [{ at: [0.65, 0] as Pt, text: `${BC}`, from: A, by: 14 }]),
          ],
        });
        return withFigure(
          numberProblem({
            prompt: t(
              `In the figure, $\\overline{DE}$ is parallel to $\\overline{BC}$. What is the length of $\\overline{${askBC ? "BC" : "DE"}}$?`,
              `图中 $\\overline{DE}$ 平行于 $\\overline{BC}$。求 $\\overline{${askBC ? "BC" : "DE"}}$ 的长。`,
            ),
            answer: askBC ? BC : DE,
            wrong: askBC ? [Q.of(DE * DB, AD), DE + DB, DE * AD, BC + 1] : [Q.of(BC * AD, DB), BC - DB, Q.of(BC, 2), DE + 1],
            solution: t(
              `The parallel line makes triangle $ADE$ similar to triangle $ABC$, so compare the whole side $AB = ${AD} + ${DB} = ${AD + DB}$ with $AD$.${steps(askBC ? `\\frac{BC}{${DE}} = \\frac{${AD + DB}}{${AD}}, \\quad BC = ${BC}` : `\\frac{DE}{${BC}} = \\frac{${AD}}{${AD + DB}}, \\quad DE = ${DE}`)}`,
              `平行线使三角形 $ADE$ 与三角形 $ABC$ 相似，所以要用整条边 $AB = ${AD} + ${DB} = ${AD + DB}$ 与 $AD$ 比较。${steps(askBC ? `\\frac{BC}{${DE}} = \\frac{${AD + DB}}{${AD}}, \\quad BC = ${BC}` : `\\frac{DE}{${BC}} = \\frac{${AD}}{${AD + DB}}, \\quad DE = ${DE}`)}`,
            ),
          }),
          figure,
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Measures recovered from other measures

/** recoveringMeasuresOfSquaresAndRectangles goes from area to perimeter and back. */
export const recoveringMeasuresOfSquaresAndRectangles = topic(
  "recovering-measures-of-squares-and-rectangles",
  t("Recovering Measures of Squares and Rectangles", "还原正方形和长方形的量"),
  t(
    "Recover the side of a square or the sides of a rectangle from its area, perimeter or a relation between its sides, then find another measure.",
    "由面积、周长或边之间的关系还原正方形的边或长方形的边，再求另一个量。",
  ),
  ["area-of-rectangles-and-squares", "properties-of-rectangles-and-squares"],
  ["4.MD.A.3"],
  [
    kp(
      "from-one-measure-of-a-square-to-another",
      t("From one measure of a square to another", "由正方形的一个量求另一个量"),
      t(
        "Everything about a square follows from its side, so recover the side first. An area of $49$ gives a side of $\\sqrt{49} = 7$; a perimeter of $28$ gives a side of $\\frac{28}{4} = 7$. Going straight from area to perimeter by dividing or multiplying by four skips this step and is a common error.",
        "正方形的一切都由边决定，所以先还原边。面积 $49$ 给出边长 $\\sqrt{49} = 7$；周长 $28$ 给出边长 $\\frac{28}{4} = 7$。直接把面积乘或除以四得到周长，跳过了这一步，是常见错误。",
      ),
      (rng) => {
        const s = rng.int(3, 25);
        const form = rng.int(0, 2);
        if (form === 0)
          return numberProblem({
            prompt: t(
              `A square has area $${s * s}$ square units. What is its perimeter?`,
              `一个正方形的面积是 $${s * s}$ 平方单位。它的周长是多少？`,
            ),
            answer: 4 * s,
            wrong: [s, 4 * s * s, Q.of(s * s, 4), 2 * s],
            solution: t(
              `Recover the side first, because the perimeter depends on it: $\\sqrt{${s * s}} = ${s}$. So the perimeter is $4 \\cdot ${s} = ${4 * s}$.`,
              `先还原边长，因为周长由它决定：$\\sqrt{${s * s}} = ${s}$。所以周长是 $4 \\cdot ${s} = ${4 * s}$。`,
            ),
          });
        if (form === 1)
          return numberProblem({
            prompt: t(`A square has perimeter $${4 * s}$ units. What is its area?`, `一个正方形的周长是 $${4 * s}$ 单位。它的面积是多少？`),
            answer: s * s,
            wrong: [s, 16 * s * s, 4 * s, 2 * s * s],
            solution: t(
              `Recover the side first: $\\frac{${4 * s}}{4} = ${s}$. So the area is $${s}^{2} = ${s * s}$.`,
              `先还原边长：$\\frac{${4 * s}}{4} = ${s}$。所以面积是 $${s}^{2} = ${s * s}$。`,
            ),
          });
        const m = rng.pick([2, 3]);
        return numberProblem({
          prompt: t(
            `A square has area $${s * s}$. A second square has sides $${m}$ times as long. What is the perimeter of the second square?`,
            `一个正方形的面积是 $${s * s}$。第二个正方形的边长是它的 $${m}$ 倍。第二个正方形的周长是多少？`,
          ),
          answer: 4 * m * s,
          wrong: [m * s, 4 * s, 4 * m * m * s, m * m * s * s],
          solution: t(
            `The first side is $\\sqrt{${s * s}} = ${s}$, so the second side is $${m * s}$ and its perimeter is $4 \\cdot ${m * s} = ${4 * m * s}$.`,
            `第一个正方形的边长是 $\\sqrt{${s * s}} = ${s}$，所以第二个的边长是 $${m * s}$，周长是 $4 \\cdot ${m * s} = ${4 * m * s}$。`,
          ),
        });
      },
    ),
    kp(
      "from-a-relation-to-the-sides-of-a-rectangle",
      t("From a relation to the sides of a rectangle", "由关系求长方形的边"),
      t(
        "A rectangle has two unknown sides, so two facts are needed. If the length is $k$ times the width and the perimeter is $P$, write both sides with one letter: $2(kw + w) = P$. Solve for $w$, find the length, and only then compute the area or whatever else is asked for.",
        "长方形有两条未知的边，所以需要两个条件。若长是宽的 $k$ 倍，周长是 $P$，就用同一个字母表示两边：$2(kw + w) = P$。解出 $w$，求出长，然后再算面积或其他所求的量。",
      ),
      (rng) => {
        const w = rng.int(2, 15);
        const form = rng.int(0, 2);
        const k = rng.int(2, 5);
        const d = rng.int(2, 12);
        if (form === 0) {
          const l = k * w;
          const P = 2 * (l + w);
          return withFigure(
            numberProblem({
              prompt: t(
                `The length of a rectangle is $${k}$ times its width, and its perimeter is $${P}$. What is its area?`,
                `长方形的长是宽的 $${k}$ 倍，周长是 $${P}$。它的面积是多少？`,
              ),
              answer: l * w,
              wrong: [P, w * w, l * l, 2 * l * w],
              solution: t(
                `Write both sides with $w$ and use the perimeter to find it.${steps(`2(${k}w + w) = ${P}`, `w = ${w}`)}The length is $${l}$, so the area is $${l} \\cdot ${w} = ${l * w}$.`,
                `用 $w$ 表示两边，由周长求 $w$。${steps(`2(${k}w + w) = ${P}`, `w = ${w}`)}长是 $${l}$，所以面积是 $${l} \\cdot ${w} = ${l * w}$。`,
              ),
            }),
            rectFigure(k, 1, `${k}w`, "w"),
          );
        }
        if (form === 1) {
          const l = w + d;
          const P = 2 * (l + w);
          return withFigure(
            numberProblem({
              prompt: t(
                `The length of a rectangle is $${d}$ more than its width, and its perimeter is $${P}$. What is its area?`,
                `长方形的长比宽多 $${d}$，周长是 $${P}$。它的面积是多少？`,
              ),
              answer: l * w,
              wrong: [P, w * w, l * l, l + w],
              solution: t(
                `Write both sides with $w$ and use the perimeter to find it.${steps(`2(w + ${d} + w) = ${P}`, `w = ${w}`)}The length is $${l}$, so the area is $${l} \\cdot ${w} = ${l * w}$.`,
                `用 $w$ 表示两边，由周长求 $w$。${steps(`2(w + ${d} + w) = ${P}`, `w = ${w}`)}长是 $${l}$，所以面积是 $${l} \\cdot ${w} = ${l * w}$。`,
              ),
            }),
            rectFigure(w + d, w, `w + ${d}`, "w"),
          );
        }
        const l = w + d;
        return numberProblem({
          prompt: t(
            `A rectangle has area $${l * w}$ and width $${w}$. What is its perimeter?`,
            `长方形的面积是 $${l * w}$，宽是 $${w}$。它的周长是多少？`,
          ),
          answer: 2 * (l + w),
          wrong: [l + w, l, 2 * l + w, l * w],
          solution: t(
            `The area gives the length, because area is length times width: $\\frac{${l * w}}{${w}} = ${l}$. So the perimeter is $2(${l} + ${w}) = ${2 * (l + w)}$.`,
            `面积给出长，因为面积等于长乘宽：$\\frac{${l * w}}{${w}} = ${l}$。所以周长是 $2(${l} + ${w}) = ${2 * (l + w)}$。`,
          ),
        });
      },
    ),
  ],
);

/** triangleOnGrid draws a triangle on a coordinate grid. */
function triangleOnGrid(p: Pt, q: Pt, r: Pt, box?: boolean): Figure {
  const xs = [p[0], q[0], r[0], 0];
  const ys = [p[1], q[1], r[1], 0];
  const [x0, x1, y0, y1] = [Math.min(...xs) - 1, Math.max(...xs) + 1, Math.min(...ys) - 1, Math.max(...ys) + 1];
  const size = Math.max(x1 - x0, y1 - y0);
  const dashed = box
    ? (() => {
        const [a, b, c, d] = [
          Math.min(p[0], q[0], r[0]),
          Math.max(p[0], q[0], r[0]),
          Math.min(p[1], q[1], r[1]),
          Math.max(p[1], q[1], r[1]),
        ];
        const corners: Pt[] = [
          [a, c],
          [b, c],
          [b, d],
          [a, d],
        ];
        return corners.map((u, i) => ({ kind: "segment" as const, a: u, b: corners[(i + 1) % 4] as Pt, dashed: true }));
      })()
    : [];
  return {
    svg: plane({ xMin: x0, xMax: x0 + size, yMin: y0, yMax: y0 + size, labelEvery: size > 14 ? 2 : 1 }, [
      ...dashed,
      { kind: "segment", a: p, b: q, accent: true },
      { kind: "segment", a: q, b: r, accent: true },
      { kind: "segment", a: r, b: p, accent: true },
      { kind: "point", at: p },
      { kind: "point", at: q },
      { kind: "point", at: r },
    ]),
    alt: t(
      `A coordinate grid with a triangle whose vertices are $(${p[0]}, ${p[1]})$, $(${q[0]}, ${q[1]})$ and $(${r[0]}, ${r[1]})$.`,
      `坐标网格上的一个三角形，顶点为 $(${p[0]}, ${p[1]})$、$(${q[0]}, ${q[1]})$ 和 $(${r[0]}, ${r[1]})$。`,
    ),
  };
}

/** findingACoordinateTrianglesArea finds areas of triangles from their vertices. */
export const findingACoordinateTrianglesArea = topic(
  "finding-a-coordinate-triangles-area",
  t("Finding a Coordinate Triangle's Area", "求坐标三角形的面积"),
  t(
    "Find the area of a triangle from the coordinates of its vertices, using a side along a grid line as the base or an enclosing rectangle when no side is.",
    "由顶点坐标求三角形的面积：有边沿网格线时以它为底，否则用外接长方形。",
  ),
  ["finding-areas-and-perimeters-in-the-coordinate-plane"],
  ["6.G.A.3"],
  [
    kp(
      "a-side-along-a-grid-line",
      t("A side along a grid line", "有一边沿网格线"),
      t(
        "If two vertices share a coordinate, the side between them lies along a grid line, and its length is the difference of the other coordinates. Use it as the base. The height is the distance from the third vertex to that line, again a difference of coordinates. The triangle need not have a right angle for this to work.",
        "如果两个顶点有一个坐标相同，它们之间的边就沿着网格线，长度是另一个坐标的差。用它作底。高是第三个顶点到这条直线的距离，同样是坐标之差。这个方法不要求三角形有直角。",
      ),
      (rng) => {
        const a = rng.int(-6, 2);
        const y = rng.int(-5, 3);
        const base = 2 * rng.int(1, 5);
        const h = rng.int(2, 8);
        const up = rng.bool() ? 1 : -1;
        const x3 = rng.int(a - 2, a + base + 2);
        const horizontal = rng.bool();
        const pts: readonly [Pt, Pt, Pt] = horizontal
          ? [
              [a, y],
              [a + base, y],
              [x3, y + up * h],
            ]
          : [
              [y, a],
              [y, a + base],
              [y + up * h, x3],
            ];
        const answer = (base * h) / 2;
        return withFigure(
          numberProblem({
            prompt: t(
              `What is the area of the triangle with vertices $(${pts[0][0]}, ${pts[0][1]})$, $(${pts[1][0]}, ${pts[1][1]})$ and $(${pts[2][0]}, ${pts[2][1]})$?`,
              `求顶点为 $(${pts[0][0]}, ${pts[0][1]})$、$(${pts[1][0]}, ${pts[1][1]})$、$(${pts[2][0]}, ${pts[2][1]})$ 的三角形的面积。`,
            ),
            answer,
            wrong: [base * h, base + h, h * h, Q.of(base * base, 2)],
            solution: t(
              `The first two vertices share a coordinate, so that side is a base of length $${base}$. The height is the distance from the third vertex to that line, $${h}$. The area is $\\frac{1}{2}(${base})(${h}) = ${answer}$.`,
              `前两个顶点有一个坐标相同，所以这条边可作底，长为 $${base}$。高是第三个顶点到这条直线的距离 $${h}$。面积是 $\\frac{1}{2}(${base})(${h}) = ${answer}$。`,
            ),
          }),
          triangleOnGrid(pts[0], pts[1], pts[2]),
        );
      },
    ),
    kp(
      "using-an-enclosing-rectangle",
      t("Using an enclosing rectangle", "用外接长方形"),
      t(
        "When no side lies along a grid line, draw the smallest rectangle around the triangle, with sides on grid lines. The rectangle is made up of the triangle and right triangles at the corners. Their legs can be read off the grid, so subtract their areas from the area of the rectangle to leave the area wanted.",
        "如果没有边沿网格线，就画出外接最小的、各边在网格线上的长方形。这个长方形由所求三角形和角上的直角三角形组成。这些直角三角形的直角边可以从网格读出，从长方形面积中减去它们的面积，就得到所求面积。",
      ),
      (rng) => {
        // Vertices at a corner of the box and on the two far sides.
        const X = rng.int(4, 8);
        const Y = rng.int(4, 8);
        const u = rng.int(1, X - 1);
        const v = rng.int(1, Y - 1);
        const ox = rng.int(-2, 2);
        const oy = rng.int(-2, 2);
        const p: Pt = [ox, oy];
        const q: Pt = [ox + X, oy + v];
        const r: Pt = [ox + u, oy + Y];
        const box = X * Y;
        const c1 = X * v;
        const c2 = (X - u) * (Y - v);
        const c3 = u * Y;
        const answer = Q.of(2 * box - c1 - c2 - c3, 2);
        return withFigure(
          numberProblem({
            prompt: t(
              `What is the area of the triangle with vertices $(${p[0]}, ${p[1]})$, $(${q[0]}, ${q[1]})$ and $(${r[0]}, ${r[1]})$?`,
              `求顶点为 $(${p[0]}, ${p[1]})$、$(${q[0]}, ${q[1]})$、$(${r[0]}, ${r[1]})$ 的三角形的面积。`,
            ),
            answer,
            wrong: [box, Q.of(box, 2), Q.of(c1 + c2 + c3, 2), box - c1 - c2 - c3],
            solution: t(
              `No side lies on a grid line, so enclose the triangle in a rectangle of area $${X} \\cdot ${Y} = ${box}$ and subtract the three corner triangles.${steps(`${box} - \\frac{${X} \\cdot ${v}}{2} - \\frac{${X - u} \\cdot ${Y - v}}{2} - \\frac{${u} \\cdot ${Y}}{2} = ${answer.toLatex()}`)}`,
              `没有边在网格线上，所以用面积为 $${X} \\cdot ${Y} = ${box}$ 的长方形围住三角形，再减去角上的三个三角形。${steps(`${box} - \\frac{${X} \\cdot ${v}}{2} - \\frac{${X - u} \\cdot ${Y - v}}{2} - \\frac{${u} \\cdot ${Y}}{2} = ${answer.toLatex()}`)}`,
            ),
          }),
          triangleOnGrid(p, q, r, true),
        );
      },
    ),
  ],
);

/** boxFigure draws a rectangular box with labels on three edges. */
function boxFigure(l: string, w: string, h: string): Figure {
  const [L, W, H] = [1.6, 0.6, 0.9];
  const f: readonly Pt[] = [
    [0, 0],
    [L, 0],
    [L, H],
    [0, H],
  ];
  const b = f.map((p): Pt => [p[0] + W * 0.7, p[1] + W * 0.5]);
  const edge = (a: Pt, c: Pt, dash?: boolean) => ({ pts: [a, c], ...(dash ? { dash: true } : {}) });
  return sceneFigure({
    shapes: [
      { pts: f, closed: true },
      edge(f[1] as Pt, b[1] as Pt),
      edge(f[2] as Pt, b[2] as Pt),
      edge(f[3] as Pt, b[3] as Pt),
      edge(b[1] as Pt, b[2] as Pt),
      edge(b[2] as Pt, b[3] as Pt),
      edge(f[0] as Pt, b[0] as Pt, true),
      edge(b[0] as Pt, b[1] as Pt, true),
      edge(b[0] as Pt, b[3] as Pt, true),
    ],
    labels: [
      { at: [L / 2, 0], text: l, from: [L / 2, H], by: 14 },
      { at: [L + (W * 0.7) / 2, (W * 0.5) / 2], text: w, from: [0, H], by: 16 },
      { at: [0, H / 2], text: h, from: [L, H / 2], by: 14 },
    ],
  });
}

/** cylinderFigure draws a cylinder with its radius and height labeled. */
function cylinderFigure(r: string, h: string): Figure {
  const ellipse = (y: number, from: number, to: number) =>
    Array.from({ length: 25 }, (_, i): Pt => {
      const a = rad(from + ((to - from) * i) / 24);
      return [Math.cos(a), y + 0.3 * Math.sin(a)];
    });
  return sceneFigure({
    shapes: [
      { pts: ellipse(1.6, 0, 360), closed: true },
      { pts: ellipse(0, 180, 360) },
      { pts: ellipse(0, 0, 180), dash: true },
      {
        pts: [
          [-1, 0],
          [-1, 1.6],
        ],
      },
      {
        pts: [
          [1, 0],
          [1, 1.6],
        ],
      },
      {
        pts: [
          [0, 1.6],
          [1, 1.6],
        ],
      },
    ],
    labels: [
      { at: [0.5, 1.6], text: r, from: [0.5, 0], by: 12 },
      { at: [1, 0.8], text: h, from: [0, 0.8], by: 14 },
    ],
  });
}

/** recoveringSolidMeasuresFromDiagrams finds a missing measure of a labeled solid from its volume or surface area. */
export const recoveringSolidMeasuresFromDiagrams = topic(
  "recovering-solid-measures-from-diagrams",
  t("Recovering Solid Measures From Diagrams", "由示意图还原立体的量"),
  t(
    "Use a labeled diagram of a box or a cylinder together with its volume to find a missing measure, then find a further measure from it.",
    "利用长方体或圆柱的标注示意图及其体积求出缺失的量，再由此求另一个量。",
  ),
  ["volumes-of-cylinders", "surface-areas-of-rectangular-solids"],
  ["7.G.B.6", "8.G.C.9"],
  [
    kp(
      "a-box-with-one-edge-missing",
      t("A box with one edge missing", "缺一条棱的长方体"),
      t(
        "A diagram labels the edges it knows and leaves a letter on the others. Write the volume formula $V = lwh$ with those labels, then solve for the letter by dividing. Once all three edges are known, other measures are available, such as the surface area $2(lw + lh + wh)$, which counts each pair of opposite faces.",
        "示意图标出已知的棱，其余的棱用字母表示。把这些标注代入体积公式 $V = lwh$，再用除法解出字母。三条棱都知道后，就能求其他量，比如表面积 $2(lw + lh + wh)$，它计入了每对相对的面。",
      ),
      (rng) => {
        const l = rng.int(3, 12);
        const w = rng.int(2, 8);
        const h = rng.int(2, 9);
        const V = l * w * h;
        const S = 2 * (l * w + l * h + w * h);
        const surface = rng.bool();
        return withFigure(
          numberProblem({
            prompt: t(
              `The volume of the box shown is $${V}$ cubic units. What is ${surface ? "its surface area, in square units" : "the value of $h$"}?`,
              `图中长方体的体积是 $${V}$ 立方单位。求${surface ? "它的表面积（平方单位）" : "$h$ 的值"}。`,
            ),
            answer: surface ? S : h,
            wrong: surface ? [S / 2, l * w + l * h + w * h + l, V, 2 * (l + w + h)] : [V - l - w, Q.of(V, l), Q.of(V, w), h + 1],
            solution: t(
              `Put the labels into the volume formula to find the missing edge: $${l} \\cdot ${w} \\cdot h = ${V}$, so $h = ${h}$.${surface ? ` Each pair of opposite faces counts twice, so the surface area is $2(${l * w} + ${l * h} + ${w * h}) = ${S}$.` : ""}`,
              `把标注代入体积公式求缺失的棱：$${l} \\cdot ${w} \\cdot h = ${V}$，所以 $h = ${h}$。${surface ? `每对相对的面都算两次，所以表面积是 $2(${l * w} + ${l * h} + ${w * h}) = ${S}$。` : ""}`,
            ),
          }),
          boxFigure(`${l}`, `${w}`, "h"),
        );
      },
    ),
    kp(
      "a-cylinder-with-one-measure-missing",
      t("A cylinder with one measure missing", "缺一个量的圆柱"),
      t(
        "A cylinder's volume is $V = \\pi r^{2}h$, its base area times its height. When a diagram gives $r$ and the volume, divide by $\\pi r^{2}$ to find $h$. When it gives $h$, divide by $\\pi h$ and then take a square root to find $r$. Volumes here are given as a multiple of $\\pi$, so $\\pi$ cancels.",
        "圆柱的体积是 $V = \\pi r^{2}h$，即底面积乘高。示意图给出 $r$ 和体积时，除以 $\\pi r^{2}$ 求 $h$。给出 $h$ 时，除以 $\\pi h$ 再开平方求 $r$。这里的体积写成 $\\pi$ 的倍数，所以 $\\pi$ 可以约去。",
      ),
      (rng) => {
        const r = rng.int(2, 9);
        const h = rng.int(2, 12);
        const k = r * r * h;
        const askH = rng.bool();
        return withFigure(
          numberProblem({
            prompt: t(
              `The volume of the cylinder shown is $${k}\\pi$ cubic units. What is the value of $${askH ? "h" : "r"}$?`,
              `图中圆柱的体积是 $${k}\\pi$ 立方单位。求 $${askH ? "h" : "r"}$ 的值。`,
            ),
            answer: askH ? h : r,
            solveFor: askH ? "h" : "r",
            wrong: askH ? [Q.of(k, r), k - r * r, h + r] : [Q.of(k, h), Q.of(k, 2 * h), r + h],
            solution: t(
              `Put the labels into $V = \\pi r^{2}h$; the factor $\\pi$ cancels because the volume is a multiple of it.${steps(askH ? `${k} = ${r}^{2}h`.concat(`, \\quad h = \\frac{${k}}{${r * r}} = ${h}`) : `${k} = r^{2} \\cdot ${h}, \\quad r^{2} = ${r * r}, \\quad r = ${r}`)}`,
              `把标注代入 $V = \\pi r^{2}h$；体积是 $\\pi$ 的倍数，所以 $\\pi$ 可以约去。${steps(askH ? `${k} = ${r}^{2}h`.concat(`, \\quad h = \\frac{${k}}{${r * r}} = ${h}`) : `${k} = r^{2} \\cdot ${h}, \\quad r^{2} = ${r * r}, \\quad r = ${r}`)}`,
            ),
          }),
          askH ? cylinderFigure(`${r}`, "h") : cylinderFigure("r", `${h}`),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Circles

/** reasoningFromCompositeCircleFigures finds shaded areas and lengths of figures built from circles. */
export const reasoningFromCompositeCircleFigures = topic(
  "reasoning-from-composite-circle-figures",
  t("Reasoning From Composite Circle Figures", "由组合圆形图推理"),
  t(
    "Find the area between two circles and the part of a square outside its inscribed circle, by subtracting the area of one region from another.",
    "用一个区域的面积减去另一个区域的面积，求两圆之间的面积和正方形内切圆之外的部分。",
  ),
  ["composite-shapes-with-circles"],
  ["7.G.B.4", "7.G.B.6"],
  [
    kp(
      "the-area-between-two-circles",
      t("The area between two circles", "两圆之间的面积"),
      t(
        "The region between two circles with one center is the larger disk with the smaller one removed, so its area is $\\pi R^{2} - \\pi r^{2}$. Square each radius before subtracting. The tempting $\\pi(R - r)^{2}$ gives the area of a circle whose radius is the gap, which is much too small.",
        "同心两圆之间的区域，是大圆去掉小圆，所以面积是 $\\pi R^{2} - \\pi r^{2}$。要先分别平方再相减。容易误用的 $\\pi(R - r)^{2}$ 是半径等于两圆间距的圆的面积，比实际小得多。",
      ),
      (rng) => {
        const r = rng.int(1, 8);
        const R = r + rng.int(1, 6);
        const k = R * R - r * r;
        return withFigure(
          numberProblem({
            prompt: t(
              `The two circles shown share a center, with radii as labeled. The area of the shaded ring, in square units, is $k\\pi$. What is $k$?`,
              `图中两圆同心，半径如图所标。阴影圆环的面积（平方单位）是 $k\\pi$。求 $k$。`,
            ),
            answer: k,
            solveFor: "k",
            wrong: [(R - r) * (R - r), R - r, R * R + r * r, 2 * (R - r)],
            solution: t(
              `The ring is the large disk with the small one removed, so subtract the two areas.${steps(`\\pi(${R})^{2} - \\pi(${r})^{2} = ${R * R}\\pi - ${r * r}\\pi = ${k}\\pi`)}`,
              `圆环是大圆去掉小圆，所以把两个面积相减。${steps(`\\pi(${R})^{2} - \\pi(${r})^{2} = ${R * R}\\pi - ${r * r}\\pi = ${k}\\pi`)}`,
            ),
          }),
          ringFigure(r, R),
        );
      },
    ),
    kp(
      "a-square-around-a-circle",
      t("A square around a circle", "圆外的正方形"),
      t(
        "A circle inscribed in a square touches all four sides, so its diameter equals the side of the square and its radius is half the side. The shaded corners are the square with the circle removed: $s^{2} - \\pi\\left(\\frac{s}{2}\\right)^{2}$. Using the whole side as the radius is the common error here.",
        "正方形的内切圆与四条边都相切，所以直径等于正方形的边长，半径是边长的一半。阴影的四个角是正方形去掉圆：$s^{2} - \\pi\\left(\\frac{s}{2}\\right)^{2}$。把整条边当作半径是这里常见的错误。",
      ),
      (rng) => {
        const r = rng.int(3, 20);
        const s = 2 * r;
        const byPerimeter = rng.bool();
        const area = `${s * s} - ${r * r}\\pi`;
        const math = (v: string) => same(`$${v}$`);
        return withFigure(
          pickChoice(
            rng,
            t(
              `A circle is inscribed in a square with ${byPerimeter ? `perimeter $${4 * s}$` : `side length $${s}$`}. What is the area of the shaded region inside the square and outside the circle?`,
              `圆内切于${byPerimeter ? `周长为 $${4 * s}$` : `边长为 $${s}$`} 的正方形。正方形内、圆外的阴影区域面积是多少？`,
            ),
            math(area),
            [math(`${s * s} - ${s * s}\\pi`), math(`${s * s} - ${s}\\pi`), math(`${4 * s} - ${r * r}\\pi`)],
            t(
              `The circle's diameter equals the side, so its radius is $${r}$. Subtract the circle from the square: $${s}^{2} - \\pi(${r})^{2} = ${area}$.`,
              `圆的直径等于边长，所以半径是 $${r}$。从正方形中减去圆：$${s}^{2} - \\pi(${r})^{2} = ${area}$。`,
            ),
          ),
          squareCircleFigure(byPerimeter ? { shade: true } : { side: `${s}`, shade: true }),
        );
      },
    ),
  ],
);

/** centralAngles lists central angles in degrees. */
const centralAngles = [30, 45, 60, 72, 90, 120, 135, 150, 180, 210, 240, 270, 300];

/** recoveringMeasuresFromCentralAngles finds a radius or a central angle from an arc length or a sector area. */
export const recoveringMeasuresFromCentralAngles = topic(
  "recovering-measures-from-central-angles",
  t("Recovering Measures From Central Angles", "由圆心角还原量"),
  t(
    "Use the share of a circle that a central angle takes to recover the radius from an arc or sector, or the angle from an arc or sector and the radius.",
    "利用圆心角占整圆的份额，由弧或扇形还原半径，或由弧或扇形和半径还原圆心角。",
  ),
  ["calculating-areas-of-circular-sectors"],
  ["HSG.C.B.5"],
  [
    kp(
      "the-radius-from-a-sector",
      t("The radius from a sector", "由扇形求半径"),
      t(
        "A central angle takes the fraction $\\frac{\\theta}{360}$ of the circle, so the arc is that fraction of the circumference and the sector is that fraction of the area. Dividing a given arc or sector by this fraction recovers the whole circle's measure, from which the radius follows. For an area this last step needs a square root.",
        "圆心角占整圆的 $\\frac{\\theta}{360}$，所以弧是圆周长的这一份额，扇形是圆面积的这一份额。用已知的弧或扇形除以这个份额，就得到整圆的量，再由此求半径。对面积来说，最后一步要开平方。",
      ),
      (rng) => {
        const a = rng.pick(centralAngles);
        const arc = rng.bool();
        const options = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30].filter((r) => (arc ? (a * r) % 180 === 0 : (a * r * r) % 360 === 0));
        const r = rng.pick(options.length ? options : [12]);
        const v = arc ? (a * r) / 180 : (a * r * r) / 360;
        const name = arc ? t("arc", "弧") : t("sector", "扇形");
        const whole = arc ? 2 * r : r * r;
        return withFigure(
          numberProblem({
            prompt: arc
              ? t(
                  `In the figure, a central angle of $${deg(a)}$ cuts off an arc of length $${v}\\pi$. What is the radius of the circle?`,
                  `图中 $${deg(a)}$ 的圆心角所对的弧长为 $${v}\\pi$。求圆的半径。`,
                )
              : t(
                  `In the figure, a sector with a central angle of $${deg(a)}$ has area $${v}\\pi$. What is the radius of the circle?`,
                  `图中圆心角为 $${deg(a)}$ 的扇形面积为 $${v}\\pi$。求圆的半径。`,
                ),
            answer: r,
            wrong: [whole, v, Q.of(360, a), r + 2, arc ? Q.of(r, 2) : r * r],
            solution: t(
              `The ${name.en} takes $\\frac{${a}}{360} = ${fr(a, 360)}$ of the circle, so divide to recover the whole ${arc ? "circumference" : "area"}.${steps(arc ? `2\\pi r = ${v}\\pi \\div ${fr(a, 360)} = ${whole}\\pi` : `\\pi r^{2} = ${v}\\pi \\div ${fr(a, 360)} = ${whole}\\pi`, `r = ${r}`)}`,
              `${name["zh-CN"]}占整圆的 $\\frac{${a}}{360} = ${fr(a, 360)}$，所以用除法还原整个${arc ? "圆周长" : "圆面积"}。${steps(arc ? `2\\pi r = ${v}\\pi \\div ${fr(a, 360)} = ${whole}\\pi` : `\\pi r^{2} = ${v}\\pi \\div ${fr(a, 360)} = ${whole}\\pi`, `r = ${r}`)}`,
            ),
          }),
          sectorFigure(a, deg(a).replace("^{\\circ}", "°"), null),
        );
      },
    ),
    kp(
      "the-central-angle-from-a-sector",
      t("The central angle from a sector", "由扇形求圆心角"),
      t(
        "If the radius is known too, compare the part with the whole. The arc over the circumference, or the sector over the area of the circle, is the share of the circle, and multiplying by $360^{\\circ}$ turns that share into degrees. An arc of $4\\pi$ on a circle of radius $6$ is $\\frac{4\\pi}{12\\pi} = \\frac{1}{3}$ of it, or $120^{\\circ}$.",
        "半径也已知时，就比较部分和整体。弧长除以圆周长，或扇形面积除以圆面积，就是占整圆的份额，乘 $360^{\\circ}$ 就化成度数。半径为 $6$ 的圆上弧长 $4\\pi$ 占 $\\frac{4\\pi}{12\\pi} = \\frac{1}{3}$，即 $120^{\\circ}$。",
      ),
      (rng) => {
        const a = rng.pick(centralAngles);
        const arc = rng.bool();
        const options = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30].filter((r) => (arc ? (a * r) % 180 === 0 : (a * r * r) % 360 === 0));
        const r = rng.pick(options.length ? options : [12]);
        const v = arc ? (a * r) / 180 : (a * r * r) / 360;
        const whole = arc ? 2 * r : r * r;
        return withFigure(
          numberProblem({
            prompt: arc
              ? t(
                  `A circle of radius $${r}$ has an arc of length $${v}\\pi$. What is the measure, in degrees, of its central angle?`,
                  `半径为 $${r}$ 的圆上有一段长为 $${v}\\pi$ 的弧。它所对的圆心角是多少度？`,
                )
              : t(
                  `A circle of radius $${r}$ has a sector of area $${v}\\pi$. What is the measure, in degrees, of its central angle?`,
                  `半径为 $${r}$ 的圆中有一个面积为 $${v}\\pi$ 的扇形。它的圆心角是多少度？`,
                ),
            answer: a,
            wrong: [Q.of(v * 180, whole), Q.of(v * 360, r), 360 - a, Q.of(a, 2)],
            unit: "°",
            solution: t(
              `Compare the part with the whole circle, whose ${arc ? "circumference" : "area"} is $${whole}\\pi$, and turn the share into degrees.${steps(`\\frac{${v}\\pi}{${whole}\\pi} \\cdot 360 = ${a}`)}`,
              `把部分与整圆比较，整圆的${arc ? "周长" : "面积"}是 $${whole}\\pi$，再把份额化成度数。${steps(`\\frac{${v}\\pi}{${whole}\\pi} \\cdot 360 = ${a}`)}`,
            ),
          }),
          sectorFigure(a, "?", `${r}`),
        );
      },
    ),
  ],
);

/** circlePoints are right triangles whose legs are coordinates of a point on a circle centered at the origin. */
const circlePoints: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [10, 24, 26],
  [12, 16, 20],
  [15, 20, 25],
  [20, 21, 29],
];

/** usingACircleWithASecondCondition finds a point or a chord of a circle from the equation or the size of the circle and a further condition. */
export const usingACircleWithASecondCondition = topic(
  "using-a-circle-with-a-second-condition",
  t("Using a Circle With a Second Condition", "利用圆和第二个条件"),
  t(
    "Combine a circle's equation, area or circumference with a further condition, such as a coordinate and a quadrant or a chord's distance from the center.",
    "把圆的方程、面积或周长与另一个条件（如坐标和象限、弦到圆心的距离）结合起来。",
  ),
  ["equations-of-circles-centered-at-the-origin"],
  ["HSG.GPE.A.1", "HSG.C.A.2"],
  [
    kp(
      "a-point-on-a-circle-in-a-quadrant",
      t("A point on a circle in a quadrant", "圆上某象限中的点"),
      t(
        "A point $(x, y)$ on the circle $x^{2} + y^{2} = r^{2}$ makes a right triangle with the axes, so one coordinate and the radius give the other by subtraction. The equation allows two signs, and the quadrant, which is the second condition, chooses one. In quadrant II, for example, $x$ is negative and $y$ is positive.",
        "圆 $x^{2} + y^{2} = r^{2}$ 上的点 $(x, y)$ 与坐标轴构成直角三角形，所以由一个坐标和半径相减可得另一个坐标。方程允许两种符号，第二个条件象限决定取哪一种。例如在第二象限，$x$ 为负，$y$ 为正。",
      ),
      (rng) => {
        const tr = rng.pick(circlePoints) as readonly [number, number, number];
        const swap = rng.bool();
        const a = swap ? tr[1] : tr[0];
        const b = swap ? tr[0] : tr[1];
        const r = tr[2];
        const q = rng.int(1, 4);
        const sx = q === 1 || q === 4 ? 1 : -1;
        const sy = q <= 2 ? 1 : -1;
        const names = ["I", "II", "III", "IV"][q - 1] as string;
        const zh = ["一", "二", "三", "四"][q - 1] as string;
        const giveX = rng.bool();
        const answer = giveX ? sy * b : sx * a;
        const form = rng.int(0, 2);
        const size =
          form === 0
            ? `$x^{2} + y^{2} = ${r * r}$`
            : form === 1
              ? `the circle centered at the origin with area $${r * r}\\pi$`
              : `the circle centered at the origin with circumference $${2 * r}\\pi$`;
        const sizeZh =
          form === 0
            ? `$x^{2} + y^{2} = ${r * r}$`
            : form === 1
              ? `圆心在原点、面积为 $${r * r}\\pi$ 的圆`
              : `圆心在原点、周长为 $${2 * r}\\pi$ 的圆`;
        const given = giveX ? `x = ${sx * a}` : `y = ${sy * b}`;
        return numberProblem({
          prompt: t(
            `A point in quadrant ${names} lies on ${form === 0 ? "the circle " : ""}${size}, and at that point $${given}$. What is its ${giveX ? "$y$" : "$x$"}-coordinate?`,
            `第${zh}象限中的一点在${form === 0 ? "圆 " : ""}${sizeZh}上，在该点处 $${given}$。它的${giveX ? "纵" : "横"}坐标是多少？`,
          ),
          answer,
          wrong: [-answer, r - (giveX ? a : b), giveX ? sx * a : sy * b, r],
          solution: t(
            `The radius is $${r}$, so the equation of the circle is $x^{2} + y^{2} = ${r * r}$. Subtract the known square: the other coordinate has square $${r * r} - ${(giveX ? a : b) ** 2} = ${(giveX ? b : a) ** 2}$, so its size is $${giveX ? b : a}$. In quadrant ${names} that coordinate is ${answer > 0 ? "positive" : "negative"}, so it is $${answer}$.`,
            `半径是 $${r}$，所以圆的方程是 $x^{2} + y^{2} = ${r * r}$。减去已知的平方：另一个坐标的平方是 $${r * r} - ${(giveX ? a : b) ** 2} = ${(giveX ? b : a) ** 2}$，绝对值是 $${giveX ? b : a}$。在第${zh}象限这个坐标为${answer > 0 ? "正" : "负"}，所以它是 $${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "a-chord-at-a-distance-from-the-center",
      t("A chord at a distance from the center", "到圆心有一定距离的弦"),
      t(
        "A line from the center perpendicular to a chord bisects it, forming a right triangle with half the chord and the radius as hypotenuse. So the radius, the distance from the center and half the chord satisfy the Pythagorean theorem. Remember to double the half chord at the end if the whole chord is wanted.",
        "从圆心到弦的垂线平分这条弦，与半条弦构成直角三角形，半径是斜边。所以半径、圆心到弦的距离和半条弦满足勾股定理。如果求的是整条弦，最后要把半条弦乘 $2$。",
      ),
      (rng) => {
        const tr = rng.pick(circlePoints) as readonly [number, number, number];
        const swap = rng.bool();
        const d = swap ? tr[1] : tr[0];
        const half = swap ? tr[0] : tr[1];
        const r = tr[2];
        const form = rng.int(0, 2);
        const figure: Figure = {
          svg: plane({ xMin: -r - 2, xMax: r + 2, yMin: -r - 2, yMax: r + 2, labelEvery: r > 12 ? 10 : 5 }, [
            { kind: "circle", center: [0, 0], r },
            { kind: "segment", a: [-half, d], b: [half, d], accent: true },
            { kind: "segment", a: [0, 0], b: [0, d], dashed: true },
            { kind: "point", at: [0, 0], label: "O", dir: "sw" },
          ]),
          alt: t(
            "A circle centered at the origin with a horizontal chord above the center and a dashed segment from the center to the chord.",
            "圆心在原点的圆，圆心上方有一条水平的弦，一条虚线段从圆心垂直连到弦。",
          ),
        };
        if (form === 0)
          return {
            ...numberProblem({
              prompt: t(
                `The circle has radius $${r}$, and the chord is $${d}$ units from the center. What is the length of the chord?`,
                `圆的半径是 $${r}$，弦到圆心的距离是 $${d}$。求弦长。`,
              ),
              answer: 2 * half,
              wrong: [half, r - d, 2 * (r - d), r + d],
              solution: t(
                `The perpendicular from the center bisects the chord, so half the chord is a leg with hypotenuse $${r}$.${steps(`\\sqrt{${r}^{2} - ${d}^{2}} = ${half}`, `2 \\cdot ${half} = ${2 * half}`)}`,
                `圆心到弦的垂线平分弦，所以半条弦是直角边，斜边是 $${r}$。${steps(`\\sqrt{${r}^{2} - ${d}^{2}} = ${half}`, `2 \\cdot ${half} = ${2 * half}`)}`,
              ),
            }),
            figure,
          };
        if (form === 1)
          return {
            ...numberProblem({
              prompt: t(
                `A chord of length $${2 * half}$ is $${d}$ units from the center of the circle. What is the radius of the circle?`,
                `长为 $${2 * half}$ 的弦到圆心的距离是 $${d}$。求圆的半径。`,
              ),
              answer: r,
              wrong: [2 * half + d, half + d, 2 * r, half],
              solution: t(
                `The perpendicular bisects the chord, so the legs are $${half}$ and $${d}$, and the radius is the hypotenuse.${steps(`r = \\sqrt{${half}^{2} + ${d}^{2}} = ${r}`)}`,
                `垂线平分弦，所以两条直角边是 $${half}$ 和 $${d}$，半径是斜边。${steps(`r = \\sqrt{${half}^{2} + ${d}^{2}} = ${r}`)}`,
              ),
            }),
            figure,
          };
        return {
          ...numberProblem({
            prompt: t(
              `The circle has area $${r * r}\\pi$, and a chord has length $${2 * half}$. How far is the chord from the center?`,
              `圆的面积是 $${r * r}\\pi$，一条弦长为 $${2 * half}$。这条弦到圆心的距离是多少？`,
            ),
            answer: d,
            wrong: [r - half, half, r, r - 2 * half < 0 ? r + half : r - 2 * half],
            solution: t(
              `The area gives the radius, $${r}$. The perpendicular bisects the chord, so half the chord is $${half}$.${steps(`\\sqrt{${r}^{2} - ${half}^{2}} = ${d}`)}`,
              `由面积得半径 $${r}$。垂线平分弦，所以半条弦是 $${half}$。${steps(`\\sqrt{${r}^{2} - ${half}^{2}} = ${d}`)}`,
            ),
          }),
          figure,
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Inverse ratios

/** evaluatingTrigonometricFunctionsOfInverseRatios evaluates a trigonometric function of an inverse trigonometric ratio. */
export const evaluatingTrigonometricFunctionsOfInverseRatios = topic(
  "evaluating-trigonometric-functions-of-inverse-ratios",
  t("Evaluating Trigonometric Functions of Inverse Ratios", "求反比值的三角函数值"),
  t(
    "Evaluate expressions such as $\\cos\\left(\\sin^{-1}\\frac{3}{5}\\right)$ exactly by drawing a right triangle from the given ratio, including ratios that are negative.",
    "根据已知比值画直角三角形，精确求出 $\\cos\\left(\\sin^{-1}\\frac{3}{5}\\right)$ 这样的表达式的值，包括比值为负的情形。",
  ),
  ["evaluating-expressions-containing-inverse-trigonometric-functions"],
  ["HSF.TF.B.6", "HSG.SRT.C.8"],
  [
    kp(
      "from-a-positive-ratio-to-a-triangle",
      t("From a positive ratio to a triangle", "由正比值到三角形"),
      t(
        "$\\sin^{-1}\\frac{3}{5}$ names an acute angle whose sine is $\\frac{3}{5}$. Draw a right triangle where the opposite side is $3$ and the hypotenuse is $5$. The Pythagorean theorem gives the adjacent side, $4$, and then any other ratio of that angle can be read off: its cosine is $\\frac{4}{5}$ and its tangent is $\\frac{3}{4}$.",
        "$\\sin^{-1}\\frac{3}{5}$ 表示正弦为 $\\frac{3}{5}$ 的锐角。画一个对边为 $3$、斜边为 $5$ 的直角三角形。由勾股定理得邻边为 $4$，然后就能读出这个角的其他比值：余弦是 $\\frac{4}{5}$，正切是 $\\frac{3}{4}$。",
      ),
      (rng) => {
        const tr = rng.pick(circlePoints) as readonly [number, number, number];
        const swap = rng.bool();
        const opp = swap ? tr[1] : tr[0];
        const adj = swap ? tr[0] : tr[1];
        const hyp = tr[2];
        const ratios = {
          sin: [opp, hyp],
          cos: [adj, hyp],
          tan: [opp, adj],
        } as const;
        const inner = rng.pick(["sin", "cos", "tan"] as const);
        const outer = rng.pick((["sin", "cos", "tan"] as const).filter((n) => n !== inner));
        const [n1, d1] = ratios[inner];
        const [n2, d2] = ratios[outer];
        const answer = Q.of(n2, d2);
        return numberProblem({
          prompt: t(
            `What is the exact value of $\\${outer}\\left(\\${inner}^{-1} ${fr(n1, d1)}\\right)$?`,
            `求 $\\${outer}\\left(\\${inner}^{-1} ${fr(n1, d1)}\\right)$ 的精确值。`,
          ),
          answer,
          wrong: [Q.of(n1, d1), Q.of(d2, n2), Q.of(d1, n1), Q.of(adj, opp), Q.of(hyp, opp)],
          solution: t(
            `The inner expression names an acute angle whose $\\${inner}$ is $${fr(n1, d1)}$, so draw a right triangle with that ratio: its opposite side, adjacent side and hypotenuse are in the ratio $${opp} : ${adj} : ${hyp}$. The $\\${outer}$ of that angle is therefore $${answer.toLatex()}$.`,
            `内层表示一个 $\\${inner}$ 值为 $${fr(n1, d1)}$ 的锐角，所以画出相应的直角三角形：对边、邻边、斜边之比为 $${opp} : ${adj} : ${hyp}$。所以这个角的 $\\${outer}$ 值是 $${answer.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "from-a-negative-ratio-to-a-quadrant",
      t("From a negative ratio to a quadrant", "由负比值到象限"),
      t(
        "A negative ratio puts the angle outside quadrant I. $\\sin^{-1}$ and $\\tan^{-1}$ give an angle in quadrant IV, with negative values allowed, while $\\cos^{-1}$ gives an angle in quadrant II. The triangle still gives the sizes of the other ratios, and the quadrant gives their signs. So $\\sin\\left(\\cos^{-1}\\left(-\\frac{3}{5}\\right)\\right)$ is positive, $\\frac{4}{5}$.",
        "负比值使角不在第一象限。$\\sin^{-1}$ 和 $\\tan^{-1}$ 给出第四象限的角（取负值），$\\cos^{-1}$ 给出第二象限的角。三角形仍然给出其他比值的大小，象限决定它们的符号。所以 $\\sin\\left(\\cos^{-1}\\left(-\\frac{3}{5}\\right)\\right)$ 是正的，等于 $\\frac{4}{5}$。",
      ),
      (rng) => {
        const tr = rng.pick(circlePoints) as readonly [number, number, number];
        const swap = rng.bool();
        const opp = swap ? tr[1] : tr[0];
        const adj = swap ? tr[0] : tr[1];
        const hyp = tr[2];
        const form = rng.int(0, 3);
        const cases = [
          { inner: "sin", n1: -opp, d1: hyp, outer: "cos", answer: Q.of(adj, hyp), en: "IV", zh: "四", sign: t("positive", "正") },
          { inner: "sin", n1: -opp, d1: hyp, outer: "tan", answer: Q.of(-opp, adj), en: "IV", zh: "四", sign: t("negative", "负") },
          { inner: "cos", n1: -adj, d1: hyp, outer: "sin", answer: Q.of(opp, hyp), en: "II", zh: "二", sign: t("positive", "正") },
          { inner: "cos", n1: -adj, d1: hyp, outer: "tan", answer: Q.of(-opp, adj), en: "II", zh: "二", sign: t("negative", "负") },
        ] as const;
        const k = cases[form] as (typeof cases)[number];
        return numberProblem({
          prompt: t(
            `What is the exact value of $\\${k.outer}\\left(\\${k.inner}^{-1}\\left(${fr(k.n1, k.d1)}\\right)\\right)$?`,
            `求 $\\${k.outer}\\left(\\${k.inner}^{-1}\\left(${fr(k.n1, k.d1)}\\right)\\right)$ 的精确值。`,
          ),
          answer: k.answer,
          wrong: [k.answer.neg(), Q.of(k.n1, k.d1), Q.of(adj, opp), Q.of(hyp, opp), Q.of(-adj, opp)],
          solution: t(
            `A negative input puts the value of $\\${k.inner}^{-1}$ in quadrant ${k.en}. A triangle with these sides gives the size of $\\${k.outer}$, and in that quadrant it is ${k.sign.en}, so the value is $${k.answer.toLatex()}$.`,
            `输入为负，所以 $\\${k.inner}^{-1}$ 的值在第${k.zh}象限。这些边构成的三角形给出 $\\${k.outer}$ 的大小，在该象限它为${k.sign["zh-CN"]}，所以值是 $${k.answer.toLatex()}$。`,
          ),
        });
      },
    ),
  ],
);

/** actFundamentalsReasoningGeometryTopics lists the geometry reasoning topics of ACT Math Fundamentals. */
export const actFundamentalsReasoningGeometryTopics: readonly TopicDef[] = [
  estimatingSegmentLengthsFromOtherLengthsInAFigure,
  findingAnglesFromLinearPairsAndAdjacentAngles,
  reasoningFromRigidMotions,
  reasoningFromCompoundRightTriangles,
  matchingPartsAcrossCongruenceAndSimilarity,
  recoveringLengthsFromSimilarityDescriptions,
  recoveringMeasuresOfSquaresAndRectangles,
  findingACoordinateTrianglesArea,
  recoveringSolidMeasuresFromDiagrams,
  reasoningFromCompositeCircleFigures,
  recoveringMeasuresFromCentralAngles,
  usingACircleWithASecondCondition,
  evaluatingTrigonometricFunctionsOfInverseRatios,
];
