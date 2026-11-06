// Knowledge points of Complex Analysis that ask the learner to read a drawing: points of the Argand plane,
// contours, winding numbers and images of regions. See `deeperFiguresComplexAnalysisPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd } from "@ga/subject-math";
import { complexDrawings1 } from "../explanation-drawings-complex-analysis-1.ts";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { drawn } from "./figure-reading-more.ts";

/** argand is the complex plane from -r to r on both axes. */
const argand = (r: number): PlaneView => ({ xMin: -r, xMax: r, yMin: -r, yMax: r, labelEvery: r > 6 ? 2 : 1, xName: "Re", yName: "Im" });

/** fig wraps marks in a figure with its description in both languages. */
const fig = (view: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(view, marks, t(en, zh));

/** cx writes the complex number a + bi. */
function cx(a: number, b: number): string {
  if (b === 0) return `${a}`;
  const im = Math.abs(b) === 1 ? "i" : `${Math.abs(b)}i`;
  if (a === 0) return `${b < 0 ? "-" : ""}${im}`;
  return `${a} ${b < 0 ? "-" : "+"} ${im}`;
}

/** piTimes writes the angle num/den times pi in lowest terms. */
function piTimes(num: number, den: number): string {
  if (num === 0) return "0";
  const g = gcd(Math.abs(num), den);
  const [n, d] = [Math.abs(num) / g, den / g];
  const sign = num < 0 ? "-" : "";
  const top = n === 1 ? "\\pi" : `${n}\\pi`;
  return d === 1 ? `${sign}${top}` : `${sign}\\frac{${top}}{${d}}`;
}

/** octant gives the grid direction at k quarters of pi from the positive real axis, for k from -3 to 4. */
const octant = (k: number): Point =>
  (
    [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ] as const
  )[k + 3] as Point;

/** lattice lists the points of the integer grid from lo to hi that a filter keeps. */
function lattice(lo: number, hi: number, keep: (x: number, y: number) => boolean): Point[] {
  const out: Point[] = [];
  for (let x = lo; x <= hi; x++) for (let y = lo; y <= hi; y++) if (keep(x, y)) out.push([x, y]);
  return out;
}

/** contour draws a circle with arrows showing its direction of travel. */
function contour(h: number, k: number, r: number, counterclockwise: boolean): PlaneMark[] {
  const arrow = (mid: number): PlaneMark => {
    const [p, q] = [mid - 0.2 / r, mid + 0.2 / r].map((a): Point => [h + r * Math.cos(a), k + r * Math.sin(a)]) as [Point, Point];
    return { kind: "arrow", from: counterclockwise ? p : q, to: counterclockwise ? q : p, accent: true };
  };
  return [{ kind: "circle", center: [h, k], r, accent: true }, arrow(Math.PI / 2), arrow((3 * Math.PI) / 2)];
}

/** tripleStep picks a vector with a whole-number length and returns it with that length. */
function tripleStep(rng: Rng): { dx: number; dy: number; length: number } {
  const [dx, dy, length] = rng.pick([
    [3, 4, 5],
    [4, 3, 5],
    [6, 8, 10],
    [8, 6, 10],
  ] as const);
  return { dx, dy, length };
}

const relativesOfAPoint = point(
  "reading-a-point-and-its-relatives",
  ["Reading a point and its relatives", "读点及其相关的数"],
  [
    "A complex number is read from the plane with its real part across and its imaginary part up. Its conjugate is the mirror image in the real axis, its negative is the point through the origin, and multiplying by $i$ turns it a quarter turn counterclockwise. Reading the point first and then applying the rule avoids sign slips.",
    "从平面上读复数时，实部是横向，虚部是纵向。共轭是关于实轴的镜像，相反数是关于原点的对称点，乘以 $i$ 是逆时针旋转四分之一圈。先读出点，再套用规则，可以避免符号错误。",
  ],
  (rng) => {
    const [x, y] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
    const options: [string, string][] = [
      ["\\overline{z}", cx(x, -y)],
      ["-z", cx(-x, -y)],
      ["iz", cx(-y, x)],
      ["-iz", cx(y, -x)],
      ["z", cx(x, y)],
    ];
    const [name, value] = rng.pick(options);
    const rule: Pair =
      name === "z"
        ? ["the point itself is asked for", "所求就是这个点本身"]
        : name === "\\overline{z}"
          ? ["the conjugate changes the sign of the imaginary part", "共轭改变虚部的符号"]
          : name === "-z"
            ? ["the negative changes both signs", "相反数改变两个符号"]
            : name === "iz"
              ? [
                  "since $i(a + bi) = -b + ai$, the point turns a quarter turn counterclockwise",
                  "因为 $i(a + bi) = -b + ai$，点逆时针旋转四分之一圈",
                ]
              : [
                  "since $-i(a + bi) = b - ai$, the point turns a quarter turn clockwise",
                  "因为 $-i(a + bi) = b - ai$，点顺时针旋转四分之一圈",
                ];
    return choose(
      rng,
      [`The point $z$ is drawn in the complex plane. What is $${name}$?`, `图中画出了复平面上的点 $z$。$${name}$ 是多少？`],
      same(value),
      options.map(([, v]) => same(v)).concat([same(cx(y, x)), same(cx(-y, -x))]),
      [
        `The drawing gives $z = ${cx(x, y)}$, and ${rule[0]}. So the value is $${value}$.`,
        `由图得 $z = ${cx(x, y)}$，${rule[1]}。所以结果是 $${value}$。`,
      ],
      fig(
        argand(6),
        [{ kind: "point", at: [x, y], label: "z", dir: y > 0 ? "ne" : "se", accent: true }],
        [`A point z at (${x}, ${y}) in the complex plane.`, `复平面上的点 z，位于 (${x}, ${y})。`],
      ),
    );
  },
);

const distanceBetweenPoints = point(
  "the-distance-between-two-drawn-numbers",
  ["The distance between two drawn numbers", "图中两个复数的距离"],
  [
    "The modulus of a difference is a distance in the plane: the number $|z - w|$ is how far apart the two points are. Read how far apart they are across and how far apart they are up, then use the Pythagorean theorem. Adding the two offsets gives the length of a detour along the grid, which is too long.",
    "差的模是平面上的距离：$|z - w|$ 就是两点相距多远。读出两点的横向距离和纵向距离，再用勾股定理。把两个距离相加得到的是沿网格绕行的长度，它太长了。",
  ],
  (rng) => {
    const { dx, dy, length } = tripleStep(rng);
    const [x, y] = [rng.int(-6, 6 - dx), rng.int(-6, 6 - dy)];
    const flip = rng.bool();
    const z: Point = flip ? [x, y + dy] : [x, y];
    const w: Point = flip ? [x + dx, y] : [x + dx, y + dy];
    return ask(
      [
        "The points $z$ and $w$ are drawn in the complex plane. What is $|z - w|$?",
        "图中画出了复平面上的点 $z$ 和 $w$。$|z - w|$ 是多少？",
      ],
      length,
      [dx + dy, Math.abs(dx - dy), Math.max(dx, dy)],
      [
        `The points differ by $${dx}$ across and $${dy}$ up, so the distance is $\\sqrt{${dx}^2 + ${dy}^2} = ${length}$.`,
        `两点横向相差 $${dx}$，纵向相差 $${dy}$，所以距离是 $\\sqrt{${dx}^2 + ${dy}^2} = ${length}$。`,
      ],
      fig(
        argand(7),
        [
          { kind: "point", at: z, label: "z", dir: "n", accent: true },
          { kind: "point", at: w, label: "w", dir: "s", accent: true },
        ],
        [`Points z at (${z[0]}, ${z[1]}) and w at (${w[0]}, ${w[1]}).`, `点 z 位于 (${z[0]}, ${z[1]})，点 w 位于 (${w[0]}, ${w[1]})。`],
      ),
    );
  },
);

const principalArgument = {
  ...point(
    "the-principal-argument-from-a-drawing",
    ["The principal argument from a drawing", "由图读主辐角"],
    [
      "The principal argument is the one angle of a point that lies above $-\\pi$ and at most $\\pi$. Points above the real axis have positive principal argument. Points below it have negative principal argument, measured clockwise from the positive real axis, even though the same direction also has a positive angle larger than $\\pi$.",
      "主辐角是点的辐角中大于 $-\\pi$ 且不超过 $\\pi$ 的那一个。实轴上方的点主辐角为正。实轴下方的点主辐角为负，从正实轴按顺时针方向量取，尽管同一方向也有大于 $\\pi$ 的正角。",
    ],
    (rng) => {
      const k = rng.int(-3, 4);
      const a = rng.int(1, 4);
      const unit = octant(k);
      const z: Point = [a * unit[0], a * unit[1]];
      const answer = piTimes(k, 4);
      return choose(
        rng,
        [
          "The point $z$ is drawn with the ray from the origin. What is the principal argument of $z$?",
          "图中画出了点 $z$ 和从原点出发的射线。$z$ 的主辐角是多少？",
        ],
        same(answer),
        [same(piTimes(k + 8, 4)), same(piTimes(-k, 4)), same(piTimes(k > 0 ? k - 4 : k + 4, 4)), same(piTimes(k + 2, 4))],
        [
          k < 0
            ? `The point lies below the real axis, so the angle is measured clockwise and is negative: it is $${answer}$. Its positive partner $${piTimes(k + 8, 4)}$ lies outside the principal range.`
            : `The ray turns counterclockwise from the positive real axis through $${answer}$, and this angle lies in the principal range, so it is the principal argument.`,
          k < 0
            ? `点在实轴下方，所以角按顺时针量取，为负：它是 $${answer}$。与之对应的正角 $${piTimes(k + 8, 4)}$ 不在主值范围内。`
            : `射线从正实轴逆时针转过 $${answer}$，这个角在主值范围内，所以它就是主辐角。`,
        ],
        fig(
          argand(5),
          [
            { kind: "segment", a: [0, 0], b: z, accent: true },
            { kind: "point", at: z, label: "z", dir: z[1] < 0 ? "s" : "n", accent: true },
          ],
          [`A ray from the origin to the point z at (${z[0]}, ${z[1]}).`, `从原点到点 z 的射线，z 位于 (${z[0]}, ${z[1]})。`],
        ),
      );
    },
  ),
  figure: precalculusDrawings3["the-polar-form-of-a-complex-number#the-principal-argument-from-a-drawing"],
};

const rootsFromPicture = {
  ...point(
    "the-equation-from-its-roots-on-a-circle",
    ["The equation from its roots on a circle", "由圆上的根读方程"],
    [
      "The solutions of $z^n = w$ are $n$ points evenly spaced on a circle centered at the origin. So the number of dots gives $n$, the radius $R$ gives $|w| = R^n$, and multiplying the angle of any one dot by $n$ gives the angle of $w$. A dot on the positive real axis means that $w$ is positive.",
      "$z^n = w$ 的解是以原点为圆心的圆上均匀分布的 $n$ 个点。所以点的个数给出 $n$，半径 $R$ 给出 $|w| = R^n$，任一点的辐角乘以 $n$ 给出 $w$ 的辐角。正实轴上有点就说明 $w$ 为正。",
    ],
    (rng) => {
      const n = rng.int(3, 7);
      const R = rng.int(1, 3);
      const positive = rng.bool();
      const start = positive ? 0 : Math.PI / n;
      const answer = (positive ? 1 : -1) * R ** n;
      const marks: PlaneMark[] = [{ kind: "circle", center: [0, 0], r: R, dashed: true }];
      for (let j = 0; j < n; j++) {
        const a = start + (2 * Math.PI * j) / n;
        marks.push({ kind: "point", at: [R * Math.cos(a), R * Math.sin(a)], accent: true });
      }
      return ask(
        [
          "The dots are all the solutions of an equation $z^n = w$ with $w$ a real number. What is $w$?",
          "图中的点是方程 $z^n = w$ 的全部解，其中 $w$ 是实数。$w$ 是多少？",
        ],
        answer,
        [-answer, n * R, R ** (n - 1)],
        [
          `There are $${n}$ dots at distance $${R}$ from the origin, so $n = ${n}$ and $|w| = ${R}^{${n}}$. ${positive ? "One dot lies on the positive real axis, so $w$ is positive" : `The first dot above the positive real axis has angle $${piTimes(1, n)}$, and $${n}$ times that is $\\pi$, so $w$ is negative`}, which gives $w = ${answer}$.`,
          `共有 $${n}$ 个点，到原点的距离为 $${R}$，所以 $n = ${n}$，$|w| = ${R}^{${n}}$。${positive ? "有一个点在正实轴上，所以 $w$ 为正" : `正实轴上方第一个点的辐角是 $${piTimes(1, n)}$，乘以 $${n}$ 得 $\\pi$，所以 $w$ 为负`}，于是 $w = ${answer}$。`,
        ],
        fig(argand(4), marks, [
          `${n} dots evenly spaced on a dashed circle of radius ${R} about the origin.`,
          `${n} 个点均匀分布在以原点为圆心、半径为 ${R} 的虚线圆上。`,
        ]),
      );
    },
  ),
  figure: precalculusDrawings3["higher-roots-of-complex-numbers#the-equation-from-its-roots-on-a-circle"],
};

const windingFromLoop = {
  ...point(
    "the-winding-number-of-a-drawn-loop",
    ["The winding number of a drawn loop", "读图中回路的环绕数"],
    [
      "The winding number of a loop about a point counts its net counterclockwise turns around that point. To read it, draw a ray from the point to infinity and add one for each crossing where the loop passes counterclockwise and subtract one for each crossing where it passes clockwise. A point outside the loop has winding number zero.",
      "回路关于一点的环绕数计算它绕该点逆时针转过的净圈数。读取时，从该点向无穷远画一条射线，回路每逆时针穿过一次加一，每顺时针穿过一次减一。回路外的点环绕数为零。",
    ],
    (rng) => {
      const quarter = rng.int(0, 3);
      const s = rng.pick([1.25, 1.5]);
      const counterclockwise = rng.bool();
      const turn = ([x, y]: Point): Point => {
        const c = [1, 0, -1, 0][quarter] as number;
        const d = [0, 1, 0, -1][quarter] as number;
        return [s * (c * x - d * y), s * (d * x + c * y)];
      };
      const curve = (a: number): Point => {
        const r = 1 + 2 * Math.cos(a);
        return turn([r * Math.cos(a), r * Math.sin(a)]);
      };
      const [spot, base] = rng.pick([
        ["inner", 2],
        ["outer", 1],
        ["outside", 0],
      ] as const);
      const answer = counterclockwise ? base : base === 0 ? 0 : -base;
      const at = turn(spot === "inner" ? [0.5, 0] : spot === "outer" ? [2, 0] : [-1.5, 0]);
      const arrow = (a: number): PlaneMark => {
        const [p, q] = [curve(a - 0.12), curve(a + 0.12)];
        return { kind: "arrow", from: counterclockwise ? p : q, to: counterclockwise ? q : p, accent: true };
      };
      const body: Pair =
        base === 2
          ? ["A ray from $P$ crosses the loop twice, both times in the same direction", "从 $P$ 出发的射线穿过回路两次，方向相同"]
          : base === 1
            ? ["A ray from $P$ away from the small inner loop crosses the outer curve once", "从 $P$ 出发、避开内圈的射线穿过外圈一次"]
            : ["A ray from $P$ pointing away from the loop never crosses it", "从 $P$ 出发、背离回路的射线不穿过回路"];
      return ask(
        [
          "The loop is traced once in the direction of its arrows. What is its winding number about $P$?",
          "回路按箭头方向走一遍。它关于 $P$ 的环绕数是多少？",
        ],
        answer,
        [1, 2, -1, -2, 0],
        [
          `${body[0]}, and the arrows run ${counterclockwise ? "counterclockwise" : "clockwise"}. So the winding number is $${answer}$.`,
          `${body[1]}，箭头方向是${counterclockwise ? "逆时针" : "顺时针"}。所以环绕数是 $${answer}$。`,
        ],
        fig(
          { ...argand(5), labelEvery: 1 },
          [
            { kind: "path", points: Array.from({ length: 181 }, (_, i) => curve((2 * Math.PI * i) / 180)), accent: true },
            arrow(0),
            arrow(Math.PI / 2),
            arrow((3 * Math.PI) / 2),
            // The inner loop is too small to hold a label, so a thin arrow leads to the point from the space outside the loop.
            ...(spot === "inner"
              ? ([
                  { kind: "point", at },
                  { kind: "label", at: turn([0.5, 1.15]), text: "P", dir: "n" },
                  { kind: "arrow", from: turn([0.5, 0.95]), to: turn([0.5, 0.12]), thin: true },
                ] as PlaneMark[])
              : ([{ kind: "point", at, label: "P", dir: "n" }] as PlaneMark[])),
          ],
          [
            `A closed curve with a small inner loop, traced ${counterclockwise ? "counterclockwise" : "clockwise"}, and a point P.`,
            `一条带小内圈的闭曲线，按${counterclockwise ? "逆时针" : "顺时针"}方向走，以及点 P。`,
          ],
        ),
      );
    },
  ),
  figure: complexDrawings1["winding-numbers#the-winding-number-of-a-drawn-loop"],
};

const residueSum = point(
  "the-residue-theorem-from-a-drawing",
  ["The residue theorem from a drawing", "由图用留数定理"],
  [
    "The residue theorem adds only the residues at the poles inside the contour, and a clockwise contour changes the sign of the result. So a drawing does most of the work: first sort the poles into inside and outside, then read the direction of travel, and only then add. Poles outside the contour contribute nothing at all.",
    "留数定理只把围线内部极点的留数相加，顺时针的围线会改变结果的符号。所以图完成了大部分工作：先把极点分成内部和外部，再读行进方向，最后才相加。围线外部的极点没有任何贡献。",
  ],
  (rng) => {
    const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
    const r = rng.int(2, 3);
    const dist = (x: number, y: number) => Math.hypot(x - h, y - k);
    const inner = rng.sample(
      lattice(-5, 5, (x, y) => dist(x, y) <= r - 0.7),
      2,
    );
    const outer = rng.sample(
      lattice(-5, 5, (x, y) => dist(x, y) >= r + 0.7),
      2,
    );
    const residue = () => rng.nonZero(-4, 4);
    const inside = inner.map((at) => ({ at, value: residue() }));
    const outside = outer.map((at) => ({ at, value: residue() }));
    const counterclockwise = rng.bool();
    const sum = inside.reduce((acc, p) => acc + p.value, 0);
    const answer = counterclockwise ? sum : 0 - sum;
    const total = sum + outside.reduce((acc, p) => acc + p.value, 0);
    const name = (v: number) => String(v).replace("-", "−");
    return ask(
      [
        "Each dot is a simple pole of $f$, labelled with its residue, and $f$ is analytic elsewhere. The contour $C$ is traced once along its arrows. What is $\\frac{1}{2\\pi i}\\oint_C f(z)\\,dz$?",
        "每个点都是 $f$ 的单极点，旁边标有留数，$f$ 在其他地方解析。围线 $C$ 沿箭头方向走一遍。$\\frac{1}{2\\pi i}\\oint_C f(z)\\,dz$ 是多少？",
      ],
      answer,
      [-answer, total, -total, total - sum],
      [
        `The residues inside the contour add to $${sum}$, the two outside poles do not count, and the contour runs ${counterclockwise ? "counterclockwise, which keeps the sign" : "clockwise, which changes the sign"}. So the value is $${answer}$.`,
        `围线内部的留数之和为 $${sum}$，外部两个极点不计入，围线是${counterclockwise ? "逆时针，符号不变" : "顺时针，符号改变"}。所以结果是 $${answer}$。`,
      ],
      fig(
        argand(5),
        [
          ...contour(h, k, r, counterclockwise),
          ...[...inside, ...outside].map((p): PlaneMark => ({ kind: "point", at: p.at, label: name(p.value), dir: "ne" })),
        ],
        [
          `A ${counterclockwise ? "counterclockwise" : "clockwise"} circle of radius ${r} about (${h}, ${k}) with four labelled poles.`,
          `以 (${h}, ${k}) 为圆心、半径为 ${r} 的${counterclockwise ? "逆时针" : "顺时针"}圆，以及四个标有留数的极点。`,
        ],
      ),
    );
  },
);

const cauchyFormulaFromDrawing = {
  ...point(
    "cauchys-formula-inside-or-outside",
    ["Cauchy's formula: inside or outside", "柯西公式：在内还是在外"],
    [
      "For $g$ analytic everywhere, the integral $\\frac{1}{2\\pi i}\\oint \\frac{g(z)}{z - a}\\,dz$ around a counterclockwise circle equals $g(a)$ when the point $a$ lies inside the circle and zero when it lies outside. The same formula therefore has two different values, and the drawing is what tells them apart.",
      "若 $g$ 处处解析，沿逆时针圆的积分 $\\frac{1}{2\\pi i}\\oint \\frac{g(z)}{z - a}\\,dz$ 在点 $a$ 位于圆内时等于 $g(a)$，在圆外时等于零。同一个公式有两种不同的值，要靠图来区分。",
    ],
    (rng) => {
      const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
      const r = rng.int(2, 3);
      const inside = rng.bool();
      const a = rng.pick(
        [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => (inside ? Math.hypot(x - h, k) <= r - 0.5 : Math.hypot(x - h, k) >= r + 0.5)),
      );
      const c = rng.int(1, 9);
      const value = a * a + c;
      const power = a < 0 ? `(${a})` : `${a}`;
      return ask(
        [
          `The contour $C$ is traced once along its arrows and the point $a$ is marked on the real axis. What is $\\frac{1}{2\\pi i}\\oint_C \\frac{z^2 + ${c}}{z - a}\\,dz$?`,
          `围线 $C$ 沿箭头方向走一遍，实轴上标出了点 $a$。$\\frac{1}{2\\pi i}\\oint_C \\frac{z^2 + ${c}}{z - a}\\,dz$ 是多少？`,
        ],
        inside ? value : 0,
        [inside ? 0 : value, a * a, a + c, -value],
        inside
          ? [
              `The point $a = ${a}$ lies inside the contour, so Cauchy's formula gives the numerator at $a$: $${power}^2 + ${c} = ${value}$.`,
              `点 $a = ${a}$ 在围线内部，所以柯西公式给出分子在 $a$ 处的值：$${power}^2 + ${c} = ${value}$。`,
            ]
          : [
              `The point $a = ${a}$ lies outside the contour, so the integrand is analytic on and inside it, and Cauchy's theorem gives $0$.`,
              `点 $a = ${a}$ 在围线外部，所以被积函数在围线上及其内部解析，由柯西定理得 $0$。`,
            ],
        fig(
          argand(6),
          [...contour(h, k, r, true), { kind: "point", at: [a, 0], label: "a", dir: "n" }],
          [
            `A counterclockwise circle of radius ${r} about (${h}, ${k}) and the point a at ${a} on the real axis.`,
            `以 (${h}, ${k}) 为圆心、半径为 ${r} 的逆时针圆，以及实轴上位于 ${a} 的点 a。`,
          ],
        ),
      );
    },
  ),
  figure: complexDrawings1["cauchys-integral-formula#cauchys-formula-inside-or-outside"],
};

const pathIndependence = point(
  "an-integral-along-a-drawn-path",
  ["An integral along a drawn path", "沿图中路径的积分"],
  [
    "When the integrand has an antiderivative, the integral along a path depends only on where the path starts and ends, however much the path wanders between them. For $2z$ the antiderivative is $z^2$, so the integral is the square of the end point minus the square of the start point. The arrow on the drawing tells which end is which.",
    "被积函数有原函数时，沿路径的积分只取决于路径的起点和终点，不管中间怎样绕行。$2z$ 的原函数是 $z^2$，所以积分等于终点的平方减起点的平方。图上的箭头说明哪一端是哪一端。",
  ],
  (rng) => {
    const [ax, ay] = [rng.int(-3, -1), rng.int(1, 3)];
    const bx = rng.int(1, 3);
    const raw = rng.int(-3, 3);
    const by = bx === -ax && raw === -ay ? 0 : raw;
    const square = (x: number, y: number): [number, number] => [x * x - y * y, 2 * x * y];
    const [pa, pb] = [square(ax, ay), square(bx, by)];
    const answer = cx(pb[0] - pa[0], pb[1] - pa[1]);
    const mid1: Point = [rng.int(-3, 0), rng.int(-3, 0)];
    const mid2: Point = [rng.int(0, 3), rng.int(1, 3)];
    const path: Point[] = [[ax, ay], mid1, mid2, [bx, by]];
    const end = path[3] as Point;
    const last = mid2;
    const length = Math.hypot(end[0] - last[0], end[1] - last[1]) || 1;
    const tail: Point = [end[0] - (0.8 * (end[0] - last[0])) / length, end[1] - (0.8 * (end[1] - last[1])) / length];
    return choose(
      rng,
      [
        "The path $\\gamma$ runs from $A$ to $B$ along the arrow. What is $\\int_\\gamma 2z\\,dz$?",
        "路径 $\\gamma$ 沿箭头从 $A$ 走到 $B$。$\\int_\\gamma 2z\\,dz$ 是多少？",
      ],
      same(answer),
      [
        same(cx(pa[0] - pb[0], pa[1] - pb[1])),
        same(cx(pa[0] + pb[0], pa[1] + pb[1])),
        same(cx(bx - ax, by - ay)),
        same(cx(2 * (bx - ax), 2 * (by - ay))),
        same(cx(pb[0], pb[1])),
      ],
      [
        `An antiderivative of $2z$ is $z^2$, so only the ends matter: $A = ${cx(ax, ay)}$ and $B = ${cx(bx, by)}$ give $A^2 = ${cx(pa[0], pa[1])}$ and $B^2 = ${cx(pb[0], pb[1])}$, and $B^2 - A^2 = ${answer}$.`,
        `$2z$ 的一个原函数是 $z^2$，所以只有两端有关：$A = ${cx(ax, ay)}$，$B = ${cx(bx, by)}$，得 $A^2 = ${cx(pa[0], pa[1])}$，$B^2 = ${cx(pb[0], pb[1])}$，所以 $B^2 - A^2 = ${answer}$。`,
      ],
      fig(
        argand(4),
        [
          { kind: "path", points: path, accent: true },
          { kind: "arrow", from: tail, to: end, accent: true },
          { kind: "point", at: [ax, ay], label: "A", dir: "n" },
          { kind: "point", at: [bx, by], label: "B", dir: "e" },
        ],
        [
          `A broken path from A at (${ax}, ${ay}) to B at (${bx}, ${by}).`,
          `一条折线路径，从位于 (${ax}, ${ay}) 的 A 到位于 (${bx}, ${by}) 的 B。`,
        ],
      ),
    );
  },
);

const mlFromDrawing = point(
  "the-ml-bound-from-a-drawn-segment",
  ["The ML bound from a drawn segment", "由图中线段求 ML 上界"],
  [
    "The ML inequality bounds an integral by the largest size $M$ of the integrand on the path times the length $L$ of the path. Both factors are needed, and the length comes from the geometry of the path: for a straight segment it is the distance between the ends, which the Pythagorean theorem gives from the grid.",
    "ML 不等式用被积函数在路径上的最大模 $M$ 乘以路径长度 $L$ 来估计积分。两个因子都需要，而长度来自路径的几何：直线段的长度是两端的距离，可以从网格上用勾股定理得到。",
  ],
  (rng) => {
    const { dx, dy, length } = tripleStep(rng);
    const [x, y] = [rng.int(-6, 6 - dx), rng.int(-6, 6 - dy)];
    const M = rng.int(2, 9);
    const flip = rng.bool();
    const a: Point = flip ? [x, y + dy] : [x, y];
    const b: Point = flip ? [x + dx, y] : [x + dx, y + dy];
    return ask(
      [
        `On the segment $\\gamma$ drawn, $|f(z)| \\le ${M}$. What upper bound does the ML inequality give for $\\left|\\int_\\gamma f(z)\\,dz\\right|$?`,
        `在图中的线段 $\\gamma$ 上，$|f(z)| \\le ${M}$。ML 不等式给出 $\\left|\\int_\\gamma f(z)\\,dz\\right|$ 的什么上界？`,
      ],
      M * length,
      [M * (dx + dy), M, length, M + length],
      [
        `The segment spans $${dx}$ across and $${dy}$ up, so its length is $L = ${length}$. The bound is $ML = ${M} \\cdot ${length} = ${M * length}$.`,
        `线段横向跨 $${dx}$，纵向跨 $${dy}$，所以长度 $L = ${length}$。上界是 $ML = ${M} \\cdot ${length} = ${M * length}$。`,
      ],
      fig(
        argand(7),
        [
          { kind: "segment", a, b, accent: true },
          { kind: "point", at: a },
          { kind: "point", at: b },
        ],
        [`A segment from (${a[0]}, ${a[1]}) to (${b[0]}, ${b[1]}).`, `从 (${a[0]}, ${a[1]}) 到 (${b[0]}, ${b[1]}) 的线段。`],
      ),
    );
  },
);

const wedgeImage = {
  ...point(
    "the-image-of-a-drawn-wedge",
    ["The image of a drawn wedge", "图中楔形的像"],
    [
      "The map $w = z^k$ multiplies every argument by $k$ and raises every modulus to the power $k$. So a wedge with its tip at the origin goes to a wedge with its tip at the origin, and its opening angle is multiplied by $k$. Conformality fails at the origin, which is why angles there are not preserved.",
      "映射 $w = z^k$ 把每个辐角乘以 $k$，把每个模变成 $k$ 次方。所以顶点在原点的楔形映成顶点在原点的楔形，张角乘以 $k$。映射在原点不保角，所以那里的角不被保持。",
    ],
    (rng) => {
      const k = rng.int(2, 3);
      const steps = rng.pick([1, 2]);
      const first = rng.int(0, 7);
      const dir = (q: number): Point => [Math.cos((q * Math.PI) / 4), Math.sin((q * Math.PI) / 4)];
      const [u, v] = [dir(first), dir(first + steps)];
      const scale = (p: Point): Point => [4 * p[0] * Math.SQRT2, 4 * p[1] * Math.SQRT2];
      const answer = piTimes(k * steps, 4);
      return choose(
        rng,
        [
          `The map $w = z^{${k}}$ is applied to the shaded wedge. What is the opening angle of its image?`,
          `映射 $w = z^{${k}}$ 作用于阴影楔形。它的像的张角是多少？`,
        ],
        same(answer),
        [same(piTimes(steps, 4)), same(piTimes(steps, 4 * k)), same(piTimes(k + steps, 4)), same(piTimes(2 * k * steps, 4))],
        [
          `The drawn wedge opens through $${piTimes(steps, 4)}$, and $w = z^{${k}}$ multiplies arguments by $${k}$, so the image opens through $${answer}$.`,
          `图中楔形的张角是 $${piTimes(steps, 4)}$，$w = z^{${k}}$ 把辐角乘以 $${k}$，所以像的张角是 $${answer}$。`,
        ],
        fig(
          argand(4),
          [
            {
              kind: "region",
              halfPlanes: [
                [-u[1], u[0], 0],
                [v[1], -v[0], 0],
              ],
            },
            { kind: "segment", a: [0, 0], b: scale(u), accent: true },
            { kind: "segment", a: [0, 0], b: scale(v), accent: true },
          ],
          [
            `A shaded wedge with its tip at the origin, between the rays at ${first * 45} degrees and ${((first + steps) * 45) % 360} degrees.`,
            `顶点在原点的阴影楔形，位于 ${first * 45} 度和 ${((first + steps) * 45) % 360} 度的两条射线之间。`,
          ],
        ),
      );
    },
  ),
  figure: complexDrawings1["conformal-maps#the-image-of-a-drawn-wedge"],
};

const diskImage = point(
  "the-image-of-a-drawn-disk",
  ["The image of a drawn disk", "图中圆盘的像"],
  [
    "A map $w = az + b$ scales by $|a|$, turns by the argument of $a$ and then shifts by $b$, so a disk goes to a disk. The new center is the image of the old center, and the new radius is $|a|$ times the old radius. The shift $b$ moves the center but never changes the radius.",
    "映射 $w = az + b$ 先按 $|a|$ 缩放，按 $a$ 的辐角旋转，再平移 $b$，所以圆盘映成圆盘。新圆心是旧圆心的像，新半径是旧半径的 $|a|$ 倍。平移 $b$ 只移动圆心，不改变半径。",
  ],
  (rng) => {
    const [x, y] = [rng.int(-2, 2), rng.int(-2, 2)];
    const r = rng.int(1, 2);
    const [re, im] = rng.pick([
      [2, 0],
      [3, 0],
      [-2, 0],
      [0, 1],
      [0, 2],
      [0, -1],
    ] as const);
    const size = Math.abs(re + im);
    const [bx, by] = [rng.int(-3, 3), rng.nonZero(-3, 3)];
    const [ux, uy] = [re * x - im * y, re * y + im * x];
    const [cu, cv] = [ux + bx, uy + by];
    const a = cx(re, im);
    const map = `w = ${a}z ${by < 0 && bx === 0 ? "-" : "+"} ${bx === 0 ? cx(0, Math.abs(by)) : `(${cx(bx, by)})`}`;
    const option = (c: string, radius: number): Pair => [`center $${c}$, radius $${radius}$`, `圆心 $${c}$，半径 $${radius}$`];
    return choose(
      rng,
      [`The map $${map}$ is applied to the shaded disk. What is its image?`, `映射 $${map}$ 作用于阴影圆盘。它的像是什么？`],
      option(cx(cu, cv), size * r),
      [
        option(cx(cu, cv), r),
        option(cx(x + bx, y + by), size * r),
        option(cx(ux, uy), size * r),
        option(cx(re * (x + bx) - im * (y + by), re * (y + by) + im * (x + bx)), size * r),
        option(cx(cu, cv), r + size),
      ],
      [
        `The drawing gives center $${cx(x, y)}$ and radius $${r}$. The center goes to $(${a})(${cx(x, y)}) + (${cx(bx, by)}) = ${cx(cu, cv)}$, and the radius is multiplied by $|a| = ${size}$.`,
        `由图得圆心 $${cx(x, y)}$，半径 $${r}$。圆心映到 $(${a})(${cx(x, y)}) + (${cx(bx, by)}) = ${cx(cu, cv)}$，半径乘以 $|a| = ${size}$。`,
      ],
      fig(
        argand(5),
        [
          { kind: "region", halfPlanes: [], disk: { center: [x, y], r } },
          { kind: "circle", center: [x, y], r, accent: true },
          { kind: "point", at: [x, y] },
        ],
        [`A shaded disk with center (${x}, ${y}) and radius ${r}.`, `圆心为 (${x}, ${y})、半径为 ${r} 的阴影圆盘。`],
      ),
    );
  },
);

const logFromPoint = point(
  "the-principal-logarithm-of-a-drawn-point",
  ["The principal logarithm of a drawn point", "图中点的主对数"],
  [
    "The principal logarithm of a nonzero number is the natural logarithm of its modulus, plus $i$ times its principal argument. A drawing supplies both parts at once: the distance from the origin and the direction from the origin. Points below the real axis have a negative imaginary part in their principal logarithm.",
    "非零复数的主对数等于其模的自然对数，加上 $i$ 乘以其主辐角。图同时给出这两部分：到原点的距离和相对原点的方向。实轴下方的点，其主对数的虚部为负。",
  ],
  (rng) => {
    const onAxis = rng.bool(0.5);
    const k = onAxis ? rng.pick([-2, 0, 2, 4]) : rng.pick([-3, -1, 1, 3]);
    const unit = octant(k);
    const a = onAxis ? rng.int(2, 6) : rng.int(1, 4);
    const z: Point = [a * unit[0], a * unit[1]];
    const modulus = onAxis ? `\\ln ${a}` : a === 1 ? "\\ln \\sqrt{2}" : `\\ln (${a}\\sqrt{2})`;
    const size = onAxis ? `${a}` : a === 1 ? "\\sqrt{2}" : `${a}\\sqrt{2}`;
    const withArg = (m: string, q: number) => {
      if (q === 0) return m;
      const sign = q < 0 ? "-" : "+";
      return `${m} ${sign} ${piTimes(Math.abs(q), 4)} i`;
    };
    const answer = withArg(modulus, k);
    return choose(
      rng,
      [
        "The point $z$ is drawn in the complex plane. What is the principal logarithm of $z$?",
        "图中画出了复平面上的点 $z$。$z$ 的主对数是多少？",
      ],
      same(answer),
      [
        same(withArg(modulus, k === 0 ? 8 : -k)),
        same(withArg(size, k)),
        same(withArg(modulus, k + 8)),
        same(withArg(modulus, k + 4)),
        same(withArg(size, k + 8)),
      ],
      [
        `The point lies at distance $${size}$ from the origin in direction $${piTimes(k, 4)}$, within the principal range. So the logarithm is $${answer}$.`,
        `点到原点的距离是 $${size}$，方向是 $${piTimes(k, 4)}$，在主值范围内。所以对数是 $${answer}$。`,
      ],
      fig(
        argand(6),
        [
          { kind: "segment", a: [0, 0], b: z },
          { kind: "point", at: z, label: "z", dir: z[1] < 0 ? "s" : "n", accent: true },
        ],
        [`A segment from the origin to the point z at (${z[0]}, ${z[1]}).`, `从原点到点 z 的线段，z 位于 (${z[0]}, ${z[1]})。`],
      ),
    );
  },
);

const radiusFromSingularities = point(
  "the-radius-from-the-nearest-singularity",
  ["The radius from the nearest singularity", "由最近的奇点求半径"],
  [
    "The Taylor series of a function about a point converges on the largest disk centered there that avoids every singularity. So its radius is the distance from the center to the nearest singularity, measured in the plane. Farther singularities do not matter, and neither does the distance from the origin unless the series is centered there.",
    "函数在一点的泰勒级数在以该点为中心、不含任何奇点的最大圆盘上收敛。所以收敛半径是中心到最近奇点在平面上的距离。更远的奇点无关紧要，除非级数以原点为中心，否则到原点的距离也无关紧要。",
  ],
  (rng) => {
    const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
    const lengths = rng.sample([2, 3, 4, 5, 6], 3);
    const dots = lengths.map((length): Point => {
      const [sx, sy] = [rng.sign(), rng.sign()];
      if (length === 5 && rng.bool(0.8)) return rng.bool() ? [h + 3 * sx, k + 4 * sy] : [h + 4 * sx, k + 3 * sy];
      return rng.bool() ? [h + length * sx, k] : [h, k + length * sy];
    });
    const answer = Math.min(...lengths);
    const farthest = Math.max(...lengths);
    const fromOrigin = Math.min(...dots.map((p) => Math.round(Math.hypot(p[0], p[1]))));
    return ask(
      [
        "The dots are all the singularities of $f$, and $c$ is marked. What is the radius of convergence of the Taylor series of $f$ about $c$?",
        "图中的点是 $f$ 的全部奇点，并标出了 $c$。$f$ 在 $c$ 处的泰勒级数的收敛半径是多少？",
      ],
      answer,
      [farthest, lengths.reduce((a, b) => a + b, 0) - answer - farthest, fromOrigin],
      [
        `The distances from $c$ to the three dots are $${[...lengths].sort((a, b) => a - b).join(", ")}$. The series converges up to the nearest singularity, so the radius is $${answer}$.`,
        `$c$ 到三个点的距离是 $${[...lengths].sort((a, b) => a - b).join(", ")}$。级数收敛到最近的奇点为止，所以半径是 $${answer}$。`,
      ],
      fig(
        argand(7),
        [
          { kind: "point", at: [h, k], label: "c", dir: "ne", open: true },
          ...dots.map((at): PlaneMark => ({ kind: "point", at, accent: true })),
        ],
        [`A center c at (${h}, ${k}) and three singularities.`, `中心 c 位于 (${h}, ${k})，以及三个奇点。`],
      ),
    );
  },
);

const annuliCount = {
  ...point(
    "counting-laurent-expansions-from-a-drawing",
    ["Counting Laurent expansions from a drawing", "由图数洛朗展开"],
    [
      "A function has one Laurent expansion about the origin on each region between consecutive circles through its singularities: an inner disk, the annuli and an outer region. Only the different distances from the origin matter, so two singularities at the same distance add just one circle. A singularity at the origin would change the disk into a punctured disk.",
      "函数在原点处的洛朗展开，在穿过各奇点的相邻圆之间的每个区域上各有一个：内部圆盘、各圆环和外部区域。只有到原点的不同距离才有关，所以距离相同的两个奇点只增加一个圆。原点处的奇点只会把圆盘变成去心圆盘。",
    ],
    (rng) => {
      const moduli = rng.sample([1, 2, 3, 4, 5], rng.int(2, 3));
      const axis = (m: number): Point =>
        rng.pick<Point>([
          [m, 0],
          [-m, 0],
          [0, m],
          [0, -m],
        ]);
      const dots: Point[] = [];
      for (const m of moduli) {
        dots.push(
          m === 5 && rng.bool()
            ? rng.pick<Point>([
                [3, 4],
                [-3, 4],
                [4, -3],
                [-4, -3],
              ])
            : axis(m),
        );
        const second: Point =
          m === 5
            ? rng.pick<Point>([
                [-4, 3],
                [3, -4],
                [-3, -4],
              ])
            : axis(m);
        if (rng.bool() && !dots.some((p) => p[0] === second[0] && p[1] === second[1])) dots.push(second);
      }
      const answer = moduli.length + 1;
      return ask(
        [
          "The dots are all the singularities of $f$. On how many different regions does $f$ have a Laurent expansion about the origin?",
          "图中的点是 $f$ 的全部奇点。$f$ 在原点处的洛朗展开有多少个不同的区域？",
        ],
        answer,
        [moduli.length, dots.length + 1, dots.length, answer + 1],
        [
          `The dots lie at $${moduli.length}$ different distances from the origin, namely $${[...moduli].sort((a, b) => a - b).join(", ")}$. These circles cut the plane into $${answer}$ regions: an inner disk, the annuli and an outer region.`,
          `这些点到原点有 $${moduli.length}$ 种不同的距离，分别是 $${[...moduli].sort((a, b) => a - b).join(", ")}$。这些圆把平面分成 $${answer}$ 个区域：内部圆盘、各圆环和外部区域。`,
        ],
        fig(
          argand(6),
          dots.map((at): PlaneMark => ({ kind: "point", at, accent: true })),
          [`${dots.length} singularities marked in the plane, none at the origin.`, `平面上标出了 ${dots.length} 个奇点，原点处没有。`],
        ),
      );
    },
  ),
  figure: complexDrawings1["laurent-series-on-annuli#counting-laurent-expansions-from-a-drawing"],
};

const argumentPrincipleFromDrawing = point(
  "the-argument-principle-from-a-drawing",
  ["The argument principle from a drawing", "由图用辐角原理"],
  [
    "The argument principle says that the image of a counterclockwise contour under $f$ winds around the origin as many times as the zeros inside minus the poles inside, counted with multiplicity. A drawing that marks zeros and poles therefore gives that winding number by counting. Zeros and poles outside the contour have no effect on it.",
    "辐角原理说，逆时针围线在 $f$ 下的像绕原点的圈数等于内部零点个数减内部极点个数，按重数计算。所以标出零点和极点的图，只要数一数就能得到这个环绕数。围线外部的零点和极点对它没有影响。",
  ],
  (rng) => {
    const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
    const r = rng.int(2, 3);
    const dist = (x: number, y: number) => Math.hypot(x - h, y - k);
    const inner = rng.sample(
      lattice(-5, 5, (x, y) => dist(x, y) <= r - 0.7),
      rng.int(2, 4),
    );
    const outer = rng.sample(
      lattice(-5, 5, (x, y) => dist(x, y) >= r + 0.7),
      2,
    );
    const zerosIn = rng.int(0, inner.length);
    const polesIn = inner.length - zerosIn;
    const answer = zerosIn - polesIn;
    const flip = rng.bool();
    return ask(
      [
        "The contour is traced once counterclockwise. Filled dots are simple zeros of $f$, hollow dots are simple poles, and $f$ has no others. How many times does the image of the contour under $f$ wind counterclockwise around the origin?",
        "围线按逆时针方向走一遍。实心点是 $f$ 的单零点，空心点是单极点，$f$ 没有其他零点和极点。围线在 $f$ 下的像按逆时针方向绕原点多少圈？",
      ],
      answer,
      [zerosIn + polesIn, polesIn - zerosIn, zerosIn, zerosIn + (flip ? 2 : 1) - polesIn],
      [
        `Inside the contour there are $${zerosIn}$ filled and $${polesIn}$ hollow dots, and the dots outside do not count. So the winding number is zeros minus poles, which is $${zerosIn} - ${polesIn} = ${answer}$.`,
        `围线内部有 $${zerosIn}$ 个实心点和 $${polesIn}$ 个空心点，外部的点不计入。所以环绕数是零点数减极点数，即 $${zerosIn} - ${polesIn} = ${answer}$。`,
      ],
      fig(
        argand(5),
        [
          ...contour(h, k, r, true),
          ...inner.map((at, i): PlaneMark => ({ kind: "point", at, open: i >= zerosIn, accent: true })),
          { kind: "point", at: outer[0] as Point, accent: true },
          { kind: "point", at: outer[1] as Point, open: true, accent: true },
        ],
        [
          `A counterclockwise circle of radius ${r} about (${h}, ${k}), with filled zeros and hollow poles inside and outside.`,
          `以 (${h}, ${k}) 为圆心、半径为 ${r} 的逆时针圆，圆内外都有实心零点和空心极点。`,
        ],
      ),
    );
  },
);

/** deeperFiguresComplexAnalysisPoints adds knowledge points of Complex Analysis that are answered by reading a drawing. */
export const deeperFiguresComplexAnalysisPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-complex-plane": [relativesOfAPoint, distanceBetweenPoints],
  "the-polar-form-of-a-complex-number": [principalArgument],
  "higher-roots-of-complex-numbers": [rootsFromPicture],
  "winding-numbers": [windingFromLoop],
  "the-residue-theorem": [residueSum],
  "cauchys-integral-formula": [cauchyFormulaFromDrawing],
  "complex-antiderivatives-and-path-independence": [pathIndependence],
  "the-ml-inequality": [mlFromDrawing],
  "conformal-maps": [wedgeImage],
  "functions-of-a-complex-variable": [diskImage],
  "the-complex-logarithm": [logFromPoint],
  "power-series-on-discs": [radiusFromSingularities],
  "laurent-series-on-annuli": [annuliCount],
  "the-argument-principle-and-rouches-theorem": [argumentPrincipleFromDrawing],
};
