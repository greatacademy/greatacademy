import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, linear, type Mark, type Point, Q, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps, yesNo } from "../problems.ts";
import { polygonName } from "./angles.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

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

const nonAdjacentComplementaryAngles = topic(
  "non-adjacent-complementary-angles",
  t("Non-Adjacent Complementary Angles", "不相邻的互余角"),
  t(
    "Complementary angles need not share a side: any two angles whose measures add up to 90° are complementary, such as the two angles beside a right angle on a line, or the two acute angles of a right triangle.",
    "互余的两个角不一定有公共边：只要两个角的度数之和为 90°，它们就互余，例如直线上夹着一个直角的两个角，或直角三角形的两个锐角。",
  ),
  ["complementary-angles"],
  ["7.G.B.5"],
  [
    {
      id: "spotting-complementary-angles",
      title: t("Spotting complementary angles", "找出互余的角"),
      explanation: t(
        "Two angles are complementary when their measures add up to $90^\\circ$, wherever they are: they do not have to be adjacent, or even in the same figure.\n\nIf $m\\angle A = 28^\\circ$, $m\\angle B = 152^\\circ$, $m\\angle C = 62^\\circ$ and $m\\angle D = 75^\\circ$, then $\\angle A$ and $\\angle C$ are complementary, because $28 + 62 = 90$. $\\angle A$ and $\\angle B$ add up to $180^\\circ$: they are supplementary, not complementary.",
        "两个角的度数之和为 $90^\\circ$ 时，它们就互余，不论它们在哪里：它们不必相邻，甚至不必在同一个图形中。\n\n若 $m\\angle A = 28^\\circ$，$m\\angle B = 152^\\circ$，$m\\angle C = 62^\\circ$，$m\\angle D = 75^\\circ$，则 $\\angle A$ 与 $\\angle C$ 互余，因为 $28 + 62 = 90$。$\\angle A$ 与 $\\angle B$ 之和为 $180^\\circ$：它们互补，而不是互余。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(15, 75);
          const values = [a, 90 - a, 180 - a, rng.int(20, 160)];
          if (a === 45 || new Set(values).size < 4) continue;
          const sums = values.flatMap((u, i) => values.slice(i + 1).map((w) => u + w));
          if (sums.filter((s) => s === 90).length !== 1) continue;
          const letters = rng.shuffle(["A", "B", "C", "D"]);
          const pair = (i: number, j: number) => {
            const [x, y] = [letters[i]!, letters[j]!].sort();
            return t(`$\\angle ${x}$ and $\\angle ${y}$`, `$\\angle ${x}$ 与 $\\angle ${y}$`);
          };
          const order = [0, 1, 2, 3].sort((i, j) => letters[i]!.localeCompare(letters[j]!));
          const listed = order.map((i) => `m\\angle ${letters[i]} = ${degTex(values[i]!)}`).join(", ");
          const correct = pair(0, 1);
          const supplement = pair(0, 2);
          return pickChoice(
            rng,
            t(`$${listed}$. Which two angles are complementary?`, `$${listed}$。哪两个角互余？`),
            correct,
            [supplement, ...rng.shuffle([pair(1, 2), pair(0, 3), pair(1, 3), pair(2, 3)])],
            t(
              `Complementary angles add up to $90^\\circ$, whether or not they are adjacent: $${a} + ${90 - a} = 90$, so ${correct.en} are complementary. (${supplement.en} add up to $180^\\circ$: they are supplementary.)`,
              `互余的两个角之和为 $90^\\circ$，不论它们是否相邻：$${a} + ${90 - a} = 90$，所以 ${correct["zh-CN"]} 互余。（${supplement["zh-CN"]} 之和为 $180^\\circ$：它们互补。）`,
            ),
          );
        }
      },
    },
    {
      id: "complements-in-figures",
      title: t("Complements in figures", "图形中的余角"),
      explanation: t(
        "Two kinds of figures hide complementary angles that are not adjacent:\n\n- On a line, two angles on either side of a right angle add up to $180^\\circ - 90^\\circ = 90^\\circ$.\n- In a right triangle, the right angle takes $90^\\circ$ of the $180^\\circ$, so the two acute angles add up to $90^\\circ$.\n\nIn a right triangle with an acute angle of $34^\\circ$, the other acute angle is $90^\\circ - 34^\\circ = 56^\\circ$.",
        "有两类图形中藏着不相邻的互余角：\n\n- 在直线上，夹着一个直角的两个角之和为 $180^\\circ - 90^\\circ = 90^\\circ$。\n- 在直角三角形中，直角占了 $180^\\circ$ 中的 $90^\\circ$，所以两个锐角之和为 $90^\\circ$。\n\n若直角三角形的一个锐角是 $34^\\circ$，另一个锐角就是 $90^\\circ - 34^\\circ = 56^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(15, 75);
        const wrong = [180 - a, a, 90 + a];
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `Points $A$, $B$ and $C$ lie on a line, $\\angle DBE$ is a right angle and $m\\angle ABD = ${degTex(a)}$. Find $x$.`,
                `点 $A$、$B$、$C$ 在同一条直线上，$\\angle DBE$ 是直角，$m\\angle ABD = ${degTex(a)}$。求 $x$。`,
              ),
              answer: 90 - a,
              form: "integer",
              wrong,
              solution: t(
                `The three angles at $B$ make up the straight angle $ABC$:${steps(`${a} + 90 + x = 180`, `x = ${90 - a}`)}So $\\angle ABD$ and $\\angle EBC$ are complementary, although they are not adjacent.`,
                `$B$ 处的三个角合起来是平角 $ABC$：${steps(`${a} + 90 + x = 180`, `x = ${90 - a}`)}所以 $\\angle ABD$ 与 $\\angle EBC$ 互余，尽管它们不相邻。`,
              ),
            }),
            figure: acrossRightAngle(a, [deg(a), "x°"]),
          };
        }
        const [P, R, Q] = rng.pick([
          ["P", "R", "Q"],
          ["K", "M", "L"],
          ["D", "F", "E"],
        ] as const);
        return numberProblem({
          prompt: t(
            `In $\\triangle ${P}${Q}${R}$, $\\angle ${R}$ is a right angle and $m\\angle ${P} = ${degTex(a)}$. Find $m\\angle ${Q}$.`,
            `在 $\\triangle ${P}${Q}${R}$ 中，$\\angle ${R}$ 是直角，$m\\angle ${P} = ${degTex(a)}$。求 $m\\angle ${Q}$。`,
          ),
          answer: 90 - a,
          form: "integer",
          unit: "°",
          wrong,
          solution: t(
            `The angles of a triangle add up to $180^\\circ$ and the right angle takes $90^\\circ$, so the acute angles $\\angle ${P}$ and $\\angle ${Q}$ are complementary:${steps(`m\\angle ${Q} = 90^\\circ - ${degTex(a)} = ${degTex(90 - a)}`)}`,
            `三角形的内角和为 $180^\\circ$，直角占了 $90^\\circ$，所以锐角 $\\angle ${P}$ 与 $\\angle ${Q}$ 互余：${steps(`m\\angle ${Q} = 90^\\circ - ${degTex(a)} = ${degTex(90 - a)}`)}`,
          ),
        });
      },
    },
    {
      id: "complements-with-algebra",
      title: t("Equations for complements", "互余角的方程"),
      explanation: t(
        "When the angles on either side of a right angle are written with a variable, they still add up to $90^\\circ$, which gives an equation.\n\nIf $m\\angle ABD = (2x + 6)^\\circ$ and $m\\angle EBC = (3x - 6)^\\circ$ with a right angle between them on a line, then $(2x + 6) + (3x - 6) = 90$, so $5x = 90$ and $x = 18$. Then $m\\angle ABD = 2 \\cdot 18 + 6 = 42^\\circ$.",
        "当直角两侧的角用含变量的式子表示时，它们的和仍是 $90^\\circ$，由此可以列方程。\n\n若直线上 $m\\angle ABD = (2x + 6)^\\circ$，$m\\angle EBC = (3x - 6)^\\circ$，两者之间是一个直角，则 $(2x + 6) + (3x - 6) = 90$，所以 $5x = 90$，$x = 18$。于是 $m\\angle ABD = 2 \\cdot 18 + 6 = 42^\\circ$。",
      ),
      generate(rng) {
        const x = rng.int(4, 15);
        const a = rng.int(20, 70);
        const e1 = expressionFor(rng, a, x);
        const e2 = expressionFor(rng, 90 - a, x);
        const askX = rng.bool();
        const solve = steps(...sumSteps([e1, e2], 90));
        const head = t(
          `Points $A$, $B$ and $C$ lie on a line, $\\angle DBE$ is a right angle, $m\\angle ABD = ${angleTex(e1)}$ and $m\\angle EBC = ${angleTex(e2)}$.`,
          `点 $A$、$B$、$C$ 在同一条直线上，$\\angle DBE$ 是直角，$m\\angle ABD = ${angleTex(e1)}$，$m\\angle EBC = ${angleTex(e2)}$。`,
        );
        return {
          ...numberProblem({
            prompt: askX
              ? t(`${head.en} Find $x$.`, `${head["zh-CN"]}求 $x$。`)
              : t(`${head.en} Find $m\\angle ABD$.`, `${head["zh-CN"]}求 $m\\angle ABD$。`),
            answer: askX ? x : a,
            ...(askX ? { solveFor: "x" } : { unit: "°" }),
            wrong: askX ? sumWrong([e1, e2], 90, 180) : [x, 90 - a, 180 - a],
            solution: t(
              `With the right angle between them, $\\angle ABD$ and $\\angle EBC$ fill the rest of the straight angle, so they add up to $90^\\circ$:${solve}${askX ? "" : `So $m\\angle ABD = ${subst(e1, x)} = ${degTex(a)}$.`}`,
              `$\\angle ABD$ 与 $\\angle EBC$ 中间夹着直角，它们填满平角的其余部分，所以和为 $90^\\circ$：${solve}${askX ? "" : `所以 $m\\angle ABD = ${subst(e1, x)} = ${degTex(a)}$。`}`,
            ),
          }),
          figure: acrossRightAngle(a, [angleLabel(e1), angleLabel(e2)]),
        };
      },
    },
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

const alternateAngles = topic(
  "alternate-angles",
  t("Alternate Angles", "内错角与外错角"),
  t(
    "Alternate angles lie on opposite sides of a transversal: alternate interior angles between the two lines, alternate exterior angles outside them. When the lines are parallel, alternate angles are equal.",
    "错角位于截线的两侧：内错角在两条直线之间，外错角在两条直线之外。两直线平行时，内错角相等，外错角也相等。",
  ),
  ["corresponding-angles"],
  ["8.G.A.5"],
  [
    {
      id: "identifying-alternate-angles",
      title: t("Identifying alternate angles", "识别内错角与外错角"),
      explanation: t(
        "Angles between the two lines are **interior**; the others are **exterior**.\n\n- **Alternate interior angles** are both interior, on opposite sides of the transversal, at different crossings.\n- **Alternate exterior angles** are both exterior, on opposite sides of the transversal, at different crossings.\n\nIf $\\angle 3$ is below $\\ell$ and left of the transversal, it is interior; its alternate interior angle is above $m$ and right of the transversal: $\\angle 6$.",
        "两条直线之间的角是**内角**，其余的是**外角**。\n\n- **内错角**：都是内角，分别在截线两侧，位于不同的交点处。\n- **外错角**：都是外角，分别在截线两侧，位于不同的交点处。\n\n若 $\\angle 3$ 在 $\\ell$ 的下方、截线的左侧，它是内角；与它构成内错角的是 $m$ 上方、截线右侧的角：$\\angle 6$。",
      ),
      generate(rng) {
        const s = pickSlot(rng);
        const inside = interior(s);
        const kind = inside ? alternateInterior : alternateExterior;
        const answer = kind.partner(s);
        return pickChoice(
          rng,
          t(
            `A transversal crosses lines $\\ell$ and $m$. Which angle forms a pair of ${kind.name.en} with $${numbered(s)}$?`,
            `一条截线与直线 $\\ell$、$m$ 相交。哪个角与 $${numbered(s)}$ 构成${kind.name["zh-CN"]}？`,
          ),
          angleOption(answer),
          [angleOption(corresponding.partner(s)), angleOption(consecutiveInterior.partner(s)), angleOption([s[0], (s[1] + 2) % 4])],
          t(
            `$${numbered(s)}$ is ${positionOf(s).en}, so it is ${inside ? "interior (between the lines)" : "exterior (outside the lines)"}. Its partner is also ${inside ? "interior" : "exterior"}, at the other crossing and on the other side of the transversal: $${numbered(answer)}$, ${positionOf(answer).en}.`,
            `$${numbered(s)}$ 在 ${positionOf(s)["zh-CN"]}，是${inside ? "内角（在两条直线之间）" : "外角（在两条直线之外）"}。与它配对的角也是${inside ? "内角" : "外角"}，在另一个交点处、截线的另一侧：$${numbered(answer)}$，位于 ${positionOf(answer)["zh-CN"]}。`,
          ),
          numberedFigure(pickTheta(rng), false),
        );
      },
    },
    {
      id: "alternate-angle-equations",
      title: t("Equations from alternate angles", "由错角列方程"),
      explanation: t(
        "When the lines are parallel, alternate interior angles are equal and so are alternate exterior angles. If the angles are written with a variable, set the expressions equal.\n\nIf alternate interior angles measure $(3x - 15)^\\circ$ and $(x + 45)^\\circ$, then $3x - 15 = x + 45$, so $2x = 60$ and $x = 30$. Each angle measures $30 + 45 = 75^\\circ$.",
        "两直线平行时，内错角相等，外错角也相等。若角用含变量的式子表示，就令两个式子相等。\n\n若一对内错角为 $(3x - 15)^\\circ$ 和 $(x + 45)^\\circ$，则 $3x - 15 = x + 45$，所以 $2x = 60$，$x = 30$。每个角都是 $30 + 45 = 75^\\circ$。",
      ),
      generate(rng) {
        const { x, m, e1 } = pairEquation(rng);
        const e2 = expressionFor(rng, m, x, [e1[0]]);
        const i = rng.int(0, 3);
        const s: Slot = ["P", i];
        const kind = interior(s) ? alternateInterior : alternateExterior;
        const theta = i % 2 === 0 ? m : 180 - m;
        const askX = rng.bool();
        const solve = steps(...equalSteps(e1, e2));
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
            wrong: askX ? equalWrong(e1, e2) : [x, 180 - m, at(e1, -x)],
            solution: t(
              `The marked angles are ${kind.name.en}, and parallel lines make them equal:${solve}${askX ? "" : `So the angle measures $${subst(e1, x)} = ${degTex(m)}$.`}`,
              `标出的两个角是${kind.name["zh-CN"]}，两直线平行，所以它们相等：${solve}${askX ? "" : `所以这个角是 $${subst(e1, x)} = ${degTex(m)}$。`}`,
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

const angleCriteriaForParallelLines = topic(
  "angle-criteria-for-parallel-lines",
  t("Angle Criteria for Parallel Lines", "平行线的判定"),
  t(
    "The angle relationships also work backward: if corresponding or alternate angles are equal, or consecutive angles are supplementary, the two lines are parallel; if not, they are not.",
    "角的关系也可以反过来用：如果同位角或错角相等，或同旁角互补，那么两条直线平行；否则就不平行。",
  ),
  ["consecutive-angles"],
  ["8.G.A.5"],
  [
    {
      id: "are-the-lines-parallel",
      title: t("Are the lines parallel?", "两直线平行吗"),
      explanation: t(
        "The converses of the angle-pair facts tell when two lines cut by a transversal are parallel:\n\n- corresponding, alternate interior or alternate exterior angles are **equal**, or\n- consecutive interior or consecutive exterior angles are **supplementary**.\n\nIf alternate interior angles measure $68^\\circ$ and $72^\\circ$, the lines are **not** parallel: they meet somewhere, however close to parallel they look.",
        "角对性质的逆命题给出了两条被截线所截的直线平行的条件：\n\n- 同位角、内错角或外错角**相等**，或\n- 同旁内角或同旁外角**互补**。\n\n若一对内错角为 $68^\\circ$ 和 $72^\\circ$，这两条直线**不**平行：无论看上去多么接近平行，它们总会在某处相交。",
      ),
      generate(rng) {
        const theta = pickTheta(rng);
        const parallel = rng.bool();
        const tilt = parallel ? 0 : rng.pick([-1, 1]) * rng.int(2, 8);
        const s: Slot = ["P", rng.int(0, 3)];
        const kind = kindAt(rng, s);
        const partner = kind.partner(s);
        const [a, b] = [measureAt(s, theta, tilt), measureAt(partner, theta, tilt)];
        const holds = kind.equal ? a === b : a + b === 180;
        const test = kind.equal
          ? holds
            ? t(`they are equal ($${degTex(a)} = ${degTex(b)}$)`, `它们相等（$${degTex(a)} = ${degTex(b)}$）`)
            : t(`they are not equal ($${degTex(a)} \\ne ${degTex(b)}$)`, `它们不相等（$${degTex(a)} \\ne ${degTex(b)}$）`)
          : holds
            ? t(`they are supplementary ($${a} + ${b} = 180$)`, `它们互补（$${a} + ${b} = 180$）`)
            : t(`they are not supplementary ($${a} + ${b} = ${a + b}$)`, `它们不互补（$${a} + ${b} = ${a + b}$）`);
        return {
          ...choiceProblem({
            prompt: t(
              `A transversal crosses lines $\\ell$ and $m$, and the marked angles measure $${degTex(a)}$ and $${degTex(b)}$. Are $\\ell$ and $m$ parallel?`,
              `一条截线与直线 $\\ell$、$m$ 相交，标出的两个角分别是 $${degTex(a)}$ 和 $${degTex(b)}$。$\\ell$ 与 $m$ 平行吗？`,
            ),
            options: yesNo,
            correct: holds ? 0 : 1,
            solution: t(
              `The marked angles are ${kind.name.en}, and ${test.en}. ${holds ? "So the lines are parallel." : `So the lines are not parallel: parallel lines would make them ${kind.equal ? "equal" : "supplementary"}.`}`,
              `标出的两个角是${kind.name["zh-CN"]}，${test["zh-CN"]}。${holds ? "所以两直线平行。" : `所以两直线不平行：若两直线平行，它们应当${kind.equal ? "相等" : "互补"}。`}`,
            ),
          }),
          figure: transversalFigure(
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
        };
      },
    },
    {
      id: "making-lines-parallel",
      title: t("Making lines parallel", "使两直线平行"),
      explanation: t(
        "To find the value of $x$ that makes two lines parallel, write the condition for the marked pair and solve: equal for corresponding and alternate angles, a sum of $180^\\circ$ for consecutive angles.\n\nIf corresponding angles measure $(4x - 10)^\\circ$ and $(2x + 30)^\\circ$, the lines are parallel when $4x - 10 = 2x + 30$, that is, when $x = 20$.",
        "要求使两直线平行的 $x$ 的值，先写出标出角对应满足的条件再求解：同位角和错角要相等，同旁角之和要等于 $180^\\circ$。\n\n若一对同位角为 $(4x - 10)^\\circ$ 和 $(2x + 30)^\\circ$，则当 $4x - 10 = 2x + 30$，即 $x = 20$ 时，两直线平行。",
      ),
      generate(rng) {
        const { x, m, e1 } = pairEquation(rng);
        const s: Slot = ["P", rng.int(0, 3)];
        const kind = kindAt(rng, s);
        const e2 = kind.equal ? expressionFor(rng, m, x, [e1[0]]) : expressionFor(rng, 180 - m, x);
        const theta = s[1] % 2 === 0 ? m : 180 - m;
        const solve = steps(...(kind.equal ? equalSteps(e1, e2) : sumSteps([e1, e2], 180)));
        // The value of x from the wrong condition: supplementary instead of equal, or equal instead of supplementary.
        const mixedUp = kind.equal
          ? [Q.of(180 - e1[1] - e2[1], e1[0] + e2[0])]
          : e1[0] !== e2[0]
            ? [Q.of(e2[1] - e1[1], e1[0] - e2[0])]
            : [];
        return {
          ...numberProblem({
            prompt: t(`For what value of $x$ are lines $\\ell$ and $m$ parallel?`, `$x$ 为何值时，直线 $\\ell$ 与 $m$ 平行？`),
            answer: x,
            solveFor: "x",
            wrong: [...mixedUp, ...(kind.equal ? equalWrong(e1, e2) : sumWrong([e1, e2], 180, 90))],
            solution: t(
              `The marked angles are ${kind.name.en}. The lines are parallel exactly when they are ${kind.equal ? "equal" : "supplementary"}:${solve}`,
              `标出的两个角是${kind.name["zh-CN"]}。两直线平行，当且仅当它们${kind.equal ? "相等" : "互补"}：${solve}`,
            ),
          }),
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
        };
      },
    },
    {
      id: "reasons-for-parallel-lines",
      title: t("Reasons for parallel lines", "平行的理由"),
      explanation: t(
        "Each criterion names the angle pair it uses, so the reason must match the pair:\n\n- equal corresponding angles: corresponding angles;\n- equal angles between the lines on opposite sides: alternate interior angles;\n- equal angles outside the lines on opposite sides: alternate exterior angles;\n- supplementary angles between the lines on the same side: consecutive interior angles.\n\nVertical angles are always equal, whether or not the lines are parallel, so they prove nothing about $\\ell$ and $m$.",
        "每条判定都指明了它用的是哪种角对，所以理由必须和角对相符：\n\n- 同位角相等：同位角；\n- 两直线之间、截线两侧的角相等：内错角；\n- 两直线之外、截线两侧的角相等：外错角；\n- 两直线之间、截线同侧的角互补：同旁内角。\n\n对顶角总是相等，与两直线是否平行无关，所以它不能说明 $\\ell$ 与 $m$ 的关系。",
      ),
      generate(rng) {
        const s = pickSlot(rng);
        const kind = kindAt(rng, s);
        const partner = kind.partner(s);
        const [first, second] = rng.shuffle([s, partner]) as [Slot, Slot];
        const given = kind.equal ? `m${numbered(first)} = m${numbered(second)}` : `m${numbered(first)} + m${numbered(second)} = 180^\\circ`;
        const vertical = t("Vertical angles are equal.", "对顶角相等。");
        return pickChoice(
          rng,
          t(
            `In the figure, $${given}$. Which reason shows that $\\ell \\parallel m$?`,
            `在图中，$${given}$。哪条理由说明 $\\ell \\parallel m$？`,
          ),
          kind.reason,
          [vertical, ...rng.shuffle(criteria.filter((k) => k !== kind).map((k) => k.reason))],
          t(
            `$${numbered(first)}$ and $${numbered(second)}$ are ${kind.name.en}, and they are ${kind.equal ? "equal" : "supplementary"}. ${kind.reason.en}`,
            `$${numbered(first)}$ 与 $${numbered(second)}$ 是${kind.name["zh-CN"]}，且它们${kind.equal ? "相等" : "互补"}。${kind.reason["zh-CN"]}`,
          ),
          numberedFigure(pickTheta(rng), false),
        );
      },
    },
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

const problemSolvingWithAnglesOfTriangles = topic(
  "problem-solving-with-angles-of-triangles",
  t("Problem Solving with Angles of Triangles", "三角形内角的综合问题"),
  t(
    "Use the 180° angle sum to find angles given in a ratio or described by their relationships, and combine it with vertical angles to find angles across two triangles.",
    "利用三角形内角和为 180°，求按比例给出或由相互关系描述的角，并结合对顶角求两个三角形中的角。",
  ),
  ["angles-of-a-triangle"],
  ["8.G.A.5"],
  [
    {
      id: "angles-in-a-ratio",
      title: t("Angles in a ratio", "按比例分配的角"),
      explanation: t(
        "If the angles of a triangle are in the ratio $p : q : r$, write them as $px$, $qx$ and $rx$. Their sum is $180^\\circ$:\n\n$$(p + q + r)x = 180.$$\n\nFor the ratio $2 : 3 : 4$: $9x = 180$, so $x = 20$, and the angles are $40^\\circ$, $60^\\circ$ and $80^\\circ$.",
        "若三角形三个角之比为 $p : q : r$，就把它们写成 $px$、$qx$、$rx$。它们的和为 $180^\\circ$：\n\n$$(p + q + r)x = 180.$$\n\n比为 $2 : 3 : 4$ 时：$9x = 180$，所以 $x = 20$，三个角分别是 $40^\\circ$、$60^\\circ$、$80^\\circ$。",
      ),
      generate(rng) {
        const [p, q, r] = rng.pick(ratios);
        const s = p + q + r;
        const part = 180 / s;
        const largest = rng.bool();
        const k = largest ? r : p;
        const answer = k * part;
        return numberProblem({
          prompt: largest
            ? t(
                `The angles of a triangle are in the ratio $${p} : ${q} : ${r}$. What is the measure of the largest angle?`,
                `一个三角形三个角的度数之比为 $${p} : ${q} : ${r}$。最大的角是多少度？`,
              )
            : t(
                `The angles of a triangle are in the ratio $${p} : ${q} : ${r}$. What is the measure of the smallest angle?`,
                `一个三角形三个角的度数之比为 $${p} : ${q} : ${r}$。最小的角是多少度？`,
              ),
          answer,
          form: "integer",
          unit: "°",
          wrong: [part, q * part, largest ? p * part : r * part, ...(Number.isInteger(360 / s) ? [k * (360 / s)] : [])],
          solution: t(
            `Write the angles as $${linear(p, 0)}$, $${linear(q, 0)}$ and $${linear(r, 0)}$; they add up to $180^\\circ$:${steps(`${linear(p, 0)} + ${linear(q, 0)} + ${linear(r, 0)} = 180`, `${s}x = 180`, `x = ${part}`)}The ${largest ? "largest" : "smallest"} angle is $${k === 1 ? `x = ${degTex(answer)}` : `${k}x = ${k} \\cdot ${part} = ${degTex(answer)}`}$.`,
            `把三个角写成 $${linear(p, 0)}$、$${linear(q, 0)}$、$${linear(r, 0)}$，它们的和为 $180^\\circ$：${steps(`${linear(p, 0)} + ${linear(q, 0)} + ${linear(r, 0)} = 180`, `${s}x = 180`, `x = ${part}`)}${largest ? "最大" : "最小"}的角是 $${k === 1 ? `x = ${degTex(answer)}` : `${k}x = ${k} \\cdot ${part} = ${degTex(answer)}`}$。`,
          ),
        });
      },
    },
    {
      id: "angles-described-in-words",
      title: t("Angles described in words", "用文字描述的角"),
      explanation: t(
        "When the angles are described by how they compare, let the angle the others are compared with be $x$, write the others in terms of $x$, and use the angle sum.\n\nIf $\\angle B$ is twice $\\angle A$ and $\\angle C$ is $20^\\circ$ more than $\\angle A$: $x + 2x + (x + 20) = 180$, so $4x = 160$ and $x = 40$. The angles are $40^\\circ$, $80^\\circ$ and $60^\\circ$.",
        "当三个角是通过相互比较来描述时，设被比较的那个角为 $x$，用 $x$ 表示其他两个角，再利用内角和。\n\n若 $\\angle B$ 是 $\\angle A$ 的 2 倍，$\\angle C$ 比 $\\angle A$ 大 $20^\\circ$：$x + 2x + (x + 20) = 180$，所以 $4x = 160$，$x = 40$。三个角分别是 $40^\\circ$、$80^\\circ$、$60^\\circ$。",
      ),
      generate(rng) {
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
          const form = [[1, 0], fb, fc][ask] as Linear;
          const value =
            ask === 0
              ? t("", "")
              : t(
                  ` So $m\\angle ${name} = ${subst(form, x)} = ${degTex(answer)}$.`,
                  `所以 $m\\angle ${name} = ${subst(form, x)} = ${degTex(answer)}$。`,
                );
          const [rb, rc] = [relation(fb, "A"), relation(fc, "A")];
          return numberProblem({
            prompt: t(
              `In $\\triangle ABC$, $m\\angle B$ ${rb.en}, and $m\\angle C$ ${rc.en}. Find $m\\angle ${name}$.`,
              `在 $\\triangle ABC$ 中，$m\\angle B$ ${rb["zh-CN"]}，$m\\angle C$ ${rc["zh-CN"]}。求 $m\\angle ${name}$。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            wrong: [
              ...(ask === 0 ? [] : [x]),
              ...sumWrong(terms, 180, 360)
                .filter((w) => w.isInteger())
                .map((w) => at(form, w.toNumber())),
            ],
            solution: t(
              `Let $m\\angle A = x$. Then $m\\angle B = ${linear(...fb)}$ and $m\\angle C = ${linear(...fc)}$, and the three angles add up to $180^\\circ$:${steps(...sumSteps(terms, 180))}${value.en}`,
              `设 $m\\angle A = x$，则 $m\\angle B = ${linear(...fb)}$，$m\\angle C = ${linear(...fc)}$，三个角之和为 $180^\\circ$：${steps(...sumSteps(terms, 180))}${value["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "angles-across-two-triangles",
      title: t("Angles across two triangles", "两个三角形中的角"),
      explanation: t(
        "When two segments cross, they form two triangles that meet at a pair of vertical angles. The vertical angles are equal, so the other two angles of one triangle add up to the same as the other two angles of the other triangle.\n\nIf one triangle has angles $50^\\circ$ and $70^\\circ$ and the other has an angle of $65^\\circ$, the angles at the crossing are both $180^\\circ - 120^\\circ = 60^\\circ$, and the missing angle is $180^\\circ - 60^\\circ - 65^\\circ = 55^\\circ$. In one step: $50 + 70 = 65 + x$.",
        "两条线段相交时，形成两个在一对对顶角处相接的三角形。对顶角相等，所以一个三角形另外两个角之和等于另一个三角形另外两个角之和。\n\n若一个三角形有 $50^\\circ$ 和 $70^\\circ$ 两个角，另一个三角形有一个 $65^\\circ$ 的角，则交点处的两个角都是 $180^\\circ - 120^\\circ = 60^\\circ$，未知角是 $180^\\circ - 60^\\circ - 65^\\circ = 55^\\circ$。一步写出：$50 + 70 = 65 + x$。",
      ),
      generate(rng) {
        for (;;) {
          const [a, b] = [rng.int(35, 80), rng.int(35, 80)];
          const d = rng.int(25, 95);
          const x = a + b - d;
          const gamma = 180 - a - b;
          if (gamma < 30 || x < 25 || x > 100 || x === d || Math.abs(x - d) > 50) continue;
          return {
            ...numberProblem({
              prompt: t(
                `Segments $AD$ and $BE$ cross at $C$, with $m\\angle A = ${degTex(a)}$, $m\\angle B = ${degTex(b)}$ and $m\\angle D = ${degTex(d)}$. Find $x$.`,
                `线段 $AD$ 与 $BE$ 相交于 $C$，$m\\angle A = ${degTex(a)}$，$m\\angle B = ${degTex(b)}$，$m\\angle D = ${degTex(d)}$。求 $x$。`,
              ),
              answer: x,
              form: "integer",
              wrong: [gamma, 180 - d, a + b].filter((w) => w !== x),
              solution: t(
                `In $\\triangle ABC$, $m\\angle ACB = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${degTex(gamma)}$. $\\angle DCE$ is vertical to it, so it also measures $${degTex(gamma)}$. In $\\triangle DCE$:${steps(`x = 180 - ${gamma} - ${d} = ${x}`)}`,
                `在 $\\triangle ABC$ 中，$m\\angle ACB = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${degTex(gamma)}$。$\\angle DCE$ 与它是对顶角，所以也是 $${degTex(gamma)}$。在 $\\triangle DCE$ 中：${steps(`x = 180 - ${gamma} - ${d} = ${x}`)}`,
              ),
            }),
            figure: bowtie(a, b, d, x, [deg(a), deg(b), deg(d), "x°"]),
          };
        }
      },
    },
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

const theTriangleInequality = topic(
  "the-triangle-inequality",
  t("The Triangle Inequality", "三角形三边关系"),
  t(
    "Three lengths form a triangle only when the two shorter ones add up to more than the longest; so the third side of a triangle lies strictly between the difference and the sum of the other two.",
    "只有当较短的两条线段之和大于最长的一条时，三条线段才能组成三角形；因此三角形的第三边严格介于另两边之差与之和之间。",
  ),
  ["classifying-triangles"],
  ["7.G.A.2"],
  [
    {
      id: "can-the-sides-form-a-triangle",
      title: t("Can the sides form a triangle?", "能组成三角形吗"),
      explanation: t(
        "The **triangle inequality**: in every triangle, any two sides add up to more than the third. To test three lengths, it is enough to check that the **two shorter** ones add up to more than the **longest**.\n\n- $4$, $6$, $9$: $4 + 6 = 10 > 9$, so they form a triangle.\n- $3$, $5$, $8$: $3 + 5 = 8$, not more than $8$; the two short sides would lie flat along the long one, so they do not form a triangle.\n- $2$, $4$, $9$: $2 + 4 = 6 < 9$; the short sides cannot reach.",
        "**三角形三边关系**：任何三角形中，任意两边之和大于第三边。检验三条线段时，只需检查**较短的两条**之和是否大于**最长的一条**。\n\n- $4$、$6$、$9$：$4 + 6 = 10 > 9$，能组成三角形。\n- $3$、$5$、$8$：$3 + 5 = 8$，不大于 $8$；两条短边只能平躺在长边上，不能组成三角形。\n- $2$、$4$、$9$：$2 + 4 = 6 < 9$；两条短边够不着。",
      ),
      generate(rng) {
        const kind = rng.pick(["yes", "yes", "flat", "short"] as const);
        const a = rng.int(2, 12);
        const b = rng.int(a, 15);
        const c = kind === "yes" ? rng.int(b + 1, a + b - 1) : kind === "flat" ? a + b : a + b + rng.int(1, 6);
        const sides = [a, b, c];
        const longest = Math.max(...sides);
        const [s1, s2] = [...sides].sort((u, v) => u - v);
        const forms = s1! + s2! > longest;
        const unit = rng.pick(units);
        const listed = sideList(rng.shuffle(sides), unit);
        const compare = forms
          ? `${s1} + ${s2} = ${s1! + s2!} > ${longest}`
          : s1! + s2! === longest
            ? `${s1} + ${s2} = ${longest}`
            : `${s1} + ${s2} = ${s1! + s2!} < ${longest}`;
        return choiceProblem({
          prompt: t(`Can segments of length ${listed.en} form a triangle?`, `长为 ${listed["zh-CN"]} 的三条线段能组成三角形吗？`),
          options: yesNo,
          correct: forms ? 0 : 1,
          solution: t(
            `Compare the two shorter sides with the longest:${steps(compare)}${forms ? "The two shorter sides add up to more than the longest, so they form a triangle." : "The two shorter sides do not add up to more than the longest, so they cannot form a triangle."}`,
            `把较短的两边之和与最长边比较：${steps(compare)}${forms ? "较短两边之和大于最长边，所以能组成三角形。" : "较短两边之和不大于最长边，所以不能组成三角形。"}`,
          ),
        });
      },
    },
    {
      id: "range-of-the-third-side",
      title: t("The range of the third side", "第三边的范围"),
      explanation: t(
        "If two sides of a triangle are $a$ and $b$ with $a \\ge b$, the third side $c$ must satisfy\n\n$$a - b < c < a + b.$$\n\nWith sides $5$ and $9$: $4 < c < 14$. If $c$ is a whole number, it can be any of $5, 6, \\ldots, 13$; neither $4$ nor $14$ works, because then the sides would lie flat.",
        "若三角形的两边为 $a$ 和 $b$，且 $a \\ge b$，则第三边 $c$ 满足\n\n$$a - b < c < a + b.$$\n\n两边为 $5$ 和 $9$ 时：$4 < c < 14$。若 $c$ 是整数，它可以是 $5, 6, \\ldots, 13$ 中的任意一个；$4$ 和 $14$ 都不行，因为那样三边会平躺在一条线上。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], 2) as [number, number];
        const [hi, lo] = [Math.max(a, b), Math.min(a, b)];
        const greatest = rng.bool();
        const unit = rng.pick(units);
        const answer = greatest ? hi + lo - 1 : hi - lo + 1;
        return numberProblem({
          prompt: greatest
            ? t(
                `Two sides of a triangle measure $${a}\\text{ ${unit}}$ and $${b}\\text{ ${unit}}$. The third side is a whole number of ${unitNames[unit]}. What is its greatest possible length?`,
                `一个三角形的两边长为 $${a}\\text{ ${unit}}$ 和 $${b}\\text{ ${unit}}$，第三边的长是整数（单位 ${unit}）。第三边最长是多少？`,
              )
            : t(
                `Two sides of a triangle measure $${a}\\text{ ${unit}}$ and $${b}\\text{ ${unit}}$. The third side is a whole number of ${unitNames[unit]}. What is its least possible length?`,
                `一个三角形的两边长为 $${a}\\text{ ${unit}}$ 和 $${b}\\text{ ${unit}}$，第三边的长是整数（单位 ${unit}）。第三边最短是多少？`,
              ),
          answer,
          form: "integer",
          unit,
          wrong: greatest ? [hi + lo, hi + lo + 1, hi] : [hi - lo, hi - lo - 1, lo].filter((w) => w > 0),
          solution: t(
            `The third side $c$ lies strictly between the difference and the sum of the other two:${steps(`${hi} - ${lo} < c < ${hi} + ${lo}`, `${hi - lo} < c < ${hi + lo}`)}The ${greatest ? "greatest" : "least"} whole number in this range is $${answer}$.`,
            `第三边 $c$ 严格介于另两边之差与之和之间：${steps(`${hi} - ${lo} < c < ${hi} + ${lo}`, `${hi - lo} < c < ${hi + lo}`)}这个范围内${greatest ? "最大" : "最小"}的整数是 $${answer}$。`,
          ),
        });
      },
    },
    {
      id: "possible-third-sides",
      title: t("Possible third sides", "可能的第三边"),
      explanation: t(
        "To decide whether a length could be the third side, check that it is **strictly** between the difference and the sum of the two given sides.\n\nWith sides $6$ and $10$, the third side is between $4$ and $16$: $7$ or $15$ could be the third side, but $4$, $16$ and $17$ could not.",
        "要判断一个长度能否作为第三边，检查它是否**严格**介于已知两边之差与之和之间。\n\n两边为 $6$ 和 $10$ 时，第三边在 $4$ 与 $16$ 之间：$7$ 或 $15$ 可以作为第三边，而 $4$、$16$、$17$ 不行。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 2) as [number, number];
        const [hi, lo] = [Math.max(a, b), Math.min(a, b)];
        const correct = rng.int(hi - lo + 1, hi + lo - 1);
        const unit = rng.pick(units);
        const opt = (v: number) => mathText(`${v}\\text{ ${unit}}`);
        const outside = [hi + lo, hi - lo, hi + lo + rng.int(1, 4), ...(hi - lo > 1 ? [rng.int(1, hi - lo - 1)] : [])];
        return pickChoice(
          rng,
          t(
            `Two sides of a triangle measure $${a}\\text{ ${unit}}$ and $${b}\\text{ ${unit}}$. Which could be the length of the third side?`,
            `一个三角形的两边长为 $${a}\\text{ ${unit}}$ 和 $${b}\\text{ ${unit}}$。下列哪个可能是第三边的长？`,
          ),
          opt(correct),
          outside.map(opt),
          t(
            `The third side must be strictly between $${hi} - ${lo} = ${hi - lo}$ and $${hi} + ${lo} = ${hi + lo}$. Only $${correct}\\text{ ${unit}}$ is in that range.`,
            `第三边必须严格介于 $${hi} - ${lo} = ${hi - lo}$ 与 $${hi} + ${lo} = ${hi + lo}$ 之间。只有 $${correct}\\text{ ${unit}}$ 在这个范围内。`,
          ),
        );
      },
    },
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

const exteriorAnglesOfPolygons = topic(
  "exterior-angles-of-polygons",
  t("Exterior Angles of Polygons", "多边形的外角"),
  t(
    "The exterior angles of a convex polygon, one at each vertex, always add up to $360^\\circ$, whatever the number of sides; use this to find missing exterior angles and to solve for unknowns.",
    "凸多边形的外角（每个顶点取一个）之和总是 $360^\\circ$，与边数无关；利用这一点求未知的外角并解出未知数。",
  ),
  ["angles-of-polygons"],
  ["8.G.A.5"],
  [
    {
      id: "the-exterior-angle-sum",
      title: t("The exterior angle sum", "外角和"),
      explanation: t(
        "At each vertex of a convex polygon, extending one side makes an **exterior angle**, which forms a linear pair with the interior angle there. Walking once around the polygon, you turn by each exterior angle in turn and end up facing the way you started, so the exterior angles add up to $360^\\circ$, for any number of sides.\n\nIf a pentagon has exterior angles $70^\\circ$, $85^\\circ$, $60^\\circ$ and $90^\\circ$, the fifth is $360^\\circ - 305^\\circ = 55^\\circ$.",
        "在凸多边形的每个顶点处延长一条边，得到一个**外角**，它与该处的内角是邻补角。沿多边形走一圈，在每个顶点依次转过一个外角，最后回到出发时的朝向，所以无论多边形有几条边，外角和都是 $360^\\circ$。\n\n若一个五边形的四个外角为 $70^\\circ$、$85^\\circ$、$60^\\circ$、$90^\\circ$，则第五个外角是 $360^\\circ - 305^\\circ = 55^\\circ$。",
      ),
      figure: exteriorAnglesFigure,
      generate(rng) {
        for (;;) {
          const n = rng.int(4, 7);
          const known = Array.from({ length: n - 1 }, () => rng.int(25, 110));
          const sum = known.reduce((s, v) => s + v, 0);
          const x = 360 - sum;
          if (x < 20 || x > 120) continue;
          const name = polygonName(n);
          const listed = listOf([...known.map((v) => `$${degTex(v)}$`), "$x^\\circ$"]);
          return numberProblem({
            prompt: t(
              `A convex ${name.en} has exterior angles (one at each vertex) of ${listed.en}. Find $x$.`,
              `一个凸${name["zh-CN"]}的外角（每个顶点取一个）分别为 ${listed["zh-CN"]}。求 $x$。`,
            ),
            answer: x,
            form: "integer",
            wrong: [(n - 2) * 180 - sum, 180 - x, 180 * n - sum - 360].filter((w) => w > 0 && w !== x),
            solution: t(
              `The exterior angles of any convex polygon add up to $360^\\circ$:${steps(`${known.join(" + ")} + x = 360`, `${sum} + x = 360`, `x = ${x}`)}`,
              `任何凸多边形的外角和都是 $360^\\circ$：${steps(`${known.join(" + ")} + x = 360`, `${sum} + x = 360`, `x = ${x}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "exterior-angle-equations",
      title: t("Equations with exterior angles", "外角的方程"),
      explanation: t(
        "When the exterior angles are written with a variable, set their sum equal to $360^\\circ$; an interior angle is then $180^\\circ$ minus the exterior angle at the same vertex.\n\nIf the exterior angles of a quadrilateral are $x^\\circ$, $2x^\\circ$, $3x^\\circ$ and $4x^\\circ$: $10x = 360$, so $x = 36$. The largest exterior angle is $144^\\circ$, so the smallest interior angle is $180^\\circ - 144^\\circ = 36^\\circ$.",
        "当外角用含变量的式子表示时，令它们的和等于 $360^\\circ$；而每个内角等于 $180^\\circ$ 减去同一顶点处的外角。\n\n若一个四边形的外角为 $x^\\circ$、$2x^\\circ$、$3x^\\circ$、$4x^\\circ$：$10x = 360$，所以 $x = 36$。最大的外角是 $144^\\circ$，所以最小的内角是 $180^\\circ - 144^\\circ = 36^\\circ$。",
      ),
      generate(rng) {
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
          const solve = steps(`${cs.map((c) => (c === 1 ? "x" : `${c}x`)).join(" + ")} = 360`, `${total}x = 360`, `x = ${x}`);
          return numberProblem({
            prompt: askX
              ? t(
                  `The exterior angles of a convex ${name.en} measure ${listed.en}. Find $x$.`,
                  `一个凸${name["zh-CN"]}的外角分别为 ${listed["zh-CN"]}。求 $x$。`,
                )
              : t(
                  `The exterior angles of a convex ${name.en} measure ${listed.en}. What is the measure of its smallest interior angle?`,
                  `一个凸${name["zh-CN"]}的外角分别为 ${listed["zh-CN"]}。它最小的内角是多少度？`,
                ),
            answer: askX ? x : 180 - top,
            form: "integer",
            ...(askX ? {} : { unit: "°" }),
            wrong: askX
              ? [((n - 2) * 180) / total, 180 / total, x * 2].filter((w) => Number.isInteger(w) && w !== x)
              : [top, 180 - cs[0]! * x, cs[0]! * x],
            solution: askX
              ? t(`The exterior angles add up to $360^\\circ$:${solve}`, `外角和为 $360^\\circ$：${solve}`)
              : t(
                  `The exterior angles add up to $360^\\circ$:${solve}The smallest interior angle is next to the largest exterior angle, $${cs.at(-1)}x = ${degTex(top)}$:${steps(`180^\\circ - ${degTex(top)} = ${degTex(180 - top)}`)}`,
                  `外角和为 $360^\\circ$：${solve}最小的内角与最大的外角 $${cs.at(-1)}x = ${degTex(top)}$ 相邻：${steps(`180^\\circ - ${degTex(top)} = ${degTex(180 - top)}`)}`,
                ),
          });
        }
      },
    },
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

const regularPolygons = topic(
  "regular-polygons",
  t("Regular Polygons", "正多边形"),
  t(
    "A regular polygon has all sides equal and all angles equal. Recognize regular polygons, find the number of sides from how the interior and exterior angles compare, and find angles formed by a diagonal.",
    "正多边形的各边相等、各角也相等。识别正多边形，由内角与外角的关系求边数，并求对角线形成的角。",
  ),
  ["exterior-angles-of-polygons"],
  ["8.G.A.5"],
  [
    {
      id: "recognizing-regular-polygons",
      title: t("Recognizing regular polygons", "识别正多边形"),
      explanation: t(
        "A polygon is **regular** only when **both** its sides are all equal **and** its angles are all equal. Either one alone is not enough:\n\n- a rhombus that is not a square has four equal sides but two different angles;\n- a rectangle that is not a square has four right angles but two different side lengths.\n\nA square has both, so it is a regular quadrilateral.",
        "多边形只有在各边都相等**并且**各角都相等时才是**正多边形**。只满足其中一条不够：\n\n- 不是正方形的菱形四边相等，但角有两种；\n- 不是正方形的长方形四个角都是直角，但边长有两种。\n\n正方形两者兼备，所以它是正四边形。",
      ),
      generate(rng) {
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
        const verdict =
          kind === "regular"
            ? t("All the sides are equal and all the angles are equal, so it is regular.", "各边都相等，各角也都相等，所以它是正多边形。")
            : kind === "sides"
              ? t(
                  "All the sides are equal, but the angles are not, so it is not regular.",
                  "各边都相等，但各角不全相等，所以它不是正多边形。",
                )
              : t(
                  "All the angles are equal, but the sides are not, so it is not regular.",
                  "各角都相等，但各边不全相等，所以它不是正多边形。",
                );
        return choiceProblem({
          prompt: t(
            `${/^[aeiou]/.test(name.en) ? "An" : "A"} ${name.en} has sides of ${sideText.en}, in order, and angles of ${angleText.en}. Is it a regular polygon?`,
            `一个${name["zh-CN"]}的各边依次为 ${sideText["zh-CN"]}，各角为 ${angleText["zh-CN"]}。它是正多边形吗？`,
          ),
          options: yesNo,
          correct: regular ? 0 : 1,
          solution: verdict,
        });
      },
    },
    {
      id: "sides-from-angle-relationships",
      title: t("Sides from angle relationships", "由角的关系求边数"),
      explanation: t(
        "In a regular polygon with $n$ sides, each exterior angle is $\\frac{360^\\circ}{n}$ and each interior angle is $180^\\circ$ minus that. A relationship between the two angles gives the exterior angle, and then $n$.\n\nIf each interior angle is $4$ times each exterior angle, the two together make $5$ exterior angles, which is $180^\\circ$: each exterior angle is $36^\\circ$, so $n = 360 \\div 36 = 10$.",
        "在 $n$ 条边的正多边形中，每个外角是 $\\frac{360^\\circ}{n}$，每个内角是 $180^\\circ$ 减去外角。由两种角之间的关系可以求出外角，进而求出 $n$。\n\n若每个内角是每个外角的 $4$ 倍，两者合起来是 $5$ 个外角，等于 $180^\\circ$：每个外角是 $36^\\circ$，所以 $n = 360 \\div 36 = 10$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const [p, q] = rng.pick([
            [3, 2],
            [7, 2],
            [13, 2],
            [5, 1],
            [3, 1],
            [8, 1],
          ] as const);
          const exterior = (180 * q) / (p + q);
          const qx = q === 1 ? "x" : `${q}x`;
          const n = 360 / exterior;
          return numberProblem({
            prompt: t(
              `In a regular polygon, the ratio of each interior angle to each exterior angle is $${p} : ${q}$. How many sides does the polygon have?`,
              `一个正多边形的每个内角与每个外角之比为 $${p} : ${q}$。这个多边形有几条边？`,
            ),
            answer: n,
            form: "integer",
            wrong: [p + q, Number.isInteger(360 / ((180 * p) / (p + q))) ? 360 / ((180 * p) / (p + q)) : n + 2, n - 1],
            solution: t(
              `Write the angles as $${p}x$ and $${qx}$; they form a linear pair:${steps(`${p}x + ${qx} = 180`, `x = ${Q.of(180, p + q).toLatex()}`)}The exterior angle is $${qx} = ${degTex(exterior)}$, and the exterior angles add up to $360^\\circ$:${steps(`n = 360 \\div ${exterior} = ${n}`)}`,
              `把两个角写成 $${p}x$ 和 $${qx}$，二者是邻补角：${steps(`${p}x + ${qx} = 180`, `x = ${Q.of(180, p + q).toLatex()}`)}外角是 $${qx} = ${degTex(exterior)}$，外角和为 $360^\\circ$：${steps(`n = 360 \\div ${exterior} = ${n}`)}`,
            ),
          });
        }
        if (kind === 1) {
          const k = rng.pick([2, 3, 4, 5, 7, 8, 9, 11, 14, 17]);
          const exterior = 180 / (k + 1);
          const n = 360 / exterior;
          return numberProblem({
            prompt: t(
              `Each interior angle of a regular polygon is $${k}$ times each of its exterior angles. How many sides does the polygon have?`,
              `一个正多边形的每个内角是每个外角的 $${k}$ 倍。这个多边形有几条边？`,
            ),
            answer: n,
            form: "integer",
            wrong: [k + 1, k, n + 2],
            solution: t(
              `Let each exterior angle be $e$; the interior angle is $${k}e$, and the two form a linear pair:${steps(`${k}e + e = 180`, `e = ${Q.of(180, k + 1).toLatex()}`)}The exterior angles add up to $360^\\circ$:${steps(`n = 360 \\div ${Q.of(180, k + 1).toLatex()} = ${n}`)}`,
              `设每个外角为 $e$，则内角为 $${k}e$，二者是邻补角：${steps(`${k}e + e = 180`, `e = ${Q.of(180, k + 1).toLatex()}`)}外角和为 $360^\\circ$：${steps(`n = 360 \\div ${Q.of(180, k + 1).toLatex()} = ${n}`)}`,
            ),
          });
        }
        const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
        const exterior = 360 / n;
        const d = 180 - 2 * exterior;
        return numberProblem({
          prompt: t(
            `Each interior angle of a regular polygon is $${degTex(d)}$ more than each of its exterior angles. How many sides does the polygon have?`,
            `一个正多边形的每个内角比每个外角大 $${degTex(d)}$。这个多边形有几条边？`,
          ),
          answer: n,
          form: "integer",
          wrong: [
            Number.isInteger(360 / (180 - exterior)) ? 360 / (180 - exterior) : n + 2,
            Number.isInteger(360 / d) ? 360 / d : n - 1,
            n + 2,
          ].filter((w) => w !== n),
          solution: t(
            `Let each exterior angle be $e$; the interior angle is $e + ${d}$, and the two form a linear pair:${steps(`e + (e + ${d}) = 180`, `2e = ${180 - d}`, `e = ${exterior}`)}The exterior angles add up to $360^\\circ$:${steps(`n = 360 \\div ${exterior} = ${n}`)}`,
            `设每个外角为 $e$，则内角为 $e + ${d}$，二者是邻补角：${steps(`e + (e + ${d}) = 180`, `2e = ${180 - d}`, `e = ${exterior}`)}外角和为 $360^\\circ$：${steps(`n = 360 \\div ${exterior} = ${n}`)}`,
          ),
        });
      },
    },
    {
      id: "angles-formed-by-a-diagonal",
      title: t("Angles formed by a diagonal", "对角线形成的角"),
      explanation: t(
        "A diagonal $AC$ of a regular polygon $ABC\\ldots$ cuts off triangle $ABC$. Its sides $AB$ and $BC$ are sides of the polygon, so they are equal and the triangle is isosceles; the angle at $B$ is an interior angle of the polygon.\n\nIn a regular pentagon, $m\\angle B = 108^\\circ$, so the base angles are $(180^\\circ - 108^\\circ) \\div 2 = 36^\\circ$: $m\\angle BAC = 36^\\circ$.",
        "正多边形 $ABC\\ldots$ 的对角线 $AC$ 截出三角形 $ABC$。它的两边 $AB$、$BC$ 是多边形的边，所以相等，三角形是等腰三角形；$B$ 处的角是多边形的一个内角。\n\n在正五边形中，$m\\angle B = 108^\\circ$，所以两个底角都是 $(180^\\circ - 108^\\circ) \\div 2 = 36^\\circ$：$m\\angle BAC = 36^\\circ$。",
      ),
      generate(rng) {
        const n = rng.pick([5, 6, 9, 10, 12]);
        const k = rng.int(0, n - 4);
        const [P, B, R, S] = [0, 1, 2, 3].map((i) => polygonLetters[k + i]!);
        const interiorAngle = ((n - 2) * 180) / n;
        const base = (180 - interiorAngle) / 2;
        const rest = rng.bool();
        const answer = rest ? interiorAngle - base : base;
        const name = polygonName(n);
        const asked = rest ? `${P}${R}${S}` : `${B}${P}${R}`;
        const isosceles = `$${P}${B} = ${B}${R}$, so $\\triangle ${P}${B}${R}$ is isosceles and its base angles are equal:${steps(`m\\angle ${B}${P}${R} = m\\angle ${B}${R}${P} = \\frac{180^\\circ - ${degTex(interiorAngle)}}{2} = ${degTex(base)}`)}`;
        const isoscelesZh = `$${P}${B} = ${B}${R}$，所以 $\\triangle ${P}${B}${R}$ 是等腰三角形，两个底角相等：${steps(`m\\angle ${B}${P}${R} = m\\angle ${B}${R}${P} = \\frac{180^\\circ - ${degTex(interiorAngle)}}{2} = ${degTex(base)}`)}`;
        const restLine = steps(`m\\angle ${P}${R}${S} = ${degTex(interiorAngle)} - ${degTex(base)} = ${degTex(answer)}`);
        return {
          ...numberProblem({
            prompt: t(
              `In regular ${name.en} $${polygonLetters.slice(0, n)}$, the diagonal $${P}${R}$ is drawn. Find $m\\angle ${asked}$.`,
              `在正${name["zh-CN"]} $${polygonLetters.slice(0, n)}$ 中，画出对角线 $${P}${R}$。求 $m\\angle ${asked}$。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            wrong: [interiorAngle, 360 / n, interiorAngle / 2, rest ? base : interiorAngle - base].filter(
              (w) => Number.isInteger(w) && w !== answer,
            ),
            solution: t(
              `Each interior angle of a regular ${name.en} is $\\frac{(${n} - 2) \\cdot 180^\\circ}{${n}} = ${degTex(interiorAngle)}$, so $m\\angle ${P}${B}${R} = ${degTex(interiorAngle)}$. ${isosceles}${rest ? `The diagonal splits the interior angle at $${R}$, so:${restLine}` : ""}`,
              `正${name["zh-CN"]}的每个内角是 $\\frac{(${n} - 2) \\cdot 180^\\circ}{${n}} = ${degTex(interiorAngle)}$，所以 $m\\angle ${P}${B}${R} = ${degTex(interiorAngle)}$。${isoscelesZh}${rest ? `对角线把 $${R}$ 处的内角分成两部分，所以：${restLine}` : ""}`,
            ),
          }),
          figure: regularFigure(n, k, rest ? [k + 2, k, k + 3] : [k, k + 1, k + 2]),
        };
      },
    },
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
