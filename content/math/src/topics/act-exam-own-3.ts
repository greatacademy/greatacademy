import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import type { ExamSpec } from "../exam.ts";
import { ask, cx, sg, words } from "../exam.ts";
import {
  anglePts,
  cevianFigure,
  crossFigure,
  exteriorFigure,
  isoPts,
  pointsFigure,
  polyFigure,
  radiusFigure,
  rectFigure,
  rightPts,
  sectorFigure,
  transversalFigure,
  twoTrianglesFigure,
} from "../exam-figures.ts";

// ACT Math Prep, questions of its own for the topics it shares with SAT Math Prep: angles, triangles, similarity, trigonometry, circles, coordinate geometry and solids.

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
] as const;
const moreTriples = [
  ...triples,
  [39, 80, 89],
  [9, 40, 41],
  [12, 35, 37],
  [11, 60, 61],
  [28, 45, 53],
  [33, 56, 65],
  [16, 63, 65],
  [48, 55, 73],
] as const;
const lin = (a: number, b: number): string => `${cx(a)} ${sg(b)}`.trim();
const ratio = (n: number, d: number): string => Q.of(n, d).toLatex();
const pi = (n: number): string => (n === 1 ? "\\pi" : `${n}\\pi`);
const square = (v: string, c: number): string => (c === 0 ? `${v}^2` : `(${v} ${sg(-c)})^2`);
const sum = (h: number, k: number, r2: number): string => `${square("x", h)} + ${square("y", k)} = ${r2}`;

/** actOwnGeometry are the question generators of ACT topics on angles, triangles, similarity, trigonometry, circles, coordinate geometry and solids, by title. */
export const actOwnGeometry: Record<string, ExamSpec["make"]> = {
  "Finding Angles Formed by Intersecting Lines": (rng, hard) => {
    const a = rng.int(30, 85) + 65 * rng.int(0, 1);
    if (!hard)
      return ask(
        rng,
        `In the figure, two straight lines cross, and one of the angles measures $${a}^\\circ$. What is the measure of the angle marked "?", in degrees?`,
        `图中两条直线相交，其中一个角为 $${a}^\\circ$。标有 "?" 的角是多少度？`,
        180 - a,
        [a, a + 10, 360 - a],
        `The two angles together form a straight line, so they add to $180^\\circ$: $180 - ${a} = ${180 - a}$.`,
        `两角合起来是平角，和为 $180^\\circ$：$180 - ${a} = ${180 - a}$。`,
        crossFigure(a, `${a}°`, "?", false),
      );
    const [p, q] = [rng.int(2, 6), rng.int(2, 25)];
    const x = rng.int(8, 25);
    const b = p * x + q;
    return ask(
      rng,
      `Two lines cross so that vertical angles measure $(${p}x + ${q})^\\circ$ and $${b}^\\circ$. What is the measure of a neighboring angle, in degrees?`,
      `两直线相交，一对对顶角为 $(${p}x + ${q})^\\circ$ 和 $${b}^\\circ$。其相邻的角是多少度？`,
      180 - b,
      [b, x, 180 - x],
      `Vertical angles are equal, so the angle is $${b}^\\circ$ whatever $x$ is. A neighboring angle is its supplement: $180 - ${b} = ${180 - b}$.`,
      `对顶角相等，所以无论 $x$ 是多少，这个角都是 $${b}^\\circ$。相邻的角是它的补角：$180 - ${b} = ${180 - b}$。`,
    );
  },
  "Finding Angles With Parallel Lines": (rng, hard) => {
    const a = rng.int(35, 85) + 60 * rng.int(0, 1);
    if (!hard) {
      const same = rng.int(0, 1) === 1;
      return ask(
        rng,
        `In the figure, the two horizontal lines are parallel and are crossed by a third line. What is the measure of the angle marked "?", in degrees?`,
        `图中两条水平线平行，并被第三条直线所截。标有 "?" 的角是多少度？`,
        same ? a : 180 - a,
        [same ? 180 - a : a, 90 + (a % 40), 360 - a],
        same
          ? `The marked angles are in the same position at the two crossings, so they are corresponding angles and equal: $${a}^\\circ$.`
          : `The marked angles lie between the parallel lines on the same side of the crossing line, so they add to $180^\\circ$: $180 - ${a} = ${180 - a}$.`,
        same
          ? `两个标记的角在两个交点处位置相同，是同位角，相等：$${a}^\\circ$。`
          : `两个标记的角在平行线之间、截线同侧，和为 $180^\\circ$：$180 - ${a} = ${180 - a}$。`,
        transversalFigure(a, `${a}°`, "?", same),
      );
    }
    const k = rng.int(2, 4);
    const x = rng.int(10, 25);
    const c = rng.int(15, 30);
    const v = k * x + c;
    return ask(
      rng,
      `In the figure, the horizontal lines are parallel, and corresponding angles measure $(${k}x + ${c})^\\circ$ and $${v}^\\circ$. What is the value of $x$?`,
      `图中水平线平行，一对同位角为 $(${k}x + ${c})^\\circ$ 和 $${v}^\\circ$。$x$ 的值是多少？`,
      x,
      [v, x + c, 180 - v],
      `Corresponding angles are equal, so $${k}x + ${c} = ${v}$. Then $${k}x = ${k * x}$ and $x = ${x}$.`,
      `同位角相等，所以 $${k}x + ${c} = ${v}$。于是 $${k}x = ${k * x}$，$x = ${x}$。`,
      transversalFigure(v, `(${k}x + ${c})°`, `${v}°`, true),
    );
  },
  "Problem-Solving With Parallel Lines": (rng, hard) => {
    const [a, b] = [rng.int(30, 70), rng.int(30, 70)];
    if (!hard)
      return ask(
        rng,
        `In triangle $ABC$, $\\overline{DE}$ is parallel to $\\overline{BC}$, with $D$ on $\\overline{AB}$ and $E$ on $\\overline{AC}$. If angle $ABC$ is $${a}^\\circ$ and angle $ACB$ is $${b}^\\circ$, what is angle $AED$, in degrees?`,
        `在三角形 $ABC$ 中，$\\overline{DE}$ 平行于 $\\overline{BC}$，$D$ 在 $\\overline{AB}$ 上，$E$ 在 $\\overline{AC}$ 上。若角 $ABC$ 为 $${a}^\\circ$，角 $ACB$ 为 $${b}^\\circ$，角 $AED$ 是多少度？`,
        b,
        [a, 180 - a - b, 180 - b],
        `Angles $AED$ and $ACB$ are corresponding angles for the parallel lines, so angle $AED$ is $${b}^\\circ$.`,
        `角 $AED$ 与角 $ACB$ 是平行线的同位角，所以角 $AED$ 为 $${b}^\\circ$。`,
      );
    const c = 180 - a;
    return ask(
      rng,
      `Two parallel lines are crossed by a third line. One of the eight angles formed measures $${a}^\\circ$. What is the sum of the measures of the four angles that are not equal to $${a}^\\circ$?`,
      `两条平行线被第三条直线所截。形成的八个角中有一个为 $${a}^\\circ$。不等于 $${a}^\\circ$ 的四个角之和是多少度？`,
      4 * c,
      [4 * a, 360, c],
      `Four of the angles equal $${a}^\\circ$, and the other four equal its supplement, $${c}^\\circ$. Their sum is $4(${c}) = ${4 * c}$.`,
      `四个角等于 $${a}^\\circ$，另外四个等于它的补角 $${c}^\\circ$。它们的和为 $4(${c}) = ${4 * c}$。`,
    );
  },
  "Finding Interior Angles of Triangles": (rng, hard) => {
    const [a, b] = [rng.int(25, 80), rng.int(25, 70)];
    if (!hard)
      return ask(
        rng,
        `In the triangle shown, what is the measure of the angle marked "?", in degrees?`,
        `图中三角形里，标有 "?" 的角是多少度？`,
        180 - a - b,
        [360 - a - b, a + b, 90 - Math.min(a, b)],
        `The angles of a triangle add to $180^\\circ$, so the third is $180 - ${a} - ${b} = ${180 - a - b}$.`,
        `三角形内角和为 $180^\\circ$，所以第三个角为 $180 - ${a} - ${b} = ${180 - a - b}$。`,
        polyFigure(anglePts(a, b), { a: [`${a}°`, `${b}°`, "?"] }),
      );
    const [p, q] = [rng.int(2, 3), rng.int(1, 4)];
    const k = rng.int(5, 15);
    const m = 180 - (p + q + 1) * k;
    return ask(
      rng,
      `The angles of a triangle measure $x^\\circ$, $${p}x^\\circ$ and $(${q}x + ${m})^\\circ$. What is the measure of the smallest angle, in degrees?`,
      `一个三角形的三个角为 $x^\\circ$、$${p}x^\\circ$ 和 $(${q}x + ${m})^\\circ$。最小的角是多少度？`,
      k,
      [p * k, q * k + m, 180 - m],
      `Their sum gives $${p + q + 1}x + ${m} = 180$, so $x = ${k}$. The angles are then $${k}^\\circ$, $${p * k}^\\circ$ and $${q * k + m}^\\circ$, and the smallest is $${k}^\\circ$.`,
      `三角之和给出 $${p + q + 1}x + ${m} = 180$，所以 $x = ${k}$。三个角为 $${k}^\\circ$、$${p * k}^\\circ$、$${q * k + m}^\\circ$，最小的是 $${k}^\\circ$。`,
    );
  },
  "Finding Exterior Angles of Triangles": (rng, hard) => {
    const [a, b] = [rng.int(25, 75), rng.int(25, 70)];
    if (!hard)
      return ask(
        rng,
        `In the figure, one side of the triangle is extended. What is the measure of the exterior angle marked "?", in degrees?`,
        `图中三角形的一边被延长。标有 "?" 的外角是多少度？`,
        a + b,
        [180 - a - b, 180 - a, Math.abs(a - b) + 1],
        `An exterior angle equals the sum of the two interior angles that are not next to it: $${a} + ${b} = ${a + b}$.`,
        `外角等于与它不相邻的两个内角之和：$${a} + ${b} = ${a + b}$。`,
        exteriorFigure(a, b, `${a}°`, `${b}°`, "?"),
      );
    return ask(
      rng,
      `An exterior angle of a triangle measures $${a + b}^\\circ$. One of the two interior angles not next to it measures $${a}^\\circ$. What is the interior angle next to the exterior angle, in degrees?`,
      `三角形的一个外角为 $${a + b}^\\circ$。与它不相邻的内角之一为 $${a}^\\circ$。与该外角相邻的内角是多少度？`,
      180 - a - b,
      [b, a + b, 180 - a],
      `An exterior angle and the interior angle next to it form a straight line, so that angle is $180 - ${a + b} = ${180 - a - b}$. The value $${a}$ is not needed.`,
      `外角与相邻内角组成平角，所以该角为 $180 - ${a + b} = ${180 - a - b}$。$${a}$ 这个值用不上。`,
      exteriorFigure(a, b, `${a}°`, "", `${a + b}°`),
    );
  },
  "Finding Angles in Isosceles Triangles": (rng, hard) => {
    const base = rng.int(20, 80);
    if (!hard)
      return ask(
        rng,
        `In the figure, the two slanted sides of the triangle are congruent, and one base angle measures $${base}^\\circ$. What is the measure of the top angle, in degrees?`,
        `图中三角形的两条斜边相等，一个底角为 $${base}^\\circ$。顶角是多少度？`,
        180 - 2 * base,
        [base, 180 - base, 90 - base],
        `The base angles are equal, so together they make $${2 * base}^\\circ$, and the top angle is $180 - ${2 * base} = ${180 - 2 * base}$.`,
        `两底角相等，合起来是 $${2 * base}^\\circ$，所以顶角为 $180 - ${2 * base} = ${180 - 2 * base}$。`,
        polyFigure(isoPts(180 - 2 * base), { a: [`${base}°`, null, "?"] }),
      );
    const out = 180 - base;
    return ask(
      rng,
      `In an isosceles triangle with $AB = AC$, the base $\\overline{BC}$ is extended past $C$ to $D$, and angle $ACD$ measures $${out}^\\circ$. What is angle $BAC$, in degrees?`,
      `等腰三角形中 $AB = AC$，底边 $\\overline{BC}$ 延长过 $C$ 到 $D$，角 $ACD$ 为 $${out}^\\circ$。角 $BAC$ 是多少度？`,
      180 - 2 * base,
      [base, out, out - 90],
      `Angle $ACB$ is $180 - ${out} = ${base}^\\circ$, and angle $ABC$ equals it. So angle $BAC$ is $180 - 2(${base}) = ${180 - 2 * base}$.`,
      `角 $ACB$ 为 $180 - ${out} = ${base}^\\circ$，角 $ABC$ 与它相等。所以角 $BAC$ 为 $180 - 2(${base}) = ${180 - 2 * base}$。`,
    );
  },
  "Problem-Solving With Isosceles Triangles": (rng, hard) => {
    const a = rng.int(25, 60);
    if (!hard)
      return ask(
        rng,
        `Point $D$ is on side $\\overline{BC}$ of triangle $ABC$ and $AD = BD$. If angle $B$ measures $${a}^\\circ$, what is angle $ADC$, in degrees?`,
        `点 $D$ 在三角形 $ABC$ 的边 $\\overline{BC}$ 上，且 $AD = BD$。若角 $B$ 为 $${a}^\\circ$，角 $ADC$ 是多少度？`,
        2 * a,
        [a, 180 - 2 * a, 180 - a],
        `Triangle $ABD$ is isosceles, so angle $BAD$ is also $${a}^\\circ$. The exterior angle at $D$ is the sum, $${2 * a}^\\circ$.`,
        `三角形 $ABD$ 等腰，所以角 $BAD$ 也是 $${a}^\\circ$。$D$ 处的外角等于两者之和 $${2 * a}^\\circ$。`,
        cevianFigure(a, a),
      );
    const [s, d] = [rng.int(6, 30), rng.int(1, 5)];
    return ask(
      rng,
      `The perimeter of an isosceles triangle is $${2 * s + 2 * d}$ inches, and its base is $${2 * d}$ inches long. What is the length of each congruent side, in inches?`,
      `一个等腰三角形的周长为 $${2 * s + 2 * d}$ 英寸，底边长 $${2 * d}$ 英寸。每条腰长多少英寸？`,
      s,
      [2 * s, s + d, s + 2 * d],
      `The two congruent sides make up $${2 * s + 2 * d} - ${2 * d} = ${2 * s}$ inches, so each is $${s}$ inches.`,
      `两条腰共 $${2 * s + 2 * d} - ${2 * d} = ${2 * s}$ 英寸，所以每条腰 $${s}$ 英寸。`,
    );
  },
  "Identifying Corresponding Parts Under Congruence": (rng, hard) => {
    const names = rng.pick([
      ["P", "Q", "R", "X", "Y", "Z"],
      ["J", "K", "L", "S", "T", "U"],
      ["A", "B", "C", "M", "N", "O"],
      ["D", "E", "F", "G", "H", "I"],
    ]) as readonly string[];
    const [p, q, r, x, y, z] = names as [string, string, string, string, string, string];
    const a = rng.int(3, 40);
    if (!hard)
      return ask(
        rng,
        `Triangle $${p}${q}${r}$ is congruent to triangle $${x}${y}${z}$, in that order. If $${q}${r} = ${a}$, which side of the second triangle also has length $${a}$?`,
        `三角形 $${p}${q}${r}$ 与三角形 $${x}${y}${z}$ 全等，顶点按此顺序对应。若 $${q}${r} = ${a}$，第二个三角形的哪条边长也是 $${a}$？`,
        `\\overline{${y}${z}}`,
        [`\\overline{${x}${y}}`, `\\overline{${x}${z}}`, `\\overline{${q}${x}}`],
        `The order of the letters gives the matching: $${q}$ goes with $${y}$ and $${r}$ with $${z}$. So $\\overline{${q}${r}}$ matches $\\overline{${y}${z}}$.`,
        `字母顺序给出对应：$${q}$ 对 $${y}$，$${r}$ 对 $${z}$。所以 $\\overline{${q}${r}}$ 对应 $\\overline{${y}${z}}$。`,
      );
    const [b, c] = [rng.int(30, 80), rng.int(30, 60)];
    return ask(
      rng,
      `Triangle $${p}${q}${r}$ is congruent to triangle $${x}${y}${z}$, in that order. Angle $${p}$ measures $${b}^\\circ$ and angle $${r}$ measures $${c}^\\circ$. What is the measure of angle $${y}$, in degrees?`,
      `三角形 $${p}${q}${r}$ 与三角形 $${x}${y}${z}$ 全等，顶点按此顺序对应。角 $${p}$ 为 $${b}^\\circ$，角 $${r}$ 为 $${c}^\\circ$。角 $${y}$ 是多少度？`,
      180 - b - c,
      [b, c, 360 - b - c],
      `Angle $${y}$ matches angle $${q}$, which is the third angle of the first triangle: $180 - ${b} - ${c} = ${180 - b - c}$.`,
      `角 $${y}$ 对应角 $${q}$，它是第一个三角形的第三个角：$180 - ${b} - ${c} = ${180 - b - c}$。`,
    );
  },
  "Using Corresponding Parts Under Similarity": (rng, hard) => {
    const [a, b] = [rng.int(30, 80), rng.int(30, 70)];
    if (!hard)
      return ask(
        rng,
        `Triangles $KLM$ and $RST$ are similar, in that order. Angle $K$ measures $${a}^\\circ$ and angle $S$ measures $${b}^\\circ$. What is angle $M$, in degrees?`,
        `三角形 $KLM$ 与 $RST$ 相似，顶点按此顺序对应。角 $K$ 为 $${a}^\\circ$，角 $S$ 为 $${b}^\\circ$。角 $M$ 是多少度？`,
        180 - a - b,
        [a, b, a + b],
        `Similar triangles have equal corresponding angles, so angle $L$ equals angle $S$, $${b}^\\circ$. Then angle $M$ is $180 - ${a} - ${b} = ${180 - a - b}$.`,
        `相似三角形对应角相等，所以角 $L$ 等于角 $S$，为 $${b}^\\circ$。于是角 $M$ 为 $180 - ${a} - ${b} = ${180 - a - b}$。`,
      );
    const [p, k, q] = [rng.int(2, 12), rng.int(2, 5), rng.int(2, 12)];
    return ask(
      rng,
      `Triangles $KLM$ and $RST$ are similar, in that order, with $KL = ${p}$, $RS = ${k * p}$ and $ST = ${k * q}$. What is $LM$?`,
      `三角形 $KLM$ 与 $RST$ 相似，顶点按此顺序对应，$KL = ${p}$，$RS = ${k * p}$，$ST = ${k * q}$。$LM$ 是多少？`,
      q,
      [k * q * k, p * q, q + k * p - p],
      `Side $RS$ is $${k}$ times side $KL$, so every side of $RST$ is $${k}$ times its match. Thus $LM = ${k * q} \\div ${k} = ${q}$.`,
      `$RS$ 是 $KL$ 的 $${k}$ 倍，所以 $RST$ 的每条边都是其对应边的 $${k}$ 倍。于是 $LM = ${k * q} \\div ${k} = ${q}$。`,
    );
  },
  "Finding Corresponding Lengths in Similar Figures": (rng, hard) => {
    const [a, b, k] = [rng.int(3, 15), rng.int(16, 30), rng.int(2, 5)];
    if (!hard)
      return ask(
        rng,
        `A photo $${a}$ inches wide and $${b}$ inches long is enlarged so the width becomes $${k * a}$ inches. If the shape stays the same, how long is the enlargement, in inches?`,
        `一张宽 $${a}$ 英寸、长 $${b}$ 英寸的照片被放大，宽变为 $${k * a}$ 英寸。形状不变时，放大后长多少英寸？`,
        k * b,
        [b + (k - 1) * a, b, k * a + k],
        `The width is multiplied by $${k}$, and a similar shape multiplies every length by the same factor, not adds the same amount: $${k}(${b}) = ${k * b}$.`,
        `宽乘以 $${k}$。相似图形的每个长度都乘以同一倍数，而不是加同一个数：$${k}(${b}) = ${k * b}$。`,
      );
    const [h, s] = [rng.int(3, 9), rng.int(2, 6)];
    return ask(
      rng,
      `A post $${h}$ feet tall casts a shadow $${s}$ feet long at the same moment a tree casts a shadow $${s * k * 2}$ feet long. How tall is the tree, in feet?`,
      `同一时刻，一根 $${h}$ 英尺的柱子投下 $${s}$ 英尺的影子，一棵树投下 $${s * k * 2}$ 英尺的影子。树高多少英尺？`,
      h * k * 2,
      [h + s * k * 2 - s, s * k * 2, h * k],
      `The sun's rays form similar triangles, so the heights have the same ratio as the shadows: the shadow is $${k * 2}$ times as long, and $${h}(${k * 2}) = ${h * k * 2}$.`,
      `太阳光形成相似三角形，高度比等于影长比：影子是 $${k * 2}$ 倍，$${h}(${k * 2}) = ${h * k * 2}$。`,
    );
  },
  "Using Scale Factors in Similar Figures": (rng, hard) => {
    const [a, b, c, k] = [rng.int(3, 12), rng.int(4, 13), rng.int(5, 14), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A triangle has sides $${a}$, $${b}$ and $${c}$. What is the perimeter of a similar triangle with scale factor $${k}$?`,
        `一个三角形三边长 $${a}$、$${b}$、$${c}$。比例因子为 $${k}$ 的相似三角形周长是多少？`,
        k * (a + b + c),
        [a + b + c + k, a + b + c + 3 * k, k * k * (a + b + c)],
        `Each side is multiplied by $${k}$, so the perimeter is too: $${k}(${a + b + c}) = ${k * (a + b + c)}$.`,
        `每条边都乘以 $${k}$，周长也是：$${k}(${a + b + c}) = ${k * (a + b + c)}$。`,
      );
    const inches = rng.int(2, 12);
    return ask(
      rng,
      `On a map, $1$ inch represents $${k * 5}$ miles. Two towns are $${k * 5 * inches}$ miles apart. How many inches apart are they on the map?`,
      `地图上 $1$ 英寸代表 $${k * 5}$ 英里。两镇相距 $${k * 5 * inches}$ 英里。它们在地图上相距多少英寸？`,
      inches,
      [k * 5 * k * 5 * inches, inches + k * 5, k * inches],
      `Divide the real distance by the miles per inch: $${k * 5 * inches} \\div ${k * 5} = ${inches}$.`,
      `用实际距离除以每英寸代表的英里数：$${k * 5 * inches} \\div ${k * 5} = ${inches}$。`,
    );
  },
  "Finding Areas of Similar Figures": (rng, hard) => {
    const [a, k] = [rng.int(2, 25), rng.int(2, 6)];
    if (!hard)
      return ask(
        rng,
        `A rug has area $${a}$ square feet. A similar rug has sides $${k}$ times as long. What is the area of the larger rug, in square feet?`,
        `一块地毯面积为 $${a}$ 平方英尺。一块相似的地毯边长是它的 $${k}$ 倍。大地毯的面积是多少平方英尺？`,
        k * k * a,
        [k * a, 2 * k * a, k ** 3 * a],
        `Area uses two lengths, so it scales by the square of the factor: $${k}^2(${a}) = ${k * k * a}$.`,
        `面积涉及两个长度，所以按比例因子的平方缩放：$${k}^2(${a}) = ${k * k * a}$。`,
      );
    const side = rng.int(2, 15);
    return ask(
      rng,
      `Two similar pentagons have areas $${a}$ and $${k * k * a}$. A side of the smaller pentagon has length $${side}$. What is the length of the matching side of the larger pentagon?`,
      `两个相似五边形面积为 $${a}$ 和 $${k * k * a}$。较小者的一条边长 $${side}$。较大者的对应边长多少？`,
      k * side,
      [k * k * side, side + k, side + k * k],
      `The areas have ratio $${k * k}$, so the lengths have ratio $\\sqrt{${k * k}} = ${k}$. The matching side is $${k}(${side}) = ${k * side}$.`,
      `面积比为 $${k * k}$，所以长度比为 $\\sqrt{${k * k}} = ${k}$。对应边长为 $${k}(${side}) = ${k * side}$。`,
      twoTrianglesFigure(anglePts(50, 70), { s: [null, `${side}`, null] }, { s: [null, "?", null] }, 1.6),
    );
  },
  "Applying the Pythagorean Theorem": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(1, 6);
    if (!hard)
      return ask(
        rng,
        `In the right triangle shown, what is the length of the side marked "?"?`,
        `图中直角三角形里，标有 "?" 的边长是多少？`,
        q * k,
        [p * k + c * k, (c - p) * k, c * k + 1],
        `The side is a leg, so subtract squares: $${c * k}^2 - ${p * k}^2 = ${(q * k) ** 2}$, and its square root is $${q * k}$.`,
        `这条边是直角边，所以平方相减：$${c * k}^2 - ${p * k}^2 = ${(q * k) ** 2}$，其平方根为 $${q * k}$。`,
        polyFigure(rightPts(q, p), { s: [`${p * k}`, "?", `${c * k}`], right: 1 }),
      );
    const [m, n] = [rng.int(1, 5), rng.int(2, 7)];
    return ask(
      rng,
      `What is the distance between the points $(${m}, ${n})$ and $(${m + p * k}, ${n + q * k})$ in the standard $(x, y)$ coordinate plane?`,
      `在标准 $(x, y)$ 坐标平面中，点 $(${m}, ${n})$ 与 $(${m + p * k}, ${n + q * k})$ 的距离是多少？`,
      c * k,
      [p * k + q * k, q * k, (p + q) * k + m],
      `The horizontal and vertical changes, $${p * k}$ and $${q * k}$, are the legs of a right triangle. The distance is its hypotenuse: $\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = ${c * k}$.`,
      `水平和竖直变化 $${p * k}$、$${q * k}$ 是直角三角形的两条直角边。距离就是斜边：$\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = ${c * k}$。`,
    );
  },
  "Modeling Situations Using the Pythagorean Theorem": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(1, 5);
    if (!hard)
      return ask(
        rng,
        `A park path runs $${p * k}$ yards east and then $${q * k}$ yards north. A shortcut goes straight from start to finish. How many yards long is the shortcut?`,
        `公园小路先向东 $${p * k}$ 码，再向北 $${q * k}$ 码。一条捷径从起点直达终点。捷径长多少码？`,
        c * k,
        [(p + q) * k, q * k, (q - p) * k + c],
        `East and north meet at a right angle, so the shortcut is the hypotenuse: $\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = ${c * k}$.`,
        `向东和向北成直角，捷径是斜边：$\\sqrt{${(p * k) ** 2} + ${(q * k) ** 2}} = ${c * k}$。`,
      );
    return ask(
      rng,
      `A support wire $${c * k}$ feet long runs from the top of a vertical pole to a stake $${p * k}$ feet from the pole's base on level ground. How many feet shorter is the pole than the wire?`,
      `一根 $${c * k}$ 英尺长的拉线从竖直杆顶连到水平地面上距杆底 $${p * k}$ 英尺的桩。杆高比拉线短多少英尺？`,
      (c - q) * k,
      [q * k, (c - p) * k, c * k + q * k],
      `The pole's height is the other leg: $\\sqrt{${(c * k) ** 2} - ${(p * k) ** 2}} = ${q * k}$. The difference is $${c * k} - ${q * k} = ${(c - q) * k}$.`,
      `杆高是另一条直角边：$\\sqrt{${(c * k) ** 2} - ${(p * k) ** 2}} = ${q * k}$。差为 $${c * k} - ${q * k} = ${(c - q) * k}$。`,
    );
  },
  "Problem-Solving With Special Triangles": (rng, hard) => {
    const a = rng.int(2, 30);
    if (!hard)
      return ask(
        rng,
        `What is the length of the diagonal of a square with side length $${a}$?`,
        `边长为 $${a}$ 的正方形，对角线长多少？`,
        `${a}\\sqrt{2}`,
        [`${2 * a}`, `${a}\\sqrt{3}`, `${2 * a}\\sqrt{2}`],
        `The diagonal cuts the square into two $45$-$45$-$90$ triangles, whose hypotenuse is a leg times $\\sqrt{2}$.`,
        `对角线把正方形分成两个 $45$-$45$-$90$ 三角形，其斜边等于直角边乘以 $\\sqrt{2}$。`,
      );
    return ask(
      rng,
      `A ramp makes a $30^\\circ$ angle with the level ground and is $${2 * a}$ feet long. How high does it rise, in feet?`,
      `一个斜坡与水平地面成 $30^\\circ$ 角，长 $${2 * a}$ 英尺。它升高多少英尺？`,
      a,
      [`${a}\\sqrt{3}`, `${2 * a}\\sqrt{3}`, `${a}\\sqrt{2}`],
      `The ramp is the hypotenuse of a $30$-$60$-$90$ triangle, and the side opposite $30^\\circ$ is half the hypotenuse: $${a}$.`,
      `斜坡是 $30$-$60$-$90$ 三角形的斜边，$30^\\circ$ 所对的边是斜边的一半：$${a}$。`,
      polyFigure(rightPts(Math.sqrt(3), 1), { a: [null, null, "30°"], s: ["?", null, `${2 * a}`], right: 1 }),
    );
  },
  "Finding Trigonometric Ratios": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(2, 5);
    const [opp, adj] = rng.int(0, 1) === 1 ? [p, q] : [q, p];
    if (!hard)
      return ask(
        rng,
        `In the right triangle shown, what is $\\cos A$?`,
        `图中直角三角形里，$\\cos A$ 是多少？`,
        ratio(adj, c),
        [ratio(opp, c), ratio(opp, adj), ratio(c, adj)],
        `Cosine is the adjacent side over the hypotenuse: $\\frac{${adj * k}}{${c * k}} = ${ratio(adj, c)}$.`,
        `余弦是邻边比斜边：$\\frac{${adj * k}}{${c * k}} = ${ratio(adj, c)}$。`,
        polyFigure(rightPts(adj, opp), { v: ["B", "C", "A"], s: [`${opp * k}`, `${adj * k}`, `${c * k}`], right: 1 }),
      );
    return ask(
      rng,
      `In right triangle $RST$, angle $S$ is the right angle, $RS = ${adj * k}$ and $ST = ${opp * k}$. What is $\\tan T$?`,
      `在直角三角形 $RST$ 中，角 $S$ 是直角，$RS = ${adj * k}$，$ST = ${opp * k}$。$\\tan T$ 是多少？`,
      ratio(adj, opp),
      [ratio(opp, adj), ratio(adj, c), ratio(opp, c)],
      `From angle $T$, the opposite side is $RS$ and the adjacent side is $ST$. So $\\tan T = \\frac{${adj * k}}{${opp * k}} = ${ratio(adj, opp)}$.`,
      `从角 $T$ 看，对边是 $RS$，邻边是 $ST$。所以 $\\tan T = \\frac{${adj * k}}{${opp * k}} = ${ratio(adj, opp)}$。`,
    );
  },
  "Finding a Trigonometric Ratio From Other Ratios": (rng, hard) => {
    const [p, q, c] = rng.pick(moreTriples);
    const [opp, adj] = rng.int(0, 1) === 1 ? [p, q] : [q, p];
    if (!hard) {
      const fromCos = rng.int(0, 1) === 1;
      const given = fromCos ? `\\cos \\theta = ${ratio(adj, c)}` : `\\sin \\theta = ${ratio(opp, c)}`;
      return ask(
        rng,
        `If $${given}$ and $\\theta$ is an acute angle, what is $\\tan \\theta$?`,
        `若 $${given}$，$\\theta$ 为锐角，$\\tan \\theta$ 是多少？`,
        ratio(opp, adj),
        [ratio(adj, opp), ratio(adj, c), ratio(c, opp)],
        `Draw a right triangle with hypotenuse $${c}$ and legs $${opp}$ and $${adj}$, which satisfy $${opp}^2 + ${adj}^2 = ${c}^2$. Then $\\tan \\theta$ is opposite over adjacent: $${ratio(opp, adj)}$.`,
        `画直角三角形，斜边 $${c}$，直角边 $${opp}$ 和 $${adj}$，满足 $${opp}^2 + ${adj}^2 = ${c}^2$。$\\tan \\theta$ 是对边比邻边：$${ratio(opp, adj)}$。`,
      );
    }
    return ask(
      rng,
      `If $\\tan \\theta = ${ratio(opp, adj)}$ and $180^\\circ < \\theta < 270^\\circ$, what is $\\cos \\theta$?`,
      `若 $\\tan \\theta = ${ratio(opp, adj)}$，且 $180^\\circ < \\theta < 270^\\circ$，$\\cos \\theta$ 是多少？`,
      `-${ratio(adj, c)}`,
      [ratio(adj, c), `-${ratio(opp, c)}`, ratio(opp, c)],
      `The reference triangle has sides $${opp}$, $${adj}$ and hypotenuse $${c}$. In the third quadrant cosine is negative, so $\\cos \\theta = -${ratio(adj, c)}$.`,
      `参考三角形三边为 $${opp}$、$${adj}$，斜边 $${c}$。第三象限余弦为负，所以 $\\cos \\theta = -${ratio(adj, c)}$。`,
    );
  },
  "Using Cofunction Relationships": (rng, hard) => {
    const a = rng.int(10, 40) + 40 * rng.int(0, 1);
    const [p, q, c] = rng.pick(moreTriples);
    const [opp, adj] = rng.int(0, 1) === 1 ? [p, q] : [q, p];
    if (!hard)
      return ask(
        rng,
        `If $\\sin ${a}^\\circ = k$, which of the following also equals $k$?`,
        `若 $\\sin ${a}^\\circ = k$，下列哪一项也等于 $k$？`,
        `\\cos ${90 - a}^\\circ`,
        [`\\cos ${a}^\\circ`, `\\sin ${90 - a}^\\circ`, `\\tan ${a}^\\circ`],
        `The two acute angles of a right triangle add to $90^\\circ$, and the sine of one is the cosine of the other. So $\\sin ${a}^\\circ = \\cos ${90 - a}^\\circ$.`,
        `直角三角形两锐角之和为 $90^\\circ$，一个角的正弦是另一个角的余弦。所以 $\\sin ${a}^\\circ = \\cos ${90 - a}^\\circ$。`,
      );
    const fromSin = rng.int(0, 1) === 1;
    const [en, zh] = fromSin ? [`\\sin A`, `\\cos B`] : [`\\cos A`, `\\sin B`];
    return ask(
      rng,
      `In a right triangle with acute angles $A$ and $B$, $${en} = ${ratio(opp, c)}$. What is $${zh}$?`,
      `一个直角三角形的锐角为 $A$ 和 $B$，$${en} = ${ratio(opp, c)}$。$${zh}$ 是多少？`,
      ratio(opp, c),
      [ratio(adj, c), ratio(opp, adj), ratio(c, opp)],
      `Angles $A$ and $B$ add to $90^\\circ$, so the side opposite one is the side next to the other. Thus $${zh} = ${en} = ${ratio(opp, c)}$.`,
      `$A$、$B$ 之和为 $90^\\circ$，一个角的对边是另一个角的邻边。所以 $${zh} = ${en} = ${ratio(opp, c)}$。`,
    );
  },
  "Finding a Side From a Trigonometric Ratio": (rng, hard) => {
    const [p, q, c] = rng.pick(triples);
    const k = rng.int(2, 8);
    if (!hard)
      return ask(
        rng,
        `In the right triangle shown, $\\sin A = ${ratio(p, c)}$. What is the length of the side marked "?"?`,
        `图中直角三角形里 $\\sin A = ${ratio(p, c)}$。标有 "?" 的边长是多少？`,
        p * k,
        [q * k, c * k + p, c * c * k],
        `Sine is the opposite side over the hypotenuse, so the side is $${ratio(p, c)}$ of $${c * k}$: $${p * k}$.`,
        `正弦是对边比斜边，所以这条边是 $${c * k}$ 的 $${ratio(p, c)}$：$${p * k}$。`,
        polyFigure(rightPts(q, p), { a: [null, null, "A"], s: ["?", null, `${c * k}`], right: 1 }),
      );
    return ask(
      rng,
      `A surveyor stands $${q * k}$ meters from the base of a tower on level ground. The angle of elevation to the top, $\\theta$, has $\\tan \\theta = ${ratio(p, q)}$. How tall is the tower, in meters?`,
      `一名测量员站在水平地面上，距塔底 $${q * k}$ 米。到塔顶的仰角 $\\theta$ 满足 $\\tan \\theta = ${ratio(p, q)}$。塔高多少米？`,
      p * k,
      [c * k, q * k, (p + q) * k],
      `Tangent is opposite over adjacent, so the height is $${q * k} \\cdot ${ratio(p, q)} = ${p * k}$.`,
      `正切是对边比邻边，所以塔高为 $${q * k} \\cdot ${ratio(p, q)} = ${p * k}$。`,
    );
  },
  "Finding Perimeters of Figures": (rng, hard) => {
    const [l, w] = [rng.int(8, 30), rng.int(2, 7)];
    if (!hard)
      return ask(
        rng,
        `A fence surrounds a rectangular pen, shown in the figure in feet. How many feet of fence are there?`,
        `一道栅栏围住一个长方形围栏，图中单位为英尺。栅栏长多少英尺？`,
        2 * (l + w),
        [l + w, l * w, 2 * l + w],
        `Add all four sides: $2(${l}) + 2(${w}) = ${2 * (l + w)}$.`,
        `四边相加：$2(${l}) + 2(${w}) = ${2 * (l + w)}$。`,
        rectFigure(l, w, `${l}`, `${w}`),
      );
    const side = rng.int(3, 30);
    const [sides, name, nameZh] = rng.pick([
      [5, "pentagon", "五边形"],
      [6, "hexagon", "六边形"],
      [8, "octagon", "八边形"],
    ] as const);
    return ask(
      rng,
      `A square with perimeter $${4 * side}$ has the same side length as a regular ${name}. What is the perimeter of the ${name}?`,
      `一个周长为 $${4 * side}$ 的正方形与一个正${nameZh}边长相等。正${nameZh}的周长是多少？`,
      sides * side,
      [4 * side, side, sides * 4 * side],
      `The side length is $${4 * side} \\div 4 = ${side}$, and the ${name} has $${sides}$ such sides: $${sides * side}$.`,
      `边长为 $${4 * side} \\div 4 = ${side}$，正${nameZh}有 $${sides}$ 条这样的边：$${sides * side}$。`,
    );
  },
  "Finding Areas Involving Circles": (rng, hard) => {
    const r = rng.int(3, 30);
    if (!hard)
      return ask(
        rng,
        `What is the area of the circle shown?`,
        `图中圆的面积是多少？`,
        pi(r * r),
        [pi(2 * r), pi(4 * r * r), pi(2 * r * r)],
        `Area is $\\pi r^2$, so square the radius: $\\pi(${r})^2 = ${pi(r * r)}$. The value $2\\pi r$ is the circumference instead.`,
        `面积为 $\\pi r^2$，把半径平方：$\\pi(${r})^2 = ${pi(r * r)}$。而 $2\\pi r$ 是周长。`,
        radiusFigure(`${r}`),
      );
    return ask(
      rng,
      `A circle has circumference $${pi(2 * r)}$. What is its area?`,
      `一个圆的周长为 $${pi(2 * r)}$。它的面积是多少？`,
      pi(r * r),
      [pi(4 * r * r), pi(2 * r), pi(r)],
      `Circumference $2\\pi r = ${pi(2 * r)}$ gives $r = ${r}$, so the area is $\\pi(${r})^2 = ${pi(r * r)}$.`,
      `由周长 $2\\pi r = ${pi(2 * r)}$ 得 $r = ${r}$，所以面积为 $\\pi(${r})^2 = ${pi(r * r)}$。`,
    );
  },
  "Finding Arc Length": (rng, hard) => {
    const [r, a] = [rng.int(1, 8) * 6, rng.pick([30, 45, 60, 90, 120, 150])];
    const len = (2 * r * a) / 360;
    const length = Q.of(2 * r * a, 360);
    const arc = length.isInteger() ? pi(len) : `${length.toLatex()}\\pi`;
    if (!hard)
      return ask(
        rng,
        `In the circle shown, what is the length of the arc of the shaded sector?`,
        `图中圆里，阴影扇形的弧长是多少？`,
        arc,
        [pi(2 * r), pi(r), pi(r * r)],
        `The arc is $\\frac{${a}}{360}$ of the circumference $2\\pi(${r})$, which is $${arc}$.`,
        `弧是周长 $2\\pi(${r})$ 的 $\\frac{${a}}{360}$，即 $${arc}$。`,
        sectorFigure(a, `${a}°`, `${r}`),
      );
    const k = rng.int(2, 5);
    return ask(
      rng,
      `A wheel of radius $${r}$ inches turns through $${k}$ full turns and then a further $${a}^\\circ$. How many inches does a point on its rim travel?`,
      `一个半径 $${r}$ 英寸的轮子转了 $${k}$ 整圈，又转了 $${a}^\\circ$。轮缘上一点走了多少英寸？`,
      `${Q.of(k * 2 * r)
        .add(length)
        .toLatex()}\\pi`,
      [
        pi(k * 2 * r),
        arc,
        `${Q.of(k * r)
          .add(length)
          .toLatex()}\\pi`,
      ],
      `Each full turn is $${pi(2 * r)}$ inches, so $${k}$ turns are $${pi(k * 2 * r)}$. The extra turn adds $${arc}$, which gives $${Q.of(
        k * 2 * r,
      )
        .add(length)
        .toLatex()}\\pi$.`,
      `每整圈 $${pi(2 * r)}$ 英寸，$${k}$ 圈为 $${pi(k * 2 * r)}$。多转的部分加 $${arc}$，共 $${Q.of(k * 2 * r)
        .add(length)
        .toLatex()}\\pi$。`,
    );
  },
  "Writing the Equation of a Circle": (rng, hard) => {
    const [h, k, r] = [rng.int(-7, 7), rng.int(-7, 7), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `Which equation describes the circle with center $(${h}, ${k})$ and radius $${r}$ in the standard $(x, y)$ coordinate plane?`,
        `在标准 $(x, y)$ 坐标平面中，哪个等式表示圆心为 $(${h}, ${k})$、半径为 $${r}$ 的圆？`,
        sum(h, k, r * r),
        [sum(h, k, r), sum(-h - 1, k, r * r), sum(h, -k - 1, r * r)],
        `The form is $(x - h)^2 + (y - k)^2 = r^2$. Subtracting the center's coordinates and squaring the radius gives the equation.`,
        `标准形式是 $(x - h)^2 + (y - k)^2 = r^2$。减去圆心坐标，并把半径平方，就得到等式。`,
      );
    const scale = rng.int(1, 3);
    const [a, b, s] = [3 * scale, 4 * scale, 5 * scale];
    return ask(
      rng,
      `A circle has center $(${h}, ${k})$ and passes through the point $(${h + a}, ${k + b})$. Which equation describes the circle?`,
      `一个圆的圆心为 $(${h}, ${k})$，且过点 $(${h + a}, ${k + b})$。哪个等式表示这个圆？`,
      sum(h, k, s * s),
      [sum(h, k, s), sum(h, k, a + b), sum(-h - 1, k, s * s)],
      `The radius is the distance to the point: $\\sqrt{${a}^2 + ${b}^2} = ${s}$. The right side of the equation is its square, $${s * s}$.`,
      `半径是到该点的距离：$\\sqrt{${a}^2 + ${b}^2} = ${s}$。等式右边是它的平方 $${s * s}$。`,
    );
  },
  "Problem-Solving With Circles": (rng, hard) => {
    const [h, k, r] = [rng.int(-9, 9), rng.int(-9, 9), rng.int(3, 12)];
    if (!hard)
      return ask(
        rng,
        `What is the area of the circle with equation $${sum(h, k, r * r)}$?`,
        `等式为 $${sum(h, k, r * r)}$ 的圆，面积是多少？`,
        pi(r * r),
        [pi(2 * r), pi(r), pi(r ** 4)],
        `The right side is already $r^2$, so the area $\\pi r^2$ is $${pi(r * r)}$.`,
        `等式右边已经是 $r^2$，所以面积 $\\pi r^2$ 为 $${pi(r * r)}$。`,
      );
    return ask(
      rng,
      `The circle $${sum(h, k, r * r)}$ is tangent to a vertical line to its right. What is the $x$-coordinate of every point on that line?`,
      `圆 $${sum(h, k, r * r)}$ 与其右侧的一条竖直线相切。这条线上每个点的 $x$ 坐标是多少？`,
      h + r,
      [h - r, h + r * r, k + r],
      `The rightmost point of the circle is one radius to the right of the center, at $x = ${h} + ${r} = ${h + r}$, and the line touches the circle there.`,
      `圆的最右点在圆心右侧一个半径处，$x = ${h} + ${r} = ${h + r}$，直线在此与圆相切。`,
    );
  },
  "Further Problem-Solving With Circles": (rng, hard) => {
    const [h, k, r] = [rng.int(1, 9), rng.int(1, 9), rng.int(2, 9)];
    const c = h * h + k * k - r * r;
    const eq = `x^2 + y^2 - ${2 * h}x - ${2 * k}y ${sg(c)} = 0`;
    if (!hard)
      return ask(
        rng,
        `What is the center of the circle $${eq}$?`,
        `圆 $${eq}$ 的圆心是什么？`,
        `(${h}, ${k})`,
        [`(${-h}, ${-k})`, `(${2 * h}, ${2 * k})`, `(${-h}, ${k})`],
        `Complete the square in each variable: half of $-${2 * h}$ is $-${h}$ and half of $-${2 * k}$ is $-${k}$, so the equation has $(x - ${h})^2$ and $(y - ${k})^2$.`,
        `对每个变量配方：$-${2 * h}$ 的一半是 $-${h}$，$-${2 * k}$ 的一半是 $-${k}$，所以等式含 $(x - ${h})^2$ 和 $(y - ${k})^2$。`,
      );
    return ask(
      rng,
      `What is the radius of the circle $${eq}$?`,
      `圆 $${eq}$ 的半径是多少？`,
      r,
      [r * r, 2 * r, r + h],
      `Completing the square adds $${h * h}$ and $${k * k}$, so $(x - ${h})^2 + (y - ${k})^2 = ${h * h + k * k - c} = ${r * r}$. The radius is $${r}$.`,
      `配方加上 $${h * h}$ 和 $${k * k}$，所以 $(x - ${h})^2 + (y - ${k})^2 = ${h * h + k * k - c} = ${r * r}$。半径为 $${r}$。`,
    );
  },
  "Using Slopes of Parallel Lines": (rng, hard) => {
    const [a, b, c, x, y] = [rng.int(1, 6), rng.pick([2, 3, 5, 7]), rng.int(1, 20), rng.int(-5, 5), rng.int(-5, 5)];
    if (!hard)
      return ask(
        rng,
        `What is the slope of any line parallel to $${cx(a)} + ${b}y = ${c}$?`,
        `任何平行于 $${cx(a)} + ${b}y = ${c}$ 的直线，斜率是多少？`,
        Q.of(-a, b),
        [Q.of(a, b), Q.of(b, a), Q.of(c, b)],
        `Solve for $y$: $y = -\\frac{${a}}{${b}}x + \\frac{${c}}{${b}}$. Parallel lines have the same slope, so the slope is $-\\frac{${a}}{${b}}$.`,
        `解出 $y$：$y = -\\frac{${a}}{${b}}x + \\frac{${c}}{${b}}$。平行线斜率相同，所以斜率为 $-\\frac{${a}}{${b}}$。`,
      );
    const m = a + 1;
    return ask(
      rng,
      `A line passes through $(${x}, ${y})$ and is parallel to $y = ${lin(m, c)}$. What is its $y$-intercept?`,
      `一条直线过 $(${x}, ${y})$ 且平行于 $y = ${lin(m, c)}$。它的 $y$ 轴截距是多少？`,
      y - m * x,
      [c, y + m * x, y - x],
      `It has slope $${m}$, so $${y} = ${m}(${x}) + b$ and $b = ${y - m * x}$.`,
      `它的斜率为 $${m}$，所以 $${y} = ${m}(${x}) + b$，$b = ${y - m * x}$。`,
    );
  },
  "Using Slopes of Perpendicular Lines": (rng, hard) => {
    const [p, q, c] = [rng.int(1, 9), rng.pick([2, 3, 5, 7, 11]), rng.int(-9, 9)];
    const a = p === q ? p + 1 : p;
    if (!hard)
      return ask(
        rng,
        `A line has slope $${Q.of(a, q).toLatex()}$. What is the slope of a line perpendicular to it?`,
        `一条直线的斜率为 $${Q.of(a, q).toLatex()}$。与它垂直的直线斜率是多少？`,
        Q.of(-q, a),
        [Q.of(q, a), Q.of(-a, q), Q.of(a, q).add(Q.one)],
        `Perpendicular slopes are negative reciprocals: flip $${Q.of(a, q).toLatex()}$ and change its sign.`,
        `互相垂直的直线斜率互为负倒数：把 $${Q.of(a, q).toLatex()}$ 取倒数并变号。`,
      );
    const x = q * rng.int(1, 3);
    const y = (-a * x) / q + c;
    return ask(
      rng,
      `Line $\\ell$ has equation $y = ${Q.of(q, a).toLatex()}x + 1$. A second line is perpendicular to $\\ell$ and has $y$-intercept $${c}$. What is the $y$-coordinate of the point on the second line with $x = ${x}$?`,
      `直线 $\\ell$ 的等式为 $y = ${Q.of(q, a).toLatex()}x + 1$。第二条直线与 $\\ell$ 垂直，$y$ 轴截距为 $${c}$。第二条直线上 $x = ${x}$ 的点，$y$ 坐标是多少？`,
      y,
      [(a * x) / q + c, c, c - x],
      `The second line has slope $-\\frac{${a}}{${q}}$, the negative reciprocal. So $y = -\\frac{${a}}{${q}}(${x}) ${sg(c)} = ${y}$.`,
      `第二条直线斜率为负倒数 $-\\frac{${a}}{${q}}$。所以 $y = -\\frac{${a}}{${q}}(${x}) ${sg(c)} = ${y}$。`,
    );
  },
  "Writing the Equation of a Line": (rng, hard) => {
    const [m, x] = [rng.pick([-4, -3, -2, 2, 3, 4, 5]), rng.int(1, 6)];
    const b = rng.int(-9, 9);
    const y = m * x + b;
    if (!hard)
      return ask(
        rng,
        `Which equation describes the line with slope $${m}$ through the point $(${x}, ${y})$?`,
        `哪个等式表示斜率为 $${m}$、过点 $(${x}, ${y})$ 的直线？`,
        `y = ${lin(m, b)}`,
        [`y = ${lin(m, y)}`, `y = ${lin(-m, b)}`, `y = ${lin(m, b + 2 * m * x)}`],
        `Substitute the point into $y = ${m}x + b$: $${y} = ${m * x} + b$, so $b = ${b}$.`,
        `把点代入 $y = ${m}x + b$：$${y} = ${m * x} + b$，所以 $b = ${b}$。`,
      );
    const d = rng.int(1, 5);
    return ask(
      rng,
      `Which equation describes the line through $(${x}, ${y})$ and $(${x + d}, ${y + m * d})$?`,
      `哪个等式表示过 $(${x}, ${y})$ 和 $(${x + d}, ${y + m * d})$ 的直线？`,
      `y = ${lin(m, b)}`,
      [`y = ${lin(-m, b)}`, `y = ${lin(m, y)}`, `y = ${lin(m, b + 1)}`],
      `The slope is $\\frac{${m * d}}{${d}} = ${m}$. Then $${y} = ${m}(${x}) + b$ gives $b = ${b}$.`,
      `斜率为 $\\frac{${m * d}}{${d}} = ${m}$。于是 $${y} = ${m}(${x}) + b$ 得 $b = ${b}$。`,
      pointsFigure([
        [x, y],
        [x + d, y + m * d],
      ]),
    );
  },
  "Interpreting Slope and Its Changes": (rng, hard) => {
    const [m, b, k] = [rng.int(5, 40), rng.int(20, 300), rng.int(2, 9)];
    if (!hard)
      return words(
        rng,
        t(
          `A shop's daily revenue, in dollars, is modeled by $R = ${m}n + ${b}$, where $n$ is the number of customers. What does $${m}$ represent?`,
          `一家店每日收入（美元）的模型为 $R = ${m}n + ${b}$，$n$ 是顾客人数。$${m}$ 表示什么？`,
        ),
        t(`The added revenue per customer`, `每多一位顾客增加的收入`),
        [
          t(`The revenue with no customers`, `没有顾客时的收入`),
          t(`The number of customers per day`, `每天的顾客人数`),
          t(`The total revenue for a day`, `一天的总收入`),
        ],
        t(
          `The slope multiplies $n$, so each extra customer adds $\\$${m}$. The constant $${b}$ is the revenue when $n = 0$.`,
          `斜率乘以 $n$，所以每多一位顾客增加 $\\$${m}$。常数 $${b}$ 是 $n = 0$ 时的收入。`,
        ),
      );
    return ask(
      rng,
      `A taxi's fare, in dollars, for $d$ miles is $F = ${k} + ${m}d$. By how many dollars does the fare rise when a trip is $${k + 1}$ miles longer?`,
      `出租车行驶 $d$ 英里的车费（美元）为 $F = ${k} + ${m}d$。行程多 $${k + 1}$ 英里时，车费增加多少美元？`,
      m * (k + 1),
      [m * (k + 1) + k, m, k * (k + 1)],
      `Only the slope matters for a change: $${m}$ dollars per mile for $${k + 1}$ more miles is $${m * (k + 1)}$. The fixed $${k}$ dollars do not change.`,
      `变化量只取决于斜率：每英里 $${m}$ 美元，多 $${k + 1}$ 英里即 $${m * (k + 1)}$。固定的 $${k}$ 美元不变。`,
    );
  },
  "Finding Area in the Coordinate Plane": (rng, hard) => {
    const [x, y, w, h] = [rng.int(-6, 4), rng.int(-6, 4), rng.int(2, 9), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A rectangle has opposite vertices at $(${x}, ${y})$ and $(${x + w}, ${y + h})$. What is its area?`,
        `一个长方形的两个相对顶点为 $(${x}, ${y})$ 和 $(${x + w}, ${y + h})$。它的面积是多少？`,
        w * h,
        [2 * (w + h), w + h, 2 * w * h],
        `Its sides are the changes in the coordinates, $${w}$ and $${h}$, so its area is $${w * h}$.`,
        `它的边长是坐标的变化量 $${w}$ 和 $${h}$，所以面积为 $${w * h}$。`,
      );
    const b = 2 * w;
    return ask(
      rng,
      `What is the area of the triangle with vertices $(${x}, ${y})$, $(${x + b}, ${y})$ and $(${x + 1}, ${y + h})$?`,
      `顶点为 $(${x}, ${y})$、$(${x + b}, ${y})$、$(${x + 1}, ${y + h})$ 的三角形，面积是多少？`,
      w * h,
      [b * h, b + h, 2 * b * h],
      `The first two points give a horizontal base of $${b}$, and the third is $${h}$ above it. So the area is $\\frac{1}{2}(${b})(${h}) = ${w * h}$.`,
      `前两点给出水平的底边 $${b}$，第三点比它高 $${h}$。所以面积为 $\\frac{1}{2}(${b})(${h}) = ${w * h}$。`,
      pointsFigure(
        [
          [x, y],
          [x + b, y],
          [x + 1, y + h],
        ],
        [
          [x, y],
          [x + b, y],
        ],
      ),
    );
  },
  "Finding Volumes of Prisms and Cylinders": (rng, hard) => {
    const [r, h, a] = [rng.int(3, 9), rng.int(2, 15), rng.int(2, 9)];
    if (!hard)
      return ask(
        rng,
        `A can is a right circular cylinder with radius $${r}$ centimeters and height $${h}$ centimeters. What is its volume, in cubic centimeters?`,
        `一个罐子是底面半径 $${r}$ 厘米、高 $${h}$ 厘米的直圆柱。它的体积是多少立方厘米？`,
        pi(r * r * h),
        [pi(2 * r * h), pi(r * h), pi(4 * r * r * h)],
        `The volume is the base area times the height: $\\pi(${r})^2(${h}) = ${pi(r * r * h)}$.`,
        `体积是底面积乘以高：$\\pi(${r})^2(${h}) = ${pi(r * r * h)}$。`,
      );
    return ask(
      rng,
      `A prism's base is a right triangle with legs $${2 * a}$ and $${r}$ inches, and the prism is $${h}$ inches tall. What is its volume, in cubic inches?`,
      `一个棱柱的底面是直角边为 $${2 * a}$ 和 $${r}$ 英寸的直角三角形，棱柱高 $${h}$ 英寸。它的体积是多少立方英寸？`,
      a * r * h,
      [2 * a * r * h, a * r + h, 2 * a + r + h],
      `The base has area $\\frac{1}{2}(${2 * a})(${r}) = ${a * r}$, and multiplying by the height gives $${a * r}(${h}) = ${a * r * h}$.`,
      `底面积为 $\\frac{1}{2}(${2 * a})(${r}) = ${a * r}$，乘以高得 $${a * r}(${h}) = ${a * r * h}$。`,
    );
  },
  "Finding Volumes of Pyramids, Cones, and Spheres": (rng, hard) => {
    const [r, h, s] = [rng.int(2, 12), 3 * rng.int(1, 8), rng.int(2, 15)];
    if (!hard)
      return ask(
        rng,
        `A cone has base radius $${r}$ and height $${h}$. What is its volume?`,
        `一个圆锥底面半径为 $${r}$，高为 $${h}$。它的体积是多少？`,
        pi((r * r * h) / 3),
        [pi(r * r * h), pi((4 * r * r * h) / 3), pi((2 * r * r * h) / 3)],
        `A cone is one third of the cylinder with the same base and height: $\\frac{1}{3}\\pi(${r})^2(${h}) = ${pi((r * r * h) / 3)}$.`,
        `圆锥是同底同高圆柱的三分之一：$\\frac{1}{3}\\pi(${r})^2(${h}) = ${pi((r * r * h) / 3)}$。`,
      );
    if (s % 2 === 0)
      return ask(
        rng,
        `A sphere has radius $${r}$. What is its volume?`,
        `一个球的半径为 $${r}$。它的体积是多少？`,
        `\\frac{${4 * r ** 3}\\pi}{3}`,
        [`\\frac{${r ** 3}\\pi}{3}`, pi(4 * r * r), pi(4 * r ** 3)],
        `$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi(${r})^3 = \\frac{${4 * r ** 3}\\pi}{3}$.`,
        `$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi(${r})^3 = \\frac{${4 * r ** 3}\\pi}{3}$。`,
      );
    return ask(
      rng,
      `A pyramid has a square base of side $${s}$ and a height of $${h}$. What is its volume?`,
      `一个棱锥底面是边长 $${s}$ 的正方形，高为 $${h}$。它的体积是多少？`,
      (s * s * h) / 3,
      [s * s * h, (4 * s * s * h) / 3, (2 * s * s * h) / 3],
      `A pyramid is one third of the base area times the height: $\\frac{1}{3}(${s * s})(${h}) = ${(s * s * h) / 3}$.`,
      `棱锥体积是底面积乘以高的三分之一：$\\frac{1}{3}(${s * s})(${h}) = ${(s * s * h) / 3}$。`,
    );
  },
  "Finding the Surface Area of a Solid": (rng, hard) => {
    const [a, b, c] = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12)];
    const edge = rng.int(2, 30);
    if (!hard)
      return ask(
        rng,
        `How many square inches of wrapping paper exactly cover a closed box $${a}$ by $${b}$ by $${c}$ inches?`,
        `恰好包住一个 $${a}$ 乘 $${b}$ 乘 $${c}$ 英寸的封闭盒子，需要多少平方英寸包装纸？`,
        2 * (a * b + b * c + a * c),
        [a * b + b * c + a * c, a * b * c, 4 * (a + b + c)],
        `The box has three pairs of matching faces, so the area is $2(${a * b} + ${b * c} + ${a * c}) = ${2 * (a * b + b * c + a * c)}$.`,
        `盒子有三对相同的面，所以面积为 $2(${a * b} + ${b * c} + ${a * c}) = ${2 * (a * b + b * c + a * c)}$。`,
      );
    return ask(
      rng,
      `A cube has a volume of $${edge ** 3}$ cubic units. What is its surface area, in square units?`,
      `一个立方体体积为 $${edge ** 3}$ 立方单位。它的表面积是多少平方单位？`,
      6 * edge * edge,
      [4 * edge * edge, edge * edge, 6 * edge],
      `The edge is the cube root of the volume, $${edge}$. Each of the $6$ faces has area $${edge * edge}$, for a total of $${6 * edge * edge}$.`,
      `棱长是体积的立方根 $${edge}$。$6$ 个面每个面积为 $${edge * edge}$，共 $${6 * edge * edge}$。`,
    );
  },
  "Applying Volume Scale Factors": (rng, hard) => {
    const [v, k, s] = [rng.int(2, 40), rng.int(2, 5), rng.int(3, 40)];
    if (!hard)
      return ask(
        rng,
        `A model of a statue holds $${v}$ ounces of metal. A similar model is $${k}$ times as tall. How many ounces of the same metal does the larger model hold?`,
        `一个雕像模型含 $${v}$ 盎司金属。一个相似的模型高度是它的 $${k}$ 倍。较大的模型含多少盎司同种金属？`,
        k ** 3 * v,
        [k * v, k * k * v, v + k ** 3],
        `Volume uses three lengths, so it scales by the cube of the factor: $${k}^3(${v}) = ${k ** 3 * v}$.`,
        `体积涉及三个长度，所以按比例因子的立方缩放：$${k}^3(${v}) = ${k ** 3 * v}$。`,
      );
    return ask(
      rng,
      `Two similar cylinders have volumes $${v}$ and $${k ** 3 * v}$. The smaller has surface area $${s}$. What is the surface area of the larger?`,
      `两个相似圆柱体积为 $${v}$ 和 $${k ** 3 * v}$。较小者表面积为 $${s}$。较大者的表面积是多少？`,
      k * k * s,
      [k * s, k ** 3 * s, s + k * k],
      `The volume ratio $${k ** 3}$ means a length factor of $${k}$, and surface area scales by its square: $${k * k}(${s}) = ${k * k * s}$.`,
      `体积比 $${k ** 3}$ 表示长度比例为 $${k}$，表面积按其平方缩放：$${k * k}(${s}) = ${k * k * s}$。`,
    );
  },
};
