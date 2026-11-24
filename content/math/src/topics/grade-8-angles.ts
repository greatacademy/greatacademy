import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, linear, type Mark, type Point, Q, sketch } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { numberProblem, steps } from "../problems.ts";
import { polygonName } from "./angles.ts";
import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";
import { chosen, decided, drawn, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { tableFigure } from "./grade-8-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

// 8th Grade Math, Unit 7: angles and parallel lines, and angles in triangles and polygons.

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

/** fig builds a figure from sketch marks. */
const fig = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** rad converts degrees to radians. */
const rad = (d: number) => (d * Math.PI) / 180;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 5, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

/** degTex writes a number of degrees in LaTeX: "35^\circ". */
const degTex = (d: number | string) => `${d}^\\circ`;

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** Linear is the expression c·x + d. */
type Linear = readonly [number, number];

/** at evaluates c·x + d. */
const at = ([c, d]: Linear, x: number) => c * x + d;

/** angleTex writes c·x + d degrees in LaTeX: "(3x - 20)^\circ". */
const angleTex = ([c, d]: Linear) => `(${linear(c, d)})^\\circ`;

/** angleLabel writes c·x + d degrees for a figure: "(3x − 20)°". */
const angleLabel = ([c, d]: Linear) => `(${plain(c, d)})°`;

/** expressionFor writes the value v as c·x + d at the given x, with c from 1 to 5 and d ≠ 0, avoiding the coefficients in avoid. */
function expressionFor(rng: Rng, v: number, x: number, avoid: readonly number[] = []): Linear {
  const c = rng.pick([1, 2, 3, 4, 5].filter((k) => !avoid.includes(k) && k * x !== v));
  return [c, v - c * x];
}

/** subst writes c·x + d with a number put in for x: "3 \cdot 5 + 4". */
function subst([c, d]: Linear, x: number): string {
  const head = c === 1 ? `${x}` : `${c} \\cdot ${x}`;
  return d === 0 ? head : `${head} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
}

/** equalSteps solves c1·x + d1 = c2·x + d2 (c1 ≠ c2), collecting x on the side with the larger coefficient. */
function equalSteps([c1, d1]: Linear, [c2, d2]: Linear): string[] {
  const x = (d2 - d1) / (c1 - c2);
  const first = `${linear(c1, d1)} = ${linear(c2, d2)}`;
  if (Math.abs(c1 - c2) === 1) return [first, `x = ${x}`];
  const collected = c1 > c2 ? `${linear(c1 - c2, 0)} = ${d2 - d1}` : `${d1 - d2} = ${linear(c2 - c1, 0)}`;
  return [first, collected, `x = ${x}`];
}

/** sumSteps solves (c1·x + d1) + (c2·x + d2) + … = total. */
function sumSteps(terms: readonly Linear[], total: number): string[] {
  const c = terms.reduce((s, [ci]) => s + ci, 0);
  const d = terms.reduce((s, [, di]) => s + di, 0);
  const sum = terms.map(([ci, di]) => (di === 0 ? linear(ci, 0) : `(${linear(ci, di)})`)).join(" + ");
  const lines = [`${sum} = ${total}`, `${linear(c, d)} = ${total}`];
  if (d !== 0) lines.push(`${linear(c, 0)} = ${total - d}`);
  if (c !== 1) lines.push(`x = ${Q.of(total - d, c).toLatex()}`);
  return lines;
}

/** sumWrong are the values of x that common slips in solving the sum equation produce: the constant moved with the wrong sign, or the wrong total. */
function sumWrong(terms: readonly Linear[], total: number, wrongTotal: number): Q[] {
  const c = terms.reduce((s, [ci]) => s + ci, 0);
  const d = terms.reduce((s, [, di]) => s + di, 0);
  return [Q.of(total + d, c), Q.of(wrongTotal - d, c)];
}

/** equalWrong are the values of x that common slips in solving c1·x + d1 = c2·x + d2 produce. */
function equalWrong([c1, d1]: Linear, [c2, d2]: Linear): Q[] {
  return [Q.of(d2 + d1, c1 - c2), Q.of(d2 - d1, c1 + c2)];
}

/** awayFrom is the compass direction from c toward p, used to put a vertex name outside a figure. */
function awayFrom(p: Point, c: Point): Compass {
  const a = (Math.atan2(p[1] - c[1], p[0] - c[0]) * 180) / Math.PI;
  const names: Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];
  return names[(((Math.round(a / 45) % 8) + 8) % 8) as 0]!;
}

/** names labels points with italic letters, each pushed away from the point c. */
function names(pts: readonly Point[], letters: string, c: Point): Mark[] {
  return pts.map((p, i): Mark => ({ kind: "label", at: p, text: letters[i]!, dir: awayFrom(p, c), italic: true }));
}

/** seg is a plain segment mark. */
const seg = (a: Point, b: Point, accent = false): Mark => ({ kind: "segment", a, b, ...(accent && { accent: true }) });

/** arc marks an angle with an accent arc and an optional label. */
const arc = (vertex: Point, from: Point, to: Point, label?: string): Mark => ({
  kind: "arc",
  vertex,
  from,
  to,
  accent: true,
  ...(label && { label }),
});

// ─── Two lines cut by a transversal ─────────────────────────────────────────

/** Crossing is where the transversal meets a line: Q on ℓ (above) or P on m (below). */
type Crossing = "P" | "Q";

/** Slot is one of the eight angles a transversal makes: its crossing and its index 0 to 3, counterclockwise from upper right. */
type Slot = readonly [Crossing, number];

const other = (v: Crossing): Crossing => (v === "P" ? "Q" : "P");

/** PairKind is a kind of angle pair at the two crossings: where the partner of an angle sits, and whether parallel lines make the pair equal. */
interface PairKind {
  readonly name: Text;
  readonly partner: (s: Slot) => Slot;
  readonly equal: boolean;
  /** reason states the criterion for parallel lines that the pair gives. */
  readonly reason: Text;
}

const corresponding: PairKind = {
  name: t("corresponding angles", "同位角"),
  partner: ([v, i]) => [other(v), i],
  equal: true,
  reason: t("If corresponding angles are equal, the lines are parallel.", "同位角相等，两直线平行。"),
};

const alternateInterior: PairKind = {
  name: t("alternate interior angles", "内错角"),
  partner: ([v, i]) => [other(v), (i + 2) % 4],
  equal: true,
  reason: t("If alternate interior angles are equal, the lines are parallel.", "内错角相等，两直线平行。"),
};

const alternateExterior: PairKind = {
  ...alternateInterior,
  name: t("alternate exterior angles", "外错角"),
  reason: t("If alternate exterior angles are equal, the lines are parallel.", "外错角相等，两直线平行。"),
};

const consecutiveInterior: PairKind = {
  name: t("consecutive interior angles", "同旁内角"),
  partner: ([v, i]) => [other(v), 3 - i],
  equal: false,
  reason: t("If consecutive interior angles are supplementary, the lines are parallel.", "同旁内角互补，两直线平行。"),
};

const consecutiveExterior: PairKind = {
  ...consecutiveInterior,
  name: t("consecutive exterior angles", "同旁外角"),
  reason: t("If consecutive exterior angles are supplementary, the lines are parallel.", "同旁外角互补，两直线平行。"),
};

/** interior tells whether an angle lies between the two lines. */
const interior = ([v, i]: Slot) => (v === "Q" ? i >= 2 : i <= 1);

/** slotOf is the angle numbered n (1 to 8): 1 to 4 at Q and 5 to 8 at P, each numbered left to right, top row first. */
const slotOf = (n: number): Slot => [n <= 4 ? "Q" : "P", [1, 0, 2, 3][(n - 1) % 4]!];

/** numberOf is the number of an angle. */
const numberOf = ([v, i]: Slot) => (v === "Q" ? 0 : 4) + [2, 1, 3, 4][i]!;

/** numbered writes an angle by its number in LaTeX: "\angle 3". */
const numbered = (s: Slot) => `\\angle ${numberOf(s)}`;

/** measureAt is the measure of an angle when the transversal has direction theta and ℓ has direction tilt (m is horizontal). */
function measureAt([v, i]: Slot, theta: number, tilt = 0): number {
  const base = theta - (v === "Q" ? tilt : 0);
  return i % 2 === 0 ? base : 180 - base;
}

/** pickTheta picks the transversal's direction, at least 15° from a right angle. */
const pickTheta = (rng: Rng) => rng.pick([rng.int(50, 75), rng.int(105, 130)]);

/** AngleLabel labels one of the eight angles: with an accent arc, or with the bare text inside the angle when bare is set. */
type AngleLabel = readonly [Slot, string, boolean?];

/** gap is the distance between the two crossings, measured up the page. */
const gap = 4.5;

/** transversalFigure draws lines ℓ (through Q, direction tilt) and m (through P, horizontal) cut by a transversal of direction theta; arrows mark ℓ ∥ m. */
function transversalFigure(theta: number, tilt: number, labels: readonly AngleLabel[], arrows: boolean, en: string, zh: string): Figure {
  const p: Point = [0, 0];
  const q: Point = [gap / Math.tan(rad(theta)), gap];
  const vertex = (v: Crossing) => (v === "P" ? p : q);
  // The directions of the rays bounding angle i at a crossing: from its line or the transversal, counterclockwise.
  const bounds = (v: Crossing, i: number): [number, number] => {
    const d = v === "P" ? 0 : tilt;
    const rays = [d, theta, d + 180, theta + 180, d + 360];
    return [rays[i]!, rays[i + 1]!];
  };
  // Arrows sit a quarter of the way along each line, on the side away from the transversal.
  const ends = theta < 90 ? [-8, 8] : [8, -8];
  const marks: Mark[] = [
    seg(dir(tilt + 180, 8, q), dir(tilt, 8, q)),
    seg([-8, 0], [8, 0]),
    seg(dir(theta + 180, 2.5, p), dir(theta, 2.5, q)),
    ...(arrows
      ? [
          { kind: "arrows", a: [ends[0]!, gap], b: [ends[1]!, gap], count: 1 } as const,
          { kind: "arrows", a: [ends[0]!, 0], b: [ends[1]!, 0], count: 1 } as const,
        ]
      : []),
    { kind: "label", at: dir(tilt, 8, q), text: "ℓ", dir: "e" },
    { kind: "label", at: [8, 0], text: "m", dir: "e", italic: true },
    ...labels.map(([[v, i], text, bare]): Mark => {
      const [from, to] = bounds(v, i);
      if (bare) {
        // The narrower the angle, the farther from the vertex its number goes, to stay clear of both rays.
        const mid = (from + to) / 2;
        const r = Math.min(2, Math.max(0.8, 0.55 / Math.sin(rad((to - from) / 2))));
        return { kind: "label", at: dir(mid, r, vertex(v)), text, dir: awayFrom(dir(mid), [0, 0]) };
      }
      return { kind: "arc", vertex: vertex(v), from: dir(from, 2, vertex(v)), to: dir(to, 2, vertex(v)), label: text, accent: true };
    }),
  ];
  return fig(marks, en, zh);
}

/** numberedFigure draws two lines cut by a transversal with all eight angles numbered. */
function numberedFigure(theta: number, arrows: boolean): Figure {
  const all = [1, 2, 3, 4, 5, 6, 7, 8].map((n): AngleLabel => [slotOf(n), String(n), true]);
  return transversalFigure(
    theta,
    0,
    all,
    arrows,
    `Lines ℓ and m${arrows ? ", marked parallel," : ""} cut by a transversal. The angles at ℓ are numbered 1 to 4 and the angles at m are numbered 5 to 8, each set left to right, top row first.`,
    `直线 ℓ 与 m${arrows ? "（标为平行）" : ""}被一条截线所截。ℓ 处的角编号为 1 至 4，m 处的角编号为 5 至 8，均按先上后下、从左到右的顺序。`,
  );
}

/** positionOf describes where an angle sits at its crossing. */
function positionOf([v, i]: Slot): Text {
  const line = v === "Q" ? t("$\\ell$", "$\\ell$") : t("$m$", "$m$");
  const [up, right] = [i <= 1, i === 0 || i === 3];
  return t(
    `${up ? "above" : "below"} ${line.en} and ${right ? "right" : "left"} of the transversal`,
    `${line["zh-CN"]} 的${up ? "上方" : "下方"}、截线的${right ? "右侧" : "左侧"}`,
  );
}

/** angleOption is a choice option naming an angle by its number. */
const angleOption = (s: Slot) => mathText(numbered(s));

// ─── Complementary angles ───────────────────────────────────────────────────

/** acrossRightAngle draws points A, B, C on a line with rays BD and BE making a right angle DBE; ∠ABD is labeled first and ∠EBC second. */
function acrossRightAngle(a: number, labels: readonly [string, string]): Figure {
  const B: Point = [0, 0];
  const [A, C, D, E] = [dir(180, 5), dir(0, 5), dir(180 - a, 4.5), dir(90 - a, 4.5)];
  return fig(
    [
      seg(A, C),
      seg(B, D),
      seg(B, E),
      { kind: "right", vertex: B, from: E, to: D },
      arc(B, D, A, labels[0]),
      arc(B, C, E, labels[1]),
      ...names([A, B, C, D, E], "ABCDE", [0, 1]),
    ],
    `Points A, B and C on a line, with rays BD and BE making a right angle at B. Angle ABD is marked ${labels[0]} and angle EBC is marked ${labels[1]}.`,
    `点 A、B、C 在一条直线上，射线 BD 与 BE 在 B 处成直角。∠ABD 标为 ${labels[0]}，∠EBC 标为 ${labels[1]}。`,
  );
}

/** pairOf turns a Text into the pair of its English and Chinese. */
const pairOf = (x: Text): Pair => [x.en, x["zh-CN"]];

/** solving splits the lines of a worked equation into two labelled steps: writing it, then solving it. */
function solving(lines: readonly string[], why: Pair): Walk[] {
  const [first, ...rest] = lines;
  return [
    [["Write the equation", "列方程"], why, [first ?? ""]],
    [["Solve", "求解"], ["Collect like terms and solve:", "合并同类项并求解："], rest],
  ];
}

/** equalOffs are the values of x from the usual slips in solving c1·x + d1 = c2·x + d2, with their reasons. */
function equalOffs(e1: Linear, e2: Linear): Off[] {
  const [sign, added] = equalWrong(e1, e2);
  return [
    [sign as Q, "That moves a constant across with the wrong sign.", "这是移项时常数的符号弄错了。"],
    [added as Q, "That adds the $x$-terms instead of subtracting them.", "这是把含 $x$ 的项相加了，而不是相减。"],
  ];
}

/** sumOffs are the values of x from the usual slips in solving a sum equation, with their reasons; wrongTotal is the total a learner confuses with the right one. */
function sumOffs(terms: readonly Linear[], total: number, wrongTotal: number): Off[] {
  const [sign, other] = sumWrong(terms, total, wrongTotal);
  return [
    [sign as Q, "That moves the constant across with the wrong sign.", "这是移项时常数的符号弄错了。"],
    [
      other as Q,
      `That uses $${wrongTotal}^\\circ$ as the total instead of $${total}^\\circ$.`,
      `这是把总和当成了 $${wrongTotal}^\\circ$，而不是 $${total}^\\circ$。`,
    ],
  ];
}

const nonAdjacentComplementaryAngles = withIntro(
  topic(
    "non-adjacent-complementary-angles",
    t("Non-Adjacent Complementary Angles", "不相邻的互余角"),
    t(
      "Complementary angles need not share a side: any two angles whose measures add up to 90° are complementary, such as the two angles beside a right angle on a line, or the two acute angles of a right triangle.",
      "互余的两个角不一定有公共边：只要两个角的度数之和为 90°，它们就互余，例如直线上夹着一个直角的两个角，或直角三角形的两个锐角。",
    ),
    ["complementary-angles"],
    ["7.G.B.5"],
    [
      lesson(
        "spotting-complementary-angles",
        ["Spotting complementary angles", "找出互余的角"],
        [
          [
            "Two angles are complementary when their measures add up to $90^\\circ$, wherever they are. They do not have to be adjacent, or even in the same figure. If $m\\angle A = 28^\\circ$ and $m\\angle C = 62^\\circ$, then $\\angle A$ and $\\angle C$ are complementary, because $28 + 62 = 90$.",
            "两个角的度数之和为 $90^\\circ$ 时，它们就互余，不论它们在哪里。它们不必相邻，甚至不必在同一个图形中。若 $m\\angle A = 28^\\circ$，$m\\angle C = 62^\\circ$，则 $\\angle A$ 与 $\\angle C$ 互余，因为 $28 + 62 = 90$。",
          ],
          [
            "Each angle is the other's complement: $90 - 28 = 62$ and $90 - 62 = 28$.",
            "每个角都是另一个角的余角：$90 - 28 = 62$，$90 - 62 = 28$。",
          ],
          [
            "Do not mix up the two words. Angles of $28^\\circ$ and $152^\\circ$ add up to $180^\\circ$: they are supplementary, not complementary.",
            "不要把两个词弄混。$28^\\circ$ 和 $152^\\circ$ 的和是 $180^\\circ$：它们互补，而不是互余。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.int(15, 75);
            const values = [a, 90 - a, 180 - a, rng.int(20, 160)];
            if (a === 45 || new Set(values).size < 4) continue;
            const sums = values.flatMap((u, i) => values.slice(i + 1).map((w) => u + w));
            if (sums.filter((s) => s === 90).length !== 1) continue;
            const letters = rng.shuffle(["A", "B", "C", "D"]);
            const pair = (i: number, j: number): Pair => {
              const [x, y] = [letters[i]!, letters[j]!].sort();
              return [`$\\angle ${x}$ and $\\angle ${y}$`, `$\\angle ${x}$ 与 $\\angle ${y}$`];
            };
            const sumOf = (i: number, j: number) => values[i]! + values[j]!;
            const off = (i: number, j: number): [Pair, string, string] =>
              sumOf(i, j) === 180
                ? [
                    pair(i, j),
                    `Those add up to $180^\\circ$: they are supplementary, not complementary.`,
                    `它们的和是 $180^\\circ$：它们互补，而不是互余。`,
                  ]
                : [
                    pair(i, j),
                    `Those add up to $${sumOf(i, j)}^\\circ$, not $90^\\circ$.`,
                    `它们的和是 $${sumOf(i, j)}^\\circ$，不是 $90^\\circ$。`,
                  ];
            const order = [0, 1, 2, 3].sort((i, j) => letters[i]!.localeCompare(letters[j]!));
            const listed = order.map((i) => `m\\angle ${letters[i]} = ${degTex(values[i]!)}`).join(", ");
            const correct = pair(0, 1);
            return chosen(
              rng,
              [`$${listed}$. Which two angles are complementary?`, `$${listed}$。哪两个角互余？`],
              correct,
              [off(0, 2), ...rng.shuffle([off(1, 2), off(0, 3), off(1, 3), off(2, 3)]).slice(0, 2)],
              [
                [
                  ["Look for a sum of 90°", "找和为 90° 的两个角"],
                  [
                    `Complementary angles add up to $90^\\circ$: $${a} + ${90 - a} = 90$.`,
                    `互余的两个角之和为 $90^\\circ$：$${a} + ${90 - a} = 90$。`,
                  ],
                ],
                [
                  ["Name the pair", "说出这一对"],
                  [
                    `So ${correct[0]} are complementary, although nothing says they are adjacent.`,
                    `所以 ${correct[1]} 互余，尽管题中没有说它们相邻。`,
                  ],
                ],
              ],
              [
                `The complement of $${degTex(a)}$ is $90^\\circ - ${degTex(a)} = ${degTex(90 - a)}$, the other angle of the pair.`,
                `$${degTex(a)}$ 的余角是 $90^\\circ - ${degTex(a)} = ${degTex(90 - a)}$，正是这一对中的另一个角。`,
              ],
            );
          }
        },
        drawn(gradeDrawings5["non-adjacent-complementary-angles#spotting-complementary-angles"]),
      ),
      lesson(
        "complements-in-figures",
        ["Complements in figures", "图形中的余角"],
        [
          [
            "Two kinds of figures hide complementary angles that are not adjacent. On a line, the two angles on either side of a right angle add up to $180^\\circ - 90^\\circ = 90^\\circ$. In a right triangle, the right angle takes $90^\\circ$ of the $180^\\circ$, so the two acute angles add up to $90^\\circ$. If one acute angle is $34^\\circ$, the other is $90^\\circ - 34^\\circ = 56^\\circ$.",
            "有两类图形中藏着不相邻的互余角。在直线上，夹着一个直角的两个角之和为 $180^\\circ - 90^\\circ = 90^\\circ$。在直角三角形中，直角占了 $180^\\circ$ 中的 $90^\\circ$，所以两个锐角之和为 $90^\\circ$。若一个锐角是 $34^\\circ$，另一个就是 $90^\\circ - 34^\\circ = 56^\\circ$。",
          ],
          [
            "All three angles of that triangle add up to $34 + 56 + 90 = 180$ degrees.",
            "这个三角形的三个角之和是 $34 + 56 + 90 = 180$ 度。",
          ],
          [
            "Take away the right angle too. Subtracting $34$ from $180$ gives $146$, which forgets the $90^\\circ$.",
            "直角也要减去。用 $180$ 减 $34$ 得 $146$，这忘了那个 $90^\\circ$。",
          ],
        ],
        (rng) => {
          const a = rng.int(15, 75);
          const offs: Off[] = [
            [180 - a, "That subtracts from $180^\\circ$ and forgets the right angle.", "这是用 $180^\\circ$ 去减，忘了直角。"],
            [a, "That copies the given angle.", "这是照抄了已知角。"],
            [90 + a, "That adds the right angle instead of taking it away.", "这是加上了直角，而不是减去它。"],
          ];
          if (rng.bool()) {
            return valued(
              [
                `Points $A$, $B$ and $C$ lie on a line, $\\angle DBE$ is a right angle and $m\\angle ABD = ${degTex(a)}$. Find $x$.`,
                `点 $A$、$B$、$C$ 在同一条直线上，$\\angle DBE$ 是直角，$m\\angle ABD = ${degTex(a)}$。求 $x$。`,
              ],
              90 - a,
              [
                [
                  ["Use the straight angle", "利用平角"],
                  ["The three angles at $B$ make up the straight angle $ABC$:", "$B$ 处的三个角合起来是平角 $ABC$："],
                  [`${a} + 90 + x = 180`],
                ],
                [["Solve", "求解"], [`Take $90$ and $${a}$ away from $180$:`, `从 $180$ 中减去 $90$ 和 $${a}$：`], [`x = ${90 - a}`]],
              ],
              [
                `The two outer angles add up to $${a} + ${90 - a} = 90$, so they are complementary, though not adjacent.`,
                `两侧的角之和为 $${a} + ${90 - a} = 90$，所以它们互余，尽管不相邻。`,
              ],
              offs,
              { solveFor: "x", figure: acrossRightAngle(a, [deg(a), "x°"]) },
            );
          }
          const [P, R, Q] = rng.pick([
            ["P", "R", "Q"],
            ["K", "M", "L"],
            ["D", "F", "E"],
          ] as const);
          return valued(
            [
              `In $\\triangle ${P}${Q}${R}$, $\\angle ${R}$ is a right angle and $m\\angle ${P} = ${degTex(a)}$. Find $m\\angle ${Q}$.`,
              `在 $\\triangle ${P}${Q}${R}$ 中，$\\angle ${R}$ 是直角，$m\\angle ${P} = ${degTex(a)}$。求 $m\\angle ${Q}$。`,
            ],
            90 - a,
            [
              [
                ["Spot the complements", "找出互余的角"],
                [
                  `The right angle takes $90^\\circ$ of the triangle's $180^\\circ$, so $\\angle ${P}$ and $\\angle ${Q}$ add up to $90^\\circ$.`,
                  `直角占了三角形 $180^\\circ$ 中的 $90^\\circ$，所以 $\\angle ${P}$ 与 $\\angle ${Q}$ 之和为 $90^\\circ$。`,
                ],
              ],
              [
                ["Subtract", "相减"],
                [`Take $\\angle ${P}$ away from $90^\\circ$:`, `用 $90^\\circ$ 减去 $\\angle ${P}$：`],
                [`m\\angle ${Q} = 90^\\circ - ${degTex(a)} = ${degTex(90 - a)}`],
              ],
            ],
            [`All three angles add up to $${a} + ${90 - a} + 90 = 180$ degrees.`, `三个角之和为 $${a} + ${90 - a} + 90 = 180$ 度。`],
            offs,
            { unit: "°" },
          );
        },
        drawn(gradeDrawings5["non-adjacent-complementary-angles#complements-in-figures"]),
      ),
      lesson(
        "complements-with-algebra",
        ["Equations for complements", "互余角的方程"],
        [
          [
            "When the angles on either side of a right angle are written with a variable, they still add up to $90^\\circ$, which gives an equation. If $m\\angle ABD = (2x + 6)^\\circ$ and $m\\angle EBC = (3x - 6)^\\circ$, then $(2x + 6) + (3x - 6) = 90$. So $5x = 90$ and $x = 18$, and $m\\angle ABD = 2 \\cdot 18 + 6 = 42^\\circ$.",
            "当直角两侧的角用含变量的式子表示时，它们的和仍是 $90^\\circ$，由此可以列方程。若 $m\\angle ABD = (2x + 6)^\\circ$，$m\\angle EBC = (3x - 6)^\\circ$，则 $(2x + 6) + (3x - 6) = 90$。所以 $5x = 90$，$x = 18$，$m\\angle ABD = 2 \\cdot 18 + 6 = 42^\\circ$。",
          ],
          [
            "The other angle is $3 \\cdot 18 - 6 = 48^\\circ$, and $42 + 48 = 90$.",
            "另一个角是 $3 \\cdot 18 - 6 = 48^\\circ$，而 $42 + 48 = 90$。",
          ],
          [
            "Answer what is asked. When the question asks for an angle, $x = 18$ is only the way to it.",
            "问什么答什么。题目问角的度数时，$x = 18$ 只是中间结果。",
          ],
        ],
        (rng) => {
          const x = rng.int(4, 15);
          const a = rng.int(20, 70);
          const e1 = expressionFor(rng, a, x);
          const e2 = expressionFor(rng, 90 - a, x);
          const askX = rng.bool();
          const walk = solving(sumSteps([e1, e2], 90), [
            "With the right angle between them, the two angles fill the rest of the straight angle, so they add up to $90^\\circ$:",
            "两个角中间夹着直角，它们填满平角的其余部分，所以和为 $90^\\circ$：",
          ]);
          const check: Pair = [
            `Substituting $x = ${x}$ gives $${subst(e1, x)} = ${a}$ and $${subst(e2, x)} = ${90 - a}$, which add up to $90$.`,
            `代入 $x = ${x}$，得 $${subst(e1, x)} = ${a}$，$${subst(e2, x)} = ${90 - a}$，两者之和为 $90$。`,
          ];
          const head: Pair = [
            `Points $A$, $B$ and $C$ lie on a line, $\\angle DBE$ is a right angle, $m\\angle ABD = ${angleTex(e1)}$ and $m\\angle EBC = ${angleTex(e2)}$.`,
            `点 $A$、$B$、$C$ 在同一条直线上，$\\angle DBE$ 是直角，$m\\angle ABD = ${angleTex(e1)}$，$m\\angle EBC = ${angleTex(e2)}$。`,
          ];
          const figure = acrossRightAngle(a, [angleLabel(e1), angleLabel(e2)]);
          if (askX) {
            return valued(
              [`${head[0]} Find $x$.`, `${head[1]}求 $x$。`],
              x,
              walk,
              check,
              [
                ...sumOffs([e1, e2], 90, 180),
                [a, "That is the measure of $\\angle ABD$, not $x$.", "这是 $\\angle ABD$ 的度数，不是 $x$。"],
              ],
              { solveFor: "x", figure },
            );
          }
          return valued(
            [`${head[0]} Find $m\\angle ABD$.`, `${head[1]}求 $m\\angle ABD$。`],
            a,
            [
              ...walk,
              [
                ["Find the angle", "求角"],
                ["Put $x$ back into $\\angle ABD$:", "把 $x$ 代回 $\\angle ABD$："],
                [`m\\angle ABD = ${subst(e1, x)} = ${degTex(a)}`],
              ],
            ],
            check,
            [
              [x, "That is $x$; put it back into the expression for the angle.", "这是 $x$；还要代回角的式子。"],
              [90 - a, "That is $\\angle EBC$, the other angle.", "这是另一个角 $\\angle EBC$。"],
              [180 - a, "That is the supplement of the angle, not the angle.", "这是这个角的补角，不是这个角。"],
            ],
            { unit: "°", figure },
          );
        },
        drawn(gradeDrawings5["non-adjacent-complementary-angles#complements-with-algebra"]),
      ),
    ],
  ),
  [
    "A ladder leans against a wall that stands at a right angle to the ground. The ladder makes a $65^\\circ$ angle with the ground. What angle does it make with the wall?",
    "一架梯子靠在墙上，墙与地面成直角。梯子与地面成 $65^\\circ$ 角。梯子与墙成多少度的角？",
  ],
  [
    "The two acute angles of the right triangle add up to $90^\\circ$, so it is $90 - 65 = 25$ degrees.",
    "直角三角形的两个锐角之和为 $90^\\circ$，所以是 $90 - 65 = 25$ 度。",
  ],
  [
    "spot complementary angles that are not adjacent, find them in figures, and write equations for them.",
    "找出不相邻的互余角，在图形中求余角，并为它们列方程。",
  ],
);

// ─── Angle pairs at two lines ───────────────────────────────────────────────

/** pickSlot picks one of the eight angles. */
const pickSlot = (rng: Rng): Slot => slotOf(rng.int(1, 8));

const correspondingAngles = topic(
  "corresponding-angles",
  t("Corresponding Angles", "同位角"),
  t(
    "Corresponding angles sit in the same position at the two crossings of a transversal. When the lines are parallel they are equal, which, with vertical angles and linear pairs, finds every angle in the figure.",
    "同位角在截线的两个交点处位置相同。两直线平行时同位角相等，再结合对顶角和邻补角，就能求出图中的每个角。",
  ),
  ["vertical-angles"],
  ["8.G.A.5"],
  [
    {
      id: "identifying-corresponding-angles",
      figure: gradeDrawings3["corresponding-angles#identifying-corresponding-angles"],
      title: t("Identifying corresponding angles", "识别同位角"),
      explanation: t(
        "A **transversal** crosses two lines and makes four angles at each crossing. **Corresponding angles** are in the same position at the two crossings: both above their line and right of the transversal, for example.\n\nTo find the angle corresponding to $\\angle 2$ (above $\\ell$, right of the transversal), look at the crossing with $m$ for the angle above $m$ and right of the transversal: $\\angle 6$.",
        "**截线**与两条直线相交，在每个交点处形成四个角。**同位角**在两个交点处的位置相同，例如都在各自直线的上方、截线的右侧。\n\n要找与 $\\angle 2$（$\\ell$ 的上方、截线的右侧）同位的角，就在截线与 $m$ 的交点处找 $m$ 的上方、截线右侧的角：$\\angle 6$。",
      ),
      generate(rng) {
        const s = pickSlot(rng);
        const answer = corresponding.partner(s);
        return pickChoice(
          rng,
          t(
            `A transversal crosses lines $\\ell$ and $m$. Which angle corresponds to $${numbered(s)}$?`,
            `一条截线与直线 $\\ell$、$m$ 相交。哪个角与 $${numbered(s)}$ 是同位角？`,
          ),
          angleOption(answer),
          [angleOption(alternateInterior.partner(s)), angleOption(consecutiveInterior.partner(s)), angleOption([s[0], (s[1] + 2) % 4])],
          t(
            `$${numbered(s)}$ is ${positionOf(s).en}. Its corresponding angle is in the same position at the other crossing, ${positionOf(answer).en}: $${numbered(answer)}$.`,
            `$${numbered(s)}$ 在 ${positionOf(s)["zh-CN"]}。与它同位的角在另一个交点处的相同位置，即 ${positionOf(answer)["zh-CN"]}：$${numbered(answer)}$。`,
          ),
          numberedFigure(pickTheta(rng), false),
        );
      },
    },
    {
      id: "using-corresponding-angles",
      figure: gradeDrawings3["corresponding-angles#using-corresponding-angles"],
      title: t("Using corresponding angles", "利用同位角求角"),
      explanation: t(
        "When the lines are parallel, corresponding angles are **equal**. Combined with what you know at one crossing (vertical angles are equal, a linear pair adds up to $180^\\circ$), one angle gives all eight.\n\nIf $\\ell \\parallel m$ and the angle above $\\ell$, right of the transversal, is $65^\\circ$, then the corresponding angle at $m$ is $65^\\circ$, and the angle beside it on $m$ (a linear pair) is $180^\\circ - 65^\\circ = 115^\\circ$.",
        "两直线平行时，同位角**相等**。再结合一个交点处的关系（对顶角相等，邻补角之和为 $180^\\circ$），由一个角就能求出全部八个角。\n\n若 $\\ell \\parallel m$，$\\ell$ 上方、截线右侧的角是 $65^\\circ$，则 $m$ 处与它同位的角也是 $65^\\circ$，而 $m$ 上与它相邻的角（邻补角）是 $180^\\circ - 65^\\circ = 115^\\circ$。",
      ),
      generate(rng) {
        const theta = pickTheta(rng);
        const known = pickSlot(rng);
        const step = corresponding.partner(known);
        const target: Slot = [step[0], (known[1] + rng.int(1, 3)) % 4];
        const m = measureAt(known, theta);
        const answer = measureAt(target, theta);
        const vertical = (target[1] - step[1] + 4) % 4 === 2;
        const second = vertical
          ? t(`it and $x$ are vertical angles, so $x = ${degTex(m)}$`, `它与 $x$ 是对顶角，所以 $x = ${degTex(m)}$`)
          : t(
              `it and $x$ form a linear pair, so $x = 180^\\circ - ${degTex(m)} = ${degTex(180 - m)}$`,
              `它与 $x$ 是邻补角，所以 $x = 180^\\circ - ${degTex(m)} = ${degTex(180 - m)}$`,
            );
        return {
          ...numberProblem({
            prompt: t(
              `Lines $\\ell$ and $m$ are parallel, and one angle measures $${degTex(m)}$. Find $x$.`,
              `直线 $\\ell$ 与 $m$ 平行，一个角是 $${degTex(m)}$。求 $x$。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            wrong: [180 - answer, 360 - m, Math.abs(90 - m)],
            solution: t(
              `The angle corresponding to the $${degTex(m)}$ angle, ${positionOf(step).en}, also measures $${degTex(m)}$. At that crossing, ${second.en}.`,
              `与 $${degTex(m)}$ 的角同位的角在 ${positionOf(step)["zh-CN"]}，也是 $${degTex(m)}$。在这个交点处，${second["zh-CN"]}。`,
            ),
          }),
          figure: transversalFigure(
            theta,
            0,
            [
              [known, deg(m)],
              [target, "x"],
            ],
            true,
            `Parallel lines ℓ and m cut by a transversal. One angle measures ${m}°; an angle at the other crossing, in a different position, is x.`,
            `平行线 ℓ 与 m 被一条截线所截。一个角是 ${m}°；另一个交点处位置不同的一个角是 x。`,
          ),
        };
      },
    },
  ],
);

/** pairEquation picks x, the measure m of the angle at P (so that the figure is not close to a right angle) and an expression for it. */
function pairEquation(rng: Rng): { x: number; m: number; e1: Linear } {
  const x = rng.int(5, 25);
  const m = pickTheta(rng);
  return { x, m, e1: expressionFor(rng, m, x) };
}

const alternateAngles = withIntro(
  topic(
    "alternate-angles",
    t("Alternate Angles", "内错角与外错角"),
    t(
      "Alternate angles lie on opposite sides of a transversal: alternate interior angles between the two lines, alternate exterior angles outside them. When the lines are parallel, alternate angles are equal.",
      "错角位于截线的两侧：内错角在两条直线之间，外错角在两条直线之外。两直线平行时，内错角相等，外错角也相等。",
    ),
    ["corresponding-angles"],
    ["8.G.A.5"],
    [
      lesson(
        "identifying-alternate-angles",
        ["Identifying alternate angles", "识别内错角与外错角"],
        [
          [
            "Angles between the two lines are **interior**; the others are **exterior**. **Alternate interior angles** are both interior, on opposite sides of the transversal, at different crossings. **Alternate exterior angles** are both exterior, on opposite sides, at different crossings. For example, $\\angle 3$ is below $\\ell$ and left of the transversal, so it is interior. Its alternate interior angle is above $m$ and right of the transversal: $\\angle 6$.",
            "两条直线之间的角是**内角**，其余的是**外角**。**内错角**都是内角，分别在截线两侧，位于不同的交点处。**外错角**都是外角，分别在截线两侧，位于不同的交点处。例如 $\\angle 3$ 在 $\\ell$ 的下方、截线的左侧，所以是内角。与它构成内错角的是 $m$ 上方、截线右侧的角：$\\angle 6$。",
          ],
          [
            "Both $\\angle 3$ and $\\angle 6$ lie between the lines, and the transversal separates them.",
            "$\\angle 3$ 和 $\\angle 6$ 都在两条直线之间，而截线把它们隔开。",
          ],
          [
            "Switch sides of the transversal. The angle in the same position at the other crossing is the corresponding angle, not the alternate one.",
            "要换到截线的另一侧。另一个交点处位置相同的角是同位角，不是错角。",
          ],
        ],
        (rng) => {
          const s = pickSlot(rng);
          const inside = interior(s);
          const kind = inside ? alternateInterior : alternateExterior;
          const answer = kind.partner(s);
          const c = corresponding.partner(s);
          const option = (x: Slot): Pair => pairOf(angleOption(x));
          return chosen(
            rng,
            [
              `A transversal crosses lines $\\ell$ and $m$. Which angle forms a pair of ${kind.name.en} with $${numbered(s)}$?`,
              `一条截线与直线 $\\ell$、$m$ 相交。哪个角与 $${numbered(s)}$ 构成${kind.name["zh-CN"]}？`,
            ],
            option(answer),
            [
              [
                option(corresponding.partner(s)),
                "That is in the same position at the other crossing: a corresponding angle.",
                "它在另一个交点处的相同位置：是同位角。",
              ],
              [
                option(consecutiveInterior.partner(s)),
                "That is on the same side of the transversal, not the opposite side.",
                "它在截线的同一侧，不在另一侧。",
              ],
              [option([s[0], (s[1] + 2) % 4]), "That is at the same crossing: a vertical angle.", "它在同一个交点处：是对顶角。"],
            ],
            [
              [
                ["Place the angle", "确定角的位置"],
                [
                  `$${numbered(s)}$ is ${positionOf(s).en}, so it is ${inside ? "interior, between the lines" : "exterior, outside the lines"}.`,
                  `$${numbered(s)}$ 在 ${positionOf(s)["zh-CN"]}，所以是${inside ? "内角，在两条直线之间" : "外角，在两条直线之外"}。`,
                ],
              ],
              [
                ["Cross over", "换到另一侧"],
                [
                  `Its partner is also ${inside ? "interior" : "exterior"}, at the other crossing and on the other side of the transversal: $${numbered(answer)}$.`,
                  `与它配对的角也是${inside ? "内角" : "外角"}，在另一个交点处、截线的另一侧：$${numbered(answer)}$。`,
                ],
              ],
            ],
            [
              `Go another way: $${numbered(s)}$ and $${numbered(c)}$ are corresponding angles, and $${numbered(c)}$ and $${numbered(answer)}$ are vertical angles, so parallel lines would make $${numbered(answer)}$ equal to $${numbered(s)}$, as ${kind.name.en} should be.`,
              `换一条路：$${numbered(s)}$ 与 $${numbered(c)}$ 是同位角，$${numbered(c)}$ 与 $${numbered(answer)}$ 是对顶角，所以两直线平行时 $${numbered(answer)}$ 等于 $${numbered(s)}$，正是${kind.name["zh-CN"]}应有的关系。`,
            ],
            numberedFigure(pickTheta(rng), false),
          );
        },
        drawn(gradeDrawings3["alternate-angles#identifying-alternate-angles"]),
      ),
      lesson(
        "alternate-angle-equations",
        ["Equations from alternate angles", "由错角列方程"],
        [
          [
            "When the lines are parallel, alternate interior angles are equal, and so are alternate exterior angles. If the angles are written with a variable, set the expressions equal. If alternate interior angles measure $(3x - 15)^\\circ$ and $(x + 45)^\\circ$, then $3x - 15 = x + 45$. So $2x = 60$ and $x = 30$.",
            "两直线平行时，内错角相等，外错角也相等。若角用含变量的式子表示，就令两个式子相等。若一对内错角为 $(3x - 15)^\\circ$ 和 $(x + 45)^\\circ$，则 $3x - 15 = x + 45$。所以 $2x = 60$，$x = 30$。",
          ],
          [
            "Both angles then measure $3 \\cdot 30 - 15 = 75^\\circ$ and $30 + 45 = 75^\\circ$.",
            "这时两个角分别是 $3 \\cdot 30 - 15 = 75^\\circ$ 和 $30 + 45 = 75^\\circ$。",
          ],
          [
            "Alternate angles are equal, not supplementary. Do not set their sum to $180$.",
            "错角相等，不是互补。不要令它们的和等于 $180$。",
          ],
        ],
        (rng) => {
          const { x, m, e1 } = pairEquation(rng);
          const e2 = expressionFor(rng, m, x, [e1[0]]);
          const i = rng.int(0, 3);
          const s: Slot = ["P", i];
          const kind = interior(s) ? alternateInterior : alternateExterior;
          const theta = i % 2 === 0 ? m : 180 - m;
          const askX = rng.bool();
          const walk = solving(equalSteps(e1, e2), [
            `The marked angles are ${kind.name.en}, and parallel lines make them equal:`,
            `标出的两个角是${kind.name["zh-CN"]}，两直线平行，所以它们相等：`,
          ]);
          const check: Pair = [
            `Substituting $x = ${x}$ gives $${subst(e1, x)} = ${m}$ and $${subst(e2, x)} = ${m}$, which are equal.`,
            `代入 $x = ${x}$，得 $${subst(e1, x)} = ${m}$，$${subst(e2, x)} = ${m}$，两者相等。`,
          ];
          const figure = transversalFigure(
            theta,
            0,
            [
              [s, angleLabel(e1)],
              [kind.partner(s), angleLabel(e2)],
            ],
            true,
            `Parallel lines ℓ and m cut by a transversal, with ${kind.name.en} marked ${angleLabel(e1)} and ${angleLabel(e2)}.`,
            `平行线 ℓ 与 m 被一条截线所截，一对${kind.name["zh-CN"]}分别标为 ${angleLabel(e1)} 和 ${angleLabel(e2)}。`,
          );
          if (askX) {
            return valued(
              ["Lines $\\ell$ and $m$ are parallel. Find $x$.", "直线 $\\ell$ 与 $m$ 平行。求 $x$。"],
              x,
              walk,
              check,
              [...equalOffs(e1, e2), [m, "That is the measure of the angles, not $x$.", "这是角的度数，不是 $x$。"]],
              { solveFor: "x", figure },
            );
          }
          return valued(
            [
              `Lines $\\ell$ and $m$ are parallel. Find the measure of the angle marked $${angleTex(e1)}$.`,
              `直线 $\\ell$ 与 $m$ 平行。求标为 $${angleTex(e1)}$ 的角的度数。`,
            ],
            m,
            [...walk, [["Find the angle", "求角"], ["Put $x$ back in:", "把 $x$ 代回："], [`${subst(e1, x)} = ${degTex(m)}`]]],
            check,
            [
              [x, "That is $x$; put it back into the expression for the angle.", "这是 $x$；还要代回角的式子。"],
              [180 - m, "That is the supplement; alternate angles are equal.", "这是补角；错角是相等的。"],
            ],
            { unit: "°", figure },
          );
        },
        drawn(gradeDrawings3["alternate-angles#alternate-angle-equations"]),
      ),
      lesson(
        "the-angle-at-a-bend-between-parallel-lines",
        ["The angle at a bend between parallel lines", "平行线之间折线的夹角"],
        [
          [
            "A path can bend at a point between two parallel lines. To find the angle at the bend, draw a third line through that point, parallel to the others. It splits the angle at the bend into two parts. Each part is an alternate angle to one of the given angles, so it equals that angle. The angle at the bend is their sum. With angles of $30^\\circ$ and $45^\\circ$, the bend is $75^\\circ$.",
            "一条折线可以在两条平行线之间的一点转折。要求转折处的角，就过这一点作第三条直线，与另外两条平行。它把转折处的角分成两部分。每部分都和一个已知角是内错角，所以与那个角相等。转折处的角就是它们的和。已知角为 $30^\\circ$ 和 $45^\\circ$ 时，转折处的角是 $75^\\circ$。",
          ],
          [
            "The two parts are $30^\\circ$ above the new line and $45^\\circ$ below it, and $30 + 45 = 75$.",
            "两部分分别是新直线上方的 $30^\\circ$ 和下方的 $45^\\circ$，而 $30 + 45 = 75$。",
          ],
          [
            "Add the two angles. Subtracting one from the other, or from $180^\\circ$, has no reason behind it.",
            "要把两个角相加。用一个减另一个，或用 $180^\\circ$ 去减，都没有道理。",
          ],
        ],
        (rng) => {
          const a = rng.int(20, 80);
          const b = rng.int(20, 80);
          const answer = a + b;
          return valued(
            [
              `Lines $\\ell$ and $m$ are parallel. Point $A$ is on $\\ell$, point $B$ is on $m$, and point $P$ lies between the lines. Rays $AC$ on $\\ell$ and $BD$ on $m$ point the same way, with $P$ on their side of line $AB$. If $\\angle CAP = ${a}^\\circ$ and $\\angle DBP = ${b}^\\circ$, what is $\\angle APB$?`,
              `直线 $\\ell$ 和 $m$ 平行。点 $A$ 在 $\\ell$ 上，点 $B$ 在 $m$ 上，点 $P$ 在两条直线之间。$\\ell$ 上的射线 $AC$ 和 $m$ 上的射线 $BD$ 方向相同，$P$ 与它们在直线 $AB$ 的同一侧。如果 $\\angle CAP = ${a}^\\circ$，$\\angle DBP = ${b}^\\circ$，那么 $\\angle APB$ 是多少度？`,
            ],
            answer,
            [
              [
                ["Draw a parallel line", "作平行线"],
                [
                  "Draw a line through $P$ parallel to $\\ell$ and $m$. It splits $\\angle APB$ into two parts.",
                  "过 $P$ 作一条与 $\\ell$、$m$ 平行的直线。它把 $\\angle APB$ 分成两部分。",
                ],
              ],
              [
                ["Use alternate angles", "利用内错角"],
                [
                  `The part next to $A$ equals $${a}^\\circ$, and the part next to $B$ equals $${b}^\\circ$:`,
                  `靠近 $A$ 的部分等于 $${a}^\\circ$，靠近 $B$ 的部分等于 $${b}^\\circ$：`,
                ],
                [`\\angle APB = ${a}^\\circ + ${b}^\\circ = ${answer}^\\circ`],
              ],
            ],
            [
              `Taking the part next to $A$ away leaves $${answer} - ${a} = ${b}$ degrees, the angle at $B$.`,
              `去掉靠近 $A$ 的部分，剩下 $${answer} - ${a} = ${b}$ 度，正是 $B$ 处的角。`,
            ],
            [
              [Math.abs(a - b), "That subtracts the angles; the two parts add up.", "这是把两个角相减了；两部分应当相加。"],
              [180 - answer, "That is the supplement of the bend, not the bend.", "这是转折角的补角，不是转折角。"],
              [360 - answer, "That is the reflex angle around $P$, not $\\angle APB$.", "这是 $P$ 处的优角，不是 $\\angle APB$。"],
            ],
            { unit: "°" },
          );
        },
        drawn(gradeDrawings3["alternate-angles#the-angle-at-a-bend-between-parallel-lines"]),
      ),
    ],
  ),
  [
    "A straight road crosses two parallel rails. Between the rails, the road makes an angle of $65^\\circ$ with one rail on the left. What angle does it make with the other rail on the right?",
    "一条笔直的路穿过两条平行的铁轨。在两条铁轨之间，路在左侧与一条铁轨成 $65^\\circ$ 角。它在右侧与另一条铁轨成多少度的角？",
  ],
  [
    "It is $65^\\circ$ too: the two are alternate interior angles, and parallel lines make them equal.",
    "也是 $65^\\circ$：这两个角是内错角，两直线平行，所以它们相等。",
  ],
  [
    "identify alternate angles, use them in equations, and find the angle at a bend between parallel lines.",
    "识别内错角与外错角，用它们列方程，并求平行线之间折线的夹角。",
  ],
);

const consecutiveAngles = topic(
  "consecutive-angles",
  t("Consecutive Angles", "同旁内角与同旁外角"),
  t(
    "Consecutive angles lie on the same side of a transversal at its two crossings, both between the lines or both outside them. When the lines are parallel, consecutive angles are supplementary.",
    "同旁角位于截线同一侧的两个交点处，都在两条直线之间（同旁内角）或都在两条直线之外（同旁外角）。两直线平行时，同旁角互补。",
  ),
  ["alternate-angles"],
  ["8.G.A.5"],
  [
    {
      id: "consecutive-angles-are-supplementary",
      figure: gradeDrawings5["consecutive-angles#consecutive-angles-are-supplementary"],
      title: t("Consecutive angles are supplementary", "同旁角互补"),
      explanation: t(
        "**Consecutive interior angles** are both between the lines, on the same side of the transversal; **consecutive exterior angles** are both outside the lines, on the same side. When the lines are parallel, each pair is **supplementary**: the two angles add up to $180^\\circ$.\n\nWhy: one of the pair equals the angle corresponding to the other's linear-pair partner. If $\\ell \\parallel m$ and $\\angle 4 = 70^\\circ$, its consecutive interior partner is $\\angle 6 = 180^\\circ - 70^\\circ = 110^\\circ$.",
        "**同旁内角**都在两条直线之间、截线同一侧；**同旁外角**都在两条直线之外、截线同一侧。两直线平行时，每一对都**互补**：两个角之和为 $180^\\circ$。\n\n理由：其中一个角等于另一个角的邻补角的同位角。若 $\\ell \\parallel m$，$\\angle 4 = 70^\\circ$，则与它构成同旁内角的 $\\angle 6 = 180^\\circ - 70^\\circ = 110^\\circ$。",
      ),
      generate(rng) {
        const theta = pickTheta(rng);
        const s = pickSlot(rng);
        const kind = interior(s) ? consecutiveInterior : consecutiveExterior;
        const partner = kind.partner(s);
        const m = measureAt(s, theta);
        return {
          ...numberProblem({
            prompt: t(
              `Lines $\\ell$ and $m$ are parallel and $m${numbered(s)} = ${degTex(m)}$. Find $m${numbered(partner)}$.`,
              `直线 $\\ell$ 与 $m$ 平行，$m${numbered(s)} = ${degTex(m)}$。求 $m${numbered(partner)}$。`,
            ),
            answer: 180 - m,
            form: "integer",
            unit: "°",
            wrong: [m, Math.abs(90 - m), 360 - m],
            solution: t(
              `$${numbered(s)}$ and $${numbered(partner)}$ are both ${interior(s) ? "between" : "outside"} the lines, on the same side of the transversal: they are ${kind.name.en}. Parallel lines make them supplementary:${steps(`m${numbered(partner)} = 180^\\circ - ${degTex(m)} = ${degTex(180 - m)}`)}`,
              `$${numbered(s)}$ 与 $${numbered(partner)}$ 都在两条直线${interior(s) ? "之间" : "之外"}、截线同一侧：它们是${kind.name["zh-CN"]}。两直线平行，所以它们互补：${steps(`m${numbered(partner)} = 180^\\circ - ${degTex(m)} = ${degTex(180 - m)}`)}`,
            ),
          }),
          figure: numberedFigure(theta, true),
        };
      },
    },
    {
      id: "consecutive-angle-equations",
      figure: gradeDrawings3["consecutive-angles#consecutive-angle-equations"],
      title: t("Equations from consecutive angles", "由同旁角列方程"),
      explanation: t(
        "When the lines are parallel and consecutive angles are written with a variable, their sum is $180^\\circ$.\n\nIf consecutive interior angles measure $(2x + 15)^\\circ$ and $(3x - 10)^\\circ$, then $(2x + 15) + (3x - 10) = 180$, so $5x + 5 = 180$, $5x = 175$ and $x = 35$. The angles are $85^\\circ$ and $95^\\circ$, which do add up to $180^\\circ$.",
        "两直线平行且同旁角用含变量的式子表示时，它们的和为 $180^\\circ$。\n\n若一对同旁内角为 $(2x + 15)^\\circ$ 和 $(3x - 10)^\\circ$，则 $(2x + 15) + (3x - 10) = 180$，所以 $5x + 5 = 180$，$5x = 175$，$x = 35$。两个角分别是 $85^\\circ$ 和 $95^\\circ$，和确实是 $180^\\circ$。",
      ),
      generate(rng) {
        const { x, m, e1 } = pairEquation(rng);
        const e2 = expressionFor(rng, 180 - m, x);
        const i = rng.int(0, 3);
        const s: Slot = ["P", i];
        const kind = interior(s) ? consecutiveInterior : consecutiveExterior;
        const theta = i % 2 === 0 ? m : 180 - m;
        const askX = rng.bool();
        const solve = steps(...sumSteps([e1, e2], 180));
        return {
          ...numberProblem({
            prompt: askX
              ? t(`Lines $\\ell$ and $m$ are parallel. Find $x$.`, `直线 $\\ell$ 与 $m$ 平行。求 $x$。`)
              : t(
                  `Lines $\\ell$ and $m$ are parallel. Find the measure of the angle marked $${angleTex(e1)}$.`,
                  `直线 $\\ell$ 与 $m$ 平行。求标为 $${angleTex(e1)}$ 的角的度数。`,
                ),
            answer: askX ? x : m,
            ...(askX ? { solveFor: "x" } : { unit: "°" }),
            wrong: askX ? [...sumWrong([e1, e2], 180, 90), ...(e1[0] !== e2[0] ? equalWrong(e1, e2) : [])] : [x, 180 - m, Math.abs(90 - m)],
            solution: t(
              `The marked angles are ${kind.name.en}, and parallel lines make them supplementary:${solve}${askX ? "" : `So the angle measures $${subst(e1, x)} = ${degTex(m)}$.`}`,
              `标出的两个角是${kind.name["zh-CN"]}，两直线平行，所以它们互补：${solve}${askX ? "" : `所以这个角是 $${subst(e1, x)} = ${degTex(m)}$。`}`,
            ),
          }),
          figure: transversalFigure(
            theta,
            0,
            [
              [s, angleLabel(e1)],
              [kind.partner(s), angleLabel(e2)],
            ],
            true,
            `Parallel lines ℓ and m cut by a transversal, with ${kind.name.en} marked ${angleLabel(e1)} and ${angleLabel(e2)}.`,
            `平行线 ℓ 与 m 被一条截线所截，一对${kind.name["zh-CN"]}分别标为 ${angleLabel(e1)} 和 ${angleLabel(e2)}。`,
          ),
        };
      },
    },
  ],
);

/** criteria are the pair kinds that show two lines are parallel. */
const criteria: readonly PairKind[] = [corresponding, alternateInterior, alternateExterior, consecutiveInterior, consecutiveExterior];

/** kindAt is a criterion pair kind starting at slot s at P, matching s's position (interior or exterior). */
function kindAt(rng: Rng, s: Slot): PairKind {
  const kinds = interior(s)
    ? [corresponding, alternateInterior, consecutiveInterior]
    : [corresponding, alternateExterior, consecutiveExterior];
  return rng.pick(kinds);
}

const angleCriteriaForParallelLines = withIntro(
  topic(
    "angle-criteria-for-parallel-lines",
    t("Angle Criteria for Parallel Lines", "平行线的判定"),
    t(
      "The angle relationships also work backward: if corresponding or alternate angles are equal, or consecutive angles are supplementary, the two lines are parallel; if not, they are not.",
      "角的关系也可以反过来用：如果同位角或错角相等，或同旁角互补，那么两条直线平行；否则就不平行。",
    ),
    ["consecutive-angles"],
    ["8.G.A.5"],
    [
      lesson(
        "are-the-lines-parallel",
        ["Are the lines parallel?", "两直线平行吗"],
        [
          [
            "The angle-pair facts also work backward. Two lines cut by a transversal are parallel when corresponding, alternate interior or alternate exterior angles are **equal**. They are also parallel when consecutive interior or consecutive exterior angles are **supplementary**. If alternate interior angles measure $68^\\circ$ and $72^\\circ$, the lines are **not** parallel.",
            "角对的性质也可以反过来用。两条被截线所截的直线，当同位角、内错角或外错角**相等**时平行。当同旁内角或同旁外角**互补**时也平行。若一对内错角为 $68^\\circ$ 和 $72^\\circ$，两直线**不**平行。",
          ],
          [
            "Consecutive interior angles of $110^\\circ$ and $70^\\circ$ add up to $180^\\circ$, so those lines are parallel.",
            "同旁内角 $110^\\circ$ 和 $70^\\circ$ 之和为 $180^\\circ$，所以那两条直线平行。",
          ],
          [
            "Do not trust the picture. Lines that look parallel can still meet far away; only the angles decide.",
            "不要相信图的样子。看上去平行的直线仍可能在远处相交；只有角能说明问题。",
          ],
        ],
        (rng) => {
          const theta = pickTheta(rng);
          const parallel = rng.bool();
          const tilt = parallel ? 0 : rng.pick([-1, 1]) * rng.int(2, 8);
          const s: Slot = ["P", rng.int(0, 3)];
          const kind = kindAt(rng, s);
          const partner = kind.partner(s);
          const [a, b] = [measureAt(s, theta, tilt), measureAt(partner, theta, tilt)];
          const holds = kind.equal ? a === b : a + b === 180;
          const need: Pair = kind.equal ? ["equal", "相等"] : ["supplementary", "互补"];
          const test: Pair = kind.equal
            ? holds
              ? [`They are equal: $${degTex(a)} = ${degTex(b)}$.`, `它们相等：$${degTex(a)} = ${degTex(b)}$。`]
              : [`They are not equal: $${degTex(a)} \\ne ${degTex(b)}$.`, `它们不相等：$${degTex(a)} \\ne ${degTex(b)}$。`]
            : holds
              ? [`They are supplementary: $${a} + ${b} = 180$.`, `它们互补：$${a} + ${b} = 180$。`]
              : [`They are not supplementary: $${a} + ${b} = ${a + b}$.`, `它们不互补：$${a} + ${b} = ${a + b}$。`];
          return decided(
            rng,
            [
              `A transversal crosses lines $\\ell$ and $m$, and the marked angles measure $${degTex(a)}$ and $${degTex(b)}$. Are $\\ell$ and $m$ parallel?`,
              `一条截线与直线 $\\ell$、$m$ 相交，标出的两个角分别是 $${degTex(a)}$ 和 $${degTex(b)}$。$\\ell$ 与 $m$ 平行吗？`,
            ],
            holds,
            [
              [
                ["Name the pair", "说出角对"],
                [
                  `The marked angles are ${kind.name.en}, which parallel lines make ${need[0]}.`,
                  `标出的两个角是${kind.name["zh-CN"]}，两直线平行时它们${need[1]}。`,
                ],
              ],
              [["Test the angles", "检验角"], test],
            ],
            kind.equal
              ? [
                  `Use the angle next to the $${degTex(b)}$ one instead: it is $180^\\circ - ${degTex(b)} = ${degTex(180 - b)}$, and $${a} + ${180 - b} = ${a + 180 - b}$, ${holds ? "exactly" : "not"} $180$, the same verdict.`,
                  `改用与 $${degTex(b)}$ 相邻的角：它是 $180^\\circ - ${degTex(b)} = ${degTex(180 - b)}$，而 $${a} + ${180 - b} = ${a + 180 - b}$，${holds ? "正好是" : "不是"} $180$，结论相同。`,
                ]
              : [
                  `Use the angle next to the $${degTex(b)}$ one instead: it is $180^\\circ - ${degTex(b)} = ${degTex(180 - b)}$, which ${holds ? "equals" : "differs from"} $${degTex(a)}$, the same verdict.`,
                  `改用与 $${degTex(b)}$ 相邻的角：它是 $180^\\circ - ${degTex(b)} = ${degTex(180 - b)}$，${holds ? "等于" : "不等于"} $${degTex(a)}$，结论相同。`,
                ],
            holds
              ? [
                  `These ${kind.name.en} are ${need[0]}, which is exactly the criterion for parallel lines.`,
                  `这对${kind.name["zh-CN"]}${need[1]}，正好满足平行的判定。`,
                ]
              : [
                  `The lines may look parallel, but these ${kind.name.en} are not ${need[0]}, so the lines meet somewhere.`,
                  `两条直线也许看上去平行，但这对${kind.name["zh-CN"]}不${need[1]}，所以它们会在某处相交。`,
                ],
            transversalFigure(
              theta,
              tilt,
              [
                [s, deg(a)],
                [partner, deg(b)],
              ],
              false,
              `Lines ℓ and m cut by a transversal, with ${kind.name.en} marked ${a}° and ${b}°.`,
              `直线 ℓ 与 m 被一条截线所截，一对${kind.name["zh-CN"]}分别标为 ${a}° 和 ${b}°。`,
            ),
          );
        },
        drawn(gradeDrawings3["angle-criteria-for-parallel-lines#are-the-lines-parallel"]),
      ),
      lesson(
        "making-lines-parallel",
        ["Making lines parallel", "使两直线平行"],
        [
          [
            "To find the value of $x$ that makes two lines parallel, write the condition for the marked pair and solve. Corresponding and alternate angles must be equal; consecutive angles must add up to $180^\\circ$. If corresponding angles measure $(4x - 10)^\\circ$ and $(2x + 30)^\\circ$, the lines are parallel when $4x - 10 = 2x + 30$, that is, when $x = 20$.",
            "要求使两直线平行的 $x$ 的值，先写出标出角对应满足的条件再求解。同位角和错角要相等；同旁角之和要等于 $180^\\circ$。若一对同位角为 $(4x - 10)^\\circ$ 和 $(2x + 30)^\\circ$，则当 $4x - 10 = 2x + 30$，即 $x = 20$ 时，两直线平行。",
          ],
          [
            "At $x = 20$ both angles measure $70^\\circ$: $4 \\cdot 20 - 10 = 70$ and $2 \\cdot 20 + 30 = 70$.",
            "当 $x = 20$ 时，两个角都是 $70^\\circ$：$4 \\cdot 20 - 10 = 70$，$2 \\cdot 20 + 30 = 70$。",
          ],
          [
            "Name the pair first. Consecutive angles add up to $180^\\circ$; setting them equal gives the wrong $x$.",
            "先说出是哪种角对。同旁角之和为 $180^\\circ$；令它们相等会得到错误的 $x$。",
          ],
        ],
        (rng) => {
          const { x, m, e1 } = pairEquation(rng);
          const s: Slot = ["P", rng.int(0, 3)];
          const kind = kindAt(rng, s);
          const e2 = kind.equal ? expressionFor(rng, m, x, [e1[0]]) : expressionFor(rng, 180 - m, x);
          const theta = s[1] % 2 === 0 ? m : 180 - m;
          const mixedUp: Off[] = kind.equal
            ? [
                [
                  Q.of(180 - e1[1] - e2[1], e1[0] + e2[0]),
                  "That makes the angles supplementary, but these must be equal.",
                  "这是让两个角互补，但这对角应当相等。",
                ],
              ]
            : e1[0] !== e2[0]
              ? [
                  [
                    Q.of(e2[1] - e1[1], e1[0] - e2[0]),
                    "That makes the angles equal, but these must be supplementary.",
                    "这是让两个角相等，但这对角应当互补。",
                  ],
                ]
              : [];
          const other = at(e2, x);
          return valued(
            ["For what value of $x$ are lines $\\ell$ and $m$ parallel?", "$x$ 为何值时，直线 $\\ell$ 与 $m$ 平行？"],
            x,
            solving(kind.equal ? equalSteps(e1, e2) : sumSteps([e1, e2], 180), [
              `The marked angles are ${kind.name.en}. The lines are parallel exactly when they are ${kind.equal ? "equal" : "supplementary"}:`,
              `标出的两个角是${kind.name["zh-CN"]}。两直线平行，当且仅当它们${kind.equal ? "相等" : "互补"}：`,
            ]),
            kind.equal
              ? [
                  `At $x = ${x}$ both angles measure $${m}^\\circ$: $${subst(e1, x)} = ${subst(e2, x)} = ${m}$.`,
                  `当 $x = ${x}$ 时，两个角都是 $${m}^\\circ$：$${subst(e1, x)} = ${subst(e2, x)} = ${m}$。`,
                ]
              : [
                  `At $x = ${x}$ the angles measure $${m}^\\circ$ and $${other}^\\circ$, which add up to $180^\\circ$.`,
                  `当 $x = ${x}$ 时，两个角分别是 $${m}^\\circ$ 和 $${other}^\\circ$，和为 $180^\\circ$。`,
                ],
            [...mixedUp, ...(kind.equal ? equalOffs(e1, e2) : sumOffs([e1, e2], 180, 90))],
            {
              solveFor: "x",
              figure: transversalFigure(
                theta,
                0,
                [
                  [s, angleLabel(e1)],
                  [kind.partner(s), angleLabel(e2)],
                ],
                false,
                `Lines ℓ and m cut by a transversal, with ${kind.name.en} marked ${angleLabel(e1)} and ${angleLabel(e2)}.`,
                `直线 ℓ 与 m 被一条截线所截，一对${kind.name["zh-CN"]}分别标为 ${angleLabel(e1)} 和 ${angleLabel(e2)}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings5["angle-criteria-for-parallel-lines#making-lines-parallel"]),
      ),
      lesson(
        "reasons-for-parallel-lines",
        ["Reasons for parallel lines", "平行的理由"],
        [
          [
            "Each criterion names the angle pair it uses, so the reason must match the pair. Equal angles in the same position at the two crossings are corresponding angles. Equal angles between the lines on opposite sides are alternate interior angles; outside the lines they are alternate exterior angles. Supplementary angles between the lines on the same side are consecutive interior angles.",
            "每条判定都指明了它用的是哪种角对，所以理由必须和角对相符。两个交点处位置相同的相等角是同位角。两直线之间、截线两侧的相等角是内错角；在两直线之外就是外错角。两直线之间、截线同侧的互补角是同旁内角。",
          ],
          [
            "If $m\\angle 2 = m\\angle 6$, the angles sit in the same position at the two crossings, so the reason is the corresponding-angles criterion.",
            "若 $m\\angle 2 = m\\angle 6$，这两个角在两个交点处的位置相同，所以理由是同位角的判定。",
          ],
          [
            "Vertical angles prove nothing here. They are always equal, whether or not the lines are parallel.",
            "对顶角在这里说明不了什么。不论两直线是否平行，对顶角总是相等。",
          ],
        ],
        (rng) => {
          const s = pickSlot(rng);
          const kind = kindAt(rng, s);
          const partner = kind.partner(s);
          const [first, second] = rng.shuffle([s, partner]) as [Slot, Slot];
          const given = kind.equal
            ? `m${numbered(first)} = m${numbered(second)}`
            : `m${numbered(first)} + m${numbered(second)} = 180^\\circ`;
          // The check goes through the angle that forms a straight angle with the second one and makes a named pair with the first.
          const [v, i] = second;
          const same = (a: Slot, b: Slot) => a[0] === b[0] && a[1] === b[1];
          const fits = (k: PairKind) => k === corresponding || interior(first) === (k === alternateInterior || k === consecutiveInterior);
          const [n, twin] = (
            [
              [v, i ^ 1],
              [v, 3 - i],
            ] as Slot[]
          ).flatMap((c) => criteria.filter((k) => fits(k) && same(k.partner(first), c)).map((k): [Slot, PairKind] => [c, k]))[0]!;
          return chosen(
            rng,
            [
              `In the figure, $${given}$. Which reason shows that $\\ell \\parallel m$?`,
              `在图中，$${given}$。哪条理由说明 $\\ell \\parallel m$？`,
            ],
            pairOf(kind.reason),
            [
              [
                ["Vertical angles are equal.", "对顶角相等。"],
                "Vertical angles are always equal, so they say nothing about $\\ell$ and $m$.",
                "对顶角总是相等，所以说明不了 $\\ell$ 与 $m$ 的关系。",
              ],
              ...rng
                .shuffle(criteria.filter((k) => k !== kind))
                .slice(0, 2)
                .map((k): [Pair, string, string] => [
                  pairOf(k.reason),
                  `That criterion is about ${k.name.en}, but these are ${kind.name.en}.`,
                  `那条判定说的是${k.name["zh-CN"]}，但这两个角是${kind.name["zh-CN"]}。`,
                ]),
            ],
            [
              [
                ["Name the pair", "说出角对"],
                [
                  `$${numbered(first)}$ is ${positionOf(first).en} and $${numbered(second)}$ is ${positionOf(second).en}, so they are ${kind.name.en}.`,
                  `$${numbered(first)}$ 在 ${positionOf(first)["zh-CN"]}，$${numbered(second)}$ 在 ${positionOf(second)["zh-CN"]}，所以它们是${kind.name["zh-CN"]}。`,
                ],
              ],
              [
                ["Match the criterion", "对应判定"],
                [
                  `They are ${kind.equal ? "equal" : "supplementary"}. ${kind.reason.en}`,
                  `它们${kind.equal ? "相等" : "互补"}。${kind.reason["zh-CN"]}`,
                ],
              ],
            ],
            [
              `Another pair agrees: $${numbered(n)}$ forms a straight angle with $${numbered(second)}$, so $${numbered(first)}$ and $${numbered(n)}$, which are ${twin.name.en}, are ${twin.equal ? "equal" : "supplementary"}, and that criterion also gives $\\ell \\parallel m$.`,
              `换一对角也成立：$${numbered(n)}$ 与 $${numbered(second)}$ 组成平角，所以 $${numbered(first)}$ 与 $${numbered(n)}$ 这对${twin.name["zh-CN"]}${twin.equal ? "相等" : "互补"}，由这条判定同样得到 $\\ell \\parallel m$。`,
            ],
            numberedFigure(pickTheta(rng), false),
          );
        },
        drawn(gradeDrawings5["angle-criteria-for-parallel-lines#reasons-for-parallel-lines"]),
      ),
    ],
  ),
  [
    "A carpenter fixes two shelves to a slanted support. Each shelf makes a $62^\\circ$ angle with the support, in the same position. Are the shelves parallel?",
    "木匠把两块搁板固定在一根斜撑上。每块搁板与斜撑都成 $62^\\circ$ 角，位置相同。两块搁板平行吗？",
  ],
  [
    "Yes: the two angles are equal corresponding angles, and that makes the lines parallel.",
    "平行：这两个角是相等的同位角，所以两直线平行。",
  ],
  [
    "decide from the angles whether two lines are parallel, find the values that make them parallel, and give the reason.",
    "由角判断两条直线是否平行，求出使它们平行的值，并说出理由。",
  ],
);

// ─── Triangles ──────────────────────────────────────────────────────────────

/** triangleByAngles draws a triangle with angles a at (0, 0) and b at (6, 0), counterclockwise. */
function triangleByAngles(a: number, b: number): [Point, Point, Point] {
  const side = (6 * Math.sin(rad(b))) / Math.sin(rad(a + b));
  return [[0, 0], [6, 0], dir(a, side)];
}

/** ratios are angle ratios whose parts add up to a divisor of 180, with distinct parts. */
const ratios: readonly (readonly [number, number, number])[] = [
  [1, 2, 3],
  [1, 2, 6],
  [1, 3, 5],
  [1, 4, 5],
  [2, 3, 4],
  [2, 3, 5],
  [2, 3, 7],
  [1, 3, 8],
  [3, 4, 5],
  [2, 5, 8],
  [4, 5, 6],
  [3, 5, 7],
  [1, 5, 6],
  [2, 7, 9],
  [5, 6, 7],
];

/** relation states how the angle c·x + d compares with the angle named ref (x is its measure): "is twice m∠A", "is 20° less than m∠A". */
function relation([c, d]: Linear, ref: string): Text {
  const r = `m\\angle ${ref}`;
  const by = degTex(Math.abs(d));
  const [times, timesZh] = [
    ["", ""],
    ["", ""],
    ["twice", "2 倍"],
    ["three times", "3 倍"],
    ["four times", "4 倍"],
  ][c]!;
  const [more, moreZh] = d > 0 ? ["more", "多"] : ["less", "少"];
  if (d === 0) return t(`is ${times} $${r}$`, `是 $${r}$ 的 ${timesZh}`);
  if (c === 1) return t(`is $${by}$ ${more} than $${r}$`, `比 $${r}$ ${d > 0 ? "大" : "小"} $${by}$`);
  return t(`is $${by}$ ${more} than ${times} $${r}$`, `比 $${r}$ 的 ${timesZh}${moreZh} $${by}$`);
}

/** bowtie draws triangle ABC and triangle CDE, with D on ray AC beyond C and E on ray BC beyond C (the angles at C are vertical); angles at A, B, D, E are labeled. */
function bowtie(a: number, b: number, d: number, e: number, labels: readonly [string, string, string, string]): Figure {
  // The figure is turned a quarter turn clockwise, so that it is wider than it is tall.
  const turn = ([x, y]: Point): Point => [y, -x];
  const [A, B, C] = triangleByAngles(a, b).map(turn) as [Point, Point, Point];
  const gamma = 180 - a - b;
  const unit = (from: Point, to: Point): Point => {
    const n = Math.hypot(to[0] - from[0], to[1] - from[1]);
    return [(to[0] - from[0]) / n, (to[1] - from[1]) / n];
  };
  // In triangle CDE the side CD is opposite E and CE is opposite D (law of sines, scaled).
  const k = 5 / Math.sin(rad(gamma));
  const [ua, ub] = [unit(A, C), unit(B, C)];
  const D: Point = [C[0] + ua[0] * k * Math.sin(rad(e)), C[1] + ua[1] * k * Math.sin(rad(e))];
  const E: Point = [C[0] + ub[0] * k * Math.sin(rad(d)), C[1] + ub[1] * k * Math.sin(rad(d))];
  return fig(
    [
      seg(A, B),
      seg(A, D),
      seg(B, E),
      seg(D, E),
      arc(A, B, C, labels[0]),
      arc(B, C, A, labels[1]),
      arc(D, C, E, labels[2]),
      arc(E, D, C, labels[3]),
      ...names([A, B, D, E], "ABDE", C),
      { kind: "label", at: C, text: "C", dir: "n", italic: true },
    ],
    `Segments AD and BE cross at C, forming triangles ABC and DEC. The angles at A, B, D and E are marked ${labels.join(", ")}.`,
    `线段 AD 与 BE 相交于 C，形成三角形 ABC 和 DEC。A、B、D、E 处的角分别标为 ${labels.join("、")}。`,
  );
}

const problemSolvingWithAnglesOfTriangles = withIntro(
  topic(
    "problem-solving-with-angles-of-triangles",
    t("Problem Solving with Angles of Triangles", "三角形内角的综合问题"),
    t(
      "Use the 180° angle sum to find angles given in a ratio or described by their relationships, and combine it with vertical angles to find angles across two triangles.",
      "利用三角形内角和为 180°，求按比例给出或由相互关系描述的角，并结合对顶角求两个三角形中的角。",
    ),
    ["angles-of-a-triangle"],
    ["8.G.A.5"],
    [
      lesson(
        "angles-in-a-ratio",
        ["Angles in a ratio", "按比例分配的角"],
        [
          [
            "If the angles of a triangle are in the ratio $p : q : r$, write them as $px$, $qx$ and $rx$. Their sum is $180^\\circ$, so $(p + q + r)x = 180$. For the ratio $2 : 3 : 4$, $9x = 180$, so $x = 20$. The angles are $40^\\circ$, $60^\\circ$ and $80^\\circ$.",
            "若三角形三个角之比为 $p : q : r$，就把它们写成 $px$、$qx$、$rx$。它们的和为 $180^\\circ$，所以 $(p + q + r)x = 180$。比为 $2 : 3 : 4$ 时，$9x = 180$，所以 $x = 20$。三个角分别是 $40^\\circ$、$60^\\circ$、$80^\\circ$。",
          ],
          [
            "The angles add up to $40 + 60 + 80 = 180$, and $40 : 60 : 80 = 2 : 3 : 4$.",
            "三个角之和为 $40 + 60 + 80 = 180$，而且 $40 : 60 : 80 = 2 : 3 : 4$。",
          ],
          [
            "Finding $x$ is not the end. Here $x = 20$ is one part; multiply it by each number of the ratio.",
            "求出 $x$ 还没有结束。这里 $x = 20$ 只是一份；还要乘以比中的各个数。",
          ],
        ],
        (rng) => {
          const [p, q, r] = rng.pick(ratios);
          const s = p + q + r;
          const part = 180 / s;
          const largest = rng.bool();
          const k = largest ? r : p;
          const answer = k * part;
          const which: Pair = largest ? ["largest", "最大"] : ["smallest", "最小"];
          return valued(
            [
              `The angles of a triangle are in the ratio $${p} : ${q} : ${r}$. What is the measure of the ${which[0]} angle?`,
              `一个三角形三个角的度数之比为 $${p} : ${q} : ${r}$。${which[1]}的角是多少度？`,
            ],
            answer,
            [
              [
                ["Write the angles", "写出三个角"],
                [
                  `Write them as $${linear(p, 0)}$, $${linear(q, 0)}$ and $${linear(r, 0)}$; they add up to $180^\\circ$:`,
                  `把它们写成 $${linear(p, 0)}$、$${linear(q, 0)}$、$${linear(r, 0)}$，它们的和为 $180^\\circ$：`,
                ],
                [`${linear(p, 0)} + ${linear(q, 0)} + ${linear(r, 0)} = 180`, `${s}x = 180`, `x = ${part}`],
              ],
              [
                ["Find the angle", "求角"],
                [`The ${which[0]} angle is ${k === 1 ? "one part" : `$${k}$ parts`}:`, `${which[1]}的角是 $${k}$ 份：`],
                [k === 1 ? `x = ${degTex(answer)}` : `${k}x = ${k} \\cdot ${part} = ${degTex(answer)}`],
              ],
            ],
            [
              `The three angles $${p * part}$, $${q * part}$ and $${r * part}$ add up to $180$, in the ratio $${p} : ${q} : ${r}$.`,
              `三个角 $${p * part}$、$${q * part}$、$${r * part}$ 之和为 $180$，比为 $${p} : ${q} : ${r}$。`,
            ],
            [
              [part, "That is $x$, one part of the ratio, not the angle.", "这是 $x$，即比中的一份，不是这个角。"],
              [q * part, "That is the middle angle.", "这是中间的那个角。"],
              [
                largest ? p * part : r * part,
                `That is the ${largest ? "smallest" : "largest"} angle instead.`,
                `这是${largest ? "最小" : "最大"}的角。`,
              ],
              [
                Q.of(k * 360, s),
                "That shares out $360^\\circ$ instead of $180^\\circ$.",
                "这是把 $360^\\circ$ 按比分配了，而不是 $180^\\circ$。",
              ],
            ],
            { unit: "°" },
          );
        },
        drawn(gradeDrawings3["problem-solving-with-angles-of-triangles#angles-in-a-ratio"]),
      ),
      lesson(
        "angles-described-in-words",
        ["Angles described in words", "用文字描述的角"],
        [
          [
            "When the angles are described by how they compare, let the angle the others are compared with be $x$. Write the others in terms of $x$, and use the angle sum. If $\\angle B$ is twice $\\angle A$ and $\\angle C$ is $20^\\circ$ more than $\\angle A$, then $x + 2x + (x + 20) = 180$. So $4x = 160$ and $x = 40$.",
            "当三个角是通过相互比较来描述时，设被比较的那个角为 $x$。用 $x$ 表示其他两个角，再利用内角和。若 $\\angle B$ 是 $\\angle A$ 的 2 倍，$\\angle C$ 比 $\\angle A$ 大 $20^\\circ$，则 $x + 2x + (x + 20) = 180$。所以 $4x = 160$，$x = 40$。",
          ],
          [
            "The angles are $40^\\circ$, $80^\\circ$ and $60^\\circ$, and $40 + 80 + 60 = 180$.",
            "三个角分别是 $40^\\circ$、$80^\\circ$、$60^\\circ$，而 $40 + 80 + 60 = 180$。",
          ],
          [
            "Find the angle that was asked for. Here $x = 40$ is $\\angle A$, while $\\angle B$ is $2 \\cdot 40 = 80^\\circ$.",
            "要求题目问的那个角。这里 $x = 40$ 是 $\\angle A$，而 $\\angle B$ 是 $2 \\cdot 40 = 80^\\circ$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const x = rng.int(15, 60);
            const fb = rng.pick<Linear>([
              [rng.pick([2, 3, 4]), 0],
              [1, 5 * rng.nonZero(-8, 8)],
              [rng.pick([2, 3]), 5 * rng.nonZero(-6, 6)],
            ]);
            // C's coefficient is chosen; its constant makes the three angles add up to 180°.
            const cc = rng.pick([1, 2, 3]);
            const fc: Linear = [cc, 180 - x - at(fb, x) - cc * x];
            const angles = [x, at(fb, x), at(fc, x)];
            if (fc[1] % 5 !== 0 || Math.abs(fc[1]) > 60 || Math.min(...angles) < 10 || new Set(angles).size < 3) continue;
            const ask = rng.int(0, 2);
            const name = "ABC"[ask]!;
            const answer = angles[ask]!;
            const terms: Linear[] = [[1, 0], fb, fc];
            const form = terms[ask]!;
            const [rb, rc] = [relation(fb, "A"), relation(fc, "A")];
            const [sign, total] = sumWrong(terms, 180, 360);
            const offs: Off[] = [
              ...(ask === 0
                ? []
                : [
                    [
                      x,
                      "That is $m\\angle A$, the value of $x$; put it into the expression.",
                      "这是 $m\\angle A$，即 $x$ 的值；还要代入式子。",
                    ] as const,
                  ]),
              ...(sign?.isInteger()
                ? [
                    [
                      at(form, sign.toNumber()),
                      "That comes from moving the constant across with the wrong sign.",
                      "这是移项时常数的符号弄错了。",
                    ] as const,
                  ]
                : []),
              ...(total?.isInteger()
                ? [
                    [
                      at(form, total.toNumber()),
                      "That uses $360^\\circ$ as the angle sum; a triangle's angles add up to $180^\\circ$.",
                      "这是把内角和当成了 $360^\\circ$；三角形的内角和是 $180^\\circ$。",
                    ] as const,
                  ]
                : []),
            ];
            const walk = solving(sumSteps(terms, 180), [
              `Let $m\\angle A = x$. Then $m\\angle B = ${linear(...fb)}$ and $m\\angle C = ${linear(...fc)}$, and the three angles add up to $180^\\circ$:`,
              `设 $m\\angle A = x$，则 $m\\angle B = ${linear(...fb)}$，$m\\angle C = ${linear(...fc)}$，三个角之和为 $180^\\circ$：`,
            ]);
            return valued(
              [
                `In $\\triangle ABC$, $m\\angle B$ ${rb.en}, and $m\\angle C$ ${rc.en}. Find $m\\angle ${name}$.`,
                `在 $\\triangle ABC$ 中，$m\\angle B$ ${rb["zh-CN"]}，$m\\angle C$ ${rc["zh-CN"]}。求 $m\\angle ${name}$。`,
              ],
              answer,
              ask === 0
                ? walk
                : [
                    ...walk,
                    [
                      ["Find the angle", "求角"],
                      ["Put $x$ into its expression:", "把 $x$ 代入它的式子："],
                      [`m\\angle ${name} = ${subst(form, x)} = ${degTex(answer)}`],
                    ],
                  ],
              [
                `The three angles $${angles[0]}$, $${angles[1]}$ and $${angles[2]}$ add up to $180$.`,
                `三个角 $${angles[0]}$、$${angles[1]}$、$${angles[2]}$ 之和为 $180$。`,
              ],
              offs,
              { unit: "°" },
            );
          }
        },
        drawn(gradeDrawings5["problem-solving-with-angles-of-triangles#angles-described-in-words"]),
      ),
      lesson(
        "angles-across-two-triangles",
        ["Angles across two triangles", "两个三角形中的角"],
        [
          [
            "When two segments cross, they form two triangles that meet at a pair of vertical angles. Vertical angles are equal. So the other two angles of one triangle add up to the same as the other two angles of the other. If one triangle has angles of $50^\\circ$ and $70^\\circ$, the angle at the crossing is $180 - 120 = 60$ degrees.",
            "两条线段相交时，形成两个在一对对顶角处相接的三角形。对顶角相等。所以一个三角形另外两个角之和等于另一个三角形另外两个角之和。若一个三角形有 $50^\\circ$ 和 $70^\\circ$ 两个角，交点处的角就是 $180 - 120 = 60$ 度。",
          ],
          [
            "With $65^\\circ$ in the other triangle, the missing angle is $180 - 60 - 65 = 55$ degrees, and $50 + 70 = 65 + 55$.",
            "若另一个三角形有一个 $65^\\circ$ 的角，未知角就是 $180 - 60 - 65 = 55$ 度，而 $50 + 70 = 65 + 55$。",
          ],
          [
            "Do not stop at the crossing. The $60^\\circ$ there is not the missing angle; subtract it and the given angle from $180$.",
            "不要停在交点处。那里的 $60^\\circ$ 不是未知角；还要用 $180$ 减去它和已知角。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [a, b] = [rng.int(35, 80), rng.int(35, 80)];
            const d = rng.int(25, 95);
            const x = a + b - d;
            const gamma = 180 - a - b;
            if (gamma < 30 || x < 25 || x > 100 || x === d || Math.abs(x - d) > 50) continue;
            return valued(
              [
                `Segments $AD$ and $BE$ cross at $C$, with $m\\angle A = ${degTex(a)}$, $m\\angle B = ${degTex(b)}$ and $m\\angle D = ${degTex(d)}$. Find $x$.`,
                `线段 $AD$ 与 $BE$ 相交于 $C$，$m\\angle A = ${degTex(a)}$，$m\\angle B = ${degTex(b)}$，$m\\angle D = ${degTex(d)}$。求 $x$。`,
              ],
              x,
              [
                [
                  ["Find the angle at C", "求 C 处的角"],
                  ["In $\\triangle ABC$:", "在 $\\triangle ABC$ 中："],
                  [`m\\angle ACB = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${degTex(gamma)}`],
                ],
                [
                  ["Use vertical angles", "利用对顶角"],
                  [
                    `$\\angle DCE$ is vertical to $\\angle ACB$, so it also measures $${degTex(gamma)}$.`,
                    `$\\angle DCE$ 与 $\\angle ACB$ 是对顶角，所以也是 $${degTex(gamma)}$。`,
                  ],
                ],
                [
                  ["Solve in the other triangle", "在另一个三角形中求解"],
                  ["In $\\triangle DCE$:", "在 $\\triangle DCE$ 中："],
                  [`x = 180 - ${gamma} - ${d} = ${x}`],
                ],
              ],
              [
                `In one step, $${a} + ${b} = ${d} + x$ gives $x = ${x}$ as well.`,
                `一步写出：由 $${a} + ${b} = ${d} + x$ 同样得 $x = ${x}$。`,
              ],
              [
                [gamma, "That is the angle at $C$, not $x$.", "这是 $C$ 处的角，不是 $x$。"],
                [180 - d, "That forgets the angle at $C$.", "这是忘了 $C$ 处的角。"],
                [a + b, "That is the sum of the two given angles in the first triangle.", "这是第一个三角形中两个已知角之和。"],
              ],
              { solveFor: "x", figure: bowtie(a, b, d, x, [deg(a), deg(b), deg(d), "x°"]) },
            );
          }
        },
        drawn(gradeDrawings5["problem-solving-with-angles-of-triangles#angles-across-two-triangles"]),
      ),
    ],
  ),
  [
    "The angles of a triangular sail are in the ratio $1 : 2 : 3$. How large is its biggest angle?",
    "一面三角形船帆的三个角之比为 $1 : 2 : 3$。它最大的角是多少度？",
  ],
  [
    "The angles are $x$, $2x$ and $3x$, so $6x = 180$, $x = 30$, and the biggest is $90^\\circ$.",
    "三个角是 $x$、$2x$、$3x$，所以 $6x = 180$，$x = 30$，最大的角是 $90^\\circ$。",
  ],
  [
    "find the angles of a triangle given in a ratio, described in words, or across two triangles that share a vertex.",
    "求按比例给出、用文字描述，或在共顶点的两个三角形中的角。",
  ],
);

const units = ["cm", "m", "in", "ft"] as const;

/** unitNames are the plural names of the units of length. */
const unitNames: Record<(typeof units)[number], string> = { cm: "centimeters", m: "meters", in: "inches", ft: "feet" };

/** sideList writes three lengths: "4 cm, 7 cm and 12 cm". */
function sideList(sides: readonly number[], unit: string): Text {
  const [a, b, c] = sides.map((s) => `${s}\\text{ ${unit}}`);
  return t(`$${a}$, $${b}$ and $${c}$`, `$${a}$、$${b}$、$${c}$`);
}

/** triangleInequalityFigure shows three sets of segments over a long side: 4, 6 and 9 closing into a triangle, 3 and 5 lying flat along 8, and 2 and 4 failing to reach across 9. */
const triangleInequalityFigure: Figure = (() => {
  const c: Point = [61 / 18, Math.sqrt(16 - (61 / 18) ** 2)];
  const marks: Mark[] = [
    { kind: "polygon", points: [[0, 0], [9, 0], c] },
    { kind: "side", a: [0, 0], b: [9, 0], text: "9" },
    { kind: "side", a: [9, 0], b: c, text: "6" },
    { kind: "side", a: c, b: [0, 0], text: "4" },
    { kind: "label", at: [4.5, -2], text: "4 + 6 > 9", dir: "s" },
    { kind: "segment", a: [12, 0], b: [20, 0] },
    { kind: "side", a: [12, 0], b: [20, 0], text: "8" },
    { kind: "segment", a: [12, 0.3], b: [15, 0.3], accent: true },
    { kind: "segment", a: [15, 0.3], b: [20, 0.3], accent: true },
    { kind: "dot", at: [15, 0.3] },
    { kind: "side", a: [15, 0.3], b: [12, 0.3], text: "3" },
    { kind: "side", a: [20, 0.3], b: [15, 0.3], text: "5" },
    { kind: "label", at: [16, -2], text: "3 + 5 = 8", dir: "s" },
    { kind: "segment", a: [23, 0], b: [32, 0] },
    { kind: "side", a: [23, 0], b: [32, 0], text: "9" },
    { kind: "segment", a: [23, 0], b: [24, Math.sqrt(3)], accent: true },
    { kind: "segment", a: [32, 0], b: [30, 2 * Math.sqrt(3)], accent: true },
    { kind: "side", a: [24, Math.sqrt(3)], b: [23, 0], text: "2" },
    { kind: "side", a: [32, 0], b: [30, 2 * Math.sqrt(3)], text: "4" },
    { kind: "label", at: [27.5, -2], text: "2 + 4 < 9", dir: "s" },
  ];
  return {
    svg: sketch(marks),
    alt: t(
      "Three cases side by side. Sides 4 and 6 meet above a side of 9 and close into a triangle, since 4 + 6 > 9. Sides 3 and 5 lie flat along a side of 8, since 3 + 5 = 8. Sides 2 and 4 rise from the ends of a side of 9 but cannot meet, since 2 + 4 < 9.",
      "三种情形并排。长 4 和 6 的两边在长 9 的边上方相交，围成三角形，因为 4 + 6 > 9。长 3 和 5 的两边平躺在长 8 的边上，因为 3 + 5 = 8。长 2 和 4 的两边从长 9 的边两端立起，却无法相交，因为 2 + 4 < 9。",
    ),
  };
})();

const theTriangleInequality = withIntro(
  topic(
    "the-triangle-inequality",
    t("The Triangle Inequality", "三角形三边关系"),
    t(
      "Three lengths form a triangle only when the two shorter ones add up to more than the longest; so the third side of a triangle lies strictly between the difference and the sum of the other two.",
      "只有当较短的两条线段之和大于最长的一条时，三条线段才能组成三角形；因此三角形的第三边严格介于另两边之差与之和之间。",
    ),
    ["classifying-triangles"],
    ["7.G.A.2"],
    [
      lesson(
        "can-the-sides-form-a-triangle",
        ["Can the sides form a triangle?", "能组成三角形吗"],
        [
          [
            "In every triangle, any two sides add up to more than the third. This is the **triangle inequality**. To test three lengths, check that the **two shorter** ones add up to more than the **longest**. For $4$, $6$ and $9$: $4 + 6 = 10 > 9$, so they form a triangle.",
            "任何三角形中，任意两边之和大于第三边。这就是**三角形三边关系**。检验三条线段时，只需检查**较短的两条**之和是否大于**最长的一条**。对 $4$、$6$、$9$：$4 + 6 = 10 > 9$，所以能组成三角形。",
          ],
          [
            "For $2$, $4$ and $9$: $2 + 4 = 6 < 9$, so the two short sides cannot reach each other.",
            "对 $2$、$4$、$9$：$2 + 4 = 6 < 9$，所以两条短边够不着。",
          ],
          [
            "Equal is not enough. With $3$, $5$ and $8$, $3 + 5 = 8$, so the sides lie flat and make no triangle.",
            "相等是不够的。对 $3$、$5$、$8$，$3 + 5 = 8$，三条边只能平躺，组不成三角形。",
          ],
        ],
        (rng) => {
          const kind = rng.pick(["yes", "yes", "flat", "short"] as const);
          const a = rng.int(2, 12);
          const b = rng.int(a, 15);
          const c = kind === "yes" ? rng.int(b + 1, a + b - 1) : kind === "flat" ? a + b : a + b + rng.int(1, 6);
          const sides = [a, b, c];
          const longest = Math.max(...sides);
          const [s1, s2] = [...sides].sort((u, v) => u - v) as [number, number];
          const forms = s1 + s2 > longest;
          const flat = s1 + s2 === longest;
          const unit = rng.pick(units);
          const listed = sideList(rng.shuffle(sides), unit);
          const compare = forms
            ? `${s1} + ${s2} = ${s1 + s2} > ${longest}`
            : flat
              ? `${s1} + ${s2} = ${longest}`
              : `${s1} + ${s2} = ${s1 + s2} < ${longest}`;
          return decided(
            rng,
            [`Can segments of length ${listed.en} form a triangle?`, `长为 ${listed["zh-CN"]} 的三条线段能组成三角形吗？`],
            forms,
            [
              [
                ["Order the sides", "排出长短"],
                [
                  `The two shorter sides are $${s1}$ and $${s2}$; the longest is $${longest}$.`,
                  `较短的两边是 $${s1}$ 和 $${s2}$；最长边是 $${longest}$。`,
                ],
              ],
              [["Compare", "比较"], ["Compare the two shorter sides with the longest:", "把较短的两边之和与最长边比较："], [compare]],
            ],
            [
              `Lay the two shorter sides along the $${longest}$ side from its two ends: the $${s2}$ side leaves $${longest} - ${s2} = ${longest - s2}$ to cover, and the ${s1 === s2 ? "other " : ""}$${s1}$ side is ${
                forms
                  ? "longer than that, so the sides overlap and must rise to meet above it"
                  : flat
                    ? "exactly that long, so the two sides meet only lying flat on it"
                    : "shorter than that, so the two sides never meet"
              }.`,
              `把较短的两边从两端沿长为 $${longest}$ 的边放下：$${s2}$ 这条边还差 $${longest} - ${s2} = ${longest - s2}$ 没盖住，而${s1 === s2 ? "另一条" : ""} $${s1}$ 这条边${
                forms
                  ? "比它长，两边会重叠，所以要抬起来在上方相交"
                  : flat
                    ? "正好这么长，所以两边只能平躺在这条边上相交"
                    : "比它短，所以两边永远碰不到"
              }。`,
            ],
            forms
              ? [
                  "The two shorter sides add up to more than the longest, which is all a triangle needs.",
                  "较短两边之和大于最长边，组成三角形只需要这一点。",
                ]
              : flat
                ? [
                    "The two shorter sides only equal the longest, so they would lie flat along it.",
                    "较短两边之和只是等于最长边，所以它们只能平躺在最长边上。",
                  ]
                : ["The two shorter sides are too short to reach across the longest.", "较短的两边太短，够不着最长边的两端。"],
            tapeFigure(
              [
                {
                  pieces: [
                    { size: s1, text: `${s1}` },
                    { size: s2, text: `${s2}`, lit: true },
                  ],
                },
                { pieces: [{ size: longest, text: `${longest}` }] },
              ],
              [
                `Two bars: the two shorter sides ${s1} and ${s2} end to end, and the longest side ${longest} below them.`,
                `两个长条：较短的两边 ${s1} 和 ${s2} 首尾相接，下面是最长边 ${longest}。`,
              ],
            ),
          );
        },
        triangleInequalityFigure,
      ),
      lesson(
        "range-of-the-third-side",
        ["The range of the third side", "第三边的范围"],
        [
          [
            "If two sides of a triangle are $a$ and $b$ with $a \\ge b$, the third side $c$ must satisfy $a - b < c < a + b$. With sides $5$ and $9$, $4 < c < 14$. If $c$ is a whole number, it can be any of $5, 6, \\ldots, 13$.",
            "若三角形的两边为 $a$ 和 $b$，且 $a \\ge b$，则第三边 $c$ 满足 $a - b < c < a + b$。两边为 $5$ 和 $9$ 时，$4 < c < 14$。若 $c$ 是整数，它可以是 $5, 6, \\ldots, 13$ 中的任意一个。",
          ],
          [
            "Both ends of that list work: $5 + 5 = 10 > 9$, and $5 + 9 = 14 > 13$.",
            "这串数的两端都可以：$5 + 5 = 10 > 9$，$5 + 9 = 14 > 13$。",
          ],
          [
            "The ends of the range are not allowed. A third side of $4$ or $14$ makes the sides lie flat.",
            "范围的两个端点不行。第三边为 $4$ 或 $14$ 时，三条边会平躺在一条线上。",
          ],
        ],
        (rng) => {
          const [a, b] = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 2) as [number, number];
          const [hi, lo] = [Math.max(a, b), Math.min(a, b)];
          const greatest = rng.bool();
          const unit = rng.pick(units);
          const answer = greatest ? hi + lo - 1 : hi - lo + 1;
          const [u, v, w] = [lo, hi, answer].sort((p, q) => p - q) as [number, number, number];
          const which: Pair = greatest ? ["greatest", "最长"] : ["least", "最短"];
          return valued(
            [
              `Two sides of a triangle measure $${a}\\text{ ${unit}}$ and $${b}\\text{ ${unit}}$. The third side is a whole number of ${unitNames[unit]}. What is its ${which[0]} possible length?`,
              `一个三角形的两边长为 $${a}\\text{ ${unit}}$ 和 $${b}\\text{ ${unit}}$，第三边的长是整数（单位 ${unit}）。第三边${which[1]}是多少？`,
            ],
            answer,
            [
              [
                ["Write the range", "写出范围"],
                [
                  "The third side $c$ lies strictly between the difference and the sum of the other two:",
                  "第三边 $c$ 严格介于另两边之差与之和之间：",
                ],
                [`${hi} - ${lo} < c < ${hi} + ${lo}`, `${hi - lo} < c < ${hi + lo}`],
              ],
              [
                ["Pick the whole number", "取整数"],
                [
                  `The ${greatest ? "greatest" : "least"} whole number strictly inside is $${answer}$.`,
                  `严格在范围内的${greatest ? "最大" : "最小"}整数是 $${answer}$。`,
                ],
              ],
            ],
            [
              `With $${answer}$, the two shorter sides add up to more than the longest: $${u} + ${v} = ${u + v} > ${w}$.`,
              `取 $${answer}$ 时，较短两边之和大于最长边：$${u} + ${v} = ${u + v} > ${w}$。`,
            ],
            greatest
              ? [
                  [hi + lo, "That equals the sum, so the sides would lie flat.", "这等于两边之和，三条边会平躺。"],
                  [hi + lo + 1, "That is longer than the other two sides together.", "这比另两边加起来还长。"],
                  [hi, "That is the longer given side, not the greatest third side.", "这是较长的已知边，不是第三边的最大值。"],
                ]
              : (
                  [
                    [hi - lo, "That equals the difference, so the sides would lie flat.", "这等于两边之差，三条边会平躺。"],
                    [hi - lo - 1, "That is shorter than the difference, so the sides cannot reach.", "这比两边之差还短，边够不着。"],
                    [lo, "That is the shorter given side, not the least third side.", "这是较短的已知边，不是第三边的最小值。"],
                  ] satisfies Off[]
                ).filter(([x]) => (x as number) > 0),
            { unit },
          );
        },
        drawn(gradeDrawings3["the-triangle-inequality#range-of-the-third-side"]),
      ),
      lesson(
        "possible-third-sides",
        ["Possible third sides", "可能的第三边"],
        [
          [
            "To decide whether a length could be the third side, check that it is **strictly** between the difference and the sum of the two given sides. With sides $6$ and $10$, the third side is between $4$ and $16$. So $7$ or $15$ could be the third side.",
            "要判断一个长度能否作为第三边，检查它是否**严格**介于已知两边之差与之和之间。两边为 $6$ 和 $10$ 时，第三边在 $4$ 与 $16$ 之间。所以 $7$ 或 $15$ 可以作为第三边。",
          ],
          [
            "With $15$, the two shorter sides give $6 + 10 = 16 > 15$, so the triangle closes.",
            "取 $15$ 时，较短两边之和 $6 + 10 = 16 > 15$，三角形能够闭合。",
          ],
          [
            "Lengths at the ends fail too. Neither $4$ nor $16$ can be the third side, and $17$ is far too long.",
            "端点上的长度也不行。$4$ 和 $16$ 都不能作第三边，$17$ 更是太长了。",
          ],
        ],
        (rng) => {
          const [a, b] = rng.sample([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 2) as [number, number];
          const [hi, lo] = [Math.max(a, b), Math.min(a, b)];
          const correct = rng.int(hi - lo + 1, hi + lo - 1);
          const unit = rng.pick(units);
          const opt = (v: number): Pair => [`$${v}\\text{ ${unit}}$`, `$${v}\\text{ ${unit}}$`];
          const outside: [Pair, string, string][] = [
            [opt(hi + lo), "That equals the sum, so the sides would lie flat.", "这等于两边之和，三条边会平躺。"],
            [opt(hi - lo), "That equals the difference, so the sides would lie flat.", "这等于两边之差，三条边会平躺。"],
            [opt(hi + lo + rng.int(1, 4)), "That is longer than the other two sides together.", "这比另两边加起来还长。"],
            ...(hi - lo > 1
              ? [
                  [
                    opt(rng.int(1, hi - lo - 1)),
                    "That is shorter than the difference, so the sides cannot reach.",
                    "这比两边之差还短，边够不着。",
                  ] as [Pair, string, string],
                ]
              : []),
          ];
          const [u, v, w] = [lo, hi, correct].sort((p, q) => p - q) as [number, number, number];
          return chosen(
            rng,
            [
              `Two sides of a triangle measure $${a}\\text{ ${unit}}$ and $${b}\\text{ ${unit}}$. Which could be the length of the third side?`,
              `一个三角形的两边长为 $${a}\\text{ ${unit}}$ 和 $${b}\\text{ ${unit}}$。下列哪个可能是第三边的长？`,
            ],
            opt(correct),
            rng.shuffle(outside).slice(0, 3),
            [
              [
                ["Find the range", "求范围"],
                ["The third side must be strictly between the difference and the sum:", "第三边必须严格介于两边之差与之和之间："],
                [`${hi} - ${lo} < c < ${hi} + ${lo}`, `${hi - lo} < c < ${hi + lo}`],
              ],
              [
                ["Pick the length", "选出长度"],
                [
                  `Only $${correct}\\text{ ${unit}}$ lies strictly inside this range.`,
                  `只有 $${correct}\\text{ ${unit}}$ 严格在这个范围内。`,
                ],
              ],
            ],
            [
              `With $${correct}$, the two shorter sides add up to more than the longest: $${u} + ${v} = ${u + v} > ${w}$.`,
              `取 $${correct}$ 时，较短两边之和大于最长边：$${u} + ${v} = ${u + v} > ${w}$。`,
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 20,
            step: 1,
            labels: [0, 4, 16, 20],
            marks: [
              { at: 4, text: "10 − 6" },
              { at: 7, result: true },
              { at: 15, result: true },
              { at: 16, text: "10 + 6" },
            ],
          },
          [
            "A number line from 0 to 20 with the ends of the range marked at 4 = 10 − 6 and 16 = 10 + 6, and the lengths 7 and 15 marked inside it.",
            "从 0 到 20 的数轴，范围的两端标在 4 = 10 − 6 和 16 = 10 + 6，范围内标出 7 和 15 两个长度。",
          ],
        ),
      ),
    ],
  ),
  ["Can you build a triangle from sticks of $3$ cm, $4$ cm and $9$ cm?", "用长 $3$ 厘米、$4$ 厘米和 $9$ 厘米的三根小棒能搭成三角形吗？"],
  ["No: $3 + 4 = 7$ is less than $9$, so the two short sticks cannot meet.", "不能：$3 + 4 = 7$ 小于 $9$，两根短棒碰不到一起。"],
  [
    "test whether three lengths form a triangle, and find the possible lengths of a third side.",
    "检验三条线段能否组成三角形，并求第三边可能的长度。",
  ],
);

// ─── Polygons ───────────────────────────────────────────────────────────────

/** listOf joins measures in degrees: "a°, b° and c°", "a°、b° 和 c°". */
function listOf(values: readonly string[]): Text {
  const en = values.length === 2 ? values.join(" and ") : `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
  return t(en, `${values.slice(0, -1).join("、")} 和 ${values.at(-1)}`);
}

/** exteriorAnglesFigure shows a pentagon with each side extended at its far end, marking the exterior angles 70°, 85°, 60°, 90° and 55°. */
const exteriorAnglesFigure: Figure = (() => {
  // The vertices come from walking sides of lengths 4, 3, 3.2, 4.134 and 2.198, turning by each exterior angle.
  const pts: Point[] = [
    [0, 0],
    [4, 0],
    [5.026, 2.819],
    [2.126, 4.171],
    [-1.261, 1.8],
  ];
  const turns = [55, 70, 85, 60, 90];
  const marks: Mark[] = [{ kind: "polygon", points: pts }];
  pts.forEach((v, j) => {
    const prev = pts[(j + 4) % 5]!;
    const next = pts[(j + 1) % 5]!;
    const len = Math.hypot(v[0] - prev[0], v[1] - prev[1]);
    const out: Point = [v[0] + (1.4 * (v[0] - prev[0])) / len, v[1] + (1.4 * (v[1] - prev[1])) / len];
    marks.push({ kind: "segment", a: v, b: out, dashed: true });
    marks.push({ kind: "arc", vertex: v, from: out, to: next, label: `${turns[j]}°`, accent: true });
  });
  return {
    svg: sketch(marks),
    alt: t(
      "A convex pentagon with each side extended past a vertex as a dashed ray. The exterior angles between each extension and the next side are 55°, 70°, 85°, 60° and 90°, which add up to 360°.",
      "一个凸五边形，每条边在一个顶点处延长成虚线射线。每条延长线与下一条边所成的外角分别为 55°、70°、85°、60° 和 90°，它们的和是 360°。",
    ),
  };
})();

const exteriorAnglesOfPolygons = withIntro(
  topic(
    "exterior-angles-of-polygons",
    t("Exterior Angles of Polygons", "多边形的外角"),
    t(
      "The exterior angles of a convex polygon, one at each vertex, always add up to $360^\\circ$, whatever the number of sides; use this to find missing exterior angles and to solve for unknowns.",
      "凸多边形的外角（每个顶点取一个）之和总是 $360^\\circ$，与边数无关；利用这一点求未知的外角并解出未知数。",
    ),
    ["angles-of-polygons"],
    ["8.G.A.5"],
    [
      lesson(
        "the-exterior-angle-sum",
        ["The exterior angle sum", "外角和"],
        [
          [
            "At each vertex of a convex polygon, extending one side makes an **exterior angle**. Walking once around the polygon, you turn by each exterior angle in turn. You end up facing the way you started, so the exterior angles add up to $360^\\circ$, for any number of sides. If a pentagon has exterior angles $70^\\circ$, $85^\\circ$, $60^\\circ$ and $90^\\circ$, the fifth is $360^\\circ - 305^\\circ = 55^\\circ$.",
            "在凸多边形的每个顶点处延长一条边，得到一个**外角**。沿多边形走一圈，在每个顶点依次转过一个外角。最后回到出发时的朝向，所以无论有几条边，外角和都是 $360^\\circ$。若一个五边形的四个外角为 $70^\\circ$、$85^\\circ$、$60^\\circ$、$90^\\circ$，则第五个外角是 $360^\\circ - 305^\\circ = 55^\\circ$。",
          ],
          ["The five angles add up to $70 + 85 + 60 + 90 + 55 = 360$.", "五个外角之和为 $70 + 85 + 60 + 90 + 55 = 360$。"],
          [
            "The sum is $360^\\circ$ for every polygon. Do not use the interior angle sum $(n - 2) \\cdot 180^\\circ$ here.",
            "每个多边形的外角和都是 $360^\\circ$。这里不要用内角和 $(n - 2) \\cdot 180^\\circ$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.int(4, 7);
            const known = Array.from({ length: n - 1 }, () => rng.int(25, 110));
            const sum = known.reduce((s, v) => s + v, 0);
            const x = 360 - sum;
            if (x < 20 || x > 120) continue;
            const name = polygonName(n);
            const listed = listOf([...known.map((v) => `$${degTex(v)}$`), "$x^\\circ$"]);
            return valued(
              [
                `A convex ${name.en} has exterior angles (one at each vertex) of ${listed.en}. Find $x$.`,
                `一个凸${name["zh-CN"]}的外角（每个顶点取一个）分别为 ${listed["zh-CN"]}。求 $x$。`,
              ],
              x,
              [
                [
                  ["Use the sum", "利用外角和"],
                  ["The exterior angles of any convex polygon add up to $360^\\circ$:", "任何凸多边形的外角和都是 $360^\\circ$："],
                  [`${known.join(" + ")} + x = 360`, `${sum} + x = 360`],
                ],
                [["Solve", "求解"], ["Subtract the known angles:", "减去已知的角："], [`x = 360 - ${sum} = ${x}`]],
              ],
              [`All ${n} exterior angles together make $${sum} + ${x} = 360$ degrees.`, `${n} 个外角合起来是 $${sum} + ${x} = 360$ 度。`],
              [
                [(n - 2) * 180 - sum, "That uses the interior angle sum instead of $360^\\circ$.", "这是用了内角和，而不是 $360^\\circ$。"],
                [180 - x, "That is the interior angle at that vertex.", "这是该顶点处的内角。"],
                [
                  Q.of(360, n),
                  "That assumes the polygon is regular, but its angles differ.",
                  "这是把它当成了正多边形，但它的各角并不相等。",
                ],
              ],
              { solveFor: "x" },
            );
          }
        },
        exteriorAnglesFigure,
      ),
      lesson(
        "exterior-angle-equations",
        ["Equations with exterior angles", "外角的方程"],
        [
          [
            "When the exterior angles are written with a variable, set their sum equal to $360^\\circ$. An interior angle is then $180^\\circ$ minus the exterior angle at the same vertex. If the exterior angles of a quadrilateral are $x^\\circ$, $2x^\\circ$, $3x^\\circ$ and $4x^\\circ$, then $10x = 360$, so $x = 36$. The largest exterior angle is $144^\\circ$, so the smallest interior angle is $180^\\circ - 144^\\circ = 36^\\circ$.",
            "当外角用含变量的式子表示时，令它们的和等于 $360^\\circ$。每个内角等于 $180^\\circ$ 减去同一顶点处的外角。若一个四边形的外角为 $x^\\circ$、$2x^\\circ$、$3x^\\circ$、$4x^\\circ$，则 $10x = 360$，所以 $x = 36$。最大的外角是 $144^\\circ$，所以最小的内角是 $180^\\circ - 144^\\circ = 36^\\circ$。",
          ],
          ["The exterior angles $36$, $72$, $108$ and $144$ add up to $360$.", "外角 $36$、$72$、$108$、$144$ 之和为 $360$。"],
          [
            "The smallest interior angle sits next to the largest exterior angle, not the smallest one.",
            "最小的内角与最大的外角相邻，而不是与最小的外角相邻。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.int(3, 6);
            const cs = Array.from({ length: n }, () => rng.int(1, 5)).sort((u, v) => u - v);
            const total = cs.reduce((s, c) => s + c, 0);
            if (360 % total !== 0 || new Set(cs).size < 2) continue;
            const x = 360 / total;
            const top = cs.at(-1)! * x;
            if (top >= 180 || cs[0]! * x < 15) continue;
            const name = polygonName(n);
            const listed = listOf(cs.map((c) => `$${c === 1 ? "" : c}x^\\circ$`));
            const askX = rng.bool();
            const walk: Walk[] = [
              [
                ["Use the sum", "利用外角和"],
                ["The exterior angles add up to $360^\\circ$:", "外角和为 $360^\\circ$："],
                [`${cs.map((c) => (c === 1 ? "x" : `${c}x`)).join(" + ")} = 360`],
              ],
              [
                ["Solve", "求解"],
                ["Collect the terms and divide:", "合并后相除："],
                [`${total}x = 360`, `x = ${x}`],
              ],
            ];
            const head: Pair = [
              `The exterior angles of a convex ${name.en} measure ${listed.en}.`,
              `一个凸${name["zh-CN"]}的外角分别为 ${listed["zh-CN"]}。`,
            ];
            if (askX) {
              return valued(
                [`${head[0]} Find $x$.`, `${head[1]}求 $x$。`],
                x,
                walk,
                [
                  `Then the exterior angles are $${cs.map((c) => c * x).join("$, $")}$, which add up to $360$.`,
                  `这时外角分别是 $${cs.map((c) => c * x).join("$、$")}$，和为 $360$。`,
                ],
                [
                  [
                    Q.of((n - 2) * 180, total),
                    "That uses the interior angle sum instead of $360^\\circ$.",
                    "这是用了内角和，而不是 $360^\\circ$。",
                  ],
                  [
                    Q.of(180, total),
                    "That uses $180^\\circ$ as the sum instead of $360^\\circ$.",
                    "这是把外角和当成了 $180^\\circ$，而不是 $360^\\circ$。",
                  ],
                  [total, "That is the sum of the coefficients, not $x$.", "这是系数之和，不是 $x$。"],
                ],
                { solveFor: "x" },
              );
            }
            return valued(
              [`${head[0]} What is the measure of its smallest interior angle?`, `${head[1]}它最小的内角是多少度？`],
              180 - top,
              [
                ...walk,
                [
                  ["Find the interior angle", "求内角"],
                  [
                    `The smallest interior angle is next to the largest exterior angle, $${cs.at(-1)}x = ${degTex(top)}$:`,
                    `最小的内角与最大的外角 $${cs.at(-1)}x = ${degTex(top)}$ 相邻：`,
                  ],
                  [`180^\\circ - ${degTex(top)} = ${degTex(180 - top)}`],
                ],
              ],
              [
                `The interior and exterior angles at that vertex make $${180 - top} + ${top} = 180$ degrees.`,
                `该顶点处的内角与外角合起来是 $${180 - top} + ${top} = 180$ 度。`,
              ],
              [
                [top, "That is the largest exterior angle, not an interior angle.", "这是最大的外角，不是内角。"],
                [
                  180 - cs[0]! * x,
                  "That is the largest interior angle; the smallest sits next to the largest exterior angle.",
                  "这是最大的内角；最小的内角与最大的外角相邻。",
                ],
                [cs[0]! * x, "That is the smallest exterior angle.", "这是最小的外角。"],
              ],
              { unit: "°" },
            );
          }
        },
        drawn(gradeDrawings5["exterior-angles-of-polygons#exterior-angle-equations"]),
      ),
      lesson(
        "sides-from-the-ratio-of-interior-to-exterior",
        ["Sides from the ratio of interior to exterior", "由内外角之比求边数"],
        [
          [
            "At each vertex, the interior and exterior angles form a straight line, so they add up to $180^\\circ$. Splitting $180^\\circ$ in their ratio gives both angles. The exterior angles of a regular polygon add up to $360^\\circ$, so $360^\\circ$ divided by one exterior angle is the number of sides. For the ratio $4 : 1$, the exterior angle is $180 \\cdot \\frac{1}{5} = 36$ degrees, and $360 \\div 36 = 10$ sides.",
            "在每个顶点，内角和外角组成一条直线，所以它们的和是 $180^\\circ$。按它们的比分配 $180^\\circ$，就得到两个角。正多边形的外角和是 $360^\\circ$，所以用 $360^\\circ$ 除以一个外角，就得到边数。比为 $4 : 1$ 时，外角是 $180 \\cdot \\frac{1}{5} = 36$ 度，边数是 $360 \\div 36 = 10$。",
          ],
          [
            "Each interior angle is then $180 - 36 = 144$ degrees, and $144 : 36 = 4 : 1$.",
            "这时每个内角是 $180 - 36 = 144$ 度，而 $144 : 36 = 4 : 1$。",
          ],
          [
            "Divide $360^\\circ$ by the exterior angle, not by the interior one. That is much simpler than the interior angle formula.",
            "要用 $360^\\circ$ 除以外角，而不是内角。这比用内角公式简单得多。",
          ],
        ],
        (rng) => {
          const answer = rng.int(5, 60);
          const even = answer % 2 === 0;
          const p = even ? (answer - 2) / 2 : answer - 2;
          const q = even ? 1 : 2;
          const exterior = Q.of(360, answer);
          const interiorAngle = Q.of(180 * answer - 360, answer);
          return valued(
            [
              `In a regular polygon, each interior angle and each exterior angle are in the ratio $${p} : ${q}$. How many sides does the polygon have?`,
              `在一个正多边形中，每个内角和每个外角的比是 $${p} : ${q}$。这个多边形有多少条边？`,
            ],
            answer,
            [
              [
                ["Split 180°", "分配 180°"],
                ["The two angles add up to $180^\\circ$, so the exterior angle is:", "两个角的和是 $180^\\circ$，所以外角是："],
                [`180^\\circ \\times \\frac{${q}}{${p + q}} = ${exterior.toLatex()}^\\circ`],
              ],
              [
                ["Count the sides", "求边数"],
                ["The exterior angles add up to $360^\\circ$:", "外角和是 $360^\\circ$："],
                [`360 \\div ${exterior.toLatex()} = ${answer}`],
              ],
            ],
            [
              `Each interior angle is then $${interiorAngle.toLatex()}^\\circ$, and $${interiorAngle.toLatex()} : ${exterior.toLatex()} = ${p} : ${q}$.`,
              `这时每个内角是 $${interiorAngle.toLatex()}^\\circ$，而 $${interiorAngle.toLatex()} : ${exterior.toLatex()} = ${p} : ${q}$。`,
            ],
            [
              [p + q, "That adds the numbers of the ratio instead of finding the exterior angle.", "这是把比中的数相加了，而不是求外角。"],
              [
                Q.of(2 * (p + q), p),
                "That divides $360^\\circ$ by the interior angle instead of the exterior one.",
                "这是用 $360^\\circ$ 除以内角，而不是外角。",
              ],
              [p, "That takes the interior part of the ratio as the number of sides.", "这是把比中内角的那个数当成了边数。"],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "180°",
              pieces: [
                { size: 4, text: "144°" },
                { size: 1, text: "36°", lit: true },
              ],
            },
          ],
          [
            "A bar of 180° cut in the ratio 4 : 1 into an interior angle of 144° and a shaded exterior angle of 36°.",
            "一个表示 180° 的长条按 4 : 1 分成内角 144° 和涂色的外角 36°。",
          ],
        ),
      ),
    ],
  ),
  [
    "A robot walks once around a five-sided park, turning left at each corner. How far does it turn in all?",
    "一个机器人绕一个五边形公园走一圈，在每个拐角向左转。它一共转了多少度？",
  ],
  ["It ends facing the way it started, so it turns $360^\\circ$ in all.", "它最后回到出发时的朝向，所以一共转了 $360^\\circ$。"],
  [
    "use the exterior angle sum of $360^\\circ$ to find missing angles, solve equations, and count the sides of a regular polygon.",
    "利用 $360^\\circ$ 的外角和求未知的角、解方程，并求正多边形的边数。",
  ],
);

/** regularNs are the numbers of sides whose regular polygons have whole-number interior angles. */
const regularNs = [4, 5, 6, 8] as const;

/** polygonLetters are the vertex names of a regular polygon, counterclockwise. */
const polygonLetters = "ABCDEFGHIJKL";

/** regularFigure draws a regular n-gon with the diagonal from vertex k to vertex k + 2, marking the angle at vertex v between vertices from and to. */
function regularFigure(n: number, k: number, [v, from, to]: readonly [number, number, number]): Figure {
  const start = -90 - 180 / n;
  const pts = Array.from({ length: n }, (_, i) => dir(start + (360 * i) / n, 4));
  const letters = polygonLetters.slice(0, n);
  const [p, r] = [letters[k]!, letters[k + 2]!];
  return fig(
    [{ kind: "polygon", points: pts }, seg(pts[k]!, pts[k + 2]!, true), arc(pts[v]!, pts[from]!, pts[to]!), ...names(pts, letters, [0, 0])],
    `A regular ${n}-sided polygon ${letters} with the diagonal ${p}${r} drawn and angle ${letters[from]}${letters[v]}${letters[to]} marked.`,
    `正 ${n} 边形 ${letters}，画出了对角线 ${p}${r}，并标出了 ∠${letters[from]}${letters[v]}${letters[to]}。`,
  );
}

const regularPolygons = withIntro(
  topic(
    "regular-polygons",
    t("Regular Polygons", "正多边形"),
    t(
      "A regular polygon has all sides equal and all angles equal. Recognize regular polygons, find the number of sides from how the interior and exterior angles compare, and find angles formed by a diagonal.",
      "正多边形的各边相等、各角也相等。识别正多边形，由内角与外角的关系求边数，并求对角线形成的角。",
    ),
    ["exterior-angles-of-polygons"],
    ["8.G.A.5"],
    [
      lesson(
        "recognizing-regular-polygons",
        ["Recognizing regular polygons", "识别正多边形"],
        [
          [
            "A polygon is **regular** only when its sides are all equal **and** its angles are all equal. A square has both, so it is a regular quadrilateral.",
            "多边形只有在各边都相等**并且**各角都相等时才是**正多边形**。正方形两者兼备，所以它是正四边形。",
          ],
          [
            "A regular hexagon has six equal sides and six angles of $120^\\circ$, and $6 \\cdot 120 = 720 = 4 \\cdot 180$.",
            "正六边形有六条相等的边和六个 $120^\\circ$ 的角，而 $6 \\cdot 120 = 720 = 4 \\cdot 180$。",
          ],
          [
            "One condition alone is not enough. A rhombus has equal sides and a rectangle has equal angles, yet neither need be regular.",
            "只满足一条不够。菱形的边相等，长方形的角相等，但它们都不一定是正多边形。",
          ],
        ],
        (rng) => {
          const kind = rng.pick(["regular", "regular", "sides", "angles"] as const);
          // Only even n is used for the irregular kinds: alternating sides or angles always close up into a polygon.
          const n = kind === "regular" ? rng.pick(regularNs) : rng.pick([4, 6, 8]);
          const angle = ((n - 2) * 180) / n;
          const side = rng.int(3, 12);
          const [k, d] = [rng.int(1, 5), rng.int(4, 25)];
          const sides = Array.from({ length: n }, (_, i) => (kind === "angles" && i % 2 === 1 ? side + k : side));
          const angles = Array.from({ length: n }, (_, i) => (kind === "sides" ? angle + (i % 2 === 0 ? d : -d) : angle));
          const unit = rng.pick(units);
          const name = polygonName(n);
          const sideText = listOf(sides.map((s) => `$${s}\\text{ ${unit}}$`));
          const angleText = listOf(angles.map((a) => `$${degTex(a)}$`));
          const regular = kind === "regular";
          return decided(
            rng,
            [
              `${/^[aeiou]/.test(name.en) ? "An" : "A"} ${name.en} has sides of ${sideText.en}, in order, and angles of ${angleText.en}. Is it a regular polygon?`,
              `一个${name["zh-CN"]}的各边依次为 ${sideText["zh-CN"]}，各角为 ${angleText["zh-CN"]}。它是正多边形吗？`,
            ],
            regular,
            [
              [
                ["Check the sides", "看边"],
                kind === "angles"
                  ? [
                      `The sides take two lengths, $${side}$ and $${side + k}$, so they are not all equal.`,
                      `边长有 $${side}$ 和 $${side + k}$ 两种，所以并不全相等。`,
                    ]
                  : [`All ${n} sides measure $${side}\\text{ ${unit}}$.`, `${n} 条边都是 $${side}\\text{ ${unit}}$。`],
              ],
              [
                ["Check the angles", "看角"],
                kind === "sides"
                  ? [
                      `The angles take two sizes, $${degTex(angle + d)}$ and $${degTex(angle - d)}$, so they are not all equal.`,
                      `角有 $${degTex(angle + d)}$ 和 $${degTex(angle - d)}$ 两种，所以并不全相等。`,
                    ]
                  : [`All ${n} angles measure $${degTex(angle)}$.`, `${n} 个角都是 $${degTex(angle)}$。`],
              ],
            ],
            regular
              ? [
                  `Both conditions hold. The angles also add up to $${n} \\cdot ${angle} = ${n * angle} = (${n} - 2) \\cdot 180$, as they must.`,
                  `两条都满足。各角之和也是 $${n} \\cdot ${angle} = ${n * angle} = (${n} - 2) \\cdot 180$，正该如此。`,
                ]
              : kind === "sides"
                ? [
                    "Equal sides alone do not make a polygon regular, so it is not regular.",
                    "只有边相等不能成为正多边形，所以它不是正多边形。",
                  ]
                : [
                    "Equal angles alone do not make a polygon regular, so it is not regular.",
                    "只有角相等不能成为正多边形，所以它不是正多边形。",
                  ],
            regular
              ? [
                  "Its sides are all equal and its angles are all equal, so nothing stops it from being regular.",
                  "它各边相等、各角也相等，所以它就是正多边形。",
                ]
              : kind === "sides"
                ? ["Equal sides are not enough; the angles must be equal too.", "边相等还不够；角也必须相等。"]
                : ["Equal angles are not enough; the sides must be equal too.", "角相等还不够；边也必须相等。"],
            tableFigure(
              ["", ""],
              sides.map((_, i) => `${i + 1}`),
              [sides.map((s) => `${s} ${unit}`), angles.map((a) => `${a}°`)],
              [
                `A table of the ${n} sides, in order, in the top row and the ${n} angles in the bottom row.`,
                `一张表：上一行依次是 ${n} 条边的长，下一行是 ${n} 个角的度数。`,
              ],
            ),
          );
        },
        drawn(gradeDrawings3["regular-polygons#recognizing-regular-polygons"]),
      ),
      lesson(
        "sides-from-angle-relationships",
        ["Sides from angle relationships", "由角的关系求边数"],
        [
          [
            "In a regular polygon with $n$ sides, each exterior angle is $\\frac{360^\\circ}{n}$, and each interior angle is $180^\\circ$ minus that. A relationship between the two angles gives the exterior angle, and then $n$. If each interior angle is $4$ times each exterior angle, the two together make $5$ exterior angles, which is $180^\\circ$. So each exterior angle is $36^\\circ$, and $n = 360 \\div 36 = 10$.",
            "在 $n$ 条边的正多边形中，每个外角是 $\\frac{360^\\circ}{n}$，每个内角是 $180^\\circ$ 减去外角。由两种角之间的关系可以求出外角，进而求出 $n$。若每个内角是每个外角的 $4$ 倍，两者合起来是 $5$ 个外角，等于 $180^\\circ$。所以每个外角是 $36^\\circ$，$n = 360 \\div 36 = 10$。",
          ],
          [
            "Each interior angle is then $180 - 36 = 144$ degrees, and $144 = 4 \\cdot 36$.",
            "这时每个内角是 $180 - 36 = 144$ 度，而 $144 = 4 \\cdot 36$。",
          ],
          [
            "Divide $360^\\circ$, not $180^\\circ$, by the exterior angle. Here $180 \\div 36 = 5$ is only half the number of sides.",
            "要用 $360^\\circ$ 而不是 $180^\\circ$ 去除以外角。这里 $180 \\div 36 = 5$ 只是边数的一半。",
          ],
        ],
        (rng) => {
          const kind = rng.int(0, 2);
          const count = (n: number, exterior: Q): Walk => [
            ["Count the sides", "求边数"],
            ["The exterior angles add up to $360^\\circ$:", "外角和为 $360^\\circ$："],
            [`n = 360 \\div ${exterior.toLatex()} = ${n}`],
          ];
          const check = (exterior: Q): Pair => {
            const inner = Q.of(180).sub(exterior).toLatex();
            return [
              `Then each interior angle is $${inner}^\\circ$ and each exterior angle is $${exterior.toLatex()}^\\circ$, which fit the description.`,
              `这时每个内角是 $${inner}^\\circ$，每个外角是 $${exterior.toLatex()}^\\circ$，与题意相符。`,
            ];
          };
          const half = (n: number): Off => [
            Q.of(n, 2),
            "That divides $180^\\circ$ by the exterior angle; the exterior angles add up to $360^\\circ$.",
            "这是用 $180^\\circ$ 除以外角；外角和是 $360^\\circ$。",
          ];
          if (kind === 0) {
            const [p, q] = rng.pick([
              [3, 2],
              [7, 2],
              [13, 2],
              [5, 1],
              [3, 1],
              [8, 1],
            ] as const);
            const exterior = Q.of(180 * q, p + q);
            const qx = q === 1 ? "x" : `${q}x`;
            const n = 360 / exterior.toNumber();
            return valued(
              [
                `In a regular polygon, the ratio of each interior angle to each exterior angle is $${p} : ${q}$. How many sides does the polygon have?`,
                `一个正多边形的每个内角与每个外角之比为 $${p} : ${q}$。这个多边形有几条边？`,
              ],
              n,
              [
                [
                  ["Find the exterior angle", "求外角"],
                  [`Write the angles as $${p}x$ and $${qx}$; they form a linear pair:`, `把两个角写成 $${p}x$ 和 $${qx}$，二者是邻补角：`],
                  [`${p}x + ${qx} = 180`, `x = ${Q.of(180, p + q).toLatex()}`, `${qx} = ${exterior.toLatex()}^\\circ`],
                ],
                count(n, exterior),
              ],
              check(exterior),
              [
                [
                  p + q,
                  "That adds the numbers of the ratio instead of finding the exterior angle.",
                  "这是把比中的数相加了，而不是求外角。",
                ],
                [
                  Q.of(2 * (p + q), p),
                  "That divides $360^\\circ$ by the interior angle instead of the exterior one.",
                  "这是用 $360^\\circ$ 除以内角，而不是外角。",
                ],
                half(n),
              ],
            );
          }
          if (kind === 1) {
            const k = rng.pick([2, 3, 4, 5, 7, 8, 9, 11, 14, 17]);
            const exterior = Q.of(180, k + 1);
            const n = 2 * (k + 1);
            return valued(
              [
                `Each interior angle of a regular polygon is $${k}$ times each of its exterior angles. How many sides does the polygon have?`,
                `一个正多边形的每个内角是每个外角的 $${k}$ 倍。这个多边形有几条边？`,
              ],
              n,
              [
                [
                  ["Find the exterior angle", "求外角"],
                  [
                    `Let each exterior angle be $e$; the interior angle is $${k}e$, and the two form a linear pair:`,
                    `设每个外角为 $e$，则内角为 $${k}e$，二者是邻补角：`,
                  ],
                  [`${k}e + e = 180`, `e = ${exterior.toLatex()}`],
                ],
                count(n, exterior),
              ],
              check(exterior),
              [
                [k + 1, "That counts the parts of $180^\\circ$, not the sides.", "这是 $180^\\circ$ 被分成的份数，不是边数。"],
                [k, "That copies the multiple.", "这是照抄了倍数。"],
                half(n),
              ],
            );
          }
          const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
          const exterior = 360 / n;
          const d = 180 - 2 * exterior;
          return valued(
            [
              `Each interior angle of a regular polygon is $${degTex(d)}$ more than each of its exterior angles. How many sides does the polygon have?`,
              `一个正多边形的每个内角比每个外角大 $${degTex(d)}$。这个多边形有几条边？`,
            ],
            n,
            [
              [
                ["Find the exterior angle", "求外角"],
                [
                  `Let each exterior angle be $e$; the interior angle is $e + ${d}$, and the two form a linear pair:`,
                  `设每个外角为 $e$，则内角为 $e + ${d}$，二者是邻补角：`,
                ],
                [`e + (e + ${d}) = 180`, `2e = ${180 - d}`, `e = ${exterior}`],
              ],
              count(n, Q.of(exterior)),
            ],
            check(Q.of(exterior)),
            [
              [
                Q.of(360, 180 - exterior),
                "That divides $360^\\circ$ by the interior angle instead of the exterior one.",
                "这是用 $360^\\circ$ 除以内角，而不是外角。",
              ],
              [Q.of(360, d), "That divides $360^\\circ$ by the difference of the angles.", "这是用 $360^\\circ$ 除以两角之差。"],
              half(n),
            ],
          );
        },
        drawn(gradeDrawings5["regular-polygons#sides-from-angle-relationships"]),
      ),
      lesson(
        "angles-formed-by-a-diagonal",
        ["Angles formed by a diagonal", "对角线形成的角"],
        [
          [
            "A diagonal $AC$ of a regular polygon $ABC\\ldots$ cuts off triangle $ABC$. Its sides $AB$ and $BC$ are sides of the polygon, so they are equal and the triangle is isosceles. The angle at $B$ is an interior angle of the polygon. In a regular pentagon, $m\\angle B = 108^\\circ$, so the base angles are $(180^\\circ - 108^\\circ) \\div 2 = 36^\\circ$.",
            "正多边形 $ABC\\ldots$ 的对角线 $AC$ 截出三角形 $ABC$。它的两边 $AB$、$BC$ 是多边形的边，所以相等，三角形是等腰三角形。$B$ 处的角是多边形的一个内角。在正五边形中，$m\\angle B = 108^\\circ$，所以两个底角都是 $(180^\\circ - 108^\\circ) \\div 2 = 36^\\circ$。",
          ],
          ["In triangle $ABC$ the angles add up to $108 + 36 + 36 = 180$.", "在三角形 $ABC$ 中，三个角之和为 $108 + 36 + 36 = 180$。"],
          [
            "The base angles are equal, but they are not half of $108^\\circ$. Take $108$ from $180$ first, then halve.",
            "两个底角相等，但它们不是 $108^\\circ$ 的一半。先用 $180$ 减去 $108$，再除以 $2$。",
          ],
        ],
        (rng) => {
          const n = rng.pick([5, 6, 9, 10, 12]);
          const k = rng.int(0, n - 4);
          const [P, B, R, S] = [0, 1, 2, 3].map((i) => polygonLetters[k + i]!);
          const interiorAngle = ((n - 2) * 180) / n;
          const base = (180 - interiorAngle) / 2;
          const rest = rng.bool();
          const answer = rest ? interiorAngle - base : base;
          const name = polygonName(n);
          const asked = rest ? `${P}${R}${S}` : `${B}${P}${R}`;
          const walk: Walk[] = [
            [
              ["Find the interior angle", "求内角"],
              [`Each interior angle of a regular ${name.en} is:`, `正${name["zh-CN"]}的每个内角是：`],
              [`m\\angle ${P}${B}${R} = \\frac{(${n} - 2) \\cdot 180^\\circ}{${n}} = ${degTex(interiorAngle)}`],
            ],
            [
              ["Use the isosceles triangle", "利用等腰三角形"],
              [
                `$${P}${B} = ${B}${R}$, so the base angles of $\\triangle ${P}${B}${R}$ are equal:`,
                `$${P}${B} = ${B}${R}$，所以 $\\triangle ${P}${B}${R}$ 的两个底角相等：`,
              ],
              [`m\\angle ${B}${P}${R} = m\\angle ${B}${R}${P} = \\frac{180^\\circ - ${degTex(interiorAngle)}}{2} = ${degTex(base)}`],
            ],
          ];
          return valued(
            [
              `In regular ${name.en} $${polygonLetters.slice(0, n)}$, the diagonal $${P}${R}$ is drawn. Find $m\\angle ${asked}$.`,
              `在正${name["zh-CN"]} $${polygonLetters.slice(0, n)}$ 中，画出对角线 $${P}${R}$。求 $m\\angle ${asked}$。`,
            ],
            answer,
            rest
              ? [
                  ...walk,
                  [
                    ["Subtract", "相减"],
                    [`The diagonal splits the interior angle at $${R}$:`, `对角线把 $${R}$ 处的内角分成两部分：`],
                    [`m\\angle ${P}${R}${S} = ${degTex(interiorAngle)} - ${degTex(base)} = ${degTex(answer)}`],
                  ],
                ]
              : walk,
            [
              `In $\\triangle ${P}${B}${R}$ the angles add up to $${interiorAngle} + ${base} + ${base} = 180$.`,
              `在 $\\triangle ${P}${B}${R}$ 中，三个角之和为 $${interiorAngle} + ${base} + ${base} = 180$。`,
            ],
            [
              [interiorAngle, "That is the whole interior angle, not the part asked for.", "这是整个内角，不是所求的那一部分。"],
              [Q.of(360, n), "That is the exterior angle of the polygon.", "这是多边形的外角。"],
              [
                Q.of(interiorAngle, 2),
                "That halves the interior angle; the base angles are not half of it.",
                "这是把内角减半了；底角并不是内角的一半。",
              ],
              rest
                ? [base, `That is the base angle, the other part of the angle at $${R}$.`, `这是底角，即 $${R}$ 处内角的另一部分。`]
                : [
                    interiorAngle - base,
                    `That is the other part of the interior angle at $${P}$, beyond the diagonal.`,
                    `这是 $${P}$ 处内角在对角线另一侧的部分。`,
                  ],
            ],
            { unit: "°", figure: regularFigure(n, k, rest ? [k + 2, k, k + 3] : [k, k + 1, k + 2]) },
          );
        },
        drawn(gradeDrawings5["regular-polygons#angles-formed-by-a-diagonal"]),
      ),
    ],
  ),
  ["A stop sign is a regular octagon. How large is each of its angles?", "停车标志是一个正八边形。它的每个角是多少度？"],
  [
    "Each exterior angle is $360 \\div 8 = 45$ degrees, so each interior angle is $180 - 45 = 135$ degrees.",
    "每个外角是 $360 \\div 8 = 45$ 度，所以每个内角是 $180 - 45 = 135$ 度。",
  ],
  [
    "recognize regular polygons, find the number of sides from the angles, and find the angles cut off by a diagonal.",
    "识别正多边形，由角求边数，并求对角线截出的角。",
  ],
);

/** grade8AngleTopics are the 8th grade topics on angles with parallel lines, triangles and polygons. */
export const grade8AngleTopics: readonly TopicDef[] = [
  nonAdjacentComplementaryAngles,
  correspondingAngles,
  alternateAngles,
  consecutiveAngles,
  angleCriteriaForParallelLines,
  problemSolvingWithAnglesOfTriangles,
  theTriangleInequality,
  exteriorAnglesOfPolygons,
  regularPolygons,
];
