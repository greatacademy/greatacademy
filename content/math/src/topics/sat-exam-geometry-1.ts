import { t } from "@ga/content";
import type { ExamSpec } from "../exam.ts";
import { mc, mod, sg, sketchFigure, spr } from "../exam.ts";
import {
  bowtieFigure,
  cevianFigure,
  chordFigure,
  circumcircleFigure,
  equilateralFigure,
  exteriorFigure,
  incircleFigure,
  isoPts,
  kiteFigure,
  polyFigure,
  radiusFigure,
  rectFigure,
  rightPts,
  squareCircleFigure,
} from "../exam-figures.ts";

// SAT Math Prep, Geometry and Trigonometry: lines and angles, area and perimeter, right triangles, circles and inscribed shapes.

const angleTips = mod(
  t(
    "With parallel lines, corresponding and alternate angles are equal and consecutive angles add to $180^\\circ$. Vertical angles are equal. The angles of a triangle add to $180^\\circ$.",
    "平行线中，同位角和内错角相等，同旁内角和为 $180^\\circ$。对顶角相等。三角形内角和为 $180^\\circ$。",
  ),
  t(
    "When several angles are unknown, write an equation from one fact at a time, starting with the angle the two shapes share. Figures are not always drawn to scale, so trust the numbers.",
    "几个角都未知时，每次用一个事实列方程，从两个图形共有的角开始。图不一定按比例，要相信数字。",
  ),
);
const areaTips = mod(
  t(
    "Write the formula first, then substitute. Perimeter adds side lengths, while area multiplies two perpendicular lengths and has square units.",
    "先写公式再代入。周长是边长相加，面积是两条垂直长度相乘，单位是平方单位。",
  ),
  t(
    "If a question describes one side in terms of another, name one side $x$ and write everything with it. On a grid, read horizontal and vertical lengths by subtracting coordinates.",
    "如果题目用一条边描述另一条边，设其中一条为 $x$，全部用它表示。在坐标平面上，用坐标相减求水平和竖直长度。",
  ),
);
const rightTips = mod(
  t(
    "In a right triangle, $a^2 + b^2 = c^2$ with $c$ opposite the right angle. A $45$-$45$-$90$ triangle has sides $x, x, x\\sqrt{2}$ and a $30$-$60$-$90$ triangle has sides $x, x\\sqrt{3}, 2x$.",
    "直角三角形中，$a^2 + b^2 = c^2$，$c$ 是直角所对的边。$45$-$45$-$90$ 三角形三边为 $x, x, x\\sqrt{2}$，$30$-$60$-$90$ 三角形三边为 $x, x\\sqrt{3}, 2x$。",
  ),
  t(
    "Simplify radicals by taking out perfect squares, and remember $(k\\sqrt{n})^2 = k^2n$. Look for a right triangle hiding in the figure, such as one made by an altitude.",
    "化简根式时提出完全平方因数，并记住 $(k\\sqrt{n})^2 = k^2n$。留意图中隐藏的直角三角形，比如由高构成的直角三角形。",
  ),
);
const circleTips = mod(
  t(
    "Circumference is $2\\pi r$ and area is $\\pi r^2$. A central angle of $\\theta$ radians cuts an arc of length $r\\theta$, and $180^\\circ$ equals $\\pi$ radians.",
    "周长是 $2\\pi r$，面积是 $\\pi r^2$。$\\theta$ 弧度的圆心角所对的弧长是 $r\\theta$，$180^\\circ$ 等于 $\\pi$ 弧度。",
  ),
  t(
    "A radius meets a tangent at a right angle, a radius perpendicular to a chord bisects it, and two radii form an isosceles triangle. Each fact gives a right triangle or equal angles to use.",
    "半径与切线垂直，垂直于弦的半径平分弦，两条半径构成等腰三角形。这些事实都能提供直角三角形或相等的角。",
  ),
);
const eqTips = mod(
  t(
    "The circle with center $(h, k)$ and radius $r$ has equation $(x - h)^2 + (y - k)^2 = r^2$. The right side is the radius squared, and the signs inside are opposite to the center's.",
    "圆心为 $(h, k)$、半径为 $r$ 的圆的方程是 $(x - h)^2 + (y - k)^2 = r^2$。右边是半径的平方，括号内的符号与圆心坐标相反。",
  ),
  t(
    "If the equation is expanded, complete the square in $x$ and in $y$. Add the same numbers to both sides, then read the center and radius.",
    "如果方程已展开，分别对 $x$ 和 $y$ 配方。两边加上相同的数，再读出圆心和半径。",
  ),
);
const inscribedTips = mod(
  t(
    "Find the length both shapes share. A square inside a circle has its diagonal as a diameter. A circle inside a square has its diameter equal to the side.",
    "找出两个图形共有的长度。圆内接正方形的对角线是直径。正方形内切圆的直径等于边长。",
  ),
  t(
    "For an equilateral triangle with side $s$, the height is $\\frac{s\\sqrt{3}}{2}$. Its center divides the height so that the inscribed radius is $\\frac{1}{3}$ of it and the circumscribed radius is $\\frac{2}{3}$ of it.",
    "边长为 $s$ 的等边三角形高为 $\\frac{s\\sqrt{3}}{2}$。中心把高分成两段，内切圆半径是高的 $\\frac{1}{3}$，外接圆半径是高的 $\\frac{2}{3}$。",
  ),
);

const spots: Record<string, readonly [number, number]> = {
  UL: [170, 60],
  UR: [222, 60],
  DL: [160, 90],
  DR: [212, 90],
  ul: [100, 160],
  ur: [152, 160],
  dl: [90, 190],
  dr: [142, 190],
};

const parallelFig = (labels: Record<string, string>) => {
  const list = Object.entries(labels);
  return sketchFigure(
    {
      segs: [
        [30, 70, 290, 70],
        [30, 170, 290, 170],
        [90, 220, 230, 20],
      ],
      labels: [[300, 66, "ℓ"], [300, 166, "m"], ...list.map(([k, v]) => [...spots[k]!, v] as const)],
    },
    t(
      `Lines ℓ and m cut by a transversal, with angles marked ${list.map(([, v]) => v).join(", ")}.`,
      `直线 ℓ 和 m 被一条截线所截，标出的角为 ${list.map(([, v]) => v).join("、")}。`,
    ),
  );
};

const triFig = (a: string, b: string, c: string) =>
  sketchFigure(
    {
      segs: [
        [50, 200, 270, 200],
        [270, 200, 130, 40],
        [130, 40, 50, 200],
      ],
      labels: [
        [80, 192, a],
        [236, 192, b],
        [134, 72, c],
      ],
    },
    t(`A triangle with angles marked ${a}, ${b} and ${c}.`, `一个三角形，标出的角为 ${a}、${b} 和 ${c}。`),
  );

const rightFig = (leg1: string, leg2: string, hyp: string) =>
  sketchFigure(
    {
      segs: [
        [60, 40, 60, 200],
        [60, 200, 270, 200],
        [270, 200, 60, 40],
        [60, 186, 74, 186],
        [74, 186, 74, 200],
      ],
      labels: [
        [40, 124, leg1],
        [165, 222, leg2],
        [178, 108, hyp],
      ],
    },
    t(
      `A right triangle with legs marked ${leg1} and ${leg2} and hypotenuse marked ${hyp}.`,
      `一个直角三角形，直角边标为 ${leg1} 和 ${leg2}，斜边标为 ${hyp}。`,
    ),
  );

/** satExamGeometry1 are the exam-style questions on lines and angles, area and perimeter, right triangles, circles and inscribed shapes. */
export const satExamGeometry1: ExamSpec[] = [
  angleTips("Corresponding Angles", "同位角", ["corresponding-angles"], (rng, hard) => {
    const a = rng.int(35, 85) + rng.pick([0, 60]);
    if (!hard)
      return mc(
        rng,
        t(
          `In the figure, line $\\ell$ is parallel to line $m$. What is the value of $x$?`,
          `图中直线 $\\ell$ 平行于直线 $m$。$x$ 的值是多少？`,
        ),
        a,
        [180 - a, a + 10, a + 20],
        t(`The marked angles are corresponding angles, so they are equal and $x = ${a}$.`, `标出的两个角是同位角，所以相等，$x = ${a}$。`),
        parallelFig({ UR: `${a}°`, ur: "x°" }),
      );
    const x = rng.int(10, 30);
    const [p, q] = [rng.int(2, 3), rng.int(4, 5)];
    const b = rng.int(5, 20);
    const c = (q - p) * x - b;
    const l1 = `(${p}x + ${b})°`;
    const l2 = `(${q}x ${sg(-c)})°`;
    return spr(
      t(
        `In the figure, line $\\ell$ is parallel to line $m$. What is the value of $x$?`,
        `图中直线 $\\ell$ 平行于直线 $m$。$x$ 的值是多少？`,
      ),
      x,
      [x + b, q * x - c, 2 * x],
      t(
        `Corresponding angles are equal: $${p}x + ${b} = ${q}x ${sg(-c)}$, so $x = ${x}$.`,
        `同位角相等：$${p}x + ${b} = ${q}x ${sg(-c)}$，所以 $x = ${x}$。`,
      ),
      parallelFig({ UL: l1, ul: l2 }),
    );
  }),
  angleTips("Consecutive Angles", "同旁内角", ["consecutive-angles"], (rng, hard) => {
    const a = rng.int(35, 145);
    if (!hard)
      return mc(
        rng,
        t(
          `In the figure, line $\\ell$ is parallel to line $m$. What is the value of $x$?`,
          `图中直线 $\\ell$ 平行于直线 $m$。$x$ 的值是多少？`,
        ),
        180 - a,
        [a === 90 ? 100 : a, 360 - a, 180 - a + 10],
        t(
          `The angles are consecutive interior angles, so they add to $180$: $x = 180 - ${a} = ${180 - a}$.`,
          `这两个角是同旁内角，和为 $180$：$x = 180 - ${a} = ${180 - a}$。`,
        ),
        parallelFig({ DR: `${a}°`, ur: "x°" }),
      );
    const x = rng.int(10, 30);
    const b = 180 - 4 * x - rng.int(1, 3) * 10;
    const c = 180 - 4 * x - b;
    return spr(
      t(
        `In the figure, line $\\ell$ is parallel to line $m$. What is the value of $x$?`,
        `图中直线 $\\ell$ 平行于直线 $m$。$x$ 的值是多少？`,
      ),
      x,
      [2 * x, x + 10, 4 * x],
      t(`The angles add to $180$: $4x + ${b + c} = 180$, so $x = ${x}$.`, `两角和为 $180$：$4x + ${b + c} = 180$，所以 $x = ${x}$。`),
      parallelFig({ DR: `(3x ${sg(b)})°`, ur: `(x ${sg(c)})°` }),
    );
  }),
  angleTips("Vertical Angles", "对顶角", ["vertical-angles"], (rng, hard) => {
    const a = rng.int(25, 155);
    if (!hard)
      return mc(
        rng,
        t(
          `In the figure, the marked angles are formed by two intersecting lines. What is the value of $x$?`,
          `图中标出的角由两条相交直线构成。$x$ 的值是多少？`,
        ),
        a,
        [180 - a === a ? a + 5 : 180 - a, 360 - a, a + 15],
        t(`Vertical angles are equal, so $x = ${a}$.`, `对顶角相等，所以 $x = ${a}$。`),
        parallelFig({ UR: `${a}°`, DL: "x°" }),
      );
    const x = rng.int(10, 35);
    const [b, p] = [rng.int(5, 25), rng.int(2, 3)];
    const c = (p + 1) * x - p * x - b;
    return spr(
      t(
        `Two lines intersect, forming vertical angles of measure $(${p}x + ${b})^\\circ$ and $(${p + 1}x ${sg(-c)})^\\circ$. What is the value of $x$?`,
        `两条直线相交，形成度数为 $(${p}x + ${b})^\\circ$ 和 $(${p + 1}x ${sg(-c)})^\\circ$ 的对顶角。$x$ 的值是多少？`,
      ),
      x,
      [p * x + b, b, x + b],
      t(
        `Vertical angles are equal: $${p}x + ${b} = ${p + 1}x ${sg(-c)}$, so $x = ${x}$.`,
        `对顶角相等：$${p}x + ${b} = ${p + 1}x ${sg(-c)}$，所以 $x = ${x}$。`,
      ),
    );
  }),
  angleTips("Problem-Solving With Corresponding Angles", "用同位角解题", ["parallel-lines-and-transversals"], (rng, hard) => {
    const [a, c] = [rng.int(40, 80), rng.int(30, 70)];
    if (!hard)
      return mc(
        rng,
        t(
          `In the figure, line $\\ell$ is parallel to line $m$, and a triangle has one side on line $m$. One of its base angles is $${c}^\\circ$, and the transversal side makes an angle of $${a}^\\circ$ with line $\\ell$. What is the measure of the third angle of the triangle, in degrees?`,
          `图中直线 $\\ell$ 平行于直线 $m$，一个三角形有一边在 $m$ 上。它的一个底角是 $${c}^\\circ$，截线所在的边与 $\\ell$ 成 $${a}^\\circ$ 角。这个三角形的第三个角是多少度？`,
        ),
        180 - a - c,
        [a + c, 180 - a, 180 - c],
        t(
          `The corresponding angle at line $m$ is also $${a}^\\circ$, so the third angle is $180 - ${a} - ${c} = ${180 - a - c}$.`,
          `在 $m$ 上的同位角也是 $${a}^\\circ$，所以第三个角是 $180 - ${a} - ${c} = ${180 - a - c}$。`,
        ),
      );
    const k = rng.int(2, 4);
    const x = rng.int(12, 25);
    return spr(
      t(
        `Lines $\\ell$ and $m$ are parallel and are cut by a transversal. One angle on line $\\ell$ measures $${k}x^\\circ$, and its corresponding angle on line $m$ is supplementary to an angle measuring $${180 - k * x}^\\circ$. What is the value of $x$?`,
        `直线 $\\ell$ 和 $m$ 平行，被一条截线所截。$\\ell$ 上的一个角为 $${k}x^\\circ$，它在 $m$ 上的同位角与一个 $${180 - k * x}^\\circ$ 的角互补。$x$ 的值是多少？`,
      ),
      x,
      [k * x, 180 - k * x, 2 * x + 1],
      t(
        `The corresponding angle is $180 - ${180 - k * x} = ${k * x}$ degrees. So $${k}x = ${k * x}$ and $x = ${x}$.`,
        `同位角为 $180 - ${180 - k * x} = ${k * x}$ 度。所以 $${k}x = ${k * x}$，$x = ${x}$。`,
      ),
    );
  }),
  angleTips("Interior Angles of Triangles", "三角形的内角", ["angles-of-a-triangle"], (rng, hard) => {
    const [a, b] = [rng.int(25, 85), rng.int(25, 65)];
    if (!hard)
      return mc(
        rng,
        t(`In the triangle shown, what is the value of $x$?`, `在图示三角形中，$x$ 的值是多少？`),
        180 - a - b,
        [a + b, 180 - a, 180 - b],
        t(
          `The angles add to $180$, so $x = 180 - ${a} - ${b} = ${180 - a - b}$.`,
          `内角和为 $180$，所以 $x = 180 - ${a} - ${b} = ${180 - a - b}$。`,
        ),
        triFig(`${a}°`, `${b}°`, "x°"),
      );
    const x = rng.int(10, 30);
    const c = rng.int(2, 3);
    return spr(
      t(
        `The angles of a triangle measure $x^\\circ$, $${c}x^\\circ$ and $${180 - (c + 1) * x}^\\circ$. What is the value of $x$?`,
        `三角形的三个角为 $x^\\circ$、$${c}x^\\circ$ 和 $${180 - (c + 1) * x}^\\circ$。$x$ 的值是多少？`,
      ),
      x,
      [c * x, 180 - x, x + c],
      t(
        `The angles add to $180$: $${c + 1}x + ${180 - (c + 1) * x} = 180$, so $x = ${x}$.`,
        `内角和为 $180$：$${c + 1}x + ${180 - (c + 1) * x} = 180$，所以 $x = ${x}$。`,
      ),
    );
  }),
  angleTips("Interior Angles of Special Triangles", "特殊三角形的内角", ["isosceles-triangles"], (rng, hard) => {
    const apex = rng.int(10, 80) * 2;
    if (!hard)
      return mc(
        rng,
        t(
          `An isosceles triangle has a vertex angle of $${apex}^\\circ$, between its two equal sides. What is the measure of each base angle, in degrees?`,
          `一个等腰三角形两条等边之间的顶角为 $${apex}^\\circ$。每个底角是多少度？`,
        ),
        (180 - apex) / 2,
        [180 - apex, apex, (180 - apex) / 2 + 10],
        t(
          `The base angles are equal and add to $180 - ${apex}$, so each is $${(180 - apex) / 2}$.`,
          `两个底角相等，和为 $180 - ${apex}$，所以每个为 $${(180 - apex) / 2}$。`,
        ),
        polyFigure(isoPts(apex), { a: [null, null, `${apex}°`] }),
      );
    const base = rng.int(20, 80);
    return spr(
      t(
        `An isosceles triangle has a base angle of $${base}^\\circ$. What is the measure of the vertex angle, in degrees?`,
        `一个等腰三角形的底角为 $${base}^\\circ$。顶角是多少度？`,
      ),
      180 - 2 * base,
      [180 - base, base, 2 * base],
      t(
        `Both base angles are $${base}^\\circ$, so the vertex angle is $180 - 2(${base}) = ${180 - 2 * base}$.`,
        `两个底角都是 $${base}^\\circ$，所以顶角是 $180 - 2(${base}) = ${180 - 2 * base}$。`,
      ),
      polyFigure(isoPts(180 - 2 * base), { a: [`${base}°`, null, "?"] }),
    );
  }),
  angleTips("Exterior Angles of Triangles", "三角形的外角", ["exterior-angles-of-triangles"], (rng, hard) => {
    const [a, b] = [rng.int(25, 75), rng.int(25, 75)];
    if (!hard)
      return mc(
        rng,
        t(
          `Two interior angles of a triangle measure $${a}^\\circ$ and $${b}^\\circ$. What is the measure of the exterior angle at the third vertex, in degrees?`,
          `一个三角形的两个内角为 $${a}^\\circ$ 和 $${b}^\\circ$。第三个顶点处的外角是多少度？`,
        ),
        a + b,
        [180 - a - b, 180 - a, 360 - a - b],
        t(
          `An exterior angle equals the sum of the two remote interior angles: $${a} + ${b} = ${a + b}$.`,
          `外角等于两个不相邻内角之和：$${a} + ${b} = ${a + b}$。`,
        ),
        exteriorFigure(a, b, `${a}°`, `${b}°`, "?"),
      );
    const x = rng.int(10, 20);
    const k = rng.int(2, 4);
    return spr(
      t(
        `An exterior angle of a triangle measures $${(k + 1) * x + a}^\\circ$. The two remote interior angles measure $x^\\circ$ and $(${k}x + ${a})^\\circ$. What is the value of $x$?`,
        `三角形的一个外角为 $${(k + 1) * x + a}^\\circ$。两个不相邻的内角为 $x^\\circ$ 和 $(${k}x + ${a})^\\circ$。$x$ 的值是多少？`,
      ),
      x,
      [k * x, a, x + a],
      t(
        `The remote angles add to the exterior angle: $${k + 1}x + ${a} = ${(k + 1) * x + a}$, so $x = ${x}$.`,
        `不相邻内角之和等于外角：$${k + 1}x + ${a} = ${(k + 1) * x + a}$，所以 $x = ${x}$。`,
      ),
      exteriorFigure(42, 62, "x°", `(${k}x + ${a})°`, `${(k + 1) * x + a}°`),
    );
  }),
  angleTips("Solving Problems With Multiple Triangles", "解多个三角形的问题", ["problem-solving-with-angles-of-triangles"], (rng, hard) => {
    const [a, b, c] = [rng.int(30, 60), rng.int(40, 70), rng.int(30, 60)];
    const shared = 180 - a - b;
    if (!hard)
      return mc(
        rng,
        t(
          `Segments $AD$ and $BE$ intersect at $C$, forming triangles $ABC$ and $DEC$. In triangle $ABC$, angle $A$ is $${a}^\\circ$ and angle $B$ is $${b}^\\circ$. In triangle $DEC$, angle $D$ is $${c}^\\circ$. What is the measure of angle $E$, in degrees?`,
          `线段 $AD$ 和 $BE$ 交于 $C$，形成三角形 $ABC$ 和 $DEC$。在三角形 $ABC$ 中，$\\angle A = ${a}^\\circ$，$\\angle B = ${b}^\\circ$。在三角形 $DEC$ 中，$\\angle D = ${c}^\\circ$。$\\angle E$ 是多少度？`,
        ),
        180 - shared - c,
        [shared, 180 - c, a + b - c + 20],
        t(
          `Angle $ACB$ is $${shared}^\\circ$, and its vertical angle $DCE$ is the same. So angle $E$ is $180 - ${shared} - ${c} = ${180 - shared - c}$.`,
          `$\\angle ACB = ${shared}^\\circ$，它的对顶角 $\\angle DCE$ 相同。所以 $\\angle E = 180 - ${shared} - ${c} = ${180 - shared - c}$。`,
        ),
        bowtieFigure(a, b, c),
      );
    return spr(
      t(
        `Triangles $ABC$ and $ACD$ share side $AC$, with $D$ and $B$ on opposite sides of it. Angle $B$ is $${b}^\\circ$, angle $BAC$ is $${a}^\\circ$, angle $D$ is $${c}^\\circ$ and angle $DAC$ is $${a - 5}^\\circ$. What is the sum of the angles $BCA$ and $DCA$, in degrees?`,
        `三角形 $ABC$ 和 $ACD$ 共用边 $AC$，$D$、$B$ 在其两侧。$\\angle B = ${b}^\\circ$，$\\angle BAC = ${a}^\\circ$，$\\angle D = ${c}^\\circ$，$\\angle DAC = ${a - 5}^\\circ$。$\\angle BCA$ 与 $\\angle DCA$ 之和是多少度？`,
      ),
      360 - a - b - c - a + 5,
      [360 - a - b - c, 180 - b - c, a + b + c],
      t(
        `The two triangles have $360^\\circ$ in total, so the sum is $360 - ${a} - ${b} - ${c} - ${a - 5} = ${360 - a - b - c - a + 5}$.`,
        `两个三角形内角总和为 $360^\\circ$，所以和为 $360 - ${a} - ${b} - ${c} - ${a - 5} = ${360 - a - b - c - a + 5}$。`,
      ),
      kiteFigure(a, b, a - 5, c),
    );
  }),
  angleTips(
    "Interior and Exterior Angles in Connected Triangles",
    "相连三角形的内角和外角",
    ["the-exterior-angle-theorem"],
    (rng, hard) => {
      const [a, b] = [rng.int(20, 50), rng.int(30, 60)];
      if (!hard)
        return mc(
          rng,
          t(
            `Point $D$ lies on side $BC$ of triangle $ABC$. Angle $ABD$ is $${b}^\\circ$ and angle $BAD$ is $${a}^\\circ$. What is the measure of angle $ADC$, in degrees?`,
            `点 $D$ 在三角形 $ABC$ 的边 $BC$ 上。$\\angle ABD = ${b}^\\circ$，$\\angle BAD = ${a}^\\circ$。$\\angle ADC$ 是多少度？`,
          ),
          a + b,
          [180 - a - b, 180 - a, 180 - b],
          t(
            `Angle $ADC$ is an exterior angle of triangle $ABD$, so it equals $${a} + ${b} = ${a + b}$.`,
            `$\\angle ADC$ 是三角形 $ABD$ 的外角，所以等于 $${a} + ${b} = ${a + b}$。`,
          ),
          cevianFigure(a, b),
        );
      const c = rng.int(20, 40);
      return spr(
        t(
          `Point $D$ lies on side $BC$ of triangle $ABC$. Angle $ABD$ is $${b}^\\circ$, angle $BAD$ is $${a}^\\circ$ and angle $DAC$ is $${c}^\\circ$. What is the measure of angle $ACD$, in degrees?`,
          `点 $D$ 在三角形 $ABC$ 的边 $BC$ 上。$\\angle ABD = ${b}^\\circ$，$\\angle BAD = ${a}^\\circ$，$\\angle DAC = ${c}^\\circ$。$\\angle ACD$ 是多少度？`,
        ),
        180 - a - b - c,
        [a + b, a + b + c, 180 - a - c],
        t(
          `In the large triangle, the angles at $A$, $B$ and $C$ add to $180$: $(${a} + ${c}) + ${b} + \\angle ACD = 180$. So the angle is $${180 - a - b - c}$.`,
          `在大三角形中，$A$、$B$、$C$ 处的角和为 $180$：$(${a} + ${c}) + ${b} + \\angle ACD = 180$。所以该角为 $${180 - a - b - c}$。`,
        ),
        cevianFigure(a, b, c),
      );
    },
  ),
  areaTips("Areas of Rectangles and Squares", "矩形和正方形的面积", ["area-of-rectangles-and-squares"], (rng, hard) => {
    const [l, w, s] = [rng.int(6, 25), rng.int(2, 15), rng.int(3, 30)];
    if (!hard)
      return mc(
        rng,
        t(`A rectangle has length $${l}$ and width $${w}$. What is its area?`, `矩形长 $${l}$，宽 $${w}$。它的面积是多少？`),
        l * w,
        [2 * (l + w), l + w, l * l],
        t(`Area is length times width: $${l * w}$.`, `面积是长乘宽：$${l * w}$。`),
      );
    return spr(
      t(
        `A square has area $${s * s}$. A rectangle has the same perimeter as the square and a width of $${s - 1}$. What is the area of the rectangle?`,
        `正方形面积为 $${s * s}$。一个矩形的周长与正方形相同，宽为 $${s - 1}$。矩形的面积是多少？`,
      ),
      (s + 1) * (s - 1),
      [s * s, s * (s - 1), 4 * s],
      t(
        `The square has side $${s}$ and perimeter $${4 * s}$. The rectangle's length is $${2 * s} - ${s - 1} = ${s + 1}$, so its area is $${(s + 1) * (s - 1)}$.`,
        `正方形边长 $${s}$，周长 $${4 * s}$。矩形的长为 $${2 * s} - ${s - 1} = ${s + 1}$，所以面积为 $${(s + 1) * (s - 1)}$。`,
      ),
    );
  }),
  areaTips("Perimeters of Squares, Rectangles, and Triangles", "正方形、矩形和三角形的周长", ["perimeter"], (rng, hard) => {
    const [l, w, k] = [rng.int(6, 25), rng.int(2, 15), rng.int(2, 5)];
    if (!hard)
      return mc(
        rng,
        t(`A rectangle has length $${l}$ and width $${w}$. What is its perimeter?`, `矩形长 $${l}$，宽 $${w}$。它的周长是多少？`),
        2 * (l + w),
        [l + w, l * w, 2 * l + w],
        t(`Add all four sides: $2(${l} + ${w}) = ${2 * (l + w)}$.`, `四条边相加：$2(${l} + ${w}) = ${2 * (l + w)}$。`),
        rectFigure(l, w, `${l}`, `${w}`),
      );
    return spr(
      t(
        `The length of a rectangle is $${k}$ times its width, and its perimeter is $${2 * (k + 1) * w}$. What is its length?`,
        `矩形的长是宽的 $${k}$ 倍，周长为 $${2 * (k + 1) * w}$。它的长是多少？`,
      ),
      k * w,
      [w, (k + 1) * w, 2 * k * w],
      t(
        `With width $x$, the perimeter is $${2 * (k + 1)}x$, so $x = ${w}$ and the length is $${k * w}$.`,
        `设宽为 $x$，周长为 $${2 * (k + 1)}x$，所以 $x = ${w}$，长为 $${k * w}$。`,
      ),
      rectFigure(k, 1, `${k}x`, "x"),
    );
  }),
  areaTips(
    "Calculating Areas in the Coordinate Plane",
    "在坐标平面中计算面积",
    ["finding-areas-and-perimeters-in-the-coordinate-plane"],
    (rng, hard) => {
      const [x, y, w, h] = [rng.int(-6, 3), rng.int(-5, 3), rng.int(2, 9), rng.int(2, 9)];
      if (!hard)
        return mc(
          rng,
          t(
            `A rectangle has vertices at $(${x}, ${y})$, $(${x + w}, ${y})$, $(${x + w}, ${y + h})$ and $(${x}, ${y + h})$. What is its area?`,
            `矩形的顶点为 $(${x}, ${y})$、$(${x + w}, ${y})$、$(${x + w}, ${y + h})$ 和 $(${x}, ${y + h})$。它的面积是多少？`,
          ),
          w * h,
          [2 * (w + h), w + h, w * h + w],
          t(`The sides are $${w}$ and $${h}$, so the area is $${w * h}$.`, `边长为 $${w}$ 和 $${h}$，所以面积为 $${w * h}$。`),
        );
      return spr(
        t(
          `A triangle has vertices at $(${x}, ${y})$, $(${x + 2 * w}, ${y})$ and $(${x + 1}, ${y + h})$. What is its area?`,
          `三角形的顶点为 $(${x}, ${y})$、$(${x + 2 * w}, ${y})$ 和 $(${x + 1}, ${y + h})$。它的面积是多少？`,
        ),
        w * h,
        [2 * w * h, w + h, 2 * w + h],
        t(
          `The base has length $${2 * w}$ and the height is $${h}$, so the area is $\\frac{1}{2}(${2 * w})(${h}) = ${w * h}$.`,
          `底长 $${2 * w}$，高 $${h}$，所以面积为 $\\frac{1}{2}(${2 * w})(${h}) = ${w * h}$。`,
        ),
      );
    },
  ),
  areaTips(
    "Constructing Functions Representing Area and Perimeter",
    "构造表示面积和周长的函数",
    ["area-of-rectangles-and-squares"],
    (rng, hard) => {
      const [d, p] = [rng.int(2, 40), rng.int(10, 40) * 2];
      if (!hard)
        return mc(
          rng,
          t(
            `A rectangle has width $x$ and length $${d}$ more than its width. Which function gives its area?`,
            `矩形宽为 $x$，长比宽多 $${d}$。哪个函数给出它的面积？`,
          ),
          `A(x) = x(x + ${d})`,
          [`A(x) = 2x + ${d}`, `A(x) = x + ${d}`, `A(x) = 4x + ${2 * d}`, `A(x) = x^2 + ${d}`],
          t(`Area is width times length: $x(x + ${d})$.`, `面积是宽乘长：$x(x + ${d})$。`),
        );
      return mc(
        rng,
        t(
          `A rectangle has perimeter $${p}$ and width $x$. Which function gives its area?`,
          `矩形周长为 $${p}$，宽为 $x$。哪个函数给出它的面积？`,
        ),
        `A(x) = x(${p / 2} - x)`,
        [`A(x) = x(${p} - x)`, `A(x) = x(${p} - 2x)`, `A(x) = ${p}x`, `A(x) = x(${p / 2} + x)`],
        t(`Length plus width is $${p / 2}$, so the length is $${p / 2} - x$.`, `长加宽等于 $${p / 2}$，所以长是 $${p / 2} - x$。`),
      );
    },
  ),
  rightTips("Areas of Right Triangles", "直角三角形的面积", ["areas-of-right-triangles"], (rng, hard) => {
    const [a, b] = [rng.int(2, 15) * 2, rng.int(3, 20)];
    const [p, q, c, k] = rng.pick([
      [3, 4, 5, 2],
      [5, 12, 13, 1],
      [8, 15, 17, 1],
      [3, 4, 5, 3],
      [6, 8, 10, 2],
      [7, 24, 25, 1],
    ] as const);
    if (!hard)
      return mc(
        rng,
        t(
          `A right triangle has legs of lengths $${a}$ and $${b}$. What is its area?`,
          `直角三角形的直角边长为 $${a}$ 和 $${b}$。它的面积是多少？`,
        ),
        (a * b) / 2,
        [a * b, a + b, 2 * a * b],
        t(
          `Half the product of the legs: $\\frac{1}{2}(${a})(${b}) = ${(a * b) / 2}$.`,
          `两直角边之积的一半：$\\frac{1}{2}(${a})(${b}) = ${(a * b) / 2}$。`,
        ),
        rightFig(`${a}`, `${b}`, "c"),
      );
    const scale = rng.int(1, 5);
    return spr(
      t(
        `A right triangle has a leg of length $${p * k * scale}$ and a hypotenuse of length $${c * k * scale}$. What is its area?`,
        `直角三角形一条直角边长 $${p * k * scale}$，斜边长 $${c * k * scale}$。它的面积是多少？`,
      ),
      (p * k * scale * q * k * scale) / 2,
      [p * k * scale * q * k * scale, p * k * scale * c * k * scale, (p + q + c) * k * scale],
      t(
        `The other leg is $${q * k * scale}$ by the Pythagorean theorem, so the area is $\\frac{1}{2}(${p * k * scale})(${q * k * scale}) = ${(p * k * scale * q * k * scale) / 2}$.`,
        `由勾股定理，另一直角边为 $${q * k * scale}$，所以面积为 $\\frac{1}{2}(${p * k * scale})(${q * k * scale}) = ${(p * k * scale * q * k * scale) / 2}$。`,
      ),
    );
  }),
  rightTips("The Pythagorean Theorem", "勾股定理", ["the-pythagorean-theorem"], (rng, hard) => {
    const [p, q, c] = rng.pick([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
      [20, 21, 29],
    ] as const);
    const s = rng.int(1, 7);
    if (!hard)
      return mc(
        rng,
        t(
          `A right triangle has legs of lengths $${p * s}$ and $${q * s}$. What is the length of the hypotenuse?`,
          `直角三角形的直角边长为 $${p * s}$ 和 $${q * s}$。斜边长是多少？`,
        ),
        c * s,
        [(p + q) * s, Math.abs(q - p) * s, (c + 1) * s],
        t(
          `$c^2 = ${(p * s) ** 2} + ${(q * s) ** 2} = ${(c * s) ** 2}$, so $c = ${c * s}$.`,
          `$c^2 = ${(p * s) ** 2} + ${(q * s) ** 2} = ${(c * s) ** 2}$，所以 $c = ${c * s}$。`,
        ),
        rightFig(`${p * s}`, `${q * s}`, "c"),
      );
    return spr(
      t(
        `A right triangle has a hypotenuse of length $${c * s}$ and a leg of length $${q * s}$. What is the length of the other leg?`,
        `直角三角形的斜边长 $${c * s}$，一条直角边长 $${q * s}$。另一条直角边长是多少？`,
      ),
      p * s,
      [(c - q) * s, (c + q) * s, c * s],
      t(
        `Subtract squares: $${(c * s) ** 2} - ${(q * s) ** 2} = ${(p * s) ** 2}$, so the leg is $${p * s}$.`,
        `平方相减：$${(c * s) ** 2} - ${(q * s) ** 2} = ${(p * s) ** 2}$，所以直角边为 $${p * s}$。`,
      ),
    );
  }),
  rightTips(
    "Modeling Situations Using the Pythagorean Theorem",
    "用勾股定理为情境建模",
    ["solving-real-world-problems-using-the-pythagorean-theorem"],
    (rng, hard) => {
      const [p, q, c] = rng.pick([
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [6, 8, 10],
      ] as const);
      const s = rng.int(1, 8);
      if (!hard)
        return mc(
          rng,
          t(
            `A cyclist rides $${p * s}$ miles north and then $${q * s}$ miles east. How far is the cyclist from the starting point, in miles?`,
            `一名骑行者向北骑 $${p * s}$ 英里，再向东骑 $${q * s}$ 英里。他距起点多少英里？`,
          ),
          c * s,
          [(p + q) * s, (q - p) * s, (c + 2) * s],
          t(
            `The paths are the legs of a right triangle, so the distance is $${c * s}$.`,
            `两段路程是直角三角形的直角边，所以距离是 $${c * s}$。`,
          ),
        );
      return spr(
        t(
          `A $${c * s}$-foot ladder leans against a wall with its base $${p * s}$ feet from the wall. How high up the wall does it reach, in feet?`,
          `一把 $${c * s}$ 英尺长的梯子靠在墙上，底端离墙 $${p * s}$ 英尺。它能达到墙上多高（英尺）？`,
        ),
        q * s,
        [(c - p) * s, (c + p) * s, c * s],
        t(
          `The ladder is the hypotenuse: $\\sqrt{${(c * s) ** 2} - ${(p * s) ** 2}} = ${q * s}$.`,
          `梯子是斜边：$\\sqrt{${(c * s) ** 2} - ${(p * s) ** 2}} = ${q * s}$。`,
        ),
      );
    },
  ),
  rightTips("Problem-Solving With Isosceles Right Triangles", "用等腰直角三角形解题", ["isosceles-right-triangles"], (rng, hard) => {
    const a = rng.int(2, 30);
    if (!hard)
      return mc(
        rng,
        t(
          `An isosceles right triangle has legs of length $${a}$. What is the length of its hypotenuse?`,
          `等腰直角三角形的直角边长为 $${a}$。斜边长是多少？`,
        ),
        `${a}\\sqrt{2}`,
        [`${2 * a}`, `${a}\\sqrt{3}`, `\\frac{${a}\\sqrt{2}}{2}`, `${2 * a}\\sqrt{2}`],
        t(`The hypotenuse is a leg times $\\sqrt{2}$.`, `斜边等于直角边乘 $\\sqrt{2}$。`),
        polyFigure(rightPts(1, 1), { s: [`${a}`, `${a}`, "?"], right: 1 }),
      );
    return spr(
      t(
        `An isosceles right triangle has a hypotenuse of length $${2 * a}$. Its legs have length $${a}\\sqrt{2}$. What is its area?`,
        `等腰直角三角形的斜边长为 $${2 * a}$，直角边长为 $${a}\\sqrt{2}$。它的面积是多少？`,
      ),
      a * a,
      [a * a * 2, a * a * 4, 2 * a],
      t(
        `The area is half the product of the legs: $\\frac{1}{2}(${a}\\sqrt{2})^2 = ${a * a}$.`,
        `面积是两直角边之积的一半：$\\frac{1}{2}(${a}\\sqrt{2})^2 = ${a * a}$。`,
      ),
      polyFigure(rightPts(1, 1), { s: [`${a}√2`, `${a}√2`, `${2 * a}`], right: 1 }),
    );
  }),
  rightTips("Problem-Solving With Special Triangles", "用特殊三角形解题", ["thirty-sixty-ninety-triangles"], (rng, hard) => {
    const a = rng.int(2, 30);
    if (!hard)
      return mc(
        rng,
        t(
          `In a $30$-$60$-$90$ triangle, the shortest side has length $${a}$. What is the length of the hypotenuse?`,
          `在 $30$-$60$-$90$ 三角形中，最短边长为 $${a}$。斜边长是多少？`,
        ),
        2 * a,
        [`${a}\\sqrt{3}`, `${a}\\sqrt{2}`, 3 * a],
        t(`The hypotenuse is twice the shortest side, opposite $30^\\circ$.`, `斜边是 $30^\\circ$ 所对最短边的两倍。`),
        polyFigure(rightPts(Math.sqrt(3), 1), { a: ["60°", null, "30°"], s: [`${a}`, null, "?"], right: 1 }),
      );
    return mc(
      rng,
      t(
        `In a $30$-$60$-$90$ triangle, the hypotenuse has length $${2 * a}$. What is the length of the side opposite the $60^\\circ$ angle?`,
        `在 $30$-$60$-$90$ 三角形中，斜边长为 $${2 * a}$。$60^\\circ$ 角所对的边长是多少？`,
      ),
      `${a}\\sqrt{3}`,
      [`${a}`, `${2 * a}\\sqrt{3}`, `${a}\\sqrt{2}`, `${a + 1}\\sqrt{3}`],
      t(
        `The shortest side is $${a}$, and the side opposite $60^\\circ$ is $${a}\\sqrt{3}$.`,
        `最短边是 $${a}$，$60^\\circ$ 所对的边是 $${a}\\sqrt{3}$。`,
      ),
      polyFigure(rightPts(Math.sqrt(3), 1), { a: ["60°", null, "30°"], s: [null, "?", `${2 * a}`], right: 1 }),
    );
  }),
  rightTips(
    "Further Problem-Solving With Special Triangles",
    "进一步用特殊三角形解题",
    ["area-of-thirty-sixty-ninety-triangles"],
    (rng, hard) => {
      const a = rng.int(1, 30) * 2;
      if (!hard)
        return mc(
          rng,
          t(`An equilateral triangle has side length $${a}$. What is its height?`, `等边三角形的边长为 $${a}$。它的高是多少？`),
          `${a / 2}\\sqrt{3}`,
          [`${a}\\sqrt{3}`, `${a / 2}`, `${a}\\sqrt{2}`, `${a / 2 + 1}\\sqrt{3}`],
          t(
            `The height splits it into two $30$-$60$-$90$ triangles with short side $${a / 2}$, so the height is $${a / 2}\\sqrt{3}$.`,
            `高把它分成两个短边为 $${a / 2}$ 的 $30$-$60$-$90$ 三角形，所以高是 $${a / 2}\\sqrt{3}$。`,
          ),
          equilateralFigure(`${a}`, "?"),
        );
      return spr(
        t(
          `An equilateral triangle has side length $${a}$. Its area is $k\\sqrt{3}$. What is the value of $k$?`,
          `等边三角形的边长为 $${a}$，面积为 $k\\sqrt{3}$。$k$ 的值是多少？`,
        ),
        (a * a) / 4,
        [(a * a) / 2, a * a, a / 2],
        t(
          `The height is $${a / 2}\\sqrt{3}$, so the area is $\\frac{1}{2}(${a})(${a / 2}\\sqrt{3}) = ${(a * a) / 4}\\sqrt{3}$.`,
          `高是 $${a / 2}\\sqrt{3}$，所以面积为 $\\frac{1}{2}(${a})(${a / 2}\\sqrt{3}) = ${(a * a) / 4}\\sqrt{3}$。`,
        ),
        equilateralFigure(`${a}`, null),
      );
    },
  ),
  rightTips(
    "Solving Right Triangle Problems by Manipulating Radicals",
    "通过根式运算解直角三角形问题",
    ["the-pythagorean-theorem"],
    (rng, hard) => {
      const [a, b, n] = [rng.int(2, 9), rng.int(2, 9), rng.pick([2, 3, 5, 6, 7])];
      if (!hard)
        return spr(
          t(
            `A right triangle has legs of lengths $${a}\\sqrt{${n}}$ and $${b}\\sqrt{${n}}$. The square of its hypotenuse is $k$. What is the value of $k$?`,
            `直角三角形的直角边长为 $${a}\\sqrt{${n}}$ 和 $${b}\\sqrt{${n}}$。斜边的平方为 $k$。$k$ 的值是多少？`,
          ),
          (a * a + b * b) * n,
          [a * a + b * b, (a + b) ** 2 * n, (a + b) * n],
          t(
            `$(${a}\\sqrt{${n}})^2 + (${b}\\sqrt{${n}})^2 = ${a * a * n} + ${b * b * n} = ${(a * a + b * b) * n}$.`,
            `$(${a}\\sqrt{${n}})^2 + (${b}\\sqrt{${n}})^2 = ${a * a * n} + ${b * b * n} = ${(a * a + b * b) * n}$。`,
          ),
          polyFigure(rightPts(b, a), { s: [`${a}√${n}`, `${b}√${n}`, null], right: 1 }),
        );
      const [p, q, c] = rng.pick([
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
      ] as const);
      return mc(
        rng,
        t(
          `A right triangle has legs of lengths $${p * a}\\sqrt{${n}}$ and $${q * a}\\sqrt{${n}}$. What is the length of the hypotenuse?`,
          `直角三角形的直角边长为 $${p * a}\\sqrt{${n}}$ 和 $${q * a}\\sqrt{${n}}$。斜边长是多少？`,
        ),
        `${c * a}\\sqrt{${n}}`,
        [`${(p + q) * a}\\sqrt{${n}}`, `${c * a}`, `${c * a * n}`, `${c * a}\\sqrt{${2 * n}}`],
        t(
          `Both legs share $${a}\\sqrt{${n}}$, so the triangle is a scaled $${p}$-$${q}$-$${c}$ triangle.`,
          `两条直角边都含 $${a}\\sqrt{${n}}$，所以它是放大的 $${p}$-$${q}$-$${c}$ 三角形。`,
        ),
        polyFigure(rightPts(q, p), { s: [`${p * a}√${n}`, `${q * a}√${n}`, "?"], right: 1 }),
      );
    },
  ),
  circleTips("Radians", "弧度", ["introduction-to-radians"], (rng, hard) => {
    const d = rng.pick([15, 30, 36, 40, 45, 60, 72, 90, 120, 135, 144, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360, 20, 10, 18, 12]);
    const g = gcd2(d, 180);
    const frac = d === 180 ? "\\pi" : `\\frac{${d / g === 1 ? "" : d / g}\\pi}{${180 / g}}`;
    const form = 180 / g === 1 ? `${d / g}\\pi` : frac;
    if (!hard)
      return mc(
        rng,
        t(`What is $${d}^\\circ$ in radians?`, `$${d}^\\circ$ 等于多少弧度？`),
        form,
        [`\\frac{${d + 1}\\pi}{180}`, `\\frac{${d}}{\\pi}`, `\\frac{180}{${d}\\pi}`, `${d}\\pi`],
        t(`Multiply degrees by $\\frac{\\pi}{180}$.`, `度数乘以 $\\frac{\\pi}{180}$。`),
      );
    return spr(
      t(`An angle measures $${form}$ radians. What is its measure in degrees?`, `一个角为 $${form}$ 弧度。它是多少度？`),
      d,
      [d * 2, d + 45, d + 90],
      t(`Multiply radians by $\\frac{180}{\\pi}$ to get $${d}$.`, `弧度乘以 $\\frac{180}{\\pi}$ 得 $${d}$。`),
    );
  }),
  circleTips("Arc Lengths of Sectors", "扇形的弧长", ["calculating-arc-lengths-of-circular-sectors"], (rng, hard) => {
    const [r, k, d] = [rng.int(2, 12), rng.int(1, 5), rng.pick([3, 4, 6])];
    const theta = 180 / d;
    if (!hard)
      return mc(
        rng,
        t(
          `A circle has radius $${r * d}$. What is the length of the arc cut by a central angle of $${theta}^\\circ$?`,
          `圆的半径为 $${r * d}$。$${theta}^\\circ$ 的圆心角所对的弧长是多少？`,
        ),
        `${r}\\pi`,
        [`${2 * r}\\pi`, `${r * d}\\pi`, `${r * r}\\pi`, `${r + 1}\\pi`],
        t(
          `The arc is $\\frac{${theta}}{360}$ of the circumference $${2 * r * d}\\pi$, which is $${r}\\pi$.`,
          `弧长是周长 $${2 * r * d}\\pi$ 的 $\\frac{${theta}}{360}$，即 $${r}\\pi$。`,
        ),
      );
    return spr(
      t(
        `A central angle of $${k}$ radians cuts an arc of length $${k * r}$ in a circle. What is the radius of the circle?`,
        `$${k}$ 弧度的圆心角所对的弧长为 $${k * r}$。圆的半径是多少？`,
      ),
      r,
      [k * r, k * k * r, r + k],
      t(
        `Arc length is $r\\theta$, so $r = \\frac{${k * r}}{${k}} = ${r}$.`,
        `弧长为 $r\\theta$，所以 $r = \\frac{${k * r}}{${k}} = ${r}$。`,
      ),
    );
  }),
  circleTips("Areas and Circumferences of Circles", "圆的面积和周长", ["areas-of-circles"], (rng, hard) => {
    const r = rng.int(2, 40);
    if (!hard)
      return mc(
        rng,
        t(`A circle has radius $${r}$. What is its area?`, `圆的半径为 $${r}$。它的面积是多少？`),
        `${r * r}\\pi`,
        [`${2 * r}\\pi`, `${r * r * 2}\\pi`, `${r}\\pi`, `${r * r + 1}\\pi`],
        t(`Area is $\\pi r^2 = ${r * r}\\pi$.`, `面积是 $\\pi r^2 = ${r * r}\\pi$。`),
        radiusFigure(`${r}`),
      );
    return spr(
      t(
        `A circle has circumference $${2 * r}\\pi$. Its area is $k\\pi$. What is the value of $k$?`,
        `圆的周长为 $${2 * r}\\pi$，面积为 $k\\pi$。$k$ 的值是多少？`,
      ),
      r * r,
      [2 * r, 4 * r * r, r],
      t(`The radius is $${r}$, so the area is $${r * r}\\pi$.`, `半径为 $${r}$，所以面积为 $${r * r}\\pi$。`),
    );
  }),
  circleTips("Isosceles Triangles Formed Within Circles", "圆内的等腰三角形", ["isosceles-triangles-in-circles"], (rng, hard) => {
    const a = rng.int(10, 80) * 2;
    if (!hard)
      return mc(
        rng,
        t(
          `Points $A$ and $B$ lie on a circle with center $O$, and angle $AOB$ measures $${a}^\\circ$. What is the measure of angle $OAB$, in degrees?`,
          `点 $A$、$B$ 在圆心为 $O$ 的圆上，$\\angle AOB = ${a}^\\circ$。$\\angle OAB$ 是多少度？`,
        ),
        (180 - a) / 2,
        [180 - a, a, (180 - a) / 2 + 10],
        t(
          `$OA$ and $OB$ are radii, so the base angles are equal: $\\frac{180 - ${a}}{2} = ${(180 - a) / 2}$.`,
          `$OA$、$OB$ 是半径，所以底角相等：$\\frac{180 - ${a}}{2} = ${(180 - a) / 2}$。`,
        ),
        chordFigure(a, `${a}°`, "?"),
      );
    const b = rng.int(15, 75);
    return spr(
      t(
        `Points $A$ and $B$ lie on a circle with center $O$, and angle $OAB$ measures $${b}^\\circ$. What is the measure of angle $AOB$, in degrees?`,
        `点 $A$、$B$ 在圆心为 $O$ 的圆上，$\\angle OAB = ${b}^\\circ$。$\\angle AOB$ 是多少度？`,
      ),
      180 - 2 * b,
      [2 * b, 180 - b, b],
      t(
        `Both base angles are $${b}^\\circ$, so the angle at $O$ is $180 - 2(${b}) = ${180 - 2 * b}$.`,
        `两个底角都是 $${b}^\\circ$，所以 $O$ 处的角是 $180 - 2(${b}) = ${180 - 2 * b}$。`,
      ),
      chordFigure(180 - 2 * b, "?", `${b}°`),
    );
  }),
  circleTips("Tangent Lines to Circles", "圆的切线", ["tangent-lines-to-circles"], (rng, hard) => {
    const [p, q, c] = rng.pick([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
    ] as const);
    const s = rng.int(1, 7);
    const fig = sketchFigure(
      {
        segs: [
          [120, 120, 120, 40],
          [120, 40, 290, 40],
          [290, 40, 120, 120],
        ],
        circles: [[120, 120, 80]],
        labels: [
          [120, 136, "O"],
          [120, 32, "P"],
          [298, 34, "Q"],
        ],
      },
      t(
        "A circle with center O, a radius to the point of tangency P, a tangent segment PQ and a segment from O to Q.",
        "圆心为 O 的圆，半径连到切点 P，切线段 PQ，以及从 O 到 Q 的线段。",
      ),
    );
    if (!hard)
      return mc(
        rng,
        t(
          `In the figure, $\\overline{PQ}$ is tangent to the circle with center $O$ at $P$. If $OP = ${p * s}$ and $PQ = ${q * s}$, what is $OQ$?`,
          `图中 $\\overline{PQ}$ 与圆心为 $O$ 的圆相切于 $P$。若 $OP = ${p * s}$，$PQ = ${q * s}$，则 $OQ$ 是多少？`,
        ),
        c * s,
        [(p + q) * s, (q - p) * s, (c + 1) * s],
        t(
          `The radius meets the tangent at a right angle, so $OQ$ is the hypotenuse, $${c * s}$.`,
          `半径与切线垂直，所以 $OQ$ 是斜边，为 $${c * s}$。`,
        ),
        fig,
      );
    return spr(
      t(
        `In the figure, $\\overline{PQ}$ is tangent to the circle with center $O$ at $P$. If $OQ = ${c * s}$ and $PQ = ${q * s}$, what is the radius of the circle?`,
        `图中 $\\overline{PQ}$ 与圆心为 $O$ 的圆相切于 $P$。若 $OQ = ${c * s}$，$PQ = ${q * s}$，则圆的半径是多少？`,
      ),
      p * s,
      [(c - q) * s, (c + q) * s, c * s],
      t(
        `Triangle $OPQ$ has a right angle at $P$, so $OP = \\sqrt{${(c * s) ** 2} - ${(q * s) ** 2}} = ${p * s}$.`,
        `三角形 $OPQ$ 在 $P$ 处是直角，所以 $OP = \\sqrt{${(c * s) ** 2} - ${(q * s) ** 2}} = ${p * s}$。`,
      ),
      fig,
    );
  }),
  circleTips("Bisectors of Chords", "弦的垂直平分线", ["perpendicular-bisectors-of-chords"], (rng, hard) => {
    const [p, q, c] = rng.pick([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
    ] as const);
    const s = rng.int(1, 7);
    if (!hard)
      return mc(
        rng,
        t(
          `A circle has radius $${c * s}$. A chord is $${p * s}$ units from the center. What is the length of the chord?`,
          `圆的半径为 $${c * s}$。一条弦距圆心 $${p * s}$ 个单位。弦长是多少？`,
        ),
        2 * q * s,
        [q * s, 2 * c * s, 2 * p * s],
        t(
          `The perpendicular from the center bisects the chord. Half the chord is $\\sqrt{${(c * s) ** 2} - ${(p * s) ** 2}} = ${q * s}$, so the chord is $${2 * q * s}$.`,
          `从圆心作的垂线平分弦。弦的一半是 $\\sqrt{${(c * s) ** 2} - ${(p * s) ** 2}} = ${q * s}$，所以弦长 $${2 * q * s}$。`,
        ),
      );
    return spr(
      t(
        `A chord of length $${2 * q * s}$ in a circle is $${p * s}$ units from the center. What is the radius of the circle?`,
        `圆中一条长 $${2 * q * s}$ 的弦距圆心 $${p * s}$ 个单位。圆的半径是多少？`,
      ),
      c * s,
      [(p + q) * s, 2 * q * s, (2 * q + p) * s],
      t(
        `Half the chord is $${q * s}$, so the radius is $\\sqrt{${(q * s) ** 2} + ${(p * s) ** 2}} = ${c * s}$.`,
        `弦的一半是 $${q * s}$，所以半径为 $\\sqrt{${(q * s) ** 2} + ${(p * s) ** 2}} = ${c * s}$。`,
      ),
    );
  }),
  eqTips("The Canonical Equation of a Circle", "圆的标准方程", ["equations-of-circles"], (rng, hard) => {
    const [h, k, r] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.int(2, 12)];
    if (!hard)
      return mc(
        rng,
        t(
          `Which equation represents a circle with center $(${h}, ${k})$ and radius $${r}$?`,
          `哪个方程表示圆心为 $(${h}, ${k})$、半径为 $${r}$ 的圆？`,
        ),
        `(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}`,
        [
          `(x ${sg(h)})^2 + (y ${sg(k)})^2 = ${r * r}`,
          `(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r}`,
          `(x ${sg(h)})^2 + (y ${sg(k)})^2 = ${r}`,
          `(x ${sg(-k)})^2 + (y ${sg(-h)})^2 = ${r * r + 1}`,
        ],
        t(`Use $(x - h)^2 + (y - k)^2 = r^2$, with $r^2 = ${r * r}$.`, `用 $(x - h)^2 + (y - k)^2 = r^2$，其中 $r^2 = ${r * r}$。`),
      );
    return spr(
      t(
        `The circle $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$ has what radius?`,
        `圆 $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$ 的半径是多少？`,
      ),
      r,
      [r * r, 2 * r, Math.abs(h) + r],
      t(`The right side is $r^2$, so $r = \\sqrt{${r * r}} = ${r}$.`, `右边是 $r^2$，所以 $r = \\sqrt{${r * r}} = ${r}$。`),
    );
  }),
  eqTips("Canonical Equations of Transformed Circles", "变换后的圆的标准方程", ["transforming-circles"], (rng, hard) => {
    const [h, k, r, a, b] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6), rng.int(2, 9), rng.int(1, 5), rng.int(1, 5)];
    if (!hard)
      return mc(
        rng,
        t(
          `The circle $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$ is shifted right $${a}$ units and up $${b}$ units. What is the center of the new circle?`,
          `圆 $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$ 向右平移 $${a}$ 个单位，向上平移 $${b}$ 个单位。新圆的圆心是什么？`,
        ),
        `(${h + a}, ${k + b})`,
        [`(${h - a}, ${k - b})`, `(${h + b}, ${k + a})`, `(${-h + a}, ${-k + b})`, `(${h + a}, ${k - b})`],
        t(
          `The center moves with the circle, from $(${h}, ${k})$ to $(${h + a}, ${k + b})$.`,
          `圆心随圆移动，从 $(${h}, ${k})$ 到 $(${h + a}, ${k + b})$。`,
        ),
      );
    return spr(
      t(
        `The radius of the circle $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$ is multiplied by $${a + 1}$, and the center stays fixed. The new equation is $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = c$. What is the value of $c$?`,
        `圆 $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$ 的半径乘以 $${a + 1}$，圆心不变。新方程为 $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = c$。$c$ 的值是多少？`,
      ),
      (r * (a + 1)) ** 2,
      [r * r * (a + 1), r * (a + 1), r * r + a + 1],
      t(
        `The new radius is $${r * (a + 1)}$, and its square is $${(r * (a + 1)) ** 2}$.`,
        `新半径为 $${r * (a + 1)}$，其平方为 $${(r * (a + 1)) ** 2}$。`,
      ),
    );
  }),
  eqTips(
    "General Equations of Circles in the Coordinate Plane",
    "坐标平面中圆的一般方程",
    ["determining-circle-properties-by-completing-the-square"],
    (rng, hard) => {
      const [h, k, r] = [rng.nonZero(-7, 7), rng.nonZero(-7, 7), rng.int(2, 9)];
      const c = h * h + k * k - r * r;
      const eq = `x^2 ${sg(-2 * h)}x + y^2 ${sg(-2 * k)}y ${c === 0 ? "" : sg(c)} = 0`;
      if (!hard)
        return mc(
          rng,
          t(`What is the center of the circle $${eq}$?`, `圆 $${eq}$ 的圆心是什么？`),
          `(${h}, ${k})`,
          [`(${-h}, ${-k})`, `(${2 * h}, ${2 * k})`, `(${k}, ${h})`, `(${-2 * h}, ${-2 * k})`],
          t(
            `Half of each linear coefficient, with the sign changed, gives the center. Completing the square shows $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$.`,
            `一次项系数的一半变号给出圆心。配方得 $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$。`,
          ),
        );
      return spr(
        t(`What is the radius of the circle $${eq}$?`, `圆 $${eq}$ 的半径是多少？`),
        r,
        [r * r, Math.abs(h) + Math.abs(k), Math.abs(c) + 1],
        t(
          `Complete the square: $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$. So $r = ${r}$.`,
          `配方：$(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${r * r}$。所以 $r = ${r}$。`,
        ),
      );
    },
  ),
  eqTips(
    "Solving Problems Involving the Canonical Equation of a Circle",
    "用圆的标准方程解题",
    ["circles-in-the-coordinate-plane"],
    (rng, hard) => {
      const [p, q, c] = rng.pick([
        [3, 4, 5],
        [5, 12, 13],
        [6, 8, 10],
        [8, 15, 17],
      ] as const);
      const [h, k] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
      if (!hard)
        return mc(
          rng,
          t(
            `A circle has center $(${h}, ${k})$ and passes through $(${h + p}, ${k + q})$. Which equation represents the circle?`,
            `圆的圆心为 $(${h}, ${k})$，且过点 $(${h + p}, ${k + q})$。哪个方程表示这个圆？`,
          ),
          `(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${c * c}`,
          [
            `(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${c}`,
            `(x ${sg(h)})^2 + (y ${sg(k)})^2 = ${c * c}`,
            `(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = ${p + q}`,
            `(x ${sg(h)})^2 + (y ${sg(k)})^2 = ${c}`,
          ],
          t(`The radius squared is $${p}^2 + ${q}^2 = ${c * c}$.`, `半径的平方是 $${p}^2 + ${q}^2 = ${c * c}$。`),
        );
      return spr(
        t(
          `The endpoints of a diameter of a circle are $(${h - p}, ${k - q})$ and $(${h + p}, ${k + q})$. The circle's equation is $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = s$. What is the value of $s$?`,
          `圆的一条直径的端点为 $(${h - p}, ${k - q})$ 和 $(${h + p}, ${k + q})$。圆的方程为 $(x ${sg(-h)})^2 + (y ${sg(-k)})^2 = s$。$s$ 的值是多少？`,
        ),
        c * c,
        [4 * c * c, c, 2 * c],
        t(
          `The center is the midpoint, and half the diameter is the radius: $r^2 = ${p}^2 + ${q}^2 = ${c * c}$.`,
          `圆心是中点，直径的一半是半径：$r^2 = ${p}^2 + ${q}^2 = ${c * c}$。`,
        ),
      );
    },
  ),
  inscribedTips("Solving Problems Involving Inscribed Squares", "解内接正方形问题", ["squares-inscribed-in-circles"], (rng, hard) => {
    const s = rng.int(2, 30);
    if (!hard)
      return mc(
        rng,
        t(
          `A square with side length $${s}$ is inscribed in a circle. What is the radius of the circle?`,
          `边长为 $${s}$ 的正方形内接于圆。圆的半径是多少？`,
        ),
        `\\frac{${s}\\sqrt{2}}{2}`,
        [`${s}\\sqrt{2}`, `\\frac{${s}}{2}`, `${s}`, `${2 * s}\\sqrt{2}`],
        t(
          `The diagonal $${s}\\sqrt{2}$ is a diameter, so the radius is half of it.`,
          `对角线 $${s}\\sqrt{2}$ 是直径，所以半径是它的一半。`,
        ),
      );
    return spr(
      t(
        `A square is inscribed in a circle of radius $${s}$. What is the area of the square?`,
        `一个正方形内接于半径为 $${s}$ 的圆。正方形的面积是多少？`,
      ),
      2 * s * s,
      [s * s, 4 * s * s, 4 * s],
      t(
        `The diagonal is $${2 * s}$. The area of a square is half its diagonal squared: $\\frac{${(2 * s) ** 2}}{2} = ${2 * s * s}$.`,
        `对角线是 $${2 * s}$。正方形面积是对角线平方的一半：$\\frac{${(2 * s) ** 2}}{2} = ${2 * s * s}$。`,
      ),
    );
  }),
  inscribedTips("Solving Problems Involving Inscribed Circles", "解内切圆问题", ["circles-inscribed-in-squares"], (rng, hard) => {
    const r = rng.int(2, 30);
    if (!hard)
      return mc(
        rng,
        t(
          `A circle of radius $${r}$ is inscribed in a square. What is the area of the square?`,
          `半径为 $${r}$ 的圆内切于正方形。正方形的面积是多少？`,
        ),
        4 * r * r,
        [r * r, 2 * r * r, 8 * r],
        t(
          `The side equals the diameter, $${2 * r}$, so the area is $${4 * r * r}$.`,
          `边长等于直径 $${2 * r}$，所以面积为 $${4 * r * r}$。`,
        ),
        squareCircleFigure({ radius: `${r}` }),
      );
    return mc(
      rng,
      t(
        `A circle is inscribed in a square of side $${2 * r}$. What is the area of the region inside the square and outside the circle?`,
        `一个圆内切于边长 $${2 * r}$ 的正方形。正方形内、圆外的区域面积是多少？`,
      ),
      `${4 * r * r} - ${r * r}\\pi`,
      [`${4 * r * r} - ${2 * r}\\pi`, `${4 * r * r}\\pi - ${r * r}`, `${2 * r * r} - ${r * r}\\pi`, `${4 * r * r} - ${4 * r * r}\\pi`],
      t(
        `Subtract the circle's area $${r * r}\\pi$ from the square's area $${4 * r * r}$.`,
        `从正方形面积 $${4 * r * r}$ 中减去圆的面积 $${r * r}\\pi$。`,
      ),
      squareCircleFigure({ side: `${2 * r}`, shade: true }),
    );
  }),
  inscribedTips(
    "Solving Problems Involving Circles Inscribed in Equilateral Triangles",
    "解等边三角形内切圆问题",
    ["circles-inscribed-in-equilateral-triangles"],
    (rng, hard) => {
      const r = rng.int(2, 30);
      if (!hard)
        return mc(
          rng,
          t(
            `A circle of radius $${r}$ is inscribed in an equilateral triangle. What is the height of the triangle?`,
            `半径为 $${r}$ 的圆内切于等边三角形。三角形的高是多少？`,
          ),
          3 * r,
          [2 * r, `${r}\\sqrt{3}`, 4 * r],
          t(
            `The inscribed radius is one third of the height, so the height is $${3 * r}$.`,
            `内切圆半径是高的三分之一，所以高为 $${3 * r}$。`,
          ),
          incircleFigure(`${r}`),
        );
      return mc(
        rng,
        t(
          `A circle of radius $${r}$ is inscribed in an equilateral triangle. What is the side length of the triangle?`,
          `半径为 $${r}$ 的圆内切于等边三角形。三角形的边长是多少？`,
        ),
        `${2 * r}\\sqrt{3}`,
        [`${r}\\sqrt{3}`, `${3 * r}`, `${6 * r}`, `${3 * r}\\sqrt{3}`],
        t(
          `The height is $${3 * r}$, and $\\frac{s\\sqrt{3}}{2} = ${3 * r}$ gives $s = ${2 * r}\\sqrt{3}$.`,
          `高为 $${3 * r}$，由 $\\frac{s\\sqrt{3}}{2} = ${3 * r}$ 得 $s = ${2 * r}\\sqrt{3}$。`,
        ),
        incircleFigure(`${r}`),
      );
    },
  ),
  inscribedTips(
    "Solving Problems Involving Equilateral Triangles Inscribed in Circles",
    "解圆内接等边三角形问题",
    ["equilateral-triangles-inscribed-in-circles"],
    (rng, hard) => {
      const r = rng.int(1, 30) * 2;
      if (!hard)
        return mc(
          rng,
          t(
            `An equilateral triangle is inscribed in a circle of radius $${r}$. What is the height of the triangle?`,
            `一个等边三角形内接于半径为 $${r}$ 的圆。三角形的高是多少？`,
          ),
          (3 * r) / 2,
          [r, 2 * r, 3 * r],
          t(
            `The circumscribed radius is two thirds of the height, so the height is $\\frac{3}{2}(${r}) = ${(3 * r) / 2}$.`,
            `外接圆半径是高的三分之二，所以高为 $\\frac{3}{2}(${r}) = ${(3 * r) / 2}$。`,
          ),
          circumcircleFigure(`${r}`),
        );
      return mc(
        rng,
        t(
          `An equilateral triangle is inscribed in a circle of radius $${r}$. What is the side length of the triangle?`,
          `一个等边三角形内接于半径为 $${r}$ 的圆。三角形的边长是多少？`,
        ),
        `${r}\\sqrt{3}`,
        [`${2 * r}\\sqrt{3}`, `${r}\\sqrt{2}`, `${(3 * r) / 2}`, `${2 * r}`],
        t(
          `The height is $${(3 * r) / 2}$, and $\\frac{s\\sqrt{3}}{2} = ${(3 * r) / 2}$ gives $s = ${r}\\sqrt{3}$.`,
          `高为 $${(3 * r) / 2}$，由 $\\frac{s\\sqrt{3}}{2} = ${(3 * r) / 2}$ 得 $s = ${r}\\sqrt{3}$。`,
        ),
        circumcircleFigure(`${r}`),
      );
    },
  ),
];

function gcd2(a: number, b: number): number {
  return b === 0 ? a : gcd2(b, a % b);
}
