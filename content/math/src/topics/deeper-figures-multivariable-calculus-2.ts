// More knowledge points of Multivariable Calculus that ask the learner to read a drawing: oriented paths, line
// integrals, Green's theorem, double integrals, level curves and mechanics. See
// `deeperFiguresMultivariableCalculus2Points`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";
import { multivariableDrawings1 } from "../explanation-drawings-multivariable-1.ts";
import { multivariableDrawings2 } from "../explanation-drawings-multivariable-2.ts";
import { multivariableDrawings3 } from "../explanation-drawings-multivariable-3.ts";
import { multivariableDrawings4 } from "../explanation-drawings-multivariable-4.ts";
import { multivariableDrawings5 } from "../explanation-drawings-multivariable-5.ts";
import { multivariableDrawings6 } from "../explanation-drawings-multivariable-6.ts";
import { multivariableDrawings8 } from "../explanation-drawings-multivariable-8.ts";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { ask, type Pair, point, same } from "../university-kit.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { drawn } from "./figure-reading-more.ts";

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView | number, marks: readonly PlaneMark[], [en, zh]: Pair) =>
  drawn(typeof v === "number" ? { xMin: -v, xMax: v, yMin: -v, yMax: v } : v, marks, t(en, zh));

const at = (p: Point) => `(${p[0]}, ${p[1]})`;
const dot = (u: Point, v: Point) => u[0] * v[0] + u[1] * v[1];
const cross = (u: Point, v: Point) => u[0] * v[1] - u[1] * v[0];
const paren = (v: number) => (v < 0 ? `(${v})` : `${v}`);
/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly ReturnType<typeof why>[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

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
    "A segment that starts at $A$ at $t = 0$ and ends at $B$ at $t = 1$ is $r(t) = A + t(B - A)$, the start plus a multiple of the displacement. Read the tail of the arrow as $A$ and the tip as $B$. For an arrow from $(1, 2)$ to $(4, -1)$, the displacement is $(3, -3)$, so $r(t) = (1 + 3t,\\ 2 - 3t)$.\n\nCheck: $r(0) = (1, 2)$ is the tail and $r(1) = (4, -1)$ is the tip.\n\n> **Watch out.** Multiply $t$ by the displacement $B - A$, not by the tip $B$: $(1 + 4t,\\ 2 - t)$ reaches $(5, 1)$ at $t = 1$, not the tip.",
    "在 $t = 0$ 从 $A$ 出发、在 $t = 1$ 到达 $B$ 的线段是 $r(t) = A + t(B - A)$，即起点加上位移的倍数。箭尾是 $A$，箭头是 $B$。对从 $(1, 2)$ 到 $(4, -1)$ 的箭头，位移是 $(3, -3)$，所以 $r(t) = (1 + 3t,\\ 2 - 3t)$。\n\n检验：$r(0) = (1, 2)$ 是箭尾，$r(1) = (4, -1)$ 是箭头。\n\n> **注意。** $t$ 乘的是位移 $B - A$，不是箭头 $B$：$(1 + 4t,\\ 2 - t)$ 在 $t = 1$ 时到达 $(5, 1)$，不是箭头。",
  ],
  (rng) => {
    const nonzero = [-4, -3, -2, -1, 1, 2, 3, 4];
    const [dx, dy] = [rng.pick(nonzero), rng.pick(nonzero)];
    const A: Point = [place(rng, dx, 5), place(rng, dy, 5)];
    const B: Point = [A[0] + dx, A[1] + dy];
    const form = (x0: number, kx: number, y0: number, ky: number) =>
      `$r(t) = \\left(${terms([
        [x0, ""],
        [kx, "t"],
      ])},\\ ${terms([
        [y0, ""],
        [ky, "t"],
      ])}\\right)$`;
    const option = (x0: number, kx: number, y0: number, ky: number) => t(form(x0, kx, y0, ky), form(x0, kx, y0, ky));
    const parts: Step[] = [
      [
        ["Read the tail and the tip", "读出箭尾和箭头"],
        t(`The arrow starts at $A = ${at(A)}$ and ends at $B = ${at(B)}$.`, `箭头从 $A = ${at(A)}$ 出发，到 $B = ${at(B)}$ 结束。`),
      ],
      [
        ["Find the displacement", "求位移"],
        t("Subtract the tail from the tip:", "用箭头减去箭尾："),
        [`B - A = (${B[0]} - ${paren(A[0])},\\ ${B[1]} - ${paren(A[1])}) = (${dx}, ${dy})`],
      ],
      [
        ["Write the formula", "写出公式"],
        t("Add $t$ times the displacement to the start:", "起点加上 $t$ 乘位移："),
        [
          `r(t) = ${at(A)} + t(${dx}, ${dy}) = \\left(${terms([
            [A[0], ""],
            [dx, "t"],
          ])},\\ ${terms([
            [A[1], ""],
            [dy, "t"],
          ])}\\right)`,
        ],
      ],
    ];
    return explainedChoice(rng, {
      prompt: t(
        "Which function traces the drawn arrow from its tail at $t = 0$ to its tip at $t = 1$?",
        "哪个函数描出所画的箭头，$t = 0$ 时在箭尾，$t = 1$ 时在箭头？",
      ),
      correct: option(A[0], dx, A[1], dy),
      wrong: [
        {
          option: option(B[0], -dx, B[1], -dy),
          why: t(`This runs backwards: at $t = 0$ it is at the tip $${at(B)}$`, `这条是反向的：$t = 0$ 时它在箭头 $${at(B)}$`),
        },
        {
          option: option(A[0], B[0], A[1], B[1]),
          why: t(
            `This multiplies $t$ by the tip instead of the displacement, so at $t = 1$ it is at $${at([A[0] + B[0], A[1] + B[1]])}$`,
            `这里 $t$ 乘的是箭头的坐标而不是位移，所以 $t = 1$ 时它在 $${at([A[0] + B[0], A[1] + B[1]])}$`,
          ),
        },
        {
          option: option(A[0], dy, A[1], dx),
          why: t(
            `This swaps the two parts of the displacement, so at $t = 1$ it is at $${at([A[0] + dy, A[1] + dx])}$`,
            `这里把位移的两个分量对调了，所以 $t = 1$ 时它在 $${at([A[0] + dy, A[1] + dx])}$`,
          ),
        },
        {
          option: option(A[0], -dx, A[1], -dy),
          why: t(
            `This uses $A - B$, so it moves away from the tip and reaches $${at([A[0] - dx, A[1] - dy])}$ at $t = 1$`,
            `这里用的是 $A - B$，所以它背离箭头移动，$t = 1$ 时到达 $${at([A[0] - dx, A[1] - dy])}$`,
          ),
        },
      ],
      solution: walked(
        parts,
        t(
          `Put in the two ends: $r(0) = ${at(A)}$, the tail, and $r(1) = (${A[0]} + ${paren(dx)},\\ ${A[1]} + ${paren(dy)}) = ${at(B)}$, the tip.`,
          `代入两个端点：$r(0) = ${at(A)}$ 是箭尾，$r(1) = (${A[0]} + ${paren(dx)},\\ ${A[1]} + ${paren(dy)}) = ${at(B)}$ 是箭头。`,
        ),
      ),
      figure: fig(
        6,
        [{ kind: "arrow", from: A, to: B, accent: true }],
        [`An arrow from ${at(A)} to ${at(B)}.`, `从 ${at(A)} 到 ${at(B)} 的箭头。`],
      ),
    });
  },
);

const tangentSlope = point(
  "the-slope-at-a-marked-point-of-a-parametrized-curve",
  ["The slope at a marked point of a parametrized curve", "参数曲线上标记点处的斜率"],
  [
    "Find the parameter of the point from its coordinates. The tangent vector there is $r'(t)$, and the slope of the tangent line is $\\frac{y'(t)}{x'(t)}$. For $r(t) = (4t,\\ t^2)$ at $P = (8, 4)$, $4t = 8$ gives $t = 2$, and $r'(2) = (4,\\ 4)$, so the slope is $\\frac{4}{4} = 1$.\n\n> **Watch out.** Find $t$ from $x$, not from $y = t^2$: $t^2 = 4$ allows $t = -2$ as well, which is a different point. And the slope is $\\frac{y'}{x'}$, rise over run, not $\\frac{x'}{y'}$.",
    "由坐标求出该点的参数。那里的切向量是 $r'(t)$，切线斜率为 $\\frac{y'(t)}{x'(t)}$。对 $r(t) = (4t,\\ t^2)$ 在 $P = (8, 4)$ 处，由 $4t = 8$ 得 $t = 2$，而 $r'(2) = (4,\\ 4)$，所以斜率为 $\\frac{4}{4} = 1$。\n\n> **注意。** 要由 $x$ 求 $t$，不要由 $y = t^2$ 求：$t^2 = 4$ 也允许 $t = -2$，那是另一个点。斜率是 $\\frac{y'}{x'}$，纵向变化比横向变化，不是 $\\frac{x'}{y'}$。",
  ],
  (rng) => {
    const k = rng.pick([-3, -2, -1, 1, 2, 3]);
    const t0 = rng.pick([-3, -2, -1, 1, 2, 3].filter((v) => Math.abs(k * v) <= 9));
    const P: Point = [k * t0, t0 * t0];
    const answer = Q.of(2 * t0, k);
    const xt = terms([[k, "t"]]);
    const slope = (s: number) => Q.of(2 * s * k, k * k);
    const tOfX = k === 1 ? "x" : k === -1 ? "-x" : k < 0 ? `-\\frac{x}{${-k}}` : `\\frac{x}{${k}}`;
    const yOfX = k * k === 1 ? "x^2" : `\\frac{x^2}{${k * k}}`;
    const slopeOfX = k * k === 1 ? "2x" : `\\frac{2x}{${k * k}}`;
    return {
      ...numberProblem({
        prompt: t(
          `The drawing shows the curve $r(t) = (${xt},\\ t^2)$ with a marked point $P$. Find the slope of the tangent line at $P$.`,
          `图中是曲线 $r(t) = (${xt},\\ t^2)$，标出了点 $P$。求 $P$ 处切线的斜率。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            Q.of(k, 2 * t0),
            `That is $\\frac{x'}{y'}$; the slope is $\\frac{y'}{x'}$.`,
            `那是 $\\frac{x'}{y'}$；斜率是 $\\frac{y'}{x'}$。`,
          ),
          why(
            Q.of(-2 * t0, k),
            `That uses $t = ${-t0}$, which also solves $t^2 = ${t0 * t0}$ but gives the point $${at([-k * t0, t0 * t0])}$; find $t$ from $x$.`,
            `那用了 $t = ${-t0}$，它也满足 $t^2 = ${t0 * t0}$，但对应点 $${at([-k * t0, t0 * t0])}$；要由 $x$ 求 $t$。`,
          ),
          why(2 * t0, `$${2 * t0}$ is $y'(t)$ alone; divide by $x'(t) = ${k}$.`, `$${2 * t0}$ 只是 $y'(t)$；还要除以 $x'(t) = ${k}$。`),
          why(Q.of(t0, k), `$y = t^2$ has $y' = 2t$, not $t$.`, `$y = t^2$ 的导数是 $y' = 2t$，不是 $t$。`),
        ]),
        solution: walked(
          [
            [
              ["Find the parameter of $P$", "求 $P$ 的参数"],
              t(`$P = ${at(P)}$, and $${xt} = ${P[0]}$ gives $t = ${t0}$.`, `$P = ${at(P)}$，由 $${xt} = ${P[0]}$ 得 $t = ${t0}$。`),
            ],
            [
              ["Divide the rates", "两个变化率相除"],
              t(
                `$r'(t) = (${k},\\ 2t)$, so at $t = ${t0}$ the slope is $\\frac{y'}{x'} = \\frac{2 \\cdot ${paren(t0)}}{${k}} = ${answer.toLatex()}$.`,
                `$r'(t) = (${k},\\ 2t)$，所以在 $t = ${t0}$ 处斜率为 $\\frac{y'}{x'} = \\frac{2 \\cdot ${paren(t0)}}{${k}} = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `Eliminating $t = ${tOfX}$ gives $y = ${yOfX}$, whose slope $${slopeOfX}$ at $x = ${P[0]}$ is $${slope(t0).toLatex()}$.`,
            `消去 $t = ${tOfX}$ 得 $y = ${yOfX}$，它在 $x = ${P[0]}$ 处的斜率 $${slopeOfX}$ 等于 $${slope(t0).toLatex()}$。`,
          ),
        ),
      }),
      figure: fig(
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
    };
  },
);

const curvatureVertex = {
  ...point(
    "the-curvature-at-the-vertex-of-a-drawn-parabola",
    ["The curvature at the vertex of a drawn parabola", "所画抛物线顶点处的曲率"],
    [
      "For $y = ax^2$, the formula $\\kappa = \\frac{\\lvert y'' \\rvert}{(1 + (y')^2)^{3/2}}$ gives $\\kappa = 2\\lvert a \\rvert$ at the vertex, where $y' = 0$. The curve bends most sharply there, and a narrower parabola has a larger $\\lvert a \\rvert$. Find $a$ from a point of the graph. A parabola through $(2, 12)$ has $a = \\frac{12}{4} = 3$, so its curvature at the vertex is $6$.\n\n> **Watch out.** $a$ is the height of the point divided by the square of its $x$-coordinate, not the height itself. The curvature is $2\\lvert a \\rvert$, not $\\lvert a \\rvert$, and not its reciprocal, which is the radius of curvature.",
      "对 $y = ax^2$，公式 $\\kappa = \\frac{\\lvert y'' \\rvert}{(1 + (y')^2)^{3/2}}$ 在顶点处（$y' = 0$）给出 $\\kappa = 2\\lvert a \\rvert$。曲线在那里弯得最厉害，抛物线越窄，$\\lvert a \\rvert$ 越大。由图像上的一点求 $a$。过 $(2, 12)$ 的抛物线有 $a = \\frac{12}{4} = 3$，所以它在顶点处的曲率为 $6$。\n\n> **注意。** $a$ 是该点的高度除以其 $x$ 坐标的平方，不是高度本身。曲率是 $2\\lvert a \\rvert$，不是 $\\lvert a \\rvert$，也不是它的倒数（那是曲率半径）。",
    ],
    (rng) => {
      const k = rng.pick([1, 2, 3]);
      const height = rng.int(1, 8);
      const x = rng.bool() ? k : -k;
      const s = rng.bool() ? 1 : -1;
      const a = Q.of(s * height, k * k);
      const answer = Q.of(2 * height, k * k);
      const P: Point = [x, s * height];
      return {
        ...numberProblem({
          prompt: t(
            "The drawn parabola has the form $y = ax^2$ and passes through the marked point. Find its curvature at the vertex.",
            "所画的抛物线形如 $y = ax^2$，并过标记点。求它在顶点处的曲率。",
          ),
          answer,
          mistakes: apart(answer, [
            why(
              Q.of(height, k * k),
              `That is $\\lvert a \\rvert$; $y'' = 2a$, so $\\kappa = 2\\lvert a \\rvert$.`,
              `这是 $\\lvert a \\rvert$；$y'' = 2a$，所以 $\\kappa = 2\\lvert a \\rvert$。`,
            ),
            why(
              Q.of(k * k, 2 * height),
              "That is $\\frac{1}{\\kappa}$, the radius of curvature.",
              "这是 $\\frac{1}{\\kappa}$，即曲率半径。",
            ),
            why(
              height,
              `That takes $a$ to be the height $${s * height}$; $a = \\frac{${s * height}}{${paren(x)}^2} = ${a.toLatex()}$.`,
              `这把 $a$ 当成了高度 $${s * height}$；$a = \\frac{${s * height}}{${paren(x)}^2} = ${a.toLatex()}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find $a$ from the point", "由点求 $a$"],
                t(
                  `The point $${at(P)}$ gives $${s * height} = a \\cdot ${paren(x)}^2$, so $a = ${a.toLatex()}$.`,
                  `由点 $${at(P)}$ 得 $${s * height} = a \\cdot ${paren(x)}^2$，所以 $a = ${a.toLatex()}$。`,
                ),
              ],
              [
                ["Use the vertex", "在顶点处计算"],
                t(
                  `At the vertex $y' = 0$ and $\\lvert y'' \\rvert = 2\\lvert a \\rvert$, so $\\kappa = ${answer.toLatex()}$.`,
                  `在顶点处 $y' = 0$，$\\lvert y'' \\rvert = 2\\lvert a \\rvert$，所以 $\\kappa = ${answer.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `$y = ${a.eq(Q.of(1)) ? "" : a.eq(Q.of(-1)) ? "-" : a.toLatex()}x^2$ at $x = ${x}$ gives $${a.toLatex()} \\cdot ${k * k} = ${s * height}$, the height of the marked point, and $y'' = ${a.mul(Q.of(2)).toLatex()}$ has absolute value $${answer.toLatex()}$.`,
              `$y = ${a.eq(Q.of(1)) ? "" : a.eq(Q.of(-1)) ? "-" : a.toLatex()}x^2$ 在 $x = ${x}$ 处得 $${a.toLatex()} \\cdot ${k * k} = ${s * height}$，正是标记点的高度；$y'' = ${a.mul(Q.of(2)).toLatex()}$ 的绝对值为 $${answer.toLatex()}$。`,
            ),
          ),
        }),
        figure: fig(
          9,
          [
            { kind: "curve", f: (v) => (s * height * v * v) / (k * k), accent: true },
            { kind: "point", at: P },
          ],
          [`A parabola with its vertex at the origin through the marked point ${at(P)}.`, `顶点在原点、过标记点 ${at(P)} 的抛物线。`],
        ),
      };
    },
  ),
  figure: multivariableDrawings1["the-curvature-of-a-plane-curve#the-curvature-at-the-vertex-of-a-drawn-parabola"],
};

const conservativeField = {
  ...point(
    "is-a-drawn-field-conservative",
    ["Is a drawn field conservative?", "所画的向量场是保守场吗？"],
    [
      "A field $(P, Q)$ on the plane is conservative exactly when $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$. A field that swirls around a point has circulation along a circle around it, so it cannot be conservative. For $(-y, 4x)$, $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 4 + 1 = 5$, and its arrows run counterclockwise around the origin, so it is not conservative.\n\n> **Watch out.** Divergence does not decide the question: a swirl can have zero divergence and still not be conservative, and a field that spreads out can be a gradient. Neither do arrow lengths; only $Q_x - P_y$ does.",
      "平面上的场 $(P, Q)$ 是保守场当且仅当 $\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}$。绕一点旋转的场沿绕它的圆有环量，所以不可能是保守场。对 $(-y, 4x)$，$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 4 + 1 = 5$，箭头绕原点逆时针转，所以它不是保守场。\n\n> **注意。** 散度不能决定这个问题：旋转场的散度可以为零却不是保守场，向外发散的场也可以是梯度场。箭头长度也不能决定；只有 $Q_x - P_y$ 能。",
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
      const zero = t("Yes, its curl is zero", "是，它的旋度为零");
      const circulation = t("No, its circulation around a circle about the origin is not zero", "不是，它绕原点的圆上的环量不为零");
      const flat = t(
        `Its curl is $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 0$, so its circulation around every closed curve is zero.`,
        `它的旋度 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = 0$，所以沿每条闭曲线的环量都为零。`,
      );
      const turning = t(
        `Its curl is $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curl}$, not zero.`,
        `它的旋度 $\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curl}$，不为零。`,
      );
      const half = (c: number, v: string) => (Math.abs(c) === 2 ? v : `\\frac{${Math.abs(c)}}{2}${v}`);
      const yc = kind === "saddle" ? -flip * b : flip * b;
      const f2 =
        kind === "shear" ? terms([[flip * a, "xy"]]) : `${flip < 0 ? "-" : ""}${half(a, "x^2")} ${yc < 0 ? "-" : "+"} ${half(b, "y^2")}`;
      return explainedChoice(rng, {
        prompt: t(
          `The drawing shows the field $F = (P, Q)$, whose first component is $P = ${P}$. Is $F$ conservative?`,
          `图中是向量场 $F = (P, Q)$，它的第一个分量是 $P = ${P}$。$F$ 是保守场吗？`,
        ),
        correct: yes ? zero : circulation,
        wrong: yes
          ? [
              { option: circulation, why: flat },
              {
                option: t("No, its divergence is not zero", "不是，它的散度不为零"),
                why: t("Divergence does not decide whether a field is conservative; the curl does.", "散度不能决定场是否保守；要看旋度。"),
              },
              {
                option: t("No, its arrows are not all parallel", "不是，它的箭头并不都平行"),
                why: t(
                  "A conservative field need not be constant; what matters is $Q_x = P_y$.",
                  "保守场不必是常向量场；关键是 $Q_x = P_y$。",
                ),
              },
            ]
          : [
              { option: zero, why: turning },
              {
                option: t("Yes, its divergence is zero", "是，它的散度为零"),
                why: t(
                  "Zero divergence does not make a field conservative; this swirl has zero divergence but nonzero curl.",
                  "散度为零不能使场保守；这个旋转场散度为零但旋度不为零。",
                ),
              },
              {
                option: t("Yes, its arrows have the same length on each circle", "是，每个圆上的箭头长度相同"),
                why: t(
                  "Arrow lengths do not decide it; the arrows run around the origin, so the circulation is not zero.",
                  "箭头长度不能决定这一点；箭头绕原点转，所以环量不为零。",
                ),
              },
            ],
        solution: walked(
          [
            [["Read $Q$ from the arrows", "由箭头读出 $Q$"], t(`The arrows show $Q = ${R}$.`, `由箭头得 $Q = ${R}$。`)],
            [
              ["Compare the cross partials", "比较交叉偏导"],
              t(
                `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curl}$, so the field is ${yes ? "" : "not "}conservative.`,
                `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${curl}$，所以该场${yes ? "是" : "不是"}保守场。`,
              ),
            ],
          ],
          yes
            ? t(`$F = \\nabla f$ with $f = ${f2}$.`, `$F = \\nabla f$，其中 $f = ${f2}$。`)
            : t(
                `At $(1, 0)$ the arrow is $(0, ${flip * b})$ and at $(0, 1)$ it is $(${-flip * a}, 0)$: both point ${flip > 0 ? "counterclockwise" : "clockwise"} around the origin, so the circulation does not cancel.`,
                `在 $(1, 0)$ 处箭头为 $(0, ${flip * b})$，在 $(0, 1)$ 处为 $(${-flip * a}, 0)$：都绕原点${flip > 0 ? "逆时针" : "顺时针"}指向，所以环量不会抵消。`,
              ),
        ),
        figure: fig(4, marks, [
          `A vector field with arrows at the grid points, equal to (${P}, ${R}).`,
          `格点上带箭头的向量场，等于 (${P}, ${R})。`,
        ]),
      });
    },
  ),
  figure: multivariableDrawings1["conservative-vector-fields-in-the-cartesian-plane#is-a-drawn-field-conservative"],
};

const segmentIntegral = point(
  "a-scalar-line-integral-over-a-drawn-segment",
  ["A scalar line integral over a drawn segment", "所画线段上的标量线积分"],
  [
    "On a segment of length $L$, $ds = L\\,dt$ for $t$ from $0$ to $1$. For a linear function $f$, the integral of $f$ is $L$ times the value of $f$ at the midpoint. For $f(x, y) = 2x$ on the segment from $(0, 0)$ to $(6, 8)$, $L = 10$ and $f(3, 4) = 6$, so the integral is $60$.\n\n> **Watch out.** Read the length off the drawing as $\\sqrt{\\Delta x^2 + \\Delta y^2}$ and multiply by it once; the midpoint value alone is the average, not the integral.",
    "在长度为 $L$ 的线段上，$ds = L\\,dt$，$t$ 从 $0$ 到 $1$。对线性函数 $f$，积分等于 $L$ 乘以 $f$ 在中点的值。对 $f(x, y) = 2x$，在从 $(0, 0)$ 到 $(6, 8)$ 的线段上，$L = 10$，$f(3, 4) = 6$，所以积分为 $60$。\n\n> **注意。** 从图中读出长度 $\\sqrt{\\Delta x^2 + \\Delta y^2}$，只乘一次；只取中点的值得到的是平均值，不是积分。",
  ],
  (rng) => {
    const [dx, dy, L] = signedLeg(rng);
    const A: Point = [place(rng, dx, 9), place(rng, dy, 9)];
    const B: Point = [A[0] + dx, A[1] + dy];
    const m = rng.int(-3, 3);
    const n = rng.pick([-3, -2, -1, 1, 2, 3]);
    let c = rng.int(-4, 4);
    while (m * (A[0] + B[0]) + n * (A[1] + B[1]) + 2 * c === 0) c = rng.int(-4, 4);
    const f = ([x, y]: Point) => m * x + n * y + c;
    const mid = Q.of(f(A) + f(B), 2);
    const answer = Q.of(L * (f(A) + f(B)), 2);
    const fx = terms([
      [m, "x"],
      [n, "y"],
      [c, ""],
    ]);
    const midPoint = `\\left(${Q.of(A[0] + B[0], 2).toLatex()}, ${Q.of(A[1] + B[1], 2).toLatex()}\\right)`;
    const midIn = mid.sign() < 0 ? `\\left(${mid.toLatex()}\\right)` : mid.toLatex();
    const change = Q.of(f(B) - f(A), 2);
    const inside = change.isZero() ? `${f(A)}` : `${f(A)} ${change.sign() < 0 ? "-" : "+"} ${change.abs().toLatex()}`;
    return {
      ...numberProblem({
        prompt: t(
          `Let $f(x, y) = ${fx}$. Find $\\int_C f\\,ds$ over the drawn segment $C$.`,
          `设 $f(x, y) = ${fx}$。求所画线段 $C$ 上的 $\\int_C f\\,ds$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            mid,
            `That is the value at the midpoint, the average of $f$; multiply by the length $${L}$.`,
            `那是中点处的值，即 $f$ 的平均值；还要乘以长度 $${L}$。`,
          ),
          why(
            Q.of(L * (f(A) + f(B))),
            "That adds the end values without halving them; the midpoint value is half their sum.",
            "那是两端值相加后没有除以 $2$；中点处的值是和的一半。",
          ),
          why(
            Q.of(L * f(A)),
            "That uses the value at one end; a linear function averages its value at the midpoint.",
            "那是用了一端的值；线性函数的平均值是中点处的值。",
          ),
          why(
            Q.of(L * f(B)),
            "That uses the value at one end; a linear function averages its value at the midpoint.",
            "那是用了一端的值；线性函数的平均值是中点处的值。",
          ),
          why(
            Q.of(L * L * (f(A) + f(B)), 2),
            `That multiplies by $L^2 = ${L * L}$; $ds = ${L}\\,dt$ brings one factor of $L$.`,
            `那是乘了 $L^2 = ${L * L}$；$ds = ${L}\\,dt$ 只带来一个因子 $L$。`,
          ),
        ]),
        solution: walked(
          [
            [
              ["Read the length", "读出长度"],
              t(
                `The ends are $${at(A)}$ and $${at(B)}$, so $L = \\sqrt{${dx * dx} + ${dy * dy}} = ${L}$.`,
                `端点为 $${at(A)}$ 和 $${at(B)}$，所以 $L = \\sqrt{${dx * dx} + ${dy * dy}} = ${L}$。`,
              ),
            ],
            [
              ["Evaluate at the midpoint", "求中点处的值"],
              t(`At the midpoint $${midPoint}$, $f = ${mid.toLatex()}$.`, `在中点 $${midPoint}$ 处，$f = ${mid.toLatex()}$。`),
            ],
            [["Multiply", "相乘"], t(`$${L} \\cdot ${midIn} = ${answer.toLatex()}$.`, `$${L} \\cdot ${midIn} = ${answer.toLatex()}$。`)],
          ],
          t(
            `Along $\\mathbf{r}(t) = ${at(A)} + t(${dx}, ${dy})$, $f$ runs from $${f(A)}$ to $${f(B)}$ at a steady rate, so $\\int_0^1 f \\cdot ${L}\\,dt = ${L}\\left(${inside}\\right) = ${answer.toLatex()}$.`,
            `沿 $\\mathbf{r}(t) = ${at(A)} + t(${dx}, ${dy})$，$f$ 从 $${f(A)}$ 匀速变到 $${f(B)}$，所以 $\\int_0^1 f \\cdot ${L}\\,dt = ${L}\\left(${inside}\\right) = ${answer.toLatex()}$。`,
          ),
        ),
      }),
      figure: fig(
        { xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 },
        [
          { kind: "segment", a: A, b: B, accent: true },
          { kind: "point", at: A },
          { kind: "point", at: B },
        ],
        [`A segment from ${at(A)} to ${at(B)}.`, `从 ${at(A)} 到 ${at(B)} 的线段。`],
      ),
    };
  },
);

const circleIntegral = {
  ...point(
    "a-scalar-line-integral-over-a-drawn-circle",
    ["A scalar line integral over a drawn circle", "所画圆上的标量线积分"],
    [
      "On a circle of radius $R$, $ds = R\\,d\\theta$. The cosine and sine terms integrate to zero over a full turn, so for a linear $f$ the integral is $2\\pi R$ times the value of $f$ at the center. For $f(x, y) = x$ on the circle of radius $2$ centered at $(1, 0)$, the integral is $2\\pi \\cdot 2 \\cdot 1 = 4\\pi$.\n\n> **Watch out.** Use the value of $f$ at the center read from the drawing, not at the origin, and the circumference $2\\pi R$, not the area $\\pi R^2$.",
      "在半径为 $R$ 的圆上，$ds = R\\,d\\theta$。余弦和正弦项在一整圈上积分为零，所以对线性函数 $f$，积分是 $2\\pi R$ 乘以 $f$ 在圆心的值。对 $f(x, y) = x$，在以 $(1, 0)$ 为圆心、半径为 $2$ 的圆上，积分为 $2\\pi \\cdot 2 \\cdot 1 = 4\\pi$。\n\n> **注意。** 要用 $f$ 在图中圆心处的值，不是原点处的值；要用周长 $2\\pi R$，不是面积 $\\pi R^2$。",
    ],
    (rng) => {
      const R = rng.int(1, 4);
      const cx = rng.int(-3, 3);
      const cy = rng.int(-3, 3);
      const m = rng.int(-3, 3);
      const n = rng.pick([-3, -2, -1, 1, 2, 3]);
      let c = rng.int(-3, 3);
      while (m * cx + n * cy + c === 0) c = rng.int(-3, 3);
      const center = m * cx + n * cy + c;
      const k = 2 * R * center;
      const fx = terms([
        [m, "x"],
        [n, "y"],
        [c, ""],
      ]);
      const wave = terms([
        [m * R, "\\cos\\theta"],
        [n * R, "\\sin\\theta"],
      ]);
      return {
        ...numberProblem({
          prompt: t(
            `Let $f(x, y) = ${fx}$. Over the drawn circle $C$, $\\oint_C f\\,ds = k\\pi$. Find $k$.`,
            `设 $f(x, y) = ${fx}$。在所画的圆 $C$ 上，$\\oint_C f\\,ds = k\\pi$。求 $k$。`,
          ),
          answer: k,
          mistakes: apart(k, [
            why(
              R * center,
              "That uses $\\pi R$ for the length of the circle; it is $2\\pi R$.",
              "那是把圆周长当作 $\\pi R$；它是 $2\\pi R$。",
            ),
            why(
              2 * R * c,
              `That evaluates $f$ at the origin; the center of the drawn circle is $(${cx}, ${cy})$.`,
              `那是在原点求 $f$ 的值；所画圆的圆心是 $(${cx}, ${cy})$。`,
            ),
            why(
              2 * R * R * center,
              `That multiplies by $R$ twice; $ds = ${R}\\,d\\theta$ brings one factor of $R$.`,
              `那是乘了两次 $R$；$ds = ${R}\\,d\\theta$ 只带来一个因子 $R$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the circle", "读出圆"],
                t(
                  `The center is $(${cx}, ${cy})$ and $R = ${R}$, so the length is $${piTimes(2 * R)}$.`,
                  `圆心为 $(${cx}, ${cy})$，$R = ${R}$，所以周长为 $${piTimes(2 * R)}$。`,
                ),
              ],
              [["Evaluate at the center", "求圆心处的值"], t(`$f(${cx}, ${cy}) = ${center}$.`, `$f(${cx}, ${cy}) = ${center}$。`)],
              [
                ["Multiply", "相乘"],
                t(
                  `$\\oint_C f\\,ds = ${piTimes(2 * R)} \\cdot ${paren(center)} = ${piTimes(k)}$, so $k = ${k}$.`,
                  `$\\oint_C f\\,ds = ${piTimes(2 * R)} \\cdot ${paren(center)} = ${piTimes(k)}$，所以 $k = ${k}$。`,
                ),
              ],
            ],
            t(
              `With $x = ${terms([
                [cx, ""],
                [R, "\\cos\\theta"],
              ])}$, $y = ${terms([
                [cy, ""],
                [R, "\\sin\\theta"],
              ])}$, $f = ${center} ${wave.startsWith("-") ? "-" : "+"} ${wave.replace(/^-/, "")}$. The $\\cos\\theta$ and $\\sin\\theta$ terms integrate to $0$ over a full turn, leaving $\\int_0^{2\\pi} ${paren(center)} \\cdot ${R}\\,d\\theta = ${piTimes(k)}$.`,
              `取 $x = ${terms([
                [cx, ""],
                [R, "\\cos\\theta"],
              ])}$，$y = ${terms([
                [cy, ""],
                [R, "\\sin\\theta"],
              ])}$，则 $f = ${center} ${wave.startsWith("-") ? "-" : "+"} ${wave.replace(/^-/, "")}$。$\\cos\\theta$ 与 $\\sin\\theta$ 项在一整圈上积分为 $0$，剩下 $\\int_0^{2\\pi} ${paren(center)} \\cdot ${R}\\,d\\theta = ${piTimes(k)}$。`,
            ),
          ),
        }),
        figure: fig(
          8,
          [{ kind: "circle", center: [cx, cy], r: R, accent: true }],
          [`A circle with center (${cx}, ${cy}) and radius ${R}.`, `圆心为 (${cx}, ${cy})、半径为 ${R} 的圆。`],
        ),
      };
    },
  ),
  figure: multivariableDrawings5["line-integrals-of-scalar-functions-over-circles#a-scalar-line-integral-over-a-drawn-circle"],
};

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
    "If $F = \\nabla f$, then $\\int_C F \\cdot dr = f(B) - f(A)$ for a path from $A$ to $B$. The shape of the path plays no part, so only the two ends and the direction of travel are read from the drawing. For $f(x, y) = 4xy$ and a winding path from $(1, 2)$ to $(-1, 3)$, the integral is $f(-1, 3) - f(1, 2) = -12 - 8 = -20$.\n\n> **Watch out.** Read the direction from the arrow: the end the arrow points to is $B$. Taking the ends the other way round flips the sign.",
    "若 $F = \\nabla f$，对从 $A$ 到 $B$ 的路径有 $\\int_C F \\cdot dr = f(B) - f(A)$。路径的形状不起作用，所以只需从图中读出两个端点和行进方向。对 $f(x, y) = 4xy$ 和一条从 $(1, 2)$ 到 $(-1, 3)$ 的弯曲路径，积分为 $f(-1, 3) - f(1, 2) = -12 - 8 = -20$。\n\n> **注意。** 方向由箭头读出：箭头指向的一端是 $B$。把两端弄反，符号就反了。",
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
    let dx = rng.pick([-5, -4, -3, 3, 4, 5]);
    let dy = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    let A: Point = [place(rng, dx, 5), place(rng, dy, 5)];
    while (f([A[0] + dx, A[1] + dy]) === f(A)) {
      dx = rng.pick([-5, -4, -3, 3, 4, 5]);
      dy = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
      A = [place(rng, dx, 5), place(rng, dy, 5)];
    }
    const B: Point = [A[0] + dx, A[1] + dy];
    const path = wiggle(A, B, rng.pick([-2.5, -1.5, 1.5, 2.5]));
    const mid = path[20] as Point;
    const next = path[21] as Point;
    const answer = f(B) - f(A);
    const [p, q] =
      form === "xy"
        ? [a * (B[0] * B[1] - A[0] * A[1]), b * (B[0] - A[0])]
        : [a * (B[0] * B[0] - A[0] * A[0]), b * (B[1] * B[1] - A[1] * A[1])];
    const [termP, termQ] = form === "xy" ? [terms([[a, "xy"]]), terms([[b, "x"]])] : [terms([[a, "x^2"]]), terms([[b, "y^2"]])];
    return {
      ...numberProblem({
        prompt: t(
          `$F = \\nabla f$ with $f(x, y) = ${tex}$. Find $\\int_C F \\cdot dr$ along the drawn path $C$ in the direction of its arrow.`,
          `$F = \\nabla f$，其中 $f(x, y) = ${tex}$。沿所画路径 $C$ 按箭头方向求 $\\int_C F \\cdot dr$。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            -answer,
            "That takes the ends the wrong way round; the arrow points to the end, which comes first in $f(B) - f(A)$.",
            "那是把两端弄反了；箭头指向终点，它在 $f(B) - f(A)$ 中排在前面。",
          ),
          why(
            f(B) + f(A),
            "That adds the two values of $f$; the integral is their difference.",
            "那是把 $f$ 的两个值相加；积分是它们的差。",
          ),
          why(f(B), "That is $f$ at the end alone; the value at the start must be subtracted.", "那只是终点处的 $f$；还要减去起点处的值。"),
          why(
            f(A),
            "That is $f$ at the start alone; the integral is the end value minus the start value.",
            "那只是起点处的 $f$；积分是终点的值减起点的值。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Read the ends", "读出两端"],
              t(`The arrow runs from $A = ${at(A)}$ to $B = ${at(B)}$.`, `箭头从 $A = ${at(A)}$ 指向 $B = ${at(B)}$。`),
            ],
            [
              ["Evaluate f", "求 f 的值"],
              t(`$f${at(B)} = ${f(B)}$ and $f${at(A)} = ${f(A)}$.`, `$f${at(B)} = ${f(B)}$，$f${at(A)} = ${f(A)}$。`),
            ],
            [["Subtract", "相减"], t(`$${f(B)} - ${paren(f(A))} = ${answer}$.`, `$${f(B)} - ${paren(f(A))} = ${answer}$。`)],
          ],
          t(
            `Term by term: $${termP}$ changes by $${p}$ and $${termQ}$ changes by $${q}$ from $A$ to $B$, and $${p} + ${paren(q)} = ${answer}$.`,
            `逐项计算：从 $A$ 到 $B$，$${termP}$ 改变 $${p}$，$${termQ}$ 改变 $${q}$，而 $${p} + ${paren(q)} = ${answer}$。`,
          ),
        ),
      }),
      figure: fig(
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
    };
  },
);

const pathIndependence = point(
  "comparing-two-drawn-paths-in-a-conservative-field",
  ["Comparing two drawn paths in a conservative field", "比较保守场中的两条所画路径"],
  [
    "In a conservative field the integral depends only on the ends of the path and their order. Paths with the same start and the same end give equal integrals, and reversing a path changes the sign. If one path from $P$ to $R$ gives $8$, every other path from $P$ to $R$ gives $8$ as well, and every path from $R$ to $P$ gives $-8$.\n\n> **Watch out.** Look at both arrows before comparing. The shape of a path never matters, but its direction does: two paths between the same points with opposite arrows give opposite values.",
    "在保守场中，积分只取决于路径的端点及其顺序。起点和终点相同的路径积分相等，反转路径改变符号。若一条从 $P$ 到 $R$ 的路径给出 $8$，则其他每条从 $P$ 到 $R$ 的路径也给出 $8$，而每条从 $R$ 到 $P$ 的路径给出 $-8$。\n\n> **注意。** 比较之前先看两个箭头。路径的形状无关紧要，但方向要紧：连接相同两点、箭头相反的两条路径给出相反的值。",
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
    return {
      ...numberProblem({
        prompt: t(
          `$F$ is a conservative field and $\\int_{C_1} F \\cdot dr = ${value}$. Find $\\int_{C_2} F \\cdot dr$, with each path taken in the direction of its arrow.`,
          `$F$ 是保守场，$\\int_{C_1} F \\cdot dr = ${value}$。求 $\\int_{C_2} F \\cdot dr$，每条路径按箭头方向。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            -answer,
            same2
              ? "That reverses $C_2$; both arrows point to the same end, so the values are equal."
              : "That ignores the arrows; $C_2$ runs the opposite way to $C_1$, so its value has the opposite sign.",
            same2
              ? "那是把 $C_2$ 反向了；两个箭头指向同一端，所以两个值相等。"
              : "那是忽略了箭头；$C_2$ 与 $C_1$ 方向相反，所以它的值符号相反。",
          ),
          why(0, "That treats $C_2$ as a closed loop; it joins two different points.", "那是把 $C_2$ 当成了闭路；它连接的是两个不同的点。"),
          why(
            2 * value,
            "That adds the two paths together; the question asks for $C_2$ alone.",
            "那是把两条路径加在一起；题目只问 $C_2$。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Read the arrows", "读出箭头"],
              t(
                `$C_1$ runs from $${at(A)}$ to $${at(B)}$, and $C_2$ runs from $${same2 ? at(A) : at(B)}$ to $${same2 ? at(B) : at(A)}$.`,
                `$C_1$ 从 $${at(A)}$ 到 $${at(B)}$，$C_2$ 从 $${same2 ? at(A) : at(B)}$ 到 $${same2 ? at(B) : at(A)}$。`,
              ),
            ],
            [
              ["Compare the ends", "比较端点"],
              same2
                ? t(
                    "Both paths run from the same start to the same end, so in a conservative field the integrals are equal.",
                    "两条路径的起点和终点都相同，所以在保守场中积分相等。",
                  )
                : t(
                    "The paths join the same two points in opposite directions, so the integrals have opposite signs.",
                    "两条路径以相反方向连接相同的两点，所以积分符号相反。",
                  ),
            ],
            [["Give the value", "写出数值"], t(`$\\int_{C_2} F \\cdot dr = ${answer}$.`, `$\\int_{C_2} F \\cdot dr = ${answer}$。`)],
          ],
          same2
            ? t(
                `Following $C_1$ and then $C_2$ backwards is a closed loop, and $${value} - ${paren(answer)} = 0$, as it must be for a conservative field.`,
                `沿 $C_1$ 走、再沿 $C_2$ 反向返回构成闭路，而 $${value} - ${paren(answer)} = 0$，正符合保守场的要求。`,
              )
            : t(
                `Following $C_1$ and then $C_2$ is a closed loop, and $${value} + ${paren(answer)} = 0$, as it must be for a conservative field.`,
                `沿 $C_1$ 走、再沿 $C_2$ 走构成闭路，而 $${value} + ${paren(answer)} = 0$，正符合保守场的要求。`,
              ),
        ),
      }),
      figure: fig(
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
    };
  },
);

/** orientedRect draws a rectangle with an arrow on its bottom side that shows its orientation. */
const orientedRect = (r: ReturnType<typeof gridRect>, counter: boolean): PlaneMark[] => [
  { kind: "polygon", points: rectangle(r.x0, r.y0, r.x1, r.y1) },
  { kind: "path", points: [...rectangle(r.x0, r.y0, r.x1, r.y1), [r.x0, r.y0]], accent: true },
  head([(r.x0 + r.x1) / 2, r.y0], [counter ? 1 : -1, 0]),
];

const greenCirculation = {
  ...point(
    "circulation-around-a-drawn-oriented-rectangle",
    ["Circulation around a drawn oriented rectangle", "沿所画有向矩形的环量"],
    [
      "Green's theorem gives $\\oint_C F \\cdot dr = \\iint_R \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$ for a counterclockwise boundary, turning a sum around the edge into a sum over the inside. A clockwise boundary changes the sign. For $F = (-5y,\\ 2x)$ around $[0, 2] \\times [0, 1]$ drawn clockwise, the curl is $2 - (-5) = 7$, the area is $2$, and the result is $-14$.\n\n> **Watch out.** Read the arrow before you finish: a clockwise arrow negates the counterclockwise value. And with $P = -ay$, $\\frac{\\partial P}{\\partial y} = -a$, so the curl is $b + a$.",
      "格林定理对逆时针边界给出 $\\oint_C F \\cdot dr = \\iint_R \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$，把沿边界的求和变成区域内部的求和。顺时针边界改变符号。对 $F = (-5y,\\ 2x)$ 沿按顺时针方向画出的 $[0, 2] \\times [0, 1]$，旋度为 $2 - (-5) = 7$，面积为 $2$，结果为 $-14$。\n\n> **注意。** 最后一定要看箭头：顺时针箭头把逆时针的值变号。而且 $P = -ay$ 时 $\\frac{\\partial P}{\\partial y} = -a$，所以旋度是 $b + a$。",
    ],
    (rng) => {
      const r = gridRect(rng);
      const a = rng.pick([-3, -2, -1, 1, 2, 3]);
      const b = rng.pick([-3, -2, -1, 1, 2, 3]);
      const counter = rng.bool();
      const curl = a + b;
      const area = r.w * r.h;
      const sign = counter ? 1 : -1;
      const answer = sign * curl * area || 0;
      const bottom = -a * r.y0 * r.w;
      const top = a * r.y1 * r.w;
      const right = b * r.x1 * r.h;
      const left = -b * r.x0 * r.h;
      return {
        ...numberProblem({
          prompt: t(
            `Let $F = (${terms([[-a, "y"]])},\\ ${terms([[b, "x"]])})$. Find $\\oint_C F \\cdot dr$ around the drawn rectangle in the direction of its arrow.`,
            `设 $F = (${terms([[-a, "y"]])},\\ ${terms([[b, "x"]])})$。沿所画矩形按箭头方向求 $\\oint_C F \\cdot dr$。`,
          ),
          answer,
          mistakes: apart(answer, [
            why(
              -answer,
              `That ignores the arrow; it runs ${counter ? "counterclockwise, so no sign change is needed" : "clockwise, which negates the result"}.`,
              `那是忽略了箭头；它是${counter ? "逆时针方向，不需要变号" : "顺时针方向，结果要变号"}。`,
            ),
            why(
              sign * curl,
              "That stops at the curl; Green's theorem multiplies it by the area of the rectangle.",
              "那是停在了旋度上；格林定理要把它乘以矩形的面积。",
            ),
            why(
              sign * 2 * (r.w + r.h) * curl,
              "That multiplies the curl by the perimeter; the curl is integrated over the area.",
              "那是用旋度乘以周长；旋度是在面积上积分的。",
            ),
            why(
              sign * b * area,
              `That uses only $\\frac{\\partial Q}{\\partial x} = ${b}$; $\\frac{\\partial P}{\\partial y}$ is subtracted from it.`,
              `那是只用了 $\\frac{\\partial Q}{\\partial x} = ${b}$；还要减去 $\\frac{\\partial P}{\\partial y}$。`,
            ),
            why(
              sign * (b - a) * area,
              `That takes $\\frac{\\partial P}{\\partial y}$ as $${a}$; with $P = ${terms([[-a, "y"]])}$ it is $${-a}$.`,
              `那是把 $\\frac{\\partial P}{\\partial y}$ 当成 $${a}$；$P = ${terms([[-a, "y"]])}$ 时它是 $${-a}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Compute the curl", "计算旋度"],
                t(
                  `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${b} - ${paren(-a)} = ${curl}$.`,
                  `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${b} - ${paren(-a)} = ${curl}$。`,
                ),
              ],
              [
                ["Find the area", "求面积"],
                t(`The rectangle is $${r.w}$ by $${r.h}$, so its area is $${area}$.`, `矩形长 $${r.w}$、宽 $${r.h}$，面积为 $${area}$。`),
              ],
              [
                ["Read the arrow", "看箭头"],
                t(
                  counter
                    ? `The arrow runs counterclockwise, so the result is $${curl} \\cdot ${area} = ${answer}$.`
                    : `The arrow runs clockwise, so the result is $-(${curl} \\cdot ${area}) = ${answer}$.`,
                  counter
                    ? `箭头为逆时针方向，所以结果为 $${curl} \\cdot ${area} = ${answer}$。`
                    : `箭头为顺时针方向，所以结果为 $-(${curl} \\cdot ${area}) = ${answer}$。`,
                ),
              ],
            ],
            t(
              `Edge by edge counterclockwise, the bottom gives $${bottom}$, the right $${right}$, the top $${top}$ and the left $${left}$, adding to $${curl * area}$${counter ? "" : `, and the clockwise arrow negates it to $${answer}$`}.`,
              `逆时针逐边计算，底边给出 $${bottom}$，右边 $${right}$，顶边 $${top}$，左边 $${left}$，合计 $${curl * area}$${counter ? "" : `，顺时针箭头使它变号为 $${answer}$`}。`,
            ),
          ),
        }),
        figure: fig(7, orientedRect(r, counter), [
          `A rectangle from (${r.x0}, ${r.y0}) to (${r.x1}, ${r.y1}) with an arrow going ${counter ? "counterclockwise" : "clockwise"}.`,
          `从 (${r.x0}, ${r.y0}) 到 (${r.x1}, ${r.y1}) 的矩形，箭头为${counter ? "逆时针" : "顺时针"}方向。`,
        ]),
      };
    },
  ),
  figure: multivariableDrawings6["greens-theorem-in-circulation-curl-form#circulation-around-a-drawn-oriented-rectangle"],
};

const greenHole = point(
  "greens-theorem-on-a-drawn-frame-with-a-hole",
  ["Green's theorem on a drawn frame with a hole", "所画带洞框架上的格林定理"],
  [
    "For a region with a hole, the boundary is the outer curve taken counterclockwise and the inner curve taken clockwise, so that the region stays on the left. Green's theorem then applies to the area of the region without the hole. For $F = (0,\\ 6x)$ on a $4$ by $4$ frame with a $2$ by $1$ hole, the curl is $6$, the frame has area $16 - 2 = 14$, and the integral is $84$.\n\n> **Watch out.** Subtract the area of the hole; do not add it, and do not use the outer rectangle alone.",
    "对带洞区域，边界是逆时针的外曲线和顺时针的内曲线，使区域总在左侧。格林定理于是作用在去掉洞后的面积上。对 $F = (0,\\ 6x)$，在 $4 \\times 4$ 的框架上挖去 $2 \\times 1$ 的洞，旋度为 $6$，框架面积为 $16 - 2 = 14$，积分为 $84$。\n\n> **注意。** 要减去洞的面积，不能加上，也不能只用外矩形。",
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
    return {
      ...numberProblem({
        prompt: t(
          `Let $F = (0,\\ ${terms([[c, "x"]])})$, and let $R$ be the shaded frame. Find $\\oint_{\\partial R} F \\cdot dr$, with the boundary oriented so that $R$ stays on the left.`,
          `设 $F = (0,\\ ${terms([[c, "x"]])})$，$R$ 是阴影框架。求 $\\oint_{\\partial R} F \\cdot dr$，边界的方向使 $R$ 总在左侧。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            c * w * h,
            "That uses the outer rectangle and ignores the hole, which is not part of $R$.",
            "那是用了外矩形而忽略了洞；洞不属于 $R$。",
          ),
          why(c * (w * h + iw * ih), "That adds the area of the hole; it has to be subtracted.", "那是加上了洞的面积；洞的面积要减去。"),
          why(c * iw * ih, "That uses the hole alone; the region is the frame around it.", "那是只用了洞；区域是它周围的框架。"),
          why(area, `That is the area of the frame alone; the curl $${c}$ multiplies it.`, `那只是框架的面积；还要乘以旋度 $${c}$。`),
        ]),
        solution: walked(
          [
            [
              ["Compute the curl", "计算旋度"],
              t(
                `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${c} - 0 = ${c}$.`,
                `$\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} = ${c} - 0 = ${c}$。`,
              ),
            ],
            [
              ["Find the area of the frame", "求框架面积"],
              t(
                `$${w} \\cdot ${h} - ${iw} \\cdot ${ih} = ${w * h} - ${iw * ih} = ${area}$.`,
                `$${w} \\cdot ${h} - ${iw} \\cdot ${ih} = ${w * h} - ${iw * ih} = ${area}$。`,
              ),
            ],
            [["Multiply", "相乘"], t(`$${c} \\cdot ${area} = ${answer}$.`, `$${c} \\cdot ${area} = ${answer}$。`)],
          ],
          t(
            `Curve by curve: the outer rectangle counterclockwise gives $${c} \\cdot ${w * h} = ${c * w * h}$, and the hole clockwise gives $-${paren(c)} \\cdot ${iw * ih} = ${-c * iw * ih}$; together $${answer}$.`,
            `逐条曲线计算：外矩形逆时针给出 $${c} \\cdot ${w * h} = ${c * w * h}$，洞顺时针给出 $-${paren(c)} \\cdot ${iw * ih} = ${-c * iw * ih}$；合计 $${answer}$。`,
          ),
        ),
      }),
      figure: fig(
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
    };
  },
);

const fluxSegment = point(
  "flux-of-a-constant-field-across-a-drawn-segment",
  ["Flux of a constant field across a drawn segment", "常向量场穿过所画线段的通量"],
  [
    "With the normal pointing to the right of the direction of travel, $n\\,ds = (dy, -dx)$. For a constant field $(a, b)$ on a segment with displacement $(\\Delta x, \\Delta y)$, the flux is $a\\,\\Delta y - b\\,\\Delta x$. For $F = (5, 1)$ across an arrow with displacement $(2, 6)$, the flux is $5 \\cdot 6 - 1 \\cdot 2 = 28$.\n\n> **Watch out.** Read the displacement as tip minus tail. Then $a$ goes with $\\Delta y$ and $b$ with $\\Delta x$, and the second product is subtracted; $a\\,\\Delta x + b\\,\\Delta y$ would be the work, not the flux.",
    "法向量指向行进方向的右侧时，$n\\,ds = (dy, -dx)$。对位移为 $(\\Delta x, \\Delta y)$ 的线段上的常向量场 $(a, b)$，通量为 $a\\,\\Delta y - b\\,\\Delta x$。对 $F = (5, 1)$ 穿过位移为 $(2, 6)$ 的箭头，通量为 $5 \\cdot 6 - 1 \\cdot 2 = 28$。\n\n> **注意。** 位移按箭头减箭尾读出。然后 $a$ 配 $\\Delta y$，$b$ 配 $\\Delta x$，第二个乘积要减去；$a\\,\\Delta x + b\\,\\Delta y$ 是功，不是通量。",
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
    const B: Point = [A[0] + dx, A[1] + dy];
    return {
      ...numberProblem({
        prompt: t(
          `Find the flux of the constant field $F = (${a}, ${b})$ across the drawn arrow, with the normal pointing to the right of the arrow's direction.`,
          `求常向量场 $F = (${a}, ${b})$ 穿过所画箭头的通量，法向量指向箭头方向的右侧。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            -answer,
            "That uses the normal on the left of the arrow; the normal here points to its right.",
            "那是用了箭头左侧的法向量；这里的法向量指向右侧。",
          ),
          why(
            a * dx + b * dy,
            "That dots the field with the displacement, which gives the work along the arrow, not the flux across it.",
            "那是用场点乘位移，得到的是沿箭头的功，而不是穿过它的通量。",
          ),
          why(
            a * dy + b * dx,
            "That adds $b\\,\\Delta x$; with $n\\,ds = (dy, -dx)$ it is subtracted.",
            "那是加上了 $b\\,\\Delta x$；由 $n\\,ds = (dy, -dx)$，它要减去。",
          ),
        ]),
        solution: walked(
          [
            [
              ["Read the displacement", "读出位移"],
              t(`Tip minus tail: $${at(B)} - ${at(A)} = (${dx}, ${dy})$.`, `箭头减箭尾：$${at(B)} - ${at(A)} = (${dx}, ${dy})$。`),
            ],
            [
              ["Apply the flux formula", "代入通量公式"],
              t(
                `$a\\,\\Delta y - b\\,\\Delta x = ${paren(a)} \\cdot ${paren(dy)} - ${paren(b)} \\cdot ${paren(dx)} = ${answer}$.`,
                `$a\\,\\Delta y - b\\,\\Delta x = ${paren(a)} \\cdot ${paren(dy)} - ${paren(b)} \\cdot ${paren(dx)} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `Split the arrow into a horizontal move of $${dx}$ and a vertical move of $${dy}$ with the same ends: the horizontal piece gives $-${paren(b)} \\cdot ${paren(dx)} = ${-b * dx}$ and the vertical piece $${paren(a)} \\cdot ${paren(dy)} = ${a * dy}$, which add to $${answer}$.`,
            `把箭头拆成水平移动 $${dx}$ 和竖直移动 $${dy}$，两端不变：水平段给出 $-${paren(b)} \\cdot ${paren(dx)} = ${-b * dx}$，竖直段给出 $${paren(a)} \\cdot ${paren(dy)} = ${a * dy}$，合计 $${answer}$。`,
          ),
        ),
      }),
      figure: fig(
        6,
        [{ kind: "arrow", from: A, to: B, accent: true }],
        [`An arrow from ${at(A)} to ${at(B)}.`, `从 ${at(A)} 到 ${at(B)} 的箭头。`],
      ),
    };
  },
);

const greenFlux = point(
  "outward-flux-across-a-drawn-boundary",
  ["Outward flux across a drawn boundary", "穿出所画边界的通量"],
  [
    "The flux form of Green's theorem says the outward flux across a closed curve is the integral of the divergence over the region inside. When the divergence is constant, that is the divergence times the area. For $F = (5x,\\ y)$ across the triangle $(0, 0)$, $(2, 0)$, $(0, 3)$, the divergence is $6$ and the area $3$, so the flux is $18$.\n\n> **Watch out.** The divergence adds the two coefficients, $P_x + Q_y$, and it multiplies the area; the divergence alone is not the flux.",
    "格林定理的通量形式指出，穿出闭曲线的通量是散度在内部区域上的积分。散度为常数时，就是散度乘以面积。对 $F = (5x,\\ y)$ 穿出三角形 $(0, 0)$、$(2, 0)$、$(0, 3)$，散度为 $6$，面积为 $3$，所以通量为 $18$。\n\n> **注意。** 散度是两个系数相加，即 $P_x + Q_y$，并且要乘以面积；散度本身不是通量。",
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
    return {
      ...numberProblem({
        prompt: t(
          `Let $F = (${terms([[a, "x"]])},\\ ${terms([[b, "y"]])})$. Find the outward flux of $F$ across the boundary of the shaded region.`,
          `设 $F = (${terms([[a, "x"]])},\\ ${terms([[b, "y"]])})$。求 $F$ 穿出阴影区域边界的通量。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            answer.neg(),
            "That is the inward flux; the outward normal points away from the region.",
            "那是向内的通量；外法向量指向区域之外。",
          ),
          why(
            area.mul(Q.of(a - b)),
            `That subtracts $Q_y = ${b}$; the divergence is $P_x + Q_y$.`,
            `那是减去了 $Q_y = ${b}$；散度是 $P_x + Q_y$。`,
          ),
          why(area, "That is the area alone; the divergence multiplies it.", "那只是面积；还要乘以散度。"),
          why(a + b, "That is the divergence alone; it has to be integrated over the area.", "那只是散度；还要在面积上积分。"),
        ]),
        solution: walked(
          [
            [
              ["Compute the divergence", "计算散度"],
              t(`$P_x + Q_y = ${a} + ${paren(b)} = ${a + b}$.`, `$P_x + Q_y = ${a} + ${paren(b)} = ${a + b}$。`),
            ],
            [
              ["Find the area", "求面积"],
              t(
                triangle
                  ? `The right triangle has legs $${w}$ and $${h}$, so its area is $${area.toLatex()}$.`
                  : `The rectangle is $${w}$ by $${h}$, so its area is $${area.toLatex()}$.`,
                triangle
                  ? `直角三角形两直角边为 $${w}$ 和 $${h}$，面积为 $${area.toLatex()}$。`
                  : `矩形长 $${w}$、宽 $${h}$，面积为 $${area.toLatex()}$。`,
              ),
            ],
            [
              ["Multiply", "相乘"],
              t(
                `$${a + b} \\cdot ${area.toLatex()} = ${answer.toLatex()}$.`,
                `$${a + b} \\cdot ${area.toLatex()} = ${answer.toLatex()}$。`,
              ),
            ],
          ],
          t(
            `Counterclockwise, $\\oint x\\,dy = ${area.toLatex()}$ and $\\oint y\\,dx = -${area.toLatex()}$, so the flux $\\oint (P\\,dy - Q\\,dx)$ is $${a} \\cdot ${area.toLatex()} - ${paren(b)} \\cdot (-${area.toLatex()}) = ${answer.toLatex()}$ again.`,
            `逆时针时 $\\oint x\\,dy = ${area.toLatex()}$，$\\oint y\\,dx = -${area.toLatex()}$，所以通量 $\\oint (P\\,dy - Q\\,dx)$ 为 $${a} \\cdot ${area.toLatex()} - ${paren(b)} \\cdot (-${area.toLatex()}) = ${answer.toLatex()}$，结果相同。`,
          ),
        ),
      }),
      figure: fig(
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
    };
  },
);

const doubleRect = {
  ...point(
    "a-double-integral-over-a-drawn-rectangle",
    ["A double integral over a drawn rectangle", "所画矩形上的二重积分"],
    [
      "Over a rectangle, the integral of a linear function equals the area times the value at the center, because the terms that change sign around the center cancel. For $x - y + 3$ over $[0, 10] \\times [0, 2]$, the center is $(5, 1)$, where the function is $7$, and the area is $20$, so the integral is $140$.\n\n> **Watch out.** Use the value at the center, not at a corner, and multiply it by the area; the constant term counts too.",
      "在矩形上，线性函数的积分等于面积乘以中心处的值，因为围绕中心变号的项互相抵消。对 $[0, 10] \\times [0, 2]$ 上的 $x - y + 3$，中心为 $(5, 1)$，函数在那里等于 $7$，面积为 $20$，所以积分为 $140$。\n\n> **注意。** 要用中心处的值而不是角点处的值，并乘以面积；常数项也要算上。",
    ],
    (rng) => {
      const r = gridRect(rng);
      const m = rng.int(-3, 3);
      const n = rng.pick([-3, -2, -1, 1, 2, 3]);
      const c = rng.int(-3, 3);
      const area = r.w * r.h;
      const center = Q.of(m * (r.x0 + r.x1) + n * (r.y0 + r.y1) + 2 * c, 2);
      const answer = Q.of(area * (m * (r.x0 + r.x1) + n * (r.y0 + r.y1) + 2 * c), 2);
      const f = terms([
        [m, "x"],
        [n, "y"],
        [c, ""],
      ]);
      const mid = `\\left(${Q.of(r.x0 + r.x1, 2).toLatex()}, ${Q.of(r.y0 + r.y1, 2).toLatex()}\\right)`;
      const px = Q.of(m * (r.x1 * r.x1 - r.x0 * r.x0) * r.h, 2);
      const py = Q.of(n * (r.y1 * r.y1 - r.y0 * r.y0) * r.w, 2);
      const sum = [px, py, Q.of(c * area)].map((v) => (v.sign() < 0 ? `(${v.toLatex()})` : v.toLatex())).join(" + ");
      return {
        ...numberProblem({
          prompt: t(`Find $\\iint_R (${f})\\,dA$ over the drawn rectangle $R$.`, `求所画矩形 $R$ 上的 $\\iint_R (${f})\\,dA$。`),
          answer,
          mistakes: apart(answer, [
            why(center, `That is the value at the center; multiply it by the area $${area}$.`, `那是中心处的值；还要乘以面积 $${area}$。`),
            why(area, "That is the area, the integral of $1$; the integrand is not $1$.", "那是面积，即 $1$ 的积分；被积函数不是 $1$。"),
            why(
              Q.of(area * (m * (r.x0 + r.x1) + n * (r.y0 + r.y1)), 2),
              `The constant $${c}$ is left out; it adds $${c} \\cdot ${area}$.`,
              `漏了常数 $${c}$；它贡献 $${c} \\cdot ${area}$。`,
            ),
            why(
              Q.of(area * (m * r.x1 + n * r.y1 + c), 1),
              `That uses the value at the corner $(${r.x1}, ${r.y1})$; the average of a linear function is its value at the center.`,
              `那是用了角点 $(${r.x1}, ${r.y1})$ 处的值；线性函数的平均值是它在中心处的值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the rectangle", "读出矩形"],
                t(
                  `$R = [${r.x0}, ${r.x1}] \\times [${r.y0}, ${r.y1}]$ has area $${r.w} \\cdot ${r.h} = ${area}$ and center $${mid}$.`,
                  `$R = [${r.x0}, ${r.x1}] \\times [${r.y0}, ${r.y1}]$ 的面积为 $${r.w} \\cdot ${r.h} = ${area}$，中心为 $${mid}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `At the center the function equals $${center.toLatex()}$, so the integral is $${area} \\cdot ${center.sign() < 0 ? `(${center.toLatex()})` : center.toLatex()} = ${answer.toLatex()}$.`,
                  `函数在中心处等于 $${center.toLatex()}$，所以积分为 $${area} \\cdot ${center.sign() < 0 ? `(${center.toLatex()})` : center.toLatex()} = ${answer.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Term by term, the iterated integrals give $${sum} = ${answer.toLatex()}$.`,
              `逐项计算，二次积分给出 $${sum} = ${answer.toLatex()}$。`,
            ),
          ),
        }),
        figure: fig(
          7,
          [{ kind: "polygon", points: rectangle(r.x0, r.y0, r.x1, r.y1) }],
          [`A shaded rectangle from (${r.x0}, ${r.y0}) to (${r.x1}, ${r.y1}).`, `从 (${r.x0}, ${r.y0}) 到 (${r.x1}, ${r.y1}) 的阴影矩形。`],
        ),
      };
    },
  ),
  figure: multivariableDrawings3["double-integrals-over-rectangular-domains#a-double-integral-over-a-drawn-rectangle"],
};

const typeTwoLimits = {
  ...point(
    "type-ii-limits-of-a-drawn-triangle",
    ["Type II limits of a drawn triangle", "所画三角形的 II 型积分限"],
    [
      "For a type II description, fix $y$ and read the horizontal slice: its left end and right end, written as functions of $y$, are the inner limits, and the range of $y$ gives the outer limits. For the triangle with corners $(0, 0)$, $(9, 0)$ and $(9, 3)$, the slanted side is $x = 3y$, a slice runs from $x = 3y$ to $x = 9$, and $y$ runs from $0$ to $3$: $\\int_0^3 \\int_{3y}^{9} f\\,dx\\,dy$.\n\n> **Watch out.** Solve the slanted side for $x$: through $(0, 0)$ and $(a, b)$ it is $x = \\frac{a}{b}y$, not $\\frac{b}{a}y$. The outer limit is the height $b$ of the triangle, not its width.",
      "II 型描述中，固定 $y$，读水平截线：它的左端和右端写成 $y$ 的函数就是内层积分限，$y$ 的范围给出外层积分限。对顶点为 $(0, 0)$、$(9, 0)$、$(9, 3)$ 的三角形，斜边为 $x = 3y$，截线从 $x = 3y$ 到 $x = 9$，$y$ 从 $0$ 到 $3$：$\\int_0^3 \\int_{3y}^{9} f\\,dx\\,dy$。\n\n> **注意。** 要把斜边解成 $x$ 的式子：过 $(0, 0)$ 与 $(a, b)$ 的斜边是 $x = \\frac{a}{b}y$，不是 $\\frac{b}{a}y$。外层上限是三角形的高 $b$，不是宽。",
    ],
    (rng) => {
      const a = rng.int(2, 7);
      const b = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== a));
      const right = rng.bool();
      const slope = Q.of(a, b).toLatex();
      const edge = `${slope}y`;
      const form = (lo: string, hi: string, top: string) => t(...same(`\\int_0^{${top}} \\int_{${lo}}^{${hi}} f(x, y)\\,dx\\,dy`));
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
      const otherSide = t(
        `That is the other triangle, ${right ? `to the left of the slanted side; the shaded one lies between the side and $x = ${a}$` : `to the right of the slanted side; the shaded one lies between $x = 0$ and the side`}.`,
        `那是另一个三角形，${right ? `在斜边左侧；阴影部分在斜边与 $x = ${a}$ 之间` : `在斜边右侧；阴影部分在 $x = 0$ 与斜边之间`}。`,
      );
      const height = t(
        `$y$ runs up to the height $${b}$ of the triangle, not its width $${a}$.`,
        `$y$ 一直到三角形的高 $${b}$，而不是宽 $${a}$。`,
      );
      const flipped = t(
        `On the side through $(0, 0)$ and $(${a}, ${b})$, $x = ${edge}$; $${wrongEdge}$ inverts the slope.`,
        `在过 $(0, 0)$ 与 $(${a}, ${b})$ 的斜边上 $x = ${edge}$；$${wrongEdge}$ 把斜率颠倒了。`,
      );
      return explainedChoice(rng, {
        prompt: t("Which iterated integral, with $x$ inside, covers the shaded triangle?", "哪个累次积分（$x$ 在内层）覆盖阴影三角形？"),
        correct,
        wrong: right
          ? [
              { option: form("0", edge, String(b)), why: otherSide },
              { option: form(edge, String(a), String(a)), why: height },
              { option: form(wrongEdge, String(a), String(b)), why: flipped },
            ]
          : [
              { option: form(edge, String(a), String(b)), why: otherSide },
              { option: form("0", edge, String(a)), why: height },
              { option: form("0", wrongEdge, String(b)), why: flipped },
            ],
        solution: walked(
          [
            [
              ["Find the slanted side", "求斜边"],
              t(
                `The slanted side joins $(0, 0)$ and $(${a}, ${b})$, so on it $x = ${edge}$.`,
                `斜边连接 $(0, 0)$ 和 $(${a}, ${b})$，所以斜边上 $x = ${edge}$。`,
              ),
            ],
            [
              ["Read a horizontal slice", "读水平截线"],
              t(
                `A slice at height $y$ runs ${right ? `from that side to $x = ${a}$` : "from $x = 0$ to that side"}, with $y$ from $0$ to $${b}$.`,
                `高度 $y$ 处的截线${right ? `从斜边到 $x = ${a}$` : "从 $x = 0$ 到斜边"}，$y$ 从 $0$ 到 $${b}$。`,
              ),
            ],
          ],
          t(
            `With $f = 1$ the integral gives $\\int_0^{${b}} ${right ? `\\left(${a} - ${edge}\\right)` : edge}\\,dy = ${Q.of(a * b, 2).toLatex()}$, the area $\\frac{${a} \\cdot ${b}}{2}$ of the triangle.`,
            `取 $f = 1$，积分为 $\\int_0^{${b}} ${right ? `\\left(${a} - ${edge}\\right)` : edge}\\,dy = ${Q.of(a * b, 2).toLatex()}$，正是三角形的面积 $\\frac{${a} \\cdot ${b}}{2}$。`,
          ),
        ),
        figure: fig(
          { xMin: -1, xMax: 8, yMin: -1, yMax: 8 },
          [{ kind: "polygon", points }],
          [`A shaded triangle with corners ${points.map(at).join(", ")}.`, `阴影三角形，顶点为 ${points.map(at).join("、")}。`],
        ),
      });
    },
  ),
  figure: multivariableDrawings4["double-integrals-over-type-ii-regions#type-ii-limits-of-a-drawn-triangle"],
};

const partitioned = {
  ...point(
    "a-double-integral-over-a-drawn-l-shape",
    ["A double integral over a drawn L-shape", "所画 L 形上的二重积分"],
    [
      "Cut the region into rectangles and add the integrals over the pieces. On a rectangle from $x = 0$ to $x = w$ of height $h$, the integral of $x$ is $h \\cdot \\frac{w^2}{2}$. For the L-shape with corners $(0, 0)$, $(8, 0)$, $(8, 1)$, $(2, 1)$, $(2, 4)$ and $(0, 4)$, cutting along $y = 1$ gives $1 \\cdot \\frac{64}{2} + 3 \\cdot \\frac{4}{2} = 32 + 6 = 38$.\n\n> **Watch out.** The upper piece is only as wide as the narrow arm and only as tall as the part above the cut; using the full width or the full height counts the empty corner.",
      "把区域切成矩形，再把各块上的积分相加。在从 $x = 0$ 到 $x = w$、高为 $h$ 的矩形上，$x$ 的积分为 $h \\cdot \\frac{w^2}{2}$。对顶点为 $(0, 0)$、$(8, 0)$、$(8, 1)$、$(2, 1)$、$(2, 4)$、$(0, 4)$ 的 L 形，沿 $y = 1$ 切开得 $1 \\cdot \\frac{64}{2} + 3 \\cdot \\frac{4}{2} = 32 + 6 = 38$。\n\n> **注意。** 上面一块只有窄臂那么宽，也只有切线以上那么高；用整个宽度或整个高度就把空角也算进去了。",
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
      const box = useX ? Q.of(high * w * w, 2) : Q.of(k * w * high);
      const corner = useX ? Q.of((high - low) * (w * w - narrow * narrow), 2) : Q.of(k * (w - narrow) * (high - low));
      const boxWhy = t(
        `That covers the whole box $[0, ${w}] \\times [0, ${high}]$, including the empty corner $[${narrow}, ${w}] \\times [${low}, ${high}]$.`,
        `那覆盖了整个矩形 $[0, ${w}] \\times [0, ${high}]$，包括空角 $[${narrow}, ${w}] \\times [${low}, ${high}]$。`,
      );
      const lowerWhy = t(
        `That is the lower piece only; the upper arm $[0, ${narrow}] \\times [${low}, ${high}]$ adds to it.`,
        `那只是下面一块；还要加上上面的窄臂 $[0, ${narrow}] \\times [${low}, ${high}]$。`,
      );
      return {
        ...numberProblem({
          prompt: t(`Find $\\iint_R ${prompt}\\,dA$ over the shaded region $R$.`, `求阴影区域 $R$ 上的 $\\iint_R ${prompt}\\,dA$。`),
          answer,
          mistakes: apart(
            answer,
            useX
              ? [
                  { value: Q.of(high * w * w, 2), why: boxWhy },
                  why(
                    Q.of(area),
                    `That is the area $${area}$; the integrand $x$ is not $1$.`,
                    `那是面积 $${area}$；被积函数 $x$ 不是 $1$。`,
                  ),
                  { value: Q.of(low * w * w, 2), why: lowerWhy },
                  why(
                    Q.of(area * w, 2),
                    `That multiplies the area by $\\frac{${w}}{2}$, the middle of the bottom piece; the upper arm is centered at $\\frac{${narrow}}{2}$.`,
                    `那是用面积乘以下面一块的中点 $\\frac{${w}}{2}$；上面窄臂的中点在 $\\frac{${narrow}}{2}$。`,
                  ),
                ]
              : [
                  { value: Q.of(k * w * high), why: boxWhy },
                  why(
                    Q.of(area),
                    `That is the area $${area}$; the integrand $${k}$ multiplies it.`,
                    `那是面积 $${area}$；还要乘以被积函数 $${k}$。`,
                  ),
                  { value: Q.of(k * w * low), why: lowerWhy },
                  why(
                    Q.of(k * (w + high)),
                    "That adds two side lengths; an integral of a constant is the constant times an area.",
                    "那是把两条边长相加；常数的积分是常数乘以面积。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Cut the region", "切开区域"],
                t(
                  `Cut along $y = ${low}$: the lower piece is $[0, ${w}] \\times [0, ${low}]$ and the upper piece is $[0, ${narrow}] \\times [${low}, ${high}]$.`,
                  `沿 $y = ${low}$ 切开：下面一块是 $[0, ${w}] \\times [0, ${low}]$，上面一块是 $[0, ${narrow}] \\times [${low}, ${high}]$。`,
                ),
              ],
              [
                ["Add the pieces", "把两块相加"],
                useX
                  ? t(
                      `The lower piece gives $${low} \\cdot \\frac{${w * w}}{2}$ and the upper piece gives $${high - low} \\cdot \\frac{${narrow * narrow}}{2}$, with sum $${moment.toLatex()}$.`,
                      `下面一块得 $${low} \\cdot \\frac{${w * w}}{2}$，上面一块得 $${high - low} \\cdot \\frac{${narrow * narrow}}{2}$，和为 $${moment.toLatex()}$。`,
                    )
                  : t(
                      `The pieces have areas $${w * low}$ and $${narrow * (high - low)}$, so the area is $${area}$ and the integral is $${k} \\cdot ${area} = ${k * area}$.`,
                      `两块面积为 $${w * low}$ 和 $${narrow * (high - low)}$，所以面积为 $${area}$，积分为 $${k} \\cdot ${area} = ${k * area}$。`,
                    ),
              ],
            ],
            t(
              `The box $[0, ${w}] \\times [0, ${high}]$ gives $${box.toLatex()}$ and the empty corner gives $${corner.toLatex()}$; their difference is $${answer.toLatex()}$.`,
              `矩形 $[0, ${w}] \\times [0, ${high}]$ 给出 $${box.toLatex()}$，空角给出 $${corner.toLatex()}$；两者之差为 $${answer.toLatex()}$。`,
            ),
          ),
        }),
        figure: fig(
          { xMin: -1, xMax: 8, yMin: -1, yMax: 9 },
          [{ kind: "polygon", points }],
          [`A shaded L-shape with corners ${points.map(at).join(", ")}.`, `阴影 L 形，顶点为 ${points.map(at).join("、")}。`],
        ),
      };
    },
  ),
  figure: multivariableDrawings4["double-integrals-over-partitioned-regions#a-double-integral-over-a-drawn-l-shape"],
};

const polarArea = {
  ...point(
    "the-area-of-a-drawn-piece-of-a-ring",
    ["The area of a drawn piece of a ring", "所画圆环一部分的面积"],
    [
      "In polar coordinates $dA = r\\,dr\\,d\\theta$, so a piece of a ring with radii $a < b$ and angle $\\Delta\\theta$ has area $\\int \\int_a^b r\\,dr\\,d\\theta = \\frac{1}{2}\\Delta\\theta\\,(b^2 - a^2)$. The factor $r$ appears because a small polar patch gets wider the farther it lies from the origin. A half ring between radii $2$ and $7$ has area $\\frac{1}{2} \\cdot \\pi \\cdot (49 - 4) = \\frac{45}{2}\\pi$.\n\n> **Watch out.** Use the difference of the squared radii, $b^2 - a^2$, not the squared width $(b - a)^2$, and keep the factor $\\frac{1}{2}$ from $\\int r\\,dr$.",
      "极坐标下 $dA = r\\,dr\\,d\\theta$，所以半径 $a < b$、角度 $\\Delta\\theta$ 的一段圆环面积为 $\\int \\int_a^b r\\,dr\\,d\\theta = \\frac{1}{2}\\Delta\\theta\\,(b^2 - a^2)$。出现因子 $r$，是因为极坐标的小块离原点越远就越宽。半径 $2$ 与 $7$ 之间的半个圆环面积为 $\\frac{1}{2} \\cdot \\pi \\cdot (49 - 4) = \\frac{45}{2}\\pi$。\n\n> **注意。** 要用半径平方之差 $b^2 - a^2$，不是宽度的平方 $(b - a)^2$；并保留 $\\int r\\,dr$ 带来的因子 $\\frac{1}{2}$。",
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
      return {
        ...numberProblem({
          prompt: t("The area of the shaded region is $k\\pi$. Find $k$.", "阴影区域的面积为 $k\\pi$。求 $k$。"),
          answer,
          mistakes: apart(answer, [
            why(
              Q.of(quarters * (b - a) * (b - a), 4),
              `That squares the width $${b - a}$; the radial integral gives $${b}^2 - ${a}^2$.`,
              `那是把宽度 $${b - a}$ 平方；径向积分给出 $${b}^2 - ${a}^2$。`,
            ),
            why(Q.of(n, 2), "The factor $\\frac{1}{2}$ from $\\int r\\,dr$ is missing.", "漏了 $\\int r\\,dr$ 带来的因子 $\\frac{1}{2}$。"),
            why(
              Q.of(quarters * b * b, 4),
              `That starts $r$ at $0$; the hole of radius $${a}$ is not shaded.`,
              `那是让 $r$ 从 $0$ 开始；半径 $${a}$ 的空洞没有涂阴影。`,
            ),
            why(
              Q.of(quarters * (b - a), 4),
              "That integrates $1\\,dr$; the area element is $r\\,dr\\,d\\theta$.",
              "那是对 $1\\,dr$ 积分；面积元是 $r\\,dr\\,d\\theta$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read the drawing", "读图"],
                t(
                  `The radii are $${a}$ and $${b}$ and the angle is $${piTimes(quarters, 2)}$.`,
                  `半径为 $${a}$ 和 $${b}$，角度为 $${piTimes(quarters, 2)}$。`,
                ),
              ],
              [
                ["Integrate", "积分"],
                t(
                  `$\\frac{1}{2} \\cdot ${piTimes(quarters, 2)} \\cdot (${b * b} - ${a * a}) = ${piTimes(n, 4)}$, so $k = ${answer.toLatex()}$.`,
                  `$\\frac{1}{2} \\cdot ${piTimes(quarters, 2)} \\cdot (${b * b} - ${a * a}) = ${piTimes(n, 4)}$，所以 $k = ${answer.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The whole ring has area $${piTimes(b * b - a * a)}$, and the shaded piece is $${Q.of(quarters, 4).toLatex()}$ of it: $${piTimes(n, 4)}$.`,
              `整个圆环面积为 $${piTimes(b * b - a * a)}$，阴影部分占它的 $${Q.of(quarters, 4).toLatex()}$：$${piTimes(n, 4)}$。`,
            ),
          ),
        }),
        figure: fig(
          7,
          [{ kind: "polygon", points: ring }],
          [
            `A shaded piece of a ring about the origin, between radii ${a} and ${b}, covering ${quarters} quarter turn${quarters === 1 ? "" : "s"}.`,
            `绕原点的一段阴影圆环，半径在 ${a} 和 ${b} 之间，占 ${quarters} 个四分之一圈。`,
          ],
        ),
      };
    },
  ),
  figure: multivariableDrawings4["double-integrals-between-polar-curves#the-area-of-a-drawn-piece-of-a-ring"],
};

const cylindricalPoint = {
  ...point(
    "cylindrical-coordinates-of-a-drawn-point",
    ["Cylindrical coordinates of a drawn point", "所画点的柱坐标"],
    [
      "The coordinates $r$ and $\\theta$ describe the shadow of the point in the $xy$-plane: $r$ is its distance from the origin and $\\theta$ is its angle from the positive $x$-axis. The coordinate $z$ does not change. A point of height $2$ whose shadow is $(-6, 6)$ has $r = \\sqrt{36 + 36} = 6\\sqrt{2}$ and $\\theta = \\frac{3\\pi}{4}$, so its cylindrical coordinates are $\\left(6\\sqrt{2}, \\frac{3\\pi}{4}, 2\\right)$.\n\n> **Watch out.** Measure $\\theta$ counterclockwise from the positive $x$-axis and read the quadrant from the signs of $x$ and $y$. For a diagonal shadow $r$ carries a factor $\\sqrt{2}$; it is not $|x| + |y|$.",
      "坐标 $r$ 和 $\\theta$ 描述点在 $xy$ 平面上的投影：$r$ 是它到原点的距离，$\\theta$ 是它与 $x$ 轴正方向的夹角。坐标 $z$ 不变。高度为 $2$、投影为 $(-6, 6)$ 的点有 $r = \\sqrt{36 + 36} = 6\\sqrt{2}$，$\\theta = \\frac{3\\pi}{4}$，所以柱坐标为 $\\left(6\\sqrt{2}, \\frac{3\\pi}{4}, 2\\right)$。\n\n> **注意。** $\\theta$ 从 $x$ 轴正方向逆时针量，象限由 $x$、$y$ 的符号判断。对角线方向的投影，$r$ 带因子 $\\sqrt{2}$，不是 $|x| + |y|$。",
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
      const coordinates = (rr: string, n: number) => {
        const s = `(r, \\theta, z) = \\left(${rr},\\ ${piTimes(n, 4)},\\ ${z}\\right)`;
        return t(`$${s}$`, `$${s}$`);
      };
      const mirrored = (8 - octant) % 8 === octant ? (octant + 2) % 8 : (8 - octant) % 8;
      return explainedChoice(rng, {
        prompt: t(
          `The drawing shows the $xy$-plane and the shadow $P$ of a point whose height is $z = ${z}$. What are its cylindrical coordinates, with $0 \\le \\theta < 2\\pi$?`,
          `图中是 $xy$ 平面，$P$ 是一个高度为 $z = ${z}$ 的点的投影。它的柱坐标是什么（$0 \\le \\theta < 2\\pi$）？`,
        ),
        correct: coordinates(r, octant),
        wrong: [
          {
            option: coordinates(r, (octant + 4) % 8),
            why: t(`That angle points the opposite way, to $${at([-P[0], -P[1]])}$`, `这个角指向相反方向，到 $${at([-P[0], -P[1]])}$`),
          },
          {
            option: coordinates(r, (octant + 2) % 8),
            why: t(
              `That angle is a quarter turn too far, pointing to $${at([-P[1], P[0]])}$`,
              `这个角多转了四分之一圈，指向 $${at([-P[1], P[0]])}$`,
            ),
          },
          {
            option: coordinates(r, mirrored),
            why: t(
              `That angle points to $${at([a * (dirs[mirrored] as Point)[0], a * (dirs[mirrored] as Point)[1]])}$; $\\theta$ is measured counterclockwise from the positive $x$-axis`,
              `这个角指向 $${at([a * (dirs[mirrored] as Point)[0], a * (dirs[mirrored] as Point)[1]])}$；$\\theta$ 从 $x$ 轴正方向逆时针量`,
            ),
          },
          {
            option: coordinates(diagonal ? String(2 * a) : `${a}\\sqrt{2}`, octant),
            why: diagonal
              ? t(
                  `$${2 * a}$ is $|x| + |y|$; the distance from the origin is $\\sqrt{${a * a} + ${a * a}} = ${r}$`,
                  `$${2 * a}$ 是 $|x| + |y|$；到原点的距离是 $\\sqrt{${a * a} + ${a * a}} = ${r}$`,
                )
              : t(
                  `$P$ lies on an axis, so its distance from the origin is $${a}$, with no factor $\\sqrt{2}$`,
                  `$P$ 在坐标轴上，所以它到原点的距离是 $${a}$，没有因子 $\\sqrt{2}$`,
                ),
          },
        ],
        solution: walked(
          [
            [
              ["Find r", "求 r"],
              t(
                `$P = ${at(P)}$, so $r = \\sqrt{${P[0] * P[0]} + ${P[1] * P[1]}} = ${r}$.`,
                `$P = ${at(P)}$，所以 $r = \\sqrt{${P[0] * P[0]} + ${P[1] * P[1]}} = ${r}$。`,
              ),
            ],
            [
              ["Find θ", "求 θ"],
              t(
                `The angle from the positive $x$-axis, counterclockwise, is $${piTimes(octant, 4)}$, and $z = ${z}$ stays.`,
                `从 $x$ 轴正方向逆时针量得角度为 $${piTimes(octant, 4)}$，$z = ${z}$ 不变。`,
              ),
            ],
          ],
          t(
            `$x = r\\cos\\theta$ and $y = r\\sin\\theta$ with $r = ${r}$ and $\\theta = ${piTimes(octant, 4)}$ give back $${at(P)}$.`,
            `由 $r = ${r}$，$\\theta = ${piTimes(octant, 4)}$，$x = r\\cos\\theta$，$y = r\\sin\\theta$ 恢复出 $${at(P)}$。`,
          ),
        ),
        figure: fig(
          6,
          [
            { kind: "segment", a: [0, 0], b: P, dashed: true },
            { kind: "point", at: P, label: "P", dir: "n" },
          ],
          [`The point P at ${at(P)} joined to the origin by a dashed segment.`, `点 P 位于 ${at(P)}，用虚线与原点相连。`],
        ),
      });
    },
  ),
  figure: multivariableDrawings5["cylindrical-polar-coordinates#cylindrical-coordinates-of-a-drawn-point"],
};

const partialSlope = {
  ...point(
    "a-partial-derivative-from-a-drawn-slice",
    ["A partial derivative from a drawn slice", "由所画截线读偏导数"],
    [
      "Holding $y$ fixed slices the surface into a curve in the $xz$-plane. The partial derivative in $x$ is the slope of the tangent to that curve, read as rise over run. If the tangent at $(4, 1)$ also passes through $(8, -4)$, it falls $5$ over a run of $4$, so $f_{x} = -\\frac{5}{4}$ there.\n\n> **Watch out.** Divide the change in $z$ by the change in $x$, not the other way round, and give the slope a minus sign when the line falls to the right. The coordinates of the point are not the slope.",
      "固定 $y$ 把曲面截成 $xz$ 平面上的曲线。对 $x$ 的偏导数就是这条曲线切线的斜率，用纵向变化除以横向变化读出。若 $(4, 1)$ 处的切线还过 $(8, -4)$，它在横向 $4$ 内下降 $5$，所以该处 $f_{x} = -\\frac{5}{4}$。\n\n> **注意。** 用 $z$ 的变化除以 $x$ 的变化，不要颠倒；直线向右下降时斜率带负号。点的坐标不是斜率。",
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
      return {
        ...numberProblem({
          prompt: t(
            `The solid curve is the slice of $z = f(x, y)$ at $y = ${y0}$, and the dashed line is its tangent at the marked point, with $x = ${x0}$. Find $\\frac{\\partial f}{\\partial x}(${x0}, ${y0})$.`,
            `实线是 $z = f(x, y)$ 在 $y = ${y0}$ 处的截线，虚线是它在标记点（$x = ${x0}$）处的切线。求 $\\frac{\\partial f}{\\partial x}(${x0}, ${y0})$。`,
          ),
          answer,
          mistakes: apart(answer, [
            why(
              Q.of(run, rise),
              "That is run over rise; the slope divides the change in $z$ by the change in $x$.",
              "那是横向变化除以纵向变化；斜率是 $z$ 的变化除以 $x$ 的变化。",
            ),
            why(
              Q.of(-rise, run),
              rise > 0
                ? "The tangent rises to the right, so the slope is positive."
                : "The tangent falls to the right, so the slope is negative.",
              rise > 0 ? "切线向右上升，所以斜率为正。" : "切线向右下降，所以斜率为负。",
            ),
            why(z0, `$${z0}$ is the height of the point, not the slope of the tangent.`, `$${z0}$ 是该点的高度，不是切线的斜率。`),
            why(
              y0 === 0 ? x0 : y0,
              "A coordinate of the point is not the slope; read the rise and run of the dashed line.",
              "点的坐标不是斜率；要读虚线的纵向和横向变化。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Read two points of the tangent", "读出切线上的两点"],
                t(`The dashed line passes through $${at(P)}$ and $${at(R)}$.`, `虚线过 $${at(P)}$ 和 $${at(R)}$。`),
              ],
              [
                ["Divide rise by run", "纵向变化除以横向变化"],
                t(
                  `$\\frac{\\partial f}{\\partial x} = \\frac{${z0 + rise} - ${paren(z0)}}{${x0 + run} - ${paren(x0)}} = \\frac{${rise}}{${run}} = ${answer.toLatex()}$.`,
                  `$\\frac{\\partial f}{\\partial x} = \\frac{${z0 + rise} - ${paren(z0)}}{${x0 + run} - ${paren(x0)}} = \\frac{${rise}}{${run}} = ${answer.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Starting at height $${z0}$ and moving $${run}$ in $x$ with slope $${answer.toLatex()}$ reaches $${z0} + ${paren(rise)} = ${z0 + rise}$, the height of the open point.`,
              `从高度 $${z0}$ 出发，以斜率 $${answer.toLatex()}$ 沿 $x$ 移动 $${run}$，到达 $${z0} + ${paren(rise)} = ${z0 + rise}$，正是空心点的高度。`,
            ),
          ),
        }),
        figure: fig(
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
      };
    },
  ),
  figure: multivariableDrawings2["geometric-interpretations-of-partial-derivatives#a-partial-derivative-from-a-drawn-slice"],
};

const directionalFromArrows = point(
  "a-directional-derivative-from-two-drawn-arrows",
  ["A directional derivative from two drawn arrows", "由两个所画箭头求方向导数"],
  [
    "The directional derivative along $d$ uses the unit vector: $D_u f = \\nabla f \\cdot \\frac{d}{\\lVert d \\rVert}$. Read both arrows as coordinate pairs, take their dot product, and divide by the length of $d$. With $\\nabla f = (6, 1)$ and $d = (-8, 6)$, the dot product is $-48 + 6 = -42$ and $\\lVert d \\rVert = 10$, so $D_u f = -4.2$.\n\n> **Watch out.** Divide by $\\lVert d \\rVert$ exactly once: skipping the division or dividing by $\\lVert d \\rVert^2$ are both wrong, because only a unit vector gives a rate per unit distance.",
    "沿 $d$ 的方向导数用单位向量：$D_u f = \\nabla f \\cdot \\frac{d}{\\lVert d \\rVert}$。把两个箭头读成坐标，求点积，再除以 $d$ 的长度。若 $\\nabla f = (6, 1)$，$d = (-8, 6)$，点积为 $-48 + 6 = -42$，$\\lVert d \\rVert = 10$，所以 $D_u f = -4.2$。\n\n> **注意。** 只除以一次 $\\lVert d \\rVert$，不是除以 $\\lVert d \\rVert^2$，也不能不除：只有单位向量才给出每单位距离的变化率。",
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
    const sum = `${g[0]} \\cdot ${paren(d[0])} + ${paren(g[1])} \\cdot ${paren(d[1])}`;
    const rate = product < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex();
    return {
      ...numberProblem({
        prompt: t(
          `At a point, the arrows show $\\nabla f$ and a direction $d$. Find the directional derivative of $f$ in the direction of $d$.`,
          `在某点处，箭头表示 $\\nabla f$ 和方向 $d$。求 $f$ 沿 $d$ 方向的方向导数。`,
        ),
        answer,
        mistakes: apart(answer, [
          why(
            product,
            "That is $\\nabla f \\cdot d$ without dividing by the length of $d$.",
            "那是 $\\nabla f \\cdot d$，没有除以 $d$ 的长度。",
          ),
          why(
            Q.of(product, L * L),
            "That divides by $\\lVert d \\rVert^2$; the unit vector divides by $\\lVert d \\rVert$ only once.",
            "那是除以了 $\\lVert d \\rVert^2$；单位向量只除以一次 $\\lVert d \\rVert$。",
          ),
          why(Q.of(-product, L), "The sign is reversed, as if moving along $-d$.", "符号反了，相当于沿 $-d$ 方向。"),
        ]),
        solution: walked(
          [
            [
              ["Read the arrows", "读出箭头"],
              t(
                `$\\nabla f = ${at(g)}$ and $d = ${at(d)}$, with $\\lVert d \\rVert = ${L}$.`,
                `$\\nabla f = ${at(g)}$，$d = ${at(d)}$，$\\lVert d \\rVert = ${L}$。`,
              ),
            ],
            [
              ["Take the dot product", "求点积"],
              t(`$\\nabla f \\cdot d = ${sum} = ${product}$.`, `$\\nabla f \\cdot d = ${sum} = ${product}$。`),
            ],
            [
              ["Divide by the length", "除以长度"],
              t(`$D_u f = \\frac{${product}}{${L}} = ${answer.toLatex()}$.`, `$D_u f = \\frac{${product}}{${L}} = ${answer.toLatex()}$。`),
            ],
          ],
          t(
            `The rate cannot exceed $\\lVert \\nabla f \\rVert = \\sqrt{${g[0] * g[0] + g[1] * g[1]}}$ in size, and $${L} \\cdot ${rate} = ${product}$ gives back the dot product.`,
            `变化率的大小不超过 $\\lVert \\nabla f \\rVert = \\sqrt{${g[0] * g[0] + g[1] * g[1]}}$，且 $${L} \\cdot ${rate} = ${product}$ 还原出点积。`,
          ),
        ),
      }),
      figure: fig(
        6,
        [
          { kind: "arrow", from: [0, 0], to: g, accent: true },
          { kind: "label", at: g, text: "∇f", dir: "n" },
          { kind: "arrow", from: [0, 0], to: d },
          { kind: "label", at: d, text: "d", dir: "s" },
        ],
        [`Arrows from the origin: the gradient to ${at(g)} and d to ${at(d)}.`, `从原点出发的箭头：梯度指向 ${at(g)}，d 指向 ${at(d)}。`],
      ),
    };
  },
);

const criticalKind = point(
  "the-kind-of-critical-point-from-labeled-level-curves",
  ["The kind of critical point from labeled level curves", "由带标注的等值线判断临界点类型"],
  [
    "Closed level curves around a point mean a local extremum: a minimum if the values grow outward, a maximum if they fall outward. Curves that open away from the point like hyperbolas, with values above on one axis and below on the other, mean a saddle. For ellipses around $P$ labeled $10$ on the inner curve and $13$ on the outer one, every step away from $P$ climbs, so $P$ is a local minimum.\n\n> **Watch out.** Closed curves alone do not say minimum: read the labels, since values that fall outward make $P$ a maximum. And hyperbola-shaped curves mean a saddle even when the labels on one side grow outward.",
    "围绕一点的闭合等值线表示局部极值：数值向外增大是极小值，向外减小是极大值。像双曲线一样分开、一条轴上数值较大而另一条轴上较小的等值线表示鞍点。若围绕 $P$ 的椭圆内圈标 $10$、外圈标 $13$，离开 $P$ 的每一步都在上升，所以 $P$ 是局部极小值点。\n\n> **注意。** 仅凭闭合曲线不能断定是极小值：要看标注，数值向外减小时 $P$ 是极大值点。双曲线形的等值线即使一侧的标注向外增大，也表示鞍点。",
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
    const reading: Record<typeof kind, Pair> = {
      min: ["The curves close around $P$ and the labels grow outward.", "等值线围绕 $P$ 闭合，标注的数值向外增大。"],
      max: ["The curves close around $P$ and the labels fall outward.", "等值线围绕 $P$ 闭合，标注的数值向外减小。"],
      saddle: [
        `The curves open away from $P$, with values above $${c}$ along one axis and below it along the other.`,
        `等值线在 $P$ 处分开，一条轴上数值高于 $${c}$，另一条轴上低于它。`,
      ],
    };
    const wrongWhy = (x: typeof kind): Pair => {
      if (kind === "saddle")
        return [
          `The curves do not close around $P$: going one way the values rise to $${c + 1}$, going the other they fall to $${c - 1}$.`,
          `等值线没有围绕 $P$ 闭合：朝一个方向数值升到 $${c + 1}$，朝另一个方向降到 $${c - 1}$。`,
        ];
      if (x === "saddle")
        return [
          "The curves close around $P$, and the values change the same way in every direction, so $f$ does not rise one way and fall the other.",
          "等值线围绕 $P$ 闭合，各个方向上数值的变化相同，所以 $f$ 不会一边上升一边下降。",
        ];
      return kind === "min"
        ? [
            `The labels grow outward from $${c + 1}$ to $${c + 4}$, so $P$ is the lowest point nearby, not the highest.`,
            `标注向外从 $${c + 1}$ 增大到 $${c + 4}$，所以 $P$ 是附近的最低点，不是最高点。`,
          ]
        : [
            `The labels fall outward from $${c - 1}$ to $${c - 4}$, so $P$ is the highest point nearby, not the lowest.`,
            `标注向外从 $${c - 1}$ 减小到 $${c - 4}$，所以 $P$ 是附近的最高点，不是最低点。`,
          ];
    };
    const noTest: Pair = [
      "The labeled curves settle it directly, and the curves here come from a quadratic whose discriminant is not zero.",
      "带标注的等值线直接给出了答案，而且这里的曲线来自判别式不为零的二次函数。",
    ];
    const near = kind === "max" ? c - 1 : c + 1;
    return explainedChoice(rng, {
      prompt: t(
        "The curves are labeled level curves of $f$, and $P$ is a critical point. What kind of point is $P$?",
        "这些曲线是带数值标注的 $f$ 的等值线，$P$ 是临界点。$P$ 是什么类型的点？",
      ),
      correct: t(...names[kind]),
      wrong: [
        ...(["min", "max", "saddle"] as const).filter((x) => x !== kind).map((x) => ({ option: t(...names[x]), why: t(...wrongWhy(x)) })),
        {
          option: t("A point where the second derivative test gives no information", "二阶导数判别法无法判断的点"),
          why: t(...noTest),
        },
      ],
      solution: walked(
        [
          [
            ["Read the shape", "看形状"],
            kind === "saddle"
              ? t("The curves open away from $P$ like hyperbolas.", "等值线像双曲线一样在 $P$ 处分开。")
              : t("The curves close around $P$.", "等值线围绕 $P$ 闭合。"),
          ],
          [["Read the labels", "看标注"], t(...reading[kind])],
        ],
        t(
          kind === "saddle"
            ? `Stepping from $P$ toward the right, $f$ reaches $${c + 1}$; stepping up, it reaches $${c - 1}$: one rise and one fall, as at a saddle.`
            : `Stepping from $P$ toward the right, $f$ reaches $${near}$ and then $${kind === "max" ? c - 4 : c + 4}$; every direction does the same, so $P$ is the ${kind === "max" ? "highest" : "lowest"} point nearby.`,
          kind === "saddle"
            ? `从 $P$ 向右走，$f$ 达到 $${c + 1}$；向上走，达到 $${c - 1}$：一升一降，正如鞍点。`
            : `从 $P$ 向右走，$f$ 先达到 $${near}$，再达到 $${kind === "max" ? c - 4 : c + 4}$；各个方向都一样，所以 $P$ 是附近的${kind === "max" ? "最高" : "最低"}点。`,
        ),
      ),
      figure: fig(7, marks, [
        kind === "saddle"
          ? `Hyperbola-shaped level curves around P at (${h}, ${k}), labeled ${word(c + 1)} and ${word(c + 4)} on one axis and ${word(c - 1)} and ${word(c - 4)} on the other.`
          : `Closed level curves around P at (${h}, ${k}), labeled ${word(c + sign)} on the inner curve and ${word(c + 4 * sign)} on the outer curve.`,
        kind === "saddle"
          ? `围绕 P (${h}, ${k}) 的双曲线形等值线，一条轴上标 ${word(c + 1)} 和 ${word(c + 4)}，另一条轴上标 ${word(c - 1)} 和 ${word(c - 4)}。`
          : `围绕 P (${h}, ${k}) 的闭合等值线，内圈标 ${word(c + sign)}，外圈标 ${word(c + 4 * sign)}。`,
      ]),
    });
  },
);

const lagrangeLine = {
  ...point(
    "the-minimum-on-a-drawn-line-from-tangent-level-curves",
    ["The minimum on a drawn line from tangent level curves", "由相切等值线求所画直线上的最小值"],
    [
      "At a constrained extremum the level curve of $f$ is tangent to the constraint, since $\\nabla f$ is parallel to the normal of the constraint. For $f = x^2 + y^2$ the level curves are circles, and the tangent one touches the line at the foot of the perpendicular from the origin. For the vertical line $x = 5$, the circle $x^2 + y^2 = 25$ touches it at $(5, 0)$, so the minimum of $f$ on the line is $25$.\n\n> **Watch out.** Use the circle that just touches the line: a larger circle crosses it, so the line also reaches lower values, and a smaller one misses it. The value of $f$ is the squared radius, $p^2 + q^2$, not $|p| + |q|$.",
      "在约束极值处，$f$ 的等值线与约束相切，因为 $\\nabla f$ 平行于约束的法向量。对 $f = x^2 + y^2$，等值线是圆，相切的圆在原点到直线的垂足处接触直线。对竖直线 $x = 5$，圆 $x^2 + y^2 = 25$ 在 $(5, 0)$ 处与它相切，所以 $f$ 在该直线上的最小值是 $25$。\n\n> **注意。** 要用恰好与直线相切的圆：更大的圆与直线相交，直线上还有更小的值；更小的圆与直线不相交。$f$ 的值是半径的平方 $p^2 + q^2$，不是 $|p| + |q|$。",
    ],
    (rng) => {
      const nonzero = [-4, -3, -2, -1, 1, 2, 3, 4];
      const p = rng.pick(nonzero);
      const q = rng.pick(nonzero);
      const value = p * p + q * q;
      const circle = (x: number, y: number) => x * x + y * y;
      const small = Math.max(1, value - 4);
      const levels = [value, value + 6, small];
      return {
        ...numberProblem({
          prompt: t(
            "The solid line is a constraint, and the dashed curves are level curves of $f(x, y) = x^2 + y^2$. Find the minimum of $f$ on the line.",
            "实线是约束，虚线是 $f(x, y) = x^2 + y^2$ 的等值线。求 $f$ 在直线上的最小值。",
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              Math.abs(p) + Math.abs(q),
              `$f$ squares the coordinates: at $${at([p, q])}$ it is $${p * p} + ${q * q}$, not $${Math.abs(p)} + ${Math.abs(q)}$.`,
              `$f$ 要把坐标平方：在 $${at([p, q])}$ 处是 $${p * p} + ${q * q}$，不是 $${Math.abs(p)} + ${Math.abs(q)}$。`,
            ),
            why(
              value + 6,
              `The circle at level $${value + 6}$ crosses the line, so the line also passes through lower levels.`,
              `等值 $${value + 6}$ 的圆与直线相交，所以直线还经过更低的等值线。`,
            ),
            why(
              small,
              `The circle at level $${small}$ does not reach the line, so no point of the line has that value.`,
              `等值 $${small}$ 的圆碰不到直线，所以直线上没有点取这个值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the tangent circle", "找出相切的圆"],
                t(
                  `The dashed circle tangent to the line touches it at $${at([p, q])}$, where the radius meets the line at a right angle.`,
                  `与直线相切的虚线圆在 $${at([p, q])}$ 处接触直线，半径在那里与直线垂直。`,
                ),
              ],
              [["Evaluate f there", "在该点求 f"], t(`$f = ${p * p} + ${q * q} = ${value}$.`, `$f = ${p * p} + ${q * q} = ${value}$。`)],
            ],
            t(
              `The line runs in the direction $(${q}, ${-p})$, perpendicular to $(${p}, ${q})$, so every point of it is $(${p}, ${q}) + s(${q}, ${-p})$ with $f = ${value} + ${value}s^2 \\ge ${value}$.`,
              `直线方向为 $(${q}, ${-p})$，与 $(${p}, ${q})$ 垂直，所以直线上每一点为 $(${p}, ${q}) + s(${q}, ${-p})$，$f = ${value} + ${value}s^2 \\ge ${value}$。`,
            ),
          ),
        }),
        figure: fig(
          8,
          [
            { kind: "line", a: [p, q], b: [p + q, q - p], accent: true },
            ...levels.map((level): PlaneMark => ({ kind: "contour", f: circle, level, dashed: true })),
          ],
          [
            `The line through ${at([p, q])} and ${at([p + q, q - p])}, and dashed circles about the origin.`,
            `过 ${at([p, q])} 和 ${at([p + q, q - p])} 的直线，以及以原点为圆心的虚线圆。`,
          ],
        ),
      };
    },
  ),
  figure: multivariableDrawings3["lagrange-multipliers-with-one-constraint#the-minimum-on-a-drawn-line-from-tangent-level-curves"],
};

const areaChange = {
  ...point(
    "an-integral-through-a-drawn-change-of-variables",
    ["An integral through a drawn change of variables", "由所画的变量替换求积分"],
    [
      "A linear map with images $T(1, 0)$ and $T(0, 1)$ has Jacobian determinant equal to the determinant of those two vectors. It multiplies every area by its absolute value, so $\\iint_R k\\,dA = k \\lvert J \\rvert \\cdot$ (area of the rectangle in $uv$). For $T(1, 0) = (3, 1)$, $T(0, 1) = (1, 2)$ and the rectangle $[0, 1] \\times [0, 3]$, $\\lvert J \\rvert = 6 - 1 = 5$ and $\\iint_R 2\\,dA = 2 \\cdot 5 \\cdot 3 = 30$.\n\n> **Watch out.** Three factors multiply: the constant $k$, the Jacobian $\\lvert J \\rvert$ and the area of the rectangle. Leaving out any one of them is the usual slip.",
      "像为 $T(1, 0)$ 和 $T(0, 1)$ 的线性映射，其雅可比行列式等于这两个向量的行列式。它把每个面积乘以其绝对值，所以 $\\iint_R k\\,dA = k \\lvert J \\rvert \\cdot$（$uv$ 中矩形的面积）。对 $T(1, 0) = (3, 1)$，$T(0, 1) = (1, 2)$ 和矩形 $[0, 1] \\times [0, 3]$，$\\lvert J \\rvert = 6 - 1 = 5$，$\\iint_R 2\\,dA = 2 \\cdot 5 \\cdot 3 = 30$。\n\n> **注意。** 三个因子相乘：常数 $k$、雅可比行列式 $\\lvert J \\rvert$ 和矩形面积。漏掉其中任何一个都是常见的失误。",
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
      return {
        ...numberProblem({
          prompt: t(
            `The arrows show $T(1, 0)$ and $T(0, 1)$ for a linear map $T$, and the shaded region $R$ is the image of the rectangle $[0, ${m}] \\times [0, ${n}]$ in the $uv$-plane. Find $\\iint_R ${k}\\,dA$.`,
            `箭头表示线性映射 $T$ 的 $T(1, 0)$ 和 $T(0, 1)$，阴影区域 $R$ 是 $uv$ 平面上矩形 $[0, ${m}] \\times [0, ${n}]$ 的像。求 $\\iint_R ${k}\\,dA$。`,
          ),
          answer,
          mistakes: apart(answer, [
            why(
              k * m * n,
              `That leaves out the Jacobian: $T$ multiplies areas by $${J}$.`,
              `那是漏了雅可比行列式：$T$ 把面积乘以 $${J}$。`,
            ),
            why(
              k * J,
              `That leaves out the area $${m * n}$ of the rectangle $[0, ${m}] \\times [0, ${n}]$.`,
              `那是漏了矩形 $[0, ${m}] \\times [0, ${n}]$ 的面积 $${m * n}$。`,
            ),
            why(J * m * n, `That is the area of $R$; the integrand is the constant $${k}$.`, `那是 $R$ 的面积；被积函数是常数 $${k}$。`),
          ]),
          solution: walked(
            [
              [
                ["Find the Jacobian", "求雅可比行列式"],
                t(
                  `$\\lvert J \\rvert = \\lvert (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rvert = ${J}$.`,
                  `$\\lvert J \\rvert = \\lvert (${u[0]})(${v[1]}) - (${u[1]})(${v[0]}) \\rvert = ${J}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `The rectangle has area $${m * n}$, so the integral is $${k} \\cdot ${J} \\cdot ${m * n} = ${answer}$.`,
                  `矩形面积为 $${m * n}$，所以积分为 $${k} \\cdot ${J} \\cdot ${m * n} = ${answer}$。`,
                ),
              ],
            ],
            t(
              `$R$ is the parallelogram with sides $${at(corners[1] as Point)}$ and $${at(corners[3] as Point)}$ from the origin, of area $${J * m * n}$ by the cross product, and $${k} \\cdot ${J * m * n} = ${answer}$.`,
              `$R$ 是从原点出发、两边为 $${at(corners[1] as Point)}$ 和 $${at(corners[3] as Point)}$ 的平行四边形，由叉积得面积 $${J * m * n}$，而 $${k} \\cdot ${J * m * n} = ${answer}$。`,
            ),
          ),
        }),
        figure: fig(
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
      };
    },
  ),
  figure: multivariableDrawings4["computing-areas-using-a-change-of-variables#an-integral-through-a-drawn-change-of-variables"],
};

const affineImage = {
  ...point(
    "the-image-of-a-drawn-vertex-under-an-affine-map",
    ["The image of a drawn vertex under an affine map", "所画顶点在仿射映射下的像"],
    [
      "An affine map is a linear map followed by a shift. Read the coordinates of the point from the grid and substitute them into the formula, $x$ for $x$ and $y$ for $y$. For $T(x, y) = (4x - y + 1,\\ x + 5y - 2)$ and a vertex at $(2, 3)$, the image is $(8 - 3 + 1,\\ 2 + 15 - 2) = (6, 15)$.\n\n> **Watch out.** Keep the constant terms: they are the shift, and without them you have only the linear part. Read the point as $(x, y)$, across first and then up, so that the coordinates do not trade places.",
      "仿射映射是线性映射再加平移。从网格读出点的坐标，代入公式，$x$ 代 $x$，$y$ 代 $y$。对 $T(x, y) = (4x - y + 1,\\ x + 5y - 2)$ 和顶点 $(2, 3)$，像是 $(8 - 3 + 1,\\ 2 + 15 - 2) = (6, 15)$。\n\n> **注意。** 不要丢掉常数项：它们就是平移，没有它们就只剩线性部分。按 $(x, y)$ 读点，先横后纵，坐标才不会互换。",
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
      const answer = first ? image[0] : image[1];
      const [p, q, s] = first ? [a, b, e] : [c, d, f];
      const run = Q1[0] - P[0];
      const imageQ: Point = [a * Q1[0] + b * Q1[1] + e, c * Q1[0] + d * Q1[1] + f];
      return {
        ...numberProblem({
          prompt: t(
            `For $${map}$, find the ${name[0]} coordinate of the image of the vertex $P$ of the drawn triangle.`,
            `对 $${map}$，求所画三角形的顶点 $P$ 的像的${name[1]}个坐标。`,
          ),
          answer,
          mistakes: apart(answer, [
            why(
              p * P[1] + q * P[0] + s,
              `That puts $${P[1]}$ in for $x$ and $${P[0]}$ in for $y$; $P = ${at(P)}$ has $x = ${P[0]}$.`,
              `那是把 $${P[1]}$ 代给 $x$，把 $${P[0]}$ 代给 $y$；$P = ${at(P)}$ 的 $x = ${P[0]}$。`,
            ),
            why(answer - s, `That is only the linear part; add the shift $${s}$.`, `那只是线性部分；还要加上平移 $${s}$。`),
            why(
              first ? image[1] : image[0],
              `That is the ${first ? "second" : "first"} coordinate of $T(P)$; the question asks for the ${name[0]}.`,
              `那是 $T(P)$ 的${first ? "第二" : "第一"}个坐标；题目问的是${name[1]}个。`,
            ),
          ]),
          solution: walked(
            [
              [["Read the vertex", "读出顶点"], t(`On the grid, $P = ${at(P)}$.`, `从网格读出 $P = ${at(P)}$。`)],
              [
                ["Substitute", "代入"],
                t(
                  `The ${name[0]} coordinate is $${p} \\cdot ${paren(P[0])} + ${paren(q)} \\cdot ${paren(P[1])} + ${paren(s)} = ${answer}$, so $T(P) = ${at(image)}$.`,
                  `${name[1]}个坐标是 $${p} \\cdot ${paren(P[0])} + ${paren(q)} \\cdot ${paren(P[1])} + ${paren(s)} = ${answer}$，所以 $T(P) = ${at(image)}$。`,
                ),
              ],
            ],
            t(
              `The other drawn vertex $${at(Q1)}$ lies $${run}$ across from $P$ and goes to $${at(imageQ)}$; the difference $(${imageQ[0] - image[0]}, ${imageQ[1] - image[1]})$ is $${run}$ times the first column $(${a}, ${c})$, as a linear part plus a shift requires.`,
              `另一个所画顶点 $${at(Q1)}$ 与 $P$ 横向相差 $${run}$，它的像是 $${at(imageQ)}$；差 $(${imageQ[0] - image[0]}, ${imageQ[1] - image[1]})$ 正是第一列 $(${a}, ${c})$ 的 $${run}$ 倍，符合“线性部分加平移”。`,
            ),
          ),
        }),
        figure: fig(
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
      };
    },
  ),
  figure: multivariableDrawings3["the-image-of-an-affine-transformation#the-image-of-a-drawn-vertex-under-an-affine-map"],
};

const inertia = {
  ...point(
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
  ),
  figure: multivariableDrawings8["moments-of-inertia-of-laminas-about-the-coordinate-axes#a-moment-of-inertia-of-a-drawn-rectangle"],
};

const parallelAxis = {
  ...point(
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
  ),
  figure: multivariableDrawings8["the-parallel-axis-theorem#the-parallel-axis-theorem-with-a-drawn-distance"],
};

const circularMotion = {
  ...point(
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
      const asked: Pair =
        kind === "acceleration" ? ["the size of its acceleration", "它的加速度大小"] : ["its angular speed", "它的角速度"];
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
  ),
  figure: multivariableDrawings8["circular-motion-about-the-origin#acceleration-on-a-drawn-circle"],
};

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
    "Spinning a segment about the $x$-axis gives a band with area $\\int 2\\pi y\\,ds$. Since $y$ is linear along the segment, this is $2\\pi$ times the average height times the length $L$:\n\n$$S = 2\\pi \\cdot \\frac{y_{1} + y_{2}}{2} \\cdot L = \\pi(y_{1} + y_{2})L$$\n\nFor example, the segment from $(0, 3)$ to $(4, 6)$ has length $5$, so $S = \\pi(3 + 6) \\cdot 5 = 45\\pi$.\n\nCheck: along the segment $y = 3 + \\frac{3}{4}x$ and $ds = \\frac{5}{4} \\, dx$, so\n\n$$S = 2\\pi\\int_{0}^{4} \\left(3 + \\frac{3}{4}x\\right) \\frac{5}{4} \\, dx = 2\\pi \\cdot \\frac{5}{4} \\cdot 18 = 45\\pi$$\n\n> **Watch out.** Use the average height, half the sum of the end heights. Using the sum itself doubles the area.",
    "线段绕 $x$ 轴旋转得到一条带，面积为 $\\int 2\\pi y\\,ds$。由于 $y$ 沿线段线性变化，它等于 $2\\pi$ 乘以平均高度再乘以长度 $L$：\n\n$$S = 2\\pi \\cdot \\frac{y_{1} + y_{2}}{2} \\cdot L = \\pi(y_{1} + y_{2})L$$\n\n例如，从 $(0, 3)$ 到 $(4, 6)$ 的线段长 $5$，所以 $S = \\pi(3 + 6) \\cdot 5 = 45\\pi$。\n\n检验：沿线段 $y = 3 + \\frac{3}{4}x$，$ds = \\frac{5}{4} \\, dx$，所以\n\n$$S = 2\\pi\\int_{0}^{4} \\left(3 + \\frac{3}{4}x\\right) \\frac{5}{4} \\, dx = 2\\pi \\cdot \\frac{5}{4} \\cdot 18 = 45\\pi$$\n\n> **注意。** 要用平均高度，即两端高度之和的一半。直接用和会使面积加倍。",
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
    const all = [
      {
        value: 2 * k,
        why: t(
          "This uses the sum of the end heights as the radius. The average radius is half of that sum.",
          "这里把两端高度之和当作半径。平均半径是这个和的一半。",
        ),
      },
      {
        value: y1 + y2,
        why: t(`This leaves out the length $${L}$ of the segment.`, `这里漏掉了线段的长度 $${L}$。`),
      },
      ...(dy === 0
        ? []
        : [
            {
              value: Math.abs(y2 * y2 - y1 * y1),
              why: t(
                "This is the difference of the areas of the end disks divided by $\\pi$, not the area of the band between them.",
                "这是两端圆盘面积之差除以 $\\pi$，不是它们之间那条带的面积。",
              ),
            },
            {
              value: L * y1,
              why: t(
                `This uses only the height $${y1}$ at one end and leaves out the factor $2$. The radius changes from $${y1}$ to $${y2}$ along the segment.`,
                `这里只用了一端的高度 $${y1}$，还漏掉了因子 $2$。沿线段半径从 $${y1}$ 变到 $${y2}$。`,
              ),
            },
          ]),
    ];
    const trapezoid = Q.of(dx * (y1 + y2), 2);
    const average = Q.of(y1 + y2, 2).toLatex();
    const twoPi = (...parts: string[]) => ["2\\pi", ...parts.filter((p) => p !== "1")].join(" \\cdot ");
    const length = dy === 0 ? `${L}` : `\\sqrt{${dx}^{2} + ${Math.abs(dy)}^{2}} = ${L}`;
    const factor = Q.of(L, dx).toLatex();
    const check =
      dy === 0
        ? t(
            `The segment is level, so the surface is the side of a cylinder of radius $${y1}$ and length $${L}$:\n\n$$S = ${twoPi(`${y1}`, `${L}`)} = ${k}\\pi$$\n\nSo $k = ${k}$.`,
            `线段是水平的，所以曲面是半径 $${y1}$、长 $${L}$ 的圆柱侧面：\n\n$$S = ${twoPi(`${y1}`, `${L}`)} = ${k}\\pi$$\n\n所以 $k = ${k}$。`,
          )
        : t(
            `Integrate in $x$ instead. Along the segment $ds = ${factor} \\, dx$, and $\\int y \\, dx$ over the segment is the area of a trapezoid, $${trapezoid.toLatex()}$:\n\n$$S = ${twoPi(factor, trapezoid.toLatex())} = ${k}\\pi$$\n\nSo $k = ${k}$.`,
            `改为对 $x$ 积分。沿线段 $ds = ${factor} \\, dx$，而 $\\int y \\, dx$ 在线段上是一个梯形的面积 $${trapezoid.toLatex()}$：\n\n$$S = ${twoPi(factor, trapezoid.toLatex())} = ${k}\\pi$$\n\n所以 $k = ${k}$。`,
          );
    return {
      ...numberProblem({
        prompt: t(
          "The drawn segment is spun about the $x$-axis. The area of the resulting surface, without the end disks, is $k\\pi$. Find $k$.",
          "所画线段绕 $x$ 轴旋转。所得曲面（不含两端圆盘）的面积为 $k\\pi$。求 $k$。",
        ),
        answer: k,
        mistakes: all.filter((x, i) => x.value !== k && all.findIndex((y) => y.value === x.value) === i),
        solution: t(
          `**Step 1: Read the segment.** It runs from $${at(A)}$ to $${at(B)}$, so the end heights are $${y1}$ and $${y2}$ and the length is $L = ${length}$.\n\n**Step 2: Multiply by the average height.** The radius changes evenly along the segment, so its average is $${average}$:\n\n$$S = ${twoPi(average, `${L}`)} = ${k}\\pi$$\n\n**Check.** ${check.en}`,
          `**第一步：读出线段。**它从 $${at(A)}$ 到 $${at(B)}$，两端高度为 $${y1}$ 和 $${y2}$，长度为 $L = ${length}$。\n\n**第二步：乘以平均高度。**半径沿线段均匀变化，平均值是 $${average}$：\n\n$$S = ${twoPi(average, `${L}`)} = ${k}\\pi$$\n\n**检验。**${check["zh-CN"]}`,
        ),
      }),
      figure: fig(
        { xMin: -1, xMax: 12, yMin: -1, yMax: 12 },
        [
          { kind: "segment", a: A, b: B, accent: true },
          { kind: "point", at: A },
          { kind: "point", at: B },
        ],
        [`A segment from ${at(A)} to ${at(B)} above the x-axis.`, `x 轴上方从 ${at(A)} 到 ${at(B)} 的线段。`],
      ),
    };
  },
);

const arcLength = {
  ...point(
    "the-length-of-a-drawn-broken-path",
    ["The length of a drawn broken path", "所画折线路径的长度"],
    [
      "Arc length adds up along the pieces of a path. On a straight piece, $\\int \\lVert r'(t) \\rVert\\,dt$ is the distance between its ends. The path $(0, 0) \\to (6, 8) \\to (6, 3)$ has pieces of length $\\sqrt{36 + 64} = 10$ and $5$, so its length is $15$, more than the $\\sqrt{36 + 9} \\approx 6.7$ straight across.\n\n> **Watch out.** A slanted piece has length $\\sqrt{\\Delta x^2 + \\Delta y^2}$, not $\\lvert \\Delta x \\rvert + \\lvert \\Delta y \\rvert$, and the length follows every piece, not the straight line from start to end.",
      "弧长沿路径的各段相加。在直线段上，$\\int \\lVert r'(t) \\rVert\\,dt$ 就是两端之间的距离。路径 $(0, 0) \\to (6, 8) \\to (6, 3)$ 各段长为 $\\sqrt{36 + 64} = 10$ 和 $5$，所以长度为 $15$，比直接连线的 $\\sqrt{36 + 9} \\approx 6.7$ 长。\n\n> **注意。** 斜段的长度是 $\\sqrt{\\Delta x^2 + \\Delta y^2}$，不是 $\\lvert \\Delta x \\rvert + \\lvert \\Delta y \\rvert$；长度要沿每一段走，不是起点到终点的直线距离。",
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
      const across = (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2;
      const straight = Math.sqrt(across);
      const taxicab = chosen.reduce((sum, [dx, dy]) => sum + Math.abs(dx) + Math.abs(dy), 0);
      const piece = ([dx, dy, r]: readonly [number, number, number]) =>
        dx === 0 || dy === 0 ? `${r}` : `\\sqrt{${dx * dx} + ${dy * dy}} = ${r}`;
      const lengths = chosen.map(([, , r]) => `${r}`).join(" + ");
      const direct = Number.isInteger(straight) ? `\\sqrt{${across}} = ${straight}` : `\\sqrt{${across}}`;
      return {
        ...numberProblem({
          prompt: t("Find the arc length of the drawn broken path.", "求所画折线路径的弧长。"),
          answer: total,
          mistakes: apart(total, [
            ...(Number.isInteger(straight)
              ? [
                  why(
                    straight,
                    `$${straight}$ is the straight distance from the first point to the last; the path follows every piece.`,
                    `$${straight}$ 是首点到末点的直线距离；路径要沿每一段走。`,
                  ),
                ]
              : []),
            why(
              taxicab,
              `That adds $\\lvert \\Delta x \\rvert + \\lvert \\Delta y \\rvert$ on each piece; a slanted piece has length $\\sqrt{\\Delta x^2 + \\Delta y^2}$.`,
              `那是每段加上 $\\lvert \\Delta x \\rvert + \\lvert \\Delta y \\rvert$；斜段的长度是 $\\sqrt{\\Delta x^2 + \\Delta y^2}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Measure each piece", "量出每一段"],
                t(
                  `Going through ${points.map(at).join(", ")}, the pieces have lengths ${chosen.map((c) => `$${piece(c)}$`).join(", ")}.`,
                  `依次经过 ${points.map(at).join("、")}，各段长度为 ${chosen.map((c) => `$${piece(c)}$`).join("、")}。`,
                ),
              ],
              [["Add them", "相加"], t(`The arc length is $${lengths} = ${total}$.`, `弧长为 $${lengths} = ${total}$。`)],
            ],
            t(
              `The straight distance from ${at(start)} to ${at(end)} is $${direct}$, and $${total}^2 = ${total * total} \\ge ${across}$, so the path is at least as long as the straight line, as it must be.`,
              `从 ${at(start)} 到 ${at(end)} 的直线距离是 $${direct}$，而 $${total}^2 = ${total * total} \\ge ${across}$，所以路径不短于直线，理应如此。`,
            ),
          ),
        }),
        figure: fig(
          { xMin: -10, xMax: 10, yMin: -10, yMax: 10, labelEvery: 2 },
          [{ kind: "path", points, accent: true }, ...points.map((p): PlaneMark => ({ kind: "point", at: p }))],
          [`A broken path through ${points.map(at).join(", ")}.`, `折线路径，依次经过 ${points.map(at).join("、")}。`],
        ),
      };
    },
  ),
  figure: multivariableDrawings1["the-arc-length-of-a-vector-valued-function#the-length-of-a-drawn-broken-path"],
};

const curveKind = point(
  "simple-and-closed-from-a-drawn-curve",
  ["Simple and closed from a drawn curve", "由所画曲线判断简单和闭合"],
  [
    "A curve is closed when it ends where it starts, and simple when it does not cross itself, apart from the two ends of a closed curve. The two properties are independent: a circle traced once is both, the same circle stopped a little short of a full turn is simple but not closed, and a figure eight is closed but not simple.\n\n> **Watch out.** Decide the two questions separately. Look first at the two ends, then for a crossing; the ends of a closed curve meeting is not a crossing.",
    "曲线终点与起点重合时是闭合的；除闭合曲线的两端外不自交时是简单的。这两个性质彼此独立：描一次的圆两者都满足；同一个圆差一点没走满一圈，就简单但不闭合；8 字形闭合但不简单。\n\n> **注意。** 两个问题要分开判断。先看两端，再找自交点；闭曲线的两端重合不算自交。",
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
    const closedNow = kind === "simple-closed" || kind === "closed";
    const simpleNow = kind === "simple-closed" || kind === "simple";
    const wrongWhy = (x: typeof kind): Pair => {
      const closedThere = x === "simple-closed" || x === "closed";
      if (closedThere !== closedNow)
        return closedNow
          ? ["The curve ends where it starts, so it is closed", "曲线回到起点，所以是闭合的"]
          : ["The two ends of the curve are separate points, so it is not closed", "曲线的两端是分开的点，所以不闭合"];
      return simpleNow
        ? ["The curve never passes through a point twice, so it is simple", "曲线从不两次经过同一点，所以是简单的"]
        : ["The curve passes through one point twice, so it is not simple", "曲线两次经过同一点，所以不是简单的"];
    };
    const ends: Pair = closedNow
      ? ["The curve ends at the point where it starts, so it is closed.", "曲线在起点处结束，所以是闭合的。"]
      : ["The two ends of the curve are different points, so it is not closed.", "曲线的两端是不同的点，所以不闭合。"];
    const crossing: Pair = simpleNow
      ? ["No point of the curve is passed twice, so it is simple.", "曲线上没有点被经过两次，所以是简单的。"]
      : [
          "The curve passes through one point twice, where two strands cross, so it is not simple.",
          "曲线在两股交叉处两次经过同一点，所以不是简单的。",
        ];
    return explainedChoice(rng, {
      prompt: t("Which description fits the drawn curve?", "哪个描述符合所画的曲线？"),
      correct: t(...names[kind]),
      wrong: (["simple-closed", "closed", "simple", "neither"] as const)
        .filter((x) => x !== kind)
        .map((x) => ({ option: t(...names[x]), why: t(...wrongWhy(x)) })),
      solution: walked(
        [
          [["Look at the ends", "看两端"], t(...ends)],
          [["Look for a crossing", "找自交点"], t(...crossing)],
        ],
        t(...why[kind]),
      ),
      figure: fig(10, [{ kind: "path", points, accent: true }], alts[kind]),
    });
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
