import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, dec, linear, type Mark, type Point, Q, sketch } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { pointLatex, unitLatex } from "../problems.ts";
import { rectangle, scaleneTriangle, sides } from "./area.ts";
import type { MathWrong, Pair, Walk } from "./early-grades-more-kit.ts";
import { mathText } from "./grade-4-fractions.ts";
import { chosenMath, decided, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";

// 7th Grade Math, geometry: segments, angles, polygons, perimeter, scale drawings, circles and prisms.

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

const units = ["cm", "m", "in", "ft"] as const;

/** unitWords spells out each unit, since a prompt reading "in in" would be hard to read. */
const unitWords: Record<(typeof units)[number], string> = { cm: "centimeters", m: "meters", in: "inches", ft: "feet" };

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

/** pickUnit draws a unit of length. */
const pickUnit = (rng: Rng): Unit => rng.pick(units);

/** fig builds a figure from sketch marks. */
const fig = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** rad converts degrees to radians. */
const rad = (d: number) => (d * Math.PI) / 180;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 5, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

/** minus writes a number for a figure with a true minus sign: "−4". */
const minus = (v: number | string) => String(v).replace(/^-/, "−");

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** angleTex writes cx + d degrees in LaTeX: "(3x - 20)^\circ". */
const angleTex = (c: number, d: number) => `(${linear(c, d)})^\\circ`;

/** over writes a segment's name with a bar: "\overline{AB}". */
const over = (name: string) => `\\overline{${name}}`;

/** Linear is the expression c·x + d. */
type Linear = readonly [number, number];

/** at evaluates c·x + d. */
const at = ([c, d]: Linear, x: number) => c * x + d;

/** expressionFor writes the value v as c·x + d at the given x, with c from 1 to 6 and d ≠ 0, avoiding the coefficients in avoid. */
function expressionFor(rng: Rng, v: number, x: number, avoid: readonly number[] = []): Linear {
  const cs = [1, 2, 3, 4, 5, 6].filter((c) => !avoid.includes(c) && c * x !== v);
  const c = rng.pick(cs);
  return [c, v - c * x];
}

/** subst writes c·x + d with a number put in for x: "3 \\cdot 5 + 4". */
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
  return [`${sum} = ${total}`, `${linear(c, d)} = ${total}`, `${linear(c, 0)} = ${total - d}`, `x = ${Q.of(total - d, c).toLatex()}`];
}

/** sumWrong are the values of x that common slips in solving the sum equation produce: the constant added with the wrong sign, or the wrong total. */
function sumWrong(terms: readonly Linear[], total: number, wrongTotal: number): Q[] {
  const c = terms.reduce((s, [ci]) => s + ci, 0);
  const d = terms.reduce((s, [, di]) => s + di, 0);
  return [Q.of(total + d, c), Q.of(wrongTotal - d, c)];
}

/** equalWrong are the values of x that common slips in solving c1·x + d1 = c2·x + d2 produce. */
function equalWrong([c1, d1]: Linear, [c2, d2]: Linear): Q[] {
  return [Q.of(d2 + d1, c1 - c2), Q.of(d2 - d1, c1 + c2)];
}

/** collecting says how to finish solving for x from the lines that remain: divide only when a step is left after collecting. */
const collecting = (rest: readonly string[]): Pair =>
  rest.length > 1
    ? ["Collect $x$ on one side, then divide:", "把 $x$ 集中到一边，再相除："]
    : ["Collect $x$ on one side:", "把 $x$ 集中到一边："];

/** awayFrom is the compass direction from c toward p, used to put a vertex name outside a figure. */
function awayFrom(p: Point, c: Point): Compass {
  const a = (Math.atan2(p[1] - c[1], p[0] - c[0]) * 180) / Math.PI;
  const names: Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];
  return names[(((Math.round(a / 45) % 8) + 8) % 8) as 0]!;
}

/** centroid is the average of points. */
const centroid = (pts: readonly Point[]): Point => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
];

/** names labels points with italic letters, each pushed away from the center c. */
function names(pts: readonly Point[], letters: string, c: Point = centroid(pts)): Mark[] {
  return pts.map((p, i): Mark => ({ kind: "label", at: p, text: letters[i]!, dir: awayFrom(p, c), italic: true }));
}

/** dot marks a point with a dot and an italic name in direction d. */
const dot = (p: Point, name: string, d: Compass): Mark[] => [
  { kind: "dot", at: p },
  { kind: "label", at: p, text: name, dir: d, italic: true },
];

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

/** ticks marks a segment with count tick marks a third of the way along, clear of a label at its middle. */
const ticks = (a: Point, b: Point, count = 1): Mark => ({ kind: "ticks", a, b: lerp(a, b, 0.6), count });

/** lerp is the point a fraction f of the way from a to b. */
const lerp = (a: Point, b: Point, f: number): Point => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];

/** result writes a computed value, with its decimal form when it is a fraction with a short decimal. */
const result = (v: Q) => (v.isInteger() ? v.toLatex() : terminates(v) ? dec(v) : v.toLatex());

/** terminates tells whether a fraction has a finite decimal of at most three places. */
const terminates = (v: Q) => v.mul(Q.of(1000)).isInteger();

/** halves draws a number of halves from lo to hi that is not a whole number. */
function halves(rng: Rng, lo: number, hi: number): Q {
  return Q.of(2 * rng.int(lo, hi - 1) + 1, 2);
}

// ---------------------------------------------------------------------------
// Segments

/** numberLine draws a number line from min to max with a tick at every integer and named points above it. */
function numberLine(min: number, max: number, points: readonly (readonly [number, string])[], accent?: readonly [number, number]): Mark[] {
  const tk = (max - min) * 0.018;
  const every = max - min <= 12 ? 1 : 2;
  const marks: Mark[] = [
    seg([min - 0.7, 0], [max + 0.7, 0]),
    seg([max + 0.7, 0], [max + 0.35, tk]),
    seg([max + 0.7, 0], [max + 0.35, -tk]),
    seg([min - 0.7, 0], [min - 0.35, tk]),
    seg([min - 0.7, 0], [min - 0.35, -tk]),
  ];
  for (let v = min; v <= max; v++) {
    marks.push(seg([v, -tk], [v, tk]));
    if ((v - min) % every === 0) marks.push({ kind: "label", at: [v, -tk], text: minus(v), dir: "s" });
  }
  if (accent) marks.push(seg([accent[0], 0], [accent[1], 0], true));
  for (const [v, name] of points) marks.push(...dot([v, 0], name, "n"));
  return marks;
}

/** segmentNames are pairs of endpoint names for one segment. */
const segmentNames = [
  ["A", "B"],
  ["P", "Q"],
  ["M", "N"],
  ["R", "S"],
  ["J", "K"],
] as const;

/** rulerMarks draws a ruler from 0 to n cm, marked every half centimeter, with segment pq above it from x0 to x1. */
function rulerMarks(n: number, x0: number, x1: number, p: string, q: string): Mark[] {
  const marks: Mark[] = [{ kind: "polygon", points: rectangle(n + 0.8, 1.6).map(([x, y]): Point => [x - 0.4, y - 1.6]) }];
  for (let i = 0; i <= 2 * n; i++) {
    marks.push(seg([i / 2, 0], [i / 2, i % 2 === 0 ? -0.5 : -0.3]));
    if (i % 2 === 0) marks.push({ kind: "label", at: [i / 2, -0.5], text: String(i / 2), dir: "s" });
  }
  marks.push(
    { kind: "segment", a: [x0, 0.7], b: [x0, 0], dashed: true },
    { kind: "segment", a: [x1, 0.7], b: [x1, 0], dashed: true },
    seg([x0, 0.7], [x1, 0.7], true),
    ...dot([x0, 0.7], p, "n"),
    ...dot([x1, 0.7], q, "n"),
  );
  return marks;
}

export const measuresOfSegments = withIntro(
  topic(
    "measures-of-segments",
    t("Measures of Segments", "线段的长度"),
    t(
      "The measure of a segment is its length, the distance between its endpoints; the length of segment AB is written AB, without the bar. On a ruler or a number line, subtract the coordinates of the endpoints: a segment from the 2 cm mark to the 7.5 cm mark is 7.5 − 2 = 5.5 cm long, and points at −4 and 3 are 3 − (−4) = 7 units apart.",
      "线段的长度就是两个端点之间的距离；线段 AB 的长度记作 AB，不加横线。在尺子或数轴上，用两个端点的读数相减：从 2 厘米刻度到 7.5 厘米刻度的线段长 7.5 − 2 = 5.5 厘米，位于 −4 和 3 的两点相距 3 − (−4) = 7 个单位。",
    ),
    ["points-lines-rays-and-segments", "absolute-value"],
    ["7.G.A.1"],
    [
      lesson(
        "lengths-on-a-ruler",
        ["Measuring with a ruler", "用尺子量长度"],
        [
          [
            "A segment that does not start at the $0$ mark of a ruler is measured by subtracting the two readings. If $\\overline{PQ}$ runs from the $3$ cm mark to the $8.5$ cm mark, then $PQ = 8.5 - 3 = 5.5$ cm.",
            "线段的起点不在尺子的 $0$ 刻度时，用两端的读数相减。若 $\\overline{PQ}$ 从 $3$ 厘米刻度到 $8.5$ 厘米刻度，则 $PQ = 8.5 - 3 = 5.5$ 厘米。",
          ],
          [
            "Count the half-centimeter gaps from $3$ to $8.5$: there are $11$ of them, and $11 \\times 0.5 = 5.5$ cm.",
            "数一数从 $3$ 到 $8.5$ 有几个半厘米的小格：共 $11$ 格，$11 \\times 0.5 = 5.5$ 厘米。",
          ],
          [
            "The short marks between the numbers are half centimeters, so each gap counts $0.5$ cm, not $1$ cm.",
            "数字之间的短刻度是半厘米，每一小格是 $0.5$ 厘米，而不是 $1$ 厘米。",
          ],
        ],
        (rng) => {
          const n = rng.int(8, 12);
          const a2 = rng.int(1, 2 * n - 5);
          const b2 = rng.int(a2 + 3, 2 * n);
          const [a, b] = [Q.of(a2, 2), Q.of(b2, 2)];
          const len = b.sub(a);
          const [p, q] = rng.pick(segmentNames);
          const gaps = b2 - a2;
          return valued(
            [`The ruler is marked in centimeters. How long is $${over(p + q)}$?`, `尺子的刻度以厘米为单位。$${over(p + q)}$ 有多长？`],
            len,
            [
              [
                ["Read both ends", "读出两端"],
                [
                  `$${p}$ is at the $${dec(a)}$ cm mark and $${q}$ is at the $${dec(b)}$ cm mark, so the segment does not start at $0$:`,
                  `$${p}$ 在 $${dec(a)}$ 厘米刻度，$${q}$ 在 $${dec(b)}$ 厘米刻度，线段的起点不在 $0$：`,
                ],
                [`${dec(a)}\\text{ cm},\\ ${dec(b)}\\text{ cm}`],
              ],
              [
                ["Subtract", "相减"],
                ["Subtract the smaller reading from the larger:", "用较大的读数减去较小的读数："],
                [`${p}${q} = ${dec(b)} - ${dec(a)} = ${dec(len)}\\text{ cm}`],
              ],
            ],
            [
              `Count the half-centimeter gaps from $${dec(a)}$ to $${dec(b)}$: there are $${gaps}$, and $${gaps} \\times 0.5 = ${dec(len)}$ cm.`,
              `数一数从 $${dec(a)}$ 到 $${dec(b)}$ 的半厘米小格：共 $${gaps}$ 格，$${gaps} \\times 0.5 = ${dec(len)}$ 厘米。`,
            ],
            [
              [
                b,
                `That is the reading at $${q}$. The segment starts at $${dec(a)}$, not at $0$.`,
                `这是 $${q}$ 处的读数。线段的起点在 $${dec(a)}$，不在 $0$。`,
              ],
              [a.add(b), "That adds the two readings. The length is their difference.", "这是把两个读数相加了。长度是它们的差。"],
              [
                len.mul(Q.of(2)),
                "That counts each half-centimeter gap as $1$ cm. Each gap is $0.5$ cm.",
                "这是把每个半厘米小格当成了 $1$ 厘米。每一小格是 $0.5$ 厘米。",
              ],
            ],
            {
              form: "decimal",
              unit: "cm",
              figure: fig(
                rulerMarks(n, a.toNumber(), b.toNumber(), p, q),
                `A ruler from 0 to ${n} cm, marked every half centimeter. Segment ${p}${q} runs from the ${dec(a)} cm mark to the ${dec(b)} cm mark.`,
                `一把 0 到 ${n} 厘米的尺子，每半厘米一个刻度。线段 ${p}${q} 从 ${dec(a)} 厘米刻度到 ${dec(b)} 厘米刻度。`,
              ),
            },
          );
        },
        fig(
          rulerMarks(9, 3, 8.5, "P", "Q"),
          "A ruler from 0 to 9 cm, marked every half centimeter. Segment PQ runs from the 3 cm mark to the 8.5 cm mark.",
          "一把 0 到 9 厘米的尺子，每半厘米一个刻度。线段 PQ 从 3 厘米刻度到 8.5 厘米刻度。",
        ),
      ),
      lesson(
        "lengths-on-a-number-line",
        ["Lengths on a number line", "数轴上的长度"],
        [
          [
            "On a number line, the length of a segment is the larger coordinate minus the smaller one. For $A$ at $-6$ and $B$ at $2$, $AB = 2 - (-6) = 8$.",
            "在数轴上，线段的长度等于较大的坐标减去较小的坐标。$A$ 在 $-6$，$B$ 在 $2$，则 $AB = 2 - (-6) = 8$。",
          ],
          [
            "Count in two parts: from $-6$ to $0$ is $6$ units and from $0$ to $2$ is $2$ more, so $6 + 2 = 8$.",
            "分两段数：从 $-6$ 到 $0$ 是 $6$ 个单位，从 $0$ 到 $2$ 又是 $2$ 个，共 $6 + 2 = 8$。",
          ],
          [
            "Subtracting $6 - 2 = 4$ is wrong: when the points sit on both sides of $0$, the two distances add.",
            "算成 $6 - 2 = 4$ 是错的：两点在 $0$ 的两侧时，两段距离要相加。",
          ],
        ],
        (rng) => {
          const a = rng.int(-10, 8);
          const b = rng.int(a + 2, 10);
          const [p, q] = rng.pick(segmentNames);
          const len = b - a;
          const sub = a < 0 ? `${b} - (${a})` : `${b} - ${a}`;
          const across = a < 0 && b > 0;
          return valued(
            [`Find $${p}${q}$.`, `求 $${p}${q}$。`],
            len,
            [
              [
                ["Read the coordinates", "读出坐标"],
                [
                  `$${p}$ is at $${a}$ and $${q}$ is at $${b}$, so $${q}$ has the larger coordinate:`,
                  `$${p}$ 在 $${a}$，$${q}$ 在 $${b}$，所以 $${q}$ 的坐标较大：`,
                ],
                [`${b} > ${a}`],
              ],
              [
                ["Subtract", "相减"],
                ["Subtract the smaller coordinate from the larger:", "用较大的坐标减去较小的坐标："],
                [`${p}${q} = ${sub} = ${len}`],
              ],
            ],
            across
              ? [
                  `Count in two parts: from $${a}$ to $0$ is $${-a}$ units and from $0$ to $${b}$ is $${b}$ more, so $${-a} + ${b} = ${len}$.`,
                  `分两段数：从 $${a}$ 到 $0$ 是 $${-a}$ 个单位，从 $0$ 到 $${b}$ 又是 $${b}$ 个，共 $${-a} + ${b} = ${len}$。`,
                ]
              : [
                  `Count up from $${p}$: moving $${len}$ units right from $${a}$ lands on $${a} + ${len} = ${b}$, where $${q}$ is.`,
                  `从 $${p}$ 往右数：从 $${a}$ 向右走 $${len}$ 个单位，到达 $${a} + ${len} = ${b}$，正是 $${q}$ 的位置。`,
                ],
            [
              [
                Math.abs(Math.abs(b) - Math.abs(a)),
                "That subtracts the distances from $0$. When the points sit on both sides of $0$, add those distances.",
                "这是把到 $0$ 的距离相减了。两点在 $0$ 的两侧时，要把这两段距离相加。",
              ],
              [
                a + b,
                "That adds the coordinates. The length is the larger one minus the smaller one.",
                "这是把坐标相加了。长度是较大的坐标减去较小的坐标。",
              ],
              [len + 1, "That counts the tick marks, not the gaps between them.", "这是数了刻度线的条数，而不是刻度之间的间隔。"],
            ],
            {
              form: "integer",
              figure: fig(
                numberLine(-10, 10, [
                  [a, p],
                  [b, q],
                ]),
                `A number line from −10 to 10 with ${p} at ${minus(a)} and ${q} at ${minus(b)}.`,
                `一条从 −10 到 10 的数轴，${p} 在 ${minus(a)}，${q} 在 ${minus(b)}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["measures-of-segments#lengths-on-a-number-line"]),
      ),
    ],
  ),
  [
    "A pencil lies on a ruler from the $2$ cm mark to the $9$ cm mark. It is not $9$ cm long: it starts at $2$, so it is $9 - 2 = 7$ cm long.",
    "一支铅笔放在尺子上，从 $2$ 厘米刻度到 $9$ 厘米刻度。它不是 $9$ 厘米长：它从 $2$ 开始，所以长 $9 - 2 = 7$ 厘米。",
  ],
  ["Slide the pencil back to start at $0$: its end moves to $9 - 2 = 7$.", "把铅笔往回移到从 $0$ 开始：它的另一端移到 $9 - 2 = 7$。"],
  [
    "measure segments on a ruler and on a number line by subtracting the readings at their ends.",
    "用两端读数相减的方法，在尺子和数轴上量线段的长度。",
  ],
);

/** pairName names the segment between the points at indices i < j of the letters. */
const pairName = (letters: string, i: number, j: number) => `${letters[Math.min(i, j)]}${letters[Math.max(i, j)]}`;

/** twoSegments draws two segments marked congruent: AB horizontal and CD slanted, with labels. */
function twoSegments(rng: Rng, labelAB: string, labelCD: string, count = 1): Mark[] {
  return twoSegmentsAt(rng.pick([25, 35, 145, 155]), labelAB, labelCD, count);
}

/** twoSegmentsAt draws two segments marked congruent: AB horizontal and CD slanted at the given turn, with labels. */
function twoSegmentsAt(turn: number, labelAB: string, labelCD: string, count = 1): Mark[] {
  const a: Point = [0, 0];
  const b: Point = [8, 0];
  const c: Point = [12, turn < 90 ? -1 : 4];
  const d = dir(turn, 8, c);
  const [lo, hi] = d[0] > c[0] ? [c, d] : [d, c];
  return [
    seg(a, b),
    seg(c, d),
    ticks(a, b, count),
    ticks(lo, hi, count),
    ...dot(a, "A", "w"),
    ...dot(b, "B", "e"),
    ...dot(c, "C", turn < 90 ? "s" : "n"),
    ...dot(d, "D", turn < 90 ? "n" : "s"),
    { kind: "side", a: b, b: a, text: labelAB },
    { kind: "side", a: hi, b: lo, text: labelCD },
  ];
}

/** wrapped writes a coordinate for a subtraction, in parentheses when it is negative. */
const wrapped = (v: number) => (v < 0 ? `(${v})` : `${v}`);

export const congruentSegments = withIntro(
  topic(
    "congruent-segments",
    t("Congruent Segments", "全等线段"),
    t(
      "Segments with the same length are congruent. AB ≅ CD (read “segment AB is congruent to segment CD”) means AB = CD. In a figure, congruent segments are marked with the same number of tick marks. When congruent segments have lengths written as expressions, set the expressions equal and solve.",
      "长度相等的线段叫全等线段。AB ≅ CD（读作“线段 AB 全等于线段 CD”）表示 AB = CD。在图中，全等的线段用相同数量的短竖线标出。全等线段的长度用式子表示时，令两个式子相等，再解方程。",
    ),
    ["measures-of-segments", "equations-with-variables-on-both-sides"],
    ["7.G.A.1"],
    [
      lesson(
        "identifying-congruent-segments",
        ["Finding congruent segments", "找出全等线段"],
        [
          [
            "To decide whether two segments are congruent, compare their lengths. With $A$ at $-5$, $B$ at $-1$, $C$ at $2$ and $D$ at $6$: $AB = -1 - (-5) = 4$ and $CD = 6 - 2 = 4$, so $\\overline{AB} \\cong \\overline{CD}$.",
            "判断两条线段是否全等，就比较它们的长度。$A$ 在 $-5$，$B$ 在 $-1$，$C$ 在 $2$，$D$ 在 $6$：$AB = -1 - (-5) = 4$，$CD = 6 - 2 = 4$，所以 $\\overline{AB} \\cong \\overline{CD}$。",
          ],
          [
            "Slide $\\overline{AB}$ right by $7$: its ends move from $-5$ and $-1$ to $2$ and $6$, exactly onto $\\overline{CD}$.",
            "把 $\\overline{AB}$ 向右平移 $7$：两端从 $-5$ 和 $-1$ 移到 $2$ 和 $6$，正好与 $\\overline{CD}$ 重合。",
          ],
          [
            "Segments can be congruent without sharing an endpoint, and two segments that share an endpoint need not be congruent. Only the lengths decide.",
            "全等的线段不一定有公共端点，有公共端点的两条线段也不一定全等。只看长度。",
          ],
        ],
        (rng) => {
          for (;;) {
            const L = rng.int(2, 7);
            const p = rng.int(-9, 9 - L);
            const q = rng.int(-9, 9 - L);
            const r = rng.int(-9, 9);
            const coords = [p, p + L, q, q + L, r];
            if (new Set(coords).size < 5) continue;
            const sorted = [...coords].sort((x, y) => x - y);
            const letters = "ABCDE";
            const index = (v: number) => sorted.indexOf(v);
            const target = pairName(letters, index(p), index(p + L));
            const correct = pairName(letters, index(q), index(q + L));
            const others: string[] = [];
            for (let i = 0; i < 5; i++)
              for (let j = i + 1; j < 5; j++) if (sorted[j]! - sorted[i]! !== L) others.push(pairName(letters, i, j));
            if (others.length < 3) continue;
            const ends = (n: string): [number, number] => [sorted[letters.indexOf(n[0]!)]!, sorted[letters.indexOf(n[1]!)]!];
            const measured = (n: string) => {
              const [lo, hi] = ends(n);
              return `${n} = ${hi} - ${wrapped(lo)} = ${hi - lo}`;
            };
            const wrong = rng.shuffle(others).slice(0, 3);
            const shift = q - p;
            return chosenMath(
              rng,
              [`Which segment is congruent to $${over(target)}$?`, `哪条线段与 $${over(target)}$ 全等？`],
              over(correct),
              wrong.map((w) => {
                const [lo, hi] = ends(w);
                return [over(w), `$${w} = ${hi - lo}$, not $${L}$.`, `$${w} = ${hi - lo}$，不是 $${L}$。`] as const;
              }),
              [
                [
                  ["Measure the given segment", "量出给定的线段"],
                  ["Subtract the coordinates of its ends:", "用两端的坐标相减："],
                  [measured(target)],
                ],
                [
                  ["Find the same length", "找出同样长的线段"],
                  [`Of the choices, only one segment is also $${L}$ long:`, `选项中只有一条线段也长 $${L}$：`],
                  [measured(correct)],
                ],
              ],
              [
                `Slide $${over(target)}$ ${shift > 0 ? "right" : "left"} by $${Math.abs(shift)}$: its ends move from $${p}$ and $${p + L}$ to $${q}$ and $${q + L}$, exactly onto $${over(correct)}$.`,
                `把 $${over(target)}$ 向${shift > 0 ? "右" : "左"}平移 $${Math.abs(shift)}$：两端从 $${p}$ 和 $${p + L}$ 移到 $${q}$ 和 $${q + L}$，正好与 $${over(correct)}$ 重合。`,
              ],
              fig(
                numberLine(
                  -10,
                  10,
                  sorted.map((v, i) => [v, letters[i]!] as const),
                ),
                `A number line from −10 to 10 with points ${sorted.map((v, i) => `${letters[i]} at ${minus(v)}`).join(", ")}.`,
                `一条从 −10 到 10 的数轴，${sorted.map((v, i) => `${letters[i]} 在 ${minus(v)}`).join("，")}。`,
              ),
            );
          }
        },
        fig(
          numberLine(-10, 10, [
            [-5, "A"],
            [-1, "B"],
            [2, "C"],
            [6, "D"],
          ]),
          "A number line from −10 to 10 with A at −5, B at −1, C at 2 and D at 6.",
          "一条从 −10 到 10 的数轴，A 在 −5，B 在 −1，C 在 2，D 在 6。",
        ),
      ),
      lesson(
        "congruent-segments-with-algebra",
        ["Congruent segments with algebra", "用方程求全等线段"],
        [
          [
            "In the figure, $\\overline{AB} \\cong \\overline{CD}$, $AB = 3x + 4$ and $CD = 5x - 6$. Congruent segments have equal lengths, so $3x + 4 = 5x - 6$, which gives $10 = 2x$ and $x = 5$. Then $AB = 3 \\cdot 5 + 4 = 19$.",
            "如图，$\\overline{AB} \\cong \\overline{CD}$，$AB = 3x + 4$，$CD = 5x - 6$。全等线段长度相等，所以 $3x + 4 = 5x - 6$，得 $10 = 2x$，$x = 5$。于是 $AB = 3 \\cdot 5 + 4 = 19$。",
          ],
          [
            "Put $x = 5$ into the other segment: $CD = 5 \\cdot 5 - 6 = 19$, the same length.",
            "把 $x = 5$ 代入另一条线段：$CD = 5 \\cdot 5 - 6 = 19$，长度相同。",
          ],
          [
            "$x = 5$ is not the length. When the question asks how long a segment is, put $x$ back into its expression.",
            "$x = 5$ 不是长度。题目问线段有多长时，要把 $x$ 代回它的式子。",
          ],
        ],
        (rng) => {
          const x = rng.int(2, 12);
          const L = rng.int(x + 8, 60);
          const e1 = expressionFor(rng, L, x);
          const e2 = expressionFor(rng, L, x, [e1[0]]);
          const askX = rng.bool();
          const u = pickUnit(rng);
          const figure = fig(
            twoSegments(rng, `${plain(...e1)}`, `${plain(...e2)}`),
            `Segments AB and CD marked congruent, with AB = ${plain(...e1)} and CD = ${plain(...e2)}.`,
            `线段 AB 和 CD 标为全等，AB = ${plain(...e1)}，CD = ${plain(...e2)}。`,
          );
          const given = `$AB = ${linear(...e1)}$`;
          const given2 = `$CD = ${linear(...e2)}$`;
          const [first, ...rest] = equalSteps(e1, e2);
          const [signSlip, addSlip] = equalWrong(e1, e2);
          const check: Pair = [
            `$AB = ${subst(e1, x)} = ${L}$ and $CD = ${subst(e2, x)} = ${L}$: the lengths match.`,
            `$AB = ${subst(e1, x)} = ${L}$，$CD = ${subst(e2, x)} = ${L}$：两条线段一样长。`,
          ];
          const equal: Walk = [
            ["Set the lengths equal", "令长度相等"],
            ["Congruent segments have equal lengths:", "全等线段的长度相等："],
            [first as string],
          ];
          const solved: Walk = [
            ["Solve for x", "解出 x"],
            rest.length > 1
              ? ["Collect $x$ on the side with the larger coefficient, then divide:", "把 $x$ 集中到系数较大的一边，再相除："]
              : ["Collect $x$ on the side with the larger coefficient:", "把 $x$ 集中到系数较大的一边："],
            rest,
          ];
          if (askX)
            return valued(
              [
                `In the figure, $${over("AB")} \\cong ${over("CD")}$, ${given} and ${given2}. Find $x$.`,
                `如图，$${over("AB")} \\cong ${over("CD")}$，${given}，${given2}。求 $x$。`,
              ],
              x,
              [equal, solved],
              check,
              [
                [
                  signSlip as Q,
                  "That moves a constant with the wrong sign. Undo it by doing the opposite.",
                  "这是把常数移项时符号弄错了。移项要做相反的运算。",
                ],
                [
                  addSlip as Q,
                  "That adds the $x$ terms. To collect them on one side, subtract one from both sides.",
                  "这是把含 $x$ 的项相加了。要把它们集中到一边，应在两边同时减去其中一项。",
                ],
                [L, "That is the length of each segment, not $x$.", "这是每条线段的长度，不是 $x$。"],
              ],
              { figure },
            );
          return valued(
            [
              `In the figure, $${over("AB")} \\cong ${over("CD")}$, ${given} and ${given2}, in ${unitWords[u]}. How long is $${over("AB")}$?`,
              `如图，$${over("AB")} \\cong ${over("CD")}$，${given}，${given2}（单位：${u}）。$${over("AB")}$ 有多长？`,
            ],
            L,
            [
              [equal[0], equal[1], [first as string, ...rest]],
              [
                ["Substitute", "代入"],
                [`Put $x = ${x}$ into $AB$:`, `把 $x = ${x}$ 代入 $AB$：`],
                [`AB = ${subst(e1, x)} = ${L}\\text{ ${u}}`],
              ],
            ],
            check,
            [
              [x, "That is $x$, not the length: put it into the expression for $AB$.", "这是 $x$ 的值，不是长度：要把它代入 $AB$ 的式子。"],
              [
                2 * L,
                "That adds $AB$ and $CD$. Each segment has the length on its own.",
                "这是把 $AB$ 和 $CD$ 相加了。题目只问一条线段的长度。",
              ],
              ...((addSlip as Q).isInteger()
                ? [
                    [
                      at(e1, (addSlip as Q).toNumber()),
                      "That uses the $x$ found by adding the $x$ terms. Subtract one from both sides instead.",
                      "这是用了把含 $x$ 的项相加得到的 $x$。应在两边同时减去其中一项。",
                    ] as const,
                  ]
                : []),
            ],
            { unit: u, figure },
          );
        },
        fig(
          twoSegmentsAt(25, "3x + 4", "5x − 6"),
          "Segments AB and CD marked congruent, with AB = 3x + 4 and CD = 5x − 6.",
          "线段 AB 和 CD 标为全等，AB = 3x + 4，CD = 5x − 6。",
        ),
      ),
    ],
  ),
  [
    "Two shelves are each $80$ cm long. One hangs higher and is tilted, but their lengths match, so the shelves are congruent.",
    "两块搁板都长 $80$ 厘米。一块挂得更高，还有点斜，但它们一样长，所以这两块搁板全等。",
  ],
  ["Measure both: $80$ cm and $80$ cm, the same length.", "量一量：都是 $80$ 厘米，长度相同。"],
  [
    "find congruent segments by comparing their lengths, and set equal lengths equal to write and solve equations.",
    "通过比较长度找出全等线段，并利用长度相等列方程、解方程。",
  ],
);

/** Part is a labeled stretch of a row of points: from x0 to x1, with a label under it. */
type Part = readonly [number, number, string];

/** rowFigure draws points in a row on a segment, with labels under some parts, an optional dimension line for the whole, and tick marks. */
function rowFigure(
  pts: readonly (readonly [number, string])[],
  parts: readonly Part[],
  whole?: string,
  ticked: readonly (readonly [number, number, number])[] = [],
): Mark[] {
  const xs = pts.map(([x]) => x);
  const [lo, hi] = [Math.min(...xs), Math.max(...xs)];
  const dy = (hi - lo) * 0.14;
  const marks: Mark[] = [seg([lo, 0], [hi, 0])];
  for (const [x, name] of pts) marks.push(...dot([x, 0], name, "n"));
  for (const [x0, x1, text] of parts) marks.push({ kind: "side", a: [x0, 0], b: [x1, 0], text });
  for (const [x0, x1, count] of ticked) marks.push(ticks([x0, 0], [x1, 0], count));
  if (whole) {
    const e = dy * 0.25;
    marks.push(seg([lo, -dy], [hi, -dy]), seg([lo, -dy - e], [lo, -dy + e]), seg([hi, -dy - e], [hi, -dy + e]), {
      kind: "side",
      a: [lo, -dy],
      b: [hi, -dy],
      text: whole,
    });
  }
  return marks;
}

/** midpoints finds midpoints and endpoints on a number line and solves for them with algebra. */
export const midpoints = withIntro(
  topic(
    "midpoints",
    t("Midpoints", "中点"),
    t(
      "The midpoint M of a segment AB is the point of the segment that divides it into two congruent halves: AM = MB = ½AB. On a number line, the coordinate of the midpoint is the average of the endpoints' coordinates: the midpoint of −4 and 10 is (−4 + 10) ÷ 2 = 3. Going the other way, an endpoint is as far beyond the midpoint as the other endpoint is before it.",
      "线段 AB 的中点 M 是把它分成两条全等线段的点：AM = MB = ½AB。在数轴上，中点的坐标是两个端点坐标的平均数：−4 和 10 的中点是 (−4 + 10) ÷ 2 = 3。反过来，一个端点在中点另一侧，与中点的距离等于另一个端点到中点的距离。",
    ),
    ["congruent-segments"],
    ["7.G.A.1"],
    [
      lesson(
        "midpoint-on-a-number-line",
        ["The midpoint on a number line", "数轴上的中点"],
        [
          [
            "The midpoint is the average of the two ends. With $A$ at $-7$ and $B$ at $4$, the midpoint of $\\overline{AB}$ is at $\\frac{-7 + 4}{2} = \\frac{-3}{2} = -1.5$.",
            "中点是两个端点的平均数。$A$ 在 $-7$，$B$ 在 $4$，$\\overline{AB}$ 的中点在 $\\frac{-7 + 4}{2} = \\frac{-3}{2} = -1.5$。",
          ],
          [
            "From $-7$ to $-1.5$ is $5.5$ units, and from $-1.5$ to $4$ is also $5.5$ units.",
            "从 $-7$ 到 $-1.5$ 是 $5.5$ 个单位，从 $-1.5$ 到 $4$ 也是 $5.5$ 个单位。",
          ],
          [
            "Half the length, $\\frac{4 - (-7)}{2} = 5.5$, is the distance to the midpoint, not where the midpoint is.",
            "长度的一半 $\\frac{4 - (-7)}{2} = 5.5$ 是到中点的距离，不是中点的位置。",
          ],
        ],
        (rng) => {
          const a = rng.int(-20, 14);
          const b = rng.int(a + 3, 20);
          const m = Q.of(a + b, 2);
          const half = Q.of(b - a, 2);
          const [p, q] = rng.pick(segmentNames);
          return valued(
            [
              `On a number line, $${p}$ is at $${a}$ and $${q}$ is at $${b}$. What is the coordinate of the midpoint of $${over(p + q)}$?`,
              `在数轴上，$${p}$ 在 $${a}$，$${q}$ 在 $${b}$。$${over(p + q)}$ 的中点的坐标是多少？`,
            ],
            m,
            [
              [["Add the ends", "两端相加"], ["Add the two coordinates:", "把两个坐标相加："], [`${a} + ${wrapped(b)} = ${a + b}`]],
              [["Halve", "取一半"], ["Divide by $2$ to get the average:", "除以 $2$ 得到平均数："], [`\\frac{${a + b}}{2} = ${result(m)}`]],
            ],
            [
              `Both halves are $${result(half)}$ long: $${result(m)} - ${wrapped(a)} = ${result(half)}$ and $${b} - ${result(m).startsWith("-") ? `(${result(m)})` : result(m)} = ${result(half)}$.`,
              `两半都长 $${result(half)}$：$${result(m)} - ${wrapped(a)} = ${result(half)}$，$${b} - ${result(m).startsWith("-") ? `(${result(m)})` : result(m)} = ${result(half)}$。`,
            ],
            [
              [
                half,
                "That is half the length, the distance to the midpoint, not its coordinate.",
                "这是长度的一半，是到中点的距离，不是中点的坐标。",
              ],
              [Q.of(a + b), "That adds the ends but does not divide by $2$.", "这是两端相加，但没有除以 $2$。"],
              [Q.of(b - a), "That is the length of the whole segment.", "这是整条线段的长度。"],
            ],
            { form: "decimal" },
          );
        },
        drawn(gradeDrawings3["midpoints#midpoint-on-a-number-line"]),
      ),
      lesson(
        "finding-an-endpoint",
        ["Finding an endpoint", "求端点"],
        [
          [
            "$M$ is the midpoint of $\\overline{AB}$, with $A$ at $-3$ and $M$ at $2$. From $A$ to $M$ is $2 - (-3) = 5$ units, so $B$ is another $5$ units past $M$: $B$ is at $2 + 5 = 7$.",
            "$M$ 是 $\\overline{AB}$ 的中点，$A$ 在 $-3$，$M$ 在 $2$。从 $A$ 到 $M$ 是 $2 - (-3) = 5$ 个单位，所以 $B$ 在 $M$ 的另一侧再过 $5$ 个单位：$B$ 在 $2 + 5 = 7$。",
          ],
          [
            "The midpoint of $-3$ and $7$ is $\\frac{-3 + 7}{2} = 2$, which is $M$.",
            "$-3$ 和 $7$ 的中点是 $\\frac{-3 + 7}{2} = 2$，正是 $M$。",
          ],
          [
            "$B$ is past $M$, not between $A$ and $M$: averaging $A$ and $M$ gives the point halfway to $M$ instead.",
            "$B$ 在 $M$ 的另一侧，不在 $A$ 和 $M$ 之间：把 $A$ 和 $M$ 取平均，得到的是到 $M$ 一半处的点。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.int(-15, 15);
            const d = rng.nonZero(-12, 12);
            const m = a + d;
            const b = m + d;
            if (Math.abs(b) > 30) continue;
            const line = fig(
              numberLine(Math.min(a, b) - 2, Math.max(a, b) + 2, [
                [a, "A"],
                [m, "M"],
              ]),
              `A number line with A at ${minus(a)} and M at ${minus(m)}.`,
              `数轴上 A 在 ${minus(a)}，M 在 ${minus(m)}。`,
            );
            return valued(
              [
                `On a number line, $M$ is the midpoint of $${over("AB")}$. $A$ is at $${a}$ and $M$ is at $${m}$. Where is $B$?`,
                `在数轴上，$M$ 是 $${over("AB")}$ 的中点。$A$ 在 $${a}$，$M$ 在 $${m}$。$B$ 在哪里？`,
              ],
              b,
              [
                [
                  ["Measure A to M", "量出 A 到 M"],
                  ["The step from $A$ to $M$ is", "从 $A$ 到 $M$ 的变化是"],
                  [`${m} - ${wrapped(a)} = ${d}`],
                ],
                [
                  ["Step again", "再走一次"],
                  ["$B$ is the same step past $M$:", "$B$ 在 $M$ 之后再走同样的一步："],
                  [`B = ${m} + ${wrapped(d)} = ${b}`],
                ],
              ],
              [
                `The midpoint of $${a}$ and $${b}$ is $\\frac{${a} + ${wrapped(b)}}{2} = ${m}$, which is $M$.`,
                `$${a}$ 和 $${b}$ 的中点是 $\\frac{${a} + ${wrapped(b)}}{2} = ${m}$，正是 $M$。`,
              ],
              [
                [Q.of(a + m, 2), "That is halfway from $A$ to $M$; $B$ is past $M$.", "这是 $A$ 到 $M$ 的一半处；$B$ 在 $M$ 的另一侧。"],
                [m - a, "That is the distance from $A$ to $M$, not where $B$ is.", "这是 $A$ 到 $M$ 的距离，不是 $B$ 的位置。"],
                [
                  a + m,
                  "That adds $A$ and $M$; $B$ is $M$ plus the step from $A$ to $M$.",
                  "这是 $A$ 加 $M$；$B$ 应是 $M$ 加上从 $A$ 到 $M$ 的变化。",
                ],
              ],
              { form: "integer", figure: line },
            );
          }
        },
        fig(
          numberLine(-5, 9, [
            [-3, "A"],
            [2, "M"],
            [7, "B"],
          ]),
          "A number line with A at −3, M at 2 and B at 7.",
          "数轴上 A 在 −3，M 在 2，B 在 7。",
        ),
      ),
      lesson(
        "midpoints-with-algebra",
        ["Midpoints with algebra", "用方程求中点问题"],
        [
          [
            "The two halves at a midpoint are equal, so set their expressions equal. $AM = 2x + 5$ and $MB = 4x - 3$: $2x + 5 = 4x - 3$, so $x = 4$. Then $AM = 13$, and the whole segment is twice as long: $AB = 26$.",
            "中点分成的两半相等，所以让它们的式子相等。$AM = 2x + 5$，$MB = 4x - 3$：$2x + 5 = 4x - 3$，所以 $x = 4$。于是 $AM = 13$，整条线段是它的两倍：$AB = 26$。",
          ],
          ["$MB = 4(4) - 3 = 13$ too, so the halves match.", "$MB = 4(4) - 3 = 13$，两半相等。"],
          ["$x$ is not a length: put it back into $AM$, and double for $AB$.", "$x$ 不是长度：要代回 $AM$，求 $AB$ 还要乘 $2$。"],
        ],
        (rng) => {
          const x = rng.int(2, 12);
          const L = rng.int(x + 6, 45);
          const e1 = expressionFor(rng, L, x);
          const e2 = expressionFor(rng, L, x, [e1[0]]);
          const u = pickUnit(rng);
          const ask = rng.int(0, 2);
          const figure = fig(
            rowFigure(
              [
                [0, "A"],
                [8, "M"],
                [16, "B"],
              ],
              [
                [0, 8, plain(...e1)],
                [8, 16, plain(...e2)],
              ],
              undefined,
              [
                [0, 8, 1],
                [8, 16, 1],
              ],
            ),
            `Segment AB with midpoint M; AM = ${plain(...e1)} and MB = ${plain(...e2)}.`,
            `线段 AB，中点为 M；AM = ${plain(...e1)}，MB = ${plain(...e2)}。`,
          );
          const given: Pair = [
            `$M$ is the midpoint of $${over("AB")}$, $AM = ${linear(...e1)}$ and $MB = ${linear(...e2)}$`,
            `$M$ 是 $${over("AB")}$ 的中点，$AM = ${linear(...e1)}$，$MB = ${linear(...e2)}$`,
          ];
          const solveStep: Walk = [
            ["Set the halves equal", "让两半相等"],
            ["The halves are congruent, so solve:", "两半全等，所以解方程："],
            equalSteps(e1, e2),
          ];
          const check: Pair = [
            `At $x = ${x}$: $AM = ${subst(e1, x)} = ${L}$ and $MB = ${subst(e2, x)} = ${L}$, equal halves.`,
            `$x = ${x}$ 时：$AM = ${subst(e1, x)} = ${L}$，$MB = ${subst(e2, x)} = ${L}$，两半相等。`,
          ];
          const [slip1, slip2] = equalWrong(e1, e2) as [Q, Q];
          if (ask === 0)
            return valued(
              [`${given[0]}. Find $x$.`, `${given[1]}。求 $x$。`],
              x,
              [
                [solveStep[0], ["The halves are congruent:", "两半全等："], equalSteps(e1, e2).slice(0, 1)],
                [["Solve for x", "解出 x"], collecting(equalSteps(e1, e2).slice(1)), equalSteps(e1, e2).slice(1)],
              ],
              check,
              [
                [slip1, "That moves a constant with the wrong sign.", "移项时常数的符号弄错了。"],
                [
                  slip2,
                  "That adds the $x$ terms instead of subtracting one from both sides.",
                  "这是把含 $x$ 的项相加了，应在两边同时减去其中一项。",
                ],
                [L, "That is the length of each half, not $x$.", "这是每一半的长度，不是 $x$。"],
              ],
              { figure },
            );
          const whole = ask === 1;
          return valued(
            [
              `${given[0]}, in ${unitWords[u]}. How long is $${over(whole ? "AB" : "AM")}$?`,
              `${given[1]}（单位：${u}）。$${over(whole ? "AB" : "AM")}$ 有多长？`,
            ],
            whole ? 2 * L : L,
            [
              solveStep,
              [
                ["Substitute", "代入"],
                whole
                  ? [`Put $x = ${x}$ into $AM$, then double:`, `把 $x = ${x}$ 代入 $AM$，再乘 $2$：`]
                  : [`Put $x = ${x}$ into $AM$:`, `把 $x = ${x}$ 代入 $AM$：`],
                [`AM = ${subst(e1, x)} = ${L}`, ...(whole ? [`AB = 2 \\cdot ${L} = ${2 * L}`] : [])],
              ],
            ],
            check,
            whole
              ? [
                  [L, "That is only one half, $AM$.", "这只是一半，$AM$。"],
                  [x, "That is $x$, not a length.", "这是 $x$，不是长度。"],
                  [2 * x, "That doubles $x$ instead of the length $AM$.", "这是把 $x$ 乘 $2$，而不是把 $AM$ 的长度乘 $2$。"],
                ]
              : [
                  [x, "That is $x$, not a length: put it into $AM$.", "这是 $x$，不是长度：要代入 $AM$。"],
                  [2 * L, "That is the whole of $AB$, not the half $AM$.", "这是整条 $AB$，不是一半 $AM$。"],
                  [at(e2, x + 1), "That puts the wrong value of $x$ into the expression.", "代入的 $x$ 值不对。"],
                ],
            { unit: u, figure },
          );
        },
        fig(
          rowFigure(
            [
              [0, "A"],
              [8, "M"],
              [16, "B"],
            ],
            [
              [0, 8, "2x + 5"],
              [8, 16, "4x − 3"],
            ],
            undefined,
            [
              [0, 8, 1],
              [8, 16, 1],
            ],
          ),
          "Segment AB with midpoint M; AM = 2x + 5 and MB = 4x − 3.",
          "线段 AB，中点为 M；AM = 2x + 5，MB = 4x − 3。",
        ),
      ),
    ],
  ),
  [
    "A $10$ m rope is tied between two posts, and a lantern hangs at the midpoint. It is $5$ m from each post, half the rope.",
    "两根柱子之间拉着一根 $10$ 米长的绳子，灯笼挂在中点。它离每根柱子都是 $5$ 米，正好是绳长的一半。",
  ],
  ["$5 + 5 = 10$, and both halves are the same.", "$5 + 5 = 10$，两半一样长。"],
  [
    "find midpoints and missing endpoints on a number line and in the plane, and solve midpoint problems with equations.",
    "学习在数轴上和平面上求中点与缺少的端点，并用方程解中点问题。",
  ],
);
/** Crossing is two lines through X: three points on the first, one or two on the second, and one point off both. */
type Crossing = {
  readonly t1: number;
  readonly t2: number;
  readonly on1: readonly number[];
  readonly on2: readonly number[];
  readonly mid: number;
};

/** CrossPoint is a named point of a crossing figure and the line it is on: 0 for the crossing, 3 for neither line. */
type CrossPoint = { readonly p: Point; readonly line: number; readonly name: string; readonly d: Compass };

/** crossingPoints names the points of a crossing with the given letters. */
function crossingPoints({ t1, t2, on1, on2, mid }: Crossing, letters: readonly string[]): CrossPoint[] {
  const X: Point = [0, 0];
  const off = dir(mid, 3);
  const normal = (deg: number, p: Point): Compass => awayFrom(dir(deg + 90, 1, p), p);
  return [
    { p: X, line: 0, name: letters[0]!, d: awayFrom(dir(mid + 180, 1), X) },
    ...on1.map((s, i) => ({ p: dir(t1, s), line: 1, name: letters[1 + i]!, d: normal(t1, dir(t1, s)) })),
    ...on2.map((s, i) => ({ p: dir(t2, s), line: 2, name: letters[4 + i]!, d: normal(t2, dir(t2, s)) })),
    { p: off, line: 3, name: letters[6]!, d: awayFrom(off, X) },
  ];
}

/** crossingFigure draws the two lines of a crossing and its named points. */
function crossingFigure(c: Crossing, pts: readonly CrossPoint[]): Figure {
  const named = (line: number) => pts.filter((q) => q.line === line).map((q) => q.name);
  return fig(
    [seg(dir(c.t1, -5.5), dir(c.t1, 5.5)), seg(dir(c.t2, -4.5), dir(c.t2, 4.5)), ...pts.flatMap((q) => dot(q.p, q.name, q.d))],
    `Two lines crossing at ${named(0)[0]}. Points ${named(1).join(", ")} lie on one line, ${named(2).join(" and ")} on the other, and ${named(3)[0]} on neither.`,
    `两条直线相交于 ${named(0)[0]}。点 ${named(1).join("、")} 在一条直线上，${named(2).join("、")} 在另一条直线上，${named(3)[0]} 不在这两条直线上。`,
  );
}

/** sampleCrossing is the crossing drawn beside the lesson on collinear points in a figure. */
const sampleCrossing: Crossing = { t1: 20, t2: 105, on1: [-4, 2, 4], on2: [-3, 3], mid: 242.5 };

/** CoordinateSlip moves a point off the line and says how a learner gets there. */
type CoordinateSlip = readonly [move: (p: readonly [number, number]) => readonly [number, number], en: string, zh: string];

/** coordinateSlips are the usual ways a learner picks a point beside the line. */
const coordinateSlips: readonly CoordinateSlip[] = [
  [([x, y]) => [y, x], "That swaps the $x$- and $y$-coordinates of a point on the line.", "这是把直线上一点的横、纵坐标交换了。"],
  [
    ([x, y]) => [x + 1, y],
    "That is one unit to the right of a point on the line, so it misses the line.",
    "这是直线上一点向右偏了 $1$ 个单位，所以不在直线上。",
  ],
  [
    ([x, y]) => [x, y + 1],
    "That is one unit above a point on the line, so it misses the line.",
    "这是直线上一点向上偏了 $1$ 个单位，所以不在直线上。",
  ],
  [
    ([x, y]) => [x - 1, y],
    "That is one unit to the left of a point on the line, so it misses the line.",
    "这是直线上一点向左偏了 $1$ 个单位，所以不在直线上。",
  ],
  [
    ([x, y]) => [x, y - 1],
    "That is one unit below a point on the line, so it misses the line.",
    "这是直线上一点向下偏了 $1$ 个单位，所以不在直线上。",
  ],
  [
    ([x, y]) => [-x, y],
    "That changes the sign of the $x$-coordinate, which moves the point off the line.",
    "这是把横坐标的符号变了，点就离开了直线。",
  ],
  [
    ([x, y]) => [x, -y],
    "That changes the sign of the $y$-coordinate, which moves the point off the line.",
    "这是把纵坐标的符号变了，点就离开了直线。",
  ],
];

/** collinearPoints decides whether points lie on one line, in a figure and in the coordinate plane. */
export const collinearPoints = withIntro(
  topic(
    "collinear-points",
    t("Collinear Points", "共线的点"),
    t(
      "Points that lie on one line are collinear; points that do not all lie on one line are noncollinear. Any two points are collinear, since there is exactly one line through them, so the question is whether a third point lies on that line too. In the coordinate plane, points with the same x-coordinate lie on a vertical line and points with the same y-coordinate on a horizontal line; points reached from one another by repeating the same step, such as 2 right and 3 up, also lie on one line.",
      "在同一条直线上的点叫共线的点；不全在同一条直线上的点叫不共线的点。任意两点都共线，因为过两点有且只有一条直线，所以关键是第三个点是否也在这条直线上。在坐标平面中，横坐标相同的点在一条竖直线上，纵坐标相同的点在一条水平线上；从一个点出发，重复同样的一步（例如向右 2、向上 3）所到达的点也在同一条直线上。",
    ),
    ["the-cartesian-coordinate-system"],
    ["4.G.A.1"],
    [
      lesson(
        "identifying-collinear-points",
        ["Collinear points in a figure", "图中共线的点"],
        [
          [
            "To test three points, take the line through two of them and ask whether it passes through the third. In the figure, $A$, $B$ and $C$ are on one line, so they are collinear, and so is the crossing point $X$ with them. $B$, $C$ and $D$ are not: $D$ is on the other line, away from the crossing.",
            "检验三个点时，先取经过其中两点的直线，再看它是否经过第三点。图中 $A$、$B$、$C$ 在同一条直线上，所以共线；交点 $X$ 也和它们共线。$B$、$C$、$D$ 不共线：$D$ 在另一条直线上，又不是交点。",
          ],
          [
            "Start from a different pair: the line through $B$ and $D$ is neither drawn line, and it misses $C$ too, so the answer does not change.",
            "换一对点开始：经过 $B$ 和 $D$ 的直线不是图中任何一条，它也不经过 $C$，结论不变。",
          ],
          [
            "Any three points can be joined by segments into a path, but they are collinear only when one straight line holds all three.",
            "任意三个点都能用线段连成折线，但只有一条直线同时经过三点时，它们才共线。",
          ],
        ],
        (rng) => {
          const t1 = rng.int(0, 35) * 5;
          const t2 = t1 + rng.int(10, 26) * 5;
          const c: Crossing = {
            t1,
            t2,
            on1: rng.shuffle([-4, -2, 2, 4]).slice(0, 3),
            on2: rng.shuffle([-3, 3]).slice(0, rng.int(1, 2)),
            mid: (t1 + t2) / 2 + (rng.bool() ? 0 : 180),
          };
          const pts = crossingPoints(c, rng.shuffle([..."ABCDEFGH"]));
          const line1 = pts.filter((q) => q.line === 1 || q.line === 0);
          const kind = rng.int(0, 2);
          const pair = rng.shuffle(kind === 0 ? line1 : pts.filter((q) => q.line === 1)).slice(0, 2);
          const third =
            kind === 0 ? rng.pick(line1.filter((q) => !pair.includes(q))) : rng.pick(pts.filter((q) => q.line === (kind === 1 ? 2 : 3)));
          const trio = rng.shuffle([...pair, third]).map((q) => q.name);
          const [p, q] = [pair[0]!.name, pair[1]!.name];
          const z = third.name;
          const where: Pair =
            kind === 0
              ? [`$${z}$ is on that same line.`, `$${z}$ 也在这条直线上。`]
              : kind === 1
                ? [
                    `$${z}$ is on the other line, away from the crossing, so that line misses it.`,
                    `$${z}$ 在另一条直线上，又不是交点，所以这条直线不经过它。`,
                  ]
                : [`$${z}$ is on neither line, so that line misses it.`, `$${z}$ 不在任何一条直线上，所以这条直线不经过它。`];
          return decided(
            rng,
            [`Are points $${trio[0]}$, $${trio[1]}$ and $${trio[2]}$ collinear?`, `点 $${trio[0]}$、$${trio[1]}$、$${trio[2]}$ 共线吗？`],
            kind === 0,
            [
              [
                ["Take two points", "先取两点"],
                [`$${p}$ and $${q}$ lie on one drawn line.`, `$${p}$ 和 $${q}$ 在同一条画出的直线上。`],
              ],
              [["Test the third", "检验第三点"], where],
            ],
            kind === 0
              ? [
                  `Start from $${z}$ and $${p}$ instead: their line is the same drawn line, and it passes through $${q}$ too.`,
                  `改从 $${z}$ 和 $${p}$ 开始：它们确定的还是这条画出的直线，它也经过 $${q}$。`,
                ]
              : [
                  `Start from $${z}$ and $${p}$ instead: their line is not a drawn line, and it misses $${q}$.`,
                  `改从 $${z}$ 和 $${p}$ 开始：它们确定的直线不是画出的直线，它不经过 $${q}$。`,
                ],
            kind === 0
              ? ["All three points sit on one drawn line, so no point is off it.", "三个点都在同一条画出的直线上，没有哪个点在直线外。"]
              : [
                  `Three points can be joined by segments, but no single straight line holds $${z}$ with the other two.`,
                  `三个点能用线段连起来，但没有一条直线同时经过 $${z}$ 和另外两点。`,
                ],
            crossingFigure(c, pts),
          );
        },
        crossingFigure(sampleCrossing, crossingPoints(sampleCrossing, [..."XABCDEF"])),
      ),
      lesson(
        "collinear-points-in-the-coordinate-plane",
        ["Collinear points in the coordinate plane", "坐标平面中的共线点"],
        [
          [
            "$A(3, -2)$ and $B(3, 4)$ have the same $x$-coordinate, so they lie on a vertical line, and every point with $x$-coordinate $3$, such as $(3, 9)$, is collinear with them. $P(1, 1)$ and $Q(3, 4)$ are $2$ right and $3$ up from each other; repeating that step from $Q$ gives $(5, 7)$, which is on the same line.",
            "$A(3, -2)$ 与 $B(3, 4)$ 的横坐标相同，所以它们在一条竖直线上，横坐标为 $3$ 的点，例如 $(3, 9)$，都与它们共线。从 $P(1, 1)$ 到 $Q(3, 4)$ 是向右 $2$、向上 $3$；从 $Q$ 再走同样的一步得到 $(5, 7)$，它在同一条直线上。",
          ],
          [
            "From $P(1, 1)$ to $(5, 7)$ is $4$ right and $6$ up, which is the step $2$ right, $3$ up taken twice.",
            "从 $P(1, 1)$ 到 $(5, 7)$ 是向右 $4$、向上 $6$，正是“向右 $2$、向上 $3$”走两次。",
          ],
          [
            "Changing only one coordinate by $1$ moves a point off a slanted line: $(5, 6)$ is not on the line through $P$ and $Q$.",
            "只把一个坐标改动 $1$，点就会离开斜线：$(5, 6)$ 不在经过 $P$、$Q$ 的直线上。",
          ],
        ],
        (rng) => {
          const kind = rng.int(0, 2);
          const [x0, y0] = [rng.int(-6, 6), rng.int(-6, 6)];
          const step: [number, number] =
            kind === 0 ? [0, rng.nonZero(-5, 5)] : kind === 1 ? [rng.nonZero(-5, 5), 0] : [rng.int(1, 3), rng.nonZero(-4, 4)];
          const A: [number, number] = [x0, y0];
          const B: [number, number] = [x0 + step[0], y0 + step[1]];
          const m = rng.pick([2, 3, -1, -2]);
          const C: [number, number] = [x0 + m * step[0], y0 + m * step[1]];
          const cross = (p: readonly number[]) => (B[0] - A[0]) * (p[1]! - A[1]) - (B[1] - A[1]) * (p[0]! - A[0]);
          const seen = new Set([pointLatex(C)]);
          const wrong: MathWrong[] = [];
          for (const [move, en, zh] of rng.shuffle([...coordinateSlips])) {
            const p = move(C);
            if (cross(p) === 0 || seen.has(pointLatex(p)) || wrong.length === 3) continue;
            seen.add(pointLatex(p));
            wrong.push([pointLatex(p), en, zh]);
          }
          const back =
            m > 0
              ? [`$${m}$ times from $A$`, `从 $A$ 沿这一步走 $${m}$ 次`]
              : [`$${-m}$ time${m === -1 ? "" : "s"} backward from $A$`, `从 $A$ 反方向走 $${-m}$ 次`];
          const walk: Walk[] =
            kind === 0
              ? [
                  [
                    ["Compare A and B", "比较 A 和 B"],
                    [
                      `$A$ and $B$ have the same $x$-coordinate, $${x0}$, so the line through them is vertical.`,
                      `$A$ 与 $B$ 的横坐标都是 $${x0}$，所以经过它们的直线是竖直的。`,
                    ],
                  ],
                  [
                    ["Match the choice", "找出选项"],
                    [`The point on it has $x$-coordinate $${x0}$: $${pointLatex(C)}$.`, `直线上的点横坐标是 $${x0}$：$${pointLatex(C)}$。`],
                  ],
                ]
              : kind === 1
                ? [
                    [
                      ["Compare A and B", "比较 A 和 B"],
                      [
                        `$A$ and $B$ have the same $y$-coordinate, $${y0}$, so the line through them is horizontal.`,
                        `$A$ 与 $B$ 的纵坐标都是 $${y0}$，所以经过它们的直线是水平的。`,
                      ],
                    ],
                    [
                      ["Match the choice", "找出选项"],
                      [
                        `The point on it has $y$-coordinate $${y0}$: $${pointLatex(C)}$.`,
                        `直线上的点纵坐标是 $${y0}$：$${pointLatex(C)}$。`,
                      ],
                    ],
                  ]
                : [
                    [
                      ["Find the step", "找出一步"],
                      [
                        `From $A$ to $B$ is $${step[0]}$ right and $${Math.abs(step[1])}$ ${step[1] > 0 ? "up" : "down"}.`,
                        `从 $A$ 到 $B$ 是向右 $${step[0]}$、向${step[1] > 0 ? "上" : "下"} $${Math.abs(step[1])}$。`,
                      ],
                    ],
                    [
                      ["Repeat the step", "重复这一步"],
                      [`Taking it ${back[0]} gives $${pointLatex(C)}$.`, `${back[1]}，得到 $${pointLatex(C)}$。`],
                    ],
                  ];
          const dx = C[0] - B[0];
          const dy = C[1] - B[1];
          return chosenMath(
            rng,
            [
              `Which point is collinear with $A${pointLatex(A)}$ and $B${pointLatex(B)}$?`,
              `哪个点与 $A${pointLatex(A)}$、$B${pointLatex(B)}$ 共线？`,
            ],
            pointLatex(C),
            wrong,
            walk,
            [
              `From $B$ to $${pointLatex(C)}$ is a change of $${dx}$ in $x$ and $${dy}$ in $y$, which is $${m - 1}$ times the step from $A$ to $B$, so all three are on one line.`,
              `从 $B$ 到 $${pointLatex(C)}$，$x$ 变化 $${dx}$，$y$ 变化 $${dy}$，是从 $A$ 到 $B$ 那一步的 $${m - 1}$ 倍，所以三点在同一条直线上。`,
            ],
          );
        },
        drawn(gradeDrawings3["collinear-points#collinear-points-in-the-coordinate-plane"]),
      ),
    ],
  ),
  [
    "Three fence posts are set with a tight string along them. If the string touches all three, they stand in one straight row.",
    "三根篱笆桩用一根拉紧的绳子比一比。如果绳子碰到全部三根，它们就站成一条直线。",
  ],
  [
    "Move one post a little to the side and the string can no longer touch all three.",
    "把其中一根桩往旁边挪一点，绳子就不能同时碰到三根了。",
  ],
  [
    "decide whether points are collinear in a figure and in the coordinate plane, and find a coordinate that keeps points on one line.",
    "学习判断图中和坐标平面中的点是否共线，并求使点保持在同一条直线上的坐标。",
  ],
);
/** theSegmentAdditionPostulate adds and subtracts the parts of a segment, with numbers and with expressions. */
export const theSegmentAdditionPostulate = withIntro(
  topic(
    "the-segment-addition-postulate",
    t("The Segment Addition Postulate", "线段加法公理"),
    t(
      "If point B lies on segment AC, between A and C, then AB + BC = AC: the two parts add up to the whole. So a part is the whole minus the other part. When the lengths are expressions, the postulate gives an equation: if AB = 2x + 3, BC = 3x − 1 and AC = 32, then 5x + 2 = 32 and x = 6.",
      "如果点 B 在线段 AC 上、位于 A 与 C 之间，那么 AB + BC = AC：两部分之和等于整条线段。所以一部分等于整条线段减去另一部分。长度用式子表示时，由这个公理可以列出方程：若 AB = 2x + 3，BC = 3x − 1，AC = 32，则 5x + 2 = 32，x = 6。",
    ),
    ["measures-of-segments", "two-step-equations"],
    ["7.G.A.1"],
    [
      lesson(
        "parts-and-wholes",
        ["Parts and wholes", "部分与整体"],
        [
          [
            "When $B$ lies on $\\overline{AC}$, the parts add up to the whole: $AB + BC = AC$. So a part is the whole minus the other part. With $A$, $B$, $C$, $D$ in that order, $AC = 15$, $BD = 12$ and $AD = 20$: first $AB = AD - BD = 20 - 12 = 8$, then $BC = AC - AB = 15 - 8 = 7$.",
            "当 $B$ 在 $\\overline{AC}$ 上时，两部分之和等于整体：$AB + BC = AC$。所以一部分等于整体减去另一部分。$A$、$B$、$C$、$D$ 依次排列，$AC = 15$，$BD = 12$，$AD = 20$：先求 $AB = AD - BD = 20 - 12 = 8$，再求 $BC = AC - AB = 15 - 8 = 7$。",
          ],
          [
            "$CD = AD - AC = 20 - 15 = 5$, and $BC + CD = 7 + 5 = 12$, which is $BD$.",
            "$CD = AD - AC = 20 - 15 = 5$，$BC + CD = 7 + 5 = 12$，正是 $BD$。",
          ],
          [
            "$AC + BD = 27$ is more than $AD = 20$, because adding the two long pieces counts $\\overline{BC}$ twice.",
            "$AC + BD = 27$ 比 $AD = 20$ 大，因为把两条长线段相加，$\\overline{BC}$ 被算了两次。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const tex = (v: Q) => `${result(v)}\\text{ ${u}}`;
          if (rng.bool()) {
            const ab = rng.bool() ? Q.of(rng.int(3, 30)) : halves(rng, 2, 25);
            const bc = Q.of(rng.int(3, 30));
            const ac = ab.add(bc);
            return valued(
              [
                `Point $B$ lies on $${over("AC")}$. $AC = ${tex(ac)}$ and $AB = ${tex(ab)}$. Find $BC$.`,
                `点 $B$ 在 $${over("AC")}$ 上。$AC = ${tex(ac)}$，$AB = ${tex(ab)}$。求 $BC$。`,
              ],
              bc,
              [
                [["Write the postulate", "写出公理"], ["The two parts make the whole:", "两部分组成整体："], ["AB + BC = AC"]],
                [
                  ["Subtract the known part", "减去已知部分"],
                  ["Take $AB$ away from the whole:", "从整体中去掉 $AB$："],
                  [`BC = ${result(ac)} - ${result(ab)} = ${tex(bc)}`],
                ],
              ],
              [
                `Add the parts back: $${result(ab)} + ${result(bc)} = ${result(ac)}$, which is $AC$.`,
                `把两部分加回去：$${result(ab)} + ${result(bc)} = ${result(ac)}$，正是 $AC$。`,
              ],
              [
                [ac.add(ab), "That adds $AB$ to the whole instead of taking it away.", "这是把 $AB$ 加到整体上，而不是从中减去。"],
                [ac.div(Q.of(2)), "That halves $AC$, but $B$ need not be the midpoint.", "这是把 $AC$ 取一半，但 $B$ 不一定是中点。"],
                [ab, "That is $AB$, the other part.", "这是另一部分 $AB$。"],
              ],
              {
                unit: u,
                figure: fig(
                  rowFigure(
                    [
                      [0, "A"],
                      [ab.toNumber(), "B"],
                      [ac.toNumber(), "C"],
                    ],
                    [],
                  ),
                  "Points A, B and C in that order on a segment.",
                  "线段上依次排列的点 A、B、C。",
                ),
              },
            );
          }
          const [ab, bc, cd] = [rng.int(3, 15), rng.int(3, 15), rng.int(3, 15)];
          const [ac, bd, ad] = [ab + bc, bc + cd, ab + bc + cd];
          return valued(
            [
              `Points $A$, $B$, $C$ and $D$ lie on a line in that order. $AC = ${ac}\\text{ ${u}}$, $BD = ${bd}\\text{ ${u}}$ and $AD = ${ad}\\text{ ${u}}$. Find $BC$.`,
              `点 $A$、$B$、$C$、$D$ 依次在一条直线上。$AC = ${ac}\\text{ ${u}}$，$BD = ${bd}\\text{ ${u}}$，$AD = ${ad}\\text{ ${u}}$。求 $BC$。`,
            ],
            bc,
            [
              [
                ["Find a part next to BC", "求与 BC 相邻的一段"],
                ["$AB$ is what is left of $AD$ after $BD$:", "$AD$ 去掉 $BD$ 剩下 $AB$："],
                [`AB = ${ad} - ${bd} = ${ab}`],
              ],
              [
                ["Subtract it", "再相减"],
                ["$BC$ is what is left of $AC$ after $AB$:", "$AC$ 去掉 $AB$ 剩下 $BC$："],
                [`BC = ${ac} - ${ab} = ${bc}\\text{ ${u}}`],
              ],
            ],
            [
              `Go from the other end: $CD = ${ad} - ${ac} = ${cd}$, and $BC = BD - CD = ${bd} - ${cd} = ${bc}$ again.`,
              `从另一端算：$CD = ${ad} - ${ac} = ${cd}$，$BC = BD - CD = ${bd} - ${cd} = ${bc}$，结果相同。`,
            ],
            [
              [ad - ac, "That is $CD$, the part after $C$.", "这是 $C$ 之后的一段 $CD$。"],
              [ad - bd, "That is $AB$, the part before $B$.", "这是 $B$ 之前的一段 $AB$。"],
              [ac + bd, "That adds the two long pieces, which counts $BC$ twice.", "这是把两条长线段相加，把 $BC$ 算了两次。"],
            ],
            {
              unit: u,
              figure: fig(
                rowFigure(
                  [
                    [0, "A"],
                    [ab, "B"],
                    [ac, "C"],
                    [ad, "D"],
                  ],
                  [],
                ),
                "Points A, B, C and D in that order on a segment.",
                "线段上依次排列的点 A、B、C、D。",
              ),
            },
          );
        },
        fig(
          rowFigure(
            [
              [0, "A"],
              [8, "B"],
              [15, "C"],
              [20, "D"],
            ],
            [
              [0, 8, "8"],
              [8, 15, "7"],
              [15, 20, "5"],
            ],
            "20",
          ),
          "Points A, B, C and D in that order; AB = 8, BC = 7, CD = 5 and AD = 20.",
          "依次排列的点 A、B、C、D；AB = 8，BC = 7，CD = 5，AD = 20。",
        ),
      ),
      lesson(
        "segment-addition-with-algebra",
        ["Segment addition with algebra", "用方程解线段加法问题"],
        [
          [
            "When the lengths are expressions, the postulate gives an equation. $B$ lies on $\\overline{AC}$, $AB = 2x + 3$, $BC = 3x - 1$ and $AC = 32$: $(2x + 3) + (3x - 1) = 32$, so $5x + 2 = 32$, $5x = 30$ and $x = 6$. Then $AB = 15$ and $BC = 17$.",
            "长度用式子表示时，由公理可以列出方程。$B$ 在 $\\overline{AC}$ 上，$AB = 2x + 3$，$BC = 3x - 1$，$AC = 32$：$(2x + 3) + (3x - 1) = 32$，所以 $5x + 2 = 32$，$5x = 30$，$x = 6$。于是 $AB = 15$，$BC = 17$。",
          ],
          ["$15 + 17 = 32$, which is $AC$.", "$15 + 17 = 32$，正是 $AC$。"],
          [
            "$x = 6$ is not a length: put it back into $AB$ or $BC$ to find the part that is asked for.",
            "$x = 6$ 不是长度：要把它代回 $AB$ 或 $BC$，才能求出所问的那一段。",
          ],
        ],
        (rng) => {
          const x = rng.int(2, 12);
          const [l1, l2] = [rng.int(x + 3, 40), rng.int(x + 3, 40)];
          const e1 = expressionFor(rng, l1, x);
          const e2 = expressionFor(rng, l2, x);
          const total = l1 + l2;
          const u = pickUnit(rng);
          const ask = rng.int(0, 2);
          const lines = sumSteps([e1, e2], total);
          const figure = fig(
            rowFigure(
              [
                [0, "A"],
                [l1, "B"],
                [total, "C"],
              ],
              [
                [0, l1, plain(...e1)],
                [l1, total, plain(...e2)],
              ],
              String(total),
            ),
            `Segment AC of length ${total} with B on it; AB = ${plain(...e1)} and BC = ${plain(...e2)}.`,
            `长为 ${total} 的线段 AC，B 在它上面；AB = ${plain(...e1)}，BC = ${plain(...e2)}。`,
          );
          const given: Pair = [
            `$B$ lies on $${over("AC")}$, $AB = ${linear(...e1)}$, $BC = ${linear(...e2)}$ and $AC = ${total}$, in ${unitWords[u]}.`,
            `$B$ 在 $${over("AC")}$ 上，$AB = ${linear(...e1)}$，$BC = ${linear(...e2)}$，$AC = ${total}$（单位：${u}）。`,
          ];
          const write: Walk = [
            ["Write the equation", "列方程"],
            ["The parts add up to the whole:", "两部分之和等于整体："],
            lines.slice(0, 1),
          ];
          const solve: Walk = [
            ["Solve for x", "解出 x"],
            ["Combine like terms, then undo each operation:", "合并同类项，再逐步还原："],
            lines.slice(1),
          ];
          const check: Pair = [
            `At $x = ${x}$: $AB = ${subst(e1, x)} = ${l1}$ and $BC = ${subst(e2, x)} = ${l2}$, and $${l1} + ${l2} = ${total}$, which is $AC$.`,
            `$x = ${x}$ 时：$AB = ${subst(e1, x)} = ${l1}$，$BC = ${subst(e2, x)} = ${l2}$，$${l1} + ${l2} = ${total}$，正是 $AC$。`,
          ];
          const [signSlip, doubleSlip] = sumWrong([e1, e2], total, 2 * total) as [Q, Q];
          if (ask === 0)
            return valued(
              [`${given[0]} Find $x$.`, `${given[1]}求 $x$。`],
              x,
              [write, solve],
              check,
              [
                [signSlip, "That moves the constant across with the wrong sign.", "移项时常数的符号弄错了。"],
                [doubleSlip, "That sets the two parts equal to twice $AC$.", "这是让两部分之和等于 $AC$ 的两倍。"],
                [l1, "That is the length of $AB$, not $x$.", "这是 $AB$ 的长度，不是 $x$。"],
              ],
              { figure },
            );
          const [name, e, v] = ask === 1 ? (["AB", e1, l1] as const) : (["BC", e2, l2] as const);
          return valued(
            [`${given[0]} How long is $${over(name)}$?`, `${given[1]}$${over(name)}$ 有多长？`],
            v,
            [
              [write[0], write[1], [...lines.slice(0, 1), ...lines.slice(1)]],
              [
                ["Substitute", "代入"],
                [`Put $x = ${x}$ into $${name}$:`, `把 $x = ${x}$ 代入 $${name}$：`],
                [`${name} = ${subst(e, x)} = ${v}`],
              ],
            ],
            check,
            [
              [x, "That is $x$, not a length: put it into the expression.", "这是 $x$，不是长度：要代入式子。"],
              [total - v, "That is the other part of $AC$.", "这是 $AC$ 的另一部分。"],
              [Q.of(total, 2), "That halves $AC$, but $B$ is not the midpoint.", "这是把 $AC$ 取一半，但 $B$ 不是中点。"],
            ],
            { unit: u, figure },
          );
        },
        fig(
          rowFigure(
            [
              [0, "A"],
              [15, "B"],
              [32, "C"],
            ],
            [
              [0, 15, "2x + 3"],
              [15, 32, "3x − 1"],
            ],
            "32",
          ),
          "Segment AC of length 32 with B on it; AB = 2x + 3 and BC = 3x − 1.",
          "长为 32 的线段 AC，B 在它上面；AB = 2x + 3，BC = 3x − 1。",
        ),
      ),
    ],
  ),
  [
    "A $12$ km trail runs from the gate to the lake, and a hut stands $5$ km along it. From the hut to the lake is the rest: $12 - 5 = 7$ km.",
    "一条从大门到湖边的小路长 $12$ 千米，小屋在路上 $5$ 千米处。从小屋到湖边是剩下的部分：$12 - 5 = 7$ 千米。",
  ],
  ["$5 + 7 = 12$, the whole trail.", "$5 + 7 = 12$，正是整条小路。"],
  [
    "add the parts of a segment to get the whole, subtract to find a missing part, and solve equations when the parts are expressions.",
    "学习把线段的各部分相加得到整体，用减法求缺少的部分，并在各部分用式子表示时解方程。",
  ],
);

/** bisectorFigure draws segment AB with midpoint M, a line through M at angle a, a point P on that line, and labels on PA and PB. */
function bisectorFigure(a: number, withP: readonly [string, string] | null, halves: readonly [string | null, string | null]): Mark[] {
  const A: Point = [-6, 0];
  const B: Point = [6, 0];
  const M: Point = [0, 0];
  const top = dir(a, 6.5);
  const marks: Mark[] = [
    seg(A, B),
    seg(dir(a + 180, 3.5), top),
    { kind: "label", at: top, text: "ℓ", dir: a > 90 ? "w" : "e", italic: true },
    ...dot(A, "A", "w"),
    ...dot(B, "B", "e"),
    ...dot(M, "M", a === 90 ? "se" : a < 90 ? "se" : "sw"),
    ticks(A, M),
    ticks(M, B),
  ];
  if (a === 90) marks.push({ kind: "right", vertex: M, from: B, to: top });
  if (halves[0]) marks.push({ kind: "side", a: M, b: A, text: halves[0] });
  if (halves[1]) marks.push({ kind: "side", a: B, b: M, text: halves[1] });
  if (withP) {
    const P = dir(a, 5);
    marks.push(seg(P, A), seg(P, B), ...dot(P, "P", "n"));
    marks.push({ kind: "side", a: A, b: P, text: withP[0] }, { kind: "side", a: P, b: B, text: withP[1] });
  }
  return marks;
}

/** segmentBisectorsAndThePerpendicularBisectorTheorem uses bisectors of segments and the equal distances from points of a perpendicular bisector. */
export const segmentBisectorsAndThePerpendicularBisectorTheorem = withIntro(
  topic(
    "segment-bisectors-and-the-perpendicular-bisector-theorem",
    t("Segment Bisectors and the Perpendicular Bisector Theorem", "线段的平分线与垂直平分线定理"),
    t(
      "A segment bisector is a line, ray or segment through the midpoint of a segment: it cuts the segment into two congruent halves. A bisector that is also perpendicular to the segment is its perpendicular bisector. The perpendicular bisector theorem says that every point on the perpendicular bisector of AB is the same distance from A and from B: PA = PB. Conversely, a point the same distance from A and B lies on the perpendicular bisector.",
      "经过线段中点的直线、射线或线段叫线段的平分线：它把线段分成两条全等的线段。垂直于线段的平分线叫这条线段的垂直平分线。垂直平分线定理：线段 AB 的垂直平分线上的每一点到 A 和 B 的距离相等，即 PA = PB。反过来，到 A 和 B 距离相等的点在线段的垂直平分线上。",
    ),
    ["midpoints", "parallel-and-perpendicular-lines"],
    ["7.G.A.2"],
    [
      lesson(
        "bisectors-of-segments",
        ["Segment bisectors", "线段的平分线"],
        [
          [
            "A bisector cuts a segment at its midpoint, so the whole is twice each half. Line $\\ell$ bisects $\\overline{AB}$ at $M$, $AB = 5x - 2$ and $AM = 2x + 3$: $5x - 2 = 2(2x + 3) = 4x + 6$, so $x = 8$. Then $AM = 19$ and $AB = 38$.",
            "平分线在中点处截线段，所以整条线段是每一半的两倍。直线 $\\ell$ 在 $M$ 处平分 $\\overline{AB}$，$AB = 5x - 2$，$AM = 2x + 3$：$5x - 2 = 2(2x + 3) = 4x + 6$，所以 $x = 8$。于是 $AM = 19$，$AB = 38$。",
          ],
          ["$38$ is twice $19$, so $M$ really is halfway.", "$38$ 是 $19$ 的两倍，$M$ 确实在正中间。"],
          [
            "Setting $5x - 2 = 2x + 3$ treats the whole segment as if it were one half.",
            "若列成 $5x - 2 = 2x + 3$，就把整条线段当成了一半。",
          ],
        ],
        (rng) => {
          const x = rng.int(2, 12);
          const L = rng.int(x + 4, 40);
          const half = expressionFor(rng, L, x, [3, 4, 5, 6]);
          const whole = expressionFor(rng, 2 * L, x, [2 * half[0], half[0]]);
          const doubled: Linear = [2 * half[0], 2 * half[1]];
          const u = pickUnit(rng);
          const askX = rng.bool();
          const figure = fig(
            bisectorFigure(rng.pick([60, 70, 110, 120]), null, [plain(...half), null]),
            `Line ℓ crosses segment AB at its midpoint M; AM = ${plain(...half)}.`,
            `直线 ℓ 经过线段 AB 的中点 M；AM = ${plain(...half)}。`,
          );
          const given: Pair = [
            `Line $\\ell$ bisects $${over("AB")}$ at $M$. $AB = ${linear(...whole)}$ and $AM = ${linear(...half)}$, in ${unitWords[u]}.`,
            `直线 $\\ell$ 在 $M$ 处平分 $${over("AB")}$。$AB = ${linear(...whole)}$，$AM = ${linear(...half)}$（单位：${u}）。`,
          ];
          const setUp: Walk = [
            ["Double the half", "把一半乘 2"],
            ["$M$ is the midpoint, so $AB = 2 \\cdot AM$:", "$M$ 是中点，所以 $AB = 2 \\cdot AM$："],
            [`${linear(...whole)} = 2(${linear(...half)}) = ${linear(...doubled)}`],
          ];
          const solve: Walk = [
            ["Solve for x", "解出 x"],
            ["Collect $x$ on one side:", "把 $x$ 集中到一边："],
            equalSteps(whole, doubled).slice(1),
          ];
          const check: Pair = [
            `At $x = ${x}$: $AM = ${subst(half, x)} = ${L}$ and $AB = ${subst(whole, x)} = ${2 * L}$, which is twice $${L}$.`,
            `$x = ${x}$ 时：$AM = ${subst(half, x)} = ${L}$，$AB = ${subst(whole, x)} = ${2 * L}$，正是 $${L}$ 的两倍。`,
          ];
          if (askX)
            return valued(
              [`${given[0]} Find $x$.`, `${given[1]}求 $x$。`],
              x,
              [setUp, solve],
              check,
              [
                [
                  Q.of(half[1] - whole[1], whole[0] - half[0]),
                  "That sets $AB$ equal to $AM$, as if the whole were one half.",
                  "这是让 $AB$ 等于 $AM$，把整条线段当成了一半。",
                ],
                [equalWrong(whole, doubled)[0]!, "That moves a constant across with the wrong sign.", "移项时常数的符号弄错了。"],
                [L, "That is the length of $AM$, not $x$.", "这是 $AM$ 的长度，不是 $x$。"],
              ],
              { figure },
            );
          return valued(
            [`${given[0]} How long is $${over("AB")}$?`, `${given[1]}$${over("AB")}$ 有多长？`],
            2 * L,
            [
              [setUp[0], setUp[1], [...(setUp[2] ?? []), ...equalSteps(whole, doubled).slice(1)]],
              [["Substitute", "代入"], [`Put $x = ${x}$ into $AB$:`, `把 $x = ${x}$ 代入 $AB$：`], [`AB = ${subst(whole, x)} = ${2 * L}`]],
            ],
            check,
            [
              [L, "That is only the half $AM$.", "这只是一半 $AM$。"],
              [x, "That is $x$, not a length.", "这是 $x$，不是长度。"],
              [4 * L, "That doubles the whole length instead of the half.", "这是把整条线段再乘 $2$，而不是把一半乘 $2$。"],
            ],
            { unit: u, figure },
          );
        },
        fig(
          bisectorFigure(70, null, ["2x + 3", null]),
          "Line ℓ crosses segment AB at its midpoint M; AM = 2x + 3.",
          "直线 ℓ 经过线段 AB 的中点 M；AM = 2x + 3。",
        ),
      ),
      lesson(
        "the-perpendicular-bisector-theorem",
        ["The perpendicular bisector theorem", "垂直平分线定理"],
        [
          [
            "Every point of the perpendicular bisector of $\\overline{AB}$ is the same distance from $A$ and from $B$. If $P$ is on it, $PA = 4x - 3$ and $PB = 2x + 9$, then $4x - 3 = 2x + 9$, so $x = 6$ and $PA = PB = 21$.",
            "$\\overline{AB}$ 的垂直平分线上的每一点到 $A$ 和 $B$ 的距离相等。若 $P$ 在它上面，$PA = 4x - 3$，$PB = 2x + 9$，则 $4x - 3 = 2x + 9$，所以 $x = 6$，$PA = PB = 21$。",
          ],
          [
            "Fold the page along $\\ell$: $A$ lands on $B$, so $\\overline{PA}$ lands on $\\overline{PB}$, and $2(6) + 9 = 21$ too.",
            "沿 $\\ell$ 把纸对折：$A$ 落在 $B$ 上，所以 $\\overline{PA}$ 落在 $\\overline{PB}$ 上；$2(6) + 9 = 21$ 也对。",
          ],
          [
            "$PM$ is the distance from $P$ to the segment, along $\\ell$; it is not $PA$ or $PB$.",
            "$PM$ 是 $P$ 沿 $\\ell$ 到线段的距离，不是 $PA$ 或 $PB$。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          if (rng.bool()) {
            const [am, pm, pa] = rng.pick([
              [3, 4, 5],
              [5, 12, 13],
              [6, 8, 10],
              [8, 6, 10],
              [9, 12, 15],
              [8, 15, 17],
              [12, 5, 13],
              [12, 9, 15],
              [7, 24, 25],
              [15, 8, 17],
            ] as const);
            const k = rng.pick([1, 2, 3]);
            const [AM, PM, PA] = [am * k, pm * k, pa * k];
            return valued(
              [
                `Line $\\ell$ is the perpendicular bisector of $${over("AB")}$ and meets it at $M$. Point $P$ is on $\\ell$, $PA = ${PA}\\text{ ${u}}$, $PM = ${PM}\\text{ ${u}}$ and $AM = ${AM}\\text{ ${u}}$. Find $PB$.`,
                `直线 $\\ell$ 是 $${over("AB")}$ 的垂直平分线，与它交于 $M$。点 $P$ 在 $\\ell$ 上，$PA = ${PA}\\text{ ${u}}$，$PM = ${PM}\\text{ ${u}}$，$AM = ${AM}\\text{ ${u}}$。求 $PB$。`,
              ],
              PA,
              [
                [
                  ["Place P", "确定 P 的位置"],
                  [`$P$ is on the perpendicular bisector of $${over("AB")}$.`, `$P$ 在 $${over("AB")}$ 的垂直平分线上。`],
                ],
                [
                  ["Use the theorem", "用定理"],
                  ["So $P$ is the same distance from both ends:", "所以 $P$ 到两端的距离相等："],
                  [`PB = PA = ${PA}\\text{ ${u}}`],
                ],
              ],
              [
                `Fold along $\\ell$: $M$ stays put and $A$ lands on $B$, since $MB = AM = ${AM}$, so $\\overline{PA}$ lands on $\\overline{PB}$ and they have the same length.`,
                `沿 $\\ell$ 对折：$M$ 不动，$A$ 落在 $B$ 上，因为 $MB = AM = ${AM}$，所以 $\\overline{PA}$ 落在 $\\overline{PB}$ 上，两者等长。`,
              ],
              [
                [PM, "That is $PM$, the distance from $P$ down to the segment.", "这是 $PM$，$P$ 到线段的距离。"],
                [AM, "That is half of $AB$, not a distance from $P$.", "这是 $AB$ 的一半，不是从 $P$ 出发的距离。"],
                [2 * AM, "That is the length of $AB$.", "这是 $AB$ 的长度。"],
              ],
              {
                unit: u,
                figure: fig(
                  bisectorFigure(90, [`${PA} ${u}`, "?"], [`${AM} ${u}`, null]),
                  `Line ℓ is perpendicular to AB at its midpoint M. P is on ℓ; PA = ${PA} ${u} and AM = ${AM} ${u}.`,
                  `直线 ℓ 在 AB 的中点 M 处与 AB 垂直。P 在 ℓ 上；PA = ${PA} ${u}，AM = ${AM} ${u}。`,
                ),
              },
            );
          }
          const x = rng.int(2, 12);
          const L = rng.int(x + 5, 40);
          const e1 = expressionFor(rng, L, x);
          const e2 = expressionFor(rng, L, x, [e1[0]]);
          const askX = rng.bool();
          const lines = equalSteps(e1, e2);
          const [slip1, slip2] = equalWrong(e1, e2) as [Q, Q];
          return valued(
            [
              `Line $\\ell$ is the perpendicular bisector of $${over("AB")}$, and $P$ is on $\\ell$. $PA = ${linear(...e1)}$ and $PB = ${linear(...e2)}$, in ${unitWords[u]}. ${askX ? "Find $x$." : `How long is $${over("PA")}$?`}`,
              `直线 $\\ell$ 是 $${over("AB")}$ 的垂直平分线，$P$ 在 $\\ell$ 上。$PA = ${linear(...e1)}$，$PB = ${linear(...e2)}$（单位：${u}）。${askX ? "求 $x$。" : `$${over("PA")}$ 有多长？`}`,
            ],
            askX ? x : L,
            [
              [
                ["Set PA equal to PB", "让 PA 等于 PB"],
                ["$P$ is on the perpendicular bisector, so $PA = PB$:", "$P$ 在垂直平分线上，所以 $PA = PB$："],
                lines.slice(0, 1),
              ],
              askX
                ? [["Solve for x", "解出 x"], ["Collect $x$ on one side:", "把 $x$ 集中到一边："], lines.slice(1)]
                : [
                    ["Solve and substitute", "求解并代入"],
                    [`Solve, then put $x$ into $PA$:`, "解方程，再把 $x$ 代入 $PA$："],
                    [...lines.slice(1), `PA = ${subst(e1, x)} = ${L}`],
                  ],
            ],
            [
              `At $x = ${x}$: $PA = ${subst(e1, x)} = ${L}$ and $PB = ${subst(e2, x)} = ${L}$, the same distance.`,
              `$x = ${x}$ 时：$PA = ${subst(e1, x)} = ${L}$，$PB = ${subst(e2, x)} = ${L}$，距离相等。`,
            ],
            askX
              ? [
                  [slip1, "That moves a constant across with the wrong sign.", "移项时常数的符号弄错了。"],
                  [
                    slip2,
                    "That adds the $x$ terms instead of subtracting one from both sides.",
                    "这是把含 $x$ 的项相加了，应在两边同时减去其中一项。",
                  ],
                  [L, "That is the length of $PA$, not $x$.", "这是 $PA$ 的长度，不是 $x$。"],
                ]
              : [
                  [x, "That is $x$, not a length: put it into $PA$.", "这是 $x$，不是长度：要代入 $PA$。"],
                  [2 * L, "That adds $PA$ and $PB$ instead of finding one of them.", "这是把 $PA$ 和 $PB$ 相加了，只需求其中一个。"],
                  [at(e1, x + 1), "That puts the wrong value of $x$ into $PA$.", "代入 $PA$ 的 $x$ 值不对。"],
                ],
            {
              ...(!askX && { unit: u }),
              figure: fig(
                bisectorFigure(90, [plain(...e1), plain(...e2)], [null, null]),
                `Line ℓ is perpendicular to AB at its midpoint M. P is on ℓ; PA = ${plain(...e1)} and PB = ${plain(...e2)}.`,
                `直线 ℓ 在 AB 的中点 M 处与 AB 垂直。P 在 ℓ 上；PA = ${plain(...e1)}，PB = ${plain(...e2)}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["segment-bisectors-and-the-perpendicular-bisector-theorem#the-perpendicular-bisector-theorem"]),
      ),
      lesson(
        "the-converse",
        ["Points the same distance from both ends", "到两端距离相等的点"],
        [
          [
            "The converse of the theorem: a point that is the same distance from $A$ and from $B$ lies on the perpendicular bisector of $\\overline{AB}$. If $PA = PB = 7.5$ cm, then $P$ is on it.",
            "这个定理的逆定理：到 $A$ 和 $B$ 距离相等的点在 $\\overline{AB}$ 的垂直平分线上。若 $PA = PB = 7.5$ 厘米，则 $P$ 在垂直平分线上。",
          ],
          [
            "The midpoint $M$ is also the same distance from both ends, and the line through $M$ and $P$ is the perpendicular bisector.",
            "中点 $M$ 到两端的距离也相等，经过 $M$ 和 $P$ 的直线就是垂直平分线。",
          ],
          [
            "Close is not equal: with $PA = 7.5$ cm and $PB = 8$ cm, $P$ is not on the perpendicular bisector.",
            "接近不等于相等：$PA = 7.5$ 厘米，$PB = 8$ 厘米时，$P$ 不在垂直平分线上。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const pa = rng.bool() ? Q.of(rng.int(4, 40)) : halves(rng, 3, 30);
          const kind = rng.int(0, 2);
          const pb = kind === 0 ? pa : pa.add(rng.pick([Q.of(1, 2), Q.of(1), Q.of(-1, 2), Q.of(2), Q.of(-1)]));
          const ab = Q.of(rng.int(4, Math.max(5, Math.floor(pa.toNumber()))));
          const tex = (v: Q) => `${result(v)}\\text{ ${u}}`;
          const name = rng.pick(["P", "Q", "R"]);
          const gap = result(pb.sub(pa).abs());
          return decided(
            rng,
            [
              `$AB = ${tex(ab)}$. Point $${name}$ is $${tex(pa)}$ from $A$ and $${tex(pb)}$ from $B$. Does $${name}$ lie on the perpendicular bisector of $${over("AB")}$?`,
              `$AB = ${tex(ab)}$。点 $${name}$ 到 $A$ 的距离是 $${tex(pa)}$，到 $B$ 的距离是 $${tex(pb)}$。$${name}$ 在 $${over("AB")}$ 的垂直平分线上吗？`,
            ],
            kind === 0,
            [
              [
                ["Compare the distances", "比较距离"],
                [`$${name}A = ${tex(pa)}$ and $${name}B = ${tex(pb)}$.`, `$${name}A = ${tex(pa)}$，$${name}B = ${tex(pb)}$。`],
              ],
              kind === 0
                ? [
                    ["Use the converse", "用逆定理"],
                    [`They are equal, so $${name}$ lies on the perpendicular bisector.`, `它们相等，所以 $${name}$ 在垂直平分线上。`],
                  ]
                : [
                    ["Use the theorem", "用定理"],
                    [
                      `They differ by $${gap}$, so $${name}$ is not on the perpendicular bisector.`,
                      `它们相差 $${gap}$，所以 $${name}$ 不在垂直平分线上。`,
                    ],
                  ],
            ],
            kind === 0
              ? [
                  `The midpoint $M$ is $${result(ab.div(Q.of(2)))}$ from each end, also equal, and the line through $M$ and $${name}$ is the perpendicular bisector.`,
                  `中点 $M$ 到两端都是 $${result(ab.div(Q.of(2)))}$，也相等，经过 $M$ 和 $${name}$ 的直线就是垂直平分线。`,
                ]
              : [
                  `If $${name}$ were on it, folding along the bisector would carry $\\overline{${name}A}$ onto $\\overline{${name}B}$ and make them equal, but they are not.`,
                  `如果 $${name}$ 在上面，沿平分线对折会把 $\\overline{${name}A}$ 叠到 $\\overline{${name}B}$ 上，二者应相等，但它们不相等。`,
                ],
            kind === 0
              ? [
                  `$${name}A$ and $${name}B$ are equal, and any point equally far from $A$ and $B$ is on the bisector.`,
                  `$${name}A$ 与 $${name}B$ 相等，到 $A$、$B$ 距离相等的点都在平分线上。`,
                ]
              : [
                  "The distances are close, but a point on the bisector must be exactly the same distance from both ends.",
                  "两个距离很接近，但平分线上的点到两端的距离必须完全相等。",
                ],
          );
        },
        drawn(gradeDrawings4["segment-bisectors-and-the-perpendicular-bisector-theorem#the-converse"]),
      ),
    ],
  ),
  [
    "Two friends live at $A$ and $B$ and want a meeting spot the same walk from both homes. Every spot on the line that crosses $\\overline{AB}$ at a right angle through its middle works.",
    "两个朋友分别住在 $A$ 和 $B$，想找一个到两家路程相同的见面地点。经过 $\\overline{AB}$ 中点、并与它垂直的直线上的每个地点都可以。",
  ],
  [
    "The middle of $\\overline{AB}$ itself is on that line, and it is half of $AB$ from each home.",
    "$\\overline{AB}$ 的中点本身就在这条直线上，它到两家的距离都是 $AB$ 的一半。",
  ],
  [
    "use segment bisectors to find lengths, and use the perpendicular bisector theorem and its converse.",
    "学习用线段的平分线求长度，并运用垂直平分线定理及其逆定理。",
  ],
);
// ---------------------------------------------------------------------------
// Angles

/** angleName writes an angle with its vertex in the middle: "\angle ABC". */
const angleName = (name: string) => `\\angle ${name}`;

/** measure writes the measure of an angle: "m\angle ABC". */
const measure = (name: string) => `m\\angle ${name}`;

/** degTex writes a number of degrees in LaTeX: "35^\circ". */
const degTex = (d: number | string) => `${d}^\\circ`;

/** openAngle draws the angle of d degrees at o between the directions start and start + d, with arms of length r and named points. */
function openAngle(o: Point, start: number, d: number, letters: string, label: string, r = 4): Mark[] {
  const a = dir(start, r, o);
  const c = dir(start + d, r, o);
  const inside = dir(start + d / 2, 1, o);
  return [
    seg(o, a),
    seg(o, c),
    arc(o, a, c, label),
    ...dot(a, letters[0]!, awayFrom(a, o)),
    ...dot(o, letters[1]!, awayFrom(o, inside)),
    ...dot(c, letters[2]!, awayFrom(c, o)),
  ];
}

/** angleSets are the letters of the four angles in a figure, vertex in the middle. */
const angleSets = ["ABC", "DEF", "GHI", "JKL"] as const;

/** congruentAngles recognizes congruent angles by their measures and solves for an unknown in congruent angles. */
export const congruentAngles = withIntro(
  topic(
    "congruent-angles",
    t("Congruent Angles", "全等的角"),
    t(
      "Angles are congruent when they have the same measure, however long their arms are drawn and however they are turned. If ∠A ≅ ∠B and their measures are written as expressions, set the expressions equal and solve.",
      "度数相等的角是全等的角，与边画得多长、朝哪个方向无关。若 ∠A ≅ ∠B，且它们的度数用式子表示，就令两个式子相等，再解方程。",
    ),
    ["angles-and-angle-measures", "equations-with-variables-on-both-sides"],
    ["7.G.A.2", "8.G.A.2"],
    [
      lesson(
        "identifying-congruent-angles",
        ["Identifying congruent angles", "辨认全等的角"],
        [
          [
            "Two angles are **congruent**, written $\\angle ABC \\cong \\angle DEF$, when $m\\angle ABC = m\\angle DEF$. Only the opening between the arms matters: an angle of $40^\\circ$ with long arms is congruent to an angle of $40^\\circ$ with short arms that points the other way.",
            "两个角的度数相等时，它们是**全等**的，记作 $\\angle ABC \\cong \\angle DEF$，即 $m\\angle ABC = m\\angle DEF$。只有两边张开的大小有关：边很长的 $40^\\circ$ 角与边很短、朝向相反的 $40^\\circ$ 角全等。",
          ],
          [
            "Turn the short angle around and lay it on the long one, vertex on vertex: the arms point the same way, so the openings match.",
            "把边短的角转过来，顶点对顶点放在边长的角上：两条边的方向一致，所以张开的大小相同。",
          ],
          [
            "Do not judge by the length of the arms or by the way the angle points. Compare the measures.",
            "不要看边的长短，也不要看角的朝向。要比较度数。",
          ],
        ],
        (rng) => {
          const a = rng.int(25, 150);
          const near = rng.shuffle(
            [...new Set([a + 10, a - 10, a + 15, a - 15, 180 - a])].filter((v) => v > 10 && v < 170 && Math.abs(v - a) >= 10),
          );
          const others = [a, near[0]!, near[1]!];
          const order = rng.shuffle([0, 1, 2]);
          const spots: Point[] = [
            [11, 0],
            [0, -9],
            [11, -9],
          ];
          const marks: Mark[] = [...openAngle([0, 0], rng.int(0, 40), a, "ABC", deg(a), 4)];
          order.forEach((k, i) => {
            const d = others[k]!;
            // The congruent angle gets different arms and a different turn, so its look does not give it away.
            const r = k === 0 ? rng.pick([2.8, 5]) : 4;
            marks.push(...openAngle(spots[i]!, rng.int(0, 180 - d), d, angleSets[i + 1]!, deg(d), r));
          });
          const match = angleSets[order.indexOf(0) + 1]!;
          const measureOf = (s: string) => others[order[angleSets.indexOf(s as (typeof angleSets)[number]) - 1]!]!;
          const rest = angleSets.slice(1).filter((s) => s !== match);
          const desc = order.map((k, i) => `${angleSets[i + 1]} measures ${others[k]}°`).join(", ");
          const descZh = order.map((k, i) => `${angleSets[i + 1]} 为 ${others[k]}°`).join("，");
          return chosenMath(
            rng,
            [`Which angle is congruent to $${angleName("ABC")}$?`, `哪个角与 $${angleName("ABC")}$ 全等？`],
            angleName(match),
            rest.map(
              (s) =>
                [
                  angleName(s),
                  `$${measure(s)} = ${degTex(measureOf(s))}$, not $${degTex(a)}$.`,
                  `$${measure(s)} = ${degTex(measureOf(s))}$，不是 $${degTex(a)}$。`,
                ] as const,
            ),
            [
              [
                ["Read the given angle", "读出给定的角"],
                ["Read its measure from the figure:", "从图中读出它的度数："],
                [`${measure("ABC")} = ${degTex(a)}`],
              ],
              [
                ["Find the same measure", "找出度数相同的角"],
                [
                  "Only one other angle opens just as wide, whatever its arms and its turn:",
                  "只有一个角张开得一样大，不管它的边多长、朝向如何：",
                ],
                [`${measure(match)} = ${degTex(a)}`],
              ],
            ],
            [
              `Subtract each measure from $${degTex(a)}$: only $${angleName(match)}$ gives $0$, while ${rest.map((s) => `$${angleName(s)}$ gives $${a - measureOf(s)}$`).join(" and ")}.`,
              `用 $${degTex(a)}$ 减去每个角的度数：只有 $${angleName(match)}$ 得 $0$，${rest.map((s) => `$${angleName(s)}$ 得 $${a - measureOf(s)}$`).join("，")}。`,
            ],
            fig(marks, `Four angles. ABC measures ${a}°, ${desc}.`, `四个角。ABC 为 ${a}°，${descZh}。`),
          );
        },
        drawn(gradeDrawings3["congruent-angles#identifying-congruent-angles"]),
      ),
      {
        ...lesson(
          "congruent-angles-with-algebra",
          ["Congruent angles with algebra", "用方程求全等的角"],
          [
            [
              "If $\\angle P \\cong \\angle Q$ with $m\\angle P = (3x + 12)^\\circ$ and $m\\angle Q = (5x - 20)^\\circ$, the measures are equal:\n\n$$3x + 12 = 5x - 20 \\;\\Rightarrow\\; 32 = 2x \\;\\Rightarrow\\; x = 16.$$\n\nEach angle measures $3 \\cdot 16 + 12 = 60^\\circ$.",
              "若 $\\angle P \\cong \\angle Q$，$m\\angle P = (3x + 12)^\\circ$，$m\\angle Q = (5x - 20)^\\circ$，则两个度数相等：\n\n$$3x + 12 = 5x - 20 \\;\\Rightarrow\\; 32 = 2x \\;\\Rightarrow\\; x = 16.$$\n\n每个角都是 $3 \\cdot 16 + 12 = 60^\\circ$。",
            ],
            [
              "Put $x = 16$ into the other angle: $5 \\cdot 16 - 20 = 60^\\circ$, the same measure.",
              "把 $x = 16$ 代入另一个角：$5 \\cdot 16 - 20 = 60^\\circ$，度数相同。",
            ],
            [
              "Congruent angles are equal, not supplementary: set the expressions equal to each other, not their sum to $180^\\circ$.",
              "全等的角相等，不是互补：要令两个式子相等，而不是令它们的和等于 $180^\\circ$。",
            ],
          ],
          (rng) => {
            const x = rng.int(4, 18);
            const v = rng.int(30, 140);
            const e1 = expressionFor(rng, v, x);
            const e2 = expressionFor(rng, v, x, [e1[0]]);
            const askX = rng.bool();
            const [p, q] = rng.pick([
              ["P", "Q"],
              ["A", "B"],
              ["R", "S"],
            ] as const);
            const head: Pair = [
              `$${angleName(p)} \\cong ${angleName(q)}$, $${measure(p)} = ${angleTex(...e1)}$ and $${measure(q)} = ${angleTex(...e2)}$.`,
              `$${angleName(p)} \\cong ${angleName(q)}$，$${measure(p)} = ${angleTex(...e1)}$，$${measure(q)} = ${angleTex(...e2)}$。`,
            ];
            const [first, ...rest] = equalSteps(e1, e2);
            const [signSlip, addSlip] = equalWrong(e1, e2);
            const check: Pair = [
              `$${measure(p)} = ${subst(e1, x)} = ${degTex(v)}$ and $${measure(q)} = ${subst(e2, x)} = ${degTex(v)}$: the measures match.`,
              `$${measure(p)} = ${subst(e1, x)} = ${degTex(v)}$，$${measure(q)} = ${subst(e2, x)} = ${degTex(v)}$：两个角度数相同。`,
            ];
            const equal: Walk = [
              ["Set the measures equal", "令度数相等"],
              ["Congruent angles have equal measures:", "全等的角度数相等："],
              [first as string],
            ];
            if (askX)
              return valued(
                [`${head[0]} Find $x$.`, `${head[1]}求 $x$。`],
                x,
                [
                  equal,
                  [
                    ["Solve for x", "解出 x"],
                    rest.length > 1
                      ? ["Collect $x$ on the side with the larger coefficient, then divide:", "把 $x$ 集中到系数较大的一边，再相除："]
                      : ["Collect $x$ on the side with the larger coefficient:", "把 $x$ 集中到系数较大的一边："],
                    rest,
                  ],
                ],
                check,
                [
                  [
                    signSlip as Q,
                    "That moves a constant with the wrong sign. Undo it by doing the opposite.",
                    "这是把常数移项时符号弄错了。移项要做相反的运算。",
                  ],
                  [
                    addSlip as Q,
                    "That adds the $x$ terms. To collect them on one side, subtract one from both sides.",
                    "这是把含 $x$ 的项相加了。要把它们集中到一边，应在两边同时减去其中一项。",
                  ],
                  [v, "That is the measure of each angle, not $x$.", "这是每个角的度数，不是 $x$。"],
                ],
              );
            return valued(
              [`${head[0]} Find $${measure(p)}$.`, `${head[1]}求 $${measure(p)}$。`],
              v,
              [
                [equal[0], equal[1], [first as string, ...rest]],
                [
                  ["Substitute", "代入"],
                  [`Put $x = ${x}$ into $${measure(p)}$:`, `把 $x = ${x}$ 代入 $${measure(p)}$：`],
                  [`${measure(p)} = ${subst(e1, x)} = ${degTex(v)}`],
                ],
              ],
              check,
              [
                [
                  x,
                  `That is $x$, not the angle: put it into $${angleTex(...e1)}$.`,
                  `这是 $x$ 的值，不是角的度数：要代入 $${angleTex(...e1)}$。`,
                ],
                [
                  180 - v,
                  "That is the supplement of the angle. Congruent angles are equal, not supplementary.",
                  "这是这个角的补角。全等的角相等，不是互补。",
                ],
                ...(v < 90
                  ? [
                      [
                        90 - v,
                        "That is the complement of the angle. Congruent angles are equal.",
                        "这是这个角的余角。全等的角是相等的。",
                      ] as const,
                    ]
                  : []),
              ],
              { unit: "°" },
            );
          },
          drawn(gradeDrawings4["congruent-angles#congruent-angles-with-algebra"]),
        ),
        keyPrerequisites: ["equations-with-variables-on-both-sides"],
      },
    ],
  ),
  [
    "Open small scissors until the blades make $30^\\circ$, then open big garden shears to $30^\\circ$ too. The blades are different lengths, but the openings are the same, so the two angles are congruent.",
    "把小剪刀张开到 $30^\\circ$，再把大园艺剪也张开到 $30^\\circ$。刀刃长短不同，但张开的大小一样，所以这两个角全等。",
  ],
  ["A protractor reads $30^\\circ$ on both, and $30 = 30$.", "用量角器量，两个都是 $30^\\circ$，$30 = 30$。"],
  [
    "recognize congruent angles by their measures, and set equal measures equal to solve for an unknown.",
    "通过度数辨认全等的角，并利用度数相等求出未知数。",
  ],
);

/** splitAngle draws ∠ABC of total degrees split by ray BD into parts first and total − first, labeled. */
function splitAngle(start: number, total: number, first: number, labels: readonly [string, string]): Mark[] {
  const B: Point = [0, 0];
  const A = dir(start, 5);
  const D = dir(start + first, 5);
  const C = dir(start + total, 5);
  const marks: Mark[] = [seg(B, A), seg(B, D), seg(B, C), arc(B, A, D, labels[0]), arc(B, D, C, labels[1])];
  return [
    ...marks,
    ...dot(A, "A", awayFrom(A, B)),
    ...dot(B, "B", awayFrom(B, dir(start + total / 2, 1))),
    ...dot(C, "C", awayFrom(C, B)),
    ...dot(D, "D", awayFrom(D, B)),
  ];
}

/** PairKind describes complementary (90°) or supplementary (180°) angles in both languages. */
interface PairKind {
  readonly total: 90 | 180;
  readonly word: Text;
  readonly other: Text;
}

const complementary: PairKind = { total: 90, word: t("complementary", "互余"), other: t("complement", "余角") };
const supplementary: PairKind = { total: 180, word: t("supplementary", "互补"), other: t("supplement", "补角") };

/** wholeName names the angle that a pair of complementary or supplementary angles makes up, in both languages. */
const wholeName = (total: 90 | 180): Pair => (total === 90 ? ["right angle", "直角"] : ["straight angle", "平角"]);

/** pairFigureProblem finds the unknown part of a right angle or a straight angle split by a ray. */
function pairFigureProblem(rng: Rng, kind: PairKind): Problem {
  const total = kind.total;
  const otherTotal = total === 90 ? 180 : 90;
  const a = total === 90 ? rng.int(12, 78) : rng.int(20, 160);
  const start = total === 90 ? rng.pick([0, 15, 30, 90, 180, 200]) : rng.pick([0, 5, 10, 350, 355]);
  const x = total - a;
  const firstKnown = rng.bool();
  const [first, labels]: [number, [string, string]] = firstKnown ? [a, [deg(a), "x°"]] : [x, ["x°", deg(a)]];
  const [wholeEn, wholeZh] = wholeName(total);
  return valued(
    total === 90
      ? [`$${angleName("ABC")}$ is a right angle. Find $x$.`, `$${angleName("ABC")}$ 是直角。求 $x$。`]
      : ["Points $A$, $B$ and $C$ lie on a line. Find $x$.", "点 $A$、$B$、$C$ 在同一条直线上。求 $x$。"],
    x,
    [
      [
        ["Write the sum", "写出和"],
        [
          `The two angles make up the ${wholeEn}, so they are ${kind.word.en} and add up to $${degTex(total)}$:`,
          `两个角合起来是${wholeZh}，所以它们${kind.word["zh-CN"]}，和为 $${degTex(total)}$：`,
        ],
        [`x + ${a} = ${total}`],
      ],
      [["Subtract", "相减"], [`Take $${a}$ away from $${total}$:`, `用 $${total}$ 减去 $${a}$：`], [`x = ${total} - ${a} = ${x}`]],
    ],
    [`$${x} + ${a} = ${total}$, a whole ${wholeEn}.`, `$${x} + ${a} = ${total}$，正好是一个${wholeZh}。`],
    [
      [a, `That is the angle already marked. $x$ is the other part.`, `这是图中已经标出的角。$x$ 是另一部分。`],
      ...(otherTotal - a > 0
        ? [
            [
              otherTotal - a,
              `That takes $${a}$ from $${otherTotal}$, but a ${wholeEn} is $${degTex(total)}$.`,
              `这是用 $${otherTotal}$ 减去 $${a}$，但${wholeZh}是 $${degTex(total)}$。`,
            ] as const,
          ]
        : []),
      [total + a, `That adds the marked angle to $${total}$. Subtract it instead.`, `这是把已知角加到了 $${total}$ 上。应该相减。`],
    ],
    {
      form: "integer",
      figure: fig(
        splitAngle(start, total, first, labels),
        `${total === 90 ? "A right angle ABC" : "A straight angle ABC"} split by ray BD into angles of ${firstKnown ? `${a}° and x°` : `x° and ${a}°`}.`,
        `射线 BD 把${total === 90 ? "直角" : "平角"} ABC 分成 ${firstKnown ? `${a}° 和 x°` : `x° 和 ${a}°`} 两个角。`,
      ),
    },
  );
}

/** pairAlgebraProblem solves for x when two angles given as expressions are complementary or supplementary. */
function pairAlgebraProblem(rng: Rng, kind: PairKind): Problem {
  const total = kind.total;
  const otherTotal = total === 90 ? 180 : 90;
  const x = rng.int(3, 15);
  const p = total === 90 ? rng.int(20, 70) : rng.int(35, 145);
  const e1 = expressionFor(rng, p, x);
  const e2 = expressionFor(rng, total - p, x);
  const askX = rng.bool();
  const head: Pair = [
    `$${angleName("P")}$ and $${angleName("Q")}$ are ${kind.word.en}, $${measure("P")} = ${angleTex(...e1)}$ and $${measure("Q")} = ${angleTex(...e2)}$.`,
    `$${angleName("P")}$ 与 $${angleName("Q")}$ ${kind.word["zh-CN"]}，$${measure("P")} = ${angleTex(...e1)}$，$${measure("Q")} = ${angleTex(...e2)}$。`,
  ];
  const lines = sumSteps([e1, e2], total).filter((line, i, all) => i === 0 || line !== all[i - 1]);
  const [signSlip, totalSlip] = sumWrong([e1, e2], total, otherTotal);
  const Kind = `${kind.word.en[0]!.toUpperCase()}${kind.word.en.slice(1)}`;
  const add: Walk = [
    ["Add the angles", "把两个角相加"],
    [`${Kind} angles add up to $${degTex(total)}$:`, `${kind.word["zh-CN"]}的两个角之和为 $${degTex(total)}$：`],
    lines.slice(0, 2),
  ];
  const solve: Walk = [
    ["Solve for x", "解出 x"],
    ["Undo the constant, then divide by the coefficient of $x$:", "先抵消常数，再除以 $x$ 的系数："],
    lines.slice(2),
  ];
  const check: Pair = [
    `$${measure("P")} = ${subst(e1, x)} = ${degTex(p)}$ and $${measure("Q")} = ${subst(e2, x)} = ${degTex(total - p)}$, and $${p} + ${total - p} = ${total}$.`,
    `$${measure("P")} = ${subst(e1, x)} = ${degTex(p)}$，$${measure("Q")} = ${subst(e2, x)} = ${degTex(total - p)}$，$${p} + ${total - p} = ${total}$。`,
  ];
  if (askX)
    return valued([`${head[0]} Find $x$.`, `${head[1]}求 $x$。`], x, [add, solve], check, [
      [
        signSlip as Q,
        "That moves the constant with the wrong sign. Undo it by doing the opposite.",
        "这是把常数移项时符号弄错了。移项要做相反的运算。",
      ],
      [
        totalSlip as Q,
        `That sets the sum to $${otherTotal}$, but ${kind.word.en} angles add up to $${total}$.`,
        `这是令和等于 $${otherTotal}$，但${kind.word["zh-CN"]}的两个角之和是 $${total}$。`,
      ],
      [p, `That is $${measure("P")}$, not $x$.`, `这是 $${measure("P")}$，不是 $x$。`],
    ]);
  return valued(
    [`${head[0]} Find $${measure("P")}$.`, `${head[1]}求 $${measure("P")}$。`],
    p,
    [
      add,
      solve,
      [
        ["Substitute", "代入"],
        [`Put $x = ${x}$ into $${measure("P")}$:`, `把 $x = ${x}$ 代入 $${measure("P")}$：`],
        [`${measure("P")} = ${subst(e1, x)} = ${degTex(p)}`],
      ],
    ],
    check,
    [
      [x, `That is $x$, not the angle: put it into $${angleTex(...e1)}$.`, `这是 $x$ 的值，不是角的度数：要代入 $${angleTex(...e1)}$。`],
      [total - p, `That is $${measure("Q")}$, the other angle.`, `这是另一个角 $${measure("Q")}$。`],
      ...(otherTotal - p > 0
        ? [
            [
              otherTotal - p,
              `That uses $${otherTotal}$ as the total, but ${kind.word.en} angles add up to $${total}$.`,
              `这是把和当成了 $${otherTotal}$，但${kind.word["zh-CN"]}的两个角之和是 $${total}$。`,
            ] as const,
          ]
        : []),
    ],
    { unit: "°" },
  );
}

/** pairWordProblem finds an angle described by its relation to its complement or supplement. */
function pairWordProblem(rng: Rng, kind: PairKind): Problem {
  const total = kind.total;
  const otherTotal = total === 90 ? 180 : 90;
  const [oEn, oZh] = [kind.other.en, kind.other["zh-CN"]];
  if (rng.bool()) {
    const ks = total === 90 ? [2, 4, 5, 8, 9] : [2, 3, 4, 5, 8, 9, 11];
    const k = rng.pick(ks);
    const other = total / (k + 1);
    const angle = k * other;
    const slip = (otherTotal * k) / (k + 1);
    return valued(
      [`An angle measures ${k} times its ${oEn}. What is the measure of the angle?`, `一个角是它的${oZh}的 ${k} 倍。这个角是多少度？`],
      angle,
      [
        [
          ["Write the equation", "列方程"],
          [
            `Let the ${oEn} be $x$; the angle is $${k}x$, and together they make $${degTex(total)}$:`,
            `设${oZh}为 $x$，这个角就是 $${k}x$，两者之和为 $${degTex(total)}$：`,
          ],
          [`x + ${k}x = ${total}`, `${k + 1}x = ${total}`],
        ],
        [
          ["Solve", "求解"],
          [`Divide by $${k + 1}$, then take $${k}$ times the ${oEn}:`, `除以 $${k + 1}$，再求${oZh}的 $${k}$ 倍：`],
          [`x = ${other}`, `${k} \\cdot ${other} = ${degTex(angle)}`],
        ],
      ],
      [
        `$${angle} + ${other} = ${total}$, and $${angle} \\div ${other} = ${k}$.`,
        `$${angle} + ${other} = ${total}$，并且 $${angle} \\div ${other} = ${k}$。`,
      ],
      [
        [other, `That is the ${oEn}, $x$. The angle is $${k}$ times it.`, `这是${oZh} $x$。这个角是它的 $${k}$ 倍。`],
        [
          Math.round(total / k),
          `That splits $${total}$ into $${k}$ parts, but the angle and its ${oEn} together make $${k + 1}$ equal parts.`,
          `这是把 $${total}$ 分成了 $${k}$ 份，但这个角和它的${oZh}合起来是 $${k + 1}$ 份。`,
        ],
        ...(Number.isInteger(slip)
          ? [
              [
                slip,
                `That uses $${otherTotal}$ as the total, but the angles add up to $${total}$.`,
                `这是把和当成了 $${otherTotal}$，但两个角之和是 $${total}$。`,
              ] as const,
            ]
          : []),
      ],
      { form: "integer", unit: "°" },
    );
  }
  const d = 2 * (total === 90 ? rng.int(4, 35) : rng.int(5, 70));
  const angle = (total + d) / 2;
  const other = angle - d;
  const more = rng.bool();
  const asked = more ? angle : other;
  const slip = (otherTotal + (more ? d : -d)) / 2;
  return valued(
    more
      ? [
          `An angle measures $${degTex(d)}$ more than its ${oEn}. What is the measure of the angle?`,
          `一个角比它的${oZh}大 $${degTex(d)}$。这个角是多少度？`,
        ]
      : [
          `An angle measures $${degTex(d)}$ less than its ${oEn}. What is the measure of the angle?`,
          `一个角比它的${oZh}小 $${degTex(d)}$。这个角是多少度？`,
        ],
    asked,
    more
      ? [
          [
            ["Write the equation", "列方程"],
            [
              `Let the ${oEn} be $x$; the angle is $x + ${d}$, and together they make $${degTex(total)}$:`,
              `设${oZh}为 $x$，这个角就是 $x + ${d}$，两者之和为 $${degTex(total)}$：`,
            ],
            [`x + (x + ${d}) = ${total}`, `2x = ${total - d}`],
          ],
          [
            ["Solve", "求解"],
            [`Halve, then add $${d}$ for the angle:`, `除以 $2$，再加上 $${d}$ 得到这个角：`],
            [`x = ${other}`, `${other} + ${d} = ${degTex(angle)}`],
          ],
        ]
      : [
          [
            ["Write the equation", "列方程"],
            [
              `Let the ${oEn} be $x$; the angle is $x - ${d}$, and together they make $${degTex(total)}$:`,
              `设${oZh}为 $x$，这个角就是 $x - ${d}$，两者之和为 $${degTex(total)}$：`,
            ],
            [`x + (x - ${d}) = ${total}`, `2x = ${total + d}`],
          ],
          [
            ["Solve", "求解"],
            [`Halve, then take away $${d}$ for the angle:`, `除以 $2$，再减去 $${d}$ 得到这个角：`],
            [`x = ${angle}`, `${angle} - ${d} = ${degTex(other)}`],
          ],
        ],
    [
      `$${angle} + ${other} = ${total}$, and $${angle} - ${other} = ${d}$.`,
      `$${angle} + ${other} = ${total}$，并且 $${angle} - ${other} = ${d}$。`,
    ],
    [
      [more ? other : angle, `That is the ${oEn}, not the angle.`, `这是${oZh}，不是这个角。`],
      [
        total - d,
        `That takes $${d}$ from $${total}$ but does not split what is left between the two angles.`,
        `这是用 $${total}$ 减去 $${d}$，但没有把剩下的分给两个角。`,
      ],
      ...(Number.isInteger(slip) && slip > 0
        ? [
            [
              slip,
              `That uses $${otherTotal}$ as the total, but the angles add up to $${total}$.`,
              `这是把和当成了 $${otherTotal}$，但两个角之和是 $${total}$。`,
            ] as const,
          ]
        : []),
    ],
    { form: "integer", unit: "°" },
  );
}

/** complementaryAngles finds unknown angles that add up to 90°. */
export const complementaryAngles = withIntro(
  topic(
    "complementary-angles",
    t("Complementary Angles", "互余的角"),
    t(
      "Two angles are complementary when their measures add up to 90°. When a ray splits a right angle, the two parts are complementary; when their measures are expressions, add them and set the sum equal to 90.",
      "两个角的度数之和为 90° 时，它们互余。一条射线把直角分成的两个角互余；两个角的度数用式子表示时，把它们相加，令和等于 90。",
    ),
    ["complementary-and-supplementary-angles", "two-step-equations"],
    ["7.G.B.5"],
    [
      lesson(
        "complements-in-a-figure",
        ["Complements in a figure", "图中的余角"],
        [
          [
            "A small square at a vertex marks a right angle. If a ray splits a right angle into a $35^\\circ$ angle and an angle $x^\\circ$, then $x + 35 = 90$, so $x = 55$.",
            "顶点处的小正方形表示直角。若一条射线把直角分成 $35^\\circ$ 的角和 $x^\\circ$ 的角，则 $x + 35 = 90$，所以 $x = 55$。",
          ],
          ["Add the parts back: $55 + 35 = 90$, the whole right angle.", "把两部分加回去：$55 + 35 = 90$，正好是整个直角。"],
          [
            "A right angle is $90^\\circ$, not $180^\\circ$: subtract from $90$.",
            "直角是 $90^\\circ$，不是 $180^\\circ$：要用 $90$ 去减。",
          ],
        ],
        (rng) => pairFigureProblem(rng, complementary),
        drawn(gradeDrawings3["complementary-angles#complements-in-a-figure"]),
      ),
      lesson(
        "equations-for-complementary-angles",
        ["Equations for complementary angles", "互余的角的方程"],
        [
          [
            "Complementary angles add up to $90^\\circ$. When their measures are given as expressions, set the sum of the expressions equal to $90$, solve for the variable, and substitute it back to find each angle.\n\nIf $\\angle P$ and $\\angle Q$ are complementary with $m\\angle P = (2x + 10)^\\circ$ and $m\\angle Q = (3x + 5)^\\circ$, then\n\n$$(2x + 10) + (3x + 5) = 90 \\;\\Rightarrow\\; 5x + 15 = 90 \\;\\Rightarrow\\; x = 15,$$\n\nand $m\\angle P = 2 \\cdot 15 + 10 = 40^\\circ$.",
            "互余的两个角之和是 $90^\\circ$。当角的度数用式子表示时，令两个式子之和等于 $90$，解出未知数，再代回去求出每个角。\n\n若 $\\angle P$ 与 $\\angle Q$ 互余，$m\\angle P = (2x + 10)^\\circ$，$m\\angle Q = (3x + 5)^\\circ$，则\n\n$$(2x + 10) + (3x + 5) = 90 \\;\\Rightarrow\\; 5x + 15 = 90 \\;\\Rightarrow\\; x = 15,$$\n\n$m\\angle P = 2 \\cdot 15 + 10 = 40^\\circ$。",
          ],
          [
            "$m\\angle Q = 3 \\cdot 15 + 5 = 50^\\circ$, and $40 + 50 = 90$.",
            "$m\\angle Q = 3 \\cdot 15 + 5 = 50^\\circ$，$40 + 50 = 90$。",
          ],
          [
            "$x = 15$ is not an angle. When the question asks for $m\\angle P$, put $x$ into its expression.",
            "$x = 15$ 不是角的度数。题目问 $m\\angle P$ 时，要把 $x$ 代入它的式子。",
          ],
        ],
        (rng) => pairAlgebraProblem(rng, complementary),
        drawn(gradeDrawings4["complementary-angles#equations-for-complementary-angles"]),
      ),
      lesson(
        "an-angle-and-its-complement",
        ["An angle and its complement", "一个角与它的余角"],
        [
          [
            "Call the complement $x$ and write the angle in terms of $x$. If an angle is $4$ times its complement, then $x + 4x = 90$, so $x = 18$ and the angle is $72^\\circ$. If an angle is $20^\\circ$ more than its complement, then $x + (x + 20) = 90$, so $x = 35$ and the angle is $55^\\circ$.",
            "设余角为 $x$，用 $x$ 表示这个角。若一个角是它的余角的 $4$ 倍，则 $x + 4x = 90$，$x = 18$，这个角是 $72^\\circ$。若一个角比它的余角大 $20^\\circ$，则 $x + (x + 20) = 90$，$x = 35$，这个角是 $55^\\circ$。",
          ],
          [
            "$72 + 18 = 90$ and $72 = 4 \\cdot 18$; $55 + 35 = 90$ and $55 - 35 = 20$.",
            "$72 + 18 = 90$，$72 = 4 \\cdot 18$；$55 + 35 = 90$，$55 - 35 = 20$。",
          ],
          [
            "$x$ is the complement. The question asks for the angle, so finish with $4x$ or $x + 20$.",
            "$x$ 是余角。题目问的是这个角，所以最后要算出 $4x$ 或 $x + 20$。",
          ],
        ],
        (rng) => pairWordProblem(rng, complementary),
        drawn(gradeDrawings4["complementary-angles#an-angle-and-its-complement"]),
      ),
    ],
  ),
  [
    "The corner of a book is a right angle. A bookmark laid across the corner from its tip splits it into $30^\\circ$ and the rest, so the rest is $90 - 30 = 60^\\circ$.",
    "书的一角是直角。一枚书签从角尖斜放，把这个角分成 $30^\\circ$ 和剩下的部分，剩下的是 $90 - 30 = 60^\\circ$。",
  ],
  ["The two parts fill the corner again: $30 + 60 = 90$.", "两部分合起来又是整个角：$30 + 60 = 90$。"],
  [
    "find angles that add up to $90^\\circ$, in a figure, with expressions, and from a description.",
    "在图中、用式子、根据文字描述，求和为 $90^\\circ$ 的角。",
  ],
);

/** supplementaryAngles finds unknown angles that add up to 180°. */
export const supplementaryAngles = withIntro(
  topic(
    "supplementary-angles",
    t("Supplementary Angles", "互补的角"),
    t(
      "Two angles are supplementary when their measures add up to 180°. Angles that together form a straight line are supplementary; when their measures are expressions, add them and set the sum equal to 180.",
      "两个角的度数之和为 180° 时，它们互补。合起来组成一条直线的两个角互补；两个角的度数用式子表示时，把它们相加，令和等于 180。",
    ),
    ["complementary-and-supplementary-angles", "two-step-equations"],
    ["7.G.B.5"],
    [
      lesson(
        "supplements-in-a-figure",
        ["Supplements in a figure", "图中的补角"],
        [
          [
            "A straight angle measures $180^\\circ$. If a ray from a point on a line splits the straight angle into a $112^\\circ$ angle and an angle $x^\\circ$, then $x + 112 = 180$, so $x = 68$.",
            "平角是 $180^\\circ$。若从直线上一点引出的射线把平角分成 $112^\\circ$ 的角和 $x^\\circ$ 的角，则 $x + 112 = 180$，所以 $x = 68$。",
          ],
          ["Add the parts back: $68 + 112 = 180$, the whole straight angle.", "把两部分加回去：$68 + 112 = 180$，正好是整个平角。"],
          [
            "A straight angle is $180^\\circ$, not $90^\\circ$: subtract from $180$.",
            "平角是 $180^\\circ$，不是 $90^\\circ$：要用 $180$ 去减。",
          ],
        ],
        (rng) => pairFigureProblem(rng, supplementary),
        drawn(gradeDrawings3["supplementary-angles#supplements-in-a-figure"]),
      ),
      lesson(
        "equations-for-supplementary-angles",
        ["Equations for supplementary angles", "互补的角的方程"],
        [
          [
            "Supplementary angles add up to $180^\\circ$. When their measures are given as expressions, set the sum of the expressions equal to $180$, solve for the variable, and substitute it back to find each angle.\n\nIf $\\angle P$ and $\\angle Q$ are supplementary with $m\\angle P = (4x - 6)^\\circ$ and $m\\angle Q = (2x + 6)^\\circ$, then\n\n$$(4x - 6) + (2x + 6) = 180 \\;\\Rightarrow\\; 6x = 180 \\;\\Rightarrow\\; x = 30,$$\n\nand $m\\angle P = 4 \\cdot 30 - 6 = 114^\\circ$.",
            "互补的两个角之和是 $180^\\circ$。当角的度数用式子表示时，令两个式子之和等于 $180$，解出未知数，再代回去求出每个角。\n\n若 $\\angle P$ 与 $\\angle Q$ 互补，$m\\angle P = (4x - 6)^\\circ$，$m\\angle Q = (2x + 6)^\\circ$，则\n\n$$(4x - 6) + (2x + 6) = 180 \\;\\Rightarrow\\; 6x = 180 \\;\\Rightarrow\\; x = 30,$$\n\n$m\\angle P = 4 \\cdot 30 - 6 = 114^\\circ$。",
          ],
          [
            "$m\\angle Q = 2 \\cdot 30 + 6 = 66^\\circ$, and $114 + 66 = 180$.",
            "$m\\angle Q = 2 \\cdot 30 + 6 = 66^\\circ$，$114 + 66 = 180$。",
          ],
          [
            "$x = 30$ is not an angle. When the question asks for $m\\angle P$, put $x$ into its expression.",
            "$x = 30$ 不是角的度数。题目问 $m\\angle P$ 时，要把 $x$ 代入它的式子。",
          ],
        ],
        (rng) => pairAlgebraProblem(rng, supplementary),
        drawn(gradeDrawings4["supplementary-angles#equations-for-supplementary-angles"]),
      ),
      lesson(
        "an-angle-and-its-supplement",
        ["An angle and its supplement", "一个角与它的补角"],
        [
          [
            "Call the supplement $x$ and write the angle in terms of $x$. If an angle is $3$ times its supplement, then $x + 3x = 180$, so $x = 45$ and the angle is $135^\\circ$. If an angle is $40^\\circ$ less than its supplement, then $x + (x - 40) = 180$, so $x = 110$ and the angle is $70^\\circ$.",
            "设补角为 $x$，用 $x$ 表示这个角。若一个角是它的补角的 $3$ 倍，则 $x + 3x = 180$，$x = 45$，这个角是 $135^\\circ$。若一个角比它的补角小 $40^\\circ$，则 $x + (x - 40) = 180$，$x = 110$，这个角是 $70^\\circ$。",
          ],
          [
            "$135 + 45 = 180$ and $135 = 3 \\cdot 45$; $70 + 110 = 180$ and $110 - 70 = 40$.",
            "$135 + 45 = 180$，$135 = 3 \\cdot 45$；$70 + 110 = 180$，$110 - 70 = 40$。",
          ],
          [
            "$x$ is the supplement. The question asks for the angle, so finish with $3x$ or $x - 40$.",
            "$x$ 是补角。题目问的是这个角，所以最后要算出 $3x$ 或 $x - 40$。",
          ],
        ],
        (rng) => pairWordProblem(rng, supplementary),
        drawn(gradeDrawings4["supplementary-angles#an-angle-and-its-supplement"]),
      ),
    ],
  ),
  [
    "A ladder leans on a wall and makes a $70^\\circ$ angle with the flat ground on one side. The ground is a straight line, so the angle on the other side of the ladder is $180 - 70 = 110^\\circ$.",
    "一架梯子靠在墙上，与一侧平地成 $70^\\circ$ 角。地面是一条直线，所以梯子另一侧的角是 $180 - 70 = 110^\\circ$。",
  ],
  ["The two angles fill the straight line: $70 + 110 = 180$.", "两个角合起来正好是一条直线：$70 + 110 = 180$。"],
  [
    "find angles that add up to $180^\\circ$, in a figure, with expressions, and from a description.",
    "在图中、用式子、根据文字描述，求和为 $180^\\circ$ 的角。",
  ],
);

/** bisectedAngle draws ∠ABC with the ray BD that bisects it. */
function bisectedAngle(start: number, total: number): Mark[] {
  const B: Point = [0, 0];
  const A = dir(start, 5);
  const D = dir(start + total / 2, 5.6);
  const C = dir(start + total, 5);
  return [
    seg(B, A),
    seg(B, D),
    seg(B, C),
    arc(B, A, D),
    arc(B, D, C),
    ...dot(A, "A", awayFrom(A, B)),
    ...dot(B, "B", awayFrom(B, D)),
    ...dot(C, "C", awayFrom(C, B)),
    ...dot(D, "D", awayFrom(D, B)),
  ];
}

/** ray writes a ray from its endpoint: "\overrightarrow{BD}". */
const ray = (name: string) => `\\overrightarrow{${name}}`;

/** angleBisectors uses a bisector to find half or all of an angle, also with expressions. */
export const angleBisectors = withIntro(
  topic(
    "angle-bisectors",
    t("Angle Bisectors", "角平分线"),
    t(
      "A ray that bisects an angle splits it into two congruent angles, each half of the whole. If BD bisects ∠ABC, then m∠ABD = m∠DBC and m∠ABC = 2 · m∠ABD.",
      "平分一个角的射线把它分成两个全等的角，每个都是原角的一半。若 BD 平分 ∠ABC，则 m∠ABD = m∠DBC，m∠ABC = 2 · m∠ABD。",
    ),
    ["congruent-angles"],
    ["7.G.B.5", "HSG.CO.D.12"],
    [
      lesson(
        "halves-and-wholes",
        ["Halves and wholes", "一半与整体"],
        [
          [
            "A bisector splits an angle into two congruent halves. If $\\overrightarrow{BD}$ bisects $\\angle ABC$ and $m\\angle ABC = 84^\\circ$, each half is $84 \\div 2 = 42^\\circ$. Going the other way, a half of $42^\\circ$ means the whole angle is $2 \\cdot 42 = 84^\\circ$.",
            "角平分线把一个角分成两个全等的部分。若 $\\overrightarrow{BD}$ 平分 $\\angle ABC$，$m\\angle ABC = 84^\\circ$，每一半是 $84 \\div 2 = 42^\\circ$。反过来，一半是 $42^\\circ$，整个角就是 $2 \\cdot 42 = 84^\\circ$。",
          ],
          ["$42 + 42 = 84$: the two halves fill the whole angle.", "$42 + 42 = 84$：两半正好合成整个角。"],
          [
            "Read which angle is given: from the whole, divide by $2$; from a half, multiply by $2$.",
            "看清已知的是哪个角：已知整个角就除以 $2$，已知一半就乘 $2$。",
          ],
        ],
        (rng) => {
          const half = rng.int(12, 85);
          const whole = 2 * half;
          const start = rng.pick([0, 10, 20, 180 - whole]);
          const fromWhole = rng.bool();
          const part = rng.pick(["ABD", "DBC"]);
          const given: Pair = [`$${ray("BD")}$ bisects $${angleName("ABC")}$`, `$${ray("BD")}$ 平分 $${angleName("ABC")}$`];
          const figure = fig(
            bisectedAngle(start, whole),
            "Angle ABC with ray BD splitting it into two equal angles.",
            "射线 BD 把角 ABC 分成两个相等的角。",
          );
          if (fromWhole)
            return valued(
              [
                `${given[0]}, and $${measure("ABC")} = ${degTex(whole)}$. Find $${measure(part)}$.`,
                `${given[1]}，$${measure("ABC")} = ${degTex(whole)}$。求 $${measure(part)}$。`,
              ],
              half,
              [
                [
                  ["Split in two", "分成两半"],
                  [
                    `The bisector cuts $${angleName("ABC")}$ into two congruent angles, and $${angleName(part)}$ is one of them.`,
                    `平分线把 $${angleName("ABC")}$ 分成两个全等的角，$${angleName(part)}$ 是其中之一。`,
                  ],
                ],
                [
                  ["Halve", "取一半"],
                  ["Divide the whole by $2$:", "把整个角除以 $2$："],
                  [`${measure(part)} = ${whole} \\div 2 = ${degTex(half)}`],
                ],
              ],
              [`The two halves fill the angle: $${half} + ${half} = ${whole}$.`, `两半合成整个角：$${half} + ${half} = ${whole}$。`],
              [
                [whole, "That is the whole angle, not one half.", "这是整个角，不是一半。"],
                [2 * whole, "That doubles the angle instead of halving it.", "这是把角乘 $2$，应该除以 $2$。"],
                [180 - whole, "That is the supplement of the angle, which the bisector does not use.", "这是这个角的补角，与平分线无关。"],
              ],
              { unit: "°", figure },
            );
          return valued(
            [
              `${given[0]}, and $${measure(part)} = ${degTex(half)}$. Find $${measure("ABC")}$.`,
              `${given[1]}，$${measure(part)} = ${degTex(half)}$。求 $${measure("ABC")}$。`,
            ],
            whole,
            [
              [
                ["Name the halves", "找出两半"],
                [
                  `$${angleName("ABD")}$ and $${angleName("DBC")}$ are congruent halves, each $${degTex(half)}$.`,
                  `$${angleName("ABD")}$ 与 $${angleName("DBC")}$ 是全等的两半，各为 $${degTex(half)}$。`,
                ],
              ],
              [
                ["Double", "乘 2"],
                ["The whole is two halves:", "整个角是两半之和："],
                [`${measure("ABC")} = 2 \\cdot ${half} = ${degTex(whole)}`],
              ],
            ],
            [`Halve it back: $${whole} \\div 2 = ${half}$, the given half.`, `再取一半：$${whole} \\div 2 = ${half}$，正是已知的一半。`],
            [
              [half, "That is only one half of the angle.", "这只是角的一半。"],
              [180 - half, "That is the supplement of the half.", "这是那一半的补角。"],
              ...(half < 90 ? [[90 - half, "That is the complement of the half.", "这是那一半的余角。"] as const] : []),
            ],
            { unit: "°", figure },
          );
        },
        drawn(gradeDrawings3["angle-bisectors#halves-and-wholes"]),
      ),
      lesson(
        "bisectors-with-algebra",
        ["Bisectors with algebra", "用方程解角平分线问题"],
        [
          [
            "Write an equation from the bisector. If $m\\angle ABD = (2x + 5)^\\circ$ and $m\\angle DBC = (4x - 15)^\\circ$, the halves are equal: $2x + 5 = 4x - 15$, so $x = 10$. If $m\\angle ABC = (6x + 4)^\\circ$ and $m\\angle ABD = (2x + 12)^\\circ$, the whole is twice the half: $6x + 4 = 2(2x + 12)$, so $x = 10$.",
            "由角平分线列方程。若 $m\\angle ABD = (2x + 5)^\\circ$，$m\\angle DBC = (4x - 15)^\\circ$，两半相等：$2x + 5 = 4x - 15$，所以 $x = 10$。若 $m\\angle ABC = (6x + 4)^\\circ$，$m\\angle ABD = (2x + 12)^\\circ$，整个角是一半的两倍：$6x + 4 = 2(2x + 12)$，所以 $x = 10$。",
          ],
          [
            "At $x = 10$: $2(10) + 5 = 25$ and $4(10) - 15 = 25$, equal halves; $6(10) + 4 = 64 = 2 \\cdot 32$.",
            "$x = 10$ 时：$2(10) + 5 = 25$，$4(10) - 15 = 25$，两半相等；$6(10) + 4 = 64 = 2 \\cdot 32$。",
          ],
          [
            "The whole angle is not equal to a half: when one expression is the whole, double the half before setting them equal.",
            "整个角不等于一半：如果一个式子表示整个角，要先把一半乘 $2$ 再列等式。",
          ],
        ],
        (rng) => {
          const x = rng.int(3, 15);
          const half = rng.int(15, 80);
          const whole = 2 * half;
          const askX = rng.bool();
          if (rng.bool()) {
            const e1 = expressionFor(rng, half, x);
            const e2 = expressionFor(rng, half, x, [e1[0]]);
            const lines = equalSteps(e1, e2);
            const [slip1, slip2] = equalWrong(e1, e2) as [Q, Q];
            const prompt: Pair = [
              `$${ray("BD")}$ bisects $${angleName("ABC")}$, $${measure("ABD")} = ${angleTex(...e1)}$ and $${measure("DBC")} = ${angleTex(...e2)}$. ${askX ? "Find $x$." : `Find $${measure("ABC")}$.`}`,
              `$${ray("BD")}$ 平分 $${angleName("ABC")}$，$${measure("ABD")} = ${angleTex(...e1)}$，$${measure("DBC")} = ${angleTex(...e2)}$。${askX ? "求 $x$。" : `求 $${measure("ABC")}$。`}`,
            ];
            const check: Pair = [
              `At $x = ${x}$: $${measure("ABD")} = ${subst(e1, x)} = ${half}$ and $${measure("DBC")} = ${subst(e2, x)} = ${half}$, equal halves.`,
              `$x = ${x}$ 时：$${measure("ABD")} = ${subst(e1, x)} = ${half}$，$${measure("DBC")} = ${subst(e2, x)} = ${half}$，两半相等。`,
            ];
            if (askX)
              return valued(
                prompt,
                x,
                [
                  [["Set the halves equal", "让两半相等"], ["The two halves are congruent:", "两半全等："], lines.slice(0, 1)],
                  [["Solve for x", "解出 x"], collecting(lines.slice(1)), lines.slice(1)],
                ],
                check,
                [
                  [slip1, "That moves a constant across with the wrong sign.", "移项时常数的符号弄错了。"],
                  [
                    slip2,
                    "That adds the $x$ terms instead of subtracting one from both sides.",
                    "这是把含 $x$ 的项相加了，应在两边同时减去其中一项。",
                  ],
                  [half, "That is the measure of each half, not $x$.", "这是每一半的度数，不是 $x$。"],
                ],
              );
            return valued(
              prompt,
              whole,
              [
                [["Set the halves equal and solve", "让两半相等并求解"], ["The two halves are congruent:", "两半全等："], lines],
                [
                  ["Substitute and double", "代入并乘 2"],
                  [`Put $x = ${x}$ into $${measure("ABD")}$, then double:`, `把 $x = ${x}$ 代入 $${measure("ABD")}$，再乘 $2$：`],
                  [`${measure("ABD")} = ${subst(e1, x)} = ${half}`, `${measure("ABC")} = 2 \\cdot ${half} = ${degTex(whole)}`],
                ],
              ],
              check,
              [
                [half, "That is only one half, $\\angle ABD$.", "这只是一半，$\\angle ABD$。"],
                [x, "That is $x$, not an angle.", "这是 $x$，不是角的度数。"],
                [4 * half, "That doubles the whole angle again.", "这是把整个角又乘了 $2$。"],
              ],
              { unit: "°" },
            );
          }
          const eh = expressionFor(rng, half, x);
          const ew = expressionFor(rng, whole, x, [2 * eh[0]]);
          const doubled: Linear = [2 * eh[0], 2 * eh[1]];
          const lines = [`${linear(...ew)} = 2(${linear(...eh)}) = ${linear(...doubled)}`, ...equalSteps(ew, doubled).slice(1)];
          const prompt: Pair = [
            `$${ray("BD")}$ bisects $${angleName("ABC")}$, $${measure("ABC")} = ${angleTex(...ew)}$ and $${measure("ABD")} = ${angleTex(...eh)}$. ${askX ? "Find $x$." : `Find $${measure("ABD")}$.`}`,
            `$${ray("BD")}$ 平分 $${angleName("ABC")}$，$${measure("ABC")} = ${angleTex(...ew)}$，$${measure("ABD")} = ${angleTex(...eh)}$。${askX ? "求 $x$。" : `求 $${measure("ABD")}$。`}`,
          ];
          const check: Pair = [
            `At $x = ${x}$: $${measure("ABD")} = ${subst(eh, x)} = ${half}$ and $${measure("ABC")} = ${subst(ew, x)} = ${whole}$, which is twice $${half}$.`,
            `$x = ${x}$ 时：$${measure("ABD")} = ${subst(eh, x)} = ${half}$，$${measure("ABC")} = ${subst(ew, x)} = ${whole}$，正是 $${half}$ 的两倍。`,
          ];
          if (askX)
            return valued(
              prompt,
              x,
              [
                [["Double the half", "把一半乘 2"], ["The whole angle is twice each half:", "整个角是每一半的两倍："], lines.slice(0, 1)],
                [["Solve for x", "解出 x"], collecting(lines.slice(1)), lines.slice(1)],
              ],
              check,
              [
                ...(ew[0] !== eh[0]
                  ? [
                      [
                        Q.of(eh[1] - ew[1], ew[0] - eh[0]),
                        "That sets the whole angle equal to the half.",
                        "这是让整个角等于一半。",
                      ] as const,
                    ]
                  : []),
                [
                  Q.of(2 * eh[1] - ew[1], ew[0] - 2 * eh[0]).neg(),
                  "That moves a constant across with the wrong sign.",
                  "移项时常数的符号弄错了。",
                ],
                [half, "That is the measure of the half, not $x$.", "这是一半的度数，不是 $x$。"],
              ],
            );
          return valued(
            prompt,
            half,
            [
              [
                ["Double the half and solve", "把一半乘 2 并求解"],
                ["The whole angle is twice each half:", "整个角是每一半的两倍："],
                lines,
              ],
              [
                ["Substitute", "代入"],
                [`Put $x = ${x}$ into $${measure("ABD")}$:`, `把 $x = ${x}$ 代入 $${measure("ABD")}$：`],
                [`${measure("ABD")} = ${subst(eh, x)} = ${degTex(half)}`],
              ],
            ],
            check,
            [
              [whole, "That is the whole angle, $\\angle ABC$.", "这是整个角 $\\angle ABC$。"],
              [x, "That is $x$, not an angle.", "这是 $x$，不是角的度数。"],
              [Math.floor(half / 2), "That halves the half again.", "这是把一半又取了一半。"],
            ],
            { unit: "°" },
          );
        },
        drawn(gradeDrawings4["angle-bisectors#bisectors-with-algebra"]),
      ),
    ],
  ),
  [
    "A paper fan opened to $120^\\circ$ has a middle rib that splits it fairly: each side opens $60^\\circ$.",
    "一把打开成 $120^\\circ$ 的纸扇，中间的扇骨把它平分：每一边张开 $60^\\circ$。",
  ],
  ["$60 + 60 = 120$, and the two sides match.", "$60 + 60 = 120$，两边一样大。"],
  [
    "use an angle bisector to find a half or the whole angle, and solve equations when the angles are expressions.",
    "学习用角平分线求一半或整个角，并在角用式子表示时解方程。",
  ],
);

/** raysFromLine draws line AB through O with rays to C and D above it, so ∠AOC, ∠COD and ∠DOB fill the straight angle. */
function raysFromLine(a: number, b: number, labels: readonly [string, string, string]): Mark[] {
  const O: Point = [0, 0];
  const A: Point = [-5.5, 0];
  const B: Point = [5.5, 0];
  const C = dir(180 - a, 5);
  const D = dir(b, 5);
  return [
    seg(A, B),
    seg(O, C),
    seg(O, D),
    arc(O, C, A, labels[0]),
    arc(O, D, C, labels[1]),
    arc(O, B, D, labels[2]),
    ...dot(A, "A", "w"),
    ...dot(B, "B", "e"),
    ...dot(O, "O", "s"),
    ...dot(C, "C", awayFrom(C, O)),
    ...dot(D, "D", awayFrom(D, O)),
  ];
}

/** raysAroundPoint draws four rays from O at the given directions, labeling the angle between each ray and the next. */
function raysAroundPoint(dirs: readonly number[], labels: readonly string[]): Mark[] {
  const O: Point = [0, 0];
  const ends = dirs.map((d) => dir(d, 5));
  return [
    ...ends.map((p) => seg(O, p)),
    ...ends.map((p, i) => arc(O, p, ends[(i + 1) % ends.length]!, labels[i])),
    ...ends.flatMap((p, i) => dot(p, "PQRS"[i]!, awayFrom(p, O))),
    { kind: "dot", at: O },
  ];
}

/** crossWithPerpendicular draws lines AB and CD crossing at O and ray OE perpendicular to AB, with ∠COE = a. */
function crossWithPerpendicular(a: number): Mark[] {
  const O: Point = [0, 0];
  const A: Point = [-6, 0];
  const B: Point = [6, 0];
  const E: Point = [0, 5.5];
  const C = dir(90 + a, 6);
  const D = dir(270 + a, 6);
  return [
    seg(A, B),
    seg(C, D),
    seg(O, E),
    { kind: "right", vertex: O, from: B, to: E },
    arc(O, E, C, deg(a)),
    ...dot(A, "A", "w"),
    ...dot(B, "B", "e"),
    ...dot(C, "C", awayFrom(C, O)),
    ...dot(D, "D", awayFrom(D, O)),
    ...dot(E, "E", "n"),
    { kind: "label", at: O, text: "O", dir: "sw", italic: true },
  ];
}

/** solvingProblemsWithAngles combines angle facts: angles on a line, around a point, vertical and complementary angles. */
export const solvingProblemsWithAngles = withIntro(
  topic(
    "solving-problems-with-angles",
    t("Solving Problems With Angles", "解角的问题"),
    t(
      "Angles that fill a straight line add up to 180°, and angles that fill the space around a point add up to 360°. In harder figures, chain several facts together: right angles, complements, supplements and vertical angles.",
      "合起来组成一条直线的角之和为 180°，合起来围成一周的角之和为 360°。在较复杂的图中，要把几个事实连起来用：直角、余角、补角和对顶角。",
    ),
    ["supplementary-angles", "complementary-angles", "vertical-angles"],
    ["7.G.B.5"],
    [
      lesson(
        "angles-on-a-line-and-around-a-point",
        ["Angles on a line and around a point", "直线上与一点周围的角"],
        [
          [
            "Angles that fill a straight line add up to $180^\\circ$: if the parts are $40^\\circ$, $x^\\circ$ and $65^\\circ$, then $x = 180 - 40 - 65 = 75$. Angles that fill the turn around a point add up to $360^\\circ$: with $90^\\circ$, $120^\\circ$, $85^\\circ$ and $x^\\circ$, $x = 360 - 295 = 65$.",
            "合成一条直线的角和为 $180^\\circ$：若各部分为 $40^\\circ$、$x^\\circ$、$65^\\circ$，则 $x = 180 - 40 - 65 = 75$。围成一周的角和为 $360^\\circ$：若各角为 $90^\\circ$、$120^\\circ$、$85^\\circ$、$x^\\circ$，则 $x = 360 - 295 = 65$。",
          ],
          [
            "Add all the parts back: $40 + 75 + 65 = 180$ and $90 + 120 + 85 + 65 = 360$.",
            "把各部分加回去：$40 + 75 + 65 = 180$，$90 + 120 + 85 + 65 = 360$。",
          ],
          [
            "Look at what the angles fill: a straight line is $180^\\circ$, a whole turn is $360^\\circ$.",
            "看清这些角合成的是什么：一条直线是 $180^\\circ$，一整圈是 $360^\\circ$。",
          ],
        ],
        (rng) => {
          if (rng.bool()) {
            let a: number;
            let b: number;
            do {
              a = rng.int(20, 100);
              b = rng.int(20, 100);
            } while (180 - a - b < 20);
            const x = 180 - a - b;
            return valued(
              ["Points $A$, $O$ and $B$ lie on a line. Find $x$.", "点 $A$、$O$、$B$ 在同一条直线上。求 $x$。"],
              x,
              [
                [
                  ["Add the known angles", "把已知角相加"],
                  [`The three angles fill the straight angle at $O$; the known ones make`, `三个角合成 $O$ 处的平角；已知的两个角之和是`],
                  [`${a} + ${b} = ${a + b}`],
                ],
                [
                  ["Subtract from 180°", "用 180° 相减"],
                  ["The rest of the straight angle is $x$:", "平角剩下的部分就是 $x$："],
                  [`x = 180 - ${a + b} = ${x}`],
                ],
              ],
              [`$${a} + ${x} + ${b} = 180$, a straight angle.`, `$${a} + ${x} + ${b} = 180$，正是平角。`],
              [
                [
                  360 - a - b,
                  "That uses a whole turn, but the angles fill only a straight line.",
                  "这是用一整圈来算，但这些角只合成一条直线。",
                ],
                ...(90 - a - b > 0
                  ? [[90 - a - b, "That uses a right angle instead of a straight angle.", "这是用直角来算，而不是平角。"] as const]
                  : []),
                [a + b, "That is the sum of the known angles, not what is left.", "这是已知角的和，不是剩下的部分。"],
              ],
              {
                figure: fig(
                  raysFromLine(a, b, [deg(a), "x°", deg(b)]),
                  `Line AB with rays OC and OD above it. Angle AOC is ${a}°, angle COD is x° and angle DOB is ${b}°.`,
                  `直线 AB 上方有射线 OC、OD。角 AOC 为 ${a}°，角 COD 为 x°，角 DOB 为 ${b}°。`,
                ),
              },
            );
          }
          let parts: number[];
          do parts = [rng.int(40, 130), rng.int(40, 130), rng.int(40, 130)];
          while (360 - parts[0]! - parts[1]! - parts[2]! < 35 || 360 - parts[0]! - parts[1]! - parts[2]! > 150);
          const x = 360 - parts[0]! - parts[1]! - parts[2]!;
          const start = rng.int(0, 60);
          const dirs = [start, start + parts[0]!, start + parts[0]! + parts[1]!, start + parts[0]! + parts[1]! + parts[2]!];
          const sum = parts[0]! + parts[1]! + parts[2]!;
          return valued(
            ["Four rays start at the same point. Find $x$.", "四条射线从同一点出发。求 $x$。"],
            x,
            [
              [
                ["Add the known angles", "把已知角相加"],
                ["The four angles fill the whole turn; the known ones make", "四个角合成一整圈；已知的三个角之和是"],
                [`${parts.join(" + ")} = ${sum}`],
              ],
              [
                ["Subtract from 360°", "用 360° 相减"],
                ["The rest of the turn is $x$:", "一整圈剩下的部分就是 $x$："],
                [`x = 360 - ${sum} = ${x}`],
              ],
            ],
            [`$${parts.join(" + ")} + ${x} = 360$, a whole turn.`, `$${parts.join(" + ")} + ${x} = 360$，正是一整圈。`],
            [
              [sum, "That is the sum of the known angles, not what is left.", "这是已知角的和，不是剩下的部分。"],
              [360 - parts[0]! - parts[1]!, "That leaves out one of the known angles.", "这是漏掉了一个已知角。"],
              [
                90,
                "That shares the turn equally among four angles, but these angles are not equal.",
                "这是把一整圈平均分给四个角，但这些角并不相等。",
              ],
            ],
            {
              figure: fig(
                raysAroundPoint(dirs, [...parts.map(deg), "x°"]),
                `Four rays from one point, making angles of ${parts.join("°, ")}° and x°.`,
                `从一点出发的四条射线，构成 ${parts.join("°、")}° 和 x° 的角。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["solving-problems-with-angles#angles-on-a-line-and-around-a-point"]),
      ),
      lesson(
        "chaining-angle-relationships",
        ["Chaining angle relationships", "连用多个角的关系"],
        [
          [
            "Lines $AB$ and $CD$ cross at $O$, and $\\overrightarrow{OE} \\perp \\overline{AB}$. If $m\\angle COE = 30^\\circ$, then $\\angle AOC$ is the rest of the right angle $\\angle AOE$: $90 - 30 = 60^\\circ$. Its vertical angle $\\angle BOD$ is also $60^\\circ$, and $\\angle AOD$, beside it on line $CD$, is $180 - 60 = 120^\\circ$.",
            "直线 $AB$ 与 $CD$ 相交于 $O$，$\\overrightarrow{OE} \\perp \\overline{AB}$。若 $m\\angle COE = 30^\\circ$，则 $\\angle AOC$ 是直角 $\\angle AOE$ 剩下的部分：$90 - 30 = 60^\\circ$。它的对顶角 $\\angle BOD$ 也是 $60^\\circ$；$\\angle AOD$ 与它在直线 $CD$ 上相邻，是 $180 - 60 = 120^\\circ$。",
          ],
          [
            "$\\angle BOC$ is the right angle $\\angle BOE$ plus $30^\\circ$, which is $120^\\circ$, the vertical angle of $\\angle AOD$.",
            "$\\angle BOC$ 是直角 $\\angle BOE$ 加 $30^\\circ$，得 $120^\\circ$，它是 $\\angle AOD$ 的对顶角。",
          ],
          [
            "Each fact needs the right kind of angle: $\\angle COE$ sits inside a right angle, so it is taken from $90^\\circ$, not $180^\\circ$.",
            "每一步都要用对角的关系：$\\angle COE$ 在直角里面，所以要从 $90^\\circ$ 里减，而不是 $180^\\circ$。",
          ],
        ],
        (rng) => {
          const a = rng.int(12, 78);
          const ask = rng.pick(["AOC", "BOD", "AOD", "BOC"] as const);
          const small = 90 - a;
          const big = 90 + a;
          const answer = ask === "AOC" || ask === "BOD" ? small : big;
          const findAOC: Walk = [
            ["Use the right angle", "用直角"],
            [`$\\angle AOE$ is a right angle, and $\\angle COE$ is part of it:`, `$\\angle AOE$ 是直角，$\\angle COE$ 是它的一部分：`],
            [`${measure("AOC")} = 90 - ${a} = ${degTex(small)}`],
          ];
          const walks: Record<typeof ask, Walk[]> = {
            AOC: [
              [
                ["Find the right angle", "找出直角"],
                [
                  "$\\overrightarrow{OE} \\perp \\overline{AB}$, so $\\angle AOE$ is $90^\\circ$.",
                  "$\\overrightarrow{OE} \\perp \\overline{AB}$，所以 $\\angle AOE$ 是 $90^\\circ$。",
                ],
              ],
              [
                ["Subtract the known part", "减去已知部分"],
                ["$\\angle COE$ is part of it:", "$\\angle COE$ 是它的一部分："],
                [`${measure("AOC")} = 90 - ${a} = ${degTex(small)}`],
              ],
            ],
            BOD: [
              findAOC,
              [
                ["Use vertical angles", "用对顶角"],
                [
                  "$\\angle BOD$ and $\\angle AOC$ are vertical angles, so they are equal:",
                  "$\\angle BOD$ 与 $\\angle AOC$ 是对顶角，所以相等：",
                ],
                [`${measure("BOD")} = ${degTex(small)}`],
              ],
            ],
            AOD: [
              findAOC,
              [
                ["Use the straight line", "用直线"],
                [
                  "$\\angle AOC$ and $\\angle AOD$ fill a straight angle along line $CD$:",
                  "$\\angle AOC$ 与 $\\angle AOD$ 在直线 $CD$ 上合成平角：",
                ],
                [`${measure("AOD")} = 180 - ${small} = ${degTex(big)}`],
              ],
            ],
            BOC: [
              [
                ["Split the angle", "拆开这个角"],
                [
                  "$\\angle BOC$ is the right angle $\\angle BOE$ together with $\\angle EOC$.",
                  "$\\angle BOC$ 由直角 $\\angle BOE$ 和 $\\angle EOC$ 组成。",
                ],
              ],
              [["Add", "相加"], ["Add the two parts:", "把两部分相加："], [`${measure("BOC")} = 90 + ${a} = ${degTex(big)}`]],
            ],
          };
          const checks: Record<typeof ask, Pair> = {
            AOC: [
              `$\\angle AOC$ and $\\angle COE$ fill the right angle: $${small} + ${a} = 90$.`,
              `$\\angle AOC$ 与 $\\angle COE$ 合成直角：$${small} + ${a} = 90$。`,
            ],
            BOD: [
              `$\\angle BOD$ and $\\angle BOC = 90^\\circ + ${a}^\\circ = ${big}^\\circ$ fill line $CD$: $${small} + ${big} = 180$.`,
              `$\\angle BOD$ 与 $\\angle BOC = 90^\\circ + ${a}^\\circ = ${big}^\\circ$ 合成直线 $CD$：$${small} + ${big} = 180$。`,
            ],
            AOD: [
              `$\\angle AOD$ is the vertical angle of $\\angle BOC$, which is the right angle $\\angle BOE$ plus $${a}^\\circ$: $90 + ${a} = ${big}$.`,
              `$\\angle AOD$ 是 $\\angle BOC$ 的对顶角，而 $\\angle BOC$ 是直角 $\\angle BOE$ 加 $${a}^\\circ$：$90 + ${a} = ${big}$。`,
            ],
            BOC: [
              `$\\angle BOC$ and $\\angle AOC = 90^\\circ - ${a}^\\circ = ${small}^\\circ$ fill line $AB$: $${big} + ${small} = 180$.`,
              `$\\angle BOC$ 与 $\\angle AOC = 90^\\circ - ${a}^\\circ = ${small}^\\circ$ 合成直线 $AB$：$${big} + ${small} = 180$。`,
            ],
          };
          return valued(
            [
              `Lines $AB$ and $CD$ cross at $O$, and $${ray("OE")} \\perp \\overline{AB}$. Find $${measure(ask)}$.`,
              `直线 $AB$ 与 $CD$ 相交于 $O$，$${ray("OE")} \\perp \\overline{AB}$。求 $${measure(ask)}$。`,
            ],
            answer,
            walks[ask],
            checks[ask],
            [
              answer === small
                ? [big, "That is the angle on the other side of line $CD$, which is obtuse.", "这是直线 $CD$ 另一侧的角，是钝角。"]
                : [small, "That is the smaller angle at $O$; the angle asked for is obtuse.", "这是 $O$ 处较小的角；所求的角是钝角。"],
              [a, "That is $\\angle COE$, the angle given.", "这是已知的 $\\angle COE$。"],
              [
                180 - a,
                "That takes $\\angle COE$ from $180^\\circ$, but it sits inside the right angle.",
                "这是从 $180^\\circ$ 里减去 $\\angle COE$，但它在直角里面。",
              ],
            ],
            {
              unit: "°",
              figure: fig(
                crossWithPerpendicular(a),
                `Lines AB and CD cross at O. Ray OE is perpendicular to AB, and angle COE is ${a}°.`,
                `直线 AB 与 CD 相交于 O。射线 OE 垂直于 AB，角 COE 为 ${a}°。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["solving-problems-with-angles#chaining-angle-relationships"]),
      ),
    ],
  ),
  [
    "Three slices of a round pizza are cut at $100^\\circ$, $120^\\circ$ and $90^\\circ$. The last slice is what is left of the whole turn: $360 - 310 = 50^\\circ$.",
    "一张圆披萨切成几块，其中三块分别是 $100^\\circ$、$120^\\circ$ 和 $90^\\circ$。最后一块是一整圈剩下的部分：$360 - 310 = 50^\\circ$。",
  ],
  ["$100 + 120 + 90 + 50 = 360$, the whole pizza.", "$100 + 120 + 90 + 50 = 360$，正好是整张披萨。"],
  [
    "find angles on a line and around a point, and chain right angles, supplements and vertical angles to find unknown angles.",
    "学习求直线上和一点周围的角，并把直角、补角和对顶角连起来求未知角。",
  ],
);
// ---------------------------------------------------------------------------
// Polygons

/** lenTex writes a length with its unit, or an area when power is 2: "8\text{ cm}", "24\text{ cm}^2". */
const lenTex = (v: number | string, u: Unit, power = 1) => `${v}${unitLatex(power === 2 ? `${u}^2` : u)}`;

/** footOf is the foot of the perpendicular from p to the line through a and b. */
function footOf(p: Point, a: Point, b: Point): Point {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const k = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  return [a[0] + k * dx, a[1] + k * dy];
}

/** heightOrMedian draws triangle ABC on base BC with the height from A to the foot named foot and the median from A to the midpoint named mid; when the triangle is obtuse, the foot lies on BC extended. */
function heightOrMedian(ax: number, h: number, foot: string, mid: string): Mark[] {
  const B: Point = [0, 0];
  const C: Point = [8, 0];
  const A: Point = [ax, h];
  const D: Point = [ax, 0];
  const M: Point = [4, 0];
  const marks: Mark[] = [
    { kind: "polygon", points: [B, C, A] },
    seg(A, D),
    seg(A, M),
    { kind: "right", vertex: D, from: A, to: M },
    ticks(B, M),
    ticks(C, M),
    ...names([B, C, A], "BCA"),
    { kind: "label", at: D, text: foot, dir: "s", italic: true },
    { kind: "label", at: M, text: mid, dir: "s", italic: true },
  ];
  if (ax < 0) marks.push({ kind: "segment", a: D, b: B, dashed: true });
  if (ax > 8) marks.push({ kind: "segment", a: C, b: D, dashed: true });
  return marks;
}

/** threeHeights draws an acute triangle ABC with its three heights AD, BE and CF. */
function threeHeights(rng: Rng): Mark[] {
  const B: Point = [0, 0];
  const C: Point = [8, 0];
  const A: Point = [rng.pick([3, 3.5, 4.5, 5]), rng.pick([5.5, 6, 6.5])];
  const feet: [Point, Point, Point, Point, string][] = [
    [A, footOf(A, B, C), B, C, "D"],
    [B, footOf(B, C, A), C, A, "E"],
    [C, footOf(C, A, B), A, B, "F"],
  ];
  const center = centroid([A, B, C]);
  return [
    { kind: "polygon", points: [B, C, A] },
    ...feet.flatMap(([p, f, end, , name]): Mark[] => [
      { kind: "segment", a: p, b: f, dashed: true },
      { kind: "right", vertex: f, from: p, to: end },
      { kind: "label", at: f, text: name, dir: awayFrom(f, center), italic: true },
    ]),
    ...names([B, C, A], "BCA"),
  ];
}

/** heightsOfTriangles finds the height of a triangle to a given base, inside or outside the triangle. */
export const heightsOfTriangles = withIntro(
  topic(
    "heights-of-triangles",
    t("Heights of Triangles", "三角形的高"),
    t(
      "A height of a triangle is the perpendicular segment from a vertex to the line containing the opposite side, which is then called the base. Every triangle has three heights, one for each choice of base; in an obtuse triangle two of them fall outside the triangle.",
      "三角形的高是从一个顶点到对边所在直线的垂线段，这条对边叫作底。每个三角形有三条高，每选一条边作底就有一条；钝角三角形有两条高落在三角形外。",
    ),
    ["classifying-triangles", "polygons-in-the-coordinate-plane"],
    ["6.G.A.1", "7.G.A.2"],
    [
      lesson(
        "recognizing-a-height",
        ["Recognizing a height", "认出三角形的高"],
        [
          [
            "The height to base $\\overline{BC}$ starts at the opposite vertex $A$ and meets the line through $B$ and $C$ at a right angle. It is usually not a side, and it usually does not go to the midpoint of $\\overline{BC}$. If the angle at $B$ or $C$ is obtuse, the height falls outside the triangle: extend $\\overline{BC}$ and drop the perpendicular from $A$ to the extension.",
            "底边 $\\overline{BC}$ 上的高从对面的顶点 $A$ 出发，与经过 $B$、$C$ 的直线成直角。它一般不是三角形的边，也一般不经过 $\\overline{BC}$ 的中点。若 $B$ 或 $C$ 处的角是钝角，高落在三角形外：延长 $\\overline{BC}$，从 $A$ 向延长线作垂线。",
          ],
          [
            "The height is the shortest way from $A$ to line $BC$: every other segment from $A$ to that line is slanted and longer.",
            "高是从 $A$ 到直线 $BC$ 最短的路：从 $A$ 到这条直线的其他线段都是斜的，也更长。",
          ],
          [
            "Look for the right-angle mark, not the middle of the base: a segment to the midpoint is a median, not a height.",
            "要找直角标记，而不是底边的中点：连到中点的线段是中线，不是高。",
          ],
        ],
        (rng) => {
          const obtuse = rng.bool();
          const ax = obtuse ? rng.pick([-3, -2, 10, 11]) : rng.pick([1.5, 2, 2.5, 5.5, 6, 6.5]);
          const h = rng.pick([4, 5, 6]);
          const at = ax < 0 ? "B" : "C";
          const [foot, mid] = rng.sample(["D", "E", "H", "M", "N", "P"], 2) as [string, string];
          const where: Pair = obtuse
            ? [
                ` The angle at $${at}$ is obtuse, so $${foot}$ lies outside the triangle, on $${over("BC")}$ extended.`,
                `$${at}$ 处的角是钝角，所以 $${foot}$ 在三角形外，落在 $${over("BC")}$ 的延长线上。`,
              ]
            : ["", ""];
          return chosenMath(
            rng,
            [
              "Which segment is the height of $\\triangle ABC$ to the base $\\overline{BC}$?",
              "哪条线段是 $\\triangle ABC$ 底边 $\\overline{BC}$ 上的高？",
            ],
            over(`A${foot}`),
            [
              [
                over(`A${mid}`),
                `That goes to the midpoint $${mid}$ of the base, but it does not meet line $BC$ at a right angle.`,
                `它连到底边的中点 $${mid}$，但不与直线 $BC$ 成直角。`,
              ],
              [over("AB"), "That is a side of the triangle; it is slanted to line $BC$.", "这是三角形的一条边，它与直线 $BC$ 是斜的。"],
              [over("AC"), "That is a side of the triangle; it is slanted to line $BC$.", "这是三角形的一条边，它与直线 $BC$ 是斜的。"],
            ],
            [
              [
                ["Find the opposite vertex", "找出对面的顶点"],
                [
                  "The base is $\\overline{BC}$, so the height starts at the vertex not on it, $A$.",
                  "底边是 $\\overline{BC}$，所以高从不在它上面的顶点 $A$ 出发。",
                ],
              ],
              [
                ["Find the right angle", "找出直角"],
                [
                  `$${over(`A${foot}`)}$ meets line $BC$ at a right angle at $${foot}$, so it is the height.${where[0]}`,
                  `$${over(`A${foot}`)}$ 在 $${foot}$ 处与直线 $BC$ 成直角，所以它是高。${where[1]}`,
                ],
              ],
            ],
            [
              `$${over(`A${foot}`)}$ is also the shortest of the four segments from $A$ to line $BC$; the others are slanted.`,
              `$${over(`A${foot}`)}$ 也是从 $A$ 到直线 $BC$ 的四条线段中最短的；其他几条都是斜的。`,
            ],
            fig(
              heightOrMedian(ax, h, foot, mid),
              `Triangle ABC on base BC. A${foot} is perpendicular to line BC at ${foot}${obtuse ? ", outside the triangle" : ""}, and A${mid} goes to the midpoint ${mid} of BC.`,
              `底边为 BC 的三角形 ABC。A${foot} 在 ${foot} 处垂直于直线 BC${obtuse ? `，${foot} 在三角形外` : ""}，A${mid} 连到 BC 的中点 ${mid}。`,
            ),
          );
        },
        drawn(gradeDrawings3["heights-of-triangles#recognizing-a-height"]),
      ),
      lesson(
        "heights-for-each-base",
        ["A height for each base", "每条底边上的高"],
        [
          [
            "Any side can be the base, and each base has its own height from the opposite vertex: the height to $\\overline{BC}$ comes from $A$, the height to $\\overline{CA}$ from $B$, and the height to $\\overline{AB}$ from $C$. First find the vertex that is not on the base, then the segment from it that is perpendicular to the base.",
            "任何一条边都可以作底，每条底边都有自己的高，从对面的顶点出发：$\\overline{BC}$ 上的高从 $A$ 出发，$\\overline{CA}$ 上的高从 $B$ 出发，$\\overline{AB}$ 上的高从 $C$ 出发。先找出不在底边上的顶点，再找从它出发、与底边垂直的线段。",
          ],
          [
            "The height ends on the base: its foot is on $\\overline{BC}$ (or its extension) exactly when it starts at $A$.",
            "高的另一端落在底边上：垂足在 $\\overline{BC}$（或它的延长线）上，正好说明它从 $A$ 出发。",
          ],
          [
            "A height never starts at an end of its own base: a segment from $B$ cannot be the height to $\\overline{BC}$.",
            "高不会从自己底边的端点出发：从 $B$ 出发的线段不可能是 $\\overline{BC}$ 上的高。",
          ],
        ],
        (rng) => {
          const [base, apex, answer, foot] = rng.pick([
            ["BC", "A", "AD", "D"],
            ["AC", "B", "BE", "E"],
            ["AB", "C", "CF", "F"],
          ] as const);
          const heights: [string, string, string][] = [
            ["AD", "BC", "A"],
            ["BE", "AC", "B"],
            ["CF", "AB", "C"],
          ];
          const side = `${apex}${base[0]}`;
          return chosenMath(
            rng,
            [
              `$${over("AD")}$, $${over("BE")}$ and $${over("CF")}$ are the heights of $\\triangle ABC$. Which one is the height to the base $${over(base)}$?`,
              `$${over("AD")}$、$${over("BE")}$、$${over("CF")}$ 是 $\\triangle ABC$ 的高。哪一条是底边 $${over(base)}$ 上的高？`,
            ],
            over(answer),
            [
              ...heights
                .filter(([s]) => s !== answer)
                .map(
                  ([s, b, v]): MathWrong => [
                    over(s),
                    `That is the height to $${over(b)}$, from $${v}$.`,
                    `这是从 $${v}$ 出发、$${over(b)}$ 上的高。`,
                  ],
                ),
              [over(side), "That is a side of the triangle, not perpendicular to the base.", "这是三角形的一条边，不与底边垂直。"],
            ],
            [
              [
                ["Find the opposite vertex", "找出对面的顶点"],
                [
                  `$${over(base)}$ joins $${base[0]}$ and $${base[1]}$, so the vertex not on it is $${apex}$.`,
                  `$${over(base)}$ 连接 $${base[0]}$ 和 $${base[1]}$，所以不在它上面的顶点是 $${apex}$。`,
                ],
              ],
              [
                ["Pick its height", "找出它的高"],
                [
                  `The height from $${apex}$ is $${over(answer)}$, perpendicular to $${over(base)}$ at $${foot}$.`,
                  `从 $${apex}$ 出发的高是 $${over(answer)}$，在 $${foot}$ 处与 $${over(base)}$ 垂直。`,
                ],
              ],
            ],
            [
              `The foot $${foot}$ lies on $${over(base)}$, and the other heights end on the other two sides.`,
              `垂足 $${foot}$ 在 $${over(base)}$ 上，另外两条高都落在另外两条边上。`,
            ],
            fig(
              threeHeights(rng),
              "Triangle ABC with heights AD to BC, BE to CA and CF to AB.",
              "三角形 ABC 及其三条高：AD 垂直于 BC，BE 垂直于 CA，CF 垂直于 AB。",
            ),
          );
        },
        drawn(gradeDrawings4["heights-of-triangles#heights-for-each-base"]),
      ),
      lesson(
        "heights-in-the-coordinate-plane",
        ["Heights in the coordinate plane", "坐标平面中的高"],
        [
          [
            "When the base is horizontal, the height is vertical, so its length is the difference of the $y$-coordinates of the opposite vertex and the base. For $A(1, 2)$, $B(7, 2)$ and $C(9, 6)$, the height to $\\overline{AB}$ is $6 - 2 = 4$, even though $C$ is not above $\\overline{AB}$. When the base is vertical, the height is horizontal: use the $x$-coordinates.",
            "底边水平时，高是竖直的，它的长等于对面顶点与底边的 $y$ 坐标之差。对于 $A(1, 2)$、$B(7, 2)$、$C(9, 6)$，$\\overline{AB}$ 上的高是 $6 - 2 = 4$，即使 $C$ 不在 $\\overline{AB}$ 的正上方。底边竖直时，高是水平的：用 $x$ 坐标。",
          ],
          ["Count up from the line $y = 2$: $3, 4, 5, 6$ is $4$ steps.", "从直线 $y = 2$ 往上数：$3, 4, 5, 6$，共 $4$ 格。"],
          [
            "The height is not the length of the base, and not the distance from $A$ to $C$: it is straight across from $C$ to the line of the base.",
            "高不是底边的长，也不是 $A$ 到 $C$ 的距离：它是从 $C$ 笔直地到底边所在直线的距离。",
          ],
        ],
        (rng) => {
          const y0 = rng.int(-6, 4);
          const x1 = rng.int(-8, 0);
          const x2 = x1 + rng.int(3, 9);
          const x3 = rng.bool() ? rng.int(x1 + 1, x2 - 1) : rng.pick([x1 - rng.int(2, 4), x2 + rng.int(2, 4)]);
          const y3 = y0 + rng.pick([-1, 1]) * rng.int(2, 8);
          const h = Math.abs(y3 - y0);
          const vertical = rng.bool();
          // A vertical base swaps the roles of x and y.
          const pt = (x: number, y: number) => pointLatex(vertical ? [y, x] : [x, y]);
          const coord = vertical ? "x" : "y";
          const other = vertical ? "y" : "x";
          const diff = `|${y3} - ${y0 < 0 ? `(${y0})` : y0}|`;
          const lineTex = `${coord} = ${y0}`;
          return valued(
            [
              `$\\triangle ABC$ has vertices $A${pt(x1, y0)}$, $B${pt(x2, y0)}$ and $C${pt(x3, y3)}$. What is the height of the triangle to the base $${over("AB")}$?`,
              `$\\triangle ABC$ 的顶点是 $A${pt(x1, y0)}$、$B${pt(x2, y0)}$、$C${pt(x3, y3)}$。三角形底边 $${over("AB")}$ 上的高是多少？`,
            ],
            h,
            [
              [
                ["See how the base lies", "看底边的方向"],
                [
                  `$A$ and $B$ have the same $${coord}$-coordinate, $${y0}$, so $${over("AB")}$ is ${vertical ? "vertical" : "horizontal"} and the height from $C$ is ${vertical ? "horizontal" : "vertical"}.`,
                  `$A$ 与 $B$ 的 $${coord}$ 坐标相同，都是 $${y0}$，所以 $${over("AB")}$ 是${vertical ? "竖直" : "水平"}的，从 $C$ 出发的高是${vertical ? "水平" : "竖直"}的。`,
                ],
              ],
              [
                ["Subtract the coordinates", "坐标相减"],
                [
                  `The height is the difference of the $${coord}$-coordinates of $C$ and the base:`,
                  `高等于 $C$ 与底边的 $${coord}$ 坐标之差：`,
                ],
                [`${diff} = ${h}`],
              ],
            ],
            [
              `Count from the line $${lineTex}$ to $C$, one unit at a time: it takes $${h}$ steps to reach $${coord} = ${y3}$.`,
              `从直线 $${lineTex}$ 一格一格数到 $C$：要 $${h}$ 格才到 $${coord} = ${y3}$。`,
            ],
            [
              [x2 - x1, "That is the length of the base, not the height.", "这是底边的长，不是高。"],
              [
                Math.abs(x3 - x1),
                `That is how far apart $A$ and $C$ are in $${other}$, along the base, not across to it.`,
                `这是 $A$ 与 $C$ 的 $${other}$ 坐标之差，是沿着底边量的，不是到底边的距离。`,
              ],
              ...(y3 !== 0
                ? [
                    [
                      Math.abs(y3),
                      `That is how far $C$ is from the ${other}-axis, not from the base.`,
                      `这是 $C$ 到 ${other} 轴的距离，不是到底边的距离。`,
                    ] as const,
                  ]
                : []),
            ],
            { form: "integer" },
          );
        },
        drawn(gradeDrawings3["heights-of-triangles#heights-in-the-coordinate-plane"]),
      ),
    ],
  ),
  [
    "A tent stands on flat ground. To find how tall it is, hang a weight on a string from the top of the tent: the string falls straight down and meets the ground at a right angle. That string is a height of the triangle the tent makes.",
    "一顶帐篷立在平地上。想知道它有多高，就从帐篷顶上挂一根系着重物的线：线笔直地垂下，和地面成直角。这根线就是帐篷这个三角形的高。",
  ],
  [
    "Any slanted line from the top to the ground is longer than the string; the straight-down one is the shortest.",
    "从顶上到地面的任何斜线都比这根线长；笔直向下的那条最短。",
  ],
  [
    "find the height of a triangle for any base, inside or outside the triangle, and in the coordinate plane.",
    "学习找出三角形任一底边上的高，无论高在三角形内还是外，也包括在坐标平面中。",
  ],
);
/** rectangleWithDiagonals draws rectangle ABCD, l by w, with diagonals meeting at E. */
function rectangleWithDiagonals(l: number, w: number, extra: readonly Mark[] = []): Mark[] {
  const pts = rectangle(l, w);
  const [A, B, C, D] = [pts[0]!, pts[1]!, pts[2]!, pts[3]!];
  const E: Point = [l / 2, w / 2];
  return [
    { kind: "polygon", points: pts },
    seg(A, C),
    seg(B, D),
    ...pts.map((p, i): Mark => ({ kind: "right", vertex: p, from: pts[(i + 1) % 4]!, to: pts[(i + 3) % 4]! })),
    ...extra,
    ...names(pts, "ABCD"),
    { kind: "label", at: E, text: "E", dir: "e", italic: true },
  ];
}

/** DiagonalCase is a pair of segments on the diagonals of a rectangle and how their lengths compare. */
interface DiagonalCase {
  readonly first: string;
  readonly second: string;
  /** whole is true when first is a whole diagonal and second half of one. */
  readonly whole: boolean;
}

const diagonalCases: readonly DiagonalCase[] = [
  { first: "AE", second: "CE", whole: false },
  { first: "BE", second: "DE", whole: false },
  { first: "AE", second: "DE", whole: false },
  { first: "BE", second: "CE", whole: false },
  { first: "AC", second: "BE", whole: true },
  { first: "BD", second: "AE", whole: true },
];

/** Named is a measure written in LaTeX together with the expression it equals. */
type Named = readonly [name: string, expression: Linear];

/** matched asks for x, or for the first measure, when two expressions name equal measures; it works the equation in labelled steps, checks by putting x back into both, and gives each slip its reason. */
function matched(
  prompt: Pair,
  [n1, e1]: Named,
  [n2, e2]: Named,
  x: number,
  value: number,
  askX: boolean,
  why: Pair,
  options: { unit?: string; angle?: boolean; figure?: Figure } = {},
): Problem {
  const lines = equalSteps(e1, e2);
  const [sign, added] = equalWrong(e1, e2) as [Q, Q];
  const show = (v: number) => (options.angle ? degTex(v) : `${v}`);
  const check: Pair = [
    `At $x = ${x}$: $${n1} = ${subst(e1, x)} = ${value}$ and $${n2} = ${subst(e2, x)} = ${value}$, equal as they should be.`,
    `$x = ${x}$ 时：$${n1} = ${subst(e1, x)} = ${value}$，$${n2} = ${subst(e2, x)} = ${value}$，正好相等。`,
  ];
  const extra = { ...(options.figure && { figure: options.figure }) };
  if (askX)
    return valued(
      prompt,
      x,
      [
        [["Set them equal", "让它们相等"], why, lines.slice(0, 1)],
        [["Solve for x", "解出 x"], collecting(lines.slice(1)), lines.slice(1)],
      ],
      check,
      [
        [sign, "That moves a number across the equals sign without changing its sign.", "移项时没有改变数的符号。"],
        [added, "That adds the $x$ terms instead of taking one from both sides.", "这是把含 $x$ 的项相加了，应在两边同时减去其中一项。"],
        [value, `That is $${n1}$, not $x$.`, `这是 $${n1}$，不是 $x$。`],
      ],
      { ...extra, solveFor: "x" },
    );
  return valued(
    prompt,
    value,
    [
      [["Set them equal and solve", "让它们相等并求解"], why, lines],
      [
        ["Substitute", "代入"],
        [`Put $x = ${x}$ into $${n1}$:`, `把 $x = ${x}$ 代入 $${n1}$：`],
        [`${n1} = ${subst(e1, x)} = ${show(value)}`],
      ],
    ],
    check,
    [
      [x, "That is $x$; put it back into the expression to get the measure.", "这是 $x$；还要把它代回式子才得到所求的量。"],
      [2 * value, "That adds the two equal measures together.", "这是把两个相等的量加在一起了。"],
    ],
    { ...extra, ...(options.unit && { unit: options.unit }) },
  );
}

/** propertiesOfRectanglesAndSquares uses the right angles and the diagonals of rectangles and squares. */
export const propertiesOfRectanglesAndSquares = withIntro(
  topic(
    "properties-of-rectangles-and-squares",
    t("Properties of Rectangles and Squares", "长方形和正方形的性质"),
    t(
      "A rectangle has four right angles, and its diagonals are congruent and bisect each other, so they cut into four equal parts. A square is a rectangle with four equal sides; its diagonals are also perpendicular and split each corner into two 45° angles.",
      "长方形有四个直角，两条对角线相等且互相平分，所以被分成相等的四段。正方形是四条边都相等的长方形；它的对角线还互相垂直，并把每个角分成两个 45° 的角。",
    ),
    ["classifying-quadrilaterals", "angles-of-a-triangle"],
    ["7.G.A.2", "HSG.CO.C.11"],
    [
      lesson(
        "diagonals-of-rectangles",
        ["Diagonals of rectangles", "长方形的对角线"],
        [
          [
            "In rectangle $ABCD$ with diagonals meeting at $E$, the diagonals are the same length and cut each other in half, so $AE = BE = CE = DE$, and a whole diagonal is $2 \\cdot AE$. If $AE = 2x + 3$ and $DE = 4x - 7$, then $2x + 3 = 4x - 7$, so $x = 5$ and $AE = 13$. If $AC = 5x + 2$ and $BE = 2x + 4$, then $5x + 2 = 2(2x + 4)$, so $x = 6$.",
            "在对角线交于 $E$ 的长方形 $ABCD$ 中，两条对角线一样长，并且互相平分，所以 $AE = BE = CE = DE$，整条对角线是 $2 \\cdot AE$。若 $AE = 2x + 3$，$DE = 4x - 7$，则 $2x + 3 = 4x - 7$，$x = 5$，$AE = 13$。若 $AC = 5x + 2$，$BE = 2x + 4$，则 $5x + 2 = 2(2x + 4)$，$x = 6$。",
          ],
          [
            "At $x = 5$: $2(5) + 3 = 13$ and $4(5) - 7 = 13$. At $x = 6$: $AC = 32$ and $BE = 16$, half of it.",
            "$x = 5$ 时：$2(5) + 3 = 13$，$4(5) - 7 = 13$。$x = 6$ 时：$AC = 32$，$BE = 16$，正好是它的一半。",
          ],
          [
            "A whole diagonal such as $AC$ is twice a piece such as $BE$; only the four pieces are equal to each other.",
            "像 $AC$ 这样的整条对角线是像 $BE$ 这样一段的两倍；只有四小段彼此相等。",
          ],
        ],
        (rng) => {
          const c = rng.pick(diagonalCases);
          const x = rng.int(2, 12);
          const half = rng.int(5, 30);
          const u = pickUnit(rng);
          const askX = rng.bool();
          const figure = fig(
            rectangleWithDiagonals(8, 5),
            "Rectangle ABCD with diagonals AC and BD meeting at E.",
            "长方形 ABCD 的对角线 AC 与 BD 交于 E。",
          );
          if (!c.whole) {
            const e1 = expressionFor(rng, half, x);
            const e2 = expressionFor(rng, half, x, [e1[0]]);
            return matched(
              [
                `In rectangle $ABCD$, the diagonals meet at $E$, $${c.first} = ${linear(...e1)}$ and $${c.second} = ${linear(...e2)}$. ${askX ? "Find $x$." : `Find $${c.first}$.`}`,
                `长方形 $ABCD$ 的对角线交于 $E$，$${c.first} = ${linear(...e1)}$，$${c.second} = ${linear(...e2)}$。${askX ? "求 $x$。" : `求 $${c.first}$。`}`,
              ],
              [c.first, e1],
              [c.second, e2],
              x,
              half,
              askX,
              [
                "The diagonals of a rectangle are equal and cut each other in half, so all four pieces are equal:",
                "长方形的对角线相等且互相平分，所以四小段都相等：",
              ],
              { unit: u, figure },
            );
          }
          const eh = expressionFor(rng, half, x);
          const ew = expressionFor(rng, 2 * half, x, [2 * eh[0]]);
          const doubled: Linear = [2 * eh[0], 2 * eh[1]];
          const lines = [`${linear(...ew)} = 2(${linear(...eh)}) = ${linear(...doubled)}`, ...equalSteps(ew, doubled).slice(1)];
          const prompt: Pair = [
            `In rectangle $ABCD$, the diagonals meet at $E$, $${c.first} = ${linear(...ew)}$ and $${c.second} = ${linear(...eh)}$. ${askX ? "Find $x$." : `Find $${c.first}$.`}`,
            `长方形 $ABCD$ 的对角线交于 $E$，$${c.first} = ${linear(...ew)}$，$${c.second} = ${linear(...eh)}$。${askX ? "求 $x$。" : `求 $${c.first}$。`}`,
          ];
          const why: Pair = [
            `The diagonals are equal and cut each other in half, so $${c.second}$ is half a diagonal and $${c.first} = 2 \\cdot ${c.second}$:`,
            `对角线相等且互相平分，所以 $${c.second}$ 是对角线的一半，$${c.first} = 2 \\cdot ${c.second}$：`,
          ];
          const check: Pair = [
            `At $x = ${x}$: $${c.second} = ${subst(eh, x)} = ${half}$ and $${c.first} = ${subst(ew, x)} = ${2 * half}$, twice as long.`,
            `$x = ${x}$ 时：$${c.second} = ${subst(eh, x)} = ${half}$，$${c.first} = ${subst(ew, x)} = ${2 * half}$，正好是两倍。`,
          ];
          if (askX)
            return valued(
              prompt,
              x,
              [
                [["Double the piece", "把一段乘 2"], why, lines.slice(0, 1)],
                [["Solve for x", "解出 x"], collecting(lines.slice(1)), lines.slice(1)],
              ],
              check,
              [
                ...(ew[0] !== eh[0]
                  ? [
                      [
                        Q.of(eh[1] - ew[1], ew[0] - eh[0]),
                        `That sets $${c.first}$ equal to $${c.second}$, but a whole diagonal is twice a piece.`,
                        `这是让 $${c.first}$ 等于 $${c.second}$，但整条对角线是一段的两倍。`,
                      ] as const,
                    ]
                  : []),
                [
                  Q.of(2 * eh[1] - ew[1], ew[0] - 2 * eh[0]).neg(),
                  "That moves a number across the equals sign without changing its sign.",
                  "移项时没有改变数的符号。",
                ],
                [half, `That is $${c.second}$, not $x$.`, `这是 $${c.second}$，不是 $x$。`],
              ],
              { figure, solveFor: "x" },
            );
          return valued(
            prompt,
            2 * half,
            [
              [["Double the piece and solve", "把一段乘 2 并求解"], why, lines],
              [
                ["Substitute", "代入"],
                [`Put $x = ${x}$ into $${c.first}$:`, `把 $x = ${x}$ 代入 $${c.first}$：`],
                [`${c.first} = ${subst(ew, x)} = ${2 * half}`],
              ],
            ],
            check,
            [
              [half, `That is $${c.second}$, half of a diagonal.`, `这是 $${c.second}$，对角线的一半。`],
              [4 * half, "That doubles the whole diagonal again.", "这是把整条对角线又乘了 $2$。"],
              [x, "That is $x$; put it back into the expression to get the length.", "这是 $x$；还要把它代回式子才得到长度。"],
            ],
            { unit: u, figure },
          );
        },
        drawn(gradeDrawings3["properties-of-rectangles-and-squares#diagonals-of-rectangles"]),
      ),
      lesson(
        "angles-in-rectangles",
        ["Angles in rectangles", "长方形中的角"],
        [
          [
            "Each corner of a rectangle is $90^\\circ$, and a diagonal cuts the rectangle into two right triangles. If diagonal $\\overline{AC}$ makes $m\\angle BAC = 35^\\circ$, then $m\\angle CAD = 90 - 35 = 55^\\circ$, the rest of the corner at $A$; $m\\angle BCA = 180 - 90 - 35 = 55^\\circ$, from the angles of $\\triangle ABC$; and $m\\angle ACD = 90 - 55 = 35^\\circ$, the rest of the corner at $C$.",
            "长方形的每个角都是 $90^\\circ$，一条对角线把它分成两个直角三角形。若对角线 $\\overline{AC}$ 使 $m\\angle BAC = 35^\\circ$，则 $m\\angle CAD = 90 - 35 = 55^\\circ$，是 $A$ 处直角剩下的部分；$m\\angle BCA = 180 - 90 - 35 = 55^\\circ$，由 $\\triangle ABC$ 的内角和得出；$m\\angle ACD = 90 - 55 = 35^\\circ$，是 $C$ 处直角剩下的部分。",
          ],
          ["In $\\triangle ACD$: $90 + 55 + 35 = 180$.", "在 $\\triangle ACD$ 中：$90 + 55 + 35 = 180$。"],
          [
            "A corner of the rectangle is $90^\\circ$, not $180^\\circ$: take the known part from $90$.",
            "长方形的一个角是 $90^\\circ$，不是 $180^\\circ$：要从 $90$ 里减去已知部分。",
          ],
        ],
        (rng) => {
          let a: number;
          do a = rng.int(25, 65);
          while (a === 45);
          const ask = rng.pick(["CAD", "BCA", "ACD"] as const);
          const rest = 90 - a;
          const answer = ask === "ACD" ? a : rest;
          const l = 8;
          const w = l * Math.tan(rad(a));
          const A: Point = [0, 0];
          const B: Point = [l, 0];
          const C: Point = [l, w];
          const triangle: Walk = [
            ["Use triangle ABC", "用三角形 ABC"],
            [
              `$\\angle B$ is a right angle, and the angles of $\\triangle ABC$ add up to $180^\\circ$:`,
              `$\\angle B$ 是直角，$\\triangle ABC$ 的内角和是 $180^\\circ$：`,
            ],
            [`${measure("BCA")} = 180 - 90 - ${a} = ${degTex(rest)}`],
          ];
          const walks: Record<typeof ask, Walk[]> = {
            CAD: [
              [
                ["Find the corner", "找出直角"],
                [
                  "The corner at $A$ is $90^\\circ$, and diagonal $\\overline{AC}$ splits it into $\\angle BAC$ and $\\angle CAD$.",
                  "$A$ 处是 $90^\\circ$ 的直角，对角线 $\\overline{AC}$ 把它分成 $\\angle BAC$ 和 $\\angle CAD$。",
                ],
              ],
              [
                ["Subtract", "相减"],
                ["Take the known part from the corner:", "从直角中减去已知部分："],
                [`${measure("CAD")} = 90 - ${a} = ${degTex(rest)}`],
              ],
            ],
            BCA: [
              [
                ["Find the right triangle", "找出直角三角形"],
                [
                  "Diagonal $\\overline{AC}$ makes $\\triangle ABC$, with a right angle at $B$.",
                  "对角线 $\\overline{AC}$ 构成 $\\triangle ABC$，$B$ 处是直角。",
                ],
              ],
              triangle,
            ],
            ACD: [
              triangle,
              [
                ["Use the corner at C", "用 C 处的直角"],
                ["The corner at $C$ is $90^\\circ$:", "$C$ 处是 $90^\\circ$："],
                [`${measure("ACD")} = 90 - ${rest} = ${degTex(a)}`],
              ],
            ],
          };
          const checks: Record<typeof ask, Pair> = {
            CAD: [
              `In $\\triangle ACD$, $\\angle D = 90^\\circ$ and $${measure("ACD")} = 90 - ${measure("BCA")} = 90 - ${rest} = ${a}$, so $${measure("CAD")} = 180 - 90 - ${a} = ${rest}$.`,
              `在 $\\triangle ACD$ 中，$\\angle D = 90^\\circ$，$${measure("ACD")} = 90 - ${measure("BCA")} = 90 - ${rest} = ${a}$，所以 $${measure("CAD")} = 180 - 90 - ${a} = ${rest}$。`,
            ],
            BCA: [
              `The corner at $A$ gives $${measure("CAD")} = 90 - ${a} = ${rest}$, and in $\\triangle ACD$ the corner at $C$ keeps $180 - 90 - ${rest} = ${a}$ for $\\angle ACD$, leaving $90 - ${a} = ${rest}$ for $\\angle BCA$.`,
              `$A$ 处的直角给出 $${measure("CAD")} = 90 - ${a} = ${rest}$；在 $\\triangle ACD$ 中 $\\angle ACD = 180 - 90 - ${rest} = ${a}$，所以 $C$ 处剩下的 $\\angle BCA = 90 - ${a} = ${rest}$。`,
            ],
            ACD: [
              `The corner at $A$ gives $${measure("CAD")} = 90 - ${a} = ${rest}$, and in $\\triangle ACD$: $${measure("ACD")} = 180 - 90 - ${rest} = ${a}$.`,
              `$A$ 处的直角给出 $${measure("CAD")} = 90 - ${a} = ${rest}$；在 $\\triangle ACD$ 中：$${measure("ACD")} = 180 - 90 - ${rest} = ${a}$。`,
            ],
          };
          const pts = rectangle(l, w);
          return valued(
            [`$ABCD$ is a rectangle. Find $${measure(ask)}$.`, `$ABCD$ 是长方形。求 $${measure(ask)}$。`],
            answer,
            walks[ask],
            checks[ask],
            [
              [answer === a ? rest : a, "That is the other sharp angle of the right triangle.", "这是直角三角形中另一个锐角。"],
              [
                180 - a,
                `That takes $${a}^\\circ$ from $180^\\circ$, but a corner of the rectangle is $90^\\circ$.`,
                `这是从 $180^\\circ$ 里减去 $${a}^\\circ$，但长方形的一个角是 $90^\\circ$。`,
              ],
              [a + 90, "That adds the right angle instead of taking the known angle away.", "这是加上了直角，应该减去已知的角。"],
            ],
            {
              unit: "°",
              figure: fig(
                [
                  { kind: "polygon", points: pts },
                  seg(A, C),
                  // Right-angle marks only at B and D, clear of the diagonal and the labeled angle at A.
                  { kind: "right", vertex: B, from: C, to: A },
                  { kind: "right", vertex: pts[3]!, from: A, to: C },
                  arc(A, B, C, deg(a)),
                  ...names(pts, "ABCD"),
                ],
                `Rectangle ABCD with diagonal AC. Angle BAC is ${a}°.`,
                `长方形 ABCD 及对角线 AC。角 BAC 为 ${a}°。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["properties-of-rectangles-and-squares#angles-in-rectangles"]),
      ),
      lesson(
        "diagonals-of-squares",
        ["Diagonals of squares", "正方形的对角线"],
        [
          [
            "In square $ABCD$ with diagonals meeting at $E$, the four pieces $AE$, $BE$, $CE$ and $DE$ are equal, as in any rectangle. The diagonals also cross at a right angle, so $m\\angle AEB = 90^\\circ$, and each diagonal cuts a corner in half, so $m\\angle BAC = 45^\\circ$. If $m\\angle ABD = (3x + 6)^\\circ$, then $3x + 6 = 45$ and $x = 13$.",
            "在对角线交于 $E$ 的正方形 $ABCD$ 中，和所有长方形一样，$AE$、$BE$、$CE$、$DE$ 四段相等。两条对角线还互相垂直，所以 $m\\angle AEB = 90^\\circ$；每条对角线把一个角平分，所以 $m\\angle BAC = 45^\\circ$。若 $m\\angle ABD = (3x + 6)^\\circ$，则 $3x + 6 = 45$，$x = 13$。",
          ],
          [
            "At $x = 13$: $3 \\cdot 13 + 6 = 45$, half of the $90^\\circ$ corner.",
            "$x = 13$ 时：$3 \\cdot 13 + 6 = 45$，正好是 $90^\\circ$ 直角的一半。",
          ],
          [
            "An angle at a corner, such as $\\angle ABD$, is $45^\\circ$; an angle at the center $E$, such as $\\angle AEB$, is $90^\\circ$.",
            "角的顶点在正方形的角上（如 $\\angle ABD$）是 $45^\\circ$；顶点在中心 $E$（如 $\\angle AEB$）是 $90^\\circ$。",
          ],
        ],
        (rng) => {
          const x = rng.int(3, 14);
          const figure = fig(
            rectangleWithDiagonals(6, 6),
            "Square ABCD with diagonals AC and BD meeting at E.",
            "正方形 ABCD 的对角线 AC 与 BD 交于 E。",
          );
          const kind = rng.pick(["corner", "center", "lengths"] as const);
          if (kind === "lengths") {
            const half = rng.int(4, 25);
            const [p, q] = rng.pick([
              ["AE", "BE"],
              ["CE", "DE"],
              ["AE", "DE"],
            ] as const);
            const e1 = expressionFor(rng, half, x);
            const e2 = expressionFor(rng, half, x, [e1[0]]);
            return matched(
              [
                `In square $ABCD$, the diagonals meet at $E$, $${p} = ${linear(...e1)}$ and $${q} = ${linear(...e2)}$. Find $x$.`,
                `正方形 $ABCD$ 的对角线交于 $E$，$${p} = ${linear(...e1)}$，$${q} = ${linear(...e2)}$。求 $x$。`,
              ],
              [p, e1],
              [q, e2],
              x,
              half,
              true,
              [
                `The diagonals of a square are equal and cut each other in half, so $${p} = ${q}$:`,
                `正方形的对角线相等且互相平分，所以 $${p} = ${q}$：`,
              ],
              { figure },
            );
          }
          const total = kind === "corner" ? 45 : 90;
          const name = kind === "corner" ? rng.pick(["BAC", "ABD", "CDB", "DCA"]) : rng.pick(["AEB", "BEC", "CED", "AED"]);
          const e = expressionFor(rng, total, x);
          const why: Pair =
            kind === "corner"
              ? [
                  `Each diagonal of a square cuts a $90^\\circ$ corner in half, so $${measure(name)} = 45^\\circ$:`,
                  `正方形的每条对角线把 $90^\\circ$ 的角平分，所以 $${measure(name)} = 45^\\circ$：`,
                ]
              : [
                  `The diagonals of a square cross at a right angle, so $${measure(name)} = 90^\\circ$:`,
                  `正方形的两条对角线互相垂直，所以 $${measure(name)} = 90^\\circ$：`,
                ];
          const solve =
            e[0] === 1 ? [`x = ${total} - ${e[1] < 0 ? `(${e[1]})` : e[1]} = ${x}`] : [`${linear(e[0], 0)} = ${total - e[1]}`, `x = ${x}`];
          return valued(
            [
              `In square $ABCD$, the diagonals meet at $E$ and $${measure(name)} = ${angleTex(...e)}$. Find $x$.`,
              `正方形 $ABCD$ 的对角线交于 $E$，$${measure(name)} = ${angleTex(...e)}$。求 $x$。`,
            ],
            x,
            [
              [["Name the angle", "确定这个角"], why, [`${linear(...e)} = ${total}`]],
              [
                ["Solve for x", "解出 x"],
                [
                  e[0] === 1 ? "Undo the added number:" : "Undo the added number, then divide:",
                  e[0] === 1 ? "消去加上的数：" : "先消去加上的数，再相除：",
                ],
                solve,
              ],
            ],
            [`At $x = ${x}$: $${subst(e, x)} = ${total}$.`, `$x = ${x}$ 时：$${subst(e, x)} = ${total}$。`],
            [
              [
                Q.of(135 - total - e[1], e[0]),
                kind === "corner"
                  ? "That uses $90^\\circ$, the whole corner, but the diagonal takes half of it."
                  : "That uses $45^\\circ$, half a corner, but the diagonals meet at a right angle.",
                kind === "corner"
                  ? "这是用了整个角 $90^\\circ$，但对角线只取它的一半。"
                  : "这是用了半个角 $45^\\circ$，但两条对角线成直角。",
              ],
              [
                Q.of(total + e[1], e[0]),
                "That moves the number across the equals sign without changing its sign.",
                "移项时没有改变数的符号。",
              ],
            ],
            { figure, solveFor: "x" },
          );
        },
        drawn(gradeDrawings3["properties-of-rectangles-and-squares#diagonals-of-squares"]),
      ),
    ],
  ),
  [
    "A door is a rectangle. Stretch two strings from corner to corner: they are the same length, and they cross exactly at the middle of each string.",
    "门是一个长方形。从对角拉两根绳子：它们一样长，而且正好在各自的中点交叉。",
  ],
  [
    "Measure from each corner to the crossing: all four pieces match, each half a string.",
    "从每个角量到交叉点：四段一样长，每段都是一根绳子的一半。",
  ],
  [
    "use the right angles and the equal, halving diagonals of rectangles and squares to find lengths, angles and $x$.",
    "学习利用长方形和正方形的直角，以及相等且互相平分的对角线，求长度、角和 $x$。",
  ],
);
/** trapezoidPoints is trapezoid ABCD with AB ∥ DC, bottom base l, height h and the top corners set in by o1 at D and o2 at C. */
const trapezoidPoints = (l: number, h: number, o1: number, o2: number): Point[] => [
  [0, 0],
  [l, 0],
  [l - o2, h],
  [o1, h],
];

/** parallelMarks marks the bases AB and DC of a trapezoid as parallel, and the legs as congruent when isosceles. */
function parallelMarks(pts: readonly Point[], isosceles: boolean): Mark[] {
  const [A, B, C, D] = [pts[0]!, pts[1]!, pts[2]!, pts[3]!];
  return [
    { kind: "arrows", a: A, b: B, count: 1 },
    { kind: "arrows", a: D, b: C, count: 1 },
    ...(isosceles ? [ticks(A, D), ticks(B, C)] : []),
  ];
}

/** propertiesOfTrapezoids uses the parallel bases of a trapezoid, the symmetry of an isosceles trapezoid and the midsegment. */
export const propertiesOfTrapezoids = withIntro(
  topic(
    "properties-of-trapezoids",
    t("Properties of Trapezoids", "梯形的性质"),
    t(
      "The two angles along each leg of a trapezoid add up to 180°, because the bases are parallel. An isosceles trapezoid has congruent legs, congruent base angles and congruent diagonals. The midsegment, which joins the midpoints of the legs, is the average of the bases.",
      "梯形的底互相平行，所以每条腰上的两个角之和为 180°。等腰梯形的两腰相等，同一底上的两个底角相等，两条对角线也相等。连接两腰中点的中位线等于两底的平均数。",
    ),
    ["classifying-quadrilaterals", "supplementary-angles", "equations-with-variables-on-both-sides"],
    ["7.G.A.2", "HSG.CO.C.11"],
    [
      lesson(
        "angles-of-trapezoids",
        ["Angles of trapezoids", "梯形的角"],
        [
          [
            "In trapezoid $ABCD$ with $\\overline{AB} \\parallel \\overline{DC}$, the two angles at the ends of a leg add up to $180^\\circ$: $m\\angle A + m\\angle D = 180^\\circ$ and $m\\angle B + m\\angle C = 180^\\circ$. In an isosceles trapezoid, the two angles on the same base are also equal. So if $m\\angle A = 70^\\circ$, then $m\\angle B = 70^\\circ$ and $m\\angle C = m\\angle D = 180 - 70 = 110^\\circ$.",
            "在 $\\overline{AB} \\parallel \\overline{DC}$ 的梯形 $ABCD$ 中，一条腰两端的两个角之和是 $180^\\circ$：$m\\angle A + m\\angle D = 180^\\circ$，$m\\angle B + m\\angle C = 180^\\circ$。在等腰梯形中，同一底上的两个角还相等。所以若 $m\\angle A = 70^\\circ$，则 $m\\angle B = 70^\\circ$，$m\\angle C = m\\angle D = 180 - 70 = 110^\\circ$。",
          ],
          [
            "The four angles of a quadrilateral add up to $360^\\circ$: $70 + 70 + 110 + 110 = 360$.",
            "四边形的四个角之和是 $360^\\circ$：$70 + 70 + 110 + 110 = 360$。",
          ],
          [
            "Angles along a leg add up to $180^\\circ$; only angles on the same base of an isosceles trapezoid are equal.",
            "同一条腰上的两个角之和是 $180^\\circ$；只有等腰梯形同一底上的两个角才相等。",
          ],
        ],
        (rng) => {
          const isosceles = rng.bool();
          const a = rng.int(48, 80);
          const b = isosceles ? a : rng.int(48, 80);
          const h = 5;
          const pts = trapezoidPoints(14, h, h / Math.tan(rad(a)), h / Math.tan(rad(b)));
          const [A, B, C, D] = [pts[0]!, pts[1]!, pts[2]!, pts[3]!];
          const fromB = !isosceles && rng.bool();
          const ask = isosceles ? rng.pick(["B", "C", "D"] as const) : fromB ? "C" : "D";
          const from = fromB ? "B" : "A";
          const given = fromB ? b : a;
          const answer = ask === "B" ? a : 180 - given;
          const head: Pair = isosceles
            ? [
                `$ABCD$ is an isosceles trapezoid with $${over("AB")} \\parallel ${over("DC")}$ and $AD = BC$.`,
                `$ABCD$ 是等腰梯形，$${over("AB")} \\parallel ${over("DC")}$，$AD = BC$。`,
              ]
            : [
                `$ABCD$ is a trapezoid with $${over("AB")} \\parallel ${over("DC")}$.`,
                `$ABCD$ 是梯形，$${over("AB")} \\parallel ${over("DC")}$。`,
              ];
          const along = (p: string, q: string, leg: string, v: number): Walk => [
            ["Use the leg", "用腰"],
            [
              `$\\angle ${p}$ and $\\angle ${q}$ are at the two ends of leg $${over(leg)}$, between the parallel bases, so they add up to $180^\\circ$:`,
              `$\\angle ${p}$ 与 $\\angle ${q}$ 在腰 $${over(leg)}$ 的两端、两条平行的底之间，所以和为 $180^\\circ$：`,
            ],
            [`m\\angle ${q} = 180 - ${v} = ${degTex(180 - v)}`],
          ];
          const same: Walk = [
            ["Use the equal base angles", "用相等的底角"],
            ["In an isosceles trapezoid the two angles on the same base are equal:", "等腰梯形同一底上的两个角相等："],
            [`m\\angle B = m\\angle A = ${degTex(a)}`],
          ];
          const walks: Record<"B" | "C" | "D", Walk[]> = {
            B: [
              [
                ["Find the base", "找出底"],
                [
                  "$\\angle A$ and $\\angle B$ both sit on base $\\overline{AB}$.",
                  "$\\angle A$ 与 $\\angle B$ 都在底 $\\overline{AB}$ 上。",
                ],
              ],
              same,
            ],
            C: isosceles
              ? [same, along("B", "C", "BC", a)]
              : [
                  [
                    ["Find the leg", "找出腰"],
                    [`$\\angle B$ and $\\angle C$ share leg $${over("BC")}$.`, `$\\angle B$ 与 $\\angle C$ 共用腰 $${over("BC")}$。`],
                  ],
                  along("B", "C", "BC", b),
                ],
            D: [
              [
                ["Find the leg", "找出腰"],
                [`$\\angle A$ and $\\angle D$ share leg $${over("AD")}$.`, `$\\angle A$ 与 $\\angle D$ 共用腰 $${over("AD")}$。`],
              ],
              along("A", "D", "AD", a),
            ],
          };
          const check: Pair = isosceles
            ? [
                `The four angles add up to $360^\\circ$: $${a} + ${a} + ${180 - a} + ${180 - a} = 360$.`,
                `四个角之和是 $360^\\circ$：$${a} + ${a} + ${180 - a} + ${180 - a} = 360$。`,
              ]
            : [
                `Add the two angles along the leg back together: $${given} + ${answer} = 180$, so they fill the space between the parallel bases.`,
                `把这条腰上的两个角加回去：$${given} + ${answer} = 180$，正好填满两条平行底之间。`,
              ];
          return valued(
            [
              `${head[0]} If $m\\angle ${from} = ${degTex(given)}$, find $m\\angle ${ask}$.`,
              `${head[1]}若 $m\\angle ${from} = ${degTex(given)}$，求 $m\\angle ${ask}$。`,
            ],
            answer,
            walks[ask],
            check,
            ask === "B"
              ? [
                  [
                    180 - a,
                    "That treats $\\angle A$ and $\\angle B$ as adding to $180^\\circ$, but they sit on the same base, so they are equal.",
                    "这是把 $\\angle A$ 与 $\\angle B$ 当成和为 $180^\\circ$，但它们在同一底上，所以相等。",
                  ],
                  [
                    90 - a,
                    "That takes the angle from $90^\\circ$; the angles on a base are equal.",
                    "这是从 $90^\\circ$ 里减；同一底上的两个角相等。",
                  ],
                ]
              : [
                  [
                    given,
                    `That makes $\\angle ${ask}$ equal to $\\angle ${from}$, but angles along a leg add up to $180^\\circ$.`,
                    `这是让 $\\angle ${ask}$ 等于 $\\angle ${from}$，但同一条腰上的两个角之和是 $180^\\circ$。`,
                  ],
                  [
                    90 - given,
                    "That takes the angle from $90^\\circ$ instead of $180^\\circ$.",
                    "这是从 $90^\\circ$ 里减，应该从 $180^\\circ$ 里减。",
                  ],
                  [
                    360 - given,
                    "That takes the angle from $360^\\circ$, the total of all four angles.",
                    "这是从 $360^\\circ$ 里减，那是四个角的总和。",
                  ],
                ],
            {
              unit: "°",
              figure: fig(
                [
                  { kind: "polygon", points: pts },
                  ...parallelMarks(pts, isosceles),
                  fromB ? arc(B, C, A, deg(b)) : arc(A, B, D, deg(a)),
                  ...names(pts, "ABCD"),
                ],
                `${isosceles ? "Isosceles trapezoid" : "Trapezoid"} ABCD with AB parallel to DC. Angle ${from} is ${given}°.`,
                `${isosceles ? "等腰梯形" : "梯形"} ABCD，AB 平行于 DC。角 ${from} 为 ${given}°。`,
              ),
            },
          );
        },
        drawn(gradeDrawings4["properties-of-trapezoids#angles-of-trapezoids"]),
      ),
      lesson(
        "isosceles-trapezoids-with-algebra",
        ["Isosceles trapezoids with algebra", "用方程解等腰梯形问题"],
        [
          [
            "In an isosceles trapezoid $ABCD$ with bases $\\overline{AB}$ and $\\overline{DC}$, the legs are equal, $AD = BC$, and so are the diagonals, $AC = BD$. If $AC = 3x - 4$ and $BD = x + 10$, then $3x - 4 = x + 10$, so $2x = 14$, $x = 7$, and each diagonal is $17$.",
            "在底为 $\\overline{AB}$ 和 $\\overline{DC}$ 的等腰梯形 $ABCD$ 中，两腰相等，$AD = BC$；两条对角线也相等，$AC = BD$。若 $AC = 3x - 4$，$BD = x + 10$，则 $3x - 4 = x + 10$，$2x = 14$，$x = 7$，每条对角线长 $17$。",
          ],
          ["At $x = 7$: $3 \\cdot 7 - 4 = 17$ and $7 + 10 = 17$.", "$x = 7$ 时：$3 \\cdot 7 - 4 = 17$，$7 + 10 = 17$。"],
          [
            "The bases of a trapezoid are not equal; only the legs and the diagonals of an isosceles trapezoid are.",
            "梯形的两底不相等；只有等腰梯形的两腰、两条对角线才相等。",
          ],
        ],
        (rng) => {
          const x = rng.int(2, 12);
          const v = rng.int(6, 30);
          const legs = rng.bool();
          const [p, q] = legs ? (["AD", "BC"] as const) : (["AC", "BD"] as const);
          const e1 = expressionFor(rng, v, x);
          const e2 = expressionFor(rng, v, x, [e1[0]]);
          const askX = rng.bool();
          const u = pickUnit(rng);
          const pts = trapezoidPoints(12, 5, 3, 3);
          return matched(
            [
              `$ABCD$ is an isosceles trapezoid with bases $${over("AB")}$ and $${over("DC")}$, $${p} = ${linear(...e1)}$ and $${q} = ${linear(...e2)}$. ${askX ? "Find $x$." : `Find $${p}$.`}`,
              `$ABCD$ 是等腰梯形，底为 $${over("AB")}$ 和 $${over("DC")}$，$${p} = ${linear(...e1)}$，$${q} = ${linear(...e2)}$。${askX ? "求 $x$。" : `求 $${p}$。`}`,
            ],
            [p, e1],
            [q, e2],
            x,
            v,
            askX,
            legs
              ? [`An isosceles trapezoid has equal legs, so $${p} = ${q}$:`, `等腰梯形的两腰相等，所以 $${p} = ${q}$：`]
              : [`An isosceles trapezoid has equal diagonals, so $${p} = ${q}$:`, `等腰梯形的两条对角线相等，所以 $${p} = ${q}$：`],
            {
              unit: u,
              figure: fig(
                [
                  { kind: "polygon", points: pts },
                  ...parallelMarks(pts, true),
                  ...(legs ? [] : [seg(pts[0]!, pts[2]!), seg(pts[1]!, pts[3]!)]),
                  ...names(pts, "ABCD"),
                ],
                `Isosceles trapezoid ABCD with AB parallel to DC${legs ? "" : " and diagonals AC and BD"}.`,
                `等腰梯形 ABCD，AB 平行于 DC${legs ? "" : "，画出了对角线 AC 和 BD"}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["properties-of-trapezoids#isosceles-trapezoids-with-algebra"]),
      ),
      lesson(
        "the-midsegment-of-a-trapezoid",
        ["The midsegment of a trapezoid", "梯形的中位线"],
        [
          [
            "The **midsegment** of a trapezoid joins the midpoints of its legs. It is parallel to the bases, and its length is their average: $m = \\frac{b_1 + b_2}{2}$. With bases $10$ and $16$, the midsegment is $\\frac{10 + 16}{2} = 13$. With one base $10$ and midsegment $13$, the bases add up to $2 \\cdot 13 = 26$, so the other base is $26 - 10 = 16$.",
            "梯形的**中位线**连接两腰的中点。它平行于两底，长度是两底的平均数：$m = \\frac{b_1 + b_2}{2}$。两底为 $10$ 和 $16$ 时，中位线是 $\\frac{10 + 16}{2} = 13$。一底为 $10$、中位线为 $13$ 时，两底之和是 $2 \\cdot 13 = 26$，所以另一底是 $26 - 10 = 16$。",
          ],
          [
            "The midsegment is halfway between the bases in length: $13 - 10 = 3$ and $16 - 13 = 3$.",
            "中位线的长度正好在两底中间：$13 - 10 = 3$，$16 - 13 = 3$。",
          ],
          [
            "To find a base, double the midsegment before subtracting: $13 - 10 = 3$ is not the other base.",
            "求底时，要先把中位线乘 $2$ 再减：$13 - 10 = 3$ 不是另一底。",
          ],
        ],
        (rng) => {
          let long: number;
          let short: number;
          do {
            long = rng.int(10, 40);
            short = rng.int(4, long - 2);
          } while ((long + short) % 2 !== 0);
          const m = (long + short) / 2;
          const u = pickUnit(rng);
          const ask = rng.pick(["mid", "short", "long"] as const);
          const scale = 12 / long;
          const o = (long - short) * scale * rng.pick([0.3, 0.5, 0.7]);
          const pts = trapezoidPoints(long * scale, 5, o, (long - short) * scale - o);
          const [A, B, C, D] = [pts[0]!, pts[1]!, pts[2]!, pts[3]!];
          const P = lerp(A, D, 0.5);
          const R = lerp(B, C, 0.5);
          const shown = (k: typeof ask, v: number) => (ask === k ? "?" : `${v} ${u}`);
          const answer = ask === "mid" ? m : ask === "short" ? short : long;
          const known = ask === "short" ? long : short;
          const target = ask === "mid" ? "PR" : ask === "short" ? "DC" : "AB";
          const gap = (long - short) / 2;
          const figure = fig(
            [
              { kind: "polygon", points: pts },
              ...parallelMarks(pts, false),
              seg(P, R, true),
              ticks(A, P),
              ticks(P, D),
              ticks(B, R, 2),
              ticks(R, C, 2),
              { kind: "side", a: A, b: B, text: shown("long", long) },
              { kind: "side", a: C, b: D, text: shown("short", short) },
              { kind: "label", at: lerp(P, R, 0.5), text: shown("mid", m), dir: "n" },
              ...names(pts, "ABCD"),
              { kind: "label", at: P, text: "P", dir: "w", italic: true },
              { kind: "label", at: R, text: "R", dir: "e", italic: true },
            ],
            `Trapezoid ABCD with bases AB = ${shown("long", long)} and DC = ${shown("short", short)}, and midsegment PR = ${shown("mid", m)}.`,
            `梯形 ABCD，底 AB = ${shown("long", long)}，DC = ${shown("short", short)}，中位线 PR = ${shown("mid", m)}。`,
          );
          const prompt: Pair = [
            `$${over("PR")}$ is the midsegment of trapezoid $ABCD$. Find $${target}$.`,
            `$${over("PR")}$ 是梯形 $ABCD$ 的中位线。求 $${target}$。`,
          ];
          if (ask === "mid")
            return valued(
              prompt,
              m,
              [
                [
                  ["Add the bases", "把两底相加"],
                  ["The midsegment is the average of the bases; first add them:", "中位线是两底的平均数；先把两底相加："],
                  [`${long} + ${short} = ${long + short}`],
                ],
                [["Halve", "取一半"], ["Divide the sum by $2$:", "把和除以 $2$："], [`PR = ${long + short} \\div 2 = ${lenTex(m, u)}`]],
              ],
              [
                `$PR$ is the same amount from each base: $${m} - ${short} = ${gap}$ and $${long} - ${m} = ${gap}$.`,
                `$PR$ 与两底相差一样多：$${m} - ${short} = ${gap}$，$${long} - ${m} = ${gap}$。`,
              ],
              [
                [long + short, "That adds the bases but does not halve the sum.", "这是把两底相加了，但没有除以 $2$。"],
                [gap, "That halves the difference of the bases, not their sum.", "这是把两底的差取一半，应该是把和取一半。"],
                [long - short, "That subtracts the bases instead of averaging them.", "这是把两底相减了，应该求平均数。"],
              ],
              { unit: u, figure },
            );
          return valued(
            prompt,
            answer,
            [
              [
                ["Double the midsegment", "把中位线乘 2"],
                [
                  "The midsegment is the average of the bases, so the bases add up to twice the midsegment:",
                  "中位线是两底的平均数，所以两底之和是中位线的两倍：",
                ],
                [`2 \\cdot ${m} = ${2 * m}`],
              ],
              [
                ["Subtract the known base", "减去已知的底"],
                ["Take away the base you know:", "减去已知的底："],
                [`${target} = ${2 * m} - ${known} = ${lenTex(answer, u)}`],
              ],
            ],
            [
              `Average the bases: $\\frac{${known} + ${answer}}{2} = \\frac{${known + answer}}{2} = ${m}$, the midsegment.`,
              `求两底的平均数：$\\frac{${known} + ${answer}}{2} = \\frac{${known + answer}}{2} = ${m}$，正是中位线。`,
            ],
            [
              [
                Math.abs(m - known),
                "That subtracts the base from the midsegment without doubling the midsegment first.",
                "这是没有先把中位线乘 $2$，就直接和底相减了。",
              ],
              ...((m + known) % 2 === 0
                ? [[(m + known) / 2, "That averages the midsegment with the known base.", "这是求了中位线与已知底的平均数。"] as const]
                : []),
              [2 * m, "That is the sum of both bases, not the missing one.", "这是两底之和，不是所求的底。"],
            ],
            { unit: u, figure },
          );
        },
        drawn(gradeDrawings3["properties-of-trapezoids#the-midsegment-of-a-trapezoid"]),
      ),
    ],
  ),
  [
    "A bucket seen from the side is a trapezoid: the rim at the top and the bottom are the parallel bases, and the two slanting sides are the legs.",
    "从侧面看，水桶是一个梯形：桶口和桶底是互相平行的两底，两条斜斜的侧边是腰。",
  ],
  [
    "Halfway up, the bucket is as wide as the average of the rim and the bottom: with $30$ cm and $20$ cm, it is $25$ cm, $5$ cm from each.",
    "在一半高的地方，水桶的宽是桶口和桶底的平均数：$30$ 厘米和 $20$ 厘米时，是 $25$ 厘米，与两者都相差 $5$ 厘米。",
  ],
  [
    "use the parallel bases of a trapezoid, the equal parts of an isosceles trapezoid, and the midsegment to find angles and lengths.",
    "学习利用梯形平行的两底、等腰梯形相等的部分以及中位线求角和长度。",
  ],
);
/** Congruence is a congruence statement between two polygons, with the vertices of the second in corresponding order. */
interface Congruence {
  readonly first: string;
  readonly second: string;
}

/** congruence draws a congruence statement: the first polygon's letters in order, and the second's in an order that matches them up. */
function congruence(rng: Rng, sides: 3 | 4): Congruence {
  const first = sides === 3 ? rng.pick(["ABC", "JKL", "PQR"]) : rng.pick(["ABCD", "JKLM"]);
  const letters = sides === 3 ? rng.pick(["DEF", "XYZ", "STU"]) : rng.pick(["PQRS", "WXYZ"]);
  // Any order of a triangle's vertices names it; a quadrilateral's must go around it, forward or backward.
  const orders =
    sides === 3
      ? [
          [1, 2, 0],
          [2, 0, 1],
          [0, 2, 1],
          [2, 1, 0],
          [1, 0, 2],
        ]
      : [
          [1, 2, 3, 0],
          [2, 3, 0, 1],
          [3, 0, 1, 2],
          [0, 3, 2, 1],
          [2, 1, 0, 3],
        ];
  const order = rng.pick(orders);
  return { first, second: order.map((i) => letters[i]!).join("") };
}

/** polygonName writes a polygon by its vertices: "\triangle ABC" or "ABCD". */
const polygonName = (v: string) => (v.length === 3 ? `\\triangle ${v}` : v);

/** statement writes a congruence statement in both languages. */
function statement(c: Congruence): Text {
  if (c.first.length === 3) return mathText(`${polygonName(c.first)} \\cong ${polygonName(c.second)}`);
  return t(`Quadrilateral $${c.first} \\cong$ quadrilateral $${c.second}$`, `四边形 $${c.first} \\cong$ 四边形 $${c.second}$`);
}

/** corresponding is the part of the second polygon that matches part of the first, named by its letters. */
const corresponding = (c: Congruence, part: string) => [...part].map((ch) => c.second[c.first.indexOf(ch)]!).join("");

/** placed moves the points of a triangle by a turn of turn degrees, an optional flip and a shift so it sits to the right of x = left. */
function placed(pts: readonly Point[], turn: number, flip: boolean, left: number): Point[] {
  const turned = pts.map(([x, y]): Point => {
    const [fx, fy] = flip ? [-x, y] : [x, y];
    return [fx * Math.cos(rad(turn)) - fy * Math.sin(rad(turn)), fx * Math.sin(rad(turn)) + fy * Math.cos(rad(turn))];
  });
  const minX = Math.min(...turned.map((p) => p[0]));
  const minY = Math.min(...turned.map((p) => p[1]));
  return turned.map(([x, y]): Point => [x - minX + left, y - minY]);
}

/** angleAt is the angle of a triangle at p, in degrees, between the directions to q and r. */
function angleAt(p: Point, q: Point, r: Point): number {
  const a = Math.atan2(q[1] - p[1], q[0] - p[0]);
  const b = Math.atan2(r[1] - p[1], r[0] - p[0]);
  const d = Math.abs(((a - b) * 180) / Math.PI) % 360;
  return d > 180 ? 360 - d : d;
}

/** backward is the part of the first polygon that matches part of the second, named by its letters. */
const backward = (c: Congruence, part: string) => [...part].map((ch) => c.first[c.second.indexOf(ch)]!).join("");

/** congruentPolygons reads corresponding parts from a congruence statement and uses them to find measures. */
export const congruentPolygons = withIntro(
  topic(
    "congruent-polygons",
    t("Congruent Polygons", "全等的多边形"),
    t(
      "Congruent polygons have the same size and shape: one can be moved onto the other. A congruence statement lists corresponding vertices in the same order, so corresponding sides and angles can be read from it, and corresponding parts have equal measures.",
      "全等的多边形大小和形状都相同：一个可以移动到与另一个重合。全等式按对应顺序写出顶点，所以从中可以读出对应的边和角，对应部分的度量相等。",
    ),
    ["polygons", "congruent-segments", "congruent-angles"],
    ["8.G.A.2", "HSG.CO.B.7"],
    [
      lesson(
        "corresponding-parts",
        ["Corresponding parts", "对应部分"],
        [
          [
            "In $\\triangle ABC \\cong \\triangle RPQ$, the vertices are matched by position: $A \\leftrightarrow R$, $B \\leftrightarrow P$ and $C \\leftrightarrow Q$. So $\\overline{BC}$ corresponds to $\\overline{PQ}$, and $\\angle B \\cong \\angle P$.",
            "在 $\\triangle ABC \\cong \\triangle RPQ$ 中，顶点按位置对应：$A \\leftrightarrow R$，$B \\leftrightarrow P$，$C \\leftrightarrow Q$。所以 $\\overline{BC}$ 对应 $\\overline{PQ}$，$\\angle B \\cong \\angle P$。",
          ],
          [
            "Read it backwards: $P$ and $Q$ are 2nd and 3rd in $RPQ$, and so are $B$ and $C$ in $ABC$.",
            "倒过来读：$P$、$Q$ 是 $RPQ$ 的第 2、3 个字母，$B$、$C$ 也是 $ABC$ 的第 2、3 个字母。",
          ],
          [
            "The letters of the second name are not in alphabetical order: match each letter by its place in the statement, not by the alphabet.",
            "第二个名称的字母不按字母表顺序排列：要按它们在全等式中的位置配对，而不是按字母表。",
          ],
        ],
        (rng) => {
          const n = rng.pick([3, 3, 4] as const);
          const c = congruence(rng, n);
          const st = statement(c);
          const ord = (k: number): Pair => [["1st", "2nd", "3rd", "4th"][k]!, `第 ${k + 1} 个`];
          if (rng.bool()) {
            const i = rng.int(0, n - 1);
            const j = (i + 1) % n;
            const side = `${c.first[i]}${c.first[j]}`;
            const answer = corresponding(c, side);
            const others = [...Array(n).keys()]
              .map((k) => `${c.second[k]}${c.second[(k + 1) % n]}`)
              .filter((s) => s !== answer && s !== [...answer].reverse().join(""));
            return chosenMath(
              rng,
              [`${st.en}. Which segment corresponds to $${over(side)}$?`, `${st["zh-CN"]}。哪条线段与 $${over(side)}$ 对应？`],
              over(answer),
              rng
                .shuffle(others)
                .slice(0, 3)
                .map(
                  (s): MathWrong => [
                    over(s),
                    `That segment corresponds to $${over(backward(c, s))}$.`,
                    `这条线段对应的是 $${over(backward(c, s))}$。`,
                  ],
                ),
              [
                [
                  ["Match the first letter", "配对第一个字母"],
                  [
                    `$${side[0]}$ is ${ord(i)[0]} in $${c.first}$, and the ${ord(i)[0]} letter of $${c.second}$ is $${answer[0]}$.`,
                    `$${side[0]}$ 是 $${c.first}$ 的${ord(i)[1]}字母，$${c.second}$ 的${ord(i)[1]}字母是 $${answer[0]}$。`,
                  ],
                ],
                [
                  ["Match the second letter", "配对第二个字母"],
                  [
                    `$${side[1]}$ is ${ord(j)[0]}, and the ${ord(j)[0]} letter of $${c.second}$ is $${answer[1]}$. So $${over(side)}$ corresponds to $${over(answer)}$.`,
                    `$${side[1]}$ 是${ord(j)[1]}字母，$${c.second}$ 的${ord(j)[1]}字母是 $${answer[1]}$。所以 $${over(side)}$ 对应 $${over(answer)}$。`,
                  ],
                ],
              ],
              [
                `Read it backwards: in $${c.second}$, $${answer[0]}$ and $${answer[1]}$ are matched with $${side[0]}$ and $${side[1]}$ of $${c.first}$.`,
                `倒过来读：$${c.second}$ 中的 $${answer[0]}$、$${answer[1]}$ 正好对应 $${c.first}$ 中的 $${side[0]}$、$${side[1]}$。`,
              ],
            );
          }
          const i = rng.int(0, n - 1);
          const v = c.first[i]!;
          const answer = c.second[i]!;
          return chosenMath(
            rng,
            [`${st.en}. Which angle is congruent to $\\angle ${v}$?`, `${st["zh-CN"]}。哪个角与 $\\angle ${v}$ 全等？`],
            `\\angle ${answer}`,
            [...c.second]
              .filter((ch) => ch !== answer)
              .slice(0, 3)
              .map(
                (ch): MathWrong => [
                  `\\angle ${ch}`,
                  `$\\angle ${ch}$ corresponds to $\\angle ${backward(c, ch)}$.`,
                  `$\\angle ${ch}$ 对应的是 $\\angle ${backward(c, ch)}$。`,
                ],
              ),
            [
              [
                ["Find the place", "找出位置"],
                [`$${v}$ is the ${ord(i)[0]} letter of $${c.first}$.`, `$${v}$ 是 $${c.first}$ 的${ord(i)[1]}字母。`],
              ],
              [
                ["Read the partner", "读出对应的字母"],
                [
                  `The ${ord(i)[0]} letter of $${c.second}$ is $${answer}$, and corresponding angles are congruent: $\\angle ${v} \\cong \\angle ${answer}$.`,
                  `$${c.second}$ 的${ord(i)[1]}字母是 $${answer}$，对应角全等：$\\angle ${v} \\cong \\angle ${answer}$。`,
                ],
              ],
            ],
            [
              `Read it backwards: $${answer}$ in $${c.second}$ sits where $${v}$ sits in $${c.first}$.`,
              `倒过来读：$${answer}$ 在 $${c.second}$ 中的位置，正是 $${v}$ 在 $${c.first}$ 中的位置。`,
            ],
          );
        },
        drawn(gradeDrawings4["congruent-polygons#corresponding-parts"]),
      ),
      lesson(
        "measures-of-congruent-triangles",
        ["Measures of congruent triangles", "全等三角形的度量"],
        [
          [
            "Corresponding parts of congruent figures have equal measures. If $\\triangle ABC \\cong \\triangle FDE$ and $BC = 9$, then $DE = 9$, because $B \\leftrightarrow D$ and $C \\leftrightarrow E$. To find an angle that is not given, first find the third angle of the triangle you know, then carry it across: if $m\\angle A = 50^\\circ$ and $m\\angle B = 60^\\circ$, then $m\\angle C = 70^\\circ$, so $m\\angle E = 70^\\circ$.",
            "全等图形的对应部分度量相等。若 $\\triangle ABC \\cong \\triangle FDE$，$BC = 9$，则 $DE = 9$，因为 $B \\leftrightarrow D$，$C \\leftrightarrow E$。要求没有给出的角，先求已知三角形的第三个角，再对应过去：若 $m\\angle A = 50^\\circ$，$m\\angle B = 60^\\circ$，则 $m\\angle C = 70^\\circ$，所以 $m\\angle E = 70^\\circ$。",
          ],
          [
            "Work inside $\\triangle FDE$ instead: $\\angle F = 50^\\circ$ and $\\angle D = 60^\\circ$ copy across, so $\\angle E = 180 - 50 - 60 = 70^\\circ$.",
            "也可以在 $\\triangle FDE$ 里算：$\\angle F = 50^\\circ$，$\\angle D = 60^\\circ$ 对应过来，所以 $\\angle E = 180 - 50 - 60 = 70^\\circ$。",
          ],
          [
            "The second triangle may be turned or flipped: match parts through the statement, not by where they sit in the picture.",
            "第二个三角形可能被旋转或翻折过：要按全等式配对，而不是看它们在图中的位置。",
          ],
        ],
        (rng) => {
          const c = congruence(rng, 3);
          const [pts, [c0, a0, b0]] = scaleneTriangle(rng);
          // scaleneTriangle lists the sides from the bottom, counterclockwise: first-second, second-third, third-first.
          const lengths = [c0!, a0!, b0!];
          const second = placed(pts, rng.pick([90, 150, 200, 250, 300]), rng.bool(), Math.max(...pts.map((p) => p[0])) + 4);
          const u = pickUnit(rng);
          const marksFirst: Mark[] = [{ kind: "polygon", points: pts }, ...names(pts, c.first)];
          const marksSecond: Mark[] = [{ kind: "polygon", points: second }, ...names(second, c.second)];
          const firstSide = (k: number) => `${c.first[k]}${c.first[(k + 1) % 3]}`;
          const prompt = (what: string): Pair => [
            `$${polygonName(c.first)} \\cong ${polygonName(c.second)}$. Find $${what}$.`,
            `$${polygonName(c.first)} \\cong ${polygonName(c.second)}$。求 $${what}$。`,
          ];
          if (rng.bool()) {
            const i = rng.int(0, 2);
            const mine = firstSide(i);
            const side = corresponding(c, mine);
            const answer = lengths[i]!;
            return valued(
              prompt(side),
              answer,
              [
                [
                  ["Match the vertices", "配对顶点"],
                  [
                    `In the statement, $${side[0]}$ is matched with $${mine[0]}$ and $${side[1]}$ with $${mine[1]}$, so $${over(side)}$ corresponds to $${over(mine)}$.`,
                    `全等式中，$${side[0]}$ 对应 $${mine[0]}$，$${side[1]}$ 对应 $${mine[1]}$，所以 $${over(side)}$ 对应 $${over(mine)}$。`,
                  ],
                ],
                [
                  ["Copy the length", "照搬长度"],
                  ["Corresponding sides are equal:", "对应边相等："],
                  [`${side} = ${mine} = ${lenTex(answer, u)}`],
                ],
              ],
              [
                `By position: $${over(mine)}$ uses places ${i + 1} and ${((i + 1) % 3) + 1} of $${c.first}$, and places ${i + 1} and ${((i + 1) % 3) + 1} of $${c.second}$ are $${side[0]}$ and $${side[1]}$.`,
                `按位置看：$${over(mine)}$ 用的是 $${c.first}$ 的第 ${i + 1}、${((i + 1) % 3) + 1} 个字母，$${c.second}$ 的第 ${i + 1}、${((i + 1) % 3) + 1} 个字母正是 $${side[0]}$、$${side[1]}$。`,
              ],
              [0, 1, 2]
                .filter((k) => k !== i)
                .map(
                  (k) =>
                    [
                      lengths[k]!,
                      `That is $${over(firstSide(k))}$, which matches $${over(corresponding(c, firstSide(k)))}$, not $${over(side)}$.`,
                      `这是 $${over(firstSide(k))}$，它对应的是 $${over(corresponding(c, firstSide(k)))}$，不是 $${over(side)}$。`,
                    ] as const,
                ),
              {
                unit: u,
                figure: fig(
                  [
                    ...marksFirst,
                    ...sides(
                      pts,
                      lengths.map((l) => `${l} ${u}`),
                    ),
                    ...marksSecond,
                  ],
                  `Triangle ${c.first} with sides ${c.first.slice(0, 2)} = ${lengths[0]}, ${c.first.slice(1)} = ${lengths[1]} and ${c.first[2]}${c.first[0]} = ${lengths[2]} ${u}, and triangle ${c.second} drawn in another position.`,
                  `三角形 ${c.first} 的边 ${c.first.slice(0, 2)} = ${lengths[0]}，${c.first.slice(1)} = ${lengths[1]}，${c.first[2]}${c.first[0]} = ${lengths[2]} ${u}；另有位置不同的三角形 ${c.second}。`,
                ),
              },
            );
          }
          const angles = [angleAt(pts[0]!, pts[1]!, pts[2]!), angleAt(pts[1]!, pts[2]!, pts[0]!)].map(Math.round);
          const [g0, g1] = [angles[0]!, angles[1]!];
          const third = 180 - g0 - g1;
          const all = [g0, g1, third];
          const target = rng.int(0, 2);
          const value = all[target]!;
          const name = c.second[target]!;
          const partner = c.first[target]!;
          const match: Walk = [
            ["Find the partner", "找出对应的角"],
            [
              `$${name}$ is matched with $${partner}$ in the statement, so $\\angle ${name} \\cong \\angle ${partner}$.`,
              `全等式中 $${name}$ 对应 $${partner}$，所以 $\\angle ${name} \\cong \\angle ${partner}$。`,
            ],
          ];
          const walk: Walk[] =
            target < 2
              ? [
                  match,
                  [
                    ["Copy the angle", "照搬角的度数"],
                    ["Corresponding angles are equal:", "对应角相等："],
                    [`m\\angle ${name} = m\\angle ${partner} = ${degTex(value)}`],
                  ],
                ]
              : [
                  match,
                  [
                    ["Find the third angle", "求第三个角"],
                    [
                      `$m\\angle ${partner}$ is not given; the angles of $${polygonName(c.first)}$ add up to $180^\\circ$:`,
                      `$m\\angle ${partner}$ 没有给出；$${polygonName(c.first)}$ 的内角和是 $180^\\circ$：`,
                    ],
                    [`m\\angle ${name} = m\\angle ${partner} = 180 - ${g0} - ${g1} = ${degTex(third)}`],
                  ],
                ];
          const [o1, o2] = [0, 1, 2].filter((k) => k !== target) as [number, number];
          const check: Pair = [
            `Work inside $${polygonName(c.second)}$: $\\angle ${c.second[o1]}$ and $\\angle ${c.second[o2]}$ copy $${all[o1]}^\\circ$ and $${all[o2]}^\\circ$ across, so $m\\angle ${name} = 180 - ${all[o1]} - ${all[o2]} = ${value}$.`,
            `在 $${polygonName(c.second)}$ 里算：$\\angle ${c.second[o1]}$ 和 $\\angle ${c.second[o2]}$ 分别是 $${all[o1]}^\\circ$ 和 $${all[o2]}^\\circ$，所以 $m\\angle ${name} = 180 - ${all[o1]} - ${all[o2]} = ${value}$。`,
          ];
          return valued(
            prompt(`m\\angle ${name}`),
            value,
            walk,
            check,
            [
              ...[o1, o2].map(
                (k) =>
                  [
                    all[k]!,
                    `That is the angle at $${c.first[k]}$, which matches $\\angle ${c.second[k]}$.`,
                    `这是 $${c.first[k]}$ 处的角，它对应的是 $\\angle ${c.second[k]}$。`,
                  ] as const,
              ),
              [180 - value, "That is the supplement of the angle, not the angle itself.", "这是这个角的补角，不是这个角。"],
            ],
            {
              unit: "°",
              figure: fig(
                [...marksFirst, arc(pts[0]!, pts[1]!, pts[2]!, deg(g0)), arc(pts[1]!, pts[2]!, pts[0]!, deg(g1)), ...marksSecond],
                `Triangle ${c.first} with angle ${c.first[0]} = ${g0}° and angle ${c.first[1]} = ${g1}°, and triangle ${c.second} drawn in another position.`,
                `三角形 ${c.first} 中角 ${c.first[0]} = ${g0}°，角 ${c.first[1]} = ${g1}°；另有位置不同的三角形 ${c.second}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings4["congruent-polygons#measures-of-congruent-triangles"]),
      ),
      lesson(
        "congruent-polygons-with-algebra",
        ["Congruent polygons with algebra", "用方程解全等多边形问题"],
        [
          [
            "When corresponding parts are given as expressions, set them equal. If $\\triangle ABC \\cong \\triangle DEF$, $AB = 2x + 5$ and $DE = 4x - 3$, then $\\overline{AB}$ corresponds to $\\overline{DE}$, so $2x + 5 = 4x - 3$, $8 = 2x$ and $x = 4$.",
            "对应部分用式子表示时，令它们相等。若 $\\triangle ABC \\cong \\triangle DEF$，$AB = 2x + 5$，$DE = 4x - 3$，则 $\\overline{AB}$ 与 $\\overline{DE}$ 对应，所以 $2x + 5 = 4x - 3$，$8 = 2x$，$x = 4$。",
          ],
          ["At $x = 4$: $2 \\cdot 4 + 5 = 13$ and $4 \\cdot 4 - 3 = 13$.", "$x = 4$ 时：$2 \\cdot 4 + 5 = 13$，$4 \\cdot 4 - 3 = 13$。"],
          [
            "Set equal only parts that correspond: $\\overline{AB}$ matches $\\overline{DE}$, not $\\overline{EF}$.",
            "只有对应的部分才能列等式：$\\overline{AB}$ 对应 $\\overline{DE}$，而不是 $\\overline{EF}$。",
          ],
        ],
        (rng) => {
          const n = rng.pick([3, 4] as const);
          const c = congruence(rng, n);
          const x = rng.int(2, 12);
          const angle = rng.bool();
          const v = angle ? rng.int(35, 130) : rng.int(6, 30);
          const e1 = expressionFor(rng, v, x);
          const e2 = expressionFor(rng, v, x, [e1[0]]);
          const i = rng.int(0, n - 1);
          const [p, q] = angle
            ? [`m\\angle ${c.first[i]}`, `m\\angle ${c.second[i]}`]
            : [`${c.first[i]}${c.first[(i + 1) % n]}`, corresponding(c, `${c.first[i]}${c.first[(i + 1) % n]}`)];
          const show = (e: Linear) => (angle ? angleTex(...e) : linear(...e));
          const st = statement(c);
          return matched(
            [
              `${st.en}, $${p} = ${show(e1)}$ and $${q} = ${show(e2)}$. Find $x$.`,
              `${st["zh-CN"]}，$${p} = ${show(e1)}$，$${q} = ${show(e2)}$。求 $x$。`,
            ],
            [p, e1],
            [q, e2],
            x,
            v,
            true,
            angle
              ? [
                  `$\\angle ${c.first[i]}$ and $\\angle ${c.second[i]}$ sit in the same place in the statement, so they are corresponding angles and are equal:`,
                  `$\\angle ${c.first[i]}$ 与 $\\angle ${c.second[i]}$ 在全等式中位置相同，是对应角，所以相等：`,
                ]
              : [
                  `$${over(p)}$ and $${over(q)}$ sit in the same places in the statement, so they are corresponding sides and are equal:`,
                  `$${over(p)}$ 与 $${over(q)}$ 在全等式中位置相同，是对应边，所以相等：`,
                ],
            { angle },
          );
        },
        drawn(gradeDrawings4["congruent-polygons#congruent-polygons-with-algebra"]),
      ),
    ],
  ),
  [
    "Two cookies cut with the same cutter are congruent: lay one on top of the other, even upside down, and every edge and corner lines up with its partner.",
    "用同一个模具压出的两块饼干是全等的：把一块叠在另一块上，即使翻过来，每条边、每个角都和对应的那个对齐。",
  ],
  [
    "Measure any edge of one cookie and the matching edge of the other: the lengths are the same.",
    "量一块饼干的任意一条边，再量另一块上对应的边：长度一样。",
  ],
  [
    "read corresponding sides and angles from a congruence statement, and use their equal measures to find lengths, angles and $x$.",
    "学习从全等式中读出对应的边和角，并利用它们度量相等求长度、角和 $x$。",
  ],
);
// END OF TOPICS

/** grade7GeometryTopics lists the 7th grade topics on segments, angles, polygons, scale drawings, circles and prisms. */
export const grade7GeometryTopics: readonly TopicDef[] = [
  measuresOfSegments,
  congruentSegments,
  midpoints,
  collinearPoints,
  theSegmentAdditionPostulate,
  segmentBisectorsAndThePerpendicularBisectorTheorem,
  congruentAngles,
  complementaryAngles,
  supplementaryAngles,
  angleBisectors,
  solvingProblemsWithAngles,
  heightsOfTriangles,
  propertiesOfRectanglesAndSquares,
  propertiesOfTrapezoids,
  congruentPolygons,
];
