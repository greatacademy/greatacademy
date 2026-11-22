import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Compass, linear, type Mark, type PlaneMark, type Point, plane, Q, sketch, type Tone } from "@ga/subject-math";
import { motionDrawings } from "../explanation-drawings-angles.ts";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { similarityDrawings } from "../explanation-drawings-triangles.ts";
import { stagedPolygon } from "../graph-figures.ts";
import { type Motion as Moving, movedPoint, viewAround } from "../motion-figures.ts";
import { choiceProblem, numberProblem, pointLatex, pointProblem, reasonChoice, steps, verdictChoice } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { highlighted, proofFigures } from "./geometry-congruence.ts";

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

/** prop writes the proportion a/b = c/d. */
const prop = (a: string, b: string, c: string, d: string) => `\\frac{${a}}{${b}} = \\frac{${c}}{${d}}`;

/** cat joins texts and plain strings (the same in every locale). */
function cat(...parts: readonly (Text | string)[]): Text {
  const pick = (locale: "en" | "zh-CN") => parts.map((p) => (typeof p === "string" ? p : p[locale])).join("");
  return t(pick("en"), pick("zh-CN"));
}

/** paras joins texts as paragraphs. */
const paras = (...items: readonly Text[]) => t(items.map((p) => p.en).join("\n\n"), items.map((p) => p["zh-CN"]).join("\n\n"));

/** check starts the check of a solution. */
const check = (...body: readonly (Text | string)[]) => cat(t("**Check.** ", "**检验。** "), ...body);

/** step writes step i of a solution with its title and body. */
const step = (i: number, en: string, zh: string, ...body: readonly (Text | string)[]) => cat(stepLabel(i, en, zh), t(" ", ""), ...body);

/** sideIn draws side i of a polygon (from point i to point i + 1) in a tone: corresponding sides share a tone. */
const sideIn = (ps: readonly Point[], i: number, tone: Tone): Mark => ({ kind: "segment", a: ps[i]!, b: ps[(i + 1) % ps.length]!, tone });

/** sizeWord says whether a scale factor enlarges or shrinks. */
const sizeWord = (k: Q) =>
  k.toNumber() > 1
    ? t("greater than $1$, and the second figure is the larger", "大于 $1$，第二个图形较大")
    : t("less than $1$, and the second figure is the smaller", "小于 $1$，第二个图形较小");

/** ratioIs writes the ratio n : d as a fraction, followed by its reduced form when it reduces. */
const ratioIs = (n: number, d: number): Text => {
  const q = Q.of(n, d).toLatex();
  const raw = `\\frac{${n}}{${d}}`;
  return q === raw ? m(raw) : t(`$${raw}$, which is $${q}$`, `$${raw}$，即 $${q}$`);
};

/** sub writes a number for substitution, in parentheses when negative. */
const sub = (v: number) => (v < 0 ? `(${v})` : String(v));

// ─── 1.4.1 Similarity and similar polygons ──────────────────────────────────

/** ordinals name the places of the letters in a statement. */
const ordinals = {
  en: ["first", "second", "third", "fourth"],
  zh: ["第一", "第二", "第三", "第四"],
} as const;

/** rect is a w by h rectangle with its lower left corner at the origin: side 0 along the bottom has length w, side 1 has length h. */
const rect = ([w, h]: readonly [number, number]): Point[] => [
  [0, 0],
  [w, 0],
  [w, h],
  [0, h],
];

/** rectTones colors the sides of a rectangle by length: the shorter sides in the action color, the longer in the result color. */
function rectTones(ps: readonly Point[], [w, h]: readonly [number, number]): Mark[] {
  const [wt, ht]: [Tone, Tone] = w <= h ? ["action", "result"] : ["result", "action"];
  return [sideIn(ps, 0, wt), sideIn(ps, 2, wt), sideIn(ps, 1, ht), sideIn(ps, 3, ht)];
}

/** similarityIntroFigure shows a 3-4-5 triangle beside its copy dilated by 2 and turned, each pair of corresponding sides in one color. */
const similarityIntroFigure: Figure = (() => {
  const sh: Tri3 = [3, 4, 5];
  const [p1, p2] = sideBySide(bySides(sh), posed(bySides(sh), { turn: 160, mirror: false }), 2);
  const tones: Tone[] = ["action", "result", "action"];
  return figure(
    [
      ...polyMarks(p1, "ABC", ["3", "4", "5"]),
      ...polyMarks(p2, "PQR", ["6", "8", "10"]),
      ...[0, 1].flatMap((i) => [sideIn(p1, i, tones[i]!), sideIn(p2, i, tones[i]!)]),
    ],
    "Triangle ABC with AB = 3, BC = 4, CA = 5, and triangle PQR, turned, with PQ = 6, QR = 8, RP = 10. AB and PQ are drawn in one color, BC and QR in another.",
    "三角形 ABC：AB = 3，BC = 4，CA = 5；转过一个角度的三角形 PQR：PQ = 6，QR = 8，RP = 10。AB 与 PQ 用一种颜色，BC 与 QR 用另一种颜色。",
  );
})();

export const similarityAndSimilarPolygons: TopicDef = {
  id: "similarity-and-similar-polygons",
  title: t("Similarity and Similar Polygons", "相似与相似多边形"),
  summary: t(
    "Read the correspondence of a similarity statement, decide whether two rectangles are similar, and find a scale factor.",
    "读出相似式中的对应关系，判断两个矩形是否相似，并求相似比。",
  ),
  prerequisites: ["dilations-of-geometric-figures"],
  encompasses: [{ topic: "dilations-of-geometric-figures", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSG.SRT.A.2"],
  intro: t(
    "A dilation multiplies every length by its scale factor and leaves every angle as it was. A rigid motion then moves the result without changing it at all. Two figures that one of these sequences carries onto each other have the same shape, though not always the same size: they are **similar**. Similarity is what lets a map, a scale model or an enlarged photo tell the truth about the real thing.\n\nDilate $\\triangle ABC$, with $AB = 3$, $BC = 4$ and $CA = 5$, by the factor $2$ and turn it. The image $\\triangle PQR$ has sides $6$, $8$ and $10$.\n\n{{figure 0}}\n\nEach side of $\\triangle PQR$ is twice the side it came from: $\\frac{6}{3} = \\frac{8}{4} = \\frac{10}{5} = 2$, and each angle is the angle it came from. We write $\\triangle ABC \\sim \\triangle PQR$, listing the vertices in the order they correspond: $A$ went to $P$, $B$ to $Q$ and $C$ to $R$. In this lesson we read such statements, decide whether two rectangles are similar, and find the factor that takes one polygon to the other.",
    "位似把每条线段的长都乘以比例因子，而每个角保持不变。之后的刚体运动只移动图形，完全不改变它。如果这样的一串变换能把一个图形变成另一个，两个图形的形状就相同，大小却未必相同：它们**相似**。地图、比例模型和放大的照片之所以能如实反映实物，靠的就是相似。\n\n把 $\\triangle ABC$（$AB = 3$，$BC = 4$，$CA = 5$）按比例因子 $2$ 作位似，再转一个角度，得到的像 $\\triangle PQR$ 三边为 $6$、$8$、$10$。\n\n{{figure 0}}\n\n$\\triangle PQR$ 的每条边都是原来那条边的两倍：$\\frac{6}{3} = \\frac{8}{4} = \\frac{10}{5} = 2$，每个角都等于原来的角。我们写作 $\\triangle ABC \\sim \\triangle PQR$，顶点按对应的顺序书写：$A$ 变到 $P$，$B$ 变到 $Q$，$C$ 变到 $R$。这节课我们学习读懂这样的相似式，判断两个矩形是否相似，并求出从一个多边形到另一个的比例因子。",
  ),
  introFigures: [similarityIntroFigure],
  knowledgePoints: [
    {
      id: "corresponding-parts",
      figure: similarityDrawings["corresponding-parts"],
      title: t("Corresponding parts", "对应部分"),
      explanation: t(
        "Two polygons are **similar** ($\\sim$) when one is a scaled copy of the other: their **corresponding angles are congruent** and their **corresponding sides are proportional**. The scaling keeps angles and multiplies every side by the same number, so both facts hold at once.\n\nA similarity statement lists corresponding vertices in the same order. $\\triangle ABC \\sim \\triangle FDE$ pairs the first letters, the second letters and the third letters: $A \\leftrightarrow F$, $B \\leftrightarrow D$, $C \\leftrightarrow E$. So $\\angle B \\cong \\angle D$, and the side $\\overline{BC}$, made of the second and third letters, corresponds to $\\overline{DE}$, the second and third letters on the other side.\n\n> **Watch out.** Pair letters by their places in the statement, not by the alphabet or by how the figures look. In $\\triangle ABC \\sim \\triangle FDE$, $B$ is second, so it pairs with $D$, the second letter of $FDE$, not with $E$, which follows $D$ in the alphabet.",
        "两个多边形**相似**（$\\sim$）是指一个是另一个按比例缩放得到的：它们的**对应角相等**，**对应边成比例**。缩放不改变角，并把每条边都乘以同一个数，所以这两条同时成立。\n\n相似式按相同顺序列出对应顶点。$\\triangle ABC \\sim \\triangle FDE$ 把第一个字母、第二个字母、第三个字母分别配对：$A \\leftrightarrow F$，$B \\leftrightarrow D$，$C \\leftrightarrow E$。所以 $\\angle B \\cong \\angle D$；边 $\\overline{BC}$ 由第二、三个字母组成，对应另一边的第二、三个字母组成的 $\\overline{DE}$。\n\n> **注意。** 要按字母在相似式中的位置配对，不能按字母表顺序，也不能凭图形的样子。在 $\\triangle ABC \\sim \\triangle FDE$ 中，$B$ 排第二，所以它与 $FDE$ 的第二个字母 $D$ 配对，而不是与字母表中排在 $D$ 后面的 $E$ 配对。",
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
        const match = step(
          1,
          "match the vertices",
          "配对顶点",
          t(`The statement pairs the vertices by their places: $${pairs}$.`, `相似式按位置配对顶点：$${pairs}$。`),
        );
        const i = rng.int(0, n - 1);
        const j = (i + 1) % n;
        const place = (k: number) => t(ordinals.en[k]!, ordinals.zh[k]!);
        if (rng.bool()) {
          const sideOf = (k: number) => `\\overline{${q[k]}${q[(k + 1) % n]}}`;
          const sideP = (k: number) => `\\overline{${p[k]}${p[(k + 1) % n]}}`;
          const options = rng.shuffle(range(n).map(sideOf));
          const correct = options.indexOf(sideOf(i));
          return reasoned(
            choiceProblem({
              prompt: t(
                `${given.en} which side corresponds to $\\overline{${p[i]}${p[j]}}$?`,
                `${given["zh-CN"]}哪条边与 $\\overline{${p[i]}${p[j]}}$ 对应？`,
              ),
              options: options.map(m),
              correct,
              solution: paras(
                match,
                step(
                  2,
                  "find the partner",
                  "找对应边",
                  t(
                    `$\\overline{${p[i]}${p[j]}}$ joins $${p[i]}$ and $${p[j]}$, which pair with $${q[i]}$ and $${q[j]}$. So it corresponds to $${sideOf(i)}$.`,
                    `$\\overline{${p[i]}${p[j]}}$ 连接 $${p[i]}$ 和 $${p[j]}$，它们分别与 $${q[i]}$、$${q[j]}$ 配对。所以它对应 $${sideOf(i)}$。`,
                  ),
                ),
                check(
                  t(
                    `Go back the other way: $${q[i]}$ and $${q[j]}$ are the ${place(i).en} and ${place(j).en} letters of $${name(q)}$, and the ${place(i).en} and ${place(j).en} letters of $${name(p)}$ are $${p[i]}$ and $${p[j]}$, the side we started from.`,
                    `反过来读：$${q[i]}$ 和 $${q[j]}$ 是 $${name(q)}$ 的${place(i)["zh-CN"]}、${place(j)["zh-CN"]}个字母，而 $${name(p)}$ 的${place(i)["zh-CN"]}、${place(j)["zh-CN"]}个字母是 $${p[i]}$ 和 $${p[j]}$，正是出发时的那条边。`,
                  ),
                ),
              ),
            }),
            range(n)
              .filter((k) => k !== i)
              .map((k) => [
                `$${sideOf(k)}$`,
                `This side corresponds to $${sideP(k)}$: its letters are in the same places as $${p[k]}$ and $${p[(k + 1) % n]}$.`,
                `这条边对应 $${sideP(k)}$：它的字母与 $${p[k]}$、$${p[(k + 1) % n]}$ 位置相同。`,
              ]),
          );
        }
        const angleOf = (k: number) => `\\angle ${q[k]}`;
        const options = rng.shuffle(range(n).map(angleOf));
        return reasoned(
          choiceProblem({
            prompt: t(`${given.en} which angle is congruent to $\\angle ${p[i]}$?`, `${given["zh-CN"]}哪个角与 $\\angle ${p[i]}$ 相等？`),
            options: options.map(m),
            correct: options.indexOf(angleOf(i)),
            solution: paras(
              match,
              step(
                2,
                "find the partner",
                "找对应角",
                t(
                  `$${p[i]}$ pairs with $${q[i]}$, and corresponding angles of similar polygons are congruent, so $\\angle ${p[i]} \\cong \\angle ${q[i]}$.`,
                  `$${p[i]}$ 与 $${q[i]}$ 配对，而相似多边形的对应角相等，所以 $\\angle ${p[i]} \\cong \\angle ${q[i]}$。`,
                ),
              ),
              check(
                t(
                  `$${q[i]}$ is the ${place(i).en} letter of $${name(q)}$, and the ${place(i).en} letter of $${name(p)}$ is $${p[i]}$: the angle we started from.`,
                  `$${q[i]}$ 是 $${name(q)}$ 的${place(i)["zh-CN"]}个字母，而 $${name(p)}$ 的${place(i)["zh-CN"]}个字母是 $${p[i]}$：正是出发时的那个角。`,
                ),
              ),
            ),
          }),
          range(n)
            .filter((k) => k !== i)
            .map((k) => [
              `$${angleOf(k)}$`,
              `This angle is in the ${ordinals.en[k]} place, so it is congruent to $\\angle ${p[k]}$.`,
              `这个角排在${ordinals.zh[k]}位，所以它与 $\\angle ${p[k]}$ 相等。`,
            ]),
        );
      },
    },
    {
      id: "deciding-whether-rectangles-are-similar",
      figure: similarityDrawings["deciding-whether-rectangles-are-similar"],
      title: t("Similar rectangles", "相似的矩形"),
      explanation: t(
        "All angles of a rectangle are right angles, so two rectangles always have congruent corresponding angles. Whether they are similar depends on the sides alone: they are similar exactly when one scale factor takes both sides of the first to the sides of the second. Compare shorter side with shorter side and longer side with longer side, by dividing.\n\nA $4 \\times 6$ and a $6 \\times 9$ rectangle: $\\frac{6}{4} = \\frac{3}{2}$ and $\\frac{9}{6} = \\frac{3}{2}$, so they are similar. A $4 \\times 6$ and a $6 \\times 8$ rectangle: $\\frac{6}{4} = \\frac{3}{2}$ but $\\frac{8}{6} = \\frac{4}{3}$, so they are not.\n\n> **Watch out.** Similar means the sides are multiplied by the same number, not increased by the same amount. The $4 \\times 6$ and $6 \\times 8$ rectangles both grow by $2$, yet they are not similar. Right angles alone prove nothing either: every rectangle has them.",
        "矩形的角都是直角，所以两个矩形的对应角总是相等。它们是否相似只取决于边：当同一个比例因子能把第一个矩形的两边都变成第二个矩形的两边时，它们相似。要用除法比较：短边比短边，长边比长边。\n\n$4 \\times 6$ 与 $6 \\times 9$ 的矩形：$\\frac{6}{4} = \\frac{3}{2}$，$\\frac{9}{6} = \\frac{3}{2}$，所以相似。$4 \\times 6$ 与 $6 \\times 8$ 的矩形：$\\frac{6}{4} = \\frac{3}{2}$，但 $\\frac{8}{6} = \\frac{4}{3}$，所以不相似。\n\n> **注意。** 相似是各边乘以同一个数，而不是加上同一个数。$4 \\times 6$ 与 $6 \\times 8$ 的矩形两边都增加了 $2$，却不相似。只有直角也说明不了什么：每个矩形都有直角。",
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
          const [p1, p2] = sideBySide(rect(r1), rect(r2), Math.max(...r2) / Math.max(...r1));
          const base = [...polyMarks(p1, "ABCD", [String(r1[0]), String(r1[1])]), ...polyMarks(p2, "EFGH", [String(r2[0]), String(r2[1])])];
          const fig = figure(
            base,
            `Rectangle ABCD, ${r1[0]} by ${r1[1]}, and rectangle EFGH, ${r2[0]} by ${r2[1]}.`,
            `矩形 ABCD，${r1[0]} × ${r1[1]}；矩形 EFGH，${r2[0]} × ${r2[1]}。`,
          );
          const cmp = similar ? "=" : "\\ne";
          // A ratio already in lowest terms is not written twice.
          const ratio = (n: number, d: number) => (fr(n, d) === `\\frac{${n}}{${d}}` ? fr(n, d) : `\\frac{${n}}{${d}} = ${fr(n, d)}`);
          const claimed = fr(s2[1] + (similar ? 1 : 0), s1[1]);
          const [c1, c2] = [s1[0] * s2[1], s1[1] * s2[0]];
          return {
            ...verdictChoice(rng, {
              prompt: t("Are the two rectangles similar?", "这两个矩形相似吗？"),
              holds: similar,
              yes: t(`both side ratios equal $${fr(s2[0], s1[0])}$`, `两个边长比都等于 $${fr(s2[0], s1[0])}$`),
              no: t(`the side ratios are $${fr(s2[0], s1[0])}$ and $${claimed}$`, `两个边长比分别是 $${fr(s2[0], s1[0])}$ 和 $${claimed}$`),
              yesWrong: t("all the angles of both rectangles are right angles", "两个矩形的角都是直角"),
              noWrong: t(
                `the sides grow by different amounts, $${Math.abs(s2[0] - s1[0])}$ and $${Math.abs(s2[1] - s1[1])}$`,
                `两组边增加的量不同，分别是 $${Math.abs(s2[0] - s1[0])}$ 和 $${Math.abs(s2[1] - s1[1])}$`,
              ),
              solution: paras(
                step(
                  1,
                  "pair the sides",
                  "配对各边",
                  t(
                    `All the angles are right angles, so only the sides decide. The shorter sides are $${s1[0]}$ and $${s2[0]}$, the longer sides $${s1[1]}$ and $${s2[1]}$; each pair is drawn in one color:\n\n{{figure 0}}`,
                    `所有角都是直角，所以只看边。短边是 $${s1[0]}$ 和 $${s2[0]}$，长边是 $${s1[1]}$ 和 $${s2[1]}$；每一对用同一种颜色画出：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "compare the ratios",
                  "比较两个比",
                  t(
                    `Divide each side of $EFGH$ by its partner in $ABCD$:${steps(`${ratio(s2[0], s1[0])}, \\qquad ${ratio(s2[1], s1[1])}`)}The ratios are ${similar ? "equal" : "not equal"} ($${fr(s2[0], s1[0])} ${cmp} ${fr(s2[1], s1[1])}$), so the rectangles are ${similar ? "" : "not "}similar.`,
                    `用 $EFGH$ 的每条边除以 $ABCD$ 中与它配对的边：${steps(`${ratio(s2[0], s1[0])}, \\qquad ${ratio(s2[1], s1[1])}`)}两个比${similar ? "相等" : "不相等"}（$${fr(s2[0], s1[0])} ${cmp} ${fr(s2[1], s1[1])}$），所以这两个矩形${similar ? "相似" : "不相似"}。`,
                  ),
                ),
                check(
                  t(
                    `Cross-multiply instead of dividing: the ratios are equal exactly when $${s1[0]} \\cdot ${s2[1]}$ equals $${s1[1]} \\cdot ${s2[0]}$. Here $${s1[0]} \\cdot ${s2[1]} = ${c1}$ and $${s1[1]} \\cdot ${s2[0]} = ${c2}$, which are ${similar ? "equal: similar, as found" : "not equal: not similar, as found"}.`,
                    `不用除法，改用交叉相乘：两个比相等当且仅当 $${s1[0]} \\cdot ${s2[1]}$ 等于 $${s1[1]} \\cdot ${s2[0]}$。这里 $${s1[0]} \\cdot ${s2[1]} = ${c1}$，$${s1[1]} \\cdot ${s2[0]} = ${c2}$，${similar ? "两者相等：相似，与上面的结论一致" : "两者不相等：不相似，与上面的结论一致"}。`,
                  ),
                ),
              ),
            }),
            figure: fig,
            solutionFigures: [
              figure(
                [...base, ...rectTones(p1, r1), ...rectTones(p2, r2)],
                `The same rectangles with the shorter sides, ${s1[0]} and ${s2[0]}, in one color and the longer sides, ${s1[1]} and ${s2[1]}, in another.`,
                `同样的两个矩形：短边 ${s1[0]} 和 ${s2[0]} 用一种颜色，长边 ${s1[1]} 和 ${s2[1]} 用另一种颜色。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "finding-the-scale-factor",
      figure: similarityDrawings["finding-the-scale-factor"],
      title: t("The scale factor", "相似比"),
      explanation: t(
        "The **scale factor** from one polygon to a similar one is the number that multiplies every side of the first to give the corresponding side of the second. So it is a side of the second divided by the corresponding side of the first: new over old. It is the factor of the dilation that, followed by rigid motions, maps the first polygon onto the second.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with $AB = 6$ and $DE = 15$, the scale factor from $\\triangle ABC$ to $\\triangle DEF$ is $\\frac{DE}{AB} = \\frac{15}{6} = \\frac{5}{2}$. Indeed $\\frac{5}{2} \\cdot 6 = 15$. A factor greater than $1$ enlarges, and one less than $1$ shrinks.\n\n> **Watch out.** Put the side of the figure you go **to** on top. From $\\triangle ABC$ to $\\triangle DEF$ the factor is $\\frac{15}{6}$; the flipped ratio $\\frac{6}{15}$ is the factor from $\\triangle DEF$ back to $\\triangle ABC$. And the factor is a ratio, not the difference $15 - 6 = 9$.",
        "从一个多边形到与它相似的多边形的**相似比**，是把第一个图形的每条边变成第二个图形对应边时所乘的数。所以它等于第二个图形的一条边除以第一个图形的对应边：新比旧。它就是一次位似（再接若干刚体运动）把第一个多边形变成第二个时的比例因子。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$AB = 6$，$DE = 15$，则从 $\\triangle ABC$ 到 $\\triangle DEF$ 的相似比为 $\\frac{DE}{AB} = \\frac{15}{6} = \\frac{5}{2}$。确实 $\\frac{5}{2} \\cdot 6 = 15$。相似比大于 $1$ 是放大，小于 $1$ 是缩小。\n\n> **注意。** 要把“变到”的那个图形的边放在分子上。从 $\\triangle ABC$ 到 $\\triangle DEF$ 的相似比是 $\\frac{15}{6}$；倒过来的 $\\frac{6}{15}$ 是从 $\\triangle DEF$ 回到 $\\triangle ABC$ 的相似比。相似比是比，不是差 $15 - 6 = 9$。",
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
        const base = [...polyMarks(p1, L1, s1), ...polyMarks(p2, L2, s2)];
        const [o1, o2] = [(i + 1) % 3, (i + 2) % 3];
        return {
          ...numberProblem({
            prompt: t(
              `$${tri(L1)} \\sim ${tri(L2)}$. Find the scale factor from $${tri(L1)}$ to $${tri(L2)}$.`,
              `$${tri(L1)} \\sim ${tri(L2)}$。求从 $${tri(L1)}$ 到 $${tri(L2)}$ 的相似比。`,
            ),
            answer: k,
            form: "fraction",
            wrong: [Q.one.div(k), Math.abs(sh[i]! * (v - u))],
            solution: paras(
              step(
                1,
                "find corresponding sides",
                "找对应边",
                t(
                  `$\\overline{${side2}}$ is the only side of $${tri(L2)}$ given. Its letters are in the same places as $${L1[i]}$ and $${L1[(i + 1) % 3]}$, so it corresponds to $\\overline{${side1}}$:\n\n{{figure 0}}`,
                  `$${tri(L2)}$ 只给出了边 $\\overline{${side2}}$。它的字母与 $${L1[i]}$、$${L1[(i + 1) % 3]}$ 位置相同，所以它对应 $\\overline{${side1}}$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "divide new by old",
                "新比旧",
                t(
                  `Going from $${tri(L1)}$ to $${tri(L2)}$, the side of $${tri(L2)}$ goes on top:${steps(`\\frac{${side2}}{${side1}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}} = ${k.toLatex()}`)}`,
                  `从 $${tri(L1)}$ 到 $${tri(L2)}$，把 $${tri(L2)}$ 的边放在分子上：${steps(`\\frac{${side2}}{${side1}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}} = ${k.toLatex()}`)}`,
                ),
              ),
              check(
                t(
                  `Multiply back: $${k.toLatex()} \\cdot ${sh[i]! * u} = ${sh[i]! * v} = ${side2}$. The factor is ${sizeWord(k).en}, as the figure shows. The same factor gives the other sides of $${tri(L2)}$: $${k.toLatex()} \\cdot ${sh[o1]! * u} = ${sh[o1]! * v}$ and $${k.toLatex()} \\cdot ${sh[o2]! * u} = ${sh[o2]! * v}$.`,
                  `乘回去：$${k.toLatex()} \\cdot ${sh[i]! * u} = ${sh[i]! * v} = ${side2}$。相似比${sizeWord(k)["zh-CN"]}，与图相符。同一个相似比也给出 $${tri(L2)}$ 的另外两边：$${k.toLatex()} \\cdot ${sh[o1]! * u} = ${sh[o1]! * v}$，$${k.toLatex()} \\cdot ${sh[o2]! * u} = ${sh[o2]! * v}$。`,
                ),
              ),
            ),
          }),
          figure: figure(
            base,
            `Similar triangles ${L1} and ${L2}. The sides of ${L1} are ${s1.join(", ")}; side ${side2} of ${L2} is ${sh[i]! * v}.`,
            `相似三角形 ${L1} 与 ${L2}。${L1} 的三边为 ${s1.join("、")}；${L2} 的边 ${side2} 为 ${sh[i]! * v}。`,
          ),
          solutionFigures: [
            figure(
              [...base, sideIn(p1, i, "action"), sideIn(p2, i, "action")],
              `The same triangles with the corresponding sides ${side1} = ${sh[i]! * u} and ${side2} = ${sh[i]! * v} in one color.`,
              `同样的两个三角形，对应边 ${side1} = ${sh[i]! * u} 与 ${side2} = ${sh[i]! * v} 用同一种颜色画出。`,
            ),
          ],
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

/** pairTones colors side i of both triangles of a pair in the action color and side j in the result color. */
const pairTones = (p1: readonly Point[], p2: readonly Point[], i: number, j: number): Mark[] => [
  sideIn(p1, i, "action"),
  sideIn(p2, i, "action"),
  sideIn(p1, j, "result"),
  sideIn(p2, j, "result"),
];

/** sidesIntroFigure shows a triangle with sides 2, 3, 4 and a similar one with sides 6, 9, 12, corresponding sides in one color. */
const sidesIntroFigure: Figure = (() => {
  const sh: Tri3 = [2, 3, 4];
  const [p1, p2] = sideBySide(bySides(sh), posed(bySides(sh), { turn: 20, mirror: true }), 3);
  return figure(
    [...polyMarks(p1, "ABC", ["2", "3", "4"]), ...polyMarks(p2, "DEF", ["6", "9", "12"]), ...pairTones(p1, p2, 0, 1)],
    "Triangle ABC with AB = 2, BC = 3, CA = 4 and the similar triangle DEF with DE = 6, EF = 9, FD = 12. AB and DE share a color, and so do BC and EF.",
    "三角形 ABC：AB = 2，BC = 3，CA = 4；与它相似的三角形 DEF：DE = 6，EF = 9，FD = 12。AB 与 DE 同色，BC 与 EF 同色。",
  );
})();

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
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.2", "CCSS.HSG.SRT.B.5"],
  intro: t(
    "A similarity statement tells us which parts correspond, and the scale factor tells us how much bigger one figure is. Together they let us find a side or an angle we were never given, which is how a whole building is drawn from a small plan.\n\nSay $\\triangle ABC \\sim \\triangle DEF$, where $AB = 2$, $BC = 3$, $CA = 4$, and the only side of $\\triangle DEF$ we know is $DE = 6$. The factor from $\\triangle ABC$ to $\\triangle DEF$ is $DE \\div AB = 6 \\div 2 = 3$, so every side of $\\triangle DEF$ is $3$ times its partner: $EF = 3 \\cdot 3 = 9$ and $FD = 3 \\cdot 4 = 12$.\n\n{{figure 0}}\n\nThe angles do not change at all: $\\angle D \\cong \\angle A$, $\\angle E \\cong \\angle B$ and $\\angle F \\cong \\angle C$. In this lesson we find missing sides with proportions, missing angles from corresponding angles and the angle sum, and sides written as expressions in $x$.",
    "相似式告诉我们哪些部分对应，相似比告诉我们一个图形比另一个大多少。两者合起来，就能求出题目没有给出的边或角：从一张小小的平面图画出整栋楼，靠的就是这个。\n\n设 $\\triangle ABC \\sim \\triangle DEF$，$AB = 2$，$BC = 3$，$CA = 4$，而 $\\triangle DEF$ 只知道 $DE = 6$。从 $\\triangle ABC$ 到 $\\triangle DEF$ 的相似比为 $DE \\div AB = 6 \\div 2 = 3$，所以 $\\triangle DEF$ 的每条边都是对应边的 $3$ 倍：$EF = 3 \\cdot 3 = 9$，$FD = 3 \\cdot 4 = 12$。\n\n{{figure 0}}\n\n角则完全不变：$\\angle D \\cong \\angle A$，$\\angle E \\cong \\angle B$，$\\angle F \\cong \\angle C$。这节课我们用比例求未知的边，用对应角和内角和求未知的角，并处理用含 $x$ 的式子表示的边。",
  ),
  introFigures: [sidesIntroFigure],
  knowledgePoints: [
    {
      id: "missing-side-lengths",
      figure: similarityDrawings["side-lengths-and-angle-measures-of-similar-polygons#missing-side-lengths"],
      title: t("Missing side lengths", "求未知边长"),
      explanation: t(
        `Every side of one similar polygon is the same multiple of its partner, so two pairs of corresponding sides have equal ratios. That is a proportion, and a missing side is its one unknown.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with $AB = 4$, $BC = 6$ and $DE = 10$, pair $\\overline{EF}$ with $\\overline{BC}$ and $\\overline{DE}$ with $\\overline{AB}$, each fraction putting $\\triangle DEF$ on top:${steps("\\frac{EF}{BC} = \\frac{DE}{AB} \\quad\\Rightarrow\\quad \\frac{EF}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad EF = \\frac{10 \\cdot 6}{4} = 15")}The factor is $10 \\div 4$, that is $\\frac{5}{2}$, and indeed $\\frac{5}{2} \\cdot 6 = 15$.\n\n> **Watch out.** Keep the same triangle on top in both fractions. Setting $\\frac{EF}{6}$ equal to $\\frac{4}{10}$ mixes the order and gives $2.4$, a side that shrank when the triangle grew. And similar sides are multiplied, not shifted: $EF$ is not $6 + (10 - 4) = 12$.`,
        `相似多边形中，每条边都是对应边的同一个倍数，所以两组对应边的比相等。这就是一个比例式，未知的边是其中唯一的未知数。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$AB = 4$，$BC = 6$，$DE = 10$，把 $\\overline{EF}$ 与 $\\overline{BC}$ 配对、$\\overline{DE}$ 与 $\\overline{AB}$ 配对，两个分数都把 $\\triangle DEF$ 的边放在分子上：${steps("\\frac{EF}{BC} = \\frac{DE}{AB} \\quad\\Rightarrow\\quad \\frac{EF}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad EF = \\frac{10 \\cdot 6}{4} = 15")}相似比是 $10 \\div 4$，即 $\\frac{5}{2}$，确实 $\\frac{5}{2} \\cdot 6 = 15$。\n\n> **注意。** 两个分数要把同一个三角形放在分子上。令 $\\frac{EF}{6}$ 等于 $\\frac{4}{10}$ 就把顺序弄混了，得到 $2.4$：三角形变大了，这条边反而变短。相似是乘以倍数，不是加上差：$EF$ 不是 $6 + (10 - 4) = 12$。`,
      ),
      keyPrerequisites: ["proportions"],
      generate(rng) {
        const { sh, u, v, L1, L2, p1, p2 } = similarPair(rng);
        const [i, j] = rng.sample([0, 1, 2], 2) as [number, number];
        const s1 = sh.map((x, k) => (k === i || k === j ? String(x * u) : null));
        const s2 = sh.map((x, k) => (k === i ? String(x * v) : k === j ? "x" : null));
        const answer = sh[j]! * v;
        const [k1, k2, kj1] = [sh[i]! * u, sh[i]! * v, sh[j]! * u];
        const k = Q.of(v, u);
        const base = [...polyMarks(p1, L1, s1), ...polyMarks(p2, L2, s2)];
        return {
          ...numberProblem({
            prompt: t(`$${tri(L1)} \\sim ${tri(L2)}$. Find $x$.`, `$${tri(L1)} \\sim ${tri(L2)}$。求 $x$。`),
            answer,
            solveFor: "x",
            wrong: [kj1 + k2 - k1, Q.of(k1 * k2, kj1), Q.of(kj1 * k1, k2)],
            solution: paras(
              step(
                1,
                "pair the sides",
                "配对各边",
                t(
                  `By the places of the letters, $\\overline{${sideName(L2, i)}}$ corresponds to $\\overline{${sideName(L1, i)}}$, and $\\overline{${sideName(L2, j)}} = x$ to $\\overline{${sideName(L1, j)}}$. Each pair is drawn in one color:\n\n{{figure 0}}`,
                  `按字母的位置，$\\overline{${sideName(L2, i)}}$ 对应 $\\overline{${sideName(L1, i)}}$，$\\overline{${sideName(L2, j)}} = x$ 对应 $\\overline{${sideName(L1, j)}}$。每一对用同一种颜色画出：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "solve the proportion",
                "解比例式",
                t(
                  `Corresponding sides are proportional; put the sides of $${tri(L2)}$ on top in both fractions:${steps(prop("x", String(kj1), String(k2), String(k1)), `x = \\frac{${k2} \\cdot ${kj1}}{${k1}} = ${answer}`)}`,
                  `对应边成比例；两个分数都把 $${tri(L2)}$ 的边放在分子上：${steps(prop("x", String(kj1), String(k2), String(k1)), `x = \\frac{${k2} \\cdot ${kj1}}{${k1}} = ${answer}`)}`,
                ),
              ),
              check(
                t(
                  `Go by the scale factor instead: from $${tri(L1)}$ to $${tri(L2)}$ it is ${ratioIs(k2, k1).en}, and $${k.toLatex()} \\cdot ${kj1} = ${answer}$. The factor is ${sizeWord(k).en}; accordingly $x$ came out ${v > u ? "longer" : "shorter"} than $${kj1}$.`,
                  `改用相似比来算：从 $${tri(L1)}$ 到 $${tri(L2)}$ 的相似比为 ${ratioIs(k2, k1)["zh-CN"]}，而 $${k.toLatex()} \\cdot ${kj1} = ${answer}$。相似比${sizeWord(k)["zh-CN"]}，$x$ 也相应地比 $${kj1}$ ${v > u ? "长" : "短"}。`,
                ),
              ),
            ),
          }),
          figure: figure(
            base,
            `Similar triangles ${L1} and ${L2}: ${sideName(L1, i)} = ${k1}, ${sideName(L1, j)} = ${kj1}, ${sideName(L2, i)} = ${k2} and ${sideName(L2, j)} = x.`,
            `相似三角形 ${L1} 与 ${L2}：${sideName(L1, i)} = ${k1}，${sideName(L1, j)} = ${kj1}，${sideName(L2, i)} = ${k2}，${sideName(L2, j)} = x。`,
          ),
          solutionFigures: [
            figure(
              [...base, ...pairTones(p1, p2, i, j)],
              `The same triangles with ${sideName(L1, i)} and ${sideName(L2, i)} in one color and ${sideName(L1, j)} and ${sideName(L2, j)} in another.`,
              `同样的两个三角形：${sideName(L1, i)} 与 ${sideName(L2, i)} 用一种颜色，${sideName(L1, j)} 与 ${sideName(L2, j)} 用另一种颜色。`,
            ),
          ],
        };
      },
    },
    {
      id: "missing-angle-measures",
      figure: similarityDrawings["missing-angle-measures"],
      title: t("Missing angle measures", "求未知角"),
      explanation: t(
        "A scaled copy keeps its shape, so corresponding angles of similar polygons are congruent: an angle of one polygon gives the corresponding angle of the other. Combine this with the angle sum, $180^\\circ$ in a triangle and $360^\\circ$ in a quadrilateral, to reach an angle neither polygon gives directly.\n\nIf $\\triangle ABC \\sim \\triangle DEF$, $m\\angle A = 50^\\circ$ and $m\\angle E = 70^\\circ$, then $\\angle B$ pairs with $\\angle E$, so $m\\angle B = 70^\\circ$, and $m\\angle C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$.\n\n> **Watch out.** The scale factor never touches angles: a triangle twice as large has the same angles, not doubled ones. And transfer an angle only to its partner by position: in $\\triangle ABC \\sim \\triangle DEF$, $\\angle E$ gives $\\angle B$, not $\\angle C$.",
        "按比例缩放得到的图形形状不变，所以相似多边形的对应角相等：一个多边形的角给出另一个多边形的对应角。再结合内角和（三角形为 $180^\\circ$，四边形为 $360^\\circ$），就能求出两个多边形都没有直接给出的角。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$m\\angle A = 50^\\circ$，$m\\angle E = 70^\\circ$，则 $\\angle B$ 与 $\\angle E$ 对应，所以 $m\\angle B = 70^\\circ$，$m\\angle C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$。\n\n> **注意。** 相似比与角无关：大一倍的三角形角度不变，不会翻倍。把角搬过去时只能搬给位置相同的对应角：在 $\\triangle ABC \\sim \\triangle DEF$ 中，$\\angle E$ 给出的是 $\\angle B$，不是 $\\angle C$。",
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
        const mine = askSecond ? q : p;
        const transfers = known
          .filter((_, i) => onSecond[i] !== askSecond)
          .map((k) => `m\\angle ${askSecond ? q[k] : p[k]} = m\\angle ${askSecond ? p[k] : q[k]} = ${angles[k]}^\\circ`);
        const sumLine = `m\\angle ${target} = ${total}^\\circ - ${known.map((k) => `${angles[k]}^\\circ`).join(" - ")} = ${answer}^\\circ`;
        const [en, zh] = n === 3 ? ["triangles", "三角形"] : ["quadrilaterals", "四边形"];
        const [one, oneZh] = n === 3 ? ["triangle", "三角形"] : ["quadrilateral", "四边形"];
        const all = range(n).map((k) => `${angles[k]}^\\circ`);
        return numberProblem({
          prompt: t(
            `The ${en} satisfy $${name(p)} \\sim ${name(q)}$, with $${facts}$. Find $m\\angle ${target}$.`,
            `${zh}满足 $${name(p)} \\sim ${name(q)}$，且 $${facts}$。求 $m\\angle ${target}$。`,
          ),
          answer,
          unit: "°",
          wrong: [...known.map((k) => angles[k]!), total - angles[known[0]!]!],
          solution: paras(
            step(
              1,
              "move the angles across",
              "把角搬过去",
              t(
                `The statement pairs ${range(n)
                  .map((k) => `$${p[k]}$ with $${q[k]}$`)
                  .join(
                    ", ",
                  )}, and corresponding angles are congruent. So the angles given on the other ${one} become angles of $${name(mine)}$:${steps(...transfers)}`,
                `相似式把 ${range(n)
                  .map((k) => `$${p[k]}$ 与 $${q[k]}$`)
                  .join("、")} 配对，而对应角相等。所以另一个${oneZh}上给出的角就是 $${name(mine)}$ 的角：${steps(...transfers)}`,
              ),
            ),
            step(
              2,
              "use the angle sum",
              "用内角和",
              t(
                `$${name(mine)}$ now has ${n - 1} known angles, and the angles of a ${one} add up to $${total}^\\circ$:${steps(sumLine)}`,
                `$${name(mine)}$ 现在有 ${n - 1} 个已知角，而${oneZh}的内角和为 $${total}^\\circ$：${steps(sumLine)}`,
              ),
            ),
            check(
              t(
                `The angles of $${name(mine)}$, in order, are ${range(n)
                  .map((k) => `$m\\angle ${mine[k]} = ${all[k]}$`)
                  .join(
                    ", ",
                  )}. They add up to $${total}^\\circ$, as the angles of a ${one} must:${steps(`${all.join(" + ")} = ${total}^\\circ`)}`,
                `$${name(mine)}$ 的各角依次为 ${range(n)
                  .map((k) => `$m\\angle ${mine[k]} = ${all[k]}$`)
                  .join("，")}。它们的和正好是${oneZh}内角和 $${total}^\\circ$：${steps(`${all.join(" + ")} = ${total}^\\circ`)}`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "sides-given-by-expressions",
      figure: similarityDrawings["sides-given-by-expressions"],
      title: t("Sides given by expressions", "用式子表示的边"),
      explanation: t(
        `When a side is an expression in $x$, the proportion of corresponding sides still holds; it just has two layers. First solve the proportion for the side, then solve the equation "expression = side" for $x$.\n\nIf $\\triangle ABC \\sim \\triangle DEF$ with $AB = 6$, $BC = 9$, $DE = 10$ and $EF = 2x + 3$:${steps("\\frac{2x + 3}{9} = \\frac{10}{6} \\quad\\Rightarrow\\quad 2x + 3 = \\frac{10}{6} \\cdot 9 = 15 \\quad\\Rightarrow\\quad 2x = 12 \\quad\\Rightarrow\\quad x = 6")}Then $EF = 2 \\cdot 6 + 3 = 15$, and both $\\frac{15}{9}$ and $\\frac{10}{6}$ reduce to $\\frac{5}{3}$, as they should.\n\n> **Watch out.** The proportion gives the length of the side, $15$, not $x$. Stopping there answers the wrong question: finish by solving $2x + 3 = 15$.`,
        `当一条边是含 $x$ 的式子时，对应边的比例式照样成立，只是要分两层来解：先由比例式求出这条边，再解方程“式子 = 边长”求出 $x$。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$AB = 6$，$BC = 9$，$DE = 10$，$EF = 2x + 3$：${steps("\\frac{2x + 3}{9} = \\frac{10}{6} \\quad\\Rightarrow\\quad 2x + 3 = \\frac{10}{6} \\cdot 9 = 15 \\quad\\Rightarrow\\quad 2x = 12 \\quad\\Rightarrow\\quad x = 6")}于是 $EF = 2 \\cdot 6 + 3 = 15$，$\\frac{15}{9}$ 与 $\\frac{10}{6}$ 都约成 $\\frac{5}{3}$，符合要求。\n\n> **注意。** 比例式求出的是边长 $15$，不是 $x$。停在这里就答非所问了：还要解 $2x + 3 = 15$。`,
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
          const k = Q.of(v, u);
          const base = [...polyMarks(p1, L1, s1), ...polyMarks(p2, L2, s2)];
          return {
            ...numberProblem({
              prompt: t(`$${tri(L1)} \\sim ${tri(L2)}$. Find $x$.`, `$${tri(L1)} \\sim ${tri(L2)}$。求 $x$。`),
              answer: x,
              solveFor: "x",
              wrong: [target, Q.of(kj1 - d, c), Q.of(k1 * k2 - d * kj1, c * kj1)],
              solution: paras(
                step(
                  1,
                  "find the side",
                  "求这条边",
                  t(
                    `$\\overline{${sideName(L2, j)}}$ corresponds to $\\overline{${sideName(L1, j)}}$ and $\\overline{${sideName(L2, i)}}$ to $\\overline{${sideName(L1, i)}}$, as the colors show:\n\n{{figure 0}}\n\nSet up the proportion with $${tri(L2)}$ on top and solve it for the whole expression:${steps(prop(expr, String(kj1), String(k2), String(k1)), `${expr} = \\frac{${k2}}{${k1}} \\cdot ${kj1} = ${target}`)}`,
                    `如颜色所示，$\\overline{${sideName(L2, j)}}$ 对应 $\\overline{${sideName(L1, j)}}$，$\\overline{${sideName(L2, i)}}$ 对应 $\\overline{${sideName(L1, i)}}$：\n\n{{figure 0}}\n\n把 $${tri(L2)}$ 的边放在分子上列比例式，先解出整个式子：${steps(prop(expr, String(kj1), String(k2), String(k1)), `${expr} = \\frac{${k2}}{${k1}} \\cdot ${kj1} = ${target}`)}`,
                  ),
                ),
                step(
                  2,
                  "solve for x",
                  "解出 x",
                  t(
                    `${d > 0 ? `Subtract $${d}$` : `Add $${-d}$`} on both sides, then divide by $${c}$:${steps(`${linear(c, 0)} = ${target - d}`, `x = ${x}`)}`,
                    `两边${d > 0 ? `减去 $${d}$` : `加上 $${-d}$`}，再除以 $${c}$：${steps(`${linear(c, 0)} = ${target - d}`, `x = ${x}`)}`,
                  ),
                ),
                check(
                  t(
                    `With $x = ${x}$, $${sideName(L2, j)} = ${c} \\cdot ${x} ${d > 0 ? "+" : "-"} ${Math.abs(d)} = ${target}$. Its ratio to $${sideName(L1, j)}$ is $\\frac{${target}}{${kj1}}$, and the other pair gives $\\frac{${k2}}{${k1}}$. Both equal $${k.toLatex()}$, so the sides are proportional.`,
                    `当 $x = ${x}$ 时，$${sideName(L2, j)} = ${c} \\cdot ${x} ${d > 0 ? "+" : "-"} ${Math.abs(d)} = ${target}$。它与 $${sideName(L1, j)}$ 的比是 $\\frac{${target}}{${kj1}}$，另一对边的比是 $\\frac{${k2}}{${k1}}$。两者都等于 $${k.toLatex()}$，所以对应边成比例。`,
                  ),
                ),
              ),
            }),
            figure: figure(
              base,
              `Similar triangles ${L1} and ${L2}: ${sideName(L1, i)} = ${k1}, ${sideName(L1, j)} = ${kj1}, ${sideName(L2, i)} = ${k2} and ${sideName(L2, j)} = ${plain(c, d)}.`,
              `相似三角形 ${L1} 与 ${L2}：${sideName(L1, i)} = ${k1}，${sideName(L1, j)} = ${kj1}，${sideName(L2, i)} = ${k2}，${sideName(L2, j)} = ${plain(c, d)}。`,
            ),
            solutionFigures: [
              figure(
                [...base, ...pairTones(p1, p2, i, j)],
                `The same triangles with ${sideName(L1, i)} and ${sideName(L2, i)} in one color and ${sideName(L1, j)} and ${sideName(L2, j)} in another.`,
                `同样的两个三角形：${sideName(L1, i)} 与 ${sideName(L2, i)} 用一种颜色，${sideName(L1, j)} 与 ${sideName(L2, j)} 用另一种颜色。`,
              ),
            ],
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

/** ruled draws a w-by-h rectangle with its corner at (x0, 0), ruled into unit squares, with its sides labeled. */
const ruled = (x0: number, w: number, h: number, tone?: Tone): Mark[] => [
  {
    kind: "polygon",
    points: [
      [x0, 0],
      [x0 + w, 0],
      [x0 + w, h],
      [x0, h],
    ],
  },
  ...Array.from({ length: w - 1 }, (_, i): Mark => ({ kind: "segment", a: [x0 + i + 1, 0], b: [x0 + i + 1, h], dashed: true })),
  ...Array.from({ length: h - 1 }, (_, i): Mark => ({ kind: "segment", a: [x0, i + 1], b: [x0 + w, i + 1], dashed: true })),
  { kind: "side", a: [x0, 0], b: [x0 + w, 0], text: String(w) },
  ...(h === w ? [] : ([{ kind: "side", a: [x0 + w, 0], b: [x0 + w, h], text: String(h) }] as Mark[])),
  ...(tone ? ([{ kind: "segment", a: [x0, 0], b: [x0 + w, 0], tone }] as Mark[]) : []),
];

/** areasIntroFigure shows a 1-by-2 rectangle beside its enlargement by 3, a 3-by-6 rectangle: 2 unit squares become 18. */
const areasIntroFigure: Figure = figure(
  [...ruled(0, 2, 1, "action"), ...ruled(3, 6, 3, "action")],
  "A 2-by-1 rectangle ruled into 2 unit squares beside the 6-by-3 rectangle made by enlarging it by 3, ruled into 18 unit squares. The bottom sides, 2 and 6, are drawn in one color.",
  "一个 2×1 的矩形被分成 2 个单位正方形；旁边是把它放大 3 倍得到的 6×3 矩形，被分成 18 个单位正方形。底边 2 和 6 用同一种颜色画出。",
);

export const areasOfSimilarPolygons: TopicDef = {
  id: "areas-of-similar-polygons",
  title: t("Areas of Similar Polygons", "相似多边形的面积"),
  summary: t(
    "Use that perimeters scale by the scale factor k and areas by k² to compare similar polygons.",
    "利用周长按相似比 k 缩放、面积按 k² 缩放来比较相似多边形。",
  ),
  prerequisites: ["side-lengths-and-angle-measures-of-similar-polygons", "area-of-triangles"],
  encompasses: [{ topic: "similarity-and-similar-polygons", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSG.SRT.A.2", "CCSS.7.G.A.1"],
  intro: t(
    "We know that every side of a similar copy is $k$ times its partner. A natural guess is that everything else grows by $k$ too, but area does not, and seeing why is the whole lesson.\n\nTake a rectangle $2$ wide and $1$ tall, and enlarge it by $k = 3$: it becomes $6$ wide and $3$ tall. Its perimeter goes from $2 + 1 + 2 + 1 = 6$ to $6 + 3 + 6 + 3 = 18$, three times as much. Its area goes from $2$ unit squares to $18$, nine times as much.\n\n{{figure 0}}\n\nThe area grew by $9 = 3^{2}$ because the copy is $3$ times as wide **and** $3$ times as tall, and each direction multiplies the count of squares by $3$. So lengths (sides, perimeters) scale by $k$, and areas scale by $k^{2}$. In this lesson we use this to compare and find areas.",
    "我们已经知道，相似图形的每条边都是对应边的 $k$ 倍。很自然会猜：其他一切也都变成 $k$ 倍。但面积不是这样，弄清原因正是这节课的全部内容。\n\n取一个宽 $2$、高 $1$ 的矩形，按 $k = 3$ 放大，它变成宽 $6$、高 $3$。周长从 $2 + 1 + 2 + 1 = 6$ 变成 $6 + 3 + 6 + 3 = 18$，是原来的三倍；面积从 $2$ 个单位正方形变成 $18$ 个，是原来的九倍。\n\n{{figure 0}}\n\n面积变成 $9 = 3^{2}$ 倍，是因为新矩形宽是原来的 $3$ 倍，**并且**高也是 $3$ 倍，每个方向都让小正方形的个数乘以 $3$。所以长度（边长、周长）按 $k$ 缩放，面积按 $k^{2}$ 缩放。这节课我们用它来比较和求面积。",
  ),
  introFigures: [areasIntroFigure],
  knowledgePoints: [
    {
      id: "ratios-of-perimeters-and-areas",
      figure: similarityDrawings["ratios-of-perimeters-and-areas"],
      title: t("Ratios of perimeters and areas", "周长比与面积比"),
      explanation: t(
        "If the scale factor from one polygon to a similar one is $k$, every length is multiplied by $k$. The **perimeter** is a sum of lengths, so it is multiplied by $k$ as well. **Area** is a length times a length, so the factor enters twice and the area is multiplied by $k^{2}$.\n\nIf corresponding sides are in the ratio $2 : 3$, the perimeters are in the same ratio, $\\frac{2}{3}$, while the areas are in the ratio $\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$.\n\n> **Watch out.** Square the ratio for areas only. Giving $\\frac{2}{3}$ for the areas forgets that area has two dimensions; squaring for perimeters is the opposite slip; and cubing, $\\frac{8}{27}$, belongs to volumes of solids.",
        "若从一个多边形到与它相似的多边形的相似比为 $k$，每条线段的长度都乘以 $k$。**周长**是若干长度之和，所以也乘以 $k$。**面积**是长度乘长度，这个倍数出现两次，所以面积乘以 $k^{2}$。\n\n若对应边的比为 $2 : 3$，周长之比也是 $\\frac{2}{3}$，而面积之比为 $\\left(\\frac{2}{3}\\right)^{2} = \\frac{4}{9}$。\n\n> **注意。** 只有面积要把比平方。面积比答 $\\frac{2}{3}$，是忘了面积有两个方向；周长比也平方，是反过来的错误；立方得 $\\frac{8}{27}$，那是立体体积的比。",
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
            ? paras(
                step(
                  1,
                  "the ratio of lengths",
                  "长度之比",
                  t(
                    `From the smaller to the larger ${kind.en.replace(/s$/, "")}, every length is multiplied by the same factor, so any two corresponding lengths, smaller to larger, are in the ratio $\\frac{${a}}{${b}}$.`,
                    `从较小的${kind["zh-CN"]}到较大的，每条线段都乘以同一个倍数，所以任意一对对应长度（小比大）之比都是 $\\frac{${a}}{${b}}$。`,
                  ),
                ),
                step(
                  2,
                  "square it for areas",
                  "面积要平方",
                  t(
                    `An area is a length times a length, so the ratio enters twice:${steps(`\\left(\\frac{${a}}{${b}}\\right)^{2} = \\frac{${a}^{2}}{${b}^{2}} = ${answer.toLatex()}`)}`,
                    `面积是长度乘长度，所以这个比要出现两次：${steps(`\\left(\\frac{${a}}{${b}}\\right)^{2} = \\frac{${a}^{2}}{${b}^{2}} = ${answer.toLatex()}`)}`,
                  ),
                ),
                check(
                  t(
                    `Every similar pair in the ratio $${a} : ${b}$ gives the same answer, so try the simplest one: squares with sides $${a}$ and $${b}$. Their areas are $${a * a}$ and $${b * b}$, in the ratio $${answer.toLatex()}$.`,
                    `对应边之比为 $${a} : ${b}$ 的任意一对相似图形，答案都一样，所以试最简单的一对：边长为 $${a}$ 和 $${b}$ 的正方形。它们的面积是 $${a * a}$ 和 $${b * b}$，比为 $${answer.toLatex()}$。`,
                  ),
                ),
              )
            : paras(
                step(
                  1,
                  "add up the sides",
                  "把各边加起来",
                  t(
                    `A perimeter is the sum of the sides. Each side of the larger ${kind.en.replace(/s$/, "")} is the matching side of the smaller times the same factor, so the whole sum is multiplied by that factor too.`,
                    `周长是各边之和。较大${kind["zh-CN"]}的每条边都是较小者对应边乘以同一个倍数，所以整个和也乘以这个倍数。`,
                  ),
                ),
                step(
                  2,
                  "keep the ratio",
                  "比不变",
                  t(
                    `So the perimeters are in the same ratio as the sides, smaller to larger $${answer.toLatex()}$. There is no squaring: a perimeter is a length, not an area.`,
                    `所以周长之比与边长之比相同，小比大为 $${answer.toLatex()}$。不用平方：周长是长度，不是面积。`,
                  ),
                ),
                check(
                  t(
                    `Try squares with sides $${a}$ and $${b}$, which are similar in this ratio. Their perimeters are $${4 * a}$ and $${4 * b}$, and $\\frac{${4 * a}}{${4 * b}}$ reduces to $${answer.toLatex()}$.`,
                    `试试边长为 $${a}$ 和 $${b}$ 的正方形，它们按这个比相似。周长分别为 $${4 * a}$ 和 $${4 * b}$，$\\frac{${4 * a}}{${4 * b}}$ 约分后正是 $${answer.toLatex()}$。`,
                  ),
                ),
              ),
        });
      },
    },
    {
      id: "area-from-the-scale-factor",
      figure: geometryDrawings2["areas-of-similar-polygons#area-from-the-scale-factor"],
      title: t("Area from the scale factor", "由相似比求面积"),
      explanation: t(
        "Each unit square inside a polygon becomes a square of side $k$ in the image, with area $k^{2}$. So the area of the image is the original area times $k^{2}$.\n\nA polygon of area $20 \\text{ cm}^{2}$ is enlarged with scale factor $\\frac{3}{2}$. Then $k^{2} = \\frac{9}{4}$, and the new area is $\\frac{9}{4} \\cdot 20 = 45 \\text{ cm}^{2}$. Going back, $45 \\div \\frac{9}{4} = 20$.\n\n> **Watch out.** Multiplying by $k$ itself gives $\\frac{3}{2} \\cdot 20 = 30$, the mistake of treating area like a length. And when $k$ is less than $1$ the area shrinks: multiply by $k^{2}$, do not divide by it.",
        "多边形里的每个单位正方形，在像中都变成边长为 $k$、面积为 $k^{2}$ 的正方形。所以像的面积是原面积乘以 $k^{2}$。\n\n一个面积为 $20 \\text{ cm}^{2}$ 的多边形按相似比 $\\frac{3}{2}$ 放大。则 $k^{2} = \\frac{9}{4}$，新的面积为 $\\frac{9}{4} \\cdot 20 = 45 \\text{ cm}^{2}$。反过来，$45 \\div \\frac{9}{4} = 20$。\n\n> **注意。** 只乘以 $k$ 会得到 $\\frac{3}{2} \\cdot 20 = 30$，这是把面积当成了长度。$k$ 小于 $1$ 时面积变小：仍然乘以 $k^{2}$，不要除以它。",
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
          solution: paras(
            step(
              1,
              "square the scale factor",
              "把相似比平方",
              t(
                `Lengths are multiplied by $k = ${k.toLatex()}$, so areas are multiplied by${steps(`k^{2} = \\left(${k.toLatex()}\\right)^{2} = ${k2.toLatex()}`)}`,
                `长度乘以 $k = ${k.toLatex()}$，所以面积乘以${steps(`k^{2} = \\left(${k.toLatex()}\\right)^{2} = ${k2.toLatex()}`)}`,
              ),
            ),
            step(
              2,
              "multiply the area",
              "乘以面积",
              t(
                `The second area is the first times $k^{2}$:${steps(`${k2.toLatex()} \\cdot ${area} = ${answer}`)}So the second ${kind.en.replace(/s$/, "")} has area $${answer} \\text{ cm}^{2}$.`,
                `第二个的面积是第一个乘以 $k^{2}$：${steps(`${k2.toLatex()} \\cdot ${area} = ${answer}`)}所以第二个${kind["zh-CN"]}的面积为 $${answer} \\text{ cm}^{2}$。`,
              ),
            ),
            check(
              t(
                `Go back from the second to the first with the reverse factor $${fr(u, v)}$, whose square is $${fr(u * u, v * v)}$:${steps(`${fr(u * u, v * v)} \\cdot ${answer} = ${area}`)}That is the area we started with. The factor is ${sizeWord(k).en}; accordingly the area ${v > u ? "grew" : "shrank"}.`,
                `用反向的相似比 $${fr(u, v)}$ 从第二个回到第一个，它的平方是 $${fr(u * u, v * v)}$：${steps(`${fr(u * u, v * v)} \\cdot ${answer} = ${area}`)}正是原来的面积。相似比${sizeWord(k)["zh-CN"]}，面积也随之${v > u ? "变大" : "变小"}。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "area-from-corresponding-sides",
      figure: similarityDrawings["area-from-corresponding-sides"],
      title: t("Area from corresponding sides", "由对应边求面积"),
      explanation: t(
        "When the scale factor is not given, a pair of corresponding sides supplies it: their ratio is $k$. Then square $k$ for the areas, as always.\n\nIf $\\triangle ABC \\sim \\triangle DEF$, $BC = 4$, $EF = 10$ and the area of $\\triangle ABC$ is $12$, then $k = 10 \\div 4 = \\frac{5}{2}$ and $k^{2} = \\frac{25}{4}$. The area of $\\triangle DEF$ is $\\frac{25}{4} \\cdot 12 = 75$.\n\n> **Watch out.** The sides give $k$, not $k^{2}$: $\\frac{5}{2} \\cdot 12 = 30$ forgets to square. Nor does an area grow by the difference of the sides; $12 + 6 = 18$ has no meaning.",
        "当相似比没有直接给出时，一对对应边就能给出它：它们的比就是 $k$。然后照常把 $k$ 平方来求面积。\n\n若 $\\triangle ABC \\sim \\triangle DEF$，$BC = 4$，$EF = 10$，$\\triangle ABC$ 的面积为 $12$，则 $k = 10 \\div 4 = \\frac{5}{2}$，$k^{2} = \\frac{25}{4}$。$\\triangle DEF$ 的面积为 $\\frac{25}{4} \\cdot 12 = 75$。\n\n> **注意。** 对应边给出的是 $k$，不是 $k^{2}$：$\\frac{5}{2} \\cdot 12 = 30$ 忘了平方。面积也不会按边长之差增加：$12 + 6 = 18$ 毫无意义。",
      ),
      generate(rng) {
        const { sh, u, v, L1, L2, p1, p2 } = similarPair(rng);
        const i = rng.int(0, 2);
        const g = rng.int(1, 3);
        const [s1, s2] = [sh[i]! * u * g, sh[i]! * v * g];
        const area = u * u * rng.int(1, u === 1 ? 15 : 6);
        const answer = (area / (u * u)) * v * v;
        const k = Q.of(v, u);
        const power = u === 1 ? `${v}^{2}` : `\\left(${k.toLatex()}\\right)^{2}`;
        const base = [
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
        ];
        const kLine = fr(s2, s1) === `\\frac{${s2}}{${s1}}` ? `k = \\frac{${s2}}{${s1}}` : `k = \\frac{${s2}}{${s1}} = ${k.toLatex()}`;
        return {
          ...numberProblem({
            prompt: t(
              `$${tri(L1)} \\sim ${tri(L2)}$, and the area of $${tri(L1)}$ is $${area}$. Find the area of $${tri(L2)}$.`,
              `$${tri(L1)} \\sim ${tri(L2)}$，$${tri(L1)}$ 的面积为 $${area}$。求 $${tri(L2)}$ 的面积。`,
            ),
            answer,
            wrong: [k.mul(Q.of(area)), Q.of(area * u * u, v * v), area + Math.abs(s2 - s1)],
            solution: paras(
              step(
                1,
                "find the scale factor",
                "求相似比",
                t(
                  `$\\overline{${sideName(L2, i)}}$ corresponds to $\\overline{${sideName(L1, i)}}$, the pair drawn in one color:\n\n{{figure 0}}\n\nThe scale factor from $${tri(L1)}$ to $${tri(L2)}$ is their ratio:${steps(kLine)}`,
                  `$\\overline{${sideName(L2, i)}}$ 对应 $\\overline{${sideName(L1, i)}}$，这一对用同一种颜色画出：\n\n{{figure 0}}\n\n从 $${tri(L1)}$ 到 $${tri(L2)}$ 的相似比就是它们的比：${steps(kLine)}`,
                ),
              ),
              step(
                2,
                "square it for the area",
                "平方后求面积",
                t(
                  `Areas are multiplied by $k^{2}$:${steps(`${power} \\cdot ${area} = ${fr(v * v, u * u)} \\cdot ${area} = ${answer}`)}`,
                  `面积乘以 $k^{2}$：${steps(`${power} \\cdot ${area} = ${fr(v * v, u * u)} \\cdot ${area} = ${answer}`)}`,
                ),
              ),
              check(
                t(
                  `The areas must be in the ratio of the squared sides, $${s2}^{2}$ to $${s1}^{2}$. Cross-multiply to compare: $${answer} \\cdot ${s1}^{2} = ${answer * s1 * s1}$ and $${area} \\cdot ${s2}^{2} = ${area * s2 * s2}$, which agree.`,
                  `面积之比必须等于边长平方之比 $${s2}^{2}$ 比 $${s1}^{2}$。交叉相乘来比较：$${answer} \\cdot ${s1}^{2} = ${answer * s1 * s1}$，$${area} \\cdot ${s2}^{2} = ${area * s2 * s2}$，两者相等。`,
                ),
              ),
            ),
          }),
          figure: figure(
            base,
            `Similar triangles ${L1} and ${L2} with corresponding sides ${sideName(L1, i)} = ${s1} and ${sideName(L2, i)} = ${s2}.`,
            `相似三角形 ${L1} 与 ${L2}，对应边 ${sideName(L1, i)} = ${s1}，${sideName(L2, i)} = ${s2}。`,
          ),
          solutionFigures: [
            figure(
              [...base, sideIn(p1, i, "action"), sideIn(p2, i, "action")],
              `The same triangles with the corresponding sides ${sideName(L1, i)} and ${sideName(L2, i)} in one color.`,
              `同样的两个三角形，对应边 ${sideName(L1, i)} 与 ${sideName(L2, i)} 用同一种颜色画出。`,
            ),
          ],
        };
      },
    },
  ],
};

// ─── 1.4.4 Working with areas of similar polygons ───────────────────────────

/** similarSquaresFigure shows squares of sides 3 and 5 ruled into unit squares: the sides grow by 5/3 and the areas, 9 and 25, by 25/9. */
const similarSquaresFigure: Figure = {
  svg: sketch([...ruled(0, 3, 3), ...ruled(4.5, 5, 5)]),
  alt: t(
    "A square of side 3 ruled into 9 unit squares beside a square of side 5 ruled into 25 unit squares. The sides grow by the scale factor 5/3, and the areas by 25/9, its square.",
    "边长为 3 的正方形被分成 9 个单位正方形，旁边边长为 5 的正方形被分成 25 个单位正方形。边长按相似比 5/3 增大，面积按它的平方 25/9 增大。",
  ),
};

/** workingAreasIntroFigure shows a 6-by-2 and a 9-by-3 rectangle ruled into unit squares: areas 12 and 27, sides in the ratio 3/2. */
const workingAreasIntroFigure: Figure = figure(
  [...ruled(0, 6, 2, "action"), ...ruled(7, 9, 3, "action")],
  "A 6-by-2 rectangle ruled into 12 unit squares beside a 9-by-3 rectangle ruled into 27 unit squares. The bottom sides, 6 and 9, are drawn in one color.",
  "一个 6×2 的矩形被分成 12 个单位正方形，旁边一个 9×3 的矩形被分成 27 个单位正方形。底边 6 和 9 用同一种颜色画出。",
);

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
  intro: t(
    "Areas of similar polygons are in the ratio $k^{2}$. Read backwards, that rule lets us start from two areas, which are often all a plan or a map tells us, and recover the scale factor, and from it every length.\n\nSay two similar rectangles have areas $12$ and $27$. Their ratio, larger over smaller, is $\\frac{27}{12} = \\frac{9}{4}$, and this is $k^{2}$. Undoing the square takes a square root: $k = \\sqrt{\\frac{9}{4}} = \\frac{3}{2}$. Indeed, a $6$ by $2$ rectangle and a $9$ by $3$ rectangle have exactly these areas, and their sides are in the ratio $\\frac{3}{2}$.\n\n{{figure 0}}\n\nIn this lesson we find scale factors from areas, then use them to find sides, and go from perimeters to areas.",
    "相似多边形的面积之比是 $k^{2}$。把这条规律倒过来用，就能从两个面积出发（平面图或地图往往只告诉我们这些），求出相似比，再由它求出每一条长度。\n\n设两个相似矩形的面积为 $12$ 和 $27$。它们的比（大比小）是 $\\frac{27}{12} = \\frac{9}{4}$，这就是 $k^{2}$。去掉平方要开平方根：$k = \\sqrt{\\frac{9}{4}} = \\frac{3}{2}$。确实，$6 \\times 2$ 和 $9 \\times 3$ 的矩形恰好有这两个面积，它们的边长之比是 $\\frac{3}{2}$。\n\n{{figure 0}}\n\n这节课我们由面积求相似比，再用它求边长，并由周长求面积。",
  ),
  introFigures: [workingAreasIntroFigure],
  knowledgePoints: [
    {
      id: "scale-factor-from-areas",
      title: t("Scale factor from areas", "由面积求相似比"),
      explanation: t(
        "The ratio of areas of similar polygons is $k^{2}$, so the scale factor is its square root:\n\n$$k = \\sqrt{\\frac{\\text{area of the second}}{\\text{area of the first}}}.$$\n\nIf the areas are $18$ and $50$, reduce first: $\\frac{50}{18} = \\frac{25}{9}$, a ratio of two perfect squares. Then $k = \\sqrt{\\frac{25}{9}} = \\frac{5}{3}$, and squaring back gives $\\frac{25}{9}$ again.\n\n> **Watch out.** The ratio of the areas is $k^{2}$, not $k$: stopping at $\\frac{25}{9}$ skips the root. Keep the order too, second over first for the factor from the first to the second; the difference of the areas, $32$, is not a ratio at all.",
        "相似多边形的面积比是 $k^{2}$，所以相似比是它的平方根：\n\n$$k = \\sqrt{\\frac{\\text{第二个的面积}}{\\text{第一个的面积}}}$$\n\n若面积为 $18$ 和 $50$，先约分：$\\frac{50}{18} = \\frac{25}{9}$，分子分母都是完全平方数。于是 $k = \\sqrt{\\frac{25}{9}} = \\frac{5}{3}$，再平方又得到 $\\frac{25}{9}$。\n\n> **注意。** 面积之比是 $k^{2}$，不是 $k$：停在 $\\frac{25}{9}$ 就漏了开方。顺序也要对：从第一个到第二个的相似比是第二个比第一个；两个面积之差 $32$ 根本不是比。",
      ),
      keyPrerequisites: ["square-roots-and-cube-roots"],
      figure: similarSquaresFigure,
      generate(rng) {
        const { a, b, c } = areaPair(rng);
        const kind = rng.pick(polygonKinds);
        const [A1, A2] = [a * a * c, b * b * c];
        const k = Q.of(b, a);
        const k2 = fr(A2, A1);
        return numberProblem({
          prompt: t(
            `Two similar ${kind.en} have areas $${A1}$ and $${A2}$. Find the scale factor from the first to the second.`,
            `两个相似${kind["zh-CN"]}的面积分别为 $${A1}$ 和 $${A2}$。求从第一个到第二个的相似比。`,
          ),
          answer: k,
          form: "fraction",
          wrong: [Q.of(A2, A1), Q.of(a, b), Q.of(Math.abs(A2 - A1))],
          solution: paras(
            step(
              1,
              "the ratio of the areas is k²",
              "面积之比是 k²",
              t(
                `Second over first, in lowest terms:${steps(k2 === `\\frac{${A2}}{${A1}}` ? `k^{2} = \\frac{${A2}}{${A1}}` : `k^{2} = \\frac{${A2}}{${A1}} = ${k2}`)}`,
                `第二个比第一个，化成最简分数：${steps(k2 === `\\frac{${A2}}{${A1}}` ? `k^{2} = \\frac{${A2}}{${A1}}` : `k^{2} = \\frac{${A2}}{${A1}} = ${k2}`)}`,
              ),
            ),
            step(
              2,
              "take the square root",
              "开平方",
              t(
                `${a === 1 ? `$${b * b}$ is the square of $${b}$` : `$${b * b}$ and $${a * a}$ are the squares of $${b}$ and $${a}$`}, so${steps(`k = \\sqrt{${k2}} = ${k.toLatex()}`)}`,
                `${a === 1 ? `$${b * b}$ 是 $${b}$ 的平方` : `$${b * b}$ 和 $${a * a}$ 分别是 $${b}$ 和 $${a}$ 的平方`}，所以${steps(`k = \\sqrt{${k2}} = ${k.toLatex()}`)}`,
              ),
            ),
            check(
              t(
                `Scale the first area by $k^{2}$ and see whether the second comes out:${steps(`\\left(${k.toLatex()}\\right)^{2} \\cdot ${A1} = ${fr(b * b, a * a)} \\cdot ${A1} = ${A2}`)}The factor is ${sizeWord(k).en}, matching $${A2} ${b > a ? ">" : "<"} ${A1}$.`,
                `把第一个面积乘以 $k^{2}$，看能否得到第二个：${steps(`\\left(${k.toLatex()}\\right)^{2} \\cdot ${A1} = ${fr(b * b, a * a)} \\cdot ${A1} = ${A2}`)}相似比${sizeWord(k)["zh-CN"]}，与 $${A2} ${b > a ? ">" : "<"} ${A1}$ 一致。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "side-length-from-areas",
      figure: similarityDrawings["side-length-from-areas"],
      title: t("Side length from areas", "由面积求边长"),
      explanation: t(
        "Areas give $k^{2}$, a square root gives $k$, and $k$ is what multiplies lengths. So finding a side from areas takes both steps.\n\nTwo similar triangles have areas $16$ and $36$, and a side of the first is $10$. Then $k^{2} = \\frac{36}{16} = \\frac{9}{4}$, so $k = \\frac{3}{2}$, and the corresponding side of the second is $\\frac{3}{2} \\cdot 10 = 15$. Squaring the side ratio, $\\left(\\frac{15}{10}\\right)^{2} = \\frac{9}{4}$, gives back the area ratio.\n\n> **Watch out.** Multiplying the side by the ratio of areas, $\\frac{36}{16} \\cdot 10 = 22.5$, skips the square root: a side scales by $k$, not $k^{2}$. Check the direction as well; the larger triangle has the longer side.",
        "面积给出 $k^{2}$，开平方得到 $k$，而乘在长度上的是 $k$。所以由面积求边长两步都不能少。\n\n两个相似三角形的面积为 $16$ 和 $36$，第一个的一条边为 $10$。则 $k^{2} = \\frac{36}{16} = \\frac{9}{4}$，所以 $k = \\frac{3}{2}$，第二个的对应边为 $\\frac{3}{2} \\cdot 10 = 15$。把边长之比平方，$\\left(\\frac{15}{10}\\right)^{2} = \\frac{9}{4}$，又回到面积之比。\n\n> **注意。** 用面积之比乘以边长，$\\frac{36}{16} \\cdot 10 = 22.5$，漏了开方：边长按 $k$ 缩放，不是按 $k^{2}$。方向也要检查：面积大的三角形，对应边也长。",
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
        const k = Q.of(b, a);
        const k2 = fr(A2, A1);
        const sq = k2 === `\\frac{${A2}}{${A1}}` ? `k^{2} = \\frac{${A2}}{${A1}}` : `k^{2} = \\frac{${A2}}{${A1}} = ${k2}`;
        return numberProblem({
          prompt: t(
            `$${tri(L1)} \\sim ${tri(L2)}$. The area of $${tri(L1)}$ is $${A1}$, the area of $${tri(L2)}$ is $${A2}$, and $${sideName(L1, i)} = ${side}$. Find $${sideName(L2, i)}$.`,
            `$${tri(L1)} \\sim ${tri(L2)}$。$${tri(L1)}$ 的面积为 $${A1}$，$${tri(L2)}$ 的面积为 $${A2}$，$${sideName(L1, i)} = ${side}$。求 $${sideName(L2, i)}$。`,
          ),
          answer,
          wrong: [Q.of(side * A2, A1), Q.of(side * a, b), side + Math.abs(A2 - A1)],
          solution: paras(
            step(
              1,
              "find the scale factor",
              "求相似比",
              t(
                `The ratio of the areas, from $${tri(L1)}$ to $${tri(L2)}$, is $k^{2}$; its square root is $k$:${steps(sq, `k = \\sqrt{${k2}} = ${k.toLatex()}`)}`,
                `从 $${tri(L1)}$ 到 $${tri(L2)}$ 的面积之比是 $k^{2}$，它的平方根就是 $k$：${steps(sq, `k = \\sqrt{${k2}} = ${k.toLatex()}`)}`,
              ),
            ),
            step(
              2,
              "multiply the side",
              "乘以边长",
              t(
                `$\\overline{${sideName(L2, i)}}$ corresponds to $\\overline{${sideName(L1, i)}}$, and lengths are multiplied by $k$:${steps(`${sideName(L2, i)} = ${k.toLatex()} \\cdot ${side} = ${answer}`)}`,
                `$\\overline{${sideName(L2, i)}}$ 对应 $\\overline{${sideName(L1, i)}}$，长度乘以 $k$：${steps(`${sideName(L2, i)} = ${k.toLatex()} \\cdot ${side} = ${answer}`)}`,
              ),
            ),
            check(
              t(
                `Square the ratio of the two sides; it must give the ratio of the areas:${steps(`\\left(\\frac{${answer}}{${side}}\\right)^{2} = \\left(${k.toLatex()}\\right)^{2} = ${fr(b * b, a * a)}`)}and the ratio of the areas is ${ratioIs(A2, A1).en}. The larger triangle, $${A2 > A1 ? tri(L2) : tri(L1)}$, has the longer side.`,
                `把两条边之比平方，必须得到面积之比：${steps(`\\left(\\frac{${answer}}{${side}}\\right)^{2} = \\left(${k.toLatex()}\\right)^{2} = ${fr(b * b, a * a)}`)}而面积之比正是 ${ratioIs(A2, A1)["zh-CN"]}。面积较大的 $${A2 > A1 ? tri(L2) : tri(L1)}$，对应边也较长。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "area-from-perimeters",
      title: t("Area from perimeters", "由周长求面积"),
      explanation: t(
        "A perimeter is a length, so the ratio of perimeters is the scale factor $k$ itself. Areas then go by $k^{2}$.\n\nSimilar hexagons have perimeters $12$ and $18$, and the smaller one has area $20$. Then $k = \\frac{18}{12} = \\frac{3}{2}$ and $k^{2} = \\frac{9}{4}$, so the larger area is $\\frac{9}{4} \\cdot 20 = 45$.\n\n> **Watch out.** Multiplying the area by the perimeter ratio itself, $\\frac{3}{2} \\cdot 20 = 30$, treats area like a length. And adding the difference of the perimeters to the area mixes a length with an area.",
        "周长是长度，所以周长之比就是相似比 $k$ 本身。面积则按 $k^{2}$ 变化。\n\n两个相似六边形的周长为 $12$ 和 $18$，较小的面积为 $20$。则 $k = \\frac{18}{12} = \\frac{3}{2}$，$k^{2} = \\frac{9}{4}$，所以较大的面积为 $\\frac{9}{4} \\cdot 20 = 45$。\n\n> **注意。** 直接用周长之比乘面积，$\\frac{3}{2} \\cdot 20 = 30$，是把面积当成了长度。把周长之差加到面积上，则是把长度和面积混为一谈。",
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
          solution: paras(
            step(
              1,
              "the perimeters give k",
              "周长给出 k",
              t(
                `The area $${area}$ belongs to the ${kind.en.replace(/s$/, "")} with perimeter $${P1}$. A perimeter is a length, so the scale factor from it to the other is the ratio of the perimeters:${steps(`k = \\frac{${P2}}{${P1}} = ${fr(b, a)}`)}`,
                `面积 $${area}$ 属于周长为 $${P1}$ 的那个${kind["zh-CN"]}。周长是长度，所以从它到另一个的相似比就是周长之比：${steps(`k = \\frac{${P2}}{${P1}} = ${fr(b, a)}`)}`,
              ),
            ),
            step(
              2,
              "square it for the area",
              "平方后求面积",
              t(
                `Areas are multiplied by $k^{2} = ${fr(b * b, a * a)}$:${steps(`${fr(b * b, a * a)} \\cdot ${area} = ${answer}`)}`,
                `面积乘以 $k^{2} = ${fr(b * b, a * a)}$：${steps(`${fr(b * b, a * a)} \\cdot ${area} = ${answer}`)}`,
              ),
            ),
            check(
              t(
                `Go back from the areas: their ratio is ${ratioIs(answer, area).en}. Its square root is $${fr(b, a)}$, the same as the ratio of the perimeters, ${ratioIs(P2, P1).en}.`,
                `从面积倒推回去：面积之比是 ${ratioIs(answer, area)["zh-CN"]}。它的平方根是 $${fr(b, a)}$，与周长之比 ${ratioIs(P2, P1)["zh-CN"]} 相同。`,
              ),
            ),
          ),
        });
      },
    },
  ],
};

// ─── 1.4.5 Similarity transformations ───────────────────────────────────────

/** Motion is a rigid motion in the coordinate plane, with its description, its inverse and how a figure draws it. */
interface Motion {
  readonly apply: (p: readonly [number, number]) => [number, number];
  readonly text: Text;
  /** back is the inverse motion, which undoes apply. */
  readonly back: (p: readonly [number, number]) => [number, number];
  /** backText describes the inverse motion. */
  readonly backText: Text;
  /** moving is how a solution figure draws the motion. */
  readonly moving: Moving;
}

/** shift writes v + a: "x + 3", "x - 2", "x". */
const shift = (v: string, a: number) => (a === 0 ? v : a > 0 ? `${v} + ${a}` : `${v} - ${-a}`);

/** translationText describes the translation by (a, b). */
const translationText = (a: number, b: number): Text =>
  t(`the translation $(x, y) \\to (${shift("x", a)}, ${shift("y", b)})$`, `平移 $(x, y) \\to (${shift("x", a)}, ${shift("y", b)})$`);

/** translation is the translation by (a, b). */
const translation = (a: number, b: number): Motion => ({
  apply: ([x, y]) => [x + a, y + b],
  text: translationText(a, b),
  back: ([x, y]) => [x - a, y - b],
  backText: translationText(-a, -b),
  moving: { kind: "slide" },
});

const otherMotions: readonly Motion[] = [
  {
    apply: ([x, y]) => [x, -y],
    text: t("a reflection across the $x$-axis", "关于 $x$ 轴的轴对称"),
    back: ([x, y]) => [x, -y],
    backText: t("the same reflection across the $x$-axis", "再作一次关于 $x$ 轴的轴对称"),
    moving: { kind: "flip", a: [0, 0], b: [1, 0] },
  },
  {
    apply: ([x, y]) => [-x, y],
    text: t("a reflection across the $y$-axis", "关于 $y$ 轴的轴对称"),
    back: ([x, y]) => [-x, y],
    backText: t("the same reflection across the $y$-axis", "再作一次关于 $y$ 轴的轴对称"),
    moving: { kind: "flip", a: [0, 0], b: [0, 1] },
  },
  {
    apply: ([x, y]) => [-x, -y],
    text: t("a rotation of $180^\\circ$ about the origin", "绕原点旋转 $180^\\circ$"),
    back: ([x, y]) => [-x, -y],
    backText: t("another rotation of $180^\\circ$ about the origin", "再绕原点旋转 $180^\\circ$"),
    moving: { kind: "turn", degrees: 180 },
  },
  {
    apply: ([x, y]) => [-y, x],
    text: t("a rotation of $90^\\circ$ counterclockwise about the origin", "绕原点逆时针旋转 $90^\\circ$"),
    back: ([x, y]) => [y, -x],
    backText: t("a rotation of $90^\\circ$ clockwise about the origin", "绕原点顺时针旋转 $90^\\circ$"),
    moving: { kind: "turn", degrees: 90 },
  },
];

/** dilate multiplies coordinates by k. */
const dilate = (k: Q, [x, y]: readonly [number, number]): [number, number] => [k.toNumber() * x, k.toNumber() * y];

/** dilationScales are scale factors for dilations in the coordinate plane. */
const dilationScales: readonly Q[] = [Q.of(2), Q.of(3), Q.of(1, 2), Q.of(3, 2), Q.of(1, 3)];

/** cap starts a sentence with a capital letter. */
const cap = (s: string) => `${s[0]!.toUpperCase()}${s.slice(1)}`;

/** times writes k · c for a coordinate, with c in parentheses when negative. */
const times = (k: Q, c: number) => `${k.toLatex()} \\cdot ${sub(c)}`;

/** transformationsIntroFigure shows triangle ABC dilated by 3 about the origin and then reflected across the x-axis. */
const transformationsIntroFigure: Figure = (() => {
  const pre: Point[] = [
    [1, 1],
    [3, 1],
    [1, 2],
  ];
  const mid = pre.map(([x, y]): Point => [3 * x, 3 * y]);
  const img = mid.map(([x, y]): Point => [x, -y]);
  return {
    svg: stagedPolygon(["A", "B", "C"], [pre, mid, img]).svg,
    alt: t(
      "Triangle ABC with vertices (1, 1), (3, 1), (1, 2) is dilated by 3 about the origin to the dashed triangle with vertices (3, 3), (9, 3), (3, 6), which is then reflected across the x-axis onto A′B′C′ with vertices (3, −3), (9, −3), (3, −6).",
      "顶点为 (1, 1)、(3, 1)、(1, 2) 的三角形 ABC 以原点为中心放大 3 倍，得到顶点为 (3, 3)、(9, 3)、(3, 6) 的虚线三角形，再关于 x 轴作轴对称，得到顶点为 (3, −3)、(9, −3)、(3, −6) 的 A′B′C′。",
    ),
  };
})();

export const similarityTransformations: TopicDef = {
  id: "similarity-transformations",
  title: t("Similarity Transformations", "相似变换"),
  summary: t(
    "Dilate figures about the origin, combine dilations with rigid motions, and describe a similarity transformation that maps one figure onto another.",
    "以原点为中心作位似，把位似与刚体运动组合，并描述把一个图形变成另一个图形的相似变换。",
  ),
  prerequisites: ["similarity-and-similar-polygons", "translations-of-geometric-figures", "reflections-in-the-coordinate-plane"],
  encompasses: [
    { topic: "dilations-of-geometric-figures", weight: 0.3 },
    { topic: "translations-of-geometric-figures", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSG.SRT.A.2", "CCSS.8.G.A.4"],
  intro: t(
    "Translations, reflections and rotations move a figure without changing its size: they make congruent copies. A dilation changes the size and keeps the shape. Doing one or more of these in a row is a **similarity transformation**, and two figures are similar exactly when some similarity transformation maps one onto the other.\n\nTake triangle $ABC$ with $A(1, 1)$, $B(3, 1)$ and $C(1, 2)$. A dilation by $3$ about the origin multiplies every coordinate by $3$: $(3, 3)$, $(9, 3)$, $(3, 6)$. A reflection across the $x$-axis then changes the sign of each $y$: $A'(3, -3)$, $B'(9, -3)$, $C'(3, -6)$.\n\n{{figure 0}}\n\nSide $AB$ was $2$ long; after the dilation it is $6$, and the reflection keeps it $6$. Every side grew by $3$ and no angle changed, so $\\triangle A'B'C' \\sim \\triangle ABC$. In this lesson we dilate points, follow a dilation with a rigid motion, and work out which transformations carry one figure onto another.",
    "平移、轴对称和旋转移动图形而不改变大小：它们得到全等的图形。位似则改变大小、保持形状。依次进行其中一个或几个变换，就是一个**相似变换**；两个图形相似，当且仅当存在一个相似变换把其中一个变成另一个。\n\n取三角形 $ABC$，$A(1, 1)$，$B(3, 1)$，$C(1, 2)$。以原点为中心、比例因子 $3$ 的位似把每个坐标乘以 $3$：$(3, 3)$、$(9, 3)$、$(3, 6)$。再关于 $x$ 轴作轴对称，每个 $y$ 变号：$A'(3, -3)$、$B'(9, -3)$、$C'(3, -6)$。\n\n{{figure 0}}\n\n边 $AB$ 原来长 $2$；位似后长 $6$，轴对称后仍是 $6$。每条边都变成 $3$ 倍，角一个也没变，所以 $\\triangle A'B'C' \\sim \\triangle ABC$。这节课我们对点作位似，在位似后接一个刚体运动，并找出把一个图形变成另一个图形的变换。",
  ),
  introFigures: [transformationsIntroFigure],
  knowledgePoints: [
    {
      id: "dilations-centered-at-the-origin",
      figure: motionDrawings["dilations-centered-at-the-origin"],
      title: t("Dilations centered at the origin", "以原点为中心的位似"),
      explanation: t(
        "A dilation centered at the origin with scale factor $k$ moves each point along the ray from the origin through it, to $k$ times its distance. Multiplying both coordinates by $k$ does exactly that:\n\n$$(x, y) \\to (kx, ky).$$\n\nWith $k = \\frac{1}{2}$, the point $(6, -4)$ goes to $(3, -2)$, halfway to the origin; with $k = 3$, it goes to $(18, -12)$, three times as far out.\n\n> **Watch out.** A dilation multiplies; it does not add: $(6 + 3, -4 + 3)$ is not the image for $k = 3$. Scale both coordinates, not just $x$, and do not divide by $k$, which is the dilation by $\\frac{1}{k}$.",
        "以原点为中心、比例因子为 $k$ 的位似，把每个点沿着从原点出发、经过该点的射线移到 $k$ 倍的距离处。把两个坐标都乘以 $k$ 恰好做到这一点：\n\n$$(x, y) \\to (kx, ky)$$\n\n当 $k = \\frac{1}{2}$ 时，点 $(6, -4)$ 变为 $(3, -2)$，离原点近了一半；当 $k = 3$ 时，变为 $(18, -12)$，远了三倍。\n\n> **注意。** 位似是乘法，不是加法：$k = 3$ 时像不是 $(6 + 3, -4 + 3)$。两个坐标都要乘，不能只乘 $x$；也不要除以 $k$，那是比例因子为 $\\frac{1}{k}$ 的位似。",
      ),
      keyPrerequisites: ["dilations-of-geometric-figures"],
      generate(rng) {
        const k = rng.pick(dilationScales);
        const d = Number(k.d);
        const p: [number, number] = [d * rng.nonZero(-6, 6), d * rng.int(-6, 6)];
        if (rng.bool()) p.reverse();
        const image = dilate(k, p);
        const kn = k.toNumber();
        const inv = Q.one.div(k);
        return {
          ...pointProblem({
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
            solution: paras(
              step(
                1,
                "multiply both coordinates",
                "两个坐标都乘",
                t(
                  `The dilation multiplies each coordinate by $${k.toLatex()}$:${steps(`P' = (${times(k, p[0])}, \\; ${times(k, p[1])}) = ${pointLatex([kn * p[0], kn * p[1]])}`)}`,
                  `位似把每个坐标乘以 $${k.toLatex()}$：${steps(`P' = (${times(k, p[0])}, \\; ${times(k, p[1])}) = ${pointLatex([kn * p[0], kn * p[1]])}`)}`,
                ),
              ),
              step(
                2,
                "see it on the ray",
                "在射线上看",
                t(
                  `$P'$ lies on the ray from the origin through $P$, ${kn > 1 ? `$${k.toLatex()}$ times as far out` : `closer to the origin, at $${k.toLatex()}$ of the distance`}:\n\n{{figure 0}}`,
                  `$P'$ 在从原点出发、经过 $P$ 的射线上，${kn > 1 ? `距离是原来的 $${k.toLatex()}$ 倍` : `离原点更近，距离只有原来的 $${k.toLatex()}$`}：\n\n{{figure 0}}`,
                ),
              ),
              check(
                t(
                  `Undo the dilation with scale factor $${inv.toLatex()}$: $(${times(inv, image[0])}, \\; ${times(inv, image[1])})$ is $${pointLatex(p)}$, the point $P$ we started from.`,
                  `用比例因子 $${inv.toLatex()}$ 的位似撤销它：$(${times(inv, image[0])}, \\; ${times(inv, image[1])})$ 等于 $${pointLatex(p)}$，正是出发点 $P$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [movedPoint("P", p, image, { kind: "scale" })],
        };
      },
    },
    {
      id: "dilations-followed-by-rigid-motions",
      figure: motionDrawings["dilations-followed-by-rigid-motions"],
      title: t("A dilation followed by a rigid motion", "位似后接刚体运动"),
      explanation: t(
        "A **similarity transformation** is a sequence of dilations and rigid motions (translations, reflections, rotations). The dilation scales every length by $k$ and the rigid motions keep every length, so the result is similar to the original. Apply the steps in order, each to the result of the one before.\n\nDilate $(2, -3)$ by $2$ about the origin: $(4, -6)$. Then translate by $(x, y) \\to (x - 5, y + 1)$: $(-1, -5)$.\n\n> **Watch out.** The order matters. Translating first and then dilating gives $(-3, -2)$ and then $(-6, -4)$, a different point, because the dilation also doubles the translation. And do not stop halfway: $(4, -6)$ is only the dilated point.",
        "**相似变换**是若干位似与刚体运动（平移、轴对称、旋转）的复合。位似把每条线段的长度乘以 $k$，刚体运动保持长度不变，所以结果与原图形相似。按顺序进行每一步，每一步都作用在上一步的结果上。\n\n以原点为中心、比例因子 $2$ 对 $(2, -3)$ 作位似：$(4, -6)$。再作平移 $(x, y) \\to (x - 5, y + 1)$：$(-1, -5)$。\n\n> **注意。** 顺序很重要。先平移再位似，得到 $(-3, -2)$，再变成 $(-6, -4)$，是另一个点，因为位似把平移的距离也放大了一倍。也不要只做一半：$(4, -6)$ 只是位似后的点。",
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
        const inv = Q.one.div(k);
        return {
          ...pointProblem({
            prompt: t(
              `A dilation centered at the origin with scale factor $${k.toLatex()}$, followed by ${motion.text.en}, maps $P${pointLatex(p)}$ to $P'$. Find $P'$.`,
              `先以原点为中心、比例因子 $${k.toLatex()}$ 作位似，再作${motion.text["zh-CN"]}，把 $P${pointLatex(p)}$ 映到 $P'$。求 $P'$。`,
            ),
            answer: image,
            wrong: [...(reversed.every(Number.isInteger) ? [reversed] : []), mid, motion.apply(p)],
            solution: paras(
              step(
                1,
                "dilate first",
                "先位似",
                t(
                  `Multiply both coordinates by $${k.toLatex()}$, and call the result $P_1$:${steps(`P_1 = (${times(k, p[0])}, \\; ${times(k, p[1])}) = ${pointLatex(mid)}`)}{{figure 0}}`,
                  `两个坐标都乘以 $${k.toLatex()}$，把结果记为 $P_1$：${steps(`P_1 = (${times(k, p[0])}, \\; ${times(k, p[1])}) = ${pointLatex(mid)}`)}{{figure 0}}`,
                ),
              ),
              step(
                2,
                "then the rigid motion",
                "再作刚体运动",
                t(
                  `Apply ${motion.text.en} to $P_1$, not to $P$:${steps(`P_1${pointLatex(mid)} \\to P'${pointLatex(image)}`)}{{figure 1}}`,
                  `对 $P_1$（而不是 $P$）作${motion.text["zh-CN"]}：${steps(`P_1${pointLatex(mid)} \\to P'${pointLatex(image)}`)}{{figure 1}}`,
                ),
              ),
              check(
                t(
                  `Undo the steps in reverse order. ${cap(motion.backText.en)} takes $P'${pointLatex(image)}$ back to $${pointLatex(motion.back(image))}$, which is $P_1$, and a dilation by $${inv.toLatex()}$ takes $P_1$ back to $${pointLatex(dilate(inv, mid))}$, which is $P$.`,
                  `按相反的顺序撤销各步。${motion.backText["zh-CN"]}，把 $P'${pointLatex(image)}$ 送回 $${pointLatex(motion.back(image))}$，即 $P_1$；再以比例因子 $${inv.toLatex()}$ 作位似，把 $P_1$ 送回 $${pointLatex(dilate(inv, mid))}$，即 $P$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [movedPoint("P", p, mid, { kind: "scale" }, "P₁"), movedPoint("P₁", mid, image, motion.moving, "P′")],
        };
      },
    },
    {
      id: "describing-a-similarity-transformation",
      figure: motionDrawings["describing-a-similarity-transformation"],
      title: t("Describing a similarity transformation", "描述相似变换"),
      explanation: t(
        "To describe how one figure maps onto a similar one, find the scale factor from a pair of corresponding sides, dilate the first figure about the origin, then find the rigid motion that moves the dilated figure onto the second.\n\nIf $A(1, 2) \\to A'(5, 3)$ and $B(3, 2) \\to B'(9, 3)$, going from $A$ to $B$ adds $(2, 0)$ while going from $A'$ to $B'$ adds $(4, 0)$, twice as much, so $k = 2$. Dilating gives $(2, 4)$ and $(6, 4)$, and both still need $(x, y) \\to (x + 3, y - 1)$ to land on $A'$ and $B'$.\n\n> **Watch out.** The scale factor is image over original: here $2$, not $\\frac{1}{2}$. The translation is measured from the dilated points to the images, not backwards. And translating before dilating would scale the translation too, so the order is part of the answer.",
        "要描述一个图形如何变成与它相似的图形，先由一对对应边求相似比，以原点为中心对第一个图形作位似，再找出把位似后的图形移到第二个图形上的刚体运动。\n\n若 $A(1, 2) \\to A'(5, 3)$，$B(3, 2) \\to B'(9, 3)$：从 $A$ 到 $B$ 坐标增加 $(2, 0)$，从 $A'$ 到 $B'$ 增加 $(4, 0)$，是两倍，所以 $k = 2$。位似得到 $(2, 4)$ 和 $(6, 4)$，它们都还要经过平移 $(x, y) \\to (x + 3, y - 1)$ 才落到 $A'$ 和 $B'$ 上。\n\n> **注意。** 比例因子是像比原图：这里是 $2$，不是 $\\frac{1}{2}$。平移要从位似后的点量到像，不能反过来。先平移再位似会把平移也放大，所以顺序也是答案的一部分。",
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
          const inverse = describe(Q.one.div(k), a, b);
          const backwards = describe(k, -a, -b);
          const swapped = describe(k, a, b, true);
          const options = rng.shuffle([correct, inverse, backwards, swapped]);
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
          const [dx, dy] = [p1[0] - p0[0], p1[1] - p0[1]];
          const [ex, ey] = [img[1]![0] - img[0]![0], img[1]![1] - img[0]![1]];
          const early = `(${Q.of(p0[0] + a)
            .mul(k)
            .toLatex()}, ${Q.of(p0[1] + b)
            .mul(k)
            .toLatex()})`;
          const tr = translation(a, b).text;
          const problem = choiceProblem({
            prompt: t(
              `Triangle $ABC$ with vertices $${pts(pre)}$ is mapped onto triangle $A'B'C'$ with vertices $${pts(img)}$. Which sequence of transformations does this?`,
              `顶点为 $${pts(pre)}$ 的三角形 $ABC$ 被映到顶点为 $${pts(img)}$ 的三角形 $A'B'C'$。下列哪个变换序列做到了这一点？`,
            ),
            options,
            correct: options.indexOf(correct),
            solution: paras(
              step(
                1,
                "find the scale factor",
                "求比例因子",
                t(
                  `Compare a side with its image. Going from $A$ to $B$ changes the coordinates by $(${dx}, ${dy})$; going from $A'$ to $B'$ changes them by $(${ex}, ${ey})$, which is $${k.toLatex()}$ times as much in each coordinate. So $A'B'$ is $${k.toLatex()}$ times as long as $AB$, and the scale factor is $${k.toLatex()}$.`,
                  `把一条边和它的像比较。从 $A$ 到 $B$，坐标变化 $(${dx}, ${dy})$；从 $A'$ 到 $B'$，坐标变化 $(${ex}, ${ey})$，每个坐标都是前者的 $${k.toLatex()}$ 倍。所以 $A'B'$ 的长是 $AB$ 的 $${k.toLatex()}$ 倍，比例因子为 $${k.toLatex()}$。`,
                ),
              ),
              step(
                2,
                "dilate",
                "作位似",
                t(
                  `Dilating $ABC$ by $${k.toLatex()}$ about the origin multiplies every coordinate by $${k.toLatex()}$: $${pts(dl)}$. This triangle has the right size but sits in the wrong place.`,
                  `以原点为中心、比例因子 $${k.toLatex()}$ 对 $ABC$ 作位似，每个坐标都乘以 $${k.toLatex()}$：$${pts(dl)}$。这个三角形大小对了，位置还不对。`,
                ),
              ),
              step(
                3,
                "find the rigid motion",
                "找刚体运动",
                t(
                  `From the dilated $A$, $${pointLatex(dl[0]!)}$, to $A'${pointLatex(img[0]!)}$ the coordinates change by $(${a}, ${b})$. So ${tr.en} finishes the job:\n\n{{figure 0}}`,
                  `从位似后的 $A$，即 $${pointLatex(dl[0]!)}$，到 $A'${pointLatex(img[0]!)}$，坐标变化 $(${a}, ${b})$。所以再作${tr["zh-CN"]}即可：\n\n{{figure 0}}`,
                ),
              ),
              check(
                t(
                  `Run the sequence on the other vertices. $B${pointLatex(p1)}$ dilates to $${pointLatex(dl[1]!)}$ and translates to $${pointLatex(img[1]!)}$, which is $B'$; $C${pointLatex(p2)}$ dilates to $${pointLatex(dl[2]!)}$ and translates to $${pointLatex(img[2]!)}$, which is $C'$.`,
                  `对另外两个顶点也走一遍。$B${pointLatex(p1)}$ 位似后为 $${pointLatex(dl[1]!)}$，平移后为 $${pointLatex(img[1]!)}$，正是 $B'$；$C${pointLatex(p2)}$ 位似后为 $${pointLatex(dl[2]!)}$，平移后为 $${pointLatex(img[2]!)}$，正是 $C'$。`,
                ),
              ),
            ),
          });
          return {
            ...reasoned(problem, [
              [
                inverse.en,
                `the scale factor is upside down: $A'B'$ is $${k.toLatex()}$ times as long as $AB$, so dilating by $${Q.one.div(k).toLatex()}$ gives a triangle of the wrong size.`,
                `比例因子颠倒了：$A'B'$ 的长是 $AB$ 的 $${k.toLatex()}$ 倍，按 $${Q.one.div(k).toLatex()}$ 位似，三角形的大小就不对。`,
              ],
              [
                backwards.en,
                "the translation runs backwards: it would move each image back onto its dilated point, not the dilated point onto its image.",
                "平移方向反了：它把像移回位似后的点，而不是把位似后的点移到像上。",
              ],
              [
                swapped.en,
                `the order is swapped: dilating after translating scales the translation too, and sends $A$ to $${early}$, not to $A'$.`,
                `顺序颠倒了：先平移后位似，平移也被放大了，$A$ 会被送到 $${early}$，而不是 $A'$。`,
              ],
            ]),
            figure: {
              svg: plane({ xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 }, marks),
              alt: t(
                `Triangle ABC with vertices ${pts(pre)} and its image A′B′C′ with vertices ${pts(img)} in the coordinate plane.`,
                `坐标平面上顶点为 ${pts(pre)} 的三角形 ABC 及其像 A′B′C′，顶点为 ${pts(img)}。`,
              ),
            },
            solutionFigures: [
              stagedPolygon(L, [
                pre,
                pre.map((p) => {
                  const q = dilate(k, p);
                  return [q[0], q[1]] as const;
                }),
                img,
              ]),
            ],
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

/** nestedAngles marks the angles that make the small and the large triangle of a nested figure similar: ∠ADE and ∠ABC in the action color, the shared angle at A in the result color. */
const nestedAngles = ({ pa, pb, pc, pd, pe }: Nested): Mark[] => [
  { kind: "arc", vertex: pd, from: pa, to: pe, tone: "action" },
  { kind: "arc", vertex: pb, from: pa, to: pc, tone: "action" },
  { kind: "arc", vertex: pa, from: pb, to: pc, tone: "result" },
];

/** arcAt marks the angle of a polygon at vertex i, with a label and a tone. */
const arcAt = (ps: readonly Point[], i: number, label: string, tone?: Tone): Mark => ({
  kind: "arc",
  vertex: ps[i]!,
  from: ps[(i + 1) % ps.length]!,
  to: ps[(i + ps.length - 1) % ps.length]!,
  label,
  ...(tone ? { tone } : { accent: true }),
});

/** aaIntroFigure shows two triangles with angles 30° and 100°, of different sizes; their third angles, 50°, are drawn in the result color. */
const aaIntroFigure: Figure = (() => {
  const [p1, p2] = sideBySide(byAngles(30, 100), posed(byAngles(30, 100), { turn: 0, mirror: true }), 1.5);
  return figure(
    [
      ...polyMarks(p1, "ABC", [], ["30°", "100°", null]),
      arcAt(p1, 2, "50°", "result"),
      ...polyMarks(p2, "DEF", [], ["30°", "100°", null]),
      arcAt(p2, 2, "50°", "result"),
    ],
    "Triangle ABC with angles 30° at A and 100° at B, and a larger triangle DEF with angles 30° at D and 100° at E. The third angles, at C and F, are both 50° and drawn in another color.",
    "三角形 ABC：A 处 30°，B 处 100°；较大的三角形 DEF：D 处 30°，E 处 100°。第三个角 C 和 F 都是 50°，用另一种颜色画出。",
  );
})();

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
  intro: t(
    "By the definition, proving two triangles similar means checking three angles and three side ratios. For triangles far less is enough: two pairs of congruent angles already force similarity.\n\nTake $\\triangle ABC$ with $m\\angle A = 30^\\circ$ and $m\\angle B = 100^\\circ$, and a larger $\\triangle DEF$ with $m\\angle D = 30^\\circ$ and $m\\angle E = 100^\\circ$. The third angles are both $180^\\circ - 30^\\circ - 100^\\circ = 50^\\circ$, so all three angles match.\n\n{{figure 0}}\n\nNow dilate $\\triangle ABC$ by the factor $\\frac{DE}{AB}$. Its copy has side $DE$ between angles of $30^\\circ$ and $100^\\circ$, just like $\\triangle DEF$, so by ASA the copy is congruent to $\\triangle DEF$. A dilation followed by a rigid motion carries $\\triangle ABC$ onto $\\triangle DEF$: they are similar. This is the **AA criterion**. In this lesson we use it to decide similarity, to write the statement in the right order, and on a line drawn parallel to a side.",
    "按定义，证明两个三角形相似要检查三个角和三组边的比。对三角形来说远不需要这么多：两组角分别相等就足以保证相似。\n\n取 $\\triangle ABC$，$m\\angle A = 30^\\circ$，$m\\angle B = 100^\\circ$；再取一个较大的 $\\triangle DEF$，$m\\angle D = 30^\\circ$，$m\\angle E = 100^\\circ$。两个第三角都是 $180^\\circ - 30^\\circ - 100^\\circ = 50^\\circ$，所以三个角全部对应相等。\n\n{{figure 0}}\n\n现在把 $\\triangle ABC$ 按比例因子 $\\frac{DE}{AB}$ 作位似。所得的图形中，边 $DE$ 夹在 $30^\\circ$ 和 $100^\\circ$ 两个角之间，与 $\\triangle DEF$ 一样，所以由 ASA，它与 $\\triangle DEF$ 全等。一个位似再接一个刚体运动就把 $\\triangle ABC$ 变成了 $\\triangle DEF$：它们相似。这就是 **AA 判定**。这节课我们用它判断相似、按正确的顺序写出相似式，并用于平行于一边的直线。",
  ),
  introFigures: [aaIntroFigure],
  knowledgePoints: [
    {
      id: "similar-by-two-angles",
      figure: similarityDrawings["similar-by-two-angles"],
      title: t("Two pairs of angles", "两组角"),
      explanation: t(
        "**AA similarity criterion:** if two angles of one triangle are congruent to two angles of another, the triangles are similar. The third angles then match too, since in each triangle they are $180^\\circ$ minus the other two.\n\nA triangle with angles $40^\\circ$ and $75^\\circ$ has third angle $180^\\circ - 40^\\circ - 75^\\circ = 65^\\circ$. It is similar to a triangle with angles $65^\\circ$ and $40^\\circ$, whose third angle is $75^\\circ$: the same three angles in another order. It is not similar to one with angles $40^\\circ$ and $70^\\circ$, whose third angle is $70^\\circ$.\n\n> **Watch out.** One pair of congruent angles is not enough; it takes two. Compare all three angles, since the given ones may sit at different vertices. And size does not matter: similar triangles are usually of different sizes.",
        "**AA 相似判定**：如果一个三角形的两个角分别与另一个三角形的两个角相等，那么这两个三角形相似。这时第三个角也相等，因为在每个三角形里，它都等于 $180^\\circ$ 减去另外两个角。\n\n两个角为 $40^\\circ$ 和 $75^\\circ$ 的三角形，第三个角是 $180^\\circ - 40^\\circ - 75^\\circ = 65^\\circ$。它与两个角为 $65^\\circ$ 和 $40^\\circ$ 的三角形相似，后者的第三个角是 $75^\\circ$：同样的三个角，只是顺序不同。它与两个角为 $40^\\circ$ 和 $70^\\circ$ 的三角形不相似，后者的第三个角是 $70^\\circ$。\n\n> **注意。** 只有一组角相等是不够的，要两组。三个角都要比较，因为给出的角可能在不同的顶点上。大小无关紧要：相似三角形通常大小不同。",
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
          const angleList = (vs: readonly number[]) => `${vs.join("^\\circ, ")}^\\circ`;
          const claimed = similar ? [x, y - 5, z + 5] : [x, y, z];
          const base = [...polyMarks(p1, L1, [], [deg(a), deg(b), null]), ...polyMarks(p2, L2, [], [deg(x), deg(y), null])];
          const sorted1 = [a, b, c].sort((p, q) => p - q);
          const sorted2 = [x, y, z].sort((p, q) => p - q);
          const odd = sorted2.find((v) => !sorted1.includes(v));
          return {
            ...verdictChoice(rng, {
              prompt: t(`Is $${tri(L1)}$ similar to $${tri(L2)}$?`, `$${tri(L1)}$ 与 $${tri(L2)}$ 相似吗？`),
              holds: similar,
              yes: t(`both triangles have the angles $${angleList([a, b, c])}$`, `两个三角形的角都是 $${angleList([a, b, c])}$`),
              no: t(
                `one triangle has the angles $${angleList([a, b, c])}$ and the other $${angleList(claimed)}$`,
                `一个三角形的角是 $${angleList([a, b, c])}$，另一个是 $${angleList(claimed)}$`,
              ),
              yesWrong: t("the triangles have one pair of congruent angles", "两个三角形有一组相等的角"),
              noWrong: t("the two triangles have different sizes", "两个三角形大小不同"),
              solution: paras(
                step(
                  1,
                  "find the third angles",
                  "求第三个角",
                  t(
                    `Each triangle shows two angles; the third is $180^\\circ$ minus the other two:${steps(`m\\angle ${L1[2]} = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`, `m\\angle ${L2[2]} = 180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ`)}{{figure 0}}`,
                    `每个三角形给出了两个角，第三个角等于 $180^\\circ$ 减去另外两个：${steps(`m\\angle ${L1[2]} = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`, `m\\angle ${L2[2]} = 180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ`)}{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "compare the angles",
                  "比较各角",
                  similar
                    ? t(
                        `From smallest to largest, $${tri(L1)}$ has $${angleList(sorted1)}$ and $${tri(L2)}$ has $${angleList(sorted2)}$: the same three angles. Two pairs of congruent angles are enough, so the triangles are similar by AA.`,
                        `从小到大，$${tri(L1)}$ 的角是 $${angleList(sorted1)}$，$${tri(L2)}$ 的角是 $${angleList(sorted2)}$：三个角相同。有两组角相等就够了，所以由 AA，两三角形相似。`,
                      )
                    : t(
                        `From smallest to largest, $${tri(L1)}$ has $${angleList(sorted1)}$ and $${tri(L2)}$ has $${angleList(sorted2)}$. The angle $${odd}^\\circ$ of $${tri(L2)}$ has no partner in $${tri(L1)}$, so the angles do not match and the triangles are not similar.`,
                        `从小到大，$${tri(L1)}$ 的角是 $${angleList(sorted1)}$，$${tri(L2)}$ 的角是 $${angleList(sorted2)}$。$${tri(L2)}$ 的 $${odd}^\\circ$ 在 $${tri(L1)}$ 中找不到相等的角，所以角不对应，两三角形不相似。`,
                      ),
                ),
                check(
                  t(
                    `Both lists add up to $180^\\circ$: $${a} + ${b} + ${c} = 180$ and $${x} + ${y} + ${z} = 180$, so the third angles were found correctly${similar ? "" : ", and the mismatch is real"}.`,
                    `两组角的和都是 $180^\\circ$：$${a} + ${b} + ${c} = 180$，$${x} + ${y} + ${z} = 180$，所以第三个角求得没错${similar ? "" : "，角不对应是确实的"}。`,
                  ),
                ),
              ),
            }),
            figure: figure(
              base,
              `Triangle ${L1} with angles ${a}° at ${L1[0]} and ${b}° at ${L1[1]}; triangle ${L2} with angles ${x}° at ${L2[0]} and ${y}° at ${L2[1]}.`,
              `三角形 ${L1}，${L1[0]} 处 ${a}°，${L1[1]} 处 ${b}°；三角形 ${L2}，${L2[0]} 处 ${x}°，${L2[1]} 处 ${y}°。`,
            ),
            solutionFigures: [
              figure(
                [...base, arcAt(p1, 2, deg(c), "result"), arcAt(p2, 2, deg(z), "result")],
                `The same triangles with the third angles added: ${c}° at ${L1[2]} and ${z}° at ${L2[2]}.`,
                `同样的两个三角形，补上第三个角：${L1[2]} 处 ${c}°，${L2[2]} 处 ${z}°。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "writing-the-similarity-statement",
      figure: similarityDrawings["writing-the-similarity-statement"],
      title: t("Writing the similarity statement", "写出相似式"),
      explanation: t(
        "A similarity statement is a list of pairs: the first letters correspond, then the second, then the third. So it must pair vertices with equal angles. Find all three angles of each triangle, then match equal angles.\n\nIf $\\angle A = 50^\\circ$, $\\angle B = 60^\\circ$ (so $\\angle C = 70^\\circ$) and $\\angle D = 70^\\circ$, $\\angle E = 50^\\circ$ (so $\\angle F = 60^\\circ$), then $A \\leftrightarrow E$, $B \\leftrightarrow F$, $C \\leftrightarrow D$, and $\\triangle ABC \\sim \\triangle EFD$.\n\n> **Watch out.** Do not copy the letters in alphabetical order: $\\triangle ABC \\sim \\triangle DEF$ would pair the $50^\\circ$ angle with the $70^\\circ$ one. Write the second name letter by letter, each the partner of the letter above it.",
        "相似式是一列配对：第一个字母对应，第二个对应，第三个对应。所以它必须把角相等的顶点配在一起。先求出每个三角形的三个角，再把相等的角对应起来。\n\n若 $\\angle A = 50^\\circ$，$\\angle B = 60^\\circ$（所以 $\\angle C = 70^\\circ$），$\\angle D = 70^\\circ$，$\\angle E = 50^\\circ$（所以 $\\angle F = 60^\\circ$），则 $A \\leftrightarrow E$，$B \\leftrightarrow F$，$C \\leftrightarrow D$，$\\triangle ABC \\sim \\triangle EFD$。\n\n> **注意。** 不要按字母表顺序照抄：$\\triangle ABC \\sim \\triangle DEF$ 会把 $50^\\circ$ 的角和 $70^\\circ$ 的角配在一起。第二个名字要一个字母一个字母地写，每个都是上面那个字母的对应点。",
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
          const missing = [0, 1, 2].find((k) => !known2.includes(k))!;
          const angleOf2 = (letter: string) => second[L2.indexOf(letter)]!;
          // Equal angles share a tone in the solution figure.
          const tones: (Tone | undefined)[] = ["action", "result", undefined];
          const statement = (o: string) => m(`${tri(L1)} \\sim ${tri(o)}`);
          const problem = choiceProblem({
            prompt: t(`Which similarity statement is correct?`, `哪个相似式是正确的？`),
            options: options.map(statement),
            correct: options.indexOf(correctName),
            solution: paras(
              step(
                1,
                "find the missing angles",
                "求未给出的角",
                t(
                  `Each triangle has one angle not shown, $180^\\circ$ minus the other two:${steps(`m\\angle ${L1[2]} = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`, `m\\angle ${L2[missing]} = 180^\\circ - ${known2.map((k) => `${second[k]}^\\circ`).join(" - ")} = ${second[missing]}^\\circ`)}`,
                  `每个三角形都有一个角没有给出，它等于 $180^\\circ$ 减去另外两个：${steps(`m\\angle ${L1[2]} = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`, `m\\angle ${L2[missing]} = 180^\\circ - ${known2.map((k) => `${second[k]}^\\circ`).join(" - ")} = ${second[missing]}^\\circ`)}`,
                ),
              ),
              step(
                2,
                "match equal angles",
                "把相等的角配对",
                t(
                  `Equal angles are drawn in one color:\n\n{{figure 0}}\n\nSo $${pairs}$, and the second name lists these partners in the order of $${L1}$: $${tri(L1)} \\sim ${tri(correctName)}$, by AA.`,
                  `相等的角用同一种颜色画出：\n\n{{figure 0}}\n\n所以 $${pairs}$，第二个名字按 $${L1}$ 的顺序写出这些对应点：由 AA，$${tri(L1)} \\sim ${tri(correctName)}$。`,
                ),
              ),
              check(
                t(
                  `Read the statement back place by place: ${[0, 1, 2].map((i) => `$${L1[i]}$ and $${match[i]}$ are both $${angles[i]}^\\circ$`).join(", ")}.`,
                  `按位置把相似式读回去：${[0, 1, 2].map((i) => `$${L1[i]}$ 与 $${match[i]}$ 都是 $${angles[i]}^\\circ$`).join("，")}。`,
                ),
              ),
            ),
          });
          const reasons = others.map((o): readonly [string, string, string] => {
            const i = [0, 1, 2].find((k) => o[k] !== match[k])!;
            return [
              statement(o).en,
              `it pairs $${L1[i]}$, which is $${angles[i]}^\\circ$, with $${o[i]}$, which is $${angleOf2(o[i]!)}^\\circ$.`,
              `它把 $${angles[i]}^\\circ$ 的 $${L1[i]}$ 与 $${angleOf2(o[i]!)}^\\circ$ 的 $${o[i]}$ 配在一起。`,
            ];
          });
          return {
            ...reasoned(problem, reasons),
            figure: figure(
              [...polyMarks(p1, L1, [], [deg(a), deg(b), null]), ...polyMarks(p2, L2, [], arcs2)],
              `Triangle ${L1} with angles ${a}° at ${L1[0]} and ${b}° at ${L1[1]}; triangle ${L2} with angles ${known2.map((k) => `${second[k]}° at ${L2[k]}`).join(" and ")}.`,
              `三角形 ${L1}，${L1[0]} 处 ${a}°，${L1[1]} 处 ${b}°；三角形 ${L2}，${known2.map((k) => `${L2[k]} 处 ${second[k]}°`).join("，")}。`,
            ),
            solutionFigures: [
              figure(
                [
                  ...polyMarks(p1, L1),
                  ...polyMarks(p2, L2),
                  ...[0, 1, 2].map((i) => arcAt(p1, i, deg(angles[i]!), tones[i])),
                  ...[0, 1, 2].map((k) => arcAt(p2, k, deg(second[k]!), tones[perm[k]!])),
                ],
                `Both triangles with all their angles; equal angles share a color: ${[0, 1, 2].map((i) => `${L1[i]} and ${match[i]}, ${angles[i]}°`).join("; ")}.`,
                `两个三角形标出全部角，相等的角颜色相同：${[0, 1, 2].map((i) => `${L1[i]} 与 ${match[i]}，${angles[i]}°`).join("；")}。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "a-line-parallel-to-a-side",
      figure: similarityDrawings["a-line-parallel-to-a-side"],
      title: t("A line parallel to a side", "平行于一边的直线"),
      explanation: t(
        `If $D$ is on $\\overline{AB}$, $E$ is on $\\overline{AC}$ and $\\overline{DE} \\parallel \\overline{BC}$, then $\\angle ADE \\cong \\angle ABC$ (corresponding angles) and $\\angle A$ is shared, so $\\triangle ADE \\sim \\triangle ABC$ by AA. The small triangle's sides are $AD$, $AE$, $DE$; the large one's are the **whole** sides $AB$, $AC$, $BC$, with $AB = AD + DB$.\n\nIf $AD = 4$, $DB = 6$ and $DE = 6$, then $AB = 10$ and${steps("\\frac{BC}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad BC = 15")}\n\n> **Watch out.** $\\overline{DB}$ is not a side of either triangle. Pairing $DE$ with $DB$, setting $\\frac{BC}{6}$ equal to $\\frac{6}{4}$, gives $9$, a wrong answer; add $AD + DB$ first. Nor is $BC$ simply $DE + DB$.`,
        `若 $D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上，且 $\\overline{DE} \\parallel \\overline{BC}$，则 $\\angle ADE \\cong \\angle ABC$（同位角），$\\angle A$ 是公共角，所以由 AA，$\\triangle ADE \\sim \\triangle ABC$。小三角形的边是 $AD$、$AE$、$DE$；大三角形的边是**整条**边 $AB$、$AC$、$BC$，其中 $AB = AD + DB$。\n\n若 $AD = 4$，$DB = 6$，$DE = 6$，则 $AB = 10$，${steps("\\frac{BC}{6} = \\frac{10}{4} \\quad\\Rightarrow\\quad BC = 15")}\n\n> **注意。** $\\overline{DB}$ 不是任何一个三角形的边。用 $DB$ 来配，比如令 $\\frac{BC}{6}$ 等于 $\\frac{6}{4}$，会得到错误的 $9$；要先算 $AD + DB$。$BC$ 也不是简单的 $DE + DB$。`,
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
        const base = nestedMarks(n, L, {
          arrows: true,
          ad: String(AD),
          db: String(DB),
          de: findBC ? String(DE) : "x",
          bc: findBC ? "x" : String(BC),
        });
        const fig = figure(
          base,
          `Triangle ${A}${B}${C} with ${D} on ${A}${B} and ${E} on ${A}${C}, ${D}${E} parallel to ${B}${C}; ${A}${D} = ${AD}, ${D}${B} = ${DB}, ${findBC ? `${D}${E} = ${DE}, ${B}${C} = x` : `${B}${C} = ${BC}, ${D}${E} = x`}.`,
          `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，${D}${E} ∥ ${B}${C}；${A}${D} = ${AD}，${D}${B} = ${DB}，${findBC ? `${D}${E} = ${DE}，${B}${C} = x` : `${B}${C} = ${BC}，${D}${E} = x`}。`,
        );
        const answer = findBC ? BC : DE;
        const line = findBC ? prop("x", String(DE), String(AB), String(AD)) : prop("x", String(BC), String(AD), String(AB));
        const solved = findBC ? `x = \\frac{${AB} \\cdot ${DE}}{${AD}} = ${answer}` : `x = \\frac{${AD} \\cdot ${BC}}{${AB}} = ${answer}`;
        const unknown = findBC ? "BC" : "DE";
        return {
          ...numberProblem({
            prompt: t(`In the figure, $${D}${E} \\parallel ${B}${C}$. Find $x$.`, `如图，$${D}${E} \\parallel ${B}${C}$。求 $x$。`),
            answer,
            solveFor: "x",
            wrong: findBC ? [Q.of(DE * DB, AD), DE + DB] : [Q.of(BC * AD, DB), BC - DB],
            solution: paras(
              step(
                1,
                "show the triangles are similar",
                "说明两三角形相似",
                t(
                  `$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$ with transversal $\\overleftrightarrow{${A}${B}}$, so the corresponding angles $\\angle ${A}${D}${E}$ and $\\angle ${A}${B}${C}$ are congruent; $\\angle ${A}$ belongs to both triangles. Two pairs of angles give $\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}$ by AA:\n\n{{figure 0}}`,
                  `$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，截线为 $\\overleftrightarrow{${A}${B}}$，所以同位角 $\\angle ${A}${D}${E}$ 与 $\\angle ${A}${B}${C}$ 相等；$\\angle ${A}$ 是两个三角形的公共角。两组角相等，由 AA，$\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}$：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "compare whole sides",
                "比较整条边",
                t(
                  `The side of the large triangle along $\\overline{${A}${B}}$ is the whole of it, $${A}${B} = ${AD} + ${DB} = ${AB}$. Then $\\overline{${unknown === "BC" ? `${B}${C}` : `${D}${E}`}}$ pairs with $\\overline{${unknown === "BC" ? `${D}${E}` : `${B}${C}`}}$ as $\\overline{${unknown === "BC" ? `${A}${B}` : `${A}${D}`}}$ pairs with $\\overline{${unknown === "BC" ? `${A}${D}` : `${A}${B}`}}$:${steps(line, solved)}`,
                  `大三角形在 $\\overline{${A}${B}}$ 上的边是整条 $${A}${B} = ${AD} + ${DB} = ${AB}$。于是 $\\overline{${unknown === "BC" ? `${B}${C}` : `${D}${E}`}}$ 与 $\\overline{${unknown === "BC" ? `${D}${E}` : `${B}${C}`}}$ 的关系，和 $\\overline{${unknown === "BC" ? `${A}${B}` : `${A}${D}`}}$ 与 $\\overline{${unknown === "BC" ? `${A}${D}` : `${A}${B}`}}$ 的关系一样：${steps(line, solved)}`,
                ),
              ),
              check(
                t(
                  `Go by the pieces instead. The ratio $\\frac{${B}${C}}{${D}${E}}$ equals $\\frac{${A}${B}}{${A}${D}}$, so the extra length $${B}${C} - ${D}${E}$ must be to $${D}${E}$ as the extra $${D}${B}$ is to $${A}${D}$:${steps(`${B}${C} - ${D}${E} = ${BC} - ${DE} = ${BC - DE}`, `${D}${E} \\cdot \\frac{${DB}}{${AD}} = ${DE} \\cdot \\frac{${DB}}{${AD}} = ${BC - DE}`)}The two agree, and the ${findBC ? "large" : "small"} triangle's side came out ${findBC ? "longer" : "shorter"}, as it should.`,
                  `换个方法，按多出来的部分算。$\\frac{${B}${C}}{${D}${E}}$ 等于 $\\frac{${A}${B}}{${A}${D}}$，所以多出来的 $${B}${C} - ${D}${E}$ 与 $${D}${E}$ 之比，必须等于多出来的 $${D}${B}$ 与 $${A}${D}$ 之比：${steps(`${B}${C} - ${D}${E} = ${BC} - ${DE} = ${BC - DE}`, `${D}${E} \\cdot \\frac{${DB}}{${AD}} = ${DE} \\cdot \\frac{${DB}}{${AD}} = ${BC - DE}`)}两者一致，${findBC ? "大" : "小"}三角形的边算出来也${findBC ? "更长" : "更短"}，符合预期。`,
                ),
              ),
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              [...base, ...nestedAngles(n)],
              `The same figure with the corresponding angles ${A}${D}${E} and ${A}${B}${C} marked in one color and the shared angle ${A} in another.`,
              `同样的图形：同位角 ${A}${D}${E} 与 ${A}${B}${C} 用一种颜色标出，公共角 ${A} 用另一种颜色。`,
            ),
          ],
        };
      },
    },
  ],
};

// ─── 1.4.7 The SSS similarity criterion ─────────────────────────────────────

/** sortedRatios writes the ratios of sorted sides of two triangles, for solutions. */
function sortedRatios(s1: readonly number[], s2: readonly number[]): string {
  const [x, y] = [[...s1].sort((p, q) => p - q), [...s2].sort((p, q) => p - q)];
  return x
    .map((v, i) => {
      const raw = `\\frac{${y[i]}}{${v}}`;
      return fr(y[i]!, v) === raw ? raw : `${raw} = ${fr(y[i]!, v)}`;
    })
    .join(", \\quad ");
}

/** bySize colors the sides of a triangle by their rank: shortest in the action color, middle in the result color, longest in the accent. */
function bySize(ps: readonly Point[], sides: readonly number[]): Mark[] {
  const order = [0, 1, 2].sort((i, j) => sides[i]! - sides[j]! || i - j);
  return order.map((i, rank): Mark => {
    const [a, b] = [ps[i]!, ps[(i + 1) % 3]!];
    return rank === 2 ? { kind: "segment", a, b, accent: true } : { kind: "segment", a, b, tone: rank === 0 ? "action" : "result" };
  });
}

/** sizeAlt says in words how a figure drawn with bySize colors the sides. */
const sizeAlt = [
  "Shortest sides share one color, middle sides another and longest sides a third.",
  "最短边同一种颜色，中间的边另一种，最长边第三种。",
] as const;

/** sssIntroFigure shows triangles with sides 5, 7, 8 and 10, 14, 16, sides of equal rank in one color. */
const sssIntroFigure: Figure = (() => {
  const [s1, s2] = [
    [5, 7, 8],
    [10, 14, 16],
  ] as const;
  const [p1, p2] = sideBySide(bySides(s1), posed(bySides(s2), { turn: 180, mirror: false }), 1.5);
  return figure(
    [...polyMarks(p1, "ABC", s1.map(String)), ...polyMarks(p2, "DEF", s2.map(String)), ...bySize(p1, s1), ...bySize(p2, s2)],
    `Triangle ABC with sides 5, 7, 8 and triangle DEF with sides 10, 14, 16, drawn upside down. ${sizeAlt[0]}`,
    `三角形 ABC 三边为 5、7、8，三角形 DEF 三边为 10、14、16，倒过来画。${sizeAlt[1]}`,
  );
})();

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
  intro: t(
    "AA decides similarity from angles. Often we know the sides instead, and then a second shortcut applies: if all three sides of one triangle are the same multiple of the sides of another, the triangles are similar. Nothing about the angles needs checking.\n\nTake sides $5, 7, 8$ and $10, 14, 16$. Pair them by size and divide: $10 \\div 5 = 2$, $14 \\div 7 = 2$, $16 \\div 8 = 2$. Every side doubled.\n\n{{figure 0}}\n\nWhy that is enough: dilate the first triangle by $2$. The copy has sides $10, 14, 16$, the same as the second triangle, so by SSS congruence the copy is congruent to it. A dilation and a rigid motion carry one triangle onto the other, so they are similar, and their angles match even though we never measured one. This is the **SSS similarity criterion**. In this lesson we check three ratios, match sides to find the scale factor, and find an unknown side.",
    "AA 由角判定相似。但我们常常知道的是边，这时有第二条捷径：如果一个三角形的三条边都是另一个三角形三条边的同一个倍数，那么这两个三角形相似，角完全不用检查。\n\n取三边 $5, 7, 8$ 与 $10, 14, 16$。按大小配对再相除：$10 \\div 5 = 2$，$14 \\div 7 = 2$，$16 \\div 8 = 2$。每条边都翻了一倍。\n\n{{figure 0}}\n\n为什么这就够了：把第一个三角形放大 $2$ 倍，所得三角形三边为 $10, 14, 16$，与第二个三角形相同，所以由 SSS 全等判定，它与第二个三角形全等。一个位似加一个刚体运动就把一个三角形变成了另一个，所以它们相似；虽然一个角都没量，它们的角也对应相等。这就是 **SSS 相似判定**。这节课我们检验三个比，配对各边求相似比，并求未知的边。",
  ),
  introFigures: [sssIntroFigure],
  knowledgePoints: [
    {
      id: "checking-three-ratios",
      figure: similarityDrawings["checking-three-ratios"],
      title: t("Checking three ratios", "检验三个比"),
      explanation: t(
        `**SSS similarity criterion:** if the three sides of one triangle are proportional to the three sides of another, the triangles are similar.\n\nCorresponding sides of similar triangles are in the same order of size, so sort each triangle's sides from shortest to longest and divide: shortest by shortest, middle by middle, longest by longest. Sides $4, 6, 8$ and $6, 9, 12$:${steps("\\frac{6}{4} = \\frac{3}{2}, \\quad \\frac{9}{6} = \\frac{3}{2}, \\quad \\frac{12}{8} = \\frac{3}{2}")}All equal, so the triangles are similar. Sides $4, 6, 8$ and $6, 9, 11$ fail: $\\frac{11}{8}$ is not $\\frac{3}{2}$.\n\n> **Watch out.** Two equal ratios out of three are not enough; all three must agree. Pair sides by size, not by where they are drawn. And the differences of the sides do not matter: similar sides are multiples, not shifts.`,
        `**SSS 相似判定**：如果一个三角形的三条边与另一个三角形的三条边成比例，那么这两个三角形相似。\n\n相似三角形的对应边大小顺序相同，所以把每个三角形的边从短到长排列再相除：最短比最短，中间比中间，最长比最长。三边 $4, 6, 8$ 与 $6, 9, 12$：${steps("\\frac{6}{4} = \\frac{3}{2}, \\quad \\frac{9}{6} = \\frac{3}{2}, \\quad \\frac{12}{8} = \\frac{3}{2}")}全都相等，所以两三角形相似。三边 $4, 6, 8$ 与 $6, 9, 11$ 就不行：$\\frac{11}{8}$ 不等于 $\\frac{3}{2}$。\n\n> **注意。** 三个比中只有两个相等是不够的，三个都要相等。按大小配对各边，而不是按画的位置。边长之差无关紧要：相似的边是倍数关系，不是加减关系。`,
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
          const claimed = x.map((w, i) => fr(y[i]! + (similar && i === 2 ? 1 : 0), w));
          const base = [...polyMarks(p1, L1, s1.map(String)), ...polyMarks(p2, L2, s2.map(String))];
          const k = Q.of(y[0]!, x[0]!);
          const fails = [1, 2].filter((i) => y[i]! * x[0]! !== x[i]! * y[0]!);
          const rank = [t("middle", "中间的"), t("longest", "最长的")];
          return {
            ...verdictChoice(rng, {
              prompt: t(`Is $${tri(L1)}$ similar to $${tri(L2)}$?`, `$${tri(L1)}$ 与 $${tri(L2)}$ 相似吗？`),
              holds: similar,
              yes: t(`all three side ratios equal $${fr(y[0]!, x[0]!)}$`, `三个边长比都等于 $${fr(y[0]!, x[0]!)}$`),
              no: t(`the side ratios are $${claimed.join(", ")}$, not all equal`, `三个边长比是 $${claimed.join(", ")}$，不全相等`),
              yesWrong: t("two of the three side ratios are equal", "三个边长比中有两个相等"),
              noWrong: t("the sides differ by different amounts", "对应边相差的量不同"),
              solution: paras(
                step(
                  1,
                  "pair the sides by size",
                  "按大小配对各边",
                  t(
                    `$${tri(L1)}$ has sides $${x.join(", ")}$ and $${tri(L2)}$ has $${y.join(", ")}$, from shortest to longest. Sides of the same rank are drawn in one color:\n\n{{figure 0}}`,
                    `从短到长，$${tri(L1)}$ 的边是 $${x.join(", ")}$，$${tri(L2)}$ 的边是 $${y.join(", ")}$。同一名次的边用同一种颜色画出：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "compare the three ratios",
                  "比较三个比",
                  t(
                    `Divide each side of $${tri(L2)}$ by its partner:${steps(sortedRatios(s1, s2))}${similar ? "All three ratios are equal, so the triangles are similar by SSS." : "The ratios are not all equal, so the triangles are not similar."}`,
                    `用 $${tri(L2)}$ 的每条边除以对应边：${steps(sortedRatios(s1, s2))}${similar ? "三个比都相等，所以由 SSS 两三角形相似。" : "三个比不全相等，所以两三角形不相似。"}`,
                  ),
                ),
                check(
                  similar
                    ? t(
                        `Scale $${tri(L1)}$ by the factor $${k.toLatex()}$ of the shortest sides: $${x.map((w) => `${k.toLatex()} \\cdot ${w}`).join(", \\; ")}$ give $${x.map((w) => k.mul(Q.of(w)).toLatex()).join(", ")}$, exactly the sides of $${tri(L2)}$.`,
                        `用最短边的比 $${k.toLatex()}$ 放缩 $${tri(L1)}$：$${x.map((w) => `${k.toLatex()} \\cdot ${w}`).join(", \\; ")}$ 得到 $${x.map((w) => k.mul(Q.of(w)).toLatex()).join(", ")}$，正是 $${tri(L2)}$ 的三边。`,
                      )
                    : t(
                        `Scale $${tri(L1)}$ by the factor $${k.toLatex()}$ of the shortest sides. The ${fails.map((i) => rank[i - 1]!.en).join(" and ")} side${fails.length > 1 ? "s" : ""} would become $${fails.map((i) => k.mul(Q.of(x[i]!)).toLatex()).join("$ and $")}$, but $${tri(L2)}$ has $${fails.map((i) => y[i]).join("$ and $")}$: no single factor works.`,
                        `用最短边的比 $${k.toLatex()}$ 放缩 $${tri(L1)}$。${fails.map((i) => rank[i - 1]!["zh-CN"]).join("和")}边应变成 $${fails.map((i) => k.mul(Q.of(x[i]!)).toLatex()).join("$ 和 $")}$，但 $${tri(L2)}$ 的是 $${fails.map((i) => y[i]).join("$ 和 $")}$：找不到同一个倍数。`,
                      ),
                ),
              ),
            }),
            figure: figure(
              base,
              `Triangle ${L1} with sides ${s1.join(", ")} and triangle ${L2} with sides ${s2.join(", ")}.`,
              `三角形 ${L1}，三边为 ${s1.join("、")}；三角形 ${L2}，三边为 ${s2.join("、")}。`,
            ),
            solutionFigures: [
              figure(
                [...base, ...bySize(p1, s1), ...bySize(p2, s2)],
                `The same triangles. ${sizeAlt[0]}`,
                `同样的两个三角形。${sizeAlt[1]}`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "matching-sides-and-the-scale-factor",
      figure: similarityDrawings["matching-sides-and-the-scale-factor"],
      title: t("Matching sides and the scale factor", "对应边与相似比"),
      explanation: t(
        "When two triangles are similar by SSS, the shortest side corresponds to the shortest side, the middle to the middle and the longest to the longest, wherever the sides are drawn. The scale factor is the common value of these ratios, image over original.\n\nIf $\\triangle ABC$ has sides $AB = 8$, $BC = 6$, $CA = 10$ and $\\triangle DEF$ has sides $DE = 9$, $EF = 15$, $FD = 12$, then $BC \\leftrightarrow DE$, $AB \\leftrightarrow FD$, $CA \\leftrightarrow EF$, and the scale factor from $\\triangle ABC$ to $\\triangle DEF$ is $9 \\div 6$, that is $\\frac{3}{2}$.\n\n> **Watch out.** Do not pair sides by their position in the drawing or by their letters: $DE : AB$, which is $9 : 8$, is not a ratio of corresponding sides. And keep the direction: from $\\triangle ABC$ to $\\triangle DEF$ the factor is $\\frac{3}{2}$, not $\\frac{2}{3}$.",
        "两个三角形由 SSS 相似时，无论边画在什么位置，最短边对应最短边，中间对应中间，最长对应最长。相似比就是这几个比的共同值，像比原图。\n\n若 $\\triangle ABC$ 的边为 $AB = 8$，$BC = 6$，$CA = 10$，$\\triangle DEF$ 的边为 $DE = 9$，$EF = 15$，$FD = 12$，则 $BC \\leftrightarrow DE$，$AB \\leftrightarrow FD$，$CA \\leftrightarrow EF$，从 $\\triangle ABC$ 到 $\\triangle DEF$ 的相似比为 $9 \\div 6$，即 $\\frac{3}{2}$。\n\n> **注意。** 不要按边在图中的位置或字母来配对：$DE : AB$（即 $9 : 8$）不是对应边的比。方向也要对：从 $\\triangle ABC$ 到 $\\triangle DEF$，相似比是 $\\frac{3}{2}$，不是 $\\frac{2}{3}$。",
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
        const [x, y] = [[...s1].sort((p, q) => p - q), [...s2].sort((p, q) => p - q)];
        const base = [...polyMarks(p1, L1, s1.map(String)), ...polyMarks(p2, L2, s2.map(String))];
        const first =
          fr(y[0]!, x[0]!) === `\\frac{${y[0]}}{${x[0]}}` ? `\\frac{${y[0]}}{${x[0]}}` : `\\frac{${y[0]}}{${x[0]}} = ${k.toLatex()}`;
        return {
          ...numberProblem({
            prompt: t(
              `The triangles are similar. Find the scale factor from $${tri(L1)}$ to $${tri(L2)}$.`,
              `这两个三角形相似。求从 $${tri(L1)}$ 到 $${tri(L2)}$ 的相似比。`,
            ),
            answer: k,
            form: "fraction",
            wrong: [Q.one.div(k), Q.of(s2[0], s1[0]), Q.of(s2[1], s1[1])],
            solution: paras(
              step(
                1,
                "match the sides by size",
                "按大小配对各边",
                t(
                  `From shortest to longest, $${tri(L1)}$ has $${x.join(", ")}$ and $${tri(L2)}$ has $${y.join(", ")}$. Corresponding sides have the same rank, drawn here in one color:\n\n{{figure 0}}`,
                  `从短到长，$${tri(L1)}$ 的边是 $${x.join(", ")}$，$${tri(L2)}$ 的边是 $${y.join(", ")}$。对应边名次相同，这里用同一种颜色画出：\n\n{{figure 0}}`,
                ),
              ),
              step(
                2,
                "divide image by original",
                "像比原图",
                t(
                  `The factor from $${tri(L1)}$ to $${tri(L2)}$ puts the side of $${tri(L2)}$ on top. With the shortest sides:${steps(first)}`,
                  `从 $${tri(L1)}$ 到 $${tri(L2)}$ 的相似比把 $${tri(L2)}$ 的边放在分子上。用最短边来算：${steps(first)}`,
                ),
              ),
              check(
                t(
                  `The other two pairs must give the same factor, and they do:${steps(sortedRatios(s1, s2))}The factor is ${sizeWord(k).en}; indeed $${tri(L2)}$ has the ${v > u ? "longer" : "shorter"} sides.`,
                  `另外两对边必须给出同一个相似比，确实如此：${steps(sortedRatios(s1, s2))}相似比${sizeWord(k)["zh-CN"]}，$${tri(L2)}$ 的边也确实${v > u ? "更长" : "更短"}。`,
                ),
              ),
            ),
          }),
          figure: figure(
            base,
            `Triangle ${L1} with sides ${s1.join(", ")} and triangle ${L2} with sides ${s2.join(", ")}.`,
            `三角形 ${L1}，三边为 ${s1.join("、")}；三角形 ${L2}，三边为 ${s2.join("、")}。`,
          ),
          solutionFigures: [
            figure([...base, ...bySize(p1, s1), ...bySize(p2, s2)], `The same triangles. ${sizeAlt[0]}`, `同样的两个三角形。${sizeAlt[1]}`),
          ],
        };
      },
    },
    {
      id: "finding-an-unknown-for-sss",
      figure: similarityDrawings["finding-an-unknown-for-sss"],
      title: t("Finding an unknown side", "求未知边"),
      explanation: t(
        "For two triangles to be similar by SSS, the unknown side must give the same ratio as the known pairs. Find the scale factor from a known pair, multiply to get the length the side must have, then solve for $x$.\n\n$\\triangle ABC$ has $AB = 4$, $BC = 5$, $CA = 6$, and $\\triangle DEF$ has $DE = 6$, $EF = 7.5$, $FD = 2x + 1$. The scale factor is $6 \\div 4 = \\frac{3}{2}$ (and $7.5 \\div 5$ agrees), so $FD$ must be $\\frac{3}{2} \\cdot 6 = 9$. Then $2x + 1 = 9$ and $x = 4$.\n\n> **Watch out.** The length $9$ is not the answer; it is what $2x + 1$ must equal. And set the expression equal to the scaled side, not to its partner $6$ in the other triangle.",
        "要使两个三角形由 SSS 相似，未知的边必须与已知的各对边有相同的比。先由一对已知边求出相似比，乘出这条边应有的长度，再解出 $x$。\n\n$\\triangle ABC$ 中 $AB = 4$，$BC = 5$，$CA = 6$；$\\triangle DEF$ 中 $DE = 6$，$EF = 7.5$，$FD = 2x + 1$。相似比为 $6 \\div 4 = \\frac{3}{2}$（$7.5 \\div 5$ 也一样），所以 $FD$ 必须等于 $\\frac{3}{2} \\cdot 6 = 9$。于是 $2x + 1 = 9$，$x = 4$。\n\n> **注意。** 长度 $9$ 不是答案，它是 $2x + 1$ 应该等于的值。还要让式子等于放缩后的边，而不是等于另一个三角形里的对应边 $6$。",
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
          const o = (j + 2) % 3;
          const sides1 = [0, 1, 2].map((k) => `${sideName(L1, k)} = ${sh[k]! * u}`).join(", \\; ");
          const sides2 = [0, 1, 2].map((k) => `${sideName(L2, k)} = ${k === j ? linear(c, d) : sh[k]! * v}`).join(", \\; ");
          const k = Q.of(v, u);
          const kLine =
            fr(sh[i]! * v, sh[i]! * u) === `\\frac{${sh[i]! * v}}{${sh[i]! * u}}`
              ? `k = \\frac{${sideName(L2, i)}}{${sideName(L1, i)}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}}`
              : `k = \\frac{${sideName(L2, i)}}{${sideName(L1, i)}} = \\frac{${sh[i]! * v}}{${sh[i]! * u}} = ${k.toLatex()}`;
          return numberProblem({
            prompt: t(
              `In $${tri(L1)}$, $${sides1}$. In $${tri(L2)}$, $${sides2}$. Find $x$ so that $${tri(L1)} \\sim ${tri(L2)}$.`,
              `在 $${tri(L1)}$ 中，$${sides1}$。在 $${tri(L2)}$ 中，$${sides2}$。求 $x$，使 $${tri(L1)} \\sim ${tri(L2)}$。`,
            ),
            answer: x,
            solveFor: "x",
            wrong: [target, Q.of(sh[j]! * u - d, c), Q.of(sh[j]! * u * u - d * v, c * v)],
            solution: paras(
              step(
                1,
                "find the scale factor",
                "求相似比",
                t(
                  `The statement pairs $\\overline{${sideName(L2, i)}}$ with $\\overline{${sideName(L1, i)}}$, both known:${steps(kLine)}`,
                  `相似式把 $\\overline{${sideName(L2, i)}}$ 与 $\\overline{${sideName(L1, i)}}$ 配对，两者都已知：${steps(kLine)}`,
                ),
              ),
              step(
                2,
                "solve for x",
                "解出 x",
                t(
                  `$\\overline{${sideName(L2, j)}}$ corresponds to $\\overline{${sideName(L1, j)}} = ${sh[j]! * u}$, so it must be $${k.toLatex()} \\cdot ${sh[j]! * u} = ${target}$:${steps(`${linear(c, d)} = ${target}`, `${linear(c, 0)} = ${target - d}`, `x = ${x}`)}`,
                  `$\\overline{${sideName(L2, j)}}$ 对应 $\\overline{${sideName(L1, j)}} = ${sh[j]! * u}$，所以它必须等于 $${k.toLatex()} \\cdot ${sh[j]! * u} = ${target}$：${steps(`${linear(c, d)} = ${target}`, `${linear(c, 0)} = ${target - d}`, `x = ${x}`)}`,
                ),
              ),
              check(
                t(
                  `With $x = ${x}$, $${sideName(L2, j)} = ${target}$. All three ratios now agree: $${sideName(L2, j)} : ${sideName(L1, j)}$ is $${target} : ${sh[j]! * u}$, $${sideName(L2, i)} : ${sideName(L1, i)}$ is $${sh[i]! * v} : ${sh[i]! * u}$ and $${sideName(L2, o)} : ${sideName(L1, o)}$ is $${sh[o]! * v} : ${sh[o]! * u}$, each equal to $${k.toLatex()}$.`,
                  `当 $x = ${x}$ 时，$${sideName(L2, j)} = ${target}$。三个比都一致：$${sideName(L2, j)} : ${sideName(L1, j)}$ 为 $${target} : ${sh[j]! * u}$，$${sideName(L2, i)} : ${sideName(L1, i)}$ 为 $${sh[i]! * v} : ${sh[i]! * u}$，$${sideName(L2, o)} : ${sideName(L1, o)}$ 为 $${sh[o]! * v} : ${sh[o]! * u}$，都等于 $${k.toLatex()}$。`,
                ),
              ),
            ),
          });
        }
      },
    },
  ],
};

// ─── 1.4.8 The SAS similarity criterion ─────────────────────────────────────

/** sasTones colors the two sides at vertex 0 of a triangle drawn by bySas: the shorter (side 0 on a tie) in the action color, the longer in the result color. */
const sasTones = (f: readonly Point[], p: number, q: number): Mark[] => [
  sideIn(f, 0, p <= q ? "action" : "result"),
  sideIn(f, 2, p <= q ? "result" : "action"),
];

/** sasIntroFigure shows sides 3 and 5 around 40° beside sides 6 and 10 around 40°, shorter and longer sides each in one color. */
const sasIntroFigure: Figure = (() => {
  const [f1, f2] = sideBySide(bySas(3, 5, 40), posed(bySas(6, 10, 40), { turn: 20, mirror: true }), 1.6);
  return figure(
    [
      ...polyMarks(f1, "ABC", ["3", null, "5"], ["40°", null, null]),
      ...polyMarks(f2, "DEF", ["6", null, "10"], ["40°", null, null]),
      ...sasTones(f1, 3, 5),
      ...sasTones(f2, 6, 10),
    ],
    "Triangle ABC with AB = 3 and AC = 5 around a 40° angle at A, and triangle DEF with DE = 6 and DF = 10 around a 40° angle at D. AB and DE share a color, and so do AC and DF.",
    "三角形 ABC：A 处 40° 角的两边 AB = 3，AC = 5；三角形 DEF：D 处 40° 角的两边 DE = 6，DF = 10。AB 与 DE 同色，AC 与 DF 同色。",
  );
})();

export const theSASSimilarityCriterion: TopicDef = {
  id: "the-sas-similarity-criterion",
  title: t("The SAS Similarity Criterion", "SAS 相似判定"),
  summary: t(
    "Show that triangles are similar from two proportional sides and the congruent angles between them, including triangles that share an angle.",
    "由两边成比例且夹角相等判定三角形相似，包括有公共角的三角形。",
  ),
  prerequisites: ["the-aa-similarity-criterion", "the-sss-similarity-criterion"],
  encompasses: [{ topic: "proportions", weight: 0.3 }],
  xp: 13,
  standards: ["CCSS.HSG.SRT.B.5"],
  intro: t(
    "AA uses two angles and SSS uses three sides. The third shortcut mixes them: two sides in proportion and the angle they enclose.\n\nTake $\\triangle ABC$ with $AB = 3$, $AC = 5$ and $m\\angle A = 40^\\circ$, and $\\triangle DEF$ with $DE = 6$, $DF = 10$ and $m\\angle D = 40^\\circ$. The sides around the angle are in the same ratio, $6 \\div 3 = 2$ and $10 \\div 5 = 2$, and the angles between them are equal.\n\n{{figure 0}}\n\nDilate $\\triangle ABC$ by $2$: the copy has sides $6$ and $10$ around a $40^\\circ$ angle, the same as $\\triangle DEF$, so by SAS congruence the copy is congruent to $\\triangle DEF$. Hence $\\triangle ABC \\sim \\triangle DEF$. This is the **SAS similarity criterion**. The angle must be the one **between** the two sides; an angle elsewhere does not pin the triangle down. In this lesson we check SAS, apply it to triangles that share an angle, and find an unknown that makes it hold.",
    "AA 用两个角，SSS 用三条边。第三条捷径把两者结合起来：两边成比例，以及它们所夹的角。\n\n取 $\\triangle ABC$，$AB = 3$，$AC = 5$，$m\\angle A = 40^\\circ$；再取 $\\triangle DEF$，$DE = 6$，$DF = 10$，$m\\angle D = 40^\\circ$。夹角的两边比相同：$6 \\div 3 = 2$，$10 \\div 5 = 2$，而且它们的夹角相等。\n\n{{figure 0}}\n\n把 $\\triangle ABC$ 放大 $2$ 倍：所得三角形中，$40^\\circ$ 角的两边为 $6$ 和 $10$，与 $\\triangle DEF$ 相同，所以由 SAS 全等判定，它与 $\\triangle DEF$ 全等。因此 $\\triangle ABC \\sim \\triangle DEF$。这就是 **SAS 相似判定**。这个角必须是两边的**夹角**；别处的角确定不了三角形。这节课我们检验 SAS，把它用于有公共角的三角形，并求使它成立的未知数。",
  ),
  introFigures: [sasIntroFigure],
  knowledgePoints: [
    {
      id: "checking-sas",
      figure: similarityDrawings["checking-sas"],
      title: t("Two sides and the included angle", "两边及其夹角"),
      explanation: t(
        `**SAS similarity criterion:** if two sides of one triangle are proportional to two sides of another and the angles **between** those sides are congruent, the triangles are similar. Both parts are needed: the angle fixes the shape of the corner, and the ratio makes both arms grow by the same factor.\n\nSides $4$ and $6$ with $50^\\circ$ between them, and sides $6$ and $9$ with $50^\\circ$ between them: pairing shorter with shorter,${steps("\\frac{6}{4} = \\frac{3}{2}, \\quad \\frac{9}{6} = \\frac{3}{2}")}and the included angles match, so the triangles are similar. If the angles were $50^\\circ$ and $55^\\circ$, or the sides $6$ and $10$, they would not be.\n\n> **Watch out.** Congruent angles alone do not settle it; the sides around them must be proportional too. And proportional sides alone do not either, unless the angles between them match.`,
        `**SAS 相似判定**：如果一个三角形的两边与另一个三角形的两边成比例，并且这两边的**夹角**相等，那么这两个三角形相似。两个条件缺一不可：角确定了这个角落的形状，比相同保证两条边按同一个倍数伸长。\n\n两边 $4$、$6$ 夹 $50^\\circ$，与两边 $6$、$9$ 夹 $50^\\circ$：短边比短边、长边比长边，${steps("\\frac{6}{4} = \\frac{3}{2}, \\quad \\frac{9}{6} = \\frac{3}{2}")}夹角也相等，所以相似。如果夹角是 $50^\\circ$ 和 $55^\\circ$，或者两边是 $6$ 和 $10$，就不相似。\n\n> **注意。** 只有角相等不能下结论，夹这个角的两边还必须成比例。只有两边成比例也不行，除非它们的夹角相等。`,
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
          const sameRatio = lo2 * hi1 === hi2 * lo1;
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
          const proportional = t(
            "Yes, because the sides next to the marked angles are proportional and those angles are congruent",
            "是，因为标出角的两边成比例，并且这两个角相等",
          );
          const anglesDiffer = t("No, because the marked angles are not congruent", "否，因为标出的两个角不相等");
          const sidesDiffer = t("No, because the sides next to the marked angles are not proportional", "否，因为标出角的两边不成比例");
          const angleOnly = t(
            "Yes, because the marked angles are congruent, so the sides need no checking",
            "是，因为标出的两个角相等，所以不必检查边",
          );
          const base = [
            ...polyMarks(f1, L1, [String(p1), null, String(q1)], [deg(theta), null, null]),
            ...polyMarks(f2, L2, [String(p2), null, String(q2)], [deg(th2), null, null]),
          ];
          const problem = reasonChoice(rng, {
            prompt: t(`Is $${tri(L1)}$ similar to $${tri(L2)}$?`, `$${tri(L1)}$ 与 $${tri(L2)}$ 相似吗？`),
            correct: similar ? proportional : th2 !== theta ? anglesDiffer : sidesDiffer,
            wrong: [proportional, anglesDiffer, sidesDiffer, angleOnly],
            solution: paras(
              step(
                1,
                "look at the included angles",
                "看夹角",
                t(
                  `The marked angles sit between the two labeled sides of each triangle, so they are the included angles: $${theta}^\\circ$ at $${L1[0]}$ and $${th2}^\\circ$ at $${L2[0]}$. ${th2 === theta ? "They are congruent." : "They are not congruent."}`,
                  `标出的角都夹在每个三角形两条已标边之间，所以是夹角：$${L1[0]}$ 处 $${theta}^\\circ$，$${L2[0]}$ 处 $${th2}^\\circ$。${th2 === theta ? "它们相等。" : "它们不相等。"}`,
                ),
              ),
              step(
                2,
                "compare the sides around them",
                "比较夹角的两边",
                t(
                  `Shorter sides share one color and longer sides another:\n\n{{figure 0}}\n\nDivide shorter by shorter and longer by longer:${steps(ratios)}${reason.en}`,
                  `短边同一种颜色，长边另一种颜色：\n\n{{figure 0}}\n\n短边比短边，长边比长边：${steps(ratios)}${reason["zh-CN"]}`,
                ),
              ),
              check(
                sameRatio
                  ? t(
                      `Cross-multiply the ratios: $${lo2} \\cdot ${hi1} = ${lo2 * hi1}$ and $${hi2} \\cdot ${lo1} = ${hi2 * lo1}$, equal, so the sides are proportional${th2 === theta ? " and both parts of SAS hold" : "; only the angle fails"}.`,
                      `把两个比交叉相乘：$${lo2} \\cdot ${hi1} = ${lo2 * hi1}$，$${hi2} \\cdot ${lo1} = ${hi2 * lo1}$，相等，所以两边成比例${th2 === theta ? "，SAS 的两个条件都成立" : "；只有角不满足"}。`,
                    )
                  : t(
                      `Cross-multiply the ratios: $${lo2} \\cdot ${hi1} = ${lo2 * hi1}$ but $${hi2} \\cdot ${lo1} = ${hi2 * lo1}$, so the sides are not proportional${th2 === theta ? ", whatever the angle" : " either"}.`,
                      `把两个比交叉相乘：$${lo2} \\cdot ${hi1} = ${lo2 * hi1}$，而 $${hi2} \\cdot ${lo1} = ${hi2 * lo1}$，所以两边${th2 === theta ? "不成比例，角再相等也没用" : "也不成比例"}。`,
                    ),
              ),
            ),
          });
          const ratioWords = t(
            `the ratios are $${fr(lo2, lo1)}$ and $${fr(hi2, hi1)}$`,
            `两个比分别是 $${fr(lo2, lo1)}$ 和 $${fr(hi2, hi1)}$`,
          );
          return {
            ...reasoned(problem, [
              th2 !== theta
                ? [
                    proportional.en,
                    `the marked angles are $${theta}^\\circ$ and $${th2}^\\circ$, not congruent.`,
                    `标出的角是 $${theta}^\\circ$ 和 $${th2}^\\circ$，并不相等。`,
                  ]
                : [proportional.en, `${ratioWords.en}, not equal.`, `${ratioWords["zh-CN"]}，并不相等。`],
              [anglesDiffer.en, `both marked angles are $${theta}^\\circ$.`, `标出的两个角都是 $${theta}^\\circ$。`],
              [sidesDiffer.en, `both ratios are $${fr(lo2, lo1)}$.`, `两个比都是 $${fr(lo2, lo1)}$。`],
              [
                angleOnly.en,
                "one pair of congruent angles does not decide similarity; SAS also needs the sides around the angles to be proportional.",
                "一组角相等不能判定相似；SAS 还要求夹这个角的两边成比例。",
              ],
            ]),
            figure: figure(
              base,
              `Triangle ${L1} with sides ${p1} and ${q1} and the angle ${theta}° between them at ${L1[0]}; triangle ${L2} with sides ${p2} and ${q2} and the angle ${th2}° between them at ${L2[0]}.`,
              `三角形 ${L1}，两边 ${p1}、${q1}，在 ${L1[0]} 处夹角 ${theta}°；三角形 ${L2}，两边 ${p2}、${q2}，在 ${L2[0]} 处夹角 ${th2}°。`,
            ),
            solutionFigures: [
              figure(
                [...base, ...sasTones(f1, p1, q1), ...sasTones(f2, p2, q2)],
                `The same triangles with the shorter sides around the marked angles in one color and the longer sides in another.`,
                `同样的两个三角形：标出角的两边中，短边用一种颜色，长边用另一种颜色。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "triangles-sharing-an-angle",
      figure: similarityDrawings["triangles-sharing-an-angle"],
      title: t("Triangles sharing an angle", "有公共角的三角形"),
      explanation: t(
        `Two triangles that share an angle have the included angle congruent for free, so they are similar by SAS as soon as the sides along that angle are proportional. The work is to see which sides pair up. With $D$ on $\\overline{AB}$ and $E$ on $\\overline{AC}$:\n\n- if $AD : AB$ equals $AE : AC$, then $\\triangle ADE \\sim \\triangle ABC$;\n- if $AD : AC$ equals $AE : AB$, then $\\triangle ADE \\sim \\triangle ACB$, so $D$ matches $C$ and $E$ matches $B$.\n\nWith $AD = 3$, $AE = 4$, $AB = 8$, $AC = 6$ and $BC = 10$:${steps("\\frac{AD}{AC} = \\frac{3}{6} = \\frac{1}{2}, \\quad \\frac{AE}{AB} = \\frac{4}{8} = \\frac{1}{2}")}so $\\triangle ADE \\sim \\triangle ACB$ and $DE = \\frac{1}{2} \\cdot 10 = 5$.\n\n> **Watch out.** Do not assume $AD$ pairs with $AB$ because $D$ lies on $\\overline{AB}$. Here $AD : AB$ is $3 : 8$ and $AE : AC$ is $4 : 6$, which differ; try the crossed pairing before giving up.`,
        `有公共角的两个三角形，夹角自然相等，所以只要夹这个角的两边成比例，就由 SAS 相似。要做的是看清哪两条边对应。设 $D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上：\n\n- 若 $AD : AB$ 等于 $AE : AC$，则 $\\triangle ADE \\sim \\triangle ABC$；\n- 若 $AD : AC$ 等于 $AE : AB$，则 $\\triangle ADE \\sim \\triangle ACB$，即 $D$ 对应 $C$，$E$ 对应 $B$。\n\n当 $AD = 3$，$AE = 4$，$AB = 8$，$AC = 6$，$BC = 10$ 时：${steps("\\frac{AD}{AC} = \\frac{3}{6} = \\frac{1}{2}, \\quad \\frac{AE}{AB} = \\frac{4}{8} = \\frac{1}{2}")}所以 $\\triangle ADE \\sim \\triangle ACB$，$DE = \\frac{1}{2} \\cdot 10 = 5$。\n\n> **注意。** 不要因为 $D$ 在 $\\overline{AB}$ 上，就认定 $AD$ 与 $AB$ 对应。这里 $AD : AB$ 是 $3 : 8$，$AE : AC$ 是 $4 : 6$，并不相等；放弃之前先试试交叉配对。`,
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
          const base: Mark[] = [
            { kind: "polygon", points: [qa, qb, qc] },
            { kind: "segment", a: qd, b: qe, accent: true },
            { kind: "arc", vertex: qa, from: qb, to: qc },
            ...names([qa, qb, qc, qd, qe], `${A}${B}${C}${D}${E}`, center([qa, qb, qc])),
          ];
          const fig = figure(
            base,
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
          // The partner of AE in the large triangle, used by the check.
          const [partnerE, partnerEName] = reversed ? [AB, `${A}${B}`] : [CA, `${A}${C}`];
          const [partnerD, partnerDName] = reversed ? [CA, `${A}${C}`] : [AB, `${A}${B}`];
          // Each short side shares a color with its partner along the shared angle.
          const tones: Mark[] = reversed
            ? [
                { kind: "segment", a: qa, b: qd, tone: "action" },
                { kind: "segment", a: qa, b: qc, tone: "action" },
                { kind: "segment", a: qa, b: qe, tone: "result" },
                { kind: "segment", a: qa, b: qb, tone: "result" },
              ]
            : [
                { kind: "segment", a: qa, b: qb, tone: "action" },
                { kind: "segment", a: qa, b: qd, tone: "action" },
                { kind: "segment", a: qa, b: qc, tone: "result" },
                { kind: "segment", a: qa, b: qe, tone: "result" },
              ];
          return {
            ...numberProblem({
              prompt: t(`In the figure, $${facts}$. Find $${D}${E}$.`, `如图，$${facts}$。求 $${D}${E}$。`),
              answer: DE,
              wrong: [Q.of(BC * AD, AB), Q.of(BC * AE, AB), Q.of(BC * AD, CA)],
              solution: paras(
                step(
                  1,
                  "pair the sides along the shared angle",
                  "配对公共角的两边",
                  t(
                    `$\\triangle ${A}${D}${E}$ and $\\triangle ${A}${B}${C}$ share $\\angle ${A}$, the included angle of both. ${reversed ? `Pairing $${A}${D}$ with $${A}${B}$ fails, since $${AD} : ${AB}$ and $${AE} : ${CA}$ differ; the crossed pairing works:` : "Pair each short side with the long side on the same ray:"}${steps(ratios)}{{figure 0}}`,
                    `$\\triangle ${A}${D}${E}$ 与 $\\triangle ${A}${B}${C}$ 有公共角 $\\angle ${A}$，它是两个三角形的夹角。${reversed ? `把 $${A}${D}$ 与 $${A}${B}$ 配对不行，因为 $${AD} : ${AB}$ 与 $${AE} : ${CA}$ 不相等；交叉配对才成立：` : "把每条短边与同一条射线上的长边配对："}${steps(ratios)}{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "use the similarity",
                  "利用相似",
                  t(
                    `So $${statement}$ by SAS, with scale factor $${k.toLatex()}$ from the large triangle to the small one. $\\overline{${D}${E}}$ corresponds to $\\overline{${B}${C}}$:${steps(`${D}${E} = ${k.toLatex()} \\cdot ${BC} = ${DE}`)}`,
                    `所以由 SAS，$${statement}$，从大三角形到小三角形的相似比为 $${k.toLatex()}$。$\\overline{${D}${E}}$ 对应 $\\overline{${B}${C}}$：${steps(`${D}${E} = ${k.toLatex()} \\cdot ${BC} = ${DE}`)}`,
                  ),
                ),
                check(
                  t(
                    `Work from the other pair instead: $${A}${E} : ${partnerEName}$ is $${AE} : ${partnerE}$, so $${D}${E} = \\frac{${AE}}{${partnerE}} \\cdot ${BC} = ${DE}$ again; and $${DE} : ${BC}$ reduces to $${k.toLatex()}$ like $${AD} : ${partnerD}$ (that is, $${A}${D} : ${partnerDName}$).`,
                    `改用另一对边来算：$${A}${E} : ${partnerEName}$ 为 $${AE} : ${partnerE}$，所以 $${D}${E} = \\frac{${AE}}{${partnerE}} \\cdot ${BC} = ${DE}$，结果相同；而且 $${DE} : ${BC}$ 和 $${AD} : ${partnerD}$（即 $${A}${D} : ${partnerDName}$）一样，都化成 $${k.toLatex()}$。`,
                  ),
                ),
              ),
            }),
            figure: fig,
            solutionFigures: [
              figure(
                [...base, ...tones],
                `The same figure with ${A}${D} and ${partnerDName} in one color and ${A}${E} and ${partnerEName} in another.`,
                `同样的图形：${A}${D} 与 ${partnerDName} 用一种颜色，${A}${E} 与 ${partnerEName} 用另一种颜色。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "finding-an-unknown-for-sas",
      figure: similarityDrawings["finding-an-unknown-for-sas"],
      title: t("Finding an unknown for SAS", "用 SAS 求未知数"),
      explanation: t(
        `When the included angles are congruent, the triangles are similar exactly when the two pairs of sides have the same ratio. Set the ratios equal and solve.\n\nWith $\\angle A \\cong \\angle D$, $AB = 6$, $AC = 8$, $DE = 9$ and $DF = x + 5$:${steps("\\frac{x + 5}{8} = \\frac{9}{6} \\quad\\Rightarrow\\quad x + 5 = \\frac{9}{6} \\cdot 8 = 12 \\quad\\Rightarrow\\quad x = 7")}Then $DF = 12$, and $12 : 8$ and $9 : 6$ both reduce to $3 : 2$.\n\n> **Watch out.** The proportion gives $DF = 12$, not $x$; finish by solving $x + 5 = 12$. And set $x + 5$ equal to the scaled side $12$, not to its partner $8$.`,
        `当夹角相等时，两三角形相似当且仅当两组边的比相等。令两个比相等，再解方程。\n\n若 $\\angle A \\cong \\angle D$，$AB = 6$，$AC = 8$，$DE = 9$，$DF = x + 5$：${steps("\\frac{x + 5}{8} = \\frac{9}{6} \\quad\\Rightarrow\\quad x + 5 = \\frac{9}{6} \\cdot 8 = 12 \\quad\\Rightarrow\\quad x = 7")}于是 $DF = 12$，$12 : 8$ 与 $9 : 6$ 都化成 $3 : 2$。\n\n> **注意。** 比例式求出的是 $DF = 12$，不是 $x$；还要解 $x + 5 = 12$。并且要让 $x + 5$ 等于放缩后的边 $12$，而不是等于它的对应边 $8$。`,
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
          const base = [
            ...polyMarks(f1, L1, [String(p * u), null, String(q * u)], [deg, null, null]),
            ...polyMarks(f2, L2, [String(p * v), null, plain(c, d)], [deg, null, null]),
          ];
          const solveLines = c === 1 ? [`x = ${x}`] : [`${linear(c, 0)} = ${target - d}`, `x = ${x}`];
          return {
            ...numberProblem({
              prompt: t(`Find $x$ so that $${tri(L1)} \\sim ${tri(L2)}$.`, `求 $x$，使 $${tri(L1)} \\sim ${tri(L2)}$。`),
              answer: x,
              solveFor: "x",
              wrong: [target, Q.of(q * u - d, c), Q.of(p * u * u - d * v, c * v)],
              solution: paras(
                step(
                  1,
                  "set up the proportion",
                  "列比例式",
                  t(
                    `The included angles at $${L1[0]}$ and $${L2[0]}$ are both $${theta}^\\circ$, so by SAS the triangles are similar exactly when the sides around them are proportional. The pairs are drawn in matching colors:\n\n{{figure 0}}${steps(prop(linear(c, d), String(q * u), String(p * v), String(p * u)), `${linear(c, d)} = ${k.toLatex()} \\cdot ${q * u} = ${target}`)}`,
                    `$${L1[0]}$ 与 $${L2[0]}$ 处的夹角都是 $${theta}^\\circ$，所以由 SAS，两三角形相似当且仅当夹角的两边成比例。对应的边用相同的颜色画出：\n\n{{figure 0}}${steps(prop(linear(c, d), String(q * u), String(p * v), String(p * u)), `${linear(c, d)} = ${k.toLatex()} \\cdot ${q * u} = ${target}`)}`,
                  ),
                ),
                step(
                  2,
                  "solve for x",
                  "解出 x",
                  t(
                    `${d > 0 ? `Subtract $${d}$` : `Add $${-d}$`}${c === 1 ? "" : `, then divide by $${c}$`}:${steps(...solveLines)}`,
                    `${d > 0 ? `减去 $${d}$` : `加上 $${-d}$`}${c === 1 ? "" : `，再除以 $${c}$`}：${steps(...solveLines)}`,
                  ),
                ),
                check(
                  t(
                    `With $x = ${x}$ the side is $${target}$. Cross-multiply the proportion: $${target} \\cdot ${p * u} = ${target * p * u}$ and $${p * v} \\cdot ${q * u} = ${p * v * q * u}$, equal, so the sides around the $${theta}^\\circ$ angles are proportional.`,
                    `当 $x = ${x}$ 时，这条边是 $${target}$。把比例式交叉相乘：$${target} \\cdot ${p * u} = ${target * p * u}$，$${p * v} \\cdot ${q * u} = ${p * v * q * u}$，相等，所以 $${theta}^\\circ$ 角的两边成比例。`,
                  ),
                ),
              ),
            }),
            figure: figure(
              base,
              `Triangle ${L1} with sides ${p * u} and ${q * u} around the ${theta}° angle at ${L1[0]}; triangle ${L2} with sides ${p * v} and ${plain(c, d)} around the ${theta}° angle at ${L2[0]}.`,
              `三角形 ${L1}，${L1[0]} 处 ${theta}° 角的两边为 ${p * u}、${q * u}；三角形 ${L2}，${L2[0]} 处 ${theta}° 角的两边为 ${p * v}、${plain(c, d)}。`,
            ),
            solutionFigures: [
              figure(
                [...base, sideIn(f1, 0, "action"), sideIn(f2, 0, "action"), sideIn(f1, 2, "result"), sideIn(f2, 2, "result")],
                `The same triangles: the sides ${p * u} and ${p * v} in one color, ${q * u} and ${plain(c, d)} in another.`,
                `同样的两个三角形：边 ${p * u} 与 ${p * v} 用一种颜色，${q * u} 与 ${plain(c, d)} 用另一种颜色。`,
              ),
            ],
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
    { topic: "the-aa-similarity-criterion", weight: 0.3 },
    { topic: "the-sas-similarity-criterion", weight: 0.3 },
    { topic: "the-sss-similarity-criterion", weight: 0.2 },
    { topic: "proportions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.B.5"],
  intro: t(
    "We now have three ways to prove triangles similar: AA, SSS and SAS. In a real problem nobody says which one to use; we look at what is known and pick the criterion whose parts are all there. Often the parts come from the figure itself: vertical angles, parallel lines, a shared angle or right angles.\n\nSay $\\triangle PQR$ has $PQ = 4$, $PR = 6$ and $m\\angle P = 30^\\circ$, and $\\triangle XYZ$ has $XY = 6$, $XZ = 9$ and $m\\angle X = 30^\\circ$. Only one pair of angles is known, so AA is out; the third sides are unknown, so SSS is out. But $6 \\div 4 = 1.5$ and $9 \\div 6 = 1.5$, and the $30^\\circ$ angles sit between those sides, so SAS proves $\\triangle PQR \\sim \\triangle XYZ$.\n\nIn this lesson we choose criteria, and use them on two classic figures: segments that cross between parallel lines, and shadows cast at the same moment.",
    "我们已经有三种证明三角形相似的方法：AA、SSS 和 SAS。实际问题不会告诉我们用哪一种；要看已知什么，选出各个条件都齐全的那种判定。这些条件常常来自图形本身：对顶角、平行线、公共角或直角。\n\n设 $\\triangle PQR$ 中 $PQ = 4$，$PR = 6$，$m\\angle P = 30^\\circ$；$\\triangle XYZ$ 中 $XY = 6$，$XZ = 9$，$m\\angle X = 30^\\circ$。只知道一组角，所以不能用 AA；第三边不知道，所以不能用 SSS。但 $6 \\div 4 = 1.5$，$9 \\div 6 = 1.5$，而且两个 $30^\\circ$ 角都是这两边的夹角，所以由 SAS，$\\triangle PQR \\sim \\triangle XYZ$。\n\n这节课我们选择判定方法，并把它们用在两种经典图形上：平行线之间交叉的线段，以及同一时刻的影子。",
  ),
  knowledgePoints: [
    {
      id: "choosing-a-criterion",
      figure: geometryDrawings2["combining-similarity-criteria-for-triangles#choosing-a-criterion"],
      title: t("Choosing a criterion", "选择判定方法"),
      explanation: t(
        "Three criteria prove triangles similar:\n\n- **AA**: two pairs of congruent angles;\n- **SSS**: all three pairs of sides proportional;\n- **SAS**: two pairs of sides proportional and the angles **between** them congruent.\n\nSort the facts into angles and sides, then see which list is complete. With $m\\angle A = m\\angle D = 70^\\circ$ and $m\\angle B = m\\angle E = 45^\\circ$, two angle pairs give AA at once; with $AB : DE$ and $AC : DF$ both $2 : 3$ and $\\angle A \\cong \\angle D$, the angle lies between the sides, so SAS.\n\n> **Watch out.** One pair of angles, or two pairs of proportional sides alone, prove nothing. Nor do two proportional sides with a congruent angle that is **not** between them (SSA): there may be two different triangles with those parts.",
        "证明三角形相似有三种判定方法：\n\n- **AA**：两组对应角相等；\n- **SSS**：三组对应边成比例；\n- **SAS**：两组对应边成比例，且它们的**夹角**相等。\n\n先把已知条件分成角和边，再看哪一种判定的条件齐全。若 $m\\angle A = m\\angle D = 70^\\circ$，$m\\angle B = m\\angle E = 45^\\circ$，两组角相等，直接用 AA；若 $AB : DE$ 与 $AC : DF$ 都是 $2 : 3$，且 $\\angle A \\cong \\angle D$，这个角是两边的夹角，所以用 SAS。\n\n> **注意。** 只有一组角相等，或者只有两组边成比例，都证明不了什么。两组边成比例而相等的角**不是**夹角（SSA）也不行：具有这些条件的三角形可能有两种不同的形状。",
      ),
      generate(rng) {
        const [A, B, C, D, E, F] = rng.pick(sixLetters).split("") as [string, string, string, string, string, string];
        const kind = rng.int(0, 5);
        const [a, b] = rng.pick(scales);
        const [u, v] = rng.bool() ? [a, b] : [b, a];
        const sh = pickShape(rng);
        const angle = rng.int(35, 110);
        const k = fr(v, u);
        let facts: string;
        let correct: number;
        let sorted: Text;
        let why: Text;
        let parts: Text;
        let reasons: [string, string][];
        if (kind === 0) {
          const x = rng.int(30, 75);
          const y = rng.int(30, 75);
          const z = 180 - x - y;
          const third = rng.bool();
          facts = third
            ? `m\\angle ${A} = ${x}^\\circ, \\; m\\angle ${B} = ${y}^\\circ, \\; m\\angle ${D} = ${x}^\\circ, \\; m\\angle ${F} = ${z}^\\circ`
            : `m\\angle ${A} = m\\angle ${D} = ${x}^\\circ, \\; m\\angle ${B} = m\\angle ${E} = ${y}^\\circ`;
          correct = 0;
          sorted = t(
            `The facts are all angles, ${third ? "two in each triangle, at vertices that do not all correspond" : "two pairs of corresponding angles"}; no side is given.`,
            `已知的都是角，${third ? "每个三角形两个，但所在顶点不全对应" : "两组对应角"}；没有给出边。`,
          );
          why = third
            ? t(
                `The third angle of $\\triangle ${A}${B}${C}$ is $m\\angle ${C} = 180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ$, the same as $m\\angle ${F}$, and $\\angle ${A} \\cong \\angle ${D}$: two pairs of congruent angles, so AA.`,
                `$\\triangle ${A}${B}${C}$ 的第三个角 $m\\angle ${C} = 180^\\circ - ${x}^\\circ - ${y}^\\circ = ${z}^\\circ$，与 $m\\angle ${F}$ 相同，且 $\\angle ${A} \\cong \\angle ${D}$：两组角相等，所以用 AA。`,
              )
            : t("Two pairs of congruent angles are exactly what AA asks for.", "两组角相等，正是 AA 所要求的。");
          parts = third
            ? t(
                `AA needs two angle pairs: $\\angle ${A} \\cong \\angle ${D}$ (given, $${x}^\\circ$) and $\\angle ${C} \\cong \\angle ${F}$ (both $${z}^\\circ$, from the angle sum).`,
                `AA 需要两组角：$\\angle ${A} \\cong \\angle ${D}$（已知，$${x}^\\circ$），以及 $\\angle ${C} \\cong \\angle ${F}$（由内角和，都是 $${z}^\\circ$）。`,
              )
            : t(
                `AA needs two angle pairs: $\\angle ${A} \\cong \\angle ${D}$ ($${x}^\\circ$) and $\\angle ${B} \\cong \\angle ${E}$ ($${y}^\\circ$), both given.`,
                `AA 需要两组角：$\\angle ${A} \\cong \\angle ${D}$（$${x}^\\circ$）和 $\\angle ${B} \\cong \\angle ${E}$（$${y}^\\circ$），都已给出。`,
              );
          reasons = [
            ["no side lengths are given, so no ratios of sides can be checked.", "没有给出边长，无法检查边的比。"],
            ["no side lengths are given, so no ratios of sides can be checked.", "没有给出边长，无法检查边的比。"],
            ["two pairs of congruent angles are enough: that is AA.", "两组角相等就够了：这就是 AA。"],
          ];
        } else if (kind === 1) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${B}${C} = ${sh[1] * u}, \\; ${C}${A} = ${sh[2] * u}, \\; ${D}${E} = ${sh[0] * v}, \\; ${E}${F} = ${sh[1] * v}, \\; ${F}${D} = ${sh[2] * v}`;
          correct = 1;
          sorted = t(
            "The facts are all sides: all three sides of each triangle, and no angles.",
            "已知的都是边：每个三角形的三条边都给出了，没有角。",
          );
          why = t(
            `Divide each side of $\\triangle ${D}${E}${F}$ by its partner:${steps(`\\frac{${D}${E}}{${A}${B}} = \\frac{${sh[0] * v}}{${sh[0] * u}}, \\quad \\frac{${E}${F}}{${B}${C}} = \\frac{${sh[1] * v}}{${sh[1] * u}}, \\quad \\frac{${F}${D}}{${C}${A}} = \\frac{${sh[2] * v}}{${sh[2] * u}}`)}All three equal $${k}$, so SSS.`,
            `用 $\\triangle ${D}${E}${F}$ 的每条边除以对应边：${steps(`\\frac{${D}${E}}{${A}${B}} = \\frac{${sh[0] * v}}{${sh[0] * u}}, \\quad \\frac{${E}${F}}{${B}${C}} = \\frac{${sh[1] * v}}{${sh[1] * u}}, \\quad \\frac{${F}${D}}{${C}${A}} = \\frac{${sh[2] * v}}{${sh[2] * u}}`)}三个比都等于 $${k}$，所以用 SSS。`,
          );
          parts = t(
            `SSS needs three proportional pairs: $${D}${E} : ${A}${B}$, $${E}${F} : ${B}${C}$ and $${F}${D} : ${C}${A}$, each $${k}$. For instance $${k} \\cdot ${sh[1] * u} = ${sh[1] * v}$, which is $${E}${F}$.`,
            `SSS 需要三组边成比例：$${D}${E} : ${A}${B}$、$${E}${F} : ${B}${C}$、$${F}${D} : ${C}${A}$，都是 $${k}$。例如 $${k} \\cdot ${sh[1] * u} = ${sh[1] * v}$，正是 $${E}${F}$。`,
          );
          reasons = [
            ["no angles are given, and AA needs two pairs of them.", "没有给出角，而 AA 需要两组角。"],
            ["no angle is given; here all three side ratios are known, which is SSS.", "没有给出角；这里三组边的比都已知，用的是 SSS。"],
            ["all three side ratios are equal, which is enough for SSS.", "三组边的比都相等，足以用 SSS。"],
          ];
        } else if (kind === 2) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${A}${C} = ${sh[2] * u}, \\; m\\angle ${A} = ${angle}^\\circ, \\; ${D}${E} = ${sh[0] * v}, \\; ${D}${F} = ${sh[2] * v}, \\; m\\angle ${D} = ${angle}^\\circ`;
          correct = 2;
          sorted = t(
            "Each triangle has two sides and one angle given; the angle is at the vertex where those two sides meet.",
            "每个三角形给出两条边和一个角；这个角就在两边相交的顶点处。",
          );
          why = t(
            `The sides are proportional:${steps(`\\frac{${D}${E}}{${A}${B}} = \\frac{${sh[0] * v}}{${sh[0] * u}} = ${k}, \\quad \\frac{${D}${F}}{${A}${C}} = \\frac{${sh[2] * v}}{${sh[2] * u}} = ${k}`)}and $\\angle ${A}$, $\\angle ${D}$ lie between these sides: SAS.`,
            `两边成比例：${steps(`\\frac{${D}${E}}{${A}${B}} = \\frac{${sh[0] * v}}{${sh[0] * u}} = ${k}, \\quad \\frac{${D}${F}}{${A}${C}} = \\frac{${sh[2] * v}}{${sh[2] * u}} = ${k}`)}并且 $\\angle ${A}$、$\\angle ${D}$ 是这两边的夹角：SAS。`,
          );
          parts = t(
            `SAS needs two proportional pairs, $${D}${E} : ${A}${B}$ and $${D}${F} : ${A}${C}$ (both $${k}$), and the angles between them, $\\angle ${A} \\cong \\angle ${D}$ (both $${angle}^\\circ$). All three parts are given.`,
            `SAS 需要两组成比例的边 $${D}${E} : ${A}${B}$ 与 $${D}${F} : ${A}${C}$（都是 $${k}$），以及它们的夹角 $\\angle ${A} \\cong \\angle ${D}$（都是 $${angle}^\\circ$）。三个条件都已给出。`,
          );
          reasons = [
            ["only one pair of angles is given, and AA needs two.", "只给出一组角，而 AA 需要两组。"],
            [
              `only two pairs of sides are known; the third sides $${B}${C}$ and $${E}${F}$ are not.`,
              `只知道两组边，第三边 $${B}${C}$ 与 $${E}${F}$ 不知道。`,
            ],
            ["the congruent angles lie between the proportional sides, which is SAS.", "相等的角正是成比例两边的夹角，可以用 SAS。"],
          ];
        } else if (kind === 3) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${B}${C} = ${sh[1] * u}, \\; m\\angle ${A} = ${angle}^\\circ, \\; ${D}${E} = ${sh[0] * v}, \\; ${E}${F} = ${sh[1] * v}, \\; m\\angle ${D} = ${angle}^\\circ`;
          correct = 3;
          sorted = t(
            `Each triangle has two sides and one angle given, but the angle is at $${A}$ (and $${D}$), while the two sides meet at $${B}$ (and $${E}$).`,
            `每个三角形给出两条边和一个角，但角在 $${A}$（和 $${D}$）处，而两条边相交于 $${B}$（和 $${E}$）。`,
          );
          why = t(
            `The sides are proportional, but $\\angle ${A}$ is not between $\\overline{${A}${B}}$ and $\\overline{${B}${C}}$ (that angle is $\\angle ${B}$). This is SSA, which is not a similarity criterion.`,
            `两边成比例，但 $\\angle ${A}$ 不是 $\\overline{${A}${B}}$ 与 $\\overline{${B}${C}}$ 的夹角（夹角是 $\\angle ${B}$）。这是 SSA，不是相似判定。`,
          );
          parts = t(
            `Each criterion misses a part. AA needs a second angle pair, SSS needs $${C}${A} : ${F}${D}$, and SAS needs $\\angle ${B} \\cong \\angle ${E}$, the angles between the given sides. None of these is given.`,
            `每种判定都缺一个条件：AA 缺第二组角，SSS 缺 $${C}${A} : ${F}${D}$，SAS 缺所给两边的夹角 $\\angle ${B} \\cong \\angle ${E}$。这些都没有给出。`,
          );
          reasons = [
            ["only one pair of angles is given, and AA needs two.", "只给出一组角，而 AA 需要两组。"],
            [`the third sides $${C}${A}$ and $${F}${D}$ are unknown.`, `第三边 $${C}${A}$ 与 $${F}${D}$ 不知道。`],
            [
              `$\\angle ${A}$ is not between $\\overline{${A}${B}}$ and $\\overline{${B}${C}}$; the included angle is $\\angle ${B}$, which is not given. This is SSA.`,
              `$\\angle ${A}$ 不是 $\\overline{${A}${B}}$ 与 $\\overline{${B}${C}}$ 的夹角；夹角是 $\\angle ${B}$，没有给出。这是 SSA。`,
            ],
          ];
        } else if (kind === 4) {
          facts = `${A}${B} = ${sh[0] * u}, \\; ${A}${C} = ${sh[2] * u}, \\; ${D}${E} = ${sh[0] * v}, \\; ${D}${F} = ${sh[2] * v}`;
          correct = 3;
          sorted = t("Only two sides of each triangle are given, and no angles.", "每个三角形只给出两条边，没有角。");
          why = t(
            "Only two pairs of sides are known to be proportional; nothing is known about the third side or the angle between them.",
            "只知道两组边成比例，第三边和夹角都不知道。",
          );
          parts = t(
            `Each criterion misses a part: AA needs two angle pairs, SSS needs $${B}${C} : ${E}${F}$, and SAS needs $\\angle ${A} \\cong \\angle ${D}$. Hinged at $${A}$, the two sides can open to any angle, so the shape is not fixed.`,
            `每种判定都缺条件：AA 需要两组角，SSS 缺 $${B}${C} : ${E}${F}$，SAS 缺 $\\angle ${A} \\cong \\angle ${D}$。两条边在 $${A}$ 处像铰链一样可以张开成任意角度，形状并不确定。`,
          );
          reasons = [
            ["no angles are given, and AA needs two pairs of them.", "没有给出角，而 AA 需要两组角。"],
            [
              `only two pairs of sides are known; the third sides $${B}${C}$ and $${E}${F}$ are not.`,
              `只知道两组边，第三边 $${B}${C}$ 与 $${E}${F}$ 不知道。`,
            ],
            [
              `the angles $\\angle ${A}$ and $\\angle ${D}$ between the sides are not known.`,
              `两边的夹角 $\\angle ${A}$ 与 $\\angle ${D}$ 不知道。`,
            ],
          ];
        } else {
          facts = `m\\angle ${A} = m\\angle ${D} = ${angle}^\\circ, \\; ${A}${B} = ${sh[0] * u}, \\; ${D}${E} = ${sh[0] * v}`;
          correct = 3;
          sorted = t("Each triangle has one angle and one side given.", "每个三角形只给出一个角和一条边。");
          why = t("One pair of angles and one pair of sides are not enough.", "一组角和一组边不足以判定。");
          parts = t(
            "Each criterion misses a part: AA needs a second angle pair, and SSS and SAS need at least two proportional pairs of sides, while only one pair is given.",
            "每种判定都缺条件：AA 缺第二组角，SSS 和 SAS 至少需要两组成比例的边，而这里只给出一组。",
          );
          reasons = [
            ["only one pair of angles is given, and AA needs two.", "只给出一组角，而 AA 需要两组。"],
            ["only one pair of sides is given, and SSS needs all three.", "只给出一组边，而 SSS 需要三组。"],
            ["SAS needs two pairs of proportional sides, and only one pair is given.", "SAS 需要两组成比例的边，这里只给出一组。"],
          ];
        }
        const problem = choiceProblem({
          prompt: t(
            `In $\\triangle ${A}${B}${C}$ and $\\triangle ${D}${E}${F}$: $${facts}$. Which criterion shows that $\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$?`,
            `在 $\\triangle ${A}${B}${C}$ 与 $\\triangle ${D}${E}${F}$ 中：$${facts}$。用哪种判定可以说明 $\\triangle ${A}${B}${C} \\sim \\triangle ${D}${E}${F}$？`,
          ),
          options: criteria,
          correct,
          solution: paras(
            step(1, "sort the facts", "整理条件", sorted),
            step(2, "match them to a criterion", "对照判定方法", why),
            check(parts),
          ),
        });
        // reasons lists the three options other than the correct one, in the order of criteria.
        const others = criteria.filter((_, i) => i !== correct);
        return reasoned(
          problem,
          others.map((o, i) => [o.en, reasons[i]![0], reasons[i]![1]] as const),
        );
      },
    },
    {
      id: "crossing-segments",
      figure: similarityDrawings["crossing-segments"],
      title: t("Crossing segments", "相交的线段"),
      explanation: t(
        `If $\\overline{AD}$ and $\\overline{BC}$ cross at $E$ and $\\overline{AB} \\parallel \\overline{CD}$, the vertical angles at $E$ are congruent and $\\angle A \\cong \\angle D$ (alternate interior angles along $\\overline{AD}$), so $\\triangle EAB \\sim \\triangle EDC$ by AA. Note the matching: $A \\leftrightarrow D$ and $B \\leftrightarrow C$, the points at the ends of the same crossing segment.\n\nIf $EA = 4$, $ED = 6$ and $AB = 5$, then${steps("\\frac{DC}{5} = \\frac{6}{4} \\quad\\Rightarrow\\quad DC = \\frac{6 \\cdot 5}{4} = 7.5")}\n\n> **Watch out.** $EA$ pairs with $ED$, not with $EC$: the small triangle's side along one segment matches the large triangle's side along the same segment. And keep the large triangle on top in both fractions; $\\frac{4}{6} \\cdot 5$ shrinks a side that should grow.`,
        `若 $\\overline{AD}$ 与 $\\overline{BC}$ 相交于 $E$，且 $\\overline{AB} \\parallel \\overline{CD}$，则 $E$ 处的对顶角相等，$\\angle A \\cong \\angle D$（沿 $\\overline{AD}$ 的内错角），所以由 AA，$\\triangle EAB \\sim \\triangle EDC$。注意对应关系：$A \\leftrightarrow D$，$B \\leftrightarrow C$，即同一条相交线段两端的点对应。\n\n若 $EA = 4$，$ED = 6$，$AB = 5$，则${steps("\\frac{DC}{5} = \\frac{6}{4} \\quad\\Rightarrow\\quad DC = \\frac{6 \\cdot 5}{4} = 7.5")}\n\n> **注意。** $EA$ 与 $ED$ 对应，不是与 $EC$ 对应：小三角形在一条线段上的边，对应大三角形在同一条线段上的边。两个分数都要把大三角形放在分子上；$\\frac{4}{6} \\cdot 5$ 会把本该变长的边算短。`,
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
        const base: Mark[] = [
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
        ];
        const fig = figure(
          base,
          `Segments ${A}${D} and ${B}${C} crossing at ${E}, with ${A}${B} parallel to ${C}${D}.`,
          `线段 ${A}${D} 与 ${B}${C} 相交于 ${E}，${A}${B} ∥ ${C}${D}。`,
        );
        const known = [AB, DC, EB][ask]!;
        const [num, den] = ask === 1 ? [EA, ED] : [ED, EA];
        const answer = Q.of(num * known, den);
        const line = `x = \\frac{${num}}{${den}} \\cdot ${known} = ${answer.toLatex()}`;
        // The pair of corresponding sides that holds x: in the small triangle, then in the large one.
        const [small, large] = [
          [`${A}${B}`, `${D}${C}`],
          [`${A}${B}`, `${D}${C}`],
          [`${E}${B}`, `${E}${C}`],
        ][ask]!;
        const pair: [Point, Point, Point, Point] = ask === 2 ? [pe, pb, pe, pc] : [pa, pb, pd, pc];
        const proportion = ask === 1 ? prop("x", String(DC), String(EA), String(ED)) : prop("x", String(known), String(ED), String(EA));
        const angles: Mark[] = [
          { kind: "arc", vertex: pe, from: pa, to: pb, tone: "result" },
          { kind: "arc", vertex: pe, from: pd, to: pc, tone: "result" },
          { kind: "arc", vertex: pa, from: pe, to: pb, tone: "action" },
          { kind: "arc", vertex: pd, from: pe, to: pc, tone: "action" },
        ];
        const sides: Mark[] = [
          { kind: "segment", a: pa, b: pe, tone: "action" },
          { kind: "segment", a: pe, b: pd, tone: "action" },
          { kind: "segment", a: pair[0], b: pair[1], tone: "result" },
          { kind: "segment", a: pair[2], b: pair[3], tone: "result" },
        ];
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$. Find $x$.`,
              `如图，$\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$。求 $x$。`,
            ),
            answer,
            solveFor: "x",
            wrong: [Q.of(den * known, num), known + Math.abs(num - den)],
            solution: paras(
              step(
                1,
                "find two pairs of angles",
                "找两组角",
                t(
                  `The vertical angles at $${E}$ are congruent, and $\\angle ${A} \\cong \\angle ${D}$ as alternate interior angles of the parallels $\\overline{${A}${B}}$ and $\\overline{${C}${D}}$ along $\\overline{${A}${D}}$:\n\n{{figure 0}}\n\nSo $\\triangle ${E}${A}${B} \\sim \\triangle ${E}${D}${C}$ by AA, with $${A} \\leftrightarrow ${D}$ and $${B} \\leftrightarrow ${C}$.`,
                  `$${E}$ 处的对顶角相等；$\\overline{${A}${B}}$ 与 $\\overline{${C}${D}}$ 平行，沿 $\\overline{${A}${D}}$ 的内错角 $\\angle ${A} \\cong \\angle ${D}$：\n\n{{figure 0}}\n\n所以由 AA，$\\triangle ${E}${A}${B} \\sim \\triangle ${E}${D}${C}$，$${A} \\leftrightarrow ${D}$，$${B} \\leftrightarrow ${C}$。`,
                ),
              ),
              step(
                2,
                "set up the proportion",
                "列比例式",
                t(
                  `$\\overline{${E}${A}}$ pairs with $\\overline{${E}${D}}$, and $\\overline{${small}}$ with $\\overline{${large}}$; each pair shares a color:\n\n{{figure 1}}${steps(proportion, line)}`,
                  `$\\overline{${E}${A}}$ 与 $\\overline{${E}${D}}$ 对应，$\\overline{${small}}$ 与 $\\overline{${large}}$ 对应；每一对颜色相同：\n\n{{figure 1}}${steps(proportion, line)}`,
                ),
              ),
              check(
                t(
                  `Cross-multiply: $${answer.toLatex()} \\cdot ${den} = ${num * known}$ and $${known} \\cdot ${num} = ${num * known}$, equal. And $x$ came out ${num > den ? "longer" : "shorter"} than $${known}$, as the factor $${fr(num, den)}$ says.`,
                  `交叉相乘：$${answer.toLatex()} \\cdot ${den} = ${num * known}$，$${known} \\cdot ${num} = ${num * known}$，相等。而且 $x$ 比 $${known}$ ${num > den ? "长" : "短"}，与相似比 $${fr(num, den)}$ 相符。`,
                ),
              ),
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              [...base, ...angles],
              `The same figure with the vertical angles at ${E} in one color and the alternate interior angles at ${A} and ${D} in another.`,
              `同样的图形：${E} 处的对顶角用一种颜色，${A} 与 ${D} 处的内错角用另一种颜色。`,
            ),
            figure(
              [...base, ...sides],
              `The same figure with ${E}${A} and ${E}${D} in one color and ${small} and ${large} in another.`,
              `同样的图形：${E}${A} 与 ${E}${D} 用一种颜色，${small} 与 ${large} 用另一种颜色。`,
            ),
          ],
        };
      },
    },
    {
      id: "indirect-measurement",
      figure: similarityDrawings["indirect-measurement"],
      title: t("Indirect measurement with shadows", "利用影子间接测量"),
      explanation: t(
        `At the same moment, the sun's rays make the same angle with level ground everywhere. An upright object and its shadow form a right triangle, so two such triangles are similar by AA (the right angle and the sun's angle), and heights are proportional to shadow lengths.\n\nA $6$-foot person casts a $4$-foot shadow while a tree casts a $30$-foot shadow:${steps("\\frac{h}{30} = \\frac{6}{4} \\quad\\Rightarrow\\quad h = \\frac{6 \\cdot 30}{4} = 45 \\text{ feet}")}Each object is $1.5$ times as tall as its shadow is long.\n\n> **Watch out.** Put heights with heights and shadows with shadows: $\\frac{4}{6} \\cdot 30 = 20$ mixes them. And the tree is not $30 + 2 = 32$ feet tall: similar triangles scale by a factor, not by adding a difference.`,
        `同一时刻，阳光与水平地面所成的角处处相同。直立的物体和它的影子构成直角三角形，所以两个这样的三角形由 AA 相似（直角和阳光的角），高度与影长成比例。\n\n身高 $6$ 英尺的人影长 $4$ 英尺，同时一棵树影长 $30$ 英尺：${steps("\\frac{h}{30} = \\frac{6}{4} \\quad\\Rightarrow\\quad h = \\frac{6 \\cdot 30}{4} = 45 \\text{ 英尺}")}每个物体的高都是影长的 $1.5$ 倍。\n\n> **注意。** 高与高对应，影与影对应：$\\frac{4}{6} \\cdot 30 = 20$ 把它们弄混了。树也不是 $30 + 2 = 32$ 英尺高：相似三角形按倍数缩放，不是加上差。`,
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
          const base: Mark[] = [
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
          ];
          const fig = figure(
            base,
            `Two right triangles: a person ${person} feet tall with a shadow ${shadow} feet long, and ${obj.en} ${askHeight ? `with a shadow ${S} feet long and unknown height x` : `${H} feet tall with unknown shadow x`}.`,
            `两个直角三角形：身高 ${person} 英尺的人，影长 ${shadow} 英尺；${obj["zh-CN"]}，${askHeight ? `影长 ${S} 英尺，高 x` : `高 ${H} 英尺，影长 x`}。`,
          );
          const marked: Mark[] = [
            { kind: "arc", vertex: [w1, 0], from: [0, h1], to: [0, 0], tone: "result" },
            { kind: "arc", vertex: [x2 + w2, 0], from: [x2, h2], to: [x2, 0], tone: "result" },
            { kind: "segment", a: [0, 0], b: [0, h1], tone: "action" },
            { kind: "segment", a: [x2, 0], b: [x2, h2], tone: "action" },
          ];
          const ratio = fr(person, shadow);
          const theObj = t(obj.en.replace(/^a /, "the "), obj["zh-CN"].replace(/^一/, "这"));
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
              solution: paras(
                step(
                  1,
                  "see the similar triangles",
                  "找出相似三角形",
                  t(
                    `Each upright object, its shadow and the sun's ray form a right triangle. The right angles match, and the angles the rays make with the ground match because it is the same moment, so the triangles are similar by AA. The heights are drawn in one color and the sun's angles in another:\n\n{{figure 0}}`,
                    `每个直立的物体、它的影子和阳光构成一个直角三角形。直角相等；同一时刻，光线与地面的夹角也相等，所以两个三角形由 AA 相似。图中高用一种颜色，阳光的角用另一种颜色：\n\n{{figure 0}}`,
                  ),
                ),
                step(
                  2,
                  "set up the proportion",
                  "列比例式",
                  askHeight
                    ? t(
                        `Height over shadow is the same in both triangles:${steps(prop("h", String(S), String(person), String(shadow)), `h = \\frac{${person} \\cdot ${S}}{${shadow}} = ${H}`)}So ${theObj.en} is $${H}$ feet tall.`,
                        `两个三角形的“高比影长”相同：${steps(prop("h", String(S), String(person), String(shadow)), `h = \\frac{${person} \\cdot ${S}}{${shadow}} = ${H}`)}所以${theObj["zh-CN"]}高 $${H}$ 英尺。`,
                      )
                    : t(
                        `Shadow over height is the same in both triangles:${steps(prop("s", String(H), String(shadow), String(person)), `s = \\frac{${shadow} \\cdot ${H}}{${person}} = ${S}`)}So the shadow is $${S}$ feet long.`,
                        `两个三角形的“影长比高”相同：${steps(prop("s", String(H), String(shadow), String(person)), `s = \\frac{${shadow} \\cdot ${H}}{${person}} = ${S}`)}所以影长为 $${S}$ 英尺。`,
                      ),
                ),
                check(
                  t(
                    `Compare height to shadow in each triangle: the person gives $\\frac{${person}}{${shadow}}$ and ${theObj.en} gives $\\frac{${H}}{${S}}$, both $${ratio}$. ${H > S ? "Each object is taller than its shadow is long" : "Each shadow is longer than its object is tall"}, consistently.`,
                    `在每个三角形中比较高与影长：人是 $\\frac{${person}}{${shadow}}$，${theObj["zh-CN"]}是 $\\frac{${H}}{${S}}$，都等于 $${ratio}$。${H > S ? "两个物体都比各自的影子长" : "两个影子都比各自的物体长"}，前后一致。`,
                  ),
                ),
              ),
            }),
            figure: fig,
            solutionFigures: [
              figure(
                [...base, ...marked],
                "The same two right triangles with the heights in one color and the angles the sun's rays make with the ground in another.",
                "同样的两个直角三角形：高用一种颜色，阳光与地面的夹角用另一种颜色。",
              ),
            ],
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

/** Derived names a reason other than Given: one that derives a statement from earlier ones. */
type Derived = Exclude<Reason, "given">;

/** Crit names a criterion that proves two triangles similar. */
type Crit = "aa" | "sss" | "sas";

/** isCrit says whether a reason is a similarity criterion. */
const isCrit = (r: Reason): r is Crit => r === "aa" || r === "sss" || r === "sas";

/** does says what each reason other than Given states, as a clause. */
const does: Record<Derived, Text> = {
  corresponding: t("parallel lines cut by a transversal make congruent corresponding angles", "两条平行线被截线所截，同位角相等"),
  alternate: t("parallel lines cut by a transversal make congruent alternate interior angles", "两条平行线被截线所截，内错角相等"),
  vertical: t("the angles that face each other across a crossing are congruent", "两线相交时，隔着交点相对的两个角相等"),
  reflexive: t("a figure is congruent to itself", "图形与自身全等"),
  aa: t("two pairs of congruent angles make two triangles similar", "两组角分别相等的两个三角形相似"),
  sss: t("three pairs of proportional sides make two triangles similar", "三组边对应成比例的两个三角形相似"),
  sas: t(
    "two pairs of proportional sides with congruent angles between them make two triangles similar",
    "两组边对应成比例且夹角相等的两个三角形相似",
  ),
  simAngles: t("triangles already proved similar have congruent corresponding angles", "已证相似的三角形，对应角相等"),
  simSides: t("triangles already proved similar have proportional corresponding sides", "已证相似的三角形，对应边成比例"),
  corrConverse: t("congruent corresponding angles along a transversal make two lines parallel", "截线上的同位角相等，则两条直线平行"),
  midpoint: t("a midpoint splits its segment into two halves, each half of the whole", "中点把线段分成相等的两半，每一半是整条线段的一半"),
  substitution: t("a quantity may be replaced by one equal to it", "一个量可以换成与它相等的量"),
  multiplication: t("multiplying both sides of an equation by the same number keeps it true", "等式两边同乘一个数，等式仍成立"),
  division: t("dividing both sides of an equation by the same nonzero number keeps it true", "等式两边同除以一个不为零的数，等式仍成立"),
};

/** critNeeds says which parts each similarity criterion needs. */
const critNeeds: Record<Crit, Text> = {
  aa: t("two pairs of congruent angles", "两组相等的角"),
  sss: t("three pairs of proportional sides", "三组成比例的边"),
  sas: t("two pairs of proportional sides and the congruent angles between them", "两组成比例的边及其相等的夹角"),
};

/** altWhy says why a wrong statement does not follow by a reason, for the reasons whose steps offer wrong statements. */
const altWhy: Partial<Record<Derived, Text>> = {
  corresponding: t(
    "Corresponding angles sit in the same position at the two places where one transversal crosses the parallel lines, and these two angles do not.",
    "同位角位于同一条截线与两条平行线的两个交点处，且位置相同，而这两个角不是。",
  ),
  alternate: t(
    "Alternate interior angles lie between the parallel segments, at the two ends of the transversal and on opposite sides of it, and these angles do not.",
    "内错角位于两条平行线段之间、截线的两端，且分在截线两侧，而这两个角不是。",
  ),
  vertical: t(
    "Vertical angles face each other across the crossing, and these angles do not.",
    "对顶角是隔着交点相对的两个角，而这两个角不是。",
  ),
  simAngles: t(
    "Corresponding angles sit at vertices in the same places of the similarity statement, and these angles do not.",
    "对应角的顶点在相似式中位置相同，而这两个角不是。",
  ),
  simSides: t(
    "Corresponding sides join vertices in the same places of the similarity statement, with the same triangle on top in both ratios; this statement pairs or compares the sides some other way.",
    "对应边连接相似式中位置相同的顶点，而且两个比都要把同一个三角形放在分子上；这个结论配对或比较边的方式不对。",
  ),
  corrConverse: t(
    "The converse proves only that the two lines cut by the transversal are parallel, and this statement says something else.",
    "这个逆定理只能证明被截线所截的两条直线平行，而这个结论说的是别的事。",
  ),
  midpoint: t(
    "A midpoint makes each half equal to half of the whole segment, and this statement says something else.",
    "中点使每一半都等于整条线段的一半，而这个结论说的是别的事。",
  ),
  division: t(
    "Dividing each equation of the earlier step by its whole side gives a part over its whole equal to $\\frac{1}{2}$; this statement has a different ratio.",
    "把前一步的每个等式除以整条边，得到部分比整体等于 $\\frac{1}{2}$；这个结论的比不对。",
  ),
  substitution: t(
    "Putting the value from one step into the other gives a part over its whole equal to $\\frac{1}{2}$; this statement says something else.",
    "把一步中的值代入另一步，得到部分比整体等于 $\\frac{1}{2}$；这个结论说的是别的事。",
  ),
  multiplication: t(
    "Multiplying both sides by the two denominators gives each numerator times the other ratio's denominator; this statement pairs the lengths differently.",
    "两边同乘两个分母，得到每个分子乘另一个比的分母；这个结论把长度配错了。",
  ),
};

/** altWhyOf says why a wrong statement offered for a step that cites r does not follow. */
function altWhyOf(r: Derived, o: Text): Text {
  if (isCrit(r)) {
    if (o.en.includes("\\cong \\triangle"))
      return t(
        "A similarity criterion proves that the shapes match, not that the sizes do; congruence would need equal sides.",
        "相似判定只能证明形状相同，不能证明大小相同；全等需要对应边相等。",
      );
    return t(
      "The vertices must be listed in corresponding order, and this statement pairs vertices that do not correspond.",
      "顶点必须按对应顺序书写，而这个相似式把不对应的顶点配在了一起。",
    );
  }
  return altWhy[r] ?? t("It does not follow from the earlier steps.", "它不能由前面各步推出。");
}

/** ProofStep is one line of a two-column proof: a statement, its reason, and wrong statements to offer instead of it. */
interface ProofStep {
  readonly s: Text;
  readonly r: Reason;
  readonly alts?: readonly Text[];
  /** why explains the step in the solution. */
  readonly why?: Text;
  /** marks are the arcs, arrows, ticks or colored sides that the step's fact adds to the figure. */
  readonly marks?: readonly Mark[];
  /** drawn says that the problem's figure already shows the step's marks, since they come straight from the given facts. */
  readonly drawn?: boolean;
}

/** Proof is a two-column proof with the bare drawing of its figure. */
interface Proof {
  readonly given: Text;
  readonly prove: Text;
  readonly steps: readonly ProofStep[];
  /** base draws the figure without the marks of any step. */
  readonly base: readonly Mark[];
  readonly alt: readonly [string, string];
  /** parts are the steps that give the parts the similarity criterion uses. */
  readonly parts: readonly number[];
}

/** andJoin joins texts as a list: "a, b and c". */
function andJoin(items: readonly Text[]): Text {
  const join = (lang: "en" | "zh-CN") => {
    const xs = items.map((x) => x[lang]);
    if (lang === "zh-CN") return xs.join("；");
    return xs.length <= 1 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
  };
  return t(join("en"), join("zh-CN"));
}

/** proofProblem asks for the reason, or the statement, of one step of a proof; pool lists the reasons offered as wrong options. */
function proofProblem(rng: Rng, proof: Proof, pool: readonly Derived[]): Problem & { figure: Figure } {
  const eligible = proof.steps.map((s, i) => [s, i] as const).filter(([s]) => s.r !== "given");
  const [target, k] = rng.pick(eligible);
  const r = target.r as Derived;
  const askStatement = target.alts !== undefined && target.alts.length >= 2 && rng.bool(0.4);
  let options: Text[];
  let wrongWhy: (readonly [string, string, string])[];
  if (askStatement) {
    options = [target.s, ...rng.sample(target.alts!, Math.min(3, target.alts!.length))];
    wrongWhy = options.slice(1).map((o) => {
      const w = altWhyOf(r, o);
      return [o.en, w.en, w["zh-CN"]] as const;
    });
  } else {
    const others = pool.filter((x) => x !== r);
    const picked = rng.sample(others, Math.min(3, others.length));
    options = [reasons[r], ...picked.map((x) => reasons[x])];
    wrongWhy = picked.map((x) =>
      isCrit(x) && isCrit(r)
        ? ([
            reasons[x].en,
            `It needs ${critNeeds[x].en}, but the earlier steps give ${critNeeds[r].en}.`,
            `它需要${critNeeds[x]["zh-CN"]}，而前面各步给出的是${critNeeds[r]["zh-CN"]}。`,
          ] as const)
        : ([
            reasons[x].en,
            `It says that ${does[x].en}, which is not what step ${k + 1} states.`,
            `它说的是${does[x]["zh-CN"]}，而第 ${k + 1} 步不是这样的结论。`,
          ] as const),
    );
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
  const why = target.why ? t(` ${target.why.en}`, target.why["zh-CN"]) : t("", "");
  const drawing = proofFigures(proof);
  const first = askStatement
    ? t(
        `Step ${k + 1} cites “${reasons[r].en}”: ${does[r].en}. Applied here, it gives ${target.s.en}.${why.en}`,
        `第 ${k + 1} 步的理由是“${reasons[r]["zh-CN"]}”：${does[r]["zh-CN"]}。用在这里，得到 ${target.s["zh-CN"]}。${why["zh-CN"]}`,
      )
    : t(
        `Step ${k + 1} states ${target.s.en}. ${cap(does[r].en)}, so the reason is: ${reasons[r].en}.${why.en}`,
        `第 ${k + 1} 步的结论是 ${target.s["zh-CN"]}。${does[r]["zh-CN"]}，所以理由是：${reasons[r]["zh-CN"]}。${why["zh-CN"]}`,
      );
  // Inline ratios read a/b, so that a proportion stays inside the sentence that cites it.
  const flat = (x: string) => x.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 / $2");
  const walk = (lang: "en" | "zh-CN") => {
    const paragraphs: string[] = [];
    let current: string[] = [lang === "en" ? "The figure marks the given facts." : "图中标出了已知条件。"];
    proof.steps.forEach((s, i) => {
      if (s.r === "given") return;
      current.push(
        lang === "en"
          ? `Step ${i + 1}: ${flat(s.s.en)} (${reasons[s.r].en}).`
          : `第 ${i + 1} 步：${flat(s.s["zh-CN"])}（${reasons[s.r]["zh-CN"]}）。`,
      );
      const j = drawing.at.get(i);
      if (j !== undefined) {
        paragraphs.push(current.join(lang === "en" ? " " : ""), `{{figure ${j}}}`);
        current = [];
      }
    });
    if (current.length > 0) paragraphs.push(current.join(lang === "en" ? " " : ""));
    return paragraphs.join("\n\n");
  };
  const c = proof.steps.findIndex((s) => isCrit(s.r));
  const tri = proof.steps[c]!;
  const crit = tri.r as Crit;
  const partText = (i: number) => {
    const s = proof.steps[i]!;
    return t(`${flat(s.s.en)} (step ${i + 1}, ${reasons[s.r].en})`, `${flat(s.s["zh-CN"])}（第 ${i + 1} 步，${reasons[s.r]["zh-CN"]}）`);
  };
  const later = proof.steps.map((s, i) => [s, i] as const).filter(([, i]) => i > c);
  const after =
    later.length === 0
      ? t(" That similarity is the statement to prove.", "这个相似正是要证明的结论。")
      : t(
          ` From that similarity the proof goes on: ${later.map(([s, i]) => `step ${i + 1} (${reasons[s.r].en})`).join(", ")}.`,
          `得到这个相似之后，证明继续：${later.map(([s, i]) => `第 ${i + 1} 步（${reasons[s.r]["zh-CN"]}）`).join("，")}。`,
        );
  return {
    ...reasoned(
      choiceProblem({
        prompt: t(
          `**Given:** ${proof.given.en}\n\n**Prove:** ${proof.prove.en}\n\n${list("en")}\n\n${ask.en}`,
          `**已知：** ${proof.given["zh-CN"]}\n\n**求证：** ${proof.prove["zh-CN"]}\n\n${list("zh-CN")}\n\n${ask["zh-CN"]}`,
        ),
        options: shuffled,
        correct,
        solution: paras(
          step(1, "see what the step does", "看这一步做什么", first),
          step(2, "follow the proof in the figure", "在图中走一遍证明", t(walk("en"), walk("zh-CN"))),
          check(
            t(
              `Step ${c + 1} uses the ${reasons[crit].en}, which needs ${critNeeds[crit].en}. The parts are `,
              `第 ${c + 1} 步用的是${reasons[crit]["zh-CN"]}，它需要${critNeeds[crit]["zh-CN"]}。这些部分是：`,
            ),
            andJoin(proof.parts.map(partText)),
            t(`.${tri.why ? ` ${tri.why.en}` : ""}`, `。${tri.why ? tri.why["zh-CN"] : ""}`),
            after,
          ),
        ),
      }),
      wrongWhy,
    ),
    figure: drawing.figure,
    solutionFigures: drawing.steps,
  };
}

/** angleMark marks the angle at vertex between the rays toward from and to. */
const angleMark = (vertex: Point, from: Point, to: Point): Mark => ({ kind: "arc", vertex, from, to });

/** arcIn marks the angle at vertex i of a polygon. */
const arcIn = (ps: readonly Point[], i: number): Mark => angleMark(ps[i]!, ps[(i + 1) % ps.length]!, ps[(i + ps.length - 1) % ps.length]!);

/** nestedFacts are the marks of the usual facts about a nested figure: DE ∥ BC, the angles at D and B, at E and C, the shared angle at A, and D, E as midpoints. */
function nestedFacts({ pa, pb, pc, pd, pe }: Nested) {
  return {
    parallel: [
      { kind: "arrows", a: pd, b: pe, count: 1 },
      { kind: "arrows", a: pb, b: pc, count: 1 },
    ] as Mark[],
    atD: [angleMark(pd, pa, pe), angleMark(pb, pa, pc)],
    atE: [angleMark(pe, pa, pd), angleMark(pc, pa, pb)],
    atA: [angleMark(pa, pb, pc)],
    midD: [
      { kind: "ticks", a: pa, b: pd, count: 1 },
      { kind: "ticks", a: pd, b: pb, count: 1 },
    ] as Mark[],
    midE: [
      { kind: "ticks", a: pa, b: pe, count: 2 },
      { kind: "ticks", a: pe, b: pc, count: 2 },
    ] as Mark[],
  };
}

/** parallelSimilarProof proves △ADE ∼ △ABC from DE ∥ BC. */
function parallelSimilarProof(rng: Rng): Proof {
  const L = pickFive(rng);
  const [A, B, C, D, E] = L;
  const n = nestedPoints(rng, rng.pick([0.4, 0.45, 0.5, 0.55, 0.6]));
  const f = nestedFacts(n);
  const shared = rng.bool();
  const second: ProofStep = shared
    ? {
        s: m(`\\angle ${A} \\cong \\angle ${A}`),
        r: "reflexive",
        why: t("The two triangles share this angle.", "两个三角形共有这个角。"),
        marks: f.atA,
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
        marks: f.atE,
      };
  return {
    given: t(
      `$${D}$ on $\\overline{${A}${B}}$, $${E}$ on $\\overline{${A}${C}}$, $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
      `$${D}$ 在 $\\overline{${A}${B}}$ 上，$${E}$ 在 $\\overline{${A}${C}}$ 上，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
    ),
    prove: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
    steps: [
      { s: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`), r: "given", marks: f.parallel, drawn: true },
      {
        s: m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${B}${C}`),
        r: "corresponding",
        why: t(`$${A}${B}$ is a transversal of the parallel lines.`, `$${A}${B}$ 是两条平行线的截线。`),
        alts: [
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${C}${B}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${E}${D}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${B}${D}${E}`),
        ],
        marks: f.atD,
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
    base: nestedMarks(n, L, {}),
    alt: [
      `Triangle ${A}${B}${C} with ${D} on ${A}${B}, ${E} on ${A}${C}, and ${D}${E} parallel to ${B}${C}.`,
      `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，${D}${E} ∥ ${B}${C}。`,
    ],
    parts: [1, 2],
  };
}

/** bowtieProof proves △EAB ∼ △EDC when AD and BC cross at E and AB ∥ CD. */
function bowtieProof(rng: Rng): Proof {
  const [A, B, C, D, E] = pickFive(rng);
  const k = rng.pick([0.6, 0.8, 1.25, 1.5]);
  const p = bowtiePoints(rng, 4, 4.5, k);
  const base: Mark[] = [
    { kind: "segment", a: p.pa, b: p.pd },
    { kind: "segment", a: p.pb, b: p.pc },
    { kind: "segment", a: p.pa, b: p.pb, accent: true },
    { kind: "segment", a: p.pc, b: p.pd, accent: true },
    ...names([p.pa, p.pb, p.pc, p.pd], `${A}${B}${C}${D}`, p.pe),
    { kind: "label", at: p.pe, text: E, dir: "s", italic: true },
  ];
  const useA = rng.bool();
  return {
    given: t(
      `$\\overline{${A}${D}}$ and $\\overline{${B}${C}}$ meet at $${E}$, $\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$`,
      `$\\overline{${A}${D}}$ 与 $\\overline{${B}${C}}$ 相交于 $${E}$，$\\overline{${A}${B}} \\parallel \\overline{${C}${D}}$`,
    ),
    prove: m(`\\triangle ${E}${A}${B} \\sim \\triangle ${E}${D}${C}`),
    steps: [
      {
        s: m(`\\overline{${A}${B}} \\parallel \\overline{${C}${D}}`),
        r: "given",
        marks: [
          { kind: "arrows", a: p.pa, b: p.pb, count: 1 },
          { kind: "arrows", a: p.pd, b: p.pc, count: 1 },
        ],
        drawn: true,
      },
      {
        s: m(`\\angle ${A}${E}${B} \\cong \\angle ${D}${E}${C}`),
        r: "vertical",
        alts: [
          m(`\\angle ${A}${E}${B} \\cong \\angle ${A}${E}${C}`),
          m(`\\angle ${A}${E}${B} \\cong \\angle ${E}${D}${C}`),
          m(`\\angle ${A}${E}${B} \\cong \\angle ${B}${E}${D}`),
        ],
        marks: [angleMark(p.pe, p.pa, p.pb), angleMark(p.pe, p.pd, p.pc)],
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
            marks: [angleMark(p.pa, p.pe, p.pb), angleMark(p.pd, p.pe, p.pc)],
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
            marks: [angleMark(p.pb, p.pe, p.pa), angleMark(p.pc, p.pe, p.pd)],
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
    base,
    alt: [
      `Segments ${A}${D} and ${B}${C} crossing at ${E}, with ${A}${B} parallel to ${C}${D}.`,
      `线段 ${A}${D} 与 ${B}${C} 相交于 ${E}，${A}${B} ∥ ${C}${D}。`,
    ],
    parts: [1, 2],
  };
}

/** sasParallelProof proves DE ∥ BC from AD/AB = AE/AC. */
function sasParallelProof(rng: Rng): Proof {
  const L = pickFive(rng);
  const [A, B, C, D, E] = L;
  const n = nestedPoints(rng, rng.pick([0.4, 0.45, 0.5, 0.55, 0.6]));
  const f = nestedFacts(n);
  const ratio = `\\frac{${A}${D}}{${A}${B}} = \\frac{${A}${E}}{${A}${C}}`;
  return {
    given: t(
      `$${D}$ on $\\overline{${A}${B}}$, $${E}$ on $\\overline{${A}${C}}$, $${ratio}$`,
      `$${D}$ 在 $\\overline{${A}${B}}$ 上，$${E}$ 在 $\\overline{${A}${C}}$ 上，$${ratio}$`,
    ),
    prove: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`),
    steps: [
      { s: m(ratio), r: "given" },
      { s: m(`\\angle ${A} \\cong \\angle ${A}`), r: "reflexive", marks: f.atA },
      {
        s: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
        r: "sas",
        why: t(
          `The proportional sides, $${A}${D}, ${A}${B}$ and $${A}${E}, ${A}${C}$, both meet at $${A}$, so the angle at $${A}$ lies between them.`,
          `成比例的两组边 $${A}${D}, ${A}${B}$ 与 $${A}${E}, ${A}${C}$ 都交于 $${A}$，所以 $${A}$ 处的角正是它们的夹角。`,
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
        marks: f.atD,
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
        marks: f.parallel,
      },
    ],
    base: nestedMarks(n, L, {}),
    alt: [
      `Triangle ${A}${B}${C} with ${D} on ${A}${B}, ${E} on ${A}${C}, and segment ${D}${E}.`,
      `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上，连接 ${D}${E}。`,
    ],
    parts: [0, 1],
  };
}

/** separatePoints places two similar triangles side by side, the second turned or flipped. */
function separatePoints(rng: Rng): [Point[], Point[]] {
  const sh = pickShape(rng);
  const [p1, p2] = sideBySide(bySides(sh), posed(bySides(sh), pickPose(rng)), rng.pick([0.7, 1.4]));
  return [[...p1], [...p2]];
}

/** proportionProof proves a product of sides from two pairs of congruent angles, or a congruent angle from SSS. */
function proportionProof(rng: Rng): Proof {
  const letters = rng.pick(sixLetters);
  const [A, B, C, D, E, F] = letters.split("") as [string, string, string, string, string, string];
  const [L1, L2] = [letters.slice(0, 3), letters.slice(3)];
  const [p1, p2] = separatePoints(rng);
  const base = [...polyMarks(p1, L1), ...polyMarks(p2, L2)];
  if (rng.bool()) {
    return {
      given: m(`\\angle ${B} \\cong \\angle ${E}, \\; \\angle ${C} \\cong \\angle ${F}`),
      prove: m(`${A}${B} \\cdot ${E}${F} = ${D}${E} \\cdot ${B}${C}`),
      steps: [
        {
          s: m(`\\angle ${B} \\cong \\angle ${E}, \\; \\angle ${C} \\cong \\angle ${F}`),
          r: "given",
          marks: [arcIn(p1, 1), arcIn(p2, 1), arcIn(p1, 2), arcIn(p2, 2)],
          drawn: true,
        },
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
          marks: [sideIn(p1, 0, "action"), sideIn(p2, 0, "action"), sideIn(p1, 1, "result"), sideIn(p2, 1, "result")],
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
      base,
      alt: [
        `Triangles ${L1} and ${L2} with angle ${B} marked equal to angle ${E}, and angle ${C} marked equal to angle ${F}.`,
        `三角形 ${L1} 与 ${L2}，标出角 ${B} 等于角 ${E}，角 ${C} 等于角 ${F}。`,
      ],
      parts: [0],
    };
  }
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
        marks: [arcIn(p1, 1), arcIn(p2, 1)],
      },
    ],
    base,
    alt: [`Triangles ${L1} and ${L2}.`, `三角形 ${L1} 与 ${L2}。`],
    parts: [0],
  };
}

const similarityPool: readonly Derived[] = [
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
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.B.5"],
  intro: t(
    "So far we have found similar triangles and used them to compute lengths. A proof writes the same reasoning down so that every claim is backed: each line is a statement, and next to it the reason that makes it true, a given fact, a definition or a theorem. Proofs about similarity follow one plan: collect the parts a criterion needs, apply the criterion, then read conclusions off the similarity.\n\nSay $\\overline{PS}$ and $\\overline{QR}$ cross at $T$, with $\\overline{PQ} \\parallel \\overline{RS}$, and we want $\\triangle TPQ \\sim \\triangle TSR$.\n\n1. $\\overline{PQ} \\parallel \\overline{RS}$: given.\n2. $\\angle PTQ \\cong \\angle STR$: vertical angles are congruent.\n3. $\\angle TPQ \\cong \\angle TSR$: alternate interior angles along $\\overline{PS}$.\n4. $\\triangle TPQ \\sim \\triangle TSR$: AA, from steps 2 and 3.\n\nOnce the triangles are similar, their corresponding angles are congruent and their corresponding sides proportional; these new facts can prove lines parallel or products of lengths equal. In this lesson we fill in the missing statements and reasons of such proofs.",
    "到目前为止，我们找出相似三角形，并用它们计算长度。证明是把同样的推理写下来，让每个论断都有依据：每一行是一个结论，旁边写上使它成立的理由，可以是已知条件、定义或定理。关于相似的证明都遵循同一个思路：凑齐某个判定所需的条件，运用判定，再从相似中读出结论。\n\n设 $\\overline{PS}$ 与 $\\overline{QR}$ 相交于 $T$，$\\overline{PQ} \\parallel \\overline{RS}$，要证 $\\triangle TPQ \\sim \\triangle TSR$。\n\n1. $\\overline{PQ} \\parallel \\overline{RS}$：已知。\n2. $\\angle PTQ \\cong \\angle STR$：对顶角相等。\n3. $\\angle TPQ \\cong \\angle TSR$：沿 $\\overline{PS}$ 的内错角相等。\n4. $\\triangle TPQ \\sim \\triangle TSR$：由第 2、3 步，AA。\n\n两个三角形一旦相似，对应角就相等，对应边就成比例；这些新的事实可以用来证明直线平行或长度的乘积相等。这节课我们补全这类证明中缺少的结论和理由。",
  ),
  knowledgePoints: [
    {
      id: "proving-triangles-similar-with-aa",
      figure: similarityDrawings["proving-triangles-similar-with-aa"],
      title: t("Proving triangles similar with AA", "用 AA 证明三角形相似"),
      explanation: t(
        "To prove two triangles similar with AA, find two pairs of congruent angles. Parallel lines give corresponding or alternate interior angles; crossing lines give vertical angles; a shared angle is congruent to itself (reflexive property).\n\nGiven $\\overline{DE} \\parallel \\overline{BC}$ in $\\triangle ABC$:\n\n1. $\\angle ADE \\cong \\angle ABC$: corresponding angles, since $\\overline{AB}$ crosses both parallels.\n2. $\\angle A \\cong \\angle A$: reflexive property, since both triangles contain it.\n3. $\\triangle ADE \\sim \\triangle ABC$: AA similarity criterion, from steps 1 and 2.\n\n> **Watch out.** Name the triangles in matching order. $D$ comes second in $\\triangle ADE$ because $\\angle ADE \\cong \\angle ABC$ puts $D$ with $B$; writing $\\triangle ADE \\sim \\triangle ACB$ would pair $\\angle ADE$ with $\\angle ACB$, which nothing showed. And AA proves similarity, not congruence: the triangles have different sizes.",
        "用 AA 证明两个三角形相似，要找出两组相等的角。平行线给出同位角或内错角；相交直线给出对顶角；公共角与自身相等（自反性）。\n\n已知 $\\triangle ABC$ 中 $\\overline{DE} \\parallel \\overline{BC}$：\n\n1. $\\angle ADE \\cong \\angle ABC$：同位角，因为 $\\overline{AB}$ 同时截两条平行线。\n2. $\\angle A \\cong \\angle A$：自反性，因为两个三角形都含有这个角。\n3. $\\triangle ADE \\sim \\triangle ABC$：由第 1、2 步，AA 相似判定。\n\n> **注意。** 三角形的顶点要按对应顺序书写。$\\angle ADE \\cong \\angle ABC$ 把 $D$ 与 $B$ 对应，所以 $D$ 写在 $\\triangle ADE$ 的第二位；写成 $\\triangle ADE \\sim \\triangle ACB$ 就把 $\\angle ADE$ 与 $\\angle ACB$ 配在一起，而这一点并没有证明。另外，AA 证明的是相似而不是全等：两个三角形大小不同。",
      ),
      keyPrerequisites: ["the-aa-similarity-criterion"],
      generate: (rng) => proofProblem(rng, rng.bool() ? parallelSimilarProof(rng) : bowtieProof(rng), similarityPool),
    },
    {
      id: "using-similar-triangles-to-prove-parallel-lines",
      figure: similarityDrawings["using-similar-triangles-to-prove-parallel-lines"],
      title: t("Proving lines parallel with SAS", "用 SAS 证明直线平行"),
      explanation: t(
        "Once two triangles are proved similar, their corresponding angles are congruent, and congruent corresponding angles along a transversal make lines parallel. So a proof can run from proportional sides, through similar triangles, to parallel lines.\n\nLet $D$ lie on $\\overline{AB}$ and $E$ on $\\overline{AC}$, with $\\frac{AD}{AB}$ equal to $\\frac{AE}{AC}$:\n\n1. $\\angle A \\cong \\angle A$: reflexive property.\n2. $\\triangle ADE \\sim \\triangle ABC$: SAS similarity criterion, since $\\angle A$ lies between the proportional sides.\n3. $\\angle ADE \\cong \\angle ABC$: corresponding angles of similar triangles.\n4. $\\overline{DE} \\parallel \\overline{BC}$: converse of the corresponding angles theorem, along the transversal $\\overline{AB}$.\n\n> **Watch out.** The order matters: first the similarity, then the angles, then the parallel lines. Citing “corresponding angles are congruent” for step 3 would assume the parallel lines that the proof is trying to reach.",
        "两个三角形一旦证明相似，它们的对应角就相等；而截线上的同位角相等，两直线就平行。所以证明可以从成比例的边出发，经过相似三角形，得到平行线。\n\n设 $D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上，且 $\\frac{AD}{AB}$ 等于 $\\frac{AE}{AC}$：\n\n1. $\\angle A \\cong \\angle A$：自反性。\n2. $\\triangle ADE \\sim \\triangle ABC$：SAS 相似判定，因为 $\\angle A$ 是成比例两边的夹角。\n3. $\\angle ADE \\cong \\angle ABC$：相似三角形的对应角相等。\n4. $\\overline{DE} \\parallel \\overline{BC}$：沿截线 $\\overline{AB}$，同位角相等，两直线平行。\n\n> **注意。** 顺序很重要：先相似，再得角，最后得平行。第 3 步若引用“两直线平行，同位角相等”，就等于先假设了要证明的平行。",
      ),
      keyPrerequisites: ["proving-alternate-angle-converses"],
      generate: (rng) => proofProblem(rng, sasParallelProof(rng), similarityPool),
    },
    {
      id: "proving-proportions-and-angles",
      figure: geometryDrawings2["proving-similarity-statements#proving-proportions-and-angles"],
      title: t("Proving proportions and angles", "证明比例式与角相等"),
      explanation: t(
        "Similar triangles give two kinds of conclusions: corresponding angles are congruent, and corresponding sides are proportional. A proportion can then be rewritten as a product by multiplying both sides by its denominators.\n\nGiven $\\angle B \\cong \\angle E$ and $\\angle C \\cong \\angle F$:\n\n1. $\\triangle ABC \\sim \\triangle DEF$: AA.\n2. $\\frac{AB}{DE} = \\frac{BC}{EF}$: corresponding sides of similar triangles are proportional.\n3. $AB \\cdot EF = DE \\cdot BC$: multiplication property of equality, multiplying by $DE \\cdot EF$.\n\n> **Watch out.** Read a proportion off the similarity statement, not off the look of the figure: $\\overline{AB}$ pairs with $\\overline{DE}$ because both join the first two letters. And keep the same triangle on top in both ratios; $\\frac{AB}{DE} = \\frac{EF}{BC}$ mixes them up.",
        "相似三角形能给出两类结论：对应角相等，对应边成比例。比例式两边同乘两个分母，就能写成乘积的形式。\n\n已知 $\\angle B \\cong \\angle E$，$\\angle C \\cong \\angle F$：\n\n1. $\\triangle ABC \\sim \\triangle DEF$：AA。\n2. $\\frac{AB}{DE} = \\frac{BC}{EF}$：相似三角形的对应边成比例。\n3. $AB \\cdot EF = DE \\cdot BC$：等式的乘法性质，两边同乘 $DE \\cdot EF$。\n\n> **注意。** 比例式要从相似式中读出，而不是凭图形的样子：$\\overline{AB}$ 与 $\\overline{DE}$ 对应，因为它们都连接前两个字母。两个比都要把同一个三角形放在分子上；$\\frac{AB}{DE} = \\frac{EF}{BC}$ 就弄混了。",
      ),
      generate: (rng) => proofProblem(rng, proportionProof(rng), similarityPool),
    },
  ],
};

// ─── 1.4.11 The midpoint theorem ────────────────────────────────────────────

/** midsegmentTones colors a nested figure's midsegment DE in the result color and the third side BC in the action color. */
const midsegmentTones = ({ pb, pc, pd, pe }: Nested): Mark[] => [
  { kind: "segment", a: pd, b: pe, tone: "result" },
  { kind: "segment", a: pb, b: pc, tone: "action" },
];

export const theMidpointTheorem: TopicDef = {
  id: "the-midpoint-theorem",
  title: t("The Midpoint Theorem", "三角形中位线定理"),
  summary: t(
    "Use the midpoint theorem: the segment joining the midpoints of two sides of a triangle is parallel to the third side and half as long.",
    "运用三角形中位线定理：连接三角形两边中点的线段平行于第三边，且等于第三边的一半。",
  ),
  prerequisites: ["the-sas-similarity-criterion", "equations-with-parentheses"],
  encompasses: [{ topic: "parallel-lines-and-transversals", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSG.CO.C.10"],
  intro: t(
    "Mark the midpoints of two sides of a triangle and join them. The segment you get always runs parallel to the third side, and it is always exactly half as long. The reason is similarity: the segment cuts off a small triangle at the top whose two sides are half of the big triangle's sides around the same angle, so by SAS the small triangle is a half-size copy, with its third side half as long and turned the same way.\n\nIn $\\triangle PQR$ with $QR = 16$, let $M$ and $N$ be the midpoints of $\\overline{PQ}$ and $\\overline{PR}$. Then $MN = 16 \\div 2 = 8$ and $\\overline{MN} \\parallel \\overline{QR}$, whatever the other sides are. Going the other way, if a midsegment is $5$ long, the side parallel to it is $10$.\n\nIn this lesson we use the theorem to find lengths, to solve equations, to find the perimeter of the triangle the three midsegments make, and to find angles.",
    "取三角形两边的中点并把它们连起来。得到的线段总是平行于第三边，而且总是恰好等于第三边的一半。原因是相似：这条线段在顶上截出一个小三角形，它在同一个角两旁的两条边都是大三角形对应边的一半，由 SAS，小三角形是大三角形缩小一半的样子，它的第三边也是一半长，方向相同。\n\n在 $\\triangle PQR$ 中，$QR = 16$，$M$、$N$ 分别是 $\\overline{PQ}$、$\\overline{PR}$ 的中点。那么不论另外两边多长，都有 $MN = 16 \\div 2 = 8$，且 $\\overline{MN} \\parallel \\overline{QR}$。反过来，如果中位线长 $5$，与它平行的边就长 $10$。\n\n这节课我们用这个定理求长度、解方程、求三条中位线围成的三角形的周长，以及求角。",
  ),
  knowledgePoints: [
    {
      id: "length-of-a-midsegment",
      figure: similarityDrawings["length-of-a-midsegment"],
      title: t("The length of a midsegment", "中位线的长"),
      explanation: t(
        "A **midsegment** of a triangle joins the midpoints of two sides. **Midpoint theorem:** a midsegment is parallel to the third side and half as long. (The small triangle is similar to the whole one with scale factor $\\frac{1}{2}$, by SAS.)\n\nIf $D$ and $E$ are the midpoints of $\\overline{AB}$ and $\\overline{AC}$ and $BC = 18$, then $DE = 18 \\div 2 = 9$. If instead $DE = 7$, then $BC = 2 \\cdot 7 = 14$.\n\n> **Watch out.** The midsegment is the shorter one. Halve the third side to get the midsegment; double the midsegment to get the third side. Doubling $18$ to $36$ for $DE$ goes the wrong way.",
        "连接三角形两边中点的线段叫做三角形的**中位线**。**中位线定理**：中位线平行于第三边，且等于第三边的一半。（由 SAS，小三角形与整个三角形相似，相似比为 $\\frac{1}{2}$。）\n\n若 $D$、$E$ 分别是 $\\overline{AB}$、$\\overline{AC}$ 的中点，$BC = 18$，则 $DE = 18 \\div 2 = 9$。若 $DE = 7$，则 $BC = 2 \\cdot 7 = 14$。\n\n> **注意。** 中位线是较短的那条。由第三边求中位线要除以 $2$；由中位线求第三边要乘以 $2$。把 $18$ 乘以 $2$ 得 $36$ 作为 $DE$，方向就反了。",
      ),
      generate(rng) {
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const findDE = rng.bool();
        const known = findDE ? rng.int(5, 40) : rng.int(3, 25);
        const answer = findDE ? Q.of(known, 2) : Q.of(2 * known);
        const n = nestedPoints(rng, 0.5);
        const base = nestedMarks(n, L, { ticks: true, de: findDE ? "x" : String(known), bc: findDE ? String(known) : "x" });
        const fig = figure(
          base,
          `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B} and ${E} the midpoint of ${A}${C}; ${findDE ? `${B}${C} = ${known} and ${D}${E} = x` : `${D}${E} = ${known} and ${B}${C} = x`}.`,
          `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${E} 是 ${A}${C} 的中点；${findDE ? `${B}${C} = ${known}，${D}${E} = x` : `${D}${E} = ${known}，${B}${C} = x`}。`,
        );
        const [de, bc] = findDE ? [answer.toLatex(), String(known)] : [String(known), answer.toLatex()];
        return {
          ...numberProblem({
            prompt: t(
              `$${D}$ and $${E}$ are the midpoints of $\\overline{${A}${B}}$ and $\\overline{${A}${C}}$. Find $x$.`,
              `$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点。求 $x$。`,
            ),
            answer,
            solveFor: "x",
            wrong: findDE ? [known, 2 * known] : [known, Q.of(known, 2)],
            solution: paras(
              step(
                1,
                "find the midsegment",
                "找出中位线",
                t(
                  `The tick marks show that $${D}$ and $${E}$ are midpoints, so $\\overline{${D}${E}}$ is a midsegment, and the side it does not touch, $\\overline{${B}${C}}$, is the third side:\n\n{{figure 0}}`,
                  `刻痕表明 $${D}$、$${E}$ 是中点，所以 $\\overline{${D}${E}}$ 是中位线，它不碰到的边 $\\overline{${B}${C}}$ 就是第三边：\n\n{{figure 0}}`,
                ),
              ),
              findDE
                ? step(
                    2,
                    "halve the third side",
                    "把第三边除以 2",
                    t(
                      `The midsegment is half of $${B}${C}$:${steps(`x = \\frac{${known}}{2} = ${answer.toLatex()}`)}`,
                      `中位线是 $${B}${C}$ 的一半：${steps(`x = \\frac{${known}}{2} = ${answer.toLatex()}`)}`,
                    ),
                  )
                : step(
                    2,
                    "double the midsegment",
                    "把中位线乘以 2",
                    t(
                      `The third side is twice the midsegment:${steps(`x = 2 \\cdot ${known} = ${2 * known}`)}`,
                      `第三边是中位线的两倍：${steps(`x = 2 \\cdot ${known} = ${2 * known}`)}`,
                    ),
                  ),
              check(
                t(
                  findDE
                    ? `Go the other way: doubling the midsegment gives $2 \\cdot ${de} = ${bc}$, which is $${B}${C}$. And $\\overline{${D}${E}}$, at $${de}$, is the shorter of the two, as a midsegment must be.`
                    : `Go the other way: halving the third side gives $${bc} \\div 2 = ${de}$, which is $${D}${E}$. And $\\overline{${B}${C}}$, at $${bc}$, is the longer of the two, as the third side must be.`,
                  findDE
                    ? `反过来算：把中位线乘以 2，$2 \\cdot ${de} = ${bc}$，正是 $${B}${C}$。而且 $\\overline{${D}${E}}$ 长 $${de}$，是两者中较短的，中位线理应如此。`
                    : `反过来算：把第三边除以 2，$${bc} \\div 2 = ${de}$，正是 $${D}${E}$。而且 $\\overline{${B}${C}}$ 长 $${bc}$，是两者中较长的，第三边理应如此。`,
                ),
              ),
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              [...base, ...midsegmentTones(n)],
              `The same triangle with the midsegment ${D}${E} in one color and the third side ${B}${C} in another.`,
              `同样的三角形：中位线 ${D}${E} 用一种颜色，第三边 ${B}${C} 用另一种颜色。`,
            ),
          ],
        };
      },
    },
    {
      id: "midsegments-with-algebra",
      title: t("Midsegments with algebra", "含未知数的中位线"),
      explanation: t(
        `When the lengths are expressions, the midpoint theorem gives the equation $BC = 2 \\cdot DE$. Remember the factor $2$, and put it on the midsegment's side.\n\nIf $DE = 2x + 1$ and $BC = 5x - 4$:${steps("5x - 4 = 2(2x + 1) \\quad\\Rightarrow\\quad 5x - 4 = 4x + 2 \\quad\\Rightarrow\\quad x = 6")}Then $DE = 13$ and $BC = 26$, twice as long.\n\n> **Watch out.** Setting $5x - 4 = 2x + 1$ forgets the factor, and $2(5x - 4) = 2x + 1$ puts it on the long side. And the question asks for $x$, not for a length.`,
        `当长度是式子时，中位线定理给出方程 $BC = 2 \\cdot DE$。别忘了因数 $2$，它乘在中位线这一边。\n\n若 $DE = 2x + 1$，$BC = 5x - 4$：${steps("5x - 4 = 2(2x + 1) \\quad\\Rightarrow\\quad 5x - 4 = 4x + 2 \\quad\\Rightarrow\\quad x = 6")}于是 $DE = 13$，$BC = 26$，正好是两倍。\n\n> **注意。** 列成 $5x - 4 = 2x + 1$ 是忘了因数 $2$；列成 $2(5x - 4) = 2x + 1$ 是把 $2$ 乘在了长边上。另外，题目求的是 $x$，不是长度。`,
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
          const [de, bc] = [a * x + b, c * x + d];
          const moved = `${linear(c - 2 * a, 0)} = ${2 * b - d}`;
          return {
            ...numberProblem({
              prompt: t(
                `$${D}$ and $${E}$ are the midpoints of $\\overline{${A}${B}}$ and $\\overline{${A}${C}}$. Find $x$.`,
                `$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点。求 $x$。`,
              ),
              answer: x,
              solveFor: "x",
              wrong: [...(a === c ? [] : [Q.of(d - b, a - c)]), ...(2 * c === a ? [] : [Q.of(b - 2 * d, 2 * c - a)]), a * x + b],
              solution: paras(
                step(
                  1,
                  "write the equation",
                  "列方程",
                  t(
                    `$\\overline{${D}${E}}$ is a midsegment and $\\overline{${B}${C}}$ the third side, so the theorem says $${B}${C} = 2 \\cdot ${D}${E}$:${steps(`${linear(c, d)} = 2(${linear(a, b)})`)}`,
                    `$\\overline{${D}${E}}$ 是中位线，$\\overline{${B}${C}}$ 是第三边，所以由定理 $${B}${C} = 2 \\cdot ${D}${E}$：${steps(`${linear(c, d)} = 2(${linear(a, b)})`)}`,
                  ),
                ),
                step(
                  2,
                  "solve it",
                  "解方程",
                  t(
                    `Expand, then collect the $x$ terms on one side:${steps(`${linear(c, d)} = ${linear(2 * a, 2 * b)}`, moved, `x = ${x}`)}`,
                    `展开，再把含 $x$ 的项移到一边：${steps(`${linear(c, d)} = ${linear(2 * a, 2 * b)}`, moved, `x = ${x}`)}`,
                  ),
                ),
                check(
                  t(
                    `Put $x = ${x}$ back into both lengths: $${D}${E} = ${de}$ and $${B}${C} = ${bc}$, and $2 \\cdot ${de} = ${2 * de}$, so the third side is indeed twice the midsegment.`,
                    `把 $x = ${x}$ 代回两个长度：$${D}${E} = ${de}$，$${B}${C} = ${bc}$，而 $2 \\cdot ${de} = ${2 * de}$，第三边确实是中位线的两倍。`,
                  ),
                ),
              ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "the-midsegment-triangle",
      figure: similarityDrawings["the-midsegment-triangle"],
      title: t("The midsegment triangle", "中点三角形"),
      explanation: t(
        "The three midsegments of a triangle form a smaller triangle. Each of its sides is half of the side it is parallel to, so its perimeter is half the perimeter of the original triangle.\n\nIf the sides of $\\triangle ABC$ are $10$, $14$ and $16$, the triangle formed by the midpoints has sides $5$, $7$, $8$ and perimeter $5 + 7 + 8 = 20$, half of $10 + 14 + 16 = 40$.\n\n> **Watch out.** The perimeter halves; it is the area that becomes a quarter, since the four small triangles the midsegments make are all congruent. And each midsegment pairs with the side it is parallel to, the one it does not touch.",
        "三角形的三条中位线围成一个较小的三角形。它的每条边都是与之平行的边的一半，所以它的周长是原三角形周长的一半。\n\n若 $\\triangle ABC$ 的三边为 $10$、$14$、$16$，由三边中点构成的三角形三边为 $5$、$7$、$8$，周长为 $5 + 7 + 8 = 20$，是 $10 + 14 + 16 = 40$ 的一半。\n\n> **注意。** 周长变为一半；变为四分之一的是面积，因为三条中位线分出的四个小三角形全等。每条中位线与它平行的那条边配对，也就是它不碰到的那条边。",
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
          const ticks: Mark[] = [
            { kind: "ticks", a: pa, b: pd, count: 1 },
            { kind: "ticks", a: pd, b: pb, count: 1 },
            { kind: "ticks", a: pb, b: pe, count: 2 },
            { kind: "ticks", a: pe, b: pc, count: 2 },
            { kind: "ticks", a: pc, b: pf, count: 3 },
            { kind: "ticks", a: pf, b: pa, count: 3 },
          ];
          const letters: Mark[] = [...names([pa, pb, pc], `${A}${B}${C}`), ...names([pd, pe, pf], `${D}${E}${F}`, center([pa, pb, pc]))];
          // Side DE is parallel to CA, EF to AB, FD to BC.
          const fig = figure(
            [
              { kind: "polygon", points: [pa, pb, pc] },
              { kind: "polygon", points: [pd, pe, pf] },
              ...ticks,
              ...big,
              ...smallLabels.map(
                ([p, q, v]): Mark => ({
                  kind: "side",
                  a: ccw ? (q as Point) : (p as Point),
                  b: ccw ? (p as Point) : (q as Point),
                  text: (v as Q).toString(),
                }),
              ),
              ...letters,
            ],
            fromBig
              ? `Triangle ${A}${B}${C} with ${A}${D} = ${D}${B}, ${B}${E} = ${E}${C}, ${C}${F} = ${F}${A}, and ${A}${D} = ${sides[0] / 2}, ${B}${E} = ${sides[1] / 2}, ${C}${F} = ${sides[2] / 2}.`
              : `Triangle ${A}${B}${C} with midpoints ${D}, ${E}, ${F} of its sides; ${E}${F} = ${half[0]}, ${F}${D} = ${half[1]}, ${D}${E} = ${half[2]}.`,
            fromBig
              ? `三角形 ${A}${B}${C}，${A}${D} = ${D}${B}，${B}${E} = ${E}${C}，${C}${F} = ${F}${A}，且 ${A}${D} = ${sides[0] / 2}，${B}${E} = ${sides[1] / 2}，${C}${F} = ${sides[2] / 2}。`
              : `三角形 ${A}${B}${C}，${D}、${E}、${F} 是各边中点；${E}${F} = ${half[0]}，${F}${D} = ${half[1]}，${D}${E} = ${half[2]}。`,
          );
          // The pairs: EF ∥ AB, FD ∥ BC, DE ∥ CA; the solution figure colors the small triangle against the large one.
          const toned = figure(
            [
              { kind: "polygon", points: [pa, pb, pc] },
              { kind: "polygon", points: [pd, pe, pf] },
              ...ticks,
              { kind: "segment", a: pa, b: pb, tone: "action" },
              { kind: "segment", a: pe, b: pf, tone: "action" },
              { kind: "segment", a: pb, b: pc, tone: "result" },
              { kind: "segment", a: pf, b: pd, tone: "result" },
              { kind: "segment", a: pc, b: pa, accent: true },
              { kind: "segment", a: pd, b: pe, accent: true },
              ...letters,
            ],
            `Triangle ${A}${B}${C} and the midsegment triangle ${D}${E}${F}, with each midsegment drawn in the same color as the side it is parallel to: ${E}${F} with ${A}${B}, ${F}${D} with ${B}${C}, ${D}${E} with ${C}${A}.`,
            `三角形 ${A}${B}${C} 与中点三角形 ${D}${E}${F}，每条中位线与和它平行的边同色：${E}${F} 与 ${A}${B}，${F}${D} 与 ${B}${C}，${D}${E} 与 ${C}${A}。`,
          );
          const halfSum = Q.of(perimeter, 2);
          const pairs = t(
            `Each side of $\\triangle ${D}${E}${F}$ is a midsegment, half of the side it is parallel to, the one it does not touch: $\\overline{${E}${F}} \\parallel \\overline{${A}${B}}$, $\\overline{${F}${D}} \\parallel \\overline{${B}${C}}$ and $\\overline{${D}${E}} \\parallel \\overline{${C}${A}}$.\n\n{{figure 0}}`,
            `$\\triangle ${D}${E}${F}$ 的每条边都是中位线，等于与之平行的边（也就是它不碰到的那条边）的一半：$\\overline{${E}${F}} \\parallel \\overline{${A}${B}}$，$\\overline{${F}${D}} \\parallel \\overline{${B}${C}}$，$\\overline{${D}${E}} \\parallel \\overline{${C}${A}}$。\n\n{{figure 0}}`,
          );
          const halves = `${half[0]!.toLatex()} + ${half[1]!.toLatex()} + ${half[2]!.toLatex()}`;
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
                solution: paras(
                  step(1, "pair each midsegment with its side", "把每条中位线与对应的边配对", pairs),
                  step(
                    2,
                    "halve the sides and add",
                    "取一半再相加",
                    t(
                      `So $${E}${F} = ${half[0]!.toLatex()}$, $${F}${D} = ${half[1]!.toLatex()}$ and $${D}${E} = ${half[2]!.toLatex()}$, and the perimeter is${steps(`${halves} = ${halfSum.toLatex()}`)}`,
                      `所以 $${E}${F} = ${half[0]!.toLatex()}$，$${F}${D} = ${half[1]!.toLatex()}$，$${D}${E} = ${half[2]!.toLatex()}$，周长为${steps(`${halves} = ${halfSum.toLatex()}`)}`,
                    ),
                  ),
                  check(
                    t(
                      `Add first, then halve: the perimeter of $\\triangle ${A}${B}${C}$ is $${sides[0]} + ${sides[1]} + ${sides[2]} = ${perimeter}$, and half of it is $${halfSum.toLatex()}$, the same.`,
                      `先加再除以 2：$\\triangle ${A}${B}${C}$ 的周长是 $${sides[0]} + ${sides[1]} + ${sides[2]} = ${perimeter}$，它的一半是 $${halfSum.toLatex()}$，结果相同。`,
                    ),
                  ),
                ),
              }),
              figure: {
                ...fig,
                svg: sketch([{ kind: "polygon", points: [pa, pb, pc] }, { kind: "polygon", points: [pd, pe, pf] }, ...letters, ...ticks]),
                alt: t(
                  `Triangle ${A}${B}${C} with ${D}, ${E}, ${F} the midpoints of ${A}${B}, ${B}${C}, ${C}${A}, joined to form triangle ${D}${E}${F}.`,
                  `三角形 ${A}${B}${C}，${D}、${E}、${F} 分别是 ${A}${B}、${B}${C}、${C}${A} 的中点，连成三角形 ${D}${E}${F}。`,
                ),
              },
              solutionFigures: [toned],
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
              solution: paras(
                step(1, "pair each midsegment with its side", "把每条中位线与对应的边配对", pairs),
                step(
                  2,
                  "double the midsegments and add",
                  "乘以 2 再相加",
                  t(
                    `So $${A}${B} = ${sides[0]}$, $${B}${C} = ${sides[1]}$ and $${C}${A} = ${sides[2]}$, and the perimeter is${steps(`${sides[0]} + ${sides[1]} + ${sides[2]} = ${perimeter}`)}`,
                    `所以 $${A}${B} = ${sides[0]}$，$${B}${C} = ${sides[1]}$，$${C}${A} = ${sides[2]}$，周长为${steps(`${sides[0]} + ${sides[1]} + ${sides[2]} = ${perimeter}`)}`,
                  ),
                ),
                check(
                  t(
                    `Add first, then double: the perimeter of $\\triangle ${D}${E}${F}$ is $${halves} = ${halfSum.toLatex()}$, and twice that is $${perimeter}$, the same.`,
                    `先加再乘以 2：$\\triangle ${D}${E}${F}$ 的周长是 $${halves} = ${halfSum.toLatex()}$，它的两倍是 $${perimeter}$，结果相同。`,
                  ),
                ),
              ),
            }),
            figure: fig,
            solutionFigures: [toned],
          };
        }
      },
    },
    {
      id: "angles-at-a-midsegment",
      figure: similarityDrawings["angles-at-a-midsegment"],
      title: t("Angles at a midsegment", "中位线处的角"),
      explanation: t(
        "Since a midsegment is parallel to the third side, the angles it makes are corresponding angles or consecutive interior angles of parallel lines.\n\nIf $\\overline{DE}$ joins the midpoints of $\\overline{AB}$ and $\\overline{AC}$ and $m\\angle B = 65^\\circ$, then $m\\angle ADE = 65^\\circ$ (corresponding angles) and $m\\angle BDE = 180^\\circ - 65^\\circ = 115^\\circ$ (consecutive interior angles). The two angles at $D$ make a straight line, and indeed $65^\\circ + 115^\\circ = 180^\\circ$.\n\n> **Watch out.** At $D$, the angle that opens toward $A$ matches $\\angle B$; the angle that opens toward $B$ adds with $\\angle B$ to $180^\\circ$. Giving $65^\\circ$ for $\\angle BDE$ confuses the two.",
        "由于中位线平行于第三边，它与两边所成的角就是平行线的同位角或同旁内角。\n\n若 $\\overline{DE}$ 连接 $\\overline{AB}$ 与 $\\overline{AC}$ 的中点，$m\\angle B = 65^\\circ$，则 $m\\angle ADE = 65^\\circ$（同位角），$m\\angle BDE = 180^\\circ - 65^\\circ = 115^\\circ$（同旁内角）。$D$ 处的两个角组成平角，确实 $65^\\circ + 115^\\circ = 180^\\circ$。\n\n> **注意。** 在 $D$ 处，开口朝向 $A$ 的角与 $\\angle B$ 相等；开口朝向 $B$ 的角与 $\\angle B$ 相加得 $180^\\circ$。说 $\\angle BDE$ 是 $65^\\circ$ 就把两者弄混了。",
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
        const [P, Q2, , M] = atB ? [B, D, C, E] : [C, E, B, D];
        const askInner = rng.bool();
        const answer = askInner ? 180 - given : given;
        const bare = nestedMarks(n, L, { ticks: true });
        const givenArc: Mark = { kind: "arc", vertex: base, from: other, to: near, label: `${given}°`, accent: true };
        const xArc: Mark = askInner
          ? { kind: "arc", vertex: near, from: base, to: otherNear, label: "x", accent: true }
          : { kind: "arc", vertex: near, from: otherNear, to: n.pa, label: "x", accent: true };
        const fig = figure(
          [...bare, givenArc, xArc],
          `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B} and ${E} the midpoint of ${A}${C}; angle ${P} is ${given}°, and x is the angle ${askInner ? `${P}${Q2}${M}` : `${A}${Q2}${M}`}.`,
          `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${E} 是 ${A}${C} 的中点；角 ${P} 为 ${given}°，x 是角 ${askInner ? `${P}${Q2}${M}` : `${A}${Q2}${M}`}。`,
        );
        const parallel: Mark[] = [
          { kind: "arrows", a: n.pd, b: n.pe, count: 1 },
          { kind: "arrows", a: n.pb, b: n.pc, count: 1 },
        ];
        const [inner, outer] = askInner ? [answer, given] : [180 - given, answer];
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
            solution: paras(
              step(
                1,
                "find the parallel lines",
                "找出平行线",
                t(
                  `$\\overline{${D}${E}}$ joins two midpoints, so by the midpoint theorem $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$, and $\\overline{${A}${P}}$ is a transversal of the two:\n\n{{figure 0}}`,
                  `$\\overline{${D}${E}}$ 连接两个中点，所以由中位线定理 $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，$\\overline{${A}${P}}$ 是它们的截线：\n\n{{figure 0}}`,
                ),
              ),
              askInner
                ? step(
                    2,
                    "use consecutive interior angles",
                    "用同旁内角",
                    t(
                      `$\\angle ${P}${Q2}${M}$ and $\\angle ${P}$ lie between the parallels on the same side of the transversal: consecutive interior angles, which are supplementary.${steps(`x = 180^\\circ - ${given}^\\circ = ${answer}^\\circ`)}`,
                      `$\\angle ${P}${Q2}${M}$ 与 $\\angle ${P}$ 在两条平行线之间、截线的同一侧：是同旁内角，互补。${steps(`x = 180^\\circ - ${given}^\\circ = ${answer}^\\circ`)}`,
                    ),
                  )
                : step(
                    2,
                    "use corresponding angles",
                    "用同位角",
                    t(
                      `$\\angle ${A}${Q2}${M}$ and $\\angle ${P}$ sit in the same position where the transversal crosses each parallel: corresponding angles, which are congruent. So $x = ${given}^\\circ$.`,
                      `$\\angle ${A}${Q2}${M}$ 与 $\\angle ${P}$ 在截线与两条平行线的交点处位置相同：是同位角，相等。所以 $x = ${given}^\\circ$。`,
                    ),
                  ),
              check(
                t(
                  askInner
                    ? `Go by the other angle at $${Q2}$: $\\angle ${A}${Q2}${M}$ corresponds to $\\angle ${P}$, so it is $${outer}^\\circ$. The two angles at $${Q2}$ along $\\overline{${A}${P}}$ make a straight line, so $x = 180^\\circ - ${outer}^\\circ = ${inner}^\\circ$, the same.`
                    : `Go by the other angle at $${Q2}$: $\\angle ${P}${Q2}${M}$ and $\\angle ${P}$ are consecutive interior angles, so $\\angle ${P}${Q2}${M}$ is $180^\\circ - ${given}^\\circ = ${inner}^\\circ$. The two angles at $${Q2}$ along $\\overline{${A}${P}}$ make a straight line, so $x = 180^\\circ - ${inner}^\\circ = ${outer}^\\circ$, the same.`,
                  askInner
                    ? `换用 $${Q2}$ 处的另一个角：$\\angle ${A}${Q2}${M}$ 与 $\\angle ${P}$ 是同位角，所以它是 $${outer}^\\circ$。$${Q2}$ 处沿 $\\overline{${A}${P}}$ 的两个角组成平角，所以 $x = 180^\\circ - ${outer}^\\circ = ${inner}^\\circ$，结果相同。`
                    : `换用 $${Q2}$ 处的另一个角：$\\angle ${P}${Q2}${M}$ 与 $\\angle ${P}$ 是同旁内角，所以 $\\angle ${P}${Q2}${M}$ 是 $180^\\circ - ${given}^\\circ = ${inner}^\\circ$。$${Q2}$ 处沿 $\\overline{${A}${P}}$ 的两个角组成平角，所以 $x = 180^\\circ - ${inner}^\\circ = ${outer}^\\circ$，结果相同。`,
                ),
              ),
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              [...bare, ...parallel.flatMap(highlighted), givenArc, { ...xArc, tone: "result" }],
              `The same triangle with ${D}${E} and ${B}${C} marked parallel and highlighted, and the angles ${P} and x marked.`,
              `同样的三角形：${D}${E} 与 ${B}${C} 标为平行并用颜色突出，角 ${P} 与 x 已标出。`,
            ),
          ],
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
  const n = nestedPoints(rng, 0.5);
  const f = nestedFacts(n);
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
        marks: [...f.midD, ...f.midE],
        drawn: true,
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
      { s: m(`\\angle ${A} \\cong \\angle ${A}`), r: "reflexive", marks: f.atA },
      {
        s: m(`\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}`),
        r: "sas",
        why: t(
          `The angle at $${A}$ lies between the proportional sides $${A}${D}, ${A}${B}$ and $${A}${E}, ${A}${C}$.`,
          `$${A}$ 处的角正是成比例的边 $${A}${D}, ${A}${B}$ 与 $${A}${E}, ${A}${C}$ 的夹角。`,
        ),
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
        marks: [
          { kind: "segment", a: n.pd, b: n.pe, tone: "result" },
          { kind: "segment", a: n.pb, b: n.pc, tone: "result" },
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
        marks: f.atD,
      },
      {
        s: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`),
        r: "corrConverse",
        alts: [
          m(`\\overline{${D}${E}} \\perp \\overline{${A}${B}}`),
          m(`\\overline{${A}${D}} \\parallel \\overline{${A}${E}}`),
          m(`${D}${E} = ${B}${C}`),
        ],
        marks: f.parallel,
      },
    ],
    base: nestedMarks(n, L, {}),
    alt: [
      `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B} and ${E} the midpoint of ${A}${C}, joined by ${D}${E}.`,
      `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${E} 是 ${A}${C} 的中点，连接 ${D}${E}。`,
    ],
    parts: [2, 3],
  };
}

/** midpointConverseProof proves that the line through the midpoint of one side parallel to another bisects the third side. */
function midpointConverseProof(rng: Rng): Proof {
  const L = pickFive(rng);
  const [A, B, C, D, E] = L;
  const n = nestedPoints(rng, 0.5);
  const f = nestedFacts(n);
  return {
    given: t(
      `$${D}$ is the midpoint of $\\overline{${A}${B}}$, $${E}$ is on $\\overline{${A}${C}}$, $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
      `$${D}$ 是 $\\overline{${A}${B}}$ 的中点，$${E}$ 在 $\\overline{${A}${C}}$ 上，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$`,
    ),
    prove: t(`$${E}$ is the midpoint of $\\overline{${A}${C}}$`, `$${E}$ 是 $\\overline{${A}${C}}$ 的中点`),
    steps: [
      { s: m(`\\overline{${D}${E}} \\parallel \\overline{${B}${C}}`), r: "given", marks: [...f.parallel, ...f.midD], drawn: true },
      {
        s: m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${B}${C}`),
        r: "corresponding",
        alts: [
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${C}${B}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}${E}${D}`),
          m(`\\angle ${A}${D}${E} \\cong \\angle ${A}`),
        ],
        marks: f.atD,
      },
      { s: m(`\\angle ${A} \\cong \\angle ${A}`), r: "reflexive", marks: f.atA },
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
        marks: f.midE,
      },
    ],
    base: nestedMarks(n, L, {}),
    alt: [
      `Triangle ${A}${B}${C} with ${D} the midpoint of ${A}${B}, and ${D}${E} parallel to ${B}${C} with ${E} on ${A}${C}.`,
      `三角形 ${A}${B}${C}，${D} 是 ${A}${B} 的中点，${D}${E} ∥ ${B}${C}，${E} 在 ${A}${C} 上。`,
    ],
    parts: [1, 2],
  };
}

const midpointPool: readonly Derived[] = [
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
  intro: t(
    "We have used the midpoint theorem: the segment joining the midpoints of two sides of a triangle is parallel to the third side and half as long. Now we see why it is true. The segment cuts off a small triangle at the top, and SAS shows that this triangle is a half-size copy of the whole.\n\nTake $\\triangle PQR$ with $PQ = 10$, $PR = 14$ and $QR = 12$, and let $M$ and $N$ be the midpoints of $\\overline{PQ}$ and $\\overline{PR}$. Then $PM = 5$ and $PN = 7$, so $5 \\div 10$ and $7 \\div 14$ are both $\\frac{1}{2}$, and the angle at $P$ lies between these sides in both triangles. By SAS, $\\triangle PMN \\sim \\triangle PQR$ with scale factor $\\frac{1}{2}$: so $MN = \\frac{1}{2} \\cdot 12 = 6$, and $\\angle PMN \\cong \\angle PQR$, which makes $\\overline{MN} \\parallel \\overline{QR}$.\n\nIn this lesson we write that argument as a two-column proof, prove the converse the same way, and check the theorem with coordinates.",
    "我们已经用过中位线定理：连接三角形两边中点的线段平行于第三边，且等于第三边的一半。现在来看它为什么成立。这条线段在顶上截出一个小三角形，而 SAS 说明这个小三角形正是整个三角形缩小一半的样子。\n\n设 $\\triangle PQR$ 中 $PQ = 10$，$PR = 14$，$QR = 12$，$M$、$N$ 分别是 $\\overline{PQ}$、$\\overline{PR}$ 的中点。于是 $PM = 5$，$PN = 7$，$5 \\div 10$ 与 $7 \\div 14$ 都等于 $\\frac{1}{2}$，而且在两个三角形中，$P$ 处的角都是这两边的夹角。由 SAS，$\\triangle PMN \\sim \\triangle PQR$，相似比为 $\\frac{1}{2}$：所以 $MN = \\frac{1}{2} \\cdot 12 = 6$，并且 $\\angle PMN \\cong \\angle PQR$，从而 $\\overline{MN} \\parallel \\overline{QR}$。\n\n这节课我们把这个论证写成两栏式证明，用同样的方法证明逆定理，并用坐标验证定理。",
  ),
  knowledgePoints: [
    {
      id: "proving-the-theorem",
      figure: similarityDrawings["proving-the-theorem"],
      title: t("Proving the theorem", "证明定理"),
      explanation: t(
        "Let $D$ and $E$ be the midpoints of $\\overline{AB}$ and $\\overline{AC}$.\n\n1. $AD = \\frac{1}{2}AB$ and $AE = \\frac{1}{2}AC$: definition of a midpoint.\n2. $\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{2}$, and $\\angle A \\cong \\angle A$.\n3. $\\triangle ADE \\sim \\triangle ABC$ by SAS, with scale factor $\\frac{1}{2}$.\n4. So $DE = \\frac{1}{2}BC$, and $\\angle ADE \\cong \\angle ABC$.\n5. Congruent corresponding angles make $\\overline{DE} \\parallel \\overline{BC}$.\n\nThe proof gets both halves of the theorem from one similarity: the length from the proportional sides, the parallel lines from the congruent angles.\n\n> **Watch out.** SAS compares sides of $\\triangle ADE$ with sides of $\\triangle ABC$, so the ratio is part over whole, $\\frac{AD}{AB}$. The ratio $\\frac{AD}{DB} = 1$ compares the two halves of one side, and $\\overline{DB}$ is not a side of either triangle.",
        "设 $D$、$E$ 分别是 $\\overline{AB}$、$\\overline{AC}$ 的中点。\n\n1. $AD = \\frac{1}{2}AB$，$AE = \\frac{1}{2}AC$：中点的定义。\n2. $\\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{1}{2}$，且 $\\angle A \\cong \\angle A$。\n3. 由 SAS，$\\triangle ADE \\sim \\triangle ABC$，相似比为 $\\frac{1}{2}$。\n4. 所以 $DE = \\frac{1}{2}BC$，且 $\\angle ADE \\cong \\angle ABC$。\n5. 同位角相等，所以 $\\overline{DE} \\parallel \\overline{BC}$。\n\n一个相似同时给出定理的两部分：成比例的边给出长度，相等的角给出平行。\n\n> **注意。** SAS 比较的是 $\\triangle ADE$ 的边与 $\\triangle ABC$ 的边，所以比是部分比整体 $\\frac{AD}{AB}$。$\\frac{AD}{DB} = 1$ 比较的是同一条边的两半，而 $\\overline{DB}$ 不是这两个三角形的边。",
      ),
      generate: (rng) => proofProblem(rng, midpointTheoremProof(rng), midpointPool),
    },
    {
      id: "proving-the-converse",
      figure: similarityDrawings["proving-the-midpoint-theorem#proving-the-converse"],
      title: t("Proving the converse", "证明逆定理"),
      explanation: t(
        "**Converse:** the line through the midpoint of one side of a triangle, parallel to a second side, passes through the midpoint of the third side.\n\nWith $D$ the midpoint of $\\overline{AB}$ and $\\overline{DE} \\parallel \\overline{BC}$: corresponding angles give $\\angle ADE \\cong \\angle ABC$, and $\\angle A$ is shared, so $\\triangle ADE \\sim \\triangle ABC$ by AA. Then $\\frac{AE}{AC}$ equals $\\frac{AD}{AB}$, which is $\\frac{1}{2}$, so $E$ is the midpoint of $\\overline{AC}$.\n\nThis time the parallel lines are given and supply the angles, so AA replaces SAS.\n\n> **Watch out.** The converse needs both facts, the midpoint $D$ and the parallel segment. A segment from $D$ that is not parallel to $\\overline{BC}$ can meet $\\overline{AC}$ anywhere, and a parallel through some other point of $\\overline{AB}$ cuts $\\overline{AC}$ in that point's ratio, not in half.",
        "**逆定理**：过三角形一边的中点、平行于另一边的直线，必经过第三边的中点。\n\n设 $D$ 是 $\\overline{AB}$ 的中点，$\\overline{DE} \\parallel \\overline{BC}$：由同位角得 $\\angle ADE \\cong \\angle ABC$，$\\angle A$ 是公共角，所以由 AA，$\\triangle ADE \\sim \\triangle ABC$。于是 $\\frac{AE}{AC}$ 等于 $\\frac{AD}{AB}$，即 $\\frac{1}{2}$，所以 $E$ 是 $\\overline{AC}$ 的中点。\n\n这一次平行线是已知的，它提供了角，所以用 AA 代替 SAS。\n\n> **注意。** 逆定理两个条件都要有：$D$ 是中点，且线段平行。从 $D$ 出发但不平行于 $\\overline{BC}$ 的线段，可以交 $\\overline{AC}$ 于任意一点；而过 $\\overline{AB}$ 上其他点的平行线，按那一点的比例分 $\\overline{AC}$，不是分成两半。",
      ),
      generate: (rng) => proofProblem(rng, midpointConverseProof(rng), midpointPool),
    },
    {
      id: "checking-with-coordinates",
      title: t("Checking with coordinates", "用坐标验证"),
      explanation: t(
        "The **midpoint** of the segment from $(x_1, y_1)$ to $(x_2, y_2)$ averages the coordinates: $\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$. With coordinates, the midpoint theorem can be checked: parallel lines have equal slopes, so the midsegment has the same slope as the third side.\n\nFor $A(2, 6)$, $B(-4, 0)$, $C(6, -2)$: the midpoints of $\\overline{AB}$ and $\\overline{AC}$ are $D(-1, 3)$ and $E(4, 2)$. The slope of $\\overline{DE}$ is $(2 - 3) \\div (4 - (-1)) = -\\frac{1}{5}$, and the slope of $\\overline{BC}$ is $(-2 - 0) \\div (6 - (-4)) = -\\frac{1}{5}$, the same.\n\n> **Watch out.** Average the coordinates; do not subtract them: halfway between $(-4, 0)$ and $(2, 6)$ is $(-1, 3)$, not $(3, 3)$. And the slope of $\\overline{DE}$ is not the slope of $\\overline{AB}$ or $\\overline{AC}$; it matches the third side, $\\overline{BC}$.",
        "从 $(x_1, y_1)$ 到 $(x_2, y_2)$ 的线段的**中点**是两端坐标的平均：$\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$。用坐标可以验证中位线定理：平行线的斜率相等，所以中位线与第三边的斜率相同。\n\n对 $A(2, 6)$、$B(-4, 0)$、$C(6, -2)$：$\\overline{AB}$ 与 $\\overline{AC}$ 的中点为 $D(-1, 3)$ 和 $E(4, 2)$。$\\overline{DE}$ 的斜率为 $(2 - 3) \\div (4 - (-1)) = -\\frac{1}{5}$，$\\overline{BC}$ 的斜率为 $(-2 - 0) \\div (6 - (-4)) = -\\frac{1}{5}$，相同。\n\n> **注意。** 中点是坐标取平均，不是相减：$(-4, 0)$ 与 $(2, 6)$ 的中点是 $(-1, 3)$，不是 $(3, 3)$。$\\overline{DE}$ 的斜率也不是 $\\overline{AB}$ 或 $\\overline{AC}$ 的斜率；它与第三边 $\\overline{BC}$ 的斜率相同。",
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
          const mid = (name: string, p: readonly number[], q: readonly number[], r: readonly number[]) =>
            `${name} = \\left(\\frac{${p[0]} + ${sub(q[0]!)}}{2}, \\frac{${p[1]} + ${sub(q[1]!)}}{2}\\right) = ${pointLatex(r as [number, number])}`;
          const slopeLine = (p: readonly number[], q: readonly number[]) =>
            `\\frac{${q[1]} - ${sub(p[1]!)}}{${q[0]} - ${sub(p[0]!)}} = \\frac{${q[1]! - p[1]!}}{${q[0]! - p[0]!}} = ${slope.toLatex()}`;
          const ctr = center([a, b, c]);
          const away = (p: Point): Compass => compassOf(p[0] - ctr[0], p[1] - ctr[1]);
          const marks: PlaneMark[] = [
            { kind: "segment", a, b },
            { kind: "segment", a: b, b: c, tone: "action" },
            { kind: "segment", a: c, b: a },
            { kind: "segment", a: d, b: e, tone: "result" },
            { kind: "point", at: a, label: A, dir: away(a) },
            { kind: "point", at: b, label: B, dir: away(b) },
            { kind: "point", at: c, label: C, dir: away(c) },
            { kind: "point", at: d, label: D, dir: away(d) },
            { kind: "point", at: e, label: E, dir: away(e) },
          ];
          const pts = (ps: readonly [number, number][]) => ps.map((p) => pointLatex(p)).join(", ");
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${A}${B}${C}$, $${A}${pointLatex(a)}$, $${B}${pointLatex(b)}$ and $${C}${pointLatex(c)}$. $${D}$ and $${E}$ are the midpoints of $\\overline{${A}${B}}$ and $\\overline{${A}${C}}$. Find the slope of $\\overline{${D}${E}}$.`,
                `在 $\\triangle ${A}${B}${C}$ 中，$${A}${pointLatex(a)}$，$${B}${pointLatex(b)}$，$${C}${pointLatex(c)}$。$${D}$、$${E}$ 分别是 $\\overline{${A}${B}}$、$\\overline{${A}${C}}$ 的中点。求 $\\overline{${D}${E}}$ 的斜率。`,
              ),
              answer: slope,
              wrong: [Q.of(b[1] - a[1], b[0] - a[0]), Q.of(c[1] - a[1], c[0] - a[0]), Q.of(e[0] - d[0], e[1] - d[1] || 7), slope.neg()],
              solution: paras(
                step(
                  1,
                  "find the midpoints",
                  "求中点",
                  t(
                    `Average the coordinates of the endpoints:${steps(mid(D, a, b, d), mid(E, a, c, e))}`,
                    `把两端的坐标分别取平均：${steps(mid(D, a, b, d), mid(E, a, c, e))}`,
                  ),
                ),
                step(
                  2,
                  "find the slope",
                  "求斜率",
                  t(
                    `Rise over run from $${D}$ to $${E}$, drawn in the result color:\n\n{{figure 0}}${steps(slopeLine(d, e))}`,
                    `从 $${D}$ 到 $${E}$，纵坐标之差比横坐标之差（图中用结果色画出）：\n\n{{figure 0}}${steps(slopeLine(d, e))}`,
                  ),
                ),
                check(
                  t(
                    `By the midpoint theorem $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$, so $\\overline{${B}${C}}$ must have the same slope. From $${B}$ to $${C}$:${steps(slopeLine(b, c))}The two slopes agree, and the run from $${B}$ to $${C}$ is twice that from $${D}$ to $${E}$, as half the length requires.`,
                    `由中位线定理 $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，所以 $\\overline{${B}${C}}$ 的斜率必须相同。从 $${B}$ 到 $${C}$：${steps(slopeLine(b, c))}两个斜率一致，而且从 $${B}$ 到 $${C}$ 的横向变化是从 $${D}$ 到 $${E}$ 的两倍，符合“长度是一半”。`,
                  ),
                ),
              ),
            }),
            solutionFigures: [
              {
                svg: plane(viewAround([a, b, c]), marks),
                alt: t(
                  `Triangle ${A}${B}${C} with vertices ${pts([a, b, c])}, the midpoints ${D}${pointLatex(d)} and ${E}${pointLatex(e)}, and the segments ${D}${E} and ${B}${C} highlighted.`,
                  `顶点为 ${pts([a, b, c])} 的三角形 ${A}${B}${C}，中点 ${D}${pointLatex(d)} 与 ${E}${pointLatex(e)}，线段 ${D}${E} 与 ${B}${C} 用颜色标出。`,
                ),
              },
            ],
          };
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

/** partTones colors the parts of a nested figure: AD and AE, next to the apex, in the action color, and DB and EC in the result color. */
const partTones = ({ pa, pb, pc, pd, pe }: Nested): Mark[] => [
  { kind: "segment", a: pa, b: pd, tone: "action" },
  { kind: "segment", a: pa, b: pe, tone: "action" },
  { kind: "segment", a: pd, b: pb, tone: "result" },
  { kind: "segment", a: pe, b: pc, tone: "result" },
];

/** crossCheck checks AD/DB = AE/EC, for the letters L = A, B, C, D, E, by its cross-products and by part over whole. */
function crossCheck(L: readonly string[], AD: number, DB: number, AE: number, EC: number): Text {
  const [A, B, C, D, E] = L as [string, string, string, string, string];
  return t(
    `Cross-multiply the parts: $${A}${D} \\cdot ${E}${C} = ${AD} \\cdot ${EC} = ${AD * EC}$ and $${D}${B} \\cdot ${A}${E} = ${DB} \\cdot ${AE} = ${DB * AE}$, equal. And part over whole agrees on both sides: $${AD} \\div ${AD + DB} = ${fr(AD, AD + DB)}$ and $${AE} \\div ${AE + EC} = ${fr(AE, AE + EC)}$.`,
    `把各部分交叉相乘：$${A}${D} \\cdot ${E}${C} = ${AD} \\cdot ${EC} = ${AD * EC}$，$${D}${B} \\cdot ${A}${E} = ${DB} \\cdot ${AE} = ${DB * AE}$，相等。两边的部分比整体也一致：$${AD} \\div ${AD + DB} = ${fr(AD, AD + DB)}$，$${AE} \\div ${AE + EC} = ${fr(AE, AE + EC)}$。`,
  );
}

export const theTriangleProportionalityTheorem: TopicDef = {
  id: "the-triangle-proportionality-theorem",
  title: t("The Triangle Proportionality Theorem", "三角形比例定理（平行线分线段成比例）"),
  summary: t(
    "Use that a line parallel to one side of a triangle divides the other two sides proportionally, and its converse.",
    "运用平行于三角形一边的直线截其他两边所得线段成比例，以及它的逆定理。",
  ),
  prerequisites: ["the-midpoint-theorem"],
  encompasses: [{ topic: "proportions", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSG.SRT.B.4"],
  intro: t(
    "The midpoint theorem is about a segment through the midpoints. Move the segment up or down, keeping it parallel to the third side, and it still cuts off a triangle similar to the whole one, by AA. The two sides are then cut in the same ratio: if the cut is one third of the way down one side, it is one third of the way down the other.\n\nIn $\\triangle PQR$, let a line parallel to $\\overline{QR}$ meet $\\overline{PQ}$ at $M$ and $\\overline{PR}$ at $N$, with $PM = 3$, $MQ = 6$ and $PN = 4$. On $\\overline{PQ}$ the lower part is twice the upper part, $6 = 2 \\cdot 3$, so the same holds on $\\overline{PR}$: $NR = 2 \\cdot 4 = 8$.\n\nThis is the **triangle proportionality theorem**. In this lesson we use it with parts, with whole sides and with algebra, and use its converse to decide whether two segments are parallel.",
    "中位线定理讲的是过两边中点的线段。把这条线段上下平移，并保持与第三边平行，由 AA，它截出的三角形仍与整个三角形相似。于是两边被分成相同的比：如果在一条边上截在离顶点三分之一处，在另一条边上也截在三分之一处。\n\n在 $\\triangle PQR$ 中，一条平行于 $\\overline{QR}$ 的直线交 $\\overline{PQ}$ 于 $M$，交 $\\overline{PR}$ 于 $N$，$PM = 3$，$MQ = 6$，$PN = 4$。在 $\\overline{PQ}$ 上，下段是上段的两倍，$6 = 2 \\cdot 3$，所以在 $\\overline{PR}$ 上也一样：$NR = 2 \\cdot 4 = 8$。\n\n这就是**三角形比例定理**。这节课我们把它用于部分、整条边和含未知数的情形，并用它的逆定理判断两条线段是否平行。",
  ),
  knowledgePoints: [
    {
      id: "dividing-sides-proportionally",
      figure: similarityDrawings["dividing-sides-proportionally"],
      title: t("Dividing sides proportionally", "按比例分两边"),
      explanation: t(
        `**Triangle proportionality theorem:** if a line parallel to one side of a triangle meets the other two sides at $D$ and $E$, it divides them proportionally:${steps("\\frac{AD}{DB} = \\frac{AE}{EC}")}It follows from $\\triangle ADE \\sim \\triangle ABC$: both sides are cut in the same ratio. (The midpoint theorem is the case $AD = DB$.)\n\nIf $AD = 6$, $DB = 4$ and $AE = 9$:${steps("\\frac{6}{4} = \\frac{9}{EC} \\quad\\Rightarrow\\quad 6 \\cdot EC = 36 \\quad\\Rightarrow\\quad EC = 6")}\n\n> **Watch out.** Keep the same order on both sides, the part at the apex over the part at the base: $\\frac{6}{4} = \\frac{EC}{9}$ flips one ratio and gives $13.5$. And the theorem matches ratios, not differences: $EC$ is not $9 - 2 = 7$.`,
        `**三角形比例定理**：如果平行于三角形一边的直线与另两边交于 $D$、$E$，那么它把这两边分成比例线段：${steps("\\frac{AD}{DB} = \\frac{AE}{EC}")}它来自 $\\triangle ADE \\sim \\triangle ABC$：两条边被分成相同的比。（中位线定理是 $AD = DB$ 的情形。）\n\n若 $AD = 6$，$DB = 4$，$AE = 9$：${steps("\\frac{6}{4} = \\frac{9}{EC} \\quad\\Rightarrow\\quad 6 \\cdot EC = 36 \\quad\\Rightarrow\\quad EC = 6")}\n\n> **注意。** 两边的顺序要一致，都是靠近顶点的部分比靠近底边的部分：$\\frac{6}{4} = \\frac{EC}{9}$ 把一个比颠倒了，会得出 $13.5$。定理说的是比相等，不是差相等：$EC$ 不是 $9 - 2 = 7$。`,
      ),
      generate(rng) {
        const { AD, DB, AE, EC } = propParts(rng);
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const ask = rng.int(0, 3);
        const vals = [AD, DB, AE, EC];
        const labels = vals.map((v, i) => (i === ask ? "x" : String(v)));
        const n = nestedPoints(rng, AD / (AD + DB));
        const base = nestedMarks(n, L, { arrows: true, ad: labels[0], db: labels[1], ae: labels[2], ec: labels[3] });
        const fig = figure(
          base,
          `Triangle ${A}${B}${C} with ${D}${E} parallel to ${B}${C}; ${A}${D} = ${labels[0]}, ${D}${B} = ${labels[1]}, ${A}${E} = ${labels[2]}, ${E}${C} = ${labels[3]}.`,
          `三角形 ${A}${B}${C}，${D}${E} ∥ ${B}${C}；${A}${D} = ${labels[0]}，${D}${B} = ${labels[1]}，${A}${E} = ${labels[2]}，${E}${C} = ${labels[3]}。`,
        );
        const answer = vals[ask]!;
        const t1 = `\\frac{${labels[0]}}{${labels[1]}} = \\frac{${labels[2]}}{${labels[3]}}`;
        // Cross-multiplying puts x times a known length on one side: AD·EC = DB·AE.
        const [k, other] = [
          [EC, DB * AE],
          [AE, AD * EC],
          [DB, AD * EC],
          [AD, DB * AE],
        ][ask]!;
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
            solution: paras(
              step(
                1,
                "set up the proportion",
                "列比例式",
                t(
                  `$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$, so the theorem applies. On each side, put the part at $${A}$ over the part at the base; the parts at $${A}$ share one color and the parts at the base another:\n\n{{figure 0}}${steps(`\\frac{${A}${D}}{${D}${B}} = \\frac{${A}${E}}{${E}${C}}`, t1)}`,
                  `$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$，可以用定理。每条边都用靠近 $${A}$ 的部分比靠近底边的部分；靠近 $${A}$ 的部分用一种颜色，靠近底边的部分用另一种颜色：\n\n{{figure 0}}${steps(`\\frac{${A}${D}}{${D}${B}} = \\frac{${A}${E}}{${E}${C}}`, t1)}`,
                ),
              ),
              step(
                2,
                "cross-multiply and solve",
                "交叉相乘并求解",
                t(
                  `Cross-multiplying gives $${A}${D} \\cdot ${E}${C} = ${D}${B} \\cdot ${A}${E}$:${steps(`${k}x = ${other}`, `x = ${answer}`)}`,
                  `交叉相乘得 $${A}${D} \\cdot ${E}${C} = ${D}${B} \\cdot ${A}${E}$：${steps(`${k}x = ${other}`, `x = ${answer}`)}`,
                ),
              ),
              check(crossCheck(L, AD, DB, AE, EC)),
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              [...base, ...partTones(n)],
              `The same triangle with ${A}${D} and ${A}${E} in one color and ${D}${B} and ${E}${C} in another.`,
              `同样的三角形：${A}${D} 与 ${A}${E} 用一种颜色，${D}${B} 与 ${E}${C} 用另一种颜色。`,
            ),
          ],
        };
      },
    },
    {
      id: "parts-and-whole-sides",
      title: t("Parts and whole sides", "部分与整条边"),
      explanation: t(
        `The theorem compares parts with parts. When a whole side is given, find the parts first, or use a part over the whole on both sides: $\\frac{AD}{AB}$ equals $\\frac{AE}{AC}$, since $\\triangle ADE \\sim \\triangle ABC$.\n\nIf $AD = 4$, $AB = 10$ and $AC = 15$:${steps("\\frac{AE}{15} = \\frac{4}{10} \\quad\\Rightarrow\\quad AE = 6")}and $EC = 15 - 6 = 9$.\n\n> **Watch out.** Use the same kind of ratio on both sides: $\\frac{AE}{15} = \\frac{4}{6}$ puts a whole side over a part, and gives $10$, more than half of $15$ although $D$ is less than halfway down. And when the question asks for $EC$, subtract $AE$ from the whole side $AC$.`,
        `定理比较的是部分与部分。给出整条边时，先求出各部分，或者两边都用部分比整体：因为 $\\triangle ADE \\sim \\triangle ABC$，$\\frac{AD}{AB}$ 等于 $\\frac{AE}{AC}$。\n\n若 $AD = 4$，$AB = 10$，$AC = 15$：${steps("\\frac{AE}{15} = \\frac{4}{10} \\quad\\Rightarrow\\quad AE = 6")}于是 $EC = 15 - 6 = 9$。\n\n> **注意。** 两边要用同一种比：$\\frac{AE}{15} = \\frac{4}{6}$ 一边是部分比整体，另一边是部分比部分，会得出 $10$，超过 $15$ 的一半，可 $D$ 还没到边的一半。题目求 $EC$ 时，要用整条边 $AC$ 减去 $AE$。`,
      ),
      generate(rng) {
        const { AD, DB, AE, EC } = propParts(rng);
        const [AB, AC] = [AD + DB, AE + EC];
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const askEC = rng.bool();
        const answer = askEC ? EC : AE;
        const n = nestedPoints(rng, AD / AB);
        const fig = figure(
          nestedMarks(n, L, { arrows: true }),
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
            solution: paras(
              step(
                1,
                "compare part over whole",
                "部分比整体",
                t(
                  `$\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}$, so $${A}${E}$ is the same fraction of $${A}${C}$ as $${A}${D}$ is of $${A}${B}$; the parts and the wholes are drawn in two colors:\n\n{{figure 0}}${steps(prop(`${A}${E}`, String(AC), String(AD), String(AB)), `${A}${E} = \\frac{${AD} \\cdot ${AC}}{${AB}} = ${AE}`)}`,
                  `$\\triangle ${A}${D}${E} \\sim \\triangle ${A}${B}${C}$，所以 $${A}${E}$ 占 $${A}${C}$ 的比例与 $${A}${D}$ 占 $${A}${B}$ 的比例相同；图中部分与整体用两种颜色画出：\n\n{{figure 0}}${steps(prop(`${A}${E}`, String(AC), String(AD), String(AB)), `${A}${E} = \\frac{${AD} \\cdot ${AC}}{${AB}} = ${AE}`)}`,
                ),
              ),
              askEC
                ? step(
                    2,
                    "subtract from the whole side",
                    "用整条边相减",
                    t(
                      `$${E}$ splits $\\overline{${A}${C}}$, so${steps(`${E}${C} = ${AC} - ${AE} = ${EC}`)}`,
                      `$${E}$ 把 $\\overline{${A}${C}}$ 分成两段，所以${steps(`${E}${C} = ${AC} - ${AE} = ${EC}`)}`,
                    ),
                  )
                : step(
                    2,
                    "read off the answer",
                    "写出答案",
                    t(
                      `So $${A}${E} = ${AE}$, which leaves $${E}${C} = ${AC} - ${AE} = ${EC}$ for the rest of the side.`,
                      `所以 $${A}${E} = ${AE}$，这条边剩下的部分 $${E}${C} = ${AC} - ${AE} = ${EC}$。`,
                    ),
                  ),
              check(
                t(
                  `Compare parts with parts, with $${D}${B} = ${AB} - ${AD} = ${DB}$ and $${E}${C} = ${AC} - ${AE} = ${EC}$. `,
                  `用部分比部分检验，其中 $${D}${B} = ${AB} - ${AD} = ${DB}$，$${E}${C} = ${AC} - ${AE} = ${EC}$。`,
                ),
                crossCheck(L, AD, DB, AE, EC),
              ),
            ),
          }),
          figure: fig,
          solutionFigures: [
            figure(
              [...nestedMarks(n, L, { arrows: true, ad: String(AD) }), ...partTones(n)],
              `The same triangle with the parts ${A}${D} and ${A}${E} in one color and the rest of each side in another; the whole sides ${A}${B} = ${AB} and ${A}${C} = ${AC} are both colors together.`,
              `同样的三角形：部分 ${A}${D} 与 ${A}${E} 用一种颜色，每条边的其余部分用另一种颜色；整条边 ${A}${B} = ${AB} 与 ${A}${C} = ${AC} 由两种颜色合起来。`,
            ),
          ],
        };
      },
    },
    {
      id: "proportionality-with-algebra",
      figure: similarityDrawings["proportionality-with-algebra"],
      title: t("Proportionality with algebra", "含未知数的比例"),
      explanation: t(
        `A line parallel to one side of a triangle cuts the other two sides in the same ratio, so $\\frac{AD}{DB} = \\frac{AE}{EC}$ holds even when some of the lengths are unknown.\n\nWhen a segment is an expression, write the proportion, cross-multiply and solve.\n\nWith $AD = 4$, $DB = 6$, $AE = x + 2$ and $EC = 9$:${steps("\\frac{4}{6} = \\frac{x + 2}{9} \\quad\\Rightarrow\\quad 6(x + 2) = 36 \\quad\\Rightarrow\\quad x = 4")}Then $AE = 6$, and $4 : 6$ matches $6 : 9$.\n\n> **Watch out.** Flip neither ratio: $\\frac{4}{6} = \\frac{9}{x + 2}$ gives $x = 11.5$. And the question asks for $x$, not for the length $x + 2$.`,
        `平行于三角形一边的直线截另外两边所得的线段成比例，所以即使有些长度未知，$\\frac{AD}{DB} = \\frac{AE}{EC}$ 仍然成立。\n\n当一条线段是式子时，写出比例式，交叉相乘再求解。\n\n若 $AD = 4$，$DB = 6$，$AE = x + 2$，$EC = 9$：${steps("\\frac{4}{6} = \\frac{x + 2}{9} \\quad\\Rightarrow\\quad 6(x + 2) = 36 \\quad\\Rightarrow\\quad x = 4")}于是 $AE = 6$，$4 : 6$ 与 $6 : 9$ 相等。\n\n> **注意。** 两个比都不能颠倒：$\\frac{4}{6} = \\frac{9}{x + 2}$ 会得出 $x = 11.5$。另外，题目求的是 $x$，不是长度 $x + 2$。`,
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
          const L = pickFive(rng);
          const [A, B, C, D, E] = L;
          const expr = plain(c, d);
          const labels = [String(AD), String(DB), onAE ? expr : String(AE), onAE ? String(EC) : expr];
          const fig = figure(
            nestedMarks(nestedPoints(rng, AD / (AD + DB)), L, {
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
          // Cross-multiplying: DB·(cx + d) = AD·EC, or AD·(cx + d) = DB·AE.
          const cross = onAE ? `${DB}(${lin}) = ${AD * EC}` : `${AD}(${lin}) = ${DB * AE}`;
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
              solution: paras(
                step(
                  1,
                  "set up the proportion",
                  "列比例式",
                  t(
                    `By the triangle proportionality theorem, the part at $${A}$ over the part at the base is the same on both sides:${steps(eq)}`,
                    `由三角形比例定理，两条边上“靠近 $${A}$ 的部分比靠近底边的部分”相同：${steps(eq)}`,
                  ),
                ),
                step(
                  2,
                  "cross-multiply and solve",
                  "交叉相乘并求解",
                  t(
                    `Cross-multiply, divide, then solve for $x$:${steps(cross, `${lin} = ${target}`, `x = ${x}`)}`,
                    `交叉相乘，两边相除，再解出 $x$：${steps(cross, `${lin} = ${target}`, `x = ${x}`)}`,
                  ),
                ),
                check(
                  t(
                    `With $x = ${x}$, $${onAE ? `${A}${E}` : `${E}${C}`} = ${linear(c, d)
                      .replace("x", `\\cdot ${x}`)
                      .replace(/^\\cdot /, "")} = ${target}$. `,
                    `$x = ${x}$ 时，$${onAE ? `${A}${E}` : `${E}${C}`} = ${linear(c, d)
                      .replace("x", `\\cdot ${x}`)
                      .replace(/^\\cdot /, "")} = ${target}$。`,
                  ),
                  crossCheck(L, AD, DB, AE, EC),
                ),
              ),
            }),
            figure: fig,
          };
        }
      },
    },
    {
      id: "the-converse",
      figure: similarityDrawings["the-triangle-proportionality-theorem#the-converse"],
      title: t("The converse", "逆定理"),
      explanation: t(
        "**Converse:** if a segment divides two sides of a triangle proportionally, it is parallel to the third side. So to decide whether $\\overline{DE} \\parallel \\overline{BC}$, compare $\\frac{AD}{DB}$ with $\\frac{AE}{EC}$.\n\n$AD = 5$, $DB = 3$, $AE = 10$, $EC = 6$: $10 \\div 6$ reduces to $\\frac{5}{3}$, the same as $5 \\div 3$, so parallel. With $EC = 7$ instead, $10 \\div 7$ is not $\\frac{5}{3}$, so not parallel: the cross-products $5 \\cdot 7 = 35$ and $3 \\cdot 10 = 30$ differ.\n\n> **Watch out.** Compare ratios, not single lengths: $AD \\ne AE$ says nothing, since the two sides can have different lengths. And a segment joining two sides need not be parallel to the third side; only equal ratios make it so.",
        "**逆定理**：如果一条线段把三角形的两边分成比例线段，那么它平行于第三边。所以要判断 $\\overline{DE} \\parallel \\overline{BC}$ 是否成立，就比较 $\\frac{AD}{DB}$ 与 $\\frac{AE}{EC}$。\n\n$AD = 5$，$DB = 3$，$AE = 10$，$EC = 6$：$10 \\div 6$ 约分后是 $\\frac{5}{3}$，与 $5 \\div 3$ 相同，所以平行。若 $EC = 7$，则 $10 \\div 7$ 不等于 $\\frac{5}{3}$，所以不平行：交叉乘积 $5 \\cdot 7 = 35$ 与 $3 \\cdot 10 = 30$ 不相等。\n\n> **注意。** 要比较比，而不是单个长度：$AD \\ne AE$ 说明不了什么，因为两条边的长度可以不同。连接两边的线段不一定平行于第三边；只有两个比相等时才平行。",
      ),
      generate(rng) {
        const { AD, DB, AE } = propParts(rng);
        let { EC } = propParts(rng);
        EC = (AE * DB) / AD;
        const parallel = rng.bool();
        const ec = parallel ? EC : EC + rng.pick([-2, -1, 1, 2]);
        const ecFinal = ec <= 0 ? EC + 1 : ec;
        const isParallel = AD * ecFinal === DB * AE;
        const L = pickFive(rng);
        const [A, B, C, D, E] = L;
        const n = nestedPoints(rng, AD / (AD + DB));
        const pe = lerp(n.pa, n.pc, AE / (AE + ecFinal));
        const base = nestedMarks({ ...n, pe }, L, { ad: String(AD), db: String(DB), ae: String(AE), ec: String(ecFinal) });
        const fig = figure(
          base,
          `Triangle ${A}${B}${C} with ${D} on ${A}${B} and ${E} on ${A}${C}; ${A}${D} = ${AD}, ${D}${B} = ${DB}, ${A}${E} = ${AE}, ${E}${C} = ${ecFinal}.`,
          `三角形 ${A}${B}${C}，${D} 在 ${A}${B} 上，${E} 在 ${A}${C} 上；${A}${D} = ${AD}，${D}${B} = ${DB}，${A}${E} = ${AE}，${E}${C} = ${ecFinal}。`,
        );
        const claimed = fr(AE, ecFinal + (isParallel ? 1 : 0));
        const [left, right] = [AD * ecFinal, DB * AE];
        // reduced writes n/d, then its lowest terms when they differ.
        const reduced = (n: number, d: number) => (fr(n, d) === `\\frac{${n}}{${d}}` ? fr(n, d) : `\\frac{${n}}{${d}} = ${fr(n, d)}`);
        const ratios = `\\frac{${A}${D}}{${D}${B}} = ${reduced(AD, DB)}, \\quad \\frac{${A}${E}}{${E}${C}} = ${reduced(AE, ecFinal)}`;
        return {
          ...verdictChoice(rng, {
            prompt: t(
              `Is $\\overline{${D}${E}}$ parallel to $\\overline{${B}${C}}$?`,
              `$\\overline{${D}${E}}$ 与 $\\overline{${B}${C}}$ 平行吗？`,
            ),
            holds: isParallel,
            yes: t(
              `$\\frac{${A}${D}}{${D}${B}}$ and $\\frac{${A}${E}}{${E}${C}}$ both equal $${fr(AD, DB)}$`,
              `$\\frac{${A}${D}}{${D}${B}}$ 与 $\\frac{${A}${E}}{${E}${C}}$ 都等于 $${fr(AD, DB)}$`,
            ),
            no: t(
              `$\\frac{${A}${D}}{${D}${B}} = ${fr(AD, DB)}$ but $\\frac{${A}${E}}{${E}${C}} = ${claimed}$`,
              `$\\frac{${A}${D}}{${D}${B}} = ${fr(AD, DB)}$，而 $\\frac{${A}${E}}{${E}${C}} = ${claimed}$`,
            ),
            yesWrong: t(`$\\overline{${D}${E}}$ joins two sides of the triangle`, `$\\overline{${D}${E}}$ 连接了三角形的两条边`),
            noWrong: t(`$${A}${D} \\ne ${A}${E}$`, `$${A}${D} \\ne ${A}${E}$`),
            solution: paras(
              step(
                1,
                "compare the ratios",
                "比较两个比",
                t(
                  `On each side, divide the part at $${A}$ by the part at the base:${steps(ratios)}`,
                  `每条边都用靠近 $${A}$ 的部分除以靠近底边的部分：${steps(ratios)}`,
                ),
              ),
              step(
                2,
                "apply the converse",
                "运用逆定理",
                t(
                  `${isParallel ? `Both ratios are $${fr(AD, DB)}$` : `The ratios $${fr(AD, DB)}$ and $${fr(AE, ecFinal)}$ differ`}: ${isParallel ? `the sides are divided proportionally, so $\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$ by the converse of the triangle proportionality theorem.` : `the sides are not divided proportionally, so the segments are not parallel. The parallel to $\\overline{${B}${C}}$ through $${D}$, dashed, meets $\\overline{${A}${C}}$ at another point:\n\n{{figure 0}}`}`,
                  `${isParallel ? `两个比都是 $${fr(AD, DB)}$` : `两个比 $${fr(AD, DB)}$ 与 $${fr(AE, ecFinal)}$ 不相等`}：${isParallel ? `两边被分成比例线段，由三角形比例定理的逆定理，$\\overline{${D}${E}} \\parallel \\overline{${B}${C}}$。` : `两边没有被分成比例线段，所以不平行。过 $${D}$ 作 $\\overline{${B}${C}}$ 的平行线（虚线），它与 $\\overline{${A}${C}}$ 交于另一点：\n\n{{figure 0}}`}`,
                ),
              ),
              check(
                t(
                  `Cross-multiply instead: $${A}${D} \\cdot ${E}${C} = ${AD} \\cdot ${ecFinal} = ${left}$ and $${D}${B} \\cdot ${A}${E} = ${DB} \\cdot ${AE} = ${right}$, ${isParallel ? "equal, so the ratios match" : "different, so the ratios do not match"}.`,
                  `改用交叉相乘：$${A}${D} \\cdot ${E}${C} = ${AD} \\cdot ${ecFinal} = ${left}$，$${D}${B} \\cdot ${A}${E} = ${DB} \\cdot ${AE} = ${right}$，${isParallel ? "相等，所以两个比相等" : "不相等，所以两个比不相等"}。`,
                ),
              ),
            ),
          }),
          figure: fig,
          ...(isParallel
            ? {}
            : {
                solutionFigures: [
                  figure(
                    [...base, { kind: "segment", a: n.pd, b: n.pe, tone: "result", dashed: true }],
                    `The same triangle with a dashed segment from ${D} parallel to ${B}${C}, meeting ${A}${C} at a point other than ${E}.`,
                    `同样的三角形，从 ${D} 出发平行于 ${B}${C} 的虚线段，与 ${A}${C} 交于 ${E} 以外的一点。`,
                  ),
                ],
              }),
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
