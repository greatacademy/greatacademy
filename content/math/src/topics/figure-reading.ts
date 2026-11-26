// Knowledge points that ask a learner to read a drawing, added to topics of the
// university courses, whose questions are otherwise all symbols. See `figureReadingPoints`.

import type { Figure, KnowledgePointDef, Problem, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import type { Compass, PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { paren, plane, poly, Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";
import { linearAlgebraDrawings2 } from "../explanation-drawings-linear-algebra-2.ts";
import { multivariableDrawings2 } from "../explanation-drawings-multivariable-2.ts";
import { multivariableDrawings4 } from "../explanation-drawings-multivariable-4.ts";
import { multivariableDrawings7 } from "../explanation-drawings-multivariable-7.ts";
import { probabilityDrawings1 } from "../explanation-drawings-probability-and-statistics-1.ts";

import { explainedChoice, numberProblem, why } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { pickChoice as choiceFrom } from "./grade-4-fractions.ts";

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

/** math writes the same formula as an option in both languages. */
const math = (latex: string): Text => t(`$${latex}$`, `$${latex}$`);
/** angled writes a vector in angle brackets. */
const angled = (a: string | number, b: string | number) => `\\langle ${a}, ${b} \\rangle`;
/** frac writes a rational number. */
const frac = (n: number, d = 1) => Q.of(n, d).toLatex();
/** matrix writes a two-by-two matrix by rows. */
const matrix = (a: number, b: number, c: number, d: number) => `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
/** term writes a coefficient with a variable, leaving out the coefficient 1. */
const term = (c: number, v: string) => poly([c, v]);

/** pickChoice builds a choice problem after dropping wrong options that repeat the right one or each other. */
function pickChoice(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([correct.en]);
  return choiceFrom(
    rng,
    prompt,
    correct,
    wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))),
    solution,
  );
}

/** signWords gives the three options of a question about a sign, with the true one first. */
function signWords(value: number): [Text, Text[]] {
  const positive = t("Positive", "正");
  const negative = t("Negative", "负");
  const zero = t("Zero", "零");
  if (value > 0) return [positive, [negative, zero]];
  if (value < 0) return [negative, [positive, zero]];
  return [zero, [positive, negative]];
}

// ---------------------------------------------------------------------------
// Drawings
// ---------------------------------------------------------------------------

/** square is the view from -r to r on both axes, with numbers on every grid line unless that would crowd them. */
const square = (r: number): PlaneView => ({ xMin: -r, xMax: r, yMin: -r, yMax: r, labelEvery: r > 6 ? 2 : 1 });

/** drawn wraps marks in a figure. */
const drawn = (view: PlaneView, marks: readonly PlaneMark[], alt: Text): Figure => ({ svg: plane(view, marks), alt });

/** awayFrom names the direction in which a label sits clear of the tip of a vector. */
function awayFrom([x, y]: Point): Compass {
  if (x >= 0) return y >= 0 ? "ne" : "se";
  return y >= 0 ? "nw" : "sw";
}

/** labelledArrow draws a vector from the origin with a label at its tip. */
function labelledArrow(to: Point, text: string, accent = false): PlaneMark[] {
  return [
    { kind: "arrow", from: [0, 0], to, accent },
    { kind: "label", at: to, text, dir: awayFrom(to) },
  ];
}

/** reach is the half-width of a square view that holds the given points with a unit to spare. */
const reach = (...points: readonly Point[]) => Math.max(3, ...points.flatMap(([x, y]) => [Math.abs(x), Math.abs(y)])) + 1;

/** Field is a vector field in the plane. */
type Field = (x: number, y: number) => Point;

/** quiverMarks draws a field at the integer points of the square of half-width 2, the longest arrow just under one unit. */
function quiverMarks(field: Field): PlaneMark[] {
  const grid: Point[] = [];
  for (let x = -2; x <= 2; x++) for (let y = -2; y <= 2; y++) grid.push([x, y]);
  const longest = Math.max(...grid.map(([x, y]) => Math.hypot(...field(x, y))), 1e-9);
  const scale = 0.85 / longest;
  return grid.map(([x, y]): PlaneMark => {
    const [u, v] = field(x, y);
    return { kind: "arrow", from: [x, y], to: [x + scale * u, y + scale * v], thin: true };
  });
}

/** quiverAlt describes a field through its arrows at three points, for readers who cannot see them. */
const quiverAlt = (field: Field): Text => {
  const at = (x: number, y: number) => {
    const [u, v] = field(x, y);
    return `(${x}, ${y}): ⟨${u}, ${v}⟩`;
  };
  const sample = `${at(1, 0)}, ${at(0, 1)}, ${at(1, 1)}`;
  return t(
    `Arrows of a vector field at the integer points. Up to one common scale, the arrows are ${sample}.`,
    `向量场在整点处的箭头。在同一比例下，箭头为 ${sample}。`,
  );
};

/** quiver draws a vector field on a plot. */
const quiver = (field: Field, extra: readonly PlaneMark[] = []): Figure =>
  drawn(square(3), [...quiverMarks(field), ...extra], quiverAlt(field));

/** Surface gives a point of a surface for parameters. */
type Surface = (u: number, v: number) => readonly [number, number, number];

/** wireframe draws a parametrized surface as a mesh in a projection with the z-axis up, with short coordinate axes. */
function wireframe(r: Surface, [u0, u1]: Point, [v0, v1]: Point, alt: Text): Figure {
  const project = ([x, y, z]: readonly [number, number, number]): Point => [(y - x) * 0.82, z + (x + y) * -0.34];
  const lines: Point[][] = [];
  const [nu, nv, fine] = [9, 18, 36];
  for (let i = 0; i <= nu; i++) {
    const u = u0 + ((u1 - u0) * i) / nu;
    lines.push(Array.from({ length: fine + 1 }, (_, j) => project(r(u, v0 + ((v1 - v0) * j) / fine))));
  }
  for (let i = 0; i <= nv; i++) {
    const v = v0 + ((v1 - v0) * i) / nv;
    lines.push(Array.from({ length: fine + 1 }, (_, j) => project(r(u0 + ((u1 - u0) * j) / fine, v))));
  }
  const points = lines.flat();
  const size = Math.max(...points.flatMap(([x, y]) => [Math.abs(x), Math.abs(y)]));
  const axis = size * 1.15;
  const ends: readonly [string, Point][] = [
    ["x", project([axis, 0, 0])],
    ["y", project([0, axis, 0])],
    ["z", project([0, 0, axis])],
  ];
  const [W, H] = [300, 260];
  const s = Math.min(W, H) / (2.7 * size);
  const px = ([x, y]: Point) => `${Math.round((W / 2 + s * x) * 10) / 10},${Math.round((H / 2 - s * y) * 10) / 10}`;
  const mesh = lines.map((l) => `<polyline class="accent" points="${l.map(px).join(" ")}" stroke-width="0.8"/>`).join("");
  const axes = ends
    .map(([name, end]) => {
      const [x, y] = px(end).split(",");
      return `<line x1="${W / 2}" y1="${H / 2}" x2="${x}" y2="${y}" stroke-width="1"/><text x="${x}" y="${y}" dy="-3" font-size="12" font-style="italic" fill="currentColor" stroke="none">${name}</text>`;
    })
    .join("");
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor">${axes}${mesh}</svg>`,
    alt,
  };
}

/** Chart describes a graph with separate scales on its axes, for densities and distribution functions. */
interface Chart {
  readonly x: Point;
  readonly top: number;
  readonly xTicks: readonly (readonly [number, string])[];
  readonly yTicks: readonly (readonly [number, string])[];
  readonly curves: readonly (readonly Point[])[];
  readonly shade?: readonly Point[];
  readonly dots?: readonly Point[];
}

/** chart draws a graph with separate scales on its axes. */
function chart(c: Chart, alt: Text): Figure {
  const [W, H, L, B] = [320, 210, 40, 24];
  const px = (x: number) => Math.round((L + ((x - c.x[0]) / (c.x[1] - c.x[0])) * (W - L - 12)) * 10) / 10;
  const py = (y: number) => Math.round((H - B - (y / c.top) * (H - B - 12)) * 10) / 10;
  const pts = (ps: readonly Point[]) => ps.map(([x, y]) => `${px(x)},${py(y)}`).join(" ");
  const text = (x: number, y: number, anchor: string, label: string) =>
    `<text x="${x}" y="${y}" font-size="10" text-anchor="${anchor}" fill="currentColor" stroke="none">${label}</text>`;
  const parts = [
    ...c.yTicks.map(
      ([y, label]) =>
        `<line x1="${L}" y1="${py(y)}" x2="${W - 12}" y2="${py(y)}" stroke-width="0.5" stroke-opacity="0.3"/>${text(L - 5, py(y) + 3.5, "end", label)}`,
    ),
    ...c.xTicks.map(
      ([x, label]) =>
        `<line x1="${px(x)}" y1="${py(0)}" x2="${px(x)}" y2="${py(c.top)}" stroke-width="0.5" stroke-opacity="0.3"/>${text(px(x), py(0) + 14, "middle", label)}`,
    ),
    ...(c.shade ? [`<polygon class="accent" points="${pts(c.shade)}" fill="currentColor" fill-opacity="0.2" stroke="none"/>`] : []),
    `<line x1="${L}" y1="${py(0)}" x2="${W - 12}" y2="${py(0)}" stroke-width="1.2"/>`,
    `<line x1="${L}" y1="${py(0)}" x2="${L}" y2="${py(c.top)}" stroke-width="1.2"/>`,
    ...c.curves.map((curve) => `<polyline class="accent" points="${pts(curve)}" stroke-width="2"/>`),
    ...(c.dots ?? []).map(([x, y]) => `<circle class="accent" cx="${px(x)}" cy="${py(y)}" r="3" fill="currentColor" stroke="none"/>`),
  ];
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor">${parts.join("")}</svg>`,
    alt,
  };
}

/** sampled lists points of the graph of f from a to b. */
const sampled = (f: (x: number) => number, a: number, b: number, n = 120): Point[] =>
  Array.from({ length: n + 1 }, (_, i): Point => {
    const x = a + ((b - a) * i) / n;
    return [x, f(x)];
  });

/** withFigure attaches a figure to a problem. */
const withFigure = (problem: Problem, figure: Figure): Problem => ({ ...problem, figure });

// ---------------------------------------------------------------------------
// Vector fields and level curves
// ---------------------------------------------------------------------------

/** fieldFamily lists fields that look different on a plot, as a formula and a function. */
function fieldFamily(c: number, a: number, b: number): readonly (readonly [string, Field])[] {
  return [
    [angled(term(c, "x"), term(c, "y")), (x, y) => [c * x, c * y]],
    [angled(term(-c, "x"), term(-c, "y")), (x, y) => [-c * x, -c * y]],
    [angled(term(-c, "y"), term(c, "x")), (x, y) => [-c * y, c * x]],
    [angled(term(c, "y"), term(-c, "x")), (x, y) => [c * y, -c * x]],
    [angled(term(c, "y"), 0), (_, y) => [c * y, 0]],
    [angled(0, term(c, "x")), (x) => [0, c * x]],
    [angled(term(c, "x"), 0), (x) => [c * x, 0]],
    [angled(a, b), () => [a, b]],
  ];
}

/** matchingFieldPlot asks which formula a vector field plot shows. */
const matchingFieldPlot: KnowledgePointDef = {
  id: "matching-a-plot-to-its-formula",
  title: t("Matching a plot to its formula", "把向量场图与公式对应"),
  explanation: t(
    "To match a plot with a formula, test a few simple points. On the positive $x$-axis, $\\langle -y, 3x \\rangle$ gives $\\langle 0, 3x \\rangle$, an arrow pointing straight up, and on the positive $y$-axis it gives $\\langle -y, 0 \\rangle$, an arrow pointing left and a third as long at the same distance; together they show the counterclockwise swirl drawn here. All arrows of a plot are scaled by one common factor, so the direction and the relative length are what carry information.\n\n> **Watch out.** One test point is rarely enough: $\\langle x, y \\rangle$ and $\\langle x, 0 \\rangle$ agree on the $x$-axis. Test a point on each axis, and remember that a missing arrow means the field is zero there.",
    "把图与公式对应时，先检验几个简单的点。在 $x$ 轴正半轴上，$\\langle -y, 3x \\rangle$ 给出 $\\langle 0, 3x \\rangle$，箭头竖直向上；在 $y$ 轴正半轴上给出 $\\langle -y, 0 \\rangle$，箭头向左，在同样距离处长度只有三分之一；二者合起来就是图中逆时针的旋转。一张图上的所有箭头按同一比例缩放，因此方向和相对长度才是有用的信息。\n\n> **注意。** 一个检验点通常不够：$\\langle x, y \\rangle$ 与 $\\langle x, 0 \\rangle$ 在 $x$ 轴上相同。每条轴上各取一点检验，并记住没有箭头表示该处场为零。",
  ),
  figure: quiver((x, y) => [-y, 3 * x]),
  generate(rng: Rng): Problem {
    const c = rng.int(1, 4);
    const a = rng.pick([-3, -2, -1, 1, 2, 3]);
    const b = rng.pick([-3, -2, -1, 1, 2, 3]);
    const family = rng.shuffle(fieldFamily(c, a, b));
    const [[formula, field], ...rest] = family as [readonly [string, Field], ...(readonly [string, Field])[]];
    const [u1, v1] = field(1, 0);
    const [u2, v2] = field(0, 1);
    const [u3, v3] = field(1, 1);
    const differs = (other: Field) => {
      const [p1, q1] = other(1, 0);
      if (p1 !== u1 || q1 !== v1)
        return t(
          `At $(1, 0)$ this gives $${angled(p1, q1)}$, but the arrow drawn there is $${angled(u1, v1)}$.`,
          `在 $(1, 0)$ 处它给出 $${angled(p1, q1)}$，但图中该处的箭头是 $${angled(u1, v1)}$。`,
        );
      const [p2, q2] = other(0, 1);
      return t(
        `At $(0, 1)$ this gives $${angled(p2, q2)}$, but the arrow drawn there is $${angled(u2, v2)}$.`,
        `在 $(0, 1)$ 处它给出 $${angled(p2, q2)}$，但图中该处的箭头是 $${angled(u2, v2)}$。`,
      );
    };
    return explainedChoice(rng, {
      prompt: t(
        "The plot shows a vector field $\\mathbf{F}(x, y)$, with all arrows scaled by one common factor. Which formula is it?",
        "图中是向量场 $\\mathbf{F}(x, y)$，所有箭头按同一比例缩放。它是哪个公式？",
      ),
      correct: math(`\\mathbf{F} = ${formula}`),
      wrong: rest.map(([other, g]) => ({ option: math(`\\mathbf{F} = ${other}`), why: differs(g) })),
      solution: walked(
        [
          [
            ["Read two arrows", "读出两个箭头"],
            t(
              `The arrows drawn at $(1, 0)$ and $(0, 1)$ are $${angled(u1, v1)}$ and $${angled(u2, v2)}$, up to the common scale.`,
              `图中 $(1, 0)$ 与 $(0, 1)$ 处的箭头为 $${angled(u1, v1)}$ 和 $${angled(u2, v2)}$（相差共同的比例）。`,
            ),
          ],
          [
            ["Match the formula", "对应公式"],
            t(
              `$\\mathbf{F} = ${formula}$ gives exactly these two vectors; each other formula differs at one of the points.`,
              `$\\mathbf{F} = ${formula}$ 恰好给出这两个向量；其余公式至少在其中一点不同。`,
            ),
          ],
        ],
        t(
          `At a third point, $(1, 1)$, the formula gives $${angled(u3, v3)}$, the arrow drawn there.`,
          `在第三个点 $(1, 1)$ 处，公式给出 $${angled(u3, v3)}$，正是图中该处的箭头。`,
        ),
      ),
      figure: quiver(field),
    });
  },
};

/** divergenceFromPlot asks for the sign of the divergence of a field read from its plot. */
const divergenceFromPlot: KnowledgePointDef = {
  id: "the-sign-of-divergence-from-a-plot",
  title: t("The sign of divergence from a plot", "从图判断散度的符号"),
  explanation: t(
    "For $\\mathbf{F} = \\langle ax, by \\rangle$ the divergence is $a + b$. On a plot, $a$ shows along the $x$-axis: arrows pointing away from the origin mean $a > 0$, and arrows pointing toward it mean $a < 0$. In the same way $b$ shows along the $y$-axis, and the longer arrows belong to the larger coefficient. The field drawn here, $\\langle 3x, -5y \\rangle$, spreads outward along the $x$-axis but converges more strongly along the $y$-axis, so its divergence $3 - 5 = -2$ is negative.\n\n> **Watch out.** When the two axes disagree, one pointing away and one toward the origin, the direction alone does not settle the sign: compare the lengths at equal distances, and the longer arrows win. Equal lengths in opposite senses give zero.",
    "对 $\\mathbf{F} = \\langle ax, by \\rangle$，散度等于 $a + b$。在图上，$a$ 表现在 $x$ 轴上：箭头背离原点说明 $a > 0$，指向原点说明 $a < 0$。同样，$b$ 表现在 $y$ 轴上，箭头较长的一方系数的绝对值较大。这里画出的场 $\\langle 3x, -5y \\rangle$ 沿 $x$ 轴向外扩散，但沿 $y$ 轴汇聚得更强，所以散度 $3 - 5 = -2$ 为负。\n\n> **注意。** 两条轴不一致（一条背离原点、一条指向原点）时，仅凭方向不能确定符号：要比较同样距离处的箭头长度，较长的一方占优。长度相等而方向相反时为零。",
  ),
  figure: quiver((x, y) => [3 * x, -5 * y]),
  generate(rng: Rng): Problem {
    const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const [right, wrong] = signWords(a + b);
    const direction = (n: number) => (n > 0 ? t("away from the origin", "背离原点") : t("toward the origin", "指向原点"));
    const longer = Math.abs(a) > Math.abs(b) ? t("$x$-axis", "$x$ 轴") : t("$y$-axis", "$y$ 轴");
    const because =
      a + b === 0
        ? t(
            `The arrows along the two axes have equal length and point opposite ways, so $a$ and $b$ cancel and $a + b = 0$.`,
            `两条轴上的箭头等长而方向相反，所以 $a$ 与 $b$ 抵消，$a + b = 0$。`,
          )
        : a * b > 0
          ? t(
              `The arrows along both axes point ${direction(a).en}, so $a$ and $b$ have the same sign and $a + b$ has it too.`,
              `两条轴上的箭头都${direction(a)["zh-CN"]}，所以 $a$ 与 $b$ 同号，$a + b$ 也是这个符号。`,
            )
          : t(
              `The axes disagree, and the longer arrows, along the ${longer.en}, point ${direction(Math.abs(a) > Math.abs(b) ? a : b).en}, so that coefficient decides the sign of $a + b$.`,
              `两条轴不一致，较长的箭头在${longer["zh-CN"]}上，${direction(Math.abs(a) > Math.abs(b) ? a : b)["zh-CN"]}，所以由那个系数决定 $a + b$ 的符号。`,
            );
    return explainedChoice(rng, {
      prompt: t(
        "The plot shows $\\mathbf{F}(x, y) = \\langle ax, by \\rangle$ for nonzero constants $a$ and $b$, with all arrows scaled by one common factor. What is the sign of $\\operatorname{div} \\mathbf{F}$?",
        "图中是 $\\mathbf{F}(x, y) = \\langle ax, by \\rangle$，其中 $a$、$b$ 是非零常数，所有箭头按同一比例缩放。$\\operatorname{div} \\mathbf{F}$ 的符号是什么？",
      ),
      correct: right,
      wrong: wrong.map((option) => ({ option, why: because })),
      solution: walked(
        [
          [
            ["Read the signs", "读出符号"],
            t(
              `Here $\\operatorname{div} \\mathbf{F} = a + b$. Arrows on the $x$-axis point ${direction(a).en} and arrows on the $y$-axis point ${direction(b).en}, which gives the signs of $a$ and $b$.`,
              `这里 $\\operatorname{div} \\mathbf{F} = a + b$。$x$ 轴上的箭头${direction(a)["zh-CN"]}，$y$ 轴上的箭头${direction(b)["zh-CN"]}，由此得到 $a$、$b$ 的符号。`,
            ),
          ],
          [
            ["Compare the lengths", "比较长度"],
            t(
              `At equal distances the lengths compare as $|a|:|b| = ${Math.abs(a)}:${Math.abs(b)}$, so $a + b$ is a positive multiple of $${a + b}$, which fixes its sign.`,
              `在同样距离处长度之比为 $|a|:|b| = ${Math.abs(a)}:${Math.abs(b)}$，所以 $a + b$ 是 $${a + b}$ 的正数倍，符号由此确定。`,
            ),
          ],
        ],
        t(
          `The arrows at $(1, 0)$ and $(0, 1)$ are $${angled(a, 0)}$ and $${angled(0, b)}$ up to scale; their outward parts $${a}$ and $${b}$ add to $${a + b}$.`,
          `$(1, 0)$ 与 $(0, 1)$ 处的箭头在比例意义下为 $${angled(a, 0)}$ 和 $${angled(0, b)}$；它们向外的部分 $${a}$ 与 $${b}$ 相加得 $${a + b}$。`,
        ),
      ),
      figure: quiver((x, y) => [a * x, b * y]),
    });
  },
};

/** curlFromPlot asks for the sign of the curl of a field read from its plot. */
const curlFromPlot: KnowledgePointDef = {
  id: "the-sign-of-curl-from-a-plot",
  title: t("The sign of curl from a plot", "从图判断旋度的符号"),
  explanation: t(
    "The $z$-component of the curl of $\\mathbf{F} = \\langle P, Q \\rangle$ is $Q_x - P_y$, and it measures the spin of a small paddle wheel placed in the flow, positive for counterclockwise. For $\\mathbf{F} = \\langle -ay, bx \\rangle$ this equals $a + b$. On a plot, arrows on the positive $x$-axis pointing up mean $b > 0$, and arrows on the positive $y$-axis pointing left mean $a > 0$. For $\\langle -y, -5x \\rangle$, the arrows on the positive $x$-axis point down and are five times as long as the leftward ones on the positive $y$-axis, so the curl $-5 + 1 = -4$ is negative: a clockwise spin.\n\n> **Watch out.** Up on the positive $x$-axis and left on the positive $y$-axis both mean counterclockwise. When the two disagree, compare the lengths at equal distances; equal lengths in opposite senses give zero curl.",
    "$\\mathbf{F} = \\langle P, Q \\rangle$ 旋度的 $z$ 分量是 $Q_x - P_y$，它度量放在流场中的小叶轮的旋转，逆时针为正。对 $\\mathbf{F} = \\langle -ay, bx \\rangle$，它等于 $a + b$。在图上，$x$ 轴正半轴上箭头向上说明 $b > 0$，$y$ 轴正半轴上箭头向左说明 $a > 0$。对 $\\langle -y, -5x \\rangle$，$x$ 轴正半轴上的箭头向下，长度是 $y$ 轴正半轴上向左箭头的五倍，所以旋度 $-5 + 1 = -4$ 为负：顺时针旋转。\n\n> **注意。** $x$ 轴正半轴上向上和 $y$ 轴正半轴上向左都表示逆时针。二者不一致时，要比较同样距离处的长度；长度相等而方向相反时旋度为零。",
  ),
  generate(rng: Rng): Problem {
    const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const [right, wrong] = signWords(a + b);
    const spin = (n: number) => (n > 0 ? t("counterclockwise", "逆时针") : t("clockwise", "顺时针"));
    const because =
      a + b === 0
        ? t(
            "The arrows on the two axes have equal length and turn opposite ways, so $a$ and $b$ cancel and the curl is zero.",
            "两条轴上的箭头等长而转向相反，所以 $a$ 与 $b$ 抵消，旋度为零。",
          )
        : a * b > 0
          ? t(
              `The arrows on both axes turn ${spin(a).en}, so $a$ and $b$ have the same sign and $a + b$ has it too.`,
              `两条轴上的箭头都${spin(a)["zh-CN"]}转，所以 $a$ 与 $b$ 同号，$a + b$ 也是这个符号。`,
            )
          : t(
              `The axes disagree, and the longer arrows turn ${spin(Math.abs(a) > Math.abs(b) ? a : b).en}, so that coefficient decides the sign of $a + b$.`,
              `两条轴不一致，较长的箭头${spin(Math.abs(a) > Math.abs(b) ? a : b)["zh-CN"]}转，所以由那个系数决定 $a + b$ 的符号。`,
            );
    return explainedChoice(rng, {
      prompt: t(
        "The plot shows $\\mathbf{F}(x, y) = \\langle -ay, bx \\rangle$ for nonzero constants $a$ and $b$, with all arrows scaled by one common factor. What is the sign of the $z$-component of $\\operatorname{curl} \\mathbf{F}$?",
        "图中是 $\\mathbf{F}(x, y) = \\langle -ay, bx \\rangle$，其中 $a$、$b$ 是非零常数，所有箭头按同一比例缩放。$\\operatorname{curl} \\mathbf{F}$ 的 $z$ 分量的符号是什么？",
      ),
      correct: right,
      wrong: wrong.map((option) => ({ option, why: because })),
      solution: walked(
        [
          [
            ["Read the signs", "读出符号"],
            t(
              `Here $Q_x - P_y = b - (-a) = a + b$. The arrows on the positive $x$-axis point ${b > 0 ? "up" : "down"}, so $b ${b > 0 ? ">" : "<"} 0$, and those on the positive $y$-axis point ${a > 0 ? "left" : "right"}, so $a ${a > 0 ? ">" : "<"} 0$.`,
              `这里 $Q_x - P_y = b - (-a) = a + b$。$x$ 轴正半轴上的箭头${b > 0 ? "向上" : "向下"}，所以 $b ${b > 0 ? ">" : "<"} 0$；$y$ 轴正半轴上的箭头${a > 0 ? "向左" : "向右"}，所以 $a ${a > 0 ? ">" : "<"} 0$。`,
            ),
          ],
          [
            ["Compare the lengths", "比较长度"],
            t(
              `At equal distances the lengths compare as $|a|:|b| = ${Math.abs(a)}:${Math.abs(b)}$, so $a + b$ is a positive multiple of $${a + b}$, which fixes its sign.`,
              `在同样距离处长度之比为 $|a|:|b| = ${Math.abs(a)}:${Math.abs(b)}$，所以 $a + b$ 是 $${a + b}$ 的正数倍，符号由此确定。`,
            ),
          ],
        ],
        t(
          `The arrows at $(1, 0)$ and $(0, 1)$ are $${angled(0, b)}$ and $${angled(-a, 0)}$ up to scale, and $Q_x - P_y = ${b} - ${a < 0 ? `${-a}` : `(${-a})`} = ${a + b}$.`,
          `$(1, 0)$ 与 $(0, 1)$ 处的箭头在比例意义下为 $${angled(0, b)}$ 和 $${angled(-a, 0)}$，且 $Q_x - P_y = ${b} - ${a < 0 ? `${-a}` : `(${-a})`} = ${a + b}$。`,
        ),
      ),
      figure: quiver((x, y) => [-a * y, b * x]),
    });
  },
};

/** contourFamily lists functions whose level curves have different shapes, with the levels to draw. */
function contourFamily(a: number, s: number) {
  return [
    {
      formula: poly([1, "x^2"], [a, "y^2"]),
      f: (x: number, y: number) => x * x + a * y * y,
      levels: [1, 4, 9, 16],
      why: t(
        "Setting it equal to a positive constant gives an ellipse (or a circle) around the origin.",
        "令它等于正常数，得到以原点为中心的椭圆（或圆）。",
      ),
    },
    {
      formula: poly([1, "y"], [-s * a, "x"]),
      f: (x: number, y: number) => y - s * a * x,
      levels: [-6, -3, 0, 3, 6],
      why: t("Setting it equal to a constant gives parallel lines, all of one slope.", "令它等于常数，得到斜率相同的平行直线。"),
    },
    {
      formula: poly([1, "y"], [-s * a, "x^2"]),
      f: (x: number, y: number) => y - s * a * x * x,
      levels: [-3, -1, 1, 3],
      why: t(
        "Setting it equal to a constant gives copies of one parabola, shifted vertically.",
        "令它等于常数，得到同一条抛物线上下平移的若干副本。",
      ),
    },
    {
      formula: poly([s * a, "xy"]),
      f: (x: number, y: number) => s * a * x * y,
      levels: [-4, -1, 1, 4].map((k) => k * a),
      why: t(
        "Setting it equal to a nonzero constant gives a hyperbola with the axes as asymptotes.",
        "令它等于非零常数，得到以坐标轴为渐近线的双曲线。",
      ),
    },
    {
      formula: poly([1, "x^2"], [-a, "y^2"]),
      f: (x: number, y: number) => x * x - a * y * y,
      levels: [-4, -1, 1, 4],
      why: t(
        "Setting it equal to a nonzero constant gives hyperbolas that open along an axis.",
        "令它等于非零常数，得到沿坐标轴方向张开的双曲线。",
      ),
    },
  ];
}

/** matchingContours asks which function has the level curves drawn. */
const matchingContours: KnowledgePointDef = {
  id: "matching-level-curves-to-a-function",
  title: t("Matching level curves to a function", "把等值线与函数对应"),
  explanation: t(
    "The shape of the level curves often identifies the function. Set $f(x, y) = c$ and recognize the curve: $x^2 + 2y^2 = c$ is an ellipse, $y - 2x = c$ is a line, $y - x^2 = c$ is a parabola, and $xy = c$ is a hyperbola. Several values of $c$ give a family of curves that do not cross, since a point has only one value of $f$. The ellipses drawn here are level curves of $3x^2 + y^2$: the level $3$ passes through $(1, 0)$ and $(0, \\sqrt{3})$, so they are taller than they are wide.\n\n> **Watch out.** Hyperbolas come in two kinds: $xy = c$ fills opposite quadrants with the axes as asymptotes, while $x^2 - y^2 = c$ opens along an axis. Parallel lines mean a linear function, and copies of one parabola mean a square in only one variable.",
    "等值线的形状常常能确定函数。令 $f(x, y) = c$ 并辨认曲线：$x^2 + 2y^2 = c$ 是椭圆，$y - 2x = c$ 是直线，$y - x^2 = c$ 是抛物线，$xy = c$ 是双曲线。不同的 $c$ 给出一族互不相交的曲线，因为一个点只有一个函数值。这里画出的椭圆是 $3x^2 + y^2$ 的等值线：等值 $3$ 经过 $(1, 0)$ 和 $(0, \\sqrt{3})$，所以椭圆高大于宽。\n\n> **注意。** 双曲线有两种：$xy = c$ 位于相对的象限，以坐标轴为渐近线；$x^2 - y^2 = c$ 沿坐标轴张开。平行直线说明是线性函数，同一条抛物线的若干副本说明只有一个变量带平方。",
  ),
  figure: drawn(
    square(4),
    [1, 4, 9].map((level): PlaneMark => ({ kind: "contour", f: (x, y) => 3 * x * x + y * y, level, accent: true })),
    t(
      "Three nested ellipses around the origin, taller along the y-axis than wide along the x-axis.",
      "以原点为中心的三个嵌套椭圆，沿 y 轴比沿 x 轴更长。",
    ),
  ),
  generate(rng: Rng): Problem {
    const a = rng.int(1, 5);
    const s = rng.pick([1, -1]);
    const family = contourFamily(a, s);
    const chosen = rng.int(0, family.length - 1);
    const pick = family[chosen] as (typeof family)[number];
    const others = rng.shuffle(
      contourFamily(rng.int(1, 5), rng.pick([1, -1]))
        .map((o, i) => ({ ...o, i }))
        .filter((o) => o.i !== chosen),
    );
    const shapes: Text[] = [
      t("nested ellipses or circles around the origin", "以原点为中心的嵌套椭圆或圆"),
      t("parallel straight lines", "平行直线"),
      t("copies of one parabola", "同一条抛物线的若干副本"),
      t("hyperbolas in the four quadrants", "分布在四个象限的双曲线"),
      t("hyperbolas opening along an axis", "沿坐标轴张开的双曲线"),
    ];
    const shape = shapes[chosen] as Text;
    const grid = [-3, -2, -1, 0, 1, 2, 3].flatMap((x) => [-3, -2, -1, 0, 1, 2, 3].map((y) => [x, y] as const));
    const spot = pick.levels.flatMap((c) => grid.filter(([x, y]) => pick.f(x, y) === c).map(([x, y]) => [x, y, c] as const))[0] ?? [
      0,
      0,
      pick.f(0, 0),
    ];
    const [px, py, level] = spot;
    return withFigure(
      explainedChoice(rng, {
        prompt: t(
          "The drawing shows several level curves of a function $f(x, y)$. Which function could it be?",
          "图中是函数 $f(x, y)$ 的若干条等值线。它可能是哪个函数？",
        ),
        correct: math(`f(x, y) = ${pick.formula}`),
        wrong: others.map((o) => ({
          option: math(`f(x, y) = ${o.formula}`),
          why: t(
            `Its level curves are ${(shapes[o.i] as Text).en}, but the curves drawn are ${shape.en}.`,
            `它的等值线是${(shapes[o.i] as Text)["zh-CN"]}，而图中的曲线是${shape["zh-CN"]}。`,
          ),
        })),
        solution: walked(
          [
            [["Read the shape", "读形状"], t(`The curves drawn are ${shape.en}.`, `图中的曲线是${shape["zh-CN"]}。`)],
            [
              ["Match the formula", "对应公式"],
              t(`For $f(x, y) = ${pick.formula}$: ${pick.why.en}`, `对 $f(x, y) = ${pick.formula}$：${pick.why["zh-CN"]}`),
            ],
          ],
          t(
            `The point $(${px}, ${py})$ gives $f = ${level}$, so it lies on the level curve $${pick.formula} = ${level}$, one of the curves drawn.`,
            `点 $(${px}, ${py})$ 给出 $f = ${level}$，所以它在等值线 $${pick.formula} = ${level}$ 上，这是图中的一条曲线。`,
          ),
        ),
      }),
      drawn(
        square(4),
        pick.levels.map((level): PlaneMark => ({ kind: "contour", f: pick.f, level, accent: true })),
        t(`Level curves in the plane: ${shape.en}.`, `平面上的等值线：${shape["zh-CN"]}。`),
      ),
    );
  },
};

/** readingContours asks how much a function changes between two points of a labelled contour plot. */
const readingContours: KnowledgePointDef = {
  id: "reading-values-from-a-contour-plot",
  title: t("Reading values from a contour plot", "从等值线图读取函数值"),
  explanation: t(
    "A contour plot labels each level curve with the value of $f$ on it, as a map labels height. A point on a curve has the value of that curve, wherever on the curve it sits, so the change in $f$ between two points is the difference of their labels and does not depend on the path between them.\n\nOn a map whose contours are labelled $100, 150, 200$, a walker going from a point on the $200$ curve to a point on the $100$ curve changes height by $100 - 200 = -100$, whatever route she takes.\n\n> **Watch out.** Subtract the label at the start from the label at the end, and keep the sign of a negative label in parentheses. Count the labels, not the curves or their distances from the center.",
    "等值线图在每条等值线上标出 $f$ 的值，就像地图上标出高度。曲线上的点无论位置如何，函数值都等于这条曲线的值，所以两点之间 $f$ 的变化量就是标注之差，与所走的路径无关。\n\n在等值线标为 $100, 150, 200$ 的地图上，从 $200$ 那条曲线上的一点走到 $100$ 那条曲线上的一点，高度变化为 $100 - 200 = -100$，与所走路线无关。\n\n> **注意。** 用终点的标注减去起点的标注，负的标注要加括号保留符号。要用的是标注的值，而不是曲线的条数或它们到中心的距离。",
  ),
  generate(rng: Rng): Problem {
    const c = rng.int(1, 4);
    const d = rng.int(-5, 5);
    const value = (r: number) => c * r * r + d;
    const spots: readonly (readonly [number, Point])[] = [
      [1, [0, 1]],
      [1, [-1, 0]],
      [2, [0, -2]],
      [2, [-2, 0]],
      [3, [0, 3]],
      [3, [-3, 0]],
      [4, [0, -4]],
      [4, [-4, 0]],
      [5, [3, 4]],
      [5, [-3, 4]],
      [5, [4, -3]],
      [5, [-4, -3]],
    ];
    const [ra, pa] = rng.pick(spots);
    const [rb, pb] = rng.pick(spots.filter(([r]) => r !== ra));
    const marks: PlaneMark[] = [1, 2, 3, 4, 5].flatMap((r): PlaneMark[] => [
      { kind: "circle", center: [0, 0], r },
      { kind: "label", at: [r, 0], text: String(value(r)).replace("-", "−"), dir: "ne" },
    ]);
    marks.push(
      { kind: "point", at: pa, label: "P", dir: "nw", accent: true },
      { kind: "point", at: pb, label: "Q", dir: "nw", accent: true },
    );
    const answer = value(rb) - value(ra);
    return withFigure(
      numberProblem({
        prompt: t(
          "The contour plot labels each level curve of $f$ with its value. Find $f(Q) - f(P)$.",
          "等值线图上标出了 $f$ 每条等值线的值。求 $f(Q) - f(P)$。",
        ),
        answer,
        mistakes: [
          why(
            -answer,
            "That is $f(P) - f(Q)$; subtract the value at $P$ from the value at $Q$.",
            "这是 $f(P) - f(Q)$；应当用 $Q$ 处的值减去 $P$ 处的值。",
          ),
          why(value(rb) + value(ra), "The labels were added; the change is their difference.", "这是把两个标注相加了；变化量是它们的差。"),
          why(
            rb - ra,
            "That counts circles between the points; use the labels on the circles instead.",
            "这是数两点之间隔了几个圆；应当用圆上标注的值。",
          ),
        ].filter((m, i, all) => m.value !== answer && all.findIndex((n) => n.value === m.value) === i),
        solution: walked(
          [
            [
              ["Read the labels", "读标注"],
              t(
                `$P$ lies on the curve labelled $${value(ra)}$ and $Q$ on the curve labelled $${value(rb)}$, so $f(P) = ${value(ra)}$ and $f(Q) = ${value(rb)}$.`,
                `$P$ 在标为 $${value(ra)}$ 的曲线上，$Q$ 在标为 $${value(rb)}$ 的曲线上，所以 $f(P) = ${value(ra)}$，$f(Q) = ${value(rb)}$。`,
              ),
            ],
            [
              ["Subtract", "相减"],
              t(
                `$f(Q) - f(P) = ${value(rb)} - ${paren(value(ra))} = ${answer}$.`,
                `$f(Q) - f(P) = ${value(rb)} - ${paren(value(ra))} = ${answer}$。`,
              ),
            ],
          ],
          t(
            `Starting from $f(P) = ${value(ra)}$ and adding the change $${answer}$ gives $${value(rb)}$, the label of the curve through $Q$.`,
            `从 $f(P) = ${value(ra)}$ 出发加上变化量 $${answer}$，得到 $${value(rb)}$，正是经过 $Q$ 的曲线的标注。`,
          ),
        ),
      }),
      drawn(
        square(6),
        marks,
        t(
          `Five circles around the origin labelled, from the inside out, ${[1, 2, 3, 4, 5].map(value).join(", ")}. P is on the circle labelled ${value(ra)} and Q on the circle labelled ${value(rb)}.`,
          `以原点为中心的五个圆，从内到外分别标为 ${[1, 2, 3, 4, 5].map(value).join("、")}。P 在标为 ${value(ra)} 的圆上，Q 在标为 ${value(rb)} 的圆上。`,
        ),
      ),
    );
  },
};

/** gradientOnContour asks for the gradient at a point of a level curve, against the tangent and the reversed vectors. */
const gradientOnContour: KnowledgePointDef = {
  id: "the-gradient-on-a-level-curve",
  figure: multivariableDrawings2["the-gradient-as-a-normal-vector#the-gradient-on-a-level-curve"],
  title: t("The gradient on a level curve", "等值线上的梯度"),
  explanation: t(
    "At a point of a level curve, the gradient is perpendicular to the curve and points toward larger values of $f$. For an ellipse $ax^2 + by^2 = c$ with positive $a$ and $b$, values grow away from the origin, so the gradient points outward. A vector along the curve has dot product zero with the gradient, which separates the two directions. For $x^2 + 4y^2 = 8$ at $(2, 1)$, $\\nabla f = \\langle 2x, 8y \\rangle = \\langle 4, 8 \\rangle$, pointing out of the ellipse.\n\n> **Watch out.** $-\\nabla f$ is also perpendicular to the curve, but it points inward, toward smaller values. Keep the factor $2$ from each square: $\\langle ax, by \\rangle$ has the right direction but half the length.",
    "在等值线上的一点，梯度垂直于曲线，并指向 $f$ 增大的一侧。对正数 $a$、$b$ 的椭圆 $ax^2 + by^2 = c$，函数值离原点越远越大，所以梯度指向外侧。沿曲线方向的向量与梯度的点积为零，由此可以区分这两个方向。对 $x^2 + 4y^2 = 8$ 在 $(2, 1)$ 处，$\\nabla f = \\langle 2x, 8y \\rangle = \\langle 4, 8 \\rangle$，指向椭圆外侧。\n\n> **注意。** $-\\nabla f$ 也垂直于曲线，但它指向内侧，即函数值减小的方向。要保留每个平方项求导得到的因子 $2$：$\\langle ax, by \\rangle$ 方向对，但长度只有一半。",
  ),
  generate(rng: Rng): Problem {
    const a = rng.int(1, 3);
    const b = rng.int(1, 3);
    const p = rng.pick([-2, -1, 1, 2]);
    const q = rng.pick([-2, -1, 1, 2]);
    const level = a * p * p + b * q * q;
    const r = Math.ceil(Math.sqrt(level)) + 1;
    const fx = 2 * a * p;
    const fy = 2 * b * q;
    return withFigure(
      explainedChoice(rng, {
        prompt: t(
          `The drawing shows the level curve of $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ through the point $P$. What is $\\nabla f(P)$?`,
          `图中是 $f(x, y) = ${poly([a, "x^2"], [b, "y^2"])}$ 经过点 $P$ 的等值线。$\\nabla f(P)$ 是什么？`,
        ),
        correct: math(angled(fx, fy)),
        wrong: [
          {
            option: math(angled(-fx, -fy)),
            why: t(
              "This is $-\\nabla f$: it points into the ellipse, toward smaller values of $f$.",
              "这是 $-\\nabla f$：它指向椭圆内部，即 $f$ 减小的方向。",
            ),
          },
          {
            option: math(angled(fy, -fx)),
            why: t(
              "Its dot product with the gradient is zero, so it runs along the curve, where $f$ does not change.",
              "它与梯度的点积为零，所以沿着曲线方向，$f$ 在该方向上不变。",
            ),
          },
          {
            option: math(angled(a * p, b * q)),
            why: t(
              "This is half the gradient: differentiating a square brings down a factor $2$.",
              "这是梯度的一半：对平方项求导要带下因子 $2$。",
            ),
          },
        ],
        solution: walked(
          [
            [["Read the point", "读出点的坐标"], t(`$P = (${p}, ${q})$ in the drawing.`, `图中 $P = (${p}, ${q})$。`)],
            [
              ["Differentiate", "求导"],
              t(
                `$\\nabla f = \\langle ${2 * a}x, ${2 * b}y \\rangle$, so $\\nabla f(P) = ${angled(fx, fy)}$.`,
                `$\\nabla f = \\langle ${2 * a}x, ${2 * b}y \\rangle$，所以 $\\nabla f(P) = ${angled(fx, fy)}$。`,
              ),
            ],
          ],
          t(
            `It points outward, and $f$ does grow outward: $f(P) = ${level}$, while $f(${2 * p}, ${2 * q}) = ${4 * level}$.`,
            `它指向外侧，而 $f$ 确实向外增大：$f(P) = ${level}$，而 $f(${2 * p}, ${2 * q}) = ${4 * level}$。`,
          ),
        ),
      }),
      drawn(
        square(Math.max(r, 3)),
        [
          { kind: "contour", f: (x, y) => a * x * x + b * y * y, level, accent: true },
          { kind: "point", at: [p, q], label: "P", dir: awayFrom([p, q]) },
        ],
        t(`An ellipse around the origin, with the point P at (${p}, ${q}) on it.`, `以原点为中心的椭圆，其上的点 P 位于 (${p}, ${q})。`),
      ),
    );
  },
};

/** domainFromDrawing asks which function has the shaded region as its domain. */
const domainFromDrawing: KnowledgePointDef = {
  id: "a-domain-in-a-drawing",
  title: t("A domain in a drawing", "图中的定义域"),
  explanation: t(
    "A domain is a region of the plane, so it can be drawn. A square root needs a nonnegative argument, a logarithm needs a positive one, and a denominator must not vanish. For $\\sqrt{25 - x^2 - y^2}$ the condition $x^2 + y^2 \\le 25$ is a disk, drawn here; for $\\ln(y - 3x)$ the condition $y > 3x$ is the open half-plane above a line.\n\n> **Watch out.** A square root keeps its boundary, drawn solid, because $\\sqrt{0}$ is allowed; a logarithm loses it, drawn dashed, because $\\ln 0$ is not. Test one shaded point to tell inside from outside and above from below.",
    "定义域是平面上的一个区域，因此可以画出来。平方根要求被开方数非负，对数要求真数为正，分母不能为零。对 $\\sqrt{25 - x^2 - y^2}$，条件 $x^2 + y^2 \\le 25$ 是图中的圆盘；对 $\\ln(y - 3x)$，条件 $y > 3x$ 是直线上方的开半平面。\n\n> **注意。** 平方根保留边界，画成实线，因为 $\\sqrt{0}$ 有意义；对数不含边界，画成虚线，因为 $\\ln 0$ 没有意义。取一个阴影中的点检验，就能分清内外和上下。",
  ),
  figure: drawn(
    square(6),
    [
      { kind: "region", halfPlanes: [], disk: { center: [0, 0], r: 5 } },
      { kind: "circle", center: [0, 0], r: 5, accent: true },
    ],
    t("A shaded disk of radius 5 around the origin, with its boundary drawn solid.", "以原点为圆心、半径为 5 的阴影圆盘，边界画成实线。"),
  ),
  generate(rng: Rng): Problem {
    const R = rng.int(2, 4);
    const m = rng.pick([-2, -1, 1, 2]);
    const b = rng.int(-2, 2);
    const inside = `\\sqrt{${R * R} - x^2 - y^2}`;
    const outside = `\\sqrt{x^2 + y^2 - ${R * R}}`;
    const lineTerm = poly([1, "y"], [-m, "x"], [-b, ""]);
    const above = `\\ln(${lineTerm})`;
    const below = `\\ln(${poly([m, "x"], [-1, "y"], [b, ""])})`;
    const a: Point = [-1, m * -1 + b];
    const c: Point = [1, m + b];
    const kinds = [
      {
        right: inside,
        wrong: [outside, above, below],
        marks: [
          { kind: "region", halfPlanes: [], disk: { center: [0, 0], r: R } },
          { kind: "circle", center: [0, 0], r: R, accent: true },
        ] as PlaneMark[],
        why: t(
          `A square root needs $${R * R} - x^2 - y^2 \\ge 0$, that is $x^2 + y^2 \\le ${R * R}$: the disk with its boundary.`,
          `平方根要求 $${R * R} - x^2 - y^2 \\ge 0$，即 $x^2 + y^2 \\le ${R * R}$：包括边界的圆盘。`,
        ),
        alt: t(
          `A shaded disk of radius ${R} around the origin, with a solid boundary.`,
          `以原点为圆心、半径为 ${R} 的阴影圆盘，边界为实线。`,
        ),
      },
      {
        right: outside,
        wrong: [inside, above, below],
        marks: [
          { kind: "region", halfPlanes: [], disk: { center: [0, 0], r: R, outside: true } },
          { kind: "circle", center: [0, 0], r: R, accent: true },
        ] as PlaneMark[],
        why: t(
          `A square root needs $x^2 + y^2 - ${R * R} \\ge 0$: the outside of the circle of radius $${R}$, with the circle itself.`,
          `平方根要求 $x^2 + y^2 - ${R * R} \\ge 0$：半径为 $${R}$ 的圆的外部，包括圆本身。`,
        ),
        alt: t(
          `The plane shaded outside a circle of radius ${R} around the origin, with a solid boundary.`,
          `以原点为圆心、半径为 ${R} 的圆的外部有阴影，边界为实线。`,
        ),
      },
      {
        right: above,
        wrong: [below, inside, outside],
        marks: [
          { kind: "region", halfPlanes: [[-m, 1, -b]] },
          { kind: "line", a, b: c, accent: true, dashed: true },
        ] as PlaneMark[],
        why: t(
          `A logarithm needs $${lineTerm} > 0$, that is $y > ${poly([m, "x"], [b, ""])}$: the region above the dashed line, without the line.`,
          `对数要求 $${lineTerm} > 0$，即 $y > ${poly([m, "x"], [b, ""])}$：虚线上方的区域，不含直线。`,
        ),
        alt: t(
          `The plane shaded above the dashed line through (-1, ${a[1]}) and (1, ${c[1]}).`,
          `过 (-1, ${a[1]}) 和 (1, ${c[1]}) 的虚线上方有阴影。`,
        ),
      },
      {
        right: below,
        wrong: [above, inside, outside],
        marks: [
          { kind: "region", halfPlanes: [[m, -1, b]] },
          { kind: "line", a, b: c, accent: true, dashed: true },
        ] as PlaneMark[],
        why: t(
          `A logarithm needs a positive argument, that is $y < ${poly([m, "x"], [b, ""])}$: the region below the dashed line, without the line.`,
          `对数要求真数为正，即 $y < ${poly([m, "x"], [b, ""])}$：虚线下方的区域，不含直线。`,
        ),
        alt: t(
          `The plane shaded below the dashed line through (-1, ${a[1]}) and (1, ${c[1]}).`,
          `过 (-1, ${a[1]}) 和 (1, ${c[1]}) 的虚线下方有阴影。`,
        ),
      },
    ];
    const k = rng.int(0, 3);
    const kind = kinds[k] as (typeof kinds)[number];
    const line = poly([m, "x"], [b, ""]);
    const domains: Record<string, Text> = {
      [inside]: t(`the disk $x^2 + y^2 \\le ${R * R}$`, `圆盘 $x^2 + y^2 \\le ${R * R}$`),
      [outside]: t(`the region $x^2 + y^2 \\ge ${R * R}$ outside the circle`, `圆外的区域 $x^2 + y^2 \\ge ${R * R}$`),
      [above]: t(`the open half-plane $y > ${line}$`, `开半平面 $y > ${line}$`),
      [below]: t(`the open half-plane $y < ${line}$`, `开半平面 $y < ${line}$`),
    };
    const shaded = (domains[kind.right] as Text).en;
    const shadedZh = (domains[kind.right] as Text)["zh-CN"];
    const tests: Point[] = [
      [0, 0],
      [R + 1, 0],
      [0, b + 3],
      [0, b - 3],
    ];
    const [tx, ty] = tests[k] as Point;
    const tested = [
      t(
        `At $(0, 0)$ the root is $\\sqrt{${R * R}} = ${R}$, and the origin is shaded.`,
        `在 $(0, 0)$ 处根式为 $\\sqrt{${R * R}} = ${R}$，原点在阴影内。`,
      ),
      t(
        `At $(${tx}, 0)$ the root is $\\sqrt{${tx * tx} - ${R * R}} = \\sqrt{${tx * tx - R * R}}$, and that point is shaded.`,
        `在 $(${tx}, 0)$ 处根式为 $\\sqrt{${tx * tx} - ${R * R}} = \\sqrt{${tx * tx - R * R}}$，该点在阴影内。`,
      ),
      t(
        `At $(0, ${ty})$ the argument is $${ty} - ${paren(b)} = 3 > 0$, and that point is shaded.`,
        `在 $(0, ${ty})$ 处真数为 $${ty} - ${paren(b)} = 3 > 0$，该点在阴影内。`,
      ),
      t(
        `At $(0, ${ty})$ the argument is $${paren(b)} - ${paren(ty)} = 3 > 0$, and that point is shaded.`,
        `在 $(0, ${ty})$ 处真数为 $${paren(b)} - ${paren(ty)} = 3 > 0$，该点在阴影内。`,
      ),
    ][k] as Text;
    return withFigure(
      explainedChoice(rng, {
        prompt: t(
          "The shaded region is the domain of a function $f(x, y)$; a solid boundary belongs to it and a dashed one does not. Which function?",
          "阴影区域是函数 $f(x, y)$ 的定义域；实线边界属于定义域，虚线边界不属于。是哪个函数？",
        ),
        correct: math(`f(x, y) = ${kind.right}`),
        wrong: kind.wrong.map((w) => ({
          option: math(`f(x, y) = ${w}`),
          why: t(
            `Its domain is ${(domains[w] as Text).en}, but the shaded region is ${shaded}.`,
            `它的定义域是${(domains[w] as Text)["zh-CN"]}，而阴影区域是${shadedZh}。`,
          ),
        })),
        solution: walked(
          [
            [["Read the region", "读区域"], t(`The shaded region is ${shaded}.`, `阴影区域是${shadedZh}。`)],
            [["Find the condition", "求条件"], kind.why],
          ],
          tested,
        ),
      }),
      drawn(square(5), kind.marks, kind.alt),
    );
  },
};

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

/** quadricFamily lists quadric surfaces with their equations and meshes, for positive coefficients A and B. */
function quadricFamily(A: number, B: number) {
  const [ra, rb] = [1 / Math.sqrt(A), 1 / Math.sqrt(B)];
  const { sin, cos, sinh, cosh, PI } = Math;
  return [
    {
      equation: `x^2 + ${term(A, "y^2")} + ${term(B, "z^2")} = 1`,
      name: t("an ellipsoid", "椭球面"),
      look: t("a closed oval surface", "封闭的卵形曲面"),
      why: t("Every variable is bounded, and all three squares have a plus sign.", "三个变量都有界，三个平方项都取正号。"),
      r: ((u, v) => [sin(u) * cos(v), ra * sin(u) * sin(v), rb * cos(u)]) as Surface,
      u: [0, PI] as Point,
      v: [0, 2 * PI] as Point,
    },
    {
      equation: `z = x^2 + ${term(A, "y^2")}`,
      name: t("an elliptic paraboloid", "椭圆抛物面"),
      look: t("a bowl opening upward from the origin", "从原点向上张开的碗形曲面"),
      why: t(
        "One variable appears to the first power, and the other two squares have the same sign.",
        "一个变量是一次的，另外两个平方项同号。",
      ),
      r: ((u, v) => [u * cos(v), ra * u * sin(v), u * u]) as Surface,
      u: [0, 1.6] as Point,
      v: [0, 2 * PI] as Point,
    },
    {
      equation: `z^2 = x^2 + ${term(A, "y^2")}`,
      name: t("a double cone", "双锥面"),
      look: t("two cones meeting at the origin, one above and one below", "在原点相接的上下两个锥"),
      why: t(
        "Every term has degree two and there is no constant, so the surface is made of lines through the origin.",
        "每一项都是二次的且没有常数项，所以曲面由过原点的直线组成。",
      ),
      r: ((u, v) => [u * cos(v), ra * u * sin(v), u]) as Surface,
      u: [-1.6, 1.6] as Point,
      v: [0, 2 * PI] as Point,
    },
    {
      equation: `x^2 + ${term(A, "y^2")} - ${term(B, "z^2")} = 1`,
      name: t("a hyperboloid of one sheet", "单叶双曲面"),
      look: t("a single connected tube with a narrow waist", "连成一片、中间收窄的管状曲面"),
      why: t(
        "One square has a minus sign and the right side is positive, so the horizontal sections are ovals at every height.",
        "有一个平方项为负，右边为正，所以任何高度的水平截面都是卵形。",
      ),
      r: ((u, v) => [cosh(u) * cos(v), ra * cosh(u) * sin(v), rb * sinh(u)]) as Surface,
      u: [-1.2, 1.2] as Point,
      v: [0, 2 * PI] as Point,
    },
    {
      equation: `z = x^2 - ${term(A, "y^2")}`,
      name: t("a hyperbolic paraboloid", "双曲抛物面"),
      look: t("a saddle, rising along one axis and falling along the other", "马鞍形，沿一条轴上升，沿另一条轴下降"),
      why: t(
        "One variable appears to the first power, and the other two squares have opposite signs.",
        "一个变量是一次的，另外两个平方项异号。",
      ),
      r: ((u, v) => [u, ra * v, u * u - v * v]) as Surface,
      u: [-1.2, 1.2] as Point,
      v: [-1.2, 1.2] as Point,
    },
  ];
}

/** recognizingQuadrics asks for the equation of the quadric drawn. */
const recognizingQuadrics: KnowledgePointDef = {
  id: "recognizing-a-quadric-from-its-drawing",
  title: t("Recognizing a quadric from its drawing", "从图形辨认二次曲面"),
  explanation: t(
    "Each quadric has a shape that its equation predicts. A closed oval is an ellipsoid; a bowl is an elliptic paraboloid, with one variable to the first power; a saddle is a hyperbolic paraboloid; two cones meeting at a point have no constant term; and a tube with a waist is a hyperboloid of one sheet. The bowl drawn here is $z = 2x^2 + 2y^2$: its horizontal sections are circles, and it rises from its lowest point at the origin.\n\n> **Watch out.** Count the variables that appear to the first power before looking at signs: a bowl and a saddle each have one, while an ellipsoid, a cone and a hyperboloid have none. Then a saddle has opposite signs on its squares, and a cone has no constant term.",
    "每种二次曲面的形状都可以由方程预见。封闭的卵形是椭球面；碗形是椭圆抛物面，有一个变量是一次的；马鞍形是双曲抛物面；在一点相接的两个锥没有常数项；中间收窄的管状曲面是单叶双曲面。这里画出的碗形是 $z = 2x^2 + 2y^2$：它的水平截面是圆，从原点处的最低点向上升起。\n\n> **注意。** 先数一数有几个变量是一次的，再看符号：碗形和马鞍形各有一个，椭球面、锥面和双曲面一个也没有。然后，马鞍形的平方项异号，锥面没有常数项。",
  ),
  figure: wireframe(
    (u, v) => [u * Math.cos(v), u * Math.sin(v), 2 * u * u],
    [0, 1.2],
    [0, 2 * Math.PI],
    t("A bowl opening upward from the origin, drawn as a mesh, with the z-axis up.", "从原点向上张开的碗形曲面，画成网格，z 轴向上。"),
  ),
  generate(rng: Rng): Problem {
    const A = rng.int(1, 4);
    const B = rng.int(1, 4);
    const family = quadricFamily(A, B);
    const chosen = rng.int(0, family.length - 1);
    const pick = family[chosen] as (typeof family)[number];
    return withFigure(
      explainedChoice(rng, {
        prompt: t("Which equation has this surface as its graph?", "这个曲面是哪个方程的图形？"),
        correct: math(pick.equation),
        wrong: rng.shuffle(family.filter((_, i) => i !== chosen)).map((o) => ({
          option: math(o.equation),
          why: t(
            `That equation gives ${o.name.en}, ${o.look.en}, but the drawing is ${pick.look.en}.`,
            `这个方程给出${o.name["zh-CN"]}，即${o.look["zh-CN"]}，而图形是${pick.look["zh-CN"]}。`,
          ),
        })),
        solution: walked(
          [
            [
              ["Name the shape", "说出形状"],
              t(`The drawing is ${pick.look.en}, which is ${pick.name.en}.`, `图形是${pick.look["zh-CN"]}，这是${pick.name["zh-CN"]}。`),
            ],
            [["Match the equation", "对应方程"], t(`$${pick.equation}$: ${pick.why.en}`, `$${pick.equation}$：${pick.why["zh-CN"]}`)],
          ],
          t(
            `Each other equation has a different pattern of first powers, signs or constant, so only $${pick.equation}$ gives ${pick.name.en}.`,
            `其他方程的一次项、符号或常数项的情况都不同，所以只有 $${pick.equation}$ 给出${pick.name["zh-CN"]}。`,
          ),
        ),
      }),
      wireframe(
        pick.r,
        pick.u,
        pick.v,
        t(`A mesh drawing with the z-axis up: ${pick.look.en}.`, `网格图，z 轴向上：${pick.look["zh-CN"]}。`),
      ),
    );
  },
};

/** matchingParametrizations asks which parametrization draws the surface shown. */
const matchingParametrizations: KnowledgePointDef = {
  id: "matching-a-drawing-to-its-parametrization",
  figure: multivariableDrawings7["parametric-surfaces#matching-a-drawing-to-its-parametrization"],
  title: t("Matching a drawing to its parametrization", "把图形与参数化对应"),
  explanation: t(
    "To see what a parametrization draws, eliminate the parameters. In $\\langle u \\cos v, u \\sin v, u^2 \\rangle$ we have $x^2 + y^2 = u^2 = z$, a paraboloid. In $\\langle 2 \\cos v, 2 \\sin v, u \\rangle$ we have $x^2 + y^2 = 4$ with $z$ free, a cylinder. In $\\langle u \\cos v, u \\sin v, 2u \\rangle$ the height grows in proportion to the distance from the axis, a cone.",
    "要看参数化画出什么，就消去参数。在 $\\langle u \\cos v, u \\sin v, u^2 \\rangle$ 中，$x^2 + y^2 = u^2 = z$，是抛物面。在 $\\langle 2 \\cos v, 2 \\sin v, u \\rangle$ 中，$x^2 + y^2 = 4$ 而 $z$ 任意，是圆柱面。在 $\\langle u \\cos v, u \\sin v, 2u \\rangle$ 中，高度与到轴的距离成正比，是锥面。",
  ),
  generate(rng: Rng): Problem {
    const a = rng.int(2, 6);
    const k = rng.int(2, 5);
    const { sin, cos, PI } = Math;
    const threeD = (x: string, y: string, z: string) => `\\mathbf{r}(u, v) = \\langle ${x}, ${y}, ${z} \\rangle`;
    const kinds = [
      {
        formula: threeD(`${a} \\cos v`, `${a} \\sin v`, "u"),
        r: ((u, v) => [a * cos(v), a * sin(v), u]) as Surface,
        u: [0, a * 1.6] as Point,
        v: [0, 2 * PI] as Point,
        look: t("an upright cylinder", "竖直的圆柱面"),
        why: t(`Here $x^2 + y^2 = ${a * a}$ with $z$ free.`, `这里 $x^2 + y^2 = ${a * a}$，而 $z$ 任意。`),
      },
      {
        formula: threeD("u \\cos v", "u \\sin v", `${k}u`),
        r: ((u, v) => [u * cos(v), u * sin(v), k * u]) as Surface,
        u: [0, 2] as Point,
        v: [0, 2 * PI] as Point,
        look: t("a cone with its tip at the origin", "顶点在原点的锥面"),
        why: t(
          `Here $z = ${k}\\sqrt{x^2 + y^2}$, so the height grows in proportion to the distance from the axis.`,
          `这里 $z = ${k}\\sqrt{x^2 + y^2}$，高度与到轴的距离成正比。`,
        ),
      },
      {
        formula: threeD("u \\cos v", "u \\sin v", term(k, "u^2")),
        r: ((u, v) => [u * cos(v), u * sin(v), k * u * u]) as Surface,
        u: [0, 1.5] as Point,
        v: [0, 2 * PI] as Point,
        look: t("a bowl opening upward", "向上张开的碗形曲面"),
        why: t(`Here $z = ${k}(x^2 + y^2)$, a paraboloid.`, `这里 $z = ${k}(x^2 + y^2)$，是抛物面。`),
      },
      {
        formula: threeD(`${a} \\sin u \\cos v`, `${a} \\sin u \\sin v`, `${a} \\cos u`),
        r: ((u, v) => [a * sin(u) * cos(v), a * sin(u) * sin(v), a * cos(u)]) as Surface,
        u: [0, PI] as Point,
        v: [0, 2 * PI] as Point,
        look: t("a sphere", "球面"),
        why: t(`Here $x^2 + y^2 + z^2 = ${a * a}$.`, `这里 $x^2 + y^2 + z^2 = ${a * a}$。`),
      },
      {
        formula: threeD("u", "v", poly([k, "u"], [1, "v"])),
        r: ((u, v) => [u, v, k * u + v]) as Surface,
        u: [-1, 1] as Point,
        v: [-1, 1] as Point,
        look: t("a flat tilted sheet", "倾斜的平面片"),
        why: t(`Here $z = ${poly([k, "x"], [1, "y"])}$, a plane.`, `这里 $z = ${poly([k, "x"], [1, "y"])}$，是平面。`),
      },
    ];
    const chosen = rng.int(0, kinds.length - 1);
    const pick = kinds[chosen] as (typeof kinds)[number];
    return withFigure(
      pickChoice(
        rng,
        t("Which parametrization draws this surface?", "哪个参数化画出这个曲面？"),
        math(pick.formula),
        rng.shuffle(kinds.filter((_, i) => i !== chosen)).map((o) => math(o.formula)),
        t(`The drawing is ${pick.look.en}. ${pick.why.en}`, `图形是${pick.look["zh-CN"]}。${pick.why["zh-CN"]}`),
      ),
      wireframe(
        pick.r,
        pick.u,
        pick.v,
        t(`A mesh drawing with the z-axis up: ${pick.look.en}.`, `网格图，z 轴向上：${pick.look["zh-CN"]}。`),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Regions of integration
// ---------------------------------------------------------------------------

/** iterated writes an iterated integral of f(x, y), the inner integral in y. */
const iterated = (a: string | number, b: string | number, lo: string | number, hi: string | number) =>
  `\\int_{${a}}^{${b}} \\int_{${lo}}^{${hi}} f(x, y) \\, dy \\, dx`;

/** limitsFromRegion asks which iterated integral describes a shaded region. */
const limitsFromRegion: KnowledgePointDef = {
  id: "limits-of-integration-from-a-drawing",
  title: t("Limits of integration from a drawing", "从图形确定积分限"),
  explanation: t(
    "To integrate with $dy$ inside, read the region in vertical slices. The outer limits are the leftmost and rightmost $x$ of the region, numbers. The inner limits are the lower and upper curves that a vertical line meets, functions of $x$. For the region between $y = x^3$ and $y = x$ with $0 \\le x \\le 1$, a vertical line enters on $y = x^3$ and leaves on $y = x$, so the integral is $\\int_0^1 \\int_{x^3}^{x} f(x, y)\\,dy\\,dx$.\n\n> **Watch out.** The outer limits are numbers and the inner limits are curves in $x$, lower curve first. With $dx$ written inside, the inner limits would have to be functions of $y$.",
    "要让 $dy$ 在内层积分，就用竖直切片读图。外层积分限是区域最左和最右的 $x$，是数字。内层积分限是竖线碰到的下方和上方的曲线，是 $x$ 的函数。对 $0 \\le x \\le 1$ 中 $y = x^3$ 与 $y = x$ 之间的区域，竖线从 $y = x^3$ 进入、从 $y = x$ 离开，所以积分为 $\\int_0^1 \\int_{x^3}^{x} f(x, y)\\,dy\\,dx$。\n\n> **注意。** 外层积分限是数字，内层积分限是关于 $x$ 的曲线，下方曲线在前。若把 $dx$ 写在内层，内层积分限就必须是 $y$ 的函数。",
  ),
  generate(rng: Rng): Problem {
    const kind = rng.int(0, 2);
    const slope = (m: Q) => (m.eq(Q.of(1)) ? "x" : `${m.toLatex()}x`);
    if (kind === 0) {
      const c = rng.int(1, 3);
      const curve = sampled((x) => x * x, 0, c, 60);
      const top = term(c, "x");
      const far = c === 1 ? 2 : c * c;
      return withFigure(
        explainedChoice(rng, {
          prompt: t(
            "Which iterated integral covers the shaded region, bounded by a line through the origin and the parabola $y = x^2$?",
            "哪个累次积分覆盖阴影区域？该区域由一条过原点的直线和抛物线 $y = x^2$ 围成。",
          ),
          correct: math(iterated(0, c, "x^2", top)),
          wrong: [
            {
              option: math(iterated(0, c, top, "x^2")),
              why: t(
                `The limits are upside down: for $0 < x < ${c}$ the line $y = ${top}$ is above the parabola.`,
                `上下限颠倒了：在 $0 < x < ${c}$ 上直线 $y = ${top}$ 在抛物线上方。`,
              ),
            },
            {
              option: math(iterated(0, far, "x^2", top)),
              why: t(
                `The curves meet where $x^2 = ${top}$, at $x = ${c}$, not $x = ${far}$.`,
                `两曲线在 $x^2 = ${top}$ 处相交，即 $x = ${c}$，不是 $x = ${far}$。`,
              ),
            },
            {
              option: math(`\\int_{0}^{${c}} \\int_{x^2}^{${top}} f(x, y) \\, dx \\, dy`),
              why: t(
                "That puts $dx$ inside, but the inner limits are functions of $x$; with $dx$ inside they must be functions of $y$.",
                "那是把 $dx$ 放在内层，但内层积分限是 $x$ 的函数；$dx$ 在内层时它们必须是 $y$ 的函数。",
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Find the outer limits", "求外层积分限"],
                t(
                  `The curves meet where $x^2 = ${top}$, at $x = 0$ and $x = ${c}$.`,
                  `两条曲线相交于 $x^2 = ${top}$，即 $x = 0$ 和 $x = ${c}$。`,
                ),
              ],
              [
                ["Read a vertical slice", "读竖直切片"],
                t(
                  `Between them a vertical line enters on the lower curve $y = x^2$ and leaves on the upper curve $y = ${top}$.`,
                  `在它们之间，竖线从下方曲线 $y = x^2$ 进入，从上方曲线 $y = ${top}$ 离开。`,
                ),
              ],
            ],
            t(
              `With $f = 1$ the integral gives the area $\\int_0^{${c}} (${top} - x^2)\\,dx = ${frac(c ** 3, 6)} > 0$, so the lower limit is indeed below the upper one.`,
              `取 $f = 1$，积分给出面积 $\\int_0^{${c}} (${top} - x^2)\\,dx = ${frac(c ** 3, 6)} > 0$，所以下限确实在上限下方。`,
            ),
          ),
        }),
        drawn(
          { xMin: -1, xMax: c + 1, yMin: -1, yMax: c * c + 1 },
          [
            { kind: "polygon", points: curve },
            { kind: "path", points: curve, accent: true },
            { kind: "segment", a: [0, 0], b: [c, c * c], accent: true },
          ],
          t(
            `A shaded region bounded below by y = x² and above by a line, between (0, 0) and (${c}, ${c * c}).`,
            `阴影区域，下方由 y = x² 围成，上方由一条直线围成，介于 (0, 0) 和 (${c}, ${c * c}) 之间。`,
          ),
        ),
      );
    }
    const a = rng.int(2, 6);
    let b: number;
    do b = rng.int(1, 6);
    while (b === a);
    const line = slope(Q.of(b, a));
    const below = kind === 1;
    const corner: Point = below ? [a, 0] : [0, b];
    const right = below ? iterated(0, a, 0, line) : iterated(0, a, line, b);
    return withFigure(
      explainedChoice(rng, {
        prompt: t("Which iterated integral covers the shaded triangle?", "哪个累次积分覆盖阴影三角形？"),
        correct: math(right),
        wrong: [
          {
            option: math(below ? iterated(0, a, line, b) : iterated(0, a, 0, line)),
            why: t(
              `That is the other half of the rectangle $[0, ${a}] \\times [0, ${b}]$, ${below ? "above" : "below"} the hypotenuse $y = ${line}$.`,
              `那是矩形 $[0, ${a}] \\times [0, ${b}]$ 的另一半，在斜边 $y = ${line}$ 的${below ? "上方" : "下方"}。`,
            ),
          },
          {
            option: math(below ? iterated(0, b, 0, line) : iterated(0, b, line, a)),
            why: t(
              `$x$ runs over the width $${a}$ of the triangle; $${b}$ is its height${below ? "" : `, and the top edge is $y = ${b}$`}.`,
              `$x$ 取遍三角形的宽 $${a}$；$${b}$ 是它的高${below ? "" : `，上边是 $y = ${b}$`}。`,
            ),
          },
          {
            option: math(iterated(0, a, 0, b)),
            why: t(
              `That covers the whole rectangle $[0, ${a}] \\times [0, ${b}]$; the hypotenuse $y = ${line}$ cuts it in half.`,
              `那覆盖了整个矩形 $[0, ${a}] \\times [0, ${b}]$；斜边 $y = ${line}$ 把它分成两半。`,
            ),
          },
        ],
        solution: walked(
          [
            [
              ["Find the hypotenuse", "求斜边"],
              t(
                `The hypotenuse joins $(0, 0)$ and $(${a}, ${b})$, so it is $y = ${line}$.`,
                `斜边连接 $(0, 0)$ 和 $(${a}, ${b})$，所以它是 $y = ${line}$。`,
              ),
            ],
            [
              ["Read a vertical slice", "读竖直切片"],
              t(
                `The triangle spans $x$ from $0$ to $${a}$, and a vertical line ${below ? `enters on $y = 0$ and leaves on $y = ${line}$` : `enters on $y = ${line}$ and leaves on $y = ${b}$`}.`,
                `三角形的 $x$ 从 $0$ 到 $${a}$，竖线${below ? `从 $y = 0$ 进入，从 $y = ${line}$ 离开` : `从 $y = ${line}$ 进入，从 $y = ${b}$ 离开`}。`,
              ),
            ],
          ],
          t(
            `With $f = 1$ the integral is $\\int_0^{${a}} ${below ? line : `\\left(${b} - ${line}\\right)`}\\,dx = ${frac(a * b, 2)}$, the area $\\frac{${a} \\cdot ${b}}{2}$ of the triangle.`,
            `取 $f = 1$，积分为 $\\int_0^{${a}} ${below ? line : `\\left(${b} - ${line}\\right)`}\\,dx = ${frac(a * b, 2)}$，正是三角形的面积 $\\frac{${a} \\cdot ${b}}{2}$。`,
          ),
        ),
      }),
      drawn(
        { xMin: -1, xMax: Math.max(a, b) + 1, yMin: -1, yMax: Math.max(a, b) + 1 },
        [
          { kind: "polygon", points: [[0, 0], corner, [a, b]] },
          { kind: "path", points: [[0, 0], corner, [a, b], [0, 0]], accent: true },
        ],
        t(
          `A shaded triangle with vertices (0, 0), (${corner[0]}, ${corner[1]}) and (${a}, ${b}).`,
          `阴影三角形，顶点为 (0, 0)、(${corner[0]}, ${corner[1]}) 和 (${a}, ${b})。`,
        ),
      ),
    );
  },
};

/** polarLimitsFromRegion asks which polar integral covers a shaded sector or ring. */
const polarLimitsFromRegion: KnowledgePointDef = {
  id: "polar-limits-from-a-drawing",
  figure: multivariableDrawings4["double-integrals-in-plane-polar-coordinates#polar-limits-from-a-drawing"],
  title: t("Polar limits from a drawing", "从图形确定极坐标积分限"),
  explanation: t(
    "A region bounded by arcs around the origin and rays from the origin is a rectangle in polar coordinates. Read $r$ along a ray, from the inner arc to the outer one, and $\\theta$ from the first ray counterclockwise to the last. Then $dA = r \\, dr \\, d\\theta$: the extra factor $r$ is part of the area element and is easy to forget. The region between the arcs $r = 1$ and $r = 3$ and the rays $\\theta = \\frac{\\pi}{3}$ and $\\theta = \\frac{2\\pi}{3}$ gives $\\int_{\\pi/3}^{2\\pi/3} \\int_1^3 g(r, \\theta)\\,r\\,dr\\,d\\theta$.\n\n> **Watch out.** When the shading reaches the origin, $r$ starts at $0$; when there is a hole, $r$ starts at the inner arc, not at $0$. And the factor $r$ belongs in every polar area integral.",
    "由以原点为中心的圆弧和从原点出发的射线围成的区域，在极坐标下是一个矩形。沿射线读 $r$，从内弧到外弧；从第一条射线逆时针到最后一条射线读 $\\theta$。于是 $dA = r \\, dr \\, d\\theta$：多出的因子 $r$ 是面积元的一部分，很容易漏掉。圆弧 $r = 1$、$r = 3$ 与射线 $\\theta = \\frac{\\pi}{3}$、$\\theta = \\frac{2\\pi}{3}$ 之间的区域给出 $\\int_{\\pi/3}^{2\\pi/3} \\int_1^3 g(r, \\theta)\\,r\\,dr\\,d\\theta$。\n\n> **注意。** 阴影延伸到原点时，$r$ 从 $0$ 开始；有空洞时，$r$ 从内弧开始，而不是 $0$。每个极坐标面积积分里都要有因子 $r$。",
  ),
  generate(rng: Rng): Problem {
    const inner = rng.int(0, 2);
    const outer = inner + rng.int(1, 3);
    const spans: readonly (readonly [string, string, number, number])[] = [
      ["0", "\\frac{\\pi}{2}", 0, 0.5],
      ["\\frac{\\pi}{2}", "\\pi", 0.5, 1],
      ["\\pi", "\\frac{3\\pi}{2}", 1, 1.5],
      ["\\frac{3\\pi}{2}", "2\\pi", 1.5, 2],
      ["0", "\\pi", 0, 1],
      ["\\pi", "2\\pi", 1, 2],
      ["\\frac{\\pi}{4}", "\\frac{3\\pi}{4}", 0.25, 0.75],
      ["0", "\\frac{\\pi}{4}", 0, 0.25],
    ];
    const [lo, hi, from, to] = rng.pick(spans);
    const other = rng.pick(spans.filter((s) => s[0] !== lo || s[1] !== hi));
    const arc = (r: number, start: number, end: number) =>
      Array.from({ length: 49 }, (_, i): Point => {
        const angle = Math.PI * (start + ((end - start) * i) / 48);
        return [r * Math.cos(angle), r * Math.sin(angle)];
      });
    const outerArc = arc(outer, from, to);
    const innerArc = arc(inner, to, from);
    const boundary = [...outerArc, ...innerArc, outerArc[0] as Point];
    const integral = (rLo: number, rHi: number, a: string, b: string, jacobian: boolean) =>
      `\\int_{${a}}^{${b}} \\int_{${rLo}}^{${rHi}} g(r, \\theta) ${jacobian ? "\\, r" : ""} \\, dr \\, d\\theta`;
    const area = Q.of(Math.round((to - from) * 4) * (outer * outer - inner * inner), 8);
    const areaPi = area.eq(Q.of(1)) ? "\\pi" : `${area.toLatex()}\\pi`;
    return withFigure(
      explainedChoice(rng, {
        prompt: t(
          "Which integral equals the integral over the shaded region of a function written as $g(r, \\theta)$ in polar coordinates?",
          "函数在极坐标下写作 $g(r, \\theta)$，哪个积分等于它在阴影区域上的积分？",
        ),
        correct: math(integral(inner, outer, lo, hi, true)),
        wrong: [
          {
            option: math(integral(inner, outer, lo, hi, false)),
            why: t("The area element is $r\\,dr\\,d\\theta$; the factor $r$ is missing.", "面积元是 $r\\,dr\\,d\\theta$；漏了因子 $r$。"),
          },
          {
            option: math(integral(inner, outer, other[0], other[1], true)),
            why: t(
              `Those are not the angles of the bounding rays; the region runs from $\\theta = ${lo}$ to $\\theta = ${hi}$.`,
              `那不是边界射线的角度；区域从 $\\theta = ${lo}$ 到 $\\theta = ${hi}$。`,
            ),
          },
          {
            option: math(integral(inner === 0 ? outer : 0, inner === 0 ? outer + 1 : outer, lo, hi, true)),
            why:
              inner === 0
                ? t(
                    `That is the ring just outside the region; the shading runs from the origin to $r = ${outer}$.`,
                    `那是区域外侧紧邻的圆环；阴影从原点延伸到 $r = ${outer}$。`,
                  )
                : t(
                    `That starts $r$ at $0$ and fills in the hole; the shading starts at the inner arc $r = ${inner}$.`,
                    `那是让 $r$ 从 $0$ 开始，把空洞也填上了；阴影从内弧 $r = ${inner}$ 开始。`,
                  ),
          },
        ],
        solution: walked(
          [
            [
              ["Read r along a ray", "沿射线读 r"],
              t(`Along a ray in the region, $r$ runs from $${inner}$ to $${outer}$.`, `沿区域内的射线，$r$ 从 $${inner}$ 到 $${outer}$。`),
            ],
            [
              ["Read the angles", "读出角度"],
              t(
                `The rays sweep counterclockwise from $\\theta = ${lo}$ to $\\theta = ${hi}$, and the area element contributes the factor $r$.`,
                `射线从 $\\theta = ${lo}$ 逆时针扫到 $\\theta = ${hi}$，面积元带来因子 $r$。`,
              ),
            ],
          ],
          t(
            `With $g = 1$ the integral is $(${hi} - ${lo}) \\cdot \\frac{${outer * outer} - ${inner * inner}}{2} = ${areaPi}$, the area of the shaded sector.`,
            `取 $g = 1$，积分为 $(${hi} - ${lo}) \\cdot \\frac{${outer * outer} - ${inner * inner}}{2} = ${areaPi}$，正是阴影扇形的面积。`,
          ),
        ),
      }),
      drawn(
        square(outer + 1),
        [
          { kind: "polygon", points: boundary },
          { kind: "path", points: boundary, accent: true },
        ],
        t(
          `A shaded region between radii ${inner} and ${outer}, from the angle ${from}π to the angle ${to}π.`,
          `阴影区域，半径从 ${inner} 到 ${outer}，角度从 ${from}π 到 ${to}π。`,
        ),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Vectors and matrices
// ---------------------------------------------------------------------------

/** imageOfUnitSquare draws the unit square and its image under a matrix, labelling the images of the basis vectors. */
function imageOfUnitSquare(a: number, b: number, c: number, d: number): Figure {
  const e1: Point = [a, c];
  const e2: Point = [b, d];
  const far: Point = [a + b, c + d];
  return drawn(
    square(reach(e1, e2, far)),
    [
      { kind: "polygon", points: [[0, 0], e1, far, e2] },
      {
        kind: "path",
        points: [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
        dashed: true,
      },
      { kind: "path", points: [e1, far, e2], accent: true },
      ...labelledArrow(e1, "T(e₁)", true),
      ...labelledArrow(e2, "T(e₂)", true),
    ],
    t(
      `The unit square, dashed, and its image, a shaded parallelogram with T(e₁) = (${a}, ${c}) and T(e₂) = (${b}, ${d}).`,
      `虚线的单位正方形及其像：一个阴影平行四边形，其中 T(e₁) = (${a}, ${c})，T(e₂) = (${b}, ${d})。`,
    ),
  );
}

/** invertibleEntries picks the entries of a matrix with a nonzero determinant, no zero column and distinct columns and rows. */
function invertibleEntries(rng: Rng): [number, number, number, number] {
  for (;;) {
    const [a, b, c, d] = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
    if (a * d - b * c !== 0 && b !== c && (a !== d || b !== -c) && a !== b && c !== d) return [a, b, c, d];
  }
}

/** matrixFromUnitSquare asks for the matrix of a transformation drawn through the image of the unit square. */
const matrixFromUnitSquare: KnowledgePointDef = {
  id: "the-matrix-from-the-image-of-the-unit-square",
  title: t("The matrix from the image of the unit square", "由单位正方形的像求矩阵"),
  explanation: t(
    "A linear transformation of the plane is fixed by where it sends the basis vectors, and the columns of its matrix are those images. So the unit square goes to the parallelogram with sides $T(\\mathbf{e}_1)$ and $T(\\mathbf{e}_2)$, and the matrix can be read straight from a drawing: the first column is the tip of $T(\\mathbf{e}_1)$ and the second is the tip of $T(\\mathbf{e}_2)$.\n\n> **Watch out.** Each tip is a column, not a row, and the image of $\\mathbf{e}_1$ comes first.",
    "平面上的线性变换由基向量的像决定，其矩阵的各列就是这些像。所以单位正方形变成以 $T(\\mathbf{e}_1)$ 和 $T(\\mathbf{e}_2)$ 为边的平行四边形，矩阵可以直接从图上读出：第一列是 $T(\\mathbf{e}_1)$ 的终点，第二列是 $T(\\mathbf{e}_2)$ 的终点。\n\n> **注意。** 每个终点是一列，不是一行，并且 $\\mathbf{e}_1$ 的像在前。",
  ),
  figure: imageOfUnitSquare(2, 1, 0, 2),
  generate(rng: Rng): Problem {
    const [a, b, c, d] = invertibleEntries(rng);
    const wrong = [matrix(a, c, b, d), matrix(b, a, d, c), matrix(c, d, a, b)];
    return withFigure(
      reasoned(
        pickChoice(
          rng,
          t(
            "The drawing shows the unit square and its image under a linear transformation $T$. What is the standard matrix of $T$?",
            "图中是单位正方形及其在线性变换 $T$ 下的像。$T$ 的标准矩阵是什么？",
          ),
          math(matrix(a, b, c, d)),
          wrong.map(math),
          t(
            `**Step 1: Read the first arrow.** The tip of $T(\\mathbf{e}_1)$ is at $(${a}, ${c})$, so column 1 of the matrix is $(${a}, ${c})$.\n\n**Step 2: Read the second arrow.** The tip of $T(\\mathbf{e}_2)$ is at $(${b}, ${d})$, so column 2 is $(${b}, ${d})$. The matrix is $${matrix(a, b, c, d)}$.\n\n**Check.** The corner $(1, 1)$ of the square is $\\mathbf{e}_1 + \\mathbf{e}_2$, so its image is the sum of the columns, $(${a + b}, ${c + d})$. This is the far corner of the shaded parallelogram.`,
            `**第一步：读第一个箭头。**$T(\\mathbf{e}_1)$ 的终点在 $(${a}, ${c})$，所以矩阵的第 1 列是 $(${a}, ${c})$。\n\n**第二步：读第二个箭头。**$T(\\mathbf{e}_2)$ 的终点在 $(${b}, ${d})$，所以第 2 列是 $(${b}, ${d})$。矩阵是 $${matrix(a, b, c, d)}$。\n\n**检验。**正方形的角 $(1, 1)$ 是 $\\mathbf{e}_1 + \\mathbf{e}_2$，所以它的像是两列之和 $(${a + b}, ${c + d})$。这正是阴影平行四边形的对角顶点。`,
          ),
        ),
        [
          [`$${wrong[0]}$`, "This writes the tips as rows. They are the columns.", "这里把终点写成了行。它们应该是列。"],
          [
            `$${wrong[1]}$`,
            "This puts the tip of $T(\\mathbf{e}_2)$ in the first column. The image of $\\mathbf{e}_1$ comes first.",
            "这里把 $T(\\mathbf{e}_2)$ 的终点放在了第一列。$\\mathbf{e}_1$ 的像应该在前。",
          ],
          [
            `$${wrong[2]}$`,
            "This swaps the two rows. The first row holds the $x$-coordinates of the tips.",
            "这里交换了两行。第一行应该是各终点的横坐标。",
          ],
        ],
      ),
      imageOfUnitSquare(a, b, c, d),
    );
  },
};

/** linearityFromDrawing asks for the image of a vector, given the images of the basis vectors in a drawing. */
const linearityFromDrawing: KnowledgePointDef = {
  id: "the-image-of-a-vector-from-a-drawing",
  title: t("The image of a vector from a drawing", "由图求向量的像"),
  explanation: t(
    "Knowing where a linear map sends the basis vectors tells you where it sends every vector. Write $\\langle p, q \\rangle = p\\mathbf{e}_1 + q\\mathbf{e}_2$. By linearity, $T\\langle p, q \\rangle = p\\,T(\\mathbf{e}_1) + q\\,T(\\mathbf{e}_2)$, so the coordinates of the input say how much of each drawn arrow to take. For example, if the arrows end at $T(\\mathbf{e}_1) = \\langle 1, 2 \\rangle$ and $T(\\mathbf{e}_2) = \\langle 3, 0 \\rangle$, then $T\\langle 2, -1 \\rangle = 2\\langle 1, 2 \\rangle - \\langle 3, 0 \\rangle = \\langle -1, 4 \\rangle$.\n\n> **Watch out.** Take $p$ copies of the arrow $T(\\mathbf{e}_1)$ and $q$ copies of $T(\\mathbf{e}_2)$; do not mix up which coordinate goes with which arrow.",
    "知道线性映射把基向量送到哪里，就知道它把每个向量送到哪里。写出 $\\langle p, q \\rangle = p\\mathbf{e}_1 + q\\mathbf{e}_2$。由线性性，$T\\langle p, q \\rangle = p\\,T(\\mathbf{e}_1) + q\\,T(\\mathbf{e}_2)$，所以输入的坐标说明每个箭头要取多少。例如若箭头终点为 $T(\\mathbf{e}_1) = \\langle 1, 2 \\rangle$、$T(\\mathbf{e}_2) = \\langle 3, 0 \\rangle$，则 $T\\langle 2, -1 \\rangle = 2\\langle 1, 2 \\rangle - \\langle 3, 0 \\rangle = \\langle -1, 4 \\rangle$。\n\n> **注意。** 取 $p$ 份箭头 $T(\\mathbf{e}_1)$ 和 $q$ 份 $T(\\mathbf{e}_2)$；不要把坐标与箭头配错。",
  ),
  generate(rng: Rng): Problem {
    const [a, b, c, d] = invertibleEntries(rng);
    const p = rng.pick([-3, -2, -1, 2, 3]);
    const q = rng.pick([-3, -2, -1, 2, 3]);
    const x = p * a + q * b;
    const y = p * c + q * d;
    const wrongImages = [
      math(angled(p * a + q * c, p * b + q * d)),
      math(angled(p + a + b, q + c + d)),
      math(angled(q * a + p * b, q * c + p * d)),
    ];
    return withFigure(
      reasoned(
        pickChoice(
          rng,
          t(
            `The drawing shows the images of the basis vectors under a linear map $T$. Find $T${angled(p, q)}$.`,
            `图中是基向量在线性映射 $T$ 下的像。求 $T${angled(p, q)}$。`,
          ),
          math(angled(x, y)),
          wrongImages,
          t(
            `From the drawing, $T(\\mathbf{e}_1) = ${angled(a, c)}$ and $T(\\mathbf{e}_2) = ${angled(b, d)}$. By linearity, $T${angled(p, q)} = ${p}${angled(a, c)} + (${q})${angled(b, d)} = ${angled(x, y)}$.`,
            `由图得 $T(\\mathbf{e}_1) = ${angled(a, c)}$，$T(\\mathbf{e}_2) = ${angled(b, d)}$。由线性性，$T${angled(p, q)} = ${p}${angled(a, c)} + (${q})${angled(b, d)} = ${angled(x, y)}$。`,
          ),
        ),
        [
          [
            wrongImages[0]!.en,
            "This combines the coordinates of the arrows across instead of along each arrow; take $p$ times the whole arrow $T(\\mathbf{e}_1)$.",
            "这是把箭头的坐标交叉组合了；应取整个箭头 $T(\\mathbf{e}_1)$ 的 $p$ 倍。",
          ],
          [
            wrongImages[1]!.en,
            "The input's coordinates multiply the arrows; they are not added to them.",
            "输入的坐标是乘以箭头，而不是加到箭头上。",
          ],
          [
            wrongImages[2]!.en,
            "The weights are swapped: $p$ goes with $T(\\mathbf{e}_1)$ and $q$ with $T(\\mathbf{e}_2)$.",
            "权重交换了：$p$ 配 $T(\\mathbf{e}_1)$，$q$ 配 $T(\\mathbf{e}_2)$。",
          ],
        ],
      ),
      drawn(
        square(reach([a, c], [b, d])),
        [...labelledArrow([a, c], "T(e₁)", true), ...labelledArrow([b, d], "T(e₂)", true)],
        t(
          `Two arrows from the origin: T(e₁) to (${a}, ${c}) and T(e₂) to (${b}, ${d}).`,
          `从原点出发的两个箭头：T(e₁) 指向 (${a}, ${c})，T(e₂) 指向 (${b}, ${d})。`,
        ),
      ),
    );
  },
};

/** areaFromDeterminant asks for the area of a drawn parallelogram through a determinant. */
const areaFromDeterminant: KnowledgePointDef = {
  id: "the-area-of-a-parallelogram-from-a-determinant",
  figure: linearAlgebraDrawings1["basic-properties-of-determinants#the-area-of-a-parallelogram-from-a-determinant"],
  title: t("The area of a parallelogram from a determinant", "用行列式求平行四边形的面积"),
  explanation: t(
    "A linear map scales every area by the absolute value of its determinant. The unit square has area $1$, so the parallelogram spanned by the columns of $A$ has area $|\\det A|$. The sign of the determinant says whether the map keeps or flips orientation, and it does not change the area, which is why the absolute value appears.\n\n> **Watch out.** Read the sides as columns: the image of $(1, 0)$ is the first column and the image of $(0, 1)$ the second. Then take $ad - bc$, with a minus sign, not $ad + bc$.",
    "线性映射把每个面积都乘以行列式的绝对值。单位正方形的面积是 $1$，所以由 $A$ 的各列张成的平行四边形面积是 $|\\det A|$。行列式的符号说明映射是否翻转定向，它不改变面积，这就是要取绝对值的原因。\n\n> **注意。** 边要按列读：$(1, 0)$ 的像是第一列，$(0, 1)$ 的像是第二列。然后算 $ad - bc$，中间是减号，不是 $ad + bc$。",
  ),
  generate(rng: Rng): Problem {
    const [a, b, c, d] = invertibleEntries(rng);
    const det = a * d - b * c;
    /** p writes a negative number in parentheses, for use inside a product. */
    const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    const shoelace = `\\frac{1}{2}\\left|${p(a)} \\cdot ${p(c + d)} - ${p(a + b)} \\cdot ${p(c)} + ${p(a + b)} \\cdot ${p(d)} - ${p(b)} \\cdot ${p(c + d)}\\right| = \\frac{1}{2} \\cdot ${2 * Math.abs(det)} = ${Math.abs(det)}`;
    return withFigure(
      numberProblem({
        prompt: t(
          "The drawing shows the image of the unit square under a linear map. Find the area of the shaded parallelogram.",
          "图中是单位正方形在线性映射下的像。求阴影平行四边形的面积。",
        ),
        answer: Math.abs(det),
        wrong: [a * d + b * c, Math.abs(a * b) + Math.abs(c * d), (Math.abs(a) + Math.abs(c)) * (Math.abs(b) + Math.abs(d))],
        solution: t(
          `**Step 1: Read the matrix.** The sides from the origin are the images of $(1, 0)$ and $(0, 1)$, read from the drawing as $(${a}, ${c})$ and $(${b}, ${d})$. They are the columns, so the matrix is $${matrix(a, b, c, d)}$.\n\n**Step 2: Take the determinant.** Its determinant is $${p(a)} \\cdot ${p(d)} - ${p(b)} \\cdot ${p(c)} = ${det}$. The area is the absolute value, $|${det}| = ${Math.abs(det)}$.\n\n**Check.** The corners are $(0, 0)$, $(${a}, ${c})$, $(${a + b}, ${c + d})$ and $(${b}, ${d})$. The shoelace formula gives the area as $${shoelace}$.`,
          `**第一步：读出矩阵。**从原点出发的两条边是 $(1, 0)$ 和 $(0, 1)$ 的像，从图上读出为 $(${a}, ${c})$ 和 $(${b}, ${d})$。它们就是两列，所以矩阵为 $${matrix(a, b, c, d)}$。\n\n**第二步：求行列式。**其行列式是 $${p(a)} \\cdot ${p(d)} - ${p(b)} \\cdot ${p(c)} = ${det}$。面积取绝对值，$|${det}| = ${Math.abs(det)}$。\n\n**检验。**四个顶点是 $(0, 0)$，$(${a}, ${c})$，$(${a + b}, ${c + d})$，$(${b}, ${d})$。由鞋带公式，面积是 $${shoelace}$。`,
        ),
      }),
      imageOfUnitSquare(a, b, c, d),
    );
  },
};

/** projectionFromDrawing asks for the projection of one drawn vector onto another. */
const projectionFromDrawing: KnowledgePointDef = {
  id: "a-projection-from-a-drawing",
  figure: linearAlgebraDrawings2["projecting-vectors-onto-one-dimensional-subspaces#a-projection-from-a-drawing"],
  title: t("A projection from a drawing", "由图求投影"),
  explanation: t(
    "The projection of $\\mathbf{v}$ onto $\\mathbf{u}$ is the shadow of $\\mathbf{v}$ on the line through $\\mathbf{u}$. It is the multiple $\\frac{\\mathbf{v} \\cdot \\mathbf{u}}{\\mathbf{u} \\cdot \\mathbf{u}}\\mathbf{u}$, chosen so that what remains of $\\mathbf{v}$ is perpendicular to $\\mathbf{u}$. The order matters: projecting $\\mathbf{u}$ onto $\\mathbf{v}$ gives a vector along $\\mathbf{v}$ instead.\n\nFor $\\mathbf{u} = \\langle 2, 0 \\rangle$ and $\\mathbf{v} = \\langle 3, 2 \\rangle$: $\\mathbf{v} \\cdot \\mathbf{u} = 6$ and $\\mathbf{u} \\cdot \\mathbf{u} = 4$, so the projection is $\\frac{3}{2}\\langle 2, 0 \\rangle = \\langle 3, 0 \\rangle$. Check: $\\mathbf{u}$ lies on the $x$-axis, and the point of that axis straight below the tip $(3, 2)$ is $(3, 0)$.\n\n> **Watch out.** Divide by $\\mathbf{u} \\cdot \\mathbf{u}$, the squared length of the vector projected onto. Leaving out that division gives a vector along $\\mathbf{u}$ of the wrong length.",
    "$\\mathbf{v}$ 在 $\\mathbf{u}$ 上的投影是 $\\mathbf{v}$ 落在过 $\\mathbf{u}$ 的直线上的影子。它是倍数 $\\frac{\\mathbf{v} \\cdot \\mathbf{u}}{\\mathbf{u} \\cdot \\mathbf{u}}\\mathbf{u}$，这样选取后 $\\mathbf{v}$ 的剩余部分与 $\\mathbf{u}$ 垂直。顺序很重要：把 $\\mathbf{u}$ 投影到 $\\mathbf{v}$ 上得到的是沿 $\\mathbf{v}$ 的向量。\n\n对 $\\mathbf{u} = \\langle 2, 0 \\rangle$ 和 $\\mathbf{v} = \\langle 3, 2 \\rangle$：$\\mathbf{v} \\cdot \\mathbf{u} = 6$，$\\mathbf{u} \\cdot \\mathbf{u} = 4$，所以投影是 $\\frac{3}{2}\\langle 2, 0 \\rangle = \\langle 3, 0 \\rangle$。检验：$\\mathbf{u}$ 在 $x$ 轴上，而终点 $(3, 2)$ 正下方的轴上的点是 $(3, 0)$。\n\n> **注意。** 要除以 $\\mathbf{u} \\cdot \\mathbf{u}$，即被投影到的向量长度的平方。漏掉这一步除法，得到的向量虽然沿 $\\mathbf{u}$，长度却不对。",
  ),
  generate(rng: Rng): Problem {
    const u: Point = rng.pick<Point>([
      [2, 0],
      [0, 2],
      [1, 1],
      [2, 1],
      [1, 2],
      [1, -1],
      [2, -1],
      [-1, 2],
      [3, 1],
      [1, 3],
    ]);
    let v: Point;
    do v = [rng.int(-4, 4), rng.int(-4, 4)];
    while (v[0] * u[1] - v[1] * u[0] === 0 || v[0] * u[0] + v[1] * u[1] === 0);
    const dot = v[0] * u[0] + v[1] * u[1];
    const uu = u[0] * u[0] + u[1] * u[1];
    const vv = v[0] * v[0] + v[1] * v[1];
    const right = angled(frac(dot * u[0], uu), frac(dot * u[1], uu));
    const ontoV = angled(frac(dot * v[0], vv), frac(dot * v[1], vv));
    const rest = angled(frac(v[0] * uu - dot * u[0], uu), frac(v[1] * uu - dot * u[1], uu));
    const unscaled = angled(dot * u[0], dot * u[1]);
    const factor = frac(dot, uu);
    const times = factor === "1" ? "" : factor === "-1" ? "-" : factor;
    /** p writes a number in parentheses when it is negative or a fraction, for use inside a product. */
    const p = (n: number, d = 1) => {
      const q = Q.of(n, d);
      return q.isInteger() && q.toNumber() >= 0 ? q.toLatex() : `\\left(${q.toLatex()}\\right)`;
    };
    const restDot = `${p(v[0] * uu - dot * u[0], uu)} \\cdot ${p(u[0])} + ${p(v[1] * uu - dot * u[1], uu)} \\cdot ${p(u[1])} = 0`;
    return withFigure(
      reasoned(
        pickChoice(
          rng,
          t(
            "The drawing shows the vectors $\\mathbf{u}$ and $\\mathbf{v}$. Find the projection of $\\mathbf{v}$ onto $\\mathbf{u}$.",
            "图中是向量 $\\mathbf{u}$ 和 $\\mathbf{v}$。求 $\\mathbf{v}$ 在 $\\mathbf{u}$ 上的投影。",
          ),
          math(right),
          [math(ontoV), math(rest), math(unscaled)],
          t(
            `**Step 1: Read the vectors.** From the drawing, $\\mathbf{u} = ${angled(u[0], u[1])}$ and $\\mathbf{v} = ${angled(v[0], v[1])}$.\n\n**Step 2: Find the two dot products.**\n\n$$\\mathbf{v} \\cdot \\mathbf{u} = ${p(v[0])} \\cdot ${p(u[0])} + ${p(v[1])} \\cdot ${p(u[1])} = ${dot}$$\n\n$$\\mathbf{u} \\cdot \\mathbf{u} = ${uu}$$\n\n**Step 3: Scale u.** The factor is $${frac(dot, 1)} \\div ${uu} = ${factor}$, so the projection is\n\n$$${times}\\mathbf{u} = ${right}$$\n\n**Check.** What is left of $\\mathbf{v}$ must be perpendicular to $\\mathbf{u}$. Here $\\mathbf{v}$ minus the projection is $${rest}$, and\n\n$$${restDot}$$`,
            `**第一步：读出向量。**由图，$\\mathbf{u} = ${angled(u[0], u[1])}$，$\\mathbf{v} = ${angled(v[0], v[1])}$。\n\n**第二步：求两个点积。**\n\n$$\\mathbf{v} \\cdot \\mathbf{u} = ${p(v[0])} \\cdot ${p(u[0])} + ${p(v[1])} \\cdot ${p(u[1])} = ${dot}$$\n\n$$\\mathbf{u} \\cdot \\mathbf{u} = ${uu}$$\n\n**第三步：把 u 乘以系数。**系数是 $${frac(dot, 1)} \\div ${uu} = ${factor}$，所以投影是\n\n$$${times}\\mathbf{u} = ${right}$$\n\n**检验。**$\\mathbf{v}$ 剩下的部分必须与 $\\mathbf{u}$ 垂直。这里 $\\mathbf{v}$ 减去投影是 $${rest}$，而\n\n$$${restDot}$$`,
          ),
        ),
        [
          [
            `$${ontoV}$`,
            "This is the projection of $\\mathbf{u}$ onto $\\mathbf{v}$: it lies along $\\mathbf{v}$, not along $\\mathbf{u}$.",
            "这是 $\\mathbf{u}$ 在 $\\mathbf{v}$ 上的投影：它沿 $\\mathbf{v}$，而不是沿 $\\mathbf{u}$。",
          ],
          [
            `$${rest}$`,
            "This is what is left of $\\mathbf{v}$ after the projection, the part perpendicular to $\\mathbf{u}$.",
            "这是 $\\mathbf{v}$ 去掉投影后剩下的部分，即与 $\\mathbf{u}$ 垂直的部分。",
          ],
          [
            `$${unscaled}$`,
            `This multiplies $\\mathbf{u}$ by $\\mathbf{v} \\cdot \\mathbf{u} = ${dot}$ without dividing by $\\mathbf{u} \\cdot \\mathbf{u} = ${uu}$.`,
            `这里用 $\\mathbf{v} \\cdot \\mathbf{u} = ${dot}$ 乘 $\\mathbf{u}$，却没有除以 $\\mathbf{u} \\cdot \\mathbf{u} = ${uu}$。`,
          ],
        ],
      ),
      drawn(
        square(reach(u, v)),
        [...labelledArrow(u, "u", true), ...labelledArrow(v, "v")],
        t(
          `Two arrows from the origin: u to (${u[0]}, ${u[1]}) and v to (${v[0]}, ${v[1]}).`,
          `从原点出发的两个箭头：u 指向 (${u[0]}, ${u[1]})，v 指向 (${v[0]}, ${v[1]})。`,
        ),
      ),
    );
  },
};

/** dotSignFromDrawing asks for the sign of a dot product of two drawn vectors. */
const dotSignFromDrawing: KnowledgePointDef = {
  id: "the-sign-of-a-dot-product-from-a-drawing",
  figure: linearAlgebraDrawings2["cauchy-schwarz-inequality-and-angle-between-two-vectors#the-sign-of-a-dot-product-from-a-drawing"],
  title: t("The sign of a dot product from a drawing", "由图判断点积的符号"),
  explanation: t(
    "Since $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos \\theta$ and the norms are positive, the sign of the dot product is the sign of $\\cos \\theta$. An acute angle gives a positive dot product, an obtuse angle gives a negative one, and a right angle gives zero. A drawing therefore shows the sign without any arithmetic, though near a right angle the coordinates settle it.\n\nFor $\\mathbf{u} = \\langle 3, 1 \\rangle$ and $\\mathbf{v} = \\langle -1, 2 \\rangle$ the arrows look almost perpendicular, and the coordinates decide: $-3 + 2 = -1$, so the dot product is negative. Check: the cosine of the angle is $\\frac{-1}{\\sqrt{10}\\sqrt{5}}$, about $-0.14$, which is an angle of about $98.1^{\\circ}$, just past a right angle.\n\n> **Watch out.** The sign depends on the angle between the two arrows drawn from the same point, not on the quadrants they point into: $\\langle -2, -1 \\rangle$ and $\\langle -1, -3 \\rangle$ both point down and left, and their dot product is $5$, positive.",
    "因为 $\\mathbf{u} \\cdot \\mathbf{v} = \\|\\mathbf{u}\\| \\|\\mathbf{v}\\| \\cos \\theta$ 且范数为正，点积的符号就是 $\\cos \\theta$ 的符号。锐角对应正的点积，钝角对应负的点积，直角对应零。所以图形不经计算就能显示符号；接近直角时则要靠坐标来确定。\n\n对 $\\mathbf{u} = \\langle 3, 1 \\rangle$ 和 $\\mathbf{v} = \\langle -1, 2 \\rangle$，两个箭头看上去几乎垂直，要由坐标决定：$-3 + 2 = -1$，所以点积为负。检验：夹角的余弦是 $\\frac{-1}{\\sqrt{10}\\sqrt{5}}$，约为 $-0.14$，夹角约 $98.1^{\\circ}$，刚好超过直角。\n\n> **注意。** 符号取决于从同一点画出的两个箭头之间的夹角，而不是它们指向哪个象限：$\\langle -2, -1 \\rangle$ 和 $\\langle -1, -3 \\rangle$ 都指向左下方，它们的点积是 $5$，为正。",
  ),
  generate(rng: Rng): Problem {
    const wanted = rng.int(-1, 1);
    let u: Point;
    let v: Point;
    do {
      u = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
      if (wanted === 0) {
        const k = rng.pick([1, -1]);
        v = [-u[1] * k, u[0] * k];
      } else v = [rng.nonZero(-4, 4), rng.nonZero(-4, 4)];
    } while (Math.sign(u[0] * v[0] + u[1] * v[1]) !== wanted || u[0] * v[1] === u[1] * v[0]);
    const dot = u[0] * v[0] + u[1] * v[1];
    const [right, wrong] = signWords(dot);
    const angle = dot > 0 ? t("acute", "锐角") : dot < 0 ? t("obtuse", "钝角") : t("a right angle", "直角");
    const cos = dot / Math.sqrt((u[0] * u[0] + u[1] * u[1]) * (v[0] * v[0] + v[1] * v[1]));
    const degrees = ((Math.acos(cos) * 180) / Math.PI).toFixed(1);
    const check =
      dot === 0
        ? t(
            `**Check.** Turning $\\mathbf{u}$ a quarter turn swaps its components and changes one sign, which gives $${angled(v[0], v[1])}$, so the angle is exactly $90^{\\circ}$.`,
            `**检验。**把 $\\mathbf{u}$ 转四分之一圈，就是交换两个分量并改变一个符号，得到 $${angled(v[0], v[1])}$，所以夹角恰好是 $90^{\\circ}$。`,
          )
        : t(
            `**Check.** The cosine of the angle is $\\frac{${dot}}{\\sqrt{${u[0] * u[0] + u[1] * u[1]}}\\sqrt{${v[0] * v[0] + v[1] * v[1]}}}$, which gives an angle of about $${degrees}^{\\circ}$. That is ${angle.en}, as the drawing shows.`,
            `**检验。**夹角的余弦是 $\\frac{${dot}}{\\sqrt{${u[0] * u[0] + u[1] * u[1]}}\\sqrt{${v[0] * v[0] + v[1] * v[1]}}}$，夹角约为 $${degrees}^{\\circ}$，是${angle["zh-CN"]}，与图一致。`,
          );
    /** because explains why a wrong sign would need a different angle. */
    const because = (option: Text): [string, string, string] =>
      option.en === "Positive"
        ? [
            option.en,
            `A positive dot product needs an acute angle, but here the dot product is $${dot}$.`,
            `点积为正需要锐角，但这里点积是 $${dot}$。`,
          ]
        : option.en === "Negative"
          ? [
              option.en,
              `A negative dot product needs an obtuse angle, but here the dot product is $${dot}$.`,
              `点积为负需要钝角，但这里点积是 $${dot}$。`,
            ]
          : [
              option.en,
              `Zero needs a right angle exactly, but here the dot product is $${dot}$.`,
              `点积为零需要恰好是直角，但这里点积是 $${dot}$。`,
            ];
    return withFigure(
      reasoned(
        pickChoice(
          rng,
          t(
            "What is the sign of $\\mathbf{u} \\cdot \\mathbf{v}$ for the vectors drawn?",
            "对图中的向量，$\\mathbf{u} \\cdot \\mathbf{v}$ 的符号是什么？",
          ),
          right,
          wrong,
          t(
            `**Step 1: Read the vectors.** From the drawing, $\\mathbf{u} = ${angled(u[0], u[1])}$ and $\\mathbf{v} = ${angled(v[0], v[1])}$.\n\n**Step 2: Find the dot product.** Multiply matching components and add:\n\n$$(${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${dot}$$\n\nSo the dot product is ${right.en.toLowerCase()}, and the angle between the arrows is ${angle.en}.\n\n${check.en}`,
            `**第一步：读出向量。**由图，$\\mathbf{u} = ${angled(u[0], u[1])}$，$\\mathbf{v} = ${angled(v[0], v[1])}$。\n\n**第二步：求点积。**对应分量相乘再相加：\n\n$$(${u[0]})(${v[0]}) + (${u[1]})(${v[1]}) = ${dot}$$\n\n所以点积为${right["zh-CN"]}，两箭头的夹角是${angle["zh-CN"]}。\n\n${check["zh-CN"]}`,
          ),
        ),
        wrong.map(because),
      ),
      drawn(
        square(reach(u, v)),
        [...labelledArrow(u, "u", true), ...labelledArrow(v, "v")],
        t(
          `Two arrows from the origin: u to (${u[0]}, ${u[1]}) and v to (${v[0]}, ${v[1]}).`,
          `从原点出发的两个箭头：u 指向 (${u[0]}, ${u[1]})，v 指向 (${v[0]}, ${v[1]})。`,
        ),
      ),
    );
  },
};

/** eigenvectorFromDrawing asks whether a drawn vector is an eigenvector and for its eigenvalue. */
const eigenvectorFromDrawing: KnowledgePointDef = {
  id: "eigenvectors-in-a-drawing",
  title: t("Eigenvectors in a drawing", "图中的特征向量"),
  explanation: t(
    "A nonzero vector $\\mathbf{v}$ is an eigenvector of $A$ when $A\\mathbf{v}$ lies on the same line through the origin. The eigenvalue is the stretch factor, negative when the arrow reverses. If $A\\mathbf{v}$ leaves the line, $\\mathbf{v}$ is not an eigenvector at all, however close the two directions look, so compare coordinates to be sure. For example, $\\mathbf{v} = \\langle 1, 2 \\rangle$ with $A\\mathbf{v} = \\langle -2, -4 \\rangle$ is an eigenvector with eigenvalue $-2$, while $A\\mathbf{v} = \\langle -2, -3 \\rangle$ would not be, since $1 \\cdot (-3) - 2 \\cdot (-2) = 1 \\ne 0$.\n\n> **Watch out.** An arrow that points the opposite way is still on the same line; it gives a negative eigenvalue, not a failure.",
    "非零向量 $\\mathbf{v}$ 是 $A$ 的特征向量，当且仅当 $A\\mathbf{v}$ 落在过原点的同一条直线上。特征值就是伸缩倍数，箭头反向时为负。如果 $A\\mathbf{v}$ 离开了这条直线，$\\mathbf{v}$ 就不是特征向量，无论两个方向看起来多接近，所以要比较坐标来确认。例如 $\\mathbf{v} = \\langle 1, 2 \\rangle$、$A\\mathbf{v} = \\langle -2, -4 \\rangle$ 时 $\\mathbf{v}$ 是特征向量，特征值为 $-2$；而若 $A\\mathbf{v} = \\langle -2, -3 \\rangle$ 则不是，因为 $1 \\cdot (-3) - 2 \\cdot (-2) = 1 \\ne 0$。\n\n> **注意。** 方向相反的箭头仍在同一条直线上；它给出负的特征值，而不是说明不是特征向量。",
  ),
  generate(rng: Rng): Problem {
    const v: Point = rng.pick<Point>([
      [1, 1],
      [1, 2],
      [2, 1],
      [1, -1],
      [-1, 2],
      [2, -1],
      [2, 2],
      [-2, 1],
      [2, 0],
      [0, 2],
      [-2, 2],
    ]);
    const factors = v[0] % 2 === 0 && v[1] % 2 === 0 ? [2, 3, -1, -2, 0.5, -0.5] : [2, 3, -1, -2, -3];
    const lambda = rng.pick(factors);
    const isEigen = rng.bool(0.75);
    let w: Point = [lambda * v[0], lambda * v[1]];
    if (!isEigen) {
      const shift = rng.pick<Point>([
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
        [1, -1],
        [-1, 1],
      ]);
      const moved: Point = [w[0] + shift[0], w[1] + shift[1]];
      w = moved[0] * v[1] === moved[1] * v[0] ? [w[0] + v[1], w[1] - v[0]] : moved;
    }
    const not = t("$\\mathbf{v}$ is not an eigenvector", "$\\mathbf{v}$ 不是特征向量");
    const value = (x: number) => t(`The eigenvalue is $${frac(x * 2, 2)}$`, `特征值是 $${frac(x * 2, 2)}$`);
    const others = [lambda === -1 ? 1 : -lambda, lambda + 1, lambda - 1].filter((x) => x !== lambda && x !== 0);
    const wrongOptions = isEigen ? [not, ...others.map(value)] : [value(lambda), value(-lambda), value(lambda + 1)];
    const cross = v[0] * w[1] - v[1] * w[0];
    const i = v[0] !== 0 ? 0 : 1;
    const j = i === 0 ? 1 : 0;
    const ratio = Q.of(w[i], v[i]);
    const read: [[string, string], Text, string[]] = [
      ["Read the arrows", "读出箭头"],
      t("", ""),
      [`\\mathbf{v} = ${angled(v[0], v[1])}, \\quad A\\mathbf{v} = ${angled(w[0], w[1])}`],
    ];
    const solution = isEigen
      ? walked(
          [
            read,
            [
              ["Compare the coordinates", "比较坐标"],
              t(
                `Each coordinate of $A\\mathbf{v}$ is $${frac(lambda * 2, 2)}$ times that of $\\mathbf{v}$:`,
                `$A\\mathbf{v}$ 的每个坐标都是 $\\mathbf{v}$ 的 $${frac(lambda * 2, 2)}$ 倍：`,
              ),
              [`A\\mathbf{v} = ${frac(lambda * 2, 2)}${angled(v[0], v[1])}`, `\\lambda = ${frac(lambda * 2, 2)}`],
            ],
          ],
          t(
            `The cross product $(${v[0]})(${w[1]}) - (${v[1]})(${w[0]}) = 0$, so the two arrows lie on one line through the origin.`,
            `叉积 $(${v[0]})(${w[1]}) - (${v[1]})(${w[0]}) = 0$，所以两个箭头在过原点的同一条直线上。`,
          ),
        )
      : walked(
          [
            read,
            [["Test whether they are parallel", "检验是否平行"], t("", ""), [`(${v[0]})(${w[1]}) - (${v[1]})(${w[0]}) = ${cross} \\ne 0`]],
          ],
          t(
            `Coordinate ${i + 1} would give the factor $${ratio.toLatex()}$, but then coordinate ${j + 1} would be $${ratio.mul(Q.of(v[j])).toLatex()}$, not $${w[j]}$. So $\\mathbf{v}$ is not an eigenvector.`,
            `由第 ${i + 1} 个坐标得倍数 $${ratio.toLatex()}$，但这样第 ${j + 1} 个坐标应为 $${ratio.mul(Q.of(v[j])).toLatex()}$，而不是 $${w[j]}$。所以 $\\mathbf{v}$ 不是特征向量。`,
          ),
        );
    return withFigure(
      reasoned(
        pickChoice(
          rng,
          t(
            "The drawing shows a vector $\\mathbf{v}$ and its image $A\\mathbf{v}$ under a matrix $A$. What can you conclude?",
            "图中是向量 $\\mathbf{v}$ 及其在矩阵 $A$ 下的像 $A\\mathbf{v}$。能得出什么结论？",
          ),
          isEigen ? value(lambda) : not,
          wrongOptions,
          solution,
        ),
        isEigen
          ? [
              [
                not.en,
                `$A\\mathbf{v}$ is exactly $${frac(lambda * 2, 2)}$ times $\\mathbf{v}$, so the two arrows lie on one line through the origin.`,
                `$A\\mathbf{v}$ 恰好是 $\\mathbf{v}$ 的 $${frac(lambda * 2, 2)}$ 倍，所以两个箭头在过原点的同一条直线上。`,
              ],
              ...others.map(
                (x) =>
                  [
                    value(x).en,
                    `Divide a coordinate of $A\\mathbf{v}$ by the matching coordinate of $\\mathbf{v}$: the factor is $${frac(lambda * 2, 2)}$, not $${frac(x * 2, 2)}$.`,
                    `用 $A\\mathbf{v}$ 的一个坐标除以 $\\mathbf{v}$ 的对应坐标：倍数是 $${frac(lambda * 2, 2)}$，而不是 $${frac(x * 2, 2)}$。`,
                  ] as const,
              ),
            ]
          : wrongOptions.map(
              (o) =>
                [
                  o.en,
                  `$A\\mathbf{v}$ is not a multiple of $\\mathbf{v}$: the cross product is $${cross} \\ne 0$, so there is no eigenvalue to read.`,
                  `$A\\mathbf{v}$ 不是 $\\mathbf{v}$ 的倍数：叉积为 $${cross} \\ne 0$，所以读不出特征值。`,
                ] as const,
            ),
      ),
      drawn(
        square(reach(v, w)),
        [...labelledArrow(w, "Av"), ...labelledArrow(v, "v", true)],
        t(
          `Two arrows from the origin: v to (${v[0]}, ${v[1]}) and Av to (${w[0]}, ${w[1]}).`,
          `从原点出发的两个箭头：v 指向 (${v[0]}, ${v[1]})，Av 指向 (${w[0]}, ${w[1]})。`,
        ),
      ),
    );
  },
};

/** combinationFromDrawing asks how a drawn vector is a combination of two others. */
const combinationFromDrawing: KnowledgePointDef = {
  id: "a-linear-combination-from-a-drawing",
  title: t("A linear combination from a drawing", "由图求线性组合"),
  explanation: t(
    "Two vectors that do not lie on one line reach every point of the plane through their combinations $a\\mathbf{u} + b\\mathbf{v}$. To find the weights of a drawn vector $\\mathbf{w}$, read the coordinates of all three and solve the two equations they give, or check each candidate by adding its components.\n\nFor $\\mathbf{u} = \\langle 1, 0 \\rangle$, $\\mathbf{v} = \\langle 1, 2 \\rangle$ and $\\mathbf{w} = \\langle 3, 4 \\rangle$: the $y$-components give $2b = 4$, so $b = 2$, and the $x$-components give $a + 2 = 3$, so $a = 1$ and $\\mathbf{w} = \\mathbf{u} + 2\\mathbf{v}$. Check: $\\langle 1, 0 \\rangle + 2\\langle 1, 2 \\rangle = \\langle 3, 4 \\rangle$.\n\n> **Watch out.** Each weight belongs to its own vector. Here $2\\mathbf{u} + \\mathbf{v} = \\langle 3, 2 \\rangle$ is a different vector, so the weights cannot be swapped.",
    "不共线的两个向量通过组合 $a\\mathbf{u} + b\\mathbf{v}$ 可以到达平面上的每一点。要求图中向量 $\\mathbf{w}$ 的权重，读出三个向量的坐标并解由此得到的两个方程，或者把每个候选的分量相加来检验。\n\n对 $\\mathbf{u} = \\langle 1, 0 \\rangle$，$\\mathbf{v} = \\langle 1, 2 \\rangle$，$\\mathbf{w} = \\langle 3, 4 \\rangle$：由 $y$ 分量得 $2b = 4$，所以 $b = 2$；由 $x$ 分量得 $a + 2 = 3$，所以 $a = 1$，$\\mathbf{w} = \\mathbf{u} + 2\\mathbf{v}$。检验：$\\langle 1, 0 \\rangle + 2\\langle 1, 2 \\rangle = \\langle 3, 4 \\rangle$。\n\n> **注意。** 每个权重属于它自己的向量。这里 $2\\mathbf{u} + \\mathbf{v} = \\langle 3, 2 \\rangle$ 是另一个向量，所以权重不能对调。",
  ),
  generate(rng: Rng): Problem {
    const u: Point = rng.pick<Point>([
      [1, 0],
      [2, 1],
      [1, 1],
      [1, -1],
      [1, 2],
      [0, 1],
      [-1, 1],
    ]);
    let v: Point;
    do
      v = rng.pick<Point>([
        [0, 1],
        [1, 2],
        [-1, 1],
        [1, 1],
        [2, -1],
        [1, 0],
        [-1, 2],
      ]);
    while (u[0] * v[1] === u[1] * v[0]);
    const a = rng.pick([-2, -1, 2, 3]);
    let b: number;
    do b = rng.pick([-2, -1, 1, 2, 3]);
    while (Math.abs(a) === Math.abs(b));
    const w: Point = [a * u[0] + b * v[0], a * u[1] + b * v[1]];
    const form = (x: number, y: number) => math(`\\mathbf{w} = ${poly([x, "\\mathbf{u}"], [y, "\\mathbf{v}"])}`);
    /** p writes a negative number in parentheses, for use inside a product. */
    const p = (n: number) => (n < 0 ? `(${n})` : `${n}`);
    /** sum writes x u + y v in components. */
    const sum = (x: number, y: number) => angled(x * u[0] + y * v[0], x * u[1] + y * v[1]);
    const cross = u[0] * v[1] - u[1] * v[0];
    return withFigure(
      reasoned(
        pickChoice(
          rng,
          t("Which equation holds for the vectors drawn?", "对图中的向量，哪个等式成立？"),
          form(a, b),
          [form(b, a), form(-a, b), form(a, -b)],
          t(
            `**Step 1: Read the vectors.** From the drawing, $\\mathbf{u} = ${angled(u[0], u[1])}$, $\\mathbf{v} = ${angled(v[0], v[1])}$ and $\\mathbf{w} = ${angled(w[0], w[1])}$.\n\n**Step 2: Combine with the weights.** Scale each vector by its weight and add:\n\n$$${a}${angled(u[0], u[1])} + ${p(b)}${angled(v[0], v[1])} = ${angled(a * u[0], a * u[1])} + ${angled(b * v[0], b * v[1])} = ${angled(w[0], w[1])}$$\n\nThis is $\\mathbf{w}$, so $${poly([a, "\\mathbf{u}"], [b, "\\mathbf{v}"])}$ is the combination.\n\n**Check.** $\\mathbf{u}$ and $\\mathbf{v}$ are not parallel, as $${p(u[0])} \\cdot ${p(v[1])} - ${p(u[1])} \\cdot ${p(v[0])} = ${cross}$ is not $0$, so these weights are the only ones that give $\\mathbf{w}$.`,
            `**第一步：读出向量。**由图，$\\mathbf{u} = ${angled(u[0], u[1])}$，$\\mathbf{v} = ${angled(v[0], v[1])}$，$\\mathbf{w} = ${angled(w[0], w[1])}$。\n\n**第二步：按权重组合。**每个向量乘它的权重再相加：\n\n$$${a}${angled(u[0], u[1])} + ${p(b)}${angled(v[0], v[1])} = ${angled(a * u[0], a * u[1])} + ${angled(b * v[0], b * v[1])} = ${angled(w[0], w[1])}$$\n\n这正是 $\\mathbf{w}$，所以组合是 $${poly([a, "\\mathbf{u}"], [b, "\\mathbf{v}"])}$。\n\n**检验。**$\\mathbf{u}$ 与 $\\mathbf{v}$ 不平行，因为 $${p(u[0])} \\cdot ${p(v[1])} - ${p(u[1])} \\cdot ${p(v[0])} = ${cross}$ 不为 $0$，所以只有这组权重能得到 $\\mathbf{w}$。`,
          ),
        ),
        [
          [
            form(b, a).en,
            `The weights are swapped: this combination is $${sum(b, a)}$, not $\\mathbf{w}$.`,
            `权重对调了：这个组合是 $${sum(b, a)}$，不是 $\\mathbf{w}$。`,
          ],
          [
            form(-a, b).en,
            `The weight of $\\mathbf{u}$ has the wrong sign: this combination is $${sum(-a, b)}$.`,
            `$\\mathbf{u}$ 的权重符号错了：这个组合是 $${sum(-a, b)}$。`,
          ],
          [
            form(a, -b).en,
            `The weight of $\\mathbf{v}$ has the wrong sign: this combination is $${sum(a, -b)}$.`,
            `$\\mathbf{v}$ 的权重符号错了：这个组合是 $${sum(a, -b)}$。`,
          ],
        ],
      ),
      drawn(
        square(reach(u, v, w)),
        [...labelledArrow(w, "w", true), ...labelledArrow(u, "u"), ...labelledArrow(v, "v")],
        t(
          `Three arrows from the origin: u to (${u[0]}, ${u[1]}), v to (${v[0]}, ${v[1]}) and w to (${w[0]}, ${w[1]}).`,
          `从原点出发的三个箭头：u 指向 (${u[0]}, ${u[1]})，v 指向 (${v[0]}, ${v[1]})，w 指向 (${w[0]}, ${w[1]})。`,
        ),
      ),
    );
  },
};

/** lineFromDrawing asks for a vector equation of a drawn line through two marked points. */
const lineFromDrawing: KnowledgePointDef = {
  id: "the-equation-of-a-drawn-line",
  title: t("The equation of a drawn line", "由图写直线的方程"),
  explanation: t(
    "A vector equation $\\mathbf{r} = \\mathbf{a} + t\\mathbf{d}$ needs a point on the line and a direction along it. Two marked points $P$ and $Q$ give both: take $\\mathbf{a} = P$ and $\\mathbf{d} = Q - P$. The direction is a difference of the two points, not their sum, and the point has to be a position on the line, not the direction itself. Through $P(1, 2)$ and $Q(3, 3)$: $Q - P = \\langle 2, 1 \\rangle$, so $\\mathbf{r} = \\langle 1, 2 \\rangle + t\\langle 2, 1 \\rangle$.\n\n> **Watch out.** The direction is the difference $Q - P$, not the point $Q$ itself, and the vector standing alone must be a point of the line. Swapping the two gives a line through the wrong place.",
    "向量方程 $\\mathbf{r} = \\mathbf{a} + t\\mathbf{d}$ 需要直线上的一点和沿直线的方向。标出的两点 $P$、$Q$ 同时给出这两者：取 $\\mathbf{a} = P$，$\\mathbf{d} = Q - P$。方向是两点之差而不是和，而且起点必须是直线上的位置，而不是方向本身。过 $P(1, 2)$ 和 $Q(3, 3)$：$Q - P = \\langle 2, 1 \\rangle$，所以 $\\mathbf{r} = \\langle 1, 2 \\rangle + t\\langle 2, 1 \\rangle$。\n\n> **注意。** 方向是差 $Q - P$，而不是点 $Q$ 本身；单独写的那个向量必须是直线上的点。两者交换，直线就经过了错误的位置。",
  ),
  generate(rng: Rng): Problem {
    let P: Point;
    let d: Point;
    do {
      P = [rng.int(-3, 3), rng.int(-3, 3)];
      d = [rng.int(-3, 3), rng.int(-3, 3)];
    } while (P[0] * d[1] === P[1] * d[0] || Math.abs(P[0] + d[0]) > 4 || Math.abs(P[1] + d[1]) > 4);
    const Q: Point = [P[0] + d[0], P[1] + d[1]];
    const line = (a: Point, b: Point) => math(`\\mathbf{r} = ${angled(a[0], a[1])} + t${angled(b[0], b[1])}`);
    return withFigure(
      reasoned(
        pickChoice(
          rng,
          t("Which vector equation describes the line through the marked points?", "哪个向量方程描述了过标出两点的直线？"),
          line(P, d),
          [line(d, P), line(P, [-d[1], d[0]]), line(P, Q)],
          t(
            `**Step 1: Read the points.** $P = (${P[0]}, ${P[1]})$ and $Q = (${Q[0]}, ${Q[1]})$.\n\n**Step 2: Form the equation.** The direction is $Q - P = ${angled(d[0], d[1])}$, and the line starts from the position $P$: $\\mathbf{r} = ${angled(P[0], P[1])} + t${angled(d[0], d[1])}$.\n\n**Check.** $t = 0$ gives $P$ and $t = 1$ gives $${angled(P[0], P[1])} + ${angled(d[0], d[1])} = ${angled(Q[0], Q[1])}$, which is $Q$.`,
            `**第一步：读出两点。** $P = (${P[0]}, ${P[1]})$，$Q = (${Q[0]}, ${Q[1]})$。\n\n**第二步：写出方程。** 方向是 $Q - P = ${angled(d[0], d[1])}$，直线从位置 $P$ 出发：$\\mathbf{r} = ${angled(P[0], P[1])} + t${angled(d[0], d[1])}$。\n\n**检验。** $t = 0$ 得 $P$，$t = 1$ 得 $${angled(P[0], P[1])} + ${angled(d[0], d[1])} = ${angled(Q[0], Q[1])}$，正是 $Q$。`,
          ),
        ),
        [
          [
            line(d, P).en,
            "The point and the direction are swapped: the vector standing alone must be a point of the line, here $P$.",
            "点和方向交换了：单独写的向量必须是直线上的点，这里是 $P$。",
          ],
          [
            line(P, [-d[1], d[0]]).en,
            "That direction is perpendicular to the line: its dot product with $Q - P$ is $0$.",
            "这个方向与直线垂直：它与 $Q - P$ 的点积是 $0$。",
          ],
          [
            line(P, Q).en,
            "That uses the point $Q$ as the direction; the direction is the difference $Q - P$.",
            "这把点 $Q$ 当作方向；方向应是差 $Q - P$。",
          ],
        ],
      ),
      drawn(
        square(5),
        [
          { kind: "line", a: P, b: Q, accent: true },
          { kind: "point", at: P, label: "P", dir: "nw" },
          { kind: "point", at: Q, label: "Q", dir: "nw" },
        ],
        t(
          `A line through the marked points P (${P[0]}, ${P[1]}) and Q (${Q[0]}, ${Q[1]}).`,
          `过标出的点 P (${P[0]}, ${P[1]}) 和 Q (${Q[0]}, ${Q[1]}) 的直线。`,
        ),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Differential equations and polar curves
// ---------------------------------------------------------------------------

/** decoupledPortrait asks for the type of a decoupled linear system from its plot. */
const decoupledPortrait: KnowledgePointDef = {
  id: "the-type-of-equilibrium-from-a-plot",
  title: t("The type of equilibrium from a plot", "从图判断平衡点的类型"),
  explanation: t(
    "For $x' = ax$, $y' = by$ the axes are invariant lines and the signs of $a$ and $b$ decide the picture. If arrows point toward the origin along both axes it is a stable node, away along both it is an unstable node, and in along one and out along the other it is a saddle. The plot drawn here has $a = -1$ and $b = 1$: a saddle.",
    "对 $x' = ax$，$y' = by$，两条坐标轴是不变直线，$a$、$b$ 的符号决定了图形。沿两条轴箭头都指向原点的是稳定结点，都背离原点的是不稳定结点，一条指向、一条背离的是鞍点。这里画出的图 $a = -1$，$b = 1$：是鞍点。",
  ),
  figure: quiver((x, y) => [-x, y]),
  generate(rng: Rng): Problem {
    const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
    const stable = t("A stable node", "稳定结点");
    const unstable = t("An unstable node", "不稳定结点");
    const saddle = t("A saddle", "鞍点");
    const center = t("A center", "中心");
    const right = a < 0 && b < 0 ? stable : a > 0 && b > 0 ? unstable : saddle;
    const words = (n: number) => (n < 0 ? t("toward the origin", "指向原点") : t("away from the origin", "背离原点"));
    return withFigure(
      pickChoice(
        rng,
        t(
          "The plot shows the direction field of $x' = ax$, $y' = by$ for nonzero constants $a$ and $b$. What kind of equilibrium is the origin?",
          "图中是 $x' = ax$，$y' = by$ 的方向场，其中 $a$、$b$ 是非零常数。原点是哪种平衡点？",
        ),
        right,
        [stable, unstable, saddle, center].filter((o) => o !== right),
        t(
          `Along the $x$-axis the arrows point ${words(a).en}, and along the $y$-axis they point ${words(b).en}. That pattern is ${right.en.toLowerCase()}.`,
          `沿 $x$ 轴箭头${words(a)["zh-CN"]}，沿 $y$ 轴箭头${words(b)["zh-CN"]}。这种形态是${right["zh-CN"]}。`,
        ),
      ),
      quiver((x, y) => [a * x, b * y]),
    );
  },
};

/** complexPortrait asks how a system with complex eigenvalues behaves, from a trajectory on its plot. */
const complexPortrait: KnowledgePointDef = {
  id: "reading-spirals-and-centers-from-a-plot",
  title: t("Reading spirals and centers from a plot", "从图读取螺旋与中心"),
  explanation: t(
    "A linear system with eigenvalues $\\alpha \\pm \\beta i$ turns around the origin. The real part sets the distance: $\\alpha > 0$ spirals out, $\\alpha < 0$ spirals in and $\\alpha = 0$ gives closed loops, a center. For $x' = \\alpha x - \\beta y$, $y' = \\beta x + \\alpha y$, a positive $\\beta$ turns counterclockwise. A plot shows both at once, once a trajectory is followed along its arrow.",
    "特征值为 $\\alpha \\pm \\beta i$ 的线性系统绕原点旋转。实部决定距离：$\\alpha > 0$ 向外螺旋，$\\alpha < 0$ 向内螺旋，$\\alpha = 0$ 给出闭合曲线，即中心。对 $x' = \\alpha x - \\beta y$，$y' = \\beta x + \\alpha y$，正的 $\\beta$ 表示逆时针旋转。沿箭头追踪一条轨线，就能从图上同时看出这两点。",
  ),
  generate(rng: Rng): Problem {
    const alpha = rng.pick([-0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2]);
    const beta = rng.pick([-3, -2, -1, 1, 2, 3]);
    const rate = alpha * Math.abs(beta);
    const scaleOfTime = (2.6 * Math.PI) / Math.abs(beta);
    const start = alpha > 0 ? rng.pick([0.4, 0.5, 0.6]) : rng.pick([2, 2.3, 2.6]);
    const path = Array.from({ length: 241 }, (_, i): Point => {
      const time = (scaleOfTime * i) / 240;
      const r = start * Math.exp(alpha * Math.abs(beta) * time);
      return [r * Math.cos(beta * time), r * Math.sin(beta * time)];
    });
    const spin = beta > 0 ? t("counterclockwise", "逆时针") : t("clockwise", "顺时针");
    const otherSpin = beta > 0 ? t("clockwise", "顺时针") : t("counterclockwise", "逆时针");
    const shape = (a: number, s: Text) =>
      a > 0
        ? t(`A spiral outward, ${s.en}`, `向外螺旋，${s["zh-CN"]}`)
        : a < 0
          ? t(`A spiral inward, ${s.en}`, `向内螺旋，${s["zh-CN"]}`)
          : t(`A center, ${s.en}`, `中心，${s["zh-CN"]}`);
    const right = shape(alpha, spin);
    const otherAlpha = alpha === 0 ? 1 : -alpha;
    const thirdAlpha = alpha === 0 ? -1 : 0;
    return withFigure(
      pickChoice(
        rng,
        t(
          "The plot shows the direction field of a linear system with complex eigenvalues and one trajectory in it. How do solutions behave?",
          "图中是一个具有复特征值的线性系统的方向场和其中一条轨线。解的行为如何？",
        ),
        right,
        [shape(alpha, otherSpin), shape(otherAlpha, spin), shape(thirdAlpha, spin)],
        t(
          `Following the arrows, the trajectory turns ${spin.en}. Its distance from the origin ${alpha > 0 ? "grows, so the real part of the eigenvalues is positive" : alpha < 0 ? "shrinks, so the real part of the eigenvalues is negative" : "stays the same, so the real part of the eigenvalues is zero"}.`,
          `沿箭头追踪，轨线${spin["zh-CN"]}旋转。它到原点的距离${alpha > 0 ? "增大，所以特征值的实部为正" : alpha < 0 ? "减小，所以特征值的实部为负" : "不变，所以特征值的实部为零"}。`,
        ),
      ),
      drawn(
        square(3),
        [...quiverMarks((x, y) => [rate * x - beta * y, beta * x + rate * y]), { kind: "path", points: path, accent: true }],
        t(
          `A direction field around the origin with one trajectory, which turns ${spin.en} and ${alpha > 0 ? "moves away from the origin" : alpha < 0 ? "moves toward the origin" : "keeps its distance from the origin"}.`,
          `绕原点的方向场和一条轨线，轨线${spin["zh-CN"]}旋转，并且${alpha > 0 ? "远离原点" : alpha < 0 ? "靠近原点" : "与原点的距离不变"}。`,
        ),
      ),
    );
  },
};

/** phaseLineFromGraph asks which equilibria of an autonomous equation are stable, from the graph of its right side. */
const phaseLineFromGraph: KnowledgePointDef = {
  id: "stable-equilibria-from-a-graph",
  figure: differentialEquationsDrawings1["phase-lines-of-first-order-odes#stable-equilibria-from-a-graph"],
  title: t("Stable equilibria from a graph", "由图判断稳定平衡点"),
  explanation: t(
    "For $\\frac{dx}{dt} = f(x)$, the equilibria are the zeros of $f$. Where $f > 0$ the solution moves right and where $f < 0$ it moves left. So a zero where the graph of $f$ crosses from above the axis to below it attracts from both sides and is stable, and a zero where it crosses from below to above repels and is unstable.",
    "对 $\\frac{dx}{dt} = f(x)$，平衡点是 $f$ 的零点。$f > 0$ 处解向右移动，$f < 0$ 处解向左移动。所以 $f$ 的图象从轴上方穿到下方的零点从两侧吸引解，是稳定的；从下方穿到上方的零点排斥解，是不稳定的。",
  ),
  generate(rng: Rng): Problem {
    const p = rng.int(-4, -2);
    const q = rng.int(-1, 1);
    const r = rng.int(2, 4);
    const s = rng.pick([1, -1]);
    const size = Math.max(...[-5, -3, -1, 1, 3, 5].map((x) => Math.abs((x - p) * (x - q) * (x - r))), 1);
    const f = (x: number) => (s * 12 * (x - p) * (x - q) * (x - r)) / size;
    const outer = t(`$x = ${p}$ and $x = ${r}$ only`, `只有 $x = ${p}$ 和 $x = ${r}$`);
    const middle = t(`$x = ${q}$ only`, `只有 $x = ${q}$`);
    const right = s < 0 ? outer : middle;
    const wrong = [s < 0 ? middle : outer, t("All three zeros", "三个零点都是"), t("None of the zeros", "没有一个零点是")];
    return withFigure(
      pickChoice(
        rng,
        t(
          "The graph shows $y = f(x)$ for the equation $\\frac{dx}{dt} = f(x)$. Which equilibria are stable?",
          "图中是方程 $\\frac{dx}{dt} = f(x)$ 中 $y = f(x)$ 的图象。哪些平衡点是稳定的？",
        ),
        right,
        wrong,
        t(
          `The zeros are $x = ${p}$, $x = ${q}$ and $x = ${r}$. A zero is stable when the graph crosses the axis going downward, so that $f > 0$ on its left and $f < 0$ on its right. Here that happens at ${s < 0 ? `$x = ${p}$ and $x = ${r}$` : `$x = ${q}$`}.`,
          `零点是 $x = ${p}$、$x = ${q}$ 和 $x = ${r}$。图象向下穿过轴的零点是稳定的，因为其左侧 $f > 0$，右侧 $f < 0$。这里这样的零点是${s < 0 ? `$x = ${p}$ 和 $x = ${r}$` : `$x = ${q}$`}。`,
        ),
      ),
      drawn(
        { xMin: -6, xMax: 6, yMin: -6, yMax: 6, labelEvery: 2 },
        [{ kind: "curve", f: (x) => f(x), accent: true }],
        t(
          `A cubic curve crossing the x-axis at ${p}, ${q} and ${r}, ${s > 0 ? "rising" : "falling"} through the first and last of these.`,
          `一条三次曲线，与 x 轴交于 ${p}、${q} 和 ${r}，在第一个和最后一个交点处${s > 0 ? "上升" : "下降"}穿过。`,
        ),
      ),
    );
  },
};

/** polarFamily lists polar curves with distinct shapes. */
function polarFamily(a: number) {
  return [
    {
      equation: `r = ${a}(1 + \\cos \\theta)`,
      r: (th: number) => a * (1 + Math.cos(th)),
      look: t("a cardioid, with its cusp at the origin, opening to the right", "心形线，尖点在原点，朝右"),
      why: t(
        "At $\\theta = 0$ the radius is largest and at $\\theta = \\pi$ it is zero.",
        "$\\theta = 0$ 时半径最大，$\\theta = \\pi$ 时半径为零。",
      ),
    },
    {
      equation: `r = ${a}(1 + \\sin \\theta)`,
      r: (th: number) => a * (1 + Math.sin(th)),
      look: t("a cardioid, with its cusp at the origin, opening upward", "心形线，尖点在原点，朝上"),
      why: t(
        "At $\\theta = \\frac{\\pi}{2}$ the radius is largest and at $\\theta = \\frac{3\\pi}{2}$ it is zero.",
        "$\\theta = \\frac{\\pi}{2}$ 时半径最大，$\\theta = \\frac{3\\pi}{2}$ 时半径为零。",
      ),
    },
    {
      equation: `r = ${a} \\cos 2\\theta`,
      r: (th: number) => a * Math.cos(2 * th),
      look: t("a rose with four petals", "四瓣玫瑰线"),
      why: t(
        "For $r = a\\cos n\\theta$ with even $n$, the rose has $2n$ petals.",
        "对 $r = a\\cos n\\theta$，$n$ 为偶数时玫瑰线有 $2n$ 瓣。",
      ),
    },
    {
      equation: `r = ${a} \\cos 3\\theta`,
      r: (th: number) => a * Math.cos(3 * th),
      look: t("a rose with three petals", "三瓣玫瑰线"),
      why: t("For $r = a\\cos n\\theta$ with odd $n$, the rose has $n$ petals.", "对 $r = a\\cos n\\theta$，$n$ 为奇数时玫瑰线有 $n$ 瓣。"),
    },
    {
      equation: `r = ${2 * a} \\cos \\theta`,
      r: (th: number) => 2 * a * Math.cos(th),
      look: t("a circle through the origin, centered on the x-axis", "过原点、圆心在 x 轴上的圆"),
      why: t(
        `Multiplying by $r$ gives $x^2 + y^2 = ${2 * a}x$, a circle through the origin.`,
        `两边乘以 $r$ 得 $x^2 + y^2 = ${2 * a}x$，这是过原点的圆。`,
      ),
    },
    {
      equation: `r = ${a}`,
      r: () => a,
      look: t("a circle around the origin", "以原点为圆心的圆"),
      why: t("The radius is the same in every direction.", "每个方向上的半径都相同。"),
    },
  ];
}

/** recognizingPolarCurves asks for the equation of a drawn polar curve. */
const recognizingPolarCurves: KnowledgePointDef = {
  id: "recognizing-a-polar-curve",
  title: t("Recognizing a polar curve", "辨认极坐标曲线"),
  explanation: t(
    "Before setting up an area in polar coordinates, it helps to know the curve. The common shapes are\n\n$$r = a(1 + \\cos\\theta): \\text{ cardioid}, \\qquad r = a\\cos n\\theta: \\text{ rose}, \\qquad r = 2a\\cos\\theta: \\text{ circle through the origin}$$\n\nA rose has $n$ petals for odd $n$ and $2n$ for even $n$, so the three-petal rose of length $3$ drawn here is $r = 3\\cos 3\\theta$. Testing $\\theta = 0$ and $\\theta = \\frac{\\pi}{2}$ separates most candidates.\n\nCheck: at $\\theta = 0$, $r = 3\\cos 0 = 3$, the tip on the positive $x$-axis, and at $\\theta = \\frac{\\pi}{6}$, $r = 3\\cos\\frac{\\pi}{2} = 0$, so the petal closes at the origin, as drawn.\n\n> **Watch out.** $r = 2a\\cos\\theta$ is a whole circle, not a petal, and a rose with four petals is $r = a\\cos 2\\theta$, not $r = a\\cos 4\\theta$.",
    "在极坐标下计算面积之前，先认识曲线会有帮助。常见的形状有\n\n$$r = a(1 + \\cos\\theta): \\text{ 心形线}, \\qquad r = a\\cos n\\theta: \\text{ 玫瑰线}, \\qquad r = 2a\\cos\\theta: \\text{ 过原点的圆}$$\n\n玫瑰线在 $n$ 为奇数时有 $n$ 瓣，$n$ 为偶数时有 $2n$ 瓣，所以这里画出的瓣长为 $3$ 的三瓣玫瑰线是 $r = 3\\cos 3\\theta$。检验 $\\theta = 0$ 和 $\\theta = \\frac{\\pi}{2}$ 可以排除大多数候选。\n\n检验：在 $\\theta = 0$ 处 $r = 3\\cos 0 = 3$，即正 $x$ 轴上的尖端；在 $\\theta = \\frac{\\pi}{6}$ 处 $r = 3\\cos\\frac{\\pi}{2} = 0$，花瓣在原点闭合，与图相符。\n\n> **注意。** $r = 2a\\cos\\theta$ 是一个完整的圆，不是花瓣；四瓣玫瑰线是 $r = a\\cos 2\\theta$，不是 $r = a\\cos 4\\theta$。",
  ),
  figure: polarDrawing(
    (th) => 3 * Math.cos(3 * th),
    t("A rose with three petals, of length 3, one of them along the positive x-axis.", "三瓣玫瑰线，瓣长为 3，其中一瓣沿 x 轴正半轴。"),
  ),
  generate(rng: Rng): Problem {
    const a = rng.int(2, 4);
    const family = polarFamily(a);
    const chosen = rng.int(0, family.length - 1);
    const pick = family[chosen] as (typeof family)[number];
    const reach = chosen === 4 || chosen === 0 || chosen === 1 ? 2 * a : a;
    /** probes gives, for each member of the family in order, an angle, the radius there and the point it gives, then an angle where the radius is zero. */
    const probes: readonly (readonly [string, number, string, string | null])[] = [
      ["0", 2 * a, `(${2 * a}, 0)`, "\\pi"],
      ["\\frac{\\pi}{2}", 2 * a, `(0, ${2 * a})`, "\\frac{3\\pi}{2}"],
      ["0", a, `(${a}, 0)`, "\\frac{\\pi}{4}"],
      ["0", a, `(${a}, 0)`, "\\frac{\\pi}{6}"],
      ["0", 2 * a, `(${2 * a}, 0)`, "\\frac{\\pi}{2}"],
      ["\\frac{\\pi}{2}", a, `(0, ${a})`, null],
    ];
    const [th, value, at, zero] = probes[chosen] as (typeof probes)[number];
    const size: Text =
      reach === 2 * a
        ? t(
            `Its farthest point is $${reach}$ from the origin, which is $2a$, so $a = ${a}$.`,
            `它离原点最远 $${reach}$，即 $2a$，所以 $a = ${a}$。`,
          )
        : t(
            `Its farthest point is $${reach}$ from the origin, which is $a$, so $a = ${a}$.`,
            `它离原点最远 $${reach}$，即 $a$，所以 $a = ${a}$。`,
          );
    const back: Text = zero
      ? t(
          ` At $\\theta = ${zero}$ it gives $r = 0$, so the curve passes through the origin there, as drawn.`,
          `在 $\\theta = ${zero}$ 处得 $r = 0$，所以曲线在那里经过原点，与图相符。`,
        )
      : t(
          " Every angle gives the same $r$, so the curve never reaches the origin, as drawn.",
          "每个角度都给出同样的 $r$，所以曲线不经过原点，与图相符。",
        );
    const solution = t(
      `**Step 1: Name the shape.** The curve is ${pick.look.en}. ${pick.why.en}\n\n**Step 2: Read the size.** ${size.en} So the equation is\n\n$$${pick.equation}$$\n\n**Check.** Put $\\theta = ${th}$ into $${pick.equation}$: it gives $r = ${value}$, the point $${at}$ on the drawing.${back.en}`,
      `**第一步：判断形状。**曲线是${pick.look["zh-CN"]}。${pick.why["zh-CN"]}\n\n**第二步：读出大小。**${size["zh-CN"]}所以方程是\n\n$$${pick.equation}$$\n\n**检验。**把 $\\theta = ${th}$ 代入 $${pick.equation}$：得 $r = ${value}$，即图上的点 $${at}$。${back["zh-CN"]}`,
    );
    const others = family.filter((_, i) => i !== chosen);
    return reasoned(
      withFigure(
        pickChoice(
          rng,
          t("Which polar equation has this graph?", "这个图象是哪个极坐标方程？"),
          math(pick.equation),
          rng.shuffle(others).map((o) => math(o.equation)),
          solution,
        ),
        polarDrawing(
          pick.r,
          t(
            `A polar curve: ${pick.look.en}, reaching a distance of ${reach} from the origin.`,
            `极坐标曲线：${pick.look["zh-CN"]}，离原点最远的距离为 ${reach}。`,
          ),
        ),
      ),
      others.map((o) => [
        math(o.equation).en,
        `This graph is ${o.look.en}, but the drawing shows ${pick.look.en}.`,
        `这个方程的图象是${o.look["zh-CN"]}，而图中是${pick.look["zh-CN"]}。`,
      ]),
    );
  },
};

/** polarDrawing draws r = f(θ) in a square view that holds the curve. */
function polarDrawing(r: (theta: number) => number, alt: Text): Figure {
  const points = Array.from({ length: 361 }, (_, i): Point => {
    const theta = (2 * Math.PI * i) / 360;
    const radius = r(theta);
    return [radius * Math.cos(theta), radius * Math.sin(theta)];
  });
  const size = Math.ceil(Math.max(...points.flatMap(([x, y]) => [Math.abs(x), Math.abs(y)]))) + 1;
  return drawn(square(size), [{ kind: "path", points, accent: true }], alt);
}

// ---------------------------------------------------------------------------
// Distributions
// ---------------------------------------------------------------------------

/** uniformFromDensity asks for a probability read from the density of a uniform distribution. */
const uniformFromDensity: KnowledgePointDef = {
  id: "a-uniform-probability-from-its-density",
  figure: probabilityDrawings1["the-continuous-uniform-distribution#a-uniform-probability-from-its-density"],
  title: t("A uniform probability from its density", "由密度图求均匀分布的概率"),
  explanation: t(
    "The density of a uniform distribution on $[a, b]$ is a flat rectangle of height $\\frac{1}{b - a}$, whose total area is $1$. A probability is the area over an interval, here width times height. The drawing gives all that is needed: the ends of the rectangle fix the height, and the shaded part gives the width.",
    "$[a, b]$ 上均匀分布的密度是一个高为 $\\frac{1}{b - a}$ 的平顶矩形，总面积为 $1$。概率就是区间上的面积，这里等于宽乘高。图上已给出所需的一切：矩形的两端确定高度，阴影部分给出宽度。",
  ),
  generate(rng: Rng): Problem {
    const a = rng.int(0, 3);
    const w = rng.pick([2, 4, 5, 8, 10]);
    const b = a + w;
    const c = rng.int(a, b - 1);
    const d = rng.int(c + 1, b);
    const h = 1 / w;
    const ticks = Array.from({ length: b + 2 }, (_, x) => x)
      .filter((x) => w <= 5 || x % 2 === 0 || x === c || x === d)
      .map((x): readonly [number, string] => [x, String(x)]);
    return withFigure(
      numberProblem({
        prompt: t(
          "The drawing shows the density of a uniform random variable $X$. Find the probability that $X$ falls in the shaded interval.",
          "图中是均匀随机变量 $X$ 的密度。求 $X$ 落在阴影区间内的概率。",
        ),
        answer: Q.of(d - c, w),
        wrong: [Q.of(d - c, b), Q.of(w - (d - c), w), Q.of(d, b), Q.of(d - c)],
        solution: t(
          `The rectangle runs from $${a}$ to $${b}$, so its height is $\\frac{1}{${w}}$. The shaded width is $${d} - ${c} = ${d - c}$, so the probability is $${d - c} \\cdot \\frac{1}{${w}} = ${frac(d - c, w)}$.`,
          `矩形从 $${a}$ 到 $${b}$，所以高为 $\\frac{1}{${w}}$。阴影宽度是 $${d} - ${c} = ${d - c}$，所以概率是 $${d - c} \\cdot \\frac{1}{${w}} = ${frac(d - c, w)}$。`,
        ),
      }),
      chart(
        {
          x: [0, b + 1],
          top: h * 1.3,
          xTicks: ticks,
          yTicks: [[h, `1/${w}`]],
          curves: [
            [
              [0, 0],
              [a, 0],
              [a, h],
              [b, h],
              [b, 0],
              [b + 1, 0],
            ],
          ],
          shade: [
            [c, 0],
            [c, h],
            [d, h],
            [d, 0],
          ],
        },
        t(`A flat density from ${a} to ${b}, shaded from ${c} to ${d}.`, `从 ${a} 到 ${b} 的平顶密度，从 ${c} 到 ${d} 有阴影。`),
      ),
    );
  },
};

/** exponentialTail asks for a tail probability from the drawn density of an exponential distribution. */
const exponentialTail: KnowledgePointDef = {
  id: "a-tail-probability-from-the-density-curve",
  title: t("A tail probability from the density curve", "由密度曲线求尾部概率"),
  explanation: t(
    "The density $f(x) = \\lambda e^{-\\lambda x}$ starts at height $\\lambda$ on the vertical axis, so a drawing shows the rate directly. Integrating from $c$ to infinity gives the tail area $P(X > c) = e^{-\\lambda c}$. The complement $1 - e^{-\\lambda c}$ is the area on the other side, and a common slip is to report the height $\\lambda e^{-\\lambda c}$ of the curve instead of an area.",
    "密度 $f(x) = \\lambda e^{-\\lambda x}$ 在纵轴上的起始高度是 $\\lambda$，所以图上可以直接看出速率。从 $c$ 积分到无穷得到尾部面积 $P(X > c) = e^{-\\lambda c}$。补数 $1 - e^{-\\lambda c}$ 是另一侧的面积；常见的错误是把曲线的高度 $\\lambda e^{-\\lambda c}$ 当成面积。",
  ),
  generate(rng: Rng): Problem {
    const [n, d] = rng.pick<readonly [number, number]>([
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
    ]);
    const rate = n / d;
    const k = rng.int(1, 5);
    const c = (k * d) / n;
    const end = (6 * d) / n;
    const f = (x: number) => rate * Math.exp(-rate * x);
    const rateLatex = frac(n, d);
    const label = d === 1 ? String(n) : `${n}/${d}`;
    const cLatex = frac(k * d, n);
    const tail = sampled(f, c, end, 60);
    const xTicks = Array.from({ length: 7 }, (_, i): readonly [number, string] => [
      (i * d) / n,
      n === 1 ? String(i * d) : frac(i * d, n).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"),
    ]);
    return withFigure(
      pickChoice(
        rng,
        t(
          "The drawing shows the density of an exponential random variable $X$. What is the probability of the shaded tail?",
          "图中是指数随机变量 $X$ 的密度。阴影尾部的概率是多少？",
        ),
        math(`e^{-${k}}`),
        [math(`1 - e^{-${k}}`), math(rate === 1 ? `${k + 1}e^{-${k}}` : `${rateLatex}e^{-${k}}`), math(`e^{-${k + 1}}`)],
        t(
          `The curve starts at height $\\lambda = ${rateLatex}$ and the shaded part begins at $c = ${cLatex}$. The tail area is $e^{-\\lambda c} = e^{-${k}}$, because $\\lambda c = ${k}$.`,
          `曲线从高度 $\\lambda = ${rateLatex}$ 开始，阴影部分从 $c = ${cLatex}$ 开始。尾部面积是 $e^{-\\lambda c} = e^{-${k}}$，因为 $\\lambda c = ${k}$。`,
        ),
      ),
      chart(
        {
          x: [0, end],
          top: rate * 1.15,
          xTicks,
          yTicks: [[rate, label]],
          curves: [sampled(f, 0, end)],
          shade: [[c, 0], ...tail, [end, 0]],
        },
        t(
          `A decreasing exponential density starting at height ${label}, shaded to the right of ${cLatex.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}.`,
          `递减的指数密度，起始高度为 ${label}，在 ${cLatex.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")} 右侧有阴影。`,
        ),
      ),
    );
  },
};

/** cdfFromGraph asks for an interval probability read from the graph of a distribution function. */
const cdfFromGraph: KnowledgePointDef = {
  id: "a-probability-from-the-graph-of-a-distribution-function",
  figure:
    probabilityDrawings1[
      "cumulative-distribution-functions-for-continuous-random-variables#a-probability-from-the-graph-of-a-distribution-function"
    ],
  title: t("A probability from the graph of a distribution function", "由分布函数图求概率"),
  explanation: t(
    "The graph of a distribution function $F(x) = P(X \\le x)$ rises from $0$ to $1$ and never falls. The probability of an interval is a difference of heights, not a height: $P(a < X \\le b) = F(b) - F(a)$. Where the graph is steep, the probability is concentrated, and where it is flat, $X$ almost never falls.",
    "分布函数 $F(x) = P(X \\le x)$ 的图象从 $0$ 上升到 $1$，并且不会下降。区间的概率是高度之差，而不是某个高度：$P(a < X \\le b) = F(b) - F(a)$。图象陡的地方概率集中，平的地方 $X$ 几乎不会落入。",
  ),
  generate(rng: Rng): Problem {
    const heights = [0];
    let left = 10;
    for (let i = 0; i < 5; i++) {
      const rise = i === 4 ? left : rng.int(i === 0 ? 1 : 0, Math.min(left, 4));
      heights.push(heights[i]! + rise);
      left -= rise;
    }
    let a: number;
    let b: number;
    do {
      a = rng.int(1, 3);
      b = rng.int(a + 1, 5);
    } while (heights[a] === heights[b] || heights[a] === 0);
    const F = (x: number) => (heights[x] as number) / 10;
    const points = heights.map((h, x): Point => [x, h / 10]);
    const answer = Q.of((heights[b] as number) - (heights[a] as number), 10);
    const fmt = (h: number) => (h / 10).toString();
    return withFigure(
      numberProblem({
        prompt: t(
          `The graph shows the distribution function $F$ of a random variable $X$. Find $P(${a} < X \\le ${b})$.`,
          `图中是随机变量 $X$ 的分布函数 $F$。求 $P(${a} < X \\le ${b})$。`,
        ),
        answer,
        wrong: [
          Q.of(heights[b] as number, 10),
          Q.of(10 - (heights[b] as number), 10),
          Q.of((heights[b] as number) + (heights[a] as number), 10),
        ],
        solution: t(
          `A probability of an interval is a difference of heights. The graph gives $F(${b}) = ${fmt(heights[b] as number)}$ and $F(${a}) = ${fmt(heights[a] as number)}$, so $P(${a} < X \\le ${b}) = ${fmt(heights[b] as number)} - ${fmt(heights[a] as number)} = ${(F(b) - F(a)).toFixed(1)}$.`,
          `区间的概率是高度之差。由图得 $F(${b}) = ${fmt(heights[b] as number)}$，$F(${a}) = ${fmt(heights[a] as number)}$，所以 $P(${a} < X \\le ${b}) = ${fmt(heights[b] as number)} - ${fmt(heights[a] as number)} = ${(F(b) - F(a)).toFixed(1)}$。`,
        ),
      }),
      chart(
        {
          x: [0, 6],
          top: 1.05,
          xTicks: [0, 1, 2, 3, 4, 5, 6].map((x): readonly [number, string] => [x, String(x)]),
          yTicks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k): readonly [number, string] => [k / 10, (k / 10).toString()]),
          curves: [[...points, [6, 1]]],
          dots: points,
        },
        t(
          `A rising broken line through the points ${points.map(([x, y]) => `(${x}, ${y})`).join(", ")}, then flat at 1.`,
          `一条上升的折线，经过 ${points.map(([x, y]) => `(${x}, ${y})`).join("、")}，之后保持为 1。`,
        ),
      ),
    );
  },
};

/** stepDensities lists two-step densities of total area one, as the end of the first step, its height and the second height and width, in tenths for the heights. */
const stepDensities: readonly (readonly [number, number, number, number])[] = [
  [1, 1, 3, 3],
  [1, 1, 1, 9],
  [2, 1, 2, 4],
  [2, 1, 1, 8],
  [2, 1, 4, 2],
  [3, 1, 1, 7],
  [4, 1, 1, 6],
  [4, 1, 2, 3],
  [4, 1, 3, 2],
  [1, 2, 1, 8],
  [1, 2, 4, 2],
  [2, 2, 1, 6],
  [2, 2, 3, 2],
  [3, 2, 1, 4],
  [3, 2, 2, 2],
  [1, 3, 1, 7],
  [2, 3, 1, 4],
  [2, 3, 2, 2],
];

/** percentileFromDensity asks for a percentile of a density that has two steps. */
const percentileFromDensity: KnowledgePointDef = {
  id: "a-percentile-from-a-step-density",
  title: t("A percentile from a step density", "由阶梯密度求百分位数"),
  explanation: t(
    "The $p$-th percentile of a continuous random variable is the point with area $p$ to its left. With a density made of flat steps, add areas from the left, width times height, until the target is passed; the percentile lies in the step where that happens. Inside that step the remaining area divided by the height gives the distance to go.",
    "连续随机变量的第 $p$ 百分位数是左侧面积为 $p$ 的点。对由平顶台阶组成的密度，从左向右累加面积（宽乘高），直到超过目标；百分位数就落在这一级台阶内。在这一级中，用剩余面积除以高度就得到还要走的距离。",
  ),
  generate(rng: Rng): Problem {
    const [a, h1, h2, w2] = rng.pick(stepDensities);
    const p = rng.pick([25, 50, 75]);
    const first = a * h1 * 10; // the area of the first step, in percent
    const inFirst = p <= first;
    const answer = inFirst ? Q.of(p, 10 * h1) : Q.of(a).add(Q.of(p - first, 10 * h2));
    const naive = Q.of(p * (a + w2), 100);
    const end = a + w2;
    const xTicks = Array.from({ length: end + 2 }, (_, x): readonly [number, string] => [x, String(x)]);
    return withFigure(
      numberProblem({
        prompt: t(
          `The drawing shows the density of a random variable $X$. Find the value of $x$ with $P(X \\le x) = ${frac(p, 100)}$.`,
          `图中是随机变量 $X$ 的密度。求满足 $P(X \\le x) = ${frac(p, 100)}$ 的 $x$。`,
        ),
        answer,
        wrong: [naive, Q.of(a), Q.of(p, 100), Q.of(a).add(Q.of(p, 10 * h2))],
        solution: t(
          inFirst
            ? `The first step has area $${a} \\cdot ${h1 / 10} = ${first / 100}$, which reaches the target $${p / 100}$. So the point lies in it, at $x = ${p / 100} \\div ${h1 / 10} = ${answer.toLatex()}$.`
            : `The first step has area $${a} \\cdot ${h1 / 10} = ${first / 100}$, short of the target $${p / 100}$. The remaining area $${(p - first) / 100}$ lies in the second step, of height $${h2 / 10}$, which takes a further width of $${Q.of(p - first, 10 * h2).toLatex()}$. So $x = ${a} + ${Q.of(p - first, 10 * h2).toLatex()} = ${answer.toLatex()}$.`,
          inFirst
            ? `第一级的面积是 $${a} \\cdot ${h1 / 10} = ${first / 100}$，已达到目标 $${p / 100}$。所以这一点在第一级内，$x = ${p / 100} \\div ${h1 / 10} = ${answer.toLatex()}$。`
            : `第一级的面积是 $${a} \\cdot ${h1 / 10} = ${first / 100}$，还不到目标 $${p / 100}$。剩余面积 $${(p - first) / 100}$ 在第二级中，其高度为 $${h2 / 10}$，还需要宽度 $${Q.of(p - first, 10 * h2).toLatex()}$。所以 $x = ${a} + ${Q.of(p - first, 10 * h2).toLatex()} = ${answer.toLatex()}$。`,
        ),
      }),
      chart(
        {
          x: [0, end + 1],
          top: (Math.max(h1, h2) / 10) * 1.2,
          xTicks,
          yTicks: [...new Set([h1, h2])].map((h): readonly [number, string] => [h / 10, (h / 10).toString()]),
          curves: [
            [
              [0, 0],
              [0, h1 / 10],
              [a, h1 / 10],
              [a, h2 / 10],
              [end, h2 / 10],
              [end, 0],
              [end + 1, 0],
            ],
          ],
        },
        t(
          `A density with two flat steps: height ${h1 / 10} from 0 to ${a} and height ${h2 / 10} from ${a} to ${end}.`,
          `有两级平顶台阶的密度：从 0 到 ${a} 高为 ${h1 / 10}，从 ${a} 到 ${end} 高为 ${h2 / 10}。`,
        ),
      ),
    );
  },
};

/**
 * figureReadingPoints holds, by topic id, the knowledge points that ask a learner to read a drawing. The university
 * courses have few figures of their own, and these questions test what a formula alone cannot: seeing a field, a surface,
 * a region or a density and tying it to the symbols. They come after a topic's own knowledge points.
 */
export const figureReadingPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "area-scale-factors-of-linear-transformations": [areaFromDeterminant],
  "the-standard-matrix-of-a-linear-transformation": [matrixFromUnitSquare],
  "the-angle-between-two-vectors": [dotSignFromDrawing],
  "calculating-a-vector-projection": [projectionFromDrawing],
  "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d": [combinationFromDrawing],
  "visualizing-vector-fields": [matchingFieldPlot],
  "the-divergence-of-a-vector-field": [divergenceFromPlot],
  "the-curl-of-a-vector-field": [curlFromPlot],
  "level-curves": [matchingContours, readingContours],
  "the-gradient-as-a-normal-vector": [gradientOnContour],
  "the-domain-of-a-multivariable-function": [domainFromDrawing],
  "identifying-quadric-surfaces": [recognizingQuadrics],
  "parametric-surfaces": [matchingParametrizations],
  "type-i-and-ii-regions-in-two-dimensional-space": [limitsFromRegion],
  "double-integrals-in-plane-polar-coordinates": [polarLimitsFromRegion],
  "image-of-a-linear-transformation-in-the-cartesian-plane": [matrixFromUnitSquare],
  "standard-matrix-of-a-linear-transformation-in-terms-of-the-standard-basis": [linearityFromDrawing],
  "basic-properties-of-determinants": [areaFromDeterminant],
  "projecting-vectors-onto-one-dimensional-subspaces": [projectionFromDrawing],
  "cauchy-schwarz-inequality-and-angle-between-two-vectors": [dotSignFromDrawing],
  "eigenvalues-and-eigenvectors-of-a-2x2-matrix": [eigenvectorFromDrawing],
  "linear-combinations-of-vectors-in-n-dimensional-euclidean-space": [combinationFromDrawing],
  "the-vector-equation-of-a-line": [lineFromDrawing],
  "phase-portraits-for-decoupled-linear-systems": [decoupledPortrait],
  "phase-portraits-for-linear-systems-with-complex-eigenvalues": [complexPortrait],
  "phase-lines-of-first-order-odes": [phaseLineFromGraph],
  "the-total-area-bounded-by-a-single-polar-curve": [recognizingPolarCurves],
  "the-continuous-uniform-distribution": [uniformFromDensity],
  "the-exponential-distribution": [exponentialTail],
  "cumulative-distribution-functions-for-continuous-random-variables": [cdfFromGraph],
  "median-quartiles-and-percentiles-of-continuous-random-variables": [percentileFromDensity],
};
