import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, Q, sketch } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";

// ACT Math Fundamentals, geometry: the midsegment of a trapezoid, the area covered by two crossing rectangular strips,
// and the diagonal and volume of a rectangular prism.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

// ---------------------------------------------------------------------------
// Trapezoid midsegment

/** trapezoidFigure draws trapezoid ABCD with bases AB and DC and midsegment EF, labeling the three lengths. */
function trapezoidFigure(top: string, bottom: string, middle: string): Figure {
  const [a, b, c, d]: [Point, Point, Point, Point] = [
    [0, 0],
    [8, 0],
    [6, 3.2],
    [2, 3.2],
  ];
  const [e, f]: [Point, Point] = [
    [1, 1.6],
    [7, 1.6],
  ];
  const marks: Mark[] = [
    { kind: "polygon", points: [a, b, c, d] },
    { kind: "segment", a: e, b: f, accent: true },
    { kind: "ticks", a, b: e, count: 1 },
    { kind: "ticks", a: e, b: d, count: 1 },
    { kind: "ticks", a: b, b: f, count: 2 },
    { kind: "ticks", a: f, b: c, count: 2 },
    { kind: "label", at: a, text: "A", dir: "sw" },
    { kind: "label", at: b, text: "B", dir: "se" },
    { kind: "label", at: c, text: "C", dir: "ne" },
    { kind: "label", at: d, text: "D", dir: "nw" },
    { kind: "label", at: e, text: "E", dir: "w" },
    { kind: "label", at: f, text: "F", dir: "e" },
    { kind: "side", a, b, text: bottom },
    { kind: "side", a: c, b: d, text: top },
    { kind: "label", at: [4, 1.6], text: middle, dir: "n" },
  ];
  return {
    svg: sketch(marks),
    alt: t(
      `Trapezoid ABCD with AB parallel to DC. E and F are the midpoints of legs AD and BC, and EF is the midsegment. AB is labeled ${bottom}, DC is labeled ${top} and EF is labeled ${middle}.`,
      `梯形 ABCD，AB 平行于 DC。E、F 分别是腰 AD、BC 的中点，EF 是中位线。AB 标为 ${bottom}，DC 标为 ${top}，EF 标为 ${middle}。`,
    ),
  };
}

/** findingTheLengthOfATrapezoidMidsegment uses the midsegment of a trapezoid, the average of the two bases. */
export const findingTheLengthOfATrapezoidMidsegment = topic(
  "finding-the-length-of-a-trapezoid-midsegment",
  t("Finding the Length of a Trapezoid Midsegment", "求梯形中位线的长"),
  t(
    "Find the midsegment of a trapezoid as the average of its bases, and find a base from the midsegment and the other base.",
    "把梯形的中位线求为两底的平均数，并由中位线和一条底求另一条底。",
  ),
  ["properties-of-trapezoids"],
  ["HSG.CO.C.11"],
  [
    kp(
      "the-midsegment-from-the-bases",
      t("The midsegment from the bases", "由两底求中位线"),
      t(
        "The **midsegment** of a trapezoid joins the midpoints of its two legs. It is parallel to the bases, and its length is their average:\n\n$$EF = \\frac{AB + DC}{2}$$\n\nWith bases $10$ and $16$, the midsegment is $\\frac{10 + 16}{2} = 13$. It always lies between the two bases in length.",
        "梯形的**中位线**连接两腰的中点。它平行于两底，长度等于两底的平均数：\n\n$$EF = \\frac{AB + DC}{2}$$\n\n两底为 $10$ 和 $16$ 时，中位线为 $\\frac{10 + 16}{2} = 13$。中位线的长度总在两底之间。",
      ),
      (rng) => {
        const top = rng.int(3, 18);
        const bottom = top + rng.int(2, 14);
        const answer = Q.of(top + bottom, 2);
        return {
          ...numberProblem({
            prompt: t(
              `In trapezoid $ABCD$, $AB \\parallel DC$, $DC = ${top}$ and $AB = ${bottom}$. $E$ and $F$ are the midpoints of legs $AD$ and $BC$. What is $EF$?`,
              `在梯形 $ABCD$ 中，$AB \\parallel DC$，$DC = ${top}$，$AB = ${bottom}$。$E$、$F$ 分别是腰 $AD$、$BC$ 的中点。$EF$ 是多少？`,
            ),
            answer,
            wrong: [top + bottom, bottom - top, Q.of(bottom - top, 2)],
            solution: t(
              `The midsegment is the average of the bases:${steps(`EF = \\frac{${bottom} + ${top}}{2} = ${answer.toLatex()}`)}`,
              `中位线等于两底的平均数：${steps(`EF = \\frac{${bottom} + ${top}}{2} = ${answer.toLatex()}`)}`,
            ),
          }),
          figure: trapezoidFigure(`${top}`, `${bottom}`, "?"),
        };
      },
    ),
    kp(
      "a-base-from-the-midsegment",
      t("A base from the midsegment", "由中位线求底"),
      t(
        "If the midsegment and one base are known, double the midsegment and subtract the known base. With midsegment $13$ and base $10$: $\\frac{10 + x}{2} = 13$, so $10 + x = 26$ and $x = 16$. The other base is as far above the midsegment as the known base is below it: $13 + 3 = 16$.",
        "已知中位线和一条底时，把中位线乘 $2$ 再减去已知的底。中位线为 $13$、一条底为 $10$ 时：$\\frac{10 + x}{2} = 13$，所以 $10 + x = 26$，$x = 16$。另一条底比中位线大的部分，等于已知底比中位线小的部分：$13 + 3 = 16$。",
      ),
      (rng) => {
        const top = rng.int(3, 18);
        const bottom = top + 2 * rng.int(1, 7);
        const middle = (top + bottom) / 2;
        const askTop = rng.bool();
        const [known, answer] = askTop ? [bottom, top] : [top, bottom];
        const [knownName, unknownName] = askTop ? ["AB", "DC"] : ["DC", "AB"];
        return {
          ...numberProblem({
            prompt: t(
              `In trapezoid $ABCD$, $AB \\parallel DC$ and $AB$ is the longer base. The midsegment $EF$, joining the midpoints of the legs, has length $${middle}$, and $${knownName} = ${known}$. What is $${unknownName}$?`,
              `在梯形 $ABCD$ 中，$AB \\parallel DC$，$AB$ 是较长的底。连接两腰中点的中位线 $EF$ 长 $${middle}$，$${knownName} = ${known}$。$${unknownName}$ 是多少？`,
            ),
            answer,
            wrong: [Q.of(middle + known, 2), Math.abs(middle - known), middle + known, 2 * middle + known],
            solution: t(
              `The midsegment is the average of the bases:${steps(`\\frac{${known} + ${unknownName}}{2} = ${middle}`, `${known} + ${unknownName} = ${2 * middle}`, `${unknownName} = ${answer}`)}`,
              `中位线等于两底的平均数：${steps(`\\frac{${known} + ${unknownName}}{2} = ${middle}`, `${known} + ${unknownName} = ${2 * middle}`, `${unknownName} = ${answer}`)}`,
            ),
          }),
          figure: askTop ? trapezoidFigure("?", `${bottom}`, `${middle}`) : trapezoidFigure(`${top}`, "?", `${middle}`),
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Crossing strips

/** stripsFigure draws a w × h rectangle crossed by a horizontal strip of width a and a vertical strip of width b. */
function stripsFigure(w: number, h: number, a: number, b: number, shadeStrips: boolean): Figure {
  // Draw at a fixed shape so that the figure does not depend on the numbers beyond their labels.
  const [W, H, A, B] = [10, 6, 1.2, 1.4];
  const [x0, y0] = [3.6, 2.2];
  const rect: Point[] = [
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ];
  const hStrip: Point[] = [
    [0, y0],
    [W, y0],
    [W, y0 + A],
    [0, y0 + A],
  ];
  const vStrip: Point[] = [
    [x0, 0],
    [x0 + B, 0],
    [x0 + B, H],
    [x0, H],
  ];
  const corners: Point[][] = [
    [
      [0, 0],
      [x0, 0],
      [x0, y0],
      [0, y0],
    ],
    [
      [x0 + B, 0],
      [W, 0],
      [W, y0],
      [x0 + B, y0],
    ],
    [
      [0, y0 + A],
      [x0, y0 + A],
      [x0, H],
      [0, H],
    ],
    [
      [x0 + B, y0 + A],
      [W, y0 + A],
      [W, H],
      [x0 + B, H],
    ],
  ];
  const marks: Mark[] = [
    ...(shadeStrips
      ? [{ kind: "shade", points: hStrip } as const, { kind: "shade", points: vStrip } as const]
      : corners.map((points) => ({ kind: "shade", points }) as const)),
    { kind: "polygon", points: rect },
    { kind: "segment", a: [0, y0], b: [W, y0] },
    { kind: "segment", a: [0, y0 + A], b: [W, y0 + A] },
    { kind: "segment", a: [x0, 0], b: [x0, H] },
    { kind: "segment", a: [x0 + B, 0], b: [x0 + B, H] },
    { kind: "side", a: [0, 0], b: [W, 0], text: `${w}` },
    { kind: "side", a: [W, 0], b: [W, H], text: `${h}` },
    { kind: "side", a: [0, y0 + A], b: [0, y0], text: `${a}` },
    { kind: "side", a: [x0 + B, H], b: [x0, H], text: `${b}` },
  ];
  return {
    svg: sketch(marks),
    alt: t(
      `A ${w} by ${h} rectangle crossed by a horizontal strip ${a} wide running its full length and a vertical strip ${b} wide running its full height. ${shadeStrips ? "The two strips are shaded." : "The four corner pieces outside the strips are shaded."}`,
      `一个 ${w} × ${h} 的长方形，被一条宽 ${a}、贯穿全长的水平条带和一条宽 ${b}、贯穿全高的竖直条带穿过。${shadeStrips ? "两条条带被涂上阴影。" : "条带外的四个角块被涂上阴影。"}`,
    ),
  };
}

/** findingTheAreaCoveredByCrossingRectangularStrips finds the area of two crossing strips and of what they leave. */
export const findingTheAreaCoveredByCrossingRectangularStrips = topic(
  "finding-the-area-covered-by-crossing-rectangular-strips",
  t("Finding the Area Covered by Crossing Rectangular Strips", "求交叉矩形条带覆盖的面积"),
  t(
    "Find the area covered by two perpendicular strips that cross a rectangle, counting the overlap once, and the area of the rectangle they leave uncovered.",
    "求穿过长方形的两条互相垂直的条带所覆盖的面积（重叠部分只计一次），以及它们未覆盖的面积。",
  ),
  ["area-of-rectangles-and-squares"],
  ["7.G.B.6"],
  [
    kp(
      "the-area-of-the-strips",
      t("The area of the strips", "条带的面积"),
      t(
        "A strip $a$ wide running the full length $w$ of a rectangle has area $aw$; a strip $b$ wide running the full height $h$ has area $bh$. Where they cross, an $a$ by $b$ rectangle is in both, so adding the strips counts it twice. The area covered is\n\n$$aw + bh - ab$$\n\nFor a $20$ by $12$ lawn with paths $2$ and $3$ wide: $2(20) + 3(12) - 2(3) = 70$.",
        "宽 $a$、贯穿长方形全长 $w$ 的条带面积为 $aw$；宽 $b$、贯穿全高 $h$ 的条带面积为 $bh$。两者交叉处有一个 $a \\times b$ 的长方形同时属于两条条带，把两条带面积相加会把它算两次。覆盖的面积为\n\n$$aw + bh - ab$$\n\n例如 $20 \\times 12$ 的草坪上有宽 $2$ 和 $3$ 的两条小路：$2(20) + 3(12) - 2(3) = 70$。",
      ),
      (rng) => {
        const [w, h] = [rng.int(12, 30), rng.int(8, 20)];
        const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
        const answer = a * w + b * h - a * b;
        return {
          ...numberProblem({
            prompt: t(
              `A rectangular lawn is $${w}$ m long and $${h}$ m wide. A path $${a}$ m wide runs the full length of the lawn, and a path $${b}$ m wide runs the full width, crossing the first path. What is the total area of the paths?`,
              `一块长方形草坪长 $${w}$ 米、宽 $${h}$ 米。一条宽 $${a}$ 米的小路贯穿草坪全长，另一条宽 $${b}$ 米的小路贯穿草坪全宽，与第一条小路交叉。两条小路的总面积是多少？`,
            ),
            answer,
            unit: "m^2",
            wrong: [a * w + b * h, a * w + b * h - 2 * a * b, (w - b) * (h - a), a * h + b * w - a * b],
            solution: t(
              `The paths have areas $${a}(${w}) = ${a * w}$ and $${b}(${h}) = ${b * h}$, and the $${a}$ by $${b}$ crossing is in both, so subtract it once:${steps(`${a * w} + ${b * h} - ${a * b} = ${answer}`)}`,
              `两条小路的面积分别为 $${a}(${w}) = ${a * w}$ 和 $${b}(${h}) = ${b * h}$，$${a} \\times ${b}$ 的交叉处被算了两次，减去一次：${steps(`${a * w} + ${b * h} - ${a * b} = ${answer}`)}`,
            ),
          }),
          figure: stripsFigure(w, h, a, b, true),
        };
      },
    ),
    kp(
      "the-area-left-uncovered",
      t("The area left uncovered", "未覆盖的面积"),
      t(
        "The strips cut the rectangle into four corner pieces. Slide them together and they form one rectangle $w - b$ by $h - a$, so the uncovered area is\n\n$$(w - b)(h - a)$$\n\nSubtracting both strips from $wh$ without adding back the crossing removes the overlap twice. For the $20$ by $12$ lawn with paths $3$ (across the length) and $2$ (across the width): $(20 - 2)(12 - 3) = 162$.",
        "两条条带把长方形分成四个角块。把它们拼在一起，就成为一个 $(w - b) \\times (h - a)$ 的长方形，所以未覆盖的面积为\n\n$$(w - b)(h - a)$$\n\n如果从 $wh$ 中减去两条条带而不把交叉处加回来，重叠部分就被减了两次。例如 $20 \\times 12$ 的草坪，沿长的小路宽 $3$，沿宽的小路宽 $2$：$(20 - 2)(12 - 3) = 162$。",
      ),
      (rng) => {
        const [w, h] = [rng.int(12, 30), rng.int(8, 20)];
        const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
        const answer = (w - b) * (h - a);
        return {
          ...numberProblem({
            prompt: t(
              `A rectangular garden is $${w}$ ft long and $${h}$ ft wide. A walkway $${a}$ ft wide runs the full length of the garden, and a walkway $${b}$ ft wide runs the full width, crossing the first. The rest of the garden is planted. What area is planted?`,
              `一块长方形花园长 $${w}$ 英尺、宽 $${h}$ 英尺。一条宽 $${a}$ 英尺的走道贯穿花园全长，另一条宽 $${b}$ 英尺的走道贯穿花园全宽，与第一条交叉。花园其余部分种上植物。种植的面积是多少？`,
            ),
            answer,
            unit: "ft^2",
            wrong: [w * h - a * w - b * h, (w - a) * (h - b), w * h - a * b, (w - b) * (h - a) + a * b],
            solution: t(
              `The four planted corners fit together into one rectangle $${w} - ${b} = ${w - b}$ ft by $${h} - ${a} = ${h - a}$ ft:${steps(`${w - b} \\times ${h - a} = ${answer}`)}Check: $${w * h} - (${a * w} + ${b * h} - ${a * b}) = ${answer}$.`,
              `四个种植的角块可以拼成一个 $${w} - ${b} = ${w - b}$ 英尺乘 $${h} - ${a} = ${h - a}$ 英尺的长方形：${steps(`${w - b} \\times ${h - a} = ${answer}`)}检验：$${w * h} - (${a * w} + ${b * h} - ${a * b}) = ${answer}$。`,
            ),
          }),
          figure: stripsFigure(w, h, a, b, false),
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Rectangular prisms

/** prismFigure draws a box with length, width and height labeled, and its space diagonal when diagonal is set. */
function prismFigure(l: string, w: string, h: string, diagonal: boolean): Figure {
  const [L, H, dx, dy] = [5, 3, 2, 1.3];
  const p = (x: number, y: number, back: boolean): Point => (back ? [x + dx, y + dy] : [x, y]);
  const front = [p(0, 0, false), p(L, 0, false), p(L, H, false), p(0, H, false)];
  const marks: Mark[] = [
    { kind: "polygon", points: front },
    { kind: "segment", a: p(0, H, false), b: p(0, H, true) },
    { kind: "segment", a: p(L, H, false), b: p(L, H, true) },
    { kind: "segment", a: p(L, 0, false), b: p(L, 0, true) },
    { kind: "segment", a: p(0, H, true), b: p(L, H, true) },
    { kind: "segment", a: p(L, 0, true), b: p(L, H, true) },
    { kind: "segment", a: p(0, 0, false), b: p(0, 0, true), dashed: true },
    { kind: "segment", a: p(0, 0, true), b: p(L, 0, true), dashed: true },
    { kind: "segment", a: p(0, 0, true), b: p(0, H, true), dashed: true },
    { kind: "side", a: p(0, 0, false), b: p(L, 0, false), text: l },
    { kind: "side", a: p(L, 0, false), b: p(L, 0, true), text: w },
    { kind: "side", a: p(0, H, false), b: p(0, 0, false), text: h },
    ...(diagonal
      ? ([
          { kind: "segment", a: p(0, 0, false), b: p(L, H, true), accent: true },
          { kind: "label", at: p(0, 0, false), text: "P", dir: "sw" },
          { kind: "label", at: p(L, H, true), text: "Q", dir: "ne" },
        ] as const)
      : []),
  ];
  return {
    svg: sketch(marks),
    alt: t(
      `A rectangular box with length ${l}, width ${w} and height ${h}.${diagonal ? " A diagonal runs through the inside of the box from corner P at the front bottom left to the opposite corner Q at the back top right." : ""}`,
      `一个长方体，长 ${l}、宽 ${w}、高 ${h}。${diagonal ? "一条对角线从前面左下角 P 穿过长方体内部，到达相对的后面右上角 Q。" : ""}`,
    ),
  };
}

/** quadruples are whole numbers l, w, h, d with l² + w² + h² = d². */
const quadruples: readonly (readonly [number, number, number, number])[] = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [4, 4, 7, 9],
  [2, 6, 9, 11],
  [6, 6, 7, 11],
  [3, 4, 12, 13],
  [2, 5, 14, 15],
  [2, 10, 11, 15],
  [8, 9, 12, 17],
  [6, 10, 15, 19],
];

/** reasoningFromARectangularPrism finds the space diagonal of a box and its volume from the areas of its faces. */
export const reasoningFromARectangularPrism = topic(
  "reasoning-from-a-rectangular-prism",
  t("Reasoning From a Rectangular Prism", "由长方体进行推理"),
  t(
    "Find the diagonal through a rectangular prism from its three dimensions, and its volume from the areas of three faces that meet at a corner.",
    "由长方体的三个维度求穿过其内部的对角线，并由交于一个顶点的三个面的面积求其体积。",
  ),
  ["volumes-of-right-rectangular-prisms", "the-pythagorean-theorem"],
  ["HSG.GMD.A.3"],
  [
    kp(
      "the-diagonal-through-a-box",
      t("The diagonal through a box", "长方体的体对角线"),
      t(
        "The diagonal through a box with dimensions $l$, $w$ and $h$ is the hypotenuse of a right triangle whose legs are the height $h$ and the diagonal of the base, $\\sqrt{l^{2} + w^{2}}$. So its length is\n\n$$d = \\sqrt{l^{2} + w^{2} + h^{2}}$$\n\nFor a $2$ by $3$ by $6$ box: $d = \\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$. It is shorter than $l + w + h$, the length of a path along three edges.",
        "长、宽、高为 $l$、$w$、$h$ 的长方体，其体对角线是一个直角三角形的斜边，这个三角形的两条直角边是高 $h$ 和底面对角线 $\\sqrt{l^{2} + w^{2}}$。所以体对角线长为\n\n$$d = \\sqrt{l^{2} + w^{2} + h^{2}}$$\n\n例如 $2 \\times 3 \\times 6$ 的长方体：$d = \\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$。它比沿三条棱走的路径长 $l + w + h$ 短。",
      ),
      (rng) => {
        const k = rng.int(1, 3);
        const q = rng.pick(quadruples);
        const [l, w, h] = rng.shuffle(q.slice(0, 3)).map((v) => v * k) as [number, number, number];
        const diagonal = q[3] * k;
        return {
          ...numberProblem({
            prompt: t(
              `A rectangular box is $${l}$ cm long, $${w}$ cm wide and $${h}$ cm tall. What is the length of the diagonal $PQ$ from one corner through the inside of the box to the opposite corner?`,
              `一个长方体盒子长 $${l}$ 厘米、宽 $${w}$ 厘米、高 $${h}$ 厘米。从一个顶点穿过盒子内部到相对顶点的对角线 $PQ$ 有多长？`,
            ),
            answer: diagonal,
            unit: "cm",
            wrong: [l + w + h, diagonal * diagonal, Math.max(l, w, h) + 1],
            solution: t(
              `Use the three dimensions in the Pythagorean theorem:${steps(`PQ = \\sqrt{${l}^{2} + ${w}^{2} + ${h}^{2}} = \\sqrt{${diagonal * diagonal}} = ${diagonal}`)}`,
              `把三个维度代入勾股定理：${steps(`PQ = \\sqrt{${l}^{2} + ${w}^{2} + ${h}^{2}} = \\sqrt{${diagonal * diagonal}} = ${diagonal}`)}`,
            ),
          }),
          figure: prismFigure(`${l}`, `${w}`, `${h}`, true),
        };
      },
    ),
    kp(
      "the-volume-from-three-faces",
      t("The volume from three faces", "由三个面求体积"),
      t(
        "If three faces of a box that meet at a corner have areas $lw$, $wh$ and $lh$, their product is $(lw)(wh)(lh) = (lwh)^{2}$, the square of the volume. So the volume is the square root of the product of the three face areas. With faces $6$, $12$ and $8$: $\\sqrt{6 \\cdot 12 \\cdot 8} = \\sqrt{576} = 24$. Alternatively find the edges: $l = 2$, $w = 3$, $h = 4$ give these areas.",
        "若长方体交于一个顶点的三个面面积为 $lw$、$wh$、$lh$，它们的积为 $(lw)(wh)(lh) = (lwh)^{2}$，即体积的平方。所以体积等于三个面面积之积的平方根。例如三个面为 $6$、$12$、$8$：$\\sqrt{6 \\cdot 12 \\cdot 8} = \\sqrt{576} = 24$。也可以先求棱长：$l = 2$、$w = 3$、$h = 4$ 正好给出这些面积。",
      ),
      (rng) => {
        const [l, w, h] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
        const [front, side, top] = [l * h, w * h, l * w];
        const volume = l * w * h;
        return {
          ...numberProblem({
            prompt: t(
              `Three faces of a rectangular box that meet at one corner have areas $${front}$ in², $${side}$ in² and $${top}$ in². What is the volume of the box?`,
              `一个长方体盒子交于同一顶点的三个面的面积分别为 $${front}$ 平方英寸、$${side}$ 平方英寸和 $${top}$ 平方英寸。盒子的体积是多少？`,
            ),
            answer: volume,
            unit: "in^3",
            wrong: [front * side * top, front + side + top, 2 * (front + side + top), volume * 2],
            solution: t(
              `The product of the three face areas is the square of the volume:${steps(`(lh)(wh)(lw) = (lwh)^{2}`, `lwh = \\sqrt{${front} \\cdot ${side} \\cdot ${top}} = \\sqrt{${front * side * top}} = ${volume}`)}Indeed the edges are $${l}$, $${w}$ and $${h}$ in.`,
              `三个面面积之积等于体积的平方：${steps(`(lh)(wh)(lw) = (lwh)^{2}`, `lwh = \\sqrt{${front} \\cdot ${side} \\cdot ${top}} = \\sqrt{${front * side * top}} = ${volume}`)}事实上三条棱长为 $${l}$、$${w}$、$${h}$ 英寸。`,
            ),
          }),
          figure: prismFigure("l", "w", "h", false),
        };
      },
    ),
  ],
);

/** actFundamentalsGeometryTopics are the ACT Math Fundamentals geometry topics. */
export const actFundamentalsGeometryTopics: TopicDef[] = [
  findingTheLengthOfATrapezoidMidsegment,
  findingTheAreaCoveredByCrossingRectangularStrips,
  reasoningFromARectangularPrism,
];
