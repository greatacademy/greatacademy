import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, dec, linear, type Mark, type Point, Q, sketch } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";

import { choiceProblem, numberProblem, pointLatex, steps, unitLatex, verdictChoice, yesNo } from "../problems.ts";
import { rectangle, scaleneTriangle, sides } from "./area.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

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

export const measuresOfSegments = topic(
  "measures-of-segments",
  t("Measures of Segments", "线段的长度"),
  t(
    "The measure of a segment is its length, the distance between its endpoints; the length of segment AB is written AB, without the bar. On a ruler or a number line, subtract the coordinates of the endpoints: a segment from the 2 cm mark to the 7.5 cm mark is 7.5 − 2 = 5.5 cm long, and points at −4 and 3 are 3 − (−4) = 7 units apart.",
    "线段的长度就是两个端点之间的距离；线段 AB 的长度记作 AB，不加横线。在尺子或数轴上，用两个端点的读数相减：从 2 厘米刻度到 7.5 厘米刻度的线段长 7.5 − 2 = 5.5 厘米，位于 −4 和 3 的两点相距 3 − (−4) = 7 个单位。",
  ),
  ["points-lines-rays-and-segments", "absolute-value"],
  ["7.G.A.1"],
  [
    {
      id: "lengths-on-a-ruler",
      title: t("Measuring with a ruler", "用尺子量长度"),
      explanation: t(
        "A segment that does not start at the $0$ mark of a ruler is measured by subtracting the two readings. If $\\overline{PQ}$ runs from the $3$ cm mark to the $8.5$ cm mark, then $PQ = 8.5 - 3 = 5.5$ cm. The short marks between the numbers are half centimeters, so each one counts $0.5$ cm, not $1$ cm.",
        "线段的起点不在尺子的 $0$ 刻度时，用两端的读数相减。若 $\\overline{PQ}$ 从 $3$ 厘米刻度到 $8.5$ 厘米刻度，则 $PQ = 8.5 - 3 = 5.5$ 厘米。数字之间的短刻度是半厘米，每一格是 $0.5$ 厘米，而不是 $1$ 厘米。",
      ),
      generate(rng) {
        const n = rng.int(8, 12);
        const a2 = rng.int(1, 2 * n - 5);
        const b2 = rng.int(a2 + 3, 2 * n);
        const [a, b] = [Q.of(a2, 2), Q.of(b2, 2)];
        const len = b.sub(a);
        const [p, q] = rng.pick(segmentNames);
        const [x0, x1] = [a.toNumber(), b.toNumber()];
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
        return {
          ...numberProblem({
            prompt: t(
              `The ruler is marked in centimeters. How long is $${over(p + q)}$?`,
              `尺子的刻度以厘米为单位。$${over(p + q)}$ 有多长？`,
            ),
            answer: len,
            form: "decimal",
            unit: "cm",
            wrong: [b, a.add(b), len.mul(Q.of(2))],
            solution: t(
              `$${over(p + q)}$ starts at the $${dec(a)}$ cm mark, not at $0$, so subtract the readings:${steps(`${p}${q} = ${dec(b)} - ${dec(a)} = ${dec(len)}\\text{ cm}`)}`,
              `$${over(p + q)}$ 的起点在 $${dec(a)}$ 厘米刻度，而不是 $0$，所以用两端的读数相减：${steps(`${p}${q} = ${dec(b)} - ${dec(a)} = ${dec(len)}\\text{ cm}`)}`,
            ),
          }),
          figure: fig(
            marks,
            `A ruler from 0 to ${n} cm, marked every half centimeter. Segment ${p}${q} runs from the ${dec(a)} cm mark to the ${dec(b)} cm mark.`,
            `一把 0 到 ${n} 厘米的尺子，每半厘米一个刻度。线段 ${p}${q} 从 ${dec(a)} 厘米刻度到 ${dec(b)} 厘米刻度。`,
          ),
        };
      },
    },
    {
      id: "lengths-on-a-number-line",
      figure: gradeDrawings3["measures-of-segments#lengths-on-a-number-line"],
      title: t("Lengths on a number line", "数轴上的长度"),
      explanation: t(
        "On a number line, the length of a segment is the larger coordinate minus the smaller one. For $A$ at $-6$ and $B$ at $2$, $AB = 2 - (-6) = 8$. Counting the units from $-6$ to $0$ and from $0$ to $2$ gives the same $6 + 2 = 8$; subtracting $6 - 2 = 4$ would be wrong.",
        "在数轴上，线段的长度等于较大的坐标减去较小的坐标。$A$ 在 $-6$，$B$ 在 $2$，则 $AB = 2 - (-6) = 8$。从 $-6$ 数到 $0$ 再数到 $2$，也得到 $6 + 2 = 8$；算成 $6 - 2 = 4$ 就错了。",
      ),
      generate(rng) {
        const a = rng.int(-10, 8);
        const b = rng.int(a + 2, 10);
        const [p, q] = rng.pick(segmentNames);
        const len = b - a;
        const sub = a < 0 ? `${b} - (${a})` : `${b} - ${a}`;
        return {
          ...numberProblem({
            prompt: t(`Find $${p}${q}$.`, `求 $${p}${q}$。`),
            answer: len,
            form: "integer",
            wrong: [Math.abs(Math.abs(b) - Math.abs(a)), a + b, len + 1],
            solution: t(
              `$${p}$ is at $${a}$ and $${q}$ is at $${b}$. Subtract the smaller coordinate from the larger:${steps(`${p}${q} = ${sub} = ${len}`)}`,
              `$${p}$ 在 $${a}$，$${q}$ 在 $${b}$。用较大的坐标减去较小的坐标：${steps(`${p}${q} = ${sub} = ${len}`)}`,
            ),
          }),
          figure: fig(
            numberLine(-10, 10, [
              [a, p],
              [b, q],
            ]),
            `A number line from −10 to 10 with ${p} at ${minus(a)} and ${q} at ${minus(b)}.`,
            `一条从 −10 到 10 的数轴，${p} 在 ${minus(a)}，${q} 在 ${minus(b)}。`,
          ),
        };
      },
    },
  ],
);

/** pairName names the segment between the points at indices i < j of the letters. */
const pairName = (letters: string, i: number, j: number) => `${letters[Math.min(i, j)]}${letters[Math.max(i, j)]}`;

/** twoSegments draws two segments marked congruent: AB horizontal and CD slanted, with labels. */
function twoSegments(rng: Rng, labelAB: string, labelCD: string, count = 1): Mark[] {
  const a: Point = [0, 0];
  const b: Point = [8, 0];
  const turn = rng.pick([25, 35, 145, 155]);
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

export const congruentSegments = topic(
  "congruent-segments",
  t("Congruent Segments", "全等线段"),
  t(
    "Segments with the same length are congruent. AB ≅ CD (read “segment AB is congruent to segment CD”) means AB = CD. In a figure, congruent segments are marked with the same number of tick marks. When congruent segments have lengths written as expressions, set the expressions equal and solve.",
    "长度相等的线段叫全等线段。AB ≅ CD（读作“线段 AB 全等于线段 CD”）表示 AB = CD。在图中，全等的线段用相同数量的短竖线标出。全等线段的长度用式子表示时，令两个式子相等，再解方程。",
  ),
  ["measures-of-segments", "equations-with-variables-on-both-sides"],
  ["7.G.A.1"],
  [
    {
      id: "identifying-congruent-segments",
      title: t("Finding congruent segments", "找出全等线段"),
      explanation: t(
        "To decide whether two segments are congruent, compare their lengths. With $A$ at $-5$, $B$ at $-1$, $C$ at $2$ and $D$ at $6$: $AB = -1 - (-5) = 4$ and $CD = 6 - 2 = 4$, so $\\overline{AB} \\cong \\overline{CD}$. Segments can be congruent without sharing an endpoint, and two segments that share an endpoint need not be congruent.",
        "判断两条线段是否全等，就比较它们的长度。$A$ 在 $-5$，$B$ 在 $-1$，$C$ 在 $2$，$D$ 在 $6$：$AB = -1 - (-5) = 4$，$CD = 6 - 2 = 4$，所以 $\\overline{AB} \\cong \\overline{CD}$。全等的线段不一定有公共端点，有公共端点的两条线段也不一定全等。",
      ),
      generate(rng) {
        const L = rng.int(2, 7);
        const p = rng.int(-9, 9 - L);
        const q = rng.int(-9, 9 - L);
        const r = rng.int(-9, 9);
        const coords = [p, p + L, q, q + L, r];
        if (new Set(coords).size < 5) return this.generate(rng);
        const sorted = [...coords].sort((x, y) => x - y);
        const letters = "ABCDE";
        const index = (v: number) => sorted.indexOf(v);
        const target = pairName(letters, index(p), index(p + L));
        const correct = pairName(letters, index(q), index(q + L));
        const others: string[] = [];
        for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) if (sorted[j]! - sorted[i]! !== L) others.push(pairName(letters, i, j));
        if (others.length < 3) return this.generate(rng);
        const opt = (n: string) => t(`$${over(n)}$`, `$${over(n)}$`);
        const lengthOf = (n: string) => sorted[letters.indexOf(n[1]!)]! - sorted[letters.indexOf(n[0]!)]!;
        const wrong = rng.shuffle(others).slice(0, 3);
        return pickChoice(
          rng,
          t(`Which segment is congruent to $${over(target)}$?`, `哪条线段与 $${over(target)}$ 全等？`),
          opt(correct),
          wrong.map(opt),
          t(
            `$${target} = ${L}$. Of the choices, only $${correct} = ${L}$; the others are ${wrong.map((w) => `$${w} = ${lengthOf(w)}$`).join(", ")}. So $${over(target)} \\cong ${over(correct)}$.`,
            `$${target} = ${L}$。选项中只有 $${correct} = ${L}$；其余是 ${wrong.map((w) => `$${w} = ${lengthOf(w)}$`).join("，")}。所以 $${over(target)} \\cong ${over(correct)}$。`,
          ),
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
      },
    },
    {
      id: "congruent-segments-with-algebra",
      title: t("Congruent segments with algebra", "用方程求全等线段"),
      explanation: t(
        "In the figure, $\\overline{AB} \\cong \\overline{CD}$, $AB = 3x + 4$ and $CD = 5x - 6$. Congruent segments have equal lengths, so $3x + 4 = 5x - 6$, which gives $10 = 2x$ and $x = 5$. Then $AB = 3 \\cdot 5 + 4 = 19$, and $CD = 5 \\cdot 5 - 6 = 19$ checks.",
        "如图，$\\overline{AB} \\cong \\overline{CD}$，$AB = 3x + 4$，$CD = 5x - 6$。全等线段长度相等，所以 $3x + 4 = 5x - 6$，得 $10 = 2x$，$x = 5$。于是 $AB = 3 \\cdot 5 + 4 = 19$，再用 $CD = 5 \\cdot 5 - 6 = 19$ 检验。",
      ),
      generate(rng) {
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
        const solve = steps(...equalSteps(e1, e2));
        if (askX)
          return {
            ...numberProblem({
              prompt: t(
                `In the figure, $${over("AB")} \\cong ${over("CD")}$, ${given} and ${given2}. Find $x$.`,
                `如图，$${over("AB")} \\cong ${over("CD")}$，${given}，${given2}。求 $x$。`,
              ),
              answer: x,
              wrong: equalWrong(e1, e2),
              solution: t(`Congruent segments have equal lengths:${solve}`, `全等线段的长度相等：${solve}`),
            }),
            figure,
          };
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $${over("AB")} \\cong ${over("CD")}$, ${given} and ${given2}, in ${unitWords[u]}. How long is $${over("AB")}$?`,
              `如图，$${over("AB")} \\cong ${over("CD")}$，${given}，${given2}（单位：${u}）。$${over("AB")}$ 有多长？`,
            ),
            answer: L,
            unit: u,
            wrong: [x, 2 * L, at(e1, x + 1)],
            solution: t(
              `Congruent segments have equal lengths:${solve}Then $AB = ${subst(e1, x)} = ${L}\\text{ ${u}}$.`,
              `全等线段的长度相等：${solve}于是 $AB = ${subst(e1, x)} = ${L}\\text{ ${u}}$。`,
            ),
          }),
          figure,
        };
      },
    },
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

export const midpoints = topic(
  "midpoints",
  t("Midpoints", "中点"),
  t(
    "The midpoint M of a segment AB is the point of the segment that divides it into two congruent halves: AM = MB = ½AB. On a number line, the coordinate of the midpoint is the average of the endpoints' coordinates: the midpoint of −4 and 10 is (−4 + 10) ÷ 2 = 3. Going the other way, an endpoint is as far beyond the midpoint as the other endpoint is before it.",
    "线段 AB 的中点 M 是把它分成两条全等线段的点：AM = MB = ½AB。在数轴上，中点的坐标是两个端点坐标的平均数：−4 和 10 的中点是 (−4 + 10) ÷ 2 = 3。反过来，一个端点在中点另一侧，与中点的距离等于另一个端点到中点的距离。",
  ),
  ["congruent-segments"],
  ["7.G.A.1"],
  [
    {
      id: "midpoint-on-a-number-line",
      figure: gradeDrawings3["midpoints#midpoint-on-a-number-line"],
      title: t("The midpoint on a number line", "数轴上的中点"),
      explanation: t(
        "The midpoint of $\\overline{AB}$ with $A$ at $-7$ and $B$ at $4$ is at $\\frac{-7 + 4}{2} = \\frac{-3}{2} = -1.5$. Check: from $-7$ to $-1.5$ is $5.5$ units, and from $-1.5$ to $4$ is also $5.5$ units. Half the length, $\\frac{4 - (-7)}{2} = 5.5$, is the distance to the midpoint, not its coordinate.",
        "$A$ 在 $-7$，$B$ 在 $4$，$\\overline{AB}$ 的中点在 $\\frac{-7 + 4}{2} = \\frac{-3}{2} = -1.5$。检验：从 $-7$ 到 $-1.5$ 是 $5.5$ 个单位，从 $-1.5$ 到 $4$ 也是 $5.5$ 个单位。长度的一半 $\\frac{4 - (-7)}{2} = 5.5$ 是到中点的距离，不是中点的坐标。",
      ),
      generate(rng) {
        const a = rng.int(-20, 14);
        const b = rng.int(a + 3, 20);
        const m = Q.of(a + b, 2);
        const [p, q] = rng.pick(segmentNames);
        return numberProblem({
          prompt: t(
            `On a number line, $${p}$ is at $${a}$ and $${q}$ is at $${b}$. What is the coordinate of the midpoint of $${over(p + q)}$?`,
            `在数轴上，$${p}$ 在 $${a}$，$${q}$ 在 $${b}$。$${over(p + q)}$ 的中点的坐标是多少？`,
          ),
          answer: m,
          wrong: [Q.of(b - a, 2), Q.of(a + b), Q.of(b - a)],
          solution: t(
            `The midpoint is the average of the endpoints:${steps(`\\frac{${a} + ${b < 0 ? `(${b})` : b}}{2} = \\frac{${a + b}}{2} = ${result(m)}`)}`,
            `中点的坐标是两个端点坐标的平均数：${steps(`\\frac{${a} + ${b < 0 ? `(${b})` : b}}{2} = \\frac{${a + b}}{2} = ${result(m)}`)}`,
          ),
        });
      },
    },
    {
      id: "finding-an-endpoint",
      title: t("Finding an endpoint", "求端点"),
      explanation: t(
        "$M$ is the midpoint of $\\overline{AB}$, with $A$ at $-3$ and $M$ at $2$. From $A$ to $M$ is $2 - (-3) = 5$ units, so $B$ is another $5$ units past $M$: $B$ is at $2 + 5 = 7$. In one step, $B = 2M - A = 2 \\cdot 2 - (-3) = 7$.",
        "$M$ 是 $\\overline{AB}$ 的中点，$A$ 在 $-3$，$M$ 在 $2$。从 $A$ 到 $M$ 是 $2 - (-3) = 5$ 个单位，所以 $B$ 在 $M$ 的另一侧再过 $5$ 个单位：$B$ 在 $2 + 5 = 7$。也可以一步算出：$B = 2M - A = 2 \\cdot 2 - (-3) = 7$。",
      ),
      generate(rng) {
        const a = rng.int(-15, 15);
        const d = rng.nonZero(-12, 12);
        const m = a + d;
        const b = m + d;
        if (Math.abs(b) > 30) return this.generate(rng);
        const paren = (v: number) => (v < 0 ? `(${v})` : `${v}`);
        return numberProblem({
          prompt: t(
            `On a number line, $M$ is the midpoint of $${over("AB")}$. $A$ is at $${a}$ and $M$ is at $${m}$. Where is $B$?`,
            `在数轴上，$M$ 是 $${over("AB")}$ 的中点。$A$ 在 $${a}$，$M$ 在 $${m}$。$B$ 在哪里？`,
          ),
          answer: b,
          form: "integer",
          wrong: [Q.of(a + m, 2), m - a, a + m],
          solution: t(
            `From $A$ to $M$ is $${m} - ${paren(a)} = ${d}$, and $B$ is the same distance past $M$:${steps(`B = ${m} + ${paren(d)} = ${b}`)}`,
            `从 $A$ 到 $M$ 是 $${m} - ${paren(a)} = ${d}$，$B$ 在 $M$ 的另一侧，距离相同：${steps(`B = ${m} + ${paren(d)} = ${b}`)}`,
          ),
        });
      },
    },
    {
      id: "midpoints-with-algebra",
      title: t("Midpoints with algebra", "用方程求中点问题"),
      explanation: t(
        "$M$ is the midpoint of $\\overline{AB}$, $AM = 2x + 5$ and $MB = 4x - 3$. The halves are congruent, so $2x + 5 = 4x - 3$, giving $x = 4$. Then $AM = 13$, and the whole segment is twice as long: $AB = 2 \\cdot 13 = 26$.",
        "$M$ 是 $\\overline{AB}$ 的中点，$AM = 2x + 5$，$MB = 4x - 3$。两半全等，所以 $2x + 5 = 4x - 3$，得 $x = 4$。于是 $AM = 13$，整条线段是它的两倍：$AB = 2 \\cdot 13 = 26$。",
      ),
      generate(rng) {
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
        const given = t(
          `$M$ is the midpoint of $${over("AB")}$, $AM = ${linear(...e1)}$ and $MB = ${linear(...e2)}$, in ${unitWords[u]}.`,
          `$M$ 是 $${over("AB")}$ 的中点，$AM = ${linear(...e1)}$，$MB = ${linear(...e2)}$（单位：${u}）。`,
        );
        const solve = steps(...equalSteps(e1, e2));
        if (ask === 0)
          return {
            ...numberProblem({
              prompt: t(`${given.en} Find $x$.`, `${given["zh-CN"]}求 $x$。`),
              answer: x,
              wrong: equalWrong(e1, e2),
              solution: t(`The two halves are congruent:${solve}`, `两半全等：${solve}`),
            }),
            figure,
          };
        const whole = ask === 1;
        return {
          ...numberProblem({
            prompt: t(
              `${given.en} How long is $${over(whole ? "AB" : "AM")}$?`,
              `${given["zh-CN"]}$${over(whole ? "AB" : "AM")}$ 有多长？`,
            ),
            answer: whole ? 2 * L : L,
            unit: u,
            wrong: whole ? [L, x, 2 * x] : [x, 2 * L, at(e2, x + 1)],
            solution: t(
              `The two halves are congruent:${solve}So $AM = ${subst(e1, x)} = ${L}${whole ? `$, and $AB = 2 \\cdot ${L} = ${2 * L}\\text{ ${u}}$` : `\\text{ ${u}}$`}.`,
              `两半全等：${solve}所以 $AM = ${subst(e1, x)} = ${L}${whole ? `$，$AB = 2 \\cdot ${L} = ${2 * L}\\text{ ${u}}$` : `\\text{ ${u}}$`}。`,
            ),
          }),
          figure,
        };
      },
    },
  ],
);

export const collinearPoints = topic(
  "collinear-points",
  t("Collinear Points", "共线的点"),
  t(
    "Points that lie on one line are collinear; points that do not all lie on one line are noncollinear. Any two points are collinear, since there is exactly one line through them, so the question is whether a third point lies on that line too. In the coordinate plane, points with the same x-coordinate lie on a vertical line and points with the same y-coordinate on a horizontal line; points reached from one another by repeating the same step, such as 2 right and 3 up, also lie on one line.",
    "在同一条直线上的点叫共线的点；不全在同一条直线上的点叫不共线的点。任意两点都共线，因为过两点有且只有一条直线，所以关键是第三个点是否也在这条直线上。在坐标平面中，横坐标相同的点在一条竖直线上，纵坐标相同的点在一条水平线上；从一个点出发，重复同样的一步（例如向右 2、向上 3）所到达的点也在同一条直线上。",
  ),
  ["the-cartesian-coordinate-system"],
  ["4.G.A.1"],
  [
    {
      id: "identifying-collinear-points",
      title: t("Collinear points in a figure", "图中共线的点"),
      explanation: t(
        "Two lines cross at a point. Three points on the same line are collinear, including the crossing point. If two of the points are on one line and the third is on the other line, but not at the crossing point, the three are not collinear: no single line passes through all of them.",
        "两条直线相交于一点。在同一条直线上的三个点共线，交点也算在两条直线上。如果其中两点在一条直线上，第三点在另一条直线上且不是交点，这三点就不共线：没有一条直线同时经过它们。",
      ),
      generate(rng) {
        const t1 = rng.int(0, 35) * 5;
        const t2 = t1 + rng.int(10, 26) * 5;
        const X: Point = [0, 0];
        const on1 = rng.shuffle([-4, -2, 2, 4]).slice(0, 3);
        const on2 = rng.shuffle([-3, 3]).slice(0, rng.int(1, 2));
        const mid = (t1 + t2) / 2 + (rng.bool() ? 0 : 180);
        const off = dir(mid, 3);
        const letters = rng.shuffle([..."ABCDEFGH"]);
        type Named = { p: Point; line: number; name: string; d: Compass };
        const normal = (deg: number, p: Point): Compass => awayFrom(dir(deg + 90, 1, p), p);
        const pts: Named[] = [
          { p: X, line: 0, name: letters[0]!, d: awayFrom(dir(mid + 180, 1), X) },
          ...on1.map((s, i) => ({ p: dir(t1, s), line: 1, name: letters[1 + i]!, d: normal(t1, dir(t1, s)) })),
          ...on2.map((s, i) => ({ p: dir(t2, s), line: 2, name: letters[4 + i]!, d: normal(t2, dir(t2, s)) })),
          { p: off, line: 3, name: letters[6]!, d: awayFrom(off, X) },
        ];
        const line1 = pts.filter((q) => q.line === 1 || q.line === 0);
        const kind = rng.int(0, 2);
        const pick =
          kind === 0
            ? rng.shuffle(line1).slice(0, 3)
            : [...rng.shuffle(pts.filter((q) => q.line === 1)).slice(0, 2), rng.pick(pts.filter((q) => q.line === (kind === 1 ? 2 : 3)))];
        const trio = rng.shuffle(pick).map((q) => q.name);
        const list = `$${trio[0]}$, $${trio[1]}$ and $${trio[2]}$`;
        const listZh = `$${trio[0]}$、$${trio[1]}$、$${trio[2]}$`;
        const outsider = pick.find((q) => q.line > 1);
        const suspect = outsider?.name ?? trio[2]!;
        return {
          ...verdictChoice(rng, {
            prompt: t(`Are points ${list} collinear?`, `点 ${listZh} 共线吗？`),
            holds: kind === 0,
            yes: t("all three lie on one straight line", "三个点都在同一条直线上"),
            no: t(`$${suspect}$ is not on the line through the other two`, `$${suspect}$ 不在经过另外两点的直线上`),
            yesWrong: t("any three points can be joined by straight segments", "任意三个点都可以用线段连起来"),
            noWrong: t("the three points are not evenly spaced", "这三个点的间距不相等"),
            solution:
              kind === 0
                ? t(`All three lie on the same line, so they are collinear.`, `三个点都在同一条直线上，所以它们共线。`)
                : t(
                    `The line through the other two points does not pass through $${outsider!.name}$, so the three points are not collinear.`,
                    `经过另外两点的直线不经过 $${outsider!.name}$，所以这三点不共线。`,
                  ),
          }),
          figure: fig(
            [seg(dir(t1, -5.5), dir(t1, 5.5)), seg(dir(t2, -4.5), dir(t2, 4.5)), ...pts.flatMap((q) => dot(q.p, q.name, q.d))],
            `Two lines crossing at ${pts[0]!.name}. Points ${line1
              .slice(1)
              .map((q) => q.name)
              .join(", ")} lie on one line, ${pts
              .filter((q) => q.line === 2)
              .map((q) => q.name)
              .join(" and ")} on the other, and ${off ? pts[pts.length - 1]!.name : ""} on neither.`,
            `两条直线相交于 ${pts[0]!.name}。点 ${line1
              .slice(1)
              .map((q) => q.name)
              .join("、")} 在一条直线上，${pts
              .filter((q) => q.line === 2)
              .map((q) => q.name)
              .join("、")} 在另一条直线上，${pts[pts.length - 1]!.name} 不在这两条直线上。`,
          ),
        };
      },
    },
    {
      id: "collinear-points-in-the-coordinate-plane",
      figure: gradeDrawings3["collinear-points#collinear-points-in-the-coordinate-plane"],
      title: t("Collinear points in the coordinate plane", "坐标平面中的共线点"),
      explanation: t(
        "$A(3, -2)$ and $B(3, 4)$ have the same $x$-coordinate, so they lie on a vertical line, and every point with $x$-coordinate $3$, such as $(3, 9)$, is collinear with them. $P(1, 1)$ and $Q(3, 4)$ are $2$ right and $3$ up from each other; repeating that step from $Q$ gives $(5, 7)$, which is on the same line.",
        "$A(3, -2)$ 与 $B(3, 4)$ 的横坐标相同，所以它们在一条竖直线上，横坐标为 $3$ 的点，例如 $(3, 9)$，都与它们共线。从 $P(1, 1)$ 到 $Q(3, 4)$ 是向右 $2$、向上 $3$；从 $Q$ 再走同样的一步得到 $(5, 7)$，它在同一条直线上。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const [x0, y0] = [rng.int(-6, 6), rng.int(-6, 6)];
        const step: [number, number] =
          kind === 0 ? [0, rng.nonZero(-5, 5)] : kind === 1 ? [rng.nonZero(-5, 5), 0] : [rng.int(1, 3), rng.nonZero(-4, 4)];
        const A = [x0, y0];
        const B = [x0 + step[0], y0 + step[1]];
        const m = rng.pick([2, 3, -1, -2]);
        const C = [x0 + m * step[0], y0 + m * step[1]];
        const cross = (p: readonly number[]) => (B[0]! - A[0]!) * (p[1]! - A[1]!) - (B[1]! - A[1]!) * (p[0]! - A[0]!);
        const candidates = [
          [C[1]!, C[0]!],
          [C[0]! + 1, C[1]!],
          [C[0]!, C[1]! + 1],
          [C[0]! - 1, C[1]!],
          [C[0]!, C[1]! - 1],
          [-C[0]!, C[1]!],
          [C[0]!, -C[1]!],
        ].filter((p) => cross(p) !== 0);
        const wrong = [...new Map(candidates.map((p) => [pointLatex(p), p])).values()].slice(0, 3);
        const opt = (p: readonly number[]) => t(`$${pointLatex(p)}$`, `$${pointLatex(p)}$`);
        const why =
          kind === 0
            ? t(
                `$A$ and $B$ have the same $x$-coordinate, $${x0}$, so the line through them is vertical. The only choice with $x$-coordinate $${x0}$ is $${pointLatex(C)}$.`,
                `$A$ 与 $B$ 的横坐标都是 $${x0}$，所以经过它们的直线是竖直的。选项中只有 $${pointLatex(C)}$ 的横坐标是 $${x0}$。`,
              )
            : kind === 1
              ? t(
                  `$A$ and $B$ have the same $y$-coordinate, $${y0}$, so the line through them is horizontal. The only choice with $y$-coordinate $${y0}$ is $${pointLatex(C)}$.`,
                  `$A$ 与 $B$ 的纵坐标都是 $${y0}$，所以经过它们的直线是水平的。选项中只有 $${pointLatex(C)}$ 的纵坐标是 $${y0}$。`,
                )
              : t(
                  `From $A$ to $B$ is $${step[0]}$ right and $${Math.abs(step[1])}$ ${step[1] > 0 ? "up" : "down"}. Taking that step ${m > 0 ? `$${m}$ times from $A$` : `$${-m}$ time${m === -1 ? "" : "s"} backward from $A$`} gives $${pointLatex(C)}$, so it is on the line through $A$ and $B$.`,
                  `从 $A$ 到 $B$ 是向右 $${step[0]}$、向${step[1] > 0 ? "上" : "下"} $${Math.abs(step[1])}$。从 $A$ ${m > 0 ? `沿这一步走 $${m}$ 次` : `反方向走 $${-m}$ 次`}得到 $${pointLatex(C)}$，所以它在经过 $A$、$B$ 的直线上。`,
                );
        return pickChoice(
          rng,
          t(
            `Which point is collinear with $A${pointLatex(A)}$ and $B${pointLatex(B)}$?`,
            `哪个点与 $A${pointLatex(A)}$、$B${pointLatex(B)}$ 共线？`,
          ),
          opt(C),
          wrong.map(opt),
          why,
        );
      },
    },
  ],
);

export const theSegmentAdditionPostulate = topic(
  "the-segment-addition-postulate",
  t("The Segment Addition Postulate", "线段加法公理"),
  t(
    "If point B lies on segment AC, between A and C, then AB + BC = AC: the two parts add up to the whole. So a part is the whole minus the other part. When the lengths are expressions, the postulate gives an equation: if AB = 2x + 3, BC = 3x − 1 and AC = 32, then 5x + 2 = 32 and x = 6.",
    "如果点 B 在线段 AC 上、位于 A 与 C 之间，那么 AB + BC = AC：两部分之和等于整条线段。所以一部分等于整条线段减去另一部分。长度用式子表示时，由这个公理可以列出方程：若 AB = 2x + 3，BC = 3x − 1，AC = 32，则 5x + 2 = 32，x = 6。",
  ),
  ["measures-of-segments", "two-step-equations"],
  ["7.G.A.1"],
  [
    {
      id: "parts-and-wholes",
      title: t("Parts and wholes", "部分与整体"),
      explanation: t(
        "$A$, $B$, $C$ and $D$ lie on a line in that order, $AC = 15$, $BD = 12$ and $AD = 20$. Then $AB = AD - BD = 20 - 12 = 8$, and $BC = AC - AB = 15 - 8 = 7$. Adding $AC + BD = 27$ counts $\\overline{BC}$ twice, which is why it is more than $AD$.",
        "$A$、$B$、$C$、$D$ 依次在一条直线上，$AC = 15$，$BD = 12$，$AD = 20$。则 $AB = AD - BD = 20 - 12 = 8$，$BC = AC - AB = 15 - 8 = 7$。$AC + BD = 27$ 把 $\\overline{BC}$ 算了两次，所以比 $AD$ 大。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const tex = (v: Q) => `${result(v)}\\text{ ${u}}`;
        if (rng.bool()) {
          const ab = rng.bool() ? Q.of(rng.int(3, 30)) : halves(rng, 2, 25);
          const bc = Q.of(rng.int(3, 30));
          const ac = ab.add(bc);
          return {
            ...numberProblem({
              prompt: t(
                `Point $B$ lies on $${over("AC")}$. $AC = ${tex(ac)}$ and $AB = ${tex(ab)}$. Find $BC$.`,
                `点 $B$ 在 $${over("AC")}$ 上。$AC = ${tex(ac)}$，$AB = ${tex(ab)}$。求 $BC$。`,
              ),
              answer: bc,
              unit: u,
              wrong: [ac.add(ab), ac.div(Q.of(2)), ab],
              solution: t(
                `By the segment addition postulate, $AB + BC = AC$:${steps(`BC = AC - AB = ${result(ac)} - ${result(ab)} = ${tex(bc)}`)}`,
                `由线段加法公理，$AB + BC = AC$：${steps(`BC = AC - AB = ${result(ac)} - ${result(ab)} = ${tex(bc)}`)}`,
              ),
            }),
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
          };
        }
        const [ab, bc, cd] = [rng.int(3, 15), rng.int(3, 15), rng.int(3, 15)];
        const [ac, bd, ad] = [ab + bc, bc + cd, ab + bc + cd];
        return {
          ...numberProblem({
            prompt: t(
              `Points $A$, $B$, $C$ and $D$ lie on a line in that order. $AC = ${ac}\\text{ ${u}}$, $BD = ${bd}\\text{ ${u}}$ and $AD = ${ad}\\text{ ${u}}$. Find $BC$.`,
              `点 $A$、$B$、$C$、$D$ 依次在一条直线上。$AC = ${ac}\\text{ ${u}}$，$BD = ${bd}\\text{ ${u}}$，$AD = ${ad}\\text{ ${u}}$。求 $BC$。`,
            ),
            answer: bc,
            unit: u,
            wrong: [ad - ac, ad - bd, ac + bd],
            solution: t(
              `First find a part next to $${over("BC")}$, then subtract it:${steps(`AB = AD - BD = ${ad} - ${bd} = ${ab}`, `BC = AC - AB = ${ac} - ${ab} = ${bc}\\text{ ${u}}`)}`,
              `先求出与 $${over("BC")}$ 相邻的一段，再相减：${steps(`AB = AD - BD = ${ad} - ${bd} = ${ab}`, `BC = AC - AB = ${ac} - ${ab} = ${bc}\\text{ ${u}}`)}`,
            ),
          }),
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
        };
      },
    },
    {
      id: "segment-addition-with-algebra",
      title: t("Segment addition with algebra", "用方程解线段加法问题"),
      explanation: t(
        "By the segment addition postulate, if $B$ lies on $\\overline{AC}$, then $AB + BC = AC$. When the lengths are expressions, write that equation, solve for the variable, and substitute back to find each length.\n\n$B$ lies on $\\overline{AC}$, $AB = 2x + 3$, $BC = 3x - 1$ and $AC = 32$. Then $(2x + 3) + (3x - 1) = 32$, so $5x + 2 = 32$, $5x = 30$ and $x = 6$. The parts are $AB = 15$ and $BC = 17$, and $15 + 17 = 32$ checks.",
        "由线段加法公设，若 $B$ 在 $\\overline{AC}$ 上，则 $AB + BC = AC$。当长度用式子表示时，列出这个方程，解出未知数，再代回去求出每段长度。\n\n$B$ 在 $\\overline{AC}$ 上，$AB = 2x + 3$，$BC = 3x - 1$，$AC = 32$。则 $(2x + 3) + (3x - 1) = 32$，所以 $5x + 2 = 32$，$5x = 30$，$x = 6$。两部分是 $AB = 15$ 和 $BC = 17$，$15 + 17 = 32$，检验正确。",
      ),
      generate(rng) {
        const x = rng.int(2, 12);
        const [l1, l2] = [rng.int(x + 3, 40), rng.int(x + 3, 40)];
        const e1 = expressionFor(rng, l1, x);
        const e2 = expressionFor(rng, l2, x);
        const total = l1 + l2;
        const u = pickUnit(rng);
        const ask = rng.int(0, 2);
        const solve = steps(...sumSteps([e1, e2], total));
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
        const given = t(
          `$B$ lies on $${over("AC")}$, $AB = ${linear(...e1)}$, $BC = ${linear(...e2)}$ and $AC = ${total}$, in ${unitWords[u]}.`,
          `$B$ 在 $${over("AC")}$ 上，$AB = ${linear(...e1)}$，$BC = ${linear(...e2)}$，$AC = ${total}$（单位：${u}）。`,
        );
        if (ask === 0)
          return {
            ...numberProblem({
              prompt: t(`${given.en} Find $x$.`, `${given["zh-CN"]}求 $x$。`),
              answer: x,
              wrong: sumWrong([e1, e2], total, 2 * total),
              solution: t(`The parts add up to the whole:${solve}`, `两部分之和等于整条线段：${solve}`),
            }),
            figure,
          };
        const [name, e, v] = ask === 1 ? ["AB", e1, l1] : ["BC", e2, l2];
        return {
          ...numberProblem({
            prompt: t(`${given.en} How long is $${over(name)}$?`, `${given["zh-CN"]}$${over(name)}$ 有多长？`),
            answer: v,
            unit: u,
            wrong: [x, total - v, Q.of(total, 2)],
            solution: t(
              `The parts add up to the whole:${solve}So $${name} = ${subst(e, x)} = ${v}\\text{ ${u}}$.`,
              `两部分之和等于整条线段：${solve}所以 $${name} = ${subst(e, x)} = ${v}\\text{ ${u}}$。`,
            ),
          }),
          figure,
        };
      },
    },
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

export const segmentBisectorsAndThePerpendicularBisectorTheorem = topic(
  "segment-bisectors-and-the-perpendicular-bisector-theorem",
  t("Segment Bisectors and the Perpendicular Bisector Theorem", "线段的平分线与垂直平分线定理"),
  t(
    "A segment bisector is a line, ray or segment through the midpoint of a segment: it cuts the segment into two congruent halves. A bisector that is also perpendicular to the segment is its perpendicular bisector. The perpendicular bisector theorem says that every point on the perpendicular bisector of AB is the same distance from A and from B: PA = PB. Conversely, a point the same distance from A and B lies on the perpendicular bisector.",
    "经过线段中点的直线、射线或线段叫线段的平分线：它把线段分成两条全等的线段。垂直于线段的平分线叫这条线段的垂直平分线。垂直平分线定理：线段 AB 的垂直平分线上的每一点到 A 和 B 的距离相等，即 PA = PB。反过来，到 A 和 B 距离相等的点在线段的垂直平分线上。",
  ),
  ["midpoints", "parallel-and-perpendicular-lines"],
  ["7.G.A.2"],
  [
    {
      id: "bisectors-of-segments",
      title: t("Segment bisectors", "线段的平分线"),
      explanation: t(
        "Line $\\ell$ bisects $\\overline{AB}$ at $M$, $AB = 5x - 2$ and $AM = 2x + 3$. The whole is twice each half, so $5x - 2 = 2(2x + 3) = 4x + 6$, which gives $x = 8$. Then $AM = 19$ and $AB = 38$. Setting $5x - 2 = 2x + 3$ would treat the whole as equal to a half.",
        "直线 $\\ell$ 在 $M$ 处平分 $\\overline{AB}$，$AB = 5x - 2$，$AM = 2x + 3$。整条线段是每一半的两倍，所以 $5x - 2 = 2(2x + 3) = 4x + 6$，得 $x = 8$。于是 $AM = 19$，$AB = 38$。若列成 $5x - 2 = 2x + 3$，就把整条线段当成了一半。",
      ),
      generate(rng) {
        const x = rng.int(2, 12);
        const L = rng.int(x + 4, 40);
        const half = expressionFor(rng, L, x, [3, 4, 5, 6]);
        const whole = expressionFor(rng, 2 * L, x, [2 * half[0], half[0]]);
        const doubled: Linear = [2 * half[0], 2 * half[1]];
        const u = pickUnit(rng);
        const askX = rng.bool();
        const solve = steps(`${linear(...whole)} = 2(${linear(...half)})`, ...equalSteps(whole, doubled));
        const figure = fig(
          bisectorFigure(rng.pick([60, 70, 110, 120]), null, [plain(...half), null]),
          `Line ℓ crosses segment AB at its midpoint M; AM = ${plain(...half)}.`,
          `直线 ℓ 经过线段 AB 的中点 M；AM = ${plain(...half)}。`,
        );
        const given = t(
          `Line $\\ell$ bisects $${over("AB")}$ at $M$. $AB = ${linear(...whole)}$ and $AM = ${linear(...half)}$, in ${unitWords[u]}.`,
          `直线 $\\ell$ 在 $M$ 处平分 $${over("AB")}$。$AB = ${linear(...whole)}$，$AM = ${linear(...half)}$（单位：${u}）。`,
        );
        return {
          ...numberProblem({
            prompt: askX
              ? t(`${given.en} Find $x$.`, `${given["zh-CN"]}求 $x$。`)
              : t(`${given.en} How long is $${over("AB")}$?`, `${given["zh-CN"]}$${over("AB")}$ 有多长？`),
            answer: askX ? x : 2 * L,
            ...(!askX && { unit: u }),
            wrong: askX ? [...equalWrong(whole, half), Q.of(half[1] - whole[1], whole[0] - half[0])] : [L, x, 4 * L],
            solution: t(
              `$M$ is the midpoint, so $AB = 2 \\cdot AM$:${solve}${askX ? "" : `So $AB = ${subst(whole, x)} = ${2 * L}\\text{ ${u}}$.`}`,
              `$M$ 是中点，所以 $AB = 2 \\cdot AM$：${solve}${askX ? "" : `所以 $AB = ${subst(whole, x)} = ${2 * L}\\text{ ${u}}$。`}`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "the-perpendicular-bisector-theorem",
      figure: gradeDrawings3["segment-bisectors-and-the-perpendicular-bisector-theorem#the-perpendicular-bisector-theorem"],
      title: t("The perpendicular bisector theorem", "垂直平分线定理"),
      explanation: t(
        "Line $\\ell$ is the perpendicular bisector of $\\overline{AB}$, and $P$ is on $\\ell$. By the theorem, $PA = PB$. If $PA = 4x - 3$ and $PB = 2x + 9$, then $4x - 3 = 2x + 9$, so $x = 6$ and $PA = PB = 21$.",
        "直线 $\\ell$ 是 $\\overline{AB}$ 的垂直平分线，$P$ 在 $\\ell$ 上。由定理，$PA = PB$。若 $PA = 4x - 3$，$PB = 2x + 9$，则 $4x - 3 = 2x + 9$，所以 $x = 6$，$PA = PB = 21$。",
      ),
      generate(rng) {
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
          return {
            ...numberProblem({
              prompt: t(
                `Line $\\ell$ is the perpendicular bisector of $${over("AB")}$ and meets it at $M$. Point $P$ is on $\\ell$, $PA = ${PA}\\text{ ${u}}$, $PM = ${PM}\\text{ ${u}}$ and $AM = ${AM}\\text{ ${u}}$. Find $PB$.`,
                `直线 $\\ell$ 是 $${over("AB")}$ 的垂直平分线，与它交于 $M$。点 $P$ 在 $\\ell$ 上，$PA = ${PA}\\text{ ${u}}$，$PM = ${PM}\\text{ ${u}}$，$AM = ${AM}\\text{ ${u}}$。求 $PB$。`,
              ),
              answer: PA,
              unit: u,
              wrong: [PM, AM, 2 * AM],
              solution: t(
                `$P$ is on the perpendicular bisector of $${over("AB")}$, so it is the same distance from $A$ and $B$: $PB = PA = ${PA}\\text{ ${u}}$.`,
                `$P$ 在 $${over("AB")}$ 的垂直平分线上，所以它到 $A$、$B$ 的距离相等：$PB = PA = ${PA}\\text{ ${u}}$。`,
              ),
            }),
            figure: fig(
              bisectorFigure(90, [`${PA} ${u}`, "?"], [`${AM} ${u}`, null]),
              `Line ℓ is perpendicular to AB at its midpoint M. P is on ℓ; PA = ${PA} ${u} and AM = ${AM} ${u}.`,
              `直线 ℓ 在 AB 的中点 M 处与 AB 垂直。P 在 ℓ 上；PA = ${PA} ${u}，AM = ${AM} ${u}。`,
            ),
          };
        }
        const x = rng.int(2, 12);
        const L = rng.int(x + 5, 40);
        const e1 = expressionFor(rng, L, x);
        const e2 = expressionFor(rng, L, x, [e1[0]]);
        const askX = rng.bool();
        const solve = steps(...equalSteps(e1, e2));
        return {
          ...numberProblem({
            prompt: t(
              `Line $\\ell$ is the perpendicular bisector of $${over("AB")}$, and $P$ is on $\\ell$. $PA = ${linear(...e1)}$ and $PB = ${linear(...e2)}$, in ${unitWords[u]}. ${askX ? "Find $x$." : `How long is $${over("PA")}$?`}`,
              `直线 $\\ell$ 是 $${over("AB")}$ 的垂直平分线，$P$ 在 $\\ell$ 上。$PA = ${linear(...e1)}$，$PB = ${linear(...e2)}$（单位：${u}）。${askX ? "求 $x$。" : `$${over("PA")}$ 有多长？`}`,
            ),
            answer: askX ? x : L,
            ...(!askX && { unit: u }),
            wrong: askX ? equalWrong(e1, e2) : [x, 2 * L, at(e1, x + 1)],
            solution: t(
              `$P$ is on the perpendicular bisector, so $PA = PB$:${solve}${askX ? "" : `So $PA = ${subst(e1, x)} = ${L}\\text{ ${u}}$.`}`,
              `$P$ 在垂直平分线上，所以 $PA = PB$：${solve}${askX ? "" : `所以 $PA = ${subst(e1, x)} = ${L}\\text{ ${u}}$。`}`,
            ),
          }),
          figure: fig(
            bisectorFigure(90, [plain(...e1), plain(...e2)], [null, null]),
            `Line ℓ is perpendicular to AB at its midpoint M. P is on ℓ; PA = ${plain(...e1)} and PB = ${plain(...e2)}.`,
            `直线 ℓ 在 AB 的中点 M 处与 AB 垂直。P 在 ℓ 上；PA = ${plain(...e1)}，PB = ${plain(...e2)}。`,
          ),
        };
      },
    },
    {
      id: "the-converse",
      title: t("Points the same distance from both ends", "到两端距离相等的点"),
      explanation: t(
        "The converse of the theorem: a point that is the same distance from $A$ and from $B$ lies on the perpendicular bisector of $\\overline{AB}$. If $PA = PB = 7.5$ cm, then $P$ is on it. If $PA = 7.5$ cm and $PB = 8$ cm, it is not, however close the two distances are.",
        "这个定理的逆定理：到 $A$ 和 $B$ 距离相等的点在 $\\overline{AB}$ 的垂直平分线上。若 $PA = PB = 7.5$ 厘米，则 $P$ 在垂直平分线上。若 $PA = 7.5$ 厘米，$PB = 8$ 厘米，则不在，无论这两个距离多么接近。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const pa = rng.bool() ? Q.of(rng.int(4, 40)) : halves(rng, 3, 30);
        const kind = rng.int(0, 2);
        const pb = kind === 0 ? pa : pa.add(rng.pick([Q.of(1, 2), Q.of(1), Q.of(-1, 2), Q.of(2), Q.of(-1)]));
        const ab = Q.of(rng.int(4, Math.max(5, Math.floor(pa.toNumber()))));
        const tex = (v: Q) => `${result(v)}\\text{ ${u}}`;
        const name = rng.pick(["P", "Q", "R"]);
        return choiceProblem({
          prompt: t(
            `$AB = ${tex(ab)}$. Point $${name}$ is $${tex(pa)}$ from $A$ and $${tex(pb)}$ from $B$. Does $${name}$ lie on the perpendicular bisector of $${over("AB")}$?`,
            `$AB = ${tex(ab)}$。点 $${name}$ 到 $A$ 的距离是 $${tex(pa)}$，到 $B$ 的距离是 $${tex(pb)}$。$${name}$ 在 $${over("AB")}$ 的垂直平分线上吗？`,
          ),
          options: yesNo,
          correct: kind === 0 ? 0 : 1,
          solution:
            kind === 0
              ? t(
                  `$${name}A = ${name}B$, so $${name}$ is the same distance from both endpoints and lies on the perpendicular bisector.`,
                  `$${name}A = ${name}B$，$${name}$ 到两个端点的距离相等，所以在垂直平分线上。`,
                )
              : t(
                  `$${name}A \\ne ${name}B$: every point of the perpendicular bisector is the same distance from $A$ and $B$, so $${name}$ is not on it.`,
                  `$${name}A \\ne ${name}B$：垂直平分线上的每一点到 $A$、$B$ 的距离都相等，所以 $${name}$ 不在它上面。`,
                ),
        });
      },
    },
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
export const congruentAngles = topic(
  "congruent-angles",
  t("Congruent Angles", "全等的角"),
  t(
    "Angles are congruent when they have the same measure, however long their arms are drawn and however they are turned. If ∠A ≅ ∠B and their measures are written as expressions, set the expressions equal and solve.",
    "度数相等的角是全等的角，与边画得多长、朝哪个方向无关。若 ∠A ≅ ∠B，且它们的度数用式子表示，就令两个式子相等，再解方程。",
  ),
  ["angles-and-angle-measures", "equations-with-variables-on-both-sides"],
  ["7.G.A.2", "8.G.A.2"],
  [
    {
      id: "identifying-congruent-angles",
      figure: gradeDrawings3["congruent-angles#identifying-congruent-angles"],
      title: t("Identifying congruent angles", "辨认全等的角"),
      explanation: t(
        "Two angles are **congruent**, written $\\angle ABC \\cong \\angle DEF$, when $m\\angle ABC = m\\angle DEF$. Only the opening between the arms matters: an angle of $40^\\circ$ with long arms is congruent to an angle of $40^\\circ$ with short arms that points the other way.",
        "两个角的度数相等时，它们是**全等**的，记作 $\\angle ABC \\cong \\angle DEF$，即 $m\\angle ABC = m\\angle DEF$。只有两边张开的大小有关：边很长的 $40^\\circ$ 角与边很短、朝向相反的 $40^\\circ$ 角全等。",
      ),
      generate(rng) {
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
        const desc = order.map((k, i) => `${angleSets[i + 1]} measures ${others[k]}°`).join(", ");
        const descZh = order.map((k, i) => `${angleSets[i + 1]} 为 ${others[k]}°`).join("，");
        return pickChoice(
          rng,
          t(`Which angle is congruent to $${angleName("ABC")}$?`, `哪个角与 $${angleName("ABC")}$ 全等？`),
          mathText(angleName(match)),
          angleSets
            .slice(1)
            .filter((s) => s !== match)
            .map((s) => mathText(angleName(s))),
          t(
            `Congruent angles have equal measures. $${measure("ABC")} = ${degTex(a)}$ and $${measure(match)} = ${degTex(a)}$, so $${angleName("ABC")} \\cong ${angleName(match)}$. The lengths of the arms and the way the angle is turned do not matter.`,
            `全等的角度数相等。$${measure("ABC")} = ${degTex(a)}$，$${measure(match)} = ${degTex(a)}$，所以 $${angleName("ABC")} \\cong ${angleName(match)}$。边的长短和角的朝向都没有关系。`,
          ),
          fig(marks, `Four angles. ABC measures ${a}°, ${desc}.`, `四个角。ABC 为 ${a}°，${descZh}。`),
        );
      },
    },
    {
      id: "congruent-angles-with-algebra",
      title: t("Congruent angles with algebra", "用方程求全等的角"),
      explanation: t(
        "If $\\angle P \\cong \\angle Q$ with $m\\angle P = (3x + 12)^\\circ$ and $m\\angle Q = (5x - 20)^\\circ$, the measures are equal:\n\n$$3x + 12 = 5x - 20 \\;\\Rightarrow\\; 32 = 2x \\;\\Rightarrow\\; x = 16.$$\n\nEach angle measures $3 \\cdot 16 + 12 = 60^\\circ$. Substitute into both expressions to check.",
        "若 $\\angle P \\cong \\angle Q$，$m\\angle P = (3x + 12)^\\circ$，$m\\angle Q = (5x - 20)^\\circ$，则两个度数相等：\n\n$$3x + 12 = 5x - 20 \\;\\Rightarrow\\; 32 = 2x \\;\\Rightarrow\\; x = 16.$$\n\n每个角都是 $3 \\cdot 16 + 12 = 60^\\circ$。把 $x$ 代入两个式子检验。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
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
        const head = t(
          `$${angleName(p)} \\cong ${angleName(q)}$, $${measure(p)} = ${angleTex(...e1)}$ and $${measure(q)} = ${angleTex(...e2)}$.`,
          `$${angleName(p)} \\cong ${angleName(q)}$，$${measure(p)} = ${angleTex(...e1)}$，$${measure(q)} = ${angleTex(...e2)}$。`,
        );
        const solve = steps(...equalSteps(e1, e2));
        return numberProblem({
          prompt: askX
            ? t(`${head.en} Find $x$.`, `${head["zh-CN"]}求 $x$。`)
            : t(`${head.en} Find $${measure(p)}$.`, `${head["zh-CN"]}求 $${measure(p)}$。`),
          answer: askX ? x : v,
          ...(askX ? {} : { unit: "°" }),
          wrong: askX ? equalWrong(e1, e2) : [x, 180 - v, 90 - v].filter((w) => w > 0),
          solution: t(
            `Congruent angles have equal measures:${solve}${askX ? "" : `So $${measure(p)} = ${subst(e1, x)} = ${degTex(v)}$.`}`,
            `全等的角度数相等：${solve}${askX ? "" : `所以 $${measure(p)} = ${subst(e1, x)} = ${degTex(v)}$。`}`,
          ),
        });
      },
    },
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

/** pairFigureProblem finds the unknown part of a right angle or a straight angle split by a ray. */
function pairFigureProblem(rng: Rng, kind: PairKind): Problem {
  const total = kind.total;
  const a = total === 90 ? rng.int(12, 78) : rng.int(20, 160);
  const start = total === 90 ? rng.pick([0, 15, 30, 90, 180, 200]) : rng.pick([0, 5, 10, 350, 355]);
  const x = total - a;
  const firstKnown = rng.bool();
  const [first, labels]: [number, [string, string]] = firstKnown ? [a, [deg(a), "x°"]] : [x, ["x°", deg(a)]];
  const given =
    total === 90
      ? t(`$${angleName("ABC")}$ is a right angle. Find $x$.`, `$${angleName("ABC")}$ 是直角。求 $x$。`)
      : t("Points $A$, $B$ and $C$ lie on a line. Find $x$.", "点 $A$、$B$、$C$ 在同一条直线上。求 $x$。");
  return {
    ...numberProblem({
      prompt: given,
      answer: x,
      form: "integer",
      wrong: [a, (total === 90 ? 180 : 90) - a].filter((w) => w > 0),
      solution: t(
        `The two angles make up ${total === 90 ? "the right angle" : "the straight angle"}, so they are ${kind.word.en} and add up to $${degTex(total)}$:${steps(`x + ${a} = ${total}`, `x = ${total} - ${a} = ${x}`)}`,
        `两个角合起来是${total === 90 ? "直角" : "平角"}，所以它们${kind.word["zh-CN"]}，和为 $${degTex(total)}$：${steps(`x + ${a} = ${total}`, `x = ${total} - ${a} = ${x}`)}`,
      ),
    }),
    figure: fig(
      splitAngle(start, total, first, labels),
      `${total === 90 ? "A right angle ABC" : "A straight angle ABC"} split by ray BD into angles of ${firstKnown ? `${a}° and x°` : `x° and ${a}°`}.`,
      `射线 BD 把${total === 90 ? "直角" : "平角"} ABC 分成 ${firstKnown ? `${a}° 和 x°` : `x° 和 ${a}°`} 两个角。`,
    ),
  };
}

/** pairAlgebraProblem solves for x when two angles given as expressions are complementary or supplementary. */
function pairAlgebraProblem(rng: Rng, kind: PairKind): Problem {
  const total = kind.total;
  const x = rng.int(3, 15);
  const p = total === 90 ? rng.int(20, 70) : rng.int(35, 145);
  const e1 = expressionFor(rng, p, x);
  const e2 = expressionFor(rng, total - p, x);
  const askX = rng.bool();
  const head = t(
    `$${angleName("P")}$ and $${angleName("Q")}$ are ${kind.word.en}, $${measure("P")} = ${angleTex(...e1)}$ and $${measure("Q")} = ${angleTex(...e2)}$.`,
    `$${angleName("P")}$ 与 $${angleName("Q")}$ ${kind.word["zh-CN"]}，$${measure("P")} = ${angleTex(...e1)}$，$${measure("Q")} = ${angleTex(...e2)}$。`,
  );
  const solve = steps(...sumSteps([e1, e2], total));
  return numberProblem({
    prompt: askX
      ? t(`${head.en} Find $x$.`, `${head["zh-CN"]}求 $x$。`)
      : t(`${head.en} Find $${measure("P")}$.`, `${head["zh-CN"]}求 $${measure("P")}$。`),
    answer: askX ? x : p,
    ...(askX ? {} : { unit: "°" }),
    wrong: askX ? sumWrong([e1, e2], total, total === 90 ? 180 : 90) : [x, total - p, (total === 90 ? 180 : 90) - p].filter((w) => w > 0),
    solution: t(
      `${kind.word.en[0]!.toUpperCase()}${kind.word.en.slice(1)} angles add up to $${degTex(total)}$:${solve}${askX ? "" : `So $${measure("P")} = ${subst(e1, x)} = ${degTex(p)}$.`}`,
      `${kind.word["zh-CN"]}的两个角之和为 $${degTex(total)}$：${solve}${askX ? "" : `所以 $${measure("P")} = ${subst(e1, x)} = ${degTex(p)}$。`}`,
    ),
  });
}

/** pairWordProblem finds an angle described by its relation to its complement or supplement. */
function pairWordProblem(rng: Rng, kind: PairKind): Problem {
  const total = kind.total;
  if (rng.bool()) {
    const ks = total === 90 ? [2, 4, 5, 8, 9] : [2, 3, 4, 5, 8, 9, 11];
    const k = rng.pick(ks);
    const other = total / (k + 1);
    const angle = k * other;
    return numberProblem({
      prompt: t(
        `An angle measures ${k} times its ${kind.other.en}. What is the measure of the angle?`,
        `一个角是它的${kind.other["zh-CN"]}的 ${k} 倍。这个角是多少度？`,
      ),
      answer: angle,
      form: "integer",
      unit: "°",
      wrong: [other, Math.round(total / k), ((total === 90 ? 180 : 90) * k) / (k + 1)].filter((w) => Number.isInteger(w)),
      solution: t(
        `Let the ${kind.other.en} be $x$; the angle is $${k}x$. Together they make $${degTex(total)}$:${steps(`x + ${k}x = ${total}`, `${k + 1}x = ${total}`, `x = ${other}`)}The angle is $${k} \\cdot ${other} = ${degTex(angle)}$. Check: $${angle} + ${other} = ${total}$.`,
        `设${kind.other["zh-CN"]}为 $x$，则这个角是 $${k}x$。两者之和为 $${degTex(total)}$：${steps(`x + ${k}x = ${total}`, `${k + 1}x = ${total}`, `x = ${other}`)}这个角是 $${k} \\cdot ${other} = ${degTex(angle)}$。检验：$${angle} + ${other} = ${total}$。`,
      ),
    });
  }
  const d = 2 * (total === 90 ? rng.int(4, 35) : rng.int(5, 70));
  const angle = (total + d) / 2;
  const other = angle - d;
  const more = rng.bool();
  const asked = more ? angle : other;
  return numberProblem({
    prompt: more
      ? t(
          `An angle measures $${degTex(d)}$ more than its ${kind.other.en}. What is the measure of the angle?`,
          `一个角比它的${kind.other["zh-CN"]}大 $${degTex(d)}$。这个角是多少度？`,
        )
      : t(
          `An angle measures $${degTex(d)}$ less than its ${kind.other.en}. What is the measure of the angle?`,
          `一个角比它的${kind.other["zh-CN"]}小 $${degTex(d)}$。这个角是多少度？`,
        ),
    answer: asked,
    form: "integer",
    unit: "°",
    wrong: [more ? other : angle, total - d, ((total === 90 ? 180 : 90) + (more ? d : -d)) / 2].filter((w) => Number.isInteger(w) && w > 0),
    solution: more
      ? t(
          `Let the ${kind.other.en} be $x$; the angle is $x + ${d}$. Together they make $${degTex(total)}$:${steps(`x + (x + ${d}) = ${total}`, `2x = ${total - d}`, `x = ${other}`)}The angle is $${other} + ${d} = ${degTex(angle)}$.`,
          `设${kind.other["zh-CN"]}为 $x$，则这个角是 $x + ${d}$。两者之和为 $${degTex(total)}$：${steps(`x + (x + ${d}) = ${total}`, `2x = ${total - d}`, `x = ${other}`)}这个角是 $${other} + ${d} = ${degTex(angle)}$。`,
        )
      : t(
          `Let the ${kind.other.en} be $x$; the angle is $x - ${d}$. Together they make $${degTex(total)}$:${steps(`x + (x - ${d}) = ${total}`, `2x = ${total + d}`, `x = ${angle}`)}The angle is $${angle} - ${d} = ${degTex(other)}$.`,
          `设${kind.other["zh-CN"]}为 $x$，则这个角是 $x - ${d}$。两者之和为 $${degTex(total)}$：${steps(`x + (x - ${d}) = ${total}`, `2x = ${total + d}`, `x = ${angle}`)}这个角是 $${angle} - ${d} = ${degTex(other)}$。`,
        ),
  });
}

/** complementaryAngles finds unknown angles that add up to 90°. */
export const complementaryAngles = topic(
  "complementary-angles",
  t("Complementary Angles", "互余的角"),
  t(
    "Two angles are complementary when their measures add up to 90°. When a ray splits a right angle, the two parts are complementary; when their measures are expressions, add them and set the sum equal to 90.",
    "两个角的度数之和为 90° 时，它们互余。一条射线把直角分成的两个角互余；两个角的度数用式子表示时，把它们相加，令和等于 90。",
  ),
  ["complementary-and-supplementary-angles", "two-step-equations"],
  ["7.G.B.5"],
  [
    {
      id: "complements-in-a-figure",
      figure: gradeDrawings3["complementary-angles#complements-in-a-figure"],
      title: t("Complements in a figure", "图中的余角"),
      explanation: t(
        "A small square at a vertex marks a right angle. If a ray splits a right angle into a $35^\\circ$ angle and an angle $x^\\circ$, then $x + 35 = 90$, so $x = 55$.",
        "顶点处的小正方形表示直角。若一条射线把直角分成 $35^\\circ$ 的角和 $x^\\circ$ 的角，则 $x + 35 = 90$，所以 $x = 55$。",
      ),
      generate: (rng) => pairFigureProblem(rng, complementary),
    },
    {
      id: "equations-for-complementary-angles",
      title: t("Equations for complementary angles", "互余的角的方程"),
      explanation: t(
        "Complementary angles add up to $90^\\circ$. When their measures are given as expressions, set the sum of the expressions equal to $90$, solve for the variable, and substitute it back to find each angle.\n\nIf $\\angle P$ and $\\angle Q$ are complementary with $m\\angle P = (2x + 10)^\\circ$ and $m\\angle Q = (3x + 5)^\\circ$, then\n\n$$(2x + 10) + (3x + 5) = 90 \\;\\Rightarrow\\; 5x + 15 = 90 \\;\\Rightarrow\\; x = 15,$$\n\nand $m\\angle P = 2 \\cdot 15 + 10 = 40^\\circ$.",
        "互余的两个角之和是 $90^\\circ$。当角的度数用式子表示时，令两个式子之和等于 $90$，解出未知数，再代回去求出每个角。\n\n若 $\\angle P$ 与 $\\angle Q$ 互余，$m\\angle P = (2x + 10)^\\circ$，$m\\angle Q = (3x + 5)^\\circ$，则\n\n$$(2x + 10) + (3x + 5) = 90 \\;\\Rightarrow\\; 5x + 15 = 90 \\;\\Rightarrow\\; x = 15,$$\n\n$m\\angle P = 2 \\cdot 15 + 10 = 40^\\circ$。",
      ),
      generate: (rng) => pairAlgebraProblem(rng, complementary),
    },
    {
      id: "an-angle-and-its-complement",
      title: t("An angle and its complement", "一个角与它的余角"),
      explanation: t(
        "Call the complement $x$ and write the angle in terms of $x$. If an angle is $4$ times its complement, then $x + 4x = 90$, so $x = 18$ and the angle is $72^\\circ$. If an angle is $20^\\circ$ more than its complement, then $x + (x + 20) = 90$, so $x = 35$ and the angle is $55^\\circ$.",
        "设余角为 $x$，用 $x$ 表示这个角。若一个角是它的余角的 $4$ 倍，则 $x + 4x = 90$，$x = 18$，这个角是 $72^\\circ$。若一个角比它的余角大 $20^\\circ$，则 $x + (x + 20) = 90$，$x = 35$，这个角是 $55^\\circ$。",
      ),
      generate: (rng) => pairWordProblem(rng, complementary),
    },
  ],
);

/** supplementaryAngles finds unknown angles that add up to 180°. */
export const supplementaryAngles = topic(
  "supplementary-angles",
  t("Supplementary Angles", "互补的角"),
  t(
    "Two angles are supplementary when their measures add up to 180°. Angles that together form a straight line are supplementary; when their measures are expressions, add them and set the sum equal to 180.",
    "两个角的度数之和为 180° 时，它们互补。合起来组成一条直线的两个角互补；两个角的度数用式子表示时，把它们相加，令和等于 180。",
  ),
  ["complementary-and-supplementary-angles", "two-step-equations"],
  ["7.G.B.5"],
  [
    {
      id: "supplements-in-a-figure",
      figure: gradeDrawings3["supplementary-angles#supplements-in-a-figure"],
      title: t("Supplements in a figure", "图中的补角"),
      explanation: t(
        "A straight angle measures $180^\\circ$. If a ray from a point on a line splits the straight angle into a $112^\\circ$ angle and an angle $x^\\circ$, then $x + 112 = 180$, so $x = 68$.",
        "平角是 $180^\\circ$。若从直线上一点引出的射线把平角分成 $112^\\circ$ 的角和 $x^\\circ$ 的角，则 $x + 112 = 180$，所以 $x = 68$。",
      ),
      generate: (rng) => pairFigureProblem(rng, supplementary),
    },
    {
      id: "equations-for-supplementary-angles",
      title: t("Equations for supplementary angles", "互补的角的方程"),
      explanation: t(
        "Supplementary angles add up to $180^\\circ$. When their measures are given as expressions, set the sum of the expressions equal to $180$, solve for the variable, and substitute it back to find each angle.\n\nIf $\\angle P$ and $\\angle Q$ are supplementary with $m\\angle P = (4x - 6)^\\circ$ and $m\\angle Q = (2x + 6)^\\circ$, then\n\n$$(4x - 6) + (2x + 6) = 180 \\;\\Rightarrow\\; 6x = 180 \\;\\Rightarrow\\; x = 30,$$\n\nand $m\\angle P = 4 \\cdot 30 - 6 = 114^\\circ$.",
        "互补的两个角之和是 $180^\\circ$。当角的度数用式子表示时，令两个式子之和等于 $180$，解出未知数，再代回去求出每个角。\n\n若 $\\angle P$ 与 $\\angle Q$ 互补，$m\\angle P = (4x - 6)^\\circ$，$m\\angle Q = (2x + 6)^\\circ$，则\n\n$$(4x - 6) + (2x + 6) = 180 \\;\\Rightarrow\\; 6x = 180 \\;\\Rightarrow\\; x = 30,$$\n\n$m\\angle P = 4 \\cdot 30 - 6 = 114^\\circ$。",
      ),
      generate: (rng) => pairAlgebraProblem(rng, supplementary),
    },
    {
      id: "an-angle-and-its-supplement",
      title: t("An angle and its supplement", "一个角与它的补角"),
      explanation: t(
        "Call the supplement $x$ and write the angle in terms of $x$. If an angle is $3$ times its supplement, then $x + 3x = 180$, so $x = 45$ and the angle is $135^\\circ$. If an angle is $40^\\circ$ less than its supplement, then $x + (x - 40) = 180$, so $x = 110$ and the angle is $70^\\circ$.",
        "设补角为 $x$，用 $x$ 表示这个角。若一个角是它的补角的 $3$ 倍，则 $x + 3x = 180$，$x = 45$，这个角是 $135^\\circ$。若一个角比它的补角小 $40^\\circ$，则 $x + (x - 40) = 180$，$x = 110$，这个角是 $70^\\circ$。",
      ),
      generate: (rng) => pairWordProblem(rng, supplementary),
    },
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
export const angleBisectors = topic(
  "angle-bisectors",
  t("Angle Bisectors", "角平分线"),
  t(
    "A ray that bisects an angle splits it into two congruent angles, each half of the whole. If BD bisects ∠ABC, then m∠ABD = m∠DBC and m∠ABC = 2 · m∠ABD.",
    "平分一个角的射线把它分成两个全等的角，每个都是原角的一半。若 BD 平分 ∠ABC，则 m∠ABD = m∠DBC，m∠ABC = 2 · m∠ABD。",
  ),
  ["congruent-angles"],
  ["7.G.B.5", "HSG.CO.D.12"],
  [
    {
      id: "halves-and-wholes",
      figure: gradeDrawings3["angle-bisectors#halves-and-wholes"],
      title: t("Halves and wholes", "一半与整体"),
      explanation: t(
        "If $\\overrightarrow{BD}$ bisects $\\angle ABC$ and $m\\angle ABC = 84^\\circ$, then each half is $84 \\div 2 = 42^\\circ$. If instead $m\\angle DBC = 42^\\circ$ is given, the whole angle is $2 \\cdot 42 = 84^\\circ$.",
        "若 $\\overrightarrow{BD}$ 平分 $\\angle ABC$，$m\\angle ABC = 84^\\circ$，则每一半是 $84 \\div 2 = 42^\\circ$。若已知 $m\\angle DBC = 42^\\circ$，则整个角是 $2 \\cdot 42 = 84^\\circ$。",
      ),
      generate(rng) {
        const half = rng.int(12, 85);
        const whole = 2 * half;
        const start = rng.pick([0, 10, 20, 180 - whole]);
        const fromWhole = rng.bool();
        const part = rng.pick(["ABD", "DBC"]);
        return {
          ...numberProblem({
            prompt: fromWhole
              ? t(
                  `$${ray("BD")}$ bisects $${angleName("ABC")}$, and $${measure("ABC")} = ${degTex(whole)}$. Find $${measure(part)}$.`,
                  `$${ray("BD")}$ 平分 $${angleName("ABC")}$，$${measure("ABC")} = ${degTex(whole)}$。求 $${measure(part)}$。`,
                )
              : t(
                  `$${ray("BD")}$ bisects $${angleName("ABC")}$, and $${measure(part)} = ${degTex(half)}$. Find $${measure("ABC")}$.`,
                  `$${ray("BD")}$ 平分 $${angleName("ABC")}$，$${measure(part)} = ${degTex(half)}$。求 $${measure("ABC")}$。`,
                ),
            answer: fromWhole ? half : whole,
            form: "integer",
            unit: "°",
            wrong: fromWhole ? [whole, 2 * whole, 180 - whole] : [half, 180 - half, 90 - half].filter((w) => w > 0),
            solution: fromWhole
              ? t(
                  `The bisector splits $${angleName("ABC")}$ into two congruent halves:${steps(`${measure(part)} = ${whole} \\div 2 = ${degTex(half)}`)}`,
                  `角平分线把 $${angleName("ABC")}$ 分成两个全等的部分：${steps(`${measure(part)} = ${whole} \\div 2 = ${degTex(half)}`)}`,
                )
              : t(
                  `$${measure(part)}$ is half of $${measure("ABC")}$:${steps(`${measure("ABC")} = 2 \\cdot ${half} = ${degTex(whole)}`)}`,
                  `$${measure(part)}$ 是 $${measure("ABC")}$ 的一半：${steps(`${measure("ABC")} = 2 \\cdot ${half} = ${degTex(whole)}`)}`,
                ),
          }),
          figure: fig(
            bisectedAngle(start, whole),
            "Angle ABC with ray BD splitting it into two equal angles.",
            "射线 BD 把角 ABC 分成两个相等的角。",
          ),
        };
      },
    },
    {
      id: "bisectors-with-algebra",
      title: t("Bisectors with algebra", "用方程解角平分线问题"),
      explanation: t(
        "Write an equation from the bisector. If $m\\angle ABD = (2x + 5)^\\circ$ and $m\\angle DBC = (4x - 15)^\\circ$, the halves are equal: $2x + 5 = 4x - 15$, so $x = 10$. If $m\\angle ABC = (6x + 4)^\\circ$ and $m\\angle ABD = (2x + 12)^\\circ$, the whole is twice the half: $6x + 4 = 2(2x + 12)$, so $x = 10$.",
        "由角平分线列方程。若 $m\\angle ABD = (2x + 5)^\\circ$，$m\\angle DBC = (4x - 15)^\\circ$，两半相等：$2x + 5 = 4x - 15$，所以 $x = 10$。若 $m\\angle ABC = (6x + 4)^\\circ$，$m\\angle ABD = (2x + 12)^\\circ$，整个角是一半的两倍：$6x + 4 = 2(2x + 12)$，所以 $x = 10$。",
      ),
      keyPrerequisites: ["congruent-angles"],
      generate(rng) {
        const x = rng.int(3, 15);
        const half = rng.int(15, 80);
        const whole = 2 * half;
        const askX = rng.bool();
        if (rng.bool()) {
          const e1 = expressionFor(rng, half, x);
          const e2 = expressionFor(rng, half, x, [e1[0]]);
          const solve = steps(...equalSteps(e1, e2));
          return numberProblem({
            prompt: t(
              `$${ray("BD")}$ bisects $${angleName("ABC")}$, $${measure("ABD")} = ${angleTex(...e1)}$ and $${measure("DBC")} = ${angleTex(...e2)}$. ${askX ? "Find $x$." : `Find $${measure("ABC")}$.`}`,
              `$${ray("BD")}$ 平分 $${angleName("ABC")}$，$${measure("ABD")} = ${angleTex(...e1)}$，$${measure("DBC")} = ${angleTex(...e2)}$。${askX ? "求 $x$。" : `求 $${measure("ABC")}$。`}`,
            ),
            answer: askX ? x : whole,
            ...(askX ? {} : { unit: "°" }),
            wrong: askX ? equalWrong(e1, e2) : [half, x, 4 * half],
            solution: t(
              `The two halves are congruent:${solve}${askX ? "" : `So $${measure("ABD")} = ${subst(e1, x)} = ${degTex(half)}$ and $${measure("ABC")} = 2 \\cdot ${half} = ${degTex(whole)}$.`}`,
              `两半全等：${solve}${askX ? "" : `所以 $${measure("ABD")} = ${subst(e1, x)} = ${degTex(half)}$，$${measure("ABC")} = 2 \\cdot ${half} = ${degTex(whole)}$。`}`,
            ),
          });
        }
        const eh = expressionFor(rng, half, x);
        const ew = expressionFor(rng, whole, x, [2 * eh[0]]);
        const doubled: Linear = [2 * eh[0], 2 * eh[1]];
        const solve = steps(`${linear(...ew)} = 2(${linear(...eh)})`, ...equalSteps(ew, doubled));
        return numberProblem({
          prompt: t(
            `$${ray("BD")}$ bisects $${angleName("ABC")}$, $${measure("ABC")} = ${angleTex(...ew)}$ and $${measure("ABD")} = ${angleTex(...eh)}$. ${askX ? "Find $x$." : `Find $${measure("ABD")}$.`}`,
            `$${ray("BD")}$ 平分 $${angleName("ABC")}$，$${measure("ABC")} = ${angleTex(...ew)}$，$${measure("ABD")} = ${angleTex(...eh)}$。${askX ? "求 $x$。" : `求 $${measure("ABD")}$。`}`,
          ),
          answer: askX ? x : half,
          ...(askX ? {} : { unit: "°" }),
          // Setting the whole equal to the half, or to half of the half, are the usual slips.
          wrong: askX
            ? [...(ew[0] !== eh[0] ? [Q.of(eh[1] - ew[1], ew[0] - eh[0])] : []), Q.of(2 * eh[1] - ew[1], ew[0] - 2 * eh[0]).neg()]
            : [whole, x, Math.floor(half / 2)],
          solution: t(
            `The whole angle is twice each half:${solve}${askX ? "" : `So $${measure("ABD")} = ${subst(eh, x)} = ${degTex(half)}$.`}`,
            `整个角是每一半的两倍：${solve}${askX ? "" : `所以 $${measure("ABD")} = ${subst(eh, x)} = ${degTex(half)}$。`}`,
          ),
        });
      },
    },
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
export const solvingProblemsWithAngles = topic(
  "solving-problems-with-angles",
  t("Solving Problems With Angles", "解角的问题"),
  t(
    "Angles that fill a straight line add up to 180°, and angles that fill the space around a point add up to 360°. In harder figures, chain several facts together: right angles, complements, supplements and vertical angles.",
    "合起来组成一条直线的角之和为 180°，合起来围成一周的角之和为 360°。在较复杂的图中，要把几个事实连起来用：直角、余角、补角和对顶角。",
  ),
  ["supplementary-angles", "complementary-angles", "vertical-angles"],
  ["7.G.B.5"],
  [
    {
      id: "angles-on-a-line-and-around-a-point",
      figure: gradeDrawings3["solving-problems-with-angles#angles-on-a-line-and-around-a-point"],
      title: t("Angles on a line and around a point", "直线上与一点周围的角"),
      explanation: t(
        "Rays from a point on a line split the straight angle: if the parts are $40^\\circ$, $x^\\circ$ and $65^\\circ$, then $x = 180 - 40 - 65 = 75$. Rays from a point split the full turn: if the angles are $90^\\circ$, $120^\\circ$, $85^\\circ$ and $x^\\circ$, then $x = 360 - 90 - 120 - 85 = 65$.",
        "从直线上一点引出的射线把平角分成几部分：若各部分为 $40^\\circ$、$x^\\circ$、$65^\\circ$，则 $x = 180 - 40 - 65 = 75$。从一点引出的射线把周角分成几部分：若各角为 $90^\\circ$、$120^\\circ$、$85^\\circ$、$x^\\circ$，则 $x = 360 - 90 - 120 - 85 = 65$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          let a: number;
          let b: number;
          do {
            a = rng.int(20, 100);
            b = rng.int(20, 100);
          } while (180 - a - b < 20);
          const x = 180 - a - b;
          return {
            ...numberProblem({
              prompt: t("Points $A$, $O$ and $B$ lie on a line. Find $x$.", "点 $A$、$O$、$B$ 在同一条直线上。求 $x$。"),
              answer: x,
              form: "integer",
              wrong: [360 - a - b, 90 - a - b, a + b].filter((w) => w > 0 && w !== x),
              solution: t(
                `The three angles fill the straight angle at $O$, so they add up to $${degTex(180)}$:${steps(`${a} + x + ${b} = 180`, `x = 180 - ${a + b} = ${x}`)}`,
                `三个角合起来是 $O$ 处的平角，和为 $${degTex(180)}$：${steps(`${a} + x + ${b} = 180`, `x = 180 - ${a + b} = ${x}`)}`,
              ),
            }),
            figure: fig(
              raysFromLine(a, b, [deg(a), "x°", deg(b)]),
              `Line AB with rays OC and OD above it. Angle AOC is ${a}°, angle COD is x° and angle DOB is ${b}°.`,
              `直线 AB 上方有射线 OC、OD。角 AOC 为 ${a}°，角 COD 为 x°，角 DOB 为 ${b}°。`,
            ),
          };
        }
        let parts: number[];
        do parts = [rng.int(40, 130), rng.int(40, 130), rng.int(40, 130)];
        while (360 - parts[0]! - parts[1]! - parts[2]! < 35 || 360 - parts[0]! - parts[1]! - parts[2]! > 150);
        const x = 360 - parts[0]! - parts[1]! - parts[2]!;
        const start = rng.int(0, 60);
        const dirs = [start, start + parts[0]!, start + parts[0]! + parts[1]!, start + parts[0]! + parts[1]! + parts[2]!];
        const sum = parts[0]! + parts[1]! + parts[2]!;
        return {
          ...numberProblem({
            prompt: t("Four rays start at the same point. Find $x$.", "四条射线从同一点出发。求 $x$。"),
            answer: x,
            form: "integer",
            wrong: [sum, 360 - parts[0]! - parts[1]!, 180 - x].filter((w) => w > 0 && w !== x),
            solution: t(
              `The four angles fill the full turn around the point, so they add up to $${degTex(360)}$:${steps(`${parts.join(" + ")} + x = 360`, `x = 360 - ${sum} = ${x}`)}`,
              `四个角合起来是一个周角，和为 $${degTex(360)}$：${steps(`${parts.join(" + ")} + x = 360`, `x = 360 - ${sum} = ${x}`)}`,
            ),
          }),
          figure: fig(
            raysAroundPoint(dirs, [...parts.map(deg), "x°"]),
            `Four rays from one point, making angles of ${parts.join("°, ")}° and x°.`,
            `从一点出发的四条射线，构成 ${parts.join("°、")}° 和 x° 的角。`,
          ),
        };
      },
    },
    {
      id: "chaining-angle-relationships",
      figure: gradeDrawings3["solving-problems-with-angles#chaining-angle-relationships"],
      title: t("Chaining angle relationships", "连用多个角的关系"),
      explanation: t(
        "Lines $AB$ and $CD$ cross at $O$, and $\\overrightarrow{OE} \\perp \\overline{AB}$. If $m\\angle COE = 30^\\circ$, then $\\angle AOC$ is the rest of the right angle $\\angle AOE$: $90 - 30 = 60^\\circ$. Its vertical angle $\\angle BOD$ is also $60^\\circ$, and $\\angle AOD$, its supplement along line $CD$, is $180 - 60 = 120^\\circ$.",
        "直线 $AB$ 与 $CD$ 相交于 $O$，$\\overrightarrow{OE} \\perp \\overline{AB}$。若 $m\\angle COE = 30^\\circ$，则 $\\angle AOC$ 是直角 $\\angle AOE$ 剩下的部分：$90 - 30 = 60^\\circ$。它的对顶角 $\\angle BOD$ 也是 $60^\\circ$；$\\angle AOD$ 与它在直线 $CD$ 上互补，是 $180 - 60 = 120^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(12, 78);
        const ask = rng.pick(["AOC", "BOD", "AOD", "BOC"] as const);
        const small = 90 - a;
        const answer = ask === "AOC" || ask === "BOD" ? small : 90 + a;
        const sol: Record<typeof ask, Text> = {
          AOC: t(
            `$\\angle AOE$ is a right angle, and $\\angle COE$ is part of it:${steps(`${measure("AOC")} = 90 - ${a} = ${degTex(small)}`)}`,
            `$\\angle AOE$ 是直角，$\\angle COE$ 是它的一部分：${steps(`${measure("AOC")} = 90 - ${a} = ${degTex(small)}`)}`,
          ),
          BOD: t(
            `First, $\\angle AOC$ is the rest of the right angle $\\angle AOE$: $${measure("AOC")} = 90 - ${a} = ${degTex(small)}$. Then $\\angle BOD$ and $\\angle AOC$ are vertical angles, so $${measure("BOD")} = ${degTex(small)}$.`,
            `先求 $\\angle AOC$，它是直角 $\\angle AOE$ 剩下的部分：$${measure("AOC")} = 90 - ${a} = ${degTex(small)}$。$\\angle BOD$ 与 $\\angle AOC$ 是对顶角，所以 $${measure("BOD")} = ${degTex(small)}$。`,
          ),
          AOD: t(
            `First, $${measure("AOC")} = 90 - ${a} = ${degTex(small)}$, the rest of the right angle $\\angle AOE$. Then $\\angle AOC$ and $\\angle AOD$ form a straight angle along line $CD$:${steps(`${measure("AOD")} = 180 - ${small} = ${degTex(answer)}`)}`,
            `先求 $${measure("AOC")} = 90 - ${a} = ${degTex(small)}$，它是直角 $\\angle AOE$ 剩下的部分。$\\angle AOC$ 与 $\\angle AOD$ 在直线 $CD$ 上组成平角：${steps(`${measure("AOD")} = 180 - ${small} = ${degTex(answer)}`)}`,
          ),
          BOC: t(
            `$\\angle BOC$ is made of the right angle $\\angle BOE$ and $\\angle EOC$:${steps(`${measure("BOC")} = 90 + ${a} = ${degTex(answer)}`)}`,
            `$\\angle BOC$ 由直角 $\\angle BOE$ 和 $\\angle EOC$ 组成：${steps(`${measure("BOC")} = 90 + ${a} = ${degTex(answer)}`)}`,
          ),
        };
        return {
          ...numberProblem({
            prompt: t(
              `Lines $AB$ and $CD$ cross at $O$, and $${ray("OE")} \\perp \\overline{AB}$. Find $${measure(ask)}$.`,
              `直线 $AB$ 与 $CD$ 相交于 $O$，$${ray("OE")} \\perp \\overline{AB}$。求 $${measure(ask)}$。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            wrong: [answer === small ? 90 + a : small, a, 180 - a],
            solution: sol[ask],
          }),
          figure: fig(
            crossWithPerpendicular(a),
            `Lines AB and CD cross at O. Ray OE is perpendicular to AB, and angle COE is ${a}°.`,
            `直线 AB 与 CD 相交于 O。射线 OE 垂直于 AB，角 COE 为 ${a}°。`,
          ),
        };
      },
    },
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
export const heightsOfTriangles = topic(
  "heights-of-triangles",
  t("Heights of Triangles", "三角形的高"),
  t(
    "A height of a triangle is the perpendicular segment from a vertex to the line containing the opposite side, which is then called the base. Every triangle has three heights, one for each choice of base; in an obtuse triangle two of them fall outside the triangle.",
    "三角形的高是从一个顶点到对边所在直线的垂线段，这条对边叫作底。每个三角形有三条高，每选一条边作底就有一条；钝角三角形有两条高落在三角形外。",
  ),
  ["classifying-triangles", "polygons-in-the-coordinate-plane"],
  ["6.G.A.1", "7.G.A.2"],
  [
    {
      id: "recognizing-a-height",
      figure: gradeDrawings3["heights-of-triangles#recognizing-a-height"],
      title: t("Recognizing a height", "认出三角形的高"),
      explanation: t(
        "The height to base $\\overline{BC}$ starts at the opposite vertex $A$ and meets the line through $B$ and $C$ at a right angle. It is usually not a side and usually does not go to the midpoint of $\\overline{BC}$.\n\nIf the angle at $B$ or $C$ is obtuse, the height falls outside the triangle: extend $\\overline{BC}$ and drop the perpendicular from $A$ to the extension.",
        "底边 $\\overline{BC}$ 上的高从对面的顶点 $A$ 出发，与经过 $B$、$C$ 的直线成直角。它一般不是三角形的边，也一般不经过 $\\overline{BC}$ 的中点。\n\n若 $B$ 或 $C$ 处的角是钝角，高落在三角形外：延长 $\\overline{BC}$，从 $A$ 向延长线作垂线。",
      ),
      generate(rng) {
        const obtuse = rng.bool();
        const ax = obtuse ? rng.pick([-3, -2, 10, 11]) : rng.pick([1.5, 2, 2.5, 5.5, 6, 6.5]);
        const h = rng.pick([4, 5, 6]);
        const at = ax < 0 ? "B" : "C";
        const [foot, mid] = rng.sample(["D", "E", "H", "M", "N", "P"], 2) as [string, string];
        return pickChoice(
          rng,
          t(
            "Which segment is the height of $\\triangle ABC$ to the base $\\overline{BC}$?",
            "哪条线段是 $\\triangle ABC$ 底边 $\\overline{BC}$ 上的高？",
          ),
          mathText(over(`A${foot}`)),
          [`A${mid}`, "AB", "AC"].map((s) => mathText(over(s))),
          t(
            `A height goes from the opposite vertex to the line containing the base and meets it at a right angle. $${over(`A${foot}`)}$ meets line $BC$ at a right angle at $${foot}$, so it is the height. $${over(`A${mid}`)}$ goes to the midpoint of $${over("BC")}$ but is not perpendicular to it, and $${over("AB")}$ and $${over("AC")}$ are sides.${obtuse ? ` Because the angle at $${at}$ is obtuse, the foot $${foot}$ lies outside the triangle, on the base extended.` : ""}`,
            `高从底边所对的顶点出发，与底边所在的直线成直角。$${over(`A${foot}`)}$ 在 $${foot}$ 处与直线 $BC$ 垂直，所以它是高。$${over(`A${mid}`)}$ 连到 $${over("BC")}$ 的中点，但不与它垂直；$${over("AB")}$ 和 $${over("AC")}$ 是三角形的边。${obtuse ? `因为 $${at}$ 处的角是钝角，垂足 $${foot}$ 在三角形外，落在底边的延长线上。` : ""}`,
          ),
          fig(
            heightOrMedian(ax, h, foot, mid),
            `Triangle ABC on base BC. A${foot} is perpendicular to line BC at ${foot}${obtuse ? ", outside the triangle" : ""}, and A${mid} goes to the midpoint ${mid} of BC.`,
            `底边为 BC 的三角形 ABC。A${foot} 在 ${foot} 处垂直于直线 BC${obtuse ? `，${foot} 在三角形外` : ""}，A${mid} 连到 BC 的中点 ${mid}。`,
          ),
        );
      },
    },
    {
      id: "heights-for-each-base",
      title: t("A height for each base", "每条底边上的高"),
      explanation: t(
        "Any side can be the base. Each choice of base has its own height, from the opposite vertex: the height to $\\overline{BC}$ comes from $A$, the height to $\\overline{CA}$ from $B$, and the height to $\\overline{AB}$ from $C$. Find the vertex that is not on the base, then the segment from it that is perpendicular to the base.",
        "任何一条边都可以作底。每选一条底边就有一条高，从对面的顶点出发：$\\overline{BC}$ 上的高从 $A$ 出发，$\\overline{CA}$ 上的高从 $B$ 出发，$\\overline{AB}$ 上的高从 $C$ 出发。先找出不在底边上的顶点，再找从它出发、与底边垂直的线段。",
      ),
      generate(rng) {
        const [base, apex, answer] = rng.pick([
          ["BC", "A", "AD"],
          ["AC", "B", "BE"],
          ["AB", "C", "CF"],
        ] as const);
        const others = ["AD", "BE", "CF"].filter((s) => s !== answer);
        return pickChoice(
          rng,
          t(
            `$${over("AD")}$, $${over("BE")}$ and $${over("CF")}$ are the heights of $\\triangle ABC$. Which one is the height to the base $${over(base)}$?`,
            `$${over("AD")}$、$${over("BE")}$、$${over("CF")}$ 是 $\\triangle ABC$ 的高。哪一条是底边 $${over(base)}$ 上的高？`,
          ),
          mathText(over(answer)),
          [...others.map((s) => mathText(over(s))), mathText(over(`${apex}${base[0]}`))],
          t(
            `The height to $${over(base)}$ starts at the vertex not on that base, $${apex}$, and is perpendicular to $${over(base)}$. That is $${over(answer)}$.`,
            `$${over(base)}$ 上的高从不在这条底边上的顶点 $${apex}$ 出发，并与 $${over(base)}$ 垂直，所以是 $${over(answer)}$。`,
          ),
          fig(
            threeHeights(rng),
            "Triangle ABC with heights AD to BC, BE to CA and CF to AB.",
            "三角形 ABC 及其三条高：AD 垂直于 BC，BE 垂直于 CA，CF 垂直于 AB。",
          ),
        );
      },
    },
    {
      id: "heights-in-the-coordinate-plane",
      figure: gradeDrawings3["heights-of-triangles#heights-in-the-coordinate-plane"],
      title: t("Heights in the coordinate plane", "坐标平面中的高"),
      explanation: t(
        "When the base is horizontal, the height is vertical, so its length is the difference of the $y$-coordinates of the opposite vertex and the base. For $A(1, 2)$, $B(7, 2)$ and $C(9, 6)$, the height to $\\overline{AB}$ is $6 - 2 = 4$. It does not matter that $C$ is not above $\\overline{AB}$: the height falls outside the triangle.\n\nWhen the base is vertical, the height is horizontal and is the difference of the $x$-coordinates.",
        "底边水平时，高是竖直的，它的长等于对面顶点与底边的 $y$ 坐标之差。对于 $A(1, 2)$、$B(7, 2)$、$C(9, 6)$，$\\overline{AB}$ 上的高是 $6 - 2 = 4$。$C$ 不在 $\\overline{AB}$ 的正上方也没关系：这时高落在三角形外。\n\n底边竖直时，高是水平的，它的长等于 $x$ 坐标之差。",
      ),
      keyPrerequisites: ["polygons-in-the-coordinate-plane"],
      generate(rng) {
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
        const diff = `|${y3} - ${y0 < 0 ? `(${y0})` : y0}|`;
        return numberProblem({
          prompt: t(
            `$\\triangle ABC$ has vertices $A${pt(x1, y0)}$, $B${pt(x2, y0)}$ and $C${pt(x3, y3)}$. What is the height of the triangle to the base $${over("AB")}$?`,
            `$\\triangle ABC$ 的顶点是 $A${pt(x1, y0)}$、$B${pt(x2, y0)}$、$C${pt(x3, y3)}$。三角形底边 $${over("AB")}$ 上的高是多少？`,
          ),
          answer: h,
          form: "integer",
          wrong: [x2 - x1, Math.abs(x3 - x1), Math.abs(y3)].filter((w) => w !== h && w > 0),
          solution: t(
            `$A$ and $B$ have the same $${coord}$-coordinate, $${y0}$, so $${over("AB")}$ is ${vertical ? "vertical" : "horizontal"} and the height from $C$ is ${vertical ? "horizontal" : "vertical"}. Its length is the difference of the $${coord}$-coordinates:${steps(`${diff} = ${h}`)}`,
            `$A$ 与 $B$ 的 $${coord}$ 坐标相同，都是 $${y0}$，所以 $${over("AB")}$ 是${vertical ? "竖直" : "水平"}的，从 $C$ 出发的高是${vertical ? "水平" : "竖直"}的。它的长是 $${coord}$ 坐标之差：${steps(`${diff} = ${h}`)}`,
          ),
        });
      },
    },
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

/** propertiesOfRectanglesAndSquares uses the right angles and the diagonals of rectangles and squares. */
export const propertiesOfRectanglesAndSquares = topic(
  "properties-of-rectangles-and-squares",
  t("Properties of Rectangles and Squares", "长方形和正方形的性质"),
  t(
    "A rectangle has four right angles, and its diagonals are congruent and bisect each other, so they cut into four equal parts. A square is a rectangle with four equal sides; its diagonals are also perpendicular and split each corner into two 45° angles.",
    "长方形有四个直角，两条对角线相等且互相平分，所以被分成相等的四段。正方形是四条边都相等的长方形；它的对角线还互相垂直，并把每个角分成两个 45° 的角。",
  ),
  ["classifying-quadrilaterals", "angles-of-a-triangle"],
  ["7.G.A.2", "HSG.CO.C.11"],
  [
    {
      id: "diagonals-of-rectangles",
      figure: gradeDrawings3["properties-of-rectangles-and-squares#diagonals-of-rectangles"],
      title: t("Diagonals of rectangles", "长方形的对角线"),
      explanation: t(
        "In rectangle $ABCD$ with diagonals meeting at $E$, the diagonals are congruent and bisect each other, so\n\n$$AE = BE = CE = DE \\quad\\text{and}\\quad AC = BD = 2 \\cdot AE.$$\n\nIf $AE = 2x + 3$ and $DE = 4x - 7$, then $2x + 3 = 4x - 7$, so $x = 5$ and $AE = 13$. If instead $AC = 5x + 2$ and $BE = 2x + 4$, then $5x + 2 = 2(2x + 4)$, so $x = 6$.",
        "在对角线交于 $E$ 的长方形 $ABCD$ 中，两条对角线相等且互相平分，所以\n\n$$AE = BE = CE = DE \\quad\\text{且}\\quad AC = BD = 2 \\cdot AE.$$\n\n若 $AE = 2x + 3$，$DE = 4x - 7$，则 $2x + 3 = 4x - 7$，$x = 5$，$AE = 13$。若 $AC = 5x + 2$，$BE = 2x + 4$，则 $5x + 2 = 2(2x + 4)$，$x = 6$。",
      ),
      generate(rng) {
        const c = rng.pick(diagonalCases);
        const x = rng.int(2, 12);
        const half = rng.int(5, 30);
        const u = pickUnit(rng);
        const askX = rng.bool();
        const pic = fig(
          rectangleWithDiagonals(8, 5),
          "Rectangle ABCD with diagonals AC and BD meeting at E.",
          "长方形 ABCD 的对角线 AC 与 BD 交于 E。",
        );
        if (!c.whole) {
          const e1 = expressionFor(rng, half, x);
          const e2 = expressionFor(rng, half, x, [e1[0]]);
          return {
            ...numberProblem({
              prompt: t(
                `In rectangle $ABCD$, the diagonals meet at $E$, $${c.first} = ${linear(...e1)}$ and $${c.second} = ${linear(...e2)}$. ${askX ? "Find $x$." : `Find $${c.first}$.`}`,
                `长方形 $ABCD$ 的对角线交于 $E$，$${c.first} = ${linear(...e1)}$，$${c.second} = ${linear(...e2)}$。${askX ? "求 $x$。" : `求 $${c.first}$。`}`,
              ),
              answer: askX ? x : half,
              ...(!askX && { unit: u }),
              wrong: askX ? equalWrong(e1, e2) : [2 * half, x],
              solution: t(
                `The diagonals of a rectangle are congruent and bisect each other, so $AE = BE = CE = DE$:${steps(...equalSteps(e1, e2))}${askX ? "" : `So $${c.first} = ${subst(e1, x)} = ${half}$.`}`,
                `长方形的对角线相等且互相平分，所以 $AE = BE = CE = DE$：${steps(...equalSteps(e1, e2))}${askX ? "" : `所以 $${c.first} = ${subst(e1, x)} = ${half}$。`}`,
              ),
            }),
            figure: pic,
          };
        }
        const eh = expressionFor(rng, half, x);
        const ew = expressionFor(rng, 2 * half, x, [2 * eh[0]]);
        const doubled: Linear = [2 * eh[0], 2 * eh[1]];
        return {
          ...numberProblem({
            prompt: t(
              `In rectangle $ABCD$, the diagonals meet at $E$, $${c.first} = ${linear(...ew)}$ and $${c.second} = ${linear(...eh)}$. ${askX ? "Find $x$." : `Find $${c.first}$.`}`,
              `长方形 $ABCD$ 的对角线交于 $E$，$${c.first} = ${linear(...ew)}$，$${c.second} = ${linear(...eh)}$。${askX ? "求 $x$。" : `求 $${c.first}$。`}`,
            ),
            answer: askX ? x : 2 * half,
            ...(!askX && { unit: u }),
            // Setting the whole diagonal equal to the half is the usual slip.
            wrong: askX ? [...(ew[0] !== eh[0] ? [Q.of(eh[1] - ew[1], ew[0] - eh[0])] : []), ...equalWrong(ew, doubled)] : [half, 4 * half],
            solution: t(
              `The diagonals are congruent and bisect each other, so $${c.second}$ is half of a diagonal and $${c.first} = 2 \\cdot ${c.second}$:${steps(`${linear(...ew)} = 2(${linear(...eh)})`, ...equalSteps(ew, doubled))}${askX ? "" : `So $${c.first} = ${subst(ew, x)} = ${2 * half}$.`}`,
              `对角线相等且互相平分，所以 $${c.second}$ 是对角线的一半，$${c.first} = 2 \\cdot ${c.second}$：${steps(`${linear(...ew)} = 2(${linear(...eh)})`, ...equalSteps(ew, doubled))}${askX ? "" : `所以 $${c.first} = ${subst(ew, x)} = ${2 * half}$。`}`,
            ),
          }),
          figure: pic,
        };
      },
    },
    {
      id: "angles-in-rectangles",
      figure: gradeDrawings3["properties-of-rectangles-and-squares#angles-in-rectangles"],
      title: t("Angles in rectangles", "长方形中的角"),
      explanation: t(
        "Each corner of a rectangle is $90^\\circ$, and a diagonal cuts the rectangle into two right triangles. If diagonal $\\overline{AC}$ makes $m\\angle BAC = 35^\\circ$, then\n\n- $m\\angle CAD = 90 - 35 = 55^\\circ$, the rest of the corner at $A$;\n- $m\\angle BCA = 180 - 90 - 35 = 55^\\circ$, from the angles of $\\triangle ABC$;\n- $m\\angle ACD = 90 - 55 = 35^\\circ$, the rest of the corner at $C$.",
        "长方形的每个角都是 $90^\\circ$，一条对角线把它分成两个直角三角形。若对角线 $\\overline{AC}$ 使 $m\\angle BAC = 35^\\circ$，则\n\n- $m\\angle CAD = 90 - 35 = 55^\\circ$，是 $A$ 处直角剩下的部分；\n- $m\\angle BCA = 180 - 90 - 35 = 55^\\circ$，由 $\\triangle ABC$ 的内角和得出；\n- $m\\angle ACD = 90 - 55 = 35^\\circ$，是 $C$ 处直角剩下的部分。",
      ),
      generate(rng) {
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
        const sol: Record<typeof ask, Text> = {
          CAD: t(
            `The corner at $A$ is a right angle, and $\\angle BAC$ is part of it:${steps(`${measure("CAD")} = 90 - ${a} = ${degTex(rest)}`)}`,
            `$A$ 处是直角，$\\angle BAC$ 是它的一部分：${steps(`${measure("CAD")} = 90 - ${a} = ${degTex(rest)}`)}`,
          ),
          BCA: t(
            `In $\\triangle ABC$, $\\angle B$ is a right angle, and the angles of a triangle add up to $${degTex(180)}$:${steps(`${measure("BCA")} = 180 - 90 - ${a} = ${degTex(rest)}`)}`,
            `在 $\\triangle ABC$ 中，$\\angle B$ 是直角，三角形的内角和为 $${degTex(180)}$：${steps(`${measure("BCA")} = 180 - 90 - ${a} = ${degTex(rest)}`)}`,
          ),
          ACD: t(
            `In $\\triangle ABC$, $${measure("BCA")} = 180 - 90 - ${a} = ${degTex(rest)}$. The corner at $C$ is a right angle, so${steps(`${measure("ACD")} = 90 - ${rest} = ${degTex(a)}`)}`,
            `在 $\\triangle ABC$ 中，$${measure("BCA")} = 180 - 90 - ${a} = ${degTex(rest)}$。$C$ 处是直角，所以${steps(`${measure("ACD")} = 90 - ${rest} = ${degTex(a)}`)}`,
          ),
        };
        const pts = rectangle(l, w);
        return {
          ...numberProblem({
            prompt: t(`$ABCD$ is a rectangle. Find $${measure(ask)}$.`, `$ABCD$ 是长方形。求 $${measure(ask)}$。`),
            answer,
            form: "integer",
            unit: "°",
            wrong: [answer === a ? rest : a, 180 - a, 180 - 2 * a].filter((w) => w > 0 && w !== answer),
            solution: sol[ask],
          }),
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
        };
      },
    },
    {
      id: "diagonals-of-squares",
      figure: gradeDrawings3["properties-of-rectangles-and-squares#diagonals-of-squares"],
      title: t("Diagonals of squares", "正方形的对角线"),
      explanation: t(
        "In square $ABCD$ with diagonals meeting at $E$:\n\n- the four segments $AE$, $BE$, $CE$ and $DE$ are equal, as in any rectangle;\n- the diagonals are perpendicular, so $m\\angle AEB = 90^\\circ$;\n- each diagonal splits a corner in half, so $m\\angle BAC = 45^\\circ$.\n\nIf $m\\angle ABD = (3x + 6)^\\circ$, then $3x + 6 = 45$ and $x = 13$.",
        "在对角线交于 $E$ 的正方形 $ABCD$ 中：\n\n- 和所有长方形一样，$AE$、$BE$、$CE$、$DE$ 四段相等；\n- 两条对角线互相垂直，所以 $m\\angle AEB = 90^\\circ$；\n- 每条对角线把一个角平分，所以 $m\\angle BAC = 45^\\circ$。\n\n若 $m\\angle ABD = (3x + 6)^\\circ$，则 $3x + 6 = 45$，$x = 13$。",
      ),
      generate(rng) {
        const x = rng.int(3, 14);
        const pic = fig(
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
          return {
            ...numberProblem({
              prompt: t(
                `In square $ABCD$, the diagonals meet at $E$, $${p} = ${linear(...e1)}$ and $${q} = ${linear(...e2)}$. Find $x$.`,
                `正方形 $ABCD$ 的对角线交于 $E$，$${p} = ${linear(...e1)}$，$${q} = ${linear(...e2)}$。求 $x$。`,
              ),
              answer: x,
              wrong: equalWrong(e1, e2),
              solution: t(
                `The diagonals of a square are congruent and bisect each other, so $${p} = ${q}$:${steps(...equalSteps(e1, e2))}`,
                `正方形的对角线相等且互相平分，所以 $${p} = ${q}$：${steps(...equalSteps(e1, e2))}`,
              ),
            }),
            figure: pic,
          };
        }
        const total = kind === "corner" ? 45 : 90;
        const name = kind === "corner" ? rng.pick(["BAC", "ABD", "CDB", "DCA"]) : rng.pick(["AEB", "BEC", "CED", "AED"]);
        const e = expressionFor(rng, total, x);
        const why =
          kind === "corner"
            ? t("each diagonal of a square splits a right-angle corner in half", "正方形的每条对角线把直角平分")
            : t("the diagonals of a square are perpendicular", "正方形的两条对角线互相垂直");
        return {
          ...numberProblem({
            prompt: t(
              `In square $ABCD$, the diagonals meet at $E$ and $${measure(name)} = ${angleTex(...e)}$. Find $x$.`,
              `正方形 $ABCD$ 的对角线交于 $E$，$${measure(name)} = ${angleTex(...e)}$。求 $x$。`,
            ),
            answer: x,
            // Using 90° for a half corner or 45° for the angle between the diagonals, and moving the constant the wrong way.
            wrong: [Q.of(135 - total - e[1], e[0]), Q.of(total + e[1], e[0])],
            solution: t(
              `$${measure(name)} = ${degTex(total)}$, because ${why.en}:${steps(`${linear(...e)} = ${total}`, `${linear(e[0], 0)} = ${total - e[1]}`, `x = ${x}`)}`,
              `因为${why["zh-CN"]}，所以 $${measure(name)} = ${degTex(total)}$：${steps(`${linear(...e)} = ${total}`, `${linear(e[0], 0)} = ${total - e[1]}`, `x = ${x}`)}`,
            ),
          }),
          figure: pic,
        };
      },
    },
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
export const propertiesOfTrapezoids = topic(
  "properties-of-trapezoids",
  t("Properties of Trapezoids", "梯形的性质"),
  t(
    "The two angles along each leg of a trapezoid add up to 180°, because the bases are parallel. An isosceles trapezoid has congruent legs, congruent base angles and congruent diagonals. The midsegment, which joins the midpoints of the legs, is the average of the bases.",
    "梯形的底互相平行，所以每条腰上的两个角之和为 180°。等腰梯形的两腰相等，同一底上的两个底角相等，两条对角线也相等。连接两腰中点的中位线等于两底的平均数。",
  ),
  ["classifying-quadrilaterals", "supplementary-angles", "equations-with-variables-on-both-sides"],
  ["7.G.A.2", "HSG.CO.C.11"],
  [
    {
      id: "angles-of-trapezoids",
      title: t("Angles of trapezoids", "梯形的角"),
      explanation: t(
        "In trapezoid $ABCD$ with $\\overline{AB} \\parallel \\overline{DC}$, the angles at the two ends of a leg are supplementary: $m\\angle A + m\\angle D = 180^\\circ$ and $m\\angle B + m\\angle C = 180^\\circ$.\n\nIn an isosceles trapezoid, the two angles on the same base are also equal: $m\\angle A = m\\angle B$ and $m\\angle C = m\\angle D$. So if $m\\angle A = 70^\\circ$, then $m\\angle B = 70^\\circ$ and $m\\angle C = m\\angle D = 110^\\circ$.",
        "在 $\\overline{AB} \\parallel \\overline{DC}$ 的梯形 $ABCD$ 中，一条腰两端的角互补：$m\\angle A + m\\angle D = 180^\\circ$，$m\\angle B + m\\angle C = 180^\\circ$。\n\n在等腰梯形中，同一底上的两个角还相等：$m\\angle A = m\\angle B$，$m\\angle C = m\\angle D$。所以若 $m\\angle A = 70^\\circ$，则 $m\\angle B = 70^\\circ$，$m\\angle C = m\\angle D = 110^\\circ$。",
      ),
      generate(rng) {
        const isosceles = rng.bool();
        const a = rng.int(48, 80);
        const b = isosceles ? a : rng.int(48, 80);
        const h = 5;
        const pts = trapezoidPoints(14, h, h / Math.tan(rad(a)), h / Math.tan(rad(b)));
        const [A, B, C, D] = [pts[0]!, pts[1]!, pts[2]!, pts[3]!];
        const fromB = !isosceles && rng.bool();
        const ask = isosceles ? rng.pick(["B", "C", "D"] as const) : fromB ? "C" : "D";
        const given = fromB ? b : a;
        const answer = ask === "B" ? a : 180 - given;
        const head = isosceles
          ? t(
              `$ABCD$ is an isosceles trapezoid with $${over("AB")} \\parallel ${over("DC")}$ and $AD = BC$.`,
              `$ABCD$ 是等腰梯形，$${over("AB")} \\parallel ${over("DC")}$，$AD = BC$。`,
            )
          : t(
              `$ABCD$ is a trapezoid with $${over("AB")} \\parallel ${over("DC")}$.`,
              `$ABCD$ 是梯形，$${over("AB")} \\parallel ${over("DC")}$。`,
            );
        const leg = t(
          `$\\angle ${fromB ? "B" : "A"}$ and $\\angle ${ask}$ are at the two ends of leg $${over(fromB ? "BC" : "AD")}$, between the parallel bases, so they are supplementary:${steps(`m\\angle ${ask} = 180 - ${given} = ${degTex(answer)}`)}`,
          `$\\angle ${fromB ? "B" : "A"}$ 与 $\\angle ${ask}$ 在腰 $${over(fromB ? "BC" : "AD")}$ 的两端、两条平行的底之间，所以互补：${steps(`m\\angle ${ask} = 180 - ${given} = ${degTex(answer)}`)}`,
        );
        const sol: Record<"B" | "C" | "D", Text> = {
          B: t(
            `In an isosceles trapezoid the two angles on the same base are equal, so $m\\angle B = m\\angle A = ${degTex(a)}$.`,
            `等腰梯形同一底上的两个角相等，所以 $m\\angle B = m\\angle A = ${degTex(a)}$。`,
          ),
          C: isosceles
            ? t(
                `The angles on the base $${over("AB")}$ are equal, so $m\\angle B = ${degTex(a)}$. Then $\\angle B$ and $\\angle C$ are at the ends of leg $${over("BC")}$, so they are supplementary:${steps(`m\\angle C = 180 - ${a} = ${degTex(answer)}`)}`,
                `底 $${over("AB")}$ 上的两个角相等，所以 $m\\angle B = ${degTex(a)}$。$\\angle B$ 与 $\\angle C$ 在腰 $${over("BC")}$ 的两端，所以互补：${steps(`m\\angle C = 180 - ${a} = ${degTex(answer)}`)}`,
              )
            : leg,
          D: leg,
        };
        return {
          ...numberProblem({
            prompt: t(
              `${head.en} If $m\\angle ${fromB ? "B" : "A"} = ${degTex(given)}$, find $m\\angle ${ask}$.`,
              `${head["zh-CN"]}若 $m\\angle ${fromB ? "B" : "A"} = ${degTex(given)}$，求 $m\\angle ${ask}$。`,
            ),
            answer,
            form: "integer",
            unit: "°",
            // Taking supplementary angles for equal ones, or the other way round, and confusing 180° with 90°.
            wrong: [ask === "B" ? 180 - a : given, 90 - given],
            solution: sol[ask],
          }),
          figure: fig(
            [
              { kind: "polygon", points: pts },
              ...parallelMarks(pts, isosceles),
              fromB ? arc(B, C, A, deg(b)) : arc(A, B, D, deg(a)),
              ...names(pts, "ABCD"),
            ],
            `${isosceles ? "Isosceles trapezoid" : "Trapezoid"} ABCD with AB parallel to DC. Angle ${fromB ? "B" : "A"} is ${given}°.`,
            `${isosceles ? "等腰梯形" : "梯形"} ABCD，AB 平行于 DC。角 ${fromB ? "B" : "A"} 为 ${given}°。`,
          ),
        };
      },
    },
    {
      id: "isosceles-trapezoids-with-algebra",
      figure: gradeDrawings3["properties-of-trapezoids#isosceles-trapezoids-with-algebra"],
      title: t("Isosceles trapezoids with algebra", "用方程解等腰梯形问题"),
      explanation: t(
        "In an isosceles trapezoid $ABCD$ with bases $\\overline{AB}$ and $\\overline{DC}$, the legs are congruent, $AD = BC$, and so are the diagonals, $AC = BD$. If $AC = 3x - 4$ and $BD = x + 10$, then $3x - 4 = x + 10$, so $x = 7$ and each diagonal is $17$.",
        "在底为 $\\overline{AB}$ 和 $\\overline{DC}$ 的等腰梯形 $ABCD$ 中，两腰相等，$AD = BC$；两条对角线也相等，$AC = BD$。若 $AC = 3x - 4$，$BD = x + 10$，则 $3x - 4 = x + 10$，$x = 7$，每条对角线长 $17$。",
      ),
      generate(rng) {
        const x = rng.int(2, 12);
        const v = rng.int(6, 30);
        const legs = rng.bool();
        const [p, q] = legs ? (["AD", "BC"] as const) : (["AC", "BD"] as const);
        const e1 = expressionFor(rng, v, x);
        const e2 = expressionFor(rng, v, x, [e1[0]]);
        const askX = rng.bool();
        const u = pickUnit(rng);
        const pts = trapezoidPoints(12, 5, 3, 3);
        const fact = legs ? t("the legs are congruent", "两腰相等") : t("the diagonals are congruent", "两条对角线相等");
        return {
          ...numberProblem({
            prompt: t(
              `$ABCD$ is an isosceles trapezoid with bases $${over("AB")}$ and $${over("DC")}$, $${p} = ${linear(...e1)}$ and $${q} = ${linear(...e2)}$. ${askX ? "Find $x$." : `Find $${p}$.`}`,
              `$ABCD$ 是等腰梯形，底为 $${over("AB")}$ 和 $${over("DC")}$，$${p} = ${linear(...e1)}$，$${q} = ${linear(...e2)}$。${askX ? "求 $x$。" : `求 $${p}$。`}`,
            ),
            answer: askX ? x : v,
            ...(!askX && { unit: u }),
            wrong: askX ? equalWrong(e1, e2) : [x, 2 * v],
            solution: t(
              `In an isosceles trapezoid ${fact.en}, so $${p} = ${q}$:${steps(...equalSteps(e1, e2))}${askX ? "" : `So $${p} = ${subst(e1, x)} = ${v}$.`}`,
              `等腰梯形${fact["zh-CN"]}，所以 $${p} = ${q}$：${steps(...equalSteps(e1, e2))}${askX ? "" : `所以 $${p} = ${subst(e1, x)} = ${v}$。`}`,
            ),
          }),
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
        };
      },
    },
    {
      id: "the-midsegment-of-a-trapezoid",
      figure: gradeDrawings3["properties-of-trapezoids#the-midsegment-of-a-trapezoid"],
      title: t("The midsegment of a trapezoid", "梯形的中位线"),
      explanation: t(
        "The **midsegment** of a trapezoid joins the midpoints of its legs. It is parallel to the bases, and its length is their average:\n\n$$m = \\frac{b_1 + b_2}{2}.$$\n\nWith bases $10$ and $16$, the midsegment is $\\frac{10 + 16}{2} = 13$. With one base $10$ and midsegment $13$, the other base is $2 \\cdot 13 - 10 = 16$.",
        "梯形的**中位线**连接两腰的中点。它平行于两底，长度是两底的平均数：\n\n$$m = \\frac{b_1 + b_2}{2}.$$\n\n两底为 $10$ 和 $16$ 时，中位线是 $\\frac{10 + 16}{2} = 13$。一底为 $10$、中位线为 $13$ 时，另一底是 $2 \\cdot 13 - 10 = 16$。",
      ),
      generate(rng) {
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
        return {
          ...numberProblem({
            prompt: t(
              `$${over("PR")}$ is the midsegment of trapezoid $ABCD$. Find ${ask === "mid" ? "$PR$" : ask === "short" ? "$DC$" : "$AB$"}.`,
              `$${over("PR")}$ 是梯形 $ABCD$ 的中位线。求 ${ask === "mid" ? "$PR$" : ask === "short" ? "$DC$" : "$AB$"}。`,
            ),
            answer,
            form: "integer",
            unit: u,
            wrong:
              ask === "mid"
                ? [long + short, (long - short) / 2]
                : [Math.abs(m - known), (m + known) / 2].filter((w) => Number.isInteger(w) && w > 0 && w !== answer),
            solution:
              ask === "mid"
                ? t(
                    `The midsegment is the average of the bases:${steps(`PR = \\frac{${long} + ${short}}{2} = \\frac{${long + short}}{2} = ${lenTex(m, u)}`)}`,
                    `中位线等于两底的平均数：${steps(`PR = \\frac{${long} + ${short}}{2} = \\frac{${long + short}}{2} = ${lenTex(m, u)}`)}`,
                  )
                : t(
                    `The midsegment is the average of the bases, so the bases add up to twice the midsegment:${steps(`${known} + b = 2 \\cdot ${m} = ${2 * m}`, `b = ${2 * m} - ${known} = ${lenTex(answer, u)}`)}`,
                    `中位线等于两底的平均数，所以两底之和是中位线的两倍：${steps(`${known} + b = 2 \\cdot ${m} = ${2 * m}`, `b = ${2 * m} - ${known} = ${lenTex(answer, u)}`)}`,
                  ),
          }),
          figure: fig(
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
          ),
        };
      },
    },
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

/** congruentPolygons reads corresponding parts from a congruence statement and uses them to find measures. */
export const congruentPolygons = topic(
  "congruent-polygons",
  t("Congruent Polygons", "全等的多边形"),
  t(
    "Congruent polygons have the same size and shape: one can be moved onto the other. A congruence statement lists corresponding vertices in the same order, so corresponding sides and angles can be read from it, and corresponding parts have equal measures.",
    "全等的多边形大小和形状都相同：一个可以移动到与另一个重合。全等式按对应顺序写出顶点，所以从中可以读出对应的边和角，对应部分的度量相等。",
  ),
  ["polygons", "congruent-segments", "congruent-angles"],
  ["8.G.A.2", "HSG.CO.B.7"],
  [
    {
      id: "corresponding-parts",
      title: t("Corresponding parts", "对应部分"),
      explanation: t(
        "In $\\triangle ABC \\cong \\triangle RPQ$, the vertices are matched by position: $A \\leftrightarrow R$, $B \\leftrightarrow P$ and $C \\leftrightarrow Q$. So $\\overline{BC}$ corresponds to $\\overline{PQ}$, and $\\angle B \\cong \\angle P$. The letters of the second triangle are not in alphabetical order, so read each one from its position in the statement.",
        "在 $\\triangle ABC \\cong \\triangle RPQ$ 中，顶点按位置对应：$A \\leftrightarrow R$，$B \\leftrightarrow P$，$C \\leftrightarrow Q$。所以 $\\overline{BC}$ 对应 $\\overline{PQ}$，$\\angle B \\cong \\angle P$。第二个三角形的字母不按字母表顺序排列，要按它们在全等式中的位置来读。",
      ),
      generate(rng) {
        const n = rng.pick([3, 3, 4] as const);
        const c = congruence(rng, n);
        const st = statement(c);
        if (rng.bool()) {
          const i = rng.int(0, n - 1);
          const side = `${c.first[i]}${c.first[(i + 1) % n]}`;
          const answer = corresponding(c, side);
          const others = [...Array(n).keys()]
            .map((j) => `${c.second[j]}${c.second[(j + 1) % n]}`)
            .filter((s) => s !== answer && s !== [...answer].reverse().join(""));
          return pickChoice(
            rng,
            t(`${st.en}. Which segment corresponds to $${over(side)}$?`, `${st["zh-CN"]}。哪条线段与 $${over(side)}$ 对应？`),
            mathText(over(answer)),
            rng
              .shuffle(others)
              .slice(0, 3)
              .map((s) => mathText(over(s))),
            t(
              `Read the statement by position: $${side[0]}$ is matched with $${answer[0]}$ and $${side[1]}$ with $${answer[1]}$, so $${over(side)}$ corresponds to $${over(answer)}$.`,
              `按位置读全等式：$${side[0]}$ 对应 $${answer[0]}$，$${side[1]}$ 对应 $${answer[1]}$，所以 $${over(side)}$ 对应 $${over(answer)}$。`,
            ),
          );
        }
        const i = rng.int(0, n - 1);
        const v = c.first[i]!;
        const answer = c.second[i]!;
        return pickChoice(
          rng,
          t(`${st.en}. Which angle is congruent to $\\angle ${v}$?`, `${st["zh-CN"]}。哪个角与 $\\angle ${v}$ 全等？`),
          mathText(`\\angle ${answer}`),
          [...c.second]
            .filter((ch) => ch !== answer)
            .slice(0, 3)
            .map((ch) => mathText(`\\angle ${ch}`)),
          t(
            `$${v}$ is in position ${i + 1} of $${c.first}$, and position ${i + 1} of $${c.second}$ is $${answer}$. Corresponding angles are congruent, so $\\angle ${v} \\cong \\angle ${answer}$.`,
            `$${v}$ 在 $${c.first}$ 的第 ${i + 1} 位，$${c.second}$ 的第 ${i + 1} 位是 $${answer}$。对应角全等，所以 $\\angle ${v} \\cong \\angle ${answer}$。`,
          ),
        );
      },
    },
    {
      id: "measures-of-congruent-triangles",
      title: t("Measures of congruent triangles", "全等三角形的度量"),
      explanation: t(
        "Corresponding parts of congruent figures have equal measures. If $\\triangle ABC \\cong \\triangle FDE$ and $BC = 9$, then $DE = 9$, because $B \\leftrightarrow D$ and $C \\leftrightarrow E$.\n\nTo find an angle that is not given, first find the third angle of the triangle you know, then carry it across: if $m\\angle A = 50^\\circ$ and $m\\angle B = 60^\\circ$, then $m\\angle C = 70^\\circ$, so $m\\angle E = 70^\\circ$.",
        "全等图形的对应部分度量相等。若 $\\triangle ABC \\cong \\triangle FDE$，$BC = 9$，则 $DE = 9$，因为 $B \\leftrightarrow D$，$C \\leftrightarrow E$。\n\n要求没有给出的角，先求已知三角形的第三个角，再对应过去：若 $m\\angle A = 50^\\circ$，$m\\angle B = 60^\\circ$，则 $m\\angle C = 70^\\circ$，所以 $m\\angle E = 70^\\circ$。",
      ),
      generate(rng) {
        const c = congruence(rng, 3);
        const [pts, [c0, a0, b0]] = scaleneTriangle(rng);
        // scaleneTriangle lists the sides from the bottom, counterclockwise: first-second, second-third, third-first.
        const lengths = [c0!, a0!, b0!];
        const second = placed(pts, rng.pick([90, 150, 200, 250, 300]), rng.bool(), Math.max(...pts.map((p) => p[0])) + 4);
        const u = pickUnit(rng);
        const marksFirst: Mark[] = [{ kind: "polygon", points: pts }, ...names(pts, c.first)];
        const marksSecond: Mark[] = [{ kind: "polygon", points: second }, ...names(second, c.second)];
        if (rng.bool()) {
          const i = rng.int(0, 2);
          const side = corresponding(c, `${c.first[i]}${c.first[(i + 1) % 3]}`);
          const answer = lengths[i]!;
          return {
            ...numberProblem({
              prompt: t(
                `$${polygonName(c.first)} \\cong ${polygonName(c.second)}$. Find $${side}$.`,
                `$${polygonName(c.first)} \\cong ${polygonName(c.second)}$。求 $${side}$。`,
              ),
              answer,
              form: "integer",
              unit: u,
              wrong: lengths.filter((l) => l !== answer),
              solution: t(
                `$${side[0]}$ corresponds to $${c.first[c.second.indexOf(side[0]!)]}$ and $${side[1]}$ to $${c.first[c.second.indexOf(side[1]!)]}$, so $${over(side)}$ corresponds to $${over(`${c.first[i]}${c.first[(i + 1) % 3]}`)}$ and has the same length, $${lenTex(answer, u)}$.`,
                `$${side[0]}$ 对应 $${c.first[c.second.indexOf(side[0]!)]}$，$${side[1]}$ 对应 $${c.first[c.second.indexOf(side[1]!)]}$，所以 $${over(side)}$ 与 $${over(`${c.first[i]}${c.first[(i + 1) % 3]}`)}$ 对应，长度相同，为 $${lenTex(answer, u)}$。`,
              ),
            }),
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
          };
        }
        const angles = [angleAt(pts[0]!, pts[1]!, pts[2]!), angleAt(pts[1]!, pts[2]!, pts[0]!)].map(Math.round);
        const [g0, g1] = [angles[0]!, angles[1]!];
        const third = 180 - g0 - g1;
        const target = rng.int(0, 2);
        const value = [g0, g1, third][target]!;
        const name = c.second[target]!;
        const known = target < 2;
        return {
          ...numberProblem({
            prompt: t(
              `$${polygonName(c.first)} \\cong ${polygonName(c.second)}$. Find $m\\angle ${name}$.`,
              `$${polygonName(c.first)} \\cong ${polygonName(c.second)}$。求 $m\\angle ${name}$。`,
            ),
            answer: value,
            form: "integer",
            unit: "°",
            wrong: [g0, g1, third, 180 - value].filter((w) => w !== value),
            solution: known
              ? t(
                  `$${name}$ corresponds to $${c.first[target]}$, so $m\\angle ${name} = m\\angle ${c.first[target]} = ${degTex(value)}$.`,
                  `$${name}$ 对应 $${c.first[target]}$，所以 $m\\angle ${name} = m\\angle ${c.first[target]} = ${degTex(value)}$。`,
                )
              : t(
                  `$${name}$ corresponds to $${c.first[2]}$. The angles of $${polygonName(c.first)}$ add up to $${degTex(180)}$:${steps(`m\\angle ${c.first[2]} = 180 - ${g0} - ${g1} = ${degTex(third)}`)}So $m\\angle ${name} = ${degTex(third)}$.`,
                  `$${name}$ 对应 $${c.first[2]}$。$${polygonName(c.first)}$ 的内角和为 $${degTex(180)}$：${steps(`m\\angle ${c.first[2]} = 180 - ${g0} - ${g1} = ${degTex(third)}`)}所以 $m\\angle ${name} = ${degTex(third)}$。`,
                ),
          }),
          figure: fig(
            [...marksFirst, arc(pts[0]!, pts[1]!, pts[2]!, deg(g0)), arc(pts[1]!, pts[2]!, pts[0]!, deg(g1)), ...marksSecond],
            `Triangle ${c.first} with angle ${c.first[0]} = ${g0}° and angle ${c.first[1]} = ${g1}°, and triangle ${c.second} drawn in another position.`,
            `三角形 ${c.first} 中角 ${c.first[0]} = ${g0}°，角 ${c.first[1]} = ${g1}°；另有位置不同的三角形 ${c.second}。`,
          ),
        };
      },
    },
    {
      id: "congruent-polygons-with-algebra",
      title: t("Congruent polygons with algebra", "用方程解全等多边形问题"),
      explanation: t(
        "When corresponding parts are given as expressions, set them equal. If $\\triangle ABC \\cong \\triangle DEF$, $AB = 2x + 5$ and $DE = 4x - 3$, then $\\overline{AB}$ corresponds to $\\overline{DE}$, so $2x + 5 = 4x - 3$ and $x = 4$. Check that you matched corresponding parts: $\\overline{AB}$ does not correspond to $\\overline{EF}$.",
        "对应部分用式子表示时，令它们相等。若 $\\triangle ABC \\cong \\triangle DEF$，$AB = 2x + 5$，$DE = 4x - 3$，则 $\\overline{AB}$ 与 $\\overline{DE}$ 对应，所以 $2x + 5 = 4x - 3$，$x = 4$。要检查配对的确实是对应部分：$\\overline{AB}$ 不与 $\\overline{EF}$ 对应。",
      ),
      generate(rng) {
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
        return numberProblem({
          prompt: t(
            `${st.en}, $${p} = ${show(e1)}$ and $${q} = ${show(e2)}$. Find $x$.`,
            `${st["zh-CN"]}，$${p} = ${show(e1)}$，$${q} = ${show(e2)}$。求 $x$。`,
          ),
          answer: x,
          wrong: equalWrong(e1, e2),
          solution: t(
            `${angle ? `$\\angle ${c.first[i]}$ and $\\angle ${c.second[i]}$ are in the same position` : `$${over(p)}$ and $${over(q)}$ are in the same positions`} in the statement, so they are corresponding parts and have equal measures:${steps(...equalSteps(e1, e2))}`,
            `${angle ? `$\\angle ${c.first[i]}$ 与 $\\angle ${c.second[i]}$ 在全等式中位置相同` : `$${over(p)}$ 与 $${over(q)}$ 在全等式中位置相同`}，所以它们是对应部分，度量相等：${steps(...equalSteps(e1, e2))}`,
          ),
        });
      },
    },
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
