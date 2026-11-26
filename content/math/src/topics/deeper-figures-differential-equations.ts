// Knowledge points of Differential Equations that ask the learner to read a drawing: slope fields, phase lines,
// phase portraits and solution curves. See `deeperFiguresDifferentialEquationsPoints`.

import type { Figure, KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { explainedChoice, numberProblem } from "../problems.ts";

import { choose, type Pair, point, same } from "../university-kit.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { drawn, label } from "./figure-reading-more.ts";

/** square is the view from -r to r on both axes. */
const square = (r: number): PlaneView => ({ xMin: -r, xMax: r, yMin: -r, yMax: r });

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** slopes draws short segments with the slope a differential equation gives at the grid points. */
function slopes(f: (x: number, y: number) => number): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (let x = -3; x <= 3; x++)
    for (let y = -3; y <= 3; y++) {
      const m = f(x, y);
      const scale = 0.35 / Math.hypot(1, m);
      marks.push({ kind: "segment", a: [x - scale, y - scale * m], b: [x + scale, y + scale * m], accent: true });
    }
  return marks;
}

/** minusC writes a variable minus a constant, without a stray zero or double sign. */
const minusC = (v: string, c: number) => (c === 0 ? v : `${v} ${c < 0 ? "+" : "-"} ${Math.abs(c)}`);

/** cMinus writes a constant minus a variable. */
const cMinus = (c: number, v: string) => (c === 0 ? `-${v}` : `${c} - ${v}`);

/** group wraps an expression in parentheses when it has more than one term. */
const group = (s: string) => (s.includes(" ") ? `(${s})` : s);

/** trajectory samples a curve of a phase portrait and adds an arrow for increasing time, well away from the crowded center. */
function trajectory(at: (s: number) => Point, from: number, to: number, r: number, center: Point): PlaneMark[] {
  const points = Array.from({ length: 161 }, (_, i): Point => at(from + ((to - from) * i) / 160));
  const inView = (p: Point) => Math.abs(p[0]) < r && Math.abs(p[1]) < r;
  const seen = points.filter(inView);
  const marks: PlaneMark[] = [{ kind: "path", points, accent: true }];
  if (seen.length > 8) {
    const gap = (p: Point) => Math.abs(Math.hypot(p[0] - center[0], p[1] - center[1]) - 0.55 * r);
    let mid = 0;
    for (let i = 0; i + 2 < seen.length; i++) if (gap(seen[i] as Point) < gap(seen[mid] as Point)) mid = i;
    const [p, q] = [seen[mid] as Point, seen[mid + 2] as Point];
    const length = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (length > 1e-6) {
      const [ux, uy] = [(q[0] - p[0]) / length, (q[1] - p[1]) / length];
      marks.push({ kind: "arrow", from: p, to: [p[0] + 0.5 * ux, p[1] + 0.5 * uy], accent: true });
    }
  }
  return marks;
}

/** portrait draws trajectories of a linear system with real eigenvalues l1 and l2 along directions u and w, shifted to a center. */
function portrait(l1: number, l2: number, u: Point, w: Point, center: Point, r: number): PlaneMark[] {
  const marks: PlaneMark[] = [];
  const combos: Point[] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [c1, c2] of combos) {
    const at = (s: number): Point => {
      const [a, b] = [c1 * Math.exp(l1 * s), c2 * Math.exp(l2 * s)];
      return [center[0] + a * u[0] + b * w[0], center[1] + a * u[1] + b * w[1]];
    };
    marks.push(...trajectory(at, -3, 3, r, center));
  }
  return marks;
}

const stableFromGraph = {
  ...point(
    "stability-from-the-graph-of-the-right-side",
    ["Stability from the graph of the right side", "由右端函数的图判断稳定性"],
    [
      "For an autonomous equation $y' = f(y)$, equilibria are the zeros of $f$. Where the graph of $f$ crosses the axis going from positive to negative, solutions on both sides move toward the equilibrium, so it is stable. Where the graph crosses from negative to positive, solutions move away, so it is unstable. For a parabola opening up through $-1$ and $3$, $f$ goes from $+$ to $-$ at $-1$, which is stable, and from $-$ to $+$ at $3$, which is unstable.\n\n> **Watch out.** The direction of the crossing decides, not the height of the graph: the turning point of the parabola is not an equilibrium at all, since $f$ is not zero there.",
      "对自治方程 $y' = f(y)$，平衡点是 $f$ 的零点。$f$ 的图从正到负穿过轴的地方，两侧的解都向平衡点移动，所以它稳定。图从负到正穿过轴的地方，解向外移动，所以它不稳定。对开口向上、过 $-1$ 和 $3$ 的抛物线，$f$ 在 $-1$ 处由 $+$ 变 $-$，是稳定的；在 $3$ 处由 $-$ 变 $+$，是不稳定的。\n\n> **注意。** 起决定作用的是穿过轴的方向，而不是图的高低：抛物线的顶点根本不是平衡点，因为 $f$ 在那里不为零。",
    ],
    (rng) => {
      const a = rng.int(-4, 1);
      const b = a + rng.int(1, 4);
      const up = rng.bool();
      const shrink = rng.pick([1, 0.5]);
      const f = (y: number) => (up ? 1 : -1) * shrink * (y - a) * (y - b);
      const stable = up ? a : b;
      const unstable = up ? b : a;
      return figureNumber(
        [
          "The graph shows $f(y)$ for the autonomous equation $y' = f(y)$. At which value of $y$ is there a stable equilibrium?",
          "图中是自治方程 $y' = f(y)$ 的 $f(y)$。在 $y$ 的哪个值处有稳定平衡点？",
        ],
        stable,
        [
          stepOf(
            ["Find the equilibria", "找平衡点"],
            [
              `The graph crosses the axis at $y = ${a}$ and $y = ${b}$, so these are the equilibria.`,
              `图在 $y = ${a}$ 和 $y = ${b}$ 处穿过轴，所以它们是平衡点。`,
            ],
          ),
          stepOf(
            ["Read the direction of each crossing", "看每次穿过的方向"],
            [
              `The parabola opens ${up ? "up" : "down"}, so $f > 0$ ${up ? "outside" : "between"} the zeros and $f < 0$ ${up ? "between" : "outside"} them. At $y = ${stable}$ the graph goes from positive to negative, so solutions on both sides move toward it and it is stable; at $y = ${unstable}$ it goes from negative to positive.`,
              `抛物线开口向${up ? "上" : "下"}，所以在零点${up ? "之外" : "之间"} $f > 0$，在零点${up ? "之间" : "之外"} $f < 0$。在 $y = ${stable}$ 处图由正变负，两侧的解都向它移动，所以它稳定；在 $y = ${unstable}$ 处图由负变正。`,
            ],
          ),
        ],
        [
          `Just below $${stable}$, $y' = f(y) > 0$ pushes $y$ up toward $${stable}$, and just above it $y' < 0$ pushes $y$ down toward $${stable}$.`,
          `在 $${stable}$ 稍下方，$y' = f(y) > 0$ 使 $y$ 向上趋近 $${stable}$；在它稍上方，$y' < 0$ 使 $y$ 向下趋近 $${stable}$。`,
        ],
        [
          [
            unstable,
            "That equilibrium is unstable: the graph crosses there from negative to positive, so solutions move away.",
            "那个平衡点不稳定：图在那里由负变正，解会离开。",
          ],
          [
            Q.of(a + b, 2),
            "That is the turning point of the parabola, where $f$ is not zero, so it is not an equilibrium.",
            "这是抛物线的顶点，$f$ 在那里不为零，所以不是平衡点。",
          ],
          ...(stable < 0
            ? [
                [
                  Math.abs(stable),
                  "The sign is lost; read the zero with its sign from the axis.",
                  "丢掉了负号；要从轴上连同符号读出零点。",
                ] as const,
              ]
            : []),
        ],
        fig(
          { ...square(6), xName: "y", yName: "f(y)" },
          [{ kind: "curve", f, accent: true }],
          [
            `A parabola opening ${up ? "up" : "down"} that crosses the horizontal axis at ${a} and ${b}.`,
            `开口向${up ? "上" : "下"}的抛物线，与横轴交于 ${a} 和 ${b}。`,
          ],
        ),
      );
    },
  ),
  figure:
    differentialEquationsDrawings1["classifying-equilibrium-solutions-of-first-order-odes#stability-from-the-graph-of-the-right-side"],
};

const limitFromPhaseLine = point(
  "the-long-run-value-from-a-phase-line",
  ["The long-run value from a phase line", "由相线读长期值"],
  [
    "A phase line marks the equilibria of an autonomous equation and shows by arrows which way solutions move between them. A solution starting between two equilibria moves in the direction of the arrow on that interval and tends to the equilibrium the arrow points to. The starting value decides only which interval applies. With equilibria at $-1$ and $2$ and the arrow between them pointing right, $y(0) = 0$ gives the limit $2$.\n\n> **Watch out.** A solution can never pass an equilibrium, so the limit is the end of the starting interval that the arrow points to, not an equilibrium further along and not the starting value.",
    "相线标出自治方程的平衡点，并用箭头表示解在它们之间的移动方向。从两个平衡点之间出发的解，沿该区间上箭头的方向移动，趋向箭头所指的平衡点。初值只决定适用哪个区间。若平衡点在 $-1$ 和 $2$，它们之间的箭头指向右，则 $y(0) = 0$ 的极限是 $2$。\n\n> **注意。** 解永远不能越过平衡点，所以极限是初始区间中箭头所指的那一端，而不是更远处的平衡点，也不是初值。",
  ],
  (rng) => {
    const e1 = rng.int(-6, -3);
    const e2 = e1 + rng.int(2, 4);
    const e3 = e2 + rng.int(2, 4);
    const eq = [e1, e2, e3];
    const firstRight = rng.bool();
    // Each interval has a direction: first the interval below e1, then those between, then the one above e3.
    const right = [firstRight, !firstRight, firstRight, !firstRight];
    const edges = [e1 - 3, e1, e2, e3, e3 + 3];
    const bounded = [0, 1, 2, 3].filter((i) => (i === 0 ? right[0] : i === 3 ? !right[3] : true));
    const interval = rng.pick(bounded);
    const y0 = rng.int((edges[interval] as number) + 1, Math.max((edges[interval] as number) + 1, (edges[interval + 1] as number) - 1));
    const goesRight = right[interval] as boolean;
    const answer = goesRight ? (edges[interval + 1] as number) : (edges[interval] as number);
    const other = goesRight ? (edges[interval] as number) : (edges[interval + 1] as number);
    const x = (v: number) => 160 + (v - (e1 + e3) / 2) * (260 / (e3 - e1 + 6));
    let body = `<line x1="20" y1="60" x2="300" y2="60"/>`;
    for (const e of eq)
      body += `<circle class="accent" cx="${x(e)}" cy="60" r="4" fill="currentColor"/>${label(x(e), 82, String(e).replace("-", "−"))}`;
    for (let i = 0; i < 4; i++) {
      const mid = x(((edges[i] as number) + (edges[i + 1] as number)) / 2);
      const s = right[i] ? 1 : -1;
      body += `<polygon class="accent" points="${mid + 8 * s},60 ${mid - 6 * s},53 ${mid - 6 * s},67" fill="currentColor" stroke="none"/>`;
    }
    body += label(310, 64, "y");
    const below =
      interval === 0 ? `below $${e1}$` : interval === 3 ? `above $${e3}$` : `between $${edges[interval]}$ and $${edges[interval + 1]}$`;
    const belowZh =
      interval === 0 ? `$${e1}$ 以下` : interval === 3 ? `$${e3}$ 以上` : `$${edges[interval]}$ 与 $${edges[interval + 1]}$ 之间`;
    return figureNumber(
      [
        `The phase line of an autonomous equation is drawn, with dots at the equilibria. If $y(0) = ${y0}$, what is $\\lim_{t \\to \\infty} y(t)$?`,
        `图中是某自治方程的相线，点表示平衡点。若 $y(0) = ${y0}$，$\\lim_{t \\to \\infty} y(t)$ 是多少？`,
      ],
      answer,
      [
        stepOf(
          ["Locate the starting value", "确定初值所在区间"],
          [
            `The equilibria are $${e1}$, $${e2}$ and $${e3}$, and $${y0}$ lies ${below}.`,
            `平衡点是 $${e1}$、$${e2}$ 和 $${e3}$，$${y0}$ 位于${belowZh}。`,
          ],
        ),
        stepOf(
          ["Follow the arrow", "沿箭头走"],
          [
            `The arrow on that interval points ${goesRight ? "right" : "left"}, so the solution moves ${goesRight ? "up" : "down"} toward the equilibrium at $${answer}$ and never reaches past it.`,
            `该区间上的箭头指向${goesRight ? "右" : "左"}，所以解${goesRight ? "增大" : "减小"}并趋向 $${answer}$ 处的平衡点，不会越过它。`,
          ],
        ),
      ],
      [
        `The arrows on the two sides of $${answer}$ both point toward it, so it attracts, and nothing lies between $${y0}$ and $${answer}$ to stop the solution earlier.`,
        `$${answer}$ 两侧的箭头都指向它，所以它吸引解，而 $${y0}$ 与 $${answer}$ 之间没有别的平衡点让解提前停下。`,
      ],
      [
        ...(eq.includes(other)
          ? [
              [
                other,
                "That equilibrium is at the end of the interval the arrow points away from.",
                "这个平衡点在箭头背离的那一端。",
              ] as const,
            ]
          : []),
        [y0, "That is the starting value; the solution moves along the arrow.", "这是初值；解会沿箭头移动。"],
        ...[e1, e2, e3]
          .filter((e) => e !== answer && e !== other)
          .map(
            (e) =>
              [
                e,
                "That equilibrium lies beyond another one, and a solution cannot pass an equilibrium.",
                "这个平衡点在另一个平衡点之外，而解不能越过平衡点。",
              ] as const,
          ),
      ],
      {
        svg: svgDocument(100, body),
        alt: t(
          `A phase line with equilibria at ${eq.join(", ")}; the arrow below ${e1} points ${firstRight ? "right" : "left"} and the arrows alternate.`,
          `相线上的平衡点为 ${eq.join("，")}；${e1} 以下的箭头指向${firstRight ? "右" : "左"}，之后箭头方向交替。`,
        ),
      },
    );
  },
);

interface AutonomousCase {
  readonly tex: string;
  readonly f: (y: number) => number;
  readonly clue: Pair;
}

const autonomousCases: readonly AutonomousCase[] = [
  ...[-2, -1, 0, 1, 2].flatMap((c): AutonomousCase[] => [
    {
      tex: minusC("y", c),
      f: (y) => y - c,
      clue: [`slopes are zero along $y = ${c}$ and positive above it`, `斜率沿 $y = ${c}$ 为零，在其上方为正`],
    },
    {
      tex: cMinus(c, "y"),
      f: (y) => c - y,
      clue: [`slopes are zero along $y = ${c}$ and negative above it`, `斜率沿 $y = ${c}$ 为零，在其上方为负`],
    },
  ]),
  ...(
    [
      [-2, 0],
      [-1, 1],
      [0, 2],
      [-2, 1],
      [-1, 2],
      [-2, 2],
      [0, 1],
      [-1, 0],
    ] as const
  ).flatMap(([a, b]): AutonomousCase[] => {
    const product = `${group(minusC("y", a))}${group(minusC("y", b))}`;
    return [
      {
        tex: product,
        f: (y) => (y - a) * (y - b),
        clue: [
          `slopes are zero along $y = ${a}$ and $y = ${b}$ and negative between them`,
          `斜率沿 $y = ${a}$ 和 $y = ${b}$ 为零，在它们之间为负`,
        ],
      },
      {
        tex: `-${product}`,
        f: (y) => -(y - a) * (y - b),
        clue: [
          `slopes are zero along $y = ${a}$ and $y = ${b}$ and positive between them`,
          `斜率沿 $y = ${a}$ 和 $y = ${b}$ 为零，在它们之间为正`,
        ],
      },
    ];
  }),
];

/** Because is a wrong value or option with its reason in English and Chinese. */
type Because<T> = readonly [wrong: T, en: string, zh: string];

/** stepOf is a labelled step of a worked solution with what it says and its displayed lines. */
const stepOf = (title: Pair, said: Pair, ...lines: string[]): Step => [title, t(...said), lines];

/** figureNumber asks for a number read from a drawing, explained in labelled steps with a check, keeping the first reason for each wrong value. */
function figureNumber(
  prompt: Pair,
  answer: number | Q,
  parts: readonly Step[],
  check: Pair,
  reasons: readonly Because<number | Q>[],
  figure: Figure,
) {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  const right = q(answer);
  const kept = reasons.filter((r, i) => !q(r[0]).eq(right) && reasons.findIndex((s) => q(s[0]).eq(q(r[0]))) === i);
  const problem = numberProblem({
    prompt: t(...prompt),
    answer: right,
    mistakes: kept.map(([value, en, zh]) => ({ value: q(value), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
  });
  return { ...problem, figure };
}

/** figureChoice asks a choice about a drawing whose wrong options each have a reason, explained in labelled steps with a check. */
function figureChoice(
  rng: Rng,
  prompt: Pair,
  correct: Pair,
  wrong: readonly Because<Pair>[],
  parts: readonly Step[],
  check: Pair,
  figure: Figure,
) {
  return explainedChoice(rng, {
    prompt: t(...prompt),
    correct: t(...correct),
    wrong: wrong.map(([option, en, zh]) => ({ option: t(...option), why: t(en, zh) })),
    solution: walked(parts, t(...check)),
    figure,
  });
}

/** zerosOf lists the whole numbers from -4 to 4 where a right side is zero. */
const zerosOf = (f: (v: number) => number) => [-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((v) => f(v) === 0);

/** linesAt names the lines v = c for each zero, joined in English and in Chinese. */
const linesAt = (v: string, zeros: readonly number[]): Pair => [
  zeros.map((z) => `$${v} = ${z}$`).join(" and "),
  zeros.map((z) => `$${v} = ${z}$`).join(" 和 "),
];

/** testLine picks a whole number from -3 to 3 where a right side is not zero, nearest the first zero. */
const testLine = (f: (v: number) => number, zeros: readonly number[]) => {
  const z = zeros[0] ?? 0;
  return [z + 1, z - 1, z + 2, z - 2, 3, -3].find((v) => v >= -3 && v <= 3 && f(v) !== 0) ?? 3;
};

const autonomousField = point(
  "the-equation-of-an-autonomous-slope-field",
  ["The equation of an autonomous slope field", "自治斜率场的方程"],
  [
    "In the slope field of an autonomous equation, every segment in a horizontal row has the same slope, because the slope depends only on $y$. So look for the rows with flat segments, which are the equilibria, then read the sign of the slopes between them. These two facts usually leave only one candidate equation. For example, if the segments are flat along $y = -1$ and $y = 2$ and slope down between them, the equation is $y' = (y + 1)(y - 2)$ rather than $y' = -(y + 1)(y - 2)$.\n\nCheck: at height $y = 0$, $(0 + 1)(0 - 2) = -2 < 0$, so the segments in that row fall, as drawn.\n\n> **Watch out.** Two equations with the same flat rows differ only in sign: test one row between them before choosing.",
    "在自治方程的斜率场中，同一水平行上的线段斜率相同，因为斜率只取决于 $y$。所以先找线段水平的行，它们就是平衡点，再读它们之间斜率的符号。这两点通常只留下一个候选方程。例如线段沿 $y = -1$ 和 $y = 2$ 水平，在它们之间向下倾斜，方程就是 $y' = (y + 1)(y - 2)$，而不是 $y' = -(y + 1)(y - 2)$。\n\n检验：在高度 $y = 0$ 处，$(0 + 1)(0 - 2) = -2 < 0$，所以这一行的线段向下，与图相符。\n\n> **注意。** 水平行相同的两个方程只差一个符号：选之前要在它们之间试一行。",
  ],
  (rng) => {
    const right = rng.pick(autonomousCases);
    const zeros = zerosOf(right.f);
    const rows = linesAt("y", zeros);
    const wrong = rng
      .sample(
        autonomousCases.filter((c) => c !== right),
        3,
      )
      .map((c): Because<Pair> => {
        const theirs = zerosOf(c.f);
        return theirs.join() === zeros.join()
          ? [
              same(`y' = ${c.tex}`),
              `This has the same flat rows, but for it the ${c.clue[0]}, while in the drawing the ${right.clue[0]}`,
              `它的水平行相同，但对它来说${c.clue[1]}，而图中${right.clue[1]}`,
            ]
          : [
              same(`y' = ${c.tex}`),
              `For it the flat ${theirs.length === 1 ? "row is" : "rows are"} ${linesAt("y", theirs)[0]}, but in the drawing ${zeros.length === 1 ? "it is" : "they are"} ${rows[0]}`,
              `它的水平行是 ${linesAt("y", theirs)[1]}，而图中是 ${rows[1]}`,
            ];
      });
    const y1 = testLine(right.f, zeros);
    const m = right.f(y1);
    return figureChoice(
      rng,
      ["Which equation has the slope field drawn?", "哪个方程具有图中的斜率场？"],
      same(`y' = ${right.tex}`),
      wrong,
      [
        stepOf(
          ["Find the flat rows", "找水平的行"],
          [
            `Each row of the drawing has one slope, so the equation is autonomous, and the segments are flat along ${rows[0]}.`,
            `图中每一行只有一种斜率，所以方程是自治的；线段沿 ${rows[1]} 水平。`,
          ],
        ),
        stepOf(
          ["Read the signs", "读符号"],
          [
            `In the drawing the ${right.clue[0]}, which matches $y' = ${right.tex}$.`,
            `图中${right.clue[1]}，与 $y' = ${right.tex}$ 相符。`,
          ],
        ),
      ],
      [
        `Test one row: at height $y = ${y1}$ the equation gives $y' = ${m}$, so the segments in that row ${m > 0 ? "rise" : "fall"}, as they do in the drawing.`,
        `试一行：在高度 $y = ${y1}$ 处方程给出 $y' = ${m}$，所以这一行的线段${m > 0 ? "向上" : "向下"}，与图中一致。`,
      ],
      fig(
        square(4),
        slopes((_x, y) => right.f(y)),
        [`A slope field in which ${right.clue[0].replaceAll("$", "")}.`, `一个斜率场，其中${right.clue[1].replaceAll("$", "")}。`],
      ),
    );
  },
);

const integrableCases: readonly AutonomousCase[] = [-3, -2, -1, 0, 1, 2, 3].flatMap((c): AutonomousCase[] => {
  const zero: Pair = [`flat along $x = ${c}$`, `沿 $x = ${c}$ 水平`];
  const inner = group(minusC("x", c));
  return [
    { tex: minusC("x", c), f: (x) => x - c, clue: [`${zero[0]}, with slope rising across the columns`, `${zero[1]}，斜率逐列增大`] },
    { tex: cMinus(c, "x"), f: (x) => c - x, clue: [`${zero[0]}, with slope falling across the columns`, `${zero[1]}，斜率逐列减小`] },
    { tex: `${inner}^2`, f: (x) => (x - c) ** 2, clue: [`${zero[0]}, with positive slope on both sides`, `${zero[1]}，两侧斜率都为正`] },
    {
      tex: `-${inner}^2`,
      f: (x) => -((x - c) ** 2),
      clue: [`${zero[0]}, with negative slope on both sides`, `${zero[1]}，两侧斜率都为负`],
    },
  ];
});

const integrableField = {
  ...point(
    "the-equation-of-a-directly-integrable-field",
    ["The equation of a directly integrable field", "可直接积分的斜率场的方程"],
    [
      "When $y' = f(x)$, the slope depends only on $x$, so every segment in a vertical column has the same slope, and solution curves are vertical translates of one another. Find the column where the segments are flat, which is where $f$ is zero, and then read whether $f$ changes sign there. For example, segments flat along $x = 1$ and rising on both sides fit $y' = (x - 1)^{2}$, while a change from falling to rising fits $y' = x - 1$.\n\nCheck: at $x = 0$ and at $x = 2$, $(x - 1)^{2} = 1 > 0$, so both columns rise, as described.\n\n> **Watch out.** A square keeps its sign on both sides of the zero; only the odd power changes sign there.",
      "当 $y' = f(x)$ 时，斜率只取决于 $x$，所以同一竖直列上的线段斜率相同，解曲线彼此是竖直平移。先找线段水平的那一列，那里 $f$ 为零，再读 $f$ 在那里是否变号。例如线段沿 $x = 1$ 水平、两侧都向上，符合 $y' = (x - 1)^{2}$；由向下变为向上，则符合 $y' = x - 1$。\n\n检验：在 $x = 0$ 和 $x = 2$ 处，$(x - 1)^{2} = 1 > 0$，所以两列都向上，与描述一致。\n\n> **注意。** 平方在零点两侧符号不变；只有奇次幂在那里变号。",
    ],
    (rng) => {
      const right = rng.pick(integrableCases);
      const zeros = zerosOf(right.f);
      const wrong = rng
        .sample(
          integrableCases.filter((c) => c !== right),
          3,
        )
        .map((c): Because<Pair> => {
          const theirs = zerosOf(c.f);
          return theirs.join() === zeros.join()
            ? [
                same(`y' = ${c.tex}`),
                `This is also ${c.clue[0]}, but the drawing is ${right.clue[0]}`,
                `它也${c.clue[1]}，但图中线段${right.clue[1]}`,
              ]
            : [
                same(`y' = ${c.tex}`),
                `For it the flat column is ${linesAt("x", theirs)[0]}, but in the drawing it is ${linesAt("x", zeros)[0]}`,
                `它的水平列是 ${linesAt("x", theirs)[1]}，而图中是 ${linesAt("x", zeros)[1]}`,
              ];
        });
      const x1 = testLine(right.f, zeros);
      const mirror = 2 * (zeros[0] ?? 0) - x1;
      const x2 = mirror >= -3 && mirror <= 3 ? mirror : x1 + Math.sign(x1 - (zeros[0] ?? 0));
      const m1 = right.f(x1);
      const m2 = right.f(x2);
      return figureChoice(
        rng,
        ["Which equation has the slope field drawn?", "哪个方程具有图中的斜率场？"],
        same(`y' = ${right.tex}`),
        wrong,
        [
          stepOf(
            ["See what the slope depends on", "看斜率依赖什么"],
            [
              `Each column of the drawing has one slope, so the slope depends on $x$ only and the equation has the form $y' = f(x)$; the segments are flat along ${linesAt("x", zeros)[0]}.`,
              `图中每一列只有一种斜率，所以斜率只依赖于 $x$，方程形如 $y' = f(x)$；线段沿 ${linesAt("x", zeros)[1]} 水平。`,
            ],
          ),
          stepOf(
            ["Read the signs on each side", "读两侧的符号"],
            [
              `The segments are ${right.clue[0]}, which matches $y' = ${right.tex}$.`,
              `线段${right.clue[1]}，与 $y' = ${right.tex}$ 相符。`,
            ],
          ),
        ],
        [
          `Test two columns: the equation gives $y' = ${m1}$ at $x = ${x1}$ and $y' = ${m2}$ at $x = ${x2}$, so those columns ${m1 > 0 === m2 > 0 ? `both ${m1 > 0 ? "rise" : "fall"}` : `${m1 > 0 ? "rise" : "fall"} and ${m2 > 0 ? "rise" : "fall"}`}, as in the drawing.`,
          `试两列：方程在 $x = ${x1}$ 处给出 $y' = ${m1}$，在 $x = ${x2}$ 处给出 $y' = ${m2}$，所以这两列${m1 > 0 === m2 > 0 ? `都${m1 > 0 ? "向上" : "向下"}` : `分别${m1 > 0 ? "向上" : "向下"}和${m2 > 0 ? "向上" : "向下"}`}，与图中一致。`,
        ],
        fig(
          square(4),
          slopes((x) => right.f(x)),
          [
            `A slope field whose segments are ${right.clue[0].replaceAll("$", "")}.`,
            `一个斜率场，线段${right.clue[1].replaceAll("$", "")}。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings5["slope-fields-for-directly-integrable-differential-equations#the-equation-of-a-directly-integrable-field"],
};

const limitFromField = point(
  "where-a-solution-goes-in-a-slope-field",
  ["Where a solution goes in a slope field", "斜率场中的解趋向何处"],
  [
    "To follow a solution through a slope field, start at the given point and move to the right along the segments. In an autonomous field the solution cannot cross a row of flat segments, so it either approaches one of these rows or leaves the picture. Slopes pointing toward a flat row mean that the row attracts the solution. For example, if the rows $y = -1$ and $y = 2$ are flat and the segments slope up between them, a solution starting at height $0$ rises toward $y = 2$.\n\nCheck: the flat row $y = 2$ is itself a constant solution, so the rising solution cannot cross it and must level off below it.\n\n> **Watch out.** A flat row whose nearby segments lean away from it repels solutions: the solution above $y = -1$ moves away from it.",
    "要在斜率场中跟踪一个解，就从给定点出发沿线段向右移动。在自治场中，解不能穿过线段水平的行，所以要么趋近这样的一行，要么离开图形。指向水平行的斜率说明这一行吸引解。例如 $y = -1$ 和 $y = 2$ 两行水平，它们之间的线段向上，从高度 $0$ 出发的解就上升趋于 $y = 2$。\n\n检验：水平行 $y = 2$ 本身就是常数解，所以上升的解无法越过它，只能在它下方趋于平稳。\n\n> **注意。** 如果水平行附近的线段背离它，这一行就排斥解：$y = -1$ 上方的解远离它。",
  ],
  (rng) => {
    const [a, b] = rng.pick<Point>([
      [-2, 1],
      [-1, 2],
      [-2, 2],
      [-2, 0],
      [0, 2],
      [-1, 1],
    ]);
    const single = rng.bool(0.3);
    const c = rng.int(-2, 2);
    const f = single ? (y: number) => c - y : (y: number) => -(y - a) * (y - b);
    const target = single ? c : b;
    const above = (single ? rng.bool() : false) || (!single && rng.bool());
    const y0 = single
      ? above
        ? Math.min(c + rng.int(1, 2), 3)
        : Math.max(c - rng.int(1, 2), -3)
      : above
        ? 3
        : rng.pick([(a + b) / 2, a + 0.5, b - 0.5]);
    const falls = y0 > target;
    const flat = single ? linesAt("y", [c]) : linesAt("y", [a, b]);
    const reasons: Because<number | Q>[] = [
      [
        Q.of(2 * y0, 2),
        "The segments at $P$ are not flat, so the solution does not stay at its starting height",
        "$P$ 处的线段不水平，所以解不会停在起始高度",
      ],
    ];
    if (single) {
      if (c !== 0) reasons.push([-c, `A sign slipped: the flat row is at height $${c}$`, `符号错了：水平行在高度 $${c}$ 处`]);
      reasons.push([
        falls ? c - 1 : c + 1,
        `The solution cannot cross the flat row $y = ${c}$, so it cannot end ${falls ? "below" : "above"} it`,
        `解无法越过水平行 $y = ${c}$，所以不会停在它${falls ? "下方" : "上方"}`,
      ]);
    } else {
      reasons.push(
        above
          ? [a, `To reach $${a}$ the solution would have to cross the flat row $y = ${b}$`, `要到达 $${a}$，解必须越过水平行 $y = ${b}$`]
          : [
              a,
              `The segments just above $y = ${a}$ lean away from it, so that row repels the solution`,
              `$y = ${a}$ 上方的线段背离它，所以这一行排斥解`,
            ],
        [a + b, "This adds the heights of the flat rows; the limit is one of them", "这是两条水平行的高度之和；极限是其中之一"],
      );
    }
    return figureNumber(
      [
        "The slope field is that of an autonomous equation. What is $\\lim_{x \\to \\infty} y(x)$ for the solution through $P$?",
        "这是某自治方程的斜率场。过 $P$ 的解的 $\\lim_{x \\to \\infty} y(x)$ 是多少？",
      ],
      target,
      [
        stepOf(["Find the flat rows", "找水平的行"], [`The segments are flat along ${flat[0]}.`, `线段沿 ${flat[1]} 水平。`]),
        stepOf(
          ["Follow the segments from P", "从 P 沿线段走"],
          [
            `At $P$, at height $${y0}$, the segments ${falls ? "fall" : "rise"}, so the solution moves ${falls ? "down" : "up"} toward the flat row $y = ${target}$ and levels off there.`,
            `在高度为 $${y0}$ 的 $P$ 处线段${falls ? "向下" : "向上"}，所以解${falls ? "下降" : "上升"}趋于水平行 $y = ${target}$，并在那里趋于平稳。`,
          ],
        ),
      ],
      [
        `The flat row $y = ${target}$ is a constant solution, which no other solution can cross, and between $P$ and that row every segment ${falls ? "falls" : "rises"}; so the solution keeps moving toward $y = ${target}$ and its limit is $${target}$.`,
        `水平行 $y = ${target}$ 是常数解，其他解都无法越过它；在 $P$ 与这一行之间每条线段都${falls ? "向下" : "向上"}，所以解一直趋向 $y = ${target}$，极限是 $${target}$。`,
      ],
      reasons,
      fig(
        square(4),
        [...slopes((_x, y) => f(y)), { kind: "point", at: [-3.5, y0], label: "P", dir: "e" }],
        [
          `A slope field with a point P at height ${y0}; the segments are flat along ${single ? `y = ${c}` : `y = ${a} and y = ${b}`}.`,
          `一个斜率场和高度为 ${y0} 的点 P；线段沿 ${single ? `y = ${c}` : `y = ${a} 和 y = ${b}`} 水平。`,
        ],
      ),
    );
  },
);

/** eigenDirections lists pairs of directions for the straight lines of a phase portrait. */
const eigenDirections: readonly (readonly [Point, Point])[] = [
  [
    [1, 0],
    [0, 1],
  ],
  [
    [1, 1],
    [1, -1],
  ],
  [
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [1, 1],
  ],
  [
    [1, 2],
    [2, -1],
  ],
  [
    [2, 1],
    [-1, 2],
  ],
];

const realPortraits: readonly { readonly l1: number; readonly l2: number; readonly name: Pair; readonly why: Pair }[] = [
  {
    l1: 1,
    l2: -1,
    name: ["a saddle point", "鞍点"],
    why: ["Trajectories come in along one line and leave along another", "轨线沿一条直线进入，沿另一条直线离开"],
  },
  {
    l1: 2,
    l2: -1,
    name: ["a saddle point", "鞍点"],
    why: ["Trajectories come in along one line and leave along another", "轨线沿一条直线进入，沿另一条直线离开"],
  },
  {
    l1: -1,
    l2: -2,
    name: ["a stable node", "稳定结点"],
    why: ["All trajectories head into the origin without turning around it", "所有轨线都不绕原点地进入原点"],
  },
  {
    l1: -2,
    l2: -1,
    name: ["a stable node", "稳定结点"],
    why: ["All trajectories head into the origin without turning around it", "所有轨线都不绕原点地进入原点"],
  },
  {
    l1: 1,
    l2: 2,
    name: ["an unstable node", "不稳定结点"],
    why: ["All trajectories leave the origin without turning around it", "所有轨线都不绕原点地离开原点"],
  },
  {
    l1: 2,
    l2: 1,
    name: ["an unstable node", "不稳定结点"],
    why: ["All trajectories leave the origin without turning around it", "所有轨线都不绕原点地离开原点"],
  },
];

const allTypes: readonly Pair[] = [
  ["a saddle point", "鞍点"],
  ["a stable node", "稳定结点"],
  ["an unstable node", "不稳定结点"],
  ["a stable spiral", "稳定螺旋点"],
  ["a center", "中心"],
];

const classifyRealPortrait = point(
  "classifying-a-drawn-portrait-with-real-eigenvalues",
  ["Classifying a drawn portrait with real eigenvalues", "判断实特征值的相图类型"],
  [
    "With two real eigenvalues, a phase portrait has straight lines along the eigenvectors. Arrows pointing inward on both lines mean both eigenvalues are negative, which makes a stable node. Arrows outward on both mean an unstable node. Arrows inward on one line and outward on the other mean eigenvalues of opposite sign, which makes a saddle.\n\n> **Watch out.** Read the arrows on both straight lines before deciding. With eigenvalue $1$ along $(1, 1)$ and $-1$ along $(1, -1)$, trajectories come in along $(1, -1)$ and leave along $(1, 1)$: a saddle, even though some trajectories pass close to the origin.",
    "有两个实特征值时，相图沿特征向量有直线。两条直线上的箭头都向内，说明两个特征值都为负，这是稳定结点。都向外是不稳定结点。一条向内一条向外，说明特征值异号，这是鞍点。\n\n> **注意。** 下结论前要看两条直线上的箭头。对沿 $(1, 1)$ 的特征值 $1$ 与沿 $(1, -1)$ 的特征值 $-1$，轨线沿 $(1, -1)$ 进入、沿 $(1, 1)$ 离开：即使有轨线从原点附近经过，它也是鞍点。",
  ],
  (rng) => {
    const type = rng.pick(realPortraits);
    const [u, w] = rng.pick(eigenDirections);
    const saddle = type.l1 * type.l2 < 0;
    const stable = type.l1 < 0;
    const lines: Pair = saddle
      ? ["Arrows point inward on one straight line and outward on the other.", "一条直线上的箭头向内，另一条向外。"]
      : stable
        ? ["Arrows point inward on both straight lines.", "两条直线上的箭头都向内。"]
        : ["Arrows point outward on both straight lines.", "两条直线上的箭头都向外。"];
    const signs: Pair = saddle
      ? ["So one eigenvalue is negative and the other positive.", "所以一个特征值为负，另一个为正。"]
      : stable
        ? ["So both eigenvalues are negative.", "所以两个特征值都为负。"]
        : ["So both eigenvalues are positive.", "所以两个特征值都为正。"];
    const reason = (option: Pair): Because<Pair> => {
      const [en, zh] = ((): Pair => {
        if (option === allTypes[0])
          return [
            "A saddle has arrows inward on one line and outward on the other, but here both lines point the same way.",
            "鞍点在一条直线上箭头向内、另一条向外，而这里两条直线方向相同。",
          ];
        if (option === allTypes[1])
          return saddle
            ? [
                "A stable node has arrows inward on both lines, but here one line points outward.",
                "稳定结点两条直线上的箭头都向内，而这里有一条向外。",
              ]
            : [
                "A stable node has arrows inward, but here every arrow points away from the origin.",
                "稳定结点的箭头向内，而这里所有箭头都背离原点。",
              ];
        if (option === allTypes[2])
          return saddle
            ? [
                "An unstable node has arrows outward on both lines, but here one line points inward.",
                "不稳定结点两条直线上的箭头都向外，而这里有一条向内。",
              ]
            : [
                "An unstable node has arrows outward, but here every arrow points toward the origin.",
                "不稳定结点的箭头向外，而这里所有箭头都指向原点。",
              ];
        if (option === allTypes[3])
          return [
            "A spiral turns around the origin, but these trajectories run along straight lines without turning.",
            "螺旋点的轨线绕原点旋转，而这里的轨线沿直线运动，不旋转。",
          ];
        return [
          "A center has closed loops around the origin, but none of these trajectories closes up.",
          "中心周围是闭合回路，而这里没有一条轨线闭合。",
        ];
      })();
      return [option, en, zh];
    };
    return figureChoice(
      rng,
      [
        "The phase portrait of a linear system is drawn, with arrows for increasing time. What kind of equilibrium is at the origin?",
        "图中是某线性方程组的相图，箭头表示时间增加的方向。原点是哪种平衡点？",
      ],
      type.name,
      allTypes.filter((o) => o[0] !== type.name[0]).map(reason),
      [
        stepOf(["Look at the straight lines", "看两条直线"], lines),
        stepOf(["Read the signs", "读出符号"], [`${signs[0]} The origin is ${type.name[0]}.`, `${signs[1]}原点是${type.name[1]}。`]),
      ],
      [
        "Along each eigenvector line a solution is $e^{\\lambda t}\\mathbf{v}$, which shrinks toward the origin when $\\lambda < 0$ and grows away from it when $\\lambda > 0$, so the arrows on the two lines give the signs of the two eigenvalues.",
        "沿每条特征向量直线的解为 $e^{\\lambda t}\\mathbf{v}$，$\\lambda < 0$ 时向原点收缩，$\\lambda > 0$ 时远离原点增长，所以两条直线上的箭头给出两个特征值的符号。",
      ],
      fig(square(4), portrait(type.l1, type.l2, u, w, [0, 0], 4), [`A phase portrait. ${type.why[0]}.`, `一个相图。${type.why[1]}。`]),
    );
  },
);

const classifySpiral = point(
  "classifying-a-drawn-spiral",
  ["Classifying a drawn spiral", "判断图中的螺旋"],
  [
    "With complex eigenvalues $\\alpha \\pm \\beta i$, trajectories turn around the equilibrium. The real part decides the size: inward spirals mean $\\alpha$ is negative, outward spirals mean it is positive, and closed loops mean it is zero. The direction of turning is a separate fact, which is read from the arrows rather than from the eigenvalues alone.\n\n> **Watch out.** The direction of turning does not decide stability: a clockwise spiral can be stable or unstable. Read the size first, then the arrows; an inward spiral with clockwise arrows is a stable spiral turning clockwise.",
    "特征值为复数 $\\alpha \\pm \\beta i$ 时，轨线绕平衡点旋转。实部决定大小：向内螺旋说明 $\\alpha$ 为负，向外螺旋说明为正，闭合回路说明为零。旋转方向是另一回事，要从箭头读出，不能只看特征值。\n\n> **注意。** 旋转方向不决定稳定性：顺时针的螺旋点可能稳定也可能不稳定。先看大小，再看箭头；向内螺旋且箭头顺时针，就是顺时针旋转的稳定螺旋点。",
  ],
  (rng) => {
    const alpha = rng.pick([-0.12, 0, 0.12]);
    const ccw = rng.bool();
    const skew = rng.pick([1, 0.6, 1.5]);
    const start = rng.pick([1.5, 2, 2.5]) * (alpha > 0 ? 0.45 : 1);
    const dir = ccw ? 1 : -1;
    const span = alpha === 0 ? 2 * Math.PI : 5 * Math.PI;
    const at = (s: number): Point => {
      const size = start * Math.exp(alpha * s);
      return [size * Math.cos(dir * s), skew * size * Math.sin(dir * s)];
    };
    const from = alpha > 0 ? -2 * Math.PI : 0;
    const points = Array.from({ length: 241 }, (_, i): Point => at(from + (span * i) / 240));
    const arrows = [from + 0.25 * span, from + 0.5 * span, from + 0.75 * span].map((s): PlaneMark => {
      const [p, q] = [at(s), at(s + 0.15)];
      return { kind: "arrow", from: p, to: q, accent: true };
    });
    const turn: Pair = ccw ? ["counterclockwise", "逆时针"] : ["clockwise", "顺时针"];
    const shape: Pair =
      alpha < 0 ? ["spirals inward", "向内螺旋"] : alpha > 0 ? ["spirals outward", "向外螺旋"] : ["is a closed loop", "是闭合回路"];
    const option = (a: string, b: string, az: string, bz: string): Pair => [`${a}, turning ${b}`, `${az}，${bz}旋转`];
    const all: Pair[] = [
      option("stable spiral", "counterclockwise", "稳定螺旋点", "逆时针"),
      option("stable spiral", "clockwise", "稳定螺旋点", "顺时针"),
      option("unstable spiral", "counterclockwise", "不稳定螺旋点", "逆时针"),
      option("unstable spiral", "clockwise", "不稳定螺旋点", "顺时针"),
      option("center", "counterclockwise", "中心", "逆时针"),
      option("center", "clockwise", "中心", "顺时针"),
    ];
    const kindIndex = alpha < 0 ? 0 : alpha > 0 ? 2 : 4;
    const correct = all[kindIndex + (ccw ? 0 : 1)] as Pair;
    const needs: readonly Pair[] = [
      ["A stable spiral winds inward", "稳定螺旋点向内盘旋"],
      ["An unstable spiral winds outward", "不稳定螺旋点向外盘旋"],
      ["A center is a closed loop", "中心是闭合回路"],
    ];
    const reason = (i: number): Because<Pair> => {
      const option = all[i] as Pair;
      const kind = Math.floor(i / 2);
      if (2 * kind !== kindIndex) {
        const need = needs[kind] as Pair;
        return [option, `${need[0]}, but this trajectory ${shape[0]}.`, `${need[1]}，而这条轨线${shape[1]}。`];
      }
      return [option, `The arrows run ${turn[0]}, not the other way.`, `箭头沿${turn[1]}方向，而不是相反方向。`];
    };
    return figureChoice(
      rng,
      [
        "One trajectory of a linear system is drawn, with arrows for increasing time. What is the equilibrium at the origin?",
        "图中是某线性方程组的一条轨线，箭头表示时间增加的方向。原点是什么平衡点？",
      ],
      correct,
      [0, 1, 2, 3, 4, 5].filter((i) => all[i] !== correct).map(reason),
      [
        stepOf(
          ["Read the size", "看大小"],
          alpha < 0
            ? ["The trajectory spirals inward, so the real part $\\alpha$ is negative.", "轨线向内螺旋，所以实部 $\\alpha$ 为负。"]
            : alpha > 0
              ? ["The trajectory spirals outward, so the real part $\\alpha$ is positive.", "轨线向外螺旋，所以实部 $\\alpha$ 为正。"]
              : ["The trajectory is a closed loop, so the real part $\\alpha$ is zero.", "轨线是闭合回路，所以实部 $\\alpha$ 为零。"],
        ),
        stepOf(
          ["Read the arrows", "看箭头"],
          [`The arrows run ${turn[0]}, so the answer is ${correct[0]}.`, `箭头沿${turn[1]}方向，所以答案是${correct[1]}。`],
        ),
      ],
      [
        "A solution with eigenvalues $\\alpha \\pm \\beta i$ has size proportional to $e^{\\alpha t}$, so each turn multiplies its distance from the origin by $e^{2\\pi\\alpha/\\beta}$: less than $1$ for an inward spiral, more than $1$ for an outward one and exactly $1$ for a closed loop.",
        "特征值为 $\\alpha \\pm \\beta i$ 的解，其大小与 $e^{\\alpha t}$ 成正比，所以每转一圈到原点的距离乘以 $e^{2\\pi\\alpha/\\beta}$：向内螺旋时小于 $1$，向外螺旋时大于 $1$，闭合回路时恰好为 $1$。",
      ],
      fig(
        square(4),
        [{ kind: "path", points, accent: true }, ...arrows],
        [`A trajectory about the origin that ${shape[0]}, running ${turn[0]}.`, `绕原点的轨线，${shape[1]}，沿${turn[1]}方向。`],
      ),
    );
  },
);

const equilibriumOfShifted = point(
  "the-equilibrium-of-a-shifted-system",
  ["The equilibrium of a shifted system", "平移方程组的平衡点"],
  [
    "A shifted system has the same phase portrait as a linear system, moved so that its center sits at the equilibrium. In the equations, this point appears as a constant term: the system $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ has its equilibrium at $\\mathbf{c}$. So the drawing gives the shift by the place where the trajectories meet.\n\n> **Watch out.** The equilibrium is $\\mathbf{c}$ itself, not $-\\mathbf{c}$: a portrait centered at $(2, -1)$ belongs to $\\mathbf{x}' = A\\left(\\mathbf{x} - \\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix}\\right)$.",
    "平移方程组的相图与线性方程组相同，只是移动到以平衡点为中心。在方程中，这个点表现为常数项：方程组 $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ 的平衡点是 $\\mathbf{c}$。所以轨线交汇的地方给出平移量。\n\n> **注意。** 平衡点是 $\\mathbf{c}$ 本身，而不是 $-\\mathbf{c}$：以 $(2, -1)$ 为中心的相图属于 $\\mathbf{x}' = A\\left(\\mathbf{x} - \\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix}\\right)$。",
  ],
  (rng) => {
    const [h, k] = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
    const type = rng.pick(realPortraits);
    const [u, w] = rng.pick(eigenDirections);
    const eq = (x: number, y: number) => `\\mathbf{x}' = A\\left(\\mathbf{x} - \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}\\right)`;
    const form = (x: number, y: number): Pair => [`$${eq(x, y)}$`, `$${eq(x, y)}$`];
    return figureChoice(
      rng,
      [
        "The phase portrait of a system $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ is drawn. Which form has the correct $\\mathbf{c}$?",
        "图中是方程组 $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ 的相图。哪个形式的 $\\mathbf{c}$ 正确？",
      ],
      form(h, k),
      [
        [
          form(k, h),
          `That swaps the coordinates: the trajectories meet at $x = ${h}$, $y = ${k}$.`,
          `这是把坐标交换了：轨线交汇于 $x = ${h}$，$y = ${k}$。`,
        ],
        [
          form(-h, -k),
          "That flips both signs; the right side vanishes at $\\mathbf{x} = \\mathbf{c}$ itself.",
          "这是把两个符号都反了；右端恰好在 $\\mathbf{x} = \\mathbf{c}$ 时为零。",
        ],
        [
          form(h, -k),
          `That flips the sign of the second coordinate; the trajectories meet at $y = ${k}$.`,
          `这是把第二个坐标的符号反了；轨线交汇于 $y = ${k}$。`,
        ],
        [
          form(-h, k),
          `That flips the sign of the first coordinate; the trajectories meet at $x = ${h}$.`,
          `这是把第一个坐标的符号反了；轨线交汇于 $x = ${h}$。`,
        ],
      ],
      [
        stepOf(
          ["Find the equilibrium", "找平衡点"],
          [`All the trajectories meet at $(${h}, ${k})$.`, `所有轨线都在 $(${h}, ${k})$ 交汇。`],
        ),
        stepOf(
          ["Match it with $\\mathbf{c}$", "与 $\\mathbf{c}$ 对应"],
          [
            "The right side vanishes exactly at $\\mathbf{x} = \\mathbf{c}$, so $\\mathbf{c}$ is the equilibrium.",
            "右端恰好在 $\\mathbf{x} = \\mathbf{c}$ 时为零，所以 $\\mathbf{c}$ 就是平衡点。",
          ],
          `\\mathbf{c} = \\begin{pmatrix} ${h} \\\\ ${k} \\end{pmatrix}`,
        ),
      ],
      [
        `At $\\mathbf{x} = (${h}, ${k})$ the right side is $A\\,\\mathbf{0} = \\mathbf{0}$, so the velocity there is zero, as at the meeting point of the drawing.`,
        `在 $\\mathbf{x} = (${h}, ${k})$ 处右端为 $A\\,\\mathbf{0} = \\mathbf{0}$，速度为零，正如图中轨线的交汇点。`,
      ],
      fig(square(7), portrait(type.l1, type.l2, u, w, [h, k], 7), [
        `A phase portrait centered at (${h}, ${k}).`,
        `以 (${h}, ${k}) 为中心的相图。`,
      ]),
    );
  },
);

const decoupledSigns = point(
  "signs-of-a-decoupled-system-from-its-portrait",
  ["Signs of a decoupled system from its portrait", "由相图读解耦方程组的符号"],
  [
    "In the decoupled system $x' = ax$, $y' = by$, the axes are trajectories. The sign of $a$ shows on the $x$-axis: positive means motion away from the origin along it. The sign of $b$ shows on the $y$-axis in the same way. Reading the two axes separately gives both signs with no calculation.\n\n> **Watch out.** Each axis gives the sign of its own coefficient only. For $x' = -x$, $y' = 2y$ the arrows on the $x$-axis point in and those on the $y$-axis point out.",
    "在解耦方程组 $x' = ax$，$y' = by$ 中，坐标轴本身就是轨线。$a$ 的符号在 $x$ 轴上表现：为正表示沿它远离原点。$b$ 的符号同样在 $y$ 轴上表现。分别读两条轴，不用计算就得到两个符号。\n\n> **注意。** 每条轴只给出它自己变量的系数符号。对 $x' = -x$，$y' = 2y$，$x$ 轴上的箭头向内，$y$ 轴上的箭头向外。",
  ],
  (rng) => {
    const [sa, sb] = [rng.sign(), rng.sign()];
    const [ma, mb] = [rng.int(1, 2), rng.int(1, 2)];
    const r = rng.pick([3, 4, 5]);
    const [a, b] = [sa * ma, sb * mb];
    const tex = (p: number, q: number) => {
      const part = (v: number, n: string) => `${v === 1 ? "" : v === -1 ? "-" : v}${n}`;
      return `x' = ${part(p, "x")},\\; y' = ${part(q, "y")}`;
    };
    const xWay: Pair = sa > 0 ? ["away from", "背离"] : ["toward", "指向"];
    const yWay: Pair = sb > 0 ? ["away from", "背离"] : ["toward", "指向"];
    const xWrong: Pair = [
      `Along the $x$-axis the arrows point ${xWay[0]} the origin, so the coefficient of $x$ is ${sa > 0 ? "positive" : "negative"}.`,
      `沿 $x$ 轴箭头${xWay[1]}原点，所以 $x$ 的系数为${sa > 0 ? "正" : "负"}。`,
    ];
    const yWrong: Pair = [
      `Along the $y$-axis the arrows point ${yWay[0]} the origin, so the coefficient of $y$ is ${sb > 0 ? "positive" : "negative"}.`,
      `沿 $y$ 轴箭头${yWay[1]}原点，所以 $y$ 的系数为${sb > 0 ? "正" : "负"}。`,
    ];
    return figureChoice(
      rng,
      [
        "The phase portrait of a decoupled system is drawn, with arrows for increasing time. Which system could it be?",
        "图中是某解耦方程组的相图，箭头表示时间增加的方向。它可能是哪个方程组？",
      ],
      same(tex(a, b)),
      [
        [same(tex(-a, b)), ...xWrong],
        [same(tex(a, -b)), ...yWrong],
        [
          same(tex(-a, -b)),
          "Both signs are flipped; read each axis for its own coefficient.",
          "两个符号都反了；每条轴给出它自己变量的系数。",
        ],
      ],
      [
        stepOf(
          ["Read the $x$-axis", "读 $x$ 轴"],
          [
            `Along the $x$-axis the arrows point ${xWay[0]} the origin, so $a$ is ${sa > 0 ? "positive" : "negative"}.`,
            `沿 $x$ 轴箭头${xWay[1]}原点，所以 $a$ 为${sa > 0 ? "正" : "负"}。`,
          ],
        ),
        stepOf(
          ["Read the $y$-axis", "读 $y$ 轴"],
          [
            `Along the $y$-axis they point ${yWay[0]} it, so $b$ is ${sb > 0 ? "positive" : "negative"}.`,
            `沿 $y$ 轴箭头${yWay[1]}原点，所以 $b$ 为${sb > 0 ? "正" : "负"}。`,
          ],
        ),
      ],
      [
        "On the $x$-axis $y = 0$ and $x = x_0e^{at}$, which grows when $a > 0$ and shrinks when $a < 0$; on the $y$-axis $y = y_0e^{bt}$ behaves the same way with $b$.",
        "在 $x$ 轴上 $y = 0$，$x = x_0e^{at}$，$a > 0$ 时增长，$a < 0$ 时缩小；在 $y$ 轴上 $y = y_0e^{bt}$ 对 $b$ 也是如此。",
      ],
      fig(square(r), portrait(a, b, [1, 0], [0, 1], [0, 0], r), [
        `A phase portrait in which motion along the x-axis is ${sa > 0 ? "away from" : "toward"} the origin and motion along the y-axis is ${sb > 0 ? "away from" : "toward"} it.`,
        `相图中沿 x 轴的运动${sa > 0 ? "背离" : "指向"}原点，沿 y 轴的运动${sb > 0 ? "背离" : "指向"}原点。`,
      ]),
    );
  },
);

const rootsFromGraph = point(
  "characteristic-roots-from-a-solution-curve",
  ["Characteristic roots from a solution curve", "由解曲线读特征根"],
  [
    "A solution $e^{\\alpha t}\\cos(\\beta t)$ has complex characteristic roots $\\alpha \\pm \\beta i$. The envelope decides $\\alpha$: a shrinking wave means negative, a steady wave means zero and a growing wave means positive. The period $T$ between peaks decides $\\beta = 2\\pi / T$. A wave with period two has $\\beta = \\pi$, for instance, and if it shrinks its roots look like $-0.3 \\pm \\pi i$.\n\n> **Watch out.** $\\beta$ is $2\\pi$ divided by the period, not $\\pi$ divided by it, and a curve that crosses zero again and again can never come from real roots.",
    "解 $e^{\\alpha t}\\cos(\\beta t)$ 对应复特征根 $\\alpha \\pm \\beta i$。包络决定 $\\alpha$：波逐渐变小为负，稳定不变为零，逐渐变大为正。相邻波峰之间的周期 $T$ 决定 $\\beta = 2\\pi / T$。例如周期为二的波有 $\\beta = \\pi$；如果它逐渐变小，特征根形如 $-0.3 \\pm \\pi i$。\n\n> **注意。** $\\beta$ 是 $2\\pi$ 除以周期，而不是 $\\pi$ 除以周期；反复穿过零的曲线不可能来自实根。",
  ],
  (rng) => {
    const period = rng.pick([2, 3, 4]);
    const alpha = rng.pick([-0.4, -0.2, 0, 0.1]);
    const amp = rng.int(1, 3);
    const beta = (2 * Math.PI) / period;
    const betaTex = period === 2 ? "\\pi" : period === 4 ? "\\frac{\\pi}{2}" : "\\frac{2\\pi}{3}";
    const wrongBeta = period === 2 ? "2\\pi" : period === 4 ? "\\pi" : "\\frac{\\pi}{3}";
    const root = (a: number, b: string) => (a === 0 ? `r = \\pm ${b} i` : `r = ${a} \\pm ${b} i`);
    const envelope: Pair =
      alpha < 0
        ? ["shrinks, so $\\alpha$ is negative", "变小，所以 $\\alpha$ 为负"]
        : alpha > 0
          ? ["grows, so $\\alpha$ is positive", "变大，所以 $\\alpha$ 为正"]
          : ["keeps its size, so $\\alpha = 0$", "大小不变，所以 $\\alpha = 0$"];
    const betaLine = period === 3 ? `\\beta = \\frac{2\\pi}{3}` : `\\beta = \\frac{2\\pi}{${period}} = ${betaTex}`;
    const alphaWrong: Pair = [
      "The envelope sign is wrong: look at whether the peaks shrink, grow or stay level.",
      "包络的符号不对：看波峰是变小、变大还是不变。",
    ];
    return figureChoice(
      rng,
      [
        "The graph shows a solution of a second-order linear equation with constant coefficients. Which could be its characteristic roots?",
        "图中是某二阶常系数线性方程的一个解。它的特征根可能是什么？",
      ],
      same(root(alpha, betaTex)),
      [
        [same(root(-alpha === alpha ? 0.2 : -alpha, betaTex)), ...alphaWrong],
        [
          same(root(alpha, wrongBeta)),
          "That $\\beta$ does not match the period; $\\beta$ is $2\\pi$ divided by the time between peaks.",
          "这个 $\\beta$ 与周期不符；$\\beta$ 是 $2\\pi$ 除以相邻波峰的时间间隔。",
        ],
        [same(root(alpha === 0 ? -0.2 : 0, betaTex)), ...alphaWrong],
        [
          same(`r = ${alpha === 0 ? 1 : alpha}, \\; r = ${alpha === 0 ? -1 : 2 * alpha}`),
          "Real roots give sums of exponentials, which cross zero at most once; this curve keeps oscillating.",
          "实根给出指数函数之和，至多穿过零一次；这条曲线一直在振荡。",
        ],
      ],
      [
        stepOf(["Read the period", "读周期"], [`The peaks are $${period}$ apart:`, `波峰相距 $${period}$：`], betaLine),
        stepOf(["Read the envelope", "读包络"], [`The wave ${envelope[0]}.`, `波${envelope[1]}。`]),
      ],
      [
        `With roots $\\alpha \\pm ${betaTex} i$ the solution $e^{\\alpha t}\\cos(${betaTex} t)$ repeats every $\\frac{2\\pi}{\\beta} = ${period}$, matching the peaks.`,
        `特征根为 $\\alpha \\pm ${betaTex} i$ 时，解 $e^{\\alpha t}\\cos(${betaTex} t)$ 每隔 $\\frac{2\\pi}{\\beta} = ${period}$ 重复一次，与波峰一致。`,
      ],
      fig(
        { xMin: 0, xMax: 12, yMin: -5, yMax: 5, xName: "t" },
        [{ kind: "curve", f: (x) => amp * Math.exp(alpha * x) * Math.cos(beta * x), from: 0, to: 12, accent: true }],
        [
          `An oscillation with period ${period} that ${alpha < 0 ? "shrinks" : alpha > 0 ? "grows" : "keeps its size"} as t increases.`,
          `周期为 ${period} 的振荡，随 t 增大而${alpha < 0 ? "变小" : alpha > 0 ? "变大" : "大小不变"}。`,
        ],
      ),
    );
  },
);

const halfLifeFromGraph = {
  ...point(
    "half-life-from-a-decay-curve",
    ["Half-life from a decay curve", "由衰减曲线读半衰期"],
    [
      "Exponential decay halves the amount in equal steps of time, and that step is the half-life. On a graph, pick any point, read its height and find where the height has dropped to half. The same step works from any starting height, which is why the curve never reaches zero within a finite time. For example, a curve that starts at $8$ and is at $4$ when $t = 3$ has half-life $3$, and at $t = 9$ it is at $\\frac{8}{2^{3}} = 1$.\n\nCheck: from height $4$ at $t = 3$ the curve reaches $2$ at $t = 6$, again a step of $3$.\n\n> **Watch out.** The half-life is a time, read on the horizontal axis, not the height $\\frac{8}{2} = 4$.",
      "指数衰减在相等的时间步内使数量减半，这个步长就是半衰期。在图上任取一点，读出高度，再找高度降到一半的地方。从任何高度出发，步长都相同，所以曲线在有限时间内永远到不了零。例如曲线从 $8$ 开始，$t = 3$ 时为 $4$，半衰期就是 $3$；在 $t = 9$ 时它为 $\\frac{8}{2^{3}} = 1$。\n\n检验：从 $t = 3$ 时的高度 $4$ 出发，曲线在 $t = 6$ 时到达 $2$，步长仍是 $3$。\n\n> **注意。** 半衰期是时间，要在横轴上读，而不是高度 $\\frac{8}{2} = 4$。",
    ],
    (rng) => {
      const A = rng.pick([4, 6, 8]);
      const h = rng.int(1, 4);
      const asksHalfLife = rng.bool();
      const times = rng.int(2, 4);
      const f = (x: number) => A * 2 ** (-x / h);
      const after = Q.of(A, 2 ** times);
      const figure = fig(
        { xMin: 0, xMax: 9, yMin: 0, yMax: 9, xName: "t" },
        [{ kind: "curve", f, from: 0, to: 9, accent: true }],
        [`A decay curve that starts at ${A} and halves every ${h} units of time.`, `从 ${A} 开始、每 ${h} 个时间单位减半的衰减曲线。`],
      );
      const readHalf = stepOf(
        ["Read the half-life", "读出半衰期"],
        [
          `The curve starts at $${A}$ and reaches half of it, $${A / 2}$, at $t = ${h}$, so the half-life is $${h}$.`,
          `曲线从 $${A}$ 开始，在 $t = ${h}$ 时降到它的一半 $${A / 2}$，所以半衰期是 $${h}$。`,
        ],
      );
      if (asksHalfLife)
        return figureNumber(
          [
            "The curve shows an amount that decays exponentially with time. What is its half-life?",
            "曲线表示随时间指数衰减的数量。它的半衰期是多少？",
          ],
          h,
          [
            stepOf(["Read the start", "读出起始值"], [`At $t = 0$ the amount is $${A}$.`, `$t = 0$ 时数量是 $${A}$。`]),
            stepOf(
              ["Find where it has halved", "找减半的位置"],
              [
                `The height $${A / 2}$ is reached at $t = ${h}$, so the half-life is $${h}$.`,
                `高度 $${A / 2}$ 在 $t = ${h}$ 时到达，所以半衰期是 $${h}$。`,
              ],
            ),
          ],
          [
            `Start from another point: from height $${A / 2}$ at $t = ${h}$ the curve reaches $${Q.of(A, 4).toLatex()}$ at $t = ${2 * h}$, again a step of $${h}$.`,
            `换一个起点：从 $t = ${h}$ 时的高度 $${A / 2}$ 出发，曲线在 $t = ${2 * h}$ 时到达 $${Q.of(A, 4).toLatex()}$，步长仍是 $${h}$。`,
          ],
          [
            [A, `$${A}$ is the starting amount, a height; the half-life is a time`, `$${A}$ 是起始数量，是高度；半衰期是时间`],
            [
              2 * h,
              `At $t = ${2 * h}$ the amount is down to a quarter, $${Q.of(A, 4).toLatex()}$: that is two half-lives`,
              `在 $t = ${2 * h}$ 时数量已降到四分之一 $${Q.of(A, 4).toLatex()}$：那是两个半衰期`,
            ],
            [
              A / 2,
              `$${A / 2}$ is the amount after one half-life, a height, not the time it takes`,
              `$${A / 2}$ 是经过一个半衰期后的数量，是高度，不是所用的时间`,
            ],
          ],
          figure,
        );
      const chain = Array.from({ length: times + 1 }, (_, i) => Q.of(A, 2 ** i).toLatex()).join(" \\to ");
      const at = Array.from({ length: times + 1 }, (_, i) => `${i * h}`).join(", ");
      return figureNumber(
        [
          `The curve shows an amount that decays exponentially with time. What is the amount at time $t = ${times * h}$?`,
          `曲线表示随时间指数衰减的数量。在 $t = ${times * h}$ 时数量是多少？`,
        ],
        after,
        [
          readHalf,
          stepOf(
            ["Count the halvings", "数减半的次数"],
            [
              `Time $${times * h}$ is $\\frac{${times * h}}{${h}} = ${times}$ half-lives:`,
              `时间 $${times * h}$ 是 $\\frac{${times * h}}{${h}} = ${times}$ 个半衰期：`,
            ],
            `\\frac{${A}}{2^{${times}}} = ${after.toLatex()}`,
          ),
        ],
        [`Halve step by step: $${chain}$ at $t = ${at}$.`, `逐次减半：在 $t = ${at}$ 时依次为 $${chain}$。`],
        [
          [
            Q.of(A, 2 * times),
            `This divides by $2 \\cdot ${times}$; ${times} halvings divide by $2^{${times}}$`,
            `这里除以了 $2 \\cdot ${times}$；减半 ${times} 次应除以 $2^{${times}}$`,
          ],
          [
            Q.of(A, 2 ** (times - 1)),
            `One halving too few: time $${times * h}$ is $${times}$ half-lives`,
            `少减半了一次：时间 $${times * h}$ 是 $${times}$ 个半衰期`,
          ],
          [
            Q.of(A, times),
            `This divides by the number of half-lives instead of halving $${times}$ times`,
            `这里除以了半衰期的个数，而不是减半 $${times}$ 次`,
          ],
        ],
        figure,
      );
    },
  ),
  figure: calculusDrawings5["exponential-growth-and-decay-models-with-first-order-odes-half-life-problems#half-life-from-a-decay-curve"],
};

const pulseLaplace = point(
  "the-laplace-transform-of-a-drawn-pulse",
  ["The Laplace transform of a drawn pulse", "图中脉冲的拉普拉斯变换"],
  [
    "A rectangular pulse of height $h$ from $t = a$ to $t = b$ equals $h$ times $u(t - a) - u(t - b)$, where $u$ is the unit step. By the second shifting theorem, each step transforms to an exponential over $s$. So the transform is $h(e^{-as} - e^{-bs})/s$, with the turn-on time first and the turn-off time second.\n\n> **Watch out.** The height multiplies the transform; the width enters only through the two delays. A pulse of height $2$ from $t = 1$ to $t = 4$ transforms to $\\frac{2\\left(e^{-s} - e^{-4s}\\right)}{s}$, not $\\frac{3\\left(e^{-s} - e^{-4s}\\right)}{s}$.",
    "高度为 $h$、从 $t = a$ 到 $t = b$ 的矩形脉冲等于 $h$ 乘以 $u(t - a) - u(t - b)$，其中 $u$ 是单位阶跃函数。由第二平移定理，每个阶跃变换为指数除以 $s$。所以变换是 $h(e^{-as} - e^{-bs})/s$，先是开启时刻，后是关闭时刻。\n\n> **注意。** 高度乘在变换前面；宽度只通过两个延迟出现。高度为 $2$、从 $t = 1$ 到 $t = 4$ 的脉冲，变换为 $\\frac{2\\left(e^{-s} - e^{-4s}\\right)}{s}$，不是 $\\frac{3\\left(e^{-s} - e^{-4s}\\right)}{s}$。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = a + rng.int(1, 4);
    const h = rng.int(1, 5);
    const e = (c: number) => (c === 1 ? "e^{-s}" : `e^{-${c}s}`);
    const form = (k: number, x: number, y: number) => `\\frac{${k === 1 ? "" : k}\\left(${e(x)} - ${e(y)}\\right)}{s}`;
    const hh = h === 1 ? "" : `${h}`;
    const wrong: [Pair, string, string][] = [
      [
        same(form(h, b, a)),
        "That puts the turn-off time first; the pulse switches on at the earlier time, which gives the positive term.",
        "这把关闭时刻放在前面；脉冲在较早的时刻开启，那一项带正号。",
      ],
      [
        same(`\\frac{${hh}${e(a)}}{s}`),
        "That is a step that never switches off; the pulse also needs the step that turns it off.",
        "这是一个从不关闭的阶跃；脉冲还需要使它关闭的那个阶跃。",
      ],
      [
        same(`\\frac{${hh}\\left(${e(a)} - ${e(b)}\\right)}{s^2}`),
        "That has $s^2$, the denominator for a ramp; a step transforms to an exponential over $s$.",
        "这里是 $s^2$，那是斜坡函数的分母；阶跃变换为指数除以 $s$。",
      ],
    ];
    if (b - a !== h)
      wrong.push([
        same(form(b - a, a, b)),
        "That multiplies by the width of the pulse; the factor in front is its height.",
        "这乘的是脉冲的宽度；前面的因子应是它的高度。",
      ]);
    return figureChoice(
      rng,
      [
        "The graph shows a pulse $f(t)$, which is zero outside the part drawn above the axis. What is its Laplace transform?",
        "图中是脉冲 $f(t)$，它在轴上方所画部分之外为零。它的拉普拉斯变换是什么？",
      ],
      same(form(h, a, b)),
      wrong,
      [
        stepOf(
          ["Read the pulse", "读出脉冲"],
          [
            `The pulse has height $${h}$, turns on at $t = ${a}$ and turns off at $t = ${b}$.`,
            `脉冲高度为 $${h}$，在 $t = ${a}$ 开启，在 $t = ${b}$ 关闭。`,
          ],
          `f(t) = ${hh}\\left(u(t - ${a}) - u(t - ${b})\\right)`,
        ),
        stepOf(
          ["Transform each step", "变换每个阶跃"],
          [
            "By the second shifting theorem, $\\mathcal{L}\\{u(t - c)\\} = \\frac{e^{-cs}}{s}$:",
            "由第二平移定理，$\\mathcal{L}\\{u(t - c)\\} = \\frac{e^{-cs}}{s}$：",
          ],
          `F(s) = ${form(h, a, b)}`,
        ),
      ],
      [
        `As $s \\to 0$, $${e(a)} - ${e(b)} \\approx ${b - a === 1 ? "" : b - a}s$, so $F(s) \\to ${h} \\cdot ${b - a} = ${h * (b - a)}$, the area of the pulse, as $\\int_0^\\infty f(t)\\,dt$ requires.`,
        `当 $s \\to 0$ 时 $${e(a)} - ${e(b)} \\approx ${b - a === 1 ? "" : b - a}s$，所以 $F(s) \\to ${h} \\cdot ${b - a} = ${h * (b - a)}$，正是脉冲的面积，与 $\\int_0^\\infty f(t)\\,dt$ 一致。`,
      ],
      fig(
        { xMin: 0, xMax: 9, yMin: 0, yMax: 6, xName: "t", yName: "f" },
        [
          { kind: "segment", a: [0, 0], b: [a, 0], accent: true },
          { kind: "segment", a: [a, h], b: [b, h], accent: true },
          { kind: "segment", a: [b, 0], b: [9, 0], accent: true },
          { kind: "segment", a: [a, 0], b: [a, h], dashed: true },
          { kind: "segment", a: [b, 0], b: [b, h], dashed: true },
        ],
        [`A rectangular pulse of height ${h} from t = ${a} to t = ${b}.`, `高度为 ${h}、从 t = ${a} 到 t = ${b} 的矩形脉冲。`],
      ),
    );
  },
);

/** wave lists the kinds of periodic graphs with their symmetry. */
function wave(kind: string, period: number, amp: number): PlaneMark[] {
  const half = period / 2;
  const marks: PlaneMark[] = [];
  const reps = Math.ceil(9 / period) + 1;
  for (let j = -reps; j <= reps; j++) {
    const c = j * period;
    if (kind === "oddSquare") {
      marks.push(
        { kind: "segment", a: [c, amp], b: [c + half, amp], accent: true },
        { kind: "segment", a: [c + half, -amp], b: [c + period, -amp], accent: true },
      );
    } else if (kind === "evenTriangle") {
      marks.push(
        { kind: "segment", a: [c, amp], b: [c + half, -amp], accent: true },
        { kind: "segment", a: [c + half, -amp], b: [c + period, amp], accent: true },
      );
    } else if (kind === "oddSaw") {
      marks.push({ kind: "segment", a: [c - half, -amp], b: [c + half, amp], accent: true });
    } else {
      marks.push(
        { kind: "segment", a: [c, 0], b: [c + half, amp], accent: true },
        { kind: "segment", a: [c + half, 0], b: [c + period, 0], accent: true },
      );
    }
  }
  return marks;
}

const symmetryOfWave = {
  ...point(
    "which-fourier-terms-a-drawn-wave-needs",
    ["Which Fourier terms a drawn wave needs", "图中的波需要哪些傅里叶项"],
    [
      "The symmetry of a graph decides which Fourier terms it needs. An odd function, with rotation symmetry about the origin, needs only sine terms. An even function, with mirror symmetry in the vertical axis, needs only cosine terms and perhaps a constant. A wave with neither symmetry needs both kinds of terms.",
      "图的对称性决定需要哪些傅里叶项。奇函数关于原点旋转对称，只需要正弦项。偶函数关于纵轴镜像对称，只需要余弦项，可能还有常数。两种对称都没有的波，两类项都需要。",
    ],
    (rng) => {
      const kind = rng.pick(["oddSquare", "evenTriangle", "oddSaw", "neither"] as const);
      const period = rng.pick([2, 4, 6]);
      const amp = rng.int(1, 3);
      const options: Record<string, Pair> = {
        odd: ["sine terms only", "只有正弦项"],
        even: ["cosine terms only, with no constant term", "只有余弦项，没有常数项"],
        both: ["both sine and cosine terms", "正弦项和余弦项都有"],
        none: ["a constant term only", "只有常数项"],
      };
      const right = kind === "oddSquare" || kind === "oddSaw" ? options.odd : kind === "evenTriangle" ? options.even : options.both;
      const reason: Pair =
        kind === "evenTriangle"
          ? [
              "The graph is a mirror image in the vertical axis, and it spends equal time above and below the axis",
              "图关于纵轴镜像对称，并且在轴上方和下方的部分相等",
            ]
          : kind === "neither"
            ? [
                "The graph is not a mirror image in the vertical axis and has no rotation symmetry about the origin",
                "图既不关于纵轴镜像对称，也不关于原点旋转对称",
              ]
            : ["The graph has rotation symmetry about the origin", "图关于原点旋转对称"];
      return choose(
        rng,
        ["Which terms appear in the Fourier series of the periodic function drawn?", "图中周期函数的傅里叶级数含有哪些项？"],
        right as Pair,
        [options.odd as Pair, options.even as Pair, options.both as Pair, options.none as Pair],
        [`${reason[0]}, so the series has ${(right as Pair)[0]}.`, `${reason[1]}，所以级数${(right as Pair)[1]}。`],
        fig({ xMin: -8, xMax: 8, yMin: -4, yMax: 4 }, wave(kind, period, amp), [
          `A periodic graph with period ${period} and height ${amp}. ${reason[0]}.`,
          `周期为 ${period}、高度为 ${amp} 的周期函数图。${reason[1]}。`,
        ]),
      );
    },
  ),
  figure: differentialEquationsDrawings1["properties-of-fourier-series#which-fourier-terms-a-drawn-wave-needs"],
};

/** deeperFiguresDifferentialEquationsPoints adds knowledge points of Differential Equations that are answered by reading a drawing. */
export const deeperFiguresDifferentialEquationsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "classifying-equilibrium-solutions-of-first-order-odes": [stableFromGraph],
  "phase-lines-of-first-order-odes": [limitFromPhaseLine],
  "slope-fields-for-autonomous-differential-equations": [autonomousField],
  "slope-fields-for-directly-integrable-differential-equations": [integrableField],
  "analyzing-slope-fields-for-autonomous-differential-equations": [limitFromField],
  "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues": [classifyRealPortrait],
  "phase-portraits-for-linear-systems-with-complex-eigenvalues": [classifySpiral],
  "shifted-systems-of-odes": [equilibriumOfShifted],
  "phase-portraits-for-decoupled-linear-systems": [decoupledSigns],
  "second-order-homogeneous-odes-characteristic-equations-with-complex-roots": [rootsFromGraph],
  "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems": [halfLifeFromGraph],
  "the-second-shifting-theorem-of-laplace-transforms": [pulseLaplace],
  "properties-of-fourier-series": [symmetryOfWave],
};
