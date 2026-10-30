import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type Point, plane, Q, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, pointLatex, pointProblem, steps, yesNo } from "../problems.ts";

// Geometry, module 1.4: similarity. Similar polygons and their sides, angles
// and areas, similarity transformations, the AA, SSS and SAS criteria, proofs
// of similarity, the midpoint theorem and the triangle proportionality theorem.

// ─── Helpers ────────────────────────────────────────────────────────────────

const rad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 1, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

/** lerp is the point a fraction f of the way from a to b. */
const lerp = (a: Point, b: Point, f: number): Point => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** m wraps LaTeX as a language-neutral text. */
const m = (tex: string) => same(`$${tex}$`);

/** gcd is the greatest common divisor of two whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** fr writes n / d in lowest terms in LaTeX. */
const fr = (n: number, d = 1) => Q.of(n, d).toLatex();

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
const plain = (c: number, d: number) => linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");

/** range is [0, 1, …, n − 1]. */
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** area2 is twice the signed area of a polygon: positive when its points run counterclockwise. */
function area2(points: readonly Point[]): number {
  return points.reduce((s, p, i) => {
    const q = points[(i + 1) % points.length]!;
    return s + p[0] * q[1] - q[0] * p[1];
  }, 0);
}

/** outside labels the sides of a polygon outside it, side i running from point i to point i + 1; null skips a side. */
function outside(points: readonly Point[], labels: readonly (string | null)[]): Mark[] {
  const ccw = area2(points) > 0;
  return points.flatMap((p, i): Mark[] => {
    const text = labels[i];
    if (text == null || text === "") return [];
    const q = points[(i + 1) % points.length]!;
    return [{ kind: "side", a: ccw ? p : q, b: ccw ? q : p, text }];
  });
}

const compasses: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** compassOf is the compass direction nearest to the direction (dx, dy). */
function compassOf(dx: number, dy: number): Compass {
  const a = (toDeg(Math.atan2(dy, dx)) + 360 + 22.5) % 360;
  return compasses[Math.floor(a / 45) % 8]!;
}

/** center is the average of some points. */
const center = (points: readonly Point[]): Point => [
  points.reduce((s, p) => s + p[0], 0) / points.length,
  points.reduce((s, p) => s + p[1], 0) / points.length,
];

/** names labels points with letters, each away from the center c (the points' own center by default). */
function names(points: readonly Point[], letters: string, c: Point = center(points)): Mark[] {
  return points.map((at, i) => ({
    kind: "label",
    at,
    text: letters[i]!,
    dir: compassOf(at[0] - c[0], at[1] - c[1]),
    italic: true,
  }));
}

/** polyMarks draws a polygon with side labels (side i from point i to i + 1), angle arcs (null for none, "" for an unlabeled arc) and vertex letters. */
function polyMarks(
  ps: readonly Point[],
  letters: string,
  sides: readonly (string | null)[] = [],
  arcs: readonly (string | null)[] = [],
): Mark[] {
  const n = ps.length;
  const marks: Mark[] = [{ kind: "polygon", points: ps }, ...outside(ps, sides)];
  arcs.forEach((l, i) => {
    if (l == null) return;
    marks.push({
      kind: "arc",
      vertex: ps[i]!,
      from: ps[(i + 1) % n]!,
      to: ps[(i + n - 1) % n]!,
      ...(l !== "" && { label: l }),
      accent: true,
    });
  });
  marks.push(...names(ps, letters));
  return marks;
}

/** Pose turns and maybe mirrors a drawing, so that figures do not all face the same way. */
interface Pose {
  readonly turn: number;
  readonly mirror: boolean;
}

const pickPose = (rng: Rng): Pose => ({ turn: rng.pick([0, 0, 0, 180, 20, -20]), mirror: rng.bool() });

/** posed applies a pose to points. */
function posed(points: readonly Point[], pose: Pose): Point[] {
  const [c, s] = [Math.cos(rad(pose.turn)), Math.sin(rad(pose.turn))];
  return points.map(([x0, y]) => {
    const x = pose.mirror ? -x0 : x0;
    return [x * c - y * s, x * s + y * c] as Point;
  });
}

/** fitBox scales points so that their larger extent is size, with the lower left corner at the origin. */
function fitBox(ps: readonly Point[], size: number): Point[] {
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const s = size / Math.max(Math.max(...xs) - x0, Math.max(...ys) - y0);
  return ps.map(([x, y]) => [(x - x0) * s, (y - y0) * s] as Point);
}

/** sideBySide places two drawings next to each other, the second drawn ratio times the size of the first (kept between 0.6 and 1.6). */
function sideBySide(p: readonly Point[], q: readonly Point[], ratio: number): [Point[], Point[]] {
  const r = Math.min(Math.max(ratio, 0.6), 1.6);
  const a = fitBox(p, 4.5);
  const b = fitBox(q, 4.5 * r);
  const w = Math.max(...a.map((x) => x[0]));
  return [a, b.map(([x, y]) => [x + w + 2.4, y] as Point)];
}

/** Tri3 are the side lengths of a triangle: from vertex 0 to 1, 1 to 2 and 2 to 0. */
type Tri3 = readonly [number, number, number];

/** shapes are integer triangles whose angles are all at least 28°. */
const shapes: readonly Tri3[] = [
  [4, 5, 6],
  [5, 6, 7],
  [4, 6, 7],
  [5, 7, 8],
  [6, 7, 8],
  [3, 5, 6],
  [4, 7, 8],
  [6, 8, 9],
  [7, 8, 9],
  [3, 4, 5],
  [5, 6, 8],
  [4, 5, 7],
  [6, 7, 10],
  [2, 3, 4],
];

/** pickShape picks a scalene shape and rotates which side comes first. */
function pickShape(rng: Rng): Tri3 {
  const s = rng.pick(shapes);
  const r = rng.int(0, 2);
  return [s[r]!, s[(r + 1) % 3]!, s[(r + 2) % 3]!];
}

/** bySides places a triangle with the given sides: vertex 0 at the origin, vertex 1 on the positive x-axis, vertex 2 above. */
function bySides(s: Tri3): [Point, Point, Point] {
  const [s01, s12, s20] = s;
  const x = (s20 * s20 + s01 * s01 - s12 * s12) / (2 * s01);
  return [
    [0, 0],
    [s01, 0],
    [x, Math.sqrt(Math.max(s20 * s20 - x * x, 0))],
  ];
}

/** isTriangle tells whether three lengths make a triangle whose angles are all at least 20°. */
function isTriangle(s: Tri3): boolean {
  const [a, b, c] = s;
  if (a + b <= c || b + c <= a || c + a <= b) return false;
  const angle = (opp: number, x: number, y: number) => toDeg(Math.acos((x * x + y * y - opp * opp) / (2 * x * y)));
  return Math.min(angle(b, a, c), angle(c, a, b), angle(a, b, c)) >= 20;
}

/** byAngles places a triangle with angles a at (0, 0) and b at (6, 0). */
function byAngles(a: number, b: number): [Point, Point, Point] {
  const side = (6 * Math.sin(rad(b))) / Math.sin(rad(a + b));
  return [[0, 0], [6, 0], dir(a, side)];
}

/** bySas places a triangle with sides p (vertex 0 to 1) and q (vertex 0 to 2) and the angle theta between them at vertex 0. */
const bySas = (p: number, q: number, theta: number): [Point, Point, Point] => [[0, 0], [p, 0], dir(theta, q)];

/** scales are pairs a < b of coprime whole numbers, for a scale factor b / a or a / b. */
const scales: readonly (readonly [number, number])[] = [
  [1, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [2, 5],
  [3, 5],
  [1, 4],
  [4, 5],
];

/** sixLetters are vertex names for two triangles. */
const sixLetters = ["ABCDEF", "PQRXYZ", "JKLMNP", "ABCPQR", "DEFRST", "KLMXYZ", "GHIUVW"] as const;

/** eightLetters are vertex names for two quadrilaterals. */
const eightLetters = ["ABCDEFGH", "PQRSWXYZ", "JKLMTUVW", "ABCDPQRS"] as const;

/** fiveLetters name a triangle ABC with points D and E on its sides. */
const fiveLetters = ["ABCDE", "PQRST", "JKLMN", "XYZUV", "FGHJK"] as const;

const pickFive = (rng: Rng) => rng.pick(fiveLetters).split("") as [string, string, string, string, string];

/** both writes a sentence in both languages from two template strings. */
const tri = (letters: string) => `\\triangle ${letters}`;

/** ratioSteps writes a/b = c/d → x, for solutions of proportions. */
const prop = (a: string, b: string, c: string, d: string) => `\\frac{${a}}{${b}} = \\frac{${c}}{${d}}`;

// ─── 1.4.1 Similarity and similar polygons ──────────────────────────────────

export const similarityAndSimilarPolygons: TopicDef = {
  id: "similarity-and-similar-polygons",
  title: t("Similarity and Similar Polygons", "相似与相似多边形"),
  summary: t(
    "Read the correspondence of a similarity statement, decide whether two rectangles are similar, and find a scale factor.",
    "读出相似式中的对应关系，判断两个矩形是否相似，并求相似比。",
  ),
  prerequisites: ["dilations-of-geometric-figures"],
  encompasses: [
    { topic: "dilations-of-geometric-figures", weight: 0.4 },
    { topic: "proportions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.A.2"],
  knowledgePoints: [
    {
      id: "corresponding-parts",
      title: t("Corresponding parts", "对应部分"),
      explanation: t(
        "Two polygons are **similar** ($\\sim$) when one is a scaled copy of the other: their **corresponding angles are congruent** and their **corresponding sides are proportional**.\n\nA similarity statement lists corresponding vertices in the same order. $\\triangle ABC \\sim \\triangle FDE$ pairs $A \\leftrightarrow F$, $B \\leftrightarrow D$, $C \\leftrightarrow E$. So $\\angle B \\cong \\angle D$, and the side $\\overline{BC}$ corresponds to $\\overline{DE}$ (second and third letters on each side).",
        "两个多边形**相似**（$\\sim$）是指一个是另一个按比例缩放得到的：它们的**对应角相等**，**对应边成比例**。\n\n相似式按相同顺序列出对应顶点。$\\triangle ABC \\sim \\triangle FDE$ 表示 $A \\leftrightarrow F$，$B \\leftrightarrow D$，$C \\leftrightarrow E$。所以 $\\angle B \\cong \\angle D$，边 $\\overline{BC}$ 对应 $\\overline{DE}$（两边各取第二、三个字母）。",
      ),
      generate(rng) {
        const n = rng.pick([3, 3, 4]);
        const set = rng.pick(n === 3 ? sixLetters : eightLetters);
        const p = set.slice(0, n).split("");
        const base = set.slice(n, 2 * n).split("");
        let q: string[];
        if (n === 3) q = rng.shuffle(base);
        else {
          const r = rng.int(0, 3);
          q = [...base.slice(r), ...base.slice(0, r)];
          if (rng.bool()) q = [q[0]!, ...q.slice(1).reverse()];
        }
        const name = (xs: readonly string[]) => (n === 3 ? tri(xs.join("")) : xs.join(""));
        const statement = `${name(p)} \\sim ${name(q)}`;
        const given =
          n === 3
            ? t(`Given $${statement}$,`, `已知 $${statement}$，`)
            : t(`Given the similar quadrilaterals $${statement}$,`, `已知相似四边形 $${statement}$，`);
        const pairs = p.map((v, k) => `${v} \\leftrightarrow ${q[k]}`).join(", \\; ");
        const i = rng.int(0, n - 1);
        const j = (i + 1) % n;
        if (rng.bool()) {
          const sideOf = (k: number) => `\\overline{${q[k]}${q[(k + 1) % n]}}`;
          const options = rng.shuffle(range(n).map(sideOf));
          return choiceProblem({
            prompt: t(
              `${given.en} which side corresponds to $\\overline{${p[i]}${p[j]}}$?`,
              `${given["zh-CN"]}哪条边与 $\\overline{${p[i]}${p[j]}}$ 对应？`,
            ),
            options: options.map(m),
            correct: options.indexOf(sideOf(i)),
            solution: t(
              `Pair the vertices in the order they are written: $${pairs}$. So $${p[i]} \\to ${q[i]}$ and $${p[j]} \\to ${q[j]}$, and $\\overline{${p[i]}${p[j]}}$ corresponds to $${sideOf(i)}$.`,
              `按书写顺序配对顶点：$${pairs}$。所以 $${p[i]} \\to ${q[i]}$，$${p[j]} \\to ${q[j]}$，$\\overline{${p[i]}${p[j]}}$ 对应 $${sideOf(i)}$。`,
            ),
          });
        }
        const angleOf = (k: number) => `\\angle ${q[k]}`;
        const options = rng.shuffle(range(n).map(angleOf));
        return choiceProblem({
          prompt: t(`${given.en} which angle is congruent to $\\angle ${p[i]}$?`, `${given["zh-CN"]}哪个角与 $\\angle ${p[i]}$ 相等？`),
          options: options.map(m),
          correct: options.indexOf(angleOf(i)),
          solution: t(
            `Pair the vertices in the order they are written: $${pairs}$. Corresponding angles of similar polygons are congruent, so $\\angle ${p[i]} \\cong \\angle ${q[i]}$.`,
            `按书写顺序配对顶点：$${pairs}$。相似多边形的对应角相等，所以 $\\angle ${p[i]} \\cong \\angle ${q[i]}$。`,
          ),
        });
      },
    },
    {
      id: "deciding-whether-rectangles-are-similar",
      title: t("Similar rectangles", "相似的矩形"),
      explanation: t(
        "All angles of a rectangle are right angles, so two rectangles always have congruent corresponding angles. They are similar exactly when their sides are proportional: compare shorter side with shorter side and longer side with longer side.\n\nA $4 \\times 6$ and a $6 \\times 9$ rectangle: $\\frac{6}{4} = \\frac{3}{2}$ and $\\frac{9}{6} = \\frac{3}{2}$, so they are similar. A $4 \\times 6$ and a $6 \\times 8$ rectangle: $\\frac{6}{4} = \\frac{3}{2}$ but $\\frac{8}{6} = \\frac{4}{3}$, so they are not.",
        "矩形的角都是直角，所以两个矩形的对应角总是相等。它们相似当且仅当边成比例：短边比短边，长边比长边。\n\n$4 \\times 6$ 与 $6 \\times 9$ 的矩形：$\\frac{6}{4} = \\frac{3}{2}$，$\\frac{9}{6} = \\frac{3}{2}$，所以相似。$4 \\times 6$ 与 $6 \\times 8$ 的矩形：$\\frac{6}{4} = \\frac{3}{2}$，但 $\\frac{8}{6} = \\frac{4}{3}$，所以不相似。",
      ),
      generate(rng) {
        for (;;) {
          const w0 = rng.int(1, 6);
          const h0 = rng.int(1, 6);
          if (w0 === h0 || gcd(w0, h0) !== 1 || Math.max(w0, h0) > 3 * Math.min(w0, h0)) continue;
          const [a, b] = rng.sample([1, 2, 3, 4, 5], 2) as [number, number];
          const r1: [number, number] = [w0 * a, h0 * a];
          let r2: [number, number] = [w0 * b, h0 * b];
          if (rng.bool()) {
            const d = rng.pick([-2, -1, 1, 2]);
            r2 = rng.bool() ? [r2[0] + d, r2[1]] : [r2[0], r2[1] + d];
          }
          if (rng.bool()) r2 = [r2[1], r2[0]];
          if (Math.min(...r1, ...r2) < 2 || Math.max(...r1, ...r2) > 30) continue;
          if (Math.max(...r2) > 3 * Math.min(...r2)) continue;
          const s1 = [...r1].sort((x, y) => x - y) as [number, number];
          const s2 = [...r2].sort((x, y) => x - y) as [number, number];
          const similar = s1[0] * s2[1] === s1[1] * s2[0];
          const rect = ([w, h]: readonly [number, number]): Point[] => [
            [0, 0],
            [w, 0],
            [w, h],
            [0, h],
          ];
          const [p1, p2] = sideBySide(rect(r1), rect(r2), Math.max(...r2) / Math.max(...r1));
          const fig = figure(
            [...polyMarks(p1, "ABCD", [String(r1[0]), String(r1[1])]), ...polyMarks(p2, "EFGH", [String(r2[0]), String(r2[1])])],
            `Rectangle ABCD, ${r1[0]} by ${r1[1]}, and rectangle EFGH, ${r2[0]} by ${r2[1]}.`,
            `矩形 ABCD，${r1[0]} × ${r1[1]}；矩形 EFGH，${r2[0]} × ${r2[1]}。`,
          );
          const cmp = similar ? "=" : "\\ne";
          return {
            ...choiceProblem({
              prompt: t("Are the two rectangles similar?", "这两个矩形相似吗？"),
              options: yesNo,
              correct: similar ? 0 : 1,
              solution: t(
                `Compare the shorter sides and the longer sides:${steps(`\\frac{${s2[0]}}{${s1[0]}} = ${fr(s2[0], s1[0])}, \\qquad \\frac{${s2[1]}}{${s1[1]}} = ${fr(s2[1], s1[1])}`)}The ratios are ${similar ? "equal" : "not equal"} ($${fr(s2[0], s1[0])} ${cmp} ${fr(s2[1], s1[1])}$), so the rectangles are ${similar ? "" : "not "}similar.`,
                `比较短边与短边、长边与长边：${steps(`\\frac{${s2[0]}}{${s1[0]}} = ${fr(s2[0], s1[0])}, \\qquad \\frac{${s2[1]}}{${s1[1]}} = ${fr(s2[1], s1[1])}`)}两个比${similar ? "相等" : "不相等"}（$${fr(s2[0], s1[0])} ${cmp} ${fr(s2[1], s1[1])}$），所以这两个矩形${similar ? "相似" : "不相似"}。`,
              ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "finding-the-scale-factor",
      title: t("The scale factor", "相似比"),
      explanation: t(
        "The **scale factor** from one polygon to a similar one is the ratio of a side of the second to the corresponding side of the first. It is the scale factor of a dilation that, followed by rigid motions, maps the first polygon onto the second.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with $AB = 6$ and $DE = 15$, the scale factor from $\\triangle ABC$ to $\\triangle DEF$ is $\\frac{DE}{AB} = \\frac{15}{6} = \\frac{5}{2}$.",
        "从一个多边形到与它相似的另一个多边形的**相似比**，是第二个图形的一条边与第一个图形对应边的比。它就是一次位似（再接若干刚体运动）把第一个多边形变成第二个时的比例因子。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$AB = 6$，$DE = 15$，则从 $\\triangle ABC$ 到 $\\triangle DEF$ 的相似比为 $\\frac{DE}{AB} = \\frac{15}{6} = \\frac{5}{2}$。",
      ),
      keyPrerequisites: ["dilations-of-geometric-figures"],
      generate(rng) {
        const sh = pickShape(rng);
        const [a, b] = rng.pick(scales);
        const [u, v] = rng.bool() ? [a, b] : [b, a];
        const letters = rng.pick(sixLetters);
        const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
        const i = rng.int(0, 2);
        const pose = pickPose(rng);
        const [p1, p2] = sideBySide(bySides(sh), posed(bySides(sh), pose), v / u);
        const s1 = sh.map((x) => String(x * u));
        const s2 = sh.map((x, k) => (k === i ? String(x * v) : null));
        const side1 = `${L1[i]}${L1[(i + 1) % 3]}`;
        const side2 = `${L2[i]}${L2[(i + 1) % 3]}`;
        const k = Q.of(v, u);
        return {
          ...numberProblem({
            prompt: t(
              `$${tri(L1)} \\sim ${tri(L2)}$. Find the scale factor from $${tri(L1)}$ to $${tri(L2)}$.`,
              `$${tri(L1)} \\sim ${tri(L2)}$。求从 $${tri(L1)}$ 到 $${tri(L2)}$ 的相似比。`,
            ),
            answer: k,
            form: "fraction",
            wrong: [Q.one.div(k), Math.abs(sh[i]! * (v - u))],
            solution: t(
              `$\\overline{${side1}}$ corresponds to $\\overline{${side2}}$. Divide the side of $${tri(L2)}$ by the side of $${tri(L1)}$:${steps(`\\frac{${side2}}{${side1}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}} = ${k.toLatex()}`)}`,
              `$\\overline{${side1}}$ 与 $\\overline{${side2}}$ 对应。用 $${tri(L2)}$ 的边除以 $${tri(L1)}$ 的边：${steps(`\\frac{${side2}}{${side1}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}} = ${k.toLatex()}`)}`,
            ),
          }),
          figure: figure(
            [...polyMarks(p1, L1, s1), ...polyMarks(p2, L2, s2)],
            `Similar triangles ${L1} and ${L2}. The sides of ${L1} are ${s1.join(", ")}; side ${side2} of ${L2} is ${sh[i]! * v}.`,
            `相似三角形 ${L1} 与 ${L2}。${L1} 的三边为 ${s1.join("、")}；${L2} 的边 ${side2} 为 ${sh[i]! * v}。`,
          ),
        };
      },
    },
  ],
};

// ─── 1.4.2 Side lengths and angle measures ──────────────────────────────────

/** SimilarPair is two similar triangles drawn side by side, with their side lengths and letters. */
interface SimilarPair {
  readonly sh: Tri3;
  readonly u: number;
  readonly v: number;
  readonly L1: string;
  readonly L2: string;
  readonly p1: Point[];
  readonly p2: Point[];
}

/** similarPair picks two similar triangles with sides sh·u and sh·v. */
function similarPair(rng: Rng): SimilarPair {
  const sh = pickShape(rng);
  const [a, b] = rng.pick(scales);
  const [u, v] = rng.bool() ? [a, b] : [b, a];
  const letters = rng.pick(sixLetters);
  const [p1, p2] = sideBySide(bySides(sh), posed(bySides(sh), pickPose(rng)), v / u);
  return { sh, u, v, L1: letters.slice(0, 3), L2: letters.slice(3), p1, p2 };
}

/** sideName is side i of a triangle named by three letters: from vertex i to vertex i + 1. */
const sideName = (L: string, i: number) => `${L[i]}${L[(i + 1) % 3]}`;

export const sideLengthsAndAngleMeasuresOfSimilarPolygons: TopicDef = {
  id: "side-lengths-and-angle-measures-of-similar-polygons",
  title: t("Side Lengths and Angle Measures of Similar Polygons", "相似多边形的边长与角度"),
  summary: t(
    "Find missing sides of similar polygons with proportions, and missing angles from congruent corresponding angles.",
    "用比例求相似多边形中未知的边，用对应角相等求未知的角。",
  ),
  prerequisites: ["similarity-and-similar-polygons", "angles-of-polygons"],
  encompasses: [
    { topic: "similarity-and-similar-polygons", weight: 0.5 },
    { topic: "proportions", weight: 0.4 },
    { topic: "angles-of-polygons", weight: 0.2 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.2", "CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "missing-side-lengths",
      title: t("Missing side lengths", "求未知边长"),
      explanation: t(
        `Corresponding sides of similar polygons are proportional, so a missing side follows from a proportion: a ratio of two sides of one polygon equals the ratio of the corresponding sides of the other.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with $AB = 4$, $BC = 6$ and $DE = 10$, then${steps("\\frac{EF}{BC} = \\frac{DE}{AB} \\quad\\Rightarrow\\quad \\frac{EF}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad EF = 15")}`,
        `相似多边形的对应边成比例，所以未知的边可以用比例求出：一个多边形中两边的比等于另一个多边形中对应两边的比。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$AB = 4$，$BC = 6$，$DE = 10$，则${steps("\\frac{EF}{BC} = \\frac{DE}{AB} \\quad\\Rightarrow\\quad \\frac{EF}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad EF = 15")}`,
      ),
      keyPrerequisites: ["proportions"],
      generate(rng) {
        const { sh, u, v, L1, L2, p1, p2 } = similarPair(rng);
        const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
        const s1 = sh.map((x, k) => (k === i || k === j ? String(x * u) : null));
        const s2 = sh.map((x, k) => (k === i ? String(x * v) : k === j ? "x" : null));
        const answer = sh[j]! * v;
        const [k1, k2, kj1] = [sh[i]! * u, sh[i]! * v, sh[j]! * u];
        return {
          ...numberProblem({
            prompt: t(`$${tri(L1)} \\sim ${tri(L2)}$. Find $x$.`, `$${tri(L1)} \\sim ${tri(L2)}$。求 $x$。`),
            answer,
            solveFor: "x",
            wrong: [kj1 + k2 - k1, Q.of(k1 * k2, kj1), Q.of(kj1 * k1, k2)],
            solution: t(
              `$\\overline{${sideName(L2, j)}}$ corresponds to $\\overline{${sideName(L1, j)}}$, and $\\overline{${sideName(L2, i)}}$ to $\\overline{${sideName(L1, i)}}$:${steps(prop("x", String(kj1), String(k2), String(k1)), `x = \\frac{${k2} \\cdot ${kj1}}{${k1}} = ${answer}`)}`,
              `$\\overline{${sideName(L2, j)}}$ 对应 $\\overline{${sideName(L1, j)}}$，$\\overline{${sideName(L2, i)}}$ 对应 $\\overline{${sideName(L1, i)}}$：${steps(prop("x", String(kj1), String(k2), String(k1)), `x = \\frac{${k2} \\cdot ${kj1}}{${k1}} = ${answer}`)}`,
            ),
          }),
          figure: figure(
            [...polyMarks(p1, L1, s1), ...polyMarks(p2, L2, s2)],
            `Similar triangles ${L1} and ${L2}: ${sideName(L1, i)} = ${k1}, ${sideName(L1, j)} = ${kj1}, ${sideName(L2, i)} = ${k2} and ${sideName(L2, j)} = x.`,
            `相似三角形 ${L1} 与 ${L2}：${sideName(L1, i)} = ${k1}，${sideName(L1, j)} = ${kj1}，${sideName(L2, i)} = ${k2}，${sideName(L2, j)} = x。`,
          ),
        };
      },
    },
    {
      id: "missing-angle-measures",
      title: t("Missing angle measures", "求未知角"),
      explanation: t(
        "Corresponding angles of similar polygons are congruent, so an angle of one polygon gives the corresponding angle of the other. Combine this with the angle sum: $180^\\circ$ in a triangle, $360^\\circ$ in a quadrilateral.\n\nIf $\\triangle ABC \\sim \\triangle DEF$, $m\\angle A = 50^\\circ$ and $m\\angle E = 70^\\circ$, then $m\\angle B = m\\angle E = 70^\\circ$, so $m\\angle C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$.",
        "相似多边形的对应角相等，所以一个多边形的角给出另一个多边形的对应角。再结合内角和：三角形为 $180^\\circ$，四边形为 $360^\\circ$。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$m\\angle A = 50^\\circ$，$m\\angle E = 70^\\circ$，则 $m\\angle B = m\\angle E = 70^\\circ$，所以 $m\\angle C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$。",
      ),
      keyPrerequisites: ["angles-of-polygons"],
      generate(rng) {
        const n = rng.pick([3, 3, 4]);
        const set = rng.pick(n === 3 ? sixLetters : eightLetters);
        const p = set.slice(0, n).split("");
        const q = set.slice(n, 2 * n).split("");
        const total = n === 3 ? 180 : 360;
        let angles: number[];
        for (;;) {
          angles = n === 3 ? [rng.int(30, 85), rng.int(30, 85)] : [rng.int(55, 140), rng.int(55, 140), rng.int(55, 140)];
          const last = total - angles.reduce((s, x) => s + x, 0);
          if (last >= 25 && last <= (n === 3 ? 120 : 150) && new Set([...angles, last]).size === n) {
            angles.push(last);
            break;
          }
        }
        const order = rng.shuffle(range(n));
        const asked = order[n - 1]!;
        const known = order.slice(0, n - 1);
        // Each known angle is given on one of the two polygons, at least one on each.
        const onSecond = known.map(() => rng.bool());
        if (onSecond.every((x) => x)) onSecond[0] = false;
        if (onSecond.every((x) => !x)) onSecond[0] = true;
        const askSecond = rng.bool();
        const name = (xs: readonly string[]) => (n === 3 ? tri(xs.join("")) : xs.join(""));
        const facts = known.map((k, i) => `m\\angle ${onSecond[i] ? q[k] : p[k]} = ${angles[k]}^\\circ`).join(", \\; ");
        const target = askSecond ? q[asked]! : p[asked]!;
        const answer = angles[asked]!;
        const transfers = known
          .filter((_, i) => onSecond[i] !== askSecond)
          .map((k) => `m\\angle ${askSecond ? q[k] : p[k]} = m\\angle ${askSecond ? p[k] : q[k]} = ${angles[k]}^\\circ`);
        const sumLine = `m\\angle ${target} = ${total}^\\circ - ${known.map((k) => `${angles[k]}^\\circ`).join(" - ")} = ${answer}^\\circ`;
        const [en, zh] = n === 3 ? ["triangles", "三角形"] : ["quadrilaterals", "四边形"];
        return numberProblem({
          prompt: t(
            `The ${en} satisfy $${name(p)} \\sim ${name(q)}$, with $${facts}$. Find $m\\angle ${target}$.`,
            `${zh}满足 $${name(p)} \\sim ${name(q)}$，且 $${facts}$。求 $m\\angle ${target}$。`,
          ),
          answer,
          unit: "°",
          wrong: [...known.map((k) => angles[k]!), total - angles[known[0]!]!],
          solution: t(
            `Corresponding angles are congruent:${steps(...transfers)}The angles of a ${n === 3 ? "triangle" : "quadrilateral"} add up to $${total}^\\circ$:${steps(sumLine)}`,
            `对应角相等：${steps(...transfers)}${n === 3 ? "三角形" : "四边形"}的内角和为 $${total}^\\circ$：${steps(sumLine)}`,
          ),
        });
      },
    },
    {
      id: "sides-given-by-expressions",
      title: t("Sides given by expressions", "用式子表示的边"),
      explanation: t(
        `When a side is an expression in $x$, write the proportion of corresponding sides, solve it for that side, then solve the equation for $x$.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with $AB = 6$, $BC = 9$, $DE = 10$ and $EF = 2x + 3$:${steps("\\frac{2x + 3}{9} = \\frac{10}{6} \\quad\\Rightarrow\\quad 2x + 3 = 15 \\quad\\Rightarrow\\quad x = 6")}`,
        `当一条边是含 $x$ 的式子时，先写出对应边的比例式，求出这条边，再解关于 $x$ 的方程。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$AB = 6$，$BC = 9$，$DE = 10$，$EF = 2x + 3$：${steps("\\frac{2x + 3}{9} = \\frac{10}{6} \\quad\\Rightarrow\\quad 2x + 3 = 15 \\quad\\Rightarrow\\quad x = 6")}`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        for (;;) {
          const { sh, u, v, L1, L2, p1, p2 } = similarPair(rng);
          const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
          const target = sh[j]! * v;
          const x = rng.int(2, 9);
          const c = rng.int(2, 5);
          const d = target - c * x;
          if (d === 0 || Math.abs(d) > 20) continue;
          const expr = linear(c, d);
          const [k1, k2, kj1] = [sh[i]! * u, sh[i]! * v, sh[j]! * u];
          const s1 = sh.map((y, k) => (k === i || k === j ? String(y * u) : null));
          const s2 = sh.map((y, k) => (k === i ? String(y * v) : k === j ? plain(c, d) : null));
          return {
            ...numberProblem({
              prompt: t(`$${tri(L1)} \\sim ${tri(L2)}$. Find $x$.`, `$${tri(L1)} \\sim ${tri(L2)}$。求 $x$。`),
              answer: x,
              solveFor: "x",
              wrong: [target, Q.of(kj1 - d, c), Q.of(k1 * k2 - d * kj1, c * kj1)],
              solution: t(
                `$\\overline{${sideName(L2, j)}}$ corresponds to $\\overline{${sideName(L1, j)}}$:${steps(prop(expr, String(kj1), String(k2), String(k1)), `${expr} = ${target}`, `x = ${x}`)}`,
                `$\\overline{${sideName(L2, j)}}$ 对应 $\\overline{${sideName(L1, j)}}$：${steps(prop(expr, String(kj1), String(k2), String(k1)), `${expr} = ${target}`, `x = ${x}`)}`,
              ),
            }),
            figure: figure(
              [...polyMarks(p1, L1, s1), ...polyMarks(p2, L2, s2)],
              `Similar triangles ${L1} and ${L2}: ${sideName(L1, i)} = ${k1}, ${sideName(L1, j)} = ${kj1}, ${sideName(L2, i)} = ${k2} and ${sideName(L2, j)} = ${plain(c, d)}.`,
              `相似三角形 ${L1} 与 ${L2}：${sideName(L1, i)} = ${k1}，${sideName(L1, j)} = ${kj1}，${sideName(L2, i)} = ${k2}，${sideName(L2, j)} = ${plain(c, d)}。`,
            ),
          };
        }
      },
    },
  ],
};

// ─── 1.4.3 Areas of similar polygons ────────────────────────────────────────

/** polygonKinds name kinds of similar polygons for word problems. */
const polygonKinds: readonly Text[] = [
  t("triangles", "三角形"),
  t("pentagons", "五边形"),
  t("hexagons", "六边形"),
  t("parallelograms", "平行四边形"),
  t("trapezoids", "梯形"),
  t("rectangles", "矩形"),
];

export const areasOfSimilarPolygons: TopicDef = {
  id: "areas-of-similar-polygons",
  title: t("Areas of Similar Polygons", "相似多边形的面积"),
  summary: t(
    "Use that perimeters scale by the scale factor k and areas by k² to compare similar polygons.",
    "利用周长按相似比 k 缩放、面积按 k² 缩放来比较相似多边形。",
  ),
  prerequisites: ["side-lengths-and-angle-measures-of-similar-polygons", "area-of-triangles"],
  encompasses: [
    { topic: "similarity-and-similar-polygons", weight: 0.3 },
    { topic: "side-lengths-and-angle-measures-of-similar-polygons", weight: 0.2 },
    { topic: "multiplying-fractions", weight: 0.2 },
    { topic: "area-of-triangles", weight: 0.1 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.A.2", "CCSS.7.G.A.1"],
  knowledgePoints: [
    {
      id: "ratios-of-perimeters-and-areas",
      title: t("Ratios of perimeters and areas", "周长比与面积比"),
      explanation: t(
        "If the scale factor from one polygon to a similar one is $k$, every length is multiplied by $k$, so the **perimeter** is multiplied by $k$. Area is length times length, so the **area** is multiplied by $k^{2}$.\n\nIf corresponding sides are in the ratio $2 : 3$, the perimeters are in the ratio $\\frac{2}{3}$ and the areas in the ratio $\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$.",
        "若从一个多边形到与它相似的多边形的相似比为 $k$，每条线段的长度都乘以 $k$，所以**周长**乘以 $k$。面积是长度乘长度，所以**面积**乘以 $k^{2}$。\n\n若对应边的比为 $2 : 3$，则周长比为 $\\frac{2}{3}$，面积比为 $\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$。",
      ),
      generate(rng) {
        const [a, b] = rng.pick([...scales, [2, 7], [3, 7], [5, 6], [1, 5]] as const);
        const kind = rng.pick(polygonKinds);
        const area = rng.bool(0.6);
        const answer = area ? Q.of(a * a, b * b) : Q.of(a, b);
        const what = area ? t("areas", "面积") : t("perimeters", "周长");
        return numberProblem({
          prompt: t(
            `Two similar ${kind.en} have corresponding sides in the ratio $${a} : ${b}$. Find the ratio of their ${what.en}, smaller to larger, as a fraction.`,
            `两个相似${kind["zh-CN"]}的对应边之比为 $${a} : ${b}$。求它们的${what["zh-CN"]}之比（小比大），写成分数。`,
          ),
          answer,
          form: "fraction",
          wrong: area ? [Q.of(a, b), Q.of(a * a * a, b * b * b), Q.of(2 * a, 2 * b + 1)] : [Q.of(a * a, b * b), Q.of(b, a)],
          solution: area
            ? t(
                `Areas scale by the square of the scale factor:${steps(`\\left(\\frac{${a}}{${b}}\\right)^{2} = ${answer.toLatex()}`)}`,
                `面积按相似比的平方缩放：${steps(`\\left(\\frac{${a}}{${b}}\\right)^{2} = ${answer.toLatex()}`)}`,
              )
            : t(
                `Perimeters scale by the scale factor itself, so their ratio is $${answer.toLatex()}$.`,
                `周长按相似比本身缩放，所以周长之比为 $${answer.toLatex()}$。`,
              ),
        });
      },
    },
    {
      id: "area-from-the-scale-factor",
      title: t("Area from the scale factor", "由相似比求面积"),
      explanation: t(
        "To find the area of the image, multiply the original area by $k^{2}$, not by $k$.\n\nA polygon of area $20 \\text{ cm}^{2}$ is enlarged with scale factor $\\frac{3}{2}$. The new area is $\\left(\\frac{3}{2}\\right)^{2} \\cdot 20 = \\frac{9}{4} \\cdot 20 = 45 \\text{ cm}^{2}$.",
        "求像的面积时，把原面积乘以 $k^{2}$，而不是乘以 $k$。\n\n一个面积为 $20 \\text{ cm}^{2}$ 的多边形按相似比 $\\frac{3}{2}$ 放大，新的面积为 $\\left(\\frac{3}{2}\\right)^{2} \\cdot 20 = \\frac{9}{4} \\cdot 20 = 45 \\text{ cm}^{2}$。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const [u, v] = rng.bool() ? [a, b] : [b, a];
        const k = Q.of(v, u);
        const area = u * u * rng.int(1, u === 1 ? 12 : 6);
        const answer = (area / (u * u)) * v * v;
        const kind = rng.pick(polygonKinds);
        const k2 = Q.of(v * v, u * u);
        return numberProblem({
          prompt: t(
            `Two ${kind.en} are similar. The first has area $${area} \\text{ cm}^{2}$, and the scale factor from the first to the second is $${k.toLatex()}$. Find the area of the second.`,
            `两个${kind["zh-CN"]}相似。第一个的面积为 $${area} \\text{ cm}^{2}$，从第一个到第二个的相似比为 $${k.toLatex()}$。求第二个的面积。`,
          ),
          answer,
          unit: "cm^2",
          wrong: [k.mul(Q.of(area)), Q.of(area).div(k2), Q.of(area).div(k)],
          solution: t(
            `Areas scale by $k^{2} = ${k2.toLatex()}$:${steps(`${k2.toLatex()} \\cdot ${area} = ${answer}`)}`,
            `面积按 $k^{2} = ${k2.toLatex()}$ 缩放：${steps(`${k2.toLatex()} \\cdot ${area} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "area-from-corresponding-sides",
      title: t("Area from corresponding sides", "由对应边求面积"),
      explanation: t(
        "When the scale factor is not given, find it from a pair of corresponding sides first, then square it.\n\nIf $\\triangle ABC \\sim \\triangle DEF$, $BC = 4$, $EF = 10$ and the area of $\\triangle ABC$ is $12$, then $k = \\frac{10}{4} = \\frac{5}{2}$, and the area of $\\triangle DEF$ is $\\frac{25}{4} \\cdot 12 = 75$.",
        "当相似比没有直接给出时，先由一对对应边求出相似比，再把它平方。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$BC = 4$，$EF = 10$，$\\triangle ABC$ 的面积为 $12$，则 $k = \\frac{10}{4} = \\frac{5}{2}$，$\\triangle DEF$ 的面积为 $\\frac{25}{4} \\cdot 12 = 75$。",
      ),
      generate(rng) {
        const { sh, u, v, L1, L2, p1, p2 } = similarPair(rng);
        const i = rng.int(0, 2);
        const g = rng.int(1, 3);
        const [s1, s2] = [sh[i]! * u * g, sh[i]! * v * g];
        const area = u * u * rng.int(1, u === 1 ? 15 : 6);
        const answer = (area / (u * u)) * v * v;
        const k = Q.of(v, u);
        return {
          ...numberProblem({
            prompt: t(
              `$${tri(L1)} \\sim ${tri(L2)}$, and the area of $${tri(L1)}$ is $${area}$. Find the area of $${tri(L2)}$.`,
              `$${tri(L1)} \\sim ${tri(L2)}$，$${tri(L1)}$ 的面积为 $${area}$。求 $${tri(L2)}$ 的面积。`,
            ),
            answer,
            wrong: [k.mul(Q.of(area)), Q.of(area * u * u, v * v), area + s2 - s1],
            solution: t(
              `The scale factor is $k = \\frac{${s2}}{${s1}} = ${k.toLatex()}$, so areas are multiplied by $k^{2}$:${steps(`\\left(${k.toLatex()}\\right)^{2} \\cdot ${area} = ${answer}`)}`,
              `相似比为 $k = \\frac{${s2}}{${s1}} = ${k.toLatex()}$，所以面积乘以 $k^{2}$：${steps(`\\left(${k.toLatex()}\\right)^{2} \\cdot ${area} = ${answer}`)}`,
            ),
          }),
          figure: figure(
            [
              ...polyMarks(
                p1,
                L1,
                sh.map((_, k2) => (k2 === i ? String(s1) : null)),
              ),
              ...polyMarks(
                p2,
                L2,
                sh.map((_, k2) => (k2 === i ? String(s2) : null)),
              ),
            ],
            `Similar triangles ${L1} and ${L2} with corresponding sides ${sideName(L1, i)} = ${s1} and ${sideName(L2, i)} = ${s2}.`,
            `相似三角形 ${L1} 与 ${L2}，对应边 ${sideName(L1, i)} = ${s1}，${sideName(L2, i)} = ${s2}。`,
          ),
        };
      },
    },
  ],
};

// ─── 1.4.4 Working with areas of similar polygons ───────────────────────────

/** areaPair picks coprime a ≠ b and a multiplier, for areas a²·c and b²·c. */
function areaPair(rng: Rng): { a: number; b: number; c: number } {
  for (;;) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 7);
    if (a === b || gcd(a, b) !== 1) continue;
    const c = rng.int(1, 5);
    if (Math.max(a, b) ** 2 * c > 250) continue;
    return { a, b, c };
  }
}

export const workingWithAreasOfSimilarPolygons: TopicDef = {
  id: "working-with-areas-of-similar-polygons",
  title: t("Working With Areas of Similar Polygons", "相似多边形面积的应用"),
  summary: t(
    "Go back from the ratio of areas to the scale factor with a square root, and use it to find sides, perimeters and areas.",
    "由面积比开平方得到相似比，并用它求边长、周长和面积。",
  ),
  prerequisites: ["areas-of-similar-polygons", "square-roots-and-cube-roots"],
  encompasses: [
    { topic: "areas-of-similar-polygons", weight: 0.6 },
    { topic: "square-roots-and-cube-roots", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.2", "CCSS.7.G.A.1"],
  knowledgePoints: [
    {
      id: "scale-factor-from-areas",
      title: t("Scale factor from areas", "由面积求相似比"),
      explanation: t(
        "The ratio of areas of similar polygons is $k^{2}$, so the scale factor is its square root:\n\n$$k = \\sqrt{\\frac{\\text{area of the second}}{\\text{area of the first}}}.$$\n\nIf the areas are $18$ and $50$, then $\\frac{50}{18} = \\frac{25}{9}$ and $k = \\sqrt{\\frac{25}{9}} = \\frac{5}{3}$. Simplify the ratio before taking the root.",
        "相似多边形的面积比是 $k^{2}$，所以相似比是它的平方根：\n\n$$k = \\sqrt{\\frac{\\text{第二个的面积}}{\\text{第一个的面积}}}。$$\n\n若面积为 $18$ 和 $50$，则 $\\frac{50}{18} = \\frac{25}{9}$，$k = \\sqrt{\\frac{25}{9}} = \\frac{5}{3}$。先约分，再开平方。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      generate(rng) {
        const { a, b, c } = areaPair(rng);
        const kind = rng.pick(polygonKinds);
        const [A1, A2] = [a * a * c, b * b * c];
        const k = Q.of(b, a);
        return numberProblem({
          prompt: t(
            `Two similar ${kind.en} have areas $${A1}$ and $${A2}$. Find the scale factor from the first to the second.`,
            `两个相似${kind["zh-CN"]}的面积分别为 $${A1}$ 和 $${A2}$。求从第一个到第二个的相似比。`,
          ),
          answer: k,
          form: "fraction",
          wrong: [Q.of(A2, A1), Q.of(a, b), Q.of(A2 - A1)],
          solution: t(
            `The ratio of the areas is $k^{2}$:${steps(`k^{2} = \\frac{${A2}}{${A1}} = ${fr(A2, A1)}`, `k = \\sqrt{${fr(A2, A1)}} = ${k.toLatex()}`)}`,
            `面积之比是 $k^{2}$：${steps(`k^{2} = \\frac{${A2}}{${A1}} = ${fr(A2, A1)}`, `k = \\sqrt{${fr(A2, A1)}} = ${k.toLatex()}`)}`,
          ),
        });
      },
    },
    {
      id: "side-length-from-areas",
      title: t("Side length from areas", "由面积求边长"),
      explanation: t(
        "Once the scale factor is known from the areas, multiply a side by it to get the corresponding side.\n\nTwo similar triangles have areas $16$ and $36$, and a side of the first is $10$. Then $k = \\sqrt{\\frac{36}{16}} = \\frac{3}{2}$, and the corresponding side of the second is $\\frac{3}{2} \\cdot 10 = 15$, not $\\frac{36}{16} \\cdot 10$.",
        "由面积求出相似比后，把一条边乘以相似比，就得到对应的边。\n\n两个相似三角形的面积为 $16$ 和 $36$，第一个的一条边为 $10$。则 $k = \\sqrt{\\frac{36}{16}} = \\frac{3}{2}$，第二个的对应边为 $\\frac{3}{2} \\cdot 10 = 15$，而不是 $\\frac{36}{16} \\cdot 10$。",
      ),
      generate(rng) {
        const { a, b, c } = areaPair(rng);
        const [A1, A2] = [a * a * c, b * b * c];
        const side = a * rng.int(1, 4);
        const answer = (side / a) * b;
        const [L1, L2] = (() => {
          const s = rng.pick(sixLetters);
          return [s.slice(0, 3), s.slice(3)];
        })();
        const i = rng.int(0, 2);
        return numberProblem({
          prompt: t(
            `$${tri(L1)} \\sim ${tri(L2)}$. The area of $${tri(L1)}$ is $${A1}$, the area of $${tri(L2)}$ is $${A2}$, and $${sideName(L1, i)} = ${side}$. Find $${sideName(L2, i)}$.`,
            `$${tri(L1)} \\sim ${tri(L2)}$。$${tri(L1)}$ 的面积为 $${A1}$，$${tri(L2)}$ 的面积为 $${A2}$，$${sideName(L1, i)} = ${side}$。求 $${sideName(L2, i)}$。`,
          ),
          answer,
          wrong: [Q.of(side * A2, A1), Q.of(side * a, b), side + A2 - A1],
          solution: t(
            `The scale factor is $k = \\sqrt{\\frac{${A2}}{${A1}}} = \\sqrt{${fr(A2, A1)}} = ${fr(b, a)}$. So${steps(`${sideName(L2, i)} = ${fr(b, a)} \\cdot ${side} = ${answer}`)}`,
            `相似比为 $k = \\sqrt{\\frac{${A2}}{${A1}}} = \\sqrt{${fr(A2, A1)}} = ${fr(b, a)}$。所以${steps(`${sideName(L2, i)} = ${fr(b, a)} \\cdot ${side} = ${answer}`)}`,
          ),
        });
      },
    },
    {
      id: "area-from-perimeters",
      title: t("Area from perimeters", "由周长求面积"),
      explanation: t(
        "The ratio of perimeters is the scale factor $k$ itself; square it to compare areas.\n\nSimilar hexagons have perimeters $12$ and $18$, and the smaller one has area $20$. Then $k = \\frac{18}{12} = \\frac{3}{2}$, and the larger area is $\\frac{9}{4} \\cdot 20 = 45$.",
        "周长之比就是相似比 $k$；比较面积时要把它平方。\n\n两个相似六边形的周长为 $12$ 和 $18$，较小的面积为 $20$。则 $k = \\frac{18}{12} = \\frac{3}{2}$，较大的面积为 $\\frac{9}{4} \\cdot 20 = 45$。",
      ),
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const g = rng.int(2, 6);
        const [P1, P2] = [a * g, b * g];
        const area = a * a * rng.int(1, a === 1 ? 12 : 6);
        const answer = (area / (a * a)) * b * b;
        const kind = rng.pick(polygonKinds);
        const smallFirst = rng.bool();
        return numberProblem({
          prompt: smallFirst
            ? t(
                `Two similar ${kind.en} have perimeters $${P1}$ and $${P2}$. The smaller one has area $${area}$. Find the area of the larger one.`,
                `两个相似${kind["zh-CN"]}的周长分别为 $${P1}$ 和 $${P2}$。较小的面积为 $${area}$。求较大的面积。`,
              )
            : t(
                `Two similar ${kind.en} have perimeters $${P2}$ and $${P1}$. The one with perimeter $${P1}$ has area $${area}$. Find the area of the other.`,
                `两个相似${kind["zh-CN"]}的周长分别为 $${P2}$ 和 $${P1}$。周长为 $${P1}$ 的那个面积为 $${area}$。求另一个的面积。`,
              ),
          answer,
          wrong: [Q.of(area * b, a), Q.of(area * a * a, b * b), area + P2 - P1],
          solution: t(
            `The scale factor from the smaller to the larger is $\\frac{${P2}}{${P1}} = ${fr(b, a)}$, so the area is multiplied by $${fr(b * b, a * a)}$:${steps(`${fr(b * b, a * a)} \\cdot ${area} = ${answer}`)}`,
            `从较小到较大的相似比为 $\\frac{${P2}}{${P1}} = ${fr(b, a)}$，所以面积乘以 $${fr(b * b, a * a)}$：${steps(`${fr(b * b, a * a)} \\cdot ${area} = ${answer}`)}`,
          ),
        });
      },
    },
  ],
};

// ─── 1.4.5 Similarity transformations ───────────────────────────────────────

/** Motion is a rigid motion in the coordinate plane, with its description. */
interface Motion {
  readonly apply: (p: readonly [number, number]) => [number, number];
  readonly text: Text;
}

/** shift writes v + a: "x + 3", "x - 2", "x". */
const shift = (v: string, a: number) => (a === 0 ? v : a > 0 ? `${v} + ${a}` : `${v} - ${-a}`);

/** translation is the translation by (a, b). */
const translation = (a: number, b: number): Motion => ({
  apply: ([x, y]) => [x + a, y + b],
  text: t(`the translation $(x, y) \\to (${shift("x", a)}, ${shift("y", b)})$`, `平移 $(x, y) \\to (${shift("x", a)}, ${shift("y", b)})$`),
});

const otherMotions: readonly Motion[] = [
  { apply: ([x, y]) => [x, -y], text: t("a reflection across the $x$-axis", "关于 $x$ 轴的轴对称") },
  { apply: ([x, y]) => [-x, y], text: t("a reflection across the $y$-axis", "关于 $y$ 轴的轴对称") },
  { apply: ([x, y]) => [-x, -y], text: t("a rotation of $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$") },
  { apply: ([x, y]) => [-y, x], text: t("a rotation of $90^\\circ$ counterclockwise about the origin", "绕原点逆时针旋转 $90^\\circ$") },
];

/** dilate multiplies coordinates by k. */
const dilate = (k: Q, [x, y]: readonly [number, number]): [number, number] => [k.toNumber() * x, k.toNumber() * y];

/** dilationScales are scale factors for dilations in the coordinate plane. */
const dilationScales: readonly Q[] = [Q.of(2), Q.of(3), Q.of(1, 2), Q.of(3, 2), Q.of(1, 3)];

export const similarityTransformations: TopicDef = {
  id: "similarity-transformations",
  title: t("Similarity Transformations", "相似变换"),
  summary: t(
    "Dilate figures about the origin, combine dilations with rigid motions, and describe a similarity transformation that maps one figure onto another.",
    "以原点为中心作位似，把位似与刚体运动组合，并描述把一个图形变成另一个图形的相似变换。",
  ),
  prerequisites: ["similarity-and-similar-polygons", "translations-of-geometric-figures", "reflections-in-the-coordinate-plane"],
  encompasses: [
    { topic: "dilations-of-geometric-figures", weight: 0.4 },
    { topic: "similarity-and-similar-polygons", weight: 0.3 },
    { topic: "translations-of-geometric-figures", weight: 0.3 },
    { topic: "reflections-in-the-coordinate-plane", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.2", "CCSS.8.G.A.4"],
  knowledgePoints: [
    {
      id: "dilations-centered-at-the-origin",
      title: t("Dilations centered at the origin", "以原点为中心的位似"),
      explanation: t(
        "A dilation centered at the origin with scale factor $k$ multiplies both coordinates by $k$:\n\n$$(x, y) \\to (kx, ky).$$\n\nWith $k = \\frac{1}{2}$, the point $(6, -4)$ goes to $(3, -2)$; with $k = 3$, it goes to $(18, -12)$.",
        "以原点为中心、比例因子为 $k$ 的位似把两个坐标都乘以 $k$：\n\n$$(x, y) \\to (kx, ky)。$$\n\n当 $k = \\frac{1}{2}$ 时，点 $(6, -4)$ 变为 $(3, -2)$；当 $k = 3$ 时，变为 $(18, -12)$。",
      ),
      keyPrerequisites: ["dilations-of-geometric-figures"],
      generate(rng) {
        const k = rng.pick(dilationScales);
        const d = Number(k.d);
        const p: [number, number] = [d * rng.nonZero(-6, 6), d * rng.int(-6, 6)];
        if (rng.bool()) p.reverse();
        const image = dilate(k, p);
        const kn = k.toNumber();
        return pointProblem({
          prompt: t(
            `A dilation centered at the origin with scale factor $${k.toLatex()}$ maps $P${pointLatex(p)}$ to $P'$. Find $P'$.`,
            `以原点为中心、比例因子为 $${k.toLatex()}$ 的位似把 $P${pointLatex(p)}$ 映到 $P'$。求 $P'$。`,
          ),
          answer: image,
          wrong: [
            [Q.of(p[0]).add(k), Q.of(p[1]).add(k)],
            [Q.of(p[0]).div(k), Q.of(p[1]).div(k)],
            [image[0], p[1]],
          ],
          solution: t(
            `Multiply both coordinates by $${k.toLatex()}$:${steps(`P' = (${k.toLatex()} \\cdot ${p[0] < 0 ? `(${p[0]})` : p[0]}, \\; ${k.toLatex()} \\cdot ${p[1] < 0 ? `(${p[1]})` : p[1]}) = ${pointLatex([kn * p[0], kn * p[1]])}`)}`,
            `把两个坐标都乘以 $${k.toLatex()}$：${steps(`P' = (${k.toLatex()} \\cdot ${p[0] < 0 ? `(${p[0]})` : p[0]}, \\; ${k.toLatex()} \\cdot ${p[1] < 0 ? `(${p[1]})` : p[1]}) = ${pointLatex([kn * p[0], kn * p[1]])}`)}`,
          ),
        });
      },
    },
    {
      id: "dilations-followed-by-rigid-motions",
      title: t("A dilation followed by a rigid motion", "位似后接刚体运动"),
      explanation: t(
        "A **similarity transformation** is a sequence of dilations and rigid motions (translations, reflections, rotations). It maps every figure onto a similar figure. Apply the steps in order, each to the result of the one before.\n\nDilate $(2, -3)$ by $2$ about the origin: $(4, -6)$. Then translate by $(x, y) \\to (x - 5, y + 1)$: $(-1, -5)$. Translating first and then dilating would give a different point, $(-6, -4)$.",
        "**相似变换**是若干位似与刚体运动（平移、轴对称、旋转）的复合。它把每个图形变成与它相似的图形。按顺序进行每一步，每一步都作用在上一步的结果上。\n\n以原点为中心、比例因子 $2$ 对 $(2, -3)$ 作位似：$(4, -6)$。再作平移 $(x, y) \\to (x - 5, y + 1)$：$(-1, -5)$。如果先平移再位似，得到的是另一个点 $(-6, -4)$。",
      ),
      keyPrerequisites: ["translations-of-geometric-figures", "reflections-in-the-coordinate-plane"],
      generate(rng) {
        const k = rng.pick(dilationScales);
        const d = Number(k.d);
        const p: [number, number] = [d * rng.nonZero(-5, 5), d * rng.nonZero(-5, 5)];
        const motion = rng.bool() ? translation(rng.nonZero(-6, 6), rng.int(-6, 6)) : rng.pick(otherMotions);
        const mid = dilate(k, p);
        const image = motion.apply(mid);
        const kn = k.toNumber();
        const reversed = motion.apply(p).map((c) => kn * c) as [number, number];
        return pointProblem({
          prompt: t(
            `A dilation centered at the origin with scale factor $${k.toLatex()}$, followed by ${motion.text.en}, maps $P${pointLatex(p)}$ to $P'$. Find $P'$.`,
            `先以原点为中心、比例因子 $${k.toLatex()}$ 作位似，再作${motion.text["zh-CN"]}，把 $P${pointLatex(p)}$ 映到 $P'$。求 $P'$。`,
          ),
          answer: image,
          wrong: [...(reversed.every(Number.isInteger) ? [reversed] : []), mid, motion.apply(p)],
          solution: t(
            `First the dilation: $${pointLatex(p)} \\to ${pointLatex(mid)}$. Then ${motion.text.en}: $${pointLatex(mid)} \\to ${pointLatex(image)}$.`,
            `先位似：$${pointLatex(p)} \\to ${pointLatex(mid)}$。再作${motion.text["zh-CN"]}：$${pointLatex(mid)} \\to ${pointLatex(image)}$。`,
          ),
        });
      },
    },
    {
      id: "describing-a-similarity-transformation",
      title: t("Describing a similarity transformation", "描述相似变换"),
      explanation: t(
        "To describe how one figure maps onto a similar one, find the scale factor from a pair of corresponding sides, dilate the first figure about the origin, then find the rigid motion that moves the dilated figure onto the second.\n\nIf $A(1, 2) \\to A'(5, 3)$ and $B(3, 2) \\to B'(9, 3)$, then $A'B' = 4$ and $AB = 2$, so $k = 2$. Dilating gives $(2, 4)$ and $(6, 4)$; translating by $(x, y) \\to (x + 3, y - 1)$ finishes the job.",
        "要描述一个图形如何变成与它相似的图形，先由一对对应边求相似比，以原点为中心对第一个图形作位似，再找出把位似后的图形移到第二个图形上的刚体运动。\n\n若 $A(1, 2) \\to A'(5, 3)$，$B(3, 2) \\to B'(9, 3)$，则 $A'B' = 4$，$AB = 2$，所以 $k = 2$。位似得到 $(2, 4)$ 和 $(6, 4)$；再作平移 $(x, y) \\to (x + 3, y - 1)$ 即可。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.pick([Q.of(2), Q.of(2), Q.of(3), Q.of(1, 2)]);
          const d = Number(k.d);
          const kn = k.toNumber();
          const lim = d === 2 ? 4 : kn === 3 ? 2 : 3;
          const pre = range(3).map(() => [d * rng.int(-lim, lim), d * rng.int(-lim, lim)] as [number, number]);
          const [a, b] = [rng.int(-5, 5), rng.int(-5, 5)];
          if (a === 0 && b === 0) continue;
          const [p0, p1, p2] = pre as [[number, number], [number, number], [number, number]];
          const area = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1]);
          if (Math.abs(area) < 4 * d * d) continue;
          const img = pre.map((p) => translation(a, b).apply(dilate(k, p)));
          if ([...pre, ...img].some(([x, y]) => Math.abs(x) > 9 || Math.abs(y) > 9)) continue;
          if (img.some(([x, y], i) => x === pre[i]![0] && y === pre[i]![1])) continue;
          const describe = (kk: Q, aa: number, bb: number, translateFirst = false): Text => {
            const tr = translation(aa, bb).text;
            return translateFirst
              ? t(
                  `${tr.en[0]!.toUpperCase()}${tr.en.slice(1)}, then a dilation by $${kk.toLatex()}$ centered at the origin`,
                  `先作${tr["zh-CN"]}，再以原点为中心作比例因子为 $${kk.toLatex()}$ 的位似`,
                )
              : t(
                  `A dilation by $${kk.toLatex()}$ centered at the origin, then ${tr.en}`,
                  `先以原点为中心作比例因子为 $${kk.toLatex()}$ 的位似，再作${tr["zh-CN"]}`,
                );
          };
          const correct = describe(k, a, b);
          const options = rng.shuffle([correct, describe(Q.one.div(k), a, b), describe(k, -a, -b), describe(k, a, b, true)]);
          const pts = (ps: readonly (readonly [number, number])[]) => ps.map((p) => pointLatex(p)).join(", ");
          const marks: PlaneMark[] = [];
          const L = ["A", "B", "C"];
          for (const [ps, prime] of [
            [pre, ""],
            [img, "′"],
          ] as const) {
            for (let i = 0; i < 3; i++) {
              marks.push({ kind: "segment", a: ps[i]!, b: ps[(i + 1) % 3]!, accent: prime !== "" });
            }
            const c = center(ps);
            ps.forEach((p, i) => {
              marks.push({ kind: "point", at: p, label: `${L[i]}${prime}`, dir: compassOf(p[0] - c[0], p[1] - c[1]) });
            });
          }
          const dl = pre.map((p) => dilate(k, p));
          return {
            ...choiceProblem({
              prompt: t(
                `Triangle $ABC$ with vertices $${pts(pre)}$ is mapped onto triangle $A'B'C'$ with vertices $${pts(img)}$. Which sequence of transformations does this?`,
                `顶点为 $${pts(pre)}$ 的三角形 $ABC$ 被映到顶点为 $${pts(img)}$ 的三角形 $A'B'C'$。下列哪个变换序列做到了这一点？`,
              ),
              options,
              correct: options.indexOf(correct),
              solution: t(
                `Compare corresponding sides: $A'B'$ is $${k.toLatex()}$ times as long as $AB$, so the scale factor is $${k.toLatex()}$. Dilating by $${k.toLatex()}$ about the origin gives $${pts(dl)}$, and ${translation(a, b).text.en} moves these onto $${pts(img)}$.`,
                `比较对应边：$A'B'$ 的长是 $AB$ 的 $${k.toLatex()}$ 倍，所以比例因子为 $${k.toLatex()}$。以原点为中心作比例因子 $${k.toLatex()}$ 的位似得到 $${pts(dl)}$，再作${translation(a, b).text["zh-CN"]}，就移到 $${pts(img)}$。`,
              ),
            }),
            figure: {
              svg: plane({ xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 }, marks),
              alt: t(
                `Triangle ABC with vertices ${pts(pre)} and its image A′B′C′ with vertices ${pts(img)} in the coordinate plane.`,
                `坐标平面上顶点为 ${pts(pre)} 的三角形 ABC 及其像 A′B′C′，顶点为 ${pts(img)}。`,
              ),
            },
          };
        }
      },
    },
  ],
};

// ─── 1.4.6 The AA similarity criterion ──────────────────────────────────────

/** NestedFigure is a triangle A (apex), B, C with D on AB and E on AC, DE parallel to BC. */
interface Nested {
  readonly pa: Point;
  readonly pb: Point;
  readonly pc: Point;
  readonly pd: Point;
  readonly pe: Point;
}

/** nestedPoints places a triangle with its apex A up and D, E a fraction f of the way from A to B and to C. */
function nestedPoints(rng: Rng, f: number): Nested {
  const w = rng.int(6, 9);
  const ax = rng.int(2, w - 2) + rng.pick([0, 0.5]);
  const h = rng.int(5, 7);
  const [pa, pb, pc]: [Point, Point, Point] = [
    [ax, h],
    [0, 0],
    [w, 0],
  ];
  return { pa, pb, pc, pd: lerp(pa, pb, f), pe: lerp(pa, pc, f) };
}

/** nestedMarks draws a nested figure with letters, arrows when DE ∥ BC is marked, and labels on AD, DB, DE, BC, AE, EC. */
function nestedMarks(
  n: Nested,
  letters: readonly string[],
  o: {
    arrows?: boolean;
    ad?: string;
    db?: string;
    ae?: string;
    ec?: string;
    de?: string;
    bc?: string;
    ticks?: boolean;
  },
): Mark[] {
  const { pa, pb, pc, pd, pe } = n;
  const marks: Mark[] = [
    { kind: "polygon", points: [pb, pc, pa] },
    { kind: "segment", a: pd, b: pe, accent: true },
    ...names([pa, pb, pc, pd, pe], letters.join(""), center([pa, pb, pc])),
  ];
  if (o.arrows) marks.push({ kind: "arrows", a: pd, b: pe, count: 1 }, { kind: "arrows", a: pb, b: pc, count: 1 });
  if (o.ticks) {
    marks.push(
      { kind: "ticks", a: pa, b: pd, count: 1 },
      { kind: "ticks", a: pd, b: pb, count: 1 },
      { kind: "ticks", a: pa, b: pe, count: 2 },
      { kind: "ticks", a: pe, b: pc, count: 2 },
    );
  }
  const side = (a: Point, b: Point, text?: string) => (text ? [{ kind: "side", a, b, text } as Mark] : []);
  marks.push(
    ...side(pa, pd, o.ad),
    ...side(pd, pb, o.db),
    ...side(pc, pe, o.ec),
    ...side(pe, pa, o.ae),
    ...side(pe, pd, o.de),
    ...side(pb, pc, o.bc),
  );
  return marks;
}

export const theAASimilarityCriterion: TopicDef = {
  id: "the-aa-similarity-criterion",
  title: t("The AA Similarity Criterion", "AA 相似判定"),
  summary: t(
    "Show that triangles are similar from two pairs of congruent angles, write the similarity statement, and use it with a line parallel to a side.",
    "由两组对应角相等判定三角形相似，写出相似式，并用于平行于一边的直线截得的三角形。",
  ),
  prerequisites: ["side-lengths-and-angle-measures-of-similar-polygons"],
  encompasses: [
    { topic: "side-lengths-and-angle-measures-of-similar-polygons", weight: 0.4 },
    { topic: "parallel-lines-and-transversals", weight: 0.2 },
    { topic: "angles-of-a-triangle", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.3"],
  knowledgePoints: [
    {
      id: "similar-by-two-angles",
      title: t("Two pairs of angles", "两组角"),
      explanation: t(
        "**AA similarity criterion:** if two angles of one triangle are congruent to two angles of another, the triangles are similar. (The third angles then match too, since each triangle's angles add up to $180^\\circ$.)\n\nA triangle with angles $40^\\circ$ and $75^\\circ$ has third angle $65^\\circ$. It is similar to a triangle with angles $65^\\circ$ and $40^\\circ$, but not to one with angles $40^\\circ$ and $70^\\circ$.",
        "**AA 相似判定**：如果一个三角形的两个角分别与另一个三角形的两个角相等，那么这两个三角形相似。（由于三角形内角和为 $180^\\circ$，第三个角也相等。）\n\n两个角为 $40^\\circ$ 和 $75^\\circ$ 的三角形，第三个角是 $65^\\circ$。它与两个角为 $65^\\circ$ 和 $40^\\circ$ 的三角形相似，但与两个角为 $40^\\circ$ 和 $70^\\circ$ 的三角形不相似。",
      ),
      keyPrerequisites: ["angles-of-a-triangle"],
      generate(rng) {
        for (;;) {
          const a = rng.int(30, 85);
          const b = rng.int(30, 85);
          const c = 180 - a - b;
          if (c < 25 || new Set([a, b, c]).size < 3) continue;
          const angles = [a, b, c];
          const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
          let [x, y] = [angles[i]!, angles[j]!];
          if (rng.bool()) {
            const dlt = rng.pick([-10, -5, 5, 10]);
            if (rng.bool()) x += dlt;
            else y += dlt;
          }
          const z = 180 - x - y;
          if (z < 20 || x < 20 || y < 20) continue;
          const similar = [x, y, z].sort((p, q) => p - q).join() === [a, b, c].sort((p, q) => p - q).join();
          const letters = rng.pick(sixLetters);
          const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
          const t1 = byAngles(a, b);
          const t2 = posed(byAngles(x, y), pickPose(rng));
          const [p1, p2] = sideBySide(t1, t2, rng.pick([0.7, 1, 1.4]));
          const deg = (v: number) => `${v}°`;
          return {
            ...choiceProblem({
              prompt: t(`Is $${tri(L1)}$ similar to $${tri(L2)}$?`, `$${tri(L1)}$ 与 $${tri(L2)}$ 相似吗？`),
              options: yesNo,
              correct: similar ? 0 : 1,
              solution: t(
                `The third angle of $${tri(L1)}$ is $180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$, and that of $${tri(L2)}$ is $180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ$. The angles are $${[a, b, c].join("^\\circ, ")}^\\circ$ and $${[x, y, z].join("^\\circ, ")}^\\circ$: ${similar ? "the same three angles, so the triangles are similar by AA." : "not the same angles, so the triangles are not similar."}`,
                `$${tri(L1)}$ 的第三个角为 $180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ$，$${tri(L2)}$ 的第三个角为 $180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ$。两组角分别是 $${[a, b, c].join("^\\circ, ")}^\\circ$ 和 $${[x, y, z].join("^\\circ, ")}^\\circ$：${similar ? "三个角相同，所以由 AA 两三角形相似。" : "角不相同，所以两三角形不相似。"}`,
              ),
            }),
            figure: figure(
              [...polyMarks(p1, L1, [], [deg(a), deg(b), null]), ...polyMarks(p2, L2, [], [deg(x), deg(y), null])],
              `Triangle ${L1} with angles ${a}° at ${L1[0]} and ${b}° at ${L1[1]}; triangle ${L2} with angles ${x}° at ${L2[0]} and ${y}° at ${L2[1]}.`,
              `三角形 ${L1}，${L1[0]} 处 ${a}°，${L1[1]} 处 ${b}°；三角形 ${L2}，${L2[0]} 处 ${x}°，${L2[1]} 处 ${y}°。`,
            ),
          };
        }
      },
    },
    {
      id: "writing-the-similarity-statement",
      title: t("Writing the similarity statement", "写出相似式"),
      explanation: t(
        "A similarity statement must pair vertices with equal angles. Find all three angles of each triangle, then match equal angles.\n\nIf $\\angle A = 50^\\circ$, $\\angle B = 60^\\circ$ (so $\\angle C = 70^\\circ$) and $\\angle D = 70^\\circ$, $\\angle E = 50^\\circ$ (so $\\angle F = 60^\\circ$), then $A \\leftrightarrow E$, $B \\leftrightarrow F$, $C \\leftrightarrow D$, and $\\triangle ABC \\sim \\triangle EFD$.",
        "相似式必须把角相等的顶点配对。先求出每个三角形的三个角，再把相等的角对应起来。\n\n若 $\\angle A = 50^\\circ$，$\\angle B = 60^\\circ$（所以 $\\angle C = 70^\\circ$），$\\angle D = 70^\\circ$，$\\angle E = 50^\\circ$（所以 $\\angle F = 60^\\circ$），则 $A \\leftrightarrow E$，$B \\leftrightarrow F$，$C \\leftrightarrow D$，$\\triangle ABC \\sim \\triangle EFD$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(30, 85);
          const b = rng.int(30, 85);
          const c = 180 - a - b;
          if (c < 25 || Math.min(Math.abs(a - b), Math.abs(b - c), Math.abs(c - a)) < 8) continue;
          const angles = [a, b, c];
          // Vertex k of the second triangle has angle angles[perm[k]].
          const perm = rng.shuffle([0, 1, 2]);
          const second = perm.map((k) => angles[k]!);
          const letters = rng.pick(sixLetters);
          const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
          const known2 = rng.sample([0, 1, 2], 2).sort();
          const t2 = byAngles(second[0]!, second[1]!);
          const [p1, p2] = sideBySide(byAngles(a, b), posed(t2, pickPose(rng)), rng.pick([0.7, 1, 1.4]));
          const deg = (v: number) => `${v}°`;
          // The correct name of the second triangle lists the vertex matching each vertex of the first.
          const match = [0, 1, 2].map((i) => L2[perm.indexOf(i)]!);
          const correctName = match.join("");
          const perms = ["012", "021", "102", "120", "201", "210"].map((s) =>
            s
              .split("")
              .map((d) => L2[Number(d)]!)
              .join(""),
          );
          const others = rng.sample(
            perms.filter((p) => p !== correctName),
            3,
          );
          const options = rng.shuffle([correctName, ...others]);
          const arcs2 = [0, 1, 2].map((k) => (known2.includes(k) ? deg(second[k]!) : null));
          const pairs = [0, 1, 2].map((i) => `${L1[i]} \\leftrightarrow ${match[i]}`).join(", \\; ");
          return {
            ...choiceProblem({
              prompt: t(`Which similarity statement is correct?`, `哪个相似式是正确的？`),
              options: options.map((o) => m(`${tri(L1)} \\sim ${tri(o)}`)),
              correct: options.indexOf(correctName),
              solution: t(
                `The angles of $${tri(L1)}$ are $${L1[0]} = ${a}^\\circ$, $${L1[1]} = ${b}^\\circ$, $${L1[2]} = ${c}^\\circ$, and those of $${tri(L2)}$ are $${[0, 1, 2].map((k) => `${L2[k]} = ${second[k]}^\\circ`).join(", ")}$. Match equal angles: $${pairs}$. So $${tri(L1)} \\sim ${tri(correctName)}$ by AA.`,
                `$${tri(L1)}$ 的角为 $${L1[0]} = ${a}^\\circ$，$${L1[1]} = ${b}^\\circ$，$${L1[2]} = ${c}^\\circ$；$${tri(L2)}$ 的角为 $${[0, 1, 2].map((k) => `${L2[k]} = ${second[k]}^\\circ`).join(", ")}$。把相等的角配对：$${pairs}$。所以由 AA，$${tri(L1)} \\sim ${tri(correctName)}$。`,
              ),
            }),
            figure: figure(
              [...polyMarks(p1, L1, [], [deg(a), deg(b), null]), ...polyMarks(p2, L2, [], arcs2)],
              `Triangle ${L1} with angles ${a}° at ${L1[0]} and ${b}° at ${L1[1]}; triangle ${L2} with angles ${known2.map((k) => `${second[k]}° at ${L2[k]}`).join(" and ")}.`,
              `三角形 ${L1}，${L1[0]} 处 ${a}°，${L1[1]} 处 ${b}°；三角形 ${L2}，${known2.map((k) => `${L2[k]} 处 ${second[k]}°`).join("，")}。`,
            ),
          };
        }
      },
    },
    {
      id: "a-line-parallel-to-a-side",
      title: t("A line parallel to a side", "平行于一边的直线"),
      explanation: t(
        `If $D$ is on $\\overline{AB}$, $E$ is on $\\overline{AC}$ and $\\overline{DE} \\parallel \\overline{BC}$, then $\\angle ADE \\cong \\angle ABC$ (corresponding angles) and $\\angle A$ is shared, so $\\triangle ADE \\sim \\triangle ABC$ by AA. Compare **whole** sides: $\\frac{DE}{BC} = \\frac{AD}{AB}$, with $AB = AD + DB$.\n\nIf $AD = 4$, $DB = 6$ and $DE = 6$, then $AB = 10$ and${steps("\\frac{BC}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad BC = 15")}`,
        `若 $D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上，且 $\\overline{DE} \\parallel \\overline{BC}$，则 $\\angle ADE \\cong \\angle ABC$（同位角），$\\angle A$ 是公共角，所以由 AA，$\\triangle ADE \\sim \\triangle ABC$。比较的是**整条**边：$\\frac{DE}{BC} = \\frac{AD}{AB}$，其中 $AB = AD + DB$。\n\n若 $AD = 4$，$DB = 6$，$DE = 6$，则 $AB = 10$，${steps("\\frac{BC}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad BC = 15")}`,
      ),
      keyPrerequisites: ["parallel-lines-and-transversals"],
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const u = rng.int(1, 4);
        const v = rng.int(2, 5);
        const [AD, AB, DE, BC] = [a * u, b * u, a * v, b * v];
        const DB = AB - AD;
        const n = nestedPoints(rng, a / b);
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const findBC = rng.bool();
        const fig = figure(
          nestedMarks(n, L, { arrows: true, ad: String(AD), db: String(DB), de: findBC ? String(DE) : "x", bc: findBC ? "x" : String(BC) }),
          `Triangle ${A}${B}${C} with ${D} on ${A}${B} and ${E} on ${A}${C}, ${D}${E} parallel to ${B}${C}; ${A}${D} = ${AD}, ${D}${B} = ${DB}, ${findBC ? `${D}${E} = ${DE}, ${B}${C} = x` : `${B}${C} = ${BC}, ${D}${E} = x`}.`,
          `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，${D}${E} ∥ ${B}${C}；${A}${D} = ${AD}，${D}${B} = ${DB}，${findBC ? `${D}${E} = ${DE}，${B}${C} = x` : `${B}${C} = ${BC}，${D}${E} = x`}。`,
        );
        const answer = findBC ? BC : DE;
        const line = findBC ? prop("x", String(DE), String(AB), String(AD)) : prop("x", String(BC), String(AD), String(AB));
        return {
          ...numberProblem({
            prompt: t(`In the figure, $${D}${E} \\parallel ${B}${C}$. Find $x$.`, `如图，$${D}${E} \\parallel ${B}${C}$。求 $x$。`),
            answer,
            solveFor: "x",
            wrong: findBC ? [Q.of(DE * DB, AD), DE + DB] : [Q.of(BC * AD, DB), BC - DB],
            solution: t(
              `$\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}$ by AA, and $${A}${B} = ${AD} + ${DB} = ${AB}$:${steps(line, `x = ${answer}`)}`,
              `由 AA，$\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}$，且 $${A}${B} = ${AD} + ${DB} = ${AB}$：${steps(line, `x = ${answer}`)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
  ],
};

// ─── 1.4.7 The SSS similarity criterion ─────────────────────────────────────

/** sortedRatios writes the ratios of sorted sides of two triangles, for solutions. */
function sortedRatios(s1: readonly number[], s2: readonly number[]): string {
  const [x, y] = [[...s1].sort((p, q) => p - q), [...s2].sort((p, q) => p - q)];
  return x.map((v, i) => `\\frac{${y[i]}}{${v}} = ${fr(y[i]!, v)}`).join(", \\quad ");
}

export const theSSSSimilarityCriterion: TopicDef = {
  id: "the-sss-similarity-criterion",
  title: t("The SSS Similarity Criterion", "SSS 相似判定"),
  summary: t(
    "Show that triangles are similar when all three pairs of corresponding sides are proportional, and use the criterion to find scale factors and unknowns.",
    "由三组对应边成比例判定三角形相似，并用它求相似比和未知数。",
  ),
  prerequisites: ["side-lengths-and-angle-measures-of-similar-polygons"],
  encompasses: [
    { topic: "side-lengths-and-angle-measures-of-similar-polygons", weight: 0.4 },
    { topic: "proportions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "checking-three-ratios",
      title: t("Checking three ratios", "检验三个比"),
      explanation: t(
        "**SSS similarity criterion:** if the three sides of one triangle are proportional to the three sides of another, the triangles are similar.\n\nTo check, sort each triangle's sides from shortest to longest and divide: shortest by shortest, middle by middle, longest by longest. Sides $4, 6, 8$ and $6, 9, 12$: $\\frac{6}{4} = \\frac{9}{6} = \\frac{12}{8} = \\frac{3}{2}$, so similar. Sides $4, 6, 8$ and $6, 9, 11$: $\\frac{11}{8} \\ne \\frac{3}{2}$, so not similar.",
        "**SSS 相似判定**：如果一个三角形的三条边与另一个三角形的三条边成比例，那么这两个三角形相似。\n\n检验时，把每个三角形的边从短到长排列再相除：最短比最短，中间比中间，最长比最长。三边 $4, 6, 8$ 与 $6, 9, 12$：$\\frac{6}{4} = \\frac{9}{6} = \\frac{12}{8} = \\frac{3}{2}$，所以相似。三边 $4, 6, 8$ 与 $6, 9, 11$：$\\frac{11}{8} \\ne \\frac{3}{2}$，所以不相似。",
      ),
      generate(rng) {
        for (;;) {
          const sh = pickShape(rng);
          const [a, b] = rng.pick(scales);
          const [u, v] = rng.bool() ? [a, b] : [b, a];
          const s1 = sh.map((x) => x * u) as unknown as Tri3;
          let s2 = sh.map((x) => x * v);
          if (rng.bool()) {
            const i = rng.int(0, 2);
            s2[i] = s2[i]! + rng.pick([-2, -1, 1, 2]);
          }
          const pose = pickPose(rng);
          const r = rng.int(0, 2);
          s2 = [s2[r]!, s2[(r + 1) % 3]!, s2[(r + 2) % 3]!];
          const s2t = s2 as unknown as Tri3;
          if (!isTriangle(s2t) || Math.max(...s1, ...s2) > 60) continue;
          const [x, y] = [[...s1].sort((p, q) => p - q), [...s2].sort((p, q) => p - q)];
          const similar = x.every((w, i) => w * y[0]! === y[i]! * x[0]!);
          const letters = rng.pick(sixLetters);
          const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
          const [p1, p2] = sideBySide(bySides(s1), posed(bySides(s2t), pose), v / u);
          return {
            ...choiceProblem({
              prompt: t(`Is $${tri(L1)}$ similar to $${tri(L2)}$?`, `$${tri(L1)}$ 与 $${tri(L2)}$ 相似吗？`),
              options: yesNo,
              correct: similar ? 0 : 1,
              solution: t(
                `Sort the sides and compare:${steps(sortedRatios(s1, s2))}${similar ? "All three ratios are equal, so the triangles are similar by SSS." : "The ratios are not all equal, so the triangles are not similar."}`,
                `把边排序后比较：${steps(sortedRatios(s1, s2))}${similar ? "三个比都相等，所以由 SSS 两三角形相似。" : "三个比不全相等，所以两三角形不相似。"}`,
              ),
            }),
            figure: figure(
              [...polyMarks(p1, L1, s1.map(String)), ...polyMarks(p2, L2, s2.map(String))],
              `Triangle ${L1} with sides ${s1.join(", ")} and triangle ${L2} with sides ${s2.join(", ")}.`,
              `三角形 ${L1}，三边为 ${s1.join("、")}；三角形 ${L2}，三边为 ${s2.join("、")}。`,
            ),
          };
        }
      },
    },
    {
      id: "matching-sides-and-the-scale-factor",
      title: t("Matching sides and the scale factor", "对应边与相似比"),
      explanation: t(
        "When two triangles are similar by SSS, the shortest side corresponds to the shortest side, and so on, wherever the sides are drawn. The scale factor is any of the equal ratios.\n\nIf $\\triangle ABC$ has sides $AB = 8$, $BC = 6$, $CA = 10$ and $\\triangle DEF$ has sides $DE = 9$, $EF = 15$, $FD = 12$, then $BC \\leftrightarrow DE$, $AB \\leftrightarrow FD$, $CA \\leftrightarrow EF$, and the scale factor from $\\triangle ABC$ to $\\triangle DEF$ is $\\frac{9}{6} = \\frac{3}{2}$.",
        "两个三角形由 SSS 相似时，无论边画在什么位置，最短边对应最短边，依此类推。相似比就是这几个相等的比。\n\n若 $\\triangle ABC$ 的边为 $AB = 8$，$BC = 6$，$CA = 10$，$\\triangle DEF$ 的边为 $DE = 9$，$EF = 15$，$FD = 12$，则 $BC \\leftrightarrow DE$，$AB \\leftrightarrow FD$，$CA \\leftrightarrow EF$，从 $\\triangle ABC$ 到 $\\triangle DEF$ 的相似比为 $\\frac{9}{6} = \\frac{3}{2}$。",
      ),
      generate(rng) {
        const sh = pickShape(rng);
        const [a, b] = rng.pick(scales);
        const [u, v] = rng.bool() ? [a, b] : [b, a];
        const s1 = sh.map((x) => x * u) as unknown as Tri3;
        const r = rng.int(1, 2);
        const s2 = [sh[r]! * v, sh[(r + 1) % 3]! * v, sh[(r + 2) % 3]! * v] as const;
        const letters = rng.pick(sixLetters);
        const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
        const [p1, p2] = sideBySide(bySides(s1), posed(bySides(s2), pickPose(rng)), v / u);
        const k = Q.of(v, u);
        return {
          ...numberProblem({
            prompt: t(
              `The triangles are similar. Find the scale factor from $${tri(L1)}$ to $${tri(L2)}$.`,
              `这两个三角形相似。求从 $${tri(L1)}$ 到 $${tri(L2)}$ 的相似比。`,
            ),
            answer: k,
            form: "fraction",
            wrong: [Q.one.div(k), Q.of(s2[0], s1[0]), Q.of(s2[1], s1[1])],
            solution: t(
              `Match the sides by size:${steps(sortedRatios(s1, s2))}The scale factor is $${k.toLatex()}$.`,
              `按大小配对各边：${steps(sortedRatios(s1, s2))}相似比为 $${k.toLatex()}$。`,
            ),
          }),
          figure: figure(
            [...polyMarks(p1, L1, s1.map(String)), ...polyMarks(p2, L2, s2.map(String))],
            `Triangle ${L1} with sides ${s1.join(", ")} and triangle ${L2} with sides ${s2.join(", ")}.`,
            `三角形 ${L1}，三边为 ${s1.join("、")}；三角形 ${L2}，三边为 ${s2.join("、")}。`,
          ),
        };
      },
    },
    {
      id: "finding-an-unknown-for-sss",
      title: t("Finding an unknown side", "求未知边"),
      explanation: t(
        "To make two triangles similar by SSS, the unknown side must give the same ratio as the known pairs. Find the scale factor from a known pair, then solve.\n\n$\\triangle ABC$ has $AB = 4$, $BC = 5$, $CA = 6$, and $\\triangle DEF$ has $DE = 6$, $EF = 7.5$, $FD = 2x + 1$. The scale factor is $\\frac{6}{4} = \\frac{3}{2}$, so $FD = \\frac{3}{2} \\cdot 6 = 9$: $2x + 1 = 9$, $x = 4$.",
        "要使两个三角形由 SSS 相似，未知的边必须与已知的各对边有相同的比。先由一对已知边求出相似比，再解方程。\n\n$\\triangle ABC$ 中 $AB = 4$，$BC = 5$，$CA = 6$；$\\triangle DEF$ 中 $DE = 6$，$EF = 7.5$，$FD = 2x + 1$。相似比为 $\\frac{6}{4} = \\frac{3}{2}$，所以 $FD = \\frac{3}{2} \\cdot 6 = 9$：$2x + 1 = 9$，$x = 4$。",
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        for (;;) {
          const sh = pickShape(rng);
          const [a, b] = rng.pick(scales);
          const [u, v] = rng.bool() ? [a, b] : [b, a];
          const j = rng.int(0, 2);
          const target = sh[j]! * v;
          const x = rng.int(2, 9);
          const c = rng.int(2, 4);
          const d = target - c * x;
          if (d === 0 || Math.abs(d) > 15) continue;
          const letters = rng.pick(sixLetters);
          const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
          const i = (j + 1) % 3;
          const sides1 = [0, 1, 2].map((k) => `${sideName(L1, k)} = ${sh[k]! * u}`).join(", \\; ");
          const sides2 = [0, 1, 2].map((k) => `${sideName(L2, k)} = ${k === j ? linear(c, d) : sh[k]! * v}`).join(", \\; ");
          const k = Q.of(v, u);
          return numberProblem({
            prompt: t(
              `In $${tri(L1)}$, $${sides1}$. In $${tri(L2)}$, $${sides2}$. Find $x$ so that $${tri(L1)} \\sim ${tri(L2)}$.`,
              `在 $${tri(L1)}$ 中，$${sides1}$。在 $${tri(L2)}$ 中，$${sides2}$。求 $x$，使 $${tri(L1)} \\sim ${tri(L2)}$。`,
            ),
            answer: x,
            solveFor: "x",
            wrong: [target, Q.of(sh[j]! * u - d, c), Q.of(sh[j]! * u * u - d * v, c * v)],
            solution: t(
              `The scale factor is $\\frac{${sideName(L2, i)}}{${sideName(L1, i)}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}} = ${k.toLatex()}$, so $${sideName(L2, j)} = ${k.toLatex()} \\cdot ${sh[j]! * u} = ${target}$:${steps(`${linear(c, d)} = ${target}`, `x = ${x}`)}`,
              `相似比为 $\\frac{${sideName(L2, i)}}{${sideName(L1, i)}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}} = ${k.toLatex()}$，所以 $${sideName(L2, j)} = ${k.toLatex()} \\cdot ${sh[j]! * u} = ${target}$：${steps(`${linear(c, d)} = ${target}`, `x = ${x}`)}`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 1.4.8 The SAS similarity criterion ─────────────────────────────────────

export const theSASSimilarityCriterion: TopicDef = {
  id: "the-sas-similarity-criterion",
  title: t("The SAS Similarity Criterion", "SAS 相似判定"),
  summary: t(
    "Show that triangles are similar from two proportional sides and the congruent angles between them, including triangles that share an angle.",
    "由两边成比例且夹角相等判定三角形相似，包括有公共角的三角形。",
  ),
  prerequisites: ["the-aa-similarity-criterion", "the-sss-similarity-criterion"],
  encompasses: [
    { topic: "the-sss-similarity-criterion", weight: 0.3 },
    { topic: "proportions", weight: 0.3 },
    { topic: "the-aa-similarity-criterion", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "checking-sas",
      title: t("Two sides and the included angle", "两边及其夹角"),
      explanation: t(
        "**SAS similarity criterion:** if two sides of one triangle are proportional to two sides of another and the angles **between** those sides are congruent, the triangles are similar.\n\nSides $4$ and $6$ with $50^\\circ$ between them, and sides $6$ and $9$ with $50^\\circ$ between them: $\\frac{6}{4} = \\frac{9}{6} = \\frac{3}{2}$ and the included angles match, so the triangles are similar. If the angles were $50^\\circ$ and $55^\\circ$, or the sides $6$ and $10$, they would not be.",
        "**SAS 相似判定**：如果一个三角形的两边与另一个三角形的两边成比例，并且这两边的**夹角**相等，那么这两个三角形相似。\n\n两边 $4$、$6$ 夹 $50^\\circ$，与两边 $6$、$9$ 夹 $50^\\circ$：$\\frac{6}{4} = \\frac{9}{6} = \\frac{3}{2}$，夹角相等，所以相似。如果夹角是 $50^\\circ$ 和 $55^\\circ$，或者两边是 $6$ 和 $10$，就不相似。",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(2, 7);
          const q = rng.int(2, 7);
          if (p === q) continue;
          const [a, b] = rng.pick(scales);
          const [u, v] = rng.bool() ? [a, b] : [b, a];
          const theta = rng.int(35, 120);
          let [p2, q2, th2] = [p * v, q * v, theta];
          const change = rng.int(0, 2);
          if (change === 1) th2 += rng.pick([-12, -8, -5, 5, 8, 12]);
          if (change === 2) q2 += rng.pick([-2, -1, 1, 2]);
          if (rng.bool()) [p2, q2] = [q2, p2];
          const [p1, q1] = [p * u, q * u];
          if (Math.max(p1, q1, p2, q2) > 40 || Math.min(p2, q2) < 2) continue;
          const similar = th2 === theta && (p2 * q1 === q2 * p1 || p2 * p1 === q2 * q1);
          const letters = rng.pick(sixLetters);
          const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
          const [f1, f2] = sideBySide(bySas(p1, q1, theta), posed(bySas(p2, q2, th2), pickPose(rng)), v / u);
          const deg = (x: number) => `${x}°`;
          const [lo1, hi1] = [Math.min(p1, q1), Math.max(p1, q1)];
          const [lo2, hi2] = [Math.min(p2, q2), Math.max(p2, q2)];
          const ratios = `\\frac{${lo2}}{${lo1}} = ${fr(lo2, lo1)}, \\quad \\frac{${hi2}}{${hi1}} = ${fr(hi2, hi1)}`;
          const reason =
            th2 !== theta
              ? t(
                  `The included angles are $${theta}^\\circ$ and $${th2}^\\circ$, which are not congruent, so the triangles are not similar.`,
                  `夹角分别为 $${theta}^\\circ$ 和 $${th2}^\\circ$，不相等，所以两三角形不相似。`,
                )
              : similar
                ? t(
                    `The ratios are equal and the included angles are both $${theta}^\\circ$, so the triangles are similar by SAS.`,
                    `两个比相等，夹角都是 $${theta}^\\circ$，所以由 SAS 两三角形相似。`,
                  )
                : t(
                    "The included angles match, but the sides are not proportional, so the triangles are not similar.",
                    "夹角相等，但两边不成比例，所以两三角形不相似。",
                  );
          return {
            ...choiceProblem({
              prompt: t(`Is $${tri(L1)}$ similar to $${tri(L2)}$?`, `$${tri(L1)}$ 与 $${tri(L2)}$ 相似吗？`),
              options: yesNo,
              correct: similar ? 0 : 1,
              solution: t(
                `Compare the sides next to the marked angles, shorter with shorter:${steps(ratios)}${reason.en}`,
                `比较标出角的两边，短边比短边：${steps(ratios)}${reason["zh-CN"]}`,
              ),
            }),
            figure: figure(
              [
                ...polyMarks(f1, L1, [String(p1), null, String(q1)], [deg(theta), null, null]),
                ...polyMarks(f2, L2, [String(p2), null, String(q2)], [deg(th2), null, null]),
              ],
              `Triangle ${L1} with sides ${p1} and ${q1} and the angle ${theta}° between them at ${L1[0]}; triangle ${L2} with sides ${p2} and ${q2} and the angle ${th2}° between them at ${L2[0]}.`,
              `三角形 ${L1}，两边 ${p1}、${q1}，在 ${L1[0]} 处夹角 ${theta}°；三角形 ${L2}，两边 ${p2}、${q2}，在 ${L2[0]} 处夹角 ${th2}°。`,
            ),
          };
        }
      },
    },
    {
      id: "triangles-sharing-an-angle",
      title: t("Triangles sharing an angle", "有公共角的三角形"),
      explanation: t(
        "Two triangles that share an angle are similar by SAS when the sides along that angle are proportional, but check which sides pair up. With $D$ on $\\overline{AB}$ and $E$ on $\\overline{AC}$:\n\n- if $\\frac{AD}{AB} = \\frac{AE}{AC}$, then $\\triangle ADE \\sim \\triangle ABC$;\n- if $\\frac{AD}{AC} = \\frac{AE}{AB}$, then $\\triangle ADE \\sim \\triangle ACB$, so $D$ matches $C$ and $E$ matches $B$.\n\nWith $AD = 3$, $AE = 4$, $AB = 8$, $AC = 6$ and $BC = 10$: $\\frac{3}{6} = \\frac{4}{8} = \\frac{1}{2}$, so $\\triangle ADE \\sim \\triangle ACB$ and $DE = \\frac{1}{2} \\cdot 10 = 5$.",
        "有公共角的两个三角形，如果夹这个角的两边成比例，就由 SAS 相似，但要看清哪两条边对应。设 $D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上：\n\n- 若 $\\frac{AD}{AB} = \\frac{AE}{AC}$，则 $\\triangle ADE \\sim \\triangle ABC$；\n- 若 $\\frac{AD}{AC} = \\frac{AE}{AB}$，则 $\\triangle ADE \\sim \\triangle ACB$，即 $D$ 对应 $C$，$E$ 对应 $B$。\n\n当 $AD = 3$，$AE = 4$，$AB = 8$，$AC = 6$，$BC = 10$ 时：$\\frac{3}{6} = \\frac{4}{8} = \\frac{1}{2}$，所以 $\\triangle ADE \\sim \\triangle ACB$，$DE = \\frac{1}{2} \\cdot 10 = 5$。",
      ),
      generate(rng) {
        for (;;) {
          const sh = pickShape(rng);
          const [a, b] = rng.pick(scales);
          const g = rng.int(1, 2);
          const [AB, BC, CA] = [sh[0] * b * g, sh[1] * b * g, sh[2] * b * g];
          const reversed = rng.bool();
          const k = Q.of(a, b);
          const [AD, AE] = reversed ? [sh[2] * a * g, sh[0] * a * g] : [sh[0] * a * g, sh[2] * a * g];
          if (AD >= AB || AE >= CA) continue;
          if (reversed && Math.abs(AD * CA - AE * AB) === 0) continue;
          const DE = sh[1] * a * g;
          const [A, B, C, D, E] = pickFive(rng);
          const [pa, pb, pc] = bySides([AB, BC, CA]);
          const pd = lerp(pa, pb, AD / AB);
          const pe = lerp(pa, pc, AE / CA);
          const pose = pickPose(rng);
          const [qa, qb, qc, qd, qe] = posed([pa, pb, pc, pd, pe], pose) as [Point, Point, Point, Point, Point];
          const fig = figure(
            [
              { kind: "polygon", points: [qa, qb, qc] },
              { kind: "segment", a: qd, b: qe, accent: true },
              { kind: "arc", vertex: qa, from: qb, to: qc },
              ...names([qa, qb, qc, qd, qe], `${A}${B}${C}${D}${E}`, center([qa, qb, qc])),
            ],
            `Triangle ${A}${B}${C} with ${D} on ${A}${B}, ${E} on ${A}${C}, and segment ${D}${E}.`,
            `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，连接 ${D}${E}。`,
          );
          const facts = `${A}${D} = ${AD}, \\; ${A}${E} = ${AE}, \\; ${A}${B} = ${AB}, \\; ${A}${C} = ${CA}, \\; ${B}${C} = ${BC}`;
          const ratios = reversed
            ? `\\frac{${A}${D}}{${A}${C}} = \\frac{${AD}}{${CA}} = ${k.toLatex()}, \\quad \\frac{${A}${E}}{${A}${B}} = \\frac{${AE}}{${AB}} = ${k.toLatex()}`
            : `\\frac{${A}${D}}{${A}${B}} = \\frac{${AD}}{${AB}} = ${k.toLatex()}, \\quad \\frac{${A}${E}}{${A}${C}} = \\frac{${AE}}{${CA}} = ${k.toLatex()}`;
          const statement = reversed
            ? `\\triangle ${A}${D}${E} \\sim \\triangle ${A}${C}${B}`
            : `\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`;
          return {
            ...numberProblem({
              prompt: t(`In the figure, $${facts}$. Find $${D}${E}$.`, `如图，$${facts}$。求 $${D}${E}$。`),
              answer: DE,
              wrong: [Q.of(BC * AD, AB), Q.of(BC * AE, AB), Q.of(BC * AD, CA)],
              solution: t(
                `The triangles share $\\angle ${A}$. Pair the sides along it:${steps(ratios)}So $${statement}$ by SAS, with scale factor $${k.toLatex()}$:${steps(`${D}${E} = ${k.toLatex()} \\cdot ${BC} = ${DE}`)}`,
                `两个三角形有公共角 $\\angle ${A}$。把夹这个角的边配对：${steps(ratios)}所以由 SAS，$${statement}$，相似比为 $${k.toLatex()}$：${steps(`${D}${E} = ${k.toLatex()} \\cdot ${BC} = ${DE}`)}`,
              ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "finding-an-unknown-for-sas",
      title: t("Finding an unknown for SAS", "用 SAS 求未知数"),
      explanation: t(
        `When the included angles are congruent, the triangles are similar exactly when the two pairs of sides have the same ratio. Set the ratios equal and solve.\n\nWith $\\angle A \\cong \\angle D$, $AB = 6$, $AC = 8$, $DE = 9$ and $DF = x + 5$:${steps("\\frac{x + 5}{8} = \\frac{9}{6} \\quad\\Rightarrow\\quad x + 5 = 12 \\quad\\Rightarrow\\quad x = 7")}`,
        `当夹角相等时，两三角形相似当且仅当两组边的比相等。令两个比相等，再解方程。\n\n若 $\\angle A \\cong \\angle D$，$AB = 6$，$AC = 8$，$DE = 9$，$DF = x + 5$：${steps("\\frac{x + 5}{8} = \\frac{9}{6} \\quad\\Rightarrow\\quad x + 5 = 12 \\quad\\Rightarrow\\quad x = 7")}`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        for (;;) {
          const p = rng.int(2, 7);
          const q = rng.int(2, 7);
          if (p === q) continue;
          const [a, b] = rng.pick(scales);
          const [u, v] = rng.bool() ? [a, b] : [b, a];
          const theta = rng.int(35, 120);
          const target = q * v;
          const x = rng.int(2, 9);
          const c = rng.int(1, 4);
          const d = target - c * x;
          if (d === 0 || Math.abs(d) > 15) continue;
          const letters = rng.pick(sixLetters);
          const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
          const [f1, f2] = sideBySide(bySas(p * u, q * u, theta), posed(bySas(p * v, q * v, theta), pickPose(rng)), v / u);
          const deg = `${theta}°`;
          const k = Q.of(v, u);
          return {
            ...numberProblem({
              prompt: t(`Find $x$ so that $${tri(L1)} \\sim ${tri(L2)}$.`, `求 $x$，使 $${tri(L1)} \\sim ${tri(L2)}$。`),
              answer: x,
              solveFor: "x",
              wrong: [target, Q.of(q * u - d, c), Q.of(p * u * u - d * v, c * v)],
              solution: t(
                `The included angles at $${L1[0]}$ and $${L2[0]}$ are both $${theta}^\\circ$, so the sides must be proportional:${steps(prop(linear(c, d), String(q * u), String(p * v), String(p * u)), `${linear(c, d)} = ${k.toLatex()} \\cdot ${q * u} = ${target}`, `x = ${x}`)}`,
                `$${L1[0]}$ 与 $${L2[0]}$ 处的夹角都是 $${theta}^\\circ$，所以两边必须成比例：${steps(prop(linear(c, d), String(q * u), String(p * v), String(p * u)), `${linear(c, d)} = ${k.toLatex()} \\cdot ${q * u} = ${target}`, `x = ${x}`)}`,
              ),
            }),
            figure: figure(
              [
                ...polyMarks(f1, L1, [String(p * u), null, String(q * u)], [deg, null, null]),
                ...polyMarks(f2, L2, [String(p * v), null, plain(c, d)], [deg, null, null]),
              ],
              `Triangle ${L1} with sides ${p * u} and ${q * u} around the ${theta}° angle at ${L1[0]}; triangle ${L2} with sides ${p * v} and ${plain(c, d)} around the ${theta}° angle at ${L2[0]}.`,
              `三角形 ${L1}，${L1[0]} 处 ${theta}° 角的两边为 ${p * u}、${q * u}；三角形 ${L2}，${L2[0]} 处 ${theta}° 角的两边为 ${p * v}、${plain(c, d)}。`,
            ),
          };
        }
      },
    },
  ],
};

// ─── 1.4.9 Combining similarity criteria ────────────────────────────────────

/** bowtiePoints places segments AD and BC crossing at E, with AB ∥ CD: EA = ea, EB = eb, ED = k·ea, EC = k·eb. */
function bowtiePoints(rng: Rng, ea: number, eb: number, k: number): { pa: Point; pb: Point; pc: Point; pd: Point; pe: Point } {
  const t1 = rng.int(140, 160);
  const t2 = rng.int(20, 40);
  const pe: Point = [0, 0];
  return { pa: dir(t1, ea), pb: dir(t2, eb), pd: dir(t1 + 180, ea * k), pc: dir(t2 + 180, eb * k), pe };
}

/** objects are tall objects for shadow problems. */
const tallObjects: readonly Text[] = [
  t("a tree", "一棵树"),
  t("a flagpole", "一根旗杆"),
  t("a building", "一栋楼"),
  t("a lamppost", "一根路灯杆"),
  t("a tower", "一座塔"),
];

const criteria = [t("AA", "AA"), t("SSS", "SSS"), t("SAS", "SAS"), t("Not enough information", "条件不足")];

export const combiningSimilarityCriteriaForTriangles: TopicDef = {
  id: "combining-similarity-criteria-for-triangles",
  title: t("Combining Similarity Criteria for Triangles", "综合运用三角形相似判定"),
  summary: t(
    "Choose the criterion that proves two triangles similar, and use similar triangles formed by crossing segments and by shadows.",
    "选择证明两三角形相似的判定方法，并运用相交线段和影子构成的相似三角形。",
  ),
  prerequisites: ["the-sas-similarity-criterion"],
  encompasses: [
    { topic: "the-aa-similarity-criterion", weight: 0.4 },
    { topic: "the-sas-similarity-criterion", weight: 0.4 },
    { topic: "the-sss-similarity-criterion", weight: 0.3 },
    { topic: "proportions", weight: 0.3 },
    { topic: "parallel-lines-and-transversals", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "choosing-a-criterion",
      title: t("Choosing a criterion", "选择判定方法"),
      explanation: t(
        "Three criteria prove triangles similar:\n\n- **AA**: two pairs of congruent angles;\n- **SSS**: all three pairs of sides proportional;\n- **SAS**: two pairs of sides proportional and the angles **between** them congruent.\n\nOne pair of angles, two pairs of proportional sides alone, or two proportional sides with a congruent angle that is **not** between them (SSA) are not enough.",
        "证明三角形相似有三种判定方法：\n\n- **AA**：两组对应角相等；\n- **SSS**：三组对应边成比例；\n- **SAS**：两组对应边成比例，且它们的**夹角**相等。\n\n只有一组角相等、只有两组边成比例，或者两组边成比例但相等的角**不是**夹角（SSA），都不足以判定相似。",
      ),
      generate(rng) {
        const [A, B, C, D, E, F] = rng.pick(sixLetters).split("") as [string, string, string, string, string, string];
        const kind = rng.int(0, 5);
        const [a, b] = rng.pick(scales);
        const [u, v] = rng.bool() ? [a, b] : [b, a];
        const sh = pickShape(rng);
        const angle = rng.int(35, 110);
        let facts: string;
        let correct: number;
        let why: Text;
        if (kind === 0) {
          const x = rng.int(30, 75);
          const y = rng.int(30, 75);
          const z = 180 - x - y;
          const third = rng.bool();
          facts = third
            ? `m\\angle ${A} = ${x}^\\circ, \\; m\\angle ${B} = ${y}^\\circ, \\; m\\angle ${D} = ${x}^\\circ, \\; m\\angle ${F} = ${z}^\\circ`
            : `m\\angle ${A} = m\\angle ${D} = ${x}^\\circ, \\; m\\angle ${B} = m\\angle ${E} = ${y}^\\circ`;
          correct = 0;
          why = third
            ? t(
                `$m\\angle ${C} = 180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ = m\\angle ${F}$, and $\\angle ${A} \\cong \\angle ${D}$: two pairs of congruent angles, so AA.`,
                `$m\\angle ${C} = 180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ = m\\angle ${F}$，且 $\\angle ${A} \\cong \\angle ${D}$：两组角相等，所以用 AA。`,
              )
            : t("Two pairs of congruent angles: AA.", "两组角相等：AA。");
        } else if (kind === 1) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${B}${C} = ${sh[1] * u}, \\; ${C}${A} = ${sh[2] * u}, \\; ${D}${E} = ${sh[0] * v}, \\; ${E}${F} = ${sh[1] * v}, \\; ${F}${D} = ${sh[2] * v}`;
          correct = 1;
          why = t(`All three ratios equal $${fr(v, u)}$, so SSS.`, `三个比都等于 $${fr(v, u)}$，所以用 SSS。`);
        } else if (kind === 2) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${A}${C} = ${sh[2] * u}, \\; m\\angle ${A} = ${angle}^\\circ, \\; ${D}${E} = ${sh[0] * v}, \\; ${D}${F} = ${sh[2] * v}, \\; m\\angle ${D} = ${angle}^\\circ`;
          correct = 2;
          why = t(
            `$\\frac{${D}${E}}{${A}${B}} = \\frac{${D}${F}}{${A}${C}} = ${fr(v, u)}$, and $\\angle ${A}$, $\\angle ${D}$ lie between these sides: SAS.`,
            `$\\frac{${D}${E}}{${A}${B}} = \\frac{${D}${F}}{${A}${C}} = ${fr(v, u)}$，且 $\\angle ${A}$、$\\angle ${D}$ 是这两边的夹角：SAS。`,
          );
        } else if (kind === 3) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${B}${C} = ${sh[1] * u}, \\; m\\angle ${A} = ${angle}^\\circ, \\; ${D}${E} = ${sh[0] * v}, \\; ${E}${F} = ${sh[1] * v}, \\; m\\angle ${D} = ${angle}^\\circ`;
          correct = 3;
          why = t(
            `The sides are proportional, but $\\angle ${A}$ is not between $\\overline{${A}${B}}$ and $\\overline{${B}${C}}$ (that angle is $\\angle ${B}$). SSA is not a similarity criterion.`,
            `两边成比例，但 $\\angle ${A}$ 不是 $\\overline{${A}${B}}$ 与 $\\overline{${B}${C}}$ 的夹角（夹角是 $\\angle ${B}$）。SSA 不是相似判定。`,
          );
        } else if (kind === 4) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${A}${C} = ${sh[2] * u}, \\; ${D}${E} = ${sh[0] * v}, \\; ${D}${F} = ${sh[2] * v}`;
          correct = 3;
          why = t(
            "Only two pairs of sides are known to be proportional; nothing is known about the third side or the angle between them.",
            "只知道两组边成比例，第三边和夹角都不知道。",
          );
        } else {
          facts = `m\\angle ${A} = m\\angle ${D} = ${angle}^\\circ, \\; ${A}${B} = ${sh[0] * u}, \\; ${D}${E} = ${sh[0] * v}`;
          correct = 3;
          why = t("One pair of angles and one pair of sides are not enough.", "一组角和一组边不足以判定。");
        }
        return choiceProblem({
          prompt: t(
            `In $\\triangle ${A}${B}${C}$ and $\\triangle ${D}${E}${F}$: $${facts}$. Which criterion shows that $\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$?`,
            `在 $\\triangle ${A}${B}${C}$ 与 $\\triangle ${D}${E}${F}$ 中：$${facts}$。用哪种判定可以说明 $\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$？`,
          ),
          options: criteria,
          correct,
          solution: why,
        });
      },
    },
    {
      id: "crossing-segments",
      title: t("Crossing segments", "相交的线段"),
      explanation: t(
        "If $\\overline{AD}$ and $\\overline{BC}$ cross at $E$ and $\\overline{AB} \\parallel \\overline{CD}$, the vertical angles at $E$ are congruent and $\\angle A \\cong \\angle D$ (alternate interior angles), so $\\triangle EAB \\sim \\triangle EDC$ by AA. Note the matching: $A \\leftrightarrow D$, $B \\leftrightarrow C$.\n\nIf $EA = 4$, $ED = 6$ and $AB = 5$, then $\\frac{DC}{5} = \\frac{6}{4}$, so $DC = 7.5$.",
        "若 $\\overline{AD}$ 与 $\\overline{BC}$ 相交于 $E$，且 $\\overline{AB} \\parallel \\overline{CD}$，则 $E$ 处的对顶角相等，$\\angle A \\cong \\angle D$（内错角），所以由 AA，$\\triangle EAB \\sim \\triangle EDC$。注意对应关系：$A \\leftrightarrow D$，$B \\leftrightarrow C$。\n\n若 $EA = 4$，$ED = 6$，$AB = 5$，则 $\\frac{DC}{5} = \\frac{6}{4}$，所以 $DC = 7.5$。",
      ),
      keyPrerequisites: ["vertical-angles"],
      generate(rng) {
        const [a, b] = rng.pick(scales);
        const [u, v] = rng.bool() ? [a, b] : [b, a];
        const s = rng.pick(shapes);
        const [EA, EB, AB] = [s[0] * u, s[1] * u, s[2] * u];
        const [ED, DC] = [s[0] * v, s[2] * v];
        const [A, B, C, D, E] = pickFive(rng);
        const pts = bowtiePoints(rng, EA, EB, v / u);
        const posedPts = posed([pts.pa, pts.pb, pts.pc, pts.pd, pts.pe], { turn: rng.pick([0, 90, 180, 270]), mirror: rng.bool() }) as [
          Point,
          Point,
          Point,
          Point,
          Point,
        ];
        const [pa, pb, pc, pd, pe] = posedPts;
        const ask = rng.int(0, 2);
        // ask 0: find DC from EA, ED, AB; 1: find AB from EA, ED, DC; 2: find EC from EA, ED, EB.
        const labels: [Point, Point, string][] = [
          [pa, pe, String(EA)],
          [pe, pd, String(ED)],
        ];
        if (ask === 0) labels.push([pa, pb, String(AB)], [pd, pc, "x"]);
        if (ask === 1) labels.push([pa, pb, "x"], [pd, pc, String(DC)]);
        if (ask === 2) labels.push([pb, pe, String(EB)], [pe, pc, "x"]);
        const fig = figure(
          [
            { kind: "segment", a: pa, b: pd },
            { kind: "segment", a: pb, b: pc },
            { kind: "segment", a: pa, b: pb, accent: true },
            { kind: "segment", a: pc, b: pd, accent: true },
            { kind: "arrows", a: pa, b: pb, count: 1 },
            { kind: "arrows", a: pd, b: pc, count: 1 },
            ...names([pa, pb, pc, pd], `${A}${B}${C}${D}`, pe),
            { kind: "label", at: pe, text: E, dir: compassOf(pe[0] - (pa[0] + pb[0]) / 2, pe[1] - (pa[1] + pb[1]) / 2), italic: true },
            ...labels.map(([p, q, text]): Mark => {
              // Label each segment on the side away from E's other segments: the right of p → q when that points away from the center.
              const mid = lerp(p, q, 0.5);
              const right: Point = [q[1] - p[1], p[0] - q[0]];
              const away = right[0] * (mid[0] - pe[0]) + right[1] * (mid[1] - pe[1]);
              return away >= 0 ? { kind: "side", a: p, b: q, text } : { kind: "side", a: q, b: p, text };
            }),
          ],
          `Segments ${A}${D} and ${B}${C} crossing at ${E}, with ${A}${B} parallel to ${C}${D}.`,
          `线段 ${A}${D} 与 ${B}${C} 相交于 ${E}，${A}${B} ∥ ${C}${D}。`,
        );
        const known = [AB, DC, EB][ask]!;
        const [num, den] = ask === 1 ? [EA, ED] : [ED, EA];
        const line = `x = \\frac{${num}}{${den}} \\cdot ${known} = ${Q.of(num * known, den).toLatex()}`;
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$. Find $x$.`,
              `如图，$\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$。求 $x$。`,
            ),
            answer: Q.of(num * known, den),
            solveFor: "x",
            wrong: [Q.of(den * known, num), known + num - den],
            solution: t(
              `The vertical angles at $${E}$ are congruent and $\\angle ${A} \\cong \\angle ${D}$ (alternate interior angles), so $\\triangle ${E}${A}${B} \\sim \\triangle ${E}${D}${C}$ by AA, with $${A} \\leftrightarrow ${D}$ and $${B} \\leftrightarrow ${C}$. The scale factor from $\\triangle ${E}${A}${B}$ to $\\triangle ${E}${D}${C}$ is $\\frac{${E}${D}}{${E}${A}} = \\frac{${ED}}{${EA}}$:${steps(line)}`,
              `$${E}$ 处的对顶角相等，$\\angle ${A} \\cong \\angle ${D}$（内错角），所以由 AA，$\\triangle ${E}${A}${B} \\sim \\triangle ${E}${D}${C}$，$${A} \\leftrightarrow ${D}$，$${B} \\leftrightarrow ${C}$。从 $\\triangle ${E}${A}${B}$ 到 $\\triangle ${E}${D}${C}$ 的相似比为 $\\frac{${E}${D}}{${E}${A}} = \\frac{${ED}}{${EA}}$：${steps(line)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "indirect-measurement",
      title: t("Indirect measurement with shadows", "利用影子间接测量"),
      explanation: t(
        `At the same moment, the sun's rays make the same angle with level ground everywhere. An upright object and its shadow form a right triangle, so two such triangles are similar by AA, and heights are proportional to shadow lengths.\n\nA $6$-foot person casts a $4$-foot shadow while a tree casts a $30$-foot shadow:${steps("\\frac{h}{30} = \\frac{6}{4} \\quad\\Rightarrow\\quad h = 45 \\text{ feet}")}`,
        `同一时刻，阳光与水平地面所成的角处处相同。直立的物体和它的影子构成直角三角形，所以两个这样的三角形由 AA 相似，高度与影长成比例。\n\n身高 $6$ 英尺的人影长 $4$ 英尺，同时一棵树影长 $30$ 英尺：${steps("\\frac{h}{30} = \\frac{6}{4} \\quad\\Rightarrow\\quad h = 45 \\text{ 英尺}")}`,
      ),
      generate(rng) {
        for (;;) {
          const person = rng.pick([5, 6]);
          const shadow = rng.int(2, 12);
          if (shadow === person) continue;
          const g = gcd(person, shadow);
          const n = rng.int(3, 12);
          const [H, S] = [(person / g) * n, (shadow / g) * n];
          if (H > 120 || S > 120 || H <= person) continue;
          const obj = rng.pick(tallObjects);
          const askHeight = rng.bool(0.7);
          const scale = 4 / Math.max(H, S);
          const small = 4 * (person / H);
          const [w1, h1] = [(small * shadow) / person, small];
          const [w2, h2] = [S * scale, H * scale];
          const [x2] = [w1 + 1.5];
          const fig = figure(
            [
              {
                kind: "polygon",
                points: [
                  [0, 0],
                  [w1, 0],
                  [0, h1],
                ],
              },
              { kind: "right", vertex: [0, 0], from: [w1, 0], to: [0, h1] },
              { kind: "side", a: [w1, 0], b: [0, 0], text: String(shadow) },
              { kind: "side", a: [0, 0], b: [0, h1], text: String(person) },
              {
                kind: "polygon",
                points: [
                  [x2, 0],
                  [x2 + w2, 0],
                  [x2, h2],
                ],
              },
              { kind: "right", vertex: [x2, 0], from: [x2 + w2, 0], to: [x2, h2] },
              { kind: "side", a: [x2 + w2, 0], b: [x2, 0], text: askHeight ? String(S) : "x" },
              { kind: "side", a: [x2, 0], b: [x2, h2], text: askHeight ? "x" : String(H) },
            ],
            `Two right triangles: a person ${person} feet tall with a shadow ${shadow} feet long, and ${obj.en} ${askHeight ? `with a shadow ${S} feet long and unknown height x` : `${H} feet tall with unknown shadow x`}.`,
            `两个直角三角形：身高 ${person} 英尺的人，影长 ${shadow} 英尺；${obj["zh-CN"]}，${askHeight ? `影长 ${S} 英尺，高 x` : `高 ${H} 英尺，影长 x`}。`,
          );
          return {
            ...numberProblem({
              prompt: askHeight
                ? t(
                    `A person $${person}$ feet tall casts a shadow $${shadow}$ feet long. At the same moment, ${obj.en} casts a shadow $${S}$ feet long. How tall is it, in feet?`,
                    `身高 $${person}$ 英尺的人影长 $${shadow}$ 英尺。同一时刻，${obj["zh-CN"]}的影长为 $${S}$ 英尺。它有多高（英尺）？`,
                  )
                : t(
                    `A person $${person}$ feet tall casts a shadow $${shadow}$ feet long. At the same moment, how long, in feet, is the shadow of ${obj.en} that is $${H}$ feet tall?`,
                    `身高 $${person}$ 英尺的人影长 $${shadow}$ 英尺。同一时刻，高 $${H}$ 英尺的${obj["zh-CN"]}影长多少英尺？`,
                  ),
              answer: askHeight ? H : S,
              wrong: askHeight ? [Q.of(S * shadow, person), S + person - shadow] : [Q.of(H * person, shadow), H + shadow - person],
              solution: askHeight
                ? t(
                    `The two triangles are similar by AA (a right angle and the sun's angle), so${steps(prop("h", String(S), String(person), String(shadow)), `h = \\frac{${person} \\cdot ${S}}{${shadow}} = ${H}`)}`,
                    `两个三角形由 AA 相似（一个直角和阳光的角），所以${steps(prop("h", String(S), String(person), String(shadow)), `h = \\frac{${person} \\cdot ${S}}{${shadow}} = ${H}`)}`,
                  )
                : t(
                    `The two triangles are similar by AA (a right angle and the sun's angle), so${steps(prop("s", String(H), String(shadow), String(person)), `s = \\frac{${shadow} \\cdot ${H}}{${person}} = ${S}`)}`,
                    `两个三角形由 AA 相似（一个直角和阳光的角），所以${steps(prop("s", String(H), String(shadow), String(person)), `s = \\frac{${shadow} \\cdot ${H}}{${person}} = ${S}`)}`,
                  ),
            }),
            figure: fig,
          };
        }
      },
    },
  ],
};

// ─── Proofs ─────────────────────────────────────────────────────────────────

/** reasons are the reasons a step of a two-column proof about similarity can cite. */
const reasons = {
  given: t("Given", "已知"),
  corresponding: t("Corresponding angles are congruent", "两直线平行，同位角相等"),
  alternate: t("Alternate interior angles are congruent", "两直线平行，内错角相等"),
  vertical: t("Vertical angles are congruent", "对顶角相等"),
  reflexive: t("Reflexive property", "自反性"),
  aa: t("AA similarity criterion", "AA 相似判定"),
  sss: t("SSS similarity criterion", "SSS 相似判定"),
  sas: t("SAS similarity criterion", "SAS 相似判定"),
  simAngles: t("Corresponding angles of similar triangles are congruent", "相似三角形的对应角相等"),
  simSides: t("Corresponding sides of similar triangles are proportional", "相似三角形的对应边成比例"),
  corrConverse: t("Converse of the corresponding angles theorem", "同位角相等，两直线平行"),
  midpoint: t("Definition of a midpoint", "中点的定义"),
  substitution: t("Substitution", "等量代换"),
  multiplication: t("Multiplication property of equality", "等式的乘法性质"),
  division: t("Division property of equality", "等式的除法性质"),
} as const;

/** Reason names a reason a proof step can cite. */
type Reason = keyof typeof reasons;

/** ProofStep is one line of a two-column proof: a statement, its reason, and wrong statements to offer instead of it. */
interface ProofStep {
  readonly s: Text;
  readonly r: Reason;
  readonly alts?: readonly Text[];
  /** why explains the step in the solution. */
  readonly why?: Text;
}

/** Proof is a two-column proof with its figure. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly ProofStep[];
  readonly figure: Figure;
}

/** proofProblem asks for the reason, or the statement, of one step of a proof; pool lists the reasons offered as wrong options. */
function proofProblem(rng: Rng, proof: Proof, pool: readonly Reason[]): Problem & { figure: Figure } {
  const eligible = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given");
  const [step, k] = rng.pick(eligible);
  const askStatement = step.alts !== undefined && step.alts.length >= 2 && rng.bool(0.4);
  let options: Text[];
  if (askStatement) {
    options = [step.s, ...rng.sample(step.alts!, Math.min(3, step.alts!.length))];
  } else {
    const others = pool.filter((r) => r !== step.r);
    options = [reasons[step.r], ...rng.sample(others, Math.min(3, others.length)).map((r) => reasons[r])];
  }
  const shuffled = rng.shuffle(options);
  const correct = shuffled.indexOf(options[0]!);
  const line = (lang: "en" | "zh-CN", s: ProofStep, i: number) => {
    const statement = askStatement && i === k ? "**?**" : s.s[lang];
    const reason = !askStatement && i === k ? "**?**" : reasons[s.r][lang];
    return `${i + 1}. ${statement} —— ${reason}`;
  };
  const list = (lang: "en" | "zh-CN") => proof.steps.map((s, i) => line(lang, s, i)).join("\n");
  const ask = askStatement
    ? t(`Which statement belongs in step ${k + 1}?`, `第 ${k + 1} 步应填哪个结论？`)
    : t(`Which reason justifies step ${k + 1}?`, `第 ${k + 1} 步的理由是什么？`);
  const why = step.why ? t(` ${step.why.en}`, step.why["zh-CN"]) : t("", "");
  return {
    ...choiceProblem({
      prompt: t(
        `**Given:** ${proof.given.en}\n\n**Prove:** ${proof.prove.en}\n\n${list("en")}\n\n${ask.en}`,
        `**已知：** ${proof.given["zh-CN"]}\n\n**求证：** ${proof.prove["zh-CN"]}\n\n${list("zh-CN")}\n\n${ask["zh-CN"]}`,
      ),
      options: shuffled,
      correct,
      solution: t(
        `Step ${k + 1} is ${step.s.en}, because: ${reasons[step.r].en}.${why.en}`,
        `第 ${k + 1} 步是 ${step.s["zh-CN"]}，理由是：${reasons[step.r]["zh-CN"]}。${why["zh-CN"]}`,
      ),
    }),
    figure: proof.figure,
  };
}

/** nestedFigure draws a triangle with a segment DE across it, for proofs. */
function nestedFigure(rng: Rng, L: readonly string[], o: { arrows?: boolean; ticks?: boolean }, en: string, zh: string): Figure {
  const f = rng.pick([0.4, 0.45, 0.5, 0.55, 0.6]);
  return figure(nestedMarks(nestedPoints(rng, o.ticks ? 0.5 : f), L, o), en, zh);
}

/** parallelSimilarProof proves △ADE ∼ △ABC from DE ∥ BC. */
function parallelSimilarProof(rng: Rng): Proof {
  const L = pickFive(rng);
  const [A, B, C, D, E] = L;
  const fig = nestedFigure(
    rng,
    L,
    { arrows: true },
    `Triangle ${A}${B}${C} with ${D} on ${A}${B}, ${E} on ${A}${C}, and ${D}${E} parallel to ${B}${C}.`,
    `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，${D}${E} ∥ ${B}${C}。`,
  );
  const shared = rng.bool();
  const second: ProofStep = shared
    ? {
        s: m(`\\angle ${A} \\cong \\angle ${A}`),
        r: "reflexive",
        why: t("The two triangles share this angle.", "两个三角形共有这个角。"),
      }
    : {
        s: m(`\\angle ${A}${E}${D} \\cong \\angle ${A}${C}${B}`),
        r: "corresponding",
        why: t(`$${A}${C}$ is a transversal of the parallel lines.`, `$${A}${C}$ 是两条平行线的截线。`),
        alts: [
          m(`\\angle ${A}${E}${D} \\cong \\angle ${A}${B}${C}`),
          m(`\\angle ${A}${E}${D} \\cong \\angle ${A}${D}${E}`),
          m(`\\angle ${A}${E}${D} \\cong \\angle ${D}${E}${C}`),
        ],
      };
  return {
    given: t(
      `$${D}$ on $\\overline{${A}${B}}$, $${E}$ on $\\overline{${A}${C}}$, $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
      `$${D}$ 在 $\\overline{${A}${B}}$ 上，$${E}$ 在 $\\overline{${A}${C}}$ 上，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
    ),
    prove: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
    steps: [
      { s: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`), r: "given" },
      {
        s: m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${B}${C}`),
        r: "corresponding",
        why: t(`$${A}${B}$ is a transversal of the parallel lines.`, `$${A}${B}$ 是两条平行线的截线。`),
        alts: [
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${C}${B}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${E}${D}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${B}${D}${E}`),
        ],
      },
      second,
      {
        s: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
        r: "aa",
        alts: [
          m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${C}${B}`),
          m(`\\triangle ${A}${E}${D} \\sim \\triangle ${A}${B}${C}`),
          m(`\\triangle ${A}${D}${E} \\cong \\triangle ${A}${B}${C}`),
        ],
      },
    ],
    figure: fig,
  };
}

/** bowtieProof proves △EAB ∼ △EDC when AD and BC cross at E and AB ∥ CD. */
function bowtieProof(rng: Rng): Proof {
  const [A, B, C, D, E] = pickFive(rng);
  const k = rng.pick([0.6, 0.8, 1.25, 1.5]);
  const p = bowtiePoints(rng, 4, 4.5, k);
  const fig = figure(
    [
      { kind: "segment", a: p.pa, b: p.pd },
      { kind: "segment", a: p.pb, b: p.pc },
      { kind: "segment", a: p.pa, b: p.pb, accent: true },
      { kind: "segment", a: p.pc, b: p.pd, accent: true },
      { kind: "arrows", a: p.pa, b: p.pb, count: 1 },
      { kind: "arrows", a: p.pd, b: p.pc, count: 1 },
      ...names([p.pa, p.pb, p.pc, p.pd], `${A}${B}${C}${D}`, p.pe),
      { kind: "label", at: p.pe, text: E, dir: "s", italic: true },
    ],
    `Segments ${A}${D} and ${B}${C} crossing at ${E}, with ${A}${B} parallel to ${C}${D}.`,
    `线段 ${A}${D} 与 ${B}${C} 相交于 ${E}，${A}${B} ∥ ${C}${D}。`,
  );
  const useA = rng.bool();
  return {
    given: t(
      `$\\overline{${A}${D}}$ and $\\overline{${B}${C}}$ meet at $${E}$, $\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$`,
      `$\\overline{${A}${D}}$ 与 $\\overline{${B}${C}}$ 相交于 $${E}$，$\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$`,
    ),
    prove: m(`\\triangle ${E}${A}${B} \\sim \\triangle ${E}${D}${C}`),
    steps: [
      { s: m(`\\overline{${A}${B}} \\parallel \\overline{${C}${D}}`), r: "given" },
      {
        s: m(`\\angle ${A}${E}${B} \\cong \\angle ${D}${E}${C}`),
        r: "vertical",
        alts: [
          m(`\\angle ${A}${E}${B} \\cong \\angle ${A}${E}${C}`),
          m(`\\angle ${A}${E}${B} \\cong \\angle ${E}${D}${C}`),
          m(`\\angle ${A}${E}${B} \\cong \\angle ${B}${E}${D}`),
        ],
      },
      useA
        ? {
            s: m(`\\angle ${E}${A}${B} \\cong \\angle ${E}${D}${C}`),
            r: "alternate",
            why: t(`$${A}${D}$ is a transversal of the parallel lines.`, `$${A}${D}$ 是两条平行线的截线。`),
            alts: [
              m(`\\angle ${E}${A}${B} \\cong \\angle ${E}${C}${D}`),
              m(`\\angle ${E}${A}${B} \\cong \\angle ${E}${B}${A}`),
              m(`\\angle ${E}${A}${B} \\cong \\angle ${D}${E}${C}`),
            ],
          }
        : {
            s: m(`\\angle ${E}${B}${A} \\cong \\angle ${E}${C}${D}`),
            r: "alternate",
            why: t(`$${B}${C}$ is a transversal of the parallel lines.`, `$${B}${C}$ 是两条平行线的截线。`),
            alts: [
              m(`\\angle ${E}${B}${A} \\cong \\angle ${E}${D}${C}`),
              m(`\\angle ${E}${B}${A} \\cong \\angle ${E}${A}${B}`),
              m(`\\angle ${E}${B}${A} \\cong \\angle ${D}${E}${C}`),
            ],
          },
      {
        s: m(`\\triangle ${E}${A}${B} \\sim \\triangle ${E}${D}${C}`),
        r: "aa",
        alts: [
          m(`\\triangle ${E}${A}${B} \\sim \\triangle ${E}${C}${D}`),
          m(`\\triangle ${E}${A}${B} \\cong \\triangle ${E}${D}${C}`),
          m(`\\triangle ${E}${B}${A} \\sim \\triangle ${E}${D}${C}`),
        ],
      },
    ],
    figure: fig,
  };
}

/** sasParallelProof proves DE ∥ BC from AD/AB = AE/AC. */
function sasParallelProof(rng: Rng): Proof {
  const L = pickFive(rng);
  const [A, B, C, D, E] = L;
  const fig = nestedFigure(
    rng,
    L,
    {},
    `Triangle ${A}${B}${C} with ${D} on ${A}${B}, ${E} on ${A}${C}, and segment ${D}${E}.`,
    `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，连接 ${D}${E}。`,
  );
  const ratio = `\\frac{${A}${D}}{${A}${B}} = \\frac{${A}${E}}{${A}${C}}`;
  return {
    given: t(
      `$${D}$ on $\\overline{${A}${B}}$, $${E}$ on $\\overline{${A}${C}}$, $${ratio}$`,
      `$${D}$ 在 $\\overline{${A}${B}}$ 上，$${E}$ 在 $\\overline{${A}${C}}$ 上，$${ratio}$`,
    ),
    prove: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`),
    steps: [
      { s: m(ratio), r: "given" },
      { s: m(`\\angle ${A} \\cong \\angle ${A}`), r: "reflexive" },
      {
        s: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
        r: "sas",
        why: t(
          `Two pairs of proportional sides, $${A}${D}, ${A}${B}$ and $${A}${E}, ${A}${C}$, with the angle $${A}$ between them.`,
          `两组成比例的边 $${A}${D}, ${A}${B}$ 与 $${A}${E}, ${A}${C}$，夹角都是 $${A}$。`,
        ),
        alts: [
          m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${C}${B}`),
          m(`\\triangle ${A}${D}${E} \\cong \\triangle ${A}${B}${C}`),
          m(`\\triangle ${A}${E}${D} \\sim \\triangle ${A}${B}${C}`),
        ],
      },
      {
        s: m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${B}${C}`),
        r: "simAngles",
        alts: [
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${C}${B}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${E}${D}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}`),
        ],
      },
      {
        s: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`),
        r: "corrConverse",
        why: t(
          `$\\angle ${A}${D}${E}$ and $\\angle ${A}${B}${C}$ are corresponding angles along the transversal $${A}${B}$.`,
          `$\\angle ${A}${D}${E}$ 与 $\\angle ${A}${B}${C}$ 是截线 $${A}${B}$ 上的同位角。`,
        ),
        alts: [
          m(`\\overline{${D}${E}} \\perp \\overline{${A}${B}}`),
          m(`\\overline{${A}${B}} \\parallel \\overline{${A}${C}}`),
          m(`${D}${E} = ${B}${C}`),
        ],
      },
    ],
    figure: fig,
  };
}

/** separateTriangles draws two similar triangles side by side, with arcs or ticks as needed. */
function separateTriangles(rng: Rng, L1: string, L2: string, arcs: readonly (string | null)[], en: string, zh: string): Figure {
  const sh = pickShape(rng);
  const [p1, p2] = sideBySide(bySides(sh), posed(bySides(sh), pickPose(rng)), rng.pick([0.7, 1.4]));
  return figure([...polyMarks(p1, L1, [], arcs), ...polyMarks(p2, L2, [], arcs)], en, zh);
}

/** proportionProof proves a product of sides from two pairs of congruent angles, or a congruent angle from SSS. */
function proportionProof(rng: Rng): Proof {
  const letters = rng.pick(sixLetters);
  const [A, B, C, D, E, F] = letters.split("") as [string, string, string, string, string, string];
  const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
  if (rng.bool()) {
    const fig = separateTriangles(
      rng,
      L1,
      L2,
      [null, "", ""],
      `Triangles ${L1} and ${L2} with angle ${B} marked equal to angle ${E}, and angle ${C} marked equal to angle ${F}.`,
      `三角形 ${L1} 与 ${L2}，标出角 ${B} 等于角 ${E}，角 ${C} 等于角 ${F}。`,
    );
    return {
      given: m(`\\angle ${B} \\cong \\angle ${E}, \\; \\angle ${C} \\cong \\angle ${F}`),
      prove: m(`${A}${B} \\cdot ${E}${F} = ${D}${E} \\cdot ${B}${C}`),
      steps: [
        { s: m(`\\angle ${B} \\cong \\angle ${E}, \\; \\angle ${C} \\cong \\angle ${F}`), r: "given" },
        {
          s: m(`\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}`),
          r: "aa",
          alts: [
            m(`\\triangle ${A}${B}${C} \\sim \\triangle ${D}${F}${E}`),
            m(`\\triangle ${A}${B}${C} \\cong \\triangle ${D}${E}${F}`),
            m(`\\triangle ${A}${B}${C} \\sim \\triangle ${E}${F}${D}`),
          ],
        },
        {
          s: m(`\\frac{${A}${B}}{${D}${E}} = \\frac{${B}${C}}{${E}${F}}`),
          r: "simSides",
          alts: [
            m(`\\frac{${A}${B}}{${D}${E}} = \\frac{${E}${F}}{${B}${C}}`),
            m(`\\frac{${A}${B}}{${D}${E}} = \\frac{${B}${C}}{${D}${F}}`),
            m(`${A}${B} = ${D}${E}`),
          ],
        },
        {
          s: m(`${A}${B} \\cdot ${E}${F} = ${D}${E} \\cdot ${B}${C}`),
          r: "multiplication",
          why: t(`Multiply both sides by $${D}${E} \\cdot ${E}${F}$.`, `两边同乘 $${D}${E} \\cdot ${E}${F}$。`),
          alts: [
            m(`${A}${B} \\cdot ${D}${E} = ${B}${C} \\cdot ${E}${F}`),
            m(`${A}${B} \\cdot ${B}${C} = ${D}${E} \\cdot ${E}${F}`),
            m(`${A}${B} + ${E}${F} = ${D}${E} + ${B}${C}`),
          ],
        },
      ],
      figure: fig,
    };
  }
  const fig = separateTriangles(rng, L1, L2, [null, "", null], `Triangles ${L1} and ${L2}.`, `三角形 ${L1} 与 ${L2}。`);
  const ratio = `\\frac{${A}${B}}{${D}${E}} = \\frac{${B}${C}}{${E}${F}} = \\frac{${C}${A}}{${F}${D}}`;
  return {
    given: m(ratio),
    prove: m(`\\angle ${B} \\cong \\angle ${E}`),
    steps: [
      { s: m(ratio), r: "given" },
      {
        s: m(`\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}`),
        r: "sss",
        alts: [
          m(`\\triangle ${A}${B}${C} \\sim \\triangle ${E}${D}${F}`),
          m(`\\triangle ${A}${B}${C} \\cong \\triangle ${D}${E}${F}`),
          m(`\\triangle ${A}${B}${C} \\sim \\triangle ${D}${F}${E}`),
        ],
      },
      {
        s: m(`\\angle ${B} \\cong \\angle ${E}`),
        r: "simAngles",
        alts: [m(`\\angle ${B} \\cong \\angle ${D}`), m(`\\angle ${B} \\cong \\angle ${F}`), m(`\\angle ${B} \\cong \\angle ${C}`)],
      },
    ],
    figure: fig,
  };
}

const similarityPool: readonly Reason[] = [
  "corresponding",
  "alternate",
  "vertical",
  "reflexive",
  "aa",
  "sss",
  "sas",
  "simAngles",
  "simSides",
  "corrConverse",
  "multiplication",
];

// ─── 1.4.10 Proving similarity statements ───────────────────────────────────

export const provingSimilarityStatements: TopicDef = {
  id: "proving-similarity-statements",
  title: t("Proving Similarity Statements", "证明相似命题"),
  summary: t(
    "Complete two-column proofs that triangles are similar, and use similar triangles to prove congruent angles, parallel lines and proportions.",
    "补全证明三角形相似的两栏式证明，并用相似三角形证明角相等、直线平行和比例式。",
  ),
  prerequisites: ["combining-similarity-criteria-for-triangles", "proving-triangle-theorems", "proving-alternate-angle-converses"],
  encompasses: [
    { topic: "combining-similarity-criteria-for-triangles", weight: 0.4 },
    { topic: "the-aa-similarity-criterion", weight: 0.3 },
    { topic: "proving-triangle-theorems", weight: 0.2 },
    { topic: "proving-alternate-angle-converses", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.B.5"],
  knowledgePoints: [
    {
      id: "proving-triangles-similar-with-aa",
      title: t("Proving triangles similar with AA", "用 AA 证明三角形相似"),
      explanation: t(
        "To prove two triangles similar with AA, find two pairs of congruent angles. Parallel lines give corresponding or alternate interior angles; crossing lines give vertical angles; a shared angle is congruent to itself (reflexive property).\n\nGiven $\\overline{DE} \\parallel \\overline{BC}$ in $\\triangle ABC$:\n\n1. $\\angle ADE \\cong \\angle ABC$: corresponding angles.\n2. $\\angle A \\cong \\angle A$: reflexive property.\n3. $\\triangle ADE \\sim \\triangle ABC$: AA similarity criterion.",
        "用 AA 证明两个三角形相似，要找出两组相等的角。平行线给出同位角或内错角；相交直线给出对顶角；公共角与自身相等（自反性）。\n\n已知 $\\triangle ABC$ 中 $\\overline{DE} \\parallel \\overline{BC}$：\n\n1. $\\angle ADE \\cong \\angle ABC$：同位角。\n2. $\\angle A \\cong \\angle A$：自反性。\n3. $\\triangle ADE \\sim \\triangle ABC$：AA 相似判定。",
      ),
      keyPrerequisites: ["the-aa-similarity-criterion"],
      generate: (rng) => proofProblem(rng, rng.bool() ? parallelSimilarProof(rng) : bowtieProof(rng), similarityPool),
    },
    {
      id: "using-similar-triangles-to-prove-parallel-lines",
      title: t("Proving lines parallel with SAS", "用 SAS 证明直线平行"),
      explanation: t(
        "Once two triangles are proved similar, their corresponding angles are congruent, and congruent corresponding angles along a transversal make lines parallel.\n\nGiven $\\frac{AD}{AB} = \\frac{AE}{AC}$ with $D$ on $\\overline{AB}$ and $E$ on $\\overline{AC}$:\n\n1. $\\angle A \\cong \\angle A$: reflexive property.\n2. $\\triangle ADE \\sim \\triangle ABC$: SAS similarity criterion.\n3. $\\angle ADE \\cong \\angle ABC$: corresponding angles of similar triangles.\n4. $\\overline{DE} \\parallel \\overline{BC}$: converse of the corresponding angles theorem.",
        "两个三角形一旦证明相似，它们的对应角就相等；而截线上的同位角相等，两直线就平行。\n\n已知 $\\frac{AD}{AB} = \\frac{AE}{AC}$，$D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上：\n\n1. $\\angle A \\cong \\angle A$：自反性。\n2. $\\triangle ADE \\sim \\triangle ABC$：SAS 相似判定。\n3. $\\angle ADE \\cong \\angle ABC$：相似三角形的对应角相等。\n4. $\\overline{DE} \\parallel \\overline{BC}$：同位角相等，两直线平行。",
      ),
      keyPrerequisites: ["proving-alternate-angle-converses"],
      generate: (rng) => proofProblem(rng, sasParallelProof(rng), similarityPool),
    },
    {
      id: "proving-proportions-and-angles",
      title: t("Proving proportions and angles", "证明比例式与角相等"),
      explanation: t(
        "Similar triangles give two kinds of conclusions: corresponding angles are congruent, and corresponding sides are proportional. A proportion can then be rewritten as a product by multiplying both sides.\n\nGiven $\\angle B \\cong \\angle E$ and $\\angle C \\cong \\angle F$:\n\n1. $\\triangle ABC \\sim \\triangle DEF$: AA.\n2. $\\frac{AB}{DE} = \\frac{BC}{EF}$: corresponding sides of similar triangles are proportional.\n3. $AB \\cdot EF = DE \\cdot BC$: multiplication property of equality.",
        "相似三角形能给出两类结论：对应角相等，对应边成比例。比例式两边同乘一个式子，就能写成乘积的形式。\n\n已知 $\\angle B \\cong \\angle E$，$\\angle C \\cong \\angle F$：\n\n1. $\\triangle ABC \\sim \\triangle DEF$：AA。\n2. $\\frac{AB}{DE} = \\frac{BC}{EF}$：相似三角形的对应边成比例。\n3. $AB \\cdot EF = DE \\cdot BC$：等式的乘法性质。",
      ),
      generate: (rng) => proofProblem(rng, proportionProof(rng), similarityPool),
    },
  ],
};

// ─── 1.4.11 The midpoint theorem ────────────────────────────────────────────

export const theMidpointTheorem: TopicDef = {
  id: "the-midpoint-theorem",
  title: t("The Midpoint Theorem", "三角形中位线定理"),
  summary: t(
    "Use the midpoint theorem: the segment joining the midpoints of two sides of a triangle is parallel to the third side and half as long.",
    "运用三角形中位线定理：连接三角形两边中点的线段平行于第三边，且等于第三边的一半。",
  ),
  prerequisites: ["the-sas-similarity-criterion", "equations-with-parentheses"],
  encompasses: [
    { topic: "the-sas-similarity-criterion", weight: 0.2 },
    { topic: "parallel-lines-and-transversals", weight: 0.2 },
    { topic: "equations-with-parentheses", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.CO.C.10"],
  knowledgePoints: [
    {
      id: "length-of-a-midsegment",
      title: t("The length of a midsegment", "中位线的长"),
      explanation: t(
        "A **midsegment** of a triangle joins the midpoints of two sides. **Midpoint theorem:** a midsegment is parallel to the third side and half as long. (The small triangle is similar to the whole one with scale factor $\\frac{1}{2}$, by SAS.)\n\nIf $D$ and $E$ are the midpoints of $\\overline{AB}$ and $\\overline{AC}$ and $BC = 18$, then $DE = 9$. If instead $DE = 7$, then $BC = 14$.",
        "连接三角形两边中点的线段叫做三角形的**中位线**。**中位线定理**：中位线平行于第三边，且等于第三边的一半。（由 SAS，小三角形与整个三角形相似，相似比为 $\\frac{1}{2}$。）\n\n若 $D$、$E$ 分别是 $\\overline{AB}$、$\\overline{AC}$ 的中点，$BC = 18$，则 $DE = 9$。若 $DE = 7$，则 $BC = 14$。",
      ),
      generate(rng) {
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const findDE = rng.bool();
        const known = findDE ? rng.int(5, 40) : rng.int(3, 25);
        const answer = findDE ? Q.of(known, 2) : Q.of(2 * known);
        const fig = figure(
          nestedMarks(nestedPoints(rng, 0.5), L, { ticks: true, de: findDE ? "x" : String(known), bc: findDE ? String(known) : "x" }),
          `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B} and ${E} the midpoint of ${A}${C}; ${findDE ? `${B}${C} = ${known} and ${D}${E} = x` : `${D}${E} = ${known} and ${B}${C} = x`}.`,
          `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${E} 是 ${A}${C} 的中点；${findDE ? `${B}${C} = ${known}，${D}${E} = x` : `${D}${E} = ${known}，${B}${C} = x`}。`,
        );
        return {
          ...numberProblem({
            prompt: t(
              `$${D}$ and $${E}$ are the midpoints of $\\overline{${A}${B}}$ and $\\overline{${A}${C}}$. Find $x$.`,
              `$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点。求 $x$。`,
            ),
            answer,
            solveFor: "x",
            wrong: findDE ? [known, 2 * known] : [known, Q.of(known, 2)],
            solution: findDE
              ? t(
                  `$\\overline{${D}${E}}$ is a midsegment, so it is half of $${B}${C}$:${steps(`x = \\frac{${known}}{2} = ${answer.toLatex()}`)}`,
                  `$\\overline{${D}${E}}$ 是中位线，等于 $${B}${C}$ 的一半：${steps(`x = \\frac{${known}}{2} = ${answer.toLatex()}`)}`,
                )
              : t(
                  `$\\overline{${D}${E}}$ is a midsegment, so $${B}${C}$ is twice as long:${steps(`x = 2 \\cdot ${known} = ${2 * known}`)}`,
                  `$\\overline{${D}${E}}$ 是中位线，所以 $${B}${C}$ 是它的两倍：${steps(`x = 2 \\cdot ${known} = ${2 * known}`)}`,
                ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "midsegments-with-algebra",
      title: t("Midsegments with algebra", "含未知数的中位线"),
      explanation: t(
        `When the lengths are expressions, the midpoint theorem gives the equation $BC = 2 \\cdot DE$. Remember the factor $2$, and put it on the midsegment's side.\n\nIf $DE = 2x + 1$ and $BC = 5x - 4$:${steps("5x - 4 = 2(2x + 1) \\quad\\Rightarrow\\quad 5x - 4 = 4x + 2 \\quad\\Rightarrow\\quad x = 6")}`,
        `当长度是式子时，中位线定理给出方程 $BC = 2 \\cdot DE$。别忘了因数 $2$，它乘在中位线这一边。\n\n若 $DE = 2x + 1$，$BC = 5x - 4$：${steps("5x - 4 = 2(2x + 1) \\quad\\Rightarrow\\quad 5x - 4 = 4x + 2 \\quad\\Rightarrow\\quad x = 6")}`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        for (;;) {
          const x = rng.int(2, 10);
          const a = rng.int(1, 3);
          const b = rng.int(-5, 9);
          const c = rng.int(1, 7);
          if (c === 2 * a || c === a) continue;
          const d = 2 * (a * x + b) - c * x;
          if (a * x + b <= 0 || Math.abs(d) > 30 || d === 0 || b === 0) continue;
          const L = pickFive(rng);
          const [A, B, C, D, E] = L;
          const fig = figure(
            nestedMarks(nestedPoints(rng, 0.5), L, { ticks: true, de: plain(a, b), bc: plain(c, d) }),
            `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B} and ${E} the midpoint of ${A}${C}; ${D}${E} = ${plain(a, b)} and ${B}${C} = ${plain(c, d)}.`,
            `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${E} 是 ${A}${C} 的中点；${D}${E} = ${plain(a, b)}，${B}${C} = ${plain(c, d)}。`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `$${D}$ and $${E}$ are the midpoints of $\\overline{${A}${B}}$ and $\\overline{${A}${C}}$. Find $x$.`,
                `$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点。求 $x$。`,
              ),
              answer: x,
              solveFor: "x",
              wrong: [...(a === c ? [] : [Q.of(d - b, a - c)]), ...(2 * c === a ? [] : [Q.of(b - 2 * d, 2 * c - a)]), a * x + b],
              solution: t(
                `By the midpoint theorem, $${B}${C} = 2 \\cdot ${D}${E}$:${steps(`${linear(c, d)} = 2(${linear(a, b)})`, `${linear(c, d)} = ${linear(2 * a, 2 * b)}`, `x = ${x}`)}`,
                `由中位线定理，$${B}${C} = 2 \\cdot ${D}${E}$：${steps(`${linear(c, d)} = 2(${linear(a, b)})`, `${linear(c, d)} = ${linear(2 * a, 2 * b)}`, `x = ${x}`)}`,
              ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "the-midsegment-triangle",
      title: t("The midsegment triangle", "中点三角形"),
      explanation: t(
        "The three midsegments of a triangle form a smaller triangle. Each of its sides is half of the side it is parallel to, so its perimeter is half the perimeter of the original triangle.\n\nIf the sides of $\\triangle ABC$ are $10$, $14$ and $16$, the triangle formed by the midpoints has sides $5$, $7$, $8$ and perimeter $20$.",
        "三角形的三条中位线围成一个较小的三角形。它的每条边都是与之平行的边的一半，所以它的周长是原三角形周长的一半。\n\n若 $\\triangle ABC$ 的三边为 $10$、$14$、$16$，由三边中点构成的三角形三边为 $5$、$7$、$8$，周长为 $20$。",
      ),
      generate(rng) {
        for (;;) {
          const s = pickShape(rng);
          const g = rng.int(1, 4);
          const sides = s.map((x) => x * g) as unknown as Tri3;
          const fromBig = rng.bool();
          const [A, B, C, D, E, F] = rng.pick(sixLetters).split("") as [string, string, string, string, string, string];
          const [pa, pb, pc] = posed(bySides(sides), pickPose(rng)) as [Point, Point, Point];
          // D, E, F are the midpoints of AB, BC, CA.
          const [pd, pe, pf] = [lerp(pa, pb, 0.5), lerp(pb, pc, 0.5), lerp(pc, pa, 0.5)];
          const perimeter = sides[0] + sides[1] + sides[2];
          if (!fromBig && perimeter % 2 === 1 && rng.bool()) continue;
          const half = sides.map((x) => Q.of(x, 2));
          const ccw = area2([pa, pb, pc]) > 0;
          const big: Mark[] = fromBig
            ? [
                { kind: "side", a: ccw ? pa : pd, b: ccw ? pd : pa, text: String(sides[0]) },
                { kind: "side", a: ccw ? pb : pe, b: ccw ? pe : pb, text: String(sides[1]) },
                { kind: "side", a: ccw ? pc : pf, b: ccw ? pf : pc, text: String(sides[2]) },
              ]
            : [];
          const smallLabels = !fromBig
            ? [
                [pe, pf, half[0]!],
                [pf, pd, half[1]!],
                [pd, pe, half[2]!],
              ]
            : [];
          // Side DE is parallel to CA, EF to AB, FD to BC.
          const fig = figure(
            [
              { kind: "polygon", points: [pa, pb, pc] },
              { kind: "polygon", points: [pd, pe, pf] },
              { kind: "ticks", a: pa, b: pd, count: 1 },
              { kind: "ticks", a: pd, b: pb, count: 1 },
              { kind: "ticks", a: pb, b: pe, count: 2 },
              { kind: "ticks", a: pe, b: pc, count: 2 },
              { kind: "ticks", a: pc, b: pf, count: 3 },
              { kind: "ticks", a: pf, b: pa, count: 3 },
              ...big,
              ...smallLabels.map(
                ([p, q, v]): Mark => ({
                  kind: "side",
                  a: ccw ? (q as Point) : (p as Point),
                  b: ccw ? (p as Point) : (q as Point),
                  text: (v as Q).toString(),
                }),
              ),
              ...names([pa, pb, pc], `${A}${B}${C}`),
              ...names([pd, pe, pf], `${D}${E}${F}`, center([pa, pb, pc])),
            ],
            fromBig
              ? `Triangle ${A}${B}${C} with ${A}${D} = ${D}${B}, ${B}${E} = ${E}${C}, ${C}${F} = ${F}${A}, and ${A}${D} = ${sides[0] / 2}, ${B}${E} = ${sides[1] / 2}, ${C}${F} = ${sides[2] / 2}.`
              : `Triangle ${A}${B}${C} with midpoints ${D}, ${E}, ${F} of its sides; ${E}${F} = ${half[0]}, ${F}${D} = ${half[1]}, ${D}${E} = ${half[2]}.`,
            fromBig
              ? `三角形 ${A}${B}${C}，${A}${D} = ${D}${B}，${B}${E} = ${E}${C}，${C}${F} = ${F}${A}，且 ${A}${D} = ${sides[0] / 2}，${B}${E} = ${sides[1] / 2}，${C}${F} = ${sides[2] / 2}。`
              : `三角形 ${A}${B}${C}，${D}、${E}、${F} 是各边中点；${E}${F} = ${half[0]}，${F}${D} = ${half[1]}，${D}${E} = ${half[2]}。`,
          );
          const halfSum = Q.of(perimeter, 2);
          if (fromBig) {
            // The figure labels the half-sides AD, BE, CF; the learner doubles them, then halves for the midsegment triangle.
            return {
              ...numberProblem({
                prompt: t(
                  `$${D}$, $${E}$ and $${F}$ are the midpoints of the sides of $\\triangle ${A}${B}${C}$, and $${A}${B} = ${sides[0]}$, $${B}${C} = ${sides[1]}$, $${C}${A} = ${sides[2]}$. Find the perimeter of $\\triangle ${D}${E}${F}$.`,
                  `$${D}$、$${E}$、$${F}$ 是 $\\triangle ${A}${B}${C}$ 各边的中点，$${A}${B} = ${sides[0]}$，$${B}${C} = ${sides[1]}$，$${C}${A} = ${sides[2]}$。求 $\\triangle ${D}${E}${F}$ 的周长。`,
                ),
                answer: halfSum,
                wrong: [perimeter, 2 * perimeter],
                solution: t(
                  `Each side of $\\triangle ${D}${E}${F}$ is a midsegment, half of the side it is parallel to: $${E}${F} = ${half[0]!.toLatex()}$, $${F}${D} = ${half[1]!.toLatex()}$, $${D}${E} = ${half[2]!.toLatex()}$. The perimeter is${steps(`\\frac{${sides[0]} + ${sides[1]} + ${sides[2]}}{2} = ${halfSum.toLatex()}`)}`,
                  `$\\triangle ${D}${E}${F}$ 的每条边都是中位线，等于与之平行的边的一半：$${E}${F} = ${half[0]!.toLatex()}$，$${F}${D} = ${half[1]!.toLatex()}$，$${D}${E} = ${half[2]!.toLatex()}$。周长为${steps(`\\frac{${sides[0]} + ${sides[1]} + ${sides[2]}}{2} = ${halfSum.toLatex()}`)}`,
                ),
              }),
              figure: {
                ...fig,
                svg: sketch([
                  { kind: "polygon", points: [pa, pb, pc] },
                  { kind: "polygon", points: [pd, pe, pf] },
                  ...names([pa, pb, pc], `${A}${B}${C}`),
                  ...names([pd, pe, pf], `${D}${E}${F}`, center([pa, pb, pc])),
                  { kind: "ticks", a: pa, b: pd, count: 1 },
                  { kind: "ticks", a: pd, b: pb, count: 1 },
                  { kind: "ticks", a: pb, b: pe, count: 2 },
                  { kind: "ticks", a: pe, b: pc, count: 2 },
                  { kind: "ticks", a: pc, b: pf, count: 3 },
                  { kind: "ticks", a: pf, b: pa, count: 3 },
                ]),
                alt: t(
                  `Triangle ${A}${B}${C} with ${D}, ${E}, ${F} the midpoints of ${A}${B}, ${B}${C}, ${C}${A}, joined to form triangle ${D}${E}${F}.`,
                  `三角形 ${A}${B}${C}，${D}、${E}、${F} 分别是 ${A}${B}、${B}${C}、${C}${A} 的中点，连成三角形 ${D}${E}${F}。`,
                ),
              },
            };
          }
          return {
            ...numberProblem({
              prompt: t(
                `$${D}$, $${E}$ and $${F}$ are the midpoints of the sides of $\\triangle ${A}${B}${C}$. Find the perimeter of $\\triangle ${A}${B}${C}$.`,
                `$${D}$、$${E}$、$${F}$ 是 $\\triangle ${A}${B}${C}$ 各边的中点。求 $\\triangle ${A}${B}${C}$ 的周长。`,
              ),
              answer: perimeter,
              wrong: [halfSum, Q.of(perimeter, 4)],
              solution: t(
                `Each side of $\\triangle ${A}${B}${C}$ is twice the midsegment parallel to it, so the perimeter of $\\triangle ${A}${B}${C}$ is twice that of $\\triangle ${D}${E}${F}$:${steps(`2\\left(${half[0]!.toLatex()} + ${half[1]!.toLatex()} + ${half[2]!.toLatex()}\\right) = ${perimeter}`)}`,
                `$\\triangle ${A}${B}${C}$ 的每条边都是与之平行的中位线的两倍，所以 $\\triangle ${A}${B}${C}$ 的周长是 $\\triangle ${D}${E}${F}$ 周长的两倍：${steps(`2\\left(${half[0]!.toLatex()} + ${half[1]!.toLatex()} + ${half[2]!.toLatex()}\\right) = ${perimeter}`)}`,
              ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "angles-at-a-midsegment",
      title: t("Angles at a midsegment", "中位线处的角"),
      explanation: t(
        "Since a midsegment is parallel to the third side, the angles it makes are corresponding angles or consecutive interior angles of parallel lines.\n\nIf $\\overline{DE}$ joins the midpoints of $\\overline{AB}$ and $\\overline{AC}$ and $m\\angle B = 65^\\circ$, then $m\\angle ADE = 65^\\circ$ (corresponding angles) and $m\\angle BDE = 180^\\circ - 65^\\circ = 115^\\circ$ (consecutive interior angles).",
        "由于中位线平行于第三边，它与两边所成的角就是平行线的同位角或同旁内角。\n\n若 $\\overline{DE}$ 连接 $\\overline{AB}$ 与 $\\overline{AC}$ 的中点，$m\\angle B = 65^\\circ$，则 $m\\angle ADE = 65^\\circ$（同位角），$m\\angle BDE = 180^\\circ - 65^\\circ = 115^\\circ$（同旁内角）。",
      ),
      keyPrerequisites: ["parallel-lines-and-transversals"],
      generate(rng) {
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const n = nestedPoints(rng, 0.5);
        const atB = rng.bool();
        const v = n.pa;
        const base = atB ? n.pb : n.pc;
        const near = atB ? n.pd : n.pe;
        const other = atB ? n.pc : n.pb;
        const otherNear = atB ? n.pe : n.pd;
        const angle = Math.round(
          toDeg(
            Math.acos(
              ((other[0] - base[0]) * (v[0] - base[0]) + (other[1] - base[1]) * (v[1] - base[1])) /
                (Math.hypot(other[0] - base[0], other[1] - base[1]) * Math.hypot(v[0] - base[0], v[1] - base[1])),
            ),
          ),
        );
        const given = angle + rng.int(-3, 3);
        const [P, Q2, N, M] = atB ? [B, D, C, E] : [C, E, B, D];
        const askInner = rng.bool();
        const answer = askInner ? 180 - given : given;
        const fig = figure(
          [
            ...nestedMarks(n, L, { ticks: true }),
            { kind: "arc", vertex: base, from: other, to: near, label: `${given}°`, accent: true },
            askInner
              ? { kind: "arc", vertex: near, from: base, to: otherNear, label: "x", accent: true }
              : { kind: "arc", vertex: near, from: otherNear, to: n.pa, label: "x", accent: true },
          ],
          `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B} and ${E} the midpoint of ${A}${C}; angle ${P} is ${given}°, and x is the angle ${askInner ? `${P}${Q2}${M}` : `${A}${Q2}${M}`}.`,
          `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${E} 是 ${A}${C} 的中点；角 ${P} 为 ${given}°，x 是角 ${askInner ? `${P}${Q2}${M}` : `${A}${Q2}${M}`}。`,
        );
        void N;
        return {
          ...numberProblem({
            prompt: t(
              `$${D}$ and $${E}$ are the midpoints of $\\overline{${A}${B}}$ and $\\overline{${A}${C}}$, and $m\\angle ${P} = ${given}^\\circ$. Find $x$.`,
              `$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点，$m\\angle ${P} = ${given}^\\circ$。求 $x$。`,
            ),
            answer,
            solveFor: "x",
            unit: "°",
            wrong: [askInner ? given : 180 - given, 90 - given > 0 ? 90 - given : 2 * given],
            solution: askInner
              ? t(
                  `By the midpoint theorem $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$, so $\\angle ${P}${Q2}${M}$ and $\\angle ${P}$ are consecutive interior angles, which are supplementary:${steps(`x = 180^\\circ - ${given}^\\circ = ${answer}^\\circ`)}`,
                  `由中位线定理 $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，所以 $\\angle ${P}${Q2}${M}$ 与 $\\angle ${P}$ 是同旁内角，互补：${steps(`x = 180^\\circ - ${given}^\\circ = ${answer}^\\circ`)}`,
                )
              : t(
                  `By the midpoint theorem $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$, so $\\angle ${A}${Q2}${M}$ and $\\angle ${P}$ are corresponding angles, which are congruent: $x = ${given}^\\circ$.`,
                  `由中位线定理 $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，所以 $\\angle ${A}${Q2}${M}$ 与 $\\angle ${P}$ 是同位角，相等：$x = ${given}^\\circ$。`,
                ),
          }),
          figure: fig,
        };
      },
    },
  ],
};

// ─── 1.4.12 Proving the midpoint theorem ────────────────────────────────────

/** midpointTheoremProof proves that the segment joining two midpoints is parallel to the third side and half as long. */
function midpointTheoremProof(rng: Rng): Proof {
  const L = pickFive(rng);
  const [A, B, C, D, E] = L;
  const fig = nestedFigure(
    rng,
    L,
    { ticks: true },
    `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B} and ${E} the midpoint of ${A}${C}, joined by ${D}${E}.`,
    `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${E} 是 ${A}${C} 的中点，连接 ${D}${E}。`,
  );
  const half = (s: string, w: string) => `${s} = \\tfrac{1}{2}${w}`;
  return {
    given: t(
      `$${D}$ is the midpoint of $\\overline{${A}${B}}$, $${E}$ is the midpoint of $\\overline{${A}${C}}$`,
      `$${D}$ 是 $\\overline{${A}${B}}$ 的中点，$${E}$ 是 $\\overline{${A}${C}}$ 的中点`,
    ),
    prove: t(
      `$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$ and $${half(`${D}${E}`, `${B}${C}`)}$`,
      `$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，且 $${half(`${D}${E}`, `${B}${C}`)}$`,
    ),
    steps: [
      {
        s: t(
          `$${D}$, $${E}$ are the midpoints of $\\overline{${A}${B}}$, $\\overline{${A}${C}}$`,
          `$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点`,
        ),
        r: "given",
      },
      {
        s: m(`${half(`${A}${D}`, `${A}${B}`)}, \\; ${half(`${A}${E}`, `${A}${C}`)}`),
        r: "midpoint",
        alts: [
          m(`${A}${D} = ${A}${E}, \\; ${D}${B} = ${E}${C}`),
          m(`${A}${D} = 2${A}${B}, \\; ${A}${E} = 2${A}${C}`),
          m(`${half(`${D}${E}`, `${B}${C}`)}`),
        ],
      },
      {
        s: m(`\\frac{${A}${D}}{${A}${B}} = \\frac{${A}${E}}{${A}${C}} = \\frac{1}{2}`),
        r: "division",
        why: t(`Divide each equation of step 2 by the whole side.`, `把第 2 步的两个等式分别除以整条边。`),
        alts: [
          m(`\\frac{${A}${D}}{${D}${B}} = \\frac{${A}${E}}{${E}${C}} = \\frac{1}{2}`),
          m(`\\frac{${A}${D}}{${A}${B}} = \\frac{${A}${E}}{${A}${C}} = 2`),
          m(`\\frac{${A}${D}}{${A}${E}} = \\frac{1}{2}`),
        ],
      },
      { s: m(`\\angle ${A} \\cong \\angle ${A}`), r: "reflexive" },
      {
        s: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
        r: "sas",
        alts: [
          m(`\\triangle ${A}${D}${E} \\cong \\triangle ${A}${B}${C}`),
          m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${C}${B}`),
          m(`\\triangle ${A}${E}${D} \\sim \\triangle ${A}${B}${C}`),
        ],
      },
      {
        s: m(`\\frac{${D}${E}}{${B}${C}} = \\frac{1}{2}, \\text{ so } ${half(`${D}${E}`, `${B}${C}`)}`),
        r: "simSides",
        alts: [
          m(`\\frac{${D}${E}}{${B}${C}} = 2, \\text{ so } ${D}${E} = 2${B}${C}`),
          m(`${D}${E} = ${B}${C}`),
          m(`\\frac{${D}${E}}{${A}${D}} = \\frac{1}{2}`),
        ],
      },
      {
        s: m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${B}${C}`),
        r: "simAngles",
        alts: [
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${C}${B}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${E}${D}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${B}${D}${E}`),
        ],
      },
      {
        s: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`),
        r: "corrConverse",
        alts: [
          m(`\\overline{${D}${E}} \\perp \\overline{${A}${B}}`),
          m(`\\overline{${A}${D}} \\parallel \\overline{${A}${E}}`),
          m(`${D}${E} = ${B}${C}`),
        ],
      },
    ],
    figure: fig,
  };
}

/** midpointConverseProof proves that the line through the midpoint of one side parallel to another bisects the third side. */
function midpointConverseProof(rng: Rng): Proof {
  const L = pickFive(rng);
  const [A, B, C, D, E] = L;
  const fig = nestedFigure(
    rng,
    L,
    { arrows: true, ticks: false },
    `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B}, and ${D}${E} parallel to ${B}${C} with ${E} on ${A}${C}.`,
    `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${D}${E} ∥ ${B}${C}，${E} 在 ${A}${C} 上。`,
  );
  return {
    given: t(
      `$${D}$ is the midpoint of $\\overline{${A}${B}}$, $${E}$ is on $\\overline{${A}${C}}$, $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
      `$${D}$ 是 $\\overline{${A}${B}}$ 的中点，$${E}$ 在 $\\overline{${A}${C}}$ 上，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
    ),
    prove: t(`$${E}$ is the midpoint of $\\overline{${A}${C}}$`, `$${E}$ 是 $\\overline{${A}${C}}$ 的中点`),
    steps: [
      { s: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`), r: "given" },
      {
        s: m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${B}${C}`),
        r: "corresponding",
        alts: [
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${C}${B}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${E}${D}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}`),
        ],
      },
      { s: m(`\\angle ${A} \\cong \\angle ${A}`), r: "reflexive" },
      {
        s: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
        r: "aa",
        alts: [
          m(`\\triangle ${A}${D}${E} \\cong \\triangle ${A}${B}${C}`),
          m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${C}${B}`),
          m(`\\triangle ${A}${E}${D} \\sim \\triangle ${A}${B}${C}`),
        ],
      },
      {
        s: m(`\\frac{${A}${E}}{${A}${C}} = \\frac{${A}${D}}{${A}${B}}`),
        r: "simSides",
        alts: [
          m(`\\frac{${A}${E}}{${A}${C}} = \\frac{${A}${B}}{${A}${D}}`),
          m(`\\frac{${A}${E}}{${A}${C}} = \\frac{${D}${B}}{${A}${B}}`),
          m(`${A}${E} = ${A}${D}`),
        ],
      },
      {
        s: m(`\\frac{${A}${D}}{${A}${B}} = \\frac{1}{2}`),
        r: "midpoint",
        alts: [m(`\\frac{${A}${D}}{${A}${B}} = 2`), m(`\\frac{${A}${D}}{${D}${B}} = \\frac{1}{2}`), m(`${A}${D} = ${A}${B}`)],
      },
      {
        s: m(`\\frac{${A}${E}}{${A}${C}} = \\frac{1}{2}`),
        r: "substitution",
        why: t("Combine steps 5 and 6.", "结合第 5、6 步。"),
        alts: [m(`\\frac{${A}${E}}{${A}${C}} = 2`), m(`\\frac{${A}${E}}{${E}${C}} = \\frac{1}{2}`), m(`${A}${E} = ${A}${C}`)],
      },
      {
        s: t(`$${E}$ is the midpoint of $\\overline{${A}${C}}$`, `$${E}$ 是 $\\overline{${A}${C}}$ 的中点`),
        r: "midpoint",
        why: t(
          `$${A}${E}$ is half of $${A}${C}$, so $${A}${E} = ${E}${C}$.`,
          `$${A}${E}$ 是 $${A}${C}$ 的一半，所以 $${A}${E} = ${E}${C}$。`,
        ),
      },
    ],
    figure: fig,
  };
}

const midpointPool: readonly Reason[] = [
  "corresponding",
  "reflexive",
  "aa",
  "sas",
  "sss",
  "simAngles",
  "simSides",
  "corrConverse",
  "midpoint",
  "substitution",
  "division",
];

export const provingTheMidpointTheorem: TopicDef = {
  id: "proving-the-midpoint-theorem",
  title: t("Proving the Midpoint Theorem", "证明三角形中位线定理"),
  summary: t(
    "Prove the midpoint theorem and its converse with similar triangles, and check the theorem with coordinates.",
    "用相似三角形证明中位线定理及其逆定理，并用坐标验证该定理。",
  ),
  prerequisites: ["the-midpoint-theorem", "proving-similarity-statements", "slope-of-a-line"],
  encompasses: [
    { topic: "proving-similarity-statements", weight: 0.4 },
    { topic: "the-midpoint-theorem", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.CO.C.10", "CCSS.HSG.GPE.B.4"],
  knowledgePoints: [
    {
      id: "proving-the-theorem",
      title: t("Proving the theorem", "证明定理"),
      explanation: t(
        "Let $D$ and $E$ be the midpoints of $\\overline{AB}$ and $\\overline{AC}$.\n\n1. $AD = \\frac{1}{2}AB$ and $AE = \\frac{1}{2}AC$: definition of a midpoint.\n2. $\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{2}$, and $\\angle A \\cong \\angle A$.\n3. $\\triangle ADE \\sim \\triangle ABC$ by SAS, with scale factor $\\frac{1}{2}$.\n4. So $DE = \\frac{1}{2}BC$, and $\\angle ADE \\cong \\angle ABC$.\n5. Congruent corresponding angles make $\\overline{DE} \\parallel \\overline{BC}$.",
        "设 $D$、$E$ 分别是 $\\overline{AB}$、$\\overline{AC}$ 的中点。\n\n1. $AD = \\frac{1}{2}AB$，$AE = \\frac{1}{2}AC$：中点的定义。\n2. $\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{2}$，且 $\\angle A \\cong \\angle A$。\n3. 由 SAS，$\\triangle ADE \\sim \\triangle ABC$，相似比为 $\\frac{1}{2}$。\n4. 所以 $DE = \\frac{1}{2}BC$，且 $\\angle ADE \\cong \\angle ABC$。\n5. 同位角相等，所以 $\\overline{DE} \\parallel \\overline{BC}$。",
      ),
      generate: (rng) => proofProblem(rng, midpointTheoremProof(rng), midpointPool),
    },
    {
      id: "proving-the-converse",
      title: t("Proving the converse", "证明逆定理"),
      explanation: t(
        "**Converse:** the line through the midpoint of one side of a triangle, parallel to a second side, passes through the midpoint of the third side.\n\nWith $D$ the midpoint of $\\overline{AB}$ and $\\overline{DE} \\parallel \\overline{BC}$: corresponding angles give $\\angle ADE \\cong \\angle ABC$, and $\\angle A$ is shared, so $\\triangle ADE \\sim \\triangle ABC$ by AA. Then $\\frac{AE}{AC} = \\frac{AD}{AB} = \\frac{1}{2}$, so $E$ is the midpoint of $\\overline{AC}$.",
        "**逆定理**：过三角形一边的中点、平行于另一边的直线，必经过第三边的中点。\n\n设 $D$ 是 $\\overline{AB}$ 的中点，$\\overline{DE} \\parallel \\overline{BC}$：由同位角得 $\\angle ADE \\cong \\angle ABC$，$\\angle A$ 是公共角，所以由 AA，$\\triangle ADE \\sim \\triangle ABC$。于是 $\\frac{AE}{AC} = \\frac{AD}{AB} = \\frac{1}{2}$，所以 $E$ 是 $\\overline{AC}$ 的中点。",
      ),
      generate: (rng) => proofProblem(rng, midpointConverseProof(rng), midpointPool),
    },
    {
      id: "checking-with-coordinates",
      title: t("Checking with coordinates", "用坐标验证"),
      explanation: t(
        "The **midpoint** of the segment from $(x_1, y_1)$ to $(x_2, y_2)$ is $\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$. With coordinates, the midpoint theorem can be checked: the midsegment has the same slope as the third side.\n\nFor $A(2, 6)$, $B(-4, 0)$, $C(6, -2)$: the midpoints of $\\overline{AB}$ and $\\overline{AC}$ are $D(-1, 3)$ and $E(4, 2)$. The slope of $\\overline{DE}$ is $\\frac{2 - 3}{4 - (-1)} = -\\frac{1}{5}$, the same as the slope of $\\overline{BC}$, $\\frac{-2 - 0}{6 - (-4)} = -\\frac{1}{5}$.",
        "从 $(x_1, y_1)$ 到 $(x_2, y_2)$ 的线段的**中点**是 $\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$。用坐标可以验证中位线定理：中位线与第三边的斜率相同。\n\n对 $A(2, 6)$、$B(-4, 0)$、$C(6, -2)$：$\\overline{AB}$ 与 $\\overline{AC}$ 的中点为 $D(-1, 3)$ 和 $E(4, 2)$。$\\overline{DE}$ 的斜率为 $\\frac{2 - 3}{4 - (-1)} = -\\frac{1}{5}$，与 $\\overline{BC}$ 的斜率 $\\frac{-2 - 0}{6 - (-4)} = -\\frac{1}{5}$ 相同。",
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        for (;;) {
          const pt = (): [number, number] => [2 * rng.int(-4, 4), 2 * rng.int(-4, 4)];
          const [a, b, c] = [pt(), pt(), pt()];
          if (b[0] === c[0] || a[0] === b[0] || a[0] === c[0]) continue;
          const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
          if (Math.abs(area) < 16) continue;
          const d: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          const e: [number, number] = [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2];
          const slope = Q.of(e[1] - d[1], e[0] - d[0]);
          const [A, B, C, D, E] = pickFive(rng);
          const sub = (v: number) => (v < 0 ? `(${v})` : String(v));
          return numberProblem({
            prompt: t(
              `In $\\triangle ${A}${B}${C}$, $${A}${pointLatex(a)}$, $${B}${pointLatex(b)}$ and $${C}${pointLatex(c)}$. $${D}$ and $${E}$ are the midpoints of $\\overline{${A}${B}}$ and $\\overline{${A}${C}}$. Find the slope of $\\overline{${D}${E}}$.`,
              `在 $\\triangle ${A}${B}${C}$ 中，$${A}${pointLatex(a)}$，$${B}${pointLatex(b)}$，$${C}${pointLatex(c)}$。$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点。求 $\\overline{${D}${E}}$ 的斜率。`,
            ),
            answer: slope,
            wrong: [Q.of(b[1] - a[1], b[0] - a[0]), Q.of(c[1] - a[1], c[0] - a[0]), Q.of(e[0] - d[0], e[1] - d[1] || 7), slope.neg()],
            solution: t(
              `The midpoints are $${D}${pointLatex(d)}$ and $${E}${pointLatex(e)}$, so the slope of $\\overline{${D}${E}}$ is${steps(`\\frac{${e[1]} - ${sub(d[1])}}{${e[0]} - ${sub(d[0])}} = ${slope.toLatex()}`)}It equals the slope of $\\overline{${B}${C}}$, $\\frac{${c[1]} - ${sub(b[1])}}{${c[0]} - ${sub(b[0])}} = ${slope.toLatex()}$, as the midpoint theorem says.`,
              `两个中点为 $${D}${pointLatex(d)}$ 和 $${E}${pointLatex(e)}$，所以 $\\overline{${D}${E}}$ 的斜率为${steps(`\\frac{${e[1]} - ${sub(d[1])}}{${e[0]} - ${sub(d[0])}} = ${slope.toLatex()}`)}它等于 $\\overline{${B}${C}}$ 的斜率 $\\frac{${c[1]} - ${sub(b[1])}}{${c[0]} - ${sub(b[0])}} = ${slope.toLatex()}$，正如中位线定理所说。`,
            ),
          });
        }
      },
    },
  ],
};

// ─── 1.4.13 The triangle proportionality theorem ────────────────────────────

/** propParts picks AD = a·u, DB = b·u, AE = a·w, EC = b·w with a ≠ b. */
function propParts(rng: Rng): { AD: number; DB: number; AE: number; EC: number } {
  for (;;) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    if (a === b || gcd(a, b) !== 1) continue;
    const u = rng.int(1, 4);
    const w = rng.int(1, 4);
    if (u === w && rng.bool()) continue;
    return { AD: a * u, DB: b * u, AE: a * w, EC: b * w };
  }
}

export const theTriangleProportionalityTheorem: TopicDef = {
  id: "the-triangle-proportionality-theorem",
  title: t("The Triangle Proportionality Theorem", "三角形比例定理（平行线分线段成比例）"),
  summary: t(
    "Use that a line parallel to one side of a triangle divides the other two sides proportionally, and its converse.",
    "运用平行于三角形一边的直线截其他两边所得线段成比例，以及它的逆定理。",
  ),
  prerequisites: ["the-midpoint-theorem"],
  encompasses: [
    { topic: "proportions", weight: 0.4 },
    { topic: "the-midpoint-theorem", weight: 0.3 },
    { topic: "the-aa-similarity-criterion", weight: 0.3 },
    { topic: "equations-with-parentheses", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.B.4"],
  knowledgePoints: [
    {
      id: "dividing-sides-proportionally",
      title: t("Dividing sides proportionally", "按比例分两边"),
      explanation: t(
        "**Triangle proportionality theorem:** if a line parallel to one side of a triangle meets the other two sides at $D$ and $E$, it divides them proportionally:\n\n$$\\frac{AD}{DB} = \\frac{AE}{EC}.$$\n\nIf $AD = 6$, $DB = 4$ and $AE = 9$, then $\\frac{6}{4} = \\frac{9}{EC}$, so $EC = 6$. (The midpoint theorem is the case $AD = DB$.)",
        "**三角形比例定理**：如果平行于三角形一边的直线与另两边交于 $D$、$E$，那么它把这两边分成比例线段：\n\n$$\\frac{AD}{DB} = \\frac{AE}{EC}。$$\n\n若 $AD = 6$，$DB = 4$，$AE = 9$，则 $\\frac{6}{4} = \\frac{9}{EC}$，所以 $EC = 6$。（中位线定理是 $AD = DB$ 的情形。）",
      ),
      generate(rng) {
        const { AD, DB, AE, EC } = propParts(rng);
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const ask = rng.int(0, 3);
        const vals = [AD, DB, AE, EC];
        const labels = vals.map((v, i) => (i === ask ? "x" : String(v)));
        const n = nestedPoints(rng, AD / (AD + DB));
        const fig = figure(
          nestedMarks(n, L, { arrows: true, ad: labels[0], db: labels[1], ae: labels[2], ec: labels[3] }),
          `Triangle ${A}${B}${C} with ${D}${E} parallel to ${B}${C}; ${A}${D} = ${labels[0]}, ${D}${B} = ${labels[1]}, ${A}${E} = ${labels[2]}, ${E}${C} = ${labels[3]}.`,
          `三角形 ${A}${B}${C}，${D}${E} ∥ ${B}${C}；${A}${D} = ${labels[0]}，${D}${B} = ${labels[1]}，${A}${E} = ${labels[2]}，${E}${C} = ${labels[3]}。`,
        );
        const answer = vals[ask]!;
        const t1 = `\\frac{${labels[0]}}{${labels[1]}} = \\frac{${labels[2]}}{${labels[3]}}`;
        // The additive mistake keeps the differences equal instead of the ratios.
        const additive = [AE + DB - EC, AD + EC - AE, AD + EC - DB, AE + DB - AD][ask]!;
        const swapped = [Q.of(DB * AE, EC), Q.of(AD * EC, AE), Q.of(DB * AD, EC), Q.of(AE * AD, DB)][ask]!;
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$. Find $x$.`,
              `如图，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$。求 $x$。`,
            ),
            answer,
            solveFor: "x",
            wrong: [additive, swapped],
            solution: t(
              `By the triangle proportionality theorem, $\\frac{${A}${D}}{${D}${B}} = \\frac{${A}${E}}{${E}${C}}$:${steps(t1, `x = ${answer}`)}`,
              `由三角形比例定理，$\\frac{${A}${D}}{${D}${B}} = \\frac{${A}${E}}{${E}${C}}$：${steps(t1, `x = ${answer}`)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "parts-and-whole-sides",
      title: t("Parts and whole sides", "部分与整条边"),
      explanation: t(
        "The theorem compares parts with parts. When a whole side is given, find the parts first, or use a part over the whole on both sides: $\\frac{AD}{AB} = \\frac{AE}{AC}$.\n\nIf $AD = 4$, $AB = 10$ and $AC = 15$, then $\\frac{AE}{15} = \\frac{4}{10}$, so $AE = 6$ and $EC = 15 - 6 = 9$.",
        "定理比较的是部分与部分。给出整条边时，先求出各部分，或者两边都用部分比整体：$\\frac{AD}{AB} = \\frac{AE}{AC}$。\n\n若 $AD = 4$，$AB = 10$，$AC = 15$，则 $\\frac{AE}{15} = \\frac{4}{10}$，所以 $AE = 6$，$EC = 15 - 6 = 9$。",
      ),
      generate(rng) {
        const { AD, DB, AE, EC } = propParts(rng);
        const [AB, AC] = [AD + DB, AE + EC];
        const [A, B, C, D, E] = pickFive(rng);
        const askEC = rng.bool();
        const answer = askEC ? EC : AE;
        const fig = figure(
          nestedMarks(nestedPoints(rng, AD / AB), [A, B, C, D, E], { arrows: true }),
          `Triangle ${A}${B}${C} with ${D} on ${A}${B}, ${E} on ${A}${C}, and ${D}${E} parallel to ${B}${C}.`,
          `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，${D}${E} ∥ ${B}${C}。`,
        );
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$, $${A}${D} = ${AD}$, $${A}${B} = ${AB}$ and $${A}${C} = ${AC}$. Find $${askEC ? `${E}${C}` : `${A}${E}`}$.`,
              `如图，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，$${A}${D} = ${AD}$，$${A}${B} = ${AB}$，$${A}${C} = ${AC}$。求 $${askEC ? `${E}${C}` : `${A}${E}`}$。`,
            ),
            answer,
            wrong: askEC ? [AE, Q.of(AC * DB, AD)] : [EC, Q.of(AC * AD, DB)],
            solution: t(
              `Compare part over whole on both sides:${steps(prop(`${A}${E}`, String(AC), String(AD), String(AB)), `${A}${E} = \\frac{${AD} \\cdot ${AC}}{${AB}} = ${AE}`)}${askEC ? `Then $${E}${C} = ${AC} - ${AE} = ${EC}$.` : ""}`,
              `两边都用部分比整体：${steps(prop(`${A}${E}`, String(AC), String(AD), String(AB)), `${A}${E} = \\frac{${AD} \\cdot ${AC}}{${AB}} = ${AE}`)}${askEC ? `于是 $${E}${C} = ${AC} - ${AE} = ${EC}$。` : ""}`,
            ),
          }),
          figure: fig,
        };
      },
    },
    {
      id: "proportionality-with-algebra",
      title: t("Proportionality with algebra", "含未知数的比例"),
      explanation: t(
        `When a segment is an expression, write the proportion, cross-multiply and solve.\n\nWith $AD = 4$, $DB = 6$, $AE = x + 2$ and $EC = 9$:${steps("\\frac{4}{6} = \\frac{x + 2}{9} \\quad\\Rightarrow\\quad 6(x + 2) = 36 \\quad\\Rightarrow\\quad x = 4")}`,
        `当一条线段是式子时，写出比例式，交叉相乘再求解。\n\n若 $AD = 4$，$DB = 6$，$AE = x + 2$，$EC = 9$：${steps("\\frac{4}{6} = \\frac{x + 2}{9} \\quad\\Rightarrow\\quad 6(x + 2) = 36 \\quad\\Rightarrow\\quad x = 4")}`,
      ),
      keyPrerequisites: ["proportions"],
      generate(rng) {
        for (;;) {
          const { AD, DB, AE, EC } = propParts(rng);
          const onAE = rng.bool();
          const target = onAE ? AE : EC;
          const x = rng.int(2, 9);
          const c = rng.int(1, 3);
          const d = target - c * x;
          if (d === 0 || Math.abs(d) > 12) continue;
          const [A, B, C, D, E] = pickFive(rng);
          const expr = plain(c, d);
          const labels = [String(AD), String(DB), onAE ? expr : String(AE), onAE ? String(EC) : expr];
          const fig = figure(
            nestedMarks(nestedPoints(rng, AD / (AD + DB)), [A, B, C, D, E], {
              arrows: true,
              ad: labels[0],
              db: labels[1],
              ae: labels[2],
              ec: labels[3],
            }),
            `Triangle ${A}${B}${C} with ${D}${E} parallel to ${B}${C}; ${A}${D} = ${labels[0]}, ${D}${B} = ${labels[1]}, ${A}${E} = ${labels[2]}, ${E}${C} = ${labels[3]}.`,
            `三角形 ${A}${B}${C}，${D}${E} ∥ ${B}${C}；${A}${D} = ${labels[0]}，${D}${B} = ${labels[1]}，${A}${E} = ${labels[2]}，${E}${C} = ${labels[3]}。`,
          );
          const lin = linear(c, d);
          const eq = onAE ? prop(String(AD), String(DB), lin, String(EC)) : prop(String(AD), String(DB), String(AE), lin);
          // A learner who flips one ratio solves AD/DB = EC/(cx + d) or AD/DB = (cx + d)/AE.
          const flipped = onAE
            ? Q.of(EC * DB, AD)
                .sub(Q.of(d))
                .div(Q.of(c))
            : Q.of(AE * AD, DB)
                .sub(Q.of(d))
                .div(Q.of(c));
          return {
            ...numberProblem({
              prompt: t(
                `In the figure, $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$. Find $x$.`,
                `如图，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$。求 $x$。`,
              ),
              answer: x,
              solveFor: "x",
              wrong: [flipped, target],
              solution: t(
                `By the triangle proportionality theorem:${steps(eq, `${lin} = ${target}`, `x = ${x}`)}`,
                `由三角形比例定理：${steps(eq, `${lin} = ${target}`, `x = ${x}`)}`,
              ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "the-converse",
      title: t("The converse", "逆定理"),
      explanation: t(
        "**Converse:** if a segment divides two sides of a triangle proportionally, it is parallel to the third side. So to decide whether $\\overline{DE} \\parallel \\overline{BC}$, compare $\\frac{AD}{DB}$ with $\\frac{AE}{EC}$.\n\n$AD = 5$, $DB = 3$, $AE = 10$, $EC = 6$: $\\frac{5}{3} = \\frac{10}{6}$, so parallel. With $EC = 7$ instead, $\\frac{10}{7} \\ne \\frac{5}{3}$, so not parallel.",
        "**逆定理**：如果一条线段把三角形的两边分成比例线段，那么它平行于第三边。所以要判断 $\\overline{DE} \\parallel \\overline{BC}$ 是否成立，就比较 $\\frac{AD}{DB}$ 与 $\\frac{AE}{EC}$。\n\n$AD = 5$，$DB = 3$，$AE = 10$，$EC = 6$：$\\frac{5}{3} = \\frac{10}{6}$，所以平行。若 $EC = 7$，则 $\\frac{10}{7} \\ne \\frac{5}{3}$，所以不平行。",
      ),
      generate(rng) {
        const { AD, DB, AE } = propParts(rng);
        let { EC } = propParts(rng);
        EC = (AE * DB) / AD;
        const parallel = rng.bool();
        const ec = parallel ? EC : EC + rng.pick([-2, -1, 1, 2]);
        const ecFinal = ec <= 0 ? EC + 1 : ec;
        const isParallel = AD * ecFinal === DB * AE;
        const [A, B, C, D, E] = pickFive(rng);
        const n = nestedPoints(rng, AD / (AD + DB));
        const pe = lerp(n.pa, n.pc, AE / (AE + ecFinal));
        const fig = figure(
          nestedMarks({ ...n, pe }, [A, B, C, D, E], { ad: String(AD), db: String(DB), ae: String(AE), ec: String(ecFinal) }),
          `Triangle ${A}${B}${C} with ${D} on ${A}${B} and ${E} on ${A}${C}; ${A}${D} = ${AD}, ${D}${B} = ${DB}, ${A}${E} = ${AE}, ${E}${C} = ${ecFinal}.`,
          `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上；${A}${D} = ${AD}，${D}${B} = ${DB}，${A}${E} = ${AE}，${E}${C} = ${ecFinal}。`,
        );
        const cmp = isParallel ? "=" : "\\ne";
        return {
          ...choiceProblem({
            prompt: t(
              `Is $\\overline{${D}${E}}$ parallel to $\\overline{${B}${C}}$?`,
              `$\\overline{${D}${E}}$ 与 $\\overline{${B}${C}}$ 平行吗？`,
            ),
            options: yesNo,
            correct: isParallel ? 0 : 1,
            solution: t(
              `Compare the ratios:${steps(`\\frac{${A}${D}}{${D}${B}} = \\frac{${AD}}{${DB}} = ${fr(AD, DB)}, \\quad \\frac{${A}${E}}{${E}${C}} = \\frac{${AE}}{${ecFinal}} = ${fr(AE, ecFinal)}`)}Since $${fr(AD, DB)} ${cmp} ${fr(AE, ecFinal)}$, ${isParallel ? `the sides are divided proportionally, so $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$ by the converse of the triangle proportionality theorem.` : "the sides are not divided proportionally, so the segments are not parallel."}`,
              `比较两个比：${steps(`\\frac{${A}${D}}{${D}${B}} = \\frac{${AD}}{${DB}} = ${fr(AD, DB)}, \\quad \\frac{${A}${E}}{${E}${C}} = \\frac{${AE}}{${ecFinal}} = ${fr(AE, ecFinal)}`)}因为 $${fr(AD, DB)} ${cmp} ${fr(AE, ecFinal)}$，${isParallel ? `两边被分成比例线段，由三角形比例定理的逆定理，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$。` : "两边没有被分成比例线段，所以不平行。"}`,
            ),
          }),
          figure: fig,
        };
      },
    },
  ],
};

/** similarityTopics are the topics of Geometry module 1.4, Similarity, in teaching order. */
export const similarityTopics: readonly TopicDef[] = [
  similarityAndSimilarPolygons,
  sideLengthsAndAngleMeasuresOfSimilarPolygons,
  areasOfSimilarPolygons,
  workingWithAreasOfSimilarPolygons,
  similarityTransformations,
  theAASimilarityCriterion,
  theSSSSimilarityCriterion,
  theSASSimilarityCriterion,
  combiningSimilarityCriteriaForTriangles,
  provingSimilarityStatements,
  theMidpointTheorem,
  provingTheMidpointTheorem,
  theTriangleProportionalityTheorem,
];
