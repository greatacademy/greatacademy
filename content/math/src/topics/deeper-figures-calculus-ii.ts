// Knowledge points of Calculus II that ask the learner to read a drawing: regions, solids, polar curves and plots of
// partial sums. See `deeperFiguresCalculusIiPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd, Q, svgDocument } from "@ga/subject-math";

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
    "When a region is bounded on the left and right by curves, slice it into horizontal strips. Each strip has width equal to the right curve minus the left curve, at that height. The limits are the heights where the two curves meet, read on the vertical axis, and the integral is taken with respect to $y$.",
    "当区域的左右边界是曲线时，把它切成水平窄条。每个窄条的宽度等于该高度处右边曲线减左边曲线。积分限是两条曲线相交的高度，在纵轴上读出，并对 $y$ 积分。",
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
      same(`\\int_{${lo}}^{${hi}} \\left[ (${a}) - (${b}) \\right] d${d}`);
    const [x1, x2] = [Math.min(curved(y1), curved(y2)), Math.max(curved(y1), curved(y2))];
    const samples = Array.from({ length: 33 }, (_, i) => y1 + ((y2 - y1) * i) / 32);
    const polygon = [...samples.map((y): Point => [curved(y), y]), ...[...samples].reverse().map((y): Point => [straight(y), y])];
    const extended = Array.from({ length: 41 }, (_, i) => -4.2 + (8.4 * i) / 40).filter((y) => Math.abs(curved(y)) < 9);
    const view: PlaneView = flip ? { xMin: -8, xMax: 4, yMin: -6, yMax: 6 } : { xMin: -4, xMax: 8, yMin: -6, yMax: 6 };
    return choose(
      rng,
      [
        "Which integral gives the area of the shaded region, whose bounding curves are labeled?",
        "哪个积分给出阴影区域的面积？边界曲线已在图中标出。",
      ],
      form(y1, y2, right, left, "y"),
      [
        form(y1, y2, left, right, "y"),
        form(x1, x2, right, left, "x"),
        form(0, y2 - y1, right, left, "y"),
        form(y1, y2 + 1, right, left, "y"),
      ],
      [
        `The curves meet at heights $${y1}$ and $${y2}$, and between them $x = ${right}$ lies to the right of $x = ${left}$, so each horizontal strip has width right minus left.`,
        `两条曲线在高度 $${y1}$ 和 $${y2}$ 相交，在这之间 $x = ${right}$ 位于 $x = ${left}$ 右边，所以每个水平窄条的宽度是右减左。`,
      ],
      fig(
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
    );
  },
);

const splitArea = point(
  "splitting-an-area-where-curves-cross",
  ["Splitting an area where curves cross", "在曲线相交处分割面积"],
  [
    "When two curves cross inside an interval, the upper curve changes at the crossing. A single integral of the difference would let areas above and below cancel. So split the interval at each crossing and subtract in the order that the drawing shows on each piece, keeping every piece positive.",
    "两条曲线在区间内相交时，上方曲线在交点处改变。对差只做一个积分会让上下面积互相抵消。所以要在每个交点分割区间，在每一段上按图中所见的上下关系相减，使每一段都为正。",
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
      same(
        `${piece(c - k, c, `${up}(x)`, `${down}(x)`)} + ${again ? piece(c, c + k, `${up}(x)`, `${down}(x)`) : piece(c, c + k, `${down}(x)`, `${up}(x)`)}`,
      );
    const samples = Array.from({ length: 65 }, (_, i) => c - k + (2 * k * i) / 64);
    return choose(
      rng,
      [
        "Which expression gives the total area of the shaded regions between the labeled curves $f$ and $g$?",
        "哪个式子给出标有 $f$ 和 $g$ 的两条曲线之间阴影区域的总面积？",
      ],
      form(firstUp, firstDown, false),
      [
        form(firstDown, firstUp, false),
        form(firstUp, firstDown, true),
        same(`\\int_{${c - k}}^{${c + k}} (f(x) - g(x))\\,dx`),
        form(firstDown, firstUp, true),
      ],
      [
        `The curves cross at $x = ${c - k}$, $x = ${c}$ and $x = ${c + k}$. On the left piece $${firstUp}$ is on top and on the right piece $${firstDown}$ is on top, so each piece subtracts the lower curve from the upper one.`,
        `曲线在 $x = ${c - k}$、$x = ${c}$ 和 $x = ${c + k}$ 处相交。左段 $${firstUp}$ 在上，右段 $${firstDown}$ 在上，所以每段都用上方曲线减下方曲线。`,
      ],
      fig(
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
          `A curve f crossing the horizontal line g at x = ${c - k}, ${c} and ${c + k}; f is ${flip ? "below" : "above"} g on the left piece.`,
          `曲线 f 与水平线 g 在 x = ${c - k}、${c} 和 ${c + k} 处相交；左段 f 在 g ${flip ? "下方" : "上方"}。`,
        ],
      ),
    );
  },
);

const discIntegral = point(
  "the-disc-integral-of-a-drawn-region",
  ["The disc integral of a drawn region", "图中区域的圆盘积分"],
  [
    "Rotating a region under a graph about the $x$-axis makes a solid whose slices are discs. A slice at position $x$ has radius equal to the height of the graph there, so its area is $\\pi$ times the height squared. Adding the slices between the ends of the region gives the volume.",
    "把图象下方的区域绕 $x$ 轴旋转，得到的立体的截面是圆盘。位置 $x$ 处截面的半径等于图象在该处的高度，所以面积是 $\\pi$ 乘以高度的平方。把区域两端之间的截面加起来就得到体积。",
  ],
  (rng) => {
    const p = rng.int(0, 3);
    const q = p + rng.int(1, 4);
    const shape = rng.pick<(x: number) => number>([(x) => 1 + 0.5 * x, (x) => 0.2 * x * x + 1, (x) => 4 - 0.4 * x, (x) => 2 + Math.sin(x)]);
    const samples = Array.from({ length: 33 }, (_, i) => p + ((q - p) * i) / 32);
    const limits = `\\int_{${p}}^{${q}}`;
    return choose(
      rng,
      [
        "The shaded region under the graph of $f$ is rotated about the $x$-axis. Which integral gives the volume of the solid?",
        "$f$ 图象下方的阴影区域绕 $x$ 轴旋转。哪个积分给出立体的体积？",
      ],
      same(`\\pi ${limits} f(x)^2\\,dx`),
      [
        same(`\\pi ${limits} f(x)\\,dx`),
        same(`2\\pi ${limits} x f(x)\\,dx`),
        same(`\\pi \\int_{0}^{${q}} f(x)^2\\,dx`),
        same(`${limits} f(x)^2\\,dx`),
      ],
      [
        `The region runs from $x = ${p}$ to $x = ${q}$, and a slice at $x$ is a disc of radius $f(x)$ with area $\\pi f(x)^2$. Adding these slices gives the volume.`,
        `区域从 $x = ${p}$ 到 $x = ${q}$，$x$ 处的截面是半径为 $f(x)$ 的圆盘，面积为 $\\pi f(x)^2$。把这些截面加起来就得到体积。`,
      ],
      fig(
        { xMin: -1, xMax: 8, yMin: -1, yMax: 8 },
        [
          { kind: "polygon", points: [[p, 0], ...samples.map((x): Point => [x, shape(x)]), [q, 0]] },
          { kind: "curve", f: shape, from: -0.5, to: 7.5, accent: true },
          { kind: "label", at: [7, Math.min(shape(7), 7)], text: "f", dir: "n" },
        ],
        [`The region under the graph of f from x = ${p} to x = ${q}.`, `f 图象下方从 x = ${p} 到 x = ${q} 的区域。`],
      ),
    );
  },
);

const shellVolume = point(
  "shells-of-a-drawn-rectangle",
  ["Shells of a drawn rectangle", "图中矩形的柱壳"],
  [
    "Rotating about the $y$-axis turns each vertical strip of a region into a thin cylindrical shell. A strip at $x$ has radius $x$ and height equal to the strip length, so the volume is the integral of $2\\pi x$ times height over the $x$-values of the region. The radius grows across the region, so the position matters.",
    "绕 $y$ 轴旋转时，区域的每个竖直窄条变成薄圆柱壳。$x$ 处的窄条半径为 $x$，高度等于窄条长度，所以体积是 $2\\pi x$ 乘以高度在区域的 $x$ 范围上的积分。半径随位置增大，所以位置很重要。",
  ],
  (rng) => {
    const p = rng.int(1, 3);
    const q = p + rng.int(1, 3);
    const lo = rng.int(0, 2);
    const h = rng.int(1, 4);
    const k = h * (q * q - p * p);
    return ask(
      [
        "The shaded rectangle is rotated about the $y$-axis. The volume of the solid is $k\\pi$. What is $k$?",
        "阴影矩形绕 $y$ 轴旋转。立体的体积是 $k\\pi$。$k$ 是多少？",
      ],
      k,
      [h * (q - p) * (q - p), h * q * q, 2 * k, h * (q - p) * (p + q + 1)],
      [
        `The rectangle has height $${h}$ and runs from $x = ${p}$ to $x = ${q}$. Shells give $\\int_{${p}}^{${q}} 2\\pi x \\cdot ${h}\\,dx = ${h}(${q * q} - ${p * p})\\pi$, so $k = ${k}$.`,
        `矩形高度为 $${h}$，从 $x = ${p}$ 到 $x = ${q}$。柱壳法给出 $\\int_{${p}}^{${q}} 2\\pi x \\cdot ${h}\\,dx = ${h}(${q * q} - ${p * p})\\pi$，所以 $k = ${k}$。`,
      ],
      fig(
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
    );
  },
);

const washerVolume = point(
  "washers-about-a-drawn-axis",
  ["Washers about a drawn axis", "绕图中轴旋转的垫圈"],
  [
    "When the axis of rotation is not a coordinate axis, measure both radii from the axis itself, never from the $x$-axis. The outer radius reaches the far edge of the region and the inner radius reaches the near edge. A slice then has area $\\pi$ times the outer radius squared minus the inner radius squared.",
    "旋转轴不是坐标轴时，两个半径都要从旋转轴量起，而不是从 $x$ 轴量起。外半径到达区域的远边，内半径到达近边。截面面积就是 $\\pi$ 乘以外半径的平方减内半径的平方。",
  ],
  (rng) => {
    const axis = rng.int(-2, 6);
    const below = rng.bool();
    const lo = below ? axis + rng.int(1, 2) : axis - rng.int(1, 2) - 2;
    const h = rng.int(1, 2);
    const [near, far] = below ? [lo - axis, lo + h - axis] : [axis - lo - h, axis - lo];
    const p = rng.int(0, 2);
    const length = rng.int(1, 4);
    const k = length * (far * far - near * near);
    const yMin = Math.min(axis, lo) - 2;
    return ask(
      [
        "The shaded rectangle is rotated about the dashed horizontal line. The volume of the solid is $k\\pi$. What is $k$?",
        "阴影矩形绕水平虚线旋转。立体的体积是 $k\\pi$。$k$ 是多少？",
      ],
      k,
      [
        length * (lo + h) * (lo + h) - length * lo * lo === k ? k + length : length * (lo + h) * (lo + h) - length * lo * lo,
        length * (far - near) * (far - near),
        length * far * far,
        2 * k,
      ],
      [
        `Measured from the line, the near edge is $${near}$ away and the far edge is $${far}$ away, and the rectangle has length $${length}$. So $k = ${length}(${far}^2 - ${near}^2) = ${k}$.`,
        `从这条线量起，近边距离 $${near}$，远边距离 $${far}$，矩形长度为 $${length}$。所以 $k = ${length}(${far}^2 - ${near}^2) = ${k}$。`,
      ],
      fig(
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
    );
  },
);

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

const polarEquation = point(
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
);

const polarBetween = point(
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
);

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

const radiusFromInterval = point(
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
);

const taylorSigns = point(
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
);

const averageValue = point(
  "the-average-value-of-a-drawn-function",
  ["The average value of a drawn function", "图中函数的平均值"],
  [
    "The average value of $f$ over an interval is its integral divided by the length of the interval. For a graph made of straight pieces, the integral is the signed area of trapezoids, with area below the axis counting as negative. The average is the height of a rectangle with the same base and area.",
    "$f$ 在区间上的平均值等于积分除以区间长度。对于由直线段组成的图，积分是梯形的带符号面积，轴下方的面积算作负值。平均值就是底相同、面积也相同的矩形的高。",
  ],
  (rng) => {
    const n = rng.pick([3, 4, 5, 6]);
    const heights = Array.from({ length: n + 1 }, () => rng.int(-2, 5));
    let doubled = 0;
    for (let i = 0; i < n; i++) doubled += (heights[i] as number) + (heights[i + 1] as number);
    const average = Q.of(doubled, 2 * n);
    const marks: PlaneMark[] = [{ kind: "path", points: heights.map((h, i): Point => [i, h]), accent: true }];
    return ask(
      [
        `What is the average value of the function drawn, over the whole interval it is drawn on?`,
        `图中函数在所画的整个区间上的平均值是多少？`,
      ],
      average,
      [
        Q.of(doubled, 2),
        Q.of(doubled, 2 * (n + 1)),
        Q.of(heights.reduce((u, v) => u + v, 0) + 1, n + 1),
        Q.of((heights[0] as number) + (heights[n] as number) + 1, 2),
      ],
      [
        `The signed area under the pieces is $${Q.of(doubled, 2).toLatex()}$, and the interval has length $${n}$. Dividing the area by the length gives $${average.toLatex()}$.`,
        `各段下方的带符号面积是 $${Q.of(doubled, 2).toLatex()}$，区间长度是 $${n}$。面积除以长度得到 $${average.toLatex()}$。`,
      ],
      fig({ xMin: -1, xMax: 7, yMin: -3, yMax: 6 }, marks, [
        `Straight pieces through the heights ${heights.join(", ")} at x = 0, 1, 2 and so on.`,
        `经过高度 ${heights.join("，")} 的直线段，横坐标依次为 0、1、2 等。`,
      ]),
    );
  },
);

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
