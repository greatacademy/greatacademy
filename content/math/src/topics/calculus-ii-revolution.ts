import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";

import { say } from "../problems.ts";
import { type Poly, pAt, pLatex } from "./calculus-common.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";
import { antiderivativeLatex } from "./calculus-i-riemann.ts";
import { int, intQ, pScale, times } from "./calculus-ii-areas.ts";
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

/** over writes s divided by a positive integer, leaving out a division by 1. */
const over = (s: string, k: number) => (k === 1 ? s : `\\frac{${s}}{${k}}`);

/** wrap puts an expression with a sign in it in parentheses. */
const wrap = (s: string) => (/[+-]/.test(s) ? `\\left(${s}\\right)` : s);

/** product writes a variable times an expression. */
const product = (v: Variable, s: string) =>
  /[+-]/.test(s) ? `${v}\\left(${s}\\right)` : /^\d+$/.test(s) ? `${s}${v}` : `${v} \\cdot ${s}`;

/** sqr writes the square of an expression. */
const sqr = (s: string) => (/^(\d+|[xy])$/.test(s) ? `${s}^{2}` : `\\left(${s}\\right)^{2}`);

/** shown displays a line of math at the end of a sentence. */
const shown = (line: string) => `\n\n$$${line}$$`;

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
  return t(
    `${en.slice(0, -1).join(", ")} and ${en.at(-1)}`,
    `${zh.slice(0, -1).join("、")}${zh.at(-2)?.endsWith("$") ? " " : ""}和${zh.at(-1)?.startsWith("$") ? " " : ""}${zh.at(-1)}`,
  );
}

/** volumePrompt asks for the volume of the solid formed by rotating a region. */
function volumePrompt(bounds: readonly Text[], about: Text, firstQuadrant = false): Text {
  const b = join(bounds);
  return t(
    `The region ${firstQuadrant ? "in the first quadrant " : ""}bounded by ${b.en} is rotated about ${about.en}. Find the volume of the resulting solid. Give an exact answer.`,
    `${firstQuadrant ? "第一象限内" : ""}由 ${b["zh-CN"]}${b["zh-CN"].endsWith("$") ? " " : ""}围成的区域绕${about["zh-CN"].startsWith("$") ? " " : ""}${about["zh-CN"]}${about["zh-CN"].endsWith("$") ? " " : ""}旋转一周，求所得旋转体的体积，给出精确值。`,
  );
}

/** Slip is a wrong multiple of π with what went wrong, in English and Chinese. */
type Slip = readonly [value: Q, en: string, zh: string];

/** noPi answers a response that leaves out π. */
const noPi = (response: string): Said =>
  say(
    response,
    "This leaves out the factor $\\pi$, which comes from the circles swept out by the rotation.",
    "漏掉了因子 $\\pi$，它来自旋转时扫出的圆。",
  );

/** piProblem asks for a rational multiple of π, works it in labelled steps with a check, and answers each wrong multiple with its reason. */
function piProblem(prompt: Text, q: Q, slips: readonly Slip[], parts: readonly Step[], check: Text) {
  return functionWith({ prompt, answer: piL(q), solution: walked(parts, check) }, [
    ...slips.filter(([w]) => !w.isZero() && !w.eq(q)).map(([w, en, zh]) => say(piL(w), en, zh)),
    noPi(q.toLatex()),
  ]);
}

/** shellFactor is the slip of doubling a disc or washer volume with a factor 2π. */
const shellFactor = (q: Q): Slip => [
  q.mul(Q.of(2)),
  "This doubles the volume with a factor $2\\pi$; a disc or washer has area $\\pi$ times a square, with no $2$.",
  "这里多乘了因子 $2$，用了 $2\\pi$；圆盘或垫圈的面积是 $\\pi$ 乘以平方，没有 $2$。",
];

/** halfShell is the slip of using π with shells. */
const halfShell = (q: Q): Slip => [
  q.div(Q.of(2)),
  "This uses $\\pi$ instead of $2\\pi$: a shell of radius $r$ has circumference $2\\pi r$.",
  "这里用了 $\\pi$ 而不是 $2\\pi$：半径为 $r$ 的柱壳周长是 $2\\pi r$。",
];

/** noRadius is the slip of leaving the radius out of a shell. */
const noRadius = (w: Q): Slip => [
  w,
  "This leaves out the radius: each shell contributes $2\\pi$ times its radius times its height.",
  "漏掉了半径：每个柱壳贡献的是 $2\\pi$ 乘以半径再乘以高。",
];

/** unsquared is the slip of integrating a radius instead of its square. */
const unsquared = (w: Q): Slip => [
  w,
  "This integrates the radius instead of its square; a disc of radius $r$ has area $\\pi r^{2}$.",
  "这里积分的是半径而不是半径的平方；半径为 $r$ 的圆盘面积是 $\\pi r^{2}$。",
];

/** squaredDiff is the slip of squaring the difference of the radii of a washer. */
const squaredDiff = (w: Q): Slip => [
  w,
  "This squares the difference of the radii; a washer has area $\\pi(R^{2} - r^{2})$, not $\\pi(R - r)^{2}$.",
  "这里把两半径之差平方了；垫圈面积是 $\\pi(R^{2} - r^{2})$，不是 $\\pi(R - r)^{2}$。",
];

/** noHole is the slip of leaving the hole out of a washer. */
const noHole = (w: Q): Slip => [
  w,
  "This leaves out the hole: it is the volume swept out by the outer boundary alone.",
  "漏掉了中间的孔：这是外边界单独扫出的体积。",
];

/** otherAxis is the slip of rotating about the other coordinate axis. */
const otherAxis = (w: Q, axis: Variable): Slip => [
  w,
  `This is the volume of the solid made by rotating the region about the $${axis}$-axis instead.`,
  `这是区域绕 $${axis}$ 轴旋转所得立体的体积，不是题目要求的旋转轴。`,
];

/** bounds checks k·π times the integral of P over [a, b] against the values of the monotone integrand P at the ends. */
function bounds(P: Poly, a: number, b: number, k: 1 | 2, q: Q, v: Variable): Text {
  const [pa, pb] = [pAt(P, a), pAt(P, b)];
  const pl = pLatex(P, v);
  const factor = k === 2 ? "2\\pi" : "\\pi";
  if (pa === pb)
    return t(
      `The integrand $${pl}$ is constant, so the volume is $${factor}$ times $${pa}$ times the length $${b - a}$ of the interval, which is $${piL(q)}$.`,
      `被积函数 $${pl}$ 是常数，所以体积是 $${factor}$ 乘以 $${pa}$ 再乘以区间长度 $${b - a}$，即 $${piL(q)}$。`,
    );
  const at = (x: number) => piL(Q.of(k * (b - a) * x));
  const [lo, hi] = pa < pb ? [pa, pb] : [pb, pa];
  const line = shown(`${at(lo)} \\le ${piL(q)} \\le ${at(hi)}`);
  return t(
    `On $[${a}, ${b}]$ the integrand $${pl}$ ${pa < pb ? "rises" : "falls"} from $${pa}$ to $${pb}$. So the volume lies between the values that the constant integrands $${lo}$ and $${hi}$ give over this interval of length $${b - a}$:${line}`,
    `在 $[${a}, ${b}]$ 上被积函数 $${pl}$ 从 $${pa}$ ${pa < pb ? "增大" : "减小"}到 $${pb}$。所以体积介于被积函数取常数 $${lo}$ 和 $${hi}$ 时在这个长为 $${b - a}$ 的区间上给出的值之间：${line}`,
  );
}

/** discProblem rotates the region between a curve and the v-axis about that axis, for a ≤ v ≤ b. */
function discProblem(rng: Rng, v: Variable) {
  const u = across(v);
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const root = rng.bool();
  const p: Poly = root ? [rng.int(0, 4), rng.int(1, 4)] : [rng.int(1, 5), rng.int(1, 3), rng.int(0, 1)];
  const f = root ? `\\sqrt{${pLatex(p, v)}}` : pLatex(p, v);
  const r2 = root ? p : sq(p);
  const q = intQ(r2, a, b);
  return piProblem(
    volumePrompt([m(`${u} = ${f}`), axisName(v), m(`${v} = ${a}`), m(`${v} = ${b}`)], axisName(v)),
    q,
    root
      ? [
          shellFactor(q),
          [
            q.div(Q.of(2)),
            "This halves the volume, as if a disc had area $\\frac{1}{2}\\pi r^{2}$; its area is $\\pi r^{2}$.",
            "这里把体积减半了，好像圆盘面积是 $\\frac{1}{2}\\pi r^{2}$；圆盘面积是 $\\pi r^{2}$。",
          ],
        ]
      : [unsquared(intQ(p, a, b)), shellFactor(q)],
    [
      [
        ["Find the radius", "求半径"],
        t(
          `Each cross section perpendicular to the $${v}$-axis is a disc of radius $${f}$, so its area is $\\pi$ times the radius squared:`,
          `垂直于 $${v}$ 轴的每个截面都是半径为 $${f}$ 的圆盘，面积是 $\\pi$ 乘以半径的平方：`,
        ),
        [`A(${v}) = \\pi${sqr(f)} = \\pi${/[+-]/.test(pLatex(r2, v)) ? wrap(pLatex(r2, v)) : ` ${pLatex(r2, v)}`}`],
      ],
      [
        ["Integrate", "积分"],
        t(`Add the discs from $${v} = ${a}$ to $${v} = ${b}$:`, `把 $${v} = ${a}$ 到 $${v} = ${b}$ 的圆盘累加：`),
        [`V = \\pi${int(a, b, wrap(pLatex(r2, v)), v)}`, `= \\pi${bracket(r2, a, b, v)} = ${piL(q)}`],
      ],
    ],
    bounds(r2, a, b, 1, q, v),
  );
}

/** parabolaAboutYAxis rotates the region between y = cx², the y-axis and y = h about the y-axis. */
function parabolaAboutYAxis(rng: Rng) {
  const c = rng.int(1, 3);
  const h = rng.int(1, 6);
  const q = Q.of(h * h, 2 * c);
  const x2 = over("y", c);
  const cylinder = piL(Q.of(h * h, c));
  return piProblem(
    volumePrompt([m(`y = ${k1(c)}x^{2}`), axisName("y"), m(`y = ${h}`)], axisName("y")),
    q,
    [
      [
        Q.of(h * h, c),
        "This forgets to divide by $2$ when integrating $y$: an antiderivative of $y$ is $\\frac{y^{2}}{2}$.",
        "对 $y$ 积分时忘了除以 $2$：$y$ 的原函数是 $\\frac{y^{2}}{2}$。",
      ],
      [
        Q.of(h * h, 2),
        `This drops the coefficient: from $y = ${c}x^{2}$ the radius squared is $x^{2} = ${x2}$, not $y$.`,
        `漏掉了系数：由 $y = ${c}x^{2}$ 得半径的平方是 $x^{2} = ${x2}$，不是 $y$。`,
      ],
      [
        Q.of(h ** 3, 3 * c * c),
        `This squares $${x2}$ again, but $${x2}$ is already the square of the radius.`,
        `这里把 $${x2}$ 又平方了一次，但 $${x2}$ 已经是半径的平方。`,
      ],
    ],
    [
      [
        ["Solve for the radius", "解出半径"],
        t(
          `The discs are horizontal, so integrate in $y$. Solving $y = ${k1(c)}x^{2}$ for $x^{2}$ gives the square of the radius at height $y$:`,
          `圆盘是水平的，所以对 $y$ 积分。从 $y = ${k1(c)}x^{2}$ 解出 $x^{2}$，得到高度 $y$ 处半径的平方：`,
        ),
        [`x^{2} = ${x2}`],
      ],
      [
        ["Integrate", "积分"],
        t(`Add the discs from $y = 0$ to $y = ${h}$:`, `把 $y = 0$ 到 $y = ${h}$ 的圆盘累加：`),
        [`V = \\pi${int(0, h, x2, "y")} = \\pi\\Big[\\frac{y^{2}}{${2 * c}}\\Big]_{0}^{${h}} = ${piL(q)}`],
      ],
    ],
    t(
      `The solid is a paraboloid, which fills half of the cylinder around it. At the top the radius squared is $${over(`${h}`, c)}$ and the height is $${h}$, so the cylinder has volume $${cylinder}$ and half of it is${shown(`\\frac{1}{2} \\cdot ${cylinder} = ${piL(q)}`)}`,
      `这个立体是旋转抛物体，占外接圆柱的一半。顶部半径的平方是 $${over(`${h}`, c)}$，高为 $${h}$，所以圆柱体积为 $${cylinder}$，它的一半是${shown(`\\frac{1}{2} \\cdot ${cylinder} = ${piL(q)}`)}`,
    ),
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
  intro: t(
    "A solid whose cross sections perpendicular to the $x$-axis are discs of radius $x$, for $0 \\le x \\le 3$, has volume\n\n$$V = \\int_{0}^{3} \\pi x^{2} \\, dx = \\pi\\Big[\\frac{x^{3}}{3}\\Big]_{0}^{3} = 9\\pi$$\n\nCheck: this solid is a cone of radius $3$ and height $3$, and the cone formula gives one third of $\\pi \\cdot 3^{2} \\cdot 3 = 27\\pi$, which is $9\\pi$.\n\nIn this lesson we make such solids by rotating a region about a coordinate axis, and find their volumes by adding up discs.",
    "垂直于 $x$ 轴的截面是半径为 $x$ 的圆盘（$0 \\le x \\le 3$）的立体，体积为\n\n$$V = \\int_{0}^{3} \\pi x^{2} \\, dx = \\pi\\Big[\\frac{x^{3}}{3}\\Big]_{0}^{3} = 9\\pi$$\n\n检验：这个立体是半径为 $3$、高为 $3$ 的圆锥，圆锥公式给出 $\\pi \\cdot 3^{2} \\cdot 3 = 27\\pi$ 的三分之一，即 $9\\pi$。\n\n这节课我们把区域绕坐标轴旋转得到这样的立体，并把圆盘累加求出体积。",
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
      figure: calculusDrawings4["volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes#discs-about-the-x-axis"],
      title: t("Discs about the x-axis", "绕 x 轴旋转的圆盘"),
      explanation: t(
        "When the region between $y = f(x)$ and the $x$-axis, for $a \\le x \\le b$, is rotated about the $x$-axis, each cross section perpendicular to the axis is a disc of radius $f(x)$ and area $\\pi f(x)^{2}$. Adding the discs,\n\n$$V = \\pi\\int_{a}^{b} f(x)^{2} \\, dx$$\n\nFor example, rotating the region under $y = \\sqrt{x}$ for $0 \\le x \\le 4$ gives $V = \\pi\\int_{0}^{4} x \\, dx = 8\\pi$.\n\nCheck: the radius grows to $\\sqrt{4} = 2$, so the solid fits in a cylinder of radius $2$ and length $4$, of volume $16\\pi$. The solid is a paraboloid, which fills exactly half of that cylinder, $8\\pi$.\n\n> **Watch out.** Square the radius before integrating. $\\pi\\int_{0}^{4} \\sqrt{x} \\, dx$ adds up radii, not areas, so it is not the volume.",
        "把 $y = f(x)$ 与 $x$ 轴之间（$a \\le x \\le b$）的区域绕 $x$ 轴旋转，垂直于旋转轴的每个截面都是半径为 $f(x)$、面积为 $\\pi f(x)^{2}$ 的圆盘。把圆盘累加，\n\n$$V = \\pi\\int_{a}^{b} f(x)^{2} \\, dx$$\n\n例如 $y = \\sqrt{x}$ 下方 $0 \\le x \\le 4$ 的区域旋转所得体积为 $V = \\pi\\int_{0}^{4} x \\, dx = 8\\pi$。\n\n检验：半径最大为 $\\sqrt{4} = 2$，所以这个立体放得进半径为 $2$、长为 $4$ 的圆柱，圆柱体积为 $16\\pi$。这个立体是旋转抛物体，恰好占这个圆柱的一半，即 $8\\pi$。\n\n> **注意。** 积分前要先把半径平方。$\\pi\\int_{0}^{4} \\sqrt{x} \\, dx$ 累加的是半径而不是面积，所以不是体积。",
      ),
      generate: (rng) => discProblem(rng, "x"),
    },
    {
      id: "discs-about-the-y-axis",
      figure: calculusDrawings4["volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes#discs-about-the-y-axis"],
      title: t("Discs about the y-axis", "绕 y 轴旋转的圆盘"),
      explanation: t(
        "When a region is rotated about the $y$-axis, the discs are horizontal, so integrate with respect to $y$: write the curve as $x = g(y)$, and\n\n$$V = \\pi\\int_{c}^{d} g(y)^{2} \\, dy$$\n\nFor the region between $y = x^{2}$, the $y$-axis and $y = 4$, solving for $x$ gives $x^{2} = y$, so $V = \\pi\\int_{0}^{4} y \\, dy = 8\\pi$.\n\nCheck: the solid is a paraboloid with radius $2$ at the top and height $4$. It fills half of the cylinder around it, whose volume is $\\pi \\cdot 2^{2} \\cdot 4 = 16\\pi$, and half of that is $8\\pi$.\n\n> **Watch out.** The limits are heights on the $y$-axis, here $0$ and $4$, not the $x$-values $0$ and $2$.",
        "区域绕 $y$ 轴旋转时圆盘是水平的，所以对 $y$ 积分：把曲线写成 $x = g(y)$，则\n\n$$V = \\pi\\int_{c}^{d} g(y)^{2} \\, dy$$\n\n对 $y = x^{2}$、$y$ 轴与 $y = 4$ 围成的区域，解出 $x$ 得 $x^{2} = y$，所以 $V = \\pi\\int_{0}^{4} y \\, dy = 8\\pi$。\n\n检验：这个立体是顶部半径为 $2$、高为 $4$ 的旋转抛物体，占外接圆柱的一半。圆柱体积为 $\\pi \\cdot 2^{2} \\cdot 4 = 16\\pi$，一半是 $8\\pi$。\n\n> **注意。** 积分限是 $y$ 轴上的高度，这里是 $0$ 和 $4$，不是 $x$ 的值 $0$ 和 $2$。",
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
  const up = rng.bool();
  const f = pSum([k], pScale(g, up ? 1 : -1));
  const [fl, gl] = [pLatex(f, v), pLatex(g, v)];
  const q = intQ(sq(g), a, b);
  const line = `${u} = ${k}`;
  const distance = up ? `${wrap(fl)} - ${k < 0 ? `(${k})` : k}` : `${k} - ${wrap(fl)}`;
  return piProblem(
    volumePrompt([m(`${u} = ${fl}`), lineName(line), m(`${v} = ${a}`), m(`${v} = ${b}`)], lineName(line)),
    q,
    [
      [
        intQ(sq(f), a, b),
        `This measures the radius from the $${v}$-axis instead of from the line $${line}$.`,
        `这里从 $${v}$ 轴量半径，而不是从直线 $${line}$ 量起。`,
      ],
      unsquared(intQ(g, a, b)),
      shellFactor(q),
    ],
    [
      [
        ["Find the radius", "求半径"],
        t(
          `The curve lies ${up ? (v === "x" ? "above" : "to the right of") : v === "x" ? "below" : "to the left of"} the axis $${line}$, and the radius is the distance between them:`,
          `曲线在旋转轴 $${line}$ 的${up ? (v === "x" ? "上方" : "右侧") : v === "x" ? "下方" : "左侧"}，半径是两者之间的距离：`,
        ),
        [`r = ${distance} = ${gl}`],
      ],
      [
        ["Integrate", "积分"],
        t("Square the radius and add the discs:", "把半径平方，再把圆盘累加："),
        [
          `V = \\pi${int(a, b, sqr(gl), v)}`,
          `= \\pi${int(a, b, wrap(pLatex(sq(g), v)), v)}`,
          `= \\pi${bracket(sq(g), a, b, v)} = ${piL(q)}`,
        ],
      ],
    ],
    bounds(sq(g), a, b, 1, q, v),
  );
}

/** parabolaAboutItsChord rotates the region between y = x² and y = s² about y = s². */
function parabolaAboutItsChord(rng: Rng) {
  const s = rng.int(1, 3);
  const q = Q.of(16 * s ** 5, 15);
  const p: Poly = [s ** 4, 0, -2 * s * s, 0, 1];
  const line = `y = ${s * s}`;
  const half = `2\\pi\\left(${s ** 5} - ${Q.of(2 * s ** 5, 3).toLatex()} + ${Q.of(s ** 5, 5).toLatex()}\\right) = ${piL(q)}`;
  return piProblem(
    volumePrompt([m("y = x^{2}"), lineName(line)], lineName(line)),
    q,
    [
      [
        Q.of(8 * s ** 5, 5),
        `This rotates the region about the $x$-axis instead of the line $${line}$.`,
        `这里绕 $x$ 轴旋转，而不是绕直线 $${line}$。`,
      ],
      unsquared(Q.of(4 * s ** 3, 3)),
      [
        q.mul(Q.of(2)),
        `This counts the solid twice: the limits $-${s}$ to $${s}$ already cover the whole region.`,
        `这里把立体算了两次：积分限 $-${s}$ 到 $${s}$ 已经覆盖了整个区域。`,
      ],
    ],
    [
      [
        ["Find the limits and the radius", "求积分限和半径"],
        t(
          `The curves meet where $x^{2} = ${s * s}$, at $x = \\pm ${s}$. The axis $${line}$ is the top of the region, so the radius is the distance down to the parabola:`,
          `两曲线在 $x^{2} = ${s * s}$ 处相交，即 $x = \\pm ${s}$。旋转轴 $${line}$ 是区域的上边，所以半径是向下到抛物线的距离：`,
        ),
        [`r = ${s * s} - x^{2}`],
      ],
      [
        ["Integrate", "积分"],
        t("Square the radius and add the discs:", "把半径平方，再把圆盘累加："),
        [
          `V = \\pi${int(-s, s, `(${s * s} - x^{2})^{2}`)}`,
          `= \\pi${int(-s, s, `(${pLatex(p)})`)}`,
          `= \\pi${bracket(p, -s, s, "x")} = ${piL(q)}`,
        ],
      ],
    ],
    t(
      `The integrand is even, so the volume is twice the integral from $0$ to $${s}$:${shown(half)}`,
      `被积函数是偶函数，所以体积是从 $0$ 到 $${s}$ 的积分的两倍：${shown(half)}`,
    ),
  );
}

/** parabolaAboutAVerticalLine rotates the region between y = x², the x-axis and x = s about x = s. */
function parabolaAboutAVerticalLine(rng: Rng) {
  const s = rng.int(1, 4);
  const q = Q.of(s ** 4, 6);
  const line = `x = ${s}`;
  const sub = `V = \\pi${int(0, s, `(${s} - t)^{2} \\cdot 2t`, "t")} = 2\\pi\\left(${Q.of(s ** 4, 2).toLatex()} - ${Q.of(2 * s ** 4, 3).toLatex()} + ${Q.of(s ** 4, 4).toLatex()}\\right) = ${piL(q)}`;
  return piProblem(
    volumePrompt([m("y = x^{2}"), axisName("x"), lineName(line)], lineName(line)),
    q,
    [
      [
        Q.of(s ** 4, 2),
        `This uses $${s * s} - y$ as the radius squared, subtracting the squares instead of squaring the difference $${s} - \\sqrt{y}$.`,
        `这里把 $${s * s} - y$ 当作半径的平方，是把平方相减，而不是把差 $${s} - \\sqrt{y}$ 平方。`,
      ],
      [
        Q.of(s ** 5, 5),
        `This rotates the region about the $x$-axis instead of the line $${line}$.`,
        `这里绕 $x$ 轴旋转，而不是绕直线 $${line}$。`,
      ],
      shellFactor(q),
    ],
    [
      [
        ["Find the radius", "求半径"],
        t(
          `The discs are horizontal. At height $y$, for $0 \\le y \\le ${s * s}$, the region runs from $x = \\sqrt{y}$ to the axis $x = ${s}$, so the radius is`,
          `圆盘是水平的。在高度 $y$ 处（$0 \\le y \\le ${s * s}$），区域从 $x = \\sqrt{y}$ 延伸到旋转轴 $x = ${s}$，所以半径为`,
        ),
        [`r = ${s} - \\sqrt{y}`],
      ],
      [
        ["Expand and integrate", "展开并积分"],
        t("Square the radius and add the discs:", "把半径平方，再把圆盘累加："),
        [
          `V = \\pi${int(0, s * s, `(${s} - \\sqrt{y})^{2}`, "y")}`,
          `= \\pi${int(0, s * s, `\\left(${s * s} - ${2 * s}\\sqrt{y} + y\\right)`, "y")}`,
          `= \\pi\\Big[${k1(s * s)}y - ${coef(Q.of(4 * s, 3))}y^{3/2} + \\frac{y^{2}}{2}\\Big]_{0}^{${s * s}} = ${piL(q)}`,
        ],
      ],
    ],
    t(
      `Substitute $y = t^{2}$, so $dy = 2t \\, dt$ and the limits become $t = 0$ and $t = ${s}$; the root disappears:${shown(sub)}`,
      `代换 $y = t^{2}$，则 $dy = 2t \\, dt$，积分限变为 $t = 0$ 和 $t = ${s}$，根号消失了：${shown(sub)}`,
    ),
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
  intro: t(
    "Rotating the region under $y = x$, for $0 \\le x \\le 2$, about the $x$-axis gives discs of radius $x$:\n\n$$V = \\pi\\int_{0}^{2} x^{2} \\, dx = \\frac{8\\pi}{3}$$\n\nCheck: the solid is a cone of radius $2$ and height $2$, and one third of $\\pi \\cdot 2^{2} \\cdot 2 = 8\\pi$ is $\\frac{8\\pi}{3}$.\n\nIn this lesson we rotate regions about other horizontal and vertical lines, measuring each radius from that line.",
    "把 $y = x$ 下方 $0 \\le x \\le 2$ 的区域绕 $x$ 轴旋转，得到半径为 $x$ 的圆盘：\n\n$$V = \\pi\\int_{0}^{2} x^{2} \\, dx = \\frac{8\\pi}{3}$$\n\n检验：这个立体是半径为 $2$、高为 $2$ 的圆锥，$\\pi \\cdot 2^{2} \\cdot 2 = 8\\pi$ 的三分之一是 $\\frac{8\\pi}{3}$。\n\n这节课我们把区域绕其他水平或竖直直线旋转，每个半径都从这条直线量起。",
  ),
  prerequisites: ["volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes"],
  encompasses: [{ topic: "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "discs-about-a-horizontal-line",
      figure: calculusDrawings4["volumes-of-revolution-using-the-disc-method-rotation-about-other-axes#discs-about-a-horizontal-line"],
      title: t("Discs about a horizontal line", "绕水平直线旋转的圆盘"),
      explanation: t(
        "Rotating the region between $y = f(x)$ and the line $y = k$ about that line gives discs of radius $|f(x) - k|$:\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x) - k\\right)^{2} \\, dx$$\n\nFor the region between $y = x^{2} + 1$ and $y = 1$, $0 \\le x \\le 1$, rotated about $y = 1$, the radius is $x^{2}$, so $V = \\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$.\n\nCheck: the radius is at most $1$, so the solid fits in a cylinder of radius $1$ and length $1$, of volume $\\pi$, and $\\frac{\\pi}{5}$ is less than that.\n\n> **Watch out.** The radius is $f(x) - k$, not $f(x)$. Using $x^{2} + 1$ as the radius here would rotate the region about the $x$-axis instead.",
        "把 $y = f(x)$ 与直线 $y = k$ 之间的区域绕该直线旋转，得到半径为 $|f(x) - k|$ 的圆盘：\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x) - k\\right)^{2} \\, dx$$\n\n例如 $y = x^{2} + 1$ 与 $y = 1$ 之间 $0 \\le x \\le 1$ 的区域绕 $y = 1$ 旋转：半径为 $x^{2}$，所以 $V = \\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$。\n\n检验：半径最大为 $1$，所以这个立体放得进半径为 $1$、长为 $1$ 的圆柱，圆柱体积为 $\\pi$，而 $\\frac{\\pi}{5}$ 比它小。\n\n> **注意。** 半径是 $f(x) - k$，不是 $f(x)$。这里若把 $x^{2} + 1$ 当作半径，就变成绕 $x$ 轴旋转了。",
      ),
      generate: (rng) => (rng.int(0, 3) === 0 ? parabolaAboutItsChord(rng) : discAboutLine(rng, "x")),
    },
    {
      id: "discs-about-a-vertical-line",
      title: t("Discs about a vertical line", "绕竖直直线旋转的圆盘"),
      explanation: t(
        "For a vertical axis $x = h$ the discs are horizontal. Write the boundary as $x = g(y)$; the radius is $|g(y) - h|$, and\n\n$$V = \\pi\\int_{c}^{d} \\left(g(y) - h\\right)^{2} \\, dy$$\n\nFor example, the region between $x = y^{2} + 2$ and the line $x = 2$, for $0 \\le y \\le 1$, rotated about $x = 2$ has radius $y^{2}$, so $V = \\pi\\int_{0}^{1} y^{4} \\, dy = \\frac{\\pi}{5}$.\n\nCheck: turned on its side, this is the solid made by rotating the region under $y = x^{2}$, $0 \\le x \\le 1$, about the $x$-axis, whose volume is also $\\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$.\n\n> **Watch out.** If the boundary is given as $y = f(x)$, solve for $x$ first: for $y = x^{2}$ with $x \\ge 0$, $x = \\sqrt{y}$. The limits are then heights on the $y$-axis.",
        "旋转轴为竖直直线 $x = h$ 时圆盘是水平的。把边界写成 $x = g(y)$，半径为 $|g(y) - h|$，于是\n\n$$V = \\pi\\int_{c}^{d} \\left(g(y) - h\\right)^{2} \\, dy$$\n\n例如 $x = y^{2} + 2$ 与直线 $x = 2$ 之间 $0 \\le y \\le 1$ 的区域绕 $x = 2$ 旋转，半径为 $y^{2}$，所以 $V = \\pi\\int_{0}^{1} y^{4} \\, dy = \\frac{\\pi}{5}$。\n\n检验：把它横过来看，就是 $y = x^{2}$ 下方 $0 \\le x \\le 1$ 的区域绕 $x$ 轴旋转所得的立体，其体积也是 $\\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$。\n\n> **注意。** 若边界以 $y = f(x)$ 给出，先解出 $x$：对 $y = x^{2}$（$x \\ge 0$），$x = \\sqrt{y}$。积分限是 $y$ 轴上的高度。",
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

/** washerWork integrates π(R² - r²) from the squared outer and inner radii, as displayed lines. */
function washerWork(R2: Poly, r2: Poly, outer: string, inner: string, a: number, b: number, v: Variable) {
  const p = minus(R2, r2);
  const q = intQ(p, a, b);
  return {
    p,
    q,
    lines: [
      `V = \\pi${int(a, b, `\\left(${sqr(outer)} - ${sqr(inner)}\\right)`, v)}`,
      `= \\pi${int(a, b, wrap(pLatex(p, v)), v)}`,
      `= \\pi${bracket(p, a, b, v)} = ${piL(q)}`,
    ],
  };
}

/** washerProblem rotates the region between two curves about the v-axis. */
function washerProblem(rng: Rng, v: Variable) {
  const u = across(v);
  const { f, g, d, a, b } = randomWasher(rng);
  const [fl, gl] = [pLatex(f, v), pLatex(g, v)];
  const p = minus(sq(f), sq(g));
  const q = intQ(p, a, b);
  return piProblem(
    volumePrompt([m(`${u} = ${fl}`), m(`${u} = ${gl}`), m(`${v} = ${a}`), m(`${v} = ${b}`)], axisName(v)),
    q,
    [squaredDiff(intQ(sq(d), a, b)), noHole(intQ(sq(f), a, b)), shellFactor(q)],
    [
      [
        ["Find the radii", "求两个半径"],
        t(
          `On $[${a}, ${b}]$ both curves are on the same side of the $${v}$-axis and $${u} = ${fl}$ is the farther one. So the outer radius is $R = ${fl}$ and the inner radius is $r = ${gl}$.`,
          `在 $[${a}, ${b}]$ 上两条曲线在 $${v}$ 轴同侧，$${u} = ${fl}$ 离轴较远。所以外半径为 $R = ${fl}$，内半径为 $r = ${gl}$。`,
        ),
      ],
      [
        ["Subtract the squares", "求平方差"],
        t("A washer has area $\\pi(R^{2} - r^{2})$:", "垫圈的面积是 $\\pi(R^{2} - r^{2})$："),
        [`R^{2} - r^{2} = ${sqr(fl)} - ${sqr(gl)} = ${pLatex(p, v)}`],
      ],
      [
        ["Integrate", "积分"],
        t(`Add the washers from $${v} = ${a}$ to $${v} = ${b}$:`, `把 $${v} = ${a}$ 到 $${v} = ${b}$ 的垫圈累加：`),
        [`V = \\pi${int(a, b, wrap(pLatex(p, v)), v)}`, `= \\pi${bracket(p, a, b, v)} = ${piL(q)}`],
      ],
    ],
    bounds(p, a, b, 1, q, v),
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
  readonly slips: readonly Slip[];
  readonly check: Text;
}

/** apart checks a washer volume by working out the outer solid and the hole separately. */
const apart = (outer: [string, string], hole: [string, string], line: string) =>
  t(
    `Work out the solid swept by the outer curve and the hole separately. ${outer[0]} ${hole[0]} Their difference is${shown(line)}`,
    `分别算出外侧曲线扫出的立体和中间的孔。${outer[1]}${hole[1]}两者之差为${shown(line)}`,
  );

/** meetingCurves are regions between meeting curves whose squared radii are polynomials. */
const meetingCurves: readonly ((rng: Rng) => MeetingCurves)[] = [
  (rng) => {
    const k = rng.int(1, 5);
    const [cone, hole] = [Q.of(k ** 5, 3), Q.of(k ** 5, 5)];
    return {
      top: `${k1(k)}x`,
      bottom: "x^{2}",
      R2: [0, 0, k * k],
      r2: [0, 0, 0, 0, 1],
      a: 0,
      b: k,
      slips: [
        squaredDiff(Q.of(k ** 5, 30)),
        [cone, "This leaves out the hole: it is the cone swept out by the line alone.", "漏掉了中间的孔：这是直线单独扫出的圆锥。"],
      ],
      check: apart(
        [
          `The line sweeps out a cone of radius $${k * k}$ and height $${k}$, one third of $\\pi \\cdot ${k * k}^{2} \\cdot ${k}$, which is $${piL(cone)}$.`,
          `直线扫出半径为 $${k * k}$、高为 $${k}$ 的圆锥，体积是 $\\pi \\cdot ${k * k}^{2} \\cdot ${k}$ 的三分之一，即 $${piL(cone)}$。`,
        ],
        [
          `The parabola sweeps out the hole, $\\pi${int(0, k, "x^{4}")} = ${piL(hole)}$.`,
          `抛物线扫出中间的孔，$\\pi${int(0, k, "x^{4}")} = ${piL(hole)}$。`,
        ],
        `${piL(cone)} - ${piL(hole)} = ${piL(cone.sub(hole))}`,
      ),
    };
  },
  (rng) => {
    const k = rng.int(1, 6);
    const [outer, hole] = [Q.of(k ** 3, 2), Q.of(k ** 3, 3)];
    return {
      top: `\\sqrt{${k1(k)}x}`,
      bottom: "x",
      R2: [0, k],
      r2: [0, 0, 1],
      a: 0,
      b: k,
      slips: [
        noHole(outer),
        [hole, "This is only the hole, the cone swept out by the line $y = x$.", "这只是中间的孔，即直线 $y = x$ 扫出的圆锥。"],
      ],
      check: apart(
        [
          `The curve sweeps out a paraboloid of radius $${k}$ and height $${k}$, half of the cylinder $\\pi \\cdot ${k}^{2} \\cdot ${k}$, which is $${piL(outer)}$.`,
          `曲线扫出半径为 $${k}$、高为 $${k}$ 的旋转抛物体，是圆柱 $\\pi \\cdot ${k}^{2} \\cdot ${k}$ 的一半，即 $${piL(outer)}$。`,
        ],
        [
          `The line sweeps out a cone of the same radius and height, one third of that cylinder, which is $${piL(hole)}$.`,
          `直线扫出同样半径和高的圆锥，是这个圆柱的三分之一，即 $${piL(hole)}$。`,
        ],
        `${piL(outer)} - ${piL(hole)} = ${piL(outer.sub(hole))}`,
      ),
    };
  },
  (rng) => {
    const s = rng.int(1, 3);
    const [cylinder, hole] = [Q.of(2 * s ** 5), Q.of(2 * s ** 5, 5)];
    return {
      top: `${s * s}`,
      bottom: "x^{2}",
      R2: [s ** 4],
      r2: [0, 0, 0, 0, 1],
      a: -s,
      b: s,
      slips: [squaredDiff(Q.of(16 * s ** 5, 15)), noHole(cylinder)],
      check: apart(
        [
          `The line sweeps out a cylinder of radius $${s * s}$ and length $${2 * s}$, of volume $\\pi \\cdot ${s * s}^{2} \\cdot ${2 * s} = ${piL(cylinder)}$.`,
          `直线扫出半径为 $${s * s}$、长为 $${2 * s}$ 的圆柱，体积为 $\\pi \\cdot ${s * s}^{2} \\cdot ${2 * s} = ${piL(cylinder)}$。`,
        ],
        [
          `The parabola sweeps out the hole, $\\pi${int(-s, s, "x^{4}")} = ${piL(hole)}$.`,
          `抛物线扫出中间的孔，$\\pi${int(-s, s, "x^{4}")} = ${piL(hole)}$。`,
        ],
        `${piL(cylinder)} - ${piL(hole)} = ${piL(cylinder.sub(hole))}`,
      ),
    };
  },
];

/** meetingCurvesProblem rotates the region between two meeting curves about the x-axis. */
function meetingCurvesProblem(rng: Rng) {
  const c = rng.pick(meetingCurves)(rng);
  const { q, lines } = washerWork(c.R2, c.r2, c.top, c.bottom, c.a, c.b, "x");
  return piProblem(
    volumePrompt([m(`y = ${c.top}`), m(`y = ${c.bottom}`)], axisName("x")),
    q,
    [...c.slips, shellFactor(q)],
    [
      [
        ["Find the limits and the radii", "求积分限和半径"],
        t(
          `The curves meet where $${c.top} = ${c.bottom}$, at $x = ${c.a}$ and $x = ${c.b}$, and $${c.top} \\ge ${c.bottom}$ between them. So the outer radius is $R = ${c.top}$ and the inner radius is $r = ${c.bottom}$.`,
          `两曲线在 $${c.top} = ${c.bottom}$ 处相交，即 $x = ${c.a}$ 和 $x = ${c.b}$，且两者之间 $${c.top} \\ge ${c.bottom}$。所以外半径为 $R = ${c.top}$，内半径为 $r = ${c.bottom}$。`,
        ),
      ],
      [
        ["Integrate", "积分"],
        t("A washer has area $\\pi(R^{2} - r^{2})$. Add the washers:", "垫圈的面积是 $\\pi(R^{2} - r^{2})$。把垫圈累加："),
        lines,
      ],
    ],
    c.check,
  );
}

/** lineAndParabolaAboutYAxis rotates the region between y = kx and y = x² about the y-axis. */
function lineAndParabolaAboutYAxis(rng: Rng) {
  const k = rng.int(1, 5);
  const q = Q.of(k ** 4, 6);
  const inner = over("y", k);
  const inner2 = over("y^{2}", k * k);
  const [outer, hole] = [Q.of(k ** 4, 2), Q.of(k ** 4, 3)];
  return piProblem(
    volumePrompt([m(`y = ${k1(k)}x`), m("y = x^{2}")], axisName("y")),
    q,
    [
      otherAxis(Q.of(2 * k ** 5, 15), "x"),
      noHole(outer),
      [hole, "This is only the hole, the cone swept out by the line.", "这只是中间的孔，即直线扫出的圆锥。"],
    ],
    [
      [
        ["Write the radii in terms of y", "把半径写成 y 的函数"],
        t(
          `The curves meet at $(0, 0)$ and $(${k}, ${k * k})$. The washers are horizontal. At height $y$ the parabola is at $x = \\sqrt{y}$ and the line at $x = ${inner}$, and the parabola is farther from the $y$-axis:`,
          `两曲线交于 $(0, 0)$ 和 $(${k}, ${k * k})$。垫圈是水平的。在高度 $y$ 处，抛物线在 $x = \\sqrt{y}$，直线在 $x = ${inner}$，抛物线离 $y$ 轴较远：`,
        ),
        ["R = \\sqrt{y}", `r = ${inner}`],
      ],
      [
        ["Integrate", "积分"],
        t(`Add the washers from $y = 0$ to $y = ${k * k}$:`, `把 $y = 0$ 到 $y = ${k * k}$ 的垫圈累加：`),
        [
          `V = \\pi${int(0, k * k, `\\left(y - ${inner2}\\right)`, "y")}`,
          `= \\pi\\Big[\\frac{y^{2}}{2} - \\frac{y^{3}}{${3 * k * k}}\\Big]_{0}^{${k * k}} = ${piL(q)}`,
        ],
      ],
    ],
    apart(
      [
        `The parabola sweeps out a paraboloid of radius $${k}$ and height $${k * k}$, half of the cylinder $\\pi \\cdot ${k}^{2} \\cdot ${k * k}$, which is $${piL(outer)}$.`,
        `抛物线扫出半径为 $${k}$、高为 $${k * k}$ 的旋转抛物体，是圆柱 $\\pi \\cdot ${k}^{2} \\cdot ${k * k}$ 的一半，即 $${piL(outer)}$。`,
      ],
      [
        `The line sweeps out a cone of the same radius and height, one third of that cylinder, which is $${piL(hole)}$.`,
        `直线扫出同样半径和高的圆锥，是这个圆柱的三分之一，即 $${piL(hole)}$。`,
      ],
      `${piL(outer)} - ${piL(hole)} = ${piL(q)}`,
    ),
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
  intro: t(
    "Rotating the region under $y = 2$, for $0 \\le x \\le 3$, about the $x$-axis gives discs of radius $2$:\n\n$$V = \\pi\\int_{0}^{3} 2^{2} \\, dx = 12\\pi$$\n\nCheck: the solid is a cylinder of radius $2$ and length $3$, and $\\pi r^{2}h = \\pi \\cdot 4 \\cdot 3 = 12\\pi$.\n\nIn this lesson we rotate the region between two curves, so that each slice is a disc with a hole in it: a washer.",
    "把 $y = 2$ 下方 $0 \\le x \\le 3$ 的区域绕 $x$ 轴旋转，得到半径为 $2$ 的圆盘：\n\n$$V = \\pi\\int_{0}^{3} 2^{2} \\, dx = 12\\pi$$\n\n检验：这个立体是半径为 $2$、长为 $3$ 的圆柱，$\\pi r^{2}h = \\pi \\cdot 4 \\cdot 3 = 12\\pi$。\n\n这节课我们把两曲线之间的区域旋转，每个截面都是中间有孔的圆盘，即垫圈。",
  ),
  prerequisites: ["volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes"],
  encompasses: [{ topic: "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes", weight: 0.5 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "washers-about-the-x-axis",
      figure:
        calculusDrawings4["volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes#washers-about-the-x-axis"],
      title: t("Washers about the x-axis", "绕 x 轴旋转的垫圈"),
      explanation: t(
        "If $f(x) \\ge g(x) \\ge 0$ on $[a, b]$, rotating the region between them about the $x$-axis gives cross sections that are washers: a disc of outer radius $R = f(x)$ with a hole of inner radius $r = g(x)$. Its area is $\\pi(R^{2} - r^{2})$, so\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x)^{2} - g(x)^{2}\\right) dx$$\n\nFor $y = x$ and $y = x^{2}$, which meet at $x = 0$ and $x = 1$, $V = \\pi\\int_{0}^{1} (x^{2} - x^{4}) \\, dx = \\frac{2\\pi}{15}$.\n\nCheck: the line alone sweeps out a cone of radius $1$ and height $1$, of volume $\\frac{\\pi}{3}$, and the parabola sweeps out the hole, $\\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$. Their difference is\n\n$$\\frac{\\pi}{3} - \\frac{\\pi}{5} = \\frac{2\\pi}{15}$$\n\n> **Watch out.** $R^{2} - r^{2}$ is not $(R - r)^{2}$. Here $\\pi\\int_{0}^{1} (x - x^{2})^{2} \\, dx = \\frac{\\pi}{30}$, a different number.",
        "若在 $[a, b]$ 上 $f(x) \\ge g(x) \\ge 0$，把两者之间的区域绕 $x$ 轴旋转，截面是垫圈：外半径为 $R = f(x)$ 的圆盘中挖去内半径为 $r = g(x)$ 的孔。其面积为 $\\pi(R^{2} - r^{2})$，所以\n\n$$V = \\pi\\int_{a}^{b} \\left(f(x)^{2} - g(x)^{2}\\right) dx$$\n\n对交于 $x = 0$ 和 $x = 1$ 的 $y = x$ 与 $y = x^{2}$，$V = \\pi\\int_{0}^{1} (x^{2} - x^{4}) \\, dx = \\frac{2\\pi}{15}$。\n\n检验：直线单独扫出半径为 $1$、高为 $1$ 的圆锥，体积为 $\\frac{\\pi}{3}$；抛物线扫出中间的孔，$\\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$。两者之差为\n\n$$\\frac{\\pi}{3} - \\frac{\\pi}{5} = \\frac{2\\pi}{15}$$\n\n> **注意。** $R^{2} - r^{2}$ 不等于 $(R - r)^{2}$。这里 $\\pi\\int_{0}^{1} (x - x^{2})^{2} \\, dx = \\frac{\\pi}{30}$，是另一个数。",
      ),
      generate: (rng) => (rng.bool() ? meetingCurvesProblem(rng) : washerProblem(rng, "x")),
    },
    {
      id: "washers-about-the-y-axis",
      figure:
        calculusDrawings4["volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes#washers-about-the-y-axis"],
      title: t("Washers about the y-axis", "绕 y 轴旋转的垫圈"),
      explanation: t(
        "About the $y$-axis the washers are horizontal. Write both boundaries as functions of $y$; the outer radius $R(y)$ is the one farther from the axis:\n\n$$V = \\pi\\int_{c}^{d} \\left(R(y)^{2} - r(y)^{2}\\right) dy$$\n\nFor $y = x$ and $y = x^{2}$, at height $y$ the parabola gives $x = \\sqrt{y}$ and the line gives $x = y$, so $V = \\pi\\int_{0}^{1} (y - y^{2}) \\, dy = \\frac{\\pi}{6}$.\n\nCheck: the parabola sweeps out a paraboloid, half of the cylinder of radius $1$ and height $1$, so $\\frac{\\pi}{2}$. The line sweeps out a cone, one third of that cylinder, so $\\frac{\\pi}{3}$. Their difference is\n\n$$\\frac{\\pi}{2} - \\frac{\\pi}{3} = \\frac{\\pi}{6}$$\n\n> **Watch out.** The outer radius comes from the curve farther from the $y$-axis. For $0 < y < 1$, $\\sqrt{y} > y$, so the parabola gives $R$ even though it lies below the line.",
        "绕 $y$ 轴旋转时垫圈是水平的。把两条边界都写成 $y$ 的函数，离旋转轴较远的给出外半径 $R(y)$：\n\n$$V = \\pi\\int_{c}^{d} \\left(R(y)^{2} - r(y)^{2}\\right) dy$$\n\n对 $y = x$ 与 $y = x^{2}$，在高度 $y$ 处抛物线给出 $x = \\sqrt{y}$，直线给出 $x = y$，所以 $V = \\pi\\int_{0}^{1} (y - y^{2}) \\, dy = \\frac{\\pi}{6}$。\n\n检验：抛物线扫出旋转抛物体，是半径为 $1$、高为 $1$ 的圆柱的一半，即 $\\frac{\\pi}{2}$；直线扫出圆锥，是这个圆柱的三分之一，即 $\\frac{\\pi}{3}$。两者之差为\n\n$$\\frac{\\pi}{2} - \\frac{\\pi}{3} = \\frac{\\pi}{6}$$\n\n> **注意。** 外半径来自离 $y$ 轴较远的曲线。当 $0 < y < 1$ 时 $\\sqrt{y} > y$，所以虽然抛物线在直线下方，它给出的却是 $R$。",
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
  const p = minus(sq(R), sq(r));
  const q = intQ(p, a, b);
  const [fl, gl, dl, Rl, rl, pl] = [f, g, d, R, r, p].map((x) => pLatex(x, v)) as [string, string, string, string, string, string];
  const radii = below
    ? [`R = ${wrap(fl)} - (${k}) = ${Rl}`, `r = ${wrap(gl)} - (${k}) = ${rl}`]
    : [`R = ${k} - ${wrap(gl)} = ${Rl}`, `r = ${k} - ${wrap(fl)} = ${rl}`];
  const line = `${u} = ${k}`;
  const side =
    v === "x" ? (below ? t("below", "下方") : t("above", "上方")) : below ? t("to the left of", "左侧") : t("to the right of", "右侧");
  const A = intQ(minus(sq(f), sq(g)), a, b);
  const D = intQ(d, a, b);
  const twice = 2 * Math.abs(k);
  const tdl = /^\d+$/.test(dl) ? `${twice} \\cdot ${dl}` : `${twice}${wrap(dl)}`;
  const split = below
    ? t(
        `Split the integrand into the part for rotation about the $${v}$-axis and the part from the shift:${shown(`R^{2} - r^{2} = \\left(${sqr(fl)} - ${sqr(gl)}\\right) + ${tdl}`)}\n\nSo the volume is the volume about the $${v}$-axis, $${piL(A)}$, plus $${twice}\\pi$ times the area of the region, $${D.toLatex()}$:${shown(`V = ${piL(A)} + ${piL(D.mul(Q.of(twice)))} = ${piL(q)}`)}`,
        `把被积函数拆成绕 $${v}$ 轴旋转的部分和平移带来的部分：${shown(`R^{2} - r^{2} = \\left(${sqr(fl)} - ${sqr(gl)}\\right) + ${tdl}`)}\n\n所以体积等于绕 $${v}$ 轴旋转的体积 $${piL(A)}$，加上 $${twice}\\pi$ 乘以区域面积 $${D.toLatex()}$：${shown(`V = ${piL(A)} + ${piL(D.mul(Q.of(twice)))} = ${piL(q)}`)}`,
      )
    : t(
        `Split the integrand into the part from the shift and the part for rotation about the $${v}$-axis:${shown(`R^{2} - r^{2} = ${tdl} - \\left(${sqr(fl)} - ${sqr(gl)}\\right)`)}\n\nSo the volume is $${twice}\\pi$ times the area of the region, $${D.toLatex()}$, minus the volume about the $${v}$-axis, $${piL(A)}$:${shown(`V = ${piL(D.mul(Q.of(twice)))} - ${piL(A)} = ${piL(q)}`)}`,
        `把被积函数拆成平移带来的部分和绕 $${v}$ 轴旋转的部分：${shown(`R^{2} - r^{2} = ${tdl} - \\left(${sqr(fl)} - ${sqr(gl)}\\right)`)}\n\n所以体积等于 $${twice}\\pi$ 乘以区域面积 $${D.toLatex()}$，减去绕 $${v}$ 轴旋转的体积 $${piL(A)}$：${shown(`V = ${piL(D.mul(Q.of(twice)))} - ${piL(A)} = ${piL(q)}`)}`,
      );
  return piProblem(
    volumePrompt([m(`${u} = ${fl}`), m(`${u} = ${gl}`), m(`${v} = ${a}`), m(`${v} = ${b}`)], lineName(line)),
    q,
    [
      [
        A,
        `This measures the radii from the $${v}$-axis instead of from the line $${line}$.`,
        `这里从 $${v}$ 轴量半径，而不是从直线 $${line}$ 量起。`,
      ],
      squaredDiff(intQ(sq(d), a, b)),
      ...(below
        ? []
        : [
            [
              q.neg(),
              "This swaps the radii. With the axis on the other side, the curve nearer the axis of the coordinate system is the farther one from this line; a volume cannot be negative.",
              "这里把两个半径弄反了。旋转轴在另一侧时，离坐标轴较近的曲线反而离这条直线较远；体积不可能是负的。",
            ] as const,
          ]),
      shellFactor(q),
    ],
    [
      [
        ["Find the radii", "求两个半径"],
        t(
          `The axis $${line}$ lies ${side.en} the region, so measure both radii from it. The outer radius reaches the curve farther from the line:`,
          `旋转轴 $${line}$ 在区域${side["zh-CN"]}，所以两个半径都从它量起。外半径到达离这条直线较远的曲线：`,
        ),
        radii,
      ],
      [
        ["Subtract the squares", "求平方差"],
        t("A washer has area $\\pi(R^{2} - r^{2})$:", "垫圈的面积是 $\\pi(R^{2} - r^{2})$："),
        [`R^{2} - r^{2} = ${sqr(Rl)} - ${sqr(rl)} = ${pl}`],
      ],
      [
        ["Integrate", "积分"],
        t(`Add the washers from $${v} = ${a}$ to $${v} = ${b}$:`, `把 $${v} = ${a}$ 到 $${v} = ${b}$ 的垫圈累加：`),
        [`V = \\pi${int(a, b, wrap(pl), v)}`, `= \\pi${bracket(p, a, b, v)} = ${piL(q)}`],
      ],
    ],
    split,
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
  intro: t(
    "Rotating the region between $y = x^{2} + 1$ and $y = 1$, for $0 \\le x \\le 1$, about the line $y = 1$ gives discs of radius $x^{2}$:\n\n$$V = \\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$$\n\nCheck: this is the solid made by rotating the region under $y = x^{2}$ about the $x$-axis, moved up by $1$, and moving a solid does not change its volume: $\\pi\\int_{0}^{1} (x^{2})^{2} \\, dx$ is the same integral.\n\nIn this lesson we rotate regions between two curves about such lines, so the slices are washers with both radii measured from the line.",
    "把 $y = x^{2} + 1$ 与 $y = 1$ 之间 $0 \\le x \\le 1$ 的区域绕直线 $y = 1$ 旋转，得到半径为 $x^{2}$ 的圆盘：\n\n$$V = \\pi\\int_{0}^{1} x^{4} \\, dx = \\frac{\\pi}{5}$$\n\n检验：这就是 $y = x^{2}$ 下方的区域绕 $x$ 轴旋转所得的立体向上平移 $1$，平移不改变体积：$\\pi\\int_{0}^{1} (x^{2})^{2} \\, dx$ 是同一个积分。\n\n这节课我们把两曲线之间的区域绕这样的直线旋转，截面是垫圈，两个半径都从这条直线量起。",
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
      figure: calculusDrawings4["volumes-of-revolution-using-the-washer-method-rotation-about-other-axes#washers-about-a-horizontal-line"],
      title: t("Washers about a horizontal line", "绕水平直线旋转的垫圈"),
      explanation: t(
        "To rotate the region between $y = f(x)$ and $y = g(x)$, with $f \\ge g$, about a horizontal line $y = k$, measure both radii from the line.\n\n- If the line is below the region, $R = f(x) - k$ and $r = g(x) - k$.\n- If the line is above the region, $R = k - g(x)$ and $r = k - f(x)$: the lower curve is now the farther one.\n\nThen\n\n$$V = \\pi\\int_{a}^{b} (R^{2} - r^{2}) \\, dx$$\n\nFor example, rotating the region between $y = 2$ and $y = 1$, for $0 \\le x \\le 3$, about $y = -1$ gives $R = 3$ and $r = 2$, so $V = \\pi\\int_{0}^{3} (9 - 4) \\, dx = 15\\pi$.\n\nCheck: the solid is a cylinder of radius $3$ with a cylinder of radius $2$ removed, both of length $3$, and $27\\pi - 12\\pi = 15\\pi$.\n\n> **Watch out.** Measure from the line, not from the $x$-axis. Radii $2$ and $1$ would give $9\\pi$, the volume about the $x$-axis.",
        "把 $y = f(x)$ 与 $y = g(x)$（$f \\ge g$）之间的区域绕水平直线 $y = k$ 旋转时，两个半径都从该直线量起。\n\n- 若直线在区域下方，$R = f(x) - k$，$r = g(x) - k$。\n- 若直线在区域上方，$R = k - g(x)$，$r = k - f(x)$：此时下方的曲线离旋转轴更远。\n\n然后\n\n$$V = \\pi\\int_{a}^{b} (R^{2} - r^{2}) \\, dx$$\n\n例如把 $y = 2$ 与 $y = 1$ 之间 $0 \\le x \\le 3$ 的区域绕 $y = -1$ 旋转，$R = 3$，$r = 2$，所以 $V = \\pi\\int_{0}^{3} (9 - 4) \\, dx = 15\\pi$。\n\n检验：这个立体是半径为 $3$ 的圆柱挖去半径为 $2$ 的圆柱，长都是 $3$，$27\\pi - 12\\pi = 15\\pi$。\n\n> **注意。** 要从这条直线量起，而不是从 $x$ 轴量起。若用半径 $2$ 和 $1$，得到的 $9\\pi$ 是绕 $x$ 轴旋转的体积。",
      ),
      generate: (rng) => washerAboutLine(rng, "x"),
    },
    {
      id: "washers-about-a-vertical-line",
      title: t("Washers about a vertical line", "绕竖直直线旋转的垫圈"),
      explanation: t(
        "For a vertical line $x = h$, write the boundaries as $x = f(y)$ and $x = g(y)$ with $f \\ge g$. If the line is to the left of the region, $R = f(y) - h$ and $r = g(y) - h$; if it is to the right, $R = h - g(y)$ and $r = h - f(y)$. Then\n\n$$V = \\pi\\int_{c}^{d} (R^{2} - r^{2}) \\, dy$$\n\nFor example, rotating the region between $x = 1$ and $x = 3$, for $0 \\le y \\le 2$, about the line $x = 4$ gives $R = 4 - 1 = 3$ and $r = 4 - 3 = 1$, so $V = \\pi\\int_{0}^{2} (9 - 1) \\, dy = 16\\pi$.\n\nCheck: the solid is a cylinder of radius $3$ with a cylinder of radius $1$ removed, both of height $2$, and $18\\pi - 2\\pi = 16\\pi$.\n\n> **Watch out.** When the line is to the right of the region, the left curve is the farther one, so $R = h - g(y)$ comes from the smaller $x$.",
        "对竖直直线 $x = h$，把边界写成 $x = f(y)$ 和 $x = g(y)$，$f \\ge g$。若直线在区域左侧，$R = f(y) - h$，$r = g(y) - h$；若在右侧，$R = h - g(y)$，$r = h - f(y)$。然后\n\n$$V = \\pi\\int_{c}^{d} (R^{2} - r^{2}) \\, dy$$\n\n例如把 $x = 1$ 与 $x = 3$ 之间 $0 \\le y \\le 2$ 的区域绕直线 $x = 4$ 旋转，$R = 4 - 1 = 3$，$r = 4 - 3 = 1$，所以 $V = \\pi\\int_{0}^{2} (9 - 1) \\, dy = 16\\pi$。\n\n检验：这个立体是半径为 $3$ 的圆柱挖去半径为 $1$ 的圆柱，高都是 $2$，$18\\pi - 2\\pi = 16\\pi$。\n\n> **注意。** 直线在区域右侧时，左边的曲线离它较远，所以 $R = h - g(y)$ 来自较小的 $x$。",
      ),
      generate: (rng) => washerAboutLine(rng, "y"),
    },
  ],
};

/** vTimes multiplies a polynomial by its variable. */
const vTimes = (p: Poly) => pMul([0, 1], p);

/** shellWork integrates 2π v·h(v) for shells of radius v and height h, as displayed lines. */
function shellWork(h: Poly, hl: string, a: number, b: number, v: Variable) {
  const p = vTimes(h);
  const q = intQ(p, a, b).mul(Q.of(2));
  return {
    p,
    q,
    lines: [
      `V = 2\\pi${int(a, b, product(v, hl), v)}`,
      `= 2\\pi${int(a, b, wrap(pLatex(p, v)), v)}`,
      `= 2\\pi${bracket(p, a, b, v)} = ${piL(q)}`,
    ],
  };
}

/** shellsAboutXAxis rotates the region between x = g(y), the y-axis, y = a and y = b about the x-axis. */
function shellsAboutXAxis(rng: Rng) {
  const g: Poly = [rng.int(1, 5), rng.int(0, 3), rng.int(0, 1)];
  const a = rng.int(0, 2);
  const b = a + rng.int(1, 3);
  const gl = pLatex(g, "y");
  const { p, q, lines } = shellWork(g, gl, a, b, "y");
  return piProblem(
    volumePrompt([m(`x = ${gl}`), axisName("y"), m(`y = ${a}`), m(`y = ${b}`)], axisName("x")),
    q,
    [
      noRadius(intQ(g, a, b).mul(Q.of(2))),
      halfShell(q),
      [
        intQ(sq(g), a, b),
        "This uses discs of radius $x$, which rotate the region about the $y$-axis instead.",
        "这里用了半径为 $x$ 的圆盘，那是绕 $y$ 轴旋转。",
      ],
    ],
    [
      [
        ["Describe a shell", "描述柱壳"],
        t(
          `A horizontal strip at height $y$ runs from the $y$-axis to $x = ${gl}$, so its length is $${gl}$. Rotating it about the $x$-axis sweeps out a cylindrical shell of radius $y$ and height $${gl}$.`,
          `高度 $y$ 处的水平窄条从 $y$ 轴延伸到 $x = ${gl}$，长为 $${gl}$。它绕 $x$ 轴旋转形成半径为 $y$、高为 $${gl}$ 的圆柱壳。`,
        ),
      ],
      [
        ["Integrate", "积分"],
        t(
          `Each shell contributes $2\\pi$ times radius times height. Add the shells from $y = ${a}$ to $y = ${b}$:`,
          `每个柱壳贡献 $2\\pi$ 乘以半径再乘以高。把 $y = ${a}$ 到 $y = ${b}$ 的柱壳累加：`,
        ),
        lines,
      ],
    ],
    bounds(p, a, b, 2, q, "y"),
  );
}

/** rootCurveShells rotates the region under y = √(x/c) up to x = cs² about the x-axis. */
function rootCurveShells(rng: Rng) {
  const c = rng.int(1, 4);
  const s = rng.int(1, 4);
  const curve = c === 1 ? "y = \\sqrt{x}" : `y = \\sqrt{\\frac{x}{${c}}}`;
  const h: Poly = [c * s * s, 0, -c];
  const { q, lines } = shellWork(h, `${c * s * s} - ${k1(c)}y^{2}`, 0, s, "y");
  const discs = `V = \\pi${int(0, c * s * s, over("x", c))} = \\pi\\Big[\\frac{x^{2}}{${2 * c}}\\Big]_{0}^{${c * s * s}} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m(curve), axisName("x"), m(`x = ${c * s * s}`)], axisName("x")),
    q,
    [
      halfShell(q),
      noRadius(intQ(h, 0, s).mul(Q.of(2))),
      [
        Q.of(c * c * s ** 4, 2),
        `This drops the factor $\\frac{1}{${c}}$: the curve gives $y^{2} = \\frac{x}{${c}}$, not $y^{2} = x$.`,
        `漏掉了因子 $\\frac{1}{${c}}$：由曲线得 $y^{2} = \\frac{x}{${c}}$，不是 $y^{2} = x$。`,
      ],
    ],
    [
      [
        ["Solve for x", "解出 x"],
        t(
          `Solving $${curve}$ for $x$ gives $x = ${k1(c)}y^{2}$. For $0 \\le y \\le ${s}$ the horizontal strip runs from the curve to the line $x = ${c * s * s}$, so its length is`,
          `从 $${curve}$ 解出 $x$ 得 $x = ${k1(c)}y^{2}$。对 $0 \\le y \\le ${s}$，水平窄条从曲线延伸到直线 $x = ${c * s * s}$，所以长为`,
        ),
        [`h(y) = ${c * s * s} - ${k1(c)}y^{2}`],
      ],
      [
        ["Integrate", "积分"],
        t(
          "The shell radius is $y$. Each shell contributes $2\\pi$ times radius times height:",
          "柱壳半径为 $y$。每个柱壳贡献 $2\\pi$ 乘以半径再乘以高：",
        ),
        lines,
      ],
    ],
    t(
      `Discs about the $x$-axis give the same volume. The radius at $x$ is $y$, and $y^{2} = ${over("x", c)}$:${shown(discs)}`,
      `绕 $x$ 轴用圆盘法也得到同样的体积。$x$ 处的半径是 $y$，而 $y^{2} = ${over("x", c)}$：${shown(discs)}`,
    ),
  );
}

/** parabolaShells rotates the region under y = r²x² for 0 ≤ x ≤ s about the x-axis. */
function parabolaShells(rng: Rng) {
  const r = rng.int(1, 2);
  const s = rng.int(1, 6);
  const top = r * r * s * s;
  const q = Q.of(r ** 4 * s ** 5, 5);
  const x = over("\\sqrt{y}", r);
  const discs = `V = \\pi${int(0, s, `\\left(${k1(r * r)}x^{2}\\right)^{2}`)} = \\pi${int(0, s, `${k1(r ** 4)}x^{4}`)} = ${piL(q)}`;
  return piProblem(
    volumePrompt([m(`y = ${k1(r * r)}x^{2}`), axisName("x"), m(`x = ${s}`)], axisName("x")),
    q,
    [halfShell(q), noRadius(Q.of(2 * r * r * s ** 3, 3))],
    [
      [
        ["Solve for x", "解出 x"],
        t(
          `Solving for $x$ gives $x = ${x}$. For $0 \\le y \\le ${top}$ the horizontal strip runs from the curve to the line $x = ${s}$, so its length is`,
          `解出 $x$ 得 $x = ${x}$。对 $0 \\le y \\le ${top}$，水平窄条从曲线延伸到直线 $x = ${s}$，所以长为`,
        ),
        [`h(y) = ${s} - ${x}`],
      ],
      [
        ["Integrate", "积分"],
        t(
          "The shell radius is $y$. Each shell contributes $2\\pi$ times radius times height:",
          "柱壳半径为 $y$。每个柱壳贡献 $2\\pi$ 乘以半径再乘以高：",
        ),
        [
          `V = 2\\pi${int(0, top, `y\\left(${s} - ${x}\\right)`, "y")}`,
          `= 2\\pi\\Big[${coef(Q.of(s, 2))}y^{2} - ${coef(Q.of(2, 5 * r))}y^{5/2}\\Big]_{0}^{${top}} = ${piL(q)}`,
        ],
      ],
    ],
    t(
      `Discs about the $x$-axis give the same volume, with radius $${k1(r * r)}x^{2}$ at $x$:${shown(discs)}`,
      `绕 $x$ 轴用圆盘法也得到同样的体积，$x$ 处的半径为 $${k1(r * r)}x^{2}$：${shown(discs)}`,
    ),
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
  intro: t(
    "Rotating the region between $y = 1$ and $y = 2$, for $0 \\le x \\le 3$, about the $x$-axis gives washers of radii $2$ and $1$:\n\n$$V = \\pi\\int_{0}^{3} (2^{2} - 1^{2}) \\, dx = 9\\pi$$\n\nCheck: the solid is a cylinder of radius $2$ with a cylinder of radius $1$ removed, both of length $3$, and $12\\pi - 3\\pi = 9\\pi$.\n\nIn this lesson we cut regions into horizontal strips instead, which sweep out cylindrical shells about the $x$-axis, so we never need to solve for $y$ in terms of $x$.",
    "把 $y = 1$ 与 $y = 2$ 之间 $0 \\le x \\le 3$ 的区域绕 $x$ 轴旋转，得到半径为 $2$ 和 $1$ 的垫圈：\n\n$$V = \\pi\\int_{0}^{3} (2^{2} - 1^{2}) \\, dx = 9\\pi$$\n\n检验：这个立体是半径为 $2$ 的圆柱挖去半径为 $1$ 的圆柱，长都是 $3$，$12\\pi - 3\\pi = 9\\pi$。\n\n这节课我们改为把区域切成水平窄条，它们绕 $x$ 轴扫出圆柱壳，这样就不必把 $y$ 解成 $x$ 的函数。",
  ),
  prerequisites: ["volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes"],
  encompasses: [],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "shells-for-a-curve-given-as-x-in-terms-of-y",
      title: t("Shells for a curve given as x in terms of y", "曲线以 x 关于 y 的形式给出时的柱壳"),
      explanation: t(
        "Cut the region into thin horizontal strips. The strip at height $y$, of length $L(y)$ and thickness $dy$, sweeps out a cylindrical shell about the $x$-axis. Unrolled, the shell is a thin slab of size $2\\pi y \\times L(y) \\times dy$, so\n\n$$V = 2\\pi\\int_{c}^{d} y\\,L(y) \\, dy$$\n\nFor the region between $x = y^{2}$, the $y$-axis and $y = 2$, $V = 2\\pi\\int_{0}^{2} y \\cdot y^{2} \\, dy = 8\\pi$.\n\nCheck: washers give the same volume. For $0 \\le x \\le 4$ the region runs from $y = \\sqrt{x}$ up to $y = 2$, so $V = \\pi\\int_{0}^{4} (4 - x) \\, dx = 8\\pi$.\n\n> **Watch out.** The radius of a shell about the $x$-axis is $y$, and the factor is $2\\pi$. $\\pi\\int_{0}^{2} y^{3} \\, dy$ is only half the volume.",
        "把区域切成水平窄条。高度 $y$ 处长为 $L(y)$、厚为 $dy$ 的窄条绕 $x$ 轴旋转形成圆柱壳。把柱壳展开，近似是一块 $2\\pi y \\times L(y) \\times dy$ 的薄板，所以\n\n$$V = 2\\pi\\int_{c}^{d} y\\,L(y) \\, dy$$\n\n对 $x = y^{2}$、$y$ 轴与 $y = 2$ 围成的区域，$V = 2\\pi\\int_{0}^{2} y \\cdot y^{2} \\, dy = 8\\pi$。\n\n检验：用垫圈法也得到同样的体积。对 $0 \\le x \\le 4$，区域从 $y = \\sqrt{x}$ 向上延伸到 $y = 2$，所以 $V = \\pi\\int_{0}^{4} (4 - x) \\, dx = 8\\pi$。\n\n> **注意。** 绕 $x$ 轴的柱壳半径是 $y$，因子是 $2\\pi$。$\\pi\\int_{0}^{2} y^{3} \\, dy$ 只是体积的一半。",
      ),
      generate: (rng) => shellsAboutXAxis(rng),
    },
    {
      id: "shells-for-a-curve-given-as-y-in-terms-of-x",
      title: t("Shells for a curve given as y in terms of x", "曲线以 y 关于 x 的形式给出时的柱壳"),
      explanation: t(
        "If the curve is given as $y = f(x)$, solve for $x$ to find where each horizontal strip starts and ends. For the region under $y = \\sqrt{x}$ from $x = 0$ to $x = 4$, $x = y^{2}$, and for $0 \\le y \\le 2$ the strip runs from $x = y^{2}$ to $x = 4$, so\n\n$$V = 2\\pi\\int_{0}^{2} y(4 - y^{2}) \\, dy = 8\\pi$$\n\nCheck: discs give the same volume, $\\pi\\int_{0}^{4} (\\sqrt{x})^{2} \\, dx = \\pi\\int_{0}^{4} x \\, dx = 8\\pi$.\n\n> **Watch out.** The strip runs from the curve to the line $x = 4$, so its length is $4 - y^{2}$, not $y^{2}$.",
        "若曲线以 $y = f(x)$ 给出，先解出 $x$，确定每个水平窄条的起点和终点。对 $y = \\sqrt{x}$ 下方从 $x = 0$ 到 $x = 4$ 的区域，$x = y^{2}$，当 $0 \\le y \\le 2$ 时窄条从 $x = y^{2}$ 延伸到 $x = 4$，所以\n\n$$V = 2\\pi\\int_{0}^{2} y(4 - y^{2}) \\, dy = 8\\pi$$\n\n检验：用圆盘法也得到同样的体积，$\\pi\\int_{0}^{4} (\\sqrt{x})^{2} \\, dx = \\pi\\int_{0}^{4} x \\, dx = 8\\pi$。\n\n> **注意。** 窄条从曲线延伸到直线 $x = 4$，所以长是 $4 - y^{2}$，不是 $y^{2}$。",
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
  const { p, q, lines } = shellWork(d, dl, a, b, v);
  const strip =
    v === "y" ? t("A horizontal strip at height $y$", "高度 $y$ 处的水平窄条") : t("A vertical strip at $x$", "$x$ 处的竖直窄条");
  return piProblem(
    volumePrompt([m(`${u} = ${fl}`), m(`${u} = ${gl}`), m(`${v} = ${a}`), m(`${v} = ${b}`)], axisName(u)),
    q,
    [
      [
        intQ(vTimes(f), a, b).mul(Q.of(2)),
        `This uses $${fl}$ alone as the height, which measures from the $${v}$-axis and includes the part below $${u} = ${gl}$.`,
        `这里只用 $${fl}$ 作为高，那是从 $${v}$ 轴量起，把 $${u} = ${gl}$ 另一侧的部分也算进去了。`,
      ],
      [
        intQ(minus(sq(f), sq(g)), a, b),
        `This uses washers, which rotate the region about the $${v}$-axis instead.`,
        `这里用了垫圈法，那是绕 $${v}$ 轴旋转。`,
      ],
      halfShell(q),
    ],
    [
      [
        ["Find the height of a shell", "求柱壳的高"],
        t(
          `${strip.en} runs from $${u} = ${gl}$ to $${u} = ${fl}$, so its length is`,
          `${strip["zh-CN"]}从 $${u} = ${gl}$ 延伸到 $${u} = ${fl}$，所以长为`,
        ),
        [`h(${v}) = ${wrap(fl)} - ${wrap(gl)} = ${dl}`],
      ],
      [
        ["Integrate", "积分"],
        t(
          `The shell radius is $${v}$. Each shell contributes $2\\pi$ times radius times height:`,
          `柱壳半径为 $${v}$。每个柱壳贡献 $2\\pi$ 乘以半径再乘以高：`,
        ),
        lines,
      ],
    ],
    bounds(p, a, b, 2, q, v),
  );
}

/** MeetingShells is a region between two meeting curves for 0 ≤ v ≤ b, where the strip runs from inner to outer. */
interface MeetingShells {
  readonly curves: readonly [string, string];
  readonly firstQuadrant: boolean;
  readonly outer: string;
  readonly inner: string;
  readonly h: Poly;
  readonly b: number;
  readonly wrong: Slip;
  readonly check: (q: Q) => Text;
}

/** washerCheck checks a shell volume with washers or discs, introduced in both languages. */
const washerCheck = (en: string, zh: string, line: string) => t(`${en}${shown(line)}`, `${zh}${shown(line)}`);

/** meetingShellsAboutXAxis are regions between meeting curves of the form x = g(y). */
const meetingShellsAboutXAxis: readonly ((rng: Rng) => MeetingShells)[] = [
  (rng) => {
    const k = rng.int(1, 4);
    const j = rng.int(1, 5);
    const root = k === 1 ? "\\sqrt{x}" : `\\sqrt{\\frac{x}{${k}}}`;
    return {
      curves: [`x = ${k1(k)}y^{2}`, `x = ${k1(k * j)}y`],
      firstQuadrant: false,
      outer: `${k1(k * j)}y`,
      inner: `${k1(k)}y^{2}`,
      h: [0, k * j, -k],
      b: j,
      wrong: otherAxis(Q.of(2 * k * k * j ** 5, 15), "y"),
      check: (q) =>
        washerCheck(
          `Washers about the $x$-axis give the same volume. Solved for $y$, the curves are $y = ${root}$ and $y = ${over("x", k * j)}$, and for $0 \\le x \\le ${k * j * j}$ the first is the higher:`,
          `绕 $x$ 轴用垫圈法也得到同样的体积。解出 $y$，两曲线为 $y = ${root}$ 和 $y = ${over("x", k * j)}$，当 $0 \\le x \\le ${k * j * j}$ 时前者较高：`,
          `V = \\pi${int(0, k * j * j, `\\left(${over("x", k)} - ${over("x^{2}", (k * j) ** 2)}\\right)`)} = \\pi\\left(${Q.of(k * j ** 4, 2).toLatex()} - ${Q.of(k * j ** 4, 3).toLatex()}\\right) = ${piL(q)}`,
        ),
    };
  },
  (rng) => {
    const k = rng.int(1, 4);
    return {
      curves: ["x = y^{3}", `x = ${k1(k * k)}y`],
      firstQuadrant: true,
      outer: `${k1(k * k)}y`,
      inner: "y^{3}",
      h: [0, k * k, 0, -1],
      b: k,
      wrong: otherAxis(Q.of(4 * k ** 7, 21), "y"),
      check: (q) =>
        washerCheck(
          `Washers about the $x$-axis give the same volume. Solved for $y$, the curves are $y = \\sqrt[3]{x}$ and $y = ${over("x", k * k)}$, and for $0 \\le x \\le ${k ** 3}$ the first is the higher:`,
          `绕 $x$ 轴用垫圈法也得到同样的体积。解出 $y$，两曲线为 $y = \\sqrt[3]{x}$ 和 $y = ${over("x", k * k)}$，当 $0 \\le x \\le ${k ** 3}$ 时前者较高：`,
          `V = \\pi${int(0, k ** 3, `\\left(x^{2/3} - ${over("x^{2}", k ** 4)}\\right)`)} = \\pi\\left(${Q.of(3 * k ** 5, 5).toLatex()} - ${Q.of(k ** 5, 3).toLatex()}\\right) = ${piL(q)}`,
        ),
    };
  },
  (rng) => {
    const c = rng.int(1, 5);
    return {
      curves: ["x = y^{2}", `x = ${c * c}`],
      firstQuadrant: true,
      outer: `${c * c}`,
      inner: "y^{2}",
      h: [c * c, 0, -1],
      b: c,
      wrong: otherAxis(Q.of(4 * c ** 5, 5), "y"),
      check: (q) =>
        washerCheck(
          `Discs about the $x$-axis give the same volume: for $0 \\le x \\le ${c * c}$ the region runs from the $x$-axis up to $y = \\sqrt{x}$:`,
          `绕 $x$ 轴用圆盘法也得到同样的体积：当 $0 \\le x \\le ${c * c}$ 时，区域从 $x$ 轴向上延伸到 $y = \\sqrt{x}$：`,
          `V = \\pi${int(0, c * c, "x")} = \\pi\\Big[\\frac{x^{2}}{2}\\Big]_{0}^{${c * c}} = ${piL(q)}`,
        ),
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
      outer: `${k1(k)}x`,
      inner: "x^{2}",
      h: [0, k, -1],
      b: k,
      wrong: otherAxis(Q.of(2 * k ** 5, 15), "x"),
      check: (q) =>
        washerCheck(
          `Washers about the $y$-axis give the same volume. At height $y$, for $0 \\le y \\le ${k * k}$, the parabola gives the outer radius $\\sqrt{y}$ and the line the inner radius $${over("y", k)}$:`,
          `绕 $y$ 轴用垫圈法也得到同样的体积。在高度 $y$ 处（$0 \\le y \\le ${k * k}$），抛物线给出外半径 $\\sqrt{y}$，直线给出内半径 $${over("y", k)}$：`,
          `V = \\pi${int(0, k * k, `\\left(y - ${over("y^{2}", k * k)}\\right)`, "y")} = \\pi\\left(${Q.of(k ** 4, 2).toLatex()} - ${Q.of(k ** 4, 3).toLatex()}\\right) = ${piL(q)}`,
        ),
    };
  },
  (rng) => {
    const k = rng.int(1, 4);
    return {
      curves: [`y = ${k1(k * k)}x`, "y = x^{3}"],
      firstQuadrant: true,
      outer: `${k1(k * k)}x`,
      inner: "x^{3}",
      h: [0, k * k, 0, -1],
      b: k,
      wrong: otherAxis(Q.of(4 * k ** 7, 21), "x"),
      check: (q) =>
        washerCheck(
          `Washers about the $y$-axis give the same volume. At height $y$, for $0 \\le y \\le ${k ** 3}$, the cubic gives the outer radius $\\sqrt[3]{y}$ and the line the inner radius $${over("y", k * k)}$:`,
          `绕 $y$ 轴用垫圈法也得到同样的体积。在高度 $y$ 处（$0 \\le y \\le ${k ** 3}$），三次曲线给出外半径 $\\sqrt[3]{y}$，直线给出内半径 $${over("y", k * k)}$：`,
          `V = \\pi${int(0, k ** 3, `\\left(y^{2/3} - ${over("y^{2}", k ** 4)}\\right)`, "y")} = \\pi\\left(${Q.of(3 * k ** 5, 5).toLatex()} - ${Q.of(k ** 5, 3).toLatex()}\\right) = ${piL(q)}`,
        ),
    };
  },
  (rng) => {
    const c = rng.int(1, 3);
    const s = rng.int(1, 4);
    const curve = `${c * s * s} - ${k1(c)}x^{2}`;
    return {
      curves: [`y = ${curve}`, "y = 0"],
      firstQuadrant: true,
      outer: curve,
      inner: "0",
      h: [c * s * s, 0, -c],
      b: s,
      wrong: otherAxis(Q.of(8 * c * c * s ** 5, 15), "x"),
      check: (q) =>
        washerCheck(
          `Discs about the $y$-axis give the same volume. Solving for $x^{2}$ gives $x^{2} = ${s * s} - ${over("y", c)}$, the square of the radius at height $y$:`,
          `绕 $y$ 轴用圆盘法也得到同样的体积。解出 $x^{2}$ 得 $x^{2} = ${s * s} - ${over("y", c)}$，即高度 $y$ 处半径的平方：`,
          `V = \\pi${int(0, c * s * s, `\\left(${s * s} - ${over("y", c)}\\right)`, "y")} = \\pi\\left(${c * s ** 4} - ${Q.of(c * s ** 4, 2).toLatex()}\\right) = ${piL(q)}`,
        ),
    };
  },
];

/** meetingShellsProblem rotates a region between meeting curves about the axis perpendicular to v. */
function meetingShellsProblem(rng: Rng, v: Variable) {
  const c = rng.pick(v === "y" ? meetingShellsAboutXAxis : meetingShellsAboutYAxis)(rng);
  const u = across(v);
  const hl = c.inner === "0" ? c.outer : `${c.outer} - ${c.inner}`;
  const { q, lines } = shellWork(c.h, hl, 0, c.b, v);
  const length = `h(${v}) = ${hl}`;
  const where = v === "y" ? t("to the right", "右边") : t("above", "上方");
  return piProblem(
    volumePrompt([m(c.curves[0]), c.curves[1] === "y = 0" ? axisName("x") : m(c.curves[1])], axisName(u), c.firstQuadrant),
    q,
    [c.wrong, halfShell(q), noRadius(intQ(c.h, 0, c.b).mul(Q.of(2)))],
    [
      [
        ["Find the limits and the height", "求积分限和高"],
        t(
          `The curves meet at $${v} = 0$ and $${v} = ${c.b}$. Between them $${u} = ${c.outer}$ is ${where.en}, so the strip at $${v}$ has length`,
          `两曲线交于 $${v} = 0$ 和 $${v} = ${c.b}$。在两者之间 $${u} = ${c.outer}$ 在${where["zh-CN"]}，所以 $${v}$ 处窄条的长为`,
        ),
        [length],
      ],
      [
        ["Integrate", "积分"],
        t(
          `The shell radius is $${v}$. Each shell contributes $2\\pi$ times radius times height:`,
          `柱壳半径为 $${v}$。每个柱壳贡献 $2\\pi$ 乘以半径再乘以高：`,
        ),
        lines,
      ],
    ],
    c.check(q),
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
  intro: t(
    "Rotating the region between the $y$-axis and $x = 3$, for $0 \\le y \\le 2$, about the $x$-axis gives shells of radius $y$ and height $3$:\n\n$$V = 2\\pi\\int_{0}^{2} 3y \\, dy = 12\\pi$$\n\nCheck: the solid is a cylinder of radius $2$ and length $3$, and $\\pi \\cdot 2^{2} \\cdot 3 = 12\\pi$.\n\nIn this lesson we use shells for regions between two curves, where the height of each shell is the distance between the curves.",
    "把 $y$ 轴与 $x = 3$ 之间 $0 \\le y \\le 2$ 的区域绕 $x$ 轴旋转，得到半径为 $y$、高为 $3$ 的柱壳：\n\n$$V = 2\\pi\\int_{0}^{2} 3y \\, dy = 12\\pi$$\n\n检验：这个立体是半径为 $2$、长为 $3$ 的圆柱，$\\pi \\cdot 2^{2} \\cdot 3 = 12\\pi$。\n\n这节课我们对两曲线之间的区域用柱壳法，每个柱壳的高是两曲线之间的距离。",
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
        "If $f(y) \\ge g(y)$ for $c \\le y \\le d$, the horizontal strip at height $y$ runs from $x = g(y)$ to $x = f(y)$, so its length is $f(y) - g(y)$:\n\n$$V = 2\\pi\\int_{c}^{d} y\\left(f(y) - g(y)\\right) dy$$\n\nOnly the difference of the curves matters, not their position along the $x$-axis. For example, between $x = y^{2} + 1$ and $x = y^{2} + 3$, for $0 \\le y \\le 2$, every strip has length $2$, so $V = 2\\pi\\int_{0}^{2} 2y \\, dy = 8\\pi$.\n\nCheck: sliding each strip sideways does not change its shell, so this is also the volume for the rectangle $1 \\le x \\le 3$, $0 \\le y \\le 2$: a cylinder of radius $2$ and length $2$, of volume $\\pi \\cdot 2^{2} \\cdot 2 = 8\\pi$.\n\n> **Watch out.** The length is right minus left, $f(y) - g(y)$. Using $f(y)$ alone measures from the $y$-axis and counts ground outside the region.",
        "若当 $c \\le y \\le d$ 时 $f(y) \\ge g(y)$，高度 $y$ 处的水平窄条从 $x = g(y)$ 延伸到 $x = f(y)$，长为 $f(y) - g(y)$：\n\n$$V = 2\\pi\\int_{c}^{d} y\\left(f(y) - g(y)\\right) dy$$\n\n只有两曲线之差起作用，与它们沿 $x$ 轴的位置无关。例如在 $x = y^{2} + 1$ 与 $x = y^{2} + 3$ 之间（$0 \\le y \\le 2$），每个窄条长都是 $2$，所以 $V = 2\\pi\\int_{0}^{2} 2y \\, dy = 8\\pi$。\n\n检验：把每个窄条横向平移不改变它的柱壳，所以这也是矩形 $1 \\le x \\le 3$、$0 \\le y \\le 2$ 的体积：半径为 $2$、长为 $2$ 的圆柱，体积为 $\\pi \\cdot 2^{2} \\cdot 2 = 8\\pi$。\n\n> **注意。** 长是右边减左边，即 $f(y) - g(y)$。只用 $f(y)$ 是从 $y$ 轴量起，把区域外的部分也算进去了。",
      ),
      generate: (rng) => shellsBetweenCurves(rng, "y"),
    },
    {
      id: "shells-between-intersecting-curves",
      title: t("Shells between intersecting curves", "相交曲线之间的柱壳"),
      explanation: t(
        "When the curves enclose a region by themselves, find the limits by solving for where they meet, then decide which is farther right. For $x = y^{2}$ and $x = 2y$, $y^{2} = 2y$ gives $y = 0$ and $y = 2$, and $2y \\ge y^{2}$ between them, so\n\n$$V = 2\\pi\\int_{0}^{2} y(2y - y^{2}) \\, dy = \\frac{8\\pi}{3}$$\n\nCheck: washers about the $x$-axis give the same volume. For $0 \\le x \\le 4$ the region runs from $y = \\frac{x}{2}$ up to $y = \\sqrt{x}$, so\n\n$$V = \\pi\\int_{0}^{4} \\left(x - \\frac{x^{2}}{4}\\right) dx = \\pi\\left(8 - \\frac{16}{3}\\right) = \\frac{8\\pi}{3}$$\n\n> **Watch out.** Decide which curve is on the right between the meeting points. Here the length is $2y - y^{2}$; $y^{2} - 2y$ would give a negative volume.",
        "当两条曲线自己围成区域时，先解出交点得到积分限，再判断哪条在右边。对 $x = y^{2}$ 与 $x = 2y$，由 $y^{2} = 2y$ 得 $y = 0$ 和 $y = 2$，两者之间 $2y \\ge y^{2}$，所以\n\n$$V = 2\\pi\\int_{0}^{2} y(2y - y^{2}) \\, dy = \\frac{8\\pi}{3}$$\n\n检验：绕 $x$ 轴用垫圈法也得到同样的体积。对 $0 \\le x \\le 4$，区域从 $y = \\frac{x}{2}$ 向上延伸到 $y = \\sqrt{x}$，所以\n\n$$V = \\pi\\int_{0}^{4} \\left(x - \\frac{x^{2}}{4}\\right) dx = \\pi\\left(8 - \\frac{16}{3}\\right) = \\frac{8\\pi}{3}$$\n\n> **注意。** 要判断两个交点之间哪条曲线在右边。这里长是 $2y - y^{2}$；用 $y^{2} - 2y$ 会得到负的体积。",
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
  const { p, q, lines } = shellWork(f, fl, a, b, "x");
  return piProblem(
    volumePrompt([m(`y = ${fl}`), axisName("x"), m(`x = ${a}`), m(`x = ${b}`)], axisName("y")),
    q,
    [
      noRadius(intQ(f, a, b).mul(Q.of(2))),
      halfShell(q),
      [
        intQ(sq(f), a, b),
        "This uses discs of radius $y$, which rotate the region about the $x$-axis instead.",
        "这里用了半径为 $y$ 的圆盘，那是绕 $x$ 轴旋转。",
      ],
    ],
    [
      [
        ["Describe a shell", "描述柱壳"],
        t(
          `A vertical strip at $x$ runs from the $x$-axis up to the curve, so its height is $${fl}$. Rotating it about the $y$-axis sweeps out a shell of radius $x$ and height $${fl}$.`,
          `$x$ 处的竖直窄条从 $x$ 轴向上到曲线，高为 $${fl}$。它绕 $y$ 轴旋转形成半径为 $x$、高为 $${fl}$ 的柱壳。`,
        ),
      ],
      [
        ["Integrate", "积分"],
        t(
          `Each shell contributes $2\\pi$ times radius times height. Add the shells from $x = ${a}$ to $x = ${b}$:`,
          `每个柱壳贡献 $2\\pi$ 乘以半径再乘以高。把 $x = ${a}$ 到 $x = ${b}$ 的柱壳累加：`,
        ),
        lines,
      ],
    ],
    bounds(p, a, b, 2, q, "x"),
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
  intro: t(
    "Rotating the region between $x = y^{2}$, the $y$-axis and $y = 2$ about the $x$-axis gives shells of radius $y$ and length $y^{2}$:\n\n$$V = 2\\pi\\int_{0}^{2} y^{3} \\, dy = 8\\pi$$\n\nCheck: washers give the same volume. For $0 \\le x \\le 4$ the region runs from $y = \\sqrt{x}$ up to $y = 2$, and $\\pi\\int_{0}^{4} (4 - x) \\, dx = 8\\pi$.\n\nIn this lesson we rotate about the $y$-axis instead, where vertical strips sweep out shells of radius $x$.",
    "把 $x = y^{2}$、$y$ 轴与 $y = 2$ 围成的区域绕 $x$ 轴旋转，得到半径为 $y$、长为 $y^{2}$ 的柱壳：\n\n$$V = 2\\pi\\int_{0}^{2} y^{3} \\, dy = 8\\pi$$\n\n检验：用垫圈法也得到同样的体积。对 $0 \\le x \\le 4$，区域从 $y = \\sqrt{x}$ 向上延伸到 $y = 2$，$\\pi\\int_{0}^{4} (4 - x) \\, dx = 8\\pi$。\n\n这节课我们改为绕 $y$ 轴旋转，竖直窄条扫出半径为 $x$ 的柱壳。",
  ),
  prerequisites: ["the-shell-method-rotating-a-region-about-the-x-axis"],
  encompasses: [],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "shells-under-a-curve",
      figure: calculusDrawings4["the-shell-method-rotation-about-the-y-axis#shells-under-a-curve"],
      title: t("Shells under a curve", "曲线下方区域的柱壳"),
      explanation: t(
        "Rotating the region under $y = f(x)$, for $0 \\le a \\le x \\le b$, about the $y$-axis: the vertical strip at $x$ has height $f(x)$ and sweeps out a shell of radius $x$, so\n\n$$V = 2\\pi\\int_{a}^{b} x f(x) \\, dx$$\n\nThis avoids solving $y = f(x)$ for $x$. For $y = x^{2}$ on $[0, 2]$, $V = 2\\pi\\int_{0}^{2} x^{3} \\, dx = 8\\pi$.\n\nCheck: washers about the $y$-axis give the same volume. For $0 \\le y \\le 4$ the region runs from $x = \\sqrt{y}$ out to $x = 2$, and $\\pi\\int_{0}^{4} (4 - y) \\, dy = 8\\pi$.\n\n> **Watch out.** The radius of a shell about the $y$-axis is $x$, and $f(x)$ is its height. Swapping them gives a different integral.",
        "把 $y = f(x)$ 下方（$0 \\le a \\le x \\le b$）的区域绕 $y$ 轴旋转：$x$ 处的竖直窄条高为 $f(x)$，形成半径为 $x$ 的柱壳，所以\n\n$$V = 2\\pi\\int_{a}^{b} x f(x) \\, dx$$\n\n这样无需从 $y = f(x)$ 解出 $x$。对 $[0, 2]$ 上的 $y = x^{2}$，$V = 2\\pi\\int_{0}^{2} x^{3} \\, dx = 8\\pi$。\n\n检验：绕 $y$ 轴用垫圈法也得到同样的体积。对 $0 \\le y \\le 4$，区域从 $x = \\sqrt{y}$ 向外延伸到 $x = 2$，$\\pi\\int_{0}^{4} (4 - y) \\, dy = 8\\pi$。\n\n> **注意。** 绕 $y$ 轴的柱壳半径是 $x$，$f(x)$ 是它的高。两者弄反会得到另一个积分。",
      ),
      generate: (rng) => shellsUnderCurve(rng),
    },
    {
      id: "shells-between-two-curves",
      title: t("Shells between two curves", "两曲线之间的柱壳"),
      explanation: t(
        "For the region between $y = f(x)$ and $y = g(x)$ with $f \\ge g$, the strip height is $f(x) - g(x)$:\n\n$$V = 2\\pi\\int_{a}^{b} x\\left(f(x) - g(x)\\right) dx$$\n\nFor $y = x$ and $y = x^{2}$, which meet at $x = 0$ and $x = 1$, $V = 2\\pi\\int_{0}^{1} x(x - x^{2}) \\, dx = \\frac{\\pi}{6}$.\n\nCheck: washers about the $y$-axis give the same volume, with outer radius $\\sqrt{y}$ and inner radius $y$:\n\n$$V = \\pi\\int_{0}^{1} (y - y^{2}) \\, dy = \\pi\\left(\\frac{1}{2} - \\frac{1}{3}\\right) = \\frac{\\pi}{6}$$\n\n> **Watch out.** The height is the upper curve minus the lower one. Between $0$ and $1$ the line $y = x$ is above $y = x^{2}$, so the height is $x - x^{2}$.",
        "对 $y = f(x)$ 与 $y = g(x)$（$f \\ge g$）之间的区域，窄条高为 $f(x) - g(x)$：\n\n$$V = 2\\pi\\int_{a}^{b} x\\left(f(x) - g(x)\\right) dx$$\n\n对交于 $x = 0$ 和 $x = 1$ 的 $y = x$ 与 $y = x^{2}$，$V = 2\\pi\\int_{0}^{1} x(x - x^{2}) \\, dx = \\frac{\\pi}{6}$。\n\n检验：绕 $y$ 轴用垫圈法也得到同样的体积，外半径为 $\\sqrt{y}$，内半径为 $y$：\n\n$$V = \\pi\\int_{0}^{1} (y - y^{2}) \\, dy = \\pi\\left(\\frac{1}{2} - \\frac{1}{3}\\right) = \\frac{\\pi}{6}$$\n\n> **注意。** 高是上方曲线减下方曲线。在 $0$ 与 $1$ 之间直线 $y = x$ 在 $y = x^{2}$ 上方，所以高是 $x - x^{2}$。",
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

/** surfaceNoPi answers a surface area written without π. */
const surfaceNoPi = (response: string): Said =>
  say(
    response,
    "This leaves out the factor $\\pi$: each band has circumference $2\\pi$ times its radius.",
    "漏掉了因子 $\\pi$：每条窄带的周长是 $2\\pi$ 乘以它的半径。",
  );

/** surfaceHalf answers a surface area computed with π instead of 2π. */
const surfaceHalf = (response: string): Said =>
  say(
    response,
    "This uses $\\pi$ instead of $2\\pi$: a band at radius $r$ has circumference $2\\pi r$.",
    "这里用了 $\\pi$ 而不是 $2\\pi$：半径为 $r$ 的窄带周长是 $2\\pi r$。",
  );

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
  const radiusAt = (x: number) => (aboutV ? slope.mul(Q.of(x)).add(Q.of(c)) : Q.of(x));
  const [r1, r2] = [radiusAt(a), radiusAt(b)];
  const I = r1.add(r2).mul(Q.of(b - a, 2));
  const root = rootTimes(Q.of(1, d), N, "");
  const answer = rootTimes(I.mul(Q.of(2, d)), N, "\\pi");
  const ell = rootTimes(Q.of(b - a, d), N, "");
  const axis = aboutV ? v : u;
  const radius = aboutV ? line : v;
  const dudv = `\\frac{d${u}}{d${v}}`;
  const cone = r1.isZero();
  const frustum = shown(
    cone
      ? `S = \\pi${r2.eq(Q.one) ? "" : ` \\cdot ${r2.toLatex()}`} \\cdot ${ell} = ${answer}`
      : `S = \\pi\\left(${r1.toLatex()} + ${r2.toLatex()}\\right) \\cdot ${ell} = ${answer}`,
  );
  return functionWith(
    {
      prompt: surfacePrompt(`${u} = ${line}`, v, a, b, axis),
      answer,
      solution: walked(
        [
          [
            ["Find the arc length factor", "求弧长因子"],
            t(
              `The segment has constant slope, so the factor $\\sqrt{1 + \\left(${dudv}\\right)^{2}}$ is a number:`,
              `线段的斜率是常数，所以因子 $\\sqrt{1 + \\left(${dudv}\\right)^{2}}$ 是一个数：`,
            ),
            [`${dudv} = ${slope.toLatex()}`, `\\sqrt{1 + \\left(${dudv}\\right)^{2}} = \\sqrt{1 + ${sqr(slope.toLatex())}} = ${root}`],
          ],
          [
            ["Integrate", "积分"],
            t(`The radius is the distance to the $${axis}$-axis, $${radius}$:`, `半径是到 $${axis}$ 轴的距离 $${radius}$：`),
            [
              `S = 2\\pi \\cdot ${root}${int(a, b, wrap(radius), v)}`,
              ...(I.eq(Q.one) ? [] : [`= 2\\pi \\cdot ${root} \\cdot ${I.toLatex()}`]),
              `= ${answer}`,
            ],
          ],
        ],
        cone
          ? t(
              `The surface is the side of a cone with base radius $${r2.toLatex()}$ and slant height equal to the length of the segment, $${ell}$, and its area is $\\pi r\\ell$:${frustum}`,
              `曲面是圆锥的侧面，底面半径为 $${r2.toLatex()}$，母线长等于线段的长 $${ell}$，面积为 $\\pi r\\ell$：${frustum}`,
            )
          : t(
              `The surface is the side of a frustum of a cone with end radii $${r1.toLatex()}$ and $${r2.toLatex()}$ and slant height equal to the length of the segment, $${ell}$. Its area is $\\pi(r_{1} + r_{2})\\ell$:${frustum}`,
              `曲面是圆台的侧面，两端半径为 $${r1.toLatex()}$ 和 $${r2.toLatex()}$，母线长等于线段的长 $${ell}$，面积为 $\\pi(r_{1} + r_{2})\\ell$：${frustum}`,
            ),
      ),
    },
    [
      surfaceHalf(rootTimes(I.mul(Q.of(1, d)), N, "\\pi")),
      say(
        piL(I.mul(Q.of(2))),
        `This leaves out the factor $\\sqrt{1 + \\left(${dudv}\\right)^{2}}$, using $d${v}$ in place of the arc length $ds$.`,
        `漏掉了因子 $\\sqrt{1 + \\left(${dudv}\\right)^{2}}$，用 $d${v}$ 代替了弧长 $ds$。`,
      ),
      say(
        rootTimes(Q.of(2 * (b - a), d), N, "\\pi"),
        "This leaves out the radius, as if every band had radius $1$.",
        "漏掉了半径，好像每条窄带的半径都是 $1$。",
      ),
      surfaceNoPi(rootTimes(I.mul(Q.of(2, d)), N, "")),
    ],
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
  const dudv = `\\frac{d${u}}{d${v}}`;
  const whole = b - a === 2 * r;
  const sphere = 4 * r * r;
  return piProblem(
    surfacePrompt(`${u} = ${rootL}`, v, a, b, v),
    q,
    [
      [
        Q.of(r * (b - a)),
        "This uses $\\pi$ instead of $2\\pi$: a band at radius $r$ has circumference $2\\pi r$.",
        "这里用了 $\\pi$ 而不是 $2\\pi$：半径为 $r$ 的窄带周长是 $2\\pi r$。",
      ],
      [
        Q.of(sphere),
        `This is the area of the whole sphere; only the part between $${v} = ${a}$ and $${v} = ${b}$ is swept out.`,
        `这是整个球面的面积；只有 $${v} = ${a}$ 与 $${v} = ${b}$ 之间的部分被扫出。`,
      ],
      [
        Q.of(r * r * (b - a)).sub(Q.of(b ** 3 - a ** 3, 3)),
        `This is the volume of the solid, $\\pi\\int ${u}^{2} \\, d${v}$, not the area of its surface.`,
        `这是旋转体的体积 $\\pi\\int ${u}^{2} \\, d${v}$，不是曲面的面积。`,
      ],
    ],
    [
      [
        ["Simplify the integrand", "化简被积函数"],
        t(
          `Differentiate and put the pieces of $${u}\\sqrt{1 + \\left(${dudv}\\right)^{2}}$ together:`,
          `求导，再把 $${u}\\sqrt{1 + \\left(${dudv}\\right)^{2}}$ 的各部分合起来：`,
        ),
        [
          `${dudv} = -\\frac{${v}}{${rootL}}`,
          `1 + \\left(${dudv}\\right)^{2} = 1 + \\frac{${v}^{2}}{${r * r} - ${v}^{2}} = \\frac{${r * r}}{${r * r} - ${v}^{2}}`,
          `${u}\\sqrt{1 + \\left(${dudv}\\right)^{2}} = ${rootL} \\cdot \\frac{${r}}{${rootL}} = ${r}`,
        ],
      ],
      [
        ["Integrate", "积分"],
        t("The integrand is the constant radius of the sphere:", "被积函数就是球的半径，是常数："),
        [`S = 2\\pi${int(a, b, `${r}`, v)} = ${piL(q)}`],
      ],
    ],
    whole
      ? t(
          `The arc is the whole half circle, so the surface is the whole sphere of radius $${r}$, of area${shown(`4\\pi \\cdot ${r}^{2} = ${piL(q)}`)}`,
          `这段弧是整个半圆，所以曲面是半径为 $${r}$ 的整个球面，面积为${shown(`4\\pi \\cdot ${r}^{2} = ${piL(q)}`)}`,
        )
      : t(
          `The sphere of radius $${r}$ has area $4\\pi \\cdot ${r}^{2} = ${sphere}\\pi$, and a zone between parallel planes has area in proportion to its height. This zone has height $${b - a}$ out of $${2 * r}$:${shown(`S = ${Q.of(b - a, 2 * r).toLatex()} \\cdot ${sphere}\\pi = ${piL(q)}`)}`,
          `半径为 $${r}$ 的球面面积为 $4\\pi \\cdot ${r}^{2} = ${sphere}\\pi$，两平行平面之间的球带面积与它的高成正比。这个球带的高是 $${b - a}$，占全高 $${2 * r}$ 的一部分：${shown(`S = ${Q.of(b - a, 2 * r).toLatex()} \\cdot ${sphere}\\pi = ${piL(q)}`)}`,
        ),
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
  const dudv = `\\frac{d${u}}{d${v}}`;
  const derivative = `\\frac{d}{d${v}}\\left[\\frac{\\pi}{6}(${w})^{3/2}\\right] = \\frac{\\pi}{6} \\cdot \\frac{3}{2} \\cdot 4(${w})^{1/2} = \\pi\\sqrt{${w}}`;
  return piProblem(
    surfacePrompt(`${u} = \\sqrt{${inner}}`, v, a, b, v),
    q,
    [
      [
        Q.of(k ** 3 - j ** 3, 3),
        "This drops the $\\frac{1}{2}$ in front of the root, so the result is twice too large.",
        "漏掉了根号前的 $\\frac{1}{2}$，所以结果大了一倍。",
      ],
      [
        Q.of(k ** 3 - j ** 3, 12),
        "This uses $\\pi$ instead of $2\\pi$: a band at radius $r$ has circumference $2\\pi r$.",
        "这里用了 $\\pi$ 而不是 $2\\pi$：半径为 $r$ 的窄带周长是 $2\\pi r$。",
      ],
      [
        Q.of(k ** 3, 6),
        "This evaluates only at the upper limit and leaves out the value at the lower limit.",
        "这里只代入了上限，漏掉了下限处的值。",
      ],
    ],
    [
      [
        ["Simplify the integrand", "化简被积函数"],
        t(
          `Differentiate, then put $${u}\\sqrt{1 + \\left(${dudv}\\right)^{2}}$ under one root:`,
          `求导，再把 $${u}\\sqrt{1 + \\left(${dudv}\\right)^{2}}$ 写成一个根号：`,
        ),
        [
          `${dudv} = \\frac{1}{2\\sqrt{${inner}}}`,
          `${u}\\sqrt{1 + \\left(${dudv}\\right)^{2}} = \\sqrt{${inner}}\\sqrt{1 + \\frac{1}{4${wrap(inner)}}} = \\sqrt{${inner} + \\frac{1}{4}} = \\frac{1}{2}\\sqrt{${w}}`,
        ],
      ],
      [
        ["Integrate", "积分"],
        t(
          `Substitute $w = ${w}$, so $dw = 4 \\, d${v}$; at the limits $w$ is $${j * j}$ and $${k * k}$:`,
          `代换 $w = ${w}$，则 $dw = 4 \\, d${v}$；在积分限处 $w$ 等于 $${j * j}$ 和 $${k * k}$：`,
        ),
        [
          `S = 2\\pi${int(a, b, `\\frac{1}{2}\\sqrt{${w}}`, v)} = \\pi${int(a, b, `\\sqrt{${w}}`, v)}`,
          `= \\frac{\\pi}{6}\\Big[(${w})^{3/2}\\Big]_{${a}}^{${b}} = \\frac{\\pi}{6}(${k}^{3} - ${j}^{3}) = ${piL(q)}`,
        ],
      ],
    ],
    t(
      `Differentiating the antiderivative gives back the integrand, so the antiderivative is right:${shown(derivative)}`,
      `对原函数求导得回被积函数，所以原函数是对的：${shown(derivative)}`,
    ),
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
  intro: t(
    "The arc length of $y = \\frac{3}{4}x$ from $x = 0$ to $x = 4$ is\n\n$$L = \\int_{0}^{4} \\sqrt{1 + \\frac{9}{16}} \\, dx = \\frac{5}{4} \\cdot 4 = 5$$\n\nCheck: the segment runs from $(0, 0)$ to $(4, 3)$, and $\\sqrt{4^{2} + 3^{2}} = 5$.\n\nIn this lesson we rotate a curve about the $x$-axis and find the area of the surface it sweeps out, giving each piece of arc length the circumference of its circle.",
    "$y = \\frac{3}{4}x$ 从 $x = 0$ 到 $x = 4$ 的弧长为\n\n$$L = \\int_{0}^{4} \\sqrt{1 + \\frac{9}{16}} \\, dx = \\frac{5}{4} \\cdot 4 = 5$$\n\n检验：线段从 $(0, 0)$ 到 $(4, 3)$，$\\sqrt{4^{2} + 3^{2}} = 5$。\n\n这节课我们把曲线绕 $x$ 轴旋转，求它扫出的曲面的面积：每一小段弧长都乘以它所在圆的周长。",
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
      figure: calculusDrawings4["surface-areas-of-revolution-rotation-about-the-x-axis#surfaces-from-line-segments"],
      title: t("Surfaces from line segments", "由线段旋转得到的曲面"),
      explanation: t(
        "A short piece of the curve with arc length $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$, at distance $f(x)$ from the axis, sweeps out a thin band of area $2\\pi f(x) \\, ds$. So rotating $y = f(x) \\ge 0$, $a \\le x \\le b$, about the $x$-axis gives\n\n$$S = 2\\pi\\int_{a}^{b} f(x)\\sqrt{1 + f'(x)^{2}} \\, dx$$\n\nFor a line the square root is a constant. Rotating $y = x$, $0 \\le x \\le 1$, gives $S = 2\\pi\\sqrt{2}\\int_{0}^{1} x \\, dx = \\sqrt{2}\\pi$.\n\nCheck: the surface is the side of a cone with radius $1$ and slant height $\\sqrt{2}$, and its area $\\pi r\\ell$ is $\\sqrt{2}\\pi$.\n\n> **Watch out.** Use the arc length $ds$, not $dx$. $2\\pi\\int_{0}^{1} x \\, dx = \\pi$ is too small, because the slanted segment is longer than its shadow on the axis.",
        "曲线上弧长为 $ds = \\sqrt{1 + f'(x)^{2}} \\, dx$、到旋转轴距离为 $f(x)$ 的一小段，旋转后形成面积为 $2\\pi f(x) \\, ds$ 的窄带。所以 $y = f(x) \\ge 0$（$a \\le x \\le b$）绕 $x$ 轴旋转所得曲面的面积为\n\n$$S = 2\\pi\\int_{a}^{b} f(x)\\sqrt{1 + f'(x)^{2}} \\, dx$$\n\n对直线，根号部分是常数。$y = x$（$0 \\le x \\le 1$）旋转得 $S = 2\\pi\\sqrt{2}\\int_{0}^{1} x \\, dx = \\sqrt{2}\\pi$。\n\n检验：这个曲面是半径为 $1$、母线长为 $\\sqrt{2}$ 的圆锥的侧面，面积 $\\pi r\\ell$ 等于 $\\sqrt{2}\\pi$。\n\n> **注意。** 要用弧长 $ds$，不能用 $dx$。$2\\pi\\int_{0}^{1} x \\, dx = \\pi$ 偏小，因为斜线段比它在轴上的投影长。",
      ),
      generate: (rng) => surfaceLine(rng, "x", true),
    },
    {
      id: "surfaces-from-curves",
      figure: calculusDrawings4["surface-areas-of-revolution-rotation-about-the-x-axis#surfaces-from-curves"],
      title: t("Surfaces from curves", "由曲线旋转得到的曲面"),
      explanation: t(
        "Simplify $f(x)\\sqrt{1 + f'(x)^{2}}$ before integrating. For the circle $y = \\sqrt{r^{2} - x^{2}}$, $f'(x) = -\\frac{x}{\\sqrt{r^{2} - x^{2}}}$, so $1 + f'(x)^{2} = \\frac{r^{2}}{r^{2} - x^{2}}$ and\n\n$$f(x)\\sqrt{1 + f'(x)^{2}} = \\sqrt{r^{2} - x^{2}} \\cdot \\frac{r}{\\sqrt{r^{2} - x^{2}}} = r$$\n\nA zone of a sphere between $x = a$ and $x = b$ therefore has area $2\\pi r(b - a)$. For example, with $r = 2$, $a = 0$ and $b = 2$, the half sphere has area $2\\pi \\cdot 2 \\cdot 2 = 8\\pi$.\n\nCheck: the whole sphere of radius $2$ has area $4\\pi \\cdot 2^{2} = 16\\pi$, and half of it is $8\\pi$.\n\n> **Watch out.** $\\sqrt{1 + f'(x)^{2}}$ is not $1 + f'(x)$: square the derivative, add $1$, and only then take the root.",
        "积分前先化简 $f(x)\\sqrt{1 + f'(x)^{2}}$。对圆 $y = \\sqrt{r^{2} - x^{2}}$，$f'(x) = -\\frac{x}{\\sqrt{r^{2} - x^{2}}}$，所以 $1 + f'(x)^{2} = \\frac{r^{2}}{r^{2} - x^{2}}$，于是\n\n$$f(x)\\sqrt{1 + f'(x)^{2}} = \\sqrt{r^{2} - x^{2}} \\cdot \\frac{r}{\\sqrt{r^{2} - x^{2}}} = r$$\n\n因此球面在 $x = a$ 与 $x = b$ 之间的部分面积为 $2\\pi r(b - a)$。例如 $r = 2$、$a = 0$、$b = 2$ 时，半个球面的面积为 $2\\pi \\cdot 2 \\cdot 2 = 8\\pi$。\n\n检验：半径为 $2$ 的整个球面面积为 $4\\pi \\cdot 2^{2} = 16\\pi$，一半是 $8\\pi$。\n\n> **注意。** $\\sqrt{1 + f'(x)^{2}}$ 不等于 $1 + f'(x)$：先把导数平方，加 $1$，然后才开根号。",
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
  const inside = `1 + ${4 * c * c}x^{2}`;
  const derivative = `\\frac{d}{dx}\\left[\\frac{\\pi}{${D}}(${inside})^{3/2}\\right] = \\frac{\\pi}{${D}} \\cdot \\frac{3}{2} \\cdot ${8 * c * c}x\\sqrt{${inside}} = 2\\pi x\\sqrt{${inside}}`;
  return functionWith(
    {
      prompt: surfacePrompt(`y = ${k1(c)}x^{2}`, "x", 0, b, "y"),
      answer,
      solution: walked(
        [
          [
            ["Set up the integral", "列出积分"],
            t(`About the $y$-axis the radius is $x$, and $y' = ${2 * c}x$:`, `绕 $y$ 轴旋转时半径为 $x$，而 $y' = ${2 * c}x$：`),
            [`S = 2\\pi${int(0, b, `x\\sqrt{${inside}}`)}`],
          ],
          [
            ["Substitute", "换元"],
            t(
              `Let $w = ${inside}$, so $dw = ${8 * c * c}x \\, dx$; the limits $x = 0$ and $x = ${b}$ become $w = 1$ and $w = ${N}$:`,
              `令 $w = ${inside}$，则 $dw = ${8 * c * c}x \\, dx$；积分限 $x = 0$ 和 $x = ${b}$ 变为 $w = 1$ 和 $w = ${N}$：`,
            ),
            [
              `S = \\frac{\\pi}{${4 * c * c}}\\int_{1}^{${N}} \\sqrt{w} \\, dw`,
              `= \\frac{\\pi}{${D}}\\Big[w^{3/2}\\Big]_{1}^{${N}} = ${answer}`,
            ],
          ],
        ],
        t(
          `Differentiating the antiderivative in $x$ gives back the integrand, so the antiderivative is right:${shown(derivative)}`,
          `对关于 $x$ 的原函数求导得回被积函数，所以原函数是对的：${shown(derivative)}`,
        ),
      ),
    },
    [
      say(`\\frac{${root}\\pi}{${D}}`, "This leaves out the value at the lower limit, where $w = 1$.", "漏掉了下限处的值，那里 $w = 1$。"),
      surfaceHalf(`\\frac{\\pi}{${2 * D}}\\left(${root} - 1\\right)`),
      say(
        `\\frac{\\pi}{${D / c}}\\left(${root} - 1\\right)`,
        `This takes $dw$ as $${8 * c}x \\, dx$, forgetting to square the coefficient ${c}.`,
        `这里把 $dw$ 当成 $${8 * c}x \\, dx$，忘了把系数 ${c} 平方。`,
      ),
    ],
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
  intro: t(
    "Rotating $y = x$, $0 \\le x \\le 1$, about the $x$-axis gives\n\n$$S = 2\\pi\\int_{0}^{1} x\\sqrt{2} \\, dx = \\sqrt{2}\\pi$$\n\nCheck: the surface is the side of a cone, and $\\pi r\\ell$ with $r = 1$ and $\\ell = \\sqrt{2}$ is $\\sqrt{2}\\pi$.\n\nIn this lesson we rotate curves about the $y$-axis, where the radius of each band is its distance $x$ from that axis.",
    "把 $y = x$（$0 \\le x \\le 1$）绕 $x$ 轴旋转，得\n\n$$S = 2\\pi\\int_{0}^{1} x\\sqrt{2} \\, dx = \\sqrt{2}\\pi$$\n\n检验：这个曲面是圆锥的侧面，$\\pi r\\ell$ 在 $r = 1$、$\\ell = \\sqrt{2}$ 时等于 $\\sqrt{2}\\pi$。\n\n这节课我们把曲线绕 $y$ 轴旋转，每条窄带的半径是它到 $y$ 轴的距离 $x$。",
  ),
  prerequisites: ["surface-areas-of-revolution-rotation-about-the-x-axis"],
  encompasses: [],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "rotating-y-as-a-function-of-x-about-the-y-axis",
      figure: calculusDrawings4["surface-areas-of-revolution-rotation-about-the-y-axis#rotating-y-as-a-function-of-x-about-the-y-axis"],
      title: t("Rotating y = f(x) about the y-axis", "y = f(x) 绕 y 轴旋转"),
      explanation: t(
        "When $y = f(x)$, $0 \\le a \\le x \\le b$, is rotated about the $y$-axis, a piece of the curve at $x$ is at distance $x$ from the axis, so\n\n$$S = 2\\pi\\int_{a}^{b} x\\sqrt{1 + f'(x)^{2}} \\, dx$$\n\nFor $y = x^{2}$, $0 \\le x \\le 1$, this is $S = 2\\pi\\int_{0}^{1} x\\sqrt{1 + 4x^{2}} \\, dx$, and substituting $w = 1 + 4x^{2}$ gives $\\frac{\\pi}{6}\\left(5\\sqrt{5} - 1\\right)$.\n\nCheck: differentiating the antiderivative gives back the integrand,\n\n$$\\frac{d}{dx}\\left[\\frac{\\pi}{6}(1 + 4x^{2})^{3/2}\\right] = \\frac{\\pi}{6} \\cdot \\frac{3}{2} \\cdot 8x\\sqrt{1 + 4x^{2}} = 2\\pi x\\sqrt{1 + 4x^{2}}$$\n\n> **Watch out.** About the $y$-axis the radius is $x$, not $f(x)$; $f(x)$ is the radius only for rotation about the $x$-axis.",
        "把 $y = f(x)$（$0 \\le a \\le x \\le b$）绕 $y$ 轴旋转时，曲线在 $x$ 处的一小段到旋转轴的距离为 $x$，所以\n\n$$S = 2\\pi\\int_{a}^{b} x\\sqrt{1 + f'(x)^{2}} \\, dx$$\n\n对 $y = x^{2}$（$0 \\le x \\le 1$），$S = 2\\pi\\int_{0}^{1} x\\sqrt{1 + 4x^{2}} \\, dx$，令 $w = 1 + 4x^{2}$ 得 $\\frac{\\pi}{6}\\left(5\\sqrt{5} - 1\\right)$。\n\n检验：对原函数求导得回被积函数，\n\n$$\\frac{d}{dx}\\left[\\frac{\\pi}{6}(1 + 4x^{2})^{3/2}\\right] = \\frac{\\pi}{6} \\cdot \\frac{3}{2} \\cdot 8x\\sqrt{1 + 4x^{2}} = 2\\pi x\\sqrt{1 + 4x^{2}}$$\n\n> **注意。** 绕 $y$ 轴旋转时半径是 $x$，不是 $f(x)$；只有绕 $x$ 轴旋转时半径才是 $f(x)$。",
      ),
      generate: (rng) => (rng.int(0, 2) === 0 ? surfaceParabola(rng) : surfaceLine(rng, "x", false)),
    },
    {
      id: "rotating-x-as-a-function-of-y-about-the-y-axis",
      figure: calculusDrawings4["surface-areas-of-revolution-rotation-about-the-y-axis#rotating-x-as-a-function-of-y-about-the-y-axis"],
      title: t("Rotating x = g(y) about the y-axis", "x = g(y) 绕 y 轴旋转"),
      explanation: t(
        "If the curve is $x = g(y) \\ge 0$, $c \\le y \\le d$, swap the roles of $x$ and $y$ in the formula for rotation about the $x$-axis:\n\n$$S = 2\\pi\\int_{c}^{d} g(y)\\sqrt{1 + g'(y)^{2}} \\, dy$$\n\nFor example, $x = \\sqrt{4 - y^{2}}$ for $0 \\le y \\le 2$ gives $g\\sqrt{1 + (g')^{2}} = 2$, just as for the circle rotated about the $x$-axis, so $S = 2\\pi\\int_{0}^{2} 2 \\, dy = 8\\pi$.\n\nCheck: the surface is half of the sphere of radius $2$, and half of $4\\pi \\cdot 2^{2} = 16\\pi$ is $8\\pi$.\n\n> **Watch out.** Integrate in $y$, with limits on the $y$-axis, and differentiate $g$ with respect to $y$.",
        "若曲线为 $x = g(y) \\ge 0$（$c \\le y \\le d$），把绕 $x$ 轴旋转公式中的 $x$ 和 $y$ 互换：\n\n$$S = 2\\pi\\int_{c}^{d} g(y)\\sqrt{1 + g'(y)^{2}} \\, dy$$\n\n例如 $x = \\sqrt{4 - y^{2}}$（$0 \\le y \\le 2$）给出 $g\\sqrt{1 + (g')^{2}} = 2$，与圆绕 $x$ 轴旋转时一样，所以 $S = 2\\pi\\int_{0}^{2} 2 \\, dy = 8\\pi$。\n\n检验：这个曲面是半径为 $2$ 的球面的一半，$4\\pi \\cdot 2^{2} = 16\\pi$ 的一半是 $8\\pi$。\n\n> **注意。** 要对 $y$ 积分，积分限在 $y$ 轴上，并且 $g$ 要对 $y$ 求导。",
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
