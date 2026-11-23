// Knowledge points of Calculus II that ask the learner to read a drawing: regions, solids, polar curves and plots of
// partial sums. See `deeperFiguresCalculusIiPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd, Q, svgDocument } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { explainedChoice, numberProblem } from "../problems.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { drawn, label } from "./figure-reading-more.ts";

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** dots draws a list of values as points above the positions 1, 2, 3 and so on. */
const dots = (values: readonly number[]): PlaneMark[] => values.map((v, i): PlaneMark => ({ kind: "point", at: [i + 1, v], accent: true }));

/** linear writes a linear expression in a variable, leaving out zero terms and unit coefficients. */
function linear(m: number, n: number, v: string): string {
  const slope = m === 0 ? "" : m === 1 ? v : m === -1 ? `-${v}` : `${m}${v}`;
  if (slope === "") return String(n);
  return n === 0 ? slope : `${slope} ${n < 0 ? "-" : "+"} ${Math.abs(n)}`;
}

/** piTimes writes a multiple of pi in lowest terms. */
function piTimes(num: number, den: number): string {
  if (num === 0) return "0";
  const g = gcd(Math.abs(num), den);
  const [a, b] = [Math.abs(num) / g, den / g];
  const sign = num < 0 ? "-" : "";
  const top = a === 1 ? "\\pi" : `${a}\\pi`;
  return b === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${b}}`;
}

const areaInY = point(
  "setting-up-a-drawn-area-in-y",
  ["Setting up a drawn area in y", "按 y 建立图中面积的积分"],
  [
    "When a region is bounded on the left and right by curves, slice it into horizontal strips. Each strip has width equal to the right curve minus the left curve, at that height. The limits are the heights where the two curves meet, read on the vertical axis, and the integral is taken with respect to $y$. For example, $x = y^{2}$ and $x = y + 2$ meet at heights $y = -1$ and $y = 2$, and the line is on the right between them, so the area is $\\int_{-1}^{2} \\left[(y + 2) - y^{2}\\right] dy = \\frac{9}{2}$.\n\nCheck: at the middle height $y = \\frac{1}{2}$ the line gives $x = \\frac{5}{2}$ and the parabola $x = \\frac{1}{4}$, so right minus left is positive there, as a width must be.\n\n> **Watch out.** The limits are heights, read on the $y$-axis; the $x$-values of the crossing points belong to a different integral.",
    "当区域的左右边界是曲线时，把它切成水平窄条。每个窄条的宽度等于该高度处右边曲线减左边曲线。积分限是两条曲线相交的高度，在纵轴上读出，并对 $y$ 积分。例如，$x = y^{2}$ 与 $x = y + 2$ 在高度 $y = -1$ 和 $y = 2$ 处相交，在这之间直线在右边，所以面积为 $\\int_{-1}^{2} \\left[(y + 2) - y^{2}\\right] dy = \\frac{9}{2}$。\n\n检验：在中间高度 $y = \\frac{1}{2}$ 处，直线给出 $x = \\frac{5}{2}$，抛物线给出 $x = \\frac{1}{4}$，右减左为正，正如宽度应有的那样。\n\n> **注意。** 积分限是高度，要在 $y$ 轴上读；交点的 $x$ 值属于另一个积分。",
  ],
  (rng) => {
    const [y1, y2] = rng.pick<Point>([
      [-1, 1],
      [-1, 2],
      [-2, 1],
      [-2, 2],
      [0, 2],
      [-2, 0],
    ]);
    const c = rng.int(-1, 2);
    const flip = rng.bool();
    const s = flip ? -1 : 1;
    const curved = (y: number) => s * y * y + c;
    const straight = (y: number) => s * ((y1 + y2) * y - y1 * y2) + c;
    const curveTex = `${flip ? "-" : ""}y^2${c === 0 ? "" : c < 0 ? ` - ${-c}` : ` + ${c}`}`;
    const lineTex = linear(s * (y1 + y2), -s * y1 * y2 + c, "y");
    const [right, left] = flip ? [curveTex, lineTex] : [lineTex, curveTex];
    const plain = (x: string) => x.replace("y^2", "y²").replace("-", "−");
    const form = (lo: number, hi: number, a: string, b: string, d: string) =>
      t(...same(`\\int_{${lo}}^{${hi}} \\left[ (${a}) - (${b}) \\right] d${d}`));
    const [x1, x2] = [Math.min(curved(y1), curved(y2)), Math.max(curved(y1), curved(y2))];
    const samples = Array.from({ length: 33 }, (_, i) => y1 + ((y2 - y1) * i) / 32);
    const polygon = [...samples.map((y): Point => [curved(y), y]), ...[...samples].reverse().map((y): Point => [straight(y), y])];
    const extended = Array.from({ length: 41 }, (_, i) => -4.2 + (8.4 * i) / 40).filter((y) => Math.abs(curved(y)) < 9);
    const view: PlaneView = flip ? { xMin: -8, xMax: 4, yMin: -6, yMax: 6 } : { xMin: -4, xMax: 8, yMin: -6, yMax: 6 };
    const mid = Q.of(y1 + y2, 2);
    const curvedAt = Q.of(s).mul(mid).mul(mid).add(Q.of(c));
    const straightAt = Q.of(s)
      .mul(
        Q.of(y1 + y2)
          .mul(mid)
          .sub(Q.of(y1 * y2)),
      )
      .add(Q.of(c));
    const [R, L] = flip ? [curvedAt, straightAt] : [straightAt, curvedAt];
    const inP = (q: Q) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());
    const [xLo, xHi] = x1 === x2 ? [Math.min(x1, c), Math.max(x1, c)] : [x1, x2];
    return explainedChoice(rng, {
      prompt: t(
        "Which integral gives the area of the shaded region, whose bounding curves are labeled?",
        "哪个积分给出阴影区域的面积？边界曲线已在图中标出。",
      ),
      correct: form(y1, y2, right, left, "y"),
      wrong: [
        {
          option: form(y1, y2, left, right, "y"),
          why: t(
            `This subtracts the right curve from the left one; between the crossings $x = ${right}$ is on the right, so this integral is negative.`,
            `这是左边曲线减右边曲线；在两交点之间 $x = ${right}$ 在右边，所以这个积分是负的。`,
          ),
        },
        {
          option: form(xLo, xHi, right, left, "x"),
          why: t(
            `This takes its limits from the $x$-values of the drawing and integrates in $x$, but the strips are horizontal: the limits are the heights $${y1}$ and $${y2}$.`,
            `这里的积分限取自图中的 $x$ 值，并对 $x$ 积分；但窄条是水平的，积分限应是高度 $${y1}$ 和 $${y2}$。`,
          ),
        },
        {
          option: form(0, y2 - y1, right, left, "y"),
          why: t(
            `This runs from $0$ to the height of the region, $${y2 - y1}$; the limits are the heights $${y1}$ and $${y2}$ where the curves meet.`,
            `这是从 $0$ 积到区域的高 $${y2 - y1}$；积分限应是两曲线相交的高度 $${y1}$ 和 $${y2}$。`,
          ),
        },
        {
          option: form(y1, y2 + 1, right, left, "y"),
          why: t(
            `This runs past the upper crossing to $y = ${y2 + 1}$; the region ends at $y = ${y2}$, and above it the curves change sides.`,
            `这里越过上方交点积到 $y = ${y2 + 1}$；区域在 $y = ${y2}$ 处结束，在它上方两曲线交换了左右位置。`,
          ),
        },
      ],
      solution: t(
        `**Step 1: Read the limits.** The marked crossings are at heights $y = ${y1}$ and $y = ${y2}$, read on the vertical axis, so these are the limits and the integral is in $y$.\n\n**Step 2: Subtract left from right.** Between the crossings the strips run from $x = ${left}$ on the left to $x = ${right}$ on the right, so each width is $(${right}) - (${left})$.\n\n**Check.** Test the middle height $y = ${mid.toLatex()}$: the right curve gives $x = ${R.toLatex()}$ and the left curve gives $x = ${L.toLatex()}$, and $${R.toLatex()} - ${inP(L)} = ${R.sub(L).toLatex()} > 0$, so the width is positive, as it must be.`,
        `**第一步：读积分限。**标出的交点在高度 $y = ${y1}$ 和 $y = ${y2}$ 处，在纵轴上读出，所以这就是积分限，并对 $y$ 积分。\n\n**第二步：右减左。**在两交点之间，窄条从左边的 $x = ${left}$ 延伸到右边的 $x = ${right}$，所以每个宽度是 $(${right}) - (${left})$。\n\n**检验。**取中间高度 $y = ${mid.toLatex()}$：右边曲线给出 $x = ${R.toLatex()}$，左边曲线给出 $x = ${L.toLatex()}$，而 $${R.toLatex()} - ${inP(L)} = ${R.sub(L).toLatex()} > 0$，宽度为正，正如应有的那样。`,
      ),
      figure: fig(
        view,
        [
          { kind: "polygon", points: polygon },
          { kind: "path", points: extended.map((y): Point => [curved(y), y]), accent: true },
          { kind: "line", a: [straight(y1), y1], b: [straight(y2), y2] },
          { kind: "label", at: [flip ? -6 : 6, 5.2], text: `x = ${plain(curveTex)}`, dir: "w" },
          { kind: "label", at: [flip ? -6 : 6, -5.2], text: `x = ${plain(lineTex)}`, dir: "w" },
          { kind: "point", at: [curved(y1), y1] },
          { kind: "point", at: [curved(y2), y2] },
        ],
        [
          `A region between x = ${plain(curveTex)} and x = ${plain(lineTex)}, for y from ${y1} to ${y2}.`,
          `x = ${plain(curveTex)} 与 x = ${plain(lineTex)} 之间的区域，y 从 ${y1} 到 ${y2}。`,
        ],
      ),
    });
  },
);

const splitArea = point(
  "splitting-an-area-where-curves-cross",
  ["Splitting an area where curves cross", "在曲线相交处分割面积"],
  [
    "When two curves cross inside an interval, the upper curve changes at the crossing. A single integral of the difference would let areas above and below cancel. So split the interval at each crossing and subtract in the order that the drawing shows on each piece, keeping every piece positive. For example, $f(x) = x^{3} - x$ and $g(x) = 0$ cross at $x = -1, 0, 1$; $f$ is on top on $[-1, 0]$ and $g$ on $[0, 1]$, so the area is $\\int_{-1}^{0} (x^{3} - x) \\, dx + \\int_{0}^{1} (x - x^{3}) \\, dx = \\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}$.\n\nCheck: $f$ is odd, so the two pieces are mirror images with equal areas, and the total is $2 \\cdot \\frac{1}{4} = \\frac{1}{2}$.\n\n> **Watch out.** $\\int_{-1}^{1} (x^{3} - x) \\, dx = 0$: one integral across a crossing lets the pieces cancel, even though the region has area $\\frac{1}{2}$.",
    "两条曲线在区间内相交时，上方曲线在交点处改变。对差只做一个积分会让上下面积互相抵消。所以要在每个交点分割区间，在每一段上按图中所见的上下关系相减，使每一段都为正。例如，$f(x) = x^{3} - x$ 与 $g(x) = 0$ 在 $x = -1, 0, 1$ 处相交；在 $[-1, 0]$ 上 $f$ 在上，在 $[0, 1]$ 上 $g$ 在上，所以面积为 $\\int_{-1}^{0} (x^{3} - x) \\, dx + \\int_{0}^{1} (x - x^{3}) \\, dx = \\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}$。\n\n检验：$f$ 是奇函数，两部分互为镜像、面积相等，总面积为 $2 \\cdot \\frac{1}{4} = \\frac{1}{2}$。\n\n> **注意。** $\\int_{-1}^{1} (x^{3} - x) \\, dx = 0$：跨过交点只做一个积分会让各部分相互抵消，尽管区域的面积是 $\\frac{1}{2}$。",
  ],
  (rng) => {
    const c = rng.int(-2, 2);
    const k = rng.int(1, 3);
    const flip = rng.bool();
    const d = rng.int(-1, 1);
    const size = 3 / (0.385 * k ** 3);
    const s = flip ? -1 : 1;
    const f = (x: number) => d + s * size * (x - c) * ((x - c) ** 2 - k * k);
    const piece = (lo: number, hi: number, up: string, down: string) => `\\int_{${lo}}^{${hi}} (${up} - ${down})\\,dx`;
    const [firstUp, firstDown] = flip ? ["g", "f"] : ["f", "g"];
    const form = (up: string, down: string, again: boolean) =>
      t(
        ...same(
          `${piece(c - k, c, `${up}(x)`, `${down}(x)`)} + ${again ? piece(c, c + k, `${up}(x)`, `${down}(x)`) : piece(c, c + k, `${down}(x)`, `${up}(x)`)}`,
        ),
      );
    const samples = Array.from({ length: 65 }, (_, i) => c - k + (2 * k * i) / 64);
    const left = piece(c - k, c, `${firstUp}(x)`, `${firstDown}(x)`);
    return explainedChoice(rng, {
      prompt: t(
        "Which expression gives the total area of the shaded regions between the labeled curves $f$ and $g$?",
        "哪个式子给出标有 $f$ 和 $g$ 的两条曲线之间阴影区域的总面积？",
      ),
      correct: form(firstUp, firstDown, false),
      wrong: [
        {
          option: form(firstDown, firstUp, false),
          why: t(
            `This subtracts in the wrong order on both pieces: on $[${c - k}, ${c}]$ the curve $${firstUp}$ is on top, so both pieces come out negative.`,
            `这在两段上都减反了：在 $[${c - k}, ${c}]$ 上 $${firstUp}$ 在上，所以两段都是负的。`,
          ),
        },
        {
          option: form(firstUp, firstDown, true),
          why: t(
            `This keeps the left piece's order on the right piece, but on $[${c}, ${c + k}]$ the curve $${firstDown}$ is on top, so the right piece is negative and cancels the left one.`,
            `这在右段沿用了左段的顺序，但在 $[${c}, ${c + k}]$ 上 $${firstDown}$ 在上，所以右段是负的，与左段相互抵消。`,
          ),
        },
        {
          option: t(...same(`\\int_{${c - k}}^{${c + k}} (f(x) - g(x))\\,dx`)),
          why: t(
            `One integral across the crossing at $x = ${c}$ lets the piece above and the piece below cancel; here they are equal, so it gives $0$.`,
            `跨过 $x = ${c}$ 处的交点只做一个积分，会让上方和下方的部分相互抵消；这里两部分相等，结果是 $0$。`,
          ),
        },
        {
          option: form(firstDown, firstUp, true),
          why: t(
            `This uses the right piece's order on both pieces; on $[${c - k}, ${c}]$ the curve $${firstUp}$ is on top, so the left piece is negative and cancels the right one.`,
            `这在两段上都用了右段的顺序；在 $[${c - k}, ${c}]$ 上 $${firstUp}$ 在上，所以左段是负的，与右段相互抵消。`,
          ),
        },
      ],
      solution: t(
        `**Step 1: Find the crossings.** The curves meet at $x = ${c - k}$, $x = ${c}$ and $x = ${c + k}$, so the shaded region has two pieces, $[${c - k}, ${c}]$ and $[${c}, ${c + k}]$.\n\n**Step 2: Subtract on each piece.** On the left piece $${firstUp}$ is on top and on the right piece $${firstDown}$ is on top, so each piece subtracts the lower curve from the upper one and both are positive.\n\n**Check.** The drawing is symmetric about the middle crossing: the right piece is the left piece turned half a turn about $(${c}, ${d})$. So the two pieces have equal areas, and the total is $2${left}$, which agrees with the sum.`,
        `**第一步：找交点。**两曲线在 $x = ${c - k}$、$x = ${c}$ 和 $x = ${c + k}$ 处相交，所以阴影区域分成 $[${c - k}, ${c}]$ 和 $[${c}, ${c + k}]$ 两部分。\n\n**第二步：在每段上相减。**左段 $${firstUp}$ 在上，右段 $${firstDown}$ 在上，所以每段都用上方曲线减下方曲线，两段都为正。\n\n**检验。**图关于中间的交点对称：右段是左段绕 $(${c}, ${d})$ 转半圈得到的。所以两段面积相等，总面积为 $2${left}$，与两段之和一致。`,
      ),
      figure: fig(
        { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
        [
          { kind: "polygon", points: [...samples.map((x): Point => [x, f(x)]), [c + k, d], [c - k, d]] },
          { kind: "curve", f, from: c - k - 0.7, to: c + k + 0.7, accent: true },
          { kind: "segment", a: [-6, d], b: [6, d] },
          {
            kind: "label",
            at: [c + k + 0.7, f(c + k + 0.7) > d ? Math.min(f(c + k + 0.7), 5.4) : Math.max(f(c + k + 0.7), -5.4)],
            text: "f",
            dir: "e",
          },
          { kind: "label", at: [5.4, d], text: "g", dir: "n" },
        ],
        [
          `A curve f meeting the horizontal line g at x = ${c - k}, ${c} and ${c + k}, with a ${flip ? "trough" : "peak"} on the left piece and a ${flip ? "peak" : "trough"} on the right piece.`,
          `曲线 f 与水平线 g 在 x = ${c - k}、${c} 和 ${c + k} 处相遇，左段有一个${flip ? "谷" : "峰"}，右段有一个${flip ? "峰" : "谷"}。`,
        ],
      ),
    });
  },
);

const discIntegral = {
  ...point(
    "the-disc-integral-of-a-drawn-region",
    ["The disc integral of a drawn region", "图中区域的圆盘积分"],
    [
      "Rotating a region under a graph about the $x$-axis makes a solid whose slices are discs. A slice at position $x$ has radius equal to the height of the graph there, so its area is $\\pi$ times the height squared. Adding the slices between the ends of the region gives the volume:\n\n$$V = \\pi\\int_{a}^{b} f(x)^{2} \\, dx$$\n\nFor example, the region under $f(x) = x$ from $x = 0$ to $x = 2$ gives $V = \\pi\\int_{0}^{2} x^{2} \\, dx = \\frac{8}{3}\\pi$.\n\nCheck: that solid is a cone of radius $2$ and height $2$, and\n\n$$\\frac{1}{3}\\pi \\cdot 2^{2} \\cdot 2 = \\frac{8}{3}\\pi$$\n\n> **Watch out.** Square the height. The integral $\\pi\\int f(x) \\, dx$ adds up radii, not the areas of discs.",
      "把图象下方的区域绕 $x$ 轴旋转，得到的立体的截面是圆盘。位置 $x$ 处截面的半径等于图象在该处的高度，所以面积是 $\\pi$ 乘以高度的平方。把区域两端之间的截面加起来就得到体积：\n\n$$V = \\pi\\int_{a}^{b} f(x)^{2} \\, dx$$\n\n例如，$f(x) = x$ 下方从 $x = 0$ 到 $x = 2$ 的区域给出 $V = \\pi\\int_{0}^{2} x^{2} \\, dx = \\frac{8}{3}\\pi$。\n\n检验：这个立体是半径为 $2$、高为 $2$ 的圆锥，\n\n$$\\frac{1}{3}\\pi \\cdot 2^{2} \\cdot 2 = \\frac{8}{3}\\pi$$\n\n> **注意。** 高度要平方。积分 $\\pi\\int f(x) \\, dx$ 加起来的是半径，不是圆盘的面积。",
    ],
    (rng) => {
      const p = rng.int(0, 3);
      const q = p + rng.int(1, 4);
      const shape = rng.pick<(x: number) => number>([
        (x) => 1 + 0.5 * x,
        (x) => 0.2 * x * x + 1,
        (x) => 4 - 0.4 * x,
        (x) => 2 + Math.sin(x),
      ]);
      const samples = Array.from({ length: 33 }, (_, i) => p + ((q - p) * i) / 32);
      const limits = `\\int_{${p}}^{${q}}`;
      const cylinder = q - p === 1 ? "\\pi c^{2}" : `\\pi c^{2} \\cdot ${q - p}`;
      const option = (latex: string) => t(`$${latex}$`, `$${latex}$`);
      return explainedChoice(rng, {
        prompt: t(
          "The shaded region under the graph of $f$ is rotated about the $x$-axis. Which integral gives the volume of the solid?",
          "$f$ 图象下方的阴影区域绕 $x$ 轴旋转。哪个积分给出立体的体积？",
        ),
        correct: option(`\\pi ${limits} f(x)^2\\,dx`),
        wrong: [
          {
            option: option(`\\pi ${limits} f(x)\\,dx`),
            why: t(
              "This adds up $\\pi$ times the radius. A disc of radius $f(x)$ has area $\\pi f(x)^{2}$, so the radius must be squared.",
              "这是把 $\\pi$ 乘半径加起来。半径为 $f(x)$ 的圆盘面积是 $\\pi f(x)^{2}$，半径要平方。",
            ),
          },
          {
            option: option(`2\\pi ${limits} x f(x)\\,dx`),
            why: t(
              "This is the shell integral for rotation about the $y$-axis. About the $x$-axis the slices are discs.",
              "这是绕 $y$ 轴旋转的柱壳积分。绕 $x$ 轴旋转时截面是圆盘。",
            ),
          },
          {
            option: option(`\\pi \\int_{0}^{${q}} f(x)^2\\,dx`),
            why: t(
              `This starts at $x = 0$, but the shaded region starts at $x = ${p}$.`,
              `这是从 $x = 0$ 开始，但阴影区域从 $x = ${p}$ 开始。`,
            ),
          },
          {
            option: option(`${limits} f(x)^2\\,dx`),
            why: t(
              "This leaves out $\\pi$. It adds up squares of side $f(x)$, but the slices are discs of radius $f(x)$.",
              "这里少了 $\\pi$。它加起来的是边长为 $f(x)$ 的正方形，而截面是半径为 $f(x)$ 的圆盘。",
            ),
          },
        ],
        solution: t(
          `**Step 1: Read the limits.** The shaded region runs from $x = ${p}$ to $x = ${q}$, so these are the limits.\n\n**Step 2: Write the disc.** A slice at $x$ is a disc of radius $f(x)$, with area $\\pi f(x)^{2}$. Adding the slices gives $\\pi ${limits} f(x)^2\\,dx$.\n\n**Check.** If $f$ were a constant $c$, the integral would give $${cylinder}$, the volume of a cylinder of radius $c$ and length $${q - p}$, as it should.`,
          `**第一步：读积分限。**阴影区域从 $x = ${p}$ 到 $x = ${q}$，这就是积分限。\n\n**第二步：写出圆盘。**$x$ 处的截面是半径为 $f(x)$ 的圆盘，面积为 $\\pi f(x)^{2}$。把截面加起来得 $\\pi ${limits} f(x)^2\\,dx$。\n\n**检验。**若 $f$ 是常数 $c$，积分给出 $${cylinder}$，正是半径为 $c$、长为 $${q - p}$ 的圆柱的体积，理应如此。`,
        ),
        figure: fig(
          { xMin: -1, xMax: 8, yMin: -1, yMax: 8 },
          [
            { kind: "polygon", points: [[p, 0], ...samples.map((x): Point => [x, shape(x)]), [q, 0]] },
            { kind: "curve", f: shape, from: -0.5, to: 7.5, accent: true },
            { kind: "label", at: [7, Math.min(shape(7), 7)], text: "f", dir: "n" },
          ],
          [`The region under the graph of f from x = ${p} to x = ${q}.`, `f 图象下方从 x = ${p} 到 x = ${q} 的区域。`],
        ),
      });
    },
  ),
  figure:
    calculusDrawings4["volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes#the-disc-integral-of-a-drawn-region"],
};

const shellVolume = {
  ...point(
    "shells-of-a-drawn-rectangle",
    ["Shells of a drawn rectangle", "图中矩形的柱壳"],
    [
      "Rotating about the $y$-axis turns each vertical strip of a region into a thin cylindrical shell. A strip at $x$ has radius $x$ and height equal to the strip length, so the volume is the integral of $2\\pi x$ times height over the $x$-values of the region:\n\n$$V = 2\\pi\\int_{a}^{b} x\\,h(x) \\, dx$$\n\nFor example, a rectangle from $x = 1$ to $x = 2$ with height $3$ gives $V = 2\\pi\\int_{1}^{2} 3x \\, dx = 3\\pi(4 - 1) = 9\\pi$.\n\nCheck: the solid is a hollow cylinder of outer radius $2$, inner radius $1$ and height $3$, so $V = \\pi\\left(2^{2} - 1^{2}\\right) \\cdot 3 = 9\\pi$.\n\n> **Watch out.** The radius grows across the region, so the position matters. Squaring the width instead, $\\pi(2 - 1)^{2} \\cdot 3 = 3\\pi$, is wrong.",
      "绕 $y$ 轴旋转时，区域的每个竖直窄条变成薄圆柱壳。$x$ 处的窄条半径为 $x$，高度等于窄条长度，所以体积是 $2\\pi x$ 乘以高度在区域的 $x$ 范围上的积分：\n\n$$V = 2\\pi\\int_{a}^{b} x\\,h(x) \\, dx$$\n\n例如，从 $x = 1$ 到 $x = 2$、高为 $3$ 的矩形给出 $V = 2\\pi\\int_{1}^{2} 3x \\, dx = 3\\pi(4 - 1) = 9\\pi$。\n\n检验：这个立体是外半径 $2$、内半径 $1$、高 $3$ 的空心圆柱，$V = \\pi\\left(2^{2} - 1^{2}\\right) \\cdot 3 = 9\\pi$。\n\n> **注意。** 半径随位置增大，所以位置很重要。把宽度平方，$\\pi(2 - 1)^{2} \\cdot 3 = 3\\pi$，是错的。",
    ],
    (rng) => {
      const p = rng.int(1, 3);
      const q = p + rng.int(1, 3);
      const lo = rng.int(0, 2);
      const h = rng.int(1, 4);
      const k = h * (q * q - p * p);
      const hh = h === 1 ? "" : `${h}`;
      const all = [
        {
          value: h * (q - p) * (q - p),
          why: t(
            `This squares the width $${q - p}$. The solid is a hollow cylinder, so use $${q}^{2} - ${p}^{2}$, not $(${q} - ${p})^{2}$.`,
            `这是把宽度 $${q - p}$ 平方了。立体是空心圆柱，要用 $${q}^{2} - ${p}^{2}$，不是 $(${q} - ${p})^{2}$。`,
          ),
        },
        {
          value: h * q * q,
          why: t(
            `This fills in the hole. The rectangle starts at $x = ${p}$, so the solid has a hole of radius $${p}$.`,
            `这里把孔也填上了。矩形从 $x = ${p}$ 开始，所以立体中间有半径为 $${p}$ 的孔。`,
          ),
        },
        {
          value: 2 * k,
          why: t(
            "This is twice the volume. The antiderivative of $x$ is $\\frac{x^{2}}{2}$, and the $\\frac{1}{2}$ cancels the $2$ in $2\\pi$.",
            "这是体积的两倍。$x$ 的原函数是 $\\frac{x^{2}}{2}$，其中的 $\\frac{1}{2}$ 与 $2\\pi$ 中的 $2$ 约掉。",
          ),
        },
      ];
      return {
        ...numberProblem({
          prompt: t(
            "The shaded rectangle is rotated about the $y$-axis. The volume of the solid is $k\\pi$. What is $k$?",
            "阴影矩形绕 $y$ 轴旋转。立体的体积是 $k\\pi$。$k$ 是多少？",
          ),
          answer: k,
          mistakes: all.filter((x, i) => x.value !== k && all.findIndex((y) => y.value === x.value) === i),
          solution: t(
            `**Step 1: Read the rectangle.** It runs from $x = ${p}$ to $x = ${q}$, and from $y = ${lo}$ to $y = ${lo + h}$, so each vertical strip has length $${h}$.\n\n**Step 2: Integrate the shells.** A strip at $x$ has radius $x$:\n\n$$V = 2\\pi\\int_{${p}}^{${q}} ${hh}x \\, dx = ${hh}\\pi\\left(${q * q} - ${p * p}\\right) = ${piTimes(k, 1)}$$\n\n**Check.** The solid is a hollow cylinder with outer radius $${q}$, inner radius $${p}$ and height $${h}$, so $V = \\pi\\left(${q}^{2} - ${p}^{2}\\right)${h === 1 ? "" : ` \\cdot ${h}`} = ${piTimes(k, 1)}$ and $k = ${k}$.`,
            `**第一步：读出矩形。**它从 $x = ${p}$ 到 $x = ${q}$，从 $y = ${lo}$ 到 $y = ${lo + h}$，所以每个竖直窄条长 $${h}$。\n\n**第二步：对柱壳积分。**$x$ 处窄条的半径是 $x$：\n\n$$V = 2\\pi\\int_{${p}}^{${q}} ${hh}x \\, dx = ${hh}\\pi\\left(${q * q} - ${p * p}\\right) = ${piTimes(k, 1)}$$\n\n**检验。**这个立体是外半径 $${q}$、内半径 $${p}$、高 $${h}$ 的空心圆柱，$V = \\pi\\left(${q}^{2} - ${p}^{2}\\right)${h === 1 ? "" : ` \\cdot ${h}`} = ${piTimes(k, 1)}$，所以 $k = ${k}$。`,
          ),
        }),
        figure: fig(
          { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
          [
            {
              kind: "polygon",
              points: [
                [p, lo],
                [q, lo],
                [q, lo + h],
                [p, lo + h],
              ],
            },
            { kind: "segment", a: [p, lo], b: [q, lo], accent: true },
            { kind: "segment", a: [q, lo], b: [q, lo + h], accent: true },
            { kind: "segment", a: [q, lo + h], b: [p, lo + h], accent: true },
            { kind: "segment", a: [p, lo + h], b: [p, lo], accent: true },
          ],
          [
            `A rectangle from x = ${p} to x = ${q} and from y = ${lo} to y = ${lo + h}.`,
            `从 x = ${p} 到 x = ${q}、从 y = ${lo} 到 y = ${lo + h} 的矩形。`,
          ],
        ),
      };
    },
  ),
  figure: calculusDrawings4["the-shell-method-rotation-about-the-y-axis#shells-of-a-drawn-rectangle"],
};

const washerVolume = {
  ...point(
    "washers-about-a-drawn-axis",
    ["Washers about a drawn axis", "绕图中轴旋转的垫圈"],
    [
      "When the axis of rotation is not a coordinate axis, measure both radii from the axis itself, never from the $x$-axis. The outer radius $R$ reaches the far edge of the region and the inner radius $r$ reaches the near edge. A slice then has area $\\pi$ times the outer radius squared minus the inner radius squared:\n\n$$V = \\pi\\int_{a}^{b} \\left(R^{2} - r^{2}\\right) dx$$\n\nFor example, the rectangle $0 \\le x \\le 2$, $1 \\le y \\le 3$ rotated about $y = -1$ has $R = 4$ and $r = 2$, so $V = \\pi\\int_{0}^{2} (16 - 4) \\, dx = 24\\pi$.\n\nCheck: $R^{2} - r^{2} = (R - r)(R + r) = 2 \\cdot 6$, so $V$ is $2\\pi$ times the middle radius $3$ times the area $4$ of the rectangle, $2\\pi \\cdot 3 \\cdot 4 = 24\\pi$.\n\n> **Watch out.** Radii measured from the $x$-axis, $3$ and $1$, give $16\\pi$, which is the solid about the wrong line.",
      "旋转轴不是坐标轴时，两个半径都要从旋转轴量起，而不是从 $x$ 轴量起。外半径 $R$ 到达区域的远边，内半径 $r$ 到达近边。截面面积就是 $\\pi$ 乘以外半径的平方减内半径的平方：\n\n$$V = \\pi\\int_{a}^{b} \\left(R^{2} - r^{2}\\right) dx$$\n\n例如，矩形 $0 \\le x \\le 2$，$1 \\le y \\le 3$ 绕 $y = -1$ 旋转，$R = 4$，$r = 2$，所以 $V = \\pi\\int_{0}^{2} (16 - 4) \\, dx = 24\\pi$。\n\n检验：$R^{2} - r^{2} = (R - r)(R + r) = 2 \\cdot 6$，所以 $V$ 是 $2\\pi$ 乘以中间半径 $3$ 再乘以矩形面积 $4$，$2\\pi \\cdot 3 \\cdot 4 = 24\\pi$。\n\n> **注意。** 从 $x$ 轴量出的半径 $3$ 和 $1$ 给出 $16\\pi$，那是绕错了直线的立体。",
    ],
    (rng) => {
      const axis = rng.int(-2, 6);
      const below = rng.bool();
      const lo = below ? axis + rng.int(1, 2) : axis - rng.int(1, 2) - 2;
      const h = rng.int(1, 2);
      const [near, far] = below ? [lo - axis, lo + h - axis] : [axis - lo - h, axis - lo];
      const [nearY, farY] = below ? [lo, lo + h] : [lo + h, lo];
      const p = rng.int(0, 2);
      const length = rng.int(1, 4);
      const k = length * (far * far - near * near);
      const yMin = Math.min(axis, lo) - 2;
      const area = length * h;
      const split = h === 1 ? `${far + near}` : `${h} \\cdot ${far + near}`;
      const fromX = [Math.abs(lo), Math.abs(lo + h)].sort((m, n) => m - n) as [number, number];
      const all = [
        ...(lo >= 0 || lo + h <= 0
          ? [
              {
                value: length * (fromX[1] * fromX[1] - fromX[0] * fromX[0]),
                why: t(
                  `This measures the radii from the $x$-axis, $${fromX[1]}$ and $${fromX[0]}$. The axis of rotation is the dashed line $y = ${axis}$.`,
                  `这是从 $x$ 轴量的半径 $${fromX[1]}$ 和 $${fromX[0]}$。旋转轴是虚线 $y = ${axis}$。`,
                ),
              },
            ]
          : []),
        {
          value: length * (far - near) * (far - near),
          why: t(
            "This squares the difference of the radii. A washer has area $\\pi(R^{2} - r^{2})$, not $\\pi(R - r)^{2}$.",
            "这是把两个半径的差平方了。垫圈的面积是 $\\pi(R^{2} - r^{2})$，不是 $\\pi(R - r)^{2}$。",
          ),
        },
        {
          value: length * far * far,
          why: t(
            `This leaves out the hole. The rectangle does not touch the line, so the inner radius $${near}$ must be taken away.`,
            `这里没有去掉孔。矩形不接触这条线，所以要减去内半径 $${near}$ 的部分。`,
          ),
        },
        {
          value: 2 * k,
          why: t(
            "This is twice the volume. A washer has area $\\pi(R^{2} - r^{2})$, with no factor $2$.",
            "这是体积的两倍。垫圈的面积是 $\\pi(R^{2} - r^{2})$，没有因子 $2$。",
          ),
        },
      ];
      return {
        ...numberProblem({
          prompt: t(
            "The shaded rectangle is rotated about the dashed horizontal line. The volume of the solid is $k\\pi$. What is $k$?",
            "阴影矩形绕水平虚线旋转。立体的体积是 $k\\pi$。$k$ 是多少？",
          ),
          answer: k,
          mistakes: all.filter((x, i) => x.value !== k && all.findIndex((y) => y.value === x.value) === i),
          solution: t(
            `**Step 1: Measure the radii from the line.** The dashed line is $y = ${axis}$. The far edge $y = ${farY}$ is $${far}$ away and the near edge $y = ${nearY}$ is $${near}$ away, so $R = ${far}$ and $r = ${near}$.\n\n**Step 2: Integrate the washers.** The rectangle runs from $x = ${p}$ to $x = ${p + length}$:\n\n$$V = \\pi\\int_{${p}}^{${p + length}} \\left(${far * far} - ${near * near}\\right) dx = ${piTimes(k, 1)}$$\n\n**Check.** $${far * far} - ${near * near} = ${split}$, so $V$ is $2\\pi$ times the middle radius $${Q.of(far + near, 2).toLatex()}$ times the area $${area}$ of the rectangle: $2\\pi \\cdot ${Q.of(far + near, 2).toLatex()}${area === 1 ? "" : ` \\cdot ${area}`} = ${piTimes(k, 1)}$, so $k = ${k}$.`,
            `**第一步：从这条线量半径。**虚线是 $y = ${axis}$。远边 $y = ${farY}$ 距离 $${far}$，近边 $y = ${nearY}$ 距离 $${near}$，所以 $R = ${far}$，$r = ${near}$。\n\n**第二步：对垫圈积分。**矩形从 $x = ${p}$ 到 $x = ${p + length}$：\n\n$$V = \\pi\\int_{${p}}^{${p + length}} \\left(${far * far} - ${near * near}\\right) dx = ${piTimes(k, 1)}$$\n\n**检验。**$${far * far} - ${near * near} = ${split}$，所以 $V$ 是 $2\\pi$ 乘以中间半径 $${Q.of(far + near, 2).toLatex()}$ 再乘以矩形面积 $${area}$：$2\\pi \\cdot ${Q.of(far + near, 2).toLatex()}${area === 1 ? "" : ` \\cdot ${area}`} = ${piTimes(k, 1)}$，所以 $k = ${k}$。`,
          ),
        }),
        figure: fig(
          { xMin: -1, xMax: 8, yMin, yMax: yMin + 9 },
          [
            {
              kind: "polygon",
              points: [
                [p, lo],
                [p + length, lo],
                [p + length, lo + h],
                [p, lo + h],
              ],
            },
            { kind: "segment", a: [-1, axis], b: [8, axis], dashed: true, accent: true },
          ],
          [
            `A rectangle from x = ${p} to x = ${p + length} and y = ${lo} to y = ${lo + h}, with a dashed axis at y = ${axis}.`,
            `从 x = ${p} 到 x = ${p + length}、y = ${lo} 到 y = ${lo + h} 的矩形，虚线轴在 y = ${axis}。`,
          ],
        ),
      };
    },
  ),
  figure: calculusDrawings4["volumes-of-revolution-using-the-washer-method-rotation-about-other-axes#washers-about-a-drawn-axis"],
};

interface PolarCase {
  readonly tex: (a: number) => string;
  readonly r: (a: number, th: number) => number;
  readonly span: number;
  readonly clue: Pair;
}

const polarCases: readonly PolarCase[] = [
  {
    tex: (a) => `r = ${a}\\cos 2\\theta`,
    r: (a, th) => a * Math.cos(2 * th),
    span: 2,
    clue: ["four petals, with tips on the axes", "四个花瓣，尖端在坐标轴上"],
  },
  {
    tex: (a) => `r = ${a}\\sin 2\\theta`,
    r: (a, th) => a * Math.sin(2 * th),
    span: 2,
    clue: ["four petals, with tips between the axes", "四个花瓣，尖端在坐标轴之间"],
  },
  {
    tex: (a) => `r = ${a}\\cos 3\\theta`,
    r: (a, th) => a * Math.cos(3 * th),
    span: 1,
    clue: ["three petals, one along the positive $x$-axis", "三个花瓣，一个沿 $x$ 轴正方向"],
  },
  {
    tex: (a) => `r = ${a}\\sin 3\\theta`,
    r: (a, th) => a * Math.sin(3 * th),
    span: 1,
    clue: ["three petals, one along the negative $y$-axis", "三个花瓣，一个沿 $y$ 轴负方向"],
  },
  {
    tex: (a) => `r = ${a}(1 + \\cos\\theta)`,
    r: (a, th) => a * (1 + Math.cos(th)),
    span: 2,
    clue: ["a cardioid reaching farthest along the positive $x$-axis", "心形线，沿 $x$ 轴正方向最远"],
  },
  {
    tex: (a) => `r = ${a}(1 - \\cos\\theta)`,
    r: (a, th) => a * (1 - Math.cos(th)),
    span: 2,
    clue: ["a cardioid reaching farthest along the negative $x$-axis", "心形线，沿 $x$ 轴负方向最远"],
  },
  {
    tex: (a) => `r = ${a}(1 + \\sin\\theta)`,
    r: (a, th) => a * (1 + Math.sin(th)),
    span: 2,
    clue: ["a cardioid reaching farthest along the positive $y$-axis", "心形线，沿 $y$ 轴正方向最远"],
  },
  {
    tex: (a) => `r = ${a}(1 - \\sin\\theta)`,
    r: (a, th) => a * (1 - Math.sin(th)),
    span: 2,
    clue: ["a cardioid reaching farthest along the negative $y$-axis", "心形线，沿 $y$ 轴负方向最远"],
  },
];

const polarEquation = {
  ...point(
    "the-equation-of-a-drawn-polar-curve",
    ["The equation of a drawn polar curve", "图中极坐标曲线的方程"],
    [
      "Before computing a polar area, match the curve to its equation. A rose with an odd multiple $n$ of the angle has $n$ petals, and an even multiple $n$ has $2n$ petals. A cardioid has one dent at the origin and reaches farthest in the direction where its sine or cosine term adds most.",
      "计算极坐标面积之前，先把曲线与方程对应起来。角度倍数 $n$ 为奇数的玫瑰线有 $n$ 个花瓣，倍数 $n$ 为偶数的有 $2n$ 个花瓣。心形线在原点有一个凹陷，在正弦或余弦项增加最多的方向上最远。",
    ],
    (rng) => {
      const right = rng.pick(polarCases);
      const a = rng.pick([2, 3, 4]);
      const reach = right.tex(1).includes("(1") ? 2 * a : a;
      const size = Math.ceil(reach) + 1;
      const points = Array.from({ length: 241 }, (_, i): Point => {
        const th = (right.span * Math.PI * i) / 240;
        const r = right.r(a, th);
        return [r * Math.cos(th), r * Math.sin(th)];
      });
      return choose(
        rng,
        ["Which equation describes the polar curve drawn?", "哪个方程描述图中的极坐标曲线？"],
        same(right.tex(a)),
        rng
          .sample(
            polarCases.filter((c) => c !== right),
            4,
          )
          .map((c) => same(c.tex(a))),
        [
          `The drawing shows ${right.clue[0]}, and its farthest reach is $${reach}$, which matches $${right.tex(a)}$.`,
          `图中是${right.clue[1]}，最远距离为 $${reach}$，与 $${right.tex(a)}$ 相符。`,
        ],
        fig(
          { xMin: -size, xMax: size, yMin: -size, yMax: size },
          [{ kind: "path", points, accent: true }],
          [
            `A polar curve: ${right.clue[0].replaceAll("$", "")}, reaching ${reach} from the origin.`,
            `极坐标曲线：${right.clue[1].replaceAll("$", "")}，距原点最远 ${reach}。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings5["the-total-area-bounded-by-a-single-polar-curve#the-equation-of-a-drawn-polar-curve"],
};

const polarBetween = {
  ...point(
    "the-area-between-two-drawn-polar-circles",
    ["The area between two drawn polar circles", "图中两个极坐标圆之间的面积"],
    [
      "To find the area inside one polar curve and outside another, integrate one half of the outer radius squared minus the inner radius squared. The limits are the angles of the rays through the intersection points. A drawing shows which curve is the outer one, and which angles bound the shaded part.",
      "求在一条极坐标曲线内部、另一条外部的面积，就对外半径的平方减内半径的平方的一半积分。积分限是经过交点的射线的角度。图能显示哪条曲线在外，以及哪些角度围成阴影部分。",
    ],
    (rng) => {
      const a = rng.int(1, 3);
      const [halfDen, square] = rng.pick<Point>([
        [3, 1],
        [4, 2],
        [6, 3],
      ]);
      const dir = rng.pick([
        { base: 0, f: "\\cos\\theta", g: (th: number) => Math.cos(th) },
        { base: 1, f: "\\sin\\theta", g: (th: number) => Math.sin(th) },
        { base: 2, f: "-\\cos\\theta", g: (th: number) => -Math.cos(th) },
        { base: 3, f: "-\\sin\\theta", g: (th: number) => -Math.sin(th) },
      ]);
      const big = 2 * a;
      const radius2 = a * a * square;
      const b = Math.sqrt(radius2);
      const center = (dir.base * Math.PI) / 2;
      const alpha = Math.PI / halfDen;
      const num = (extra: number, den: number) => piTimes(dir.base * den + extra * 2, 2 * den);
      const lower = (d: number) => num(-1, d);
      const upper = (d: number) => num(1, d);
      const outer = dir.f.startsWith("-") ? `${-big}${dir.f.slice(1)}` : `${big}${dir.f}`;
      const form = (half: boolean, lo: string, hi: string, swap: boolean) => {
        const [u, v] = swap ? [`${radius2}`, `(${outer})^2`] : [`(${outer})^2`, `${radius2}`];
        return same(`${half ? "\\frac{1}{2}" : ""}\\int_{${lo}}^{${hi}} \\left[ ${u} - ${v} \\right] d\\theta`);
      };
      const other = halfDen === 3 ? 6 : 3;
      const samples = Array.from({ length: 41 }, (_, i) => center - alpha + (2 * alpha * i) / 40);
      const polygon = [
        ...samples.map((th): Point => {
          const r = big * dir.g(th);
          return [r * Math.cos(th), r * Math.sin(th)];
        }),
        ...[...samples].reverse().map((th): Point => [b * Math.cos(th), b * Math.sin(th)]),
      ];
      const c: Point = [a * Math.cos(center), a * Math.sin(center)];
      const size = 2 * a + 1;
      const ray = (th: number): PlaneMark => ({
        kind: "segment",
        a: [0, 0],
        b: [big * dir.g(th) * Math.cos(th), big * dir.g(th) * Math.sin(th)],
        dashed: true,
      });
      return choose(
        rng,
        [
          `The shaded region lies inside the circle $r = ${outer}$ and outside a circle centered at the origin, and dashed rays pass through their intersections. Which integral gives its area?`,
          `阴影区域在圆 $r = ${outer}$ 内、以原点为中心的圆外，虚线射线经过它们的交点。哪个积分给出它的面积？`,
        ],
        form(true, lower(halfDen), upper(halfDen), false),
        [
          form(false, lower(halfDen), upper(halfDen), false),
          form(true, lower(halfDen), upper(halfDen), true),
          form(true, lower(other), upper(other), false),
          form(true, piTimes(dir.base, 2), upper(halfDen), false),
        ],
        [
          `The circle about the origin has radius squared $${radius2}$, and the rays make angles $${lower(halfDen)}$ and $${upper(halfDen)}$. The other circle is the outer curve between them, and an area in polar form carries the factor one half.`,
          `以原点为中心的圆的半径平方为 $${radius2}$，射线的角度是 $${lower(halfDen)}$ 和 $${upper(halfDen)}$。在它们之间另一个圆是外边界，极坐标面积带有二分之一的系数。`,
        ],
        fig(
          { xMin: -size, xMax: size, yMin: -size, yMax: size },
          [
            { kind: "polygon", points: polygon },
            { kind: "circle", center: [0, 0], r: b },
            { kind: "circle", center: c, r: a, accent: true },
            ray(center - alpha),
            ray(center + alpha),
          ],
          [
            `A circle of radius squared ${radius2} about the origin and a circle through the origin with center (${Math.round(c[0])}, ${Math.round(c[1])}); the part of the second outside the first is shaded.`,
            `以原点为中心、半径平方为 ${radius2} 的圆，和过原点、圆心为 (${Math.round(c[0])}, ${Math.round(c[1])}) 的圆；第二个圆在第一个圆外的部分是阴影。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings5["the-area-bounded-by-two-polar-curves#the-area-between-two-drawn-polar-circles"],
};

const termFromPartialSums = point(
  "a-term-from-a-plot-of-partial-sums",
  ["A term from a plot of partial sums", "由部分和的图读项"],
  [
    "A partial sum $S_n$ adds the first $n$ terms, so consecutive partial sums differ by exactly one term: $a_n = S_n - S_{n-1}$. On a plot of partial sums, a term is the signed vertical step from one dot to the next. A dot that falls below the previous one means a negative term.",
    "部分和 $S_n$ 把前 $n$ 项相加，所以相邻部分和恰好相差一项：$a_n = S_n - S_{n-1}$。在部分和的图上，一项就是从一个点到下一个点的带符号竖直步长。点比前一个点低，说明这一项为负。",
  ],
  (rng) => {
    const values: number[] = [rng.int(-2, 3)];
    for (let i = 1; i < 7; i++) {
      const last = values[i - 1] as number;
      const step = rng.nonZero(-3, 3);
      values.push(last + step > 6 || last + step < -3 ? last - step : last + step);
    }
    const n = rng.int(2, 7);
    const [now, before] = [values[n - 1] as number, values[n - 2] as number];
    const term = now - before;
    return ask(
      [
        `The dots show the partial sums $S_1, S_2, \\ldots, S_7$ of a series. What is the term $a_{${n}}$?`,
        `图中的点是某级数的部分和 $S_1, S_2, \\ldots, S_7$。项 $a_{${n}}$ 是多少？`,
      ],
      term,
      [now, before, -term, now + before],
      [
        `The term is the step between consecutive partial sums: $a_{${n}} = S_{${n}} - S_{${n - 1}} = ${now} - ${before < 0 ? `(${before})` : before} = ${term}$.`,
        `项是相邻部分和之间的步长：$a_{${n}} = S_{${n}} - S_{${n - 1}} = ${now} - ${before < 0 ? `(${before})` : before} = ${term}$。`,
      ],
      fig({ xMin: 0, xMax: 8, yMin: -4, yMax: 7, xName: "n", yName: "S" }, dots(values), [
        `Partial sums at n = 1 to 7: ${values.join(", ")}.`,
        `n = 1 到 7 的部分和：${values.join("，")}。`,
      ]),
    );
  },
);

const seriesBehaviour = point(
  "convergence-from-a-plot-of-partial-sums",
  ["Convergence from a plot of partial sums", "由部分和的图判断收敛"],
  [
    "A series converges exactly when its partial sums approach a single number. So a plot settling at a height means convergence to that height. Partial sums that keep climbing, or that keep bouncing between values without settling, mean divergence, even if the individual terms look small or the bouncing looks orderly.",
    "级数收敛当且仅当它的部分和趋向一个确定的数。所以图稳定在某个高度，就说明收敛到这个高度。部分和不断上升，或者不断跳动而不稳定，都说明发散，即使各项看起来很小或跳动看起来很规则。",
  ],
  (rng) => {
    const L = rng.int(-2, 4);
    const kind = rng.pick(["monotone", "alternating", "climb", "fall", "bounce"] as const);
    const size = rng.pick([2, 3]);
    const f: (n: number) => number =
      kind === "monotone"
        ? (n) => L - size * 0.6 ** n
        : kind === "alternating"
          ? (n) => L + size * (-0.65) ** n
          : kind === "climb"
            ? (n) => -2 + size * Math.sqrt(n)
            : kind === "fall"
              ? (n) => 5 - size * Math.sqrt(n)
              : (n) => L + (n % 2 === 0 ? size / 2 : -size / 2);
    const values = Array.from({ length: 12 }, (_, i) => f(i + 1));
    const converge = kind === "monotone" || kind === "alternating";
    const right: Pair = converge
      ? [`It converges to $${L}$`, `收敛到 $${L}$`]
      : kind === "bounce"
        ? ["It diverges, because its partial sums oscillate", "发散，因为部分和振荡"]
        : kind === "climb"
          ? ["It diverges to positive infinity", "发散到正无穷"]
          : ["It diverges to negative infinity", "发散到负无穷"];
    const near = L + (L === 4 ? -1 : 1);
    const wrong: Pair[] = [
      [`It converges to $${L}$`, `收敛到 $${L}$`],
      [`It converges to $${near}$`, `收敛到 $${near}$`],
      ["It converges to $0$", "收敛到 $0$"],
      ["It diverges to positive infinity", "发散到正无穷"],
      ["It diverges, because its partial sums oscillate", "发散，因为部分和振荡"],
      ["It diverges to negative infinity", "发散到负无穷"],
    ];
    const seen: Pair = converge
      ? [`The dots settle at height $${L}$, so the partial sums approach that number`, `点稳定在高度 $${L}$，所以部分和趋向这个数`]
      : kind === "bounce"
        ? [
            "The dots keep jumping between two heights, so the partial sums approach no single number",
            "点不断在两个高度之间跳动，所以部分和不趋向任何一个数",
          ]
        : ["The dots keep moving away without settling, so the partial sums are unbounded", "点不断远离且不稳定，所以部分和无界"];
    return choose(
      rng,
      [
        "The dots show the partial sums of a series. What does the plot show about the series?",
        "图中的点是某级数的部分和。关于这个级数，图说明了什么？",
      ],
      right,
      wrong.filter((o) => o[0] !== right[0]),
      [`${seen[0]}.`, `${seen[1]}。`],
      fig(
        { xMin: 0, xMax: 13, yMin: -6, yMax: 9, xName: "n", yName: "S" },
        [...dots(values), { kind: "segment", a: [0, L], b: [13, L], dashed: true }],
        [
          `Partial sums of a series for n from 1 to 12, at heights ${values.map((v) => Math.round(v * 10) / 10).join(", ")}, with a dashed horizontal line at height ${L}.`,
          `某级数在 n 从 1 到 12 时的部分和，高度依次为 ${values.map((v) => Math.round(v * 10) / 10).join("、")}，并有一条高度为 ${L} 的水平虚线。`,
        ],
      ),
    );
  },
);

const nthTermPlot = point(
  "the-nth-term-test-on-a-plot-of-terms",
  ["The nth term test on a plot of terms", "在项的图上用第 n 项判别法"],
  [
    "The divergence test looks at the terms themselves. If the terms approach a nonzero number or have no limit, the series diverges. If they approach zero, the test says nothing, because some such series converge and others diverge. So a plot of terms heading to zero never proves convergence by itself.",
    "发散判别法看的是项本身。如果项趋向非零数或没有极限，级数发散。如果项趋向零，判别法什么也没说，因为这样的级数有的收敛有的发散。所以项趋向零的图本身不能证明收敛。",
  ],
  (rng) => {
    const c = rng.pick([-3, -2, -1, 1, 2, 3]);
    const size = rng.int(2, 4);
    const toZero = rng.bool();
    const up = rng.bool();
    const f = toZero ? (n: number) => (up ? 1 : -1) * (size / n) : (n: number) => c + ((up ? 1 : -1) * size) / n;
    const values = Array.from({ length: 12 }, (_, i) => f(i + 1));
    const right: Pair = toZero ? ["The test gives no conclusion", "判别法得不出结论"] : ["The series diverges", "级数发散"];
    const wrong: Pair[] = [
      toZero ? ["The series diverges", "级数发散"] : ["The test gives no conclusion", "判别法得不出结论"],
      ["The series converges to $0$", "级数收敛到 $0$"],
      [`The series converges to $${toZero ? size : c}$`, `级数收敛到 $${toZero ? size : c}$`],
    ];
    const reason: Pair = toZero
      ? [
          "The terms approach zero, so the divergence test does not apply and other tests are needed",
          "项趋向零，所以发散判别法不适用，需要别的判别法",
        ]
      : [`The terms approach $${c}$, which is not zero, so the series cannot converge`, `项趋向 $${c}$，它不是零，所以级数不可能收敛`];
    return choose(
      rng,
      [
        "The dots show the terms $a_n$ of a series, and the pattern continues. What does the divergence test say?",
        "图中的点是某级数的项 $a_n$，规律一直持续。发散判别法说明了什么？",
      ],
      right,
      wrong,
      [`${reason[0]}.`, `${reason[1]}。`],
      fig({ xMin: 0, xMax: 13, yMin: -7, yMax: 7, xName: "n", yName: "a" }, dots(values), [
        `The terms of a series, which settle at ${toZero ? 0 : c}, starting from ${f(1)}.`,
        `某级数的项，稳定在 ${toZero ? 0 : c}，从 ${f(1)} 开始。`,
      ]),
    );
  },
);

const alternatingBound = point(
  "an-alternating-error-bound-from-a-plot",
  ["An alternating error bound from a plot", "由图读交错级数的误差界"],
  [
    "For an alternating series whose term sizes decrease to zero, the error after $n$ terms is at most the size of the next term. So on a plot of term sizes, the bound on the error of $S_n$ is the height of the dot at $n + 1$, and not the dot at $n$, which has already been added in.",
    "对于项的大小递减趋于零的交错级数，取前 $n$ 项后的误差不超过下一项的大小。所以在项大小的图上，$S_n$ 的误差界是 $n + 1$ 处点的高度，而不是 $n$ 处的点，那一项已经加进去了。",
  ],
  (rng) => {
    const values = rng.sample([9, 8, 7, 6, 5, 4, 3, 2, 1], 6).sort((x, y) => y - x);
    const n = rng.int(1, 4);
    const next = values[n] as number;
    return ask(
      [
        `The dots show the sizes $|a_1|, \\ldots, |a_6|$ of the terms of an alternating series, and the sizes keep decreasing to zero. By the alternating series bound, what is the smallest upper bound the plot gives on the error of $S_{${n}}$?`,
        `图中的点是某交错级数各项的大小 $|a_1|, \\ldots, |a_6|$，这些大小继续递减趋于零。由交错级数误差界，图给出的 $S_{${n}}$ 误差的最小上界是多少？`,
      ],
      next,
      [values[n - 1] as number, values[n + 1] as number, (values[n - 1] as number) + next],
      [
        `The error after $${n}$ terms is at most the next term size, $|a_{${n + 1}}|$, and the dot at $${n + 1}$ has height $${next}$.`,
        `取前 $${n}$ 项后的误差不超过下一项的大小 $|a_{${n + 1}}|$，而 $${n + 1}$ 处点的高度是 $${next}$。`,
      ],
      fig({ xMin: 0, xMax: 7, yMin: 0, yMax: 10, xName: "n" }, dots(values), [
        `Term sizes at n = 1 to 6: ${values.join(", ")}.`,
        `n = 1 到 6 的项的大小：${values.join("，")}。`,
      ]),
    );
  },
);

const radiusFromInterval = {
  ...point(
    "radius-from-a-drawn-interval-of-convergence",
    ["Radius from a drawn interval of convergence", "由图中收敛区间读半径"],
    [
      "A power series converges on an interval centered at its center $a$, with radius $R$ being half the length of the interval. The endpoints may or may not belong to the interval, and that does not change $R$. So open and filled circles at the ends matter for convergence at those points only, and not for the radius.",
      "幂级数在以中心 $a$ 为中点的区间上收敛，半径 $R$ 是区间长度的一半。端点可能属于区间，也可能不属于，这不改变 $R$。所以两端的空心圆和实心圆只影响那两点的收敛性，不影响半径。",
    ],
    (rng) => {
      const a = rng.int(-3, 3);
      const R = rng.int(1, 4);
      const [leftIn, rightIn] = [rng.bool(), rng.bool()];
      const askCenter = rng.bool();
      const scale = 20;
      const x = (v: number) => 160 + v * scale;
      let body = `<line x1="16" y1="50" x2="304" y2="50"/>`;
      for (let v = -7; v <= 7; v++)
        body += `<line x1="${x(v)}" y1="46" x2="${x(v)}" y2="54"/>${v % 2 === 0 ? label(x(v), 72, String(v).replace("-", "−")) : ""}`;
      const end = (v: number, filled: boolean) =>
        `<circle class="accent" cx="${x(v)}" cy="50" r="5" fill="${filled ? "currentColor" : "none"}" stroke="currentColor"/>`;
      body += `<line class="accent" x1="${x(a - R)}" y1="50" x2="${x(a + R)}" y2="50" stroke-width="3" stroke="currentColor"/>${end(a - R, leftIn)}${end(a + R, rightIn)}`;
      const name = (open: boolean): Pair => (open ? ["filled", "实心"] : ["open", "空心"]);
      return ask(
        askCenter
          ? [
              `The thick segment shows the interval of convergence of a power series. What is the center of the series?`,
              `粗线段表示某幂级数的收敛区间。级数的中心是多少？`,
            ]
          : [
              `The thick segment shows the interval of convergence of a power series. What is its radius of convergence?`,
              `粗线段表示某幂级数的收敛区间。它的收敛半径是多少？`,
            ],
        askCenter ? a : R,
        askCenter ? [a - R, a + R, R] : [2 * R, a, R + 1],
        [
          `The interval runs from $${a - R}$ to $${a + R}$, so its midpoint is $${a}$ and half its length is $${R}$. The ${name(leftIn)[0]} and ${name(rightIn)[0]} ends do not affect either number.`,
          `区间从 $${a - R}$ 到 $${a + R}$，所以中点是 $${a}$，长度的一半是 $${R}$。左端${name(leftIn)[1]}和右端${name(rightIn)[1]}都不影响这两个数。`,
        ],
        {
          svg: svgDocument(90, body),
          alt: t(
            `An interval on a number line from ${a - R} (${name(leftIn)[0]}) to ${a + R} (${name(rightIn)[0]}).`,
            `数轴上从 ${a - R}（${name(leftIn)[1]}）到 ${a + R}（${name(rightIn)[1]}）的区间。`,
          ),
        },
      );
    },
  ),
  figure: calculusDrawings5["radius-of-convergence-of-power-series#radius-from-a-drawn-interval-of-convergence"],
};

const taylorSigns = {
  ...point(
    "signs-of-taylor-coefficients-from-a-graph",
    ["Signs of Taylor coefficients from a graph", "由图读泰勒系数的符号"],
    [
      "The second-degree Taylor polynomial at $a$ uses $f(a)$, $f'(a)$ and $f''(a)$, and a graph shows the sign of each. The height at $a$ gives the first, the rise or fall through $a$ gives the second, and whether the graph bends upward or downward at $a$ gives the third.",
      "在 $a$ 处的二阶泰勒多项式用到 $f(a)$、$f'(a)$ 和 $f''(a)$，图能显示每一个的符号。$a$ 处的高度给出第一个，经过 $a$ 时的上升或下降给出第二个，图在 $a$ 处向上弯还是向下弯给出第三个。",
    ],
    (rng) => {
      const a = rng.int(-2, 2);
      const [s0, s1, s2] = [rng.sign(), rng.sign(), rng.sign()];
      const value = s0 * rng.int(1, 3);
      const slope = s1 * rng.int(1, 2);
      const bend = s2 * rng.pick([0.5, 1]);
      const f = (x: number) => value + slope * (x - a) + 0.5 * bend * (x - a) ** 2;
      const sign = (s: number) => (s > 0 ? ">" : "<");
      const form = (x: number, y: number, z: number) => same(`f(a) ${sign(x)} 0,\\; f'(a) ${sign(y)} 0,\\; f''(a) ${sign(z)} 0`);
      const word = (s: number): Pair => (s > 0 ? ["positive", "正"] : ["negative", "负"]);
      return choose(
        rng,
        ["What are the signs at the marked point $x = a$ of the function drawn?", "图中函数在所标点 $x = a$ 处的符号是什么？"],
        form(s0, s1, s2),
        [form(s0, s1, -s2), form(s0, -s1, s2), form(-s0, s1, s2), form(-s0, -s1, s2), form(s0, -s1, -s2)],
        [
          `At $a$ the height is ${word(s0)[0]}, the graph is ${s1 > 0 ? "rising" : "falling"} so the slope is ${word(s1)[0]}, and the graph bends ${s2 > 0 ? "upward" : "downward"} so the second derivative is ${word(s2)[0]}.`,
          `在 $a$ 处高度为${word(s0)[1]}，图象${s1 > 0 ? "上升" : "下降"}，所以斜率为${word(s1)[1]}；图象${s2 > 0 ? "向上" : "向下"}弯，所以二阶导数为${word(s2)[1]}。`,
        ],
        fig(
          { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
          [
            { kind: "curve", f, accent: true },
            { kind: "point", at: [a, value], label: "a", dir: "n" },
          ],
          [
            `A parabola at height ${value} at x = ${a}, ${s1 > 0 ? "rising" : "falling"} there and bending ${s2 > 0 ? "upward" : "downward"}.`,
            `一条抛物线，在 x = ${a} 处高度为 ${value}，在那里${s1 > 0 ? "上升" : "下降"}，并${s2 > 0 ? "向上" : "向下"}弯。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings5["analyzing-second-degree-taylor-polynomials#signs-of-taylor-coefficients-from-a-graph"],
};

const averageValue = {
  ...point(
    "the-average-value-of-a-drawn-function",
    ["The average value of a drawn function", "图中函数的平均值"],
    [
      "The average value of $f$ over an interval is its integral divided by the length of the interval. For a graph made of straight pieces, the integral is the signed area of trapezoids, with area below the axis counting as negative. The average is the height of a rectangle with the same base and area. For example, straight pieces through the heights $2, 4, 0$ at $x = 0, 1, 2$ enclose the trapezoids $\\frac{2 + 4}{2} = 3$ and $\\frac{4 + 0}{2} = 2$, so the integral is $5$ and the average over $[0, 2]$ is $\\frac{5}{2}$.\n\nCheck: a rectangle of base $2$ and height $\\frac{5}{2}$ has area $5$, the same as the region under the graph.\n\n> **Watch out.** Divide by the length of the interval, not by the number of marked heights, and do not simply average those heights: each end height belongs to only one trapezoid.",
      "$f$ 在区间上的平均值等于积分除以区间长度。对于由直线段组成的图，积分是梯形的带符号面积，轴下方的面积算作负值。平均值就是底相同、面积也相同的矩形的高。例如，经过高度 $2, 4, 0$（横坐标 $x = 0, 1, 2$）的直线段围出梯形 $\\frac{2 + 4}{2} = 3$ 和 $\\frac{4 + 0}{2} = 2$，所以积分是 $5$，在 $[0, 2]$ 上的平均值是 $\\frac{5}{2}$。\n\n检验：底为 $2$、高为 $\\frac{5}{2}$ 的矩形面积是 $5$，与图像下方的区域相同。\n\n> **注意。** 要除以区间的长度，而不是标出的高度的个数；也不能直接平均这些高度：两端的高度各只属于一个梯形。",
    ],
    (rng) => {
      const n = rng.pick([3, 4, 5, 6]);
      const heights = Array.from({ length: n + 1 }, () => rng.int(-2, 5));
      const h = (i: number) => heights[i] as number;
      let doubled = 0;
      for (let i = 0; i < n; i++) doubled += h(i) + h(i + 1);
      const area = Q.of(doubled, 2);
      const average = Q.of(doubled, 2 * n);
      const inP = (q: Q) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());
      const pieces = Array.from({ length: n }, (_, i) => inP(Q.of(h(i) + h(i + 1), 2))).join(" + ");
      const weighted = [`\\frac{${h(0)}}{2}`, ...heights.slice(1, n).map((v) => (v < 0 ? `(${v})` : `${v}`)), `\\frac{${h(n)}}{2}`].join(
        " + ",
      );
      const all = [
        {
          value: area,
          why: t(
            `This is the signed area itself; divide it by the length $${n}$ of the interval.`,
            `这是带符号面积本身；还要除以区间长度 $${n}$。`,
          ),
        },
        {
          value: Q.of(doubled, 2 * (n + 1)),
          why: t(
            `This divides by $${n + 1}$, the number of marked heights; the interval from $0$ to $${n}$ has length $${n}$.`,
            `这是除以标出高度的个数 $${n + 1}$；从 $0$ 到 $${n}$ 的区间长度是 $${n}$。`,
          ),
        },
        {
          value: Q.of(
            heights.reduce((u, v) => u + v, 0),
            n + 1,
          ),
          why: t(
            "This averages the marked heights, counting the end heights as fully as the inner ones; each end height belongs to only one trapezoid.",
            "这是把标出的高度直接平均，两端的高度与中间的高度算得一样多；两端的高度各只属于一个梯形。",
          ),
        },
        {
          value: Q.of(h(0) + h(n), 2),
          why: t(
            `This averages only the two end heights, as if the graph were one straight piece; the heights in between change the area.`,
            `这只平均了两端的高度，好像图像只是一条直线段；中间的高度也会改变面积。`,
          ),
        },
      ];
      const mistakes = all.filter((x, i) => !x.value.eq(average) && all.findIndex((y) => y.value.eq(x.value)) === i);
      return {
        ...numberProblem({
          prompt: t(
            "What is the average value of the function drawn, over the whole interval it is drawn on?",
            "图中函数在所画的整个区间上的平均值是多少？",
          ),
          answer: average,
          mistakes,
          solution: t(
            `**Step 1: Add the trapezoids.** The graph runs from $x = 0$ to $x = ${n}$ through the heights $${heights.join(", ")}$. Each piece of width $1$ has signed area the mean of its two end heights:\n\n$$${pieces} = ${area.toLatex()}$$\n\n**Step 2: Divide by the length.** The interval has length $${n}$:\n\n$$${area.toLatex()} \\div ${n} = ${average.toLatex()}$$\n\n**Check.** Find the area another way: each inner height is shared by two trapezoids and each end height by one, so the area is\n\n$$${weighted} = ${area.toLatex()}$$\n\nthe same as before, and $${area.toLatex()} \\div ${n} = ${average.toLatex()}$.`,
            `**第一步：把梯形加起来。**图像从 $x = 0$ 到 $x = ${n}$，经过高度 $${heights.join(", ")}$。每段宽为 $1$，带符号面积是两端高度的平均：\n\n$$${pieces} = ${area.toLatex()}$$\n\n**第二步：除以长度。**区间长度是 $${n}$：\n\n$$${area.toLatex()} \\div ${n} = ${average.toLatex()}$$\n\n**检验。**用另一种方法求面积：每个中间高度被两个梯形共用，两端高度各只属于一个梯形，所以面积为\n\n$$${weighted} = ${area.toLatex()}$$\n\n与前面相同，而 $${area.toLatex()} \\div ${n} = ${average.toLatex()}$。`,
          ),
        }),
        figure: fig(
          { xMin: -1, xMax: 7, yMin: -3, yMax: 6 },
          [{ kind: "path", points: heights.map((v, i): Point => [i, v]), accent: true }],
          [
            `Straight pieces through the heights ${heights.join(", ")} at x = 0, 1, 2 and so on.`,
            `经过高度 ${heights.join("，")} 的直线段，横坐标依次为 0、1、2 等。`,
          ],
        ),
      };
    },
  ),
  figure: calculusDrawings4["the-average-value-of-a-function#the-average-value-of-a-drawn-function"],
};

/** deeperFiguresCalculusIiPoints adds knowledge points of Calculus II that are answered by reading a drawing. */
export const deeperFiguresCalculusIiPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-area-between-curves-expressed-as-functions-of-y": [areaInY],
  "finding-areas-between-curves-that-intersect-at-more-than-two-points": [splitArea],
  "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes": [discIntegral],
  "the-shell-method-rotation-about-the-y-axis": [shellVolume],
  "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes": [washerVolume],
  "the-total-area-bounded-by-a-single-polar-curve": [polarEquation],
  "the-area-bounded-by-two-polar-curves": [polarBetween],
  "infinite-series-and-partial-sums": [termFromPartialSums],
  "convergent-and-divergent-infinite-series": [seriesBehaviour],
  "the-nth-term-test-for-divergence": [nthTermPlot],
  "the-alternating-series-error-bound": [alternatingBound],
  "radius-of-convergence-of-power-series": [radiusFromInterval],
  "analyzing-second-degree-taylor-polynomials": [taylorSigns],
  "the-average-value-of-a-function": [averageValue],
};
