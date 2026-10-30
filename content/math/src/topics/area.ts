import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, sketch } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";

const units = ["cm", "m", "in", "ft"] as const;

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

const pickUnit = (rng: Rng): Unit => rng.pick(units);

/** len writes a length for a figure: "8 cm". */
const len = (v: number, u: Unit) => `${v} ${u}`;

/** tex writes a length or an area in LaTeX: "8\text{ cm}", "24\text{ cm}^2". */
const tex = (v: number, u: Unit, power = 1) => `${v}\\text{ ${u}}${power === 2 ? "^2" : ""}`;

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** sides labels each side of a counterclockwise polygon, outside it; a null label leaves the side unlabeled. */
function sides(points: readonly Point[], labels: readonly (string | null)[]): Mark[] {
  return points.flatMap((a, i): Mark[] => {
    const text = labels[i];
    return text == null ? [] : [{ kind: "side", a, b: points[(i + 1) % points.length]!, text }];
  });
}

/** rectangle is the corners of an l by w rectangle, counterclockwise from the origin. */
const rectangle = (l: number, w: number): Point[] => [
  [0, 0],
  [l, 0],
  [l, w],
  [0, w],
];

/** height marks a dashed height from apex down to foot, with a right angle at the foot toward toward. */
function height(apex: Point, foot: Point, toward: Point, label: string): Mark[] {
  return [
    { kind: "segment", a: apex, b: foot, dashed: true, accent: true },
    { kind: "right", vertex: foot, from: apex, to: toward },
    { kind: "side", a: foot, b: apex, text: label },
  ];
}

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const intOr = (a: number, b: number, fallback: number) => (Number.isInteger(a / b) ? a / b : fallback);

/** scaleneTriangle draws a triangle to scale with whole-number sides, the longest at the bottom. */
function scaleneTriangle(rng: Rng): [Point[], number[]] {
  for (;;) {
    const [a, b, c] = [rng.int(4, 18), rng.int(4, 18), rng.int(6, 20)];
    if (c < a || c < b || a + b <= c + 1) continue;
    const x = (b * b + c * c - a * a) / (2 * c);
    return [
      [
        [0, 0],
        [c, 0],
        [x, Math.sqrt(b * b - x * x)],
      ],
      [c, a, b],
    ];
  }
}

/** trapezoid draws a quadrilateral to scale with whole-number sides: a trapezoid of height 12 whose slanted sides come from Pythagorean triples. */
function trapezoid(rng: Rng): [Point[], number[]] {
  const [o1, c1] = rng.pick([
    [5, 13],
    [9, 15],
    [16, 20],
  ] as const);
  const [o2, c2] = rng.pick([
    [0, 12],
    [5, 13],
    [9, 15],
  ] as const);
  const top = rng.int(6, 20);
  const bottom = top + o1 + o2;
  return [
    [
      [0, 0],
      [bottom, 0],
      [bottom - o2, 12],
      [o1, 12],
    ],
    [bottom, c2, top, c1],
  ];
}

/** triples are Pythagorean triples: a slanted side of length c leans over a by b. */
const triples = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
] as const;

export const perimeter: TopicDef = {
  id: "perimeter",
  title: t("Perimeter", "周长"),
  summary: t("Find the perimeter of polygons, and a missing side from the perimeter.", "求多边形的周长，以及由周长求未知边长。"),
  prerequisites: [],
  encompasses: [],
  xp: 6,
  standards: ["CCSS.3.MD.D.8"],
  knowledgePoints: [
    {
      id: "perimeter-of-polygons",
      title: t("Perimeter of a polygon", "多边形的周长"),
      explanation: t(
        "The **perimeter** of a polygon is the distance around it: the sum of its side lengths. It is a length, so it is measured in units such as centimeters.\n\nA rectangle has two pairs of equal sides, so a rectangle $8$ cm long and $5$ cm wide has perimeter $2 \\cdot 8 + 2 \\cdot 5 = 26$ cm. A square with side $s$ has perimeter $4s$.",
        "多边形的**周长**是绕它一周的长度，即各边长之和。周长是长度，用厘米等长度单位计量。\n\n长方形有两组相等的边，所以长 $8$ 厘米、宽 $5$ 厘米的长方形周长是 $2 \\cdot 8 + 2 \\cdot 5 = 26$ 厘米。边长为 $s$ 的正方形周长是 $4s$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const [l, w] = [rng.int(4, 20), rng.int(2, 12)];
          const square = l === w;
          const p = 2 * (l + w);
          return {
            ...numberProblem({
              prompt: t(`Find the perimeter of the ${square ? "square" : "rectangle"}.`, `求这个${square ? "正方形" : "长方形"}的周长。`),
              answer: p,
              form: "integer",
              unit: u,
              wrong: [l + w, l * w, 2 * l + w],
              solution: t(
                `Opposite sides of a rectangle are equal, so the sides are $${l}$, $${w}$, $${l}$ and $${w}$:${steps(`P = 2 \\cdot ${l} + 2 \\cdot ${w} = ${tex(p, u)}`)}`,
                `长方形的对边相等，所以四条边是 $${l}$、$${w}$、$${l}$、$${w}$：${steps(`P = 2 \\cdot ${l} + 2 \\cdot ${w} = ${tex(p, u)}`)}`,
              ),
            }),
            figure: figure(
              [{ kind: "polygon", points: rectangle(l, w) }, ...sides(rectangle(l, w), [len(l, u), len(w, u), null, null])],
              `A rectangle ${l} ${u} long and ${w} ${u} wide.`,
              `一个长 ${l} ${u}、宽 ${w} ${u} 的长方形。`,
            ),
          };
        }
        const [points, lengths] = kind === 1 ? scaleneTriangle(rng) : trapezoid(rng);
        const p = lengths.reduce((s, v) => s + v, 0);
        const name = kind === 1 ? t("triangle", "三角形") : t("quadrilateral", "四边形");
        return {
          ...numberProblem({
            prompt: t(`Find the perimeter of the ${name.en}.`, `求这个${name["zh-CN"]}的周长。`),
            answer: p,
            form: "integer",
            unit: u,
            wrong: [p - lengths[0]!, p + lengths[0]!, lengths.reduce((s, v) => s * v, 1)],
            solution: t(
              `Add the side lengths:${steps(`P = ${lengths.join(" + ")} = ${tex(p, u)}`)}`,
              `把各边长相加：${steps(`P = ${lengths.join(" + ")} = ${tex(p, u)}`)}`,
            ),
          }),
          figure: figure(
            [
              { kind: "polygon", points },
              ...sides(
                points,
                lengths.map((v) => len(v, u)),
              ),
            ],
            `A ${name.en} with sides ${lengths.map((v) => len(v, u)).join(", ")}.`,
            `一个${name["zh-CN"]}，各边长为 ${lengths.map((v) => len(v, u)).join("、")}。`,
          ),
        };
      },
    },
    {
      id: "missing-side-from-perimeter",
      title: t("A missing side", "求未知边长"),
      explanation: t(
        "Knowing the perimeter, you can find a missing side. For a rectangle, half the perimeter is one length plus one width.\n\nA rectangle with perimeter $30$ m and width $6$ m has $l + 6 = 15$, so its length is $9$ m. A square with perimeter $36$ m has side $36 \\div 4 = 9$ m.",
        "已知周长，就可以求出未知的边长。长方形周长的一半等于一个长加一个宽。\n\n周长 $30$ 米、宽 $6$ 米的长方形满足 $l + 6 = 15$，所以长是 $9$ 米。周长 $36$ 米的正方形边长是 $36 \\div 4 = 9$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        if (rng.bool(0.25)) {
          const s = rng.int(3, 25);
          return numberProblem({
            prompt: t(
              `A square has a perimeter of $${tex(4 * s, u)}$. How long is each side?`,
              `一个正方形的周长是 $${tex(4 * s, u)}$。它的边长是多少？`,
            ),
            answer: s,
            form: "integer",
            unit: u,
            wrong: [2 * s, 4 * s - 4, 16 * s],
            solution: t(
              `A square has four equal sides:${steps(`s = ${4 * s} \\div 4 = ${tex(s, u)}`)}`,
              `正方形的四条边相等：${steps(`s = ${4 * s} \\div 4 = ${tex(s, u)}`)}`,
            ),
          });
        }
        const w = rng.int(2, 15);
        const l = w + rng.int(1, 12);
        const p = 2 * (l + w);
        return numberProblem({
          prompt: t(
            `A rectangle has a perimeter of $${tex(p, u)}$ and a width of $${tex(w, u)}$. What is its length?`,
            `一个长方形的周长是 $${tex(p, u)}$，宽是 $${tex(w, u)}$。它的长是多少？`,
          ),
          answer: l,
          form: "integer",
          unit: u,
          wrong: [p - w, p - 2 * w, p / 2, intOr(p - w, 2, p - 2 * w + 1)],
          solution: t(
            `Half the perimeter is one length plus one width:${steps(`l + ${w} = ${p} \\div 2 = ${p / 2}`, `l = ${p / 2} - ${w} = ${tex(l, u)}`)}`,
            `周长的一半等于一个长加一个宽：${steps(`l + ${w} = ${p} \\div 2 = ${p / 2}`, `l = ${p / 2} - ${w} = ${tex(l, u)}`)}`,
          ),
        });
      },
    },
  ],
};

export const areaOfRectanglesAndSquares: TopicDef = {
  id: "area-of-rectangles-and-squares",
  title: t("Area of Rectangles and Squares", "长方形与正方形的面积"),
  summary: t(
    "Find the area of rectangles and squares, and a missing side from the area.",
    "求长方形和正方形的面积，以及由面积求未知边长。",
  ),
  prerequisites: ["perimeter"],
  encompasses: [],
  xp: 6,
  standards: ["CCSS.3.MD.C.7"],
  knowledgePoints: [
    {
      id: "area-of-a-rectangle",
      title: t("Area of a rectangle", "长方形的面积"),
      explanation: t(
        "The **area** of a shape is how many unit squares it takes to cover it. It is measured in square units, such as square centimeters ($\\text{cm}^2$).\n\nA rectangle $l$ long and $w$ wide is covered by $w$ rows of $l$ unit squares, so its area is\n\n$$A = l \\cdot w.$$\n\nA rectangle $8$ cm by $5$ cm has area $40\\text{ cm}^2$; a square with side $s$ has area $s^2$. Do not confuse area with perimeter: the same rectangle's perimeter is $26$ cm.",
        "图形的**面积**是铺满它需要的单位正方形的个数，用平方厘米（$\\text{cm}^2$）等面积单位计量。\n\n长 $l$、宽 $w$ 的长方形可以铺 $w$ 行、每行 $l$ 个单位正方形，所以面积是\n\n$$A = l \\cdot w.$$\n\n长 $8$ 厘米、宽 $5$ 厘米的长方形面积是 $40\\text{ cm}^2$；边长为 $s$ 的正方形面积是 $s^2$。不要把面积和周长混淆：同一个长方形的周长是 $26$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const square = rng.bool(0.25);
        const w = rng.int(2, 15);
        const l = square ? w : w + rng.int(1, 12);
        const a = l * w;
        const shape = square ? t("square", "正方形") : t("rectangle", "长方形");
        return {
          ...numberProblem({
            prompt: t(`Find the area of the ${shape.en}.`, `求这个${shape["zh-CN"]}的面积。`),
            answer: a,
            form: "integer",
            unit: `${u}^2`,
            wrong: [2 * (l + w), l + w, square ? 4 * l : 2 * a],
            solution: square
              ? t(
                  `The area of a square is its side squared:${steps(`A = ${l}^2 = ${tex(a, u, 2)}`)}`,
                  `正方形的面积是边长的平方：${steps(`A = ${l}^2 = ${tex(a, u, 2)}`)}`,
                )
              : t(
                  `Multiply the length by the width:${steps(`A = ${l} \\cdot ${w} = ${tex(a, u, 2)}`)}`,
                  `长乘宽：${steps(`A = ${l} \\cdot ${w} = ${tex(a, u, 2)}`)}`,
                ),
          }),
          figure: figure(
            [
              { kind: "polygon", points: rectangle(l, w) },
              { kind: "right", vertex: [0, 0], from: [l, 0], to: [0, w] },
              ...(square
                ? [{ kind: "ticks", a: [0, 0], b: [l, 0], count: 1 } as const, { kind: "ticks", a: [l, 0], b: [l, w], count: 1 } as const]
                : []),
              ...sides(rectangle(l, w), [len(l, u), square ? null : len(w, u), null, null]),
            ],
            square ? `A square with side ${l} ${u}.` : `A rectangle ${l} ${u} long and ${w} ${u} wide.`,
            square ? `一个边长 ${l} ${u} 的正方形。` : `一个长 ${l} ${u}、宽 ${w} ${u} 的长方形。`,
          ),
        };
      },
    },
    {
      id: "missing-side-from-area",
      title: t("A missing side from the area", "由面积求边长"),
      explanation: t(
        "Since $A = l \\cdot w$, a missing side is the area divided by the known side: $l = A \\div w$.\n\nA rectangle with area $48\\text{ m}^2$ and width $6$ m is $48 \\div 6 = 8$ m long. A square with area $49\\text{ m}^2$ has side $7$ m, since $7^2 = 49$.",
        "由于 $A = l \\cdot w$，未知的边长等于面积除以已知边长：$l = A \\div w$。\n\n面积 $48\\text{ m}^2$、宽 $6$ 米的长方形长 $48 \\div 6 = 8$ 米。面积 $49\\text{ m}^2$ 的正方形边长是 $7$ 米，因为 $7^2 = 49$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        if (rng.bool(0.3)) {
          const s = rng.int(2, 15);
          return numberProblem({
            prompt: t(
              `A square has an area of $${tex(s * s, u, 2)}$. How long is each side?`,
              `一个正方形的面积是 $${tex(s * s, u, 2)}$。它的边长是多少？`,
            ),
            answer: s,
            form: "integer",
            unit: u,
            wrong: [intOr(s * s, 2, s + 1), intOr(s * s, 4, s - 1), s * s],
            solution: t(
              `The side squared is the area, and $${s}^2 = ${s * s}$:${steps(`s = ${tex(s, u)}`)}`,
              `边长的平方等于面积，而 $${s}^2 = ${s * s}$：${steps(`s = ${tex(s, u)}`)}`,
            ),
          });
        }
        const w = rng.int(2, 12);
        const l = w + rng.int(1, 12);
        const a = l * w;
        return numberProblem({
          prompt: t(
            `A rectangle has an area of $${tex(a, u, 2)}$ and a width of $${tex(w, u)}$. What is its length?`,
            `一个长方形的面积是 $${tex(a, u, 2)}$，宽是 $${tex(w, u)}$。它的长是多少？`,
          ),
          answer: l,
          form: "integer",
          unit: u,
          wrong: [a - w, intOr(a, 2, a - 2 * w) - w, intOr(a - 2 * w, 2, a * w)],
          solution: t(
            `Divide the area by the width:${steps(`l = ${a} \\div ${w} = ${tex(l, u)}`)}`,
            `面积除以宽：${steps(`l = ${a} \\div ${w} = ${tex(l, u)}`)}`,
          ),
        });
      },
    },
  ],
};

/** parallelogramFigure draws a parallelogram with base b, leaning over o at height h, its height dashed. */
function parallelogramFigure(
  b: number,
  o: number,
  h: number,
  labels: readonly [string | null, string | null, string],
  en: string,
  zh: string,
): Figure {
  const points: Point[] = [
    [0, 0],
    [b, 0],
    [b + o, h],
    [o, h],
  ];
  return figure(
    [{ kind: "polygon", points }, ...sides(points, [labels[0], null, null, labels[1]]), ...height([o, h], [o, 0], [b, 0], labels[2])],
    en,
    zh,
  );
}

export const areaOfParallelograms: TopicDef = {
  id: "area-of-parallelograms",
  title: t("Area of Parallelograms", "平行四边形的面积"),
  summary: t("Find the area of a parallelogram from its base and height.", "由底和高求平行四边形的面积。"),
  prerequisites: ["area-of-rectangles-and-squares"],
  encompasses: [{ topic: "area-of-rectangles-and-squares", weight: 0.5 }],
  xp: 8,
  standards: ["CCSS.6.G.A.1"],
  knowledgePoints: [
    {
      id: "base-times-height",
      title: t("Base times height", "底乘高"),
      explanation: t(
        "Cut the triangle off one end of a parallelogram and move it to the other end: the parallelogram becomes a rectangle with the same base and the same height. So\n\n$$A = b \\cdot h,$$\n\nwhere the **height** $h$ is measured at a right angle to the base, not along the slanted side. A parallelogram with base $10$ cm, slanted side $5$ cm and height $4$ cm has area $10 \\cdot 4 = 40\\text{ cm}^2$.",
        "把平行四边形一端的三角形剪下，移到另一端，就得到一个底和高都不变的长方形。所以\n\n$$A = b \\cdot h,$$\n\n其中**高** $h$ 要垂直于底来量，而不是沿斜边量。底 $10$ 厘米、斜边 $5$ 厘米、高 $4$ 厘米的平行四边形面积是 $10 \\cdot 4 = 40\\text{ cm}^2$。",
      ),
      figure: parallelogramFigure(
        10,
        3,
        4,
        ["b", null, "h"],
        "A parallelogram with base b and its height h dashed, at a right angle to the base.",
        "一个平行四边形，底为 b，高 h 用虚线画出，与底垂直。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [o, h, c] = rng.pick(triples);
        const b = o + rng.int(2, 15);
        const a = b * h;
        return {
          ...numberProblem({
            prompt: t("Find the area of the parallelogram.", "求这个平行四边形的面积。"),
            answer: a,
            form: "integer",
            unit: `${u}^2`,
            wrong: [b * c, 2 * (b + c), (b * h) / 2 === Math.floor((b * h) / 2) ? (b * h) / 2 : b + h],
            solution: t(
              `Use the height, at a right angle to the base, not the slanted side:${steps(`A = b \\cdot h = ${b} \\cdot ${h} = ${tex(a, u, 2)}`)}`,
              `用与底垂直的高，而不是斜边：${steps(`A = b \\cdot h = ${b} \\cdot ${h} = ${tex(a, u, 2)}`)}`,
            ),
          }),
          figure: parallelogramFigure(
            b,
            o,
            h,
            [len(b, u), len(c, u), len(h, u)],
            `A parallelogram with base ${b} ${u}, slanted side ${c} ${u} and height ${h} ${u}.`,
            `一个平行四边形，底 ${b} ${u}，斜边 ${c} ${u}，高 ${h} ${u}。`,
          ),
        };
      },
    },
    {
      id: "missing-base-or-height",
      title: t("A missing base or height", "求底或高"),
      explanation: t(
        "Since $A = b \\cdot h$, a missing base or height is the area divided by the other: $h = A \\div b$ and $b = A \\div h$.\n\nA parallelogram with area $54\\text{ m}^2$ and base $9$ m has height $54 \\div 9 = 6$ m.",
        "由于 $A = b \\cdot h$，未知的底或高等于面积除以另一个：$h = A \\div b$，$b = A \\div h$。\n\n面积 $54\\text{ m}^2$、底 $9$ 米的平行四边形高是 $54 \\div 9 = 6$ 米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [b, h] = [rng.int(3, 20), rng.int(2, 15)];
        const a = b * h;
        const askHeight = rng.bool();
        const [known, asked] = askHeight ? [b, h] : [h, b];
        const [knownName, askedName] = askHeight ? [t("base", "底"), t("height", "高")] : [t("height", "高"), t("base", "底")];
        return numberProblem({
          prompt: t(
            `A parallelogram has an area of $${tex(a, u, 2)}$ and a ${knownName.en} of $${tex(known, u)}$. What is its ${askedName.en}?`,
            `一个平行四边形的面积是 $${tex(a, u, 2)}$，${knownName["zh-CN"]}是 $${tex(known, u)}$。它的${askedName["zh-CN"]}是多少？`,
          ),
          answer: asked,
          form: "integer",
          unit: u,
          wrong: [a - known, intOr(2 * a, known, a), intOr(a, 2 * known, a - known - 1)],
          solution: t(
            `Divide the area by the ${knownName.en}:${steps(`${askHeight ? "h" : "b"} = ${a} \\div ${known} = ${tex(asked, u)}`)}`,
            `面积除以${knownName["zh-CN"]}：${steps(`${askHeight ? "h" : "b"} = ${a} \\div ${known} = ${tex(asked, u)}`)}`,
          ),
        });
      },
    },
  ],
};

export const areaOfTriangles: TopicDef = {
  id: "area-of-triangles",
  title: t("Area of Triangles", "三角形的面积"),
  summary: t("Find the area of a triangle from its base and height.", "由底和高求三角形的面积。"),
  prerequisites: ["area-of-parallelograms"],
  encompasses: [{ topic: "area-of-parallelograms", weight: 0.5 }],
  xp: 8,
  standards: ["CCSS.6.G.A.1"],
  knowledgePoints: [
    {
      id: "half-base-times-height",
      title: t("Half base times height", "底乘高除以二"),
      explanation: t(
        "Two copies of a triangle fit together into a parallelogram with the same base and height, so the triangle has half its area:\n\n$$A = \\tfrac{1}{2} b h.$$\n\nThe height is measured at a right angle to the base, from the opposite vertex. In a right triangle the two legs are a base and its height. A triangle with base $10$ cm and height $7$ cm has area $\\tfrac{1}{2} \\cdot 10 \\cdot 7 = 35\\text{ cm}^2$.",
        "两个完全一样的三角形可以拼成一个底和高都相同的平行四边形，所以三角形的面积是它的一半：\n\n$$A = \\tfrac{1}{2} b h.$$\n\n高是从对顶点垂直于底量出的。直角三角形的两条直角边就是一组底和高。底 $10$ 厘米、高 $7$ 厘米的三角形面积是 $\\tfrac{1}{2} \\cdot 10 \\cdot 7 = 35\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        let b = rng.int(3, 20);
        const h = rng.int(2, 16);
        if ((b * h) % 2 === 1) b += 1;
        const a = (b * h) / 2;
        const solution = t(
          `Half the base times the height:${steps(`A = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${tex(a, u, 2)}`)}`,
          `底乘高除以二：${steps(`A = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${tex(a, u, 2)}`)}`,
        );
        if (rng.bool(0.35)) {
          const points: Point[] = [
            [0, 0],
            [b, 0],
            [0, h],
          ];
          return {
            ...numberProblem({
              prompt: t("Find the area of the right triangle.", "求这个直角三角形的面积。"),
              answer: a,
              form: "integer",
              unit: `${u}^2`,
              wrong: [b * h, b + h, 2 * a + b],
              solution,
            }),
            figure: figure(
              [
                { kind: "polygon", points },
                { kind: "right", vertex: [0, 0], from: [b, 0], to: [0, h] },
                ...sides(points, [len(b, u), null, len(h, u)]),
              ],
              `A right triangle with legs ${b} ${u} and ${h} ${u}.`,
              `一个直角三角形，两条直角边为 ${b} ${u} 和 ${h} ${u}。`,
            ),
          };
        }
        const [o, hh, c] = rng.pick(triples);
        const scale = h / hh;
        const apex: Point = [Math.min(o * scale, b - 1), h];
        const slant = Math.abs(apex[0] - o * scale) < 1e-9 ? c * scale : null;
        const points: Point[] = [[0, 0], [b, 0], apex];
        return {
          ...numberProblem({
            prompt: t("Find the area of the triangle.", "求这个三角形的面积。"),
            answer: a,
            form: "integer",
            unit: `${u}^2`,
            wrong: [b * h, ...(slant !== null && Number.isInteger(slant) ? [intOr(b * slant, 2, b * slant)] : []), b + h],
            solution,
          }),
          figure: figure(
            [
              { kind: "polygon", points },
              ...sides(points, [len(b, u), null, slant !== null && Number.isInteger(slant) ? len(slant, u) : null]),
              ...height(apex, [apex[0], 0], [b, 0], len(h, u)),
            ],
            `A triangle with base ${b} ${u} and height ${h} ${u}.`,
            `一个三角形，底 ${b} ${u}，高 ${h} ${u}。`,
          ),
        };
      },
    },
    {
      id: "missing-base-or-height-of-a-triangle",
      title: t("A missing base or height", "求底或高"),
      explanation: t(
        "Since $A = \\tfrac{1}{2} b h$, doubling the area gives $b h$; then divide by the known length. A triangle with area $30\\text{ cm}^2$ and base $12$ cm has $12h = 60$, so its height is $5$ cm.",
        "由于 $A = \\tfrac{1}{2} b h$，把面积乘以 2 得 $b h$，再除以已知的长度。面积 $30\\text{ cm}^2$、底 $12$ 厘米的三角形满足 $12h = 60$，所以高是 $5$ 厘米。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        let b = rng.int(3, 20);
        const h = rng.int(2, 16);
        if ((b * h) % 2 === 1) b += 1;
        const a = (b * h) / 2;
        const askHeight = rng.bool();
        const [known, asked] = askHeight ? [b, h] : [h, b];
        const [knownName, askedName] = askHeight ? [t("base", "底"), t("height", "高")] : [t("height", "高"), t("base", "底")];
        return numberProblem({
          prompt: t(
            `A triangle has an area of $${tex(a, u, 2)}$ and a ${knownName.en} of $${tex(known, u)}$. What is its ${askedName.en}?`,
            `一个三角形的面积是 $${tex(a, u, 2)}$，${knownName["zh-CN"]}是 $${tex(known, u)}$。它的${askedName["zh-CN"]}是多少？`,
          ),
          answer: asked,
          form: "integer",
          unit: u,
          wrong: [intOr(a, known, 4 * a), 4 * a === known ? a : intOr(4 * a, known, 2 * a), 2 * a - known],
          solution: t(
            `Double the area to get the base times the height, then divide by the ${knownName.en}:${steps(`${known} \\cdot ${askHeight ? "h" : "b"} = 2 \\cdot ${a} = ${2 * a}`, `${askHeight ? "h" : "b"} = ${2 * a} \\div ${known} = ${tex(asked, u)}`)}`,
            `面积乘以 2 得到底乘高，再除以${knownName["zh-CN"]}：${steps(`${known} \\cdot ${askHeight ? "h" : "b"} = 2 \\cdot ${a} = ${2 * a}`, `${askHeight ? "h" : "b"} = ${2 * a} \\div ${known} = ${tex(asked, u)}`)}`,
          ),
        });
      },
    },
  ],
};

export const areaOfTrapezoids: TopicDef = {
  id: "area-of-trapezoids",
  title: t("Area of Trapezoids", "梯形的面积"),
  summary: t("Find the area of a trapezoid from its two bases and its height.", "由上下底和高求梯形的面积。"),
  prerequisites: ["area-of-triangles"],
  encompasses: [{ topic: "area-of-triangles", weight: 0.4 }],
  xp: 8,
  standards: ["CCSS.6.G.A.1"],
  knowledgePoints: [
    {
      id: "the-trapezoid-formula",
      title: t("The trapezoid formula", "梯形面积公式"),
      explanation: t(
        "A **trapezoid** has one pair of parallel sides, its **bases** $b_1$ and $b_2$; the height $h$ is the distance between them. Two copies of a trapezoid, one turned over, make a parallelogram with base $b_1 + b_2$, so\n\n$$A = \\tfrac{1}{2} (b_1 + b_2) h.$$\n\nA trapezoid with bases $6$ m and $10$ m and height $4$ m has area $\\tfrac{1}{2} \\cdot 16 \\cdot 4 = 32\\text{ m}^2$.",
        "**梯形**有一组平行的边，叫它的**上底** $b_1$ 和**下底** $b_2$；高 $h$ 是它们之间的距离。两个完全一样的梯形，一个倒过来，拼成底为 $b_1 + b_2$ 的平行四边形，所以\n\n$$A = \\tfrac{1}{2} (b_1 + b_2) h.$$\n\n上下底为 $6$ 米和 $10$ 米、高 $4$ 米的梯形面积是 $\\tfrac{1}{2} \\cdot 16 \\cdot 4 = 32\\text{ m}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        for (;;) {
          const top = rng.int(3, 14);
          const bottom = top + rng.int(2, 12);
          const h = rng.int(2, 12);
          if (((top + bottom) * h) % 2 === 1) continue;
          const a = ((top + bottom) * h) / 2;
          const o = rng.bool(0.3) ? 0 : rng.int(1, bottom - top - 1 || 1);
          const points: Point[] = [
            [0, 0],
            [bottom, 0],
            [o + top, h],
            [o, h],
          ];
          return {
            ...numberProblem({
              prompt: t("Find the area of the trapezoid.", "求这个梯形的面积。"),
              answer: a,
              form: "integer",
              unit: `${u}^2`,
              wrong: [(top + bottom) * h, top * bottom * h, top + bottom + h, bottom * h],
              solution: t(
                `Average the bases and multiply by the height:${steps(`A = \\tfrac{1}{2} (${top} + ${bottom}) \\cdot ${h} = \\tfrac{1}{2} \\cdot ${top + bottom} \\cdot ${h} = ${tex(a, u, 2)}`)}`,
                `两底之和乘以高再除以二：${steps(`A = \\tfrac{1}{2} (${top} + ${bottom}) \\cdot ${h} = \\tfrac{1}{2} \\cdot ${top + bottom} \\cdot ${h} = ${tex(a, u, 2)}`)}`,
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points },
                ...sides(points, [len(bottom, u), null, len(top, u), null]),
                ...(o === 0
                  ? [
                      { kind: "right", vertex: [0, 0], from: [bottom, 0], to: [0, h] } as const,
                      { kind: "side", a: [o, h], b: [0, 0], text: len(h, u) } as const,
                    ]
                  : height([o, h], [o, 0], [bottom, 0], len(h, u))),
              ],
              `A trapezoid with bases ${top} ${u} and ${bottom} ${u} and height ${h} ${u}.`,
              `一个梯形，上底 ${top} ${u}，下底 ${bottom} ${u}，高 ${h} ${u}。`,
            ),
          };
        }
      },
    },
  ],
};

/** lShape is an L-shaped hexagon: a w by h rectangle with a cw by ch rectangle cut from its top right corner. */
const lShape = (w: number, h: number, cw: number, ch: number): Point[] => [
  [0, 0],
  [w, 0],
  [w, h - ch],
  [w - cw, h - ch],
  [w - cw, h],
  [0, h],
];

export const compositeShapes: TopicDef = {
  id: "composite-shapes",
  title: t("Composite Shapes", "组合图形"),
  summary: t("Find the area and perimeter of shapes made of rectangles and triangles.", "求由长方形和三角形组成的图形的面积和周长。"),
  prerequisites: ["area-of-triangles"],
  encompasses: [
    { topic: "area-of-triangles", weight: 0.4 },
    { topic: "area-of-rectangles-and-squares", weight: 0.6 },
    { topic: "perimeter", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.6.G.A.1", "CCSS.7.G.B.6"],
  knowledgePoints: [
    {
      id: "area-of-composite-shapes",
      title: t("Area by splitting", "分割求面积"),
      explanation: t(
        "To find the area of a shape made of simpler pieces, split it into rectangles and triangles, find each area, and add. Missing lengths come from the given ones: in an L-shape, the full width is the sum of the widths of the parts.\n\nYou can also subtract: an L-shape is a big rectangle with a corner rectangle removed.",
        "求由简单图形组成的图形面积时，把它分成长方形和三角形，分别求面积再相加。缺少的长度由已知长度推出：L 形中，整体的宽等于各部分的宽之和。\n\n也可以用减法：L 形是大长方形去掉一角的小长方形。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        if (rng.bool(0.4)) {
          let w = rng.int(4, 14);
          const h = rng.int(3, 10);
          const roof = rng.int(2, 8);
          if ((w * roof) % 2 === 1) w += 1;
          const [rect, tri] = [w * h, (w * roof) / 2];
          const points: Point[] = [
            [0, 0],
            [w, 0],
            [w, h],
            [w / 2, h + roof],
            [0, h],
          ];
          return {
            ...numberProblem({
              prompt: t("Find the area of the shape: a rectangle with a triangle on top.", "求这个图形的面积：长方形上面是一个三角形。"),
              answer: rect + tri,
              form: "integer",
              unit: `${u}^2`,
              wrong: [rect + 2 * tri, w * (h + roof), rect],
              solution: t(
                `Add the rectangle and the triangle:${steps(`${w} \\cdot ${h} + \\tfrac{1}{2} \\cdot ${w} \\cdot ${roof} = ${rect} + ${tri} = ${tex(rect + tri, u, 2)}`)}`,
                `长方形与三角形的面积相加：${steps(`${w} \\cdot ${h} + \\tfrac{1}{2} \\cdot ${w} \\cdot ${roof} = ${rect} + ${tri} = ${tex(rect + tri, u, 2)}`)}`,
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points },
                { kind: "segment", a: [0, h], b: [w, h], dashed: true },
                ...sides(points, [len(w, u), len(h, u), null, null, null]),
                ...height([w / 2, h + roof], [w / 2, h], [w, h], len(roof, u)),
              ],
              `A rectangle ${w} ${u} wide and ${h} ${u} tall with a triangle ${roof} ${u} tall on top.`,
              `一个宽 ${w} ${u}、高 ${h} ${u} 的长方形，上面是一个高 ${roof} ${u} 的三角形。`,
            ),
          };
        }
        const w = rng.int(6, 16);
        const h = rng.int(5, 14);
        const cw = rng.int(2, w - 2);
        const ch = rng.int(2, h - 2);
        const area = w * h - cw * ch;
        const points = lShape(w, h, cw, ch);
        return {
          ...numberProblem({
            prompt: t("Find the area of the shape. All corners are right angles.", "求这个图形的面积。所有的角都是直角。"),
            answer: area,
            form: "integer",
            unit: `${u}^2`,
            wrong: [w * h, 2 * (w + h), w * h - (w - cw) * (h - ch), area + cw * ch - (w - cw) * ch],
            solution: t(
              `The shape is a ${w} by ${h} rectangle with a ${cw} by ${ch} corner removed, since $${w} - ${w - cw} = ${cw}$ and $${h} - ${h - ch} = ${ch}$:${steps(`A = ${w} \\cdot ${h} - ${cw} \\cdot ${ch} = ${w * h} - ${cw * ch} = ${tex(area, u, 2)}`)}`,
              `这个图形是 ${w} 乘 ${h} 的长方形去掉 ${cw} 乘 ${ch} 的一角，因为 $${w} - ${w - cw} = ${cw}$，$${h} - ${h - ch} = ${ch}$：${steps(`A = ${w} \\cdot ${h} - ${cw} \\cdot ${ch} = ${w * h} - ${cw * ch} = ${tex(area, u, 2)}`)}`,
            ),
          }),
          figure: figure(
            [{ kind: "polygon", points }, ...sides(points, [len(w, u), len(h - ch, u), null, null, len(w - cw, u), len(h, u)])],
            `An L-shape: ${w} ${u} wide at the bottom, ${h} ${u} tall on the left, ${w - cw} ${u} wide at the top and ${h - ch} ${u} tall on the right.`,
            `一个 L 形：底边宽 ${w} ${u}，左边高 ${h} ${u}，顶边宽 ${w - cw} ${u}，右边高 ${h - ch} ${u}。`,
          ),
        };
      },
    },
    {
      id: "perimeter-of-composite-shapes",
      title: t("Perimeter with missing sides", "求有未知边的周长"),
      explanation: t(
        "To find a perimeter, every side needs a length. In a shape whose corners are all right angles, the horizontal sides on the top add up to the bottom, and the vertical sides on the left add up to the right.\n\nIn an L-shape $12$ wide and $9$ tall, the two short sides of the notch are found by subtraction, and the perimeter is $2 \\cdot 12 + 2 \\cdot 9 = 42$, whatever the notch's size.",
        "求周长，每条边都要有长度。在所有角都是直角的图形中，上方的水平边之和等于底边，左侧的竖直边之和等于右侧。\n\n在宽 $12$、高 $9$ 的 L 形中，缺口的两条短边用减法求出，周长是 $2 \\cdot 12 + 2 \\cdot 9 = 42$，与缺口大小无关。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const w = rng.int(6, 16);
        const h = rng.int(5, 14);
        const cw = rng.int(2, w - 2);
        const ch = rng.int(2, h - 2);
        const p = 2 * (w + h);
        const shown = w + (h - ch) + (w - cw) + h;
        const points = lShape(w, h, cw, ch);
        return {
          ...numberProblem({
            prompt: t("Find the perimeter of the shape. All corners are right angles.", "求这个图形的周长。所有的角都是直角。"),
            answer: p,
            form: "integer",
            unit: u,
            wrong: [shown, w * h - cw * ch, p - cw - ch],
            solution: t(
              `The two unlabeled sides are $${w} - ${w - cw} = ${cw}$ and $${h} - ${h - ch} = ${ch}$. Add all six sides:${steps(`P = ${w} + ${h - ch} + ${cw} + ${ch} + ${w - cw} + ${h} = ${tex(p, u)}`)}`,
              `两条未标出的边是 $${w} - ${w - cw} = ${cw}$ 和 $${h} - ${h - ch} = ${ch}$。六条边相加：${steps(`P = ${w} + ${h - ch} + ${cw} + ${ch} + ${w - cw} + ${h} = ${tex(p, u)}`)}`,
            ),
          }),
          figure: figure(
            [{ kind: "polygon", points }, ...sides(points, [len(w, u), len(h - ch, u), null, null, len(w - cw, u), len(h, u)])],
            `An L-shape: ${w} ${u} wide at the bottom, ${h} ${u} tall on the left, ${w - cw} ${u} wide at the top and ${h - ch} ${u} tall on the right; the two sides of the notch are unlabeled.`,
            `一个 L 形：底边宽 ${w} ${u}，左边高 ${h} ${u}，顶边宽 ${w - cw} ${u}，右边高 ${h - ch} ${u}；缺口的两条边未标出。`,
          ),
        };
      },
    },
  ],
};

/** areaTopics are the topics on perimeter and area. */
export const areaTopics: readonly TopicDef[] = [
  perimeter,
  areaOfRectanglesAndSquares,
  areaOfParallelograms,
  areaOfTriangles,
  areaOfTrapezoids,
  compositeShapes,
];
