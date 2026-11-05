// More knowledge points of Multivariable Calculus that ask the learner to read a drawing: oriented paths, line
// integrals, Green's theorem, double integrals, level curves and mechanics. See
// `deeperFiguresMultivariableCalculus2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { drawn } from "./figure-reading-more.ts";

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView | number, marks: readonly PlaneMark[], [en, zh]: Pair) =>
  drawn(typeof v === "number" ? { xMin: -v, xMax: v, yMin: -v, yMax: v } : v, marks, t(en, zh));

const at = (p: Point) => `(${p[0]}, ${p[1]})`;
const dot = (u: Point, v: Point) => u[0] * v[0] + u[1] * v[1];
const cross = (u: Point, v: Point) => u[0] * v[1] - u[1] * v[0];
const paren = (v: number) => (v < 0 ? `(${v})` : `${v}`);

/** terms writes a sum of coefficient and variable pairs, leaving out zero terms. */
function terms(parts: readonly (readonly [number, string])[]): string {
  let out = "";
  for (const [c, name] of parts) {
    if (c === 0) continue;
    const size = Math.abs(c) === 1 && name ? "" : Math.abs(c);
    out += out ? ` ${c < 0 ? "-" : "+"} ${size}${name}` : `${c < 0 ? "-" : ""}${size}${name}`;
  }
  return out || "0";
}

/** piTimes writes the rational multiple n/d of pi. */
function piTimes(n: number, d = 1): string {
  const q = Q.of(n, d);
  const text = q.toLatex();
  if (text === "0") return "0";
  if (text === "1") return "\\pi";
  if (text === "-1") return "-\\pi";
  return `${text}\\pi`;
}

/** tripleLegs lists grid displacements of whole-number length, up to the signs of the coordinates. */
const tripleLegs: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 0, 5],
  [0, 5, 5],
  [6, 0, 6],
  [0, 6, 6],
];

/** signedLeg picks a displacement of whole-number length with random signs. */
function signedLeg(rng: Rng): [number, number, number] {
  const [p, q, r] = rng.pick(tripleLegs);
  return [rng.bool() ? p : -p, rng.bool() ? q : -q, r];
}

/** place picks a starting coordinate so that it and its shift by d stay within size of zero. */
const place = (rng: Rng, d: number, size: number) => rng.int(Math.max(-size, -size - d), Math.min(size, size - d));

/** rectangle lists the corners of a rectangle counterclockwise. */
const rectangle = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

/** gridRect picks a rectangle with whole-number corners inside the view from -6 to 6. */
function gridRect(rng: Rng) {
  const x0 = rng.int(-5, 2);
  const y0 = rng.int(-5, 2);
  const w = rng.int(1, Math.min(6, 6 - x0));
  const h = rng.int(1, Math.min(6, 6 - y0));
  return { x0, y0, x1: x0 + w, y1: y0 + h, w, h };
}

/** head draws a short arrow at a point along a direction, to show the orientation of a path. */
const head = (p: Point, d: Point): PlaneMark => {
  const size = Math.hypot(d[0], d[1]) || 1;
  const [ux, uy] = [(d[0] / size) * 0.7, (d[1] / size) * 0.7];
  return { kind: "arrow", from: [p[0] - ux, p[1] - uy], to: [p[0] + ux, p[1] + uy], accent: true };
};

const definingLine = point(
  "the-formula-of-a-drawn-oriented-segment",
  ["The formula of a drawn oriented segment", "所画有向线段的公式"],
  [
    "A segment that starts at $A$ at $t = 0$ and ends at $B$ at $t = 1$ is $r(t) = A + t(B - A)$, the start plus a multiple of the displacement.",
    "在 $t = 0$ 从 $A$ 出发、在 $t = 1$ 到达 $B$ 的线段是 $r(t) = A + t(B - A)$，即起点加上位移的倍数。",
  ],
  (rng) => {
    const nonzero = [-4, -3, -2, -1, 1, 2, 3, 4];
    const [dx, dy] = [rng.pick(nonzero), rng.pick(nonzero)];
    const A: Point = [place(rng, dx, 5), place(rng, dy, 5)];
    const B: Point = [A[0] + dx, A[1] + dy];
    const form = (x0: number, kx: number, y0: number, ky: number) =>
      same(
        `r(t) = \\left(${terms([
          [x0, ""],
          [kx, "t"],
        ])},\\ ${terms([
          [y0, ""],
          [ky, "t"],
        ])}\\right)`,
      );
    return choose(
      rng,
      [
        "Which function traces the drawn arrow from its tail at $t = 0$ to its tip at $t = 1$?",
        "哪个函数描出所画的箭头，$t = 0$ 时在箭尾，$t = 1$ 时在箭头？",
      ],
      form(A[0], dx, A[1], dy),
      [form(B[0], -dx, B[1], -dy), form(A[0], B[0], A[1], B[1]), form(A[0], dy, A[1], dx), form(A[0], -dx, A[1], -dy)],
      [
        `The arrow starts at $${at(A)}$ and its displacement is $(${dx}, ${dy})$, so $r(t) = ${at(A)} + t(${dx}, ${dy})$.`,
        `箭头从 $${at(A)}$ 出发，位移为 $(${dx}, ${dy})$，所以 $r(t) = ${at(A)} + t(${dx}, ${dy})$。`,
      ],
      fig(
        6,
        [{ kind: "arrow", from: A, to: B, accent: true }],
        [`An arrow from ${at(A)} to ${at(B)}.`, `从 ${at(A)} 到 ${at(B)} 的箭头。`],
      ),
    );
  },
);

const tangentSlope = point(
  "the-slope-at-a-marked-point-of-a-parametrized-curve",
  ["The slope at a marked point of a parametrized curve", "参数曲线上标记点处的斜率"],
  [
    "Find the parameter of the point from its coordinates. The tangent vector there is $r'(t)$, and the slope of the tangent line is $\\frac{y'(t)}{x'(t)}$.",
    "由坐标求出该点的参数。那里的切向量是 $r'(t)$，切线斜率为 $\\frac{y'(t)}{x'(t)}$。",
  ],
  (rng) => {
    const k = rng.pick([-3, -2, -1, 1, 2, 3]);
    const t0 = rng.pick([-3, -2, -1, 1, 2, 3].filter((v) => Math.abs(k * v) <= 9));
    const P: Point = [k * t0, t0 * t0];
    const answer = Q.of(2 * t0, k);
    const xt = terms([[k, "t"]]);
    return ask(
      [
        `The drawing shows the curve $r(t) = (${xt},\\ t^2)$ with a marked point $P$. Find the slope of the tangent line at $P$.`,
        `图中是曲线 $r(t) = (${xt},\\ t^2)$，标出了点 $P$。求 $P$ 处切线的斜率。`,
      ],
      answer,
      [Q.of(k, 2 * t0), Q.of(-2 * t0, k), 2 * t0, Q.of(t0, k)],
      [
        `$P = ${at(P)}$, so $${xt} = ${P[0]}$ gives $t = ${t0}$. Since $r'(t) = (${k},\\ 2t)$, the slope is $\\frac{2(${t0})}{${k}} = ${answer.toLatex()}$.`,
        `$P = ${at(P)}$，由 $${xt} = ${P[0]}$ 得 $t = ${t0}$。因为 $r'(t) = (${k},\\ 2t)$，斜率为 $\\frac{2(${t0})}{${k}} = ${answer.toLatex()}$。`,
      ],
      fig(
        { xMin: -10, xMax: 10, yMin: -2, yMax: 11, labelEvery: 2 },
        [
          { kind: "curve", f: (x) => (x / k) ** 2, accent: true },
          { kind: "point", at: P, label: "P", dir: "w" },
        ],
        [
          `An upward parabola with its vertex at the origin, with P marked at ${at(P)}.`,
          `顶点在原点、开口向上的抛物线，点 P 位于 ${at(P)}。`,
        ],
      ),
    );
  },
);

const curvatureVertex = point(
  "the-curvature-at-the-vertex-of-a-drawn-parabola",
  ["The curvature at the vertex of a drawn parabola", "所画抛物线顶点处的曲率"],
  [
    "For $y = ax^2$, the formula $\\kappa = \\frac{\\lvert y'' \\rvert}{(1 + (y')^2)^{3/2}}$ gives $\\kappa = 2\\lvert a \\rvert$ at the vertex, where $y' = 0$. The curve bends most sharply there, and a narrower parabola has a larger $\\lvert a \\rvert$. Find $a$ from a point of the graph.",
    "对 $y = ax^2$，公式 $\\kappa = \\frac{\\lvert y'' \\rvert}{(1 + (y')^2)^{3/2}}$ 在顶点处（$y' = 0$）给出 $\\kappa = 2\\lvert a \\rvert$。曲线在那里弯得最厉害，抛物线越窄，$\\lvert a \\rvert$ 越大。由图像上的一点求 $a$。",
  ],
  (rng) => {
    const k = rng.pick([1, 2, 3]);
    const height = rng.int(1, 8);
    const x = rng.bool() ? k : -k;
    const s = rng.bool() ? 1 : -1;
    const a = Q.of(s * height, k * k);
    const answer = Q.of(2 * height, k * k);
    const P: Point = [x, s * height];
    return ask(
      [
        `The drawn parabola has the form $y = ax^2$ and passes through the marked point. Find its curvature at the vertex.`,
        `所画的抛物线形如 $y = ax^2$，并过标记点。求它在顶点处的曲率。`,
      ],
      answer,
      [Q.of(height, k * k), Q.of(k * k, 2 * height), Q.of(4 * height, k * k), height],
      [
        `The point $${at(P)}$ gives $a = ${a.toLatex()}$. At the vertex $y' = 0$ and $\\lvert y'' \\rvert = 2\\lvert a \\rvert$, so $\\kappa = ${answer.toLatex()}$.`,
        `由点 $${at(P)}$ 得 $a = ${a.toLatex()}$。在顶点处 $y' = 0$，$\\lvert y'' \\rvert = 2\\lvert a \\rvert$，所以 $\\kappa = ${answer.toLatex()}$。`,
      ],
      fig(
        9,
        [
          { kind: "curve", f: (v) => (s * height * v * v) / (k * k), accent: true },
          { kind: "point", at: P },
        ],
        [`A parabola with its vertex at the origin through the marked point ${at(P)}.`, `顶点在原点、过标记点 ${at(P)} 的抛物线。`],
      ),
    );
  },
);

const conservativeField = point(
  "is-a-drawn-field-conservative",
  ["Is a drawn field conservative?", "所画的向量场是保守场吗？"],
  [
    "A field $(P, Q)$ on the plane is conservative exactly when $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$. A field that swirls around a point has circulation along a circle around it, so it cannot be conservative.",
    "平面上的场 $(P, Q)$ 是保守场当且仅当 $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$。绕一点旋转的场沿绕它的圆有环量，所以不可能是保守场。",
  ],
  (rng) => {
    const kind = rng.pick(["swirl", "swirl", "radial", "saddle", "shear"] as const);
    const a = rng.int(1, 3);
    const b = rng.int(1, 3);
    const flip = rng.bool() ? 1 : -1;
    const f = ((x: number, y: number): [number, number] => {
      if (kind === "swirl") return [-flip * a * y, flip * b * x];
      if (kind === "radial") return [flip * a * x, flip * b * y];
      if (kind === "saddle") return [flip * a * x, -flip * b * y];
      return [flip * a * y, flip * a * x];
    }) as (x: number, y: number) => [number, number];
    const [P, R] = {
      swirl: [terms([[-flip * a, "y"]]), terms([[flip * b, "x"]])],
      radial: [terms([[flip * a, "x"]]), terms([[flip * b, "y"]])],
      saddle: [terms([[flip * a, "x"]]), terms([[-flip * b, "y"]])],
      shear: [terms([[flip * a, "y"]]), terms([[flip * a, "x"]])],
    }[kind];
    const yes = kind !== "swirl";
    const curl = kind === "swirl" ? flip * (a + b) : 0;
    const scale = 0.5 / Math.max(a, b);
    const marks: PlaneMark[] = [];
    for (let x = -3; x <= 3; x++)
      for (let y = -3; y <= 3; y++) {
        const [u, v] = f(x, y);
        if (u !== 0 || v !== 0) marks.push({ kind: "arrow", from: [x, y], to: [x + scale * u, y + scale * v], accent: true, thin: true });
      }
    const zero: Pair = ["Yes, its curl is zero", "是，它的旋度为零"];
    const circulation: Pair = ["No, its circulation around a circle about the origin is not zero", "不是，它绕原点的圆上的环量不为零"];
    return choose(
      rng,
      [
        `The drawing shows the field $F = (P, Q)$, whose first component is $P = ${P}$. Is $F$ conservative?`,
        `图中是向量场 $F = (P, Q)$，它的第一个分量是 $P = ${P}$。$F$ 是保守场吗？`,
      ],
      yes ? zero : circulation,
      yes
        ? [
            circulation,
            ["No, its divergence is not zero", "不是，它的散度不为零"],
            ["No, its arrows are not all parallel", "不是，它的箭头并不都平行"],
          ]
        : [
            zero,
            ["Yes, its divergence is zero", "是，它的散度为零"],
            ["Yes, its arrows have the same length on each circle", "是，每个圆上的箭头长度相同"],
          ],
      [
        `The arrows show $Q = ${R}$, so $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curl}$.`,
        `由箭头得 $Q = ${R}$，所以 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curl}$。`,
      ],
      fig(4, marks, [`A vector field with arrows at the grid points, equal to (${P}, ${R}).`, `格点上带箭头的向量场，等于 (${P}, ${R})。`]),
    );
  },
);

const segmentIntegral = point(
  "a-scalar-line-integral-over-a-drawn-segment",
  ["A scalar line integral over a drawn segment", "所画线段上的标量线积分"],
  [
    "On a segment of length $L$, $ds = L\\,dt$ for $t$ from $0$ to $1$. For a linear function $f$, the integral of $f$ is $L$ times the value of $f$ at the midpoint.",
    "在长度为 $L$ 的线段上，$ds = L\\,dt$，$t$ 从 $0$ 到 $1$。对线性函数 $f$，积分等于 $L$ 乘以 $f$ 在中点的值。",
  ],
  (rng) => {
    const [dx, dy, L] = signedLeg(rng);
    const A: Point = [place(rng, dx, 9), place(rng, dy, 9)];
    const B: Point = [A[0] + dx, A[1] + dy];
    const m = rng.int(-3, 3);
    const n = rng.pick([-3, -2, -1, 1, 2, 3]);
    const c = rng.int(-4, 4);
    const f = ([x, y]: Point) => m * x + n * y + c;
    const mid = Q.of(f(A) + f(B), 2);
    const answer = Q.of(L * (f(A) + f(B)), 2);
    return ask(
      [
        `Let $f(x, y) = ${terms([
          [m, "x"],
          [n, "y"],
          [c, ""],
        ])}$. Find $\\int_C f\\,ds$ over the drawn segment $C$.`,
        `设 $f(x, y) = ${terms([
          [m, "x"],
          [n, "y"],
          [c, ""],
        ])}$。求所画线段 $C$ 上的 $\\int_C f\\,ds$。`,
      ],
      answer,
      [mid, Q.of(f(A) + f(B), 1), Q.of(L * f(B), 1), Q.of(L * L * (f(A) + f(B)), 2)],
      [
        `The ends are $${at(A)}$ and $${at(B)}$, so $L = ${L}$. At the midpoint $f = ${mid.toLatex()}$, which gives $${L} \\cdot ${mid.toLatex()} = ${answer.toLatex()}$.`,
        `端点为 $${at(A)}$ 和 $${at(B)}$，所以 $L = ${L}$。在中点 $f = ${mid.toLatex()}$，于是得 $${L} \\cdot ${mid.toLatex()} = ${answer.toLatex()}$。`,
      ],
      fig(
        { xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 },
        [
          { kind: "segment", a: A, b: B, accent: true },
          { kind: "point", at: A },
          { kind: "point", at: B },
        ],
        [`A segment from ${at(A)} to ${at(B)}.`, `从 ${at(A)} 到 ${at(B)} 的线段。`],
      ),
    );
  },
);

const circleIntegral = point(
  "a-scalar-line-integral-over-a-drawn-circle",
  ["A scalar line integral over a drawn circle", "所画圆上的标量线积分"],
  [
    "On a circle of radius $R$, $ds = R\\,d\\theta$. The cosine and sine terms integrate to zero over a full turn, so for a linear $f$ the integral is $2\\pi R$ times the value of $f$ at the center.",
    "在半径为 $R$ 的圆上，$ds = R\\,d\\theta$。余弦和正弦项在一整圈上积分为零，所以对线性函数 $f$，积分是 $2\\pi R$ 乘以 $f$ 在圆心的值。",
  ],
  (rng) => {
    const R = rng.int(1, 4);
    const cx = rng.int(-3, 3);
    const cy = rng.int(-3, 3);
    const m = rng.int(-3, 3);
    const n = rng.pick([-3, -2, -1, 1, 2, 3]);
    const c = rng.int(-3, 3);
    const center = m * cx + n * cy + c;
    const k = 2 * R * center;
    return ask(
      [
        `Let $f(x, y) = ${terms([
          [m, "x"],
          [n, "y"],
          [c, ""],
        ])}$. Over the drawn circle $C$, $\\oint_C f\\,ds = k\\pi$. Find $k$.`,
        `设 $f(x, y) = ${terms([
          [m, "x"],
          [n, "y"],
          [c, ""],
        ])}$。在所画的圆 $C$ 上，$\\oint_C f\\,ds = k\\pi$。求 $k$。`,
      ],
      k,
      [R * center, 2 * R * c, 2 * R * R * center, k + 2 * R],
      [
        `The center is $(${cx}, ${cy})$ and $R = ${R}$. There $f = ${center}$, so the integral is $2\\pi(${R})(${center}) = ${piTimes(k)}$.`,
        `圆心为 $(${cx}, ${cy})$，$R = ${R}$。那里 $f = ${center}$，所以积分为 $2\\pi(${R})(${center}) = ${piTimes(k)}$。`,
      ],
      fig(
        8,
        [{ kind: "circle", center: [cx, cy], r: R, accent: true }],
        [`A circle with center (${cx}, ${cy}) and radius ${R}.`, `圆心为 (${cx}, ${cy})、半径为 ${R} 的圆。`],
      ),
    );
  },
);

/** wiggle samples a curved path from A to B that bends by h to one side. */
function wiggle(A: Point, B: Point, h: number): Point[] {
  const [dx, dy] = [B[0] - A[0], B[1] - A[1]];
  const size = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / size, dx / size];
  return Array.from({ length: 41 }, (_, i) => {
    const s = i / 40;
    const bend = h * Math.sin(Math.PI * s);
    return [A[0] + s * dx + bend * nx, A[1] + s * dy + bend * ny] as Point;
  });
}

const potentialDifference = point(
  "work-along-a-wandering-path-from-its-endpoints",
  ["Work along a wandering path from its endpoints", "由端点求沿曲折路径的功"],
  [
    "If $F = \\nabla f$, then $\\int_C F \\cdot dr = f(B) - f(A)$ for a path from $A$ to $B$. The shape of the path plays no part, so only the two ends and the direction of travel are read from the drawing.",
    "若 $F = \\nabla f$，对从 $A$ 到 $B$ 的路径有 $\\int_C F \\cdot dr = f(B) - f(A)$。路径的形状不起作用，所以只需从图中读出两个端点和行进方向。",
  ],
  (rng) => {
    const a = rng.pick([-2, -1, 1, 2, 3]);
    const b = rng.pick([-2, -1, 1, 2, 3]);
    const form = rng.pick(["xy", "squares"] as const);
    const f = ([x, y]: Point) => (form === "xy" ? a * x * y + b * x : a * x * x + b * y * y);
    const tex =
      form === "xy"
        ? terms([
            [a, "xy"],
            [b, "x"],
          ])
        : terms([
            [a, "x^2"],
            [b, "y^2"],
          ]);
    const dx = rng.pick([-5, -4, -3, 3, 4, 5]);
    const dy = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const A: Point = [place(rng, dx, 5), place(rng, dy, 5)];
    const B: Point = [A[0] + dx, A[1] + dy];
    const path = wiggle(A, B, rng.pick([-2.5, -1.5, 1.5, 2.5]));
    const mid = path[20] as Point;
    const next = path[21] as Point;
    const answer = f(B) - f(A);
    return ask(
      [
        `$F = \\nabla f$ with $f(x, y) = ${tex}$. Find $\\int_C F \\cdot dr$ along the drawn path $C$ in the direction of its arrow.`,
        `$F = \\nabla f$，其中 $f(x, y) = ${tex}$。沿所画路径 $C$ 按箭头方向求 $\\int_C F \\cdot dr$。`,
      ],
      answer,
      [-answer, f(B) + f(A), f(B), f(A)],
      [
        `The path runs from $${at(A)}$ to $${at(B)}$, so the integral is $f${at(B)} - f${at(A)} = ${f(B)} - ${paren(f(A))} = ${answer}$.`,
        `路径从 $${at(A)}$ 到 $${at(B)}$，所以积分为 $f${at(B)} - f${at(A)} = ${f(B)} - ${paren(f(A))} = ${answer}$。`,
      ],
      fig(
        8,
        [
          { kind: "path", points: path, accent: true },
          head(mid, [next[0] - mid[0], next[1] - mid[1]]),
          { kind: "point", at: A },
          { kind: "point", at: B },
        ],
        [
          `A curved path from ${at(A)} to ${at(B)} with an arrow pointing toward ${at(B)}.`,
          `从 ${at(A)} 到 ${at(B)} 的曲线路径，箭头指向 ${at(B)}。`,
        ],
      ),
    );
  },
);

const pathIndependence = point(
  "comparing-two-drawn-paths-in-a-conservative-field",
  ["Comparing two drawn paths in a conservative field", "比较保守场中的两条所画路径"],
  [
    "In a conservative field the integral depends only on the ends of the path and their order. Paths with the same start and the same end give equal integrals, and reversing a path changes the sign.",
    "在保守场中，积分只取决于路径的端点及其顺序。起点和终点相同的路径积分相等，反转路径改变符号。",
  ],
  (rng) => {
    const dx = rng.pick([-6, -5, -4, 4, 5, 6]);
    const dy = rng.int(-3, 3);
    const A: Point = [place(rng, dx, 5), place(rng, dy, 3)];
    const B: Point = [A[0] + dx, A[1] + dy];
    const value = rng.pick([-11, -9, -7, -5, -3, -2, 2, 3, 5, 7, 9, 11]);
    const same2 = rng.bool();
    const upper = wiggle(A, B, 2.5);
    const lower = wiggle(A, B, -2.5);
    const second = same2 ? lower : [...lower].reverse();
    const m1 = upper[20] as Point;
    const m1n = upper[21] as Point;
    const m2 = second[20] as Point;
    const m2n = second[21] as Point;
    const answer = same2 ? value : -value;
    return ask(
      [
        `$F$ is a conservative field and $\\int_{C_1} F \\cdot dr = ${value}$. Find $\\int_{C_2} F \\cdot dr$, with each path taken in the direction of its arrow.`,
        `$F$ 是保守场，$\\int_{C_1} F \\cdot dr = ${value}$。求 $\\int_{C_2} F \\cdot dr$，每条路径按箭头方向。`,
      ],
      answer,
      [-answer, 0, 2 * value],
      same2
        ? ["Both paths run from the same start to the same end, so the integrals are equal.", "两条路径的起点和终点都相同，所以积分相等。"]
        : [
            "The paths join the same two points in opposite directions, so the integrals have opposite signs.",
            "两条路径以相反方向连接相同的两点，所以积分符号相反。",
          ],
      fig(
        9,
        [
          { kind: "path", points: upper, accent: true },
          { kind: "path", points: lower, accent: true, dashed: true },
          head(m1, [m1n[0] - m1[0], m1n[1] - m1[1]]),
          head(m2, [m2n[0] - m2[0], m2n[1] - m2[1]]),
          { kind: "label", at: m1, text: "C1", dir: "n" },
          { kind: "label", at: m2, text: "C2", dir: "s" },
          { kind: "point", at: A },
          { kind: "point", at: B },
        ],
        [
          `Two curved paths between ${at(A)} and ${at(B)}: C1, solid, runs to ${at(B)}, and C2, dashed, runs to ${same2 ? at(B) : at(A)}.`,
          `${at(A)} 和 ${at(B)} 之间的两条曲线路径：实线 C1 通向 ${at(B)}，虚线 C2 通向 ${same2 ? at(B) : at(A)}。`,
        ],
      ),
    );
  },
);

/** orientedRect draws a rectangle with an arrow on its bottom side that shows its orientation. */
const orientedRect = (r: ReturnType<typeof gridRect>, counter: boolean): PlaneMark[] => [
  { kind: "polygon", points: rectangle(r.x0, r.y0, r.x1, r.y1) },
  { kind: "path", points: [...rectangle(r.x0, r.y0, r.x1, r.y1), [r.x0, r.y0]], accent: true },
  head([(r.x0 + r.x1) / 2, r.y0], [counter ? 1 : -1, 0]),
];

const greenCirculation = point(
  "circulation-around-a-drawn-oriented-rectangle",
  ["Circulation around a drawn oriented rectangle", "沿所画有向矩形的环量"],
  [
    "Green's theorem gives $\\oint_C F \\cdot dr = \\iint_R \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$ for a counterclockwise boundary, turning a sum around the edge into a sum over the inside. A clockwise boundary changes the sign.",
    "格林定理对逆时针边界给出 $\\oint_C F \\cdot dr = \\iint_R \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$，把沿边界的求和变成区域内部的求和。顺时针边界改变符号。",
  ],
  (rng) => {
    const r = gridRect(rng);
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3]);
    const counter = rng.bool();
    const curl = a + b;
    const area = r.w * r.h;
    const answer = (counter ? 1 : -1) * curl * area;
    return ask(
      [
        `Let $F = (${terms([[-a, "y"]])},\\ ${terms([[b, "x"]])})$. Find $\\oint_C F \\cdot dr$ around the drawn rectangle in the direction of its arrow.`,
        `设 $F = (${terms([[-a, "y"]])},\\ ${terms([[b, "x"]])})$。沿所画矩形按箭头方向求 $\\oint_C F \\cdot dr$。`,
      ],
      answer,
      [-answer, curl, 2 * (r.w + r.h) * curl, (b - a) * area],
      [
        `The curl is $${b} - ${paren(-a)} = ${curl}$ and the area is $${r.w} \\cdot ${r.h} = ${area}$. The arrow runs ${counter ? "counterclockwise" : "clockwise"}, so the result is $${answer}$.`,
        `旋度为 $${b} - ${paren(-a)} = ${curl}$，面积为 $${r.w} \\cdot ${r.h} = ${area}$。箭头是${counter ? "逆时针" : "顺时针"}方向，所以结果为 $${answer}$。`,
      ],
      fig(7, orientedRect(r, counter), [
        `A rectangle from (${r.x0}, ${r.y0}) to (${r.x1}, ${r.y1}) with an arrow going ${counter ? "counterclockwise" : "clockwise"}.`,
        `从 (${r.x0}, ${r.y0}) 到 (${r.x1}, ${r.y1}) 的矩形，箭头为${counter ? "逆时针" : "顺时针"}方向。`,
      ]),
    );
  },
);

const greenHole = point(
  "greens-theorem-on-a-drawn-frame-with-a-hole",
  ["Green's theorem on a drawn frame with a hole", "所画带洞框架上的格林定理"],
  [
    "For a region with a hole, the boundary is the outer curve taken counterclockwise and the inner curve taken clockwise, so that the region stays on the left. Green's theorem then applies to the area of the region without the hole.",
    "对带洞区域，边界是逆时针的外曲线和顺时针的内曲线，使区域总在左侧。格林定理于是作用在去掉洞后的面积上。",
  ],
  (rng) => {
    const w = rng.int(5, 10);
    const h = rng.int(5, 10);
    const x0 = rng.int(-6, 6 - w);
    const y0 = rng.int(-6, 6 - h);
    const iw = rng.int(1, w - 2);
    const ih = rng.int(1, h - 2);
    const ix = x0 + rng.int(1, w - iw - 1);
    const iy = y0 + rng.int(1, h - ih - 1);
    const c = rng.pick([-4, -3, -2, 2, 3, 4, 5]);
    const area = w * h - iw * ih;
    const answer = c * area;
    return ask(
      [
        `Let $F = (0,\\ ${terms([[c, "x"]])})$, and let $R$ be the shaded frame. Find $\\oint_{\\partial R} F \\cdot dr$, with the boundary oriented so that $R$ stays on the left.`,
        `设 $F = (0,\\ ${terms([[c, "x"]])})$，$R$ 是阴影框架。求 $\\oint_{\\partial R} F \\cdot dr$，边界的方向使 $R$ 总在左侧。`,
      ],
      answer,
      [c * w * h, c * (w * h + iw * ih), c * iw * ih, area],
      [
        `The curl is $${c}$. The outer rectangle has area $${w * h}$ and the hole has area $${iw * ih}$, so $R$ has area $${area}$ and the integral is $${answer}$.`,
        `旋度为 $${c}$。外矩形面积为 $${w * h}$，洞面积为 $${iw * ih}$，所以 $R$ 的面积为 $${area}$，积分为 $${answer}$。`,
      ],
      fig(
        7,
        [
          {
            kind: "polygon",
            points: [
              ...rectangle(x0, y0, x0 + w, y0 + h),
              [x0, y0],
              [ix, iy],
              ...rectangle(ix, iy, ix + iw, iy + ih).reverse(),
              [ix, iy],
              [x0, y0],
            ],
          },
          { kind: "path", points: [...rectangle(x0, y0, x0 + w, y0 + h), [x0, y0]], accent: true },
          { kind: "path", points: [...rectangle(ix, iy, ix + iw, iy + ih), [ix, iy]], accent: true },
        ],
        [
          `A rectangle from (${x0}, ${y0}) to (${x0 + w}, ${y0 + h}) with a rectangular hole from (${ix}, ${iy}) to (${ix + iw}, ${iy + ih}).`,
          `从 (${x0}, ${y0}) 到 (${x0 + w}, ${y0 + h}) 的矩形，内有从 (${ix}, ${iy}) 到 (${ix + iw}, ${iy + ih}) 的矩形洞。`,
        ],
      ),
    );
  },
);

const fluxSegment = point(
  "flux-of-a-constant-field-across-a-drawn-segment",
  ["Flux of a constant field across a drawn segment", "常向量场穿过所画线段的通量"],
  [
    "With the normal pointing to the right of the direction of travel, $n\\,ds = (dy, -dx)$. For a constant field $(a, b)$ on a segment with displacement $(\\Delta x, \\Delta y)$, the flux is $a\\,\\Delta y - b\\,\\Delta x$.",
    "法向量指向行进方向的右侧时，$n\\,ds = (dy, -dx)$。对位移为 $(\\Delta x, \\Delta y)$ 的线段上的常向量场 $(a, b)$，通量为 $a\\,\\Delta y - b\\,\\Delta x$。",
  ],
  (rng) => {
    const [dx, dy] = rng.pick<Point>([
      [3, 1],
      [1, 3],
      [2, -3],
      [-3, 2],
      [4, 2],
      [-2, 4],
      [5, 0],
      [0, 5],
      [-4, -1],
      [-1, -4],
      [0, -4],
      [-3, 0],
    ]);
    const A: Point = [place(rng, dx, 5), place(rng, dy, 5)];
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3]);
    const answer = a * dy - b * dx;
    return ask(
      [
        `Find the flux of the constant field $F = (${a}, ${b})$ across the drawn arrow, with the normal pointing to the right of the arrow's direction.`,
        `求常向量场 $F = (${a}, ${b})$ 穿过所画箭头的通量，法向量指向箭头方向的右侧。`,
      ],
      answer,
      [-answer, a * dx + b * dy, b * dx - a * dy + 1, a * dy + b * dx],
      [
        `The displacement is $(${dx}, ${dy})$, so the flux is $(${a})(${dy}) - (${b})(${dx}) = ${answer}$.`,
        `位移为 $(${dx}, ${dy})$，所以通量为 $(${a})(${dy}) - (${b})(${dx}) = ${answer}$。`,
      ],
      fig(
        6,
        [{ kind: "arrow", from: A, to: [A[0] + dx, A[1] + dy], accent: true }],
        [`An arrow from ${at(A)} to ${at([A[0] + dx, A[1] + dy])}.`, `从 ${at(A)} 到 ${at([A[0] + dx, A[1] + dy])} 的箭头。`],
      ),
    );
  },
);

const greenFlux = point(
  "outward-flux-across-a-drawn-boundary",
  ["Outward flux across a drawn boundary", "穿出所画边界的通量"],
  [
    "The flux form of Green's theorem says the outward flux across a closed curve is the integral of the divergence over the region inside. When the divergence is constant, that is the divergence times the area.",
    "格林定理的通量形式指出，穿出闭曲线的通量是散度在内部区域上的积分。散度为常数时，就是散度乘以面积。",
  ],
  (rng) => {
    const a = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const triangle = rng.bool();
    const w = rng.int(2, 7);
    const h = rng.int(2, 7);
    const x0 = rng.int(-6, 6 - w);
    const y0 = rng.int(-6, 6 - h);
    const points: Point[] = triangle
      ? [
          [x0, y0],
          [x0 + w, y0],
          [x0, y0 + h],
        ]
      : rectangle(x0, y0, x0 + w, y0 + h);
    const area = Q.of(triangle ? w * h : 2 * w * h, 2);
    const answer = Q.of((a + b) * (triangle ? w * h : 2 * w * h), 2);
    return ask(
      [
        `Let $F = (${terms([[a, "x"]])},\\ ${terms([[b, "y"]])})$. Find the outward flux of $F$ across the boundary of the shaded region.`,
        `设 $F = (${terms([[a, "x"]])},\\ ${terms([[b, "y"]])})$。求 $F$ 穿出阴影区域边界的通量。`,
      ],
      answer,
      [Q.of(-(a + b) * (triangle ? w * h : 2 * w * h), 2), Q.of((a - b) * (triangle ? w * h : 2 * w * h), 2), area, a + b],
      [
        `The divergence is $${a} + ${paren(b)} = ${a + b}$ and the area is $${area.toLatex()}$, so the flux is $${answer.toLatex()}$.`,
        `散度为 $${a} + ${paren(b)} = ${a + b}$，面积为 $${area.toLatex()}$，所以通量为 $${answer.toLatex()}$。`,
      ],
      fig(
        7,
        [
          { kind: "polygon", points },
          { kind: "path", points: [...points, points[0] as Point], accent: true },
        ],
        [
          `A shaded ${triangle ? "triangle" : "rectangle"} with corners ${points.map(at).join(", ")}.`,
          `阴影${triangle ? "三角形" : "矩形"}，顶点为 ${points.map(at).join("、")}。`,
        ],
      ),
    );
  },
);

const doubleRect = point(
  "a-double-integral-over-a-drawn-rectangle",
  ["A double integral over a drawn rectangle", "所画矩形上的二重积分"],
  [
    "Over a rectangle, the integral of a linear function equals the area times the value at the center, because the terms that change sign around the center cancel.",
    "在矩形上，线性函数的积分等于面积乘以中心处的值，因为围绕中心变号的项互相抵消。",
  ],
  (rng) => {
    const r = gridRect(rng);
    const m = rng.int(-3, 3);
    const n = rng.pick([-3, -2, -1, 1, 2, 3]);
    const c = rng.int(-3, 3);
    const area = r.w * r.h;
    const center = Q.of(m * (r.x0 + r.x1) + n * (r.y0 + r.y1) + 2 * c, 2);
    const answer = Q.of(area * (m * (r.x0 + r.x1) + n * (r.y0 + r.y1) + 2 * c), 2);
    return ask(
      [
        `Find $\\iint_R (${terms([
          [m, "x"],
          [n, "y"],
          [c, ""],
        ])})\\,dA$ over the drawn rectangle $R$.`,
        `求所画矩形 $R$ 上的 $\\iint_R (${terms([
          [m, "x"],
          [n, "y"],
          [c, ""],
        ])})\\,dA$。`,
      ],
      answer,
      [center, area, Q.of(area * (m * (r.x0 + r.x1) + n * (r.y0 + r.y1)), 2), Q.of(area * (m * r.x1 + n * r.y1 + c), 1)],
      [
        `The area is $${area}$ and the center is $\\left(${Q.of(r.x0 + r.x1, 2).toLatex()}, ${Q.of(r.y0 + r.y1, 2).toLatex()}\\right)$, where the function equals $${center.toLatex()}$. The product is $${answer.toLatex()}$.`,
        `面积为 $${area}$，中心为 $\\left(${Q.of(r.x0 + r.x1, 2).toLatex()}, ${Q.of(r.y0 + r.y1, 2).toLatex()}\\right)$，函数在那里等于 $${center.toLatex()}$。乘积为 $${answer.toLatex()}$。`,
      ],
      fig(
        7,
        [{ kind: "polygon", points: rectangle(r.x0, r.y0, r.x1, r.y1) }],
        [`A shaded rectangle from (${r.x0}, ${r.y0}) to (${r.x1}, ${r.y1}).`, `从 (${r.x0}, ${r.y0}) 到 (${r.x1}, ${r.y1}) 的阴影矩形。`],
      ),
    );
  },
);

const typeTwoLimits = point(
  "type-ii-limits-of-a-drawn-triangle",
  ["Type II limits of a drawn triangle", "所画三角形的 II 型积分限"],
  [
    "For a type II description, fix $y$ and read the horizontal slice: its left end and right end, written as functions of $y$, are the inner limits, and the range of $y$ gives the outer limits.",
    "II 型描述中，固定 $y$，读水平截线：它的左端和右端写成 $y$ 的函数就是内层积分限，$y$ 的范围给出外层积分限。",
  ],
  (rng) => {
    const a = rng.int(2, 7);
    const b = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== a));
    const right = rng.bool();
    const slope = Q.of(a, b).toLatex();
    const edge = `${slope}y`;
    const form = (lo: string, hi: string, top: string) => same(`\\int_0^{${top}} \\int_{${lo}}^{${hi}} f(x, y)\\,dx\\,dy`);
    const points: Point[] = right
      ? [
          [0, 0],
          [a, 0],
          [a, b],
        ]
      : [
          [0, 0],
          [0, b],
          [a, b],
        ];
    const correct = right ? form(edge, String(a), String(b)) : form("0", edge, String(b));
    const wrongEdge = `${Q.of(b, a).toLatex()}y`;
    return choose(
      rng,
      ["Which iterated integral, with $x$ inside, covers the shaded triangle?", "哪个累次积分（$x$ 在内层）覆盖阴影三角形？"],
      correct,
      right
        ? [form("0", edge, String(b)), form(edge, String(a), String(a)), form(wrongEdge, String(a), String(b))]
        : [form(edge, String(a), String(b)), form("0", edge, String(a)), form("0", wrongEdge, String(b))],
      [
        `The slanted side joins $(0, 0)$ and $(${a}, ${b})$, so on it $x = ${edge}$. A horizontal slice at height $y$ runs ${right ? `from that side to $x = ${a}$` : "from $x = 0$ to that side"}, with $y$ from $0$ to $${b}$.`,
        `斜边连接 $(0, 0)$ 和 $(${a}, ${b})$，所以斜边上 $x = ${edge}$。高度 $y$ 处的水平截线${right ? `从斜边到 $x = ${a}$` : "从 $x = 0$ 到斜边"}，$y$ 从 $0$ 到 $${b}$。`,
      ],
      fig(
        { xMin: -1, xMax: 8, yMin: -1, yMax: 8 },
        [{ kind: "polygon", points }],
        [`A shaded triangle with corners ${points.map(at).join(", ")}.`, `阴影三角形，顶点为 ${points.map(at).join("、")}。`],
      ),
    );
  },
);

const partitioned = point(
  "a-double-integral-over-a-drawn-l-shape",
  ["A double integral over a drawn L-shape", "所画 L 形上的二重积分"],
  [
    "Cut the region into rectangles and add the integrals over the pieces. On a rectangle from $x = 0$ to $x = w$ of height $h$, the integral of $x$ is $h \\cdot \\frac{w^2}{2}$.",
    "把区域切成矩形，再把各块上的积分相加。在从 $x = 0$ 到 $x = w$、高为 $h$ 的矩形上，$x$ 的积分为 $h \\cdot \\frac{w^2}{2}$。",
  ],
  (rng) => {
    const w = rng.int(3, 7);
    const narrow = rng.int(1, w - 1);
    const low = rng.int(1, 4);
    const high = low + rng.int(1, 4);
    const useX = rng.bool();
    const k = rng.int(2, 5);
    const points: Point[] = [
      [0, 0],
      [w, 0],
      [w, low],
      [narrow, low],
      [narrow, high],
      [0, high],
    ];
    const area = w * low + narrow * (high - low);
    const moment = Q.of(low * w * w + (high - low) * narrow * narrow, 2);
    const answer = useX ? moment : Q.of(k * area, 1);
    const prompt = useX ? "x" : String(k);
    return ask(
      [`Find $\\iint_R ${prompt}\\,dA$ over the shaded region $R$.`, `求阴影区域 $R$ 上的 $\\iint_R ${prompt}\\,dA$。`],
      answer,
      useX
        ? [Q.of(high * w * w, 2), Q.of(area, 1), Q.of(low * w * w, 2), Q.of(area * w, 2)]
        : [Q.of(k * w * high, 1), Q.of(area, 1), Q.of(k * w * low, 1), Q.of(k * (w + high), 1)],
      useX
        ? [
            `Cut along $y = ${low}$. The lower piece gives $${low} \\cdot \\frac{${w * w}}{2}$ and the upper piece gives $${high - low} \\cdot \\frac{${narrow * narrow}}{2}$, with sum $${moment.toLatex()}$.`,
            `沿 $y = ${low}$ 切开。下面一块得 $${low} \\cdot \\frac{${w * w}}{2}$，上面一块得 $${high - low} \\cdot \\frac{${narrow * narrow}}{2}$，和为 $${moment.toLatex()}$。`,
          ]
        : [
            `Cut along $y = ${low}$. The pieces have areas $${w * low}$ and $${narrow * (high - low)}$, so the area is $${area}$ and the integral is $${k} \\cdot ${area} = ${k * area}$.`,
            `沿 $y = ${low}$ 切开。两块面积为 $${w * low}$ 和 $${narrow * (high - low)}$，所以面积为 $${area}$，积分为 $${k} \\cdot ${area} = ${k * area}$。`,
          ],
      fig(
        { xMin: -1, xMax: 8, yMin: -1, yMax: 9 },
        [{ kind: "polygon", points }],
        [`A shaded L-shape with corners ${points.map(at).join(", ")}.`, `阴影 L 形，顶点为 ${points.map(at).join("、")}。`],
      ),
    );
  },
);

const polarArea = point(
  "the-area-of-a-drawn-piece-of-a-ring",
  ["The area of a drawn piece of a ring", "所画圆环一部分的面积"],
  [
    "In polar coordinates $dA = r\\,dr\\,d\\theta$, so a piece of a ring with radii $a < b$ and angle $\\Delta\\theta$ has area $\\int \\int_a^b r\\,dr\\,d\\theta = \\frac{1}{2}\\Delta\\theta\\,(b^2 - a^2)$. The factor $r$ appears because a small polar patch gets wider the farther it lies from the origin.",
    "极坐标下 $dA = r\\,dr\\,d\\theta$，所以半径 $a < b$、角度 $\\Delta\\theta$ 的一段圆环面积为 $\\int \\int_a^b r\\,dr\\,d\\theta = \\frac{1}{2}\\Delta\\theta\\,(b^2 - a^2)$。出现因子 $r$，是因为极坐标的小块离原点越远就越宽。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = rng.int(a + 1, 6);
    const start = rng.int(0, 3);
    const quarters = rng.int(1, 3);
    const from = (start * Math.PI) / 2;
    const to = from + (quarters * Math.PI) / 2;
    const ring: Point[] = [];
    for (let i = 0; i <= 48; i++) {
      const s = from + ((to - from) * i) / 48;
      ring.push([b * Math.cos(s), b * Math.sin(s)]);
    }
    for (let i = 48; i >= 0; i--) {
      const s = from + ((to - from) * i) / 48;
      ring.push([a * Math.cos(s), a * Math.sin(s)]);
    }
    const n = quarters * (b * b - a * a);
    const answer = Q.of(n, 4);
    return ask(
      ["The area of the shaded region is $k\\pi$. Find $k$.", "阴影区域的面积为 $k\\pi$。求 $k$。"],
      answer,
      [Q.of(quarters * (b - a) * (b - a), 4), Q.of(n, 2), Q.of(quarters * b * b, 4), Q.of(quarters * (b - a), 4)],
      [
        `The radii are $${a}$ and $${b}$ and the angle is $${piTimes(quarters, 2)}$, so the area is $\\frac{1}{2} \\cdot ${piTimes(quarters, 2)} \\cdot (${b * b} - ${a * a}) = ${piTimes(n, 4)}$.`,
        `半径为 $${a}$ 和 $${b}$，角度为 $${piTimes(quarters, 2)}$，所以面积为 $\\frac{1}{2} \\cdot ${piTimes(quarters, 2)} \\cdot (${b * b} - ${a * a}) = ${piTimes(n, 4)}$。`,
      ],
      fig(
        7,
        [{ kind: "polygon", points: ring }],
        [
          `A shaded piece of a ring about the origin, between radii ${a} and ${b}, covering ${quarters} quarter turn${quarters === 1 ? "" : "s"}.`,
          `绕原点的一段阴影圆环，半径在 ${a} 和 ${b} 之间，占 ${quarters} 个四分之一圈。`,
        ],
      ),
    );
  },
);

const cylindricalPoint = point(
  "cylindrical-coordinates-of-a-drawn-point",
  ["Cylindrical coordinates of a drawn point", "所画点的柱坐标"],
  [
    "The coordinates $r$ and $\\theta$ describe the shadow of the point in the $xy$-plane: $r$ is its distance from the origin and $\\theta$ is its angle from the positive $x$-axis. The coordinate $z$ does not change.",
    "坐标 $r$ 和 $\\theta$ 描述点在 $xy$ 平面上的投影：$r$ 是它到原点的距离，$\\theta$ 是它与 $x$ 轴正方向的夹角。坐标 $z$ 不变。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const z = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
    const octant = rng.int(0, 7);
    const dirs: Point[] = [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ];
    const d = dirs[octant] as Point;
    const P: Point = [a * d[0], a * d[1]];
    const diagonal = octant % 2 === 1;
    const r = diagonal ? `${a === 1 ? "" : a}\\sqrt{2}` : String(a);
    const coordinates = (rr: string, n: number) => same(`(r, \\theta, z) = \\left(${rr},\\ ${piTimes(n, 4)},\\ ${z}\\right)`);
    return choose(
      rng,
      [
        `The drawing shows the $xy$-plane and the shadow $P$ of a point whose height is $z = ${z}$. What are its cylindrical coordinates, with $0 \\le \\theta < 2\\pi$?`,
        `图中是 $xy$ 平面，$P$ 是一个高度为 $z = ${z}$ 的点的投影。它的柱坐标是什么（$0 \\le \\theta < 2\\pi$）？`,
      ],
      coordinates(r, octant),
      [
        coordinates(r, (octant + 4) % 8),
        coordinates(r, (8 - octant) % 8 === octant ? (octant + 2) % 8 : (8 - octant) % 8),
        coordinates(diagonal ? String(2 * a) : `${a}\\sqrt{2}`, octant),
        coordinates(r, (octant + 2) % 8),
      ],
      [
        `$P = ${at(P)}$, so $r = \\sqrt{${P[0] * P[0]} + ${P[1] * P[1]}} = ${r}$ and the angle from the positive $x$-axis is $${piTimes(octant, 4)}$.`,
        `$P = ${at(P)}$，所以 $r = \\sqrt{${P[0] * P[0]} + ${P[1] * P[1]}} = ${r}$，与 $x$ 轴正方向的夹角为 $${piTimes(octant, 4)}$。`,
      ],
      fig(
        6,
        [
          { kind: "segment", a: [0, 0], b: P, dashed: true },
          { kind: "point", at: P, label: "P", dir: "n" },
        ],
        [`The point P at ${at(P)} joined to the origin by a dashed segment.`, `点 P 位于 ${at(P)}，用虚线与原点相连。`],
      ),
    );
  },
);

const partialSlope = point(
  "a-partial-derivative-from-a-drawn-slice",
  ["A partial derivative from a drawn slice", "由所画截线读偏导数"],
  [
    "Holding $y$ fixed slices the surface into a curve in the $xz$-plane. The partial derivative in $x$ is the slope of the tangent to that curve, read as rise over run.",
    "固定 $y$ 把曲面截成 $xz$ 平面上的曲线。对 $x$ 的偏导数就是这条曲线切线的斜率，用纵向变化除以横向变化读出。",
  ],
  (rng) => {
    const [rise, run] = rng.pick<[number, number]>([
      [1, 1],
      [1, 2],
      [2, 1],
      [3, 2],
      [2, 3],
      [1, 3],
      [3, 1],
      [-1, 1],
      [-1, 2],
      [-2, 1],
      [-3, 2],
      [-2, 3],
      [-1, 3],
    ]);
    const x0 = rng.int(-3, 2);
    const y0 = rng.int(-3, 3);
    const z0 = rng.int(-1, 2);
    const s = rise / run;
    const bend = rng.pick([-0.25, -0.15, 0.15, 0.25]);
    const answer = Q.of(rise, run);
    const P: Point = [x0, z0];
    const R: Point = [x0 + run, z0 + rise];
    return ask(
      [
        `The solid curve is the slice of $z = f(x, y)$ at $y = ${y0}$, and the dashed line is its tangent at the marked point, with $x = ${x0}$. Find $\\frac{\\partial f}{\\partial x}(${x0}, ${y0})$.`,
        `实线是 $z = f(x, y)$ 在 $y = ${y0}$ 处的截线，虚线是它在标记点（$x = ${x0}$）处的切线。求 $\\frac{\\partial f}{\\partial x}(${x0}, ${y0})$。`,
      ],
      answer,
      [Q.of(run, rise), Q.of(-rise, run), z0, y0 === 0 ? x0 : y0],
      [
        `The tangent passes through $${at(P)}$ and $${at(R)}$, so its slope is $${answer.toLatex()}$.`,
        `切线过 $${at(P)}$ 和 $${at(R)}$，所以斜率为 $${answer.toLatex()}$。`,
      ],
      fig(
        { xMin: -6, xMax: 6, yMin: -6, yMax: 6, yName: "z" },
        [
          { kind: "curve", f: (x) => z0 + s * (x - x0) + bend * (x - x0) ** 2, accent: true },
          { kind: "line", a: P, b: R, dashed: true },
          { kind: "point", at: P },
          { kind: "point", at: R, open: true },
        ],
        [
          `A curve in the xz-plane with a dashed tangent at ${at(P)} that also passes through ${at(R)}.`,
          `xz 平面上的曲线，${at(P)} 处的虚线切线还过 ${at(R)}。`,
        ],
      ),
    );
  },
);

const directionalFromArrows = point(
  "a-directional-derivative-from-two-drawn-arrows",
  ["A directional derivative from two drawn arrows", "由两个所画箭头求方向导数"],
  [
    "The directional derivative along $d$ uses the unit vector: $D_u f = \\nabla f \\cdot \\frac{d}{\\lVert d \\rVert}$. Forgetting to divide by the length is the usual mistake.",
    "沿 $d$ 的方向导数用单位向量：$D_u f = \\nabla f \\cdot \\frac{d}{\\lVert d \\rVert}$。忘记除以长度是常见错误。",
  ],
  (rng) => {
    const [p, q, L] = rng.pick<[number, number, number]>([
      [3, 4, 5],
      [4, 3, 5],
      [5, 0, 5],
      [0, 5, 5],
      [2, 0, 2],
      [0, 3, 3],
    ]);
    const d: Point = [rng.bool() ? p : -p, rng.bool() ? q : -q];
    const g: Point = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
    const product = dot(g, d);
    const answer = Q.of(product, L);
    return ask(
      [
        `At a point, the arrows show $\\nabla f$ and a direction $d$. Find the directional derivative of $f$ in the direction of $d$.`,
        `在某点处，箭头表示 $\\nabla f$ 和方向 $d$。求 $f$ 沿 $d$ 方向的方向导数。`,
      ],
      answer,
      [product, Q.of(product, L * L), Q.of(-product, L), Q.of(cross(g, d), L)],
      [
        `$\\nabla f = ${at(g)}$ and $d = ${at(d)}$, with $\\lVert d \\rVert = ${L}$, so the derivative is $\\frac{${product}}{${L}} = ${answer.toLatex()}$.`,
        `$\\nabla f = ${at(g)}$，$d = ${at(d)}$，$\\lVert d \\rVert = ${L}$，所以方向导数为 $\\frac{${product}}{${L}} = ${answer.toLatex()}$。`,
      ],
      fig(
        6,
        [
          { kind: "arrow", from: [0, 0], to: g, accent: true },
          { kind: "label", at: g, text: "∇f", dir: "n" },
          { kind: "arrow", from: [0, 0], to: d },
          { kind: "label", at: d, text: "d", dir: "s" },
        ],
        [`Arrows from the origin: the gradient to ${at(g)} and d to ${at(d)}.`, `从原点出发的箭头：梯度指向 ${at(g)}，d 指向 ${at(d)}。`],
      ),
    );
  },
);

const criticalKind = point(
  "the-kind-of-critical-point-from-labeled-level-curves",
  ["The kind of critical point from labeled level curves", "由带标注的等值线判断临界点类型"],
  [
    "Closed level curves around a point mean a local extremum: a minimum if the values grow outward, a maximum if they fall outward. Curves that open away from the point like hyperbolas, with values above on one axis and below on the other, mean a saddle.",
    "围绕一点的闭合等值线表示局部极值：数值向外增大是极小值，向外减小是极大值。像双曲线一样分开、一条轴上数值较大而另一条轴上较小的等值线表示鞍点。",
  ],
  (rng) => {
    const kind = rng.pick(["min", "max", "saddle"] as const);
    const a = rng.pick([1, 2, 4]);
    const b = rng.pick([1, 2, 4]);
    const h = rng.int(-2, 2);
    const k = rng.int(-2, 2);
    const c = rng.int(-3, 6);
    const word = (v: number) => String(v).replace("-", "−");
    const value = (x: number, y: number) => ((x - h) * (x - h)) / a + ((kind === "saddle" ? -1 : 1) * ((y - k) * (y - k))) / b;
    const sign = kind === "max" ? -1 : 1;
    const marks: PlaneMark[] = [];
    const steps = kind === "saddle" ? [-4, -1, 1, 4] : [1, 4];
    for (const level of steps) {
      marks.push({ kind: "contour", f: value, level, accent: true });
      const at0: Point = level > 0 ? [h + Math.sqrt(a * level), k] : [h, k + Math.sqrt(b * -level)];
      marks.push({ kind: "label", at: at0, text: word(c + sign * level), dir: "ne" });
    }
    marks.push({ kind: "point", at: [h, k], label: "P", dir: "sw" });
    const names: Record<typeof kind, Pair> = {
      min: ["A local minimum", "局部极小值"],
      max: ["A local maximum", "局部极大值"],
      saddle: ["A saddle point", "鞍点"],
    };
    const why: Record<typeof kind, Pair> = {
      min: ["The curves close around $P$ and the labels grow outward.", "等值线围绕 $P$ 闭合，标注的数值向外增大。"],
      max: ["The curves close around $P$ and the labels fall outward.", "等值线围绕 $P$ 闭合，标注的数值向外减小。"],
      saddle: [
        `The curves open away from $P$, with values above $${c}$ along one axis and below it along the other.`,
        `等值线在 $P$ 处分开，一条轴上数值高于 $${c}$，另一条轴上低于它。`,
      ],
    };
    return choose(
      rng,
      [
        "The curves are labeled level curves of $f$, and $P$ is a critical point. What kind of point is $P$?",
        "这些曲线是带数值标注的 $f$ 的等值线，$P$ 是临界点。$P$ 是什么类型的点？",
      ],
      names[kind],
      [
        ...(["min", "max", "saddle"] as const).filter((x) => x !== kind).map((x) => names[x]),
        ["A point where the second derivative test gives no information", "二阶导数判别法无法判断的点"],
      ],
      why[kind],
      fig(7, marks, [
        kind === "saddle"
          ? `Hyperbola-shaped level curves around P at (${h}, ${k}), labeled ${word(c + 1)} and ${word(c + 4)} on one axis and ${word(c - 1)} and ${word(c - 4)} on the other.`
          : `Closed level curves around P at (${h}, ${k}), labeled ${word(c + sign)} on the inner curve and ${word(c + 4 * sign)} on the outer curve.`,
        kind === "saddle"
          ? `围绕 P (${h}, ${k}) 的双曲线形等值线，一条轴上标 ${word(c + 1)} 和 ${word(c + 4)}，另一条轴上标 ${word(c - 1)} 和 ${word(c - 4)}。`
          : `围绕 P (${h}, ${k}) 的闭合等值线，内圈标 ${word(c + sign)}，外圈标 ${word(c + 4 * sign)}。`,
      ]),
    );
  },
);

const lagrangeLine = point(
  "the-minimum-on-a-drawn-line-from-tangent-level-curves",
  ["The minimum on a drawn line from tangent level curves", "由相切等值线求所画直线上的最小值"],
  [
    "At a constrained extremum the level curve of $f$ is tangent to the constraint, since $\\nabla f$ is parallel to the normal of the constraint. For $f = x^2 + y^2$ the level curves are circles, and the tangent one touches the line at the foot of the perpendicular from the origin.",
    "在约束极值处，$f$ 的等值线与约束相切，因为 $\\nabla f$ 平行于约束的法向量。对 $f = x^2 + y^2$，等值线是圆，相切的圆在原点到直线的垂足处接触直线。",
  ],
  (rng) => {
    const nonzero = [-4, -3, -2, -1, 1, 2, 3, 4];
    const p = rng.pick(nonzero);
    const q = rng.pick(nonzero);
    const value = p * p + q * q;
    const circle = (x: number, y: number) => x * x + y * y;
    const levels = [value, value + 6, Math.max(1, value - 4)];
    return ask(
      [
        "The solid line is a constraint, and the dashed curves are level curves of $f(x, y) = x^2 + y^2$. Find the minimum of $f$ on the line.",
        "实线是约束，虚线是 $f(x, y) = x^2 + y^2$ 的等值线。求 $f$ 在直线上的最小值。",
      ],
      value,
      [Math.abs(p) + Math.abs(q), value + 6, 2 * value, p * q === value ? value + 1 : Math.abs(p * q)],
      [
        `The dashed circle tangent to the line touches it at $${at([p, q])}$, where the radius meets the line at a right angle. There $f = ${p * p} + ${q * q} = ${value}$.`,
        `与直线相切的虚线圆在 $${at([p, q])}$ 处接触直线，半径在那里与直线垂直。此时 $f = ${p * p} + ${q * q} = ${value}$。`,
      ],
      fig(
        8,
        [
          { kind: "line", a: [p, q], b: [p + q, q - p], accent: true },
          ...levels.map((level): PlaneMark => ({ kind: "contour", f: circle, level, dashed: true })),
        ],
        [
          `A line through ${at([p, q])} perpendicular to the segment from the origin to it, and dashed circles about the origin.`,
          `过 ${at([p, q])} 且与原点到该点的线段垂直的直线，以及以原点为圆心的虚线圆。`,
        ],
      ),
    );
  },
);

const areaChange = point(
  "an-integral-through-a-drawn-change-of-variables",
  ["An integral through a drawn change of variables", "由所画的变量替换求积分"],
  [
    "A linear map with images $T(1, 0)$ and $T(0, 1)$ has Jacobian determinant equal to the determinant of those two vectors. It multiplies every area by its absolute value, so $\\iint_R k\\,dA = k \\lvert J \\rvert \\cdot$ (area of the rectangle in $uv$).",
    "像为 $T(1, 0)$ 和 $T(0, 1)$ 的线性映射，其雅可比行列式等于这两个向量的行列式。它把每个面积乘以其绝对值，所以 $\\iint_R k\\,dA = k \\lvert J \\rvert \\cdot$（$uv$ 中矩形的面积）。",
  ],
  (rng) => {
    const vectors: Point[] = [
      [1, 0],
      [0, 1],
      [2, 0],
      [0, 2],
      [1, 1],
      [1, -1],
      [-1, 1],
      [2, 1],
      [1, 2],
      [-1, 2],
      [2, -1],
    ];
    const u = rng.pick(vectors);
    const v = rng.pick(vectors.filter((x) => cross(x, u) !== 0));
    const m = rng.int(1, 2);
    const n = rng.int(1, 2);
    const k = rng.int(1, 5);
    const J = Math.abs(cross(u, v));
    const answer = k * J * m * n;
    const corners: Point[] = [
      [0, 0],
      [m * u[0], m * u[1]],
      [m * u[0] + n * v[0], m * u[1] + n * v[1]],
      [n * v[0], n * v[1]],
    ];
    return ask(
      [
        `The arrows show $T(1, 0)$ and $T(0, 1)$ for a linear map $T$, and the shaded region $R$ is the image of the rectangle $[0, ${m}] \\times [0, ${n}]$ in the $uv$-plane. Find $\\iint_R ${k}\\,dA$.`,
        `箭头表示线性映射 $T$ 的 $T(1, 0)$ 和 $T(0, 1)$，阴影区域 $R$ 是 $uv$ 平面上矩形 $[0, ${m}] \\times [0, ${n}]$ 的像。求 $\\iint_R ${k}\\,dA$。`,
      ],
      answer,
      [k * m * n, k * J, J * m * n, answer + k],
      [
        `$\\lvert J \\rvert = \\lvert (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rvert = ${J}$, and the rectangle has area $${m * n}$, so the integral is $${k} \\cdot ${J} \\cdot ${m * n} = ${answer}$.`,
        `$\\lvert J \\rvert = \\lvert (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rvert = ${J}$，矩形面积为 $${m * n}$，所以积分为 $${k} \\cdot ${J} \\cdot ${m * n} = ${answer}$。`,
      ],
      fig(
        7,
        [
          { kind: "polygon", points: corners },
          { kind: "arrow", from: [0, 0], to: u, accent: true },
          { kind: "arrow", from: [0, 0], to: v, accent: true },
        ],
        [
          `A shaded parallelogram with corners ${corners.map(at).join(", ")}, and arrows from the origin to ${at(u)} and ${at(v)}.`,
          `阴影平行四边形，顶点为 ${corners.map(at).join("、")}，以及从原点指向 ${at(u)} 和 ${at(v)} 的箭头。`,
        ],
      ),
    );
  },
);

const affineImage = point(
  "the-image-of-a-drawn-vertex-under-an-affine-map",
  ["The image of a drawn vertex under an affine map", "所画顶点在仿射映射下的像"],
  [
    "An affine map is a linear map followed by a shift. Read the coordinates of the point and substitute them into the formula.",
    "仿射映射是线性映射再加平移。读出点的坐标，代入公式。",
  ],
  (rng) => {
    const a = rng.pick([-2, -1, 1, 2, 3]);
    const b = rng.pick([-2, -1, 1, 2]);
    const c = rng.pick([-2, -1, 1, 2]);
    const d = rng.pick([-2, -1, 1, 2, 3]);
    const e = rng.int(-4, 4);
    const f = rng.int(-4, 4);
    const P: Point = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
    const Q1: Point = [P[0] + rng.int(1, 3) * (P[0] > 0 ? -1 : 1), P[1]];
    const R: Point = [P[0], P[1] + rng.int(1, 3) * (P[1] > 0 ? -1 : 1)];
    const image: Point = [a * P[0] + b * P[1] + e, c * P[0] + d * P[1] + f];
    const first = rng.bool();
    const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
    const map = `T(x, y) = \\left(${terms([
      [a, "x"],
      [b, "y"],
      [e, ""],
    ])},\\ ${terms([
      [c, "x"],
      [d, "y"],
      [f, ""],
    ])}\\right)`;
    return ask(
      [
        `For $${map}$, find the ${name[0]} coordinate of the image of the vertex $P$ of the drawn triangle.`,
        `对 $${map}$，求所画三角形的顶点 $P$ 的像的${name[1]}个坐标。`,
      ],
      first ? image[0] : image[1],
      [
        first ? image[1] : image[0],
        first ? a * P[1] + b * P[0] + e : c * P[1] + d * P[0] + f,
        first ? image[0] - e : image[1] - f,
        (first ? image[0] : image[1]) + 1,
      ],
      [`$P = ${at(P)}$, so $T(P) = ${at(image)}$.`, `$P = ${at(P)}$，所以 $T(P) = ${at(image)}$。`],
      fig(
        6,
        [
          { kind: "polygon", points: [P, Q1, R] },
          { kind: "point", at: P, label: "P", dir: "n" },
        ],
        [
          `A shaded triangle with corners ${at(P)}, ${at(Q1)} and ${at(R)}, with P at ${at(P)}.`,
          `阴影三角形，顶点为 ${at(P)}、${at(Q1)} 和 ${at(R)}，P 位于 ${at(P)}。`,
        ],
      ),
    );
  },
);

const inertia = point(
  "a-moment-of-inertia-of-a-drawn-rectangle",
  ["A moment of inertia of a drawn rectangle", "所画矩形的转动惯量"],
  [
    "The moment of inertia about the $x$-axis weighs each piece by the square of its distance from that axis: $I_x = \\iint y^2 \\delta\\,dA$. For a rectangle $[0, a] \\times [0, b]$ of constant density this is $\\delta \\frac{a b^3}{3}$, and $I_y = \\delta \\frac{b a^3}{3}$.",
    "绕 $x$ 轴的转动惯量按到该轴距离的平方加权：$I_x = \\iint y^2 \\delta\\,dA$。对常密度矩形 $[0, a] \\times [0, b]$，它等于 $\\delta \\frac{a b^3}{3}$，而 $I_y = \\delta \\frac{b a^3}{3}$。",
  ],
  (rng) => {
    const a = rng.int(1, 6);
    const b = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== a));
    const delta = rng.int(1, 4);
    const aboutX = rng.bool();
    const answer = Q.of(aboutX ? delta * a * b ** 3 : delta * b * a ** 3, 3);
    const other = Q.of(aboutX ? delta * b * a ** 3 : delta * a * b ** 3, 3);
    return ask(
      [
        `The drawn rectangular lamina has constant density $\\delta = ${delta}$. Find its moment of inertia about the $${aboutX ? "x" : "y"}$-axis.`,
        `所画矩形薄片的密度为常数 $\\delta = ${delta}$。求它绕 $${aboutX ? "x" : "y"}$ 轴的转动惯量。`,
      ],
      answer,
      [other, Q.of(aboutX ? delta * a * b * b : delta * b * a * a, 2), delta * a * b, Q.of(aboutX ? a * b ** 3 : b * a ** 3, 3)],
      [
        aboutX
          ? `$I_x = ${delta} \\int_0^{${a}} \\int_0^{${b}} y^2\\,dy\\,dx = ${delta} \\cdot ${a} \\cdot \\frac{${b ** 3}}{3} = ${answer.toLatex()}$.`
          : `$I_y = ${delta} \\int_0^{${b}} \\int_0^{${a}} x^2\\,dx\\,dy = ${delta} \\cdot ${b} \\cdot \\frac{${a ** 3}}{3} = ${answer.toLatex()}$.`,
        aboutX
          ? `$I_x = ${delta} \\int_0^{${a}} \\int_0^{${b}} y^2\\,dy\\,dx = ${delta} \\cdot ${a} \\cdot \\frac{${b ** 3}}{3} = ${answer.toLatex()}$。`
          : `$I_y = ${delta} \\int_0^{${b}} \\int_0^{${a}} x^2\\,dx\\,dy = ${delta} \\cdot ${b} \\cdot \\frac{${a ** 3}}{3} = ${answer.toLatex()}$。`,
      ],
      fig(
        { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
        [{ kind: "polygon", points: rectangle(0, 0, a, b) }],
        [`A shaded rectangle from (0, 0) to (${a}, ${b}).`, `从 (0, 0) 到 (${a}, ${b}) 的阴影矩形。`],
      ),
    );
  },
);

const parallelAxis = point(
  "the-parallel-axis-theorem-with-a-drawn-distance",
  ["The parallel axis theorem with a drawn distance", "用所画距离应用平行轴定理"],
  [
    "If $I_c$ is the moment about an axis through the center of mass, then about a parallel axis at distance $d$ the moment is $I = I_c + M d^2$. The distance is measured between the axes, and the theorem only starts from the axis through the center of mass.",
    "若 $I_c$ 是绕过质心轴的转动惯量，则绕距离为 $d$ 的平行轴的转动惯量为 $I = I_c + M d^2$。距离在两轴之间度量，定理必须从过质心的轴出发。",
  ],
  (rng) => {
    const M = rng.int(2, 9);
    const Ic = rng.int(3, 40);
    const xc = rng.int(-3, 3);
    const d = rng.int(1, 3) * (rng.bool() ? 1 : -1);
    const size = Math.abs(d);
    const up = rng.bool();
    const whole = Ic + M * size * size;
    const answer = up ? whole : Ic;
    return ask(
      [
        up
          ? `A lamina of mass $${M}$ has moment of inertia $${Ic}$ about the dashed axis through its center of mass. Find its moment about the solid parallel axis.`
          : `A lamina of mass $${M}$ has moment of inertia $${whole}$ about the solid axis. The dashed parallel axis passes through its center of mass. Find its moment about the dashed axis.`,
        up
          ? `质量为 $${M}$ 的薄片绕过质心的虚线轴的转动惯量为 $${Ic}$。求它绕平行的实线轴的转动惯量。`
          : `质量为 $${M}$ 的薄片绕实线轴的转动惯量为 $${whole}$。平行的虚线轴过它的质心。求它绕虚线轴的转动惯量。`,
      ],
      answer,
      up
        ? [Ic + M * size, Ic + size * size, Ic * size * size, M * size * size]
        : [whole + M * size * size, whole - M * size, whole - size * size, M * size * size],
      [
        `The axes are $${size}$ apart, so $M d^2 = ${M} \\cdot ${size * size} = ${M * size * size}$, and ${up ? `$I = ${Ic} + ${M * size * size} = ${whole}$` : `$I_c = ${whole} - ${M * size * size} = ${Ic}$`}.`,
        `两轴相距 $${size}$，所以 $M d^2 = ${M} \\cdot ${size * size} = ${M * size * size}$，${up ? `$I = ${Ic} + ${M * size * size} = ${whole}$` : `$I_c = ${whole} - ${M * size * size} = ${Ic}$`}。`,
      ],
      fig(
        7,
        [
          { kind: "line", a: [xc, 0], b: [xc, 1], dashed: true },
          { kind: "line", a: [xc + d, 0], b: [xc + d, 1], accent: true },
        ],
        [
          `Two vertical lines: a dashed axis at x = ${xc} and a solid axis at x = ${xc + d}.`,
          `两条竖直线：虚线轴在 x = ${xc}，实线轴在 x = ${xc + d}。`,
        ],
      ),
    );
  },
);

const circularMotion = point(
  "acceleration-on-a-drawn-circle",
  ["Acceleration on a drawn circle", "所画圆上的加速度"],
  [
    "A particle moving around a circle of radius $R$ at constant speed $v$ has acceleration of size $\\frac{v^2}{R}$ pointing to the center. Its angular speed is $\\frac{v}{R}$.",
    "沿半径 $R$ 的圆以恒定速率 $v$ 运动的质点，加速度大小为 $\\frac{v^2}{R}$，指向圆心。角速度为 $\\frac{v}{R}$。",
  ],
  (rng) => {
    const R = rng.int(1, 6);
    const v = rng.int(2, 12);
    const kind = rng.pick(["acceleration", "angular"] as const);
    const answer = kind === "acceleration" ? Q.of(v * v, R) : Q.of(v, R);
    const asked: Pair = kind === "acceleration" ? ["the size of its acceleration", "它的加速度大小"] : ["its angular speed", "它的角速度"];
    return ask(
      [
        `A particle moves around the drawn circle about the origin at constant speed $v = ${v}$. Find ${asked[0]}.`,
        `质点以恒定速率 $v = ${v}$ 沿所画的绕原点的圆运动。求${asked[1]}。`,
      ],
      answer,
      [Q.of(v, R), Q.of(v * v, R), Q.of(v * v, R * R), v * R, Q.of(R, v)].filter((x) => !(x instanceof Q) || !x.eq(answer)),
      [
        `The radius is $${R}$, so the answer is $${kind === "acceleration" ? `\\frac{${v}^2}{${R}}` : `\\frac{${v}}{${R}}`} = ${answer.toLatex()}$.`,
        `半径为 $${R}$，所以答案为 $${kind === "acceleration" ? `\\frac{${v}^2}{${R}}` : `\\frac{${v}}{${R}}`} = ${answer.toLatex()}$。`,
      ],
      fig(
        7,
        [{ kind: "circle", center: [0, 0], r: R, accent: true }],
        [`A circle about the origin with radius ${R}.`, `以原点为圆心、半径为 ${R} 的圆。`],
      ),
    );
  },
);

const accelerationComponent = point(
  "the-tangential-acceleration-from-drawn-arrows",
  ["The tangential acceleration from drawn arrows", "由所画箭头求切向加速度"],
  [
    "The tangential component of acceleration is the projection of $a$ onto the direction of $v$: $a_T = \\frac{a \\cdot v}{\\lVert v \\rVert}$. The normal component is what remains: $a_N = \\frac{\\lvert a \\times v \\rvert}{\\lVert v \\rVert}$.",
    "加速度的切向分量是 $a$ 在 $v$ 方向上的投影：$a_T = \\frac{a \\cdot v}{\\lVert v \\rVert}$。法向分量是其余部分：$a_N = \\frac{\\lvert a \\times v \\rvert}{\\lVert v \\rVert}$。",
  ],
  (rng) => {
    const [p, q, L] = rng.pick<[number, number, number]>([
      [3, 4, 5],
      [4, 3, 5],
      [5, 0, 5],
      [0, 5, 5],
    ]);
    const v: Point = [rng.bool() ? p : -p, rng.bool() ? q : -q];
    const a: Point = [rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]), rng.pick([-4, -3, -2, -1, 1, 2, 3, 4])];
    const tangent = rng.bool();
    const top = tangent ? dot(a, v) : Math.abs(cross(a, v));
    const answer = Q.of(top, L);
    return ask(
      [
        `At one instant the arrows show the velocity $v$ and the acceleration $a$ of a particle. Find the ${tangent ? "tangential" : "normal"} component of acceleration${tangent ? ", with its sign" : ""}.`,
        `在某一瞬间，箭头表示质点的速度 $v$ 和加速度 $a$。求加速度的${tangent ? "切向分量（带符号）" : "法向分量"}。`,
      ],
      answer,
      [top, Q.of(top, L * L), Q.of(tangent ? Math.abs(cross(a, v)) : dot(a, v), L), Q.of(-top, L)],
      [
        tangent
          ? `$v = ${at(v)}$ and $a = ${at(a)}$, so $a_T = \\frac{a \\cdot v}{${L}} = \\frac{${top}}{${L}} = ${answer.toLatex()}$.`
          : `$v = ${at(v)}$ and $a = ${at(a)}$, so $a_N = \\frac{\\lvert a \\times v \\rvert}{${L}} = \\frac{${top}}{${L}} = ${answer.toLatex()}$.`,
        tangent
          ? `$v = ${at(v)}$，$a = ${at(a)}$，所以 $a_T = \\frac{a \\cdot v}{${L}} = \\frac{${top}}{${L}} = ${answer.toLatex()}$。`
          : `$v = ${at(v)}$，$a = ${at(a)}$，所以 $a_N = \\frac{\\lvert a \\times v \\rvert}{${L}} = \\frac{${top}}{${L}} = ${answer.toLatex()}$。`,
      ],
      fig(
        6,
        [
          { kind: "arrow", from: [0, 0], to: v, accent: true },
          { kind: "label", at: v, text: "v", dir: "n" },
          { kind: "arrow", from: [0, 0], to: a },
          { kind: "label", at: a, text: "a", dir: "s" },
        ],
        [
          `Arrows from one point: v to ${at(v)} and a to ${at(a)}, as coordinates.`,
          `从同一点出发的箭头：v 的坐标为 ${at(v)}，a 的坐标为 ${at(a)}。`,
        ],
      ),
    );
  },
);

const revolutionSegment = point(
  "the-surface-from-spinning-a-drawn-segment",
  ["The surface from spinning a drawn segment", "所画线段旋转得到的曲面"],
  [
    "Spinning a segment about the $x$-axis gives a band with area $\\int 2\\pi y\\,ds$. Since $y$ is linear along the segment, this is $2\\pi$ times the average height times the length, or $\\pi(y_1 + y_2)L$.",
    "线段绕 $x$ 轴旋转得到一条带，面积为 $\\int 2\\pi y\\,ds$。由于 $y$ 沿线段线性变化，它等于 $2\\pi$ 乘以平均高度再乘以长度，即 $\\pi(y_1 + y_2)L$。",
  ],
  (rng) => {
    const [dx, dy, L] = rng.pick<[number, number, number]>([
      [3, 4, 5],
      [3, -4, 5],
      [4, 3, 5],
      [4, -3, 5],
      [6, 8, 10],
      [6, -8, 10],
      [5, 0, 5],
      [4, 0, 4],
      [7, 0, 7],
    ]);
    const x1 = rng.int(0, 11 - dx);
    const y1 = dy < 0 ? rng.int(1 - dy, 11) : rng.int(1, 11 - dy);
    const y2 = y1 + dy;
    const A: Point = [x1, y1];
    const B: Point = [x1 + dx, y2];
    const k = (y1 + y2) * L;
    return ask(
      [
        "The drawn segment is spun about the $x$-axis. The area of the resulting surface, without the end disks, is $k\\pi$. Find $k$.",
        "所画线段绕 $x$ 轴旋转。所得曲面（不含两端圆盘）的面积为 $k\\pi$。求 $k$。",
      ],
      k,
      [2 * k, y1 + y2, Math.abs(y2 * y2 - y1 * y1), L * y1],
      [
        `The ends have heights $${y1}$ and $${y2}$, and the length is $${L}$, so the area is $\\pi(${y1} + ${y2})(${L}) = ${k}\\pi$.`,
        `两端高度为 $${y1}$ 和 $${y2}$，长度为 $${L}$，所以面积为 $\\pi(${y1} + ${y2})(${L}) = ${k}\\pi$。`,
      ],
      fig(
        { xMin: -1, xMax: 12, yMin: -1, yMax: 12 },
        [
          { kind: "segment", a: A, b: B, accent: true },
          { kind: "point", at: A },
          { kind: "point", at: B },
        ],
        [`A segment from ${at(A)} to ${at(B)} above the x-axis.`, `x 轴上方从 ${at(A)} 到 ${at(B)} 的线段。`],
      ),
    );
  },
);

const arcLength = point(
  "the-length-of-a-drawn-broken-path",
  ["The length of a drawn broken path", "所画折线路径的长度"],
  [
    "Arc length adds up along the pieces of a path. On a straight piece, $\\int \\lVert r'(t) \\rVert\\,dt$ is the distance between its ends.",
    "弧长沿路径的各段相加。在直线段上，$\\int \\lVert r'(t) \\rVert\\,dt$ 就是两端之间的距离。",
  ],
  (rng) => {
    const legs: readonly [number, number, number][] = [
      [3, 4, 5],
      [4, 3, 5],
      [3, -4, 5],
      [4, -3, 5],
      [5, 0, 5],
      [2, 0, 2],
      [0, 3, 3],
      [0, -3, 3],
      [0, 2, 2],
      [0, -2, 2],
    ];
    const start: Point = [-8, rng.int(-3, 3)];
    let chosen: [number, number, number][] = [];
    let points: Point[] = [];
    for (let attempt = 0; attempt < 30; attempt++) {
      chosen = [rng.pick(legs), rng.pick(legs), rng.pick(legs)].map((x) => [...x] as [number, number, number]);
      points = [start];
      for (const [dx, dy] of chosen) {
        const last = points[points.length - 1] as Point;
        points.push([last[0] + dx, last[1] + dy]);
      }
      if (points.every(([, y]) => Math.abs(y) <= 8)) break;
      chosen = [
        [3, 4, 5],
        [3, -4, 5],
        [5, 0, 5],
      ];
      points = [start];
      for (const [dx, dy] of chosen) {
        const last = points[points.length - 1] as Point;
        points.push([last[0] + dx, last[1] + dy]);
      }
    }
    const total = chosen.reduce((sum, [, , r]) => sum + r, 0);
    const end = points[points.length - 1] as Point;
    const straight = Math.round(Math.hypot(end[0] - start[0], end[1] - start[1]));
    return ask(
      ["Find the arc length of the drawn broken path.", "求所画折线路径的弧长。"],
      total,
      [
        straight === total ? total + 1 : straight,
        chosen.reduce((sum, [dx, dy]) => sum + Math.abs(dx) + Math.abs(dy), 0),
        total + 2,
        total - 1,
      ],
      [
        `The pieces have lengths ${chosen.map(([, , r]) => `$${r}$`).join(", ")}, which add up to $${total}$.`,
        `各段长度为 ${chosen.map(([, , r]) => `$${r}$`).join("、")}，总和为 $${total}$。`,
      ],
      fig(
        { xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 },
        [{ kind: "path", points, accent: true }, ...points.map((p): PlaneMark => ({ kind: "point", at: p }))],
        [`A broken path through ${points.map(at).join(", ")}.`, `折线路径，依次经过 ${points.map(at).join("、")}。`],
      ),
    );
  },
);

const curveKind = point(
  "simple-and-closed-from-a-drawn-curve",
  ["Simple and closed from a drawn curve", "由所画曲线判断简单和闭合"],
  [
    "A curve is closed when it ends where it starts, and simple when it does not cross itself, apart from the two ends of a closed curve. The two properties are independent.",
    "曲线终点与起点重合时是闭合的；除闭合曲线的两端外不自交时是简单的。这两个性质彼此独立。",
  ],
  (rng) => {
    const kind = rng.pick(["simple-closed", "closed", "simple", "neither"] as const);
    const a = rng.int(3, 7);
    const b = rng.int(2, 6);
    const h = rng.int(-1, 1);
    const k = rng.int(-1, 1);
    const sample = (f: (s: number) => Point, from: number, to: number) =>
      Array.from({ length: 121 }, (_, i) => f(from + ((to - from) * i) / 120));
    const points =
      kind === "simple-closed"
        ? sample((s) => [h + a * Math.cos(s), k + b * Math.sin(s)], 0, 2 * Math.PI)
        : kind === "closed"
          ? sample((s) => [h + a * Math.sin(s), k + b * Math.sin(2 * s)], 0, 2 * Math.PI)
          : kind === "simple"
            ? sample((s) => [h + a * Math.cos(s), k + b * Math.sin(s)], 0.15 * Math.PI, 1.35 * Math.PI)
            : sample((s) => [h - a + (a / 2) * s * s, k + (b / 3.5) * s * (s * s - 2)], -1.9, 1.9);
    const names: Record<typeof kind, Pair> = {
      "simple-closed": ["Simple and closed", "简单且闭合"],
      closed: ["Closed but not simple", "闭合但不简单"],
      simple: ["Simple but not closed", "简单但不闭合"],
      neither: ["Neither simple nor closed", "既不简单也不闭合"],
    };
    const why: Record<typeof kind, Pair> = {
      "simple-closed": ["The curve returns to its start and never crosses itself.", "曲线回到起点，且从不自交。"],
      closed: ["The curve returns to its start, but it crosses itself once.", "曲线回到起点，但自交一次。"],
      simple: ["The curve has two separate ends and never crosses itself.", "曲线有两个分开的端点，且从不自交。"],
      neither: ["The curve has two separate ends, and it also crosses itself.", "曲线有两个分开的端点，而且自交。"],
    };
    const alts: Record<typeof kind, Pair> = {
      "simple-closed": ["An oval that returns to its start without crossing itself.", "回到起点且不自交的椭圆形。"],
      closed: ["A figure eight, which returns to its start and crosses itself once.", "8 字形，回到起点并自交一次。"],
      simple: ["An open arc with two separate ends and no crossing.", "有两个分开的端点且不自交的开弧。"],
      neither: ["An open curve with two separate ends that forms a loop by crossing itself.", "有两个分开端点的开曲线，自交形成一个环。"],
    };
    return choose(
      rng,
      ["Which description fits the drawn curve?", "哪个描述符合所画的曲线？"],
      names[kind],
      (["simple-closed", "closed", "simple", "neither"] as const).filter((x) => x !== kind).map((x) => names[x]),
      why[kind],
      fig(10, [{ kind: "path", points, accent: true }], alts[kind]),
    );
  },
);

/** deeperFiguresMultivariableCalculus2Points adds more knowledge points of Multivariable Calculus that are answered by reading a drawing. */
export const deeperFiguresMultivariableCalculus2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "defining-vector-valued-functions": [definingLine],
  "tangent-vectors-and-tangent-lines-to-curves": [tangentSlope],
  "the-curvature-of-a-plane-curve": [curvatureVertex],
  "conservative-vector-fields-in-the-cartesian-plane": [conservativeField],
  "line-integrals-of-scalar-functions-over-line-segments": [segmentIntegral],
  "line-integrals-of-scalar-functions-over-circles": [circleIntegral],
  "the-fundamental-theorem-of-line-integrals": [potentialDifference],
  "path-independence-of-line-integrals": [pathIndependence],
  "greens-theorem-in-circulation-curl-form": [greenCirculation],
  "greens-theorem-on-regions-with-holes": [greenHole],
  "flux-in-two-dimensional-vector-fields": [fluxSegment],
  "greens-theorem-in-flux-divergence-form": [greenFlux],
  "double-integrals-over-rectangular-domains": [doubleRect],
  "double-integrals-over-type-ii-regions": [typeTwoLimits],
  "double-integrals-over-partitioned-regions": [partitioned],
  "double-integrals-between-polar-curves": [polarArea],
  "cylindrical-polar-coordinates": [cylindricalPoint],
  "geometric-interpretations-of-partial-derivatives": [partialSlope],
  "directional-derivatives": [directionalFromArrows],
  "global-vs-local-extrema-and-critical-points-of-multivariable-functions": [criticalKind],
  "lagrange-multipliers-with-one-constraint": [lagrangeLine],
  "computing-areas-using-a-change-of-variables": [areaChange],
  "the-image-of-an-affine-transformation": [affineImage],
  "moments-of-inertia-of-laminas-about-the-coordinate-axes": [inertia],
  "the-parallel-axis-theorem": [parallelAxis],
  "circular-motion-about-the-origin": [circularMotion],
  "the-components-of-acceleration": [accelerationComponent],
  "surface-areas-of-revolution-rotation-about-the-x-axis": [revolutionSegment],
  "the-arc-length-of-a-vector-valued-function": [arcLength],
  "simple-closed-and-oriented-curves": [curveKind],
};
