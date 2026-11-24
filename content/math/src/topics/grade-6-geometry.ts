import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type Mark, type PlaneMark, type Point, plane, Q, sketch } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { mixedLatex, pointLatex } from "../problems.ts";
import { height, rectangle, sides } from "./area.ts";
import type { Pair, Walk, Wrong } from "./early-grades-more-kit.ts";
import { prismSvg } from "./grade-5-measurement.ts";
import { chosen, decided, drawn, lesson, located, type Off, valued, withIntro } from "./grade-6-kit.ts";

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

/** sideWalk writes the work of multiplying two sides: decimals as whole numbers and then the decimal point, fractions by writing mixed numbers as improper fractions first. */
function sideWalk(l: Q, w: Q, decimal: boolean, u: Unit): Walk[] {
  const a = l.mul(w);
  if (decimal) {
    const places = (l.isInteger() ? 0 : 1) + (w.isInteger() ? 0 : 1);
    const [li, wi] = [l.mul(Q.of(10 ** (l.isInteger() ? 0 : 1))), w.mul(Q.of(10 ** (w.isInteger() ? 0 : 1)))];
    return [
      [
        ["Multiply as whole numbers", "按整数相乘"],
        ["Leave out the decimal points:", "先不看小数点："],
        [`${dec(li)} \\times ${dec(wi)} = ${dec(li.mul(wi))}`],
      ],
      [
        ["Place the decimal point", "点上小数点"],
        [`The factors have $${places}$ decimal place${places === 1 ? "" : "s"} in all:`, `两个因数一共有 $${places}$ 位小数：`],
        [`A = ${dec(l)} \\times ${dec(w)} = ${dec(a)}\\text{ ${u}}^2`],
      ],
    ];
  }
  const written = [l, w].filter((q) => !q.isInteger() && q.cmp(Q.one) > 0).map((q) => `${mixedLatex(q)} = ${q.toLatex()}`);
  return [
    [
      ["Write the sides as fractions", "把边长化成分数"],
      written.length > 0
        ? ["Mixed numbers become improper fractions:", "带分数化成假分数："]
        : ["The sides are already fractions or whole numbers:", "边长已经是分数或整数："],
      written.length > 0 ? written : [`${l.toLatex()}, \\ ${w.toLatex()}`],
    ],
    [
      ["Multiply", "相乘"],
      ["Length times width:", "长乘宽："],
      [`A = ${l.toLatex()} \\times ${w.toLatex()} = ${result(a)}\\text{ ${u}}^2`],
    ],
  ];
}

/** splitCheck multiplies a mixed number by a factor in two parts, its whole part and its fraction part. */
function splitCheck(l: Q, w: Q): Pair {
  const whole = wholePart(l);
  const part = l.sub(whole);
  const [x, y] = [whole.mul(w), part.mul(w)];
  const line = `${whole.toLatex()} \\times ${mixedLatex(w)} + ${part.toLatex()} \\times ${mixedLatex(w)} = ${mixedLatex(x)} + ${mixedLatex(y)} = ${mixedLatex(x.add(y))}`;
  return [
    `In two parts, $${mixedLatex(l)} = ${whole.toLatex()} + ${part.toLatex()}$: $${line}$.`,
    `分成两部分，$${mixedLatex(l)} = ${whole.toLatex()} + ${part.toLatex()}$：$${line}$。`,
  ];
}

export const areasOfRectangles = withIntro(
  topic(
    "areas-of-rectangles",
    t("Areas of Rectangles", "长方形的面积"),
    t(
      "The area of a rectangle is its length times its width, A = lw, also when the sides are fractions or decimals: a rectangle 2½ m by 1½ m has area 5/2 × 3/2 = 15/4 = 3¾ m². Area is measured in square units. When the area and one side are known, divide the area by that side to find the other side.",
      "长方形的面积等于长乘宽，A = lw；边长是分数或小数时也一样：长 2½ 米、宽 1½ 米的长方形，面积是 5/2 × 3/2 = 15/4 = 3¾ 平方米。面积用平方单位计量。已知面积和一条边时，用面积除以这条边，就得到另一条边。",
    ),
    ["finding-areas-using-fraction-multiplication", "multiplying-two-digit-decimals"],
    ["6.G.A.1"],
    [
      lesson(
        "fractional-and-decimal-side-lengths",
        ["Fraction and decimal side lengths", "边长是分数或小数"],
        [
          [
            "Area is length times width, whatever kind of numbers the sides are. A rectangle $3.5$ m long and $2.4$ m wide has area $3.5 \\times 2.4 = 8.4\\text{ m}^2$. One $2\\frac{1}{2}$ ft by $1\\frac{1}{3}$ ft has area $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{10}{3} = 3\\frac{1}{3}\\text{ ft}^2$: write mixed numbers as fractions before multiplying.",
            "不管边长是什么数，面积都是长乘宽。长 $3.5$ 米、宽 $2.4$ 米的长方形，面积是 $3.5 \\times 2.4 = 8.4\\text{ m}^2$。长 $2\\frac{1}{2}$ 英尺、宽 $1\\frac{1}{3}$ 英尺的长方形，面积是 $\\frac{5}{2} \\times \\frac{4}{3} = \\frac{10}{3} = 3\\frac{1}{3}\\text{ ft}^2$：先把带分数化成假分数，再相乘。",
          ],
          [
            "$3.5 \\times 2.4$ lies between $3 \\times 2 = 6$ and $4 \\times 3 = 12$, and so does $8.4$.",
            "$3.5 \\times 2.4$ 在 $3 \\times 2 = 6$ 和 $4 \\times 3 = 12$ 之间，$8.4$ 也在。",
          ],
          [
            "Do not multiply the whole parts and the fraction parts separately: $2 \\times 1 + \\frac{1}{2} \\times \\frac{1}{3}$ misses two of the four pieces.",
            "不要把整数部分和分数部分分开相乘：$2 \\times 1 + \\frac{1}{2} \\times \\frac{1}{3}$ 漏掉了四块中的两块。",
          ],
        ],
        (rng) => {
          for (;;) {
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
            if (l.cmp(w) <= 0) continue;
            const a = l.mul(w);
            const pts = rectangle(l.toNumber(), w.toNumber());
            const [lo, hi] = [Math.floor(l.toNumber()) * Math.floor(w.toNumber()), Math.ceil(l.toNumber()) * Math.ceil(w.toNumber())];
            const check: Pair = decimal
              ? [
                  `$${dec(l)} \\times ${dec(w)}$ lies between $${Math.floor(l.toNumber())} \\times ${Math.floor(w.toNumber())} = ${lo}$ and $${Math.ceil(l.toNumber())} \\times ${Math.ceil(w.toNumber())} = ${hi}$, and so does $${dec(a)}$.`,
                  `$${dec(l)} \\times ${dec(w)}$ 在 $${Math.floor(l.toNumber())} \\times ${Math.floor(w.toNumber())} = ${lo}$ 和 $${Math.ceil(l.toNumber())} \\times ${Math.ceil(w.toNumber())} = ${hi}$ 之间，$${dec(a)}$ 也在。`,
                ]
              : splitCheck(l, w);
            return valued(
              ["Find the area of the rectangle.", "求这个长方形的面积。"],
              a,
              sideWalk(l, w, decimal, u),
              check,
              [
                [l.add(w).mul(Q.of(2)), "That is the perimeter, the distance around, not the area.", "这是周长，即一圈的长度，不是面积。"],
                [l.add(w), "That adds the length and the width instead of multiplying them.", "这是把长和宽相加，而不是相乘。"],
                decimal
                  ? [a.mul(Q.of(10)), "That puts the decimal point one place too far to the right.", "这把小数点向右多移了一位。"]
                  : [
                      partwise(l, w),
                      "That multiplies the whole parts and the fraction parts separately and misses the other pieces.",
                      "这把整数部分和分数部分分开相乘，漏掉了其余几块。",
                    ],
                ...(decimal
                  ? [[a.div(Q.of(10)), "That puts the decimal point one place too far to the left.", "这把小数点向左多移了一位。"] as Off]
                  : []),
              ],
              {
                unit: `${u}^2`,
                ...(decimal && { form: "decimal" as const }),
                figure: fig(
                  [{ kind: "polygon", points: pts }, ...sides(pts, [label(l, decimal, u), label(w, decimal, u), null, null])],
                  `A rectangle ${label(l, decimal, u)} long and ${label(w, decimal, u)} wide.`,
                  `一个长 ${label(l, decimal, u)}、宽 ${label(w, decimal, u)} 的长方形。`,
                ),
              },
            );
          }
        },
        drawn(gradeDrawings3["areas-of-rectangles#fractional-and-decimal-side-lengths"]),
      ),
      lesson(
        "missing-side-length",
        ["A missing side length", "求未知边长"],
        [
          [
            "The area of a rectangle is length times width, so a missing side is the area divided by the known side. A rectangle has area $7\\frac{1}{2}\\text{ m}^2$ and length $3$ m, so its width is $7\\frac{1}{2} \\div 3 = \\frac{15}{2} \\times \\frac{1}{3} = \\frac{5}{2} = 2\\frac{1}{2}$ m.",
            "长方形的面积等于长乘宽，所以未知的边长等于面积除以已知的边长。一个长方形的面积是 $7\\frac{1}{2}\\text{ m}^2$，长是 $3$ 米，所以宽是 $7\\frac{1}{2} \\div 3 = \\frac{15}{2} \\times \\frac{1}{3} = \\frac{5}{2} = 2\\frac{1}{2}$ 米。",
          ],
          [
            "$3 \\times 2\\frac{1}{2} = 6 + 1\\frac{1}{2} = 7\\frac{1}{2}$, the area.",
            "$3 \\times 2\\frac{1}{2} = 6 + 1\\frac{1}{2} = 7\\frac{1}{2}$，正是面积。",
          ],
          [
            "Divide the area by the known side; multiplying by it gives a larger number, not the missing side.",
            "要用面积除以已知边；乘它只会得到更大的数，不是未知边。",
          ],
        ],
        (rng) => {
          for (;;) {
            const u = pickUnit(rng);
            const decimal = rng.bool();
            const l = decimal ? tenths(rng, 3, 15) : mixedNumber(rng, 2, 8);
            const w = decimal ? Q.of(rng.int(2, 9)) : rng.bool() ? Q.of(rng.int(2, 6)) : mixedNumber(rng, 1, 3);
            if (l.cmp(w) <= 0) continue;
            const a = l.mul(w);
            const givenLength = rng.bool();
            const [known, unknown] = givenLength ? [l, w] : [w, l];
            const [k, m]: [Pair, Pair] = givenLength
              ? [
                  ["length", "长"],
                  ["width", "宽"],
                ]
              : [
                  ["width", "宽"],
                  ["length", "长"],
                ];
            return valued(
              [
                `A rectangle has an area of $${measure(a, decimal, u, 2)}$ and a ${k[0]} of $${measure(known, decimal, u)}$. What is its ${m[0]}?`,
                `一个长方形的面积是 $${measure(a, decimal, u, 2)}$，${k[1]}是 $${measure(known, decimal, u)}$。它的${m[1]}是多少？`,
              ],
              unknown,
              [
                [
                  ["Use A = lw", "用 A = lw"],
                  [`The area is the ${k[0]} times the ${m[0]}:`, `面积等于${k[1]}乘${m[1]}：`],
                  [`${num(a, decimal)} = ${num(known, decimal)} \\times ?`],
                ],
                [
                  ["Divide", "相除"],
                  [`Divide the area by the ${k[0]}:`, `用面积除以${k[1]}：`],
                  [`${quotient(a, known, decimal)}\\text{ ${u}}`],
                ],
              ],
              [
                `Multiply back: $${product([known, unknown], decimal)}$, the area.`,
                `乘回去：$${product([known, unknown], decimal)}$，正是面积。`,
              ],
              [
                [a.mul(known), `That multiplies the area by the ${k[0]} instead of dividing.`, `这是用面积乘${k[1]}，而不是除。`],
                [a.sub(known), `That subtracts the ${k[0]} from the area.`, `这是用面积减去${k[1]}。`],
                [
                  a.div(Q.of(2)).sub(known),
                  "That treats the area as a perimeter: half of it minus the known side.",
                  "这把面积当成了周长：取一半再减去已知边。",
                ],
              ],
              { unit: u, ...(decimal && { form: "decimal" as const }) },
            );
          }
        },
        drawn(gradeDrawings4["areas-of-rectangles#missing-side-length"]),
      ),
    ],
  ),
  [
    "A rug is $2\\frac{1}{2}$ m long and $1\\frac{1}{2}$ m wide. To know how much floor it covers, multiply its sides just as for whole numbers.",
    "一块地毯长 $2\\frac{1}{2}$ 米，宽 $1\\frac{1}{2}$ 米。要知道它盖住多大的地面，就像整数那样把两边相乘。",
  ],
  [
    "$\\frac{5}{2} \\times \\frac{3}{2} = \\frac{15}{4} = 3\\frac{3}{4}$, between $2 \\times 1 = 2$ and $3 \\times 2 = 6$.",
    "$\\frac{5}{2} \\times \\frac{3}{2} = \\frac{15}{4} = 3\\frac{3}{4}$，在 $2 \\times 1 = 2$ 和 $3 \\times 2 = 6$ 之间。",
  ],
  [
    "find the area of a rectangle with fraction or decimal sides, and a missing side from the area.",
    "求边长是分数或小数的长方形的面积，并由面积求未知的边。",
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

export const areasOfRightTriangles = withIntro(
  topic(
    "areas-of-right-triangles",
    t("Areas of Right Triangles", "直角三角形的面积"),
    t(
      "A diagonal cuts a rectangle into two equal right triangles, so the area of a right triangle is half the product of its legs, the two sides that form the right angle: A = ½ab. A right triangle with legs 6 cm and 8 cm has area ½ × 6 × 8 = 24 cm². The longest side, the hypotenuse, is not used.",
      "长方形的一条对角线把它分成两个完全相同的直角三角形，所以直角三角形的面积是两条直角边（夹着直角的两条边）乘积的一半：A = ½ab。两条直角边为 6 厘米和 8 厘米的直角三角形，面积是 ½ × 6 × 8 = 24 平方厘米。最长的边（斜边）不参与计算。",
    ),
    ["areas-of-rectangles"],
    ["6.G.A.1"],
    [
      lesson(
        "area-from-the-legs",
        ["Area from the legs", "由直角边求面积"],
        [
          [
            "The legs are the two sides that meet at the right angle; the triangle is half of the rectangle they make. A right triangle with sides $5$ m, $12$ m and $13$ m has legs $5$ and $12$, so $A = \\frac{1}{2} \\times 5 \\times 12 = 30\\text{ m}^2$.",
            "直角边是夹着直角的两条边；三角形是它们围成的长方形的一半。三边为 $5$ 米、$12$ 米、$13$ 米的直角三角形，直角边是 $5$ 和 $12$，所以 $A = \\frac{1}{2} \\times 5 \\times 12 = 30\\text{ m}^2$。",
          ],
          [
            "The $5$ by $12$ rectangle has area $60$, and two copies of the triangle fill it: $2 \\times 30 = 60$.",
            "$5$ 乘 $12$ 的长方形面积是 $60$，两个这样的三角形正好拼满它：$2 \\times 30 = 60$。",
          ],
          ["Leave out the longest side, the hypotenuse: multiplying by $13$ is a mistake.", "不要用最长的边，也就是斜边：乘 $13$ 是错的。"],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const withHypotenuse = rng.bool(0.6);
          const [p, q, r] = rng.pick(triples);
          const k = rng.int(1, 3);
          const [a, b] = withHypotenuse ? [p * k, q * k] : [rng.int(3, 20), rng.int(3, 16)];
          const c = r * k;
          const area = Q.of(a * b, 2);
          return valued(
            ["Find the area of the right triangle.", "求这个直角三角形的面积。"],
            area,
            [
              [
                ["Find the legs", "找直角边"],
                withHypotenuse
                  ? [
                      `The sides meeting at the right angle are the legs; $${c}$ is the hypotenuse and is not used:`,
                      `夹着直角的两条边是直角边；$${c}$ 是斜边，不用：`,
                    ]
                  : ["The sides meeting at the right angle are the legs:", "夹着直角的两条边是直角边："],
                [`a = ${a}, \\ b = ${b}`],
              ],
              [
                ["Halve the product", "乘积取一半"],
                ["The triangle is half the rectangle on its legs:", "三角形是直角边围成的长方形的一半："],
                [`A = \\frac{1}{2} \\times ${a} \\times ${b} = ${result(area)}\\text{ ${u}}^2`],
              ],
            ],
            [
              `Two copies make a $${a}$ by $${b}$ rectangle of area $${a * b}$, and $2 \\times ${mixedLatex(area)} = ${a * b}$.`,
              `两个这样的三角形拼成 $${a}$ 乘 $${b}$ 的长方形，面积 $${a * b}$，$2 \\times ${mixedLatex(area)} = ${a * b}$。`,
            ],
            withHypotenuse
              ? [
                  [a * b, "That is the whole rectangle; the triangle is half of it.", "这是整个长方形；三角形只是它的一半。"],
                  [Q.of(a * c, 2), "That uses the hypotenuse, which is not a leg.", "这用了斜边，斜边不是直角边。"],
                  [Q.of(b * c, 2), "That uses the hypotenuse, which is not a leg.", "这用了斜边，斜边不是直角边。"],
                ]
              : [
                  [a * b, "That is the whole rectangle; the triangle is half of it.", "这是整个长方形；三角形只是它的一半。"],
                  [a + b, "That adds the legs instead of multiplying them.", "这是把两条直角边相加，而不是相乘。"],
                  [
                    Q.of(a + b, 2),
                    "That halves the sum of the legs instead of their product.",
                    "这是取两条直角边之和的一半，而不是乘积的一半。",
                  ],
                ],
            {
              unit: `${u}^2`,
              figure: rightTriangleFigure(a, b, [`${a} ${u}`, `${b} ${u}`, withHypotenuse ? `${c} ${u}` : null], rng.bool()),
            },
          );
        },
        drawn(gradeDrawings3["areas-of-right-triangles#area-from-the-legs"]),
      ),
      lesson(
        "missing-leg",
        ["A missing leg", "求未知的直角边"],
        [
          [
            "The area is half the product of the legs, so double the area and divide by the known leg. A right triangle with area $36\\text{ cm}^2$ and one leg $8$ cm has $\\frac{1}{2} \\times 8 \\times b = 36$, so $b = 2 \\times 36 \\div 8 = 9$ cm.",
            "面积是两条直角边乘积的一半，所以把面积乘 2，再除以已知的直角边。面积 $36\\text{ cm}^2$、一条直角边 $8$ 厘米的直角三角形，有 $\\frac{1}{2} \\times 8 \\times b = 36$，所以 $b = 2 \\times 36 \\div 8 = 9$ 厘米。",
          ],
          ["$\\frac{1}{2} \\times 8 \\times 9 = 36$, the area.", "$\\frac{1}{2} \\times 8 \\times 9 = 36$，正是面积。"],
          ["Dividing $36$ by $8$ alone forgets the half.", "只用 $36$ 除以 $8$ 就漏掉了二分之一。"],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const a = rng.int(2, 16);
          let b = rng.int(2, 16);
          if (b === a) b += 1;
          const area = Q.of(a * b, 2);
          return valued(
            [
              `A right triangle has an area of $${mixedLatex(area)}\\text{ ${u}}^2$, and one of its legs is $${a}\\text{ ${u}}$ long. How long is the other leg?`,
              `一个直角三角形的面积是 $${mixedLatex(area)}\\text{ ${u}}^2$，一条直角边长 $${a}\\text{ ${u}}$。另一条直角边有多长？`,
            ],
            b,
            [
              [
                ["Double the area", "面积乘 2"],
                ["The legs multiply to twice the area:", "两条直角边的乘积是面积的 2 倍："],
                [`2 \\times ${mixedLatex(area)} = ${a * b}`],
              ],
              [
                ["Divide by the known leg", "除以已知的直角边"],
                ["That leaves the other leg:", "得到另一条直角边："],
                [`${a * b} \\div ${a} = ${b}\\text{ ${u}}`],
              ],
            ],
            [
              `$\\frac{1}{2} \\times ${a} \\times ${b} = ${mixedLatex(area)}$, the area.`,
              `$\\frac{1}{2} \\times ${a} \\times ${b} = ${mixedLatex(area)}$，正是面积。`,
            ],
            [
              [area.div(Q.of(a)), "That divides the area by the leg and forgets the half.", "这是直接用面积除以直角边，漏掉了二分之一。"],
              [area.div(Q.of(2 * a)), "That halves the area instead of doubling it.", "这把面积除以 2，而不是乘 2。"],
              [
                area.mul(Q.of(2)),
                "That doubles the area but does not divide by the known leg.",
                "这把面积乘了 2，却没有除以已知的直角边。",
              ],
            ],
            { unit: u, form: "number", figure: rightTriangleFigure(a, b, [`${a} ${u}`, "?", null], rng.bool()) },
          );
        },
        drawn(gradeDrawings3["areas-of-right-triangles#missing-leg"]),
      ),
    ],
  ),
  [
    "A square sail is cut along a diagonal into two matching triangular sails. Each triangle has the right angle of the square and half of its cloth.",
    "一块方帆沿对角线剪成两块一样的三角帆。每块三角帆都带着正方形的一个直角，用了一半的布。",
  ],
  [
    "A square sail $4$ m on a side has $16\\text{ m}^2$ of cloth, so each triangle has $\\frac{1}{2} \\times 4 \\times 4 = 8\\text{ m}^2$.",
    "边长 $4$ 米的方帆有 $16\\text{ m}^2$ 布，所以每块三角帆是 $\\frac{1}{2} \\times 4 \\times 4 = 8\\text{ m}^2$。",
  ],
  [
    "find the area of a right triangle from its legs, and a missing leg from the area.",
    "由直角边求直角三角形的面积，并由面积求未知的直角边。",
  ],
);

export const areasOfTriangles = withIntro(
  topic(
    "areas-of-triangles",
    t("Areas of Triangles", "三角形的面积"),
    t(
      "Any side of a triangle can be its base. The height is the perpendicular distance from the opposite vertex to the line containing the base; it falls inside the triangle, or, for an obtuse triangle, outside it on the extended base. The area is A = ½bh: a triangle with base 10 m and height 7 m has area ½ × 10 × 7 = 35 m². A slanted side is not the height.",
      "三角形的任何一条边都可以作为底。高是从对顶点到底边所在直线的垂直距离；它可能在三角形内部，对于钝角三角形，也可能在外部、落在底边的延长线上。面积是 A = ½bh：底 10 米、高 7 米的三角形，面积是 ½ × 10 × 7 = 35 平方米。斜着的边不是高。",
    ),
    ["areas-of-right-triangles"],
    ["6.G.A.1"],
    [
      lesson(
        "height-inside-the-triangle",
        ["The height inside the triangle", "高在三角形内部"],
        [
          [
            "The height is the segment from the top vertex that meets the base at a right angle. A triangle with base $14$ cm, height $8$ cm and a slanted side of $10$ cm has $A = \\frac{1}{2} \\times 14 \\times 8 = 56\\text{ cm}^2$.",
            "高是从顶点出发、与底边成直角的线段。底 $14$ 厘米、高 $8$ 厘米、一条斜边 $10$ 厘米的三角形，$A = \\frac{1}{2} \\times 14 \\times 8 = 56\\text{ cm}^2$。",
          ],
          [
            "The height cuts it into two right triangles, with legs $6$ and $8$ and legs $8$ and $8$: $24 + 32 = 56$.",
            "高把它分成两个直角三角形，直角边分别是 $6$、$8$ 和 $8$、$8$：$24 + 32 = 56$。",
          ],
          [
            "The slanted side, $10$ cm, is not the height: the height meets the base at a right angle.",
            "斜边 $10$ 厘米不是高：高与底边成直角。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const [p, q, r] = rng.pick(triples);
          const k = rng.int(1, 2);
          const [o, h, s] = [p * k, q * k, r * k];
          const b = o + rng.int(2, 12);
          const apex: Point = [o, h];
          const pts: Point[] = [[0, 0], [b, 0], apex];
          const area = Q.of(b * h, 2);
          const [left, right] = [Q.of(o * h, 2), Q.of((b - o) * h, 2)];
          return valued(
            ["Find the area of the triangle.", "求这个三角形的面积。"],
            area,
            [
              [
                ["Find the base and the height", "找底和高"],
                [`The height meets the base at a right angle; the slanted side $${s}$ is not used:`, `高与底边成直角；斜边 $${s}$ 不用：`],
                [`b = ${b}, \\ h = ${h}`],
              ],
              [
                ["Halve the product", "乘积取一半"],
                ["Half of base times height:", "底乘高的一半："],
                [`A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}\\text{ ${u}}^2`],
              ],
            ],
            [
              `The height splits the triangle into right triangles with legs $${o}, ${h}$ and $${b - o}, ${h}$: $${mixedLatex(left)} + ${mixedLatex(right)} = ${mixedLatex(area)}$.`,
              `高把三角形分成直角边为 $${o}, ${h}$ 和 $${b - o}, ${h}$ 的两个直角三角形：$${mixedLatex(left)} + ${mixedLatex(right)} = ${mixedLatex(area)}$。`,
            ],
            [
              [b * h, "That is base times height without the half.", "这是底乘高，没有取一半。"],
              [Q.of(b * s, 2), "That uses the slanted side as the height.", "这把斜边当成了高。"],
              [Q.of(s * h, 2), "That uses the slanted side as the base.", "这把斜边当成了底。"],
            ],
            {
              unit: `${u}^2`,
              figure: fig(
                [
                  { kind: "polygon", points: pts },
                  ...sides(pts, [`${b} ${u}`, null, `${s} ${u}`]),
                  ...height(apex, [o, 0], [b, 0], `${h} ${u}`),
                ],
                `A triangle with base ${b} ${u}, height ${h} ${u} and a slanted side of ${s} ${u}.`,
                `一个三角形，底 ${b} ${u}，高 ${h} ${u}，一条斜边 ${s} ${u}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["areas-of-triangles#height-inside-the-triangle"]),
      ),
      lesson(
        "height-outside-the-triangle",
        ["The height outside the triangle", "高在三角形外部"],
        [
          [
            "In an obtuse triangle the height may fall outside, on the extension of the base. It is still the distance from the top vertex to the line containing the base. A triangle with base $6$ m whose height of $5$ m lands $4$ m past the end of the base has $A = \\frac{1}{2} \\times 6 \\times 5 = 15\\text{ m}^2$.",
            "在钝角三角形中，高可能落在外面，在底边的延长线上。它仍然是顶点到底边所在直线的距离。底 $6$ 米、高 $5$ 米、高的垂足在底边端点外 $4$ 米处的三角形，$A = \\frac{1}{2} \\times 6 \\times 5 = 15\\text{ m}^2$。",
          ],
          [
            "The large right triangle with legs $10$ and $5$ has area $25$; taking away the right triangle with legs $4$ and $5$, area $10$, leaves $15$.",
            "直角边为 $10$ 和 $5$ 的大直角三角形面积是 $25$；减去直角边为 $4$ 和 $5$ 的直角三角形（面积 $10$），剩下 $15$。",
          ],
          ["The extension is not part of the base: use $6$, not $6 + 4 = 10$.", "延长的部分不属于底：用 $6$，不是 $6 + 4 = 10$。"],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const b = rng.int(4, 14);
          let e = rng.int(2, 8);
          if (e === b) e += 1;
          const h = rng.int(3, 12);
          const apex: Point = [b + e, h];
          const pts: Point[] = [[0, 0], [b, 0], apex];
          const area = Q.of(b * h, 2);
          const [big, small] = [Q.of((b + e) * h, 2), Q.of(e * h, 2)];
          return valued(
            ["Find the area of the triangle.", "求这个三角形的面积。"],
            area,
            [
              [
                ["Find the base and the height", "找底和高"],
                [
                  `The base is the side of the triangle; the extension of $${e}$ is not part of it. The height is the distance to the line of the base:`,
                  `底是三角形的边；延长的 $${e}$ 不属于底。高是到底边所在直线的距离：`,
                ],
                [`b = ${b}, \\ h = ${h}`],
              ],
              [
                ["Halve the product", "乘积取一半"],
                ["Half of base times height:", "底乘高的一半："],
                [`A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}\\text{ ${u}}^2`],
              ],
            ],
            [
              `The right triangle with legs $${b + e}$ and $${h}$ has area $${mixedLatex(big)}$; taking away the one with legs $${e}$ and $${h}$, area $${mixedLatex(small)}$, leaves $${mixedLatex(area)}$.`,
              `直角边为 $${b + e}$ 和 $${h}$ 的直角三角形面积是 $${mixedLatex(big)}$；减去直角边为 $${e}$ 和 $${h}$ 的（面积 $${mixedLatex(small)}$），剩下 $${mixedLatex(area)}$。`,
            ],
            [
              [big, "That counts the extension as part of the base.", "这把延长的部分也算进了底。"],
              [b * h, "That is base times height without the half.", "这是底乘高，没有取一半。"],
              [small, "That uses the extension as the base.", "这把延长的部分当成了底。"],
            ],
            {
              unit: `${u}^2`,
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
            },
          );
        },
        drawn(gradeDrawings3["areas-of-triangles#height-outside-the-triangle"]),
      ),
    ],
  ),
  [
    "A banner is a triangle $10$ m along the top and $7$ m from the top down to its point. Whatever its slant, it covers half of a $10$ by $7$ rectangle.",
    "一面三角形横幅上边长 $10$ 米，从上边到下面的尖角有 $7$ 米。不管它怎么斜，都占 $10$ 乘 $7$ 的长方形的一半。",
  ],
  ["$\\frac{1}{2} \\times 10 \\times 7 = 35$, half of $70$.", "$\\frac{1}{2} \\times 10 \\times 7 = 35$，是 $70$ 的一半。"],
  [
    "find the area of any triangle from a base and its height, inside or outside the triangle.",
    "由底和对应的高求任意三角形的面积，高可在三角形内或外。",
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

/** sampleParallelogram is the parallelogram of the lessons: base 15 m, slanted sides 10 m, height 8 m. */
const sampleParallelogram = fig(
  [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [15, 0],
        [21, 8],
        [6, 8],
      ],
    },
    ...sides(
      [
        [0, 0],
        [15, 0],
        [21, 8],
        [6, 8],
      ],
      ["15 m", "10 m", "15 m", "10 m"],
    ),
    ...height([6, 8], [6, 0], [15, 0], "8 m"),
  ],
  "A parallelogram with base 15 m, slanted sides 10 m and height 8 m.",
  "一个平行四边形，底 15 m，斜边 10 m，高 8 m。",
);

export const areasAndPerimetersOfParallelograms = withIntro(
  topic(
    "areas-and-perimeters-of-parallelograms",
    t("Areas and Perimeters of Parallelograms", "平行四边形的面积和周长"),
    t(
      "Cutting a right triangle off one end of a parallelogram and moving it to the other end makes a rectangle, so the area of a parallelogram is base times height, A = bh, where the height is perpendicular to the base. The perimeter uses the side lengths instead: P = 2(b + s), where s is the slanted side. A parallelogram with base 12 cm, slanted side 5 cm and height 4 cm has area 48 cm² and perimeter 34 cm.",
      "把平行四边形一端的直角三角形剪下，移到另一端，就拼成一个长方形，所以平行四边形的面积是底乘高，A = bh，其中高垂直于底。周长用的是边长：P = 2(b + s)，s 是斜边。底 12 厘米、斜边 5 厘米、高 4 厘米的平行四边形，面积是 48 平方厘米，周长是 34 厘米。",
    ),
    ["areas-of-rectangles", "perimeters-of-shapes"],
    ["6.G.A.1"],
    [
      lesson(
        "area-of-a-parallelogram",
        ["Area", "面积"],
        [
          [
            "Moving the triangle cut off one end to the other end turns a parallelogram into a rectangle with the same base and height, so $A = bh$. With base $15$ m, slanted side $10$ m and height $8$ m, $A = 15 \\times 8 = 120\\text{ m}^2$.",
            "把一端剪下的三角形移到另一端，平行四边形就变成底和高都不变的长方形，所以 $A = bh$。底 $15$ 米、斜边 $10$ 米、高 $8$ 米时，$A = 15 \\times 8 = 120\\text{ m}^2$。",
          ],
          [
            "The rectangle from $0$ to $21$ along the base and $8$ tall has area $168$; the two corner triangles, each $\\frac{1}{2} \\times 6 \\times 8 = 24$, leave $168 - 48 = 120$.",
            "沿底从 $0$ 到 $21$、高 $8$ 的长方形面积是 $168$；两个角上的三角形各是 $\\frac{1}{2} \\times 6 \\times 8 = 24$，剩下 $168 - 48 = 120$。",
          ],
          [
            "The slanted side is not perpendicular to the base, so $15 \\times 10$ is not the area.",
            "斜边不垂直于底，所以 $15 \\times 10$ 不是面积。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const { b, h, s, figure } = parallelogram(rng, u);
          const o = Math.round(Math.sqrt(s * s - h * h));
          return valued(
            ["Find the area of the parallelogram.", "求这个平行四边形的面积。"],
            b * h,
            [
              [
                ["Find the base and the height", "找底和高"],
                [`The height meets the base at a right angle; the slanted side $${s}$ is not used:`, `高与底边成直角；斜边 $${s}$ 不用：`],
                [`b = ${b}, \\ h = ${h}`],
              ],
              [
                ["Multiply", "相乘"],
                ["Moving the end triangle makes a rectangle, so multiply:", "把一端的三角形移过去就成了长方形，所以相乘："],
                [`A = ${b} \\times ${h} = ${b * h}\\text{ ${u}}^2`],
              ],
            ],
            [
              `The rectangle $${b + o}$ by $${h}$ around it has area $${(b + o) * h}$; its two corner triangles, each $\\frac{1}{2} \\times ${o} \\times ${h}$, take away $${o * h}$, leaving $${b * h}$.`,
              `包住它的 $${b + o}$ 乘 $${h}$ 的长方形面积是 $${(b + o) * h}$；两个角上的三角形各是 $\\frac{1}{2} \\times ${o} \\times ${h}$，共减去 $${o * h}$，剩下 $${b * h}$。`,
            ],
            [
              [b * s, "That multiplies by the slanted side, which is not perpendicular to the base.", "这是乘斜边，而斜边不垂直于底。"],
              [
                Q.of(b * h, 2),
                "That halves the product as for a triangle; a parallelogram is two such triangles.",
                "这像三角形那样取了一半；平行四边形是两个这样的三角形。",
              ],
              [2 * (b + s), "That is the perimeter, not the area.", "这是周长，不是面积。"],
            ],
            { unit: `${u}^2`, figure },
          );
        },
        drawn(gradeDrawings3["areas-and-perimeters-of-parallelograms#area-of-a-parallelogram"]),
      ),
      lesson(
        "perimeter-of-a-parallelogram",
        ["Perimeter", "周长"],
        [
          [
            "The perimeter goes around the four sides, and opposite sides of a parallelogram are equal, so $P = 2(b + s)$. With base $15$ m, slanted side $10$ m and height $8$ m, $P = 2(15 + 10) = 50$ m.",
            "周长是绕四条边一圈的长度，平行四边形的对边相等，所以 $P = 2(b + s)$。底 $15$ 米、斜边 $10$ 米、高 $8$ 米时，$P = 2(15 + 10) = 50$ 米。",
          ],
          ["Side by side: $15 + 10 + 15 + 10 = 50$.", "一条边一条边地加：$15 + 10 + 15 + 10 = 50$。"],
          [
            "The height is inside the figure and is not a side: $2(15 + 8)$ is not the perimeter.",
            "高在图形内部，不是边：$2(15 + 8)$ 不是周长。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const { b, h, s, figure } = parallelogram(rng, u);
          return valued(
            ["Find the perimeter of the parallelogram.", "求这个平行四边形的周长。"],
            2 * (b + s),
            [
              [
                ["Name the sides", "写出各边"],
                ["Opposite sides are equal; the height is not a side:", "对边相等；高不是边："],
                [`${b}, \\ ${s}, \\ ${b}, \\ ${s}`],
              ],
              [["Add", "相加"], ["Two of each:", "每种两条："], [`P = 2(${b} + ${s}) = ${2 * (b + s)}\\text{ ${u}}`]],
            ],
            [
              `Side by side: $${b} + ${s} + ${b} + ${s} = ${2 * (b + s)}$.`,
              `一条边一条边地加：$${b} + ${s} + ${b} + ${s} = ${2 * (b + s)}$。`,
            ],
            [
              [2 * (b + h), "That uses the height as a side.", "这把高当成了边。"],
              [b + s, "That goes only halfway around.", "这只绕了半圈。"],
              [b * h, "That is the area, not the perimeter.", "这是面积，不是周长。"],
            ],
            { unit: u, figure },
          );
        },
        sampleParallelogram,
      ),
    ],
  ),
  [
    "A tile is a parallelogram: push the top of a rectangle sideways and it leans over. The floor it covers stays the same, but its slanted edges get longer.",
    "一块地砖是平行四边形：把长方形的上边往旁边一推，它就斜了。它盖住的地面不变，但斜着的边变长了。",
  ],
  [
    "A $12$ by $4$ rectangle leaned to slanted sides of $5$ still covers $12 \\times 4 = 48$, while its perimeter grows from $32$ to $2(12 + 5) = 34$.",
    "$12$ 乘 $4$ 的长方形推斜到斜边为 $5$，面积仍是 $12 \\times 4 = 48$，周长却从 $32$ 变成 $2(12 + 5) = 34$。",
  ],
  [
    "find the area of a parallelogram from its base and height, and its perimeter from its sides.",
    "由底和高求平行四边形的面积，由边长求它的周长。",
  ],
);

// ---------------------------------------------------------------------------
// Composite figures

export const findingAreasOfPolygonsUsingDecomposition = withIntro(
  topic(
    "finding-areas-of-polygons-using-decomposition",
    t("Finding Areas of Polygons Using Decomposition", "用分割法求多边形的面积"),
    t(
      "To find the area of a polygon, split it into rectangles and triangles, find the area of each part, and add. An L-shaped figure splits into two rectangles, and a house-shaped pentagon splits into a rectangle and a triangle. Missing lengths come from the given ones: the two horizontal sides on one side of an L-shape add up to the side opposite them.",
      "求多边形的面积时，把它分割成长方形和三角形，分别求出各部分的面积再相加。L 形图形可以分成两个长方形，房子形的五边形可以分成一个长方形和一个三角形。未知的长度可以由已知长度求出：L 形一侧的两条横边加起来等于对面的那条边。",
    ),
    ["areas-of-triangles", "areas-and-perimeters-of-parallelograms"],
    ["6.G.A.1"],
    [
      lesson(
        "rectilinear-figures",
        ["Figures made of rectangles", "由长方形组成的图形"],
        [
          [
            "Cut the figure into rectangles and add their areas, finding any missing length from the given ones. An L-shape $12$ m wide at the bottom and $9$ m tall on the left, with a top edge of $7$ m and a right edge of $4$ m, cuts into a $7 \\times 9 = 63\\text{ m}^2$ part and a $(12 - 7) \\times 4 = 20\\text{ m}^2$ part: $83\\text{ m}^2$ in all.",
            "把图形切成几个长方形，把面积相加，缺的长度由已知长度求出。底边宽 $12$ 米、左边高 $9$ 米、上边 $7$ 米、右边 $4$ 米的 L 形，切成 $7 \\times 9 = 63\\text{ m}^2$ 和 $(12 - 7) \\times 4 = 20\\text{ m}^2$ 两部分：共 $83\\text{ m}^2$。",
          ],
          [
            "The whole $12 \\times 9 = 108$ rectangle minus the missing corner $5 \\times 5 = 25$ also gives $83$.",
            "整个 $12 \\times 9 = 108$ 的长方形减去缺的角 $5 \\times 5 = 25$，也得 $83$。",
          ],
          [
            "Each part needs its own width and height: the right part is $12 - 7 = 5$ wide, not $12$.",
            "每部分要用它自己的宽和高：右边部分宽 $12 - 7 = 5$，不是 $12$。",
          ],
        ],
        (rng) => {
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
          return valued(
            ["Find the area of the figure. All of its angles are right angles.", "求这个图形的面积。图形的所有角都是直角。"],
            area,
            [
              [
                ["Find the missing width", "求缺的宽"],
                ["The bottom is the top plus the step:", "底边等于上边加上台阶的宽："],
                [`${W} - ${W - a} = ${a}`],
              ],
              [
                ["Add the rectangles", "把长方形相加"],
                [
                  `A vertical cut gives a $${W - a}$ by $${H}$ rectangle and an $${a}$ by $${H - b}$ rectangle:`,
                  `竖着切开，得到 $${W - a}$ 乘 $${H}$ 和 $${a}$ 乘 $${H - b}$ 两个长方形：`,
                ],
                [`A = ${(W - a) * H} + ${a * (H - b)} = ${area}\\text{ ${u}}^2`],
              ],
            ],
            [
              `The whole $${W} \\times ${H} = ${W * H}$ rectangle minus the missing corner $${a} \\times ${b} = ${a * b}$ is $${area}$.`,
              `整个 $${W} \\times ${H} = ${W * H}$ 的长方形减去缺的角 $${a} \\times ${b} = ${a * b}$，得 $${area}$。`,
            ],
            [
              [
                W * H,
                "That is the whole rectangle around the figure, with the missing corner filled in.",
                "这是包住图形的整个长方形，把缺的角也算进去了。",
              ],
              [(W - a) * H + W * (H - b), "That counts the overlap of the two parts twice.", "这把两部分重叠的地方算了两次。"],
              [(W - a) * H + a * H, "That gives the right part the full height.", "这让右边部分用了整个高。"],
            ],
            {
              unit: `${u}^2`,
              figure: fig(
                [{ kind: "polygon", points: pts }, ...sides(pts, [`${W} ${u}`, `${H - b} ${u}`, null, null, `${W - a} ${u}`, `${H} ${u}`])],
                `An L-shaped figure: bottom ${W} ${u}, left side ${H} ${u}, top ${W - a} ${u}, right side ${H - b} ${u}.`,
                `一个 L 形图形：底边 ${W} ${u}，左边 ${H} ${u}，上边 ${W - a} ${u}，右边 ${H - b} ${u}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["finding-areas-of-polygons-using-decomposition#rectilinear-figures"]),
      ),
      lesson(
        "rectangles-and-triangles",
        ["A rectangle and a triangle", "长方形加三角形"],
        [
          [
            "A house-shaped pentagon splits into a rectangle and a triangle on top. A rectangle $10$ ft wide and $6$ ft tall with a triangle $3$ ft tall on top has area $10 \\times 6 + \\frac{1}{2} \\times 10 \\times 3 = 60 + 15 = 75\\text{ ft}^2$.",
            "房子形的五边形可以分成一个长方形和上面的一个三角形。宽 $10$ 英尺、高 $6$ 英尺的长方形，上面是高 $3$ 英尺的三角形，面积是 $10 \\times 6 + \\frac{1}{2} \\times 10 \\times 3 = 60 + 15 = 75\\text{ ft}^2$。",
          ],
          [
            "The $10 \\times 9 = 90$ rectangle around the house, minus the two empty corners at the top, each $\\frac{1}{2} \\times 5 \\times 3 = 7\\frac{1}{2}$, leaves $90 - 15 = 75$.",
            "包住房子的 $10 \\times 9 = 90$ 的长方形，减去上方两个空角（各 $\\frac{1}{2} \\times 5 \\times 3 = 7\\frac{1}{2}$），剩下 $90 - 15 = 75$。",
          ],
          ["The roof is a triangle: halve its base times height.", "屋顶是三角形：底乘高要取一半。"],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const w = rng.int(6, 16);
          const h = rng.int(3, 12);
          const r = rng.int(2, 8);
          const top: Point = [w / 2, h + r];
          const pts: Point[] = [[0, 0], [w, 0], [w, h], top, [0, h]];
          const roof = Q.of(w * r, 2);
          const area = roof.add(Q.of(w * h));
          const corner = Q.of(w * r, 4);
          return valued(
            ["Find the area of the pentagon.", "求这个五边形的面积。"],
            area,
            [
              [["The rectangle", "长方形"], ["The bottom part:", "下面部分："], [`${w} \\times ${h} = ${w * h}`]],
              [
                ["Add the triangle", "加上三角形"],
                [`The roof has base $${w}$ and height $${r}$:`, `屋顶的底是 $${w}$，高是 $${r}$：`],
                [
                  `\\frac{1}{2} \\times ${w} \\times ${r} = ${mixedLatex(roof)}`,
                  `A = ${w * h} + ${mixedLatex(roof)} = ${result(area)}\\text{ ${u}}^2`,
                ],
              ],
            ],
            [
              `The $${w} \\times ${h + r} = ${w * (h + r)}$ rectangle around it, minus two empty corners of $${mixedLatex(corner)}$ each, leaves $${mixedLatex(area)}$.`,
              `包住它的 $${w} \\times ${h + r} = ${w * (h + r)}$ 的长方形，减去两个各 $${mixedLatex(corner)}$ 的空角，剩下 $${mixedLatex(area)}$。`,
            ],
            [
              [
                w * h + w * r,
                "That counts the roof as a whole rectangle instead of half of one.",
                "这把屋顶当成了整个长方形，而不是一半。",
              ],
              [Q.of(w * (h + r), 2), "That halves the whole figure, not just the roof.", "这把整个图形都取了一半，而不只是屋顶。"],
              [w * h, "That leaves out the roof.", "这漏掉了屋顶。"],
            ],
            {
              unit: `${u}^2`,
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
            },
          );
        },
        drawn(gradeDrawings3["finding-areas-of-polygons-using-decomposition#rectangles-and-triangles"]),
      ),
    ],
  ),
  [
    "A floor plan of a room has an L shape. No single formula fits it, but one cut turns it into two rectangles whose areas are easy to find.",
    "一间屋子的平面图是 L 形。没有一个公式能直接算它，但切一刀就成了两个长方形，面积很好求。",
  ],
  [
    "Cutting the other way gives two different rectangles, but their areas add up to the same total.",
    "换一个方向切，得到的是另外两个长方形，但面积之和不变。",
  ],
  ["split a polygon into rectangles and triangles and add their areas.", "把多边形分成长方形和三角形，再把面积相加。"],
);

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

export const findingAreasBetweenShapes = withIntro(
  topic(
    "finding-areas-between-shapes",
    t("Finding Areas Between Shapes", "求图形之间的面积"),
    t(
      "The area of the region between two shapes is the area of the outer shape minus the area of the inner shape. A 10 m by 8 m garden with a 4 m by 3 m shed in it has 10 × 8 − 4 × 3 = 80 − 12 = 68 m² of open ground.",
      "两个图形之间区域的面积，等于外面图形的面积减去里面图形的面积。一块 10 米乘 8 米的花园里有一间 4 米乘 3 米的小屋，空地面积是 10 × 8 − 4 × 3 = 80 − 12 = 68 平方米。",
    ),
    ["finding-areas-of-polygons-using-decomposition"],
    ["6.G.A.1"],
    [
      lesson(
        "a-rectangle-inside-a-rectangle",
        ["A rectangle inside a rectangle", "长方形里的长方形"],
        [
          [
            "The region between two rectangles is what is left of the outer one once the inner one is taken away, so its area is the outer area minus the inner area; where the inner rectangle sits does not matter. A $9$ in by $12$ in photo on a $13$ in by $16$ in board leaves $13 \\times 16 - 9 \\times 12 = 208 - 108 = 100\\text{ in}^2$ uncovered.",
            "两个长方形之间的区域，是外面的长方形去掉里面的长方形后剩下的部分，所以它的面积等于外面的面积减去里面的面积；里面的长方形放在哪里都没关系。$9$ 英寸乘 $12$ 英寸的照片贴在 $13$ 英寸乘 $16$ 英寸的板上，露出 $13 \\times 16 - 9 \\times 12 = 208 - 108 = 100\\text{ in}^2$。",
          ],
          [
            "With the photo $2$ in from the left and bottom edges, the board left uncovered is a strip $16 \\times 2 = 32$ below, a strip $16 \\times 2 = 32$ above, and two side pieces $9 \\times 2 = 18$: $32 + 32 + 18 + 18 = 100$.",
            "照片离左边和下边各 $2$ 英寸时，露出的部分是下面一条 $16 \\times 2 = 32$、上面一条 $16 \\times 2 = 32$，以及两侧各 $9 \\times 2 = 18$：$32 + 32 + 18 + 18 = 100$。",
          ],
          ["Subtract the inner area; adding it counts the covered part as well.", "要减去里面的面积；加上它就把被盖住的部分也算进去了。"],
        ],
        (rng) => {
          const L = rng.int(10, 24);
          const W = rng.int(8, Math.min(L, 18));
          const l = rng.int(4, L - 4);
          const w = rng.int(3, W - 4);
          const u = rng.pick(["m", "ft"] as const);
          const stories: readonly [Pair, Pair][] = [
            [
              [
                `A rectangular garden is $${L}$ ${u} by $${W}$ ${u}. A shed $${l}$ ${u} by $${w}$ ${u} stands in it.`,
                `一块长方形花园长 $${L}$ ${u}、宽 $${W}$ ${u}，里面有一间长 $${l}$ ${u}、宽 $${w}$ ${u} 的小屋。`,
              ],
              ["What area of the garden is not covered by the shed?", "花园里没有被小屋占用的面积是多少？"],
            ],
            [
              [
                `A rectangular room is $${L}$ ${u} by $${W}$ ${u}. A rug $${l}$ ${u} by $${w}$ ${u} lies on the floor.`,
                `一个长方形房间长 $${L}$ ${u}、宽 $${W}$ ${u}，地板上铺着一块长 $${l}$ ${u}、宽 $${w}$ ${u} 的地毯。`,
              ],
              ["What area of the floor is not covered by the rug?", "地板上没有被地毯盖住的面积是多少？"],
            ],
            [
              [
                `A rectangular lawn is $${L}$ ${u} by $${W}$ ${u}. A pool $${l}$ ${u} by $${w}$ ${u} is built in it.`,
                `一块长方形草坪长 $${L}$ ${u}、宽 $${W}$ ${u}，里面修了一个长 $${l}$ ${u}、宽 $${w}$ ${u} 的水池。`,
              ],
              ["What area of grass is left around the pool?", "水池周围剩下的草坪面积是多少？"],
            ],
          ];
          const [scene, ask] = rng.pick(stories);
          const [x, y] = [rng.int(2, L - l - 2), rng.int(2, W - w - 2)];
          const area = L * W - l * w;
          const [below, above, sides2] = [L * y, L * (W - w - y), w * (L - l)];
          return valued(
            [`${scene[0]} ${ask[0]}`, `${scene[1]}${ask[1]}`],
            area,
            [
              [
                ["The two areas", "两个面积"],
                ["Outer and inner rectangles:", "外面和里面的长方形："],
                [`${L} \\times ${W} = ${L * W}, \\ ${l} \\times ${w} = ${l * w}`],
              ],
              [
                ["Subtract", "相减"],
                ["Take the inner area away from the outer:", "从外面的面积中去掉里面的面积："],
                [`${L * W} - ${l * w} = ${area}\\text{ ${u}}^2`],
              ],
            ],
            [
              `As in the picture, the region is a strip $${L} \\times ${y} = ${below}$ below, a strip $${L} \\times ${W - w - y} = ${above}$ above and side pieces $${w} \\times ${L - l} = ${sides2}$ in all: $${below} + ${above} + ${sides2} = ${area}$.`,
              `如图，这个区域是下面一条 $${L} \\times ${y} = ${below}$、上面一条 $${L} \\times ${W - w - y} = ${above}$，以及两侧共 $${w} \\times ${L - l} = ${sides2}$：$${below} + ${above} + ${sides2} = ${area}$。`,
            ],
            [
              [L * W + l * w, "That adds the inner area instead of subtracting it.", "这是加上里面的面积，而不是减去。"],
              [L * W, "That is the whole outer rectangle, with nothing taken away.", "这是整个外面的长方形，什么也没去掉。"],
              [
                (L - l) * (W - w),
                "That multiplies the differences of the sides, which is not the area left.",
                "这是把边长之差相乘，不是剩下的面积。",
              ],
            ],
            { unit: `${u}^2`, figure: betweenFigure(L, W, l, w, [x, y], u) },
          );
        },
        betweenFigure(16, 13, 12, 9, [2, 2], "in"),
      ),
      lesson(
        "a-triangle-inside-a-rectangle",
        ["A triangle inside a rectangle", "长方形里的三角形"],
        [
          [
            "The inner shape need not be a rectangle: subtract whatever area formula fits it. A triangle on the bottom side of a $12$ cm by $8$ cm rectangle with height $5$ cm leaves $12 \\times 8 - \\frac{1}{2} \\times 12 \\times 5 = 96 - 30 = 66\\text{ cm}^2$ outside it.",
            "里面的图形不一定是长方形：用适合它的面积公式减去即可。$12$ 厘米乘 $8$ 厘米的长方形里，以下边为底、高 $5$ 厘米的三角形，外面剩下 $12 \\times 8 - \\frac{1}{2} \\times 12 \\times 5 = 96 - 30 = 66\\text{ cm}^2$。",
          ],
          [
            "The strip above the triangle's top, $12 \\times 3 = 36$, plus the two side pieces below it, which make up the other half of $12 \\times 5$, $30$: $36 + 30 = 66$.",
            "三角形顶点以上的长条是 $12 \\times 3 = 36$，下面两侧的部分合起来是 $12 \\times 5$ 的另一半 $30$：$36 + 30 = 66$。",
          ],
          [
            "The triangle is half of base times height: subtracting $12 \\times 5$ takes away twice too much.",
            "三角形是底乘高的一半：减去 $12 \\times 5$ 就多减了一倍。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const L = rng.int(6, 18);
          const W = rng.int(5, 14);
          const h = rng.int(2, W - 1);
          const apex: Point = [rng.int(1, L - 1), h];
          const tri = Q.of(L * h, 2);
          const area = Q.of(L * W).sub(tri);
          return valued(
            [
              "The triangle's base is the bottom side of the rectangle. Find the area of the part of the rectangle outside the triangle.",
              "三角形的底是长方形的下边。求长方形在三角形外面部分的面积。",
            ],
            area,
            [
              [
                ["The two areas", "两个面积"],
                [`Rectangle, and triangle with base $${L}$ and height $${h}$:`, `长方形，以及底 $${L}$、高 $${h}$ 的三角形：`],
                [`${L} \\times ${W} = ${L * W}, \\ \\frac{1}{2} \\times ${L} \\times ${h} = ${mixedLatex(tri)}`],
              ],
              [
                ["Subtract", "相减"],
                ["Take the triangle away:", "去掉三角形："],
                [`${L * W} - ${mixedLatex(tri)} = ${result(area)}\\text{ ${u}}^2`],
              ],
            ],
            [
              `The strip above the triangle's top, $${L} \\times ${W - h} = ${L * (W - h)}$, plus the two side pieces below, the other half of $${L} \\times ${h}$, $${mixedLatex(tri)}$: $${L * (W - h)} + ${mixedLatex(tri)} = ${mixedLatex(area)}$.`,
              `三角形顶点以上的长条是 $${L} \\times ${W - h} = ${L * (W - h)}$，下面两侧合起来是 $${L} \\times ${h}$ 的另一半 $${mixedLatex(tri)}$：$${L * (W - h)} + ${mixedLatex(tri)} = ${mixedLatex(area)}$。`,
            ],
            [
              [L * W - L * h, "That subtracts base times height without the half.", "这减去的是底乘高，没有取一半。"],
              [tri, "That is the triangle itself, not the part outside it.", "这是三角形本身，不是它外面的部分。"],
              [Q.of(L * W).add(tri), "That adds the triangle instead of subtracting it.", "这是加上三角形，而不是减去。"],
            ],
            { unit: `${u}^2`, figure: triangleBetweenFigure(L, W, apex, u) },
          );
        },
        triangleBetweenFigure(12, 8, [7, 5], "cm"),
      ),
      lesson(
        "a-missing-length-from-the-area-between",
        ["A missing length from the area between", "由之间的面积求未知长度"],
        [
          [
            "When the area between is known, undo the subtraction: the inner area is the outer area minus the area between, and the missing length comes from the inner area. A square cut out of a $9$ cm by $7$ cm card leaves $47\\text{ cm}^2$, so the square has area $63 - 47 = 16\\text{ cm}^2$ and side $4$ cm, since $4 \\times 4 = 16$.",
            "已知之间的面积时，把减法倒过来：里面的面积等于外面的面积减去之间的面积，再由里面的面积求出未知长度。从 $9$ 厘米乘 $7$ 厘米的卡片上剪去一个正方形，剩下 $47\\text{ cm}^2$，所以正方形面积是 $63 - 47 = 16\\text{ cm}^2$，边长 $4$ 厘米，因为 $4 \\times 4 = 16$。",
          ],
          ["$63 - 4 \\times 4 = 47$, the area left.", "$63 - 4 \\times 4 = 47$，正是剩下的面积。"],
          ["$16$ is the square's area, not its side: one more step finds the side.", "$16$ 是正方形的面积，不是边长：还要再求一步。"],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const L = rng.int(9, 18);
          const W = rng.int(7, Math.min(L, 14));
          if (rng.bool()) {
            const side = rng.int(2, W - 3);
            const between = L * W - side * side;
            return valued(
              [
                `A square is cut out of a $${L}$ ${u} by $${W}$ ${u} rectangle, leaving the shaded region with an area of $${between}\\text{ ${u}}^2$. What is the side length of the square?`,
                `从一个长 $${L}$ ${u}、宽 $${W}$ ${u} 的长方形中剪去一个正方形，剩下的阴影部分面积为 $${between}\\text{ ${u}}^2$。正方形的边长是多少？`,
              ],
              side,
              [
                [
                  ["The square's area", "正方形的面积"],
                  ["Outer area minus the shaded area:", "外面的面积减去阴影的面积："],
                  [`${L * W} - ${between} = ${side * side}`],
                ],
                [
                  ["Its side", "边长"],
                  ["Which number times itself gives it?", "哪个数乘它自己得到这个数？"],
                  [`${side} \\times ${side} = ${side * side}`],
                ],
              ],
              [
                `$${L} \\times ${W} - ${side} \\times ${side} = ${L * W} - ${side * side} = ${between}$, the shaded area.`,
                `$${L} \\times ${W} - ${side} \\times ${side} = ${L * W} - ${side * side} = ${between}$，正是阴影的面积。`,
              ],
              [
                [side * side, "That is the square's area, not its side.", "这是正方形的面积，不是边长。"],
                [
                  Q.of(side * side, 2),
                  "That halves the area; the side times itself gives the area.",
                  "这是面积的一半；边长乘它自己才是面积。",
                ],
                [Q.of(side * side, 4), "That divides the area by $4$ as for a perimeter.", "这像求周长那样把面积除以 $4$。"],
              ],
              {
                unit: u,
                form: "number",
                figure: betweenFigure(L, W, side, side, [rng.int(1, L - side - 1), rng.int(1, W - side - 1)], u, true),
              },
            );
          }
          const w = rng.int(2, W - 3);
          const l = rng.int(w, L - 3);
          const between = L * W - l * w;
          return valued(
            [
              `A rectangle $${w}$ ${u} wide is cut out of a $${L}$ ${u} by $${W}$ ${u} rectangle, leaving the shaded region with an area of $${between}\\text{ ${u}}^2$. How long is the rectangle that was cut out?`,
              `从一个长 $${L}$ ${u}、宽 $${W}$ ${u} 的长方形中剪去一个宽 $${w}$ ${u} 的长方形，剩下的阴影部分面积为 $${between}\\text{ ${u}}^2$。剪去的长方形有多长？`,
            ],
            l,
            [
              [
                ["The cut-out area", "剪去的面积"],
                ["Outer area minus the shaded area:", "外面的面积减去阴影的面积："],
                [`${L * W} - ${between} = ${l * w}`],
              ],
              [["Its length", "它的长"], ["Divide by the width:", "除以宽："], [`${l * w} \\div ${w} = ${l}`]],
            ],
            [
              `$${L} \\times ${W} - ${l} \\times ${w} = ${L * W} - ${l * w} = ${between}$, the shaded area.`,
              `$${L} \\times ${W} - ${l} \\times ${w} = ${L * W} - ${l * w} = ${between}$，正是阴影的面积。`,
            ],
            [
              [l * w, "That is the cut-out area, not its length.", "这是剪去的面积，不是它的长。"],
              [
                Q.of(between, w),
                "That divides the shaded area by the width instead of the cut-out area.",
                "这是用阴影面积除以宽，而不是用剪去的面积。",
              ],
              [L - w, "That subtracts lengths; the areas are what is known.", "这是把长度相减；已知的是面积。"],
            ],
            { unit: u, form: "number", figure: betweenFigure(L, W, l, w, [rng.int(1, L - l - 1), rng.int(1, W - w - 1)], u, true) },
          );
        },
        betweenFigure(9, 7, 4, 4, [2, 2], "cm", true),
      ),
    ],
  ),
  [
    "A picture frame is a large rectangle with a rectangular hole for the picture. The wood in the frame is everything in the large rectangle except the hole.",
    "相框是一个大长方形，中间有一个放照片的长方形洞。相框的木头就是大长方形里除去洞以外的部分。",
  ],
  [
    "A $10$ by $8$ frame around a $6$ by $4$ hole has $80 - 24 = 56$ square units of wood.",
    "$10$ 乘 $8$ 的相框，中间洞是 $6$ 乘 $4$，木头有 $80 - 24 = 56$ 平方单位。",
  ],
  ["find the area between two shapes by subtracting, and work back to a missing length.", "用减法求两个图形之间的面积，并倒推出未知长度。"],
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

/** Shape is a polygon drawn for a symmetry question, with its number of lines of symmetry, how the folds go, a check another way, and typical wrong counts with their reasons. */
interface Shape {
  readonly name: Text;
  readonly points: Point[];
  readonly lines: number;
  readonly why: Text;
  readonly check: Pair;
  readonly wrong: readonly Off[];
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
  const nName = { 5: t("regular pentagon", "正五边形"), 6: t("regular hexagon", "正六边形"), 8: t("regular octagon", "正八边形") }[
    n
  ] as Text;
  const o = rng.int(3, Math.min(6, Math.floor((l - 2) / 2)));
  const [p, q] = [rng.int(3, 5), rng.int(7, 10)];
  return [
    {
      name: t("rectangle", "长方形"),
      points: rectangle(l, w),
      lines: 2,
      why: t(
        "A rectangle folds onto itself along the line through the midpoints of its long sides and along the line through the midpoints of its short sides. A diagonal is not a line of symmetry: folding along it does not match the corners.",
        "长方形沿两条长边中点的连线、以及两条短边中点的连线对折，两边都能完全重合。对角线不是对称轴：沿对角线对折，角对不上。",
      ),
      check: [
        "Each of the $2$ lines swaps two pairs of corners; no other fold keeps the long sides on long sides.",
        "这 $2$ 条线各自交换两对角；其他折法都不能让长边落在长边上。",
      ],
      wrong: [
        [4, "That counts the diagonals too, but they work only for a square.", "这把对角线也算上了，但对角线只对正方形才是对称轴。"],
        [1, "That misses one fold: a rectangle folds both across and lengthwise.", "这漏了一种折法：长方形横着、竖着都能对折。"],
      ],
    },
    {
      name: t("square", "正方形"),
      points: rectangle(10, 10),
      lines: 4,
      why: t(
        "A square has 4 lines of symmetry: the 2 lines through the midpoints of opposite sides and the 2 diagonals.",
        "正方形有 4 条对称轴：两条对边中点的连线和两条对角线。",
      ),
      check: ["A square is a regular polygon with $4$ sides, so it has $4$ lines.", "正方形是 $4$ 条边的正多边形，所以有 $4$ 条对称轴。"],
      wrong: [
        [2, "That leaves out the diagonals, which also work for a square.", "这漏掉了对角线，对正方形来说它们也是对称轴。"],
        [8, "That counts each line twice, once from each end.", "这把每条线从两端各数了一次。"],
      ],
    },
    {
      name: t("equilateral triangle", "等边三角形"),
      points: regular(3),
      lines: 3,
      why: t(
        "Each line from a vertex to the midpoint of the opposite side is a line of symmetry, so an equilateral triangle has 3.",
        "从每个顶点到对边中点的直线都是对称轴，所以等边三角形有 3 条。",
      ),
      check: ["It is a regular polygon with $3$ sides, so it has $3$ lines.", "它是 $3$ 条边的正多边形，所以有 $3$ 条对称轴。"],
      wrong: [
        [
          1,
          "That is the count for an isosceles triangle; here every vertex gives a line.",
          "这是等腰三角形的条数；这里每个顶点都对应一条。",
        ],
        [6, "That counts each line twice, at the vertex and at the midpoint.", "这把每条线在顶点和中点各数了一次。"],
      ],
    },
    {
      name: t("isosceles triangle", "等腰三角形"),
      points: [
        [0, 0],
        [b, 0],
        [b / 2, h],
      ],
      lines: 1,
      why: t(
        "Only the line from the vertex between the two equal sides to the midpoint of the base is a line of symmetry, so it has 1.",
        "只有从两腰的公共顶点到底边中点的直线是对称轴，所以它有 1 条。",
      ),
      check: [
        "Folding through any other vertex would need the base to equal a leg, and it does not.",
        "过其他顶点对折，需要底和腰相等，而它们不相等。",
      ],
      wrong: [
        [0, "The fold through the top vertex does match the two equal sides.", "过顶点的那条折线确实能让两腰重合。"],
        [3, "That is the count for an equilateral triangle; here only two sides are equal.", "这是等边三角形的条数；这里只有两条边相等。"],
      ],
    },
    {
      name: t("scalene triangle", "不等边三角形"),
      points: [
        [0, 0],
        [b + 4, 0],
        [2, h],
      ],
      lines: 0,
      why: t(
        "Its three sides all have different lengths, so no fold makes one half match the other: it has 0 lines of symmetry.",
        "它的三条边长度都不相等，沿任何直线对折都不能重合：它没有对称轴，即 0 条。",
      ),
      check: [
        "A fold that matched would have to lay one side onto another of the same length, and no two sides are equal.",
        "能重合的折法必须把一条边叠到等长的另一条边上，而没有两条边相等。",
      ],
      wrong: [
        [
          1,
          "A line through a vertex would need two equal sides beside it, and none are equal.",
          "过顶点的线需要两旁的边相等，可是没有相等的边。",
        ],
        [3, "That counts one line for each vertex, but none of them fold evenly.", "这是每个顶点数一条，但没有一条能对折重合。"],
      ],
    },
    {
      name: nName,
      points: regular(n),
      lines: n,
      why: t(
        `A regular polygon with $${n}$ sides has $${n}$ lines of symmetry: ${n % 2 === 0 ? `$${n / 2}$ through opposite vertices and $${n / 2}$ through the midpoints of opposite sides` : "one through each vertex and the midpoint of the opposite side"}.`,
        `正 $${n}$ 边形有 $${n}$ 条对称轴：${n % 2 === 0 ? `$${n / 2}$ 条经过相对的顶点，$${n / 2}$ 条经过相对边的中点` : "每条都经过一个顶点和它对边的中点"}。`,
      ),
      check: [
        `Each line goes through $2$ of the $${2 * n}$ vertices and side midpoints, so there are $${2 * n} \\div 2 = ${n}$.`,
        `每条线经过 $${2 * n}$ 个顶点和边中点中的 $2$ 个，所以共有 $${2 * n} \\div 2 = ${n}$ 条。`,
      ],
      wrong: [
        [
          Math.floor(n / 2),
          "That counts only the lines through vertices, or only those through midpoints.",
          "这只数了过顶点的线，或者只数了过中点的线。",
        ],
        [2 * n, "That counts each line twice, once from each end.", "这把每条线从两端各数了一次。"],
      ],
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
      why: t(
        "A rhombus that is not a square folds onto itself along each of its 2 diagonals, but not along the lines through the midpoints of opposite sides.",
        "不是正方形的菱形沿两条对角线对折都能重合，沿对边中点的连线对折则不能。",
      ),
      check: [
        "Each diagonal joins two equal angles, and the sides on either side of it are equal, so both folds match.",
        "每条对角线连接两个相等的角，两侧的边也相等，所以两种折法都能重合。",
      ],
      wrong: [
        [4, "That adds the lines through midpoints, which work only for a square.", "这加上了过中点的线，那只对正方形成立。"],
        [0, "Folding along a diagonal does match the two halves.", "沿对角线对折确实能让两半重合。"],
      ],
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
      why: t(
        "Folding this parallelogram along a diagonal or along a line through the midpoints of opposite sides never matches the slanted sides, so it has 0 lines of symmetry.",
        "这个平行四边形沿对角线或对边中点的连线对折，斜边都对不上，所以它没有对称轴，即 0 条。",
      ),
      check: [
        "It has no right angles and its sides are not all equal, so it is neither a rectangle nor a rhombus, the two kinds with lines.",
        "它没有直角，边也不全相等，所以既不是长方形也不是菱形，而有对称轴的正是这两类。",
      ],
      wrong: [
        [
          2,
          "Those are a rectangle's lines; on a slanted parallelogram the folds do not match.",
          "这是长方形的对称轴；斜的平行四边形这样折对不上。",
        ],
        [
          4,
          "That counts the diagonals and the middle lines, but none of them fold evenly here.",
          "这数了对角线和中线，但这里没有一条能对折重合。",
        ],
      ],
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
      why: t(
        "Only the line through the midpoints of the two parallel sides is a line of symmetry, so it has 1.",
        "只有两条平行边中点的连线是对称轴，所以它有 1 条。",
      ),
      check: [
        "A fold the other way would lay the long parallel side onto the short one, which cannot match.",
        "换个方向折，会把长的平行边叠到短的上面，不可能重合。",
      ],
      wrong: [
        [
          2,
          "Folding top onto bottom would match the two parallel sides, but they have different lengths.",
          "上下对折要让两条平行边重合，但它们长度不同。",
        ],
        [0, "The fold through the midpoints of the parallel sides does match the equal legs.", "过两条平行边中点的折线确实能让两腰重合。"],
      ],
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
      why: t(
        "Only the diagonal through the vertices between equal sides is a line of symmetry, so it has 1.",
        "只有经过两组相等邻边夹角顶点的那条对角线是对称轴，所以它有 1 条。",
      ),
      check: [
        "The other diagonal would fold a long side onto a short side, which cannot match.",
        "另一条对角线会把长边叠到短边上，不可能重合。",
      ],
      wrong: [
        [2, "Only one diagonal works: the other folds a long side onto a short one.", "只有一条对角线可以：另一条会把长边叠到短边上。"],
        [0, "The long diagonal does fold the kite onto itself.", "长的那条对角线确实能让筝形对折重合。"],
      ],
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

export const linesOfSymmetry = withIntro(
  topic(
    "lines-of-symmetry",
    t("Lines of Symmetry", "对称轴"),
    t(
      "A line of symmetry divides a figure into two halves that match exactly when the figure is folded along the line. A rectangle has 2 lines of symmetry, a square has 4, an isosceles triangle has 1, and a regular polygon with n sides has n. The diagonal of a rectangle that is not a square is not a line of symmetry.",
      "对称轴把图形分成两半，沿这条线对折时，两半能完全重合。长方形有 2 条对称轴，正方形有 4 条，等腰三角形有 1 条，正 n 边形有 n 条。不是正方形的长方形，对角线不是对称轴。",
    ),
    ["classifying-quadrilaterals"],
    ["4.G.A.3"],
    [
      lesson(
        "counting-lines-of-symmetry",
        ["Counting lines of symmetry", "数对称轴"],
        [
          [
            "Imagine folding the figure along each possible line and count the folds where the halves match. A rectangle folds onto itself along its $2$ middle lines but not along a diagonal, so it has $2$ lines of symmetry. A regular hexagon has $6$: $3$ through opposite vertices and $3$ through the midpoints of opposite sides.",
            "想象沿每条可能的线把图形对折，数出两半能重合的折法。长方形沿两条中线对折能重合，沿对角线则不能，所以它有 $2$ 条对称轴。正六边形有 $6$ 条：$3$ 条经过相对的顶点，$3$ 条经过相对边的中点。",
          ],
          [
            "A regular hexagon has $6$ sides, and a regular polygon has as many lines of symmetry as sides.",
            "正六边形有 $6$ 条边，而正多边形的对称轴条数等于边数。",
          ],
          [
            "A line that cuts a figure into two equal areas is not always a line of symmetry: the halves must match when folded.",
            "把图形分成面积相等两部分的线不一定是对称轴：两半对折后必须重合。",
          ],
        ],
        (rng) => {
          const s = rng.pick(shapes(rng));
          const pts = rotate(center(s.points), rng.int(0, 11) * 15);
          return valued(
            [`How many lines of symmetry does this ${s.name.en} have?`, `这个${s.name["zh-CN"]}有几条对称轴？`],
            s.lines,
            [
              [
                ["Try the folds", "试着对折"],
                [s.why.en, s.why["zh-CN"]],
              ],
              [["Count", "数一数"], ["The folds where the halves match:", "两半能重合的折法："], [`${s.lines}`]],
            ],
            s.check,
            s.wrong,
            { form: "integer", figure: fig([{ kind: "polygon", points: pts }], `A ${s.name.en}.`, `一个${s.name["zh-CN"]}。`) },
          );
        },
        drawn(gradeDrawings3["lines-of-symmetry#counting-lines-of-symmetry"]),
      ),
      lesson(
        "testing-a-line-of-symmetry",
        ["Testing a line", "判断一条直线是不是对称轴"],
        [
          [
            "To test a line, imagine folding along it: it is a line of symmetry only if every corner lands on a corner. The diagonal of a long rectangle is not, because a fold along it carries a corner outside the rectangle.",
            "判断一条直线时，想象沿它对折：只有每个角都落在另一个角上，它才是对称轴。细长长方形的对角线不是对称轴，因为沿它对折，角会落到长方形外面。",
          ],
          [
            "On a line of symmetry, each corner and the corner it lands on are the same distance from the line, on opposite sides; a long rectangle's diagonal fails this for the two corners off it.",
            "对称轴两侧，每个角和它落到的角到这条线的距离相等；细长长方形的对角线对不在它上面的两个角不满足这一点。",
          ],
          [
            "Cutting a figure into two pieces of equal area is not enough: the pieces must match when folded.",
            "把图形分成面积相等的两块还不够：两块对折后必须重合。",
          ],
        ],
        (rng) => {
          const f = rng.pick(folds(rng));
          const deg = rng.int(0, 11) * 15;
          const all = rotate(center([...f.points, ...f.line]), deg);
          const pts = all.slice(0, f.points.length);
          const line = stretch([all[f.points.length] as Point, all[f.points.length + 1] as Point]);
          return decided(
            rng,
            [`Is the dashed line a line of symmetry of this ${f.name.en}?`, `虚线是这个${f.name["zh-CN"]}的对称轴吗？`],
            f.yes,
            [
              [
                ["Fold along the line", "沿线对折"],
                [f.why.en, f.why["zh-CN"]],
              ],
              [
                ["Decide", "判断"],
                f.yes
                  ? ["Every corner lands on a corner, so it is a line of symmetry.", "每个角都落在另一个角上，所以它是对称轴。"]
                  : [
                      "A corner lands where there is no corner, so it is not a line of symmetry.",
                      "有的角落到了没有角的地方，所以它不是对称轴。",
                    ],
              ],
            ],
            f.yes
              ? [
                  "Each corner and the corner it lands on are the same distance from the line, on opposite sides.",
                  "每个角和它落到的角到这条线的距离相等，分在两侧。",
                ]
              : ["Some corner has no corner the same distance from the line on the other side.", "有的角在线的另一侧找不到距离相等的角。"],
            f.yes
              ? [
                  "Folding along it does land every corner on a corner, so it is a line of symmetry.",
                  "沿它对折，每个角确实都落在另一个角上，所以它是对称轴。",
                ]
              : [
                  "Two pieces of equal area are not enough: folded along the line, they do not match.",
                  "两块面积相等还不够：沿这条线对折，它们并不重合。",
                ],
            fig(
              [
                { kind: "polygon", points: pts },
                { kind: "segment", a: line[0], b: line[1], dashed: true, accent: true },
              ],
              `${/^[aeiou]/.test(f.name.en) ? "An" : "A"} ${f.name.en} with a dashed line drawn across it.`,
              `一个${f.name["zh-CN"]}，上面画了一条虚线。`,
            ),
          );
        },
        drawn(gradeDrawings3["lines-of-symmetry#testing-a-line-of-symmetry"]),
      ),
    ],
  ),
  [
    "A butterfly's wings match when it folds them together: the fold down its body is a line of symmetry. Many shapes have such folds, some have several, and some have none.",
    "蝴蝶把翅膀合起来时两边正好重合：沿身体的那条折线就是对称轴。很多图形都有这样的折线，有的有好几条，有的一条也没有。",
  ],
  ["A square folds evenly $4$ ways, a rectangle only $2$ ways.", "正方形有 $4$ 种对折能重合，长方形只有 $2$ 种。"],
  ["count the lines of symmetry of a figure and test whether a line is one.", "数出图形的对称轴，并判断一条线是不是对称轴。"],
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

/** volumeWalk writes the work of multiplying three edges: mixed numbers as improper fractions first, then the product. */
function volumeWalk(edgesOf: readonly Q[], u: Unit): Walk[] {
  const v = edgesOf.reduce((a, b) => a.mul(b), Q.one);
  const written = edgesOf.filter((q) => !q.isInteger() && q.cmp(Q.one) > 0).map((q) => `${mixedLatex(q)} = ${q.toLatex()}`);
  return [
    [
      ["Write the edges as fractions", "把棱长化成分数"],
      written.length > 0
        ? ["Mixed numbers become improper fractions:", "带分数化成假分数："]
        : ["The edges are already fractions or whole numbers:", "棱长已经是分数或整数："],
      written.length > 0 ? written : [edgesOf.map((q) => q.toLatex()).join(", \\ ")],
    ],
    [
      ["Multiply", "相乘"],
      ["Length times width times height:", "长乘宽乘高："],
      [`V = ${edgesOf.map((q) => q.toLatex()).join(" \\times ")} = ${result(v)}\\text{ ${u}}^3`],
    ],
  ];
}

/** reorderCheck multiplies three edges in another order: height and width first, then the length. */
function reorderCheck(l: Q, w: Q, h: Q): Pair {
  const hw = h.mul(w);
  const line = `${mixedLatex(h)} \\times ${mixedLatex(w)} = ${mixedLatex(hw)}, \\ ${mixedLatex(hw)} \\times ${mixedLatex(l)} = ${mixedLatex(hw.mul(l))}`;
  return [`In another order: $${line}$.`, `换个顺序乘：$${line}$。`];
}

export const volumesOfRectangularPrismsWithFractionalEdgeLengths = withIntro(
  topic(
    "volumes-of-rectangular-prisms-with-fractional-edge-lengths",
    t("Volumes of Rectangular Prisms With Fractional Edge Lengths", "棱长是分数的长方体的体积"),
    t(
      "The volume of a rectangular prism is V = lwh, also when the edge lengths are fractions. A box 2½ ft by 1½ ft by 2 ft has volume 5/2 × 3/2 × 2 = 15/2 = 7½ ft³. This is the same as packing the box with small cubes: a cube with ½ ft edges has volume ⅛ ft³, and 5 × 3 × 4 = 60 of them fill the box, giving 60 × ⅛ = 7½ ft³.",
      "长方体的体积是 V = lwh，棱长是分数时也一样。长 2½ 英尺、宽 1½ 英尺、高 2 英尺的箱子，体积是 5/2 × 3/2 × 2 = 15/2 = 7½ 立方英尺。这和用小正方体填满箱子的结果相同：棱长 ½ 英尺的正方体体积是 ⅛ 立方英尺，箱子里能放 5 × 3 × 4 = 60 个，体积是 60 × ⅛ = 7½ 立方英尺。",
    ),
    ["volumes-of-right-rectangular-prisms", "multiplying-mixed-numbers"],
    ["6.G.A.2"],
    [
      lesson(
        "multiplying-the-edge-lengths",
        ["Multiplying the edge lengths", "棱长相乘"],
        [
          [
            "The volume of a box is length times width times height, also with fractional edges: write mixed numbers as improper fractions and multiply. A box $3\\frac{1}{2}$ in by $2$ in by $1\\frac{1}{4}$ in has volume $\\frac{7}{2} \\times 2 \\times \\frac{5}{4} = \\frac{70}{8} = 8\\frac{3}{4}\\text{ in}^3$.",
            "长方体的体积等于长乘宽乘高，棱长是分数时也一样：把带分数化成假分数再相乘。长 $3\\frac{1}{2}$ 英寸、宽 $2$ 英寸、高 $1\\frac{1}{4}$ 英寸的箱子，体积是 $\\frac{7}{2} \\times 2 \\times \\frac{5}{4} = \\frac{70}{8} = 8\\frac{3}{4}\\text{ in}^3$。",
          ],
          [
            "In another order: $\\frac{5}{4} \\times 2 = \\frac{5}{2}$, and $\\frac{5}{2} \\times \\frac{7}{2} = \\frac{35}{4} = 8\\frac{3}{4}$.",
            "换个顺序：$\\frac{5}{4} \\times 2 = \\frac{5}{2}$，$\\frac{5}{2} \\times \\frac{7}{2} = \\frac{35}{4} = 8\\frac{3}{4}$。",
          ],
          [
            "Multiplying only the whole parts, $3 \\times 2 \\times 1 = 6$, leaves out the fraction parts.",
            "只乘整数部分 $3 \\times 2 \\times 1 = 6$，就漏掉了分数部分。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const [l, w, h] = edges(rng);
          const v = l.mul(w).mul(h);
          return valued(
            ["Find the volume of the rectangular prism.", "求这个长方体的体积。"],
            v,
            volumeWalk([l, w, h], u),
            reorderCheck(l, w, h),
            [
              [l.add(w).add(h), "That adds the edges instead of multiplying them.", "这是把棱长相加，而不是相乘。"],
              [l.mul(w), "That is the area of the base; multiply by the height too.", "这是底面积，还要乘高。"],
              [
                wholePart(l).mul(wholePart(w)).mul(wholePart(h)),
                "That multiplies only the whole parts and drops the fractions.",
                "这只乘了整数部分，丢掉了分数。",
              ],
            ],
            { unit: `${u}^3`, figure: box(l, w, h, u) },
          );
        },
        box(Q.of(7, 2), Q.of(2), Q.of(5, 4), "in"),
      ),
      lesson(
        "packing-with-unit-fraction-cubes",
        ["Packing with small cubes", "用小正方体填满"],
        [
          [
            "Packing a box with small cubes gives the same volume as multiplying its edges. A box $1\\frac{1}{2}$ cm by $1$ cm by $2$ cm holds $3$, $2$ and $4$ cubes with $\\frac{1}{2}$ cm edges along its edges, so $3 \\times 2 \\times 4 = 24$ cubes fill it, each $\\frac{1}{8}\\text{ cm}^3$: $24 \\times \\frac{1}{8} = 3\\text{ cm}^3$.",
            "用小正方体填满盒子，得到的体积与棱长相乘相同。长 $1\\frac{1}{2}$ 厘米、宽 $1$ 厘米、高 $2$ 厘米的盒子，沿三条棱能放 $3$、$2$、$4$ 个棱长 $\\frac{1}{2}$ 厘米的正方体，所以需要 $3 \\times 2 \\times 4 = 24$ 个，每个 $\\frac{1}{8}\\text{ cm}^3$：$24 \\times \\frac{1}{8} = 3\\text{ cm}^3$。",
          ],
          [
            "$1\\frac{1}{2} \\times 1 \\times 2 = 3$, and $8$ small cubes fill each unit cube: $3 \\times 8 = 24$.",
            "$1\\frac{1}{2} \\times 1 \\times 2 = 3$，每个单位正方体能放 $8$ 个小正方体：$3 \\times 8 = 24$。",
          ],
          [
            "A unit cube holds $2 \\times 2 \\times 2 = 8$ half-unit cubes, not $2$.",
            "一个单位正方体能放 $2 \\times 2 \\times 2 = 8$ 个棱长一半的小正方体，不是 $2$ 个。",
          ],
        ],
        (rng) => {
          for (;;) {
            const u = pickUnit(rng);
            const n = rng.pick([2, 3, 4]);
            const [a, b, c] = [rng.int(n + 1, 4 * n), rng.int(1, 3 * n), rng.int(1, 3 * n)];
            if (a % n === 0) continue;
            const [l, w, h] = [Q.of(a, n), Q.of(b, n), Q.of(c, n)];
            const count = a * b * c;
            const v = Q.of(count, n * n * n);
            return valued(
              [
                `A rectangular prism is $${measure(l, false, u)}$ long, $${measure(w, false, u)}$ wide and $${measure(h, false, u)}$ tall. How many cubes with edges $\\frac{1}{${n}}\\text{ ${u}}$ long are needed to fill it?`,
                `一个长方体长 $${measure(l, false, u)}$、宽 $${measure(w, false, u)}$、高 $${measure(h, false, u)}$。需要多少个棱长 $\\frac{1}{${n}}\\text{ ${u}}$ 的正方体才能把它填满？`,
              ],
              count,
              [
                [
                  ["Cubes along each edge", "每条棱上的个数"],
                  [`$${n}$ cubes fit in every $1$ ${u}:`, `每 $1$ ${u} 能放 $${n}$ 个：`],
                  [l, w, h].map((e) => `${mixedLatex(e)} \\times ${n} = ${e.mul(Q.of(n)).toLatex()}`),
                ],
                [
                  ["Multiply", "相乘"],
                  ["Rows times columns times layers:", "行数乘列数乘层数："],
                  [`${a} \\times ${b} \\times ${c} = ${count}`],
                ],
              ],
              [
                `Each small cube is $\\frac{1}{${n ** 3}}\\text{ ${u}}^3$, and $${count} \\times \\frac{1}{${n ** 3}} = ${result(v)}$, the volume $${product([l, w, h], false)}$.`,
                `每个小正方体是 $\\frac{1}{${n ** 3}}\\text{ ${u}}^3$，$${count} \\times \\frac{1}{${n ** 3}} = ${result(v)}$，正是体积 $${product([l, w, h], false)}$。`,
              ],
              [
                [v, "That is the volume in cubic units, not the number of small cubes.", "这是以立方单位计的体积，不是小正方体的个数。"],
                [
                  v.mul(Q.of(n)),
                  `That multiplies the volume by $${n}$, but $${n} \\times ${n} \\times ${n}$ small cubes fill one unit cube.`,
                  `这是体积乘 $${n}$，但一个单位正方体能放 $${n} \\times ${n} \\times ${n}$ 个小正方体。`,
                ],
                [
                  Q.of(count, n),
                  `That multiplies the volume by $${n} \\times ${n}$, missing one edge's $${n}$.`,
                  `这是体积乘 $${n} \\times ${n}$，漏了一条棱上的 $${n}$。`,
                ],
              ],
              { form: "integer", figure: box(l, w, h, u) },
            );
          }
        },
        box(Q.of(3, 2), Q.one, Q.of(2), "cm"),
      ),
    ],
  ),
  [
    "A box for building blocks is $2\\frac{1}{2}$ ft by $1\\frac{1}{2}$ ft by $2$ ft. The edges are not whole numbers, but the volume is still length times width times height.",
    "一个积木箱长 $2\\frac{1}{2}$ 英尺、宽 $1\\frac{1}{2}$ 英尺、高 $2$ 英尺。棱长不是整数，体积仍然是长乘宽乘高。",
  ],
  [
    "$\\frac{5}{2} \\times \\frac{3}{2} \\times 2 = \\frac{15}{2} = 7\\frac{1}{2}$, and $60$ cubes with $\\frac{1}{2}$ ft edges, each $\\frac{1}{8}$, also make $7\\frac{1}{2}$.",
    "$\\frac{5}{2} \\times \\frac{3}{2} \\times 2 = \\frac{15}{2} = 7\\frac{1}{2}$；$60$ 个棱长 $\\frac{1}{2}$ 英尺的小正方体，每个 $\\frac{1}{8}$，也是 $7\\frac{1}{2}$。",
  ],
  [
    "find the volume of a box with fractional edges by multiplying, and by packing it with small cubes.",
    "用相乘和用小正方体填满两种方法，求棱长是分数的长方体的体积。",
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

export const volumesOfRectangularPrismsWithFractionalEdgeLengthsWordProblems = withIntro(
  topic(
    "volumes-of-rectangular-prisms-with-fractional-edge-lengths-word-problems",
    t("Volumes of Rectangular Prisms With Fractional Edge Lengths: Word Problems", "棱长是分数的长方体的体积：应用题"),
    t(
      "Volume tells how much a box, tank or container holds. Multiply its three dimensions: a tank 2½ ft by 1 ft by 1½ ft holds 5/2 × 1 × 3/2 = 15/4 = 3¾ ft³. When the volume and two dimensions are known, divide the volume by the area of the base to find the third: V = lwh, so h = V ÷ (lw).",
      "体积表示盒子、水箱等容器能装多少。把三个尺寸相乘：长 2½ 英尺、宽 1 英尺、高 1½ 英尺的水箱能装 5/2 × 1 × 3/2 = 15/4 = 3¾ 立方英尺。已知体积和两个尺寸时，用体积除以底面积求第三个尺寸：V = lwh，所以 h = V ÷ (lw)。",
    ),
    ["volumes-of-rectangular-prisms-with-fractional-edge-lengths", "dividing-mixed-numbers"],
    ["6.G.A.2"],
    [
      lesson(
        "volumes-of-containers",
        ["How much a container holds", "容器能装多少"],
        [
          [
            "How much a box-shaped container holds is its volume: multiply the three dimensions, and if it is filled only to some depth, use that depth as the height. A sandbox $4\\frac{1}{2}$ ft by $3$ ft with sand $\\frac{2}{3}$ ft deep holds $\\frac{9}{2} \\times 3 \\times \\frac{2}{3} = 9\\text{ ft}^3$ of sand.",
            "长方体容器能装多少就是求体积：把三个尺寸相乘；如果只装到一定深度，就用这个深度作高。长 $4\\frac{1}{2}$ 英尺、宽 $3$ 英尺的沙坑，沙子深 $\\frac{2}{3}$ 英尺，共有 $\\frac{9}{2} \\times 3 \\times \\frac{2}{3} = 9\\text{ ft}^3$ 沙子。",
          ],
          [
            "In another order: $3 \\times \\frac{2}{3} = 2$, and $4\\frac{1}{2} \\times 2 = 9$.",
            "换个顺序：$3 \\times \\frac{2}{3} = 2$，$4\\frac{1}{2} \\times 2 = 9$。",
          ],
          [
            "Volume fills the inside: the surface area, which wraps the outside, is a different measure.",
            "体积是装满里面的量：包住外面的表面积是另一种量。",
          ],
        ],
        (rng) => {
          const [l, w, h] = edges(rng);
          const c = rng.pick(containers(l, w, h));
          const v = l.mul(w).mul(h);
          const surface = l.mul(w).add(l.mul(h)).add(w.mul(h)).mul(Q.of(2));
          return valued(
            [`${c.en} What is its volume?`, `${c.zh}它的体积是多少？`],
            v,
            volumeWalk([l, w, h], c.u),
            reorderCheck(l, w, h),
            [
              [l.add(w).add(h), "That adds the dimensions instead of multiplying them.", "这是把尺寸相加，而不是相乘。"],
              [l.mul(w), "That is the area of the base; multiply by the height too.", "这是底面积，还要乘高。"],
              [
                surface,
                "That is the surface area, which wraps the outside, not the space inside.",
                "这是表面积，是包住外面的量，不是里面的空间。",
              ],
            ],
            { unit: `${c.u}^3`, figure: box(l, w, h, c.u) },
          );
        },
        box(Q.of(9, 2), Q.of(3), Q.of(2, 3), "ft"),
      ),
      lesson(
        "missing-edge-length",
        ["A missing dimension", "求未知的尺寸"],
        [
          [
            "The volume is the base area times the height, so the missing height is the volume divided by the base area. A box holding $15\\text{ ft}^3$ on a base $2\\frac{1}{2}$ ft by $2$ ft has base area $5\\text{ ft}^2$, so it is $15 \\div 5 = 3$ ft tall.",
            "体积等于底面积乘高，所以未知的高等于体积除以底面积。容积 $15\\text{ ft}^3$、底面长 $2\\frac{1}{2}$ 英尺、宽 $2$ 英尺的箱子，底面积是 $5\\text{ ft}^2$，所以高 $15 \\div 5 = 3$ 英尺。",
          ],
          ["$2\\frac{1}{2} \\times 2 \\times 3 = 15$, the volume.", "$2\\frac{1}{2} \\times 2 \\times 3 = 15$，正是体积。"],
          ["Divide by the whole base area, $5$, not by one side of the base.", "要除以整个底面积 $5$，不是底面的一条边。"],
        ],
        (rng) => {
          const u = rng.pick(["ft", "in"] as const);
          const [l, w, drawnH] = edges(rng);
          // A height of 1 would make the volume equal to the base and the question empty.
          const h = drawnH.eq(Q.one) ? Q.of(2) : drawnH;
          const base = l.mul(w);
          const v = base.mul(h);
          const what = rng.pick<Pair>([
            ["box", "箱子"],
            ["tank", "水箱"],
            ["drawer", "抽屉"],
          ]);
          return valued(
            [
              `A rectangular ${what[0]} has a volume of $${measure(v, false, u, 3)}$. Its base is $${measure(l, false, u)}$ long and $${measure(w, false, u)}$ wide. How tall is the ${what[0]}?`,
              `一个长方体${what[1]}的体积是 $${measure(v, false, u, 3)}$，底面长 $${measure(l, false, u)}$、宽 $${measure(w, false, u)}$。这个${what[1]}有多高？`,
            ],
            h,
            [
              [["The base area", "底面积"], ["Length times width:", "长乘宽："], [product([l, w], false)]],
              [["Divide", "相除"], ["Volume over base area:", "体积除以底面积："], [`h = ${quotient(v, base, false)}\\text{ ${u}}`]],
            ],
            [`Multiply back: $${product([l, w, h], false)}$, the volume.`, `乘回去：$${product([l, w, h], false)}$，正是体积。`],
            [
              [v.div(l), "That divides by the length only, not by the whole base area.", "这只除以了长，没有除以整个底面积。"],
              [v.sub(base), "That subtracts the base area instead of dividing by it.", "这是减去底面积，而不是除以它。"],
              [v.div(l.add(w)), "That divides by the sum of the sides, not their product.", "这是除以两边之和，而不是它们的积。"],
            ],
            { unit: u, figure: box(l, w, h, u) },
          );
        },
        box(Q.of(5, 2), Q.of(2), Q.of(3), "ft"),
      ),
    ],
  ),
  [
    "A fish tank, a drawer and a planter are all boxes. How much each holds is its volume, even when its sides are measured in halves and quarters of a foot.",
    "鱼缸、抽屉、种植箱都是长方体。它们能装多少就是体积，即使边长是半英尺、四分之一英尺。",
  ],
  [
    "A tank $2\\frac{1}{2}$ by $1$ by $1\\frac{1}{2}$ ft holds $\\frac{15}{4} = 3\\frac{3}{4}$ cubic feet, between $2 \\times 1 \\times 1 = 2$ and $3 \\times 1 \\times 2 = 6$.",
    "$2\\frac{1}{2}$ 乘 $1$ 乘 $1\\frac{1}{2}$ 英尺的水箱能装 $\\frac{15}{4} = 3\\frac{3}{4}$ 立方英尺，在 $2 \\times 1 \\times 1 = 2$ 和 $3 \\times 1 \\times 2 = 6$ 之间。",
  ],
  ["find how much a box holds, and a missing dimension from its volume.", "求长方体容器能装多少，并由体积求未知的尺寸。"],
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

/** pairFigure plots two named points in the coordinate plane joined by a highlighted segment. */
function pairFigure(p: Point, q: Point, names: string, alt: Text): Figure {
  const xs = [p[0], q[0]];
  const ys = [p[1], q[1]];
  const view = { xMin: Math.min(-1, ...xs) - 1, xMax: Math.max(1, ...xs) + 1, yMin: Math.min(-1, ...ys) - 1, yMax: Math.max(1, ...ys) + 1 };
  const marks: PlaneMark[] = [
    { kind: "segment", a: p, b: q, accent: true },
    { kind: "point", at: p, label: names[0] as string, dir: "ne" },
    { kind: "point", at: q, label: names[1] as string, dir: "ne" },
  ];
  return { svg: plane(view, marks), alt };
}

/** countUp checks a distance along one axis by counting up from the smaller coordinate. */
function countUp(a: number, b: number): Pair {
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return [
    `Counting up from $${lo}$ by $${hi - lo}$ reaches $${hi}$: $${lo} + ${hi - lo} = ${hi}$.`,
    `从 $${lo}$ 往上数 $${hi - lo}$ 就到 $${hi}$：$${lo} + ${hi - lo} = ${hi}$。`,
  ];
}

/** distanceOffs are the usual wrong distances between two values on one axis. */
function distanceOffs(a: number, b: number): Off[] {
  return [
    [
      absError(a, b),
      "That subtracts the sizes, but the points lie on opposite sides of the axis: add them.",
      "这是把大小相减，但两点在坐标轴两侧：应该相加。",
    ],
    [
      Math.abs(a) + Math.abs(b),
      "That adds the sizes, but the points lie on the same side of the axis: subtract them.",
      "这是把大小相加，但两点在坐标轴同侧：应该相减。",
    ],
    [Math.abs(a - b) + 1, "That counts the grid lines, not the spaces between them.", "这数的是网格线，不是它们之间的格数。"],
  ];
}

export const distancesBetweenPointsInTheCoordinatePlane = withIntro(
  topic(
    "distances-between-points-in-the-coordinate-plane",
    t("Distances Between Points in the Coordinate Plane", "坐标平面中两点间的距离"),
    t(
      "Two points with the same x-coordinate lie on a vertical line, and two points with the same y-coordinate lie on a horizontal line. Their distance is found from the other coordinates. On opposite sides of an axis, add the absolute values: (2, −3) and (2, 5) are 3 + 5 = 8 units apart. On the same side, subtract: (−6, 1) and (−2, 1) are 6 − 2 = 4 units apart.",
      "横坐标相同的两点在一条竖直线上，纵坐标相同的两点在一条水平线上。它们的距离由另一个坐标求出。两点在坐标轴两侧时，把绝对值相加：(2, −3) 与 (2, 5) 相距 3 + 5 = 8 个单位。在同一侧时，相减：(−6, 1) 与 (−2, 1) 相距 6 − 2 = 4 个单位。",
    ),
    ["solving-problems-in-the-coordinate-plane"],
    ["6.NS.C.8", "6.G.A.3"],
    [
      lesson(
        "distance-between-two-points",
        ["The distance between two points", "两点间的距离"],
        [
          [
            "Points that share one coordinate lie on a horizontal or vertical line, and their distance comes from the other coordinates: add the sizes across an axis, subtract them on one side. $(-4, 7)$ and $(-4, -2)$ share the $x$-coordinate $-4$, and $7$ and $-2$ lie on opposite sides of the $x$-axis, so the distance is $7 + 2 = 9$.",
            "有一个坐标相同的两点在一条水平线或竖直线上，距离由另一个坐标求出：跨过坐标轴时把大小相加，在同一侧时相减。$(-4, 7)$ 与 $(-4, -2)$ 的横坐标都是 $-4$，$7$ 和 $-2$ 在 $x$ 轴两侧，所以距离是 $7 + 2 = 9$。",
          ],
          ["Counting up from $-2$ by $9$ reaches $7$: $-2 + 9 = 7$.", "从 $-2$ 往上数 $9$ 就到 $7$：$-2 + 9 = 7$。"],
          ["Across an axis, add the sizes: $7 - 2 = 5$ is not the distance.", "跨过坐标轴要把大小相加：$7 - 2 = 5$ 不是距离。"],
        ],
        (rng) => {
          for (;;) {
            const shared = rng.int(-9, 9);
            const a = coordinate(rng);
            const b = coordinate(rng);
            if (a === b) continue;
            const vertical = rng.bool();
            const [P, R]: [Point, Point] = vertical
              ? [
                  [shared, a],
                  [shared, b],
                ]
              : [
                  [a, shared],
                  [b, shared],
                ];
            const [p, q] = [pointLatex(P), pointLatex(R)];
            return valued(
              [`What is the distance between $${p}$ and $${q}$?`, `$${p}$ 与 $${q}$ 之间的距离是多少？`],
              Math.abs(a - b),
              [
                [
                  ["Find the line", "找出所在的线"],
                  [
                    `The points share the ${vertical ? "$x$" : "$y$"}-coordinate $${shared}$, so they lie on a ${vertical ? "vertical" : "horizontal"} line; compare the other coordinates:`,
                    `两点的${vertical ? "横" : "纵"}坐标都是 $${shared}$，所以在一条${vertical ? "竖直" : "水平"}线上；比较另一个坐标：`,
                  ],
                  [`${a}, \\ ${b}`],
                ],
                [
                  ["Find the distance", "求距离"],
                  a * b < 0
                    ? ["They are on opposite sides of the axis, so add their sizes:", "它们在坐标轴两侧，所以把大小相加："]
                    : ["They are on the same side of the axis, so subtract:", "它们在坐标轴同侧，所以相减："],
                  [apart(a, b)],
                ],
              ],
              countUp(a, b),
              distanceOffs(a, b),
              {
                form: "integer",
                figure: pairFigure(
                  P,
                  R,
                  "PQ",
                  t(
                    `The points (${P.join(", ")}) and (${R.join(", ")}) joined by a segment.`,
                    `点 (${P.join(", ")}) 和 (${R.join(", ")}) 用线段连起来。`,
                  ),
                ),
              },
            );
          }
        },
        pairFigure(
          [-4, 7],
          [-4, -2],
          "PQ",
          t(
            "The points P(−4, 7) and Q(−4, −2) on a vertical line, across the x-axis.",
            "点 P(−4, 7) 和 Q(−4, −2) 在一条竖直线上，跨过 x 轴。",
          ),
        ),
      ),
      lesson(
        "point-at-a-given-distance",
        ["A point at a given distance", "求给定距离处的点"],
        [
          [
            "Moving up or down changes only the $y$-coordinate, and moving left or right changes only the $x$-coordinate: add for up and right, subtract for down and left. Point $B$ is $6$ units below $A(3, 2)$, so its $y$-coordinate is $2 - 6 = -4$ and $B = (3, -4)$.",
            "上下移动只改变纵坐标，左右移动只改变横坐标：向上、向右用加法，向下、向左用减法。点 $B$ 在 $A(3, 2)$ 下方 $6$ 个单位，所以纵坐标是 $2 - 6 = -4$，$B = (3, -4)$。",
          ],
          [
            "From $y = -4$ to $y = 2$ is $4 + 2 = 6$ units, across the $x$-axis.",
            "从 $y = -4$ 到 $y = 2$ 跨过 $x$ 轴，是 $4 + 2 = 6$ 个单位。",
          ],
          [
            "Change only one coordinate: moving down leaves the $x$-coordinate $3$ as it is.",
            "只改变一个坐标：向下移动时横坐标 $3$ 不变。",
          ],
        ],
        (rng) => {
          const [x, y] = [rng.int(-8, 8), rng.int(-8, 8)];
          const d = rng.int(2, 12);
          const dir = rng.int(0, 3);
          const moves: [number, number][] = [
            [d, 0],
            [-d, 0],
            [0, d],
            [0, -d],
          ];
          const [dx, dy] = moves[dir] as [number, number];
          const words = (
            [
              ["to the right of", "右边"],
              ["to the left of", "左边"],
              ["above", "上方"],
              ["below", "下方"],
            ] as const
          )[dir] as readonly [string, string];
          const answer = [x + dx, y + dy];
          const horizontal = dx !== 0;
          const [from, to] = horizontal ? [x, x + dx] : [y, y + dy];
          const sign = dx + dy > 0 ? "+" : "-";
          return located(
            [
              `Point $B$ is $${d}$ units ${words[0]} $A${pointLatex([x, y])}$. What are the coordinates of $B$?`,
              `点 $B$ 在 $A${pointLatex([x, y])}$ ${words[1]} $${d}$ 个单位处。$B$ 的坐标是什么？`,
            ],
            answer,
            [
              [
                ["Pick the coordinate", "选出要变的坐标"],
                horizontal
                  ? ["Moving left or right changes only the $x$-coordinate; $y$ stays", "左右移动只改变横坐标；纵坐标不变"]
                  : ["Moving up or down changes only the $y$-coordinate; $x$ stays", "上下移动只改变纵坐标；横坐标不变"],
                [horizontal ? `y = ${y}` : `x = ${x}`],
              ],
              [
                ["Move", "移动"],
                dx + dy > 0 ? [`Add $${d}$:`, `加 $${d}$：`] : [`Subtract $${d}$:`, `减 $${d}$：`],
                [`${from} ${sign} ${d} = ${to}`, `B = ${pointLatex(answer)}`],
              ],
            ],
            [
              `From $${pointLatex([x, y])}$ to $${pointLatex(answer)}$ is $${apart(from, to)}$ units.`,
              `从 $${pointLatex([x, y])}$ 到 $${pointLatex(answer)}$ 的距离是 $${apart(from, to)}$ 个单位。`,
            ],
            [
              [[x - dx, y - dy], "That moves the opposite way.", "这是往相反的方向移动。"],
              [[x + dy, y + dx], "That changes the other coordinate.", "这改变的是另一个坐标。"],
              [[x - dy, y - dx], "That changes the other coordinate and moves the opposite way.", "这改变了另一个坐标，方向也反了。"],
            ],
          );
        },
        pairFigure(
          [3, 2],
          [3, -4],
          "AB",
          t("A(3, 2) and the point B(3, −4) six units below it.", "A(3, 2) 和它下方 6 个单位的点 B(3, −4)。"),
        ),
      ),
    ],
  ),
  [
    "On a city map with a grid, the library is at $(-4, 7)$ and the school at $(-4, -2)$. They are on the same north–south street, on opposite sides of the main road along the $x$-axis.",
    "在带网格的城市地图上，图书馆在 $(-4, 7)$，学校在 $(-4, -2)$。它们在同一条南北向的街上，分在沿 $x$ 轴的大路两侧。",
  ],
  ["$7$ blocks up to the main road and $2$ blocks below it make $9$ blocks.", "大路以上 $7$ 个街区，以下 $2$ 个街区，共 $9$ 个街区。"],
  [
    "find the distance between points on a horizontal or vertical line, and a point at a given distance.",
    "求水平线或竖直线上两点间的距离，并求给定距离处的点。",
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

/** quadReason says why a learner's pick of one kind of quadrilateral is wrong for another, given the horizontal sides' lengths. */
function quadReason(wrong: QuadKind, kind: QuadKind, b: number, top: number): readonly [string, string] {
  const slanted = kind === "parallelogram" || kind === "trapezoid";
  switch (wrong) {
    case "square":
      return slanted
        ? ["There is no right angle, so it cannot be a square.", "没有直角，所以不可能是正方形。"]
        : ["The sides have two different lengths, so they are not all equal.", "边有两种长度，并不都相等。"];
    case "rectangle":
      return slanted
        ? ["There is no right angle, so it cannot be a rectangle.", "没有直角，所以不可能是长方形。"]
        : ["All four sides are equal, so it is a square.", "四条边都相等，所以是正方形。"];
    case "parallelogram":
      return slanted
        ? [
            `The horizontal sides are ${b} and ${top} units long, so the other two sides are not parallel.`,
            `两条水平边长 ${b} 和 ${top} 个单位，所以另外两条边不平行。`,
          ]
        : ["Every angle is a right angle, so it is a rectangle.", "每个角都是直角，所以它是长方形。"];
    case "trapezoid":
      return ["The horizontal sides are equal, so both pairs of opposite sides are parallel.", "两条水平边相等，所以两组对边都平行。"];
  }
}
/** quadPair gives a kind of quadrilateral as an English and Chinese pair. */
const quadPair = (k: QuadKind): Pair => [quadOptions[k].en, quadOptions[k]["zh-CN"]];

export const polygonsInTheCoordinatePlane = withIntro(
  topic(
    "polygons-in-the-coordinate-plane",
    t("Polygons in the Coordinate Plane", "坐标平面中的多边形"),
    t(
      "A polygon can be drawn in the coordinate plane by plotting its vertices and joining them in order. A side whose endpoints share an x- or y-coordinate is vertical or horizontal, and its length is the distance between the endpoints. Comparing sides tells what kind of polygon it is: for example, a quadrilateral with horizontal and vertical sides is a rectangle, and a square if all four sides are equal.",
      "在坐标平面中描出多边形的各个顶点，再依次连接，就能画出这个多边形。端点横坐标或纵坐标相同的边是竖直的或水平的，它的长度就是两个端点之间的距离。比较各边就能判断多边形的类型：例如，各边都是水平或竖直的四边形是长方形，四条边都相等时是正方形。",
    ),
    ["distances-between-points-in-the-coordinate-plane", "classifying-quadrilaterals"],
    ["6.G.A.3"],
    [
      lesson(
        "side-lengths-from-vertices",
        ["Side lengths from the vertices", "由顶点求边长"],
        [
          [
            "A side whose endpoints share a coordinate is horizontal or vertical, and its length is the distance between the other coordinates; when they have opposite signs, the side crosses an axis, so add their sizes. In rectangle $A(-3, -2)$, $B(5, -2)$, $C(5, 4)$, $D(-3, 4)$, side $BC$ runs from $y = -2$ to $y = 4$, so it is $2 + 4 = 6$ units long.",
            "两个端点有一个坐标相同的边是水平的或竖直的，它的长度是另一个坐标之间的距离；两个坐标符号相反时，这条边跨过了坐标轴，要把大小相加。长方形 $A(-3, -2)$、$B(5, -2)$、$C(5, 4)$、$D(-3, 4)$ 中，边 $BC$ 从 $y = -2$ 到 $y = 4$，所以长 $2 + 4 = 6$ 个单位。",
          ],
          ["Counting up from $-2$ by $6$ reaches $4$: $-2 + 6 = 4$.", "从 $-2$ 往上数 $6$ 就到 $4$：$-2 + 6 = 4$。"],
          ["Side $BC$ crosses the $x$-axis, so $4 - 2 = 2$ is not its length.", "边 $BC$ 跨过了 $x$ 轴，所以 $4 - 2 = 2$ 不是它的长度。"],
        ],
        (rng) => {
          for (;;) {
            const [x1, x2] = [rng.int(-9, 2), rng.int(1, 9)];
            const [y1, y2] = [rng.int(-9, 2), rng.int(1, 9)];
            if (x1 >= x2 || y1 >= y2) continue;
            const triangle = rng.bool();
            const pts: Point[] = triangle
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
            const [name, from, to, side] = triangle
              ? rng.bool()
                ? ["AB", x1, x2, 0]
                : ["AC", y1, y2, 2]
              : askBC
                ? ["BC", y1, y2, 1]
                : ["AB", x1, x2, 0];
            const vertical = name !== "AB";
            const shape: Pair = triangle ? ["Right triangle $ABC$", "直角三角形 $ABC$"] : ["Rectangle $ABCD$", "长方形 $ABCD$"];
            const names = triangle ? "ABC" : "ABCD";
            return valued(
              [
                `${shape[0]} has vertices ${vertexList(pts, "and")}. How long is side $${name}$?`,
                `${shape[1]} 的顶点是 ${vertexList(pts, "和")}。边 $${name}$ 有多长？`,
              ],
              to - from,
              [
                [
                  ["Find the direction", "看方向"],
                  [
                    `The endpoints of $${name}$ share the ${vertical ? "$x$" : "$y$"}-coordinate, so the side is ${vertical ? "vertical" : "horizontal"}; compare the other coordinates:`,
                    `$${name}$ 两个端点的${vertical ? "横" : "纵"}坐标相同，所以这条边是${vertical ? "竖直" : "水平"}的；比较另一个坐标：`,
                  ],
                  [`${from}, \\ ${to}`],
                ],
                [
                  ["Find the length", "求长度"],
                  from * to < 0
                    ? ["The side crosses an axis, so add the sizes:", "这条边跨过坐标轴，所以把大小相加："]
                    : ["The side stays on one side of the axis, so subtract:", "这条边在坐标轴同侧，所以相减："],
                  [apart(from, to)],
                ],
              ],
              countUp(from, to),
              distanceOffs(from, to),
              {
                form: "integer",
                figure: coordinatePolygonFigure(
                  pts,
                  names,
                  [side],
                  t(
                    `Polygon ${names} in the coordinate plane with side ${name} highlighted.`,
                    `坐标平面中的多边形 ${names}，边 ${name} 被高亮。`,
                  ),
                ),
              },
            );
          }
        },
        coordinatePolygonFigure(
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
      ),
      lesson(
        "identifying-polygons-from-vertices",
        ["Identifying the polygon", "判断多边形的类型"],
        [
          [
            "Find which sides are horizontal or vertical, compare their lengths, and look for right angles. $A(-2, 1)$, $B(4, 1)$, $C(6, 5)$, $D(0, 5)$: $AB$ and $DC$ are horizontal and both $6$ units long, so they are parallel and equal; $A$ and $D$ have different $x$-coordinates, so $AD$ is slanted and there are no right angles. $ABCD$ is a parallelogram that is not a rectangle.",
            "先找出哪些边是水平的或竖直的，比较它们的长度，再看有没有直角。$A(-2, 1)$、$B(4, 1)$、$C(6, 5)$、$D(0, 5)$：$AB$ 和 $DC$ 都是水平的，长都是 $6$ 个单位，所以平行且相等；$A$ 和 $D$ 的横坐标不同，所以 $AD$ 是斜的，没有直角。$ABCD$ 是不是长方形的平行四边形。",
          ],
          [
            "$A$ and $B$ both move $2$ right and $4$ up to reach $D$ and $C$, so $AD$ and $BC$ are parallel and equal too.",
            "从 $A$ 到 $D$、从 $B$ 到 $C$ 都是向右 $2$、向上 $4$，所以 $AD$ 和 $BC$ 也平行且相等。",
          ],
          [
            "Two equal horizontal sides do not make a rectangle: the other sides must also be vertical.",
            "两条相等的水平边不能说明是长方形：另外两条边还必须是竖直的。",
          ],
        ],
        (rng) => {
          for (;;) {
            const kind = rng.pick(quadKinds);
            const [x0, y0] = [rng.int(-8, 0), rng.int(-8, 0)];
            const b = rng.int(3, 9);
            const h = kind === "square" ? b : rng.int(2, 8);
            if (kind === "rectangle" && h === b) continue;
            const o = kind === "square" || kind === "rectangle" ? 0 : rng.nonZero(-3, 3);
            const top = kind === "trapezoid" ? b + rng.nonZero(-2, 3) : b;
            if (top < 1) continue;
            const pts: Point[] = [
              [x0, y0],
              [x0 + b, y0],
              [x0 + o + top, y0 + h],
              [x0 + o, y0 + h],
            ];
            const sides: Walk =
              o === 0
                ? [
                    ["The sides", "看各边"],
                    [
                      `$AB$ and $DC$ are horizontal and $BC$ and $AD$ are vertical, so every angle is a right angle. The horizontal sides are $${b}$ units long and the vertical sides $${h}$.`,
                      `$AB$ 和 $DC$ 是水平的，$BC$ 和 $AD$ 是竖直的，所以每个角都是直角。水平边长 $${b}$ 个单位，竖直边长 $${h}$ 个单位。`,
                    ],
                  ]
                : [
                    ["The sides", "看各边"],
                    [
                      `$AB$ and $DC$ are horizontal, so they are parallel; they are $${b}$ and $${top}$ units long. $A$ and $D$ have different $x$-coordinates, so $AD$ is slanted and there is no right angle.`,
                      `$AB$ 和 $DC$ 是水平的，所以平行；长分别是 $${b}$ 和 $${top}$ 个单位。$A$ 和 $D$ 的横坐标不同，所以 $AD$ 是斜的，没有直角。`,
                    ],
                  ];
            const verdict: Record<QuadKind, Pair> = {
              square: ["Right angles and four equal sides make a square.", "四个直角且四边相等，是正方形。"],
              rectangle: [
                "Right angles with sides of two lengths make a rectangle that is not a square.",
                "四个直角、两种边长，是不是正方形的长方形。",
              ],
              parallelogram: [
                "Equal parallel sides with no right angle make a parallelogram that is not a rectangle.",
                "一组对边平行且相等、没有直角，是不是长方形的平行四边形。",
              ],
              trapezoid: [
                "Parallel sides of different lengths mean the other two sides are not parallel: a trapezoid.",
                "一组平行边长度不同，另外两条边就不平行：是梯形。",
              ],
            };
            const checks: Record<QuadKind, Pair> = {
              square: [
                `Every side is $${b}$: $AB = ${b}$, $BC = ${h}$, and the opposite sides match.`,
                `每条边都是 $${b}$：$AB = ${b}$，$BC = ${h}$，对边也一样。`,
              ],
              rectangle: [
                `$AB = DC = ${b}$ and $BC = AD = ${h}$, two different lengths, all meeting at right angles.`,
                `$AB = DC = ${b}$，$BC = AD = ${h}$，两种长度，都成直角相交。`,
              ],
              parallelogram: [
                `From $A$ to $D$ and from $B$ to $C$ both move $${o}$ across and $${h}$ up, so $AD$ and $BC$ are parallel and equal too.`,
                `从 $A$ 到 $D$、从 $B$ 到 $C$ 都是横向移动 $${o}$、向上 $${h}$，所以 $AD$ 和 $BC$ 也平行且相等。`,
              ],
              trapezoid: [
                `From $A$ to $D$ moves $${o}$ across, but from $B$ to $C$ moves $${o + top - b}$ across, so $AD$ and $BC$ are not parallel.`,
                `从 $A$ 到 $D$ 横向移动 $${o}$，从 $B$ 到 $C$ 却横向移动 $${o + top - b}$，所以 $AD$ 和 $BC$ 不平行。`,
              ],
            };
            return chosen(
              rng,
              [
                `Quadrilateral $ABCD$ has vertices ${vertexList(pts, "and")}. What kind of quadrilateral is it?`,
                `四边形 $ABCD$ 的顶点是 ${vertexList(pts, "和")}。它是哪种四边形？`,
              ],
              quadPair(kind),
              quadKinds.filter((k) => k !== kind).map((k): Wrong => [quadPair(k), ...quadReason(k, kind, b, top)]),
              [sides, [["Decide", "判断"], verdict[kind]]],
              checks[kind],
              coordinatePolygonFigure(
                pts,
                "ABCD",
                [0, 2],
                t(
                  "Quadrilateral ABCD in the coordinate plane with its horizontal sides highlighted.",
                  "坐标平面中的四边形 ABCD，水平边被高亮。",
                ),
              ),
            );
          }
        },
        coordinatePolygonFigure(
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
      ),
    ],
  ),
  [
    "A treasure map marks four corners of a garden at $(-3, -2)$, $(5, -2)$, $(5, 4)$ and $(-3, 4)$. Joining them in order draws the garden's fence, and the coordinates tell how long each side is.",
    "藏宝图在 $(-3, -2)$、$(5, -2)$、$(5, 4)$、$(-3, 4)$ 标出花园的四个角。按顺序连起来就是花园的篱笆，坐标能告诉我们每条边有多长。",
  ],
  [
    "The bottom side is $3 + 5 = 8$ units, and the top side, from $-3$ to $5$, is also $8$.",
    "下边长 $3 + 5 = 8$ 个单位，上边从 $-3$ 到 $5$，也是 $8$。",
  ],
  [
    "find side lengths of a polygon from its vertices, and tell what kind of quadrilateral it is.",
    "由顶点求多边形的边长，并判断四边形的类型。",
  ],
);

export const findingAreasAndPerimetersInTheCoordinatePlane = withIntro(
  topic(
    "finding-areas-and-perimeters-in-the-coordinate-plane",
    t("Finding Areas and Perimeters in the Coordinate Plane", "求坐标平面中图形的面积和周长"),
    t(
      "To find the perimeter or area of a polygon from its vertices, first find the lengths of its horizontal and vertical sides from the coordinates. The rectangle with vertices (−2, −1), (4, −1), (4, 3) and (−2, 3) is 6 units wide and 4 units tall, so its perimeter is 2(6 + 4) = 20 units and its area is 6 × 4 = 24 square units. For a triangle with a horizontal base, the height is the vertical distance from the third vertex to the base.",
      "由顶点求多边形的周长或面积时，先用坐标求出水平边和竖直边的长度。顶点为 (−2, −1)、(4, −1)、(4, 3)、(−2, 3) 的长方形宽 6 个单位、高 4 个单位，所以周长是 2(6 + 4) = 20 个单位，面积是 6 × 4 = 24 平方单位。底边水平的三角形，高是第三个顶点到底边的竖直距离。",
    ),
    ["polygons-in-the-coordinate-plane", "areas-of-triangles"],
    ["6.G.A.3"],
    [
      lesson(
        "perimeters-of-rectangles-from-vertices",
        ["Perimeters of rectangles", "长方形的周长"],
        [
          [
            "Find one horizontal side and one vertical side from the coordinates; the perimeter is $2 \\times$ (length $+$ width). Rectangle $A(-5, 2)$, $B(3, 2)$, $C(3, 7)$, $D(-5, 7)$: $AB = 5 + 3 = 8$ and $BC = 7 - 2 = 5$, so the perimeter is $2(8 + 5) = 26$ units.",
            "根据坐标求出一条水平边和一条竖直边的长度，周长就是 $2 \\times$（长 $+$ 宽）。长方形 $A(-5, 2)$、$B(3, 2)$、$C(3, 7)$、$D(-5, 7)$：$AB = 5 + 3 = 8$，$BC = 7 - 2 = 5$，所以周长是 $2(8 + 5) = 26$ 个单位。",
          ],
          ["Adding all four sides: $8 + 5 + 8 + 5 = 26$.", "四条边相加：$8 + 5 + 8 + 5 = 26$。"],
          ["The perimeter goes around all four sides: $8 + 5 = 13$ is only half of it.", "周长要绕四条边一圈：$8 + 5 = 13$ 只是一半。"],
        ],
        (rng) => {
          for (;;) {
            const [x1, x2] = [rng.int(-9, 3), rng.int(-2, 9)];
            const [y1, y2] = [rng.int(-9, 3), rng.int(-2, 9)];
            if (x2 - x1 < 2 || y2 - y1 < 2) continue;
            const [w, h] = [x2 - x1, y2 - y1];
            const pts: Point[] = [
              [x1, y1],
              [x2, y1],
              [x2, y2],
              [x1, y2],
            ];
            return valued(
              [
                `Rectangle $ABCD$ has vertices ${vertexList(pts, "and")}. What is its perimeter, in units?`,
                `长方形 $ABCD$ 的顶点是 ${vertexList(pts, "和")}。它的周长是多少个单位？`,
              ],
              2 * (w + h),
              [
                [
                  ["The sides", "求边长"],
                  ["$AB$ is horizontal and $BC$ is vertical:", "$AB$ 是水平的，$BC$ 是竖直的："],
                  [`AB = ${apart(x1, x2)}`, `BC = ${apart(y1, y2)}`],
                ],
                [
                  ["The perimeter", "求周长"],
                  ["Twice the length plus the width:", "长加宽的 2 倍："],
                  [`P = 2(${w} + ${h}) = ${2 * (w + h)}`],
                ],
              ],
              [
                `All four sides added: $${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}$.`,
                `四条边相加：$${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}$。`,
              ],
              [
                [w * h, "That is the area, not the distance around.", "这是面积，不是周长。"],
                [w + h, "That is only half the way around: double it.", "这只是周长的一半：还要乘 2。"],
                [
                  2 * (absError(x1, x2) + absError(y1, y2)),
                  "That subtracts the sizes of coordinates on opposite sides of an axis; add them there.",
                  "这把坐标轴两侧坐标的大小相减了；那里应该相加。",
                ],
              ],
              {
                form: "integer",
                figure: coordinatePolygonFigure(
                  pts,
                  "ABCD",
                  [0, 1],
                  t(
                    "Rectangle ABCD in the coordinate plane with sides AB and BC highlighted.",
                    "坐标平面中的长方形 ABCD，边 AB 和 BC 被高亮。",
                  ),
                ),
              },
            );
          }
        },
        drawn(gradeDrawings3["finding-areas-and-perimeters-in-the-coordinate-plane#perimeters-of-rectangles-from-vertices"]),
      ),
      lesson(
        "areas-of-triangles-from-vertices",
        ["Areas of triangles", "三角形的面积"],
        [
          [
            "Use a horizontal side as the base; the height is the vertical distance from the third vertex to that side. Triangle $A(-3, -2)$, $B(5, -2)$, $C(1, 4)$: the base $AB$ is $3 + 5 = 8$ units, the height from $C$ to the line $y = -2$ is $4 + 2 = 6$, and the area is $\\frac{1}{2} \\times 8 \\times 6 = 24$ square units.",
            "用一条水平边作底，高是第三个顶点到这条边的竖直距离。三角形 $A(-3, -2)$、$B(5, -2)$、$C(1, 4)$：底 $AB$ 长 $3 + 5 = 8$ 个单位，$C$ 到直线 $y = -2$ 的高是 $4 + 2 = 6$，面积是 $\\frac{1}{2} \\times 8 \\times 6 = 24$ 平方单位。",
          ],
          [
            "The rectangle $8$ by $6$ around the triangle has area $48$, and the triangle is half of it: $24$.",
            "围住三角形的 $8$ 乘 $6$ 的长方形面积是 $48$，三角形是它的一半：$24$。",
          ],
          [
            "The height is measured from the base line $y = -2$, not from the $x$-axis: it is $6$, not $4$.",
            "高要从底所在的直线 $y = -2$ 量起，不是从 $x$ 轴量起：是 $6$，不是 $4$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [x1, x2] = [rng.int(-9, 2), rng.int(-1, 9)];
            const y0 = rng.int(-8, 2);
            const [cx, cy] = [rng.int(-9, 9), rng.int(-2, 9)];
            if (x2 - x1 < 2 || cy - y0 < 2) continue;
            const [b, h] = [x2 - x1, cy - y0];
            const pts: Point[] = [
              [x1, y0],
              [x2, y0],
              [cx, cy],
            ];
            const area = Q.of(b * h, 2);
            return valued(
              [
                `Triangle $ABC$ has vertices ${vertexList(pts, "and")}. What is its area, in square units?`,
                `三角形 $ABC$ 的顶点是 ${vertexList(pts, "和")}。它的面积是多少平方单位？`,
              ],
              area,
              [
                [["The base", "求底"], ["$AB$ is horizontal:", "$AB$ 是水平的："], [`AB = ${apart(x1, x2)}`]],
                [
                  ["The height", "求高"],
                  [`The vertical distance from $C$ to the line $y = ${y0}$:`, `$C$ 到直线 $y = ${y0}$ 的竖直距离：`],
                  [`h = ${apart(y0, cy)}`],
                ],
                [
                  ["The area", "求面积"],
                  ["Half the base times the height:", "底乘高的一半："],
                  [`A = \\frac{1}{2} \\times ${b} \\times ${h} = ${result(area)}`],
                ],
              ],
              [
                `The rectangle $${b}$ by $${h}$ around the triangle has area $${b * h}$, and the triangle is half of it: $${result(area)}$.`,
                `围住三角形的 $${b}$ 乘 $${h}$ 的长方形面积是 $${b * h}$，三角形是它的一半：$${result(area)}$。`,
              ],
              [
                [
                  b * h,
                  "That forgets the one half: a triangle is half the rectangle around it.",
                  "这忘了乘二分之一：三角形是外面长方形的一半。",
                ],
                [
                  Q.of(absError(x1, x2) * h, 2),
                  "That subtracts the sizes across the axis for the base; add them there.",
                  "求底时把坐标轴两侧的大小相减了；应该相加。",
                ],
                [
                  Q.of(b * Math.abs(cy), 2),
                  "That measures the height from the $x$-axis, not from the base.",
                  "这是从 $x$ 轴量的高，不是从底量的。",
                ],
              ],
              {
                figure: coordinatePolygonFigure(
                  pts,
                  "ABC",
                  [0],
                  t(
                    "Triangle ABC in the coordinate plane with the horizontal base AB highlighted.",
                    "坐标平面中的三角形 ABC，水平的底 AB 被高亮。",
                  ),
                ),
              },
            );
          }
        },
        drawn(gradeDrawings3["finding-areas-and-perimeters-in-the-coordinate-plane#areas-of-triangles-from-vertices"]),
      ),
    ],
  ),
  [
    "A park ranger plans a fenced play area on a map grid. The fence needs the distance around, the grass needs the area, and both come from the corner coordinates.",
    "公园管理员在网格地图上规划一块围起来的游戏区。买篱笆要知道周长，铺草要知道面积，两者都可以由角的坐标求出。",
  ],
  [
    "The rectangle $(-2, -1)$ to $(4, 3)$ is $6$ by $4$: perimeter $20$, area $24$, and $24$ unit squares fill it.",
    "从 $(-2, -1)$ 到 $(4, 3)$ 的长方形是 $6$ 乘 $4$：周长 $20$，面积 $24$，正好放下 $24$ 个单位正方形。",
  ],
  ["find the perimeter of a rectangle and the area of a triangle from their vertices.", "由顶点求长方形的周长和三角形的面积。"],
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
