import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, gcd, linear, type Mark, type PlaneMark, type PlaneView, plane, Q, sketch } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";
import { annotate, at, graphFigure, riseRun, stagedPolygon, tracked, trail } from "../graph-figures.ts";
import { viewAround } from "../motion-figures.ts";
import { equationProblem, pointLatex, pointProblem, withMistakes } from "../problems.ts";
import { type Pair, type Walk, type Wrong, walkThrough } from "./early-grades-more-kit.ts";
import { pickTriangle, polygonMarks } from "./geometry-proof-congruence-similarity.ts";
import { applyAll, type Move, rigidMoves, same2, sequenceName, translation } from "./geometry-transformations.ts";
import { chosen, decided, drawn, type ExactSpot, lesson, located, type Off, type Said, valued, withIntro } from "./grade-6-kit.ts";

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

/** markedPoints lists the labeled points of a graph for its alt text. */
const markedPoints = (marks: readonly PlaneMark[]): string =>
  marks.flatMap((mark) => (mark.kind === "point" && mark.label ? [`${mark.label} (${mark.at[0]}, ${mark.at[1]})`] : [])).join(", ");

/** graph draws marks in the coordinate plane as a figure. */
const graph = (marks: readonly PlaneMark[], en: string, zh: string): Figure => ({
  svg: plane(view, marks),
  alt: markedPoints(marks) ? t(`${en} Marked points: ${markedPoints(marks)}.`, `${zh}标出的点：${markedPoints(marks)}。`) : t(en, zh),
});

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

/** slide describes a translation of a figure in words: "translated 3 units right and 2 units up". */
function slide(h: number, v: number): Text {
  const units = (n: number) => `${Math.abs(n)} unit${Math.abs(n) === 1 ? "" : "s"}`;
  return t(
    `translated ${units(h)} ${h > 0 ? "right" : "left"} and ${units(v)} ${v > 0 ? "up" : "down"}`,
    `向${h > 0 ? "右" : "左"}平移 ${Math.abs(h)} 个单位、再向${v > 0 ? "上" : "下"}平移 ${Math.abs(v)} 个单位`,
  );
}

/** rule writes the translation rule (x, y) → (x + h, y + v). */
const rule = (h: number, v: number) => `(x, y) \\to (${linear(1, h)}, ${linear(1, v, "y")})`;

/** distinctInts picks n distinct integers from lo to hi. */
const distinctInts = (rng: Rng, n: number, lo: number, hi: number) =>
  rng.sample(
    Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
    n,
  );

// ─── Verifying Properties of Rigid Motions ──────────────────────────────────

/** Motion is a rigid motion described in words, with statements about a quadrilateral's image that need not hold, each with its reason. */
interface Motion {
  readonly words: Text;
  readonly falses: (a: number, beta: number) => readonly Wrong[];
}

/** both writes a statement that reads the same in English and Chinese. */
const both = (s: string): Pair => [s, s];

const opposite: Pair = [
  "$A'$, $B'$, $C'$, $D'$ go around in the opposite direction to $A$, $B$, $C$, $D$",
  "$A'$、$B'$、$C'$、$D'$ 的环绕方向与 $A$、$B$、$C$、$D$ 相反",
];
const sameWay: Pair = [
  "$A'$, $B'$, $C'$, $D'$ go around in the same direction as $A$, $B$, $C$, $D$",
  "$A'$、$B'$、$C'$、$D'$ 的环绕方向与 $A$、$B$、$C$、$D$ 相同",
];
const parallelToAB = both("$\\overline{A'B'} \\parallel \\overline{AB}$");
const perpendicularToAB = both("$\\overline{A'B'} \\perp \\overline{AB}$");

/** keptTurn says why a rotation does not reverse the direction of the vertices. */
const keptTurn: Wrong = [
  opposite,
  "A rotation keeps the direction in which the vertices go around; only a reflection reverses it.",
  "旋转保持顶点的环绕方向，只有轴对称才把它反过来。",
];

/** supplement is the false statement that angle B′ is the supplement of angle B. */
const supplement = (beta: number): Wrong => [
  both(`$m\\angle B' = ${180 - beta}^\\circ$`),
  `That is the supplement of $${beta}^\\circ$; a rigid motion keeps $m\\angle B' = ${beta}^\\circ$.`,
  `这是 $${beta}^\\circ$ 的补角；刚体运动保持 $m\\angle B' = ${beta}^\\circ$。`,
];

/** pickMotion picks a rigid motion of a quadrilateral and the false statements typical of it. */
function pickMotion(rng: Rng): Motion {
  switch (rng.int(0, 3)) {
    case 0: {
      const [h, v] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
      return {
        words: slide(h, v),
        falses: (a, beta) => [
          [
            both(`$A'B' = ${a + Math.abs(h)}$`),
            `A translation slides the segment without stretching it, so $A'B'$ stays $${a}$.`,
            `平移让线段滑动而不拉伸，所以 $A'B'$ 仍是 $${a}$。`,
          ],
          [
            perpendicularToAB,
            "A translation does not turn segments, so $\\overline{A'B'}$ is parallel to $\\overline{AB}$, not perpendicular.",
            "平移不转动线段，所以 $\\overline{A'B'}$ 与 $\\overline{AB}$ 平行，而不是垂直。",
          ],
          [
            opposite,
            "A translation keeps the direction in which the vertices go around; only a reflection reverses it.",
            "平移保持顶点的环绕方向，只有轴对称才把它反过来。",
          ],
          supplement(beta),
        ],
      };
    }
    case 1: {
      const axis = rng.pick(["x", "y"]);
      return {
        words: t(`reflected across the $${axis}$-axis`, `关于 $${axis}$ 轴作轴对称`),
        falses: (_, beta) => [
          [
            sameWay,
            "A reflection flips the figure, so the vertices go around the opposite way.",
            "轴对称把图形翻了过来，所以顶点的环绕方向相反。",
          ],
          [
            parallelToAB,
            "A reflection tilts $\\overline{AB}$ the other way unless it is horizontal or vertical, so this need not hold.",
            "除非 $\\overline{AB}$ 是水平或竖直的，轴对称会让它向另一边倾斜，所以这不一定成立。",
          ],
          supplement(beta),
        ],
      };
    }
    case 2: {
      const ccw = rng.bool();
      return {
        words: t(
          `rotated $90^\\circ$ ${ccw ? "counterclockwise" : "clockwise"} about the origin`,
          `绕原点${ccw ? "逆" : "顺"}时针旋转 $90^\\circ$`,
        ),
        falses: (_, beta) => [
          [
            parallelToAB,
            "A $90^\\circ$ rotation turns every segment a quarter turn, so $\\overline{A'B'}$ is perpendicular to $\\overline{AB}$.",
            "旋转 $90^\\circ$ 让每条线段转四分之一圈，所以 $\\overline{A'B'}$ 与 $\\overline{AB}$ 垂直。",
          ],
          keptTurn,
          beta + 90 < 180
            ? [
                both(`$m\\angle B' = ${beta + 90}^\\circ$`),
                `The figure turns $90^\\circ$, but the angle between its sides does not grow: $m\\angle B'$ stays $${beta}^\\circ$.`,
                `图形转了 $90^\\circ$，但两边的夹角并不变大：$m\\angle B'$ 仍是 $${beta}^\\circ$。`,
              ]
            : supplement(beta),
        ],
      };
    }
    default:
      return {
        words: t("rotated $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$"),
        falses: (_, beta) => [
          [
            perpendicularToAB,
            "A $180^\\circ$ rotation turns $\\overline{AB}$ into a parallel segment, not a perpendicular one.",
            "旋转 $180^\\circ$ 把 $\\overline{AB}$ 变成与它平行的线段，而不是垂直的线段。",
          ],
          keptTurn,
          supplement(beta),
        ],
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

/** pairOf turns a Text into the pair of its English and Chinese. */
const pairOf = (x: Text): Pair => [x.en, x["zh-CN"]];

/** zhName is the Chinese name of a move. */
const zhName = (m: Move) => m.name["zh-CN"];

/** seqPair writes a sequence of transformations as a choice option. */
const seqPair = (moves: readonly Move[]): Pair => pairOf(sequenceOption(moves));

/** unique keeps the first wrong option with each English text and drops any equal to the correct one. */
const unique = (correct: Pair, wrong: readonly Wrong[]): Wrong[] =>
  wrong.filter(([o], i) => o[0] !== correct[0] && wrong.findIndex(([w]) => w[0] === o[0]) === i);

/** solveLines writes the lines of solving cx + d = v. */
function solveLines(c: number, d: number, v: number): string[] {
  const lines = [`${linear(c, d)} = ${v}`];
  if (d !== 0) lines.push(`${linear(c, 0)} = ${v - d}`);
  if (c !== 1) lines.push(`x = ${Q.of(v - d, c).toLatex()}`);
  return lines;
}

/** locatedAs asks for a pair of numbers written as a point in the given variables, works it in labelled steps with a check, and answers each distinct wrong pair with its reason. */
function locatedAs(
  prompt: Pair,
  answer: readonly Coefficient[],
  vars: readonly [string, string],
  walk: readonly Walk[],
  check: Pair,
  spots: readonly ExactSpot[],
): Problem {
  const kept = spots.filter(([p], i) => pl(p) !== pl(answer) && spots.findIndex(([w]) => pl(w) === pl(p)) === i);
  const problem = pointProblem({
    prompt: t(prompt[0], prompt[1]),
    answer: [...answer],
    vars,
    wrong: kept.map(([p]) => [...p]),
    solution: walkThrough(walk, check),
  });
  return withMistakes(
    problem,
    kept.map(([p, en, zh]) => ({ response: pl(p), why: t(en, zh) })),
  );
}

/** equated asks for the equation of a line in slope-intercept form, works it in labelled steps with a check, and answers each wrong equation the checker rejects with its reason. */
function equated(prompt: Pair, answer: string, walk: readonly Walk[], check: Pair, saids: readonly Said[]): Problem {
  const problem = equationProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "slope-intercept",
    wrong: saids.map(([response]) => response),
    solution: walkThrough(walk, check),
  });
  const listed = saids.filter(([response], i) => problem.wrong?.includes(response) && saids.findIndex(([r]) => r === response) === i);
  return withMistakes(
    problem,
    listed.map(([response, en, zh]) => ({ response, why: t(en, zh) })),
  );
}

const verifyingPropertiesOfRigidMotions = withIntro(
  topic(
    "verifying-properties-of-rigid-motions",
    t("Verifying Properties of Rigid Motions", "验证刚体运动的性质"),
    t(
      "Use the facts that rigid motions keep lengths, angle measures and parallel lines, match each part of a figure with its image, and tell which properties a particular motion keeps.",
      "利用刚体运动保持长度、角的度数和平行关系的性质，把图形的各部分与它们的像对应起来，并判断某种运动还保持哪些性质。",
    ),
    ["translations-of-geometric-figures", "reflections-in-the-coordinate-plane", "rotations-of-geometric-figures"],
    ["8.G.A.1"],
    [
      lesson(
        "corresponding-measures",
        ["Measures of the image", "像的度量"],
        [
          [
            "A **rigid motion** is a translation, a reflection, a rotation, or a sequence of them. It moves a figure without stretching or bending it: segments keep their **lengths**, angles keep their **measures**, and parallel lines stay parallel. To use this, match each part with its image. If a rigid motion maps $A$ to $Q$, $B$ to $R$ and $C$ to $P$, then $\\overline{AB}$ goes to $\\overline{QR}$. So $AB = 7$ gives $QR = 7$.",
            "**刚体运动**是平移、轴对称、旋转，或者它们的组合。它移动图形，但不拉伸也不弯折：线段保持**长度**，角保持**度数**，平行线仍然平行。运用时要先把每一部分和它的像对应起来。如果一次刚体运动把 $A$ 映到 $Q$，$B$ 映到 $R$，$C$ 映到 $P$，那么 $\\overline{AB}$ 变成 $\\overline{QR}$。所以由 $AB = 7$ 得 $QR = 7$。",
          ],
          [
            "In the same way $\\angle C$ goes to $\\angle P$, so $m\\angle C = 50^\\circ$ gives $m\\angle P = 50^\\circ$.",
            "同样，$\\angle C$ 变成 $\\angle P$，所以由 $m\\angle C = 50^\\circ$ 得 $m\\angle P = 50^\\circ$。",
          ],
          [
            "Match by the mapping, not by the alphabet. Here $A$ goes to $Q$, not to $P$, so $\\angle A$ matches $\\angle Q$.",
            "要按映射来对应，而不是按字母表的顺序。这里 $A$ 映到 $Q$ 而不是 $P$，所以 $\\angle A$ 对应 $\\angle Q$。",
          ],
        ],
        (rng) => {
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
          const match: Walk = [
            ["Match the parts", "找出对应部分"],
            [
              `$${img(0)}$ is the image of $A$, $${img(1)}$ of $B$ and $${img(2)}$ of $C$.`,
              `$${img(0)}$ 是 $A$ 的像，$${img(1)}$ 是 $B$ 的像，$${img(2)}$ 是 $C$ 的像。`,
            ],
          ];
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
            const named = (n: number) => `${ABC[pairs[n]![0]]}${ABC[pairs[n]![1]]}`;
            const asked = [img(i), img(j)].sort((p, q) => letters.indexOf(p) - letters.indexOf(q)).join("");
            const given = pairs.map((_, n) => `${named(n)} = ${sides[n]}`);
            const offs: Off[] = [];
            sides.forEach((v, n) => {
              if (n !== k)
                offs.push([v, `That is $${named(n)}$, whose image is a different side.`, `这是 $${named(n)}$ 的长度，它的像是另一条边。`]);
            });
            return valued(
              [
                `In triangle $ABC$, $${given[0]}$, $${given[1]}$ and $${given[2]}$. ${mapping.en} Find $${asked}$.`,
                `在三角形 $ABC$ 中，$${given[0]}$，$${given[1]}$，$${given[2]}$。${mapping["zh-CN"]}求 $${asked}$。`,
              ],
              sides[k]!,
              [
                match,
                [
                  ["Use the kept length", "利用保持的长度"],
                  [
                    `So $\\overline{${asked}}$ is the image of $\\overline{${named(k)}}$, and a rigid motion keeps lengths:`,
                    `所以 $\\overline{${asked}}$ 是 $\\overline{${named(k)}}$ 的像，而刚体运动保持长度：`,
                  ],
                  [`${asked} = ${named(k)} = ${sides[k]}`],
                ],
              ],
              [
                `The image triangle has the same three side lengths, ${sides.map((v) => `$${v}$`).join(", ")}, only under new names.`,
                `像三角形的三条边长仍是 ${sides.map((v) => `$${v}$`).join("、")}，只是换了名字。`,
              ],
              offs,
            );
          }
          let angles: number[];
          do angles = [rng.int(30, 85), rng.int(30, 85)];
          while (angles[0] === angles[1] || 180 - angles[0]! - angles[1]! < 25 || angles.includes(180 - angles[0]! - angles[1]!));
          angles.push(180 - angles[0]! - angles[1]!);
          const [alpha, beta, gamma] = angles as [number, number, number];
          const answer = angles[k]!;
          const use: Walk =
            k === 2
              ? [
                  ["Find the angle", "求角"],
                  [
                    `The angles of triangle $ABC$ add up to $180^\\circ$, and $\\angle ${img(2)}$ keeps the measure of $\\angle C$:`,
                    `三角形 $ABC$ 的内角和是 $180^\\circ$，而 $\\angle ${img(2)}$ 保持 $\\angle C$ 的度数：`,
                  ],
                  [`m\\angle ${img(2)} = m\\angle C = 180^\\circ - ${alpha}^\\circ - ${beta}^\\circ = ${gamma}^\\circ`],
                ]
              : [
                  ["Use the kept angle", "利用保持的角"],
                  [
                    `So $\\angle ${img(k)}$ is the image of $\\angle ${ABC[k]}$, and a rigid motion keeps angle measures:`,
                    `所以 $\\angle ${img(k)}$ 是 $\\angle ${ABC[k]}$ 的像，而刚体运动保持角的度数：`,
                  ],
                  [`m\\angle ${img(k)} = m\\angle ${ABC[k]} = ${answer}^\\circ`],
                ];
          const offs: Off[] = [
            [180 - answer, "That is the supplement; a rigid motion keeps the angle itself.", "这是它的补角；刚体运动保持角本身的度数。"],
          ];
          angles.forEach((v, n) => {
            if (n !== k)
              offs.push([
                v,
                `That is $m\\angle ${ABC[n]}$, which goes to $\\angle ${img(n)}$.`,
                `这是 $m\\angle ${ABC[n]}$，它对应的是 $\\angle ${img(n)}$。`,
              ]);
          });
          return valued(
            [
              `In triangle $ABC$, $m\\angle A = ${alpha}^\\circ$ and $m\\angle B = ${beta}^\\circ$. ${mapping.en} Find $m\\angle ${img(k)}$.`,
              `在三角形 $ABC$ 中，$m\\angle A = ${alpha}^\\circ$，$m\\angle B = ${beta}^\\circ$。${mapping["zh-CN"]}求 $m\\angle ${img(k)}$。`,
            ],
            answer,
            [match, use],
            [
              `The image has the angles $${alpha}^\\circ$, $${beta}^\\circ$ and $${gamma}^\\circ$ under new names, and they still add up to $180^\\circ$.`,
              `像的三个角仍是 $${alpha}^\\circ$、$${beta}^\\circ$、$${gamma}^\\circ$，只是换了名字，它们的和仍是 $180^\\circ$。`,
            ],
            offs,
            { unit: "°" },
          );
        },
        drawn(gradeDrawings5["verifying-properties-of-rigid-motions#corresponding-measures"]),
      ),
      lesson(
        "what-a-rigid-motion-keeps",
        ["What a rigid motion keeps", "刚体运动保持什么"],
        [
          [
            "Every rigid motion keeps lengths, angle measures and parallel lines. Other features depend on the motion. A **translation** slides each segment without turning it, so the image is parallel to the preimage. A $90^\\circ$ **rotation** turns each segment a quarter turn, so the image is perpendicular to it; a $180^\\circ$ rotation gives a parallel segment. A **reflection** flips the figure: if $A$, $B$, $C$, $D$ go around counterclockwise, then $A'$, $B'$, $C'$, $D'$ go around clockwise.",
            "每一种刚体运动都保持长度、角的度数和平行关系。其他特点取决于具体的运动。**平移**让每条线段滑动而不转动，所以像与原线段平行。旋转 $90^\\circ$ 让每条线段转四分之一圈，所以像与原线段垂直；旋转 $180^\\circ$ 得到与原线段平行的线段。**轴对称**把图形翻过来：如果 $A$、$B$、$C$、$D$ 按逆时针方向排列，那么 $A'$、$B'$、$C'$、$D'$ 按顺时针方向排列。",
          ],
          [
            "Translations and rotations keep the direction in which the vertices go around; only a reflection reverses it.",
            "平移和旋转都保持顶点的环绕方向，只有轴对称把它反过来。",
          ],
          [
            "An angle never changes its measure. If $m\\angle B = 70^\\circ$, then $m\\angle B' = 70^\\circ$, not $110^\\circ$ or $160^\\circ$.",
            "角的度数不会改变。若 $m\\angle B = 70^\\circ$，则 $m\\angle B' = 70^\\circ$，而不是 $110^\\circ$ 或 $160^\\circ$。",
          ],
        ],
        (rng) => {
          const a = rng.int(3, 12);
          const beta = rng.pick([...Array.from({ length: 31 }, (_, i) => 55 + i), ...Array.from({ length: 31 }, (_, i) => 95 + i)]);
          const motion = pickMotion(rng);
          const truths: Pair[] = [
            [`$A'B' = ${a}$`, `$A'B' = ${a}$`],
            [`$m\\angle B' = ${beta}^\\circ$`, `$m\\angle B' = ${beta}^\\circ$`],
            ["$\\overline{A'B'} \\parallel \\overline{D'C'}$", "$\\overline{A'B'} \\parallel \\overline{D'C'}$"],
          ];
          const k = rng.int(0, 2);
          const reasons: Pair[] = [
            [`A rigid motion keeps lengths, so $A'B' = AB = ${a}$.`, `刚体运动保持长度，所以 $A'B' = AB = ${a}$。`],
            [
              `A rigid motion keeps angle measures, so $m\\angle B' = m\\angle B = ${beta}^\\circ$.`,
              `刚体运动保持角的度数，所以 $m\\angle B' = m\\angle B = ${beta}^\\circ$。`,
            ],
            [
              "A rigid motion takes parallel lines to parallel lines, so $\\overline{A'B'} \\parallel \\overline{D'C'}$.",
              "刚体运动把平行线变成平行线，所以 $\\overline{A'B'} \\parallel \\overline{D'C'}$。",
            ],
          ];
          return chosen(
            rng,
            [
              `Quadrilateral $ABCD$ has $AB = ${a}$, $m\\angle B = ${beta}^\\circ$ and $\\overline{AB} \\parallel \\overline{DC}$. It is ${motion.words.en} to give quadrilateral $A'B'C'D'$. Which statement must be true?`,
              `四边形 $ABCD$ 中，$AB = ${a}$，$m\\angle B = ${beta}^\\circ$，$\\overline{AB} \\parallel \\overline{DC}$。把它${motion.words["zh-CN"]}，得到四边形 $A'B'C'D'$。哪个说法一定成立？`,
            ],
            truths[k]!,
            rng.shuffle([...motion.falses(a, beta)]).slice(0, 3),
            [
              [
                ["Recall what is kept", "回顾保持的性质"],
                ["Every rigid motion keeps lengths, angle measures and parallel lines.", "每一种刚体运动都保持长度、角的度数和平行关系。"],
              ],
              [["Apply it", "应用"], reasons[k]!],
            ],
            [
              "This statement holds for every rigid motion; each of the others depends on the particular motion or is false.",
              "这个说法对每一种刚体运动都成立；其他说法要么取决于具体的运动，要么不成立。",
            ],
          );
        },
        drawn(gradeDrawings5["verifying-properties-of-rigid-motions#what-a-rigid-motion-keeps"]),
      ),
      lesson(
        "keeping-lengths-on-the-grid",
        ["Keeping lengths on the grid", "在网格上保持长度"],
        [
          [
            "The length of a horizontal segment is the difference of the $x$-coordinates of its endpoints; for a vertical segment, use the $y$-coordinates. A rigid motion maps $A(2, 1)$ and $B(2, 6)$ to $A'(-3, 4)$ and $B'$, where $B'$ is directly to the right of $A'$. Since $AB = 6 - 1 = 5$, $B'$ is $5$ units right of $A'$: $B' = (-3 + 5, 4) = (2, 4)$.",
            "水平线段的长度等于两个端点的 $x$ 坐标之差；竖直线段用 $y$ 坐标之差。一次刚体运动把 $A(2, 1)$ 和 $B(2, 6)$ 映到 $A'(-3, 4)$ 和 $B'$，其中 $B'$ 在 $A'$ 的正右方。由于 $AB = 6 - 1 = 5$，$B'$ 在 $A'$ 右边 $5$ 个单位：$B' = (-3 + 5, 4) = (2, 4)$。",
          ],
          [
            "From $A'(-3, 4)$ to $B'(2, 4)$ the $x$-coordinate grows by $2 - (-3) = 5$, the length of $\\overline{AB}$.",
            "从 $A'(-3, 4)$ 到 $B'(2, 4)$，$x$ 坐标增加了 $2 - (-3) = 5$，正是 $\\overline{AB}$ 的长度。",
          ],
          [
            "Only the length is kept, not the direction. $\\overline{AB}$ is vertical, yet its image here is horizontal.",
            "保持不变的只是长度，而不是方向。$\\overline{AB}$ 是竖直的，而它的像在这里是水平的。",
          ],
        ],
        (rng) => {
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
            const problem = located(
              [
                `A rigid motion maps $\\overline{AB}$ onto $\\overline{A'B'}$, with $A${pl(a)}$, $B${pl(b)}$ and $A'${pl(a2)}$. The point $B'$ is ${to.words.en} $A'$. Find the coordinates of $B'$.`,
                `一次刚体运动把 $\\overline{AB}$ 映到 $\\overline{A'B'}$，其中 $A${pl(a)}$，$B${pl(b)}$，$A'${pl(a2)}$。点 $B'$ 在 $A'$ 的${to.words["zh-CN"]}。求 $B'$ 的坐标。`,
              ],
              b2,
              [
                [
                  ["Find the length", "求长度"],
                  [
                    horizontal
                      ? "$\\overline{AB}$ is horizontal, so subtract the $x$-coordinates:"
                      : "$\\overline{AB}$ is vertical, so subtract the $y$-coordinates:",
                    horizontal
                      ? "$\\overline{AB}$ 是水平线段，所以把 $x$ 坐标相减："
                      : "$\\overline{AB}$ 是竖直线段，所以把 $y$ 坐标相减：",
                  ],
                  [`AB = ${hi} - ${paren(lo!)} = ${length}`],
                ],
                [
                  ["Step off the length", "量出长度"],
                  [
                    `A rigid motion keeps lengths, so $B'$ is $${length}$ units ${to.words.en.replace("directly ", "").replace("to the ", "")} $A'$:`,
                    `刚体运动保持长度，所以 $B'$ 在 $A'$ 的${to.words["zh-CN"]} $${length}$ 个单位处：`,
                  ],
                  [`B' = ${pl(b2)}`],
                ],
              ],
              [
                `From $A'${pl(a2)}$ to $B'${pl(b2)}$ one coordinate stays the same and the other changes by $${length}$, the length of $\\overline{AB}$.`,
                `从 $A'${pl(a2)}$ 到 $B'${pl(b2)}$，一个坐标不变，另一个变化了 $${length}$，正是 $\\overline{AB}$ 的长度。`,
              ],
              [
                [
                  along(a2, to.d, -length),
                  `That goes $${length}$ units the wrong way: $B'$ is ${to.words.en} $A'$.`,
                  `这是朝反方向走了 $${length}$ 个单位：$B'$ 在 $A'$ 的${to.words["zh-CN"]}。`,
                ],
                [
                  [a2[0] + b[0] - a[0], a2[1] + b[1] - a[1]],
                  "That moves $B$ the same way as $A$, as if the motion were a translation, but $\\overline{A'B'}$ points another way.",
                  "这是把 $B$ 按 $A$ 的方式平移了，但 $\\overline{A'B'}$ 的方向变了。",
                ],
                [
                  along(a2, to.d, length + 1),
                  `That counts the $${length + 1}$ grid points on $\\overline{AB}$ instead of the $${length}$ units between them.`,
                  `这是数了 $\\overline{AB}$ 上的 $${length + 1}$ 个格点，而不是它们之间的 $${length}$ 个单位。`,
                ],
              ],
              graph(
                [
                  { kind: "segment", a, b },
                  { kind: "point", at: a, label: "A", dir: "nw" },
                  { kind: "point", at: b, label: "B", dir: "nw" },
                  { kind: "point", at: a2, label: "A′", dir: "nw", accent: true },
                ],
                "Segment AB and the point A′ on a coordinate grid.",
                "坐标网格上的线段 AB 和点 A′。",
              ),
            );
            return annotate(
              problem,
              view,
              [
                { kind: "segment", a: a2, b: b2, tone: "result" },
                { kind: "point", at: b2, label: "B′", dir: "se", tone: "result" },
              ],
              `A′B′ has the same length as AB, ${length}, so B′ is ${at(b2)}.`,
              `A′B′ 与 AB 等长，都是 ${length}，所以 B′ 是 ${at(b2)}。`,
            );
          }
        },
        graph(
          [
            { kind: "segment", a: [2, 1], b: [2, 6] },
            { kind: "point", at: [2, 1], label: "A", dir: "e" },
            { kind: "point", at: [2, 6], label: "B", dir: "e" },
            { kind: "segment", a: [-3, 4], b: [2, 4], accent: true },
            { kind: "point", at: [-3, 4], label: "A′", dir: "nw", accent: true },
            { kind: "point", at: [2, 4], label: "B′", dir: "nw", accent: true },
          ],
          "A vertical segment AB of length 5 and its horizontal image A′B′, also of length 5.",
          "长为 5 的竖直线段 AB，和它的像，同样长为 5 的水平线段 A′B′。",
        ),
      ),
    ],
  ),
  [
    "A paper triangle with sides $3$ cm, $4$ cm and $5$ cm is peeled off a page, turned over and stuck back somewhere else. How long is its longest side now?",
    "一张边长为 $3$ 厘米、$4$ 厘米、$5$ 厘米的纸三角形从纸上揭下来，翻过来贴到别处。它最长的边现在有多长？",
  ],
  ["Still $5$ cm: moving and flipping the paper does not stretch it.", "仍然是 $5$ 厘米：移动和翻转纸片都不会把它拉长。"],
  [
    "use what rigid motions keep to find lengths and angles of an image, tell which properties a given motion keeps, and find points on the grid.",
    "利用刚体运动保持的性质求像的长度和角，判断某种运动还保持哪些性质，并在网格上求点。",
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

/** apply sends a point through a linear map. */
const apply = (m: Lin, p: XY): XY => [m[0] * p[0] + m[1] * p[1] + 0, m[2] * p[0] + m[3] * p[1] + 0];

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

const applyingSequencesOfRigidMotions = withIntro(
  topic(
    "applying-sequences-of-rigid-motions",
    t("Applying Sequences of Rigid Motions", "施行刚体运动的序列"),
    t(
      "Apply a sequence of translations, reflections and rotations to a figure in the coordinate plane, tell whether the order matters, and replace a sequence by a single motion.",
      "在坐标平面上对图形施行一串平移、轴对称和旋转，判断顺序是否重要，并用一个运动代替一串运动。",
    ),
    ["verifying-properties-of-rigid-motions"],
    ["8.G.A.2", "8.G.A.3"],
    [
      lesson(
        "a-figure-under-a-sequence",
        ["A figure under a sequence", "图形在变换序列下的像"],
        [
          [
            "To apply a sequence of rigid motions, apply them **in the order given** to each vertex, each motion to the image of the one before. Rotate triangle $ABC$ $90^\\circ$ counterclockwise about the origin, then translate by $(x, y) \\to (x + 2, y - 3)$. For $B(4, 1)$, the rotation gives $B_1 = (-1, 4)$, and the translation gives $B' = (1, 1)$.",
            "要施行一串刚体运动，就**按给出的顺序**对每个顶点施行，每个运动都作用在前一个运动的像上。把三角形 $ABC$ 绕原点逆时针旋转 $90^\\circ$，再按 $(x, y) \\to (x + 2, y - 3)$ 平移。对 $B(4, 1)$，旋转得 $B_1 = (-1, 4)$，平移得 $B' = (1, 1)$。",
          ],
          [
            "Undo the steps: moving $(1, 1)$ back by $(x, y) \\to (x - 2, y + 3)$ gives $(-1, 4)$, and turning that back clockwise gives $(4, 1)$.",
            "把步骤倒回去：按 $(x, y) \\to (x - 2, y + 3)$ 把 $(1, 1)$ 移回得 $(-1, 4)$，再顺时针转回得 $(4, 1)$。",
          ],
          [
            "Keep the order. Translating first gives $(6, -2)$, and the rotation then gives $(2, 6)$, a different point.",
            "要保持顺序。先平移得 $(6, -2)$，再旋转得 $(2, 6)$，是另一个点。",
          ],
        ],
        (rng) => {
          for (;;) {
            const tri = pickTriangle(rng);
            const tr = pickTranslation(rng).move;
            const rigid = rng.pick(rigidMoves);
            const [m1, m2] = rng.bool() ? [rigid, tr] : [tr, rigid];
            const moves = [m1, m2];
            const i = rng.int(0, 2);
            const p = tri[i]!;
            const mid = m1.f(p);
            const answer = m2.f(mid);
            const reversed = applyAll([m2, m1], p);
            if (same2(answer, reversed)) continue;
            const n = ABC[i]!;
            const order = sequenceName(moves);
            return {
              ...located(
                [
                  `Triangle $ABC$ is mapped onto triangle $A'B'C'$ by ${order.en}. Find the coordinates of $${n}'$.`,
                  `对三角形 $ABC$ 先作${order["zh-CN"]}，得到三角形 $A'B'C'$。求 $${n}'$ 的坐标。`,
                ],
                answer,
                [
                  [
                    ["Read the vertex", "读出顶点"],
                    [`From the figure, $${n} = ${pl(p)}$.`, `由图，$${n} = ${pl(p)}$。`],
                  ],
                  [["Apply the first motion", "施行第一个运动"], [`${cap(m1.name.en)}:`, `${zhName(m1)}：`], [`${n}_1 = ${pl(mid)}`]],
                  [["Apply the second motion", "施行第二个运动"], [`${cap(m2.name.en)}:`, `${zhName(m2)}：`], [`${n}' = ${pl(answer)}`]],
                ],
                [
                  `Undo in reverse order: undoing the second motion takes $${n}'$ back to $${pl(m2.inv(answer))}$, and undoing the first takes that back to $${pl(m1.inv(mid))}$, which is $${n}$.`,
                  `按相反的顺序还原：还原第二个运动，$${n}'$ 回到 $${pl(m2.inv(answer))}$；再还原第一个运动，回到 $${pl(m1.inv(mid))}$，正是 $${n}$。`,
                ],
                [
                  [reversed, "That applies the two motions in the opposite order.", "这是按相反的顺序施行了两个运动。"],
                  [mid, "That stops after the first motion.", "这是只施行了第一个运动就停下了。"],
                  [m2.f(p), "That skips the first motion and applies only the second.", "这是跳过了第一个运动，只施行了第二个。"],
                ],
                graph(polygonMarks(tri, ABC), "Triangle ABC on a coordinate grid.", "坐标网格上的三角形 ABC。"),
              ),
              solutionFigure: stagedPolygon(ABC, [tri, mapAll([m1], tri), mapAll(moves, tri)], i),
            };
          }
        },
        drawn(gradeDrawings5["applying-sequences-of-rigid-motions#a-figure-under-a-sequence"]),
      ),
      lesson(
        "does-the-order-matter",
        ["Does the order matter?", "顺序重要吗？"],
        [
          [
            "Changing the order of two rigid motions usually changes the image, so apply them both ways and compare. For $P(3, 2)$, reflecting across the $x$-axis and then translating by $(x, y) \\to (x, y + 4)$ gives $(3, -2)$, then $(3, 2)$. Translating first gives $(3, 6)$, then $(3, -6)$. The images differ, so the order matters.",
            "交换两个刚体运动的顺序，像通常会改变，所以要按两种顺序分别施行再比较。对 $P(3, 2)$，先关于 $x$ 轴作轴对称，再按 $(x, y) \\to (x, y + 4)$ 平移，得到 $(3, -2)$，再得 $(3, 2)$。先平移则得 $(3, 6)$，再得 $(3, -6)$。两个像不同，所以顺序重要。",
          ],
          [
            "The $x$-coordinates agree, but the $y$-coordinates are $2$ and $-6$, so the two end points are different.",
            "两个 $x$ 坐标相同，但 $y$ 坐标分别是 $2$ 和 $-6$，所以两个终点不同。",
          ],
          [
            "Do not assume the order always matters. Two translations, or a reflection across the $x$-axis and a translation that only moves left or right, give the same image in either order.",
            "不要以为顺序总是重要。两次平移，或者关于 $x$ 轴的轴对称与只向左右移动的平移，按任一顺序施行都得到同一个像。",
          ],
        ],
        (rng) => {
          for (;;) {
            const pair: [Move, Move] = rng.bool() ? commutingPair(rng) : [rng.pick(rigidMoves), pickTranslation(rng).move];
            const [m1, m2] = rng.bool() ? pair : [pair[1], pair[0]];
            const p: XY = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
            if (Math.abs(p[0]) === Math.abs(p[1])) continue;
            const first = applyAll([m1, m2], p);
            const second = applyAll([m2, m1], p);
            const equal = same2(first, second);
            const differ = first[0] !== second[0] ? 0 : 1;
            const axis = differ === 0 ? "x" : "y";
            return {
              ...decided(
                rng,
                [
                  `The point $P${pl(p)}$ is mapped by ${m1.name.en}, followed by ${m2.name.en}. Would doing the two transformations in the opposite order send $P$ to the same point?`,
                  `对点 $P${pl(p)}$ 先作${zhName(m1)}，然后作${zhName(m2)}。如果按相反的顺序施行这两个变换，$P$ 会被映到同一个点吗？`,
                ],
                equal,
                [
                  [
                    ["Use the given order", "按给出的顺序"],
                    [`${cap(m1.name.en)}, then ${m2.name.en}:`, `先作${zhName(m1)}，再作${zhName(m2)}：`],
                    [`P_1 = ${pl(m1.f(p))}`, `P' = ${pl(first)}`],
                  ],
                  [
                    ["Use the opposite order", "按相反的顺序"],
                    [`${cap(m2.name.en)}, then ${m1.name.en}:`, `先作${zhName(m2)}，再作${zhName(m1)}：`],
                    [`P_2 = ${pl(m2.f(p))}`, `P'' = ${pl(second)}`],
                  ],
                ],
                equal
                  ? [
                      `Compare the end points coordinate by coordinate: both $x$-coordinates are $${first[0]}$ and both $y$-coordinates are $${first[1]}$, so the order does not matter here.`,
                      `逐个比较两个终点的坐标：两个 $x$ 坐标都是 $${first[0]}$，两个 $y$ 坐标都是 $${first[1]}$，所以这里顺序不重要。`,
                    ]
                  : [
                      `Compare the end points coordinate by coordinate: the $${axis}$-coordinates are $${first[differ]}$ and $${second[differ]}$, so the order matters.`,
                      `逐个比较两个终点的坐标：$${axis}$ 坐标分别是 $${first[differ]}$ 和 $${second[differ]}$，所以顺序重要。`,
                    ],
                equal
                  ? [
                      "Changing the order does not always change the image: here both orders end at the same point.",
                      "改变顺序不一定改变像：这里两种顺序到达同一个点。",
                    ]
                  : [
                      `The two orders end at different points, $${pl(first)}$ and $${pl(second)}$.`,
                      `两种顺序到达不同的点：$${pl(first)}$ 和 $${pl(second)}$。`,
                    ],
                graph(
                  [{ kind: "point", at: p, label: "P", dir: "nw", accent: true }],
                  "The point P on a coordinate grid.",
                  "坐标网格上的点 P。",
                ),
              ),
              solutionFigure: graphFigure(
                viewAround([p, m1.f(p), first, m2.f(p), second]),
                [...trail(["P", "", ""], [p, m1.f(p), first]), ...trail(["", "", ""], [p, m2.f(p), second])],
                `In the stated order P ends at ${at(first)}; in the opposite order, at ${at(second)}.`,
                `按所给顺序 P 到达 ${at(first)}；按相反顺序到达 ${at(second)}。`,
              ),
            };
          }
        },
        drawn(gradeDrawings5["applying-sequences-of-rigid-motions#does-the-order-matter"]),
      ),
      lesson(
        "a-single-motion-for-a-sequence",
        ["A single motion for a sequence", "用一个运动代替一串运动"],
        [
          [
            "Some sequences have the same effect as a single motion. Follow the general point $(x, y)$ through the sequence. Two translations make one translation: $(x, y) \\to (x + 3, y - 1)$ followed by $(x, y) \\to (x - 5, y + 4)$ is $(x, y) \\to (x - 2, y + 3)$. Reflecting across the $x$-axis and then across the $y$-axis gives $(x, y) \\to (x, -y) \\to (-x, -y)$: a rotation of $180^\\circ$ about the origin.",
            "有些变换序列的效果与一个运动相同。让一般的点 $(x, y)$ 依次经过这串变换。两次平移合成一次平移：先按 $(x, y) \\to (x + 3, y - 1)$，再按 $(x, y) \\to (x - 5, y + 4)$，就是 $(x, y) \\to (x - 2, y + 3)$。先关于 $x$ 轴、再关于 $y$ 轴作轴对称，得到 $(x, y) \\to (x, -y) \\to (-x, -y)$：绕原点旋转 $180^\\circ$。",
          ],
          [
            "Test a point: the two reflections send $(2, 5)$ to $(2, -5)$, then $(-2, -5)$, and the $180^\\circ$ rotation sends it there too.",
            "用一个点检验：两次轴对称把 $(2, 5)$ 映到 $(2, -5)$，再到 $(-2, -5)$；旋转 $180^\\circ$ 也把它映到这里。",
          ],
          [
            "Add the shifts of two translations; do not subtract or multiply them. And reflecting twice across the same line is no change at all.",
            "两次平移的移动量要相加，不要相减或相乘。关于同一条直线作两次轴对称，等于没有变化。",
          ],
        ],
        (rng) => {
          if (rng.bool()) {
            let [h1, v1, h2, v2] = [0, 0, 0, 0];
            do [h1, v1, h2, v2] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
            while (h1 + h2 === 0 || v1 + v2 === 0);
            const [m1, m2] = [translation(h1, v1), translation(h2, v2)];
            const shift = (h: number, v: number) => pairOf(capText(translation(h, v).name));
            const correct = shift(h1 + h2, v1 + v2);
            const wrong = unique(correct, [
              [
                shift(h1 - h2, v1 - v2),
                "That subtracts the second shift instead of adding it.",
                "这是减去了第二次的移动量，而不是加上它。",
              ],
              [shift(h2 - h1, v2 - v1), "That subtracts the first shift from the second.", "这是用第二次的移动量减去了第一次的。"],
              [shift(h1 * h2, v1 * v2), "That multiplies the shifts instead of adding them.", "这是把移动量相乘了，而不是相加。"],
              [
                shift(h1 + v1, h2 + v2),
                "That adds the two shifts of each translation, mixing up $x$ and $y$.",
                "这是把每次平移的两个移动量相加，混淆了 $x$ 和 $y$。",
              ],
            ]).slice(0, 3);
            return chosen(
              rng,
              [
                `Which single transformation has the same effect as ${m1.name.en}, followed by ${m2.name.en}?`,
                `先作${zhName(m1)}，再作${zhName(m2)}。哪一个变换与这个序列的效果相同？`,
              ],
              correct,
              wrong,
              [
                [
                  ["Follow (x, y)", "跟踪 (x, y)"],
                  ["Send the general point through both translations:", "让一般的点依次经过两次平移："],
                  [`(x, y) \\to (${linear(1, h1)}, ${linear(1, v1, "y")}) \\to (${linear(1, h1 + h2)}, ${linear(1, v1 + v2, "y")})`],
                ],
                [
                  ["Name the motion", "说出这个运动"],
                  [
                    `So the sequence is the single translation $${rule(h1 + h2, v1 + v2)}$.`,
                    `所以这个序列就是一次平移 $${rule(h1 + h2, v1 + v2)}$。`,
                  ],
                ],
              ],
              [
                `Test the origin: it goes to $${pl([h1, v1])}$, then to $${pl([h1 + h2, v1 + v2])}$, a shift of $${h1 + h2}$ and $${v1 + v2}$.`,
                `用原点检验：它先到 $${pl([h1, v1])}$，再到 $${pl([h1 + h2, v1 + v2])}$，移动量是 $${h1 + h2}$ 和 $${v1 + v2}$。`,
              ],
            );
          }
          const moves = quarterMoves.slice(0, 5);
          const first = rng.pick(moves);
          const second = rng.pick(moves);
          const result = compose(second.m, first.m);
          const named = quarterMoves.find((q) => linKey(q.m) === linKey(result))!;
          const nameOf = (m: Lin) => pairOf(capText(quarterMoves.find((q) => linKey(q.m) === linKey(m))!.name));
          const test: XY = [1, 2];
          const end = apply(result, test);
          const wrong = unique(nameOf(result), [
            [nameOf(compose(first.m, second.m)), "That applies the two motions in the opposite order.", "这是按相反的顺序施行了两个运动。"],
            [nameOf(first.m), "That keeps only the first motion.", "这是只保留了第一个运动。"],
            [nameOf(second.m), "That keeps only the second motion.", "这是只保留了第二个运动。"],
            ...rng
              .shuffle(quarterMoves.map((q) => q.m))
              .map(
                (m): Wrong => [
                  nameOf(m),
                  `That motion sends $(1, 2)$ to $${pl(apply(m, test))}$, not to $${pl(end)}$.`,
                  `这个运动把 $(1, 2)$ 映到 $${pl(apply(m, test))}$，而不是 $${pl(end)}$。`,
                ],
              ),
          ]).slice(0, 3);
          return chosen(
            rng,
            [
              `Which single transformation has the same effect as ${first.name.en}, followed by ${second.name.en}?`,
              `先作${first.name["zh-CN"]}，再作${second.name["zh-CN"]}。哪一个变换与这个序列的效果相同？`,
            ],
            nameOf(result),
            wrong,
            [
              [
                ["Follow (x, y)", "跟踪 (x, y)"],
                ["Send the general point through both motions:", "让一般的点依次经过两个运动："],
                [`(x, y) \\to ${image(first.m)} \\to ${image(result)}`],
              ],
              [
                ["Name the motion", "说出这个运动"],
                [
                  `The rule $(x, y) \\to ${image(result)}$ is ${named.name.en.replace("no change: ", "no change at all: ")}.`,
                  `规则 $(x, y) \\to ${image(result)}$ 就是${named.name["zh-CN"]}。`,
                ],
              ],
            ],
            [
              `Test $(1, 2)$: the sequence sends it to $${pl(apply(first.m, test))}$, then $${pl(end)}$, and the single motion sends it to $${pl(end)}$ too.`,
              `用 $(1, 2)$ 检验：这个序列先把它映到 $${pl(apply(first.m, test))}$，再到 $${pl(end)}$；这一个运动也把它映到 $${pl(end)}$。`,
            ],
          );
        },
        drawn(gradeDrawings5["applying-sequences-of-rigid-motions#a-single-motion-for-a-sequence"]),
      ),
    ],
  ),
  [
    "A game piece sits at $(2, 1)$. It slides $3$ units right and is then reflected across the $x$-axis. Where does it end?",
    "一枚棋子在 $(2, 1)$。它先向右滑动 $3$ 个单位，再关于 $x$ 轴作轴对称。它最后在哪里？",
  ],
  ["Sliding gives $(5, 1)$, and the reflection gives $(5, -1)$.", "滑动后到 $(5, 1)$，轴对称后到 $(5, -1)$。"],
  [
    "apply sequences of rigid motions in order, test whether the order matters, and replace a sequence by a single motion.",
    "按顺序施行一串刚体运动，检验顺序是否重要，并用一个运动代替一串运动。",
  ],
);

// ─── Congruence Through Rigid Motions ───────────────────────────────────────

/** legTriangle is the right triangle with its right angle at a and legs of lengths p and q along the grid. */
const legTriangle = (a: XY, p: number, q: number, sx: number, sy: number): XY[] => [a, [a[0] + sx * p, a[1]], [a[0], a[1] + sy * q]];

const congruenceThroughRigidMotions = withIntro(
  topic(
    "congruence-through-rigid-motions",
    t("Congruence Through Rigid Motions", "通过刚体运动判断全等"),
    t(
      "Decide whether two figures are congruent by looking for a sequence of rigid motions that maps one onto the other, and use a congruence statement to find unknown sides and angles.",
      "通过寻找把一个图形映到另一个图形上的刚体运动序列来判断两个图形是否全等，并利用全等式求未知的边和角。",
    ),
    ["applying-sequences-of-rigid-motions"],
    ["8.G.A.2"],
    [
      lesson(
        "are-the-figures-congruent",
        ["Are the figures congruent?", "两个图形全等吗？"],
        [
          [
            "Two figures are **congruent** if a sequence of rigid motions maps one onto the other. Rigid motions keep lengths and angles, so congruent figures have equal corresponding sides and angles. To show two figures are congruent, find such a sequence. To show they are not, find a length or angle that cannot match.",
            "如果一串刚体运动能把一个图形映到另一个图形上，这两个图形就**全等**。刚体运动保持长度和角度，所以全等图形的对应边相等，对应角也相等。要说明两个图形全等，就找出这样一串运动。要说明它们不全等，就找出一个无法对应的长度或角。",
          ],
          [
            "A right triangle with legs $3$ and $5$ and one with legs $3$ and $4$ have areas $7.5$ and $6$, so they cannot be congruent.",
            "直角边为 $3$ 和 $5$ 的直角三角形与直角边为 $3$ 和 $4$ 的直角三角形，面积分别是 $7.5$ 和 $6$，所以不可能全等。",
          ],
          [
            "Position does not matter. Two triangles far apart on the grid, or facing different ways, can still be congruent.",
            "位置无关紧要。在网格上相距很远或朝向不同的两个三角形，仍然可能全等。",
          ],
        ],
        (rng) => {
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
            const half = (u: number, w: number) => String((u * w) / 2);
            return decided(
              rng,
              [
                `Triangle $ABC$ has vertices ${ca.join(", ")} and triangle $DEF$ has vertices ${cd.join(", ")}. Is there a sequence of rigid motions that maps $\\triangle ABC$ onto $\\triangle DEF$?`,
                `三角形 $ABC$ 的顶点是 ${ca.join("，")}，三角形 $DEF$ 的顶点是 ${cd.join("，")}。是否有一串刚体运动把 $\\triangle ABC$ 映到 $\\triangle DEF$ 上？`,
              ],
              congruent,
              [
                [
                  ["Measure the legs", "量出直角边"],
                  ["Both are right triangles with legs along the grid:", "两个都是直角边沿网格线的直角三角形："],
                  [`AB = ${p}, \\quad AC = ${q}`, `DE = ${p}, \\quad DF = ${q2}`],
                ],
                congruent
                  ? [
                      ["Find the sequence", "找出变换序列"],
                      [
                        `${cap(sequenceName(moves).en)}, maps $A$ to $D$, $B$ to $E$ and $C$ to $F$, so the triangles are congruent.`,
                        `先作${sequenceName(moves)["zh-CN"]}，就把 $A$ 映到 $D$，$B$ 映到 $E$，$C$ 映到 $F$，所以这两个三角形全等。`,
                      ],
                    ]
                  : [
                      ["Compare", "比较"],
                      [
                        `$AC = ${q}$ but $DF = ${q2}$. Rigid motions keep lengths, so no sequence of them maps one triangle onto the other.`,
                        `$AC = ${q}$，而 $DF = ${q2}$。刚体运动保持长度，所以没有一串刚体运动能把一个三角形映到另一个上。`,
                      ],
                    ],
              ],
              congruent
                ? [
                    `Both triangles have area $${p} \\times ${q} \\div 2 = ${half(p, q)}$, as congruent figures must.`,
                    `两个三角形的面积都是 $${p} \\times ${q} \\div 2 = ${half(p, q)}$，全等图形正应如此。`,
                  ]
                : [
                    `Compare the areas: $${half(p, q)}$ and $${half(p, q2)}$ differ, but congruent figures have equal areas.`,
                    `比较面积：$${half(p, q)}$ 与 $${half(p, q2)}$ 不同，而全等图形的面积相等。`,
                  ],
              congruent
                ? [
                    "Being in different places on the grid does not stop the triangles from being congruent: a sequence of rigid motions moves one onto the other.",
                    "在网格上的位置不同并不妨碍它们全等：一串刚体运动能把一个移到另一个上。",
                  ]
                : [
                    `Both are right triangles, but leg $DF = ${q2}$ does not match $AC = ${q}$, and rigid motions keep lengths.`,
                    `两个都是直角三角形，但直角边 $DF = ${q2}$ 与 $AC = ${q}$ 不相等，而刚体运动保持长度。`,
                  ],
              graph(
                [...polygonMarks(tri, ABC, false), ...polygonMarks(img, ["D", "E", "F"])],
                "Triangles ABC and DEF on a coordinate grid.",
                "坐标网格上的三角形 ABC 和 DEF。",
              ),
            );
          }
        },
        drawn(gradeDrawings5["congruence-through-rigid-motions#are-the-figures-congruent"]),
      ),
      lesson(
        "using-a-congruence-statement",
        ["Using a congruence statement", "运用全等式"],
        [
          [
            "In a congruence statement such as $\\triangle ABC \\cong \\triangle QRP$, letters in the same position correspond: $A \\leftrightarrow Q$, $B \\leftrightarrow R$, $C \\leftrightarrow P$. So $\\overline{AB}$ corresponds to $\\overline{QR}$. If $AB = 2x + 3$ and $QR = 15$, then $2x + 3 = 15$, so $2x = 12$ and $x = 6$.",
            "在 $\\triangle ABC \\cong \\triangle QRP$ 这样的全等式中，位置相同的字母相对应：$A \\leftrightarrow Q$，$B \\leftrightarrow R$，$C \\leftrightarrow P$。所以 $\\overline{AB}$ 对应 $\\overline{QR}$。若 $AB = 2x + 3$，$QR = 15$，则 $2x + 3 = 15$，所以 $2x = 12$，$x = 6$。",
          ],
          [
            "Put $x = 6$ back: $2 \\cdot 6 + 3 = 15$, the length of $\\overline{QR}$.",
            "把 $x = 6$ 代回：$2 \\cdot 6 + 3 = 15$，正是 $\\overline{QR}$ 的长度。",
          ],
          [
            "Read the correspondence from the statement, not from the alphabet. In $\\triangle QRP$, side $\\overline{PQ}$ matches $\\overline{CA}$, not $\\overline{AB}$.",
            "要从全等式中读出对应关系，而不是按字母表顺序。在 $\\triangle QRP$ 中，边 $\\overline{PQ}$ 对应 $\\overline{CA}$，而不是 $\\overline{AB}$。",
          ],
        ],
        (rng) => {
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
            return valued(
              [
                `$${statement}$. In $\\triangle ABC$, $${ABC[i]}${ABC[j]} = ${linear(c, d)}$. The sides of $\\triangle ${letters}$ are ${list.slice(0, 2).join(", ")} and ${list[2]}. Find $x$.`,
                `$${statement}$。在 $\\triangle ABC$ 中，$${ABC[i]}${ABC[j]} = ${linear(c, d)}$。$\\triangle ${letters}$ 的三边是 ${list.join("，")}。求 $x$。`,
              ],
              x,
              [
                [
                  ["Match the sides", "找出对应边"],
                  [
                    `In the congruence statement, $${ABC[i]}$ corresponds to $${img(i)}$ and $${ABC[j]}$ to $${img(j)}$, so $${ABC[i]}${ABC[j]} = ${match.name} = ${match.value}$.`,
                    `在全等式中，$${ABC[i]}$ 对应 $${img(i)}$，$${ABC[j]}$ 对应 $${img(j)}$，所以 $${ABC[i]}${ABC[j]} = ${match.name} = ${match.value}$。`,
                  ],
                ],
                [["Solve", "求解"], ["Solve the equation:", "解方程："], solveLines(c, d, match.value)],
              ],
              [
                `Put $x = ${x}$ back: $${c} \\cdot ${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${match.value}$, the length of $\\overline{${match.name}}$.`,
                `把 $x = ${x}$ 代回：$${c} \\cdot ${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${match.value}$，正是 $\\overline{${match.name}}$ 的长度。`,
              ],
              listed
                .filter((s) => s !== match)
                .map(
                  (s): Off => [
                    Q.of(s.value - d, c),
                    `That sets $${ABC[i]}${ABC[j]}$ equal to $${s.name}$, which is not its corresponding side.`,
                    `这是让 $${ABC[i]}${ABC[j]}$ 等于 $${s.name}$，但它们不是对应边。`,
                  ],
                ),
              { solveFor: "x" },
            );
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
          return valued(
            [
              `$${statement}$. In $\\triangle ABC$, $m\\angle ${ABC[k]} = (${linear(c, d)})^\\circ$. The angles of $\\triangle ${letters}$ are ${list.slice(0, 2).join(", ")} and ${list[2]}. Find $x$.`,
              `$${statement}$。在 $\\triangle ABC$ 中，$m\\angle ${ABC[k]} = (${linear(c, d)})^\\circ$。$\\triangle ${letters}$ 的三个角是 ${list.join("，")}。求 $x$。`,
            ],
            x,
            [
              [
                ["Match the angles", "找出对应角"],
                [
                  `In the congruence statement, $${ABC[k]}$ corresponds to $${img(k)}$, so $m\\angle ${ABC[k]} = m\\angle ${img(k)} = ${match.value}^\\circ$.`,
                  `在全等式中，$${ABC[k]}$ 对应 $${img(k)}$，所以 $m\\angle ${ABC[k]} = m\\angle ${img(k)} = ${match.value}^\\circ$。`,
                ],
              ],
              [["Solve", "求解"], ["Solve the equation:", "解方程："], solveLines(c, d, match.value)],
            ],
            [
              `Put $x = ${x}$ back: $${c} \\cdot ${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${match.value}$, the measure of $\\angle ${img(k)}$.`,
              `把 $x = ${x}$ 代回：$${c} \\cdot ${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${match.value}$，正是 $\\angle ${img(k)}$ 的度数。`,
            ],
            listed
              .filter((a) => a !== match)
              .map(
                (a): Off => [
                  Q.of(a.value - d, c),
                  `That sets $\\angle ${ABC[k]}$ equal to $\\angle ${a.name}$, which is not its corresponding angle.`,
                  `这是让 $\\angle ${ABC[k]}$ 等于 $\\angle ${a.name}$，但它们不是对应角。`,
                ],
              ),
            { solveFor: "x" },
          );
        },
        drawn(gradeDrawings5["congruence-through-rigid-motions#using-a-congruence-statement"]),
      ),
      lesson(
        "finding-the-sequence",
        ["Finding the sequence", "找出变换序列"],
        [
          [
            "To find a sequence of rigid motions that maps one figure onto another, follow one vertex at a time. If $A(1, 2)$ maps to $A'(-4, 3)$, then rotating $90^\\circ$ counterclockwise about the origin gives $(-2, 1)$, and the translation $(x, y) \\to (x - 2, y + 2)$ finishes the job.",
            "要找出把一个图形映到另一个图形上的刚体运动序列，就一次跟踪一个顶点。若 $A(1, 2)$ 映到 $A'(-4, 3)$，先绕原点逆时针旋转 $90^\\circ$ 得 $(-2, 1)$，再按 $(x, y) \\to (x - 2, y + 2)$ 平移就到达了。",
          ],
          [
            "The translation is the change from $(-2, 1)$ to $(-4, 3)$: $-2$ in $x$ and $+2$ in $y$.",
            "平移就是从 $(-2, 1)$ 到 $(-4, 3)$ 的变化：$x$ 减少 $2$，$y$ 增加 $2$。",
          ],
          [
            "One vertex is not enough. A sequence works only if it sends **every** vertex to its image, so check $B$ and $C$ too.",
            "只看一个顶点不够。只有把**每个**顶点都映到它的像，这个序列才可行，所以还要检验 $B$ 和 $C$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const tri = pickTriangle(rng, -4, 4);
            const rigid = rng.pick(rigidMoves);
            const { move: tr, h, v } = pickTranslation(rng);
            const correct = [rigid, tr];
            const img = mapAll(correct, tri);
            if (!within(img, 8) || !apart(tri, img)) continue;
            const others = rigidMoves.filter((m) => m !== rigid);
            const [o1, o2] = rng.sample(others, 2) as [Move, Move];
            const candidates: [Move[], string, string][] = [
              [
                [tr, rigid],
                "That translates first, and the second motion then carries the shift somewhere else.",
                "这是先平移，第二个运动又把平移后的图形带到了别处。",
              ],
              [[rigid, translation(-h, -v)], "That translates the opposite way.", "这是朝相反的方向平移了。"],
              [
                [o1, tr],
                `That starts with ${o1.name.en}, which sends the vertices elsewhere.`,
                `这是先作${zhName(o1)}，它把顶点送到了别处。`,
              ],
              [[rigid, translation(v, h)], "That swaps the horizontal and vertical shifts.", "这是把水平和竖直的移动量弄反了。"],
              [
                [o2, tr],
                `That starts with ${o2.name.en}, which sends the vertices elsewhere.`,
                `这是先作${zhName(o2)}，它把顶点送到了别处。`,
              ],
            ];
            const kept: [Move[], string, string][] = [];
            for (const c of candidates) {
              const pts = mapAll(c[0], tri);
              if (![correct, ...kept.map((k) => k[0])].some((k) => sameList(mapAll(k, tri), pts))) kept.push(c);
            }
            if (kept.length < 3) continue;
            const coords = tri.map((p, i) => `$${ABC[i]}${pl(p)}$`);
            const mids = tri.map((p) => rigid.f(p));
            return {
              ...chosen(
                rng,
                [
                  `Which sequence of rigid motions maps $\\triangle ABC$, with ${coords.join(", ")}, onto $\\triangle A'B'C'$?`,
                  `哪一串刚体运动把 $\\triangle ABC$（${coords.join("，")}）映到 $\\triangle A'B'C'$ 上？`,
                ],
                seqPair(correct),
                kept.slice(0, 3).map(([m, en, zh]): Wrong => [seqPair(m), en, zh]),
                [
                  [
                    ["Apply the first motion", "施行第一个运动"],
                    [`${cap(rigid.name.en)}:`, `${zhName(rigid)}：`],
                    tri.map((p, i) => `${ABC[i]}${pl(p)} \\to ${pl(mids[i]!)}`),
                  ],
                  [
                    ["Then translate", "再平移"],
                    [`${cap(tr.name.en)}:`, `${zhName(tr)}：`],
                    mids.map((p, i) => `${pl(p)} \\to ${ABC[i]}'${pl(img[i]!)}`),
                  ],
                ],
                [
                  `Every vertex lands on its image, and in the second step each one moves by the same shift: $${h}$ in $x$ and $${v}$ in $y$.`,
                  `每个顶点都落在它的像上，而且在第二步中每个顶点的移动量都相同：$x$ 方向 $${h}$，$y$ 方向 $${v}$。`,
                ],
                graph(
                  [...polygonMarks(tri, ABC, false), ...polygonMarks(img, primed)],
                  "Triangle ABC and its image A′B′C′ on a coordinate grid.",
                  "坐标网格上的三角形 ABC 和它的像 A′B′C′。",
                ),
              ),
              solutionFigure: stagedPolygon(ABC, [tri, mapAll([rigid], tri), img]),
            };
          }
        },
        drawn(gradeDrawings5["congruence-through-rigid-motions#finding-the-sequence"]),
      ),
    ],
  ),
  [
    "Two floor tiles are cut from the same pattern. One is turned and slid across the floor. Can it still be laid exactly on top of the other?",
    "两块地砖是按同一个图样切出来的。把其中一块转一转、在地上滑一滑。它还能和另一块完全重合吗？",
  ],
  [
    "Yes: turning and sliding keep every length and angle, so one tile can be moved back onto the other.",
    "能：转动和滑动保持每个长度和角，所以能把一块移回到另一块上。",
  ],
  [
    "decide congruence with rigid motions, use congruence statements to find unknowns, and find the sequence that maps one figure onto another.",
    "用刚体运动判断全等，用全等式求未知量，并找出把一个图形映到另一个图形上的变换序列。",
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

const usingSimilarTrianglesToExplainSlope = withIntro(
  topic(
    "using-similar-triangles-to-explain-slope",
    t("Using Similar Triangles to Explain Slope", "用相似三角形解释斜率"),
    t(
      "Explain with similar slope triangles why the slope of a line is the same between any two of its points, use this to find missing lengths and to test whether a point lies on a line, and derive the equations y = mx and y = mx + b.",
      "用相似的斜率三角形解释为什么直线上任意两点间的斜率都相同，用它求未知的长度、检验一个点是否在直线上，并推导方程 y = mx 和 y = mx + b。",
    ),
    ["the-aa-similarity-criterion", "slope-of-a-line"],
    ["8.EE.B.6"],
    [
      lesson(
        "similar-slope-triangles",
        ["Similar slope triangles", "相似的斜率三角形"],
        [
          [
            "A **slope triangle** of a line has a horizontal leg (the run), a vertical leg (the rise), and its third side on the line. Any two slope triangles of the same line are **similar**: both have a right angle, and their angles where the line meets the horizontal legs are corresponding angles, so they are equal. So every slope triangle has the same ratio $\\dfrac{\\text{rise}}{\\text{run}}$: the slope. If one has rise $4$ and run $6$, one with run $9$ has rise $r$ with $\\dfrac{r}{9} = \\dfrac{4}{6}$, so $r = 6$.",
            "直线的**斜率三角形**有一条水平直角边（横向变化）、一条竖直直角边（纵向变化），第三条边在直线上。同一条直线的任意两个斜率三角形**相似**：它们都有一个直角，而直线与两条水平直角边所成的角是同位角，所以相等。因此每个斜率三角形的比 $\\dfrac{\\text{纵向变化}}{\\text{横向变化}}$ 都相同：这就是斜率。若一个的纵向变化是 $4$、横向变化是 $6$，那么横向变化为 $9$ 的那个的纵向变化 $r$ 满足 $\\dfrac{r}{9} = \\dfrac{4}{6}$，所以 $r = 6$。",
          ],
          [
            "Both ratios simplify to the same slope: $\\dfrac{6}{9} = \\dfrac{2}{3}$ and $\\dfrac{4}{6} = \\dfrac{2}{3}$.",
            "两个比化简后是同一个斜率：$\\dfrac{6}{9} = \\dfrac{2}{3}$，$\\dfrac{4}{6} = \\dfrac{2}{3}$。",
          ],
          [
            "Keep the ratio, not the difference. The run grows by $3$ from $6$ to $9$, but the rise grows by $2$, not by $3$.",
            "要保持比，而不是差。横向变化从 $6$ 增加 $3$ 到 $9$，纵向变化却只增加 $2$，而不是 $3$。",
          ],
        ],
        (rng) => {
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
          const [legEn, legZh] = askRun ? ["run", "横向变化"] : ["rise", "纵向变化"];
          return valued(
            [
              `Both triangles are slope triangles of the same line. One of them has a rise of $${rise1}$ and a run of $${run1}$. The other has a ${askRun ? `rise of $${given}$` : `run of $${given}$`}. Find its ${legEn}.`,
              `两个三角形都是同一条直线的斜率三角形。其中一个的纵向变化是 $${rise1}$，横向变化是 $${run1}$。另一个的${askRun ? `纵向变化是 $${given}$` : `横向变化是 $${given}$`}。求它的${legZh}。`,
            ],
            answer,
            [
              [
                ["Set the ratios equal", "让两个比相等"],
                [
                  `Call the unknown ${legEn} $n$. The slope triangles are similar, so their rise-to-run ratios are equal:`,
                  `设未知的${legZh}为 $n$。两个斜率三角形相似，所以纵向变化与横向变化之比相等：`,
                ],
                [askRun ? `\\frac{${given}}{n} = \\frac{${rise1}}{${run1}}` : `\\frac{n}{${given}} = \\frac{${rise1}}{${run1}}`],
              ],
              [
                ["Solve", "求解"],
                [`Multiply $${given}$ by the matching ratio:`, `用 $${given}$ 乘以相应的比：`],
                [
                  askRun
                    ? `n = ${given} \\cdot \\frac{${run1}}{${rise1}} = ${answer}`
                    : `n = ${given} \\cdot \\frac{${rise1}}{${run1}} = ${answer}`,
                ],
              ],
            ],
            [
              `Both triangles have legs in the same ratio: $${rise2} : ${run2}$ and $${rise1} : ${run1}$ both simplify to $${r} : ${s}$.`,
              `两个三角形的直角边之比相同：$${rise2} : ${run2}$ 和 $${rise1} : ${run1}$ 都化简为 $${r} : ${s}$。`,
            ],
            askRun
              ? [
                  [
                    Q.of(given * rise1, run1),
                    "That multiplies by rise over run; to find a run, multiply by run over rise.",
                    "这是乘了纵向变化比横向变化；求横向变化要乘横向变化比纵向变化。",
                  ],
                  [
                    given + run1 - rise1,
                    "That keeps the difference between the legs instead of their ratio.",
                    "这是保持了两条直角边的差，而不是它们的比。",
                  ],
                ]
              : [
                  [
                    Q.of(given * run1, rise1),
                    "That multiplies by run over rise; to find a rise, multiply by rise over run.",
                    "这是乘了横向变化比纵向变化；求纵向变化要乘纵向变化比横向变化。",
                  ],
                  [
                    given + rise1 - run1,
                    "That keeps the difference between the legs instead of their ratio.",
                    "这是保持了两条直角边的差，而不是它们的比。",
                  ],
                ],
            {
              figure: fig(
                [
                  { kind: "segment", a: start, b: end, accent: true },
                  ...slopeTriangle(p1, run1, rise1, `${run1}`, `${rise1}`),
                  ...slopeTriangle(p2, run2, rise2, askRun ? "?" : `${run2}`, askRun ? `${rise2}` : "?"),
                ],
                "A line with two slope triangles, their legs labeled.",
                "一条直线和它的两个斜率三角形，直角边上标有长度。",
              ),
            },
          );
        },
        drawn(gradeDrawings5["using-similar-triangles-to-explain-slope#similar-slope-triangles"]),
      ),
      lesson(
        "is-the-point-on-the-line",
        ["Is the point on the line?", "点在直线上吗？"],
        [
          [
            "Because all slope triangles of a line are similar, a point $C$ lies on the line through $A$ and $B$ exactly when the slope from $A$ to $C$ equals the slope from $A$ to $B$. The line through $A(1, 2)$ and $B(4, 4)$ has slope $\\dfrac{4 - 2}{4 - 1} = \\dfrac{2}{3}$. For $C(10, 8)$, the slope from $A$ is $\\dfrac{8 - 2}{10 - 1} = \\dfrac{6}{9} = \\dfrac{2}{3}$, so $C$ is on the line.",
            "因为同一条直线的所有斜率三角形都相似，所以点 $C$ 在过 $A$、$B$ 的直线上，当且仅当从 $A$ 到 $C$ 的斜率等于从 $A$ 到 $B$ 的斜率。过 $A(1, 2)$ 和 $B(4, 4)$ 的直线的斜率是 $\\dfrac{4 - 2}{4 - 1} = \\dfrac{2}{3}$。对 $C(10, 8)$，从 $A$ 出发的斜率是 $\\dfrac{8 - 2}{10 - 1} = \\dfrac{6}{9} = \\dfrac{2}{3}$，所以 $C$ 在直线上。",
          ],
          [
            "Three copies of the slope triangle, each $3$ across and $2$ up, lead from $A(1, 2)$ to $(10, 8)$.",
            "三个斜率三角形（每个向右 $3$、向上 $2$）首尾相接，从 $A(1, 2)$ 正好走到 $(10, 8)$。",
          ],
          [
            "Close is not enough. For $C(10, 9)$ the slope is $\\dfrac{7}{9}$, not $\\dfrac{2}{3}$, so $C$ is off the line, though only by $1$.",
            "接近还不够。对 $C(10, 9)$，斜率是 $\\dfrac{7}{9}$ 而不是 $\\dfrac{2}{3}$，所以 $C$ 不在直线上，尽管只差 $1$。",
          ],
        ],
        (rng) => {
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
            const reach: XY = [a[0] + k * s, a[1] + k * r];
            return {
              ...decided(
                rng,
                [
                  `A line passes through $A${pl(a)}$ and $B${pl(b)}$. Is the point $C${pl(c)}$ on the line?`,
                  `一条直线经过 $A${pl(a)}$ 和 $B${pl(b)}$。点 $C${pl(c)}$ 在这条直线上吗？`,
                ],
                onLine,
                [
                  [
                    ["Find the slope of AB", "求 AB 的斜率"],
                    ["Use the slope triangle from $A$ to $B$:", "利用从 $A$ 到 $B$ 的斜率三角形："],
                    [`\\text{slope of } AB = ${frac(b)} = ${m.toLatex()}`],
                  ],
                  [
                    ["Compare the slope of AC", "比较 AC 的斜率"],
                    [
                      onLine
                        ? "The slopes are equal, so the slope triangles are similar and $C$ lies on the line:"
                        : "The slopes differ, so $C$ is not on the line:",
                      onLine ? "两个斜率相等，所以斜率三角形相似，$C$ 在直线上：" : "两个斜率不同，所以 $C$ 不在直线上：",
                    ],
                    [`\\text{slope of } AC = ${frac(c)} = ${mc.toLatex()}`],
                  ],
                ],
                [
                  `Step from $A$ by the slope triangle $${k}$ times, $${s}$ in $x$ and $${r}$ in $y$ each time: this reaches $${pl(reach)}$, which ${onLine ? "is" : "is not"} $C$.`,
                  `从 $A$ 出发，按斜率三角形走 $${k}$ 次，每次 $x$ 变化 $${s}$、$y$ 变化 $${r}$：到达 $${pl(reach)}$，${onLine ? "正是" : "不是"} $C$。`,
                ],
                onLine
                  ? [
                      "The slope from $A$ to $C$ equals the slope from $A$ to $B$, so $C$ is on the line.",
                      "从 $A$ 到 $C$ 的斜率等于从 $A$ 到 $B$ 的斜率，所以 $C$ 在直线上。",
                    ]
                  : [
                      `$C$ is close to the line, but the slope from $A$ to $C$ is $${mc.toLatex()}$, not $${m.toLatex()}$.`,
                      `$C$ 离直线很近，但从 $A$ 到 $C$ 的斜率是 $${mc.toLatex()}$，而不是 $${m.toLatex()}$。`,
                    ],
                graphFigure(
                  viewAround([a, b, c]),
                  [
                    { kind: "point", at: a, label: "A", dir: "nw", accent: true },
                    { kind: "point", at: b, label: "B", dir: "nw", accent: true },
                    { kind: "point", at: c, label: "C", dir: "se" },
                  ],
                  `The points A ${at(a)}, B ${at(b)} and C ${at(c)}.`,
                  `点 A ${at(a)}、B ${at(b)} 和 C ${at(c)}。`,
                ),
              ),
              solutionFigure: graphFigure(
                viewAround([a, b, c]),
                [
                  { kind: "line", a, b, accent: true },
                  ...riseRun(a, b),
                  { kind: "point", at: a, label: "A", dir: "nw", accent: true },
                  { kind: "point", at: b, label: "B", dir: "nw", accent: true },
                  { kind: "point", at: c, label: "C", dir: "se", tone: "result" },
                ],
                onLine ? `C ${at(c)} lies on the line through A and B.` : `C ${at(c)} does not lie on the line through A and B.`,
                onLine ? `C ${at(c)} 在经过 A、B 的直线上。` : `C ${at(c)} 不在经过 A、B 的直线上。`,
              ),
            };
          }
        },
        drawn(gradeDrawings5["using-similar-triangles-to-explain-slope#is-the-point-on-the-line"]),
      ),
      lesson(
        "deriving-the-equation-of-a-line",
        ["Deriving the equation of a line", "推导直线的方程"],
        [
          [
            "Slope triangles give the equation of a line. For a line through the origin with slope $m$, any point $(x, y)$ on it makes a slope triangle with run $x$ and rise $y$, so $\\dfrac{y}{x} = m$, that is, $y = mx$. For a line through $(0, b)$, the slope triangle from $(0, b)$ to $(x, y)$ has run $x$ and rise $y - b$, so $\\dfrac{y - b}{x} = m$, that is, $y = mx + b$. The line through $(0, 1)$ and $(4, 7)$ has slope $\\dfrac{7 - 1}{4} = \\dfrac{3}{2}$, so it is $y = \\dfrac{3}{2}x + 1$.",
            "斜率三角形可以给出直线的方程。对于过原点、斜率为 $m$ 的直线，其上任意一点 $(x, y)$ 构成一个横向变化为 $x$、纵向变化为 $y$ 的斜率三角形，所以 $\\dfrac{y}{x} = m$，即 $y = mx$。对于过 $(0, b)$ 的直线，从 $(0, b)$ 到 $(x, y)$ 的斜率三角形横向变化为 $x$、纵向变化为 $y - b$，所以 $\\dfrac{y - b}{x} = m$，即 $y = mx + b$。过 $(0, 1)$ 和 $(4, 7)$ 的直线的斜率是 $\\dfrac{7 - 1}{4} = \\dfrac{3}{2}$，所以方程是 $y = \\dfrac{3}{2}x + 1$。",
          ],
          [
            "Put $x = 4$ into the equation: $\\dfrac{3}{2} \\cdot 4 + 1 = 7$, so $(4, 7)$ is on the line.",
            "把 $x = 4$ 代入方程：$\\dfrac{3}{2} \\cdot 4 + 1 = 7$，所以 $(4, 7)$ 在直线上。",
          ],
          [
            "The rise is the change in $y$, not the $y$-coordinate itself. From $(0, 1)$ to $(4, 7)$ the rise is $6$, not $7$.",
            "纵向变化是 $y$ 的变化量，而不是 $y$ 坐标本身。从 $(0, 1)$ 到 $(4, 7)$ 的纵向变化是 $6$，不是 $7$。",
          ],
        ],
        (rng) => {
          const b = rng.bool() ? 0 : rng.nonZero(-6, 6);
          const run = rng.int(2, 6);
          let rise = 0;
          do rise = rng.nonZero(-9, 9);
          while (Math.abs(rise) === run);
          const m = Q.of(rise, run);
          const p: XY = [run, b + rise];
          const answer = `y = ${linear(m, b)}`;
          const start: Pair = b === 0 ? ["the origin", "原点"] : [`$${pl([0, b])}$`, ` $${pl([0, b])}$ `];
          return {
            ...equated(
              [
                `A line passes through ${start[0]} and $${pl(p)}$. Use a slope triangle to write its equation in slope-intercept form.`,
                `一条直线经过${start[1]}和 $${pl(p)}$。用斜率三角形写出它的斜截式方程。`,
              ],
              answer,
              [
                [
                  ["Find the slope", "求斜率"],
                  [
                    `The slope triangle from $${pl([0, b])}$ to $${pl(p)}$ has run $${run}$ and rise $${b + rise} - ${paren(b)} = ${rise}$:`,
                    `从 $${pl([0, b])}$ 到 $${pl(p)}$ 的斜率三角形横向变化为 $${run}$，纵向变化为 $${b + rise} - ${paren(b)} = ${rise}$：`,
                  ],
                  [`m = \\frac{${rise}}{${run}} = ${m.toLatex()}`],
                ],
                [
                  ["Write the equation", "写出方程"],
                  [
                    `Every point $(x, y)$ on the line gives a similar slope triangle from $${pl([0, b])}$, with $\\dfrac{y - ${paren(b)}}{x} = ${m.toLatex()}$:`,
                    `直线上的每个点 $(x, y)$ 都与 $${pl([0, b])}$ 构成一个相似的斜率三角形，$\\dfrac{y - ${paren(b)}}{x} = ${m.toLatex()}$：`,
                  ],
                  [answer],
                ],
              ],
              [
                `Put $x = ${run}$ into the equation: $${m.toLatex()} \\cdot ${run}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`} = ${b + rise}$, the $y$-coordinate of $${pl(p)}$.`,
                `把 $x = ${run}$ 代入方程：$${m.toLatex()} \\cdot ${run}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`} = ${b + rise}$，正是 $${pl(p)}$ 的 $y$ 坐标。`,
              ],
              [
                [
                  `y = ${linear(Q.of(run, rise), b)}`,
                  "That puts the run over the rise; slope is rise over run.",
                  "这是把横向变化放在了分子上；斜率是纵向变化比横向变化。",
                ],
                [
                  `y = ${linear(Q.of(b + rise, run), b)}`,
                  "That uses the $y$-coordinate of the point as the rise instead of the change in $y$.",
                  "这是把点的 $y$ 坐标当成了纵向变化，而不是 $y$ 的变化量。",
                ],
                [`y = ${linear(m, -b)}`, "That flips the sign of the $y$-intercept.", "这是把 $y$ 轴截距的符号弄反了。"],
              ],
            ),
            solutionFigure: graphFigure(
              viewAround([[0, b], p]),
              [
                { kind: "line", a: [0, b], b: p, tone: "result" },
                ...riseRun([0, b], p),
                { kind: "point", at: [0, b], accent: true },
                { kind: "point", at: p, accent: true },
              ],
              `The run is ${run} and the rise is ${rise}, and the line crosses the y-axis at ${b}.`,
              `水平变化 ${run}，竖直变化 ${rise}，直线与 y 轴交于 ${b}。`,
            ),
          };
        },
        drawn(gradeDrawings5["using-similar-triangles-to-explain-slope#deriving-the-equation-of-a-line"]),
      ),
    ],
  ),
  [
    "A ramp rises $2$ m over a run of $5$ m. How high is it $2.5$ m along the run from the bottom?",
    "一段坡道在 $5$ 米的水平距离内升高 $2$ 米。从底部沿水平方向走 $2.5$ 米时，坡道有多高？",
  ],
  [
    "The small triangle is similar to the whole one, so the height is $\\frac{2}{5} \\times 2.5 = 1$ m.",
    "小三角形与整个三角形相似，所以高度是 $\\frac{2}{5} \\times 2.5 = 1$ 米。",
  ],
  [
    "explain slope with similar triangles, test whether a point is on a line, and derive the equation $y = mx + b$.",
    "用相似三角形解释斜率，检验一个点是否在直线上，并推导方程 $y = mx + b$。",
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

const describingASequence = withIntro(
  topic(
    "describing-a-sequence-of-transformations-that-maps-one-figure-onto-another",
    t("Describing a Sequence of Transformations That Maps One Figure Onto Another", "描述把一个图形映到另一个图形上的变换序列"),
    t(
      "Describe a dilation followed by a translation that maps one figure onto a similar one, find the translation from the coordinates, and undo the sequence.",
      "描述把一个图形映到与它相似的图形上的“先位似、再平移”的序列，由坐标求出平移，并还原这个序列。",
    ),
    ["similarity-transformations", "congruence-through-rigid-motions"],
    ["8.G.A.4"],
    [
      lesson(
        "choosing-the-sequence",
        ["Choosing the sequence", "选出变换序列"],
        [
          [
            "Two figures are **similar** if a sequence of rigid motions and dilations maps one onto the other. To describe such a sequence, compare corresponding lengths to find the **scale factor** $k = \\dfrac{A'B'}{AB}$, dilate about the origin by $k$, which multiplies every coordinate by $k$, and then find the translation that moves the dilated figure onto the image. If $A(2, 4)$ and $B(6, 4)$ map to $A'(0, 1)$ and $B'(2, 1)$, then $k = \\dfrac{2}{4} = \\dfrac{1}{2}$.",
            "如果一串刚体运动和位似能把一个图形映到另一个图形上，这两个图形就**相似**。要描述这样的序列，先比较对应的长度，求出**比例因子** $k = \\dfrac{A'B'}{AB}$；再以原点为中心按 $k$ 作位似，把每个坐标乘以 $k$；最后找出把位似后的图形移到像上的平移。若 $A(2, 4)$ 和 $B(6, 4)$ 映到 $A'(0, 1)$ 和 $B'(2, 1)$，则 $k = \\dfrac{2}{4} = \\dfrac{1}{2}$。",
          ],
          [
            "The dilation sends $A$ to $(1, 2)$ and $B$ to $(3, 2)$; the translation $(x, y) \\to (x - 1, y - 1)$ then gives $(0, 1)$ and $(2, 1)$.",
            "位似把 $A$ 映到 $(1, 2)$，把 $B$ 映到 $(3, 2)$；再按 $(x, y) \\to (x - 1, y - 1)$ 平移，得到 $(0, 1)$ 和 $(2, 1)$。",
          ],
          [
            "Dilate first, then translate. Translating first would let the dilation scale the shift as well.",
            "先位似，再平移。如果先平移，位似会把平移的距离也一起缩放。",
          ],
        ],
        (rng) => {
          for (;;) {
            const { tri, k } = pickSimilarPair(rng);
            const { move: tr, h, v } = pickTranslation(rng);
            const dil = dilation(k);
            const correct = [dil, tr];
            const img = mapAll(correct, tri);
            if (!within([...tri, ...img], 8) || !apart(tri, img)) continue;
            const inverse = dilation(Q.one.div(k));
            const fix = inverse.f(tri[0]!);
            const candidates: [Move[], string, string][] = [
              [[tr, dil], "That translates first, so the dilation scales the shift too.", "这是先平移，于是位似把平移的距离也缩放了。"],
              [[dil, translation(-h, -v)], "That translates the opposite way.", "这是朝相反的方向平移了。"],
              ...(Number.isInteger(fix[0]) && Number.isInteger(fix[1])
                ? [
                    [
                      [inverse, translation(img[0]![0] - fix[0], img[0]![1] - fix[1])],
                      "That uses the reciprocal scale factor: it only gets $A$ right.",
                      "这是用了比例因子的倒数：它只把 $A$ 映对了。",
                    ] as [Move[], string, string],
                  ]
                : []),
              [[dil, translation(v, h)], "That swaps the horizontal and vertical shifts.", "这是把水平和竖直的移动量弄反了。"],
            ];
            const kept: [Move[], string, string][] = [];
            for (const c of candidates) {
              const pts = mapAll(c[0], tri);
              if (![correct, ...kept.map((m) => m[0])].some((m) => sameList(mapAll(m, tri), pts))) kept.push(c);
            }
            if (kept.length < 3) continue;
            const coords = tri.map((p, i) => `$${ABC[i]}${pl(p)}$`);
            const mids = tri.map((p) => dil.f(p));
            return {
              ...chosen(
                rng,
                [
                  `Which sequence maps $\\triangle ABC$, with ${coords.join(", ")}, onto $\\triangle A'B'C'$?`,
                  `哪一串变换把 $\\triangle ABC$（${coords.join("，")}）映到 $\\triangle A'B'C'$ 上？`,
                ],
                seqPair(correct),
                kept.slice(0, 3).map(([m, en, zh]): Wrong => [seqPair(m), en, zh]),
                [
                  [
                    ["Dilate", "位似"],
                    [`${cap(dil.name.en)}:`, `${zhName(dil)}：`],
                    tri.map((p, i) => `${ABC[i]}${pl(p)} \\to ${pl(mids[i]!)}`),
                  ],
                  [
                    ["Then translate", "再平移"],
                    [`${cap(tr.name.en)}:`, `${zhName(tr)}：`],
                    mids.map((p, i) => `${pl(p)} \\to ${ABC[i]}'${pl(img[i]!)}`),
                  ],
                ],
                [
                  `Every vertex lands on its image, and each side of $\\triangle A'B'C'$ is $${k.toLatex()}$ times as long as the matching side of $\\triangle ABC$.`,
                  `每个顶点都落在它的像上，而且 $\\triangle A'B'C'$ 的每条边都是 $\\triangle ABC$ 对应边的 $${k.toLatex()}$ 倍。`,
                ],
                graph(
                  [...polygonMarks(tri, ABC, false), ...polygonMarks(img, primed)],
                  "Triangle ABC and the similar triangle A′B′C′ on a coordinate grid.",
                  "坐标网格上的三角形 ABC 和与它相似的三角形 A′B′C′。",
                ),
              ),
              solutionFigure: stagedPolygon(ABC, [tri, mapAll([dil], tri), img]),
            };
          }
        },
        drawn(gradeDrawings5["describing-a-sequence-of-transformations-that-maps-one-figure-onto-another#choosing-the-sequence"]),
      ),
      lesson(
        "finding-the-translation",
        ["Finding the translation", "求平移"],
        [
          [
            "When a dilation about the origin is followed by a translation $(x, y) \\to (x + a, y + b)$, find the scale factor first, then the translation. The scale factor $k$ is the change in a coordinate between two image points divided by the change between the preimage points. The dilation sends $A$ to $(kx_A, ky_A)$, and the translation carries this point to $A'$. So $a = x_{A'} - kx_A$ and $b = y_{A'} - ky_A$.",
            "当以原点为中心的位似之后接着平移 $(x, y) \\to (x + a, y + b)$ 时，先求比例因子，再求平移。比例因子 $k$ 等于两个像点之间某个坐标的变化量除以对应原像点之间这个坐标的变化量。位似把 $A$ 映到 $(kx_A, ky_A)$，平移再把这个点移到 $A'$。所以 $a = x_{A'} - kx_A$，$b = y_{A'} - ky_A$。",
          ],
          [
            "For $A(2, 1) \\to A'(1, 5)$ and $B(4, 3) \\to B'(7, 11)$: $k = \\dfrac{7 - 1}{4 - 2} = 3$, and $(a, b) = (1 - 6, 5 - 3) = (-5, 2)$. Then $B$ goes to $(12, 9)$ and on to $(7, 11)$.",
            "对 $A(2, 1) \\to A'(1, 5)$，$B(4, 3) \\to B'(7, 11)$：$k = \\dfrac{7 - 1}{4 - 2} = 3$，$(a, b) = (1 - 6, 5 - 3) = (-5, 2)$。于是 $B$ 先到 $(12, 9)$，再到 $(7, 11)$。",
          ],
          [
            "Subtract the dilated point, not $A$ itself. $A' - A = (-1, 4)$ is not the translation.",
            "要减去位似后的点，而不是 $A$ 本身。$A' - A = (-1, 4)$ 不是这个平移。",
          ],
        ],
        (rng) => {
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
            return {
              ...locatedAs(
                [
                  `A dilation about the origin, followed by the translation $(x, y) \\to (x + a, y + b)$, maps $A${pl(a)}$ to $A'${pl(a2)}$ and $B${pl(b)}$ to $B'${pl(b2)}$. Find $(a, b)$.`,
                  `以原点为中心的一次位似，接着平移 $(x, y) \\to (x + a, y + b)$，把 $A${pl(a)}$ 映到 $A'${pl(a2)}$，把 $B${pl(b)}$ 映到 $B'${pl(b2)}$。求 $(a, b)$。`,
                ],
                [h, v],
                ["a", "b"],
                [
                  [
                    ["Find the scale factor", "求比例因子"],
                    ["Compare the changes in the $x$-coordinates:", "比较 $x$ 坐标的变化量："],
                    [`k = \\frac{${b2[0]} - ${paren(a2[0])}}{${b[0]} - ${paren(a[0])}} = ${k.toLatex()}`],
                  ],
                  [
                    ["Find the shift", "求移动量"],
                    [
                      `The dilation sends $A$ to $${pl(ka)}$, and the translation carries this point to $A'${pl(a2)}$:`,
                      `位似把 $A$ 映到 $${pl(ka)}$，平移再把这个点移到 $A'${pl(a2)}$：`,
                    ],
                    [`a = ${a2[0]} - ${paren(ka[0])} = ${h}`, `b = ${a2[1]} - ${paren(ka[1])} = ${v}`],
                  ],
                ],
                [
                  `Follow $B$: the dilation gives $${pl(kb)}$, and the shift gives $${pl(b2)}$, which is $B'$.`,
                  `跟踪 $B$：位似后得 $${pl(kb)}$，再平移得 $${pl(b2)}$，正是 $B'$。`,
                ],
                [
                  [
                    [a2[0] - a[0], a2[1] - a[1]],
                    "That subtracts $A$ itself, not its image under the dilation.",
                    "这是减去了 $A$ 本身，而不是它在位似下的像。",
                  ],
                  [[ka[0] - a2[0], ka[1] - a2[1]], "That subtracts in the wrong order.", "这是减反了顺序。"],
                  [
                    [Q.of(a2[0]).sub(Q.of(a[0]).div(k)), Q.of(a2[1]).sub(Q.of(a[1]).div(k))],
                    "That divides by the scale factor instead of multiplying by it.",
                    "这是除以了比例因子，而不是乘以它。",
                  ],
                ],
              ),
              solutionFigure: tracked(["A", "A′"], [a, ka, a2]),
            };
          }
        },
        drawn(gradeDrawings5["describing-a-sequence-of-transformations-that-maps-one-figure-onto-another#finding-the-translation"]),
      ),
      lesson(
        "undoing-the-sequence",
        ["Undoing the sequence", "还原变换序列"],
        [
          [
            "To map the image back onto the original figure, undo the transformations **in reverse order**: undo the last one first. A translation $(x, y) \\to (x + a, y + b)$ is undone by $(x, y) \\to (x - a, y - b)$. A dilation about the origin with scale factor $k$ is undone by the dilation with scale factor $\\dfrac{1}{k}$. So if a dilation by $3$ followed by $(x, y) \\to (x + 2, y - 5)$ maps $F$ onto $G$, then $(x, y) \\to (x - 2, y + 5)$ followed by a dilation by $\\dfrac{1}{3}$ maps $G$ back onto $F$.",
            "要把像映回原来的图形，就**按相反的顺序**还原各个变换：先还原最后一个。平移 $(x, y) \\to (x + a, y + b)$ 用 $(x, y) \\to (x - a, y - b)$ 还原。以原点为中心、比例因子为 $k$ 的位似，用比例因子为 $\\dfrac{1}{k}$ 的位似还原。所以，若比例因子为 $3$ 的位似接着 $(x, y) \\to (x + 2, y - 5)$ 把 $F$ 映到 $G$ 上，那么先按 $(x, y) \\to (x - 2, y + 5)$ 平移、再作比例因子为 $\\dfrac{1}{3}$ 的位似，就把 $G$ 映回 $F$。",
          ],
          [
            "Follow $(1, 1)$: it goes to $(3, 3)$ and then $(5, -2)$; undoing gives $(3, 3)$ and then $(1, 1)$ again.",
            "跟踪 $(1, 1)$：它先到 $(3, 3)$，再到 $(5, -2)$；还原时先回到 $(3, 3)$，再回到 $(1, 1)$。",
          ],
          [
            "Undoing the dilation first fails: shrinking $(5, -2)$ by $\\dfrac{1}{3}$ gives $\\left(\\dfrac{5}{3}, -\\dfrac{2}{3}\\right)$, and the shift then misses $(1, 1)$.",
            "先还原位似就不对了：把 $(5, -2)$ 按 $\\dfrac{1}{3}$ 缩小得 $\\left(\\dfrac{5}{3}, -\\dfrac{2}{3}\\right)$，再平移就到不了 $(1, 1)$。",
          ],
        ],
        (rng) => {
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
          const test: XY = [d, d];
          const scaled: XY = [n, n];
          const moved: XY = [n + h, n + v];
          return chosen(
            rng,
            [
              `${cap(sequenceName([dil, tr]).en)}, maps figure $${figures[0]}$ onto figure $${figures[1]}$. Which sequence maps $${figures[1]}$ back onto $${figures[0]}$?`,
              `先作${sequenceName([dil, tr])["zh-CN"]}，把图形 $${figures[0]}$ 映到图形 $${figures[1]}$ 上。哪一串变换把 $${figures[1]}$ 映回 $${figures[0]}$？`,
            ],
            seqPair([back, inverse]),
            [
              [
                seqPair([inverse, back]),
                "That undoes the dilation first; the last transformation must be undone first.",
                "这是先还原了位似；应该先还原最后一个变换。",
              ],
              [
                seqPair([back, dil]),
                `That dilates by $${k.toLatex()}$ again instead of by $${Q.one.div(k).toLatex()}$.`,
                `这是又按 $${k.toLatex()}$ 作了位似，而不是按 $${Q.one.div(k).toLatex()}$。`,
              ],
              [seqPair([tr, inverse]), "That repeats the translation instead of reversing it.", "这是重复了平移，而不是反向平移。"],
            ],
            [
              [
                ["Undo the translation", "还原平移"],
                [
                  `The translation came last, so undo it first with $${rule(-h, -v)}$.`,
                  `平移是最后作的，所以先用 $${rule(-h, -v)}$ 还原它。`,
                ],
              ],
              [
                ["Undo the dilation", "还原位似"],
                [
                  `Then undo the dilation with scale factor $${k.toLatex()}$ by the dilation with scale factor $${Q.one.div(k).toLatex()}$.`,
                  `再用比例因子为 $${Q.one.div(k).toLatex()}$ 的位似还原比例因子为 $${k.toLatex()}$ 的位似。`,
                ],
              ],
            ],
            [
              `Follow $${pl(test)}$: the sequence takes it to $${pl(scaled)}$, then $${pl(moved)}$; undoing takes $${pl(moved)}$ back to $${pl(scaled)}$, then $${pl(test)}$.`,
              `跟踪 $${pl(test)}$：原序列把它映到 $${pl(scaled)}$，再到 $${pl(moved)}$；还原时把 $${pl(moved)}$ 映回 $${pl(scaled)}$，再回到 $${pl(test)}$。`,
            ],
          );
        },
        graph(
          [
            ...polygonMarks(
              [
                [-2, 1],
                [-1, 1],
                [-2, 2],
              ],
              ["F", "", ""],
              false,
            ),
            ...polygonMarks(
              [
                [-4, -2],
                [-1, -2],
                [-4, 1],
              ],
              ["G", "", ""],
            ),
          ],
          "A small triangle F and a triangle G three times as large, moved down and to the right.",
          "一个小三角形 F，和一个大三倍、向右下方移动过的三角形 G。",
        ),
      ),
    ],
  ),
  [
    "A photo $4$ cm wide is enlarged to $12$ cm wide and then moved to a corner of a poster. What is the scale factor?",
    "一张宽 $4$ 厘米的照片被放大到宽 $12$ 厘米，然后移到海报的一角。比例因子是多少？",
  ],
  ["It is $12 \\div 4 = 3$; moving the photo afterward does not change its size.", "是 $12 \\div 4 = 3$；之后移动照片并不改变它的大小。"],
  [
    "describe a dilation followed by a translation, find the translation from coordinates, and undo the sequence.",
    "描述先位似再平移的序列，由坐标求出平移，并还原这个序列。",
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
