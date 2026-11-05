import { t } from "@ga/content";
import { Q } from "@ga/subject-math";
import type { ExamSpec } from "../exam.ts";
import { ask, askExact, sg, sketchFigure, spec, words } from "../exam.ts";
import {
  diameterFigure,
  diameterTriangleFigure,
  heightFigure,
  hexagonSpokesFigure,
  inscribedAngleFigure,
  pointsFigure,
  polyFigure,
  rectFigure,
  rectPlot,
  regularPts,
  rightPts,
  ringFigure,
  sectorFigure,
  squareCircleFigure,
  squareInCircleFigure,
  triangleInRectFigure,
  twoCirclesFigure,
  twoSquaresFigure,
} from "../exam-figures.ts";
import { article } from "../problems.ts";

// ACT Math Prep, Geometry: lines and angles, polygons, transformations, right triangles, area, circles, the coordinate plane, solids and conics.

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
] as const;

function linePoints(
  l1: string,
  l2: string,
  l3: string,
  alt: ReturnType<typeof t>,
  extra: readonly (readonly [number, number, string])[] = [],
) {
  return sketchFigure(
    {
      segs: [[30, 120, 290, 120]],
      labels: [[60, 110, l1], [160, 110, l2], [260, 110, l3], ...extra],
      circles: [
        [60, 120, 2],
        [160, 120, 2],
        [260, 120, 2],
      ],
    },
    alt,
  );
}

function circleFig(
  labels: readonly (readonly [number, number, string])[],
  segs: readonly (readonly [number, number, number, number])[],
  alt: ReturnType<typeof t>,
) {
  return sketchFigure({ circles: [[160, 120, 90]], segs, labels }, alt);
}

function roomFig(a: number, b: number, c: number, d: number) {
  return sketchFigure(
    {
      segs: [
        [60, 40, 260, 40],
        [260, 40, 260, 120],
        [260, 120, 160, 120],
        [160, 120, 160, 200],
        [160, 200, 60, 200],
        [60, 200, 60, 40],
      ],
      labels: [
        [160, 32, `${a}`],
        [278, 84, `${b}`],
        [210, 138, `${c}`],
        [145, 164, `${d}`],
      ],
    },
    t(
      `An L-shaped figure with a top side of ${a}, a right side of ${b}, an inner horizontal side of ${c} and an inner vertical side of ${d}; all corners are right angles.`,
      `L 形图形，上边长 ${a}，右边长 ${b}，内侧水平边长 ${c}，内侧竖直边长 ${d}；所有角都是直角。`,
    ),
  );
}

/** actExamGeometry are the exam-style questions of the ACT Geometry unit that have no SAT counterpart. */
export const actExamGeometry: ExamSpec[] = [
  spec("Finding Lengths on a Line", "求直线上的长度", ["the-segment-addition-postulate"], (rng, hard) => {
    const [ab, bc, k] = [rng.int(3, 30), rng.int(3, 30), rng.int(2, 5)];
    const fig = linePoints("A", "B", "C", t(`Points $A$, $B$ and $C$ lie on a line in that order.`, `点 $A$、$B$、$C$ 依次在一条直线上。`));
    if (!hard)
      return ask(
        rng,
        `Points $A$, $B$ and $C$ lie on a line in that order. If $AC = ${ab + bc}$ and $AB = ${ab}$, what is $BC$?`,
        `点 $A$、$B$、$C$ 依次在一条直线上。若 $AC = ${ab + bc}$，$AB = ${ab}$，$BC$ 是多少？`,
        bc,
        [ab + bc + ab, ab, Math.abs(ab - bc) + 1, bc + 1],
        `$BC = AC - AB$.`,
        `$BC = AC - AB$。`,
        fig,
      );
    return ask(
      rng,
      `Points $A$, $B$ and $C$ lie on a line in that order, and $BC$ is $${k}$ times $AB$. If $AC = ${ab * (k + 1)}$, what is the length of $BC$?`,
      `点 $A$、$B$、$C$ 依次在一条直线上，$BC$ 是 $AB$ 的 $${k}$ 倍。若 $AC = ${ab * (k + 1)}$，$BC$ 的长是多少？`,
      ab * k,
      [ab, ab * (k + 1) * k, ab * (k + 1) - k, ab * (k - 1)],
      `$AB + ${k}AB = ${ab * (k + 1)}$ gives $AB = ${ab}$.`,
      `$AB + ${k}AB = ${ab * (k + 1)}$，得 $AB = ${ab}$。`,
      fig,
    );
  }),
  spec(
    "Finding Reflex and Divided Angles",
    "求优角和被分割的角",
    ["acute-obtuse-and-reflex-angles", "solving-problems-with-angles"],
    (rng, hard) => {
      const [a, p, q, u] = [rng.int(20, 170), rng.int(1, 5), rng.int(1, 5), rng.int(3, 12)];
      if (!hard)
        return ask(
          rng,
          `An angle measures $${a}^\\circ$. What is the measure of the reflex angle that completes a full turn with it?`,
          `一个角为 $${a}^\\circ$。与它合成一周的优角是多少度？`,
          360 - a,
          [180 - a, 180 + a, 360 + a, 90 + a],
          `$360^\\circ - ${a}^\\circ$.`,
          `$360^\\circ - ${a}^\\circ$。`,
        );
      return ask(
        rng,
        `A ray divides an angle of $${(p + q + 1) * u}^\\circ$ into two angles in the ratio $${p} : ${q + 1}$. What is the measure of the smaller angle?`,
        `一条射线把 $${(p + q + 1) * u}^\\circ$ 的角分成比为 $${p} : ${q + 1}$ 的两个角。较小的角是多少度？`,
        Math.min(p, q + 1) * u,
        [Math.max(p, q + 1) * u === Math.min(p, q + 1) * u ? 2 * p * u : Math.max(p, q + 1) * u, p * q * u, u, (p + q + 1) * u],
        `One part is $${u}^\\circ$, and the smaller angle has $${Math.min(p, q + 1)}$ parts.`,
        `每份是 $${u}^\\circ$，较小的角占 $${Math.min(p, q + 1)}$ 份。`,
      );
    },
  ),
  spec("Problem-Solving With Intersecting Lines", "解决相交直线问题", ["vertical-angles"], (rng, hard) => {
    const [a0, x, k] = [rng.int(25, 155), rng.int(10, 40), rng.int(2, 4)];
    const a = a0 === 90 ? 91 : a0;
    const d = rng.int(1, 9);
    if (!hard)
      return ask(
        rng,
        `Two lines intersect, and one of the angles formed measures $${a}^\\circ$. What are the measures of the other three angles?`,
        `两条直线相交，其中一个角为 $${a}^\\circ$。其余三个角分别是多少度？`,
        `${a}^\\circ, ${180 - a}^\\circ, ${180 - a}^\\circ`,
        [
          `${a}^\\circ, ${a}^\\circ, ${180 - a}^\\circ`,
          `${a}^\\circ, ${90 - (a % 90)}^\\circ, ${90 - (a % 90)}^\\circ`,
          `${180 - a}^\\circ, ${180 - a}^\\circ, ${180 - a}^\\circ`,
          `${360 - a}^\\circ, ${180 - a}^\\circ, ${180 - a}^\\circ`,
        ],
        `The vertical angle equals $${a}^\\circ$, and each adjacent angle is its supplement.`,
        `对顶角等于 $${a}^\\circ$，相邻的角与它互补。`,
      );
    return ask(
      rng,
      `Two lines intersect, and a pair of vertical angles measure $(${k + 1}x - ${d})^\\circ$ and $(${k}x + ${x - d})^\\circ$. What is the value of $x$?`,
      `两条直线相交，一对对顶角分别为 $(${k + 1}x - ${d})^\\circ$ 和 $(${k}x + ${x - d})^\\circ$。$x$ 的值是多少？`,
      x,
      [x - d, x + d, x - 2 * d, 2 * x],
      `Vertical angles are equal, so $${k + 1}x - ${d} = ${k}x + ${x - d}$.`,
      `对顶角相等，所以 $${k + 1}x - ${d} = ${k}x + ${x - d}$。`,
    );
  }),
  spec("Solving Angle Bisector Problems", "解决角平分线问题", ["angle-bisectors"], (rng, hard) => {
    const [a, x, k, c] = [rng.int(10, 80), rng.int(5, 15), rng.int(2, 5), rng.nonZero(1, 9)];
    if (!hard)
      return ask(
        rng,
        `Ray $BD$ bisects $\\angle ABC$. If $m\\angle ABC = ${2 * a}^\\circ$, what is $m\\angle ABD$?`,
        `射线 $BD$ 平分 $\\angle ABC$。若 $m\\angle ABC = ${2 * a}^\\circ$，$m\\angle ABD$ 是多少？`,
        a,
        [2 * a, 4 * a, 180 - 2 * a, 90 - a === a ? a + 1 : 90 - a],
        `A bisector makes two equal angles.`,
        `平分线分出两个相等的角。`,
      );
    return ask(
      rng,
      `Ray $BD$ bisects $\\angle ABC$. If $m\\angle ABD = (${k}x + ${c})^\\circ$ and $m\\angle DBC = (${k + 1}x ${c === x ? "" : sg(c - x)})^\\circ$, what is $m\\angle ABC$?`,
      `射线 $BD$ 平分 $\\angle ABC$。若 $m\\angle ABD = (${k}x + ${c})^\\circ$，$m\\angle DBC = (${k + 1}x ${c === x ? "" : sg(c - x)})^\\circ$，$m\\angle ABC$ 是多少？`,
      2 * (k * x + c),
      [k * x + c, x, 2 * x, 2 * (k * x + c) + 2],
      `Setting the two parts equal gives $x = ${x}$, so each part is $${k * x + c}^\\circ$.`,
      `令两部分相等得 $x = ${x}$，每部分是 $${k * x + c}^\\circ$。`,
    );
  }),
  spec("Relating Sides to Opposite Angles", "边与对角的关系", ["side-angle-relationships-in-triangles"], (rng, hard) => {
    const [a0, b] = [rng.int(25, 55), rng.int(56, 80)];
    const a = 180 - a0 - b === b ? a0 + 1 : a0;
    const c = 180 - a - b;
    if (!hard)
      return words(
        rng,
        t(
          `In triangle $PQR$, $m\\angle P = ${a}^\\circ$ and $m\\angle Q = ${b}^\\circ$. Which angle is opposite the longest side?`,
          `三角形 $PQR$ 中，$m\\angle P = ${a}^\\circ$，$m\\angle Q = ${b}^\\circ$。哪个角对着最长边？`,
        ),
        c > b ? t("$\\angle R$", "$\\angle R$") : t("$\\angle Q$", "$\\angle Q$"),
        [
          c > b ? t("$\\angle Q$", "$\\angle Q$") : t("$\\angle R$", "$\\angle R$"),
          t("$\\angle P$", "$\\angle P$"),
          t("All three sides are equal.", "三条边相等。"),
        ],
        t(
          `The third angle is $${c}^\\circ$, and the longest side lies opposite the largest angle.`,
          `第三个角是 $${c}^\\circ$，最长边对着最大角。`,
        ),
      );
    const [s, m] = [rng.int(5, 9), rng.int(10, 14)];
    const l = rng.int(m + 1, s + m - 1);
    return words(
      rng,
      t(
        `In triangle $PQR$, $PQ = ${s}$, $QR = ${m}$ and $PR = ${l}$. Which lists the angles from smallest to largest?`,
        `三角形 $PQR$ 中，$PQ = ${s}$，$QR = ${m}$，$PR = ${l}$。哪项把角从小到大排列？`,
      ),
      t("$\\angle R, \\angle P, \\angle Q$", "$\\angle R, \\angle P, \\angle Q$"),
      [
        t("$\\angle P, \\angle Q, \\angle R$", "$\\angle P, \\angle Q, \\angle R$"),
        t("$\\angle Q, \\angle P, \\angle R$", "$\\angle Q, \\angle P, \\angle R$"),
        t("$\\angle R, \\angle Q, \\angle P$", "$\\angle R, \\angle Q, \\angle P$"),
      ],
      t(
        `The smallest angle $\\angle R$ faces $PQ$, then $\\angle P$ faces $QR$, and the largest $\\angle Q$ faces $PR$.`,
        `最小角 $\\angle R$ 对 $PQ$，其次 $\\angle P$ 对 $QR$，最大角 $\\angle Q$ 对 $PR$。`,
      ),
    );
  }),
  spec("Applying the Triangle Inequality", "运用三角形不等式", ["the-triangle-inequality"], (rng, hard) => {
    const [a, b] = [rng.int(3, 12), rng.int(13, 25)];
    if (!hard)
      return askExact(
        rng,
        `Two sides of a triangle have lengths $${a}$ and $${b}$. Which could be the length of the third side?`,
        `三角形两边长为 $${a}$ 和 $${b}$。第三边的长可能是多少？`,
        b,
        rng.bool() || b - a < 2 ? [b - a, a + b, a + b + 1] : [b - a - 1, b - a, a + b],
        `The third side must lie strictly between $${b - a}$ and $${a + b}$.`,
        `第三边必须严格介于 $${b - a}$ 和 $${a + b}$ 之间。`,
        polyFigure(
          [
            [0, 0],
            [2, 0],
            [0.5, 1],
          ],
          { s: [`${b}`, "?", `${a}`] },
        ),
      );
    return ask(
      rng,
      `Two sides of a triangle have lengths $${a}$ and $${b}$. If the third side is a whole number, how many lengths are possible?`,
      `三角形两边长为 $${a}$ 和 $${b}$。第三边是整数时，有多少种可能的长度？`,
      2 * a - 1,
      [2 * a, 2 * a + 1, a + b, b - a],
      `The whole numbers from $${b - a + 1}$ to $${a + b - 1}$ work.`,
      `从 $${b - a + 1}$ 到 $${a + b - 1}$ 的整数都可以。`,
      polyFigure(
        [
          [0, 0],
          [2, 0],
          [0.5, 1],
        ],
        { s: [`${b}`, "?", `${a}`] },
      ),
    );
  }),
  spec(
    "Classifying Triangles",
    "三角形分类",
    ["the-converse-of-the-pythagorean-theorem", "side-angle-relationships-in-triangles"],
    (rng, hard) => {
      const [a, b] = [rng.int(20, 80), rng.int(20, 80)];
      const kind = rng.int(0, 2);
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(1, 4);
      const opts = [t("acute", "锐角三角形"), t("right", "直角三角形"), t("obtuse", "钝角三角形")];
      const sum = a + b;
      if (!hard) {
        const third = 180 - sum;
        return words(
          rng,
          t(
            `A triangle has angles of $${a}^\\circ$ and $${b}^\\circ$. What kind of triangle is it?`,
            `三角形有两个角为 $${a}^\\circ$ 和 $${b}^\\circ$。它是什么三角形？`,
          ),
          third > 90 ? t("obtuse", "钝角三角形") : third === 90 ? t("right", "直角三角形") : t("acute", "锐角三角形"),
          [
            third > 90 ? t("acute", "锐角三角形") : t("obtuse", "钝角三角形"),
            third === 90 ? t("acute", "锐角三角形") : t("right", "直角三角形"),
            t("equilateral", "等边三角形"),
          ],
          t(`The third angle is $${third}^\\circ$.`, `第三个角是 $${third}^\\circ$。`),
        );
      }
      const long = (c + (kind === 0 ? -1 : kind === 1 ? 0 : 1)) * k;
      const wrong = opts.filter((_, i) => i !== kind);
      return words(
        rng,
        t(
          `A triangle has sides of length $${p * k}$, $${q * k}$ and $${long}$. What kind of triangle is it?`,
          `三角形三边长为 $${p * k}$、$${q * k}$、$${long}$。它是什么三角形？`,
        ),
        opts[kind] ?? t("right", "直角三角形"),
        [...wrong, t("equilateral", "等边三角形")],
        t(
          `Compare $${long}^2 = ${long * long}$ with $${p * k}^2 + ${q * k}^2 = ${(p * k) ** 2 + (q * k) ** 2}$.`,
          `比较 $${long}^2 = ${long * long}$ 与 $${p * k}^2 + ${q * k}^2 = ${(p * k) ** 2 + (q * k) ** 2}$。`,
        ),
      );
    },
  ),
  spec(
    "Identifying Angle and Shape Properties",
    "判断角和图形的性质",
    ["properties-of-rectangles-and-squares", "properties-of-parallelograms"],
    (rng, hard) => {
      const [a, l, w] = [rng.int(20, 80), rng.int(9, 30), rng.int(2, 8)];
      if (!hard)
        return words(
          rng,
          t(
            `A quadrilateral has four right angles and sides $${l}$, $${w}$, $${l}$ and $${w}$. Which name fits it best?`,
            `四边形有四个直角，四边依次为 $${l}$、$${w}$、$${l}$、$${w}$。哪个名称最合适？`,
          ),
          t("rectangle", "长方形"),
          [t("square", "正方形"), t("rhombus", "菱形"), t("trapezoid", "梯形")],
          t(`Four right angles with unequal adjacent sides make a rectangle.`, `四个直角且相邻边不等的是长方形。`),
        );
      return words(
        rng,
        t(
          `Parallelogram $ABCD$ has $m\\angle A = ${a}^\\circ$ and $AB = ${l}$. Which statement must be true?`,
          `平行四边形 $ABCD$ 中 $m\\angle A = ${a}^\\circ$，$AB = ${l}$。哪个说法一定正确？`,
        ),
        t(`$m\\angle C = ${a}^\\circ$ and $CD = ${l}$`, `$m\\angle C = ${a}^\\circ$，$CD = ${l}$`),
        [
          t(`$m\\angle B = ${a}^\\circ$ and $BC = ${l}$`, `$m\\angle B = ${a}^\\circ$，$BC = ${l}$`),
          t(`$m\\angle C = ${180 - a}^\\circ$ and $CD = ${l}$`, `$m\\angle C = ${180 - a}^\\circ$，$CD = ${l}$`),
          t(`$m\\angle D = ${a}^\\circ$ and $AD = ${l}$`, `$m\\angle D = ${a}^\\circ$，$AD = ${l}$`),
        ],
        t(`Opposite angles and opposite sides of a parallelogram are equal.`, `平行四边形的对角相等，对边相等。`),
      );
    },
  ),
  spec("Finding Interior Angles of Polygons", "求多边形的内角", ["angles-of-polygons"], (rng, hard) => {
    const n = rng.int(5, 40);
    const [a, b] = [rng.int(90, 130), rng.int(90, 130)];
    const known = rng.int(1, 3) * 2;
    if (!hard)
      return ask(
        rng,
        `What is the sum of the interior angles of a polygon with $${n}$ sides?`,
        `$${n}$ 边形的内角和是多少度？`,
        (n - 2) * 180,
        [n * 180, (n - 1) * 180, 360, (n - 3) * 180],
        `$(${n} - 2)180^\\circ$.`,
        `$(${n} - 2)180^\\circ$。`,
      );
    return ask(
      rng,
      `A pentagon has angles of $${a}^\\circ$, $${b}^\\circ$, $${90 + known}^\\circ$ and $${100 + known}^\\circ$. What is the measure of the fifth angle?`,
      `五边形有四个角为 $${a}^\\circ$、$${b}^\\circ$、$${90 + known}^\\circ$、$${100 + known}^\\circ$。第五个角是多少度？`,
      540 - a - b - 190 - 2 * known,
      [720 - a - b - 190 - 2 * known, 360 - a - b - 90 - 2 * known, 540 - a - b - 190 - 2 * known + 10, 540 - a - b - 190 - 2 * known - 10],
      `The angles of a pentagon add to $540^\\circ$.`,
      `五边形内角和为 $540^\\circ$。`,
      polyFigure(regularPts(5), { a: [`${a}°`, `${b}°`, `${90 + known}°`, `${100 + known}°`, "?"] }),
    );
  }),
  spec("Finding Angles in Parallelograms", "求平行四边形的角", ["properties-of-parallelograms"], (rng, hard) => {
    const [a0, x, k] = [rng.int(35, 145), rng.int(10, 20), rng.int(2, 5)];
    // A right angle would make the parallelogram a rectangle and every angle equal.
    const a = a0 === 90 ? 100 : a0;
    const c = rng.int(1, 15);
    if (!hard)
      return ask(
        rng,
        `In parallelogram $ABCD$, $m\\angle A = ${a}^\\circ$. What is $m\\angle B$?`,
        `平行四边形 $ABCD$ 中，$m\\angle A = ${a}^\\circ$。$m\\angle B$ 是多少？`,
        180 - a,
        [a === 90 ? 45 : a, 360 - a, 90 - (a % 90), 360 - 2 * a === 180 - a ? 181 - a : Math.abs(360 - 2 * a)],
        `Consecutive angles add to $180^\\circ$.`,
        `相邻两角和为 $180^\\circ$。`,
      );
    return ask(
      rng,
      `In parallelogram $ABCD$, $m\\angle A = (${k}x + ${c})^\\circ$ and $m\\angle C = (${k + 1}x ${c === x ? "" : sg(c - x)})^\\circ$. What is $m\\angle B$?`,
      `平行四边形 $ABCD$ 中，$m\\angle A = (${k}x + ${c})^\\circ$，$m\\angle C = (${k + 1}x ${c === x ? "" : sg(c - x)})^\\circ$。$m\\angle B$ 是多少？`,
      180 - k * x - c,
      [k * x + c, x, 360 - k * x - c, 180 - x],
      `Opposite angles are equal, so $x = ${x}$ and $m\\angle A = ${k * x + c}^\\circ$.`,
      `对角相等，所以 $x = ${x}$，$m\\angle A = ${k * x + c}^\\circ$。`,
    );
  }),
  spec(
    "Finding Lengths With Parallel Sides",
    "利用平行边求长度",
    ["properties-of-trapezoids", "properties-of-parallelograms"],
    (rng, hard) => {
      const [a, b] = [rng.int(4, 20), rng.int(21, 40)];
      const sum = a + b + ((a + b) % 2);
      if (!hard)
        return ask(
          rng,
          `A parallelogram has one side of length $${a}$ and a perimeter of $${2 * (a + b)}$. What is the length of an adjacent side?`,
          `平行四边形一边长 $${a}$，周长 $${2 * (a + b)}$。相邻边的长是多少？`,
          b,
          [2 * b, 2 * (a + b) - a, a + b, b - a],
          `Half the perimeter is $${a + b}$, the sum of two adjacent sides.`,
          `周长的一半是 $${a + b}$，即两条相邻边之和。`,
        );
      return ask(
        rng,
        `The bases of a trapezoid have lengths $${a}$ and $${sum - a}$. What is the length of the segment joining the midpoints of the legs?`,
        `梯形两底长为 $${a}$ 和 $${sum - a}$。连接两腰中点的线段长是多少？`,
        sum / 2,
        [sum, sum - 2 * a, sum / 2 + 1, a],
        `The midsegment is the average of the bases.`,
        `中位线是两底的平均数。`,
      );
    },
  ),
  spec("Finding Lengths in Regular Polygons", "求正多边形的长度", ["regular-polygons"], (rng, hard) => {
    const [n, s, k] = [rng.pick([5, 6, 8, 9, 10, 12]), rng.int(2, 15), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A regular polygon with $${n}$ sides has a perimeter of $${n * s}$. What is the length of each side?`,
        `正 $${n}$ 边形的周长是 $${n * s}$。每边长是多少？`,
        s,
        [n * s - n, s + n, s + 1, n],
        `Divide the perimeter by the number of sides.`,
        `周长除以边数。`,
        polyFigure(regularPts(n), { s: ["?"] }),
      );
    return ask(
      rng,
      `A regular hexagon is made of $6$ equilateral triangles with a common vertex. If the perimeter of one triangle is $${3 * s * k}$, what is the perimeter of the hexagon?`,
      `正六边形由 $6$ 个共顶点的等边三角形组成。若一个三角形的周长是 $${3 * s * k}$，六边形的周长是多少？`,
      6 * s * k,
      [18 * s * k, 3 * s * k, 12 * s * k, 6 * s * k + 6],
      `Each triangle has side $${s * k}$, and the hexagon has $6$ such sides.`,
      `每个三角形边长 $${s * k}$，六边形有 $6$ 条这样的边。`,
      hexagonSpokesFigure(),
    );
  }),
  spec("Translating and Reflecting a Point", "平移和翻折点", ["reflections-of-points-in-the-coordinate-plane"], (rng, hard) => {
    const [x, y, a, b] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.int(1, 9), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the image of $(${x}, ${y})$ when it is reflected across the $x$-axis?`,
        `$(${x}, ${y})$ 关于 $x$ 轴翻折后的像是什么？`,
        `(${x}, ${-y})`,
        [`(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`, `(${x}, ${y})`],
        `Reflecting across the $x$-axis negates $y$.`,
        `关于 $x$ 轴翻折使 $y$ 变号。`,
      );
    return ask(
      rng,
      `The point $(${x}, ${y})$ is translated $${a}$ units right and $${b}$ units down, and then reflected across the $y$-axis. What is its image?`,
      `点 $(${x}, ${y})$ 向右平移 $${a}$ 个单位，向下平移 $${b}$ 个单位，再关于 $y$ 轴翻折。它的像是什么？`,
      `(${-(x + a)}, ${y - b})`,
      [
        `(${x + a}, ${-(y - b)})`,
        `(${-x + a}, ${y - b})`,
        `(${-(x + a)}, ${y + b})`,
        `(${x + a}, ${y - b})`,
        `(${-(x + a) + 1}, ${y - b})`,
        `(${-(x + a)}, ${y - b + 1})`,
      ],
      `The translation gives $(${x + a}, ${y - b})$, and the reflection negates $x$.`,
      `平移得 $(${x + a}, ${y - b})$，翻折使 $x$ 变号。`,
    );
  }),
  spec("Applying a Rigid Motion", "应用刚体变换", ["applying-sequences-of-rigid-motions"], (rng, hard) => {
    const [x, y, l, a] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.int(3, 20), rng.int(20, 90)];
    if (!hard)
      return ask(
        rng,
        `Segment $AB$ has length $${l}$ and makes an angle of $${a}^\\circ$ with a line. It is rotated and then translated to become $A'B'$. What is the length of $A'B'$?`,
        `线段 $AB$ 长 $${l}$，与一条直线成 $${a}^\\circ$ 角。它先旋转再平移得到 $A'B'$。$A'B'$ 的长是多少？`,
        l,
        [2 * l, l + a, a, l + 1],
        `Rigid motions keep lengths.`,
        `刚体变换保持长度。`,
      );
    return ask(
      rng,
      `The point $(${x}, ${y})$ is rotated $90^\\circ$ counterclockwise about the origin. What is its image?`,
      `点 $(${x}, ${y})$ 绕原点逆时针旋转 $90^\\circ$。它的像是什么？`,
      `(${-y}, ${x})`,
      [`(${y}, ${-x})`, `(${-x}, ${-y})`, `(${y}, ${x})`, `(${-y}, ${-x})`, `(${-x}, ${y})`],
      `A $90^\\circ$ counterclockwise turn sends $(x, y)$ to $(-y, x)$.`,
      `逆时针旋转 $90^\\circ$ 把 $(x, y)$ 变成 $(-y, x)$。`,
    );
  }),
  spec("Dilating a Figure", "位似变换", ["dilations-of-figures-in-the-coordinate-plane"], (rng, hard) => {
    const [x, y, k, l, w] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.int(2, 5), rng.int(2, 12), rng.int(2, 12)];
    if (!hard)
      return ask(
        rng,
        `What is the image of $(${x}, ${y})$ under a dilation centered at the origin with scale factor $${k}$?`,
        `$(${x}, ${y})$ 在以原点为中心、比例因子为 $${k}$ 的位似下的像是什么？`,
        `(${k * x}, ${k * y})`,
        [`(${x + k}, ${y + k})`, `(${k * x}, ${y})`, `(${x}, ${k * y})`, `(${k * k * x}, ${k * k * y})`],
        `Multiply each coordinate by $${k}$.`,
        `每个坐标乘 $${k}$。`,
        pointsFigure([[x, y]]),
      );
    return ask(
      rng,
      `A rectangle measuring $${l}$ by $${w}$ is dilated with scale factor $${k}$. What is the area of the image?`,
      `长 $${l}$、宽 $${w}$ 的长方形经比例因子 $${k}$ 位似。像的面积是多少？`,
      k * k * l * w,
      [k * l * w, 2 * k * (l + w), k * k * (l + w), k * k * l * w + k],
      `Area scales by $${k}^2$.`,
      `面积乘 $${k}^2$。`,
      rectFigure(l, w, `${l}`, `${w}`),
    );
  }),
  spec("Finding Lengths Using Parallel Lines", "利用平行线求长度", ["the-triangle-proportionality-theorem"], (rng, hard) => {
    const [p, q, u, v] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 6), rng.int(2, 6)];
    const fig = sketchFigure(
      {
        segs: [
          [160, 30, 40, 210],
          [160, 30, 280, 210],
          [40, 210, 280, 210],
          [100, 120, 220, 120],
        ],
        labels: [
          [160, 22, "A"],
          [86, 120, "D"],
          [234, 120, "E"],
          [30, 222, "B"],
          [290, 222, "C"],
        ],
      },
      t(
        "Triangle $ABC$ with $D$ on $AB$, $E$ on $AC$ and $DE$ parallel to $BC$.",
        "三角形 $ABC$，$D$ 在 $AB$ 上，$E$ 在 $AC$ 上，$DE$ 平行于 $BC$。",
      ),
    );
    if (!hard)
      return ask(
        rng,
        `In the figure, $DE \\parallel BC$, $AD = ${p * u}$, $DB = ${q * u}$ and $AE = ${p * v}$. What is $EC$?`,
        `图中 $DE \\parallel BC$，$AD = ${p * u}$，$DB = ${q * u}$，$AE = ${p * v}$。$EC$ 是多少？`,
        q * v,
        [q * u, p * v + q * u - p * u, p * q, q * v + p],
        `$\\frac{AD}{DB} = \\frac{AE}{EC}$.`,
        `$\\frac{AD}{DB} = \\frac{AE}{EC}$。`,
        fig,
      );
    return ask(
      rng,
      `In the figure, $DE \\parallel BC$, $AD = ${p * u}$, $DB = ${q * u}$ and $BC = ${(p + q) * v}$. What is $DE$?`,
      `图中 $DE \\parallel BC$，$AD = ${p * u}$，$DB = ${q * u}$，$BC = ${(p + q) * v}$。$DE$ 是多少？`,
      p * v,
      [q * v, (p + q) * v - p, Q.of((p + q) * v * p, q), p * v + 1],
      `$\\frac{DE}{BC} = \\frac{AD}{AB} = \\frac{${p}}{${p + q}}$.`,
      `$\\frac{DE}{BC} = \\frac{AD}{AB} = \\frac{${p}}{${p + q}}$。`,
      fig,
    );
  }),
  spec(
    "Finding Diagonals and Perimeters With the Pythagorean Theorem",
    "用毕达哥拉斯定理求对角线和周长",
    ["diagonals-of-squares"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(1, 8);
      if (!hard)
        return ask(
          rng,
          `A rectangle measures $${p * k}$ by $${q * k}$. What is the length of its diagonal?`,
          `长方形长宽为 $${p * k}$ 和 $${q * k}$。对角线长是多少？`,
          c * k,
          [(p + q) * k, 2 * (p + q) * k, (c + 1) * k, c * k + 1],
          `$\\sqrt{${p * k}^2 + ${q * k}^2} = ${c * k}$.`,
          `$\\sqrt{${p * k}^2 + ${q * k}^2} = ${c * k}$。`,
        );
      return ask(
        rng,
        `A rectangle has a diagonal of length $${c * k}$ and one side of length $${p * k}$. What is its perimeter?`,
        `长方形对角线长 $${c * k}$，一边长 $${p * k}$。周长是多少？`,
        2 * (p + q) * k,
        [(p + q) * k, 2 * (c + p) * k, p * q * k * k, 2 * (p + q) * k + 2],
        `The other side is $${q * k}$.`,
        `另一边长 $${q * k}$。`,
      );
    },
  ),
  spec(
    "Finding Lengths in Figures With the Pythagorean Theorem",
    "在图形中用毕达哥拉斯定理求长度",
    ["solving-problems-with-embedded-right-triangles", "solving-real-world-problems-using-the-pythagorean-theorem"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(1, 8);
      if (!hard)
        return ask(
          rng,
          `A straight cable $${c * k}$ feet long runs from a point on a vertical tower to a stake on level ground $${p * k}$ feet from the tower's base. How high up the tower is the cable attached, in feet?`,
          `一根 $${c * k}$ 英尺长的直缆绳从竖直塔架上的一点连到水平地面上的木桩，木桩离塔底 $${p * k}$ 英尺。缆绳固定在塔上多高处（英尺）？`,
          q * k,
          [(c - p) * k, (c + p) * k, c * k, q * k + 1],
          `$\\sqrt{${c * k}^2 - ${p * k}^2}$.`,
          `$\\sqrt{${c * k}^2 - ${p * k}^2}$。`,
          polyFigure(rightPts(p, q), { s: ["?", `${p * k}`, `${c * k}`], right: 1 }),
        );
      return ask(
        rng,
        `A hiker walks $${p * k}$ miles north and then $${q * k}$ miles east, and stops. How far is the hiker from the start, in miles, measured in a straight line?`,
        `徒步者向北走 $${p * k}$ 英里，再向东走 $${q * k}$ 英里后停下。他离起点的直线距离是多少英里？`,
        c * k,
        [(p + q) * k, (q - p) * k > 0 ? (q - p) * k : (p - q) * k, c * k + 2, c * k - 1],
        `North and east are perpendicular, so the distance is the hypotenuse.`,
        `向北和向东互相垂直，距离就是斜边。`,
        polyFigure(rightPts(q, p), { s: [`${p * k}`, `${q * k}`, "?"], right: 1 }),
      );
    },
  ),
  spec(
    "Finding Altitudes and Areas With the Pythagorean Theorem",
    "用毕达哥拉斯定理求高和面积",
    ["finding-altitudes-using-the-pythagorean-theorem"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(1, 8);
      if (!hard)
        return ask(
          rng,
          `An isosceles triangle has legs of length $${c * k}$ and a base of length $${2 * p * k}$. What is the altitude to the base?`,
          `等腰三角形腰长 $${c * k}$，底边长 $${2 * p * k}$。底边上的高是多少？`,
          q * k,
          [2 * q * k, c * k, (c - p) * k, q * k + 1],
          `The altitude splits the base into halves of $${p * k}$.`,
          `高把底边分成两段，每段 $${p * k}$。`,
        );
      return ask(
        rng,
        `An isosceles triangle has legs of length $${c * k}$ and a base of length $${2 * p * k}$. What is its area?`,
        `等腰三角形腰长 $${c * k}$，底边长 $${2 * p * k}$。面积是多少？`,
        p * q * k * k,
        [2 * p * q * k * k, p * c * k * k, c * q * k * k, p * q * k * k + k],
        `The altitude is $${q * k}$, so the area is $\\frac{1}{2}(${2 * p * k})(${q * k})$.`,
        `高是 $${q * k}$，面积是 $\\frac{1}{2}(${2 * p * k})(${q * k})$。`,
      );
    },
  ),
  spec(
    "Checking and Applying Pythagorean Relationships",
    "检验和应用毕达哥拉斯关系",
    ["the-converse-of-the-pythagorean-theorem"],
    (rng, hard) => {
      const [p, q, c] = rng.pick(triples);
      const k = rng.int(1, 8);
      const d = rng.int(1, 2);
      if (!hard)
        return words(
          rng,
          t(
            `A triangle has sides of length $${p * k}$, $${q * k}$ and $${c * k}$. Which statement is true?`,
            `三角形三边长为 $${p * k}$、$${q * k}$、$${c * k}$。哪个说法正确？`,
          ),
          t(`The angle opposite the side of length $${c * k}$ is a right angle.`, `长为 $${c * k}$ 的边所对的角是直角。`),
          [
            t(`The angle opposite the side of length $${p * k}$ is a right angle.`, `长为 $${p * k}$ 的边所对的角是直角。`),
            t(`The angle opposite the side of length $${q * k}$ is a right angle.`, `长为 $${q * k}$ 的边所对的角是直角。`),
            t("The triangle has no right angle.", "这个三角形没有直角。"),
          ],
          t(
            `$${p * k}^2 + ${q * k}^2 = ${c * k}^2$, so the right angle lies opposite the longest side.`,
            `$${p * k}^2 + ${q * k}^2 = ${c * k}^2$，所以直角对着最长边。`,
          ),
        );
      return ask(
        rng,
        `A triangle has sides $${p * k}$, $${q * k}$ and $x$, with $x$ the longest side. For which value of $x$ is the angle opposite $x$ a right angle?`,
        `三角形三边为 $${p * k}$、$${q * k}$ 和最长边 $x$。$x$ 为何值时，它的对角是直角？`,
        c * k,
        [(p + q) * k, (c + d) * k, (c + d + 1) * k, (q + 1) * k],
        `$x^2 = ${p * k}^2 + ${q * k}^2$.`,
        `$x^2 = ${p * k}^2 + ${q * k}^2$。`,
      );
    },
  ),
  spec(
    "Finding a Length From an Angle Measure",
    "由角度求长度",
    ["calculating-side-lengths-of-right-triangles-using-trigonometry"],
    (rng, hard) => {
      const [a, h, s] = [rng.pick([25, 35, 40, 55, 65, 70]), rng.int(5, 40), rng.int(2, 9)];
      if (!hard)
        return ask(
          rng,
          `In a right triangle, the hypotenuse has length $${h}$ and one acute angle measures $${a}^\\circ$. Which expression gives the length of the side opposite that angle?`,
          `直角三角形斜边长 $${h}$，一个锐角为 $${a}^\\circ$。哪个式子给出该角对边的长？`,
          `${h}\\sin ${a}^\\circ`,
          [`${h}\\cos ${a}^\\circ`, `${h}\\tan ${a}^\\circ`, `\\frac{${h}}{\\sin ${a}^\\circ}`, `\\frac{\\sin ${a}^\\circ}{${h}}`],
          `$\\sin ${a}^\\circ = \\frac{\\text{opposite}}{${h}}$.`,
          `$\\sin ${a}^\\circ = \\frac{\\text{对边}}{${h}}$。`,
        );
      return ask(
        rng,
        `A $${s * 10}$-foot shadow lies on level ground, and the angle of elevation from the tip of the shadow to the top of a pole is $${a}^\\circ$. Which expression gives the height of the pole in feet?`,
        `水平地面上影子长 $${s * 10}$ 英尺，从影子末端看杆顶的仰角是 $${a}^\\circ$。哪个式子给出杆高（英尺）？`,
        `${s * 10}\\tan ${a}^\\circ`,
        [
          `${s * 10}\\sin ${a}^\\circ`,
          `${s * 10}\\cos ${a}^\\circ`,
          `\\frac{${s * 10}}{\\tan ${a}^\\circ}`,
          `\\frac{\\tan ${a}^\\circ}{${s * 10}}`,
        ],
        `The height is opposite the angle and the shadow is adjacent to it.`,
        `杆高是对边，影子是邻边。`,
      );
    },
  ),
  spec(
    "Writing an Inverse-Trigonometric Expression",
    "写反三角表达式",
    ["calculating-angles-in-right-triangles-using-trigonometry"],
    (rng, hard) => {
      const [a, b] = [rng.int(3, 15), rng.int(16, 30)];
      if (!hard)
        return ask(
          rng,
          `In a right triangle, the side opposite angle $\\theta$ has length $${a}$ and the hypotenuse has length $${b}$. Which expression gives $\\theta$?`,
          `直角三角形中，角 $\\theta$ 的对边长 $${a}$，斜边长 $${b}$。哪个式子给出 $\\theta$？`,
          `\\sin^{-1}\\left(\\frac{${a}}{${b}}\\right)`,
          [
            `\\cos^{-1}\\left(\\frac{${a}}{${b}}\\right)`,
            `\\tan^{-1}\\left(\\frac{${a}}{${b}}\\right)`,
            `\\sin^{-1}\\left(\\frac{${b}}{${a}}\\right)`,
            `\\sin\\left(\\frac{${a}}{${b}}\\right)`,
          ],
          `Opposite over hypotenuse is the sine.`,
          `对边比斜边是正弦。`,
        );
      return ask(
        rng,
        `A ramp rises $${a}$ feet over a horizontal distance of $${b}$ feet. Which expression gives the angle the ramp makes with the ground?`,
        `斜坡在 $${b}$ 英尺的水平距离上升高 $${a}$ 英尺。哪个式子给出斜坡与地面的夹角？`,
        `\\tan^{-1}\\left(\\frac{${a}}{${b}}\\right)`,
        [
          `\\tan^{-1}\\left(\\frac{${b}}{${a}}\\right)`,
          `\\sin^{-1}\\left(\\frac{${a}}{${b}}\\right)`,
          `\\cos^{-1}\\left(\\frac{${a}}{${b}}\\right)`,
          `\\tan\\left(\\frac{${a}}{${b}}\\right)`,
        ],
        `Rise and run are the opposite and adjacent sides.`,
        `升高和水平距离分别是对边和邻边。`,
      );
    },
  ),
  spec("Finding Areas of Composite Rectilinear Figures", "求组合直线图形的面积", ["composite-shapes"], (rng, hard) => {
    const [c, b, d, e] = [rng.int(3, 8), rng.int(2, 6), rng.int(2, 6), rng.int(3, 8)];
    const a = c + e;
    const fig = roomFig(a, b, c, d);
    if (!hard)
      return ask(
        rng,
        `All corners in the figure are right angles. What is the area of the figure?`,
        `图中所有角都是直角。图形的面积是多少？`,
        a * b + e * d,
        [a * (b + d), a * b, a * b + c * d, 2 * (a + b + d)],
        `Split it into an upper $${a}$ by $${b}$ rectangle and a lower $${e}$ by $${d}$ rectangle.`,
        `分成上面的 $${a}$ 乘 $${b}$ 长方形和下面的 $${e}$ 乘 $${d}$ 长方形。`,
        fig,
      );
    return ask(
      rng,
      `All corners in the figure are right angles. What is the perimeter of the figure?`,
      `图中所有角都是直角。图形的周长是多少？`,
      2 * (a + b + d),
      [a + b + c + d, a * b + e * d, 2 * (a + b), 2 * (a + b + d) + c],
      `Its perimeter equals that of the $${a}$ by $${b + d}$ rectangle around it.`,
      `它的周长等于外围 $${a}$ 乘 $${b + d}$ 长方形的周长。`,
      fig,
    );
  }),
  spec("Finding Areas of Divided Rectangles", "求被分割长方形的面积", ["areas-of-rectangles"], (rng, hard) => {
    const [a, b, h, k] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A rectangle of height $${h}$ is divided by a vertical segment into two rectangles with widths $${a}$ and $${b}$. What is the area of the original rectangle?`,
        `高 $${h}$ 的长方形被一条竖直线段分成宽 $${a}$ 和 $${b}$ 的两个长方形。原长方形的面积是多少？`,
        h * (a + b),
        [h * a, h * b, h + a + b, h * a * b],
        `The total width is $${a + b}$.`,
        `总宽是 $${a + b}$。`,
      );
    return ask(
      rng,
      `A rectangle is divided by a vertical segment into two rectangles with areas $${a * h}$ and $${b * h}$. If its height is $${h}$ and a third piece of width $${k}$ and the same height is added, what is the new total area?`,
      `长方形被一条竖直线段分成面积为 $${a * h}$ 和 $${b * h}$ 的两个长方形。若高为 $${h}$，再添一块宽 $${k}$、同样高的长方形，新的总面积是多少？`,
      h * (a + b + k),
      [h * (a + b), h * k, (a + b) * k, h * (a + b) * k],
      `The new piece has area $${h * k}$.`,
      `新的一块面积是 $${h * k}$。`,
    );
  }),
  spec("Using a Given Perimeter", "利用已知周长", ["perimeters-of-shapes", "modeling-with-rectangles"], (rng, hard) => {
    const [w, l, k] = [rng.int(3, 15), rng.int(16, 30), rng.int(2, 4)];
    if (!hard)
      return ask(
        rng,
        `A rectangle has a perimeter of $${2 * (l + w)}$ and a width of $${w}$. What is its length?`,
        `长方形周长 $${2 * (l + w)}$，宽 $${w}$。长是多少？`,
        l,
        [2 * l + w, 2 * (l + w) - w, l + w, l - w],
        `$2(l + ${w}) = ${2 * (l + w)}$.`,
        `$2(l + ${w}) = ${2 * (l + w)}$。`,
      );
    return ask(
      rng,
      `A rectangle's length is $${k}$ times its width, and its perimeter is $${2 * (k + 1) * w}$. What is its area?`,
      `长方形的长是宽的 $${k}$ 倍，周长 $${2 * (k + 1) * w}$。面积是多少？`,
      k * w * w,
      [(k + 1) * w * w, 2 * k * w, w * w, k * k * w * w],
      `$2(${k}w + w) = ${2 * (k + 1) * w}$ gives $w = ${w}$.`,
      `$2(${k}w + w) = ${2 * (k + 1) * w}$，得 $w = ${w}$。`,
    );
  }),
  spec("Finding Areas of Quadrilaterals", "求四边形的面积", ["area-of-trapezoids"], (rng, hard) => {
    const [b1, h, d] = [rng.int(3, 15), rng.int(2, 12), rng.int(1, 6) * 2];
    const b2 = b1 + d;
    if (!hard)
      return ask(
        rng,
        `A parallelogram has a base of $${b1}$ and a height of $${h}$. What is its area?`,
        `平行四边形底 $${b1}$，高 $${h}$。面积是多少？`,
        b1 * h,
        [Q.of(b1 * h, 2), 2 * (b1 + h), b1 + h, b1 * h + h],
        `Base times height.`,
        `底乘高。`,
      );
    return ask(
      rng,
      `A trapezoid has bases of $${b1}$ and $${b2}$ and a height of $${h}$. What is its area?`,
      `梯形两底为 $${b1}$ 和 $${b2}$，高 $${h}$。面积是多少？`,
      ((b1 + b2) * h) / 2,
      [(b1 + b2) * h, b1 * b2 * h, b1 * h, ((b1 + b2) * h) / 2 + h],
      `$\\frac{1}{2}(${b1} + ${b2})(${h})$.`,
      `$\\frac{1}{2}(${b1} + ${b2})(${h})$。`,
    );
  }),
  spec("Finding Areas of Triangles", "求三角形的面积", ["areas-of-triangles"], (rng, hard) => {
    const [b, h, k] = [rng.int(1, 12) * 2, rng.int(3, 15), rng.int(2, 4)];
    if (!hard)
      return ask(
        rng,
        `A triangle has a base of $${b}$ and a height of $${h}$. What is its area?`,
        `三角形底 $${b}$，高 $${h}$。面积是多少？`,
        (b * h) / 2,
        [b * h, b + h, 2 * b * h, (b * h) / 2 + 1],
        `$\\frac{1}{2}(${b})(${h})$.`,
        `$\\frac{1}{2}(${b})(${h})$。`,
        heightFigure(`${b}`, `${h}`),
      );
    return ask(
      rng,
      `A triangle has an area of $${(b * h) / 2}$ and a base of $${b}$. If the height is multiplied by $${k}$ and the base stays the same, what is the new area?`,
      `三角形面积 $${(b * h) / 2}$，底 $${b}$。若高乘 $${k}$，底不变，新面积是多少？`,
      (k * b * h) / 2,
      [(k * k * b * h) / 2, (b * h) / 2 + k, k * b * h, h * k],
      `The area is proportional to the height, so it is multiplied by $${k}$.`,
      `面积与高成正比，所以乘 $${k}$。`,
    );
  }),
  spec("Finding Shaded Areas With Circles", "求含圆的阴影面积", ["composite-shapes-with-circles"], (rng, hard) => {
    const [r, k, d] = [rng.int(2, 30), rng.int(1, 6), rng.int(1, 9)];
    if (!hard)
      return ask(
        rng,
        `A circle of radius $${r}$ is inscribed in a square. What is the area of the region inside the square and outside the circle?`,
        `半径 $${r}$ 的圆内切于正方形。正方形内、圆外区域的面积是多少？`,
        `${4 * r * r} - ${r * r}\\pi`,
        [`${r * r} - ${r * r}\\pi`, `${2 * r * r} - ${r * r}\\pi`, `${4 * r * r} - ${2 * r}\\pi`, `${4 * r * r}\\pi - ${r * r}`],
        `The square has side $${2 * r}$.`,
        `正方形边长是 $${2 * r}$。`,
        squareCircleFigure({ radius: `${r}`, shade: true }),
      );
    return ask(
      rng,
      `Two concentric circles have radii $${r}$ and $${r + k + d}$. What is the area of the ring between them?`,
      `两个同心圆半径为 $${r}$ 和 $${r + k + d}$。两圆之间圆环的面积是多少？`,
      `${(r + k + d) ** 2 - r * r}\\pi`,
      [`${(k + d) ** 2}\\pi`, `${2 * (k + d)}\\pi`, `${(r + k + d) ** 2 + r * r}\\pi`, `${(r + k + d) ** 2}\\pi`],
      `$\\pi(${r + k + d})^2 - \\pi(${r})^2$.`,
      `$\\pi(${r + k + d})^2 - \\pi(${r})^2$。`,
      ringFigure(r, r + k + d),
    );
  }),
  spec("Comparing Areas of Figures", "比较图形的面积", ["calculating-perimeters-and-areas-of-scaled-shapes"], (rng, hard) => {
    const [a, k, b, h] = [rng.int(2, 15), rng.int(2, 6), rng.int(1, 8) * 2, rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `One square has side $${a}$ and another has side $${k * a}$. The area of the larger is how many times the area of the smaller?`,
        `一个正方形边长 $${a}$，另一个边长 $${k * a}$。大正方形面积是小正方形面积的多少倍？`,
        k * k,
        [k, 2 * k, 4 * k, k * k * a],
        `Scaling lengths by $${k}$ scales area by $${k * k}$.`,
        `长度乘 $${k}$，面积乘 $${k * k}$。`,
        twoSquaresFigure(`${a}`, `${k * a}`, k),
      );
    return ask(
      rng,
      `A triangle has base $${b}$ and height $${h}$, and a rectangle with the same base and height is drawn next to it. By how much does the rectangle's area exceed the triangle's?`,
      `三角形底 $${b}$，高 $${h}$，旁边画一个底和高都相同的长方形。长方形面积比三角形大多少？`,
      (b * h) / 2,
      [b * h, 2 * b * h, b + h, (b * h) / 2 + b],
      `The triangle has half the rectangle's area.`,
      `三角形面积是长方形的一半。`,
      triangleInRectFigure(`${b}`, `${h}`),
    );
  }),
  spec("Finding Areas of Nested Regions", "求嵌套区域的面积", ["finding-areas-between-shapes"], (rng, hard) => {
    const [l, w, m, s] = [rng.int(12, 30), rng.int(10, 20), rng.int(1, 4), rng.int(2, 7)];
    if (!hard)
      return ask(
        rng,
        `A rectangular yard measures $${l}$ by $${w}$ feet and contains a square shed with side $${s}$ feet. What is the area of the yard outside the shed, in square feet?`,
        `长方形院子长 $${l}$ 英尺、宽 $${w}$ 英尺，内有边长 $${s}$ 英尺的正方形小屋。小屋外的院子面积是多少平方英尺？`,
        l * w - s * s,
        [l * w, l * w - 4 * s, l * w + s * s, (l - s) * (w - s) - 1],
        `Subtract the shed's area from the yard's area.`,
        `用院子面积减小屋面积。`,
      );
    return ask(
      rng,
      `A picture measuring $${l}$ by $${w}$ inches has a frame of uniform width $${m}$ inches around it. What is the area of the frame alone, in square inches?`,
      `长 $${l}$ 英寸、宽 $${w}$ 英寸的画四周有宽度均为 $${m}$ 英寸的画框。画框本身的面积是多少平方英寸？`,
      (l + 2 * m) * (w + 2 * m) - l * w,
      [(l + m) * (w + m) - l * w, (l + 2 * m) * (w + 2 * m), 2 * m * (l + w), (l + 2 * m) * (w + 2 * m) - l * w + m],
      `The outer rectangle measures $${l + 2 * m}$ by $${w + 2 * m}$.`,
      `外面的长方形长 $${l + 2 * m}$、宽 $${w + 2 * m}$。`,
    );
  }),
  spec("Finding a Length From Area", "由面积求长度", ["finding-side-lengths-of-squares-and-cubes-from-area-or-volume"], (rng, hard) => {
    const [s, l, b] = [rng.int(3, 30), rng.int(3, 20), rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `A square has an area of $${s * s}$. What is its side length?`,
        `正方形面积 $${s * s}$。边长是多少？`,
        s,
        [2 * s, 4 * s, Q.of(s * s, 2), s * s],
        `Take the square root of the area.`,
        `对面积开平方。`,
      );
    return ask(
      rng,
      `A triangle has an area of $${l * b}$ and a base of $${2 * b}$. What is its height?`,
      `三角形面积 $${l * b}$，底 $${2 * b}$。高是多少？`,
      l,
      [2 * l, Q.of(l, 2), l + b, l * b],
      `$\\frac{1}{2}(${2 * b})h = ${l * b}$.`,
      `$\\frac{1}{2}(${2 * b})h = ${l * b}$。`,
    );
  }),
  spec("Finding the Circumference of a Circle", "求圆的周长", ["the-circumference-of-a-circle"], (rng, hard) => {
    const [r, k] = [rng.int(2, 30), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the circumference of a circle with diameter $${2 * r}$?`,
        `直径 $${2 * r}$ 的圆，周长是多少？`,
        `${2 * r}\\pi`,
        [`${r}\\pi`, `${4 * r}\\pi`, `${r * r}\\pi`, `${4 * r * r}\\pi`],
        `Circumference is $\\pi d$.`,
        `周长是 $\\pi d$。`,
        diameterFigure(`${2 * r}`),
      );
    return ask(
      rng,
      `A circle has an area of $${r * r}\\pi$. A second circle's radius is $${k}$ times as long. What is the circumference of the second circle?`,
      `一个圆面积 $${r * r}\\pi$。第二个圆的半径是它的 $${k}$ 倍。第二个圆的周长是多少？`,
      `${2 * k * r}\\pi`,
      [`${k * r}\\pi`, `${2 * r}\\pi`, `${k * k * r * r}\\pi`, `${2 * k * k * r}\\pi`, `${2 * k * r + 2}\\pi`],
      `The first radius is $${r}$, so the second is $${k * r}$.`,
      `第一个半径是 $${r}$，第二个是 $${k * r}$。`,
    );
  }),
  spec("Finding Distance Along a Circle", "求沿圆的距离", ["calculating-arc-lengths-of-circular-sectors"], (rng, hard) => {
    const [r, n] = [rng.int(1, 8) * 6, rng.int(2, 15)];
    const a = rng.pick([30, 60, 90, 120, 150]);
    if (!hard)
      return ask(
        rng,
        `A wheel of radius $${r}$ inches rolls $${n}$ full turns without slipping. How many inches does it travel?`,
        `半径 $${r}$ 英寸的轮子无滑动滚动 $${n}$ 整圈。它走了多少英寸？`,
        `${2 * r * n}\\pi`,
        [`${r * n}\\pi`, `${r * r * n}\\pi`, `${2 * r}\\pi`, `${4 * r * n}\\pi`],
        `Each turn covers one circumference, $${2 * r}\\pi$.`,
        `每圈走一个周长 $${2 * r}\\pi$。`,
      );
    return ask(
      rng,
      `What is the length of an arc with a central angle of $${a}^\\circ$ on a circle of radius $${r}$?`,
      `半径 $${r}$ 的圆上，圆心角 $${a}^\\circ$ 所对的弧长是多少？`,
      `${(a * r) / 180 === 1 ? "" : (a * r) / 180}\\pi`,
      [`${(a * r) / 90}\\pi`, `${(a * r) / 60}\\pi`, `${(a * r) / 180 + 1}\\pi`, `${(a * r) / 180 + 2}\\pi`, `${(a * r) / 180 + 3}\\pi`],
      `The arc is $\\frac{${a}}{360}$ of the circumference $${2 * r}\\pi$.`,
      `弧占周长 $${2 * r}\\pi$ 的 $\\frac{${a}}{360}$。`,
      sectorFigure(a, `${a}°`, `${r}`),
    );
  }),
  spec("Comparing Areas of Circles", "比较圆的面积", ["relating-the-circumference-and-area-of-a-circle"], (rng, hard) => {
    const [r, k] = [rng.int(2, 15), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A circle has radius $${r}$, and a second has radius $${k * r}$. The second circle's area is how many times the first's?`,
        `一个圆半径 $${r}$，第二个圆半径 $${k * r}$。第二个圆的面积是第一个的多少倍？`,
        k * k,
        [k, 2 * k, k * k * r, k + r],
        `Area depends on the square of the radius.`,
        `面积取决于半径的平方。`,
        twoCirclesFigure(`${r}`, `${k * r}`, k),
      );
    return ask(
      rng,
      `A circle has a circumference of $${2 * r}\\pi$. A second has a circumference of $${2 * k * r}\\pi$. What is the difference between their areas?`,
      `一个圆周长 $${2 * r}\\pi$，第二个周长 $${2 * k * r}\\pi$。它们的面积之差是多少？`,
      `${(k * k - 1) * r * r}\\pi`,
      [`${(k - 1) ** 2 * r * r}\\pi`, `${2 * (k - 1) * r}\\pi`, `${k * k * r * r}\\pi`, `${(k * k + 1) * r * r}\\pi`],
      `The radii are $${r}$ and $${k * r}$.`,
      `半径是 $${r}$ 和 $${k * r}$。`,
    );
  }),
  spec("Finding Arc Measure", "求弧的度数", ["central-angles-and-arcs"], (rng, hard) => {
    const [a, b] = [rng.int(20, 170), rng.int(20, 80)];
    const fig = circleFig(
      [[160, 138, "O"]],
      [
        [160, 120, 240, 80],
        [160, 120, 90, 60],
      ],
      t("A circle with center $O$ and two radii forming a central angle.", "圆心为 $O$ 的圆，两条半径构成圆心角。"),
    );
    if (!hard)
      return ask(
        rng,
        `A central angle of a circle measures $${a}^\\circ$. What is the measure of its major arc?`,
        `圆的一个圆心角为 $${a}^\\circ$。它所对的优弧是多少度？`,
        360 - a,
        [180 - a, a, 2 * a === 360 - a ? 361 - a : 2 * a, 180 + a],
        `The whole circle is $360^\\circ$.`,
        `整圆是 $360^\\circ$。`,
        fig,
      );
    return ask(
      rng,
      `Three central angles fill a circle. Two of them measure $${a}^\\circ$ and $${b}^\\circ$. What is the measure of the arc cut by the third?`,
      `三个圆心角铺满一个圆。其中两个是 $${a}^\\circ$ 和 $${b}^\\circ$。第三个所对的弧是多少度？`,
      360 - a - b,
      [180 - a - b === 360 - a - b ? 1 : Math.abs(180 - a - b), a + b, 360 - a, 360 - b],
      `An arc has the same measure as its central angle.`,
      `弧的度数等于其圆心角。`,
      fig,
    );
  }),
  spec("Finding Angles in Circles", "求圆中的角", ["inscribed-angles"], (rng, hard) => {
    const [a, b] = [rng.int(15, 85), rng.int(15, 75)];
    if (!hard)
      return ask(
        rng,
        `An inscribed angle and a central angle cut the same arc. The central angle measures $${2 * a}^\\circ$. What does the inscribed angle measure?`,
        `圆周角和圆心角对着同一段弧。圆心角为 $${2 * a}^\\circ$。圆周角是多少度？`,
        a,
        [2 * a, 4 * a, 180 - 2 * a === a ? a + 1 : 180 - 2 * a, 360 - 2 * a],
        `An inscribed angle is half the central angle.`,
        `圆周角是圆心角的一半。`,
        inscribedAngleFigure(2 * a),
      );
    return ask(
      rng,
      `Triangle $ABC$ is inscribed in a circle with $AB$ as a diameter. If $m\\angle A = ${b}^\\circ$, what is $m\\angle B$?`,
      `三角形 $ABC$ 内接于圆，$AB$ 是直径。若 $m\\angle A = ${b}^\\circ$，$m\\angle B$ 是多少？`,
      90 - b,
      [b === 45 ? 46 : b, 180 - b, 2 * b, 90 + b],
      `Since $AB$ is a diameter, $\\angle C = 90^\\circ$.`,
      `因为 $AB$ 是直径，$\\angle C = 90^\\circ$。`,
      diameterTriangleFigure(b),
    );
  }),
  spec("Problem-Solving With Circle Lengths", "解决圆的长度问题", ["relating-the-circumference-and-area-of-a-circle"], (rng, hard) => {
    const [r, k, p] = [rng.int(2, 30), rng.int(2, 6), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A circle has an area of $${r * r}\\pi$. What is its diameter?`,
        `圆的面积是 $${r * r}\\pi$。直径是多少？`,
        2 * r,
        [r, r * r, 4 * r, 2 * r * r],
        `The radius is $${r}$.`,
        `半径是 $${r}$。`,
      );
    return ask(
      rng,
      `A square is inscribed in a circle of radius $${p * k}$. What is the area of the square?`,
      `正方形内接于半径为 $${p * k}$ 的圆。正方形的面积是多少？`,
      2 * (p * k) ** 2,
      [(p * k) ** 2, 4 * (p * k) ** 2, 2 * p * k, 8 * p * k],
      `The diagonal is a diameter, $${2 * p * k}$. A square's diagonal is $\\sqrt{2}$ times its side, so the side squared is $\\frac{${2 * p * k}^2}{2} = ${2 * (p * k) ** 2}$, and that is the area.`,
      `对角线是直径，长 $${2 * p * k}$。正方形的对角线是边长的 $\\sqrt{2}$ 倍，所以边长的平方是 $\\frac{${2 * p * k}^2}{2} = ${2 * (p * k) ** 2}$，这就是面积。`,
      squareInCircleFigure(`${p * k}`),
    );
  }),
  spec("Finding the Midpoint of a Segment", "求线段的中点", ["midpoints-in-the-coordinate-plane"], (rng, hard) => {
    const [x, y, dx, dy] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(1, 8) * 2, rng.int(1, 8) * 2];
    if (!hard)
      return ask(
        rng,
        `What is the midpoint of the segment from $(${x}, ${y})$ to $(${x + dx}, ${y + dy})$?`,
        `从 $(${x}, ${y})$ 到 $(${x + dx}, ${y + dy})$ 的线段的中点是什么？`,
        `(${x + dx / 2}, ${y + dy / 2})`,
        [
          `(${dx / 2}, ${dy / 2})`,
          `(${dx}, ${dy})`,
          `(${2 * x + dx}, ${2 * y + dy})`,
          `(${x + dx / 2 + 1}, ${y + dy / 2})`,
          `(${x + dx / 2}, ${y + dy / 2 + 1})`,
        ],
        `Average the coordinates.`,
        `取坐标的平均数。`,
      );
    return ask(
      rng,
      `The midpoint of a segment is $(${x + dx}, ${y + dy})$, and one endpoint is $(${x}, ${y})$. What is the other endpoint?`,
      `线段中点是 $(${x + dx}, ${y + dy})$，一个端点是 $(${x}, ${y})$。另一个端点是什么？`,
      `(${x + 2 * dx}, ${y + 2 * dy})`,
      [`(${x + dx / 2}, ${y + dy / 2})`, `(${dx}, ${dy})`, `(${2 * x + dx}, ${2 * y + dy})`, `(${x - dx}, ${y - dy})`],
      `The endpoint is as far past the midpoint as the start is before it.`,
      `这个端点到中点的距离与起点到中点相同。`,
    );
  }),
  spec("Finding a Point Dividing a Segment", "求分割线段的点", ["partitioning-line-segments"], (rng, hard) => {
    const [x, y, dx, dy, p] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(1, 6) * 4, rng.int(1, 6) * 4, rng.int(1, 3)];
    if (!hard)
      return ask(
        rng,
        `Point $P$ lies on the segment from $A(${x}, ${y})$ to $B(${x + dx}, ${y + dy})$ and is $\\frac{1}{4}$ of the way from $A$ to $B$. What are the coordinates of $P$?`,
        `点 $P$ 在从 $A(${x}, ${y})$ 到 $B(${x + dx}, ${y + dy})$ 的线段上，从 $A$ 到 $B$ 走了 $\\frac{1}{4}$。$P$ 的坐标是什么？`,
        `(${x + dx / 4}, ${y + dy / 4})`,
        [
          `(${x + dx / 2}, ${y + dy / 2})`,
          `(${dx / 4}, ${dy / 4})`,
          `(${x + (3 * dx) / 4}, ${y + (3 * dy) / 4})`,
          `(${x + dx / 4}, ${y + dy / 2})`,
        ],
        `Add one quarter of each difference to $A$.`,
        `给 $A$ 加上各差的四分之一。`,
      );
    const q = 4 - p;
    return ask(
      rng,
      `Point $P$ divides the segment from $A(${x}, ${y})$ to $B(${x + dx}, ${y + dy})$ so that $AP : PB = ${p} : ${q}$. What is the $x$-coordinate of $P$?`,
      `点 $P$ 分割从 $A(${x}, ${y})$ 到 $B(${x + dx}, ${y + dy})$ 的线段，使 $AP : PB = ${p} : ${q}$。$P$ 的 $x$ 坐标是多少？`,
      x + (p * dx) / 4,
      [x + (q * dx) / 4 === x + (p * dx) / 4 ? x + dx : x + (q * dx) / 4, (p * dx) / 4, x + dx, x + (p * dx) / 4 + 1],
      `$P$ is $\\frac{${p}}{4}$ of the way from $A$ to $B$.`,
      `$P$ 在从 $A$ 到 $B$ 的 $\\frac{${p}}{4}$ 处。`,
    );
  }),
  spec("Finding the Distance Between Points", "求两点间的距离", ["the-distance-formula"], (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const [x, y, k] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(1, 3)];
    if (!hard)
      return ask(
        rng,
        `What is the distance between $(${x}, ${y})$ and $(${x + p * k}, ${y + q * k})$?`,
        `$(${x}, ${y})$ 与 $(${x + p * k}, ${y + q * k})$ 之间的距离是多少？`,
        c * k,
        [(p + q) * k, (c + 1) * k, (q - p) * k > 0 ? (q - p) * k : (p - q) * k, c * k + 1],
        `The differences are $${p * k}$ and $${q * k}$.`,
        `坐标差是 $${p * k}$ 和 $${q * k}$。`,
      );
    return ask(
      rng,
      `The point $(${x + p * k}, t)$ is at distance $${c * k}$ from $(${x}, ${y})$, and $t > ${y}$. What is $t$?`,
      `点 $(${x + p * k}, t)$ 到 $(${x}, ${y})$ 的距离是 $${c * k}$，且 $t > ${y}$。$t$ 是多少？`,
      y + q * k,
      [y - q * k, q * k, y + c * k, y + q * k + 1],
      `The vertical difference must be $${q * k}$.`,
      `竖直差必须是 $${q * k}$。`,
    );
  }),
  spec("Finding Slope From Two Points", "由两点求斜率", ["slope-of-a-line"], (rng, hard) => {
    const [x, y, dx, dy] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(1, 9), rng.nonZero(-9, 9)];
    if (!hard)
      return ask(
        rng,
        `What is the slope of the line through $(${x}, ${y})$ and $(${x + dx}, ${y + dy})$?`,
        `经过 $(${x}, ${y})$ 和 $(${x + dx}, ${y + dy})$ 的直线的斜率是多少？`,
        Q.of(dy, dx),
        [Q.of(dx, dy), Q.of(-dy, dx), Q.of(dy, dx).add(Q.of(1)), Q.of(dx + 1, dy)],
        `Rise over run is $\\frac{${dy}}{${dx}}$.`,
        `竖直变化比水平变化是 $\\frac{${dy}}{${dx}}$。`,
      );
    return ask(
      rng,
      `The line through $(${x}, ${y})$ and $(${x + dx}, c)$ has slope $${dy}$. What is $c$?`,
      `经过 $(${x}, ${y})$ 和 $(${x + dx}, c)$ 的直线斜率是 $${dy}$。$c$ 是多少？`,
      y + dy * dx,
      [y + dy, y - dy * dx, dy * dx, y + dy * dx + 1],
      `$c - (${y}) = (${dy})(${dx})$.`,
      `$c - (${y}) = (${dy})(${dx})$。`,
    );
  }),
  spec("Finding Slope From an Equation", "由方程求斜率", ["slope-intercept-form"], (rng, hard) => {
    const [a, b, c] = [rng.int(2, 9), rng.int(2, 9), rng.int(1, 20)];
    if (!hard)
      return ask(
        rng,
        `What is the slope of the line $y = ${a}x + ${c}$?`,
        `直线 $y = ${a}x + ${c}$ 的斜率是多少？`,
        a,
        [c, -a, Q.of(1, a), a + c],
        `In $y = mx + b$, the slope is $m$.`,
        `在 $y = mx + b$ 中，斜率是 $m$。`,
      );
    return ask(
      rng,
      `What is the slope of the line $${a}x + ${b}y = ${c}$?`,
      `直线 $${a}x + ${b}y = ${c}$ 的斜率是多少？`,
      Q.of(-a, b),
      [Q.of(a, b), Q.of(-b, a), Q.of(b, a), Q.of(c, b)],
      `Solve for $y$: $y = -\\frac{${a}}{${b}}x + \\frac{${c}}{${b}}$.`,
      `解出 $y$：$y = -\\frac{${a}}{${b}}x + \\frac{${c}}{${b}}$。`,
    );
  }),
  spec("Comparing and Reading Slopes", "比较和读斜率", ["properties-of-lines-in-slope-intercept-form"], (rng, hard) => {
    const [m1, m2, b] = [rng.int(2, 5), rng.int(6, 9), rng.int(1, 12)];
    if (!hard)
      return words(
        rng,
        t(
          `Which line is the steepest: $y = ${m1}x + ${b}$, $y = -${m2}x + ${b}$, $y = \\frac{1}{${m1}}x$ or $y = ${m1 + 1}x - ${b}$?`,
          `哪条直线最陡：$y = ${m1}x + ${b}$，$y = -${m2}x + ${b}$，$y = \\frac{1}{${m1}}x$，还是 $y = ${m1 + 1}x - ${b}$？`,
        ),
        t(`$y = -${m2}x + ${b}$`, `$y = -${m2}x + ${b}$`),
        [
          t(`$y = ${m1}x + ${b}$`, `$y = ${m1}x + ${b}$`),
          t(`$y = \\frac{1}{${m1}}x$`, `$y = \\frac{1}{${m1}}x$`),
          t(`$y = ${m1 + 1}x - ${b}$`, `$y = ${m1 + 1}x - ${b}$`),
        ],
        t(
          `Steepness is the size of the slope, whatever its sign; $${m2}$ is the largest size.`,
          `陡峭程度看斜率的大小，不论正负；$${m2}$ 最大。`,
        ),
      );
    return ask(
      rng,
      `What is the slope of a line perpendicular to $y = ${m1}x + ${b}$, plus the slope of a line parallel to it?`,
      `与 $y = ${m1}x + ${b}$ 垂直的直线的斜率，加上与它平行的直线的斜率，等于多少？`,
      Q.of(m1 * m1 - 1, m1),
      [Q.of(m1 * m1 + 1, m1), 2 * m1, 0, Q.of(-1, m1)],
      `The slopes are $-\\frac{1}{${m1}}$ and $${m1}$.`,
      `斜率分别是 $-\\frac{1}{${m1}}$ 和 $${m1}$。`,
    );
  }),
  spec("Finding a Point on a Line", "求直线上的点", ["identifying-solutions-to-linear-equations"], (rng, hard) => {
    const [m, b, x, k] = [rng.int(2, 9), rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.int(1, 5)];
    if (!hard)
      return ask(
        rng,
        `Which point lies on the line $y = ${m}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}$?`,
        `哪个点在直线 $y = ${m}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}$ 上？`,
        `(${x}, ${m * x + b})`,
        [`(${x}, ${m * x - b})`, `(${m * x + b}, ${x})`, `(${x}, ${m * x + b + 1})`, `(${x + 1}, ${m * x + b})`],
        `Substitute $x = ${x}$.`,
        `代入 $x = ${x}$。`,
      );
    return ask(
      rng,
      `The point $(${x}, c)$ lies on the line through $(${x + k}, ${m * (x + k) + b})$ with slope $${m}$. What is $c$?`,
      `点 $(${x}, c)$ 在经过 $(${x + k}, ${m * (x + k) + b})$、斜率为 $${m}$ 的直线上。$c$ 是多少？`,
      m * x + b,
      [m * (x + k) + b + m * k, m * x, m * (x + k) + b - k, m * x + b + 1],
      `Moving left $${k}$ lowers $y$ by $${m * k}$.`,
      `向左移 $${k}$，$y$ 减少 $${m * k}$。`,
    );
  }),
  spec(
    "Placing Figures in the Coordinate Plane",
    "在坐标平面中放置图形",
    ["finding-areas-and-perimeters-in-the-coordinate-plane", "calculating-areas-of-rectangles-in-the-plane"],
    (rng, hard) => {
      const [x, y, w, h] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(2, 12), rng.int(2, 12)];
      if (!hard)
        return ask(
          rng,
          `Three vertices of a rectangle are $(${x}, ${y})$, $(${x + w}, ${y})$ and $(${x + w}, ${y + h})$. What is the fourth vertex?`,
          `长方形三个顶点是 $(${x}, ${y})$，$(${x + w}, ${y})$，$(${x + w}, ${y + h})$。第四个顶点是什么？`,
          `(${x}, ${y + h})`,
          [`(${x + w}, ${y + 2 * h})`, `(${x + w + w}, ${y + h})`, `(${y + h}, ${x})`, `(${x - w}, ${y + h})`],
          `The missing vertex shares $x$ with the first and $y$ with the third.`,
          `缺少的顶点与第一个点 $x$ 相同，与第三个点 $y$ 相同。`,
          rectPlot(x, y, w, h, true),
        );
      return ask(
        rng,
        `A rectangle has vertices $(${x}, ${y})$, $(${x + w}, ${y})$, $(${x + w}, ${y + h})$ and $(${x}, ${y + h})$. What is its area?`,
        `长方形的顶点是 $(${x}, ${y})$，$(${x + w}, ${y})$，$(${x + w}, ${y + h})$，$(${x}, ${y + h})$。面积是多少？`,
        w * h,
        [2 * (w + h), w + h, w * h + w, (x + w) * (y + h) === w * h ? w * h + 1 : (x + w) * (y + h)],
        `The width is $${w}$ and the height is $${h}$.`,
        `宽是 $${w}$，高是 $${h}$。`,
        rectPlot(x, y, w, h, false),
      );
    },
  ),
  spec("Locating Points in the Coordinate Plane", "在坐标平面中确定点的位置", ["the-coordinate-plane"], (rng, hard) => {
    const [x, y, a, b] = [rng.int(1, 12), rng.int(1, 12), rng.int(1, 9), rng.int(1, 9)];
    const quadrant = rng.int(1, 4);
    const sx = quadrant === 1 || quadrant === 4 ? x : -x;
    const sy = quadrant === 1 || quadrant === 2 ? y : -y;
    const names = [t("Quadrant I", "第一象限"), t("Quadrant II", "第二象限"), t("Quadrant III", "第三象限"), t("Quadrant IV", "第四象限")];
    if (!hard)
      return words(
        rng,
        t(`In which quadrant does $(${sx}, ${sy})$ lie?`, `$(${sx}, ${sy})$ 在哪个象限？`),
        names[quadrant - 1] ?? t("", ""),
        names.filter((_, i) => i !== quadrant - 1),
        t(`Check the sign of each coordinate.`, `看每个坐标的正负。`),
      );
    return ask(
      rng,
      `A point starts at $(${sx}, ${sy})$, moves $${a}$ units left and then $${b}$ units up. What are its new coordinates?`,
      `一个点从 $(${sx}, ${sy})$ 出发，向左移 $${a}$ 个单位，再向上移 $${b}$ 个单位。新坐标是什么？`,
      `(${sx - a}, ${sy + b})`,
      [`(${sx + a}, ${sy + b})`, `(${sx - a}, ${sy - b})`, `(${sx + b}, ${sy - a})`, `(${sy + b}, ${sx - a})`, `(${sx + a}, ${sy - b})`],
      `Left lowers $x$, and up raises $y$.`,
      `向左使 $x$ 减小，向上使 $y$ 增大。`,
    );
  }),
  spec("Finding a Dimension From Volume", "由体积求尺寸", ["volumes-of-cylinders", "volumes-of-right-rectangular-prisms"], (rng, hard) => {
    const [l, w, h, r] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A rectangular box has a volume of $${l * w * h}$, a length of $${l}$ and a width of $${w}$. What is its height?`,
        `长方体盒子体积 $${l * w * h}$，长 $${l}$，宽 $${w}$。高是多少？`,
        h,
        [l * w, h + 1, l * w * h - l - w, 2 * h],
        `Divide the volume by $${l * w}$.`,
        `体积除以 $${l * w}$。`,
      );
    return ask(
      rng,
      `A cylinder has a volume of $${r * r * h}\\pi$ and a radius of $${r}$. What is its height?`,
      `圆柱体积 $${r * r * h}\\pi$，半径 $${r}$。高是多少？`,
      h,
      [r * h, 2 * h, h + r, r * r * h],
      `$\\pi(${r})^2h = ${r * r * h}\\pi$.`,
      `$\\pi(${r})^2h = ${r * r * h}\\pi$。`,
    );
  }),
  spec("Converting Volume in Context", "在情境中换算体积", ["converting-units-of-volume-to-smaller-units"], (rng, hard) => {
    const [a, b, c, rate] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9), rng.int(2, 8)];
    if (!hard)
      return ask(
        rng,
        `A box measures $${a}$ feet by $${b}$ feet by $${c}$ feet. What is its volume in cubic yards? ($1$ yard $= 3$ feet)`,
        `盒子长宽高为 $${a}$ 英尺、$${b}$ 英尺、$${c}$ 英尺。体积是多少立方码？（$1$ 码 $= 3$ 英尺）`,
        Q.of(a * b * c, 27),
        [Q.of(a * b * c, 3), Q.of(a * b * c, 9), a * b * c, 27 * a * b * c],
        `Divide the cubic feet by $3^3 = 27$.`,
        `立方英尺数除以 $3^3 = 27$。`,
      );
    return ask(
      rng,
      `A trench is $${a}$ yards long, $${b}$ yards wide and $${c}$ yards deep. Removing dirt costs $\\$${rate}$ per cubic foot. What is the total cost, in dollars?`,
      `沟长 $${a}$ 码、宽 $${b}$ 码、深 $${c}$ 码。清运泥土每立方英尺 $${rate}$ 美元。总费用是多少美元？`,
      27 * a * b * c * rate,
      [a * b * c * rate, 3 * a * b * c * rate, 9 * a * b * c * rate, 27 * a * b * c],
      `There are $27$ cubic feet in each cubic yard.`,
      `每立方码有 $27$ 立方英尺。`,
    );
  }),
  spec("Packing Congruent Solids", "装填全等的立体", ["packing-rectangular-boxes"], (rng, hard) => {
    const [a, b, c, s] = [rng.int(2, 6), rng.int(2, 6), rng.int(2, 6), rng.int(2, 4)];
    if (!hard)
      return ask(
        rng,
        `How many cubes with edge $${s}$ inches fit in a box measuring $${a * s}$ by $${b * s}$ by $${c * s}$ inches?`,
        `长宽高为 $${a * s}$、$${b * s}$、$${c * s}$ 英寸的盒子能装多少个棱长 $${s}$ 英寸的立方体？`,
        a * b * c,
        [a * b * c * s, a + b + c, (a + 1) * b * c, a * b * c + s],
        `There are $${a}$, $${b}$ and $${c}$ cubes along the three edges.`,
        `三条棱上分别有 $${a}$、$${b}$、$${c}$ 个立方体。`,
      );
    return ask(
      rng,
      `A box measures $${a * s + 1}$ by $${b * s + 1}$ by $${c * s}$ inches. How many whole cubes with edge $${s}$ inches can be packed in it?`,
      `盒子长宽高为 $${a * s + 1}$、$${b * s + 1}$、$${c * s}$ 英寸。最多能装多少个棱长 $${s}$ 英寸的完整立方体？`,
      a * b * c,
      [
        (a + 1) * (b + 1) * c,
        (a + 1) * b * c,
        Math.floor(((a * s + 1) * (b * s + 1) * c * s) / s ** 3) === a * b * c
          ? a * b * c + 1
          : Math.floor(((a * s + 1) * (b * s + 1) * c * s) / s ** 3),
        a * b * (c + 1),
      ],
      `Extra space shorter than an edge is wasted, so use $${a}$, $${b}$ and $${c}$ along the edges.`,
      `短于棱长的多余空间用不上，所以三条棱上放 $${a}$、$${b}$、$${c}$ 个。`,
    );
  }),
  spec("Identifying Features of a Solid", "判断立体的特征", ["composite-solids"], (rng, hard) => {
    const n = rng.int(3, 30);
    if (!hard)
      return ask(
        rng,
        `How many faces, edges and vertices does a prism have if its bases are $${n}$-sided polygons?`,
        `底面是 $${n}$ 边形的棱柱有多少个面、棱和顶点？`,
        `${n + 2} \\text{ faces}, ${3 * n} \\text{ edges}, ${2 * n} \\text{ vertices}`,
        [
          `${n} \\text{ faces}, ${3 * n} \\text{ edges}, ${2 * n} \\text{ vertices}`,
          `${n + 2} \\text{ faces}, ${2 * n} \\text{ edges}, ${2 * n} \\text{ vertices}`,
          `${n + 1} \\text{ faces}, ${2 * n} \\text{ edges}, ${n + 1} \\text{ vertices}`,
          `${n + 2} \\text{ faces}, ${3 * n} \\text{ edges}, ${n} \\text{ vertices}`,
        ],
        `There are two bases plus $${n}$ side faces, $${n}$ edges on each base plus $${n}$ joining them, and $${n}$ vertices on each base.`,
        `两个底面加 $${n}$ 个侧面；每个底面 $${n}$ 条棱，另有 $${n}$ 条连接棱；每个底面 $${n}$ 个顶点。`,
      );
    return ask(
      rng,
      `How many faces, edges and vertices does a pyramid have if its base is ${article(n)} $${n}$-sided polygon?`,
      `底面是 $${n}$ 边形的棱锥有多少个面、棱和顶点？`,
      `${n + 1} \\text{ faces}, ${2 * n} \\text{ edges}, ${n + 1} \\text{ vertices}`,
      [
        `${n} \\text{ faces}, ${2 * n} \\text{ edges}, ${n + 1} \\text{ vertices}`,
        `${n + 1} \\text{ faces}, ${3 * n} \\text{ edges}, ${n + 1} \\text{ vertices}`,
        `${n + 2} \\text{ faces}, ${3 * n} \\text{ edges}, ${2 * n} \\text{ vertices}`,
        `${n + 1} \\text{ faces}, ${2 * n} \\text{ edges}, ${n} \\text{ vertices}`,
      ],
      `The base and $${n}$ triangles make the faces, $${n}$ base edges and $${n}$ edges up to the apex make the edges, and the $${n}$ base corners and the apex make the vertices.`,
      `底面加 $${n}$ 个三角形是面；底面 $${n}$ 条棱加通向顶点的 $${n}$ 条棱是棱；底面 $${n}$ 个角加上顶点是顶点。`,
    );
  }),
  spec("Writing Ellipse Equations", "写椭圆方程", ["equations-of-ellipses-centered-at-a-general-point"], (rng, hard) => {
    const [h, k, a] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9), rng.int(3, 9)];
    const b = a + rng.int(1, 5);
    const X = `(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})^2`;
    const Y = `(y ${k < 0 ? "+" : "-"} ${Math.abs(k)})^2`;
    const X2 = `(x ${h < 0 ? "-" : "+"} ${Math.abs(h)})^2`;
    const Y2 = `(y ${k < 0 ? "-" : "+"} ${Math.abs(k)})^2`;
    if (!hard)
      return ask(
        rng,
        `Which equation is an ellipse with center $(${h}, ${k})$ that extends $${b}$ units horizontally and $${a}$ units vertically from its center?`,
        `哪个方程是中心为 $(${h}, ${k})$、从中心水平伸展 $${b}$ 个单位、竖直伸展 $${a}$ 个单位的椭圆？`,
        `\\frac{${X}}{${b * b}} + \\frac{${Y}}{${a * a}} = 1`,
        [
          `\\frac{${X}}{${a * a}} + \\frac{${Y}}{${b * b}} = 1`,
          `\\frac{${X2}}{${b * b}} + \\frac{${Y2}}{${a * a}} = 1`,
          `\\frac{${X}}{${b}} + \\frac{${Y}}{${a}} = 1`,
          `\\frac{${X}}{${b * b}} - \\frac{${Y}}{${a * a}} = 1`,
        ],
        `The denominators are the squares of the horizontal and vertical extents.`,
        `分母是水平和竖直伸展量的平方。`,
      );
    return ask(
      rng,
      `An ellipse has vertices at $(${h - b}, ${k})$ and $(${h + b}, ${k})$ and one co-vertex at $(${h}, ${k + a})$. Which equation represents it?`,
      `椭圆的顶点在 $(${h - b}, ${k})$ 和 $(${h + b}, ${k})$，一个余顶点在 $(${h}, ${k + a})$。哪个方程表示它？`,
      `\\frac{${X}}{${b * b}} + \\frac{${Y}}{${a * a}} = 1`,
      [
        `\\frac{${X}}{${a * a}} + \\frac{${Y}}{${b * b}} = 1`,
        `\\frac{${X2}}{${b * b}} + \\frac{${Y2}}{${a * a}} = 1`,
        `\\frac{${X}}{${4 * b * b}} + \\frac{${Y}}{${a * a}} = 1`,
        `\\frac{${X}}{${b * b}} - \\frac{${Y}}{${a * a}} = 1`,
      ],
      `The center is the midpoint of the vertices, $(${h}, ${k})$.`,
      `中心是两顶点的中点 $(${h}, ${k})$。`,
    );
  }),
  spec("Finding Features of an Ellipse", "求椭圆的特征", ["vertices-and-eccentricity-of-ellipses"], (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const [h, k, m] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(1, 3)];
    const X = h === 0 ? "x^2" : `(x ${h < 0 ? "+" : "-"} ${Math.abs(h)})^2`;
    const Y = k === 0 ? "y^2" : `(y ${k < 0 ? "+" : "-"} ${Math.abs(k)})^2`;
    if (!hard)
      return ask(
        rng,
        `What is the center of the ellipse $\\frac{${X}}{${(c * m) ** 2}} + \\frac{${Y}}{${(q * m) ** 2}} = 1$?`,
        `椭圆 $\\frac{${X}}{${(c * m) ** 2}} + \\frac{${Y}}{${(q * m) ** 2}} = 1$ 的中心是什么？`,
        `(${h}, ${k})`,
        [`(${-h}, ${-k})`, `(${k}, ${h})`, `(${c * m}, ${q * m})`, `(${h + 1}, ${k})`, `(${h}, ${k + 1})`],
        `Read the values subtracted from $x$ and $y$.`,
        `读出从 $x$ 和 $y$ 中减去的值。`,
      );
    return ask(
      rng,
      `What is the distance between the two foci of $\\frac{${X}}{${(c * m) ** 2}} + \\frac{${Y}}{${(q * m) ** 2}} = 1$?`,
      `$\\frac{${X}}{${(c * m) ** 2}} + \\frac{${Y}}{${(q * m) ** 2}} = 1$ 的两个焦点之间的距离是多少？`,
      2 * p * m,
      [p * m, 2 * c * m, 2 * q * m, 4 * p * m],
      `The focal distance from the center is $\\sqrt{${(c * m) ** 2} - ${(q * m) ** 2}} = ${p * m}$.`,
      `焦点到中心的距离是 $\\sqrt{${(c * m) ** 2} - ${(q * m) ** 2}} = ${p * m}$。`,
    );
  }),
  spec("Working With Hyperbolas", "双曲线", ["equations-of-hyperbolas-centered-at-the-origin"], (rng, hard) => {
    const [a, b, s] = [rng.int(2, 12), rng.int(2, 12), rng.int(0, 1)];
    if (!hard)
      return ask(
        rng,
        `Where are the vertices of the hyperbola $\\frac{${s ? "y" : "x"}^2}{${a * a}} - \\frac{${s ? "x" : "y"}^2}{${b * b}} = 1$?`,
        `双曲线 $\\frac{${s ? "y" : "x"}^2}{${a * a}} - \\frac{${s ? "x" : "y"}^2}{${b * b}} = 1$ 的顶点在哪里？`,
        s ? `(0, \\pm ${a})` : `(\\pm ${a}, 0)`,
        [
          s ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`,
          s ? `(0, \\pm ${a + b})` : `(\\pm ${a + b}, 0)`,
          s ? `(\\pm ${b}, 0)` : `(0, \\pm ${b})`,
          s ? `(0, \\pm ${a * a})` : `(\\pm ${a * a}, 0)`,
          s ? `(0, \\pm ${a + 1})` : `(\\pm ${a + 1}, 0)`,
        ],
        `The vertices lie along the axis of the positive term.`,
        `顶点在正项对应的轴上。`,
      );
    return ask(
      rng,
      `What are the slopes of the asymptotes of $\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1$?`,
      `$\\frac{x^2}{${a * a}} - \\frac{y^2}{${b * b}} = 1$ 的渐近线的斜率是多少？`,
      `\\pm\\frac{${b}}{${a}}`,
      [
        `\\pm\\frac{${a}}{${b}}`,
        `\\pm\\frac{${b * b}}{${a * a}}`,
        `\\pm\\frac{${a * a}}{${b * b}}`,
        `\\pm\\frac{${b + 1}}{${a}}`,
        `\\pm ${a * b}`,
      ],
      `The asymptotes are $y = \\pm\\frac{${b}}{${a}}x$.`,
      `渐近线是 $y = \\pm\\frac{${b}}{${a}}x$。`,
    );
  }),
  spec("Analyzing Intersections of Conics", "分析圆锥曲线的交点", ["intersections-of-circles-with-lines"], (rng, hard) => {
    const [r, d, p] = [rng.int(2, 20), rng.int(1, 9), rng.pick(triples)];
    const k = rng.int(1, 7);
    const [u, v, c] = p;
    if (!hard)
      return ask(
        rng,
        `How many points do the circle $x^2 + y^2 = ${r * r}$ and the horizontal line $y = ${r + d}$ have in common?`,
        `圆 $x^2 + y^2 = ${r * r}$ 和水平线 $y = ${r + d}$ 有多少个公共点？`,
        0,
        [1, 2, 4],
        `The circle reaches only as high as $y = ${r}$, so the line misses it.`,
        `圆最高到 $y = ${r}$，所以这条直线不与它相交。`,
      );
    return ask(
      rng,
      `The circle $x^2 + y^2 = ${(c * k) ** 2}$ and the line $y = ${v * k}$ meet at two points. What is the distance between those points?`,
      `圆 $x^2 + y^2 = ${(c * k) ** 2}$ 和直线 $y = ${v * k}$ 交于两点。两点之间的距离是多少？`,
      2 * u * k,
      [u * k, 2 * c * k, 2 * v * k, 4 * u * k],
      `Substituting gives $x = \\pm ${u * k}$.`,
      `代入得 $x = \\pm ${u * k}$。`,
    );
  }),
];
