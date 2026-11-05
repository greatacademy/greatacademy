// Knowledge points of Linear Programming that ask the learner to read a drawing: feasible regions, objective lines and
// small networks. See `deeperFiguresLinearProgrammingPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd, Q, svgDocument } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { arrowLine, drawn, label, node } from "./figure-reading-more.ts";

/** quadrant is the first quadrant, with room for labels. */
const quadrant: PlaneView = { xMin: -1, xMax: 9, yMin: -1, yMax: 9 };

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** feasiblePolygons lists convex polygons with integer corners in the first quadrant, in order around the boundary. */
const feasiblePolygons: readonly (readonly Point[])[] = [
  [
    [0, 0],
    [5, 0],
    [5, 2],
    [2, 5],
    [0, 5],
  ],
  [
    [0, 0],
    [6, 0],
    [4, 4],
    [0, 6],
  ],
  [
    [0, 0],
    [4, 0],
    [6, 2],
    [3, 5],
    [0, 4],
  ],
  [
    [1, 1],
    [6, 1],
    [6, 3],
    [3, 6],
    [1, 6],
  ],
  [
    [0, 0],
    [7, 0],
    [5, 3],
    [1, 5],
    [0, 4],
  ],
  [
    [0, 1],
    [3, 0],
    [7, 2],
    [6, 5],
    [2, 6],
  ],
  [
    [1, 0],
    [5, 0],
    [7, 3],
    [4, 6],
    [1, 4],
  ],
  [
    [0, 0],
    [3, 0],
    [6, 3],
    [4, 6],
    [0, 5],
  ],
];

/** region shades a polygon and outlines it. */
function region(points: readonly Point[]): PlaneMark[] {
  const marks: PlaneMark[] = [{ kind: "polygon", points }];
  points.forEach((p, i) => {
    marks.push({ kind: "segment", a: p, b: points[(i + 1) % points.length] as Point, accent: true });
  });
  return marks;
}

/** objective writes a linear objective in two variables. */
function objective(a: number, b: number): string {
  const part = (c: number, v: string) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
  if (a === 0) return part(b, "y");
  if (b === 0) return part(a, "x");
  return `${part(a, "x")} ${b < 0 ? "-" : "+"} ${part(Math.abs(b), "y")}`;
}

/** bestCorner finds the corner with the largest objective value, along with the value and whether it is unique. */
function bestCorner(points: readonly Point[], a: number, b: number) {
  const values = points.map((p) => a * p[0] + b * p[1]);
  const top = Math.max(...values);
  return { top, values, index: values.indexOf(top), unique: values.filter((v) => v === top).length === 1 };
}

const maxAtCorner = point(
  "the-maximum-on-a-drawn-polygon",
  ["The maximum on a drawn polygon", "图中多边形上的最大值"],
  [
    "A linear objective on a bounded feasible polygon reaches its maximum at a corner. So the graphical method reads the coordinates of each corner, substitutes them into the objective and takes the largest value. The drawing supplies the corners, which saves solving for the intersections of the constraint lines one pair at a time.",
    "线性目标函数在有界可行多边形上的最大值在顶点取到。所以图解法读出每个顶点的坐标，代入目标函数，取最大的值。图提供了这些顶点，省去了逐对求约束线交点的麻烦。",
  ],
  (rng) => {
    const pts = rng.pick(feasiblePolygons);
    let [a, b] = [rng.int(1, 5), rng.int(1, 5)];
    if (rng.bool(0.3)) b = -b;
    let best = bestCorner(pts, a, b);
    if (!best.unique) {
      a += 1;
      best = bestCorner(pts, a, b);
    }
    const sorted = [...new Set(best.values)].sort((u, v) => v - u);
    const at = pts[best.index] as Point;
    return ask(
      [
        `What is the maximum of $${objective(a, b)}$ over the shaded feasible region?`,
        `$${objective(a, b)}$ 在阴影可行域上的最大值是多少？`,
      ],
      best.top,
      [sorted[1] ?? best.top + 1, sorted[sorted.length - 1] ?? best.top + 2, at[0] + at[1] === best.top ? best.top + 3 : at[0] + at[1]],
      [
        `Checking the corners, the largest value is at $(${at[0]}, ${at[1]})$, where the objective equals $${best.top}$. A linear objective always has its maximum at a corner of a bounded polygon.`,
        `检验各顶点，最大值在 $(${at[0]}, ${at[1]})$ 处，目标函数等于 $${best.top}$。线性目标函数在有界多边形上的最大值总在顶点取到。`,
      ],
      fig(quadrant, region(pts), [
        `A polygon with corners ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
        `顶点为 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("，")} 的多边形。`,
      ]),
    );
  },
);

const constraintOfEdge = point(
  "the-constraint-of-a-drawn-edge",
  ["The constraint of a drawn edge", "图中边对应的约束"],
  [
    "Each edge of a feasible region lies on the boundary line of one constraint. To find the constraint, write the equation of the line through two corners on the edge, and then choose the inequality that keeps the rest of the region on the correct side. Testing one interior point decides between the two directions.",
    "可行域的每条边都在一个约束的边界线上。要找这个约束，先写出经过边上两个顶点的直线方程，再选择使区域其余部分在正确一侧的不等式。代入一个内部点检验，就能确定是哪个方向。",
  ],
  (rng) => {
    const p = rng.int(2, 6);
    const q = rng.int(2, 6);
    // The edge lies on p x + q y = pq, so it has intercepts q and p.
    const [xCut, yCut] = [q, p];
    const d = gcd(p, q);
    const [a, b, c] = [p / d, q / d, (p * q) / d];
    const tex = (x: number, y: number, z: number, sign: string) => `${objective(x, y)} ${sign} ${z}`;
    const pts: Point[] = [
      [0, 0],
      [xCut, 0],
      [0, yCut],
    ];
    return choose(
      rng,
      [
        "The shaded region lies in the first quadrant. Which constraint, along with $x \\geq 0$ and $y \\geq 0$, describes it?",
        "阴影区域在第一象限。哪个约束与 $x \\geq 0$ 和 $y \\geq 0$ 一起描述它？",
      ],
      same(tex(a, b, c, "\\leq")),
      [
        same(tex(a, b, c, "\\geq")),
        same(tex(b, a, c, "\\leq")),
        same(tex(a, b, c + 1, "\\leq")),
        same(tex(q, p, p + q, "\\leq")),
        same(tex(a + 1, b, c, "\\leq")),
      ],
      [
        `The slanted edge runs from $(${xCut}, 0)$ to $(0, ${yCut})$, and both points satisfy $${tex(a, b, c, "=")}$. The origin is in the region and gives $0 \\leq ${c}$, so the region is the side where $${tex(a, b, c, "\\leq")}$.`,
        `斜边从 $(${xCut}, 0)$ 到 $(0, ${yCut})$，两点都满足 $${tex(a, b, c, "=")}$。原点在区域内，代入得 $0 \\leq ${c}$，所以区域是满足 $${tex(a, b, c, "\\leq")}$ 的一侧。`,
      ],
      fig(quadrant, region(pts), [
        `A triangle with corners (0, 0), (${xCut}, 0) and (0, ${yCut}).`,
        `顶点为 (0, 0)、(${xCut}, 0) 和 (0, ${yCut}) 的三角形。`,
      ]),
    );
  },
);

const extremeCount = point(
  "counting-extreme-points-in-a-drawing",
  ["Counting extreme points in a drawing", "数图中的极点"],
  [
    "An extreme point of a polyhedron is a point that does not lie in the middle of any segment within the set. For a polygon, these are the corners where the boundary really turns. A marked point on the middle of an edge is not extreme, even when a constraint line passes through it, because it lies between two corners.",
    "多面体的极点是不位于集合内任何线段中间的点。对多边形来说，这些就是边界真正转弯的顶点。标在边中间的点不是极点，即使有约束线经过它，因为它位于两个顶点之间。",
  ],
  (rng) => {
    const pts = rng.pick(feasiblePolygons);
    const n = pts.length;
    const extras = rng.int(0, 3);
    const edges = rng.sample(
      Array.from({ length: n }, (_, i) => i),
      extras,
    );
    const onEdges = edges.map((i): Point => {
      const [p, q] = [pts[i] as Point, pts[(i + 1) % n] as Point];
      return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    });
    const all = [...pts, ...onEdges];
    return ask(
      [
        "Several points on the boundary of the shaded feasible region are marked. How many of the marked points are extreme points of the region?",
        "阴影可行域的边界上标出了若干点。标出的点中有多少是该区域的极点？",
      ],
      n,
      [all.length === n ? n + 1 : all.length, n - 1, n + 2],
      [
        extras === 0
          ? `Each marked point is a corner where the boundary turns, so all $${n}$ are extreme.`
          : `The boundary turns at $${n}$ of the marked points. The other $${extras}$ lie in the middle of edges, so they are between two points of the region and are not extreme.`,
        extras === 0
          ? `标出的每个点都是边界转弯的顶点，所以 $${n}$ 个都是极点。`
          : `边界在标出的 $${n}$ 个点处转弯。另外 $${extras}$ 个点在边的中间，位于区域内两点之间，所以不是极点。`,
      ],
      fig(
        quadrant,
        [...region(pts), ...all.map((p): PlaneMark => ({ kind: "point", at: p }))],
        [
          `A polygon with ${all.length} points marked on its boundary, at ${all.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
          `一个多边形，边界上标出了 ${all.length} 个点，分别在 ${all.map((p) => `(${p[0]}, ${p[1]})`).join("、")}。`,
        ],
      ),
    );
  },
);

const alternativeOptima = point(
  "the-objective-with-many-optimal-points",
  ["The objective with many optimal points", "有多个最优点的目标函数"],
  [
    "A linear program has many optimal solutions when the level lines of the objective are parallel to an edge, and that edge is the last part of the region reached. Then every point of the edge has the same value. So the coefficient ratio of the objective must match the direction of an edge that faces the direction of improvement.",
    "当目标函数的等值线与一条边平行，并且这条边是区域最后到达的部分时，线性规划有多个最优解。此时边上每一点的值都相同。所以目标系数的比必须与朝向改进方向的那条边的方向相符。",
  ],
  (rng) => {
    const [a, b] = rng.pick<Point>([
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 3],
      [3, 2],
      [1, 3],
      [3, 1],
      [3, 4],
      [4, 3],
    ]);
    const most = Math.floor(9 / Math.max(a, b));
    const k = rng.int(3, Math.max(3, most));
    const [dx, dy] = [rng.int(0, 1), rng.int(0, 1)];
    const level = k * a * b + a * dx + b * dy;
    const [xCut, yCut] = [k * b, k * a];
    const polygon = (
      [
        [0, 0],
        [xCut - b, 0],
        [xCut - b, a],
        [b, yCut - a],
        [0, yCut - a],
      ] as const
    ).map(([x, y]): Point => [x + dx, y + dy]);
    const asPair = (u: number, v: number): Pair => [`$${objective(u, v)}$`, `$${objective(u, v)}$`];
    const wrongPairs = (
      [
        [b, a],
        [a + 1, b],
        [a, b + 1],
        [a + 2, b + 1],
        [a + 1, b + 3],
      ] as const
    )
      .filter(([u, v]) => u * b !== v * a)
      .map(([u, v]) => asPair(u, v));
    return choose(
      rng,
      [
        "For which objective, when maximized over the shaded region, is every point of the slanted edge optimal?",
        "在阴影区域上最大化哪个目标函数时，斜边上的每一点都是最优的？",
      ],
      asPair(a, b),
      wrongPairs,
      [
        `The slanted edge has slope $${Q.of(-a, b).toLatex()}$, and it lies on a line $${objective(a, b)} = ${level}$, so that objective is constant along the edge and largest there.`,
        `斜边的斜率是 $${Q.of(-a, b).toLatex()}$，它在直线 $${objective(a, b)} = ${level}$ 上，所以这个目标函数沿边不变，并且在那里最大。`,
      ],
      fig({ xMin: -1, xMax: Math.max(xCut, yCut) + 2, yMin: -1, yMax: Math.max(xCut, yCut) + 2 }, region(polygon), [
        `A polygon with corners ${polygon.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
        `顶点为 ${polygon.map((p) => `(${p[0]}, ${p[1]})`).join("，")} 的多边形。`,
      ]),
    );
  },
);

const unboundedObjective = point(
  "whether-a-drawn-unbounded-region-has-a-maximum",
  ["Whether a drawn unbounded region has a maximum", "图中无界区域是否有最大值"],
  [
    "An unbounded feasible region does not make a linear program unbounded by itself. What matters is whether the objective can keep improving along a direction in which the region extends. If it can, there is no finite optimum, and if the objective worsens along all such directions, the optimum is still at a corner.",
    "无界可行域本身不会使线性规划无界。关键在于目标函数能否沿区域延伸的方向不断改进。如果能，就没有有限的最优值；如果沿所有这些方向目标都变差，最优值仍在顶点取到。",
  ],
  (rng) => {
    const p = rng.int(1, 3);
    const q = rng.int(1, 3);
    const case0 = rng.pick([
      { a: 1, b: 1, top: false },
      { a: 1, b: 2, top: false },
      { a: 2, b: 1, top: false },
      { a: -1, b: -1, top: true },
      { a: -2, b: -1, top: true },
      { a: -1, b: -2, top: true },
      { a: -1, b: -3, top: true },
    ]);
    const { a, b, top } = case0;
    const value = a * p + b * q;
    const pts: Point[] = [
      [p, q],
      [9, q],
      [9, 9],
      [p, 9],
    ];
    const right: Pair = top
      ? [`The maximum is $${value}$`, `最大值是 $${value}$`]
      : ["There is no maximum, because the objective grows without bound", "没有最大值，因为目标函数无界增大"];
    return choose(
      rng,
      [
        `The feasible region is the shaded part, which continues without end upward and to the right. What can be said about maximizing $${objective(a, b)}$ on it?`,
        `可行域是阴影部分，它向上和向右无限延伸。在其上最大化 $${objective(a, b)}$，可以得出什么结论？`,
      ],
      right,
      top
        ? [
            ["There is no maximum, because the objective grows without bound", "没有最大值，因为目标函数无界增大"],
            [`The maximum is $${value + 1}$`, `最大值是 $${value + 1}$`],
            ["The program is infeasible", "这个规划不可行"],
            ["The maximum is $0$", "最大值是 $0$"],
          ]
        : [
            [`The maximum is $${value}$`, `最大值是 $${value}$`],
            [`The maximum is $${value + 1}$`, `最大值是 $${value + 1}$`],
            ["The program is infeasible", "这个规划不可行"],
          ],
      top
        ? [
            `Moving up or right only lowers the objective, because both coefficients are negative. So the best point is the corner $(${p}, ${q})$, with value $${value}$.`,
            `向上或向右移动只会使目标函数减小，因为两个系数都是负数。所以最好的点是顶点 $(${p}, ${q})$，值为 $${value}$。`,
          ]
        : [
            `Moving up or right stays in the region and raises the objective, because both coefficients are positive, so its values have no upper limit.`,
            `向上或向右移动仍在区域内，并使目标函数增大，因为两个系数都是正数，所以它的值没有上界。`,
          ],
      fig(
        quadrant,
        [
          { kind: "polygon", points: pts },
          { kind: "segment", a: [p, q], b: [9, q], accent: true },
          { kind: "segment", a: [p, q], b: [p, 9], accent: true },
          { kind: "point", at: [p, q] },
        ],
        [`A region with corner (${p}, ${q}) that continues upward and to the right.`, `顶点为 (${p}, ${q})、向上和向右延伸的区域。`],
      ),
    );
  },
);

const infeasibleHalfPlanes = point(
  "half-planes-that-cannot-all-hold",
  ["Half-planes that cannot all hold", "不能同时成立的半平面"],
  [
    "A linear program is infeasible when its constraints have no common point. In a drawing, each constraint is a half-plane, and the feasible set is the part shaded by all of them. Parallel boundaries with shading facing away from each other show the simplest case, and such a pair also yields a Farkas certificate of infeasibility.",
    "当约束没有公共点时，线性规划不可行。在图中，每个约束是一个半平面，可行集是被所有约束覆盖的部分。边界平行且阴影方向彼此背离是最简单的情况，这样的一对约束也给出法卡斯不可行证书。",
  ],
  (rng) => {
    const vertical = rng.bool();
    const lo = rng.int(1, 3);
    const gap = rng.int(1, 3);
    const hi = lo + gap;
    const empty = rng.bool();
    const v = vertical ? "x" : "y";
    const line = (c: number): PlaneMark =>
      vertical ? { kind: "segment", a: [c, -1], b: [c, 9], accent: true } : { kind: "segment", a: [-1, c], b: [9, c], accent: true };
    // Short arrows show which side each constraint keeps.
    const arrowsAt = (c: number, dir: number): PlaneMark[] =>
      [1, 4, 7].map(
        (t0): PlaneMark =>
          vertical
            ? { kind: "arrow", from: [c, t0], to: [c + dir * 0.9, t0], accent: true }
            : { kind: "arrow", from: [t0, c], to: [t0, c + dir * 0.9], accent: true },
      );
    const [dirLow, dirHigh] = empty ? [-1, 1] : [1, -1];
    const right: Pair = empty
      ? ["The program is infeasible", "这个规划不可行"]
      : [`The feasible set is the strip with $${lo} \\leq ${v} \\leq ${hi}$`, `可行集是满足 $${lo} \\leq ${v} \\leq ${hi}$ 的带形区域`];
    const others: Pair[] = [
      ["The program is infeasible", "这个规划不可行"],
      [`The feasible set is the strip with $${lo} \\leq ${v} \\leq ${hi}$`, `可行集是满足 $${lo} \\leq ${v} \\leq ${hi}$ 的带形区域`],
      [`The feasible set is the half-plane $${v} \\geq ${hi}$`, `可行集是半平面 $${v} \\geq ${hi}$`],
      [`The feasible set is the half-plane $${v} \\leq ${lo}$`, `可行集是半平面 $${v} \\leq ${lo}$`],
    ];
    return choose(
      rng,
      [
        "Each thick line is the boundary of a constraint, and its arrows point to the side that the constraint keeps. What is the feasible set of the two constraints together?",
        "每条粗线是一个约束的边界，箭头指向约束保留的一侧。两个约束合起来的可行集是什么？",
      ],
      right,
      others.filter((o) => o[0] !== right[0]),
      empty
        ? [
            `The arrows point away from each other, so a point would have to be on the far side of both lines at once. No point does that, so there is nothing feasible.`,
            `箭头方向彼此背离，一个点必须同时在两条线的外侧。没有这样的点，所以没有可行点。`,
          ]
        : [
            `The arrows point toward each other, so a point must be between the lines at $${lo}$ and $${hi}$, which form a strip.`,
            `箭头方向彼此相向，所以点必须在 $${lo}$ 和 $${hi}$ 处的两条线之间，构成带形区域。`,
          ],
      fig(
        quadrant,
        [line(lo), line(hi), ...arrowsAt(lo, dirLow), ...arrowsAt(hi, dirHigh)],
        [
          `Boundaries at ${v} = ${lo} and ${v} = ${hi}, with arrows pointing ${empty ? "away from each other" : "toward each other"}.`,
          `边界在 ${v} = ${lo} 和 ${v} = ${hi}，箭头方向${empty ? "彼此背离" : "彼此相向"}。`,
        ],
      ),
    );
  },
);

const rangingCoefficient = point(
  "how-far-an-objective-can-tilt",
  ["How far an objective can tilt", "目标函数可以倾斜多少"],
  [
    "A corner stays optimal while the level lines of the objective lie between the slopes of the two edges at that corner. Changing a coefficient tilts the level lines. So the range of a coefficient comes from the slopes of the neighboring edges, and when the objective matches an edge, the optimum is about to change to the next corner.",
    "只要目标函数的等值线处在该顶点两条边的斜率之间，顶点就保持最优。改变系数会使等值线倾斜。所以系数的范围来自相邻边的斜率，当目标函数与一条边相符时，最优点就要变到下一个顶点。",
  ],
  (rng) => {
    const [h, k] = [rng.int(2, 5), rng.int(2, 5)];
    const [wide, fall] = [rng.int(1, 3), rng.int(1, 3)];
    // The polygon is convex only when the first slanted edge is the steeper one.
    const [run, drop] = k * h > wide * fall ? [wide, fall] : [1, 1];
    const pts: Point[] = [
      [0, 0],
      [h + run, 0],
      [h, k],
      [0, k + drop],
    ];
    // The edges at the corner (h, k) have slopes -k / run and -drop / h.
    // For the objective c x + y, the corner stays optimal when drop / h <= c <= k / run.
    const low = Q.of(drop, h);
    const high = Q.of(k, run);
    return ask(
      [
        "The corner where the two slanted edges meet is the optimal point for maximizing $cx + y$ over the shaded region. What is the largest value of $c$ for which this stays true?",
        "两条斜边相交的顶点是在阴影区域上最大化 $cx + y$ 的最优点。这一结论成立时，$c$ 的最大值是多少？",
      ],
      high,
      [low.eq(high) ? high.add(Q.of(1, 1)) : low, Q.of(run, k), high.add(Q.of(1, 1)), high.add(Q.of(2, 1))],
      [
        `The steeper edge has slope $${high.neg().toLatex()}$. The level lines of $cx + y$ have slope $-c$, and once they get steeper than that edge, the next corner is better. So the largest value is $${high.toLatex()}$.`,
        `较陡的边斜率为 $${high.neg().toLatex()}$。$cx + y$ 的等值线斜率为 $-c$，一旦比这条边更陡，下一个顶点就更好。所以最大值是 $${high.toLatex()}$。`,
      ],
      fig(quadrant, region(pts), [
        `A polygon with corners ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}.`,
        `顶点为 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("，")} 的多边形。`,
      ]),
    );
  },
);

const shadowFromMovedLine = point(
  "a-shadow-price-from-a-moved-constraint",
  ["A shadow price from a moved constraint", "由移动的约束读影子价格"],
  [
    "The shadow price of a constraint is the gain in the optimal value per unit of extra resource, while the same constraints stay active. A drawing can show this directly: the solid boundary is the original constraint, and the dashed one is the constraint after the extra resource. Comparing the two optimal corners gives the change in the objective.",
    "约束的影子价格是在同样的约束保持起作用时，每增加一单位资源带来的最优值增量。图可以直接显示这一点：实线边界是原约束，虚线是增加资源后的约束。比较两个最优顶点就得到目标函数的变化。",
  ],
  (rng) => {
    const b = rng.int(2, 5);
    const a = rng.int(1, 3);
    const extra = rng.int(1, 2);
    const coefficient = rng.int(1, 4);
    const other = rng.int(1, 3);
    const objectiveX = coefficient;
    const objectiveY = other;
    const pts: Point[] = [
      [0, 0],
      [a + 3, 0],
      [a + 3, b],
      [0, b],
    ];
    const gain = objectiveY * extra;
    return ask(
      [
        `The solid region is limited by $y \\leq k$, shown as the top edge. The dashed line shows that limit after more resource is provided. By how much does the maximum of $${objective(objectiveX, objectiveY)}$ rise when the top edge moves up to the dashed line?`,
        `实线区域受 $y \\leq k$ 的限制，即顶边。虚线表示提供更多资源后的限制。顶边移到虚线时，$${objective(objectiveX, objectiveY)}$ 的最大值增加多少？`,
      ],
      gain,
      [
        objectiveY === gain ? gain + 1 : objectiveY,
        extra === gain ? gain + 2 : extra,
        objectiveX * extra === gain ? gain + 3 : objectiveX * extra,
      ],
      [
        `The best corner moves straight up from $(${a + 3}, ${b})$ to $(${a + 3}, ${b + extra})$. Only $y$ changes, by $${extra}$, so the objective rises by $${objectiveY} \\cdot ${extra} = ${gain}$.`,
        `最优顶点从 $(${a + 3}, ${b})$ 竖直上移到 $(${a + 3}, ${b + extra})$。只有 $y$ 改变了 $${extra}$，所以目标函数增加 $${objectiveY} \\cdot ${extra} = ${gain}$。`,
      ],
      fig(
        quadrant,
        [...region(pts), { kind: "segment", a: [0, b + extra], b: [a + 3, b + extra], dashed: true, accent: true }],
        [
          `A rectangle up to x = ${a + 3} and y = ${b}, with a dashed line at y = ${b + extra}.`,
          `到 x = ${a + 3} 和 y = ${b} 的矩形，虚线在 y = ${b + extra}。`,
        ],
      ),
    );
  },
);

/** network draws a small flow network with four nodes and capacities on its arrows. */
function network(edges: readonly (readonly [Point, Point, number])[], names: readonly (readonly [Point, string])[]): string {
  let body = "";
  for (const [p, q, v] of edges) {
    const [mx, my] = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const [nx, ny] = [-(q[1] - p[1]), q[0] - p[0]];
    const length = Math.hypot(nx, ny);
    body +=
      arrowLine(p, q, 14, true) +
      label(Math.round(mx + (nx / length) * 11), Math.round(my + (ny / length) * 11 + 4), String(v), 'font-weight="600"');
  }
  return svgDocument(200, body + names.map(([p, n]) => node(p, n)).join(""));
}

const S: Point = [40, 100];
const A: Point = [160, 40];
const B: Point = [160, 160];
const T: Point = [280, 100];

const maxFlowDiagram = point(
  "the-maximum-flow-of-a-drawn-network",
  ["The maximum flow of a drawn network", "图中网络的最大流"],
  [
    "The maximum flow from a source to a sink equals the minimum capacity of a cut that separates them, which is the max-flow min-cut theorem. A cut counts only the arrows going from the source side to the sink side. In a small network, list the possible cuts, add their capacities and take the smallest.",
    "从源到汇的最大流等于把它们分开的割的最小容量，这就是最大流最小割定理。割只计算从源一侧指向汇一侧的箭头。在小网络中，列出所有可能的割，把容量相加，取最小值。",
  ],
  (rng) => {
    const [sa, sb, at, bt, ab] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(1, 5)];
    const cuts = [sa + sb, at + bt, sb + at + ab, sa + bt];
    const answer = Math.min(...cuts);
    return ask(
      ["Arrows carry the capacities shown. What is the maximum flow from $s$ to $t$?", "箭头上标有容量。从 $s$ 到 $t$ 的最大流是多少？"],
      answer,
      [Math.max(...cuts), sa + sb === answer ? at + bt + 1 : sa + sb, sa + at === answer ? answer + 1 : sa + at],
      [
        `The four cuts have capacities $${cuts.join(", ")}$. The smallest is $${answer}$, and by the max-flow min-cut theorem that is the maximum flow.`,
        `四个割的容量是 $${cuts.join(", ")}$。最小的是 $${answer}$，由最大流最小割定理，这就是最大流。`,
      ],
      {
        svg: network(
          [
            [S, A, sa],
            [S, B, sb],
            [A, T, at],
            [B, T, bt],
            [A, B, ab],
          ],
          [
            [S, "s"],
            [A, "a"],
            [B, "b"],
            [T, "t"],
          ],
        ),
        alt: t(
          `A network with capacities s to a ${sa}, s to b ${sb}, a to t ${at}, b to t ${bt} and a to b ${ab}.`,
          `网络容量：s 到 a 为 ${sa}，s 到 b 为 ${sb}，a 到 t 为 ${at}，b 到 t 为 ${bt}，a 到 b 为 ${ab}。`,
        ),
      },
    );
  },
);

const shortestPathDiagram = point(
  "the-optimal-value-of-a-drawn-shortest-path",
  ["The optimal value of a drawn shortest path", "图中最短路的最优值"],
  [
    "The shortest path problem is a linear program that sends one unit of flow from the source to the sink at the least cost. Its optimal value is the length of the shortest directed path. In a small drawing, every route can be listed. Follow the directions of the arrows, because a route may not travel against them.",
    "最短路问题是把一单位流从源送到汇、费用最小的线性规划。它的最优值是最短有向路的长度。在小图中可以列出每条路线。要沿箭头方向走，路线不能逆着箭头。",
  ],
  (rng) => {
    const [sa, sb, at, bt, ab] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 5)];
    const routes = [sa + at, sb + bt, sa + ab + bt];
    const answer = Math.min(...routes);
    return ask(
      [
        "Arrows carry the costs shown, and a route must follow their directions. What is the length of the shortest route from $s$ to $t$?",
        "箭头上标有费用，路线必须沿箭头方向。从 $s$ 到 $t$ 的最短路线长度是多少？",
      ],
      answer,
      [Math.max(...routes), sb + ab + at === answer ? answer + 1 : sb + ab + at, sa + sb + at + bt + ab],
      [
        `The routes through $a$, through $b$ and through both have lengths $${routes.join(", ")}$. The smallest is $${answer}$, and going from $b$ to $a$ is not allowed because of the direction of the arrow.`,
        `经过 $a$、经过 $b$ 和经过两者的路线长度分别为 $${routes.join(", ")}$。最小的是 $${answer}$，而从 $b$ 到 $a$ 不允许，因为箭头方向相反。`,
      ],
      {
        svg: network(
          [
            [S, A, sa],
            [S, B, sb],
            [A, T, at],
            [B, T, bt],
            [A, B, ab],
          ],
          [
            [S, "s"],
            [A, "a"],
            [B, "b"],
            [T, "t"],
          ],
        ),
        alt: t(
          `A network with costs s to a ${sa}, s to b ${sb}, a to t ${at}, b to t ${bt} and a to b ${ab}.`,
          `网络费用：s 到 a 为 ${sa}，s 到 b 为 ${sb}，a 到 t 为 ${at}，b 到 t 为 ${bt}，a 到 b 为 ${ab}。`,
        ),
      },
    );
  },
);

/** latticeInside lists the integer points of a polygon, using a small allowance for points on its boundary. */
function latticeInside(points: readonly Point[]): Point[] {
  const inside: Point[] = [];
  for (let x = 0; x <= 8; x++)
    for (let y = 0; y <= 8; y++) {
      const ok = points.every((p, i) => {
        const q = points[(i + 1) % points.length] as Point;
        return (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]) >= -1e-9;
      });
      if (ok) inside.push([x, y]);
    }
  return inside;
}

/** slantedPolygon draws a polygon with fractional corners so that its integer points differ from its corners. */
function slantedPolygon(rng: Rng): Point[] {
  const p = rng.pick([4.5, 5.5, 6.5]);
  const q = rng.pick([3.5, 4.5, 5.5]);
  const r = rng.pick([1.5, 2.5]);
  return [
    [0, 0],
    [p, 0],
    [p, r],
    [r, q],
    [0, q],
  ];
}

const integerBest = point(
  "the-best-integer-point-in-a-drawing",
  ["The best integer point in a drawing", "图中最好的整数点"],
  [
    "An integer program allows only the lattice points of the feasible region. The optimum of the relaxation is at a corner, which need not be a lattice point, and rounding it may leave the region. So compare the lattice points inside the region near the best corner, and take the one with the largest objective value.",
    "整数规划只允许可行域内的格点。松弛问题的最优点在顶点，它不一定是格点，把它取整可能会离开区域。所以要比较区域内最优顶点附近的格点，取目标值最大的一个。",
  ],
  (rng) => {
    const pts = slantedPolygon(rng);
    const [a, b] = rng.sample([1, 2, 3, 4, 5], 2) as [number, number];
    const lattice = latticeInside(pts);
    const values = lattice.map(([x, y]) => a * x + b * y);
    const best = Math.max(...values);
    const bestPoint = lattice[values.indexOf(best)] as Point;
    const relaxed = Math.max(...pts.map(([x, y]) => a * x + b * y));
    const distinct = [...new Set(values)].sort((u, v) => v - u);
    return ask(
      [
        `The dots are the integer points of the plane. What is the maximum of $${objective(a, b)}$ over the integer points of the shaded region?`,
        `这些点是平面上的整数点。$${objective(a, b)}$ 在阴影区域的整数点上的最大值是多少？`,
      ],
      best,
      [distinct[1] ?? best - 1, Math.ceil(relaxed) === best ? best + 1 : Math.ceil(relaxed), best + a + b],
      [
        `Among the dots inside the region, the objective is largest at $(${bestPoint[0]}, ${bestPoint[1]})$, where it equals $${best}$. The best corner of the region is not an integer point, so it is not allowed.`,
        `在区域内的点中，目标函数在 $(${bestPoint[0]}, ${bestPoint[1]})$ 处最大，等于 $${best}$。区域的最优顶点不是整数点，所以不允许。`,
      ],
      fig(
        quadrant,
        [...region(pts), ...Array.from({ length: 9 * 9 }, (_, i): PlaneMark => ({ kind: "point", at: [i % 9, Math.floor(i / 9)] }))],
        [
          `A polygon with corners ${pts.map((p) => `(${p[0]}, ${p[1]})`).join(", ")}, drawn over the integer grid.`,
          `顶点为 ${pts.map((p) => `(${p[0]}, ${p[1]})`).join("，")} 的多边形，画在整数格点上。`,
        ],
      ),
    );
  },
);

const convexWeights = point(
  "the-weight-of-a-point-on-a-segment",
  ["The weight of a point on a segment", "线段上一点的权重"],
  [
    "A point on the segment from $A$ to $B$ is a convex combination $\\lambda A + (1 - \\lambda) B$. The weight on $A$ is larger when the point is nearer to $A$, so $\\lambda$ is the distance from the point to $B$ divided by the whole length. At $A$ itself the weight on $A$ is one, and at $B$ it is zero.",
    "从 $A$ 到 $B$ 线段上的点是凸组合 $\\lambda A + (1 - \\lambda) B$。点越靠近 $A$，$A$ 的权重越大，所以 $\\lambda$ 等于点到 $B$ 的距离除以整段长度。在 $A$ 处 $A$ 的权重为一，在 $B$ 处为零。",
  ],
  (rng) => {
    const n = rng.int(3, 6);
    const k = rng.int(1, n - 1);
    const [dx, dy] = rng.pick<Point>([
      [1, 1],
      [1, 0],
      [0, 1],
      [1, -1],
    ]);
    const [x0, y0] = [rng.int(0, 2), dy < 0 ? rng.int(n, 7) : rng.int(0, 2)];
    const at = (j: number): Point => [x0 + j * dx, y0 + j * dy];
    const lambda = Q.of(n - k, n);
    return ask(
      [
        "The point $P$ lies on the segment from $A$ to $B$. If $P = \\lambda A + (1 - \\lambda) B$, what is $\\lambda$?",
        "点 $P$ 在从 $A$ 到 $B$ 的线段上。若 $P = \\lambda A + (1 - \\lambda) B$，$\\lambda$ 是多少？",
      ],
      lambda,
      [Q.of(k, n).eq(lambda) ? Q.of(1, n + 1) : Q.of(k, n), Q.of(k, n + 1), Q.of(n - k, n + 1), Q.of(1, n)],
      [
        `The segment is divided into $${n}$ equal steps, and $P$ is $${n - k}$ steps from $B$. The weight on $A$ is the share of the segment between $P$ and $B$, which is $${lambda.toLatex()}$.`,
        `线段分成 $${n}$ 个相等的步长，$P$ 距 $B$ 为 $${n - k}$ 步。$A$ 的权重是 $P$ 与 $B$ 之间的部分所占的比例，即 $${lambda.toLatex()}$。`,
      ],
      fig(
        quadrant,
        [
          { kind: "segment", a: at(0), b: at(n), accent: true },
          { kind: "point", at: at(0), label: "A", dir: "nw" },
          { kind: "point", at: at(n), label: "B", dir: "ne" },
          { kind: "point", at: at(k), label: "P", dir: "ne" },
        ],
        [
          `A at (${at(0).join(", ")}), B at (${at(n).join(", ")}) and P at (${at(k).join(", ")}).`,
          `A 在 (${at(0).join(", ")})，B 在 (${at(n).join(", ")})，P 在 (${at(k).join(", ")})。`,
        ],
      ),
    );
  },
);

/** deeperFiguresLinearProgrammingPoints adds knowledge points of Linear Programming that are answered by reading a drawing. */
export const deeperFiguresLinearProgrammingPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-graphical-method-for-linear-programs": [maxAtCorner, constraintOfEdge],
  "polyhedra-and-extreme-points": [extremeCount],
  "alternative-optimal-solutions": [alternativeOptima],
  "unboundedness-and-degeneracy": [unboundedObjective],
  "infeasible-programs-and-farkas-lemma": [infeasibleHalfPlanes],
  "objective-coefficient-ranging": [rangingCoefficient],
  "shadow-prices-in-decisions": [shadowFromMovedLine],
  "maximum-flow-and-minimum-cut": [maxFlowDiagram],
  "shortest-paths-as-linear-programs": [shortestPathDiagram],
  "branch-and-bound": [integerBest],
  "convex-sets-and-convex-combinations": [convexWeights],
};
