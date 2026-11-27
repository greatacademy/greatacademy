// Knowledge points of Complex Analysis that ask the learner to read a drawing: points of the Argand plane,
// contours, winding numbers and images of regions. See `deeperFiguresComplexAnalysisPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd } from "@ga/subject-math";
import { complexDrawings1 } from "../explanation-drawings-complex-analysis-1.ts";
import { precalculusDrawings3 } from "../explanation-drawings-precalculus-3.ts";
import { stepLabel } from "../solution-kit.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { drawn } from "./figure-reading-more.ts";
import { chosen, type Miss, type Slip, until, worked } from "./number-theory-course.ts";

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
    "A complex number is read from the plane with its real part across and its imaginary part up. Its conjugate is the mirror image in the real axis, its negative is the point through the origin, and multiplying by $i$ turns it a quarter turn counterclockwise. Reading the point first and then applying the rule avoids sign slips.\n\nFor example, the point $(2, 3)$ is $z = 2 + 3i$. Then $\\overline{z} = 2 - 3i$, $-z = -2 - 3i$ and $iz = 2i + 3i^2 = -3 + 2i$. Check: $iz$ is the point $(-3, 2)$, at the same distance $\\sqrt{13}$ from the origin, and $(2)(-3) + (3)(2) = 0$, so it is a quarter turn from $(2, 3)$.\n\n> **Watch out.** The conjugate is a reflection, not a turn, and swapping the two parts is a third, different move: for $2 + 3i$ it gives $3 + 2i$, which is none of $\\overline{z}$, $-z$ or $iz$.",
    "从平面上读复数时，实部是横向，虚部是纵向。共轭是关于实轴的镜像，相反数是关于原点的对称点，乘以 $i$ 是逆时针旋转四分之一圈。先读出点，再套用规则，可以避免符号错误。\n\n例如，点 $(2, 3)$ 是 $z = 2 + 3i$。于是 $\\overline{z} = 2 - 3i$，$-z = -2 - 3i$，$iz = 2i + 3i^2 = -3 + 2i$。检验：$iz$ 是点 $(-3, 2)$，到原点的距离同样是 $\\sqrt{13}$，而且 $(2)(-3) + (3)(2) = 0$，所以它与 $(2, 3)$ 相差四分之一圈。\n\n> **注意。** 共轭是反射，不是旋转；交换两部分又是另一种变换：对 $2 + 3i$ 它给出 $3 + 2i$，既不是 $\\overline{z}$，也不是 $-z$ 或 $iz$。",
  ],
  (rng) => {
    const [x, y] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
    /** Relative is a number made from z: its name in LaTeX, its value, what it is in English and Chinese, and a check of it. */
    type Relative = readonly [name: string, value: string, what: Pair, check: Pair];
    const relatives: readonly Relative[] = [
      [
        "\\overline{z}",
        cx(x, -y),
        ["the conjugate of $z$, its mirror image in the real axis", "$z$ 的共轭，即关于实轴的镜像"],
        [`$z + \\overline{z} = ${2 * x}$ is real, as the imaginary parts cancel.`, `$z + \\overline{z} = ${2 * x}$ 是实数，虚部相消。`],
      ],
      [
        "-z",
        cx(-x, -y),
        ["the negative of $z$, the point through the origin", "$z$ 的相反数，即关于原点的对称点"],
        [
          "$z + (-z) = 0$, and the two points are the same distance from the origin on opposite sides.",
          "$z + (-z) = 0$，两点在原点两侧，到原点距离相同。",
        ],
      ],
      [
        "iz",
        cx(-y, x),
        ["$z$ turned a quarter turn counterclockwise, which is $iz$", "$z$ 逆时针旋转四分之一圈，即 $iz$"],
        [
          `the point $(${-y}, ${x})$ has the same squared distance $${x * x + y * y}$ from the origin, and $(${x})(${-y}) + (${y})(${x})$ is $0$, so it is a quarter turn away.`,
          `点 $(${-y}, ${x})$ 到原点距离的平方同样是 $${x * x + y * y}$，而 $(${x})(${-y}) + (${y})(${x})$ 等于 $0$，所以相差四分之一圈。`,
        ],
      ],
      [
        "-iz",
        cx(y, -x),
        ["$z$ turned a quarter turn clockwise, which is $-iz$", "$z$ 顺时针旋转四分之一圈，即 $-iz$"],
        [
          `the point $(${y}, ${-x})$ has the same squared distance $${x * x + y * y}$ from the origin, and $(${x})(${y}) + (${y})(${-x})$ is $0$, so it is a quarter turn away.`,
          `点 $(${y}, ${-x})$ 到原点距离的平方同样是 $${x * x + y * y}$，而 $(${x})(${y}) + (${y})(${-x})$ 等于 $0$，所以相差四分之一圈。`,
        ],
      ],
      [
        "z",
        cx(x, y),
        ["$z$ itself", "$z$ 本身"],
        [
          `the point is $${Math.abs(x)}$ ${x > 0 ? "right of" : "left of"} the imaginary axis and $${Math.abs(y)}$ ${y > 0 ? "above" : "below"} the real axis.`,
          `这个点在虚轴${x > 0 ? "右" : "左"}边 $${Math.abs(x)}$ 处，在实轴${y > 0 ? "上" : "下"}方 $${Math.abs(y)}$ 处。`,
        ],
      ],
    ];
    const others: readonly (readonly [string, Pair])[] = [
      [
        cx(y, x),
        [
          "$z$ with its real and imaginary parts swapped, its mirror image in the line $y = x$",
          "交换 $z$ 的实部和虚部，即关于直线 $y = x$ 的镜像",
        ],
      ],
      [cx(-y, -x), ["the mirror image of $z$ in the line $y = -x$", "$z$ 关于直线 $y = -x$ 的镜像"]],
    ];
    const [name, value, what, check] = rng.pick(relatives);
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
    const described = [...relatives.map(([, v, w]) => [v, w] as const), ...others];
    return reasoned(
      choose(
        rng,
        [`The point $z$ is drawn in the complex plane. What is $${name}$?`, `图中画出了复平面上的点 $z$。$${name}$ 是多少？`],
        same(value),
        described.map(([v]) => same(v)),
        [
          `**Step 1: Read the point.** The point is at $(${x}, ${y})$, so $z = ${cx(x, y)}$.\n\n**Step 2: Apply the rule.** We want ${what[0]}, and ${rule[0]}. So $${name} = ${value}$.\n\n**Check.** For $${value}$, ${check[0]}`,
          `**第一步：读点。**点在 $(${x}, ${y})$，所以 $z = ${cx(x, y)}$。\n\n**第二步：套用规则。**所求是${what[1]}，${rule[1]}。所以 $${name} = ${value}$。\n\n**检验。**对 $${value}$，${check[1]}`,
        ],
        fig(
          argand(6),
          [{ kind: "point", at: [x, y], label: "z", dir: y > 0 ? "ne" : "se", accent: true }],
          [`A point z at (${x}, ${y}) in the complex plane.`, `复平面上的点 z，位于 (${x}, ${y})。`],
        ),
      ),
      described.map(([v, [en, zh]]) => [`$${v}$`, `This is ${en}, not $${name}$.`, `这是${zh}，不是 $${name}$。`] as const),
    );
  },
);

const distanceBetweenPoints = point(
  "the-distance-between-two-drawn-numbers",
  ["The distance between two drawn numbers", "图中两个复数的距离"],
  [
    "The modulus of a difference is a distance in the plane: the number $|z - w|$ is how far apart the two points are. Read how far apart they are across and how far apart they are up, then use the Pythagorean theorem. Adding the two offsets gives the length of a detour along the grid, which is too long.\n\nFor example, $z = 1 + 5i$ and $w = 4 + i$ are $3$ apart across and $4$ apart up, so $|z - w| = \\sqrt{9 + 16} = 5$. Check: $z - w = -3 + 4i$, whose modulus is $\\sqrt{(-3)^2 + 4^2} = 5$.\n\n> **Watch out.** The distance is not the sum of the offsets, $3 + 4 = 7$, nor their difference. Square them, add, and take the square root.",
    "差的模是平面上的距离：$|z - w|$ 就是两点相距多远。读出两点的横向距离和纵向距离，再用勾股定理。把两个距离相加得到的是沿网格绕行的长度，它太长了。\n\n例如，$z = 1 + 5i$ 与 $w = 4 + i$ 横向相差 $3$，纵向相差 $4$，所以 $|z - w| = \\sqrt{9 + 16} = 5$。检验：$z - w = -3 + 4i$，它的模是 $\\sqrt{(-3)^2 + 4^2} = 5$。\n\n> **注意。** 距离不是两个差的和 $3 + 4 = 7$，也不是它们的差。要把它们平方、相加，再开平方。",
  ],
  (rng) => {
    const { dx, dy, length } = tripleStep(rng);
    const [x, y] = [rng.int(-6, 6 - dx), rng.int(-6, 6 - dy)];
    const flip = rng.bool();
    const z: Point = flip ? [x, y + dy] : [x, y];
    const w: Point = flip ? [x + dx, y] : [x + dx, y + dy];
    const [re, im] = [z[0] - w[0], z[1] - w[1]];
    return ask(
      [
        "The points $z$ and $w$ are drawn in the complex plane. What is $|z - w|$?",
        "图中画出了复平面上的点 $z$ 和 $w$。$|z - w|$ 是多少？",
      ],
      length,
      [dx + dy, Math.abs(dx - dy), Math.max(dx, dy)],
      [
        `**Step 1: Read the offsets.** The drawing gives $z = ${cx(z[0], z[1])}$ and $w = ${cx(w[0], w[1])}$. They differ by $${dx}$ across and by $${dy}$ up.\n\n**Step 2: Use the Pythagorean theorem.** The distance is the hypotenuse of a right triangle with these legs:\n\n$$|z - w| = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${length}$$\n\n**Check.** Subtract the numbers directly: $z - w = ${cx(re, im)}$, and $(${re})^2 + (${im})^2 = ${length * length} = ${length}^2$.`,
        `**第一步：读出差。**由图，$z = ${cx(z[0], z[1])}$，$w = ${cx(w[0], w[1])}$。两点横向相差 $${dx}$，纵向相差 $${dy}$。\n\n**第二步：用勾股定理。**距离是以它们为直角边的直角三角形的斜边：\n\n$$|z - w| = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${length}$$\n\n**检验。**直接相减：$z - w = ${cx(re, im)}$，而 $(${re})^2 + (${im})^2 = ${length * length} = ${length}^2$。`,
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
      "The principal argument is the one angle of a point that lies above $-\\pi$ and at most $\\pi$. Points above the real axis have positive principal argument. Points below it have negative principal argument, measured clockwise from the positive real axis, even though the same direction also has a positive angle larger than $\\pi$.\n\nFor example, the point $(1, -1)$ is reached by turning clockwise through $\\frac{\\pi}{4}$, so its principal argument is $-\\frac{\\pi}{4}$. Check: the other angles of this direction, such as $\\frac{7\\pi}{4}$, differ from it by full turns of $2\\pi$ and lie outside $(-\\pi, \\pi]$.\n\n> **Watch out.** The range includes $\\pi$ but not $-\\pi$: a point on the negative real axis has principal argument $\\pi$.",
      "主辐角是点的辐角中大于 $-\\pi$ 且不超过 $\\pi$ 的那一个。实轴上方的点主辐角为正。实轴下方的点主辐角为负，从正实轴按顺时针方向量取，尽管同一方向也有大于 $\\pi$ 的正角。\n\n例如，点 $(1, -1)$ 由正实轴顺时针转 $\\frac{\\pi}{4}$ 得到，所以它的主辐角是 $-\\frac{\\pi}{4}$。检验：这个方向的其他角，如 $\\frac{7\\pi}{4}$，与它相差整数圈 $2\\pi$，都不在 $(-\\pi, \\pi]$ 内。\n\n> **注意。** 范围包含 $\\pi$ 而不包含 $-\\pi$：负实轴上的点主辐角是 $\\pi$。",
    ],
    (rng) => {
      const k = rng.int(-3, 4);
      const a = rng.int(1, 4);
      const unit = octant(k);
      const z: Point = [a * unit[0], a * unit[1]];
      const answer = piTimes(k, 4);
      const partner = piTimes(k + 8, 4);
      const mirrored = piTimes(-k, 4);
      const opposite = piTimes(k > 0 ? k - 4 : k + 4, 4);
      const turned = piTimes(k + 2, 4);
      const quadrant = k === 1 ? 1 : k === 3 ? 2 : k === -3 ? 3 : 4;
      const where: Pair =
        k === 0
          ? ["lies on the positive real axis", "在正实轴上"]
          : k === 4
            ? ["lies on the negative real axis", "在负实轴上"]
            : k === 2
              ? ["lies on the positive imaginary axis", "在正虚轴上"]
              : k === -2
                ? ["lies on the negative imaginary axis", "在负虚轴上"]
                : [
                    `lies on the diagonal of Quadrant ${["I", "II", "III", "IV"][quadrant - 1]}, ${k > 0 ? "above" : "below"} the real axis`,
                    `在第${["一", "二", "三", "四"][quadrant - 1]}象限的对角线上，位于实轴${k > 0 ? "上" : "下"}方`,
                  ];
      return reasoned(
        choose(
          rng,
          [
            "The point $z$ is drawn with the ray from the origin. What is the principal argument of $z$?",
            "图中画出了点 $z$ 和从原点出发的射线。$z$ 的主辐角是多少？",
          ],
          same(answer),
          [same(partner), same(mirrored), same(opposite), same(turned)],
          [
            `**Step 1: Read the direction.** The ray goes from the origin to $(${z[0]}, ${z[1]})$, which ${where[0]}.\n\n**Step 2: Measure within the principal range.** ${
              k < 0
                ? `The point lies below the real axis, so the angle is measured clockwise and is negative: it is $${answer}$. Its positive partner $${partner}$ lies outside the principal range.`
                : `The ray turns counterclockwise from the positive real axis through $${answer}$, and this angle lies in the principal range, so it is the principal argument.`
            }\n\n**Check.** Any other angle of this direction differs by a full turn: $${partner}$ and $${piTimes(k - 8, 4)}$ both lie outside $(-\\pi, \\pi]$, so $${answer}$ is the only one in the range.`,
            `**第一步：读方向。**射线从原点指向 $(${z[0]}, ${z[1]})$，${where[1]}。\n\n**第二步：在主值范围内量角。**${
              k < 0
                ? `点在实轴下方，所以角按顺时针量取，为负：它是 $${answer}$。与之对应的正角 $${partner}$ 不在主值范围内。`
                : `射线从正实轴逆时针转过 $${answer}$，这个角在主值范围内，所以它就是主辐角。`
            }\n\n**检验。**这个方向的其他角都与它相差整数圈：$${partner}$ 和 $${piTimes(k - 8, 4)}$ 都不在 $(-\\pi, \\pi]$ 内，所以只有 $${answer}$ 在范围内。`,
          ],
          fig(
            argand(5),
            [
              { kind: "segment", a: [0, 0], b: z, accent: true },
              { kind: "point", at: z, label: "z", dir: z[1] < 0 ? "s" : "n", accent: true },
            ],
            [`A ray from the origin to the point z at (${z[0]}, ${z[1]}).`, `从原点到点 z 的射线，z 位于 (${z[0]}, ${z[1]})。`],
          ),
        ),
        [
          [
            `$${partner}$`,
            "This is the same direction plus a full turn of 2π, which lies outside the principal range from −π to π.",
            "这是同一方向再加一整圈 2π，不在 −π 到 π 的主值范围内。",
          ],
          k === 4
            ? [
                `$${mirrored}$`,
                "The range excludes −π; the negative real axis has principal argument π.",
                "主值范围不含 −π；负实轴的主辐角是 π。",
              ]
            : [
                `$${mirrored}$`,
                "This is the angle of the mirror image in the real axis: the sign is wrong.",
                "这是关于实轴的镜像点的辐角：符号反了。",
              ],
          [`$${opposite}$`, "This points the opposite way, through the origin.", "这指向相反方向，经过原点的另一侧。"],
          [`$${turned}$`, "This is a quarter turn, π/2, counterclockwise from the ray.", "这比射线逆时针多转了四分之一圈 π/2。"],
        ],
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
      "The solutions of $z^n = w$ are $n$ points evenly spaced on a circle centered at the origin. So the number of dots gives $n$, the radius $R$ gives $|w| = R^n$, and multiplying the angle of any one dot by $n$ gives the angle of $w$. A dot on the positive real axis means that $w$ is positive.\n\nFor example, $4$ dots on a circle of radius $2$, one of them at the angle $\\frac{\\pi}{4}$, solve $z^{4} = w$ with $|w| = 2^{4} = 16$ and the angle of $w$ equal to $4 \\cdot \\frac{\\pi}{4} = \\pi$. So $w = -16$. Check: that dot is $\\sqrt{2} + \\sqrt{2}i$, whose square is $4i$, and $(4i)^{2} = -16$.\n\n> **Watch out.** The modulus of $w$ is the radius raised to the power $n$, not $n$ times the radius. When no dot lies on the positive real axis, $w$ is not a positive number.",
      "$z^n = w$ 的解是以原点为圆心的圆上均匀分布的 $n$ 个点。所以点的个数给出 $n$，半径 $R$ 给出 $|w| = R^n$，任一点的辐角乘以 $n$ 给出 $w$ 的辐角。正实轴上有点就说明 $w$ 为正。\n\n例如，半径为 $2$ 的圆上有 $4$ 个点，其中一个的辐角是 $\\frac{\\pi}{4}$，它们是 $z^{4} = w$ 的解，$|w| = 2^{4} = 16$，$w$ 的辐角为 $4 \\cdot \\frac{\\pi}{4} = \\pi$，所以 $w = -16$。检验：这个点是 $\\sqrt{2} + \\sqrt{2}i$，它的平方是 $4i$，而 $(4i)^{2} = -16$。\n\n> **注意。** $w$ 的模是半径的 $n$ 次方，而不是半径的 $n$ 倍。正实轴上没有点时，$w$ 不是正数。",
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
      const s1 = stepLabel(1, "Count the dots", "数点");
      const s2 = stepLabel(2, "Read the radius", "读出半径");
      const s3 = stepLabel(3, "Find the direction", "确定方向");
      const other = positive ? piTimes(2, n) : piTimes(3, n);
      const otherTurns = positive ? "2\\pi" : "3\\pi = \\pi + 2\\pi";
      return ask(
        [
          "The dots are all the solutions of an equation $z^n = w$ with $w$ a real number. What is $w$?",
          "图中的点是方程 $z^n = w$ 的全部解，其中 $w$ 是实数。$w$ 是多少？",
        ],
        answer,
        [-answer, n * R, R ** (n - 1)],
        [
          `${s1.en} There are $${n}$ dots, so the equation is $z^{${n}} = w$.\n\n${s2.en} The dots lie at distance $${R}$ from the origin, so $|w| = ${R}^{${n}} = ${R ** n}$.\n\n${s3.en} ${positive ? `One dot lies on the positive real axis, at the angle $0$, and $${n} \\cdot 0 = 0$, so $w$ is positive` : `The first dot above the positive real axis has the angle $${piTimes(1, n)}$, and $${n}$ times that is $\\pi$, so $w$ is negative`}. This gives $w = ${answer}$.\n\n**Check.** Use another dot. The next one has the angle $${other}$, and $${n}$ times that is $${otherTurns}$, the same direction again. Its modulus $${R}$ raised to the power $${n}$ is $${R ** n}$, so it too gives $w = ${answer}$.`,
          `${s1["zh-CN"]}共有 $${n}$ 个点，所以方程是 $z^{${n}} = w$。\n\n${s2["zh-CN"]}这些点到原点的距离为 $${R}$，所以 $|w| = ${R}^{${n}} = ${R ** n}$。\n\n${s3["zh-CN"]}${positive ? `有一个点在正实轴上，辐角为 $0$，$${n} \\cdot 0 = 0$，所以 $w$ 为正` : `正实轴上方第一个点的辐角是 $${piTimes(1, n)}$，乘以 $${n}$ 得 $\\pi$，所以 $w$ 为负`}，于是 $w = ${answer}$。\n\n**检验。** 换一个点来看。下一个点的辐角是 $${other}$，乘以 $${n}$ 得 $${otherTurns}$，方向相同。它的模 $${R}$ 的 $${n}$ 次方是 $${R ** n}$，同样得到 $w = ${answer}$。`,
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
      "The winding number of a loop about a point counts its net counterclockwise turns around that point. To read it, draw a ray from the point to infinity and add one for each crossing where the loop passes counterclockwise and subtract one for each crossing where it passes clockwise. A point outside the loop has winding number zero. In the drawing, a loop with an inner loop runs counterclockwise: a ray from the point in the inner loop crosses the path twice, so the winding number is $1 + 1 = 2$; the point between the loops gets 1, and the point far away gets 0.\n\nCheck: walking from the far point inward, each crossing of the path changes the winding number by one: 0 outside, 1 after crossing the outer curve, 2 after crossing the inner loop.\n\n> **Watch out.** Read the arrows first: the same loop traced clockwise gives $-2$, $-1$ and 0. And a point inside the outer curve but outside the inner loop is crossed only once.",
      "回路关于一点的环绕数计算它绕该点逆时针转过的净圈数。读取时，从该点向无穷远画一条射线，回路每逆时针穿过一次加一，每顺时针穿过一次减一。回路外的点环绕数为零。图中一条带内圈的回路逆时针走：从内圈中的点出发的射线穿过路径两次，所以环绕数是 $1 + 1 = 2$；两圈之间的点得 1，远处的点得 0。\n\n检验：从远处的点向内走，每穿过路径一次环绕数变化一：外面是 0，穿过外圈后是 1，穿过内圈后是 2。\n\n> **注意。** 先读箭头：同一条回路顺时针走时给出 $-2$、$-1$ 和 0。外圈之内、内圈之外的点只被穿过一次。",
    ],
    (rng) =>
      until(() => {
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
        const sign = counterclockwise ? 1 : -1;
        const misses: Miss[] =
          base === 0
            ? [
                [sign, "That treats $P$ as inside the outer curve.", "那把 $P$ 当成在外圈之内。"],
                [sign * 2, "That treats $P$ as inside the inner loop.", "那把 $P$ 当成在内圈之中。"],
              ]
            : [
                [-answer, "That reads the arrows the wrong way round.", "那把箭头方向读反了。"],
                [
                  sign * (3 - base),
                  base === 2
                    ? "That counts only the outer curve; the inner loop winds around $P$ as well."
                    : "That counts the inner loop too, but $P$ lies outside it.",
                  base === 2 ? "那只算了外圈；内圈也绕着 $P$。" : "那把内圈也算上了，但 $P$ 在内圈之外。",
                ],
                [0, "That treats $P$ as outside the loop.", "那把 $P$ 当成在回路之外。"],
              ];
        return worked(
          [
            "The loop is traced once in the direction of its arrows. What is its winding number about $P$?",
            "回路按箭头方向走一遍。它关于 $P$ 的环绕数是多少？",
          ],
          answer,
          misses,
          [
            [
              ["Read the direction", "读方向"],
              [
                `The arrows run ${counterclockwise ? "counterclockwise, so each crossing counts $+1$" : "clockwise, so each crossing counts $-1$"}.`,
                `箭头是${counterclockwise ? "逆时针，所以每次穿过计 $+1$" : "顺时针，所以每次穿过计 $-1$"}。`,
              ],
            ],
            [
              ["Count the crossings", "数穿过次数"],
              [`${body[0]}.`, `${body[1]}。`],
            ],
            [
              ["Combine", "合并"],
              [`The winding number is $${answer}$.`, `环绕数是 $${answer}$。`],
            ],
          ],
          [
            base === 0
              ? "Start far away, where the winding number is 0; $P$ is reached without crossing the path, so it stays 0."
              : `Start far away at 0 and walk to $P$: crossing the outer curve changes the count by $${sign}$${base === 2 ? `, and crossing into the inner loop changes it by $${sign}$ again` : ""}, giving $${answer}$.`,
            base === 0
              ? "从远处出发，那里环绕数是 0；到达 $P$ 时没有穿过路径，所以仍是 0。"
              : `从远处的 0 出发走到 $P$：穿过外圈时计数变化 $${sign}$${base === 2 ? `，再进入内圈时又变化 $${sign}$` : ""}，得 $${answer}$。`,
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
      }),
  ),
  figure: complexDrawings1["winding-numbers#the-winding-number-of-a-drawn-loop"],
};

const residueSum = point(
  "the-residue-theorem-from-a-drawing",
  ["The residue theorem from a drawing", "由图用留数定理"],
  [
    "The residue theorem adds only the residues at the poles inside the contour, and a clockwise contour changes the sign of the result. So a drawing does most of the work: first sort the poles into inside and outside, then read the direction of travel, and only then add. Poles outside the contour contribute nothing at all. For example, with residues 2 and $-3$ inside a clockwise circle and 4 outside it, $\\frac{1}{2\\pi i}\\oint_C f(z)\\,dz = -(2 - 3) = 1$.\n\nCheck: traced counterclockwise, the same circle would give $2 - 3 = -1$, and reversing a contour negates its integral, so clockwise gives 1.\n\n> **Watch out.** Leave out every pole outside the circle, and apply the sign of the direction to the whole sum, not to one residue.",
    "留数定理只把围线内部极点的留数相加，顺时针的围线会改变结果的符号。所以图完成了大部分工作：先把极点分成内部和外部，再读行进方向，最后才相加。围线外部的极点没有任何贡献。例如，留数 2 和 $-3$ 在一个顺时针圆内，4 在圆外，则 $\\frac{1}{2\\pi i}\\oint_C f(z)\\,dz = -(2 - 3) = 1$。\n\n检验：逆时针走同一个圆得 $2 - 3 = -1$，而反转围线使积分变号，所以顺时针得 1。\n\n> **注意。** 去掉圆外的每个极点，并把方向的符号作用于整个和，而不是某一个留数。",
  ],
  (rng) =>
    until(() => {
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
      const sign = counterclockwise ? 1 : -1;
      const [p, q] = inside.map((x) => x.value) as [number, number];
      const added = `${p} ${q < 0 ? `- ${-q}` : `+ ${q}`}`;
      return worked(
        [
          "Each dot is a simple pole of $f$, labelled with its residue, and $f$ is analytic elsewhere. The contour $C$ is traced once along its arrows. What is $\\frac{1}{2\\pi i}\\oint_C f(z)\\,dz$?",
          "每个点都是 $f$ 的单极点，旁边标有留数，$f$ 在其他地方解析。围线 $C$ 沿箭头方向走一遍。$\\frac{1}{2\\pi i}\\oint_C f(z)\\,dz$ 是多少？",
        ],
        answer,
        [
          [-answer, "That ignores the direction of the arrows.", "那忽略了箭头的方向。"],
          [sign * total, "That adds the residues of the poles outside the circle too.", "那把圆外极点的留数也加上了。"],
          [sign * (total - sum), "That adds the poles outside the circle instead of those inside.", "那加的是圆外的极点，而不是圆内的。"],
        ],
        [
          [
            ["Sort the poles", "给极点分类"],
            [
              `Two poles lie inside the circle, with residues ${p} and ${q}; the other two lie outside and do not count.`,
              `两个极点在圆内，留数为 ${p} 和 ${q}；另外两个在圆外，不计入。`,
            ],
          ],
          [
            ["Add the inside residues", "把圆内留数相加"],
            [`$${added} = ${sum}$.`, `$${added} = ${sum}$。`],
          ],
          [
            ["Apply the direction", "考虑方向"],
            [
              counterclockwise
                ? `The circle runs counterclockwise, so the value is $${answer}$.`
                : `The circle runs clockwise, so the sign changes: $${answer}$.`,
              counterclockwise ? `圆是逆时针的，所以结果是 $${answer}$。` : `圆是顺时针的，所以符号改变：$${answer}$。`,
            ],
          ],
        ],
        [
          `Shrink $C$ to two small circles around the inside poles, traced the same way; each gives its residue times $${sign}$, so the total is $${sign} \\cdot ${sum < 0 ? `(${sum})` : sum} = ${answer}$.`,
          `把 $C$ 缩成绕圆内两个极点的小圆，方向不变；每个给出留数乘 $${sign}$，所以总和为 $${sign} \\cdot ${sum < 0 ? `(${sum})` : sum} = ${answer}$。`,
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
    }),
);

const cauchyFormulaFromDrawing = {
  ...point(
    "cauchys-formula-inside-or-outside",
    ["Cauchy's formula: inside or outside", "柯西公式：在内还是在外"],
    [
      "For $g$ analytic everywhere, the integral $\\frac{1}{2\\pi i}\\oint \\frac{g(z)}{z - a}\\,dz$ around a counterclockwise circle equals $g(a)$ when the point $a$ lies inside the circle and zero when it lies outside, as drawn. The same formula therefore has two different values, and the drawing is what tells them apart. For $g(z) = z^2 + 5$ and the circle $|z| = 2$: at $a = 1$, inside, the value is $1^2 + 5 = 6$; at $a = 4$, outside, it is 0.\n\nCheck: $z^2 + 5 = (z - a)(z + a) + (a^2 + 5)$; the first part integrates to 0, and the second gives $a^2 + 5$ times the winding number of the circle about $a$, which is 1 inside and 0 outside.\n\n> **Watch out.** Locate $a$ against the circle's center and radius before using the formula, and evaluate the whole numerator at $a$, constant included.",
      "若 $g$ 处处解析，如图，沿逆时针圆的积分 $\\frac{1}{2\\pi i}\\oint \\frac{g(z)}{z - a}\\,dz$ 在点 $a$ 位于圆内时等于 $g(a)$，在圆外时等于零。同一个公式有两种不同的值，要靠图来区分。对 $g(z) = z^2 + 5$ 和圆 $|z| = 2$：$a = 1$ 在圆内，值为 $1^2 + 5 = 6$；$a = 4$ 在圆外，值为 0。\n\n检验：$z^2 + 5 = (z - a)(z + a) + (a^2 + 5)$；第一部分积分为 0，第二部分给出 $a^2 + 5$ 乘以圆关于 $a$ 的环绕数，在圆内为 1，在圆外为 0。\n\n> **注意。** 用公式之前，先对照圆心和半径确定 $a$ 的位置，并在 $a$ 处计算整个分子，包括常数。",
    ],
    (rng) =>
      until(() => {
        const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
        const r = rng.int(2, 3);
        const inside = rng.bool();
        const a = rng.pick(
          [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((x) => (inside ? Math.hypot(x - h, k) <= r - 0.5 : Math.hypot(x - h, k) >= r + 0.5)),
        );
        const c = rng.int(1, 9);
        const value = a * a + c;
        const power = a < 0 ? `(${a})` : `${a}`;
        const d = Math.hypot(a - h, k);
        const far = Number.isInteger(d) ? `${d}` : `\\sqrt{${(a - h) ** 2 + k * k}}`;
        const misses: Miss[] = inside
          ? [
              [0, "That treats $a$ as outside the circle.", "那把 $a$ 当成在圆外。"],
              [a * a, `That drops the constant ${c} from the numerator.`, `那漏掉了分子中的常数 ${c}。`],
              [a + c, "That uses $a$ instead of $a^2$.", "那用了 $a$ 而不是 $a^2$。"],
            ]
          : [
              [value, "That uses Cauchy's formula, but $a$ lies outside the circle.", "那用了柯西公式，但 $a$ 在圆外。"],
              [a * a, "That treats $a$ as inside and also drops the constant.", "那把 $a$ 当成在圆内，还漏掉了常数。"],
              [
                1,
                "That takes the integral of $\\frac{1}{z - a}$ as 1 even though $a$ is outside.",
                "那把 $\\frac{1}{z - a}$ 的积分当成 1，但 $a$ 在圆外。",
              ],
            ];
        return worked(
          [
            `The contour $C$ is traced once along its arrows and the point $a$ is marked on the real axis. What is $\\frac{1}{2\\pi i}\\oint_C \\frac{z^2 + ${c}}{z - a}\\,dz$?`,
            `围线 $C$ 沿箭头方向走一遍，实轴上标出了点 $a$。$\\frac{1}{2\\pi i}\\oint_C \\frac{z^2 + ${c}}{z - a}\\,dz$ 是多少？`,
          ],
          inside ? value : 0,
          misses,
          [
            [
              ["Locate a", "确定 a 的位置"],
              [
                `The center is $(${h}, ${k})$ and the radius ${r}; the point $a = ${a}$ is at distance $${far}$, so it is ${inside ? "inside" : "outside"}.`,
                `圆心是 $(${h}, ${k})$，半径为 ${r}；点 $a = ${a}$ 到圆心的距离是 $${far}$，所以在圆${inside ? "内" : "外"}。`,
              ],
            ],
            inside
              ? [
                  ["Use Cauchy's formula", "用柯西公式"],
                  [
                    `The value is the numerator at $a$: $${power}^2 + ${c} = ${value}$.`,
                    `值是分子在 $a$ 处的值：$${power}^2 + ${c} = ${value}$。`,
                  ],
                ]
              : [
                  ["Use Cauchy's theorem", "用柯西定理"],
                  ["The integrand is analytic on and inside the circle, so the integral is 0.", "被积函数在圆上及圆内解析，所以积分为 0。"],
                ],
          ],
          [
            `Write $z^2 + ${c} = (z - a)(z + a) + ${value}$: the polynomial part integrates to 0, and $${value} \\cdot \\frac{1}{2\\pi i}\\oint \\frac{dz}{z - a}$ is ${value} times the winding number about $a$, which is ${inside ? 1 : 0}.`,
            `写成 $z^2 + ${c} = (z - a)(z + a) + ${value}$：多项式部分积分为 0，而 $${value} \\cdot \\frac{1}{2\\pi i}\\oint \\frac{dz}{z - a}$ 等于 ${value} 乘以关于 $a$ 的环绕数，即 ${inside ? 1 : 0}。`,
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
      }),
  ),
  figure: complexDrawings1["cauchys-integral-formula#cauchys-formula-inside-or-outside"],
};

const pathIndependence = point(
  "an-integral-along-a-drawn-path",
  ["An integral along a drawn path", "沿图中路径的积分"],
  [
    "When the integrand has an antiderivative, the integral along a path depends only on where the path starts and ends, however much the path wanders between them. For $2z$ the antiderivative is $z^2$, so the integral is the square of the end point minus the square of the start point. The arrow on the drawing tells which end is which. From $A = -1 + 2i$ to $B = 2 + i$: $A^2 = -3 - 4i$ and $B^2 = 3 + 4i$, so the integral is $B^2 - A^2 = 6 + 8i$.\n\nCheck: along the straight segment $z = A + t(B - A)$, $\\int_0^1 2(A + t(B - A))(B - A)\\,dt = 2A(B - A) + (B - A)^2 = B^2 - A^2$, the same value.\n\n> **Watch out.** End minus start, in the direction of the arrow: $A^2 - B^2$ has the wrong sign, and the shape of the path does not enter.",
    "被积函数有原函数时，沿路径的积分只取决于路径的起点和终点，不管中间怎样绕行。$2z$ 的原函数是 $z^2$，所以积分等于终点的平方减起点的平方。图上的箭头说明哪一端是哪一端。从 $A = -1 + 2i$ 到 $B = 2 + i$：$A^2 = -3 - 4i$，$B^2 = 3 + 4i$，所以积分是 $B^2 - A^2 = 6 + 8i$。\n\n检验：沿直线段 $z = A + t(B - A)$，$\\int_0^1 2(A + t(B - A))(B - A)\\,dt = 2A(B - A) + (B - A)^2 = B^2 - A^2$，值相同。\n\n> **注意。** 按箭头方向用终点减起点：$A^2 - B^2$ 的符号是错的；路径的形状不起作用。",
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
    const slips: Slip[] = [
      [
        same(cx(pa[0] - pb[0], pa[1] - pb[1])),
        "That subtracts the end from the start; the arrow runs from A to B.",
        "那用起点减终点；箭头是从 A 到 B。",
      ],
      [same(cx(pa[0] + pb[0], pa[1] + pb[1])), "That adds the squares instead of subtracting.", "那把平方相加了，而不是相减。"],
      [
        same(cx(bx - ax, by - ay)),
        "That integrates 1 instead of 2z: it is only the displacement B − A.",
        "那积的是 1 而不是 2z：那只是位移 B − A。",
      ],
      [
        same(cx(2 * (bx - ax), 2 * (by - ay))),
        "That treats z as the constant 1 and multiplies 2 by the displacement.",
        "那把 z 当成常数 1，用 2 乘以位移。",
      ],
      [same(cx(pb[0], pb[1])), "That leaves out the start point.", "那漏掉了起点。"],
    ];
    const diff: [number, number] = [bx - ax, by - ay];
    const cross: [number, number] = [2 * (ax * diff[0] - ay * diff[1]), 2 * (ax * diff[1] + ay * diff[0])];
    const dd = square(diff[0], diff[1]);
    return chosen(
      rng,
      [
        "The path $\\gamma$ runs from $A$ to $B$ along the arrow. What is $\\int_\\gamma 2z\\,dz$?",
        "路径 $\\gamma$ 沿箭头从 $A$ 走到 $B$。$\\int_\\gamma 2z\\,dz$ 是多少？",
      ],
      same(answer),
      slips,
      [
        [
          ["Find an antiderivative", "找原函数"],
          [
            "$z^2$ has derivative $2z$, so only the end points matter, not the shape of the path.",
            "$z^2$ 的导数是 $2z$，所以只有端点有关，与路径形状无关。",
          ],
        ],
        [
          ["Read the ends", "读出端点"],
          [
            `$A = ${cx(ax, ay)}$ and $B = ${cx(bx, by)}$, so $A^2 = ${cx(pa[0], pa[1])}$ and $B^2 = ${cx(pb[0], pb[1])}$.`,
            `$A = ${cx(ax, ay)}$，$B = ${cx(bx, by)}$，所以 $A^2 = ${cx(pa[0], pa[1])}$，$B^2 = ${cx(pb[0], pb[1])}$。`,
          ],
        ],
        [
          ["Subtract", "相减"],
          [`$B^2 - A^2 = ${answer}$.`, `$B^2 - A^2 = ${answer}$。`],
        ],
      ],
      [
        `Along the straight segment from $A$ to $B$, the integral is $2A(B - A) + (B - A)^2$ with $B - A = ${cx(diff[0], diff[1])}$: $2A(B - A) = ${cx(cross[0], cross[1])}$ and $(B - A)^2 = ${cx(dd[0], dd[1])}$, which add to $${answer}$.`,
        `沿从 $A$ 到 $B$ 的直线段，积分为 $2A(B - A) + (B - A)^2$，其中 $B - A = ${cx(diff[0], diff[1])}$：$2A(B - A) = ${cx(cross[0], cross[1])}$，$(B - A)^2 = ${cx(dd[0], dd[1])}$，相加得 $${answer}$。`,
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
    "The ML inequality bounds an integral by the largest size $M$ of the integrand on the path times the length $L$ of the path. Both factors are needed, and the length comes from the geometry of the path: for a straight segment it is the distance between the ends, which the Pythagorean theorem gives from the grid. For a segment from $(0, 0)$ to $(3, 4)$ with $|f| \\le 2$ on it, $L = \\sqrt{3^2 + 4^2} = 5$ and the bound is $2 \\cdot 5 = 10$.\n\nCheck: on $z = (3 + 4i)t$ for $0 \\le t \\le 1$, $|dz| = |3 + 4i| \\, dt = 5 \\, dt$, so $\\int |f| \\, |dz| \\le 2 \\cdot 5 = 10$.\n\n> **Watch out.** The length of a slanted segment is $\\sqrt{\\Delta x^2 + \\Delta y^2}$, not $\\Delta x + \\Delta y$; and the bound needs both $M$ and $L$.",
    "ML 不等式用被积函数在路径上的最大模 $M$ 乘以路径长度 $L$ 来估计积分。两个因子都需要，而长度来自路径的几何：直线段的长度是两端的距离，可以从网格上用勾股定理得到。对从 $(0, 0)$ 到 $(3, 4)$、其上 $|f| \\le 2$ 的线段，$L = \\sqrt{3^2 + 4^2} = 5$，上界是 $2 \\cdot 5 = 10$。\n\n检验：在 $z = (3 + 4i)t$（$0 \\le t \\le 1$）上，$|dz| = |3 + 4i| \\, dt = 5 \\, dt$，所以 $\\int |f| \\, |dz| \\le 2 \\cdot 5 = 10$。\n\n> **注意。** 斜线段的长度是 $\\sqrt{\\Delta x^2 + \\Delta y^2}$，不是 $\\Delta x + \\Delta y$；上界同时需要 $M$ 和 $L$。",
  ],
  (rng) =>
    until(() => {
      const { dx, dy, length } = tripleStep(rng);
      const [x, y] = [rng.int(-6, 6 - dx), rng.int(-6, 6 - dy)];
      const M = rng.int(2, 9);
      const flip = rng.bool();
      const a: Point = flip ? [x, y + dy] : [x, y];
      const b: Point = flip ? [x + dx, y] : [x + dx, y + dy];
      const start = a[0] === 0 && a[1] === 0 ? "" : `${cx(a[0], a[1])} + `;
      const step = `(${cx(dx, flip ? -dy : dy)}) t`;
      return worked(
        [
          `On the segment $\\gamma$ drawn, $|f(z)| \\le ${M}$. What upper bound does the ML inequality give for $\\left|\\int_\\gamma f(z)\\,dz\\right|$?`,
          `在图中的线段 $\\gamma$ 上，$|f(z)| \\le ${M}$。ML 不等式给出 $\\left|\\int_\\gamma f(z)\\,dz\\right|$ 的什么上界？`,
        ],
        M * length,
        [
          [
            M * (dx + dy),
            `That takes the length as $${dx} + ${dy}$; a slanted segment is shorter than the two legs together.`,
            `那把长度当成 $${dx} + ${dy}$；斜线段比两条直角边之和短。`,
          ],
          [length, `That gives the length only; it must be multiplied by $M = ${M}$.`, `那只是长度；还要乘以 $M = ${M}$。`],
          [M, `That gives $M$ only; it must be multiplied by the length ${length}.`, `那只是 $M$；还要乘以长度 ${length}。`],
        ],
        [
          [
            ["Read the segment", "读出线段"],
            [
              `It runs from $(${a[0]}, ${a[1]})$ to $(${b[0]}, ${b[1]})$: ${dx} across and ${dy} ${flip ? "down" : "up"}.`,
              `它从 $(${a[0]}, ${a[1]})$ 到 $(${b[0]}, ${b[1]})$：横向 ${dx}，纵向${flip ? "向下" : "向上"} ${dy}。`,
            ],
          ],
          [
            ["Find the length", "求长度"],
            [
              `$L = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${length}$.`,
              `$L = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${length}$。`,
            ],
          ],
          [
            ["Multiply", "相乘"],
            [`$ML = ${M} \\cdot ${length} = ${M * length}$.`, `$ML = ${M} \\cdot ${length} = ${M * length}$。`],
          ],
        ],
        [
          `Parametrize by $z = ${start}${step}$ for $0 \\le t \\le 1$: then $|dz| = ${length} \\, dt$, so $\\int_\\gamma |f| \\, |dz| \\le ${M} \\cdot ${length} = ${M * length}$.`,
          `参数化 $z = ${start}${step}$，$0 \\le t \\le 1$：则 $|dz| = ${length} \\, dt$，所以 $\\int_\\gamma |f| \\, |dz| \\le ${M} \\cdot ${length} = ${M * length}$。`,
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
    }),
);

const wedgeImage = {
  ...point(
    "the-image-of-a-drawn-wedge",
    ["The image of a drawn wedge", "图中楔形的像"],
    [
      "The map $w = z^k$ multiplies every argument by $k$ and raises every modulus to the power $k$. So a wedge with its tip at the origin goes to a wedge with its tip at the origin, and its opening angle is multiplied by $k$. Conformality fails at the origin, which is why angles there are not preserved. For the wedge $0 \\le \\arg z \\le \\frac{\\pi}{4}$ under $w = z^3$, the edge rays go to $\\arg w = 0$ and $\\arg w = \\frac{3\\pi}{4}$, so the image opens through $\\frac{3\\pi}{4}$.\n\nCheck: the point $z = e^{i\\pi/4}$ on the upper edge goes to $z^3 = e^{3i\\pi/4} = -\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2} i$, which lies in the second quadrant at angle $\\frac{3\\pi}{4}$.\n\n> **Watch out.** The opening angle is multiplied by $k$, not raised to a power or divided; and moduli change too, but they do not affect the angle.",
      "映射 $w = z^k$ 把每个辐角乘以 $k$，把每个模变成 $k$ 次方。所以顶点在原点的楔形映成顶点在原点的楔形，张角乘以 $k$。映射在原点不保角，所以那里的角不被保持。楔形 $0 \\le \\arg z \\le \\frac{\\pi}{4}$ 在 $w = z^3$ 下，两条边射线映到 $\\arg w = 0$ 和 $\\arg w = \\frac{3\\pi}{4}$，所以像的张角是 $\\frac{3\\pi}{4}$。\n\n检验：上边上的点 $z = e^{i\\pi/4}$ 映到 $z^3 = e^{3i\\pi/4} = -\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2} i$，它在第二象限，角为 $\\frac{3\\pi}{4}$。\n\n> **注意。** 张角乘以 $k$，不是取幂，也不是相除；模也会变，但不影响角。",
    ],
    (rng) => {
      const k = rng.int(2, 3);
      const steps = rng.pick([1, 2]);
      const first = rng.int(0, 7);
      const dir = (q: number): Point => [Math.cos((q * Math.PI) / 4), Math.sin((q * Math.PI) / 4)];
      const [u, v] = [dir(first), dir(first + steps)];
      const scale = (p: Point): Point => [4 * p[0] * Math.SQRT2, 4 * p[1] * Math.SQRT2];
      const answer = piTimes(k * steps, 4);
      const [lo, hi] = [piTimes(first, 4), piTimes(first + steps, 4)];
      const slips: Slip[] = [
        [
          same(piTimes(steps, 4)),
          "That is the opening of the drawn wedge itself; the map multiplies it.",
          "那是图中楔形本身的张角；映射会把它放大。",
        ],
        [
          same(piTimes(steps, 4 * k)),
          `That divides the angle by ${k}; the power $z^{${k}}$ multiplies arguments.`,
          `那把角除以 ${k}；幂 $z^{${k}}$ 是把辐角相乘。`,
        ],
        [
          same(piTimes(k + steps, 4)),
          `That adds ${k} quarter turns instead of multiplying the angle by ${k}.`,
          `那加上了 ${k} 个四分之一 π，而不是把角乘以 ${k}。`,
        ],
        [
          same(piTimes(2 * k * steps, 4)),
          `That multiplies by ${2 * k}; the exponent ${k} is the factor.`,
          `那乘了 ${2 * k}；因子是指数 ${k}。`,
        ],
      ];
      return chosen(
        rng,
        [
          `The map $w = z^{${k}}$ is applied to the shaded wedge. What is the opening angle of its image?`,
          `映射 $w = z^{${k}}$ 作用于阴影楔形。它的像的张角是多少？`,
        ],
        same(answer),
        slips,
        [
          [
            ["Read the wedge", "读出楔形"],
            [
              `Its edges are the rays at $${lo}$ and $${hi}$, so it opens through $${piTimes(steps, 4)}$.`,
              `它的两边是角为 $${lo}$ 和 $${hi}$ 的射线，所以张角是 $${piTimes(steps, 4)}$。`,
            ],
          ],
          [
            ["Apply the power", "作用幂"],
            [
              `$w = z^{${k}}$ multiplies every argument by $${k}$, so the opening becomes $${k} \\cdot ${piTimes(steps, 4)} = ${answer}$.`,
              `$w = z^{${k}}$ 把每个辐角乘以 $${k}$，所以张角变为 $${k} \\cdot ${piTimes(steps, 4)} = ${answer}$。`,
            ],
          ],
        ],
        [
          `Map the edges one by one: the ray at $${lo}$ goes to the ray at $${piTimes(k * first, 4)}$, and the ray at $${hi}$ goes to the ray at $${piTimes(k * (first + steps), 4)}$. Their difference is $${answer}$.`,
          `逐条映射边：角为 $${lo}$ 的射线映到角为 $${piTimes(k * first, 4)}$ 的射线，角为 $${hi}$ 的射线映到角为 $${piTimes(k * (first + steps), 4)}$ 的射线。两者之差是 $${answer}$。`,
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
    "A map $w = az + b$ scales by $|a|$, turns by the argument of $a$ and then shifts by $b$, so a disk goes to a disk. The new center is the image of the old center, and the new radius is $|a|$ times the old radius. The shift $b$ moves the center but never changes the radius. Under $w = 2iz + (1 + i)$, the disk with center $1$ and radius $1$ has its center sent to $2i + 1 + i = 1 + 3i$, and its radius becomes $|2i| \\cdot 1 = 2$.\n\nCheck: the edge point $z = 2$ goes to $4i + 1 + i = 1 + 5i$, which is at distance $2$ from $1 + 3i$, as the new radius says.\n\n> **Watch out.** Multiply the center by $a$ first and add $b$ after; and the radius is multiplied by $|a|$, not by $a$ and not left unchanged.",
    "映射 $w = az + b$ 先按 $|a|$ 缩放，按 $a$ 的辐角旋转，再平移 $b$，所以圆盘映成圆盘。新圆心是旧圆心的像，新半径是旧半径的 $|a|$ 倍。平移 $b$ 只移动圆心，不改变半径。在 $w = 2iz + (1 + i)$ 下，圆心为 $1$、半径为 $1$ 的圆盘，圆心映到 $2i + 1 + i = 1 + 3i$，半径变为 $|2i| \\cdot 1 = 2$。\n\n检验：边界点 $z = 2$ 映到 $4i + 1 + i = 1 + 5i$，它到 $1 + 3i$ 的距离是 $2$，与新半径一致。\n\n> **注意。** 先用 $a$ 乘圆心，再加 $b$；半径乘以 $|a|$，不是乘以 $a$，也不是保持不变。",
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
    const slips: Slip[] = [
      [
        option(cx(cu, cv), r),
        `That keeps the radius; the map stretches every length by $|a| = ${size}$.`,
        `那保留了半径；映射把每段长度放大 $|a| = ${size}$ 倍。`,
      ],
      [
        option(cx(x + bx, y + by), size * r),
        "That only shifts the center by $b$ and forgets to multiply it by $a$.",
        "那只把圆心平移了 $b$，忘了先乘以 $a$。",
      ],
      [
        option(cx(ux, uy), size * r),
        "That multiplies the center by $a$ but leaves out the shift $b$.",
        "那用 $a$ 乘了圆心，但漏掉了平移 $b$。",
      ],
      [
        option(cx(re * (x + bx) - im * (y + by), re * (y + by) + im * (x + bx)), size * r),
        "That adds $b$ before multiplying by $a$; the map is $az + b$, not $a(z + b)$.",
        "那在乘 $a$ 之前加了 $b$；映射是 $az + b$，不是 $a(z + b)$。",
      ],
      [option(cx(cu, cv), r + size), `That adds $|a|$ to the radius instead of multiplying by it.`, `那把 $|a|$ 加到半径上，而不是相乘。`],
    ];
    const [ex, ey] = [cu + re * r, cv + im * r];
    return chosen(
      rng,
      [`The map $${map}$ is applied to the shaded disk. What is its image?`, `映射 $${map}$ 作用于阴影圆盘。它的像是什么？`],
      option(cx(cu, cv), size * r),
      slips,
      [
        [
          ["Read the disk", "读出圆盘"],
          [`The drawing gives center $${cx(x, y)}$ and radius $${r}$.`, `由图得圆心 $${cx(x, y)}$，半径 $${r}$。`],
        ],
        [
          ["Move the center", "移动圆心"],
          [
            `$(${a})(${cx(x, y)}) = ${cx(ux, uy)}$, then adding $${cx(bx, by)}$ gives $${cx(cu, cv)}$.`,
            `$(${a})(${cx(x, y)}) = ${cx(ux, uy)}$，再加 $${cx(bx, by)}$ 得 $${cx(cu, cv)}$。`,
          ],
        ],
        [
          ["Scale the radius", "缩放半径"],
          [
            `$|${a}| = ${size}$, so the radius becomes $${size} \\cdot ${r} = ${size * r}$.`,
            `$|${a}| = ${size}$，所以半径变为 $${size} \\cdot ${r} = ${size * r}$。`,
          ],
        ],
      ],
      [
        `The edge point $${cx(x + r, y)}$ goes to $${cx(ex, ey)}$, which is at distance $${size * r}$ from $${cx(cu, cv)}$, as the new radius says.`,
        `边界点 $${cx(x + r, y)}$ 映到 $${cx(ex, ey)}$，它到 $${cx(cu, cv)}$ 的距离是 $${size * r}$，与新半径一致。`,
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
    "The principal logarithm of a nonzero number is the natural logarithm of its modulus, plus $i$ times its principal argument. A drawing supplies both parts at once: the distance from the origin and the direction from the origin. Points below the real axis have a negative imaginary part in their principal logarithm. For the point $z = -2 + 2i$, the distance is $\\sqrt{8} = 2\\sqrt{2}$ and the direction is $\\frac{3\\pi}{4}$, so $\\operatorname{Log} z = \\ln (2\\sqrt{2}) + \\frac{3\\pi}{4} i$.\n\nCheck: $e^{\\ln (2\\sqrt{2}) + \\frac{3\\pi}{4} i} = 2\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2} i\\right) = -2 + 2i$, the point we started from.\n\n> **Watch out.** The real part is $\\ln |z|$, not $|z|$; and the principal argument lies in $(-\\pi, \\pi]$, so adding $2\\pi$ gives another logarithm, not the principal one.",
    "非零复数的主对数等于其模的自然对数，加上 $i$ 乘以其主辐角。图同时给出这两部分：到原点的距离和相对原点的方向。实轴下方的点，其主对数的虚部为负。对点 $z = -2 + 2i$，距离是 $\\sqrt{8} = 2\\sqrt{2}$，方向是 $\\frac{3\\pi}{4}$，所以 $\\operatorname{Log} z = \\ln (2\\sqrt{2}) + \\frac{3\\pi}{4} i$。\n\n检验：$e^{\\ln (2\\sqrt{2}) + \\frac{3\\pi}{4} i} = 2\\sqrt{2}\\left(-\\frac{\\sqrt{2}}{2} + \\frac{\\sqrt{2}}{2} i\\right) = -2 + 2i$，正是原来的点。\n\n> **注意。** 实部是 $\\ln |z|$，不是 $|z|$；主辐角在 $(-\\pi, \\pi]$ 内，加上 $2\\pi$ 得到的是另一个对数，不是主对数。",
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
    const angle = piTimes(k, 4);
    const slips: Slip[] = [
      [
        same(withArg(modulus, k === 0 ? 8 : -k)),
        k === 0
          ? "That adds $2\\pi i$; a point on the positive real axis has principal argument $0$."
          : "That flips the sign of the argument; read the direction from the positive real axis, counterclockwise positive.",
        k === 0 ? "那加上了 $2\\pi i$；正实轴上的点主辐角是 $0$。" : "那把辐角的符号弄反了；从正实轴量方向，逆时针为正。",
      ],
      [
        same(withArg(size, k)),
        "That uses the modulus itself as the real part; the real part is its natural logarithm.",
        "那把模本身当成实部；实部是模的自然对数。",
      ],
      [
        same(withArg(modulus, k + 8)),
        "That adds $2\\pi$ to the argument, which leaves the principal range $(-\\pi, \\pi]$.",
        "那给辐角加了 $2\\pi$，超出了主值范围 $(-\\pi, \\pi]$。",
      ],
      [same(withArg(modulus, k + 4)), "That argument points the opposite way, to $-z$.", "那个辐角指向相反方向，即 $-z$。"],
      [
        same(withArg(size, k + 8)),
        "That uses the modulus instead of its logarithm and also adds $2\\pi$ to the argument.",
        "那用模代替了模的对数，还给辐角加了 $2\\pi$。",
      ],
    ];
    return chosen(
      rng,
      [
        "The point $z$ is drawn in the complex plane. What is the principal logarithm of $z$?",
        "图中画出了复平面上的点 $z$。$z$ 的主对数是多少？",
      ],
      same(answer),
      slips,
      [
        [
          ["Read the point", "读出点"],
          [`$z = ${cx(z[0], z[1])}$.`, `$z = ${cx(z[0], z[1])}$。`],
        ],
        [
          ["Find the modulus", "求模"],
          [
            `$|z| = \\sqrt{${z[0] * z[0]} + ${z[1] * z[1]}} = ${size}$, so the real part is $${modulus}$.`,
            `$|z| = \\sqrt{${z[0] * z[0]} + ${z[1] * z[1]}} = ${size}$，所以实部是 $${modulus}$。`,
          ],
        ],
        [
          ["Find the principal argument", "求主辐角"],
          [
            `The direction from the origin is $${angle}$, which lies in $(-\\pi, \\pi]$.`,
            `相对原点的方向是 $${angle}$，在 $(-\\pi, \\pi]$ 内。`,
          ],
        ],
      ],
      [
        `Exponentiate back: $e^{${answer}} = ${size}\\left(\\cos(${angle}) + i \\sin(${angle})\\right) = ${cx(z[0], z[1])}$, the drawn point.`,
        `取指数还原：$e^{${answer}} = ${size}\\left(\\cos(${angle}) + i \\sin(${angle})\\right) = ${cx(z[0], z[1])}$，正是图中的点。`,
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
    "The Taylor series of a function about a point converges on the largest disk centered there that avoids every singularity. So its radius is the distance from the center to the nearest singularity, measured in the plane. Farther singularities do not matter, and neither does the distance from the origin unless the series is centered there. For $\\frac{1}{(z - 3)(z + 2i)}$ about $c = 1$, the singularities lie at distances $|3 - 1| = 2$ and $|-2i - 1| = \\sqrt{5}$, so the radius is 2.\n\nCheck: about 1, $\\frac{1}{z - 3} = -\\frac{1}{2} \\cdot \\frac{1}{1 - \\frac{z - 1}{2}}$ is a geometric series in $\\frac{z - 1}{2}$, which converges exactly for $|z - 1| < 2$, while the other factor allows the larger disc $|z - 1| < \\sqrt{5}$.\n\n> **Watch out.** Measure from the center $c$, not from the origin, and take the nearest singularity, not the farthest.",
    "函数在一点的泰勒级数在以该点为中心、不含任何奇点的最大圆盘上收敛。所以收敛半径是中心到最近奇点在平面上的距离。更远的奇点无关紧要，除非级数以原点为中心，否则到原点的距离也无关紧要。对 $\\frac{1}{(z - 3)(z + 2i)}$ 在 $c = 1$ 处展开，奇点的距离是 $|3 - 1| = 2$ 和 $|-2i - 1| = \\sqrt{5}$，所以半径是 2。\n\n检验：在 1 处，$\\frac{1}{z - 3} = -\\frac{1}{2} \\cdot \\frac{1}{1 - \\frac{z - 1}{2}}$ 是 $\\frac{z - 1}{2}$ 的几何级数，恰在 $|z - 1| < 2$ 时收敛，而另一个因子允许更大的圆盘 $|z - 1| < \\sqrt{5}$。\n\n> **注意。** 要从中心 $c$ 量起，不是从原点量起；要取最近的奇点，不是最远的。",
  ],
  (rng) =>
    until(() => {
      const [h, k] = [rng.int(-1, 1), rng.int(-1, 1)];
      const lengths = rng.sample([2, 3, 4, 5, 6], 3);
      const dots = lengths.map((length): Point => {
        const [sx, sy] = [rng.sign(), rng.sign()];
        if (length === 5 && rng.bool(0.8)) return rng.bool() ? [h + 3 * sx, k + 4 * sy] : [h + 4 * sx, k + 3 * sy];
        return rng.bool() ? [h + length * sx, k] : [h, k + length * sy];
      });
      const sorted = [...lengths].sort((a, b) => a - b);
      const answer = Math.min(...lengths);
      const farthest = Math.max(...lengths);
      const middle = lengths.reduce((a, b) => a + b, 0) - answer - farthest;
      const fromOrigin = Math.min(...dots.map((p) => Math.round(Math.hypot(p[0], p[1]))));
      const misses: Miss[] = [
        [
          farthest,
          "That uses the farthest singularity; the disc must avoid every one, so the nearest decides.",
          "那用了最远的奇点；圆盘必须避开每一个奇点，所以由最近的决定。",
        ],
        [
          middle,
          "That uses the middle distance; the nearest singularity already stops the series.",
          "那用了中间的距离；最近的奇点已经使级数停止收敛。",
        ],
        [fromOrigin, "That measures from the origin instead of from the center $c$.", "那是从原点量的，而不是从中心 $c$ 量的。"],
      ];
      return worked(
        [
          "The dots are all the singularities of $f$, and $c$ is marked. What is the radius of convergence of the Taylor series of $f$ about $c$?",
          "图中的点是 $f$ 的全部奇点，并标出了 $c$。$f$ 在 $c$ 处的泰勒级数的收敛半径是多少？",
        ],
        answer,
        misses,
        [
          [
            ["Measure from the center", "从中心量距离"],
            [
              `The distances from $c = (${h}, ${k})$ to the three dots are $${sorted.join(", ")}$.`,
              `$c = (${h}, ${k})$ 到三个点的距离是 $${sorted.join(", ")}$。`,
            ],
          ],
          [
            ["Take the nearest", "取最近的"],
            [
              `The series converges up to the nearest singularity, so the radius is $${answer}$.`,
              `级数收敛到最近的奇点为止，所以半径是 $${answer}$。`,
            ],
          ],
        ],
        [
          `The disc $|z - c| < ${answer}$ contains no dot, since the others lie at distances ${sorted[1]} and ${sorted[2]}; any larger disc would contain the dot at distance ${answer}.`,
          `圆盘 $|z - c| < ${answer}$ 内没有点，因为其他点的距离是 ${sorted[1]} 和 ${sorted[2]}；再大的圆盘就会包含距离为 ${answer} 的点。`,
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
    }),
);

const annuliCount = {
  ...point(
    "counting-laurent-expansions-from-a-drawing",
    ["Counting Laurent expansions from a drawing", "由图数洛朗展开"],
    [
      "A function has one Laurent expansion about the origin on each region between consecutive circles through its singularities: an inner disk, the annuli and an outer region. Only the different distances from the origin matter, so two singularities at the same distance add just one circle. A singularity at the origin would change the disk into a punctured disk. With singularities at $1$, $-1$ and $2i$, the distances are $1$ and $2$, so the circles $|z| = 1$ and $|z| = 2$ leave three regions: $|z| < 1$, $1 < |z| < 2$ and $|z| > 2$.\n\nCheck: walking out along a ray from the origin, we cross a circle at $|z| = 1$ and again at $|z| = 2$; two crossings split the ray into three pieces, one for each region.\n\n> **Watch out.** Count distances, not dots: $1$ and $-1$ share one circle. And count regions, which is one more than the number of circles.",
      "函数在原点处的洛朗展开，在穿过各奇点的相邻圆之间的每个区域上各有一个：内部圆盘、各圆环和外部区域。只有到原点的不同距离才有关，所以距离相同的两个奇点只增加一个圆。原点处的奇点只会把圆盘变成去心圆盘。奇点在 $1$、$-1$ 和 $2i$ 时，距离是 $1$ 和 $2$，所以圆 $|z| = 1$ 和 $|z| = 2$ 留下三个区域：$|z| < 1$、$1 < |z| < 2$ 和 $|z| > 2$。\n\n检验：沿一条从原点出发的射线向外走，在 $|z| = 1$ 处和 $|z| = 2$ 处各穿过一个圆；两次穿越把射线分成三段，每个区域一段。\n\n> **注意。** 数距离，不是数点：$1$ 和 $-1$ 共用一个圆。还要数区域，区域比圆多一个。",
    ],
    (rng) =>
      until(() => {
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
        const sorted = [...moduli].sort((a, b) => a - b);
        const misses: Miss[] = [
          [
            moduli.length,
            "That counts the circles; they cut the plane into one more region than there are circles.",
            "那数的是圆；圆把平面分成的区域比圆多一个。",
          ],
          [
            dots.length + 1,
            "That gives every dot its own circle; dots at the same distance share one.",
            "那给每个点各画了一个圆；距离相同的点共用一个圆。",
          ],
          [
            dots.length,
            "That counts the dots; what matters is how many different distances they lie at.",
            "那数的是点；要紧的是它们有多少种不同的距离。",
          ],
          [
            answer + 1,
            "That counts one region too many, as if the origin itself added a circle.",
            "那多数了一个区域，好像原点本身也添了一个圆。",
          ],
        ];
        const bands = sorted
          .map((m, i) => (i === 0 ? `|z| < ${m}` : `${sorted[i - 1]} < |z| < ${m}`))
          .concat(`|z| > ${sorted[sorted.length - 1]}`);
        return worked(
          [
            "The dots are all the singularities of $f$. On how many different regions does $f$ have a Laurent expansion about the origin?",
            "图中的点是 $f$ 的全部奇点。$f$ 在原点处的洛朗展开有多少个不同的区域？",
          ],
          answer,
          misses,
          [
            [
              ["Measure the distances", "量距离"],
              [
                `The ${dots.length} dots lie at the distances $${sorted.join(", ")}$ from the origin: ${moduli.length} different values.`,
                `这 ${dots.length} 个点到原点的距离是 $${sorted.join(", ")}$：共 ${moduli.length} 种不同的值。`,
              ],
            ],
            [
              ["Draw the circles", "画圆"],
              [
                `One circle $|z| = r$ for each distance gives ${moduli.length} circles, which leave ${moduli.length} + 1 = ${answer} regions.`,
                `每个距离一个圆 $|z| = r$，共 ${moduli.length} 个圆，留下 ${moduli.length} + 1 = ${answer} 个区域。`,
              ],
            ],
          ],
          [
            `List the regions: $${bands.join("$, $")}$. That is ${answer} of them.`,
            `列出各区域：$${bands.join("$，$")}$。共 ${answer} 个。`,
          ],
          fig(
            argand(6),
            dots.map((at): PlaneMark => ({ kind: "point", at, accent: true })),
            [`${dots.length} singularities marked in the plane, none at the origin.`, `平面上标出了 ${dots.length} 个奇点，原点处没有。`],
          ),
        );
      }),
  ),
  figure: complexDrawings1["laurent-series-on-annuli#counting-laurent-expansions-from-a-drawing"],
};

const argumentPrincipleFromDrawing = point(
  "the-argument-principle-from-a-drawing",
  ["The argument principle from a drawing", "由图用辐角原理"],
  [
    "The argument principle says that the image of a counterclockwise contour under $f$ winds around the origin as many times as the zeros inside minus the poles inside, counted with multiplicity. A drawing that marks zeros and poles therefore gives that winding number by counting. Zeros and poles outside the contour have no effect on it. For $f(z) = \\frac{z(z - 1)(z - 3)}{z + 1}$ on $|z| = 2$, the zeros $0$ and $1$ and the pole $-1$ are inside while the zero $3$ is outside, so the image winds $2 - 1 = 1$ time.\n\nCheck: as $z$ goes once around $|z| = 2$, the arguments of $z$ and $z - 1$ each gain $2\\pi$, that of $z + 1$ gains $2\\pi$, and that of $z - 3$ comes back to where it began; so $\\arg f$ gains $2\\pi + 2\\pi + 0 - 2\\pi = 2\\pi$, one turn.\n\n> **Watch out.** Poles count with a minus sign, and dots outside the contour do not count at all.",
    "辐角原理说，逆时针围线在 $f$ 下的像绕原点的圈数等于内部零点个数减内部极点个数，按重数计算。所以标出零点和极点的图，只要数一数就能得到这个环绕数。围线外部的零点和极点对它没有影响。对 $|z| = 2$ 上的 $f(z) = \\frac{z(z - 1)(z - 3)}{z + 1}$，零点 $0$、$1$ 和极点 $-1$ 在内部，零点 $3$ 在外部，所以像绕 $2 - 1 = 1$ 圈。\n\n检验：$z$ 沿 $|z| = 2$ 走一圈时，$z$ 与 $z - 1$ 的辐角各增加 $2\\pi$，$z + 1$ 的辐角增加 $2\\pi$，$z - 3$ 的辐角回到原值；所以 $\\arg f$ 增加 $2\\pi + 2\\pi + 0 - 2\\pi = 2\\pi$，即一圈。\n\n> **注意。** 极点带负号计入，围线外部的点完全不计。",
  ],
  (rng) =>
    until(() => {
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
      const misses: Miss[] = [
        [zerosIn + polesIn, "That adds the poles; each pole inside takes one turn away.", "那把极点加上了；内部每个极点要减去一圈。"],
        [polesIn - zerosIn, "That is poles minus zeros; the zeros come first.", "那是极点减零点；应该零点在前。"],
        [zerosIn, "That leaves out the poles inside.", "那漏掉了内部的极点。"],
        [
          zerosIn + 1 - polesIn,
          "That also counts the filled dot outside the contour, which has no effect.",
          "那把围线外部的实心点也算上了，它没有影响。",
        ],
      ];
      return worked(
        [
          "The contour is traced once counterclockwise. Filled dots are simple zeros of $f$, hollow dots are simple poles, and $f$ has no others. How many times does the image of the contour under $f$ wind counterclockwise around the origin?",
          "围线按逆时针方向走一遍。实心点是 $f$ 的单零点，空心点是单极点，$f$ 没有其他零点和极点。围线在 $f$ 下的像按逆时针方向绕原点多少圈？",
        ],
        answer,
        misses,
        [
          [
            ["Count inside the contour", "数围线内部"],
            [
              `Inside there are ${zerosIn} filled and ${polesIn} hollow dots; the two dots outside are ignored.`,
              `内部有 ${zerosIn} 个实心点和 ${polesIn} 个空心点；外部的两个点不计。`,
            ],
          ],
          [
            ["Apply the argument principle", "用辐角原理"],
            [`Zeros minus poles: $${zerosIn} - ${polesIn} = ${answer}$.`, `零点数减极点数：$${zerosIn} - ${polesIn} = ${answer}$。`],
          ],
        ],
        [
          `Write $f$ as a product of factors $z - a$ for the zeros and $\\frac{1}{z - b}$ for the poles, times a part with neither. Going once around the contour, each factor with its point inside turns the argument by $2\\pi$ (zeros) or $-2\\pi$ (poles), and the others return to where they began: ${zerosIn} turns forward and ${polesIn} back make ${answer}.`,
          `把 $f$ 写成零点因子 $z - a$、极点因子 $\\frac{1}{z - b}$ 与一个既无零点也无极点的部分之积。沿围线走一圈，点在内部的因子使辐角变化 $2\\pi$（零点）或 $-2\\pi$（极点），其余因子回到原值：向前 ${zerosIn} 圈、向后 ${polesIn} 圈，合计 ${answer} 圈。`,
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
    }),
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
