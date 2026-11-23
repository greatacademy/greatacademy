import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { remainingDrawings8 } from "../explanation-drawings-remaining-8.ts";
import {
  choiceProblem,
  equationProblem,
  expressionProblem,
  factoredProblem,
  numberProblem,
  pointProblem,
  radicalProblem,
  steps,
} from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus Unit 10: Complex Numbers
// Part 1: Modules 10.30 (The Complex Plane), 10.31 (Further Complex Numbers),
// and 10.32 (Complex Numbers in Polar Form).

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** why pairs a wrong option with what is wrong with it in English and Chinese. */
const why = (option: Text, en: string, zh: string): Reason => [option.en, en, zh];

/** oneOf builds a multiple-choice problem with options shuffled and deduplicated, giving the reasons for the wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
      if (rest.length === 3) break;
    }
  }
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

/** cx formats the complex number a + bi in standard mathematical notation. */
function cx(a: number, b: number): string {
  if (a === 0 && b === 0) return "0";
  if (b === 0) return `${a}`;
  const bStr = b === 1 ? "i" : b === -1 ? "-i" : `${b}i`;
  if (a === 0) return bStr;
  return b > 0 ? `${a} + ${b === 1 ? "i" : `${b}i`}` : `${a} - ${b === -1 ? "i" : `${-b}i`}`;
}

/** cxPar wraps a complex number in parentheses when appropriate. */
function cxPar(a: number, b: number): string {
  const s = cx(a, b);
  return (a !== 0 && b !== 0) || s.startsWith("-") ? `(${s})` : s;
}

/** gcd computes the greatest common divisor of two integers. */
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

/** formatFraction formats num / den as reduced LaTeX fraction. */
function formatFraction(num: number, den: number): string {
  if (num === 0) return "0";
  const sign = (num < 0 ? -1 : 1) * (den < 0 ? -1 : 1);
  const n = Math.abs(num);
  const d = Math.abs(den);
  const g = gcd(n, d);
  const sn = (n / g) * sign;
  const sd = d / g;
  if (sd === 1) return `${sn}`;
  return sn < 0 ? `-\\frac{${-sn}}{${sd}}` : `\\frac{${sn}}{${sd}}`;
}

/** cxFrac formats (numA / den) + (numB / den)i in reduced form. */
function cxFrac(numA: number, numB: number, den: number): string {
  const re = formatFraction(numA, den);
  const im = formatFraction(numB, den);
  if (numB === 0) return re;
  if (numA === 0) {
    if (im === "1") return "i";
    if (im === "-1") return "-i";
    return `${im}i`;
  }
  if (numB > 0) {
    const imStr = im === "1" ? "i" : `${im}i`;
    return `${re} + ${imStr}`;
  }
  const posIm = formatFraction(-numB, den);
  const imStr = posIm === "1" ? "i" : `${posIm}i`;
  return `${re} - ${imStr}`;
}

/** PolarItem is a special complex number: its modulus r, its argument theta in LaTeX, its rectangular form, and wrong arguments and rectangular forms for it. */
interface PolarItem {
  readonly r: number;
  readonly theta: string;
  readonly rect: string;
  readonly wrongThetas: readonly string[];
  readonly wrongRects: readonly string[];
}

/** getSpecialPolarItems returns standard special angle items with multiple radii for high generator variety. */
function getSpecialPolarItems(): readonly PolarItem[] {
  const items: PolarItem[] = [];
  const ks = [1, 2, 3, 4];
  for (const k of ks) {
    const r = 2 * k;
    const kStr = k === 1 ? "" : `${k}`;
    items.push({
      r,
      theta: "\\frac{\\pi}{6}",
      rect: `${kStr}\\sqrt{3} + ${kStr}i`,
      wrongThetas: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{11\\pi}{6}"],
      wrongRects: [`${k} + ${kStr}\\sqrt{3}i`, `-${kStr}\\sqrt{3} + ${kStr}i`, `${kStr}\\sqrt{3} - ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{\\pi}{3}",
      rect: `${k} + ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{4\\pi}{3}"],
      wrongRects: [`${kStr}\\sqrt{3} + ${kStr}i`, `-${k} + ${kStr}\\sqrt{3}i`, `${k} - ${kStr}\\sqrt{3}i`],
    });
    items.push({
      r,
      theta: "\\frac{2\\pi}{3}",
      rect: `-${k} + ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}"],
      wrongRects: [`${k} + ${kStr}\\sqrt{3}i`, `-${k} - ${kStr}\\sqrt{3}i`, `-${kStr}\\sqrt{3} + ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{5\\pi}{6}",
      rect: `-${kStr}\\sqrt{3} + ${kStr}i`,
      wrongThetas: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{7\\pi}{6}"],
      wrongRects: [`${kStr}\\sqrt{3} + ${kStr}i`, `-${kStr}\\sqrt{3} - ${kStr}i`, `-${k} + ${kStr}\\sqrt{3}i`],
    });
    items.push({
      r,
      theta: "\\frac{7\\pi}{6}",
      rect: `-${kStr}\\sqrt{3} - ${kStr}i`,
      wrongThetas: ["\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}", "\\frac{11\\pi}{6}"],
      wrongRects: [`-${kStr}\\sqrt{3} + ${kStr}i`, `${kStr}\\sqrt{3} - ${kStr}i`, `-${k} - ${kStr}\\sqrt{3}i`],
    });
    items.push({
      r,
      theta: "\\frac{4\\pi}{3}",
      rect: `-${k} - ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{2\\pi}{3}", "\\frac{5\\pi}{3}", "\\frac{7\\pi}{6}"],
      wrongRects: [`-${k} + ${kStr}\\sqrt{3}i`, `${k} - ${kStr}\\sqrt{3}i`, `-${kStr}\\sqrt{3} - ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{5\\pi}{3}",
      rect: `${k} - ${kStr}\\sqrt{3}i`,
      wrongThetas: ["\\frac{4\\pi}{3}", "\\frac{\\pi}{3}", "\\frac{11\\pi}{6}"],
      wrongRects: [`${k} + ${kStr}\\sqrt{3}i`, `-${k} - ${kStr}\\sqrt{3}i`, `${kStr}\\sqrt{3} - ${kStr}i`],
    });
    items.push({
      r,
      theta: "\\frac{11\\pi}{6}",
      rect: `${kStr}\\sqrt{3} - ${kStr}i`,
      wrongThetas: ["\\frac{7\\pi}{6}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{6}"],
      wrongRects: [`${kStr}\\sqrt{3} + ${kStr}i`, `-${kStr}\\sqrt{3} - ${kStr}i`, `${k} - ${kStr}\\sqrt{3}i`],
    });
  }
  for (const r of [2, 3, 4, 5, 6]) {
    items.push({
      r,
      theta: "0",
      rect: `${r}`,
      wrongThetas: ["\\pi", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"],
      wrongRects: [`-${r}`, `${r}i`, `-${r}i`],
    });
    items.push({
      r,
      theta: "\\frac{\\pi}{2}",
      rect: `${r}i`,
      wrongThetas: ["\\pi", "\\frac{3\\pi}{2}", "0"],
      wrongRects: [`-${r}i`, `${r}`, `-${r}`],
    });
    items.push({
      r,
      theta: "\\pi",
      rect: `-${r}`,
      wrongThetas: ["0", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"],
      wrongRects: [`${r}`, `-${r}i`, `${r}i`],
    });
    items.push({
      r,
      theta: "\\frac{3\\pi}{2}",
      rect: `-${r}i`,
      wrongThetas: ["\\frac{\\pi}{2}", "\\pi", "0"],
      wrongRects: [`${r}i`, `-${r}`, `${r}`],
    });
  }
  return items;
}

/** SpecialAngle describes a special argument: its quadrant (0 on an axis), the axis it points along, its reference angle, how it is reached from the reference angle, and its cosine and sine. */
interface SpecialAngle {
  readonly quadrant: 0 | 1 | 2 | 3 | 4;
  readonly axis: readonly [en: string, zh: string];
  readonly ref: string;
  readonly rule: string;
  readonly cos: string;
  readonly sin: string;
}

/** specialAngle builds the SpecialAngle of a quadrant angle with reference angle ref and the given cosine and sine. */
const specialAngle = (quadrant: 1 | 2 | 3 | 4, ref: string, cos: string, sin: string): SpecialAngle => ({
  quadrant,
  axis: ["", ""],
  ref,
  rule: quadrant === 1 ? ref : quadrant === 2 ? `\\pi - ${ref}` : quadrant === 3 ? `\\pi + ${ref}` : `2\\pi - ${ref}`,
  cos,
  sin,
});

/** axisAngle builds the SpecialAngle of an angle along an axis. */
const axisAngle = (en: string, zh: string, cos: string, sin: string): SpecialAngle => ({
  quadrant: 0,
  axis: [en, zh],
  ref: "",
  rule: "",
  cos,
  sin,
});

/** specialAngles lists the special arguments in [0, 2π) by their LaTeX. */
const specialAngles: Readonly<Record<string, SpecialAngle>> = {
  "0": axisAngle("the positive real axis", "正实轴", "1", "0"),
  "\\frac{\\pi}{2}": axisAngle("the positive imaginary axis", "正虚轴", "0", "1"),
  "\\pi": axisAngle("the negative real axis", "负实轴", "-1", "0"),
  "\\frac{3\\pi}{2}": axisAngle("the negative imaginary axis", "负虚轴", "0", "-1"),
  "\\frac{\\pi}{4}": specialAngle(1, "\\frac{\\pi}{4}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"),
  "\\frac{3\\pi}{4}": specialAngle(2, "\\frac{\\pi}{4}", "-\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"),
  "\\frac{5\\pi}{4}": specialAngle(3, "\\frac{\\pi}{4}", "-\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{2}}{2}"),
  "\\frac{7\\pi}{4}": specialAngle(4, "\\frac{\\pi}{4}", "\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{2}}{2}"),
  "\\frac{\\pi}{6}": specialAngle(1, "\\frac{\\pi}{6}", "\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"),
  "\\frac{5\\pi}{6}": specialAngle(2, "\\frac{\\pi}{6}", "-\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}"),
  "\\frac{7\\pi}{6}": specialAngle(3, "\\frac{\\pi}{6}", "-\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}"),
  "\\frac{11\\pi}{6}": specialAngle(4, "\\frac{\\pi}{6}", "\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}"),
  "\\frac{\\pi}{3}": specialAngle(1, "\\frac{\\pi}{3}", "\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"),
  "\\frac{2\\pi}{3}": specialAngle(2, "\\frac{\\pi}{3}", "-\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}"),
  "\\frac{4\\pi}{3}": specialAngle(3, "\\frac{\\pi}{3}", "-\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}"),
  "\\frac{5\\pi}{3}": specialAngle(4, "\\frac{\\pi}{3}", "\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}"),
};

/** plainMath writes simple LaTeX such as \frac{\sqrt{3}}{2} or \frac{5\pi}{6} as plain text, such as √3/2 or 5π/6, with a true minus sign. */
const plainMath = (latex: string): string =>
  latex
    .replace(/\\sqrt\{(\d+)\}/g, "√$1")
    .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, "$1/$2")
    .replace(/\\pi/g, "π")
    .replace(/-/g, "−");

/** angleName writes a special angle given in radians as plain text, in radians or, with degrees, in degrees. */
function angleName(latex: string, degrees = false): string {
  if (!degrees) return plainMath(latex);
  if (latex === "0") return "0°";
  if (latex === "\\pi") return "180°";
  const m = /^\\frac\{(\d*)\\pi\}\{(\d+)\}$/.exec(latex);
  return m ? `${(Number(m[1] || "1") * 180) / Number(m[2])}°` : plainMath(latex);
}

/** angleHome says where the direction of a special angle points, in English and Chinese. */
function angleHome(p: SpecialAngle): readonly [en: string, zh: string] {
  const en = ["I", "II", "III", "IV"];
  const zh = ["一", "二", "三", "四"];
  return p.quadrant === 0
    ? [`along ${p.axis[0]}`, `沿${p.axis[1]}方向`]
    : [`into Quadrant ${en[p.quadrant - 1]}`, `指向第${zh[p.quadrant - 1]}象限`];
}

/** angleMiss explains in English and Chinese why the special angle wrong is not the argument right of a number. */
function angleMiss(right: string, wrong: string, degrees = false): readonly [en: string, zh: string] {
  const p = specialAngles[right];
  const q = specialAngles[wrong];
  const [w, r] = [angleName(wrong, degrees), angleName(right, degrees)];
  if (!p || !q) {
    return [`The argument is ${r}, not ${w}.`, `辐角是 ${r}，不是 ${w}。`];
  }
  if (p.quadrant !== 0 && p.quadrant === q.quadrant) {
    return [
      `The angle ${w} is in the right quadrant, but its reference angle is ${angleName(q.ref, degrees)}, not ${angleName(p.ref, degrees)}, so it gives the wrong ratio between the sizes of the real and imaginary parts.`,
      `角 ${w} 的象限对了，但它的参考角是 ${angleName(q.ref, degrees)}，不是 ${angleName(p.ref, degrees)}，所以实部与虚部大小之比不对。`,
    ];
  }
  const [qe, qz] = angleHome(q);
  const [pe, pz] = angleHome(p);
  return [
    `The angle ${w} points ${qe}, but the number points ${pe}, at angle ${r}: the signs of the parts do not match.`,
    `角 ${w} ${qz}，而这个数${pz}，辐角是 ${r}：两部分的符号不符。`,
  ];
}

/** signWord names the sign of a cosine or sine written in LaTeX, in English and Chinese. */
const signWord = (value: string): readonly [en: string, zh: string] =>
  value === "0" ? ["zero", "零"] : value.startsWith("-") ? ["negative", "负数"] : ["positive", "正数"];

/** rectMiss explains in English and Chinese why wrongRect is not r(cos θ + i sin θ) for the special angle theta. */
function rectMiss(r: number, theta: string, wrongRect: string, degrees = false): readonly [en: string, zh: string] {
  const p = specialAngles[theta];
  const other = getSpecialPolarItems().find((item) => item.r === r && item.rect === wrongRect);
  const q = other ? specialAngles[other.theta] : undefined;
  const name = angleName(theta, degrees);
  if (!p || !q || !other) {
    return [`Its parts are not ${r} cos ${name} and ${r} sin ${name}.`, `它的两部分不是 ${r} cos ${name} 和 ${r} sin ${name}。`];
  }
  const [c, s] = [plainMath(p.cos), plainMath(p.sin)];
  if (p.quadrant !== 0 && p.quadrant === q.quadrant) {
    return [
      `This swaps the cosine and the sine: at ${name} the cosine is ${c} and the sine is ${s}, so the real part is ${r} × ${c} and the imaginary part is ${r} × ${s}.`,
      `这里把余弦和正弦弄反了：在 ${name} 处余弦是 ${c}，正弦是 ${s}，所以实部是 ${r} × ${c}，虚部是 ${r} × ${s}。`,
    ];
  }
  const [ce, cz] = signWord(p.cos);
  const [se, sz] = signWord(p.sin);
  return [
    `This is the number at angle ${angleName(other.theta, degrees)}. At ${name} the cosine is ${c} and the sine is ${s}, so the real part is ${ce} and the imaginary part is ${se}.`,
    `这是角 ${angleName(other.theta, degrees)} 处的数。在 ${name} 处余弦是 ${c}，正弦是 ${s}，所以实部是${cz}，虚部是${sz}。`,
  ];
}

// ─── Module 10.30: The Complex Plane ─────────────────────────────────────────

/** theComplexPlane covers representing complex numbers geometrically as points in the complex plane. */
export const theComplexPlane: TopicDef = {
  id: "the-complex-plane",
  title: t("The Complex Plane", "复平面与复数的几何表示"),
  summary: t(
    "Represent complex numbers z = a + bi geometrically as coordinates (a, b) in the complex plane, identify the real and imaginary axes, and determine the quadrant containing a given complex number.",
    "在复平面（阿尔冈图）中将复数 z = a + bi 几何表示为坐标 (a, b)，识别实轴与虚轴，并确定给定复数所在的象限。",
  ),
  prerequisites: ["two-dimensional-vectors-expressed-in-component-form"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  intro: t(
    `A vector in component form $\\langle a, b \\rangle$ is fixed by two numbers, and so is a complex number $a + bi$: its real part $a$ and its imaginary part $b$. So a complex number can be drawn just like a vector, as the point $(a, b)$, with the real part along the horizontal axis and the imaginary part up the vertical axis. For example, $2 + 3i$ is the point $(2, 3)$.

Check: the vector $\\langle 2, 3 \\rangle$ drawn from the origin goes $2$ right and $3$ up, and it ends at the same point $(2, 3)$.

In this lesson we draw complex numbers as points, find the numbers on the two axes, and tell which quadrant a number lies in.`,
    `分量形式的向量 $\\langle a, b \\rangle$ 由两个数确定，复数 $a + bi$ 也是：它的实部 $a$ 和虚部 $b$。所以复数可以像向量一样画出来，画成点 $(a, b)$，实部沿水平轴，虚部沿竖直轴。例如，$2 + 3i$ 就是点 $(2, 3)$。

检验：从原点画出的向量 $\\langle 2, 3 \\rangle$ 向右 $2$、向上 $3$，终点也是 $(2, 3)$。

这节课我们把复数画成点，找出两条坐标轴上的数，并判断一个数位于哪个象限。`,
  ),
  knowledgePoints: [
    {
      id: "plot-complex-numbers-in-the-complex-plane",
      title: t("Plot complex numbers as coordinates in the complex plane", "在复平面中将复数表示为坐标点"),
      explanation: t(
        "Every complex number $z = a + bi$ corresponds to a unique point $(a, b)$ in the **complex plane** (or Argand plane).\n\n- The horizontal axis is the **real axis** ($\\text{Re}$), representing the real part $a$.\n- The vertical axis is the **imaginary axis** ($\\text{Im}$), representing the imaginary part $b$.\n\nFor example, $z = 3 - 4i$ is represented by the point $(3, -4)$. Check: from the origin go $3$ to the right, then $4$ down, since the imaginary part $-4$ is negative.\n\n> **Watch out.** The imaginary part is the number $b$, not $bi$: the point is $(3, -4)$, not $(3, -4i)$. The real part always comes first.",
        "每一个复数 $z = a + bi$ 都在**复平面**（阿尔冈平面）中对应唯一的点 $(a, b)$。\n\n- 水平轴为**实轴**（$\\text{Re}$），表示实部 $a$。\n- 垂直轴为**虚轴**（$\\text{Im}$），表示虚部 $b$。\n\n例如，复数 $z = 3 - 4i$ 对应的点坐标为 $(3, -4)$。检验：从原点向右走 $3$，再向下走 $4$，因为虚部 $-4$ 是负数。\n\n> **注意。** 虚部是数 $b$，而不是 $bi$：点是 $(3, -4)$，不是 $(3, -4i)$。实部总是写在前面。",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        return pointProblem({
          prompt: t(
            `Find the coordinates $(x, y)$ of the point in the complex plane that represents $z = ${cx(a, b)}$.`,
            `求在复平面中表示复数 $z = ${cx(a, b)}$ 的点坐标 $(x, y)$。`,
          ),
          answer: [a, b],
          wrong: [
            [b, a],
            [-a, b],
            [a, -b],
            [-b, -a],
          ],
          solution: walked(
            [
              [
                ["Read the two parts", "读出两个部分"],
                t(
                  `Write $z$ as $a + bi$. The real part is the number on its own, and the imaginary part is the number multiplying $i$, with its sign:`,
                  `把 $z$ 写成 $a + bi$。实部是单独的数，虚部是乘 $i$ 的数，连同符号：`,
                ),
                [`a = ${a}, \\quad b = ${b}`],
              ],
              [
                ["Make the point", "写出点"],
                t("The real part is the $x$-coordinate and the imaginary part is the $y$-coordinate:", "实部是横坐标，虚部是纵坐标："),
                [`(${a}, ${b})`],
              ],
            ],
            t(
              `Read the point back as a number: $${a}$ plus $${b}$ times $i$ is $${cx(a, b)}$, the number we started with. It is ${a > 0 ? "right" : "left"} of the imaginary axis and ${b > 0 ? "above" : "below"} the real axis, as the signs of $${a}$ and $${b}$ say.`,
              `把点读回成数：$${a}$ 加上 $${b}$ 乘 $i$，得 $${cx(a, b)}$，正是原来的数。它在虚轴${a > 0 ? "右" : "左"}侧、实轴${b > 0 ? "上" : "下"}方，与 $${a}$、$${b}$ 的符号相符。`,
            ),
          ),
        });
      },
    },
    {
      id: "real-and-imaginary-axes",
      title: t("Identify points on the real and imaginary axes", "识别实轴与虚轴上的点"),
      explanation: t(
        "In the complex plane:\n\n- A **purely real number** $z = a$ (where $b = 0$) lies on the **real axis** at coordinate $(a, 0)$.\n- A **purely imaginary number** $z = bi$ with $b \\neq 0$ (where $a = 0$) lies on the **imaginary axis** at coordinate $(0, b)$.\n- The origin $(0, 0)$ represents $z = 0$.\n\nFor example, $-5i = 0 - 5i$ lies on the imaginary axis at $(0, -5)$. Check: its real part is $0$, so it is neither left nor right of the imaginary axis.\n\n> **Watch out.** A number on an axis lies in no quadrant. The axis is named by the part that is not zero: $-5i$ has imaginary part $-5$, so it is on the imaginary axis, at $(0, -5)$ rather than $(-5, 0)$.",
        "在复平面中：\n\n- **纯实数** $z = a$（虚部 $b = 0$）位于**实轴**上，坐标为 $(a, 0)$。\n- **纯虚数** $z = bi$（$b \\neq 0$，实部 $a = 0$）位于**虚轴**上，坐标为 $(0, b)$。\n- 原点 $(0, 0)$ 表示复数 $0$。\n\n例如，$-5i = 0 - 5i$ 位于虚轴上的 $(0, -5)$。检验：它的实部是 $0$，所以既不在虚轴左侧，也不在右侧。\n\n> **注意。** 坐标轴上的数不属于任何象限。所在的轴由不为零的那个部分决定：$-5i$ 的虚部是 $-5$，所以它在虚轴上，坐标是 $(0, -5)$ 而不是 $(-5, 0)$。",
      ),
      generate(rng) {
        const val = rng.pick([-12, -10, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
        const isReal = rng.bool();
        const z = isReal ? `${val}` : cx(0, val);
        const prompt = t(
          `On which axis does the complex number $z = ${z}$ lie, and what are its coordinates in the complex plane?`,
          `复数 $z = ${z}$ 位于复平面的哪条坐标轴上，其对应的坐标是什么？`,
        );
        const onReal = t(`Real axis, at $(${val}, 0)$`, `实轴，位于 $(${val}, 0)$`);
        const onImag = t(`Imaginary axis, at $(0, ${val})$`, `虚轴，位于 $(0, ${val})$`);
        const realSwapped = t(`Real axis, at $(0, ${val})$`, `实轴，位于 $(0, ${val})$`);
        const imagSwapped = t(`Imaginary axis, at $(${val}, 0)$`, `虚轴，位于 $(${val}, 0)$`);
        const quadrant = isReal
          ? t(`Quadrant I, at $(${val}, ${val})$`, `第一象限，位于 $(${val}, ${val})$`)
          : t(`Quadrant II, at $(${val}, ${val})$`, `第二象限，位于 $(${val}, ${val})$`);
        const [re, im] = isReal ? [val, 0] : [0, val];
        const right = isReal ? onReal : onImag;
        const wrong = isReal ? [onImag, realSwapped, imagSwapped, quadrant] : [onReal, imagSwapped, realSwapped, quadrant];
        const solution = walked(
          [
            [
              ["Write it as a + bi", "写成 a + bi"],
              t("Fill in the missing part with $0$:", "把缺少的部分补成 $0$："),
              [`z = ${re} ${im < 0 ? "-" : "+"} ${Math.abs(im)}i`],
            ],
            [
              ["Read the point", "读出点"],
              t(
                `The point is $(${re}, ${im})$. Its ${isReal ? "imaginary" : "real"} part is $0$, so it lies on the ${isReal ? "real" : "imaginary"} axis.`,
                `点是 $(${re}, ${im})$。它的${isReal ? "虚" : "实"}部是 $0$，所以在${isReal ? "实" : "虚"}轴上。`,
              ),
            ],
          ],
          t(
            isReal
              ? `Every point of the real axis has $y$-coordinate $0$, and $(${val}, 0)$ does. It is $${Math.abs(val)}$ units ${val > 0 ? "right" : "left"} of the origin, as the real number $${val}$ is on the number line.`
              : `Every point of the imaginary axis has $x$-coordinate $0$, and $(0, ${val})$ does. It is $${Math.abs(val)}$ units ${val > 0 ? "above" : "below"} the origin, as the sign of the imaginary part says.`,
            isReal
              ? `实轴上每个点的纵坐标都是 $0$，$(${val}, 0)$ 正是如此。它在原点${val > 0 ? "右" : "左"}边 $${Math.abs(val)}$ 个单位，与实数 $${val}$ 在数轴上的位置一致。`
              : `虚轴上每个点的横坐标都是 $0$，$(0, ${val})$ 正是如此。它在原点${val > 0 ? "上" : "下"}方 $${Math.abs(val)}$ 个单位，与虚部的符号一致。`,
          ),
        );
        return oneOf(rng, prompt, right, wrong, solution, [
          why(
            isReal ? onImag : onReal,
            isReal
              ? "The imaginary part of this number is 0, so it is on the real axis, not the imaginary axis."
              : "The real part of this number is 0, so it is on the imaginary axis, not the real axis.",
            isReal ? "这个数的虚部是 0，所以它在实轴上，而不是虚轴上。" : "这个数的实部是 0，所以它在虚轴上，而不是实轴上。",
          ),
          why(
            isReal ? realSwapped : imagSwapped,
            "The axis is right, but the coordinates are swapped: the real part comes first.",
            "坐标轴对了，但坐标顺序反了：实部要写在前面。",
          ),
          why(
            isReal ? imagSwapped : realSwapped,
            "The coordinates and the axis do not agree: a point whose first coordinate is 0 is on the imaginary axis, and one whose second coordinate is 0 is on the real axis.",
            "坐标与坐标轴不一致：第一个坐标为 0 的点在虚轴上，第二个坐标为 0 的点在实轴上。",
          ),
          why(
            quadrant,
            "One of the two parts is 0, so the point is on an axis and in no quadrant; its coordinates are not both the same number.",
            "两个部分中有一个是 0，所以这个点在坐标轴上，不属于任何象限；它的两个坐标也不相同。",
          ),
        ]);
      },
    },
    {
      id: "quadrants-in-the-complex-plane",
      title: t("Determine the quadrant of a complex number", "确定复数所在的象限"),
      explanation: t(
        "The signs of the real part $a$ and imaginary part $b$ determine the quadrant of $z = a + bi$:\n\n- **Quadrant I**: $a > 0$ and $b > 0$\n- **Quadrant II**: $a < 0$ and $b > 0$\n- **Quadrant III**: $a < 0$ and $b < 0$\n- **Quadrant IV**: $a > 0$ and $b < 0$\n\nFor example, $-2 + 5i$ has a negative real part and a positive imaginary part, so it lies in Quadrant II. Check: the point $(-2, 5)$ is left of the imaginary axis and above the real axis, which is the upper left quadrant.\n\n> **Watch out.** The quadrants are numbered counterclockwise from the upper right. Read the sign of the imaginary part from the sign in front of $i$, not from the size of the number.",
        "复数 $z = a + bi$ 的实部 $a$ 和虚部 $b$ 的符号决定了其所在的象限：\n\n- **第一象限**：$a > 0$ 且 $b > 0$\n- **第二象限**：$a < 0$ 且 $b > 0$\n- **第三象限**：$a < 0$ 且 $b < 0$\n- **第四象限**：$a > 0$ 且 $b < 0$\n\n例如，$-2 + 5i$ 的实部为负、虚部为正，所以在第二象限。检验：点 $(-2, 5)$ 在虚轴左侧、实轴上方，正是左上方的象限。\n\n> **注意。** 象限从右上方开始按逆时针方向编号。虚部的符号要看 $i$ 前面的符号，而不是数的大小。",
      ),
      generate(rng) {
        const a = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const b = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const quad = a > 0 ? (b > 0 ? "I" : "IV") : b > 0 ? "II" : "III";
        const prompt = t(
          `In which quadrant of the complex plane does $z = ${cx(a, b)}$ lie?`,
          `复数 $z = ${cx(a, b)}$ 位于复平面的第几象限？`,
        );
        const right = t(`Quadrant ${quad}`, `第 ${quad} 象限`);
        const allQuads = ["I", "II", "III", "IV"];
        const wrong = allQuads.filter((q) => q !== quad).map((q) => t(`Quadrant ${q}`, `第 ${q} 象限`));
        const solution = walked(
          [
            [
              ["Read the signs", "看符号"],
              t(
                `The real part is $a = ${a}$, which is ${a > 0 ? "positive" : "negative"}, and the imaginary part is $b = ${b}$, which is ${b > 0 ? "positive" : "negative"}.`,
                `实部 $a = ${a}$ 是${a > 0 ? "正数" : "负数"}，虚部 $b = ${b}$ 是${b > 0 ? "正数" : "负数"}。`,
              ),
            ],
            [
              ["Match the quadrant", "对应象限"],
              t(
                `A ${a > 0 ? "positive" : "negative"} real part and a ${b > 0 ? "positive" : "negative"} imaginary part is Quadrant ${quad}.`,
                `实部为${a > 0 ? "正" : "负"}、虚部为${b > 0 ? "正" : "负"}，对应第 ${quad} 象限。`,
              ),
            ],
          ],
          t(
            `Picture the point $(${a}, ${b})$: it is ${a > 0 ? "right" : "left"} of the imaginary axis and ${b > 0 ? "above" : "below"} the real axis, which is the ${b > 0 ? "upper" : "lower"} ${a > 0 ? "right" : "left"} quadrant, Quadrant ${quad}.`,
            `想象点 $(${a}, ${b})$：它在虚轴${a > 0 ? "右" : "左"}侧、实轴${b > 0 ? "上" : "下"}方，即${b > 0 ? "上" : "下"}${a > 0 ? "右" : "左"}方的象限，第 ${quad} 象限。`,
          ),
        );
        return oneOf(
          rng,
          prompt,
          right,
          wrong,
          solution,
          allQuads.map((q) => {
            const [re, im] = { I: [1, 1], II: [-1, 1], III: [-1, -1], IV: [1, -1] }[q as "I" | "II" | "III" | "IV"] as [number, number];
            return [
              `Quadrant ${q}`,
              `Quadrant ${q} has a ${re > 0 ? "positive" : "negative"} real part and a ${im > 0 ? "positive" : "negative"} imaginary part, which does not match $${a}$ and $${b}$.`,
              `第 ${q} 象限的实部为${re > 0 ? "正" : "负"}、虚部为${im > 0 ? "正" : "负"}，与 $${a}$ 和 $${b}$ 不符。`,
            ] as const;
          }),
        );
      },
    },
  ],
};

// ─── Module 10.30.2: The Magnitude of a Complex Number ───────────────────────

/** theMagnitudeOfAComplexNumber covers the modulus of a complex number and distance between two numbers. */
export const theMagnitudeOfAComplexNumber: TopicDef = {
  id: "the-magnitude-of-a-complex-number",
  title: t("The Magnitude of a Complex Number", "复数的模长"),
  summary: t(
    "Calculate the magnitude (modulus) |z| = √(a² + b²) of a complex number as its Euclidean distance from the origin, and determine the distance |z1 - z2| between two complex numbers in the complex plane.",
    "计算复数的模长（绝对值）|z| = √(a² + b²)（即到原点的欧氏距离），并求复平面上两个复数之间的距离 |z1 - z2|。",
  ),
  prerequisites: ["the-complex-plane"],
  encompasses: [{ topic: "the-complex-plane", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4", "CCSS.HSN.CN.B.6"],
  intro: t(
    `A complex number $a + bi$ is the point $(a, b)$ of the complex plane, so it has a distance from the origin. The segment from the origin to $(a, b)$ is the hypotenuse of a right triangle with legs $|a|$ and $|b|$, so the Pythagorean theorem gives that distance. For $3 + 4i$ the legs are $3$ and $4$:

$$\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$$

Check: $5^2 = 25 = 9 + 16$, so a triangle with sides $3$, $4$ and $5$ does have a right angle.

In this lesson we find the size of a complex number, its distance from $0$, and the distance between two complex numbers.`,
    `复数 $a + bi$ 是复平面上的点 $(a, b)$，所以它到原点有一个距离。从原点到 $(a, b)$ 的线段是直角三角形的斜边，两条直角边是 $|a|$ 和 $|b|$，所以勾股定理给出这个距离。对 $3 + 4i$，两条直角边是 $3$ 和 $4$：

$$\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$$

检验：$5^2 = 25 = 9 + 16$，所以边长为 $3$、$4$、$5$ 的三角形确实是直角三角形。

这节课我们求复数的大小，即它到 $0$ 的距离，以及两个复数之间的距离。`,
  ),
  knowledgePoints: [
    {
      id: "modulus-of-a-complex-number",
      title: t("Calculate the modulus of a complex number", "计算复数的模长"),
      explanation: t(
        "The **magnitude** (or **modulus**) of a complex number $z = a + bi$, denoted $|z|$, represents the Euclidean distance from the origin $(0, 0)$ to $(a, b)$ in the complex plane:\n\n$$|z| = \\sqrt{a^2 + b^2}$$\n\nNotice that $|z| \\ge 0$, and $|z| = 0$ if and only if $z = 0$. For $z = 2 - 4i$: $|z| = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$. Check: $(2\\sqrt{5})^2 = 4 \\cdot 5 = 20$.\n\n> **Watch out.** Square the imaginary part $b$, not $bi$: $(-4i)^2 = -16$ would give the wrong sum. Both squares are added, so the signs of $a$ and $b$ do not matter, and $|z|$ is not $|a| + |b|$.",
        "复数 $z = a + bi$ 的**模长**（或**绝对值**）记作 $|z|$，表示复平面中原点 $(0, 0)$ 到点 $(a, b)$ 的欧氏距离：\n\n$$|z| = \\sqrt{a^2 + b^2}$$\n\n显然 $|z| \\ge 0$，且 $|z| = 0$ 当且仅当 $z = 0$。对 $z = 2 - 4i$：$|z| = \\sqrt{4 + 16} = \\sqrt{20} = 2\\sqrt{5}$。检验：$(2\\sqrt{5})^2 = 4 \\cdot 5 = 20$。\n\n> **注意。** 平方的是虚部 $b$，而不是 $bi$：用 $(-4i)^2 = -16$ 会得到错误的和。两个平方相加，所以 $a$、$b$ 的符号无关紧要，而且 $|z|$ 不等于 $|a| + |b|$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { a: 3, b: 4, c: 5, m: 1, ans: "5", wrong: ["7", "25", "1", "\\sqrt{7}"] },
          { a: 5, b: 12, c: 13, m: 1, ans: "13", wrong: ["17", "169", "7", "\\sqrt{119}"] },
          { a: 8, b: 6, c: 10, m: 1, ans: "10", wrong: ["14", "100", "2", "\\sqrt{28}"] },
          { a: 7, b: 24, c: 25, m: 1, ans: "25", wrong: ["31", "625", "17", "\\sqrt{527}"] },
          { a: 8, b: 15, c: 17, m: 1, ans: "17", wrong: ["23", "289", "7", "\\sqrt{161}"] },
          { a: 9, b: 12, c: 15, m: 1, ans: "15", wrong: ["21", "225", "3", "\\sqrt{63}"] },
          { a: 1, b: 1, c: 1, m: 2, ans: "\\sqrt{2}", wrong: ["2", "1", "\\sqrt{3}", "4"] },
          { a: 1, b: 2, c: 1, m: 5, ans: "\\sqrt{5}", wrong: ["3", "5", "\\sqrt{3}", "1"] },
          { a: 2, b: 3, c: 1, m: 13, ans: "\\sqrt{13}", wrong: ["5", "13", "\\sqrt{5}", "1"] },
          { a: 1, b: 3, c: 1, m: 10, ans: "\\sqrt{10}", wrong: ["4", "10", "\\sqrt{8}", "2"] },
          { a: 3, b: 3, c: 3, m: 2, ans: "3\\sqrt{2}", wrong: ["6", "18", "\\sqrt{6}", "3"] },
          { a: 2, b: 4, c: 2, m: 5, ans: "2\\sqrt{5}", wrong: ["6", "20", "\\sqrt{12}", "2"] },
          { a: 1, b: 4, c: 1, m: 17, ans: "\\sqrt{17}", wrong: ["5", "17", "\\sqrt{15}", "3"] },
          { a: 2, b: 5, c: 1, m: 29, ans: "\\sqrt{29}", wrong: ["7", "29", "\\sqrt{21}", "3"] },
          { a: 4, b: 4, c: 4, m: 2, ans: "4\\sqrt{2}", wrong: ["8", "32", "16", "4"] },
          { a: 3, b: 5, c: 1, m: 34, ans: "\\sqrt{34}", wrong: ["8", "34", "\\sqrt{16}", "4"] },
        ]);
        const s1 = rng.pick([-1, 1]);
        const s2 = rng.pick([-1, 1]);
        const a = s1 * item.a;
        const b = s2 * item.b;
        const sum = a * a + b * b;
        return radicalProblem({
          prompt: t(`Find the magnitude (modulus) $|z|$ of $z = ${cx(a, b)}$.`, `求复数 $z = ${cx(a, b)}$ 的模长 $|z|$。`),
          answer: [item.c, item.m],
          wrong: item.wrong,
          solution: walked(
            [
              [
                ["Square and add the parts", "把两部分平方相加"],
                t(`The real part is $${a}$ and the imaginary part is $${b}$:`, `实部是 $${a}$，虚部是 $${b}$：`),
                [`a^2 + b^2 = (${a})^2 + (${b})^2 = ${a * a} + ${b * b} = ${sum}`],
              ],
              [
                ["Take the square root", "开平方"],
                t("Simplify the root as far as it goes:", "把根式化到最简："),
                [`|z| = \\sqrt{${sum}} = ${item.ans}`],
              ],
            ],
            t(
              `Square the answer: ${item.m === 1 ? `$${item.c}^2 = ${sum}$` : item.c === 1 ? `$(${item.ans})^2 = ${sum}$` : `$(${item.ans})^2 = ${item.c * item.c} \\cdot ${item.m} = ${sum}$`}, which is $a^2 + b^2$. The answer also lies between the longer leg $${Math.max(item.a, item.b)}$ and the sum of the legs $${item.a + item.b}$, as a hypotenuse must.`,
              `把答案平方：${item.m === 1 ? `$${item.c}^2 = ${sum}$` : item.c === 1 ? `$(${item.ans})^2 = ${sum}$` : `$(${item.ans})^2 = ${item.c * item.c} \\cdot ${item.m} = ${sum}$`}，正是 $a^2 + b^2$。答案也介于较长直角边 $${Math.max(item.a, item.b)}$ 与两直角边之和 $${item.a + item.b}$ 之间，斜边理应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "distance-between-two-complex-numbers",
      title: t("Find the distance between two complex numbers", "求两个复数之间的距离"),
      explanation: t(
        "In the complex plane, the distance between two complex numbers $z_1 = a_1 + b_1 i$ and $z_2 = a_2 + b_2 i$ is given by the modulus of their difference:\n\n$$|z_1 - z_2| = \\sqrt{(a_1 - a_2)^2 + (b_1 - b_2)^2}$$\n\nThis is identical to the Euclidean distance formula between points $(a_1, b_1)$ and $(a_2, b_2)$. For $z_1 = 4 + i$ and $z_2 = 1 - 3i$: $z_1 - z_2 = 3 + 4i$, so the distance is $5$. Check: the points $(4, 1)$ and $(1, -3)$ are $3$ apart across and $4$ apart up and down, and $\\sqrt{9 + 16} = 5$.\n\n> **Watch out.** Subtract the numbers before taking the modulus. The distance is not $|z_1| - |z_2|$: two numbers of the same size can be far apart.",
        "在复平面中，两个复数 $z_1 = a_1 + b_1 i$ 和 $z_2 = a_2 + b_2 i$ 之间的距离等于它们差的模长：\n\n$$|z_1 - z_2| = \\sqrt{(a_1 - a_2)^2 + (b_1 - b_2)^2}$$\n\n这与平面上两点 $(a_1, b_1)$ 与 $(a_2, b_2)$ 之间的欧氏距离公式完全一致。对 $z_1 = 4 + i$ 和 $z_2 = 1 - 3i$：$z_1 - z_2 = 3 + 4i$，所以距离是 $5$。检验：点 $(4, 1)$ 与 $(1, -3)$ 横向相差 $3$、纵向相差 $4$，而 $\\sqrt{9 + 16} = 5$。\n\n> **注意。** 先把两个数相减，再求模。距离不是 $|z_1| - |z_2|$：大小相同的两个数也可能相距很远。",
      ),
      generate(rng) {
        const item = rng.pick([
          { da: 3, db: 4, c: 5, m: 1, dist: "5", wrong: ["7", "25", "1", "\\sqrt{7}"] },
          { da: 4, db: 3, c: 5, m: 1, dist: "5", wrong: ["7", "25", "1", "\\sqrt{7}"] },
          { da: 6, db: 8, c: 10, m: 1, dist: "10", wrong: ["14", "100", "2", "\\sqrt{28}"] },
          { da: 5, db: 12, c: 13, m: 1, dist: "13", wrong: ["17", "169", "7", "\\sqrt{119}"] },
          { da: 1, db: 1, c: 1, m: 2, dist: "\\sqrt{2}", wrong: ["2", "1", "\\sqrt{3}", "4"] },
          { da: 1, db: 2, c: 1, m: 5, dist: "\\sqrt{5}", wrong: ["3", "5", "\\sqrt{3}", "1"] },
          { da: 2, db: 3, c: 1, m: 13, dist: "\\sqrt{13}", wrong: ["5", "13", "\\sqrt{5}", "1"] },
          { da: 1, db: 3, c: 1, m: 10, dist: "\\sqrt{10}", wrong: ["4", "10", "\\sqrt{8}", "2"] },
          { da: 2, db: 2, c: 2, m: 2, dist: "2\\sqrt{2}", wrong: ["4", "8", "\\sqrt{4}", "2"] },
        ]);
        const sa = rng.pick([-1, 1]);
        const sb = rng.pick([-1, 1]);
        const da = sa * item.da;
        const db = sb * item.db;
        const x2 = rng.int(-5, 5);
        const y2 = rng.int(-5, 5);
        const x1 = x2 + da;
        const y1 = y2 + db;
        const sq = da * da + db * db;
        return radicalProblem({
          prompt: t(
            `Find the distance $|z_1 - z_2|$ between $z_1 = ${cx(x1, y1)}$ and $z_2 = ${cx(x2, y2)}$ in the complex plane.`,
            `求复平面上 $z_1 = ${cx(x1, y1)}$ 与 $z_2 = ${cx(x2, y2)}$ 之间的距离 $|z_1 - z_2|$。`,
          ),
          answer: [item.c, item.m],
          wrong: item.wrong,
          solution: walked(
            [
              [
                ["Subtract", "相减"],
                t("Subtract the real parts and the imaginary parts separately:", "实部与实部相减，虚部与虚部相减："),
                [`z_1 - z_2 = (${cx(x1, y1)}) - (${cx(x2, y2)}) = ${cx(da, db)}`],
              ],
              [
                ["Take the modulus", "求模"],
                t("The distance is the modulus of the difference:", "距离就是差的模："),
                [`|z_1 - z_2| = \\sqrt{(${da})^2 + (${db})^2} = \\sqrt{${sq}} = ${item.dist}`],
              ],
            ],
            t(
              `Subtract the other way: $z_2 - z_1 = ${cx(-da, -db)}$. Its parts have the opposite signs, so their squares are the same, and $\\sqrt{${sq}} = ${item.dist}$ again, as a distance must not depend on the order.`,
              `换个顺序相减：$z_2 - z_1 = ${cx(-da, -db)}$。它的两部分符号相反，平方不变，所以仍得 $\\sqrt{${sq}} = ${item.dist}$；距离本来就与顺序无关。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.30.3: The Argument of a Complex Number ─────────────────────────

/** theArgumentOfAComplexNumber covers the principal argument in [0, 2π) or (-π, π]. */
export const theArgumentOfAComplexNumber: TopicDef = {
  id: "the-argument-of-a-complex-number",
  title: t("The Argument of a Complex Number", "复数的辐角与主辐角"),
  summary: t(
    "Determine the principal argument arg(z) of a complex number z = a + bi in [0, 2π) or (-π, π] using reference angles and quadrant rules.",
    "利用参考角与象限法则，确定复数 z = a + bi 在 [0, 2π) 或 (-π, π] 内的辐角与主辐角 arg(z)。",
  ),
  prerequisites: ["the-magnitude-of-a-complex-number"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  intro: t(
    `The modulus $|z|$ says how far the point of $z$ is from the origin, but not in which direction. The direction is an angle, measured counterclockwise from the positive real axis to the segment from $0$ to $z$. For $z = 2 + 2i$ the point $(2, 2)$ lies on the line $y = x$, halfway between the two positive axes, so the angle is $\\frac{\\pi}{4}$, that is $45^\\circ$.

Check: the triangle from the origin to $(2, 0)$ and up to $(2, 2)$ has equal legs, so its angle at the origin is $45^\\circ$, and $\\tan 45^\\circ = \\frac{2}{2} = 1$.

In this lesson we find this angle, the argument of a complex number, in every quadrant.`,
    `模 $|z|$ 说明 $z$ 的点离原点有多远，却不说明在哪个方向。方向是一个角：从正实轴出发，按逆时针转到从 $0$ 到 $z$ 的线段。对 $z = 2 + 2i$，点 $(2, 2)$ 在直线 $y = x$ 上，正好在两条正半轴的中间，所以这个角是 $\\frac{\\pi}{4}$，即 $45^\\circ$。

检验：从原点到 $(2, 0)$ 再向上到 $(2, 2)$ 的三角形两条直角边相等，所以它在原点处的角是 $45^\\circ$，而 $\\tan 45^\\circ = \\frac{2}{2} = 1$。

这节课我们在每个象限中求这个角，即复数的辐角。`,
  ),
  knowledgePoints: [
    {
      id: "argument-of-special-complex-numbers",
      figure: precalculusDrawings3["the-argument-of-a-complex-number#argument-of-special-complex-numbers"],
      title: t("Find the principal argument of special complex numbers", "求特殊复数的主辐角"),
      explanation: t(
        "The **argument** $\\theta = \\arg(z)$ of a nonzero complex number $z = a + bi$ is the angle made by the position vector of $z$ with the positive real axis.\n\nThe **principal argument** is conventionally chosen in $[0, 2\\pi)$ (or $(-\\pi, \\pi]$).\n\nFor standard angles:\n- $z = 1 + i \\implies \\theta = \\frac{\\pi}{4}$\n- $z = -1 + i \\implies \\theta = \\frac{3\\pi}{4}$\n- $z = -1 - i \\implies \\theta = \\frac{5\\pi}{4}$\n- $z = 1 - i \\implies \\theta = \\frac{7\\pi}{4}$\n- $z = \\sqrt{3} + i \\implies \\theta = \\frac{\\pi}{6}$\n- $z = 1 + \\sqrt{3}i \\implies \\theta = \\frac{\\pi}{3}$\n\nFor example, $z = -\\sqrt{3} + i$ is in Quadrant II with reference angle $\\frac{\\pi}{6}$, so $\\theta = \\pi - \\frac{\\pi}{6} = \\frac{5\\pi}{6}$. Check: $\\cos\\frac{5\\pi}{6} = -\\frac{\\sqrt{3}}{2}$ and $\\sin\\frac{5\\pi}{6} = \\frac{1}{2}$, and doubling these gives the parts $-\\sqrt{3}$ and $1$.\n\n> **Watch out.** The reference angle alone is not the argument: first find the quadrant from the signs of $a$ and $b$. Also $\\sqrt{3} + i$ and $1 + \\sqrt{3}i$ have different angles, $\\frac{\\pi}{6}$ and $\\frac{\\pi}{3}$: the larger part decides which is nearer.",
        "非零复数 $z = a + bi$ 的**辐角** $\\theta = \\arg(z)$ 是其位置向量与正实轴之间的夹角。\n\n**主辐角**通常取值在 $[0, 2\\pi)$（或 $(-\\pi, \\pi]$）内。\n\n常见特殊角的辐角：\n- $z = 1 + i \\implies \\theta = \\frac{\\pi}{4}$\n- $z = -1 + i \\implies \\theta = \\frac{3\\pi}{4}$\n- $z = -1 - i \\implies \\theta = \\frac{5\\pi}{4}$\n- $z = 1 - i \\implies \\theta = \\frac{7\\pi}{4}$\n- $z = \\sqrt{3} + i \\implies \\theta = \\frac{\\pi}{6}$\n- $z = 1 + \\sqrt{3}i \\implies \\theta = \\frac{\\pi}{3}$\n\n例如，$z = -\\sqrt{3} + i$ 在第二象限，参考角是 $\\frac{\\pi}{6}$，所以 $\\theta = \\pi - \\frac{\\pi}{6} = \\frac{5\\pi}{6}$。检验：$\\cos\\frac{5\\pi}{6} = -\\frac{\\sqrt{3}}{2}$，$\\sin\\frac{5\\pi}{6} = \\frac{1}{2}$，把它们乘以 $2$ 就得到两部分 $-\\sqrt{3}$ 和 $1$。\n\n> **注意。** 参考角本身不是辐角：先由 $a$、$b$ 的符号确定象限。另外 $\\sqrt{3} + i$ 和 $1 + \\sqrt{3}i$ 的角不同，分别是 $\\frac{\\pi}{6}$ 和 $\\frac{\\pi}{3}$：哪一部分大，角就更靠近哪条轴。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          { expr: `${k}`, ans: "0", wrong: ["\\pi", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"] },
          { expr: `${kStr}i`, ans: "\\frac{\\pi}{2}", wrong: ["\\pi", "\\frac{3\\pi}{2}", "0"] },
          { expr: `-${k}`, ans: "\\pi", wrong: ["0", "\\frac{\\pi}{2}", "\\frac{3\\pi}{2}"] },
          { expr: `-${kStr}i`, ans: "\\frac{3\\pi}{2}", wrong: ["\\frac{\\pi}{2}", "\\pi", "0"] },
          { expr: `${k} + ${kStr}i`, ans: "\\frac{\\pi}{4}", wrong: ["\\frac{3\\pi}{4}", "\\frac{7\\pi}{4}", "\\frac{\\pi}{3}"] },
          { expr: `-${k} + ${kStr}i`, ans: "\\frac{3\\pi}{4}", wrong: ["\\frac{\\pi}{4}", "\\frac{5\\pi}{4}", "\\frac{2\\pi}{3}"] },
          { expr: `-${k} - ${kStr}i`, ans: "\\frac{5\\pi}{4}", wrong: ["\\frac{3\\pi}{4}", "\\frac{7\\pi}{4}", "\\frac{\\pi}{4}"] },
          { expr: `${k} - ${kStr}i`, ans: "\\frac{7\\pi}{4}", wrong: ["\\frac{\\pi}{4}", "\\frac{5\\pi}{4}", "\\frac{3\\pi}{4}"] },
          {
            expr: `${k === 1 ? "" : k}\\sqrt{3} + ${kStr}i`,
            ans: "\\frac{\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{11\\pi}{6}"],
          },
          {
            expr: `${k} + ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{4\\pi}{3}"],
          },
          {
            expr: `-${k} + ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}", "\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}"],
          },
          {
            expr: `-${k === 1 ? "" : k}\\sqrt{3} + ${kStr}i`,
            ans: "\\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}", "\\frac{2\\pi}{3}", "\\frac{7\\pi}{6}"],
          },
          {
            expr: `-${k === 1 ? "" : k}\\sqrt{3} - ${kStr}i`,
            ans: "\\frac{7\\pi}{6}",
            wrong: ["\\frac{5\\pi}{6}", "\\frac{4\\pi}{3}", "\\frac{11\\pi}{6}"],
          },
          {
            expr: `-${k} - ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{4\\pi}{3}",
            wrong: ["\\frac{2\\pi}{3}", "\\frac{5\\pi}{3}", "\\frac{7\\pi}{6}"],
          },
          {
            expr: `${k} - ${k === 1 ? "" : k}\\sqrt{3}i`,
            ans: "\\frac{5\\pi}{3}",
            wrong: ["\\frac{4\\pi}{3}", "\\frac{\\pi}{3}", "\\frac{11\\pi}{6}"],
          },
          {
            expr: `${k === 1 ? "" : k}\\sqrt{3} - ${kStr}i`,
            ans: "\\frac{11\\pi}{6}",
            wrong: ["\\frac{7\\pi}{6}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{6}"],
          },
        ]);
        const prompt = t(
          `Find the principal argument $\\theta = \\arg(z) \\in [0, 2\\pi)$ of $z = ${item.expr}$.`,
          `求复数 $z = ${item.expr}$ 在 $[0, 2\\pi)$ 内的主辐角 $\\theta = \\arg(z)$。`,
        );
        const right = t(`$\\theta = ${item.ans}$`, `$\\theta = ${item.ans}$`);
        const wrong = item.wrong.map((w) => t(`$\\theta = ${w}$`, `$\\theta = ${w}$`));
        const place = specialAngles[item.ans]!;
        const quadrantNames = ["I", "II", "III", "IV"];
        const quadrantNamesZh = ["一", "二", "三", "四"];
        const home = (p: SpecialAngle): [string, string] =>
          p.quadrant === 0
            ? [`on ${p.axis[0]}`, `在${p.axis[1]}上`]
            : [`in Quadrant ${quadrantNames[p.quadrant - 1]}`, `在第${quadrantNamesZh[p.quadrant - 1]}象限`];
        const [homeEn, homeZh] = home(place);
        const solution = walked(
          place.quadrant === 0
            ? [
                [
                  ["Locate the point", "确定点的位置"],
                  t(
                    `One part of $z = ${item.expr}$ is $0$, so its point lies on ${place.axis[0]}.`,
                    `$z = ${item.expr}$ 有一部分是 $0$，所以它的点在${place.axis[1]}上。`,
                  ),
                ],
                [
                  ["Read the angle", "读出角"],
                  t(
                    `Turning counterclockwise from the positive real axis to ${place.axis[0]} takes $${item.ans}$:`,
                    `从正实轴按逆时针转到${place.axis[1]}，转过 $${item.ans}$：`,
                  ),
                  [`\\theta = ${item.ans}`],
                ],
              ]
            : [
                [
                  ["Find the quadrant", "确定象限"],
                  t(
                    `The signs of the real and imaginary parts put $z = ${item.expr}$ ${homeEn}.`,
                    `实部和虚部的符号说明 $z = ${item.expr}$ ${homeZh}。`,
                  ),
                ],
                [
                  ["Use the reference angle", "用参考角"],
                  t(
                    `The ratio of the sizes of the parts gives the reference angle $${place.ref}$. There the argument is`,
                    `两部分大小之比给出参考角 $${place.ref}$。在这个象限中，辐角是`,
                  ),
                  [`\\theta = ${place.rule} = ${item.ans}`],
                ],
              ],
          t(
            `The direction at angle $${item.ans}$ is $(\\cos\\theta, \\sin\\theta) = (${place.cos}, ${place.sin})$. Multiplying it by $|z|$ must give the parts of $z$, so its signs and the ratio of its sizes must match theirs, and they do for $${item.expr}$.`,
            `角 $${item.ans}$ 的方向是 $(\\cos\\theta, \\sin\\theta) = (${place.cos}, ${place.sin})$。把它乘以 $|z|$ 应得到 $z$ 的两部分，所以它的符号和大小之比必须与之相同，$${item.expr}$ 正是如此。`,
          ),
        );
        const reasons = item.wrong.map((w) => {
          const p = specialAngles[w]!;
          const [en, zh] = home(p);
          return p.quadrant === place.quadrant && p.quadrant !== 0
            ? why(
                t(`$\\theta = ${w}$`, `$\\theta = ${w}$`),
                `This is in the right quadrant, but its reference angle is ${p.ref.replace(/\\frac\{(.*?)\}\{(.*?)\}/, "$1/$2").replace("\\pi", "π")}, which does not match the ratio of the sizes of the parts of z.`,
                `象限对了，但它的参考角是 ${p.ref.replace(/\\frac\{(.*?)\}\{(.*?)\}/, "$1/$2").replace("\\pi", "π")}，与 z 两部分大小之比不符。`,
              )
            : why(
                t(`$\\theta = ${w}$`, `$\\theta = ${w}$`),
                `This angle points to a direction ${en}, but z is ${homeEn}: the signs of its parts do not match.`,
                `这个角指向的方向${zh}，但 z ${homeZh}：两部分的符号不符。`,
              );
        });
        return oneOf(rng, prompt, right, wrong, solution, reasons);
      },
    },
    {
      id: "argument-quadrant-rules",
      figure: precalculusDrawings4["the-argument-of-a-complex-number#argument-quadrant-rules"],
      title: t("Quadrant adjustment rules for argument", "辐角的象限转换法则"),
      explanation: t(
        "To find the argument $\\theta \\in [0^\\circ, 360^\\circ)$ of $z = a + bi$, first compute the acute reference angle $\\alpha = \\arctan\\left(\\left|\\frac{b}{a}\\right|\\right)$:\n\n- **Quadrant I** ($a > 0, b > 0$): $\\theta = \\alpha$\n- **Quadrant II** ($a < 0, b > 0$): $\\theta = 180^\\circ - \\alpha$\n- **Quadrant III** ($a < 0, b < 0$): $\\theta = 180^\\circ + \\alpha$\n- **Quadrant IV** ($a > 0, b < 0$): $\\theta = 360^\\circ - \\alpha$\n\nFor $z = -3 - 3i$: $\\alpha = \\arctan 1 = 45^\\circ$ and $z$ is in Quadrant III, so $\\theta = 180^\\circ + 45^\\circ = 225^\\circ$. Check: $225^\\circ$ lies between $180^\\circ$ and $270^\\circ$, which is Quadrant III.\n\n> **Watch out.** A calculator's $\\arctan\\frac{b}{a}$ only returns angles between $-90^\\circ$ and $90^\\circ$, so it is wrong whenever $a < 0$. Always place the point in its quadrant first.",
        "求 $z = a + bi$ 在 $[0^\\circ, 360^\\circ)$ 内的辐角 $\\theta$ 时，先求锐角参考角 $\\alpha = \\arctan\\left(\\left|\\frac{b}{a}\\right|\\right)$：\n\n- **第一象限**（$a > 0, b > 0$）：$\\theta = \\alpha$\n- **第二象限**（$a < 0, b > 0$）：$\\theta = 180^\\circ - \\alpha$\n- **第三象限**（$a < 0, b < 0$）：$\\theta = 180^\\circ + \\alpha$\n- **第四象限**（$a > 0, b < 0$）：$\\theta = 360^\\circ - \\alpha$\n\n对 $z = -3 - 3i$：$\\alpha = \\arctan 1 = 45^\\circ$，$z$ 在第三象限，所以 $\\theta = 180^\\circ + 45^\\circ = 225^\\circ$。检验：$225^\\circ$ 介于 $180^\\circ$ 与 $270^\\circ$ 之间，正是第三象限。\n\n> **注意。** 计算器的 $\\arctan\\frac{b}{a}$ 只给出 $-90^\\circ$ 到 $90^\\circ$ 之间的角，所以 $a < 0$ 时一定不对。总要先确定点所在的象限。",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const quad = a > 0 ? (b > 0 ? "I" : "IV") : b > 0 ? "II" : "III";
        const prompt = t(
          `For the complex number $z = ${cx(a, b)}$, which formula correctly expresses its argument $\\theta \\in [0^\\circ, 360^\\circ)$ in terms of the reference angle $\\alpha = \\arctan\\left(\\frac{|b|}{|a|}\\right)$?`,
          `对于复数 $z = ${cx(a, b)}$，哪一个公式正确地利用参考角 $\\alpha = \\arctan\\left(\\frac{|b|}{|a|}\\right)$ 表示其辐角 $\\theta \\in [0^\\circ, 360^\\circ)$？`,
        );
        const map: Record<string, string> = {
          I: "\\theta = \\alpha",
          II: "\\theta = 180^\\circ - \\alpha",
          III: "\\theta = 180^\\circ + \\alpha",
          IV: "\\theta = 360^\\circ - \\alpha",
        };
        const range: Record<string, [string, string, string, string]> = {
          I: ["0^\\circ", "90^\\circ", "positive", "positive"],
          II: ["90^\\circ", "180^\\circ", "negative", "positive"],
          III: ["180^\\circ", "270^\\circ", "negative", "negative"],
          IV: ["270^\\circ", "360^\\circ", "positive", "negative"],
        };
        const zhSign = (s: string) => (s === "positive" ? "正" : "负");
        const right = t(`$${map[quad]}$`, `$${map[quad]}$`);
        const wrongQuads = ["I", "II", "III", "IV"].filter((q) => q !== quad);
        const wrong = wrongQuads.map((q) => t(`$${map[q]}$`, `$${map[q]}$`));
        const [lo, hi] = range[quad]!;
        const solution = walked(
          [
            [
              ["Find the quadrant", "确定象限"],
              t(
                `Since $a = ${a}$ is ${a > 0 ? "positive" : "negative"} and $b = ${b}$ is ${b > 0 ? "positive" : "negative"}, $z$ lies in Quadrant ${quad}.`,
                `因为 $a = ${a}$ 为${a > 0 ? "正" : "负"}，$b = ${b}$ 为${b > 0 ? "正" : "负"}，所以 $z$ 位于第 ${quad} 象限。`,
              ),
            ],
            [
              ["Turn by the reference angle", "按参考角转动"],
              t(
                quad === "I"
                  ? "In Quadrant I the angle from the positive real axis is the reference angle itself:"
                  : quad === "II"
                    ? "In Quadrant II the point is $\\alpha$ short of the negative real axis at $180^\\circ$:"
                    : quad === "III"
                      ? "In Quadrant III the point is $\\alpha$ past the negative real axis at $180^\\circ$:"
                      : "In Quadrant IV the point is $\\alpha$ short of a full turn of $360^\\circ$:",
                quad === "I"
                  ? "在第一象限，从正实轴量起的角就是参考角本身："
                  : quad === "II"
                    ? "在第二象限，点比 $180^\\circ$ 处的负实轴少转 $\\alpha$："
                    : quad === "III"
                      ? "在第三象限，点比 $180^\\circ$ 处的负实轴多转 $\\alpha$："
                      : "在第四象限，点比转满一周 $360^\\circ$ 少转 $\\alpha$：",
              ),
              [map[quad]!],
            ],
          ],
          t(
            `Since $0^\\circ < \\alpha < 90^\\circ$, the formula gives an angle between $${lo}$ and $${hi}$, which is exactly Quadrant ${quad}.`,
            `因为 $0^\\circ < \\alpha < 90^\\circ$，这个公式给出的角介于 $${lo}$ 与 $${hi}$ 之间，正是第 ${quad} 象限。`,
          ),
        );
        const reasons = wrongQuads.map((q) => {
          const [, , re, im] = range[q]!;
          return why(
            t(`$${map[q]}$`, `$${map[q]}$`),
            `This is the rule for Quadrant ${q}, where the real part is ${re} and the imaginary part is ${im}; here a = ${a} and b = ${b}.`,
            `这是第 ${q} 象限的法则，那里实部为${zhSign(re)}、虚部为${zhSign(im)}；这里 a = ${a}，b = ${b}。`,
          );
        });
        return oneOf(rng, prompt, right, wrong, solution, reasons);
      },
    },
  ],
};

// ─── Module 10.30.4: Arithmetic in the Complex Plane ─────────────────────────

/** arithmeticInTheComplexPlane covers vector addition and subtraction in the complex plane. */
export const arithmeticInTheComplexPlane: TopicDef = {
  id: "arithmetic-in-the-complex-plane",
  title: t("Arithmetic in the Complex Plane", "复平面中的复数加减与几何对应"),
  summary: t(
    "Interpret complex addition and subtraction geometrically as vector addition (parallelogram rule) and displacement vectors in the complex plane.",
    "在复平面中将复数的加减法解释为向量加法（平行四边形法则）和位移向量。",
  ),
  prerequisites: ["the-argument-of-a-complex-number"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5"],
  intro: t(
    `A complex number has a length, its modulus, and a direction, its argument, so it can be drawn as an arrow from the origin to its point, just like a vector. Complex numbers are added by adding real parts and imaginary parts, which is exactly how vectors are added component by component. For example:

$$(1 + 2i) + (3 + i) = 4 + 3i$$

Check: start at the origin, follow the arrow of $1 + 2i$ to $(1, 2)$, then go $3$ right and $1$ up for $3 + i$. You arrive at $(4, 3)$, the point of $4 + 3i$.

In this lesson we read sums, differences and midpoints of complex numbers as moves in the plane.`,
    `复数有长度（模）和方向（辐角），所以可以像向量一样，画成从原点指向它的点的箭头。复数相加是实部加实部、虚部加虚部，这正是向量按分量相加的方式。例如：

$$(1 + 2i) + (3 + i) = 4 + 3i$$

检验：从原点出发，沿 $1 + 2i$ 的箭头走到 $(1, 2)$，再按 $3 + i$ 向右 $3$、向上 $1$。最后到达 $(4, 3)$，正是 $4 + 3i$ 的点。

这节课我们把复数的和、差与中点看作平面上的移动。`,
  ),
  knowledgePoints: [
    {
      id: "parallelogram-rule-for-complex-addition",
      figure: precalculusDrawings3["arithmetic-in-the-complex-plane#parallelogram-rule-for-complex-addition"],
      title: t("Parallelogram rule for complex addition", "复数加法的平行四边形法则"),
      explanation: t(
        "Adding two complex numbers $z_1 = a_1 + b_1 i$ and $z_2 = a_2 + b_2 i$ corresponds to vector addition in $\\mathbb{R}^2$:\n\n$$z_1 + z_2 = (a_1 + a_2) + (b_1 + b_2)i$$\n\nGeometrically, the origin $0$, $z_1$, $z_2$, and the sum $z_1 + z_2$ form the four vertices of a **parallelogram** in the complex plane. For $z_1 = 3 + i$ and $z_2 = 1 + 2i$ the fourth vertex is $4 + 3i$. Check: the side from $z_2$ to $4 + 3i$ is $3 + i$, the same as the side from $0$ to $z_1$, so opposite sides match.\n\n> **Watch out.** The vertex opposite the origin is the sum $z_1 + z_2$. The difference $z_1 - z_2$ is the other diagonal moved to the origin, not a vertex of this parallelogram.",
        "两个复数 $z_1 = a_1 + b_1 i$ 与 $z_2 = a_2 + b_2 i$ 的加法对应于 $\\mathbb{R}^2$ 中的向量加法：\n\n$$z_1 + z_2 = (a_1 + a_2) + (b_1 + b_2)i$$\n\n在几何上，原点 $0$、$z_1$、$z_2$ 以及和 $z_1 + z_2$ 构成了复平面上一个**平行四边形**的四个顶点。对 $z_1 = 3 + i$ 和 $z_2 = 1 + 2i$，第四个顶点是 $4 + 3i$。检验：从 $z_2$ 到 $4 + 3i$ 的边是 $3 + i$，与从 $0$ 到 $z_1$ 的边相同，所以对边相等。\n\n> **注意。** 与原点相对的顶点是和 $z_1 + z_2$。差 $z_1 - z_2$ 是另一条对角线平移到原点后的结果，不是这个平行四边形的顶点。",
      ),
      generate(rng) {
        const a1 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const b1 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const a2 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const b2 = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const sumA = a1 + a2;
        const sumB = b1 + b2;
        return expressionProblem({
          prompt: t(
            `In the complex plane, the origin $0$, $z_1 = ${cx(a1, b1)}$, and $z_2 = ${cx(a2, b2)}$ form three vertices of a parallelogram. Find the complex number (in the form $a + bi$) that represents the fourth vertex opposite the origin.`,
            `在复平面中，原点 $0$、$z_1 = ${cx(a1, b1)}$ 和 $z_2 = ${cx(a2, b2)}$ 是一个平行四边形的三个顶点。求与原点相对的第四个顶点对应的复数（写成 $a + bi$ 形式）。`,
          ),
          answer: cx(sumA, sumB),
          simplified: true,
          wrong: [cx(a1 - a2, b1 - b2), cx(a2 - a1, b2 - b1), cx(sumA, -sumB), cx(-sumA, sumB)],
          solution: walked(
            [
              [
                ["Use the parallelogram rule", "用平行四边形法则"],
                t(
                  "The vertex opposite the origin is reached by following $z_1$ and then $z_2$, so it is the sum $z_1 + z_2$.",
                  "与原点相对的顶点是先沿 $z_1$ 再沿 $z_2$ 走到的点，所以它是和 $z_1 + z_2$。",
                ),
              ],
              [
                ["Add the parts", "把各部分相加"],
                t("Add the real parts and the imaginary parts:", "实部相加，虚部相加："),
                [
                  `z_1 + z_2 = (${a1} ${a2 < 0 ? "-" : "+"} ${Math.abs(a2)}) + (${b1} ${b2 < 0 ? "-" : "+"} ${Math.abs(b2)})i = ${cx(sumA, sumB)}`,
                ],
              ],
            ],
            t(
              `The diagonals of a parallelogram bisect each other. The midpoint of $0$ and $${cx(sumA, sumB)}$ is $(${formatFraction(sumA, 2)}, ${formatFraction(sumB, 2)})$, and the midpoint of $z_1$ and $z_2$ is the same point, since it is also half of $z_1 + z_2$.`,
              `平行四边形的对角线互相平分。$0$ 与 $${cx(sumA, sumB)}$ 的中点是 $(${formatFraction(sumA, 2)}, ${formatFraction(sumB, 2)})$，而 $z_1$ 与 $z_2$ 的中点也是这个点，因为它同样是 $z_1 + z_2$ 的一半。`,
            ),
          ),
        });
      },
    },
    {
      id: "complex-subtraction-as-displacement-and-midpoint",
      title: t("Subtraction as displacement and midpoint formula", "减法位移向量与中点公式"),
      explanation: t(
        "For complex numbers $z_1$ and $z_2$:\n\n- The difference $z_2 - z_1$ represents the **displacement vector** from $z_1$ to $z_2$.\n- The **midpoint** of the segment joining $z_1$ and $z_2$ is given by the average:\n\n$$M = \\frac{z_1 + z_2}{2}$$\n\nFor $z_1 = 1 + 2i$ and $z_2 = 5 - 4i$: the displacement is $z_2 - z_1 = 4 - 6i$ and the midpoint is $3 - i$. Check: $z_1 + \\frac{1}{2}(4 - 6i) = 1 + 2i + 2 - 3i = 3 - i$, halfway along the displacement.\n\n> **Watch out.** The displacement from $z_1$ to $z_2$ is $z_2 - z_1$, end minus start; $z_1 - z_2$ points the other way. For the midpoint, add before halving; do not halve the difference.",
        "对于复数 $z_1$ 和 $z_2$：\n\n- 差 $z_2 - z_1$ 表示从 $z_1$ 指向 $z_2$ 的**位移向量**。\n- 连接 $z_1$ 与 $z_2$ 的线段**中点**由平均数给出：\n\n$$M = \\frac{z_1 + z_2}{2}$$\n\n对 $z_1 = 1 + 2i$ 和 $z_2 = 5 - 4i$：位移是 $z_2 - z_1 = 4 - 6i$，中点是 $3 - i$。检验：$z_1 + \\frac{1}{2}(4 - 6i) = 1 + 2i + 2 - 3i = 3 - i$，正好是位移的一半处。\n\n> **注意。** 从 $z_1$ 到 $z_2$ 的位移是 $z_2 - z_1$，终点减起点；$z_1 - z_2$ 方向相反。求中点要先相加再除以 $2$，不要把差除以 $2$。",
      ),
      generate(rng) {
        const isMidpoint = rng.bool();
        if (isMidpoint) {
          const mx = rng.int(-6, 6);
          const my = rng.int(-6, 6);
          const dx = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          const dy = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          const a1 = mx - dx;
          const b1 = my - dy;
          const a2 = mx + dx;
          const b2 = my + dy;
          return expressionProblem({
            prompt: t(
              `Find the complex number (in the form $a + bi$) representing the midpoint of the line segment joining $z_1 = ${cx(a1, b1)}$ and $z_2 = ${cx(a2, b2)}$ in the complex plane.`,
              `求复平面中连接 $z_1 = ${cx(a1, b1)}$ 与 $z_2 = ${cx(a2, b2)}$ 的线段中点对应的复数（写成 $a + bi$ 形式）。`,
            ),
            answer: cx(mx, my),
            simplified: true,
            wrong: [cx(mx, -my), cx(2 * dx, 2 * dy), cx(-mx, my), cx(my, mx), cx(dx, dy)],
            solution: walked(
              [
                [
                  ["Add the two numbers", "把两个数相加"],
                  t("Add the real parts and the imaginary parts:", "实部相加，虚部相加："),
                  [`z_1 + z_2 = (${cx(a1, b1)}) + (${cx(a2, b2)}) = ${cx(2 * mx, 2 * my)}`],
                ],
                [
                  ["Halve the sum", "把和除以 2"],
                  t("The midpoint is the average:", "中点是平均数："),
                  [`M = \\frac{${cx(2 * mx, 2 * my)}}{2} = ${cx(mx, my)}`],
                ],
              ],
              t(
                `The midpoint is equally far along from each end. Here $M - z_1 = ${cx(dx, dy)}$ and $z_2 - M = ${cx(dx, dy)}$ are the same displacement, so $M$ is halfway.`,
                `中点到两端走的路程一样。这里 $M - z_1 = ${cx(dx, dy)}$，$z_2 - M = ${cx(dx, dy)}$，是同一个位移，所以 $M$ 正在中间。`,
              ),
            ),
          });
        }
        const a1 = rng.int(-5, 5);
        const b1 = rng.int(-5, 5);
        const a2raw = rng.int(-5, 5);
        const b2 = rng.int(-5, 5);
        // Keep the two points apart, so the displacement is not zero.
        const a2 = a2raw === a1 && b2 === b1 ? a2raw + 1 : a2raw;
        const diffA = a2 - a1;
        const diffB = b2 - b1;
        return expressionProblem({
          prompt: t(
            `Find the complex number $z_2 - z_1$ (in the form $a + bi$) representing the displacement from $z_1 = ${cx(a1, b1)}$ to $z_2 = ${cx(a2, b2)}$.`,
            `求表示从 $z_1 = ${cx(a1, b1)}$ 指向 $z_2 = ${cx(a2, b2)}$ 的位移复数 $z_2 - z_1$（写成 $a + bi$ 形式）。`,
          ),
          answer: cx(diffA, diffB),
          simplified: true,
          wrong: [cx(-diffA, -diffB), cx(a1 + a2, b1 + b2), cx(diffA, -diffB), cx(-diffA, diffB)],
          solution: walked(
            [
              [
                ["Set up end minus start", "终点减起点"],
                t("The displacement from $z_1$ to $z_2$ is $z_2 - z_1$:", "从 $z_1$ 到 $z_2$ 的位移是 $z_2 - z_1$："),
                [`z_2 - z_1 = (${cx(a2, b2)}) - (${cx(a1, b1)})`],
              ],
              [
                ["Subtract the parts", "各部分相减"],
                t("Subtract the real parts and the imaginary parts:", "实部相减，虚部相减："),
                [`(${a2} - ${cxPar(a1, 0)}) + (${b2} - ${cxPar(b1, 0)})i = ${cx(diffA, diffB)}`],
              ],
            ],
            t(
              `Start at $z_1$ and move by the displacement: $(${cx(a1, b1)}) + (${cx(diffA, diffB)}) = ${cx(a2, b2)}$, which is $z_2$.`,
              `从 $z_1$ 出发，按这个位移移动：$(${cx(a1, b1)}) + (${cx(diffA, diffB)}) = ${cx(a2, b2)}$，正是 $z_2$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.30.5: Geometry in the Complex Plane ───────────────────────────

/** geometryInTheComplexPlane covers circles and perpendicular bisectors as loci in the complex plane. */
export const geometryInTheComplexPlane: TopicDef = {
  id: "geometry-in-the-complex-plane",
  title: t("Geometry in the Complex Plane", "复平面上的几何轨迹与图形"),
  summary: t(
    "Identify and describe loci of equations and inequalities in the complex plane, including circles |z - z0| = r and perpendicular bisectors |z - z1| = |z - z2|.",
    "识别并描述复平面中方程与不等式的几何轨迹，包括圆 |z - z0| = r 和垂直平分线 |z - z1| = |z - z2|。",
  ),
  prerequisites: ["arithmetic-in-the-complex-plane"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5", "CCSS.HSG.GPE.A.1"],
  intro: t(
    `The difference $z - w$ is the displacement from $w$ to $z$, so its modulus $|z - w|$ is the distance between the two points. An equation about such distances describes a set of points, a locus. For example, the points $z$ with $|z - 1| = 2$ are those at distance $2$ from the point $1$, which form a circle. One of them is $z = 3$.

Check: $|3 - 1| = |2| = 2$, and the point $(3, 0)$ is indeed $2$ to the right of $(1, 0)$.

In this lesson we recognize circles and perpendicular bisectors from equations in $z$ and write their Cartesian equations.`,
    `差 $z - w$ 是从 $w$ 到 $z$ 的位移，所以它的模 $|z - w|$ 就是两点之间的距离。关于这种距离的方程描述了一个点集，即轨迹。例如，满足 $|z - 1| = 2$ 的点 $z$ 到点 $1$ 的距离都是 $2$，它们构成一个圆。其中一个点是 $z = 3$。

检验：$|3 - 1| = |2| = 2$，点 $(3, 0)$ 确实在 $(1, 0)$ 右边 $2$ 处。

这节课我们从关于 $z$ 的方程认出圆和垂直平分线，并写出它们的直角坐标方程。`,
  ),
  knowledgePoints: [
    {
      id: "circle-locus-in-the-complex-plane",
      figure: precalculusDrawings3["geometry-in-the-complex-plane#circle-locus-in-the-complex-plane"],
      title: t("Circles in the complex plane", "复平面中的圆轨迹"),
      explanation: t(
        "The equation $|z - z_0| = r$ (with $r > 0$) represents the set of all points $z$ whose distance from $z_0 = h + ki$ is equal to $r$.\n\nIn Cartesian coordinates, this is a **circle** with center $(h, k)$ and radius $r$:\n\n$$(x - h)^2 + (y - k)^2 = r^2$$\n\nFor example, $|z - (2 - 3i)| = 4$ is the circle with center $(2, -3)$ and radius $4$. Check: $z = 6 - 3i$ is on it, since $|(6 - 3i) - (2 - 3i)| = |4| = 4$.\n\n> **Watch out.** The center is the number being subtracted, with its own signs: $|z + 1 - i| = |z - (-1 + i)|$ has center $(-1, 1)$. The radius is $r$ itself; $r^2$ appears only in the Cartesian equation.",
        "方程 $|z - z_0| = r$（其中 $r > 0$）表示到定点 $z_0 = h + ki$ 的距离等于 $r$ 的所有点 $z$ 的集合。\n\n在笛卡尔坐标系中，这是一个以 $(h, k)$ 为圆心、以 $r$ 为半径的**圆**：\n\n$$(x - h)^2 + (y - k)^2 = r^2$$\n\n例如，$|z - (2 - 3i)| = 4$ 是圆心为 $(2, -3)$、半径为 $4$ 的圆。检验：$z = 6 - 3i$ 在圆上，因为 $|(6 - 3i) - (2 - 3i)| = |4| = 4$。\n\n> **注意。** 圆心是被减去的那个数，符号照原样：$|z + 1 - i| = |z - (-1 + i)|$ 的圆心是 $(-1, 1)$。半径就是 $r$；$r^2$ 只出现在直角坐标方程里。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const k = rng.int(-6, 6);
        const r = rng.pick([2, 3, 4, 5, 6, 7, 8, 9]);
        const z0Str = cxPar(h, k);
        const shifted = (v: string, c: number) => (c === 0 ? `${v}^2` : `(${v} ${c < 0 ? "+" : "-"} ${Math.abs(c)})^2`);
        const prompt = t(
          `What geometric figure in the complex plane is represented by the equation $|z - ${z0Str}| = ${r}$?`,
          `方程 $|z - ${z0Str}| = ${r}$ 在复平面中表示什么几何图形？`,
        );
        const right = t(`Circle centered at $(${h}, ${k})$ with radius $${r}$`, `以 $(${h}, ${k})$ 为圆心、半径为 $${r}$ 的圆`);
        const flipped = t(`Circle centered at $(${-h}, ${-k})$ with radius $${r}$`, `以 $(${-h}, ${-k})$ 为圆心、半径为 $${r}$ 的圆`);
        const squared = t(`Circle centered at $(${h}, ${k})$ with radius $${r * r}$`, `以 $(${h}, ${k})$ 为圆心、半径为 $${r * r}$ 的圆`);
        const swapped = t(`Circle centered at $(${k}, ${h})$ with radius $${r}$`, `以 $(${k}, ${h})$ 为圆心、半径为 $${r}$ 的圆`);
        const line = t(`Line passing through $(${h}, ${k})$ with slope $${r}$`, `过点 $(${h}, ${k})$ 且斜率为 $${r}$ 的直线`);
        const solution = walked(
          [
            [
              ["Read it as a distance", "看作距离"],
              t(
                `$|z - (${cx(h, k)})|$ is the distance from $z$ to $z_0 = ${cx(h, k)}$, the point $(${h}, ${k})$. The equation says this distance is always $${r}$.`,
                `$|z - (${cx(h, k)})|$ 是 $z$ 到 $z_0 = ${cx(h, k)}$（即点 $(${h}, ${k})$）的距离。方程说这个距离恒等于 $${r}$。`,
              ),
            ],
            [
              ["Name the figure", "说出图形"],
              t(
                `The points at a fixed distance from a fixed point form a circle, here with center $(${h}, ${k})$ and radius $${r}$. With $z = x + yi$ its Cartesian equation is`,
                `到定点距离一定的点构成圆，这里圆心为 $(${h}, ${k})$，半径为 $${r}$。设 $z = x + yi$，它的直角坐标方程是`,
              ),
              [`${shifted("x", h)} + ${shifted("y", k)} = ${r * r}`],
            ],
          ],
          t(
            `Try the point $z = ${cx(h + r, k)}$, which is $${r}$ to the right of the center: $z - z_0 = ${r}$, so $|z - z_0| = ${r}$, and it satisfies the equation.`,
            `试一试点 $z = ${cx(h + r, k)}$，它在圆心右边 $${r}$ 处：$z - z_0 = ${r}$，所以 $|z - z_0| = ${r}$，满足方程。`,
          ),
        );
        return oneOf(rng, prompt, right, [flipped, squared, swapped, line], solution, [
          why(
            flipped,
            "The center is the number being subtracted, with its own signs, so its coordinates should not be negated.",
            "圆心就是被减去的那个数，符号照原样，坐标不应取相反数。",
          ),
          why(
            squared,
            `The radius is ${r} itself; ${r * r} is the square of the radius, which appears on the right of the Cartesian equation.`,
            `半径就是 ${r}；${r * r} 是半径的平方，出现在直角坐标方程的右边。`,
          ),
          why(
            swapped,
            "The real part of the center is its x-coordinate and comes first; these coordinates are swapped.",
            "圆心的实部是横坐标，要写在前面；这里坐标顺序反了。",
          ),
          why(
            line,
            "The equation fixes a distance from one point, not a slope, so the points form a circle, not a line.",
            "方程规定的是到一个点的距离，而不是斜率，所以这些点构成圆，不是直线。",
          ),
        ]);
      },
    },
    {
      id: "perpendicular-bisector-locus-in-the-complex-plane",
      figure: precalculusDrawings3["geometry-in-the-complex-plane#perpendicular-bisector-locus-in-the-complex-plane"],
      title: t("Perpendicular bisectors as complex loci", "垂直平分线的复数轨迹"),
      explanation: t(
        "The equation $|z - z_1| = |z - z_2|$ states that point $z$ is equidistant from $z_1$ and $z_2$.\n\nGeometrically, this represents the **perpendicular bisector** of the segment joining $z_1$ and $z_2$. For $|z - 2| = |z - 6|$ the segment runs along the real axis from $(2, 0)$ to $(6, 0)$, so the bisector is the vertical line $x = 4$. Check: $z = 4 + 3i$ has $|2 + 3i| = \\sqrt{13}$ and $|-2 + 3i| = \\sqrt{13}$.\n\n> **Watch out.** The bisector is perpendicular to the segment: a vertical segment has a horizontal bisector $y = c$, and a horizontal segment has a vertical bisector $x = c$. It passes through the midpoint, not through either end.",
        "方程 $|z - z_1| = |z - z_2|$ 表示点 $z$ 到两定点 $z_1$ 与 $z_2$ 的距离相等。\n\n在几何上，这表示连接 $z_1$ 和 $z_2$ 的线段的**垂直平分线**（中垂线）。对 $|z - 2| = |z - 6|$，线段沿实轴从 $(2, 0)$ 到 $(6, 0)$，所以中垂线是竖直直线 $x = 4$。检验：$z = 4 + 3i$ 满足 $|2 + 3i| = \\sqrt{13}$，$|-2 + 3i| = \\sqrt{13}$。\n\n> **注意。** 中垂线与线段垂直：竖直线段的中垂线是水平直线 $y = c$，水平线段的中垂线是竖直直线 $x = c$。它经过中点，而不经过任何一个端点。",
      ),
      generate(rng) {
        const isHorizontal = rng.bool();
        const c = rng.int(-5, 5);
        const p1 = rng.pick([-6, -4, -2, 2, 4, 6]);
        const d = rng.pick([2, 4, 6, 8]);
        const p2 = p1 + d;
        const mid = (p1 + p2) / 2;
        // isHorizontal means the bisector is horizontal: the two points share their real part c.
        const z1 = isHorizontal ? cx(c, p1) : cx(p1, c);
        const z2 = isHorizontal ? cx(c, p2) : cx(p2, c);
        const [v, other] = isHorizontal ? ["y", "x"] : ["x", "y"];
        const pt = (p: number) => (isHorizontal ? `(${c}, ${p})` : `(${p}, ${c})`);
        const square = (p: number) => (p === 0 ? `${v}^2` : `(${v} ${p < 0 ? "+" : "-"} ${Math.abs(p)})^2`);
        return equationProblem({
          prompt: t(
            `Find the Cartesian equation of the locus $|z - (${z1})| = |z - (${z2})|$ in the complex plane.`,
            `求复平面中轨迹方程 $|z - (${z1})| = |z - (${z2})|$ 对应的笛卡尔直角坐标方程。`,
          ),
          answer: `${v} = ${mid}`,
          wrong: [`${other} = ${mid}`, `${v} = ${-mid}`, `${other} = ${c}`, `${v} = ${p2 - p1}`],
          solution: walked(
            [
              [
                ["Plot the two points", "画出两点"],
                t(
                  `$z_1$ and $z_2$ are the points $${pt(p1)}$ and $${pt(p2)}$. They share their ${isHorizontal ? "$x$" : "$y$"}-coordinate, so the segment between them is ${isHorizontal ? "vertical" : "horizontal"}.`,
                  `$z_1$、$z_2$ 是点 $${pt(p1)}$ 和 $${pt(p2)}$。它们的${isHorizontal ? "横" : "纵"}坐标相同，所以连接它们的线段是${isHorizontal ? "竖直" : "水平"}的。`,
                ),
              ],
              [
                ["Bisect it", "作中垂线"],
                t(
                  `The perpendicular bisector is the ${isHorizontal ? "horizontal" : "vertical"} line through the midpoint:`,
                  `中垂线是经过中点的${isHorizontal ? "水平" : "竖直"}直线：`,
                ),
                [`${v} = \\frac{${p1} ${p2 < 0 ? "-" : "+"} ${Math.abs(p2)}}{2} = ${mid}`],
              ],
            ],
            t(
              `Square both distances with $z = x + yi$. The $${other}$-terms are the same on both sides and cancel, which leaves\n\n$$${square(p1)} = ${square(p2)}$$\n\nExpanding, the $${v}^2$ terms cancel too, and solving the linear equation gives $${v} = ${mid}$ again.`,
              `设 $z = x + yi$，把两个距离平方。两边的 $${other}$ 项相同，相互抵消，剩下\n\n$$${square(p1)} = ${square(p2)}$$\n\n展开后 $${v}^2$ 项也抵消，解这个一次方程仍得 $${v} = ${mid}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.31: Further Complex Numbers ───────────────────────────────────

/** theComplexConjugate covers the definition, geometric reflection, and modulus-squared property. */
export const theComplexConjugate: TopicDef = {
  id: "the-complex-conjugate",
  title: t("The Complex Conjugate", "共轭复数"),
  summary: t(
    "Define the complex conjugate z̄ = a - bi of z = a + bi, interpret it geometrically as reflection across the real axis, and use the identity z·z̄ = |z|² = a² + b².",
    "定义复数 z = a + bi 的共轭复数 z̄ = a - bi，在几何上将其解释为关于实轴的对称反射，并运用恒等式 z·z̄ = |z|² = a² + b²。",
  ),
  prerequisites: ["the-complex-plane"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.3"],
  intro: t(
    `In the complex plane the number $a + bi$ is the point $(a, b)$: the real part is the horizontal coordinate and the imaginary part the vertical one. Reflecting a point across the real axis keeps its horizontal coordinate and flips the sign of its vertical one. For example, $3 + 2i$ is the point $(3, 2)$, and its mirror image across the real axis is $(3, -2)$, the number $3 - 2i$.

Check: the two points $(3, 2)$ and $(3, -2)$ lie on the same vertical line, each $2$ away from the real axis on opposite sides.

In this lesson we name this mirror image the conjugate, and we find that a number times its conjugate is the square of its modulus.`,
    `在复平面上，数 $a + bi$ 就是点 $(a, b)$：实部是横坐标，虚部是纵坐标。把一个点关于实轴反射，横坐标不变，纵坐标变号。例如，$3 + 2i$ 是点 $(3, 2)$，它关于实轴的镜像是 $(3, -2)$，也就是数 $3 - 2i$。

检验：点 $(3, 2)$ 和 $(3, -2)$ 在同一条竖直线上，分别在实轴两侧，到实轴的距离都是 $2$。

这节课我们把这个镜像叫作共轭复数，并发现一个数乘以它的共轭等于它的模的平方。`,
  ),
  knowledgePoints: [
    {
      id: "definition-and-reflection-of-conjugates",
      figure: precalculusDrawings3["the-complex-conjugate#definition-and-reflection-of-conjugates"],
      title: t("Definition and geometric reflection of the complex conjugate", "共轭复数的定义与几何反射"),
      explanation: t(
        "For any complex number $z = a + bi$, its **complex conjugate** is denoted $\\bar{z}$ (or $z^*$):\n\n$$\\bar{z} = a - bi$$\n\nGeometrically, taking the conjugate reflects the point $(a, b)$ across the **real axis** (the horizontal axis) to $(a, -b)$.\n\nFor example, the conjugate of $-4 + 5i$ is $-4 - 5i$: the point $(-4, 5)$ goes to $(-4, -5)$. Check: taking the conjugate again gives back $-4 + 5i$, as reflecting twice should.\n\n> **Watch out.** Only the imaginary part changes sign. The real part stays as it is, even when it is negative: the conjugate of $-4 + 5i$ is not $4 - 5i$, which is the reflection through the origin.",
        "对于任意复数 $z = a + bi$，其**共轭复数**记作 $\\bar{z}$：\n\n$$\\bar{z} = a - bi$$\n\n在几何上，取共轭相当于将点 $(a, b)$ 关于**实轴**（横轴）进行对称反射，得到点 $(a, -b)$。\n\n例如，$-4 + 5i$ 的共轭是 $-4 - 5i$：点 $(-4, 5)$ 变到 $(-4, -5)$。检验：再取一次共轭又回到 $-4 + 5i$，正如反射两次应回到原处。\n\n> **注意。** 只有虚部变号。实部保持不变，即使它是负数：$-4 + 5i$ 的共轭不是 $4 - 5i$，那是关于原点的中心对称。",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const prompt = t(
          `What is the complex conjugate $\\bar{z}$ of $z = ${cx(a, b)}$, and what geometric transformation maps $z$ to $\\bar{z}$ in the complex plane?`,
          `复数 $z = ${cx(a, b)}$ 的共轭复数 $\\bar{z}$ 是什么？在复平面中通过何种几何变换将 $z$ 映射为 $\\bar{z}$？`,
        );
        const right = t(`$\\bar{z} = ${cx(a, -b)}$, reflection across the real axis`, `$\\bar{z} = ${cx(a, -b)}$，关于实轴的对称反射`);
        const imaginaryAxis = t(
          `$\\bar{z} = ${cx(-a, b)}$, reflection across the imaginary axis`,
          `$\\bar{z} = ${cx(-a, b)}$，关于虚轴的对称反射`,
        );
        const origin = t(`$\\bar{z} = ${cx(-a, -b)}$, reflection through the origin`, `$\\bar{z} = ${cx(-a, -b)}$，关于原点的中心对称`);
        const diagonal = t(`$\\bar{z} = ${cx(b, a)}$, reflection across $y = x$`, `$\\bar{z} = ${cx(b, a)}$，关于直线 $y = x$ 的对称`);
        const solution = walked(
          [
            [
              ["Negate the imaginary part", "虚部变号"],
              t(
                `The real part of $z$ is $${a}$ and the imaginary part is $${b}$. The conjugate keeps the real part and changes the sign of the imaginary part:`,
                `$z$ 的实部是 $${a}$，虚部是 $${b}$。共轭保留实部，把虚部变号：`,
              ),
              [`\\bar{z} = ${cx(a, -b)}`],
            ],
            [
              ["Describe the move", "描述变换"],
              t(
                `As points, $(${a}, ${b})$ goes to $(${a}, ${-b})$. The horizontal coordinate stays and the vertical one flips, which is a reflection across the real axis.`,
                `作为点，$(${a}, ${b})$ 变到 $(${a}, ${-b})$。横坐标不变，纵坐标变号，这是关于实轴的反射。`,
              ),
            ],
          ],
          t(
            `The sum $z + \\bar{z} = ${2 * a}$ is real, as it must be for a number and its mirror image across the real axis, whose imaginary parts cancel.`,
            `和 $z + \\bar{z} = ${2 * a}$ 是实数，这正符合一个数与它关于实轴的镜像相加时虚部相消。`,
          ),
        );
        return oneOf(rng, prompt, right, [imaginaryAxis, origin, diagonal], solution, [
          why(
            imaginaryAxis,
            "This changes the sign of the real part instead; the conjugate keeps the real part and changes the sign of the imaginary part.",
            "这里改变的是实部的符号；共轭保留实部，改变虚部的符号。",
          ),
          why(
            origin,
            "This changes the signs of both parts, which is the negative of z, not its conjugate.",
            "这里两部分都变了号，得到的是 z 的相反数，不是共轭。",
          ),
          why(
            diagonal,
            "This swaps the real and imaginary parts; the conjugate keeps each part in its place and only changes the sign of the imaginary part.",
            "这里交换了实部和虚部；共轭让两部分各留原位，只把虚部变号。",
          ),
        ]);
      },
    },
    {
      id: "modulus-squared-identity",
      title: t("Product of conjugate pairs and modulus squared", "共轭复数乘积与模长平方恒等式"),
      explanation: t(
        "Multiplying a complex number by its conjugate always yields a non-negative real number equal to the square of its modulus:\n\n$$z \\bar{z} = (a + bi)(a - bi) = a^2 - (bi)^2 = a^2 - b^2 i^2 = a^2 + b^2 = |z|^2$$\n\nFor example, $(3 + 4i)(3 - 4i) = 9 + 16 = 25$. Check: $|3 + 4i| = 5$, and $5^2 = 25$.\n\n> **Watch out.** Because $i^2 = -1$, the product is $a^2 + b^2$, a sum, not the difference $a^2 - b^2$ that the pattern $(x + y)(x - y)$ gives for real numbers.",
        "一个复数乘以其共轭复数的结果恒为一个非负实数，且等于其模长的平方：\n\n$$z \\bar{z} = (a + bi)(a - bi) = a^2 - (bi)^2 = a^2 - b^2 i^2 = a^2 + b^2 = |z|^2$$\n\n例如，$(3 + 4i)(3 - 4i) = 9 + 16 = 25$。检验：$|3 + 4i| = 5$，而 $5^2 = 25$。\n\n> **注意。** 因为 $i^2 = -1$，乘积是和 $a^2 + b^2$，而不是实数的平方差公式 $(x + y)(x - y)$ 给出的差 $a^2 - b^2$。",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const prod = a * a + b * b;
        return numberProblem({
          prompt: t(`Evaluate the product $z \\bar{z}$ for $z = ${cx(a, b)}$.`, `计算复数 $z = ${cx(a, b)}$ 与其共轭的乘积 $z \\bar{z}$。`),
          answer: prod,
          wrong: [a * a - b * b, 2 * a, -prod, Math.abs(a) + Math.abs(b)],
          solution: walked(
            [
              [
                ["Write the conjugate", "写出共轭"],
                t(
                  `The conjugate of $z = ${cx(a, b)}$ is $\\bar{z} = ${cx(a, -b)}$.`,
                  `$z = ${cx(a, b)}$ 的共轭是 $\\bar{z} = ${cx(a, -b)}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `The product of a pair of conjugates is the sum of the squares of the two parts, because the cross terms cancel and $i^2 = -1$:`,
                  `一对共轭复数的乘积等于两部分的平方和，因为交叉项相消且 $i^2 = -1$：`,
                ),
                [`z \\bar{z} = (${a})^2 + (${b})^2`, `= ${a * a} + ${b * b}`, `= ${prod}`],
              ],
            ],
            t(
              `Expand term by term: $(${cx(a, b)})(${cx(a, -b)})$ gives $${a * a}$, the cross terms $${-a * b}i$ and $${a * b}i$, which cancel, and $${-b * b}i^2 = ${b * b}$, so the total is $${prod}$.`,
              `逐项展开：$(${cx(a, b)})(${cx(a, -b)})$ 得到 $${a * a}$，交叉项 $${-a * b}i$ 与 $${a * b}i$ 相消，以及 $${-b * b}i^2 = ${b * b}$，总和为 $${prod}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.31.2: Special Properties of the Complex Conjugate ─────────────

/** specialPropertiesOfTheComplexConjugate covers sum, product, and real/imaginary criteria. */
export const specialPropertiesOfTheComplexConjugate: TopicDef = {
  id: "special-properties-of-the-complex-conjugate",
  title: t("Special Properties of the Complex Conjugate", "共轭复数的特殊代数性质"),
  summary: t(
    "Apply algebraic properties of the conjugate: conj(z1 ± z2) = conj(z1) ± conj(z2), conj(z1 z2) = conj(z1) conj(z2), and recognize that z is real iff z = z̄ and purely imaginary iff z = -z̄.",
    "应用共轭复数的加、减、乘代数性质，并掌握 z 为实数当且仅当 z = z̄、为纯虚数当且仅当 z = -z̄。",
  ),
  prerequisites: ["the-complex-conjugate"],
  encompasses: [{ topic: "the-complex-conjugate", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.3"],
  intro: t(
    `The conjugate of $z = a + bi$ is $\\bar{z} = a - bi$, the mirror image of $z$ across the real axis. Conjugates fit well with arithmetic. For example, take $z = 2 + 3i$ and $w = 1 - i$. Their sum is $3 + 2i$, whose conjugate is $3 - 2i$; the sum of their conjugates is $(2 - 3i) + (1 + i) = 3 - 2i$ as well.

Check: both routes give real part $3$ and imaginary part $-2$.

In this lesson we see that the conjugate of a sum, difference, product or quotient is found from the conjugates of the parts, and we use $z$ and $\\bar{z}$ together to pick out the real and imaginary parts.`,
    `$z = a + bi$ 的共轭是 $\\bar{z} = a - bi$，即 $z$ 关于实轴的镜像。共轭与四则运算配合得很好。例如，取 $z = 2 + 3i$，$w = 1 - i$。它们的和是 $3 + 2i$，其共轭为 $3 - 2i$；它们的共轭之和 $(2 - 3i) + (1 + i)$ 也等于 $3 - 2i$。

检验：两种算法得到的实部都是 $3$，虚部都是 $-2$。

这节课我们看到和、差、积、商的共轭可以由各部分的共轭求得，并用 $z$ 和 $\\bar{z}$ 一起分出实部和虚部。`,
  ),
  knowledgePoints: [
    {
      id: "conjugate-of-arithmetic-operations",
      title: t("Conjugate of sum and product", "复数和与积的共轭性质"),
      explanation: t(
        "Taking the conjugate changes the sign of the imaginary part, and you can take it before or after doing arithmetic and get the same result. The complex conjugate distributes across addition, subtraction, multiplication, and division:\n\n1. $\\overline{z_1 + z_2} = \\bar{z}_1 + \\bar{z}_2$\n2. $\\overline{z_1 - z_2} = \\bar{z}_1 - \\bar{z}_2$\n3. $\\overline{z_1 z_2} = \\bar{z}_1 \\bar{z}_2$\n4. $\\overline{z_1 / z_2} = \\bar{z}_1 / \\bar{z}_2$\n5. $\\overline{z^n} = (\\bar{z})^n$\n\nFor example, with $z_1 = 1 + 2i$ and $z_2 = 3 - i$, the product is $z_1 z_2 = 5 + 5i$, so $\\overline{z_1 z_2} = 5 - 5i$. Check: $\\bar{z}_1 \\bar{z}_2 = (1 - 2i)(3 + i) = 3 + i - 6i + 2 = 5 - 5i$.\n\n> **Watch out.** The conjugate of a product is the product of the conjugates, not the product with only one factor conjugated: $(1 - 2i)(3 - i) = 1 - 7i$ is a different number.",
        "取共轭就是改变虚部的符号，先取共轭再运算与先运算再取共轭的结果相同。共轭运算对加法、减法、乘法和除法均满足分配律：\n\n1. $\\overline{z_1 + z_2} = \\bar{z}_1 + \\bar{z}_2$\n2. $\\overline{z_1 - z_2} = \\bar{z}_1 - \\bar{z}_2$\n3. $\\overline{z_1 z_2} = \\bar{z}_1 \\bar{z}_2$\n4. $\\overline{z_1 / z_2} = \\bar{z}_1 / \\bar{z}_2$\n5. $\\overline{z^n} = (\\bar{z})^n$\n\n例如，$z_1 = 1 + 2i$，$z_2 = 3 - i$，乘积 $z_1 z_2 = 5 + 5i$，所以 $\\overline{z_1 z_2} = 5 - 5i$。检验：$\\bar{z}_1 \\bar{z}_2 = (1 - 2i)(3 + i) = 3 + i - 6i + 2 = 5 - 5i$。\n\n> **注意。** 积的共轭是两个共轭的积，而不是只把一个因子取共轭：$(1 - 2i)(3 - i) = 1 - 7i$ 是另一个数。",
      ),
      generate(rng) {
        const values = [-5, -4, -3, -2, 2, 3, 4, 5];
        const a1 = rng.pick(values);
        const b1 = rng.pick(values);
        // Draw the second parts from the values that do not cancel the first, so the sum has both parts.
        const a2 = rng.pick(values.filter((v) => v !== -a1));
        const b2 = rng.pick(values.filter((v) => v !== -b1));

        const isSum = rng.bool();
        if (isSum) {
          const resA = a1 + a2;
          const resB = -(b1 + b2);
          return expressionProblem({
            prompt: t(
              `If $z_1 = ${cx(a1, b1)}$ and $z_2 = ${cx(a2, b2)}$, evaluate $\\overline{z_1 + z_2}$ in the form $a + bi$.`,
              `已知 $z_1 = ${cx(a1, b1)}$ 且 $z_2 = ${cx(a2, b2)}$，求 $\\overline{z_1 + z_2}$（写成 $a + bi$ 形式）。`,
            ),
            answer: cx(resA, resB),
            simplified: true,
            wrong: [cx(resA, -resB), cx(-resA, resB), cx(-resA, -resB), cx(resB, resA)],
            solution: walked(
              [
                [
                  ["Add", "相加"],
                  t(`Add the real parts and the imaginary parts separately:`, `实部与实部相加，虚部与虚部相加：`),
                  [`z_1 + z_2 = (${a1} + ${cxPar(a2, 0)}) + (${b1} + ${cxPar(b2, 0)})i`, `= ${cx(resA, -resB)}`],
                ],
                [
                  ["Conjugate", "取共轭"],
                  t(`Change the sign of the imaginary part of the sum:`, `把和的虚部变号：`),
                  [`\\overline{z_1 + z_2} = ${cx(resA, resB)}`],
                ],
              ],
              t(
                `Conjugate first and then add. The conjugates are $${cx(a1, -b1)}$ and $${cx(a2, -b2)}$, and their sum is $${cx(resA, resB)}$ again.`,
                `先取共轭再相加。两个共轭是 $${cx(a1, -b1)}$ 和 $${cx(a2, -b2)}$，它们的和同样是 $${cx(resA, resB)}$。`,
              ),
            ),
          });
        }
        const pRe = a1 * a2 - b1 * b2;
        const pIm = a1 * b2 + a2 * b1;
        const ansRe = pRe;
        const ansIm = -pIm;
        return expressionProblem({
          prompt: t(
            `If $z_1 = ${cx(a1, b1)}$ and $z_2 = ${cx(a2, b2)}$, evaluate $\\overline{z_1 z_2}$ in the form $a + bi$.`,
            `已知 $z_1 = ${cx(a1, b1)}$ 且 $z_2 = ${cx(a2, b2)}$，求 $\\overline{z_1 z_2}$（写成 $a + bi$ 形式）。`,
          ),
          answer: cx(ansRe, ansIm),
          simplified: true,
          wrong: [cx(pRe, pIm), cx(-ansRe, ansIm), cx(-ansRe, -ansIm), cx(ansIm, ansRe)],
          solution: walked(
            [
              [
                ["Multiply", "相乘"],
                t(
                  `Expand the product and use $i^2 = -1$. The real part is $(${a1})(${a2}) - (${b1})(${b2})$ and the imaginary part is $(${a1})(${b2}) + (${a2})(${b1})$:`,
                  `展开乘积并用 $i^2 = -1$。实部是 $(${a1})(${a2}) - (${b1})(${b2})$，虚部是 $(${a1})(${b2}) + (${a2})(${b1})$：`,
                ),
                [`z_1 z_2 = ${cx(pRe, pIm)}`],
              ],
              [
                ["Conjugate", "取共轭"],
                t(`Change the sign of the imaginary part of the product:`, `把积的虚部变号：`),
                [`\\overline{z_1 z_2} = ${cx(ansRe, ansIm)}`],
              ],
            ],
            t(
              `Multiply the conjugates $${cx(a1, -b1)}$ and $${cx(a2, -b2)}$ instead. The product has real part $${a1 * a2} - ${cxPar(b1 * b2, 0)} = ${pRe}$ and imaginary part $${-a1 * b2} + ${cxPar(-a2 * b1, 0)} = ${-pIm}$, the same number.`,
              `改为把两个共轭 $${cx(a1, -b1)}$ 与 $${cx(a2, -b2)}$ 相乘。乘积的实部是 $${a1 * a2} - ${cxPar(b1 * b2, 0)} = ${pRe}$，虚部是 $${-a1 * b2} + ${cxPar(-a2 * b1, 0)} = ${-pIm}$，是同一个数。`,
            ),
          ),
        });
      },
    },
    {
      id: "real-and-purely-imaginary-conjugate-criteria",
      title: t("Conjugate criteria for real and purely imaginary numbers", "实数与纯虚数的共轭判定准则"),
      explanation: t(
        "Comparing a complex number with its conjugate shows which parts it has: a number equal to its conjugate has no imaginary part. For any complex number $z = a + bi$:\n\n- $\\operatorname{Re}(z) = \\frac{z + \\bar{z}}{2} = a$\n- $\\operatorname{Im}(z) = \\frac{z - \\bar{z}}{2i} = b$\n\nImportant criteria:\n- $z$ is purely real $\\iff z = \\bar{z}$\n- $z$ is purely imaginary $\\iff z = -\\bar{z}$ (with $z \\neq 0$)\n\nFor example, for $z = 3 - 4i$ we have $z + \\bar{z} = 6$, so $\\operatorname{Re}(z) = 3$, and $z - \\bar{z} = -8i$, so $\\operatorname{Im}(z) = -8i / 2i = -4$. Check: these are the parts we can read from $3 - 4i$ directly.\n\n> **Watch out.** The imaginary part is the real number $b$, not $bi$: dividing $z - \\bar{z} = 2bi$ by $2i$ removes the $i$ as well as the $2$.",
        "把一个复数与它的共轭比较，就能看出它有哪些部分：与共轭相等的数没有虚部。对任意复数 $z = a + bi$：\n\n- $\\operatorname{Re}(z) = \\frac{z + \\bar{z}}{2} = a$\n- $\\operatorname{Im}(z) = \\frac{z - \\bar{z}}{2i} = b$\n\n重要判定法则：\n- $z$ 为实数 $\\iff z = \\bar{z}$\n- $z$ 为纯虚数 $\\iff z = -\\bar{z}$（且 $z \\neq 0$）\n\n例如，对 $z = 3 - 4i$，有 $z + \\bar{z} = 6$，所以 $\\operatorname{Re}(z) = 3$；$z - \\bar{z} = -8i$，所以 $\\operatorname{Im}(z) = -8i / 2i = -4$。检验：这正是直接从 $3 - 4i$ 读出的两部分。\n\n> **注意。** 虚部是实数 $b$，而不是 $bi$：用 $2i$ 去除 $z - \\bar{z} = 2bi$，既除掉了 $2$，也除掉了 $i$。",
      ),
      generate(rng) {
        const a = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const b = rng.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
        const askReal = rng.bool();
        if (askReal) {
          return numberProblem({
            prompt: t(
              `For $z = ${cx(a, b)}$, find the value of $\\frac{z + \\bar{z}}{2}$.`,
              `对于复数 $z = ${cx(a, b)}$，求 $\\frac{z + \\bar{z}}{2}$ 的值。`,
            ),
            answer: a,
            wrong: [b, -a, 2 * a],
            solution: walked(
              [
                [
                  ["Add the conjugate", "加上共轭"],
                  t(
                    `The conjugate is $\\bar{z} = ${cx(a, -b)}$. Adding it to $z$ cancels the imaginary parts:`,
                    `共轭是 $\\bar{z} = ${cx(a, -b)}$。把它加到 $z$ 上，虚部相消：`,
                  ),
                  [`z + \\bar{z} = (${cx(a, b)}) + (${cx(a, -b)}) = ${2 * a}`],
                ],
                [["Halve", "除以 2"], t(`Divide by $2$:`, `除以 $2$：`), [`\\frac{z + \\bar{z}}{2} = \\frac{${2 * a}}{2} = ${a}`]],
              ],
              t(
                `The result is the real part of $z = ${cx(a, b)}$, which is $${a}$, as the formula for the real part says.`,
                `结果是 $z = ${cx(a, b)}$ 的实部 $${a}$，与实部公式相符。`,
              ),
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `For $z = ${cx(a, b)}$, find the value of $\\frac{z - \\bar{z}}{2i}$.`,
            `对于复数 $z = ${cx(a, b)}$，求 $\\frac{z - \\bar{z}}{2i}$ 的值。`,
          ),
          answer: b,
          wrong: [a, -b, 2 * b],
          solution: walked(
            [
              [
                ["Subtract the conjugate", "减去共轭"],
                t(
                  `The conjugate is $\\bar{z} = ${cx(a, -b)}$. Subtracting it from $z$ cancels the real parts:`,
                  `共轭是 $\\bar{z} = ${cx(a, -b)}$。用 $z$ 减去它，实部相消：`,
                ),
                [`z - \\bar{z} = (${cx(a, b)}) - (${cx(a, -b)}) = ${2 * b}i`],
              ],
              [
                ["Divide by 2i", "除以 2i"],
                t(`Dividing by $2i$ removes both the $2$ and the $i$:`, `除以 $2i$，既除掉 $2$ 也除掉 $i$：`),
                [`\\frac{z - \\bar{z}}{2i} = \\frac{${2 * b}i}{2i} = ${b}`],
              ],
            ],
            t(
              `The result is the imaginary part of $z = ${cx(a, b)}$, the real number $${b}$ multiplying $i$, as the formula for the imaginary part says.`,
              `结果是 $z = ${cx(a, b)}$ 的虚部，即乘在 $i$ 前面的实数 $${b}$，与虚部公式相符。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.31.3: Complex Conjugates and Roots of Quadratics ──────────────

/** theComplexConjugateAndTheRootsOfAQuadraticEquation covers the conjugate root theorem and reconstruction. */
export const theComplexConjugateAndTheRootsOfAQuadraticEquation: TopicDef = {
  id: "the-complex-conjugate-and-the-roots-of-a-quadratic-equation",
  title: t("The Complex Conjugate and the Roots of a Quadratic Equation", "共轭复数与一元二次方程的虚根"),
  summary: t(
    "Apply the Complex Conjugate Root Theorem to quadratic equations with real coefficients, recognizing that non-real roots occur in conjugate pairs p ± qi, and reconstruct equations from their roots.",
    "将共轭虚根定理应用于实系数一元二次方程，明确虚根成对出现 p ± qi，并根据根还原二次方程。",
  ),
  prerequisites: ["special-properties-of-the-complex-conjugate"],
  encompasses: [{ topic: "special-properties-of-the-complex-conjugate", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.C.7", "CCSS.HSN.CN.C.8"],
  intro: t(
    `A real number is its own conjugate, and the conjugate of a sum or product is the sum or product of the conjugates. So if $z$ solves an equation with real coefficients, taking the conjugate of the whole equation shows that $\\bar{z}$ solves it too. For example, the quadratic formula applied to $x^2 - 2x + 5 = 0$ gives

$$x = \\frac{2 \\pm \\sqrt{-16}}{2} = 1 \\pm 2i$$

The two roots $1 + 2i$ and $1 - 2i$ are conjugates.

Check: $(1 + 2i)^2 - 2(1 + 2i) + 5 = (-3 + 4i) - 2 - 4i + 5 = 0$.

In this lesson we use this to find the second root of a real quadratic from the first, and to rebuild a quadratic from a conjugate pair of roots.`,
    `实数的共轭是它本身，而和或积的共轭等于共轭的和或积。所以如果 $z$ 是某个实系数方程的解，对整个方程取共轭就说明 $\\bar{z}$ 也是它的解。例如，用求根公式解 $x^2 - 2x + 5 = 0$，得到

$$x = \\frac{2 \\pm \\sqrt{-16}}{2} = 1 \\pm 2i$$

两根 $1 + 2i$ 与 $1 - 2i$ 互为共轭。

检验：$(1 + 2i)^2 - 2(1 + 2i) + 5 = (-3 + 4i) - 2 - 4i + 5 = 0$。

这节课我们用这一点由实系数二次方程的一个根求出另一个根，并由一对共轭根还原二次方程。`,
  ),
  knowledgePoints: [
    {
      id: "complex-conjugate-root-theorem",
      title: t("Complex Conjugate Root Theorem", "共轭虚根定理"),
      explanation: t(
        "**Complex Conjugate Root Theorem**:\nIf a polynomial with **real coefficients** has a complex root $z_1 = p + qi$ (where $q \\neq 0$), then its complex conjugate $z_2 = p - qi$ is also a root.\n\nFor a quadratic equation $ax^2 + bx + c = 0$ ($a, b, c \\in \\mathbb{R}$) with negative discriminant $\\Delta < 0$, the two roots are always a conjugate pair $p \\pm qi$.\n\nFor example, if $3 - 5i$ is a root of a real quadratic, the other root is $3 + 5i$. Check: the sum of the two roots is $6$ and their product is $9 + 25 = 34$, both real, as the coefficients of a real equation require.\n\n> **Watch out.** The theorem needs real coefficients. The equation $x^2 - 2ix - 1 = 0$, whose middle coefficient is not real, has the double root $i$, and $-i$ is not a root.",
        "**共轭虚根定理**：\n若一个**实系数多项式**有一个复数根 $z_1 = p + qi$（$q \\neq 0$），则其共轭复数 $z_2 = p - qi$ 也必然是该多项式的一个根。\n\n对于判别式 $\\Delta < 0$ 的实系数一元二次方程 $ax^2 + bx + c = 0$，其两个解必为一对共轭虚根 $p \\pm qi$。\n\n例如，若 $3 - 5i$ 是某个实系数二次方程的根，则另一个根是 $3 + 5i$。检验：两根之和是 $6$，两根之积是 $9 + 25 = 34$，都是实数，正符合实系数方程的要求。\n\n> **注意。** 定理要求系数是实数。方程 $x^2 - 2ix - 1 = 0$ 的一次项系数不是实数，它有二重根 $i$，而 $-i$ 不是它的根。",
      ),
      generate(rng) {
        const p = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const q = rng.pick([1, 2, 3, 4, 5, 6, 7, 8]);
        return expressionProblem({
          prompt: t(
            `A quadratic equation with real coefficients has a root $x = ${cx(p, q)}$. Find the other root of the equation in the form $a + bi$.`,
            `一个实系数一元二次方程的一个根为 $x = ${cx(p, q)}$。求该方程的另一个根（写成 $a + bi$ 形式）。`,
          ),
          answer: cx(p, -q),
          simplified: true,
          wrong: [cx(-p, q), cx(-p, -q), cx(q, p), cx(-q, -p)],
          solution: walked(
            [
              [
                ["Use the theorem", "运用定理"],
                t(
                  `The coefficients are real and the root $${cx(p, q)}$ is not real, so by the Complex Conjugate Root Theorem its conjugate is also a root.`,
                  `方程系数是实数，而根 $${cx(p, q)}$ 不是实数，所以由共轭虚根定理，它的共轭也是根。`,
                ),
              ],
              [
                ["Take the conjugate", "取共轭"],
                t(`Keep the real part and change the sign of the imaginary part:`, `实部不变，虚部变号：`),
                [`\\overline{${cx(p, q)}} = ${cx(p, -q)}`],
              ],
            ],
            t(
              `The two roots have sum $${2 * p}$ and product $${p * p} + ${q * q} = ${p * p + q * q}$. Both are real, so the roots fit the real equation $${poly([1, "x^2"], [-2 * p, "x"], [p * p + q * q, ""])} = 0$.`,
              `两根之和为 $${2 * p}$，之积为 $${p * p} + ${q * q} = ${p * p + q * q}$。二者都是实数，所以这两根正是实系数方程 $${poly([1, "x^2"], [-2 * p, "x"], [p * p + q * q, ""])} = 0$ 的根。`,
            ),
          ),
        });
      },
    },
    {
      id: "reconstruct-quadratic-from-conjugate-roots",
      title: t("Reconstruct quadratic equations from complex conjugate roots", "由共轭复数根还原一元二次方程"),
      explanation: t(
        "Nonreal roots of a quadratic with real coefficients come in conjugate pairs, and the sum and product of the pair give the coefficients of the equation. A monic quadratic equation with roots $x = p \\pm qi$ can be reconstructed using Vieta's formulas:\n\n- $\\text{Sum of roots} = (p + qi) + (p - qi) = 2p$\n- $\\text{Product of roots} = (p + qi)(p - qi) = p^2 + q^2$\n\nThe equation is:\n$$x^2 - (2p)x + (p^2 + q^2) = 0$$\n\nFor example, the roots $2 \\pm 3i$ have sum $4$ and product $4 + 9 = 13$, so the equation is $x^2 - 4x + 13 = 0$. Check: its discriminant is $16 - 52 = -36$, and the quadratic formula gives $(4 \\pm 6i)/2 = 2 \\pm 3i$.\n\n> **Watch out.** The sum enters with a minus sign, as $-(2p)x$, and the product is $p^2 + q^2$, a sum of squares, because $(qi)^2 = -q^2$ is subtracted.",
        "实系数二次方程的虚根成共轭对出现，这一对根的和与积给出方程的系数。以 $x = p \\pm qi$ 为根的一元二次方程可通过韦达定理写出：\n\n- 两根之和 $= (p + qi) + (p - qi) = 2p$\n- 两根之积 $= (p + qi)(p - qi) = p^2 + q^2$\n\n对应的首一二次方程为：\n$$x^2 - (2p)x + (p^2 + q^2) = 0$$\n\n例如，根 $2 \\pm 3i$ 之和为 $4$，之积为 $4 + 9 = 13$，所以方程是 $x^2 - 4x + 13 = 0$。检验：判别式为 $16 - 52 = -36$，求根公式给出 $(4 \\pm 6i)/2 = 2 \\pm 3i$。\n\n> **注意。** 两根之和带负号进入方程，即 $-(2p)x$；两根之积是平方和 $p^2 + q^2$，因为减去的是 $(qi)^2 = -q^2$。",
      ),
      generate(rng) {
        const p = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const q = rng.pick([1, 2, 3, 4, 5]);
        const sum = 2 * p;
        const prod = p * p + q * q;
        const eqStr = `${poly([1, "x^2"], [-sum, "x"], [prod, ""])} = 0`;
        const wrongProdSub = p * p - q * q;
        return equationProblem({
          prompt: t(
            `Find the monic quadratic equation with real coefficients whose roots are $x = ${cx(p, q)}$ and $x = ${cx(p, -q)}$.`,
            `求以 $x = ${cx(p, q)}$ 和 $x = ${cx(p, -q)}$ 为两根且最高次项系数为 $1$ 的实系数一元二次方程。`,
          ),
          answer: eqStr,
          wrong: [
            `${poly([1, "x^2"], [sum, "x"], [prod, ""])} = 0`,
            `${poly([1, "x^2"], [-sum, "x"], [wrongProdSub, ""])} = 0`,
            `${poly([1, "x^2"], [-sum, "x"], [-prod, ""])} = 0`,
          ],
          solution: walked(
            [
              [
                ["Sum and product", "和与积"],
                t(
                  `The imaginary parts cancel in the sum, and the product of a conjugate pair is the sum of the squares of the parts:`,
                  `求和时虚部相消，一对共轭复数之积等于两部分的平方和：`,
                ),
                [`(${cx(p, q)}) + (${cx(p, -q)}) = ${sum}`, `(${cx(p, q)})(${cx(p, -q)}) = ${cxPar(p, 0)}^2 + ${q}^2 = ${prod}`],
              ],
              [
                ["Write the equation", "写出方程"],
                t(
                  `A monic quadratic is $x^2 - (\\text{sum})x + \\text{product} = 0$. Here that is`,
                  `首一二次方程是 $x^2 - (\\text{两根之和})x + \\text{两根之积} = 0$。这里就是`,
                ),
                [eqStr],
              ],
            ],
            t(
              `The discriminant is $${sum * sum} - ${4 * prod} = ${sum * sum - 4 * prod}$, so the quadratic formula gives $x = (${sum} \\pm ${2 * q}i)/2$, which is $${cx(p, q)}$ and $${cx(p, -q)}$.`,
              `判别式为 $${sum * sum} - ${4 * prod} = ${sum * sum - 4 * prod}$，所以求根公式给出 $x = (${sum} \\pm ${2 * q}i)/2$，即 $${cx(p, q)}$ 与 $${cx(p, -q)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.31.4: Dividing Complex Numbers ─────────────────────────────────

/** dividingComplexNumbers covers division by multiplying numerator and denominator by conjugate. */
export const dividingComplexNumbers: TopicDef = {
  id: "dividing-complex-numbers",
  title: t("Dividing Complex Numbers", "复数的除法运算"),
  summary: t(
    "Divide complex numbers in rectangular form by multiplying numerator and denominator by the complex conjugate of the denominator: z1 / z2 = (z1 conj(z2)) / |z2|².",
    "通过将分子与分母同乘分母的共轭复数来计算复数的除法：z1 / z2 = (z1 conj(z2)) / |z2|²。",
  ),
  prerequisites: ["the-complex-conjugate"],
  encompasses: [{ topic: "the-complex-conjugate", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.3"],
  intro: t(
    `A complex number times its conjugate is a real number: $(a + bi)(a - bi) = a^2 + b^2$. For example, $(1 + 2i)(1 - 2i) = 1 + 4 = 5$. That is just what we need to divide. A fraction with $1 + 2i$ in the denominator can be multiplied above and below by $1 - 2i$, and then the denominator is the real number $5$.

Check: $1 + 2i$ is the point $(1, 2)$, so its modulus squared is $1^2 + 2^2 = 5$, the same real number.

In this lesson we use the conjugate of the denominator to find reciprocals and quotients of complex numbers in the form $a + bi$.`,
    `一个复数乘它的共轭得到实数：$(a + bi)(a - bi) = a^2 + b^2$。例如，$(1 + 2i)(1 - 2i) = 1 + 4 = 5$。这正是做除法所需要的。分母是 $1 + 2i$ 的分数，分子分母同乘 $1 - 2i$ 后，分母就成了实数 $5$。

检验：$1 + 2i$ 是点 $(1, 2)$，它的模的平方是 $1^2 + 2^2 = 5$，正是这个实数。

这节课我们用分母的共轭求复数的倒数和商，并写成 $a + bi$ 的形式。`,
  ),
  knowledgePoints: [
    {
      id: "reciprocal-of-a-complex-number",
      title: t("Reciprocal of a complex number", "复数的倒数运算"),
      explanation: t(
        "A complex number times its conjugate is the real number $a^2 + b^2$. That is what removes $i$ from the denominator.\n\nTo find the reciprocal $\\frac{1}{z} = \\frac{1}{a + bi}$, multiply the numerator and denominator by the conjugate $\\bar{z} = a - bi$:\n\n$$\\frac{1}{a + bi} = \\frac{a - bi}{(a + bi)(a - bi)} = \\frac{a - bi}{a^2 + b^2} = \\frac{a}{a^2 + b^2} - \\frac{b}{a^2 + b^2}i$$\n\nFor example, multiplying above and below by $3 - 4i$ gives\n\n$$\\frac{1}{3 + 4i} = \\frac{3 - 4i}{25} = \\frac{3}{25} - \\frac{4}{25}i$$\n\nCheck: $(3 + 4i)(3 - 4i) = 25$, so $(3 + 4i) \\cdot \\frac{3 - 4i}{25} = 1$.\n\n> **Watch out.** The reciprocal of $a + bi$ is not $\\frac{1}{a} + \\frac{1}{b}i$. Divide both parts of the conjugate by $a^2 + b^2$, and keep the minus sign that the conjugate brings to the imaginary part.",
        "一个复数乘它的共轭复数，得到实数 $a^2 + b^2$。正是这一点使分母中不再含有 $i$。\n\n求复数的倒数 $\\frac{1}{z} = \\frac{1}{a + bi}$ 时，将分子分母同乘共轭复数 $\\bar{z} = a - bi$：\n\n$$\\frac{1}{a + bi} = \\frac{a - bi}{(a + bi)(a - bi)} = \\frac{a - bi}{a^2 + b^2} = \\frac{a}{a^2 + b^2} - \\frac{b}{a^2 + b^2}i$$\n\n例如，分子分母同乘 $3 - 4i$，得到\n\n$$\\frac{1}{3 + 4i} = \\frac{3 - 4i}{25} = \\frac{3}{25} - \\frac{4}{25}i$$\n\n检验：$(3 + 4i)(3 - 4i) = 25$，所以 $(3 + 4i) \\cdot \\frac{3 - 4i}{25} = 1$。\n\n> **注意。** $a + bi$ 的倒数不是 $\\frac{1}{a} + \\frac{1}{b}i$。要把共轭的两部分都除以 $a^2 + b^2$，并保留共轭给虚部带来的负号。",
      ),
      generate(rng) {
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const den = a * a + b * b;
        const ansStr = cxFrac(a, -b, den);
        return expressionProblem({
          prompt: t(
            `Express the reciprocal $\\frac{1}{${cx(a, b)}}$ in standard form $a + bi$.`,
            `将倒数 $\\frac{1}{${cx(a, b)}}$ 写成代数标准形式 $a + bi$。`,
          ),
          answer: ansStr,
          simplified: true,
          wrong: [cxFrac(a, b, den), cxFrac(-a, -b, den), cxFrac(b, -a, den), cx(a, -b)],
          solution: walked(
            [
              [
                ["Multiply by the conjugate", "乘以共轭"],
                t(
                  `Multiply the numerator and the denominator by the conjugate $${cx(a, -b)}$. The denominator becomes $(${a})^2 + (${b})^2 = ${den}$:`,
                  `分子分母同乘共轭 $${cx(a, -b)}$。分母变成 $(${a})^2 + (${b})^2 = ${den}$：`,
                ),
                [`\\frac{1}{${cx(a, b)}} = \\frac{${cx(a, -b)}}{(${cx(a, b)})(${cx(a, -b)})} = \\frac{${cx(a, -b)}}{${den}}`],
              ],
              [
                ["Split into parts", "分成两部分"],
                t(`Divide each part of the numerator by $${den}$:`, `把分子的每一部分除以 $${den}$：`),
                [`\\frac{${cx(a, -b)}}{${den}} = ${ansStr}`],
              ],
            ],
            t(
              `Multiply back. The product of $${cx(a, b)}$ and its conjugate is $${den}$, and dividing by $${den}$ leaves $1$, so the product of $${cx(a, b)}$ and the answer is $1$.`,
              `乘回去。$${cx(a, b)}$ 与它的共轭之积是 $${den}$，再除以 $${den}$ 得 $1$，所以 $${cx(a, b)}$ 与答案之积为 $1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "quotient-of-two-complex-numbers",
      title: t("Quotient of two complex numbers", "两复数相除"),
      explanation: t(
        "Dividing by a complex number works like rationalizing a denominator: the conjugate turns the denominator into a real number, and then the result can be split into real and imaginary parts.\n\nTo divide two complex numbers $\\frac{z_1}{z_2} = \\frac{a + bi}{c + di}$, multiply the numerator and denominator by $\\bar{z}_2 = c - di$:\n\n$$\\frac{a + bi}{c + di} = \\frac{(a + bi)(c - di)}{c^2 + d^2} = \\frac{(ac + bd) + (bc - ad)i}{c^2 + d^2}$$\n\nFor example, multiplying above and below by $1 - i$ gives\n\n$$\\frac{5 + i}{1 + i} = \\frac{(5 + i)(1 - i)}{2} = \\frac{6 - 4i}{2} = 3 - 2i$$\n\nCheck: $(3 - 2i)(1 + i) = 3 + 3i - 2i + 2 = 5 + i$.\n\n> **Watch out.** Multiply the numerator by the conjugate too, not only the denominator; otherwise the value of the fraction changes. And in the numerator, $i \\cdot (-i) = 1$, not $-1$.",
        "除以一个复数与分母有理化类似：乘共轭复数后分母变成实数，然后把结果分成实部和虚部。\n\n计算两个复数的商 $\\frac{z_1}{z_2} = \\frac{a + bi}{c + di}$ 时，分子分母同乘分母的共轭复数 $\\bar{z}_2 = c - di$：\n\n$$\\frac{a + bi}{c + di} = \\frac{(a + bi)(c - di)}{c^2 + d^2} = \\frac{(ac + bd) + (bc - ad)i}{c^2 + d^2}$$\n\n例如，分子分母同乘 $1 - i$，得到\n\n$$\\frac{5 + i}{1 + i} = \\frac{(5 + i)(1 - i)}{2} = \\frac{6 - 4i}{2} = 3 - 2i$$\n\n检验：$(3 - 2i)(1 + i) = 3 + 3i - 2i + 2 = 5 + i$。\n\n> **注意。** 分子也要乘共轭，不能只乘分母，否则分数的值就变了。分子中 $i \\cdot (-i) = 1$，而不是 $-1$。",
      ),
      generate(rng) {
        const z2 = rng.pick([
          { c: 1, d: 1 },
          { c: 1, d: -1 },
          { c: 2, d: 1 },
          { c: 2, d: -1 },
          { c: 1, d: 2 },
          { c: 3, d: 1 },
        ]);
        const u = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const v = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const numA = z2.c * u - z2.d * v;
        const numB = z2.c * v + z2.d * u;
        const denom = z2.c * z2.c + z2.d * z2.d;
        return expressionProblem({
          prompt: t(
            `Evaluate the quotient $\\frac{${cx(numA, numB)}}{${cx(z2.c, z2.d)}}$ and write in standard form $a + bi$.`,
            `计算商 $\\frac{${cx(numA, numB)}}{${cx(z2.c, z2.d)}}$ 并写成标准形式 $a + bi$。`,
          ),
          answer: cx(u, v),
          simplified: true,
          wrong: [cx(u, -v), cx(-u, v), cx(v, u), cx(-u, -v)],
          solution: walked(
            [
              [
                ["Multiply by the conjugate", "乘以共轭"],
                t(
                  `Multiply the numerator and the denominator by the conjugate of the denominator, $${cx(z2.c, -z2.d)}$. The denominator becomes $${z2.c * z2.c} + ${z2.d * z2.d} = ${denom}$, and the numerator expands with $i^2 = -1$:`,
                  `分子分母同乘分母的共轭 $${cx(z2.c, -z2.d)}$。分母变成 $${z2.c * z2.c} + ${z2.d * z2.d} = ${denom}$，分子用 $i^2 = -1$ 展开：`,
                ),
                [`\\frac{(${cx(numA, numB)})(${cx(z2.c, -z2.d)})}{${denom}} = \\frac{${cx(u * denom, v * denom)}}{${denom}}`],
              ],
              [
                ["Divide each part", "逐部分相除"],
                t(`Divide the real and imaginary parts by $${denom}$:`, `把实部和虚部分别除以 $${denom}$：`),
                [`\\frac{${cx(u * denom, v * denom)}}{${denom}} = ${cx(u, v)}`],
              ],
            ],
            t(
              `Multiply the answer by the denominator: $(${cx(u, v)})(${cx(z2.c, z2.d)})$ has real part $${u * z2.c} - ${cxPar(v * z2.d, 0)} = ${numA}$ and imaginary part $${u * z2.d} + ${cxPar(v * z2.c, 0)} = ${numB}$, which is the numerator.`,
              `用答案乘分母：$(${cx(u, v)})(${cx(z2.c, z2.d)})$ 的实部是 $${u * z2.c} - ${cxPar(v * z2.d, 0)} = ${numA}$，虚部是 $${u * z2.d} + ${cxPar(v * z2.c, 0)} = ${numB}$，正是分子。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.31.5: Equating Real and Imaginary Parts ───────────────────────

/** solvingEquationsByEquatingRealAndImaginaryParts covers solving complex equations by equating parts. */
export const solvingEquationsByEquatingRealAndImaginaryParts: TopicDef = {
  id: "solving-equations-by-equating-real-and-imaginary-parts",
  title: t("Solving Equations by Equating Real and Imaginary Parts", "比较实部与虚部解复数方程"),
  summary: t(
    "Solve complex equations for unknown real numbers x and y by equating real parts and imaginary parts on both sides of the equation.",
    "通过使方程两边的实部与虚部分别相等，求解关于未知实数 x 与 y 的复数方程。",
  ),
  prerequisites: ["dividing-complex-numbers"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.A.1", "CCSS.HSN.CN.A.2"],
  intro: t(
    `Every complex number can be brought to the form $a + bi$ with real $a$ and $b$, even a quotient: dividing $5 + i$ by $1 + i$ gives $3 - 2i$. In that form the real part and the imaginary part can be read off. Two complex numbers are the same point of the plane only when both coordinates agree. So if $x + yi = 3 - 2i$ with $x$ and $y$ real, then $x = 3$ and $y = -2$.

Check: the point $(x, y)$ is then $(3, -2)$, the point of $3 - 2i$.

In this lesson we turn one equation between complex numbers into two equations between real numbers, one for the real parts and one for the imaginary parts, and solve them.`,
    `每个复数都能写成 $a + bi$（$a$、$b$ 为实数）的形式，商也不例外：$5 + i$ 除以 $1 + i$ 得 $3 - 2i$。写成这种形式后，就能读出实部和虚部。两个复数只有在两个坐标都相同时才是平面上的同一个点。所以若 $x + yi = 3 - 2i$，且 $x$、$y$ 为实数，则 $x = 3$，$y = -2$。

检验：这时点 $(x, y)$ 是 $(3, -2)$，正是 $3 - 2i$ 对应的点。

这节课我们把复数之间的一个方程变成实数之间的两个方程，一个比较实部，一个比较虚部，再解出它们。`,
  ),
  knowledgePoints: [
    {
      id: "equating-real-and-imaginary-parts-linear",
      title: t("Equate real and imaginary parts to solve for variables", "比较实部与虚部求解实变量"),
      explanation: t(
        "Two complex numbers are equal if and only if both their real parts and their imaginary parts are equal:\n\n$$A + Bi = C + Di \\iff A = C \\text{ and } B = D$$\n\nThis fundamental principle turns a single complex equation into a system of two real equations.\n\nFor example, $(2x + 1) + (3y - 2)i = 7 + 4i$ gives $2x + 1 = 7$ and $3y - 2 = 4$, so $x = 3$ and $y = 2$. Check: $2(3) + 1 = 7$ and $3(2) - 2 = 4$.\n\n> **Watch out.** This works only when $A$, $B$, $C$ and $D$ are real. The imaginary part is the real number multiplying $i$, so compare $3y - 2$ with $4$, not with $4i$.",
        "两个复数相等当且仅当它们的实部与虚部分别对应相等：\n\n$$A + Bi = C + Di \\iff A = C \\text{ 且 } B = D$$\n\n这一基本原理将一个复数方程转化为关于实变量的两个独立实方程。\n\n例如，由 $(2x + 1) + (3y - 2)i = 7 + 4i$ 得到 $2x + 1 = 7$ 和 $3y - 2 = 4$，所以 $x = 3$，$y = 2$。检验：$2(3) + 1 = 7$，$3(2) - 2 = 4$。\n\n> **注意。** 只有当 $A$、$B$、$C$、$D$ 都是实数时才能这样做。虚部是乘在 $i$ 前面的实数，所以要把 $3y - 2$ 与 $4$ 比较，而不是与 $4i$ 比较。",
      ),
      generate(rng) {
        const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const a = rng.pick([2, 3, 4, 5]);
        const c = rng.pick([2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const d = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const p = a * x + b;
        const q = c * y + d;
        const leftReal = `${a}x ${b >= 0 ? `+ ${b}` : `- ${-b}`}`;
        const leftImag = `${c}y ${d >= 0 ? `+ ${d}` : `- ${-d}`}`;
        return pointProblem({
          prompt: t(
            `Find the real numbers $x$ and $y$ that satisfy $(${leftReal}) + (${leftImag})i = ${cx(p, q)}$, written as $(x, y)$.`,
            `求满足方程 $(${leftReal}) + (${leftImag})i = ${cx(p, q)}$ 的实数 $x$ 和 $y$，写成有序数对 $(x, y)$。`,
          ),
          answer: [x, y],
          vars: ["x", "y"],
          wrong: [
            [y, x],
            [-x, y],
            [x, -y],
            [-x, -y],
          ],
          solution: walked(
            [
              [
                ["Equate real parts", "实部相等"],
                t(
                  `Since $x$ and $y$ are real, the real part on the left is $${leftReal}$ and on the right it is $${p}$:`,
                  `因为 $x$、$y$ 是实数，左边的实部是 $${leftReal}$，右边的实部是 $${p}$：`,
                ),
                [`${leftReal} = ${p}`, `${a}x = ${p - b}`, `x = ${x}`],
              ],
              [
                ["Equate imaginary parts", "虚部相等"],
                t(
                  `The imaginary part on the left is $${leftImag}$ and on the right it is $${q}$:`,
                  `左边的虚部是 $${leftImag}$，右边的虚部是 $${q}$：`,
                ),
                [`${leftImag} = ${q}`, `${c}y = ${q - d}`, `y = ${y}`],
              ],
            ],
            t(
              `Substitute back: $${a}(${x}) ${b >= 0 ? `+ ${b}` : `- ${-b}`} = ${p}$ and $${c}(${y}) ${d >= 0 ? `+ ${d}` : `- ${-d}`} = ${q}$, so the left side is $${cx(p, q)}$.`,
              `代回检验：$${a}(${x}) ${b >= 0 ? `+ ${b}` : `- ${-b}`} = ${p}$，$${c}(${y}) ${d >= 0 ? `+ ${d}` : `- ${-d}`} = ${q}$，所以左边等于 $${cx(p, q)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "equations-with-complex-conjugates",
      title: t("Equations involving conjugates", "含共轭复数的方程求解"),
      explanation: t(
        "To solve an equation containing both $z$ and its conjugate $\\bar{z}$, substitute $z = x + yi$ and $\\bar{z} = x - yi$ (with $x, y \\in \\mathbb{R}$), expand, and equate real and imaginary parts.\n\nFor example, for $2z + \\bar{z} = 6 + 2i$ the left side is $2(x + yi) + (x - yi) = 3x + yi$. So $3x = 6$ and $y = 2$, which gives $z = 2 + 2i$. Check: $2(2 + 2i) + (2 - 2i) = 6 + 2i$.\n\n> **Watch out.** In $\\bar{z} = x - yi$ the imaginary part carries a minus sign, so the $y$ terms partly cancel: $2z + \\bar{z}$ has imaginary part $y$, not $3y$.",
        "求解同时含有未知数 $z$ 及其共轭 $\\bar{z}$ 的方程时，设 $z = x + yi$ 且 $\\bar{z} = x - yi$（其中 $x, y \\in \\mathbb{R}$），展开后分别令两边的实部与虚部相等即可求解。\n\n例如，对 $2z + \\bar{z} = 6 + 2i$，左边是 $2(x + yi) + (x - yi) = 3x + yi$。所以 $3x = 6$，$y = 2$，得 $z = 2 + 2i$。检验：$2(2 + 2i) + (2 - 2i) = 6 + 2i$。\n\n> **注意。** $\\bar{z} = x - yi$ 的虚部带负号，所以含 $y$ 的项会部分抵消：$2z + \\bar{z}$ 的虚部是 $y$，而不是 $3y$。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3]);
        const m = 1;
        const x = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const y = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const bigA = (k + m) * x;
        const bigB = (k - m) * y;
        return expressionProblem({
          prompt: t(
            `Find the complex number $z = x + yi$ ($x, y \\in \\mathbb{R}$) that satisfies $${k}z + \\bar{z} = ${cx(bigA, bigB)}$.`,
            `设 $x, y \\in \\mathbb{R}$，求满足方程 $${k}z + \\bar{z} = ${cx(bigA, bigB)}$ 的复数 $z = x + yi$。`,
          ),
          answer: cx(x, y),
          simplified: true,
          wrong: [cx(x, -y), cx(-x, y), cx(y, x), cx(-x, -y)],
          solution: walked(
            [
              [
                ["Substitute", "代入"],
                t(
                  `Write $z = x + yi$ and $\\bar{z} = x - yi$, and collect the real and imaginary parts of the left side:`,
                  `设 $z = x + yi$，$\\bar{z} = x - yi$，整理左边的实部和虚部：`,
                ),
                [`${k}(x + yi) + (x - yi) = ${poly([k + m, "x"])} + ${poly([k - m, "y"])}i`],
              ],
              [
                ["Equate parts", "比较两部分"],
                t(
                  `The real parts and the imaginary parts must match those of $${cx(bigA, bigB)}$:`,
                  `实部和虚部要分别等于 $${cx(bigA, bigB)}$ 的实部和虚部：`,
                ),
                [`${poly([k + m, "x"])} = ${bigA}, \\quad x = ${x}`, `${poly([k - m, "y"])} = ${bigB}, \\quad y = ${y}`],
              ],
            ],
            t(
              `With $z = ${cx(x, y)}$, the left side $${k}z + \\bar{z}$ has real part $${k}(${x}) + ${cxPar(x, 0)} = ${bigA}$ and imaginary part $${k}(${y}) - ${cxPar(y, 0)} = ${bigB}$, which matches the right side.`,
              `当 $z = ${cx(x, y)}$ 时，左边 $${k}z + \\bar{z}$ 的实部是 $${k}(${x}) + ${cxPar(x, 0)} = ${bigA}$，虚部是 $${k}(${y}) - ${cxPar(y, 0)} = ${bigB}$，与右边相符。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.31.6: Extending Polynomial Identities ─────────────────────────

/** extendingPolynomialIdentitiesToTheComplexNumbers covers sum of squares and factoring over C. */
export const extendingPolynomialIdentitiesToTheComplexNumbers: TopicDef = {
  id: "extending-polynomial-identities-to-the-complex-numbers",
  title: t("Extending Polynomial Identities to the Complex Numbers", "复数范围内的多项式恒等式与因式分解"),
  summary: t(
    "Extend algebraic identities such as the sum of squares a² + b² = (a + bi)(a - bi) to the complex numbers, and factor quadratic expressions completely over C.",
    "将平方和公式 a² + b² = (a + bi)(a - bi) 推广到复数域，并在复数范围内彻底因式分解二次多项式。",
  ),
  prerequisites: ["the-complex-conjugate-and-the-roots-of-a-quadratic-equation"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSA.SSE.A.2", "CCSS.HSN.CN.C.8"],
  intro: t(
    `A real quadratic with negative discriminant has a conjugate pair of roots $p \\pm qi$. For example, $x^2 + 4 = 0$ gives $x^2 = -4$, so $x = 2i$ or $x = -2i$. Each root $r$ of a polynomial gives a factor $x - r$, so we expect $x^2 + 4 = (x - 2i)(x + 2i)$.

Check: $(x - 2i)(x + 2i) = x^2 - (2i)^2 = x^2 - (-4) = x^2 + 4$.

In this lesson we factor sums of squares and other quadratics with complex roots into linear factors, using the identities we already know for real numbers.`,
    `判别式为负的实系数二次式有一对共轭根 $p \\pm qi$。例如，由 $x^2 + 4 = 0$ 得 $x^2 = -4$，所以 $x = 2i$ 或 $x = -2i$。多项式的每个根 $r$ 给出一个因式 $x - r$，所以我们预期 $x^2 + 4 = (x - 2i)(x + 2i)$。

检验：$(x - 2i)(x + 2i) = x^2 - (2i)^2 = x^2 - (-4) = x^2 + 4$。

这节课我们借助实数中已经熟悉的恒等式，把平方和以及其他有复数根的二次式分解为一次因式。`,
  ),
  knowledgePoints: [
    {
      id: "factoring-sum-of-squares",
      title: t("Factoring sum of squares over complex numbers", "在复数范围内分解平方和"),
      explanation: t(
        "Over the real numbers, a sum of squares $a^2 + b^2$ cannot be factored into linear real factors. Over the complex numbers, since $i^2 = -1$, we can write $b^2 = -(bi)^2$, giving the difference of squares:\n\n$$a^2 + b^2 = a^2 - (bi)^2 = (a + bi)(a - bi)$$\n\nFor example: $x^2 + 9 = (x + 3i)(x - 3i)$ and $4x^2 + 25 = (2x + 5i)(2x - 5i)$. Check the second: $(2x)^2 - (5i)^2 = 4x^2 + 25$.\n\n> **Watch out.** Take square roots of both terms before attaching $i$: $4x^2 + 25$ has $(2x)^2$ and $5^2$, so the factors use $2x$ and $5i$, not $4x$ and $25i$. And $(2x + 5)(2x - 5) = 4x^2 - 25$ is the difference, not the sum.",
        "在实数范围内，平方和 $a^2 + b^2$ 无法分解为一次实因式。但在复数范围内，利用 $i^2 = -1$，可将 $b^2$ 改写为 $-(bi)^2$，从而利用平方差公式进行因式分解：\n\n$$a^2 + b^2 = a^2 - (bi)^2 = (a + bi)(a - bi)$$\n\n例如：$x^2 + 9 = (x + 3i)(x - 3i)$，以及 $4x^2 + 25 = (2x + 5i)(2x - 5i)$。检验第二个：$(2x)^2 - (5i)^2 = 4x^2 + 25$。\n\n> **注意。** 先给两项开平方再添上 $i$：$4x^2 + 25$ 是 $(2x)^2$ 与 $5^2$ 之和，所以因式用 $2x$ 和 $5i$，而不是 $4x$ 和 $25i$。而 $(2x + 5)(2x - 5) = 4x^2 - 25$ 是平方差，不是平方和。",
      ),
      generate(rng) {
        const pairs = [
          [1, 2],
          [1, 3],
          [1, 4],
          [1, 5],
          [1, 6],
          [1, 7],
          [1, 8],
          [1, 9],
          [1, 10],
          [2, 3],
          [2, 5],
          [2, 7],
          [2, 9],
          [3, 2],
          [3, 4],
          [3, 5],
          [3, 7],
          [3, 8],
          [3, 10],
          [4, 3],
          [4, 5],
          [4, 7],
          [4, 9],
          [5, 2],
          [5, 3],
          [5, 4],
          [5, 6],
          [5, 7],
          [5, 8],
          [5, 9],
        ] as const;
        const [a, b] = rng.pick(pairs);
        const aSq = a * a;
        const bSq = b * b;
        const exprStr = a === 1 ? `x^2 + ${bSq}` : `${aSq}x^2 + ${bSq}`;
        const axStr = a === 1 ? "x" : `${a}x`;
        return factoredProblem({
          prompt: t(
            `Factor the expression $${exprStr}$ completely over the complex numbers.`,
            `在复数范围内彻底因式分解式子 $${exprStr}$。`,
          ),
          answer: `(${axStr} + ${b}i)(${axStr} - ${b}i)`,
          wrong: [
            `(${axStr} + ${b})(${axStr} - ${b})`,
            `(${axStr} + ${b}i)^2`,
            `(${axStr} - ${b}i)^2`,
            `(${axStr} + ${bSq}i)(${axStr} - ${bSq}i)`,
          ],
          solution: walked(
            [
              [
                ["Write both terms as squares", "把两项写成平方"],
                t(
                  `The first term is $(${axStr})^2$ and the second is $${b}^2$. Since $i^2 = -1$, the second is also $-(${b}i)^2$, so the sum is a difference of squares:`,
                  `第一项是 $(${axStr})^2$，第二项是 $${b}^2$。因为 $i^2 = -1$，第二项也等于 $-(${b}i)^2$，所以这个和是平方差：`,
                ),
                [`${exprStr} = (${axStr})^2 - (${b}i)^2`],
              ],
              [
                ["Factor", "分解"],
                t(
                  `Use $u^2 - v^2 = (u + v)(u - v)$ with $u = ${axStr}$ and $v = ${b}i$:`,
                  `用 $u^2 - v^2 = (u + v)(u - v)$，其中 $u = ${axStr}$，$v = ${b}i$：`,
                ),
                [`${exprStr} = (${axStr} + ${b}i)(${axStr} - ${b}i)`],
              ],
            ],
            t(
              `Expand the factors: the cross terms $\\pm ${b * a === 1 ? "" : b * a}xi$ cancel, and $(${b}i)(-${b}i) = ${bSq}$, so the product is $${exprStr}$.`,
              `展开因式：交叉项 $\\pm ${b * a === 1 ? "" : b * a}xi$ 相消，$(${b}i)(-${b}i) = ${bSq}$，所以乘积是 $${exprStr}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "factoring-quadratics-over-complex-numbers",
      title: t("Factoring general quadratics over the complex numbers", "在复数范围内分解二次多项式"),
      explanation: t(
        "Every quadratic factors into linear factors once complex numbers are allowed, one factor for each root found with the quadratic formula. Every quadratic $x^2 - 2px + (p^2 + q^2)$ with complex roots $p \\pm qi$ factors completely over $\\mathbb{C}$ as:\n\n$$[x - (p + qi)][x - (p - qi)]$$\n\nFor instance, completing the square gives\n\n$$x^2 - 6x + 13 = (x - 3)^2 + 4 = [x - (3 + 2i)][x - (3 - 2i)]$$\n\nCheck: the roots $3 \\pm 2i$ have sum $6$ and product $9 + 4 = 13$, which match $-6$ and $13$ in the quadratic.\n\n> **Watch out.** Each factor is $x$ minus a root, so the signs inside are those of the roots themselves: $x^2 - 6x + 13$ has the factor $x - (3 + 2i)$, not $x + (3 + 2i)$.",
        "只要允许使用复数，每个二次式都能分解为一次因式，用求根公式求出的每个根对应一个因式。每一个具有共轭虚根 $p \\pm qi$ 的二次多项式 $x^2 - 2px + (p^2 + q^2)$ 在复数域 $\\mathbb{C}$ 上都可分解为：\n\n$$[x - (p + qi)][x - (p - qi)]$$\n\n例如，配方得到\n\n$$x^2 - 6x + 13 = (x - 3)^2 + 4 = [x - (3 + 2i)][x - (3 - 2i)]$$\n\n检验：根 $3 \\pm 2i$ 之和为 $6$，之积为 $9 + 4 = 13$，与二次式中的 $-6$ 和 $13$ 相符。\n\n> **注意。** 每个因式是 $x$ 减去一个根，所以括号内的符号就是根本身的符号：$x^2 - 6x + 13$ 的因式是 $x - (3 + 2i)$，而不是 $x + (3 + 2i)$。",
      ),
      generate(rng) {
        const p = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const q = rng.pick([1, 2, 3, 4, 5]);
        const lin = -2 * p;
        const constTerm = p * p + q * q;
        const polyStr = `x^2 ${lin > 0 ? `+ ${lin}x` : `- ${-lin}x`} + ${constTerm}`;
        const z1Str = cx(p, q);
        const z2Str = cx(p, -q);
        const prompt = t(
          `Factor the polynomial $P(x) = ${polyStr}$ completely into linear factors over $\\mathbb{C}$.`,
          `在复数域 $\\mathbb{C}$ 上将多项式 $P(x) = ${polyStr}$ 彻底分解为一次因式。`,
        );
        const right = t(`$[x - (${z1Str})][x - (${z2Str})]$`, `$[x - (${z1Str})][x - (${z2Str})]$`);
        const plus = t(`$[x + (${z1Str})][x + (${z2Str})]$`, `$[x + (${z1Str})][x + (${z2Str})]$`);
        const square = t(`$[x - (${z1Str})]^2$`, `$[x - (${z1Str})]^2$`);
        const realFactors = t(
          `$(${poly([1, "x"], [-(p + q), ""])})(${poly([1, "x"], [q - p, ""])})$`,
          `$(${poly([1, "x"], [-(p + q), ""])})(${poly([1, "x"], [q - p, ""])})$`,
        );
        const solution = walked(
          [
            [
              ["Complete the square", "配方"],
              t(
                `Half of the coefficient of $x$ is $${-p}$, so the quadratic is a square plus $${q * q}$:`,
                `$x$ 的系数的一半是 $${-p}$，所以二次式等于一个平方加 $${q * q}$：`,
              ),
              [`${polyStr} = (${poly([1, "x"], [-p, ""])})^2 + ${q * q}`],
            ],
            [
              ["Factor the sum of squares", "分解平方和"],
              t(
                `Write $${q * q}$ as $-(${q === 1 ? "" : q}i)^2$ and factor the difference of squares:`,
                `把 $${q * q}$ 写成 $-(${q === 1 ? "" : q}i)^2$，再按平方差分解：`,
              ),
              [`(${poly([1, "x"], [-p, ""])})^2 - (${q === 1 ? "" : q}i)^2`, `= [x - (${z1Str})][x - (${z2Str})]`],
            ],
          ],
          t(
            `The roots $${z1Str}$ and $${z2Str}$ have sum $${2 * p}$ and product $${p * p} + ${q * q} = ${constTerm}$, so the product of the factors is $x^2 - (${2 * p})x + ${constTerm}$, which is $P(x)$.`,
            `根 $${z1Str}$ 与 $${z2Str}$ 之和为 $${2 * p}$，之积为 $${p * p} + ${q * q} = ${constTerm}$，所以因式之积是 $x^2 - (${2 * p})x + ${constTerm}$，即 $P(x)$。`,
          ),
        );
        return oneOf(rng, prompt, right, [plus, square, realFactors], solution, [
          why(
            plus,
            `These factors vanish at the negatives of the roots; multiplied out they give x² ${p > 0 ? "+" : "−"} ${Math.abs(2 * p)}x + ${constTerm}, with the wrong sign on the x term.`,
            `这些因式在根的相反数处为零；乘开得 x² ${p > 0 ? "+" : "−"} ${Math.abs(2 * p)}x + ${constTerm}，x 项的符号错了。`,
          ),
          why(
            square,
            "A square has only one root, but this quadratic has two different roots, a conjugate pair; the square also has non-real coefficients.",
            "平方只有一个根，而这个二次式有两个不同的根，是一对共轭根；而且这个平方的系数不是实数。",
          ),
          why(
            realFactors,
            `These real factors multiply to a square minus ${q * q}, giving the constant term ${p * p - q * q}; the square is plus ${q * q}, which needs the imaginary number ${q === 1 ? "" : q}i.`,
            `这两个实因式之积是一个平方减 ${q * q}，常数项为 ${p * p - q * q}；而这里是平方加 ${q * q}，需要用虚数 ${q === 1 ? "" : q}i。`,
          ),
        ]);
      },
    },
  ],
};

// ─── Module 10.32: Complex Numbers in Polar Form ─────────────────────────────

/** thePolarFormOfAComplexNumber covers conversion between rectangular and polar form. */
export const thePolarFormOfAComplexNumber: TopicDef = {
  id: "the-polar-form-of-a-complex-number",
  title: t("The Polar Form of a Complex Number", "复数的三角形式（极坐标形式）"),
  summary: t(
    "Convert complex numbers between rectangular form a + bi and polar (trigonometric) form r(cos θ + i sin θ), where r = |z| ≥ 0 is the modulus and θ = arg(z) is the argument.",
    "实现复数在代数形式 a + bi 与三角形式（极坐标形式）r(cos θ + i sin θ) 之间的相互转换，其中 r = |z| ≥ 0 为模长，θ = arg(z) 为辐角。",
  ),
  prerequisites: ["the-argument-of-a-complex-number"],
  encompasses: [{ topic: "the-argument-of-a-complex-number", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4"],
  intro: t(
    `A nonzero complex number is fixed by its modulus, its distance from the origin, and its argument, the angle from the positive real axis. For example, $z = 1 + i$ has modulus $\\sqrt{1^2 + 1^2} = \\sqrt{2}$ and argument $\\frac{\\pi}{4}$. A point at distance $r$ in direction $\\theta$ has coordinates $(r\\cos\\theta, r\\sin\\theta)$, so we can write $1 + i$ using only $\\sqrt{2}$ and $\\frac{\\pi}{4}$.

Check: the cosine and the sine of $\\frac{\\pi}{4}$ are both $\\frac{\\sqrt{2}}{2}$, and $\\sqrt{2} \\cdot \\frac{\\sqrt{2}}{2} = 1$. So the point is $(1, 1)$.

In this lesson we write complex numbers in polar form $r(\\cos\\theta + i\\sin\\theta)$ and convert between this form and $a + bi$.`,
    `一个非零复数由它的模（到原点的距离）和辐角（与正实轴的夹角）确定。例如，$z = 1 + i$ 的模是 $\\sqrt{1^2 + 1^2} = \\sqrt{2}$，辐角是 $\\frac{\\pi}{4}$。距离为 $r$、方向为 $\\theta$ 的点的坐标是 $(r\\cos\\theta, r\\sin\\theta)$，所以只用 $\\sqrt{2}$ 和 $\\frac{\\pi}{4}$ 就能写出 $1 + i$。

检验：$\\frac{\\pi}{4}$ 的余弦和正弦都是 $\\frac{\\sqrt{2}}{2}$，而 $\\sqrt{2} \\cdot \\frac{\\sqrt{2}}{2} = 1$。所以这个点是 $(1, 1)$。

这节课我们把复数写成三角形式 $r(\\cos\\theta + i\\sin\\theta)$，并在这种形式与 $a + bi$ 之间互相转换。`,
  ),
  knowledgePoints: [
    {
      id: "convert-rectangular-to-polar-form",
      title: t("Convert rectangular form to polar form", "将代数形式转换为三角形式"),
      explanation: t(
        "The **polar form** (or trigonometric form) of $z = a + bi$ is:\n\n$$z = r(\\cos\\theta + i\\sin\\theta)$$\n\nwhere:\n- $r = |z| = \\sqrt{a^2 + b^2} \\ge 0$ is the **modulus**\n- $\\theta = \\arg(z)$ is the **argument** with $a = r\\cos\\theta$ and $b = r\\sin\\theta$\n\nFor example, $z = -2 + 2\\sqrt{3}i$ has $r = \\sqrt{4 + 12} = 4$. It lies in Quadrant II with reference angle $\\frac{\\pi}{3}$, so the argument is $\\frac{2\\pi}{3}$, which is $\\pi$ minus $\\frac{\\pi}{3}$:\n\n$$z = 4\\left(\\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3}\\right)$$\n\nCheck: the cosine of $\\frac{2\\pi}{3}$ is $-\\frac{1}{2}$, and $4 \\cdot \\left(-\\frac{1}{2}\\right) = -2$, the real part.\n\n> **Watch out.** The argument must point into the quadrant of $z$. An angle with the right reference angle in another quadrant gives the right sizes of the parts but the wrong signs.",
        "复数 $z = a + bi$ 的**三角形式**（或极坐标形式）为：\n\n$$z = r(\\cos\\theta + i\\sin\\theta)$$\n\n其中：\n- $r = |z| = \\sqrt{a^2 + b^2} \\ge 0$ 为**模长**\n- $\\theta = \\arg(z)$ 为**辐角**，满足 $a = r\\cos\\theta$ 且 $b = r\\sin\\theta$\n\n例如，$z = -2 + 2\\sqrt{3}i$ 的模是 $r = \\sqrt{4 + 12} = 4$。它在第二象限，参考角为 $\\frac{\\pi}{3}$，所以辐角是 $\\pi$ 减去 $\\frac{\\pi}{3}$，即 $\\frac{2\\pi}{3}$：\n\n$$z = 4\\left(\\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3}\\right)$$\n\n检验：$\\frac{2\\pi}{3}$ 的余弦是 $-\\frac{1}{2}$，而 $4 \\cdot \\left(-\\frac{1}{2}\\right) = -2$，正是实部。\n\n> **注意。** 辐角必须指向 $z$ 所在的象限。参考角对了但象限不对的角，给出的两部分大小对，符号却不对。",
      ),
      generate(rng) {
        const items = getSpecialPolarItems();
        const item = rng.pick(items);
        const place = specialAngles[item.theta]!;
        const polar = (r: number, angle: string) =>
          t(
            `$${r}\\left(\\cos\\left(${angle}\\right) + i\\sin\\left(${angle}\\right)\\right)$`,
            `$${r}\\left(\\cos\\left(${angle}\\right) + i\\sin\\left(${angle}\\right)\\right)$`,
          );
        const prompt = t(
          `Convert $z = ${item.rect}$ into polar form $r(\\cos\\theta + i\\sin\\theta)$ with $r > 0$ and $0 \\le \\theta < 2\\pi$.`,
          `将 $z = ${item.rect}$ 转换为三角形式 $r(\\cos\\theta + i\\sin\\theta)$，其中 $r > 0$ 且 $0 \\le \\theta < 2\\pi$。`,
        );
        const right = polar(item.r, item.theta);
        const wrongAngles = item.wrongThetas.map((w) => polar(item.r, w));
        const doubled = polar(item.r * 2, item.theta);
        const [homeEn, homeZh] = angleHome(place);
        const solution = walked(
          [
            [
              ["Find the modulus", "求模"],
              t(
                `The squares of the real and imaginary parts of $z$ add up to $${item.r * item.r}$, so`,
                `$z$ 的实部与虚部的平方和是 $${item.r * item.r}$，所以`,
              ),
              [`r = |z| = \\sqrt{${item.r * item.r}} = ${item.r}`],
            ],
            place.quadrant === 0
              ? [
                  ["Find the argument", "求辐角"],
                  t(
                    `One part of $z$ is $0$, so $z$ points ${homeEn}, which is the direction at angle`,
                    `$z$ 有一部分是 $0$，所以 $z$ ${homeZh}，对应的角是`,
                  ),
                  [`\\theta = ${item.theta}`],
                ]
              : [
                  ["Find the argument", "求辐角"],
                  t(
                    `The signs of the parts point ${homeEn}, and the ratio of their sizes gives the reference angle $${place.ref}$. So`,
                    `两部分的符号说明 $z$ ${homeZh}，它们大小之比给出参考角 $${place.ref}$。所以`,
                  ),
                  [`\\theta = ${place.rule} = ${item.theta}`],
                ],
          ],
          t(
            `At this angle $\\cos\\theta = ${place.cos}$ and $\\sin\\theta = ${place.sin}$. Multiplying each by $${item.r}$ gives back the real and imaginary parts of $${item.rect}$.`,
            `在这个角处 $\\cos\\theta = ${place.cos}$，$\\sin\\theta = ${place.sin}$。分别乘以 $${item.r}$，就得回 $${item.rect}$ 的实部和虚部。`,
          ),
        );
        return oneOf(rng, prompt, right, [...wrongAngles, doubled], solution, [
          ...item.wrongThetas.map((w, i) => {
            const [en, zh] = angleMiss(item.theta, w);
            return why(wrongAngles[i]!, en, zh);
          }),
          why(
            doubled,
            `The modulus is ${item.r}, the square root of the sum of the squares of the parts, not twice that.`,
            `模是各部分平方和的平方根 ${item.r}，不是它的两倍。`,
          ),
        ]);
      },
    },
    {
      id: "convert-polar-to-rectangular-form",
      title: t("Convert polar form to rectangular form", "将三角形式转换为代数形式"),
      explanation: t(
        "The real part is the horizontal coordinate and the imaginary part is the vertical one, just as with converting polar coordinates of a point. To convert $z = r(\\cos\\theta + i\\sin\\theta)$ to rectangular form $a + bi$, evaluate $\\cos\\theta$ and $\\sin\\theta$, then distribute $r$:\n\n$$a = r\\cos\\theta, \\quad b = r\\sin\\theta$$\n\n$$z = (r\\cos\\theta) + (r\\sin\\theta)i$$\n\nFor example, $6\\left(\\cos\\frac{7\\pi}{6} + i\\sin\\frac{7\\pi}{6}\\right)$ uses the cosine $-\\frac{\\sqrt{3}}{2}$ and the sine $-\\frac{1}{2}$ of $\\frac{7\\pi}{6}$, so it equals $-3\\sqrt{3} - 3i$. Check: $(3\\sqrt{3})^2 + 3^2 = 27 + 9 = 36 = 6^2$.\n\n> **Watch out.** Do not mix up the cosine and the sine. The cosine gives the real part and the sine the imaginary part; for $\\frac{\\pi}{6}$ the cosine is the larger one, $\\frac{\\sqrt{3}}{2}$.",
        "实部是水平坐标，虚部是竖直坐标，与把点的极坐标化为直角坐标完全一样。将三角形式 $z = r(\\cos\\theta + i\\sin\\theta)$ 转换为代数形式 $a + bi$ 时，先求出 $\\cos\\theta$ 与 $\\sin\\theta$ 的精确值，再乘以模长 $r$：\n\n$$a = r\\cos\\theta, \\quad b = r\\sin\\theta$$\n\n$$z = (r\\cos\\theta) + (r\\sin\\theta)i$$\n\n例如，$6\\left(\\cos\\frac{7\\pi}{6} + i\\sin\\frac{7\\pi}{6}\\right)$ 用到 $\\frac{7\\pi}{6}$ 的余弦 $-\\frac{\\sqrt{3}}{2}$ 和正弦 $-\\frac{1}{2}$，所以它等于 $-3\\sqrt{3} - 3i$。检验：$(3\\sqrt{3})^2 + 3^2 = 27 + 9 = 36 = 6^2$。\n\n> **注意。** 不要把余弦和正弦弄混。余弦给出实部，正弦给出虚部；对 $\\frac{\\pi}{6}$，余弦是较大的那个，即 $\\frac{\\sqrt{3}}{2}$。",
      ),
      generate(rng) {
        const items = getSpecialPolarItems();
        const item = rng.pick(items);
        const place = specialAngles[item.theta]!;
        const prompt = t(
          `Convert $z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$ into rectangular form $a + bi$.`,
          `将 $z = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)$ 转换为代数形式 $a + bi$。`,
        );
        const right = t(`$${item.rect}$`, `$${item.rect}$`);
        const wrong = item.wrongRects.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = walked(
          [
            [
              ["Evaluate the cosine and sine", "求余弦和正弦"],
              t(`At $\\theta = ${item.theta}$ the special values are`, `在 $\\theta = ${item.theta}$ 处的特殊值是`),
              [`\\cos\\left(${item.theta}\\right) = ${place.cos}, \\quad \\sin\\left(${item.theta}\\right) = ${place.sin}`],
            ],
            [
              ["Multiply by the modulus", "乘以模"],
              t(
                `The real part is $${item.r}\\cos\\theta$ and the imaginary part is $${item.r}\\sin\\theta$, so`,
                `实部是 $${item.r}\\cos\\theta$，虚部是 $${item.r}\\sin\\theta$，所以`,
              ),
              [`z = ${item.rect}`],
            ],
          ],
          t(
            `The squares of the two parts of $${item.rect}$ add up to $${item.r * item.r} = ${item.r}^2$, the square of the modulus, and their signs match the direction of $${item.theta}$.`,
            `$${item.rect}$ 两部分的平方和是 $${item.r * item.r} = ${item.r}^2$，即模的平方，而且它们的符号与 $${item.theta}$ 的方向相符。`,
          ),
        );
        return oneOf(
          rng,
          prompt,
          right,
          wrong,
          solution,
          item.wrongRects.map((w, i) => {
            const [en, zh] = rectMiss(item.r, item.theta, w);
            return why(wrong[i]!, en, zh);
          }),
        );
      },
    },
  ],
};

// ─── Module 10.32.2: Products of Complex Numbers in Polar Form ───────────────

/** productsOfComplexNumbersExpressedInPolarForm covers multiplying moduli and adding arguments. */
export const productsOfComplexNumbersExpressedInPolarForm: TopicDef = {
  id: "products-of-complex-numbers-expressed-in-polar-form",
  title: t("Products of Complex Numbers Expressed in Polar Form", "复数三角形式的乘法法则"),
  summary: t(
    "Multiply complex numbers in polar form using the rule z1 z2 = r1 r2 [cos(θ1 + θ2) + i sin(θ1 + θ2)], multiplying moduli and adding arguments, and interpret geometrically as rotation and dilation.",
    "使用模长相乘、辐角相加的运算法则计算复数三角形式的乘积：z1 z2 = r1 r2 [cos(θ1 + θ2) + i sin(θ1 + θ2)]，并在几何上解释为旋转与伸缩变换。",
  ),
  prerequisites: ["the-polar-form-of-a-complex-number"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5"],
  intro: t(
    `In polar form a complex number is written with its modulus $r$ and argument $\\theta$ as $r(\\cos\\theta + i\\sin\\theta)$. For example, $1 + i$ has modulus $\\sqrt{2}$ and argument $45^\\circ$. Its square is

$$(1 + i)^2 = 1 + 2i + i^2 = 2i$$

This has modulus $2$ and argument $90^\\circ$. The modulus was squared and the argument doubled.

Check: $\\sqrt{2} \\cdot \\sqrt{2} = 2$ and $45^\\circ + 45^\\circ = 90^\\circ$, the modulus and argument of $2i$.

In this lesson we see that this always happens: to multiply in polar form, multiply the moduli and add the arguments, which stretches and turns the point.`,
    `在三角形式中，复数用它的模 $r$ 和辐角 $\\theta$ 写成 $r(\\cos\\theta + i\\sin\\theta)$。例如，$1 + i$ 的模是 $\\sqrt{2}$，辐角是 $45^\\circ$。它的平方是

$$(1 + i)^2 = 1 + 2i + i^2 = 2i$$

它的模为 $2$，辐角为 $90^\\circ$。模平方了，辐角加倍了。

检验：$\\sqrt{2} \\cdot \\sqrt{2} = 2$，$45^\\circ + 45^\\circ = 90^\\circ$，正是 $2i$ 的模和辐角。

这节课我们看到这总是成立：用三角形式做乘法，模相乘、辐角相加，在几何上就是把点伸缩并旋转。`,
  ),
  knowledgePoints: [
    {
      id: "multiplication-rule-in-polar-form",
      figure: precalculusDrawings4["products-of-complex-numbers-expressed-in-polar-form#multiplication-rule-in-polar-form"],
      title: t("Multiplication rule in polar form", "三角形式的乘法法则"),
      explanation: t(
        "To multiply two complex numbers in polar form, **multiply their moduli** and **add their arguments**:\n\n$$z_1 z_2 = r_1 r_2 \\left[\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\right]$$\n\nIf the resulting angle exceeds $360^\\circ$ (or $2\\pi$), subtract full turns to express it in $[0, 360^\\circ)$ or $[0, 2\\pi)$.\n\nFor example, $3(\\cos 40^\\circ + i\\sin 40^\\circ)$ times $2(\\cos 50^\\circ + i\\sin 50^\\circ)$ is $6(\\cos 90^\\circ + i\\sin 90^\\circ) = 6i$. Check: dividing $6i$ by the second factor gives back modulus $6 \\div 2 = 3$ and argument $90^\\circ - 50^\\circ = 40^\\circ$.\n\n> **Watch out.** The moduli multiply, they do not add, and the arguments add, they do not multiply. It is the other way round from what the numbers in front and inside might suggest.",
        "计算三角形式复数的乘积时，法则为**模长相乘、辐角相加**：\n\n$$z_1 z_2 = r_1 r_2 \\left[\\cos(\\theta_1 + \\theta_2) + i\\sin(\\theta_1 + \\theta_2)\\right]$$\n\n若所得角度超过 $360^\\circ$（或 $2\\pi$），则减去 $360^\\circ$ 的整数倍化简至 $[0, 360^\\circ)$ 或 $[0, 2\\pi)$ 内。\n\n例如，$3(\\cos 40^\\circ + i\\sin 40^\\circ)$ 乘 $2(\\cos 50^\\circ + i\\sin 50^\\circ)$ 得 $6(\\cos 90^\\circ + i\\sin 90^\\circ) = 6i$。检验：用 $6i$ 除以第二个因数，得回模 $6 \\div 2 = 3$ 和辐角 $90^\\circ - 50^\\circ = 40^\\circ$。\n\n> **注意。** 模是相乘而不是相加，辐角是相加而不是相乘。别被前面的系数和括号里的角迷惑。",
      ),
      generate(rng) {
        const r1 = rng.pick([2, 3, 4, 5]);
        const r2 = rng.pick([2, 3, 4, 5]);
        const a1 = rng.pick([20, 30, 40, 45, 50, 60, 70, 80, 90]);
        const a2 = rng.pick([15, 25, 30, 45, 60, 75, 90, 120]);
        const rProd = r1 * r2;
        const sumAngle = (a1 + a2) % 360;
        const polar = (r: number, angle: number) =>
          t(`$${r}(\\cos ${angle}^\\circ + i\\sin ${angle}^\\circ)$`, `$${r}(\\cos ${angle}^\\circ + i\\sin ${angle}^\\circ)$`);
        const prompt = t(
          `Multiply $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ and $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$.`,
          `计算 $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ 与 $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$ 的乘积。`,
        );
        const right = polar(rProd, sumAngle);
        const diffAngle = Math.abs(a1 - a2);
        const addedModuli = polar(r1 + r2, sumAngle);
        const subtracted = polar(rProd, diffAngle);
        const multiplied = polar(rProd, (a1 * a2) % 360);
        const solution = walked(
          [
            [
              ["Multiply the moduli", "模相乘"],
              t(`The modulus of the product is the product of the moduli:`, `乘积的模等于两个模之积：`),
              [`r = ${r1} \\times ${r2} = ${rProd}`],
            ],
            [
              ["Add the arguments", "辐角相加"],
              t(
                `The argument of the product is the sum of the arguments, which here is already less than $360^\\circ$:`,
                `乘积的辐角等于两个辐角之和，这里已经小于 $360^\\circ$：`,
              ),
              [`\\theta = ${a1}^\\circ + ${a2}^\\circ = ${sumAngle}^\\circ`],
            ],
          ],
          t(
            `Divide the product by $z_2$ to undo the multiplication: $${rProd} \\div ${r2} = ${r1}$ and $${sumAngle}^\\circ - ${a2}^\\circ = ${a1}^\\circ$, which are the modulus and argument of $z_1$.`,
            `用乘积除以 $z_2$ 来还原：$${rProd} \\div ${r2} = ${r1}$，$${sumAngle}^\\circ - ${a2}^\\circ = ${a1}^\\circ$，正是 $z_1$ 的模和辐角。`,
          ),
        );
        return oneOf(rng, prompt, right, [addedModuli, subtracted, multiplied], solution, [
          why(
            addedModuli,
            `This adds the moduli; the modulus of a product is the product of the moduli, ${r1} × ${r2} = ${rProd}.`,
            `这里把模相加了；乘积的模是两个模之积，${r1} × ${r2} = ${rProd}。`,
          ),
          why(
            subtracted,
            "This subtracts the arguments, which is the rule for a quotient; for a product the arguments add.",
            "这里把辐角相减了，那是除法的法则；乘法时辐角相加。",
          ),
          why(
            multiplied,
            "This multiplies the arguments; for a product the arguments add, while only the moduli multiply.",
            "这里把辐角相乘了；乘法时辐角相加，相乘的只有模。",
          ),
        ]);
      },
    },
    {
      id: "geometric-rotation-and-scaling",
      figure: precalculusDrawings3["products-of-complex-numbers-expressed-in-polar-form#geometric-rotation-and-scaling"],
      title: t("Geometric interpretation of multiplication as rotation and dilation", "复数乘法的旋转与伸缩几何意义"),
      explanation: t(
        "Multiplying any complex number $z$ by $w = r(\\cos\\theta + i\\sin\\theta)$:\n\n1. **Scales** the distance from the origin by a factor of $r = |w|$\n2. **Rotates** the point counterclockwise by an angle of $\\theta = \\arg(w)$\n\nIn particular, multiplying by $i = 1(\\cos 90^\\circ + i\\sin 90^\\circ)$ rotates $z = a + bi$ counterclockwise by $90^\\circ$ ($\\frac{\\pi}{2}$ radians), producing $i(a + bi) = -b + ai$.\n\nFor example, $i(4 + 3i)$ is $4i + 3i^2$, which is $-3 + 4i$. So the point $(4, 3)$ turns to $(-3, 4)$. Check: both points are at distance $5$ from the origin, and $(4)(-3) + (3)(4) = 0$, so the two directions are perpendicular.\n\n> **Watch out.** Multiplying by $i$ turns counterclockwise. Turning clockwise by $90^\\circ$ means multiplying by $-i$, which gives $b - ai$ instead.",
        "复数 $z$ 乘以 $w = r(\\cos\\theta + i\\sin\\theta)$ 的几何意义为：\n\n1. 到原点的距离**伸缩** $r = |w|$ 倍\n2. 绕原点逆时针**旋转**角度 $\\theta = \\arg(w)$\n\n特别地，乘以 $i = 1(\\cos 90^\\circ + i\\sin 90^\\circ)$ 相当于将复数 $z = a + bi$ 绕原点逆时针旋转 $90^\\circ$（$\\frac{\\pi}{2}$ 弧度），结果为 $i(a + bi) = -b + ai$。\n\n例如，$i(4 + 3i)$ 等于 $4i + 3i^2$，即 $-3 + 4i$。所以点 $(4, 3)$ 转到 $(-3, 4)$。检验：两点到原点的距离都是 $5$，而且 $(4)(-3) + (3)(4) = 0$，所以两个方向互相垂直。\n\n> **注意。** 乘以 $i$ 是逆时针旋转。顺时针旋转 $90^\\circ$ 要乘以 $-i$，得到的是 $b - ai$。",
      ),
      generate(rng) {
        const a = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const b = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const rotA = -b;
        const rotB = a;
        return expressionProblem({
          prompt: t(
            `If the complex number $z = ${cx(a, b)}$ is rotated counterclockwise by $90^\\circ$ around the origin, find the resulting complex number in the form $a + bi$.`,
            `若将复数 $z = ${cx(a, b)}$ 绕原点逆时针旋转 $90^\\circ$，求所得的复数（写成 $a + bi$ 形式）。`,
          ),
          answer: cx(rotA, rotB),
          simplified: true,
          wrong: [cx(-rotA, -rotB), cx(rotB, rotA), cx(a, -b), cx(-a, b)],
          solution: walked(
            [
              [
                ["Choose the multiplier", "选定乘数"],
                t(
                  `A counterclockwise turn of $90^\\circ$ with no stretching is multiplication by $\\cos 90^\\circ + i\\sin 90^\\circ = i$.`,
                  `不伸缩、逆时针旋转 $90^\\circ$，就是乘以 $\\cos 90^\\circ + i\\sin 90^\\circ = i$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(`Distribute $i$ and use $i^2 = -1$:`, `把 $i$ 乘进去，并用 $i^2 = -1$：`),
                [`i(${cx(a, b)}) = ${poly([a, "i"], [b, "i^2"])}`, `= ${cx(rotA, rotB)}`],
              ],
            ],
            t(
              `The new point $(${rotA}, ${rotB})$ is as far from the origin as $(${a}, ${b})$, since both have squared distance $${a * a + b * b}$. The dot product $(${a})(${rotA}) + (${b})(${rotB})$ of the two positions is $0$, so the new direction is a quarter turn from the old one.`,
              `新点 $(${rotA}, ${rotB})$ 与 $(${a}, ${b})$ 到原点的距离相同，距离的平方都是 $${a * a + b * b}$。两个位置的数量积 $(${a})(${rotA}) + (${b})(${rotB})$ 等于 $0$，所以新方向与原方向正好相差四分之一圈。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── Module 10.32.3: Quotients of Complex Numbers in Polar Form ───────────────

/** quotientsOfComplexNumbersExpressedInPolarForm covers dividing moduli and subtracting arguments. */
export const quotientsOfComplexNumbersExpressedInPolarForm: TopicDef = {
  id: "quotients-of-complex-numbers-expressed-in-polar-form",
  title: t("Quotients of Complex Numbers Expressed in Polar Form", "复数三角形式的除法法则"),
  summary: t(
    "Divide complex numbers in polar form using the rule z1 / z2 = (r1 / r2) [cos(θ1 - θ2) + i sin(θ1 - θ2)], dividing moduli and subtracting arguments.",
    "使用模长相除、辐角相减的运算法则计算复数三角形式的除法：z1 / z2 = (r1 / r2) [cos(θ1 - θ2) + i sin(θ1 - θ2)]。",
  ),
  prerequisites: ["products-of-complex-numbers-expressed-in-polar-form"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.5"],
  intro: t(
    `To multiply in polar form we multiply the moduli and add the arguments. Division undoes multiplication, so the quotient $\\frac{z_1}{z_2}$ is the number that gives $z_1$ when multiplied by $z_2$. For example, let $z_1$ be $6(\\cos 90^\\circ + i\\sin 90^\\circ)$ and $z_2$ be $2(\\cos 30^\\circ + i\\sin 30^\\circ)$. Multiplying $z_2$ by $3(\\cos 60^\\circ + i\\sin 60^\\circ)$ gives modulus $2 \\cdot 3 = 6$ and argument $30^\\circ + 60^\\circ = 90^\\circ$, which is $z_1$. So the quotient has modulus $3$ and argument $60^\\circ$.

Check: $6 \\div 2 = 3$ and $90^\\circ - 30^\\circ = 60^\\circ$.

In this lesson we divide in polar form by dividing the moduli and subtracting the arguments, and we write the quotient in the form $a + bi$.`,
    `用三角形式做乘法时，模相乘、辐角相加。除法是乘法的逆运算，所以商 $\\frac{z_1}{z_2}$ 就是乘以 $z_2$ 后得到 $z_1$ 的那个数。例如，令 $z_1$ 为 $6(\\cos 90^\\circ + i\\sin 90^\\circ)$，$z_2$ 为 $2(\\cos 30^\\circ + i\\sin 30^\\circ)$。用 $z_2$ 乘以 $3(\\cos 60^\\circ + i\\sin 60^\\circ)$，模为 $2 \\cdot 3 = 6$，辐角为 $30^\\circ + 60^\\circ = 90^\\circ$，正是 $z_1$。所以商的模是 $3$，辐角是 $60^\\circ$。

检验：$6 \\div 2 = 3$，$90^\\circ - 30^\\circ = 60^\\circ$。

这节课我们用三角形式做除法：模相除、辐角相减，并把商写成 $a + bi$ 的形式。`,
  ),
  knowledgePoints: [
    {
      id: "division-rule-in-polar-form",
      figure: precalculusDrawings4["quotients-of-complex-numbers-expressed-in-polar-form#division-rule-in-polar-form"],
      title: t("Division rule in polar form", "三角形式的除法法则"),
      explanation: t(
        "To divide two complex numbers in polar form, **divide their moduli** and **subtract their arguments**:\n\n$$\\frac{z_1}{z_2} = \\frac{r_1}{r_2}\\left[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)\\right]$$\n\nIf the resulting angle is negative, add $360^\\circ$ (or $2\\pi$) to bring it into $[0, 360^\\circ)$ or $[0, 2\\pi)$.\n\nFor example, $12(\\cos 150^\\circ + i\\sin 150^\\circ)$ divided by $4(\\cos 60^\\circ + i\\sin 60^\\circ)$ is $3(\\cos 90^\\circ + i\\sin 90^\\circ)$, which is $3i$. Check: multiplying $3i$ back by the divisor gives modulus $3 \\cdot 4 = 12$ and argument $90^\\circ + 60^\\circ = 150^\\circ$.\n\n> **Watch out.** Subtract the argument of the divisor from the argument of the dividend, in that order, and divide the moduli rather than subtracting them.",
        "计算三角形式复数的商时，法则为**模长相除、辐角相减**：\n\n$$\\frac{z_1}{z_2} = \\frac{r_1}{r_2}\\left[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)\\right]$$\n\n若所得角度为负，加上 $360^\\circ$（或 $2\\pi$）将其化至 $[0, 360^\\circ)$ 或 $[0, 2\\pi)$ 内。\n\n例如，$12(\\cos 150^\\circ + i\\sin 150^\\circ)$ 除以 $4(\\cos 60^\\circ + i\\sin 60^\\circ)$ 得 $3(\\cos 90^\\circ + i\\sin 90^\\circ)$，即 $3i$。检验：用 $3i$ 乘回除数，模为 $3 \\cdot 4 = 12$，辐角为 $90^\\circ + 60^\\circ = 150^\\circ$。\n\n> **注意。** 要用被除数的辐角减去除数的辐角，顺序不能反；模要相除，而不是相减。",
      ),
      generate(rng) {
        const r2 = rng.pick([2, 3, 4]);
        const k = rng.pick([2, 3, 4, 5]);
        const r1 = k * r2;
        const a1 = rng.pick([120, 135, 150, 180, 210, 240, 270, 300, 315, 330]);
        const a2 = rng.pick([15, 30, 45, 60, 75, 90]);
        const rQuot = k;
        const diffAngle = (a1 - a2 + 360) % 360;
        const polar = (r: number, angle: number) =>
          t(`$${r}(\\cos ${angle}^\\circ + i\\sin ${angle}^\\circ)$`, `$${r}(\\cos ${angle}^\\circ + i\\sin ${angle}^\\circ)$`);
        const prompt = t(
          `Divide $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ by $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$.`,
          `计算 $z_1 = ${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)$ 除以 $z_2 = ${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)$ 的商。`,
        );
        const right = polar(rQuot, diffAngle);
        const sumAngle = (a1 + a2) % 360;
        const added = polar(rQuot, sumAngle);
        const subtractedModuli = polar(r1 - r2, diffAngle);
        const doubled = polar(rQuot * 2, diffAngle);
        const solution = walked(
          [
            [
              ["Divide the moduli", "模相除"],
              t(`The modulus of the quotient is the quotient of the moduli:`, `商的模等于两个模之商：`),
              [`r = \\frac{${r1}}{${r2}} = ${rQuot}`],
            ],
            [
              ["Subtract the arguments", "辐角相减"],
              t(
                `The argument of the quotient is the argument of $z_1$ minus that of $z_2$, which here is already in $[0^\\circ, 360^\\circ)$:`,
                `商的辐角等于 $z_1$ 的辐角减去 $z_2$ 的辐角，这里已经在 $[0^\\circ, 360^\\circ)$ 内：`,
              ),
              [`\\theta = ${a1}^\\circ - ${a2}^\\circ = ${diffAngle}^\\circ`],
            ],
          ],
          t(
            `Multiply the quotient by $z_2$: the moduli give $${rQuot} \\times ${r2} = ${r1}$ and the arguments give $${diffAngle}^\\circ + ${a2}^\\circ = ${a1}^\\circ$, which is $z_1$.`,
            `用商乘以 $z_2$：模为 $${rQuot} \\times ${r2} = ${r1}$，辐角为 $${diffAngle}^\\circ + ${a2}^\\circ = ${a1}^\\circ$，正是 $z_1$。`,
          ),
        );
        return oneOf(rng, prompt, right, [added, subtractedModuli, doubled], solution, [
          why(
            added,
            "This adds the arguments, which is the rule for a product; for a quotient the argument of the divisor is subtracted.",
            "这里把辐角相加了，那是乘法的法则；除法时要减去除数的辐角。",
          ),
          why(
            subtractedModuli,
            `This subtracts the moduli; the modulus of a quotient is ${r1} ÷ ${r2} = ${rQuot}.`,
            `这里把模相减了；商的模是 ${r1} ÷ ${r2} = ${rQuot}。`,
          ),
          why(
            doubled,
            `This modulus is twice the quotient of the moduli; ${r1} ÷ ${r2} is ${rQuot}.`,
            `这个模是两模之商的两倍；${r1} ÷ ${r2} 等于 ${rQuot}。`,
          ),
        ]);
      },
    },
    {
      id: "polar-quotients-converted-to-rectangular",
      title: t("Evaluate polar quotients in rectangular form", "将极坐标商转换为代数形式"),
      explanation: t(
        "Dividing in polar form is quick, and evaluating the cosine and sine of the resulting angle turns the answer back into rectangular form. First calculate the quotient in polar form:\n\n$$\\frac{z_1}{z_2} = \\frac{r_1}{r_2}[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)]$$\n\nThen evaluate the cosine and sine values to obtain the standard rectangular form $a + bi$.\n\nFor example, $8(\\cos 75^\\circ + i\\sin 75^\\circ)$ divided by $2(\\cos 45^\\circ + i\\sin 45^\\circ)$ is $4(\\cos 30^\\circ + i\\sin 30^\\circ)$. With $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$ and $\\sin 30^\\circ = \\frac{1}{2}$ this is $2\\sqrt{3} + 2i$. Check: $(2\\sqrt{3})^2 + 2^2 = 16 = 4^2$.\n\n> **Watch out.** The angles $75^\\circ$ and $45^\\circ$ are not needed on their own. Subtract first and evaluate the cosine and sine only of the difference.",
        "用极坐标形式做除法很快，再求出所得角的余弦和正弦，就能把结果化回直角坐标形式。先用三角形式算出商：\n\n$$\\frac{z_1}{z_2} = \\frac{r_1}{r_2}[\\cos(\\theta_1 - \\theta_2) + i\\sin(\\theta_1 - \\theta_2)]$$\n\n再求出正弦和余弦的精确值，即可化为标准代数形式 $a + bi$。\n\n例如，$8(\\cos 75^\\circ + i\\sin 75^\\circ)$ 除以 $2(\\cos 45^\\circ + i\\sin 45^\\circ)$ 得 $4(\\cos 30^\\circ + i\\sin 30^\\circ)$。由 $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2}$，$\\sin 30^\\circ = \\frac{1}{2}$，它等于 $2\\sqrt{3} + 2i$。检验：$(2\\sqrt{3})^2 + 2^2 = 16 = 4^2$。\n\n> **注意。** 不需要单独求 $75^\\circ$ 和 $45^\\circ$ 的三角函数值。先相减，只求差角的余弦和正弦。",
      ),
      generate(rng) {
        const item = rng.pick([
          { r: 2, thetaDiff: 60, rect: "1 + \\sqrt{3}i", wrong: ["\\sqrt{3} + i", "1 - \\sqrt{3}i", "-1 + \\sqrt{3}i"] },
          { r: 2, thetaDiff: 30, rect: "\\sqrt{3} + i", wrong: ["1 + \\sqrt{3}i", "\\sqrt{3} - i", "-\\sqrt{3} + i"] },
          { r: 2, thetaDiff: 90, rect: "2i", wrong: ["-2i", "2", "-2"] },
          { r: 2, thetaDiff: 180, rect: "-2", wrong: ["2", "-2i", "2i"] },
          { r: 4, thetaDiff: 60, rect: "2 + 2\\sqrt{3}i", wrong: ["2\\sqrt{3} + 2i", "2 - 2\\sqrt{3}i", "-2 + 2\\sqrt{3}i"] },
          { r: 4, thetaDiff: 120, rect: "-2 + 2\\sqrt{3}i", wrong: ["2 + 2\\sqrt{3}i", "-2 - 2\\sqrt{3}i", "-2\\sqrt{3} + 2i"] },
          { r: 4, thetaDiff: 90, rect: "4i", wrong: ["-4i", "4", "-4"] },
        ]);
        const radians: Readonly<Record<number, string>> = {
          30: "\\frac{\\pi}{6}",
          60: "\\frac{\\pi}{3}",
          90: "\\frac{\\pi}{2}",
          120: "\\frac{2\\pi}{3}",
          180: "\\pi",
        };
        const theta = radians[item.thetaDiff]!;
        const place = specialAngles[theta]!;
        const a2 = rng.pick([15, 20, 25, 30, 45, 60]);
        const a1 = a2 + item.thetaDiff;
        const r2 = rng.pick([2, 3]);
        const r1 = item.r * r2;
        const prompt = t(
          `Evaluate the quotient $\\frac{${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)}{${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)}$ and express the answer in standard rectangular form $a + bi$.`,
          `计算商 $\\frac{${r1}(\\cos ${a1}^\\circ + i\\sin ${a1}^\\circ)}{${r2}(\\cos ${a2}^\\circ + i\\sin ${a2}^\\circ)}$ 并将结果表示为代数标准形式 $a + bi$。`,
        );
        const right = t(`$${item.rect}$`, `$${item.rect}$`);
        const wrong = item.wrong.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = walked(
          [
            [
              ["Divide in polar form", "用三角形式相除"],
              t(`Divide the moduli and subtract the arguments:`, `模相除，辐角相减：`),
              [`r = \\frac{${r1}}{${r2}} = ${item.r}, \\quad \\theta = ${a1}^\\circ - ${a2}^\\circ = ${item.thetaDiff}^\\circ`],
            ],
            [
              ["Evaluate", "求值"],
              t(
                `At $${item.thetaDiff}^\\circ$ the cosine is $${place.cos}$ and the sine is $${place.sin}$. Multiplying both by $${item.r}$ gives`,
                `在 $${item.thetaDiff}^\\circ$ 处余弦是 $${place.cos}$，正弦是 $${place.sin}$。都乘以 $${item.r}$，得到`,
              ),
              [`${item.r}(\\cos ${item.thetaDiff}^\\circ + i\\sin ${item.thetaDiff}^\\circ) = ${item.rect}`],
            ],
          ],
          t(
            `The squares of the parts of $${item.rect}$ add up to $${item.r * item.r}$, the square of the modulus $${item.r}$, and their signs match the direction of $${item.thetaDiff}^\\circ$.`,
            `$${item.rect}$ 两部分的平方和是 $${item.r * item.r}$，等于模 $${item.r}$ 的平方，而且它们的符号与 $${item.thetaDiff}^\\circ$ 的方向相符。`,
          ),
        );
        return oneOf(
          rng,
          prompt,
          right,
          wrong,
          solution,
          item.wrong.map((w, i) => {
            const [en, zh] = rectMiss(item.r, theta, w, true);
            return why(wrong[i]!, en, zh);
          }),
        );
      },
    },
  ],
};

// ─── Module 10.32.4: The CIS Notation ─────────────────────────────────────────

/** theCisNotation covers the compact cis(θ) = cos(θ) + i sin(θ) notation. */
export const theCisNotation: TopicDef = {
  id: "the-cis-notation",
  title: t("The CIS Notation", "复数的 cis 简记符号"),
  summary: t(
    "Use the compact cis notation cis(θ) = cos θ + i sin θ to write complex numbers r cis(θ) and perform products and quotients efficiently.",
    "使用紧凑记号 cis(θ) = cos θ + i sin θ 表示复数 r cis(θ)，并高效进行乘法与除法运算。",
  ),
  prerequisites: ["the-polar-form-of-a-complex-number"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.CN.B.4", "CCSS.HSN.CN.B.5"],
  intro: t(
    `In polar form a complex number is $r(\\cos\\theta + i\\sin\\theta)$, and the bracket $\\cos\\theta + i\\sin\\theta$ is written again and again. For example, $-3$ has modulus $3$ and argument $\\pi$, so it is $3(\\cos\\pi + i\\sin\\pi)$. Mathematicians shorten the bracket to $\\text{cis}\\,\\theta$, from the letters c, i and s of "cosine plus i sine", and write $-3 = 3\\,\\text{cis}\\,\\pi$.

Check: $\\cos\\pi = -1$ and $\\sin\\pi = 0$, so $3(\\cos\\pi + i\\sin\\pi) = 3(-1) = -3$.

In this lesson we evaluate numbers written in cis notation and multiply and divide them.`,
    `三角形式的复数是 $r(\\cos\\theta + i\\sin\\theta)$，括号 $\\cos\\theta + i\\sin\\theta$ 要一遍遍地写。例如，$-3$ 的模是 $3$，辐角是 $\\pi$，所以它等于 $3(\\cos\\pi + i\\sin\\pi)$。人们把这个括号简写为 $\\text{cis}\\,\\theta$，取自 "cosine plus i sine" 中的字母 c、i、s，于是 $-3 = 3\\,\\text{cis}\\,\\pi$。

检验：$\\cos\\pi = -1$，$\\sin\\pi = 0$，所以 $3(\\cos\\pi + i\\sin\\pi) = 3(-1) = -3$。

这节课我们求用 cis 记号写出的数的值，并对它们做乘法和除法。`,
  ),
  knowledgePoints: [
    {
      id: "cis-definition-and-evaluation",
      title: t("Definition and evaluation of cis notation", "cis 记号的定义与求值"),
      figure: remainingDrawings8["the-cis-notation#cis-definition-and-evaluation"],
      explanation: t(
        "The cis notation is only a shorthand that saves writing, and evaluating it means finding the cosine and sine of the angle. The notation **$\\text{cis}(\\theta)$** is an abbreviation for:\n\n$$\\text{cis}(\\theta) = \\cos\\theta + i\\sin\\theta$$\n\nThus, $r\\,\\text{cis}(\\theta) = r(\\cos\\theta + i\\sin\\theta)$.\n\nFor example:\n- $\\text{cis}(0) = 1$\n- $\\text{cis}\\left(\\frac{\\pi}{2}\\right) = i$\n- $\\text{cis}(\\pi) = -1$\n- $\\text{cis}\\left(\\frac{3\\pi}{2}\\right) = -i$\n\nAnd $4\\,\\text{cis}\\left(\\frac{\\pi}{3}\\right)$ is $4$ times $\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$, which is $2 + 2\\sqrt{3}i$. Check: $2^2 + (2\\sqrt{3})^2 = 4 + 12 = 16 = 4^2$.\n\n> **Watch out.** The number in front is the modulus and multiplies both parts. The cosine goes to the real part and the sine to the imaginary part, not the other way round.",
        "cis 记号只是一种节省书写的简写，求它的值就是求出角的余弦和正弦。简记符号 **$\\text{cis}(\\theta)$** 代表：\n\n$$\\text{cis}(\\theta) = \\cos\\theta + i\\sin\\theta$$\n\n因此，$r\\,\\text{cis}(\\theta) = r(\\cos\\theta + i\\sin\\theta)$。\n\n常见特殊值：\n- $\\text{cis}(0) = 1$\n- $\\text{cis}\\left(\\frac{\\pi}{2}\\right) = i$\n- $\\text{cis}(\\pi) = -1$\n- $\\text{cis}\\left(\\frac{3\\pi}{2}\\right) = -i$\n\n又如，$4\\,\\text{cis}\\left(\\frac{\\pi}{3}\\right)$ 是 $4$ 乘以 $\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$，即 $2 + 2\\sqrt{3}i$。检验：$2^2 + (2\\sqrt{3})^2 = 4 + 12 = 16 = 4^2$。\n\n> **注意。** 前面的数是模，要乘以两部分。余弦给实部，正弦给虚部，不能反过来。",
      ),
      generate(rng) {
        const items = getSpecialPolarItems();
        const item = rng.pick(items);
        const place = specialAngles[item.theta]!;
        const prompt = t(
          `Evaluate $z = ${item.r}\\,\\text{cis}\\left(${item.theta}\\right)$ in standard rectangular form $a + bi$.`,
          `计算 $z = ${item.r}\\,\\text{cis}\\left(${item.theta}\\right)$ 的标准代数形式 $a + bi$。`,
        );
        const right = t(`$${item.rect}$`, `$${item.rect}$`);
        const wrong = item.wrongRects.map((w) => t(`$${w}$`, `$${w}$`));
        const solution = walked(
          [
            [
              ["Expand the notation", "展开记号"],
              t(`By definition, cis stands for the cosine plus $i$ times the sine:`, `按定义，cis 表示余弦加 $i$ 乘正弦：`),
              [
                `${item.r}\\,\\text{cis}\\left(${item.theta}\\right) = ${item.r}\\left(\\cos\\left(${item.theta}\\right) + i\\sin\\left(${item.theta}\\right)\\right)`,
              ],
            ],
            [
              ["Evaluate", "求值"],
              t(
                `The cosine is $${place.cos}$ and the sine is $${place.sin}$. Multiplying both by $${item.r}$ gives`,
                `余弦是 $${place.cos}$，正弦是 $${place.sin}$。都乘以 $${item.r}$，得到`,
              ),
              [`z = ${item.rect}`],
            ],
          ],
          t(
            `The squares of the parts of $${item.rect}$ add up to $${item.r * item.r}$, the square of the modulus $${item.r}$, and their signs match the direction of $${item.theta}$.`,
            `$${item.rect}$ 两部分的平方和是 $${item.r * item.r}$，等于模 $${item.r}$ 的平方，而且它们的符号与 $${item.theta}$ 的方向相符。`,
          ),
        );
        return oneOf(
          rng,
          prompt,
          right,
          wrong,
          solution,
          item.wrongRects.map((w, i) => {
            const [en, zh] = rectMiss(item.r, item.theta, w);
            return why(wrong[i]!, en, zh);
          }),
        );
      },
    },
    {
      id: "products-and-quotients-in-cis-notation",
      title: t("Multiplication and division in cis notation", "cis 记号下的乘法与除法运算"),
      figure: remainingDrawings8["the-cis-notation#products-and-quotients-in-cis-notation"],
      explanation: t(
        "When multiplying, the moduli multiply and the angles add; when dividing, the moduli divide and the angles subtract. Using $\\text{cis}$ notation, the product and quotient rules are written compactly:\n\n- **Product**: $r_1\\,\\text{cis}(\\alpha) \\cdot r_2\\,\\text{cis}(\\beta) = (r_1 r_2)\\,\\text{cis}(\\alpha + \\beta)$\n- **Quotient**: $\\frac{r_1\\,\\text{cis}(\\alpha)}{r_2\\,\\text{cis}(\\beta)} = \\left(\\frac{r_1}{r_2}\\right)\\,\\text{cis}(\\alpha - \\beta)$\n\nFor example, $5\\,\\text{cis}(70^\\circ)$ times $2\\,\\text{cis}(20^\\circ)$ is $10\\,\\text{cis}(90^\\circ)$, which is $10i$. Check: $10i$ divided by $2\\,\\text{cis}(20^\\circ)$ gives back $5\\,\\text{cis}(70^\\circ)$, since $10 \\div 2 = 5$ and $90^\\circ - 20^\\circ = 70^\\circ$.\n\n> **Watch out.** The rules act on the modulus and the angle separately: the moduli never add, and the angles never multiply.",
        "相乘时模相乘、角相加；相除时模相除、角相减。使用 $\\text{cis}$ 记号，复数的乘法和除法法则表示更为简洁：\n\n- **乘积**：$r_1\\,\\text{cis}(\\alpha) \\cdot r_2\\,\\text{cis}(\\beta) = (r_1 r_2)\\,\\text{cis}(\\alpha + \\beta)$\n- **商**：$\\frac{r_1\\,\\text{cis}(\\alpha)}{r_2\\,\\text{cis}(\\beta)} = \\left(\\frac{r_1}{r_2}\\right)\\,\\text{cis}(\\alpha - \\beta)$\n\n例如，$5\\,\\text{cis}(70^\\circ)$ 乘 $2\\,\\text{cis}(20^\\circ)$ 得 $10\\,\\text{cis}(90^\\circ)$，即 $10i$。检验：$10i$ 除以 $2\\,\\text{cis}(20^\\circ)$ 得回 $5\\,\\text{cis}(70^\\circ)$，因为 $10 \\div 2 = 5$，$90^\\circ - 20^\\circ = 70^\\circ$。\n\n> **注意。** 法则分别作用于模和角：模从不相加，角从不相乘。",
      ),
      generate(rng) {
        const isProduct = rng.bool();
        const cis = (r: number, angle: number) => t(`$${r}\\,\\text{cis}(${angle}^\\circ)$`, `$${r}\\,\\text{cis}(${angle}^\\circ)$`);
        if (isProduct) {
          const r1 = rng.pick([2, 3, 4, 5]);
          const r2 = rng.pick([2, 3, 4, 5]);
          const a1 = rng.pick([15, 25, 35, 45, 55, 65, 75, 85, 105]);
          const a2 = rng.pick([15, 20, 30, 40, 50, 60, 70, 80]);
          const prodR = r1 * r2;
          const sumA = (a1 + a2) % 360;
          const prompt = t(
            `Simplify $\\left(${r1}\\,\\text{cis}(${a1}^\\circ)\\right) \\cdot \\left(${r2}\\,\\text{cis}(${a2}^\\circ)\\right)$.`,
            `化简 $\\left(${r1}\\,\\text{cis}(${a1}^\\circ)\\right) \\cdot \\left(${r2}\\,\\text{cis}(${a2}^\\circ)\\right)$。`,
          );
          const right = cis(prodR, sumA);
          const diffA = Math.abs(a1 - a2);
          const subtracted = cis(prodR, diffA);
          const addedModuli = cis(r1 + r2, sumA);
          const multiplied = cis(prodR, (a1 * a2) % 360);
          const solution = walked(
            [
              [
                ["Multiply the moduli", "模相乘"],
                t(`The modulus of a product is the product of the moduli:`, `积的模等于模之积：`),
                [`${r1} \\times ${r2} = ${prodR}`],
              ],
              [
                ["Add the angles", "角相加"],
                t(`The angle of a product is the sum of the angles:`, `积的角等于角之和：`),
                [`${a1}^\\circ + ${a2}^\\circ = ${sumA}^\\circ`],
              ],
            ],
            t(
              `Divide the result by $${r2}\\,\\text{cis}(${a2}^\\circ)$: $${prodR} \\div ${r2} = ${r1}$ and $${sumA}^\\circ - ${a2}^\\circ = ${a1}^\\circ$ give back the first factor.`,
              `用结果除以 $${r2}\\,\\text{cis}(${a2}^\\circ)$：$${prodR} \\div ${r2} = ${r1}$，$${sumA}^\\circ - ${a2}^\\circ = ${a1}^\\circ$，得回第一个因数。`,
            ),
          );
          return oneOf(rng, prompt, right, [subtracted, addedModuli, multiplied], solution, [
            why(
              subtracted,
              "This subtracts the angles, which is the rule for a quotient; for a product the angles add.",
              "这里把角相减了，那是除法的法则；乘法时角相加。",
            ),
            why(
              addedModuli,
              `This adds the moduli; the modulus of a product is ${r1} × ${r2} = ${prodR}.`,
              `这里把模相加了；积的模是 ${r1} × ${r2} = ${prodR}。`,
            ),
            why(
              multiplied,
              "This multiplies the angles; for a product the angles add, while only the moduli multiply.",
              "这里把角相乘了；乘法时角相加，相乘的只有模。",
            ),
          ]);
        }
        const r2 = rng.pick([2, 3, 4]);
        const k = rng.pick([2, 3, 4, 5]);
        const r1 = k * r2;
        const a1 = rng.pick([100, 115, 130, 145, 160, 180, 210, 240]);
        const a2 = rng.pick([15, 25, 35, 45, 55, 65, 75]);
        const quotR = k;
        const diffA = (a1 - a2 + 360) % 360;
        const prompt = t(
          `Simplify $\\frac{${r1}\\,\\text{cis}(${a1}^\\circ)}{${r2}\\,\\text{cis}(${a2}^\\circ)}$.`,
          `化简 $\\frac{${r1}\\,\\text{cis}(${a1}^\\circ)}{${r2}\\,\\text{cis}(${a2}^\\circ)}$。`,
        );
        const right = cis(quotR, diffA);
        const sumA = (a1 + a2) % 360;
        const added = cis(quotR, sumA);
        const subtractedModuli = cis(r1 - r2, diffA);
        const doubled = cis(quotR * 2, diffA);
        const solution = walked(
          [
            [
              ["Divide the moduli", "模相除"],
              t(`The modulus of a quotient is the quotient of the moduli:`, `商的模等于模之商：`),
              [`\\frac{${r1}}{${r2}} = ${quotR}`],
            ],
            [
              ["Subtract the angles", "角相减"],
              t(
                `The angle of a quotient is the angle of the dividend minus the angle of the divisor:`,
                `商的角等于被除数的角减去除数的角：`,
              ),
              [`${a1}^\\circ - ${a2}^\\circ = ${diffA}^\\circ`],
            ],
          ],
          t(
            `Multiply the result by $${r2}\\,\\text{cis}(${a2}^\\circ)$: $${quotR} \\times ${r2} = ${r1}$ and $${diffA}^\\circ + ${a2}^\\circ = ${a1}^\\circ$ give back the dividend.`,
            `用结果乘以 $${r2}\\,\\text{cis}(${a2}^\\circ)$：$${quotR} \\times ${r2} = ${r1}$，$${diffA}^\\circ + ${a2}^\\circ = ${a1}^\\circ$，得回被除数。`,
          ),
        );
        return oneOf(rng, prompt, right, [added, subtractedModuli, doubled], solution, [
          why(
            added,
            "This adds the angles, which is the rule for a product; for a quotient the angle of the divisor is subtracted.",
            "这里把角相加了，那是乘法的法则；除法时要减去除数的角。",
          ),
          why(
            subtractedModuli,
            `This subtracts the moduli; the modulus of a quotient is ${r1} ÷ ${r2} = ${quotR}.`,
            `这里把模相减了；商的模是 ${r1} ÷ ${r2} = ${quotR}。`,
          ),
          why(
            doubled,
            `This modulus is twice the quotient of the moduli; ${r1} ÷ ${r2} is ${quotR}.`,
            `这个模是两模之商的两倍；${r1} ÷ ${r2} 等于 ${quotR}。`,
          ),
        ]);
      },
    },
  ],
};

// ─── Module Export ────────────────────────────────────────────────────────────

/** precalculusComplexNumberTopics contains all 15 topics for Precalculus Unit 10 Part 1. */
export const precalculusComplexNumberTopics: readonly TopicDef[] = [
  theComplexPlane,
  theMagnitudeOfAComplexNumber,
  theArgumentOfAComplexNumber,
  arithmeticInTheComplexPlane,
  geometryInTheComplexPlane,
  theComplexConjugate,
  specialPropertiesOfTheComplexConjugate,
  theComplexConjugateAndTheRootsOfAQuadraticEquation,
  dividingComplexNumbers,
  solvingEquationsByEquatingRealAndImaginaryParts,
  extendingPolynomialIdentitiesToTheComplexNumbers,
  thePolarFormOfAComplexNumber,
  productsOfComplexNumbersExpressedInPolarForm,
  quotientsOfComplexNumbersExpressedInPolarForm,
  theCisNotation,
];
