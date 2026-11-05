// Third knowledge points for thin topics of Calculus II, from integration to
// limits of sequences: the reverse question, a harder case or a common trap. See
// `deeperCalculusIIThirdPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { linear, paren, poly, Q } from "@ga/subject-math";

import { functionProblem, steps } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** same2 writes one formula as a pair for both languages. */
const same2 = (latex: string): Pair => [`$${latex}$`, `$${latex}$`];
/** triples are Pythagorean triples, used so that slant lengths and speeds are whole numbers. */
const triples = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
] as const;
/** quarterTurns are the axis angles of a polar curve, with their LaTeX and whether x and y swap roles there. */
const quarterTurns = [
  { at: "0", swap: false },
  { at: "\\frac{\\pi}{2}", swap: true },
  { at: "\\pi", swap: false },
  { at: "\\frac{3\\pi}{2}", swap: true },
] as const;
/** kpi asks for a coefficient of pi in both languages. */
const kpi = (en: string, zh: string): Pair => [`${en} Write it as $k\\pi$ and give $k$.`, `${zh}把结果写成 $k\\pi$，求 $k$。`];

const negativeExponent = point(
  "exponentials-in-the-denominator",
  ["Exponentials in the denominator", "分母中的指数函数"],
  [
    "An exponential in the denominator is an exponential with a negative exponent: $\\frac{1}{e^{ax}} = e^{-ax}$. Rewrite it before integrating. The minus sign then enters the factor $-\\frac{1}{a}$, and losing it is the common error.",
    "分母中的指数函数就是指数为负的指数函数：$\\frac{1}{e^{ax}} = e^{-ax}$。积分前先改写。这样负号就进入因子 $-\\frac{1}{a}$，漏掉它是常见的错误。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = nz(rng, 12);
    const answer = poly([Q.of(-c, a), `e^{-${a}x}`], [1, "C"]);
    return functionProblem({
      prompt: t(`Find $\\int \\frac{${c}}{e^{${a}x}} \\, dx$.`, `求 $\\int \\frac{${c}}{e^{${a}x}} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong: [
        poly([Q.of(c, a), `e^{-${a}x}`], [1, "C"]),
        poly([Q.of(-c * a), `e^{-${a}x}`], [1, "C"]),
        poly([Q.of(-c, a), `e^{${a}x}`], [1, "C"]),
      ],
      solution: t(
        `Rewrite the integrand as $${c}e^{-${a}x}$. Dividing by the coefficient $-${a}$ of $x$ gives $${answer}$.`,
        `把被积函数写成 $${c}e^{-${a}x}$。除以 $x$ 的系数 $-${a}$，得 $${answer}$。`,
      ),
    });
  },
);

const arsechOfExponential = point(
  "arsech-after-substituting-an-exponential",
  ["Arsech after substituting an exponential", "代换指数函数后得到 arsech"],
  [
    "The factor $x$ required by the arsech form can be hidden. In $\\frac{1}{\\sqrt{a^{2} - e^{2x}}}$, let $u = e^{x}$, so $dx = \\frac{du}{u}$ and the integral becomes $\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}}$, which is $-\\frac{1}{a}\\operatorname{arsech}\\frac{u}{a} + C$.",
    "arsech 形式所需的因子 $x$ 可能是隐藏的。在 $\\frac{1}{\\sqrt{a^{2} - e^{2x}}}$ 中令 $u = e^{x}$，则 $dx = \\frac{du}{u}$，积分变成 $\\int \\frac{du}{u\\sqrt{a^{2} - u^{2}}}$，结果是 $-\\frac{1}{a}\\operatorname{arsech}\\frac{u}{a} + C$。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const c = nz(rng, 9);
    const fn = `\\operatorname{arsech}\\frac{e^{x}}{${a}}`;
    const form = (co: Q, f: string) => `${poly([co, f])} + C`;
    const right = form(Q.of(-c, a), fn);
    return choose(
      rng,
      [
        `Find $\\int \\frac{${c}}{\\sqrt{${a * a} - e^{2x}}} \\, dx$ for $x < \\ln ${a}$.`,
        `当 $x < \\ln ${a}$ 时，求 $\\int \\frac{${c}}{\\sqrt{${a * a} - e^{2x}}} \\, dx$。`,
      ],
      same2(right),
      [same2(form(Q.of(c, a), fn)), same2(form(Q.of(-c), fn)), same2(form(Q.of(-c, a), `\\operatorname{arsech}\\frac{x}{${a}}`))],
      [
        `With $u = e^{x}$, $dx = \\frac{du}{u}$, the integral is $${poly([c, `\\int \\frac{du}{u\\sqrt{${a * a} - u^{2}}}`])}$. The arsech formula has the factor $-\\frac{1}{${a}}$, which gives $${right}$.`,
        `令 $u = e^{x}$，$dx = \\frac{du}{u}$，积分变成 $${poly([c, `\\int \\frac{du}{u\\sqrt{${a * a} - u^{2}}}`])}$。arsech 公式带有因子 $-\\frac{1}{${a}}$，结果是 $${right}$。`,
      ],
    );
  },
);

const squareWithLeadingCoefficient = point(
  "completing-the-square-with-a-leading-coefficient",
  ["Completing the square with a leading coefficient", "二次项有系数时配方"],
  [
    "When $x^{2}$ has a square coefficient, complete the square as $(kx + h)^{2} + b^{2}$. The substitution $u = kx + h$ then introduces the factor $\\frac{1}{k}$ through $dx = \\frac{du}{k}$, which is easy to leave out.",
    "当 $x^{2}$ 的系数是平方数时，配方成 $(kx + h)^{2} + b^{2}$。代换 $u = kx + h$ 通过 $dx = \\frac{du}{k}$ 带来因子 $\\frac{1}{k}$，这个因子很容易漏掉。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const h = nz(rng, 6);
    const b = rng.int(2, 6);
    const c = nz(rng, 8);
    const inner = linear(k, h);
    const fn = `\\operatorname{arsinh}\\frac{${inner}}{${b}}`;
    const form = (co: Q, f: string) => `${poly([co, f])} + C`;
    const right = form(Q.of(c, k), fn);
    const q = poly([k * k, "x^{2}"], [2 * k * h, "x"], [h * h + b * b, ""]);
    return choose(
      rng,
      [`Find $\\int \\frac{${c}}{\\sqrt{${q}}} \\, dx$.`, `求 $\\int \\frac{${c}}{\\sqrt{${q}}} \\, dx$。`],
      same2(right),
      [
        same2(form(Q.of(c), fn)),
        same2(form(Q.of(c, k), `\\operatorname{arcosh}\\frac{${inner}}{${b}}`)),
        same2(form(Q.of(c, k), `\\operatorname{arsinh}\\frac{${linear(1, h)}}{${b}}`)),
      ],
      [
        `$${q} = (${inner})^{2} + ${b}^{2}$. With $u = ${inner}$ and $dx = \\frac{du}{${k}}$, the integral is $${right}$.`,
        `$${q} = (${inner})^{2} + ${b}^{2}$。令 $u = ${inner}$，$dx = \\frac{du}{${k}}$，积分是 $${right}$。`,
      ],
    );
  },
);

const familyFromSquare = point(
  "the-sign-of-the-square-chooses-the-function",
  ["The sign of the square chooses the function", "平方项的符号决定函数"],
  [
    "Only after completing the square can you tell which inverse function appears. Under the root, $a^{2} - (x + h)^{2}$ leads to arsech and $(x + h)^{2} + a^{2}$ leads to arcsch. In both cases the coefficient is $-\\frac{1}{a}$ for $x + h > 0$.",
    "只有配方后才能看出出现哪个反函数。根号下是 $a^{2} - (x + h)^{2}$ 时得到 arsech，是 $(x + h)^{2} + a^{2}$ 时得到 arcsch。两种情况下，当 $x + h > 0$ 时系数都是 $-\\frac{1}{a}$。",
  ],
  (rng) => {
    const a = rng.int(2, 7);
    const h = nz(rng, 6);
    const c = nz(rng, 8);
    const plus = rng.bool();
    const u = linear(1, h);
    const q = plus ? poly([1, "x^{2}"], [2 * h, "x"], [h * h + a * a, ""]) : poly([-1, "x^{2}"], [-2 * h, "x"], [a * a - h * h, ""]);
    const form = (co: Q, name: string) => `${poly([co, `\\operatorname{${name}}\\frac{${u}}{${a}}`])} + C`;
    const name = plus ? "arcsch" : "arsech";
    const other = plus ? "arsech" : "arcsch";
    const domain = plus ? `x > ${-h}` : `${-h} < x < ${a - h}`;
    const square = plus ? `(${u})^{2} + ${a * a}` : `${a * a} - (${u})^{2}`;
    return choose(
      rng,
      [
        `Find $\\int \\frac{${c}}{(${u})\\sqrt{${q}}} \\, dx$ for $${domain}$.`,
        `当 $${domain}$ 时，求 $\\int \\frac{${c}}{(${u})\\sqrt{${q}}} \\, dx$。`,
      ],
      same2(form(Q.of(-c, a), name)),
      [same2(form(Q.of(-c, a), other)), same2(form(Q.of(-c), name)), same2(form(Q.of(c, a), name))],
      [
        `Completing the square gives $${square}$, which is the ${name} form with $a = ${a}$. So the result is $${form(Q.of(-c, a), name)}$.`,
        `配方得 $${square}$，这是 $a = ${a}$ 的 ${name} 形式。所以结果是 $${form(Q.of(-c, a), name)}$。`,
      ],
    );
  },
);

const pythagoreanIntegrals = point(
  "integrals-that-need-a-pythagorean-identity",
  ["Integrals that need a Pythagorean identity", "需要毕达哥拉斯恒等式的积分"],
  [
    "Squares of tangent and cotangent have no direct formula, but $\\tan^{2}x = \\sec^{2}x - 1$ and $\\cot^{2}x = \\csc^{2}x - 1$ reduce them to known integrals. The result contains an extra term in $x$, and treating $\\tan^{2}x$ as a power is wrong.",
    "正切和余切的平方没有直接的公式，但 $\\tan^{2}x = \\sec^{2}x - 1$ 和 $\\cot^{2}x = \\csc^{2}x - 1$ 把它们化成已知积分。结果中多了一个含 $x$ 的项，把 $\\tan^{2}x$ 当作普通的幂是错误的。",
  ],
  (rng) => {
    const c = nz(rng, 12);
    const kind = rng.pick(["tan", "cot", "unit", "sec"] as const);
    const group = (e: string) => `${c === 1 ? "" : c === -1 ? "-" : c}\\left(${e}\\right)`;
    const integrand = {
      tan: poly([c, "\\tan^{2}x"]),
      cot: poly([c, "\\cot^{2}x"]),
      unit: group("\\sec^{2}x - \\tan^{2}x"),
      sec: group("1 + \\tan^{2}x"),
    }[kind];
    const answer = {
      tan: poly([c, "\\tan x"], [-c, "x"], [1, "C"]),
      cot: poly([-c, "\\cot x"], [-c, "x"], [1, "C"]),
      unit: poly([c, "x"], [1, "C"]),
      sec: poly([c, "\\tan x"], [1, "C"]),
    }[kind];
    const wrong = {
      tan: [poly([c, "\\tan x"], [c, "x"], [1, "C"]), poly([c, "\\tan x"], [1, "C"])],
      cot: [poly([-c, "\\cot x"], [c, "x"], [1, "C"]), poly([c, "\\cot x"], [-c, "x"], [1, "C"])],
      unit: [poly([c, "\\tan x"], [-c, "x"], [1, "C"]), poly([-c, "x"], [1, "C"])],
      sec: [poly([c, "\\tan x"], [c, "x"], [1, "C"]), poly([c, "x"], [1, "C"])],
    }[kind];
    const identity = {
      tan: "\\tan^{2}x = \\sec^{2}x - 1",
      cot: "\\cot^{2}x = \\csc^{2}x - 1",
      unit: "\\sec^{2}x - \\tan^{2}x = 1",
      sec: "1 + \\tan^{2}x = \\sec^{2}x",
    }[kind];
    return functionProblem({
      prompt: t(`Find $\\int ${integrand} \\, dx$.`, `求 $\\int ${integrand} \\, dx$。`),
      answer,
      antiderivative: true,
      wrong,
      solution: t(
        `Use $${identity}$ to rewrite the integrand, then integrate to get $${answer}$.`,
        `用 $${identity}$ 改写被积函数，再积分，得 $${answer}$。`,
      ),
    });
  },
);

const areaLeftOfYAxis = point(
  "a-region-to-the-left-of-the-y-axis",
  ["A region to the left of the y-axis", "位于 y 轴左侧的区域"],
  [
    "With horizontal strips the length is always right curve minus left curve. When the region lies to the left of the $y$-axis, the right curve is $x = 0$, so the integrand is $0 - g(y)$. Integrating $g$ directly gives a negative number, which cannot be an area.",
    "用水平条带时，长度总是右边曲线减左边曲线。当区域在 $y$ 轴左侧时，右边曲线是 $x = 0$，所以被积函数是 $0 - g(y)$。直接积分 $g$ 会得到负数，而面积不可能为负。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const k = rng.int(1, 4);
    const g = poly([k, "y^{2}"], [-k * a * a, ""]);
    const answer = Q.of(4 * k * a ** 3, 3);
    return ask(
      [`Find the area of the region bounded by $x = ${g}$ and the $y$-axis.`, `求由 $x = ${g}$ 和 $y$ 轴围成的区域的面积。`],
      answer,
      [answer.neg(), Q.of(2 * k * a ** 3, 3), Q.of(2 * k * a ** 3)],
      [
        `The curve meets the axis at $y = \\pm ${a}$ and lies to its left. So the area is $\\int_{${-a}}^{${a}} \\left(0 - (${g})\\right) dy = ${answer.toLatex()}$.`,
        `曲线与 $y$ 轴交于 $y = \\pm ${a}$，并位于其左侧。所以面积是 $\\int_{${-a}}^{${a}} \\left(0 - (${g})\\right) dy = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const netAndTotal = point(
  "total-area-from-the-net-integral",
  ["Total area from the net integral", "由净积分求总面积"],
  [
    "When a curve crosses the axis, the integral over the whole interval is the net of the lobes, not the total area. If the lobes have areas $A$ above and $B$ below, the integral is $A - B$ and the total area is $A + B$.",
    "当曲线穿过坐标轴时，整个区间上的积分是各部分的净值，而不是总面积。如果上方部分面积为 $A$，下方部分面积为 $B$，则积分是 $A - B$，总面积是 $A + B$。",
  ],
  (rng) => {
    const p = rng.int(-9, -1);
    const m = p + rng.int(1, 5);
    const q = m + rng.int(1, 5);
    const A = rng.int(2, 24);
    const B = rng.int(1, 24);
    const I = A - B;
    return ask(
      [
        `$f > 0$ on $(${p}, ${m})$ and $f < 0$ on $(${m}, ${q})$, with $\\int_{${p}}^{${m}} f(x) \\, dx = ${A}$ and $\\int_{${p}}^{${q}} f(x) \\, dx = ${I}$. Find the total area between the graph of $f$ and the $x$-axis on $[${p}, ${q}]$.`,
        `$f$ 在 $(${p}, ${m})$ 上为正，在 $(${m}, ${q})$ 上为负，且 $\\int_{${p}}^{${m}} f(x) \\, dx = ${A}$，$\\int_{${p}}^{${q}} f(x) \\, dx = ${I}$。求 $[${p}, ${q}]$ 上 $f$ 的图像与 $x$ 轴之间的总面积。`,
      ],
      A + B,
      [Math.abs(I), A, B],
      [
        `$\\int_{${m}}^{${q}} f = ${I} - ${A} = ${-B}$, so the lower lobe has area $${B}$. The total is $${A} + ${B} = ${A + B}$.`,
        `$\\int_{${m}}^{${q}} f = ${I} - ${A} = ${-B}$，所以下方部分面积是 $${B}$。总面积是 $${A} + ${B} = ${A + B}$。`,
      ],
    );
  },
);

const heightFromVolume = point(
  "a-constant-height-from-the-volume",
  ["A constant height from the volume", "由体积求不变的高"],
  [
    "When rectangular cross sections all have the same height $h$, the volume is $\\int h \\cdot w(x) \\, dx$, which is $h$ times the area of the base. So a known volume gives the height once the base area is found by integrating.",
    "当矩形截面的高都等于 $h$ 时，体积是 $\\int h \\cdot w(x) \\, dx$，也就是 $h$ 乘以底面积。所以知道体积后，先积分求出底面积，就能得到高。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const h = rng.int(2, 9);
    const base = Q.of(4 * a ** 3, 3);
    const V = base.mul(Q.of(h));
    const f = poly([-1, "x^{2}"], [a * a, ""]);
    return ask(
      [
        `The base of a solid is the region bounded by $y = ${f}$ and the $x$-axis. Cross sections perpendicular to the $x$-axis are rectangles of the same height, and the volume is $${V.toLatex()}$. Find the height.`,
        `一个立体的底面是由 $y = ${f}$ 和 $x$ 轴围成的区域。垂直于 $x$ 轴的截面都是高相同的矩形，体积是 $${V.toLatex()}$。求这个高。`,
      ],
      h,
      [V.div(Q.of(2 * a)), V.div(Q.of(a * a)), Q.of(h).mul(base)],
      [
        `The base area is $\\int_{${-a}}^{${a}} (${f}) \\, dx = ${base.toLatex()}$. The volume is the base area times the height, so the height is $${V.toLatex()} \\div ${base.toLatex()} = ${h}$.`,
        `底面积是 $\\int_{${-a}}^{${a}} (${f}) \\, dx = ${base.toLatex()}$。体积等于底面积乘以高，所以高是 $${V.toLatex()} \\div ${base.toLatex()} = ${h}$。`,
      ],
    );
  },
);

const overCircularBase = point(
  "cross-sections-over-a-circular-base",
  ["Cross sections over a circular base", "圆形底面上的截面"],
  [
    "Over a disc of radius $r$, the chord at $x$ has length $2\\sqrt{r^{2} - x^{2}}$. The radius of the cross section is half the chord when the chord is a diameter. Semicircles on chords build a hemisphere and circles on chords build a sphere, which checks the integral.",
    "在半径为 $r$ 的圆盘上，$x$ 处的弦长是 $2\\sqrt{r^{2} - x^{2}}$。弦作为直径时，截面半径是弦长的一半。以弦为直径的半圆构成半球，以弦为直径的圆构成球，这可以检验积分的结果。",
  ],
  (rng) => {
    const r = rng.int(1, 18);
    const semi = rng.bool();
    const answer = semi ? Q.of(2 * r ** 3, 3) : Q.of(4 * r ** 3, 3);
    const shape: Pair = semi ? ["semicircles", "半圆"] : ["circles", "圆"];
    const [en, zh] = kpi(
      `The base of a solid is the disc $x^{2} + y^{2} \\le ${r * r}$. Cross sections perpendicular to the $x$-axis are ${shape[0]} whose diameters are chords of the disc. Find the volume.`,
      `一个立体的底面是圆盘 $x^{2} + y^{2} \\le ${r * r}$。垂直于 $x$ 轴的截面是以圆盘的弦为直径的${shape[1]}。求体积。`,
    );
    return ask(
      [en, zh],
      answer,
      [answer.mul(Q.of(4)), answer.div(Q.of(2)), answer.mul(Q.of(2))],
      [
        `The radius of a section is $\\sqrt{${r * r} - x^{2}}$, so its area is $${semi ? "\\frac{\\pi}{2}" : "\\pi"}(${r * r} - x^{2})$. Integrating from $${-r}$ to $${r}$ gives $${answer.toLatex()}\\pi$, which is the volume of a ${semi ? "hemisphere" : "sphere"} of radius $${r}$.`,
        `截面半径是 $\\sqrt{${r * r} - x^{2}}$，所以面积是 $${semi ? "\\frac{\\pi}{2}" : "\\pi"}(${r * r} - x^{2})$。从 $${-r}$ 到 $${r}$ 积分得 $${answer.toLatex()}\\pi$，这正是半径为 $${r}$ 的${semi ? "半球" : "球"}的体积。`,
      ],
    );
  },
);

const washerAxisOutside = point(
  "an-axis-outside-the-region-needs-washers",
  ["An axis outside the region needs washers", "轴在区域外时要用垫圈"],
  [
    "If the axis of rotation does not touch the region, each slice has a hole, so use $\\pi(R^{2} - r^{2})$ with both radii measured from the axis. Note that this is not $\\pi(R - r)^{2}$, and that shifting the axis away makes the volume larger.",
    "如果旋转轴不接触区域，每一片都有一个孔，所以用 $\\pi(R^{2} - r^{2})$，两个半径都从轴量起。注意这不是 $\\pi(R - r)^{2}$，而且把轴移远会使体积变大。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const c = rng.int(1, 6);
    const answer = Q.of(8 * a ** 5, 5).add(Q.of(8 * a ** 3 * c, 3));
    const [en, zh] = kpi(
      `The region bounded by $y = x^{2}$ and $y = ${a * a}$ is rotated about the line $y = ${-c}$. Find the volume.`,
      `由 $y = x^{2}$ 和 $y = ${a * a}$ 围成的区域绕直线 $y = ${-c}$ 旋转。求体积。`,
    );
    return ask(
      [en, zh],
      answer,
      [Q.of(16 * a ** 5, 15), Q.of(8 * a ** 5, 5), Q.of(8 * a ** 5, 5).add(Q.of(4 * a ** 3 * c, 3))],
      [
        `The outer radius is $${a * a + c}$ and the inner radius is $x^{2} + ${c}$. So $V = \\pi\\int_{${-a}}^{${a}} \\left(${(a * a + c) ** 2} - (x^{2} + ${c})^{2}\\right) dx = ${answer.toLatex()}\\pi$.`,
        `外半径是 $${a * a + c}$，内半径是 $x^{2} + ${c}$。所以 $V = \\pi\\int_{${-a}}^{${a}} \\left(${(a * a + c) ** 2} - (x^{2} + ${c})^{2}\\right) dx = ${answer.toLatex()}\\pi$。`,
      ],
    );
  },
);

const shellShiftedAxis = point(
  "shells-about-a-line-below-the-axis",
  ["Shells about a line below the axis", "绕轴下方直线的柱壳"],
  [
    "The shell radius is the distance from the axis of rotation to the strip. For rotation about $y = -c$, a strip at height $y$ has radius $y + c$, not $y$. The height of the shell is the length of the strip, which does not change.",
    "柱壳半径是旋转轴到条带的距离。绕 $y = -c$ 旋转时，高度为 $y$ 的条带半径是 $y + c$，而不是 $y$。柱壳的高是条带的长度，不会改变。",
  ],
  (rng) => {
    const b = rng.int(1, 4);
    const c = rng.int(1, 5);
    const m = rng.int(1, 4);
    const inner = (shift: number) =>
      Q.of(b ** 4, 4)
        .add(Q.of(shift * b ** 3, 3))
        .add(Q.of(m * b * b, 2))
        .add(Q.of(m * shift * b));
    const answer = inner(c).mul(Q.of(2));
    const g = poly([1, "y^{2}"], [m, ""]);
    const [en, zh] = kpi(
      `The region bounded by $x = ${g}$, the $y$-axis, $y = 0$ and $y = ${b}$ is rotated about the line $y = ${-c}$. Find the volume using shells.`,
      `由 $x = ${g}$、$y$ 轴、$y = 0$ 和 $y = ${b}$ 围成的区域绕直线 $y = ${-c}$ 旋转。用柱壳法求体积。`,
    );
    return ask(
      [en, zh],
      answer,
      [inner(0).mul(Q.of(2)), inner(c), inner(-c).mul(Q.of(2))],
      [
        `A shell at height $y$ has radius $y + ${c}$ and length $${g}$. Multiply out and integrate:${steps(`V = 2\\pi\\int_{0}^{${b}} (y + ${c})(${g}) \\, dy = 2\\pi\\left[\\frac{y^{4}}{4} + \\frac{${c}y^{3}}{3} + \\frac{${m}y^{2}}{2} + ${m * c}y\\right]_{0}^{${b}} = ${answer.toLatex()}\\pi`)}`,
        `高度 $y$ 处的柱壳半径是 $y + ${c}$，长度是 $${g}$。展开后积分：${steps(`V = 2\\pi\\int_{0}^{${b}} (y + ${c})(${g}) \\, dy = 2\\pi\\left[\\frac{y^{4}}{4} + \\frac{${c}y^{3}}{3} + \\frac{${m}y^{2}}{2} + ${m * c}y\\right]_{0}^{${b}} = ${answer.toLatex()}\\pi`)}`,
      ],
    );
  },
);

const shellAxisAbove = point(
  "shells-between-curves-about-a-line-above",
  ["Shells between curves about a line above", "两曲线之间绕上方直线的柱壳"],
  [
    "For an axis above the region at $y = H$, the shell radius is $H - y$, which is positive throughout. The strip length is still right curve minus left curve. Using $y$ or $y - H$ as the radius is the common mistake.",
    "当旋转轴 $y = H$ 在区域上方时，柱壳半径是 $H - y$，处处为正。条带长度仍是右边曲线减左边曲线。把 $y$ 或 $y - H$ 当作半径是常见的错误。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const H = a + rng.int(0, 5);
    const value = (sign: number) => Q.of(H * a ** 3, 3).add(Q.of(sign * a ** 4, 6));
    const answer = value(-1);
    const [en, zh] = kpi(
      `The region bounded by $x = y^{2}$ and $x = ${a === 1 ? "" : a}y$ is rotated about the line $y = ${H}$. Find the volume.`,
      `由 $x = y^{2}$ 和 $x = ${a === 1 ? "" : a}y$ 围成的区域绕直线 $y = ${H}$ 旋转。求体积。`,
    );
    const strip = `${a === 1 ? "" : a}y - y^{2}`;
    return ask(
      [en, zh],
      answer,
      [Q.of(a ** 4, 6), value(1), Q.of(H * a ** 3, 3)],
      [
        `The curves meet at $y = 0$ and $y = ${a}$. So $V = 2\\pi\\int_{0}^{${a}} (${H} - y)(${strip}) \\, dy = ${answer.toLatex()}\\pi$.`,
        `两曲线交于 $y = 0$ 和 $y = ${a}$。所以 $V = 2\\pi\\int_{0}^{${a}} (${H} - y)(${strip}) \\, dy = ${answer.toLatex()}\\pi$。`,
      ],
    );
  },
);

const coneLength = point(
  "the-length-of-a-segment-from-its-surface-area",
  ["The length of a segment from its surface area", "由表面积求线段的范围"],
  [
    "Rotating $y = \\frac{p}{q}x$ about the $x$-axis gives a cone, so $S = 2\\pi\\int y\\sqrt{1 + y'^{2}} \\, dx$ can be checked against $\\pi r \\ell$. For the reverse question, write $S$ in terms of the upper limit and solve for it.",
    "把 $y = \\frac{p}{q}x$ 绕 $x$ 轴旋转得到圆锥，所以 $S = 2\\pi\\int y\\sqrt{1 + y'^{2}} \\, dx$ 可以用 $\\pi r \\ell$ 检验。对于逆问题，把 $S$ 用上限表示，再解出上限。",
  ],
  (rng) => {
    const [p, q, h] = rng.pick(triples);
    const s = rng.int(1, 9);
    const area = p * h * s * s;
    const slope = Q.of(p, q).toLatex();
    return ask(
      [
        `The curve $y = ${slope}x$, $0 \\le x \\le b$, is rotated about the $x$-axis, and the surface has area $${area}\\pi$. Find $b$.`,
        `曲线 $y = ${slope}x$，$0 \\le x \\le b$，绕 $x$ 轴旋转，所得曲面的面积是 $${area}\\pi$。求 $b$。`,
      ],
      q * s,
      [s, h * s, p * s],
      [
        `$\\sqrt{1 + y'^{2}} = \\frac{${h}}{${q}}$, so $S = 2\\pi\\int_{0}^{b} ${slope}x \\cdot \\frac{${h}}{${q}} \\, dx = \\frac{${p * h}\\pi b^{2}}{${q * q}}$. Setting this to $${area}\\pi$ gives $b^{2} = ${(q * s) ** 2}$, so $b = ${q * s}$.`,
        `$\\sqrt{1 + y'^{2}} = \\frac{${h}}{${q}}$，所以 $S = 2\\pi\\int_{0}^{b} ${slope}x \\cdot \\frac{${h}}{${q}} \\, dx = \\frac{${p * h}\\pi b^{2}}{${q * q}}$。令它等于 $${area}\\pi$，得 $b^{2} = ${(q * s) ** 2}$，所以 $b = ${q * s}$。`,
      ],
    );
  },
);

const bothAxes = point(
  "the-same-curve-about-the-other-axis",
  ["The same curve about the other axis", "同一曲线绕另一轴旋转"],
  [
    "The arc length element is the same for both rotations; only the radius changes. Around the $x$-axis the radius is $y$, and around the $y$-axis it is $x$. So the same segment gives a different surface area, and it is the wrong radius that causes most errors.",
    "两种旋转的弧长元素相同，只有半径不同。绕 $x$ 轴时半径是 $y$，绕 $y$ 轴时半径是 $x$。所以同一线段得到不同的表面积，大多数错误都出在半径用错。",
  ],
  (rng) => {
    const [p, q, h] = rng.pick(triples);
    const s = rng.int(1, 9);
    const xArea = p * h * s * s;
    const answer = q * h * s * s;
    const slope = Q.of(p, q).toLatex();
    const [en, zh] = kpi(
      `Rotating $y = ${slope}x$, $0 \\le x \\le ${q * s}$, about the $x$-axis gives a surface of area $${xArea}\\pi$. Find the area when the same segment is rotated about the $y$-axis.`,
      `把 $y = ${slope}x$，$0 \\le x \\le ${q * s}$，绕 $x$ 轴旋转，得到面积为 $${xArea}\\pi$ 的曲面。求同一线段绕 $y$ 轴旋转所得的面积。`,
    );
    return ask(
      [en, zh],
      answer,
      [xArea, h * h * s * s, p * q * s * s],
      [
        `The segment has length $${h * s}$. Around the $y$-axis the cone has base radius $${q * s}$, so the area is $\\pi \\cdot ${q * s} \\cdot ${h * s} = ${answer}\\pi$.`,
        `线段长 $${h * s}$。绕 $y$ 轴旋转时，圆锥底面半径是 $${q * s}$，所以面积是 $\\pi \\cdot ${q * s} \\cdot ${h * s} = ${answer}\\pi$。`,
      ],
    );
  },
);

const totalDistance = point(
  "distance-travelled-when-the-particle-turns-back",
  ["Distance travelled when the particle turns back", "质点折返时的路程"],
  [
    "Displacement is $\\int v \\, dt$, but distance is $\\int |v| \\, dt$. When the velocity changes sign, split the integral at that time and add the absolute values, since the two parts of a return trip would otherwise cancel.",
    "位移是 $\\int v \\, dt$，而路程是 $\\int |v| \\, dt$。速度变号时，要在那个时刻把积分分开，并把绝对值相加，否则往返的两段会相互抵消。",
  ],
  (rng) => {
    const k = nz(rng, 6);
    const r = rng.int(1, 8);
    const T = r + rng.int(1, 8);
    const answer = Q.of(Math.abs(k) * (r * r + (T - r) ** 2), 2);
    const net = Q.of(k * (T * T - 2 * r * T), 2);
    return ask(
      [
        `A particle has velocity $v(t) = ${linear(k, -k * r).replace(/x/g, "t")}$ meters per second. Find the distance it travels from $t = 0$ to $t = ${T}$, in meters.`,
        `质点的速度是 $v(t) = ${linear(k, -k * r).replace(/x/g, "t")}$ 米每秒。求它从 $t = 0$ 到 $t = ${T}$ 走过的路程，单位是米。`,
      ],
      answer,
      [net, net.abs(), Q.of(Math.abs(k) * T * T, 2)],
      [
        `$v$ changes sign at $t = ${r}$. The two triangles have areas $${Q.of(Math.abs(k) * r * r, 2).toLatex()}$ and $${Q.of(Math.abs(k) * (T - r) ** 2, 2).toLatex()}$, and their sum is $${answer.toLatex()}$.`,
        `$v$ 在 $t = ${r}$ 处变号。两个三角形的面积是 $${Q.of(Math.abs(k) * r * r, 2).toLatex()}$ 和 $${Q.of(Math.abs(k) * (T - r) ** 2, 2).toLatex()}$，它们的和是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const initialVelocityFromPositions = point(
  "the-initial-velocity-from-two-positions",
  ["The initial velocity from two positions", "由两个位置求初速度"],
  [
    "Sometimes the initial velocity is not given and two positions are. Integrate twice to get $s(t) = s(0) + v_{0}t + \\frac{1}{2}at^{2}$ for constant acceleration, then use the second position to find $v_{0}$. It is not the average velocity.",
    "有时不给初速度，而是给两个位置。对恒定加速度积分两次得 $s(t) = s(0) + v_{0}t + \\frac{1}{2}at^{2}$，再用第二个位置求 $v_{0}$。它并不等于平均速度。",
  ],
  (rng) => {
    const k = nz(rng, 8);
    const T = rng.int(2, 6);
    const v0 = rng.int(-9, 9);
    const s0 = rng.int(-9, 9);
    const sT = Q.of(s0 + v0 * T).add(Q.of(k * T * T, 2));
    const avg = sT.sub(Q.of(s0)).div(Q.of(T));
    const half = Q.of(k * T, 2);
    return ask(
      [
        `A particle has constant acceleration $${k}$ meters per second squared, with $s(0) = ${s0}$ and $s(${T}) = ${sT.toLatex()}$. Find its velocity at $t = 0$, in meters per second.`,
        `质点的加速度恒为 $${k}$ 米每二次方秒，且 $s(0) = ${s0}$，$s(${T}) = ${sT.toLatex()}$。求它在 $t = 0$ 时的速度，单位是米每秒。`,
      ],
      v0,
      [avg, avg.add(half), Q.of(k * T)],
      [
        `$s(${T}) = ${s0} + ${T}v_{0} + \\frac{1}{2} \\cdot ${paren(k)} \\cdot ${T}^{2}$. The acceleration contributes $${Q.of(k * T * T, 2).toLatex()}$, so $${T}v_{0} = ${Q.of(v0 * T).toLatex()}$ and $v_{0} = ${v0}$.`,
        `$s(${T}) = ${s0} + ${T}v_{0} + \\frac{1}{2} \\cdot ${paren(k)} \\cdot ${T}^{2}$。加速度贡献 $${Q.of(k * T * T, 2).toLatex()}$，所以 $${T}v_{0} = ${Q.of(v0 * T).toLatex()}$，$v_{0} = ${v0}$。`,
      ],
    );
  },
);

const astroidSurface = point(
  "surfaces-from-an-astroid",
  ["Surfaces from an astroid", "星形线旋转所得的曲面"],
  [
    "The astroid $x = a\\cos^{3}t$, $y = a\\sin^{3}t$ has speed $3a|\\sin t\\cos t|$. The absolute value matters: beyond $t = \\frac{\\pi}{2}$ the factor $\\cos t$ is negative, and ignoring this makes the integral over the upper half cancel to zero.",
    "星形线 $x = a\\cos^{3}t$，$y = a\\sin^{3}t$ 的速率是 $3a|\\sin t\\cos t|$。绝对值很重要：$t$ 超过 $\\frac{\\pi}{2}$ 后 $\\cos t$ 为负，忽略这一点会使上半部分的积分抵消为零。",
  ],
  (rng) => {
    const a = rng.int(1, 20);
    const kind = rng.pick(["x", "y", "half"] as const);
    const answer = kind === "half" ? Q.of(12 * a * a, 5) : Q.of(6 * a * a, 5);
    const axis = kind === "y" ? "y" : "x";
    const top = kind === "half" ? "\\pi" : "\\frac{\\pi}{2}";
    const radius = kind === "y" ? `${a === 1 ? "" : a}\\cos^{3}t` : `${a === 1 ? "" : a}\\sin^{3}t`;
    const [en, zh] = kpi(
      `Find the area of the surface obtained by rotating $x = ${a === 1 ? "" : a}\\cos^{3}t, \\; y = ${a === 1 ? "" : a}\\sin^{3}t$, $0 \\le t \\le ${top}$, about the $${axis}$-axis.`,
      `求曲线 $x = ${a === 1 ? "" : a}\\cos^{3}t, \\; y = ${a === 1 ? "" : a}\\sin^{3}t$，$0 \\le t \\le ${top}$，绕 $${axis}$ 轴旋转所得曲面的面积。`,
    );
    return ask(
      [en, zh],
      answer,
      kind === "half" ? [0, Q.of(6 * a * a, 5), Q.of(3 * a * a, 5)] : [Q.of(3 * a * a, 5), Q.of(12 * a * a, 5), Q.of(a * a)],
      [
        `The radius is $${radius}$ and the speed is $${3 * a}|\\sin t\\cos t|$. Integrating $2\\pi$ times their product gives $${answer.toLatex()}\\pi$${kind === "half" ? ", which is twice the first quadrant value because of the absolute value" : ""}.`,
        `半径是 $${radius}$，速率是 $${3 * a}|\\sin t\\cos t|$。对它们的积乘 $2\\pi$ 积分，得 $${answer.toLatex()}\\pi$${kind === "half" ? "。因为有绝对值，这是第一象限部分的两倍" : ""}。`,
      ],
    );
  },
);

const netDisplacementVector = point(
  "the-size-of-a-displacement-vector",
  ["The size of a displacement vector", "位移向量的大小"],
  [
    "Integrating a velocity vector gives the displacement vector, component by component, and the distance between the start and end is its length. Do not confuse this with the speed at the final time, or add the absolute values of the components.",
    "对速度向量逐分量积分得到位移向量，起点与终点之间的距离就是它的长度。不要把它与终点时刻的速率混淆，也不要把各分量的绝对值相加。",
  ],
  (rng) => {
    const [p0, q0, h] = rng.pick(triples);
    const p = rng.bool() ? p0 : -p0;
    const q = rng.bool() ? q0 : -q0;
    const T = rng.int(1, 8);
    const answer = h * T * T;
    const v = `\\left\\langle ${2 * p}t, ${2 * q}t \\right\\rangle`;
    return ask(
      [
        `A particle has velocity $\\mathbf{v}(t) = ${v}$. How far is it at $t = ${T}$ from its position at $t = 0$?`,
        `质点的速度是 $\\mathbf{v}(t) = ${v}$。$t = ${T}$ 时它离 $t = 0$ 时的位置有多远？`,
      ],
      answer,
      [2 * h * T, (p0 + q0) * T * T, h * T],
      [
        `The displacement is $\\int_{0}^{${T}} \\mathbf{v} \\, dt = \\left\\langle ${p * T * T}, ${q * T * T} \\right\\rangle$, and its length is $\\sqrt{${(p * T * T) ** 2} + ${(q * T * T) ** 2}} = ${answer}$.`,
        `位移是 $\\int_{0}^{${T}} \\mathbf{v} \\, dt = \\left\\langle ${p * T * T}, ${q * T * T} \\right\\rangle$，它的长度是 $\\sqrt{${(p * T * T) ** 2} + ${(q * T * T) ** 2}} = ${answer}$。`,
      ],
    );
  },
);

const speedFromDot = point(
  "speed-changes-from-the-dot-product",
  ["Speed changes from the dot product", "由点积判断速率变化"],
  [
    "The rate of change of speed has the sign of $\\mathbf{v} \\cdot \\mathbf{a}$. A positive dot product means speeding up, a negative one means slowing down, and at zero the acceleration is perpendicular to the velocity, so it only turns the particle at that moment.",
    "速率变化率的符号与 $\\mathbf{v} \\cdot \\mathbf{a}$ 相同。点积为正表示加速，为负表示减速；点积为零时，加速度与速度垂直，此刻只使质点转向。",
  ],
  (rng) => {
    const A = nz(rng, 4);
    const B = nz(rng, 6);
    const C = nz(rng, 4);
    const D = nz(rng, 6);
    const T = rng.int(1, 4);
    const vx = 2 * A * T + B;
    const vy = 2 * C * T + D;
    const ax = 2 * A;
    const ay = 2 * C;
    const dot = vx * ax + vy * ay;
    const r = `\\left\\langle ${poly([A, "t^{2}"], [B, "t"])}, ${poly([C, "t^{2}"], [D, "t"])} \\right\\rangle`;
    const up: Pair = [`It is speeding up`, `它在加速`];
    const down: Pair = [`It is slowing down`, `它在减速`];
    const still: Pair = [`Its speed is momentarily not changing`, `它的速率此刻没有变化`];
    const allOf = [up, down, still];
    const correct = dot > 0 ? up : dot < 0 ? down : still;
    return choose(
      rng,
      [
        `A particle has position $\\mathbf{r}(t) = ${r}$. What is happening to its speed at $t = ${T}$?`,
        `质点的位置是 $\\mathbf{r}(t) = ${r}$。在 $t = ${T}$ 时它的速率如何变化？`,
      ],
      correct,
      allOf.filter((o) => o !== correct),
      [
        `$\\mathbf{v}(${T}) = \\left\\langle ${vx}, ${vy} \\right\\rangle$ and $\\mathbf{a} = \\left\\langle ${ax}, ${ay} \\right\\rangle$, so $\\mathbf{v} \\cdot \\mathbf{a} = ${dot}$. ${dot > 0 ? "This is positive, so the speed is increasing." : dot < 0 ? "This is negative, so the speed is decreasing." : "This is zero, so the acceleration is perpendicular to the velocity and the speed is not changing at this moment."}`,
        `$\\mathbf{v}(${T}) = \\left\\langle ${vx}, ${vy} \\right\\rangle$，$\\mathbf{a} = \\left\\langle ${ax}, ${ay} \\right\\rangle$，所以 $\\mathbf{v} \\cdot \\mathbf{a} = ${dot}$。${dot > 0 ? "它是正的，所以速率在增大。" : dot < 0 ? "它是负的，所以速率在减小。" : "它是零，所以加速度与速度垂直，此刻速率没有变化。"}`,
      ],
    );
  },
);

const slopeFromValues = point(
  "the-slope-from-values-of-r-and-its-derivative",
  ["The slope from values of r and its derivative", "由 r 及其导数的值求斜率"],
  [
    "At $\\theta = 0$ and $\\theta = \\pi$ the slope of a polar curve is $\\frac{r}{r'}$, and at $\\theta = \\frac{\\pi}{2}$ and $\\theta = \\frac{3\\pi}{2}$ it is $-\\frac{r'}{r}$. The value of $r'$ alone is not the slope, because $r'$ measures change in distance from the pole.",
    "在 $\\theta = 0$ 和 $\\theta = \\pi$ 处，极坐标曲线的斜率是 $\\frac{r}{r'}$；在 $\\theta = \\frac{\\pi}{2}$ 和 $\\theta = \\frac{3\\pi}{2}$ 处，斜率是 $-\\frac{r'}{r}$。单独的 $r'$ 不是斜率，因为 $r'$ 度量的是到极点距离的变化。",
  ],
  (rng) => {
    const turn = rng.pick(quarterTurns);
    const r = nz(rng, 9);
    const d = nz(rng, 9);
    const answer = turn.swap ? Q.of(-d, r) : Q.of(r, d);
    return ask(
      [
        `A polar curve $r = f(\\theta)$ has $f\\left(${turn.at}\\right) = ${r}$ and $f'\\left(${turn.at}\\right) = ${d}$. Find the slope $\\frac{dy}{dx}$ of the curve at $\\theta = ${turn.at}$.`,
        `极坐标曲线 $r = f(\\theta)$ 满足 $f\\left(${turn.at}\\right) = ${r}$，$f'\\left(${turn.at}\\right) = ${d}$。求曲线在 $\\theta = ${turn.at}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ],
      answer,
      [d, turn.swap ? Q.of(r, d) : Q.of(-d, r), answer.neg()],
      [
        `Use $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta$ and $\\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta$ at this angle. The quotient simplifies to $${turn.swap ? "-\\frac{r'}{r}" : "\\frac{r}{r'}"} = ${answer.toLatex()}$.`,
        `在这个角度上用 $\\frac{dx}{d\\theta} = r'\\cos\\theta - r\\sin\\theta$ 和 $\\frac{dy}{d\\theta} = r'\\sin\\theta + r\\cos\\theta$。商化简为 $${turn.swap ? "-\\frac{r'}{r}" : "\\frac{r}{r'}"} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** diagonalTurns are the odd multiples of a quarter of pi, marked by whether r' and r combine as a quotient with the sum on top. */
const diagonalTurns = [
  { at: "\\frac{\\pi}{4}", sumOnTop: true },
  { at: "\\frac{3\\pi}{4}", sumOnTop: false },
  { at: "\\frac{5\\pi}{4}", sumOnTop: true },
  { at: "\\frac{7\\pi}{4}", sumOnTop: false },
] as const;

const diagonalSlopeFromValues = point(
  "diagonal-slopes-from-values-of-r-and-its-derivative",
  ["Diagonal slopes from values of r and its derivative", "由 r 及其导数的值求对角方向的斜率"],
  [
    "At odd multiples of $\\frac{\\pi}{4}$ the sine and cosine have equal size, so the factor $\\frac{\\sqrt{2}}{2}$ cancels and the slope is a rational function of $r$ and $r'$. Whether the sum or the difference is on top depends on the quadrant.",
    "在 $\\frac{\\pi}{4}$ 的奇数倍处，正弦和余弦大小相等，所以因子 $\\frac{\\sqrt{2}}{2}$ 被约去，斜率是 $r$ 和 $r'$ 的有理式。分子是和还是差，取决于象限。",
  ],
  (rng) => {
    const turn = rng.pick(diagonalTurns);
    const r = rng.int(1, 9) * rng.pick([-1, 1]);
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== Math.abs(r));
    const d = rng.pick(options) * rng.pick([-1, 1]);
    const answer = turn.sumOnTop ? Q.of(d + r, d - r) : Q.of(r - d, r + d);
    const other = turn.sumOnTop ? Q.of(r - d, r + d) : Q.of(d + r, d - r);
    return ask(
      [
        `A polar curve $r = f(\\theta)$ has $f\\left(${turn.at}\\right) = ${r}$ and $f'\\left(${turn.at}\\right) = ${d}$. Find the slope $\\frac{dy}{dx}$ of the curve at $\\theta = ${turn.at}$.`,
        `极坐标曲线 $r = f(\\theta)$ 满足 $f\\left(${turn.at}\\right) = ${r}$，$f'\\left(${turn.at}\\right) = ${d}$。求曲线在 $\\theta = ${turn.at}$ 处的斜率 $\\frac{dy}{dx}$。`,
      ],
      answer,
      [other, answer.neg(), d],
      [
        `The factor $\\frac{\\sqrt{2}}{2}$ cancels in $\\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}$, leaving $${turn.sumOnTop ? "\\frac{r' + r}{r' - r}" : "\\frac{r - r'}{r + r'}"} = ${answer.toLatex()}$.`,
        `在 $\\frac{r'\\sin\\theta + r\\cos\\theta}{r'\\cos\\theta - r\\sin\\theta}$ 中，因子 $\\frac{\\sqrt{2}}{2}$ 被约去，得 $${turn.sumOnTop ? "\\frac{r' + r}{r' - r}" : "\\frac{r - r'}{r + r'}"} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** zeroDerivativeTurns are the angles at which a polar curve with r' = 0 is examined, with the tangent type there. */
const zeroDerivativeTurns = [
  { at: "0", kind: "vertical" },
  { at: "\\pi", kind: "vertical" },
  { at: "\\frac{\\pi}{2}", kind: "horizontal" },
  { at: "\\frac{3\\pi}{2}", kind: "horizontal" },
  { at: "\\frac{\\pi}{4}", kind: "slanted" },
  { at: "\\frac{3\\pi}{4}", kind: "slanted" },
] as const;

const zeroRadialDerivative = point(
  "dr-zero-does-not-mean-a-horizontal-tangent",
  ["A zero of dr does not mean a horizontal tangent", "dr 为零并不意味着水平切线"],
  [
    "Where $r' = 0$ and $r \\ne 0$, the curve is momentarily at a constant distance from the pole, so the tangent is perpendicular to the radius. Its direction therefore depends on $\\theta$: vertical on the $x$-axis, horizontal on the $y$-axis, and slanted in between.",
    "当 $r' = 0$ 且 $r \\ne 0$ 时，曲线此刻到极点的距离不变，所以切线垂直于半径。因此切线方向取决于 $\\theta$：在 $x$ 轴上是竖直的，在 $y$ 轴上是水平的，在其他方向是倾斜的。",
  ],
  (rng) => {
    const turn = rng.pick(zeroDerivativeTurns);
    const r = nz(rng, 12);
    const horizontal: Pair = ["Horizontal", "水平"];
    const vertical: Pair = ["Vertical", "竖直"];
    const slanted: Pair = ["Neither horizontal nor vertical", "既不水平也不竖直"];
    const none: Pair = ["There is no tangent, because $r'$ is zero", "没有切线，因为 $r'$ 为零"];
    const correct = turn.kind === "horizontal" ? horizontal : turn.kind === "vertical" ? vertical : slanted;
    return choose(
      rng,
      [
        `A polar curve $r = f(\\theta)$ has $f\\left(${turn.at}\\right) = ${r}$ and $f'\\left(${turn.at}\\right) = 0$. What is the tangent line to the curve at $\\theta = ${turn.at}$ like?`,
        `极坐标曲线 $r = f(\\theta)$ 满足 $f\\left(${turn.at}\\right) = ${r}$，$f'\\left(${turn.at}\\right) = 0$。曲线在 $\\theta = ${turn.at}$ 处的切线是怎样的？`,
      ],
      correct,
      [horizontal, vertical, slanted, none].filter((o) => o !== correct),
      [
        `With $r' = 0$, $\\frac{dx}{d\\theta} = -r\\sin\\theta$ and $\\frac{dy}{d\\theta} = r\\cos\\theta$. At this angle, ${turn.kind === "horizontal" ? "$\\frac{dy}{d\\theta} = 0$ and $\\frac{dx}{d\\theta} \\ne 0$, so the tangent is horizontal" : turn.kind === "vertical" ? "$\\frac{dx}{d\\theta} = 0$ and $\\frac{dy}{d\\theta} \\ne 0$, so the tangent is vertical" : "neither is zero, so the tangent is slanted"}.`,
        `当 $r' = 0$ 时，$\\frac{dx}{d\\theta} = -r\\sin\\theta$，$\\frac{dy}{d\\theta} = r\\cos\\theta$。在这个角度上，${turn.kind === "horizontal" ? "$\\frac{dy}{d\\theta} = 0$ 而 $\\frac{dx}{d\\theta} \\ne 0$，所以切线水平" : turn.kind === "vertical" ? "$\\frac{dx}{d\\theta} = 0$ 而 $\\frac{dy}{d\\theta} \\ne 0$，所以切线竖直" : "二者都不为零，所以切线是倾斜的"}。`,
      ],
    );
  },
);

const roseTangentsAtPole = point(
  "counting-the-tangent-lines-at-the-pole",
  ["Counting the tangent lines at the pole", "数极点处的切线"],
  [
    "A polar curve passing through the pole at $\\theta = \\alpha$ has tangent line $\\theta = \\alpha$ there. A rose $r = a\\cos n\\theta$ or $r = a\\sin n\\theta$ has $n$ such angles in $[0, \\pi)$, and larger angles repeat the same lines, even when $n$ is even and there are $2n$ petals.",
    "极坐标曲线在 $\\theta = \\alpha$ 处经过极点时，那里的切线是 $\\theta = \\alpha$。玫瑰线 $r = a\\cos n\\theta$ 或 $r = a\\sin n\\theta$ 在 $[0, \\pi)$ 中有 $n$ 个这样的角，更大的角只是重复相同的直线，即使 $n$ 为偶数、有 $2n$ 个花瓣也是如此。",
  ],
  (rng) => {
    const n = rng.int(2, 9);
    const a = rng.int(1, 9);
    const fn = rng.pick(["\\cos", "\\sin"] as const);
    const eq = `r = ${a === 1 ? "" : a}${fn} ${n}\\theta`;
    return ask(
      [`How many different lines are tangent to the rose $${eq}$ at the pole?`, `玫瑰线 $${eq}$ 在极点处有多少条不同的切线？`],
      n,
      [2 * n, n + 1, n - 1],
      [
        `$r = 0$ when $${fn} ${n}\\theta = 0$, which has $${n}$ solutions in $[0, \\pi)$, spaced $\\frac{\\pi}{${n}}$ apart. Angles that differ by $\\pi$ give the same line, so there are $${n}$ tangent lines.`,
        `当 $${fn} ${n}\\theta = 0$ 时 $r = 0$，它在 $[0, \\pi)$ 中有 $${n}$ 个解，间隔 $\\frac{\\pi}{${n}}$。相差 $\\pi$ 的角给出同一条直线，所以有 $${n}$ 条切线。`,
      ],
    );
  },
);

const parameterFromTangentSlope = point(
  "a-parameter-from-a-tangent-or-normal-slope",
  ["A parameter from a tangent or normal slope", "由切线或法线的斜率求参数"],
  [
    "The reverse of finding a tangent: for $r = a + b\\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$, we have $r = a$ and $r' = -b$, so the slope of the tangent is $\\frac{b}{a}$. A normal has the negative reciprocal slope, so convert it before solving.",
    "这是求切线的逆问题：对 $r = a + b\\cos\\theta$，在 $\\theta = \\frac{\\pi}{2}$ 处有 $r = a$，$r' = -b$，所以切线斜率是 $\\frac{b}{a}$。法线的斜率是它的负倒数，所以求解前要先换算。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const b = nz(rng, 12);
    const normal = rng.bool();
    const given = normal ? Q.of(-a, b) : Q.of(b, a);
    const line: Pair = normal ? ["normal", "法线"] : ["tangent", "切线"];
    return ask(
      [
        `The ${line[0]} line to the polar curve $r = ${a} + b\\cos\\theta$ at $\\theta = \\frac{\\pi}{2}$ has slope $${given.toLatex()}$. Find $b$.`,
        `极坐标曲线 $r = ${a} + b\\cos\\theta$ 在 $\\theta = \\frac{\\pi}{2}$ 处的${line[1]}斜率是 $${given.toLatex()}$。求 $b$。`,
      ],
      b,
      [-b, given.mul(Q.of(a)).neg(), normal ? given.mul(Q.of(a)) : Q.of(a).div(given)],
      [
        `At this angle $r = ${a}$ and $r' = -b$, so the tangent has slope $\\frac{b}{${a}}$.${normal ? ` The normal slope $${given.toLatex()}$ means the tangent slope is $${Q.of(b, a).toLatex()}$.` : ""} So $b = ${b}$.`,
        `在这个角度上 $r = ${a}$，$r' = -b$，所以切线斜率是 $\\frac{b}{${a}}$。${normal ? `法线斜率 $${given.toLatex()}$ 说明切线斜率是 $${Q.of(b, a).toLatex()}$。` : ""}所以 $b = ${b}$。`,
      ],
    );
  },
);

const commonRegion = point(
  "the-region-common-to-two-circles",
  ["The region common to two circles", "两圆的公共区域"],
  [
    "For the region inside both curves, use whichever $r$ is smaller at each angle, so the integral splits at the intersection. Inside $r = 2a\\cos\\theta$ and $r = 2a\\sin\\theta$ the sine bounds $\\left[0, \\frac{\\pi}{4}\\right]$ and the cosine bounds $\\left[\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right]$.",
    "对于同时在两条曲线内部的区域，每个角度都取较小的 $r$，所以积分要在交点处分开。在 $r = 2a\\cos\\theta$ 和 $r = 2a\\sin\\theta$ 的内部，$\\left[0, \\frac{\\pi}{4}\\right]$ 上由正弦界定，$\\left[\\frac{\\pi}{4}, \\frac{\\pi}{2}\\right]$ 上由余弦界定。",
  ],
  (rng) => {
    const a = rng.int(1, 30);
    const s = a * a;
    const c = s === 1 ? "" : `${s}`;
    return choose(
      rng,
      [
        `Find the area of the region inside both $r = ${2 * a}\\cos\\theta$ and $r = ${2 * a}\\sin\\theta$.`,
        `求同时在 $r = ${2 * a}\\cos\\theta$ 和 $r = ${2 * a}\\sin\\theta$ 内部的区域的面积。`,
      ],
      same2(`${c}\\left(\\frac{\\pi}{2} - 1\\right)`),
      [same2(`${c}\\left(\\pi - 2\\right)`), same2(`${c}\\left(\\frac{\\pi}{4} - \\frac{1}{2}\\right)`), same2(poly([Q.of(s, 2), "\\pi"]))],
      [
        `The curves meet at $\\theta = \\frac{\\pi}{4}$, and by symmetry the area is $2 \\cdot \\frac{1}{2}\\int_{0}^{\\pi/4} (${2 * a}\\sin\\theta)^{2} \\, d\\theta = ${c}\\left(\\frac{\\pi}{2} - 1\\right)$.`,
        `两曲线交于 $\\theta = \\frac{\\pi}{4}$，由对称性，面积是 $2 \\cdot \\frac{1}{2}\\int_{0}^{\\pi/4} (${2 * a}\\sin\\theta)^{2} \\, d\\theta = ${c}\\left(\\frac{\\pi}{2} - 1\\right)$。`,
      ],
    );
  },
);

const recursiveLimit = point(
  "limits-of-sequences-defined-by-a-recurrence",
  ["Limits of sequences defined by a recurrence", "由递推式定义的数列的极限"],
  [
    "The recurrence $a_{n+1} = ra_{n} + b$ with $|r| < 1$ has the solution $a_{n} = L + r^{n}(a_{0} - L)$, where $L = \\frac{b}{1 - r}$. Since $r^{n} \\to 0$, the sequence converges to $L$, and the starting value does not affect the limit.",
    "递推式 $a_{n+1} = ra_{n} + b$（$|r| < 1$）的解是 $a_{n} = L + r^{n}(a_{0} - L)$，其中 $L = \\frac{b}{1 - r}$。因为 $r^{n} \\to 0$，数列收敛到 $L$，而初值不影响极限。",
  ],
  (rng) => {
    const q = rng.int(2, 9);
    const p = rng.pick([...Array(2 * q - 1).keys()].map((i) => i - q + 1).filter((i) => i !== 0));
    const r = Q.of(p, q);
    const b = nz(rng, 12);
    const a0 = rng.int(-9, 9);
    const L = Q.of(b).div(Q.one.sub(r));
    const step = poly([r, "a_{n}"], [b, ""]);
    return ask(
      [
        `A sequence has $a_{0} = ${a0}$ and $a_{n+1} = ${step}$. Find $\\lim_{n \\to \\infty} a_{n}$.`,
        `数列满足 $a_{0} = ${a0}$，$a_{n+1} = ${step}$。求 $\\lim_{n \\to \\infty} a_{n}$。`,
      ],
      L,
      [a0, b, Q.of(b).div(Q.one.add(r))],
      [
        `The ratio has size less than $1$, so the sequence converges. Its limit $L$ satisfies $L = ${poly([r, "L"], [b, ""])}$, which gives $L = ${L.toLatex()}$, whatever the value of $a_{0}$.`,
        `比的绝对值小于 $1$，所以数列收敛。极限 $L$ 满足 $L = ${poly([r, "L"], [b, ""])}$，解得 $L = ${L.toLatex()}$，与 $a_{0}$ 的值无关。`,
      ],
    );
  },
);

const factorialAgainstPowers = point(
  "factorials-against-powers-of-n",
  ["Factorials against powers of n", "阶乘与 n 的幂比较"],
  [
    "Factorials beat fixed exponentials, but $n^{n}$ beats factorials: $\\frac{n!}{n^{n}} \\le \\frac{1}{n}$, since each of the other factors is at most $1$. And $\\frac{(n + k)!}{n!}$ is a polynomial of degree $k$, so it can be compared directly with $n^{k}$.",
    "阶乘超过固定底数的指数函数，但 $n^{n}$ 超过阶乘：$\\frac{n!}{n^{n}} \\le \\frac{1}{n}$，因为其余每个因子都不超过 $1$。而 $\\frac{(n + k)!}{n!}$ 是 $k$ 次多项式，可以直接与 $n^{k}$ 比较。",
  ],
  (rng) => {
    const c = rng.int(2, 9) * rng.pick([-1, 1]);
    const kind = rng.pick(["over-nn", "over-exp", "shift", "power"] as const);
    const a = rng.int(2, 9);
    const k = rng.int(1, 4);
    const expr = {
      "over-nn": `\\frac{${c} \\cdot n!}{n^{n}}`,
      "over-exp": `\\frac{${c} \\cdot n!}{${a}^{n}}`,
      shift: `\\frac{${c} \\cdot (n + ${k})!}{n! \\, n^{${k}}}`,
      power: `\\frac{${c}n^{${a}}}{n!}`,
    }[kind];
    const inf = c > 0 ? "\\infty" : "-\\infty";
    const answer = kind === "shift" ? `${c}` : kind === "over-exp" ? inf : "0";
    const opts = ["0", `${c}`, inf, "1"].filter((o) => o !== answer).slice(0, 3);
    const whyEn = {
      "over-nn": `$\\frac{n!}{n^{n}} \\le \\frac{1}{n}$, so the sequence is squeezed to $0$.`,
      "over-exp": `The factorial eventually gains factors larger than $${a}$, so the size of the quotient grows without bound.`,
      shift: `$\\frac{(n + ${k})!}{n!}$ is a polynomial of degree $${k}$ with leading coefficient $1$, so its quotient by $n^{${k}}$ tends to $1$.`,
      power: `The factorial grows faster than any fixed power of $n$, so the quotient tends to $0$.`,
    }[kind];
    const whyZh = {
      "over-nn": `$\\frac{n!}{n^{n}} \\le \\frac{1}{n}$，所以由夹逼定理，数列趋于 $0$。`,
      "over-exp": `阶乘最终会乘上大于 $${a}$ 的因子，所以商的大小无限增大。`,
      shift: `$\\frac{(n + ${k})!}{n!}$ 是首项系数为 $1$ 的 $${k}$ 次多项式，所以它除以 $n^{${k}}$ 趋于 $1$。`,
      power: `阶乘比 $n$ 的任何固定次幂增长得都快，所以商趋于 $0$。`,
    }[kind];
    return choose(
      rng,
      [`Find $\\lim_{n \\to \\infty} ${expr}$.`, `求 $\\lim_{n \\to \\infty} ${expr}$。`],
      same2(answer),
      opts.map(same2),
      [`${whyEn} The limit is $${answer}$.`, `${whyZh}极限是 $${answer}$。`],
    );
  },
);

const mixedDominance = point(
  "dominant-terms-across-different-kinds-of-growth",
  ["Dominant terms across different kinds of growth", "不同增长类型中的主导项"],
  [
    "The growth order is: logarithms, then powers of $n$, then exponentials, then factorials. In a quotient of mixed terms, only the dominant kind matters on each side, so the limit is the ratio of its coefficients and the other coefficients play no part.",
    "增长的顺序是：对数、$n$ 的幂、指数、阶乘。在混合项的商中，每一边只有主导的那一类起作用，所以极限是它们系数的比，其他系数不起作用。",
  ],
  (rng) => {
    const c = nz(rng, 9);
    const d = nz(rng, 9);
    const e = rng.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== Math.abs(d)));
    const p = rng.int(2, 7);
    const k = rng.int(2, 6);
    const kind = rng.pick(["factorial", "exponential", "power"] as const);
    const big = { factorial: "n!", exponential: `${p}^{n}`, power: `n^{${k}}` }[kind];
    const small = { factorial: `${p}^{n}`, exponential: `n^{${k}}`, power: "\\ln n" }[kind];
    const term = (co: number, body: string): [number, string] => [co, /^\d/.test(body) && Math.abs(co) !== 1 ? `\\cdot ${body}` : body];
    const top = poly(term(c, big), term(1, small));
    const bottom = poly(term(d, big), term(e, small));
    const answer = Q.of(c, d);
    return ask(
      [`Find $\\lim_{n \\to \\infty} \\frac{${top}}{${bottom}}$.`, `求 $\\lim_{n \\to \\infty} \\frac{${top}}{${bottom}}$。`],
      answer,
      [Q.of(1, e), Q.of(c, e), Q.of(c + 1, d + e === 0 ? 1 : d + e)],
      [
        `$${big}$ grows faster than $${small}$, so dividing through by $${big}$ leaves the ratio of their coefficients, $${answer.toLatex()}$.`,
        `$${big}$ 比 $${small}$ 增长得快，所以分子分母同除以 $${big}$，得它们的系数之比 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const largestTerm = point(
  "the-largest-term-of-a-sequence",
  ["The largest term of a sequence", "数列的最大项"],
  [
    "A sequence need not be monotonic from the start. If $f$ rises and then falls with a peak at an integer, the largest term of $a_{n} = f(n)$ is at that integer, and the sequence decreases after it. Differentiating $f$ locates the peak.",
    "数列不一定从一开始就单调。如果 $f$ 先升后降，峰值在某个整数处，那么 $a_{n} = f(n)$ 的最大项就在这个整数处，此后数列递减。对 $f$ 求导就能找到峰值。",
  ],
  (rng) => {
    const k = rng.int(2, 9);
    const p = rng.int(1, 5);
    const peak = p * k;
    const a = `${p === 1 ? "n" : `n^{${p}}`}e^{-n/${k}}`;
    return ask(
      [`For which $n$ is the term $a_{n} = ${a}$ largest?`, `当 $n$ 为何值时，$a_{n} = ${a}$ 这一项最大？`],
      peak,
      [peak + 1, k, p + k],
      [
        `With $f(x) = ${p === 1 ? "x" : `x^{${p}}`}e^{-x/${k}}$, the derivative has the sign of $${p} - \\frac{x}{${k}}$. It changes from positive to negative at $x = ${peak}$, which is an integer, so the largest term is $a_{${peak}}$.`,
        `设 $f(x) = ${p === 1 ? "x" : `x^{${p}}`}e^{-x/${k}}$，导数的符号与 $${p} - \\frac{x}{${k}}$ 相同。它在 $x = ${peak}$ 处由正变负，这是整数，所以最大项是 $a_{${peak}}$。`,
      ],
    );
  },
);

const ratioWithLinearFactor = point(
  "ratios-that-settle-only-after-a-while",
  ["Ratios that settle only after a while", "比值过一段时间才稳定"],
  [
    "For $a_{n} = n\\left(\\frac{p}{q}\\right)^{n}$ the ratio is $\\frac{n + 1}{n} \\cdot \\frac{p}{q}$, which may start above $1$. Solving the strict inequality gives where the decrease begins. If the boundary is an integer, the ratio there equals $1$, so that $n$ does not count.",
    "对 $a_{n} = n\\left(\\frac{p}{q}\\right)^{n}$，比值是 $\\frac{n + 1}{n} \\cdot \\frac{p}{q}$，开始时可能大于 $1$。解严格不等式就能知道从哪里开始递减。如果边界是整数，那里的比值等于 $1$，所以这个 $n$ 不算。",
  ],
  (rng) => {
    const q = rng.int(3, 15);
    const p = rng.int(1, q - 1);
    const bound = Q.of(p, q - p);
    const floor = Math.floor(p / (q - p));
    const N = floor + 1;
    const r = Q.of(p, q).toLatex();
    return ask(
      [
        `Let $a_{n} = n\\left(${r}\\right)^{n}$. Find the smallest $N$ such that $a_{n+1} < a_{n}$ for every $n \\ge N$.`,
        `设 $a_{n} = n\\left(${r}\\right)^{n}$。求最小的 $N$，使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_{n}$。`,
      ],
      N,
      [floor === 0 ? 2 : floor, N + 1, q],
      [
        `$\\frac{a_{n+1}}{a_{n}} = \\frac{n + 1}{n} \\cdot ${r} < 1$ means $n > ${bound.toLatex()}$. The smallest such integer is $${N}$.`,
        `$\\frac{a_{n+1}}{a_{n}} = \\frac{n + 1}{n} \\cdot ${r} < 1$ 即 $n > ${bound.toLatex()}$。满足它的最小整数是 $${N}$。`,
      ],
    );
  },
);

/** deeperCalculusIIThirdPoints maps topics of Calculus II, from integration to limits of sequences, to a third knowledge point. */
export const deeperCalculusIIThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "integrating-exponential-functions-using-linear-substitution": [negativeExponent],
  "integration-by-substitution-with-inverse-reciprocal-hyperbolic-functions": [arsechOfExponential],
  "integration-using-hyperbolic-functions-and-completing-the-square": [squareWithLeadingCoefficient],
  "integration-using-inverse-reciprocal-hyperbolic-functions-and-completing-the-square": [familyFromSquare],
  "integration-using-basic-trigonometric-identities": [pythagoreanIntegrals],
  "the-area-between-curves-expressed-as-functions-of-y": [areaLeftOfYAxis],
  "finding-areas-between-curves-that-intersect-at-more-than-two-points": [netAndTotal],
  "volumes-of-solids-with-rectangular-cross-sections": [heightFromVolume],
  "volumes-of-solids-with-circular-cross-sections": [overCircularBase],
  "volumes-of-revolution-using-the-disc-method-rotation-about-other-axes": [washerAxisOutside],
  "the-shell-method-rotating-a-region-about-the-x-axis": [shellShiftedAxis],
  "the-shell-method-rotating-a-region-between-two-curves-about-the-x-axis": [shellAxisAbove],
  "surface-areas-of-revolution-rotation-about-the-x-axis": [coneLength],
  "surface-areas-of-revolution-rotation-about-the-y-axis": [bothAxes],
  "determining-characteristics-of-moving-objects-using-integration": [totalDistance],
  "calculating-the-position-function-of-a-particle-using-integration": [initialVelocityFromPositions],
  "surface-areas-of-revolution-for-parametric-curves": [astroidSurface],
  "integrating-vector-valued-functions": [netDisplacementVector],
  "calculating-acceleration-for-plane-motion-using-differentiation": [speedFromDot],
  "differentiating-curves-given-in-polar-form": [slopeFromValues],
  "further-differentiation-of-curves-given-in-polar-form": [diagonalSlopeFromValues],
  "horizontal-and-vertical-tangents-to-polar-curves": [zeroRadialDerivative],
  "horizontal-and-vertical-tangents-to-polar-curves-in-non-differentiable-cases": [roseTangentsAtPole],
  "tangent-and-normal-lines-to-polar-curves": [parameterFromTangentSlope],
  "the-area-bounded-by-two-polar-curves": [commonRegion],
  "further-convergence-of-geometric-sequences": [recursiveLimit],
  "limits-of-sequences-with-factorials": [factorialAgainstPowers],
  "determining-limits-of-sequences-using-relative-magnitudes": [mixedDominance],
  "identifying-monotonic-sequences-using-differentiation": [largestTerm],
  "identifying-monotonic-sequences-using-ratios": [ratioWithLinearFactor],
};
