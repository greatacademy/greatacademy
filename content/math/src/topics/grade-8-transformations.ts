import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, linear, type Mark, type PlaneMark, type PlaneView, plane, Q, sketch } from "@ga/subject-math";

import { choiceProblem, equationProblem, numberProblem, pointLatex, pointProblem, steps, verdictChoice, yesNo } from "../problems.ts";
import { pickTriangle, polygonMarks } from "./geometry-proof-congruence-similarity.ts";
import { applyAll, type Move, rigidMoves, same2, sequenceName, translation } from "./geometry-transformations.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// 8th Grade Math, Unit 7: properties of rigid motions, congruence and similarity through sequences of transformations, and slope triangles.

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

/** XY is a grid point. */
type XY = readonly [number, number];

/** pl writes a point: "(3, -2)". */
const pl = (p: readonly (number | Q)[]) => pointLatex(p);

const view: PlaneView = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 };

/** graph draws marks in the coordinate plane as a figure. */
const graph = (marks: readonly PlaneMark[], en: string, zh: string): Figure => ({ svg: plane(view, marks), alt: t(en, zh) });

/** fig builds a figure from sketch marks. */
const fig = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** within tells whether every point lies in the square |x|, |y| ≤ lim. */
const within = (pts: readonly XY[], lim = 7) => pts.every((p) => Math.abs(p[0]) <= lim && Math.abs(p[1]) <= lim);

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** capText capitalizes the English side of a text. */
const capText = (x: Text): Text => t(cap(x.en), x["zh-CN"]);

/** sequenceOption writes a sequence of transformations as a choice option: "The rotation …, followed by …", "先作…，然后…". */
const sequenceOption = (moves: readonly Move[]): Text => {
  const name = sequenceName(moves);
  return t(cap(name.en), `先作${name["zh-CN"]}`);
};

/** paren wraps a negative number in parentheses: "(-3)". */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** mapAll applies moves in order to every point. */
const mapAll = (moves: readonly Move[], pts: readonly XY[]) => pts.map((p) => applyAll(moves, p));

/** apart tells whether the boxes around two figures are at least 2 units apart, so that their drawings and labels do not touch. */
function apart(p: readonly XY[], q: readonly XY[]): boolean {
  const box = (pts: readonly XY[], i: 0 | 1) => [Math.min(...pts.map((v) => v[i])), Math.max(...pts.map((v) => v[i]))] as const;
  const space = (i: 0 | 1) => {
    const [[a0, a1], [b0, b1]] = [box(p, i), box(q, i)];
    return Math.max(b0 - a1, a0 - b1);
  };
  return space(0) >= 2 || space(1) >= 2;
}

/** sameList tells whether two lists of points are equal point by point. */
const sameList = (a: readonly XY[], b: readonly XY[]) => a.length === b.length && a.every((p, i) => same2(p, b[i]!));

const ABC = ["A", "B", "C"] as const;
const primed = ["A′", "B′", "C′"] as const;

/** imageLetters are the names of image triangles in congruence statements. */
const imageLetters: readonly string[] = ["DEF", "PQR", "XYZ", "JKL", "STU"];

/** pickTranslation picks a translation that moves both coordinates, with its shift. */
function pickTranslation(rng: Rng): { move: Move; h: number; v: number } {
  const [h, v] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
  return { move: translation(h, v), h, v };
}

/** trace writes the images of the point named name after each move, the last one primed. */
function trace(moves: readonly Move[], p: XY, name: string): Text {
  let q = p;
  const en: string[] = [];
  const zh: string[] = [];
  moves.forEach((m, i) => {
    q = m.f(q);
    const label = i === moves.length - 1 ? `${name}'` : `${name}_{${i + 1}}`;
    en.push(`${i + 1}. ${cap(m.name.en)}: $${label} = ${pl(q)}$`);
    zh.push(`${i + 1}. ${m.name["zh-CN"]}：$${label} = ${pl(q)}$`);
  });
  return t(en.join("\n"), zh.join("\n"));
}

/** slide describes a translation of a figure in words: "translated 3 units right and 2 units up". */
function slide(h: number, v: number): Text {
  const units = (n: number) => `${Math.abs(n)} unit${Math.abs(n) === 1 ? "" : "s"}`;
  return t(
    `translated ${units(h)} ${h > 0 ? "right" : "left"} and ${units(v)} ${v > 0 ? "up" : "down"}`,
    `向${h > 0 ? "右" : "左"}平移 ${Math.abs(h)} 个单位、再向${v > 0 ? "上" : "下"}平移 ${Math.abs(v)} 个单位`,
  );
}

/** yesNoProblem builds a yes-or-no question whose answer is yes when yes is true. */
function yesNoProblem(prompt: Text, yes: boolean, solution: Text, figure?: Figure): Problem {
  return { ...choiceProblem({ prompt, options: yesNo, correct: yes ? 0 : 1, solution }), ...(figure && { figure }) };
}

/** rule writes the translation rule (x, y) → (x + h, y + v). */
const rule = (h: number, v: number) => `(x, y) \\to (${linear(1, h)}, ${linear(1, v, "y")})`;

/** distinctInts picks n distinct integers from lo to hi. */
const distinctInts = (rng: Rng, n: number, lo: number, hi: number) =>
  rng.sample(
    Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
    n,
  );

/** solveSteps writes the steps of solving cx + d = v. */
function solveSteps(c: number, d: number, v: number): string {
  const lines = [`${linear(c, d)} = ${v}`];
  if (d !== 0) lines.push(`${linear(c, 0)} = ${v - d}`);
  if (c !== 1) lines.push(`x = ${Q.of(v - d, c).toLatex()}`);
  return steps(...lines);
}

// ─── Verifying Properties of Rigid Motions ──────────────────────────────────

/** Motion is a rigid motion described in words, with statements about a quadrilateral's image that need not hold. */
interface Motion {
  readonly words: Text;
  readonly falses: (a: number, beta: number) => readonly Text[];
}

const opposite = t(
  "$A'$, $B'$, $C'$, $D'$ go around in the opposite direction to $A$, $B$, $C$, $D$",
  "$A'$、$B'$、$C'$、$D'$ 的环绕方向与 $A$、$B$、$C$、$D$ 相反",
);
const sameWay = t(
  "$A'$, $B'$, $C'$, $D'$ go around in the same direction as $A$, $B$, $C$, $D$",
  "$A'$、$B'$、$C'$、$D'$ 的环绕方向与 $A$、$B$、$C$、$D$ 相同",
);
const parallelToAB = same("$\\overline{A'B'} \\parallel \\overline{AB}$");
const perpendicularToAB = same("$\\overline{A'B'} \\perp \\overline{AB}$");
const supplement = (beta: number) => same(`$m\\angle B' = ${180 - beta}^\\circ$`);

/** pickMotion picks a rigid motion of a quadrilateral and the false statements typical of it. */
function pickMotion(rng: Rng): Motion {
  switch (rng.int(0, 3)) {
    case 0: {
      const [h, v] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
      return {
        words: slide(h, v),
        falses: (a, beta) => [same(`$A'B' = ${a + Math.abs(h)}$`), perpendicularToAB, opposite, supplement(beta)],
      };
    }
    case 1: {
      const axis = rng.pick(["x", "y"]);
      return {
        words: t(`reflected across the $${axis}$-axis`, `关于 $${axis}$ 轴作轴对称`),
        falses: (_, beta) => [sameWay, parallelToAB, supplement(beta)],
      };
    }
    case 2: {
      const ccw = rng.bool();
      return {
        words: t(
          `rotated $90^\\circ$ ${ccw ? "counterclockwise" : "clockwise"} about the origin`,
          `绕原点${ccw ? "逆" : "顺"}时针旋转 $90^\\circ$`,
        ),
        falses: (_, beta) => [parallelToAB, opposite, beta + 90 < 180 ? same(`$m\\angle B' = ${beta + 90}^\\circ$`) : supplement(beta)],
      };
    }
    default:
      return {
        words: t("rotated $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$"),
        falses: (_, beta) => [perpendicularToAB, opposite, supplement(beta)],
      };
  }
}

/** Direction is a direction along the grid, with words for "B′ is … A′". */
interface Direction {
  readonly d: XY;
  readonly words: Text;
}

const directions: readonly Direction[] = [
  { d: [1, 0], words: t("directly to the right of", "正右方") },
  { d: [-1, 0], words: t("directly to the left of", "正左方") },
  { d: [0, 1], words: t("directly above", "正上方") },
  { d: [0, -1], words: t("directly below", "正下方") },
];

/** along moves p by n steps in direction d. */
const along = (p: XY, d: XY, n: number): XY => [p[0] + n * d[0], p[1] + n * d[1]];

const verifyingPropertiesOfRigidMotions = topic(
  "verifying-properties-of-rigid-motions",
  t("Verifying Properties of Rigid Motions", "验证刚体运动的性质"),
  t(
    "Use the facts that rigid motions keep lengths, angle measures and parallel lines, match each part of a figure with its image, and tell which properties a particular motion keeps.",
    "利用刚体运动保持长度、角的度数和平行关系的性质，把图形的各部分与它们的像对应起来，并判断某种运动还保持哪些性质。",
  ),
  ["translations-of-geometric-figures", "reflections-in-the-coordinate-plane", "rotations-of-geometric-figures"],
  ["8.G.A.1"],
  [
    {
      id: "corresponding-measures",
      title: t("Measures of the image", "像的度量"),
      explanation: t(
        "A **rigid motion** is a translation, a reflection, a rotation, or a sequence of them. It moves a figure without stretching or bending it:\n\n- segments go to segments of the **same length**;\n- angles go to angles of the **same measure**;\n- parallel lines go to parallel lines.\n\nTo use this, match each part with its image. If a rigid motion maps $A$ to $Q$, $B$ to $R$ and $C$ to $P$, then $\\overline{AB}$ goes to $\\overline{QR}$ and $\\angle C$ goes to $\\angle P$. So $AB = 7$ gives $QR = 7$, and $m\\angle C = 50^\\circ$ gives $m\\angle P = 50^\\circ$.",
        "**刚体运动**是平移、轴对称、旋转，或者它们的组合。它移动图形，但不拉伸也不弯折图形：\n\n- 线段变成**长度相同**的线段；\n- 角变成**度数相同**的角；\n- 平行线变成平行线。\n\n运用这些性质时，要先把每一部分和它的像对应起来。如果一次刚体运动把 $A$ 映到 $Q$，$B$ 映到 $R$，$C$ 映到 $P$，那么 $\\overline{AB}$ 变成 $\\overline{QR}$，$\\angle C$ 变成 $\\angle P$。所以由 $AB = 7$ 得 $QR = 7$，由 $m\\angle C = 50^\\circ$ 得 $m\\angle P = 50^\\circ$。",
      ),
      generate(rng) {
        const letters = rng.pick(imageLetters);
        const perm = rng.shuffle([0, 1, 2]);
        const img = (i: number) => letters[perm[i]!]!;
        const motion = rng.pick([
          t("A reflection", "一次轴对称"),
          t("A rotation", "一次旋转"),
          t("A translation", "一次平移"),
          t("A rotation followed by a translation", "先旋转再平移的变换"),
        ]);
        const mapping = t(
          `${motion.en} maps $A$ to $${img(0)}$, $B$ to $${img(1)}$ and $C$ to $${img(2)}$.`,
          `${motion["zh-CN"]}把 $A$ 映到 $${img(0)}$，$B$ 映到 $${img(1)}$，$C$ 映到 $${img(2)}$。`,
        );
        const k = rng.int(0, 2);
        if (rng.bool()) {
          let sides: number[];
          do sides = distinctInts(rng, 3, 4, 15);
          while (2 * Math.max(...sides) >= sides[0]! + sides[1]! + sides[2]!);
          const pairs = [
            [0, 1],
            [1, 2],
            [2, 0],
          ] as const;
          const [i, j] = pairs[k]!;
          const asked = [img(i), img(j)].sort((p, q) => letters.indexOf(p) - letters.indexOf(q)).join("");
          const given = pairs.map(([p, q], n) => `${ABC[p]}${ABC[q]} = ${sides[n]}`);
          return numberProblem({
            prompt: t(
              `In triangle $ABC$, $${given[0]}$, $${given[1]}$ and $${given[2]}$. ${mapping.en} Find $${asked}$.`,
              `在三角形 $ABC$ 中，$${given[0]}$，$${given[1]}$，$${given[2]}$。${mapping["zh-CN"]}求 $${asked}$。`,
            ),
            answer: sides[k]!,
            wrong: sides.filter((_, n) => n !== k),
            solution: t(
              `$${img(i)}$ is the image of $${ABC[i]}$ and $${img(j)}$ is the image of $${ABC[j]}$, so $\\overline{${asked}}$ is the image of $\\overline{${ABC[i]}${ABC[j]}}$. A rigid motion keeps lengths:${steps(`${asked} = ${ABC[i]}${ABC[j]} = ${sides[k]}`)}`,
              `$${img(i)}$ 是 $${ABC[i]}$ 的像，$${img(j)}$ 是 $${ABC[j]}$ 的像，所以 $\\overline{${asked}}$ 是 $\\overline{${ABC[i]}${ABC[j]}}$ 的像。刚体运动保持长度：${steps(`${asked} = ${ABC[i]}${ABC[j]} = ${sides[k]}`)}`,
            ),
          });
        }
        let angles: number[];
        do angles = [rng.int(30, 85), rng.int(30, 85)];
        while (angles[0] === angles[1] || 180 - angles[0]! - angles[1]! < 25 || angles.includes(180 - angles[0]! - angles[1]!));
        angles.push(180 - angles[0]! - angles[1]!);
        const [alpha, beta, gamma] = angles as [number, number, number];
        const answer = angles[k]!;
        const solution =
          k === 2
            ? t(
                `$${img(2)}$ is the image of $C$, so $m\\angle ${img(2)} = m\\angle C$. The angles of triangle $ABC$ add up to $180^\\circ$:${steps(`m\\angle C = 180^\\circ - ${alpha}^\\circ - ${beta}^\\circ = ${gamma}^\\circ`)}A rigid motion keeps angle measures, so $m\\angle ${img(2)} = ${gamma}^\\circ$.`,
                `$${img(2)}$ 是 $C$ 的像，所以 $m\\angle ${img(2)} = m\\angle C$。三角形 $ABC$ 的内角和是 $180^\\circ$：${steps(`m\\angle C = 180^\\circ - ${alpha}^\\circ - ${beta}^\\circ = ${gamma}^\\circ`)}刚体运动保持角的度数，所以 $m\\angle ${img(2)} = ${gamma}^\\circ$。`,
              )
            : t(
                `$${img(k)}$ is the image of $${ABC[k]}$, and a rigid motion keeps angle measures:${steps(`m\\angle ${img(k)} = m\\angle ${ABC[k]} = ${answer}^\\circ`)}`,
                `$${img(k)}$ 是 $${ABC[k]}$ 的像，刚体运动保持角的度数：${steps(`m\\angle ${img(k)} = m\\angle ${ABC[k]} = ${answer}^\\circ`)}`,
              );
        return numberProblem({
          prompt: t(
            `In triangle $ABC$, $m\\angle A = ${alpha}^\\circ$ and $m\\angle B = ${beta}^\\circ$. ${mapping.en} Find $m\\angle ${img(k)}$.`,
            `在三角形 $ABC$ 中，$m\\angle A = ${alpha}^\\circ$，$m\\angle B = ${beta}^\\circ$。${mapping["zh-CN"]}求 $m\\angle ${img(k)}$。`,
          ),
          answer,
          unit: "°",
          wrong: [...angles.filter((_, n) => n !== k), 180 - answer],
          solution,
        });
      },
    },
    {
      id: "what-a-rigid-motion-keeps",
      title: t("What a rigid motion keeps", "刚体运动保持什么"),
      explanation: t(
        "Every rigid motion keeps lengths, angle measures and parallel lines. Other features depend on the motion:\n\n- A **translation** slides every segment without turning it, so each image segment is parallel to its preimage.\n- A **rotation** of $90^\\circ$ turns every segment a quarter turn, so each image segment is perpendicular to its preimage; a $180^\\circ$ rotation turns segments into parallel ones.\n- A **reflection** flips the figure over: if $A$, $B$, $C$, $D$ go around counterclockwise, then $A'$, $B'$, $C'$, $D'$ go around clockwise. Translations and rotations keep the direction.\n\nAn angle never changes its measure: if $m\\angle B = 70^\\circ$, then $m\\angle B' = 70^\\circ$, not $110^\\circ$ or $160^\\circ$.",
        "每一种刚体运动都保持长度、角的度数和平行关系。其他特点取决于具体的运动：\n\n- **平移**让每条线段滑动而不转动，所以每条像线段都与它的原线段平行。\n- 旋转 $90^\\circ$ 让每条线段转四分之一圈，所以每条像线段都与原线段垂直；旋转 $180^\\circ$ 让线段变成与原线段平行的线段。\n- **轴对称**把图形翻过来：如果 $A$、$B$、$C$、$D$ 按逆时针方向排列，那么 $A'$、$B'$、$C'$、$D'$ 按顺时针方向排列。平移和旋转保持环绕方向不变。\n\n角的度数不会改变：若 $m\\angle B = 70^\\circ$，则 $m\\angle B' = 70^\\circ$，而不是 $110^\\circ$ 或 $160^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(3, 12);
        const beta = rng.pick([...Array.from({ length: 31 }, (_, i) => 55 + i), ...Array.from({ length: 31 }, (_, i) => 95 + i)]);
        const motion = pickMotion(rng);
        const truths = [
          same(`$A'B' = ${a}$`),
          same(`$m\\angle B' = ${beta}^\\circ$`),
          same("$\\overline{A'B'} \\parallel \\overline{D'C'}$"),
        ];
        const k = rng.int(0, 2);
        const reasons = [
          t(`A rigid motion keeps lengths, so $A'B' = AB = ${a}$.`, `刚体运动保持长度，所以 $A'B' = AB = ${a}$。`),
          t(
            `A rigid motion keeps angle measures, so $m\\angle B' = m\\angle B = ${beta}^\\circ$.`,
            `刚体运动保持角的度数，所以 $m\\angle B' = m\\angle B = ${beta}^\\circ$。`,
          ),
          t(
            "A rigid motion takes parallel lines to parallel lines, so $\\overline{A'B'} \\parallel \\overline{D'C'}$.",
            "刚体运动把平行线变成平行线，所以 $\\overline{A'B'} \\parallel \\overline{D'C'}$。",
          ),
        ];
        return pickChoice(
          rng,
          t(
            `Quadrilateral $ABCD$ has $AB = ${a}$, $m\\angle B = ${beta}^\\circ$ and $\\overline{AB} \\parallel \\overline{DC}$. It is ${motion.words.en} to give quadrilateral $A'B'C'D'$. Which statement must be true?`,
            `四边形 $ABCD$ 中，$AB = ${a}$，$m\\angle B = ${beta}^\\circ$，$\\overline{AB} \\parallel \\overline{DC}$。把它${motion.words["zh-CN"]}，得到四边形 $A'B'C'D'$。哪个说法一定成立？`,
          ),
          truths[k]!,
          rng.shuffle([...motion.falses(a, beta)]),
          reasons[k]!,
        );
      },
    },
    {
      id: "keeping-lengths-on-the-grid",
      title: t("Keeping lengths on the grid", "在网格上保持长度"),
      explanation: t(
        "The length of a horizontal segment is the difference of the $x$-coordinates of its endpoints; the length of a vertical segment is the difference of the $y$-coordinates.\n\nA rigid motion maps $A(2, 1)$ and $B(2, 6)$ to $A'(-3, 4)$ and $B'$, where $B'$ is directly to the right of $A'$. The segment $\\overline{AB}$ is vertical with $AB = 6 - 1 = 5$. Its image has the same length, so $B'$ is $5$ units right of $A'$:\n\n$$B' = (-3 + 5, 4) = (2, 4).$$\n\nThe image need not point the same way as the preimage: only the length is kept.",
        "水平线段的长度等于两个端点的 $x$ 坐标之差；竖直线段的长度等于两个端点的 $y$ 坐标之差。\n\n一次刚体运动把 $A(2, 1)$ 和 $B(2, 6)$ 映到 $A'(-3, 4)$ 和 $B'$，其中 $B'$ 在 $A'$ 的正右方。$\\overline{AB}$ 是竖直线段，$AB = 6 - 1 = 5$。它的像长度相同，所以 $B'$ 在 $A'$ 右边 $5$ 个单位：\n\n$$B' = (-3 + 5, 4) = (2, 4)$$\n\n像的方向不一定与原像相同：保持不变的只是长度。",
      ),
      generate(rng) {
        for (;;) {
          const a: XY = [rng.int(-6, 6), rng.int(-6, 6)];
          const length = rng.int(2, 7);
          const from = rng.pick(directions);
          const b = along(a, from.d, length);
          const a2: XY = [rng.int(-6, 6), rng.int(-6, 6)];
          const to = rng.pick(directions);
          const b2 = along(a2, to.d, length);
          if (!within([b, b2], 7) || same2(a, a2) || Math.hypot(a2[0] - a[0], a2[1] - a[1]) < 4) continue;
          const horizontal = from.d[1] === 0;
          const [lo, hi] = horizontal ? [a[0], b[0]].sort((p, q) => p - q) : [a[1], b[1]].sort((p, q) => p - q);
          return {
            ...pointProblem({
              prompt: t(
                `A rigid motion maps $\\overline{AB}$ onto $\\overline{A'B'}$, with $A${pl(a)}$, $B${pl(b)}$ and $A'${pl(a2)}$. The point $B'$ is ${to.words.en} $A'$. Find the coordinates of $B'$.`,
                `一次刚体运动把 $\\overline{AB}$ 映到 $\\overline{A'B'}$，其中 $A${pl(a)}$，$B${pl(b)}$，$A'${pl(a2)}$。点 $B'$ 在 $A'$ 的${to.words["zh-CN"]}。求 $B'$ 的坐标。`,
              ),
              answer: b2,
              wrong: [along(a2, to.d, -length), [a2[0] + b[0] - a[0], a2[1] + b[1] - a[1]], along(a2, to.d, length + 1)],
              solution: t(
                `$\\overline{AB}$ is ${horizontal ? "horizontal" : "vertical"}, so $AB = ${hi} - ${paren(lo!)} = ${length}$. A rigid motion keeps lengths, so $A'B' = ${length}$ and $B'$ is $${length}$ units ${to.words.en.replace("directly ", "").replace("to the ", "")} $A'$:${steps(`B' = ${pl(b2)}`)}`,
                `$\\overline{AB}$ 是${horizontal ? "水平" : "竖直"}线段，所以 $AB = ${hi} - ${paren(lo!)} = ${length}$。刚体运动保持长度，所以 $A'B' = ${length}$，$B'$ 在 $A'$ 的${to.words["zh-CN"]} $${length}$ 个单位处：${steps(`B' = ${pl(b2)}`)}`,
              ),
            }),
            figure: graph(
              [
                { kind: "segment", a, b },
                { kind: "point", at: a, label: "A", dir: "nw" },
                { kind: "point", at: b, label: "B", dir: "nw" },
                { kind: "point", at: a2, label: "A′", dir: "nw", accent: true },
              ],
              "Segment AB and the point A′ on a coordinate grid.",
              "坐标网格上的线段 AB 和点 A′。",
            ),
          };
        }
      },
    },
  ],
);

// ─── Applying Sequences of Rigid Motions ────────────────────────────────────

/** Lin is a linear map (x, y) → (ax + by, cx + dy) with entries −1, 0 or 1. */
type Lin = readonly [number, number, number, number];

/** compose is the map q followed by p. */
const compose = (p: Lin, q: Lin): Lin => [
  p[0] * q[0] + p[1] * q[2] + 0,
  p[0] * q[1] + p[1] * q[3] + 0,
  p[2] * q[0] + p[3] * q[2] + 0,
  p[2] * q[1] + p[3] * q[3] + 0,
];

/** coord writes ax + by for a, b in {−1, 0, 1} with one of them zero. */
const coord = (a: number, b: number) => (a === 1 ? "x" : a === -1 ? "-x" : b === 1 ? "y" : "-y");

/** image writes the image of (x, y) under a linear map: "(-y, x)". */
const image = (m: Lin) => `(${coord(m[0], m[1])}, ${coord(m[2], m[3])})`;

const linKey = (m: Lin) => m.join(",");

/** quarterMoves are the reflections across the axes, the rotations about the origin and the reflections across y = ±x, as linear maps; the identity is last. */
const quarterMoves: readonly { readonly m: Lin; readonly name: Text }[] = [
  { m: [1, 0, 0, -1], name: t("the reflection across the $x$-axis", "关于 $x$ 轴的轴对称") },
  { m: [-1, 0, 0, 1], name: t("the reflection across the $y$-axis", "关于 $y$ 轴的轴对称") },
  { m: [0, -1, 1, 0], name: t("the rotation of $90^\\circ$ counterclockwise about the origin", "绕原点逆时针旋转 $90^\\circ$") },
  { m: [-1, 0, 0, -1], name: t("the rotation of $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$") },
  { m: [0, 1, -1, 0], name: t("the rotation of $90^\\circ$ clockwise about the origin", "绕原点顺时针旋转 $90^\\circ$") },
  { m: [0, 1, 1, 0], name: t("the reflection across the line $y = x$", "关于直线 $y = x$ 的轴对称") },
  { m: [0, -1, -1, 0], name: t("the reflection across the line $y = -x$", "关于直线 $y = -x$ 的轴对称") },
  { m: [1, 0, 0, 1], name: t("no change: every point ends where it started", "不变：每个点都回到原处") },
];

/** commutingPair picks two transformations that give the same image in either order. */
function commutingPair(rng: Rng): [Move, Move] {
  const [xAxis, yAxis, , , rot90, rot180] = rigidMoves as [Move, Move, Move, Move, Move, Move, Move];
  switch (rng.int(0, 4)) {
    case 0:
      return [xAxis, translation(rng.nonZero(-5, 5), 0)];
    case 1:
      return [yAxis, translation(0, rng.nonZero(-5, 5))];
    case 2:
      return [rng.pick([xAxis, yAxis]), rot180];
    case 3:
      return [pickTranslation(rng).move, pickTranslation(rng).move];
    default:
      return [rot90, rot180];
  }
}

const applyingSequencesOfRigidMotions = topic(
  "applying-sequences-of-rigid-motions",
  t("Applying Sequences of Rigid Motions", "施行刚体运动的序列"),
  t(
    "Apply a sequence of translations, reflections and rotations to a figure in the coordinate plane, tell whether the order matters, and replace a sequence by a single motion.",
    "在坐标平面上对图形施行一串平移、轴对称和旋转，判断顺序是否重要，并用一个运动代替一串运动。",
  ),
  ["verifying-properties-of-rigid-motions"],
  ["8.G.A.2", "8.G.A.3"],
  [
    {
      id: "a-figure-under-a-sequence",
      title: t("A figure under a sequence", "图形在变换序列下的像"),
      explanation: t(
        "To apply a sequence of rigid motions to a figure, apply them **in the order given** to each vertex, each motion to the image of the one before.\n\nRotate triangle $ABC$ $90^\\circ$ counterclockwise about the origin, then translate by $(x, y) \\to (x + 2, y - 3)$. For $B(4, 1)$:\n\n1. Rotation: $B_1 = (-1, 4)$\n2. Translation: $B' = (1, 1)$\n\nIn the other order, the translation gives $(6, -2)$ and the rotation then gives $(2, 6)$, a different point.",
        "要对图形施行一串刚体运动，就**按给出的顺序**对每个顶点施行，每个运动都作用在前一个运动的像上。\n\n把三角形 $ABC$ 绕原点逆时针旋转 $90^\\circ$，再按 $(x, y) \\to (x + 2, y - 3)$ 平移。对 $B(4, 1)$：\n\n1. 旋转：$B_1 = (-1, 4)$\n2. 平移：$B' = (1, 1)$\n\n如果换个顺序，先平移得 $(6, -2)$，再旋转得 $(2, 6)$，是另一个点。",
      ),
      generate(rng) {
        for (;;) {
          const tri = pickTriangle(rng);
          const tr = pickTranslation(rng).move;
          const rigid = rng.pick(rigidMoves);
          const moves = rng.bool() ? [rigid, tr] : [tr, rigid];
          const i = rng.int(0, 2);
          const p = tri[i]!;
          const answer = applyAll(moves, p);
          const reversed = applyAll([moves[1]!, moves[0]!], p);
          if (same2(answer, reversed)) continue;
          const n = ABC[i]!;
          const order = sequenceName(moves);
          return {
            ...pointProblem({
              prompt: t(
                `Triangle $ABC$ is mapped onto triangle $A'B'C'$ by ${order.en}. Find the coordinates of $${n}'$.`,
                `对三角形 $ABC$ 先作${order["zh-CN"]}，得到三角形 $A'B'C'$。求 $${n}'$ 的坐标。`,
              ),
              answer,
              wrong: [reversed, moves[0]!.f(p), moves[1]!.f(p)],
              solution: t(
                `From the figure, $${n} = ${pl(p)}$. Apply the motions in order:\n\n${trace(moves, p, n).en}`,
                `由图，$${n} = ${pl(p)}$。按顺序施行各个运动：\n\n${trace(moves, p, n)["zh-CN"]}`,
              ),
            }),
            figure: graph(polygonMarks(tri, ABC), "Triangle ABC on a coordinate grid.", "坐标网格上的三角形 ABC。"),
          };
        }
      },
    },
    {
      id: "does-the-order-matter",
      title: t("Does the order matter?", "顺序重要吗？"),
      explanation: t(
        "Changing the order of two rigid motions usually changes the image, so check by applying them both ways.\n\nFor $P(3, 2)$, reflecting across the $x$-axis and then translating by $(x, y) \\to (x, y + 4)$ gives $(3, -2)$, then $(3, 2)$. Translating first gives $(3, 6)$, then $(3, -6)$. The images differ, so the order matters.\n\nSome pairs give the same image in either order, such as two translations, or a reflection across the $x$-axis and a translation that only moves points left or right.",
        "交换两个刚体运动的顺序，像通常会改变，所以要按两种顺序分别施行来检验。\n\n对 $P(3, 2)$，先关于 $x$ 轴作轴对称，再按 $(x, y) \\to (x, y + 4)$ 平移，得到 $(3, -2)$，再得 $(3, 2)$。先平移则得 $(3, 6)$，再得 $(3, -6)$。两个像不同，所以顺序重要。\n\n有些运动按任一顺序施行都得到同一个像，例如两次平移，或者关于 $x$ 轴的轴对称与只向左右移动的平移。",
      ),
      generate(rng) {
        for (;;) {
          const pair: [Move, Move] = rng.bool() ? commutingPair(rng) : [rng.pick(rigidMoves), pickTranslation(rng).move];
          const [m1, m2] = rng.bool() ? pair : [pair[1], pair[0]];
          const p: XY = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
          if (Math.abs(p[0]) === Math.abs(p[1])) continue;
          const first = applyAll([m1, m2], p);
          const second = applyAll([m2, m1], p);
          const equal = same2(first, second);
          const verdict = equal
            ? t(
                `Both orders send $P$ to $${pl(first)}$, so here the order does not matter.`,
                `两种顺序都把 $P$ 映到 $${pl(first)}$，所以这里顺序不重要。`,
              )
            : t(
                `The images $${pl(first)}$ and $${pl(second)}$ differ, so the order matters.`,
                `像 $${pl(first)}$ 和 $${pl(second)}$ 不同，所以顺序重要。`,
              );
          const shownSecond: XY = equal ? [first[0] + 1, first[1]] : second;
          return verdictChoice(rng, {
            prompt: t(
              `The point $P${pl(p)}$ is mapped by ${m1.name.en}, followed by ${m2.name.en}. Would doing the two transformations in the opposite order send $P$ to the same point?`,
              `对点 $P${pl(p)}$ 先作${m1.name["zh-CN"]}，然后作${m2.name["zh-CN"]}。如果按相反的顺序施行这两个变换，$P$ 会被映到同一个点吗？`,
            ),
            holds: equal,
            yes: t(`both orders end at $${pl(first)}$`, `两种顺序都停在 $${pl(first)}$`),
            no: t(
              `one order ends at $${pl(first)}$ and the other at $${pl(shownSecond)}$`,
              `一种顺序停在 $${pl(first)}$，另一种停在 $${pl(shownSecond)}$`,
            ),
            yesWrong: t("rigid motions keep lengths and angles", "刚体运动保持长度和角度"),
            noWrong: t("changing the order always changes the image", "改变顺序总会改变像"),
            solution: t(
              `In the given order:\n\n${trace([m1, m2], p, "P").en}\n\nIn the opposite order:\n\n${trace([m2, m1], p, "P").en}\n\n${verdict.en}`,
              `按给出的顺序：\n\n${trace([m1, m2], p, "P")["zh-CN"]}\n\n按相反的顺序：\n\n${trace([m2, m1], p, "P")["zh-CN"]}\n\n${verdict["zh-CN"]}`,
            ),
          });
        }
      },
    },
    {
      id: "a-single-motion-for-a-sequence",
      title: t("A single motion for a sequence", "用一个运动代替一串运动"),
      explanation: t(
        "Some sequences have the same effect as a single motion. Follow the general point $(x, y)$ through the sequence.\n\n- Two translations make one translation: $(x, y) \\to (x + 3, y - 1)$ followed by $(x, y) \\to (x - 5, y + 4)$ is $(x, y) \\to (x - 2, y + 3)$.\n- Reflecting across the $x$-axis and then across the $y$-axis gives $(x, y) \\to (x, -y) \\to (-x, -y)$: a rotation of $180^\\circ$ about the origin.\n- Two $90^\\circ$ counterclockwise rotations make a $180^\\circ$ rotation, and reflecting twice across the same line brings every point back.",
        "有些变换序列的效果与一个运动相同。让一般的点 $(x, y)$ 依次经过这串变换。\n\n- 两次平移合成一次平移：先按 $(x, y) \\to (x + 3, y - 1)$，再按 $(x, y) \\to (x - 5, y + 4)$，就是 $(x, y) \\to (x - 2, y + 3)$。\n- 先关于 $x$ 轴、再关于 $y$ 轴作轴对称，得到 $(x, y) \\to (x, -y) \\to (-x, -y)$：绕原点旋转 $180^\\circ$。\n- 两次逆时针旋转 $90^\\circ$ 合成旋转 $180^\\circ$；关于同一条直线作两次轴对称，每个点都回到原处。",
      ),
      generate(rng) {
        if (rng.bool()) {
          let [h1, v1, h2, v2] = [0, 0, 0, 0];
          do [h1, v1, h2, v2] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
          while (h1 + h2 === 0 || v1 + v2 === 0);
          const [m1, m2] = [translation(h1, v1), translation(h2, v2)];
          return pickChoice(
            rng,
            t(
              `Which single transformation has the same effect as ${m1.name.en}, followed by ${m2.name.en}?`,
              `先作${m1.name["zh-CN"]}，再作${m2.name["zh-CN"]}。哪一个变换与这个序列的效果相同？`,
            ),
            capText(translation(h1 + h2, v1 + v2).name),
            [
              capText(translation(h1 - h2, v1 - v2).name),
              capText(translation(h2 - h1, v2 - v1).name),
              capText(translation(h1 + v1, h2 + v2).name),
              capText(translation(h1 * h2, v1 * v2).name),
            ],
            t(
              `Follow $(x, y)$ through both translations:${steps(`(x, y) \\to (${linear(1, h1)}, ${linear(1, v1, "y")}) \\to (${linear(1, h1 + h2)}, ${linear(1, v1 + v2, "y")})`)}So the sequence is the single translation $${rule(h1 + h2, v1 + v2)}$.`,
              `让 $(x, y)$ 依次经过两次平移：${steps(`(x, y) \\to (${linear(1, h1)}, ${linear(1, v1, "y")}) \\to (${linear(1, h1 + h2)}, ${linear(1, v1 + v2, "y")})`)}所以这个序列就是一次平移 $${rule(h1 + h2, v1 + v2)}$。`,
            ),
          );
        }
        const moves = quarterMoves.slice(0, 5);
        const first = rng.pick(moves);
        const second = rng.pick(moves);
        const result = compose(second.m, first.m);
        const named = quarterMoves.find((q) => linKey(q.m) === linKey(result))!;
        const wrong = [compose(first.m, second.m), first.m, second.m, ...rng.shuffle(quarterMoves.map((q) => q.m))]
          .map((m) => quarterMoves.find((q) => linKey(q.m) === linKey(m))!.name)
          .map(capText);
        return pickChoice(
          rng,
          t(
            `Which single transformation has the same effect as ${first.name.en}, followed by ${second.name.en}?`,
            `先作${first.name["zh-CN"]}，再作${second.name["zh-CN"]}。哪一个变换与这个序列的效果相同？`,
          ),
          capText(named.name),
          wrong,
          t(
            `Follow $(x, y)$ through both motions:${steps(`(x, y) \\to ${image(first.m)} \\to ${image(result)}`)}This is ${named.name.en.replace("no change: ", "no change at all: ")}.`,
            `让 $(x, y)$ 依次经过两个运动：${steps(`(x, y) \\to ${image(first.m)} \\to ${image(result)}`)}这就是${named.name["zh-CN"]}。`,
          ),
        );
      },
    },
  ],
);

// ─── Congruence Through Rigid Motions ───────────────────────────────────────

/** legTriangle is the right triangle with its right angle at a and legs of lengths p and q along the grid. */
const legTriangle = (a: XY, p: number, q: number, sx: number, sy: number): XY[] => [a, [a[0] + sx * p, a[1]], [a[0], a[1] + sy * q]];

const congruenceThroughRigidMotions = topic(
  "congruence-through-rigid-motions",
  t("Congruence Through Rigid Motions", "通过刚体运动判断全等"),
  t(
    "Decide whether two figures are congruent by looking for a sequence of rigid motions that maps one onto the other, and use a congruence statement to find unknown sides and angles.",
    "通过寻找把一个图形映到另一个图形上的刚体运动序列来判断两个图形是否全等，并利用全等式求未知的边和角。",
  ),
  ["applying-sequences-of-rigid-motions"],
  ["8.G.A.2"],
  [
    {
      id: "are-the-figures-congruent",
      title: t("Are the figures congruent?", "两个图形全等吗？"),
      explanation: t(
        "Two figures are **congruent** if a sequence of rigid motions maps one onto the other. Since rigid motions keep lengths and angles, congruent figures have equal corresponding sides and angles.\n\nTo show two figures are congruent, find such a sequence. To show they are not, find a length or angle that cannot match: if one right triangle has legs $3$ and $5$ and another has legs $3$ and $4$, no rigid motion can map one onto the other.",
        "如果一串刚体运动能把一个图形映到另一个图形上，这两个图形就**全等**。由于刚体运动保持长度和角度，全等图形的对应边相等，对应角也相等。\n\n要说明两个图形全等，就找出这样一串运动。要说明它们不全等，就找出一个无法对应的长度或角：若一个直角三角形的两条直角边是 $3$ 和 $5$，另一个的是 $3$ 和 $4$，那么没有刚体运动能把一个映到另一个上。",
      ),
      generate(rng) {
        for (;;) {
          const [p, q] = [rng.int(2, 5), rng.int(2, 5)];
          const [sx, sy] = [rng.pick([-1, 1]), rng.pick([-1, 1])];
          const a: XY = [rng.int(-6, 6), rng.int(-6, 6)];
          const tri = legTriangle(a, p, q, sx, sy);
          const congruent = rng.bool();
          const q2 = congruent ? q : q + rng.pick([-1, 1, 2]);
          if (q2 < 2) continue;
          const moves = [rng.pick(rigidMoves), pickTranslation(rng).move];
          const img = mapAll(moves, legTriangle(a, p, q2, sx, sy));
          if (!within([...tri, ...img]) || !apart(tri, img)) continue;
          const coords = (pts: readonly XY[], names: string) => pts.map((v, i) => `$${names[i]}${pl(v)}$`);
          const [ca, cd] = [coords(tri, "ABC"), coords(img, "DEF")];
          const solution = congruent
            ? t(
                `${cap(sequenceName(moves).en)}, maps $A$ to $D$, $B$ to $E$ and $C$ to $F$. A sequence of rigid motions maps $\\triangle ABC$ onto $\\triangle DEF$, so the triangles are congruent.`,
                `先作${sequenceName(moves)["zh-CN"]}，就把 $A$ 映到 $D$，$B$ 映到 $E$，$C$ 映到 $F$。一串刚体运动把 $\\triangle ABC$ 映到 $\\triangle DEF$ 上，所以这两个三角形全等。`,
              )
            : t(
                `Both are right triangles with legs along the grid. The legs of $\\triangle ABC$ have lengths $AB = ${p}$ and $AC = ${q}$; the legs of $\\triangle DEF$ have lengths $DE = ${p}$ and $DF = ${q2}$. Rigid motions keep lengths, so no sequence of them maps one triangle onto the other: they are not congruent.`,
                `两个都是直角边沿网格线的直角三角形。$\\triangle ABC$ 的直角边长 $AB = ${p}$，$AC = ${q}$；$\\triangle DEF$ 的直角边长 $DE = ${p}$，$DF = ${q2}$。刚体运动保持长度，所以没有一串刚体运动能把一个三角形映到另一个上：它们不全等。`,
              );
          const shownLeg = congruent ? q + 1 : q2;
          return {
            ...verdictChoice(rng, {
              prompt: t(
                `Triangle $ABC$ has vertices ${ca.join(", ")} and triangle $DEF$ has vertices ${cd.join(", ")}. Is there a sequence of rigid motions that maps $\\triangle ABC$ onto $\\triangle DEF$?`,
                `三角形 $ABC$ 的顶点是 ${ca.join("，")}，三角形 $DEF$ 的顶点是 ${cd.join("，")}。是否有一串刚体运动把 $\\triangle ABC$ 映到 $\\triangle DEF$ 上？`,
              ),
              holds: congruent,
              yes: t(`the legs of both triangles have lengths $${p}$ and $${q}$`, `两个三角形的直角边长都是 $${p}$ 和 $${q}$`),
              no: t(
                `the legs have lengths $${p}$ and $${q}$ in one triangle but $${p}$ and $${shownLeg}$ in the other`,
                `一个三角形的直角边长是 $${p}$ 和 $${q}$，另一个却是 $${p}$ 和 $${shownLeg}$`,
              ),
              yesWrong: t("both are right triangles", "两个都是直角三角形"),
              noWrong: t("the triangles are in different positions on the grid", "两个三角形在网格上的位置不同"),
              solution: solution,
            }),
            figure: graph(
              [...polygonMarks(tri, ABC, false), ...polygonMarks(img, ["D", "E", "F"])],
              "Triangles ABC and DEF on a coordinate grid.",
              "坐标网格上的三角形 ABC 和 DEF。",
            ),
          };
        }
      },
    },
    {
      id: "using-a-congruence-statement",
      title: t("Using a congruence statement", "运用全等式"),
      explanation: t(
        "In a congruence statement such as $\\triangle ABC \\cong \\triangle QRP$, letters in the same position correspond: $A \\leftrightarrow Q$, $B \\leftrightarrow R$, $C \\leftrightarrow P$. So $\\overline{AB}$ corresponds to $\\overline{QR}$, $\\overline{BC}$ to $\\overline{RP}$, and $\\angle C$ to $\\angle P$.\n\nIf $AB = 2x + 3$ and the sides of $\\triangle QRP$ are $PQ = 9$, $QR = 15$ and $RP = 11$, then $AB = QR$:\n\n$$2x + 3 = 15, \\quad 2x = 12, \\quad x = 6.$$",
        "在 $\\triangle ABC \\cong \\triangle QRP$ 这样的全等式中，位置相同的字母相对应：$A \\leftrightarrow Q$，$B \\leftrightarrow R$，$C \\leftrightarrow P$。所以 $\\overline{AB}$ 对应 $\\overline{QR}$，$\\overline{BC}$ 对应 $\\overline{RP}$，$\\angle C$ 对应 $\\angle P$。\n\n若 $AB = 2x + 3$，$\\triangle QRP$ 的三边是 $PQ = 9$，$QR = 15$，$RP = 11$，则 $AB = QR$：\n\n$$2x + 3 = 15, \\quad 2x = 12, \\quad x = 6$$",
      ),
      generate(rng) {
        const letters = rng.pick(imageLetters);
        const perm = rng.shuffle([0, 1, 2]);
        const img = (i: number) => letters[perm[i]!]!;
        const statement = `\\triangle ABC \\cong \\triangle ${img(0)}${img(1)}${img(2)}`;
        const pre = (letter: string) => perm.indexOf(letters.indexOf(letter));
        const c = rng.int(2, 5);
        const x = rng.int(2, Math.min(9, Math.floor(30 / c)));
        if (rng.bool()) {
          const pairs = [
            [0, 1],
            [1, 2],
            [2, 0],
          ] as const;
          const k = rng.int(0, 2);
          let sides: number[];
          do sides = distinctInts(rng, 3, 5, 30);
          while (2 * Math.max(...sides) >= sides[0]! + sides[1]! + sides[2]! || sides[k]! - c * x === 0 || sides[k]! - c * x < -9);
          const d = sides[k]! - c * x;
          const [i, j] = pairs[k]!;
          const side = (u: number, w: number) => sides[pairs.findIndex(([p, q]) => (p === u && q === w) || (p === w && q === u))]!;
          const listed = [0, 1, 2].map((n) => {
            const [u, w] = [letters[n]!, letters[(n + 1) % 3]!];
            return { name: `${u}${w}`, value: side(pre(u), pre(w)) };
          });
          const target = [img(i), img(j)];
          const match = listed.find((s) => target.includes(s.name[0]!) && target.includes(s.name[1]!))!;
          const list = listed.map((s) => `$${s.name} = ${s.value}$`);
          return numberProblem({
            prompt: t(
              `$${statement}$. In $\\triangle ABC$, $${ABC[i]}${ABC[j]} = ${linear(c, d)}$. The sides of $\\triangle ${letters}$ are ${list.slice(0, 2).join(", ")} and ${list[2]}. Find $x$.`,
              `$${statement}$。在 $\\triangle ABC$ 中，$${ABC[i]}${ABC[j]} = ${linear(c, d)}$。$\\triangle ${letters}$ 的三边是 ${list.join("，")}。求 $x$。`,
            ),
            answer: x,
            wrong: listed.filter((s) => s !== match).map((s) => Q.of(s.value - d, c)),
            solution: t(
              `In the congruence statement, $${ABC[i]}$ corresponds to $${img(i)}$ and $${ABC[j]}$ to $${img(j)}$, so $${ABC[i]}${ABC[j]} = ${match.name} = ${match.value}$:${solveSteps(c, d, match.value)}`,
              `在全等式中，$${ABC[i]}$ 对应 $${img(i)}$，$${ABC[j]}$ 对应 $${img(j)}$，所以 $${ABC[i]}${ABC[j]} = ${match.name} = ${match.value}$：${solveSteps(c, d, match.value)}`,
            ),
          });
        }
        const k = rng.int(0, 2);
        let angles: number[];
        do {
          const [p, q] = [rng.int(30, 95), rng.int(30, 95)];
          angles = [p, q, 180 - p - q];
        } while (new Set(angles).size < 3 || angles[2]! < 30 || angles[k]! - c * x === 0 || angles[k]! - c * x < -20);
        const d = angles[k]! - c * x;
        const listed = [0, 1, 2].map((n) => ({ name: letters[n]!, value: angles[pre(letters[n]!)]! }));
        const match = listed.find((a) => a.name === img(k))!;
        const list = listed.map((a) => `$m\\angle ${a.name} = ${a.value}^\\circ$`);
        return numberProblem({
          prompt: t(
            `$${statement}$. In $\\triangle ABC$, $m\\angle ${ABC[k]} = (${linear(c, d)})^\\circ$. The angles of $\\triangle ${letters}$ are ${list.slice(0, 2).join(", ")} and ${list[2]}. Find $x$.`,
            `$${statement}$。在 $\\triangle ABC$ 中，$m\\angle ${ABC[k]} = (${linear(c, d)})^\\circ$。$\\triangle ${letters}$ 的三个角是 ${list.join("，")}。求 $x$。`,
          ),
          answer: x,
          wrong: listed.filter((a) => a !== match).map((a) => Q.of(a.value - d, c)),
          solution: t(
            `In the congruence statement, $${ABC[k]}$ corresponds to $${img(k)}$, so $m\\angle ${ABC[k]} = m\\angle ${img(k)} = ${match.value}^\\circ$:${solveSteps(c, d, match.value)}`,
            `在全等式中，$${ABC[k]}$ 对应 $${img(k)}$，所以 $m\\angle ${ABC[k]} = m\\angle ${img(k)} = ${match.value}^\\circ$：${solveSteps(c, d, match.value)}`,
          ),
        });
      },
    },
    {
      id: "finding-the-sequence",
      title: t("Finding the sequence", "找出变换序列"),
      explanation: t(
        "To find a sequence of rigid motions that maps one figure onto another, follow one vertex at a time. A candidate sequence works only if it sends **every** vertex to its image.\n\nFor example, if $A(1, 2)$ maps to $A'(-4, 3)$, then rotating $90^\\circ$ counterclockwise about the origin gives $(-2, 1)$, and the translation $(x, y) \\to (x - 2, y + 2)$ finishes the job. Check $B$ and $C$ the same way before deciding.",
        "要找出把一个图形映到另一个图形上的刚体运动序列，就一次跟踪一个顶点。只有把**每个**顶点都映到它的像，这个序列才可行。\n\n例如，若 $A(1, 2)$ 映到 $A'(-4, 3)$，先绕原点逆时针旋转 $90^\\circ$ 得 $(-2, 1)$，再按 $(x, y) \\to (x - 2, y + 2)$ 平移就到达了。作出判断前，还要用同样的方法检验 $B$ 和 $C$。",
      ),
      generate(rng) {
        for (;;) {
          const tri = pickTriangle(rng, -4, 4);
          const rigid = rng.pick(rigidMoves);
          const { move: tr, h, v } = pickTranslation(rng);
          const correct = [rigid, tr];
          const img = mapAll(correct, tri);
          if (!within(img, 8) || !apart(tri, img)) continue;
          const others = rigidMoves.filter((m) => m !== rigid);
          const candidates: Move[][] = [
            [tr, rigid],
            [rigid, translation(-h, -v)],
            [rng.pick(others), tr],
            [rigid, translation(v, h)],
            [rng.pick(others), tr],
          ];
          const kept: Move[][] = [];
          for (const c of candidates) {
            const pts = mapAll(c, tri);
            if (![correct, ...kept].some((k) => sameList(mapAll(k, tri), pts))) kept.push(c);
          }
          if (kept.length < 3) continue;
          const coords = tri.map((p, i) => `$${ABC[i]}${pl(p)}$`).join(", ");
          const zhCoords = tri.map((p, i) => `$${ABC[i]}${pl(p)}$`).join("，");
          const tracks = tri.map((p, i) => {
            const mid = rigid.f(p);
            return `${ABC[i]}${pl(p)} \\to ${pl(mid)} \\to ${ABC[i]}'${pl(img[i]!)}`;
          });
          return pickChoice(
            rng,
            t(
              `Which sequence of rigid motions maps $\\triangle ABC$, with ${coords}, onto $\\triangle A'B'C'$?`,
              `哪一串刚体运动把 $\\triangle ABC$（${zhCoords}）映到 $\\triangle A'B'C'$ 上？`,
            ),
            sequenceOption(correct),
            kept.slice(0, 3).map((k) => sequenceOption(k)),
            t(
              `Follow each vertex through ${rigid.name.en}, then ${tr.name.en}:${steps(...tracks)}Every vertex lands on its image. Each of the other sequences sends at least one vertex somewhere else.`,
              `让每个顶点先经过${rigid.name["zh-CN"]}，再经过${tr.name["zh-CN"]}：${steps(...tracks)}每个顶点都落在它的像上。其他每个序列都至少把一个顶点映到别处。`,
            ),
            graph(
              [...polygonMarks(tri, ABC, false), ...polygonMarks(img, primed)],
              "Triangle ABC and its image A′B′C′ on a coordinate grid.",
              "坐标网格上的三角形 ABC 和它的像 A′B′C′。",
            ),
          );
        }
      },
    },
  ],
);

// ─── Using Similar Triangles to Explain Slope ───────────────────────────────

/** pickSlope picks a positive slope r/s in lowest terms between 1/2 and 2. */
function pickSlope(rng: Rng): [number, number] {
  for (;;) {
    const [r, s] = [rng.int(1, 5), rng.int(1, 5)];
    if (gcd(r, s) === 1 && r <= 2 * s && s <= 2 * r && !(r === 1 && s === 1)) return [r, s];
  }
}

/** slopeTriangle draws the slope triangle from p with the given run and rise, its legs labeled. */
function slopeTriangle(p: XY, run: number, rise: number, runText: string, riseText: string): Mark[] {
  const corner: XY = [p[0] + run, p[1]];
  const top: XY = [p[0] + run, p[1] + rise];
  return [
    { kind: "segment", a: p, b: corner, dashed: true },
    { kind: "segment", a: corner, b: top, dashed: true },
    { kind: "right", vertex: corner, from: p, to: top },
    { kind: "side", a: p, b: corner, text: runText },
    { kind: "side", a: corner, b: top, text: riseText },
  ];
}

const usingSimilarTrianglesToExplainSlope = topic(
  "using-similar-triangles-to-explain-slope",
  t("Using Similar Triangles to Explain Slope", "用相似三角形解释斜率"),
  t(
    "Explain with similar slope triangles why the slope of a line is the same between any two of its points, use this to find missing lengths and to test whether a point lies on a line, and derive the equations y = mx and y = mx + b.",
    "用相似的斜率三角形解释为什么直线上任意两点间的斜率都相同，用它求未知的长度、检验一个点是否在直线上，并推导方程 y = mx 和 y = mx + b。",
  ),
  ["the-aa-similarity-criterion", "slope-of-a-line"],
  ["8.EE.B.6"],
  [
    {
      id: "similar-slope-triangles",
      title: t("Similar slope triangles", "相似的斜率三角形"),
      explanation: t(
        "A **slope triangle** of a line has a horizontal leg (the run), a vertical leg (the rise), and its third side on the line.\n\nAny two slope triangles of the same line are **similar** by the angle-angle criterion: both have a right angle, and their angles where the line crosses the horizontal legs are corresponding angles of parallel lines, so they are equal. Corresponding sides of similar triangles are proportional, so every slope triangle has the same ratio $\\dfrac{\\text{rise}}{\\text{run}}$: the slope.\n\nIf one slope triangle has rise $4$ and run $6$, a slope triangle with run $9$ has rise $r$ with $\\dfrac{r}{9} = \\dfrac{4}{6}$, so $r = 6$.",
        "直线的**斜率三角形**有一条水平直角边（横向变化）、一条竖直直角边（纵向变化），第三条边在直线上。\n\n同一条直线的任意两个斜率三角形按角角判定**相似**：它们都有一个直角，而直线与两条水平直角边相交所成的角是平行线的同位角，所以相等。相似三角形的对应边成比例，所以每个斜率三角形的比 $\\dfrac{\\text{纵向变化}}{\\text{横向变化}}$ 都相同：这就是斜率。\n\n若一个斜率三角形的纵向变化是 $4$，横向变化是 $6$，那么横向变化为 $9$ 的斜率三角形的纵向变化 $r$ 满足 $\\dfrac{r}{9} = \\dfrac{4}{6}$，所以 $r = 6$。",
      ),
      generate(rng) {
        const [r, s] = pickSlope(rng);
        const [k1, k2] = rng.shuffle(rng.sample([1, 2, 3, 4], 2));
        const [run1, rise1, run2, rise2] = [s * k1!, r * k1!, s * k2!, r * k2!];
        const gap = s * Math.max(1, Math.round(4 / s));
        const p1: XY = [0, 0];
        const p2: XY = [run1 + gap, ((run1 + gap) * r) / s];
        const end: XY = [p2[0] + run2 + s, p2[1] + ((run2 + s) * r) / s];
        const start: XY = [-s, -r];
        const askRun = rng.bool();
        const answer = askRun ? run2 : rise2;
        const given = askRun ? rise2 : run2;
        return {
          ...numberProblem({
            prompt: t(
              `Both triangles are slope triangles of the same line. One of them has a rise of $${rise1}$ and a run of $${run1}$. The other has a ${askRun ? `rise of $${given}$` : `run of $${given}$`}. Find its ${askRun ? "run" : "rise"}.`,
              `两个三角形都是同一条直线的斜率三角形。其中一个的纵向变化是 $${rise1}$，横向变化是 $${run1}$。另一个的${askRun ? `纵向变化是 $${given}$` : `横向变化是 $${given}$`}。求它的${askRun ? "横向变化" : "纵向变化"}。`,
            ),
            answer,
            wrong: askRun
              ? [Q.of(given * rise1, run1), given + run1 - rise1, Q.of(given * run1 * run1, rise1 * rise1)]
              : [Q.of(given * run1, rise1), given + rise1 - run1, Q.of(given * rise1 * rise1, run1 * run1)],
            solution: t(
              `The slope triangles are similar, so their rise-to-run ratios are equal:${steps(askRun ? `\\frac{${given}}{\\text{run}} = \\frac{${rise1}}{${run1}}` : `\\frac{\\text{rise}}{${given}} = \\frac{${rise1}}{${run1}}`, askRun ? `\\text{run} = ${given} \\cdot \\frac{${run1}}{${rise1}} = ${answer}` : `\\text{rise} = ${given} \\cdot \\frac{${rise1}}{${run1}} = ${answer}`)}`,
              `两个斜率三角形相似，所以纵向变化与横向变化之比相等：${steps(askRun ? `\\frac{${given}}{\\text{横向变化}} = \\frac{${rise1}}{${run1}}` : `\\frac{\\text{纵向变化}}{${given}} = \\frac{${rise1}}{${run1}}`, askRun ? `\\text{横向变化} = ${given} \\cdot \\frac{${run1}}{${rise1}} = ${answer}` : `\\text{纵向变化} = ${given} \\cdot \\frac{${rise1}}{${run1}} = ${answer}`)}`,
            ),
          }),
          figure: fig(
            [
              { kind: "segment", a: start, b: end, accent: true },
              ...slopeTriangle(p1, run1, rise1, `${run1}`, `${rise1}`),
              ...slopeTriangle(p2, run2, rise2, askRun ? "?" : `${run2}`, askRun ? `${rise2}` : "?"),
            ],
            "A line with two slope triangles, their legs labeled.",
            "一条直线和它的两个斜率三角形，直角边上标有长度。",
          ),
        };
      },
    },
    {
      id: "is-the-point-on-the-line",
      title: t("Is the point on the line?", "点在直线上吗？"),
      explanation: t(
        "Because all slope triangles of a line are similar, a point $C$ lies on the line through $A$ and $B$ exactly when the slope from $A$ to $C$ equals the slope from $A$ to $B$.\n\nThe line through $A(1, 2)$ and $B(4, 4)$ has slope $\\dfrac{4 - 2}{4 - 1} = \\dfrac{2}{3}$. For $C(10, 8)$, the slope from $A$ is $\\dfrac{8 - 2}{10 - 1} = \\dfrac{6}{9} = \\dfrac{2}{3}$, so $C$ is on the line. For $C(10, 9)$ it is $\\dfrac{7}{9}$, so $C$ is not.",
        "因为同一条直线的所有斜率三角形都相似，所以点 $C$ 在过 $A$、$B$ 的直线上，当且仅当从 $A$ 到 $C$ 的斜率等于从 $A$ 到 $B$ 的斜率。\n\n过 $A(1, 2)$ 和 $B(4, 4)$ 的直线的斜率是 $\\dfrac{4 - 2}{4 - 1} = \\dfrac{2}{3}$。对 $C(10, 8)$，从 $A$ 出发的斜率是 $\\dfrac{8 - 2}{10 - 1} = \\dfrac{6}{9} = \\dfrac{2}{3}$，所以 $C$ 在直线上。对 $C(10, 9)$，斜率是 $\\dfrac{7}{9}$，所以 $C$ 不在直线上。",
      ),
      generate(rng) {
        for (;;) {
          const r = rng.nonZero(-4, 4);
          const s = rng.int(1, 4);
          if (gcd(Math.abs(r), s) !== 1) continue;
          const a: XY = [rng.int(-5, 5), rng.int(-5, 5)];
          const b: XY = [a[0] + s, a[1] + r];
          const k = rng.int(2, 5);
          const onLine = rng.bool();
          const c: XY = [a[0] + k * s, a[1] + k * r + (onLine ? 0 : rng.pick([-1, 1]))];
          const m = Q.of(r, s);
          const mc = Q.of(c[1] - a[1], c[0] - a[0]);
          const frac = (p: XY) => `\\frac{${p[1]} - ${paren(a[1])}}{${p[0]} - ${paren(a[0])}}`;
          return yesNoProblem(
            t(
              `A line passes through $A${pl(a)}$ and $B${pl(b)}$. Is the point $C${pl(c)}$ on the line?`,
              `一条直线经过 $A${pl(a)}$ 和 $B${pl(b)}$。点 $C${pl(c)}$ 在这条直线上吗？`,
            ),
            onLine,
            t(
              `Compare the slopes from $A$:${steps(`\\text{slope of } AB = ${frac(b)} = ${m.toLatex()}`, `\\text{slope of } AC = ${frac(c)} = ${mc.toLatex()}`)}${onLine ? "The slopes are equal, so the slope triangles from $A$ to $B$ and from $A$ to $C$ are similar and $C$ lies on the line." : "The slopes differ, so $C$ is not on the line."}`,
              `比较从 $A$ 出发的斜率：${steps(`AB \\text{ 的斜率} = ${frac(b)} = ${m.toLatex()}`, `AC \\text{ 的斜率} = ${frac(c)} = ${mc.toLatex()}`)}${onLine ? "两个斜率相等，所以从 $A$ 到 $B$ 和从 $A$ 到 $C$ 的斜率三角形相似，$C$ 在直线上。" : "两个斜率不同，所以 $C$ 不在直线上。"}`,
            ),
          );
        }
      },
    },
    {
      id: "deriving-the-equation-of-a-line",
      title: t("Deriving the equation of a line", "推导直线的方程"),
      explanation: t(
        "Slope triangles give the equation of a line.\n\n- For a line through the origin with slope $m$, any point $(x, y)$ on it makes a slope triangle from the origin with run $x$ and rise $y$. So $\\dfrac{y}{x} = m$, that is, $y = mx$.\n- For a line through $(0, b)$ with slope $m$, the slope triangle from $(0, b)$ to $(x, y)$ has run $x$ and rise $y - b$. So $\\dfrac{y - b}{x} = m$, that is, $y = mx + b$.\n\nThe line through $(0, 1)$ and $(4, 7)$ has slope $\\dfrac{7 - 1}{4} = \\dfrac{3}{2}$, so its equation is $y = \\dfrac{3}{2}x + 1$.",
        "斜率三角形可以给出直线的方程。\n\n- 对于过原点、斜率为 $m$ 的直线，其上任意一点 $(x, y)$ 与原点构成一个斜率三角形，横向变化为 $x$，纵向变化为 $y$。所以 $\\dfrac{y}{x} = m$，即 $y = mx$。\n- 对于过 $(0, b)$、斜率为 $m$ 的直线，从 $(0, b)$ 到 $(x, y)$ 的斜率三角形横向变化为 $x$，纵向变化为 $y - b$。所以 $\\dfrac{y - b}{x} = m$，即 $y = mx + b$。\n\n过 $(0, 1)$ 和 $(4, 7)$ 的直线的斜率是 $\\dfrac{7 - 1}{4} = \\dfrac{3}{2}$，所以它的方程是 $y = \\dfrac{3}{2}x + 1$。",
      ),
      generate(rng) {
        const b = rng.bool() ? 0 : rng.nonZero(-6, 6);
        const run = rng.int(2, 6);
        let rise = 0;
        do rise = rng.nonZero(-9, 9);
        while (Math.abs(rise) === run);
        const m = Q.of(rise, run);
        const p: XY = [run, b + rise];
        const answer = `y = ${linear(m, b)}`;
        const start = b === 0 ? t("the origin", "原点") : t(`$${pl([0, b])}$`, ` $${pl([0, b])}$ `);
        return equationProblem({
          prompt: t(
            `A line passes through ${start.en} and $${pl(p)}$. Use a slope triangle to write its equation in slope-intercept form.`,
            `一条直线经过${start["zh-CN"]}和 $${pl(p)}$。用斜率三角形写出它的斜截式方程。`,
          ),
          answer,
          form: "slope-intercept",
          wrong: [`y = ${linear(Q.of(run, rise), b)}`, `y = ${linear(Q.of(b + rise, run), b)}`, `y = ${linear(m, -b)}`],
          solution: t(
            `The slope triangle from $${pl([0, b])}$ to $${pl(p)}$ has run $${run}$ and rise $${b + rise} - ${paren(b)} = ${rise}$, so the slope is $m = ${m.toLatex()}$. Every point $(x, y)$ on the line gives a similar slope triangle from $${pl([0, b])}$, with $\\dfrac{y - ${paren(b)}}{x} = ${m.toLatex()}$:${steps(answer)}`,
            `从 $${pl([0, b])}$ 到 $${pl(p)}$ 的斜率三角形横向变化为 $${run}$，纵向变化为 $${b + rise} - ${paren(b)} = ${rise}$，所以斜率 $m = ${m.toLatex()}$。直线上的每个点 $(x, y)$ 都与 $${pl([0, b])}$ 构成一个相似的斜率三角形，$\\dfrac{y - ${paren(b)}}{x} = ${m.toLatex()}$：${steps(answer)}`,
          ),
        });
      },
    },
  ],
);

// ─── Describing a Sequence of Transformations ──────────────────────────────

/** dilation is the dilation about the origin with scale factor k. */
const dilation = (k: Q): Move => ({
  f: ([x, y]) => [k.mul(Q.of(x)).toNumber(), k.mul(Q.of(y)).toNumber()],
  inv: ([x, y]) => [Q.of(x).div(k).toNumber(), Q.of(y).div(k).toNumber()],
  name: t(`the dilation about the origin with scale factor $${k.toLatex()}$`, `以原点为中心、比例因子为 $${k.toLatex()}$ 的位似`),
  kind: "dilation",
});

/** scales are scale factors n/d with small n and d. */
const scales: readonly (readonly [number, number])[] = [
  [2, 1],
  [3, 1],
  [1, 2],
  [3, 2],
  [1, 3],
  [2, 3],
];

/** pickSimilarPair picks a triangle with integer vertices and a dilation by n/d about the origin that keeps them integers. */
function pickSimilarPair(rng: Rng): { tri: XY[]; k: Q } {
  const [n, d] = rng.pick(scales);
  const lim = Math.max(n, d) === 3 ? 2 : 3;
  const base = pickTriangle(rng, -lim, lim);
  return { tri: base.map(([x, y]): XY => [d * x, d * y]), k: Q.of(n, d) };
}

const describingASequence = topic(
  "describing-a-sequence-of-transformations-that-maps-one-figure-onto-another",
  t("Describing a Sequence of Transformations That Maps One Figure Onto Another", "描述把一个图形映到另一个图形上的变换序列"),
  t(
    "Describe a dilation followed by a translation that maps one figure onto a similar one, find the translation from the coordinates, and undo the sequence.",
    "描述把一个图形映到与它相似的图形上的“先位似、再平移”的序列，由坐标求出平移，并还原这个序列。",
  ),
  ["similarity-transformations", "congruence-through-rigid-motions"],
  ["8.G.A.4"],
  [
    {
      id: "choosing-the-sequence",
      title: t("Choosing the sequence", "选出变换序列"),
      explanation: t(
        "Two figures are **similar** if a sequence of rigid motions and dilations maps one onto the other. To describe such a sequence:\n\n1. Compare corresponding lengths to find the **scale factor** $k = \\dfrac{A'B'}{AB}$.\n2. Dilate about the origin by $k$, which multiplies every coordinate by $k$.\n3. Find the translation that moves the dilated figure onto the image.\n\nIf $A(2, 4)$ and $B(6, 4)$ map to $A'(0, 1)$ and $B'(2, 1)$, then $k = \\dfrac{2}{4} = \\dfrac{1}{2}$. The dilation sends $A$ to $(1, 2)$, so the translation is $(x, y) \\to (x - 1, y - 1)$. Check the other vertices before deciding.",
        "如果一串刚体运动和位似能把一个图形映到另一个图形上，这两个图形就**相似**。要描述这样的序列：\n\n1. 比较对应的长度，求出**比例因子** $k = \\dfrac{A'B'}{AB}$。\n2. 以原点为中心、按 $k$ 作位似，把每个坐标乘以 $k$。\n3. 找出把位似后的图形移到像上的平移。\n\n若 $A(2, 4)$ 和 $B(6, 4)$ 映到 $A'(0, 1)$ 和 $B'(2, 1)$，则 $k = \\dfrac{2}{4} = \\dfrac{1}{2}$。位似把 $A$ 映到 $(1, 2)$，所以平移是 $(x, y) \\to (x - 1, y - 1)$。作出判断前，还要检验其他顶点。",
      ),
      generate(rng) {
        for (;;) {
          const { tri, k } = pickSimilarPair(rng);
          const { move: tr, h, v } = pickTranslation(rng);
          const dil = dilation(k);
          const correct = [dil, tr];
          const img = mapAll(correct, tri);
          if (!within([...tri, ...img], 8) || !apart(tri, img)) continue;
          const inverse = dilation(Q.one.div(k));
          const fix = inverse.f(tri[0]!);
          const candidates: Move[][] = [
            [tr, dil],
            [dil, translation(-h, -v)],
            ...(Number.isInteger(fix[0]) && Number.isInteger(fix[1])
              ? [[inverse, translation(img[0]![0] - fix[0], img[0]![1] - fix[1])]]
              : []),
            [dil, translation(v, h)],
          ];
          const kept: Move[][] = [];
          for (const c of candidates) {
            const pts = mapAll(c, tri);
            if (![correct, ...kept].some((m) => sameList(mapAll(m, tri), pts))) kept.push(c);
          }
          if (kept.length < 3) continue;
          const coords = tri.map((p, i) => `$${ABC[i]}${pl(p)}$`);
          const tracks = tri.map((p, i) => `${ABC[i]}${pl(p)} \\to ${pl(dil.f(p))} \\to ${ABC[i]}'${pl(img[i]!)}`);
          return pickChoice(
            rng,
            t(
              `Which sequence maps $\\triangle ABC$, with ${coords.join(", ")}, onto $\\triangle A'B'C'$?`,
              `哪一串变换把 $\\triangle ABC$（${coords.join("，")}）映到 $\\triangle A'B'C'$ 上？`,
            ),
            sequenceOption(correct),
            kept.slice(0, 3).map((m) => sequenceOption(m)),
            t(
              `Follow each vertex through ${dil.name.en}, then ${tr.name.en}:${steps(...tracks)}Every vertex lands on its image. Each of the other sequences sends at least one vertex somewhere else.`,
              `让每个顶点先经过${dil.name["zh-CN"]}，再经过${tr.name["zh-CN"]}：${steps(...tracks)}每个顶点都落在它的像上。其他每个序列都至少把一个顶点映到别处。`,
            ),
            graph(
              [...polygonMarks(tri, ABC, false), ...polygonMarks(img, primed)],
              "Triangle ABC and the similar triangle A′B′C′ on a coordinate grid.",
              "坐标网格上的三角形 ABC 和与它相似的三角形 A′B′C′。",
            ),
          );
        }
      },
    },
    {
      id: "finding-the-translation",
      title: t("Finding the translation", "求平移"),
      explanation: t(
        "When a dilation about the origin is followed by a translation $(x, y) \\to (x + a, y + b)$, find the scale factor first, then the translation:\n\n1. $k$ is the ratio of the change in a coordinate between two image points to the change between the preimage points.\n2. The dilation sends $A$ to $(kx_A, ky_A)$; the translation must carry this point to $A'$, so $a = x_{A'} - kx_A$ and $b = y_{A'} - ky_A$.\n\n$A(2, 1)$ and $B(4, 3)$ map to $A'(1, 5)$ and $B'(7, 11)$. Then $k = \\dfrac{7 - 1}{4 - 2} = 3$, the dilation sends $A$ to $(6, 3)$, and $(a, b) = (1 - 6, 5 - 3) = (-5, 2)$.",
        "当以原点为中心的位似之后接着平移 $(x, y) \\to (x + a, y + b)$ 时，先求比例因子，再求平移：\n\n1. $k$ 等于两个像点之间某个坐标的变化量与对应原像点之间这个坐标的变化量之比。\n2. 位似把 $A$ 映到 $(kx_A, ky_A)$；平移必须把这个点移到 $A'$，所以 $a = x_{A'} - kx_A$，$b = y_{A'} - ky_A$。\n\n$A(2, 1)$ 和 $B(4, 3)$ 映到 $A'(1, 5)$ 和 $B'(7, 11)$。则 $k = \\dfrac{7 - 1}{4 - 2} = 3$，位似把 $A$ 映到 $(6, 3)$，$(a, b) = (1 - 6, 5 - 3) = (-5, 2)$。",
      ),
      generate(rng) {
        for (;;) {
          const [n, d] = rng.pick(scales);
          const k = Q.of(n, d);
          const a: XY = [d * rng.int(-4, 4), d * rng.int(-4, 4)];
          const b: XY = [a[0] + d * rng.nonZero(-3, 3), a[1] + d * rng.int(-3, 3)];
          const [h, v] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
          const dil = dilation(k);
          const [ka, kb] = [dil.f(a), dil.f(b)];
          const a2: XY = [ka[0] + h, ka[1] + v];
          const b2: XY = [kb[0] + h, kb[1] + v];
          if (same2(a, ka) || !within([a, b, a2, b2], 12)) continue;
          return pointProblem({
            prompt: t(
              `A dilation about the origin, followed by the translation $(x, y) \\to (x + a, y + b)$, maps $A${pl(a)}$ to $A'${pl(a2)}$ and $B${pl(b)}$ to $B'${pl(b2)}$. Find $(a, b)$.`,
              `以原点为中心的一次位似，接着平移 $(x, y) \\to (x + a, y + b)$，把 $A${pl(a)}$ 映到 $A'${pl(a2)}$，把 $B${pl(b)}$ 映到 $B'${pl(b2)}$。求 $(a, b)$。`,
            ),
            answer: [h, v],
            vars: ["a", "b"],
            wrong: [
              [a2[0] - a[0], a2[1] - a[1]],
              [ka[0] - a2[0], ka[1] - a2[1]],
              [Q.of(a2[0]).sub(Q.of(a[0]).div(k)), Q.of(a2[1]).sub(Q.of(a[1]).div(k))],
            ],
            solution: t(
              `Find the scale factor from the $x$-coordinates:${steps(`k = \\frac{${b2[0]} - ${paren(a2[0])}}{${b[0]} - ${paren(a[0])}} = ${k.toLatex()}`)}The dilation sends $A$ to $${pl(ka)}$. The translation carries this point to $A'${pl(a2)}$:${steps(`a = ${a2[0]} - ${paren(ka[0])} = ${h}`, `b = ${a2[1]} - ${paren(ka[1])} = ${v}`)}`,
              `由 $x$ 坐标求比例因子：${steps(`k = \\frac{${b2[0]} - ${paren(a2[0])}}{${b[0]} - ${paren(a[0])}} = ${k.toLatex()}`)}位似把 $A$ 映到 $${pl(ka)}$。平移把这个点移到 $A'${pl(a2)}$：${steps(`a = ${a2[0]} - ${paren(ka[0])} = ${h}`, `b = ${a2[1]} - ${paren(ka[1])} = ${v}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "undoing-the-sequence",
      title: t("Undoing the sequence", "还原变换序列"),
      explanation: t(
        "To map the image back onto the original figure, undo the transformations **in reverse order**: undo the last one first.\n\n- A translation $(x, y) \\to (x + a, y + b)$ is undone by $(x, y) \\to (x - a, y - b)$.\n- A dilation about the origin with scale factor $k$ is undone by the dilation with scale factor $\\dfrac{1}{k}$.\n\nSo if a dilation with scale factor $3$ followed by $(x, y) \\to (x + 2, y - 5)$ maps $F$ onto $G$, then $(x, y) \\to (x - 2, y + 5)$ followed by a dilation with scale factor $\\dfrac{1}{3}$ maps $G$ back onto $F$.",
        "要把像映回原来的图形，就**按相反的顺序**还原各个变换：先还原最后一个。\n\n- 平移 $(x, y) \\to (x + a, y + b)$ 用 $(x, y) \\to (x - a, y - b)$ 还原。\n- 以原点为中心、比例因子为 $k$ 的位似，用比例因子为 $\\dfrac{1}{k}$ 的位似还原。\n\n所以，若比例因子为 $3$ 的位似接着 $(x, y) \\to (x + 2, y - 5)$ 把 $F$ 映到 $G$ 上，那么先按 $(x, y) \\to (x - 2, y + 5)$ 平移、再作比例因子为 $\\dfrac{1}{3}$ 的位似，就把 $G$ 映回 $F$。",
      ),
      generate(rng) {
        const [n, d] = rng.pick(scales);
        const k = Q.of(n, d);
        const { move: tr, h, v } = pickTranslation(rng);
        const [dil, inverse] = [dilation(k), dilation(Q.one.div(k))];
        const back = translation(-h, -v);
        const figures = rng.pick([
          ["F", "G"],
          ["P", "Q"],
          ["\\mathcal{A}", "\\mathcal{B}"],
        ]);
        return pickChoice(
          rng,
          t(
            `${cap(sequenceName([dil, tr]).en)}, maps figure $${figures[0]}$ onto figure $${figures[1]}$. Which sequence maps $${figures[1]}$ back onto $${figures[0]}$?`,
            `先作${sequenceName([dil, tr])["zh-CN"]}，把图形 $${figures[0]}$ 映到图形 $${figures[1]}$ 上。哪一串变换把 $${figures[1]}$ 映回 $${figures[0]}$？`,
          ),
          sequenceOption([back, inverse]),
          [sequenceOption([inverse, back]), sequenceOption([back, dil]), sequenceOption([tr, inverse])],
          t(
            `Undo the transformations in reverse order. The translation came last, so undo it first with $${rule(-h, -v)}$; then undo the dilation with scale factor $${k.toLatex()}$ by the dilation with scale factor $${Q.one.div(k).toLatex()}$.`,
            `按相反的顺序还原各个变换。平移是最后作的，所以先用 $${rule(-h, -v)}$ 还原它；再用比例因子为 $${Q.one.div(k).toLatex()}$ 的位似还原比例因子为 $${k.toLatex()}$ 的位似。`,
          ),
        );
      },
    },
  ],
);

/** grade8TransformationTopics are the 8th grade topics on rigid motions, congruence, similarity and slope triangles. */
export const grade8TransformationTopics: readonly TopicDef[] = [
  verifyingPropertiesOfRigidMotions,
  applyingSequencesOfRigidMotions,
  congruenceThroughRigidMotions,
  usingSimilarTrianglesToExplainSlope,
  describingASequence,
];
