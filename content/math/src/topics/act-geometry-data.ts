import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type PlaneView, plane, Q, svgDocument } from "@ga/subject-math";

import { numberProblem, radicalProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// ACT Math, geometry, statistics and probability: conic sections as slices of a cone, areas of regular polygons,
// rhombuses and kites, volumes of cube stacks from their views, spheres and cubes inscribed in each other, systems of a
// linear and a circular inequality, kinds of statistical studies, counts that give a target probability, circle graphs,
// focal distances of conics, sides and opposite angles of triangles, altitudes from the Pythagorean theorem, and packing
// boxes.

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

/** distinct drops the values equal to the answer or to an earlier value. */
function distinct(answer: Q, values: readonly Q[]): Q[] {
  const out: Q[] = [];
  for (const v of values) if (!v.eq(answer) && !out.some((o) => o.eq(v))) out.push(v);
  return out;
}

/** r rounds a coordinate to one decimal place. */
const r = (v: number) => Math.round(v * 10) / 10;

// ---------------------------------------------------------------------------
// Conic sections

/** conicNames are the curves a plane cuts from a double cone away from its vertex. */
const conicNames = [
  t("A circle", "圆"),
  t("An ellipse that is not a circle", "不是圆的椭圆"),
  t("A parabola", "抛物线"),
  t("A hyperbola", "双曲线"),
] as const;

/** degenerateNames are the figures a plane cuts from a double cone through its vertex. */
const degenerateNames = [
  t("A single point", "一个点"),
  t("A single line", "一条直线"),
  t("Two intersecting lines", "两条相交直线"),
] as const;

/** conicSectionsAsSlicesOfACone names the curve a plane cuts from a double cone by comparing angles. */
export const conicSectionsAsSlicesOfACone = topic(
  "conic-sections-as-slices-of-a-cone",
  t("Conic Sections as Slices of a Cone", "圆锥曲线：平面截圆锥"),
  t(
    "Name the circle, ellipse, parabola or hyperbola a plane cuts from a double cone by comparing the angle of the plane with the angle of the cone, and the point or lines it cuts through the vertex.",
    "比较平面与圆锥的角度，说出平面截双圆锥所得的圆、椭圆、抛物线或双曲线，以及平面过顶点时截得的点或直线。",
  ),
  ["cross-sections-of-three-dimensional-shapes", "introduction-to-ellipses"],
  ["G-GMD.B.4", "G-GPE.A.1"],
  [
    kp(
      "naming-the-conic-section",
      t("Naming the conic section", "说出截得的圆锥曲线"),
      t(
        "A double cone is made by spinning a line about an axis it crosses; let each side make the angle $\\alpha$ with the axis. A plane that misses the vertex and makes the angle $\\theta$ with the axis cuts a **circle** if $\\theta = 90^{\\circ}$, an **ellipse** if $\\alpha < \\theta < 90^{\\circ}$, a **parabola** if $\\theta = \\alpha$ (the plane is parallel to a side), and a **hyperbola** if $\\theta < \\alpha$, since then the plane cuts both halves of the cone.",
        "把一条直线绕与它相交的轴旋转就得到双圆锥；设每条母线与轴的夹角为 $\\alpha$。一个不过顶点、与轴成 $\\theta$ 角的平面，当 $\\theta = 90^{\\circ}$ 时截得**圆**，当 $\\alpha < \\theta < 90^{\\circ}$ 时截得**椭圆**，当 $\\theta = \\alpha$（平面与一条母线平行）时截得**抛物线**，当 $\\theta < \\alpha$ 时截得**双曲线**，因为此时平面截到圆锥的上下两部分。",
      ),
      (rng) => {
        const alpha = rng.pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65]);
        const kind = rng.int(0, 3);
        const theta = [90, rng.int(alpha / 5 + 1, 17) * 5, alpha, rng.int(0, alpha / 5 - 1) * 5][kind]!;
        const reason = [
          t("the plane is perpendicular to the axis", "平面垂直于轴"),
          t(`$${alpha}^{\\circ} < ${theta}^{\\circ} < 90^{\\circ}$`, `$${alpha}^{\\circ} < ${theta}^{\\circ} < 90^{\\circ}$`),
          t("the plane is parallel to a side of the cone", "平面平行于圆锥的一条母线"),
          t(
            `$${theta}^{\\circ} < ${alpha}^{\\circ}$, so the plane cuts both halves of the cone`,
            `$${theta}^{\\circ} < ${alpha}^{\\circ}$，平面截到圆锥的上下两部分`,
          ),
        ][kind]!;
        return pickChoice(
          rng,
          t(
            `Each side of a double cone makes a $${alpha}^{\\circ}$ angle with its axis. A plane that does not pass through the vertex makes a $${theta}^{\\circ}$ angle with the axis. What curve does the plane cut from the cone?`,
            `双圆锥的每条母线与轴成 $${alpha}^{\\circ}$ 角。一个不过顶点的平面与轴成 $${theta}^{\\circ}$ 角。这个平面截圆锥得到什么曲线？`,
          ),
          conicNames[kind]!,
          conicNames.filter((_, i) => i !== kind),
          t(
            `Since ${reason.en}, the curve is ${conicNames[kind]!.en.toLowerCase()}.`,
            `因为${reason["zh-CN"]}，所得曲线是${conicNames[kind]!["zh-CN"]}。`,
          ),
        );
      },
    ),
    kp(
      "slices-through-the-vertex",
      t("Slices through the vertex", "过顶点的截面"),
      t(
        "A plane through the vertex gives a **degenerate** conic. Using the same angles, if $\\theta > \\alpha$ the plane meets the cone only at the vertex, a single **point**. If $\\theta = \\alpha$ it touches the cone along one side, a single **line**. If $\\theta < \\alpha$ it cuts the cone along **two intersecting lines** through the vertex.",
        "过顶点的平面截得的是**退化**的圆锥曲线。用同样的角度记号，若 $\\theta > \\alpha$，平面只在顶点处与圆锥相交，得到一个**点**；若 $\\theta = \\alpha$，平面沿一条母线与圆锥相切，得到一条**直线**；若 $\\theta < \\alpha$，平面沿过顶点的**两条相交直线**截圆锥。",
      ),
      (rng) => {
        const alpha = rng.pick([20, 25, 30, 35, 40, 45, 50, 55, 60, 65]);
        const kind = rng.int(0, 2);
        const theta = [rng.int(alpha / 5 + 1, 18) * 5, alpha, rng.int(0, alpha / 5 - 1) * 5][kind]!;
        const options = [...degenerateNames, conicNames[2 + (kind === 2 ? 1 : 0)]!];
        return pickChoice(
          rng,
          t(
            `Each side of a double cone makes a $${alpha}^{\\circ}$ angle with its axis. A plane through the vertex makes a $${theta}^{\\circ}$ angle with the axis. What does the plane cut from the cone?`,
            `双圆锥的每条母线与轴成 $${alpha}^{\\circ}$ 角。一个过顶点的平面与轴成 $${theta}^{\\circ}$ 角。这个平面截圆锥得到什么？`,
          ),
          degenerateNames[kind]!,
          options.filter((o) => o !== degenerateNames[kind]),
          t(
            `The plane passes through the vertex and ${["$\\theta > \\alpha$, so it meets the cone only at the vertex", "$\\theta = \\alpha$, so it touches the cone along one side", "$\\theta < \\alpha$, so it cuts the cone along two lines through the vertex"][kind]}: ${degenerateNames[kind]!.en.toLowerCase()}.`,
            `平面过顶点，且${["$\\theta > \\alpha$，所以只在顶点处与圆锥相交", "$\\theta = \\alpha$，所以沿一条母线与圆锥相切", "$\\theta < \\alpha$，所以沿过顶点的两条直线截圆锥"][kind]}：${degenerateNames[kind]!["zh-CN"]}。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Areas of plane figures

/** polygonNames are regular polygons by number of sides. */
const polygonNames = [
  { n: 5, en: "pentagon", zh: "正五边形" },
  { n: 6, en: "hexagon", zh: "正六边形" },
  { n: 8, en: "octagon", zh: "正八边形" },
  { n: 10, en: "decagon", zh: "正十边形" },
  { n: 12, en: "dodecagon", zh: "正十二边形" },
] as const;

/** areasOfRegularPolygons finds areas of regular polygons from the apothem and the perimeter. */
export const areasOfRegularPolygons = topic(
  "areas-of-regular-polygons",
  t("Areas of Regular Polygons", "正多边形的面积"),
  t(
    "Find the area of a regular polygon as half the apothem times the perimeter, and the area of a regular hexagon from its side or apothem.",
    "用边心距与周长之积的一半求正多边形的面积，并由边长或边心距求正六边形的面积。",
  ),
  ["regular-polygons", "areas-of-triangles", "thirty-sixty-ninety-triangles"],
  ["G-MG.A.1", "7.G.B.6"],
  [
    kp(
      "area-from-the-apothem",
      t("Area from the apothem and the perimeter", "由边心距和周长求面积"),
      t(
        "The **apothem** of a regular polygon is the distance from its center to a side; it meets the side at a right angle. Segments from the center to the vertices cut an $n$-gon with side $s$ into $n$ congruent triangles, each with base $s$ and height the apothem $a$. So the area is $n \\cdot \\frac{1}{2} s a = \\frac{1}{2} a P$, where $P = ns$ is the perimeter. A regular octagon with side $10$ and apothem $12.1$ has area $\\frac{1}{2}(12.1)(80) = 484$.",
        "正多边形的**边心距**是中心到一边的距离，它与该边垂直。从中心到各顶点的线段把边长为 $s$ 的正 $n$ 边形分成 $n$ 个全等三角形，每个三角形的底为 $s$，高为边心距 $a$。所以面积为 $n \\cdot \\frac{1}{2} s a = \\frac{1}{2} a P$，其中 $P = ns$ 是周长。边长为 $10$、边心距为 $12.1$ 的正八边形，面积为 $\\frac{1}{2}(12.1)(80) = 484$。",
      ),
      (rng) => {
        const p = rng.pick(polygonNames);
        const s = rng.int(2, 20);
        const a = Q.of(Math.round((s / (2 * Math.tan(Math.PI / p.n))) * 10), 10);
        const per = p.n * s;
        const answer = a.mul(Q.of(per)).div(Q.of(2));
        const askPer = rng.bool(0.3);
        return numberProblem({
          prompt: askPer
            ? t(
                `A regular ${p.en} has perimeter $${per}$ and apothem $${a.toLatex()}$. What is its area?`,
                `一个${p.zh}的周长为 $${per}$，边心距为 $${a.toLatex()}$。它的面积是多少？`,
              )
            : t(
                `A regular ${p.en} has side length $${s}$ and apothem $${a.toLatex()}$. What is its area?`,
                `一个${p.zh}的边长为 $${s}$，边心距为 $${a.toLatex()}$。它的面积是多少？`,
              ),
          answer,
          form: "decimal",
          wrong: distinct(answer, [a.mul(Q.of(per)), a.mul(Q.of(s)).div(Q.of(2)), a.mul(Q.of(s)), Q.of(s * s * p.n, 2)]),
          solution: t(
            `${askPer ? "" : `The perimeter is $${p.n} \\cdot ${s} = ${per}$. `}The area is $\\frac{1}{2} a P = \\frac{1}{2}(${a.toLatex()})(${per}) = ${answer.toLatex()}$.`,
            `${askPer ? "" : `周长为 $${p.n} \\cdot ${s} = ${per}$。`}面积为 $\\frac{1}{2} a P = \\frac{1}{2}(${a.toLatex()})(${per}) = ${answer.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "area-of-a-regular-hexagon",
      t("The area of a regular hexagon", "正六边形的面积"),
      t(
        "Segments from the center cut a regular hexagon with side $s$ into $6$ equilateral triangles with side $s$. Each has area $\\frac{\\sqrt{3}}{4} s^{2}$, so the hexagon has area $\\frac{3\\sqrt{3}}{2} s^{2}$. The apothem is the height of one of these triangles, $\\frac{\\sqrt{3}}{2} s$, so an apothem of $a\\sqrt{3}$ means a side of $2a$. A hexagon with side $4$ has area $\\frac{3\\sqrt{3}}{2} \\cdot 16 = 24\\sqrt{3}$.",
        "从中心出发的线段把边长为 $s$ 的正六边形分成 $6$ 个边长为 $s$ 的等边三角形。每个面积为 $\\frac{\\sqrt{3}}{4} s^{2}$，所以正六边形的面积为 $\\frac{3\\sqrt{3}}{2} s^{2}$。边心距是其中一个三角形的高 $\\frac{\\sqrt{3}}{2} s$，所以边心距为 $a\\sqrt{3}$ 意味着边长为 $2a$。边长为 $4$ 的正六边形面积为 $\\frac{3\\sqrt{3}}{2} \\cdot 16 = 24\\sqrt{3}$。",
      ),
      (rng) => {
        const fromApothem = rng.bool(0.4);
        const a = rng.int(1, 12);
        const s = fromApothem ? 2 * a : rng.int(2, 24);
        const k = Q.of(3 * s * s, 2);
        return numberProblem({
          prompt: fromApothem
            ? t(
                `A regular hexagon has apothem $${a === 1 ? "" : a}\\sqrt{3}$. Its area is $k\\sqrt{3}$. What is the value of $k$?`,
                `一个正六边形的边心距为 $${a === 1 ? "" : a}\\sqrt{3}$，面积为 $k\\sqrt{3}$。求 $k$ 的值。`,
              )
            : t(
                `A regular hexagon has side length $${s}$. Its area is $k\\sqrt{3}$. What is the value of $k$?`,
                `一个正六边形的边长为 $${s}$，面积为 $k\\sqrt{3}$。求 $k$ 的值。`,
              ),
          answer: k,
          form: "fraction",
          wrong: distinct(k, [Q.of(s * s, 4), Q.of(6 * s * s), Q.of(3 * s * s), Q.of(3 * a * a, 2)]),
          solution: fromApothem
            ? t(
                `The apothem $${a === 1 ? "" : a}\\sqrt{3}$ is $\\frac{\\sqrt{3}}{2} s$, so $s = ${s}$. The area is $\\frac{3\\sqrt{3}}{2} \\cdot ${s}^{2} = ${k.toLatex()}\\sqrt{3}$, so $k = ${k.toLatex()}$.`,
                `边心距 $${a === 1 ? "" : a}\\sqrt{3}$ 等于 $\\frac{\\sqrt{3}}{2} s$，所以 $s = ${s}$。面积为 $\\frac{3\\sqrt{3}}{2} \\cdot ${s}^{2} = ${k.toLatex()}\\sqrt{3}$，所以 $k = ${k.toLatex()}$。`,
              )
            : t(
                `The hexagon is $6$ equilateral triangles with side $${s}$, so its area is $6 \\cdot \\frac{\\sqrt{3}}{4} \\cdot ${s}^{2} = ${k.toLatex()}\\sqrt{3}$ and $k = ${k.toLatex()}$.`,
                `正六边形由 $6$ 个边长为 $${s}$ 的等边三角形组成，所以面积为 $6 \\cdot \\frac{\\sqrt{3}}{4} \\cdot ${s}^{2} = ${k.toLatex()}\\sqrt{3}$，$k = ${k.toLatex()}$。`,
              ),
        });
      },
    ),
  ],
);

/** halfDiagonals are pairs of half-diagonals of a rhombus whose sides are whole numbers. */
const halfDiagonals = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [15, 20, 25],
] as const;

/** areasOfRhombusesAndKites finds areas of rhombuses and kites from their perpendicular diagonals. */
export const areasOfRhombusesAndKites = topic(
  "areas-of-rhombuses-and-kites",
  t("Areas of Rhombuses and Kites", "菱形与筝形的面积"),
  t(
    "Find the area of a rhombus or kite as half the product of its perpendicular diagonals, work back to a diagonal, and find the side of a rhombus from its diagonals.",
    "用互相垂直的两条对角线之积的一半求菱形或筝形的面积，由面积反求对角线，并由对角线求菱形的边长。",
  ),
  ["rectangles-rhombuses-and-squares", "areas-of-triangles", "the-pythagorean-theorem"],
  ["G-MG.A.1", "7.G.B.6"],
  [
    kp(
      "area-from-the-diagonals",
      t("Area from the diagonals", "由对角线求面积"),
      t(
        "The diagonals of a rhombus or a kite are perpendicular. One diagonal splits the figure into two triangles whose base is that diagonal and whose heights add up to the other diagonal, so the area is $\\frac{1}{2} d_{1} d_{2}$. A kite with diagonals $10$ and $16$ has area $\\frac{1}{2} \\cdot 10 \\cdot 16 = 80$. Working backward, a rhombus with area $54$ and one diagonal $9$ has other diagonal $\\frac{2 \\cdot 54}{9} = 12$.",
        "菱形和筝形的对角线互相垂直。一条对角线把图形分成两个三角形，它们的底都是这条对角线，高之和等于另一条对角线，所以面积为 $\\frac{1}{2} d_{1} d_{2}$。对角线为 $10$ 和 $16$ 的筝形面积为 $\\frac{1}{2} \\cdot 10 \\cdot 16 = 80$。反过来，面积为 $54$、一条对角线为 $9$ 的菱形，另一条对角线为 $\\frac{2 \\cdot 54}{9} = 12$。",
      ),
      (rng) => {
        const kite = rng.bool();
        const shape = kite ? { en: "kite", zh: "筝形" } : { en: "rhombus", zh: "菱形" };
        const d1 = rng.int(2, 30);
        const d2 = rng.int(2, 30);
        const area = Q.of(d1 * d2, 2);
        if (rng.bool(0.4)) {
          return numberProblem({
            prompt: t(
              `A ${shape.en} has area $${area.toLatex()}$, and one of its diagonals has length $${d1}$. What is the length of the other diagonal?`,
              `一个${shape.zh}的面积为 $${area.toLatex()}$，一条对角线长为 $${d1}$。另一条对角线长多少？`,
            ),
            answer: d2,
            form: "decimal",
            wrong: distinct(Q.of(d2), [area.div(Q.of(d1)), area.mul(Q.of(2)).sub(Q.of(d1)), Q.of(d2 * 2)]),
            solution: t(
              `From $\\frac{1}{2} d_{1} d_{2} = ${area.toLatex()}$, $d_{2} = \\frac{2 \\cdot ${area.toLatex()}}{${d1}} = ${d2}$.`,
              `由 $\\frac{1}{2} d_{1} d_{2} = ${area.toLatex()}$，得 $d_{2} = \\frac{2 \\cdot ${area.toLatex()}}{${d1}} = ${d2}$。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `The diagonals of a ${shape.en} have lengths $${d1}$ and $${d2}$. What is its area?`,
            `一个${shape.zh}的两条对角线长分别为 $${d1}$ 和 $${d2}$。它的面积是多少？`,
          ),
          answer: area,
          form: "decimal",
          wrong: distinct(area, [Q.of(d1 * d2), Q.of(d1 * d2, 4), Q.of(2 * (d1 + d2))]),
          solution: t(
            `The area is $\\frac{1}{2} d_{1} d_{2} = \\frac{1}{2} \\cdot ${d1} \\cdot ${d2} = ${area.toLatex()}$.`,
            `面积为 $\\frac{1}{2} d_{1} d_{2} = \\frac{1}{2} \\cdot ${d1} \\cdot ${d2} = ${area.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "side-of-a-rhombus-from-its-diagonals",
      t("The side of a rhombus from its diagonals", "由对角线求菱形的边长"),
      t(
        "The diagonals of a rhombus bisect each other at right angles, so they cut the rhombus into four congruent right triangles whose legs are **half** the diagonals and whose hypotenuse is a side. A rhombus with diagonals $12$ and $16$ has legs $6$ and $8$, so each side is $\\sqrt{6^{2} + 8^{2}} = 10$ and the perimeter is $40$.",
        "菱形的对角线互相垂直平分，所以把菱形分成四个全等的直角三角形，直角边是两条对角线的**一半**，斜边是菱形的一边。对角线为 $12$ 和 $16$ 的菱形，直角边为 $6$ 和 $8$，所以每边长 $\\sqrt{6^{2} + 8^{2}} = 10$，周长为 $40$。",
      ),
      (rng) => {
        const [p, q, h] = rng.pick(halfDiagonals);
        const [a, b] = rng.bool() ? [p, q] : [q, p];
        const askPer = rng.bool();
        const answer = askPer ? 4 * h : h;
        const full = Math.round(Math.sqrt(4 * a * a + 4 * b * b));
        return numberProblem({
          prompt: t(
            `The diagonals of a rhombus have lengths $${2 * a}$ and $${2 * b}$. What is the ${askPer ? "perimeter" : "length of one side"} of the rhombus?`,
            `一个菱形的两条对角线长分别为 $${2 * a}$ 和 $${2 * b}$。这个菱形的${askPer ? "周长" : "边长"}是多少？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(
            Q.of(answer),
            askPer ? [Q.of(4 * full), Q.of(4 * (a + b)), Q.of(h), Q.of(2 * (2 * a + 2 * b))] : [Q.of(full), Q.of(a + b), Q.of(2 * h)],
          ),
          solution: t(
            `Half the diagonals are $${a}$ and $${b}$, the legs of a right triangle whose hypotenuse is a side: $\\sqrt{${a}^{2} + ${b}^{2}} = ${h}$.${askPer ? ` The perimeter is $4 \\cdot ${h} = ${4 * h}$.` : ""}`,
            `对角线的一半为 $${a}$ 和 $${b}$，它们是以菱形一边为斜边的直角三角形的直角边：$\\sqrt{${a}^{2} + ${b}^{2}} = ${h}$。${askPer ? `周长为 $4 \\cdot ${h} = ${4 * h}$。` : ""}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Solids

/** heightMapSvg draws the top view of a stack of cubes, each cell labeled with the number of cubes in it. */
function heightMapSvg(h: readonly (readonly number[])[]): string {
  const cell = 34;
  const x0 = 160 - (h[0]!.length * cell) / 2;
  const y0 = 10;
  let out = "";
  for (const [i, row] of h.entries())
    for (const [j, v] of row.entries()) {
      out += `<rect x="${x0 + j * cell}" y="${y0 + i * cell}" width="${cell}" height="${cell}" fill="currentColor" fill-opacity="${0.08 + 0.07 * v}"/>`;
      out += `<text x="${x0 + (j + 0.5) * cell}" y="${y0 + (i + 0.5) * cell + 5}">${v}</text>`;
    }
  return svgDocument(y0 + h.length * cell + 10, out);
}

/** viewSvg draws a front view and a side view of a stack of cubes as columns of squares. */
function viewSvg(front: readonly number[], side: readonly number[]): string {
  const cell = 22;
  const base = 12 + 4 * cell;
  const column = (x0: number, hs: readonly number[]) => {
    let out = "";
    for (const [j, v] of hs.entries())
      for (let k = 0; k < v; k++)
        out += `<rect x="${x0 + j * cell}" y="${base - (k + 1) * cell}" width="${cell}" height="${cell}" fill="currentColor" fill-opacity="0.15"/>`;
    return out;
  };
  const fx = 90 - (front.length * cell) / 2;
  const sx = 230 - (side.length * cell) / 2;
  const out =
    column(fx, front) +
    column(sx, side) +
    `<line x1="40" y1="${base}" x2="140" y2="${base}"/><line x1="180" y1="${base}" x2="280" y2="${base}"/>`;
  return svgDocument(base + 10, out);
}

/** volumesFromOrthographicViews counts the cubes in a stack from its views and finds its volume. */
export const volumesFromOrthographicViews = topic(
  "volumes-from-orthographic-views",
  t("Volumes From Orthographic Views", "由三视图求体积"),
  t(
    "Find the volume of a stack of cubes from a top view labeled with heights, and the greatest number of cubes a stack can have given its front and side views.",
    "由标有高度的俯视图求一堆立方体的体积，并由主视图和侧视图求这堆立方体最多有多少个。",
  ),
  ["volumes-of-cubes", "understanding-volume-using-unit-cubes"],
  ["G-GMD.B.4", "6.G.A.4"],
  [
    kp(
      "volume-from-a-labeled-top-view",
      t("Volume from a labeled top view", "由标有高度的俯视图求体积"),
      t(
        "A **top view** shows a stack of cubes from directly above. If each square of the top view is labeled with the number of cubes stacked there, the total number of cubes is the sum of the labels. If each cube has edge length $e$, the volume is that number times $e^{3}$. A top view with labels $3, 1, 2, 2$ shows $8$ cubes; with edge $2$ cm, the volume is $8 \\cdot 8 = 64 \\text{ cm}^{3}$.",
        "**俯视图**是从正上方看一堆立方体所得的图。如果俯视图的每个方格都标出该处叠放的立方体个数，立方体总数就是这些数的和。若每个立方体的棱长为 $e$，体积就是这个总数乘以 $e^{3}$。标有 $3, 1, 2, 2$ 的俯视图表示 $8$ 个立方体；棱长为 $2$ cm 时，体积为 $8 \\cdot 8 = 64 \\text{ cm}^{3}$。",
      ),
      (rng) => {
        const rows = rng.int(2, 3);
        const cols = rng.int(2, 4);
        const h = Array.from({ length: rows }, () => Array.from({ length: cols }, () => rng.int(1, 4)));
        const count = h.flat().reduce((s, v) => s + v, 0);
        const e = rng.int(1, 4);
        const answer = count * e ** 3;
        const figure: Figure = {
          svg: heightMapSvg(h),
          alt: t(
            `Top view of a stack of cubes, ${rows} rows by ${cols} columns. The rows, from top to bottom, have heights ${h.map((row) => row.join(", ")).join("; ")}.`,
            `一堆立方体的俯视图，${rows} 行 ${cols} 列。从上到下各行的高度为 ${h.map((row) => row.join("，")).join("；")}。`,
          ),
        };
        return {
          ...numberProblem({
            prompt: t(
              `The figure is the top view of a stack of cubes, each with edge length $${e}$ cm. Each square shows how many cubes are stacked there. What is the volume of the stack, in cubic centimeters?`,
              `图为一堆立方体的俯视图，每个立方体的棱长为 $${e}$ cm。每个方格中的数表示该处叠放的立方体个数。这堆立方体的体积是多少立方厘米？`,
            ),
            answer,
            form: "integer",
            wrong: distinct(Q.of(answer), [Q.of(count), Q.of(count * e), Q.of(count * e * e), Q.of(rows * cols * e ** 3)]),
            solution: t(
              `The stack has $${h.flat().join(" + ")} = ${count}$ cubes, each of volume $${e}^{3} = ${e ** 3}$, so the volume is $${count} \\cdot ${e ** 3} = ${answer} \\text{ cm}^{3}$.`,
              `这堆共有 $${h.flat().join(" + ")} = ${count}$ 个立方体，每个体积为 $${e}^{3} = ${e ** 3}$，所以体积为 $${count} \\cdot ${e ** 3} = ${answer} \\text{ cm}^{3}$。`,
            ),
          }),
          figure,
        };
      },
    ),
    kp(
      "most-cubes-from-front-and-side-views",
      t("The most cubes from front and side views", "由主视图和侧视图求最多的立方体个数"),
      t(
        "Put a stack of cubes on a rectangular grid. The **front view** shows the tallest stack in each column, and the **side view** shows the tallest stack in each row. A stack can be no taller than either of these, so the greatest number of cubes is found by placing in each square the smaller of its column's front height and its row's side height and adding. With front view $2, 1$ and side view $2, 2$, the squares hold at most $2, 1, 2, 1$, so at most $6$ cubes.",
        "把一堆立方体放在长方形网格上。**主视图**给出每一列中最高的一叠，**侧视图**给出每一行中最高的一叠。每个方格中的一叠都不能高过这两者，所以在每个方格放上所在列的主视高度与所在行的侧视高度中较小的那个，再相加，就得到最多的立方体个数。主视图为 $2, 1$、侧视图为 $2, 2$ 时，各方格最多放 $2, 1, 2, 1$ 个，所以最多 $6$ 个立方体。",
      ),
      (rng) => {
        const cols = rng.int(2, 4);
        const rows = rng.int(2, 3);
        const top = rng.int(2, 4);
        const front = Array.from({ length: cols }, () => rng.int(1, top));
        const side = Array.from({ length: rows }, () => rng.int(1, top));
        front[rng.int(0, cols - 1)] = top;
        side[rng.int(0, rows - 1)] = top;
        const cells = side.map((s) => front.map((f) => Math.min(f, s)));
        const most = cells.flat().reduce((sum, v) => sum + v, 0);
        const fs = front.reduce((a, b) => a + b, 0);
        const ss = side.reduce((a, b) => a + b, 0);
        const figure: Figure = {
          svg: viewSvg(front, side),
          alt: t(
            `Front view with column heights ${front.join(", ")}, and side view with row heights ${side.join(", ")}.`,
            `主视图各列高度为 ${front.join("，")}，侧视图各行高度为 ${side.join("，")}。`,
          ),
        };
        return {
          ...numberProblem({
            prompt: t(
              `A stack of identical cubes sits on a grid of ${rows} rows and ${cols} columns. Its front view is on the left and its side view is on the right. What is the greatest number of cubes the stack could contain?`,
              `一堆相同的立方体放在 ${rows} 行 ${cols} 列的网格上，左图是主视图，右图是侧视图。这堆立方体最多可能有多少个？`,
            ),
            answer: most,
            form: "integer",
            wrong: distinct(Q.of(most), [Q.of(fs + ss), Q.of(fs * rows), Q.of(rows * cols * top), Q.of(Math.max(fs, ss))]),
            solution: t(
              `In each square put the smaller of the column's front height and the row's side height. Row by row, the squares hold ${cells.map((row) => row.join(", ")).join("; ")}, for a total of $${most}$ cubes.`,
              `在每个方格放上所在列的主视高度与所在行的侧视高度中较小的那个。逐行来看，各方格分别放 ${cells.map((row) => row.join("，")).join("；")} 个，共 $${most}$ 个立方体。`,
            ),
          }),
          figure,
        };
      },
    ),
  ],
);

/** spheresAndCubesInscribedInEachOther relates the dimensions of a sphere and a cube inscribed in one another. */
export const spheresAndCubesInscribedInEachOther = topic(
  "spheres-and-cubes-inscribed-in-each-other",
  t("Spheres and Cubes Inscribed in Each Other", "球与立方体的内切与外接"),
  t(
    "Use the edge of a cube as the diameter of its inscribed sphere, and the space diagonal of a cube as the diameter of its circumscribed sphere.",
    "利用立方体的棱长等于其内切球的直径、立方体的体对角线等于其外接球的直径解题。",
  ),
  ["volumes-of-spheres", "diagonals-of-cubes"],
  ["G-GMD.A.3", "G-MG.A.1"],
  [
    kp(
      "a-sphere-inside-a-cube",
      t("A sphere inside a cube", "立方体内的球"),
      t(
        "A sphere inscribed in a cube touches the center of every face, so its diameter equals the edge $e$ of the cube and its radius is $\\frac{e}{2}$. Its volume is $\\frac{4}{3}\\pi \\left(\\frac{e}{2}\\right)^{3} = \\frac{\\pi e^{3}}{6}$ and its surface area is $4\\pi\\left(\\frac{e}{2}\\right)^{2} = \\pi e^{2}$. In a cube of edge $6$, the inscribed sphere has volume $36\\pi$.",
        "立方体的内切球与每个面的中心相切，所以它的直径等于立方体的棱长 $e$，半径为 $\\frac{e}{2}$。它的体积为 $\\frac{4}{3}\\pi \\left(\\frac{e}{2}\\right)^{3} = \\frac{\\pi e^{3}}{6}$，表面积为 $4\\pi\\left(\\frac{e}{2}\\right)^{2} = \\pi e^{2}$。棱长为 $6$ 的立方体，其内切球的体积为 $36\\pi$。",
      ),
      (rng) => {
        const e = rng.int(2, 14);
        const mode = rng.int(0, 2);
        if (mode === 2) {
          const rad = rng.int(1, 9);
          const answer = 8 * rad ** 3;
          return numberProblem({
            prompt: t(
              `A sphere of radius $${rad}$ fits exactly inside a cube, touching every face. What is the volume of the cube?`,
              `一个半径为 $${rad}$ 的球恰好放在一个立方体内，与每个面都相切。这个立方体的体积是多少？`,
            ),
            answer,
            form: "integer",
            wrong: distinct(Q.of(answer), [Q.of(rad ** 3), Q.of(6 * rad * rad), Q.of(4 * rad ** 3)]),
            solution: t(
              `The edge of the cube equals the diameter $${2 * rad}$, so the volume is $${2 * rad}^{3} = ${answer}$.`,
              `立方体的棱长等于直径 $${2 * rad}$，所以体积为 $${2 * rad}^{3} = ${answer}$。`,
            ),
          });
        }
        const volume = mode === 0;
        const k = volume ? Q.of(e ** 3, 6) : Q.of(e * e);
        return numberProblem({
          prompt: t(
            `A sphere is inscribed in a cube with edge length $${e}$. The ${volume ? "volume" : "surface area"} of the sphere is $k\\pi$. What is the value of $k$?`,
            `一个球内切于棱长为 $${e}$ 的立方体。球的${volume ? "体积" : "表面积"}为 $k\\pi$。求 $k$ 的值。`,
          ),
          answer: k,
          form: "fraction",
          wrong: distinct(
            k,
            volume ? [Q.of(4 * e ** 3, 3), Q.of(e ** 3, 2), Q.of(e * e)] : [Q.of(4 * e * e), Q.of(2 * e * e), Q.of(e * e, 4)],
          ),
          solution: volume
            ? t(
                `The radius is $\\frac{${e}}{2}$, so the volume is $\\frac{4}{3}\\pi \\left(\\frac{${e}}{2}\\right)^{3} = ${k.toLatex()}\\pi$ and $k = ${k.toLatex()}$.`,
                `半径为 $\\frac{${e}}{2}$，所以体积为 $\\frac{4}{3}\\pi \\left(\\frac{${e}}{2}\\right)^{3} = ${k.toLatex()}\\pi$，$k = ${k.toLatex()}$。`,
              )
            : t(
                `The radius is $\\frac{${e}}{2}$, so the surface area is $4\\pi \\left(\\frac{${e}}{2}\\right)^{2} = ${k.toLatex()}\\pi$ and $k = ${k.toLatex()}$.`,
                `半径为 $\\frac{${e}}{2}$，所以表面积为 $4\\pi \\left(\\frac{${e}}{2}\\right)^{2} = ${k.toLatex()}\\pi$，$k = ${k.toLatex()}$。`,
              ),
        });
      },
    ),
    kp(
      "a-cube-inside-a-sphere",
      t("A cube inside a sphere", "球内的立方体"),
      t(
        "A cube inscribed in a sphere has all eight vertices on the sphere, so its space diagonal, $e\\sqrt{3}$, is a diameter of the sphere. A cube with edge $4$ fits in a sphere of radius $2\\sqrt{3}$. Going the other way, a sphere of diameter $d\\sqrt{3}$ holds an inscribed cube with edge $d$ and volume $d^{3}$.",
        "内接于球的立方体的八个顶点都在球面上，所以它的体对角线 $e\\sqrt{3}$ 是球的直径。棱长为 $4$ 的立方体内接于半径为 $2\\sqrt{3}$ 的球。反过来，直径为 $d\\sqrt{3}$ 的球，其内接立方体的棱长为 $d$，体积为 $d^{3}$。",
      ),
      (rng) => {
        const e = rng.int(2, 16);
        if (rng.bool()) {
          const k = Q.of(e, 2);
          return numberProblem({
            prompt: t(
              `A cube with edge length $${e}$ is inscribed in a sphere. The radius of the sphere is $k\\sqrt{3}$. What is the value of $k$?`,
              `棱长为 $${e}$ 的立方体内接于一个球。球的半径为 $k\\sqrt{3}$。求 $k$ 的值。`,
            ),
            answer: k,
            form: "fraction",
            wrong: distinct(k, [Q.of(e), Q.of(e, 3), Q.of(e, 4)]),
            solution: t(
              `The space diagonal $${e}\\sqrt{3}$ is a diameter, so the radius is $\\frac{${e}\\sqrt{3}}{2}$ and $k = ${k.toLatex()}$.`,
              `体对角线 $${e}\\sqrt{3}$ 是直径，所以半径为 $\\frac{${e}\\sqrt{3}}{2}$，$k = ${k.toLatex()}$。`,
            ),
          });
        }
        const answer = e ** 3;
        return numberProblem({
          prompt: t(
            `A cube is inscribed in a sphere with diameter $${e}\\sqrt{3}$. What is the volume of the cube?`,
            `一个立方体内接于直径为 $${e}\\sqrt{3}$ 的球。这个立方体的体积是多少？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(3 * e ** 3), Q.of(e * e * 3), Q.of(e * e * e, 8), Q.of(e * e)]),
          solution: t(
            `The diameter is the space diagonal $e\\sqrt{3}$, so $e = ${e}$ and the volume is $${e}^{3} = ${answer}$.`,
            `直径等于体对角线 $e\\sqrt{3}$，所以 $e = ${e}$，体积为 $${e}^{3} = ${answer}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Circles in the coordinate plane

/** circleTerm writes (x − h)² + (y − k)² for a center (h, k). */
function circleTerm(h: number, k: number): string {
  const part = (v: string, c: number) => (c === 0 ? `${v}^{2}` : `(${v} ${c > 0 ? "-" : "+"} ${Math.abs(c)})^{2}`);
  return `${part("x", h)} + ${part("y", k)}`;
}

/** lineTerm writes mx + c. */
function lineTerm(m: number, c: number): string {
  const head = m === 0 ? "" : m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
  if (head === "") return String(c);
  return c === 0 ? head : `${head} ${c < 0 ? "-" : "+"} ${Math.abs(c)}`;
}

/** graphingSystemsOfLinearAndCircularInequalities tests points against, and describes, a system of a circular and a linear inequality. */
export const graphingSystemsOfLinearAndCircularInequalities = topic(
  "graphing-systems-of-linear-and-circular-inequalities",
  t("Graphing Systems of Linear and Circular Inequalities", "线性不等式与圆形不等式组的图象"),
  t(
    "Decide whether points satisfy a system of a circular and a linear inequality, and match the system to the region inside or outside a circle and above or below a line.",
    "判断点是否满足由一个圆形不等式和一个线性不等式组成的不等式组，并把不等式组与圆内或圆外、直线上方或下方的区域对应起来。",
  ),
  ["equations-of-circles", "systems-of-linear-inequalities"],
  ["A-REI.D.12", "G-GPE.A.1"],
  [
    kp(
      "testing-points-in-the-system",
      t("Testing points in the system", "检验点是否满足不等式组"),
      t(
        "The inequality $(x - h)^{2} + (y - k)^{2} < r^{2}$ holds for the points inside the circle with center $(h, k)$ and radius $r$; with $>$ it holds outside, and $\\le$ or $\\ge$ also includes the circle. A point is a solution of the system only if it satisfies both inequalities. To test $(1, 2)$ in $x^{2} + y^{2} \\le 9$ and $y > x$: $1 + 4 = 5 \\le 9$ and $2 > 1$, so it is a solution.",
        "不等式 $(x - h)^{2} + (y - k)^{2} < r^{2}$ 对以 $(h, k)$ 为圆心、$r$ 为半径的圆内部的点成立；若为 $>$，则对圆外部的点成立；$\\le$ 或 $\\ge$ 还包括圆本身。一个点只有同时满足两个不等式才是不等式组的解。检验 $(1, 2)$ 是否满足 $x^{2} + y^{2} \\le 9$ 与 $y > x$：$1 + 4 = 5 \\le 9$，$2 > 1$，所以它是解。",
      ),
      (rng) => {
        const h = rng.int(-3, 3);
        const k = rng.int(-3, 3);
        const rad = rng.int(2, 6);
        const inside = rng.bool(0.7);
        const m = rng.pick([-2, -1, 0, 1, 2]);
        const c = rng.int(-4, 4);
        const above = rng.bool();
        const inCircle = (x: number, y: number) => {
          const d = (x - h) ** 2 + (y - k) ** 2;
          return inside ? d <= rad * rad : d >= rad * rad;
        };
        const inLine = (x: number, y: number) => (above ? y > m * x + c : y < m * x + c);
        const pts = Array.from({ length: 4 }, () => [rng.int(h - rad - 1, h + rad + 1), rng.int(k - rad - 1, k + rad + 1)] as const);
        const ok = pts.map(([x, y]) => inCircle(x, y) && inLine(x, y));
        const count = ok.filter(Boolean).length;
        const sys = `${circleTerm(h, k)} ${inside ? "\\le" : "\\ge"} ${rad * rad}`;
        const lin = `y ${above ? ">" : "<"} ${lineTerm(m, c)}`;
        return numberProblem({
          prompt: t(
            `How many of the points ${pts.map(([x, y]) => `$(${x}, ${y})$`).join(", ")} satisfy both $${sys}$ and $${lin}$?`,
            `点 ${pts.map(([x, y]) => `$(${x}, ${y})$`).join("、")} 中，有几个同时满足 $${sys}$ 和 $${lin}$？`,
          ),
          answer: count,
          form: "integer",
          wrong: distinct(Q.of(count), [
            Q.of(pts.filter(([x, y]) => inCircle(x, y)).length),
            Q.of(pts.filter(([x, y]) => inLine(x, y)).length),
            Q.of(4 - count),
          ]),
          solution: t(
            `Test each point in both inequalities: ${pts.map(([x, y], i) => `$(${x}, ${y})$ ${ok[i] ? "satisfies both" : inCircle(x, y) ? "fails the line inequality" : "fails the circle inequality"}`).join("; ")}. So $${count}$ of the points satisfy the system.`,
            `把每个点代入两个不等式检验：${pts.map(([x, y], i) => `$(${x}, ${y})$ ${ok[i] ? "两个都满足" : inCircle(x, y) ? "不满足直线不等式" : "不满足圆的不等式"}`).join("；")}。所以有 $${count}$ 个点满足不等式组。`,
          ),
        });
      },
    ),
    kp(
      "reading-a-system-from-its-graph",
      t("Reading a system from its graph", "由图象读出不等式组"),
      t(
        "A shaded graph of a system answers two questions, one for each boundary. If the shading is inside the circle, the circle inequality uses $\\le$; if it is outside, $\\ge$. If the shading is above the line, the line inequality is $y \\ge mx + c$; if below, $y \\le mx + c$. Check the choice with any point of the shaded region, which must satisfy both inequalities.",
        "不等式组的阴影图象对每条边界各回答一个问题。阴影在圆内，圆的不等式用 $\\le$；在圆外，用 $\\ge$。阴影在直线上方，直线的不等式是 $y \\ge mx + c$；在下方，是 $y \\le mx + c$。再用阴影区域中的任意一点检验：它必须同时满足两个不等式。",
      ),
      (rng) => {
        for (;;) {
          const h = rng.int(-2, 2);
          const k = rng.int(-2, 2);
          const rad = rng.int(3, 4);
          const m = rng.pick([-2, -1, 0, 1, 2]);
          const c = rng.int(-4, 4);
          // The line must cut well through the circle, and must not lie on the x-axis.
          if (Math.abs(m * h - k + c) / Math.hypot(m, 1) > rad - 1 || (m === 0 && c === 0)) continue;
          const inside = rng.bool();
          const above = rng.bool();
          const inRegion = (x: number, y: number) =>
            (inside ? (x - h) ** 2 + (y - k) ** 2 < rad * rad : (x - h) ** 2 + (y - k) ** 2 > rad * rad) &&
            (above ? y > m * x + c : y < m * x + c);
          const lattice: [number, number][] = [];
          for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) if (inRegion(x, y)) lattice.push([x, y]);
          if (lattice.length === 0) continue;
          const [px, py] = lattice[Math.floor(lattice.length / 2)]!;
          const sys = (i: boolean, a: boolean) =>
            t(
              `$${circleTerm(h, k)} ${i ? "\\le" : "\\ge"} ${rad * rad}$ and $y ${a ? "\\ge" : "\\le"} ${lineTerm(m, c)}$`,
              `$${circleTerm(h, k)} ${i ? "\\le" : "\\ge"} ${rad * rad}$ 且 $y ${a ? "\\ge" : "\\le"} ${lineTerm(m, c)}$`,
            );
          const view: PlaneView = { xMin: -7, xMax: 7, yMin: -7, yMax: 7 };
          const lineAt = (x: number) => m * x + c;
          const figure: Figure = {
            svg: plane(view, [
              { kind: "region", halfPlanes: [above ? [-m, 1, -c] : [m, -1, c]], disk: { center: [h, k], r: rad, outside: !inside } },
              { kind: "circle", center: [h, k], r: rad, accent: true },
              { kind: "line", a: [0, c], b: [1, lineAt(1)], accent: true },
            ]),
            alt: t(
              `The circle with center (${h}, ${k}) and radius ${rad} and the line y = ${lineTerm(m, c).replace(/-/g, "−")}, with the region ${inside ? "inside" : "outside"} the circle and ${above ? "above" : "below"} the line shaded.`,
              `以 (${h}, ${k}) 为圆心、${rad} 为半径的圆与直线 y = ${lineTerm(m, c).replace(/-/g, "−")}，圆${inside ? "内" : "外"}且直线${above ? "上方" : "下方"}的区域涂有阴影。`,
            ),
          };
          const d = (px - h) ** 2 + (py - k) ** 2;
          const part = (v: number, c: number) =>
            c === 0 ? `${v < 0 ? `(${v})` : v}^{2}` : `(${v} ${c > 0 ? "-" : "+"} ${Math.abs(c)})^{2}`;
          const plugged = `${part(px, h)} + ${part(py, k)}`;
          return pickChoice(
            rng,
            t(
              `The graph shows the circle $${circleTerm(h, k)} = ${rad * rad}$ and the line $y = ${lineTerm(m, c)}$. The shaded region, with its boundary, is the graph of which system?`,
              `图中是圆 $${circleTerm(h, k)} = ${rad * rad}$ 与直线 $y = ${lineTerm(m, c)}$。阴影区域（含边界）是哪个不等式组的图象？`,
            ),
            sys(inside, above),
            [sys(!inside, above), sys(inside, !above), sys(!inside, !above)],
            t(
              `The shading is ${inside ? "inside" : "outside"} the circle, so the circle inequality uses $${inside ? "\\le" : "\\ge"}$, and ${above ? "above" : "below"} the line, so $y ${above ? "\\ge" : "\\le"} ${lineTerm(m, c)}$. Check with the shaded point $(${px}, ${py})$: $${plugged} = ${d} ${inside ? "\\le" : "\\ge"} ${rad * rad}$ and $${py} ${above ? "\\ge" : "\\le"} ${lineAt(px)}$.`,
              `阴影在圆${inside ? "内" : "外"}，所以圆的不等式用 $${inside ? "\\le" : "\\ge"}$；在直线${above ? "上方" : "下方"}，所以 $y ${above ? "\\ge" : "\\le"} ${lineTerm(m, c)}$。用阴影中的点 $(${px}, ${py})$ 检验：$${plugged} = ${d} ${inside ? "\\le" : "\\ge"} ${rad * rad}$，且 $${py} ${above ? "\\ge" : "\\le"} ${lineAt(px)}$。`,
            ),
            figure,
          );
        }
      },
    ),
    kp(
      "matching-a-system-to-its-region",
      t("Matching a system to its region", "把不等式组与区域对应"),
      t(
        "Read each inequality as a region. $(x - h)^{2} + (y - k)^{2} \\le r^{2}$ is the disk inside the circle, including the circle, and $\\ge$ is the outside. $y \\ge mx + c$ is on or above the line and $y \\le mx + c$ is on or below it. The graph of the system is where the two regions overlap, so a description such as inside the circle and below the line pairs $\\le$ for the circle with $\\le$ for the line.",
        "把每个不等式看作一个区域。$(x - h)^{2} + (y - k)^{2} \\le r^{2}$ 是圆内部（包括圆本身），$\\ge$ 是圆外部。$y \\ge mx + c$ 是直线上及其上方，$y \\le mx + c$ 是直线上及其下方。不等式组的图象是两个区域的重叠部分，所以像“圆内且直线下方”这样的描述对应圆的 $\\le$ 和直线的 $\\le$。",
      ),
      (rng) => {
        const h = rng.int(-4, 4);
        const k = rng.int(-4, 4);
        const rad = rng.int(1, 7);
        const m = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.int(-5, 5);
        const inside = rng.bool();
        const above = rng.bool();
        const sys = (i: boolean, a: boolean) =>
          t(
            `$${circleTerm(h, k)} ${i ? "\\le" : "\\ge"} ${rad * rad}$ and $y ${a ? "\\ge" : "\\le"} ${lineTerm(m, c)}$`,
            `$${circleTerm(h, k)} ${i ? "\\le" : "\\ge"} ${rad * rad}$ 且 $y ${a ? "\\ge" : "\\le"} ${lineTerm(m, c)}$`,
          );
        const wrongCenter = t(
          `$${circleTerm(-h, -k)} ${inside ? "\\le" : "\\ge"} ${rad * rad}$ and $y ${above ? "\\ge" : "\\le"} ${lineTerm(m, c)}$`,
          `$${circleTerm(-h, -k)} ${inside ? "\\le" : "\\ge"} ${rad * rad}$ 且 $y ${above ? "\\ge" : "\\le"} ${lineTerm(m, c)}$`,
        );
        const center = `(${h}, ${k})`;
        return pickChoice(
          rng,
          t(
            `The graph of a system is the set of points ${inside ? "on or inside" : "on or outside"} the circle with center $${center}$ and radius $${rad}$ that are also on or ${above ? "above" : "below"} the line $y = ${lineTerm(m, c)}$. Which system has this graph?`,
            `某不等式组的图象是：在以 $${center}$ 为圆心、$${rad}$ 为半径的圆${inside ? "上或圆内" : "上或圆外"}，并且在直线 $y = ${lineTerm(m, c)}$ 上或其${above ? "上方" : "下方"}的点的集合。哪个不等式组的图象是它？`,
          ),
          sys(inside, above),
          [sys(!inside, above), sys(inside, !above), h === 0 && k === 0 ? sys(!inside, !above) : wrongCenter],
          t(
            `${inside ? "On or inside" : "On or outside"} the circle is $${circleTerm(h, k)} ${inside ? "\\le" : "\\ge"} ${rad * rad}$, and on or ${above ? "above" : "below"} the line is $y ${above ? "\\ge" : "\\le"} ${lineTerm(m, c)}$.`,
            `圆${inside ? "上或圆内" : "上或圆外"}是 $${circleTerm(h, k)} ${inside ? "\\le" : "\\ge"} ${rad * rad}$，直线上或其${above ? "上方" : "下方"}是 $y ${above ? "\\ge" : "\\le"} ${lineTerm(m, c)}$。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Statistics and probability

/** studyGroups are populations a study can be about. */
const studyGroups = [
  { en: "students at a high school", zh: "一所高中的学生", n: [1200, 1500, 1800, 2400] },
  { en: "employees of a company", zh: "一家公司的员工", n: [300, 450, 600, 800] },
  { en: "residents of a town", zh: "一个镇的居民", n: [5000, 8000, 12000] },
  { en: "members of a gym", zh: "一家健身房的会员", n: [400, 650, 900] },
  { en: "patients at a clinic", zh: "一家诊所的病人", n: [700, 1100, 1600] },
] as const;

/** studyTopics are what a study measures, with a treatment that could be assigned. */
const studyTopics = [
  {
    en: "hours of sleep",
    zh: "睡眠时长",
    treat: "a new sleep app",
    treatZh: "一款新的睡眠应用",
    habit: "drink coffee after noon",
    habitZh: "午后喝咖啡",
  },
  {
    en: "test scores",
    zh: "考试成绩",
    treat: "a new study program",
    treatZh: "一个新的学习计划",
    habit: "study with music on",
    habitZh: "边听音乐边学习",
  },
  {
    en: "blood pressure",
    zh: "血压",
    treat: "a daily walking plan",
    treatZh: "每日散步计划",
    habit: "eat breakfast every day",
    habitZh: "每天吃早餐",
  },
  {
    en: "weekly exercise time",
    zh: "每周锻炼时间",
    treat: "a fitness tracker",
    treatZh: "一个健身手环",
    habit: "commute by bike",
    habitZh: "骑车通勤",
  },
] as const;

/** studyKinds are the kinds of statistical study. */
const studyKinds = [
  t("A census", "普查"),
  t("A sample survey", "抽样调查"),
  t("An experiment", "实验"),
  t("An observational study", "观察研究"),
] as const;

/** scopeConclusions are the conclusions a study's design allows. */
const scopeConclusions = [
  t("A cause-and-effect conclusion that applies to the whole population", "适用于整个总体的因果结论"),
  t("A cause-and-effect conclusion that applies only to the people in the study", "只适用于研究对象的因果结论"),
  t("An association, but not cause and effect, that applies to the whole population", "适用于整个总体的相关关系（而非因果关系）"),
  t("An association, but not cause and effect, that applies only to the people in the study", "只适用于研究对象的相关关系（而非因果关系）"),
] as const;

/** classifyingStatisticalStudies tells censuses, sample surveys, experiments and observational studies apart and the conclusions each allows. */
export const classifyingStatisticalStudies = topic(
  "classifying-statistical-studies",
  t("Classifying Statistical Studies", "统计研究的分类"),
  t(
    "Classify a study as a census, a sample survey, an experiment or an observational study, and tell which conclusions random sampling and random assignment allow.",
    "把研究分为普查、抽样调查、实验或观察研究，并说出随机抽样和随机分组各自允许得出的结论。",
  ),
  ["biased-and-unbiased-samples", "correlation-and-causation"],
  ["S-IC.B.3", "S-IC.A.1"],
  [
    kp(
      "naming-the-kind-of-study",
      t("Naming the kind of study", "说出研究的类型"),
      t(
        "A **census** collects data from every member of the population. A **sample survey** collects data from a subset, ideally chosen at random, without changing anything. An **experiment** imposes a treatment, ideally assigning it at random, and compares the results with a control group. An **observational study** records what subjects already do, such as their habits, and compares groups without assigning anything.",
        "**普查**收集总体中每一个成员的数据。**抽样调查**从总体的一部分（最好随机选取）收集数据，不改变任何条件。**实验**施加某种处理（最好随机分配），并把结果与对照组比较。**观察研究**记录研究对象本来的行为（如生活习惯），比较各组而不分配任何处理。",
      ),
      (rng) => {
        const g = rng.pick(studyGroups);
        const s = rng.pick(studyTopics);
        const total = rng.pick(g.n);
        const n = rng.pick([40, 60, 80, 100, 120, 150, 200]);
        const kind = rng.int(0, 3);
        const prompt = [
          t(`A researcher records the ${s.en} of every one of the ${total} ${g.en}.`, `一位研究者记录了全部 ${total} 名${g.zh}的${s.zh}。`),
          t(
            `A researcher randomly selects ${n} of the ${total} ${g.en} and asks them about their ${s.en}.`,
            `一位研究者从 ${total} 名${g.zh}中随机选取 ${n} 人，询问他们的${s.zh}。`,
          ),
          t(
            `A researcher randomly assigns ${n} ${g.en} to use ${s.treat} or not, and then compares the ${s.en} of the two groups.`,
            `一位研究者把 ${n} 名${g.zh}随机分为两组，一组使用${s.treatZh}，一组不使用，然后比较两组的${s.zh}。`,
          ),
          t(
            `A researcher asks ${n} ${g.en} whether they ${s.habit}, and compares the ${s.en} of those who do with those who do not.`,
            `一位研究者询问 ${n} 名${g.zh}是否${s.habitZh}，并比较这样做的人与不这样做的人的${s.zh}。`,
          ),
        ][kind]!;
        const why = [
          t("data come from every member of the population", "数据来自总体中的每一个成员"),
          t("data come from part of the population and nothing is imposed", "数据来自总体的一部分，且没有施加任何处理"),
          t("the researcher assigns a treatment and compares groups", "研究者分配了处理并比较各组"),
          t(
            "the researcher compares groups that chose their own habit, assigning nothing",
            "研究者比较的是自己选择习惯的各组，没有分配任何处理",
          ),
        ][kind]!;
        return pickChoice(
          rng,
          t(`${prompt.en} Which kind of study is this?`, `${prompt["zh-CN"]}这是哪种研究？`),
          studyKinds[kind]!,
          studyKinds.filter((_, i) => i !== kind),
          t(`It is ${studyKinds[kind]!.en.toLowerCase()}, since ${why.en}.`, `这是${studyKinds[kind]!["zh-CN"]}，因为${why["zh-CN"]}。`),
        );
      },
    ),
    kp(
      "what-the-design-allows",
      t("What the design allows", "研究设计允许的结论"),
      t(
        "**Random assignment** of treatments is what allows a cause-and-effect conclusion; without it, a difference between groups shows only an association, since the groups may differ in other ways. **Random sampling** from a population is what allows the results to be generalized to that population; volunteers or a convenient group speak only for themselves. The two questions are separate, so a study can have either, both or neither.",
        "处理的**随机分配**才能得出因果结论；没有随机分配，组间差异只说明相关，因为各组可能在其他方面也不同。从总体中**随机抽样**才能把结果推广到总体；志愿者或方便选取的人群只能代表他们自己。这两个问题彼此独立，一项研究可以具备其中一种、两种都具备或都不具备。",
      ),
      (rng) => {
        const g = rng.pick(studyGroups);
        const s = rng.pick(studyTopics);
        const n = rng.pick([40, 60, 80, 100, 120, 150, 200]);
        const sampled = rng.bool();
        const assigned = rng.bool();
        const who = sampled
          ? t(`randomly selects ${n} of the ${g.en}`, `从${g.zh}中随机选取 ${n} 人`)
          : t(`recruits ${n} volunteers from the ${g.en}`, `从${g.zh}中招募 ${n} 名志愿者`);
        const what = assigned
          ? t(
              `randomly assigns half of them to use ${s.treat}, and finds that this group has better ${s.en}`,
              `把他们随机分成两半，其中一半使用${s.treatZh}，发现这一组的${s.zh}更好`,
            )
          : t(
              `asks whether they ${s.habit}, and finds that those who do have better ${s.en}`,
              `询问他们是否${s.habitZh}，发现这样做的人${s.zh}更好`,
            );
        const k = (assigned ? 0 : 2) + (sampled ? 0 : 1);
        return pickChoice(
          rng,
          t(
            `A researcher ${who.en}, ${what.en}. Which conclusion does the design support?`,
            `一位研究者${who["zh-CN"]}，${what["zh-CN"]}。这项研究的设计支持哪种结论？`,
          ),
          scopeConclusions[k]!,
          scopeConclusions.filter((_, i) => i !== k),
          t(
            `${assigned ? "The treatment was randomly assigned, so cause and effect is supported" : "Nothing was assigned, so only an association is supported"}; ${sampled ? "the subjects were a random sample, so the result applies to the population" : "the subjects were volunteers, so the result applies only to them"}.`,
            `${assigned ? "处理是随机分配的，所以支持因果结论" : "没有分配任何处理，所以只支持相关关系"}；${sampled ? "研究对象是随机样本，所以结果适用于总体" : "研究对象是志愿者，所以结果只适用于他们"}。`,
          ),
        );
      },
    ),
  ],
);

/** marbleColors are pairs of colors for a bag of marbles. */
const marbleColors = [
  { a: "red", aZh: "红", b: "blue", bZh: "蓝" },
  { a: "green", aZh: "绿", b: "yellow", bZh: "黄" },
  { a: "white", aZh: "白", b: "black", bZh: "黑" },
] as const;

/** targetFractions are probabilities to aim for, in lowest terms. */
const targetFractions = [
  [1, 2],
  [1, 3],
  [2, 3],
  [1, 4],
  [3, 4],
  [2, 5],
  [3, 5],
  [4, 5],
  [5, 6],
  [3, 8],
  [5, 8],
] as const;

/** adjustingOutcomesToATargetProbability finds how many outcomes to add, or how many there are, given a probability. */
export const adjustingOutcomesToATargetProbability = topic(
  "adjusting-outcomes-to-a-target-probability",
  t("Adjusting Outcomes to a Target Probability", "调整结果数以达到目标概率"),
  t(
    "Solve for the number of outcomes of a kind that gives a stated probability, and for how many to add to reach a target probability.",
    "求出使概率等于给定值的某类结果的个数，以及为达到目标概率需要添加的个数。",
  ),
  ["single-events-in-probability", "equations-with-variables-on-both-sides", "proportions"],
  ["S-CP.A.1", "A-CED.A.1"],
  [
    kp(
      "solving-for-a-count",
      t("Solving for a count given a probability", "由概率求个数"),
      t(
        "If a bag holds $a$ marbles of one color and $n$ of another, the probability of drawing the first color is $\\frac{a}{a + n}$. When the probability is known, set the fraction equal to it and solve for the unknown count. With $6$ red marbles and $P(\\text{red}) = \\frac{2}{5}$, the total is $6 \\div \\frac{2}{5} = 15$, so there are $15 - 6 = 9$ marbles of the other color.",
        "若袋中有某种颜色的弹珠 $a$ 个，另一种颜色的 $n$ 个，则摸到第一种颜色的概率为 $\\frac{a}{a + n}$。已知概率时，令这个分数等于它，解出未知的个数。若有 $6$ 个红弹珠，且 $P(\\text{红}) = \\frac{2}{5}$，则总数为 $6 \\div \\frac{2}{5} = 15$，所以另一种颜色有 $15 - 6 = 9$ 个。",
      ),
      (rng) => {
        const c = rng.pick(marbleColors);
        const [p, q] = rng.pick(targetFractions);
        const m = rng.int(1, 8);
        const a = p * m;
        const total = q * m;
        const n = total - a;
        return numberProblem({
          prompt: t(
            `A bag contains only ${c.a} and ${c.b} marbles. There are $${a}$ ${c.a} marbles, and the probability of drawing a ${c.a} marble at random is $\\frac{${p}}{${q}}$. How many ${c.b} marbles are in the bag?`,
            `一个袋中只有${c.aZh}色和${c.bZh}色弹珠。${c.aZh}色弹珠有 $${a}$ 个，随机摸到${c.aZh}色弹珠的概率为 $\\frac{${p}}{${q}}$。袋中有多少个${c.bZh}色弹珠？`,
          ),
          answer: n,
          form: "integer",
          wrong: distinct(Q.of(n), [Q.of(total), Q.of(q - p), Q.of(a * q - p), Q.of(Math.round((a * (q - p)) / q))]),
          solution: t(
            `The total is $${a} \\div \\frac{${p}}{${q}} = ${total}$, so there are $${total} - ${a} = ${n}$ ${c.b} marbles.`,
            `总数为 $${a} \\div \\frac{${p}}{${q}} = ${total}$，所以${c.bZh}色弹珠有 $${total} - ${a} = ${n}$ 个。`,
          ),
        });
      },
    ),
    kp(
      "adding-to-reach-a-target",
      t("Adding outcomes to reach a target", "添加结果以达到目标概率"),
      t(
        "Adding $x$ marbles of one color increases both that color's count and the total. If there are $a$ of that color among $T$ marbles, the new probability is $\\frac{a + x}{T + x}$. Set it equal to the target and solve. With $3$ red among $10$ and a target of $\\frac{1}{2}$: $\\frac{3 + x}{10 + x} = \\frac{1}{2}$, so $6 + 2x = 10 + x$ and $x = 4$.",
        "加入 $x$ 个某种颜色的弹珠，会同时增加该颜色的个数和总数。若 $T$ 个弹珠中有该颜色 $a$ 个，新的概率为 $\\frac{a + x}{T + x}$。令它等于目标概率并求解。若 $10$ 个中有 $3$ 个红色，目标为 $\\frac{1}{2}$：$\\frac{3 + x}{10 + x} = \\frac{1}{2}$，所以 $6 + 2x = 10 + x$，$x = 4$。",
      ),
      (rng) => {
        const c = rng.pick(marbleColors);
        const [p, q] = rng.pick(targetFractions);
        const m = rng.int(2, 8);
        const finalA = p * m;
        const finalT = q * m;
        const x = rng.int(1, finalA - 1 > 0 ? finalA - 1 : 1);
        const a = finalA - x;
        const b = finalT - finalA;
        if (a < 1 || b < 1) return adjustingOutcomesToATargetProbability.knowledgePoints[1]!.generate(rng);
        const T = a + b;
        const naive = Q.of(p * T - q * a, q);
        return numberProblem({
          prompt: t(
            `A bag contains $${a}$ ${c.a} marbles and $${b}$ ${c.b} marbles. How many ${c.a} marbles must be added so that the probability of drawing a ${c.a} marble at random is $\\frac{${p}}{${q}}$?`,
            `一个袋中有 $${a}$ 个${c.aZh}色弹珠和 $${b}$ 个${c.bZh}色弹珠。需要再加入多少个${c.aZh}色弹珠，才能使随机摸到${c.aZh}色弹珠的概率为 $\\frac{${p}}{${q}}$？`,
          ),
          answer: x,
          form: "integer",
          wrong: distinct(Q.of(x), [naive, Q.of(finalA), Q.of(finalT - T), Q.of(p * T - a > 0 ? p * T - a : x + 1)]),
          solution: t(
            `Solve $\\frac{${a} + x}{${T} + x} = \\frac{${p}}{${q}}$:${steps(`${q}(${a} + x) = ${p}(${T} + x)`, `${q * a} + ${q}x = ${p * T} + ${p}x`, `${q - p === 1 ? "" : q - p}x = ${p * T - q * a}`)}So $x = ${x}$.`,
            `解 $\\frac{${a} + x}{${T} + x} = \\frac{${p}}{${q}}$：${steps(`${q}(${a} + x) = ${p}(${T} + x)`, `${q * a} + ${q}x = ${p * T} + ${p}x`, `${q - p === 1 ? "" : q - p}x = ${p * T - q * a}`)}所以 $x = ${x}$。`,
          ),
        });
      },
    ),
  ],
);

/** PieSet is the data of a circle graph. */
interface PieSet {
  readonly names: readonly string[];
  readonly percents: readonly number[];
}

/** pieSvg draws a circle graph with each sector labeled by its name and percent. */
function pieSvg(d: PieSet): string {
  const [cx, cy, rad] = [160, 96, 86];
  let angle = -Math.PI / 2;
  let out = "";
  for (const [i, pct] of d.percents.entries()) {
    const sweep = (pct / 100) * 2 * Math.PI;
    const [x1, y1] = [cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)];
    const [x2, y2] = [cx + rad * Math.cos(angle + sweep), cy + rad * Math.sin(angle + sweep)];
    out += `<path d="M ${cx} ${cy} L ${r(x1)} ${r(y1)} A ${rad} ${rad} 0 ${pct > 50 ? 1 : 0} 1 ${r(x2)} ${r(y2)} Z" fill="currentColor" fill-opacity="${0.06 + 0.07 * i}"/>`;
    const mid = angle + sweep / 2;
    out += `<text x="${r(cx + rad * 0.62 * Math.cos(mid))}" y="${r(cy + rad * 0.62 * Math.sin(mid))}">${d.names[i]}</text>`;
    out += `<text x="${r(cx + rad * 0.62 * Math.cos(mid))}" y="${r(cy + rad * 0.62 * Math.sin(mid) + 14)}">${pct}%</text>`;
    angle += sweep;
  }
  return svgDocument(cy + rad + 10, out);
}

/** pieContexts are what a circle graph divides. */
const pieContexts = [
  {
    en: "the favorite sports, A to E, of the students surveyed",
    zh: "受调查学生最喜欢的运动（A 到 E）",
    unit: "students",
    unitZh: "名学生",
  },
  { en: "a family's monthly budget in categories A to E", zh: "一个家庭按 A 到 E 类分配的月预算", unit: "dollars", unitZh: "美元" },
  { en: "the cars sold by a dealer in colors A to E", zh: "一家车行售出的 A 到 E 各色汽车", unit: "cars", unitZh: "辆车" },
] as const;

/** pieSet splits 100 percent into four or five multiples of 5. */
function pieSet(rng: Rng): { set: PieSet; ctx: (typeof pieContexts)[number] } {
  const ctx = rng.pick(pieContexts);
  const k = rng.int(4, 5);
  const parts = Array.from({ length: k }, () => 1);
  for (let left = 20 - k; left > 0; left--) parts[rng.int(0, k - 1)]! += 1;
  return { set: { names: ["A", "B", "C", "D", "E"].slice(0, k), percents: parts.map((p) => p * 5) }, ctx };
}

/** pieFigure draws a circle graph, with alt text giving each sector. */
function pieFigure(d: PieSet, en: string, zh: string): Figure {
  return {
    svg: pieSvg(d),
    alt: t(
      `Circle graph of ${en}: ${d.names.map((n, i) => `${n} ${d.percents[i]}%`).join(", ")}.`,
      `${zh}的扇形统计图：${d.names.map((n, i) => `${n} ${d.percents[i]}%`).join("，")}。`,
    ),
  };
}

/** circleGraphs reads amounts and central angles from circle graphs. */
export const circleGraphs = topic(
  "circle-graphs",
  t("Circle Graphs", "扇形统计图"),
  t(
    "Find the amount a sector of a circle graph represents from the total, and the central angle of a sector from its percent.",
    "由总量求扇形统计图中某个扇形代表的数量，并由百分比求扇形的圆心角。",
  ),
  ["finding-part-of-a-number-given-a-whole-and-a-percentage", "central-angles-and-arcs"],
  ["6.RP.A.3.c", "7.SP.B.4"],
  [
    kp(
      "amounts-from-a-circle-graph",
      t("Amounts from a circle graph", "从扇形统计图读出数量"),
      t(
        "A **circle graph** splits a whole into sectors whose sizes show each category's percent of the total; the percents add up to $100\\%$. To find the amount a sector stands for, multiply the total by its percent. If $40\\%$ of $250$ people chose soccer, then $0.4 \\cdot 250 = 100$ people chose it. To compare two sectors, subtract their percents first and then take that percent of the total.",
        "**扇形统计图**把整体分成若干扇形，扇形的大小表示各类别占总量的百分比，所有百分比之和为 $100\\%$。要求某个扇形代表的数量，用总量乘以它的百分比。若 $250$ 人中有 $40\\%$ 选择足球，则有 $0.4 \\cdot 250 = 100$ 人选择足球。比较两个扇形时，可以先把它们的百分比相减，再求总量的这个百分比。",
      ),
      (rng) => {
        const { set, ctx } = pieSet(rng);
        const total = rng.pick([200, 240, 300, 400, 500, 600, 800, 1200]);
        const [i, j] = rng.sample(
          set.names.map((_, idx) => idx),
          2,
        ) as [number, number];
        const diff = rng.bool(0.4) && set.percents[i] !== set.percents[j];
        const [hi, lo] = set.percents[i]! >= set.percents[j]! ? [i, j] : [j, i];
        const pct = diff ? set.percents[hi]! - set.percents[lo]! : set.percents[i]!;
        const answer = (pct * total) / 100;
        return {
          ...numberProblem({
            prompt: diff
              ? t(
                  `The circle graph shows ${ctx.en}, a total of ${total} ${ctx.unit}. How many more ${ctx.unit} are in category ${set.names[hi]} than in category ${set.names[lo]}?`,
                  `扇形统计图表示${ctx.zh}，共 ${total} ${ctx.unitZh}。${set.names[hi]} 比 ${set.names[lo]} 多多少${ctx.unitZh}？`,
                )
              : t(
                  `The circle graph shows ${ctx.en}, a total of ${total} ${ctx.unit}. How many ${ctx.unit} are in category ${set.names[i]}?`,
                  `扇形统计图表示${ctx.zh}，共 ${total} ${ctx.unitZh}。${set.names[i]} 有多少${ctx.unitZh}？`,
                ),
            answer,
            form: "decimal",
            wrong: distinct(Q.of(answer), [
              Q.of(pct),
              Q.of(set.percents[i]! * total, 100),
              Q.of(total - answer),
              Q.of(Math.round((pct * 360) / 100)),
            ]),
            solution: diff
              ? t(
                  `The difference is $${set.percents[hi]}\\% - ${set.percents[lo]}\\% = ${pct}\\%$ of the total, and $${pct}\\%$ of $${total}$ is $${answer}$.`,
                  `两者相差 $${set.percents[hi]}\\% - ${set.percents[lo]}\\% = ${pct}\\%$，而 $${total}$ 的 $${pct}\\%$ 是 $${answer}$。`,
                )
              : t(
                  `${set.names[i]} is $${pct}\\%$ of the total, and $${pct}\\%$ of $${total}$ is $${pct / 100} \\cdot ${total} = ${answer}$.`,
                  `${set.names[i]} 占总量的 $${pct}\\%$，而 $${total}$ 的 $${pct}\\%$ 是 $${pct / 100} \\cdot ${total} = ${answer}$。`,
                ),
          }),
          figure: pieFigure(set, ctx.en, ctx.zh),
        };
      },
    ),
    kp(
      "central-angles-of-sectors",
      t("Central angles of sectors", "扇形的圆心角"),
      t(
        "A whole circle has $360^{\\circ}$, so a sector that is $p\\%$ of the graph has a central angle of $\\frac{p}{100} \\cdot 360^{\\circ}$. A sector of $25\\%$ has central angle $90^{\\circ}$, and one of $15\\%$ has $0.15 \\cdot 360^{\\circ} = 54^{\\circ}$. Going the other way, a central angle of $72^{\\circ}$ is $\\frac{72}{360} = 20\\%$ of the whole.",
        "整个圆是 $360^{\\circ}$，所以占统计图 $p\\%$ 的扇形，其圆心角为 $\\frac{p}{100} \\cdot 360^{\\circ}$。占 $25\\%$ 的扇形圆心角为 $90^{\\circ}$，占 $15\\%$ 的为 $0.15 \\cdot 360^{\\circ} = 54^{\\circ}$。反过来，$72^{\\circ}$ 的圆心角占整体的 $\\frac{72}{360} = 20\\%$。",
      ),
      (rng) => {
        const { set, ctx } = pieSet(rng);
        const i = rng.int(0, set.names.length - 1);
        const pct = set.percents[i]!;
        const angle = (pct * 360) / 100;
        if (rng.bool(0.35)) {
          const total = rng.pick([200, 300, 400, 600, 900, 1200]);
          const count = (pct * total) / 100;
          return numberProblem({
            prompt: t(
              `In a circle graph of ${ctx.en}, the sector for ${set.names[i]} has a central angle of $${angle}^{\\circ}$. If the total is ${total} ${ctx.unit}, how many ${ctx.unit} are in category ${set.names[i]}?`,
              `在表示${ctx.zh}的扇形统计图中，${set.names[i]} 所对扇形的圆心角为 $${angle}^{\\circ}$。若总量为 ${total} ${ctx.unitZh}，${set.names[i]} 有多少${ctx.unitZh}？`,
            ),
            answer: count,
            form: "decimal",
            wrong: distinct(Q.of(count), [Q.of(angle), Q.of(pct), Q.of(angle * total, 100), Q.of(total - count)]),
            solution: t(
              `The sector is $\\frac{${angle}}{360} = ${pct}\\%$ of the circle, and $${pct}\\%$ of $${total}$ is $${count}$.`,
              `该扇形占整个圆的 $\\frac{${angle}}{360} = ${pct}\\%$，而 $${total}$ 的 $${pct}\\%$ 是 $${count}$。`,
            ),
          });
        }
        return {
          ...numberProblem({
            prompt: t(
              `The circle graph shows ${ctx.en}. What is the central angle, in degrees, of the sector for ${set.names[i]}?`,
              `扇形统计图表示${ctx.zh}。${set.names[i]} 所对扇形的圆心角是多少度？`,
            ),
            answer: angle,
            form: "decimal",
            wrong: distinct(Q.of(angle), [Q.of(pct), Q.of(pct * 180, 100), Q.of(pct * 100, 360), Q.of(360 - angle)]),
            solution: t(
              `${set.names[i]} is $${pct}\\%$ of the graph, so its central angle is $${pct / 100} \\cdot 360^{\\circ} = ${angle}^{\\circ}$.`,
              `${set.names[i]} 占统计图的 $${pct}\\%$，所以圆心角为 $${pct / 100} \\cdot 360^{\\circ} = ${angle}^{\\circ}$。`,
            ),
          }),
          figure: pieFigure(set, ctx.en, ctx.zh),
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Focal distances of conics, sides and opposite angles, altitudes from the Pythagorean theorem, and packing boxes

/** triples are Pythagorean triples [p, q, r] with p² + q² = r². */
const triples = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [20, 21, 29],
] as const;

/** focalDistancePropertiesOfEllipsesAndHyperbolas uses the constant sum and difference of the distances to the foci. */
export const focalDistancePropertiesOfEllipsesAndHyperbolas = topic(
  "focal-distance-properties-of-ellipses-and-hyperbolas",
  t("Focal Distance Properties of Ellipses and Hyperbolas", "椭圆与双曲线的焦半径性质"),
  t(
    "Use the fact that the distances from a point of an ellipse to its foci add to $2a$, and that the distances from a point of a hyperbola to its foci differ by $2a$.",
    "利用椭圆上一点到两焦点的距离之和为 $2a$、双曲线上一点到两焦点的距离之差为 $2a$ 的性质。",
  ),
  ["foci-of-ellipses", "foci-of-hyperbolas"],
  ["G-GPE.A.3"],
  [
    kp(
      "the-focal-sum-of-an-ellipse",
      t("The focal sum of an ellipse", "椭圆的焦半径之和"),
      t(
        "An ellipse is the set of points whose distances to the two foci add to the same number, and that number is the length of the major axis, $2a$. Checking at an end of the major axis shows why: from $(a, 0)$ the foci $(\\pm c, 0)$ are $a - c$ and $a + c$ away, which add to $2a$. So if a point of the ellipse is $d$ from one focus, it is $2a - d$ from the other.",
        "椭圆是到两个焦点的距离之和为同一个数的点的集合，这个数就是长轴的长 $2a$。在长轴的端点处检验就能看出原因：从 $(a, 0)$ 到焦点 $(\\pm c, 0)$ 的距离分别是 $a - c$ 和 $a + c$，和为 $2a$。所以若椭圆上一点到一个焦点的距离为 $d$，则它到另一个焦点的距离为 $2a - d$。",
      ),
      (rng) => {
        const [p, q, a] = rng.pick(triples);
        const [b, c] = rng.bool() ? [p, q] : [q, p];
        const vertical = rng.bool();
        const d = rng.int(a - c + 1, a + c - 1);
        const answer = 2 * a - d;
        const eq = vertical
          ? `\\frac{x^{2}}{${b * b}} + \\frac{y^{2}}{${a * a}} = 1`
          : `\\frac{x^{2}}{${a * a}} + \\frac{y^{2}}{${b * b}} = 1`;
        return numberProblem({
          prompt: t(
            `A point $P$ on the ellipse $${eq}$ is $${d}$ units from one focus. How far is $P$ from the other focus?`,
            `椭圆 $${eq}$ 上一点 $P$ 到一个焦点的距离为 $${d}$。$P$ 到另一个焦点的距离是多少？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(d), Q.of(Math.abs(2 * c - d)), Q.of(Math.abs(2 * b - d)), Q.of(a + c - d)]),
          solution: t(
            `Here $a^{2} = ${a * a}$, so $a = ${a}$ and the distances to the foci add to $2a = ${2 * a}$. The other distance is $${2 * a} - ${d} = ${answer}$.`,
            `这里 $a^{2} = ${a * a}$，所以 $a = ${a}$，到两焦点的距离之和为 $2a = ${2 * a}$。另一个距离为 $${2 * a} - ${d} = ${answer}$。`,
          ),
        });
      },
    ),
    kp(
      "the-focal-difference-of-a-hyperbola",
      t("The focal difference of a hyperbola", "双曲线的焦半径之差"),
      t(
        "A hyperbola is the set of points whose distances to the two foci differ by the same number, the distance $2a$ between its vertices. From the vertex $(a, 0)$ the foci $(\\pm c, 0)$ are $c - a$ and $c + a$ away, a difference of $2a$. So a point of the hyperbola that is $d$ from the nearer focus is $d + 2a$ from the farther one, and a point $D$ from the farther focus is $D - 2a$ from the nearer one.",
        "双曲线是到两个焦点的距离之差为同一个数的点的集合，这个数就是两顶点之间的距离 $2a$。从顶点 $(a, 0)$ 到焦点 $(\\pm c, 0)$ 的距离分别是 $c - a$ 和 $c + a$，差为 $2a$。所以双曲线上一点若到较近焦点的距离为 $d$，则到较远焦点的距离为 $d + 2a$；若到较远焦点的距离为 $D$，则到较近焦点的距离为 $D - 2a$。",
      ),
      (rng) => {
        const [p, q, c] = rng.pick(triples);
        const [a, b] = rng.bool() ? [p, q] : [q, p];
        const near = rng.int(c - a, c - a + 12);
        const far = near + 2 * a;
        const askFar = rng.bool();
        const answer = askFar ? far : near;
        const eq = `\\frac{x^{2}}{${a * a}} - \\frac{y^{2}}{${b * b}} = 1`;
        const which = askFar ? t("nearer", "较近") : t("farther", "较远");
        const other = askFar ? t("farther", "较远") : t("nearer", "较近");
        const shown = askFar ? near : far;
        return numberProblem({
          prompt: t(
            `A point $P$ on the hyperbola $${eq}$ is $${shown}$ units from the ${which.en} focus. How far is $P$ from the ${other.en} focus?`,
            `双曲线 $${eq}$ 上一点 $P$ 到${which["zh-CN"]}焦点的距离为 $${shown}$。$P$ 到${other["zh-CN"]}焦点的距离是多少？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [
            Q.of(askFar ? shown + a : shown - a),
            Q.of(askFar ? shown + 2 * c : Math.abs(shown - 2 * c)),
            Q.of(Math.abs(2 * a - shown)),
            Q.of(askFar ? shown + 2 * b : Math.abs(shown - 2 * b)),
          ]),
          solution: t(
            `Here $a^{2} = ${a * a}$, so $a = ${a}$ and the distances to the foci differ by $2a = ${2 * a}$. The ${other.en} focus is ${askFar ? `$${shown} + ${2 * a} = ${answer}$` : `$${shown} - ${2 * a} = ${answer}$`} away.`,
            `这里 $a^{2} = ${a * a}$，所以 $a = ${a}$，到两焦点的距离之差为 $2a = ${2 * a}$。到${other["zh-CN"]}焦点的距离为 ${askFar ? `$${shown} + ${2 * a} = ${answer}$` : `$${shown} - ${2 * a} = ${answer}$`}。`,
          ),
        });
      },
    ),
    kp(
      "the-perimeter-of-a-focal-triangle",
      t("The perimeter of a focal triangle", "焦点三角形的周长"),
      t(
        "For a point $P$ of an ellipse with foci $F_{1}$ and $F_{2}$, the triangle $PF_{1}F_{2}$ has two sides whose sum is always $PF_{1} + PF_{2} = 2a$, and a third side $F_{1}F_{2} = 2c$, the distance between the foci. So its perimeter is $2a + 2c$ wherever $P$ is on the ellipse, even though the triangle itself changes shape as $P$ moves.",
        "对于以 $F_{1}$、$F_{2}$ 为焦点的椭圆上的一点 $P$，三角形 $PF_{1}F_{2}$ 有两条边之和恒为 $PF_{1} + PF_{2} = 2a$，第三条边 $F_{1}F_{2} = 2c$ 是两焦点间的距离。所以无论 $P$ 在椭圆上何处，周长都是 $2a + 2c$，尽管三角形本身的形状随 $P$ 的移动而改变。",
      ),
      (rng) => {
        const [p, q, a] = rng.pick(triples);
        const [b, c] = rng.bool() ? [p, q] : [q, p];
        const answer = 2 * a + 2 * c;
        const vertical = rng.bool();
        const eq = vertical
          ? `\\frac{x^{2}}{${b * b}} + \\frac{y^{2}}{${a * a}} = 1`
          : `\\frac{x^{2}}{${a * a}} + \\frac{y^{2}}{${b * b}} = 1`;
        const axis = vertical ? "y" : "x";
        return numberProblem({
          prompt: t(
            `$F_{1}$ and $F_{2}$ are the foci of the ellipse $${eq}$, and $P$ is a point on the ellipse that is not on the $${axis}$-axis. What is the perimeter of triangle $PF_{1}F_{2}$?`,
            `$F_{1}$、$F_{2}$ 是椭圆 $${eq}$ 的焦点，$P$ 是椭圆上不在 $${axis}$ 轴上的一点。三角形 $PF_{1}F_{2}$ 的周长是多少？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(2 * a), Q.of(2 * a + c), Q.of(4 * a), Q.of(2 * a + 2 * b)]),
          solution: t(
            steps(
              `Here $a = ${a}$ and $b = ${b}$, with the major axis along the $${axis}$-axis, so $c = \\sqrt{${a * a} - ${b * b}} = ${c}$.`,
              `$PF_{1} + PF_{2} = 2a = ${2 * a}$ and $F_{1}F_{2} = 2c = ${2 * c}$, so the perimeter is $${2 * a} + ${2 * c} = ${answer}$.`,
            ),
            steps(
              `这里 $a = ${a}$，$b = ${b}$，长轴在 $${axis}$ 轴上，所以 $c = \\sqrt{${a * a} - ${b * b}} = ${c}$。`,
              `$PF_{1} + PF_{2} = 2a = ${2 * a}$，$F_{1}F_{2} = 2c = ${2 * c}$，所以周长为 $${2 * a} + ${2 * c} = ${answer}$。`,
            ),
          ),
        });
      },
    ),
  ],
);

/** opposite names the side of triangle ABC opposite each vertex. */
const opposite = { A: "BC", B: "AC", C: "AB" } as const;

/** sideAngleRelationshipsInTriangles orders the sides of a triangle by the angles opposite them, and the reverse. */
export const sideAngleRelationshipsInTriangles = topic(
  "side-angle-relationships-in-triangles",
  t("Side-Angle Relationships in Triangles", "三角形的边角关系"),
  t(
    "In a triangle the longest side is opposite the largest angle and the shortest side is opposite the smallest angle; use this to order sides from angles and angles from sides.",
    "在三角形中，最长边所对的角最大，最短边所对的角最小；利用这一点由角的大小比较边，由边的大小比较角。",
  ),
  ["angles-of-a-triangle", "the-triangle-inequality"],
  ["G-CO.C.10"],
  [
    kp(
      "ordering-sides-from-angles",
      t("Ordering sides from angles", "由角比较边"),
      t(
        "In any triangle, a larger angle lies opposite a longer side, so the sides are in the same order as the angles opposite them. Each side is named by the two vertices it joins and lies opposite the third: side $BC$ is opposite $\\angle A$. If two angles are given, find the third from the angle sum of $180^\\circ$ first, then pick the side across from the largest or the smallest angle.",
        "在任何三角形中，较大的角所对的边较长，所以各边的大小顺序与它们所对的角的大小顺序相同。每条边用它连接的两个顶点命名，并且与第三个顶点相对：边 $BC$ 与 $\\angle A$ 相对。若已知两个角，先用内角和 $180^\\circ$ 求出第三个角，再找出最大角或最小角对面的边。",
      ),
      (rng) => {
        let A = 0;
        let B = 0;
        let C = 0;
        do {
          A = rng.int(4, 20) * 5;
          B = rng.int(4, 20) * 5;
          C = 180 - A - B;
        } while (C < 15 || A === B || B === C || A === C);
        const angles = { A, B, C };
        const longest = rng.bool();
        const pick = (Object.keys(angles) as ("A" | "B" | "C")[]).reduce((m, k) =>
          (longest ? angles[k] > angles[m] : angles[k] < angles[m]) ? k : m,
        );
        const side = (k: "A" | "B" | "C") => mathText(`\\overline{${opposite[k]}}`);
        return pickChoice(
          rng,
          t(
            `In triangle $ABC$, $m\\angle A = ${A}^\\circ$ and $m\\angle B = ${B}^\\circ$. Which side of the triangle is the ${longest ? "longest" : "shortest"}?`,
            `在三角形 $ABC$ 中，$m\\angle A = ${A}^\\circ$，$m\\angle B = ${B}^\\circ$。三角形的哪条边最${longest ? "长" : "短"}？`,
          ),
          side(pick),
          (["A", "B", "C"] as const).filter((k) => k !== pick).map(side),
          t(
            `The third angle is $m\\angle C = 180^\\circ - ${A}^\\circ - ${B}^\\circ = ${C}^\\circ$. The ${longest ? "largest" : "smallest"} angle is $\\angle ${pick}$, so the ${longest ? "longest" : "shortest"} side is the one opposite it, $\\overline{${opposite[pick]}}$.`,
            `第三个角为 $m\\angle C = 180^\\circ - ${A}^\\circ - ${B}^\\circ = ${C}^\\circ$。最${longest ? "大" : "小"}的角是 $\\angle ${pick}$，所以最${longest ? "长" : "短"}的边是它对面的边 $\\overline{${opposite[pick]}}$。`,
          ),
        );
      },
    ),
    kp(
      "ordering-angles-from-sides",
      t("Ordering angles from sides", "由边比较角"),
      t(
        "The relationship also works in reverse: the longest side of a triangle lies opposite its largest angle, and the shortest side opposite its smallest angle. So to find the largest angle when the three side lengths are known, locate the longest side and take the angle at the vertex that side does not touch. For sides $AB = 7$, $BC = 9$ and $AC = 5$, the longest side $BC$ is opposite $\\angle A$.",
        "这一关系反过来也成立：三角形的最长边所对的角最大，最短边所对的角最小。所以已知三边长度时，要找最大的角，就找出最长边，取它不经过的那个顶点处的角。若 $AB = 7$，$BC = 9$，$AC = 5$，最长边 $BC$ 所对的是 $\\angle A$。",
      ),
      (rng) => {
        let a = 0;
        let b = 0;
        let c = 0;
        do {
          a = rng.int(3, 15);
          b = rng.int(3, 15);
          c = rng.int(3, 15);
        } while (a === b || b === c || a === c || a + b <= c || b + c <= a || a + c <= b);
        const sides = { A: a, B: b, C: c };
        const largest = rng.bool();
        const pick = (Object.keys(sides) as ("A" | "B" | "C")[]).reduce((m, k) =>
          (largest ? sides[k] > sides[m] : sides[k] < sides[m]) ? k : m,
        );
        const angle = (k: "A" | "B" | "C") => mathText(`\\angle ${k}`);
        return pickChoice(
          rng,
          t(
            `In triangle $ABC$, $AB = ${c}$, $BC = ${a}$ and $AC = ${b}$. Which angle of the triangle is the ${largest ? "largest" : "smallest"}?`,
            `在三角形 $ABC$ 中，$AB = ${c}$，$BC = ${a}$，$AC = ${b}$。三角形的哪个角最${largest ? "大" : "小"}？`,
          ),
          angle(pick),
          (["A", "B", "C"] as const).filter((k) => k !== pick).map(angle),
          t(
            `The ${largest ? "longest" : "shortest"} side is $${opposite[pick]} = ${sides[pick]}$, which is opposite $\\angle ${pick}$, so $\\angle ${pick}$ is the ${largest ? "largest" : "smallest"} angle.`,
            `最${largest ? "长" : "短"}的边是 $${opposite[pick]} = ${sides[pick]}$，它所对的是 $\\angle ${pick}$，所以 $\\angle ${pick}$ 最${largest ? "大" : "小"}。`,
          ),
        );
      },
    ),
  ],
);

/** findingAltitudesUsingThePythagoreanTheorem finds altitudes and areas of isosceles and equilateral triangles from their sides. */
export const findingAltitudesUsingThePythagoreanTheorem = topic(
  "finding-altitudes-using-the-pythagorean-theorem",
  t("Finding Altitudes Using the Pythagorean Theorem", "用勾股定理求高"),
  t(
    "Split an isosceles or equilateral triangle along the altitude to its base into two congruent right triangles, and find the altitude and the area with the Pythagorean theorem.",
    "沿底边上的高把等腰三角形或等边三角形分成两个全等的直角三角形，再用勾股定理求高和面积。",
  ),
  ["the-pythagorean-theorem", "isosceles-triangles", "areas-of-triangles"],
  ["8.G.B.7", "G-SRT.C.8"],
  [
    kp(
      "the-altitude-of-an-isosceles-triangle",
      t("The altitude of an isosceles triangle", "等腰三角形的高"),
      t(
        "The altitude from the vertex angle of an isosceles triangle meets the base at its midpoint, cutting the triangle into two congruent right triangles. In each, a leg of the isosceles triangle is the hypotenuse, half the base is one leg, and the altitude is the other leg. So with legs $s$ and base $b$, the altitude is $h = \\sqrt{s^{2} - \\left(\\frac{b}{2}\\right)^{2}}$; with $s = 13$ and $b = 10$, $h = \\sqrt{169 - 25} = 12$.",
        "等腰三角形从顶角出发的高与底边交于底边的中点，把三角形分成两个全等的直角三角形。在每个直角三角形中，等腰三角形的腰是斜边，底边的一半是一条直角边，高是另一条直角边。所以腰长为 $s$、底边为 $b$ 时，高为 $h = \\sqrt{s^{2} - \\left(\\frac{b}{2}\\right)^{2}}$；当 $s = 13$，$b = 10$ 时，$h = \\sqrt{169 - 25} = 12$。",
      ),
      (rng) => {
        const [p0, q0, r0] = rng.pick(triples);
        const k = r0 > 15 ? 1 : rng.int(1, 3);
        const [p, q] = (rng.bool() ? [p0, q0] : [q0, p0]).map((v) => v * k) as [number, number];
        const r = r0 * k;
        const area = rng.bool();
        const answer = area ? p * q : q;
        return numberProblem({
          prompt: t(
            `An isosceles triangle has two sides of length $${r}$ and a base of length $${2 * p}$. What is ${area ? "the area of the triangle" : "the length of the altitude to the base"}?`,
            `一个等腰三角形的两腰长为 $${r}$，底边长为 $${2 * p}$。${area ? "这个三角形的面积" : "底边上的高"}是多少？`,
          ),
          answer,
          form: "integer",
          wrong: area ? [2 * p * q, p * r, Q.of(p * q, 2), r * r] : [r - p, Math.round(Math.sqrt(r * r + p * p)), 2 * q, r],
          solution: t(
            steps(
              `The altitude bisects the base, so each half is $${p}$ and $h = \\sqrt{${r}^{2} - ${p}^{2}} = \\sqrt{${r * r - p * p}} = ${q}$.`,
              ...(area ? [`The area is $\\frac{1}{2} \\cdot ${2 * p} \\cdot ${q} = ${p * q}$.`] : []),
            ),
            steps(
              `高平分底边，所以每一半长 $${p}$，$h = \\sqrt{${r}^{2} - ${p}^{2}} = \\sqrt{${r * r - p * p}} = ${q}$。`,
              ...(area ? [`面积为 $\\frac{1}{2} \\cdot ${2 * p} \\cdot ${q} = ${p * q}$。`] : []),
            ),
          ),
        });
      },
    ),
    kp(
      "the-altitude-of-an-equilateral-triangle",
      t("The altitude of an equilateral triangle", "等边三角形的高"),
      t(
        "An equilateral triangle with side $s$ is isosceles from every vertex, so an altitude splits it into two right triangles with hypotenuse $s$ and one leg $\\frac{s}{2}$. The altitude is $h = \\sqrt{s^{2} - \\frac{s^{2}}{4}} = \\sqrt{\\frac{3s^{2}}{4}} = \\frac{s\\sqrt{3}}{2}$, and the area is $\\frac{1}{2} \\cdot s \\cdot \\frac{s\\sqrt{3}}{2} = \\frac{s^{2}\\sqrt{3}}{4}$. These are the side ratios of a $30$-$60$-$90$ triangle.",
        "边长为 $s$ 的等边三角形从每个顶点看都是等腰三角形，所以一条高把它分成两个直角三角形，斜边为 $s$，一条直角边为 $\\frac{s}{2}$。高为 $h = \\sqrt{s^{2} - \\frac{s^{2}}{4}} = \\sqrt{\\frac{3s^{2}}{4}} = \\frac{s\\sqrt{3}}{2}$，面积为 $\\frac{1}{2} \\cdot s \\cdot \\frac{s\\sqrt{3}}{2} = \\frac{s^{2}\\sqrt{3}}{4}$。这正是 $30$-$60$-$90$ 三角形的边长比。",
      ),
      (rng) => {
        const s = rng.int(2, 14);
        const area = rng.bool();
        const coef = area ? Q.of(s * s, 4) : Q.of(s, 2);
        const shown = (c: Q) => (c.isInteger() ? `${c.toLatex()}\\sqrt{3}` : `\\frac{${c.n}\\sqrt{3}}{${c.d}}`);
        return radicalProblem({
          prompt: t(
            `What is the ${area ? "area" : "length of an altitude"} of an equilateral triangle with side length $${s}$? Give the exact value.`,
            `边长为 $${s}$ 的等边三角形的${area ? "面积" : "高"}是多少？请给出精确值。`,
          ),
          answer: [coef, 3],
          wrong: area
            ? [shown(Q.of(s * s, 2)), `${(s * s) / 2}`, shown(Q.of(s, 2))]
            : [`${s}\\sqrt{3}`, `${s / 2}`, `\\frac{${s}\\sqrt{2}}{2}`],
          solution: t(
            area
              ? `The altitude is $\\frac{${s}\\sqrt{3}}{2}$, so the area is $\\frac{1}{2} \\cdot ${s} \\cdot \\frac{${s}\\sqrt{3}}{2} = ${shown(coef)}$.`
              : `Half the base is $\\frac{${s}}{2}$, so $h = \\sqrt{${s}^{2} - \\left(\\frac{${s}}{2}\\right)^{2}} = \\sqrt{\\frac{${3 * s * s}}{4}} = ${shown(coef)}$.`,
            area
              ? `高为 $\\frac{${s}\\sqrt{3}}{2}$，所以面积为 $\\frac{1}{2} \\cdot ${s} \\cdot \\frac{${s}\\sqrt{3}}{2} = ${shown(coef)}$。`
              : `底边的一半为 $\\frac{${s}}{2}$，所以 $h = \\sqrt{${s}^{2} - \\left(\\frac{${s}}{2}\\right)^{2}} = \\sqrt{\\frac{${3 * s * s}}{4}} = ${shown(coef)}$。`,
          ),
        });
      },
    ),
  ],
);

/** packingRectangularBoxes counts how many congruent boxes fit in a larger box. */
export const packingRectangularBoxes = topic(
  "packing-rectangular-boxes",
  t("Packing Rectangular Boxes", "装箱问题"),
  t(
    "Count how many congruent boxes or cubes fit in a larger box by fitting whole numbers of them along each edge and multiplying, rather than dividing the volumes.",
    "计算一个大箱子中能装下多少个全等的小箱子或小正方体：沿每条棱放下整数个，再把三个数相乘，而不是用体积相除。",
  ),
  ["volumes-of-right-rectangular-prisms"],
  ["5.MD.C.5", "6.G.A.2"],
  [
    kp(
      "boxes-that-fill-the-space",
      t("Boxes that fill the space exactly", "恰好装满的箱子"),
      t(
        "When each edge of the small box divides the matching edge of the large one, the small boxes stack into layers with no gaps. Along each edge, the number of boxes is the large length divided by the small length, and the total is the product of the three counts. A $12 \\times 10 \\times 6$ box holds $\\frac{12}{4} \\cdot \\frac{10}{5} \\cdot \\frac{6}{3} = 3 \\cdot 2 \\cdot 2 = 12$ boxes measuring $4 \\times 5 \\times 3$.",
        "当小箱子的每条棱都能整除大箱子对应的棱时，小箱子可以一层层地无缝堆放。沿每条棱放下的箱子数是大箱子的长度除以小箱子的长度，总数就是三个数的乘积。一个 $12 \\times 10 \\times 6$ 的箱子能装下 $\\frac{12}{4} \\cdot \\frac{10}{5} \\cdot \\frac{6}{3} = 3 \\cdot 2 \\cdot 2 = 12$ 个 $4 \\times 5 \\times 3$ 的箱子。",
      ),
      (rng) => {
        const small = [rng.int(2, 6), rng.int(2, 6), rng.int(1, 4)];
        const counts = [rng.int(2, 5), rng.int(2, 5), rng.int(1, 4)];
        const big = small.map((v, i) => v * counts[i]!);
        const answer = counts[0]! * counts[1]! * counts[2]!;
        const dims = (d: number[]) => d.join(" \\times ");
        return numberProblem({
          prompt: t(
            `How many boxes measuring $${dims(small)}$ inches fit inside a crate measuring $${dims(big)}$ inches, if every box is placed with its edges parallel to the matching edges of the crate?`,
            `若每个箱子的棱都与货箱对应的棱平行放置，一个 $${dims(big)}$ 英寸的货箱中能装下多少个 $${dims(small)}$ 英寸的箱子？`,
          ),
          answer,
          form: "integer",
          wrong: [counts[0]! + counts[1]! + counts[2]!, counts[0]! * counts[1]!, answer * 2],
          solution: t(
            `Along the edges the crate holds $${big.map((v, i) => `\\frac{${v}}{${small[i]}}`).join(", ")}$, that is, $${counts.join(", ")}$ boxes. In all, $${counts.join(" \\cdot ")} = ${answer}$ boxes.`,
            `沿三条棱分别能放 $${big.map((v, i) => `\\frac{${v}}{${small[i]}}`).join("，")}$，即 $${counts.join("，")}$ 个箱子。共 $${counts.join(" \\cdot ")} = ${answer}$ 个。`,
          ),
        });
      },
    ),
    kp(
      "cubes-that-leave-gaps",
      t("Cubes that leave gaps", "留有空隙的正方体"),
      t(
        "When an edge of the large box is not a multiple of the cube's edge, only whole cubes fit along it and the leftover space is wasted, so take the whole-number part of each quotient. Cubes with $3$-inch edges in a $10 \\times 8 \\times 7$ box fit $3$, $2$ and $2$ along the edges, $12$ in all. Dividing the volumes, $\\frac{560}{27} \\approx 20$, overcounts, because the gaps cannot be filled with whole cubes.",
        "当大箱子的某条棱不是正方体棱长的倍数时，沿这条棱只能放下整数个正方体，剩余的空间被浪费，所以每个商只取整数部分。棱长 $3$ 英寸的正方体放进 $10 \\times 8 \\times 7$ 的箱子，沿三条棱分别能放 $3$、$2$、$2$ 个，共 $12$ 个。用体积相除得 $\\frac{560}{27} \\approx 20$，算多了，因为空隙无法用完整的正方体填满。",
      ),
      (rng) => {
        let e = 0;
        let big: number[] = [];
        let counts: number[] = [];
        let answer = 0;
        let byVolume = 0;
        do {
          e = rng.int(2, 5);
          big = [rng.int(e + 1, 6 * e), rng.int(e + 1, 6 * e), rng.int(e, 4 * e)];
          counts = big.map((v) => Math.floor(v / e));
          answer = counts[0]! * counts[1]! * counts[2]!;
          byVolume = Math.floor((big[0]! * big[1]! * big[2]!) / e ** 3);
        } while (byVolume === answer);
        return numberProblem({
          prompt: t(
            `What is the greatest number of cubes with $${e}$-inch edges that fit inside a box measuring $${big.join(" \\times ")}$ inches?`,
            `一个 $${big.join(" \\times ")}$ 英寸的箱子中最多能装下多少个棱长 $${e}$ 英寸的正方体？`,
          ),
          answer,
          form: "integer",
          wrong: [byVolume, big.map((v) => Math.ceil(v / e)).reduce((x, y) => x * y, 1), counts[0]! * counts[1]!],
          solution: t(
            `Only whole cubes fit along each edge: $${big.map((v) => `\\left\\lfloor \\frac{${v}}{${e}} \\right\\rfloor`).join(", ")}$ give $${counts.join(", ")}$. So at most $${counts.join(" \\cdot ")} = ${answer}$ cubes fit.`,
            `沿每条棱只能放整数个正方体：$${big.map((v) => `\\left\\lfloor \\frac{${v}}{${e}} \\right\\rfloor`).join("，")}$ 分别为 $${counts.join("，")}$。所以最多能装 $${counts.join(" \\cdot ")} = ${answer}$ 个。`,
          ),
        });
      },
    ),
  ],
);

/** actGeometryDataTopics lists the ACT Math geometry, statistics and probability topics in prerequisite order. */
export const actGeometryDataTopics: readonly TopicDef[] = [
  conicSectionsAsSlicesOfACone,
  areasOfRegularPolygons,
  areasOfRhombusesAndKites,
  volumesFromOrthographicViews,
  spheresAndCubesInscribedInEachOther,
  graphingSystemsOfLinearAndCircularInequalities,
  classifyingStatisticalStudies,
  adjustingOutcomesToATargetProbability,
  circleGraphs,
  focalDistancePropertiesOfEllipsesAndHyperbolas,
  sideAngleRelationshipsInTriangles,
  findingAltitudesUsingThePythagoreanTheorem,
  packingRectangularBoxes,
];
