import type { Figure, Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, Q, sketch } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { remainingDrawings4 } from "../explanation-drawings-remaining-4.ts";
import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";

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
export function sides(points: readonly Point[], labels: readonly (string | null)[]): Mark[] {
  return points.flatMap((a, i): Mark[] => {
    const text = labels[i];
    return text == null ? [] : [{ kind: "side", a, b: points[(i + 1) % points.length]!, text }];
  });
}

/** rectangle is the corners of an l by w rectangle, counterclockwise from the origin. */
export const rectangle = (l: number, w: number): Point[] => [
  [0, 0],
  [l, 0],
  [l, w],
  [0, w],
];

/** height marks a dashed height from apex down to foot, with a right angle at the foot toward toward. */
export function height(apex: Point, foot: Point, toward: Point, label: string): Mark[] {
  return [
    { kind: "segment", a: apex, b: foot, dashed: true, accent: true },
    { kind: "right", vertex: foot, from: apex, to: toward },
    { kind: "side", a: foot, b: apex, text: label },
  ];
}

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const _intOr = (a: number, b: number, fallback: number) => (Number.isInteger(a / b) ? a / b : fallback);

/** scaleneTriangle draws a triangle to scale with whole-number sides, the longest at the bottom. */
export function scaleneTriangle(rng: Rng): [Point[], number[]] {
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

/** perimeter adds the sides of a polygon, and works back from a perimeter to a missing side. */
export const perimeter: TopicDef = withIntro(
  {
    id: "perimeter",
    title: t("The Perimeter of a Polygon", "多边形的周长"),
    summary: t("Find the perimeter of polygons, and a missing side from the perimeter.", "求多边形的周长，以及由周长求未知边长。"),
    prerequisites: [],
    encompasses: [],
    xp: 6,
    standards: ["CCSS.3.MD.D.8"],
    knowledgePoints: [
      lesson(
        "perimeter-of-polygons",
        ["Perimeter of a polygon", "多边形的周长"],
        [
          [
            "The **perimeter** of a polygon is the distance all the way around it: the sum of its side lengths. It is a length, measured in units such as centimeters. A rectangle has two pairs of equal sides, so a rectangle $8$ cm long and $5$ cm wide has perimeter $8 + 5 + 8 + 5 = 26$ cm, or $2 \\cdot 8 + 2 \\cdot 5$.",
            "多边形的**周长**是绕它一整圈的长度，即各边长之和。周长是长度，用厘米等单位计量。长方形有两组相等的边，所以长 $8$ 厘米、宽 $5$ 厘米的长方形周长是 $8 + 5 + 8 + 5 = 26$ 厘米，也就是 $2 \\cdot 8 + 2 \\cdot 5$。",
          ],
          [
            "Half way around is one length and one width, $8 + 5 = 13$, and twice that is $26$.",
            "走半圈是一个长加一个宽，$8 + 5 = 13$，两倍就是 $26$。",
          ],
          [
            "Count every side, including the ones without a number: a rectangle shows two sides, but it has four.",
            "每条边都要算上，包括没标数的边：长方形只标出两条边，但它有四条。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const kind = rng.int(0, 2);
          if (kind === 0) {
            const [l, w] = [rng.int(4, 20), rng.int(2, 12)];
            const square = l === w;
            const p = 2 * (l + w);
            return valued(
              [`Find the perimeter of the ${square ? "square" : "rectangle"}.`, `求这个${square ? "正方形" : "长方形"}的周长。`],
              p,
              [
                [
                  ["List the sides", "列出各边"],
                  [
                    `Opposite sides are equal, so the four sides are $${l}$, $${w}$, $${l}$ and $${w}$.`,
                    `对边相等，所以四条边是 $${l}$、$${w}$、$${l}$、$${w}$。`,
                  ],
                ],
                [
                  ["Add them", "相加"],
                  ["The perimeter is the sum of the sides:", "周长是各边之和："],
                  [`P = 2 \\cdot ${l} + 2 \\cdot ${w} = ${tex(p, u)}`],
                ],
              ],
              [
                `Half way around is $${l} + ${w} = ${l + w}$, and twice that is $${p}$.`,
                `走半圈是 $${l} + ${w} = ${l + w}$，两倍是 $${p}$。`,
              ],
              [
                [l + w, "That goes only half way around: one length and one width.", "这只走了半圈：一个长加一个宽。"],
                [l * w, "That multiplies the sides, which gives the area.", "这是把边相乘，得到的是面积。"],
                [2 * l + w, "That leaves out one of the widths.", "这是漏掉了一条宽。"],
              ],
              {
                unit: u,
                figure: figure(
                  [{ kind: "polygon", points: rectangle(l, w) }, ...sides(rectangle(l, w), [len(l, u), len(w, u), null, null])],
                  `A rectangle ${l} ${u} long and ${w} ${u} wide.`,
                  `一个长 ${l} ${u}、宽 ${w} ${u} 的长方形。`,
                ),
              },
            );
          }
          const [points, lengths] = kind === 1 ? scaleneTriangle(rng) : trapezoid(rng);
          const p = lengths.reduce((s, v) => s + v, 0);
          const name: Pair = kind === 1 ? ["triangle", "三角形"] : ["quadrilateral", "四边形"];
          const back = [...lengths].reverse();
          return valued(
            [`Find the perimeter of the ${name[0]}.`, `求这个${name[1]}的周长。`],
            p,
            [
              [
                ["Read the sides", "读出各边"],
                [
                  `The ${name[0]} has ${lengths.length} sides: ${lengths.map((v) => `$${v}$`).join(", ")}.`,
                  `这个${name[1]}有 ${lengths.length} 条边：${lengths.map((v) => `$${v}$`).join("、")}。`,
                ],
              ],
              [
                ["Add them", "相加"],
                ["The perimeter is the sum of the sides:", "周长是各边之和："],
                [`P = ${lengths.join(" + ")} = ${tex(p, u)}`],
              ],
            ],
            [`Add the other way around: $${back.join(" + ")} = ${p}$.`, `反方向再加一遍：$${back.join(" + ")} = ${p}$。`],
            [
              [p - lengths[0]!, "That leaves out the bottom side.", "这是漏掉了底边。"],
              [p + lengths[0]!, "That counts the bottom side twice.", "这是把底边算了两次。"],
              [lengths.reduce((s, v) => s * v, 1), "That multiplies the sides instead of adding them.", "这是把各边相乘了，应该相加。"],
            ],
            {
              unit: u,
              figure: figure(
                [
                  { kind: "polygon", points },
                  ...sides(
                    points,
                    lengths.map((v) => len(v, u)),
                  ),
                ],
                `A ${name[0]} with sides ${lengths.map((v) => len(v, u)).join(", ")}.`,
                `一个${name[1]}，各边长为 ${lengths.map((v) => len(v, u)).join("、")}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["perimeter#perimeter-of-polygons"]),
      ),
      lesson(
        "missing-side-from-perimeter",
        ["A missing side", "求未知边长"],
        [
          [
            "Knowing the perimeter, you can find a missing side. For a rectangle, half the perimeter is one length plus one width: with perimeter $30$ m and width $6$ m, $l + 6 = 15$, so the length is $9$ m. A square has four equal sides, so with perimeter $36$ m each side is $36 \\div 4 = 9$ m.",
            "已知周长，就可以求出未知的边长。长方形周长的一半等于一个长加一个宽：周长 $30$ 米、宽 $6$ 米时，$l + 6 = 15$，所以长是 $9$ 米。正方形四条边相等，所以周长 $36$ 米时每边长 $36 \\div 4 = 9$ 米。",
          ],
          ["Go around the rectangle: $9 + 6 + 9 + 6 = 30$.", "绕长方形走一圈：$9 + 6 + 9 + 6 = 30$。"],
          [
            "Halve the perimeter before taking the width away: $30 - 6 = 24$ still holds two lengths and a width.",
            "要先把周长取一半，再减去宽：$30 - 6 = 24$ 里还有两个长和一个宽。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          if (rng.bool(0.25)) {
            const s = rng.int(3, 25);
            return valued(
              [
                `A square has a perimeter of $${tex(4 * s, u)}$. How long is each side?`,
                `一个正方形的周长是 $${tex(4 * s, u)}$。它的边长是多少？`,
              ],
              s,
              [
                [
                  ["Count the sides", "数边"],
                  ["A square has four equal sides, so the perimeter is shared four ways.", "正方形有四条相等的边，所以周长平均分成四份。"],
                ],
                [
                  ["Divide by 4", "除以 4"],
                  ["Share the perimeter among the sides:", "把周长分给四条边："],
                  [`s = ${4 * s} \\div 4 = ${tex(s, u)}`],
                ],
              ],
              [
                `Half the perimeter is two sides: $${4 * s} \\div 2 = ${2 * s}$, and half of that is $${s}$.`,
                `周长的一半是两条边：$${4 * s} \\div 2 = ${2 * s}$，再取一半是 $${s}$。`,
              ],
              [
                [2 * s, "That divides by $2$, but a square has four sides.", "这是除以 $2$，但正方形有四条边。"],
                [4 * s - 4, "That subtracts $4$ instead of dividing by $4$.", "这是减去 $4$，应该除以 $4$。"],
                [16 * s, "That multiplies by $4$ instead of dividing.", "这是乘 $4$，应该除以 $4$。"],
              ],
              { unit: u },
            );
          }
          const w = rng.int(2, 15);
          const l = w + rng.int(1, 12);
          const p = 2 * (l + w);
          return valued(
            [
              `A rectangle has a perimeter of $${tex(p, u)}$ and a width of $${tex(w, u)}$. What is its length?`,
              `一个长方形的周长是 $${tex(p, u)}$，宽是 $${tex(w, u)}$。它的长是多少？`,
            ],
            l,
            [
              [
                ["Halve the perimeter", "把周长取一半"],
                ["Half way around is one length and one width:", "走半圈是一个长加一个宽："],
                [`l + ${w} = ${p} \\div 2 = ${p / 2}`],
              ],
              [["Take away the width", "减去宽"], ["Subtract the width:", "减去宽："], [`l = ${p / 2} - ${w} = ${tex(l, u)}`]],
            ],
            [
              `Take both widths off the whole perimeter: $${p} - 2 \\cdot ${w} = ${p - 2 * w}$ is two lengths, and $${p - 2 * w} \\div 2 = ${l}$.`,
              `从整个周长中减去两条宽：$${p} - 2 \\cdot ${w} = ${p - 2 * w}$ 是两个长，$${p - 2 * w} \\div 2 = ${l}$。`,
            ],
            [
              [
                p - w,
                "That takes one width off the whole perimeter, which still holds two lengths and a width.",
                "这是从整个周长中只减去一条宽，剩下的还有两个长和一条宽。",
              ],
              [
                p - 2 * w,
                "That takes off both widths but leaves two lengths; halve it.",
                "这是减去了两条宽，但剩下的是两个长，还要取一半。",
              ],
              [p / 2, "That is one length and one width together.", "这是一个长和一个宽的和。"],
            ],
            { unit: u },
          );
        },
        drawn(gradeDrawings3["perimeter#missing-side-from-perimeter"]),
      ),
    ],
  },
  [
    "To put a ribbon around a picture frame $30$ cm long and $20$ cm wide, you need $30 + 20 + 30 + 20 = 100$ cm of ribbon: the distance all the way around.",
    "要给一个长 $30$ 厘米、宽 $20$ 厘米的相框绕一圈丝带，需要 $30 + 20 + 30 + 20 = 100$ 厘米：这就是绕它一整圈的长度。",
  ],
  ["Half way around is $30 + 20 = 50$ cm, and twice that is $100$ cm.", "走半圈是 $30 + 20 = 50$ 厘米，两倍是 $100$ 厘米。"],
  [
    "find the perimeter of a polygon by adding its sides, and work back from a perimeter to a missing side.",
    "学习把各边相加求多边形的周长，并由周长反推未知的边长。",
  ],
);

/** areaOfRectanglesAndSquares finds the area of a rectangle or square, and a missing side from the area. */
export const areaOfRectanglesAndSquares: TopicDef = withIntro(
  {
    id: "area-of-rectangles-and-squares",
    title: t("Areas of Rectangles and Squares", "长方形和正方形的面积"),
    summary: t(
      "Find the area of rectangles and squares, and a missing side from the area.",
      "求长方形和正方形的面积，以及由面积求未知边长。",
    ),
    prerequisites: ["perimeter"],
    encompasses: [],
    xp: 6,
    standards: ["CCSS.3.MD.C.7"],
    knowledgePoints: [
      lesson(
        "area-of-a-rectangle",
        ["Area of a rectangle", "长方形的面积"],
        [
          [
            "The **area** of a shape is how many unit squares it takes to cover it, measured in square units such as $\\text{cm}^2$. A rectangle $l$ long and $w$ wide is covered by $w$ rows of $l$ unit squares, so its area is $A = l \\cdot w$. A rectangle $8$ cm by $5$ cm has area $8 \\cdot 5 = 40\\text{ cm}^2$; a square with side $s$ has area $s^2$.",
            "图形的**面积**是铺满它需要的单位正方形的个数，用 $\\text{cm}^2$ 等面积单位计量。长 $l$、宽 $w$ 的长方形可以铺 $w$ 行、每行 $l$ 个单位正方形，所以面积是 $A = l \\cdot w$。长 $8$ 厘米、宽 $5$ 厘米的长方形面积是 $8 \\cdot 5 = 40\\text{ cm}^2$；边长为 $s$ 的正方形面积是 $s^2$。",
          ],
          [
            "Split the rectangle into a $4$ by $5$ part and another $4$ by $5$ part: $20 + 20 = 40$.",
            "把长方形分成两个 $4$ 乘 $5$ 的部分：$20 + 20 = 40$。",
          ],
          [
            "Area multiplies the sides; perimeter adds them. The same rectangle has perimeter $26$ cm, not $40$.",
            "面积是边相乘，周长是边相加。同一个长方形的周长是 $26$ 厘米，不是 $40$。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const square = rng.bool(0.25);
          const w = rng.int(2, 15);
          const l = square ? w : w + rng.int(1, 12);
          const a = l * w;
          const shape: Pair = square ? ["square", "正方形"] : ["rectangle", "长方形"];
          const left = Math.floor(l / 2);
          return valued(
            [`Find the area of the ${shape[0]}.`, `求这个${shape[1]}的面积。`],
            a,
            [
              [
                ["See the rows", "看成一行一行"],
                [
                  `The ${shape[0]} holds $${w}$ rows of $${l}$ unit squares.`,
                  `这个${shape[1]}可以铺 $${w}$ 行，每行 $${l}$ 个单位正方形。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                [
                  square ? "The area of a square is its side squared:" : "Multiply the length by the width:",
                  square ? "正方形的面积是边长的平方：" : "长乘宽：",
                ],
                [square ? `A = ${l}^2 = ${tex(a, u, 2)}` : `A = ${l} \\cdot ${w} = ${tex(a, u, 2)}`],
              ],
            ],
            [
              `Split the length into $${left}$ and $${l - left}$: $${left} \\cdot ${w} + ${l - left} \\cdot ${w} = ${left * w} + ${(l - left) * w} = ${a}$.`,
              `把长分成 $${left}$ 和 $${l - left}$：$${left} \\cdot ${w} + ${l - left} \\cdot ${w} = ${left * w} + ${(l - left) * w} = ${a}$。`,
            ],
            [
              [2 * (l + w), "That is the perimeter, the distance around, not the area.", "这是周长，是绕一圈的长度，不是面积。"],
              [l + w, "That adds the length and the width instead of multiplying them.", "这是把长和宽相加了，应该相乘。"],
              square
                ? [4 * l, "That is the perimeter of the square.", "这是正方形的周长。"]
                : [2 * a, "That doubles the area, as if there were two rectangles.", "这是把面积乘了 $2$，好像有两个长方形。"],
            ],
            {
              unit: `${u}^2`,
              figure: figure(
                [
                  { kind: "polygon", points: rectangle(l, w) },
                  { kind: "right", vertex: [0, 0], from: [l, 0], to: [0, w] },
                  ...(square
                    ? [
                        { kind: "ticks", a: [0, 0], b: [l, 0], count: 1 } as const,
                        { kind: "ticks", a: [l, 0], b: [l, w], count: 1 } as const,
                      ]
                    : []),
                  ...sides(rectangle(l, w), [len(l, u), square ? null : len(w, u), null, null]),
                ],
                square ? `A square with side ${l} ${u}.` : `A rectangle ${l} ${u} long and ${w} ${u} wide.`,
                square ? `一个边长 ${l} ${u} 的正方形。` : `一个长 ${l} ${u}、宽 ${w} ${u} 的长方形。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["area-of-rectangles-and-squares#area-of-a-rectangle"]),
      ),
      lesson(
        "missing-side-from-area",
        ["A missing side from the area", "由面积求边长"],
        [
          [
            "Since $A = l \\cdot w$, a missing side is the area divided by the known side: $l = A \\div w$. A rectangle with area $48\\text{ m}^2$ and width $6$ m is $48 \\div 6 = 8$ m long. A square with area $49\\text{ m}^2$ has side $7$ m, since $7 \\cdot 7 = 49$.",
            "由于 $A = l \\cdot w$，未知的边长等于面积除以已知边长：$l = A \\div w$。面积 $48\\text{ m}^2$、宽 $6$ 米的长方形长 $48 \\div 6 = 8$ 米。面积 $49\\text{ m}^2$ 的正方形边长是 $7$ 米，因为 $7 \\cdot 7 = 49$。",
          ],
          ["Multiply back: $8 \\cdot 6 = 48$.", "乘回去：$8 \\cdot 6 = 48$。"],
          [
            "Divide the area by the side; subtracting the side or halving the area treats area like perimeter.",
            "要用面积除以边长；减去边长或把面积取一半，是把面积当成周长了。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          if (rng.bool(0.3)) {
            const s = rng.int(2, 15);
            const a = s * s;
            return valued(
              [
                `A square has an area of $${tex(a, u, 2)}$. How long is each side?`,
                `一个正方形的面积是 $${tex(a, u, 2)}$。它的边长是多少？`,
              ],
              s,
              [
                [
                  ["Use the area of a square", "用正方形的面积"],
                  ["The area is the side times itself:", "面积是边长乘它自己："],
                  [`s \\cdot s = ${a}`],
                ],
                [
                  ["Find the side", "求边长"],
                  [`Look for the number that times itself makes $${a}$:`, `找出自己乘自己得 $${a}$ 的数：`],
                  [`${s} \\cdot ${s} = ${a}`, `s = ${tex(s, u)}`],
                ],
              ],
              [
                `One less is too small and one more is too big: $${s - 1} \\cdot ${s - 1} = ${(s - 1) ** 2}$ and $${s + 1} \\cdot ${s + 1} = ${(s + 1) ** 2}$.`,
                `少 $1$ 太小，多 $1$ 太大：$${s - 1} \\cdot ${s - 1} = ${(s - 1) ** 2}$，$${s + 1} \\cdot ${s + 1} = ${(s + 1) ** 2}$。`,
              ],
              [
                ...(a % 2 === 0
                  ? [
                      [
                        a / 2,
                        "That halves the area, but the side times itself makes the area.",
                        "这是把面积取一半，但应该是边长自己乘自己等于面积。",
                      ] as const,
                    ]
                  : []),
                ...(a % 4 === 0 ? [[a / 4, "That divides by $4$ as for a perimeter.", "这是像求周长那样除以 $4$。"] as const] : []),
                [a, "That is the area, not the side.", "这是面积，不是边长。"],
              ],
              { unit: u },
            );
          }
          const w = rng.int(2, 12);
          const l = w + rng.int(1, 12);
          const a = l * w;
          return valued(
            [
              `A rectangle has an area of $${tex(a, u, 2)}$ and a width of $${tex(w, u)}$. What is its length?`,
              `一个长方形的面积是 $${tex(a, u, 2)}$，宽是 $${tex(w, u)}$。它的长是多少？`,
            ],
            l,
            [
              [["Use the area", "用面积公式"], ["The area is length times width:", "面积是长乘宽："], [`l \\cdot ${w} = ${a}`]],
              [["Divide", "相除"], ["Divide the area by the width:", "用面积除以宽："], [`l = ${a} \\div ${w} = ${tex(l, u)}`]],
            ],
            [`Multiply back: $${l} \\cdot ${w} = ${a}$.`, `乘回去：$${l} \\cdot ${w} = ${a}$。`],
            [
              [a - w, "That subtracts the width instead of dividing by it.", "这是减去宽，应该除以宽。"],
              ...(a % 2 === 0
                ? [
                    [
                      a / 2 - w,
                      "That treats the area as a perimeter: it halves and then subtracts.",
                      "这是把面积当成了周长：先取一半再减。",
                    ] as const,
                  ]
                : []),
              [a * w, "That multiplies by the width instead of dividing.", "这是乘宽，应该除以宽。"],
            ],
            { unit: u },
          );
        },
        drawn(gradeDrawings3["area-of-rectangles-and-squares#missing-side-from-area"]),
      ),
    ],
  },
  [
    "A floor $5$ m long and $3$ m wide is covered with square tiles $1$ m on a side. There are $3$ rows of $5$ tiles, so $15$ tiles: the area is $15\\text{ m}^2$.",
    "一块长 $5$ 米、宽 $3$ 米的地面铺满边长 $1$ 米的正方形地砖。共 $3$ 行、每行 $5$ 块，就是 $15$ 块：面积是 $15\\text{ m}^2$。",
  ],
  ["Count by columns instead: $5$ columns of $3$ tiles is also $15$.", "按列数：$5$ 列、每列 $3$ 块，也是 $15$ 块。"],
  [
    "find the area of a rectangle or square by multiplying its sides, and find a missing side from the area.",
    "学习用边长相乘求长方形和正方形的面积，并由面积求未知的边长。",
  ],
);
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

/** areaOfParallelograms finds the area of a parallelogram from its base and height, and a missing base or height. */
export const areaOfParallelograms: TopicDef = withIntro(
  {
    id: "area-of-parallelograms",
    title: t("Areas of Parallelograms", "平行四边形的面积"),
    summary: t("Find the area of a parallelogram from its base and height.", "由底和高求平行四边形的面积。"),
    prerequisites: ["area-of-rectangles-and-squares"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.6.G.A.1"],
    knowledgePoints: [
      lesson(
        "base-times-height",
        ["Base times height", "底乘高"],
        [
          [
            "Cut the triangle off one end of a parallelogram and move it to the other end: it becomes a rectangle with the same base and the same height. So $A = b \\cdot h$, where the **height** $h$ is measured at a right angle to the base, not along the slanted side. A parallelogram with base $10$ cm, slanted side $5$ cm and height $4$ cm has area $10 \\cdot 4 = 40\\text{ cm}^2$.",
            "把平行四边形一端的三角形剪下，移到另一端，就得到一个底和高都不变的长方形。所以 $A = b \\cdot h$，其中**高** $h$ 要垂直于底来量，而不是沿斜边量。底 $10$ 厘米、斜边 $5$ 厘米、高 $4$ 厘米的平行四边形面积是 $10 \\cdot 4 = 40\\text{ cm}^2$。",
          ],
          [
            "If the slanted side leans over $3$ cm, the shape is a $7$ by $4$ rectangle and two triangles of $\\tfrac{1}{2} \\cdot 3 \\cdot 4 = 6$: $28 + 6 + 6 = 40$.",
            "若斜边向外斜出 $3$ 厘米，图形可以分成一个 $7$ 乘 $4$ 的长方形和两个面积为 $\\tfrac{1}{2} \\cdot 3 \\cdot 4 = 6$ 的三角形：$28 + 6 + 6 = 40$。",
          ],
          [
            "Use the dashed height, not the slanted side: the slanted side is longer than the height.",
            "要用虚线画的高，而不是斜边：斜边比高长。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const [o, h, c] = rng.pick(triples);
          const b = o + rng.int(2, 15);
          const a = b * h;
          const half = (o * h) / 2;
          return valued(
            ["Find the area of the parallelogram.", "求这个平行四边形的面积。"],
            a,
            [
              [
                ["Pick the height", "找出高"],
                [
                  `The height is the dashed $${h}$, at a right angle to the base; the slanted side $${c}$ is not the height.`,
                  `高是虚线 $${h}$，与底垂直；斜边 $${c}$ 不是高。`,
                ],
              ],
              [["Multiply", "相乘"], ["Base times height:", "底乘高："], [`A = ${b} \\cdot ${h} = ${tex(a, u, 2)}`]],
            ],
            [
              `The slanted side leans over $${o}$, so the shape is a $${b - o}$ by $${h}$ rectangle and two triangles of $\\tfrac{1}{2} \\cdot ${o} \\cdot ${h} = ${half}$: $${(b - o) * h} + ${half} + ${half} = ${a}$.`,
              `斜边斜出 $${o}$，所以图形是一个 $${b - o}$ 乘 $${h}$ 的长方形和两个面积为 $\\tfrac{1}{2} \\cdot ${o} \\cdot ${h} = ${half}$ 的三角形：$${(b - o) * h} + ${half} + ${half} = ${a}$。`,
            ],
            [
              [b * c, "That uses the slanted side instead of the height.", "这是用斜边代替了高。"],
              [2 * (b + c), "That is the perimeter, the distance around.", "这是周长，是绕一圈的长度。"],
              [Q.of(b * h, 2), "That halves the product, as for a triangle.", "这是像三角形那样把乘积除以 $2$。"],
            ],
            {
              unit: `${u}^2`,
              figure: parallelogramFigure(
                b,
                o,
                h,
                [len(b, u), len(c, u), len(h, u)],
                `A parallelogram with base ${b} ${u}, slanted side ${c} ${u} and height ${h} ${u}.`,
                `一个平行四边形，底 ${b} ${u}，斜边 ${c} ${u}，高 ${h} ${u}。`,
              ),
            },
          );
        },
        parallelogramFigure(
          10,
          3,
          4,
          ["b", null, "h"],
          "A parallelogram with base b and its height h dashed, at a right angle to the base.",
          "一个平行四边形，底为 b，高 h 用虚线画出，与底垂直。",
        ),
      ),
      lesson(
        "missing-base-or-height",
        ["A missing base or height", "求底或高"],
        [
          [
            "Since $A = b \\cdot h$, a missing base or height is the area divided by the other one: $h = A \\div b$ and $b = A \\div h$. A parallelogram with area $54\\text{ m}^2$ and base $9$ m has height $54 \\div 9 = 6$ m.",
            "由于 $A = b \\cdot h$，未知的底或高等于面积除以另一个：$h = A \\div b$，$b = A \\div h$。面积 $54\\text{ m}^2$、底 $9$ 米的平行四边形高是 $54 \\div 9 = 6$ 米。",
          ],
          ["Multiply back: $9 \\cdot 6 = 54$.", "乘回去：$9 \\cdot 6 = 54$。"],
          [
            "There is no $\\tfrac{1}{2}$ for a parallelogram: do not double the area as you would for a triangle.",
            "平行四边形的公式里没有 $\\tfrac{1}{2}$：不要像三角形那样把面积乘 $2$。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const [b, h] = [rng.int(3, 20), rng.int(2, 15)];
          const a = b * h;
          const askHeight = rng.bool();
          const [known, asked] = askHeight ? [b, h] : [h, b];
          const [knownName, askedName]: [Pair, Pair] = askHeight
            ? [
                ["base", "底"],
                ["height", "高"],
              ]
            : [
                ["height", "高"],
                ["base", "底"],
              ];
          const letter = askHeight ? "h" : "b";
          return valued(
            [
              `A parallelogram has an area of $${tex(a, u, 2)}$ and a ${knownName[0]} of $${tex(known, u)}$. What is its ${askedName[0]}?`,
              `一个平行四边形的面积是 $${tex(a, u, 2)}$，${knownName[1]}是 $${tex(known, u)}$。它的${askedName[1]}是多少？`,
            ],
            asked,
            [
              [
                ["Use the area", "用面积公式"],
                ["The area is base times height:", "面积是底乘高："],
                [askHeight ? `${known} \\cdot h = ${a}` : `b \\cdot ${known} = ${a}`],
              ],
              [
                ["Divide", "相除"],
                [`Divide the area by the ${knownName[0]}:`, `用面积除以${knownName[1]}：`],
                [`${letter} = ${a} \\div ${known} = ${tex(asked, u)}`],
              ],
            ],
            [`Multiply back: $${b} \\cdot ${h} = ${a}$.`, `乘回去：$${b} \\cdot ${h} = ${a}$。`],
            [
              [
                a - known,
                `That subtracts the ${knownName[0]} instead of dividing by it.`,
                `这是减去${knownName[1]}，应该除以${knownName[1]}。`,
              ],
              [Q.of(2 * a, known), "That doubles the area first, as for a triangle.", "这是像三角形那样先把面积乘 $2$。"],
              [
                a * known,
                `That multiplies by the ${knownName[0]} instead of dividing.`,
                `这是乘${knownName[1]}，应该除以${knownName[1]}。`,
              ],
            ],
            { unit: u },
          );
        },
        drawn(gradeDrawings3["area-of-parallelograms#missing-base-or-height"]),
      ),
    ],
  },
  [
    "Push the top of a stack of books sideways and it leans into a parallelogram. The books did not change, so the area of the side of the stack is still base times height.",
    "把一摞书的上面往旁边推，书的侧面就斜成一个平行四边形。书本身没有变，所以侧面的面积仍是底乘高。",
  ],
  ["Straighten the stack again: it is a rectangle with the same base and the same height.", "把书再推直：它是一个底和高都不变的长方形。"],
  [
    "find the area of a parallelogram as base times height, and find a missing base or height from the area.",
    "学习用底乘高求平行四边形的面积，并由面积求未知的底或高。",
  ],
);

/** twoHeightsOfOneParallelogram is the third knowledge point of the area of parallelograms: one area from two base and height pairs. */
export const twoHeightsOfOneParallelogram = lesson(
  "two-heights-of-one-parallelogram",
  ["Two heights of one parallelogram", "同一平行四边形的两条高"],
  [
    [
      "A parallelogram has one area but two pairs of base and height: either side can be the base, each with its own height. Both products give the same area. With sides $6$ and $9$ and height $6$ to the $6$ side, the area is $6 \\cdot 6 = 36$, so the height to the $9$ side is $36 \\div 9 = 4$.",
      "平行四边形只有一个面积，却有两组底和高：任一条边都可以作底，各有自己的高。两个乘积都得到同一个面积。两边为 $6$ 和 $9$，到 $6$ 那条边的高是 $6$ 时，面积是 $6 \\cdot 6 = 36$，所以到 $9$ 那条边的高是 $36 \\div 9 = 4$。",
    ],
    [
      "The longer side gets the shorter height: $9$ is $1.5$ times $6$, so its height is $6 \\div 1.5 = 4$.",
      "较长的边配较短的高：$9$ 是 $6$ 的 $1.5$ 倍，所以它的高是 $6 \\div 1.5 = 4$。",
    ],
    ["The height to the longer side is the shorter height, not the same height.", "较长边上的高是较短的那条高，而不是同一条高。"],
  ],
  (rng) => {
    // Sides p m and q m with heights q k and p k: k < m keeps each height shorter than the slanted side.
    const [p, q] = rng.pick<[number, number]>([
      [2, 3],
      [3, 2],
      [3, 4],
      [4, 3],
      [2, 5],
      [5, 2],
      [3, 5],
      [5, 3],
      [4, 5],
      [5, 4],
    ]);
    const m = rng.int(3, 8);
    const k = rng.int(2, m - 1);
    const [b1, b2, h1, h2] = [p * m, q * m, q * k, p * k];
    const area = b1 * h1;
    return valued(
      [
        `A parallelogram has sides of $${b1}$ cm and $${b2}$ cm. The height to the $${b1}$ cm side is $${h1}$ cm. What is the height to the $${b2}$ cm side?`,
        `平行四边形两边长 $${b1}$ 厘米和 $${b2}$ 厘米。到 $${b1}$ 厘米边的高是 $${h1}$ 厘米。到 $${b2}$ 厘米边的高是多少？`,
      ],
      h2,
      [
        [
          ["Find the area", "求面积"],
          [`Use the side $${b1}$ and its height:`, `用边 $${b1}$ 和它的高：`],
          [`A = ${b1} \\cdot ${h1} = ${area}`],
        ],
        [
          ["Divide by the other side", "除以另一条边"],
          [`The same area is $${b2}$ times its height:`, `同一个面积也等于 $${b2}$ 乘它的高：`],
          [`h = ${area} \\div ${b2} = ${h2}`],
        ],
      ],
      [
        `The heights are in the opposite ratio to the sides: $${b1} : ${b2} = ${p} : ${q}$, so $${h1} \\cdot \\frac{${p}}{${q}} = ${h2}$.`,
        `高的比与边的比相反：$${b1} : ${b2} = ${p} : ${q}$，所以 $${h1} \\cdot \\frac{${p}}{${q}} = ${h2}$。`,
      ],
      [
        [h1, "That keeps the same height, but each side has its own height.", "这是用了同一条高，但每条边都有自己的高。"],
        [area, "That is the area, not a height.", "这是面积，不是高。"],
        [
          Q.of(h1 * q, p),
          "That makes the longer side's height longer too, but a longer side has the shorter height.",
          "这是让较长边的高也更长，但较长的边配较短的高。",
        ],
        [b1 + b2, "That adds the two sides.", "这是把两条边相加了。"],
      ],
      { unit: "cm" },
    );
  },
  drawn(gradeDrawings4["area-of-parallelograms#two-heights-of-one-parallelogram"]),
);

/** areaOfTriangles finds the area of a triangle from its base and height, and a missing base or height. */
export const areaOfTriangles: TopicDef = withIntro(
  {
    id: "area-of-triangles",
    title: t("Area of Triangles", "三角形的面积"),
    summary: t("Find the area of a triangle from its base and height.", "由底和高求三角形的面积。"),
    prerequisites: ["area-of-parallelograms"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.6.G.A.1"],
    knowledgePoints: [
      lesson(
        "half-base-times-height",
        ["Half base times height", "底乘高除以二"],
        [
          [
            "Two copies of a triangle fit together into a parallelogram with the same base and height, so the triangle has half its area: $A = \\tfrac{1}{2} b h$. The height is measured at a right angle to the base, from the opposite vertex; in a right triangle the two legs are a base and its height. A triangle with base $10$ cm and height $7$ cm has area $\\tfrac{1}{2} \\cdot 10 \\cdot 7 = 35\\text{ cm}^2$.",
            "两个完全一样的三角形可以拼成一个底和高都相同的平行四边形，所以三角形的面积是它的一半：$A = \\tfrac{1}{2} b h$。高是从对顶点垂直于底量出的；直角三角形的两条直角边就是一组底和高。底 $10$ 厘米、高 $7$ 厘米的三角形面积是 $\\tfrac{1}{2} \\cdot 10 \\cdot 7 = 35\\text{ cm}^2$。",
          ],
          ["Halve the base first: $5 \\cdot 7 = 35$, the same.", "先把底取一半：$5 \\cdot 7 = 35$，结果相同。"],
          [
            "Do not forget the $\\tfrac{1}{2}$: $10 \\cdot 7 = 70$ is the parallelogram made of two triangles.",
            "不要忘了 $\\tfrac{1}{2}$：$10 \\cdot 7 = 70$ 是两个三角形拼成的平行四边形。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          let b = rng.int(3, 20);
          const h = rng.int(2, 16);
          if ((b * h) % 2 === 1) b += 1;
          const a = (b * h) / 2;
          const halfFirst: Pair =
            b % 2 === 0
              ? [`Halve the base first: $${b / 2} \\cdot ${h} = ${a}$.`, `先把底取一半：$${b / 2} \\cdot ${h} = ${a}$。`]
              : [`Halve the height first: $${b} \\cdot ${h / 2} = ${a}$.`, `先把高取一半：$${b} \\cdot ${h / 2} = ${a}$。`];
          const walk = (first: Pair): Walk[] => [
            [["Find the base and height", "找出底和高"], first],
            [
              ["Halve the product", "乘积取一半"],
              ["Half the base times the height:", "底乘高再除以二："],
              [`A = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${tex(a, u, 2)}`],
            ],
          ];
          const common = [
            [
              b * h,
              "That forgets the $\\tfrac{1}{2}$: it is the parallelogram made of two triangles.",
              "这是忘了 $\\tfrac{1}{2}$：这是两个三角形拼成的平行四边形。",
            ],
            [b + h, "That adds the base and the height instead of multiplying them.", "这是把底和高相加了，应该相乘。"],
          ] as const;
          if (rng.bool(0.35)) {
            const points: Point[] = [
              [0, 0],
              [b, 0],
              [0, h],
            ];
            return valued(
              ["Find the area of the right triangle.", "求这个直角三角形的面积。"],
              a,
              walk([
                `The two legs meet at a right angle, so they are a base, $${b}$, and its height, $${h}$.`,
                `两条直角边互相垂直，所以它们是一组底 $${b}$ 和高 $${h}$。`,
              ]),
              halfFirst,
              [...common, ...(a % 2 === 0 ? [[a / 2, "That halves twice.", "这是取了两次一半。"] as const] : [])],
              {
                unit: `${u}^2`,
                figure: figure(
                  [
                    { kind: "polygon", points },
                    { kind: "right", vertex: [0, 0], from: [b, 0], to: [0, h] },
                    ...sides(points, [len(b, u), null, len(h, u)]),
                  ],
                  `A right triangle with legs ${b} ${u} and ${h} ${u}.`,
                  `一个直角三角形，两条直角边为 ${b} ${u} 和 ${h} ${u}。`,
                ),
              },
            );
          }
          const [o, hh, c] = rng.pick(triples);
          const scale = h / hh;
          const apex: Point = [Math.min(o * scale, b - 1), h];
          const slant = Math.abs(apex[0] - o * scale) < 1e-9 ? c * scale : null;
          const shown = slant !== null && Number.isInteger(slant) ? slant : null;
          const points: Point[] = [[0, 0], [b, 0], apex];
          return valued(
            ["Find the area of the triangle.", "求这个三角形的面积。"],
            a,
            walk([
              `The base is $${b}$, and the dashed height at a right angle to it is $${h}$.`,
              `底是 $${b}$，与它垂直的虚线高是 $${h}$。`,
            ]),
            halfFirst,
            [
              ...common,
              ...(shown !== null
                ? [[Q.of(b * shown, 2), "That uses the slanted side instead of the height.", "这是用斜边代替了高。"] as const]
                : []),
            ],
            {
              unit: `${u}^2`,
              figure: figure(
                [
                  { kind: "polygon", points },
                  ...sides(points, [len(b, u), null, shown !== null ? len(shown, u) : null]),
                  ...height(apex, [apex[0], 0], [b, 0], len(h, u)),
                ],
                `A triangle with base ${b} ${u} and height ${h} ${u}.`,
                `一个三角形，底 ${b} ${u}，高 ${h} ${u}。`,
              ),
            },
          );
        },
        drawn(remainingDrawings4["area-of-triangles#half-base-times-height"]),
      ),
      lesson(
        "missing-base-or-height-of-a-triangle",
        ["A missing base or height", "求底或高"],
        [
          [
            "Since $A = \\tfrac{1}{2} b h$, doubling the area gives $b h$; then divide by the known length. A triangle with area $30\\text{ cm}^2$ and base $12$ cm has $12h = 2 \\cdot 30 = 60$, so its height is $60 \\div 12 = 5$ cm.",
            "由于 $A = \\tfrac{1}{2} b h$，把面积乘以 $2$ 得 $b h$，再除以已知的长度。面积 $30\\text{ cm}^2$、底 $12$ 厘米的三角形满足 $12h = 2 \\cdot 30 = 60$，所以高是 $60 \\div 12 = 5$ 厘米。",
          ],
          ["Put it back: $\\tfrac{1}{2} \\cdot 12 \\cdot 5 = 30$.", "代回去：$\\tfrac{1}{2} \\cdot 12 \\cdot 5 = 30$。"],
          [
            "Double the area first: $30 \\div 12$ forgets that the triangle is half of $b h$.",
            "要先把面积乘 $2$：$30 \\div 12$ 忘了三角形只是 $b h$ 的一半。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          let b = rng.int(3, 20);
          const h = rng.int(2, 16);
          if ((b * h) % 2 === 1) b += 1;
          const a = (b * h) / 2;
          const askHeight = rng.bool();
          const [known, asked] = askHeight ? [b, h] : [h, b];
          const [knownName, askedName]: [Pair, Pair] = askHeight
            ? [
                ["base", "底"],
                ["height", "高"],
              ]
            : [
                ["height", "高"],
                ["base", "底"],
              ];
          const letter = askHeight ? "h" : "b";
          return valued(
            [
              `A triangle has an area of $${tex(a, u, 2)}$ and a ${knownName[0]} of $${tex(known, u)}$. What is its ${askedName[0]}?`,
              `一个三角形的面积是 $${tex(a, u, 2)}$，${knownName[1]}是 $${tex(known, u)}$。它的${askedName[1]}是多少？`,
            ],
            asked,
            [
              [
                ["Double the area", "把面积乘 2"],
                ["Doubling undoes the $\\tfrac{1}{2}$ and gives base times height:", "乘 $2$ 消去 $\\tfrac{1}{2}$，得到底乘高："],
                [`${known} \\cdot ${letter} = 2 \\cdot ${a} = ${2 * a}`],
              ],
              [
                ["Divide", "相除"],
                [`Divide by the ${knownName[0]}:`, `除以${knownName[1]}：`],
                [`${letter} = ${2 * a} \\div ${known} = ${tex(asked, u)}`],
              ],
            ],
            [`Put it back: $\\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${a}$.`, `代回去：$\\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${a}$。`],
            [
              [Q.of(a, known), "That divides without doubling the area first.", "这是没有先把面积乘 $2$ 就除了。"],
              [Q.of(4 * a, known), "That doubles the area twice.", "这是把面积乘了两次 $2$。"],
              [
                2 * a - known,
                `That subtracts the ${knownName[0]} instead of dividing by it.`,
                `这是减去${knownName[1]}，应该除以${knownName[1]}。`,
              ],
            ],
            { unit: u },
          );
        },
        drawn(remainingDrawings4["area-of-triangles#missing-base-or-height-of-a-triangle"]),
      ),
    ],
  },
  [
    "Cut a square sandwich corner to corner and you get two triangles of the same size. Each triangle is half of the sandwich.",
    "把一块正方形三明治沿对角切开，就得到两个一样大的三角形。每个三角形是三明治的一半。",
  ],
  [
    "A $10$ cm sandwich has area $100\\text{ cm}^2$, and each triangle is $\\tfrac{1}{2} \\cdot 10 \\cdot 10 = 50\\text{ cm}^2$.",
    "边长 $10$ 厘米的三明治面积是 $100\\text{ cm}^2$，每个三角形是 $\\tfrac{1}{2} \\cdot 10 \\cdot 10 = 50\\text{ cm}^2$。",
  ],
  [
    "find the area of a triangle as half of base times height, and find a missing base or height from the area.",
    "学习用底乘高的一半求三角形的面积，并由面积求未知的底或高。",
  ],
);

/** half writes half of a whole number: "22.5". */
const half = (n: number) => `${n / 2}`;

/** areaOfTrapezoids finds the area of a trapezoid from its bases and height, and a missing base or height. */
export const areaOfTrapezoids: TopicDef = withIntro(
  {
    id: "area-of-trapezoids",
    title: t("Areas of Trapezoids", "梯形的面积"),
    summary: t("Find the area of a trapezoid from its two bases and its height.", "由上下底和高求梯形的面积。"),
    prerequisites: ["area-of-triangles"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.6.G.A.1"],
    knowledgePoints: [
      lesson(
        "the-trapezoid-formula",
        ["The trapezoid formula", "梯形面积公式"],
        [
          [
            "A **trapezoid** has a pair of parallel sides, its **bases** $b_1$ and $b_2$; the height $h$ is the distance between them. Two copies of a trapezoid, one turned over, make a parallelogram with base $b_1 + b_2$, so $A = \\tfrac{1}{2} (b_1 + b_2) h$. A trapezoid with bases $6$ m and $10$ m and height $4$ m has area $\\tfrac{1}{2} \\cdot 16 \\cdot 4 = 32\\text{ m}^2$.",
            "**梯形**有一组平行的边，叫它的**上底** $b_1$ 和**下底** $b_2$；高 $h$ 是它们之间的距离。两个完全一样的梯形，一个倒过来，拼成底为 $b_1 + b_2$ 的平行四边形，所以 $A = \\tfrac{1}{2} (b_1 + b_2) h$。上下底为 $6$ 米和 $10$ 米、高 $4$ 米的梯形面积是 $\\tfrac{1}{2} \\cdot 16 \\cdot 4 = 32\\text{ m}^2$。",
          ],
          [
            "Cut along a diagonal into two triangles with the same height: $\\tfrac{1}{2} \\cdot 10 \\cdot 4 + \\tfrac{1}{2} \\cdot 6 \\cdot 4 = 20 + 12 = 32$.",
            "沿对角线切成两个高相同的三角形：$\\tfrac{1}{2} \\cdot 10 \\cdot 4 + \\tfrac{1}{2} \\cdot 6 \\cdot 4 = 20 + 12 = 32$。",
          ],
          [
            "Add the two bases before multiplying, and do not forget the $\\tfrac{1}{2}$.",
            "先把两条底相加再乘，不要忘了 $\\tfrac{1}{2}$。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const top = rng.int(3, 14);
          const bottom = top + rng.int(2, 12);
          let h = rng.int(2, 12);
          if (((top + bottom) * h) % 2 === 1) h += 1;
          const a = ((top + bottom) * h) / 2;
          const o = rng.bool(0.3) ? 0 : rng.int(1, bottom - top - 1);
          const points: Point[] = [
            [0, 0],
            [bottom, 0],
            [o + top, h],
            [o, h],
          ];
          return valued(
            ["Find the area of the trapezoid.", "求这个梯形的面积。"],
            a,
            [
              [
                ["Add the bases", "两底相加"],
                [`The parallel sides are $${top}$ and $${bottom}$:`, `两条平行边是 $${top}$ 和 $${bottom}$：`],
                [`${top} + ${bottom} = ${top + bottom}`],
              ],
              [
                ["Multiply and halve", "相乘再取一半"],
                ["Multiply by the height and take half:", "乘以高，再取一半："],
                [`A = \\tfrac{1}{2} \\cdot ${top + bottom} \\cdot ${h} = ${tex(a, u, 2)}`],
              ],
            ],
            [
              `Cut along a diagonal into two triangles of height $${h}$: $\\tfrac{1}{2} \\cdot ${bottom} \\cdot ${h} + \\tfrac{1}{2} \\cdot ${top} \\cdot ${h} = ${half(bottom * h)} + ${half(top * h)} = ${a}$.`,
              `沿对角线切成两个高为 $${h}$ 的三角形：$\\tfrac{1}{2} \\cdot ${bottom} \\cdot ${h} + \\tfrac{1}{2} \\cdot ${top} \\cdot ${h} = ${half(bottom * h)} + ${half(top * h)} = ${a}$。`,
            ],
            [
              [
                (top + bottom) * h,
                "That forgets the $\\tfrac{1}{2}$: it is the parallelogram made of two trapezoids.",
                "这是忘了 $\\tfrac{1}{2}$：这是两个梯形拼成的平行四边形。",
              ],
              [bottom * h, "That uses only the longer base, as if the shape were a rectangle.", "这只用了较长的底，好像图形是长方形。"],
              [top * bottom * h, "That multiplies the two bases instead of adding them.", "这是把两条底相乘了，应该相加。"],
              [top + bottom + h, "That adds the lengths instead of multiplying.", "这是把长度相加了，应该相乘。"],
            ],
            {
              unit: `${u}^2`,
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
            },
          );
        },
        drawn(gradeDrawings3["area-of-trapezoids#the-trapezoid-formula"]),
      ),
      lesson(
        "a-missing-base-or-height",
        ["A missing base or height", "求未知的底或高"],
        [
          [
            "Doubling the area undoes the $\\tfrac{1}{2}$: $2A = (b_1 + b_2) h$. For the height, divide by the sum of the bases. For a base, divide by the height and take away the other base. A trapezoid of area $45\\text{ cm}^2$, height $6$ cm and one base $7$ cm has $b_1 + b_2 = 90 \\div 6 = 15$, so the other base is $15 - 7 = 8$ cm.",
            "面积乘以 $2$ 消去 $\\tfrac{1}{2}$：$2A = (b_1 + b_2) h$。求高，就除以两底之和；求底，就除以高，再减去另一条底。面积 $45\\text{ cm}^2$、高 $6$ 厘米、一条底 $7$ 厘米的梯形，$b_1 + b_2 = 90 \\div 6 = 15$，所以另一条底是 $15 - 7 = 8$ 厘米。",
          ],
          ["Put it back: $\\tfrac{1}{2} (7 + 8) \\cdot 6 = 45$.", "代回去：$\\tfrac{1}{2} (7 + 8) \\cdot 6 = 45$。"],
          [
            "Double the area first; dividing the area itself gives only half of the answer.",
            "要先把面积乘 $2$；直接用面积去除只得到一半。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const top = rng.int(2, 14);
          const bottom = top + rng.int(1, 12);
          let h = rng.int(2, 12);
          if (((top + bottom) * h) % 2 === 1) h += 1;
          const a = ((top + bottom) * h) / 2;
          const sum = top + bottom;
          const back: Pair = [
            `Put it back: $\\tfrac{1}{2} (${top} + ${bottom}) \\cdot ${h} = ${a}$.`,
            `代回去：$\\tfrac{1}{2} (${top} + ${bottom}) \\cdot ${h} = ${a}$。`,
          ];
          if (rng.bool(0.4)) {
            return valued(
              [
                `A trapezoid has bases $${tex(top, u)}$ and $${tex(bottom, u)}$ and area $${tex(a, u, 2)}$. Find its height.`,
                `一个梯形的两底分别为 $${tex(top, u)}$ 和 $${tex(bottom, u)}$，面积为 $${tex(a, u, 2)}$。求它的高。`,
              ],
              h,
              [
                [
                  ["Double the area", "把面积乘 2"],
                  ["Doubling undoes the $\\tfrac{1}{2}$:", "乘 $2$ 消去 $\\tfrac{1}{2}$："],
                  [`(${top} + ${bottom}) h = 2 \\cdot ${a} = ${2 * a}`],
                ],
                [
                  ["Divide by the sum of the bases", "除以两底之和"],
                  [`The bases add to $${sum}$:`, `两底之和是 $${sum}$：`],
                  [`h = ${2 * a} \\div ${sum} = ${tex(h, u)}`],
                ],
              ],
              back,
              [
                [Q.of(a, sum), "That divides without doubling the area first.", "这是没有先把面积乘 $2$ 就除了。"],
                [Q.of(2 * a, bottom), "That divides by one base instead of the sum of the bases.", "这是只除以一条底，应该除以两底之和。"],
                [2 * a - sum, "That subtracts the bases instead of dividing by their sum.", "这是减去两底，应该除以两底之和。"],
              ],
              { unit: u },
            );
          }
          const [known, missing] = rng.bool() ? [top, bottom] : [bottom, top];
          return valued(
            [
              `A trapezoid has area $${tex(a, u, 2)}$ and height $${tex(h, u)}$. One base is $${tex(known, u)}$. Find the other base.`,
              `一个梯形的面积为 $${tex(a, u, 2)}$，高为 $${tex(h, u)}$，一条底为 $${tex(known, u)}$。求另一条底。`,
            ],
            missing,
            [
              [
                ["Find the sum of the bases", "求两底之和"],
                ["Double the area and divide by the height:", "面积乘以 $2$ 再除以高："],
                [`b_1 + b_2 = 2 \\cdot ${a} \\div ${h} = ${sum}`],
              ],
              [
                ["Take away the known base", "减去已知的底"],
                [`One base is $${known}$:`, `一条底是 $${known}$：`],
                [`b = ${sum} - ${known} = ${tex(missing, u)}`],
              ],
            ],
            back,
            [
              [sum, "That is the sum of both bases; take away the known one.", "这是两底之和；还要减去已知的底。"],
              [Q.of(a, h).sub(Q.of(known)), "That forgets to double the area first.", "这是忘了先把面积乘 $2$。"],
              [sum + known, "That adds the known base instead of taking it away.", "这是加上已知的底，应该减去。"],
            ],
            { unit: u },
          );
        },
        drawn(gradeDrawings4["area-of-trapezoids#a-missing-base-or-height"]),
      ),
    ],
  },
  [
    "Look at a popcorn box from the side: it is wider at the top than at the bottom, and the top and bottom are parallel. That shape is a trapezoid.",
    "从侧面看爆米花盒：上面比下面宽，上下两边互相平行。这个形状就是梯形。",
  ],
  [
    "Two copies of the side, one turned upside down, fit together into a parallelogram.",
    "把两个这样的侧面拼在一起，一个倒过来，正好拼成一个平行四边形。",
  ],
  [
    "find the area of a trapezoid from its two bases and its height, and work back to a missing base or height.",
    "学习由两底和高求梯形的面积，并由面积反求未知的底或高。",
  ],
);

/** theMissingBaseOfATrapezoid is the third knowledge point of trapezoids: a base of a real trapezoid from its area and height. */
export const theMissingBaseOfATrapezoid = lesson(
  "the-missing-base-of-a-trapezoid",
  ["The missing base of a trapezoid", "梯形缺失的底"],
  [
    [
      "Twice the area divided by the height is the sum of the two bases; taking away the known base leaves the other. A trapezoid flower bed of $40\\text{ m}^2$, $5$ m deep, with one edge $6$ m: $2 \\cdot 40 \\div 5 = 16$, so the other edge is $16 - 6 = 10$ m.",
      "面积的两倍除以高，就是两底之和；减去已知的底，就是另一条底。面积 $40\\text{ m}^2$、宽 $5$ 米的梯形花坛，一条边长 $6$ 米：$2 \\cdot 40 \\div 5 = 16$，所以另一条边长 $16 - 6 = 10$ 米。",
    ],
    [
      "The average of the bases is $40 \\div 5 = 8$, so the bases are $8 - 2$ and $8 + 2$: $6$ and $10$.",
      "两底的平均值是 $40 \\div 5 = 8$，所以两底是 $8 - 2$ 和 $8 + 2$：$6$ 和 $10$。",
    ],
    [
      "Forgetting to double the area gives the average of the bases, not their sum.",
      "忘了把面积乘 $2$，得到的是两底的平均值，不是两底之和。",
    ],
  ],
  (rng) => {
    const h = rng.int(2, 12);
    const b1 = rng.int(2, 20);
    const drawnBase = rng.int(2, 10) * 2 - (b1 % 2 === 0 ? 0 : 1);
    const b2 = drawnBase === b1 ? drawnBase + 2 : drawnBase;
    const sum = b1 + b2;
    const area = (sum * h) / 2;
    const mean = sum / 2;
    return valued(
      [
        `A flower bed is shaped like a trapezoid with area $${area}$ square meters. Its parallel edges are $${h}$ m apart, and one of them is $${b1}$ m long. How long is the other parallel edge, in meters?`,
        `一个梯形花坛的面积是 $${area}$ 平方米。它的两条平行边相距 $${h}$ 米，其中一条长 $${b1}$ 米。另一条平行边长多少米？`,
      ],
      b2,
      [
        [
          ["Find the sum of the bases", "求两底之和"],
          ["Double the area and divide by the height:", "面积乘以 $2$ 再除以高："],
          [`b_1 + b_2 = 2 \\cdot ${area} \\div ${h} = ${sum}`],
        ],
        [["Take away the known base", "减去已知的底"], [`One edge is $${b1}$:`, `一条边是 $${b1}$：`], [`b_2 = ${sum} - ${b1} = ${b2}`]],
      ],
      [
        `The average of the bases is $${area} \\div ${h} = ${mean}$, and $${b1}$ is $${Math.abs(mean - b1)}$ ${b1 < mean ? "below" : "above"} it, so the other edge is $${mean} ${b1 < mean ? "+" : "-"} ${Math.abs(mean - b1)} = ${b2}$.`,
        `两底的平均值是 $${area} \\div ${h} = ${mean}$，$${b1}$ 比它${b1 < mean ? "小" : "大"} $${Math.abs(mean - b1)}$，所以另一条边是 $${mean} ${b1 < mean ? "+" : "-"} ${Math.abs(mean - b1)} = ${b2}$。`,
      ],
      [
        [sum, "That is the sum of both edges; take away the known one.", "这是两条边之和；还要减去已知的那条。"],
        [Q.of(area, h).sub(Q.of(b1)), "That forgets to double the area first.", "这是忘了先把面积乘 $2$。"],
        [sum + b1, "That adds the known edge instead of taking it away.", "这是加上已知的边，应该减去。"],
        [Q.of(area, h), "That is the average of the two edges, not the other edge.", "这是两条边的平均值，不是另一条边。"],
      ],
      { unit: "m" },
    );
  },
  drawn(gradeDrawings4["area-of-trapezoids#the-missing-base-of-a-trapezoid"]),
);

/** lShape is an L-shaped hexagon: a w by h rectangle with a cw by ch rectangle cut from its top right corner. */
const lShape = (w: number, h: number, cw: number, ch: number): Point[] => [
  [0, 0],
  [w, 0],
  [w, h - ch],
  [w - cw, h - ch],
  [w - cw, h],
  [0, h],
];

/** compositeShapes finds the area and perimeter of shapes made of rectangles and triangles. */
export const compositeShapes: TopicDef = withIntro(
  {
    id: "composite-shapes",
    title: t("Areas and Perimeters of Composite Shapes", "组合图形的面积和周长"),
    summary: t("Find the area and perimeter of shapes made of rectangles and triangles.", "求由长方形和三角形组成的图形的面积和周长。"),
    prerequisites: ["area-of-triangles"],
    encompasses: [{ topic: "area-of-rectangles-and-squares", weight: 0.6 }],
    xp: 10,
    standards: ["CCSS.6.G.A.1", "CCSS.7.G.B.6"],
    knowledgePoints: [
      lesson(
        "area-of-composite-shapes",
        ["Area by splitting", "分割求面积"],
        [
          [
            "To find the area of a shape made of simpler pieces, split it into rectangles and triangles, find each area, and add. You can also subtract: an L-shape is a big rectangle with a corner rectangle removed. An L-shape $10$ wide and $8$ tall with a $4$ by $3$ corner cut out has area $80 - 12 = 68$.",
            "求由简单图形组成的图形面积时，把它分成长方形和三角形，分别求面积再相加。也可以用减法：L 形是大长方形去掉一角的小长方形。宽 $10$、高 $8$、去掉一个 $4$ 乘 $3$ 的角的 L 形，面积是 $80 - 12 = 68$。",
          ],
          [
            "Cut it into two rectangles instead: $10 \\cdot 5 + 6 \\cdot 3 = 50 + 18 = 68$.",
            "也可以切成两个长方形：$10 \\cdot 5 + 6 \\cdot 3 = 50 + 18 = 68$。",
          ],
          [
            "Missing lengths come from the given ones by adding or subtracting; do not guess them from the picture.",
            "缺少的长度要由已知长度加减得到；不要从图上估计。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          if (rng.bool(0.4)) {
            let w = rng.int(4, 14);
            const h = rng.int(3, 10);
            const roof = rng.int(2, 8);
            if ((w * roof) % 2 === 1) w += 1;
            const [rect, tri] = [w * h, (w * roof) / 2];
            const box = w * (h + roof);
            const corner = (w * roof) / 4;
            const points: Point[] = [
              [0, 0],
              [w, 0],
              [w, h],
              [w / 2, h + roof],
              [0, h],
            ];
            return valued(
              ["Find the area of the shape: a rectangle with a triangle on top.", "求这个图形的面积：长方形上面是一个三角形。"],
              rect + tri,
              [
                [
                  ["Find each piece", "求每一块"],
                  ["The rectangle and the triangle on it:", "长方形和上面的三角形："],
                  [`${w} \\cdot ${h} = ${rect}`, `\\tfrac{1}{2} \\cdot ${w} \\cdot ${roof} = ${tri}`],
                ],
                [
                  ["Add", "相加"],
                  ["The shape is the two pieces together:", "图形是两块合起来："],
                  [`A = ${rect} + ${tri} = ${tex(rect + tri, u, 2)}`],
                ],
              ],
              [
                `Draw a box around it, $${w}$ by $${h + roof}$, and take away the two empty corners, each half of a $${half(w)}$ by $${roof}$ rectangle: $${box} - 2 \\cdot ${corner} = ${rect + tri}$.`,
                `在外面画一个 $${w}$ 乘 $${h + roof}$ 的框，减去两个空着的角，每个是 $${half(w)}$ 乘 $${roof}$ 长方形的一半：$${box} - 2 \\cdot ${corner} = ${rect + tri}$。`,
              ],
              [
                [rect + 2 * tri, "That forgets the $\\tfrac{1}{2}$ for the triangle.", "这是三角形忘了乘 $\\tfrac{1}{2}$。"],
                [box, "That is the whole box around the shape, empty corners included.", "这是包住图形的整个框，把空着的角也算进去了。"],
                [rect, "That leaves out the triangle.", "这是漏掉了三角形。"],
              ],
              {
                unit: `${u}^2`,
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
              },
            );
          }
          const w = rng.int(6, 16);
          const h = rng.int(5, 14);
          const cw = rng.int(2, w - 2);
          const ch = rng.int(2, h - 2);
          const area = w * h - cw * ch;
          const points = lShape(w, h, cw, ch);
          return valued(
            ["Find the area of the shape. All corners are right angles.", "求这个图形的面积。所有的角都是直角。"],
            area,
            [
              [
                ["Find the missing corner", "求缺掉的角"],
                [
                  `The shape is a $${w}$ by $${h}$ rectangle with a corner cut out; its sides are`,
                  `图形是 $${w}$ 乘 $${h}$ 的长方形去掉一角；这一角的边长是`,
                ],
                [`${w} - ${w - cw} = ${cw}`, `${h} - ${h - ch} = ${ch}`],
              ],
              [
                ["Subtract", "相减"],
                ["Take the corner away from the whole rectangle:", "用整个长方形减去这一角："],
                [`A = ${w} \\cdot ${h} - ${cw} \\cdot ${ch} = ${tex(area, u, 2)}`],
              ],
            ],
            [
              `Cut it into two rectangles instead: $${w} \\cdot ${h - ch} + ${w - cw} \\cdot ${ch} = ${w * (h - ch)} + ${(w - cw) * ch} = ${area}$.`,
              `也可以切成两个长方形：$${w} \\cdot ${h - ch} + ${w - cw} \\cdot ${ch} = ${w * (h - ch)} + ${(w - cw) * ch} = ${area}$。`,
            ],
            [
              [w * h, "That forgets to take out the missing corner.", "这是忘了去掉缺掉的那一角。"],
              [2 * (w + h), "That is the perimeter, not the area.", "这是周长，不是面积。"],
              [w * h - (w - cw) * (h - ch), "That takes out a rectangle made of the wrong sides.", "这是去掉了用错边长的长方形。"],
            ],
            {
              unit: `${u}^2`,
              figure: figure(
                [{ kind: "polygon", points }, ...sides(points, [len(w, u), len(h - ch, u), null, null, len(w - cw, u), len(h, u)])],
                `An L-shape: ${w} ${u} wide at the bottom, ${h} ${u} tall on the left, ${w - cw} ${u} wide at the top and ${h - ch} ${u} tall on the right.`,
                `一个 L 形：底边宽 ${w} ${u}，左边高 ${h} ${u}，顶边宽 ${w - cw} ${u}，右边高 ${h - ch} ${u}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings4["composite-shapes#area-of-composite-shapes"]),
      ),
      lesson(
        "perimeter-of-composite-shapes",
        ["Perimeter with missing sides", "求有未知边的周长"],
        [
          [
            "A perimeter needs every side. When all corners are right angles, the sides along the top add up to the bottom, and the sides on the right add up to the left. In an L-shape $12$ wide and $9$ tall, the two short sides of the notch come from subtracting, and the perimeter is $2 \\cdot 12 + 2 \\cdot 9 = 42$.",
            "求周长，每条边都要有长度。所有角都是直角时，上方的水平边之和等于底边，右侧的竖直边之和等于左侧。在宽 $12$、高 $9$ 的 L 形中，缺口的两条短边用减法求出，周长是 $2 \\cdot 12 + 2 \\cdot 9 = 42$。",
          ],
          [
            "Push the two sides of the notch out to the corner: the path is as long as the rectangle's, $2(12 + 9) = 42$.",
            "把缺口的两条边推到角上：路程和长方形一样长，$2(12 + 9) = 42$。",
          ],
          [
            "Count all six sides; the two unlabeled sides of the notch are part of the border too.",
            "六条边都要算；缺口那两条没标长度的边也是边界的一部分。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const w = rng.int(6, 16);
          const h = rng.int(5, 14);
          const cw = rng.int(2, w - 2);
          const ch = rng.int(2, h - 2);
          const p = 2 * (w + h);
          const shown = w + (h - ch) + (w - cw) + h;
          const points = lShape(w, h, cw, ch);
          return valued(
            ["All corners of the shape are right angles. Find its perimeter.", "这个图形的所有角都是直角。求它的周长。"],
            p,
            [
              [
                ["Find the missing sides", "求未知的边"],
                [
                  "The top sides add up to the bottom, and the right sides add up to the left:",
                  "上方的边之和等于底边，右侧的边之和等于左侧：",
                ],
                [`${w} - ${w - cw} = ${cw}`, `${h} - ${h - ch} = ${ch}`],
              ],
              [
                ["Add all six sides", "六条边相加"],
                ["Go around the shape:", "绕图形一圈："],
                [`P = ${w} + ${h - ch} + ${cw} + ${ch} + ${w - cw} + ${h} = ${tex(p, u)}`],
              ],
            ],
            [
              `Push the two sides of the notch out to the corner: the path is as long as a $${w}$ by $${h}$ rectangle's, $2(${w} + ${h}) = ${p}$.`,
              `把缺口的两条边推到角上：路程和 $${w}$ 乘 $${h}$ 的长方形一样长，$2(${w} + ${h}) = ${p}$。`,
            ],
            [
              [shown, "That adds only the four labeled sides and leaves out the notch.", "这只加了标出的四条边，漏掉了缺口的两条边。"],
              [w * h - cw * ch, "That is the area, not the perimeter.", "这是面积，不是周长。"],
              [p + cw + ch, "That counts the two sides of the notch twice.", "这是把缺口的两条边算了两遍。"],
            ],
            {
              unit: u,
              figure: figure(
                [{ kind: "polygon", points }, ...sides(points, [len(w, u), len(h - ch, u), null, null, len(w - cw, u), len(h, u)])],
                `An L-shape: ${w} ${u} wide at the bottom, ${h} ${u} tall on the left, ${w - cw} ${u} wide at the top and ${h - ch} ${u} tall on the right; the two sides of the notch are unlabeled.`,
                `一个 L 形：底边宽 ${w} ${u}，左边高 ${h} ${u}，顶边宽 ${w - cw} ${u}，右边高 ${h - ch} ${u}；缺口的两条边没有标长度。`,
              ),
            },
          );
        },
        drawn(gradeDrawings4["composite-shapes#perimeter-of-composite-shapes"]),
      ),
    ],
  },
  [
    "A bedroom is shaped like a letter L, and the whole floor needs a new carpet. No single formula fits an L, but two rectangles do.",
    "一间卧室的形状像字母 L，整个地面要铺新地毯。没有一个公式正好适合 L 形，但两个长方形可以。",
  ],
  [
    "Measure the room as a big rectangle, then take away the corner that is not part of the room.",
    "把房间看成一个大长方形，再减去不属于房间的那一角。",
  ],
  [
    "find areas of shapes by splitting them into pieces or subtracting a piece, and find perimeters with missing sides.",
    "学习把图形分成几块或减去一块来求面积，并求有未知边的周长。",
  ],
);

/** subtractingAHole is the third knowledge point of composite shapes: the area left after a piece is removed. */
export const subtractingAHole = lesson(
  "subtracting-a-hole",
  ["Subtracting a hole", "减去一个洞"],
  [
    [
      "A shape with a piece removed has the area of the whole minus the area of the piece. This is often quicker than cutting what remains into smaller rectangles. A $20$ m by $15$ m garden with a $6$ m by $4$ m pond has $300 - 24 = 276\\text{ m}^2$ of land.",
      "挖去一块的图形，面积是整体减去这一块。这常常比把剩下的部分切成小长方形更快。$20$ 米乘 $15$ 米的花园里有一个 $6$ 米乘 $4$ 米的池塘，陆地面积是 $300 - 24 = 276\\text{ m}^2$。",
    ],
    ["Add the pond back: $276 + 24 = 300$, the whole garden.", "把池塘加回去：$276 + 24 = 300$，正好是整个花园。"],
    [
      "Subtract the area of the hole, not its lengths: $(20 - 6)(15 - 4)$ is a different rectangle.",
      "要减去洞的面积，而不是它的边长：$(20 - 6)(15 - 4)$ 是另一个长方形。",
    ],
  ],
  (rng) => {
    const w = rng.int(8, 30);
    const h = rng.int(8, 30);
    const a = rng.int(2, w - 3);
    const b = rng.int(2, h - 3);
    const twice = rng.bool();
    const pieces = twice ? 2 : 1;
    const hole = a * b * pieces;
    const area = w * h - hole;
    const offs: [number, string, string][] = [
      [w * h, "That forgets to take the hole away.", "这是忘了减去洞。"],
      [
        (w - a) * (h - b),
        "That subtracts the lengths of the hole from the sides, not its area.",
        "这是从边长里减去洞的边长，而不是减去洞的面积。",
      ],
      [2 * (w + h), "That is the perimeter of the garden.", "这是花园的周长。"],
    ];
    if (twice) offs.push([w * h - a * b, "That takes away only one of the two pieces.", "这只减去了两块中的一块。"]);
    const x = Math.min(1, w - a - 1);
    const y = Math.min(1, h - b - 1);
    return valued(
      twice
        ? [
            `A rectangular garden is $${w}$ m by $${h}$ m. A corner of $${a}$ m by $${b}$ m is paved, and so is another piece of the same size. What area is not paved, in square meters?`,
            `长方形花园长 $${w}$ 米、宽 $${h}$ 米。一角 $${a}$ 米乘 $${b}$ 米铺了砖，另一块同样大小的地方也铺了砖。没铺砖的面积是多少平方米？`,
          ]
        : [
            `A rectangular garden is $${w}$ m by $${h}$ m. A pond of $${a}$ m by $${b}$ m is inside it. What area of the garden is not pond, in square meters?`,
            `长方形花园长 $${w}$ 米、宽 $${h}$ 米，里面有一个 $${a}$ 米乘 $${b}$ 米的池塘。花园中不是池塘的面积是多少平方米？`,
          ],
      area,
      [
        [
          ["Find the whole and the hole", "求整体和挖去的部分"],
          [
            twice ? "The whole garden, and the two paved pieces:" : "The whole garden, and the pond:",
            twice ? "整个花园，和两块铺砖的地方：" : "整个花园，和池塘：",
          ],
          [`${w} \\cdot ${h} = ${w * h}`, twice ? `2 \\cdot ${a} \\cdot ${b} = ${hole}` : `${a} \\cdot ${b} = ${hole}`],
        ],
        [["Subtract", "相减"], ["Take the hole away from the whole:", "用整体减去挖去的部分："], [`${w * h} - ${hole} = ${area}`]],
      ],
      [
        `Add the hole back: $${area} + ${hole} = ${w * h}$, which is $${w} \\cdot ${h}$.`,
        `把挖去的部分加回去：$${area} + ${hole} = ${w * h}$，正好是 $${w} \\cdot ${h}$。`,
      ],
      offs,
      {
        unit: "m^2",
        ...(!twice && {
          figure: figure(
            [
              { kind: "polygon", points: rectangle(w, h) },
              ...sides(rectangle(w, h), [`${w} m`, `${h} m`, null, null]),
              {
                kind: "polygon",
                points: [
                  [x, y],
                  [x + a, y],
                  [x + a, y + b],
                  [x, y + b],
                ],
              },
            ],
            `A ${w} m by ${h} m rectangle with a ${a} m by ${b} m rectangle inside it.`,
            `一个 ${w} 米乘 ${h} 米的长方形，里面有一个 ${a} 米乘 ${b} 米的长方形。`,
          ),
        }),
      },
    );
  },
  drawn(gradeDrawings4["composite-shapes#subtracting-a-hole"]),
);

/** areaTopics are the topics on perimeter and area. */
export const areaTopics: readonly TopicDef[] = [
  perimeter,
  areaOfRectanglesAndSquares,
  areaOfParallelograms,
  areaOfTriangles,
  areaOfTrapezoids,
  compositeShapes,
];
