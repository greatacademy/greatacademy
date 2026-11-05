import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type Mark, type PlaneMark, type Point, plane, Q, sketch } from "@ga/subject-math";

import { choiceProblem, mixedLatex, numberProblem, pointLatex, pointProblem, steps, verdictChoice } from "../problems.ts";
import { height, rectangle, sides } from "./area.ts";
import { prismSvg } from "./grade-5-measurement.ts";

// 6th Grade Math: areas of polygons, lines of symmetry, volumes with fractional edges, and polygons in the coordinate plane.

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

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

const pickUnit = (rng: Rng): Unit => rng.pick(units);

/** num writes a number in LaTeX, as a decimal or as an integer or mixed number. */
const num = (q: Q, decimal: boolean) => (decimal ? dec(q) : mixedLatex(q));

/** measure writes a measurement in LaTeX: "2\frac{1}{2}\text{ ft}", "8.4\text{ m}^2". */
const measure = (q: Q, decimal: boolean, u: Unit, power = 1) => `${num(q, decimal)}\\text{ ${u}}${power > 1 ? `^{${power}}` : ""}`;

/** label writes a length for a figure in plain text: "4.5 m", "2 1/2 ft". */
function label(q: Q, decimal: boolean, u: Unit): string {
  if (decimal || q.isInteger()) return `${dec(q)} ${u}`;
  const whole = q.n / q.d;
  const rest = `${q.n % q.d}/${q.d}`;
  return `${whole === 0n ? rest : `${whole} ${rest}`} ${u}`;
}

/** fig builds a figure from sketch marks. */
const fig = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** tenths draws a decimal with one decimal place between lo and hi that is not an integer. */
function tenths(rng: Rng, lo: number, hi: number): Q {
  let n: number;
  do n = rng.int(lo * 10, hi * 10);
  while (n % 10 === 0);
  return Q.of(n, 10);
}

/** mixedNumber draws a mixed number with denominator 2, 3 or 4 and whole part from lo to hi. */
function mixedNumber(rng: Rng, lo: number, hi: number): Q {
  const d = rng.pick([2, 3, 4]);
  return Q.of(rng.int(lo, hi) * d + rng.int(1, d - 1), d);
}

/** properFraction draws a fraction between 0 and 1 with a denominator from 2 to 8. */
function properFraction(rng: Rng): Q {
  const d = rng.int(2, 8);
  return Q.of(rng.int(1, d - 1), d);
}

/** wholePart is the integer part of a positive number. */
const wholePart = (q: Q) => Q.of(q.n / q.d);

/** partwise is the common wrong product of mixed numbers that multiplies whole parts and fraction parts separately. */
const partwise = (a: Q, b: Q) =>
  wholePart(a)
    .mul(wholePart(b))
    .add(a.sub(wholePart(a)).mul(b.sub(wholePart(b))));

/** result writes a computed value, with its mixed-number form when it is an improper fraction. */
const result = (q: Q) => (q.isInteger() || q.cmp(Q.one) < 0 ? q.toLatex() : `${q.toLatex()} = ${mixedLatex(q)}`);

/** product writes the computation of a product: "2\frac{1}{2} \times \frac{3}{4} = \frac{5}{2} \times \frac{3}{4} = \frac{15}{8} = 1\frac{7}{8}". */
function product(factors: readonly Q[], decimal: boolean): string {
  const p = factors.reduce((a, b) => a.mul(b), Q.one);
  if (decimal) return `${factors.map((f) => dec(f)).join(" \\times ")} = ${dec(p)}`;
  const shown = factors.map(mixedLatex).join(" \\times ");
  const improper = factors.map((f) => f.toLatex()).join(" \\times ");
  return shown === improper ? `${shown} = ${result(p)}` : `${shown} = ${improper} = ${result(p)}`;
}

/** quotient writes the computation of a ÷ b. */
function quotient(a: Q, b: Q, decimal: boolean): string {
  if (decimal) return `${dec(a)} \\div ${dec(b)} = ${dec(a.div(b))}`;
  const head = `${mixedLatex(a)} \\div ${mixedLatex(b)}`;
  if (b.isInteger() && a.isInteger()) return `${head} = ${result(a.div(b))}`;
  return `${head} = ${a.toLatex()} \\times ${Q.one.div(b).toLatex()} = ${result(a.div(b))}`;
}

/** triples are Pythagorean triples: a slanted side of length c leans over a by b. */
const triples = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [9, 12, 15],
  [12, 9, 15],
] as const;

// ---------------------------------------------------------------------------
// Areas of rectangles and triangles

export const areasOfRectangles = topic(
  "areas-of-rectangles",
  t("Areas of Rectangles", "长方形的面积"),
  t(
    "The area of a rectangle is its length times its width, A = lw, also when the sides are fractions or decimals: a rectangle 2½ m by 1½ m has area 5/2 × 3/2 = 15/4 = 3¾ m². Area is measured in square units. When the area and one side are known, divide the area by that side to find the other side.",
    "长方形的面积等于长乘宽，A = lw；边长是分数或小数时也一样：长 2½ 米、宽 1½ 米的长方形，面积是 5/2 × 3/2 = 15/4 = 3¾ 平方米。面积用平方单位计量。已知面积和一条边时，用面积除以这条边，就得到另一条边。",
  ),
  ["finding-areas-using-fraction-multiplication", "multiplying-two-digit-decimals"],
  ["6.G.A.1"],
  [
    {
      id: "fractional-and-decimal-side-lengths",
      title: t("Fraction and decimal side lengths", "边长是分数或小数"),
      explanation: t(
        "A rectangle $3.5$ m long and $2.4$ m wide has area $3.5 \\times 2.4 = 8.4\\text{ m}^2$. One $2\\frac{1}{2}$ ft by $1\\frac{1}{3}$ ft has area $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{10}{3} = 3\\frac{1}{3}\\text{ ft}^2$: write mixed numbers as fractions before multiplying.",
        "长 $3.5$ 米、宽 $2.4$ 米的长方形，面积是 $3.5 \\times 2.4 = 8.4\\text{ m}^2$。长 $2\\frac{1}{2}$ 英尺、宽 $1\\frac{1}{3}$ 英尺的长方形，面积是 $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{10}{3} = 3\\frac{1}{3}\\text{ ft}^2$：先把带分数化成假分数，再相乘。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const decimal = rng.bool();
        const l = decimal ? tenths(rng, 3, 15) : mixedNumber(rng, 1, 6);
        const w = decimal
          ? rng.bool()
            ? tenths(rng, 1, 9)
            : Q.of(rng.int(2, 9))
          : rng.bool()
            ? mixedNumber(rng, 1, 4)
            : properFraction(rng);
        if (l.cmp(w) <= 0) return this.generate(rng);
        const a = l.mul(w);
        const pts = rectangle(l.toNumber(), w.toNumber());
        return {
          ...numberProblem({
            prompt: t("Find the area of the rectangle.", "求这个长方形的面积。"),
            answer: a,
            unit: `${u}^2`,
            ...(decimal && { form: "decimal" as const }),
            wrong: [l.add(w).mul(Q.of(2)), l.add(w), decimal ? a.mul(Q.of(10)) : partwise(l, w)],
            solution: t(
              `Multiply the length by the width:${steps(`A = ${product([l, w], decimal)}\\text{ ${u}}^2`)}`,
              `用长乘宽：${steps(`A = ${product([l, w], decimal)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: fig(
            [{ kind: "polygon", points: pts }, ...sides(pts, [label(l, decimal, u), label(w, decimal, u), null, null])],
            `A rectangle ${label(l, decimal, u)} long and ${label(w, decimal, u)} wide.`,
            `一个长 ${label(l, decimal, u)}、宽 ${label(w, decimal, u)} 的长方形。`,
          ),
        };
      },
    },
    {
      id: "missing-side-length",
      title: t("A missing side length", "求未知边长"),
      explanation: t(
        "The area of a rectangle is length times width, so a missing side is the area divided by the known side. With mixed numbers, write them as improper fractions first.\n\nA rectangle has area $7\\frac{1}{2}\\text{ m}^2$ and length $3$ m. Since $A = lw$, the width is $7\\frac{1}{2} \\div 3 = \\frac{15}{2} \\times \\frac{1}{3} = \\frac{5}{2} = 2\\frac{1}{2}$ m.",
        "长方形的面积等于长乘宽，所以未知的边长等于面积除以已知的边长。有带分数时，先化成假分数。\n\n一个长方形的面积是 $7\\frac{1}{2}\\text{ m}^2$，长是 $3$ 米。因为 $A = lw$，所以宽是 $7\\frac{1}{2} \\div 3 = \\frac{15}{2} \\times \\frac{1}{3} = \\frac{5}{2} = 2\\frac{1}{2}$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const decimal = rng.bool();
        const l = decimal ? tenths(rng, 3, 15) : mixedNumber(rng, 2, 8);
        const w = decimal ? Q.of(rng.int(2, 9)) : rng.bool() ? Q.of(rng.int(2, 6)) : mixedNumber(rng, 1, 3);
        if (l.cmp(w) <= 0) return this.generate(rng);
        const a = l.mul(w);
        const givenLength = rng.bool();
        const [known, unknown] = givenLength ? [l, w] : [w, l];
        const [knownName, unknownName] = givenLength ? [t("length", "长"), t("width", "宽")] : [t("width", "宽"), t("length", "长")];
        return numberProblem({
          prompt: t(
            `A rectangle has an area of $${measure(a, decimal, u, 2)}$ and a ${knownName.en} of $${measure(known, decimal, u)}$. What is its ${unknownName.en}?`,
            `一个长方形的面积是 $${measure(a, decimal, u, 2)}$，${knownName["zh-CN"]}是 $${measure(known, decimal, u)}$。它的${unknownName["zh-CN"]}是多少？`,
          ),
          answer: unknown,
          unit: u,
          ...(decimal && { form: "decimal" as const }),
          wrong: [a.mul(known), a.sub(known), a.div(Q.of(2)).sub(known)],
          solution: t(
            `The area is the ${knownName.en} times the ${unknownName.en}, so divide the area by the ${knownName.en}:${steps(`${quotient(a, known, decimal)}\\text{ ${u}}`)}`,
            `面积等于${knownName["zh-CN"]}乘${unknownName["zh-CN"]}，所以用面积除以${knownName["zh-CN"]}：${steps(`${quotient(a, known, decimal)}\\text{ ${u}}`)}`,
          ),
        });
      },
    },
  ],
);

/** rightTriangle is the corners of a right triangle with legs a (bottom) and b, counterclockwise, with the right angle on the left or the right. */
function rightTriangle(a: number, b: number, rightOnLeft: boolean): Point[] {
  return rightOnLeft
    ? [
        [0, 0],
        [a, 0],
        [0, b],
      ]
    : [
        [0, 0],
        [a, 0],
        [a, b],
      ];
}

/** rightTriangleFigure draws a right triangle with its legs (and maybe its hypotenuse) labeled. */
function rightTriangleFigure(a: number, b: number, labels: readonly [string, string, string | null], rightOnLeft: boolean): Figure {
  const pts = rightTriangle(a, b, rightOnLeft);
  const corner = rightOnLeft ? pts[0]! : pts[1]!;
  const marks: Mark[] = [
    { kind: "polygon", points: pts },
    { kind: "right", vertex: corner, from: rightOnLeft ? pts[1]! : pts[0]!, to: pts[2]! },
    ...sides(pts, rightOnLeft ? [labels[0], labels[2], labels[1]] : [labels[0], labels[1], labels[2]]),
  ];
  return fig(
    marks,
    `A right triangle with legs ${labels[0]} and ${labels[1]}${labels[2] ? ` and hypotenuse ${labels[2]}` : ""}.`,
    `一个直角三角形，两条直角边为 ${labels[0]} 和 ${labels[1]}${labels[2] ? `，斜边为 ${labels[2]}` : ""}。`,
  );
}

export const areasOfRightTriangles = topic(
  "areas-of-right-triangles",
  t("Areas of Right Triangles", "直角三角形的面积"),
  t(
    "A diagonal cuts a rectangle into two equal right triangles, so the area of a right triangle is half the product of its legs, the two sides that form the right angle: A = ½ab. A right triangle with legs 6 cm and 8 cm has area ½ × 6 × 8 = 24 cm². The longest side, the hypotenuse, is not used.",
    "长方形的一条对角线把它分成两个完全相同的直角三角形，所以直角三角形的面积是两条直角边（夹着直角的两条边）乘积的一半：A = ½ab。两条直角边为 6 厘米和 8 厘米的直角三角形，面积是 ½ × 6 × 8 = 24 平方厘米。最长的边（斜边）不参与计算。",
  ),
  ["areas-of-rectangles"],
  ["6.G.A.1"],
  [
    {
      id: "area-from-the-legs",
      title: t("Area from the legs", "由直角边求面积"),
      explanation: t(
        "A right triangle has sides $5$ m, $12$ m and $13$ m. The legs are the two shorter sides, which meet at the right angle, so $A = \\frac{1}{2} \\times 5 \\times 12 = 30\\text{ m}^2$. Multiplying by $13$ would be a mistake.",
        "一个直角三角形的三边是 $5$ 米、$12$ 米、$13$ 米。直角边是夹着直角的两条较短的边，所以 $A = \\frac{1}{2} \\times 5 \\times 12 = 30\\text{ m}^2$。用 $13$ 去乘就错了。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const withHypotenuse = rng.bool(0.6);
        const [p, q, r] = rng.pick(triples);
        const k = rng.int(1, 3);
        const [a, b] = withHypotenuse ? [p * k, q * k] : [rng.int(3, 20), rng.int(3, 16)];
        const c = r * k;
        const area = Q.of(a * b, 2);
        return {
          ...numberProblem({
            prompt: t("Find the area of the right triangle.", "求这个直角三角形的面积。"),
            answer: area,
            unit: `${u}^2`,
            wrong: withHypotenuse ? [a * b, Q.of(a * c, 2), Q.of(b * c, 2)] : [a * b, a + b, Q.of(a + b, 2)],
            solution: t(
              `The legs are $${a}$ and $${b}$:${steps(`A = \\frac{1}{2} \\times ${a} \\times ${b} = ${result(area)}\\text{ ${u}}^2`)}`,
              `两条直角边是 $${a}$ 和 $${b}$：${steps(`A = \\frac{1}{2} \\times ${a} \\times ${b} = ${result(area)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: rightTriangleFigure(a, b, [`${a} ${u}`, `${b} ${u}`, withHypotenuse ? `${c} ${u}` : null], rng.bool()),
        };
      },
    },
    {
      id: "missing-leg",
      title: t("A missing leg", "求未知的直角边"),
      explanation: t(
        "A right triangle has area $36\\text{ cm}^2$ and one leg $8$ cm. Since $\\frac{1}{2} \\times 8 \\times b = 36$, we get $4b = 36$, so the other leg is $b = 9$ cm. Dividing $36$ by $8$ alone forgets the half.",
        "一个直角三角形的面积是 $36\\text{ cm}^2$，一条直角边是 $8$ 厘米。由 $\\frac{1}{2} \\times 8 \\times b = 36$ 得 $4b = 36$，所以另一条直角边 $b = 9$ 厘米。只用 $36$ 除以 $8$ 就漏掉了二分之一。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const a = rng.int(2, 16);
        const b = rng.int(2, 16);
        const area = Q.of(a * b, 2);
        return {
          ...numberProblem({
            prompt: t(
              `A right triangle has an area of $${mixedLatex(area)}\\text{ ${u}}^2$, and one of its legs is $${a}\\text{ ${u}}$ long. How long is the other leg?`,
              `一个直角三角形的面积是 $${mixedLatex(area)}\\text{ ${u}}^2$，一条直角边长 $${a}\\text{ ${u}}$。另一条直角边有多长？`,
            ),
            answer: b,
            unit: u,
            wrong: [area.div(Q.of(a)), area.div(Q.of(2 * a))],
            solution: t(
              `The area is half the product of the legs:${steps(`\\frac{1}{2} \\times ${a} \\times b = ${area.toLatex()}`, `b = ${area.toLatex()} \\times 2 \\div ${a} = ${b}\\text{ ${u}}`)}`,
              `面积是两条直角边乘积的一半：${steps(`\\frac{1}{2} \\times ${a} \\times b = ${area.toLatex()}`, `b = ${area.toLatex()} \\times 2 \\div ${a} = ${b}\\text{ ${u}}`)}`,
            ),
          }),
          figure: rightTriangleFigure(a, b, [`${a} ${u}`, "?", null], rng.bool()),
        };
      },
    },
  ],
);

export const areasOfTriangles = topic(
  "areas-of-triangles",
  t("Areas of Triangles", "三角形的面积"),
  t(
    "Any side of a triangle can be its base. The height is the perpendicular distance from the opposite vertex to the line containing the base; it falls inside the triangle, or, for an obtuse triangle, outside it on the extended base. The area is A = ½bh: a triangle with base 10 m and height 7 m has area ½ × 10 × 7 = 35 m². A slanted side is not the height.",
    "三角形的任何一条边都可以作为底。高是从对顶点到底边所在直线的垂直距离；它可能在三角形内部，对于钝角三角形，也可能在外部、落在底边的延长线上。面积是 A = ½bh：底 10 米、高 7 米的三角形，面积是 ½ × 10 × 7 = 35 平方米。斜着的边不是高。",
  ),
  ["areas-of-right-triangles"],
  ["6.G.A.1"],
  [
    {
      id: "height-inside-the-triangle",
      title: t("The height inside the triangle", "高在三角形内部"),
      explanation: t(
        "A triangle has base $14$ cm, height $8$ cm and a slanted side of $10$ cm. The height is the dashed segment that meets the base at a right angle, so $A = \\frac{1}{2} \\times 14 \\times 8 = 56\\text{ cm}^2$.",
        "一个三角形的底是 $14$ 厘米，高是 $8$ 厘米，一条斜边是 $10$ 厘米。高是与底边成直角的虚线段，所以 $A = \\frac{1}{2} \\times 14 \\times 8 = 56\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [p, q, r] = rng.pick(triples);
        const k = rng.int(1, 2);
        const [o, h, s] = [p * k, q * k, r * k];
        const b = o + rng.int(2, 12);
        const apex: Point = [o, h];
        const pts: Point[] = [[0, 0], [b, 0], apex];
        const area = Q.of(b * h, 2);
        return {
          ...numberProblem({
            prompt: t("Find the area of the triangle.", "求这个三角形的面积。"),
            answer: area,
            unit: `${u}^2`,
            wrong: [b * h, Q.of(b * s, 2), Q.of(s * h, 2)],
            solution: t(
              `The base is $${b}$ and the height, which meets the base at a right angle, is $${h}$:${steps(`A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}\\text{ ${u}}^2`)}`,
              `底是 $${b}$，与底边成直角的高是 $${h}$：${steps(`A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: fig(
            [
              { kind: "polygon", points: pts },
              ...sides(pts, [`${b} ${u}`, null, `${s} ${u}`]),
              ...height(apex, [o, 0], [b, 0], `${h} ${u}`),
            ],
            `A triangle with base ${b} ${u}, height ${h} ${u} and a slanted side of ${s} ${u}.`,
            `一个三角形，底 ${b} ${u}，高 ${h} ${u}，一条斜边 ${s} ${u}。`,
          ),
        };
      },
    },
    {
      id: "height-outside-the-triangle",
      title: t("The height outside the triangle", "高在三角形外部"),
      explanation: t(
        "In an obtuse triangle with base $6$ m, the height from the top vertex may fall on the extension of the base, $4$ m past its end. The height is still the distance to the line containing the base, here $5$ m, so $A = \\frac{1}{2} \\times 6 \\times 5 = 15\\text{ m}^2$. The extension is not part of the base.",
        "在一个底为 $6$ 米的钝角三角形中，从顶点作的高可能落在底边的延长线上，离底边端点 $4$ 米。高仍然是顶点到底边所在直线的距离，这里是 $5$ 米，所以 $A = \\frac{1}{2} \\times 6 \\times 5 = 15\\text{ m}^2$。延长的部分不属于底。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const b = rng.int(4, 14);
        const e = rng.int(2, 8);
        const h = rng.int(3, 12);
        const apex: Point = [b + e, h];
        const pts: Point[] = [[0, 0], [b, 0], apex];
        const area = Q.of(b * h, 2);
        return {
          ...numberProblem({
            prompt: t("Find the area of the triangle.", "求这个三角形的面积。"),
            answer: area,
            unit: `${u}^2`,
            wrong: [Q.of((b + e) * h, 2), b * h, Q.of(e * h, 2)],
            solution: t(
              `The base is $${b}$, and the height is the distance from the top vertex to the line containing the base, $${h}$. The extension of $${e}$ is not part of the base:${steps(`A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}\\text{ ${u}}^2`)}`,
              `底是 $${b}$，高是顶点到底边所在直线的距离 $${h}$。延长的 $${e}$ 不属于底：${steps(`A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: fig(
            [
              { kind: "polygon", points: pts },
              ...sides(pts, [`${b} ${u}`, null, null]),
              { kind: "segment", a: [b, 0], b: [b + e, 0], dashed: true },
              { kind: "side", a: [b, 0], b: [b + e, 0], text: `${e} ${u}` },
              ...height(apex, [b + e, 0], [b, 0], `${h} ${u}`),
            ],
            `An obtuse triangle with base ${b} ${u}. The base is extended ${e} ${u} past its end, and the height from the top vertex to the extended base is ${h} ${u}.`,
            `一个钝角三角形，底 ${b} ${u}。底边向外延长 ${e} ${u}，从顶点到延长线的高是 ${h} ${u}。`,
          ),
        };
      },
    },
  ],
);

/** parallelogram draws a parallelogram with base b, a slanted side from a scaled Pythagorean triple, and its height. */
function parallelogram(rng: Rng, u: Unit): { b: number; h: number; s: number; figure: Figure } {
  const [p, q, r] = rng.pick(triples);
  const k = rng.int(1, 2);
  const [o, h, s] = [p * k, q * k, r * k];
  const b = rng.int(o + 3, o + 14);
  const pts: Point[] = [
    [0, 0],
    [b, 0],
    [b + o, h],
    [o, h],
  ];
  return {
    b,
    h,
    s,
    figure: fig(
      [
        { kind: "polygon", points: pts },
        ...sides(pts, [`${b} ${u}`, null, null, `${s} ${u}`]),
        ...height([o, h], [o, 0], [b, 0], `${h} ${u}`),
      ],
      `A parallelogram with base ${b} ${u}, slanted sides ${s} ${u} and height ${h} ${u}.`,
      `一个平行四边形，底 ${b} ${u}，斜边 ${s} ${u}，高 ${h} ${u}。`,
    ),
  };
}

export const areasAndPerimetersOfParallelograms = topic(
  "areas-and-perimeters-of-parallelograms",
  t("Areas and Perimeters of Parallelograms", "平行四边形的面积和周长"),
  t(
    "Cutting a right triangle off one end of a parallelogram and moving it to the other end makes a rectangle, so the area of a parallelogram is base times height, A = bh, where the height is perpendicular to the base. The perimeter uses the side lengths instead: P = 2(b + s), where s is the slanted side. A parallelogram with base 12 cm, slanted side 5 cm and height 4 cm has area 48 cm² and perimeter 34 cm.",
    "把平行四边形一端的直角三角形剪下，移到另一端，就拼成一个长方形，所以平行四边形的面积是底乘高，A = bh，其中高垂直于底。周长用的是边长：P = 2(b + s)，s 是斜边。底 12 厘米、斜边 5 厘米、高 4 厘米的平行四边形，面积是 48 平方厘米，周长是 34 厘米。",
  ),
  ["areas-of-rectangles", "perimeters-of-shapes"],
  ["6.G.A.1"],
  [
    {
      id: "area-of-a-parallelogram",
      title: t("Area", "面积"),
      explanation: t(
        "Base $15$ m, slanted side $10$ m, height $8$ m: $A = bh = 15 \\times 8 = 120\\text{ m}^2$. The slanted side is not perpendicular to the base, so $15 \\times 10$ is not the area.",
        "底 $15$ 米，斜边 $10$ 米，高 $8$ 米：$A = bh = 15 \\times 8 = 120\\text{ m}^2$。斜边不垂直于底，所以 $15 \\times 10$ 不是面积。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const { b, h, s, figure } = parallelogram(rng, u);
        return {
          ...numberProblem({
            prompt: t("Find the area of the parallelogram.", "求这个平行四边形的面积。"),
            answer: b * h,
            unit: `${u}^2`,
            wrong: [b * s, Q.of(b * h, 2), 2 * (b + s)],
            solution: t(
              `Multiply the base by the height, which is perpendicular to the base:${steps(`A = ${b} \\times ${h} = ${b * h}\\text{ ${u}}^2`)}`,
              `用底乘与底垂直的高：${steps(`A = ${b} \\times ${h} = ${b * h}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure,
        };
      },
    },
    {
      id: "perimeter-of-a-parallelogram",
      title: t("Perimeter", "周长"),
      explanation: t(
        "Base $15$ m, slanted side $10$ m, height $8$ m: the perimeter goes around the four sides, $P = 2(15 + 10) = 50$ m. The height is inside the figure and is not a side.",
        "底 $15$ 米，斜边 $10$ 米，高 $8$ 米：周长是四条边的总长，$P = 2(15 + 10) = 50$ 米。高在图形内部，不是边。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const { b, h, s, figure } = parallelogram(rng, u);
        return {
          ...numberProblem({
            prompt: t("Find the perimeter of the parallelogram.", "求这个平行四边形的周长。"),
            answer: 2 * (b + s),
            unit: u,
            wrong: [2 * (b + h), b + s, b * h],
            solution: t(
              `Opposite sides of a parallelogram are equal, so the sides are $${b}$, $${s}$, $${b}$ and $${s}$:${steps(`P = 2(${b} + ${s}) = ${2 * (b + s)}\\text{ ${u}}`)}`,
              `平行四边形的对边相等，所以四条边是 $${b}$、$${s}$、$${b}$、$${s}$：${steps(`P = 2(${b} + ${s}) = ${2 * (b + s)}\\text{ ${u}}`)}`,
            ),
          }),
          figure,
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Composite figures

export const findingAreasOfPolygonsUsingDecomposition = topic(
  "finding-areas-of-polygons-using-decomposition",
  t("Finding Areas of Polygons Using Decomposition", "用分割法求多边形的面积"),
  t(
    "To find the area of a polygon, split it into rectangles and triangles, find the area of each part, and add. An L-shaped figure splits into two rectangles, and a house-shaped pentagon splits into a rectangle and a triangle. Missing lengths come from the given ones: the two horizontal sides on one side of an L-shape add up to the side opposite them.",
    "求多边形的面积时，把它分割成长方形和三角形，分别求出各部分的面积再相加。L 形图形可以分成两个长方形，房子形的五边形可以分成一个长方形和一个三角形。未知的长度可以由已知长度求出：L 形一侧的两条横边加起来等于对面的那条边。",
  ),
  ["areas-of-triangles", "areas-and-perimeters-of-parallelograms"],
  ["6.G.A.1"],
  [
    {
      id: "rectilinear-figures",
      title: t("Figures made of rectangles", "由长方形组成的图形"),
      explanation: t(
        "An L-shape is $12$ m wide at the bottom and $9$ m tall on the left; its top edge is $7$ m and its right edge is $4$ m. Cut it with a vertical line: the left part is $7 \\times 9 = 63\\text{ m}^2$, and the right part is $12 - 7 = 5$ m wide and $4$ m tall, $20\\text{ m}^2$. The total is $83\\text{ m}^2$.",
        "一个 L 形图形底边宽 $12$ 米，左边高 $9$ 米；上边长 $7$ 米，右边高 $4$ 米。用一条竖线把它分开：左边部分是 $7 \\times 9 = 63\\text{ m}^2$；右边部分宽 $12 - 7 = 5$ 米、高 $4$ 米，是 $20\\text{ m}^2$。总面积是 $83\\text{ m}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const W = rng.int(8, 16);
        const H = rng.int(6, 14);
        const a = rng.int(2, W - 3);
        const b = rng.int(2, H - 3);
        const pts: Point[] = [
          [0, 0],
          [W, 0],
          [W, H - b],
          [W - a, H - b],
          [W - a, H],
          [0, H],
        ];
        const area = W * H - a * b;
        return {
          ...numberProblem({
            prompt: t("Find the area of the figure. All of its angles are right angles.", "求这个图形的面积。图形的所有角都是直角。"),
            answer: area,
            unit: `${u}^2`,
            wrong: [W * H, (W - a) * H + W * (H - b), (W - a) * H + a * H],
            solution: t(
              `Cut the figure with a vertical line into a left rectangle $${W - a}$ by $${H}$ and a right rectangle $${W} - ${W - a} = ${a}$ wide and $${H - b}$ tall:${steps(`A = ${W - a} \\times ${H} + ${a} \\times ${H - b} = ${(W - a) * H} + ${a * (H - b)} = ${area}\\text{ ${u}}^2`)}`,
              `用一条竖线把图形分成左边 $${W - a}$ 乘 $${H}$ 的长方形，和右边宽 $${W} - ${W - a} = ${a}$、高 $${H - b}$ 的长方形：${steps(`A = ${W - a} \\times ${H} + ${a} \\times ${H - b} = ${(W - a) * H} + ${a * (H - b)} = ${area}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: fig(
            [{ kind: "polygon", points: pts }, ...sides(pts, [`${W} ${u}`, `${H - b} ${u}`, null, null, `${W - a} ${u}`, `${H} ${u}`])],
            `An L-shaped figure: bottom ${W} ${u}, left side ${H} ${u}, top ${W - a} ${u}, right side ${H - b} ${u}.`,
            `一个 L 形图形：底边 ${W} ${u}，左边 ${H} ${u}，上边 ${W - a} ${u}，右边 ${H - b} ${u}。`,
          ),
        };
      },
    },
    {
      id: "rectangles-and-triangles",
      title: t("A rectangle and a triangle", "长方形加三角形"),
      explanation: t(
        "A house-shaped pentagon is a rectangle $10$ ft wide and $6$ ft tall with a triangle $3$ ft tall on top. The area is $10 \\times 6 + \\frac{1}{2} \\times 10 \\times 3 = 60 + 15 = 75\\text{ ft}^2$.",
        "一个房子形的五边形由宽 $10$ 英尺、高 $6$ 英尺的长方形和上面高 $3$ 英尺的三角形组成。面积是 $10 \\times 6 + \\frac{1}{2} \\times 10 \\times 3 = 60 + 15 = 75\\text{ ft}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const w = rng.int(6, 16);
        const h = rng.int(3, 12);
        const r = rng.int(2, 8);
        const top: Point = [w / 2, h + r];
        const pts: Point[] = [[0, 0], [w, 0], [w, h], top, [0, h]];
        const roof = Q.of(w * r, 2);
        const area = roof.add(Q.of(w * h));
        return {
          ...numberProblem({
            prompt: t("Find the area of the pentagon.", "求这个五边形的面积。"),
            answer: area,
            unit: `${u}^2`,
            wrong: [w * h + w * r, w * (h + r), Q.of(w * (h + r), 2)],
            solution: t(
              `Split it into a rectangle $${w}$ by $${h}$ and a triangle with base $${w}$ and height $${r}$:${steps(`A = ${w} \\times ${h} + \\frac{1}{2} \\times ${w} \\times ${r} = ${w * h} + ${roof.toLatex()} = ${result(area)}\\text{ ${u}}^2`)}`,
              `把它分成 $${w}$ 乘 $${h}$ 的长方形和底 $${w}$、高 $${r}$ 的三角形：${steps(`A = ${w} \\times ${h} + \\frac{1}{2} \\times ${w} \\times ${r} = ${w * h} + ${roof.toLatex()} = ${result(area)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: fig(
            [
              { kind: "polygon", points: pts },
              ...sides(pts, [`${w} ${u}`, `${h} ${u}`, null, null, null]),
              { kind: "segment", a: [0, h], b: [w, h], dashed: true },
              ...height(top, [w / 2, h], [w, h], `${r} ${u}`),
            ],
            `A house-shaped pentagon: a rectangle ${w} ${u} wide and ${h} ${u} tall with a triangle ${r} ${u} tall on top.`,
            `一个房子形的五边形：宽 ${w} ${u}、高 ${h} ${u} 的长方形，上面是高 ${r} ${u} 的三角形。`,
          ),
        };
      },
    },
  ],
);

/** Enclosure is a rectangle with a smaller rectangle inside it, described as a real-world place. */
interface Enclosure {
  readonly en: string;
  readonly zh: string;
  readonly ask: Text;
}

/** betweenFigure draws an L by W rectangle with an l by w rectangle inside it at offset, the region between shaded; unknown leaves the inner sides unlabeled. */
function betweenFigure(L: number, W: number, l: number, w: number, offset: Point, u: string, unknown = false): Figure {
  const outer = rectangle(L, W);
  const inner: Point[] = rectangle(l, w).map(([px, py]) => [px + offset[0], py + offset[1]]);
  return fig(
    [
      { kind: "shade", points: outer, holes: [inner] },
      { kind: "polygon", points: outer },
      { kind: "polygon", points: inner, accent: true },
      ...sides(outer, [`${L} ${u}`, `${W} ${u}`, null, null]),
      // Listed clockwise, the inner rectangle's side labels fall inside it, clear of the outer sides.
      ...(unknown ? [] : sides([...inner].reverse(), [`${l} ${u}`, `${w} ${u}`, null, null])),
    ],
    unknown
      ? `A ${L} ${u} by ${W} ${u} rectangle with a smaller ${l === w ? "square" : "rectangle"} cut out of it; the region left is shaded.`
      : `A ${L} ${u} by ${W} ${u} rectangle with a ${l} ${u} by ${w} ${u} rectangle inside it; the region between them is shaded.`,
    unknown
      ? `一个 ${L} ${u} 乘 ${W} ${u} 的长方形，里面剪去了一个较小的${l === w ? "正方形" : "长方形"}；剩下的区域涂有阴影。`
      : `一个 ${L} ${u} 乘 ${W} ${u} 的长方形，里面有一个 ${l} ${u} 乘 ${w} ${u} 的长方形；两者之间的区域涂有阴影。`,
  );
}

/** triangleBetweenFigure draws an L by W rectangle with a triangle on its bottom side up to apex, the region outside the triangle shaded. */
function triangleBetweenFigure(L: number, W: number, apex: Point, u: string): Figure {
  const tri: Point[] = [[0, 0], [L, 0], apex];
  return fig(
    [
      { kind: "shade", points: rectangle(L, W), holes: [tri] },
      { kind: "polygon", points: rectangle(L, W) },
      { kind: "polygon", points: tri, accent: true },
      ...sides(rectangle(L, W), [`${L} ${u}`, `${W} ${u}`, null, null]),
      ...height(apex, [apex[0], 0], [L, 0], `${apex[1]} ${u}`),
    ],
    `A ${L} ${u} by ${W} ${u} rectangle with a triangle on its bottom side whose height is ${apex[1]} ${u}; the part of the rectangle outside the triangle is shaded.`,
    `一个 ${L} ${u} 乘 ${W} ${u} 的长方形，里面的三角形以它的下边为底，高 ${apex[1]} ${u}；长方形在三角形外面的部分涂有阴影。`,
  );
}

export const findingAreasBetweenShapes = topic(
  "finding-areas-between-shapes",
  t("Finding Areas Between Shapes", "求图形之间的面积"),
  t(
    "The area of the region between two shapes is the area of the outer shape minus the area of the inner shape. A 10 m by 8 m garden with a 4 m by 3 m shed in it has 10 × 8 − 4 × 3 = 80 − 12 = 68 m² of open ground.",
    "两个图形之间区域的面积，等于外面图形的面积减去里面图形的面积。一块 10 米乘 8 米的花园里有一间 4 米乘 3 米的小屋，空地面积是 10 × 8 − 4 × 3 = 80 − 12 = 68 平方米。",
  ),
  ["finding-areas-of-polygons-using-decomposition"],
  ["6.G.A.1"],
  [
    {
      id: "a-rectangle-inside-a-rectangle",
      title: t("A rectangle inside a rectangle", "长方形里的长方形"),
      explanation: t(
        "When one rectangle lies inside another, the region between them is what is left of the outer rectangle once the inner one is taken away, so its area is the outer area minus the inner area. Where the inner rectangle sits does not matter, only its size.\n\nA $9$ in by $12$ in photo is mounted on a $13$ in by $16$ in board, as shown. The board left uncovered is $13 \\times 16 - 9 \\times 12 = 208 - 108 = 100\\text{ in}^2$.",
        "当一个长方形位于另一个长方形内部时，它们之间的区域就是外面的长方形去掉里面的长方形后剩下的部分，所以它的面积等于外面的面积减去里面的面积。里面的长方形放在哪里并不重要，只与它的大小有关。\n\n如图，一张 $9$ 英寸乘 $12$ 英寸的照片贴在 $13$ 英寸乘 $16$ 英寸的板上。板上露出的部分是 $13 \\times 16 - 9 \\times 12 = 208 - 108 = 100\\text{ in}^2$。",
      ),
      figure: betweenFigure(16, 13, 12, 9, [2, 2], "in"),
      generate(rng) {
        const L = rng.int(10, 24);
        const W = rng.int(8, Math.min(L, 18));
        // The inner rectangle is wide and tall enough to hold its side labels.
        const l = rng.int(4, L - 4);
        const w = rng.int(3, W - 4);
        const u = rng.pick(["m", "ft"] as const);
        const stories: Enclosure[] = [
          {
            en: `A rectangular garden is $${L}$ ${u} by $${W}$ ${u}. A shed $${l}$ ${u} by $${w}$ ${u} stands in it.`,
            zh: `一块长方形花园长 $${L}$ ${u}、宽 $${W}$ ${u}，里面有一间长 $${l}$ ${u}、宽 $${w}$ ${u} 的小屋。`,
            ask: t("What area of the garden is not covered by the shed?", "花园里没有被小屋占用的面积是多少？"),
          },
          {
            en: `A rectangular room is $${L}$ ${u} by $${W}$ ${u}. A rug $${l}$ ${u} by $${w}$ ${u} lies on the floor.`,
            zh: `一个长方形房间长 $${L}$ ${u}、宽 $${W}$ ${u}，地板上铺着一块长 $${l}$ ${u}、宽 $${w}$ ${u} 的地毯。`,
            ask: t("What area of the floor is not covered by the rug?", "地板上没有被地毯盖住的面积是多少？"),
          },
          {
            en: `A rectangular lawn is $${L}$ ${u} by $${W}$ ${u}. A pool $${l}$ ${u} by $${w}$ ${u} is built in it.`,
            zh: `一块长方形草坪长 $${L}$ ${u}、宽 $${W}$ ${u}，里面修了一个长 $${l}$ ${u}、宽 $${w}$ ${u} 的水池。`,
            ask: t("What area of grass is left around the pool?", "水池周围剩下的草坪面积是多少？"),
          },
        ];
        const s = rng.pick(stories);
        const [x, y] = [rng.int(2, L - l - 2), rng.int(2, W - w - 2)];
        const area = L * W - l * w;
        return {
          ...numberProblem({
            prompt: t(`${s.en} ${s.ask.en}`, `${s.zh}${s.ask["zh-CN"]}`),
            answer: area,
            unit: `${u}^2`,
            wrong: [L * W + l * w, L * W, (L - l) * (W - w)],
            solution: t(
              `Subtract the inner area from the outer area:${steps(`${L} \\times ${W} - ${l} \\times ${w} = ${L * W} - ${l * w} = ${area}\\text{ ${u}}^2`)}`,
              `用外面的面积减去里面的面积：${steps(`${L} \\times ${W} - ${l} \\times ${w} = ${L * W} - ${l * w} = ${area}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: betweenFigure(L, W, l, w, [x, y], u),
        };
      },
    },
    {
      id: "a-triangle-inside-a-rectangle",
      title: t("A triangle inside a rectangle", "长方形里的三角形"),
      explanation: t(
        "The inner shape need not be a rectangle: subtract whatever area formula fits it. A triangle drawn on the bottom side of a rectangle has that side as its base, so only its height is needed.\n\nA rectangle is $12$ cm by $8$ cm, and a triangle inside it has the bottom of the rectangle as its base and a height of $5$ cm, as shown. The part of the rectangle outside the triangle has area $12 \\times 8 - \\frac{1}{2} \\times 12 \\times 5 = 96 - 30 = 66\\text{ cm}^2$.",
        "里面的图形不一定是长方形：用适合它的面积公式减去即可。画在长方形下边上的三角形以这条边为底，所以只需要知道它的高。\n\n如图，一个长方形长 $12$ 厘米、宽 $8$ 厘米，里面的三角形以长方形的下边为底，高 $5$ 厘米。长方形在三角形外面的部分，面积是 $12 \\times 8 - \\frac{1}{2} \\times 12 \\times 5 = 96 - 30 = 66\\text{ cm}^2$。",
      ),
      figure: triangleBetweenFigure(12, 8, [7, 5], "cm"),
      generate(rng) {
        const u = pickUnit(rng);
        const L = rng.int(6, 18);
        const W = rng.int(5, 14);
        const h = rng.int(2, W - 1);
        const apex: Point = [rng.int(1, L - 1), h];
        const tri = Q.of(L * h, 2);
        const area = Q.of(L * W).sub(tri);
        return {
          ...numberProblem({
            prompt: t(
              "The triangle's base is the bottom side of the rectangle. Find the area of the part of the rectangle outside the triangle.",
              "三角形的底是长方形的下边。求长方形在三角形外面部分的面积。",
            ),
            answer: area,
            unit: `${u}^2`,
            wrong: [L * W - L * h, tri, Q.of(L * W).add(tri)],
            solution: t(
              `Subtract the triangle's area from the rectangle's area:${steps(`${L} \\times ${W} - \\frac{1}{2} \\times ${L} \\times ${h} = ${L * W} - ${tri.toLatex()} = ${result(area)}\\text{ ${u}}^2`)}`,
              `用长方形的面积减去三角形的面积：${steps(`${L} \\times ${W} - \\frac{1}{2} \\times ${L} \\times ${h} = ${L * W} - ${tri.toLatex()} = ${result(area)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: triangleBetweenFigure(L, W, apex, u),
        };
      },
    },
    {
      id: "a-missing-length-from-the-area-between",
      title: t("A missing length from the area between", "由之间的面积求未知长度"),
      explanation: t(
        "When the area between two shapes is known, undo the subtraction: the inner area is the outer area minus the area between. Then find the missing length from the inner area.\n\nA square is cut out of a $9$ cm by $7$ cm card, leaving $47\\text{ cm}^2$. The square's area is $9 \\times 7 - 47 = 63 - 47 = 16\\text{ cm}^2$, so its side is $4$ cm, since $4 \\times 4 = 16$.",
        "已知两个图形之间的面积时，把减法倒过来：里面的面积等于外面的面积减去之间的面积。再由里面的面积求出未知的长度。\n\n从一张 $9$ 厘米乘 $7$ 厘米的卡片上剪去一个正方形，剩下 $47\\text{ cm}^2$。正方形的面积是 $9 \\times 7 - 47 = 63 - 47 = 16\\text{ cm}^2$，因为 $4 \\times 4 = 16$，所以它的边长是 $4$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const L = rng.int(9, 18);
        const W = rng.int(7, Math.min(L, 14));
        if (rng.bool()) {
          const side = rng.int(2, W - 3);
          const between = L * W - side * side;
          return {
            ...numberProblem({
              prompt: t(
                `A square is cut out of a $${L}$ ${u} by $${W}$ ${u} rectangle, leaving the shaded region with an area of $${between}\\text{ ${u}}^2$. What is the side length of the square?`,
                `从一个长 $${L}$ ${u}、宽 $${W}$ ${u} 的长方形中剪去一个正方形，剩下的阴影部分面积为 $${between}\\text{ ${u}}^2$。正方形的边长是多少？`,
              ),
              answer: side,
              unit: u,
              wrong: [side * side, Q.of(side * side, 2), L - side],
              solution: t(
                `The square's area is the rectangle's area minus the shaded area:${steps(`${L} \\times ${W} - ${between} = ${L * W} - ${between} = ${side * side}\\text{ ${u}}^2`)}Since $${side} \\times ${side} = ${side * side}$, the side length is $${side}$ ${u}.`,
                `正方形的面积等于长方形的面积减去阴影部分的面积：${steps(`${L} \\times ${W} - ${between} = ${L * W} - ${between} = ${side * side}\\text{ ${u}}^2`)}因为 $${side} \\times ${side} = ${side * side}$，所以边长是 $${side}$ ${u}。`,
              ),
            }),
            figure: betweenFigure(L, W, side, side, [rng.int(1, L - side - 1), rng.int(1, W - side - 1)], u, true),
          };
        }
        const w = rng.int(2, W - 3);
        const l = rng.int(w, L - 3);
        const between = L * W - l * w;
        return {
          ...numberProblem({
            prompt: t(
              `A rectangle $${w}$ ${u} wide is cut out of a $${L}$ ${u} by $${W}$ ${u} rectangle, leaving the shaded region with an area of $${between}\\text{ ${u}}^2$. How long is the rectangle that was cut out?`,
              `从一个长 $${L}$ ${u}、宽 $${W}$ ${u} 的长方形中剪去一个宽 $${w}$ ${u} 的长方形，剩下的阴影部分面积为 $${between}\\text{ ${u}}^2$。剪去的长方形有多长？`,
            ),
            answer: l,
            unit: u,
            wrong: [l * w, Q.of(between, w), L - w],
            solution: t(
              `The cut-out rectangle's area is the outer area minus the shaded area:${steps(`${L} \\times ${W} - ${between} = ${L * W} - ${between} = ${l * w}\\text{ ${u}}^2`, `${l * w} \\div ${w} = ${l}`)}It is $${l}$ ${u} long.`,
              `剪去的长方形的面积等于外面的面积减去阴影部分的面积：${steps(`${L} \\times ${W} - ${between} = ${L * W} - ${between} = ${l * w}\\text{ ${u}}^2`, `${l * w} \\div ${w} = ${l}`)}它长 $${l}$ ${u}。`,
            ),
          }),
          figure: betweenFigure(L, W, l, w, [rng.int(1, L - l - 1), rng.int(1, W - w - 1)], u, true),
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Lines of symmetry

/** rotate turns points about the origin by deg degrees. */
const rotate = (pts: readonly Point[], deg: number): Point[] => {
  const [c, s] = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
  return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]);
};

/** regular is the corners of a regular n-gon of radius 10 with a vertex at the top. */
const regular = (n: number): Point[] =>
  Array.from({ length: n }, (_, i) => [
    10 * Math.cos(Math.PI / 2 + (2 * Math.PI * i) / n),
    10 * Math.sin(Math.PI / 2 + (2 * Math.PI * i) / n),
  ]);

/** Shape is a polygon drawn for a symmetry question, with its number of lines of symmetry and typical wrong counts. */
interface Shape {
  readonly name: Text;
  readonly points: Point[];
  readonly lines: number;
  readonly wrong: readonly number[];
  readonly why: Text;
}

const center = (pts: readonly Point[]): Point[] => {
  const [cx, cy] = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  return pts.map(([x, y]) => [x - cx, y - cy]);
};

/** shapes draws one polygon of each kind with random proportions. */
function shapes(rng: Rng): Shape[] {
  // Slanted sides are at most 10 long, so a parallelogram with l > 10 is never a rhombus.
  const l = rng.int(11, 16);
  const w = rng.int(4, 8);
  const b = rng.int(6, 12);
  const h = rng.int(10, 16);
  const n = rng.pick([5, 6, 8]);
  const nName = { 5: t("regular pentagon", "正五边形"), 6: t("regular hexagon", "正六边形"), 8: t("regular octagon", "正八边形") }[n]!;
  const o = rng.int(3, Math.min(6, Math.floor((l - 2) / 2)));
  const [p, q] = [rng.int(3, 5), rng.int(7, 10)];
  return [
    {
      name: t("rectangle", "长方形"),
      points: rectangle(l, w),
      lines: 2,
      wrong: [4, 1],
      why: t(
        "A rectangle folds onto itself along the line through the midpoints of its long sides and along the line through the midpoints of its short sides. A diagonal is not a line of symmetry: folding along it does not match the corners.",
        "长方形沿两条长边中点的连线、以及两条短边中点的连线对折，两边都能完全重合。对角线不是对称轴：沿对角线对折，角对不上。",
      ),
    },
    {
      name: t("square", "正方形"),
      points: rectangle(10, 10),
      lines: 4,
      wrong: [2, 8],
      why: t(
        "A square has 4 lines of symmetry: the 2 lines through the midpoints of opposite sides and the 2 diagonals.",
        "正方形有 4 条对称轴：两条对边中点的连线和两条对角线。",
      ),
    },
    {
      name: t("equilateral triangle", "等边三角形"),
      points: regular(3),
      lines: 3,
      wrong: [1, 6],
      why: t(
        "Each line from a vertex to the midpoint of the opposite side is a line of symmetry, so an equilateral triangle has 3.",
        "从每个顶点到对边中点的直线都是对称轴，所以等边三角形有 3 条。",
      ),
    },
    {
      name: t("isosceles triangle", "等腰三角形"),
      points: [
        [0, 0],
        [b, 0],
        [b / 2, h],
      ],
      lines: 1,
      wrong: [0, 3],
      why: t(
        "Only the line from the vertex between the two equal sides to the midpoint of the base is a line of symmetry, so it has 1.",
        "只有从两腰的公共顶点到底边中点的直线是对称轴，所以它有 1 条。",
      ),
    },
    {
      name: t("scalene triangle", "不等边三角形"),
      points: [
        [0, 0],
        [b + 4, 0],
        [2, h],
      ],
      lines: 0,
      wrong: [1, 3],
      why: t(
        "Its three sides all have different lengths, so no fold makes one half match the other: it has 0 lines of symmetry.",
        "它的三条边长度都不相等，沿任何直线对折都不能重合：它没有对称轴，即 0 条。",
      ),
    },
    {
      name: nName,
      points: regular(n),
      lines: n,
      wrong: [Math.floor(n / 2), 2 * n],
      why: t(
        `A regular polygon with $${n}$ sides has $${n}$ lines of symmetry: ${n % 2 === 0 ? `$${n / 2}$ through opposite vertices and $${n / 2}$ through the midpoints of opposite sides` : "one through each vertex and the midpoint of the opposite side"}.`,
        `正 $${n}$ 边形有 $${n}$ 条对称轴：${n % 2 === 0 ? `$${n / 2}$ 条经过相对的顶点，$${n / 2}$ 条经过相对边的中点` : "每条都经过一个顶点和它对边的中点"}。`,
      ),
    },
    {
      name: t("rhombus", "菱形"),
      points: [
        [0, -p],
        [q, 0],
        [0, p],
        [-q, 0],
      ],
      lines: 2,
      wrong: [4, 0],
      why: t(
        "A rhombus that is not a square folds onto itself along each of its 2 diagonals, but not along the lines through the midpoints of opposite sides.",
        "不是正方形的菱形沿两条对角线对折都能重合，沿对边中点的连线对折则不能。",
      ),
    },
    {
      name: t("parallelogram", "平行四边形"),
      points: [
        [0, 0],
        [l, 0],
        [l + o, w],
        [o, w],
      ],
      lines: 0,
      wrong: [2, 4],
      why: t(
        "Folding this parallelogram along a diagonal or along a line through the midpoints of opposite sides never matches the slanted sides, so it has 0 lines of symmetry.",
        "这个平行四边形沿对角线或对边中点的连线对折，斜边都对不上，所以它没有对称轴，即 0 条。",
      ),
    },
    {
      name: t("isosceles trapezoid", "等腰梯形"),
      points: [
        [0, 0],
        [l, 0],
        [l - o, w],
        [o, w],
      ],
      lines: 1,
      wrong: [2, 0],
      why: t(
        "Only the line through the midpoints of the two parallel sides is a line of symmetry, so it has 1.",
        "只有两条平行边中点的连线是对称轴，所以它有 1 条。",
      ),
    },
    {
      name: t("kite", "筝形"),
      points: [
        [0, -h],
        [p, 0],
        [0, q - 3],
        [-p, 0],
      ],
      lines: 1,
      wrong: [2, 0],
      why: t(
        "Only the diagonal through the vertices between equal sides is a line of symmetry, so it has 1.",
        "只有经过两组相等邻边夹角顶点的那条对角线是对称轴，所以它有 1 条。",
      ),
    },
  ];
}

/** Fold is a figure with a dashed line drawn on it, and whether that line is a line of symmetry. */
interface Fold {
  readonly name: Text;
  readonly points: Point[];
  readonly line: readonly [Point, Point];
  readonly yes: boolean;
  readonly why: Text;
}

/** folds draws figures with a candidate line of symmetry. */
function folds(rng: Rng): Fold[] {
  const l = rng.int(11, 16);
  const w = rng.int(4, 8);
  const b = rng.int(6, 12);
  const h = rng.int(8, 14);
  const o = rng.int(3, Math.min(6, Math.floor((l - 2) / 2)));
  const [p, q] = [rng.int(3, 5), rng.int(7, 10)];
  const rect = t("rectangle", "长方形");
  const tri = t("isosceles triangle", "等腰三角形");
  const trap = t("isosceles trapezoid", "等腰梯形");
  const rhombus = t("rhombus", "菱形");
  const para = t("parallelogram", "平行四边形");
  return [
    {
      name: rect,
      points: rectangle(l, w),
      line: [
        [l / 2, 0],
        [l / 2, w],
      ],
      yes: true,
      why: t(
        "Folding along the line through the midpoints of the long sides puts each half exactly on the other.",
        "沿两条长边中点的连线对折，两半完全重合。",
      ),
    },
    {
      name: rect,
      points: rectangle(l, w),
      line: [
        [0, 0],
        [l, w],
      ],
      yes: false,
      why: t(
        "Folding along a diagonal of a rectangle that is not a square sends a corner off the figure, so the halves do not match.",
        "不是正方形的长方形沿对角线对折，角会落到图形外面，两半不能重合。",
      ),
    },
    {
      name: tri,
      points: [
        [0, 0],
        [b, 0],
        [b / 2, h],
      ],
      line: [
        [b / 2, 0],
        [b / 2, h],
      ],
      yes: true,
      why: t(
        "The line from the top vertex to the midpoint of the base splits the triangle into two matching halves.",
        "从顶点到底边中点的直线把三角形分成完全重合的两半。",
      ),
    },
    {
      name: tri,
      points: [
        [0, 0],
        [b, 0],
        [b / 2, h],
      ],
      line: [
        [0, 0],
        [(3 * b) / 4, h / 2],
      ],
      yes: false,
      why: t(
        "This line runs from a base vertex to the middle of a leg; the two parts have different shapes, so they cannot match.",
        "这条线从底边的一个顶点连到一条腰的中点，分成的两部分形状不同，不能重合。",
      ),
    },
    {
      name: trap,
      points: [
        [0, 0],
        [l, 0],
        [l - o, w],
        [o, w],
      ],
      line: [
        [l / 2, 0],
        [l / 2, w],
      ],
      yes: true,
      why: t(
        "The line through the midpoints of the two parallel sides splits the trapezoid into two mirror halves.",
        "两条平行边中点的连线把梯形分成互为镜像的两半。",
      ),
    },
    {
      name: trap,
      points: [
        [0, 0],
        [l, 0],
        [l - o, w],
        [o, w],
      ],
      line: [
        [o / 2, w / 2],
        [l - o / 2, w / 2],
      ],
      yes: false,
      why: t(
        "Folding along this line puts the short top side onto the long bottom side, so the halves do not match.",
        "沿这条线对折，较短的上底会落在较长的下底上，两半不能重合。",
      ),
    },
    {
      name: rhombus,
      points: [
        [0, -p],
        [q, 0],
        [0, p],
        [-q, 0],
      ],
      line: [
        [0, -p],
        [0, p],
      ],
      yes: true,
      why: t(
        "Each diagonal of a rhombus is a line of symmetry: the two halves are mirror images.",
        "菱形的每条对角线都是对称轴：两半互为镜像。",
      ),
    },
    {
      name: para,
      points: [
        [0, 0],
        [l, 0],
        [l + o, w],
        [o, w],
      ],
      line: [
        [0, 0],
        [l + o, w],
      ],
      yes: false,
      why: t(
        "A diagonal cuts a parallelogram into two equal triangles, but folding along it does not put one onto the other, so it is not a line of symmetry.",
        "对角线把平行四边形分成两个完全一样的三角形，但沿它对折时两个三角形并不重合，所以它不是对称轴。",
      ),
    },
  ];
}

/** stretch extends a segment by a fifth of its length at each end, so a drawn line of symmetry reaches past the figure. */
function stretch([a, b]: readonly [Point, Point]): [Point, Point] {
  const [dx, dy] = [(b[0] - a[0]) / 5, (b[1] - a[1]) / 5];
  return [
    [a[0] - dx, a[1] - dy],
    [b[0] + dx, b[1] + dy],
  ];
}

export const linesOfSymmetry = topic(
  "lines-of-symmetry",
  t("Lines of Symmetry", "对称轴"),
  t(
    "A line of symmetry divides a figure into two halves that match exactly when the figure is folded along the line. A rectangle has 2 lines of symmetry, a square has 4, an isosceles triangle has 1, and a regular polygon with n sides has n. The diagonal of a rectangle that is not a square is not a line of symmetry.",
    "对称轴把图形分成两半，沿这条线对折时，两半能完全重合。长方形有 2 条对称轴，正方形有 4 条，等腰三角形有 1 条，正 n 边形有 n 条。不是正方形的长方形，对角线不是对称轴。",
  ),
  ["classifying-quadrilaterals"],
  ["4.G.A.3"],
  [
    {
      id: "counting-lines-of-symmetry",
      title: t("Counting lines of symmetry", "数对称轴"),
      explanation: t(
        "Imagine folding the figure. A rectangle folds onto itself along its 2 middle lines but not along a diagonal, so it has 2 lines of symmetry. A regular hexagon has 6: 3 through opposite vertices and 3 through the midpoints of opposite sides.",
        "想象把图形对折。长方形沿两条中线对折能重合，沿对角线则不能，所以它有 2 条对称轴。正六边形有 6 条：3 条经过相对的顶点，3 条经过相对边的中点。",
      ),
      generate(rng) {
        const s = rng.pick(shapes(rng));
        const pts = rotate(center(s.points), rng.int(0, 11) * 15);
        return {
          ...numberProblem({
            prompt: t(`How many lines of symmetry does this ${s.name.en} have?`, `这个${s.name["zh-CN"]}有几条对称轴？`),
            answer: s.lines,
            form: "integer",
            wrong: [...s.wrong],
            solution: s.why,
          }),
          figure: fig([{ kind: "polygon", points: pts }], `A ${s.name.en}.`, `一个${s.name["zh-CN"]}。`),
        };
      },
    },
    {
      id: "testing-a-line-of-symmetry",
      title: t("Testing a line", "判断一条直线是不是对称轴"),
      explanation: t(
        "To test a line, imagine folding along it: it is a line of symmetry only if every corner lands on a corner. The diagonal of a long rectangle is not, because a fold along it carries a corner outside the rectangle.",
        "判断一条直线时，想象沿它对折：只有每个角都落在另一个角上，它才是对称轴。细长长方形的对角线不是对称轴，因为沿它对折，角会落到长方形外面。",
      ),
      generate(rng) {
        const f = rng.pick(folds(rng));
        const deg = rng.int(0, 11) * 15;
        const all = rotate(center([...f.points, ...f.line]), deg);
        const pts = all.slice(0, f.points.length);
        const line = stretch([all[f.points.length]!, all[f.points.length + 1]!]);
        return {
          ...verdictChoice(rng, {
            prompt: t(`Is the dashed line a line of symmetry of this ${f.name.en}?`, `虚线是这个${f.name["zh-CN"]}的对称轴吗？`),
            holds: f.yes,
            yes: t("folding along it lands every corner on a corner", "沿它对折，每个角都落在另一个角上"),
            no: t("folding along it carries a corner to a spot with no corner", "沿它对折，有的角落到了没有角的地方"),
            yesWrong: t("it cuts the figure into two pieces of equal area", "它把图形分成面积相等的两部分"),
            noWrong: t("a line of symmetry must be horizontal or vertical", "对称轴必须是水平的或竖直的"),
            solution: f.why,
          }),
          figure: fig(
            [
              { kind: "polygon", points: pts },
              { kind: "segment", a: line[0], b: line[1], dashed: true, accent: true },
            ],
            `A ${f.name.en} with a dashed line drawn across it.`,
            `一个${f.name["zh-CN"]}，上面画了一条虚线。`,
          ),
        };
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Volumes with fractional edge lengths

/** box draws a rectangular prism with fractional edges, labeled in plain text. */
function box(l: Q, w: Q, h: Q, u: Unit): Figure {
  const draw = (q: Q) => Math.max(1, Math.round(q.toNumber()));
  return {
    svg: prismSvg(Math.min(draw(l), 8), Math.min(draw(w), 5), Math.min(draw(h), 6), {
      l: label(l, false, u),
      w: label(w, false, u),
      h: label(h, false, u),
    }),
    alt: t(
      `A box ${label(l, false, u)} long, ${label(w, false, u)} wide and ${label(h, false, u)} tall.`,
      `长 ${label(l, false, u)}、宽 ${label(w, false, u)}、高 ${label(h, false, u)} 的长方体。`,
    ),
  };
}

/** edges draws three edge lengths, at least one of them a mixed number or a fraction. */
function edges(rng: Rng): [Q, Q, Q] {
  const l = mixedNumber(rng, 1, 6);
  const w = rng.bool() ? Q.of(rng.int(1, 5)) : rng.bool() ? mixedNumber(rng, 1, 3) : properFraction(rng);
  const h = rng.bool() ? Q.of(rng.int(1, 6)) : mixedNumber(rng, 1, 4);
  return [l, w, h];
}

export const volumesOfRectangularPrismsWithFractionalEdgeLengths = topic(
  "volumes-of-rectangular-prisms-with-fractional-edge-lengths",
  t("Volumes of Rectangular Prisms With Fractional Edge Lengths", "棱长是分数的长方体的体积"),
  t(
    "The volume of a rectangular prism is V = lwh, also when the edge lengths are fractions. A box 2½ ft by 1½ ft by 2 ft has volume 5/2 × 3/2 × 2 = 15/2 = 7½ ft³. This is the same as packing the box with small cubes: a cube with ½ ft edges has volume ⅛ ft³, and 5 × 3 × 4 = 60 of them fill the box, giving 60 × ⅛ = 7½ ft³.",
    "长方体的体积是 V = lwh，棱长是分数时也一样。长 2½ 英尺、宽 1½ 英尺、高 2 英尺的箱子，体积是 5/2 × 3/2 × 2 = 15/2 = 7½ 立方英尺。这和用小正方体填满箱子的结果相同：棱长 ½ 英尺的正方体体积是 ⅛ 立方英尺，箱子里能放 5 × 3 × 4 = 60 个，体积是 60 × ⅛ = 7½ 立方英尺。",
  ),
  ["volumes-of-right-rectangular-prisms", "multiplying-mixed-numbers"],
  ["6.G.A.2"],
  [
    {
      id: "multiplying-the-edge-lengths",
      title: t("Multiplying the edge lengths", "棱长相乘"),
      explanation: t(
        "The volume of a box is length times width times height, also with fractional edges. Write mixed numbers as improper fractions, multiply, and simplify before or after.\n\nA box $3\\frac{1}{2}$ in by $2$ in by $1\\frac{1}{4}$ in has volume $\\frac{7}{2} \\times 2 \\times \\frac{5}{4} = \\frac{70}{8} = 8\\frac{3}{4}\\text{ in}^3$.",
        "长方体的体积等于长乘宽乘高，棱长是分数时也一样。把带分数化成假分数后相乘，可以先约分也可以最后约分。\n\n长 $3\\frac{1}{2}$ 英寸、宽 $2$ 英寸、高 $1\\frac{1}{4}$ 英寸的箱子，体积是 $\\frac{7}{2} \\times 2 \\times \\frac{5}{4} = \\frac{70}{8} = 8\\frac{3}{4}\\text{ in}^3$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [l, w, h] = edges(rng);
        const v = l.mul(w).mul(h);
        return {
          ...numberProblem({
            prompt: t("Find the volume of the rectangular prism.", "求这个长方体的体积。"),
            answer: v,
            unit: `${u}^3`,
            wrong: [l.add(w).add(h), l.mul(w), wholePart(l).mul(wholePart(w)).mul(wholePart(h))],
            solution: t(
              `Multiply the length, width and height:${steps(`V = ${product([l, w, h], false)}\\text{ ${u}}^3`)}`,
              `把长、宽、高相乘：${steps(`V = ${product([l, w, h], false)}\\text{ ${u}}^3`)}`,
            ),
          }),
          figure: box(l, w, h, u),
        };
      },
    },
    {
      id: "packing-with-unit-fraction-cubes",
      title: t("Packing with small cubes", "用小正方体填满"),
      explanation: t(
        "A box $1\\frac{1}{2}$ cm by $1$ cm by $2$ cm is packed with cubes whose edges are $\\frac{1}{2}$ cm. Along the edges fit $3$, $2$ and $4$ cubes, so $3 \\times 2 \\times 4 = 24$ cubes fill it. Each has volume $\\frac{1}{8}\\text{ cm}^3$, and $24 \\times \\frac{1}{8} = 3\\text{ cm}^3$, the same as $1\\frac{1}{2} \\times 1 \\times 2$.",
        "一个长 $1\\frac{1}{2}$ 厘米、宽 $1$ 厘米、高 $2$ 厘米的盒子，用棱长 $\\frac{1}{2}$ 厘米的正方体填满。沿三条棱分别能放 $3$、$2$、$4$ 个，所以共需 $3 \\times 2 \\times 4 = 24$ 个。每个体积是 $\\frac{1}{8}\\text{ cm}^3$，$24 \\times \\frac{1}{8} = 3\\text{ cm}^3$，与 $1\\frac{1}{2} \\times 1 \\times 2$ 相同。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const n = rng.pick([2, 3, 4]);
        const [a, b, c] = [rng.int(n + 1, 4 * n), rng.int(1, 3 * n), rng.int(1, 3 * n)];
        if (a % n === 0) return this.generate(rng);
        const [l, w, h] = [Q.of(a, n), Q.of(b, n), Q.of(c, n)];
        const count = a * b * c;
        const v = Q.of(count, n * n * n);
        return numberProblem({
          prompt: t(
            `A rectangular prism is $${measure(l, false, u)}$ long, $${measure(w, false, u)}$ wide and $${measure(h, false, u)}$ tall. How many cubes with edges $\\frac{1}{${n}}\\text{ ${u}}$ long are needed to fill it?`,
            `一个长方体长 $${measure(l, false, u)}$、宽 $${measure(w, false, u)}$、高 $${measure(h, false, u)}$。需要多少个棱长 $\\frac{1}{${n}}\\text{ ${u}}$ 的正方体才能把它填满？`,
          ),
          answer: count,
          form: "integer",
          wrong: [v, v.mul(Q.of(n)), Q.of(count, n)],
          solution: t(
            `Along each edge, ${n} cubes fit in every ${u}: ${[l, w, h].map((e) => `$${mixedLatex(e)} \\times ${n} = ${e.mul(Q.of(n)).toLatex()}$`).join(", ")}. So the number of cubes is${steps(`${a} \\times ${b} \\times ${c} = ${count}`)}Check: $${count} \\times \\frac{1}{${n ** 3}} = ${result(v)}$, the volume $${product([l, w, h], false)}$.`,
            `沿每条棱，每 1 ${u} 能放 ${n} 个正方体：${[l, w, h].map((e) => `$${mixedLatex(e)} \\times ${n} = ${e.mul(Q.of(n)).toLatex()}$`).join("，")}。所以正方体的个数是${steps(`${a} \\times ${b} \\times ${c} = ${count}`)}检验：$${count} \\times \\frac{1}{${n ** 3}} = ${result(v)}$，正好是体积 $${product([l, w, h], false)}$。`,
          ),
        });
      },
    },
  ],
);

/** Container is a real-world box described in words. */
interface Container {
  readonly en: string;
  readonly zh: string;
  readonly u: Unit;
}

/** containers describes boxes with the given edges. */
function containers(l: Q, w: Q, h: Q): Container[] {
  const [ft, inch] = [(q: Q) => measure(q, false, "ft"), (q: Q) => measure(q, false, "in")];
  return [
    {
      en: `A fish tank is $${ft(l)}$ long, $${ft(w)}$ wide and $${ft(h)}$ deep.`,
      zh: `一个鱼缸长 $${ft(l)}$、宽 $${ft(w)}$、深 $${ft(h)}$。`,
      u: "ft",
    },
    {
      en: `A storage bin is $${ft(l)}$ long, $${ft(w)}$ wide and $${ft(h)}$ tall.`,
      zh: `一个储物箱长 $${ft(l)}$、宽 $${ft(w)}$、高 $${ft(h)}$。`,
      u: "ft",
    },
    {
      en: `A jewelry box is $${inch(l)}$ long, $${inch(w)}$ wide and $${inch(h)}$ tall.`,
      zh: `一个首饰盒长 $${inch(l)}$、宽 $${inch(w)}$、高 $${inch(h)}$。`,
      u: "in",
    },
    {
      en: `A planter box is $${ft(l)}$ long, $${ft(w)}$ wide and $${ft(h)}$ tall, and it is filled to the top with soil.`,
      zh: `一个种植箱长 $${ft(l)}$、宽 $${ft(w)}$、高 $${ft(h)}$，里面装满了土。`,
      u: "ft",
    },
  ];
}

export const volumesOfRectangularPrismsWithFractionalEdgeLengthsWordProblems = topic(
  "volumes-of-rectangular-prisms-with-fractional-edge-lengths-word-problems",
  t("Volumes of Rectangular Prisms With Fractional Edge Lengths: Word Problems", "棱长是分数的长方体的体积：应用题"),
  t(
    "Volume tells how much a box, tank or container holds. Multiply its three dimensions: a tank 2½ ft by 1 ft by 1½ ft holds 5/2 × 1 × 3/2 = 15/4 = 3¾ ft³. When the volume and two dimensions are known, divide the volume by the area of the base to find the third: V = lwh, so h = V ÷ (lw).",
    "体积表示盒子、水箱等容器能装多少。把三个尺寸相乘：长 2½ 英尺、宽 1 英尺、高 1½ 英尺的水箱能装 5/2 × 1 × 3/2 = 15/4 = 3¾ 立方英尺。已知体积和两个尺寸时，用体积除以底面积求第三个尺寸：V = lwh，所以 h = V ÷ (lw)。",
  ),
  ["volumes-of-rectangular-prisms-with-fractional-edge-lengths", "dividing-mixed-numbers"],
  ["6.G.A.2"],
  [
    {
      id: "volumes-of-containers",
      title: t("How much a container holds", "容器能装多少"),
      explanation: t(
        "How much a box-shaped container holds is its volume: multiply the three dimensions. If it is only filled to some depth, use that depth as the height.\n\nA sandbox $4\\frac{1}{2}$ ft by $3$ ft with sand $\\frac{2}{3}$ ft deep holds $\\frac{9}{2} \\times 3 \\times \\frac{2}{3} = 9\\text{ ft}^3$ of sand.",
        "长方体容器能装多少就是求体积：把三个尺寸相乘。如果只装到一定深度，就用这个深度作高。\n\n一个长 $4\\frac{1}{2}$ 英尺、宽 $3$ 英尺的沙坑，沙子深 $\\frac{2}{3}$ 英尺，共有 $\\frac{9}{2} \\times 3 \\times \\frac{2}{3} = 9\\text{ ft}^3$ 沙子。",
      ),
      generate(rng) {
        const [l, w, h] = edges(rng);
        const c = rng.pick(containers(l, w, h));
        const v = l.mul(w).mul(h);
        const surface = l.mul(w).add(l.mul(h)).add(w.mul(h)).mul(Q.of(2));
        return numberProblem({
          prompt: t(`${c.en} What is its volume?`, `${c.zh}它的体积是多少？`),
          answer: v,
          unit: `${c.u}^3`,
          wrong: [l.add(w).add(h), l.mul(w), surface],
          solution: t(
            `Multiply the three dimensions:${steps(`V = ${product([l, w, h], false)}\\text{ ${c.u}}^3`)}`,
            `把三个尺寸相乘：${steps(`V = ${product([l, w, h], false)}\\text{ ${c.u}}^3`)}`,
          ),
        });
      },
    },
    {
      id: "missing-edge-length",
      title: t("A missing dimension", "求未知的尺寸"),
      explanation: t(
        "A box holds $15\\text{ ft}^3$, and its base is $2\\frac{1}{2}$ ft by $2$ ft. The base area is $5\\text{ ft}^2$, so the box is $15 \\div 5 = 3$ ft tall.",
        "一个箱子的容积是 $15\\text{ ft}^3$，底面长 $2\\frac{1}{2}$ 英尺、宽 $2$ 英尺。底面积是 $5\\text{ ft}^2$，所以箱子高 $15 \\div 5 = 3$ 英尺。",
      ),
      generate(rng) {
        const u = rng.pick(["ft", "in"] as const);
        const [l, w, h] = edges(rng);
        const base = l.mul(w);
        const v = base.mul(h);
        const what = rng.pick([
          { en: "box", zh: "箱子" },
          { en: "tank", zh: "水箱" },
          { en: "drawer", zh: "抽屉" },
        ]);
        return numberProblem({
          prompt: t(
            `A rectangular ${what.en} has a volume of $${measure(v, false, u, 3)}$. Its base is $${measure(l, false, u)}$ long and $${measure(w, false, u)}$ wide. How tall is the ${what.en}?`,
            `一个长方体${what.zh}的体积是 $${measure(v, false, u, 3)}$，底面长 $${measure(l, false, u)}$、宽 $${measure(w, false, u)}$。这个${what.zh}有多高？`,
          ),
          answer: h,
          unit: u,
          wrong: [v.div(l), v.sub(base), v.div(l.add(w))],
          solution: t(
            `The volume is the area of the base times the height. The base area is $${product([l, w], false)}$, so${steps(`h = ${quotient(v, base, false)}\\text{ ${u}}`)}`,
            `体积等于底面积乘高。底面积是 $${product([l, w], false)}$，所以${steps(`h = ${quotient(v, base, false)}\\text{ ${u}}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Coordinate geometry

/** coordinate draws a nonzero integer coordinate from −9 to 9. */
const coordinate = (rng: Rng) => rng.nonZero(-9, 9);

/** apart writes the distance between two values on one axis, by subtracting or by adding absolute values. */
function apart(a: number, b: number): string {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  if (hi > 0 && lo < 0) return `|${hi}| + |${lo}| = ${hi} + ${-lo} = ${hi - lo}`;
  return `${hi} - ${lo < 0 ? `(${lo})` : lo} = ${hi - lo}`;
}

/** absError is the common wrong distance that subtracts absolute values even across an axis. */
const absError = (a: number, b: number) => Math.abs(Math.abs(a) - Math.abs(b));

export const distancesBetweenPointsInTheCoordinatePlane = topic(
  "distances-between-points-in-the-coordinate-plane",
  t("Distances Between Points in the Coordinate Plane", "坐标平面中两点间的距离"),
  t(
    "Two points with the same x-coordinate lie on a vertical line, and two points with the same y-coordinate lie on a horizontal line. Their distance is found from the other coordinates. On opposite sides of an axis, add the absolute values: (2, −3) and (2, 5) are 3 + 5 = 8 units apart. On the same side, subtract: (−6, 1) and (−2, 1) are 6 − 2 = 4 units apart.",
    "横坐标相同的两点在一条竖直线上，纵坐标相同的两点在一条水平线上。它们的距离由另一个坐标求出。两点在坐标轴两侧时，把绝对值相加：(2, −3) 与 (2, 5) 相距 3 + 5 = 8 个单位。在同一侧时，相减：(−6, 1) 与 (−2, 1) 相距 6 − 2 = 4 个单位。",
  ),
  ["solving-problems-in-the-coordinate-plane"],
  ["6.NS.C.8", "6.G.A.3"],
  [
    {
      id: "distance-between-two-points",
      title: t("The distance between two points", "两点间的距离"),
      explanation: t(
        "$(-4, 7)$ and $(-4, -2)$ share the $x$-coordinate $-4$, so they lie on a vertical line. The $y$-coordinates $7$ and $-2$ are on opposite sides of the $x$-axis: the distance is $7 + 2 = 9$, not $7 - 2 = 5$.",
        "$(-4, 7)$ 与 $(-4, -2)$ 的横坐标都是 $-4$，所以它们在一条竖直线上。纵坐标 $7$ 和 $-2$ 在 $x$ 轴两侧：距离是 $7 + 2 = 9$，而不是 $7 - 2 = 5$。",
      ),
      generate(rng) {
        const shared = rng.int(-9, 9);
        const a = coordinate(rng);
        const b = coordinate(rng);
        if (a === b) return this.generate(rng);
        const vertical = rng.bool();
        const [p, q] = vertical ? [pointLatex([shared, a]), pointLatex([shared, b])] : [pointLatex([a, shared]), pointLatex([b, shared])];
        const d = Math.abs(a - b);
        const [axisEn, axisZh] = vertical ? ["$y$", "纵"] : ["$x$", "横"];
        return numberProblem({
          prompt: t(`What is the distance between $${p}$ and $${q}$?`, `$${p}$ 与 $${q}$ 之间的距离是多少？`),
          answer: d,
          form: "integer",
          wrong: [absError(a, b), Math.abs(a) + Math.abs(b)],
          solution: t(
            `The points share the ${vertical ? "$x$" : "$y$"}-coordinate $${shared}$, so they lie on a ${vertical ? "vertical" : "horizontal"} line. Compare the ${axisEn}-coordinates $${a}$ and $${b}$:${steps(apart(a, b))}`,
            `两点的${vertical ? "横" : "纵"}坐标都是 $${shared}$，所以它们在一条${vertical ? "竖直" : "水平"}线上。比较${axisZh}坐标 $${a}$ 和 $${b}$：${steps(apart(a, b))}`,
          ),
        });
      },
    },
    {
      id: "point-at-a-given-distance",
      title: t("A point at a given distance", "求给定距离处的点"),
      explanation: t(
        "Moving up or down changes only the $y$-coordinate, and moving left or right changes only the $x$-coordinate. Add for up and right, subtract for down and left.\n\nPoint $B$ is $6$ units below $A(3, 2)$. Moving down changes only the $y$-coordinate: $2 - 6 = -4$, so $B = (3, -4)$.",
        "上下移动只改变纵坐标，左右移动只改变横坐标。向上、向右用加法，向下、向左用减法。\n\n点 $B$ 在 $A(3, 2)$ 下方 $6$ 个单位。向下移动只改变纵坐标：$2 - 6 = -4$，所以 $B = (3, -4)$。",
      ),
      generate(rng) {
        const [x, y] = [rng.int(-8, 8), rng.int(-8, 8)];
        const d = rng.int(2, 12);
        const dir = rng.int(0, 3);
        const moves: [number, number][] = [
          [d, 0],
          [-d, 0],
          [0, d],
          [0, -d],
        ];
        const [dx, dy] = moves[dir]!;
        const words = [t("to the right of", "右边"), t("to the left of", "左边"), t("above", "上方"), t("below", "下方")][dir]!;
        const answer = [x + dx, y + dy];
        const changed = dx !== 0 ? t("$x$", "横") : t("$y$", "纵");
        return pointProblem({
          prompt: t(
            `Point $B$ is $${d}$ units ${words.en} $A${pointLatex([x, y])}$. What are the coordinates of $B$?`,
            `点 $B$ 在 $A${pointLatex([x, y])}$ ${words["zh-CN"]} $${d}$ 个单位处。$B$ 的坐标是什么？`,
          ),
          answer,
          wrong: [
            [x - dx, y - dy],
            [x + dy, y + dx],
            [x - dy, y - dx],
          ],
          solution: t(
            `Moving ${dx !== 0 ? "left or right" : "up or down"} changes only the ${changed.en}-coordinate, which ${dx + dy > 0 ? "increases" : "decreases"} by $${d}$: $B = ${pointLatex(answer)}$.`,
            `${dx !== 0 ? "左右" : "上下"}移动只改变${changed["zh-CN"]}坐标，它${dx + dy > 0 ? "增加" : "减少"} $${d}$：$B = ${pointLatex(answer)}$。`,
          ),
        });
      },
    },
  ],
);

/** vertexList writes named vertices: "A(1, 2), B(5, 2), C(5, 7) and D(1, 7)". */
function vertexList(pts: readonly (readonly number[])[], and: string): string {
  const named = pts.map((p, i) => `$${"ABCD"[i]}${pointLatex(p)}$`);
  return `${named.slice(0, -1).join(and === "和" ? "、" : ", ")} ${and} ${named.at(-1)}`;
}

/** QuadKind is a kind of quadrilateral that can be told from its vertices. */
type QuadKind = "square" | "rectangle" | "parallelogram" | "trapezoid";

const quadKinds: readonly QuadKind[] = ["square", "rectangle", "parallelogram", "trapezoid"];

const quadOptions: Record<QuadKind, Text> = {
  square: t("A square", "正方形"),
  rectangle: t("A rectangle that is not a square", "不是正方形的长方形"),
  parallelogram: t("A parallelogram that is not a rectangle", "不是长方形的平行四边形"),
  trapezoid: t("A trapezoid", "梯形"),
};

/** coordinatePolygonFigure plots a polygon with labeled vertices in the coordinate plane, highlighting the sides listed by their first vertex's index. */
function coordinatePolygonFigure(pts: readonly Point[], names: string, highlight: readonly number[], alt: Text): Figure {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const view = { xMin: Math.min(-1, ...xs) - 1, xMax: Math.max(1, ...xs) + 1, yMin: Math.min(-1, ...ys) - 1, yMax: Math.max(1, ...ys) + 1 };
  const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
  const marks: PlaneMark[] = pts.flatMap((p, i): PlaneMark[] => {
    const q = pts[(i + 1) % pts.length]!;
    const dir = `${p[1] >= cy ? "n" : "s"}${p[0] >= cx ? "e" : "w"}` as const;
    return [
      { kind: "segment", a: p, b: q, accent: highlight.includes(i) },
      { kind: "point", at: p, label: names[i]!, dir },
    ];
  });
  return { svg: plane(view, marks), alt };
}

export const polygonsInTheCoordinatePlane = topic(
  "polygons-in-the-coordinate-plane",
  t("Polygons in the Coordinate Plane", "坐标平面中的多边形"),
  t(
    "A polygon can be drawn in the coordinate plane by plotting its vertices and joining them in order. A side whose endpoints share an x- or y-coordinate is vertical or horizontal, and its length is the distance between the endpoints. Comparing sides tells what kind of polygon it is: for example, a quadrilateral with horizontal and vertical sides is a rectangle, and a square if all four sides are equal.",
    "在坐标平面中描出多边形的各个顶点，再依次连接，就能画出这个多边形。端点横坐标或纵坐标相同的边是竖直的或水平的，它的长度就是两个端点之间的距离。比较各边就能判断多边形的类型：例如，各边都是水平或竖直的四边形是长方形，四条边都相等时是正方形。",
  ),
  ["distances-between-points-in-the-coordinate-plane", "classifying-quadrilaterals"],
  ["6.G.A.3"],
  [
    {
      id: "side-lengths-from-vertices",
      title: t("Side lengths from the vertices", "由顶点求边长"),
      explanation: t(
        "A side whose endpoints share an $x$-coordinate is vertical; its length is the distance between the $y$-coordinates. When they have opposite signs, add their absolute values, since the side crosses the axis.\n\nRectangle $ABCD$ has vertices $A(-3, -2)$, $B(5, -2)$, $C(5, 4)$ and $D(-3, 4)$. Side $BC$ is vertical, from $y = -2$ to $y = 4$, so it is $2 + 4 = 6$ units long.",
        "两个端点横坐标相同的边是竖直的，它的长度是两个纵坐标之间的距离。两个坐标符号相反时，把它们的绝对值相加，因为这条边跨过了坐标轴。\n\n长方形 $ABCD$ 的顶点是 $A(-3, -2)$、$B(5, -2)$、$C(5, 4)$ 和 $D(-3, 4)$。边 $BC$ 是竖直的，从 $y = -2$ 到 $y = 4$，所以长 $2 + 4 = 6$ 个单位。",
      ),
      figure: coordinatePolygonFigure(
        [
          [-3, -2],
          [5, -2],
          [5, 4],
          [-3, 4],
        ],
        "ABCD",
        [1],
        t(
          "Rectangle ABCD plotted with A(−3, −2), B(5, −2), C(5, 4) and D(−3, 4). The vertical side BC is highlighted; it runs from y = −2 up across the x-axis to y = 4.",
          "在坐标平面中画出长方形 ABCD：A(−3, −2)、B(5, −2)、C(5, 4)、D(−3, 4)。竖直边 BC 被高亮，它从 y = −2 向上跨过 x 轴到 y = 4。",
        ),
      ),
      generate(rng) {
        const [x1, x2] = [rng.int(-9, 2), rng.int(1, 9)];
        const [y1, y2] = [rng.int(-9, 2), rng.int(1, 9)];
        if (x1 >= x2 || y1 >= y2) return this.generate(rng);
        const triangle = rng.bool();
        const pts = triangle
          ? [
              [x1, y1],
              [x2, y1],
              [x1, y2],
            ]
          : [
              [x1, y1],
              [x2, y1],
              [x2, y2],
              [x1, y2],
            ];
        const askBC = !triangle && rng.bool();
        const [name, from, to] = triangle ? (rng.bool() ? ["AB", x1, x2] : ["AC", y1, y2]) : askBC ? ["BC", y1, y2] : ["AB", x1, x2];
        const vertical = name !== "AB";
        const shape = triangle ? t("Right triangle $ABC$", "直角三角形 $ABC$") : t("Rectangle $ABCD$", "长方形 $ABCD$");
        return numberProblem({
          prompt: t(
            `${shape.en} has vertices ${vertexList(pts, "and")}. How long is side $${name}$?`,
            `${shape["zh-CN"]} 的顶点是 ${vertexList(pts, "和")}。边 $${name}$ 有多长？`,
          ),
          answer: to - from,
          form: "integer",
          wrong: [absError(from, to), Math.abs(from) + Math.abs(to)],
          solution: t(
            `Side $${name}$ is ${vertical ? "vertical" : "horizontal"}: its endpoints share the ${vertical ? "$x$" : "$y$"}-coordinate. Compare the other coordinates, $${from}$ and $${to}$:${steps(apart(from, to))}`,
            `边 $${name}$ 是${vertical ? "竖直" : "水平"}的：两个端点的${vertical ? "横" : "纵"}坐标相同。比较另一个坐标 $${from}$ 和 $${to}$：${steps(apart(from, to))}`,
          ),
        });
      },
    },
    {
      id: "identifying-polygons-from-vertices",
      title: t("Identifying the polygon", "判断多边形的类型"),
      explanation: t(
        "$A(-2, 1)$, $B(4, 1)$, $C(6, 5)$, $D(0, 5)$: $AB$ and $DC$ are both horizontal and $6$ units long, so they are parallel and equal. $AD$ is not vertical, because $A$ and $D$ have different $x$-coordinates, so the angles are not right angles: $ABCD$ is a parallelogram that is not a rectangle.",
        "$A(-2, 1)$、$B(4, 1)$、$C(6, 5)$、$D(0, 5)$：$AB$ 和 $DC$ 都是水平的，长都是 $6$ 个单位，所以它们平行且相等。$A$ 和 $D$ 的横坐标不同，$AD$ 不是竖直的，所以角不是直角：$ABCD$ 是不是长方形的平行四边形。",
      ),
      figure: coordinatePolygonFigure(
        [
          [-2, 1],
          [4, 1],
          [6, 5],
          [0, 5],
        ],
        "ABCD",
        [0, 2],
        t(
          "Quadrilateral ABCD plotted with A(−2, 1), B(4, 1), C(6, 5) and D(0, 5). The horizontal sides AB and CD are highlighted, each 6 units long; the slanted sides AD and BC are not vertical.",
          "在坐标平面中画出四边形 ABCD：A(−2, 1)、B(4, 1)、C(6, 5)、D(0, 5)。水平边 AB 和 CD 被高亮，长都是 6 个单位；斜边 AD 和 BC 不是竖直的。",
        ),
      ),
      generate(rng) {
        const kind = rng.pick(quadKinds);
        const [x0, y0] = [rng.int(-8, 0), rng.int(-8, 0)];
        const b = rng.int(3, 9);
        const h = kind === "square" ? b : rng.int(2, 8);
        if (kind === "rectangle" && h === b) return this.generate(rng);
        const o = kind === "square" || kind === "rectangle" ? 0 : rng.nonZero(-3, 3);
        const top = kind === "trapezoid" ? b + rng.nonZero(-2, 3) : b;
        if (top < 1) return this.generate(rng);
        const pts = [
          [x0, y0],
          [x0 + b, y0],
          [x0 + o + top, y0 + h],
          [x0 + o, y0 + h],
        ];
        const whyEn: Record<QuadKind, string> = {
          square: `$AB$ and $DC$ are horizontal and $BC$ and $AD$ are vertical, so every angle is a right angle, and all four sides are $${b}$ units long. $ABCD$ is a square.`,
          rectangle: `$AB$ and $DC$ are horizontal and $BC$ and $AD$ are vertical, so every angle is a right angle. The horizontal sides are $${b}$ units long and the vertical sides $${h}$, so $ABCD$ is a rectangle that is not a square.`,
          parallelogram: `$AB$ and $DC$ are horizontal, so they are parallel, and both are $${b}$ units long. $A$ and $D$ have different $x$-coordinates, so $AD$ is slanted and the angles are not right angles: $ABCD$ is a parallelogram that is not a rectangle.`,
          trapezoid: `$AB$ and $DC$ are horizontal, so they are parallel, but they are $${b}$ and $${top}$ units long. Parallel sides of different lengths mean the other two sides are not parallel: $ABCD$ is a trapezoid.`,
        };
        const whyZh: Record<QuadKind, string> = {
          square: `$AB$ 和 $DC$ 是水平的，$BC$ 和 $AD$ 是竖直的，所以每个角都是直角，而且四条边都长 $${b}$ 个单位。$ABCD$ 是正方形。`,
          rectangle: `$AB$ 和 $DC$ 是水平的，$BC$ 和 $AD$ 是竖直的，所以每个角都是直角。水平边长 $${b}$ 个单位，竖直边长 $${h}$ 个单位，所以 $ABCD$ 是不是正方形的长方形。`,
          parallelogram: `$AB$ 和 $DC$ 是水平的，所以它们平行，而且长都是 $${b}$ 个单位。$A$ 和 $D$ 的横坐标不同，所以 $AD$ 是斜的，角不是直角：$ABCD$ 是不是长方形的平行四边形。`,
          trapezoid: `$AB$ 和 $DC$ 是水平的，所以它们平行，但长度分别是 $${b}$ 和 $${top}$ 个单位。一组平行边长度不同，说明另外两条边不平行：$ABCD$ 是梯形。`,
        };
        return choiceProblem({
          prompt: t(
            `Quadrilateral $ABCD$ has vertices ${vertexList(pts, "and")}. What kind of quadrilateral is it?`,
            `四边形 $ABCD$ 的顶点是 ${vertexList(pts, "和")}。它是哪种四边形？`,
          ),
          options: quadKinds.map((k) => quadOptions[k]),
          correct: quadKinds.indexOf(kind),
          solution: t(whyEn[kind], whyZh[kind]),
        });
      },
    },
  ],
);

export const findingAreasAndPerimetersInTheCoordinatePlane = topic(
  "finding-areas-and-perimeters-in-the-coordinate-plane",
  t("Finding Areas and Perimeters in the Coordinate Plane", "求坐标平面中图形的面积和周长"),
  t(
    "To find the perimeter or area of a polygon from its vertices, first find the lengths of its horizontal and vertical sides from the coordinates. The rectangle with vertices (−2, −1), (4, −1), (4, 3) and (−2, 3) is 6 units wide and 4 units tall, so its perimeter is 2(6 + 4) = 20 units and its area is 6 × 4 = 24 square units. For a triangle with a horizontal base, the height is the vertical distance from the third vertex to the base.",
    "由顶点求多边形的周长或面积时，先用坐标求出水平边和竖直边的长度。顶点为 (−2, −1)、(4, −1)、(4, 3)、(−2, 3) 的长方形宽 6 个单位、高 4 个单位，所以周长是 2(6 + 4) = 20 个单位，面积是 6 × 4 = 24 平方单位。底边水平的三角形，高是第三个顶点到底边的竖直距离。",
  ),
  ["polygons-in-the-coordinate-plane", "areas-of-triangles"],
  ["6.G.A.3"],
  [
    {
      id: "perimeters-of-rectangles-from-vertices",
      title: t("Perimeters of rectangles", "长方形的周长"),
      explanation: t(
        "Find the length of one horizontal side and one vertical side from the coordinates, then the perimeter is $2 \\times$ (length $+$ width).\n\nRectangle $A(-5, 2)$, $B(3, 2)$, $C(3, 7)$, $D(-5, 7)$: $AB = 5 + 3 = 8$ and $BC = 7 - 2 = 5$, so the perimeter is $2(8 + 5) = 26$ units.",
        "根据坐标求出一条横边和一条竖边的长度，周长就是 $2 \\times$（长 $+$ 宽）。\n\n长方形 $A(-5, 2)$、$B(3, 2)$、$C(3, 7)$、$D(-5, 7)$：$AB = 5 + 3 = 8$，$BC = 7 - 2 = 5$，所以周长是 $2(8 + 5) = 26$ 个单位。",
      ),
      generate(rng) {
        const [x1, x2] = [rng.int(-9, 3), rng.int(-2, 9)];
        const [y1, y2] = [rng.int(-9, 3), rng.int(-2, 9)];
        if (x2 - x1 < 2 || y2 - y1 < 2) return this.generate(rng);
        const [w, h] = [x2 - x1, y2 - y1];
        const pts = [
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
        ];
        return numberProblem({
          prompt: t(
            `Rectangle $ABCD$ has vertices ${vertexList(pts, "and")}. What is its perimeter, in units?`,
            `长方形 $ABCD$ 的顶点是 ${vertexList(pts, "和")}。它的周长是多少个单位？`,
          ),
          answer: 2 * (w + h),
          form: "integer",
          wrong: [w * h, w + h, 2 * (absError(x1, x2) + absError(y1, y2))],
          solution: t(
            `$AB$ is horizontal and $BC$ is vertical:${steps(`AB = ${apart(x1, x2)}`, `BC = ${apart(y1, y2)}`, `P = 2(${w} + ${h}) = ${2 * (w + h)}`)}`,
            `$AB$ 是水平的，$BC$ 是竖直的：${steps(`AB = ${apart(x1, x2)}`, `BC = ${apart(y1, y2)}`, `P = 2(${w} + ${h}) = ${2 * (w + h)}`)}`,
          ),
        });
      },
    },
    {
      id: "areas-of-triangles-from-vertices",
      title: t("Areas of triangles", "三角形的面积"),
      explanation: t(
        "Triangle $A(-3, -2)$, $B(5, -2)$, $C(1, 4)$: the base $AB$ is horizontal and $3 + 5 = 8$ units long. The height is the vertical distance from $C$ to the line $y = -2$, which is $4 + 2 = 6$. The area is $\\frac{1}{2} \\times 8 \\times 6 = 24$ square units.",
        "三角形 $A(-3, -2)$、$B(5, -2)$、$C(1, 4)$：底 $AB$ 是水平的，长 $3 + 5 = 8$ 个单位。高是 $C$ 到直线 $y = -2$ 的竖直距离，即 $4 + 2 = 6$。面积是 $\\frac{1}{2} \\times 8 \\times 6 = 24$ 平方单位。",
      ),
      generate(rng) {
        const [x1, x2] = [rng.int(-9, 2), rng.int(-1, 9)];
        const y0 = rng.int(-8, 2);
        const [cx, cy] = [rng.int(-9, 9), rng.int(-2, 9)];
        if (x2 - x1 < 2 || cy - y0 < 2) return this.generate(rng);
        const [b, h] = [x2 - x1, cy - y0];
        const pts = [
          [x1, y0],
          [x2, y0],
          [cx, cy],
        ];
        const area = Q.of(b * h, 2);
        return numberProblem({
          prompt: t(
            `Triangle $ABC$ has vertices ${vertexList(pts, "and")}. What is its area, in square units?`,
            `三角形 $ABC$ 的顶点是 ${vertexList(pts, "和")}。它的面积是多少平方单位？`,
          ),
          answer: area,
          wrong: [b * h, Q.of(absError(x1, x2) * h, 2), Q.of(b * Math.abs(cy), 2)],
          solution: t(
            `The base $AB$ is horizontal, and the height is the vertical distance from $C$ to the line $y = ${y0}$:${steps(`AB = ${apart(x1, x2)}`, `h = ${apart(y0, cy)}`, `A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}`)}`,
            `底 $AB$ 是水平的，高是 $C$ 到直线 $y = ${y0}$ 的竖直距离：${steps(`AB = ${apart(x1, x2)}`, `h = ${apart(y0, cy)}`, `A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}`)}`,
          ),
        });
      },
    },
  ],
);

/** grade6GeometryTopics lists the 6th grade topics on area, symmetry, volume and coordinate geometry. */
export const grade6GeometryTopics: readonly TopicDef[] = [
  areasOfRectangles,
  areasOfRightTriangles,
  areasOfTriangles,
  areasAndPerimetersOfParallelograms,
  findingAreasOfPolygonsUsingDecomposition,
  findingAreasBetweenShapes,
  linesOfSymmetry,
  volumesOfRectangularPrismsWithFractionalEdgeLengths,
  volumesOfRectangularPrismsWithFractionalEdgeLengthsWordProblems,
  distancesBetweenPointsInTheCoordinatePlane,
  polygonsInTheCoordinatePlane,
  findingAreasAndPerimetersInTheCoordinatePlane,
];
