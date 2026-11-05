// Knowledge points of Differential Equations that ask the learner to read a drawing: slope fields, phase lines,
// phase portraits and solution curves. See `deeperFiguresDifferentialEquationsPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
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

const stableFromGraph = point(
  "stability-from-the-graph-of-the-right-side",
  ["Stability from the graph of the right side", "由右端函数的图判断稳定性"],
  [
    "For an autonomous equation $y' = f(y)$, equilibria are the zeros of $f$. Where the graph of $f$ crosses the axis going from positive to negative, solutions on both sides move toward the equilibrium, so it is stable. Where the graph crosses from negative to positive, solutions move away, so it is unstable.",
    "对自治方程 $y' = f(y)$，平衡点是 $f$ 的零点。$f$ 的图从正到负穿过轴的地方，两侧的解都向平衡点移动，所以它稳定。图从负到正穿过轴的地方，解向外移动，所以它不稳定。",
  ],
  (rng) => {
    const a = rng.int(-4, 1);
    const b = a + rng.int(1, 4);
    const up = rng.bool();
    const shrink = rng.pick([1, 0.5]);
    const f = (y: number) => (up ? 1 : -1) * shrink * (y - a) * (y - b);
    const stable = up ? a : b;
    const unstable = up ? b : a;
    return ask(
      [
        "The graph shows $f(y)$ for the autonomous equation $y' = f(y)$. At which value of $y$ is there a stable equilibrium?",
        "图中是自治方程 $y' = f(y)$ 的 $f(y)$。在 $y$ 的哪个值处有稳定平衡点？",
      ],
      stable,
      [unstable, (a + b) % 2 === 0 ? (a + b) / 2 : stable + 5, Math.abs(stable)],
      [
        `The graph crosses the axis at $y = ${a}$ and $y = ${b}$. At $y = ${stable}$ it goes from positive to negative, so solutions on both sides move toward it and it is stable.`,
        `图在 $y = ${a}$ 和 $y = ${b}$ 处穿过轴。在 $y = ${stable}$ 处它从正变负，两侧的解都向它移动，所以它稳定。`,
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
);

const limitFromPhaseLine = point(
  "the-long-run-value-from-a-phase-line",
  ["The long-run value from a phase line", "由相线读长期值"],
  [
    "A phase line marks the equilibria of an autonomous equation and shows by arrows which way solutions move between them. A solution starting between two equilibria moves in the direction of the arrow on that interval and tends to the equilibrium the arrow points to. The starting value decides only which interval applies.",
    "相线标出自治方程的平衡点，并用箭头表示解在它们之间的移动方向。从两个平衡点之间出发的解，沿该区间上箭头的方向移动，趋向箭头所指的平衡点。初值只决定适用哪个区间。",
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
    return ask(
      [
        `The phase line of an autonomous equation is drawn, with dots at the equilibria. If $y(0) = ${y0}$, what is $\\lim_{t \\to \\infty} y(t)$?`,
        `图中是某自治方程的相线，点表示平衡点。若 $y(0) = ${y0}$，$\\lim_{t \\to \\infty} y(t)$ 是多少？`,
      ],
      answer,
      [other, y0, e2 === answer ? e1 : e2, e3 === answer ? e1 : e3].filter((v) => v !== answer),
      [
        `The value $${y0}$ lies in an interval whose arrow points ${goesRight ? "right" : "left"}, so the solution moves ${goesRight ? "up" : "down"} toward the equilibrium at $${answer}$ and never reaches past it.`,
        `值 $${y0}$ 所在区间的箭头指向${goesRight ? "右" : "左"}，所以解${goesRight ? "增大" : "减小"}并趋向 $${answer}$ 处的平衡点，不会越过它。`,
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

const autonomousField = point(
  "the-equation-of-an-autonomous-slope-field",
  ["The equation of an autonomous slope field", "自治斜率场的方程"],
  [
    "In the slope field of an autonomous equation, every segment in a horizontal row has the same slope, because the slope depends only on $y$. So look for the rows with flat segments, which are the equilibria, then read the sign of the slopes between them. These two facts usually leave only one candidate equation.",
    "在自治方程的斜率场中，同一水平行上的线段斜率相同，因为斜率只取决于 $y$。所以先找线段水平的行，它们就是平衡点，再读它们之间斜率的符号。这两点通常只留下一个候选方程。",
  ],
  (rng) => {
    const right = rng.pick(autonomousCases);
    return choose(
      rng,
      ["Which equation has the slope field drawn?", "哪个方程具有图中的斜率场？"],
      same(`y' = ${right.tex}`),
      rng
        .sample(
          autonomousCases.filter((c) => c !== right),
          3,
        )
        .map((c) => same(`y' = ${c.tex}`)),
      [
        `In the field, ${right.clue[0]}, and this holds along every row, which matches $y' = ${right.tex}$.`,
        `场中${right.clue[1]}，每一行都如此，与 $y' = ${right.tex}$ 相符。`,
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

const integrableField = point(
  "the-equation-of-a-directly-integrable-field",
  ["The equation of a directly integrable field", "可直接积分的斜率场的方程"],
  [
    "When $y' = f(x)$, the slope depends only on $x$, so every segment in a vertical column has the same slope, and solution curves are vertical translates of one another. Find the column where the segments are flat, which is where $f$ is zero, and then read whether $f$ changes sign there.",
    "当 $y' = f(x)$ 时，斜率只取决于 $x$，所以同一竖直列上的线段斜率相同，解曲线彼此是竖直平移。先找线段水平的那一列，那里 $f$ 为零，再读 $f$ 在那里是否变号。",
  ],
  (rng) => {
    const right = rng.pick(integrableCases);
    return choose(
      rng,
      ["Which equation has the slope field drawn?", "哪个方程具有图中的斜率场？"],
      same(`y' = ${right.tex}`),
      rng
        .sample(
          integrableCases.filter((c) => c !== right),
          3,
        )
        .map((c) => same(`y' = ${c.tex}`)),
      [
        `The segments are ${right.clue[0]}, and each column has one slope, which matches $y' = ${right.tex}$.`,
        `线段${right.clue[1]}，每列只有一种斜率，与 $y' = ${right.tex}$ 相符。`,
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
);

const limitFromField = point(
  "where-a-solution-goes-in-a-slope-field",
  ["Where a solution goes in a slope field", "斜率场中的解趋向何处"],
  [
    "To follow a solution through a slope field, start at the given point and move to the right along the segments. In an autonomous field the solution cannot cross a row of flat segments, so it either approaches one of these rows or leaves the picture. Slopes pointing toward a flat row mean that the row attracts the solution.",
    "要在斜率场中跟踪一个解，就从给定点出发沿线段向右移动。在自治场中，解不能穿过线段水平的行，所以要么趋近这样的一行，要么离开图形。指向水平行的斜率说明这一行吸引解。",
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
    return ask(
      [
        "The slope field is that of an autonomous equation. What is $\\lim_{x \\to \\infty} y(x)$ for the solution through $P$?",
        "这是某自治方程的斜率场。过 $P$ 的解的 $\\lim_{x \\to \\infty} y(x)$ 是多少？",
      ],
      target,
      single ? [y0, c + 2, -c === c ? c - 2 : -c] : [a, y0 === Math.floor(y0) ? y0 : a - 1, b + 2],
      [
        `The row at height $${target}$ has flat segments, and the segments near $P$ lean toward it, so the solution through $P$ approaches that row and never crosses it.`,
        `高度 $${target}$ 的行线段水平，$P$ 附近的线段都倾向这一行，所以过 $P$ 的解趋近这一行且不穿过它。`,
      ],
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
    "With two real eigenvalues, a phase portrait has straight lines along the eigenvectors. Arrows pointing inward on both lines mean both eigenvalues are negative, which makes a stable node. Arrows outward on both mean an unstable node. Arrows inward on one line and outward on the other mean eigenvalues of opposite sign, which makes a saddle.",
    "有两个实特征值时，相图沿特征向量有直线。两条直线上的箭头都向内，说明两个特征值都为负，这是稳定结点。都向外是不稳定结点。一条向内一条向外，说明特征值异号，这是鞍点。",
  ],
  (rng) => {
    const type = rng.pick(realPortraits);
    const [u, w] = rng.pick(eigenDirections);
    return choose(
      rng,
      [
        "The phase portrait of a linear system is drawn, with arrows for increasing time. What kind of equilibrium is at the origin?",
        "图中是某线性方程组的相图，箭头表示时间增加的方向。原点是哪种平衡点？",
      ],
      type.name,
      allTypes,
      [`${type.why[0]}, which makes the origin ${type.name[0]}.`, `${type.why[1]}，所以原点是${type.name[1]}。`],
      fig(square(4), portrait(type.l1, type.l2, u, w, [0, 0], 4), [`A phase portrait. ${type.why[0]}.`, `一个相图。${type.why[1]}。`]),
    );
  },
);

const classifySpiral = point(
  "classifying-a-drawn-spiral",
  ["Classifying a drawn spiral", "判断图中的螺旋"],
  [
    "With complex eigenvalues $\\alpha \\pm \\beta i$, trajectories turn around the equilibrium. The real part decides the size: inward spirals mean $\\alpha$ is negative, outward spirals mean it is positive, and closed loops mean it is zero. The direction of turning is a separate fact, which is read from the arrows rather than from the eigenvalues alone.",
    "特征值为复数 $\\alpha \\pm \\beta i$ 时，轨线绕平衡点旋转。实部决定大小：向内螺旋说明 $\\alpha$ 为负，向外螺旋说明为正，闭合回路说明为零。旋转方向是另一回事，要从箭头读出，不能只看特征值。",
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
    return choose(
      rng,
      [
        "One trajectory of a linear system is drawn, with arrows for increasing time. What is the equilibrium at the origin?",
        "图中是某线性方程组的一条轨线，箭头表示时间增加的方向。原点是什么平衡点？",
      ],
      correct,
      rng.shuffle(all.filter((o) => o !== correct)),
      [
        `The trajectory ${shape[0]} and its arrows run ${turn[0]}, which describes ${correct[0].replace(", turning", " turning")}.`,
        `轨线${shape[1]}，箭头沿${turn[1]}方向，所以是${correct[1]}。`,
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
    "A shifted system has the same phase portrait as a linear system, moved so that its center sits at the equilibrium. In the equations, this point appears as a constant term: the system $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ has its equilibrium at $\\mathbf{c}$. So the drawing gives the shift by the place where the trajectories meet.",
    "平移方程组的相图与线性方程组相同，只是移动到以平衡点为中心。在方程中，这个点表现为常数项：方程组 $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ 的平衡点是 $\\mathbf{c}$。所以轨线交汇的地方给出平移量。",
  ],
  (rng) => {
    const [h, k] = [rng.nonZero(-3, 3), rng.nonZero(-3, 3)];
    const type = rng.pick(realPortraits);
    const [u, w] = rng.pick(eigenDirections);
    const eq = (x: number, y: number) => `\\mathbf{x}' = A\\left(\\mathbf{x} - \\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}\\right)`;
    return choose(
      rng,
      [
        "The phase portrait of a system $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ is drawn. Which form has the correct $\\mathbf{c}$?",
        "图中是方程组 $\\mathbf{x}' = A(\\mathbf{x} - \\mathbf{c})$ 的相图。哪个形式的 $\\mathbf{c}$ 正确？",
      ],
      same(eq(h, k)),
      [same(eq(k, h)), same(eq(-h, -k)), same(eq(h, -k)), same(eq(-h, k))],
      [
        `All the trajectories meet at $(${h}, ${k})$, so that is the equilibrium, and it is the value of $\\mathbf{c}$ because the right side vanishes exactly at $\\mathbf{x} = \\mathbf{c}$.`,
        `所有轨线都在 $(${h}, ${k})$ 交汇，所以它是平衡点，也就是 $\\mathbf{c}$ 的值，因为右端恰好在 $\\mathbf{x} = \\mathbf{c}$ 时为零。`,
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
    "In the decoupled system $x' = ax$, $y' = by$, the axes are trajectories. The sign of $a$ shows on the $x$-axis: positive means motion away from the origin along it. The sign of $b$ shows on the $y$-axis in the same way. Reading the two axes separately gives both signs with no calculation.",
    "在解耦方程组 $x' = ax$，$y' = by$ 中，坐标轴本身就是轨线。$a$ 的符号在 $x$ 轴上表现：为正表示沿它远离原点。$b$ 的符号同样在 $y$ 轴上表现。分别读两条轴，不用计算就得到两个符号。",
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
    return choose(
      rng,
      [
        "The phase portrait of a decoupled system is drawn, with arrows for increasing time. Which system could it be?",
        "图中是某解耦方程组的相图，箭头表示时间增加的方向。它可能是哪个方程组？",
      ],
      same(tex(a, b)),
      [same(tex(-a, b)), same(tex(a, -b)), same(tex(-a, -b))],
      [
        `Along the $x$-axis the arrows point ${sa > 0 ? "away from" : "toward"} the origin, so $a$ is ${sa > 0 ? "positive" : "negative"}. Along the $y$-axis they point ${sb > 0 ? "away from" : "toward"} it, so $b$ is ${sb > 0 ? "positive" : "negative"}.`,
        `沿 $x$ 轴箭头${sa > 0 ? "背离" : "指向"}原点，所以 $a$ 为${sa > 0 ? "正" : "负"}。沿 $y$ 轴箭头${sb > 0 ? "背离" : "指向"}原点，所以 $b$ 为${sb > 0 ? "正" : "负"}。`,
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
    "A solution $e^{\\alpha t}\\cos(\\beta t)$ has complex characteristic roots $\\alpha \\pm \\beta i$. The envelope decides $\\alpha$: a shrinking wave means negative, a steady wave means zero and a growing wave means positive. The period $T$ between peaks decides $\\beta = 2\\pi / T$. A wave with period two has $\\beta = \\pi$, for instance.",
    "解 $e^{\\alpha t}\\cos(\\beta t)$ 对应复特征根 $\\alpha \\pm \\beta i$。包络决定 $\\alpha$：波逐渐变小为负，稳定不变为零，逐渐变大为正。相邻波峰之间的周期 $T$ 决定 $\\beta = 2\\pi / T$。例如周期为二的波有 $\\beta = \\pi$。",
  ],
  (rng) => {
    const period = rng.pick([2, 3, 4]);
    const alpha = rng.pick([-0.4, -0.2, 0, 0.1]);
    const amp = rng.int(1, 3);
    const beta = (2 * Math.PI) / period;
    const betaTex = period === 2 ? "\\pi" : period === 4 ? "\\frac{\\pi}{2}" : "\\frac{2\\pi}{3}";
    const wrongBeta = period === 2 ? "2\\pi" : period === 4 ? "\\pi" : "\\frac{\\pi}{3}";
    const root = (a: number, b: string) => (a === 0 ? `r = \\pm ${b} i` : `r = ${a} \\pm ${b} i`);
    return choose(
      rng,
      [
        "The graph shows a solution of a second-order linear equation with constant coefficients. Which could be its characteristic roots?",
        "图中是某二阶常系数线性方程的一个解。它的特征根可能是什么？",
      ],
      same(root(alpha, betaTex)),
      [
        same(root(-alpha === alpha ? 0.2 : -alpha, betaTex)),
        same(root(alpha, wrongBeta)),
        same(root(alpha === 0 ? -0.2 : 0, betaTex)),
        same(`r = ${alpha === 0 ? 1 : alpha}, \\; r = ${alpha === 0 ? -1 : 2 * alpha}`),
      ],
      [
        `The peaks are $${period}$ apart, so $\\beta = ${period === 3 ? betaTex : `\\frac{2\\pi}{${period}} = ${betaTex}`}$. The wave ${alpha < 0 ? "shrinks, so $\\alpha$ is negative" : alpha > 0 ? "grows, so $\\alpha$ is positive" : "keeps its size, so $\\alpha = 0$"}.`,
        `波峰相距 $${period}$，所以 $\\beta = ${period === 3 ? betaTex : `\\frac{2\\pi}{${period}} = ${betaTex}`}$。波${alpha < 0 ? "变小，所以 $\\alpha$ 为负" : alpha > 0 ? "变大，所以 $\\alpha$ 为正" : "大小不变，所以 $\\alpha = 0$"}。`,
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

const halfLifeFromGraph = point(
  "half-life-from-a-decay-curve",
  ["Half-life from a decay curve", "由衰减曲线读半衰期"],
  [
    "Exponential decay halves the amount in equal steps of time, and that step is the half-life. On a graph, pick any point, read its height and find where the height has dropped to half. The same step works from any starting height, which is why the curve never reaches zero within a finite time.",
    "指数衰减在相等的时间步内使数量减半，这个步长就是半衰期。在图上任取一点，读出高度，再找高度降到一半的地方。从任何高度出发，步长都相同，所以曲线在有限时间内永远到不了零。",
  ],
  (rng) => {
    const A = rng.pick([4, 6, 8]);
    const h = rng.int(1, 4);
    const asksHalfLife = rng.bool();
    const times = rng.int(2, 4);
    const f = (x: number) => A * 2 ** (-x / h);
    const after = Q.of(A, 2 ** times);
    return ask(
      asksHalfLife
        ? [
            "The curve shows an amount that decays exponentially with time. What is its half-life?",
            "曲线表示随时间指数衰减的数量。它的半衰期是多少？",
          ]
        : [
            `The curve shows an amount that decays exponentially with time. What is the amount at time $t = ${times * h}$?`,
            `曲线表示随时间指数衰减的数量。在 $t = ${times * h}$ 时数量是多少？`,
          ],
      asksHalfLife ? h : after,
      asksHalfLife ? [A, 2 * h, A / 2] : [Q.of(A, 2 * times), Q.of(A, 2 ** (times - 1)), Q.of(A, times)],
      asksHalfLife
        ? [
            `The amount starts at $${A}$ and reaches $${A / 2}$ at time $${h}$, so the half-life is $${h}$.`,
            `数量从 $${A}$ 开始，在时间 $${h}$ 降到 $${A / 2}$，所以半衰期是 $${h}$。`,
          ]
        : [
            `The amount starts at $${A}$ and halves every $${h}$, as the graph shows. Time $${times * h}$ is $${times}$ halvings, which leaves $${after.toLatex()}$.`,
            `数量从 $${A}$ 开始，由图可知每过 $${h}$ 减半。时间 $${times * h}$ 是减半 $${times}$ 次，剩下 $${after.toLatex()}$。`,
          ],
      fig(
        { xMin: 0, xMax: 9, yMin: 0, yMax: 9, xName: "t" },
        [{ kind: "curve", f, from: 0, to: 9, accent: true }],
        [`A decay curve that starts at ${A} and halves every ${h} units of time.`, `从 ${A} 开始、每 ${h} 个时间单位减半的衰减曲线。`],
      ),
    );
  },
);

const pulseLaplace = point(
  "the-laplace-transform-of-a-drawn-pulse",
  ["The Laplace transform of a drawn pulse", "图中脉冲的拉普拉斯变换"],
  [
    "A rectangular pulse of height $h$ from $t = a$ to $t = b$ equals $h$ times $u(t - a) - u(t - b)$, where $u$ is the unit step. By the second shifting theorem, each step transforms to an exponential over $s$. So the transform is $h(e^{-as} - e^{-bs})/s$, with the turn-on time first and the turn-off time second.",
    "高度为 $h$、从 $t = a$ 到 $t = b$ 的矩形脉冲等于 $h$ 乘以 $u(t - a) - u(t - b)$，其中 $u$ 是单位阶跃函数。由第二平移定理，每个阶跃变换为指数除以 $s$。所以变换是 $h(e^{-as} - e^{-bs})/s$，先是开启时刻，后是关闭时刻。",
  ],
  (rng) => {
    const a = rng.int(1, 4);
    const b = a + rng.int(1, 4);
    const h = rng.int(1, 5);
    const e = (c: number) => (c === 1 ? "e^{-s}" : `e^{-${c}s}`);
    const form = (k: number, x: number, y: number) => `\\frac{${k === 1 ? "" : k}\\left(${e(x)} - ${e(y)}\\right)}{s}`;
    return choose(
      rng,
      [
        "The graph shows a pulse $f(t)$, which is zero outside the part drawn above the axis. What is its Laplace transform?",
        "图中是脉冲 $f(t)$，它在轴上方所画部分之外为零。它的拉普拉斯变换是什么？",
      ],
      same(form(h, a, b)),
      [
        same(form(h, b, a)),
        same(form(b - a, a, b)),
        same(`\\frac{${h === 1 ? "" : h}${e(a)}}{s}`),
        same(`\\frac{${h === 1 ? "" : h}\\left(${e(a)} - ${e(b)}\\right)}{s^2}`),
      ],
      [
        `The pulse has height $${h}$, turns on at $t = ${a}$ and turns off at $t = ${b}$. So it is $${h}$ times $u(t - ${a}) - u(t - ${b})$, and each step transforms to an exponential over $s$.`,
        `脉冲高度为 $${h}$，在 $t = ${a}$ 开启，在 $t = ${b}$ 关闭。所以它是 $u(t - ${a}) - u(t - ${b})$ 的 $${h}$ 倍，每个阶跃变换为指数除以 $s$。`,
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

const symmetryOfWave = point(
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
);

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
