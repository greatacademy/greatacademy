import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { type Poly, pAt, pLatex } from "./calculus-common.ts";
import { antiderivativeLatex } from "./calculus-i-riemann.ts";
import { exactProblem, int, intQ, pScale, times } from "./calculus-ii-areas.ts";
import { pMul, pSum } from "./calculus-ii-fractions-improper.ts";
import { coef } from "./calculus-ii-substitution.ts";

// Calculus II unit 2: Applications of Integration, modules 2.10–2.11.

/** Variable is the variable of integration. */
type Variable = "x" | "y";

/** across is the other coordinate: a function of x gives y and a function of y gives x. */
const across = (v: Variable): Variable => (v === "x" ? "y" : "x");

/** sq squares a polynomial. */
const sq = (p: Poly) => pMul(p, p);

/** minus subtracts polynomial q from p. */
const minus = (p: Poly, q: Poly) => pSum(p, pScale(q, -1));

/** piL writes qπ. */
const piL = (q: Q) => times(q, "\\pi");

/** bracket writes the antiderivative of p evaluated from a to b. */
const bracket = (p: Poly, a: number | string, b: number | string, v: Variable) =>
  `\\Big[${antiderivativeLatex(p).replace(/x/g, v)}\\Big]_{${a}}^{${b}}`;

/** k1 writes a positive integer coefficient, leaving 1 out. */
const k1 = (k: number) => (k === 1 ? "" : `${k}`);

/** m writes inline math in both languages. */
const m = (s: string) => t(`$${s}$`, `$${s}$`);

/** axisName names a coordinate axis. */
const axisName = (v: Variable) => t(`the $${v}$-axis`, `$${v}$ 轴`);

/** lineName names a line. */
const lineName = (s: string) => t(`the line $${s}$`, `直线 $${s}$`);

/** join lists the boundaries of a region. */
function join(items: readonly Text[]): Text {
  const en = items.map((i) => i.en);
  const zh = items.map((i) => i["zh-CN"]);
  return t(`${en.slice(0, -1).join(", ")} and ${en.at(-1)}`, `${zh.slice(0, -1).join("、")} 和 ${zh.at(-1)}`);
}

/** volumePrompt asks for the volume of the solid formed by rotating a region. */
function volumePrompt(bounds: readonly Text[], about: Text, firstQuadrant = false): Text {
  const b = join(bounds);
  return t(
    `The region ${firstQuadrant ? "in the first quadrant " : ""}bounded by ${b.en} is rotated about ${about.en}. Find the volume of the resulting solid. Give an exact answer.`,
    `${firstQuadrant ? "第一象限内" : ""}由 ${b["zh-CN"]} 围成的区域绕 ${about["zh-CN"]} 旋转一周，求所得旋转体的体积，给出精确值。`,
  );
}

/** piProblem asks for a volume or area that is a rational multiple of π. */
function piProblem(prompt: Text, q: Q, wrong: readonly Q[], en: string, zh: string) {
  return exactProblem(prompt, piL(q), [...wrong.filter((w) => !w.isZero()).map(piL), q.toLatex()], en, zh);
}

/** discProblem rotates the region between a curve and the v-axis about that axis, for a ≤ v ≤ b. */
function discProblem(rng: Rng, v: Variable) {
  const u = across(v);
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const root = rng.bool();
  const p: Poly = root ? [rng.int(0, 4), rng.int(1, 4)] : [rng.int(1, 5), rng.int(0, 3), rng.int(0, 1)];
  const f = root ? `\\sqrt{${pLatex(p, v)}}` : pLatex(p, v);
  const r2 = root ? p : sq(p);
  const q = intQ(r2, a, b);
  const work = `V = \\pi${int(a, b, `\\left(${f}\\right)^{2}`, v)} = \\pi${int(a, b, `(${pLatex(r2, v)})`, v)} = \\pi${bracket(r2, a, b, v)} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m(`${u} = ${f}`), axisName(v), m(`${v} = ${a}`), m(`${v} = ${b}`)], axisName(v)),
    q,
    root ? [q.mul(Q.of(2)), q.div(Q.of(2))] : [intQ(p, a, b), q.mul(Q.of(2))],
    `Each cross section perpendicular to the $${v}$-axis is a disc of radius $${f}$, so $${work}$.`,
    `垂直于 $${v}$ 轴的每个截面都是半径为 $${f}$ 的圆盘，所以 $${work}$。`,
  );
}

/** parabolaAboutYAxis rotates the region between y = cx², the y-axis and y = h about the y-axis. */
function parabolaAboutYAxis(rng: Rng) {
  const c = rng.int(1, 3);
  const h = rng.int(1, 6);
  const q = Q.of(h * h, 2 * c);
  const x2 = c === 1 ? "y" : `\\frac{y}{${c}}`;
  const work = `V = \\pi${int(0, h, x2, "y")} = \\pi\\Big[\\frac{y^{2}}{${2 * c}}\\Big]_{0}^{${h}} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m(`y = ${k1(c)}x^{2}`), axisName("y"), m(`y = ${h}`)], axisName("y")),
    q,
    [Q.of(h * h, c), Q.of(h * h, 2), Q.of(h ** 3, 3 * c)],
    `The discs are horizontal, so integrate in $y$. Solving for $x$ gives $x^{2} = ${x2}$, the square of the radius. Hence $${work}$.`,
    `圆盘是水平的，所以对 $y$ 积分。解出 $x$ 得 $x^{2} = ${x2}$，即半径的平方。因此 $${work}$。`,
  );
}

/** volumesOfRevolutionUsingTheDiscMethodRotationAboutTheCoordinateAxes slices a solid of revolution into discs. */
export const volumesOfRevolutionUsingTheDiscMethodRotationAboutTheCoordinateAxes: TopicDef = {
  id: "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes",
  title: t("Volumes of Revolution Using the Disc Method: Rotation About the Coordinate Axes", "用圆盘法求旋转体体积：绕坐标轴旋转"),
  summary: t(
    "Rotating the region under y = f(x) about the x-axis gives the volume π∫f(x)² dx.",
    "y = f(x) 下方的区域绕 x 轴旋转所得体积为 π∫f(x)² dx。",
  ),
  prerequisites: [
    "volumes-of-solids-with-circular-cross-sections",
    "the-area-between-curves-expressed-as-functions-of-y",
    "volumes-of-cylinders",
  ],
  encompasses: [{ topic: "volumes-of-solids-with-circular-cross-sections", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "discs-about-the-x-axis",
      title: t("Discs about the x-axis", "绕 x 轴旋转的圆盘"),
      explanation: t(
        "When the region between $y = f(x)$ and the $x$-axis, for $a \\le x \\le b$, is rotated about the $x$-axis, each cross section perpendicular to the axis is a disc of radius $f(x)$ and area $\\pi f(x)^{2}$. Adding the discs,\n\n$$V = \\pi\\int_{a}^{b} f(x)^{2} \\, dx.$$\n\nFor example, rotating the region under $y = \\sqrt{x}$ for $0 \\le x \\le 4$ gives $V = \\pi\\int_{0}^{4} x \\, dx = 8\\pi$.",
        "把 $y = f(x)$ 与 $x$ 轴之间（$a \\le x \\le b$）的区域绕 $x$ 轴旋转，垂直于旋转轴的每个截面都是半径为 $f(x)$、面积为 $\\pi f(x)^{2}$ 的圆盘。把圆盘累加，\n\n$$V = \\pi\\int_{a}^{b} f(x)^{2} \\, dx。$$\n\n例如 $y = \\sqrt{x}$ 下方 $0 \\le x \\le 4$ 的区域旋转所得体积为 $V = \\pi\\int_{0}^{4} x \\, dx = 8\\pi$。",
      ),
      generate: (rng) => discProblem(rng, "x"),
    },
    {
      id: "discs-about-the-y-axis",
      title: t("Discs about the y-axis", "绕 y 轴旋转的圆盘"),
      explanation: t(
        "When a region is rotated about the $y$-axis, the discs are horizontal, so integrate with respect to $y$: write the curve as $x = g(y)$, and\n\n$$V = \\pi\\int_{c}^{d} g(y)^{2} \\, dy.$$\n\nFor the region between $y = x^{2}$, the $y$-axis and $y = 4$, solve for $x^{2} = y$; then $V = \\pi\\int_{0}^{4} y \\, dy = 8\\pi$.",
        "区域绕 $y$ 轴旋转时圆盘是水平的，所以对 $y$ 积分：把曲线写成 $x = g(y)$，则\n\n$$V = \\pi\\int_{c}^{d} g(y)^{2} \\, dy。$$\n\n对 $y = x^{2}$、$y$ 轴与 $y = 4$ 围成的区域，解出 $x^{2} = y$，于是 $V = \\pi\\int_{0}^{4} y \\, dy = 8\\pi$。",
      ),
      generate: (rng) => (rng.int(0, 2) === 0 ? parabolaAboutYAxis(rng) : discProblem(rng, "y")),
    },
  ],
};

/** discAboutLine rotates the region between a curve and the line u = k about that line. */
function discAboutLine(rng: Rng, v: Variable) {
  const u = across(v);
  const k = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const g: Poly = [rng.int(1, 4), rng.int(1, 2), rng.int(0, 1)];
  const f = pSum([k], pScale(g, rng.bool() ? 1 : -1));
  const q = intQ(sq(g), a, b);
  const line = `${u} = ${k}`;
  const work = `V = \\pi${int(a, b, `(${pLatex(g, v)})^{2}`, v)} = \\pi${int(a, b, `(${pLatex(sq(g), v)})`, v)} = \\pi${bracket(sq(g), a, b, v)} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m(`${u} = ${pLatex(f, v)}`), lineName(line), m(`${v} = ${a}`), m(`${v} = ${b}`)], lineName(line)),
    q,
    [intQ(sq(f), a, b), intQ(g, a, b), q.mul(Q.of(2))],
    `The radius is the distance from the curve to the axis: $\\left|(${pLatex(f, v)}) - (${k})\\right| = ${pLatex(g, v)}$. So $${work}$.`,
    `半径是曲线到旋转轴的距离：$\\left|(${pLatex(f, v)}) - (${k})\\right| = ${pLatex(g, v)}$。所以 $${work}$。`,
  );
}

/** parabolaAboutItsChord rotates the region between y = x² and y = s² about y = s². */
function parabolaAboutItsChord(rng: Rng) {
  const s = rng.int(1, 3);
  const q = Q.of(16 * s ** 5, 15);
  const p: Poly = [s ** 4, 0, -2 * s * s, 0, 1];
  const line = `y = ${s * s}`;
  const work = `V = \\pi${int(-s, s, `(${s * s} - x^{2})^{2}`)} = \\pi${int(-s, s, `(${pLatex(p)})`)} = \\pi${bracket(p, -s, s, "x")} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m("y = x^{2}"), lineName(line)], lineName(line)),
    q,
    [Q.of(8 * s ** 5, 5), Q.of(4 * s ** 3, 3), q.mul(Q.of(2))],
    `The curves meet at $x = \\pm ${s}$, and the radius is $${s * s} - x^{2}$. So $${work}$.`,
    `两曲线交于 $x = \\pm ${s}$，半径为 $${s * s} - x^{2}$。所以 $${work}$。`,
  );
}

/** parabolaAboutAVerticalLine rotates the region between y = x², the x-axis and x = s about x = s. */
function parabolaAboutAVerticalLine(rng: Rng) {
  const s = rng.int(1, 4);
  const q = Q.of(s ** 4, 6);
  const line = `x = ${s}`;
  const work = `V = \\pi${int(0, s * s, `(${s} - \\sqrt{y})^{2}`, "y")} = \\pi${int(0, s * s, `\\left(${s * s} - ${2 * s}\\sqrt{y} + y\\right)`, "y")} = \\pi\\Big[${s * s}y - \\frac{${4 * s}}{3}y^{3/2} + \\frac{y^{2}}{2}\\Big]_{0}^{${s * s}} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m("y = x^{2}"), axisName("x"), lineName(line)], lineName(line)),
    q,
    [Q.of(s ** 4, 2), Q.of(s ** 5, 5), Q.of(s ** 4, 3)],
    `The discs are horizontal. At height $y$, for $0 \\le y \\le ${s * s}$, the region runs from $x = \\sqrt{y}$ to $x = ${s}$, so the radius is $${s} - \\sqrt{y}$ and $${work}$.`,
    `圆盘是水平的。在高度 $y$ 处（$0 \\le y \\le ${s * s}$），区域从 $x = \\sqrt{y}$ 延伸到 $x = ${s}$，所以半径为 $${s} - \\sqrt{y}$，$${work}$。`,
  );
}

/** volumesOfRevolutionUsingTheDiscMethodRotationAboutOtherAxes measures the disc radius from a line other than an axis. */
export const volumesOfRevolutionUsingTheDiscMethodRotationAboutOtherAxes: TopicDef = {
  id: "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes",
  title: t("Volumes of Revolution Using the Disc Method: Rotation About Other Axes", "用圆盘法求旋转体体积：绕其他直线旋转"),
  summary: t(
    "When the axis is a line y = k or x = h, the radius is the distance from the curve to that line.",
    "旋转轴为直线 y = k 或 x = h 时，半径是曲线到该直线的距离。",
  ),
  prerequisites: ["volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes"],
  encompasses: [{ topic: "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "discs-about-a-horizontal-line",
      title: t("Discs about a horizontal line", "绕水平直线旋转的圆盘"),
      explanation: t(
        "Rotating the region between $y = f(x)$ and the line $y = k$ about that line gives discs of radius $|f(x) - k|$:\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x) - k\\right)^{2} \\, dx.$$\n\nFor the region between $y = x^{2} + 1$ and $y = 1$, $0 \\le x \\le 1$, rotated about $y = 1$: the radius is $x^{2}$, so $V = \\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$.",
        "把 $y = f(x)$ 与直线 $y = k$ 之间的区域绕该直线旋转，得到半径为 $|f(x) - k|$ 的圆盘：\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x) - k\\right)^{2} \\, dx。$$\n\n例如 $y = x^{2} + 1$ 与 $y = 1$ 之间 $0 \\le x \\le 1$ 的区域绕 $y = 1$ 旋转：半径为 $x^{2}$，所以 $V = \\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$。",
      ),
      generate: (rng) => (rng.int(0, 3) === 0 ? parabolaAboutItsChord(rng) : discAboutLine(rng, "x")),
    },
    {
      id: "discs-about-a-vertical-line",
      title: t("Discs about a vertical line", "绕竖直直线旋转的圆盘"),
      explanation: t(
        "For a vertical axis $x = h$, the discs are horizontal: write the boundary as $x = g(y)$, and the radius is $|g(y) - h|$:\n\n$$V = \\pi\\int_{c}^{d} \\left(g(y) - h\\right)^{2} \\, dy.$$\n\nIf the boundary is given as $y = f(x)$, first solve for $x$; for $y = x^{2}$ with $x \\ge 0$, $x = \\sqrt{y}$.",
        "旋转轴为竖直直线 $x = h$ 时圆盘是水平的：把边界写成 $x = g(y)$，半径为 $|g(y) - h|$：\n\n$$V = \\pi\\int_{c}^{d} \\left(g(y) - h\\right)^{2} \\, dy。$$\n\n若边界以 $y = f(x)$ 给出，先解出 $x$；例如 $y = x^{2}$（$x \\ge 0$）可写成 $x = \\sqrt{y}$。",
      ),
      generate: (rng) => (rng.int(0, 3) === 0 ? parabolaAboutAVerticalLine(rng) : discAboutLine(rng, "y")),
    },
  ],
};

/** Washer is a region between an outer curve f and an inner curve g for a ≤ v ≤ b, with f - g = d. */
interface Washer {
  readonly f: Poly;
  readonly g: Poly;
  readonly d: Poly;
  readonly a: number;
  readonly b: number;
}

/** randomWasher chooses polynomials f > g ≥ gMin with non-negative coefficients on an interval with a ≥ 0, so both increase. */
function randomWasher(rng: Rng, gMin = 1): Washer {
  const a = rng.int(0, 2);
  const g: Poly = [rng.int(gMin, 3), rng.int(0, 2), rng.int(0, 1)];
  const d: Poly = [rng.int(1, 4), rng.int(0, 2)];
  return { f: pSum(g, d), g, d, a, b: a + rng.int(1, 3) };
}

/** washerWork writes π∫(R² - r²) from the squared outer and inner radii. */
function washerWork(R2: Poly, r2: Poly, outer: string, inner: string, a: number, b: number, v: Variable) {
  const p = minus(R2, r2);
  const q = intQ(p, a, b);
  return {
    q,
    work: `V = \\pi${int(a, b, `\\left(\\left(${outer}\\right)^{2} - \\left(${inner}\\right)^{2}\\right)`, v)} = \\pi${int(a, b, `(${pLatex(p, v)})`, v)} = \\pi${bracket(p, a, b, v)} = ${piL(q)}`,
  };
}

/** washerProblem rotates the region between two curves about the v-axis. */
function washerProblem(rng: Rng, v: Variable) {
  const u = across(v);
  const { f, g, d, a, b } = randomWasher(rng);
  const [fl, gl] = [pLatex(f, v), pLatex(g, v)];
  const { q, work } = washerWork(sq(f), sq(g), fl, gl, a, b, v);
  return piProblem(
    volumePrompt([m(`${u} = ${fl}`), m(`${u} = ${gl}`), m(`${v} = ${a}`), m(`${v} = ${b}`)], axisName(v)),
    q,
    [intQ(sq(d), a, b), intQ(sq(f), a, b), q.mul(Q.of(2))],
    `The outer radius is $R = ${fl}$ and the inner radius is $r = ${gl}$, so $${work}$.`,
    `外半径为 $R = ${fl}$，内半径为 $r = ${gl}$，所以 $${work}$。`,
  );
}

/** MeetingCurves is the region between y = top and y = bottom, which meet at x = a and x = b. */
interface MeetingCurves {
  readonly top: string;
  readonly bottom: string;
  readonly R2: Poly;
  readonly r2: Poly;
  readonly a: number;
  readonly b: number;
  readonly wrong: readonly Q[];
}

/** meetingCurves are regions between meeting curves whose squared radii are polynomials. */
const meetingCurves: readonly ((rng: Rng) => MeetingCurves)[] = [
  (rng) => {
    const k = rng.int(1, 5);
    return {
      top: `${k1(k)}x`,
      bottom: "x^{2}",
      R2: [0, 0, k * k],
      r2: [0, 0, 0, 0, 1],
      a: 0,
      b: k,
      wrong: [Q.of(k ** 5, 30), Q.of(k ** 5, 3)],
    };
  },
  (rng) => {
    const k = rng.int(1, 6);
    return { top: `\\sqrt{${k1(k)}x}`, bottom: "x", R2: [0, k], r2: [0, 0, 1], a: 0, b: k, wrong: [Q.of(k ** 3, 2), Q.of(k ** 3, 3)] };
  },
  (rng) => {
    const s = rng.int(1, 3);
    return {
      top: `${s * s}`,
      bottom: "x^{2}",
      R2: [s ** 4],
      r2: [0, 0, 0, 0, 1],
      a: -s,
      b: s,
      wrong: [Q.of(16 * s ** 5, 15), Q.of(2 * s ** 5)],
    };
  },
];

/** meetingCurvesProblem rotates the region between two meeting curves about the x-axis. */
function meetingCurvesProblem(rng: Rng) {
  const c = rng.pick(meetingCurves)(rng);
  const { q, work } = washerWork(c.R2, c.r2, c.top, c.bottom, c.a, c.b, "x");
  return piProblem(
    volumePrompt([m(`y = ${c.top}`), m(`y = ${c.bottom}`)], axisName("x")),
    q,
    [...c.wrong, q.mul(Q.of(2))],
    `The curves meet at $x = ${c.a}$ and $x = ${c.b}$, and $${c.top} \\ge ${c.bottom}$ between them. So $${work}$.`,
    `两曲线交于 $x = ${c.a}$ 和 $x = ${c.b}$，且两者之间 $${c.top} \\ge ${c.bottom}$。所以 $${work}$。`,
  );
}

/** lineAndParabolaAboutYAxis rotates the region between y = kx and y = x² about the y-axis. */
function lineAndParabolaAboutYAxis(rng: Rng) {
  const k = rng.int(1, 5);
  const q = Q.of(k ** 4, 6);
  const inner = k === 1 ? "y" : `\\frac{y}{${k}}`;
  const inner2 = k === 1 ? "y^{2}" : `\\frac{y^{2}}{${k * k}}`;
  const work = `V = \\pi${int(0, k * k, `\\left(y - ${inner2}\\right)`, "y")} = \\pi\\Big[\\frac{y^{2}}{2} - \\frac{y^{3}}{${3 * k * k}}\\Big]_{0}^{${k * k}} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m(`y = ${k1(k)}x`), m("y = x^{2}")], axisName("y")),
    q,
    [Q.of(2 * k ** 5, 15), Q.of(k ** 4, 2), Q.of(k ** 4, 3)],
    `The curves meet at $(0, 0)$ and $(${k}, ${k * k})$. The washers are horizontal: at height $y$ the outer radius is $x = \\sqrt{y}$, from the parabola, and the inner radius is $x = ${inner}$, from the line. So $${work}$.`,
    `两曲线交于 $(0, 0)$ 和 $(${k}, ${k * k})$。垫圈是水平的：在高度 $y$ 处，外半径来自抛物线，为 $x = \\sqrt{y}$；内半径来自直线，为 $x = ${inner}$。所以 $${work}$。`,
  );
}

/** volumesOfRevolutionUsingTheWasherMethodRotationAboutTheCoordinateAxes subtracts an inner disc from an outer one. */
export const volumesOfRevolutionUsingTheWasherMethodRotationAboutTheCoordinateAxes: TopicDef = {
  id: "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes",
  title: t("Volumes of Revolution Using the Washer Method: Rotation About the Coordinate Axes", "用垫圈法求旋转体体积：绕坐标轴旋转"),
  summary: t(
    "A region between two curves rotates into washers of area π(R² - r²).",
    "两曲线之间的区域旋转后形成面积为 π(R² - r²) 的垫圈。",
  ),
  prerequisites: ["volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes"],
  encompasses: [{ topic: "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "washers-about-the-x-axis",
      title: t("Washers about the x-axis", "绕 x 轴旋转的垫圈"),
      explanation: t(
        "If $f(x) \\ge g(x) \\ge 0$ on $[a, b]$, rotating the region between them about the $x$-axis gives cross sections that are washers: a disc of outer radius $R = f(x)$ with a hole of inner radius $r = g(x)$. Its area is $\\pi(R^{2} - r^{2})$, so\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x)^{2} - g(x)^{2}\\right) dx.$$\n\nNote that $R^{2} - r^{2}$ is not $(R - r)^{2}$. For $y = x$ and $y = x^{2}$, which meet at $x = 0$ and $x = 1$: $V = \\pi\\int_{0}^{1} (x^{2} - x^{4}) \\, dx = \\frac{2\\pi}{15}$.",
        "若在 $[a, b]$ 上 $f(x) \\ge g(x) \\ge 0$，把两者之间的区域绕 $x$ 轴旋转，截面是垫圈：外半径为 $R = f(x)$ 的圆盘中挖去内半径为 $r = g(x)$ 的孔。其面积为 $\\pi(R^{2} - r^{2})$，所以\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x)^{2} - g(x)^{2}\\right) dx。$$\n\n注意 $R^{2} - r^{2}$ 不等于 $(R - r)^{2}$。对交于 $x = 0$ 和 $x = 1$ 的 $y = x$ 与 $y = x^{2}$：$V = \\pi\\int_{0}^{1} (x^{2} - x^{4}) \\, dx = \\frac{2\\pi}{15}$。",
      ),
      generate: (rng) => (rng.bool() ? meetingCurvesProblem(rng) : washerProblem(rng, "x")),
    },
    {
      id: "washers-about-the-y-axis",
      title: t("Washers about the y-axis", "绕 y 轴旋转的垫圈"),
      explanation: t(
        "About the $y$-axis the washers are horizontal. Write both boundaries as functions of $y$; the outer radius $R(y)$ is the one farther from the axis:\n\n$$V = \\pi\\int_{c}^{d} \\left(R(y)^{2} - r(y)^{2}\\right) dy.$$\n\nFor $y = x$ and $y = x^{2}$, at height $y$ the parabola gives $x = \\sqrt{y}$ and the line gives $x = y$, so $V = \\pi\\int_{0}^{1} (y - y^{2}) \\, dy = \\frac{\\pi}{6}$.",
        "绕 $y$ 轴旋转时垫圈是水平的。把两条边界都写成 $y$ 的函数，离旋转轴较远的给出外半径 $R(y)$：\n\n$$V = \\pi\\int_{c}^{d} \\left(R(y)^{2} - r(y)^{2}\\right) dy。$$\n\n对 $y = x$ 与 $y = x^{2}$，在高度 $y$ 处抛物线给出 $x = \\sqrt{y}$，直线给出 $x = y$，所以 $V = \\pi\\int_{0}^{1} (y - y^{2}) \\, dy = \\frac{\\pi}{6}$。",
      ),
      generate: (rng) => (rng.int(0, 2) === 0 ? lineAndParabolaAboutYAxis(rng) : washerProblem(rng, "y")),
    },
  ],
};

/** washerAboutLine rotates the region between two curves about a line u = k beside it. */
function washerAboutLine(rng: Rng, v: Variable) {
  const u = across(v);
  const { f, g, d, a, b } = randomWasher(rng);
  const below = rng.bool();
  const k = below ? -rng.int(1, 4) : pAt(f, b) + rng.int(0, 3);
  const R = below ? pSum(f, [-k]) : minus([k], g);
  const r = below ? pSum(g, [-k]) : minus([k], f);
  const [fl, gl, Rl, rl] = [f, g, R, r].map((p) => pLatex(p, v));
  const { q, work } = washerWork(sq(R), sq(r), Rl ?? "", rl ?? "", a, b, v);
  const radii = (and: string) =>
    below
      ? `R = (${fl}) - (${k}) = ${Rl}$${and}$r = (${gl}) - (${k}) = ${rl}`
      : `R = ${k} - (${gl}) = ${Rl}$${and}$r = ${k} - (${fl}) = ${rl}`;
  const line = `${u} = ${k}`;
  const side =
    v === "x" ? (below ? t("below", "下方") : t("above", "上方")) : below ? t("to the left of", "左侧") : t("to the right of", "右侧");
  return piProblem(
    volumePrompt([m(`${u} = ${fl}`), m(`${u} = ${gl}`), m(`${v} = ${a}`), m(`${v} = ${b}`)], lineName(line)),
    q,
    [intQ(minus(sq(f), sq(g)), a, b), intQ(sq(d), a, b), q.mul(Q.of(2))],
    `The axis $${line}$ lies ${side.en} the region, so the radii are $${radii(" and ")}$. Hence $${work}$.`,
    `旋转轴 $${line}$ 在区域${side["zh-CN"]}，所以半径为 $${radii(" 和 ")}$。因此 $${work}$。`,
  );
}

/** volumesOfRevolutionUsingTheWasherMethodRotationAboutOtherAxes measures both washer radii from a line other than an axis. */
export const volumesOfRevolutionUsingTheWasherMethodRotationAboutOtherAxes: TopicDef = {
  id: "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes",
  title: t("Volumes of Revolution Using the Washer Method: Rotation About Other Axes", "用垫圈法求旋转体体积：绕其他直线旋转"),
  summary: t(
    "When the axis is a line y = k or x = h, both radii are distances from the curves to that line.",
    "旋转轴为直线 y = k 或 x = h 时，两个半径都是曲线到该直线的距离。",
  ),
  prerequisites: [
    "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes",
    "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes",
  ],
  encompasses: [
    { topic: "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes", weight: 0.5 },
    { topic: "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "washers-about-a-horizontal-line",
      title: t("Washers about a horizontal line", "绕水平直线旋转的垫圈"),
      explanation: t(
        "To rotate the region between $y = f(x)$ and $y = g(x)$, with $f \\ge g$, about a horizontal line $y = k$, measure both radii from the line.\n\n- If the line is below the region, $R = f(x) - k$ and $r = g(x) - k$.\n- If the line is above the region, $R = k - g(x)$ and $r = k - f(x)$: the lower curve is now the farther one.\n\nThen $V = \\pi\\int_{a}^{b} (R^{2} - r^{2}) \\, dx$.",
        "把 $y = f(x)$ 与 $y = g(x)$（$f \\ge g$）之间的区域绕水平直线 $y = k$ 旋转时，两个半径都从该直线量起。\n\n- 若直线在区域下方，$R = f(x) - k$，$r = g(x) - k$。\n- 若直线在区域上方，$R = k - g(x)$，$r = k - f(x)$：此时下方的曲线离旋转轴更远。\n\n然后 $V = \\pi\\int_{a}^{b} (R^{2} - r^{2}) \\, dx$。",
      ),
      generate: (rng) => washerAboutLine(rng, "x"),
    },
    {
      id: "washers-about-a-vertical-line",
      title: t("Washers about a vertical line", "绕竖直直线旋转的垫圈"),
      explanation: t(
        "For a vertical line $x = h$, write the boundaries as $x = f(y)$ and $x = g(y)$ with $f \\ge g$. If the line is to the left of the region, $R = f(y) - h$ and $r = g(y) - h$; if it is to the right, $R = h - g(y)$ and $r = h - f(y)$. Then $V = \\pi\\int_{c}^{d} (R^{2} - r^{2}) \\, dy$.",
        "对竖直直线 $x = h$，把边界写成 $x = f(y)$ 和 $x = g(y)$，$f \\ge g$。若直线在区域左侧，$R = f(y) - h$，$r = g(y) - h$；若在右侧，$R = h - g(y)$，$r = h - f(y)$。然后 $V = \\pi\\int_{c}^{d} (R^{2} - r^{2}) \\, dy$。",
      ),
      generate: (rng) => washerAboutLine(rng, "y"),
    },
  ],
};

/** vTimes multiplies a polynomial by its variable. */
const vTimes = (p: Poly) => pMul([0, 1], p);

/** shellWork writes 2π∫ v·h(v) dv for shells of radius v and height h. */
function shellWork(h: Poly, hl: string, a: number, b: number, v: Variable) {
  const p = vTimes(h);
  const q = intQ(p, a, b).mul(Q.of(2));
  return {
    q,
    work: `V = 2\\pi${int(a, b, `${v}\\left(${hl}\\right)`, v)} = 2\\pi${int(a, b, `(${pLatex(p, v)})`, v)} = 2\\pi${bracket(p, a, b, v)} = ${piL(q)}`,
  };
}

/** shellsAboutXAxis rotates the region between x = g(y), the y-axis, y = a and y = b about the x-axis. */
function shellsAboutXAxis(rng: Rng) {
  const g: Poly = [rng.int(1, 5), rng.int(0, 3), rng.int(0, 1)];
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const gl = pLatex(g, "y");
  const { q, work } = shellWork(g, gl, a, b, "y");
  return piProblem(
    volumePrompt([m(`x = ${gl}`), axisName("y"), m(`y = ${a}`), m(`y = ${b}`)], axisName("x")),
    q,
    [intQ(g, a, b).mul(Q.of(2)), intQ(vTimes(g), a, b), intQ(sq(g), a, b)],
    `A horizontal strip at height $y$ has length $${gl}$. Rotating it about the $x$-axis sweeps out a cylindrical shell of radius $y$ and height $${gl}$, so $${work}$.`,
    `高度 $y$ 处的水平窄条长为 $${gl}$。它绕 $x$ 轴旋转形成半径为 $y$、高为 $${gl}$ 的圆柱壳，所以 $${work}$。`,
  );
}

/** rootCurveShells rotates the region under y = √(x/c) up to x = cs² about the x-axis. */
function rootCurveShells(rng: Rng) {
  const c = rng.int(1, 4);
  const s = rng.int(1, 4);
  const curve = c === 1 ? "y = \\sqrt{x}" : `y = \\sqrt{\\frac{x}{${c}}}`;
  const h: Poly = [c * s * s, 0, -c];
  const { q, work } = shellWork(h, pLatex(h, "y"), 0, s, "y");
  return piProblem(
    volumePrompt([m(curve), axisName("x"), m(`x = ${c * s * s}`)], axisName("x")),
    q,
    [q.mul(Q.of(2)), q.div(Q.of(2)), Q.of(c * c * s ** 4, 2)],
    `Solving for $x$ gives $x = ${k1(c)}y^{2}$. For $0 \\le y \\le ${s}$ the horizontal strip runs from $x = ${k1(c)}y^{2}$ to $x = ${c * s * s}$, so $${work}$.`,
    `解出 $x$ 得 $x = ${k1(c)}y^{2}$。对 $0 \\le y \\le ${s}$，水平窄条从 $x = ${k1(c)}y^{2}$ 延伸到 $x = ${c * s * s}$，所以 $${work}$。`,
  );
}

/** parabolaShells rotates the region under y = r²x² for 0 ≤ x ≤ s about the x-axis. */
function parabolaShells(rng: Rng) {
  const r = rng.int(1, 2);
  const s = rng.int(1, 6);
  const top = r * r * s * s;
  const q = Q.of(r ** 4 * s ** 5, 5);
  const x = r === 1 ? "\\sqrt{y}" : `\\frac{\\sqrt{y}}{${r}}`;
  const work = `V = 2\\pi${int(0, top, `y\\left(${s} - ${x}\\right)`, "y")} = 2\\pi\\Big[${coef(Q.of(s, 2))}y^{2} - \\frac{2}{${5 * r}}y^{5/2}\\Big]_{0}^{${top}} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m(`y = ${k1(r * r)}x^{2}`), axisName("x"), m(`x = ${s}`)], axisName("x")),
    q,
    [q.mul(Q.of(2)), q.div(Q.of(2)), Q.of(r * r * s ** 3, 3)],
    `Solving for $x$ gives $x = ${x}$. For $0 \\le y \\le ${top}$ the horizontal strip runs from the curve to $x = ${s}$, so its length is $${s} - ${x}$ and $${work}$.`,
    `解出 $x$ 得 $x = ${x}$。对 $0 \\le y \\le ${top}$，水平窄条从曲线延伸到 $x = ${s}$，长为 $${s} - ${x}$，所以 $${work}$。`,
  );
}

/** theShellMethodRotatingARegionAboutTheXAxis sums cylindrical shells around the x-axis. */
export const theShellMethodRotatingARegionAboutTheXAxis: TopicDef = {
  id: "the-shell-method-rotating-a-region-about-the-x-axis",
  title: t("The Shell Method: Rotating a Region About the X-Axis", "柱壳法：区域绕 x 轴旋转"),
  summary: t(
    "Horizontal strips rotated about the x-axis form shells, so V = 2π∫ y·(length) dy.",
    "水平窄条绕 x 轴旋转形成柱壳，所以 V = 2π∫ y·（长度）dy。",
  ),
  prerequisites: ["volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes"],
  encompasses: [{ topic: "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes", weight: 0.2 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "shells-for-a-curve-given-as-x-in-terms-of-y",
      title: t("Shells for a curve given as x in terms of y", "曲线以 x 关于 y 的形式给出时的柱壳"),
      explanation: t(
        "Cut the region into thin horizontal strips. The strip at height $y$, of length $L(y)$ and thickness $dy$, sweeps out a cylindrical shell about the $x$-axis. Unrolled, the shell is a thin slab of size $2\\pi y \\times L(y) \\times dy$, so\n\n$$V = 2\\pi\\int_{c}^{d} y\\,L(y) \\, dy.$$\n\nFor the region between $x = y^{2}$, the $y$-axis and $y = 2$: $V = 2\\pi\\int_{0}^{2} y \\cdot y^{2} \\, dy = 8\\pi$.",
        "把区域切成水平窄条。高度 $y$ 处长为 $L(y)$、厚为 $dy$ 的窄条绕 $x$ 轴旋转形成圆柱壳。把柱壳展开，近似是一块 $2\\pi y \\times L(y) \\times dy$ 的薄板，所以\n\n$$V = 2\\pi\\int_{c}^{d} y\\,L(y) \\, dy。$$\n\n对 $x = y^{2}$、$y$ 轴与 $y = 2$ 围成的区域：$V = 2\\pi\\int_{0}^{2} y \\cdot y^{2} \\, dy = 8\\pi$。",
      ),
      generate: (rng) => shellsAboutXAxis(rng),
    },
    {
      id: "shells-for-a-curve-given-as-y-in-terms-of-x",
      title: t("Shells for a curve given as y in terms of x", "曲线以 y 关于 x 的形式给出时的柱壳"),
      explanation: t(
        "If the curve is given as $y = f(x)$, solve for $x$ to find where each horizontal strip starts and ends. For the region under $y = \\sqrt{x}$ from $x = 0$ to $x = 4$: $x = y^{2}$, and for $0 \\le y \\le 2$ the strip runs from $x = y^{2}$ to $x = 4$, so\n\n$$V = 2\\pi\\int_{0}^{2} y(4 - y^{2}) \\, dy = 8\\pi.$$",
        "若曲线以 $y = f(x)$ 给出，先解出 $x$，确定每个水平窄条的起点和终点。对 $y = \\sqrt{x}$ 下方从 $x = 0$ 到 $x = 4$ 的区域：$x = y^{2}$，当 $0 \\le y \\le 2$ 时窄条从 $x = y^{2}$ 延伸到 $x = 4$，所以\n\n$$V = 2\\pi\\int_{0}^{2} y(4 - y^{2}) \\, dy = 8\\pi。$$",
      ),
      generate: (rng) => (rng.bool() ? rootCurveShells(rng) : parabolaShells(rng)),
    },
  ],
};

/** shellsBetweenCurves rotates the region between x = f(y) and x = g(y) for a ≤ y ≤ b, or between y = f(x) and y = g(x) for a ≤ x ≤ b. */
function shellsBetweenCurves(rng: Rng, v: Variable) {
  const u = across(v);
  const { f, g, d, a, b } = randomWasher(rng, 0);
  const [fl, gl, dl] = [pLatex(f, v), pLatex(g, v), pLatex(d, v)];
  const { q, work } = shellWork(d, dl, a, b, v);
  const strip =
    v === "y" ? t("A horizontal strip at height $y$", "高度 $y$ 处的水平窄条") : t("A vertical strip at $x$", "$x$ 处的竖直窄条");
  return piProblem(
    volumePrompt([m(`${u} = ${fl}`), m(`${u} = ${gl}`), m(`${v} = ${a}`), m(`${v} = ${b}`)], axisName(u)),
    q,
    [intQ(vTimes(f), a, b).mul(Q.of(2)), intQ(minus(sq(f), sq(g)), a, b), q.div(Q.of(2))],
    `${strip.en} runs from $${u} = ${gl}$ to $${u} = ${fl}$, so its length is $${dl}$ and the shell radius is $${v}$. Hence $${work}$.`,
    `${strip["zh-CN"]}从 $${u} = ${gl}$ 延伸到 $${u} = ${fl}$，长为 $${dl}$，柱壳半径为 $${v}$。因此 $${work}$。`,
  );
}

/** MeetingShells is a region between two meeting curves for a ≤ v ≤ b, with shell height h. */
interface MeetingShells {
  readonly curves: readonly [string, string];
  readonly firstQuadrant: boolean;
  readonly meet: string;
  readonly h: Poly;
  readonly a: number;
  readonly b: number;
  readonly wrong: readonly Q[];
}

/** meetingShellsAboutXAxis are regions between meeting curves of the form x = g(y). */
const meetingShellsAboutXAxis: readonly ((rng: Rng) => MeetingShells)[] = [
  (rng) => {
    const k = rng.int(1, 4);
    const j = rng.int(1, 5);
    return {
      curves: [`x = ${k1(k)}y^{2}`, `x = ${k1(k * j)}y`],
      firstQuadrant: false,
      meet: `y = 0 and y = ${j}`,
      h: [0, k * j, -k],
      a: 0,
      b: j,
      wrong: [Q.of(2 * k * k * j ** 5, 15)],
    };
  },
  (rng) => {
    const k = rng.int(1, 4);
    return {
      curves: ["x = y^{3}", `x = ${k1(k * k)}y`],
      firstQuadrant: true,
      meet: `y = 0 and y = ${k}`,
      h: [0, k * k, 0, -1],
      a: 0,
      b: k,
      wrong: [Q.of(4 * k ** 7, 21)],
    };
  },
  (rng) => {
    const c = rng.int(1, 5);
    return {
      curves: ["x = y^{2}", `x = ${c * c}`],
      firstQuadrant: true,
      meet: `y = 0 and y = ${c}`,
      h: [c * c, 0, -1],
      a: 0,
      b: c,
      wrong: [Q.of(2 * c ** 3, 3)],
    };
  },
];

/** meetingShellsAboutYAxis are regions between meeting curves of the form y = f(x). */
const meetingShellsAboutYAxis: readonly ((rng: Rng) => MeetingShells)[] = [
  (rng) => {
    const k = rng.int(1, 5);
    return {
      curves: [`y = ${k1(k)}x`, "y = x^{2}"],
      firstQuadrant: false,
      meet: `x = 0 and x = ${k}`,
      h: [0, k, -1],
      a: 0,
      b: k,
      wrong: [Q.of(2 * k ** 5, 15)],
    };
  },
  (rng) => {
    const k = rng.int(1, 4);
    return {
      curves: [`y = ${k1(k * k)}x`, "y = x^{3}"],
      firstQuadrant: true,
      meet: `x = 0 and x = ${k}`,
      h: [0, k * k, 0, -1],
      a: 0,
      b: k,
      wrong: [Q.of(4 * k ** 7, 21)],
    };
  },
  (rng) => {
    const c = rng.int(1, 3);
    const s = rng.int(1, 4);
    return {
      curves: [`y = ${pLatex([c * s * s, 0, -c])}`, "y = 0"],
      firstQuadrant: true,
      meet: `x = 0 and x = ${s}`,
      h: [c * s * s, 0, -c],
      a: 0,
      b: s,
      wrong: [Q.of(8 * c * c * s ** 5, 15)],
    };
  },
];

/** meetingShellsProblem rotates a region between meeting curves about the axis perpendicular to v. */
function meetingShellsProblem(rng: Rng, v: Variable) {
  const c = rng.pick(v === "y" ? meetingShellsAboutXAxis : meetingShellsAboutYAxis)(rng);
  const u = across(v);
  const hl = pLatex(c.h, v);
  const { q, work } = shellWork(c.h, hl, c.a, c.b, v);
  const meet = `$${c.meet.replace(" and ", "$ and $")}$`;
  return piProblem(
    volumePrompt([m(c.curves[0]), c.curves[1] === "y = 0" ? axisName("x") : m(c.curves[1])], axisName(u), c.firstQuadrant),
    q,
    [...c.wrong, q.mul(Q.of(2)), q.div(Q.of(2))],
    `The region lies between ${meet}, where the strip has length $${hl}$ and the shell radius is $${v}$. So $${work}$.`,
    `区域位于 ${meet.replace(" and ", " 和 ")} 之间，窄条长为 $${hl}$，柱壳半径为 $${v}$。所以 $${work}$。`,
  );
}

/** theShellMethodRotatingARegionBetweenTwoCurvesAboutTheXAxis uses the distance between two curves as the shell height. */
export const theShellMethodRotatingARegionBetweenTwoCurvesAboutTheXAxis: TopicDef = {
  id: "the-shell-method-rotating-a-region-between-two-curves-about-the-x-axis",
  title: t("The Shell Method: Rotating a Region Between Two Curves About the X-Axis", "柱壳法：两曲线之间的区域绕 x 轴旋转"),
  summary: t(
    "For a region between x = f(y) and x = g(y), the shell height is f(y) - g(y).",
    "对 x = f(y) 与 x = g(y) 之间的区域，柱壳的高为 f(y) - g(y)。",
  ),
  prerequisites: ["the-shell-method-rotating-a-region-about-the-x-axis"],
  encompasses: [{ topic: "the-shell-method-rotating-a-region-about-the-x-axis", weight: 0.6 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "shells-between-curves-on-an-interval",
      title: t("Shells between curves on an interval", "区间上两曲线之间的柱壳"),
      explanation: t(
        "If $f(y) \\ge g(y)$ for $c \\le y \\le d$, the horizontal strip at height $y$ runs from $x = g(y)$ to $x = f(y)$, so its length is $f(y) - g(y)$:\n\n$$V = 2\\pi\\int_{c}^{d} y\\left(f(y) - g(y)\\right) dy.$$\n\nOnly the difference of the curves matters, not their position along the $x$-axis.",
        "若当 $c \\le y \\le d$ 时 $f(y) \\ge g(y)$，高度 $y$ 处的水平窄条从 $x = g(y)$ 延伸到 $x = f(y)$，长为 $f(y) - g(y)$：\n\n$$V = 2\\pi\\int_{c}^{d} y\\left(f(y) - g(y)\\right) dy。$$\n\n只有两曲线之差起作用，与它们沿 $x$ 轴的位置无关。",
      ),
      generate: (rng) => shellsBetweenCurves(rng, "y"),
    },
    {
      id: "shells-between-intersecting-curves",
      title: t("Shells between intersecting curves", "相交曲线之间的柱壳"),
      explanation: t(
        "When the curves enclose a region by themselves, find the limits by solving for where they meet, then decide which is farther right. For $x = y^{2}$ and $x = 2y$: $y^{2} = 2y$ gives $y = 0$ and $y = 2$, and $2y \\ge y^{2}$ between them, so\n\n$$V = 2\\pi\\int_{0}^{2} y(2y - y^{2}) \\, dy = \\frac{8\\pi}{3}.$$",
        "当两条曲线自己围成区域时，先解出交点得到积分限，再判断哪条在右边。对 $x = y^{2}$ 与 $x = 2y$：由 $y^{2} = 2y$ 得 $y = 0$ 和 $y = 2$，两者之间 $2y \\ge y^{2}$，所以\n\n$$V = 2\\pi\\int_{0}^{2} y(2y - y^{2}) \\, dy = \\frac{8\\pi}{3}。$$",
      ),
      generate: (rng) => meetingShellsProblem(rng, "y"),
    },
  ],
};

/** shellsUnderCurve rotates the region under y = f(x) for a ≤ x ≤ b about the y-axis. */
function shellsUnderCurve(rng: Rng) {
  const f: Poly = [rng.int(1, 5), rng.int(0, 3), rng.int(0, 1)];
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const fl = pLatex(f);
  const { q, work } = shellWork(f, fl, a, b, "x");
  return piProblem(
    volumePrompt([m(`y = ${fl}`), axisName("x"), m(`x = ${a}`), m(`x = ${b}`)], axisName("y")),
    q,
    [intQ(f, a, b).mul(Q.of(2)), intQ(vTimes(f), a, b), intQ(sq(f), a, b)],
    `A vertical strip at $x$ has height $${fl}$; rotating it about the $y$-axis sweeps out a shell of radius $x$. So $${work}$.`,
    `$x$ 处的竖直窄条高为 $${fl}$；它绕 $y$ 轴旋转形成半径为 $x$ 的柱壳。所以 $${work}$。`,
  );
}

/** theShellMethodRotationAboutTheYAxis sums cylindrical shells around the y-axis. */
export const theShellMethodRotationAboutTheYAxis: TopicDef = {
  id: "the-shell-method-rotation-about-the-y-axis",
  title: t("The Shell Method: Rotation About the Y-Axis", "柱壳法：绕 y 轴旋转"),
  summary: t(
    "Vertical strips rotated about the y-axis form shells, so V = 2π∫ x·(height) dx.",
    "竖直窄条绕 y 轴旋转形成柱壳，所以 V = 2π∫ x·（高）dx。",
  ),
  prerequisites: ["the-shell-method-rotating-a-region-about-the-x-axis"],
  encompasses: [{ topic: "the-shell-method-rotating-a-region-about-the-x-axis", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "shells-under-a-curve",
      title: t("Shells under a curve", "曲线下方区域的柱壳"),
      explanation: t(
        "Rotating the region under $y = f(x)$, for $0 \\le a \\le x \\le b$, about the $y$-axis: the vertical strip at $x$ has height $f(x)$ and sweeps out a shell of radius $x$, so\n\n$$V = 2\\pi\\int_{a}^{b} x f(x) \\, dx.$$\n\nThis avoids solving $y = f(x)$ for $x$. For $y = x^{2}$ on $[0, 2]$: $V = 2\\pi\\int_{0}^{2} x^{3} \\, dx = 8\\pi$.",
        "把 $y = f(x)$ 下方（$0 \\le a \\le x \\le b$）的区域绕 $y$ 轴旋转：$x$ 处的竖直窄条高为 $f(x)$，形成半径为 $x$ 的柱壳，所以\n\n$$V = 2\\pi\\int_{a}^{b} x f(x) \\, dx。$$\n\n这样无需从 $y = f(x)$ 解出 $x$。对 $[0, 2]$ 上的 $y = x^{2}$：$V = 2\\pi\\int_{0}^{2} x^{3} \\, dx = 8\\pi$。",
      ),
      generate: (rng) => shellsUnderCurve(rng),
    },
    {
      id: "shells-between-two-curves",
      title: t("Shells between two curves", "两曲线之间的柱壳"),
      explanation: t(
        "For the region between $y = f(x)$ and $y = g(x)$ with $f \\ge g$, the strip height is $f(x) - g(x)$:\n\n$$V = 2\\pi\\int_{a}^{b} x\\left(f(x) - g(x)\\right) dx.$$\n\nFor $y = x$ and $y = x^{2}$, which meet at $x = 0$ and $x = 1$: $V = 2\\pi\\int_{0}^{1} x(x - x^{2}) \\, dx = \\frac{\\pi}{6}$.",
        "对 $y = f(x)$ 与 $y = g(x)$（$f \\ge g$）之间的区域，窄条高为 $f(x) - g(x)$：\n\n$$V = 2\\pi\\int_{a}^{b} x\\left(f(x) - g(x)\\right) dx。$$\n\n对交于 $x = 0$ 和 $x = 1$ 的 $y = x$ 与 $y = x^{2}$：$V = 2\\pi\\int_{0}^{1} x(x - x^{2}) \\, dx = \\frac{\\pi}{6}$。",
      ),
      generate: (rng) => (rng.bool() ? meetingShellsProblem(rng, "x") : shellsBetweenCurves(rng, "x")),
    },
  ],
};

/** rootTimes writes q·√n·symbol with the square factors of n taken out. */
export function rootTimes(q: Q, n: number, symbol: string) {
  let s = Math.floor(Math.sqrt(n));
  while (n % (s * s) !== 0) s--;
  const rest = n / (s * s);
  return times(q.mul(Q.of(s)), `${rest === 1 ? "" : `\\sqrt{${rest}}`}${symbol}`);
}

/** surfacePrompt asks for the area of the surface swept out by rotating a curve. */
function surfacePrompt(curve: string, v: Variable, a: number, b: number, about: Variable): Text {
  return t(
    `Find the area of the surface obtained by rotating the curve $${curve}$, $${a} \\le ${v} \\le ${b}$, about the $${about}$-axis. Give an exact answer.`,
    `求曲线 $${curve}$（$${a} \\le ${v} \\le ${b}$）绕 $${about}$ 轴旋转一周所得曲面的面积，给出精确值。`,
  );
}

/** slopes are the slopes n/d of the rotated segments. */
const slopes: readonly (readonly [number, number])[] = [
  [1, 1],
  [2, 1],
  [3, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [4, 3],
];

/** surfaceLine rotates a segment u = (n/d)v + c about the v-axis, or about the u-axis when aboutV is false. */
function surfaceLine(rng: Rng, v: Variable, aboutV: boolean) {
  const u = across(v);
  const [n, d] = rng.pick(slopes);
  const slope = Q.of(n, d);
  const c = rng.int(0, 4);
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const line = `${coef(slope)}${v}${c === 0 ? "" : ` + ${c}`}`;
  const N = n * n + d * d;
  const I = aboutV ? slope.mul(Q.of(b * b - a * a, 2)).add(Q.of(c * (b - a))) : Q.of(b * b - a * a, 2);
  const root = rootTimes(Q.of(1, d), N, "");
  const answer = rootTimes(I.mul(Q.of(2, d)), N, "\\pi");
  const axis = aboutV ? v : u;
  const radius = aboutV ? line : v;
  const work = `S = 2\\pi \\cdot ${root}${int(a, b, `\\left(${radius}\\right)`, v)} = ${answer}`;
  return exactProblem(
    surfacePrompt(`${u} = ${line}`, v, a, b, axis),
    answer,
    [rootTimes(I.mul(Q.of(1, d)), N, "\\pi"), piL(I.mul(Q.of(2))), rootTimes(Q.of(2 * (b - a), d), N, "\\pi")],
    `$\\frac{d${u}}{d${v}} = ${slope.toLatex()}$, so $\\sqrt{1 + \\left(\\frac{d${u}}{d${v}}\\right)^{2}} = ${root}$. The radius is the distance to the $${axis}$-axis, $${radius}$, so $${work}$.`,
    `$\\frac{d${u}}{d${v}} = ${slope.toLatex()}$，所以 $\\sqrt{1 + \\left(\\frac{d${u}}{d${v}}\\right)^{2}} = ${root}$。半径是到 $${axis}$ 轴的距离 $${radius}$，所以 $${work}$。`,
  );
}

/** surfaceSphere rotates an arc of the circle u = √(r² - v²) about the v-axis. */
function surfaceSphere(rng: Rng, v: Variable) {
  const u = across(v);
  const r = rng.int(2, 6);
  const a = rng.int(-r, r - 1);
  const b = rng.int(a + 1, r);
  const q = Q.of(2 * r * (b - a));
  const rootL = `\\sqrt{${r * r} - ${v}^{2}}`;
  const work = `${u}\\sqrt{1 + \\left(\\frac{d${u}}{d${v}}\\right)^{2}} = ${rootL} \\cdot \\frac{${r}}{${rootL}} = ${r}`;
  return piProblem(
    surfacePrompt(`${u} = ${rootL}`, v, a, b, v),
    q,
    [Q.of(r * (b - a)), Q.of(4 * r * r), Q.of(2 * r * r * (b - a))],
    `$\\frac{d${u}}{d${v}} = -\\frac{${v}}{${rootL}}$, so $1 + \\left(\\frac{d${u}}{d${v}}\\right)^{2} = \\frac{${r * r}}{${r * r} - ${v}^{2}}$ and $${work}$. Hence $S = 2\\pi${int(a, b, `${r}`, v)} = ${piL(q)}$.`,
    `$\\frac{d${u}}{d${v}} = -\\frac{${v}}{${rootL}}$，所以 $1 + \\left(\\frac{d${u}}{d${v}}\\right)^{2} = \\frac{${r * r}}{${r * r} - ${v}^{2}}$，$${work}$。因此 $S = 2\\pi${int(a, b, `${r}`, v)} = ${piL(q)}$。`,
  );
}

/** oddPairs are pairs j < k of odd numbers; 4v + 4c + 1 runs from j² to k². */
const oddPairs: readonly (readonly [number, number])[] = [
  [1, 3],
  [1, 5],
  [1, 7],
  [1, 9],
  [3, 5],
  [3, 7],
  [3, 9],
  [5, 7],
  [5, 9],
];

/** surfaceRoot rotates u = √(v + c) about the v-axis between limits where 4v + 4c + 1 is a perfect square. */
function surfaceRoot(rng: Rng, v: Variable) {
  const u = across(v);
  const c = rng.int(0, 3);
  const [j, k] = rng.pick(oddPairs);
  const a = (j * j - 1) / 4 - c;
  const b = (k * k - 1) / 4 - c;
  const q = Q.of(k ** 3 - j ** 3, 6);
  const inner = pLatex([c, 1], v);
  const w = pLatex([4 * c + 1, 4], v);
  const work = `S = \\pi${int(a, b, `\\sqrt{${w}}`, v)} = \\frac{\\pi}{6}\\Big[(${w})^{3/2}\\Big]_{${a}}^{${b}} = \\frac{\\pi}{6}(${k}^{3} - ${j}^{3}) = ${piL(q)}`;
  return piProblem(
    surfacePrompt(`${u} = \\sqrt{${inner}}`, v, a, b, v),
    q,
    [Q.of(k ** 3 - j ** 3, 3), Q.of(k ** 3 - j ** 3, 12), Q.of(k ** 3, 6)],
    `$\\frac{d${u}}{d${v}} = \\frac{1}{2\\sqrt{${inner}}}$, so $${u}\\sqrt{1 + \\left(\\frac{d${u}}{d${v}}\\right)^{2}} = \\sqrt{${inner} + \\frac{1}{4}} = \\frac{1}{2}\\sqrt{${w}}$. Hence $${work}$.`,
    `$\\frac{d${u}}{d${v}} = \\frac{1}{2\\sqrt{${inner}}}$，所以 $${u}\\sqrt{1 + \\left(\\frac{d${u}}{d${v}}\\right)^{2}} = \\sqrt{${inner} + \\frac{1}{4}} = \\frac{1}{2}\\sqrt{${w}}$。因此 $${work}$。`,
  );
}

/** surfaceAreasOfRevolutionRotationAboutTheXAxis integrates 2π f(x) √(1 + f′(x)²). */
export const surfaceAreasOfRevolutionRotationAboutTheXAxis: TopicDef = {
  id: "surface-areas-of-revolution-rotation-about-the-x-axis",
  title: t("Surface Areas of Revolution: Rotation About the X-Axis", "旋转曲面的面积：绕 x 轴旋转"),
  summary: t(
    "Rotating y = f(x) about the x-axis sweeps out a surface of area 2π∫ f(x)√(1 + f′(x)²) dx.",
    "y = f(x) 绕 x 轴旋转所得曲面的面积为 2π∫ f(x)√(1 + f′(x)²) dx。",
  ),
  prerequisites: [
    "the-arc-length-of-a-planar-curve",
    "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes",
    "surface-areas-of-right-cones",
  ],
  encompasses: [{ topic: "the-arc-length-of-a-planar-curve", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "surfaces-from-line-segments",
      title: t("Surfaces from line segments", "由线段旋转得到的曲面"),
      explanation: t(
        "A short piece of the curve with arc length $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$, at distance $f(x)$ from the axis, sweeps out a thin band of area $2\\pi f(x) \\, ds$. So rotating $y = f(x) \\ge 0$, $a \\le x \\le b$, about the $x$-axis gives\n\n$$S = 2\\pi\\int_{a}^{b} f(x)\\sqrt{1 + f'(x)^{2}} \\, dx.$$\n\nFor a line the square root is a constant. Rotating $y = x$, $0 \\le x \\le 1$, gives $S = 2\\pi\\sqrt{2}\\int_{0}^{1} x \\, dx = \\sqrt{2}\\pi$, the lateral area of a cone with radius $1$ and slant height $\\sqrt{2}$.",
        "曲线上弧长为 $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$、到旋转轴距离为 $f(x)$ 的一小段，旋转后形成面积为 $2\\pi f(x) \\, ds$ 的窄带。所以 $y = f(x) \\ge 0$（$a \\le x \\le b$）绕 $x$ 轴旋转所得曲面的面积为\n\n$$S = 2\\pi\\int_{a}^{b} f(x)\\sqrt{1 + f'(x)^{2}} \\, dx。$$\n\n对直线，根号部分是常数。$y = x$（$0 \\le x \\le 1$）旋转得 $S = 2\\pi\\sqrt{2}\\int_{0}^{1} x \\, dx = \\sqrt{2}\\pi$，正是半径为 $1$、母线长为 $\\sqrt{2}$ 的圆锥的侧面积。",
      ),
      generate: (rng) => surfaceLine(rng, "x", true),
    },
    {
      id: "surfaces-from-curves",
      title: t("Surfaces from curves", "由曲线旋转得到的曲面"),
      explanation: t(
        "Simplify $f(x)\\sqrt{1 + f'(x)^{2}}$ before integrating. For the circle $y = \\sqrt{r^{2} - x^{2}}$, $f'(x) = -\\frac{x}{\\sqrt{r^{2} - x^{2}}}$, so $1 + f'(x)^{2} = \\frac{r^{2}}{r^{2} - x^{2}}$ and $f\\sqrt{1 + (f')^{2}} = r$. A zone of a sphere between $x = a$ and $x = b$ therefore has area $2\\pi r(b - a)$. For $y = \\sqrt{x}$, $f\\sqrt{1 + (f')^{2}} = \\sqrt{x + \\frac{1}{4}}$.",
        "积分前先化简 $f(x)\\sqrt{1 + f'(x)^{2}}$。对圆 $y = \\sqrt{r^{2} - x^{2}}$，$f'(x) = -\\frac{x}{\\sqrt{r^{2} - x^{2}}}$，所以 $1 + f'(x)^{2} = \\frac{r^{2}}{r^{2} - x^{2}}$，$f\\sqrt{1 + (f')^{2}} = r$。因此球面在 $x = a$ 与 $x = b$ 之间的部分面积为 $2\\pi r(b - a)$。对 $y = \\sqrt{x}$，$f\\sqrt{1 + (f')^{2}} = \\sqrt{x + \\frac{1}{4}}$。",
      ),
      generate: (rng) => (rng.bool() ? surfaceSphere(rng, "x") : surfaceRoot(rng, "x")),
    },
  ],
};

/** surfaceParabola rotates y = cx², 0 ≤ x ≤ b, about the y-axis. */
function surfaceParabola(rng: Rng) {
  const c = rng.int(1, 3);
  const b = rng.int(1, 4);
  const N = 1 + 4 * c * c * b * b;
  const D = 6 * c * c;
  const root = rootTimes(Q.of(N), N, "");
  const answer = `\\frac{\\pi}{${D}}\\left(${root} - 1\\right)`;
  return exactProblem(
    surfacePrompt(`y = ${k1(c)}x^{2}`, "x", 0, b, "y"),
    answer,
    [`\\frac{${root}\\pi}{${D}}`, `\\frac{\\pi}{${2 * D}}\\left(${root} - 1\\right)`, `\\frac{\\pi}{${D / c}}\\left(${root} - 1\\right)`],
    `$y' = ${2 * c}x$ and the radius is $x$, so $S = 2\\pi${int(0, b, `x\\sqrt{1 + ${4 * c * c}x^{2}}`)}$. With $w = 1 + ${4 * c * c}x^{2}$ and $dw = ${8 * c * c}x \\, dx$, $S = \\frac{\\pi}{${4 * c * c}}\\int_{1}^{${N}} \\sqrt{w} \\, dw = \\frac{\\pi}{${D}}\\Big[w^{3/2}\\Big]_{1}^{${N}} = ${answer}$.`,
    `$y' = ${2 * c}x$，半径为 $x$，所以 $S = 2\\pi${int(0, b, `x\\sqrt{1 + ${4 * c * c}x^{2}}`)}$。令 $w = 1 + ${4 * c * c}x^{2}$，$dw = ${8 * c * c}x \\, dx$，则 $S = \\frac{\\pi}{${4 * c * c}}\\int_{1}^{${N}} \\sqrt{w} \\, dw = \\frac{\\pi}{${D}}\\Big[w^{3/2}\\Big]_{1}^{${N}} = ${answer}$。`,
  );
}

/** surfaceAreasOfRevolutionRotationAboutTheYAxis uses the distance to the y-axis as the radius. */
export const surfaceAreasOfRevolutionRotationAboutTheYAxis: TopicDef = {
  id: "surface-areas-of-revolution-rotation-about-the-y-axis",
  title: t("Surface Areas of Revolution: Rotation About the Y-Axis", "旋转曲面的面积：绕 y 轴旋转"),
  summary: t(
    "About the y-axis the radius is x, so S = 2π∫ x√(1 + f′(x)²) dx, or 2π∫ g(y)√(1 + g′(y)²) dy for x = g(y).",
    "绕 y 轴旋转时半径为 x，所以 S = 2π∫ x√(1 + f′(x)²) dx；对 x = g(y) 则为 2π∫ g(y)√(1 + g′(y)²) dy。",
  ),
  prerequisites: ["surface-areas-of-revolution-rotation-about-the-x-axis"],
  encompasses: [{ topic: "surface-areas-of-revolution-rotation-about-the-x-axis", weight: 0.6 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "rotating-y-as-a-function-of-x-about-the-y-axis",
      title: t("Rotating y = f(x) about the y-axis", "y = f(x) 绕 y 轴旋转"),
      explanation: t(
        "When $y = f(x)$, $0 \\le a \\le x \\le b$, is rotated about the $y$-axis, a piece of the curve at $x$ is at distance $x$ from the axis, so\n\n$$S = 2\\pi\\int_{a}^{b} x\\sqrt{1 + f'(x)^{2}} \\, dx.$$\n\nFor $y = x^{2}$, $0 \\le x \\le 1$: $S = 2\\pi\\int_{0}^{1} x\\sqrt{1 + 4x^{2}} \\, dx$; substituting $w = 1 + 4x^{2}$ gives $\\frac{\\pi}{6}\\left(5\\sqrt{5} - 1\\right)$.",
        "把 $y = f(x)$（$0 \\le a \\le x \\le b$）绕 $y$ 轴旋转时，曲线在 $x$ 处的一小段到旋转轴的距离为 $x$，所以\n\n$$S = 2\\pi\\int_{a}^{b} x\\sqrt{1 + f'(x)^{2}} \\, dx。$$\n\n对 $y = x^{2}$（$0 \\le x \\le 1$）：$S = 2\\pi\\int_{0}^{1} x\\sqrt{1 + 4x^{2}} \\, dx$，令 $w = 1 + 4x^{2}$ 得 $\\frac{\\pi}{6}\\left(5\\sqrt{5} - 1\\right)$。",
      ),
      generate: (rng) => (rng.int(0, 2) === 0 ? surfaceParabola(rng) : surfaceLine(rng, "x", false)),
    },
    {
      id: "rotating-x-as-a-function-of-y-about-the-y-axis",
      title: t("Rotating x = g(y) about the y-axis", "x = g(y) 绕 y 轴旋转"),
      explanation: t(
        "If the curve is $x = g(y) \\ge 0$, $c \\le y \\le d$, swap the roles of $x$ and $y$ in the formula for rotation about the $x$-axis:\n\n$$S = 2\\pi\\int_{c}^{d} g(y)\\sqrt{1 + g'(y)^{2}} \\, dy.$$\n\nFor example, $x = \\sqrt{r^{2} - y^{2}}$ gives $g\\sqrt{1 + (g')^{2}} = r$, just as for the circle rotated about the $x$-axis.",
        "若曲线为 $x = g(y) \\ge 0$（$c \\le y \\le d$），把绕 $x$ 轴旋转公式中的 $x$ 和 $y$ 互换：\n\n$$S = 2\\pi\\int_{c}^{d} g(y)\\sqrt{1 + g'(y)^{2}} \\, dy。$$\n\n例如 $x = \\sqrt{r^{2} - y^{2}}$ 给出 $g\\sqrt{1 + (g')^{2}} = r$，与圆绕 $x$ 轴旋转时一样。",
      ),
      generate: (rng) => {
        const kind = rng.int(0, 2);
        return kind === 0 ? surfaceLine(rng, "y", true) : kind === 1 ? surfaceSphere(rng, "y") : surfaceRoot(rng, "y");
      },
    },
  ],
};

/** calculusIIRevolutionTopics are the topics of Calculus II modules 2.10–2.11, except surfaces of parametric curves. */
export const calculusIIRevolutionTopics: readonly TopicDef[] = [
  volumesOfRevolutionUsingTheDiscMethodRotationAboutTheCoordinateAxes,
  volumesOfRevolutionUsingTheDiscMethodRotationAboutOtherAxes,
  volumesOfRevolutionUsingTheWasherMethodRotationAboutTheCoordinateAxes,
  volumesOfRevolutionUsingTheWasherMethodRotationAboutOtherAxes,
  theShellMethodRotatingARegionAboutTheXAxis,
  theShellMethodRotatingARegionBetweenTwoCurvesAboutTheXAxis,
  theShellMethodRotationAboutTheYAxis,
  surfaceAreasOfRevolutionRotationAboutTheXAxis,
  surfaceAreasOfRevolutionRotationAboutTheYAxis,
];
